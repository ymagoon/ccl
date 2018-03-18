drop program rad_utl_repost_summary_2012  go
create program rad_utl_repost_summary_2012 dba

declare cnt = i4 with public, noconstant(0)
declare stat = i4 with public, noconstant(0)
declare event_choice = c1 with public, noconstant(" ")
declare start_date_string = c11 with public, noconstant(" ")
declare end_date_string = c11 with public, noconstant(" ")
declare date_mismatch = i2 with public, noconstant(0)
declare v_dt_tm_type_cd = f8 with public, noconstant(0.0)
declare v_text_type_cd = f8 with public, noconstant(0.0)
declare v_na_report_status_cd = f8 with public, noconstant(0.0)
declare v_institution_type_cd = f8 with public, noconstant(0.0)
declare v_department_type_cd = f8 with public, noconstant(0.0)
declare v_section_type_cd = f8 with public, noconstant(0.0)
declare v_subsection_type_cd = f8 with public, noconstant(0.0)
declare v_exam_complete_time = vc with public, noconstant(" ")
declare maxdata1 = i4 with public, noconstant(0)
declare maxdata2 = i4 with public, noconstant(0)
declare mindate = i4 with public, noconstant(99999999)
declare maxdate = i4 with public, noconstant(0)
declare code_set = i4 with public, noconstant(0)
declare code_value = f8 with public, noconstant(0.0)
declare cdf_meaning = c12 with public, noconstant(fillstring(12," "))

#START_OVER

call clear(1,1)
call box( 2,1,23,80 )
call text(1, 10, "Radiology Powervision Summary Table Update Utility")
call text(6, 10, "Which event do you want to rerun?")
call text(8, 15, "1 = Exam Complete")
call text(9, 15, "2 = Transcribe")
call text(10, 15, "3 = Order Complete")
call text(11, 15, "4 = Quit")
call text(24, 04, "Selection: ")

#ACCEPT_EVENT

call accept(24, 15, "p(1);cu" where curaccept in ("1","2","3","4"))
set event_choice = curaccept
if (event_choice = "4")
    go to END_PROGRAM
elseif (event_choice = "1" or event_choice = "2" or event_choice = "3")
    go to GET_START_DATE
else
    go to ACCEPT_EVENT
endif

go to START_OVER

#GET_START_DATE

call clear(1,1)
call box(2,1,23,80)
call text(1, 10, "Radiology Powervision Summary Table Update Utility")
call text(6, 10, "Please enter a starting date. i.e. 01-MAR-2002")
call text(7, 10, "Type 'QUIT' to abort.")
call text(9, 10, "Start date: ")

#ACCEPT_START_DATE

call accept(9, 22, "p(11);cu")
set start_date_string = curaccept

if (start_date_string = "QUIT")
    go to START_OVER
else
    set start_date = cnvtdatetime(concat(start_date_string," 00:00:00.00"))
    if (start_date > 0)
        set date_ind = "S"
        go to VERIFY_DATE
    else
        go to GET_START_DATE
    endif
endif

go to GET_START_DATE

#GET_END_DATE

call clear(1,1)
call box(2,1,23,80)
call text(1, 10, "Radiology Powervision Summary Table Update Utility")
if (date_mismatch = 1)
    set date_mismatch = 0
    call text(4, 10,
    "END DATE MUST BE GREATER THAN OR EQUAL TO START DATE")
endif
call text(6, 10, "Please enter an ending date. i.e. 01-MAR-2002")
call text(7, 10, "Type 'QUIT' to abort.")
call text(9, 10, "End date: ")

#ACCEPT_END_DATE

call accept(9, 20, "p(11);cu")
set end_date_string = curaccept

if (end_date_string = "QUIT")
    go to START_OVER
else
    set end_date = cnvtdatetime(concat(end_date_string," 23:59:59.99"))
    if (end_date > 0)
        set date_ind = "E"
        go to VERIFY_DATE
    else
        go to GET_END_DATE
    endif
endif

go to GET_END_DATE

#VERIFY_DATE

if (date_ind = "S")
    call text(15,10,
concat("You entered a starting date of ",format(start_date,"@SHORTDATE"),"."))
    call text(16,10,"Is this correct? Y or N ")
    call accept(16,35,"p(1);cu" where curaccept in ("Y","N"))
    if (curaccept = "Y")
        go to GET_END_DATE
    else
        go to GET_START_DATE
    endif
else
    call text(15,10,
concat("You entered an ending date of ",format(end_date,"@SHORTDATE"),"."))
    call text(16,10,"Is this correct? Y or N ")
    call accept(16,35,"p(1);cu" where curaccept in ("Y","N"))
    if (curaccept = "Y")
        if (cnvtdatetime(end_date) > cnvtdatetime(start_date))
            go to GOT_INFO
        else
            set date_mismatch = 1
            go to GET_END_DATE
        endif
    else
        go to GET_END_DATE
    endif
endif

#GOT_INFO

/******************************************************************************
 hold new date to be inserted into omf_date
******************************************************************************/
free set new_dt
record new_dt
( 1 dt_nbr= i4
1 date_str= c10
1 day_of_month= i4
1 day_of_week= i4
1 last_day_of_month_ind = i2
1 month = i4
1 quarter= i4
1 weekday_ind= i2
1 year= i4
1 month_year_str= c10
1 nbr_days_in_month= i2
)

/******************************************************************************
 index days in each month by month number
******************************************************************************/
set days_in_month[12] = 0
set stat = initarray(days_in_month, 0)
set days_in_month[1]= 31
set days_in_month[2]= 28
set days_in_month[3]= 31
set days_in_month[4]= 30
set days_in_month[5]= 31
set days_in_month[6]= 30
set days_in_month[7]= 31
set days_in_month[8]= 31
set days_in_month[9]= 30
set days_in_month[10] = 31
set days_in_month[11] = 30
set days_in_month[12] = 31

set days_n_quarter = 91

subroutine dt_nbr_check(i_dt_nbr)
/******************************************************************************
 Insure the GENERATED date nbr exists in the omf_date table
******************************************************************************/
if ((i_dt_nbr != NULL) and (i_dt_nbr != -1) and (i_dt_nbr != 0))
/******************************************************************************
 date value does not exist in omf_date therefor we must add it to maintain
 referential integrity
 load it into memory for now and prepare it for insert later
******************************************************************************/
 set v_dt_tm = cnvtdatetime(i_dt_nbr, 0)
 set new_dt->dt_nbr= i_dt_nbr
 set new_dt->date_str= format(v_dt_tm, "YYYY-MM-DD;;D")
 set new_dt->year = year(v_dt_tm)
 set new_dt->month= month(v_dt_tm)
 set new_dt->day_of_month = day(v_dt_tm)
 set new_dt->day_of_week= weekday(v_dt_tm)
 if (new_dt->day_of_week = 0 or new_dt->day_of_week = 6)
set new_dt->weekday_ind = 0
 else
set new_dt->weekday_ind = 1
 endif
 set v_month = new_dt->month
 if (v_month = 2)
if (is_leap_year(new_dt->year) = 1)
set days_in_month[2] = 29
else
set days_in_month[2] = 28
endif
 endif
 if (new_dt->day_of_month = days_in_month[v_month] )
set new_dt->last_day_of_month_ind = 1
 else
set new_dt->last_day_of_month_ind = 0
 endif
 set q1_start = cnvtdatetime(build("01-JAN-",
year(v_dt_tm), " 00:00:00"))
 set q2_start = datetimeadd(q1_start, days_n_quarter)
 set q3_start = datetimeadd(q2_start, days_n_quarter)
 set q4_start = datetimeadd(q3_start, days_n_quarter)
 if (v_dt_tm >= q4_start)
set new_dt->quarter = 4
 elseif (v_dt_tm >= q3_start)
set new_dt->quarter = 3
 elseif (v_dt_tm >= q2_start)
set new_dt->quarter = 2
 elseif (v_dt_tm >= q1_start and v_dt_tm < q2_start)
set new_dt->quarter = 1
 else
set new_dt->quarter = 0
 endif

 set new_dt->month_year_str = format(v_dt_tm, 'yyyy-mmm;;d')
 set new_dt->nbr_days_in_month = days_in_month[v_month]

 insert into omf_date od
 set od.dt_nbr= new_dt->dt_nbr,
od.date_str = new_dt->date_str,
od.year= new_dt->year,
od.quarter= new_dt->quarter,
od.month = new_dt->month,
od.day_of_month= new_dt->day_of_month,
od.day_of_week= new_dt->day_of_week,
od.last_day_of_month_ind= new_dt->last_day_of_month_ind,
od.weekday_ind= new_dt->weekday_ind,
od.month_year_str= new_dt->month_year_str,
od.nbr_days_in_month= new_dt->nbr_days_in_month
	,od.updt_dt_tm = cnvtdatetime(curdate, curtime3),  ;JTW 
        od.updt_id = 9319490,  ;JTW
	od.updt_task = 2100013,  ;JTW
	od.updt_applctx = 888.51250,  ;JTW
	od.updt_cnt = od.updt_cnt + 1  ;JTW
 with nocounter

 commit

/******************************************************************************
 else dt_nbr already existed
******************************************************************************/
;endif
endif
end
/******************************************************************************
 end dt_nbr_check
******************************************************************************/

subroutine is_leap_year(year_in)
/******************************************************************************
 Is the year_in a leap_year?
 If year_in is a leap year then 1 is returned otherwise 0 is returned
******************************************************************************/
if((mod(year_in, 4) = 0)
and ((mod(year_in, 100) != 0)
or(mod(year_in, 400) = 0)))
return(1)
else
return(0)
endif
end
/******************************************************************************
 end is_leap_year
******************************************************************************/

subroutine omf_build_dt_nbr(i_dt_tm)
/******************************************************************************
 construct foriegn key to omf_date table
******************************************************************************/
if (i_dt_tm = NULL or i_dt_tm = 0)
return(NULL)
else
set temp_dt_nbr = cnvtdate(i_dt_tm)
;call dt_nbr_check(temp_dt_nbr) ;insure temp_dt_nbr exists in omf_date
return(temp_dt_nbr)
endif
end
/******************************************************************************
 end build_omf_dt_nbr
******************************************************************************/

subroutine omf_build_min_nbr(i_dt_tm)
/******************************************************************************
 construct foriegn key to omf_time table
******************************************************************************/
if (i_dt_tm = NULL or i_dt_tm = 0)
return(NULL)
else
set temp_min_nbr = cnvtmin(cnvtint(format(i_dt_tm,"HHMM;1;M"))) + 1
return(temp_min_nbr)
endif
end
/******************************************************************************
 end build_omf_min_nbr
******************************************************************************/

set code_set = 289
set cdf_meaning = "11"
execute cpm_get_cd_for_cdf
set v_dt_tm_type_cd = code_value

set cdf_meaning = "1"
execute cpm_get_cd_for_cdf
set v_text_type_cd = code_value

set code_set = 14202
set cdf_meaning = "NA"
execute cpm_get_cd_for_cdf
set v_na_report_status_cd = code_value

set code_set = 223
set cdf_meaning = "INSTITUTION"
execute cpm_get_cd_for_cdf
set v_institution_type_cd = code_value

set cdf_meaning = "DEPARTMENT"
execute cpm_get_cd_for_cdf
set v_department_type_cd = code_value

set cdf_meaning = "SECTION"
execute cpm_get_cd_for_cdf
set v_section_type_cd = code_value

set cdf_meaning = "SUBSECTION"
execute cpm_get_cd_for_cdf
set v_subsection_type_cd = code_value

;***********************************************
; OMF_FUNCTION
;***********************************************
if ('Z' = validate(omf_function->v_func[1].v_func_name, 'Z'))
set cnt= 0

set trace recpersist

free set omf_function
record omf_function
(
 1 v_func[*]
2 v_func_name= c40
2 v_dtype= c10
)

select into "nl:"
 function_name= function_name,
 dtype= return_dtype
from omf_function
detail
cnt = cnt + 1
stat = alterlist(omf_function->v_func, cnt)

omf_function->v_func[cnt].v_func_name = trim(function_name)
omf_function->v_func[cnt].v_dtype= trim(dtype)
with nocounter

set trace norecpersist

endif

;********************************************
; Declare all of the functions used by OMF
;********************************************
if (size(omf_function->v_func, 5) > 0)
for (x = 1 to size(omf_function->v_func, 5))
set v_declare = fillstring(100, " ")
set v_declare = concat("declare ",
trim(omf_function->v_func[x].v_func_name),
"() = ", trim(omf_function->v_func[x].v_dtype),
" GO")
 call parser(trim(v_declare))
endfor
endif

;********************************************
; OMF_STES
;********************************************
if (-1 = validate(omf_stes->product[1].product_cd, -1))
set v_prodcnt = 0
set cnt= 0

set trace recpersist

free set omf_stes
record omf_stes
(
 1 product[*]
2 product_cd= f8
2 data[*]
3 script_order = i4
3 request_script= vc
3 qualify_script= vc
3 qualify_multiple_ind = i2
3 calc_when_qual_ind= i2
3 calc_script= vc
3 calc_st_script= vc
)

select into "nl:"
 stes.product_cd,
 stes.script_order,
 stes.request_script,
 stes.qualify_script,
 stes.qualify_multiple_ind,
 stes.calc_when_qual_ind,
 stes.calc_script,
 stes.calc_st_script
from omf_st_engine_scripts stes
 order by stes.product_cd, stes.script_order

head stes.product_cd
 cnt= 0
 v_prodcnt = v_prodcnt + 1
 stat = alterlist(omf_stes->product, v_prodcnt)
 omf_stes->product[v_prodcnt].product_cd= stes.product_cd

detail
 cnt = cnt + 1
 stat = alterlist(omf_stes->product[v_prodcnt]->data, cnt)
 omf_stes->product[v_prodcnt]->data[cnt].script_order =
stes.script_order
 omf_stes->product[v_prodcnt]->data[cnt].request_script =
stes.request_script
 omf_stes->product[v_prodcnt]->data[cnt].qualify_script =
stes.qualify_script
 omf_stes->product[v_prodcnt]->data[cnt].qualify_multiple_ind =
stes.qualify_multiple_ind
 omf_stes->product[v_prodcnt]->data[cnt].calc_when_qual_ind =
stes.calc_when_qual_ind
 omf_stes->product[v_prodcnt]->data[cnt].calc_script =
stes.calc_script
 omf_stes->product[v_prodcnt]->data[cnt].calc_st_script =
stes.calc_st_script

foot stes.product_cd
 row +0
with nocounter

set trace norecpersist
endif

;**********************************************
; OMF_STFS
;**********************************************
if (-1 = validate(omf_stfs->product[1].product_cd, -1))
set v_prodcnt = 0
set cnt= 0

set trace recpersist

free set omf_stfs
record omf_stfs
(
 1 product[*]
2 product_cd= f8
2 data[*]
3 script_order= i4
3 st_fill_script = vc
)

select into "nl:"
 stfs.product_cd,
 stfs.script_order,
 stfs.st_fill_script
from omf_st_fill_scripts stfs
 order by stfs.product_cd, stfs.script_order
head stfs.product_cd
 cnt= 0
 v_prodcnt = v_prodcnt + 1
 stat = alterlist(omf_stfs->product, v_prodcnt)
 omf_stfs->product[v_prodcnt].product_cd= stfs.product_cd
detail
 cnt = cnt + 1
 stat = alterlist(omf_stfs->product[v_prodcnt]->data, cnt)
 omf_stfs->product[v_prodcnt]->data[cnt].script_order =
stfs.script_order
 omf_stfs->product[v_prodcnt]->data[cnt].st_fill_script =
stfs.st_fill_script
with nocounter

set trace norecpersist
endif

;*********************************************************************
; Declare all request structures needed by all products by running the
; REQUEST_SCRIPTs
;*********************************************************************
if ("-1" = validate(omf_str->data[1]->rs_string, "-1"))
set v_rscnt= 0
set cnt = 0

set trace recpersist

free set omf_str
record omf_str
(
 1 req_structure[*]
2 rs_name= c255
2 data[*]
3 rs_string= c255
)

select into "nl:"
 ostr.request_structure_name,
 ostr.rs_seq,
 ostr.rs_string
from omf_st_request ostr
 order by ostr.request_structure_name,
ostr.rs_seq ;VERY IMPORTANT ORDERING

head ostr.request_structure_name
 cnt = 0
 v_rscnt= v_rscnt + 1
 stat= alterlist(omf_str->req_structure, v_rscnt)

 omf_str->req_structure[v_rscnt].rs_name =
ostr.request_structure_name

detail
 cnt = cnt + 1
 stat = alterlist(omf_str->req_structure[v_rscnt]->data,cnt)

 omf_str->req_structure[v_rscnt]->data[cnt].rs_string =
ostr.rs_string

foot ostr.request_structure_name
 row +0

with nocounter

set trace norecpersist
endif

;**********************************************
; OMF_ACTION_PRODUCT
;**********************************************
if (-1 = validate(omf_action_product->data[1].log_id_type_cd, -1))
set cnt = 0

set trace recpersist

free set omf_action_product
record omf_action_product
(
1 data[*]
2 log_id_type_cd= f8
2 product_cd= f8
2 num_loop = f8
)

select into 'nl:'
oap.log_id_type_cd,
oap.product_cd
from omf_action_product oap
detail
cnt = cnt + 1
stat = alterlist(omf_action_product->data, cnt)
omf_action_product->data[cnt].log_id_type_cd =
oap.log_id_type_cd
omf_action_product->data[cnt].product_cd =
oap.product_cd
with nocounter

set trace norecpersist
endif

;*********************************************
; Declare record structures
;*********************************************
for (v_rscnt = 1 to size(omf_str->req_structure, 5))
set v_str_num_ind = 0
call parser (concat("set v_str_num_ind = validate(",
trim(omf_str->req_structure[v_rscnt].rs_name),
"->test, -1) GO"))

;*********************************************
; Declare the record structures if they have not already been declared
;*********************************************
if (v_str_num_ind = -1)

for (i= 1 to size(omf_str->req_structure[v_rscnt]->data, 5))
 call parser(concat(omf_str->req_structure[v_rscnt]->data[i].rs_string))
endfor
 endif
endfor

 set cnt = 0

record dt_nbr
(
1 qual[*]
    2 nbr = i4
    2 exists_ind = i2
)

;************************************************
; ...DO NOT MODIFY ABOVE THIS LINE
;************************************************
if (event_choice = "1")
;************************************************
; Exam Completes - REQUEST 400155 OR 400101
;************************************************

;****************************************************************************************
; Retrieve information from order_radiology
;****************************************************************************************
free set omf_rad_ex_comp
record omf_rad_ex_comp
(
1 qual[*]
2 report_status_cd = f8
2 text_required_ind = i2
2 exam_required_ind = i2
2 update_ind = i2
2 exists_ind = i2
2 num1 = f8 ;order_id
2 num2 = f8 ;patient_id
2 num3 = f8 ;order_phys_id
2 num4 = f8 ;encntr_type_cd
2 num5 = f8 ;exam_room_cd
2 num6 = f8 ;catalog_cd
2 num7 = f8 ;priority_cd
2 num8 = f8 ;institution_cd
2 num9 = f8 ;department_cd
2 num10 = f8 ;section_cd
2 num11 = f8 ;subsection_cd
2 num13 = i4 ;exam complete hour
2 num14 = i4 ;exam complete day
2 num15 = i2 ;credit_ind
2 num16 = i4 ;procedure type flag
2 num17 = f8 ;encntr_id
2 num18 = i4 ;order_dt_nbr
2 num19 = i4 ;order_min_nbr
2 num20 = i4 ;start_dt_nbr
2 num21 = i4 ;start_min_nbr
2 num22 = i4 ;exam_complete_dt_nbr
2 num23 = i4 ;exam_complete_min_nbr
2 num24 = i4 ;sched_dt_nbr   kd
2 num25 = i4 ;sched_min_nbr  kd
2 char1 = c25 ;accession_nbr
2 char2 = c10 ;exam complete month
2 date1 = c25 ;order_dt_tm
2 date2 = c25 ;start_dt_tm
2 date3 = c25 ;ex_comp_dt_tm
2 date4  =c25; sched_dt_tm   kd
2 sConfirmDtTm  = c25
2 lConfirmDtNbr = i4  
2 lConfirmMinNbr = i4
2 sRequestDtTm  = c25
2 lRequestDtNbr = i4  
2 lRequestMinNbr = i4  
2 array[2]
3 data[*]
 4 num1 = f8 ;array[1] technologist_id array[2] rad_exam_id
 4 num2 = f8 ;array[2] task_assay_cd
 4 num3 = f8 ;array[2] result_type_cd
 4 num4 = f8 ;array[2] quantity
 4 num5 = f8 ;array[2] credit_ind
)

select into "nl:"
    o.order_id
from order_radiology o,
    encounter e,
    orders ord     
plan o where
    o.complete_dt_tm between cnvtdatetime(start_date) and cnvtdatetime(end_date)
join e where
    e.encntr_id = o.encntr_id
join ord where                ;kd
  ord.order_id = o.order_id   ;kd
order by o.order_id
head report
    cnt = 0
    nbr = 1000
    stat = alterlist(omf_rad_ex_comp->qual, nbr)
detail
    cnt = cnt + 1
    if (cnt > nbr)
        nbr = nbr + 1000
        stat = alterlist(omf_rad_ex_comp->qual, nbr)
    endif
    omf_rad_ex_comp->qual[cnt]->report_status_cd = o.report_status_cd
    omf_rad_ex_comp->qual[cnt]->num1 = o.order_id
    omf_rad_ex_comp->qual[cnt]->num2 = o.person_id
    omf_rad_ex_comp->qual[cnt]->num3 = o.order_physician_id
    omf_rad_ex_comp->qual[cnt]->num4 = e.encntr_type_cd
    omf_rad_ex_comp->qual[cnt]->num6 = o.catalog_cd
    omf_rad_ex_comp->qual[cnt]->num7 = o.priority_cd
    omf_rad_ex_comp->qual[cnt]->char1 = o.accession
    ;omf_rad_ex_comp->qual[cnt]->date1 =
       ; format(o.request_dt_tm, "dd-mmm-yyyy hh:mm:ss.cc;;d")
    omf_rad_ex_comp->qual[cnt]->date2 =
        format(o.start_dt_tm, "dd-mmm-yyyy hh:mm:ss.cc;;d")
    omf_rad_ex_comp->qual[cnt]->date3 =
        format(o.complete_dt_tm, "dd-mmm-yyyy hh:mm:ss.cc;;d")
    omf_rad_ex_comp->qual[cnt]->num17 = o.encntr_id

 
        ;kd Start
     omf_rad_ex_comp->qual[cnt]->date1= format(ord.orig_order_dt_tm, "dd-mmm-yyyy hh:mm:ss.cc;;d")  
       if(o.request_dt_tm != null)
            omf_rad_ex_comp->qual[cnt]->sRequestDtTm  = format(o.request_dt_tm, "dd-mmm-yyyy hh:mm:ss.cc;;d")
           ; omf_rad_ex_comp->qual[cnt]->lRequestTz = ord_rad.requested_tz
       endif        
        ;kd End



foot report
    stat = alterlist(omf_rad_ex_comp->qual,cnt)
with nocounter

