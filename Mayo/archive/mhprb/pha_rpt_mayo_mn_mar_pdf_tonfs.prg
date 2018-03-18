;*** Generated by translate command; please verify contents before re-including in CCL ***
/*******************************************************************
Report Name:  Custome Downtime MAR that write to NFS in pDF format
Report Description: This report is used for Phamracy downtimes MAR reports
 
Created by: Shan Ramalingam
Created date:  10/26/2009
 
;001 akcpel     Rebranding, increase room size to 5
; *002 02/28/13 Akcia                Modify to use DB2 with lookup password in registry
 
 
*******************************************************************/
set trace backdoor p30ins go
DROP PROGRAM   PHA_RPT_MAYO_MN_MAR_PDF_TONFS : DBA  GO
CREATE PROGRAM  PHA_RPT_MAYO_MN_MAR_PDF_TONFS : DBA
 
/*** Start 002 - New Code ****/
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
/*** END 002 - New Code ***/
 
IF (  NOT ( VALIDATE ( REPLY ,  0 ) ) )
RECORD  REPLY  (
 1  ELAPSED_TIME  =  F8
 1  STATUS_DATA
 2  STATUS  =  C1
 2  SUBEVENTSTATUS [ 1 ]
 3  OPERATIONNAME  =  C25
 3  OPERATIONSTATUS  =  C1
 3  TARGETOBJECTNAME  =  C25
 3  TARGETOBJECTVALUE  =  VC )
ENDIF
 
 
RECORD  O_ERRORS  (
 1  ERR_CNT  =  I4
 1  ERR [*]
 2  ERR_CODE  =  I4
 2  ERR_MSG  =  VC )
 
DECLARE  FREETEXT_STR  =  VC  WITH  PROTECT , NOCONSTANT ( " " )
 
DECLARE  STRENGTH_STR  =  VC  WITH  PROTECT , NOCONSTANT ( " " )
 
DECLARE  TRIM_FAC  =  VC  WITH  PROTECT , NOCONSTANT ( " " )
 
SET  ERRCODE  =  1
 
SET  ERRMSG  =  FILLSTRING ( 78 ,  " " )
 
SET  ERRCNT  =  0
 
SET  LINE1  =  FILLSTRING ( 131 ,  "-" )
 
SET  LINE2  =  FILLSTRING ( 131 ,  "=" )
 
SET  ENDPAGE  =  FILLSTRING ( 131 ,  "-" )
 
SET  ICNT1  =  0
 
SET  ICNT2  =  0
 
SET  INGCNT  =  0
 
SET  PRSNL_USER  =  FILLSTRING ( 10 ,  " " )
 
SET  REASON_FOR_VISIT  =  FILLSTRING ( 50 ,  " " )
 
SELECT  INTO  "NL:"
P.USERNAME
FROM ( PRSNL  P )
 
WHERE (P.PERSON_ID= DATA -> RUN_USER_ID )
 
DETAIL
 PRSNL_USER =P.USERNAME
 WITH  NOCOUNTER
 
DECLARE  UAR_GET_CODE_DESCRIPTION ( P1 ) =  C60
 
DECLARE  UAR_GET_CODE_DISPLAY ( P1 ) =  C40
 
RECORD  ALLERGY  (
 1  DATA [*]
 2  PERSON_ID  =  F8
 2  ENCNTR_ID  =  F8
 2  DETAILS [*]
 3  ALLERGY_ID  =  F8
 3  ALLERGY_INSTANCE_ID  =  F8
 3  NOMENCLATURE_ID  =  F8
 3  DESCRIPTION  =  VC )
 
FREE SET INGREDS
 
RECORD  INGREDS  (
 1  DATA [*]
 2  BRAND  =  C22 )
 
SELECT  DISTINCT  INTO  "NL:"
FP.PERSON_ID,
FP.ENCNTR_ID
FROM ( FILL_PRINT_ORD_HX  FP )
 
WHERE (FP.RUN_ID= DATA -> RUN_ID ) AND (FP.PERSON_ID> 0 ) AND (FP.ENCNTR_ID> 0 )
ORDER BY FP.PERSON_ID,
FP.ENCNTR_ID
 
HEAD FP.PERSON_ID
 ICNT1 =( ICNT1 + 1 ), STAT = ALTERLIST ( ALLERGY -> DATA ,  ICNT1 ), ALLERGY -> DATA [ ICNT1 ]->
 PERSON_ID =FP.PERSON_ID, ALLERGY -> DATA [ ICNT1 ]-> ENCNTR_ID =FP.ENCNTR_ID
DETAIL
 X = 1
 WITH  NOCOUNTER
 
 EXECUTE PHA_GET_MAR_ALLERGY
 
SET  PRINTFILE  =  CONCAT ( "mhs_ops:phamar_" ,  TRIM ( CNVTSTRING ( DATA -> RUN_ID )),  ".dat" )
 
SELECT  INTO  VALUE ( PRINTFILE )
 SORT_THINGY =
IF ( (PO.ORD_TYPE= 2 ) AND (PO.PRN_IND= 0 ) )  2
ELSEIF ( (PO.ORD_TYPE IN ( 0 ,
 1 ,
 3 )) AND (PO.PRN_IND= 0 ) )  1
ELSE   4
ENDIF
,
 FREQ_DESC = UAR_GET_CODE_DESCRIPTION (PO.FREQUENCY_CD),
 MEDREC_NBR = SUBSTRING ( 1 ,  30 , PO.MEDREC_NBR),
 NOTE_TEXT1 = SUBSTRING ( 1 ,  1000 , LT1.LONG_TEXT),
 NOTE_TEXT2 = SUBSTRING ( 1 ,  1000 , LT2.LONG_TEXT),
 LOC_STR = SUBSTRING ( 1 ,  10 , PO.LOCATION_S),
 ROOM_STR = SUBSTRING ( 1 ,  10 , PO.ROOM_S),
 BED_STR = SUBSTRING ( 1 ,  10 , PO.BED_S),
;001 ROOM_BED = CONCAT ( TRIM ( SUBSTRING ( 1 ,  4 , PO.ROOM_S)),  "-" ,  TRIM ( SUBSTRING ( 1 ,  2 ,
 ROOM_BED = CONCAT ( TRIM ( SUBSTRING ( 1 ,  5 , PO.ROOM_S)),  "-" ,  TRIM ( SUBSTRING ( 1 ,  2 ,;001
PO.BED_S))),
 LOC_ROOM_BED = CONCAT ( TRIM ( SUBSTRING ( 1 ,  10 , PO.LOCATION_S)),  " " ,  TRIM ( SUBSTRING ( 1
;001,  4 , PO.ROOM_S)),  "-" ,  TRIM ( SUBSTRING ( 1 ,  2 , PO.BED_S))),
,  5 , PO.ROOM_S)),  "-" ,  TRIM ( SUBSTRING ( 1 ,  2 , PO.BED_S))),;001
 ADMIN_STR =PO.ADMIN_DT_TM "mm/dd/yy hh:mm:ss"
,
 ADMIN_TIME = CNVTINT ( SUBSTRING ( 10 ,  4 ,  FORMAT (PO.ADMIN_DT_TM,  "mm/dd/yy hhmm" ))),
 ROUTE_DESC = UAR_GET_CODE_DESCRIPTION (PO.ROUTE_CD),
 ORD_SEQ = BUILD (PO.ORDER_ID, PO.IV_IN_SEQ),
 BAG_SEQ = BUILD (PO.ORDER_ID, PO.BAG_NBR),
 ORD_ADM = BUILD (PO.ORDER_ID,  SUBSTRING ( 10 ,  4 ,  FORMAT (PO.ADMIN_DT_TM,  "mm/dd/yy hhmm" ))),
E.REASON_FOR_VISIT,
 BAG_FREQ = UAR_GET_CODE_DESCRIPTION (OI.FREQ_CD),
 SOFT_STOP = CNVTDATETIME (O.SOFT_STOP_DT_TM),
 ADMIN_DT_TM = CNVTDATETIME (PO.ADMIN_DT_TM),
 PERSON_SORT = BUILD (PO.PERSON_NAME_S, PO.PERSON_ID),
 ALPHA_SORT = BUILD (PO.ORD_DESC, PO.ORDER_ID, PO.IV_IN_SEQ)
