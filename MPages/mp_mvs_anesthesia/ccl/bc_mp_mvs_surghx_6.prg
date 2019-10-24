DROP PROGRAM   bc_mp_mvs_surghx_6:DBA  GO
CREATE PROGRAM  bc_mp_mvs_surghx_6:DBA

/**************************************************************************************************
              Purpose: Patient Surgical History Information in ED MPage
     Source File Name: bc_mp_mvs_surghx_6.PRG
          Application: FirstNet 
  Execution Locations: FirstNet ED MPage  Genview ED Patient Summary Tab
            Request #:  
      Translated From:  
        Special Notes:
**************************************************************************************************/
/**************************************************************************************************
  Mod  Date            Engineer                Description
   ---  --------------- ----------------------- --------------------------------------------------
    1   06/07/2011      MediView Solutions      Initial Release
	2 	mm/dd/yyyy      FirstName LastName      Comments for first modification

**************************************************************************************************/

prompt 
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "USERID" = 0
	, "PERSONID" = 0
	, "ENCNTRID" = 0
	, "OPTIONS" = "" 

with OUTDEV, USERID, PERSONID, ENCNTRID, OPTIONS


RECORD SURGHX(
	1 person_id = f8
	1 encntr_id = f8
	1 rec_cnt 			= i2
	1 NO_SHX			= vc
	1 SURG_LIST[*]
		2 surg_type		= vc
		2 surg_cnt		= i2
		2 SURGERY[*]
			3 surg_name	= vc
			3 surg_dt		= vc
	1 actual_surg_cnt = i4
	1 actual_surg_list[*]
		2 surg_case_id = f8
		2 surg_dt = vc
		2 surg_name = vc
)
 
DECLARE INERROR_8_CV	= f8 WITH CONSTANT(uar_get_code_by("MEANING",8,"INERROR")),Protect
DECLARE INERROR2_8_CV  	= f8 WITH  PUBLIC , CONSTANT ( UAR_GET_CODE_BY ( "MEANING" ,  8 , "IN ERROR" ))
DECLARE NOTDONE_8_CV  	= f8 WITH  PUBLIC , CONSTANT ( UAR_GET_CODE_BY ( "MEANING" ,  8 ,  "NOT DONE" ))
 
DECLARE ACTV_48_CV   	= f8 WITH Constant(uar_get_code_by("MEANING",48,"ACTIVE")),Protect
 
DECLARE edpthist_72_CV 	= f8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"EDPATIENTHISTORY"))
DECLARE prevsurg_72_CV 	= f8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"NONEPREVSURG"))
 
DECLARE SURG_Counter = I4 WITH PUBLIC, NOCONSTANT(0) ;A counter for loading the recordset
DECLARE LIST_Counter = I4 WITH PUBLIC, NOCONSTANT(0) ;A counter for loading the recordset
  
SELECT INTO "NL:"
   E.PERSON_ID
FROM ENCOUNTER  E
PLAN  E
	WHERE E.ENCNTR_ID = $ENCNTRID
HEAD REPORT
	surghx->person_id = e.person_id
	surghx->encntr_id = e.encntr_id
WITH  NOCOUNTER
 
SELECT DISTINCT INTO "NL:"
	ce.event_id,
	ce.parent_event_id,
	ce.event_cd,
	ce.event_title_text,
	ce.event_tag,
	ce.result_val,
	ce.event_end_dt_tm "@SHORTDATETIME",
	ce_col = ce.collating_seq,
	ce2.event_id,
	ce2.parent_event_id,
	ce2.event_cd,
	ce2.event_title_text,
	ce2.event_tag,
	ce2.result_val,
	ce2_col = ce2.collating_seq,
	ce3.event_id,
	ce3.parent_event_id,
	ce3.event_cd,
	ce3.event_title_text,
	ce3.event_tag,
	ce3.result_val,
	ce3_col = ce3.collating_seq,
	ce4.event_id,
	ce4.parent_event_id,
	ce4.event_cd,
	ce4.event_title_text,
	ce4.event_tag,
	ce4.result_val,
	ce4_col = ce4.collating_seq,
	ce5.event_id,
	ce5.parent_event_id,
	ce5.event_cd,
	ce5.event_title_text,
	ce5.event_tag,
	ce5.result_val,
	ce5_col = ce5.collating_seq,
	ce5.event_end_dt_tm "@SHORTDATETIME"
 
