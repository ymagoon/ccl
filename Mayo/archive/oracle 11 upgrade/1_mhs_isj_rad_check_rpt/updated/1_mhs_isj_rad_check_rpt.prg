/*******************************************************************
Report Name: 1_mhs_isj_rad_check_rpt
Report Path: /mayo/mhprd/prg/1_mhs_isj_rad_check_rpt
Report Description: Lists patient from ISJ whose Radiology reports are sent with out image
 
Created by:  Bharti Jain
Created date: 25/12/2009
 
Modified by:Phil Landry Akcia
Modified date: 08/01/2012
Modifications: Performance and Oracle 11 tuning
 
Modified by:
Modified date:
Modifications:
 
*******************************************************************/
 
 
drop program 1_mhs_isj_rad_check_rpt go
create program 1_mhs_isj_rad_check_rpt
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Start Date" = CURDATE
	, "End Date" = CURDATE
 
with OUTDEV, sdate, edate
 
 
/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/
 
/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
free record rec
record rec(
 	1 cnt = i4
	1 qual[*]
		2	pname = vc
		2	mrn = vc
		2	tname = vc
		2	acc_nbr = vc
		2	exam_title = vc
		2 	exam_date = dq8
		2	series_ref_num = vc
)
/**************************************************************
; DVDev Start Coding
**************************************************************/
 
 
;    Your Code Goes Here
select into "nl:"
;ce.CLINICAL_EVENT_ID
;NAME = p.name_full_formatted,
;MRN = pa.alias,
;ce.subtable_bit_map,
;ce.entry_mode_cd,
;ce.event_class_cd,
;ce.event_id,
;ce.parent_event_id,
;ce.series_ref_nbr,
;ce.src_event_id,
;ce.performed_prsnl_id,
;p1.name_full_formatted,
;PERFORM_DATE = ce.performed_dt_tm,
;Accession = ce.accession_nbr,
;EXAM_TITLE = ce.EVENT_TITLE_TEXT "##########################################",
;ce.collating_seq ,
;ce.view_level
from person p,
person p1,
person_alias pa,
clinical_event ce,
order_radiology orad,
ce_linked_result celr
plan orad
where orad.updt_dt_tm between cnvtdatetime(cnvtdate($sdate),0)and cnvtdatetime(cnvtdate($edate),235959)
;where orad.updt_dt_tm between cnvtdatetime("16-DEC-2009 00:00:00") and cnvtdatetime("16-DEC-2009 23:59:59")
   and orad.parent_order_id > 0  ;001
join celr where celr.order_id = orad.parent_order_id
and celr.contributor_system_cd = 469
and celr.updt_dt_tm between cnvtdatetime(cnvtdate($sdate),0)and cnvtdatetime(cnvtdate($edate),235959)
and celr.valid_until_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00")
join ce where  ce.encntr_id = celr.encntr_id
and ce.parent_event_id = celr.event_id
and ce.valid_until_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00")
;and ce.subtable_bit_map != 268435712
join p where ce.person_id = p.person_id
join pa where pa.person_id = p.person_id
and pa.person_alias_type_cd = 10 ; MRN
join p1 where p1.person_id = ce.performed_prsnl_id
order by ce.series_ref_nbr
 
	head report
		rec->cnt  = 0
 		head p.person_id
			rec->cnt = rec->cnt + 1
      	if (mod(rec->cnt,10) = 1)
          stat = alterlist(rec->qual, rec->cnt + 9)
    	endif
    detail
;    if (ce.series_ref_nbr = NULL)
    	rec->qual[rec->cnt].exam_date = cnvtdatetime(ce.performed_dt_tm)
		rec->qual[rec->cnt].tname = p1.name_full_formatted
		rec->qual[rec->cnt].acc_nbr = ce.accession_nbr
		rec->qual[rec->cnt].pname = p.name_full_formatted
		rec->qual[rec->cnt].mrn = pa.alias  ;cnvtalias(pa.alias,pa.alias_pool_cd)
	    rec->qual[rec->cnt].exam_title = ce.event_title_text
	    rec->qual[rec->cnt].series_ref_num  = ce.series_ref_nbr
;	endif
 	foot report
	  stat = alterlist(rec->qual,rec->cnt)
 
with nocounter
/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
call echorecord(rec)
 
Execute reportrtl
%i mhs_prg:1_mhs_isj_rad_check_rpt.dvl
set _SendTo=$1
 
;;if (cnvtlower(substring(1,10,_SendTo)) = "cer_print/"
;;  and cnvtlower(substring(textlen(_SendTo)-3,4,_SendTo)) != ".dat")
;;  set _SendTo = concat(_SendTo,".dat")
;;endif
;
call LayoutQuery(0)
end
go
 
