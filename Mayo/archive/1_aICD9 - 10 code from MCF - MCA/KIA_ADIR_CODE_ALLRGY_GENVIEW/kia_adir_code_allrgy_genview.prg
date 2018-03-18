DROP PROGRAM KIA_ADIR_CODE_ALLRGY_GENVIEW :DBA go ;SHORTDATETIMENOSEC
CREATE PROGRAM KIA_ADIR_CODE_ALLRGY_GENVIEW :DBA
DECLARE BDEBUG = I1 WITH NOCONSTANT (0 )
SELECT INTO "NL:"
DM.INFO_CHAR
FROM (DM_INFO DM )
WHERE (DM.INFO_DOMAIN = "KnowInteg" ) AND (DM.INFO_NAME = "ScriptDebug" )
DETAIL
BDEBUG = CNVTINT (DM.INFO_CHAR )
WITH NOCOUNTER
SET RHEAD =
"{\rtf1\ansi \deff0{\fonttbl{\f0\fswiss Arial;}}{\colortbl;\red0\green0\blue0;\red255\green255\blue255;}\deftab1134"
SET RH2R = "\plain \f0 \fs18 \cb2 \pard\sl0 "
SET RH2B = "\plain \f0 \fs18 \b \cb2 \pard\sl0 "
SET RH2BU = "\plain \f0 \fs18 \b \ul \cb2 \pard\sl0 "
SET RH2U = "\plain \f0 \fs18 \u \cb2 \pard\sl0 "
SET RH2I = "\plain \f0 \fs18 \i \cb2 \pard\sl0 "
SET REOL = "\par "
SET RTAB = "\tab "
SET WR = " \plain \f0 \fs18 \cb2 "
SET WB = " \plain \f0 \fs18 \b \cb2 "
SET WU = " \plain \f0 \fs18 \ul \cb2 "
SET WI = " \plain \f0 \fs18 \i \cb2 "
SET WBI = " \plain \f0 \fs18 \b \i \cb2 "
SET WIU = " \plain \f0 \fs18 \i \ul \cb2 "
SET WBIU = " \plain \f0 \fs18 \b \ul \i \cb2 "
SET RTFEOF = "}"
FREE RECORD DREC
RECORD DREC (
  1 LINE_CNT = I4
  1 DISPLAY_LINE = VC
  1 LINE_QUAL [*]
    2 DISP_LINE = VC
)
FREE RECORD TEMP
RECORD TEMP (
  1 ADV_DIR_CNT = I4
  1 ADV_DIR_TYPE [*]
    2 ADV_DIR = VC
  1 CODE_STATUS_CNT = I4
  1 CODE_STATUS [*]
    2 CODE_STAT = VC
  1 ALLERGY_CNT = I4
  1 ALLERGIES [*]
    2 ALLERGY = VC
  1 REASON_VISIT_CNT = I4
  1 REASON_VISIT [*]
    2 VISIT_REASON = VC
  1 DIET_ORDERS_CNT = I4
  1 DIET_ORDERS [*]
    2 DIET_ORDER = VC
  1 PT_ACTIVITY_CNT = I4
  1 PT_ACTIVITIES [*]
    2 PT_ACTIVITY = VC
  1 ANTICIP_DC_DT = VC
  1 ANTICIP_DC_DT_STR = VC
)
IF ((VALIDATE (I18NUAR_DEF ,999 ) = 999 ) )
CALL ECHO ("Declaring i18nuar_def" )
DECLARE I18NUAR_DEF = I2 WITH PERSIST
SET I18NUAR_DEF = 1
DECLARE UAR_I18NLOCALIZATIONINIT ((P1 = I4 ) ,(P2 = VC ) ,(P3 = VC ) ,(P4 = F8 ) ) = I4 WITH
PERSIST
DECLARE UAR_I18NGETMESSAGE ((P1 = I4 ) ,(P2 = VC ) ,(P3 = VC ) ) = VC WITH PERSIST
DECLARE UAR_I18NBUILDMESSAGE () = VC WITH PERSIST
ENDIF
DECLARE I18NHANDLE = I4 WITH PERSISTSCRIPT
CALL UAR_I18NLOCALIZATIONINIT (I18NHANDLE ,CURPROG ,"" ,CURCCLREV )
DECLARE CODESTATUS = VC WITH PUBLIC ,CONSTANT ("SNOMED!304251008" )
DECLARE CODESTATUS2 = VC WITH PUBLIC ,CONSTANT ("CERNER!AHi9DQD6hSYe/4AIn4waeg" )
DECLARE ADVDIRECTIVE = VC WITH PUBLIC ,CONSTANT ("CKI.EC!5735" )
DECLARE CKI_DIETS = VC WITH CONSTANT ("CERNER!AE8dDQEYLb2VzYGMCqIGfA" ) ,PROTECT
DECLARE CKI_SUPPLEMENTS = VC WITH CONSTANT ("CERNER!AE8dDQEYLb2VzYXjCqIGfA" ) ,PROTECT
DECLARE CKI_TUBEFEEDING = VC WITH CONSTANT ("CERNER!AE8dDQEYLb2VzYaICqIGfA" ) ,PROTECT
DECLARE CKI_SNACKS = VC WITH CONSTANT ("CERNER!AE8dDQEYLb2VzYXCCqIGfA" ) ,PROTECT
DECLARE CKI_PEDIATRICFORMULAS = VC WITH CONSTANT ("CERNER!AE8dDQEYLb2VzYRBCqIGfA" ) ,PROTECT
DECLARE CKI_DIETSPECIALINSTRUCTIONS = VC WITH CONSTANT ("CERNER!AE8dDQEYLb2VzYGBCqIGfA" ) ,PROTECT
DECLARE CKI_PATIENTACTIVITY = VC WITH CONSTANT ("CERNER!AE8dDQEYLb2VzYP/CqIGfA" ) ,PROTECT
DECLARE CKI_PATIENTACTIVITYSTATUS = VC WITH CONSTANT ("CERNER!AE8dDQEYLb2VzYQKCqIGfA" ) ,PROTECT
DECLARE MODCAPTION = VC
DECLARE STARTDATECAPTION = VC
DECLARE ORDCAPTION = VC
DECLARE SUSPCAPTION = VC
DECLARE DISCHARGECAPTION = VC
DECLARE VISITCAPTION = VC
DECLARE ADVANDIRCAPTION = VC
DECLARE CDSTATUSCAPTION = VC
DECLARE ALLERGIESCAPTION = VC
DECLARE DIETORDERSCAPTION = VC
DECLARE PATIENTACTCAPTION = VC
SET MODCAPTION = UAR_I18NGETMESSAGE (I18NHANDLE ,"cap1" ,"(c)" )
SET STARTDATECAPTION = UAR_I18NGETMESSAGE (I18NHANDLE ,"cap2" ,"   Start Date:" )
SET ORDCAPTION = UAR_I18NGETMESSAGE (I18NHANDLE ,"cap3" ," (ord.)" )
SET SUSPCAPTION = UAR_I18NGETMESSAGE (I18NHANDLE ,"cap4" ," (susp.)," )
SET DISCHARGECAPTION = UAR_I18NGETMESSAGE (I18NHANDLE ,"cap5" ,"Anticipated Discharge Date -- " )
SET VISITCAPTION = UAR_I18NGETMESSAGE (I18NHANDLE ,"cap6" ,"Reason for Visit -- " )
SET ADVANDIRCAPTION = UAR_I18NGETMESSAGE (I18NHANDLE ,"cap7" ,"Advance Directive -- " )
SET CDSTATUSCAPTION = UAR_I18NGETMESSAGE (I18NHANDLE ,"cap8" ,"Code Status -- " )
SET ALLERGIESCAPTION = UAR_I18NGETMESSAGE (I18NHANDLE ,"cap9" ,"Allergies -- " )
SET DIETORDERSCAPTION = UAR_I18NGETMESSAGE (I18NHANDLE ,"cap10" ,"Diet Orders -- " )
SET PATIENTACTCAPTION = UAR_I18NGETMESSAGE (I18NHANDLE ,"cap11" ,"Patient Activity -- " )
DECLARE SCRIPT_VERSION = VC WITH PUBLIC ,NOCONSTANT (" " )
DECLARE ALLERGY_STR = VC WITH PUBLIC ,NOCONSTANT (" " )
DECLARE REASON_VISIT = VC WITH PUBLIC ,NOCONSTANT (" " )
DECLARE ACTIVE = F8 WITH PUBLIC ,NOCONSTANT (0.0 )
DECLARE PROPOSED = F8 WITH PUBLIC ,NOCONSTANT (0.0 )
DECLARE INERROR = F8 WITH PUBLIC ,NOCONSTANT (0.0 )
DECLARE ADDIR = F8 WITH PUBLIC ,NOCONSTANT (0.0 )
DECLARE AUTH = F8 WITH PUBLIC ,NOCONSTANT (0.0 )
DECLARE MODIFIED = F8 WITH PUBLIC ,NOCONSTANT (0.0 )
DECLARE ORDERED = F8 WITH PUBLIC ,NOCONSTANT (0.0 )
DECLARE SUSPENDED = F8 WITH PUBLIC ,NOCONSTANT (0.0 )
DECLARE ACTIVITY_STR = VC WITH PUBLIC ,NOCONSTANT (" " )
DECLARE ADMIT = F8 WITH PUBLIC ,NOCONSTANT (0.0 )
DECLARE POWERCHART = F8 WITH PUBLIC ,NOCONSTANT (0.0 )
DECLARE ANTCIPDATE = F8 WITH PUBLIC ,NOCONSTANT (0.0 )
DECLARE ACTIVITY_TYPE_VAR = F8 WITH PUBLIC ,NOCONSTANT (0.0 )
DECLARE SUPPLEMENTS = F8 WITH PUBLIC ,NOCONSTANT (0.0 )
DECLARE TUBEFEEDING = F8 WITH PUBLIC ,NOCONSTANT (0.0 )
DECLARE SNACKS = F8 WITH PUBLIC ,NOCONSTANT (0.0 )
DECLARE PED_FORMULA = F8 WITH PUBLIC ,NOCONSTANT (0.0 )
DECLARE DIETSPECINSTRUCT = F8 WITH PUBLIC ,NOCONSTANT (0.0 )
DECLARE PATIENT_ACT = F8 WITH PUBLIC ,NOCONSTANT (0.0 )
DECLARE PATIENT_ACT_STAT = F8 WITH PUBLIC ,NOCONSTANT (0.0 )
SET REPLY->STATUS_DATA->STATUS = "F"
SET ADDIR = UAR_GET_CODE_BY_CKI ("CKI.EC!5734" )
SET ACTIVE = UAR_GET_CODE_BY ("MEANING" ,12025 ,"ACTIVE" )
SET PROPOSED = UAR_GET_CODE_BY ("MEANING" ,12025 ,"PROPOSED" )
SET MODIFIED = UAR_GET_CODE_BY ("MEANING" ,8 ,"MODIFIED" )
SET ORDERED = UAR_GET_CODE_BY ("MEANING" ,6004 ,"ORDERED" )
SET SUSPENDED = UAR_GET_CODE_BY ("MEANING" ,6004 ,"SUSPENDED" )
SET CATALOG_TYPE_VAR = UAR_GET_CODE_BY ("MEANING" ,6000 ,"DIETARY" )
SET ACTIVITY_TYPE_VAR = UAR_GET_CODE_BY ("DISPLAYKEY" ,106 ,"DIETS" )
SET SUPPLEMENTS = UAR_GET_CODE_BY ("DISPLAYKEY" ,106 ,"SUPPLEMENTS" )
SET TUBEFEEDING = UAR_GET_CODE_BY ("DISPLAYKEY" ,106 ,"TUBEFEEDING" )
SET SNACKS = UAR_GET_CODE_BY ("DISPLAYKEY" ,106 ,"SNACKS" )
SET PED_FORMULA = UAR_GET_CODE_BY ("DISPLAYKEY" ,106 ,"PEDIATRICFORMULAS" )
SET DIETSPECINSTRUCT = UAR_GET_CODE_BY ("DISPLAYKEY" ,106 ,"DIETSPECIALINSTRUCTIONS" )
SET PATIENT_ACT = UAR_GET_CODE_BY ("DISPLAYKEY" ,106 ,"PATIENTACTIVITY" )
SET PATIENT_ACT_STAT = UAR_GET_CODE_BY ("DISPLAYKEY" ,106 ,"PATIENTACTIVITYSTATUS" )
SET ADMIT = UAR_GET_CODE_BY_CKI ("CKI.CODEVALUE!17001" )
SET POWERCHART = UAR_GET_CODE_BY_CKI ("CKI.CODEVALUE!4835" )
SET ANTICIPDATE = UAR_GET_CODE_BY_CKI ("CKI.EC!8008" )
IF ((REQDATA->DATA_STATUS_CD > 0 ) )
SET AUTH = REQDATA->DATA_STATUS_CD
ELSE
SET AUTH = UAR_GET_CODE_BY ("MEANING" ,8 ,"AUTH" )
ENDIF
SELECT INTO "NL:"
CV.CODE_VALUE ,
CV.CONCEPT_CKI
FROM (CODE_VALUE CV )
PLAN (CV
WHERE (CV.CODE_SET = 106 ) AND (CV.CONCEPT_CKI IN (CKI_DIETS ,
CKI_SUPPLEMENTS ,
CKI_TUBEFEEDING ,
CKI_SNACKS ,
CKI_PEDIATRICFORMULAS ,
CKI_DIETSPECIALINSTRUCTIONS ,
CKI_PATIENTACTIVITY ,
CKI_PATIENTACTIVITYSTATUS ) ) )
DETAIL
CASE (CV.CONCEPT_CKI )
OF CKI_DIETS : ACTIVITY_TYPE_VAR = CV.CODE_VALUE
OF CKI_SUPPLEMENTS : SUPPLEMENTS = CV.CODE_VALUE
OF CKI_TUBEFEEDING : TUBEFEEDING = CV.CODE_VALUE
OF CKI_SNACKS : SNACKS = CV.CODE_VALUE
OF CKI_PEDIATRICFORMULAS : PED_FORMULA = CV.CODE_VALUE
OF CKI_DIETSPECIALINSTRUCTIONS : DIETSPECINSTRUCT = CV.CODE_VALUE
OF CKI_PATIENTACTIVITY : PATIENT_ACT = CV.CODE_VALUE
OF CKI_PATIENTACTIVITYSTATUS : PATIENT_ACT_STAT = CV.CODE_VALUE
ENDCASE
WITH NOCOUNTER ,SEPARATOR = " " ,FORMAT
SELECT INTO "nl:"
E.REASON_FOR_VISIT ,
DATE = FORMAT (E.BEG_EFFECTIVE_DT_TM ,"@SHORTDATETIMENOSEC" )
FROM (ENCOUNTER E )
WHERE (E.ENCNTR_ID = REQUEST->VISIT[1 ]->ENCNTR_ID )
DETAIL
IF ((E.REASON_FOR_VISIT > " " ) ) TEMP->REASON_VISIT_CNT = (TEMP->REASON_VISIT_CNT + 1 ) ,STAT =
ALTERLIST (TEMP->REASON_VISIT ,TEMP->REASON_VISIT_CNT ) ,TEMP->REASON_VISIT[TEMP->REASON_VISIT_CNT ]
->VISIT_REASON = CONCAT (TRIM (E.REASON_FOR_VISIT ) ," - " ,TRIM (DATE ) ) ,
IF ((E.REASON_FOR_VISIT > " " ) ) TEMP->REASON_VISIT[TEMP->REASON_VISIT_CNT ]->VISIT_REASON =
CONCAT (TRIM (E.REASON_FOR_VISIT ) ," - " ,DATE )
ENDIF
ENDIF
,
IF ((E.ACTIVE_IND = ACTIVE ) ) TEMP->REASON_VISIT = CONCAT (MODCAPTION ," " ,TEMP->REASON_VISIT )
ENDIF
WITH NOCOUNTER
 
 
SELECT INTO "nl:"
CE.RESULT_VAL ,
DATE = FORMAT (CE.EVENT_END_DT_TM ,"@SHORTDATETIMENOSEC" )
FROM CLINICAL_EVENT CE, ENCOUNTER E
WHERE
E.ENCNTR_ID = REQUEST->VISIT[1 ]->ENCNTR_ID
And E.PERSON_ID = CE.PERSON_ID and
(CE.ENCNTR_ID = REQUEST->VISIT[1 ]->ENCNTR_ID ) AND (CE.RESULT_STATUS_CD IN (AUTH ,
MODIFIED ) ) AND ((CE.EVENT_CD + 0 ) = ADDIR ) AND ((CE.VIEW_LEVEL + 0 ) = 1 ) AND ((
CE.PUBLISH_FLAG + 0 ) = 1 ) AND (CE.VALID_UNTIL_DT_TM >= CNVTDATETIME (CURDATE ,CURTIME3 ) ) AND (
CE.RESULT_VAL > " " )
ORDER BY CE.ENCNTR_ID ,
CNVTDATETIME (CE.EVENT_END_DT_TM ) DESC
 
