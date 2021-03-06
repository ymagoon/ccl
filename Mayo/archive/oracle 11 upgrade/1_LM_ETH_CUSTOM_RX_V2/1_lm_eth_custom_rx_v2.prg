DROP PROGRAM   1_lm_eth_custom_rx_v2  GO
CREATE PROGRAM  1_lm_eth_custom_rx_v2
PROMPT "Output to File/Printer/MINE:" ="MINE"
 WITH  OUTDEV
 
DECLARE  BALL_ACTIONS  =  I2  WITH  PROTECT , NOCONSTANT (0 )
 
DECLARE  BNEW_PAGE  =  I2  WITH  PROTECT , NOCONSTANT (0 )
 
DECLARE  START_DT  =  Q8
 
DECLARE  NSTART_TM  =  I2  WITH  PROTECT , NOCONSTANT (0 )
 
DECLARE  STOP_DT  =  Q8
 
DECLARE  NSTOP_TM  =  I2  WITH  PROTECT , NOCONSTANT (0 )
 
DECLARE  NHIT_REPORT  =  I2  WITH  PROTECT , NOCONSTANT (0 )
 
DECLARE  NFACILITYCOUNTER  =  I2  WITH  PROTECT , NOCONSTANT (0 )
 
DECLARE  NACTUALSIZE  =  I4  WITH  PROTECT , NOCONSTANT (0 )
 
DECLARE  NEXPANDSIZE  =  I2  WITH  PROTECT , CONSTANT (50 )
 
DECLARE  NEXPANDTOTAL  =  I4  WITH  PROTECT , NOCONSTANT (0 )
 
DECLARE  NEXPANDSTART  =  I4  WITH  PROTECT , NOCONSTANT (0 )
 
DECLARE  NEXPANDSTOP  =  I4  WITH  PROTECT , NOCONSTANT (0 )
 
DECLARE  NEXPAND  =  I2  WITH  PROTECT , NOCONSTANT (0 )
 
DECLARE  NACTION_TYPE_CNT  =  I2  WITH  PROTECT , NOCONSTANT (0 )
 
DECLARE  ACT_TYPE_OUTPUT  =  VC  WITH  PROTECT , NOCONSTANT (" " )
 
DECLARE  NPHARM  =  F8  WITH  PROTECT , CONSTANT ( UAR_GET_CODE_BY ("MEANING" , 106 , "PHARMACY" ))
 
DECLARE  CFORMAT  =  C50  WITH  PROTECT , CONSTANT ( FILLSTRING (50 , "#" ))
 
DECLARE  CSTATUSCHANGE  =  F8  WITH  PROTECT , CONSTANT ( UAR_GET_CODE_BY ("MEANING" , 6003 ,
"STATUSCHANGE" ))
 
DECLARE  CTRANSCANCEL  =  F8  WITH  PROTECT , CONSTANT ( UAR_GET_CODE_BY ("MEANING" , 6003 ,
"TRANSFER/CAN" ))
 
DECLARE  CCOMPLETE  =  F8  WITH  PROTECT , CONSTANT ( UAR_GET_CODE_BY ("MEANING" , 6003 ,
"COMPLETE" ))
 
DECLARE  CPRODASSIGN  =  F8  WITH  PROTECT , CONSTANT ( UAR_GET_CODE_BY ("MEANING" , 6052 ,
"RXPRODASSIGN" ))
 
DECLARE  NSKIPDETAIL  =  I2  WITH  PROTECT , NOCONSTANT (0 )
 
DECLARE  SCLINREVIEW  =  C19  WITH  PUBLIC , NOCONSTANT ("" )
 
DECLARE  LRETVAL  =  I2  WITH  PRIVATE , NOCONSTANT (0 )
 
DECLARE  I18NHANDLE  =  I4  WITH  PUBLIC , NOCONSTANT (0 )
 
 SET  STARTENDDATE  =  FORMAT (( CURDATE -1 ), "mmddyyyy;;d" )
 
SET  RUN_TYPE  = "SUMMARY"
 
SET  DISPLAY  = "SHOW ONLY ACTIONS UTILIZED"
 
SET  START_DT  =  CNVTDATE ( STARTENDDATE )
 
SET  NSTART_TM  =  CNVTINT ("0000" )
 
SET  STOP_DT  =  CNVTDATE ( STARTENDDATE )
 
SET  NSTOP_TM  =  CNVTINT ("2359" )
 
IF ( ( FINDSTRING ("ALL AVAILABLE" ,  CNVTUPPER ( DISPLAY ))>0 ) )
SET  BALL_ACTIONS  = 1
ENDIF
 
 
IF (  NOT ( VALIDATE ( REPLY , 0 ) ) )
 CALL ECHO ("Defining record structure" )
RECORD  REPLY  (
1  STATUS_DATA
2  STATUS  =  VC )
ENDIF
 
 
SET  REPLY -> STATUS_DATA -> STATUS  = "F"
 
IF ( ( VALIDATE ( I18NUAR_DEF , 999 )=999 ) )
 CALL ECHO ("Declaring i18nuar_def" )
DECLARE  I18NUAR_DEF  =  I2  WITH  PERSIST
SET  I18NUAR_DEF  = 1
DECLARE  UAR_I18NLOCALIZATIONINIT (( P1 = I4 ), ( P2 = VC ), ( P3 = VC ), ( P4 = F8 )) =  I4  WITH
 PERSIST
