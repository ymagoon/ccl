drop program bc_mp_mvs_studies_17:dba go
create program bc_mp_mvs_studies_17:dba
/****************************************************************************************************************
                                             PROGRAM NAME HEADER
              Purpose:	Display Studies
     Source File Name:	bc_mp_mvs_studies_17
          Application:	SurgiNet
  Exectuion Locations:	mPages
            Request #:	3 Request Data Structure
      Translated From:	
        Special Notes: 	$RAD_NMBR -> Number of radiology documents to return per set
        			   	$CARD_NMBR -> Number of cardiology documents to return per grouping per set
***************************************************************************************************************/
/****************************************************************************************************************
                                           MODIFICATION CONTROL LOG
										   
  Mod  Date            Engineer                Description
   ---  --------------- ----------------------- ------------------------------------------------
    1   08/01/2011      MediView Solutions      Creation of the program
	2 	mm/dd/yyyy      FirstName LastName      Comments for first modification
	3 	mm/dd/yyyy      FirstName LastName      Comments for first modification

******************************************************************************************************************/ 
prompt 
	"Output to File/Printer/MINE" = "MINE"
	, "USERID" = 0
	, "PERSONID" = 0
	, "ENCNTRID" = 0
	, "OPTIONS" = ""
	, "RAD_NMBR" = 10
	, "CARD_NMBR" = 2
	, "RAD_SET_NMBR" = 1
	, "CARD_SET_NMBR" = 1 

with OUTDEV, USERID, PERSONID, ENCNTRID, OPTIONS, RAD_NMBR, CARD_NMBR, RAD_SET_NMBR, 
	CARD_SET_NMBR

record rad_studies(
	1 cnt = i4
	1 study[*]
		2 event_id = f8
		2 description = vc
		2 date_time = vc
)

record card_studies(
	1 cnt = i4
	1 group[*]
		2 description = vc
		2 cnt = i4
		2 study[*]
			3 event_id = f8
			3 description = vc
			3 date_time = vc
)

record studies(
	1 person_id = f8
	1 encntr_id = f8
	1 rad_set_nmbr = i4
	1 card_set_nmbr = i4
	1 rad_cnt = i4
	1 rad_study[*]
		2 event_id = f8
		2 description = vc
		2 date_time = vc
	1 card_cnt = i4
	1 group[*]
		2 description = vc
		2 cnt = i4
		2 card_study[*]
			3 event_id = f8
			3 description = vc
			3 date_time = vc
)

record events(
	1 cnt = i4
	1 event[*]
		2 event_cd = f8
		2 cnt = i4
)

record view_codes(
	1 cnt = i4
	1 qual[*]
		2 top_event_set_name = vc
		2 event_set_collating_seq = i4
		2 event_set_cd = f8
		2 event_set_name = vc
		2 event_cd = f8
		2 card = i1
		2 rad = i1
)

set studies->person_id = $PERSONID
set studies->encntr_id = $ENCNTRID

select into 'nl:'
from v500_event_set_code ves,
	v500_event_set_canon vesc,
	v500_event_set_code ves2,
	v500_event_set_explode vesx
plan ves
	where ves.event_set_name_key = "ANESTHESIAFLOWSHEETVIEW"
join vesc
	where vesc.parent_event_set_cd = ves.event_set_cd
join ves2
	where ves2.event_set_cd = vesc.event_set_cd
	and ves2.event_set_name_key = "*CARD*"
join vesx
	where vesx.event_set_cd = ves2.event_set_cd
order by vesc.event_set_collating_seq
detail
	cnt = view_codes->cnt + 1
	view_codes->cnt = cnt
	stat = alterlist(view_codes->qual, cnt)
	view_codes->qual[cnt].top_event_set_name = ves2.event_set_name
	view_codes->qual[cnt].event_cd = vesx.event_cd
	view_codes->qual[cnt].event_set_name = uar_get_code_display(vesx.event_cd)
	view_codes->qual[cnt].card = 1
with nocounter

select into 'nl:'
from v500_event_set_code ves,
	v500_event_set_canon vesc,
	v500_event_set_code ves2,
	v500_event_set_explode vesx
plan ves
	where ves.event_set_name_key = "ANESTHESIAFLOWSHEETVIEW"
