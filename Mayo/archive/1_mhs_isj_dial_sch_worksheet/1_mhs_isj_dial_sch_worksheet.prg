/*******************************************************************
 
Report Name:  Lab Hemo Worksheet
Report Path:  /mayo/mhprd/prg/ 1_mhs_isj_dial_sch_worksheet.prg
Report Description:ISJ Hemodialysis Schedule Worksheet - Go Live Report
Detail Description: The report is needed because nursing staff are using available computers for patient
documentation during the setup times between patients.
 
Created by: Bharti Jain , M061596
Created date:  06/18/2009
 
Modified by:m061596
Modified date:10/07/09
Modifications:Modified the base query to qualify on encounter table first and added the DTS_CD qualification as a
seperate query
 
*******************************************************************/
 
drop program 1_mhs_isj_dial_sch_worksheet:dba go
create program 1_mhs_isj_dial_sch_worksheet:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Patient Location" = ""
 
with OUTDEV, loc
 
/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/
 
declare PAT_MRN_CD = f8 with public, constant(uar_get_code_by("MEANING",4,"MRN"))
declare PAT_FIN_CD = f8 with public, constant(uar_get_code_by("MEANING",319,"FIN NBR"))
declare DTS_CD = f8 with public,constant(uar_get_code_by("DISPLAYKEY",72,"DIALYSISTREATMENTSCHEDULE"))
declare DAT_CD = f8 with public,constant(uar_get_code_by("DISPLAYKEY",72,"DIALYSISACCESS1TYPE"))
declare DIALYZER_CD = f8 with public,constant(uar_get_code_by("DISPLAYKEY",72,"DIALYZER"))
declare DF_CD = f8 with public,constant(uar_get_code_by("DISPLAYKEY",72,"DIALYSATEFLOWRATE"))
declare SOD_CD = f8 with public,constant(uar_get_code_by("DISPLAYKEY",72,"DIALYSATESODIUM"))
declare POTA_CD = f8 with public,constant(uar_get_code_by("DISPLAYKEY",72,"DIALYSATEPOTASSIUMCALCIUM"))
 
 
/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
 
free record rec
record rec(
 	1 cnt = i4
	1 qual[*]
		2 name = vc
		2 first_name = vc
		2 person_id = f8
		2 name_last = vc
		2 updt = dq8
		2 fin_cd = vc
		2 mrn_cd = vc
		2 sex_cd = vc
		2 age_cd = vc
		2 dat_cd = vc
		2 dts_cd = vc
		2 dialyzer_cd = vc
		2 df_cd = vc
		2 sod_cd = vc
		2 pota_cd = vc
)
 
/**************************************************************
; DVDev Start Coding
**************************************************************/
 
 
;    Your Code Goes Here
 
set report_run_date_disp = format(curdate, "mm/dd/yy;;d")
set report_run_time_disp = format(curtime, "hh:mm;;m" )
declare date_time = vc
set date_time  = concat(report_run_date_disp," ",report_run_time_disp)
 
select into "nl:"
from
person p,
encounter e,
person_alias pa,
encntr_alias ea
;clinical_event cv1
;,clinical_event cv2
 
;plan cv1 where cv1.event_cd = DTS_CD
;and cv1.event_tag != "Other*"
Plan e; where e.encntr_id= cv1.encntr_id
where e.location_cd = cnvtint($loc) ;in (select code_value from code_value where code_set = 220 and display = "MA*")
and e.encntr_status_cd != 856 ; qualifier for discharge (07/15/2009)
and e.encntr_type_cd = 26160276.00 ; Hospital reoccuring patient
and e.active_ind = 1
;join cv2 where cv2.event_cd = DTS_CD
;and cv2.encntr_id = e.encntr_id
;and cv2.event_tag != "Other*"
;and e.location_cd =    24989542.0
join ea where ea.encntr_id = e.encntr_id
and ea.encntr_alias_type_cd = PAT_FIN_CD
join p where p.person_id= e.person_id
join pa where pa.person_id = p.person_id
and pa.person_alias_type_cd = PAT_MRN_CD
order by p.name_last, p.name_first ;, e.encntr_id
;,cv1.updt_dt_tm desc
 
	head report
	rec->cnt  = 0
	head p.person_id
		rec->cnt = rec->cnt + 1
   	if (mod(rec->cnt,10) = 1)
          stat = alterlist(rec->qual, rec->cnt + 9)
   	endif
    detail
    rec->qual[rec->cnt].name = p.name_full_formatted
    rec->qual[rec->cnt].first_name = p.name_first
    rec->qual[rec->cnt].person_id = p.person_id
    rec->qual[rec->cnt].name_last = p.name_last
    rec->qual[rec->cnt].fin_cd = cnvtalias(ea.alias,ea.alias_pool_cd);ea.alias
    rec->qual[rec->cnt].mrn_cd = cnvtalias(pa.alias,pa.alias_pool_cd);pa.alias
 ;   rec->qual[rec->cnt].updt = cv1.updt_dt_tm
    rec->qual[rec->cnt].sex_cd = UAR_GET_CODE_DISPLAY(p.sex_cd)
    rec->qual[rec->cnt].age_cd = cnvtage(p.birth_dt_tm)
 ;   rec->qual[rec->cnt].dts_cd = cv1.event_tag
 
   	foot report
	stat = alterlist(rec->qual,rec->cnt)
 
