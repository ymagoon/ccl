/****************************************************************************
Program:  MAYO_MN_DIETARY_CENSUS
Created by:  Scott Easterhaus (Akcia)
Created Date:  04/2011
 
Description: for dieticians, pulls clinical information for inpatients by location
 
Modifications:
001-
002-
003-
*****************************************************************************/
 
 
DROP PROGRAM   MAYO_MN_DIETARY_CENSUS : DBA  GO
CREATE PROGRAM  MAYO_MN_DIETARY_CENSUS : DBA
PROMPT "Output to File/Printer/MINE" ="MINE" ,
"Facility" = 0
 WITH  OUTDEV , FACILITY
 
DECLARE  INERROR_CD  =  F8  WITH  PROTECT , CONSTANT ( UAR_GET_CODE_BY ("MEANING" ,  8 , "INERROR" )
)
 
DECLARE  ATTENDING_CD  =  F8  WITH  PROTECT , CONSTANT ( UAR_GET_CODE_BY ("MEANING" ,  333 ,
"ATTENDDOC" ))
 
DECLARE  DIETS_CD  =  F8  WITH  PROTECT , CONSTANT ( UAR_GET_CODE_BY ("DISPLAYKEY" ,  106 , "DIETS"
))
 
DECLARE  SUPPLEMENTS_CD  =  F8  WITH  PROTECT , CONSTANT ( UAR_GET_CODE_BY ("DISPLAYKEY" ,  106 ,
"SUPPLEMENTS" ))
 
DECLARE  DIETARY_CD  =  F8  WITH  CONSTANT ( UAR_GET_CODE_BY ("MEANING" ,  6000 , "DIETARY" ))
 
DECLARE  ORDERED_CD  =  F8  WITH  CONSTANT ( UAR_GET_CODE_BY ("MEANING" ,  6004 , "ORDERED" ))
 
DECLARE  ALBUMIN_CD  =  F8  WITH  PROTECT , CONSTANT ( UAR_GET_CODE_BY ("DISPLAYKEY" ,  72 ,
"ALBUMINLVL" ))
 
DECLARE  HGB_A1C_CD  =  F8  WITH  PROTECT , CONSTANT ( UAR_GET_CODE_BY ("DISPLAYKEY" ,  72 ,
"HGBA1C" ))
 
DECLARE  BRADEN_SCORE_CD  =  F8  WITH  PROTECT , CONSTANT ( UAR_GET_CODE_BY ("DISPLAYKEY" ,  72 ,
"BRADENSCORE" ))
 
DECLARE  BRADEN_Q_SCORE_CD  =  F8  WITH  PROTECT , CONSTANT ( UAR_GET_CODE_BY ("DISPLAYKEY" ,  72 ,
"BRADENQSCORE" ))
 
DECLARE  RISK_FACT_ADULT_CD  =  F8  WITH  PROTECT , CONSTANT ( UAR_GET_CODE_BY ("DISPLAYKEY" ,
 14003 , "NUTRITIONRISKFACTORSBYHISTORYADULT" ))
 
DECLARE  RISK_FACT_PEDS_CD  =  F8  WITH  PROTECT , CONSTANT ( UAR_GET_CODE_BY ("DISPLAYKEY" ,
 14003 , "NUTRITIONRISKFACTORSBYHXPEDIATRIC" ))
 
DECLARE  RISK_FACT_NEWBORN_CD  =  F8  WITH  PROTECT , CONSTANT ( UAR_GET_CODE_BY ("DISPLAYKEY" ,
 14003 , "NUTRITIONRISKFACTORSBYHXNEWBORN" ))
 
DECLARE  NUTRI_ASSESS_ADULT_CD  =  F8  WITH  PROTECT , CONSTANT ( UAR_GET_CODE_BY ("DISPLAYKEY" ,
 72 , "NUTRITIONASSESSMENTADULTFORM" ))
 
DECLARE  NUTRI_ASSESS_PEDS_CD  =  F8  WITH  PROTECT , CONSTANT ( UAR_GET_CODE_BY ("DISPLAYKEY" ,
 72 , "NUTRITIONASSESSMENTPEDIATRICFORM" ))
 
DECLARE  BREAKFAST_CD  =  F8  WITH  PROTECT , CONSTANT ( UAR_GET_CODE_BY ("DISPLAYKEY" ,  14003 ,
"BREAKFAST PERCENT" ))
 
DECLARE  LUNCH_CD  =  F8  WITH  PROTECT , CONSTANT ( UAR_GET_CODE_BY ("DISPLAYKEY" ,  14003 ,
"LUNCH PERCENT" ))
 
DECLARE  DINNER_CD  =  F8  WITH  PROTECT , CONSTANT ( UAR_GET_CODE_BY ("DISPLAYKEY" ,  14003 ,
"DINNER PERCENT" ))
 
DECLARE  AU_ICU_CD  =  F8  WITH  CONSTANT ( UAR_GET_CODE_BY ("DISPLAYKEY" ,  220 , "AUHOICU" ))
 
DECLARE  AU_MED_SURG_CD  =  F8  WITH  CONSTANT ( UAR_GET_CODE_BY ("DISPLAYKEY" ,  220 ,
"AUHOMEDSRGPD" ))
 
DECLARE  AU_PSYCH_CD  =  F8  WITH  CONSTANT ( UAR_GET_CODE_BY ("DISPLAYKEY" ,  220 , "AUHOPSYCH" ))
 
DECLARE  AU_TELEMETRY_CD  =  F8  WITH  CONSTANT ( UAR_GET_CODE_BY ("DISPLAYKEY" ,  220 ,
"AUHOTELEMETRY" ))
 
DECLARE  AU_WOMENS_CD  =  F8  WITH  CONSTANT ( UAR_GET_CODE_BY ("DISPLAYKEY" ,  220 ,
"AUHOWOMENSSC" ))
 
DECLARE  MED_SURG_NU_CD  =  F8  WITH  CONSTANT ( UAR_GET_CODE_BY ("DISPLAYKEY" ,  220 ,
"ALNHMEDSURG" ))
 
DECLARE  SPEC_CARE_NU_CD  =  F8  WITH  CONSTANT ( UAR_GET_CODE_BY ("DISPLAYKEY" ,  220 ,
"ALNHSPECCARE" ))
 
DECLARE  BABY_PLACE_NU_CD  =  F8  WITH  CONSTANT ( UAR_GET_CODE_BY ("DISPLAYKEY" ,  220 ,
"ALNHBABYPLACE" ))
 
RECORD  DATA  (
 1  QUAL [*]
 2  FACILITY  =  VC
 2  NURSE_UNIT  =  VC
 2  ROOM  =  VC
 2  BED  =  VC
 2  ENCNTR_ID  =  F8
 2  PERSON_ID  =  F8
 2  PAT_NAME  =  VC
 2  AGE  =  VC
 2  ADMIT_DATE  =  VC
 2  LOS  =  VC
 2  RISKS  =  VC
 2  BRADEN_SCORE  =  VC
 2  DIAGNOSIS  =  VC
 2  ATTENDING  =  VC
 2  DIET  =  VC
 2  SPEC_INSTRUCT  =  VC
 2  ALBUMIN  =  VC
 2  HGB_A1C  =  VC
 2  SUPPLEMENT  =  VC
 2  LEFT1  =  VC
 2  LEFT2  =  VC
 2  LEFT3  =  VC
 2  LEFT1_TYPE  =  C1
 2  LEFT2_TYPE  =  C1
 2  LEFT3_TYPE  =  C1
 2  RIGHT1  =  VC
 2  RIGHT2  =  VC
 2  RIGHT3  =  VC
 2  RIGHT1_TYPE  =  C1
 2  RIGHT2_TYPE  =  C1
 2  RIGHT3_TYPE  =  C1 )
 
SELECT  INTO "nl:"
ED.ENCNTR_ID,
 NURSE_UNIT = UAR_GET_CODE_DISPLAY (R.LOC_NURSE_UNIT_CD),
 ROOM = UAR_GET_CODE_DISPLAY (R.LOCATION_CD),
 BED = UAR_GET_CODE_DISPLAY (B.LOCATION_CD),
 FACILITY = UAR_GET_CODE_DISPLAY (NU.LOC_FACILITY_CD)
