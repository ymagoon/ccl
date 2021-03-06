/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  gl_creatinine_aki
 *
 *  Description:  Script used by the GL_RESULT_AKI_SUSPECTED rule in an EKS_EXEC_CCL_L template. 
 *				  This script returns a result calculated from all creatinine results on a patient 
 *				  within the last 7 days or within the last two depending on the ratio of the most
 *                recent result vs the baseline.
 *  ---------------------------------------------------------------------------------------------
 *  Author:     Yitzhak Magoon
 *  Contact:    ymagoon@gmail.com
 *  Creation Date:  09/12/2019
 *
 *  Testing: execute gl_creatinine_aki <person_id> go 
 *  ---------------------------------------------------------------------------------------------
 *  Mod#   Date      Author           Description & Requestor Information
 *  001    10/21/19  Yitzhak Magoon   Prevent invalid results from pulling into query
 *  ---------------------------------------------------------------------------------------------
*/
 
drop program gl_creatinine_aki go
create program gl_creatinine_aki

free record data
record data (
  1 min_result_7_days 		  = vc
  1 min_result_2_days 		  = vc
  1 min_result_dt_tm		  = dq8
  1 min_result_display		  = vc
  1 most_recent_result        = vc
  1 most_recent_time          = dq8
  1 ratio					  = f8
  1 diff					  = f8
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

;begin 001
declare ptcancelcd = f8 with protect, noconstant(uar_get_code_by("MEANING",8,"CANCELLED"))
declare ptinerrorspacecd = f8 with protect, noconstant(uar_get_code_by("MEANING",8,"IN ERROR"))
declare ptinerrnomutcd = f8 with protect, noconstant(uar_get_code_by("MEANING",8,"INERRNOMUT"))
declare ptinerrnoviewcd = f8 with protect, noconstant(uar_get_code_by("MEANING",8,"INERRNOVIEW"))
declare ptinerrorcd = f8 with protect, noconstant(uar_get_code_by("MEANING",8,"INERROR"))
declare ptnotdonecd = f8 with protect, noconstant(uar_get_code_by("MEANING",8,"NOT DONE"))
declare ptrejectcd = f8 with protect, noconstant(uar_get_code_by("MEANING",8,"REJECTED"))
declare ptplaceholder = f8 with protect, noconstant(uar_get_code_by("MEANING",53,"PLACEHOLDER"))
;end 001

/*******************************************************************
* Determine whether the program is called from EKS or from Discern *
*******************************************************************/
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

/*******************************************************************
* Gather all creatinine results from CE table                      *
*******************************************************************/
select
  ce.clinical_event_id
  , ce.event_id
  , ce.event_cd
  ; remove < and > from result if they exist using regular expressions
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
    ;begin 001
    and ce.valid_until_dt_tm > cnvtdatetime(curdate,curtime3) 
    and ce.view_level > 0
    and ce.publish_flag = 1
    and ce.result_status_cd not in (ptcancelcd
    							    , ptinerrorspacecd
    							    , ptinerrnomutcd
    							    , ptinerrnoviewcd
    							    , ptinerrorcd
    							    , ptnotdonecd
    							    , ptrejectcd)
    and ce.event_class_cd != ptplaceholder
    ;end 001
join ocr
  where ocr.order_id = ce.order_id
join c
  where c.container_id = ocr.container_id
    and c.drawn_dt_tm > cnvtlookbehind("7, D")
order by
  result_val
 
head report
  stat = alterlist(data->qual, 9)
  
  /* 
    min_result_display exists because results on CE are string and can contain < or > symbols
    min_result_7_days and min_result_2_days are used for mathematical calculations and 
    min_result_display is used to display the unformatted result in comments
   */
  data->min_result_7_days = result_val
  data->min_result_display = ce.result_val
  data->min_result_dt_tm = c.drawn_dt_tm
  data->all_numeric = 1
 
  ;assume most recent result is the first result
  data->most_recent_result = result_val
  data->most_recent_time = c.drawn_dt_tm
  
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
  data->qual[cnt].result_val = result_val ;used for mathematical calculations
  data->qual[cnt].result_val2 = ce.result_val ;used to display the unformatted result in comments
  data->qual[cnt].drawn_dt_tm = c.drawn_dt_tm
 
  ;the detail loops through each result to find if there are any that are more recent
  if (c.drawn_dt_tm > data->most_recent_time)
    data->most_recent_result = result_val
    data->most_recent_time = c.drawn_dt_tm
  endif
  
  /*
    This flag indicates whether ALL results in our 7 day result set are numeric. If there are alpha responses
    in our result set we need to remove them to perform the calculations. 
  */
  if (not isnumeric(result_val))
    data->all_numeric = 0
  endif
foot report
  stat = alterlist(data->qual, cnt)

with nocounter

set sz = size(data->qual,5)	

/*
  The first thing that we need to do is determine whether the most recent result is an alpha response. Results
  containing "<" or ">" (that are alpha responses) will have already been stripped out, so this logic will determine
  whether the user selected a result like "See Comment" or freetext a value. 
  
  If the most recent result is an alpha response, we immediately end the script and result NA
*/
if (not isnumeric(data->most_recent_result))
  call echo("The most recent result is an alpha response")
  
  set final_result = build(char(34),"N/A|Unable to calculate AKI Risk",char(34))
  set log_message = "The most recent result is an alpha response"
  
  go to exit_script

/*
  To perform the necessary calculations, we need to remove any and all alpha response results from our result set. 
  The following code loops through each result and removes it if it's an alpha response leaving us with a completely 
  numeric result set. 
*/

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
  
  ;reset sz after removing alpha response results
  set sz = size(data->qual,5)
endif

/*
  With our completely numeric result set we can now perform the necessary calculations. However,
  if there is only a single result left in our result set after we (potentially) removed alpha responses,
  we cannot perform the calculations and we need to result NA. 
  
  Each result is encompassed with char(34) because when @MISC is used in the EKS_RESULT_CREATE template it strips
  the quotes. This template eventually calls the EKS_T_SUBCALC script which tries to parse the result. Since the " "
  are stripped, the script fails and the result doesn't post. Therefore, we have to build the result with an extra set
  of quotes for the result to post.
 
  We are returning Result|Comment where Result is State 1, Stage 2, etc. and the Comment is a combination of values depending on 
  the scenario. The rule parses the final result using the piece() function to actually post the result and comment.
*/
if (sz < 2)
  call echo(build("There are not enough results to calculate a ratio"))
 
  set final_result = build(char(34),"N/A|Unable to calculate; this is the first serum creatinine (SCr) within 7 days",char(34))
  set log_message = "There are not enough results to calculate a ratio"

elseif (data->most_recent_result >= data->min_result_7_days)
  set data->ratio = round(cnvtreal(data->most_recent_result) / cnvtreal(data->min_result_7_days),2)
 
  call echo(build("most_recent_result is greater than or equal to min_result_7_days"))
  call echo(build("ratio=",data->ratio))
 
  if (data->ratio >= 1.50 and data->ratio <= 1.99)
    set final_result = set_final_result("Stage 1", data->min_result_display, data->min_result_dt_tm)
    set log_message = "Result is Stage 1"
  elseif (data->ratio >= 2.0 and data->ratio <= 2.99)	
    set final_result = set_final_result("Stage 2", data->min_result_display, data->min_result_dt_tm)
    set log_message = "Result is Stage 2"
  elseif (data->ratio >= 3.0)
    set final_result = set_final_result("Stage 3", data->min_result_display, data->min_result_dt_tm)
    set log_message = "Result is Stage 3"
  else
    call echo(build("ratio is <= 1.5 finding minimum result 2 day"))
    
    /*
      If the ratio of our calculation is <= 1.5 then we need to determine the minimum result from 
      the previous two days, instead of from the previous seven days, and re-calculate the ratio. 
    */
 
    select into "nl:"
      result_val = data->qual[d1.seq].result_val
      , result_val2 = data->qual[d1.seq].result_val2
      , min_result_dt_tm = data->qual[d1.seq ].drawn_dt_tm
    from
      (dummyt d1 with seq = value(size(data->qual,5)))
    plan d1 where data->qual[d1.seq].drawn_dt_tm >= cnvtlookbehind("2, D")
    order by
      result_val
    head report
      data->min_result_2_days = result_val
      data->min_result_display = result_val2
      data->min_result_dt_tm = min_result_dt_tm
    with nocounter
    
    call echo(build("min result 2 day found"))
    
    set data->diff = round(cnvtreal(data->most_recent_result) - cnvtreal(data->min_result_2_days),2)
 
    call echo(build("diff=",data->diff))
 
    if (data->diff >= 0.3)
      set final_result = set_final_result("Stage 1", data->min_result_display, data->min_result_dt_tm)
      set log_message = "Result is Stage 1"
    else
      if (cnvtreal(data->most_recent_result) > 1.3)
        set comment = build2("SCr is abnormal, but it does not meet KDIGO criteria for suspected AKI,"
 							 ," when compared to baseline SCr. Consider AKI/ATN/CKD with clinical correlation.")
 						
        set final_result = build(char(34), "Abnormal|",comment,char(34))
        set log_message = "AKI is Negative and Pt Creatinine is Abnormal"
      else
        set comment = "SCr does not meet KDIGO criteria for suspected AKI, when compared to baseline SCr."
        
        set final_result = build(char(34),"None|",comment,char(34))
        set log_message = "AKI is Negative and Pt Creatinine is Normal"
      endif
    endif ;end diff >= 0.3
  endif ;end ratio logic
endif ;end result logic

#exit_script
 
call echorecord(data)
call echo(build("final result=",final_result))
 
set retval = 100
set log_misc1 = final_result
  
/*
  Format the final_result for scenarios where the comment requires the minimum result and the drawn date/time. 
 
  The result is encompassed with char(34) because when @MISC is used in the EKS_RESULT_CREATE template it strips
  the quotes. This template eventually calls the EKS_T_SUBCALC script which tries to parse the result. Since the " "
  are stripped, the script fails and the result doesn't post. Therefore, we have to build the result with an extra set
  of quotes for the result to post.
 
  We are returning Result|Comment where Result is State 1, Stage 2, etc. and the Comment is a combination of the minimum value
  and the collected date/time for that value. The rule parses the final result to post the result and comment.
*/
subroutine(set_final_result(result = vc, min_result = vc, dt_tm = dq8) = vc)
  set comment = "SCr meets KDIGO criteria for suspected AKI. Baseline SCr used was "
  set res = build2(char(34),result,"|",comment,min_result," collected on ",format(dt_tm, "@SHORTDATETIME"),char(34))
 
  return(res)
end
 
end
go
 