call echo(build('Number to process:',size(omf_rad_ex_comp->qual,5)))

select into "nl:"
    ptr.catalog_cd
from profile_task_r ptr,
    discrete_task_assay dta,
    (dummyt d with seq = value(size(omf_rad_ex_comp->qual,5)))
plan d
join ptr where
    ptr.catalog_cd = omf_rad_ex_comp->qual[d.seq]->num6 and
    ptr.pending_ind = 1
join dta where
    dta.task_assay_cd = ptr.task_assay_cd
detail
    if (dta.default_result_type_cd = v_dt_tm_type_cd)
        omf_rad_ex_comp->qual[d.seq]->exam_required_ind = 1
    endif
    if (dta.default_result_type_cd = v_text_type_cd)
        omf_rad_ex_comp->qual[d.seq]->text_required_ind = 1
    endif
with nocounter

select into "nl:"
    re.service_resource_cd
from rad_exam re,
    (dummyt d with seq = value(size(omf_rad_ex_comp->qual,5)))
plan d
join re where
    re.order_id = omf_rad_ex_comp->qual[d.seq]->num1 and
    re.exam_sequence = 1
detail
    omf_rad_ex_comp->qual[d.seq]->num5 = re.service_resource_cd
with nocounter

/******kd* - getting scheduledconfirmed info******/
select into "nl:"
             eac.action_dt_tm
         from
               sch_event_attach eat,
    		sch_event se,
    		sch_event_action eac,
               (dummyt d with seq = value(size(omf_rad_ex_comp->qual,5)))
            plan d 
     	join eat where
                eat.order_id = omf_rad_ex_comp->qual[d.seq]->num1
         	and eat.state_meaning = "ACTIVE"
         join se where
         	se.sch_event_id = eat.sch_event_id
          join eac where
            eac.sch_event_id = se.sch_event_id
 
           and (
                  (eac.action_meaning in ('CONFIRM')
                  and eac.req_action_cd = 0.0)
          )

detail
 omf_rad_ex_comp->qual[d.seq]->date4  = format(eac.action_dt_tm, "dd-mmm-yyyy hh:mm:ss.cc;;d")
with nocounter


/*kd*  - end scheduledconfirmed info*/




/*kd getting scheduled info**/

select into "nl:"
             eac.action_dt_tm
         from
               sch_event_attach eat,
    		sch_event se,
    		sch_event_action eac,
               (dummyt d with seq = value(size(omf_rad_ex_comp->qual,5)))
            plan d 
     	join eat where
                eat.order_id = omf_rad_ex_comp->qual[d.seq]->num1
         	and eat.state_meaning = "ACTIVE"
         join se where
         	se.sch_event_id = eat.sch_event_id
          join eac where
            eac.sch_event_id = se.sch_event_id
 
          and (
                        (eac.action_meaning in ('SCHEDULE','CONFIRM','CANCEL','NOSHOW','CHECKIN','CHECKOUT','HOLD')
                        and eac.req_action_cd = 0.0)  or
                       (eac.action_meaning = 'REQUEST' and eac.req_action_cd = 2058)
                    )


detail
 omf_rad_ex_comp->qual[d.seq]->sConfirmDtTm  = format(eac.action_dt_tm, "dd-mmm-yyyy hh:mm:ss.cc;;d")
with nocounter

/*kd end scheduled ingo */
;****************************************
; Get service resource info
;****************************************

select into "nl:"
    rg.parent_service_resource_cd
from resource_group rg,
    (dummyt d with seq = value(size(omf_rad_ex_comp->qual,5)))
plan d
join rg where
    rg.child_service_resource_cd = omf_rad_ex_comp->qual[d.seq]->num5 and
    rg.resource_group_type_cd = v_subsection_type_cd and
    rg.active_ind = 1
detail
    omf_rad_ex_comp->qual[d.seq]->num11 = rg.parent_service_resource_cd
with nocounter

select into "nl:"
    rg.parent_service_resource_cd
from resource_group rg,
    (dummyt d with seq = value(size(omf_rad_ex_comp->qual,5)))
plan d
join rg where
    rg.child_service_resource_cd = omf_rad_ex_comp->qual[d.seq]->num11 and
    rg.resource_group_type_cd = v_section_type_cd and
    rg.active_ind = 1
detail
    omf_rad_ex_comp->qual[d.seq]->num10 = rg.parent_service_resource_cd
with nocounter

select into "nl:"
    rg.parent_service_resource_cd
from resource_group rg,
    (dummyt d with seq = value(size(omf_rad_ex_comp->qual,5)))
plan d
join rg where
    rg.child_service_resource_cd = omf_rad_ex_comp->qual[d.seq]->num10 and
    rg.resource_group_type_cd = v_department_type_cd and
    rg.active_ind = 1
detail
    omf_rad_ex_comp->qual[d.seq]->num9 = rg.parent_service_resource_cd
with nocounter

select into "nl:"
    rg.parent_service_resource_cd
from resource_group rg,
    (dummyt d with seq = value(size(omf_rad_ex_comp->qual,5)))
plan d
join rg where
    rg.child_service_resource_cd = omf_rad_ex_comp->qual[d.seq]->num9 and
    rg.resource_group_type_cd = v_institution_type_cd and
    rg.active_ind = 1
detail
    omf_rad_ex_comp->qual[d.seq]->num8 = rg.parent_service_resource_cd
with nocounter

for (x = 1 to size(omf_rad_ex_comp->qual,5))
    set omf_rad_ex_comp->qual[x]->num18 = omf_build_dt_nbr(cnvtdatetime(omf_rad_ex_comp->qual[x]->date1))
    set omf_rad_ex_comp->qual[x]->num19 = omf_build_min_nbr(cnvtdatetime(omf_rad_ex_comp->qual[x]->date1))
    set omf_rad_ex_comp->qual[x]->num20 = omf_build_dt_nbr(cnvtdatetime(omf_rad_ex_comp->qual[x]->date2))
    set omf_rad_ex_comp->qual[x]->num21 = omf_build_min_nbr(cnvtdatetime(omf_rad_ex_comp->qual[x]->date2))
    set omf_rad_ex_comp->qual[x]->num22 = omf_build_dt_nbr(cnvtdatetime(omf_rad_ex_comp->qual[x]->date3))
    set omf_rad_ex_comp->qual[x]->num23 = omf_build_min_nbr(cnvtdatetime(omf_rad_ex_comp->qual[x]->date3))


    set omf_rad_ex_comp->qual[x]->num24 = omf_build_dt_nbr(cnvtdatetime(omf_rad_ex_comp->qual[x]->date4))  ;kd
    set omf_rad_ex_comp->qual[x]->num25 = omf_build_min_nbr(cnvtdatetime(omf_rad_ex_comp->qual[x]->date4)) ;kd


    set omf_rad_ex_comp->qual[x]->lRequestDtNbr  = omf_build_dt_nbr(cnvtdatetime(omf_rad_ex_comp->qual[x]->sRequestDtTm)) ;kd
    set omf_rad_ex_comp->qual[x]->lRequestMinNbr = omf_build_min_nbr(cnvtdatetime(omf_rad_ex_comp->qual[x]->sRequestDtTm)) ;kd
    if (omf_rad_ex_comp->qual[x]->sConfirmDtTm !=NULL)       
    	set omf_rad_ex_comp->qual[x]->lConfirmDtNbr =omf_build_dt_nbr(cnvtdatetime(omf_rad_ex_comp->qual[x]->sConfirmDtTm))  ;kd
	set omf_rad_ex_comp->qual[x]->lConfirmMinNbr=omf_build_min_nbr(cnvtdatetime(omf_rad_ex_comp->qual[x]->sConfirmDtTm))  ;kd      
    endif

    If((reqinfo->updt_req = 950093) or
    (reqinfo->updt_app = 400037))
        set omf_rad_ex_comp->qual[x]->num15 = 1
    else
        set omf_rad_ex_comp->qual[x]->num15 = 0
    endif
    if ((omf_rad_ex_comp->qual[x]->exam_required_ind = 1) and
        (omf_rad_ex_comp->qual[x]->text_required_ind = 0) and
(omf_rad_ex_comp->qual[x]->report_status_cd = v_na_report_status_cd))
        set omf_rad_ex_comp->qual[x]->num16 = 1 ;EXAM ONLY
    else
        set omf_rad_ex_comp->qual[x]->num16 = 0
    endif
    set omf_rad_ex_comp->qual[x]->num13 = -1
    set v_exam_complete_time = fillstring(200," ")
    set omf_rad_ex_comp->qual[x]->num14 = -1
    set v_exam_complete_time = concat(substring(13,02,omf_rad_ex_comp->qual[x]->date3),
        substring(16,02,omf_rad_ex_comp->qual[x]->date3))
    if (size(trim(v_exam_complete_time)) > 0)
        set omf_rad_ex_comp->qual[x]->num13 = hour(cnvtint(v_exam_complete_time))
        set omf_rad_ex_comp->qual[x]->num14 = weekday(cnvtdatetime(omf_rad_ex_comp->qual[x]->date3))
        set omf_rad_ex_comp->qual[x]->char2 = substring(04,03,omf_rad_ex_comp->qual[x]->date3)
    endif
    set stat = alterlist(omf_rad_ex_comp->qual[x]->array[1]->data, 10)
    set stat = alterlist(omf_rad_ex_comp->qual[x]->array[2]->data, 10)
    if (omf_rad_ex_comp->qual[x]->num18 < mindate and
    omf_rad_ex_comp->qual[x]->num18 > 0)
        set mindate = omf_rad_ex_comp->qual[x]->num18
    endif
    if (omf_rad_ex_comp->qual[x]->num18 > maxdate)
        set maxdate = omf_rad_ex_comp->qual[x]->num18
    endif
    if (omf_rad_ex_comp->qual[x]->num20 < mindate and
    omf_rad_ex_comp->qual[x]->num20 > 0)
        set mindate = omf_rad_ex_comp->qual[x]->num20
    endif
    if (omf_rad_ex_comp->qual[x]->num20 > maxdate)
        set maxdate = omf_rad_ex_comp->qual[x]->num20
    endif
    if (omf_rad_ex_comp->qual[x]->num22 < mindate and
    omf_rad_ex_comp->qual[x]->num22 > 0)
        set mindate = omf_rad_ex_comp->qual[x]->num22
    endif
    if (omf_rad_ex_comp->qual[x]->num22 > maxdate)
        set maxdate = omf_rad_ex_comp->qual[x]->num22
    endif
endfor

call echo(build("mindate:",mindate))
call echo(build("maxdate:",maxdate))
set stat = alterlist(dt_nbr->qual,(maxdate - mindate + 1))

for (x = 1 to size(dt_nbr->qual,5))
    set dt_nbr->qual[x]->nbr = x + mindate - 1
endfor

select into "nl:"
    od.dt_nbr
from omf_date od,
    (dummyt d with seq = value(size(dt_nbr->qual,5)))
plan d
join od where
    od.dt_nbr = dt_nbr->qual[d.seq]->nbr
detail
    dt_nbr->qual[d.seq]->exists_ind = 1
with nocounter

for (x = 1 to size(dt_nbr->qual,5))
    if (dt_nbr->qual[x]->exists_ind = 0)
        set stat = dt_nbr_check(dt_nbr->qual[x]->nbr)
    endif
endfor

free set dt_nbr

;****************************************************************************************
; Get technologist information
;****************************************************************************************
select distinct into "nl:"
    rep.exam_prsnl_id
from rad_exam re,
    rad_exam_prsnl rep,
    (dummyt d with seq = value(size(omf_rad_ex_comp->qual,5)))
plan d
join re where
    re.order_id = omf_rad_ex_comp->qual[d.seq]->num1
join rep where
    rep.rad_exam_id = re.rad_exam_id
order by re.order_id
head re.order_id
    cnt = 0
    nbr = 10
    stat = alterlist(omf_rad_ex_comp->qual[d.seq]->array[1]->data,nbr)
detail
    cnt = cnt + 1
    if (cnt > nbr)
        nbr = nbr + 10
        stat = alterlist(omf_rad_ex_comp->qual, nbr)
    endif
    omf_rad_ex_comp->qual[d.seq]->array[1]->data[cnt]->num1 = rep.exam_prsnl_id
foot re.order_id
    stat = alterlist(omf_rad_ex_comp->qual[d.seq]->array[1]->data,cnt)
with nocounter





;****************************************************************************************
; Get the detail level information
;****************************************************************************************
select into "nl:"
    re.rad_exam_id
from rad_exam re,
    discrete_task_assay dta,
    (dummyt d with seq = value(size(omf_rad_ex_comp->qual,5)))
plan d
join re where
    re.order_id = omf_rad_ex_comp->qual[d.seq]->num1 and
    re.complete_dt_tm != NULL
join dta where
    dta.task_assay_cd = re.task_assay_cd
order by re.order_id
head re.order_id
    cnt = 0
    nbr = 10
        stat = alterlist(omf_rad_ex_comp->qual[d.seq]->array[2]->data,nbr)
detail
    cnt = cnt + 1
    if (cnt > nbr)
        nbr = nbr + 10
        stat = alterlist(omf_rad_ex_comp->qual[d.seq]->array[2]->data, nbr)
    endif
    omf_rad_ex_comp->qual[d.seq]->array[2]->data[cnt]->num1 = re.rad_exam_id
    omf_rad_ex_comp->qual[d.seq]->array[2]->data[cnt]->num2 = re.task_assay_cd
    omf_rad_ex_comp->qual[d.seq]->array[2]->data[cnt]->num3 =dta.default_result_type_cd
    omf_rad_ex_comp->qual[d.seq]->array[2]->data[cnt]->num4 = re.quantity
    omf_rad_ex_comp->qual[d.seq]->array[2]->data[cnt]->num5 = re.credit_ind
foot re.order_id
    stat = alterlist(omf_rad_ex_comp->qual[d.seq]->array[2]->data,cnt)
with nocounter

select into "nl:"
    o.order_id
from omf_radmgmt_order_st o,
    (dummyt d with seq = value(size(omf_rad_ex_comp->qual,5)))
plan d
join o where
    o.order_id = omf_rad_ex_comp->qual[d.seq]->num1
detail
    omf_rad_ex_comp->qual[d.seq]->update_ind = 1
with nocounter

set maxdata1 = 0
set maxdata2 = 0
for (x = 1 to size(omf_rad_ex_comp->qual,5))
    if (size(omf_rad_ex_comp->qual[x]->array[1]->data,5) > maxdata1)
        set maxdata1 = size(omf_rad_ex_comp->qual[x]->array[1]->data,5)
    endif
    if (size(omf_rad_ex_comp->qual[x]->array[2]->data,5) > maxdata2)
        set maxdata2 = size(omf_rad_ex_comp->qual[x]->array[2]->data,5)
    endif
endfor

for (x = 1 to cnvtint(size(omf_rad_ex_comp->qual,5) / 5000) + 1)
    update into omf_radmgmt_order_st o,
        (dummyt d with seq = value(size(omf_rad_ex_comp->qual,5)))
    set o.patient_id = omf_rad_ex_comp->qual[d.seq]->num2,
        o.order_phys_id = omf_rad_ex_comp->qual[d.seq]->num3,
        o.priority_cd = omf_rad_ex_comp->qual[d.seq]->num7,
        o.exam_room_cd = omf_rad_ex_comp->qual[d.seq]->num5,
        o.subsection_cd = omf_rad_ex_comp->qual[d.seq]->num11,
        o.section_cd = omf_rad_ex_comp->qual[d.seq]->num10,
        o.perf_dept_cd = omf_rad_ex_comp->qual[d.seq]->num9,
        o.perf_inst_cd = omf_rad_ex_comp->qual[d.seq]->num8,
        o.catalog_cd = omf_rad_ex_comp->qual[d.seq]->num6,
        o.accession_nbr = omf_rad_ex_comp->qual[d.seq]->char1,
        o.exam_comp_credit_qty =
            evaluate(cnvtstring(omf_rad_ex_comp->qual[d.seq]->num15),'1',1,0),
        o.exam_complete_qty = 1,
        o.exam_complete_hour = omf_rad_ex_comp->qual[d.seq]->num13,
        o.exam_complete_day = omf_rad_ex_comp->qual[d.seq]->num14,
        o.exam_complete_month = omf_rad_ex_comp->qual[d.seq]->char2,
        o.order_dt_tm = cnvtdatetime(omf_rad_ex_comp->qual[d.seq]->date1),
        o.start_dt_tm = cnvtdatetime(omf_rad_ex_comp->qual[d.seq]->date2),
        o.exam_complete_dt_tm = cnvtdatetime(omf_rad_ex_comp->qual[d.seq]->date3),
        o.procedure_type_flag = omf_rad_ex_comp->qual[d.seq]->num16,
        o.encntr_id = omf_rad_ex_comp->qual[d.seq]->num17,
        o.order_dt_nbr = omf_rad_ex_comp->qual[d.seq]->num18,
        o.order_min_nbr = omf_rad_ex_comp->qual[d.seq]->num19,
        o.start_dt_nbr = omf_rad_ex_comp->qual[d.seq]->num20,
        o.start_min_nbr = omf_rad_ex_comp->qual[d.seq]->num21,
        o.exam_complete_dt_nbr = omf_rad_ex_comp->qual[d.seq]->num22,
        o.exam_complete_min_nbr = omf_rad_ex_comp->qual[d.seq]->num23,
        o.sched_dt_tm 		  = cnvtdatetime(omf_rad_ex_comp->qual[d.seq]->date4),  ;kd			
        o.sched_dt_nbr		  = omf_rad_ex_comp->qual[d.seq]->num24,	           ;kd			
        o.sched_min_nbr		  = omf_rad_ex_comp->qual[d.seq]->num25,	           ;kd		 	

         o.sched_confirm_dt_tm = cnvtdatetime(omf_rad_ex_comp->qual[d.seq]->sConfirmDtTm ) ,
         ;sched_confirm_Tz= omf_rad_ex_comp->lConfirmTz,
         o.sched_confirm_dt_nbr= omf_rad_ex_comp->qual[d.seq]->lConfirmDtNbr ,
         o.sched_confirm_min_nbr= omf_rad_ex_comp->qual[d.seq]->lConfirmMinNbr , 
         o.request_dt_tm = cnvtdatetime(omf_rad_ex_comp->qual[d.seq]->sRequestDtTm),
        ; request_tz =omf_rad_ex_comp->qual[d.seq]->lRequestTz ,
         o.request_dt_nbr = omf_rad_ex_comp->qual[d.seq]->lRequestDtNbr ,
         o.request_min_nbr = omf_rad_ex_comp->qual[d.seq]->lRequestMinNbr ,


        o.updt_dt_tm = cnvtdatetime(curdate, curtime3),
        o.updt_id = 0,
        o.updt_task = 950069,
        o.updt_applctx = 0,
        o.updt_cnt = o.updt_cnt + 1
    plan d where
        omf_rad_ex_comp->qual[d.seq]->update_ind = 1 and
        d.seq > ((x * 5000) - 5000) and
        d.seq <= (x * 5000)
    join o where
        o.order_id = omf_rad_ex_comp->qual[d.seq]->num1
    with nocounter

    insert into omf_radmgmt_order_st o,
        (dummyt d with seq = value(size(omf_rad_ex_comp->qual,5)))
    set o.order_id = omf_rad_ex_comp->qual[d.seq]->num1,
        o.patient_id = omf_rad_ex_comp->qual[d.seq]->num2,
        o.order_phys_id = omf_rad_ex_comp->qual[d.seq]->num3,
        o.encntr_type_cd = omf_rad_ex_comp->qual[d.seq]->num4,
        o.priority_cd = omf_rad_ex_comp->qual[d.seq]->num7,
        o.exam_room_cd = omf_rad_ex_comp->qual[d.seq]->num5,
        o.subsection_cd = omf_rad_ex_comp->qual[d.seq]->num11,
        o.section_cd = omf_rad_ex_comp->qual[d.seq]->num10,
        o.perf_dept_cd = omf_rad_ex_comp->qual[d.seq]->num9,
        o.perf_inst_cd = omf_rad_ex_comp->qual[d.seq]->num8,
        o.catalog_cd = omf_rad_ex_comp->qual[d.seq]->num6,
        o.accession_nbr = omf_rad_ex_comp->qual[d.seq]->char1,
        o.exam_comp_credit_qty =
            evaluate(cnvtstring(omf_rad_ex_comp->qual[d.seq]->num15),'1',1,0),
        o.exam_complete_qty = 1,
        o.exam_complete_hour = omf_rad_ex_comp->qual[d.seq]->num13,
        o.exam_complete_day = omf_rad_ex_comp->qual[d.seq]->num14,
        o.exam_complete_month = omf_rad_ex_comp->qual[d.seq]->char2,
        o.order_dt_tm = cnvtdatetime(omf_rad_ex_comp->qual[d.seq]->date1),
        o.start_dt_tm = cnvtdatetime(omf_rad_ex_comp->qual[d.seq]->date2),
        o.exam_complete_dt_tm = cnvtdatetime(omf_rad_ex_comp->qual[d.seq]->date3),
        o.procedure_type_flag = omf_rad_ex_comp->qual[d.seq]->num16,
        o.encntr_id = omf_rad_ex_comp->qual[d.seq]->num17,
        o.order_dt_nbr = omf_rad_ex_comp->qual[d.seq]->num18,
        o.order_min_nbr = omf_rad_ex_comp->qual[d.seq]->num19,
        o.start_dt_nbr = omf_rad_ex_comp->qual[d.seq]->num20,
        o.start_min_nbr = omf_rad_ex_comp->qual[d.seq]->num21,
        o.exam_complete_dt_nbr = omf_rad_ex_comp->qual[d.seq]->num22,
        o.exam_complete_min_nbr = omf_rad_ex_comp->qual[d.seq]->num23,
        o.sched_dt_nbr		  = omf_rad_ex_comp->qual[d.seq]->num24,	           ;kd			
        o.sched_min_nbr		  = omf_rad_ex_comp->qual[d.seq]->num25,	           ;kd		 	

         o.sched_confirm_dt_tm = cnvtdatetime(omf_rad_ex_comp->qual[d.seq]->sConfirmDtTm ) ,  ;kd
         ;sched_confirm_Tz= omf_rad_ex_comp->qual[d.seq]->lConfirmTz,
         o.sched_confirm_dt_nbr= omf_rad_ex_comp->qual[d.seq]->lConfirmDtNbr ,           ;kd
         o.sched_confirm_min_nbr= omf_rad_ex_comp->qual[d.seq]->lConfirmMinNbr ,          ;kd
         o.request_dt_tm = cnvtdatetime(omf_rad_ex_comp->qual[d.seq]->sRequestDtTm),      ;kd
        ; request_tz =omf_rad_ex_comp->qual[d.seq]->lRequestTz ,                      ;kd
         o.request_dt_nbr = omf_rad_ex_comp->qual[d.seq]->lRequestDtNbr ,             ;kd
         o.request_min_nbr = omf_rad_ex_comp->qual[d.seq]->lRequestMinNbr ,           ;kd
        o.updt_dt_tm = cnvtdatetime(curdate, curtime3),  ;JTW
        o.updt_id = 9319490,  ;JTW
	o.updt_task = 2100013,  ;JTW
	o.updt_applctx = 888.51250,  ;JTW
	o.updt_cnt = o.updt_cnt + 1  ;JTW

    plan d where
        omf_rad_ex_comp->qual[d.seq]->update_ind = 0 and
        d.seq > ((x * 5000) - 5000) and
        d.seq <= (x * 5000)
    join o
    with nocounter

