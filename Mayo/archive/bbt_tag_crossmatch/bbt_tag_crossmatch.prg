;*** Generated by translate command; please verify contents before re-including in CCL ***
;001 02/05/2013 Akcia-SE  check active_ind and end_effective_dt_tm on encntr_alias
DROP PROGRAM   BBT_TAG_CROSSMATCH : DBA  GO
CREATE PROGRAM  BBT_TAG_CROSSMATCH : DBA
 
RECORD  ANTIBODY  (
 1  ANTIBODYLIST [ 10 ]
 2  ANTIBODY_CD  =  F8
 2  ANTIBODY_DISP  =  C15
 2  TRANS_REQ_IND  =  I2 )
 
RECORD  ANTIGEN  (
 1  ANTIGENLIST [ 10 ]
 2  ANTIGEN_CD  =  F8
 2  ANTIGEN_DISP  =  C15 )
 
RECORD  COMPONENT  (
 1  CMPNTLIST [ 10 ]
 2  PRODUCT_ID  =  F8
 2  PRODUCT_CD  =  F8
 2  PRODUCT_DISP  =  C40
 2  PRODUCT_NBR  =  C20
 2  PRODUCT_SUB_NBR  =  C5
 2  ALTERNATE_NBR  =  C20
 2  CUR_ABO_CD  =  F8
 2  CUR_ABO_DISP  =  C2
 2  CUR_RH_CD  =  F8
 2  CUR_RH_DISP  =  C10
 2  SUPPLIER_PREFIX  =  C5 )
 
SET  ANTBDY  =  0
 
SET  ANTIBODY_CNT  =  0
 
SET  ADDTNL_ANTIBODY_IND  =  0
 
DECLARE  ANTIBODY_DISP  =  C109
 
SET  ANTIBODY_DISP  = ""
 
SET  ANTGEN  =  0
 
SET  ANTIGEN_CNT  =  0
 
SET  ADDTNL_ANTIGEN_IND  =  0
 
DECLARE  ANTIGEN_DISP  =  C109
 
SET  ANTIGEN_DISP  = ""
 
SET  CMPNT  =  0
 
SET  CMPNT_CNT  =  0
 
SET  ADDTNL_CMPNT_IND  =  0
 
DECLARE  CMPNT_DISP_ROW  =  C109
 
SET  CMPNT_DISP_ROW  = ""
 
DECLARE  CMPNT_DISP  =  C34
 
SET  CMPNT_COL  =  0
 
SET  RPT_ROW  =  0
 
DECLARE  TECH_NAME  =  C15
 
DECLARE  PRODUCT_DISP  =  C40
 
DECLARE  PRODUCT_DESC  =  C60
 
DECLARE  PRODUCT_NBR  =  C20
 
DECLARE  PRODUCT_SUB_NBR  =  C5
 
DECLARE  PRODUCT_FLAG_CHARS  =  C2  WITH  PUBLIC , NOCONSTANT ("  " )
 
DECLARE  PRODUCT_NBR_FULL  =  C30
 
DECLARE  ALTERNATE_NBR  =  C20
 
DECLARE  SEGMENT_NBR  =  C20
 
DECLARE  CUR_UNIT_MEAS_DISP  =  C15
 
DECLARE  BB_ID_NBR  =  C20
 
DECLARE  CUR_ABO_DISP  =  C20
 
DECLARE  CUR_RH_DISP  =  C20
 
DECLARE  SUPPLIER_PREFIX  =  C5
 
DECLARE  ACCESSION  =  C20
 
DECLARE  XM_RESULT_VALUE_ALPHA  =  C15
 
DECLARE  XM_RESULT_EVENT_PRSNL_USERNAME  =  C15
 
DECLARE  REASON_DISP  =  C15
 
DECLARE  NAME_FULL_FORMATTED  =  C50
 
DECLARE  ALIAS_MRN  =  C25
 
DECLARE  ALIAS_FIN  =  C25
 
DECLARE  ALIAS_SSN  =  C25
 
DECLARE  ALIAS_MRN_FORMATTED  =  C25
 
DECLARE  ALIAS_FIN_FORMATTED  =  C25
 
DECLARE  ALIAS_SSN_FORMATTED  =  C25
 
DECLARE  AGE  =  C12
 
DECLARE  SEX_DISP  =  C6
 
DECLARE  PATIENT_LOCATION  =  C30
 
DECLARE  PRVDR_NAME_FULL_FORMATTED  =  C50
 
DECLARE  PERSON_ABO_DISP  =  C20
 
DECLARE  PERSON_RH_DISP  =  C20
 
