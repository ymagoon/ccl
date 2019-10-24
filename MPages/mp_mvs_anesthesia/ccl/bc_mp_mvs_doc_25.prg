drop program bc_mp_mvs_doc_25:dba go
create program bc_mp_mvs_doc_25:dba
/****************************************************************************************************************
                                             PROGRAM NAME HEADER
              Purpose:	Display Documentation
     Source File Name:	bc_mp_mvs_doc_25
          Application:	PowerChart and SurgiNet
  Exectuion Locations:	mPages
            Request #:	
      Translated From:	
        Special Notes:
***************************************************************************************************************/
/****************************************************************************************************************
                                           MODIFICATION CONTROL LOG
										   
  Mod  Date            Engineer                Description
   ---  --------------- ----------------------- ------------------------------------------------
    1   08/25/2011      MediView Solutions      Creation of the program
	2 	mm/dd/yyyy      FirstName LastName      Comments for first modification
	3 	mm/dd/yyyy      FirstName LastName      Comments for first modification

******************************************************************************************************************/ 
prompt 
	"Output to File/Printer/MINE" = "MINE"
	, "USERID" = 0
	, "PERSONID" = 0
	, "ENCNTRID" = 0
	, "OPTIONS" = "" 

with OUTDEV, USERID, PERSONID, ENCNTRID, OPTIONS

free record documents
record documents(
	1 person_id = f8
	1 encntr_id = f8
	1 start_search_dt_tm = dq9
	1 cnt = i4
	1 group[*]
		2 description = vc
		2 cnt = i4
		2 doc[*]
			3 title = vc
			3 orderable = vc
			3 date = vc
			3 event_id = f8
			3 author = vc
			3 published = i1
			3 status = vc
)

declare NURSING_98_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",98,"CLINICALDOCUMENTS")),protect
declare DOC_53_CV = f8
	with constant(uar_get_code_by("MEANING",53,"DOC")),protect

declare CLINICALDOCUMENTS_93_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",93,"CLINICALDOCUMENTS")),protect
declare CLINICALDOC_93_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",93,"CLINICALDOC")),protect
	

declare INERRNOMUT_CV = f8
	with constant(uar_get_code_by("MEANING",8,"INERRNOMUT")),protect
declare INERRNOVIEW_CV = f8
	with constant(uar_get_code_by("MEANING",8,"INERRNOVIEW")),protect
declare INERROR_CV = f8
	with constant(uar_get_code_by("MEANING",8,"INERROR")),protect
			
select into 'nl:'
from encounter e
plan e
	where e.encntr_id = $ENCNTRID
	and e.person_id = $PERSONID
detail
	documents->person_id = e.person_id
	documents->encntr_id = e.encntr_id
	documents->start_search_dt_tm = cnvtlookbehind("24,H",e.reg_dt_tm)
with nocounter

select into 'nl:'
	grp_name = uar_get_code_display(vesc2.event_set_cd)
from code_value cv,
	clinical_event ce,
	clinical_event ce_p,
	prsnl p,
	v500_event_set_explode exp,
	v500_event_set_canon vesc,
	v500_event_set_canon vesc2
plan cv
	where cv.code_set = 93
	and cv.display_key = "PHYSICIANROUNDSVIEW"
;	and (cv.display_key = "*DISCHARGE*"
;	or cv.display_key = "*OPERATIVE*"
;	or cv.display_key = "*HISTORY*"
;	or cv.display_key = "*PHYSICAL*"
;	or cv.display_key = "*CONSULT*")
join vesc2
;	where vesc2.parent_event_set_cd = cv.code_value
	where vesc2.event_set_cd = cv.code_value
join vesc
	where vesc.parent_event_set_cd = vesc2.event_set_cd
join exp
	where exp.event_set_cd = vesc.event_set_cd
join ce
	where ce.person_id = documents->person_id
;	and ce.encntr_id +0 = documents->encntr_id
	and ce.event_cd = exp.event_cd
	and ce.event_end_dt_tm >= cnvtdatetime(documents->start_search_dt_tm)
	and ce.valid_from_dt_tm < sysdate
	and ce.valid_until_dt_tm > sysdate
;	and ce.event_class_cd = DOC_53_CV
	and not ce.result_status_cd in (INERRNOMUT_CV, INERRNOVIEW_CV, INERROR_CV)
	and ce.publish_flag = 1
join ce_p
	where ce_p.event_id = ce.parent_event_id
	and ce_p.event_end_dt_tm >= cnvtdatetime(documents->start_search_dt_tm)
	and ce_p.valid_from_dt_tm < sysdate
	and ce_p.valid_until_dt_tm > sysdate
	and not ce_p.result_status_cd in (INERRNOMUT_CV, INERRNOVIEW_CV, INERROR_CV)
join p
	where p.person_id = ce.verified_prsnl_id
order by grp_name, ce.event_end_dt_tm desc
head grp_name
	cnt = documents->cnt + 1
	documents->cnt = cnt
	stat = alterlist(documents->group, cnt)
	documents->group[cnt].description = grp_name
head ce_p.event_id
	cnt2 = documents->group[cnt].cnt + 1
	documents->group[cnt].cnt = cnt2
	stat = alterlist(documents->group[cnt].doc, cnt2)
	documents->group[cnt].doc[cnt2].event_id = ce_p.event_id
;	documents->group[cnt].doc[cnt2].title = ce_p.event_tag
	documents->group[cnt].doc[cnt2].title = uar_get_code_display(ce_p.event_cd)
	documents->group[cnt].doc[cnt2].author = trim(p.name_full_formatted)
	documents->group[cnt].doc[cnt2].date = format(ce_p.event_end_dt_tm, "mm/dd/yyyy hh:mm;;q")
	documents->group[cnt].doc[cnt2].published = ce_p.publish_flag
	documents->group[cnt].doc[cnt2].status = uar_get_code_display(ce_p.result_status_cd)
with nocounter

call echojson(documents, $OUTDEV)

end
go