;Begin logging records to be deleted JTW
;Header
select into "/cerner/ops_share/mhcrt/rad_utl_repost_summary_data1_DEL_LOG.dat"
                       "report_status_cd",
                       "text_required_ind",
                       "exam_required_ind",
                       "update_ind",
                       "exists_ind",
                       "order_id",
                       "patient_id",
                       "order_phys_id",
                       "encntr_type_cd",
                       "exam_room_cd",
                       "catalog_cd",
                       "priority_cd",
                       "institution_cd",
                       "department_cd",
                       "section_cd",
                       "subsection_cd",
                       "exam_complete",
                       "exam_complete2",
                       "credit_ind",
                       "procedure_type",
                       "encntr_id",
                       "order_dt_nbr",
                       "order_min_nbr",
                       "start_dt_nbr",
                       "start_min_nbr",
                       "exam_complete3",
                       "exam_complete4",
                       "sched_dt_nbr",
                       "sched_min_nbr",
                       "accession_nbr",
                       "exam_complete5",
                       "order_dt_tm",
                       "start_dt_tm",
                       "ex_comp_dt_tm",
                       "sched_dt_tm",
                       "ConfirmDtTm",
                       "ConfirmDtNbr",
                       "ConfirmMinNbr",
                       "RequestDtTm",
                       "RequestDtNbr"
                from
                (dummyt d)
                With separator = "|", format
                
;records                
                select into "/cerner/ops_share/mhcrt/rad_utl_repost_summary_data1_DEL_LOG.dat"
                       omf_rad_ex_comp->array[d.seq]->report_status_cd,
                       omf_rad_ex_comp->array[d.seq]->text_required_ind,
                       omf_rad_ex_comp->array[d.seq]->exam_required_ind,
                       omf_rad_ex_comp->array[d.seq]->update_ind,
                       omf_rad_ex_comp->array[d.seq]->exists_ind,
                       omf_rad_ex_comp->array[d.seq]->num1,               ;order_id
                       omf_rad_ex_comp->array[d.seq]->num2,               ;patient_id
                       omf_rad_ex_comp->array[d.seq]->num3,               ;order_phys_id
                       omf_rad_ex_comp->array[d.seq]->num4,               ;encntr_type_cd
                       omf_rad_ex_comp->array[d.seq]->num5,               ;exam_room_cd
                       omf_rad_ex_comp->array[d.seq]->num6,               ;catalog_cd
                       omf_rad_ex_comp->array[d.seq]->num7,               ;priority_cd
                       omf_rad_ex_comp->array[d.seq]->num8,               ;institution_cd
                       omf_rad_ex_comp->array[d.seq]->num9,               ;department_cd
                       omf_rad_ex_comp->array[d.seq]->num10,              ;section_cd
                       omf_rad_ex_comp->array[d.seq]->num11,              ;subsection_cd
                       omf_rad_ex_comp->array[d.seq]->num13,              ;exam complete
                       omf_rad_ex_comp->array[d.seq]->num14,              ;exam complete
                       omf_rad_ex_comp->array[d.seq]->num15,              ;credit_ind
                       omf_rad_ex_comp->array[d.seq]->num16,              ;procedure type
                       omf_rad_ex_comp->array[d.seq]->num17,              ;encntr_id
                       omf_rad_ex_comp->array[d.seq]->num18,              ;order_dt_nbr
                       omf_rad_ex_comp->array[d.seq]->num19,              ;order_min_nbr
                       omf_rad_ex_comp->array[d.seq]->num20,              ;start_dt_nbr
                       omf_rad_ex_comp->array[d.seq]->num21,              ;start_min_nbr
                       omf_rad_ex_comp->array[d.seq]->num22,              ;exam_complete_
                       omf_rad_ex_comp->array[d.seq]->num23,              ;exam_complete_
                       omf_rad_ex_comp->array[d.seq]->num24,              ;sched_dt_nbr
                       omf_rad_ex_comp->array[d.seq]->num25,              ;sched_min_nbr
                       omf_rad_ex_comp->array[d.seq]->char1,              ;accession_nbr
                       omf_rad_ex_comp->array[d.seq]->char2,              ;exam complete
                       omf_rad_ex_comp->array[d.seq]->date1,              ;order_dt_tm
                       omf_rad_ex_comp->array[d.seq]->date2,              ;start_dt_tm
                       omf_rad_ex_comp->array[d.seq]->date3,              ;ex_comp_dt_tm
                       omf_rad_ex_comp->array[d.seq]->date4,              ;sched_dt_tm
                       omf_rad_ex_comp->array[d.seq]->sConfirmDtTm,
                       omf_rad_ex_comp->array[d.seq]->lConfirmDtNbr,
                       omf_rad_ex_comp->array[d.seq]->lConfirmMinNbr,
                       omf_rad_ex_comp->array[d.seq]->sRequestDtTm,
                       omf_rad_ex_comp->array[d.seq]->lRequestDtNbr
                from
                (dummyt d with seq = size(omf_rad_ex_comp->array,5))
                With separator = "|", format, append

;End logging records to be deleted JTW


    delete from omf_radtech_order_st rt,
        (dummyt d with seq = value(size(omf_rad_ex_comp->qual,5)))
    set rt.seq = 1
    plan d where
        d.seq > ((x * 5000) - 5000) and
        d.seq <= (x * 5000)
    join rt where
        rt.order_id = omf_rad_ex_comp->qual[d.seq]->num1
    with nocounter

    insert into omf_radtech_order_st rt,
        (dummyt d with seq = value(size(omf_rad_ex_comp->qual,5))),
        (dummyt d2 with seq = value(maxdata1))
    set rt.omf_radtech_order_st_id = seq(omf_seq, nextval),
        rt.order_id = omf_rad_ex_comp->qual[d.seq]->num1,
        rt.technologist_id = omf_rad_ex_comp->qual[d.seq]->array[1]->data[d2.seq]->num1,
        rt.updt_dt_tm = cnvtdatetime(curdate, curtime3),
        rt.updt_id = 9319490,  ;JTW
	rt.updt_task = 2100013,  ;JTW
	rt.updt_applctx = 888.51250,  ;JTW
	rt.updt_cnt = omf2.updt_cnt + 1  ;JTW

    plan d where
        d.seq > ((x * 5000) - 5000) and
        d.seq <= (x * 5000)
    join d2 where d2.seq <= size(omf_rad_ex_comp->qual[d.seq]->array[1]->data,5)
    join rt
    with nocounter

;Begin logging records to be deleted JTW
;Headers
select into "/cerner/ops_share/mhcrt/rad_utl_repost_summary_data2_DEL_LOG.dat"
                       "report_status_cd",
                       "text_required_ind",
                       "exam_required_ind",
                       "update_ind",
                       "exists_ind",
                       "order_id",
                       "patient_id",
                       "order_phys_id",
                       "encntr_type_cd",
                       "exam_room_cd",
                       "catalog_cd",
                       "priority_cd",
                       "institution_cd",
                       "department_cd",
                       "section_cd",
                       "subsection_cd",
                       "exam_complete",
                       "exam_complete2",
                       "credit_ind",
                       "procedure_type",
                       "encntr_id",
                       "order_dt_nbr",
                       "order_min_nbr",
                       "start_dt_nbr",
                       "start_min_nbr",
                       "exam_complete3",
                       "exam_complete4",
                       "sched_dt_nbr",
                       "sched_min_nbr",
                       "accession_nbr",
                       "exam_complete5",
                       "order_dt_tm",
                       "start_dt_tm",
                       "ex_comp_dt_tm",
                       "sched_dt_tm",
                       "ConfirmDtTm",
                       "ConfirmDtNbr",
                       "ConfirmMinNbr",
                       "RequestDtTm",
                       "RequestDtNbr"
                from
                (dummyt d)
                With separator = "|", format

;records                
                select into "/cerner/ops_share/mhcrt/rad_utl_repost_summary_data2_DEL_LOG.dat"
                       omf_rad_ex_comp->array[d.seq]->report_status_cd,
                       omf_rad_ex_comp->array[d.seq]->text_required_ind,
                       omf_rad_ex_comp->array[d.seq]->exam_required_ind,
                       omf_rad_ex_comp->array[d.seq]->update_ind,
                       omf_rad_ex_comp->array[d.seq]->exists_ind,
                       omf_rad_ex_comp->array[d.seq]->num1,               ;order_id
                       omf_rad_ex_comp->array[d.seq]->num2,               ;patient_id
                       omf_rad_ex_comp->array[d.seq]->num3,               ;order_phys_id
                       omf_rad_ex_comp->array[d.seq]->num4,               ;encntr_type_cd
                       omf_rad_ex_comp->array[d.seq]->num5,               ;exam_room_cd
                       omf_rad_ex_comp->array[d.seq]->num6,               ;catalog_cd
                       omf_rad_ex_comp->array[d.seq]->num7,               ;priority_cd
                       omf_rad_ex_comp->array[d.seq]->num8,               ;institution_cd
                       omf_rad_ex_comp->array[d.seq]->num9,               ;department_cd
                       omf_rad_ex_comp->array[d.seq]->num10,              ;section_cd
                       omf_rad_ex_comp->array[d.seq]->num11,              ;subsection_cd
                       omf_rad_ex_comp->array[d.seq]->num13,              ;exam complete
                       omf_rad_ex_comp->array[d.seq]->num14,              ;exam complete
                       omf_rad_ex_comp->array[d.seq]->num15,              ;credit_ind
                       omf_rad_ex_comp->array[d.seq]->num16,              ;procedure type
                       omf_rad_ex_comp->array[d.seq]->num17,              ;encntr_id
                       omf_rad_ex_comp->array[d.seq]->num18,              ;order_dt_nbr
                       omf_rad_ex_comp->array[d.seq]->num19,              ;order_min_nbr
                       omf_rad_ex_comp->array[d.seq]->num20,              ;start_dt_nbr
                       omf_rad_ex_comp->array[d.seq]->num21,              ;start_min_nbr
                       omf_rad_ex_comp->array[d.seq]->num22,              ;exam_complete_
                       omf_rad_ex_comp->array[d.seq]->num23,              ;exam_complete_
                       omf_rad_ex_comp->array[d.seq]->num24,              ;sched_dt_nbr
                       omf_rad_ex_comp->array[d.seq]->num25,              ;sched_min_nbr
                       omf_rad_ex_comp->array[d.seq]->char1,              ;accession_nbr
                       omf_rad_ex_comp->array[d.seq]->char2,              ;exam complete
                       omf_rad_ex_comp->array[d.seq]->date1,              ;order_dt_tm
                       omf_rad_ex_comp->array[d.seq]->date2,              ;start_dt_tm
                       omf_rad_ex_comp->array[d.seq]->date3,              ;ex_comp_dt_tm
                       omf_rad_ex_comp->array[d.seq]->date4,              ;sched_dt_tm
                       omf_rad_ex_comp->array[d.seq]->sConfirmDtTm,
                       omf_rad_ex_comp->array[d.seq]->lConfirmDtNbr,
                       omf_rad_ex_comp->array[d.seq]->lConfirmMinNbr,
                       omf_rad_ex_comp->array[d.seq]->sRequestDtTm,
                       omf_rad_ex_comp->array[d.seq]->lRequestDtNbr
                from
                (dummyt d with seq = size(omf_rad_ex_comp->array,5))
                With separator = "|", format, append

;End logging records to be deleted JTW




    delete from omf_radexam_st re,
        (dummyt d with seq = value(size(omf_rad_ex_comp->qual,5)))
    set re.seq = 1
    plan d where
        d.seq > ((x * 5000) - 5000) and
        d.seq <= (x * 5000)
    join re where
        re.order_id = omf_rad_ex_comp->qual[d.seq]->num1
    with nocounter

    insert into omf_radexam_st re,
        (dummyt d with seq = value(size(omf_rad_ex_comp->qual,5))),
        (dummyt d2 with seq = value(maxdata2))
    set re.order_id = omf_rad_ex_comp->qual[d.seq]->num1,
        re.rad_exam_id = omf_rad_ex_comp->qual[d.seq]->array[2]->data[d2.seq]->num1,
        re.task_assay_cd = omf_rad_ex_comp->qual[d.seq]->array[2]->data[d2.seq]->num2,
        re.result_type_cd = omf_rad_ex_comp->qual[d.seq]->array[2]->data[d2.seq]->num3,
        re.quantity =
            evaluate(cnvtstring(omf_rad_ex_comp->qual[d.seq]->array[2]->data[d2.seq]->num5), '0',
            evaluate(omf_get_cv_display(omf_rad_ex_comp->qual[d.seq]->array[2]->data[d2.seq]->num3),
                'Bill Only',
                omf_rad_ex_comp->qual[d.seq]->array[2]->data[d2.seq]->num4,1), 0),
        re.credit_quantity =
            evaluate(cnvtstring(omf_rad_ex_comp->qual[d.seq]->array[2]->data[d2.seq]->num5), '1',
            evaluate(omf_get_cv_display(omf_rad_ex_comp->qual[d.seq]->array[2]->data[d2.seq]->num3),
                'Bill Only',
                omf_rad_ex_comp->qual[d.seq]->array[2]->data[d2.seq]->num4,1), 0),
        re.updt_dt_tm = cnvtdatetime(curdate, curtime3),
        re.updt_id = 9319490,  ;JTW
	re.updt_task = 2100013,  ;JTW
	re.updt_applctx = 888.51250,  ;JTW
	re.updt_cnt = omf2.updt_cnt + 1  ;JTW
    plan d where
        d.seq > ((x * 5000) - 5000) and
        d.seq <= (x * 5000)
    join d2 where d2.seq <= size(omf_rad_ex_comp->qual[d.seq]->array[2]->data,5)
    join re
    with nocounter

    commit
endfor
free set omf_rad_ex_comp
elseif (event_choice = "2")
;**************************************************************
; Transcribes - REQUEST 950062
;**************************************************************
;***************************************************************
; Select statement to get the RAD REPORT ID (replace RAD REPORT ID below)
;***************************************************************
free set omf_rad_trnscrb
record omf_rad_trnscrb
(
1 qual[*]
2 num1 = f8 ;rad_report_id with sequence = 1
2 num2 = f8 ;parent_order_id
2 num3 = f8 ;radiologist_id
2 trans_dt_nbr = i4 ;transcribe_dt_nbr
2 trans_min_nbr = i4 ;transcribe_min_nbr
2 trans_dt_tm = c25
2 dictate_dt_tm = c25 ; dictate_dt_tm kd
2 dictate_dt_nbr = i4 ; dictate_dt_nbr kd
2 dictate_min_nbr = i4 ; dictate_min_nbr kd
2 array[2]
3 data[*]
 4 num1 = i2 ;array[1]->sequence
 4 num2 = f8 ;transcriptionist_id array[2]->order_id
 4 num3 = f8 ;nbr_lines
 4 num4 = f8 ;nbr_words
 4 num5 = f8 ;nbr_characters
 4 num6 = i4 ;orig_trans_dt_nbr
 4 num7 = i4 ;orig_trans_min_nbr
 4 num8 = i4 ;trans_dt_nbr
 4 num9 = i4 ;trans_min_nbr
 4 num10 = i4 ;dictate_dt_nbr kd
 4 num11 = i4 ;dictate_min_nbr kd
 4 date1 = c25 ;transcribe_dt_tm
 4 date2 = c25 ;orig_transcribe_dt_tm
 4 date3 = c25 ; dictate_dt_tm  kd



 4 update_ind = i2
)

select distinct into "nl:"
    rr.order_id
from rad_report rr
plan rr where
    rr.original_trans_dt_tm between cnvtdatetime(start_date) and cnvtdatetime(end_date) and
    rr.sequence = 1 and
    rr.order_id > 0
head report
    cnt = 0
    nbr = 1000
    stat = alterlist(omf_rad_trnscrb->qual,nbr)
detail
    cnt = cnt + 1
    if (cnt > nbr)
        nbr = nbr + 1000
        stat = alterlist(omf_rad_trnscrb->qual,nbr)
    endif
    omf_rad_trnscrb->qual[cnt]->num1 = rr.rad_report_id
    omf_rad_trnscrb->qual[cnt]->num2 = rr.order_id
    omf_rad_trnscrb->qual[cnt]->trans_dt_tm =
        format(rr.original_trans_dt_tm,"dd-mmm-yyyy hh:mm:ss.cc;;d")
   omf_rad_trnscrb->qual[cnt]->dictate_dt_tm =
        format(rr.dictated_dt_tm,"dd-mmm-yyyy hh:mm:ss.cc;;d")     ;kd

foot report
    stat = alterlist(omf_rad_trnscrb->qual,cnt)
with nocounter

select into "nl:"
    rrp.rad_report_id
from rad_report rr,
    rad_report_prsnl rrp,
    (dummyt d with seq = value(size(omf_rad_trnscrb->qual,5)))
plan d
join rr where
    rr.order_id = omf_rad_trnscrb->qual[d.seq]->num2
join rrp where
    rrp.rad_report_id = rr.rad_report_id and
    rrp.prsnl_relation_flag = 2 ;radiologist
order by rr.order_id, rr.sequence desc
head rr.order_id
    cnt = 0
detail
    if (cnt = 0)
        omf_rad_trnscrb->qual[d.seq]->num3 = rrp.report_prsnl_id
        cnt = 1
    endif
with nocounter

select into "nl:"
    o.order_id
from order_radiology o,
    (dummyt d with seq = value(size(omf_rad_trnscrb->qual,5)))
plan d
join o where
    o.parent_order_id = omf_rad_trnscrb->qual[d.seq]->num2
order by o.parent_order_id
head o.parent_order_id
    cnt = 0
detail
    cnt = cnt + 1
    stat = alterlist(omf_rad_trnscrb->qual[d.seq]->array[2]->data,cnt)
    omf_rad_trnscrb->qual[d.seq]->array[2]->data[cnt]->num2 = o.order_id
with nocounter

select into "nl:"
    rts.sequence
from rad_trans_stats rts,
    rad_report rr,
    (dummyt d with seq = value(size(omf_rad_trnscrb->qual,5)))
plan d
join rr where
    rr.order_id = omf_rad_trnscrb->qual[d.seq]->num2
join rts where
    rts.rad_report_id = rr.rad_report_id
order by rr.order_id,rr.sequence,rts.sequence
head rr.order_id
    cnt = 0
detail
    cnt = cnt + 1
    stat = alterlist(omf_rad_trnscrb->qual[d.seq]->array[1]->data,cnt)
    omf_rad_trnscrb->qual[d.seq]->array[1]->data[cnt]->num1 = cnt
    omf_rad_trnscrb->qual[d.seq]->array[1]->data[cnt]->num2 = rts.trans_prsnl_id
    omf_rad_trnscrb->qual[d.seq]->array[1]->data[cnt]->num3 = rts.line_cnt
    omf_rad_trnscrb->qual[d.seq]->array[1]->data[cnt]->num4 = rts.word_cnt
    omf_rad_trnscrb->qual[d.seq]->array[1]->data[cnt]->num5 = rts.char_cnt
    omf_rad_trnscrb->qual[d.seq]->array[1]->data[cnt]->date1 =
        format(rts.last_trans_dt_tm,"dd-mmm-yyyy hh:mm:ss.cc;;d")
    omf_rad_trnscrb->qual[d.seq]->array[1]->data[cnt]->date2 =
        omf_rad_trnscrb->qual[d.seq]->trans_dt_tm
with nocounter

set maxdata1 = 0
set maxdata2 = 0
for (x = 1 to size(omf_rad_trnscrb->qual,5))
    set omf_rad_trnscrb->qual[x]->trans_dt_nbr
        = omf_build_dt_nbr(cnvtdatetime(omf_rad_trnscrb->qual[x]->trans_dt_tm))
    set omf_rad_trnscrb->qual[x]->trans_min_nbr
        = omf_build_min_nbr(cnvtdatetime(omf_rad_trnscrb->qual[x]->trans_dt_tm))
  set omf_rad_trnscrb->qual[x]->dictate_dt_nbr
        = omf_build_dt_nbr(cnvtdatetime(omf_rad_trnscrb->qual[x]->dictate_dt_tm))  ;kd
    set omf_rad_trnscrb->qual[x]->dictate_min_nbr
        = omf_build_min_nbr(cnvtdatetime(omf_rad_trnscrb->qual[x]->dictate_dt_tm))  ;kd
    if (omf_rad_trnscrb->qual[x]->trans_dt_nbr < mindate and
        omf_rad_trnscrb->qual[x]->trans_dt_nbr > 0)
        set mindate = omf_rad_trnscrb->qual[x]->trans_dt_nbr
    endif
    if (omf_rad_trnscrb->qual[x]->trans_dt_nbr > maxdate)
        set maxdate = omf_rad_trnscrb->qual[x]->trans_dt_nbr
    endif
    for (y = 1 to size(omf_rad_trnscrb->qual[x]->array[1]->data,5))
        set omf_rad_trnscrb->qual[x]->array[1]->data[y]->num6
            = omf_build_dt_nbr(cnvtdatetime(omf_rad_trnscrb->qual[x]->array[1]->data[y]->date2))
        set omf_rad_trnscrb->qual[x]->array[1]->data[y]->num7
            = omf_build_min_nbr(cnvtdatetime(omf_rad_trnscrb->qual[x]->array[1]->data[y]->date2))
        set omf_rad_trnscrb->qual[x]->array[1]->data[y]->num8
            = omf_build_dt_nbr(cnvtdatetime(omf_rad_trnscrb->qual[x]->array[1]->data[y]->date1))
        set omf_rad_trnscrb->qual[x]->array[1]->data[y]->num9
            = omf_build_min_nbr(cnvtdatetime(omf_rad_trnscrb->qual[x]->array[1]->data[y]->date1))
        if (omf_rad_trnscrb->qual[x]->array[1]->data[y]->num6 < mindate and
            omf_rad_trnscrb->qual[x]->array[1]->data[y]->num6 > 0)
            set mindate = omf_rad_trnscrb->qual[x]->array[1]->data[y]->num6
        endif
        if (omf_rad_trnscrb->qual[x]->array[1]->data[y]->num6 > maxdate)
            set maxdate = omf_rad_trnscrb->qual[x]->array[1]->data[y]->num6
        endif
        if (omf_rad_trnscrb->qual[x]->array[1]->data[y]->num8 < mindate and
            omf_rad_trnscrb->qual[x]->array[1]->data[y]->num8 > 0)
            set mindate = omf_rad_trnscrb->qual[x]->array[1]->data[y]->num8
        endif
        if (omf_rad_trnscrb->qual[x]->array[1]->data[y]->num8 > maxdate)
            set maxdate = omf_rad_trnscrb->qual[x]->array[1]->data[y]->num8
        endif
    endfor
    if (size(omf_rad_trnscrb->qual[x]->array[1]->data,5) > maxdata1)
        set maxdata1 = size(omf_rad_trnscrb->qual[x]->array[1]->data,5)
    endif
    if (size(omf_rad_trnscrb->qual[x]->array[2]->data,5) > maxdata2)
        set maxdata2 = size(omf_rad_trnscrb->qual[x]->array[2]->data,5)
    endif
