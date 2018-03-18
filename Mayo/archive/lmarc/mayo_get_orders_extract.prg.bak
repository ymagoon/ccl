DROP PROGRAM   MAYO_GET_ORDERS_EXTRACT  GO
CREATE PROGRAM  MAYO_GET_ORDERS_EXTRACT
prompt
	"Batch Name" = ""
	, "Start Date" = CURDATE
	, "Start time" = 0
	, "End Date" = CURDATE
	, "End Time" = 235959
 
with Batch_name, sdate, stime, edate, etime
 
DECLARE  TEMP_FILE_NAME  =  VC
 
DECLARE  TEMP_FILE_NAME2  =  VC
 
DECLARE  PDATE  =  VC
 
SET  PROG_NAME  =  "order_extract"
 
DECLARE  SHELL_START_DT_TM  =  DQ8
 
DECLARE  SHELL_STOP_DT_TM  =  DQ8
 
DECLARE  TEMP_DT_TM  =  DQ8
 
DECLARE  START_TIME  =  I4
 
DECLARE  STOP_TIME  =  I4
 
DECLARE  T_TIME  =  I4
 
DECLARE  P_CNT  =  I4
 
DECLARE  ACTUAL_SIZE  =  I4
 
DECLARE  Y  =  I4
 
DECLARE  X  =  I4
 
SET  SHELL_START_DT_TM  =  CNVTDATETIME ( CURDATE ,  CURTIME3 )
 
SET  START_TIME  =  CURTIME3
 
DECLARE  PROC_IND  =  I2  WITH  PUBLIC
 
RECORD  ENC  (
 1  QUAL [*]
 2  PERSON_ID  =  F8
 2  ENCNTR_ID  =  F8
 2  FIN_NBR  =  VC
 2  MRN  =  VC
 2  FILE_NAME  =  VC )
 
SELECT  INTO  "nl:"
EA.*
FROM ( ENCNTR_ALIAS  EA ),
( ENCOUNTER  E ),
( ENCNTR_ALIAS  EA1 )
 PLAN ( E
WHERE (E.REG_DT_TM BETWEEN  CNVTDATETIME ( CNVTDATE ( $SDATE ),  $STIME ) AND  CNVTDATETIME (
 CNVTDATE ( $EDATE ),  $ETIME )) AND  EXISTS (
(SELECT
O.ENCNTR_ID
FROM ( ORDERS  O )
 
WHERE (O.ENCNTR_ID=E.ENCNTR_ID) AND (O.TEMPLATE_ORDER_FLAG IN ( 0 ,
 1 )))) )
 AND ( EA
WHERE (EA.ENCNTR_ID=E.ENCNTR_ID) AND (EA.ENCNTR_ALIAS_TYPE_CD= 1077 ) AND (EA.ACTIVE_IND= 1 ) AND (
EA.END_EFFECTIVE_DT_TM> SYSDATE ))
 AND ( EA1
WHERE (EA1.ENCNTR_ID=E.ENCNTR_ID) AND (EA1.ENCNTR_ALIAS_TYPE_CD= 1079 ) AND (EA1.ACTIVE_IND= 1 )
 AND (EA1.END_EFFECTIVE_DT_TM> SYSDATE ))
 
 
HEAD REPORT
 ENC_CNT = 0
HEAD E.ENCNTR_ID
 ENC_CNT =( ENC_CNT + 1 ), STAT = ALTERLIST ( ENC -> QUAL ,  ENC_CNT ), ENC -> QUAL [ ENC_CNT ]->
 PERSON_ID =E.PERSON_ID, ENC -> QUAL [ ENC_CNT ]-> ENCNTR_ID =EA.ENCNTR_ID, ENC -> QUAL [ ENC_CNT ]
-> FIN_NBR =EA.ALIAS, ENC -> QUAL [ ENC_CNT ]-> MRN =EA1.ALIAS, ENC -> QUAL [ ENC_CNT ]-> FILE_NAME
= BUILD ( "order_extract_" ,  TRIM ( $BATCH_NAME ),  "_" ,  TRIM (EA.ALIAS))
 WITH  NOCOUNTER
 
FOR (  ZZ  =  1  TO  SIZE ( ENC -> QUAL ,  5 ) )
 
 EXECUTE PEL_GET_ORDERS  ENC -> QUAL [ ZZ ]-> FILE_NAME ,
 ENC -> QUAL [ ZZ ]-> ENCNTR_ID
 
ENDFOR
 
 
 CALL ECHORECORD ( ENC )
 
SET  SHELL_STOP_DT_TM  =  CNVTDATETIME ( CURDATE ,  CURTIME3 )
 
SET  STOP_TIME  =  CURTIME3
 
SET  TEMP_FILE_NAME  =  CONCAT ( "mayolog" ,  TRIM ( PROG_NAME ),  TRIM ( $BATCH_NAME ),  TRIM (
 FORMAT ( TEMP_DT_TM ,  "hhmmsscc;;d" )),  "log" )
 
SET  TEMP_FILE_NAME2  =  CONCAT ( TRIM ( PROG_NAME ),  TRIM ( $BATCH_NAME ),  "plist_" ,  TRIM (
 FORMAT ( TEMP_DT_TM ,  "hhmmsscc;;d" )),  "log" )
 