FROM ( NURSE_UNIT  NU ),
( ROOM  R ),
( BED  B ),
( DUMMYT  D ),
( ENCNTR_DOMAIN  ED )
 PLAN ( NU
WHERE (NU.LOC_FACILITY_CD= $FACILITY ) AND (NU.ACTIVE_IND= 1 ) AND (NU.LOCATION_CD IN (
 MED_SURG_NU_CD ,
 SPEC_CARE_NU_CD ,
 BABY_PLACE_NU_CD ,
 AU_ICU_CD ,
 AU_MED_SURG_CD ,
 AU_PSYCH_CD ,
 AU_TELEMETRY_CD ,
 AU_WOMENS_CD )))
 AND ( R
WHERE (R.LOC_NURSE_UNIT_CD=NU.LOCATION_CD) AND (R.ACTIVE_IND= 1 ) AND (R.END_EFFECTIVE_DT_TM>
 SYSDATE ))
 AND ( B
WHERE (B.LOC_ROOM_CD=R.LOCATION_CD) AND (B.ACTIVE_IND= 1 ) AND (B.END_EFFECTIVE_DT_TM> SYSDATE ))
 AND ( D )
 AND ( ED
WHERE (ED.LOC_NURSE_UNIT_CD=R.LOC_NURSE_UNIT_CD) AND (ED.LOC_BED_CD=B.LOCATION_CD) AND (
ED.LOC_ROOM_CD=R.LOCATION_CD) AND (ED.ACTIVE_IND= 1 ) AND (ED.END_EFFECTIVE_DT_TM> SYSDATE ))
 
ORDER BY  NURSE_UNIT ,
 ROOM ,
 BED
 
HEAD REPORT
 CNT = 0
DETAIL
 CNT =( CNT + 1 ),
 STAT = ALTERLIST ( DATA -> QUAL ,  CNT ),
 DATA -> QUAL [ CNT ]-> ENCNTR_ID =ED.ENCNTR_ID,
 DATA -> QUAL [ CNT ]-> PERSON_ID =ED.PERSON_ID,
 DATA -> QUAL [ CNT ]-> NURSE_UNIT = NURSE_UNIT ,
 DATA -> QUAL [ CNT ]-> ROOM = ROOM ,
 DATA -> QUAL [ CNT ]-> BED = BED ,
 DATA -> QUAL [ CNT ]-> FACILITY = FACILITY
 WITH  OUTERJOIN = D
 
SELECT  INTO "nl:"
 DATA -> QUAL [D.SEQ]-> ENCNTR_ID ,
P.NAME_FULL_FORMATTED,
P.PERSON_ID,
E.ENCNTR_ID
FROM ( DUMMYT  D  WITH  SEQ = SIZE ( DATA -> QUAL ,  5 )),
( ENCOUNTER  E ),
( PERSON  P ),
( ENCNTR_PRSNL_RELTN  EPR ),
( PRSNL  PL ),
( ORDERS  O ),
( ORDERS  O1 ),
( ORDER_DETAIL  OD )
 PLAN ( D
WHERE ( DATA -> QUAL [D.SEQ]-> ENCNTR_ID > 0 ))
 AND ( E
WHERE (E.ENCNTR_ID= DATA -> QUAL [D.SEQ]-> ENCNTR_ID ))
 AND ( P
WHERE (P.PERSON_ID=E.PERSON_ID))
 AND ( EPR
WHERE (EPR.ENCNTR_ID= OUTERJOIN (E.ENCNTR_ID)) AND (EPR.ENCNTR_PRSNL_R_CD= OUTERJOIN ( ATTENDING_CD
)) AND (EPR.ACTIVE_IND= OUTERJOIN ( 1 )) AND (EPR.END_EFFECTIVE_DT_TM> OUTERJOIN ( SYSDATE )))
 AND ( PL
WHERE (PL.PERSON_ID= OUTERJOIN (EPR.PRSNL_PERSON_ID)))
 AND ( O
WHERE (O.ENCNTR_ID= OUTERJOIN (E.ENCNTR_ID)) AND (O.CATALOG_TYPE_CD= OUTERJOIN ( DIETARY_CD )) AND (
O.ACTIVE_IND= OUTERJOIN ( 1 )) AND ((O.ORDER_STATUS_CD+ 0 )= OUTERJOIN ( ORDERED_CD )) AND ((
O.ACTIVITY_TYPE_CD+ 0 )= OUTERJOIN ( DIETS_CD )))
 AND ( O1
WHERE (O1.ENCNTR_ID= OUTERJOIN (E.ENCNTR_ID)) AND (O1.CATALOG_TYPE_CD= OUTERJOIN ( DIETARY_CD ))
 AND (O1.ACTIVE_IND= OUTERJOIN ( 1 )) AND ((O1.ORDER_STATUS_CD+ 0 )= OUTERJOIN ( ORDERED_CD )) AND (
(O1.ACTIVITY_TYPE_CD+ 0 )= OUTERJOIN ( SUPPLEMENTS_CD )))
 AND ( OD
WHERE (OD.ORDER_ID= OUTERJOIN (O1.ORDER_ID)) AND (OD.OE_FIELD_MEANING= OUTERJOIN ("DIETARYSUPP" )))
 
ORDER BY D.SEQ
 
DETAIL
 DATA -> QUAL [D.SEQ]-> ADMIT_DATE = FORMAT (E.REG_DT_TM, "mm/dd/yy;;d" ),
 DATA -> QUAL [D.SEQ]-> PAT_NAME =P.NAME_FULL_FORMATTED,
 DATA -> QUAL [D.SEQ]-> AGE = SUBSTRING ( 1 ,  5 ,  CNVTAGE (P.BIRTH_DT_TM)),
 DATA -> QUAL [D.SEQ]-> ATTENDING =PL.NAME_FULL_FORMATTED,
 DATA -> QUAL [D.SEQ]-> DIAGNOSIS =E.REASON_FOR_VISIT,
 DATA -> QUAL [D.SEQ]-> DIET =O.HNA_ORDER_MNEMONIC,
 DATA -> QUAL [D.SEQ]-> LOS = CNVTSTRING ( DATETIMEDIFF ( SYSDATE , E.REG_DT_TM),  11 ,  2 ),
 DATA -> QUAL [D.SEQ]-> SUPPLEMENT =OD.OE_FIELD_DISPLAY_VALUE
 WITH  NOCOUNTER
 
SELECT  INTO "nl:"
FROM ( DUMMYT  D  WITH  SEQ = SIZE ( DATA -> QUAL ,  5 )),
( CLINICAL_EVENT  CE )
 PLAN ( D
WHERE ( DATA -> QUAL [D.SEQ]-> ENCNTR_ID > 0 ))
 AND ( CE
WHERE (CE.ENCNTR_ID= DATA -> QUAL [D.SEQ]-> ENCNTR_ID ) AND (CE.TASK_ASSAY_CD IN (
 RISK_FACT_ADULT_CD ,
 RISK_FACT_PEDS_CD ,
 RISK_FACT_NEWBORN_CD )) AND (CE.VIEW_LEVEL= 1 ) AND (CE.VALID_UNTIL_DT_TM> SYSDATE ) AND (
CE.RESULT_STATUS_CD!= INERROR_CD ))
 
ORDER BY D.SEQ,
CE.EVENT_END_DT_TM DESC
 
HEAD D.SEQ
 DATA -> QUAL [D.SEQ]-> RISKS =CE.RESULT_VAL
 WITH  NOCOUNTER
 
SELECT  INTO "nl:"
FROM ( DUMMYT  D  WITH  SEQ = SIZE ( DATA -> QUAL ,  5 )),
( CLINICAL_EVENT  CE )
 PLAN ( D
WHERE ( DATA -> QUAL [D.SEQ]-> ENCNTR_ID > 0 ))
 AND ( CE
WHERE (CE.ENCNTR_ID= DATA -> QUAL [D.SEQ]-> ENCNTR_ID ) AND (CE.EVENT_CD IN ( NUTRI_ASSESS_ADULT_CD ,
 NUTRI_ASSESS_PEDS_CD )) AND (CE.VIEW_LEVEL= 1 ) AND (CE.VALID_UNTIL_DT_TM> SYSDATE ) AND (
CE.RESULT_STATUS_CD!= INERROR_CD ))
 
ORDER BY D.SEQ,
CE.EVENT_END_DT_TM DESC
 
