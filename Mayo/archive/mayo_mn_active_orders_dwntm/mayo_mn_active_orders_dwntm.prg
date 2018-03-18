;copy of translated version of CERN_DCP_RPT_ORDER_PROFILE_ASC
;created on 12/13/11 by Akcia - SE
DROP PROGRAM   mayo_mn_active_orders_dwntm : DBA  GO
CREATE PROGRAM  mayo_mn_active_orders_dwntm : DBA
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
 
with OUTDEV
 
 
 
RECORD  TEMP  (
1 qual[*]
 2 encntr_id = f8
 2 person_id = f8
 2 display_ind = c1
 2  NAME  =  VC
 2  MRN  =  VC
 2  FNBR  =  VC
 2  UNIT  =  VC
 2  ROOM  =  VC
 2  BED  =  VC
 2  AGE  =  VC
 2  DOB  =  VC
 2  SEX  =  VC
 2  ADM_DATE  =  VC
 2  DISCH_DATE  =  VC
 2  PT_TYPE  =  VC
 2  ATTEND_MD  =  VC
 2  ADMIT_DX  =  VC
 2  DX_CNT  =  I2
 2  DX_QUAL [*]
 	3  DX_LINE  =  VC
 2  CAT_CNT  =  I2
 2  CAT_QUAL [*]
 	3  CATALOG_TYPE  =  VC
 	3  ORD_CNT  =  I2
 	3  ORD_QUAL [*]
 		4  ORDER_ID  =  F8
 		4  IV_IND  =  I2
 		4  DATE  =  VC
 		4  STATUS  =  VC
 		4  MNEMONIC  =  VC
; 		3  M_CNT  =  I2
; 		3  M_QUAL [*]
; 			4  M_LINE  =  VC
 		4  DISPLAY_LINE  =  VC
; 		3  DISP_CNT  =  I2
; 		3  DISP_QUAL [*]
; 			4  DISP_LINE  =  VC
 		4  COMMENT_IND  =  I2
 		4  COMMENT  =  VC
; 		3  C_CNT  =  I2
; 		3  C_QUAL [*]
; 			4  C_LINE  =  VC
 		4  OE_FORMAT_ID  =  F8
 		4  CLIN_LINE_IND  =  I2
 		4  STAT_IND  =  I2
; 		3  D_CNT  =  I2
; 		3  D_QUAL [*]
; 			4  FIELD_DESCRIPTION  =  VC
; 			4  LABEL_TEXT  =  VC
; 			4  VALUE  =  VC
; 			4  FIELD_VALUE  =  F8
; 			4  OE_FIELD_MEANING_ID  =  F8
; 			4  GROUP_SEQ  =  I4
; 			4  PRINT_IND  =  I2
; 			4  CLIN_LINE_IND  =  I2
; 			4  LABEL  =  VC
; 			4  SUFFIX  =  I2
)
 
RECORD  PT  (
 1  LINE_CNT  =  I2
 1  LNS [*]
 2  LINE  =  VC )
 
declare cat_type = vc
declare disp = vc
 
SET  CNT  =  0
 
SET  CODE_VALUE  =  0
 
SET  CODE_SET  =  0
 
SET  CDF_MEANING  =  FILLSTRING ( 12 ,  " " )
 
SET  MRN_ALIAS_CD  =  0
 
SET  FINNBR_CD  =  0
 
SET  ATTEND_MD_CD  =  0
 
SET  ORDERED_CD  =  0
 
SET  INPROCESS_CD  =  0
 
SET  FUTURE_CD  =  0
 
SET  PENDING_CD  =  0
 
SET  PHARMACY_CD  =  0
 
SET  IV_CD  =  0
 
SET  ORD_COMM_CD  =  0
 
SET  CODE_SET  =  319
 
SET  CDF_MEANING  =  "MRN"
 
 EXECUTE CPM_GET_CD_FOR_CDF
 
SET  MRN_ALIAS_CD  =  CODE_VALUE
 
SET  CODE_SET  =  319
 
SET  CDF_MEANING  =  "FIN NBR"
 
 EXECUTE CPM_GET_CD_FOR_CDF
 
SET  FINNBR_CD  =  CODE_VALUE
 
SET  CODE_SET  =  333
 
SET  CDF_MEANING  =  "ATTENDDOC"
 
 EXECUTE CPM_GET_CD_FOR_CDF
 
SET  ATTEND_MD_CD  =  CODE_VALUE
 
SET  CODE_SET  =  6004
 
SET  CDF_MEANING  =  "ORDERED"
 
 EXECUTE CPM_GET_CD_FOR_CDF
 
SET  ORDERED_CD  =  CODE_VALUE
 
SET  CODE_SET  =  6004
 
SET  CDF_MEANING  =  "INPROCESS"
 
 EXECUTE CPM_GET_CD_FOR_CDF
 
SET  INPROCESS_CD  =  CODE_VALUE
 
SET  CODE_SET  =  6004
 
SET  CDF_MEANING  =  "FUTURE"
 
 EXECUTE CPM_GET_CD_FOR_CDF
 
SET  FUTURE_CD  =  CODE_VALUE
 
SET  CODE_SET  =  6004
 
SET  CDF_MEANING  =  "PENDING"
 
 EXECUTE CPM_GET_CD_FOR_CDF
 
SET  PENDING_CD  =  CODE_VALUE
 
SET  CODE_SET  =  6000
 
SET  CDF_MEANING  =  "PHARMACY"
 
 EXECUTE CPM_GET_CD_FOR_CDF
 
SET  PHARMACY_CD  =  CODE_VALUE
 
SET  CODE_SET  =  16389
 
SET  CDF_MEANING  =  "IVSOLUTIONS"
 
 EXECUTE CPM_GET_CD_FOR_CDF
 
SET  IV_CD  =  CODE_VALUE
 
SET  CODE_SET  =  14
 