FROM
	clinical_event ce,
	clinical_event ce2,
	clinical_event ce3,
	clinical_event ce4,
	clinical_event ce5
 
PLAN ce WHERE ce.person_id = $PERSONID
  AND ce.encntr_id +0 = $ENCNTRID
  AND ce.event_cd =   edpthist_72_CV ;112139042.00
  AND ce.event_end_dt_tm < CNVTDATETIME(curdate,curtime3)
  AND ce.valid_until_dt_tm = cnvtdatetime(cnvtdate(12312100),0000)
  AND NOT ce.result_status_cd IN (INERROR_8_CV ,INERROR2_8_CV, NOTDONE_8_CV);(28,31,36)
 
JOIN ce2 WHERE ce2.parent_event_id = ce.event_id
  AND ce2.event_title_text = "FN Surgical History P2" ;Section of ED PT HIST PF
  AND ce2.valid_until_dt_tm = cnvtdatetime(cnvtdate(12312100),0000)
 
JOIN ce3 WHERE ce3.parent_event_id = ce2.event_id
  AND ce3.valid_until_dt_tm = cnvtdatetime(cnvtdate(12312100),0000)
 
JOIN ce4 WHERE ce4.parent_event_id = ce3.event_id
  AND ce4.valid_until_dt_tm = cnvtdatetime(cnvtdate(12312100),0000)
 
JOIN ce5 WHERE ce5.parent_event_id = ce4.event_id
  AND ce5.valid_until_dt_tm = cnvtdatetime(cnvtdate(12312100),0000)
  AND NOT ce.result_status_cd IN (INERROR_8_CV ,INERROR2_8_CV, NOTDONE_8_CV);(28,31,36)
 
ORDER BY ce.event_end_dt_tm desc,
	ce.collating_seq,
	ce2.collating_seq,
	ce3.collating_seq,
	ce4.collating_seq,
	ce5.parent_event_id,
	ce5.collating_seq
 
HEAD REPORT
 
	STAT = ALTERLIST(SURGHX->SURG_LIST,10)
 
HEAD ce3.event_tag
 
	SURGHX->rec_cnt = SURGHX->rec_cnt + 1
	LIST_Counter = SURGHX->rec_cnt
 
 ;check for available memory in the department list
 IF(MOD(LIST_Counter,10) = 1 AND LIST_Counter > 10)
	;if needed allocate memory for 10 more encounters
    STAT = ALTERLIST(SURGHX->SURG_LIST, LIST_Counter + 9)
 ENDIF
 
 IF(ce3.event_tag = "Previous Surgery History*")
    SURGHX->SURG_LIST[LIST_Counter].surg_type = CONCAT("Other ",REPLACE(TRIM(ce3.event_tag),"Grid"," ",2))
 ELSE
   SURGHX->SURG_LIST[LIST_Counter].surg_type = REPLACE(TRIM(ce3.event_tag),"Grid"," ",2)
 ENDIF
 
 ;Previous Surgery History Grid -ce3
 ;Previous Surgery History Row -ce4
 
HEAD ce5.parent_event_id
 
 SURGHX->SURG_LIST[LIST_Counter].surg_cnt = SURGHX->SURG_LIST[LIST_Counter].surg_cnt + 1
 SURG_Counter = SURGHX->SURG_LIST[LIST_Counter].surg_cnt
 
  ;check for available memory in the department list
 IF(MOD(SURG_Counter,10) = 1)
	;if needed allocate memory for 10 more encounters
    STAT = ALTERLIST(SURGHX->SURG_LIST[LIST_Counter].SURGERY, SURG_Counter + 9)
 ENDIF
 