DECLARE  UAR_I18NGETMESSAGE (( P1 = I4 ), ( P2 = VC ), ( P3 = VC )) =  VC  WITH  PERSIST
DECLARE  UAR_I18NBUILDMESSAGE () =  VC  WITH  PERSIST
DECLARE  UAR_I18NGETHIJRIDATE (( IMONTH = I2 ( VAL )), ( IDAY = I2 ( VAL )), ( IYEAR = I2 ( VAL )),
( SDATEFORMATTYPE = VC ( REF ))) =  C50  WITH  IMAGE_AXP ="shri18nuar" , IMAGE_AIX =
"libi18n_locale.a(libi18n_locale.o)" , UAR ="uar_i18nGetHijriDate" , PERSIST
DECLARE  UAR_I18NBUILDFULLFORMATNAME (( SFIRST = VC ( REF )), ( SLAST = VC ( REF )), ( SMIDDLE = VC
( REF )), ( SDEGREE = VC ( REF )), ( STITLE = VC ( REF )), ( SPREFIX = VC ( REF )), ( SSUFFIX = VC (
 REF )), ( SINITIALS = VC ( REF )), ( SORIGINAL = VC ( REF ))) =  C250  WITH  IMAGE_AXP =
"shri18nuar" , IMAGE_AIX ="libi18n_locale.a(libi18n_locale.o)" , UAR ="i18nBuildFullFormatName" ,
 PERSIST
DECLARE  UAR_I18NGETARABICTIME (( CTIME = VC ( REF ))) =  C20  WITH  IMAGE_AXP ="shri18nuar" ,
 IMAGE_AIX ="libi18n_locale.a(libi18n_locale.o)" , UAR ="i18n_GetArabicTime" , PERSIST
ENDIF
 
 
SET  LRETVAL  =  UAR_I18NLOCALIZATIONINIT ( I18NHANDLE ,  CURPROG , "" ,  CURCCLREV )
 
SET  SCLINREVIEW  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "clinically reviewed" ,
"CLINICALLY REVIEWED" )
 
 EXECUTE RX_GET_FACS_FOR_PRSNL_RR_INCL WITH  REPLACE ("REQUEST" , "PRSNL_FACS_REQ" ),
 REPLACE ("REPLY" , "PRSNL_FACS_REPLY" )
 
SET  STAT  =  ALTERLIST ( PRSNL_FACS_REQ -> QUAL , 1 )
 
 CALL ECHO ( BUILD ("Reqinfo->updt_id --" ,  REQINFO -> UPDT_ID ))
 
 CALL ECHO ( BUILD ("curuser --" ,  CURUSER ))
 
SET  PRSNL_FACS_REQ -> QUAL [1 ]-> USERNAME  =  TRIM ( CURUSER )
 
SET  PRSNL_FACS_REQ -> QUAL [1 ]-> PERSON_ID  =  REQINFO -> UPDT_ID
 
 EXECUTE RX_GET_FACS_FOR_PRSNL WITH  REPLACE ("REQUEST" , "PRSNL_FACS_REQ" ),
 REPLACE ("REPLY" , "PRSNL_FACS_REPLY" )
 
 CALL ECHO ( BUILD ("Size of facility list in prg--" ,  SIZE ( PRSNL_FACS_REPLY -> QUAL [1 ]->
 FACILITY_LIST , 5 )))
 
FREE RECORD FACILITY_LIST
 
RECORD  FACILITY_LIST  (
1  QUAL [*]
2  FACILITY_CD  =  F8 )
 
SET  STAT  =  ALTERLIST ( FACILITY_LIST -> QUAL ,  VALUE ( SIZE ( PRSNL_FACS_REPLY -> QUAL [1 ]->
 FACILITY_LIST , 5 )))
 
FOR (  X  = 1  TO  SIZE ( PRSNL_FACS_REPLY -> QUAL [1 ]-> FACILITY_LIST , 5 ) )
 
 CALL ECHO ( BUILD ("Checking facility --" ,  TRIM ( FORMAT ( PRSNL_FACS_REPLY -> QUAL [1 ]->
 FACILITY_LIST [ X ]-> FACILITY_CD ,  CFORMAT ), 3 )))
 CALL ECHO ( BUILD ("against --" , "FACILITY" ))
IF ( ( TRIM ( FORMAT ( PRSNL_FACS_REPLY -> QUAL [1 ]-> FACILITY_LIST [ X ]-> FACILITY_CD ,  CFORMAT
), 3 ) IN ("633867" ,
"3186521" ,
"3196527" ,
"3196529" ,
"3196531" )) )
SET  NFACILITYCOUNTER  = ( NFACILITYCOUNTER +1 )
SET  FACILITY_LIST -> QUAL [ NFACILITYCOUNTER ]-> FACILITY_CD  =  PRSNL_FACS_REPLY -> QUAL [1 ]->
 FACILITY_LIST [ X ]-> FACILITY_CD
ENDIF
 
 
ENDFOR
 
 
SET  STAT  =  ALTERLIST ( FACILITY_LIST -> QUAL ,  NFACILITYCOUNTER )
 
SET  NACTUALSIZE  =  SIZE ( FACILITY_LIST -> QUAL , 5 )
 
 CALL ECHO ( BUILD ("nActualSize --" ,  NACTUALSIZE ))
 
IF ( ( NACTUALSIZE =0 ) )
 CALL ECHO ("*** User does not have access to facility selection ***" ) GO TO  EXIT_SCRIPT
ENDIF
 
 
SET  NEXPANDTOTAL  = ( NACTUALSIZE +( NEXPANDSIZE - MOD ( NACTUALSIZE ,  NEXPANDSIZE )))
 
SET  NEXPANDSTART  = 1
 
SET  NEXPANDSTOP  = 50
 
SET  STAT  =  ALTERLIST ( FACILITY_LIST -> QUAL ,  NEXPANDTOTAL )
 
FOR (  X  = ( NACTUALSIZE +1 ) TO  NEXPANDTOTAL  )
 
SET  FACILITY_LIST -> QUAL [ X ]-> FACILITY_CD  =  FACILITY_LIST -> QUAL [ NACTUALSIZE ]->
 FACILITY_CD
 