FROM ( FILL_PRINT_ORD_HX  PO ),
( LONG_TEXT  LT1 ),
( LONG_TEXT  LT2 ),
( ENCOUNTER  E ),
( DUMMYT  D ),
( DUMMYT  D2 ),
( ORDER_INGREDIENT  OI ),
( ORDERS  O ),
( ORDER_DISPENSE  OD ),
( FREQUENCY_SCHEDULE  FS )
 PLAN ( PO
WHERE ( DATA -> RUN_ID =PO.RUN_ID))
 AND ( FS
WHERE (FS.FREQUENCY_CD=PO.FREQUENCY_CD) AND  (( (FS.FREQ_QUALIFIER= 14 ) )  OR  ((FS.FREQ_QUALIFIER=
 0 ) )) )
 AND ( O
WHERE (PO.ORDER_ID=O.ORDER_ID))
 AND ( OD
WHERE (PO.ORDER_ID=OD.ORDER_ID))
 AND ( OI
WHERE (PO.ORDER_ID=OI.ORDER_ID) AND (OD.LAST_VER_INGR_SEQ=OI.ACTION_SEQUENCE) AND (PO.INGRED_SEQ=
OI.COMP_SEQUENCE))
 AND ( E
WHERE (E.ENCNTR_ID=PO.ENCNTR_ID))
 AND ( D )
 AND ( LT1
WHERE (PO.LABEL1_ID=LT1.LONG_TEXT_ID))
 AND ( D2 )
 AND ( LT2
WHERE (PO.LABEL2_ID=LT2.LONG_TEXT_ID))
 
ORDER BY  LOC_ROOM_BED ,
 PERSON_SORT ,
 SORT_THINGY ,
 ALPHA_SORT ,
 ORD_SEQ ,
PO.INGRED_SEQ,
 ADMIN_DT_TM
 
HEAD REPORT
 PAGENUM = 0 ,
 PAGE_BREAK = 0 ,
 ORD_BREAK = 0 ,
 PRN_BREAK = 0 ,
 END_RUN = 0 ,
 ORD_START_ROW = 0 ,
 NOTE_START_ROW = 0 ,
 ORD_LINE = FILLSTRING ( 116 ,  "_" ),
 FLRSTK = 0 ,
 NCOUNT = 0 ,
 N2COUNT = 0 ,
 NEWC = 0 ,
 COL_START = 0 ,
 CHARS_PER_LINE = 0 ,
 NNOTECNT = 0 ,
 
MACRO ( PRINT_OVERLAY )
 "{f/0/1}{lpi/6}{cpi/16}" ,
 ROW + 1 ,
 "{pos/000/30}" ,
 ROW + 1 ,
 TRIM_FAC = TRIM ( SUBSTRING ( 4 ,  60 ,  UAR_GET_CODE_DESCRIPTION (E.LOC_FACILITY_CD)),  3 ),
 
 CALL CENTER ( TRIM_FAC ,  0 ,  120 ),
 COL  107 ,
 "Page: " ,
 PAGENUM  "###;l"
,
 COL + 2 ,
 "(cont.)" ,
 ROW + 1 ,
 
 CALL CENTER ( "MEDICATION ADMINISTRATION RECORD" ,  0 ,  120 ),
 ROW + 1 ,
 ROW + 1 ,
;001 RM_STRING = SUBSTRING ( 1 ,  4 , PO.ROOM_S),
 RM_STRING = SUBSTRING ( 1 ,  5 , PO.ROOM_S), ;001
 BED_STRING = SUBSTRING ( 1 ,  2 , PO.BED_S),
 DSTRING = CONCAT ( TRIM ( RM_STRING ),  "/" ,  TRIM ( BED_STRING )),
 SDOCTOR = TRIM ( SUBSTRING ( 1 ,  40 , PO.ATTEND_PHYS_NAME)),
 COL  10 ,
 "Physician: " ,
 SDOCTOR ,
 COL  55 ,
 "| Room/Bed No: " ,
 DSTRING ,
 COL  84 ,
 "|  {b}Name: {endb}" ,
PO.PERSON_NAME_S,
 ROW + 1 ,
 COL  96 ,
 "{b}Medical Record #: {endb}" ,
 MEDREC_STR = TRIM ( MEDREC_NBR ),
 MEDREC_STR ,
 ROW + 1 ,
 COL  87 ,
 "Financial #: " ,
PO.FINNBR,
 ROW  - ( 1 ),
 COL  10 ,
 "{b}Allergies: {endb}" ,
 ALG = FILLSTRING ( 500 ,  " " ),
 
FOR (  X  =  1  TO  SIZE ( ALLERGY -> DATA ,  5 ) )
 
IF ( (PO.PERSON_ID= ALLERGY -> DATA [ X ]-> PERSON_ID ) )
IF ( ( SIZE ( ALLERGY -> DATA [ X ]-> DETAILS ,  5 )> 0 ) )
FOR (  Y  =  1  TO  SIZE ( ALLERGY -> DATA [ X ]-> DETAILS ,  5 ) )
 
IF ( ( Y = 1 ) )  ALG = TRIM ( ALLERGY -> DATA [ X ]-> DETAILS [ Y ]-> DESCRIPTION )
ELSE   ALG = CONCAT ( TRIM ( ALG ),  "," ,  TRIM ( ALLERGY -> DATA [ X ]-> DETAILS [ Y ]->
 DESCRIPTION ))
ENDIF
 
 
ENDFOR
 
ENDIF
 
ENDIF
 
 
ENDFOR
,
 TOTALALGSIZE = 0 ,
 TOTALALGSIZE = SIZE ( TRIM ( ALG )),
 
IF ( ( TOTALALGSIZE = 0 ) )  "NKDA" ,  ROW + 1
ELSE   FIRSTROWWIDTH = 62 ,  SUBSEQUENTROWWIDTH = 73 ,  MAXIMUMALGROWS = 3 ,  ALGROWWIDTH =
 FIRSTROWWIDTH ,  ALGROWCOUNT = 1 ,  WARNING = " See Patient Chart" ,
WHILE ( ( ALGROWCOUNT <= MAXIMUMALGROWS ))
 
IF ( ( TOTALALGSIZE <= ALGROWWIDTH ) )  ALG2 = FILLSTRING ( 55 ,  " " ),  ALG2 = SUBSTRING ( 1 ,
 TOTALALGSIZE ,  ALG ),  ALG2 = CNVTUPPER ( TRIM ( ALG2 )),  ALG2 ,  ROW + 1 ,  ALGROWCOUNT = 99
ELSE   ALGLINE = FILLSTRING ( 55 ,  " " ),  ALGLINE = SUBSTRING ( 1 ,  ALGROWWIDTH ,  ALG ),
 COMMAPOSITION = FINDSTRING ( "," ,  ALGLINE ,  1 ,  1 ),
IF ( ( COMMAPOSITION = 0 ) )
IF ( ( SUBSEQUENTROWWIDTH > ALGROWWIDTH ) AND ( ALGROWCOUNT < MAXIMUMALGROWS ) AND ( TOTALALGSIZE <=
 SUBSEQUENTROWWIDTH ) )  ROW + 1 ,  COL  10 ,  ALGROWCOUNT =( ALGROWCOUNT + 1 ),  ALGROWWIDTH =
 SUBSEQUENTROWWIDTH
ELSE   ROW + 1 ,  COL  10 ,  WARNING ,  ALGROWCOUNT = 99
ENDIF
 
ELSE   ALGLINE = SUBSTRING ( 1 ,  COMMAPOSITION ,  ALG ),  ALG = SUBSTRING (( COMMAPOSITION + 2 ),
 TOTALALGSIZE ,  ALG ),  TOTALALGSIZE = SIZE ( TRIM ( ALG )),  ALGLINE1 = CNVTUPPER ( ALGLINE ),
 ALGLINE1 ,  ROW + 1 ,  COL  10 ,  ALGROWCOUNT =( ALGROWCOUNT + 1 ),  ALGROWWIDTH =
 SUBSEQUENTROWWIDTH
