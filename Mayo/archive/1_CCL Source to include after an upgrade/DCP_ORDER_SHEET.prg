/************************************************************************
          Date Written:
          Source file name:   DCP_ORDER_SHEET.prg
          Object name:        DCP_ORDER_SHEET
          Request #:
 
          Program purpose:    DCP_ORDER_SHEET report
 
          Executing from:     Explorer Menu
 
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
 *000 05/07/13 JTW                  initial release                    *
 *                                  -Code from MHCRT, last included    *
 *                                   4/1/2013 by M061596               *
 *                                  -This file to create physical      *
 *                                   source code to be re-included     *
 *                                   after a Cerner upgrade.           *
 ***********************************************************************
 
  ******************  END OF ALL MODCONTROL BLOCKS  ********************/
 
;*** Generated by translate command; please verify contents before re-including in CCL ***
 
DROP PROGRAM   DCP_ORDER_SHEET : DBA  GO
CREATE PROGRAM  DCP_ORDER_SHEET : DBA
 
RECORD  REQUEST  (
 1  PERSON_ID  =  F8
 1  ENCNTR_ID  =  F8
 1  CONVERSATION_ID  =  F8
 1  PRINT_PRSNL_ID  =  F8
 1  ORDER_QUAL [*]
 2  ORDER_ID  =  F8
 1  PRINTER_NAME  =  C50 )
 
DECLARE  COUNT1  =  I4  WITH  NOCONSTANT ( 0 )
 
SET  COUNT1  =  SIZE ( REQUEST -> ORDER_QUAL ,  5 )
 
RECORD  BODY_RECORD  (
 1  BODY [ COUNT1 ]
 2  BREAK_IND  =  C1
 2  ORDER_TYPE  =  C1
 2  ORDER_NAME  =  C50
 2  DETAILS  =  C110
 2  DETAIL2_IND  =  C1
 2  DETAILS2  =  C110
 2  DETAIL3_IND  =  C1
 2  DETAILS3  =  C110
 2  COMMENTS1_IND  =  C1
 2  COMMENT_CNT  =  I2
 2  COM_QUAL [*]
 3  COMMENTS1  =  C90 )
 
DECLARE  MRN_ALIAS_CD  =  F8  WITH  CONSTANT ( UAR_GET_CODE_BY ("MEANING" ,  4 , "MRN" ))
 
DECLARE  ADMIT_DOC_CD  =  F8  WITH  CONSTANT ( UAR_GET_CODE_BY ("MEANING" ,  333 , "ADMITDOC" ))
 
DECLARE  FINNBR_CD  =  F8  WITH  CONSTANT ( UAR_GET_CODE_BY ("MEANING" ,  319 , "FIN NBR" ))
 
DECLARE  LINE  =  C130  WITH  CONSTANT ( FILLSTRING ( 130 , "_" ))
 
DECLARE  PAGE_NUM  =  I4  WITH  NOCONSTANT ( 0 )
 
DECLARE  X  =  I4  WITH  NOCONSTANT ( 0 )
 
DECLARE  ROW_CNT  =  I4  WITH  NOCONSTANT ( 6 )
 
DECLARE  PAGE_CNT  =  I4  WITH  NOCONSTANT ( 1 )
 
DECLARE  DEFAULTS_FILLED  =  C  WITH  NOCONSTANT ("F" )
 
DECLARE  B_PERSON_ID  =  I4  WITH  NOCONSTANT ( 0 )
 
DECLARE  B_ENCNTR_ID  =  I4  WITH  NOCONSTANT ( 0 )
 
DECLARE  B_ORDER_PROVIDER_ID  =  I4  WITH  NOCONSTANT ( 0 )
 
DECLARE  B_ORDER_LOCN_CD  =  I4  WITH  NOCONSTANT ( 0 )
 
DECLARE  B_ACTION_PERSONNEL_ID  =  I4  WITH  NOCONSTANT ( 0 )
 
DECLARE  B_TMP_COMMENT  =  VC  WITH  NOCONSTANT ( FILLSTRING ( 90 , " " ))
 
DECLARE  OFFSET  =  I4  WITH  NOCONSTANT ( 0 )
 
DECLARE  DAYLIGHT  =  I4  WITH  NOCONSTANT ( 0 )
 
