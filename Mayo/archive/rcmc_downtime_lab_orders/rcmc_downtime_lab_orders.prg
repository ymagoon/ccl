;*** Generated by translate command; please verify contents before re-including in CCL ***
/***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
 *000 03/21/13 Akcia                Change DB2 code to lookup password in registry
 *001 09/24/13 Akcia                Change encnounter alias pool code.
 ******************** End of Modification Log **************************/
 
DROP PROGRAM   RCMC_DOWNTIME_LAB_ORDERS : DBA  GO
CREATE PROGRAM  RCMC_DOWNTIME_LAB_ORDERS : DBA
PROMPT "Output to File/Printer/MINE" ="MINE"
 WITH  OUTDEV
 
;;IF ( ( CURDOMAIN ="PROD" ) )
;;FREE DEFINE ORACLESYSTEM
;;DEFINE  ORACLESYSTEM "v500/fullmoon@mhprbrpt"
;;ELSEIF ( ( CURDOMAIN ="MHPRD" ) )
;;FREE DEFINE ORACLESYSTEM
;;DEFINE  ORACLESYSTEM "v500/fullmoon@mhprbrpt"
;;ELSEIF ( ( CURDOMAIN ="MHCRT" ) )
;;FREE DEFINE ORACLESYSTEM
;;DEFINE  ORACLESYSTEM "v500/java4t2@mhcrtrpt"
;;ENDIF
 
/*** Start 001 - New Code ****/
;****************** Begin ORACLE INSTANCE 2 routine ****************
;*** If PROD / CERT then run as 2nd oracle instance to improve
;***   efficiency. Will auto Fail-over to Instance 1 if Instance 2 down.
;***   Then after at the end, set the program back to instance 1.
;******************************************************************************
 
;*** This section calls an O/S scritp that reads the current v500 password
;***   from the Millennium registry and stores it in a file named
;***   $CCLUSERDIR/dbinfo.dat
declare dcl_command = vc
declare dcl_size = i4
declare dcl_stat = i4
 
set dcl_command = "/mayo/procs/req_query.ksh"
set dcl_size = size(dcl_command)
set dcl_stat = 0
 
call dcl(dcl_command,dcl_size,dcl_stat)
 
;*** Next the password is read from the dbinfo.dat file to variable 'pass'.
FREE DEFINE RTL
DEFINE RTL IS "dbinfo.dat"
 
declare pass=vc
 
SELECT DISTINCT INTO "NL:"
  line = substring(1,30,R.LINE)   ; 9,9       10,9
FROM RTLT R
PLAN R
 
detail
 
if (line = "dbpw*")
  pass_in=substring(9,15,line)
  pass=trim(pass_in,3)
endif
 
with counter
 
;*** Now we are finished with the dbinfo.dat file and will delete it.
set dcl_command = ""
set dcl_command = "rm $CCLUSERDIR/dbinfo.dat"
set dcl_size = size(dcl_command)
set dcl_stat = 0
 
call dcl(dcl_command,dcl_size,dcl_stat)
 
declare system=vc
 
;*** This section redifines the OracleSystem variable pointing it to
;***   database instance 2 using the password read in above.
;*** This only applies to PRD and CRT, because they are the only domains
;***   that have multiple instance databases.
IF (curdomain = "MHPRD")
  Free define oraclesystem
  set system=build(concat('v500/', pass, '@mhprdrpt'))
  DEFINE oraclesystem system
ELSEIF (CURDOMAIN="MHCRT")
    FREE DEFINE oraclesystem
    set system=build(concat('v500/', pass, '@mhcrtrpt'))
    DEFINE oraclesystem system
ENDIF
/*** END 001 - New Code ***/
 
DECLARE  FIN_VAR  =  F8
 
DECLARE  CANCELED_VAR  =  F8
 
DECLARE  DELETED_VAR  =  F8
 
DECLARE  DISCONTINUED_VAR  =  F8
 
DECLARE  COMPLETED_VAR  =  F8
 
SET  FIN_VAR  =  UAR_GET_CODE_BY ("display" , 263 , "FIN" )
 
SET  CANCELED_VAR  =  UAR_GET_CODE_BY ("meaning" , 6004 , "CANCELED" )
 
SET  DELETED_VAR  =  UAR_GET_CODE_BY ("meaning" , 6004 , "DELETED" )
 
SET  DISCONTINUED_VAR  =  UAR_GET_CODE_BY ("meaning" , 6004 , "DISCONTINUED" )
 
SET  COMPLETED_VAR  =  UAR_GET_CODE_BY ("meaning" , 6004 , "COMPLETED" )
 
SET  MAXSECS  = 960
 
