;*** Generated by translate command; please verify contents before re-including in CCL ***
;001 akcpel     Added business address, Added date range logic.
;002 akcpel     run as 2nd oracle instance to improve efficiency
;003 akcsde		fixes for duplicate rows
;004 akcpel		Added logic to facility address select to get around inconsistences in table values
 
DROP PROGRAM   1_mhs_eth_custom_mar_5  GO
CREATE PROGRAM  1_mhs_eth_custom_mar_5
PROMPT "Output to File/Printer/MINE" ="MINE"
 WITH  OUTDEV
 
IF ( ( VALIDATE ( ISODBC ,  0 )= 0 ) )
 EXECUTE CCLSECLOGIN
ENDIF
 
/*** START 002 ***
;*********************************************************************
;*** If PROD / CERT then run as 2nd oracle instance to improve
;*** efficiency. Will auto Fail-over to Instance 1 if Instance 2 down.
;*********************************************************************
IF(CURDOMAIN = "PROD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprbrpt'
ELSEIF(CURDOMAIN = "MHPRD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprbrpt'
ELSEIF(CURDOMAIN="MHCRT")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/java4t2@mhcrtrpt'
ENDIF ;CURDOMAIN
;*** Write instance ccl ran in to the log file
;SET Iname = fillstring(10," ")
;SELECT INTO value("mayo_logfiles:mayo_instance2.log")
;  run_date = format(sysdate,";;q")
; ,Iname = substring(1,7,instance_name)
;FROM v$instance
;DETAIL
;  col  1 run_date
;  col +1 curprog
;  col +1 " *Instance="
;  col +1 Iname
;with nocounter
;   , format
;****************** End of INSTANCE 2 routine ************************
/*** END 002 ***/
 
 
/*** Start 006 - New Code ****/
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
 
 
 
set trace nocost                        ; turn off cost displaying
set message noinformation               ; turn off info displaying
 
/*** END 006 - New Code ***/
 
 
DECLARE  MED_VAR  =  F8
DECLARE  TRANS_VAR  =  F8
DECLARE  IMMUN_VAR  =  F8
DECLARE  CHILD_VAR  =  F8
DECLARE  FIN_VAR  =  F8
DECLARE  COMMENT_VAR  =  F8
SET  MED_VAR  =  UAR_GET_CODE_BY ("MEANING" ,  53 , "MED" )
SET  TRANS_VAR  =  UAR_GET_CODE_BY ("MEANING" ,  53 , "TRANS" )
SET  IMMUN_VAR  =  UAR_GET_CODE_BY ("MEANING" ,  53 , "IMMUN" )
SET  CHILD_VAR  =  UAR_GET_CODE_BY ("MEANING" ,  24 , "CHILD" )
SET  FIN_VAR  =  UAR_GET_CODE_BY ("MEANING" ,  319 , "FIN NBR" )
SET  COMMENT_VAR  =  UAR_GET_CODE_BY ("MEANING" ,  14 , "ORD COMMENT" )
DECLARE BUS_ADDR_CD = f8 with constant ( uar_get_code_by("MEANING",212,"BUSINESS"));001
;FREE RECORD REQUEST
RECORD  REQUEST  (
 1  OUTPUT_DEVICE  =  VC
 1  SCRIPT_NAME  =  VC
 1  PERSON_CNT  =  I4
 1  PERSON [*]
 2  PERSON_ID  =  F8
 1  VISIT_CNT  =  I4
 1  VISIT [*]
 2  ENCNTR_ID  =  F8
 1  PRSNL_CNT  =  I4
 1  PRSNL [*]
 2  PRSNL_ID  =  F8
 1  NV_CNT  =  I4
 1  NV [*]
 2  PVC_NAME  =  VC
 2  PVC_VALUE  =  VC
 1  BATCH_SELECTION  =  VC )
;FREE RECORD REPLY
RECORD  REPLY  (
 1  TEXT  =  VC
 1  STATUS_DATA
 2  STATUS  =  C1
 2  SUBEVENTSTATUS [ 1 ]
 3  OPERATIONNAME  =  C15
 3  OPERATIONSTATUS  =  C1
 3  TARGETOBJECTNAME  =  C15
 3  TARGETOBJECTVALUE  =  C100 )
 
;001 start - added code for date range
DECLARE  ABC  =  VC  WITH  NOCONSTANT ( FILLSTRING ( 25 , " " ))
DECLARE  BEG_DT_TM  =  DQ8  WITH  NOCONSTANT ( CNVTDATETIME ( CURDATE ,  CURTIME3 ))
DECLARE  BEG_IND  =  I2  WITH  NOCONSTANT ( 0 )
DECLARE  END_DT_TM  =  DQ8  WITH  NOCONSTANT ( CNVTDATETIME ( CURDATE ,  CURTIME3 ))
DECLARE  END_IND  =  I2  WITH  NOCONSTANT ( 0 )
DECLARE  OPS_IND  =  C1  WITH  NOCONSTANT ("N" )
DECLARE  STAT  =  I2  WITH  NOCONSTANT ( 0 )
DECLARE  X2  =  C2  WITH  NOCONSTANT ("  " )
DECLARE  X3  =  C3  WITH  NOCONSTANT ("   " )
DECLARE  XCOL  =  I4  WITH  NOCONSTANT ( 0 )
DECLARE  XXX  =  VC  WITH  NOCONSTANT ( FILLSTRING ( 20 , " " ))
DECLARE  XYZ  =  C20  WITH  NOCONSTANT ("  -   -       :  :  " )
DECLARE  YCOL  =  I4  WITH  NOCONSTANT ( 0 )
DECLARE  YYY  =  VC  WITH  NOCONSTANT ( FILLSTRING ( 60 , " " ))
 