HEAD D.SEQ
 DATA -> QUAL [D.SEQ]-> RIGHT1 = FORMAT (CE.EVENT_END_DT_TM, "mm/dd/yy hh:mm;;d" ), DATA -> QUAL [
D.SEQ]-> RIGHT1_TYPE ="A"
 WITH  NOCOUNTER
 
SELECT  INTO "nl:"
FROM ( DUMMYT  D  WITH  SEQ = SIZE ( DATA -> QUAL ,  5 )),
( CLINICAL_EVENT  CE )
 PLAN ( D
WHERE ( DATA -> QUAL [D.SEQ]-> ENCNTR_ID > 0 ))
 AND ( CE
WHERE (CE.ENCNTR_ID= DATA -> QUAL [D.SEQ]-> ENCNTR_ID ) AND (CE.TASK_ASSAY_CD IN ( BREAKFAST_CD ,
 LUNCH_CD ,
 DINNER_CD )) AND (CE.VIEW_LEVEL= 1 ) AND (CE.VALID_UNTIL_DT_TM> SYSDATE ) AND (CE.RESULT_STATUS_CD
!= INERROR_CD ))
 
ORDER BY D.SEQ,
CE.EVENT_END_DT_TM DESC
 
HEAD REPORT
 
IF ( ( DATA -> QUAL [D.SEQ]-> RIGHT1 >" " ) )  DATA -> QUAL [D.SEQ]-> RIGHT2 = CONCAT ( TRIM (
CE.RESULT_VAL,  3 ), "%  " ,  FORMAT (CE.EVENT_END_DT_TM, "mm/dd/yy hh:mm;;d" )),  DATA -> QUAL [
D.SEQ]-> RIGHT2_TYPE ="E"
ELSE   DATA -> QUAL [D.SEQ]-> RIGHT1 = CONCAT ( TRIM (CE.RESULT_VAL,  3 ), "%  " ,  FORMAT (
CE.EVENT_END_DT_TM, "mm/dd/yy hh:mm;;d" )),  DATA -> QUAL [D.SEQ]-> RIGHT1_TYPE ="E"
ENDIF
 
 WITH  NOCOUNTER
 
SELECT  INTO "nl:"
FROM ( DUMMYT  D  WITH  SEQ = SIZE ( DATA -> QUAL ,  5 )),
( CLINICAL_EVENT  CE )
 PLAN ( D
WHERE ( DATA -> QUAL [D.SEQ]-> ENCNTR_ID > 0 ))
 AND ( CE
WHERE (CE.ENCNTR_ID= DATA -> QUAL [D.SEQ]-> ENCNTR_ID ) AND (CE.EVENT_CD IN ( ALBUMIN_CD ,
 BRADEN_SCORE_CD ,
 BRADEN_Q_SCORE_CD )) AND (CE.VIEW_LEVEL= 1 ) AND (CE.VALID_UNTIL_DT_TM> SYSDATE ) AND (
CE.RESULT_STATUS_CD!= INERROR_CD ))
 
ORDER BY D.SEQ,
CE.EVENT_CD,
CE.EVENT_END_DT_TM DESC
 
HEAD D.SEQ
 COL + 1
HEAD CE.EVENT_CD
 
IF ( (CE.EVENT_CD= ALBUMIN_CD ) )  DATA -> QUAL [D.SEQ]-> LEFT1 =CE.RESULT_VAL,  DATA -> QUAL [D.SEQ
]-> LEFT1_TYPE ="A"
ELSEIF ( (CE.EVENT_CD IN ( BRADEN_SCORE_CD ,
 BRADEN_Q_SCORE_CD )) )  DATA -> QUAL [D.SEQ]-> BRADEN_SCORE =CE.RESULT_VAL
ENDIF
 
DETAIL
 
 CALL ECHO ( BUILD (CE.ENCNTR_ID, CE.RESULT_VAL))
 WITH  NOCOUNTER
 
SELECT  INTO "nl:"
FROM ( DUMMYT  D  WITH  SEQ = SIZE ( DATA -> QUAL ,  5 )),
( CLINICAL_EVENT  CE )
 PLAN ( D
WHERE ( DATA -> QUAL [D.SEQ]-> PERSON_ID > 0 ))
 AND ( CE
WHERE (CE.PERSON_ID= DATA -> QUAL [D.SEQ]-> PERSON_ID ) AND (CE.EVENT_CD= HGB_A1C_CD ) AND (
CE.VIEW_LEVEL= 1 ) AND (CE.VALID_UNTIL_DT_TM> SYSDATE ) AND (CE.RESULT_STATUS_CD!= INERROR_CD ))
 
ORDER BY D.SEQ,
CE.EVENT_CD,
CE.EVENT_END_DT_TM DESC
 
HEAD D.SEQ
 COL + 1
HEAD CE.EVENT_CD
 
IF ( ( DATA -> QUAL [D.SEQ]-> LEFT1 >" " ) )  DATA -> QUAL [D.SEQ]-> LEFT2 =CE.RESULT_VAL,  DATA ->
 QUAL [D.SEQ]-> LEFT2_TYPE ="H"
ELSE   DATA -> QUAL [D.SEQ]-> LEFT1 =CE.RESULT_VAL,  DATA -> QUAL [D.SEQ]-> LEFT1_TYPE ="H"
ENDIF
 
 WITH  NOCOUNTER
 
FOR (  X  =  1  TO  SIZE ( DATA -> QUAL ,  5 ) )
 
IF ( ( DATA -> QUAL [ X ]-> SUPPLEMENT >" " ) )
IF ( ( DATA -> QUAL [ X ]-> LEFT1 >" " ) )
IF ( ( DATA -> QUAL [ X ]-> LEFT2 >" " ) )
SET  DATA -> QUAL [ X ]-> LEFT3  =  DATA -> QUAL [ X ]-> SUPPLEMENT
SET  DATA -> QUAL [ X ]-> LEFT3_TYPE  = "S"
ELSE
SET  DATA -> QUAL [ X ]-> LEFT2  =  DATA -> QUAL [ X ]-> SUPPLEMENT
SET  DATA -> QUAL [ X ]-> LEFT2_TYPE  = "S"
ENDIF
 
ELSE
SET  DATA -> QUAL [ X ]-> LEFT1  =  DATA -> QUAL [ X ]-> SUPPLEMENT
SET  DATA -> QUAL [ X ]-> LEFT1_TYPE  = "S"
ENDIF
 
ENDIF
 
 
ENDFOR
 
 
 CALL ECHORECORD ( DATA )
 
 EXECUTE REPORTRTL
 
DECLARE  _CREATEFONTS ( DUMMY ) =  NULL  WITH  PROTECT
 
DECLARE  _CREATEPENS ( DUMMY ) =  NULL  WITH  PROTECT
 
DECLARE  PAGEBREAK ( DUMMY ) =  NULL  WITH  PROTECT
 
DECLARE  FINALIZEREPORT (( SSENDREPORT = VC )) =  NULL  WITH  PROTECT
 
DECLARE  HEADPAGESECTION (( NCALC = I2 )) =  F8  WITH  PROTECT
 
DECLARE  HEADPAGESECTIONABS (( NCALC = I2 ), ( OFFSETX = F8 ), ( OFFSETY = F8 )) =  F8  WITH
 PROTECT
 
DECLARE  DETAILSECTION (( NCALC = I2 )) =  F8  WITH  PROTECT
 
DECLARE  DETAILSECTIONABS (( NCALC = I2 ), ( OFFSETX = F8 ), ( OFFSETY = F8 )) =  F8  WITH  PROTECT
 
DECLARE  LAYOUTSECTION1 (( NCALC = I2 )) =  F8  WITH  PROTECT
 
DECLARE  LAYOUTSECTION1ABS (( NCALC = I2 ), ( OFFSETX = F8 ), ( OFFSETY = F8 )) =  F8  WITH
 PROTECT
 
DECLARE  LAYOUTSECTION2 (( NCALC = I2 )) =  F8  WITH  PROTECT
 
DECLARE  LAYOUTSECTION2ABS (( NCALC = I2 ), ( OFFSETX = F8 ), ( OFFSETY = F8 )) =  F8  WITH
 PROTECT
 
DECLARE  LAYOUTSECTION3 (( NCALC = I2 )) =  F8  WITH  PROTECT
 