SELECT  DISTINCT  INTO  $OUTDEV
E.LOC_FACILITY_CD,
 O_CATALOG_CDF = UAR_GET_CODE_MEANING (O.CATALOG_CD),
O.CATALOG_CD,
 O_CATALOG_DISP = UAR_GET_CODE_DISPLAY (O.CATALOG_CD),
 ORDER_ID = CNVTINT (O.ORDER_ID),
O.ORIG_ORDER_DT_TM,
P.BIRTH_DT_TM,
O.CURRENT_START_DT_TM,
OD.OE_FIELD_DISPLAY_VALUE,
PAL.ALIAS,
PAL.ALIAS_POOL_CD,
O.ORDER_MNEMONIC,
EA.ALIAS,
 E_ENCNTR_TYPE_DISP = UAR_GET_CODE_DESCRIPTION (E.ENCNTR_TYPE_CD),
 O_ORDER_STATUS_DISP = UAR_GET_CODE_DISPLAY (O.ORDER_STATUS_CD),
 E_LOC_ROOM_DISP = UAR_GET_CODE_DISPLAY (E.LOC_ROOM_CD),
 E_LOC_NURSE_UNIT_DISP = UAR_GET_CODE_DISPLAY (E.LOC_NURSE_UNIT_CD),
CVA.ALIAS
FROM ( ORDERS  O ),
( PERSON  P ),
( PRSNL  P1 ),
( ENCOUNTER  E ),
( PERSON_ALIAS  PA ),
( ENCNTR_ALIAS  EA ),
( ORDER_DETAIL  OD ),
( PRSNL_ALIAS  PAL ),
( ENCNTR_DOMAIN  ED )
 PLAN ( ED
WHERE (ED.END_EFFECTIVE_DT_TM= CNVTDATETIME ("31-DEC-2100 00:00" )) AND (ED.LOC_FACILITY_CD=
24988897.00 ) AND ((ED.ACTIVE_IND+0 )=1 ))
 AND ( E
WHERE (E.ENCNTR_ID=ED.ENCNTR_ID) AND ((E.ENCNTR_STATUS_CD+0 )!=856.00 ) AND ((E.ENCNTR_TYPE_CD+0 )!=
3990509 ))
 AND ( O
WHERE (O.ENCNTR_ID=E.ENCNTR_ID) AND (O.CURRENT_START_DT_TM BETWEEN  CNVTDATETIME (( CURDATE -90 ),
 CURTIME3 ) AND  CNVTDATETIME (( CURDATE +90 ),  CURTIME3 )) AND  NOT ((O.ORDER_STATUS_CD IN (
2542.00 ,
2544.00 ,
2545.00 ,
2543.00 ,
2548.00 )) ) AND (O.CATALOG_TYPE_CD=2513.00 ) AND  NOT ((O.CATALOG_CD IN (26410842.00 )) ))
 AND ( EA
WHERE (EA.ENCNTR_ID=E.ENCNTR_ID) AND
;001       (EA.ALIAS_POOL_CD=25017865.00 )
       ea.encntr_alias_type_cd =  1077.00   ;001
       and ea.alias_pool_cd =    26411962.00 ;001
       and ea.active_ind = 1 ;001
       and ea.end_effective_dt_tm > sysdate
       )
 AND ( OD
WHERE (OD.ORDER_ID=O.ORDER_ID) AND (OD.OE_FIELD_MEANING="REQSTARTDTTM" ))
 AND ( P
WHERE (P.PERSON_ID=O.PERSON_ID))
 AND ( PA
WHERE (PA.PERSON_ID=P.PERSON_ID) AND (PA.ALIAS_POOL_CD=25036703.00 ) AND (PA.ACTIVE_IND=1 ))
 AND ( P1
WHERE (O.LAST_UPDATE_PROVIDER_ID=P1.PERSON_ID))
 AND ( PAL
WHERE ( OUTERJOIN (P1.PERSON_ID)=PAL.PERSON_ID) AND (PAL.ALIAS_POOL_CD= OUTERJOIN (28129116.00 ))
 AND (PAL.ACTIVE_IND= OUTERJOIN (1 )))
 
ORDER BY  E_LOC_NURSE_UNIT_DISP ,
 E_LOC_ROOM_DISP ,
P.NAME_FULL_FORMATTED,
O.CURRENT_START_DT_TM,
 ORDER_ID
 
HEAD REPORT
 M_NUMLINES =0 ,
 