IF ( ( REQUEST -> NV_CNT <= 1 ) )
	SET  BEG_DT_TM  =  CNVTDATETIME ( cnvtdate(06032014),  0 )
	SET  END_DT_TM  =  CNVTDATETIME (cnvtdate(06042014),  235959 )
ELSE
	FOR (  X  =  1  TO  REQUEST -> NV_CNT  )
 
		IF ( ( REQUEST -> NV [ X ]-> PVC_NAME ="BEG_DT_TM" ) )
			SET  BEG_IND  =  1
			SET  ABC  =  TRIM ( REQUEST -> NV [ X ]-> PVC_VALUE )
			SET  STAT  =  MOVESTRING ( ABC ,  7 ,  XYZ ,  1 ,  2 )
			SET  X2  =  SUBSTRING ( 5 ,  2 ,  ABC )
			IF ( ( X2 ="01" ) )
				SET  X3  = "JAN"
			ELSEIF ( ( X2 ="02" ) )
				SET  X3  = "FEB"
			ELSEIF ( ( X2 ="03" ) )
				SET  X3  = "MAR"
			ELSEIF ( ( X2 ="04" ) )
				SET  X3  = "APR"
			ELSEIF ( ( X2 ="05" ) )
				SET  X3  = "MAY"
			ELSEIF ( ( X2 ="06" ) )
				SET  X3  = "JUN"
			ELSEIF ( ( X2 ="07" ) )
				SET  X3  = "JUL"
			ELSEIF ( ( X2 ="08" ) )
				SET  X3  = "AUG"
			ELSEIF ( ( X2 ="09" ) )
				SET  X3  = "SEP"
			ELSEIF ( ( X2 ="10" ) )
				SET  X3  = "OCT"
			ELSEIF ( ( X2 ="11" ) )
				SET  X3  = "NOV"
			ELSEIF ( ( X2 ="12" ) )
				SET  X3  = "DEC"
			ENDIF
 
			SET  STAT  =  MOVESTRING ( X3 ,  1 ,  XYZ ,  4 ,  3 )
			SET  STAT  =  MOVESTRING ( ABC ,  1 ,  XYZ ,  8 ,  4 )
			SET  STAT  =  MOVESTRING ( ABC ,  9 ,  XYZ ,  13 ,  2 )
			SET  STAT  =  MOVESTRING ( ABC ,  11 ,  XYZ ,  16 ,  2 )
			SET  STAT  =  MOVESTRING ( ABC ,  13 ,  XYZ ,  19 ,  2 )
			SET  BEG_DT_TM  =  CNVTDATETIME ( XYZ )
		ELSEIF ( ( REQUEST -> NV [ X ]-> PVC_NAME ="END_DT_TM" ) )
			SET  END_IND  =  1
			SET  ABC  =  TRIM ( REQUEST -> NV [ X ]-> PVC_VALUE )
			SET  STAT  =  MOVESTRING ( ABC ,  7 ,  XYZ ,  1 ,  2 )
			SET  X2  =  SUBSTRING ( 5 ,  2 ,  ABC )
			IF ( ( X2 ="01" ) )
				SET  X3  = "JAN"
			ELSEIF ( ( X2 ="02" ) )
				SET  X3  = "FEB"
			ELSEIF ( ( X2 ="03" ) )
				SET  X3  = "MAR"
			ELSEIF ( ( X2 ="04" ) )
				SET  X3  = "APR"
			ELSEIF ( ( X2 ="05" ) )
				SET  X3  = "MAY"
			ELSEIF ( ( X2 ="06" ) )
				SET  X3  = "JUN"
			ELSEIF ( ( X2 ="07" ) )
				SET  X3  = "JUL"
			ELSEIF ( ( X2 ="08" ) )
				SET  X3  = "AUG"
			ELSEIF ( ( X2 ="09" ) )
				SET  X3  = "SEP"
			ELSEIF ( ( X2 ="10" ) )
				SET  X3  = "OCT"
			ELSEIF ( ( X2 ="11" ) )
				SET  X3  = "NOV"
			ELSEIF ( ( X2 ="12" ) )
				SET  X3  = "DEC"
			ENDIF
 
			SET  STAT  =  MOVESTRING ( X3 ,  1 ,  XYZ ,  4 ,  3 )
			SET  STAT  =  MOVESTRING ( ABC ,  1 ,  XYZ ,  8 ,  4 )
			SET  STAT  =  MOVESTRING ( ABC ,  9 ,  XYZ ,  13 ,  2 )
			SET  STAT  =  MOVESTRING ( ABC ,  11 ,  XYZ ,  16 ,  2 )
			SET  STAT  =  MOVESTRING ( ABC ,  13 ,  XYZ ,  19 ,  2 )
			SET  END_DT_TM  =  CNVTDATETIME ( XYZ )
		ENDIF
 
 
	ENDFOR
	call echo (format(end_dt_tm,"mm/dd/yyyy;;d"))
	call echo (format(beg_dt_tm,"mm/dd/yyyy;;d"))
    if (datetimecmp(end_dt_tm,beg_dt_tm) > 10)   ;001
         set end_dt_tm = datetimeadd(beg_dt_tm,10)   ;001
	endif      ;001