DECLARE  DISPENSE_TECH_USERNAME  =  C15
 
DECLARE  DISPENSE_COURIER  =  C50
 
DECLARE  DISPENSE_PRVDR_NAME  =  C50
 
DECLARE  ADMIT_PRVDR_NAME  =  C50
 
DECLARE  QTY_VOL_DISP  =  C36
 
DECLARE  QTY_VOL_DISP_1  =  C36  WITH  PUBLIC , NOCONSTANT (" " )
 
DECLARE  DERIVATIVE_IND  =  I2  WITH  PUBLIC , NOCONSTANT ( 0 )
 
DECLARE  PATIENT_NAME_BARCODE  =  VC  WITH  PUBLIC , NOCONSTANT (" " )
 
DECLARE  MRN_BARCODE  =  VC  WITH  PUBLIC , NOCONSTANT (" " )
 
DECLARE  FIN_BARCODE  =  VC  WITH  PUBLIC , NOCONSTANT (" " )
 
DECLARE  DOB_BARCODE  =  VC  WITH  PUBLIC , NOCONSTANT (" " )
 
DECLARE  BBID_BARCODE  =  VC  WITH  PUBLIC , NOCONSTANT (" " )
 
DECLARE  PERSON_ABORH_BARCODE  =  VC  WITH  PUBLIC , NOCONSTANT (" " )
 
DECLARE  PRODUCT_BARCODE_NBR  =  C20  WITH  PUBLIC , NOCONSTANT (" " )
 
DECLARE  PRODUCT_NUM_BARCODE  =  VC  WITH  PUBLIC , NOCONSTANT (" " )
 
DECLARE  GETREPORTFILENAME (( SFILENAME = VC )) =  VC
 
SUBROUTINE   GETREPORTFILENAME  ( SFILENAME  )
 
DECLARE  NFILEEXISTS  =  I2  WITH  NOCONSTANT ( 0 )
DECLARE  NNEXTSEQ  =  I2  WITH  NOCONSTANT ( 0 )
DECLARE  SNEWFILENAME  =  VC  WITH  NOCONSTANT ("" )
DECLARE  SFILEEXTENSION  =  C4  WITH  NOCONSTANT ("" )
DECLARE  SFILENAMENOEXTENSION  =  VC  WITH  NOCONSTANT ("" )
SET  NFILEEXISTS  =  FINDFILE ( SFILENAME )
IF ( ( NFILEEXISTS = 1 ) )
WHILE ( ( NFILEEXISTS = 1 ))
 
SET  SFILEEXTENSION  =  SUBSTRING (( TEXTLEN ( SFILENAME )- 3 ),  4 ,  SFILENAME )
SET  SFILENAMENOEXTENSION  =  SUBSTRING ( 1 , ( TEXTLEN ( SFILENAME )- 4 ),  SFILENAME )
SET  NNEXTSEQ  = ( NNEXTSEQ + 1 )
SET  SNEWFILENAME  =  BUILD ( SFILENAMENOEXTENSION , "_" ,  CNVTSTRING ( NNEXTSEQ ),
 SFILEEXTENSION )
SET  NFILEEXISTS  =  FINDFILE ( SNEWFILENAME )
 
ENDWHILE
 
ELSE
SET  SNEWFILENAME  =  SFILENAME
ENDIF
 RETURN ( SNEWFILENAME )
 
 
END ;Subroutine
 
 
IF ( ( VALIDATE ( I18NUAR_DEF ,  999 )= 999 ) )
 CALL ECHO ("Declaring i18nuar_def" )
DECLARE  I18NUAR_DEF  =  I2  WITH  PERSIST
SET  I18NUAR_DEF  =  1
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
 
 
SET  I18NHANDLE  =  0
 
SET  H  =  UAR_I18NLOCALIZATIONINIT ( I18NHANDLE ,  CURPROG , "" ,  CURCCLREV )
 