endfor

call echo(build("mindate:",mindate))
call echo(build("maxdate:",maxdate))
set stat = alterlist(dt_nbr->qual,(maxdate - mindate + 1))

for (x = 1 to size(dt_nbr->qual,5))
    set dt_nbr->qual[x]->nbr = x + mindate - 1
endfor

select into "nl:"
    od.dt_nbr
from omf_date od,
    (dummyt d with seq = value(size(dt_nbr->qual,5)))
plan d
join od where
    od.dt_nbr = dt_nbr->qual[d.seq]->nbr
detail
    dt_nbr->qual[d.seq]->exists_ind = 1
with nocounter

for (x = 1 to size(dt_nbr->qual,5))
    if (dt_nbr->qual[x]->exists_ind = 0)
        set stat = dt_nbr_check(dt_nbr->qual[x]->nbr)
    endif
endfor

free set dt_nbr

select into "nl:"
    o.order_id
from omf_radmgmt_order_st o,
    (dummyt d with seq = value(size(omf_rad_trnscrb->qual,5))),
    (dummyt d2 with seq = value(maxdata2))
plan d
join d2 where d2.seq <= size(omf_rad_trnscrb->qual[d.seq]->array[2]->data,5)
join o where
    o.order_id = omf_rad_trnscrb->qual[d.seq]->array[2]->data[d2.seq]->num2
detail
    omf_rad_trnscrb->qual[d.seq]->array[2]->data[d2.seq]->update_ind = 1
with nocounter

for (x = 1 to cnvtint(size(omf_rad_trnscrb->qual,5) / 5000) + 1)
    ;This step is for accession linking
    update into omf_radmgmt_order_st orm,
        (dummyt d with seq = value(size(omf_rad_trnscrb->qual,5)))
    set orm.rad_report_id = 0,
        orm.updt_dt_tm = cnvtdatetime(curdate, curtime3),
        orm.updt_id = 9319490,  ;JTW
	orm.updt_task = 2100013,  ;JTW
	orm.updt_applctx = 888.51250,  ;JTW
	orm.updt_cnt = omf2.updt_cnt + 1  ;JTW
    plan d where
        d.seq > ((x * 5000) - 5000) and
        d.seq <= (x * 5000)
    join orm where
        orm.rad_report_id = omf_rad_trnscrb->qual[d.seq]->num1
    with nocounter

    update into omf_radmgmt_order_st orm,
        (dummyt d with seq = value(size(omf_rad_trnscrb->qual,5))),
        (dummyt d2 with seq = value(maxdata2))
    set orm.radiologist_id = omf_rad_trnscrb->qual[d.seq]->num3,
        orm.rad_report_id = omf_rad_trnscrb->qual[d.seq]->num1,
        orm.transcribe_dt_tm = cnvtdatetime(omf_rad_trnscrb->qual[d.seq]->trans_dt_tm),
        orm.transcribe_dt_nbr = omf_rad_trnscrb->qual[d.seq]->trans_dt_nbr,
        orm.transcribe_min_nbr = omf_rad_trnscrb->qual[d.seq]->trans_min_nbr,
        orm.dictate_dt_tm  = cnvtdatetime(omf_rad_trnscrb->qual[d.seq]->dictate_dt_tm),   ;kd
        orm.dictate_dt_nbr  = omf_rad_trnscrb->qual[d.seq]->dictate_dt_nbr,   ;kd
        orm.dictate_min_nbr = omf_rad_trnscrb->qual[d.seq]->dictate_min_nbr,  ;kd
        orm.updt_dt_tm = cnvtdatetime(curdate, curtime3),
        orm.updt_id = 9319490,  ;JTW
	orm.updt_task = 2100013,  ;JTW
	orm.updt_applctx = 888.51250,  ;JTW
	orm.updt_cnt = omf2.updt_cnt + 1  ;JTW
    plan d where
        d.seq > ((x * 5000) - 5000) and
        d.seq <= (x * 5000)
    join d2 where
        d2.seq <= size(omf_rad_trnscrb->qual[d.seq]->array[2]->data,5) and
        omf_rad_trnscrb->qual[d.seq]->array[2]->data[d2.seq]->update_ind = 1
    join orm where
        orm.order_id = omf_rad_trnscrb->qual[d.seq]->array[2]->data[d2.seq]->num2
    with nocounter

    insert into omf_radmgmt_order_st orm,
        (dummyt d with seq = value(size(omf_rad_trnscrb->qual,5))),
        (dummyt d2 with seq = value(maxdata2))
    set orm.order_id = omf_rad_trnscrb->qual[d.seq]->array[2]->data[d2.seq]->num2,
        orm.radiologist_id = omf_rad_trnscrb->qual[d.seq]->num3,
        orm.rad_report_id = omf_rad_trnscrb->qual[d.seq]->num1,
        orm.transcribe_dt_tm = cnvtdatetime(omf_rad_trnscrb->qual[d.seq]->trans_dt_tm),
        orm.transcribe_dt_nbr = omf_rad_trnscrb->qual[d.seq]->trans_dt_nbr,
        orm.transcribe_min_nbr = omf_rad_trnscrb->qual[d.seq]->trans_min_nbr,
        orm.dictate_dt_tm  = cnvtdatetime(omf_rad_trnscrb->qual[d.seq]->dictate_dt_tm),   ;kd
        orm.dictate_dt_nbr  = omf_rad_trnscrb->qual[d.seq]->dictate_dt_nbr,   ;kd
        orm.dictate_min_nbr = omf_rad_trnscrb->qual[d.seq]->dictate_min_nbr,  ;kd
        orm.exam_complete_qty = 0,
        orm.exam_complete_hour = -1,
        orm.exam_complete_day = -1,
        orm.exam_complete_month = "-",
        orm.updt_dt_tm = cnvtdatetime(curdate, curtime3),
        orm.updt_id = 9319490,  ;JTW
	orm.updt_task = 2100013,  ;JTW
	orm.updt_applctx = 888.51250,  ;JTW
	orm.updt_cnt = omf2.updt_cnt + 1  ;JTW
    plan d where
        d.seq > ((x * 5000) - 5000) and
        d.seq <= (x * 5000)
    join d2 where
        d2.seq <= size(omf_rad_trnscrb->qual[d.seq]->array[2]->data,5) and
        omf_rad_trnscrb->qual[d.seq]->array[2]->data[d2.seq]->update_ind = 0
    join orm
    with nocounter

;Begin logging records to be deleted JTW
;Headers
                select into "/cerner/ops_share/mhcrt/rad_utl_repost_summary_data3_DEL_LOG.dat"
                       omf_rad_trnscrb->array[d.seq]->num1
                       "parent_order_id",
                       "radiologist_id",
                       "transcribe_dt_nbr",
                       "transcribe_min_nbr",
                       "trans_dt_tm",
                       "dictate_dt_tm",
                       "dictate_dt_nbr",
                       "dictate_min_nbr"
                from
                (dummyt d)
                With separator = "|", format
                
;records                
                select into "/cerner/ops_share/mhcrt/rad_utl_repost_summary_data3_DEL_LOG.dat"
                       omf_rad_trnscrb->array[d.seq]->num1,
                       omf_rad_trnscrb->array[d.seq]->num2,            ;parent_order_id
                       omf_rad_trnscrb->array[d.seq]->num3,            ;radiologist_id
                       omf_rad_trnscrb->array[d.seq]->trans_dt_nbr,    ;transcribe_dt_nbr
                       omf_rad_trnscrb->array[d.seq]->trans_min_nbr,   ;transcribe_min_nbr
                       omf_rad_trnscrb->array[d.seq]->trans_dt_tm,
                       omf_rad_trnscrb->array[d.seq]->dictate_dt_tm,   ;dictate_dt_tm kd
                       omf_rad_trnscrb->array[d.seq]->dictate_dt_nbr,  ;dictate_dt_nbr kd
                       omf_rad_trnscrb->array[d.seq]->dictate_min_nbr ;dictate_min_nbr kd
                from
                (dummyt d with seq = size(rad_report->array,5))
                With separator = "|", format, append

;End logging records to be deleted JTW


    delete from omf_radtrans_order_st o,
        (dummyt d with seq = value(size(omf_rad_trnscrb->qual,5)))
    set o.seq = 1
    plan d where
        d.seq > ((x * 5000) - 5000) and
        d.seq <= (x * 5000)
    join o where
        o.rad_report_id = omf_rad_trnscrb->qual[d.seq]->num1
    with nocounter

    insert into omf_radtrans_order_st otos,
        (dummyt d with seq = value(size(omf_rad_trnscrb->qual,5))),
        (dummyt d2 with seq = value(maxdata1))
    set otos.omf_radtrans_order_st_id = seq(omf_seq, nextval),
        otos.rad_report_id = omf_rad_trnscrb->qual[d.seq]->num1,
        otos.order_id =omf_rad_trnscrb->qual[d.seq]->num2,
        otos.rad_report_seq = omf_rad_trnscrb->qual[d.seq]->array[1]->data[d2.seq]->num1,
        otos.transcriptionist_id = omf_rad_trnscrb->qual[d.seq]->array[1]->data[d2.seq]->num2,
        otos.radiologist_id = omf_rad_trnscrb->qual[d.seq]->num3,
        otos.nbr_lines = omf_rad_trnscrb->qual[d.seq]->array[1]->data[d2.seq]->num3,
        otos.nbr_words = omf_rad_trnscrb->qual[d.seq]->array[1]->data[d2.seq]->num4,
        otos.nbr_characters = omf_rad_trnscrb->qual[d.seq]->array[1]->data[d2.seq]->num5,
        otos.orig_trans_dt_tm =
            cnvtdatetime(omf_rad_trnscrb->qual[d.seq]->array[1]->data[d2.seq]->date2),
        otos.transcribe_dt_tm =
            cnvtdatetime(omf_rad_trnscrb->qual[d.seq]->array[1]->data[d2.seq]->date1),
        otos.orig_transcribe_dt_nbr =
            omf_rad_trnscrb->qual[d.seq]->array[1]->data[d2.seq]->num6,
        otos.orig_transcribe_min_nbr =
            omf_rad_trnscrb->qual[d.seq]->array[1]->data[d2.seq]->num7,
        otos.transcribe_dt_nbr = omf_rad_trnscrb->qual[d.seq]->array[1]->data[d2.seq]->num8,
        otos.transcribe_min_nbr =omf_rad_trnscrb->qual[d.seq]->array[1]->data[d2.seq]->num9,
        otos.updt_dt_tm = cnvtdatetime(curdate, curtime3),
        otos.updt_id = 9319490,  ;JTW
	otos.updt_task = 2100013,  ;JTW
	otos.updt_applctx = 888.51250,  ;JTW
	otos.updt_cnt = omf2.updt_cnt + 1  ;JTW

    plan d where
        d.seq > ((x * 5000) - 5000) and
        d.seq <= (x * 5000)
    join d2 where
        d2.seq <= size(omf_rad_trnscrb->qual[d.seq]->array[1]->data,5)
    join otos
    with nocounter

    commit
endfor
free set omf_rad_trnscrb
elseif(event_choice = "3")
;**************************************************************
; Signout - REQUEST 455013
;**************************************************************
set trace recpersist
free set omf_rad_ord_comp1
record omf_rad_ord_comp1
(
1 qual[*]
2 update_ind = i2
2 report_status_cd = f8
2 exam_required_ind = i2
2 text_required_ind = i2
2 num1 = f8 ;order_id
2 num2 = f8 ;patient_id
2 num3 = f8 ;order_phys_id
2 num4 = f8 ;encntr_type_cd
2 num5 = f8 ;exam_room_cd
2 num6 = f8 ;catalog_cd
2 num8 = f8 ;transcriptionist_id
2 num9 = f8 ;radiologists_id
2 num10 = f8 ;priority_cd
2 num11 = f8 ;institution_cd
2 num12 = f8 ;department_cd
2 num13 = f8 ;section_cd
2 num14 = f8 ;subsection_cd
2 num15 = i4 ;exam complete hour
2 num16 = i4 ;exam complete day
2 num17 = i4 ;actual ordered to start
2 num18 = i4 ;actual start to exam complete
2 num19 = i4 ;actual exam complete to view
2 num20 = i4 ;actual view to dictate
2 num21 = i4 ;actual dictate to transcribe
2 num22 = i4 ;actual transcribe to final
2 num23 = i4 ;actual overall tat
2 num24 = i4 ;expected ordered to start
2 num25 = i4 ;expected start to exam complete
2 num26 = i4 ;expected exam complete to view
2 num27 = i4 ;expected view to dictate
2 num28 = i4 ;expected dictate to transcribe
2 num29 = i4 ;expected transcribe to final
2 num30 = i4 ;expected overall tat
2 num31 = i4 ;procedure_type_flag
2 num32 = f8 ;encntr_id
2 num33 = i4 ;order_dt_nbr
2 num34 = i4 ;order_min_nbr
2 num35 = i4 ;start_dt_nbr
2 num36 = i4 ;start_min_nbr
2 num37 = i4 ;exam_complete_dt_nbr
2 num38 = i4 ;exam_complete_min_nbr
2 num39 = i4 ;dictate_dt_nbr
2 num40 = i4 ;dictate_min_nbr
2 num41 = i4 ;transcribe_dt_nbr
2 num42 = i4 ;transcribe_min_nbr
2 num43 = i4 ;final_dt_nbr
2 num44 = i4 ;final_min_nbr
2 num45 = i4 ; sched_dt_nbr kd
2 num46 = i4 ; sched_min_nbr
2 char1 = c25 ;accession_nbr
2 char2 = c10 ;exam complete month
2 date1 = c25 ;order_dt_tm
2 date2 = c25 ;start_dt_tm
2 date3 = c25 ;ex_comp_dt_tm
2 date4 = c25 ;dictate_dt_tm
2 date5 = c25 ;transcribe_dt_tm
2 date6 = c25 ;final_dt_tm
2 date7 = c25 ; sched_dt_tm kd

;kd start

2 sConfirmDtTm  = c25 
2 lConfirmTz = i4 
2 lConfirmDtNbr =  i4
2 lConfirmMinNbr = i4
2 lActOrderConfirm = i4
2 lExpOrderConfirm = i4 
2 sRequestDtTm  = c25
2 lRequestTz = i4
2 lRequestDtNbr = i4
2 lRequestMinNbr = i4
2 lActConfirmRequest = i4
2 lExpConfirmRequest = i4

;kd end

2 array[2]
3 data[*]
 4 num1 = f8 ;array[1] technologist_id array[2] repeat_tech_id
 4 num2 = f8 ;array[2] reason_cd
 4 num3 = f8 ;array[2] film_type_cd
 4 num4 = f8 ;array[2] film_size_cd
 4 num5 = f8 ;array[2] standard_qty
 4 num6 = f8 ;array[2] waste_qty
)

free set script_request
record script_request
(
1 queue_id = f8
1 product_cd = f8
1 log_id_type_cd = f8
1 qualify_multiple_ind = i2
1 num_loop = i4
1 num1 = f8
1 num2 = f8
1 num3 = f8
1 num4 = f8
1 num5 = f8
1 char1 = c255
1 char2 = c255
1 char3 = c255
1 char4 = c255
1 char5 = c255
)

free set script_reply
record script_reply
(
1 qualified_ind = i2
1 error_message = vc
1 status_data
2 status = c1
2 subeventstatus[1]
 3 OperationName = c25
 3 OperationStatus = c1
 3 TargetObjectName = c25
 3 TargetObjectValue = vc

)
set trace norecpersist

record omf_express_list
(
1 v_express[*]
    2 v_express_num = i4
    2 v_mode_cd = f8
    2 v_ccl_string = vc
    2 v_group_num = i4
    2 v_detail_ind = i2
    2 product_cd = f8
    2 v_array_str = vc
)

record omf_event_list
(
1 v_product[*]
    2 v_product_cd = f8
    2 v_event_list[*]
        3 v_event_num = i4
        3 v_detail_ind = i2
        3 v_actual_str = vc
        3 v_exp_str = vc
        3 v_ccl_string = vc
        3 v_null_ind = i2
)

record omf_rule_list
(
1 v_product[*]
    2 v_product_cd = f8
    2 v_rule[*]
        3 v_rule_id = f8
        3 v_beg_event_num = i4
        3 v_time_blk_event_num = i4
        3 v_time_blk_beg_time = c8
        3 v_time_blk_end_time = c8
        3 v_beg_effective_dt_tm = dq8
        3 v_end_effective_dt_tm = dq8
        3 v_priority = i4
        3 v_rule_dtl[*]
            4 v_detail_ind = i2
            4 v_event_num = i4
            4 v_tat_flag = i2
            4 v_expected_tat = i4
            4 v_inby_time = c8
            4 v_outby_time = c8
            4 v_inout_add_days = i4
            4 v_dyn_stmt3 = vc
            4 v_dyn_stmt4 = vc
            4 v_dyn_stmt5 = vc
            4 v_active_days[*]
                5 v_day_of_week = i4
        3 v_time_blk_days[*]
            4 v_day_of_week = i4
        3 v_conditions[*]
            4 v_condition = i4
            4 v_condition_str = vc
            4 v_array_str = vc
            4 v_value = i4
            4 v_operand = c20
            4 v_detail_ind = i2
)

record qual_rule_request
(
1 v_rule[*]
    2 v_rule_id = f8
    2 v_qual[*]
        3 omf_rule_ndx = i2
)


record qual_request
(
1 v_product[*]
    2 v_product_cd = f8
    2 v_qual[*]
        3 v_rule_id = f8
        3 v_qualification_stmt = vc
        3 v_detail_ind = i2
        3 v_array[*]
            4 v_array_str = vc
)

select distinct into "nl:"
    o.order_id
from rad_report rr,
    order_radiology o,
    encounter e
plan rr where
    rr.final_dt_tm between cnvtdatetime(start_date) and cnvtdatetime(end_date) and
    rr.order_id > 0
join o where
    o.parent_order_id = rr.order_id
join e where
    e.encntr_id = o.encntr_id
order by o.parent_order_id
head report
    cnt = 0
    nbr = 1000
    stat = alterlist(omf_rad_ord_comp1->qual,nbr)
detail
    cnt = cnt + 1
    if (cnt > nbr)
        nbr = nbr + 1000
        stat = alterlist(omf_rad_ord_comp1->qual,nbr)
    endif
    omf_rad_ord_comp1->qual[cnt]->num1 = o.order_id
    omf_rad_ord_comp1->qual[cnt]->num2 = o.person_id
    omf_rad_ord_comp1->qual[cnt]->num3 = o.order_physician_id
    omf_rad_ord_comp1->qual[cnt]->num4 = e.encntr_type_cd
    omf_rad_ord_comp1->qual[cnt]->num6 = o.catalog_cd
    omf_rad_ord_comp1->qual[cnt]->num10 = o.priority_cd
    omf_rad_ord_comp1->qual[cnt]->char1 = o.accession
    omf_rad_ord_comp1->qual[cnt]->report_status_cd = o.report_status_cd
    omf_rad_ord_comp1->qual[cnt]->date1 =
        format(o.request_dt_tm, "dd-mmm-yyyy hh:mm:ss.cc;;d")
    omf_rad_ord_comp1->qual[cnt]->date2 =
        format(o.start_dt_tm, "dd-mmm-yyyy hh:mm:ss.cc;;d")
    omf_rad_ord_comp1->qual[cnt]->date3 =
        format(o.complete_dt_tm, "dd-mmm-yyyy hh:mm:ss.cc;;d")
    omf_rad_ord_comp1->qual[cnt]->num32 = o.encntr_id
foot report
    stat = alterlist(omf_rad_ord_comp1->qual,cnt)
with nocounter

call echo(build('Number to process:',size(omf_rad_ord_comp1->qual,5)))

if (size(omf_rad_ord_comp1->qual,5) = 0)
    go to END_PROGRAM
endif



/******kd* - getting scheduledconfirmed info******/
select into "nl:"
             eac.action_dt_tm
         from
               sch_event_attach eat,
    		sch_event se,
    		sch_event_action eac,
               (dummyt d with seq = value(size(omf_rad_ord_comp1->qual,5)))
            plan d 
     	join eat where
                eat.order_id = omf_rad_ord_comp1->qual[d.seq]->num1
         	and eat.state_meaning = "ACTIVE"
         join se where
         	se.sch_event_id = eat.sch_event_id
          join eac where
            eac.sch_event_id = se.sch_event_id
 
           and (
                  (eac.action_meaning in ('CONFIRM')
                  and eac.req_action_cd = 0.0)
          )

detail
 omf_rad_ord_comp1->qual[d.seq]->date7  = format(eac.action_dt_tm, "dd-mmm-yyyy hh:mm:ss.cc;;d")
with nocounter


/*kd*  - end scheduledconfirmed info*/




/*kd getting scheduled info**/

select into "nl:"
             eac.action_dt_tm
         from
               sch_event_attach eat,
    		sch_event se,
    		sch_event_action eac,
               (dummyt d with seq = value(size(omf_rad_ord_comp1->qual,5)))
            plan d 
     	join eat where
                eat.order_id = omf_rad_ord_comp1->qual[d.seq]->num1
         	and eat.state_meaning = "ACTIVE"
         join se where
         	se.sch_event_id = eat.sch_event_id
          join eac where
            eac.sch_event_id = se.sch_event_id
 
          and (
                        (eac.action_meaning in ('SCHEDULE','CONFIRM','CANCEL','NOSHOW','CHECKIN','CHECKOUT','HOLD')
                        and eac.req_action_cd = 0.0)  or
                       (eac.action_meaning = 'REQUEST' and eac.req_action_cd = 2058)
                    )


detail
 omf_rad_ord_comp1->qual[d.seq]->sConfirmDtTm  = format(eac.action_dt_tm, "dd-mmm-yyyy hh:mm:ss.cc;;d")
with nocounter


/*kd getting scheduled info**/


select into "nl:"
    ptr.catalog_cd
from profile_task_r ptr,
    discrete_task_assay dta,
    (dummyt d with seq = value(size(omf_rad_ord_comp1->qual,5)))
plan d
join ptr where
    ptr.catalog_cd = omf_rad_ord_comp1->qual[d.seq]->num6 and
    ptr.pending_ind = 1
join dta where
    dta.task_assay_cd = ptr.task_assay_cd
detail
    if (dta.default_result_type_cd = v_dt_tm_type_cd)
        omf_rad_ord_comp1->qual[d.seq]->exam_required_ind = 1
    endif
    if (dta.default_result_type_cd = v_text_type_cd)
        omf_rad_ord_comp1->qual[d.seq]->text_required_ind = 1
    endif
with nocounter

select into "nl:"
    re.service_resource_cd
from rad_exam re,
    (dummyt d with seq = value(size(omf_rad_ord_comp1->qual,5)))
plan d
join re where
    re.order_id = omf_rad_ord_comp1->qual[d.seq]->num1 and
    re.exam_sequence = 1
detail
    omf_rad_ord_comp1->qual[d.seq]->num5 = re.service_resource_cd
with nocounter

select into "nl:"
    rg.parent_service_resource_cd
from resource_group rg,
    (dummyt d with seq = value(size(omf_rad_ord_comp1->qual,5)))