ENDIF
	call echo (format(end_dt_tm,"mm/dd/yyyy;;d"))
	call echo (format(beg_dt_tm,"mm/dd/yyyy;;d"))
 
;001 end
 
SET  MAXSECS  =  0
 
IF ( ( VALIDATE ( ISODBC ,  0 )= 1 ) )
SET  MAXSECS  =  15
ENDIF
 
 
SELECT  INTO  REQUEST -> OUTPUT_DEVICE
	C.ENCNTR_ID,
	C.EVENT_CLASS_CD,
	C.EVENT_RELTN_CD,
	C.EVENT_TAG,
	C.EVENT_TITLE_TEXT,
	C.ORDER_ID,
	C.PERFORMED_DT_TM,
	C.PERFORMED_PRSNL_ID,
	C.PERSON_ID,
	C.RESULT_STATUS_CD,
	 C_RESULT_STATUS_DISP = UAR_GET_CODE_DISPLAY (C.RESULT_STATUS_CD),
;001 DTTM = FORMAT (C.performed_dt_tm, "mm/dd/yy HH:MM" ),
	 DTTM = FORMAT (C.EVENT_END_DT_TM, "mm/dd/yy HH:MM" ),  ;001
	 DTTM2 = FORMAT (O.CURRENT_START_DT_TM, "MM/DD/YY HH:MM" ),
	E.ENCNTR_ID,
	 E_ENCNTR_TYPE_DISP = UAR_GET_CODE_DISPLAY (E.ENCNTR_TYPE_CD),
	EA.ACTIVE_IND,
	EA.ALIAS,
	EA.ENCNTR_ALIAS_TYPE_CD,
	EA.ENCNTR_ID,
	 F_FREQUENCY_DISP = UAR_GET_CODE_DISPLAY (F.FREQUENCY_CD),
	L.LONG_TEXT,
	L.LONG_TEXT_ID,
	O.CLINICAL_DISPLAY_LINE,
	O.CURRENT_START_DT_TM,
	O.ORDER_ID,
	O.ORDER_MNEMONIC,
	O.PRN_IND,
	 O_DEPT_STATUS_DISP = UAR_GET_CODE_DISPLAY (O.DEPT_STATUS_CD),
	 O_MED_ORDER_TYPE_DISP = UAR_GET_CODE_DISPLAY (O.MED_ORDER_TYPE_CD),
	 ORDERID = CNVTINT (O.ORDER_ID),
	OC.LONG_TEXT_ID,
	OC.ORDER_ID,
	P.NAME_FULL_FORMATTED,
	P.PERSON_ID,
	 P_SEX_DISP = UAR_GET_CODE_DISPLAY (P.SEX_CD),
	 DATEOFBIRTH = CNVTAGE (P.BIRTH_DT_TM),
	P1.NAME_FULL_FORMATTED,
	P1.PERSON_ID,
	P2.NAME_FULL_FORMATTED,
	EA1.ACTIVE_IND,
	EA1.ALIAS,
	EA1.ENCNTR_ALIAS_TYPE_CD,
	EA1.ENCNTR_ID
