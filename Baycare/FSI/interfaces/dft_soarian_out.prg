/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  dft_soarian_out
 *  Description:  Script for real time outbound charges to Soarian
 *  Type:         Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:         Rick Quackenbush
 *  Library:        OEOCF23ADTADT (DFT has always used this tdb, Cern Defect)
 *  Creation Date:  1/6/14 11:24:22 AM
 *  ---------------------------------------------------------------------------------------------
 *  Mod#  Date    Author       Description & Requestor Information
 *
 *  001:    1/6/14  R Quack     Added modification to call child doctor filter script
 *  002:    2/6/14  R Quack     Added logic from Sam Violanti's AFC_CUSTOM_SJH_P01 script
 *                                              which is current billing file script used to generate charges flat files today.
 *  003     3/21/14 R Quack   Added logic to query out modifiers up to 4 instead of 3 per Janet R
 *  004     3/21/14  R Quack  Added an interior IF statement in the large REQUEST2 section to ensure 
 *                                             only pharmacy process through remainder of code
 *  005     5/02/14  R Quack  Added query at end to populate charge_item_id
 *  006   12/04/14  R Quack  Added logic to identify modifier type cdf meaning
*   007   07/24/15  T McArtor Added logic to skp incorrect batch messages Hope to add advanced code 
*   008   03/07/2016 H Kaczmarczyk Added subtype, trigger, interface file name as messages to msgview
*   009   05/15/2017 D Olszewski  Modification to add the transcation ID for Credits from the Debit trans
 *  ---------------------------------------------------------------------------------------------
*/

/***007, 008, 009: Script to skip non trigger P03s causing interface to fail and record in msgview***/


If (oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_trigger != "P03")

 Declare strval_size = i4
 Declare i = i4
  Set strval_size = size(oen_reply->CERNER->stringList,  5)
    If (strval_size > 0)
      Set i = 1
        For (i = 1 to strval_size)            
         If (oen_reply->CERNER->stringList [i]->strMeaning = "interface file name")
         execute oencpm_msglog build("Interface File Name= ", oen_reply->CERNER->stringList [i]->strVal, char(0))
         Endif 
       Endfor
     Endif
execute oencpm_msglog build("MESSG_CTRL_ID= ", oen_reply->CONTROL_GROUP [1]->MSH [1]->message_ctrl_id->ctrl_id1 , char(0))
execute oencpm_msglog build("MESSG_TRIGGER= ", oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_trigger , char(0))
execute oencpm_msglog("*** Message Skipped Because Trigger NOT P03 ***")
set oenstatus->ignore=1

go to EXITSCRIPT
Endif

;execute oencpm_msglog("***Start of DFT Mod Obj script.")

/***001: Child script to filter doctor aliases on PV1 segment only***/
execute op_doc_filter_gen_outv4

/***003: We now need to use RECORD REQUEST2 to fill in Modifier in FT1;26 IF we have more than 3 potentially
so we will check the 3rd iteration of this repeating field and IF valued we'll allow the transction to process through what
was only for pharmacy transactions code below.  In REQUEST2 we fill out the variables and then we have a query
at the bottom that will fill in all 4 fields for modifier.***/
Set mod_sz=size(oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->FT1_GROUP [1]->FT1->proc_code_modifier,5)
If(mod_sz >= 3)
    ;execute oencpm_msglog("***Made it inside Modifiers Over 3 IF")
    go to rec_req
EndIf

/***002: We only want to execute this code for pharmacy charges so checking FT1;13.1 for Phrm 234 Dept Code***/
If(oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->FT1_GROUP [1]->FT1->dept_code->identifier = "Phrm 234") 

     #rec_req

;execute oencpm_msglog("***Made it inside Modifiers Over 3 and Phrm 234 IF")

/***Set transaction ID from FT1;2 equal to tran_id variable***/
Declare tran_id =f8
Set tran_id = cnvtint(oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->FT1_GROUP [1]->FT1->trans_id)
;execute oencpm_msglog(build("tran_id=",tran_id,char(0)))