SET  PDATE  =  CONCAT ( FORMAT ( CNVTDATETIME ( CNVTDATE ( $SDATE ),  $STIME ),
 "mm/dd/yyyy hh:mm:ss;;d" ),  " - " ,  FORMAT ( CNVTDATETIME ( CNVTDATE ( $EDATE ),  $ETIME ),
 "mm/dd/yyyy hh:mm:ss;;d" ))
 
SELECT  INTO  VALUE ( TEMP_FILE_NAME )
 D_START_DT = FORMAT ( SHELL_START_DT_TM ,  "hh:mm:ss:cc;;d" ),
 D_STOP_DT = FORMAT ( SHELL_STOP_DT_TM ,  "hh:mm:ss:cc;;d" ),
 PERSON_ID = ENC -> QUAL [D.SEQ]-> PERSON_ID ,
 ENCNTR_ID = ENC -> QUAL [D.SEQ]-> ENCNTR_ID ,
 D_ENCNTR_CNT = SIZE ( ENC -> QUAL ,  5 )
FROM ( DUMMYT  D  WITH  SEQ = SIZE ( ENC -> QUAL ,  5 ))
 PLAN ( D )
 
ORDER BY  PERSON_ID ,
 ENCNTR_ID
 
HEAD REPORT
 P_CNT = 0 ,
 D_CNT = 0
HEAD  PERSON_ID
 P_CNT =( P_CNT + 1 )
DETAIL
 D_CNT =( D_CNT + 1 )
FOOT REPORT
 ACTUAL_SIZE = P_CNT ,
 COL  0 ,
 "start time = " ,
 COL + 2 ,
 D_START_DT ,
 ROW + 1 ,
 COL  0 ,
 "stop time = " ,
 COL + 2 ,
 D_STOP_DT ,
 ROW + 1 ,
 COL  0 ,
 "patients processed = " ,
 COL + 1 ,
 P_CNT ,
 ROW + 1 ,
 COL  0 ,
 "Encounter processed = " ,
 COL + 1 ,
 D_CNT ,
 ROW + 1 ,
 COL  0 ,
 "parameter dates =" ,
 COL + 1 ,
 PDATE ,
 ROW + 2
 WITH  NOCOUNTER
 
SELECT  INTO  VALUE ( TEMP_FILE_NAME2 )
 MRN = SUBSTRING ( 1 ,  40 ,  ENC -> QUAL [D.SEQ]-> MRN ),
 FNBR = SUBSTRING ( 1 ,  40 ,  ENC -> QUAL [D.SEQ]-> FIN_NBR )
FROM ( DUMMYT  D  WITH  SEQ = SIZE ( ENC -> QUAL ,  5 ))
 PLAN ( D )
 
 
HEAD REPORT
 COL  0 ,
 "mrn,fnbr" ,
 ROW + 1 ,
 DISP_LINE = FILLSTRING ( 100 ,  " " )
DETAIL
 DISP_LINE = CONCAT ( TRIM ( MRN ,  3 ),  "," ,  TRIM ( FNBR ,  3 )),
 COL  0 ,
 DISP_LINE ,
 ROW + 1
 WITH  NOCOUNTER , FORMAT = VARIABLE
 
 CALL ECHO ( CONCAT ( "start time = " ,  FORMAT ( SHELL_START_DT_TM ,  "hh:mm:ss:cc;;d" )))
 
 CALL ECHO ( CONCAT ( "stop time = " ,  FORMAT ( SHELL_STOP_DT_TM ,  "hh:mm:ss:cc;;d" )))
 
 CALL ECHO ( BUILD ( "patients processed = " ,  ACTUAL_SIZE ))
 
SET  T_TIME  = ( STOP_TIME - START_TIME )
 
SET  H1  =  FLOOR (( T_TIME / 360000 ))
 
SET  M1  =  FLOOR (( T_TIME / 6000 ))
 
SET  S1  =  FLOOR (( T_TIME / 100 ))
 
SET  C1  =  MOD ( T_TIME ,  100 )
 
 CALL ECHO ( "***************************************************" )
 
 CALL ECHO ( "Days.hh.mm.ss" )
 
 CALL ECHO ( FORMAT ( DATETIMEDIFF ( SHELL_STOP_DT_TM ,  SHELL_START_DT_TM ,  8 ),  "####.##.##.##"
))
 
 CALL ECHO ( "***************************************************" )
 
 CALL ECHO ( STOP_TIME )
 
 CALL ECHO ( START_TIME )
 
 CALL ECHO ( T_TIME )
 
 CALL ECHO ( M1 )
 
 CALL ECHO ( S1 )
 
SET  H2  =  FORMAT ( H1 ,  "##;P0" )
 
 CALL ECHO ( BUILD ( FORMAT ( H1 ,  "##;P0" ),  ":" ,  FORMAT ( M1 ,  "##;P0" ),  ":" ,  FORMAT (
 S1 ,  "##;P0" ),  ":" ,  FORMAT ( C1 ,  "##;P0" )))
 END GO