DECLARE  B_ACTION_DT_TM  =  VC  WITH  NOCONSTANT ( CONCAT ( FORMAT ( DATETIMEZONE ( CNVTDATETIME (
 CURDATE ,  CURTIME ),  CURTIMEZONEAPP ), "mm/dd/yy  hh:mm;4;q" ), " " ,  DATETIMEZONEBYINDEX (
 CURTIMEZONEAPP ,  OFFSET ,  DAYLIGHT ,  7 ,  SYSDATE )))
 
DECLARE  B_LINEFEED  =  VC  WITH  NOCONSTANT ( CONCAT ("" ,  CHAR ( 10 )))
 
DECLARE  B_CC  =  I4  WITH  NOCONSTANT ( 0 )
 
DECLARE  B_S  =  I4  WITH  NOCONSTANT ( 1 )
 
DECLARE  LOOP_SIZE  =  I4  WITH  NOCONSTANT ( 0 )
 
 CALL ECHO ("Before the FOR..." ,  1 )
 
FOR (  X  =  1  TO  COUNT1  )
 
 CALL ECHO ( BUILD ("x= " ,  X ))
SELECT  INTO "nl:"
O.ORDER_MNEMONIC,
O.ORDER_DETAIL_DISPLAY_LINE,
OA.ACTION_TYPE_CD
FROM ( ORDERS  O ),
( ORDER_ACTION  OA )
 PLAN ( O
WHERE (O.ORDER_ID= REQUEST -> ORDER_QUAL [ X ]-> ORDER_ID ))
 AND ( OA
WHERE (OA.ORDER_ID=O.ORDER_ID))
 
ORDER BY OA.ACTION_SEQUENCE DESC
 
HEAD REPORT
 
IF ( ( DEFAULTS_FILLED ="F" ) )  DEFAULTS_FILLED ="T" ,  B_PERSON_ID =O.PERSON_ID,  B_ENCNTR_ID =
O.ENCNTR_ID,  B_ORDER_PROVIDER_ID =OA.ORDER_PROVIDER_ID,  B_ORDER_LOCN_CD =OA.ORDER_LOCN_CD,
 B_ACTION_PERSONNEL_ID =OA.ACTION_PERSONNEL_ID,  B_ACTION_DT_TM = CONCAT ( FORMAT ( DATETIMEZONE (
OA.ACTION_DT_TM, OA.ACTION_TZ), "mm/dd/yy  hh:mm;;q" ), " " ,  DATETIMEZONEBYINDEX (OA.ACTION_TZ,
 OFFSET ,  DAYLIGHT ,  7 ,  DATETIMEZONE (OA.ACTION_DT_TM, OA.ACTION_TZ)))
ENDIF
,
 ROW_CNT =( ROW_CNT + 2 ),
 BODY_RECORD -> BODY [ X ]-> ORDER_TYPE = SUBSTRING ( 1 ,  1 ,  UAR_GET_CODE_DISPLAY (
OA.ACTION_TYPE_CD)),
 BODY_RECORD -> BODY [ X ]-> ORDER_NAME = SUBSTRING ( 1 ,  50 , O.ORDER_MNEMONIC),
 ROW_CNT =( ROW_CNT + 1 ),
 BODY_RECORD -> BODY [ X ]-> DETAILS = SUBSTRING ( 1 ,  110 , O.ORDER_DETAIL_DISPLAY_LINE),
 BODY_RECORD -> BODY [ X ]-> DETAILS2 = SUBSTRING ( 111 ,  110 , O.ORDER_DETAIL_DISPLAY_LINE),
 
IF ( ( BODY_RECORD -> BODY [ X ]-> DETAILS2 >" " ) )  BODY_RECORD -> BODY [ X ]-> DETAIL2_IND ="T"
,  ROW_CNT =( ROW_CNT + 1 ),  BODY_RECORD -> BODY [ X ]-> DETAILS3 = SUBSTRING ( 211 ,  110 ,
O.ORDER_DETAIL_DISPLAY_LINE),
IF ( ( BODY_RECORD -> BODY [ X ]-> DETAILS3 >" " ) )  BODY_RECORD -> BODY [ X ]-> DETAIL3_IND ="T"
,  ROW_CNT =( ROW_CNT + 1 )
ENDIF
 
ENDIF
,
 BODY_RECORD -> BODY [ X ]-> COMMENT_CNT = 0 ,
 
IF ( (O.ORDER_COMMENT_IND= 1 ) )  BODY_RECORD -> BODY [ X ]-> COMMENTS1_IND ="T"
ELSE   BODY_RECORD -> BODY [ X ]-> COMMENTS1_IND ="F"
ENDIF
,
 