DECLARE  LAYOUTSECTION3ABS (( NCALC = I2 ), ( OFFSETX = F8 ), ( OFFSETY = F8 )) =  F8  WITH
 PROTECT
 
DECLARE  BLANKSECTION (( NCALC = I2 )) =  F8  WITH  PROTECT
 
DECLARE  BLANKSECTIONABS (( NCALC = I2 ), ( OFFSETX = F8 ), ( OFFSETY = F8 )) =  F8  WITH  PROTECT
 
DECLARE  INITIALIZEREPORT ( DUMMY ) =  NULL  WITH  PROTECT
 
DECLARE  _HREPORT  =  I4  WITH  NOCONSTANT ( 0 ), PROTECT
 
DECLARE  _YOFFSET  =  F8  WITH  NOCONSTANT ( 0.0 ), PROTECT
 
DECLARE  _XOFFSET  =  F8  WITH  NOCONSTANT ( 0.0 ), PROTECT
 
DECLARE  RPT_RENDER  =  I2  WITH  CONSTANT ( 0 ), PROTECT
 
DECLARE  _CRLF  =  VC  WITH  CONSTANT ( CONCAT ( CHAR ( 13 ),  CHAR ( 10 ))), PROTECT
 
DECLARE  RPT_CALCHEIGHT  =  I2  WITH  CONSTANT ( 1 ), PROTECT
 
DECLARE  _YSHIFT  =  F8  WITH  NOCONSTANT ( 0.0 ), PROTECT
 
DECLARE  _XSHIFT  =  F8  WITH  NOCONSTANT ( 0.0 ), PROTECT
 
DECLARE  _SENDTO  =  VC  WITH  NOCONSTANT ("" ), PROTECT
 
DECLARE  _RPTERR  =  I2  WITH  NOCONSTANT ( 0 ), PROTECT
 
DECLARE  _RPTSTAT  =  I2  WITH  NOCONSTANT ( 0 ), PROTECT
 
DECLARE  _OLDFONT  =  I4  WITH  NOCONSTANT ( 0 ), PROTECT
 
DECLARE  _OLDPEN  =  I4  WITH  NOCONSTANT ( 0 ), PROTECT
 
DECLARE  _DUMMYFONT  =  I4  WITH  NOCONSTANT ( 0 ), PROTECT
 
DECLARE  _DUMMYPEN  =  I4  WITH  NOCONSTANT ( 0 ), PROTECT
 
DECLARE  _FDRAWHEIGHT  =  F8  WITH  NOCONSTANT ( 0.0 ), PROTECT
 
DECLARE  _RPTPAGE  =  I4  WITH  NOCONSTANT ( 0 ), PROTECT
 
DECLARE  _OUTPUTTYPE  =  I2  WITH  NOCONSTANT ( RPT_POSTSCRIPT ), PROTECT
 
DECLARE  _TIMES10B0  =  I4  WITH  NOCONSTANT ( 0 ), PROTECT
 
DECLARE  _TIMES12B0  =  I4  WITH  NOCONSTANT ( 0 ), PROTECT
 
DECLARE  _TIMES100  =  I4  WITH  NOCONSTANT ( 0 ), PROTECT
 
DECLARE  _PEN14S0C0  =  I4  WITH  NOCONSTANT ( 0 ), PROTECT
 
SUBROUTINE   PAGEBREAK  ( DUMMY  )
 
SET  _RPTPAGE  =  UAR_RPTENDPAGE ( _HREPORT )
SET  _RPTPAGE  =  UAR_RPTSTARTPAGE ( _HREPORT )
SET  _YOFFSET  =  RPTREPORT -> M_MARGINTOP
 
END ;Subroutine
 
 
SUBROUTINE   FINALIZEREPORT  ( SSENDREPORT  )
 
SET  _RPTPAGE  =  UAR_RPTENDPAGE ( _HREPORT )
SET  _RPTSTAT  =  UAR_RPTENDREPORT ( _HREPORT )
DECLARE  SFILENAME  =  VC  WITH  NOCONSTANT ( TRIM ( SSENDREPORT )), PRIVATE
DECLARE  BPRINT  =  I2  WITH  NOCONSTANT ( 0 ), PRIVATE
IF ( ( TEXTLEN ( SFILENAME )> 0 ) )
SET  BPRINT  =  CHECKQUEUE ( SFILENAME )
IF (  BPRINT  )
 EXECUTE CPM_CREATE_FILE_NAME "RPT" ,
"PS"
SET  SFILENAME  =  CPM_CFN_INFO -> FILE_NAME_PATH
ENDIF
 
ENDIF
 
SET  _RPTSTAT  =  UAR_RPTPRINTTOFILE ( _HREPORT ,  NULLTERM ( SFILENAME ))
IF (  BPRINT  )
SET  SPOOL  VALUE ( SFILENAME ) VALUE ( SSENDREPORT ) WITH  DELETED
ENDIF
 
DECLARE  _ERRORFOUND  =  I2  WITH  NOCONSTANT ( 0 ), PROTECT
DECLARE  _ERRCNT  =  I2  WITH  NOCONSTANT ( 0 ), PROTECT
SET  _ERRORFOUND  =  UAR_RPTFIRSTERROR ( _HREPORT ,  RPTERROR )
WHILE ( ( _ERRORFOUND = RPT_ERRORFOUND ) AND ( _ERRCNT < 512 ))
 
SET  _ERRCNT  = ( _ERRCNT + 1 )
SET  STAT  =  ALTERLIST ( RPTERRORS -> ERRORS ,  _ERRCNT )
SET  RPTERRORS -> ERRORS [ _ERRCNT ]-> M_SEVERITY  =  RPTERROR -> M_SEVERITY
SET  RPTERRORS -> ERRORS [ _ERRCNT ]-> M_TEXT  =  RPTERROR -> M_TEXT
SET  RPTERRORS -> ERRORS [ _ERRCNT ]-> M_SOURCE  =  RPTERROR -> M_SOURCE
SET  _ERRORFOUND  =  UAR_RPTNEXTERROR ( _HREPORT ,  RPTERROR )
 
ENDWHILE
 
SET  _RPTSTAT  =  UAR_RPTDESTROYREPORT ( _HREPORT )
 
END ;Subroutine
 
 
SUBROUTINE   HEADPAGESECTION  ( NCALC  )
 
DECLARE  A1  =  F8  WITH  NOCONSTANT ( 0.0 ), PRIVATE
SET  A1  =  HEADPAGESECTIONABS ( NCALC ,  _XOFFSET ,  _YOFFSET ) RETURN ( A1 )
 
 
END ;Subroutine
 
 
SUBROUTINE   HEADPAGESECTIONABS  ( NCALC ,  OFFSETX ,  OFFSETY  )
 
