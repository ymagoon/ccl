drop program bc_mp_mvs_medhx_10:dba go
create program bc_mp_mvs_medhx_10:dba
/**************************************************************************************************
              Purpose: Displays the Patient Medical History Information in ED Custom MPage
     Source File Name: bc_mp_mvs_medhx_10_v3.PRG
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
    2   09/30/2013      DeAnn Capanna           WO# 9999649 - Use new Past Medical History control
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
  1 TYPE [1]
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

/**************************************************************************************************
				Select to get details of the medical History
**************************************************************************************************/
DECLARE PROBLEM_25321_CV = F8 WITH PUBLIC ,CONSTANT (UAR_GET_CODE_BY ("DISPLAYKEY" ,25321 ,"PROBLEM" ) )
DECLARE MEDICAL_12033_CV = F8 WITH PUBLIC ,CONSTANT (UAR_GET_CODE_BY ("DISPLAYKEY" ,12033 ,"MEDICAL" ) )
DECLARE ACTIVE_48_CV = F8 WITH PUBLIC ,CONSTANT (UAR_GET_CODE_BY ("DISPLAYKEY" ,48 ,"ACTIVE" ) )
DECLARE AUTHVERI_8_CV = F8 WITH PUBLIC ,CONSTANT (UAR_GET_CODE_BY ("DISPLAYKEY" ,8 ,"AUTHVERIFIED") )

SELECT DISTINCT INTO "NL:"
FROM
	PROBLEM   P
	, NOMENCLATURE   N
	, PROBLEM_ACTION PA

;,NOMEN_CAT_LIST NL
	;,NOMEN_CATEGORY NC
PLAN P
	WHERE P.person_id = $PERSONID
	  AND P.active_ind = 1
	  and P.ACTIVE_STATUS_CD = ACTIVE_48_CV
	  and P.DATA_STATUS_CD = AUTHVERI_8_CV
	  AND P.CANCEL_REASON_CD = 0.00
	  and P.CLASSIFICATION_CD = MEDICAL_12033_CV
	  ;AND P.problem_type_flag = 1
	  AND P.end_effective_dt_tm > CNVTDATETIME(CURDATE, CURTIME3)
	  
JOIN N
	WHERE N.NOMENCLATURE_ID = OUTERJOIN (P.NOMENCLATURE_ID)
	  AND N.ACTIVE_IND = OUTERJOIN (1)
	  
JOIN PA
	WHERE pa.problem_id = outerjoin(p.problem_id)
	  
;JOIN NL
	;WHERE NL.NOMENCLATURE_ID = OUTERJOIN (N.NOMENCLATURE_ID)
	
;JOIN NC
	;WHERE NC.NOMEN_CATEGORY_ID = OUTERJOIN (NL.PARENT_CATEGORY_ID ) 
	 ; AND NC.CATEGORY_TYPE_CD = OUTERJOIN (PROBLEM_25321_CV )

ORDER BY
	P.ANNOTATED_DISPLAY

HEAD REPORT
 
	CNTP = 0
	CNTA = 0
	STAT_CNT = 0
 
	;initialize MED_HIST record structure
	STAT = ALTERLIST(MED_HIST->TYPE[1].NAME,10)
 
DETAIL
 
	CNTA = CNTA + 1
	 
	; add BLANK ROWS the NAME segment if needed
	STAT = MOD(CNTA,10)
	IF(STAT = 1 AND CNTA !=1)
		STAT = ALTERLIST(MED_HIST->TYPE[1]->NAME,CNTA + 10)
	ENDIF
	 
	; store the data in the NAME segment of the record structure
	MED_HIST->TYPE[1]->NAME[CNTA]->HX_NAME = trim(P.annotated_display) ;HX_NAME
	
	MED_HIST->TYPE[1]->NAME[CNTA]->HX_LINE = trim(uar_get_code_display(p.life_cycle_status_cd))
	
FOOT REPORT
	CNTAX = 1
	CNTPX = 1
	 
	; remove unused med_hist->TYPE segment ROWS
	STAT = ALTERLIST(MED_HIST->TYPE[1].NAME,CNTA)

WITH NOCOUNTER, SEPARATOR=" ", FORMAT

call echorecord(med_hist)
call echojson(med_hist, $OUTDEV)
end
go