SUBROUTINE   CCLRTF_PRINT  ( PAR_FLAG ,  PAR_XPIXEL ,  PAR_YOFFSET ,  PAR_NUMCOL ,  PAR_BLOB ,
 PAR_BLOBLEN ,  PAR_CHECK  )
 M_OUTPUT_BUFFER_LEN =0 , BLOB_OUT = FILLSTRING (30000 , " " ), BLOB_BUF = FILLSTRING (200 , " " ),
 M_LINEFEED = CONCAT ( CHAR (10 )), NUMLINES =0 , TEXTINDEX =0 , NUMCOL = PAR_NUMCOL , WHITEFLAG =0
, YINCREMENT =12 , YOFFSET =0 ,
 CALL UAR_RTF ( PAR_BLOB ,  PAR_BLOBLEN ,  BLOB_OUT ,  SIZE ( BLOB_OUT ),  M_OUTPUT_BUFFER_LEN ,
 PAR_FLAG ), M_OUTPUT_BUFFER_LEN = MINVAL ( M_OUTPUT_BUFFER_LEN ,  SIZE ( TRIM ( BLOB_OUT ))),
IF ( ( M_OUTPUT_BUFFER_LEN >0 ) )  M_CC =1 ,
WHILE (  M_CC )
 M_CC2 = FINDSTRING ( M_LINEFEED ,  BLOB_OUT ,  M_CC ),
IF (  M_CC2  )  BLOB_LEN =( M_CC2 - M_CC ),
IF ( ( BLOB_LEN <= PAR_NUMCOL ) )  M_BLOB_BUF = SUBSTRING ( M_CC ,  BLOB_LEN ,  BLOB_OUT ),
 YOFFSET =( Y_POS + PAR_YOFFSET ),
IF (  PAR_CHECK  )
 CALL PRINT ( CALCPOS ( PAR_XPIXEL ,  YOFFSET )),
 CALL PRINT ( TRIM ( CHECK ( M_BLOB_BUF )))
ELSE
 CALL PRINT ( CALCPOS ( PAR_XPIXEL ,  YOFFSET )),
 CALL PRINT ( TRIM ( M_BLOB_BUF ))
ENDIF
,  PAR_YOFFSET =( PAR_YOFFSET + YINCREMENT ),  NUMLINES =( NUMLINES +1 ),  ROW +1
ELSE   M_BLOBBUF = SUBSTRING ( M_CC ,  BLOB_LEN ,  BLOB_OUT ),
 CALL CCLRTF_PRINTLINE ( PAR_NUMCOL ,  BLOB_OUT ,  BLOB_LEN ,  PAR_CHECK )
ENDIF
,
IF ( ( M_CC2 >= M_OUTPUT_BUFFER_LEN ) )  M_CC =0
ELSE   M_CC =( M_CC2 +1 )
ENDIF
 
ELSE   BLOB_LEN =(( M_OUTPUT_BUFFER_LEN - M_CC )+1 ),  M_BLOBBUF = SUBSTRING ( M_CC ,  BLOB_LEN ,
 BLOB_OUT ),
 CALL CCLRTF_PRINTLINE ( PAR_NUMCOL ,  BLOB_OUT ,  BLOB_LEN ,  PAR_CHECK ),  M_CC =0
ENDIF
 
 
ENDWHILE
 
ENDIF
, M_NUMLINES = NUMLINES
 
END ;Subroutine report
,
 
SUBROUTINE   CCLRTF_PRINTLINE  ( PAR_NUMCOL ,  BLOB_OUT ,  BLOB_LEN ,  PAR_CHECK  )
 TEXTINDEX =0 , NUMCOL = PAR_NUMCOL , WHITEFLAG =0 , PRINTCOL =0 , ROWNUM =0 , LASTLINE =0 ,
 M_LINEFEED = CONCAT ( CHAR (10 )),
WHILE ( ( BLOB_LEN >0 ))
 
IF ( ( BLOB_LEN <= PAR_NUMCOL ) )  NUMCOL = BLOB_LEN ,  LASTLINE =1
ENDIF
, TEXTINDEX =( M_CC + PAR_NUMCOL ),
IF ( ( LASTLINE =0 ) )  WHITEFLAG =0 ,
WHILE ( ( WHITEFLAG =0 ))
 
IF (  (( ( SUBSTRING ( TEXTINDEX , 1 ,  BLOB_OUT )=" " ) )  OR  (( SUBSTRING ( TEXTINDEX , 1 ,
 BLOB_OUT )= M_LINEFEED ) ))  )  WHITEFLAG =1
ELSE   TEXTINDEX =( TEXTINDEX -1 )
ENDIF
,
IF (  (( ( TEXTINDEX = M_CC ) )  OR  (( TEXTINDEX =0 ) ))  )  TEXTINDEX =( M_CC + PAR_NUMCOL ),
 WHITEFLAG =1