SET  CDF_MEANING  =  "ORD COMMENT"
 
 EXECUTE CPM_GET_CD_FOR_CDF
 
SET  ORD_COMM_CD  =  CODE_VALUE
declare suspended_cd = f8 with protect, constant(uar_get_code_by("MEANING", 6004, "SUSPENDED"))
declare census_cd = f8 with protect, constant(uar_get_code_by("MEANING", 339, "CENSUS"))
 
 
set encounter_id =      77576394.00  ; 77570880.00  ;77570812.00   ;      77570904.00
 call echo("before")
SELECT  INTO  "NL:"
FROM
code_value cv,
nurse_unit nu,
encntr_domain ed,
( ENCOUNTER  E ),
( PERSON  P ),
( ENCNTR_ALIAS  EA ),
( DUMMYT  D  WITH  SEQ = 1 ),
( ENCNTR_PRSNL_RELTN  EPR ),
( PRSNL  PL )
 PLAN (cv
 where (cv.code_set =  220)
   and (cv.active_ind = 1)
   and (cv.cdf_meaning = "FACILITY")
   and (cv.display = "LC*"))
 and (nu
 where (nu.loc_facility_cd = cv.code_value)
   and (nu.active_ind = 1))
 and (ed
 where (ed.loc_nurse_unit_cd = nu.location_cd)
   and (ed.end_effective_dt_tm+0 > sysdate)
   and (ed.active_ind = 1)
   and (ed.encntr_domain_type_cd = census_cd))
 
 and ( E
WHERE (E.ENCNTR_ID= ed.encntr_id ))
 AND ( P
WHERE (P.PERSON_ID=E.PERSON_ID))
 AND ( EA
WHERE (E.ENCNTR_ID=EA.ENCNTR_ID) AND (EA.ENCNTR_ALIAS_TYPE_CD IN ( FINNBR_CD ,
 MRN_ALIAS_CD )) AND ( 1 =EA.ACTIVE_IND) AND (EA.BEG_EFFECTIVE_DT_TM<= CNVTDATETIME ( CURDATE ,
 CURTIME3 )) AND (EA.END_EFFECTIVE_DT_TM>= CNVTDATETIME ( CURDATE ,  CURTIME3 )))
 AND ( D )
 AND ( EPR
WHERE (EPR.ENCNTR_ID=E.ENCNTR_ID) AND (EPR.ENCNTR_PRSNL_R_CD= ATTEND_MD_CD ) AND (EPR.ACTIVE_IND= 1
) AND  (( (EPR.EXPIRATION_IND!= 1 ) )  OR  (EPR.EXPIRATION_IND= NULL  )) )
 AND ( PL
WHERE (PL.PERSON_ID=EPR.PRSNL_PERSON_ID))
 order p.name_full_formatted, p.person_id
 
HEAD REPORT
pcnt = 0
 
head p.person_id
pcnt = pcnt + 1
stat = alterlist(temp->qual,pcnt)
 TEMP ->qual[pcnt]-> NAME = SUBSTRING ( 1 ,  30 , P.NAME_FULL_FORMATTED),
 
IF ( (EA.ENCNTR_ALIAS_TYPE_CD= MRN_ALIAS_CD ) )
IF ( (EA.ALIAS_POOL_CD> 0 ) )  TEMP ->qual[pcnt]-> MRN = CNVTALIAS (EA.ALIAS, EA.ALIAS_POOL_CD)
ELSE   TEMP ->qual[pcnt]-> MRN =EA.ALIAS
ENDIF
 
ENDIF
,
 
IF ( (EA.ENCNTR_ALIAS_TYPE_CD= FINNBR_CD ) )
IF ( (EA.ALIAS_POOL_CD> 0 ) )  TEMP ->qual[pcnt]-> FNBR = CNVTALIAS (EA.ALIAS, EA.ALIAS_POOL_CD)
ELSE   TEMP ->qual[pcnt]-> FNBR =EA.ALIAS
ENDIF
 
ENDIF
TEMP->qual[pcnt]->encntr_id = e.encntr_id
TEMP->qual[pcnt]->person_id = p.person_id
 TEMP ->qual[pcnt]-> UNIT = UAR_GET_CODE_DISPLAY (E.LOC_NURSE_UNIT_CD),
 TEMP ->qual[pcnt]-> ROOM = UAR_GET_CODE_DISPLAY (E.LOC_ROOM_CD),
 TEMP ->qual[pcnt]-> BED = UAR_GET_CODE_DISPLAY (E.LOC_BED_CD),
 TEMP ->qual[pcnt]-> AGE = TRIM ( CNVTAGE ( CNVTDATE (P.BIRTH_DT_TM),  CURDATE ),  3 ),
 TEMP ->qual[pcnt]-> DOB = FORMAT (P.BIRTH_DT_TM,  "@SHORTDATE" ),
 TEMP ->qual[pcnt]-> SEX = UAR_GET_CODE_DISPLAY (P.SEX_CD),
 TEMP ->qual[pcnt]-> ADM_DATE = FORMAT (E.REG_DT_TM,  "@SHORTDATE" ),
 TEMP ->qual[pcnt]-> DISCH_DATE = FORMAT (E.DISCH_DT_TM,  "@SHORTDATE" ),
 TEMP ->qual[pcnt]-> PT_TYPE = UAR_GET_CODE_DISPLAY (E.ENCNTR_TYPE_CD),
 TEMP ->qual[pcnt]-> ATTEND_MD =PL.NAME_FULL_FORMATTED,
 TEMP ->qual[pcnt]-> ADMIT_DX =E.REASON_FOR_VISIT
  TEMP ->qual[d.seq]->display_ind = "N"
 
DETAIL
 