FROM ( PERSON  P ),
( CLINICAL_EVENT  C ),
( ORDERS  O ),
( ENCOUNTER  E ),
( ENCNTR_ALIAS  EA ),
( ENCNTR_ALIAS  EA1 ),
( PERSON  P1 ),
( PERSON  P2 ),
( ORDER_COMMENT  OC ),
( FREQUENCY_SCHEDULE  F ),
( ORDER_DETAIL  OD ),
( ENCNTR_PRSNL_RELTN  EP ),
( LONG_TEXT  L ),
( dummyt d),  ;003
( ADDRESS  FA )  ;001
 PLAN ( C
WHERE (C.EVENT_CLASS_CD IN ( MED_VAR ,
 TRANS_VAR ,
 IMMUN_VAR ))
 AND (C.EVENT_RELTN_CD= CHILD_VAR )
 AND (C.EVENT_END_DT_TM BETWEEN  CNVTDATETIME (BEG_DT_TM ) ;001
 AND  CNVTDATETIME ( END_DT_TM ))                          ;001
 and (c.valid_until_dt_tm > sysdate)  						;003
 AND (C.ENCNTR_ID=  REQUEST -> VISIT [ 1 ]-> ENCNTR_ID )
)  ; 97623709.00) ;
 AND ( P
WHERE (C.PERSON_ID=P.PERSON_ID))
 AND ( O
WHERE (O.ORDER_ID=C.ORDER_ID))
 AND ( E
WHERE (C.ENCNTR_ID=E.ENCNTR_ID))
 AND ( FA
WHERE (FA.PARENT_ENTITY_NAME="LOCATION" ) ;001
	AND (FA.PARENT_ENTITY_ID=E.LOC_FACILITY_CD) ;001
	AND (FA.ADDRESS_TYPE_CD= bus_addr_cd ) ;001
;	AND (FA.active_status_cd  = REQDATA->ACTIVE_STATUS_CD) ;001
	AND (FA.ACTIVE_IND= 1 );001
;004	and (fa.data_status_cd = 25))  ;003
	and (fa.end_effective_dt_tm = cnvtdatetime("31-dec-2100"))						;004
	AND (fa.active_status_cd  = REQDATA->ACTIVE_STATUS_CD )							;004
	AND (fa.ACTIVE_IND= 1 )															;004
    and (fa.updt_dt_tm = (select max(a3.updt_dt_tm) from address a3					;004
   						WHERE A3.PARENT_ENTITY_id = fa.PARENT_ENTITY_id				;004
						AND A3.PARENT_ENTITY_NAME=fa.PARENT_ENTITY_NAME				;004
						AND A3.ADDRESS_TYPE_CD= 754 								;004
						and a3.end_effective_dt_tm = cnvtdatetime("31-dec-2100")	;004
						AND A3.active_status_cd  = REQDATA->ACTIVE_STATUS_CD 		;004
						)   														;004
		))					   														;004
 
 
 AND ( EA
WHERE (EA.ENCNTR_ID=E.ENCNTR_ID) AND (EA.ENCNTR_ALIAS_TYPE_CD= FIN_VAR ) AND (EA.ACTIVE_IND= 1 )
     and (ea.end_effective_dt_tm > sysdate))   ;003
 AND ( EA1
WHERE (EA1.ENCNTR_ID=E.ENCNTR_ID) AND (EA1.ENCNTR_ALIAS_TYPE_CD= 1079.00 ) AND (EA1.ACTIVE_IND= 1 )
   and (ea1.end_effective_dt_tm > sysdate))   ;003
 AND ( P1
WHERE (P1.PERSON_ID=C.PERFORMED_PRSNL_ID))
 AND ( OD
WHERE (OD.ORDER_ID = C.ORDER_ID)
AND (OD.OE_FIELD_MEANING_ID = 2094 )
   and (od.action_sequence = (select max(od2.action_sequence) from order_detail od2		;003
   								where od2.order_id = od.order_id						;003
   								  and od2.OE_FIELD_MEANING_ID= 2094)))					;003
 AND ( F
WHERE ((f.frequency_id = OUTERJOIN(CNVTREAL(REPLACE(OD.oe_field_display_value,",",""))))))
 
 
;OUTERJOIN(cnvtreal(substring(1,
;IF(findstring(",",od.oe_field_display_value)>0) findstring(",",od.oe_field_display_value)-1
;ELSE 4 ENDIF, od.oe_field_display_value))))))
 
 AND ( EP
WHERE (EP.ENCNTR_ID= OUTERJOIN (O.ENCNTR_ID)) AND (EP.ENCNTR_PRSNL_R_CD= 1119 ) AND (EP.ACTIVE_IND=
 1 ) AND (EP.ACTIVE_STATUS_DT_TM IN (
(SELECT
 MAX (EP1.ACTIVE_STATUS_DT_TM)
FROM ( ENCNTR_PRSNL_RELTN  EP1 )
 
WHERE (EP1.ENCNTR_ID=EP.ENCNTR_ID) AND (EP1.ENCNTR_PRSNL_R_CD= 1119 ) AND (EP1.ACTIVE_IND= 1 )))))
 AND ( P2
WHERE (P2.PERSON_ID=EP.PRSNL_PERSON_ID))
and ( D)																				;003
AND ( OC																				;003
 WHERE (OC.ORDER_ID= O.ORDER_ID) 														;003
   AND (OC.COMMENT_TYPE_CD= COMMENT_VAR )												;003
   and (oc.action_sequence = (select max(oc2.action_sequence) from order_comment oc2	;003
   								where oc2.order_id = oc.order_id						;003
   								  and oc2.comment_type_cd = comment_var)))				;003
AND ( L																					;003
 WHERE (L.LONG_TEXT_ID= OC.LONG_TEXT_ID))												;003
;003   AND ( OC
;003   WHERE (OC.ORDER_ID= OUTERJOIN (O.ORDER_ID)) AND (OC.COMMENT_TYPE_CD= OUTERJOIN ( COMMENT_VAR )))
;003    AND ( L
;003   WHERE (L.LONG_TEXT_ID= OUTERJOIN (OC.LONG_TEXT_ID)))
 
ORDER BY O.PRN_IND,
 O_MED_ORDER_TYPE_DISP  DESC ,
O.ORDER_MNEMONIC,
C.PERFORMED_DT_TM
 
HEAD REPORT
 M_NUMLINES = 0 ,
 
SUBROUTINE   CCLRTF_PRINT  ( PAR_FLAG ,  PAR_XPIXEL ,  PAR_YOFFSET ,  PAR_NUMCOL ,  PAR_BLOB ,
 PAR_BLOBLEN ,  PAR_CHECK  )
 M_OUTPUT_BUFFER_LEN = 0 , BLOB_OUT = FILLSTRING ( 30000 , " " ), BLOB_BUF = FILLSTRING ( 200 , " "
), M_LINEFEED = CONCAT ( CHAR ( 10 )), NUMLINES = 0 , TEXTINDEX = 0 , NUMCOL = PAR_NUMCOL ,
 WHITEFLAG = 0 , YINCREMENT = 12 , YOFFSET = 0 ,
 CALL UAR_RTF ( PAR_BLOB ,  PAR_BLOBLEN ,  BLOB_OUT ,  SIZE ( BLOB_OUT ),  M_OUTPUT_BUFFER_LEN ,
 PAR_FLAG ), M_OUTPUT_BUFFER_LEN = MINVAL ( M_OUTPUT_BUFFER_LEN ,  SIZE ( TRIM ( BLOB_OUT ))),