with nocounter, format, separator = " "
 
select into "nl:"
from (dummyt d with seq = value(rec->cnt)),
clinical_event cv1
 
plan d
join cv1 where cv1.event_cd = DTS_CD
;and cv1.event_tag != "Other*"
and cv1.person_id = rec->qual[d.seq].person_id
order by cv1.updt_dt_tm
    detail
    rec->qual[d.seq].dts_cd = cv1.event_tag
    rec->qual[d.seq].updt = cv1.updt_dt_tm
with nocounter
 
select into "nl:"
from (dummyt d with seq = value(rec->cnt)),
clinical_event cv1
 
plan d
join cv1 where cv1.event_cd = 25021848;DAT_CD
and cv1.person_id = rec->qual[d.seq].person_id
    detail
    rec->qual[d.seq].dat_cd = cv1.event_tag
 
with nocounter
 
select into "nl:"
from (dummyt d with seq = value(rec->cnt)),
clinical_event cv1
 
plan d
join cv1 where cv1.event_cd = DIALYZER_CD
and cv1.person_id = rec->qual[d.seq].person_id
    detail
    rec->qual[d.seq].dialyzer_cd = cv1.event_tag
 
with nocounter
 
select into "nl:"
from (dummyt d with seq = value(rec->cnt)),
clinical_event cv1
 
plan d
join cv1 where cv1.event_cd = DF_CD
and cv1.person_id = rec->qual[d.seq].person_id
    detail
    rec->qual[d.seq].dF_cd = cv1.event_tag
 
with nocounter
 
select into "nl:"
from (dummyt d with seq = value(rec->cnt)),
clinical_event cv1
 
plan d
join cv1 where cv1.event_cd = SOD_CD
and cv1.person_id = rec->qual[d.seq].person_id
    detail
    rec->qual[d.seq].SOD_cd = cv1.result_val
 
with nocounter
 
select into "nl:"
from (dummyt d with seq = value(rec->cnt)),
clinical_event cv1
 
plan d
join cv1 where cv1.event_cd =  POTA_CD
and cv1.person_id = rec->qual[d.seq].person_id
    detail
    rec->qual[d.seq].POTA_cd = cv1.event_tag
 
with nocounter
 
 
/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
 
call echorecord(rec)
Execute reportrtl
%i mhs_prg:1_mhs_isj_dial_sch_worksheet.dvl
set _SendTo=$1
 
;;if (cnvtlower(substring(1,10,_SendTo)) = "cer_print/"
;;  and cnvtlower(substring(textlen(_SendTo)-3,4,_SendTo)) != ".dat")
;;  set _SendTo = concat(_SendTo,".dat")
;;endif
;
call LayoutQuery(0)
 
end
go
 
 
 
 
 
;/*******************************************************************
;
;Report Name:  Dialysis Schedule Worksheet
;Report Path:  /mayo/mhprd/prg/1_mhs_isj_dial_sch_worksheet.prg
;Report Description:  Displays all patients with hemodialysis prescription on the powerform for previous day (CAB: 6397)
;
;Created by: Bharti Jain , M061596
;Created date:  07/10/2009
;
;Modified by:
;Modified date:
;Modifications:
;
;*******************************************************************/
;
 