IF ( (EA.ENCNTR_ALIAS_TYPE_CD= MRN_ALIAS_CD ) )
IF ( (EA.ALIAS_POOL_CD> 0 ) )  TEMP ->qual[pcnt]-> MRN = CNVTALIAS (EA.ALIAS, EA.ALIAS_POOL_CD)
ELSE   TEMP ->qual[pcnt]-> MRN =EA.ALIAS
ENDIF
 
ENDIF
,
 
IF ( (EA.ENCNTR_ALIAS_TYPE_CD= FINNBR_CD ) )
IF ( (EA.ALIAS_POOL_CD> 0 ) )  TEMP ->qual[pcnt]-> FNBR = CNVTALIAS (EA.ALIAS, EA.ALIAS_POOL_CD)
ELSE   TEMP ->qual[pcnt]-> FNBR =EA.ALIAS
ENDIF
 
ENDIF
 
 WITH  NOCOUNTER , OUTERJOIN = D
 call echo("after")
 
 CALL ECHORECORD ( TEMP )
;
;for (x = 1 to size(TEMP->qual,5))
;	SET  PT -> LINE_CNT  =  0
;
;	SET  MAX_LENGTH  =  90
;
;	 EXECUTE DCP_PARSE_TEXT  VALUE ( TEMP ->qual[x]-> ADMIT_DX ),	 VALUE ( MAX_LENGTH )
;
;	SET  STAT  =  ALTERLIST ( TEMP ->qual[x]-> DX_QUAL ,  PT -> LINE_CNT )
;
;	SET  TEMP ->qual[x]-> DX_CNT  =  PT -> LINE_CNT
;
;	FOR (  W  =  1  TO  PT -> LINE_CNT  )
;
;	SET  TEMP ->qual[x]-> DX_QUAL [ W ]-> DX_LINE  =  PT -> LNS [ W ]-> LINE
;
;	ENDFOR
;endfor
 
SET  MNEM_DISP_LEVEL  =  "1"
 
SET  IV_DISP_LEVEL  =  "0"
 
SELECT  INTO  "nl:"
FROM ( NAME_VALUE_PREFS  N ),
( APP_PREFS  A )
 PLAN ( N
WHERE (N.PVC_NAME IN ( "MNEM_DISP_LEVEL" ,
 "IV_DISP_LEVEL" )))
 AND ( A
WHERE (A.APP_PREFS_ID=N.PARENT_ENTITY_ID) AND (A.PRSNL_ID= 0 ) AND (A.POSITION_CD= 0 ))
 
 
DETAIL
 
IF ( (N.PVC_NAME= "MNEM_DISP_LEVEL" ) AND (N.PVC_VALUE IN ( "0" ,
 "1" ,
 "2" )) )  MNEM_DISP_LEVEL =N.PVC_VALUE
ELSEIF ( (N.PVC_NAME= "IV_DISP_LEVEL" ) AND (N.PVC_VALUE IN ( "0" ,
 "1" )) )  IV_DISP_LEVEL =N.PVC_VALUE
ENDIF
 
 WITH  NOCOUNTER
 
 CALL ECHO ( BUILD ( "mnem_disp_level:" ,  MNEM_DISP_LEVEL ,  " iv_disp_level:" ,  IV_DISP_LEVEL ))
 
SELECT  INTO  "nl:"
O.*
FROM
(dummyt d with seq = size(TEMP->qual,5)),
( ORDERS  O )
 PLAN d
 
 and ( O
WHERE (O.ENCNTR_ID= TEMP->qual[d.seq]->encntr_id)
AND  (( (O.HIDE_FLAG!= 1 ) )  OR  (O.HIDE_FLAG= NULL  ))
AND (O.ORDER_STATUS_CD IN ( ORDERED_CD ,
 INPROCESS_CD ,
 FUTURE_CD ,
 PENDING_CD ))
 AND  NOT ((O.ORIG_ORD_AS_FLAG IN ( 1 ,2 )) )
 AND (O.TEMPLATE_ORDER_FLAG IN ( 0 ,
 1 )))
 
ORDER BY d.seq,
O.CATALOG_TYPE_CD,
 CNVTDATETIME (O.CURRENT_START_DT_TM)
 
 
head d.seq
 TEMP ->qual[d.seq]-> CAT_CNT = 0
 TEMP ->qual[d.seq]->display_ind = "Y"
 
HEAD O.CATALOG_TYPE_CD
 CNT = 0 , TEMP ->qual[d.seq]-> CAT_CNT =( TEMP ->qual[d.seq]-> CAT_CNT + 1 ),
 STAT = ALTERLIST ( TEMP ->qual[d.seq]-> CAT_QUAL ,  TEMP ->qual[d.seq]-> CAT_CNT ),
 TEMP ->qual[d.seq]-> CAT_QUAL [ TEMP ->qual[d.seq]-> CAT_CNT ]-> CATALOG_TYPE = UAR_GET_CODE_DISPLAY (O.CATALOG_TYPE_CD)
DETAIL
 CNT =( CNT + 1 ),
 TEMP ->qual[d.seq]-> CAT_QUAL [ TEMP ->qual[d.seq]-> CAT_CNT ]-> ORD_CNT = CNT ,
 STAT = ALTERLIST ( TEMP ->qual[d.seq]-> CAT_QUAL [ TEMP ->qual[d.seq]-> CAT_CNT ]-> ORD_QUAL ,  CNT ),
 TEMP ->qual[d.seq]-> CAT_QUAL [ TEMP ->qual[d.seq]-> CAT_CNT ]-> ORD_QUAL [ CNT ]-> DATE = FORMAT (O.CURRENT_START_DT_TM,
 "@SHORTDATETIME" ),
 TEMP ->qual[d.seq]-> CAT_QUAL [ TEMP ->qual[d.seq]-> CAT_CNT ]-> ORD_QUAL [ CNT ]-> STATUS = UAR_GET_CODE_DISPLAY (
O.ORDER_STATUS_CD),
 TEMP ->qual[d.seq]-> CAT_QUAL [ TEMP ->qual[d.seq]-> CAT_CNT ]-> ORD_QUAL [ CNT ]-> DISPLAY_LINE =O.CLINICAL_DISPLAY_LINE,
 TEMP ->qual[d.seq]-> CAT_QUAL [ TEMP ->qual[d.seq]-> CAT_CNT ]-> ORD_QUAL [ CNT ]-> OE_FORMAT_ID =O.OE_FORMAT_ID,
 