RECORD  CAPTIONS  (
 1  CROSSMATCH_TRANSFUSION  =  VC
 1  PATIENT  =  VC
 1  ACC_NUM  =  VC
 1  UNIT_NUM  =  VC
 1  MED_REC  =  VC
 1  AGE  =  VC
 1  SEX  =  VC
 1  PRODUCT  =  VC
 1  DESC  =  VC
 1  FINANCIAL_NUM  =  VC
 1  LOCATION  =  VC
 1  DONOR_TYPE  =  VC
 1  PATIENT_TYPE  =  VC
 1  BLOOD_BANK_ID  =  VC
 1  UNIT_EXP  =  VC
 1  DOCTOR  =  VC
 1  CROSSMATCH_INTERP  =  VC
 1  CROSSMATCH_EXPIRATION  =  VC
 1  BEFORE_TRANSFUSION  =  VC
 1  IDENTIFIED_RECIPIENT  =  VC
 1  CLERICAL_CHECK  =  VC
 1  OF_THE_WRISTBAND  =  VC
 1  NUMBER_ON_FORM  =  VC
 1  RELEASED_DATE  =  VC
 1  FURTHER_CERTIFY  =  VC
 1  UNIT_NUMBER  =  VC
 1  STATED_ON_FORM  =  VC
 1  TRANSPORTED_BY  =  VC
 1  TIME_STARTED  =  VC
 1  RECEIVED_DATE  =  VC
 1  BY_TIME  =  VC
 1  TIME_ENDED  =  VC
 1  TRANSFUSIONIST  =  VC
 1  LEUKOFILTERED  =  VC
 1  IRRADIATED  =  VC
 1  CMV_NEG  =  VC
 1  VOL_REDUCED  =  VC
 1  AUTOLOGOUS  =  VC
 1  DIRECTED  =  VC
 1  HLA_TYPED  =  VC
 1  HGB_S_NEG  =  VC
 1  IGA_DEFICIENT  =  VC
 1  OTHER  =  VC
 1  ABSC  =  VC
 1  RETURN_TO_BB  =  VC
 1  IN_30_MIN  =  VC
 1  REFRIGERATOR  =  VC
 1  HOSPITAL_NAME  =  VC
 1  HOSPITAL_ADDRESS  =  VC
 1  CLIA_NUM  =  VC
 1  ORIGINAL_TO_CHART  =  VC
 1  COPY_TO_LAB  =  VC )
 
SET  CAPTIONS -> CROSSMATCH_TRANSFUSION  =  UAR_I18NGETMESSAGE ( I18NHANDLE ,
"crossmatch_transfusion" , "CROSSMATCH TRANSFUSION TAG" )
 
SET  CAPTIONS -> PATIENT  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "patient" , "PATIENT:" )
 
SET  CAPTIONS -> ACC_NUM  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "acc_num" , "ACC:" )
 
SET  CAPTIONS -> UNIT_NUM  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "unit_num" , "UNIT NO:" )
 
SET  CAPTIONS -> MED_REC  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "med_rec" , "MED REC:" )
 
SET  CAPTIONS -> AGE  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "age" , "AGE:" )
 
SET  CAPTIONS -> SEX  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "sex" , "SEX:" )
 
SET  CAPTIONS -> PRODUCT  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "product" , "PRODUCT:" )
 
SET  CAPTIONS -> DESC  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "desc" , "DESC:" )
 
SET  CAPTIONS -> FINANCIAL_NUM  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "financial_num" ,
"FINANCIAL #:" )
 
SET  CAPTIONS -> LOCATION  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "location" , "LOC:" )
 
SET  CAPTIONS -> DONOR_TYPE  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "donor_type" , "DONOR TYPE:" )
 
SET  CAPTIONS -> PATIENT_TYPE  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "patient_type" ,
"PATIENT TYPE:" )
 
SET  CAPTIONS -> BLOOD_BANK_ID  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "blood_bank_id" ,
"BLOOD BANK ID:" )
 
SET  CAPTIONS -> UNIT_EXP  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "unit_exp" , "UNIT EXP:" )
 
SET  CAPTIONS -> DOCTOR  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "doctor" , "DOCTOR:" )
 
SET  CAPTIONS -> CROSSMATCH_INTERP  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "crossmatch_interp" ,
"CROSSMATCH INTERP         TECH             DATE      TIME" )
 
SET  CAPTIONS -> CROSSMATCH_EXPIRATION  =  UAR_I18NGETMESSAGE ( I18NHANDLE ,
"crossmatch_expiration" , "CROSSMATCH EXPIRATION:" )
 
SET  CAPTIONS -> BEFORE_TRANSFUSION  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "before_transfusion" ,
"BEFORE STARTING TRANSFUSION, I CERTIFY THAT I HAVE" )
 
SET  CAPTIONS -> IDENTIFIED_RECIPIENT  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "identified_recipient"
, "IDENTIFIED THE RECIPIENT BY INSPECTION" )
 
SET  CAPTIONS -> CLERICAL_CHECK  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "clerical_check" ,
"CLERICAL CHECK BY:______________" )
 
SET  CAPTIONS -> OF_THE_WRISTBAND  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "of_the_wristband" ,
"OF THE WRISTBAND AND THAT THE NAME AND MED RECORD" )
 
SET  CAPTIONS -> NUMBER_ON_FORM  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "number_on_form" ,
"NUMBER ARE THE SAME AS ON THIS FORM.  I" )
 
