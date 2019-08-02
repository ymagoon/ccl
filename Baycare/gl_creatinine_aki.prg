/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  gl_creatinine_aki
 *
 *  Description:  Script used by the gl_result_aki rule in an EKS_EXEC_CCL_L template. This script
 *				  returns a result calculated from all creatinine results on a patient within the
 *				  last 7 days.
 *  ---------------------------------------------------------------------------------------------
 *  Author:     Yitzhak Magoon
 *  Creation Date:  06/19/2019
 *  ---------------------------------------------------------------------------------------------
 *  Mod#   Date      Author           Description & Requestor Information
 *
 *  ---------------------------------------------------------------------------------------------
*/
 
drop program gl_creatinine_aki go
create program gl_creatinine_aki

/*
  Our query is hitting the CLINICAL_EVENT table while the rule is firing with the RESULT_EVENT module. There is a timing delay
  between when the data is written on both tables, so the pause fixes that. The query was written this way to avoid the complexity
  of dealing with the PERFORM_RESULT table.
*/
 
call pause(2)
 
free record data
record data (
  1 min_result_7_days 		  = vc
  1 min_result_2_days 		  = vc
  1 min_result_display		  = vc
  1 most_recent_result_7_days = vc
  1 most_recent_time_7_days   = dq8
  1 min_result_dt_tm		  = dq8
  1 all_numeric				  = i2
 
  1 qual[*]
    2 clinical_event_id 	  = f8
    2 order_id 				  = f8
    2 event_id 				  = f8
    2 event_cd 				  = f8
    2 result_val			  = vc
    2 result_val2			  = vc
    2 drawn_dt_tm = dq8
)

declare in_personid = f8 
declare final_result = vc
declare creatinine_cd = f8 with constant(uar_get_code_by_cki("CKI.CODEVALUE!1317533"))
declare pc_creat_cd = f8 with constant(uar_get_code_by_cki("CKI.CODEVALUE!1566274"))
declare pc_creat_istat_cd = f8 with constant(uar_get_code_by("DISPLAYKEY",72,"PCCREATISTAT"))

;determine whether script executed from CCL or EKS
set partype = reflect(parameter(1,0))

if (partype = " ")
  if (validate(link_template,0) = 0)
    set in_personid = trigger_personid
  else
    set in_personid = link_personid
  endif
else
  set in_personid = $1
  
  call echo(build2("Script called from CCL, person_id = ", in_personid))
endif

  
call echo(build("running select statement..."))
 
select
  ce.clinical_event_id
  , ce.event_id
  , ce.event_cd
  ; remove < and > from result if they exist
  , result_val = if (operator(ce.result_val,"REGEXPLIKE","(<|>)"))
  				   substring(2, size(ce.result_val,1) - 1, ce.result_val)
  				 else
  				   ce.result_val
  				 endif
  , ce.order_id
  , c.drawn_dt_tm
from
  clinical_event ce
  , container c
  , order_container_r ocr
plan ce
  where ce.person_id = in_personid
    and ce.event_cd in (creatinine_cd,pc_creat_cd,pc_creat_istat_cd)
join ocr
  where ocr.order_id = ce.order_id
join c
  where c.container_id = ocr.container_id
    and c.drawn_dt_tm > cnvtlookbehind("7, D")
order by
  result_val
 
head report
  stat = alterlist(data->qual, 9)
  
  data->min_result_7_days = result_val
  data->min_result_display = ce.result_val
  data->min_result_dt_tm = c.drawn_dt_tm
  data->all_numeric = 1
 
  ;assume most recent result is the first result
  data->most_recent_result_7_days = result_val
  data->most_recent_time_7_days = c.drawn_dt_tm
  
  cnt = 0
detail
  cnt = cnt + 1
  
  if (size(data->qual,5) > cnt)
    stat = alterlist(data->qual, cnt + 10)
  endif
 
  data->qual[cnt].clinical_event_id = ce.clinical_event_id
  data->qual[cnt].event_id = ce.event_id
  data->qual[cnt].order_id = ce.order_id
  data->qual[cnt].event_cd = ce.event_cd
  data->qual[cnt].result_val = result_val
  data->qual[cnt].result_val2 = ce.result_val
  data->qual[cnt].drawn_dt_tm = c.drawn_dt_tm
 
  ;the detail loops through the rest of the results to find if there are any that are more recent
  if (c.drawn_dt_tm > data->most_recent_time_7_days)
    data->most_recent_result_7_days = result_val
    data->most_recent_time_7_days = c.drawn_dt_tm
  endif
foot report
  stat = alterlist(data->qual, cnt)

with nocounter