/***Sam Violanti's code to build a record structure with queries of specific pharmacy data from the DB***/
set count1=0 
RECORD REQUEST2 ( 
1 BEG_ACTION = I2 
1 END_ACTION = I2 
1 FIRST_TIME = C1 
1 FILE_NAME = C80 
1 CHARGE_QUAL = I4 
1 CHARGE [*] 
1 INTERFACE_CHARGE_ID = F8 
1 CHARGE_EVENT_ID = F8 
1 CHARGE_ITEM_ID = F8 
1 CHARGE_ACT_ID = F8 
1 CHARGE_MOD_ID = F8 
1 PERSON_ID = F8 
1 BIRTH_DT_TM = DQ8 
1 AGE = F8 
1 MRN = C100 
1 SEX_CD = F8 
1 SEX_CD_ALIAS = C100 
1 ENCNTR_ID = F8 
1 PAYOR_ID = F8 
1 ORDER_DEPT = I4 
1 ORDER_DEPARTMENT = C40 
1 ORD_DOC_NBR = C20 
1 SECTION_CD = F8 
1 SECTION_CD_ALIAS = C100 
1 PERF_LOC_CD = F8 
1 PERF_LOC_CD_ALIAS = C100 
1 ADM_PHYS_ID = F8 
1 ORD_PHYS_ID = F8 
1 PERF_PHYS_ID = F8 
1 REFERRING_PHYS_ID = F8 
1 ORD_COMM_DOC_NBR = C10 
1 PERF_COMM_DOC_NBR = C10 
1 QUANTITY = F8 
1 PRICE = F8 
1 NET_EXT_PRICE = F8 
1 SERVICE_DT_TM = DQ8 
1 PRIM_CDM = C40 
1 PRIM_CPT = C40 
1 CHARGE_DESCRIPTION = C200 
1 CHARGE_TABLE_DESC = C100 
1 BAYCARE_ORDER_ALIAS = F8 
1 MED_NBR = C20 
1 FIN_NBR = C20 
1 CLIENT_CODE = C10 
1 CLIENT = C20 
1 PERSON_NAME = C30 
1 LAST_NAME = C30 
1 FIRST_NAME = C30 
1 MIDDLE_INIT = C30 
1 ENCNTR_TYPE_DISPLAY = C40 
1 ENCNTR_TYPE_CD = F8 
1 ENCNTR_TYPE_CD_ALIAS = C100 
1 UPDT_APPLCTX = I4 
1 UPDT_CNT = I4 
1 UPDT_DT_TM = DQ8 
1 UPDT_ID = F8 
1 UPDT_TASK = I4 
1 ACTIVE_IND = I2 
1 INTERFACE_FILE_ID = F8 
1 CHARGE_TYPE_CD = F8 
1 CHARGE_TYPE_CD_ALIAS = C100 
1 ACTIVE_STATUS_CD = F8 
1 ACTIVE_STATUS_CD_ALIAS = C100 
1 ACTIVE_STATUS_PRSNL_ID = F8 
1 ACTIVE_STATUS_DT_TM = DQ8 
1 END_EFFECTIVE_DT_TM = DQ8 
1 INSTITUTION_CD = F8 
1 INSTITUTION_CD_ALIAS = C100 
1 DEPARTMENT_CD = F8 
1 DEPARTMENT_CD_ALIAS = C100 
1 SUBSECTION_CD = F8 
1 SUBSECTION_CD_ALIAS = C100 
1 PROCESS_FLG = I4 
1 GROSS_PRICE = F8 
1 DISCOUNT_AMOUNT = F8 
1 BATCH_NUM = I4 
1 BILL_CODE1 = C50 
1 BILL_CODE1_DESC = C200 
1 BILL_CODE2 = C50 
1 BILL_CODE2_DESC = C200 
1 BILL_CODE3 = C50 
1 BILL_CODE3_DESC = C200 
1 DIAG_CODE1 = C50 
1 DIAG_DESC1 = C200 
1 DIAG_CODE2 = C50 
1 DIAG_DESC2 = C200 
1 DIAG_CODE3 = C50 
1 DIAG_DESC3 = C200 
1 ORGANIZATION_ID = F8 
1 LEVEL5_CD = F8 
1 LEVEL5_CD_ALIAS = C100 
1 FACILITY_CD = F8 
1 FACILITY_CD_ALIAS = C100 
1 BUILDING_CD = F8 
1 BUILDING_CD_ALIAS = C100 
1 NURSE_UNIT_CD = F8 
1 NURSE_UNIT_CD_ALIAS = C100 
1 ROOM_CD = F8 
1 ROOM_CD_ALIAS = C100 
1 BED_CD = F8 
1 BED_CD_ALIAS = C100 
1 ATTENDING_PHYS_ID = F8 
1 ADDITIONAL_ENCNTR_PHYS1_ID = F8 
1 ADDITIONAL_ENCNTR_PHYS2_ID = F8 
1 ADDITIONAL_ENCNTR_PHYS3_ID = F8 
1 BEG_EFFECTIVE_DT_TM = DQ8 
1 PRIM_CPT_DESC = C200 
1 ORDER_NBR = C200 
1 CHARGE_ORDER_ID = F8 
1 MANUAL_IND = I2 
1 POSTED_DT_TM = DQ8 
1 OVERRIDE_DESC = C200 
1 FIN_NBR_TYPE_FLG = I4 
1 ADMIT_TYPE_CD = F8 
1 ADMIT_TYPE_CD_ALIAS = C100 
1 PRIM_ICD9_PROC = C50 
1 PRIM_ICD9_PROC_DESC = C200 
1 COST_CENTER_CD = F8 
1 COST_CENTER_CD_ALIAS = C100 
1 BILL_CODE_TYPE_CDF = C12 
1 CODE_MODIFIER1_CD = F8 
1 CODE_MODIFIER1_CD_ALIAS = C100 
1 CODE_MODIFIER2_CD = F8 
1 CODE_MODIFIER2_CD_ALIAS = C100 
1 CODE_MODIFIER3_CD = F8 
1 CODE_MODIFIER3_CD_ALIAS = C100 
1 CODE_MODIFIER4_CD  =  F8
1 CODE_MODIFIER4_CD_ALIAS  =  C100
1 CODE_MODIFIER_MORE_IND = I2 
1 BILL_CODE_MORE_IND = I2 
1 DIAG_MORE_IND = I2 
1 ICD9_PROC_MORE_IND = I2 
1 ABN_STATUS_CD = F8 
1 ABN_STATUS_CD_ALIAS = C100 
1 USER_DEF_IND = I2 
1 ACTIVITY_TYPE_CD = F8 
1 ACTIVITY_TYPE_CD_ALIAS = C100 
1 CONTRIBUTOR_SOURCE_CD = F8 
1 CONTRIBUTOR_SYSTEM_CD = F8 
1 RESEARCH_ACCT_ID = F8 
1 EXT_BILL_QTY = I4 
1 VERIFY_PHYS_ID = F8 
1 ITEM_PRICE = F8 
1 ITEM_EXTENDED_PRICE = F8 
1 QTY_CONV_FACTOR = F8 
1 MED_SERVICE_CD = F8 
1 NDC = VC 
1 NDCRX3 = VC 
1 NDCUOMRX2 = VC 
1 NDCQTYRX2 = F8
1 OBJECT_ID = F8
1 HCPCS = VC ) 
set count1=0 
SELECT INTO "nl:" 
I.* 
FROM ( INTERFACE_CHARGE I ) 
PLAN I 
WHERE I.interface_charge_id=tran_id
ORDER BY I.COST_CENTER_CD 
DETAIL 
COUNT1 =( COUNT1 +1 ), 
STAT = ALTERLIST ( REQUEST2 -> CHARGE , COUNT1 ), 
; STAT = ALTERLIST ( REPLY -> T01_RECS , COUNT1 ), 
REQUEST2 -> INTERFACE_CHARGE_ID =I.INTERFACE_CHARGE_ID, 
REQUEST2 -> CHARGE_ITEM_ID =I.CHARGE_ITEM_ID, 
REQUEST2 -> FIN_NBR =I.FIN_NBR, 
REQUEST2 -> PERSON_NAME =I.PERSON_NAME 
REQUEST2 -> PERSON_ID =I.PERSON_ID, 
REQUEST2 -> SEX_CD =0 , 
REQUEST2 -> ENCNTR_ID =I.ENCNTR_ID;, 
REQUEST2 -> PAYOR_ID =I.PAYOR_ID, 
REQUEST2 -> ENCNTR_TYPE_CD =I.ENCNTR_TYPE_CD, 
REQUEST2 -> ORDER_DEPT =I.ORDER_DEPT, 
REQUEST2 -> ORDER_DEPARTMENT = FILLSTRING (40 , " " ), 
REQUEST2 -> SECTION_CD =I.SECTION_CD, 
REQUEST2 -> PERF_LOC_CD =I.PERF_LOC_CD, 
REQUEST2 -> ENCNTR_TYPE_CD =I.ENCNTR_TYPE_CD, 
REQUEST2 -> PAYOR_ID =I.PAYOR_ID, 
REQUEST2 -> ADM_PHYS_ID =I.ADM_PHYS_ID, 
REQUEST2 -> ORD_PHYS_ID =I.ORD_PHYS_ID, 
REQUEST2 -> PERF_PHYS_ID =I.PERF_PHYS_ID, 
REQUEST2 -> REFERRING_PHYS_ID =I.REFERRING_PHYS_ID, 
REQUEST2 -> ORD_DOC_NBR =I.ORD_DOC_NBR, 
REQUEST2 -> PRIM_CDM =I.PRIM_CDM, 
REQUEST2 -> CHARGE_DESCRIPTION =I.CHARGE_DESCRIPTION, 
REQUEST2 -> PRIM_CPT =I.PRIM_CPT, 
REQUEST2 -> QUANTITY =I.QUANTITY, 
IF ( (I.NET_EXT_PRICE<0 ) ) REQUEST2 -> PRICE =(I.NET_EXT_PRICE* - (1 )) 
ELSE REQUEST2 -> PRICE =I.NET_EXT_PRICE 
ENDIF 
, 
REQUEST2 -> NET_EXT_PRICE =I.NET_EXT_PRICE, 
REQUEST2 -> SERVICE_DT_TM =I.SERVICE_DT_TM, 
REQUEST2 -> UPDT_DT_TM =I.UPDT_DT_TM, 
REQUEST2 -> ACTIVE_IND =I.ACTIVE_IND, 
REQUEST2 -> INTERFACE_FILE_ID =I.INTERFACE_FILE_ID, 
REQUEST2 -> CHARGE_TYPE_CD =I.CHARGE_TYPE_CD, 
REQUEST2 -> UPDT_CNT =I.UPDT_CNT, 
REQUEST2 -> UPDT_ID =I.UPDT_ID, 
REQUEST2 -> UPDT_TASK =I.UPDT_TASK, 
REQUEST2 -> UPDT_APPLCTX =I.UPDT_APPLCTX, 
REQUEST2 -> ACTIVE_STATUS_CD =I.ACTIVE_STATUS_CD, 
REQUEST2 -> ACTIVE_STATUS_DT_TM =I.ACTIVE_STATUS_DT_TM, 
REQUEST2 -> END_EFFECTIVE_DT_TM =I.END_EFFECTIVE_DT_TM, 
REQUEST2 -> INSTITUTION_CD =I.INSTITUTION_CD, 
REQUEST2 -> DEPARTMENT_CD =I.DEPARTMENT_CD, 
REQUEST2 -> SUBSECTION_CD =I.SUBSECTION_CD, 
REQUEST2 -> GROSS_PRICE =I.GROSS_PRICE, 
REQUEST2 -> DISCOUNT_AMOUNT =I.DISCOUNT_AMOUNT, 
REQUEST2 -> MED_NBR =I.MED_NBR, 
REQUEST2 -> BATCH_NUM =I.BATCH_NUM, 
; CSOPS_REQUEST2 -> BATCH_NUM = REQUEST2 -> BATCH_NUM , 
REQUEST2 -> BILL_CODE1 =I.BILL_CODE1, 
REQUEST2 -> BILL_CODE1_DESC =I.BILL_CODE1_DESC, 
REQUEST2 -> BILL_CODE2 =I.BILL_CODE2, 
REQUEST2 -> BILL_CODE2_DESC =I.BILL_CODE2_DESC, 
REQUEST2 -> BILL_CODE3 =I.BILL_CODE3, 
REQUEST2 -> BILL_CODE3_DESC =I.BILL_CODE3_DESC, 
REQUEST2 -> DIAG_CODE1 =I.DIAG_CODE1, 
REQUEST2 -> DIAG_DESC1 =I.DIAG_DESC1, 
REQUEST2 -> DIAG_CODE2 =I.DIAG_CODE2, 
REQUEST2 -> DIAG_DESC2 =I.DIAG_DESC2, 
REQUEST2 -> DIAG_CODE3 =I.DIAG_CODE3, 
REQUEST2 -> DIAG_DESC3 =I.DIAG_DESC3, 
REQUEST2 -> ORGANIZATION_ID =I.ORGANIZATION_ID, 
REQUEST2 -> LEVEL5_CD =I.LEVEL5_CD, 
REQUEST2 -> FACILITY_CD =I.FACILITY_CD, 
REQUEST2 -> BUILDING_CD =I.BUILDING_CD, 
REQUEST2 -> NURSE_UNIT_CD =I.NURSE_UNIT_CD, 
REQUEST2 -> ROOM_CD =I.ROOM_CD, 
REQUEST2 -> BED_CD =I.BED_CD, 
REQUEST2 -> ATTENDING_PHYS_ID =I.ATTENDING_PHYS_ID, 
REQUEST2 -> ADDITIONAL_ENCNTR_PHYS1_ID =I.ADDITIONAL_ENCNTR_PHYS1_ID, 
REQUEST2 -> ADDITIONAL_ENCNTR_PHYS2_ID =I.ADDITIONAL_ENCNTR_PHYS2_ID, 
REQUEST2 -> ADDITIONAL_ENCNTR_PHYS3_ID =I.ADDITIONAL_ENCNTR_PHYS3_ID, 
REQUEST2 -> BEG_EFFECTIVE_DT_TM =I.BEG_EFFECTIVE_DT_TM, 
REQUEST2 -> PRIM_CPT_DESC =I.PRIM_CPT_DESC, 
REQUEST2 -> ORDER_NBR =I.ORDER_NBR, 
REQUEST2 -> MANUAL_IND =I.MANUAL_IND, 
REQUEST2 -> POSTED_DT_TM =I.POSTED_DT_TM, 
REQUEST2 -> OVERRIDE_DESC =I.OVERRIDE_DESC, 
REQUEST2 -> FIN_NBR_TYPE_FLG =I.FIN_NBR_TYPE_FLG, 
REQUEST2 -> ADMIT_TYPE_CD =I.ADMIT_TYPE_CD, 
REQUEST2 -> PRIM_ICD9_PROC =I.PRIM_ICD9_PROC, 
REQUEST2 -> PRIM_ICD9_PROC_DESC =I.PRIM_ICD9_PROC_DESC, 
REQUEST2 -> COST_CENTER_CD =I.COST_CENTER_CD, 
REQUEST2 -> BILL_CODE_TYPE_CDF =I.BILL_CODE_TYPE_CDF, 
;REQUEST2 -> CODE_MODIFIER1_CD =I.CODE_MODIFIER1_CD, 
;REQUEST2 -> CODE_MODIFIER2_CD =I.CODE_MODIFIER2_CD, 
;REQUEST2 -> CODE_MODIFIER3_CD =I.CODE_MODIFIER3_CD, 
;REQUEST2 -> CODE_MODIFIER4_CD =I.CODE_MODIFIER4_CD, 
REQUEST2 -> CODE_MODIFIER_MORE_IND =I.CODE_MODIFIER_MORE_IND, 
REQUEST2 -> BILL_CODE_MORE_IND =I.BILL_CODE_MORE_IND, 
REQUEST2 -> DIAG_MORE_IND =I.DIAG_MORE_IND, 
REQUEST2 -> ICD9_PROC_MORE_IND =I.ICD9_PROC_MORE_IND, 
REQUEST2 -> ABN_STATUS_CD =I.ABN_STATUS_CD, 
REQUEST2 -> USER_DEF_IND =I.USER_DEF_IND, 
REQUEST2 -> ACTIVITY_TYPE_CD =I.ACTIVITY_TYPE_CD, 
REQUEST2 -> CONTRIBUTOR_SOURCE_CD =32762544 , 
REQUEST2 -> CONTRIBUTOR_SYSTEM_CD =32770628 , 
REQUEST2 -> RESEARCH_ACCT_ID =0 , 
REQUEST2 -> EXT_BILL_QTY =I.EXT_BILL_QTY, 
REQUEST2 -> VERIFY_PHYS_ID =I.VERIFY_PHYS_ID, 
REQUEST2 -> MED_SERVICE_CD =I.MED_SERVICE_CD, 
REQUEST2 -> QTY_CONV_FACTOR =I.QTY_CONV_FACTOR, 
REQUEST2 -> NDC = TRIM (I.NDC_IDENT) 
;REPLY -> T01_RECS T01_INTERFACED ="Y" , 
;REQUEST2 -> CHARGE_QUAL = COUNT1; , 
/* 
IF ( ( REQUEST2 -> CHARGE_TYPE_CD = CREDIT_CD ) ) TOTAL_QTY_CREDIT =( 
TOTAL_QTY_CREDIT + REQUEST2 -> QUANTITY ), TOTAL_AMT_CREDIT =( 
TOTAL_AMT_CREDIT + REQUEST2 -> PRICE ), TOTAL_CNT_CREDIT = COUNT1 
ELSEIF ( ( REQUEST2 -> CHARGE_TYPE_CD = DEBIT_CD ) ) TOTAL_QTY_DEBIT =( 
TOTAL_QTY_DEBIT + REQUEST2 -> QUANTITY ), TOTAL_AMT_DEBIT =( TOTAL_AMT_DEBIT + 
REQUEST2 -> PRICE ), TOTAL_CNT_DEBIT = COUNT1 
ENDIF 
*/ 
WITH NOCOUNTER , OUTERJOIN = CV 