IF ( ( M_OUTPUT_BUFFER_LEN > 0 ) )  M_CC = 1 ,
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
,  PAR_YOFFSET =( PAR_YOFFSET + YINCREMENT ),  NUMLINES =( NUMLINES + 1 ),  ROW + 1
ELSE   M_BLOBBUF = SUBSTRING ( M_CC ,  BLOB_LEN ,  BLOB_OUT ),
 CALL CCLRTF_PRINTLINE ( PAR_NUMCOL ,  BLOB_OUT ,  BLOB_LEN ,  PAR_CHECK )
ENDIF
,
IF ( ( M_CC2 >= M_OUTPUT_BUFFER_LEN ) )  M_CC = 0
ELSE   M_CC =( M_CC2 + 1 )
ENDIF
 
ELSE   BLOB_LEN =(( M_OUTPUT_BUFFER_LEN - M_CC )+ 1 ),  M_BLOBBUF = SUBSTRING ( M_CC ,  BLOB_LEN ,
 BLOB_OUT ),
 CALL CCLRTF_PRINTLINE ( PAR_NUMCOL ,  BLOB_OUT ,  BLOB_LEN ,  PAR_CHECK ),  M_CC = 0
ENDIF
 
 
ENDWHILE
 
ENDIF
, M_NUMLINES = NUMLINES
 
END ;Subroutine report
,
 
SUBROUTINE   CCLRTF_PRINTLINE  ( PAR_NUMCOL ,  BLOB_OUT ,  BLOB_LEN ,  PAR_CHECK  )
 TEXTINDEX = 0 , NUMCOL = PAR_NUMCOL , WHITEFLAG = 0 , PRINTCOL = 0 , ROWNUM = 0 , LASTLINE = 0 ,
 M_LINEFEED = CONCAT ( CHAR ( 10 )),
WHILE ( ( BLOB_LEN > 0 ))
 
IF ( ( BLOB_LEN <= PAR_NUMCOL ) )  NUMCOL = BLOB_LEN ,  LASTLINE = 1
ENDIF
, TEXTINDEX =( M_CC + PAR_NUMCOL ),
IF ( ( LASTLINE = 0 ) )  WHITEFLAG = 0 ,
WHILE ( ( WHITEFLAG = 0 ))
 
IF (  (( ( SUBSTRING ( TEXTINDEX ,  1 ,  BLOB_OUT )=" " ) )  OR  (( SUBSTRING ( TEXTINDEX ,  1 ,
 BLOB_OUT )= M_LINEFEED ) ))  )  WHITEFLAG = 1
ELSE   TEXTINDEX =( TEXTINDEX - 1 )
ENDIF
,
IF (  (( ( TEXTINDEX = M_CC ) )  OR  (( TEXTINDEX = 0 ) ))  )  TEXTINDEX =( M_CC + PAR_NUMCOL ),
 WHITEFLAG = 1
ENDIF
 
 
ENDWHILE
,  NUMCOL =(( TEXTINDEX - M_CC )+ 1 )
ENDIF
, M_BLOB_BUF = SUBSTRING ( M_CC ,  NUMCOL ,  BLOB_OUT ),
IF ( ( M_BLOB_BUF >" " ) )  NUMLINES =( NUMLINES + 1 ),  YOFFSET =( Y_POS + PAR_YOFFSET ),
IF (  PAR_CHECK  )
 CALL PRINT ( CALCPOS ( PAR_XPIXEL ,  YOFFSET )),
 CALL PRINT ( TRIM ( CHECK ( M_BLOB_BUF )))
ELSE
 CALL PRINT ( CALCPOS ( PAR_XPIXEL ,  YOFFSET )),
 CALL PRINT ( TRIM ( M_BLOB_BUF ))
ENDIF
,  PAR_YOFFSET =( PAR_YOFFSET + YINCREMENT ),  ROW + 1
ELSE   BLOB_LEN = 0
ENDIF
, M_CC =( M_CC + NUMCOL ),
IF ( ( BLOB_LEN > NUMCOL ) )  BLOB_LEN =( BLOB_LEN - NUMCOL )
ELSE   BLOB_LEN = 0
ENDIF
 
 
ENDWHILE
 
 
END ;Subroutine report
,
 Y_POS = 18 ,
 
SUBROUTINE   OFFSET  ( YVAL  )
 
 CALL PRINT ( FORMAT (( Y_POS + YVAL ), "###" ))
 
END ;Subroutine report
,
 NAME_FULL_FORMATTED1 = SUBSTRING ( 1 ,  35 , P.NAME_FULL_FORMATTED),
 NAME_FULL_FORMATTED2 = SUBSTRING ( 1 ,  40 , P2.NAME_FULL_FORMATTED),
 ALIAS1 = SUBSTRING ( 1 ,  8 , EA1.ALIAS),
 P_SEX_DISP1 = SUBSTRING ( 1 ,  10 ,  P_SEX_DISP ),
 ALIAS2 = SUBSTRING ( 1 ,  15 , EA.ALIAS),
 E_ENCNTR_TYPE_DISP1 = SUBSTRING ( 1 ,  25 ,  E_ENCNTR_TYPE_DISP ),
 E_LOCATION_NAME = TRIM ( SUBSTRING ( 4 ,  50 ,  UAR_GET_CODE_DESCRIPTION (E.LOC_FACILITY_CD)),  3 ),
 DISPLAY_BEG_DT_TM = FORMAT ( CNVTDATETIME ( BEG_DT_TM ), "MM/DD/YYYY;;D" ),  ;001
 DISPLAY_END_DT_TM = FORMAT ( CNVTDATETIME ( END_DT_TM ), "MM/DD/YYYY;;D" ),  ;001
 E_LOC_ADDR1 =FA.STREET_ADDR,                                                 ;001