;
;drop program 1_mhs_isj_dial_sch_worksheet go
;create program 1_mhs_isj_dial_sch_worksheet
;
;prompt
;	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
;
;with OUTDEV
;
;
;/**************************************************************
;; DVDev DECLARED SUBROUTINES
;**************************************************************/
;
;declare PAT_MRN_CD = f8 with public, constant(uar_get_code_by("MEANING",4,"MRN"))
;declare PAT_FIN_CD = f8 with public, constant(uar_get_code_by("MEANING",319,"FIN NBR"))
;declare DTS_CD = f8 with public,constant(uar_get_code_by("DISPLAYKEY",72,"DIALYSISTREATMENTSCHEDULE"))
;declare DAT_CD = f8 with public,constant(uar_get_code_by("DISPLAYKEY",72,"DIALYSISACCESS1TYPE"))
;declare DIALYZER_CD = f8 with public,constant(uar_get_code_by("DISPLAYKEY",72,"DIALYZER"))
;declare DF_CD = f8 with public,constant(uar_get_code_by("DISPLAYKEY",72,"DIALYSATEFLOWRATE"))
;declare SOD_CD = f8 with public,constant(uar_get_code_by("DISPLAYKEY",72,"DIALYSATESODIUM"))
;declare POTA_CD = f8 with public,constant(uar_get_code_by("DISPLAYKEY",72,"DIALYSATEPOTASSIUMCALCIUM"))
;
;
;/**************************************************************
;; DVDev DECLARED VARIABLES
;**************************************************************/
;
;free record rec
;record rec(
; 	1 cnt = i4
;	1 qual[*]
;		2 name = vc
;		2 first_name = vc
;		2 person_id = f8
;		2 name_last = vc
;		2 updt = dq8
;		2 fin_cd = vc
;		2 mrn_cd = vc
;		2 sex_cd = vc
;		2 age_cd = vc
;		2 dat_cd = vc
;		2 dts_cd = vc
;		2 dialyzer_cd = vc
;		2 df_cd = vc
;		2 sod_cd = vc
;		2 pota_cd = vc
;		;2 cal_cd = vc
;	)
;
;/**************************************************************
;; DVDev Start Coding
;**************************************************************/
;
;
;;    Your Code Goes Here
;
;set report_run_date_disp = format(curdate, "mm/dd/yy;;d")
;set report_run_time_disp = format(curtime, "hh:mm;;m" )
;declare date_time = vc
;set date_time  = concat(report_run_date_disp," ",report_run_time_disp)
;
;select into "nl:"
;from
;person p,
;encounter e,
;person_alias pa,
;encntr_alias ea,
;clinical_event cv1
;
;plan cv1 where cv1.event_cd = DTS_CD
;;and cv1.updt_dt_tm between cnvtdatetime(cnvtdate(062709),0) and cnvtdatetime(cnvtdate(062709),2359)
;and cv1.updt_dt_tm between cnvtdatetime(curdate-1,0) and cnvtdatetime(curdate-1,2359)
;join e where e.encntr_id= cv1.encntr_id
;and e.location_cd in (select code_value from code_value where code_set = 220 and display = "MA*")
;join ea where ea.encntr_id = e.encntr_id
;and ea.encntr_alias_type_cd = PAT_FIN_CD
;join p where p.person_id= e.person_id
;join pa where pa.person_id = p.person_id
;and pa.person_alias_type_cd = PAT_MRN_CD
;order by cv1.updt_dt_tm desc
;
;	head report
;	rec->cnt  = 0
;	head p.person_id
;		rec->cnt = rec->cnt + 1
;   	if (mod(rec->cnt,10) = 1)
;          stat = alterlist(rec->qual, rec->cnt + 9)
;   	endif
;    detail
;    rec->qual[rec->cnt].name = p.name_full_formatted
;    rec->qual[rec->cnt].first_name = p.name_first
;    rec->qual[rec->cnt].person_id = p.person_id
;    rec->qual[rec->cnt].name_last = p.name_last
;    rec->qual[rec->cnt].fin_cd = cnvtalias(ea.alias,ea.alias_pool_cd);ea.alias
;    rec->qual[rec->cnt].mrn_cd = cnvtalias(pa.alias,pa.alias_pool_cd);pa.alias
;    rec->qual[rec->cnt].updt = cv1.updt_dt_tm
;    rec->qual[rec->cnt].sex_cd = UAR_GET_CODE_DISPLAY(p.sex_cd)
;    rec->qual[rec->cnt].age_cd = cnvtage(p.birth_dt_tm)
;    rec->qual[rec->cnt].dts_cd = cv1.event_tag
;
;   	foot report
;	stat = alterlist(rec->qual,rec->cnt)
;
;with nocounter, format, separator = " "
;
;select into "nl:"
;from (dummyt d with seq = value(rec->cnt)),
;clinical_event cv1
;
;plan d
;join cv1 where cv1.event_cd = 25021848;DAT_CD
;and cv1.person_id = rec->qual[d.seq].person_id
;;and cv1.updt_dt_tm between cnvtdatetime(cnvtdate(062709),0) and cnvtdatetime(cnvtdate(062709),2359)
;and cv1.updt_dt_tm between cnvtdatetime(curdate-1,0) and cnvtdatetime(curdate-1,2359)
;    detail
;    rec->qual[d.seq].dat_cd = cv1.event_tag
;
;with nocounter
;
;select into "nl:"
;from (dummyt d with seq = value(rec->cnt)),
;clinical_event cv1
;
;plan d
;join cv1 where cv1.event_cd = DIALYZER_CD
;and cv1.person_id = rec->qual[d.seq].person_id
;;and cv1.updt_dt_tm between cnvtdatetime(cnvtdate(062709),0) and cnvtdatetime(cnvtdate(062709),2359)
;and cv1.updt_dt_tm between cnvtdatetime(curdate-1,0) and cnvtdatetime(curdate-1,2359)
;    detail
;    rec->qual[d.seq].dialyzer_cd = cv1.event_tag
;
;with nocounter
;
;select into "nl:"
;from (dummyt d with seq = value(rec->cnt)),
;clinical_event cv1
;
;plan d
;join cv1 where cv1.event_cd = DF_CD
;and cv1.person_id = rec->qual[d.seq].person_id
;;and cv1.updt_dt_tm between cnvtdatetime(cnvtdate(062709),0) and cnvtdatetime(cnvtdate(062709),2359)
;and cv1.updt_dt_tm between cnvtdatetime(curdate-1,0) and cnvtdatetime(curdate-1,2359)
;    detail
;    rec->qual[d.seq].dF_cd = cv1.event_tag
;
;with nocounter
;
;select into "nl:"
;from (dummyt d with seq = value(rec->cnt)),
;clinical_event cv1
;
;plan d
;join cv1 where cv1.event_cd = SOD_CD
;and cv1.person_id = rec->qual[d.seq].person_id
;;and cv1.updt_dt_tm between cnvtdatetime(cnvtdate(062709),0) and cnvtdatetime(cnvtdate(062709),2359)
;and cv1.updt_dt_tm between cnvtdatetime(curdate-1,0) and cnvtdatetime(curdate-1,2359)
;    detail
;    rec->qual[d.seq].SOD_cd = cv1.result_val
;
;with nocounter
;
;select into "nl:"
;from (dummyt d with seq = value(rec->cnt)),
;clinical_event cv1
;
;plan d
;join cv1 where cv1.event_cd =  POTA_CD
;and cv1.person_id = rec->qual[d.seq].person_id
;;and cv1.updt_dt_tm between cnvtdatetime(cnvtdate(062709),0) and cnvtdatetime(cnvtdate(062709),2359)
;and cv1.updt_dt_tm between cnvtdatetime(curdate-1,0) and cnvtdatetime(curdate-1,2359)
;    detail
;    rec->qual[d.seq].POTA_cd = cv1.event_tag
;
;with nocounter
;
;
;/**************************************************************
;; DVDev DEFINED SUBROUTINES
;**************************************************************/
;
;call echorecord(rec)
;Execute reportrtl
;%i mhs_prg:1_mhs_isj_dial_sch_worksheet.dvl
;set _SendTo=$1
;
;;;if (cnvtlower(substring(1,10,_SendTo)) = "cer_print/"
;;;  and cnvtlower(substring(textlen(_SendTo)-3,4,_SendTo)) != ".dat")
;;;  set _SendTo = concat(_SendTo,".dat")
;;;endif
;;
;call LayoutQuery(0)
;
;end
;go
;