/*** 003: This is the query for modifiers to populate up to 4 since system only populates 3***/
SELECT INTO "nl:"
FROM (DUMMYT D1 WITH SEQ=VALUE(COUNT1)),
(CHARGE_MOD C), (CODE_VALUE CV)
PLAN D1
JOIN C WHERE C.CHARGE_ITEM_ID=REQUEST2->CHARGE_ITEM_ID 
AND C.ACTIVE_IND=1 
AND C.END_EFFECTIVE_DT_TM>=CNVTDATETIME(CURDATE,CURTIME)
JOIN CV WHERE CV.CODE_VALUE = C.FIELD1_ID
AND CV.CDF_MEANING= "MODIFIER"

DETAIL
IF(C.FIELD2_ID=1)
REQUEST2->CODE_MODIFIER1_CD=C.FIELD3_ID
ENDIF
IF(C.FIELD2_ID=2)
REQUEST2->CODE_MODIFIER2_CD=C.FIELD3_ID
ENDIF
IF(C.FIELD2_ID=3)
REQUEST2->CODE_MODIFIER3_CD=C.FIELD3_ID
ENDIF
IF(C.FIELD2_ID=4)
REQUEST2->CODE_MODIFIER4_CD=C.FIELD3_ID
ENDIF
WITH NOCOUNTER