plan d
join rg where
    rg.child_service_resource_cd = omf_rad_ord_comp1->qual[d.seq]->num5 and
    rg.resource_group_type_cd = v_subsection_type_cd and
    rg.active_ind = 1
detail
    omf_rad_ord_comp1->qual[d.seq]->num14 = rg.parent_service_resource_cd
with nocounter

select into "nl:"
    rg.parent_service_resource_cd
from resource_group rg,
    (dummyt d with seq = value(size(omf_rad_ord_comp1->qual,5)))
plan d
join rg where
    rg.child_service_resource_cd = omf_rad_ord_comp1->qual[d.seq]->num14 and
    rg.resource_group_type_cd = v_section_type_cd and
    rg.active_ind = 1
detail
    omf_rad_ord_comp1->qual[d.seq]->num13 = rg.parent_service_resource_cd
with nocounter

select into "nl:"
    rg.parent_service_resource_cd
from resource_group rg,
    (dummyt d with seq = value(size(omf_rad_ord_comp1->qual,5)))
plan d
join rg where
    rg.child_service_resource_cd = omf_rad_ord_comp1->qual[d.seq]->num13 and
    rg.resource_group_type_cd = v_department_type_cd and
    rg.active_ind = 1
detail
    omf_rad_ord_comp1->qual[d.seq]->num12 = rg.parent_service_resource_cd
with nocounter

select into "nl:"
    rg.parent_service_resource_cd
from resource_group rg,
    (dummyt d with seq = value(size(omf_rad_ord_comp1->qual,5)))
plan d
join rg where
    rg.child_service_resource_cd = omf_rad_ord_comp1->qual[d.seq]->num12 and
    rg.resource_group_type_cd = v_institution_type_cd and
    rg.active_ind = 1
detail
    omf_rad_ord_comp1->qual[d.seq]->num11 = rg.parent_service_resource_cd
with nocounter

select into "nl:"
    o.order_id
from order_radiology o,
    rad_report rr,
    rad_report_prsnl rrp,
    (dummyt d with seq = value(size(omf_rad_ord_comp1->qual,5)))
plan d
join o where o.order_id = omf_rad_ord_comp1->qual[d.seq]->num1 and
    o.parent_order_id > 0.0
join rr where
    rr.order_id = o.parent_order_id and
    rr.sequence = 1
join rrp where
    rrp.rad_report_id = rr.rad_report_id and
    rrp.prsnl_relation_flag in (0,2)
head o.order_id
    omf_rad_ord_comp1->qual[d.seq]->date4 =
        format(rr.dictated_dt_tm, "dd-mmm-yyyy hh:mm:ss.cc;;d")
    omf_rad_ord_comp1->qual[d.seq]->date5 =
        format(rr.original_trans_dt_tm, "dd-mmm-yyyy hh:mm:ss.cc;;d")
    omf_rad_ord_comp1->qual[d.seq]->date6 =
        format(rr.final_dt_tm, "dd-mmm-yyyy hh:mm:ss.cc;;d")
detail
    if (rrp.prsnl_relation_flag = 0)
        omf_rad_ord_comp1->qual[d.seq]->num8= rrp.report_prsnl_id
    elseif (rrp.prsnl_relation_flag = 2)
        omf_rad_ord_comp1->qual[d.seq]->num9= rrp.report_prsnl_id
    endif
  ;kd start
        if(o.request_dt_tm !=NULL)
            omf_rad_ord_comp1->qual[d.seq]->sRequestDtTm  = format(o.request_dt_tm, "dd-mmm-yyyy hh:mm:ss.cc;;d")
            omf_rad_ord_comp1->qual[d.seq]->lRequestTz = o.requested_tz
        endif 
        ;kd end
with nocounter

for (x = 1 to size(omf_rad_ord_comp1->qual,5))
    set omf_rad_ord_comp1->qual[x]->num33 =
        omf_build_dt_nbr(cnvtdatetime(omf_rad_ord_comp1->qual[x]->date1))
    set omf_rad_ord_comp1->qual[x]->num34 =
        omf_build_min_nbr(cnvtdatetime(omf_rad_ord_comp1->qual[x]->date1))
    set omf_rad_ord_comp1->qual[x]->num35 =
        omf_build_dt_nbr(cnvtdatetime(omf_rad_ord_comp1->qual[x]->date2))
    set omf_rad_ord_comp1->qual[x]->num36 =
        omf_build_min_nbr(cnvtdatetime(omf_rad_ord_comp1->qual[x]->date2))
    set omf_rad_ord_comp1->qual[x]->num37 =
        omf_build_dt_nbr(cnvtdatetime(omf_rad_ord_comp1->qual[x]->date3))
    set omf_rad_ord_comp1->qual[x]->num38 =
        omf_build_min_nbr(cnvtdatetime(omf_rad_ord_comp1->qual[x]->date3))
    set omf_rad_ord_comp1->qual[x]->num39 =
        omf_build_dt_nbr(cnvtdatetime(omf_rad_ord_comp1->qual[x]->date4))
    set omf_rad_ord_comp1->qual[x]->num40 =
        omf_build_min_nbr(cnvtdatetime(omf_rad_ord_comp1->qual[x]->date4))
    set omf_rad_ord_comp1->qual[x]->num41 =
        omf_build_dt_nbr(cnvtdatetime(omf_rad_ord_comp1->qual[x]->date5))
    set omf_rad_ord_comp1->qual[x]->num42 =
        omf_build_min_nbr(cnvtdatetime(omf_rad_ord_comp1->qual[x]->date5))
    set omf_rad_ord_comp1->qual[x]->num43 =
        omf_build_dt_nbr(cnvtdatetime(omf_rad_ord_comp1->qual[x]->date6))
    set omf_rad_ord_comp1->qual[x]->num44 =
        omf_build_min_nbr(cnvtdatetime(omf_rad_ord_comp1->qual[x]->date6))
    set omf_rad_ord_comp1->qual[x]->num45 =
        omf_build_dt_nbr(cnvtdatetime(omf_rad_ord_comp1->qual[x]->date7))
    set omf_rad_ord_comp1->qual[x]->num46 =
        omf_build_min_nbr(cnvtdatetime(omf_rad_ord_comp1->qual[x]->date7))
    set omf_rad_ord_comp1->qual[x]->num31 = 0

 ; kd start
if (size(trim(omf_rad_ord_comp1->qual[x]->sRequestDtTm)) > 0)             
    set omf_rad_ord_comp1->qual[x]->lRequestDtNbr = omf_build_dt_nbr(cnvtdatetime(omf_rad_ord_comp1->qual[x]->sRequestDtTm)) 
    set omf_rad_ord_comp1->qual[x]->lRequestMinNbr = omf_build_min_nbr(cnvtdatetime(omf_rad_ord_comp1->qual[x]->sRequestDtTm))
endif

 ;kd end

    if ((omf_rad_ord_comp1->qual[x]->exam_required_ind = 1) and
        (omf_rad_ord_comp1->qual[x]->text_required_ind = 0) and
    (omf_rad_ord_comp1->qual[x]->report_status_cd = v_na_report_status_cd))
        set omf_rad_ord_comp1->qual[x]->num31 = 1 ;EXAM ONLY
    endif
    if ((omf_rad_ord_comp1->qual[x]->exam_required_ind = 0) and
        (omf_rad_ord_comp1->qual[x]->text_required_ind = 1))
        set omf_rad_ord_comp1->qual[x]->num31 = 2 ;REPORT ONLY
    endif
    set omf_rad_ord_comp1->qual[x]->num15 = -1
    set omf_rad_ord_comp1->qual[x]->num16 = -1
    set omf_rad_ord_comp1->qual[x]->char2 = fillstring(1, "-")
    set v_exam_complete_time = fillstring(04, " ")
    set v_exam_complete_time = concat(substring(13, 02, omf_rad_ord_comp1->qual[x]->date3),
        substring(16, 02, omf_rad_ord_comp1->qual[x]->date3))
    if (size(trim(v_exam_complete_time)) > 0)
        set omf_rad_ord_comp1->qual[x]->num15 = hour(cnvtint(v_exam_complete_time))
        set omf_rad_ord_comp1->qual[x]->num16 =
            weekday(cnvtdatetime(omf_rad_ord_comp1->qual[x]->date3))
        set omf_rad_ord_comp1->qual[x]->char2 =
            substring(04,03,omf_rad_ord_comp1->qual[x]->date3)
    endif
    if (omf_rad_ord_comp1->qual[x]->num33 < mindate and
    omf_rad_ord_comp1->qual[x]->num33 > 0)
        set mindate = omf_rad_ord_comp1->qual[x]->num33
    endif
    if (omf_rad_ord_comp1->qual[x]->num33 > maxdate)
        set maxdate = omf_rad_ord_comp1->qual[x]->num33
    endif
    if (omf_rad_ord_comp1->qual[x]->num35 < mindate and
    omf_rad_ord_comp1->qual[x]->num35 > 0)
        set mindate = omf_rad_ord_comp1->qual[x]->num35
    endif
    if (omf_rad_ord_comp1->qual[x]->num35 > maxdate)
        set maxdate = omf_rad_ord_comp1->qual[x]->num35
    endif
    if (omf_rad_ord_comp1->qual[x]->num37 < mindate and
    omf_rad_ord_comp1->qual[x]->num37 > 0)
        set mindate = omf_rad_ord_comp1->qual[x]->num37
    endif
    if (omf_rad_ord_comp1->qual[x]->num37 > maxdate)
        set maxdate = omf_rad_ord_comp1->qual[x]->num37
    endif
    if (omf_rad_ord_comp1->qual[x]->num39 < mindate and
    omf_rad_ord_comp1->qual[x]->num39 > 0)
        set mindate = omf_rad_ord_comp1->qual[x]->num39
    endif
    if (omf_rad_ord_comp1->qual[x]->num39 > maxdate)
        set maxdate = omf_rad_ord_comp1->qual[x]->num39
    endif
    if (omf_rad_ord_comp1->qual[x]->num41 < mindate and
    omf_rad_ord_comp1->qual[x]->num41 > 0)
        set mindate = omf_rad_ord_comp1->qual[x]->num41
    endif
    if (omf_rad_ord_comp1->qual[x]->num41 > maxdate)
        set maxdate = omf_rad_ord_comp1->qual[x]->num41
    endif
    if (omf_rad_ord_comp1->qual[x]->num43 < mindate and
    omf_rad_ord_comp1->qual[x]->num43 > 0)
        set mindate = omf_rad_ord_comp1->qual[x]->num43
    endif
    if (omf_rad_ord_comp1->qual[x]->num43 > maxdate)
        set maxdate = omf_rad_ord_comp1->qual[x]->num43
    endif
endfor

call echo(build("mindate:",mindate))
call echo(build("maxdate:",maxdate))
set stat = alterlist(dt_nbr->qual,(maxdate - mindate + 1))

for (x = 1 to size(dt_nbr->qual,5))
    set dt_nbr->qual[x]->nbr = x + mindate - 1
endfor

select into "nl:"
    od.dt_nbr
from omf_date od,
    (dummyt d with seq = value(size(dt_nbr->qual,5)))
plan d
join od where
    od.dt_nbr = dt_nbr->qual[d.seq]->nbr
detail
    dt_nbr->qual[d.seq]->exists_ind = 1
with nocounter

for (x = 1 to size(dt_nbr->qual,5))
    if (dt_nbr->qual[x]->exists_ind = 0)
        set stat = dt_nbr_check(dt_nbr->qual[x]->nbr)
    endif
endfor

free set dt_nbr

select into "nl:"
    rep.exam_prsnl_id
from rad_exam re,
    rad_exam_prsnl rep,
    (dummyt d with seq = value(size(omf_rad_ord_comp1->qual,5)))
plan d
join re where
    re.order_id = omf_rad_ord_comp1->qual[d.seq]->num1
join rep where
    rep.rad_exam_id = re.rad_exam_id
order by re.order_id
head re.order_id
    cnt = 0
    nbr = 10
    stat = alterlist(omf_rad_ord_comp1->qual[d.seq]->array[1]->data,nbr)
detail
    found = 0
    for (x = 1 to size(omf_rad_ord_comp1->qual[d.seq]->array[1]->data,5))
        if (omf_rad_ord_comp1->qual[d.seq]->array[1]->data[x]->num1 = rep.exam_prsnl_id)
            found = 1
        endif
    endfor
    if (found = 0)
        cnt = cnt + 1
        if (cnt > nbr)
            nbr = nbr + 10
            stat = alterlist(omf_rad_ord_comp1->qual[d.seq]->array[1]->data,nbr)
        endif
        omf_rad_ord_comp1->qual[d.seq]->array[1]->data[cnt]->num1 = rep.exam_prsnl_id
    endif
foot re.order_id
    stat = alterlist(omf_rad_ord_comp1->qual[d.seq]->array[1]->data,cnt)
with nocounter

select into "nl:"
    rfa.responsible_id
from rad_film_adjust rfa,
    (dummyt d with seq = value(size(omf_rad_ord_comp1->qual,5)))
plan d
join rfa where
    rfa.order_id = omf_rad_ord_comp1->qual[d.seq]->num1
order by rfa.order_id
head rfa.order_id
    cnt = 0
    nbr = 10
    stat = alterlist(omf_rad_ord_comp1->qual[d.seq]->array[2]->data,nbr)
detail
    cnt = cnt + 1
    if (cnt > nbr)
        nbr = nbr + 10
        stat = alterlist(omf_rad_ord_comp1->qual[d.seq]->array[2]->data,nbr)
    endif
    omf_rad_ord_comp1->qual[d.seq]->array[2]->data[cnt]->num1 = rfa.responsible_id
    omf_rad_ord_comp1->qual[d.seq]->array[2]->data[cnt]->num2 = rfa.repeat_waste_cd
    omf_rad_ord_comp1->qual[d.seq]->array[2]->data[cnt]->num3 = rfa.film_type_cd
    omf_rad_ord_comp1->qual[d.seq]->array[2]->data[cnt]->num4 = rfa.film_size_cd
    omf_rad_ord_comp1->qual[d.seq]->array[2]->data[cnt]->num5 = rfa.std_quantity
    omf_rad_ord_comp1->qual[d.seq]->array[2]->data[cnt]->num6 = rfa.waste_quantity
foot rfa.order_id
    stat = alterlist(omf_rad_ord_comp1->qual[d.seq]->array[2]->data,cnt)
with nocounter

select into "nl:"
    o.order_id
from omf_radmgmt_order_st o,
    (dummyt d with seq = value(size(omf_rad_ord_comp1->qual,5)))
plan d
join o where
    o.order_id = omf_rad_ord_comp1->qual[d.seq]->num1
detail
    omf_rad_ord_comp1->qual[d.seq]->update_ind = 1
with nocounter

set code_value = 0
set code_set= 14135
set cdf_meaning= 'RAD EXAMCOMP'
execute cpm_get_cd_for_cdf
set script_request->product_cd = code_value

set code_value = 0
set code_set= 14246
set cdf_meaning= 'RADEXAMCOMP'
execute cpm_get_cd_for_cdf
set script_request->log_id_type_cd = code_value
set script_request->num_loop = 1

set v_expcnt= 0
declare v_num_qual = i4 with public, noconstant(0)
declare omf_qual_ndx = i4 with public, noconstant(0)

set code_value = 0
set code_set= 14135
set cdf_meaning= 'RAD ORDCOMP'
execute cpm_get_cd_for_cdf
set v_rad_product_cd = code_value

select into 'nl:'
    express_num= oed.express_num,
    mode_cd = oed.mode_cd,
    ccl_string = oed.ccl_string,
    array_str= oed.array_str,
    group_num= oed.group_num,
    detail_ind = oed.detail_ind,
    oed.product_cd
from omf_express_dictionary oed
where oed.product_cd = v_rad_product_cd
detail
    v_expcnt= v_expcnt + 1
    stat= alterlist(omf_express_list->v_express, v_expcnt)

    omf_express_list->v_express[v_expcnt].v_express_num= express_num
    omf_express_list->v_express[v_expcnt].v_mode_cd = mode_cd
    omf_express_list->v_express[v_expcnt].v_ccl_string = ccl_string
    omf_express_list->v_express[v_expcnt].v_array_str= array_str
    omf_express_list->v_express[v_expcnt].v_group_num= group_num
    omf_express_list->v_express[v_expcnt].v_detail_ind = detail_ind
    omf_express_list->v_express[v_expcnt].product_cd = oed.product_cd
with nocounter

/***************************************************************************
* Build the event array based on product_cd.
***************************************************************************/
if (size(omf_event_list->v_product, 5) = 0)

set v_ep_cnt= 0
set v_evtcnt= 0
set code_value = 0
set code_set= 14199
set cdf_meaning= 'RAD DT/TM'
set code_cnt = 1
execute cpm_get_cd_for_cdf
set v_rad_dt_tm_cd= code_value

select into 'nl:'
    omfe.product_cd,
    event_num= omfe.event_num,
    detail_ind= omfe.detail_ind,
    ccl_string= oed.ccl_string,
    event_seq= omfe.event_seq,
    actual_str= omfe.actual_tat_str,
    exp_str= omfe.exp_tat_str
from omf_events omfe, omf_express_dictionary oed
where oed.product_cd = v_rad_product_cd
    and omfe.event_num = oed.group_num
    and omfe.product_cd = oed.product_cd
    and oed.mode_cd IN (v_rad_dt_tm_cd)
    and omfe.active_ind = 1
    and omfe.product_cd != 0
order by omfe.product_cd, omfe.event_seq
head report
    stat = 0
head omfe.product_cd
    v_ep_cnt= v_ep_cnt + 1
    stat = alterlist(omf_event_list->v_product, v_ep_cnt)
    v_evtcnt= 0
    omf_event_list->v_product[v_ep_cnt].v_product_cd = omfe.product_cd
head event_seq
v_evtcnt= v_evtcnt + 1
stat = alterlist(omf_event_list->v_product[v_ep_cnt].v_event_list, v_evtcnt)
omf_event_list->v_product[v_ep_cnt].v_event_list[v_evtcnt].v_event_num= event_num
omf_event_list->v_product[v_ep_cnt].v_event_list[v_evtcnt].v_detail_ind = detail_ind
omf_event_list->v_product[v_ep_cnt].v_event_list[v_evtcnt].v_actual_str = actual_str
omf_event_list->v_product[v_ep_cnt].v_event_list[v_evtcnt].v_exp_str= exp_str
detail
if (size(trim(omf_event_list->v_product[v_ep_cnt].v_event_list[v_evtcnt].v_ccl_string), 1) > 0)
if (substring((255*(event_seq-1)),1,omf_event_list->v_product[v_ep_cnt].v_event_list[v_evtcnt].v_ccl_string) = ' ')
omf_event_list->v_product[v_ep_cnt].v_event_list[v_evtcnt].v_ccl_string =
concat(trim(omf_event_list->v_product[v_ep_cnt].v_event_list[v_evtcnt].v_ccl_string),
' ',trim(ccl_string))
else
omf_event_list->v_product[v_ep_cnt].v_event_list[v_evtcnt].v_ccl_string =
concat(trim(omf_event_list->v_product[v_ep_cnt].v_event_list[v_evtcnt].v_ccl_string),
trim(ccl_string))
endif
else
omf_event_list->v_product[v_ep_cnt].v_event_list[v_evtcnt].v_ccl_string = trim(ccl_string)
endif
with nocounter

/*************************************************************************
* Get the data for overall tat calculation
*************************************************************************/
select into 'nl:'
    omfe.product_cd,
    event_num= omfe.event_num,
    event_seq= omfe.event_seq,
    actual_str= omfe.actual_tat_str,
    exp_str= omfe.exp_tat_str
from omf_events omfe
where omfe.product_cd = v_rad_product_cd
    and omfe.active_ind = 1
    and omfe.event_num < 0
order by omfe.product_cd, omfe.event_seq

head omfe.product_cd
    v_ep_cnt= 1
    while (v_ep_cnt <= size(omf_event_list->v_product, 5)
    and omf_event_list->v_product[v_ep_cnt].v_product_cd != omfe.product_cd)
        v_ep_cnt = v_ep_cnt + 1
    endwhile

if (v_ep_cnt <= size(omf_event_list->v_product, 5))
    v_evtcnt = size(omf_event_list->v_product[v_ep_cnt].v_event_list, 5)
endif

detail
    if (v_ep_cnt <= size(omf_event_list->v_product, 5));003
    v_evtcnt = v_evtcnt + 1
    stat = alterlist(omf_event_list->v_product[v_ep_cnt].v_event_list,v_evtcnt)

    omf_event_list->v_product[v_ep_cnt].v_event_list[v_evtcnt].v_event_num= event_num
    omf_event_list->v_product[v_ep_cnt].v_event_list[v_evtcnt].v_actual_str = actual_str
    omf_event_list->v_product[v_ep_cnt].v_event_list[v_evtcnt].v_exp_str= exp_str
    endif;003
with nocounter

endif

/***************************************************************************
* Build the list of active rules.
***************************************************************************/
if (size(omf_rule_list->v_product, 5) = 0)

set v_prcnt= 0
set v_r_cnt= 0
set v_evcnt= 0

select distinct into 'nl:'
    rule_id= orl.rule_id,
    orl.product_cd,
    beg_event_num= orl.beg_event_num,
    time_blk_event_num= orl.time_blk_event_num,
    time_blk_beg_time= orl.time_blk_beg_time,
    time_blk_end_time= orl.time_blk_end_time,
    beg_effective_dt_tm = orl.beg_effective_dt_tm,
    end_effective_dt_tm = orl.end_effective_dt_tm,
    priority = orl.priority,
    event_num= ord.event_num,
    tat_flag = ord.tat_flag,
    expected_tat= ord.expected_tat,
    inby_time= ord.inby_time,
    outby_time= ord.outby_time,
    inout_add_days = ord.in_out_add_days,
    event_seq= oev.event_seq,
    detail_ind= oev.detail_ind,
    beg_detail_ind = oev1.detail_ind
from omf_rules orl,
    omf_rule_dtl ord,
    omf_events oev,
    omf_events oev1
where orl.active_ind= 1
    and orl.rule_seq= 1
    and ord.rule_id= orl.rule_id
    and oev.product_cd= v_rad_product_cd
    and oev.event_num = ord.event_num
    and oev1.product_cd= orl.product_cd
    and oev1.event_num= orl.beg_event_num
    and orl.product_cd = oev.product_cd
order by orl.product_cd, priority, rule_id, event_seq

head orl.product_cd
    v_r_cnt= 0
    v_prcnt= v_prcnt + 1
    stat= alterlist(omf_rule_list->v_product, v_prcnt)

    omf_rule_list->v_product[v_prcnt].v_product_cd= orl.product_cd

