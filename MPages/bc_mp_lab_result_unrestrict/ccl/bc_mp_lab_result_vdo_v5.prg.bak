drop program bc_mp_lab_result_vdo go
create program  bc_mp_lab_result_vdo

prompt 
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to. 

with OUTDEV, PERSON_ID


/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/

/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
DECLARE ACTV_48_CV      	= f8 WITH CONSTANT(uar_get_code_by("MEANING",48,"ACTIVE")),Protect
declare MODIFIED_8_CV		= f8 with public, constant(uar_get_code_by("MEANING", 8, "MODIFIED"))
declare ALTERED_8_CV   		= f8 with public, constant(uar_get_code_by("MEANING", 8, "ALTERED"))
declare AUTH_8_CV      		= f8 with public, constant(uar_get_code_by("MEANING", 8, "AUTH"))
DECLARE ABN_CS_52 			= F8 WITH public, CONSTANT(uar_get_code_by("DISPLAYKEY",52,"ABN"))
declare CRIT_CS_52 			= f8 with public, constant(uar_get_code_by("DISPLAYKEY", 52, "CRIT"))
declare HI_CS_52 			= f8 with public, constant(uar_get_code_by("DISPLAYKEY", 52, "HI"))
declare LOW_CS_52 			= f8 with public, constant(uar_get_code_by("DISPLAYKEY", 52, "LOW"))

/**************************************************************
; DVDev Start Coding
**************************************************************/

DECLARE PID = F8
SET PID = $PERSON_ID

free record LabCodeSet
record LabCodeSet(
1 rec_cnt = i4
1 rec[*]
	2 ParentName = vc
	2 Parent_CD = f8
	2 Event_CD = f8
	2 Col_Seq = i4
)



free record temp
record temp(
1 patient_name = vc
1 rec_cnt = i4
1 rec[*]
	2 OutReach = i2 ;Yes or No
	2 event_id = f8
	2 event_cd = f8
	2 event_type = vc
	2 event_result = vc
	2 event_dt = vc
	2 event_status = vc
	2 normal_low = vc
	2 normal_high = vc
;	2 crit_low = vc
;	2 crit_high = vc
	2 normalcy = vc
	2 family = vc
	2 col_seq = i4
;	2 crit_high_low = i2
;	2 norm_high_low = i2
)	




/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/

/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/

/**************************************************************
; DVDev Start Coding
**************************************************************/

;get the Lab family
SELECT INTO "NL:"
	 	ParentName = uar_get_code_display(esc.event_set_cd)
		, Parent_CD = esc.event_set_cd
		 ,Event_CD = vese.event_cd
		, Col_Seq = esc.event_set_collating_seq
FROM
	V500_EVENT_SET_CODE   ES
	 ,v500_event_set_canon ESC
	 ,v500_event_set_canon ESC_2
	 ,v500_event_set_explode vese

PLAN ES
	WHERE ES.event_set_cd_disp = "LABORATORY"
JOIN ESC
	WHERE ES.event_set_cd = esc.parent_event_set_cd
JOIN ESC_2
	WHERE esc_2.parent_event_set_cd = esc.event_set_cd
JOIN VESE
	WHERE VESE.event_set_cd = esc_2.event_set_cd	
ORDER BY esc.parent_event_set_cd,  esc.event_set_collating_seq
head report	
	rcnt = 0
	;recordset management
detail
	rcnt = rcnt + 1
	if(mod(rcnt, 100) = 1)
		stat = alterlist(LabCodeSet->rec, rcnt + 99)
	endif
	
	LabCodeSet->rec[rcnt].ParentName = trim(substring(1, 50, ParentName))
	LabCodeSet->rec[rcnt].Parent_CD = Parent_CD
	LabCodeSet->rec[rcnt].Event_CD = Event_CD
	LabCodeSet->rec[rcnt].Col_Seq  = Col_Seq
	
foot report
	;finalizing recordset
	LabCodeSet->rec_cnt = rcnt
	stat = alterlist(LabCodeSet->rec, LabCodeSet->rec_cnt)