DECLARE  SECTIONHEIGHT  =  F8  WITH  NOCONSTANT ( 1.000000 ), PRIVATE
IF ( ( NCALC = RPT_RENDER ) )
SET  RPTSD -> M_FLAGS  =  0
SET  RPTSD -> M_BORDERS  =  RPT_SDNOBORDERS
SET  RPTSD -> M_PADDING  =  RPT_SDNOBORDERS
SET  RPTSD -> M_PADDINGWIDTH  =  0.000
SET  RPTSD -> M_LINESPACING  =  RPT_SINGLE
SET  RPTSD -> M_ROTATIONANGLE  =  0
SET  RPTSD -> M_Y  = ( OFFSETY + 0.250 )
SET  RPTSD -> M_X  = ( OFFSETX + 0.010 )
SET  RPTSD -> M_WIDTH  =  1.240
SET  RPTSD -> M_HEIGHT  =  0.260
SET  _OLDPEN  =  UAR_RPTSETPEN ( _HREPORT ,  _PEN14S0C0 )
SET  _FDRAWHEIGHT  =  UAR_RPTSTRINGDRAW ( _HREPORT ,  RPTSD ,  BUILD2 ( FORMAT ( SYSDATE ,
"mm/dd/yy hh:mm;;d" ),  CHAR ( 0 )))
SET  RPTSD -> M_FLAGS  =  64
SET  RPTSD -> M_Y  = ( OFFSETY + 0.250 )
SET  RPTSD -> M_X  = ( OFFSETX + 8.625 )
SET  RPTSD -> M_WIDTH  =  1.406
SET  RPTSD -> M_HEIGHT  =  0.271
SET  _FDRAWHEIGHT  =  UAR_RPTSTRINGDRAW ( _HREPORT ,  RPTSD ,  BUILD2 ( RPT_PAGEOFPAGE ,  CHAR ( 0 )
))
SET  RPTSD -> M_FLAGS  =  260
SET  RPTSD -> M_Y  = ( OFFSETY + 0.740 )
SET  RPTSD -> M_X  = ( OFFSETX + - ( 0.010 ))
SET  RPTSD -> M_WIDTH  =  0.760
SET  RPTSD -> M_HEIGHT  =  0.260
SET  _OLDFONT  =  UAR_RPTSETFONT ( _HREPORT ,  _TIMES10B0 )
SET  _FDRAWHEIGHT  =  UAR_RPTSTRINGDRAW ( _HREPORT ,  RPTSD ,  BUILD2 ("Room/Bed" ,  CHAR ( 0 )))
SET  RPTSD -> M_Y  = ( OFFSETY + 0.740 )
SET  RPTSD -> M_X  = ( OFFSETX + 0.750 )
SET  RPTSD -> M_WIDTH  =  0.594
SET  RPTSD -> M_HEIGHT  =  0.260
SET  _FDRAWHEIGHT  =  UAR_RPTSTRINGDRAW ( _HREPORT ,  RPTSD ,  BUILD2 ("Patient" ,  CHAR ( 0 )))
SET  RPTSD -> M_Y  = ( OFFSETY + 0.740 )
SET  RPTSD -> M_X  = ( OFFSETX + 3.063 )
SET  RPTSD -> M_WIDTH  =  0.656
SET  RPTSD -> M_HEIGHT  =  0.260
SET  _FDRAWHEIGHT  =  UAR_RPTSTRINGDRAW ( _HREPORT ,  RPTSD ,  BUILD2 ("Age" ,  CHAR ( 0 )))
SET  RPTSD -> M_FLAGS  =  276
SET  RPTSD -> M_Y  = ( OFFSETY + 0.740 )
SET  RPTSD -> M_X  = ( OFFSETX + 3.438 )
SET  RPTSD -> M_WIDTH  =  0.688
SET  RPTSD -> M_HEIGHT  =  0.260
SET  _FDRAWHEIGHT  =  UAR_RPTSTRINGDRAW ( _HREPORT ,  RPTSD ,  BUILD2 ("Admit Date" ,  CHAR ( 0 )))
SET  RPTSD -> M_FLAGS  =  260
SET  RPTSD -> M_Y  = ( OFFSETY + 0.740 )
SET  RPTSD -> M_X  = ( OFFSETX + 4.250 )
SET  RPTSD -> M_WIDTH  =  0.375
SET  RPTSD -> M_HEIGHT  =  0.260
SET  _FDRAWHEIGHT  =  UAR_RPTSTRINGDRAW ( _HREPORT ,  RPTSD ,  BUILD2 ("LOS" ,  CHAR ( 0 )))
SET  RPTSD -> M_Y  = ( OFFSETY + 0.740 )
SET  RPTSD -> M_X  = ( OFFSETX + 4.625 )
SET  RPTSD -> M_WIDTH  =  0.500
SET  RPTSD -> M_HEIGHT  =  0.260
SET  _FDRAWHEIGHT  =  UAR_RPTSTRINGDRAW ( _HREPORT ,  RPTSD ,  BUILD2 ("Braden" ,  CHAR ( 0 )))
SET  RPTSD -> M_Y  = ( OFFSETY + 0.740 )
SET  RPTSD -> M_X  = ( OFFSETX + 5.188 )
SET  RPTSD -> M_WIDTH  =  0.813
SET  RPTSD -> M_HEIGHT  =  0.260
SET  _FDRAWHEIGHT  =  UAR_RPTSTRINGDRAW ( _HREPORT ,  RPTSD ,  BUILD2 ("Diagnosis" ,  CHAR ( 0 )))
SET  RPTSD -> M_Y  = ( OFFSETY + 0.740 )
SET  RPTSD -> M_X  = ( OFFSETX + 8.125 )
SET  RPTSD -> M_WIDTH  =  1.229
SET  RPTSD -> M_HEIGHT  =  0.260
SET  _FDRAWHEIGHT  =  UAR_RPTSTRINGDRAW ( _HREPORT ,  RPTSD ,  BUILD2 ("Attending Dr" ,  CHAR ( 0 ))
)
SET  RPTSD -> M_FLAGS  =  20
SET  RPTSD -> M_Y  = ( OFFSETY + 0.438 )
SET  RPTSD -> M_X  = ( OFFSETX + 3.500 )
SET  RPTSD -> M_WIDTH  =  3.000
SET  RPTSD -> M_HEIGHT  =  0.260
SET  _DUMMYFONT  =  UAR_RPTSETFONT ( _HREPORT ,  _TIMES12B0 )
SET  _FDRAWHEIGHT  =  UAR_RPTSTRINGDRAW ( _HREPORT ,  RPTSD ,  BUILD2 ("Dietician Patient List" ,
 CHAR ( 0 )))
SET  RPTSD -> M_FLAGS  =  16
SET  RPTSD -> M_Y  = ( OFFSETY + 0.250 )
SET  RPTSD -> M_X  = ( OFFSETX + 3.500 )
SET  RPTSD -> M_WIDTH  =  3.000
SET  RPTSD -> M_HEIGHT  =  0.260
SET  _FDRAWHEIGHT  =  UAR_RPTSTRINGDRAW ( _HREPORT ,  RPTSD ,  BUILD2 ( DATA -> QUAL [ CNTR ]->
 FACILITY ,  CHAR ( 0 )))
SET  _DUMMYFONT  =  UAR_RPTSETFONT ( _HREPORT ,  _OLDFONT )
SET  _DUMMYPEN  =  UAR_RPTSETPEN ( _HREPORT ,  _OLDPEN )
SET  _YOFFSET  = ( OFFSETY + SECTIONHEIGHT )
ENDIF
 RETURN ( SECTIONHEIGHT )
 
 
END ;Subroutine
 
 
SUBROUTINE   DETAILSECTION  ( NCALC  )
 
DECLARE  A1  =  F8  WITH  NOCONSTANT ( 0.0 ), PRIVATE
SET  A1  =  DETAILSECTIONABS ( NCALC ,  _XOFFSET ,  _YOFFSET ) RETURN ( A1 )
 
 
END ;Subroutine
 
 
SUBROUTINE   DETAILSECTIONABS  ( NCALC ,  OFFSETX ,  OFFSETY  )
 
DECLARE  SECTIONHEIGHT  =  F8  WITH  NOCONSTANT ( 0.450000 ), PRIVATE
IF ( ( NCALC = RPT_RENDER ) )
SET  RPTSD -> M_FLAGS  =  0
SET  RPTSD -> M_BORDERS  =  RPT_SDNOBORDERS
SET  RPTSD -> M_PADDING  =  RPT_SDNOBORDERS
SET  RPTSD -> M_PADDINGWIDTH  =  0.000
SET  RPTSD -> M_LINESPACING  =  RPT_SINGLE
SET  RPTSD -> M_ROTATIONANGLE  =  0
SET  RPTSD -> M_Y  = ( OFFSETY + 0.000 )
SET  RPTSD -> M_X  = ( OFFSETX + 0.000 )
SET  RPTSD -> M_WIDTH  =  0.990
SET  RPTSD -> M_HEIGHT  =  0.260
SET  _OLDPEN  =  UAR_RPTSETPEN ( _HREPORT ,  _PEN14S0C0 )
SET  _FDRAWHEIGHT  =  UAR_RPTSTRINGDRAW ( _HREPORT ,  RPTSD ,  BUILD2 ( CONCAT ( DATA -> QUAL [
 CNTR ]-> ROOM , "   " ,  DATA -> QUAL [D.SEQ]-> BED ),  CHAR ( 0 )))
SET  RPTSD -> M_Y  = ( OFFSETY + 0.000 )
SET  RPTSD -> M_X  = ( OFFSETX + 0.750 )
SET  RPTSD -> M_WIDTH  =  2.250
SET  RPTSD -> M_HEIGHT  =  0.271
SET  _FDRAWHEIGHT  =  UAR_RPTSTRINGDRAW ( _HREPORT ,  RPTSD ,  BUILD2 ( DATA -> QUAL [ CNTR ]->
 PAT_NAME ,  CHAR ( 0 )))