ENDFOR
 
 
DECLARE  UTCDATETIME (( DDATETIME = VC ), ( LINDEX = I4 ), ( BSHOWTZ = I2 ), ( SFORMAT = VC )) =
 VC
 
DECLARE  UTCSHORTTZ (( LINDEX = I4 )) =  VC
 
DECLARE  SUTCDATETIME  =  VC  WITH  PROTECT , NOCONSTANT (" " )
 
DECLARE  DUTCDATETIME  =  F8  WITH  PROTECT , NOCONSTANT (0.0 )
 
DECLARE  CUTC  =  I2  WITH  PROTECT , CONSTANT ( CURUTC )
 
SUBROUTINE   UTCDATETIME  ( SDATETIME ,  LINDEX ,  BSHOWTZ ,  SFORMAT  )
 
DECLARE  OFFSET  =  I2  WITH  PROTECT , NOCONSTANT (0 )
DECLARE  DAYLIGHT  =  I2  WITH  PROTECT , NOCONSTANT (0 )
DECLARE  LNEWINDEX  =  I4  WITH  PROTECT , NOCONSTANT ( CURTIMEZONEAPP )
DECLARE  SNEWDATETIME  =  VC  WITH  PROTECT , NOCONSTANT (" " )
DECLARE  CTIME_ZONE_FORMAT  =  VC  WITH  PROTECT , CONSTANT ("ZZZ" )
IF ( ( LINDEX >0 ) )
SET  LNEWINDEX  =  LINDEX
ENDIF
 
SET  SNEWDATETIME  =  DATETIMEZONEFORMAT ( SDATETIME ,  LNEWINDEX ,  SFORMAT )
IF ( ( CUTC =1 ) AND ( BSHOWTZ =1 ) )
IF ( ( SIZE ( TRIM ( SNEWDATETIME ))>0 ) )
SET  SNEWDATETIME  =  CONCAT ( SNEWDATETIME , " " ,  DATETIMEZONEFORMAT ( SDATETIME ,  LNEWINDEX ,
 CTIME_ZONE_FORMAT ))
ENDIF
 
ENDIF
 
SET  SNEWDATETIME  =  TRIM ( SNEWDATETIME ) RETURN ( SNEWDATETIME )
 
 
END ;Subroutine
 
 
SUBROUTINE   UTCSHORTTZ  ( LINDEX  )
 
DECLARE  OFFSET  =  I2  WITH  PROTECT , NOCONSTANT (0 )
DECLARE  DAYLIGHT  =  I2  WITH  PROTECT , NOCONSTANT (0 )
DECLARE  LNEWINDEX  =  I4  WITH  PROTECT , NOCONSTANT ( CURTIMEZONEAPP )
DECLARE  SNEWSHORTTZ  =  VC  WITH  PROTECT , NOCONSTANT (" " )
DECLARE  CTIME_ZONE_FORMAT  =  I2  WITH  PROTECT , CONSTANT (7 )
IF ( ( CUTC =1 ) )
IF ( ( LINDEX >0 ) )
SET  LNEWINDEX  =  LINDEX
ENDIF
 
SET  SNEWSHORTTZ  =  DATETIMEZONEBYINDEX ( LNEWINDEX ,  OFFSET ,  DAYLIGHT ,  CTIME_ZONE_FORMAT )
ENDIF
 
SET  SNEWSHORTTZ  =  TRIM ( SNEWSHORTTZ ) RETURN ( SNEWSHORTTZ )
 
 
END ;Subroutine
 
 
RECORD  INTERNAL  (
1  BEGIN_DT_TM  =  DQ8
1  END_DT_TM  =  DQ8
1  LOCS [*]
2  LOC_CD  =  F8
2  TYPES [*]
3  TYPE_CD  =  F8
3  HOUR [24 ]
4  SEGMENT  =  I2 )
 
SET  INTERNAL -> BEGIN_DT_TM  =  CNVTDATETIME ( START_DT ,  NSTART_TM )
 
SET  INTERNAL -> END_DT_TM  =  CNVTDATETIME ( STOP_DT ,  NSTOP_TM )
 
 CALL ECHO ( BUILD ( INTERNAL -> BEGIN_DT_TM ))
 
 CALL ECHO ( BUILD ( INTERNAL -> END_DT_TM ))
 
SET  LINE1  =  FILLSTRING (169 , "-" )
 
SET  LINE2  =  FILLSTRING (169 , "=" )
 
SET  ACTIONS  = 1
 
SET  TOTAL_ACTIONS  = 0
 
SET  ACTIONSGRAND  = 1
 
SET  PAGENUM  = 0
 
SET  DT  = 0
 
FREE SET ACTION_TYPES
 
RECORD  ACTION_TYPES  (
1  TYPE [*]
2  DISPLAY  =  VC
2  NURSE_HOUR [*]
3  TOTAL  =  F8
2  FACILITY_HOUR [*]
3  TOTAL  =  F8
2  GRAND_HOUR [24 ]
3  TOTAL  =  F8 )
 
SELECT  INTO "NL:"
CV.CODE_SET,
CV.CODE_VALUE,
CV.DISPLAY
FROM ( CODE_VALUE  CV )
 
WHERE (CV.CODE_SET=6003 ) AND (CV.CODE_VALUE!=2529 )
ORDER BY CV.DISPLAY
 
HEAD REPORT
 
 CALL ECHO ("hit report" )
DETAIL
 NACTION_TYPE_CNT =( NACTION_TYPE_CNT +1 ),
 STAT = ALTERLIST ( ACTION_TYPES -> TYPE ,  NACTION_TYPE_CNT ),
 ACTION_TYPES -> TYPE [ NACTION_TYPE_CNT ]-> DISPLAY = CNVTUPPER ( TRIM ( SUBSTRING (1 , 19 ,
CV.DISPLAY)))
 WITH  NOCOUNTER
 