SET  CAPTIONS -> RELEASED_DATE  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "released_date" ,
"RELEASED          DATE:_________" )
 
SET  CAPTIONS -> FURTHER_CERTIFY  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "further_certify" ,
"FURTHER CERTIFY THAT THE DONOR UNIT LABEL HAS THE SAME" )
 
SET  CAPTIONS -> UNIT_NUMBER  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "unit_number" ,
"UNIT NUMBER, ABO GROUP, AND RH AS" )
 
SET  CAPTIONS -> STATED_ON_FORM  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "stated_on_form" ,
"STATED ON THIS FORM" )
 
SET  CAPTIONS -> TRANSPORTED_BY  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "transported_by" ,
"TRANSPORTED BY:" )
 
SET  CAPTIONS -> TIME_STARTED  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "time_started" , "TIME STARTED"
)
 
SET  CAPTIONS -> RECEIVED_DATE  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "received_date" ,
"RECEIVED          DATE:_________" )
 
SET  CAPTIONS -> BY_TIME  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "by_time" ,
"BY:___________    TIME:_________" )
 
SET  CAPTIONS -> TIME_ENDED  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "time_ended" , "TIME ENDED" )
 
SET  CAPTIONS -> TRANSFUSIONIST  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "transfusionist" ,
"TRANSFUSIONIST" )
 
SET  CAPTIONS -> LEUKOFILTERED  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "leukofiltered" ,
"LEUKOFILTERED:  _____" )
 
SET  CAPTIONS -> IRRADIATED  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "irradiated" ,
"IRRADIATED:     _____" )
 
SET  CAPTIONS -> CMV_NEG  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "cmv_neg" , "CMV NEG:        _____" )
 
SET  CAPTIONS -> VOL_REDUCED  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "vol_reduced" ,
"VOLUME REDUCED: _____" )
 
SET  CAPTIONS -> AUTOLOGOUS  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "autologous" ,
"AUTOLOGOUS:     _____" )
 
SET  CAPTIONS -> DIRECTED  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "directed" ,
"DIRECTED:       _____" )
 
SET  CAPTIONS -> HLA_TYPED  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "hla_typed" ,
"HLA TYPED:      _____" )
 
SET  CAPTIONS -> HGB_S_NEG  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "hgb_s_neg" ,
"HGB S NEG:      _____" )
 
SET  CAPTIONS -> IGA_DEFICIENT  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "iga_deficient" ,
"IGA DEFICIENT:  _____" )
 
SET  CAPTIONS -> OTHER  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "other" , "OTHER: ______________" )
 
SET  CAPTIONS -> ABSC  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "absc" , "ABSC:           _____" )
 
SET  CAPTIONS -> RETURN_TO_BB  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "return_to_bb" ,
"RETURN TO BLOOD BANK IF TRANSFUSION NOT STARTED" )
 
SET  CAPTIONS -> IN_30_MIN  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "in_30_min" ,
"IN 30 MIN.  DO NOT PLACE THIS UNIT IN AN UNMONITORED" )
 
SET  CAPTIONS -> REFRIGERATOR  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "refrigerator" ,
"REFRIGERATOR, MICROWAVE OR NEAR A HEATING VENT." )
 
SET  CAPTIONS -> HOSPITAL_NAME  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "hospital_name" ,
"HOSPITAL NAME" )
 
SET  CAPTIONS -> HOSPITAL_ADDRESS  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "hospital_address" ,
"HOSPITAL ADDRESS" )
 
SET  CAPTIONS -> CLIA_NUM  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "clia_num" , "CLIA # " )
 
SET  CAPTIONS -> ORIGINAL_TO_CHART  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "original_to_chart" ,
"ORIGINAL TO CHART" )
 
SET  CAPTIONS -> COPY_TO_LAB  =  UAR_I18NGETMESSAGE ( I18NHANDLE , "copy_to_lab" , "COPY TO LAB" )
 
DECLARE  MRN_CD  =  F8  WITH  CONSTANT ( UAR_GET_CODE_BY ("MEANING" ,  319 , "MRN" )), PROTECT
 
SET  RPT_DATE  =  0
 
 EXECUTE CPM_CREATE_FILE_NAME_LOGICAL "bbt_tag_xm" ,
"txt" ,
"x"
 
SET  RPT_FILENAME  =  CPM_CFN_INFO -> FILE_NAME
 
SELECT  INTO  CPM_CFN_INFO -> FILE_NAME_LOGICAL
D.SEQ,
 MRN_FORMT = SUBSTRING ( 1 ,  11 ,  CNVTALIAS (EA.ALIAS, EA.ALIAS_POOL_CD))