IF ( ( ROW_CNT > 57 ) )  BODY_RECORD -> BODY [ X ]-> BREAK_IND ="T" ,  ROW_CNT = 6 ,  PAGE_CNT =(
 PAGE_CNT + 1 )
ENDIF
 
 WITH  NOCOUNTER , MAXQUAL ( OA ,  1 )
 CALL ECHO ( BUILD ("body_record->body[x].comments1_ind = " ,  BODY_RECORD -> BODY [ X ]->
 COMMENTS1_IND ))
IF ( ( BODY_RECORD -> BODY [ X ]-> COMMENTS1_IND ="T" ) )
SELECT  INTO "nl:"
LT.LONG_TEXT
FROM ( LONG_TEXT  LT ),
( ORDER_COMMENT  OC )
 PLAN ( OC
WHERE (OC.ORDER_ID= REQUEST -> ORDER_QUAL [ X ]-> ORDER_ID ))
 AND ( LT
WHERE (LT.LONG_TEXT_ID=OC.LONG_TEXT_ID))
 
 
DETAIL
 B_CC = 1 ,
 BODY_RECORD -> BODY [ X ]-> COMMENT_CNT = 0 ,
 B_S = 1 ,
 
WHILE (  B_CC )
 B_TMP_COMMENT = SUBSTRING ( B_S ,  90 , LT.LONG_TEXT), B_E = FINDSTRING ( B_LINEFEED ,
 B_TMP_COMMENT ,  1 ),
IF (  B_E  )  BODY_RECORD -> BODY [ X ]-> COMMENT_CNT =( BODY_RECORD -> BODY [ X ]-> COMMENT_CNT +
 1 ),  TMP_VAR = BODY_RECORD -> BODY [ X ]-> COMMENT_CNT ,  STAT = ALTERLIST ( BODY_RECORD -> BODY [
 X ]-> COM_QUAL ,  TMP_VAR ),  BODY_RECORD -> BODY [ X ]-> COM_QUAL [ TMP_VAR ]-> COMMENTS1 =
 SUBSTRING ( 1 ,  B_E ,  B_TMP_COMMENT ),  B_S =( B_S + B_E ),  ROW_CNT =( ROW_CNT + 1 )
ELSE
IF ( ( B_TMP_COMMENT >" " ) )  BODY_RECORD -> BODY [ X ]-> COMMENT_CNT =( BODY_RECORD -> BODY [ X ]
-> COMMENT_CNT + 1 ),  TMP_VAR = BODY_RECORD -> BODY [ X ]-> COMMENT_CNT ,  STAT = ALTERLIST (
 BODY_RECORD -> BODY [ X ]-> COM_QUAL ,  TMP_VAR ),  BODY_RECORD -> BODY [ X ]-> COM_QUAL [ TMP_VAR
]-> COMMENTS1 = B_TMP_COMMENT ,  B_S =( B_S + 90 ),  ROW_CNT =( ROW_CNT + 1 )
ELSE   B_CC = 0
ENDIF
 
ENDIF
 
 
ENDWHILE
,
 
IF ( ( ROW_CNT > 58 ) )  BODY_RECORD -> BODY [ X ]-> BREAK_IND ="t" ,  ROW_CNT = 6 ,  PAGE_CNT =(
 PAGE_CNT + 1 )
ENDIF
 
 WITH  NOCOUNTER
 CALL ECHO ("Finished long_text table..." ,  1 )
ENDIF
 
 
ENDFOR
 
 
# START_SCRIPT
 
DECLARE  PRINT_PERSON  =  VC
 
SET  PRINT_PERSON  =  FILLSTRING ( 50 , " " )
 
IF ( ( REQUEST -> PRINT_PRSNL_ID > 0 ) )
SELECT  INTO "nl:"
PL.NAME_FULL_FORMATTED
FROM ( PRSNL  PL )
 
WHERE (PL.PERSON_ID= REQUEST -> PRINT_PRSNL_ID )
 
DETAIL
 PRINT_PERSON = SUBSTRING ( 1 ,  50 , PL.NAME_FULL_FORMATTED)
 WITH  NOCOUNTER
ENDIF
 
 
 CALL ECHO ( BUILD ("print_person = " ,  PRINT_PERSON ))
 
 CALL ECHO ("Before the main select..." ,  1 )
 