head rule_id
    v_evcnt= 0
    v_detail_ind = 0
    v_r_cnt= v_r_cnt + 1
    stat = alterlist(omf_rule_list->v_product[v_prcnt].v_rule, v_r_cnt)
    omf_rule_list->v_product[v_prcnt].v_rule[v_r_cnt].v_rule_id = rule_id
    omf_rule_list->v_product[v_prcnt].v_rule[v_r_cnt].v_beg_event_num =
        beg_event_num
    omf_rule_list->v_product[v_prcnt].v_rule[v_r_cnt].v_time_blk_event_num =
        time_blk_event_num
    omf_rule_list->v_product[v_prcnt].v_rule[v_r_cnt].v_time_blk_beg_time =
        time_blk_beg_time
    omf_rule_list->v_product[v_prcnt].v_rule[v_r_cnt].v_time_blk_end_time =
        time_blk_end_time
    omf_rule_list->v_product[v_prcnt].v_rule[v_r_cnt].v_beg_effective_dt_tm =
        beg_effective_dt_tm
    omf_rule_list->v_product[v_prcnt].v_rule[v_r_cnt].v_end_effective_dt_tm =
        end_effective_dt_tm
    omf_rule_list->v_product[v_prcnt].v_rule[v_r_cnt].v_priority = priority
detail
    v_evcnt= v_evcnt + 1
    stat = alterlist(omf_rule_list->v_product[v_prcnt].v_rule[v_r_cnt].v_rule_dtl, v_evcnt)

    if((v_evcnt = 1 and(detail_ind = 1 or beg_detail_ind = 1))
    or(v_evcnt > 1 and(detail_ind = 1 or v_detail_ind = 1)))
        omf_rule_list->v_product[v_prcnt].v_rule[v_r_cnt].v_rule_dtl[v_evcnt].v_detail_ind= 1
    else
        omf_rule_list->v_product[v_prcnt].v_rule[v_r_cnt].v_rule_dtl[v_evcnt].v_detail_ind= 0
    endif

    omf_rule_list->v_product[v_prcnt].v_rule[v_r_cnt].v_rule_dtl[v_evcnt].v_event_num =
        event_num
    omf_rule_list->v_product[v_prcnt].v_rule[v_r_cnt].v_rule_dtl[v_evcnt].v_tat_flag =
        tat_flag
    omf_rule_list->v_product[v_prcnt].v_rule[v_r_cnt].v_rule_dtl[v_evcnt].v_expected_tat =
        expected_tat
    omf_rule_list->v_product[v_prcnt].v_rule[v_r_cnt].v_rule_dtl[v_evcnt].v_inby_time =
        inby_time
    omf_rule_list->v_product[v_prcnt].v_rule[v_r_cnt].v_rule_dtl[v_evcnt].v_outby_time =
        outby_time
    omf_rule_list->v_product[v_prcnt].v_rule[v_r_cnt].v_rule_dtl[v_evcnt].v_inout_add_days =
        inout_add_days

    v_detail_ind = detail_ind
with nocounter

set stat = alterlist(qual_request->v_product,
size(omf_rule_list->v_product, 5))

for (p_ndx = 1 to size(omf_rule_list->v_product, 5))
    set v_qualcnt= 0
    set qual_request->v_product[p_ndx].v_product_cd =
    omf_rule_list->v_product[p_ndx].v_product_cd

/***********************************************************************
* Set the product code index for the event list (used in TAT calc).
***********************************************************************/
set v_ep_cnt = 1
while (v_ep_cnt <= size(omf_event_list->v_product, 5)
    and omf_event_list->v_product[v_ep_cnt].v_product_cd !=
        omf_rule_list->v_product[p_ndx].v_product_cd)
    set v_ep_cnt = v_ep_cnt + 1
endwhile

/***********************************************************************
* Get the mode code based on the product cd.
***********************************************************************/
set v_cdf_meaning = fillstring(12, ' ')

select into 'nl:'
    cdf = cv.cdf_meaning
from code_value cv
where cv.code_set = 14135
    and cv.code_value = omf_rule_list->v_product[p_ndx].v_product_cd
detail
    v_cdf_meaning = cv.cdf_meaning
with nocounter

set v_dt_tm_mode_cd= 0
set v_outby_mode_cd= 0
set v_nextoutby_mode_cd= 0
set v_time_mode_cd = 0
set v_day_mode_cd= 0
set v_dtl_mode_cd= 0
set code_value= 0
set code_set= 14199
set cdf_meaning = 'RAD DAY'
set code_cnt = 1
execute cpm_get_cd_for_cdf
set v_day_mode_cd= code_value

set code_value= 0
set code_set= 14199
set cdf_meaning = 'RAD TIME'
set code_cnt = 1
execute cpm_get_cd_for_cdf
set v_time_mode_cd = code_value

set code_value= 0
set code_set= 14199
set cdf_meaning = 'RAD DT/TM'
set code_cnt = 1
execute cpm_get_cd_for_cdf
set v_dt_tm_mode_cd= code_value

set code_value= 0
set code_set= 14199
set cdf_meaning = 'RAD OUTBY'
set code_cnt = 1
execute cpm_get_cd_for_cdf
set v_outby_mode_cd= code_value

set code_value= 0
set code_set= 14199
set cdf_meaning = 'RAD NXTOUTBY'
set code_cnt = 1
;set stat = uar_get_meaning_by_codeset(code_set,cdf_meaning,code_cnt,code_value)
execute cpm_get_cd_for_cdf
set v_nextoutby_mode_cd= code_value

for (r_ndx = 1 to size(omf_rule_list->v_product[p_ndx].v_rule, 5))
set v_tbdaycnt= 0
set v_condcnt= 0
/*********************************************************************
* Get inby/outby active days
*********************************************************************/
for (ev_ndx = 1 to
size(omf_rule_list->v_product[p_ndx].v_rule[r_ndx].v_rule_dtl, 5))
set v_iodaycnt= 0
select into 'nl:'
    io_day_of_week= oiod.day_of_week
from omf_in_out_days oiod
where oiod.rule_id=
    omf_rule_list->v_product[p_ndx].v_rule[r_ndx].v_rule_id
    and oiod.event_num = omf_rule_list->v_product[p_ndx]
        .v_rule[r_ndx].v_rule_dtl[ev_ndx].v_event_num
order by io_day_of_week asc
detail
    v_iodaycnt= v_iodaycnt + 1
    stat= alterlist(omf_rule_list->v_product[p_ndx].v_rule[r_ndx].
        v_rule_dtl[ev_ndx].v_active_days, v_iodaycnt)
    omf_rule_list->v_product[p_ndx].v_rule[r_ndx].v_rule_dtl[ev_ndx].
        v_active_days[v_iodaycnt].v_day_of_week = io_day_of_week
with nocounter
endfor

/*********************************************************************
* Get time block information
*********************************************************************/
select into 'nl:'
    tb_day_of_week= ortb.day_of_week
from omf_rule_time_blk ortb
where ortb.rule_id =
    omf_rule_list->v_product[p_ndx].v_rule[r_ndx].v_rule_id
detail
    v_tbdaycnt= v_tbdaycnt + 1
    stat = alterlist(omf_rule_list->v_product[p_ndx].v_rule[r_ndx]
        .v_time_blk_days, v_tbdaycnt)
    omf_rule_list->v_product[p_ndx].v_rule[r_ndx]
        .v_time_blk_days[v_tbdaycnt].v_day_of_week = tb_day_of_week
with nocounter

/*********************************************************************
* Get the rule conditions and their respective values.
*********************************************************************/
select into 'nl:'
    condition= oop.value1,
    operand= oop.operand,
    value2= oop.value2,
    ccl_string= oed.ccl_string,
    array_string= oed.array_str,
    detail_ind= oed.detail_ind
from omf_operand oop, omf_express_dictionary oed
plan oed
join oop
where oop.rule_id =
    omf_rule_list->v_product[p_ndx].v_rule[r_ndx].v_rule_id
and oop.value1= cnvtstring(oed.express_num)
detail
    v_condcnt = v_condcnt + 1
    stat = alterlist(omf_rule_list->v_product[p_ndx].v_rule[r_ndx]
        .v_conditions, v_condcnt)
    omf_rule_list->v_product[p_ndx].v_rule[r_ndx]
        .v_conditions[v_condcnt].v_condition = cnvtint(condition)
    omf_rule_list->v_product[p_ndx].v_rule[r_ndx]
        .v_conditions[v_condcnt].v_condition_str = ccl_string
    omf_rule_list->v_product[p_ndx].v_rule[r_ndx]
        .v_conditions[v_condcnt].v_array_str = array_string
    omf_rule_list->v_product[p_ndx].v_rule[r_ndx]
        .v_conditions[v_condcnt].v_value= cnvtint(value2)
    omf_rule_list->v_product[p_ndx].v_rule[r_ndx]
        .v_conditions[v_condcnt].v_operand = operand
    omf_rule_list->v_product[p_ndx].v_rule[r_ndx]
        .v_conditions[v_condcnt].v_detail_ind = detail_ind
with nocounter

/*********************************************************************
* Build the qualification select statements for each rule.
*********************************************************************/
set v_arraycnt= 0
set v_qualcnt= v_qualcnt + 1
set stat = alterlist(qual_request->v_product[p_ndx].v_qual, v_qualcnt)

set qual_request->v_product[p_ndx].v_qual[v_qualcnt].v_rule_id=
omf_rule_list->v_product[p_ndx].v_rule[r_ndx].v_rule_id

set qual_request->v_product[p_ndx].v_qual[v_qualcnt]
    .v_qualification_stmt =
    'set v_rule_qual_rule_id = assign(v_rule_qual_rule_id, '

set v_curr_condition= 0
set v_last_condition= 0
set v_detail_ind= 0
for (c_ndx = 1 to size(omf_rule_list->v_product[p_ndx]
    .v_rule[r_ndx].v_conditions, 5))
set v_operand = fillstring(20, ' ')
set v_curr_condition = omf_rule_list->v_product[p_ndx].v_rule[r_ndx]
.v_conditions[c_ndx].v_condition

/*******************************************************************
* If the operand is '=', set the include_ind = 1; otherwise, 0
* (exclude)
*******************************************************************/
if (trim(omf_rule_list->v_product[p_ndx].v_rule[r_ndx]
.v_conditions[c_ndx].v_operand) = '=')
    set v_operand = 'in'
else
    set v_operand = 'not in'
endif

if (v_detail_ind = 0)
    set v_detail_ind = omf_rule_list->v_product[p_ndx].v_rule[r_ndx]
    .v_conditions[c_ndx].v_detail_ind
endif

if (size(trim(omf_rule_list->v_product[p_ndx].v_rule[r_ndx]
    .v_conditions[c_ndx].v_array_str),1) = 0)
 /*****************************************************************
 * Add the correct and/or operand along with parenthesis.
 *****************************************************************/
if (v_curr_condition = v_last_condition)
set qual_request->v_product[p_ndx].v_qual[v_qualcnt]
    .v_qualification_stmt =
    concat(trim(qual_request->v_product[p_ndx].v_qual[v_qualcnt]
    .v_qualification_stmt), ', ',
    trim(cnvtstring(omf_rule_list->v_product[p_ndx]
    .v_rule[r_ndx].v_conditions[c_ndx].v_value)))
elseif (v_last_condition != 0)
    set qual_request->v_product[p_ndx].v_qual[v_qualcnt]
    .v_qualification_stmt =
    concat(trim(qual_request->v_product[p_ndx].v_qual[v_qualcnt]
    .v_qualification_stmt), ')) and (',
    trim(omf_rule_list->v_product[p_ndx].v_rule[r_ndx]
    .v_conditions[c_ndx].v_condition_str), ' ',
    trim(v_operand), ' (',
    trim(cnvtstring(omf_rule_list->v_product[p_ndx]
    .v_rule[r_ndx].v_conditions[c_ndx].v_value)))
else
    set qual_request->v_product[p_ndx].v_qual[v_qualcnt]
    .v_qualification_stmt =
    concat(trim(qual_request->v_product[p_ndx].v_qual[v_qualcnt]
    .v_qualification_stmt),
    ' if ((',
    trim(omf_rule_list->v_product[p_ndx].v_rule[r_ndx]
    .v_conditions[c_ndx]. v_condition_str), ' ',
    trim(v_operand), ' (',
    trim(cnvtstring(omf_rule_list->v_product[p_ndx]
    .v_rule[r_ndx].v_conditions[c_ndx].v_value)))
endif

else
/*****************************************************************
* Build the array qualification SELECT stmt.
*****************************************************************/
if (v_curr_condition = v_last_condition)
    set qual_request->v_product[p_ndx].v_qual[v_qualcnt]
    .v_array[v_arraycnt].v_array_str =
    concat(trim(qual_request->v_product[p_ndx].v_qual[v_qualcnt]
    .v_array[v_arraycnt].v_array_str),
    ' OR ',
    trim(cnvtstring(omf_rule_list->v_product[p_ndx]
    .v_rule[r_ndx].v_conditions[c_ndx].v_value)), ' ',
    trim(omf_rule_list->v_product[p_ndx].v_rule[r_ndx]
    .v_conditions[c_ndx].v_operand), ' ',
    trim(omf_rule_list->v_product[p_ndx].v_rule[r_ndx]
    .v_conditions[c_ndx].v_array_str),
    '[d1.seq].',
    trim(omf_rule_list->v_product[p_ndx].v_rule[r_ndx]
    .v_conditions[c_ndx].v_condition_str))
else
    set v_arraycnt= v_arraycnt + 1
    set stat = alterlist(qual_request->v_product[p_ndx]
    .v_qual[v_qualcnt].v_array, v_arraycnt)

    set qual_request->v_product[p_ndx].v_qual[v_qualcnt]
    .v_array[v_arraycnt].v_array_str =
    concat("SELECT into 'nl:' 1 from (dummyt d1 with seq = value(size(",
    trim(omf_rule_list->v_product[p_ndx].v_rule[r_ndx]
    .v_conditions[c_ndx].v_array_str),',5)))',
    ' plan d1 where ',
    trim(cnvtstring(omf_rule_list->v_product[p_ndx]
    .v_rule[r_ndx].v_conditions[c_ndx].v_value)), ' ',
    trim(omf_rule_list->v_product[p_ndx].v_rule[r_ndx]
    .v_conditions[c_ndx].v_operand), ' ',
    trim(omf_rule_list->v_product[p_ndx].v_rule[r_ndx]
    .v_conditions[c_ndx].v_array_str),
    '[d1.seq].',
    trim(omf_rule_list->v_product[p_ndx].v_rule[r_ndx]
    .v_conditions[c_ndx].v_condition_str))
endif
endif

set v_last_condition = omf_rule_list->v_product[p_ndx].v_rule[r_ndx]
    .v_conditions[c_ndx].v_condition
endfor

if (size(trim(qual_request->v_product[p_ndx].v_qual[v_qualcnt]
    .v_array[v_arraycnt].v_array_str), 1) > 0)
    set qual_request->v_product[p_ndx].v_qual[v_qualcnt]
    .v_array[v_arraycnt].v_array_str =
    concat(trim(qual_request->v_product[p_ndx].v_qual[v_qualcnt]
    .v_array[v_arraycnt].v_array_str), ' WITH nocounter go')
endif

if (v_condcnt > 0)
    set qual_request->v_product[p_ndx].v_qual[v_qualcnt]
    .v_qualification_stmt =
    concat(trim(qual_request->v_product[p_ndx].v_qual[v_qualcnt]
    .v_qualification_stmt), ')) and (')
else
    set qual_request->v_product[p_ndx].v_qual[v_qualcnt]
    .v_qualification_stmt =
    concat(trim(qual_request->v_product[p_ndx].v_qual[v_qualcnt].v_qualification_stmt),
    ' if (')
endif

if (omf_rule_list->v_product[p_ndx].v_rule[r_ndx].v_time_blk_event_num!= 0)
    set v_time_blk_time_str = fillstring(255, ' ')
    set v_time_blk_day_str= fillstring(255, ' ')

/*******************************************************************
* Get the time string for the time block event.
*******************************************************************/
select into 'nl:'
1
from (dummyt d1 with seq = value(size(omf_express_list->v_express, 5)))
plan d1
where omf_express_list->v_express[d1.seq].v_group_num =
    omf_rule_list->v_product[p_ndx].v_rule[r_ndx].v_time_blk_event_num
    and omf_express_list->v_express[d1.seq].v_mode_cd= v_time_mode_cd
    and omf_express_list->v_express[d1.seq].product_cd =
    omf_rule_list->v_product[p_ndx].v_product_cd
detail
v_time_blk_time_str = trim(omf_express_list->v_express[d1.seq].v_ccl_string)

if (v_detail_ind = 0)
v_detail_ind = omf_express_list->v_express[d1.seq].v_detail_ind
endif
with nocounter

/*******************************************************************
* Get the weekday string for the active days of the week.
*******************************************************************/
select into 'nl:'
1
from (dummyt d1 with seq =
value(size(omf_express_list->v_express, 5)))
plan d1
where omf_express_list->v_express[d1.seq].v_group_num =
omf_rule_list->v_product[p_ndx].v_rule[r_ndx].v_time_blk_event_num
and omf_express_list->v_express[d1.seq].v_mode_cd= v_day_mode_cd
and omf_express_list->v_express[d1.seq].product_cd =
omf_rule_list->v_product[p_ndx].v_product_cd
detail
v_time_blk_day_str= trim(omf_express_list->v_express[d1.seq].v_ccl_string)
with nocounter

/*******************************************************************
* Build the time block portion of the select stmt.
*******************************************************************/
set qual_request->v_product[p_ndx].v_qual[v_qualcnt].v_qualification_stmt =
concat(trim(qual_request->v_product[p_ndx].v_qual[v_qualcnt].v_qualification_stmt),
' (',
trim(v_time_blk_time_str)," >= '",
trim(omf_rule_list->v_product[p_ndx].v_rule[r_ndx].v_time_blk_beg_time),
"' and ",
trim(v_time_blk_time_str), " <= '",
trim(omf_rule_list->v_product[p_ndx].v_rule[r_ndx].v_time_blk_end_time),
"' and ",
trim(v_time_blk_day_str), ' in (')

for (tdb_ndx = 1 to size(omf_rule_list->v_product[p_ndx].v_rule[r_ndx].v_time_blk_days, 5))
if (tdb_ndx > 1)
set qual_request->v_product[p_ndx].v_qual[v_qualcnt].v_qualification_stmt =
concat(trim(qual_request->v_product[p_ndx].
v_qual[v_qualcnt].v_qualification_stmt), ', ')
endif

set qual_request->v_product[p_ndx].v_qual[v_qualcnt].v_qualification_stmt =
concat(trim(qual_request->v_product[p_ndx].v_qual[v_qualcnt].v_qualification_stmt),
trim(cnvtstring(omf_rule_list->v_product[p_ndx].v_rule[r_ndx].
v_time_blk_days[tdb_ndx].v_day_of_week)))
endfor

set qual_request->v_product[p_ndx].v_qual[v_qualcnt].v_qualification_stmt =
concat(trim(qual_request->v_product[p_ndx].v_qual[v_qualcnt].v_qualification_stmt),
'))) and (')
endif

/*********************************************************************
* Get the beginning and effective date ranges.
*********************************************************************/

select into 'nl:'
1
from (dummyt d1 with seq = value(size(omf_express_list->v_express, 5)))
plan d1
where omf_express_list->v_express[d1.seq].v_group_num =
omf_rule_list->v_product[p_ndx].v_rule[r_ndx].v_beg_event_num
and omf_express_list->v_express[d1.seq].v_mode_cd= v_dt_tm_mode_cd
and omf_express_list->v_express[d1.seq].product_cd =
omf_rule_list->v_product[p_ndx].v_product_cd
detail
if (v_detail_ind = 0)
 v_detail_ind = omf_express_list->v_express[d1.seq].v_detail_ind
endif

qual_request->v_product[p_ndx].v_qual[v_qualcnt].v_qualification_stmt =
concat(trim(qual_request->v_product[p_ndx].v_qual[v_qualcnt].v_qualification_stmt),
trim(omf_express_list->v_express[d1.seq].v_ccl_string),
" between cnvtdatetime('",
format(omf_rule_list->v_product[p_ndx].v_rule[r_ndx].v_beg_effective_dt_tm,
'dd-mmm-yyyy hh:mm:ss.cc;;d'), "') AND cnvtdatetime('",
format(omf_rule_list->v_product[p_ndx].v_rule[r_ndx].v_end_effective_dt_tm,
'dd-mmm-yyyy hh:mm:ss.cc;;d'), "')) ")
with nocounter

/*********************************************************************
* Check for a detail level record.
*********************************************************************/
set v_dtl_lvl_str = fillstring(255, ' ')
if (v_dtl_mode_cd > 0)

select into 'nl:'
1
from (dummyt d1 with seq = value(size(omf_express_list->v_express, 5)))
plan d1
where omf_express_list->v_express[d1.seq].v_mode_cd= v_dtl_mode_cd
and omf_express_list->v_express[d1.seq].product_cd =
omf_rule_list->v_product[p_ndx].v_product_cd
detail
v_dtl_lvl_str = trim(omf_express_list->v_express[d1.seq].v_ccl_string)
with nocounter
endif

if (size(trim(v_dtl_lvl_str)) > 0 and v_detail_ind = 1)
set qual_request->v_product[p_ndx].v_qual[v_qualcnt].v_qualification_stmt =
concat(trim(qual_request->v_product[p_ndx].v_qual[v_qualcnt].v_qualification_stmt),
' and ', trim(v_dtl_lvl_str), ' = ', cnvtstring(v_detail_ind), ') ',
trim(cnvtstring(omf_rule_list->v_product[p_ndx].v_rule[r_ndx].v_rule_id)),
' endif) GO')
else
set qual_request->v_product[p_ndx].v_qual[v_qualcnt].v_qualification_stmt =
concat(trim(qual_request->v_product[p_ndx].v_qual[v_qualcnt].v_qualification_stmt),
') ',
trim(cnvtstring(omf_rule_list->v_product[p_ndx].v_rule[r_ndx].v_rule_id)),
' endif) GO')
endif

set qual_request->v_product[p_ndx].v_qual[v_qualcnt].v_detail_ind = v_detail_ind

/*********************************************************************
* Build the expected TAT calculation strings:
*v_dyn_stmt3:select statement used to calculate turnaround time
*for time interval method and those transactions
*that satisfy the 'IN BY' requirement for the
*absolute method
*v_dyn_stmt4:select statement used to retrieve the day of the
*week for the 'IN BY' event
*v_dyn_stmt5:select statement used to calculate turnaround time
*for those transactions that did not satisfy the
*'IN BY' requirement for the absolute method
*
* The calc_num is the event id of the ending event in the event range.
* If the event range is ORDER TO DRAWN, the calc_num is equal to the
* OMF_EVENTS.event_num for the drawn event.
*********************************************************************/
set v_beg_event_num = 0
set v_end_event_num = 0

for (ev_ndx = 1 to size(omf_rule_list->v_product[p_ndx].v_rule[r_ndx].v_rule_dtl, 5))
/*******************************************************************
* Build the expected TAT string for the elapsed TAT method
* (tat_flag = 1).
*******************************************************************/
if (omf_rule_list->v_product[p_ndx].v_rule[r_ndx].v_rule_dtl[ev_ndx].v_tat_flag = 1)
set omf_rule_list->v_product[p_ndx].v_rule[r_ndx].v_rule_dtl[ev_ndx].v_dyn_stmt3 =
concat('set v_tat_value = ',
trim(cnvtstring(omf_rule_list->v_product[p_ndx].v_rule[r_ndx].
v_rule_dtl[ev_ndx].v_expected_tat)),' go')
else
 /*****************************************************************
 * If processing the first entry, the beginning event is stored on
 * the rules table; otherwise, the beginning event will be set
 * during processing of the previous record.
 *****************************************************************/