SET  RPTSD -> M_Y  = ( OFFSETY + 0.000 )
SET  RPTSD -> M_X  = ( OFFSETX + 3.000 )
SET  RPTSD -> M_WIDTH  =  0.438
SET  RPTSD -> M_HEIGHT  =  0.260
SET  _FDRAWHEIGHT  =  UAR_RPTSTRINGDRAW ( _HREPORT ,  RPTSD ,  BUILD2 (
IF ( ( DATA -> QUAL [ CNTR ]-> PAT_NAME >" " ) )  DATA -> QUAL [ CNTR ]-> AGE
ELSE  " "
ENDIF
,  CHAR ( 0 )))
SET  RPTSD -> M_FLAGS  =  16
SET  RPTSD -> M_Y  = ( OFFSETY + 0.000 )
SET  RPTSD -> M_X  = ( OFFSETX + 3.438 )
SET  RPTSD -> M_WIDTH  =  0.688
SET  RPTSD -> M_HEIGHT  =  0.260
SET  _FDRAWHEIGHT  =  UAR_RPTSTRINGDRAW ( _HREPORT ,  RPTSD ,  BUILD2 ( DATA -> QUAL [ CNTR ]->
 ADMIT_DATE ,  CHAR ( 0 )))
SET  RPTSD -> M_FLAGS  =  0
SET  RPTSD -> M_Y  = ( OFFSETY + 0.000 )
SET  RPTSD -> M_X  = ( OFFSETX + 4.250 )
SET  RPTSD -> M_WIDTH  =  0.375
SET  RPTSD -> M_HEIGHT  =  0.260
SET  _FDRAWHEIGHT  =  UAR_RPTSTRINGDRAW ( _HREPORT ,  RPTSD ,  BUILD2 (
IF ( ( DATA -> QUAL [ CNTR ]-> PAT_NAME >" " ) )  DATA -> QUAL [ CNTR ]-> LOS
ELSE  " "
ENDIF
,  CHAR ( 0 )))
SET  RPTSD -> M_FLAGS  =  16
SET  RPTSD -> M_Y  = ( OFFSETY + 0.000 )
SET  RPTSD -> M_X  = ( OFFSETX + 4.625 )
SET  RPTSD -> M_WIDTH  =  0.375
SET  RPTSD -> M_HEIGHT  =  0.260
SET  _FDRAWHEIGHT  =  UAR_RPTSTRINGDRAW ( _HREPORT ,  RPTSD ,  BUILD2 ( DATA -> QUAL [ CNTR ]->
 BRADEN_SCORE ,  CHAR ( 0 )))
SET  RPTSD -> M_FLAGS  =  0
SET  RPTSD -> M_Y  = ( OFFSETY + 0.000 )
SET  RPTSD -> M_X  = ( OFFSETX + 5.188 )
SET  RPTSD -> M_WIDTH  =  2.813
SET  RPTSD -> M_HEIGHT  =  0.271
SET  _FDRAWHEIGHT  =  UAR_RPTSTRINGDRAW ( _HREPORT ,  RPTSD ,  BUILD2 ( DATA -> QUAL [ CNTR ]->
 DIAGNOSIS ,  CHAR ( 0 )))
SET  RPTSD -> M_Y  = ( OFFSETY + 0.000 )
SET  RPTSD -> M_X  = ( OFFSETX + 8.125 )
SET  RPTSD -> M_WIDTH  =  1.875
SET  RPTSD -> M_HEIGHT  =  0.281
SET  _FDRAWHEIGHT  =  UAR_RPTSTRINGDRAW ( _HREPORT ,  RPTSD ,  BUILD2 ( DATA -> QUAL [D.SEQ]->
 ATTENDING ,  CHAR ( 0 )))
SET  RPTSD -> M_Y  = ( OFFSETY + 0.260 )
SET  RPTSD -> M_X  = ( OFFSETX + 0.000 )
SET  RPTSD -> M_WIDTH  =  3.250
SET  RPTSD -> M_HEIGHT  =  0.177
SET  _FDRAWHEIGHT  =  UAR_RPTSTRINGDRAW ( _HREPORT ,  RPTSD ,  BUILD2 ( CONCAT ("Diet: " ,  DATA ->
 QUAL [ CNTR ]-> DIET ),  CHAR ( 0 )))
SET  RPTSD -> M_Y  = ( OFFSETY + 0.250 )
SET  RPTSD -> M_X  = ( OFFSETX + 3.750 )
SET  RPTSD -> M_WIDTH  =  5.688
SET  RPTSD -> M_HEIGHT  =  0.177
IF ( ( DATA -> QUAL [D.SEQ]-> RISKS >" " ) )
SET  _FDRAWHEIGHT  =  UAR_RPTSTRINGDRAW ( _HREPORT ,  RPTSD ,  BUILD2 ( CONCAT ("Risks:  " ,  DATA
-> QUAL [D.SEQ]-> RISKS ),  CHAR ( 0 )))
ENDIF
 
SET  _DUMMYPEN  =  UAR_RPTSETPEN ( _HREPORT ,  _OLDPEN )
SET  _YOFFSET  = ( OFFSETY + SECTIONHEIGHT )
ENDIF
 RETURN ( SECTIONHEIGHT )
 
 
END ;Subroutine
 
 
SUBROUTINE   LAYOUTSECTION1  ( NCALC  )
 
DECLARE  A1  =  F8  WITH  NOCONSTANT ( 0.0 ), PRIVATE
SET  A1  =  LAYOUTSECTION1ABS ( NCALC ,  _XOFFSET ,  _YOFFSET ) RETURN ( A1 )
 
 
END ;Subroutine
 
 
SUBROUTINE   LAYOUTSECTION1ABS  ( NCALC ,  OFFSETX ,  OFFSETY  )
 
DECLARE  SECTIONHEIGHT  =  F8  WITH  NOCONSTANT ( 0.270000 ), PRIVATE
IF (  NOT ( (( ( DATA -> QUAL [ CNTR ]-> LEFT1 >" " ) )  OR  (( DATA -> QUAL [ CNTR ]-> RIGHT1 >" "
) ))  ) )  RETURN ( 0.0 )
 
ENDIF
 
IF ( ( NCALC = RPT_RENDER ) )
SET  RPTSD -> M_FLAGS  =  0
SET  RPTSD -> M_BORDERS  =  RPT_SDNOBORDERS
SET  RPTSD -> M_PADDING  =  RPT_SDNOBORDERS
SET  RPTSD -> M_PADDINGWIDTH  =  0.000
SET  RPTSD -> M_LINESPACING  =  RPT_SINGLE
SET  RPTSD -> M_ROTATIONANGLE  =  0
SET  RPTSD -> M_Y  = ( OFFSETY + 0.042 )
SET  RPTSD -> M_X  = ( OFFSETX + 0.375 )
SET  RPTSD -> M_WIDTH  =  4.625
SET  RPTSD -> M_HEIGHT  =  0.229
SET  _OLDPEN  =  UAR_RPTSETPEN ( _HREPORT ,  _PEN14S0C0 )
IF ( ( DATA -> QUAL [ CNTR ]-> LEFT1 >" " ) )
SET  _FDRAWHEIGHT  =  UAR_RPTSTRINGDRAW ( _HREPORT ,  RPTSD ,  BUILD2 (
IF ( ( DATA -> QUAL [ CNTR ]-> LEFT1_TYPE ="A" ) )  CONCAT ("ALBUMIN:  " ,  DATA -> QUAL [ CNTR ]->
 LEFT1 )
ELSEIF ( ( DATA -> QUAL [ CNTR ]-> LEFT1_TYPE ="H" ) )  CONCAT ("GLYCOSYLATED HGB:  " ,  DATA ->
 QUAL [ CNTR ]-> LEFT1 )
ELSE   CONCAT ("SUPPLEMENT:  " ,  DATA -> QUAL [ CNTR ]-> LEFT1 )
ENDIF
,  CHAR ( 0 )))
ENDIF
 
