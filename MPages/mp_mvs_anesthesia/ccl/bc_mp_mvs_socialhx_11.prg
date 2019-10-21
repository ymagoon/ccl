drop program bc_mp_mvs_socialhx_11:dba go
create program bc_mp_mvs_socialhx_11:dba
/**************************************************************************************************
              Purpose: Displays the Social History in ED Custom MPage
     Source File Name: bc_mp_mvs_socialhx_10.PRG
              Analyst: MediView Solutions
          Application: FirstNet
  Execution Locations: FirstNet
            Request #: 
      Translated From: 
        Special Notes:
**************************************************************************************************/
/**************************************************************************************************
  Mod  Date            Engineer                Description
   ---  --------------- ----------------------- ------------------------------------------------
    1   06/09/2011      MediView Solutions 	    Initial Release
    2   mm/dd/yyyy      Engineer Name           Initial Release
	3 	mm/dd/yyyy      FirstName LastName      Comments for first modification

**************************************************************************************************/

prompt 
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "USERID" = 0
	, "PERSONID" = 0
	, "ENCNTRID" = 0
	, "OPTIONS" = "" 

with OUTDEV, USERID, PERSONID, ENCNTRID, OPTIONS


RECORD SOCIALHX(
 1  person_id = f8
 1  encntr_id = f8
 1  evnt_cnt 		= i4
 1  NO_HX			= vc
 1  EVENTS[*]
    2  event_id		= f8 ;use row
    2  event_name	= vc
    2  event_dt_tm	= vc
    2  rslt_cnt		= i2
    2  RESULT[*]
       3 result_id	= f8
       3 result_tag	= vc
       3 result_val	= vc
       3 result_seq	= i2
)

DECLARE ACTV_48_CV   		= f8 WITH Constant(uar_get_code_by("MEANING",48,"ACTIVE")),Protect
 
DECLARE INERROR_8_CV		= f8 WITH CONSTANT(uar_get_code_by("MEANING",8,"INERROR")),Protect
DECLARE INERROR2_8_CV  		= f8 WITH  PUBLIC , CONSTANT ( UAR_GET_CODE_BY ( "MEANING" ,  8 , "IN ERROR" ))
DECLARE NOTDONE_8_CV  		= f8 WITH  PUBLIC , CONSTANT ( UAR_GET_CODE_BY ( "MEANING" ,  8 ,  "NOT DONE" ))

DECLARE edpthist_72_CV 		= F8 WITH PUBLIC, constant(uar_get_code_by("DISPLAYKEY",72,"EDPATIENTHISTORY"))
DECLARE alcholgrid_72_CV	= F8 WITH PUBLIC, constant(uar_get_code_by("DISPLAYKEY",72,"ALCOHOLUSEGRID"))
DECLARE tobacogrid_72_CV 	= F8 WITH PUBLIC, constant(uar_get_code_by("DISPLAYKEY",72,"TOBACCOUSEGRID"))
DECLARE medhxverif_72_CV  	= F8 WITH PUBLIC, constant(uar_get_code_by("DISPLAYKEY",72,"MEDICALHISTORYVERIFICATION"))
DECLARE EVNT_Counter = I4 WITH PUBLIC, NOCONSTANT(0) ;A counter for loading the recordset
DECLARE RSLT_Counter = I4 WITH PUBLIC, NOCONSTANT(0) ;A counter for loading the recordset
SELECT INTO "NL:"
FROM
	ENCOUNTER E
 
PLAN E
	WHERE E.ENCNTR_ID = $ENCNTRID
DETAIL
	socialhx->person_id = $PERSONID
	socialhx->encntr_id = $ENCNTRID
WITH NOCOUNTER, MAXREC = 1

SELECT DISTINCT INTO "NL:"
	ce.event_id

FROM
	clinical_event ce,
	clinical_event ce2,
	clinical_event ce3,
	clinical_event ce4,
	clinical_event ce5
 
PLAN ce
	WHERE ce.person_id		 = $PERSONID
  	AND ce.encntr_id  		 = $ENCNTRID
  	AND ce.event_cd 		 =   edpthist_72_CV ;112139042.00
  	AND ce.event_end_dt_tm 	 < CNVTDATETIME(curdate,curtime3)
  	AND ce.valid_until_dt_tm = cnvtdatetime(cnvtdate(12312100),0000)
  	AND NOT ce.result_status_cd IN (INERROR_8_CV ,INERROR2_8_CV, NOTDONE_8_CV);(28,31,36)
 