ENDIF
 
 
ENDWHILE
,  NUMCOL =(( TEXTINDEX - M_CC )+1 )
ENDIF
, M_BLOB_BUF = SUBSTRING ( M_CC ,  NUMCOL ,  BLOB_OUT ),
IF ( ( M_BLOB_BUF >" " ) )  NUMLINES =( NUMLINES +1 ),  YOFFSET =( Y_POS + PAR_YOFFSET ),
IF (  PAR_CHECK  )
 CALL PRINT ( CALCPOS ( PAR_XPIXEL ,  YOFFSET )),
 CALL PRINT ( TRIM ( CHECK ( M_BLOB_BUF )))
ELSE
 CALL PRINT ( CALCPOS ( PAR_XPIXEL ,  YOFFSET )),
 CALL PRINT ( TRIM ( M_BLOB_BUF ))
ENDIF
,  PAR_YOFFSET =( PAR_YOFFSET + YINCREMENT ),  ROW +1
ELSE   BLOB_LEN =0
ENDIF
, M_CC =( M_CC + NUMCOL ),
IF ( ( BLOB_LEN > NUMCOL ) )  BLOB_LEN =( BLOB_LEN - NUMCOL )
ELSE   BLOB_LEN =0
ENDIF
 
 
ENDWHILE
 
 
END ;Subroutine report
,
 Y_POS =18 ,
 
SUBROUTINE   OFFSET  ( YVAL  )
 
 CALL PRINT ( FORMAT (( Y_POS + YVAL ), "###" ))
 
END ;Subroutine report
,
 COUNT =0
HEAD PAGE
 
IF ( ( CURPAGE >1 ) )  Y_POS =10
ENDIF
,
"{f/0}{cpi/14}" ,
 COUNT =( COUNT +1 ),
 ROW +1 ,
"{f/9}{cpi/9}" ,
 
 CALL PRINT ( CALCPOS (240 , ( Y_POS +21 ))),
"MERH Future Lab Orders" ,
 ROW +1 ,
 ROW +1 ,
"{f/9}{cpi/11}" ,
 
 CALL PRINT ( CALCPOS (280 , ( Y_POS +35 ))),
 CURDATE ,
 ROW +1 ,
"{f/0}{cpi/15}" ,
 ROW +1 ,
 ROW +1 ,
 Y_POS =( Y_POS +51 )
HEAD P.NAME_FULL_FORMATTED
 
IF ( (( Y_POS +190 )>=792 ) )  Y_POS =0 , BREAK
ENDIF
, ROW +1 ,"{f/1}{cpi/14}" ,
 CALL PRINT ( CALCPOS (36 , ( Y_POS +11 ))),"Patient Location" ,
 CALL PRINT ( CALCPOS (180 , ( Y_POS +11 ))),"Patient Name" ,
 CALL PRINT ( CALCPOS (350 , ( Y_POS +11 ))),"Birth Date" ,
 CALL PRINT ( CALCPOS (425 , ( Y_POS +11 ))),"MRN" ,
 CALL PRINT ( CALCPOS (500 , ( Y_POS +11 ))),"FIN" , ROW +1 , NAME_FULL_FORMATTED1 = SUBSTRING (1 ,
30 , P.NAME_FULL_FORMATTED), ALIAS1 = SUBSTRING (1 , 10 , PA.ALIAS), ALIASFIN = SUBSTRING (1 , 15 ,
EA.ALIAS), ENCNTR_TYPE = SUBSTRING (1 , 15 ,  E_ENCNTR_TYPE_DISP ), ROW +1 ,"{f/0}" ,
 CALL PRINT ( CALCPOS (36 , ( Y_POS +20 ))), E_LOC_NURSE_UNIT_DISP ,
 CALL PRINT ( CALCPOS (36 , ( Y_POS +30 ))), E_LOC_ROOM_DISP ,
 CALL PRINT ( CALCPOS (180 , ( Y_POS +20 ))), NAME_FULL_FORMATTED1 ,
 CALL PRINT ( CALCPOS (350 , ( Y_POS +20 ))),P.BIRTH_DT_TM,
 CALL PRINT ( CALCPOS (425 , ( Y_POS +20 ))), ALIAS1 ,
 CALL PRINT ( CALCPOS (500 , ( Y_POS +20 ))), ALIASFIN ,
 CALL PRINT ( CALCPOS (500 , ( Y_POS +30 ))), ENCNTR_TYPE , ROW +1 , ROW +1 ,"{f/1}" ,
 CALL PRINT ( CALCPOS (36 , ( Y_POS +47 ))),"Collection time" ,
 CALL PRINT ( CALCPOS (145 , ( Y_POS +47 ))),"Order Description" ,
 CALL PRINT ( CALCPOS (300 , ( Y_POS +47 ))),"Order Status" ,
 CALL PRINT ( CALCPOS (390 , ( Y_POS +47 ))),"Provider" , ROW +1 , Y_POS =( Y_POS +59 )