;001 *****
IF ( (FA.CITY_CD> 0 ) )
	E_LOC_CITY = TRIM ( SUBSTRING ( 1 ,50 ,UAR_GET_CODE_DESCRIPTION (FA.CITY_CD)),  3 )
ELSE
	E_LOC_CITY = TRIM ( SUBSTRING ( 1 ,  50 , FA.CITY),  3 )
ENDIF
,
 
IF ( (FA.STATE_CD> 0 ) )
	E_LOC_STATE = TRIM ( SUBSTRING ( 1 ,  50 ,UAR_GET_CODE_DESCRIPTION (FA.STATE_CD)),  3 )
ELSE
	E_LOC_CITY = TRIM ( SUBSTRING ( 1 ,  50 , FA.CITY),  3 )
ENDIF
,
 
IF ( (FA.STREET_ADDR2>" " ) )
	E_LOC_ADDR2 = SUBSTRING ( 1 ,  50 ,  TRIM ( CONCAT ( TRIM (FA.STREET_ADDR2), " " ,
					TRIM ( E_LOC_CITY ), ", " ,
					TRIM ( E_LOC_STATE ), " " ,
					TRIM (FA.ZIPCODE)
)))
ELSE
	E_LOC_ADDR2 = SUBSTRING ( 1 ,  50 ,  TRIM ( CONCAT ( TRIM ( E_LOC_CITY ), ", " ,
					TRIM (E_LOC_STATE ), " " ,  TRIM (FA.ZIPCODE))))
ENDIF
,
;001 ***** END
"{F/0}{CPI/14}" ,
 COUNT = 0 ,
 ROW + 1 ,
"{F/1}{CPI/12}" ,
 
 CALL PRINT ( CALCPOS ( 36 , ( Y_POS + 43 ))),
; CALL PRINT ( CALCPOS ( 36 , ( Y_POS + 53 ))),  ;002
"Name:" ,
 ROW + 1 ,
"{F/1}{CPI/12}" ,
 ROW + 1 ,
 
 CALL PRINT ( CALCPOS ( 36 , ( Y_POS + 53 ))),
; CALL PRINT ( CALCPOS ( 36 , ( Y_POS + 63 ))),  ;002
"DOB/Sex:" ,
 
 CALL PRINT ( CALCPOS ( 36 , ( Y_POS + 63 ))),
; CALL PRINT ( CALCPOS ( 36 , ( Y_POS + 73 ))), ;002
"Admit Date:" ,
 ROW + 1 ,
"{F/1}" ,
 
 CALL PRINT ( CALCPOS ( 36 , ( Y_POS + 73 ))),
; CALL PRINT ( CALCPOS ( 36 , ( Y_POS + 83 ))),  ;002
"Attending:" ,
 
 CALL PRINT ( CALCPOS ( 72 , ( Y_POS + 43 ))),
; CALL PRINT ( CALCPOS ( 72 , ( Y_POS + 53 ))),  ;002
 NAME_FULL_FORMATTED1 ,
 ROW + 1 ,
"{F/0}{CPI/14}" ,
 
 CALL PRINT ( CALCPOS ( 94 , ( Y_POS + 53 ))),
; CALL PRINT ( CALCPOS ( 94 , ( Y_POS + 63 ))), ;002
P.BIRTH_DT_TM,
 ROW + 1 ,
"{F/0}" ,
 
 CALL PRINT ( CALCPOS ( 99 , ( Y_POS + 73 ))),
; CALL PRINT ( CALCPOS ( 99 , ( Y_POS + 83 ))), ;002
 NAME_FULL_FORMATTED2 ,
 ROW + 1 ,
"{F/0}" ,
 
 CALL PRINT ( CALCPOS ( 108 , ( Y_POS + 63 ))),
; CALL PRINT ( CALCPOS ( 108 , ( Y_POS + 73 ))), ;002
E.ARRIVE_DT_TM,
 ROW + 1 ,
"{CPI/14}" ,
 
 CALL PRINT ( CALCPOS ( 149 , ( Y_POS + 52 ))),
; CALL PRINT ( CALCPOS ( 149 , ( Y_POS + 62 ))), ;002
 P_SEX_DISP1 ,
 ROW + 1 ,
"{F/0}{CPI/14}" ,
 
; CALL PRINT ( CALCPOS ( 260 , ( Y_POS + 11 ))),  ;002
; "Mayo Clinic Health System" ,                   ;002
; ROW + 1 ,                                       ;002
 
 CALL PRINT ( CALCPOS ( 260 , ( Y_POS + 11 ))),
; CALL PRINT ( CALCPOS ( 260 , ( Y_POS + 21 ))),  ;002
 E_LOCATION_NAME ,
 ROW + 1 ,
 
 CALL PRINT ( CALCPOS ( 260 , ( Y_POS + 21 ))),   ;001