with format, time = 30
;
;;set the person name
SELECT INTO "NL:"
FROM PERSON P
WHERE P.person_id = PID
DETAIL
	temp->patient_name = p.name_full_formatted
WITH FORMAT, TIME = 30
;
;;    Your Code Goes Here


SELECT INTO "NL:"
;ce.person_id, ce.event_id,
	ce.event_end_dt_tm "mm/dd/yyyy hh:mm"
	, ce.event_cd
;	, event = uar_get_code_display(ce.event_cd), ce.result_val, ce.series_ref_nbr
	

FROM
	encounter   e
	, clinical_event   ce
	, (DUMMYT   D1  WITH SEQ = VALUE(SIZE(LABCODESET->rec, 5)))

;	, v500_event_set_canon cd
plan D1
;	where e.person_id = PID 
;	and e.active_ind = 1
join ce
;	where ce.encntr_id = e.encntr_id	
	where  ce.person_id = PID
	;and ce.event_cd =      671447.00
	and ce.event_cd = LABCODESET->rec[D1.SEQ].Event_CD
	and ce.record_status_cd = ACTV_48_CV
	and ce.result_status_cd+0 in (AUTH_8_CV, MODIFIED_8_CV) ; IN  (25.0,35.0)
	and ce.view_level = 1
	and ce.publish_flag = 1
	and ce.valid_from_dt_tm < cnvtdatetime(curdate, curtime)
	and ce.valid_until_dt_tm >  cnvtdatetime(curdate, curtime)
	and ce.event_title_text != "Date\Time Correction"
join E
	WHERE e.encntr_id = ce.encntr_id
	and e.active_ind = 1
ORDER BY
	LABCODESET->rec[D1.SEQ].Parent_CD, LABCODESET->rec[D1.SEQ].Col_Seq
		, ce.event_end_dt_tm 

head report	
	rcnt = 0
	;recordset management
detail
	rcnt = rcnt + 1
	if(mod(rcnt, 10) = 1)
		stat = alterlist(temp->rec, rcnt + 9)
	endif	
	
	if (e.loc_facility_cd IN (33177303.0
								,650505.0
								,650500.0
								,650487.0
								,650507.0
								,650510.0
								,650519.0
								,650513.0
								,109831802.0
								,650518.0)
							 )
		temp->rec[rcnt].OutReach = 0
	else
		temp->rec[rcnt].OutReach = 1					
	endif						
	temp->rec[rcnt].event_cd = ce.event_cd
	temp->rec[rcnt].event_dt = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;q")
	temp->rec[rcnt].event_id = ce.event_id
	temp->rec[rcnt].event_result =trim(ce.event_tag) ;result on flowsheet
	temp->rec[rcnt].event_status = uar_get_code_display(ce.result_status_cd)
	temp->rec[rcnt].event_type 	= uar_get_code_display(ce.event_cd)
	temp->rec[rcnt].normal_high = ce.normal_high
	temp->rec[rcnt].normal_low = ce.normal_low
;	temp->rec[rcnt].crit_high = ce.critical_high
;	temp->rec[rcnt].crit_low = ce.critical_low
	temp->rec[rcnt].family = trim(substring(1, 50, LABCODESET->rec[D1.SEQ].ParentName))
	temp->rec[rcnt].col_seq = LABCODESET->rec[D1.SEQ].Col_Seq
;	if (ce.normalcy_cd = CRIT_CS_52)
;			temp->rec[rcnt].crit_high_low = 1
;	endif
;	if (ce.normalcy_cd in (HI_CS_52, LOW_CS_52))
;			temp->rec[rcnt].norm_high_low = 1
;	endif
;
	temp->rec[rcnt].normalcy = uar_get_code_display(ce.normalcy_cd)
foot report
	;finalizing recordset
	temp->rec_cnt = rcnt
	stat = alterlist(temp->rec, temp->rec_cnt)

WITH format, time = 180

/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
;	call echorecord(temp)

call echojson(TEMP, $OUTDEV) 
end
go