IF ( ( SUBSTRING ( 245 ,  10 , O.CLINICAL_DISPLAY_LINE)> "  " ) )
TEMP ->qual[d.seq]-> CAT_QUAL [ TEMP ->qual[d.seq]-> CAT_CNT ]-> ORD_QUAL [ CNT ]-> CLIN_LINE_IND = 1
ELSE   TEMP ->qual[d.seq]-> CAT_QUAL [ TEMP ->qual[d.seq]-> CAT_CNT ]-> ORD_QUAL [ CNT ]-> CLIN_LINE_IND = 0
ENDIF
,
 TEMP ->qual[d.seq]-> CAT_QUAL [ TEMP ->qual[d.seq]-> CAT_CNT ]-> ORD_QUAL [ CNT ]-> ORDER_ID =O.ORDER_ID,
 TEMP ->qual[d.seq]-> CAT_QUAL [ TEMP ->qual[d.seq]-> CAT_CNT ]-> ORD_QUAL [ CNT ]-> IV_IND =O.IV_IND,
 
IF ( (O.DCP_CLIN_CAT_CD= IV_CD ) )  TEMP ->qual[d.seq]-> CAT_QUAL [ TEMP ->qual[d.seq]-> CAT_CNT ]-> ORD_QUAL [ CNT ]->
 IV_IND = 1
ENDIF
,
 TEMP ->qual[d.seq]-> CAT_QUAL [ TEMP ->qual[d.seq]-> CAT_CNT ]-> ORD_QUAL [ CNT ]-> MNEMONIC =O.HNA_ORDER_MNEMONIC,
 
IF ( (O.CATALOG_TYPE_CD= PHARMACY_CD ) )
IF ( ( MNEM_DISP_LEVEL = "0" ) )  TEMP ->qual[d.seq]-> CAT_QUAL [ TEMP ->qual[d.seq]-> CAT_CNT ]-> ORD_QUAL [ CNT ]->
 MNEMONIC = TRIM (O.HNA_ORDER_MNEMONIC)
ENDIF
,
IF ( ( MNEM_DISP_LEVEL = "1" ) )
IF (  (( (O.HNA_ORDER_MNEMONIC=O.ORDERED_AS_MNEMONIC) )  OR  ((O.ORDERED_AS_MNEMONIC= " " ) ))  )
 TEMP ->qual[d.seq]-> CAT_QUAL [ TEMP ->qual[d.seq]-> CAT_CNT ]-> ORD_QUAL [ CNT ]-> MNEMONIC = TRIM (O.HNA_ORDER_MNEMONIC)
ELSE   TEMP ->qual[d.seq]-> CAT_QUAL [ TEMP ->qual[d.seq]-> CAT_CNT ]-> ORD_QUAL [ CNT ]-> MNEMONIC = CONCAT ( TRIM (
O.HNA_ORDER_MNEMONIC),  "(" ,  TRIM (O.ORDERED_AS_MNEMONIC),  ")" )
ENDIF
 
ENDIF
,
IF ( ( MNEM_DISP_LEVEL = "2" ) AND (O.IV_IND!= 1 ) )
IF (  (( (O.HNA_ORDER_MNEMONIC=O.ORDERED_AS_MNEMONIC) )  OR  ((O.ORDERED_AS_MNEMONIC= " " ) ))  )
 TEMP ->qual[d.seq]-> CAT_QUAL [ TEMP ->qual[d.seq]-> CAT_CNT ]-> ORD_QUAL [ CNT ]-> MNEMONIC = TRIM (O.HNA_ORDER_MNEMONIC)
ELSE   TEMP ->qual[d.seq]-> CAT_QUAL [ TEMP ->qual[d.seq]-> CAT_CNT ]-> ORD_QUAL [ CNT ]-> MNEMONIC = CONCAT ( TRIM (
O.HNA_ORDER_MNEMONIC),  "(" ,  TRIM (O.ORDERED_AS_MNEMONIC),  ")" )
ENDIF
,
IF ( (O.ORDER_MNEMONIC!=O.ORDERED_AS_MNEMONIC) AND (O.ORDER_MNEMONIC> " " ) )  TEMP ->qual[d.seq]-> CAT_QUAL [
 TEMP ->qual[d.seq]-> CAT_CNT ]-> ORD_QUAL [ CNT ]-> MNEMONIC = CONCAT ( TRIM ( TEMP ->qual[d.seq]-> CAT_QUAL [ TEMP ->qual[d.seq]->
 CAT_CNT ]-> ORD_QUAL [ CNT ]-> MNEMONIC ),  "(" ,  TRIM (O.ORDER_MNEMONIC),  ")" )
ENDIF
 
ENDIF
 
ENDIF
,
 TEMP ->qual[d.seq]-> CAT_QUAL [ TEMP ->qual[d.seq]-> CAT_CNT ]-> ORD_QUAL [ CNT ]-> COMMENT_IND =O.ORDER_COMMENT_IND
 WITH  NOCOUNTER
 
;**********************************
select  into  "nl:"
;o.*
from
(dummyt d with seq = size(TEMP->qual,5)),
orders o
 plan d
 join o
where o.encntr_id = TEMP->qual[d.seq]->encntr_id
  and o.catalog_type_cd = pharmacy_cd
  and o.order_status_cd+0 in ( ordered_cd,suspended_cd )
 and o.orig_ord_as_flag in (1,2)
 and o.template_order_flag in (0, 1)
 