SELECT  INTO  VALUE ( REQUEST -> PRINTER_NAME )
P.NAME_FULL_FORMATTED,
P.BIRTH_DT_TM,
P.BIRTH_TZ,
P.BEG_EFFECTIVE_DT_TM,
P.BEG_EFFECTIVE_TZ,
PL.NAME_FULL_FORMATTED,
PL2.NAME_FULL_FORMATTED,
PL3.NAME_FULL_FORMATTED,
E.REG_DT_TM,
E.DISCH_DT_TM,
E.DISCH_TZ,
EA.ALIAS,
PA.ALIAS
FROM ( PERSON  P ),
( ENCOUNTER  E ),
( ENCNTR_PRSNL_RELTN  EPR ),
( PRSNL  PL ),
( PRSNL  PL2 ),
( PRSNL  PL3 ),
( ENCNTR_ALIAS  EA ),
( PERSON_ALIAS  PA ),
( ENCNTR_LOC_HIST  ELH ),
( TIME_ZONE_R  T )
 PLAN ( P
WHERE (P.PERSON_ID= B_PERSON_ID ))
 AND ( PA
WHERE (PA.PERSON_ID= OUTERJOIN (P.PERSON_ID)) AND (PA.PERSON_ALIAS_TYPE_CD= OUTERJOIN (
 MRN_ALIAS_CD )) AND (PA.ACTIVE_IND= OUTERJOIN ( 1 )) AND (PA.BEG_EFFECTIVE_DT_TM< OUTERJOIN (
 CNVTDATETIME ( CURDATE ,  CURTIME3 ))) AND (PA.END_EFFECTIVE_DT_TM> OUTERJOIN ( CNVTDATETIME (
 CURDATE ,  CURTIME3 ))))
 AND ( PL2
WHERE (PL2.PERSON_ID= OUTERJOIN ( B_ORDER_PROVIDER_ID )))
 AND ( E
WHERE (E.ENCNTR_ID= OUTERJOIN ( B_ENCNTR_ID )))
 AND ( ELH
WHERE (ELH.ENCNTR_ID= OUTERJOIN (E.ENCNTR_ID)))
 AND ( T
WHERE (T.PARENT_ENTITY_ID= OUTERJOIN (ELH.LOC_FACILITY_CD)) AND (T.PARENT_ENTITY_NAME= OUTERJOIN (
"LOCATION" )))
 AND ( EA
WHERE (EA.ENCNTR_ID= OUTERJOIN (E.ENCNTR_ID)) AND (EA.ENCNTR_ALIAS_TYPE_CD= OUTERJOIN ( FINNBR_CD ))
 AND (EA.ACTIVE_IND= OUTERJOIN ( 1 )))
 AND ( EPR
WHERE (EPR.ENCNTR_ID= OUTERJOIN (E.ENCNTR_ID)) AND (EPR.ENCNTR_PRSNL_R_CD= OUTERJOIN ( ADMIT_DOC_CD
)))
 AND ( PL
WHERE (PL.PERSON_ID= OUTERJOIN (EPR.PRSNL_PERSON_ID)))
 AND ( PL3
WHERE (PL3.PERSON_ID= OUTERJOIN ( B_ACTION_PERSONNEL_ID )))
 
 
HEAD REPORT
 AGE = CNVTAGE ( CNVTDATE2 ( FORMAT (P.BIRTH_DT_TM, "mm/dd/yyyy;;d" ), "mm/dd/yyyy" ),  CNVTINT (
 FORMAT (P.BIRTH_DT_TM, "hhmm;;m" ))),
 SEX = SUBSTRING ( 1 ,  1 ,  UAR_GET_CODE_DISPLAY (P.SEX_CD)),
 ROOM = SUBSTRING ( 1 ,  5 ,  UAR_GET_CODE_DISPLAY (E.LOC_ROOM_CD)),
 MED_REC_NUM = SUBSTRING ( 1 ,  20 , PA.ALIAS),
 ADMIT_DR = SUBSTRING ( 1 ,  24 , PL.NAME_FULL_FORMATTED),
 ORDER_DR = SUBSTRING ( 1 ,  24 , PL2.NAME_FULL_FORMATTED),
 PATIENTNAME = SUBSTRING ( 1 ,  20 , P.NAME_FULL_FORMATTED),
 PAT_TYPE = SUBSTRING ( 1 ,  1 ,  UAR_GET_CODE_DISPLAY (E.ENCNTR_TYPE_CD)),
 FINANCIAL_NUM = SUBSTRING ( 1 ,  20 , EA.ALIAS),
 BED = SUBSTRING ( 1 ,  8 ,  UAR_GET_CODE_DISPLAY (E.LOC_BED_CD)),
 LOCATION = SUBSTRING ( 1 ,  8 ,  UAR_GET_CODE_DISPLAY (E.LOCATION_CD)),
 ORDERS_ENTERED = SUBSTRING ( 1 ,  50 , PL3.NAME_FULL_FORMATTED),
 B_DATE = TRIM ( CONCAT ( FORMAT ( DATETIMEZONE (P.BIRTH_DT_TM, P.BIRTH_TZ,  2 ), "mm-dd-yyyy ;3;q"
))),
 TZ_INDEX = DATETIMEZONEBYNAME ( TRIM (T.TIME_ZONE)),
 REG_DT = TRIM ( CONCAT ( FORMAT ( DATETIMEZONE (E.REG_DT_TM,  TZ_INDEX ,  2 ), "mm-dd-yyyy;3;q" ),
" " ,  DATETIMEZONEBYINDEX ( TZ_INDEX ,  OFFSET ,  DAYLIGHT ,  7 , E.REG_DT_TM))),
 DISCH_DT = TRIM ( CONCAT ( FORMAT ( DATETIMEZONE (E.DISCH_DT_TM,  TZ_INDEX ,  2 ),
"mm-dd-yyyy;3;q" ), " " ,  DATETIMEZONEBYINDEX ( TZ_INDEX ,  OFFSET ,  DAYLIGHT ,  7 , E.DISCH_DT_TM
)))
HEAD PAGE
 ROW + 1 ,
 COL  0 ,