FROM ( DUMMYT  D  WITH  SEQ = VALUE ( TOT_TAG_CNT )),
( ENCNTR_ALIAS  EA )
 PLAN ( D )
 AND ( EA
WHERE ( TAG_REQUEST -> TAGLIST [D.SEQ]-> ENCNTR_ID =EA.ENCNTR_ID)
AND (EA.ENCNTR_ALIAS_TYPE_CD= MRN_CD )
and (ea.active_ind = 1)							;001
and (ea.end_effective_dt_tm > sysdate))			;001
 
 
HEAD REPORT
 MAXLINES = 240 ,
 POSVAR = FILLSTRING ( 30 , " " ),
 XVAR = 0 ,
 YVAR = 0 ,
 YVAR1 = 0 ,
 XVAR1 = 0 ,
 XOFFSET = 0 ,
 YOFFSET = 5 ,
 
MACRO ( SET_FONT_1 )
 LINEFEED = 12 ,
"{f/2/1}{lpi/6}{cpi/18}" ,
 ROW + 1
ENDMACRO
,
 
MACRO ( CALC_POS )
 ROW + 1 ,
 XVAR =( XVAR1 + XOFFSET ),
 YVAR =( YVAR1 + YOFFSET ),
 
 CALL PRINT ( CALCPOS ( XVAR ,  YVAR )),
 XVAR1 = 0
ENDMACRO
,
 
MACRO ( FORM_FEED )
 ROW + 1 ,
 YVAR1 = 0 ,
 XVAR1 = 0 ,
"{NP}" ,
 ROW + 1
ENDMACRO
,
 
MACRO ( LINE_FEED )
 ROW + 1 ,
 YVAR1 =( YVAR1 + LINEFEED ),
 
IF ( ( YVAR1 >= MAXLINES ) )  FORM_FEED
ENDIF
 
ENDMACRO
 
HEAD D.SEQ
 NULL
DETAIL
 PE_EVENT_DT_TM = CNVTDATETIME ( TAG_REQUEST -> TAGLIST [D.SEQ]-> PE_EVENT_DT_TM ),
 TECH_NAME = TRIM ( TAG_REQUEST -> TAGLIST [D.SEQ]-> TECH_NAME ),
 PRODUCT_DISP = TRIM ( TAG_REQUEST -> TAGLIST [D.SEQ]-> PRODUCT_DISP ),
 PRODUCT_DESC = TRIM ( TAG_REQUEST -> TAGLIST [D.SEQ]-> PRODUCT_DESC ),
 PRODUCT_NBR = TRIM ( TAG_REQUEST -> TAGLIST [D.SEQ]-> PRODUCT_NBR ),
 PRODUCT_SUB_NBR = TRIM ( TAG_REQUEST -> TAGLIST [D.SEQ]-> PRODUCT_SUB_NBR ),
 PRODUCT_NBR_FULL = CONCAT ( TRIM ( TAG_REQUEST -> TAGLIST [D.SEQ]-> SUPPLIER_PREFIX ),  TRIM (
 TAG_REQUEST -> TAGLIST [D.SEQ]-> PRODUCT_NBR ), " " ,  TRIM ( TAG_REQUEST -> TAGLIST [D.SEQ]->
 PRODUCT_SUB_NBR )),
 ALTERNATE_NBR = TRIM ( TAG_REQUEST -> TAGLIST [D.SEQ]-> ALTERNATE_NBR ),
 SEGMENT_NBR = TRIM ( TAG_REQUEST -> TAGLIST [D.SEQ]-> SEGMENT_NBR ),
 
IF ( ( TAG_REQUEST -> TAGLIST [D.SEQ]-> CUR_VOLUME > 0 ) )  CUR_VOLUME = TRIM ( CNVTSTRING (
 TAG_REQUEST -> TAGLIST [D.SEQ]-> CUR_VOLUME ))
ELSE   CUR_VOLUME =" "
ENDIF
,
 CUR_UNIT_MEAS_DISP = TRIM ( TAG_REQUEST -> TAGLIST [D.SEQ]-> CUR_UNIT_MEAS_DISP ),
 BB_ID_NBR = TRIM ( TAG_REQUEST -> TAGLIST [D.SEQ]-> BB_ID_NBR ),
 PRODUCT_EXPIRE_DT_TM = CNVTDATETIME ( TAG_REQUEST -> TAGLIST [D.SEQ]-> PRODUCT_EXPIRE_DT_TM ),
 
