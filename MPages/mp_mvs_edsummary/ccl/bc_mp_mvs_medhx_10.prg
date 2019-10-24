drop program bc_mp_mvs_medhx_10:dba go
create program bc_mp_mvs_medhx_10:dba
/**************************************************************************************************
              Purpose: Displays the Patient Medical History Information in ED Custom MPage
     Source File Name: bc_mp_mvs_medhx_10.PRG
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


RECORD MED_HIST (
  1 person_id = f8
  1 encntr_id = f8
  1 NO_HX		= vc
  1 TYPE [*]
    2 HX_TYPE 	= vc
    2 NAME [*]
     3 HX_NAME 	= vc
     3 HX_LINE 	= vc
)

DECLARE  INERROR_8_CV = F8 WITH  PUBLIC , CONSTANT ( UAR_GET_CODE_BY ( "MEANING" ,  8 ,  "INERROR" ))
DECLARE  INERROR2_8_CV = F8 WITH  PUBLIC , CONSTANT ( UAR_GET_CODE_BY ( "MEANING" ,  8 , "IN ERROR" ))
DECLARE  NOTDONE_8_CV = F8 WITH  PUBLIC , CONSTANT ( UAR_GET_CODE_BY ( "MEANING" ,  8 ,  "NOT DONE" ))
DECLARE  NOK_72_CV = F8 WITH  PUBLIC , CONSTANT ( UAR_GET_CODE_BY ( "DISPLAYKEY" ,  72 ,  "NONEMEDICALHISTORY"))
DECLARE  UNK_72_CV = F8 WITH  PUBLIC , CONSTANT ( UAR_GET_CODE_BY ( "DISPLAYKEY" ,  72 ,  "UNKNOWNMEDICALHISTORY"))
DECLARE  medhxverif_72_CV = F8 WITH PUBLIC , CONSTANT ( UAR_GET_CODE_BY ( "DISPLAYKEY",72,"MEDICALHISTORYVERIFICATION"))
 
DECLARE  FORM_EVENT_ID = F8 WITH PUBLIC , NOCONSTANT ( 0.00 )

DECLARE OCULARMEDHX_72_CV = F8 WITH PROTECT, CONSTANT 
										(UAR_GET_CODE_BY("description", 72, "Ocular Medical History Grid"))
DECLARE IMMUNOLOGICMEDHX_72_CV = F8 WITH PROTECT, CONSTANT 
										(UAR_GET_CODE_BY("description", 72, "Immunologic Medical History Grid"))
DECLARE NEUROLOGICALMEDHX_72_CV = F8 WITH PROTECT, CONSTANT 
										(UAR_GET_CODE_BY("description", 72, "Neurological Medical History Grid"))
DECLARE RESPIRATORYMEDHX_72_CV = F8 WITH PROTECT, CONSTANT 
										(UAR_GET_CODE_BY("description", 72, "Respiratory Medical History Grid"))
DECLARE ENDOCRINEMETHMEDHX_72_CV = F8 WITH PROTECT, CONSTANT 
								(UAR_GET_CODE_BY("description", 72, "Endocrine Metabolic Medical History Grid"))
DECLARE GASTROINTESTINAL_72_CV = F8 WITH PROTECT, CONSTANT 
								(UAR_GET_CODE_BY("description", 72, "Gastrointestinal Medical History Grid"))
DECLARE HEMATOLOGICMEDHX_72_CV = F8 WITH PROTECT, CONSTANT 
									(UAR_GET_CODE_BY("description", 72, "Hematologic Medical History Grid"))
DECLARE GENITOURINARYMEDHX_72_CV = F8 WITH PROTECT, CONSTANT 
									(UAR_GET_CODE_BY("description", 72, "Genitourinary Medical History Grid"))
DECLARE MUSCULOSKELETALMEDHX_72_CV = F8 WITH PROTECT, CONSTANT 
									(UAR_GET_CODE_BY("description", 72, "Musculoskeletal Medical History Grid"))
DECLARE PSYCHOSOCIALMEDHX_72_CV = F8 WITH PROTECT, CONSTANT 
									(UAR_GET_CODE_BY("description", 72, "Psychosocial Medical History Grid"))
DECLARE ONCOLOGICMEDHX_72_CV = F8 WITH PROTECT, CONSTANT 
									(UAR_GET_CODE_BY("description", 72, "Oncologic Medical History Grid"))
DECLARE CARDIOVASCULARMEDHX_72_CV = F8 WITH PROTECT, CONSTANT 
									(UAR_GET_CODE_BY("description", 72, "Cardiovascular Medical History Grid"))

declare PSYCHOSOCIALMEDICALHISTORYGRID_72_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",72,"PSYCHOSOCIALMEDICALHISTORYGRID")),protect
declare GASTROINTESTINALMEDICALHISTORYGRID_72_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",72,"GASTROINTESTINALMEDICALHISTORYGRID")),protect
declare ENDOCRINEMETABOLICMEDICALHISTORYGRID_72_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",72,"ENDOCRINEMETABOLICMEDICALHISTORYGRID")),protect
declare ONCOLOGICMEDICALHISTORYGRID_72_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",72,"ONCOLOGICMEDICALHISTORYGRID")),protect
declare RESPIRATORYMEDICALHISTORYGRID_72_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",72,"RESPIRATORYMEDICALHISTORYGRID")),protect
declare CARDIOVASCULARMEDICALHISTORYGRID_72_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",72,"CARDIOVASCULARMEDICALHISTORYGRID")),protect
declare MUSCULOSKELETALMEDICALHISTORYGRID_72_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",72,"MUSCULOSKELETALMEDICALHISTORYGRID")),protect
declare OCULARMEDICALHISTORYGRID_72_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",72,"OCULARMEDICALHISTORYGRID")),protect
declare GENITOURINARYMEDICALHISTORYGRID_72_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",72,"GENITOURINARYMEDICALHISTORYGRID")),protect
declare NEUROLOGICALMEDICALHISTORYGRID_72_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",72,"NEUROLOGICALMEDICALHISTORYGRID")),protect
	
										
DECLARE  ENC_ID =  F8  WITH  PUBLIC , NOCONSTANT ( 0.00 )
DECLARE  PER_ID =  F8  WITH  PUBLIC , NOCONSTANT ( 0.00 )
DECLARE  CNTP  	=  I4  WITH  PUBLIC , NOCONSTANT ( 0 )
DECLARE  CNTA  	=  I4  WITH  PUBLIC , NOCONSTANT ( 0 )

SELECT  INTO  "nl:"
   E.PERSON_ID
FROM  ENCOUNTER  E 
PLAN  E 
 	WHERE E.ENCNTR_ID = $ENCNTRID 
 
HEAD  REPORT
	med_hist->person_id = $PERSONID
	med_hist->encntr_id = $ENCNTRID
WITH  NOCOUNTER
 
SELECT INTO  "NL:"
 
FORM_EVENT_ID = CE.EVENT_ID,
CE.*
FROM ( CLINICAL_EVENT  CE )
PLAN  CE
   WHERE ce.person_id = $PERSONID
   AND ce.encntr_id +0 = $ENCNTRID
   AND  TRIM (CE.EVENT_TITLE_TEXT) in ("FN Medical History","FN Medical History P2")
   AND  NOT CE.RESULT_STATUS_CD IN(INERROR_8_CV,INERROR2_8_CV,NOTDONE_8_CV)
   AND CE.VALID_UNTIL_DT_TM > CNVTDATETIME ( CURDATE ,  CURTIME )
 
ORDER BY  CE.PERSON_ID, CE.EVENT_END_DT_TM DESC
 
HEAD CE.PERSON_ID 

FORM_EVENT_ID = CE.EVENT_ID
 
WITH  NOCOUNTER 
 
/**************************************************************************************************
				Select to get details of the medical History
**************************************************************************************************/
 