"{font/13}" ,
 ROW + 1 ,
 COL  0 ,
"{cpi/11}{b}" ,
 COL  82 ,
"ORDER SHEET" ,
"{cpi/13}{endb}" ,
 ROW + 1 ,
 COL  0 ,
 LINE ,
 ROW + 2 ,
 COL  2 ,
"Order Entry D/T:  " ,
 B_ACTION_DT_TM ,
 COL  84 ,
"Orders Entered By:   " ,
 ORDERS_ENTERED ,
 ROW + 1 ,
 COL  109 ,
"Ordering Dr:   " ,
 ORDER_DR ,
 ROW + 1 ,
 COL  0 ,
 LINE
HEAD P.NAME_FULL_FORMATTED
 LOOP_SIZE = SIZE ( BODY_RECORD -> BODY ,  5 ),
FOR (  X  =  1  TO  LOOP_SIZE  )
 
IF ( ( BODY_RECORD -> BODY [ X ]-> BREAK_IND ="T" ) ) BREAK
ENDIF
, ROW + 2 , COL  1 ,"{cpi/10}" ,"{b}" , BODY_RECORD -> BODY [ X ]-> ORDER_TYPE , COL + 0 ,"{endb}" ,
 COL + 3 ,"{b}" , BODY_RECORD -> BODY [ X ]-> ORDER_NAME , COL + 0 ,"{cpi/13}{endb}" , ROW + 1 ,
 COL  10 , BODY_RECORD -> BODY [ X ]-> DETAILS ,
IF ( ( BODY_RECORD -> BODY [ X ]-> DETAIL2_IND ="T" ) )  ROW + 1 ,  COL  13 ,  BODY_RECORD -> BODY [
 X ]-> DETAILS2 ,
IF ( ( BODY_RECORD -> BODY [ X ]-> DETAIL3_IND ="T" ) )  ROW + 1 ,  COL  13 ,  BODY_RECORD -> BODY [
 X ]-> DETAILS3
ENDIF
 
ENDIF
,
IF ( ( BODY_RECORD -> BODY [ X ]-> COMMENT_CNT > 0 ) )
FOR (  W  =  1  TO  BODY_RECORD -> BODY [ X ]-> COMMENT_CNT  )
 ROW + 1 ,
IF ( ( W = 1 ) )  COL  10 , "Order comments: " ,  BODY_RECORD -> BODY [ X ]-> COM_QUAL [ W ]->
 COMMENTS1
ELSE   COL  36 ,  BODY_RECORD -> BODY [ X ]-> COM_QUAL [ W ]-> COMMENTS1
ENDIF
 
 
ENDFOR
 
ENDIF
 
 
ENDFOR
 