order by d.seq,
 cnvtdatetime (o.current_start_dt_tm)
 
;head report
; TEMP ->qual[pcnt]-> cat_cnt = 0
head d.seq
col + 0
 
head o.catalog_type_cd
 cnt = 0 ,
 TEMP ->qual[d.seq]-> cat_cnt =( TEMP ->qual[d.seq]-> cat_cnt + 1 ),
 stat = alterlist ( TEMP ->qual[d.seq]-> cat_qual, TEMP ->qual[d.seq]-> cat_cnt ),
 TEMP ->qual[d.seq]-> cat_qual [ TEMP ->qual[d.seq]-> cat_cnt ]-> catalog_type = "Home Medications"
detail
 cnt =( cnt + 1 ),
 TEMP ->qual[d.seq]-> cat_qual [ TEMP ->qual[d.seq]-> cat_cnt ]-> ord_cnt = cnt ,
 stat = alterlist ( TEMP ->qual[d.seq]-> cat_qual [ TEMP ->qual[d.seq]-> cat_cnt ]-> ord_qual ,  cnt ),
 TEMP->qual[d.seq]->cat_qual[TEMP->qual[d.seq]->cat_cnt]->ord_qual[cnt]->date = format(o.current_start_dt_tm,"mm/dd/yy hh:mm;;d"),
 TEMP->qual[d.seq]->cat_qual[TEMP->qual[d.seq]-> cat_cnt ]-> ord_qual [ cnt ]-> status = uar_get_code_display (o.order_status_cd),
 TEMP ->qual[d.seq]-> cat_qual [ TEMP ->qual[d.seq]-> cat_cnt ]-> ord_qual [ cnt ]-> display_line =o.clinical_display_line,
 TEMP ->qual[d.seq]-> cat_qual [ TEMP ->qual[d.seq]-> cat_cnt ]-> ord_qual [ cnt ]-> oe_format_id =o.oe_format_id,
 
if ( ( substring ( 245 ,  10 , o.clinical_display_line)> "  " ) )  TEMP ->qual[d.seq]-> cat_qual [ TEMP ->qual[d.seq]->
 cat_cnt ]-> ord_qual [ cnt ]-> clin_line_ind = 1
else   TEMP ->qual[d.seq]-> cat_qual [ TEMP ->qual[d.seq]-> cat_cnt ]-> ord_qual [ cnt ]-> clin_line_ind = 0
endif
 
 TEMP ->qual[d.seq]-> cat_qual [ TEMP ->qual[d.seq]-> cat_cnt ]-> ord_qual [ cnt ]-> order_id =o.order_id,
 TEMP ->qual[d.seq]-> cat_qual [ TEMP ->qual[d.seq]-> cat_cnt ]-> ord_qual [ cnt ]-> iv_ind =o.iv_ind,
 
if ( (o.dcp_clin_cat_cd= iv_cd ) )
  TEMP ->qual[d.seq]-> cat_qual [ TEMP ->qual[d.seq]-> cat_cnt ]-> ord_qual [ cnt ]->iv_ind = 1
endif
 
 TEMP ->qual[d.seq]-> cat_qual [ TEMP ->qual[d.seq]-> cat_cnt ]-> ord_qual [ cnt ]-> mnemonic =o.hna_order_mnemonic,
 
if ( (o.catalog_type_cd= pharmacy_cd ) )
if ( ( mnem_disp_level = "0" ) )
  TEMP ->qual[d.seq]-> cat_qual [ TEMP ->qual[d.seq]-> cat_cnt ]-> ord_qual [ cnt ]->mnemonic = trim (o.hna_order_mnemonic)
endif
,
if ( ( mnem_disp_level = "1" ) )
if (  (( (o.hna_order_mnemonic=o.ordered_as_mnemonic) )  or  ((o.ordered_as_mnemonic= " " ) ))  )
 TEMP ->qual[d.seq]-> cat_qual [ TEMP ->qual[d.seq]-> cat_cnt ]-> ord_qual [ cnt ]-> mnemonic = trim (o.hna_order_mnemonic)
else
  TEMP ->qual[d.seq]-> cat_qual [ TEMP ->qual[d.seq]-> cat_cnt ]-> ord_qual [ cnt ]-> mnemonic = concat ( trim (
    o.hna_order_mnemonic),  "(" ,  trim (o.ordered_as_mnemonic),  ")" )
endif
 
endif
,
if ( ( mnem_disp_level = "2" ) and (o.iv_ind!= 1 ) )
if (  (( (o.hna_order_mnemonic=o.ordered_as_mnemonic) )  or  ((o.ordered_as_mnemonic= " " ) ))  )
 TEMP ->qual[d.seq]-> cat_qual [ TEMP ->qual[d.seq]-> cat_cnt ]-> ord_qual [ cnt ]-> mnemonic = trim (o.hna_order_mnemonic)
else   TEMP ->qual[d.seq]-> cat_qual [ TEMP ->qual[d.seq]-> cat_cnt ]-> ord_qual [ cnt ]-> mnemonic = concat ( trim (
o.hna_order_mnemonic),  "(" ,  trim (o.ordered_as_mnemonic),  ")" )
endif
,
if ( (o.order_mnemonic!=o.ordered_as_mnemonic) and (o.order_mnemonic> " " ) )  TEMP ->qual[d.seq]-> cat_qual [
 TEMP ->qual[d.seq]-> cat_cnt ]-> ord_qual [ cnt ]-> mnemonic = concat ( trim ( TEMP ->qual[d.seq]-> cat_qual [ TEMP ->qual[d.seq]->
 cat_cnt ]-> ord_qual [ cnt ]-> mnemonic ),  "(" ,  trim (o.order_mnemonic),  ")" )
endif
 
endif
 