SELECT  INTO "nl:"
	CE.EVENT_TITLE_TEXT
	, CE2.EVENT_TITLE_TEXT
	, hx_type = replace(CE2.EVENT_TAG,"Grid","",1)  		; Remove the word "Grid"
	, hx_name = CE3.EVENT_TITLE_TEXT
	, HX_LINE = trim(REPLACE(CE3.event_tag,"Self,","",1),2) ; Remove the workd "Self"
	, ce3.parent_event_id
	, ce3.event_id
	, CE3.valid_from_dt_tm "MM/DD/YYYY HH:MM;;D"
	
FROM
	CLINICAL_EVENT   CE
	, CLINICAL_EVENT   CE2
	, CLINICAL_EVENT   CE3
 
PLAN CE
   WHERE CE.PERSON_ID = $PERSONID 
    AND ce.encntr_id +0 = $ENCNTRID
   AND CE.event_ID =  FORM_EVENT_ID 
   AND CE.EVENT_TITLE_TEXT in ("FN Medical History","FN Medical History P2")
   AND CE.valid_until_dt_tm > CNVTDATETIME ( CURDATE ,  CURTIME ) 
   AND  NOT CE.RESULT_STATUS_CD IN(INERROR_8_CV,INERROR2_8_CV,NOTDONE_8_CV)
 