;execute oencpm_msglog(build("REQUEST2->CODE_MODIFIER1_CD= ",REQUEST2->CODE_MODIFIER1_CD,char(0)))
;execute oencpm_msglog(build("REQUEST2->CODE_MODIFIER3_CD= ",REQUEST2->CODE_MODIFIER2_CD,char(0)))
;execute oencpm_msglog(build("REQUEST2->CODE_MODIFIER3_CD= ",REQUEST2->CODE_MODIFIER3_CD,char(0)))
;execute oencpm_msglog(build("REQUEST2->CODE_MODIFIER4_CD= ",REQUEST2->CODE_MODIFIER4_CD,char(0)))

If(REQUEST2->CODE_MODIFIER4_CD >0)

Declare source = f8
Declare cvo_alias = vc
Set source = uar_get_code_by("DISPLAY", 73, "Soarian")
select cvo.alias
from code_value_outbound cvo
where cvo.code_value = REQUEST2->CODE_MODIFIER4_CD
and cvo.contributor_source_cd = source
detail
  cvo_alias = trim(cvo.alias)
with nocounter

     Set stat =alterlist(oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->FT1_GROUP [1]->FT1->proc_code_modifier,4)
     Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->FT1_GROUP [1]->FT1->proc_code_modifier [4]->identifier = cvo_alias