IF ( ( TAG_REQUEST -> TAGLIST [D.SEQ]-> DERIVATIVE_IND != 1 ) )  CUR_ABO_DISP = TRIM ( TAG_REQUEST
-> TAGLIST [D.SEQ]-> CUR_ABO_DISP ),  CUR_RH_DISP = TRIM ( TAG_REQUEST -> TAGLIST [D.SEQ]->
 CUR_RH_DISP ),  SUPPLIER_PREFIX = TRIM ( TAG_REQUEST -> TAGLIST [D.SEQ]-> SUPPLIER_PREFIX ),
 QTY_VOL_DISP = CONCAT ("VOL: " ,  TRIM ( CNVTSTRING ( TAG_REQUEST -> TAGLIST [D.SEQ]-> CUR_VOLUME )
), " " ,  TRIM ( TAG_REQUEST -> TAGLIST [D.SEQ]-> CUR_UNIT_MEAS_DISP ))
ELSE   CUR_ABO_DISP =" " ,  CUR_RH_DISP =" " ,  SUPPLIER_PREFIX =" " ,
IF ( ( TAG_REQUEST -> TAGLIST [D.SEQ]-> ITEM_UNIT_PER_VIAL = 0 ) )  QTY_VOL_DISP = CONCAT ("QTY: "
,  TRIM ( CNVTSTRING ( TAG_REQUEST -> TAGLIST [D.SEQ]-> QUANTITY )), "  VOL: " ,  TRIM ( CNVTSTRING
( TAG_REQUEST -> TAGLIST [D.SEQ]-> ITEM_VOLUME )), " " ,  TRIM ( TAG_REQUEST -> TAGLIST [D.SEQ]->
 ITEM_UNIT_MEAS_DISP ))
ELSE   QTY_VOL_DISP = CONCAT ("QTY: " ,  TRIM ( CNVTSTRING ( TAG_REQUEST -> TAGLIST [D.SEQ]->
 QUANTITY )), "  IU PER: " ,  TRIM ( CNVTSTRING ( TAG_REQUEST -> TAGLIST [D.SEQ]->
 ITEM_UNIT_PER_VIAL )), "  TOT IU: " ,  TRIM ( CNVTSTRING ( TAG_REQUEST -> TAGLIST [D.SEQ]->
 ITEM_VOLUME )))
ENDIF
 
ENDIF
,
 ACCESSION = TRIM ( TAG_REQUEST -> TAGLIST [D.SEQ]-> ACCESSION ),
 XM_RESULT_VALUE_ALPHA = TRIM ( TAG_REQUEST -> TAGLIST [D.SEQ]-> XM_RESULT_VALUE_ALPHA ),
 XM_RESULT_EVENT_PRSNL_USERNAME = TRIM ( TAG_REQUEST -> TAGLIST [D.SEQ]->
 XM_RESULT_EVENT_PRSNL_USERNAME ),
 XM_RESULT_EVENT_DT_TM = CNVTDATETIME ( TAG_REQUEST -> TAGLIST [D.SEQ]-> XM_RESULT_EVENT_DT_TM ),
 XM_EXPIRE_DT_TM = CNVTDATETIME ( TAG_REQUEST -> TAGLIST [D.SEQ]-> XM_EXPIRE_DT_TM ),
 REASON_DISP = TRIM ( TAG_REQUEST -> TAGLIST [D.SEQ]-> REASON_DISP ),
 
IF (  (( ( TAG_TYPE != EMERGENCY_TAG ) )  OR  (( TAG_REQUEST -> TAGLIST [D.SEQ]->
 UNKNOWN_PATIENT_IND != 1 ) ))  )  NAME_FULL_FORMATTED = TRIM ( TAG_REQUEST -> TAGLIST [D.SEQ]->
 NAME_FULL_FORMATTED ),  ALIAS_MRN = TRIM ( TAG_REQUEST -> TAGLIST [D.SEQ]-> ALIAS_MRN ),
 ALIAS_FIN = TRIM ( TAG_REQUEST -> TAGLIST [D.SEQ]-> ALIAS_FIN ),  ALIAS_SSN = TRIM ( TAG_REQUEST ->
 TAGLIST [D.SEQ]-> ALIAS_SSN ),  AGE = TRIM ( TAG_REQUEST -> TAGLIST [D.SEQ]-> AGE ),  SEX_DISP =
 TRIM ( TAG_REQUEST -> TAGLIST [D.SEQ]-> SEX_DISP ),  PATIENT_LOCATION = TRIM ( TAG_REQUEST ->
 TAGLIST [D.SEQ]-> PATIENT_LOCATION ),  PRVDR_NAME_FULL_FORMATTED = TRIM ( TAG_REQUEST -> TAGLIST [
D.SEQ]-> PRVDR_NAME_FULL_FORMATTED ),  PERSON_ABO_DISP = TRIM ( TAG_REQUEST -> TAGLIST [D.SEQ]->
 PERSON_ABO_DISP ),  PERSON_RH_DISP = TRIM ( TAG_REQUEST -> TAGLIST [D.SEQ]-> PERSON_RH_DISP ),
 BIRTH_DT_TM = CNVTDATETIME ( TAG_REQUEST -> TAGLIST [D.SEQ]-> BIRTH_DT_TM )