HEAD CE.ENCNTR_ID
FOUND = 0
DETAIL
IF ((FOUND = 0 ) )
IF ((CE.RESULT_VAL > " " ) ) FOUND = 1 ,TEMP->ADV_DIR_CNT = (TEMP->ADV_DIR_CNT + 1 ) ,STAT =
ALTERLIST (TEMP->ADV_DIR_TYPE ,TEMP->ADV_DIR_CNT ) ,TEMP->ADV_DIR_TYPE[TEMP->ADV_DIR_CNT ]->ADV_DIR
= CONCAT (TRIM (CE.RESULT_VAL ) ," - " ,DATE )
ENDIF
,
IF ((CE.RESULT_STATUS_CD = MODIFIED ) ) TEMP->ADV_DIR_TYPE[TEMP->ADV_DIR_CNT ]->ADV_DIR = CONCAT (
MODCAPTION ," " ,TEMP->ADV_DIR_TYPE[TEMP->ADV_DIR_CNT ]->ADV_DIR )
ENDIF
ENDIF
FOOT  CE.ENCNTR_ID
FOUND = 0
WITH NOCOUNTER, ORAHINTCBO("INDEX (CE XIE9CLINICAL_EVENT)")
 
 
SELECT INTO "nl:"
OC.CONCEPT_CKI ,
O.ORDER_ID ,
STATUS = UAR_GET_CODE_DISPLAY (O.ORDER_STATUS_CD ) ,
DATE = FORMAT (O.CURRENT_START_DT_TM ,"@SHORTDATETIMENOSEC" )
FROM (ORDER_CATALOG OC ) ,
(ORDERS O ) ,
(ORDER_DETAIL OD )
PLAN (OC
WHERE (OC.CONCEPT_CKI IN (CODESTATUS ,
CODESTATUS2 ) ) AND (OC.ACTIVE_IND = 1 ) )
AND (O
WHERE (O.CATALOG_CD = OC.CATALOG_CD ) AND (O.ENCNTR_ID = REQUEST->VISIT[1 ]->ENCNTR_ID ) AND (
O.ACTIVE_IND = 1 ) AND ((O.ORDER_STATUS_CD + 0 ) IN (ORDERED ,
SUSPENDED ) ) )
AND (OD
WHERE (OD.ORDER_ID = O.ORDER_ID ) AND (OD.OE_FIELD_MEANING = "RESUSCITATIONSTATUS" ) )
ORDER BY CNVTDATETIME (O.CURRENT_START_DT_TM ) DESC ,
O.ORDER_ID ,
OD.ACTION_SEQUENCE DESC
HEAD O.ORDER_ID
IF ((OD.OE_FIELD_DISPLAY_VALUE > " " ) ) TEMP->CODE_STATUS_CNT = (TEMP->CODE_STATUS_CNT + 1 ) ,STAT
= ALTERLIST (TEMP->CODE_STATUS ,TEMP->CODE_STATUS_CNT ) ,TEMP->CODE_STATUS[TEMP->CODE_STATUS_CNT ]->
CODE_STAT = CONCAT (TRIM (OD.OE_FIELD_DISPLAY_VALUE ) ," - " ,TRIM (STATUS ) ,REOL ,
STARTDATECAPTION ," " ,DATE )
ENDIF
WITH NOCOUNTER
SELECT INTO "nl:"
N.SOURCE_STRING ,
A.SUBSTANCE_FTDESC ,
STATUS = UAR_GET_CODE_DISPLAY (A.REACTION_STATUS_CD ) ,
DATE = FORMAT (A.BEG_EFFECTIVE_DT_TM ,"@SHORTDATETIMENOSEC" )
FROM (ENCOUNTER E ) ,
(ALLERGY A ) ,
(NOMENCLATURE N )
PLAN (E
WHERE (E.ENCNTR_ID = REQUEST->VISIT[1 ]->ENCNTR_ID ) )
AND (A
WHERE (A.PERSON_ID = E.PERSON_ID ) AND (A.ACTIVE_IND = 1 ) AND (A.BEG_EFFECTIVE_DT_TM <=
CNVTDATETIME (CURDATE ,CURTIME3 ) ) AND (((A.END_EFFECTIVE_DT_TM >= CNVTDATETIME (CURDATE ,CURTIME3
) ) ) OR ((A.END_EFFECTIVE_DT_TM = NULL ) )) AND (A.REACTION_STATUS_CD IN (ACTIVE ,
PROPOSED ) ) )
AND (N
WHERE (N.NOMENCLATURE_ID = OUTERJOIN (A.SUBSTANCE_NOM_ID ) ) )
ORDER BY CNVTDATETIME (A.ONSET_DT_TM ) DESC
DETAIL
IF ((((N.SOURCE_STRING > " " ) ) OR ((A.SUBSTANCE_FTDESC > " " ) )) ) TEMP->ALLERGY_CNT = (TEMP->
ALLERGY_CNT + 1 ) ,STAT = ALTERLIST (TEMP->ALLERGIES ,TEMP->ALLERGY_CNT ) ,TEMP->ALLERGIES[TEMP->
ALLERGY_CNT ]->ALLERGY = CONCAT (TRIM (A.SUBSTANCE_FTDESC ) ," (" ,TRIM (STATUS ) ,")" ," - " ,TRIM
(DATE ) ) ,
IF ((N.SOURCE_STRING > " " ) ) TEMP->ALLERGIES[TEMP->ALLERGY_CNT ]->ALLERGY = CONCAT (TRIM (
N.SOURCE_STRING ) ," (" ,TRIM (STATUS ) ,")" ," - " ,TRIM (DATE ) )
ENDIF
ENDIF
WITH NOCOUNTER
SELECT INTO "nl:"
O.HNA_ORDER_MNEMONIC ,
O.CLINICAL_DISPLAY_LINE ,
STATUS = UAR_GET_CODE_DISPLAY (O.ORDER_STATUS_CD ) ,
DATE = FORMAT (O.CURRENT_START_DT_TM ,"@SHORTDATETIMENOSEC" ) ,
DATE2 = FORMAT (O.CURRENT_START_DT_TM ,"@SHORTDATETIMENOSEC" )
FROM (ORDERS O )
WHERE (O.ENCNTR_ID = REQUEST->VISIT[1 ]->ENCNTR_ID ) AND ((O.CATALOG_TYPE_CD + 0 ) =
CATALOG_TYPE_VAR ) AND ((O.ACTIVITY_TYPE_CD + 0 ) IN (ACTIVITY_TYPE_VAR ,
SUPPLEMENTS ,
TUBEFEEDING ,
SNACKS ,
DIETSPECINSTRUCT ) ) AND ((O.ORDER_STATUS_CD + 0 ) IN (ORDERED ,
SUSPENDED ) ) AND ((O.ACTIVE_IND + 0 ) = 1 ) AND ((O.TEMPLATE_ORDER_ID + 0 ) = 0 )
ORDER BY O.CURRENT_START_DT_TM DESC
DETAIL
TEMP->DIET_ORDERS_CNT = (TEMP->DIET_ORDERS_CNT + 1 ) ,
STAT = ALTERLIST (TEMP->DIET_ORDERS ,TEMP->DIET_ORDERS_CNT ) ,
IF ((O.HNA_ORDER_MNEMONIC > " " ) ) TEMP->DIET_ORDERS[TEMP->DIET_ORDERS_CNT ]->DIET_ORDER = CONCAT (
TRIM (O.HNA_ORDER_MNEMONIC ) ," - " ,TRIM (STATUS ) ," - " ,TRIM (O.CLINICAL_DISPLAY_LINE ) )
ELSE TEMP->DIET_ORDERS[TEMP->DIET_ORDERS_CNT ]->DIET_ORDER = CONCAT (TRIM (STATUS ) ," - " ,TRIM (
O.CLINICAL_DISPLAY_LINE ) )
ENDIF
WITH NOCOUNTER
SELECT DISTINCT INTO "nl:"
O.HNA_ORDER_MNEMONIC ,
DISPLAY = O.CLINICAL_DISPLAY_LINE ,
DATE = FORMAT (O.CURRENT_START_DT_TM ,"@SHORTDATE4YR" ) ,
STATUS = UAR_GET_CODE_DISPLAY (O.ORDER_STATUS_CD )
FROM (ORDERS O )
PLAN (O
WHERE (O.ENCNTR_ID = REQUEST->VISIT[1 ]->ENCNTR_ID ) AND ((O.ORDER_STATUS_CD + 0 ) IN (ORDERED ,
SUSPENDED ) ) AND (((O.ACTIVITY_TYPE_CD = PATIENT_ACT ) ) OR ((O.ACTIVITY_TYPE_CD =
PATIENT_ACT_STAT ) )) AND (O.ACTIVE_IND = 1 ) AND (O.ORDERABLE_TYPE_FLAG IN (0 ,
1 ) ) AND (O.TEMPLATE_ORDER_ID = 0 ) )
ORDER BY O.CATALOG_CD ,
CNVTDATETIME (O.ORIG_ORDER_DT_TM ) DESC
HEAD O.CATALOG_CD
IF ((O.HNA_ORDER_MNEMONIC > " " ) ) TEMP->PT_ACTIVITY_CNT = (TEMP->PT_ACTIVITY_CNT + 1 ) ,STAT =
ALTERLIST (TEMP->PT_ACTIVITIES ,TEMP->PT_ACTIVITY_CNT ) ,
CASE (O.ORDER_STATUS_CD )
OF ORDERED : TEMP->PT_ACTIVITIES[TEMP->PT_ACTIVITY_CNT ]->PT_ACTIVITY = CONCAT (TRIM (
O.HNA_ORDER_MNEMONIC ) ," " ,TRIM (DISPLAY ) ,ORDCAPTION ," - " ,DATE )
OF SUSPENDED : TEMP->PT_ACTIVITIES[TEMP->PT_ACTIVITY_CNT ]->PT_ACTIVITY = CONCAT (TRIM (
O.HNA_ORDER_MNEMONIC ) ," " ,TRIM (DISPLAY ) ,SUSPCAPTION ," - " ,DATE )
ENDCASE
ENDIF
WITH NOCOUNTER
SELECT INTO "nl:"
CE.RESULT_VAL
FROM CLINICAL_EVENT CE, ENCOUNTER E
WHERE E.ENCNTR_ID = REQUEST->VISIT[1 ]->ENCNTR_ID and
E.PERSON_ID = CE.PERSON_ID
AND (CE.RESULT_STATUS_CD IN (AUTH ,
MODIFIED ) ) AND ((CE.EVENT_CD + 0 ) = ANTICIPDATE ) AND (CE.VALID_UNTIL_DT_TM >= CNVTDATETIME (
CURDATE ,CURTIME3 ) ) AND (CE.RESULT_VAL > " " )
ORDER BY CE.EVENT_END_DT_TM DESC
 