EndIf

/***004: After we set the Modifier 4 IF it exists then we need to do another check on if this is Pharmacy message or not.  
If it is we want it to process through the rest of this code section below to populate quantities, price, ndc, etc.  If it's not 
Pharmacy we want to jump down past it***/

If(oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->FT1_GROUP [1]->FT1->dept_code->identifier = "Phrm 234") 

SELECT INTO "nl:" 
CVO.ALIAS 
FROM ( DUMMYT D1 WITH SEQ = VALUE ( count1 )), 
( CODE_VALUE_OUTBOUND CVO ) 
PLAN D1 
join CVO 
WHERE CVO.CONTRIBUTOR_SOURCE_CD= REQUEST2 -> CONTRIBUTOR_SOURCE_CD AND 
CVO.CODE_VALUE= REQUEST2 -> ABN_STATUS_CD 

DETAIL 
REQUEST2 -> ABN_STATUS_CD_ALIAS =CVO.ALIAS 
WITH NOCOUNTER 


SELECT INTO "nl:" 
CVO.ALIAS 
FROM ( DUMMYT D1 WITH SEQ = VALUE ( count1 )), 
( CODE_VALUE_OUTBOUND CVO ) 
PLAN D1 
join CVO 
WHERE CVO.CONTRIBUTOR_SOURCE_CD= REQUEST2 -> CONTRIBUTOR_SOURCE_CD AND 
CVO.CODE_VALUE= REQUEST2 -> ACTIVITY_TYPE_CD 

DETAIL 
REQUEST2 -> ACTIVITY_TYPE_CD_ALIAS =CVO.ALIAS 
WITH NOCOUNTER 


SELECT INTO "nl:" 
C.ORDER_ID 
FROM ( DUMMYT D1 WITH SEQ = VALUE ( count1 )), 
( charge C ) 
PLAN D1 
join C 
WHERE C.CHARGE_ITEM_ID= REQUEST2 -> CHARGE_ITEM_ID 