JOIN CE2
   WHERE CE2.PARENT_EVENT_ID = ce.event_id
   AND CE2.EVENT_TITLE_TEXT = "Discrete Grid"
   AND CE2.EVENT_CD  IN ( OCULARMEDHX_72_CV, IMMUNOLOGICMEDHX_72_CV, NEUROLOGICALMEDHX_72_CV
					, RESPIRATORYMEDHX_72_CV, ENDOCRINEMETHMEDHX_72_CV, GASTROINTESTINAL_72_CV
					, HEMATOLOGICMEDHX_72_CV, GENITOURINARYMEDHX_72_CV, MUSCULOSKELETALMEDHX_72_CV
					, PSYCHOSOCIALMEDHX_72_CV, ONCOLOGICMEDHX_72_CV, CARDIOVASCULARMEDHX_72_CV ) 		
					
   AND CE2.valid_until_dt_tm > CNVTDATETIME ( CURDATE ,  CURTIME )
   AND  NOT CE2.RESULT_STATUS_CD IN(INERROR_8_CV,INERROR2_8_CV,NOTDONE_8_CV)
 
JOIN CE3
   WHERE CE3.PARENT_EVENT_ID = ce2.event_id
   AND CE3.EVENT_TAG = "Self*"
   AND CE3.valid_until_dt_tm > CNVTDATETIME ( CURDATE ,  CURTIME ) ;CNVTDATETIME(CNVTDATE(12312100),0000)
   AND  NOT CE3.RESULT_STATUS_CD IN(INERROR_8_CV,INERROR2_8_CV,NOTDONE_8_CV);IN ( 28 , 31 ,36 )
 
 
ORDER BY	; collating seq sets the order to be the same as it is displayed on the form
	CE2.COLLATING_SEQ,
	CE3.COLLATING_SEQ
	 
HEAD REPORT
 
	CNTP = 0
	CNTPX = 0
	CNTPA = 0
	CNTA = 0
	STAT_CNT = 0
 
	;initialize MED_HIST record structure
	STAT = ALTERLIST(MED_HIST->TYPE,10)
 
HEAD  ce2.collating_seq
 
	CNTP = CNTP + 1		; increment counter
 
	; set STAT to CNTP divided by 10 if stat = 1 then add additional blank rows
	STAT = MOD(CNTP, 10)
 
	IF(STAT = 1 AND CNTP != 1)
	   STAT = ALTERLIST(MED_HIST->TYPE,CNTP + 10)
	ENDIF
 
	;	store data for the TYPE segment of the record structure
	MED_HIST->TYPE[CNTP]->HX_TYPE = HX_TYPE
 
	CNTA = 0
	STAT = ALTERLIST(MED_HIST->TYPE[CNTP]-> NAME , 10)
 
DETAIL
 
	CNTA = CNTA + 1
	 
	; add BLANK ROWS the NAME segment if needed
	STAT = MOD(CNTA,10)
	IF(STAT = 1 AND CNTA !=1)
		STAT = ALTERLIST(MED_HIST->TYPE[CNTP]->NAME,CNTA + 10)
	ENDIF
	 
	; store the data in the NAME segment of the record structure
	MED_HIST->TYPE[CNTP]->NAME[CNTA]->HX_NAME = HX_NAME
	
	IF ( HX_LINE != "Self"  )
		MED_HIST->TYPE[CNTP]->NAME[CNTA]->HX_LINE = trim(REPLACE(CE3.event_tag,"Self,","",1),2)
	ENDIF 
	
	 
FOOT ce2.collating_seq
	 
	; remove unused med_hist->type->name segment ROWS
	STAT = ALTERLIST(MED_HIST->TYPE[CNTP]->NAME,CNTA)
 
FOOT REPORT
	CNTAX = 1
	CNTPX = 1
	 
	; remove unused med_hist->TYPE segment ROWS
	STAT = ALTERLIST(MED_HIST->TYPE,CNTP)

WITH NOCOUNTER, SEPARATOR=" ", FORMAT
 
/**************************************************************************************************
			Select to get "No Known Medical History" and "Unknown Medical History"
**************************************************************************************************/ 
 