ENDIF
 
ENDIF
 
 
ENDWHILE
 
ENDIF
,
 ROW  8 ,
 ROW + 1 ,
 COL  10 ,
 "Reason for Visit: " ,
 
IF ( ( REASON_FOR_VISIT > " " ) )  REASON_FOR_VISIT
ELSE   "no reason entered"
ENDIF
,
 ROW + 1 ,
 COL  10 ,
 "Admitted: " ,
PO.ADMIT_DT_TM "mm/dd/yyyy;;dL"
,
 COL  87 ,
 "Birthdate: " ,
PO.BIRTH_DT_TM "MM/DD/YYYY;;dL"
,
 ROW + 1 ,
 COL  10 ,
 FHEIGHT = FORMAT (PO.HEIGHT,  "#####.###" ),
 HEIGHT_UNIT = CONCAT ( FHEIGHT ,  " " ,  SUBSTRING ( 1 ,  5 , PO.HEIGHT_UNIT_S)),
 SHEIGHT = CONCAT ( "Height: " ,  HEIGHT_UNIT ),
 SHEIGHT ,
 COL + 1 ,
 FWEIGHT = FORMAT (PO.WEIGHT,  "#####.###" ),
 WEIGHT_UNIT = CONCAT ( FWEIGHT ,  " " ,  SUBSTRING ( 1 ,  5 , PO.WEIGHT_UNIT_S)),
 SWEIGHT = CONCAT ( "Weight: " ,  WEIGHT_UNIT ),
 SWEIGHT ,
 COL  87 ,
 AGE = CNVTAGE (PO.BIRTH_DT_TM),
 AGE_STR = CONCAT ( "Age: " ,  AGE ),
 AGE_STR ,
 SEX_ST = CONCAT ( "Sex: " ,  TRIM ( SUBSTRING ( 1 ,  8 , PO.SEX_S))),
 COL + 1 ,
 SEX_ST ,
 ROW + 1 ,
 ROW + 1 ,
 COL  10 ,
 "Printed: " ,
 CURDATE  "mm/dd/yyyy;;d"
,
 " " ,
 CURTIME  "hh:mm;;mr"
,
 COL  75 ,
 "{b}24 Hour Medication Check:" ,
 ROW + 1 ,
 WKDAY = FILLSTRING ( 9 ,  " " ),
 
CASE (  WEEKDAY ( DATA -> CYC_FROM_DT_TM ) )
 OF  1 :  WKDAY = "MONDAY"
 OF  2 :  WKDAY = "TUESDAY"
 OF  3 :  WKDAY = "WEDNESDAY"
 OF  4 :  WKDAY = "THURSDAY"
 OF  5 :  WKDAY = "FRIDAY"
 OF  6 :  WKDAY = "SATURDAY"
 OF  7 :  WKDAY = "SUNDAY"
 ENDCASE
,
 MONTH = FILLSTRING ( 10 ,  " " ),
 
CASE (  MONTH ( DATA -> CYC_FROM_DT_TM ) )
 OF  1 :  MONTH = "JANUARY"
 OF  2 :  MONTH = "FEBRUARY"
 OF  3 :  MONTH = "MARCH"
 OF  4 :  MONTH = "APRIL"
 OF  5 :  MONTH = "MAY"
 OF  6 :  MONTH = "JUNE"
 OF  7 :  MONTH = "JULY"
 OF  8 :  MONTH = "AUGUST"
 OF  9 :  MONTH = "SEPTEMBER"
 OF  10 :  MONTH = "OCTOBER"
 OF  11 :  MONTH = "NOVEMBER"
 OF  12 :  MONTH = "DECEMBER"
 ENDCASE
,
 DAYYR = FORMAT ( DATA -> CYC_FROM_DT_TM ,  "DD,YYYY;;d" ),
 FULLDATE = CONCAT ( TRIM ( WKDAY ),  " " ,  TRIM ( MONTH ),  " " ,  DAYYR ),
 COL  10 ,
 "{b}{cpi/9}" ,
 FULLDATE ,
 "{endb}{cpi/16}" ,
 COL  77 ,
 "Site Code / Omitted Doses / Effectiveness / Relief" ,
 COL  65 ,
 "START/" ,
 ROW + 1 ,
 COL  18 ,
 
IF ( (PO.PRN_IND= 1 ) )  "PRN MEDICATIONS"
ELSEIF ( (PO.ORD_TYPE IN ( 0 ,
 1 ,
 3 )) )  "SCHEDULED MEDICATIONS"
ELSEIF ( (PO.ORD_TYPE= 2 ) )  "CONTINUOUS MEDICATIONS"
ENDIF
,
 COL  64 ,
 "STOP" ,
 COL  74 ,
 "0001 to 0700" ,
 COL  93 ,
 "0701 to 1500" ,
 COL  112 ,
 "1501 to 2400" ,
 ROW + 1 ,
 "{pos/000/112}" ,
 ROW + 1 ,
 ROW_CNT = 0 ,
 "{f/0/1}{lpi/6}{cpi/18}" ,
 ROW + 1 ,
 "{pos/55/76}{box/131/6/1}" ,
 ROW + 1 ,
 "{pos/55/76}{box/131/3/1}" ,
 ROW + 1 ,
 "{pos/55/124}{box/83/2/1}" ,
 ROW + 1 ,
 "{pos/55/182}{box/131/37/1}" ,
 ROW + 1 ,
 "{pos/55/182}{box/131/3/1}" ,
 ROW + 1 ,
 "{pos/55/182}{box/56/37/1}" ,
 ROW + 1 ,
 "{pos/55/182}{box/69/37/1}" ,
 ROW + 1 ,
 "{pos/335/206}{box/61/35/1}" ,
 ROW + 1 ,
 "{pos/335/206}{box/19/35/1}" ,
 ROW + 1 ,
 "{pos/335/206}{box/40/35/1}" ,
 ROW + 1 ,
 "{f/1/1}{lpi/9}{cpi/22}{pos/55/630}" ,
 ROW + 1 ,
 COL  13 ,
 "OMISSION CODES:" ,
 COL  63 ,
 "INJECTION SITES IM/SC" ,
 COL  114 ,
 "EVALUATION:" ,
 ROW + 1 ,
 COL  13 ,
 "N = NPO" ,
 COL  114 ,
 "E = EFFECTIVE   I = INEFFECTIVE, SEE NOTES" ,
 ROW + 1 ,
 COL  13 ,
 "R = PATIENT REFUSED" ,
 COL  57 ,
 "      LD         RD         LLQ         RLQ" ,
 COL  114 ,
 "P = PENDING" ,
 ROW + 1 ,
 COL  13 ,
 "H = HELD" ,
 COL  57 ,
 "      LG         RG         LUQ         RUQ" ,
 ROW + 1 ,
 COL  13 ,
 "* = TAKEN AT HOME" ,
 COL  57 ,
 "      LL         RL                  " ,
 COL  114 ,
 "NOTE: FOR ADVERSE DRUG REACTIONS FOLLOW POLICY." ,
 ROW + 1 ,
 "{f/0/1}{lpi/6}{cpi/16}{pos/55/676}{box/116/2/1}" ,
 ROW + 1 ,
 "{pos/55/676}{box/24/2/1}" ,
 ROW + 1 ,
 "{pos/55/676}{box/30/2/1}" ,
 ROW + 1 ,
 "{pos/55/676}{box/38/2/1}" ,
 ROW + 1 ,
 "{pos/55/676}{box/24/4/1}" ,
 ROW + 1 ,
 "{pos/55/676}{box/30/4/1}" ,
 ROW + 1 ,
 "{pos/55/676}{box/38/4/1}" ,
 ROW + 1 ,
 "{pos/55/676}{box/64/2/1}" ,
 ROW + 1 ,
 "{pos/55/676}{box/70/2/1}" ,
 ROW + 1 ,
 "{pos/55/676}{box/78/2/1}" ,
 ROW + 1 ,
 "{pos/55/676}{box/64/4/1}" ,
 ROW + 1 ,
 "{pos/55/676}{box/70/4/1}" ,
 ROW + 1 ,
 "{pos/55/676}{box/78/4/1}" ,
 ROW + 1 ,
 "{pos/55/676}{box/102/2/1}" ,
 ROW + 1 ,
 "{pos/55/676}{box/109/2/1}" ,
 ROW + 1 ,
 "{pos/55/676}{box/116/2/1}" ,
 ROW + 1 ,
 "{pos/55/676}{box/102/4/1}" ,
 ROW + 1 ,
 "{pos/55/676}{box/109/4/1}" ,
 ROW + 1 ,
 "{pos/55/676}{box/116/4/1}" ,
 ROW + 1 ,
 "{pos/59/680}" ,
 "PRINT FULL NAME" ,
 COL + 10 ,
 "TITLE" ,
 COL + 1 ,
 "INITIAL" ,
 ROW + 1 ,
 ROW + 4 ,
 COL  10 ,
 TRIM_FAC ,
 ROW + 1 ,
 COL  10 ,