; CALL PRINT ( CALCPOS ( 260 , ( Y_POS + 31 ))),   ;002
 E_LOC_ADDR1 , 									  ;001
 ROW + 1 , 										  ;001
 
 CALL PRINT ( CALCPOS ( 260 , ( Y_POS + 31 ))), 	;001
; CALL PRINT ( CALCPOS ( 260 , ( Y_POS + 41 ))), 	;002
 E_LOC_ADDR2 , 										;001
 ROW + 1 , 											;001
"{F/1}" ,
 
 CALL PRINT ( CALCPOS ( 321 , ( Y_POS + 53 ))),
; CALL PRINT ( CALCPOS ( 321 , ( Y_POS + 63 ))), ;002
"FIN #:" ,
 ROW + 1 ,
"{F/1}" ,
 
 CALL PRINT ( CALCPOS ( 321 , ( Y_POS + 61 ))),
; CALL PRINT ( CALCPOS ( 321 , ( Y_POS + 71 ))), ;002
"Patient Type:" ,
 
 CALL PRINT ( CALCPOS ( 321 , ( Y_POS + 43 ))),
; CALL PRINT ( CALCPOS ( 321 , ( Y_POS + 53 ))), ;002
"MRN:" ,
 ROW + 1 ,
"{F/0}" ,
 
 CALL PRINT ( CALCPOS ( 357 , ( Y_POS + 43 ))),
; CALL PRINT ( CALCPOS ( 357 , ( Y_POS + 53 ))), ;002
 ALIAS1 ,
 
 CALL PRINT ( CALCPOS ( 361 , ( Y_POS + 52 ))),
; CALL PRINT ( CALCPOS ( 361 , ( Y_POS + 62 ))),  ;002
 ALIAS2 ,
 ROW + 1 ,
"{F/0}" ,
 
 CALL PRINT ( CALCPOS ( 399 , ( Y_POS + 61 ))),
; CALL PRINT ( CALCPOS ( 399 , ( Y_POS + 71 ))),  ;002
 E_ENCNTR_TYPE_DISP1 ,
 ROW + 1 ,
 ROW + 1 ,
"{F/0}" ,
 ROW + 1 ,
 
 CALL PRINT ( CALCPOS ( 232 , ( Y_POS + 99 ))),
 DISPLAY_BEG_DT_TM ,     ;001
 ROW + 1 ,
 
 CALL PRINT ( CALCPOS ( 300 , ( Y_POS + 99 ))), ;001
"to" , ;001
 ROW + 1 , ;001
 
 CALL PRINT ( CALCPOS ( 324 , ( Y_POS + 99 ))), ;001
 DISPLAY_END_DT_TM ,    ;001
 ROW + 1 ,
 Y_VAL =(( 792 - Y_POS )- 128 ),
"{PS/newpath 2 setlinewidth 20 " ,
 Y_VAL ,
" moveto 568 0 rlineto 0 12 neg rlineto " ,
" 568 neg 0 rlineto closepath stroke 20 " ,
 Y_VAL ,
" moveto /}" ,
 ROW + 1 ,
"{F/5}{CPI/11}" ,
 ROW + 1 ,
 
 CALL PRINT ( CALCPOS ( 272 , ( Y_POS + 120 ))),
"MAR History Report" ,  ;001
 ROW + 1 ,
 Y_POS =( Y_POS + 121 )
HEAD PAGE
 
IF ( ( CURPAGE > 1 ) )  Y_POS = 18
ENDIF
 
HEAD O.ORDER_MNEMONIC
 
IF ( (( Y_POS + 225 )>= 792 ) )  Y_POS = 0 , BREAK
ENDIF
, ORDER_MNEMONIC1 = SUBSTRING ( 1 ,  50 , O.ORDER_MNEMONIC), CLINICAL_DISPLAY_LINE1 = SUBSTRING ( 1
,  100 , O.CLINICAL_DISPLAY_LINE), DISPLAYFREQ = CONCAT ( TRIM ( CLINICAL_DISPLAY_LINE1 ), ", " ,
 TRIM ( F_FREQUENCY_DISP )), ROW + 1 ,"{F/1}{CPI/14}" ,
 CALL PRINT ( CALCPOS ( 36 , ( Y_POS + 11 ))), ORDER_MNEMONIC1 , ROW + 1 ,"{F/0}" ,
 CALL PRINT ( CALCPOS ( 47 , ( Y_POS + 20 ))), DISPLAYFREQ , ROW + 1 ,"{F/1}" ,
 CALL PRINT ( CALCPOS ( 60 , ( Y_POS + 29 ))),"Order Comments:" , ROW + 1 ,"{F/0}" ,
 CALL CCLRTF_PRINT ( 0 ,  151 ,  29 ,  75 , L.LONG_TEXT,  75 ,  1 ), Y_POS =( Y_POS +( M_NUMLINES *
 12 )), ROW + 1 , ROW + 1 ,"{F/0}" ,
 CALL PRINT ( CALCPOS ( 56 , ( Y_POS + 51 ))),"ACTION(S)" ,
 CALL PRINT ( CALCPOS ( 126 , ( Y_POS + 51 ))),"SCHEDULED TIME(S)" ,
 CALL PRINT ( CALCPOS ( 221 , ( Y_POS + 51 ))),"ADMINISTRATION TIME(S)" ,    ;001
 CALL PRINT ( CALCPOS ( 339 , ( Y_POS + 51 ))),"ADMIN DETAIL(S)" , ROW + 1 ,"{F/1}" , ROW + 1 ,
 CALL PRINT ( CALCPOS ( 454 , ( Y_POS + 50 ))),"(Order ID =" , ROW + 1 ,
 CALL PRINT ( CALCPOS ( 501 , ( Y_POS + 50 ))), ORDERID ,
 CALL PRINT ( CALCPOS ( 563 , ( Y_POS + 50 ))),")" , ROW + 1 , ROW + 1 , Y_VAL =(( 792 - Y_POS )-
 75 ),"{PS/newpath 1 setlinewidth   54 " , Y_VAL ," moveto  427 " , Y_VAL ," lineto stroke 54 " ,
 Y_VAL ," moveto/}" , ROW + 1 , Y_POS =( Y_POS + 54 )