ELSE   NAME_FULL_FORMATTED = TAG_REQUEST -> TAGLIST [D.SEQ]-> UNKNOWN_PATIENT_TEXT ,  ALIAS_MRN =
" " ,  ALIAS_FIN =" " ,  AGE =" " ,  SEX_DISP =" " ,  PATIENT_LOCATION =" " ,
 PRVDR_NAME_FULL_FORMATTED =" " ,  PERSON_ABO_DISP =" " ,  PERSON_RH_DISP =" " ,  BIRTH_DT_TM =
 CNVTDATETIME ("" )
ENDIF
,
 ANTIBODY_CNT = CNVTINT ( TAG_REQUEST -> TAGLIST [D.SEQ]-> ANTIBODY_CNT ),
 STAT = ALTER ( ANTIBODY -> ANTIBODYLIST ,  TAG_REQUEST -> TAGLIST [D.SEQ]-> ANTIBODY_CNT ),
 
FOR (  ANTBDY  =  1  TO  ANTIBODY_CNT  )
 ANTIBODY -> ANTIBODYLIST [ ANTBDY ]-> ANTIBODY_CD = TAG_REQUEST -> TAGLIST [D.SEQ]-> ANTIBODYLIST [
 ANTBDY ]-> ANTIBODY_CD , ANTIBODY -> ANTIBODYLIST [ ANTBDY ]-> ANTIBODY_DISP = TRIM ( TAG_REQUEST
-> TAGLIST [D.SEQ]-> ANTIBODYLIST [ ANTBDY ]-> ANTIBODY_DISP ), ANTIBODY -> ANTIBODYLIST [ ANTBDY ]
-> TRANS_REQ_IND = TAG_REQUEST -> TAGLIST [D.SEQ]-> ANTIBODYLIST [ ANTBDY ]-> TRANS_REQ_IND
 
ENDFOR
,
 ANTIGEN_CNT = CNVTINT ( TAG_REQUEST -> TAGLIST [D.SEQ]-> ANTIGEN_CNT ),
 STAT = ALTER ( ANTIGEN -> ANTIGENLIST ,  TAG_REQUEST -> TAGLIST [D.SEQ]-> ANTIGEN_CNT ),
 
FOR (  ANTGEN  =  1  TO  ANTIGEN_CNT  )
 ANTIGEN -> ANTIGENLIST [ ANTGEN ]-> ANTIGEN_CD = TAG_REQUEST -> TAGLIST [D.SEQ]-> ANTIGENLIST [
 ANTGEN ]-> ANTIGEN_CD , ANTIGEN -> ANTIGENLIST [ ANTGEN ]-> ANTIGEN_DISP = TRIM ( TAG_REQUEST ->
 TAGLIST [D.SEQ]-> ANTIGENLIST [ ANTGEN ]-> ANTIGEN_DISP )
 
ENDFOR
,
 CMPNT_CNT = TAG_REQUEST -> TAGLIST [D.SEQ]-> CMPNT_CNT ,
 STAT = ALTER ( COMPONENT -> CMPNTLIST ,  TAG_REQUEST -> TAGLIST [D.SEQ]-> CMPNT_CNT ),
 
FOR (  CMPNT  =  1  TO  CMPNT_CNT  )
 COMPONENT -> CMPNTLIST [ CMPNT ]-> PRODUCT_ID = TAG_REQUEST -> TAGLIST [D.SEQ]-> CMPNTLIST [ CMPNT
]-> PRODUCT_ID , COMPONENT -> CMPNTLIST [ CMPNT ]-> PRODUCT_CD = TAG_REQUEST -> TAGLIST [D.SEQ]->
 CMPNTLIST [ CMPNT ]-> PRODUCT_CD , COMPONENT -> CMPNTLIST [ CMPNT ]-> PRODUCT_DISP = TRIM (
 TAG_REQUEST -> TAGLIST [D.SEQ]-> CMPNTLIST [ CMPNT ]-> PRODUCT_DISP ), COMPONENT -> CMPNTLIST [
 CMPNT ]-> PRODUCT_NBR = TRIM ( TAG_REQUEST -> TAGLIST [D.SEQ]-> CMPNTLIST [ CMPNT ]-> PRODUCT_NBR )