set sz = size(data->qual,5)	

;first, we need to determine whether the most recent result is an alpha response
if (not isnumeric(data->most_recent_result_7_days))
  call echo("The most recent result is an alpha response")
  
  set final_result = build(char(34),"N/A|Unable to calculate AKI Risk",char(34))
  set log_message = "The most recent result is an alpha response"
  
  go to exit_script

;next, if any alpha responses exist and they aren't the most recent result, we want to remove them from calculations
elseif (not data->all_numeric)
  call echo("One of the results is not numeric, we need to remove it")
  
  ;remove all alpha responses from list
  set res_cnt = 1
  while (res_cnt <= sz)
    if (not isnumeric(data->qual[res_cnt].result_val))
      set stat = alterlist(data->qual, sz  - 1, res_cnt - 1)
      set sz = sz - 1
    else
      set res_cnt = res_cnt + 1
    endif
  endwhile
  
  set sz = size(data->qual,5)
endif

;we only want to do calculations when there is more than one result
if (sz < 2)
  call echo(build("There are not enough results to calculate a ratio"))
 
  set final_result = build(char(34),"N/A|Unable to calculate AKI Risk sz=",sz,char(34))
  set log_message = "There are not enough results to calculate a ratio"

elseif (data->most_recent_result_7_days >= data->min_result_7_days)
  set ratio = round(cnvtreal(data->most_recent_result_7_days) / cnvtreal(data->min_result_7_days),1)
 
  call echo(build("most_recent_result_7_days is greater than or equal to min_result_7_days"))
  call echo(build("ratio=",ratio))
 
  if (ratio >= 1.5 and ratio <= 1.9)
    set final_result = set_final_result("Stage 1", data->min_result_display, data->min_result_dt_tm)
    set log_message = "Result is Stage 1"
  elseif (ratio >= 2.0 and ratio <= 2.9)	
    set final_result = set_final_result("Stage 2", data->min_result_display, data->min_result_dt_tm)
    set log_message = "Result is Stage 2"
  elseif (ratio >= 3.0)
    set final_result = set_final_result("Stage 3", data->min_result_display, data->min_result_dt_tm)
    set log_message = "Result is Stage 3"
  else
    call echo(build("ratio is <= 1.5 finding minimum result 2 day"))
 
    select into "nl:"
      result_val = data->qual[d1.seq].result_val
      , result_val2 = data->qual[d1.seq].result_val2
    from
      (dummyt d1 with seq = value(size(data->qual,5)))
    plan d1 where data->qual[d1.seq].drawn_dt_tm >= cnvtlookbehind("2, D")
    order by
      result_val
    head report
      data->min_result_2_days = result_val
      data->min_result_display = result_val2
    with nocounter
 
    call echo(build("min result 2 day found"))
 
    set diff = round(cnvtreal(data->most_recent_result_7_days) - cnvtreal(data->min_result_2_days),1)
 
    call echo(build("diff=",diff))
 
    if (diff >= 0.3)
      set final_result = set_final_result("Stage 1", data->min_result_display, data->min_result_dt_tm)
      set log_message = "Result is Stage 1"
    else
      set final_result = set_final_result("Negative", data->min_result_display, data->min_result_dt_tm)
      set log_message = "Result is Negative"
    endif
  endif
endif

#exit_script
 
call echorecord(data)
call echo(build("final result=",final_result))
 
set retval = 100
set log_misc1 = final_result
  
/*
  Format the final_result for all scenarios except when there is only a single Creatinine. When a patient only has a single
  creatinine value within the past 7 days, the final_result does not contain the minimum result or the drawn_dt_tm.
 
  The result is encompassed with char(34) because when @MISC is used in the EKS_RESULT_CREATE template it strips
  the quotes. This template eventually calls the EKS_T_SUBCALC script which tries to parse the result. Since the " "
  are stripped, the script fails and the result doesn't post. Therefore, we have to build the result with an extra set
  of quotes for the result to post.
 
  We are returning Result|Comment where Result is State 1, Stage 2, etc. and the Comment is a combination of the minimum value
  and the collected date/time for that value. The rule parses the final result to post the result and comment.
*/
subroutine(set_final_result(result = vc, min_result = vc, dt_tm = dq8) = vc)
  set comment = "Baseline Creatinine value used to calculate AKI Risk is "
  set res = build2(char(34),result,"|",comment,min_result," collected on ",format(dt_tm, "@SHORTDATETIME"),char(34))
 
  return(res)
end

subroutine(size_one(null) = i2)
  if (size(data->qual,5) = 1)
    return (1)
  else
    return (0)
  endif
end
 
end
go
 