DETAIL
 
IF ( (( Y_POS +133 )>=792 ) )  Y_POS =0 , BREAK
ENDIF
,
 OE_FIELD_DISPLAY_VALUE1 = SUBSTRING (1 , 17 , OD.OE_FIELD_DISPLAY_VALUE),
 ALIAS_DT_TM = FORMAT (O.CURRENT_START_DT_TM, ";;Q" ),
 ALIAS2 = SUBSTRING (1 , 6 , PAL.ALIAS),
 PROVIDER = TRIM (P1.NAME_FULL_FORMATTED),
 PROVIDER_NAME_ALIAS = CONCAT ( ALIAS2 ,  PROVIDER ),
 ORDER_ALIAS = SUBSTRING (1 , 25 ,  O_CATALOG_DISP ),
 ROW +1 ,
"{f/0}{cpi/14}" ,
 
 CALL PRINT ( CALCPOS (36 , ( Y_POS +5 ))),
 OE_FIELD_DISPLAY_VALUE1 ,
 
 CALL PRINT ( CALCPOS (135 , ( Y_POS +5 ))),
 ORDER_ALIAS ,
 
 CALL PRINT ( CALCPOS (300 , ( Y_POS +5 ))),
 O_ORDER_STATUS_DISP ,
 
 CALL PRINT ( CALCPOS (390 , ( Y_POS +5 ))),
 PROVIDER_NAME_ALIAS ,
 Y_POS =( Y_POS +15 )
FOOT  P.NAME_FULL_FORMATTED
 
IF ( (( Y_POS +66 )>=792 ) )  Y_POS =0 , BREAK
ENDIF
, ROW +1 , Y_VAL =((792 - Y_POS )-21 ),"{ps/newpath 1 setlinewidth   20 " , Y_VAL ," moveto  590 " ,
 Y_VAL ," lineto stroke 20 " , Y_VAL ," moveto/}" ,
 CALL PRINT ( CALCPOS (45 , ( Y_POS +12 ))),
"----------------------------------------------------------------------------------------------" ,
 Y_POS =( Y_POS +36 )
FOOT PAGE
 Y_POS =726 ,
 ROW +1 ,
"{f/0}{cpi/14}" ,
 ROW +1 ,
 
 CALL PRINT ( CALCPOS (20 , ( Y_POS +11 ))),
"Lab Orders (ISJ), page: " ,
 
 CALL PRINT ( CALCPOS (150 , ( Y_POS +11 ))),
 COUNT ,
 
 CALL PRINT ( CALCPOS (20 , ( Y_POS +20 ))),
"Run Date/Time:" ,
 
 CALL PRINT ( CALCPOS (100 , ( Y_POS +20 ))),
 CURDATE ,
 
 CALL PRINT ( CALCPOS (145 , ( Y_POS +20 ))),
 CURTIME2
 WITH  MAXCOL =300 , MAXROW =500 , DIO =38 , NOHEADING , FORMAT = VARIABLE , TIME = VALUE ( MAXSECS
)
 
 
;;IF ( ( CURDOMAIN ="PROD" ) )
;;FREE DEFINE ORACLESYSTEM
;;DEFINE  ORACLESYSTEM "v500/fullmoon@mhprb1"
;;ELSEIF ( ( CURDOMAIN ="MHPRD" ) )
;;FREE DEFINE ORACLESYSTEM
;;DEFINE  ORACLESYSTEM "v500/fullmoon@mhprb1"
;;ELSEIF ( ( CURDOMAIN ="MHCRT" ) )
;;FREE DEFINE ORACLESYSTEM
;;DEFINE  ORACLESYSTEM "v500/java4t2@mhcrt1"
;;ENDIF
 
/****Start 001 - New Code ***/
;*** Restore the OracleSystem variable to its normal definition pointing
;***   to instance 1.
IF (curdomain = "MHPRD")
  Free define oraclesystem
  set system=build(concat('v500/', pass, '@mhprd1'))
  DEFINE oraclesystem system
 
ELSEIF (CURDOMAIN="MHCRT")
    FREE DEFINE oraclesystem
    set system=build(concat('v500/', pass, '@mhcrt1'))
    DEFINE oraclesystem system
 
ENDIF
 
/***END 001 - New Code ***/
 END GO