JOIN ce2 
	WHERE ce2.parent_event_id = ce.event_id
  	AND ce2.valid_until_dt_tm = cnvtdatetime(cnvtdate(12312100),0000)
 
JOIN ce3 
	WHERE ce3.parent_event_id = ce2.event_id
  	AND ce3.event_cd IN (
    	alcholgrid_72_CV  ;33358853.00
    	,tobacogrid_72_CV ;33358851.00
   		)
  	AND ce3.valid_until_dt_tm = cnvtdatetime(cnvtdate(12312100),0000)
 
JOIN ce4 
	WHERE ce4.parent_event_id = ce3.event_id
  	AND ce4.valid_until_dt_tm = cnvtdatetime(cnvtdate(12312100),0000)
 
JOIN ce5 
	WHERE ce5.parent_event_id = ce4.event_id
  	AND ce5.event_end_dt_tm < CNVTDATETIME(curdate,curtime3)
  	AND ce5.valid_until_dt_tm = cnvtdatetime(cnvtdate(12312100),0000)
  	AND NOT ce.result_status_cd IN (INERROR_8_CV ,INERROR2_8_CV, NOTDONE_8_CV);(28,31,36)
 
ORDER BY 
	ce.event_end_dt_tm desc,
	ce.collating_seq,
	ce2.collating_seq,
	ce3.collating_seq,
	ce4.collating_seq,
	ce5.collating_seq
 
HEAD REPORT
	STAT = ALTERLIST(SOCIALHX->EVENTS,10)
 
HEAD ce4.event_id
	 SOCIALHX->evnt_cnt = SOCIALHX->evnt_cnt + 1
	 EVNT_Counter = SOCIALHX->evnt_cnt
	 
	 ;check for available memory in the department list
	 IF(MOD(EVNT_Counter,10) = 1 AND EVNT_Counter > 10)
		;if needed allocate memory for 10 more encounters
	    STAT = ALTERLIST(SOCIALHX->EVENTS, EVNT_Counter + 9)
	 ENDIF
	 
	 SOCIALHX->EVENTS[EVNT_Counter].event_id 		= ce4.event_id
	 SOCIALHX->EVENTS[EVNT_Counter].event_dt_tm		= FORMAT(ce.event_end_dt_tm,"MM/DD/YY HH:MM")
	 SOCIALHX->EVENTS[EVNT_Counter].event_name		= REPLACE(TRIM(ce4.event_tag,3),"Row"," ",2)
	 
DETAIL
	 SOCIALHX->EVENTS[EVNT_Counter].rslt_cnt = SOCIALHX->EVENTS[EVNT_Counter].rslt_cnt + 1
	 RSLT_Counter = SOCIALHX->EVENTS[EVNT_Counter].rslt_cnt
	 
	 ;check for available memory in the department list
	 IF(MOD(RSLT_Counter,10) = 1)
		;if needed allocate memory for 10 more encounters
	    STAT = ALTERLIST (SOCIALHX->EVENTS[EVNT_Counter].RESULT, RSLT_Counter + 9)
	 ENDIF
	 
	 SOCIALHX->EVENTS[EVNT_Counter].RESULT[RSLT_Counter].result_id		= ce5.event_id
	 SOCIALHX->EVENTS[EVNT_Counter].RESULT[RSLT_Counter].result_tag		= TRIM(ce5.event_tag,3)
	 SOCIALHX->EVENTS[EVNT_Counter].RESULT[RSLT_Counter].result_val		= TRIM(ce5.result_val,3)
	 SOCIALHX->EVENTS[EVNT_Counter].RESULT[RSLT_Counter].result_seq		= CNVTINT(ce5.collating_seq)
	 
FOOT ce4.event_id
	STAT = ALTERLIST(SOCIALHX->EVENTS[EVNT_Counter].RESULT,RSLT_Counter)
 
FOOT REPORT
	STAT = ALTERLIST(SOCIALHX->EVENTS,EVNT_Counter)
 
WITH COUNTER

call echojson(socialhx, $OUTDEV)
end
go