DETAIL
 
IF ( (( Y_POS + 206 )>= 792 ) )  Y_POS = 0 , BREAK
ENDIF
,
 O_DEPT_STATUS_DISP1 = SUBSTRING ( 1 ,  15 ,  O_DEPT_STATUS_DISP ),
 DETAILS = CONCAT ( TRIM ( SUBSTRING ( 1 ,  30 , C.EVENT_TAG),  3 ), " " ,  TRIM ( SUBSTRING ( 1 ,
 30 , C.EVENT_TITLE_TEXT),  3 )),
 NAME_FULL_FORMATTED2 = SUBSTRING ( 1 ,  40 , P1.NAME_FULL_FORMATTED),
 ROW + 1 ,
"{F/1}{CPI/14}" ,
 ROW + 1 ,
 
 CALL PRINT ( CALCPOS ( 54 , ( Y_POS + 11 ))),
 
IF ( (C.RESULT_STATUS_CD!= 25 ) )  C_RESULT_STATUS_DISP
ELSE   O_DEPT_STATUS_DISP1
ENDIF
,
 ROW + 1 ,
 
 CALL PRINT ( CALCPOS ( 135 , ( Y_POS + 11 ))),
 DTTM2 ,
 ROW + 1 ,
 
 CALL PRINT ( CALCPOS ( 236 , ( Y_POS + 11 ))),
 DTTM ,
 ROW + 1 ,
 
 CALL PRINT ( CALCPOS ( 332 , ( Y_POS + 11 ))),
 DETAILS ,
 ROW + 1 ,
 ROW + 1 ,
"{F/0}" ,
 ROW + 1 ,
 
 CALL PRINT ( CALCPOS ( 337 , ( Y_POS + 25 ))),
"Perform:" ,
 ROW + 1 ,
 
 CALL PRINT ( CALCPOS ( 380 , ( Y_POS + 25 ))),
 NAME_FULL_FORMATTED2 ,
 Y_POS =( Y_POS + 38 )
FOOT  O.ORDER_MNEMONIC
 
IF ( (( Y_POS + 102 )>= 792 ) )  Y_POS = 0 , BREAK
ENDIF
, Y_POS =( Y_POS + 12 ), ROW + 1 , Y_VAL =(( 792 - Y_POS )- 21 ),"{PS/newpath 1 setlinewidth   32 "
, Y_VAL ," moveto  580 " , Y_VAL ," lineto stroke 32 " , Y_VAL ," moveto/}" , Y_POS =( Y_POS + 12 )
FOOT PAGE
 Y_POS = 690 ,
"{F/0}{CPI/14}" ,
 COUNT =( COUNT + 1 ),
 NAME_FULL_FORMATTED3 = SUBSTRING ( 1 ,  40 , P.NAME_FULL_FORMATTED),
 ROW + 1 ,
"{CPI/12}" ,
 
 CALL PRINT ( CALCPOS ( 20 , ( Y_POS + 28 ))),
 NAME_FULL_FORMATTED3 ,
 ROW + 1 ,
"{CPI/14}" ,
 ROW + 1 ,
 
 CALL PRINT ( CALCPOS ( 270 , ( Y_POS + 28 ))),
 COUNT ,
 ROW + 1 ,
 
 CALL PRINT ( CALCPOS ( 288 , ( Y_POS + 28 ))),
"Page#:" ,
 ROW + 1 ,
 ALIAS3 = SUBSTRING ( 1 ,  15 , EA.ALIAS),
 
 CALL PRINT ( CALCPOS ( 20 , ( Y_POS + 46 ))),
"FIN#:" ,
 
 CALL PRINT ( CALCPOS ( 51 , ( Y_POS + 46 ))),
 ALIAS3
 WITH  NOCOUNTER , MAXROW = 500 , MAXCOL = 300 , DIO = POSTSCRIPT , NULLREPORT  ;001
 ,outerjoin = d 	;003
 
  /*** START 002 ***
;*** After report put back to instance 1
IF(CURDOMAIN = "PROD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprb1'
ELSEIF(CURDOMAIN = "MHPRD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprb1'
ELSEIF(CURDOMAIN="MHCRT")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/java4t2@mhcrt1'
ENDIF ;CURDOMAIN
/*** END 002 ***/
 
/****Start 006 - New Code ***/
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
 
/***END 006 - New Code ***/
 
 
 END GO
 