join vesc
	where vesc.parent_event_set_cd = ves.event_set_cd
join ves2
	where ves2.event_set_cd = vesc.event_set_cd
	and ves2.event_set_name_key = "*RAD*"
join vesx
	where vesx.event_set_cd = ves2.event_set_cd
order by vesc.event_set_collating_seq
detail
	cnt = view_codes->cnt + 1
	view_codes->cnt = cnt
	stat = alterlist(view_codes->qual, cnt)
	view_codes->qual[cnt].top_event_set_name = ves2.event_set_name
	view_codes->qual[cnt].event_cd = vesx.event_cd
	view_codes->qual[cnt].event_set_name = uar_get_code_display(vesx.event_cd)
	view_codes->qual[cnt].rad = 1
with nocounter
;call echorecord(view_codes)

declare view_cnt = i4
declare idx_cnt = i4
declare idx = i4

select into 'nl:'
	group_name = view_codes->qual[d1.seq].top_event_set_name
from (dummyt d1 with seq=view_codes->cnt),
	clinical_event ce
plan d1
	where view_codes->qual[d1.seq].card = 1
join ce
	where ce.person_id = $PERSONID
	and ce.event_cd = view_codes->qual[d1.seq].event_cd
	and ce.view_level = 1
	and ce.valid_from_dt_tm < sysdate
	and ce.valid_until_dt_tm > sysdate
order by  ce.event_cd, ce.collating_seq, ce.updt_dt_tm desc
head group_name
	cnt1 = studies->card_cnt + 1
	studies->card_cnt = cnt1
	stat = alterlist(studies->group, cnt1)
	studies->group[cnt1].description = view_codes->qual[d1.seq].top_event_set_name
detail
	if (cnvtupper(ce.result_val) != "NO")
	idx = locateval(idx_cnt,1,events->cnt,ce.event_cd,events->event[idx].event_cd)
	if (idx < 1)
		cnt3 = events->cnt + 1
		events->cnt = cnt3
		stat = alterlist(events->event, cnt3)
		events->event[cnt3].event_cd = ce.event_cd
		idx = cnt3
	endif
	if (events->event[idx].cnt < 2)
		events->event[idx].cnt = (events->event[idx].cnt + 1)
		cnt2 = studies->group[cnt1].cnt + 1
		studies->group[cnt1].cnt = cnt2
		stat = alterlist(studies->group[cnt1].card_study, cnt2)
		studies->group[cnt1].card_study[cnt2].date_time = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;q")
		studies->group[cnt1].card_study[cnt2].description = uar_get_code_display(ce.event_cd)
		studies->group[cnt1].card_study[cnt2].event_id = ce.event_id
	endif
	endif
with nocounter

select into 'nl:'
	group_name = view_codes->qual[d1.seq].top_event_set_name
from (dummyt d1 with seq=view_codes->cnt),
	clinical_event ce
plan d1
	where view_codes->qual[d1.seq].rad = 1
join ce
	where ce.person_id = $PERSONID
	and ce.event_cd = view_codes->qual[d1.seq].event_cd
	and ce.view_level = 1
	and ce.valid_from_dt_tm < sysdate
	and ce.valid_until_dt_tm > sysdate
order by  ce.event_cd, ce.collating_seq, ce.updt_dt_tm desc

detail
	idx = locateval(idx_cnt,1,events->cnt,ce.event_cd,events->event[idx].event_cd)
	if (idx < 1)
		cnt3 = events->cnt + 1
		events->cnt = cnt3
		stat = alterlist(events->event, cnt3)
		events->event[cnt3].event_cd = ce.event_cd
		idx = cnt3
	endif
	if (events->event[idx].cnt < 2)
		events->event[idx].cnt = (events->event[idx].cnt + 1)
		cnt2 = studies->rad_cnt + 1
		studies->rad_cnt = cnt2
		stat = alterlist(studies->rad_study, cnt2)
		studies->rad_study[cnt2].date_time = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;q")
		studies->rad_study[cnt2].description = uar_get_code_display(ce.event_cd)
		studies->rad_study[cnt2].event_id = ce.event_id
		call echo(ce.result_val)
	endif
with nocounter
call echorecord(events)

call echorecord(studies)

call echojson(studies, $OUTDEV)

end
go