SELECT DISTINCT  INTO "nl:"
      CE.PERSON_ID
    , CE.EVENT_TITLE_TEXT
	, CE2_EVENT_DISP = UAR_GET_CODE_DISPLAY(CE2.EVENT_CD)
	, CE2.EVENT_CD
	, CE2.PERFORMED_DT_TM
 
FROM
      CLINICAL_EVENT   CE
	, CLINICAL_EVENT   CE2
 
plan  CE
   WHERE CE.PERSON_ID = $PERSONID
    AND ce.encntr_id +0 = $ENCNTRID
   AND CE.EVENT_TITLE_TEXT = "FN Medical History*"
   AND CE.VALID_UNTIL_DT_TM = CNVTDATETIME(CNVTDATE(12312100),0000)
   AND  NOT CE.RESULT_STATUS_CD IN(INERROR_8_CV,INERROR2_8_CV,NOTDONE_8_CV)
 
JOIN CE2
   WHERE CE2.PARENT_EVENT_ID = CE.EVENT_ID
   AND CE2.EVENT_CD = medhxverif_72_CV 			;Medical History Verification
   AND CE2.VALID_UNTIL_DT_TM = CNVTDATETIME(CNVTDATE(12312100),0000)
   AND  NOT CE2.RESULT_STATUS_CD IN(INERROR_8_CV,INERROR2_8_CV,NOTDONE_8_CV)
 
ORDER BY
	CE2.PERFORMED_DT_TM   DESC
 
HEAD REPORT
	cnt = 0
 
DETAIL
	;get latest dta
	IF(cnt = 0)
	   med_hist->NO_HX = TRIM(ce2.result_val,3)
	   cnt = 1
	ENDIF
 
WITH NOCOUNTER

call echorecord(med_hist)


select into 'nl:'
	grid = trim(uar_get_code_display(ce1.event_cd))
from clinical_event ce1,
	clinical_event ce2
plan ce1
	where ce1.person_id = $PERSONID
	and ce1.encntr_id +0 = $ENCNTRID
	and ce1.event_cd in (PSYCHOSOCIALMEDICALHISTORYGRID_72_CV,
						GASTROINTESTINALMEDICALHISTORYGRID_72_CV,
						ENDOCRINEMETABOLICMEDICALHISTORYGRID_72_CV,
						ONCOLOGICMEDICALHISTORYGRID_72_CV,
						RESPIRATORYMEDICALHISTORYGRID_72_CV,
						CARDIOVASCULARMEDICALHISTORYGRID_72_CV,
						MUSCULOSKELETALMEDICALHISTORYGRID_72_CV,
						OCULARMEDICALHISTORYGRID_72_CV,
						GENITOURINARYMEDICALHISTORYGRID_72_CV,
						NEUROLOGICALMEDICALHISTORYGRID_72_CV)
	and ce1.valid_from_dt_tm < sysdate
	and ce1.valid_until_dt_tm > sysdate
	and not ce1.result_status_cd in (INERROR_8_CV,INERROR2_8_CV,NOTDONE_8_CV)
	and ce1.view_level = 0
join ce2
	where ce2.parent_event_id = ce1.event_id
	and ce2.person_id = $PERSONID
	and ce2.encntr_id = $ENCNTRID
	and ce2.valid_from_dt_tm < sysdate
	and ce2.valid_until_dt_tm > sysdate
	and not ce2.result_status_cd in (INERROR_8_CV,INERROR2_8_CV,NOTDONE_8_CV)
	and ce2.view_level = 1
order by grid
head ce1.event_cd
	call echo(grid)
	cnt = size(med_hist->TYPE,5) + 1
	stat = alterlist(med_hist->TYPE, cnt)
	med_hist->TYPE[cnt].HX_TYPE = substring(1,findstring("Grid",grid)-1,grid)
	call echorecord(med_hist)
detail
	call echo(uar_get_code_display(ce2.event_cd))
	cnt2 = size(med_hist->TYPE[cnt].NAME,5) + 1
	stat = alterlist(med_hist->TYPE[cnt].NAME, cnt2)
	med_hist->TYPE[cnt].NAME[cnt2].HX_NAME = uar_get_code_display(ce2.event_cd)
	med_hist->TYPE[cnt].NAME[cnt2].HX_LINE = ce2.result_val
with nocounter

call echorecord(med_hist)
call echojson(med_hist, $OUTDEV)
end
go