DETAIL 
REQUEST2 -> CHARGE_ORDER_ID =C.ORDER_ID, 
IF ( (C.ITEM_PRICE<0 ) ) REQUEST2 -> ITEM_PRICE =(C.ITEM_PRICE* - (1 )) 
ELSE REQUEST2 -> ITEM_PRICE =C.ITEM_PRICE 
ENDIF 
, 
REQUEST2 -> ITEM_EXTENDED_PRICE =C.ITEM_EXTENDED_PRICE 
WITH NOCOUNTER 
SELECT INTO "nl:" 
C.ORDER_ID 
FROM ( DUMMYT D1 WITH SEQ = VALUE ( count1 )), 
( CHARGE C ), 
( BILL_ITEM B ), 
( MED_PRODUCT M ), 
( DUMMYT D2 ), 
( MED_IDENTIFIER MI ), 
( MED_IDENTIFIER MI2 ) 
PLAN ( D1 ) 
join C 
WHERE C.CHARGE_ITEM_ID= REQUEST2 -> CHARGE_ITEM_ID 
join B 
WHERE C.BILL_ITEM_ID=B.BILL_ITEM_ID 
join M 
WHERE M.MANF_ITEM_ID=B.EXT_PARENT_REFERENCE_ID AND M.ACTIVE_IND=1 
join D2 
join MI 
WHERE M.MED_PRODUCT_ID=MI.MED_PRODUCT_Id AND MI.MED_IDENTIFIER_TYPE_CD=3104.00 
join MI2 
WHERE MI.ITEM_ID=MI2.ITEM_ID AND MI2.MED_IDENTIFIER_TYPE_CD=615035 AND MI2.PRIMARY_IND+0=1 AND MI2.ACTIVE_IND=1

DETAIL 
F2_POS =0 , 
GR_POS =0 , 
ML_POS =0 , 
UN_POS =0 , 
REQUEST2 -> OBJECT_ID =MI.ITEM_ID 
REQUEST2->HCPCS=trim(mi2.value)
WITH NOCOUNTER , OUTERJOIN = D3 , OUTERJOIN = D4 , DONTCARE = O2 


SELECT INTO "nl:" 
C.ORDER_ID 
FROM ( DUMMYT D1 WITH SEQ = VALUE ( 1 )), 
( MED_IDENTIFIER MI ) 
PLAN ( D1 ) 
join MI 
WHERE MI.ITEM_ID= REQUEST2 -> OBJECT_ID AND MI.ACTIVE_IND+0=1 AND 
MI.MED_IDENTIFIER_TYPE_CD IN (615042 ) AND MI.PRIMARY_IND+0 =1 

DETAIL 
F2_POS =0 , 
GR_POS =0 , 
ML_POS =0 , 
UN_POS =0 , 
F2_POS = FINDSTRING ("F2" , TRIM (MI.VALUE), 0 ), 
GR_POS = FINDSTRING ("GR" , TRIM (MI.VALUE), 0 ), 
ML_POS = FINDSTRING ("ML" , TRIM (MI.VALUE), 0 ), 
UN_POS = FINDSTRING ("UN" , TRIM (MI.VALUE), 0 ), 
IF ( ( ML_POS >0 ) ) REQUEST2 -> NDCQTYRX2 = CNVTREAL(REPLACE ( SUBSTRING (0 , ( ML_POS -1 ) 
, MI.VALUE), "," , "" , 0 )), REQUEST2 -> NDCUOMRX2 ="ML" 
endif 
IF ( ( F2_POS >0 ) ) REQUEST2 -> NDCQTYRX2 = CNVTREAL(REPLACE ( SUBSTRING (0 , ( F2_POS - 
1 ), MI.VALUE), "," , "" , 0 )), REQUEST2 -> NDCUOMRX2 ="F2" 
endif 
IF ( ( GR_POS >0 ) ) REQUEST2 -> NDCQTYRX2 = CNVTREAL(REPLACE ( SUBSTRING (0 , ( GR_POS - 
1 ), MI.VALUE), "," , "" , 0 )), REQUEST2 -> NDCUOMRX2 ="GR" 
endif 
IF ( ( UN_POS >0 ) ) REQUEST2 -> NDCUOMRX2 ="UN" , REQUEST2 -> NDCQTYRX2 = 
       CNVTREAL(REPLACE ( SUBSTRING (0 , ( UN_POS -1 ), MI.VALUE), "," , "" , 0 )) 
ENDIF 
WITH NOCOUNTER , OUTERJOIN = D3 , OUTERJOIN = D4 , DONTCARE = O2 


SELECT INTO "nl:" 
C.ORDER_ID 
FROM ( DUMMYT D1 WITH SEQ = VALUE ( count1 )), 
( MED_IDENTIFIER MI ) 
PLAN ( D1 ) 
join MI 
WHERE MI.ITEM_ID= REQUEST2 -> OBJECT_ID AND MI.ACTIVE_IND+0 =1 AND 
MI.MED_IDENTIFIER_TYPE_CD IN (615043 ) AND MI.PRIMARY_IND+0 =1 

DETAIL 
F2_POS =0 , 
GR_POS =0 , 
ML_POS =0 , 
UN_POS =0 , 
REQUEST2 -> NDCRX3 = TRIM (MI.VALUE) 
WITH NOCOUNTER , OUTERJOIN = D3 , OUTERJOIN = D4 , DONTCARE = O2

/***
IF (I.NET_EXT_PRICE<0 ) 
Set REQUEST2 -> PRICE =(I.NET_EXT_PRICE* - (1 )) 
Set in HL7 Field = Request - > Price 
ENDIF

;execute oencpm_msglog(build("REQUEST2 -> PRICE= ",REQUEST2 -> PRICE,char(0)))
If(CNVTINT(oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->FT1_GROUP [1]->FT1->trans_amount_ext->price->quantity) < 0)
     Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->FT1_GROUP [1]->FT1->trans_amount_ext->price->quantity =
   (CNVTINT(oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->FT1_GROUP [1]->FT1->trans_amount_ext->price->quantity) * -(1))
EndIf
***/