endif
,
 TEMP ->qual[d.seq]-> cat_qual [ TEMP ->qual[d.seq]-> cat_cnt ]-> ord_qual [ cnt ]-> comment_ind =o.order_comment_ind
 with  nocounter
;**************************************************************
 
 
call echorecord(temp)
 
 
/*
FOR (  Y  =  1  TO  TEMP ->qual[pcnt]-> CAT_CNT  )
 
FOR (  Z  =  1  TO  TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_CNT  )
 
IF ( ( TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> IV_IND = 1 ) )
	SELECT  INTO  "nl:"
	FROM ( ORDER_INGREDIENT  OI )
	 PLAN ( OI
	WHERE (OI.ORDER_ID= TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> ORDER_ID ))
 
	ORDER BY OI.ACTION_SEQUENCE,
	OI.COMP_SEQUENCE
 
	HEAD OI.ACTION_SEQUENCE
	 MNEMONIC_LINE = FILLSTRING ( 1000 ,  " " ), FIRST_TIME = "Y"
	DETAIL
 
	IF ( ( FIRST_TIME = "Y" ) )
		IF ( (OI.ORDERED_AS_MNEMONIC> " " ) )  MNEMONIC_LINE = CONCAT ( TRIM (OI.ORDERED_AS_MNEMONIC),
		 ", " ,  TRIM (OI.ORDER_DETAIL_DISPLAY_LINE))
		ELSE   MNEMONIC_LINE = CONCAT ( TRIM (OI.ORDER_MNEMONIC),  ", " ,  TRIM (
		OI.ORDER_DETAIL_DISPLAY_LINE))
		ENDIF
		,  FIRST_TIME = "N"
	ELSE
		IF ( (OI.ORDERED_AS_MNEMONIC> " " ) )  MNEMONIC_LINE = CONCAT ( TRIM ( MNEMONIC_LINE ),  ", " ,
		 TRIM (OI.ORDERED_AS_MNEMONIC),  ", " ,  TRIM (OI.ORDER_DETAIL_DISPLAY_LINE))
		ELSE   MNEMONIC_LINE = CONCAT ( TRIM ( MNEMONIC_LINE ),  ", " ,  TRIM (OI.ORDER_MNEMONIC),  ", " ,
		 TRIM (OI.ORDER_DETAIL_DISPLAY_LINE))
		ENDIF
 
	ENDIF
 
	FOOT REPORT
	 TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> MNEMONIC = MNEMONIC_LINE
	 WITH  NOCOUNTER
ENDIF
 
IF ( ( TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> CLIN_LINE_IND = 1 ) )
	SELECT  INTO  "nl:"
	FROM ( ORDER_DETAIL  OD ),
	( ORDER_ENTRY_FIELDS  OF1 ),
	( OE_FORMAT_FIELDS  OEF )
	 PLAN ( OD
	WHERE ( TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> ORDER_ID =OD.ORDER_ID))
	 AND ( OEF
	WHERE (OEF.OE_FORMAT_ID= TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> OE_FORMAT_ID ) AND (
	OEF.OE_FIELD_ID=OD.OE_FIELD_ID))
	 AND ( OF1
	WHERE (OF1.OE_FIELD_ID=OEF.OE_FIELD_ID))
 
	ORDER BY OD.ORDER_ID,
	OD.OE_FIELD_ID,
	OD.ACTION_SEQUENCE DESC
 
	HEAD REPORT
	 TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> D_CNT = 0
	HEAD OD.ORDER_ID
	 STAT = ALTERLIST ( TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> D_QUAL ,  5 ), TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]
	-> ORD_QUAL [ Z ]-> STAT_IND = 0
	HEAD OD.OE_FIELD_ID
	 ACT_SEQ =OD.ACTION_SEQUENCE, ODFLAG = 1
	HEAD OD.ACTION_SEQUENCE
 
	IF ( ( ACT_SEQ !=OD.ACTION_SEQUENCE) )  ODFLAG = 0
	ENDIF
 
	DETAIL
 
	IF ( ( ODFLAG = 1 ) )
		TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> D_CNT =( TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]->
	 	ORD_QUAL [ Z ]-> D_CNT + 1 ),  DC = TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> D_CNT ,
		IF ( ( DC > SIZE ( TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> D_QUAL ,  5 )) )  STAT = ALTERLIST (
		 TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> D_QUAL , ( DC + 5 ))
		ENDIF
		,  TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> D_QUAL [ DC ]-> LABEL_TEXT = TRIM (OEF.LABEL_TEXT),
		 TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> D_QUAL [ DC ]-> FIELD_VALUE =OD.OE_FIELD_VALUE,  TEMP ->qual[pcnt]->
		 CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> D_QUAL [ DC ]-> GROUP_SEQ =OEF.GROUP_SEQ,  TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]
		-> ORD_QUAL [ Z ]-> D_QUAL [ DC ]-> OE_FIELD_MEANING_ID =OD.OE_FIELD_MEANING_ID,  TEMP ->qual[pcnt]-> CAT_QUAL [
		 Y ]-> ORD_QUAL [ Z ]-> D_QUAL [ DC ]-> VALUE = TRIM (OD.OE_FIELD_DISPLAY_VALUE),  TEMP ->qual[pcnt]-> CAT_QUAL
		[ Y ]-> ORD_QUAL [ Z ]-> D_QUAL [ DC ]-> CLIN_LINE_IND =OEF.CLIN_LINE_IND,  TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]->
		 ORD_QUAL [ Z ]-> D_QUAL [ DC ]-> LABEL = TRIM (OEF.CLIN_LINE_LABEL),  TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]->
		 ORD_QUAL [ Z ]-> D_QUAL [ DC ]-> SUFFIX =OEF.CLIN_SUFFIX_IND,
		IF ( (OD.OE_FIELD_DISPLAY_VALUE> " " ) )  TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> D_QUAL [ DC ]->
		 PRINT_IND = 0
		ELSE   TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> D_QUAL [ DC ]-> PRINT_IND = 1
		ENDIF
		,
		IF (  (( (OD.OE_FIELD_MEANING_ID= 1100 ) )  OR  ( (( (OD.OE_FIELD_MEANING_ID= 8 ) )  OR  ( (( (
		OD.OE_FIELD_MEANING_ID= 127 ) )  OR  ((OD.OE_FIELD_MEANING_ID= 43 ) ))  ))  ))  AND ( TRIM (
		 CNVTUPPER (OD.OE_FIELD_DISPLAY_VALUE))= "STAT" ) )  TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]->
		 STAT_IND = 1
		ENDIF
		,
		IF ( (OF1.FIELD_TYPE_FLAG= 7 ) )
			IF ( (OD.OE_FIELD_VALUE= 1 ) )
				IF (  (( (OEF.DISP_YES_NO_FLAG= 0 ) )  OR  ((OEF.DISP_YES_NO_FLAG= 1 ) ))  )  TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]
				-> ORD_QUAL [ Z ]-> D_QUAL [ DC ]-> VALUE = TRIM (OEF.LABEL_TEXT)
				ELSE   TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> D_QUAL [ DC ]-> CLIN_LINE_IND = 0
				ENDIF
 
			ELSE
				IF (  (( (OEF.DISP_YES_NO_FLAG= 0 ) )  OR  ((OEF.DISP_YES_NO_FLAG= 2 ) ))  )
				TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> D_QUAL [ DC ]-> VALUE = TRIM (OEF.CLIN_LINE_LABEL)
				ELSE   TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> D_QUAL [ DC ]-> CLIN_LINE_IND = 0
				ENDIF
 
			ENDIF
 
		ENDIF
 
	ENDIF
 
	FOOT  OD.ORDER_ID
	 STAT = ALTERLIST ( TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> D_QUAL ,  DC )
	WITH  NOCOUNTER
 
;
;	SET  STARTED_BUILD_IND  =  0
;	FOR (  FSUB  =  1  TO  31  )
;
;	FOR (  XX  =  1  TO  TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> D_CNT  )
;
;	IF (  (( ( TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> D_QUAL [ XX ]-> GROUP_SEQ = FSUB ) )  OR  ((
;	 FSUB = 31 ) ))  AND ( TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> D_QUAL [ XX ]-> PRINT_IND = 0 ) )
;		SET  TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> D_QUAL [ XX ]-> PRINT_IND  =  1
;		IF ( ( TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> D_QUAL [ XX ]-> CLIN_LINE_IND = 1 ) )
;			IF ( ( STARTED_BUILD_IND = 0 ) )
;			SET  STARTED_BUILD_IND  =  1
;				IF ( ( TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> D_QUAL [ XX ]-> SUFFIX = 0 ) AND ( TEMP ->qual[pcnt]->
;				 CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> D_QUAL [ XX ]-> LABEL > "  " ) )
;				SET  TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> DISPLAY_LINE  =  CONCAT ( TRIM ( TEMP ->qual[pcnt]-> CAT_QUAL [
;				 Y ]-> ORD_QUAL [ Z ]-> D_QUAL [ XX ]-> LABEL ),  " " ,  TRIM ( TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [
;				 Z ]-> D_QUAL [ XX ]-> VALUE ))
;				ELSEIF ( ( TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> D_QUAL [ XX ]-> SUFFIX = 1 ) AND ( TEMP ->qual[pcnt]->
;				 CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> D_QUAL [ XX ]-> LABEL > " " ) )
;				SET  TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> DISPLAY_LINE  =  CONCAT ( TRIM ( TEMP ->qual[pcnt]-> CAT_QUAL [
;				 Y ]-> ORD_QUAL [ Z ]-> D_QUAL [ XX ]-> VALUE ),  " " ,  TRIM ( TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [
;				 Z ]-> D_QUAL [ XX ]-> LABEL ))
;				ELSE
;				SET  TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> DISPLAY_LINE  =  CONCAT ( TRIM ( TEMP ->qual[pcnt]-> CAT_QUAL [
;				 Y ]-> ORD_QUAL [ Z ]-> D_QUAL [ XX ]-> VALUE ),  " " )
;				ENDIF
;
;			ELSE
;				IF ( ( TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> D_QUAL [ XX ]-> SUFFIX = 0 ) AND ( TEMP ->qual[pcnt]->
;				 CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> D_QUAL [ XX ]-> LABEL > "  " ) )
;				SET  TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> DISPLAY_LINE  =  CONCAT ( TRIM ( TEMP ->qual[pcnt]-> CAT_QUAL [
;				 Y ]-> ORD_QUAL [ Z ]-> DISPLAY_LINE ),  "," ,  TRIM ( TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]->
;				 D_QUAL [ XX ]-> LABEL ),  " " ,  TRIM ( TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> D_QUAL [ XX ]->
;				 VALUE ))
;				ELSEIF ( ( TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> D_QUAL [ XX ]-> SUFFIX = 1 ) AND ( TEMP ->qual[pcnt]->
;				 CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> D_QUAL [ XX ]-> LABEL > " " ) )
;				SET  TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> DISPLAY_LINE  =  CONCAT ( TRIM ( TEMP ->qual[pcnt]-> CAT_QUAL [
;				 Y ]-> ORD_QUAL [ Z ]-> DISPLAY_LINE ),  "," ,  TRIM ( TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]->
;				 D_QUAL [ XX ]-> VALUE ),  " " ,  TRIM ( TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> D_QUAL [ XX ]->
;				 LABEL ))
;				ELSE
;				SET  TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> DISPLAY_LINE  =  CONCAT ( TRIM ( TEMP ->qual[pcnt]-> CAT_QUAL [
;				 Y ]-> ORD_QUAL [ Z ]-> DISPLAY_LINE ),  "," ,  TRIM ( TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]->
;				 D_QUAL [ XX ]-> VALUE ),  " " )
;				ENDIF
;
;			ENDIF
;
;		ENDIF
;
;	ENDIF
;
;
;	ENDFOR
;
;
;	ENDFOR
 
ENDIF
 */