;001 "Mayo Health System" ,
 "Mayo Clinic Health System" ,   ;001
 ROW + 1 ,
 THE_LINE = FILLSTRING ( 117 ,  "_" ),
 "{pos/58/684}" ,
 THE_LINE ,
 "{f/0/1}{lpi/6}{cpi/16}{pos/000/552}" ,
 ROW + 2 ,
 "{pos/000/224}" ,
 ROW + 1
ENDMACRO
,
 INCMOD = "003 4/6/5" ,
 ODD_EVEN = "E" ,
 COL_START = 0 ,
 CHARS_PER_LINE = 0 ,
 
MACRO ( FORM_FEED )
 ROW_CNT = 0 ,
 PAGE_BREAK = 1 ,
 ORD_PAGE_CNT = 0 ,
BREAK
ENDMACRO
,
 
MACRO ( FEED_PRINT )
 ROW_CNT = 0 ,
 
IF ( ( ROW_CNT >= 1 ) )
WHILE ( ( ROW <= 70 ))
 ROW + 6  ROW_CNT =( ROW_CNT + 6 ) COL  05  ORD_LINE
 
ENDWHILE
 
ENDIF
,
 FORM_FEED ,
 PAGENUM =( PAGENUM + 1 ),
 PRINT_OVERLAY ,
 
IF ( ( ODD_EVEN = "O" ) )  ODD_EVEN = "E"
ELSE   ODD_EVEN = "O"
ENDIF
 
ENDMACRO
,
 
MACRO ( BUILD_INFUSE )
 DSINFUSE = FILLSTRING ( 12 ,  " " ),
 
IF ( (PO.INFUSE_OVER> 0 ) )  PASS_FIELD_IN =PO.INFUSE_OVER,  PARSE_ZEROES ,  DSINFUSE = CONCAT (
 TRIM ( DSVALUE ),  " " ,  TRIM (PO.INFUSE_UNIT_S))
ENDIF
 
ENDMACRO
,
 
MACRO ( BUILD_VOLUME )
 DSVOLUME = FILLSTRING ( 13 ,  " " ),
 PASS_FIELD_IN =PO.TOT_VOLUME,
 PARSE_ZEROES ,
 DSVOLUME = CONCAT ( TRIM ( DSVALUE ),  " " ,  " mL" )
ENDMACRO
,
 
MACRO ( BUILD_RATE )
 DSRATE = FILLSTRING ( 12 ,  " " ),
 
IF ( (PO.TITRATE_IND= 1 ) )  DSRATE = "Titrate     "
ELSE   PASS_FIELD_IN =PO.ML_HR,  PARSE_ZEROES ,  DSRATE = CONCAT ( TRIM ( DSVALUE ),  " " ,
 " mL/hr" )
ENDIF
 
ENDMACRO
,
 
MACRO ( BUILD_INTERVAL )
 DSINTERVAL = FILLSTRING ( 15 ,  " " ),
 PASS_FIELD_IN =PO.REPLACE_EVERY,
 PARSE_ZEROES ,
 DSINTERVAL = CONCAT ( TRIM ( DSVALUE ),  " " ,  TRIM (PO.REPLACE_EVERY_UNIT_S))
ENDMACRO
,
 LN_WIDTH_IN = 0 ,
 STR_CUSTOM_ERROR = FILLSTRING ( 200 ,  " " ),
 
MACRO ( PRNT_NOTE )
 
IF ( ( CHARS_PER_LINE > 0 ) )  LN_WIDTH_IN = CHARS_PER_LINE
ENDIF
,
 
IF ( ( LN_WIDTH_IN = 0 ) )  LN_WIDTH_IN = 48
ENDIF
,
 STUCK = 0 ,
 COUNT_NO_SPACES = 0 ,
 COUNTER = 0 ,
 
IF ( ( CHARS_PER_LINE = 0 ) )  CHARS_PER_LINE = 48
ENDIF
,
 TIME_TO_LOOP = 0 ,
 TIME_TO_LOOP =(( SIZE ( TRIM ( NOTE_TEXT_IN ,  1 ))/ CHARS_PER_LINE )+ 1 ),
 
FOR (  NOTE_LENGTH  =  1  TO  TIME_TO_LOOP  )
 
FOR (  TIME  =  1  TO  CHARS_PER_LINE  )
 COUNTER =( COUNTER + 1 )
IF ( ( SUBSTRING ( COUNTER ,  1 ,  NOTE_TEXT_IN )!= " " ) )  COUNT_NO_SPACES =( COUNT_NO_SPACES + 1
),
IF ( ( COUNT_NO_SPACES >= CHARS_PER_LINE ) )  STUCK = 1 ,  NOTE_LENGTH = TIME_TO_LOOP ,  TIME =
 CHARS_PER_LINE
ENDIF
 
ELSE   COUNT_NO_SPACES = 0
ENDIF
 
 
ENDFOR
 
 
ENDFOR
,
 
IF ( ( STUCK = 0 ) )  START_POS = 1 ,  BIG_STRING_LEN = 0 ,  COUNT = 0 ,  NOTE_STRING = FILLSTRING (
 68 ,  " " ),  HOLD_STRING = FILLSTRING ( 68 ,  " " ),  RETURN_FOUND = 0 ,  BIG_STRING_LEN = SIZE (
 TRIM ( NOTE_TEXT_IN )),  CR = FILLSTRING ( 1 ,  " " ),  CR = CHAR ( 13 ),
WHILE ( (( BIG_STRING_LEN - START_POS )> 0 ))
 SPACE_LOC = 0  RETURN_FOUND = 0  COUNT = 0  CR_COUNT = 0  END_POS = 0  END_POS =( LN_WIDTH_IN +
 START_POS ) LEN = MOVESTRING ( NOTE_TEXT_IN ,  START_POS ,  HOLD_STRING ,  0 ,  END_POS )
 HOLD_STRING = HOLD_STRING  CR_COUNT = FINDSTRING ( CR ,  HOLD_STRING )
IF ( ( CR_COUNT > 0 ) AND ( SIZE ( TRIM ( SUBSTRING ( 0 , ( CR_COUNT - 1 ),  HOLD_STRING )))<=
 CHARS_PER_LINE ) )  RETURN_FOUND = 1 ,  NOTE_STRING = SUBSTRING ( 0 , ( CR_COUNT - 1 ),
 HOLD_STRING ),  NOTE_STRING = TRIM ( NOTE_STRING ,  1 ),  COL ( 00 + COL_START ),  NOTE_STRING ,
 ROW + 1 ,  ORD_ROW = ROW ,  CR_COUNT =( CR_COUNT + 1 ),  START_POS =( START_POS + CR_COUNT )
ENDIF
 
WHILE ( ( COUNT < LN_WIDTH_IN ) AND ( RETURN_FOUND = 0 ))
 COUNT =( COUNT + 1 )
IF ( ( SUBSTRING ( COUNT ,  1 ,  HOLD_STRING )= " " ) AND ( RETURN_FOUND = 0 ) )  SPACE_LOC = COUNT
ENDIF
 
 
ENDWHILE
 