SET  NACTION_TYPE_CNT  = ( NACTION_TYPE_CNT +1 )
 
SET  STAT  =  ALTERLIST ( ACTION_TYPES -> TYPE ,  NACTION_TYPE_CNT )
 
SET  ACTION_TYPES -> TYPE [ NACTION_TYPE_CNT ]-> DISPLAY  = "VERIFY"
 
SET  NACTION_TYPE_CNT  = ( NACTION_TYPE_CNT +1 )
 
SET  STAT  =  ALTERLIST ( ACTION_TYPES -> TYPE ,  NACTION_TYPE_CNT )
 
SET  ACTION_TYPES -> TYPE [ NACTION_TYPE_CNT ]-> DISPLAY  =  UAR_GET_CODE_DISPLAY ( CPRODASSIGN )
 
SET  NACTION_TYPE_CNT  = ( NACTION_TYPE_CNT +1 )
 
SET  STAT  =  ALTERLIST ( ACTION_TYPES -> TYPE ,  NACTION_TYPE_CNT )
 
SET  ACTION_TYPES -> TYPE [ NACTION_TYPE_CNT ]-> DISPLAY  =  SCLINREVIEW
 
SELECT
IF ( ( CNVTUPPER ( TRIM ( $OUTDEV ))!="MINE" ) )
 WITH  DIO = POSTSCRIPT , MAXROW =45 , MAXCOL =190 , COUNTER , FORMAT , FORMAT = VARIABLE ,
 NULLREPORT
ELSE
ENDIF
 INTO  $OUTDEV
 ACT_TIME = SUBSTRING (10 , 4 ,  FORMAT (OA.ACTION_DT_TM, "mm/dd/yy hhmm" )),
 ACT_TYPE =
IF ( (OA.ACTION_QUALIFIER_CD>0 ) )  UAR_GET_CODE_DISPLAY (OA.ACTION_QUALIFIER_CD)
ELSEIF ( (OA.NEEDS_VERIFY_IND=3 ) ) "Verify"
ELSEIF ( (OA.NEED_CLIN_REVIEW_FLAG=2 ) AND (ORE.REVIEWED_STATUS_FLAG=1 ) AND (ORE.REVIEW_TYPE_FLAG=
5 ) )  SCLINREVIEW
ELSE   UAR_GET_CODE_DISPLAY (OA.ACTION_TYPE_CD)
ENDIF
,
 NURSE_UNIT = UAR_GET_CODE_DESCRIPTION (E.LOC_NURSE_UNIT_CD),
 FACILITY_AREA = UAR_GET_CODE_DISPLAY (E.LOC_FACILITY_CD)