/*
IF ( ( TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> COMMENT_IND = 1 ) )
SELECT  INTO  "nl:"
FROM
(dummyt d with seq = size(TEMP->qual,5)),
( ORDER_COMMENT  OC ),
( LONG_TEXT  LT )
 PLAN d
 and ( OC
WHERE (OC.ORDER_ID= TEMP ->qual[d.seq]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> ORDER_ID )
AND (OC.COMMENT_TYPE_CD= ORD_COMM_CD ))
 AND ( LT
WHERE (LT.LONG_TEXT_ID=OC.LONG_TEXT_ID))
 
order d.seq
 
HEAD REPORT
 BLOB_OUT = FILLSTRING ( 32000 ,  " " ),
 BLOB_OUT2 = FILLSTRING ( 32000 ,  " " )
DETAIL
 BLOB_OUT = FILLSTRING ( 32000 ,  " " ),
 BLOB_OUT2 = FILLSTRING ( 32000 ,  " " ),
 Y1 = SIZE ( TRIM (LT.LONG_TEXT)),
 BLOB_OUT = SUBSTRING ( 1 ,  Y1 , LT.LONG_TEXT),
 
 CALL UAR_RTF ( BLOB_OUT ,  Y1 ,  BLOB_OUT2 ,  32000 ,  32000 ,  0 ),
 TEMP ->qual[d.seq]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> COMMENT = BLOB_OUT2
 WITH  NOCOUNTER
 
;SET  PT -> LINE_CNT  =  0
;SET  MAX_LENGTH  =  55
; EXECUTE DCP_PARSE_TEXT  VALUE ( TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> COMMENT ),
; VALUE ( MAX_LENGTH )
;SET  STAT  =  ALTERLIST ( TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> C_QUAL ,  PT -> LINE_CNT )
;SET  TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> C_CNT  =  PT -> LINE_CNT
;FOR (  W  =  1  TO  PT -> LINE_CNT  )
;
;SET  TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> C_QUAL [ W ]-> C_LINE  =  PT -> LNS [ W ]-> LINE
;
;ENDFOR
 
ENDIF
 */