IF ( ( SPACE_LOC > 0 ) AND ( RETURN_FOUND = 0 ) )  NOTE_STRING = SUBSTRING ( 0 , ( SPACE_LOC - 1 ),
 HOLD_STRING ),  NOTE_STRING = TRIM ( NOTE_STRING ),  COL ( 00 + COL_START ),  NOTE_STRING ,  ROW +
 1 ,  ORD_ROW = ROW ,  START_POS =( START_POS + SPACE_LOC )
ENDIF
 
 
ENDWHILE
 
ELSE   COL ( 00 + COL_START ),
IF ( ( SIZE ( TRIM ( STR_CUSTOM_ERROR ))> 0 ) )  STR_CUSTOM_ERROR
ELSE   "See chart or contact pharmacy for more info."
ENDIF
,  ROW + 1 ,  ORD_ROW = ROW
ENDIF
 
ENDMACRO
,
 
MACRO ( PRNT_NOTE_PMP )
 CHAR_COUNT = 0 ,
 START_POS = 0 ,
 LINE_CNT = 0 ,
 CHAR_COUNT = CHARS_PER_LINE ,
 
WHILE ( ( START_POS < 1000 ))
 
IF ( (( CHAR_COUNT + START_POS )> 1000 ) )  CHAR_COUNT =( 1000 - START_POS )
ENDIF
 
WHILE ( ( SUBSTRING (( CHAR_COUNT + START_POS ),  1 ,  NOTE_TEXT_IN )= " " ))
 CHAR_COUNT =( CHAR_COUNT - 1 )
 
ENDWHILE
 
IF ( ( CHAR_COUNT > 0 ) )  LEN = MOVESTRING ( NOTE_TEXT_IN ,  START_POS ,  NOTE_STRING ,  0 ,
 CHAR_COUNT ),  START_POS =( START_POS + CHAR_COUNT ),  CHAR_COUNT = CHARS_PER_LINE ,
IF ( ( SIZE ( TRIM ( NOTE_STRING ))> 0 ) )  COL ( 00 + COL_START ),  NOTE_STRING ,  ROW + 1 ,
 ROW_CNT =( ROW_CNT + 1 ),  ORD_ROW =( ORD_ROW + 1 )
ENDIF
 
ELSE   START_POS = 1000
ENDIF
 
 
ENDWHILE
 
ENDMACRO
,
 
MACRO ( BUILD_DOSE )
 DSDOSE = FILLSTRING ( 12 ,  " " ),
 PASS_FIELD_IN =PO.DOSE_QUANTITY,
 PARSE_ZEROES ,
 DSDOSE = CONCAT ( TRIM ( DSVALUE ))
ENDMACRO
,
 
MACRO ( BUILD_FILL )
 DSFILL = FILLSTRING ( 12 ,  " " ),
 PASS_FIELD_IN =PO.FILL_QUANTITY,
 PARSE_ZEROES ,
 DSFILL = CONCAT ( TRIM ( DSVALUE ))
ENDMACRO
,
 
MACRO ( PARSE_ZEROES )
 DSVALUE = FILLSTRING ( 16 ,  " " ),
 MOVE_FLD = FILLSTRING ( 16 ,  " " ),
 STRFLD = FILLSTRING ( 16 ,  " " ),
 SIG_DIG = 0 ,
 SIG_DEC = 0 ,
 STRFLD = CNVTSTRING ( PASS_FIELD_IN ,  16 ,  4 ,  R ),
 STR_CNT = 1 ,
 LEN = 0 ,
 
WHILE ( ( STR_CNT < 12 ) AND ( SUBSTRING ( STR_CNT ,  1 ,  STRFLD ) IN ( "0" ,
 " " )))
 STR_CNT =( STR_CNT + 1 )
 
ENDWHILE
,
 SIG_DIG =( STR_CNT - 1 ),
 STR_CNT = 16 ,
 
WHILE ( ( STR_CNT > 12 ) AND ( SUBSTRING ( STR_CNT ,  1 ,  STRFLD ) IN ( "0" ,
 " " )))
 STR_CNT =( STR_CNT - 1 )
 
ENDWHILE
,
 
IF ( ( STR_CNT = 12 ) AND ( SUBSTRING ( STR_CNT ,  1 ,  STRFLD )= "." ) )  STR_CNT =( STR_CNT - 1 )
ENDIF
,
 SIG_DEC = STR_CNT ,
 
IF ( ( SIG_DIG = 11 ) AND ( SIG_DEC = 11 ) )  DSVALUE = "n/a"
ELSE   LEN = MOVESTRING ( STRFLD , ( SIG_DIG + 1 ),  MOVE_FLD ,  1 , ( SIG_DEC - SIG_DIG )),
 DSVALUE = TRIM ( MOVE_FLD ),
IF ( ( SUBSTRING ( 1 ,  1 ,  DSVALUE )= "." ) )  DSVALUE = CONCAT ( "0" ,  TRIM ( MOVE_FLD ))
ENDIF
 
ENDIF
 
ENDMACRO
,
 
MACRO ( GET_INTERACTIONS )
 DD_IND = 0 ,
 DA_IND = 0 ,
 DF_IND = 0 ,
 DD_INTER = FILLSTRING ( 5 ,  " " ),
 DA_INTER = FILLSTRING ( 2 ,  " " ),
 DF_INTER = FILLSTRING ( 5 ,  " " ),
 CPOS = 0 ,
 XPOS = 0 ,
 SIZE_INTER = 0 ,
 INTER = FILLSTRING ( 100 ,  " " ),
 WORK_INTER = FILLSTRING ( 12 ,  " " ),
 DISP_INTER = FILLSTRING ( 16 ,  " " ),
 
FOR (  X  =  1  TO  SIZE ( INTERACTION -> DATA ,  5 ) )
 
IF ( (PO.ORDER_ID= INTERACTION -> DATA [ X ]-> ORDER_ID ) )
IF ( ( SIZE ( INTERACTION -> DATA [ X ]-> DETAILS ,  5 )> 0 ) )
FOR (  Y  =  1  TO  SIZE ( INTERACTION -> DATA [ X ]-> DETAILS ,  5 ) )
 INTER = TRIM ( INTERACTION -> DATA [ X ]-> DETAILS [ Y ]-> DLG_NAME ) CPOS = FINDSTRING ( "!" ,
 INTER ,  1 ) XPOS =( CPOS + 1 ) SIZE_INTER = SIZE ( TRIM ( INTERACTION -> DATA [ X ]-> DETAILS [ Y
]-> DLG_NAME )) CASE_INTER = TRIM ( SUBSTRING ( XPOS ,  SIZE_INTER ,  INTER ))
IF ( ( CASE_INTER = "DRUGDRUG" ) AND ( DD_IND = 0 ) )  DD_INTER = "DD / " ,  DD_IND = 1
ENDIF
 
IF ( ( CASE_INTER = "DRUGALLERGY" ) AND ( DA_IND = 0 ) )  DA_INTER = "DA" ,  DA_IND = 1
ENDIF
 
IF ( ( CASE_INTER = "DRUGFOOD" ) AND ( DF_IND = 0 ) )  DF_INTER = " / DF" ,  DF_IND = 1
ENDIF
 
IF (  (( ( DD_IND = 1 ) )  OR  ( (( ( DA_IND = 1 ) )  OR  (( DF_IND = 1 ) ))  ))  )  DISP_INTER =
 CONCAT ( "* " ,  DD_INTER ,  DA_INTER ,  DF_INTER ,  " *" )
ENDIF
 
 
ENDFOR
 
ENDIF
 
ENDIF
 
 
ENDFOR
 
ENDMACRO
,
 
MACRO ( BUILD_PICK_QTY )
 REAL_PICK =(PO.DOSE_QUANTITY*PO.FILL_QUANTITY),
 PICKQTY = FILLSTRING ( 13 ,  " " ),
 PASS_FIELD_IN = REAL_PICK ,
 PARSE_ZEROES ,
 PICKQTY = CONCAT ( TRIM ( DSVALUE ),  " " ,  TRIM (PO.DOSE_QUANTITY_UNIT_S))
ENDMACRO
,
 MODNUM = "012"