/***Sam's scripting has a section that will correct known Cerner code issue with the charges dropped from the 
cschargeviewer.exe application for pharmacy credits instead of using the phachargecredit.exe tool.  They had the same
issue in original flat file design so they created a workaround to multiply any values in the REQUEST2 
record structure above here by a - 1 which would make them positive and allow them to post to Invision.  
We encountered the same issue with Soarian so that is why we are setting price field in FT1;11 to 
REQUEST2 -> PRICE***/
;execute oencpm_msglog(build("REQUEST2 -> PRICE= ",REQUEST2 -> PRICE,char(0)))
Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->FT1_GROUP [1]->FT1->trans_amount_ext->price->quantity =  
      TRIM(CNVTSTRING(REQUEST2 -> PRICE, 20, 2))


/***Wipe out NDC value if REQUEST2 -> HCPCS is null, this means no HCPCS on the item Per Sam V.
and Jill Cuckler and Janet Rushkowski requested we DO NOT send NDC if item has no HCPCS. We 
are also putting the HCPCS variable value into FT1;29.6 so it's in plain sight for troubleshooting ***/

;execute oencpm_msglog(build("REQUEST2 -> HCPCS= ",REQUEST2 -> HCPCS,char(0)))
;execute oencpm_msglog(build("Setting FT1;29.6 = ",REQUEST2 -> HCPCS,char(0)))
     Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->FT1_GROUP [1]->FT1->ndc_ident->alt_coding_system = 
          (REQUEST2 -> HCPCS)

If(REQUEST2 -> HCPCS = "")
     
     ;execute oencpm_msglog("***Made it inside HCPCS = NULL IF for NO HCPCS BUILD")

     ;execute oencpm_msglog(build("Setting FT1;29.1 =",NULL,char(0)))
     Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->FT1_GROUP [1]->FT1->ndc_ident->identifier = ""

     ;execute oencpm_msglog(build("Setting FT1;29.6 = ",NULL,char(0)))
     Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->FT1_GROUP [1]->FT1->ndc_ident->alt_coding_system = 
            "NO HCPSC CODE"

EndIf

/***Inputing FAKE NDC value if exists***/
;execute oencpm_msglog(build("REQUEST2 -> NDCRX3=",REQUEST2 -> NDCRX3,char(0)))
If(REQUEST2 -> NDCRX3 != "")
     ;execute oencpm_msglog("***Made it inside NDCRX3 IF for FAKE NDC value")
     ;execute oencpm_msglog(build("Setting FT1;29.1 =",REQUEST2 -> NDCRX3,char(0)))
     Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->FT1_GROUP [1]->FT1->ndc_ident->identifier = 
     (REQUEST2 -> NDCRX3)
EndIf

/***Inputing UOM of if HCPCS code exists for product and a UOM exists***/
If(REQUEST2 -> HCPCS != "")

     ;execute oencpm_msglog("***Made it inside HCPCS IF for calculation of NDC quantity")

     ;execute oencpm_msglog(build("REQUEST2 -> NDCUOMRX2=",REQUEST2 -> NDCUOMRX2,char(0)))
If(REQUEST2 -> NDCUOMRX2 != "")
     ;execute oencpm_msglog("***Made it inside NDCUOMRX2 IF for UOM value")
     ;execute oencpm_msglog(build("Setting FT1;9 =",REQUEST2 -> NDCUOMRX2,char(0)))
     Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->FT1_GROUP [1]->FT1->trans_descrip_alt = 
     (REQUEST2 -> NDCUOMRX2)
EndIf
EndIf
       ;execute oencpm_msglog("***Exited HCPCS and NDCUOMRX2 IF CLAUSE")   

/***Adjusting NDC Quantity in FT1;8 by multiplying the NDCQTYRX2 (misc 2 pharmacy field) by the QUANTITY***/

;execute oencpm_msglog(build("REQUEST2 -> NDCQTYRX2=",REQUEST2 -> NDCQTYRX2,char(0)))

;execute oencpm_msglog(build("REQUEST2 -> QTY_CONV_FACTOR=",REQUEST2 -> QTY_CONV_FACTOR,char(0)))

;execute oencpm_msglog(build("REQUEST2 -> QUANTITY=",REQUEST2 -> QUANTITY,char(0)))

;execute oencpm_msglog(build("ORIGINAL HL7 QUANTITY in FT1;10 =",
     ;oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->FT1_GROUP [1]->FT1->trans_quantity,char(0)))

;execute oencpm_msglog("***Setting FT1;29.5 equal to the QUANTITY variable which may be different than FT1;10")
     Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->FT1_GROUP [1]->FT1->ndc_ident->alt_text = 
          TRIM(CNVTSTRING(REQUEST2 -> QUANTITY, 20, 3))

Declare NDCQTY_CALC = F8

If(REQUEST2 -> HCPCS != "")

     ;execute oencpm_msglog("***Made it inside HCPCS IF for calculation of NDC quantity")

If(REQUEST2 -> NDCQTYRX2 > 0)

     ;execute oencpm_msglog("***Made it inside NDCQTYRX2 (misc2 field) IF for calculation of NDC quantity")

     ;execute oencpm_msglog("***Setting FT1;29.3 equal to the NDCQTYRX2 variable since it's great than 0")
     Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->FT1_GROUP [1]->FT1->ndc_ident->coding_system = 
          TRIM(CNVTSTRING(REQUEST2 -> NDCQTYRX2, 20, 3))
     
     Set NDCQTY_CALC = (REQUEST2 -> NDCQTYRX2 * REQUEST2 -> QUANTITY)
     ;execute oencpm_msglog(build("NDCQTY_CALC= ", NDCQTY_CALC,char(0)))
     
     ;execute oencpm_msglog("***Setting FT1;8 equal to the value of NDCQTYRX2 * QUANTITY")
     Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->FT1_GROUP [1]->FT1->trans_descrip = 
          TRIM(CNVTSTRING(NDCQTY_CALC, 20, 3))    

     ;execute oencpm_msglog(build("CALCULATED NDC QUANTITY in FT1;8 =",
     ;oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->FT1_GROUP [1]->FT1->trans_descrip,char(0)))