SET  RPTSD -> M_Y  = ( OFFSETY + 0.000 )
SET  RPTSD -> M_X  = ( OFFSETX + 5.375 )
SET  RPTSD -> M_WIDTH  =  4.563
SET  RPTSD -> M_HEIGHT  =  0.229
IF ( ( DATA -> QUAL [ CNTR ]-> RIGHT1 >" " ) )
SET  _FDRAWHEIGHT  =  UAR_RPTSTRINGDRAW ( _HREPORT ,  RPTSD ,  BUILD2 (
IF ( ( DATA -> QUAL [ CNTR ]-> RIGHT1_TYPE ="A" ) )  CONCAT ("LAST ASSESSMENT:  " ,  DATA -> QUAL [
 CNTR ]-> RIGHT1 )
ELSEIF ( ( DATA -> QUAL [ CNTR ]-> RIGHT1_TYPE ="E" ) )  CONCAT ("LAST EATEN:  " ,  DATA -> QUAL [
 CNTR ]-> RIGHT1 )
ELSE   CONCAT (":  " ,  DATA -> QUAL [ CNTR ]-> RIGHT1 )
ENDIF
,  CHAR ( 0 )))
ENDIF
 
SET  _DUMMYPEN  =  UAR_RPTSETPEN ( _HREPORT ,  _OLDPEN )
SET  _YOFFSET  = ( OFFSETY + SECTIONHEIGHT )
ENDIF
 RETURN ( SECTIONHEIGHT )
 
 
END ;Subroutine
 
 
SUBROUTINE   LAYOUTSECTION2  ( NCALC  )
 
DECLARE  A1  =  F8  WITH  NOCONSTANT ( 0.0 ), PRIVATE
SET  A1  =  LAYOUTSECTION2ABS ( NCALC ,  _XOFFSET ,  _YOFFSET ) RETURN ( A1 )
 
 
END ;Subroutine
 
 
SUBROUTINE   LAYOUTSECTION2ABS  ( NCALC ,  OFFSETX ,  OFFSETY  )
 
DECLARE  SECTIONHEIGHT  =  F8  WITH  NOCONSTANT ( 0.250000 ), PRIVATE
IF (  NOT ( (( ( DATA -> QUAL [ CNTR ]-> LEFT2 >" " ) )  OR  (( DATA -> QUAL [ CNTR ]-> RIGHT2 >" "
) ))  ) )  RETURN ( 0.0 )
 
ENDIF
 
IF ( ( NCALC = RPT_RENDER ) )
SET  RPTSD -> M_FLAGS  =  0
SET  RPTSD -> M_BORDERS  =  RPT_SDNOBORDERS
SET  RPTSD -> M_PADDING  =  RPT_SDNOBORDERS
SET  RPTSD -> M_PADDINGWIDTH  =  0.000
SET  RPTSD -> M_LINESPACING  =  RPT_SINGLE
SET  RPTSD -> M_ROTATIONANGLE  =  0
SET  RPTSD -> M_Y  = ( OFFSETY + 0.000 )
SET  RPTSD -> M_X  = ( OFFSETX + 0.375 )
SET  RPTSD -> M_WIDTH  =  4.625
SET  RPTSD -> M_HEIGHT  =  0.250
SET  _OLDPEN  =  UAR_RPTSETPEN ( _HREPORT ,  _PEN14S0C0 )
IF ( ( DATA -> QUAL [ CNTR ]-> LEFT2 >" " ) )
SET  _FDRAWHEIGHT  =  UAR_RPTSTRINGDRAW ( _HREPORT ,  RPTSD ,  BUILD2 (
IF ( ( DATA -> QUAL [ CNTR ]-> LEFT2_TYPE ="A" ) )  CONCAT ("ALBUMIN:  " ,  DATA -> QUAL [ CNTR ]->
 LEFT2 )
ELSEIF ( ( DATA -> QUAL [ CNTR ]-> LEFT2_TYPE ="H" ) )  CONCAT ("GLYCOSYLATED HGB:  " ,  DATA ->
 QUAL [ CNTR ]-> LEFT2 )
ELSE   CONCAT ("SUPPLEMENT:  " ,  DATA -> QUAL [ CNTR ]-> LEFT2 )
ENDIF
,  CHAR ( 0 )))
ENDIF
 
SET  RPTSD -> M_Y  = ( OFFSETY + 0.000 )
SET  RPTSD -> M_X  = ( OFFSETX + 5.375 )
SET  RPTSD -> M_WIDTH  =  4.563
SET  RPTSD -> M_HEIGHT  =  0.229
IF ( ( DATA -> QUAL [ CNTR ]-> RIGHT2 >" " ) )
SET  _FDRAWHEIGHT  =  UAR_RPTSTRINGDRAW ( _HREPORT ,  RPTSD ,  BUILD2 (
IF ( ( DATA -> QUAL [ CNTR ]-> RIGHT2_TYPE ="A" ) )  CONCAT ("LAST ASSESSMENT:  " ,  DATA -> QUAL [
 CNTR ]-> RIGHT2 )
ELSEIF ( ( DATA -> QUAL [ CNTR ]-> RIGHT2_TYPE ="E" ) )  CONCAT ("LAST EATEN:  " ,  DATA -> QUAL [
 CNTR ]-> RIGHT2 )
ELSE   CONCAT (":  " ,  DATA -> QUAL [ CNTR ]-> RIGHT2 )
ENDIF
,  CHAR ( 0 )))
ENDIF
 
SET  _DUMMYPEN  =  UAR_RPTSETPEN ( _HREPORT ,  _OLDPEN )
SET  _YOFFSET  = ( OFFSETY + SECTIONHEIGHT )
ENDIF
 RETURN ( SECTIONHEIGHT )
 
 
END ;Subroutine
 
 
SUBROUTINE   LAYOUTSECTION3  ( NCALC  )
 
DECLARE  A1  =  F8  WITH  NOCONSTANT ( 0.0 ), PRIVATE
SET  A1  =  LAYOUTSECTION3ABS ( NCALC ,  _XOFFSET ,  _YOFFSET ) RETURN ( A1 )
 
 
END ;Subroutine
 
 
SUBROUTINE   LAYOUTSECTION3ABS  ( NCALC ,  OFFSETX ,  OFFSETY  )
 
DECLARE  SECTIONHEIGHT  =  F8  WITH  NOCONSTANT ( 0.270000 ), PRIVATE
IF (  NOT ( (( ( DATA -> QUAL [ CNTR ]-> LEFT3 >" " ) )  OR  (( DATA -> QUAL [ CNTR ]-> RIGHT3 >" "
) ))  ) )  RETURN ( 0.0 )
 
ENDIF
 
IF ( ( NCALC = RPT_RENDER ) )
SET  RPTSD -> M_FLAGS  =  0
SET  RPTSD -> M_BORDERS  =  RPT_SDNOBORDERS
SET  RPTSD -> M_PADDING  =  RPT_SDNOBORDERS
SET  RPTSD -> M_PADDINGWIDTH  =  0.000
SET  RPTSD -> M_LINESPACING  =  RPT_SINGLE
SET  RPTSD -> M_ROTATIONANGLE  =  0
SET  RPTSD -> M_Y  = ( OFFSETY + 0.000 )
SET  RPTSD -> M_X  = ( OFFSETX + 0.375 )
SET  RPTSD -> M_WIDTH  =  4.625
SET  RPTSD -> M_HEIGHT  =  0.250
SET  _OLDPEN  =  UAR_RPTSETPEN ( _HREPORT ,  _PEN14S0C0 )
IF ( ( DATA -> QUAL [ CNTR ]-> LEFT3 >" " ) )
SET  _FDRAWHEIGHT  =  UAR_RPTSTRINGDRAW ( _HREPORT ,  RPTSD ,  BUILD2 (
IF ( ( DATA -> QUAL [ CNTR ]-> LEFT3_TYPE ="A" ) )  CONCAT ("ALBUMIN:  " ,  DATA -> QUAL [ CNTR ]->
 LEFT3 )
ELSEIF ( ( DATA -> QUAL [ CNTR ]-> LEFT3_TYPE ="H" ) )  CONCAT ("GLYCOSYLATED HGB:  " ,  DATA ->
 QUAL [ CNTR ]-> LEFT3 )
ELSE   CONCAT ("SUPPLEMENT:  " ,  DATA -> QUAL [ CNTR ]-> LEFT3 )
ENDIF
,  CHAR ( 0 )))
ENDIF
 