HEAD PAGE
 
IF ( ( PAGE_BREAK = 1 ) )  PAGE_BREAK = 0
ENDIF
,
 ORD_PAGE_CNT = 0
HEAD  PERSON_SORT
 REASON_FOR_VISIT = SUBSTRING ( 1 ,  50 , E.REASON_FOR_VISIT), FEED_PRINT , NCOUNT = 0 , N2COUNT =
 0 , PAGE_BREAK = 0 , SORT_BREAK = 0 , PRN_BREAK = 0 , ORD_BREAK = 0 , FIRST_MED = SORT_THINGY
HEAD  SORT_THINGY
 
IF (  NOT (( FIRST_MED  IN ( 2 ,
 4 )) ) AND ( SORT_THINGY  IN ( 2 ,
 4 )) )
IF ( ( ROW < 86 ) )
WHILE ( ( ROW < 86 ))
 ROW + 6  COL  10  ORD_LINE
 
ENDWHILE
 
ENDIF
,  FEED_PRINT
ENDIF
,
IF ( ( FIRST_MED = 2 ) AND ( SORT_THINGY = 4 ) )
IF ( ( ROW < 86 ) )
WHILE ( ( ROW < 86 ))
 ROW + 6  COL  10  ORD_LINE
 
ENDWHILE
 
ENDIF
,  FEED_PRINT
ENDIF
 
HEAD  ORD_SEQ
 INGCNT = 0 , BRANDCNT = 0 , ADMIN_PRINT = 0 ,
IF ( (PO.PRN_IND= 1 ) )  PRN_BREAK = 1
ENDIF
, ORD_PAGE_CNT =( ORD_PAGE_CNT + 1 ), LABEL1_ID =PO.LABEL1_ID, LABEL2_ID =PO.LABEL2_ID, CDEA = 0 ,
IF ( (PO.ORDER_ID= 0 ) )  ROW_CNT = 6
ENDIF
, ROWS_REQ = 0 , NOTE1_REQ = 0.0 , NOTE2_REQ = 0.0 , ADMIN_REQ = 0.0 ,
IF ( (PO.ORD_TYPE IN ( 0 ,
 1 )) )  ROWS_REQ =(((PO.INGRED_CNT*PO.PROD_CNT)* 3 )+ 1 )
ELSE   ROWS_REQ =((PO.INGRED_CNT*PO.PROD_CNT)+ 3 )
ENDIF
,
IF ( (PO.COMMENT1_WHERE_TO_PRINT IN ( 2 ,
 3 ,
 6 ,
 7 )) )  NOTE1_REQ =( SIZE ( TRIM ( NOTE_TEXT1 ))/ 50 ),
IF ( ( MOD ( SIZE ( TRIM ( NOTE_TEXT1 )),  50 )!= 0 ) )  NOTE1_REQ =( NOTE1_REQ + 1 )
ENDIF
 
ENDIF
,
IF ( (PO.COMMENT2_WHERE_TO_PRINT IN ( 2 ,
 3 ,
 6 ,
 7 )) )  NOTE2_REQ =( SIZE ( TRIM ( NOTE_TEXT2 ))/ 50 ),
IF ( ( MOD ( SIZE ( TRIM ( NOTE_TEXT2 )),  50 )!= 0 ) )  NOTE2_REQ =( NOTE2_REQ + 1 )
ENDIF
 
ENDIF
, ROWS_REQ =(( ROWS_REQ + NOTE1_REQ )+ NOTE2_REQ ),
IF ( (PO.ROUTE_S IN ( "IVP" ,
 "IVPB" )) )  ROWS_REQ =( ROWS_REQ + 5 )
ENDIF
,
IF ( ( SIZE ( TRIM (PO.FREETEXT_DOSE))> 20 ) )  ROWS_REQ =( ROWS_REQ + 1 )
ENDIF
,
IF ( (PO.PRN_IND= 0 ) AND (PO.ADMIN_COUNT< 25 ) )
IF ( (PO.ADMIN_COUNT>= 3 ) )  ADMIN_REQ =(PO.ADMIN_COUNT/ 3 ),
IF ( ( MOD (PO.ADMIN_COUNT,  3 )!= 0 ) )  ADMIN_REQ =( ADMIN_REQ + 1 )
ENDIF
 
ELSE   ADMIN_REQ = 0
ENDIF
 
ELSE   ADMIN_REQ = 0
ENDIF
,
IF ( ( ADMIN_REQ > ROWS_REQ ) )  ROWS_REQ = ADMIN_REQ
ENDIF
,
 CALL ECHO (PO.ORD_DESC),
 CALL ECHO ( BUILD ( "Admin rows required===========" ,  ADMIN_REQ )),
 CALL ECHO ( BUILD ( "ROW***************************" ,  ROW )),
 CALL ECHO ( BUILD ( "ROWS Required ****************" , ( ROW + ROWS_REQ ))),
IF ( (( ROW + ROWS_REQ )> 92 ) )
 CALL ECHO ( "###############################################Next Page" ),
IF ( ( ROW < 92 ) )
WHILE ( ( ROW < 86 ))
 
 CALL ECHO ( BUILD ( "writing ord line@@@@@@@@@@@@@@@@@@@@@@@@@@@  :" ,  ROW )) ROW + 6  COL  10
 ORD_LINE
 
ENDWHILE
 
ENDIF
,  FEED_PRINT
ENDIF
, START_ROW = ROW , ORD_ROW = ROW , ADMIN_ROW = ROW , FIRST_CNT = 0 , SECOND_CNT = 0 , THIRD_CNT =
 0 , X1 = 0 , X2 = 0 , X3 = 0 ,
IF ( (PO.INGRED_CNT> 0 ) )  STAT = ALTERLIST ( INGREDS -> DATA , PO.INGRED_CNT)
ELSE   STAT = ALTERLIST ( INGREDS -> DATA ,  1 )
ENDIF
, COL  62 ,PO.ORDER_START_DT_TM "MM-DD-YY"
, ROW + 1 , ROW_CNT =( ROW_CNT + 1 ), COL  63 ,PO.ORDER_START_DT_TM "HH:MM"
, ROW + 1 , ROW_CNT =( ROW_CNT + 1 ),
IF ( (PO.ORDER_STOP_DT_TM> 0 ) )  COL  62 , PO.ORDER_STOP_DT_TM "MM-DD-YY"
,  ROW + 1 ,  ROW_CNT =( ROW_CNT + 1 ),  COL  63 , PO.ORDER_STOP_DT_TM "HH:MM"
 
ELSEIF ( ( SOFT_STOP > 0 ) )  COL  61 ,  "*" ,  SOFT_STOP  "MM-DD-YY;;d"
,  "*" ,  ROW + 1 ,  ROW_CNT =( ROW_CNT + 1 ),  COL  61 ,  "* " ,  SOFT_STOP  "HH:MM;;d"
,  "  *"
ENDIF
, ROW + 1 , ROW_CNT =( ROW_CNT + 1 ), HEAD_ROW = ROW , ROW  START_ROW
HEAD PO.INGRED_SEQ
 INGCNT =( INGCNT + 1 ), STEP = 0 , IPRODCNT = 0 , DISP_STRING = FILLSTRING ( 51 ,  " " ),
 FREETEXT_STR = CONCAT ( TRIM (PO.FREETEXT_DOSE)), RT_STRING = FILLSTRING ( 8 ,  " " ), BRAND_STR =
 FILLSTRING ( 22 ,  " " ), FORM_STRING = FILLSTRING ( 6 ,  " " ),
IF ( (PO.IGNORE_IND!= 1 ) )
IF ( (PO.LEGAL_STATUS_S IN ( "1" ,
 "2" ,
 "3" ,
 "4" ,
 "5" )) )  IDEA = CNVTINT (PO.LEGAL_STATUS_S),
IF (  (( ( CDEA > IDEA ) )  OR  (( CDEA = 0 ) ))  )  CDEA = IDEA
ENDIF
 