if (ev_ndx = 1)
    set v_beg_event_num = omf_rule_list->v_product[p_ndx].v_rule[r_ndx].v_beg_event_num
endif

set v_end_event_num= omf_rule_list->v_product[p_ndx].v_rule[r_ndx].
v_rule_dtl[ev_ndx].v_event_num

set v_beg_event_dt_tm_str= fillstring(255, ' ')
set v_beg_event_day_str= fillstring(255, ' ')
set v_beg_event_time_str = fillstring(255, ' ')
set v_end_event_dt_tm_str= fillstring(255, ' ')
set v_end_event_outby_str= fillstring(255, ' ')
set v_end_event_nextoutby_str = fillstring(255, ' ')

/*****************************************************************
* Get the ending event ccl strings
*****************************************************************/
select into 'nl:'
1
from (dummyt d1 with seq = value(size(omf_express_list->v_express, 5)))
plan d1
where omf_express_list->v_express[d1.seq].v_group_num = v_end_event_num
and omf_express_list->v_express[d1.seq].product_cd =
omf_rule_list->v_product[p_ndx].v_product_cd
and omf_express_list->v_express[d1.seq].v_mode_cd in (v_dt_tm_mode_cd, v_outby_mode_cd, v_nextoutby_mode_cd)
detail
case (omf_express_list->v_express[d1.seq].v_mode_cd)
of v_dt_tm_mode_cd:v_end_event_dt_tm_str = omf_express_list->v_express[d1.seq].v_ccl_string
of v_outby_mode_cd:v_end_event_outby_str = omf_express_list->v_express[d1.seq].v_ccl_string
of v_nextoutby_mode_cd: v_end_event_nextoutby_str =
omf_express_list->v_express[d1.seq].v_ccl_string
endcase
with nocounter

/*****************************************************************
* Get the beginning event ccl string
*****************************************************************/
select into 'nl:'
1
from (dummyt d1 with seq = value(size(omf_express_list->v_express, 5)))
plan d1
where omf_express_list->v_express[d1.seq].v_group_num = v_beg_event_num
and omf_express_list->v_express[d1.seq].v_mode_cd in
(v_dt_tm_mode_cd, v_day_mode_cd,v_time_mode_cd)
and omf_express_list->v_express[d1.seq].product_cd =
omf_rule_list->v_product[p_ndx].v_product_cd
detail
case (omf_express_list->v_express[d1.seq].v_mode_cd)
of v_dt_tm_mode_cd: v_beg_event_dt_tm_str= omf_express_list->v_express[d1.seq].v_ccl_string
of v_day_mode_cd:v_beg_event_day_str= omf_express_list->v_express[d1.seq].v_ccl_string
of v_time_mode_cd:v_beg_event_time_str= omf_express_list->v_express[d1.seq].v_ccl_string
endcase
with nocounter

set omf_rule_list->v_product[p_ndx].v_rule[r_ndx].v_rule_dtl[ev_ndx].v_dyn_stmt3 =
concat("SELECT INTO 'NL:' tat_value = evaluate(cnvtdatetime(''),",
trim(v_end_event_dt_tm_str), ',0,', trim(v_beg_event_dt_tm_str),
',0,(datetimediff(',
trim(v_end_event_outby_str), ',', trim(v_beg_event_dt_tm_str), ')+',
trim(cnvtstring(omf_rule_list->v_product[p_ndx].v_rule[r_ndx].
v_rule_dtl[ev_ndx].v_inout_add_days)), ')',
'*1440)',
' FROM dummyt plan dummyt ',
' WHERE ',
trim(v_beg_event_time_str), " <= '",
trim(omf_rule_list->v_product[p_ndx].v_rule[r_ndx].v_rule_dtl[ev_ndx].
v_inby_time), "'",
' DETAIL v_tat_value = tat_value ',
' WITH nocounter go')

set omf_rule_list->v_product[p_ndx].v_rule[r_ndx].v_rule_dtl[ev_ndx].v_dyn_stmt4 =
concat('set v_day_value = ',
trim(v_beg_event_day_str),
' go')

set omf_rule_list->v_product[p_ndx].v_rule[r_ndx].v_rule_dtl[ev_ndx].v_dyn_stmt5 =
concat("set v_tat_value2 = evaluate(cnvtdatetime(''),",
trim(v_end_event_dt_tm_str), ',0,', trim(v_beg_event_dt_tm_str),
',0,(datetimediff(',
trim(v_end_event_nextoutby_str), ',', trim(v_beg_event_dt_tm_str), ')+',
trim(cnvtstring(omf_rule_list->v_product[p_ndx].v_rule[r_ndx].
v_rule_dtl[ev_ndx].v_inout_add_days)), ')',
'*1440) go')
endif
endfor
endfor
endfor
endif

execute omf_rad_rule_qualifier

set maxdata1 = 0
set maxdata2 = 0
for (van = 1 to size(omf_rad_ord_comp1->qual,5))
    set script_request->queue_id = omf_rad_ord_comp1->qual[van]->num1
    set omf_rad_ord_comp->num3 = 0
    set omf_rad_ord_comp->num4 = 0
    set omf_rad_ord_comp->num5 = 0
    set omf_rad_ord_comp->num6 = 0
    set omf_rad_ord_comp->num8 = 0
    set omf_rad_ord_comp->num9 = 0
    set omf_rad_ord_comp->num10 = 0
    set omf_rad_ord_comp->num11 = 0
    set stat = alterlist(omf_rad_ord_comp->array[1]->data,0)
    set omf_rad_ord_comp->date1 = fillstring(25," ")
    set omf_rad_ord_comp->date2 = fillstring(25," ")
    set omf_rad_ord_comp->date3 = fillstring(25," ")
    set omf_rad_ord_comp->date4 = fillstring(25," ")
    set omf_rad_ord_comp->date5 = fillstring(25," ")
    set omf_rad_ord_comp->date6 = fillstring(25," ")
    set omf_rad_ord_comp->num17 = 0
    set omf_rad_ord_comp->num18 = 0
    set omf_rad_ord_comp->num19 = 0
    set omf_rad_ord_comp->num20 = 0
    set omf_rad_ord_comp->num21 = 0
    set omf_rad_ord_comp->num22 = 0
    set omf_rad_ord_comp->num23 = 0
    set omf_rad_ord_comp->num24 = 0
    set omf_rad_ord_comp->num25 = 0
    set omf_rad_ord_comp->num26 = 0
    set omf_rad_ord_comp->num27 = 0
    set omf_rad_ord_comp->num28 = 0
    set omf_rad_ord_comp->num29 = 0
    set omf_rad_ord_comp->num30 = 0
    set omf_rad_ord_comp->num3 = omf_rad_ord_comp1->qual[van]->num3
    set omf_rad_ord_comp->num4 = omf_rad_ord_comp1->qual[van]->num4
    set omf_rad_ord_comp->num5 = omf_rad_ord_comp1->qual[van]->num5
    set omf_rad_ord_comp->num6 = omf_rad_ord_comp1->qual[van]->num6
    set omf_rad_ord_comp->num8 = omf_rad_ord_comp1->qual[van]->num8
    set omf_rad_ord_comp->num9 = omf_rad_ord_comp1->qual[van]->num9
    set omf_rad_ord_comp->num10 = omf_rad_ord_comp1->qual[van]->num10
    set omf_rad_ord_comp->num11 = omf_rad_ord_comp1->qual[van]->num11
    set stat = alterlist(omf_rad_ord_comp->array[1]->data,size(omf_rad_ord_comp1->qual[van]->array[1]->data,5))
    for (y = 1 to size(omf_rad_ord_comp1->qual[van]->array[1]->data,5))
        set omf_rad_ord_comp->array[1]->data[y]->num1 =
            omf_rad_ord_comp1->qual[van]->array[1]->data[y]->num1
    endfor
    set omf_rad_ord_comp->date1 = omf_rad_ord_comp1->qual[van]->date1
    set omf_rad_ord_comp->date2 = omf_rad_ord_comp1->qual[van]->date2
    set omf_rad_ord_comp->date3 = omf_rad_ord_comp1->qual[van]->date3
    set omf_rad_ord_comp->date4 = omf_rad_ord_comp1->qual[van]->date4
    set omf_rad_ord_comp->date5 = omf_rad_ord_comp1->qual[van]->date5
    set omf_rad_ord_comp->date6 = omf_rad_ord_comp1->qual[van]->date6
    execute omf_calc_tat
    set omf_rad_ord_comp1->qual[van]->num17 = omf_rad_ord_comp->num17
    set omf_rad_ord_comp1->qual[van]->num18 = omf_rad_ord_comp->num18
    set omf_rad_ord_comp1->qual[van]->num19 = omf_rad_ord_comp->num19
    set omf_rad_ord_comp1->qual[van]->num20 = omf_rad_ord_comp->num20
    set omf_rad_ord_comp1->qual[van]->num21 = omf_rad_ord_comp->num21
    set omf_rad_ord_comp1->qual[van]->num22 = omf_rad_ord_comp->num22
    set omf_rad_ord_comp1->qual[van]->num23 = omf_rad_ord_comp->num23
    set omf_rad_ord_comp1->qual[van]->num24 = omf_rad_ord_comp->num24
    set omf_rad_ord_comp1->qual[van]->num25 = omf_rad_ord_comp->num25
    set omf_rad_ord_comp1->qual[van]->num26 = omf_rad_ord_comp->num26
    set omf_rad_ord_comp1->qual[van]->num27 = omf_rad_ord_comp->num27
    set omf_rad_ord_comp1->qual[van]->num28 = omf_rad_ord_comp->num28
    set omf_rad_ord_comp1->qual[van]->num29 = omf_rad_ord_comp->num29
    set omf_rad_ord_comp1->qual[van]->num30 = omf_rad_ord_comp->num30
    if (size(omf_rad_ord_comp1->qual[van]->array[1]->data,5) > maxdata1)
        set maxdata1 = size(omf_rad_ord_comp1->qual[van]->array[1]->data,5)
    endif
    if (size(omf_rad_ord_comp1->qual[van]->array[2]->data,5) > maxdata2)
        set maxdata2 = size(omf_rad_ord_comp1->qual[van]->array[2]->data,5)
    endif
endfor

for (x = 1 to cnvtint(size(omf_rad_ord_comp1->qual,5) / 5000) + 1)
    update into omf_radmgmt_order_st o,
        (dummyt d with seq = value(size(omf_rad_ord_comp1->qual,5)))
    set o.patient_id = omf_rad_ord_comp1->qual[d.seq]->num2,
        o.order_phys_id = omf_rad_ord_comp1->qual[d.seq]->num3,
        o.encntr_type_cd = omf_rad_ord_comp1->qual[d.seq]->num4,
        o.exam_room_cd = omf_rad_ord_comp1->qual[d.seq]->num5,
        o.subsection_cd = omf_rad_ord_comp1->qual[d.seq]->num14,
        o.section_cd = omf_rad_ord_comp1->qual[d.seq]->num13,
        o.perf_dept_cd = omf_rad_ord_comp1->qual[d.seq]->num12,
        o.perf_inst_cd = omf_rad_ord_comp1->qual[d.seq]->num11,
        o.catalog_cd = omf_rad_ord_comp1->qual[d.seq]->num6,
        o.transcriptionist_id = omf_rad_ord_comp1->qual[d.seq]->num8,
        o.radiologist_id = omf_rad_ord_comp1->qual[d.seq]->num9,
        o.priority_cd = omf_rad_ord_comp1->qual[d.seq]->num10,
        o.act_overall_tat = omf_rad_ord_comp1->qual[d.seq]->num23,
        o.act_request_start = omf_rad_ord_comp1->qual[d.seq]->num17,  /*kd*/
        o.act_start_ex_comp = omf_rad_ord_comp1->qual[d.seq]->num18,
        o.act_ex_comp_view = omf_rad_ord_comp1->qual[d.seq]->num19,
        o.act_view_dictate = omf_rad_ord_comp1->qual[d.seq]->num20,
        o.act_dictate_trans = omf_rad_ord_comp1->qual[d.seq]->num21,
        o.act_trans_final = omf_rad_ord_comp1->qual[d.seq]->num22,
        o.exp_overall_tat = omf_rad_ord_comp1->qual[d.seq]->num30,
        o.exp_request_start = omf_rad_ord_comp1->qual[d.seq]->num24, /*kd*/
        o.exp_start_ex_comp = omf_rad_ord_comp1->qual[d.seq]->num25,
        o.exp_ex_comp_view = omf_rad_ord_comp1->qual[d.seq]->num26,
        o.exp_view_dictate = omf_rad_ord_comp1->qual[d.seq]->num27,
        o.exp_dictate_trans = omf_rad_ord_comp1->qual[d.seq]->num28,
        o.exp_trans_final = omf_rad_ord_comp1->qual[d.seq]->num29,
        o.accession_nbr = omf_rad_ord_comp1->qual[d.seq]->char1,
        o.exam_complete_qty = 1,
        o.exam_comp_credit_qty = 0,
        o.exam_complete_hour = omf_rad_ord_comp1->qual[d.seq]->num15,
        o.exam_complete_day = omf_rad_ord_comp1->qual[d.seq]->num16,
        o.exam_complete_month = omf_rad_ord_comp1->qual[d.seq]->char2,
        o.procedure_type_flag = omf_rad_ord_comp1->qual[d.seq]->num31,
        o.encntr_id = omf_rad_ord_comp1->qual[d.seq]->num32,
        o.order_dt_nbr = omf_rad_ord_comp1->qual[d.seq]->num33,
        o.order_min_nbr = omf_rad_ord_comp1->qual[d.seq]->num34,
        o.start_dt_nbr = omf_rad_ord_comp1->qual[d.seq]->num35,
        o.start_min_nbr = omf_rad_ord_comp1->qual[d.seq]->num36,
        o.exam_complete_dt_nbr = omf_rad_ord_comp1->qual[d.seq]->num37,
        o.exam_complete_min_nbr = omf_rad_ord_comp1->qual[d.seq]->num38,
        o.dictate_dt_nbr = omf_rad_ord_comp1->qual[d.seq]->num39,
        o.dictate_min_nbr = omf_rad_ord_comp1->qual[d.seq]->num40,
        o.transcribe_dt_nbr = omf_rad_ord_comp1->qual[d.seq]->num41,
        o.transcribe_min_nbr = omf_rad_ord_comp1->qual[d.seq]->num42,
        o.final_dt_nbr = omf_rad_ord_comp1->qual[d.seq]->num43,
        o.final_min_nbr = omf_rad_ord_comp1->qual[d.seq]->num44,
        o.order_dt_tm = cnvtdatetime(omf_rad_ord_comp1->qual[d.seq]->date1),
        o.start_dt_tm = cnvtdatetime(omf_rad_ord_comp1->qual[d.seq]->date2),
        o.exam_complete_dt_tm = cnvtdatetime(omf_rad_ord_comp1->qual[d.seq]->date3),
        o.dictate_dt_tm = cnvtdatetime(omf_rad_ord_comp1->qual[d.seq]->date4),
        o.transcribe_dt_tm = cnvtdatetime(omf_rad_ord_comp1->qual[d.seq]->date5),
        o.final_dt_tm = cnvtdatetime(omf_rad_ord_comp1->qual[d.seq]->date6),
        o.tat_qual_ind = script_reply->qualified_ind,
        o.rule_id = evaluate(script_reply->qualified_ind,1,qual_rule_request->v_rule[1].v_rule_id,-1),

  ;008 Start
        o.sched_confirm_dt_tm = cnvtdatetime(omf_rad_ord_comp1->qual[d.seq]->sConfirmDtTm)  ,
       ; o.sched_confirm_Tz= omf_rad_ord_comp1->qual[d.seq]->lConfirmTz,
        o.sched_confirm_dt_nbr= omf_rad_ord_comp1->qual[d.seq]->lConfirmDtNbr ,
        o.sched_confirm_min_nbr= omf_rad_ord_comp1->qual[d.seq]->lConfirmMinNbr ,
        o.act_order_sched_confirm = omf_rad_ord_comp1->qual[d.seq]->lActOrderConfirm,
        o.exp_order_sched_confirm = omf_rad_ord_comp1->qual[d.seq]->lExpOrderConfirm,
        o.request_dt_tm = cnvtdatetime(omf_rad_ord_comp1->qual[d.seq]->sRequestDtTm),
        ;o.request_tz = omf_rad_ord_comp1->qual[d.seq]->lRequestTz ,
        o.request_dt_nbr = omf_rad_ord_comp1->qual[d.seq]->lRequestDtNbr ,
        o.request_min_nbr = omf_rad_ord_comp1->qual[d.seq]->lRequestMinNbr ,
        o.act_sched_confirm_request = omf_rad_ord_comp1->qual[d.seq]->lActConfirmRequest,
       o.exp_sched_confirm_request = omf_rad_ord_comp1->qual[d.seq]->lExpConfirmRequest,
         ;008 End 


        o.updt_dt_tm = cnvtdatetime(curdate, curtime3),
        o.updt_id = 9319490,  ;JTW
	o.updt_task = 2100013,  ;JTW
	o.updt_applctx = 888.51250,  ;JTW
	o.updt_cnt = omf2.updt_cnt + 1  ;JTW

    plan d where
        omf_rad_ord_comp1->qual[d.seq]->update_ind = 1 and
        d.seq > ((x * 5000) - 5000) and
        d.seq <= (x * 5000)
    join o where
        o.order_id = omf_rad_ord_comp1->qual[d.seq]->num1
    with nocounter

    insert into omf_radmgmt_order_st o,
        (dummyt d with seq = value(size(omf_rad_ord_comp1->qual,5)))
    set o.order_id = omf_rad_ord_comp1->qual[d.seq]->num1,
        o.patient_id = omf_rad_ord_comp1->qual[d.seq]->num2,
        o.order_phys_id = omf_rad_ord_comp1->qual[d.seq]->num3,
        o.encntr_type_cd = omf_rad_ord_comp1->qual[d.seq]->num4,
        o.exam_room_cd = omf_rad_ord_comp1->qual[d.seq]->num5,
        o.subsection_cd = omf_rad_ord_comp1->qual[d.seq]->num14,
        o.section_cd = omf_rad_ord_comp1->qual[d.seq]->num13,
        o.perf_dept_cd = omf_rad_ord_comp1->qual[d.seq]->num12,
        o.perf_inst_cd = omf_rad_ord_comp1->qual[d.seq]->num11,
        o.catalog_cd = omf_rad_ord_comp1->qual[d.seq]->num6,
        o.transcriptionist_id = omf_rad_ord_comp1->qual[d.seq]->num8,
        o.radiologist_id = omf_rad_ord_comp1->qual[d.seq]->num9,
        o.priority_cd = omf_rad_ord_comp1->qual[d.seq]->num10,
        o.act_overall_tat = omf_rad_ord_comp1->qual[d.seq]->num23,
        o.act_ord_start = omf_rad_ord_comp1->qual[d.seq]->num17, 
        o.act_start_ex_comp = omf_rad_ord_comp1->qual[d.seq]->num18,
        o.act_ex_comp_view = omf_rad_ord_comp1->qual[d.seq]->num19,
        o.act_view_dictate = omf_rad_ord_comp1->qual[d.seq]->num20,
        o.act_dictate_trans = omf_rad_ord_comp1->qual[d.seq]->num21,
        o.act_trans_final = omf_rad_ord_comp1->qual[d.seq]->num22,
        o.exp_overall_tat = omf_rad_ord_comp1->qual[d.seq]->num30,
        o.exp_request_start = omf_rad_ord_comp1->qual[d.seq]->num24, /*kd*/
        o.exp_start_ex_comp = omf_rad_ord_comp1->qual[d.seq]->num25,
        o.exp_ex_comp_view = omf_rad_ord_comp1->qual[d.seq]->num26,
        o.exp_view_dictate = omf_rad_ord_comp1->qual[d.seq]->num27,
        o.exp_dictate_trans = omf_rad_ord_comp1->qual[d.seq]->num28,
        o.exp_trans_final = omf_rad_ord_comp1->qual[d.seq]->num29,
        o.accession_nbr = omf_rad_ord_comp1->qual[d.seq]->char1,
        o.exam_complete_qty = 1,
        o.exam_comp_credit_qty = 0,
        o.exam_complete_hour = omf_rad_ord_comp1->qual[d.seq]->num15,
        o.exam_complete_day = omf_rad_ord_comp1->qual[d.seq]->num16,
        o.exam_complete_month = omf_rad_ord_comp1->qual[d.seq]->char2,
        o.procedure_type_flag = omf_rad_ord_comp1->qual[d.seq]->num31,
        o.encntr_id = omf_rad_ord_comp1->qual[d.seq]->num32,
        o.order_dt_nbr = omf_rad_ord_comp1->qual[d.seq]->num33,
        o.order_min_nbr = omf_rad_ord_comp1->qual[d.seq]->num34,
        o.start_dt_nbr = omf_rad_ord_comp1->qual[d.seq]->num35,
        o.start_min_nbr = omf_rad_ord_comp1->qual[d.seq]->num36,
        o.exam_complete_dt_nbr = omf_rad_ord_comp1->qual[d.seq]->num37,
        o.exam_complete_min_nbr = omf_rad_ord_comp1->qual[d.seq]->num38,
        o.dictate_dt_nbr = omf_rad_ord_comp1->qual[d.seq]->num39,
        o.dictate_min_nbr = omf_rad_ord_comp1->qual[d.seq]->num40,
        o.transcribe_dt_nbr = omf_rad_ord_comp1->qual[d.seq]->num41,
        o.transcribe_min_nbr = omf_rad_ord_comp1->qual[d.seq]->num42,
        o.final_dt_nbr = omf_rad_ord_comp1->qual[d.seq]->num43,
        o.final_min_nbr = omf_rad_ord_comp1->qual[d.seq]->num44,
        o.order_dt_tm = cnvtdatetime(omf_rad_ord_comp1->qual[d.seq]->date1),
        o.start_dt_tm = cnvtdatetime(omf_rad_ord_comp1->qual[d.seq]->date2),
        o.exam_complete_dt_tm = cnvtdatetime(omf_rad_ord_comp1->qual[d.seq]->date3),
        o.dictate_dt_tm = cnvtdatetime(omf_rad_ord_comp1->qual[d.seq]->date4),
        o.transcribe_dt_tm = cnvtdatetime(omf_rad_ord_comp1->qual[d.seq]->date5),
        o.final_dt_tm = cnvtdatetime(omf_rad_ord_comp1->qual[d.seq]->date6),
        o.tat_qual_ind = script_reply->qualified_ind,
        o.rule_id = evaluate(script_reply->qualified_ind,1,qual_rule_request->v_rule[1].v_rule_id,-1),

 ;008 Start
        o.sched_confirm_dt_tm = cnvtdatetime(omf_rad_ord_comp1->qual[d.seq]->sConfirmDtTm)  ,
      ;  o.sched_confirm_Tz= omf_rad_ord_comp1->qual[d.seq]->lConfirmTz,
        o.sched_confirm_dt_nbr= omf_rad_ord_comp1->qual[d.seq]->lConfirmDtNbr ,
        o.sched_confirm_min_nbr= omf_rad_ord_comp1->qual[d.seq]->lConfirmMinNbr ,
        o.act_order_sched_confirm = omf_rad_ord_comp1->qual[d.seq]->lActOrderConfirm,
        o.exp_order_sched_confirm = omf_rad_ord_comp1->qual[d.seq]->lExpOrderConfirm,
        o.request_dt_tm = cnvtdatetime(omf_rad_ord_comp1->qual[d.seq]->sRequestDtTm),
       ; o.request_tz = omf_rad_ord_comp1->qual[d.seq]->lRequestTz ,
        o.request_dt_nbr = omf_rad_ord_comp1->qual[d.seq]->lRequestDtNbr ,
        o.request_min_nbr = omf_rad_ord_comp1->qual[d.seq]->lRequestMinNbr ,
        o.act_sched_confirm_request = omf_rad_ord_comp1->qual[d.seq]->lActConfirmRequest,
        o.exp_sched_confirm_request = omf_rad_ord_comp1->qual[d.seq]->lExpConfirmRequest,
         ;008 End 


        o.updt_dt_tm = cnvtdatetime(curdate, curtime3),
        o.updt_id = 9319490,  ;JTW
	o.updt_task = 2100013,  ;JTW
	o.updt_applctx = 888.51250,  ;JTW
	o.updt_cnt = omf2.updt_cnt + 1  ;JTW
    plan d where
        omf_rad_ord_comp1->qual[d.seq]->update_ind = 0 and
        d.seq > ((x * 5000) - 5000) and
        d.seq <= (x * 5000)
    join o
    with nocounter