DETAIL
 ;pull in surgery details
 IF(SURGHX->SURG_LIST[LIST_Counter].surg_type = "Other Previous Surgery History")
   IF(ce5.event_tag = "Surgery Description")
      SURGHX->SURG_LIST[LIST_Counter].SURGERY[SURG_Counter].surg_name 	= TRIM(ce5.result_val,3)
   ELSEIF(ce5.event_tag = "Surgery Date")
      SURGHX->SURG_LIST[LIST_Counter].SURGERY[SURG_Counter].surg_dt		= TRIM(ce5.result_val,3)
   ENDIF
 ELSE
    SURGHX->SURG_LIST[LIST_Counter].SURGERY[SURG_Counter].surg_name 	= TRIM(ce4.event_tag,3)
    SURGHX->SURG_LIST[LIST_Counter].SURGERY[SURG_Counter].surg_dt	= TRIM(ce5.result_val,3)
 ENDIF
 
FOOT ce3.event_tag
 
	STAT = ALTERLIST(SURGHX->SURG_LIST[LIST_Counter].SURGERY,SURG_Counter)
 
FOOT REPORT
 
	STAT = ALTERLIST(SURGHX->SURG_LIST,LIST_Counter)
 
WITH NOCOUNTER
 
/*===============================================================================================================
                                 GET SURGERY NONE DETAIL
===============================================================================================================*/
SELECT DISTINCT INTO "NL:"
      CE.PERSON_ID
    , CE.EVENT_TITLE_TEXT
	, CE2_EVENT_DISP = UAR_GET_CODE_DISPLAY(CE2.EVENT_CD)
	, CE2.EVENT_CD
	, CE2.PERFORMED_DT_TM
 
FROM
      CLINICAL_EVENT   CE
	, CLINICAL_EVENT   CE2
 
PLAN  CE
   WHERE CE.PERSON_ID = $PERSONID
   AND ce.encntr_id +0 = $ENCNTRID
   AND CE.EVENT_TITLE_TEXT = "FN Surgical History*"
   AND CE.VALID_UNTIL_DT_TM = CNVTDATETIME(CNVTDATE(12312100),0000)
   AND NOT CE.RESULT_STATUS_CD IN(INERROR_8_CV,INERROR2_8_CV,NOTDONE_8_CV);IN ( 28 , 31 ,36 )
 
JOIN CE2
   WHERE CE2.PARENT_EVENT_ID = CE.EVENT_ID
   AND CE2.EVENT_CD = prevsurg_72_CV
   AND CE2.VALID_UNTIL_DT_TM = CNVTDATETIME(CNVTDATE(12312100),0000)
   AND NOT CE2.RESULT_STATUS_CD IN(INERROR_8_CV,INERROR2_8_CV,NOTDONE_8_CV);IN ( 28 , 31 ,36 )
 
ORDER BY
	CE2.PERFORMED_DT_TM   DESC
 
HEAD REPORT
cnt = 0
 
DETAIL
;pull latest dta
IF(cnt = 0)
   IF(ce2.event_tag = "No")
      SURGHX->NO_SHX = "No History Results Found - No Previous Surgeries"
      cnt = 1
   ELSE
      SURGHX->NO_SHX = TRIM(ce2.result_val,3)  		 ; CONCAT("Limited to No History Results Found - ",   )
      cnt = 1
   ENDIF
ENDIF
 
WITH NOCOUNTER

select into 'nl:'
from surgical_case sc,
	surg_case_procedure scp
plan sc
	where sc.person_id = $PERSONID
	and sc.active_ind = 1
	and sc.cancel_dt_tm = null
	and sc.surg_start_dt_tm != null
	and sc.surg_stop_dt_tm != null
	and sc.surg_stop_dt_tm < sysdate
join scp
	where scp.surg_case_id = sc.surg_case_id
	and scp.active_ind = 1
	and scp.primary_proc_ind = 1
order by sc.surg_start_dt_tm desc
detail
	cnt = surghx->actual_surg_cnt + 1
	surghx->actual_surg_cnt = cnt
	stat = alterlist(surghx->actual_surg_list, cnt)
	surghx->actual_surg_list[cnt].surg_case_id = sc.surg_case_id
	surghx->actual_surg_list[cnt].surg_dt = format(sc.surg_start_dt_tm, "mm/dd/yyyy;;q")
	if (trim(scp.proc_text) > "")
		surghx->actual_surg_list[cnt].surg_name = trim(scp.proc_text)
	else
		surghx->actual_surg_list[cnt].surg_name = trim(uar_get_code_display(scp.sched_surg_proc_cd))
	endif
with nocounter
 
call echojson(surghx, $OUTDEV)

END
GO