ENDIF
,
IF ( ( SIZE ( TRIM (PO.GEN_NAME))> 0 ) )  DISP_STRING = TRIM ( SUBSTRING ( 1 ,  31 , PO.GEN_NAME))
ELSEIF ( ( SIZE ( TRIM (PO.INGRED_DESC))> 0 ) )  DISP_STRING = TRIM ( SUBSTRING ( 1 ,  31 ,
PO.INGRED_DESC))
ELSE
IF ( (PO.ORDER_ID> 0 ) )  DISP_STRING = "INVALID DRUG NAME"
ENDIF
 
ENDIF
,  RT_STRING = TRIM ( SUBSTRING ( 1 ,  8 , PO.ROUTE_S)),  FORM_STRING = TRIM ( SUBSTRING ( 1 ,  6 ,
PO.FORM_S)),  UPPERBRAND = CNVTUPPER (PO.BRAND_NAME),  UPPERGEN = CNVTUPPER (PO.GEN_NAME),
IF ( ( UPPERBRAND != UPPERGEN ) AND ( SIZE ( TRIM ( UPPERBRAND ))> 0 ) )  BRAND_STR = CONCAT ( "("
,  TRIM ( SUBSTRING ( 1 ,  20 , PO.BRAND_NAME)),  ")" )
ELSE   BRAND_STR = " "
ENDIF
,  STAT = ALTERLIST ( INGREDS -> DATA ,  INGCNT ),  INGREDS -> DATA [ INGCNT ]-> BRAND = BRAND_STR
,  BRANDCNT =( BRANDCNT + 1 ),
IF ( (PO.ORD_TYPE IN ( 0 ,
 1 )) )  NEWORD = FILLSTRING ( 50 ,  " " ),  NEWORD = CONCAT ( TRIM ( BRAND_STR ),  "/" ,  TRIM (
 DISP_STRING )),  COL  10 ,  NEWORD ,  ROW + 1 ,  ORD_ROW = ROW
ELSE   COL  10 ,  DISP_STRING ,
IF ( (PO.STRENGTH> 0 ) )  PASS_FIELD_IN =PO.STRENGTH,  PARSE_ZEROES ,  STRENGTH_STR = CONCAT ( TRIM
( DSVALUE ),  " " ,  TRIM (PO.STRENGTH_UNIT_S))
ELSEIF ( (PO.VOLUME> 0 ) )  PASS_FIELD_IN =PO.VOLUME,  PARSE_ZEROES ,  STRENGTH_STR = CONCAT ( TRIM
( DSVALUE ),  " " ,  TRIM (PO.VOLUME_UNIT_S))
ELSE   STRENGTH_STR = TRIM (PO.FREETEXT_DOSE)
ENDIF
,
IF ( ( SIZE ( TRIM ( STRENGTH_STR ))> 10 ) )  ROW + 1 ,  COL  10 ,  STRENGTH_STR
 "#######################################;r"
 
ELSE   COL  45 ,  " | " ,  COL  50 ,  STRENGTH_STR
ENDIF
,  ROW + 1 ,  ORD_ROW = ROW
ENDIF
 
ENDIF
 
HEAD  ADMIN_TIME
 
IF ( (PO.ORDER_STATUS_ENUM= 6 ) AND (PO.ADMIN_COUNT< 25 ) )
IF (  (( (PO.IV_IN_SEQ> 0 ) AND (PO.PRN_IND= 0 ) AND (PO.ADMIN_COUNT> 0 ) AND (PO.TITRATE_IND= 0 )
 AND ( ADMIN_PRINT = 0 ) AND  (( (FS.FREQUENCY_TYPE!= 5 ) )  OR  ((FS.FREQUENCY_CD= 0 ) ))  )  OR  (
(PO.PRN_IND= 0 ) AND (PO.ADMIN_COUNT> 0 ) AND (PO.TITRATE_IND= 0 ) AND (PO.INGRED_SEQ= 1 ) AND  (( (
FS.FREQUENCY_TYPE!= 5 ) )  OR  ((FS.FREQUENCY_CD= 0 ) ))  ))  )  ADMIN_PRINT = 1 ,
IF ( ( ADMIN_TIME  BETWEEN  0001  AND  0700 ) )  X1 =( START_ROW + FIRST_CNT ),  ROW  X1 ,
 FIRST_CNT =( FIRST_CNT + 1 ),  COL  73 ,  ADMIN_TIME  "##:##;p0"
 
ELSEIF ( ( ADMIN_TIME  BETWEEN  0701  AND  1500 ) )  X2 =( START_ROW + SECOND_CNT ),  ROW  X2 ,
 SECOND_CNT =( SECOND_CNT + 1 ),  COL  92 ,  ADMIN_TIME  "##:##;p0"
 
ELSE   X3 =( START_ROW + THIRD_CNT ),  ROW  X3 ,  THIRD_CNT =( THIRD_CNT + 1 ),  COL  110 ,
IF ( ( ADMIN_TIME = 0 ) )  "24:00"
ELSE   ADMIN_TIME  "##:##;p0"
 
ENDIF
 
ENDIF
,
IF ( (PO.FREQUENCY_S= "QD,OFF,HS" ) )  X3 =( START_ROW + THIRD_CNT ),  ROW  X3 ,  THIRD_CNT =(
 THIRD_CNT + 1 ),  COL  110 ,  "Off at 22:00"
ENDIF
 
ELSEIF (  (( (PO.ADMIN_COUNT= 0 ) )  OR  ((PO.PRN_IND= 1 ) ))  )  X1 =( START_ROW + FIRST_CNT ),
 ROW  X1 ,  COL  73 ,
IF ( (PO.ADMIN_COUNT= 0 ) AND (PO.ORDER_START_DT_TM> DATA -> CYC_TO_DT_TM ) )  "Future Dose "
ELSE
IF ( (PO.PRN_IND= 1 ) )  " PRN "
ELSE
IF ( (PO.ORD_TYPE!= 2 ) )  "No Doses Due"
ENDIF
 
ENDIF
 
ENDIF
 
ELSEIF ( (FS.FREQUENCY_TYPE= 5 ) )  X1 =( START_ROW + FIRST_CNT ),  ROW  X1 ,  COL  73 ,
 "Unscheduled"
ENDIF
 
ELSEIF ( (PO.ORDER_STATUS_ENUM IN ( 7 ,
 8 ,
 10 )) )  X1 =( START_ROW + FIRST_CNT ),  ROW  X1 ,  COL  73 ,
IF ( (PO.ORDER_STATUS_ENUM IN ( 8 ,
 10 )) )  "Discontinued"
ELSEIF ( (PO.ORDER_STATUS_ENUM= 7 ) )  "On Hold"
ENDIF
 
ELSEIF ( (PO.ADMIN_COUNT> 24 ) )  X1 =( START_ROW + FIRST_CNT ),  ROW  X1 ,  COL  73 ,
 "Too many admin times to print"
ENDIF
, ROW  ORD_ROW
HEAD PO.ITEM_ID
 IPRODCNT =( IPRODCNT + 1 ),
IF ( (PO.PROD_CNT> 1 ) AND ( IPRODCNT <=PO.PROD_CNT) )  BUILD_DOSE ,  DSDESC = FILLSTRING ( 40 ,
 " " ),  DSDESC = CONCAT ( TRIM (PO.LABEL_DESC),  " x " ,  TRIM ( DSDOSE )),  COL  10 ,  DSDESC ,
 ROW + 1 ,  ORD_ROW = ROW
ENDIF
 
FOOT  PO.INGRED_SEQ
 STEP = 2
FOOT   ORD_SEQ
 ROW  ORD_ROW ,
IF ( (PO.ORD_TYPE IN ( 2 ,
 3 )) )  BUILD_INFUSE ,  BUILD_INTERVAL ,  BUILD_RATE ,  BUILD_VOLUME
ENDIF
, DSFREQ = FILLSTRING ( 16 ,  " " ), DSFREQ = TRIM ( SUBSTRING ( 1 ,  16 , PO.FREQUENCY_S)),
 DSROUTE = TRIM ( SUBSTRING ( 1 ,  10 , PO.ROUTE_S)),