FOOT PAGE
 PAGE_NUM =( PAGE_NUM + 1 ),
 YCOL = 640 ,
 XCOL = 0 ,
 
 CALL PRINT ( CALCPOS ( XCOL ,  YCOL )),
 LINE ,
 ROW + 2 ,
 YCOL = 660 ,
 XCOL = 18 ,
 
 CALL PRINT ( CALCPOS ( XCOL ,  YCOL )),
"Pt. Name:   {b}" ,
 PATIENTNAME ,
"{endb}" ,
 XCOL = 375 ,
 
 CALL PRINT ( CALCPOS ( XCOL ,  YCOL )),
;001 "{font/12}{b}Mayo Health System" ,
"{font/12}{b}Mayo Clinic Health System" , ;001
"{endb} {font/13}" ,
 ROW + 1 ,
 XCOL = 15 ,
 YCOL = 670 ,
 
 CALL PRINT ( CALCPOS ( XCOL ,  YCOL )),
"{endb}D.O.B./Sex:   " ,
 B_DATE ,
" " ,
 SEX ,
 XCOL = 375 ,
 
 CALL PRINT ( CALCPOS ( XCOL ,  YCOL )),
"Print ID:  " ,
 
IF ( ( PRINT_PERSON >" " ) )  PRINT_PERSON
ELSE   ORDERS_ENTERED
ENDIF
,
 ROW + 1 ,
 XCOL = 11 ,
 YCOL = 680 ,
 
 CALL PRINT ( CALCPOS ( XCOL ,  YCOL )),
"Med Rec #:   " ,
"{b}" ,
 MED_REC_NUM ,
"{endb}" ,
 XCOL = 255 ,
 
 CALL PRINT ( CALCPOS ( XCOL ,  YCOL )),
"{b}" ,
"Order Sheet" ,
"{endb}" ,
 XCOL = 375 ,
 PRINT_TIME = CONCAT ( FORMAT ( DATETIMEZONE ( CNVTDATETIME ( CURDATE ,  CURTIME ),  CURTIMEZONEAPP
), "mm/dd/yy  hh:mm;4;q" ), " " ,  DATETIMEZONEBYINDEX ( CURTIMEZONEAPP ,  OFFSET ,  DAYLIGHT ,  7
,  SYSDATE )),
 
 CALL PRINT ( CALCPOS ( XCOL ,  YCOL )),
"Print Date/Time:  " ,
 PRINT_TIME ,
 ROW + 1 ,
 XCOL = 18 ,
 YCOL = 690 ,
 
 CALL PRINT ( CALCPOS ( XCOL ,  YCOL )),
"Physician:   " ,
 ADMIT_DR ,
 ROW + 1 ,
 XCOL = 12 ,
 YCOL = 700 ,
 
 CALL PRINT ( CALCPOS ( XCOL ,  YCOL )),
"Financial #:   " ,
 FINANCIAL_NUM ,
 ROW + 1 ,
 XCOL = 26 ,
 YCOL = 710 ,
 
 CALL PRINT ( CALCPOS ( XCOL ,  YCOL )),
"Pt. Type:   " ,
 PAT_TYPE ,
 ROW + 1 ,
 XCOL = 14 ,
 YCOL = 720 ,
 
 CALL PRINT ( CALCPOS ( XCOL ,  YCOL )),
"Room/Bed:   " ,
"{b}" ,
 ROOM ,
"/" ,
 BED ,
"{endb}" ,
 ROW + 1 ,
 XCOL = 16 ,
 YCOL = 730 ,
 
 CALL PRINT ( CALCPOS ( XCOL ,  YCOL )),
"Admit/Disch:   " ,
 REG_DT ,
 XCOL = 255 ,
 
 CALL PRINT ( CALCPOS ( XCOL ,  YCOL )),
"Page " ,
 PAGE_NUM "#"
,
" of " ,
 PAGE_CNT "#"
,
 XCOL = 75 ,
 YCOL = 740 ,
 
 CALL PRINT ( CALCPOS ( XCOL ,  YCOL )),
 
IF ( (E.DISCH_DT_TM= NULL ) ) "/ 00-00-00"
ELSE  "/ " ,  DISCH_DT
ENDIF
 
 WITH  COUNTER , DIO = POSTSCRIPT , MAXROW = 85 , MAXCOL = 700
 
 CALL ECHO ("After the main select..." ,  1 )
 
# EXIT_SCRIPT
 
SET  LAST_MOD  = "005"
 END GO