FROM ( ORDERS  O ),
( ORDER_REVIEW  ORE ),
( ORDER_ACTION  OA ),
( ORDER_DISPENSE  OD ),
;(code_value cv),
( ENCOUNTER  E ),
( DUMMYT  D  WITH  SEQ = VALUE (( NEXPANDTOTAL / NEXPANDSIZE )))
 PLAN ( OA
WHERE (OA.ACTION_DT_TM BETWEEN  CNVTDATETIME ( INTERNAL -> BEGIN_DT_TM ) AND  CNVTDATETIME (
 INTERNAL -> END_DT_TM )) AND  NOT (((OA.ACTION_TYPE_CD+0 ) IN ( CSTATUSCHANGE ,
 CTRANSCANCEL )) )
 and (oa.order_id = (select o1.order_id from orders o1    	     ;001
		WHERE (O1.ORDER_ID=OA.ORDER_ID) 				         ;001
		AND (O1.ACTIVITY_TYPE_CD= NPHARM ) 				         ;001
		AND (O1.ORIG_ORD_AS_FLAG=0 ) 					         ;001
		AND (O1.TEMPLATE_ORDER_FLAG IN (0 ,1 ))))		         ;001
 )
 AND ( ORE
WHERE (ORE.ORDER_ID= OUTERJOIN (OA.ORDER_ID)) AND (ORE.ACTION_SEQUENCE= OUTERJOIN (
OA.ACTION_SEQUENCE)))
 AND ( O
;001 WHERE (O.ORDER_ID=OA.ORDER_ID) AND (O.ACTIVITY_TYPE_CD= NPHARM ) AND (O.ORIG_ORD_AS_FLAG=0 ) AND (
WHERE (O.ORDER_ID=OA.ORDER_ID) ;001
;001 AND (cnvtstring(O.ACTIVITY_TYPE_CD) = "715"; in ( NPHARM,0,0,0,0,NPHARM) )
;001 AND (O.ORIG_ORD_AS_FLAG=0 ) AND (
;001 O.TEMPLATE_ORDER_FLAG IN (0 ,
;001 1 ))
    )
 AND ( OD
WHERE (OD.ORDER_ID=O.ORDER_ID))
 AND ( D
WHERE  ASSIGN ( NEXPANDSTART ,  EVALUATE (D.SEQ, 1 , 1 , ( NEXPANDSTART + NEXPANDSIZE ))) AND
 ASSIGN ( NEXPANDSTOP , ( NEXPANDSTART +( NEXPANDSIZE -1 ))))
 AND ( E
WHERE (E.ENCNTR_ID=O.ENCNTR_ID) AND  EXPAND ( NEXPAND ,  NEXPANDSTART ,  NEXPANDSTOP ,
E.LOC_FACILITY_CD,  FACILITY_LIST -> QUAL [ NEXPAND ]-> FACILITY_CD ))
 
ORDER BY  FACILITY_AREA ,
 NURSE_UNIT ,
 ACT_TYPE ,
 ACT_TIME ,
OA.ORDER_ID,
OA.ACTION_SEQUENCE,
ORE.REVIEW_SEQUENCE DESC
 
HEAD REPORT
 
 CALL ECHO ( BUILD ("past join " )),
 TYPECNT =0 ,
 AHOUR [24 ]=0 ,
 ATOTAL [24 ]=0 ,
 AGRDTOT [24 ]=0 ,
 AGRDTOTGRAND [24 ]=0 ,
 NHIT_REPORT =0 ,
 BNEW_PAGE =0
HEAD PAGE
 
 CALL ECHO ( BUILD ("******** New Page ********" ,  CURPAGE )),
 BNEW_PAGE =1 ,
 
IF ( ( CNVTUPPER ( TRIM ( $OUTDEV ))!="MINE" ) )  COL 0 ,
"{ps/792 0 translate 90 rotate/}{pos/000/000}{f/1/0}{lpi/6}{cpi/17}" ,  ROW +1
ENDIF
,
 COL 01 ,
"RX_RPT_ORDER_ACTION" ,
 
IF ( ( CNVTUPPER ( TRIM ( RUN_TYPE ))="DETAIL" ) )
 CALL CENTER ("ORDER ACTIONS BY LOCATION (DETAIL)" , 1 , 160 )
ELSE
 CALL CENTER ("ORDER ACTIONS BY LOCATION (SUMMARY)" , 1 , 160 )
ENDIF
,
 COL 161 ,
"Page: " ,
 CURPAGE "###"
,
 ROW +1 ,
 COL 01 ,
"Date Range.......: " ,
 
IF ( ( INTERNAL -> BEGIN_DT_TM >0 ) )  SUTCDATETIME = CONCAT ( FORMAT ( INTERNAL -> BEGIN_DT_TM ,
"MM/DD/YY HH:MM;;D" ), " " ,  UTCSHORTTZ (0 )),  COL 20 ,  SUTCDATETIME
ENDIF
,
 
IF ( ( INTERNAL -> END_DT_TM >0 ) )  SUTCDATETIME = CONCAT ( FORMAT ( INTERNAL -> END_DT_TM ,
"MM/DD/YY HH:MM;;D" ), " " ,  UTCSHORTTZ (0 )),  COL 44 ,  SUTCDATETIME
ENDIF
,
 SUTCDATETIME = UTCDATETIME ( CNVTDATETIME ( CURDATE ,  CURTIME ), 0 , 0 , "MM/DD/YYYY HH:mm" ),
 COL 135 ,
"Run Date: " ,
 SUTCDATETIME ,
 ROW +1 ,
 COL 01 ,
 LINE1 ,
 ROW +2
HEAD  FACILITY_AREA
 
 CALL ECHO ( BUILD ("Head facility ---" ,  FACILITY_AREA )), NHIT_REPORT =1 ,
FOR (  X  = 1  TO  NACTION_TYPE_CNT  )
 STAT = ALTERLIST ( ACTION_TYPES -> TYPE [ X ]-> FACILITY_HOUR , 0 ), STAT = ALTERLIST (
 ACTION_TYPES -> TYPE [ X ]-> FACILITY_HOUR , 24 )
 
ENDFOR
, ACTIONS =1 ,
IF ( ( BNEW_PAGE =0 ) ) BREAK
ENDIF
,
IF ( ( CNVTUPPER ( TRIM ( RUN_TYPE ))="DETAIL" ) )
IF ( (E.LOC_FACILITY_CD=0.0 ) )  COL 01 , "Facility: " , "Unknown"
ELSE   COL 01 , "Facility: " ,  FACILITY_AREA
ENDIF
,  ROW +2
ENDIF
, BNEW_PAGE =0
HEAD E.LOC_NURSE_UNIT_CD
 
 CALL ECHO ( BUILD ("Head nurse unit ---" ,  NURSE_UNIT )),
FOR (  X  = 1  TO  NACTION_TYPE_CNT  )
 STAT = ALTERLIST ( ACTION_TYPES -> TYPE [ X ]-> NURSE_HOUR , 0 ), STAT = ALTERLIST ( ACTION_TYPES
-> TYPE [ X ]-> NURSE_HOUR , 24 )
 
ENDFOR
,
IF ( ( ROW >=36 ) )
 CALL ECHO ("Breaking in head nurse unit" ), BREAK
ENDIF
,
IF ( ( CNVTUPPER ( TRIM ( RUN_TYPE ))="DETAIL" ) )
IF ( ( BNEW_PAGE =1 ) )
IF ( (E.LOC_FACILITY_CD=0.0 ) )  COL 01 , "Facility: " , "Unknown"
ELSE   COL 01 , "Facility: " ,  FACILITY_AREA
ENDIF
,  ROW +2
ENDIF
,
IF ( (E.LOC_NURSE_UNIT_CD=0.0 ) )  COL 01 , "Location: " , "Unknown"
ELSE   COL 01 , "Location: " ,  NURSE_UNIT
ENDIF
,  ROW +1 ,  COL 20 ,
" 0000  0100  0200  0300  0400  0500  0600  0700  0800  0900  1000  1100  1200  1300 " ,
" 1400  1500  1600  1700  1800  1900  2000  2100  2200  2300 Total" ,  ROW +1 ,  COL 01 ,
"Action Type: " ,  COL 20 ,
" 0059  0159  0259  0359  0459  0559  0659  0759  0859  0959  1059  1159  1259  1359 " ,
" 1459  1559  1659  1759  1859  1959  2059  2159  2259  2359" ,  ROW +1 ,  COL 01 ,  LINE1 ,  ROW +
1
ENDIF
, STAT = INITARRAY ( ATOTAL , 0 ), BNEW_PAGE =0
HEAD  ACT_TYPE
 
 CALL ECHO ( BUILD ("Head act type ---" ,  ACT_TYPE , "/" , OA.ACTION_TYPE_CD)), STAT = INITARRAY (
 AHOUR , 0 )
HEAD OA.ORDER_ID
 
 CALL ECHO ("Head oa.Order_ID" )
HEAD OA.ACTION_SEQUENCE
 
 CALL ECHO ("Head oa.Action_Sequence" ), NSKIPDETAIL =0
DETAIL
 
IF ( ( NSKIPDETAIL =0 ) )
 CALL ECHO ( BUILD ("Detail/Order id --" , OA.ORDER_ID)),  BNEW_PAGE =0 ,
IF ( (OA.NEEDS_VERIFY_IND=3 ) )  SUTCDATETIME = UTCDATETIME (OA.UPDT_DT_TM, 0 , 0 , "MM/DD/YY HHmm"
)
ELSE   SUTCDATETIME = UTCDATETIME (OA.ACTION_DT_TM, OA.ACTION_TZ, 0 , "MM/DD/YY HHmm" )
ENDIF
,  ACT_HOUR = SUBSTRING (10 , 2 ,  SUTCDATETIME ),  IDX =0 ,  IDX =( CNVTINT ( ACT_HOUR )+1 ),  W =
0 ,
FOR (  Y  = 1  TO  NACTION_TYPE_CNT  )
 
IF ( ( CNVTUPPER ( TRIM ( ACTION_TYPES -> TYPE [ Y ]-> DISPLAY ))= CNVTUPPER ( TRIM ( ACT_TYPE )))
 )  W = Y
ENDIF
 
 
ENDFOR
,
IF ( ( W >0 ) )  AHOUR [ IDX ]=( AHOUR [ IDX ]+1 ),  ATOTAL [ IDX ]=( ATOTAL [ IDX ]+1 ),  AGRDTOT [
 IDX ]=( AGRDTOT [ IDX ]+1 ),  ACTION_TYPES -> TYPE [ W ]-> NURSE_HOUR [ IDX ]-> TOTAL =(
 ACTION_TYPES -> TYPE [ W ]-> NURSE_HOUR [ IDX ]-> TOTAL +1 ),  ACTION_TYPES -> TYPE [ W ]->
 FACILITY_HOUR [ IDX ]-> TOTAL =( ACTION_TYPES -> TYPE [ W ]-> FACILITY_HOUR [ IDX ]-> TOTAL +1 )
ENDIF
,  NSKIPDETAIL =1
ENDIF
 
FOOT  OA.ACTION_SEQUENCE
 
 CALL ECHO ("Foot oa.Action_Sequence" )
FOOT  OA.ORDER_ID
 
 CALL ECHO ("Foot oa.Order_ID" )
FOOT   ACT_TYPE
 
 CALL ECHO ("Foot act type" ), BNEW_PAGE =0 ,
 CALL ECHO ( BUILD ("bAll_actions ---" ,  BALL_ACTIONS )),
IF ( ( CNVTUPPER ( TRIM ( RUN_TYPE ))="DETAIL" ) AND ( BALL_ACTIONS =0 ) )  ACT_TYPE_OUTPUT =
 FILLSTRING (18 , " " ),  ACT_TYPE_OUTPUT = SUBSTRING (1 , 18 ,  ACT_TYPE ),  COL 01 ,
 ACT_TYPE_OUTPUT ,  COL 20 ,
FOR (  X  = 1  TO 24  )
 
IF ( ( AHOUR [ X ]>0 ) )  AHOUR [ X ]"#####"
,  DT =( DT + AHOUR [ X ])
ELSE  "-----"
ENDIF
, COL +1
 
ENDFOR
,  DT "######"
,  DT =0 ,  ROW +1 ,
IF ( ( BNEW_PAGE =1 ) )  BNEW_PAGE =0 ,
IF ( (E.LOC_FACILITY_CD=0.0 ) )  COL 01 , "Facility: " , "Unknown"
ELSE   COL 01 , "Facility: " ,  FACILITY_AREA
ENDIF
,  ROW +2 ,
IF ( (E.LOC_NURSE_UNIT_CD=0.0 ) )  COL 01 , "Location: " , "Unknown"
ELSE   COL 01 , "Location: " ,  NURSE_UNIT
ENDIF
,  ROW +1 ,  COL 20 ,
" 0000  0100  0200  0300  0400  0500  0600  0700  0800  0900  1000  1100  1200  1300 " ,
" 1400  1500  1600  1700  1800  1900  2000  2100  2200  2300 Total" ,  ROW +1 ,  COL 01 ,
"Action Type: " ,  COL 20 ,
" 0059  0159  0259  0359  0459  0559  0659  0759  0859  0959  1059  1159  1259  1359 " ,
" 1459  1559  1659  1759  1859  1959  2059  2159  2259  2359" ,  ROW +1 ,  COL 01 ,  LINE1 ,  ROW +
1
ENDIF
 
ENDIF
 
FOOT  E.LOC_NURSE_UNIT_CD
 
 CALL ECHO ("Foot nurse unit" ), BNEW_PAGE =0 ,
IF ( ( CNVTUPPER ( TRIM ( RUN_TYPE ))="DETAIL" ) )
IF ( ( BALL_ACTIONS =1 ) )
FOR (  Y  = 1  TO  NACTION_TYPE_CNT  )
 COL 01 , ACTION_TYPES -> TYPE [ Y ]-> DISPLAY , COL 20 ,
FOR (  X  = 1  TO 24  )
 
IF ( ( ACTION_TYPES -> TYPE [ Y ]-> NURSE_HOUR [ X ]-> TOTAL >0 ) )  ACTION_TYPES -> TYPE [ Y ]->
 NURSE_HOUR [ X ]-> TOTAL "#####"
,  DT =( DT + ACTION_TYPES -> TYPE [ Y ]-> NURSE_HOUR [ X ]-> TOTAL )
ELSE  "-----"
ENDIF
, COL +1
 
ENDFOR
, DT "######"
, DT =0 , ROW +1 ,
 CALL ECHO ( BUILD ("row ---" ,  ROW )),
IF ( ( BNEW_PAGE =1 ) )  BNEW_PAGE =0 ,
IF ( (E.LOC_FACILITY_CD=0.0 ) )  COL 01 , "Facility: " , "Unknown"
ELSE   COL 01 , "Facility: " ,  FACILITY_AREA
ENDIF
,  ROW +2 ,
IF ( (E.LOC_NURSE_UNIT_CD=0.0 ) )  COL 01 , "Location: " , "Unknown"
ELSE   COL 01 , "Location: " ,  NURSE_UNIT
ENDIF
,  ROW +1 ,  COL 20 ,
" 0000  0100  0200  0300  0400  0500  0600  0700  0800  0900  1000  1100  1200  1300 " ,
" 1400  1500  1600  1700  1800  1900  2000  2100  2200  2300 Total" ,  ROW +1 ,  COL 01 ,
"Action Type: " ,  COL 20 ,
" 0059  0159  0259  0359  0459  0559  0659  0759  0859  0959  1059  1159  1259  1359 " ,
" 1459  1559  1659  1759  1859  1959  2059  2159  2259  2359" ,  ROW +1 ,  COL 01 ,  LINE1 ,  ROW +
1
ENDIF
 
 
ENDFOR
 
ENDIF
,  COL 01 ,  LINE1 ,  ROW +1 ,  COL 01 , "Total Orders: " ,  COL 20 ,
FOR (  X  = 1  TO 24  )
 
IF ( ( ATOTAL [ X ]>0 ) )  ATOTAL [ X ]"#####"
,  DT =( DT + ATOTAL [ X ])
ELSE  "-----"
ENDIF
, COL +1
 
ENDFOR
,  DT "######"
,  DT =0 ,  ROW +1 ,  BNEW_PAGE =0 ,  COL 01 ,  LINE2 ,  ROW +2
ENDIF
 
FOOT   FACILITY_AREA
 
 CALL ECHO ("Foot facility" ),
IF ( ( CNVTUPPER ( TRIM ( RUN_TYPE ))="DETAIL" ) AND ( BNEW_PAGE =0 ) ) BREAK
ENDIF
, BNEW_PAGE =0 , COL 01 , LINE2 , ROW +1 ,
IF ( (E.LOC_FACILITY_CD=0.0 ) )  COL 01 , "Total Orders: " , "Unknown"
ELSE   COL 01 , "Total Orders: " ,  FACILITY_AREA
ENDIF
, ROW +1 , COL 01 , LINE1 , ROW +1 , COL 20 ,
" 0000  0100  0200  0300  0400  0500  0600  0700  0800  0900  1000  1100  1200  1300 " ,
" 1400  1500  1600  1700  1800  1900  2000  2100  2200  2300 Total" , ROW +1 , COL 20 ,
" 0059  0159  0259  0359  0459  0559  0659  0759  0859  0959  1059  1159  1259  1359 " ,
" 1459  1559  1659  1759  1859  1959  2059  2159  2259  2359" , ROW +1 , COL 01 , LINE1 , ROW +1 ,
 QUALIFY =0 ,
FOR (  Y  = 1  TO  NACTION_TYPE_CNT  )
 QUALIFY =0 ,
IF ( ( BALL_ACTIONS =0 ) )
FOR (  X  = 1  TO 24  )
 
IF ( ( ACTION_TYPES -> TYPE [ Y ]-> FACILITY_HOUR [ X ]-> TOTAL >0 ) )  QUALIFY =1 ,  X =25
ENDIF
 
 
ENDFOR
 
ELSE   QUALIFY =1
ENDIF
,
IF ( ( QUALIFY =1 ) )  COL 01 ,  ACTION_TYPES -> TYPE [ Y ]-> DISPLAY ,  COL 20 ,
FOR (  X  = 1  TO 24  )
 
IF ( ( ACTION_TYPES -> TYPE [ Y ]-> FACILITY_HOUR [ X ]-> TOTAL >0 ) )  ACTION_TYPES -> TYPE [ Y ]->
 FACILITY_HOUR [ X ]-> TOTAL "#####"
,  DT =( DT + ACTION_TYPES -> TYPE [ Y ]-> FACILITY_HOUR [ X ]-> TOTAL ),  ACTION_TYPES -> TYPE [ Y
]-> GRAND_HOUR [ X ]-> TOTAL =( ACTION_TYPES -> TYPE [ Y ]-> GRAND_HOUR [ X ]-> TOTAL +
 ACTION_TYPES -> TYPE [ Y ]-> FACILITY_HOUR [ X ]-> TOTAL )
ELSE  "-----"
ENDIF
, COL +1
 
ENDFOR
,  DT "######"
,  DT =0 ,  ROW +1 ,
IF ( ( BNEW_PAGE =1 ) )  BNEW_PAGE =0 ,  COL 01 ,  LINE2 ,  ROW +1 ,
IF ( (E.LOC_FACILITY_CD=0.0 ) )  COL 01 , "Total Orders: " , "Unknown"
ELSE   COL 01 , "Total Orders: " ,  FACILITY_AREA
ENDIF
,  ROW +1 ,  COL 01 ,  LINE1 ,  ROW +1 ,  COL 20 ,
" 0000  0100  0200  0300  0400  0500  0600  0700  0800  0900  1000  1100  1200  1300 " ,
" 1400  1500  1600  1700  1800  1900  2000  2100  2200  2300 Total" ,  ROW +1 ,  COL 20 ,
" 0059  0159  0259  0359  0459  0559  0659  0759  0859  0959  1059  1159  1259  1359 " ,
" 1459  1559  1659  1759  1859  1959  2059  2159  2259  2359" ,  ROW +1 ,  COL 01 ,  LINE1 ,  ROW +
1
ENDIF
 
ENDIF
 
 
ENDFOR
, COL 01 , LINE1 , ROW +1 , COL 1 ,"Facility Total" , COL 20 ,
FOR (  X  = 1  TO 24  )
 
IF ( ( AGRDTOT [ X ]>0 ) )  AGRDTOT [ X ]"#####"
,  DT =( DT + AGRDTOT [ X ])
ELSE  "-----"
ENDIF
, COL +1
 
ENDFOR
, DT "######"
, DT =0 , ROW +1 , COL 01 , LINE2 , STAT = INITARRAY ( AGRDTOT , 0 ), BNEW_PAGE =0 , ACTIONS =1
FOOT REPORT
 
IF ( ( NHIT_REPORT !=1 ) )
 CALL ECHO ("No data qualified" ),  COL 5 , "NO DATA QUALIFIED FOR SELECTION"
ELSE  BREAK,  BNEW_PAGE =0 ,  COL 01 ,  LINE2 ,  ROW +1 ,  COL 01 , "Total Orders: All Facilities "
,  ROW +1 ,  COL 01 ,  LINE1 ,  ROW +1 ,  COL 20 ,
" 0000  0100  0200  0300  0400  0500  0600  0700  0800  0900  1000  1100  1200  1300 " ,
" 1400  1500  1600  1700  1800  1900  2000  2100  2200  2300 Total" ,  ROW +1 ,  COL 20 ,
" 0059  0159  0259  0359  0459  0559  0659  0759  0859  0959  1059  1159  1259  1359 " ,
" 1459  1559  1659  1759  1859  1959  2059  2159  2259  2359" ,  ROW +1 ,  COL 01 ,  LINE1 ,  ROW +
1 ,
FOR (  Y  = 1  TO  NACTION_TYPE_CNT  )
 QUALIFY =0 ,
IF ( ( BALL_ACTIONS =0 ) )
FOR (  X  = 1  TO 24  )
 
IF ( ( ACTION_TYPES -> TYPE [ Y ]-> GRAND_HOUR [ X ]-> TOTAL >0 ) )  QUALIFY =1 ,  X =25
ENDIF
 
 
ENDFOR
 
ELSE   QUALIFY =1
ENDIF
,
IF ( ( QUALIFY =1 ) )  COL 01 ,  ACTION_TYPES -> TYPE [ Y ]-> DISPLAY ,  COL 20 ,
FOR (  X  = 1  TO 24  )
 
IF ( ( ACTION_TYPES -> TYPE [ Y ]-> GRAND_HOUR [ X ]-> TOTAL >0 ) )  AGRDTOTGRAND [ X ]=(
 AGRDTOTGRAND [ X ]+ ACTION_TYPES -> TYPE [ Y ]-> GRAND_HOUR [ X ]-> TOTAL ),  ACTION_TYPES -> TYPE
[ Y ]-> GRAND_HOUR [ X ]-> TOTAL "#####"
,  DT =( DT + ACTION_TYPES -> TYPE [ Y ]-> GRAND_HOUR [ X ]-> TOTAL )
ELSE  "-----"
ENDIF
, COL +1
 
ENDFOR
,  DT "######"
,  DT =0 ,  ROW +1 ,
IF ( ( BNEW_PAGE =1 ) )  BNEW_PAGE =0 ,  COL 01 ,  LINE2 ,  ROW +1 ,  COL 01 ,
"Total Orders: All Facilities " ,  ROW +1 ,  COL 01 ,  LINE1 ,  ROW +1 ,  COL 20 ,
" 0000  0100  0200  0300  0400  0500  0600  0700  0800  0900  1000  1100  1200  1300 " ,
" 1400  1500  1600  1700  1800  1900  2000  2100  2200  2300 Total" ,  ROW +1 ,  COL 20 ,
" 0059  0159  0259  0359  0459  0559  0659  0759  0859  0959  1059  1159  1259  1359 " ,
" 1459  1559  1659  1759  1859  1959  2059  2159  2259  2359" ,  ROW +1 ,  COL 01 ,  LINE1 ,  ROW +
1
ENDIF
 
ENDIF
 
 
ENDFOR
,  COL 01 ,  LINE1 ,  ROW +1 ,  COL 1 , "Grand Total" ,  COL 20 ,
FOR (  X  = 1  TO 24  )
 
IF ( ( AGRDTOTGRAND [ X ]>0 ) )  AGRDTOTGRAND [ X ]"#####"
,  DT =( DT + AGRDTOTGRAND [ X ])
ELSE  "-----"
ENDIF
, COL +1
 
ENDFOR
,  DT "######"
,  DT =0 ,  ROW +1 ,  COL 01 ,  LINE2 ,  ROW +2 ,
 CALL CENTER ("** End of Report **" , 1 , 140 )
ENDIF
,
 
 CALL ECHO ("**** END OF REPORT ****" )
 WITH  NOCOUNTER , MAXCOL =300 , FORMAT , FORMAT = VARIABLE , NULLREPORT
 
# EXIT_SCRIPT
 
IF ( ( CURQUAL =0 ) )
SET  REPLY -> STATUS_DATA -> STATUS  = "Z"
 CALL ECHO ("No Qualifications" )
ELSE
SET  REPLY -> STATUS_DATA -> STATUS  = "S"
 CALL ECHO ("Success" )
ENDIF
 
 
 CALL ECHO ("Last_Mod: 014" )
 
 CALL ECHO ("Last_Mod_Date: 01/10/2008" )
 END GO