SET  RPTSD -> M_Y  = ( OFFSETY + 0.042 )
SET  RPTSD -> M_X  = ( OFFSETX + 5.375 )
SET  RPTSD -> M_WIDTH  =  4.563
SET  RPTSD -> M_HEIGHT  =  0.229
IF ( ( DATA -> QUAL [ CNTR ]-> RIGHT3 >" " ) )
SET  _FDRAWHEIGHT  =  UAR_RPTSTRINGDRAW ( _HREPORT ,  RPTSD ,  BUILD2 (
IF ( ( DATA -> QUAL [ CNTR ]-> RIGHT3_TYPE ="A" ) )  CONCAT ("LAST ASSESSMENT:  " ,  DATA -> QUAL [
 CNTR ]-> RIGHT3 )
ELSEIF ( ( DATA -> QUAL [ CNTR ]-> RIGHT3_TYPE ="E" ) )  CONCAT ("LAST EATEN:  " ,  DATA -> QUAL [
 CNTR ]-> RIGHT3 )
ELSE   CONCAT (":  " ,  DATA -> QUAL [ CNTR ]-> RIGHT3 )
ENDIF
,  CHAR ( 0 )))
ENDIF
 
SET  _DUMMYPEN  =  UAR_RPTSETPEN ( _HREPORT ,  _OLDPEN )
SET  _YOFFSET  = ( OFFSETY + SECTIONHEIGHT )
ENDIF
 RETURN ( SECTIONHEIGHT )
 
 
END ;Subroutine
 
 
SUBROUTINE   BLANKSECTION  ( NCALC  )
 
DECLARE  A1  =  F8  WITH  NOCONSTANT ( 0.0 ), PRIVATE
SET  A1  =  BLANKSECTIONABS ( NCALC ,  _XOFFSET ,  _YOFFSET ) RETURN ( A1 )
 
 
END ;Subroutine
 
 
SUBROUTINE   BLANKSECTIONABS  ( NCALC ,  OFFSETX ,  OFFSETY  )
 
DECLARE  SECTIONHEIGHT  =  F8  WITH  NOCONSTANT ( 0.170000 ), PRIVATE
IF ( ( NCALC = RPT_RENDER ) )
SET  _OLDPEN  =  UAR_RPTSETPEN ( _HREPORT ,  _PEN14S0C0 )
SET  _RPTSTAT  =  UAR_RPTLINE ( _HREPORT , ( OFFSETX + 0.000 ), ( OFFSETY + 0.083 ), ( OFFSETX +
 10.000 ), ( OFFSETY + 0.083 ))
SET  _DUMMYPEN  =  UAR_RPTSETPEN ( _HREPORT ,  _OLDPEN )
SET  _YOFFSET  = ( OFFSETY + SECTIONHEIGHT )
ENDIF
 RETURN ( SECTIONHEIGHT )
 
 
END ;Subroutine
 
 
SUBROUTINE   INITIALIZEREPORT  ( DUMMY  )
 
SET  RPTREPORT -> M_RECSIZE  =  100
SET  RPTREPORT -> M_REPORTNAME  = "MAYO_MN_DIETARY_CENSUS"
SET  RPTREPORT -> M_PAGEWIDTH  =  8.50
SET  RPTREPORT -> M_PAGEHEIGHT  =  11.00
SET  RPTREPORT -> M_ORIENTATION  =  RPT_LANDSCAPE
SET  RPTREPORT -> M_MARGINLEFT  =  0.50
SET  RPTREPORT -> M_MARGINRIGHT  =  0.50
SET  RPTREPORT -> M_MARGINTOP  =  0.50
SET  RPTREPORT -> M_MARGINBOTTOM  =  0.50
SET  RPTREPORT -> M_HORZPRINTOFFSET  =  _XSHIFT
SET  RPTREPORT -> M_VERTPRINTOFFSET  =  _YSHIFT
SET  _YOFFSET  =  RPTREPORT -> M_MARGINTOP
SET  _XOFFSET  =  RPTREPORT -> M_MARGINLEFT
SET  _HREPORT  =  UAR_RPTCREATEREPORT ( RPTREPORT ,  _OUTPUTTYPE ,  RPT_INCHES )
SET  _RPTERR  =  UAR_RPTSETERRORLEVEL ( _HREPORT ,  RPT_ERROR )
SET  _RPTSTAT  =  UAR_RPTSTARTREPORT ( _HREPORT )
SET  _RPTPAGE  =  UAR_RPTSTARTPAGE ( _HREPORT )
 CALL _CREATEFONTS ( 0 )
 CALL _CREATEPENS ( 0 )
 
END ;Subroutine
 
 
SUBROUTINE   _CREATEFONTS  ( DUMMY  )
 
SET  RPTFONT -> M_RECSIZE  =  50
SET  RPTFONT -> M_FONTNAME  =  RPT_TIMES
SET  RPTFONT -> M_POINTSIZE  =  10
SET  RPTFONT -> M_BOLD  =  RPT_OFF
SET  RPTFONT -> M_ITALIC  =  RPT_OFF
SET  RPTFONT -> M_UNDERLINE  =  RPT_OFF
SET  RPTFONT -> M_STRIKETHROUGH  =  RPT_OFF
SET  RPTFONT -> M_RGBCOLOR  =  RPT_BLACK
SET  _TIMES100  =  UAR_RPTCREATEFONT ( _HREPORT ,  RPTFONT )
SET  RPTFONT -> M_BOLD  =  RPT_ON
SET  _TIMES10B0  =  UAR_RPTCREATEFONT ( _HREPORT ,  RPTFONT )
SET  RPTFONT -> M_POINTSIZE  =  12
SET  _TIMES12B0  =  UAR_RPTCREATEFONT ( _HREPORT ,  RPTFONT )
 
END ;Subroutine
 
 
SUBROUTINE   _CREATEPENS  ( DUMMY  )
 
SET  RPTPEN -> M_RECSIZE  =  16
SET  RPTPEN -> M_PENWIDTH  =  0.014
SET  RPTPEN -> M_PENSTYLE  =  0
SET  RPTPEN -> M_RGBCOLOR  =  RPT_BLACK
SET  _PEN14S0C0  =  UAR_RPTCREATEPEN ( _HREPORT ,  RPTPEN )
 
END ;Subroutine
 
 
SET  FACILITY_CD  =  $FACILITY
 
SELECT  INTO "nl:"
 NURSE_UNIT = DATA -> QUAL [D.SEQ]-> NURSE_UNIT ,
 ROOM = DATA -> QUAL [D.SEQ]-> ROOM ,
 BED = DATA -> QUAL [D.SEQ]-> BED ,
 FACILITY_NAME = DATA -> QUAL [D.SEQ]-> FACILITY
FROM ( DUMMYT  D  WITH  SEQ = SIZE ( DATA -> QUAL ,  5 ))
ORDER BY  NURSE_UNIT ,
 ROOM ,
 BED
 
HEAD REPORT
 
 CALL INITIALIZEREPORT ( 0 ),
 _FENDDETAIL =( RPTREPORT -> M_PAGEWIDTH - RPTREPORT -> M_MARGINRIGHT ),
 NPAGE = 1 ,
 DUMB_VAR = 0 ,
 CNTR = 0 ,
 FIRST_TIME ="Y"
HEAD PAGE
 X = HEADPAGESECTION ( 0 )
HEAD  NURSE_UNIT
 
IF ( ( FIRST_TIME ="N" ) )
 CALL PAGEBREAK ( 0 ),  X = HEADPAGESECTION ( 0 )
ENDIF
, FIRST_TIME ="N"
DETAIL
 CNTR =D.SEQ,
 
IF ( ((((( _YOFFSET + DETAILSECTION ( 1 ))+ LAYOUTSECTION1 ( 1 ))+ LAYOUTSECTION2 ( 1 ))+
 LAYOUTSECTION3 ( 1 ))> _FENDDETAIL ) )
 CALL PAGEBREAK ( 0 ),  X = HEADPAGESECTION ( 0 )
ENDIF
,
 X = DETAILSECTION ( 0 ),
 X = LAYOUTSECTION1 ( 0 ),
 X = LAYOUTSECTION2 ( 0 ),
 X = LAYOUTSECTION3 ( 0 ),
 X = BLANKSECTION ( 0 )
 WITH  NOCOUNTER
 
 CALL FINALIZEREPORT ( $OUTDEV )
 END GO