, COMPONENT -> CMPNTLIST [ CMPNT ]-> PRODUCT_SUB_NBR = TRIM ( TAG_REQUEST -> TAGLIST [D.SEQ]->
 CMPNTLIST [ CMPNT ]-> PRODUCT_SUB_NBR ), COMPONENT -> CMPNTLIST [ CMPNT ]-> CUR_ABO_CD =
 TAG_REQUEST -> TAGLIST [D.SEQ]-> CMPNTLIST [ CMPNT ]-> CUR_ABO_CD , COMPONENT -> CMPNTLIST [ CMPNT
]-> CUR_ABO_DISP = TRIM ( TAG_REQUEST -> TAGLIST [D.SEQ]-> CMPNTLIST [ CMPNT ]-> CUR_ABO_DISP ),
 COMPONENT -> CMPNTLIST [ CMPNT ]-> SUPPLIER_PREFIX = TRIM ( TAG_REQUEST -> TAGLIST [D.SEQ]->
 CMPNTLIST [ CMPNT ]-> SUPPLIER_PREFIX ), COMPONENT -> CMPNTLIST [ CMPNT ]-> CUR_RH_CD =
 TAG_REQUEST -> TAGLIST [D.SEQ]-> CMPNTLIST [ CMPNT ]-> CUR_RH_CD , COMPONENT -> CMPNTLIST [ CMPNT ]
-> CUR_RH_DISP = TRIM ( TAG_REQUEST -> TAGLIST [D.SEQ]-> CMPNTLIST [ CMPNT ]-> CUR_RH_DISP )
 
ENDFOR
,
 DISPENSE_TECH_USERNAME = TRIM ( TAG_REQUEST -> TAGLIST [D.SEQ]-> DISPENSE_TECH_USERNAME ),
 DISPENSE_DT_TM = CNVTDATETIME ( TAG_REQUEST -> TAGLIST [D.SEQ]-> DISPENSE_DT_TM ),
 DISPENSE_COURIER = TRIM ( TAG_REQUEST -> TAGLIST [D.SEQ]-> DISPENSE_COURIER ),
 DISPENSE_PRVDR_NAME = TRIM ( TAG_REQUEST -> TAGLIST [D.SEQ]-> DISPENSE_PRVDR_NAME ),
 YVAR1 = 0 ,
 SET_FONT_1 ,
 XVAR1 = 0 ,
 CALC_POS ,
"Name: " ,
 NAME_FULL_FORMATTED ,
 XVAR1 = 165 ,
 CALC_POS ,
"DOB: " ,
 BIRTH_DT_TM "mm/dd/yyyy;;d"
,
 LINE_FEED ,
 XVAR1 = 0 ,
 CALC_POS ,
"MRN: " ,
 MRN_FORMT ,
 XVAR1 = 165 ,
 CALC_POS ,
"Armband #: " ,
 BB_ID_NBR ,
 LINE_FEED ,
 PERSON_ABORH_DISP = CONCAT ( TRIM ( PERSON_ABO_DISP ), " " ,  TRIM ( PERSON_RH_DISP )),
 XVAR1 = 0 ,
 CALC_POS ,
"Patient ABO/Rh: " ,
 PERSON_ABORH_DISP ,
 PRODUCT_ABORH_DISP = CONCAT ( TRIM ( CUR_ABO_DISP ), " " ,  TRIM ( CUR_RH_DISP )),
 XVAR1 = 165 ,
 CALC_POS ,
"Unit ABO/Rh: " ,
 PRODUCT_ABORH_DISP ,
 LINE_FEED ,
 XVAR1 = 0 ,
 CALC_POS ,
"XM Expires: " ,
 XM_EXPIRE_DT_TM "mm/dd/yyyy;;d"
,
 XVAR1 = 165 ,
 CALC_POS ,
"Unit Expires: " ,
 PRODUCT_EXPIRE_DT_TM "mm/dd/yyyy;;d"
,
 LINE_FEED ,
 XVAR1 = 0 ,
 CALC_POS ,
"Compatible with Unit: " ,
 PRODUCT_NBR_FULL ,
 XVAR1 = 165 ,
 CALC_POS ,
"Tech:_________________" ,
 LINE_FEED
FOOT  D.SEQ
 
IF ( (D.SEQ> 0 ) AND (D.SEQ!= TOT_TAG_CNT ) ) BREAK
ENDIF
 
 WITH  DIO = 16 , NULLREPORT
 END GO