EndIf     ;;;;; End NDCQTYRX2 (misc2) NDC Quantity Adjustment IF
EndIf    ;;;;;  End HCPCS Not = NULL NDC Quantity Adjustment IF

       ;execute oencpm_msglog("***Exited HCPCS and NDCQTYRX2 IF CLAUSE")           

Declare BILLQTY_CALC = F8


/***Per Jillian Cuckler we MUST calculate the billing quantity by taking QCF times Quantity and overwrite FT1;10***/
If(REQUEST2 -> QTY_CONV_FACTOR > 0 )
    
     ;execute oencpm_msglog("***Made it inside QTY_CONV_FACTOR IF for calculation of billing quantity")

     ;execute oencpm_msglog("***Setting FT1;29.4 equal to the QTY_CONV_FACTOR variable which is the QCF")
          Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->FT1_GROUP [1]->FT1->ndc_ident->alt_identifier = 
               TRIM(CNVTSTRING(REQUEST2 -> QTY_CONV_FACTOR, 20, 3))

     Set BILLQTY_CALC = (REQUEST2 -> QTY_CONV_FACTOR * REQUEST2 -> QUANTITY)
     ;execute oencpm_msglog(build("BILLQTY_CALC =", BILLQTY_CALC,char(0)))
    
      ;execute oencpm_msglog("***Setting FT1;10 equal to the value of QTY_CONV_FACTOR * QUANTITY")     
     Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->FT1_GROUP [1]->FT1->trans_quantity = 
          TRIM(CNVTSTRING(BILLQTY_CALC, 20, 3))
      ;execute oencpm_msglog(build("CALCULATED BILLING QUANTITY in FT1;10= ",
      ;oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->FT1_GROUP [1]->FT1->trans_quantity,char(0)))
     
EndIf     ;;;;: End QTY_CONV_FACTOR (qcf) Billing Quantity Adjustment IF

EndIf    ;;;;; 004: End Interior Phrm 234 IF to ensure only Pharmacy messages process through the rest of the code

       ;execute oencpm_msglog("***Exited Modifiers Over 3 and Phrm 234 IF")

EndIf     ;;;;: 003: End Modifiers Over 3 and 002: End Pharmacy IF

/***005: Input additional query to pull the charge_item_id off interface_charge table.  This was a late request after
almost all testing was completed so instead of modifying the code above which we tried to limit down to as few
messages as possible with the modifier and pharmacy specific IF clauses we opted to stick at end.***/

DECLARE TRAN_IDD =F8
DECLARE CHG_ITEM_ID = F8
DECLARE PCHG_ITEM_ID = F8
SET TRAN_IDD = cnvtint(oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->FT1_GROUP [1]->FT1->trans_id)
;execute oencpm_msglog(build("TRAN_IDD=",TRAN_IDD,char(0)))
SELECT I.CHARGE_ITEM_ID, C.PARENT_CHARGE_ITEM_ID
FROM INTERFACE_CHARGE I, CHARGE C
PLAN I WHERE I.INTERFACE_CHARGE_ID=TRAN_IDD
JOIN C WHERE C.CHARGE_ITEM_ID = I.CHARGE_ITEM_ID
DETAIL 
CHG_ITEM_ID=I.CHARGE_ITEM_ID 
PCHG_ITEM_ID = C.PARENT_CHARGE_ITEM_ID
WITH NOCOUNTER
;execute oencpm_msglog(build("CHG_ITEM_ID=",CHG_ITEM_ID,char(0)))
;execute oencpm_msglog(build("PCHG_ITEM_ID=",PCHG_ITEM_ID,char(0)))
IF(PCHG_ITEM_ID != 0)
Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->FT1_GROUP [1]->FT1->ndc_ident->original_text = CNVTSTRING(PCHG_ITEM_ID)
ELSE
Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->FT1_GROUP [1]->FT1->ndc_ident->original_text = CNVTSTRING(CHG_ITEM_ID)
ENDIF
;execute oencpm_msglog("***End of DFT Mod Obj script.")


/**** Modification to add the transcation ID for Credits from the Debit transaction OMIT Pharmacy******/
IF (oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->FT1_GROUP [1]->FT1->dept_code->identifier  != "Phrm 234")
IF (oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->FT1_GROUP [1]->FT1->trans_type   = "CREDIT") 
;outbound alias from Soarian source for code_value 3488.00 for credit transaction ty
  DECLARE CREDIT_ID = F8
  DECLARE DEBIT_ID = F8
        SET CREDIT_ID = CNVTREAL(oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->FT1_GROUP [1]->FT1->trans_id )
        
        SELECT INTO "nl:"
        FROM INTERFACE_CHARGE IC1, CHARGE C, INTERFACE_CHARGE IC2
        WHERE IC1.INTERFACE_CHARGE_ID = CREDIT_ID
        AND IC1.CHARGE_ITEM_ID = C.CHARGE_ITEM_ID
        AND C.OFFSET_CHARGE_ITEM_ID = IC2.CHARGE_ITEM_ID
        DETAIL
        DEBIT_ID = IC2.INTERFACE_CHARGE_ID
        WITH NOCOUNTER
        
        Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->FT1_GROUP [1]->FT1->trans_id  = CNVTSTRING(DEBIT_ID)
  ENDIF
ENDIF



#EXITSCRIPT