HEAD REPORT
TEMP->ANTICIP_DC_DT = CE.RESULT_VAL ,
IF ((CE.RESULT_STATUS_CD = AUTH ) ) TEMP->ANTICIP_DC_DT_STR = CONCAT (SUBSTRING (7 ,2 ,
CE.RESULT_VAL ) ,"/" ,SUBSTRING (9 ,2 ,CE.RESULT_VAL ) ,"/" ,SUBSTRING (3 ,4 ,CE.RESULT_VAL ) )
ELSE TEMP->ANTICIP_DC_DT_STR = CONCAT (MODCAPTION ," " ,SUBSTRING (7 ,2 ,CE.RESULT_VAL ) ,"/" ,
SUBSTRING (9 ,2 ,CE.RESULT_VAL ) ,"/" ,SUBSTRING (3 ,4 ,CE.RESULT_VAL ) )
ENDIF
WITH NOCOUNTER, ORAHINTCBO("INDEX (CE XIE9CLINICAL_EVENT)")
SET DREC->LINE_CNT = (DREC->LINE_CNT + 1 )
SET STAT = ALTERLIST (DREC->LINE_QUAL ,DREC->LINE_CNT )
SET DREC->LINE_QUAL[DREC->LINE_CNT ]->DISP_LINE = CONCAT (RHEAD ,WB ,DISCHARGECAPTION ,REOL )
IF ((TEMP->ANTICIP_DC_DT > "" ) )
SET DREC->LINE_CNT = (DREC->LINE_CNT + 1 )
SET STAT = ALTERLIST (DREC->LINE_QUAL ,DREC->LINE_CNT )
SET DREC->LINE_QUAL[DREC->LINE_CNT ]->DISP_LINE = CONCAT (RHEAD ,WR ,TEMP->ANTICIP_DC_DT_STR ,REOL
)
ENDIF
SET DREC->LINE_CNT = (DREC->LINE_CNT + 1 )
SET STAT = ALTERLIST (DREC->LINE_QUAL ,DREC->LINE_CNT )
SET DREC->LINE_QUAL[DREC->LINE_CNT ]->DISP_LINE = CONCAT (RHEAD ,WB ,VISITCAPTION ,REOL )
IF ((TEMP->REASON_VISIT_CNT > 0 ) )
FOR (X = 1 TO TEMP->REASON_VISIT_CNT )
SET DREC->LINE_CNT = (DREC->LINE_CNT + 1 )
SET STAT = ALTERLIST (DREC->LINE_QUAL ,DREC->LINE_CNT )
SET DREC->LINE_QUAL[DREC->LINE_CNT ]->DISP_LINE = CONCAT (RHEAD ,WR ,TEMP->REASON_VISIT[X ]->
VISIT_REASON ,REOL )
ENDFOR
ENDIF
SET DREC->LINE_CNT = (DREC->LINE_CNT + 1 )
SET STAT = ALTERLIST (DREC->LINE_QUAL ,DREC->LINE_CNT )
SET DREC->LINE_QUAL[DREC->LINE_CNT ]->DISP_LINE = CONCAT (RHEAD ,WB ,ADVANDIRCAPTION ,REOL )
IF ((TEMP->ADV_DIR_CNT > 0 ) )
FOR (X = 1 TO TEMP->ADV_DIR_CNT )
SET DREC->LINE_CNT = (DREC->LINE_CNT + 1 )
SET STAT = ALTERLIST (DREC->LINE_QUAL ,DREC->LINE_CNT )
SET DREC->LINE_QUAL[DREC->LINE_CNT ]->DISP_LINE = CONCAT (RHEAD ,WR ,TRIM (TEMP->ADV_DIR_TYPE[X ]->
ADV_DIR ) ,REOL )
ENDFOR
ENDIF
SET DREC->LINE_CNT = (DREC->LINE_CNT + 1 )
SET STAT = ALTERLIST (DREC->LINE_QUAL ,DREC->LINE_CNT )
SET DREC->LINE_QUAL[DREC->LINE_CNT ]->DISP_LINE = CONCAT (RHEAD ,WB ,CDSTATUSCAPTION ,REOL )
IF ((TEMP->CODE_STATUS_CNT > 0 ) )
FOR (X = 1 TO TEMP->CODE_STATUS_CNT )
SET DREC->LINE_CNT = (DREC->LINE_CNT + 1 )
SET STAT = ALTERLIST (DREC->LINE_QUAL ,DREC->LINE_CNT )
SET DREC->LINE_QUAL[DREC->LINE_CNT ]->DISP_LINE = CONCAT (RHEAD ,WR ,TRIM (TEMP->CODE_STATUS[X ]->
CODE_STAT ) ,REOL )
ENDFOR
ENDIF
SET DREC->LINE_CNT = (DREC->LINE_CNT + 1 )
SET STAT = ALTERLIST (DREC->LINE_QUAL ,DREC->LINE_CNT )
SET DREC->LINE_QUAL[DREC->LINE_CNT ]->DISP_LINE = CONCAT (RHEAD ,WB ,ALLERGIESCAPTION ,REOL )
IF ((TEMP->ALLERGY_CNT > 0 ) )
FOR (X = 1 TO TEMP->ALLERGY_CNT )
SET DREC->LINE_CNT = (DREC->LINE_CNT + 1 )
SET STAT = ALTERLIST (DREC->LINE_QUAL ,DREC->LINE_CNT )
SET DREC->LINE_QUAL[DREC->LINE_CNT ]->DISP_LINE = CONCAT (RHEAD ,WR ,TRIM (TEMP->ALLERGIES[X ]->
ALLERGY ) ,REOL )
ENDFOR
ENDIF
SET DREC->LINE_CNT = (DREC->LINE_CNT + 1 )
SET STAT = ALTERLIST (DREC->LINE_QUAL ,DREC->LINE_CNT )
SET DREC->LINE_QUAL[DREC->LINE_CNT ]->DISP_LINE = CONCAT (RHEAD ,WB ,DIETORDERSCAPTION ,REOL )
IF ((TEMP->DIET_ORDERS_CNT > 0 ) )
FOR (X = 1 TO TEMP->DIET_ORDERS_CNT )
SET DREC->LINE_CNT = (DREC->LINE_CNT + 1 )
SET STAT = ALTERLIST (DREC->LINE_QUAL ,DREC->LINE_CNT )
SET DREC->LINE_QUAL[DREC->LINE_CNT ]->DISP_LINE = CONCAT (RHEAD ,WR ,TRIM (TEMP->DIET_ORDERS[X ]->
DIET_ORDER ) ,REOL )
ENDFOR
ENDIF
SET DREC->LINE_CNT = (DREC->LINE_CNT + 1 )
SET STAT = ALTERLIST (DREC->LINE_QUAL ,DREC->LINE_CNT )
SET DREC->LINE_QUAL[DREC->LINE_CNT ]->DISP_LINE = CONCAT (RHEAD ,WB ,PATIENTACTCAPTION ,REOL )
IF ((TEMP->PT_ACTIVITY_CNT > 0 ) )
FOR (X = 1 TO TEMP->PT_ACTIVITY_CNT )
SET DREC->LINE_CNT = (DREC->LINE_CNT + 1 )
SET STAT = ALTERLIST (DREC->LINE_QUAL ,DREC->LINE_CNT )
SET DREC->LINE_QUAL[DREC->LINE_CNT ]->DISP_LINE = CONCAT (RHEAD ,WR ,TRIM (TEMP->PT_ACTIVITIES[X ]->
PT_ACTIVITY ) ,REOL )
ENDFOR
ENDIF
#EXIT_SCRIPT
FOR (LIDX = 1 TO DREC->LINE_CNT )
SET REPLY->TEXT = CONCAT (REPLY->TEXT ,DREC->LINE_QUAL[LIDX ]->DISP_LINE )
ENDFOR
SET REPLY->TEXT = CONCAT (REPLY->TEXT ,RTFEOF )
SET REPLY->STATUS_DATA->STATUS = "S"
SET SCRIPT_VERSION = "018 11/11/2010 lb015443"
IF ((BDEBUG = 1 ) )
CALL ECHO (BUILD2 ("Run Date = " ,FORMAT (CURDATE ,"@SHORTDATE4YR" ) ) )
CALL ECHO (BUILD2 ("Script Version = " ,SCRIPT_VERSION ) )
CALL ECHORECORD (DREC )
CALL ECHORECORD (TEMP )
CALL ECHO (REPLY->TEXT )
ENDIF
END GO