;Begin logging records to be deleted JTW
;Headers
                select into "/cerner/ops_share/mhcrt/rad_utl_repost_summary_data4_DEL_LOG.dat"
                       "update_ind",
                       "report_status_cd",
                       "exam_required_ind",
                       "text_required_ind",
                       "order_id",
                       "patient_id",
                       "order_phys_id",
                       "encntr_type_cd",
                       "exam_room_cd",
                       "catalog_cd",
                       "transcriptionist_id",
                       "radiologists_id",
                       "priority_cd",
                       "institution_cd",
                       "department_cd",
                       "section_cd",
                       "subsection_cd",
                       "exam_complete_hour",
                       "exam_complete_day",
                       "actual_ordered_to_start",
                       "actual_start_to_exam_complete",
                       "actual_exam_complete_to_view",
                       "actual_view_to_dictate",
                       "actual_dictate_to_transcribe",
                       "actual_transcribe_to_final",
                       "actual_overall_tat",
                       "expected_ordered_to_start",
                       "expected_start_to_exam_complete",
                       "expected_exam_complete_to_view",
                       "expected_view_to_dictate",
                       "expected_dictate_to_transcribe",
                       "expected_transcribe_to_final",
                       "expected_overall_tat",
                       "procedure_type_flag",
                       "encntr_id",
                       "order_dt_nbr",
                       "order_min_nbr",
                       "start_dt_nbr",
                       "start_min_nbr",
                       "exam_complete_dt_nbr",
                       "exam_complete_min_nbr",
                       "dictate_dt_nbr",
                       "dictate_min_nbr",
                       "transcribe_dt_nbr",
                       "transcribe_min_nbr",
                       "final_dt_nbr",
                       "final_min_nbr",
                       "sched_dt_nbr",
                       "sched_min_nbr",
                       "accession_nbr",
                       "exam_complete_month",
                       "order_dt_tm",
                       "start_dt_tm",
                       "ex_comp_dt_tm",
                       "dictate_dt_tm",
                       "transcribe_dt_tm",
                       "final_dt_tm",
                       "sched_dt_tm",
                       "ConfirmDtTm",
                       "ConfirmTz",
                       "ConfirmDtNbr",
                       "ConfirmMinNbr",
                       "ActOrderConfirm",
                       "ExpOrderConfirm",
                       "RequestDtTm",
                       "RequestTz",
                       "RequestDtNbr",
                       "RequestMinNbr",
                       "ActConfirmRequest",
                       "ExpConfirmRequest"
                from
                (dummyt d)
                With separator = "|", format
                
;Records                
                select into "/cerner/ops_share/mhcrt/rad_utl_repost_summary_data4_DEL_LOG.dat"
                       omf_rad_ord_comp1->array[d.seq]->update_ind,
                       omf_rad_ord_comp1->array[d.seq]->report_status_cd,
                       omf_rad_ord_comp1->array[d.seq]->exam_required_ind,
                       omf_rad_ord_comp1->array[d.seq]->text_required_ind,
                       omf_rad_ord_comp1->array[d.seq]->num1,              ;order_id
                       omf_rad_ord_comp1->array[d.seq]->num2,              ;patient_id
                       omf_rad_ord_comp1->array[d.seq]->num3,              ;order_phys_id
                       omf_rad_ord_comp1->array[d.seq]->num4,              ;encntr_type_cd
                       omf_rad_ord_comp1->array[d.seq]->num5,              ;exam_room_cd
                       omf_rad_ord_comp1->array[d.seq]->num6,              ;catalog_cd
                       omf_rad_ord_comp1->array[d.seq]->num8,              ;transcriptionist_id
                       omf_rad_ord_comp1->array[d.seq]->num9,              ;radiologists_id
                       omf_rad_ord_comp1->array[d.seq]->num10,             ;priority_cd
                       omf_rad_ord_comp1->array[d.seq]->num11,            ;institution_cd
                       omf_rad_ord_comp1->array[d.seq]->num12,             ;department_cd
                       omf_rad_ord_comp1->array[d.seq]->num13,             ;section_cd
                       omf_rad_ord_comp1->array[d.seq]->num14,             ;subsection_cd
                       omf_rad_ord_comp1->array[d.seq]->num15,             ;exam complete hour
                       omf_rad_ord_comp1->array[d.seq]->num16,             ;exam complete day
                       omf_rad_ord_comp1->array[d.seq]->num17,             ;actual ordered to start
                       omf_rad_ord_comp1->array[d.seq]->num18,             ;actual start to exam complete
                       omf_rad_ord_comp1->array[d.seq]->num19,             ;actual exam complete to view
                       omf_rad_ord_comp1->array[d.seq]->num20,             ;actual view to dictate
                       omf_rad_ord_comp1->array[d.seq]->num21,             ;actual dictate to transcribe
                       omf_rad_ord_comp1->array[d.seq]->num22,             ;actual transcribe to final
                       omf_rad_ord_comp1->array[d.seq]->num23,             ;actual overall tat
                       omf_rad_ord_comp1->array[d.seq]->num24,             ;expected ordered to start
                       omf_rad_ord_comp1->array[d.seq]->num25,             ;expected start to exam complete
                       omf_rad_ord_comp1->array[d.seq]->num26,             ;expected exam complete to view
                       omf_rad_ord_comp1->array[d.seq]->num27,             ;expected view to dictate
                       omf_rad_ord_comp1->array[d.seq]->num28,             ;expected dictate to transcribe
                       omf_rad_ord_comp1->array[d.seq]->num29,             ;expected transcribe to final
                       omf_rad_ord_comp1->array[d.seq]->num30,             ;expected overall tat
                       omf_rad_ord_comp1->array[d.seq]->num31,             ;procedure_type_flag
                       omf_rad_ord_comp1->array[d.seq]->num32,             ;encntr_id
                       omf_rad_ord_comp1->array[d.seq]->num33,             ;order_dt_nbr
                       omf_rad_ord_comp1->array[d.seq]->num34,             ;order_min_nbr
                       omf_rad_ord_comp1->array[d.seq]->num35,             ;start_dt_nbr
                       omf_rad_ord_comp1->array[d.seq]->num36,             ;start_min_nbr
                       omf_rad_ord_comp1->array[d.seq]->num37,             ;exam_complete_dt_nbr
                       omf_rad_ord_comp1->array[d.seq]->num38,             ;exam_complete_min_nbr
                       omf_rad_ord_comp1->array[d.seq]->num39,             ;dictate_dt_nbr
                       omf_rad_ord_comp1->array[d.seq]->num40,             ;dictate_min_nbr
                       omf_rad_ord_comp1->array[d.seq]->num41,             ;transcribe_dt_nbr
                       omf_rad_ord_comp1->array[d.seq]->num42,             ;transcribe_min_nbr
                       omf_rad_ord_comp1->array[d.seq]->num43,             ;final_dt_nbr
                       omf_rad_ord_comp1->array[d.seq]->num44,             ;final_min_nbr
                       omf_rad_ord_comp1->array[d.seq]->num45,             ;sched_dt_nbr kd
                       omf_rad_ord_comp1->array[d.seq]->num46,             ;sched_min_nbr
                       omf_rad_ord_comp1->array[d.seq]->char1,             ;accession_nbr
                       omf_rad_ord_comp1->array[d.seq]->char2,             ;exam complete month
                       omf_rad_ord_comp1->array[d.seq]->date1,             ;order_dt_tm
                       omf_rad_ord_comp1->array[d.seq]->date2,             ;start_dt_tm
                       omf_rad_ord_comp1->array[d.seq]->date3,             ;ex_comp_dt_tm
                       omf_rad_ord_comp1->array[d.seq]->date4,             ;dictate_dt_tm
                       omf_rad_ord_comp1->array[d.seq]->date5,             ;transcribe_dt_tm
                       omf_rad_ord_comp1->array[d.seq]->date6,             ;final_dt_tm
                       omf_rad_ord_comp1->array[d.seq]->date7,             ;sched_dt_tm kd
                       omf_rad_ord_comp1->array[d.seq]->sConfirmDtTm,
                       omf_rad_ord_comp1->array[d.seq]->lConfirmTz,
                       omf_rad_ord_comp1->array[d.seq]->lConfirmDtNbr,
                       omf_rad_ord_comp1->array[d.seq]->lConfirmMinNbr,
                       omf_rad_ord_comp1->array[d.seq]->lActOrderConfirm,
                       omf_rad_ord_comp1->array[d.seq]->lExpOrderConfirm,
                       omf_rad_ord_comp1->array[d.seq]->sRequestDtTm,
                       omf_rad_ord_comp1->array[d.seq]->lRequestTz,
                       omf_rad_ord_comp1->array[d.seq]->lRequestDtNbr,
                       omf_rad_ord_comp1->array[d.seq]->lRequestMinNbr,
                       omf_rad_ord_comp1->array[d.seq]->lActConfirmRequest,
                       omf_rad_ord_comp1->array[d.seq]->lExpConfirmRequest
                from
                (dummyt d with seq = size(omf_rad_ord_comp1->array,5))
                With separator = "|", format, append

;End logging records to be deleted JTW


    delete from omf_radtech_order_st rt,
        (dummyt d with seq = value(size(omf_rad_ord_comp1->qual,5)))
    set rt.seq = 1
    plan d where
        d.seq > ((x * 5000) - 5000) and
        d.seq <= (x * 5000)
    join rt where
        rt.order_id = omf_rad_ord_comp1->qual[d.seq]->num1
    with nocounter

    insert into omf_radtech_order_st rt,
        (dummyt d with seq = value(size(omf_rad_ord_comp1->qual,5))),
        (dummyt d2 with seq = value(maxdata1))
    set rt.omf_radtech_order_st_id = seq(omf_seq, nextval),
        rt.order_id = omf_rad_ord_comp1->qual[d.seq]->num1,
        rt.technologist_id = omf_rad_ord_comp1->qual[d.seq]->array[1]->data[d2.seq]->num1,
        rt.updt_dt_tm = cnvtdatetime(curdate, curtime3),
        rt.updt_id = 9319490,  ;JTW
	rt.updt_task = 2100013,  ;JTW
	rt.updt_applctx = 888.51250,  ;JTW
	rt.updt_cnt = omf2.updt_cnt + 1  ;JTW
    plan d where
        d.seq > ((x * 5000) - 5000) and
        d.seq <= (x * 5000)
    join d2 where
        d2.seq <= size(omf_rad_ord_comp1->qual[d.seq]->array[1]->data,5)
    join rt
    with nocounter

;Begin logging records to be deleted JTW
;Headers
                select into "/cerner/ops_share/mhcrt/rad_utl_repost_summary_data5_DEL_LOG.dat"
                       "update_ind",
                       "report_status_cd",
                       "exam_required_ind",
                       "text_required_ind",
                       "order_id",
                       "patient_id",
                       "order_phys_id",
                       "encntr_type_cd",
                       "exam_room_cd",
                       "catalog_cd",
                       "transcriptionist_id",
                       "radiologists_id",
                       "priority_cd",
                       "institution_cd",
                       "department_cd",
                       "section_cd",
                       "subsection_cd",
                       "exam_complete_hour",
                       "exam_complete_day",
                       "actual_ordered_to_start",
                       "actual_start_to_exam_complete",
                       "actual_exam_complete_to_view",
                       "actual_view_to_dictate",
                       "actual_dictate_to_transcribe",
                       "actual_transcribe_to_final",
                       "actual_overall_tat",
                       "expected_ordered_to_start",
                       "expected_start_to_exam_complete",
                       "expected_exam_complete_to_view",
                       "expected_view_to_dictate",
                       "expected_dictate_to_transcribe",
                       "expected_transcribe_to_final",
                       "expected_overall_tat",
                       "procedure_type_flag",
                       "encntr_id",
                       "order_dt_nbr",
                       "order_min_nbr",
                       "start_dt_nbr",
                       "start_min_nbr",
                       "exam_complete_dt_nbr",
                       "exam_complete_min_nbr",
                       "dictate_dt_nbr",
                       "dictate_min_nbr",
                       "transcribe_dt_nbr",
                       "transcribe_min_nbr",
                       "final_dt_nbr",
                       "final_min_nbr",
                       "sched_dt_nbr",
                       "sched_min_nbr",
                       "accession_nbr",
                       "exam_complete_month",
                       "order_dt_tm",
                       "start_dt_tm",
                       "ex_comp_dt_tm",
                       "dictate_dt_tm",
                       "transcribe_dt_tm",
                       "final_dt_tm",
                       "sched_dt_tm",
                       "ConfirmDtTm",
                       "ConfirmTz",
                       "ConfirmDtNbr",
                       "ConfirmMinNbr",
                       "ActOrderConfirm",
                       "ExpOrderConfirm",
                       "RequestDtTm",
                       "RequestTz",
                       "RequestDtNbr",
                       "RequestMinNbr",
                       "ActConfirmRequest",
                       "ExpConfirmRequest"
                from
                (dummyt d)
                With separator = "|", format
                
;Records                
                select into "/cerner/ops_share/mhcrt/rad_utl_repost_summary_data5_DEL_LOG.dat"
                       omf_rad_ord_comp1->array[d.seq]->update_ind,
                       omf_rad_ord_comp1->array[d.seq]->report_status_cd,
                       omf_rad_ord_comp1->array[d.seq]->exam_required_ind,
                       omf_rad_ord_comp1->array[d.seq]->text_required_ind,
                       omf_rad_ord_comp1->array[d.seq]->num1,              ;order_id
                       omf_rad_ord_comp1->array[d.seq]->num2,              ;patient_id
                       omf_rad_ord_comp1->array[d.seq]->num3,              ;order_phys_id
                       omf_rad_ord_comp1->array[d.seq]->num4,              ;encntr_type_cd
                       omf_rad_ord_comp1->array[d.seq]->num5,              ;exam_room_cd
                       omf_rad_ord_comp1->array[d.seq]->num6,              ;catalog_cd
                       omf_rad_ord_comp1->array[d.seq]->num8,              ;transcriptionist_id
                       omf_rad_ord_comp1->array[d.seq]->num9,              ;radiologists_id
                       omf_rad_ord_comp1->array[d.seq]->num10,             ;priority_cd
                       omf_rad_ord_comp1->array[d.seq]->num11,             ;institution_cd
                       omf_rad_ord_comp1->array[d.seq]->num12,             ;department_cd
                       omf_rad_ord_comp1->array[d.seq]->num13,             ;section_cd
                       omf_rad_ord_comp1->array[d.seq]->num14,             ;subsection_cd
                       omf_rad_ord_comp1->array[d.seq]->num15,             ;exam complete hour
                       omf_rad_ord_comp1->array[d.seq]->num16,             ;exam complete day
                       omf_rad_ord_comp1->array[d.seq]->num17,             ;actual ordered to start
                       omf_rad_ord_comp1->array[d.seq]->num18,             ;actual start to exam complete
                       omf_rad_ord_comp1->array[d.seq]->num19,             ;actual exam complete to view
                       omf_rad_ord_comp1->array[d.seq]->num20,             ;actual view to dictate
                       omf_rad_ord_comp1->array[d.seq]->num21,             ;actual dictate to transcribe
                       omf_rad_ord_comp1->array[d.seq]->num22,             ;actual transcribe to final
                       omf_rad_ord_comp1->array[d.seq]->num23,             ;actual overall tat
                       omf_rad_ord_comp1->array[d.seq]->num24,             ;expected ordered to start
                       omf_rad_ord_comp1->array[d.seq]->num25,             ;expected start to exam complete
                       omf_rad_ord_comp1->array[d.seq]->num26,             ;expected exam complete to view
                       omf_rad_ord_comp1->array[d.seq]->num27,             ;expected view to dictate
                       omf_rad_ord_comp1->array[d.seq]->num28,             ;expected dictate to transcribe
                       omf_rad_ord_comp1->array[d.seq]->num29,             ;expected transcribe to final
                       omf_rad_ord_comp1->array[d.seq]->num30,             ;expected overall tat
                       omf_rad_ord_comp1->array[d.seq]->num31,             ;procedure_type_flag
                       omf_rad_ord_comp1->array[d.seq]->num32,             ;encntr_id
                       omf_rad_ord_comp1->array[d.seq]->num33,             ;order_dt_nbr
                       omf_rad_ord_comp1->array[d.seq]->num34,             ;order_min_nbr
                       omf_rad_ord_comp1->array[d.seq]->num35,             ;start_dt_nbr
                       omf_rad_ord_comp1->array[d.seq]->num36,             ;start_min_nbr
                       omf_rad_ord_comp1->array[d.seq]->num37,             ;exam_complete_dt_nbr
                       omf_rad_ord_comp1->array[d.seq]->num38,             ;exam_complete_min_nbr
                       omf_rad_ord_comp1->array[d.seq]->num39,             ;dictate_dt_nbr
                       omf_rad_ord_comp1->array[d.seq]->num40,             ;dictate_min_nbr
                       omf_rad_ord_comp1->array[d.seq]->num41,             ;transcribe_dt_nbr
                       omf_rad_ord_comp1->array[d.seq]->num42,             ;transcribe_min_nbr
                       omf_rad_ord_comp1->array[d.seq]->num43,             ;final_dt_nbr
                       omf_rad_ord_comp1->array[d.seq]->num44,             ;final_min_nbr
                       omf_rad_ord_comp1->array[d.seq]->num45,             ;sched_dt_nbr kd
                       omf_rad_ord_comp1->array[d.seq]->num46,             ;sched_min_nbr
                       omf_rad_ord_comp1->array[d.seq]->char1,             ;accession_nbr
                       omf_rad_ord_comp1->array[d.seq]->char2,             ;exam complete month
                       omf_rad_ord_comp1->array[d.seq]->date1,             ;order_dt_tm
                       omf_rad_ord_comp1->array[d.seq]->date2,             ;start_dt_tm
                       omf_rad_ord_comp1->array[d.seq]->date3,             ;ex_comp_dt_tm
                       omf_rad_ord_comp1->array[d.seq]->date4,             ;dictate_dt_tm
                       omf_rad_ord_comp1->array[d.seq]->date5,             ;transcribe_dt_tm
                       omf_rad_ord_comp1->array[d.seq]->date6,             ;final_dt_tm
                       omf_rad_ord_comp1->array[d.seq]->date7,             ;sched_dt_tm kd
                       omf_rad_ord_comp1->array[d.seq]->sConfirmDtTm,
                       omf_rad_ord_comp1->array[d.seq]->lConfirmTz,
                       omf_rad_ord_comp1->array[d.seq]->lConfirmDtNbr,
                       omf_rad_ord_comp1->array[d.seq]->lConfirmMinNbr,
                       omf_rad_ord_comp1->array[d.seq]->lActOrderConfirm,
                       omf_rad_ord_comp1->array[d.seq]->lExpOrderConfirm,
                       omf_rad_ord_comp1->array[d.seq]->sRequestDtTm,
                       omf_rad_ord_comp1->array[d.seq]->lRequestTz,
                       omf_rad_ord_comp1->array[d.seq]->lRequestDtNbr,
                       omf_rad_ord_comp1->array[d.seq]->lRequestMinNbr,
                       omf_rad_ord_comp1->array[d.seq]->lActConfirmRequest,
                       omf_rad_ord_comp1->array[d.seq]->lExpConfirmRequest
                from
                (dummyt d with seq = size(omf_rad_ord_comp1->array,5))
                With separator = "|", format, append

;End logging records to be deleted JTW


    delete from omf_radrepeat_order_st rr,
        (dummyt d with seq = value(size(omf_rad_ord_comp1->qual,5)))
    set rr.seq = 1
    plan d where
        d.seq > ((x * 5000) - 5000) and
        d.seq <= (x * 5000)
    join rr where
        rr.order_id = omf_rad_ord_comp1->qual[d.seq]->num1
    with nocounter

    insert into omf_radrepeat_order_st rr,
        (dummyt d with seq = value(size(omf_rad_ord_comp1->qual,5))),
        (dummyt d2 with seq = value(maxdata2))
    set rr.omf_radrepeat_order_st_id = seq(omf_seq, nextval),
        rr.order_id = omf_rad_ord_comp1->qual[d.seq]->num1,
        rr.repeat_seq = d2.seq,
        rr.technologist_id = omf_rad_ord_comp1->qual[d.seq]->array[2]->data[d2.seq]->num1,
        rr.reason_cd = omf_rad_ord_comp1->qual[d.seq]->array[2]->data[d2.seq]->num2,
        rr.film_type_cd = omf_rad_ord_comp1->qual[d.seq]->array[2]->data[d2.seq]->num3,
        rr.film_size_cd = omf_rad_ord_comp1->qual[d.seq]->array[2]->data[d2.seq]->num4,
        rr.standard_qty = omf_rad_ord_comp1->qual[d.seq]->array[2]->data[d2.seq]->num5,
        rr.waste_qty = omf_rad_ord_comp1->qual[d.seq]->array[2]->data[d2.seq]->num6,
        rr.updt_dt_tm = cnvtdatetime(curdate, curtime3),
        rr.updt_id = 9319490,  ;JTW
	rr.updt_task = 2100013,  ;JTW
	rr.updt_applctx = 888.51250,  ;JTW
	rr.updt_cnt = omf2.updt_cnt + 1  ;JTW

    plan d where
        d.seq > ((x * 5000) - 5000) and
        d.seq <= (x * 5000)
    join d2 where
        d2.seq <= size(omf_rad_ord_comp1->qual[d.seq]->array[2]->data,5)
    join rr
    with nocounter

    commit
endfor
free set omf_rad_ord_comp1
free set omf_rad_ord_comp
free set script_request
free set script_reply
free set omf_express_list
free set omf_event_list
free set omf_rule_list
free set qual_rule_request
free set qual_request
endif

#END_PROGRAM

end go