IF ( (PO.ORD_TYPE= 3 ) )  COL  10 ,  "Infuse Over " ,  DSINFUSE ,  ROW + 1 ,  ORD_ROW = ROW
ENDIF
, STR_FREQ = FILLSTRING ( 34 ,  " " ),
IF ( (PO.ORD_TYPE IN ( 0 ,
 1 )) )
IF ( (PO.PRN_REASON_S> " " ) )  STR_FREQ = TRIM ( CONCAT ( TRIM ( DSROUTE ),  " " ,  TRIM ( DSFREQ )
,  " " ,  TRIM (PO.PRN_REASON_S)))
ELSE   STR_FREQ = TRIM ( CONCAT ( TRIM ( DSROUTE ),  " " ,  TRIM ( DSFREQ )))
ENDIF
,  COL  10 ,  FREETEXT_STR ,  COL + 1 ,
IF ( ( SIZE ( TRIM ( FREETEXT_STR ))> 20 ) )  ROW + 1 ,  COL  10 ,  STR_FREQ
 "##################################################;r"
 
ELSE   " " ,  STR_FREQ
ENDIF
,  ROW + 1 ,  ORD_ROW = ROW
ELSE
IF ( (PO.PRN_REASON_S> " " ) )  STR_FREQ = CONCAT ( TRIM ( DSROUTE ),  " " ,  TRIM ( DSFREQ ),  " "
,  TRIM (PO.PRN_REASON_S))
ELSE   STR_FREQ = CONCAT ( TRIM ( DSROUTE ),  " " ,  TRIM ( DSFREQ ))
ENDIF
,  COL  10 ,  STR_FREQ  "##################################################;r"
,  ROW + 1 ,  ORD_ROW = ROW ,
IF ( (PO.ORD_TYPE= 2 ) )  DSLINE = FILLSTRING ( 45 ,  " " ),
IF ( (PO.TITRATE_IND> 0 ) )  DSLINE = TRIM ( DSRATE )
ELSE
IF ( (PO.INFUSE_OVER<= 24 ) )  DSLINE = CONCAT ( "Infuse " ,  TRIM ( DSRATE ),  " over " ,  TRIM (
 DSINFUSE ))
ELSE   DSLINE = TRIM ( DSRATE )
ENDIF
 
ENDIF
,  COL  10 ,  DSLINE ,  ROW + 1 ,  ORD_ROW = ROW ,
IF ( (PO.REPLACE_EVERY> 0 ) AND (PO.REPLACE_EVERY!=PO.INFUSE_OVER) )
IF ( ( ROW >= HEAD_ROW ) )  ROW_CNT =( ROW_CNT + 1 )
ENDIF
,  COL  10 ,  "Replace every " ,  DSINTERVAL ,  ROW + 1 ,  ORD_ROW = ROW
ENDIF
 
ENDIF
,  ORD_ROW = ROW
ENDIF
, CHARS_PER_LINE = 50 , NOTE_STRING = FILLSTRING ( 50 ,  " " ),
IF ( ( LABEL1_ID > 0 ) AND (PO.COMMENT1_WHERE_TO_PRINT IN ( 2 ,
 3 ,
 6 ,
 7 )) AND ( SIZE ( TRIM ( NOTE_TEXT1 ))> 0 ) )  NOTE_TEXT_IN = FILLSTRING ( 1000 ,  " " ),
 NOTE_TEXT_IN = NOTE_TEXT1 ,  COL_START = 10 ,  PRNT_NOTE
ENDIF
,
IF ( ( LABEL2_ID > 0 ) AND (PO.COMMENT2_WHERE_TO_PRINT IN ( 2 ,
 3 ,
 6 ,
 7 )) AND ( SIZE ( TRIM ( NOTE_TEXT2 ))> 0 ) )  NOTE_TEXT_IN = FILLSTRING ( 1000 ,  " " ),
 NOTE_TEXT_IN = NOTE_TEXT2 ,  COL_START = 10 ,  PRNT_NOTE
ENDIF
, MAX_ROW = 0 ,
IF ( ( ORD_ROW < HEAD_ROW ) )  MAX_ROW = HEAD_ROW
ELSE   MAX_ROW = ORD_ROW
ENDIF
, ADMIN_ROW = 0 ,
IF ( ( X1 > ADMIN_ROW ) )  ADMIN_ROW =( X1 + 1 ),  ADD_COUNT = FIRST_CNT
ENDIF
,
IF ( ( X2 > ADMIN_ROW ) )  ADMIN_ROW =( X2 + 1 ),  ADD_COUNT = SECOND_CNT
ENDIF
,
IF ( ( X3 > ADMIN_ROW ) )  ADMIN_ROW =( X3 + 1 ),  ADD_COUNT = THIRD_CNT
ENDIF
,
IF ( ( ADMIN_ROW > MAX_ROW ) )  ROW  ADMIN_ROW
ELSE   ROW  MAX_ROW
ENDIF
,
IF (  (( ( RT_STRING = "IVP" ) )  OR  (( RT_STRING = "IVPB" ) ))  )
IF ( ( ROW_CNT < 89 ) )  COL  10 ,  ORD_LINE ,  ROW + 1 ,  ORD_ROW = ROW
ENDIF
,
IF ( ( ROW >= 89 ) )  FEED_PRINT
ENDIF
 
ELSE
IF ( ( ROW < 89 ) )  COL  10 ,  ORD_LINE ,  ROW + 1 ,  PAGE_BREAK = 0
ENDIF
 
ENDIF
,
IF ( ( ROW >= 92 ) )  FEED_PRINT
ENDIF
 
FOOT   PERSON_SORT
 PAGENUM = 0 ,
IF ( ( ROW < 86 ) )
WHILE ( ( ROW < 86 ))
 
 CALL ECHO ( BUILD ( "row######################################  :" ,  ROW )) ROW + 6
 CALL ECHO ( BUILD ( "printed row at ######################################  :" ,  ROW )) COL  10
 ORD_LINE
 
ENDWHILE
 
ENDIF
, ROW  2 , COL  116 , "  End       " , END_OF_PATIENT = 1
 WITH  NOCOUNTER , OUTERJOIN = D , OUTERJOIN = D2 , MAXCOL = 250 , DIO = 38 , MAXROW = 150
 
WHILE ( ( ERRCODE != 0 ))
 
SET  ERRCODE  =  ERROR ( ERRMSG ,  0 )
SET  ERRCNT  = ( ERRCNT + 1 )
SET  STAT  =  ALTERLIST ( O_ERRORS -> ERR ,  ERRCNT )
SET  O_ERRORS -> ERR [ ERRCNT ]-> ERR_CODE  =  ERRCODE
SET  O_ERRORS -> ERR [ ERRCNT ]-> ERR_MSG  =  ERRMSG
SET  O_ERRORS -> ERR_CNT  =  ERRCNT
 
ENDWHILE
 
 
IF ( ( CURQUAL = 0 ) )
IF ( ( O_ERRORS -> ERR_CNT > 1 ) )
SET  REPLY -> STATUS_DATA -> STATUS  =  "F"
ELSE
SET  REPLY -> STATUS_DATA -> STATUS  =  "Z"
ENDIF
 
SET  REPLY -> STATUS_DATA -> SUBEVENTSTATUS [ 1 ]-> OPERATIONNAME  =  "PRINT"
SET  REPLY -> STATUS_DATA -> SUBEVENTSTATUS [ 1 ]-> TARGETOBJECTVALUE  =  VALUE ( PRINTFILE )
ELSE
SET  PRINTER  =  FILLSTRING ( 20 ,  " " )
SET  PRINTER  =  VALUE ( TRIM ( DATA -> OUTPUT_DEVICE_S ))
SET  SPOOL  VALUE ( TRIM ( PRINTFILE )) VALUE ( TRIM ( PRINTER ))
SET  REPLY -> STATUS_DATA -> STATUS  =  "S"
 CALL ECHO ( CONCAT ( TRIM ( PRINTFILE ),  " printing on " ,  TRIM ( PRINTER )))
ENDIF
 
 
# EXIT_SCRIPT
 
/****Start 002 - New Code ***/
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
 
/***END 002 - New Code ***/
 
SET  LASTMOD  =  "018 dg5085 11/20/08"
 END GO
 