;SET  PT -> LINE_CNT  =  0
;SET  MAX_LENGTH  =  25
; EXECUTE DCP_PARSE_TEXT  VALUE ( TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> MNEMONIC ),
; VALUE ( MAX_LENGTH )
;SET  STAT  =  ALTERLIST ( TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> M_QUAL ,  PT -> LINE_CNT )
;SET  TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> M_CNT  =  PT -> LINE_CNT
;FOR (  W  =  1  TO  PT -> LINE_CNT  )
;
;SET  TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> M_QUAL [ W ]-> M_LINE  =  PT -> LNS [ W ]-> LINE
;
;ENDFOR
 
;SET  PT -> LINE_CNT  =  0
;SET  MAX_LENGTH  =  55
; EXECUTE DCP_PARSE_TEXT  VALUE ( TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> DISPLAY_LINE ),
; VALUE ( MAX_LENGTH )
;SET  STAT  =  ALTERLIST ( TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> DISP_QUAL ,  PT -> LINE_CNT )
;SET  TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> DISP_CNT  =  PT -> LINE_CNT
;FOR (  W  =  1  TO  PT -> LINE_CNT  )
;
;SET  TEMP ->qual[pcnt]-> CAT_QUAL [ Y ]-> ORD_QUAL [ Z ]-> DISP_QUAL [ W ]-> DISP_LINE  =  PT -> LNS [ W ]->LINE
;ENDFOR
 /*
ENDFOR
 
ENDFOR
*/
execute ReportRtl
 
%i mhs_prg:mayo_mn_active_orders_dwntm.dvl
 
SELECT  INTO  $outdev   ;REQUEST -> OUTPUT_DEVICE
D.SEQ
FROM
(dummyt d with seq = size(TEMP->qual,5))
 
 PLAN D
  where TEMP->qual[d.seq]->display_ind = "Y"
 
 order d.seq
head report
call InitializeReport(0)
_fEndDetail = RptReport->m_pageHeight - RptReport->m_marginRight
nPAGE = 1
dumb_var = 0
x = HeaderSection(0)
first_time = "Y"
 
head d.seq
if (first_time = "N")
  _YOffset = 10.2
  x = FooterSection(0)
  call PageBreak(0)
  x = HeaderSection(0)
endif
first_time = "N"
 
detail
for (y = 1 to size(temp->qual[d.seq]->cat_qual,5))
	if (_YOffset + GroupHeadSection(1) > _fEndDetail-0.5 )
	  _YOffset = 10.2
	  x = FooterSection(0)
	  call PageBreak(0)
	  x = HeaderSection(0)
	  ;  first_time = "N"
	endif
	x = GroupHeadSection(0)
 
	for (z = 1 to size(temp->qual[d.seq]->cat_qual[y]->ord_qual,5))
	  if (_YOffset + DetailSection(1,2.0,dumb_var) > _fEndDetail-0.5 )
		  _YOffset = 10.2
		  x = FooterSection(0)
		  call PageBreak(0)
		  x = HeaderSection(0)
		  x = GroupHeadSection(0)
		  ;  first_time = "N"
		endif
		disp = concat(trim(temp->qual[d.seq]->cat_qual[y]->ord_qual[z]->mnemonic,3))
		x = DetailSection(0,2.0,dumb_var)
	endfor
endfor
 
 
with nocounter
 
call FinalizeReport($outdev)
 
# EXIT_SCRIPT
 END GO
