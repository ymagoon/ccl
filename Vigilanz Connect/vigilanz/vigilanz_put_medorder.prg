/*~BB~**********************************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

  ~BE~***********************************************************************************/
/*****************************************************************************************
      Source file name:   	snsro_put_medorder.prg
      Object name:        	vigilanz_put_medorder
      Program purpose:    	Verify a pharmacy order in millennium
	  Services: 			380001	rx_get_profile
							500286	dcp_get_privs
							360005	Entity_Lock
							380076	rx_get_pc_pref
							380005	rx_get_format_id
							560000	ORM.FmtQuery
							560201	ORM.OrderWriteSynch
							305660	PHA.AdminCharge
							305665	PHA.BatchDispense
							360009	Entity_Unlock
      Executing from:       MPages Discern Web Service
      Special Notes:      	NONE
******************************************************************************/
 /****************************************************************************
 *                   MODIFICATION CONTROL LOG                      			 *
 *****************************************************************************
 *Mod Date     Engineer             Comment                           		 *
 *--- -------- -------------------- -----------------------------------------*
  001 09/15/17 RJC					Initial write
  002 03/22/18 RJC					Added version code and copyright block
  003 03/26/18 RJC					Updated reqinfo->updt_id to userid
 ****************************************************************************/
/****************************************************************************/
drop program vigilanz_put_medorder go
create program vigilanz_put_medorder
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Order ID:" = 0.0					; required Medication Order ID
		, "Username:" = ""        			; required
		, "Debug Flag" = 0					; OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, ORDER_ID, USERNAME, DEBUG_FLAG
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2" ;002
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record 380001_req
record 380001_req (
  1 person_id = f8
  1 orderid = f8
  1 viewall_ind = i2
  1 DCFilterBegDate = dq8
  1 DCFilterEndDate = dq8
  1 orderList [*]
    2 orderId = f8
  1 Contrib_sys_qual [*]
    2 contributor_system_cd = f8
)
 
free record 380001_rep
record 380001_rep (
   1 person_id = f8
   1 encntrid = f8
   1 elapsed_time = f8
   1 orderlist [* ]
     2 encntr_id = f8
     2 encntrfinancialid = f8
     2 order_id = f8
     2 oeformatid = f8
     2 catalogcd = f8
     2 catalogtypecd = f8
     2 synonymid = f8
     2 contributorsystemcd = f8
     2 ordermnemonic = vc
     2 templateorderflag = i2
     2 templateorderid = f8
     2 grouporderflag = i2
     2 grouporderid = f8
     2 linkorderflag = i2
     2 linkorderid = f8
     2 ivind = i2
     2 prnind = i2
     2 order_status_cd = f8
     2 real_order_status_cd = f8
     2 order_status_disp = c40
     2 needrxverifyind = i2
     2 lastupdtcnt = i4
     2 next_iv_seq = i4
     2 floorstock_ind = i2
     2 next_dispense_dt_tm = dq8
     2 dept_misc_line = vc
     2 projected_stop_dt_tm = dq8
     2 deptstatuscd = f8
     2 current_start_dt_tm = dq8
     2 lastactionseq = i4
     2 softstopdttm = dq8
     2 order_detail_display_line = vc
     2 note_ind = i2
     2 medordertypecd = f8
     2 multiingredind = i2
     2 updt_dt_tm = dq8
     2 stop_type_cd = f8
     2 freq_type_flag = i2
     2 suspend_effective_dt_tm = dq8
     2 last_verified_dept_misc = vc
     2 lastverifiedactionseq = i4
     2 valid_dose_dt_tm = dq8
     2 current_start_tz = i4
     2 projected_stop_tz = i4
     2 next_dispense_tz = i4
     2 softstop_tz = i4
     2 suspend_effective_tz = i4
     2 plan_order_ind = i2
     2 plan_desc = vc
     2 pathway_id = f8
     2 link_nbr = f8
     2 link_type_flag = i2
     2 rx_comment_ind = i2
     2 order_comment_ind = i2
     2 compound_ind = i2
     2 actionlist [* ]
       3 actionsequence = i4
       3 actiontypecd = f8
       3 communicationtypecd = f8
       3 orderproviderid = f8
       3 orderdttm = dq8
       3 contributorsystemcd = f8
       3 orderlocncd = f8
       3 actionpersonnelid = f8
       3 effectivedttm = dq8
       3 actiondttm = dq8
       3 needsverifyflag = i2
       3 actionrejectedind = i2
       3 updatetask = f8
       3 order_tz = i4
       3 effective_tz = i4
       3 action_tz = i4
       3 detaillist [* ]
         4 orderid = f8
         4 actionsequence = i4
         4 detailsequence = i4
         4 oefieldid = f8
         4 oefieldvalue = f8
         4 oefielddisplayvalue = vc
         4 oefielddttmvalue = dq8
         4 oefieldmeaning = vc
         4 oefieldmeaningid = f8
         4 valuerequiredind = i2
         4 groupseq = i4
         4 fieldseq = i4
         4 modifiedind = i2
         4 oefield_tz = i4
       3 subcomponentlist [* ]
         4 sccompsequence = i4
         4 sccatalogcd = f8
         4 scgcrcode = i4
         4 sccatalogtypecd = f8
         4 scsynonymid = f8
         4 scordermnemonic = vc
         4 scorderdetaildisplayline = vc
         4 scoeformatid = f8
         4 scstrength = f8
         4 scstrengthunit = f8
         4 scvolume = f8
         4 scvolumeunit = f8
         4 scfreetextdose = vc
         4 scivseq = i4
         4 scfrequency = f8
         4 scmultumid = vc
         4 scgenericname = vc
         4 scbrandname = vc
         4 sclabeldesc = vc
         4 productlist [* ]
           5 item_id = f8
           5 order_sentence_id = f8
           5 dose_quantity = f8
           5 dose_quantity_unit_cd = f8
           5 total_dispense_quantity = f8
           5 total_charge_quantity = f8
           5 total_credit_quantity = f8
           5 tnf_id = f8
           5 iv_seq = i4
           5 order_alert1_cd = f8
           5 order_alert2_cd = f8
     2 total_dispense_doses = f8
     2 need_rx_prod_assign_flag = i2
     2 need_rx_clin_review_flag = i2
     2 last_clin_review_act_seq = i4
     2 intervention_ind = i2
     2 patient_med_ind = i2
     2 thera_sub_flag = i4
     2 order_schedule_precision_bit = i4
     2 future_location_facility_cd = f8
     2 future_location_nurse_unit_cd = f8
     2 dosing_method_flag = i2
     2 latest_communication_type_cd = f8
     2 last_update_provider_id = f8
     2 warning_level_bit = i4
     2 plan_warning_level_bit = i4
     2 order_status_reason_bit = i4
     2 pathway_type_cd = f8
     2 subseq_desc = vc
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
 )
 
 free record 500286_req
 record 500286_req (
  1 chk_prsnl_ind = i2
  1 prsnl_id = f8
  1 chk_psn_ind = i2
  1 position_cd = f8
  1 chk_ppr_ind = i2
  1 ppr_cd = f8
  1 plist [*]
    2 privilege_cd = f8
    2 privilege_mean = c12
)
 
free record 500286_rep
record 500286_rep (
   1 qual [* ]
     2 privilege_cd = f8
     2 privilege_disp = c40
     2 privilege_desc = c60
     2 privilege_mean = c12
     2 priv_status = c1
     2 priv_value_cd = f8
     2 priv_value_disp = c40
     2 priv_value_desc = c60
     2 priv_value_mean = c12
     2 restr_method_cd = f8
     2 restr_method_disp = c40
     2 restr_method_desc = c60
     2 restr_method_mean = c12
     2 except_cnt = i4
     2 excepts [* ]
       3 exception_entity_name = c40
       3 exception_type_cd = f8
       3 exception_type_disp = c40
       3 exception_type_desc = c60
       3 exception_type_mean = c12
       3 exception_id = f8
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
 )
 
 free record 360005_req
 record 360005_req (
  1 patientId = f8
  1 entityid = f8
  1 entityname = vc
  1 expire_minutes = i2
)
 
free record 360005_rep
record 360005_rep (
  1 success = i2
  1 lockPrsnlId = f8
  1 lockAquireDtTm = dq8
  1 lockExpireDtTm = dq8
  1 lockKeyId = i4
  1 status_data
    2 status = vc
    2 substatus = i2
    2 subEventStatus [*]
      3 operationname = vc
      3 operationstatus = vc
      3 targetobjectname = vc
      3 targetobjectvalue = vc
)
 
 free record 380076_req
 record 380076_req (
  1 application_number = f8
  1 position_cd = f8
  1 prsnl_id = f8
  1 parent_entity_name = vc
  1 pvc_name = vc
  1 hierarchy_ind = i2
)
 
 free record 380076_rep
 record 380076_rep (
   1 pvc_value = vc
   1 reply_list [* ]
     2 app_prefs_id = f8
     2 prsnl_id = f8
     2 position_cd = f8
     2 pvc_name = c32
     2 pvc_value = vc
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
 )
 
 free record 380005_rep
 record 380005_rep (
   1 oe_format_id = f8
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
 )
 
 free record 560000_req
 record 560000_req (
  1 oeFormatId = f8
  1 actionTypeCd = f8
  1 positionCd = f8
  1 ordLocationCd = f8
  1 patLocationCd = f8
  1 applicationCd = f8
  1 encntrTypeCd = f8
  1 includePromptInd = i2
  1 catalogCd = f8
  1 origOrdAsFlag = i2
)
 
free record 560000_rep
record 560000_rep (
  1 status = i4
  1 oeFormatName = c200
  1 fieldList [*]
    2 oeFieldId = f8
    2 acceptFlag = i2
    2 defaultValue = c100
    2 inputMask = c50
    2 requireCosignInd = i2
    2 prologMethod = i4
    2 epilogMethod = i4
    2 statusLine = c200
    2 labelText = c200
    2 groupSeq = i4
    2 fieldSeq = i4
    2 valueRequiredInd = i2
    2 maxNbrOccur = i4
    2 description = c100
    2 codeset = i4
    2 oeFieldMeaningId = f8
    2 oeFieldMeaning = c25
    2 request = i4
    2 minVal = f8
    2 maxVal = f8
    2 fieldTypeFlag = i2
    2 acceptSize = i4
    2 validationTypeFlag = i2
    2 helpContextId = f8
    2 allowMultipleInd = i2
    2 spinIncrementCnt = i4
    2 clinLineInd = i2
    2 clinLineLabel = c25
    2 clinSuffixInd = i2
    2 deptLineInd = i2
    2 deptLineLabel = c25
    2 deptSuffixInd = i2
    2 dispYesNoFlag = i2
    2 defPrevOrderInd = i2
    2 dispDeptYesNoFlag = i2
    2 promptEntityName = c32
    2 promptEntityId = f8
    2 commonFlag = i2
    2 eventCd = f8
    2 filterParams = c255
    2 depList [*]
      3 dependencyFieldId = f8
      3 depSeqList [*]
        4 dependencySeq = i4
        4 dependencyMethod = i4
        4 dependencyAction = i4
        4 depDomSeqList [*]
          5 depDomainSeq = i4
          5 dependencyValue = c200
          5 dependencyOperator = i4
    2 cki = c30
    2 coreInd = i2
    2 defaultParentEntityId = f8
    2 lockOnModifyFlag = i2
    2 carryForwardPlanInd = i2
  1 status_data
    2 status = vc
    2 subEventStatus [*]
      3 OperationName = vc
      3 OperationStatus = vc
      3 TargetObjectName = vc
      3 TargetObjectValue = vc
)
 
 free record 560201_req
 record 560201_req (
  1 productId = f8
  1 personId = f8
  1 encntrId = f8
  1 passingEncntrInfoInd = i2
  1 encntrFinancialId = f8
  1 locationCd = f8
  1 locFacilityCd = f8
  1 locNurseUnitCd = f8
  1 locRoomCd = f8
  1 locBedCd = f8
  1 actionPersonnelId = f8
  1 contributorSystemCd = f8
  1 orderLocnCd = f8
  1 replyInfoFlag = i2
  1 commitGroupInd = i2
  1 needsATLDupCheckInd = i2
  1 orderSheetInd = i2
  1 orderSheetPrinterName = vc
  1 logLevelOverride = i2
  1 unlockProfileInd = i2
  1 lockKeyId = i4
  1 orderList [*]
    2 orderId = f8
    2 actionTypeCd = f8
    2 communicationTypeCd = f8
    2 orderProviderId = f8
    2 orderDtTm = dq8
    2 currentStartDtTm = dq8
    2 oeFormatId = f8
    2 catalogTypeCd = f8
    2 accessionNbr = vc
    2 accessionId = f8
    2 noChargeInd = i2
    2 billOnlyInd = i2
    2 lastUpdtCnt = i4
    2 detailList [*]
      3 oeFieldId = f8
      3 oeFieldValue = f8
      3 oeFieldDisplayValue = vc
      3 oeFieldDtTmValue = dq8
      3 oeFieldMeaning = vc
      3 oeFieldMeaningId = f8
      3 valueRequiredInd = i2
      3 groupSeq = i4
      3 fieldSeq = i4
      3 modifiedInd = i2
      3 detailHistoryList [*]
        4 oeFieldValue = f8
        4 oeFieldDisplayValue = vc
        4 oeFieldDtTmValue = dq8
        4 detailAlterFlag = i2
        4 detailAlterTriggerCd = f8
    2 miscList [*]
      3 fieldMeaning = vc
      3 fieldMeaningId = f8
      3 fieldValue = f8
      3 fieldDisplayValue = vc
      3 fieldDtTmValue = dq8
      3 modifiedInd = i2
      3 groups [*]
        4 groupIdentifier = i2
    2 promptTestList [*]
      3 fieldValue = f8
      3 fieldDisplayValue = vc
      3 fieldDtTmValue = dq8
      3 promptEntityName = vc
      3 promptEntityId = f8
      3 modifiedInd = i2
      3 fieldTypeFlag = i2
      3 oeFieldId = f8
    2 commentList [*]
      3 commentType = f8
      3 commentText = vc
    2 reviewList [*]
      3 reviewTypeFlag = i2
      3 providerId = f8
      3 locationCd = f8
      3 rejectedInd = i2
      3 reviewPersonnelId = f8
      3 proxyPersonnelId = f8
      3 proxyReasonCd = f8
      3 catalogTypeCd = f8
      3 actionSequence = i2
      3 override [*]
        4 value
          5 noReviewRequiredInd = i2
          5 reviewRequiredInd = i2
          5 systemDetermineInd = i2
        4 overrideReasonCd = f8
    2 deptMiscLine = vc
    2 catalogCd = f8
    2 synonymId = f8
    2 orderMnemonic = vc
    2 passingOrcInfoInd = i2
    2 primaryMnemonic = vc
    2 activityTypeCd = f8
    2 activitySubtypeCd = f8
    2 contOrderMethodFlag = i2
    2 completeUponOrderInd = i2
    2 orderReviewInd = i2
    2 printReqInd = i2
    2 requisitionFormatCd = f8
    2 requisitionRoutingCd = f8
    2 resourceRouteLevel = i4
    2 consentFormInd = i2
    2 consentFormFormatCd = f8
    2 consentFormRoutingCd = f8
    2 deptDupCheckInd = i2
    2 dupCheckingInd = i2
    2 deptDisplayName = vc
    2 refTextMask = i4
    2 abnReviewInd = i2
    2 reviewHierarchyId = f8
    2 orderableTypeFlag = i2
    2 dcpClinCatCd = f8
    2 cki = vc
    2 stopTypeCd = f8
    2 stopDuration = i4
    2 stopDurationUnitCd = f8
    2 needsIntervalCalcInd = i2
    2 templateOrderFlag = i2
    2 templateOrderId = f8
    2 groupOrderFlag = i2
    2 groupCompCount = i4
    2 linkOrderFlag = i2
    2 linkCompCount = i4
    2 linkTypeCd = f8
    2 linkElementFlag = i2
    2 linkElementCd = f8
    2 processingFlag = i2
    2 origOrdAsFlag = i2
    2 orderStatusCd = f8
    2 deptStatusCd = f8
    2 schStateCd = f8
    2 discontinueTypeCd = f8
    2 rxMask = i4
    2 schEventId = f8
    2 encntrId = f8
    2 passingEncntrInfoInd = i2
    2 encntrFinancialId = f8
    2 locationCd = f8
    2 locFacilityCd = f8
    2 locNurseUnitCd = f8
    2 locRoomCd = f8
    2 locBedCd = f8
    2 medOrderTypeCd = f8
    2 undoActionTypeCd = f8
    2 orderedAsMnemonic = vc
    2 getLatestDetailsInd = i2
    2 studentActionTypeCd = f8
    2 aliasList [*]
      3 alias = vc
      3 orderAliasTypeCd = f8
      3 orderAliasSubtypeCd = f8
      3 aliasPoolCd = f8
      3 checkDigit = i4
      3 checkDigitMethodCd = f8
      3 begEffectiveDtTm = dq8
      3 endEffectiveDtTm = dq8
      3 dataStatusCd = f8
      3 activeStatusCd = f8
      3 activeInd = i2
      3 billOrdNbrInd = i2
      3 primaryDisplayInd = i2
    2 subComponentList [*]
      3 scCatalogCd = f8
      3 scSynonymId = f8
      3 scOrderMnemonic = vc
      3 scOeFormatId = f8
      3 scStrengthDose = f8
      3 scStrengthDoseDisp = vc
      3 scStrengthUnit = f8
      3 scStrengthUnitDisp = vc
      3 scVolumeDose = f8
      3 scVolumeDoseDisp = vc
      3 scVolumeUnit = f8
      3 scVolumeUnitDisp = vc
      3 scFreetextDose = vc
      3 scFrequency = f8
      3 scFrequencyDisp = vc
      3 scIVSeq = i4
      3 scDoseQuantity = f8
      3 scDoseQuantityDisp = vc
      3 scDoseQuantityUnit = f8
      3 scDoseQuantityUnitDisp = vc
      3 scOrderedAsMnemonic = vc
      3 scHnaOrderMnemonic = vc
      3 scDetailList [*]
        4 oeFieldId = f8
        4 oeFieldValue = f8
        4 oeFieldDisplayValue = vc
        4 oeFieldDtTmValue = dq8
        4 oeFieldMeaning = vc
        4 oeFieldMeaningId = f8
        4 valueRequiredInd = i2
        4 groupSeq = i4
        4 fieldSeq = i4
        4 modifiedInd = i2
      3 scProductList [*]
        4 item_id = f8
        4 dose_quantity = f8
        4 dose_quantity_unit_cd = f8
        4 tnf_id = f8
        4 tnf_description = vc
        4 tnf_cost = f8
        4 tnf_ndc = vc
        4 tnfLegalStatusCd = f8
        4 packageTypeId = f8
        4 medProductId = f8
        4 manfItemId = f8
        4 dispQty = f8
        4 dispQtyUnitCd = f8
        4 ignoreInd = i2
        4 compoundFlag = i2
        4 cmpdBaseInd = i2
        4 premanfInd = i2
        4 productSeq = i2
        4 parentProductSeq = i2
        4 labelDesc = vc
        4 brandDesc = vc
        4 genericDesc = vc
        4 drugIdentifier = vc
        4 pkg_qty_per_pkg = f8
        4 pkg_disp_more_ind = i2
        4 unrounded_dose_quantity = f8
        4 overfillStrengthDose = f8
        4 overfillStrengthUnitCd = f8
        4 overfillStrengthUnitDisp = vc
        4 overfillVolumeDose = f8
        4 overfillVolumeUnitCd = f8
        4 overfillVolumeUnitDisp = vc
        4 doseList [*]
          5 scheduleSequence = i2
          5 doseQuantity = f8
          5 doseQuantityUnitCd = f8
          5 unroundedDoseQuantity = f8
      3 scIngredientTypeFlag = i2
      3 scPrevIngredientSeq = i4
      3 scModifiedFlag = i2
      3 scIncludeInTotalVolumeFlag = i2
      3 scClinicallySignificantFlag = i2
      3 scAutoAssignFlag = i2
      3 scOrderedDose = f8
      3 scOrderedDoseDisp = vc
      3 scOrderedDoseUnitCd = f8
      3 scOrderedDoseUnitDisp = vc
      3 scDoseCalculatorLongText = c32000
      3 scIngredientSourceFlag = i2
      3 scNormalizedRate = f8
      3 scNormalizedRateDisp = vc
      3 scNormalizedRateUnitCd = f8
      3 scNormalizedRateUnitDisp = vc
      3 scConcentration = f8
      3 scConcentrationDisp = vc
      3 scConcentrationUnitCd = f8
      3 scConcentrationUnitDisp = vc
      3 scTherapeuticSbsttnList [*]
        4 therapSbsttnId = f8
        4 acceptFlag = i2
        4 overrideReasonCd = f8
        4 itemId = f8
      3 scHistoryList [*]
        4 scAlterTriggerCd = f8
        4 scSynonymId = f8
        4 scStrengthDose = f8
        4 scStrengthUnit = f8
        4 scVolumeDose = f8
        4 scVolumeUnit = f8
        4 scFreetextDose = vc
        4 scModifiedFlag = i2
      3 scDosingInfo [*]
        4 dosingCapacity = i2
        4 daysOfAdministrationDisplay = vc
        4 doseList [*]
          5 scheduleInfo
            6 doseSequence = i2
            6 scheduleSequence = i2
          5 strengthDose [*]
            6 value = f8
            6 valueDisplay = vc
            6 unitOfMeasureCd = f8
          5 volumeDose [*]
            6 value = f8
            6 valueDisplay = vc
            6 unitOfMeasureCd = f8
          5 orderedDose [*]
            6 value = f8
            6 valueDisplay = vc
            6 unitOfMeasureCd = f8
            6 doseType
              7 strengthInd = i2
              7 volumeInd = i2
      3 scDoseAdjustmentInfo [*]
        4 doseAdjustmentDisplay = vc
        4 carryForwardOverrideInd = i2
      3 scOrderedAsSynonymId = f8
    2 resourceList [*]
      3 serviceResourceCd = f8
      3 csLoginLocCd = f8
      3 serviceAreaCd = f8
      3 assayList [*]
        4 taskAssayCd = f8
    2 relationshipList [*]
      3 relationshipMeaning = vc
      3 valueList [*]
        4 entityId = f8
        4 entityDisplay = vc
        4 rankSequence = i4
      3 inactivateAllInd = i2
    2 miscLongTextList [*]
      3 textId = f8
      3 textTypeCd = f8
      3 text = vc
      3 textModifier1 = i4
      3 textModified2 = i4
    2 deptCommentList [*]
      3 commentTypeCd = f8
      3 commentSeq = i4
      3 commentId = f8
      3 longTextId = f8
      3 deptCommentMisc = i4
      3 deptCommentText = vc
    2 adHocFreqTimeList [*]
      3 adHocTime = i4
    2 ingredientReviewInd = i2
    2 taskStatusReasonMean = f8
    2 badOrderInd = i2
    2 origOrderDtTm = dq8
    2 validDoseDtTm = dq8
    2 userOverrideTZ = i4
    2 linkNbr = f8
    2 linkTypeFlag = i2
    2 supervisingProviderId = f8
    2 digitalSignatureIdent = c64
    2 bypassPrescriptionReqPrinting = i2
    2 pathwayCatalogId = f8
    2 patientOverrideTZ = i4
    2 actionQualifierCd = f8
    2 acceptProposalId = f8
    2 addOrderReltnList [*]
      3 relatedFromOrderId = f8
      3 relatedFromActionSeq = i4
      3 relationTypeCd = f8
    2 scheduleExceptionList [*]
      3 scheduleExceptionTypeCd = f8
      3 origInstanceDtTm = dq8
      3 newInstanceDtTm = dq8
      3 scheduleExceptionOrderId = f8
    2 inactiveScheduleExceptionList [*]
      3 orderScheduleExceptionId = f8
      3 scheduleExceptionOrderId = f8
    2 actionInitiatedDtTm = dq8
    2 ivSetSynonymId = f8
    2 futureInfo [*]
      3 scheduleNewOrderAsEstimated [*]
        4 startDateTimeInd = i2
        4 stopDateTimeInd = i2
      3 changeScheduleToPrecise [*]
        4 startDateTimeInd = i2
        4 stopDateTimeInd = i2
      3 location [*]
        4 facilityCd = f8
        4 nurseUnitCd = f8
        4 sourceModifiers
          5 scheduledAppointmentLocationInd = i2
      3 applyStartRange [*]
        4 value = i4
        4 unit
          5 daysInd = i2
          5 weeksInd = i2
          5 monthsInd = i2
        4 rangeAnchorPoint
          5 startInd = i2
          5 centerInd = i2
      3 encounterTypeCd = f8
    2 addToPrescriptionGroup [*]
      3 relatedOrderId = f8
    2 dayOfTreatmentInfo [*]
      3 protocolOrderId = f8
      3 dayOfTreatmentSequence = i4
      3 protocolVersionCheck [*]
        4 protocolVersion = i4
    2 billingProviderInfo [*]
      3 orderProviderInd = i2
      3 supervisingProviderInd = i2
    2 tracingTicket = vc
    2 lastUpdateActionSequence = i4
    2 protocolInfo [*]
      3 protocolType = i2
    2 incompleteToPharmacy [*]
      3 newOrder [*]
        4 noSynonymMatchInd = i2
        4 missingOrderDetailsInd = i2
      3 resolveOrder [*]
        4 resolvedInd = i2
    2 actionQualifiers [*]
      3 autoVerificationInd = i2
    2 originatingEncounterId = f8
  1 errorLogOverrideFlag = i2
  1 actionPersonnelGroupId = f8
  1 workflow [*]
    2 pharmacyInd = i2
  1 trigger_app = i4
)
 
 free record 560201_rep
 record 560201_rep (
  1 badOrderCnt = i2
  1 groupRollbackInd = i2
  1 groupBadOrderIndex = i2
  1 orderList [*]
    2 orderId = f8
    2 orderStatusCd = f8
    2 accessionNbr = vc
    2 errorStr = vc
    2 errorNbr = i4
    2 deptStatusCd = f8
    2 prevDeptStatusCd = f8
    2 schStateCd = f8
    2 orderDetailDisplayLine = vc
    2 origOrderDtTm = dq8
    2 orderCommentInd = i2
    2 needNurseReviewInd = i2
    2 needDoctorCosignInd = i2
    2 actionSequence = i4
    2 reviewCnt = i4
    2 detailCnt = i4
    2 ingredCnt = i4
    2 ingredDetailCntList [*]
      3 ingDetCnt = i4
    2 miscList [*]
      3 fieldMeaning = vc
      3 fieldMeaningId = f8
      3 fieldValue = f8
      3 fieldDisplayValue = vc
      3 fieldDtTmValue = dq8
      3 modifiedInd = i2
    2 clinicalDisplayLine = vc
    2 incompleteOrderInd = i2
    2 orderActionId = f8
    2 specificErrorNbr = i4
    2 specificErrorStr = vc
    2 actionStatus = i2
    2 needRxClinReviewFlag = i2
    2 needRxProdAssignFlag = i2
    2 simplifiedDisplayLine = vc
    2 errorReasonCd = f8
    2 externalServicesCalledInfo
      3 poolRoutingCalledInd = i2
      3 receiptCreationCalledInd = i2
      3 powerPlanServiceCalledInd = i2
      3 schedulingScriptCalledInd = i2
    2 lastActionSequence = i4
    2 needRxVerifyInd = i2
    2 projectedStopDtTm = dq8
    2 projectedStopTz = i4
    2 stopTypeCd = f8
  1 status_data
    2 status = vc
    2 subEventStatus [*]
      3 OperationName = vc
      3 OperationStatus = vc
      3 TargetObjectName = vc
      3 TargetObjectValue = vc
      3 RequestNumber = i4
      3 OrderId = f8
      3 ActionSeq = i4
      3 SubStatus = vc
  1 errorNbr = i4
  1 errorStr = vc
  1 specificErrorNbr = i4
  1 specificErrorStr = vc
  1 transactionStatus = i2
)
 
free record 305660_req
record 305660_req (
  1 qual [*]
    2 order_id = f8
    2 action_sequence = i4
    2 event_id = f8
    2 valid_thru_dt_tm = dq8
    2 dispense_type_cd = f8
    2 route_cd = f8
    2 admin_dt_tm = dq8
    2 prsnl_id = f8
    2 ingred_action_seq = i4
    2 ingred_list [*]
      3 comp_sequence = i4
      3 dose = f8
      3 dose_unit_cd = f8
)
 
free record 305660_rep
record 305660_rep (
  1 status_data
    2 status = vc
    2 substatus = i2
    2 subEventStatus [*]
      3 operationname = vc
      3 operationstatus = vc
      3 targetobjectname = vc
      3 targetobjectvalue = vc
  1 qual [*]
    2 order_id = f8
    2 event_id = f8
    2 status = vc
)
 
free record 305665_req
record 305665_req (
  1 dispense_list [*]
    2 dispense_type_cd = f8
    2 output_device_cd = f8
    2 output_format_cd = f8
    2 dispense_ind = i2
    2 bill_ind = i2
    2 print_ind = i2
    2 fill_hx_id = f8
    2 order_list [*]
      3 dispense_ind = i2
      3 order_id = f8
      3 dispense_category_cd = f8
      3 next_iv_sequence = i4
      3 next_dispense = dq8
      3 par_doses = i2
      3 fill_override_doses = i2
      3 init_override_doses = i2
      3 manual_charge_ind = i2
      3 dose_list [*]
        4 admin_dt_tm = dq8
        4 ingredient_list [*]
          5 bag_nbr = i2
          5 comp_sequence = i4
        4 event_id = f8
        4 schedule_sequence = i2
      3 dispense_dt_tm = dq8
      3 num_labels = i4
      3 reason_cd = f8
      3 action_seq = i2
      3 price_sched_id = f8
      3 doses = f8
      3 ingred_action_seq = i4
      3 charge_dispense_hx_id = f8
      3 prod_list [*]
        4 item_id = f8
        4 manf_item_id = f8
        4 tnf_id = f8
        4 price = f8
        4 cost = f8
        4 qty = f8
        4 tax_amt = f8
        4 price_sched_id = f8
        4 pkg_count = f8
        4 pkg_quantity = i4
        4 temp_stock_qty = f8
        4 scan_flag = i2
        4 skip_dispense_flag = i2
        4 waste_qty = f8
      3 lbl_printing_flag = i2
      3 reverse_override_ind = i2
      3 order_instance_list [*]
        4 order_instance_id = f8
      3 ref_dispense_hx_id = f8
      3 workflow_status_cd = f8
      3 pkg_disp_cat_ind = i2
      3 person_owe_flag = i2
      3 person_owe_doses_cnt = f8
      3 doses_omitted_ind = i2
      3 reverse_admin_dispense_list [*]
        4 products [*]
          5 item_id = f8
          5 tnf_id = f8
          5 credit_qty = f8
          5 price_amount = f8
          5 tax_amount = f8
        4 rx_admin_dispense_hx_id = f8
        4 doses = f8
        4 price_amount = f8
      3 workstation_cd = f8
      3 waste_dispense_hx_id = f8
    2 label_type_cd = f8
    2 action_seq = i4
    2 credit_ind = i2
    2 dispense_from_cd = f8
    2 inv_location_cd = f8
    2 prsnl_id = f8
    2 witness_id = f8
    2 inv_locator_cd = f8
    2 transfer_to_loc_cd = f8
)
 
free record 305665_rep
record 305665_rep (
  1 dispense_list [*]
    2 ord_cnt = i4
    2 status_data
      3 errnum = i2
      3 cclstatuscode = c1
      3 crmstatuscode = i4
      3 requestnumber = i4
      3 tasknumber = i4
      3 status = vc
      3 subeventstatus [*]
        4 OperationName = vc
        4 OperationStatus = vc
        4 TargetObjectName = vc
        4 TargetObjectValue = vc
    2 run_id = f8
    2 dispensed_order_list [*]
      3 dispense_hx_list [*]
        4 dispense_hx_id = f8
        4 prod_dispense_hx_list [*]
          5 prod_dispense_hx_id = f8
          5 ingred_sequence = i2
          5 item_id = f8
          5 tnf_id = f8
    2 dispense_type_cd = f8
    2 order_list [*]
      3 order_id = f8
  1 status_data
    2 status = vc
    2 errorDescription = vc
)
 
free record 360009_req
record 360009_req (
  1 patientId = f8
  1 entityid = f8
  1 entityname = vc
  1 lockKeyId = i4
)
 
free record 360009_rep
record 360009_rep (
  1 success = i2
  1 status_data
    2 status = vc
    2 substatus = i2
    2 subEventStatus [*]
      3 operationname = vc
      3 operationstatus = vc
      3 targetobjectname = vc
      3 targetobjectvalue = vc
)
 
 free record medication_reply_out
record medication_reply_out(
  1 order_id             = f8
  1 audit
    2 user_id             = f8
    2 user_firstname          = vc
    2 user_lastname           = vc
    2 patient_id            = f8
    2 patient_firstname         = vc
    2 patient_lastname          = vc
    2 service_version         = vc
  1 status_data
    2 status = c1
    2 subeventstatus[1]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
      3 Code = c4
      3 Description = vc
 )
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
declare dOrderID			= f8 with protect, noconstant(0.0)
declare dPersonID			= f8 with protect, noconstant(0.0)
declare sUserName			= vc with protect, noconstant("")
declare dPrsnlID			= f8 with protect, noconstant(0.0)
declare sPrsnlName			= vc with protect, noconstant("")
declare idebugFlag			= i2 with protect, noconstant(0)
declare dDispCategoryCd		= f8 with protect, noconstant(0.0)
declare dDispFromLocCd		= f8 with protect, noconstant(0.0)
 
declare c_privilege_cd_rxverify = f8 with protect, constant(uar_get_code_by("MEANING",6016,"RXVERIFY"))
declare c_privilege_value_yes = f8 with protect, constant(uar_get_code_by("MEANING",6017,"YES"))
declare c_charge_on_admin = f8 with protect, constant(uar_get_code_by("MEANING",4032,"CHGONADMIN"))
declare c_action_type_cd_review = f8 with protect, constant(uar_get_code_by("MEANING",6003,"REVIEW"))
declare c_disp_type_cd_initialdose = f8 with protect, constant(uar_get_code_by("MEANING",4032,"INITIALDOSE"))
declare c_label_type_cd_new	= f8 with protect, constant(uar_get_code_by("MEANING",4060,"NEW"))
declare c_order_action_cd_order = f8 with protect, constant(uar_get_code_by("MEANING",6003,"ORDER"))
 
/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
set dOrderID						= cnvtint($ORDER_ID)
set sUserName						= trim($USERNAME, 3)
set dPrsnlID						= GetPrsnlIDfromUserName(sUserName) ;defined in snsro_common
set reqinfo->updt_id				= dPrsnlId			;003
set sPrsnlName						= GetNameFromPrsnlID(dPrsnlID)  ;defined in snsro_common
set idebugFlag						= cnvtint($DEBUG_FLAG)
 
set medication_reply_out->order_id = dOrderID
call ErrorHandler2("PUT MEDICATION", "S", "Success", "Successfully verified order",
		"0000", build2("Successfully verified order ID: ", dOrderID), medication_reply_out)
 
if(idebugFlag > 0)
	call echo(build2("dOrderID -> ",dOrderID))
	call echo(build2("sUserName -> ",sUserName))
	call echo(build2("dPrsnlID -> ", dPrsnlID))
	call echo(build2("debug flag -> ", idebugFlag))
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare Req_380001(null) = i4 with protect			; rx_get_profile
declare Req_500286(null) = i4 with protect 			; dcp_get_privs
declare Req_360005(null) = i4 with protect			; Entity_Lock
declare Req_380043(null) = i4 with protect			; rx_get_order_action
declare Req_380003(null) = i4 with protect			; rx_get_item
declare Req_380076(null) = i4 with protect			; rx_get_pc_pref
declare Req_560000(null) = i4 with protect			; rx_get_format_id & ORM.FrmtQuery
declare Req_560201(null) = i4 with protect			; ORM.OrderWriteSynch
declare Req_305660(null) = i4 with protect			; PHA.AdminCharge
declare Req_305665(null) = i4 with protect			; PHA.BatchDispense
declare Req_360009(null) = i4 with protect			; Entity_Unlock
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
if(dOrderID > 0)
 
	; Validate order ID and retrieve patient details
	set iRet = Req_380001(null)
	if(iRet = 0)
		call ErrorHandler2("PUT MEDICATION", "F", "ValidateOrderID", "Invalid Order ID",
		"1001", build2("Order ID is invalid: ", dOrderID), medication_reply_out)
		go to EXIT_SCRIPT
	endif
 
	; Validate username
	set iRet = PopulateAudit(sUserName, dPersonID, medication_reply_out, sVersion)
	if(iRet = 0)
		call ErrorHandler2("PUT MEDICATION", "F", "PopulateAudit", "Invalid User for Audit.",
  		"1002",build2("Invalid user: ",sUserName), medication_reply_out)
		go to exit_script
	endif
 
 	; Validate order needs to be verified
	if(380001_rep->orderlist[1].needrxverifyind != 1)
		call ErrorHandler2("PUT MEDICATION", "F", "ValidatRxVerify", "Order does not need to be verified",
  		"1003",build2("This order does not need to be verified: ",dOrderID), medication_reply_out)
		go to exit_script
	endif
 
 	; Validate privileges
	set iRet = Req_500286(null)
	if(iRet < 0)
		call ErrorHandler2("PUT MEDICATION", "F", "ValidatePrivileges", "Could not validate privileges",
  		"1004",build2("Privileges check failed"), medication_reply_out)
		go to exit_script
	endif
 
	if(iRet = 0)
		call ErrorHandler2("PUT MEDICATION", "F", "ValidatePrivileges", "User does not have privileges to verify order",
  		"1005",build2("Invalid privs for user: ",sUserName), medication_reply_out)
		go to exit_script
	endif
 
	; Set patient lock
	set iRet = Req_360005(null)
	if(iRet = 0)
		call ErrorHandler2("PUT MEDICATION", "F", "SetLock", "Unable to set patient lock",
  		"1006",build2("Unable to set lock for patient tied to order: ",dOrderID), medication_reply_out)
		go to exit_script
	endif
 
	; Get OE Format Details
	set iRet = Req_560000(null)
	if(iRet < 0)
		call ErrorHandler2("PUT MEDICATION", "F", "ValidateOEFormat", "Could not retrieve OE format details",
  		"1007",build2("Could not retrieve OE format details"), medication_reply_out)
		go to exit_script
	endif
 
	; Verify Order
	set iRet = Req_560201(null)
	if(iRet = 0)
		call ErrorHandler2("PUT MEDICATION", "F", "VerifyOrder", "Could not verify order",
  		"1008",build2("Could not verify order id: ",dOrderID), medication_reply_out)
		go to exit_script
	endif
 
	; Validate Preferences
	set iRet = Req_380076(null)
	if(iRet = 1)
		; Drop charge on admin
		set iRet2 = Req_305660(null)
		if(iRet2 = 0)
			call ErrorHandler2("PUT MEDICATION", "F", "PhaAdminCharge", "Could not perform admin charge process",
  			"1009",build2("Could not perform admin charge process for order id: ",dOrderID), medication_reply_out)
			go to exit_script
		endif
	endif
 
	; Pharmacy batch dispense
	set iRet = Req_305665(null)
	if(iRet = 0)
		call ErrorHandler2("PUT MEDICATION", "F", "PhaBatchDispense", "Could not perform batch dispense process ",
  		"1010",build2("Could not perform batch dispense process for order id: ",dOrderID), medication_reply_out)
		go to exit_script
	endif
 
else
	call ErrorHandler2("PUT MEDICATION", "F", "Invalid URI Parameters", "Missing required field: Order ID.",
		"1000", "Missing required field: OrderID", medication_reply_out)
		go to EXIT_SCRIPT
endif
 
#EXIT_SCRIPT
 
; Release patient lock if one exists
if(360005_rep->lockKeyId > 0)
	set iRet = Req_360009(null)
	if(iRet = 0)
		call ErrorHandler2("PUT MEDICATION", "F", "ReleaseLock", "Could not release lock",
  		"1011",build2("Could not release lock for patient: ",dPersonID), medication_reply_out)
	endif
endif
/*************************************************************************
; RETURN JSON
**************************************************************************/
  if(idebugFlag > 0)
	  call echorecord(medication_reply_out)
 
	  set file_path = logical("ccluserdir")
	  set _file = build2(trim(file_path),"/snsro_verify_pharm_order.json")
	  call echo(build2("_file : ", _file))
	  call echojson(medication_reply_out, _file, 0)
  endif
 
  set JSONout = CNVTRECTOJSON(medication_reply_out)
 
  if(idebugFlag > 0)
	call echo(JSONout)
  endif
 
   if(validate(_MEMORY_REPLY_STRING))
    set _MEMORY_REPLY_STRING = trim(JSONout,3)
  endif
 
#EXIT_VERSION
/*************************************************************************
; SUBROUTINES
**************************************************************************/
 
/*************************************************************************
;  Name: Req_380001(null)
;  Description: rx_get_profile - Get order details
**************************************************************************/
subroutine Req_380001(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Req_380001 Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iAPPLICATION = 380000
	set iTASK = 380000
	set iREQUEST = 380001
 
	; Get and set the person id
	select into "nl:"
	from orders o
	where o.order_id = dOrderID
	detail
		dPersonID = o.person_id
	with nocounter
 
	set 380001_req->person_id = dPersonID
	set 380001_req->orderid = dOrderID
	set 380001_req->viewall_ind = 1
 
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",380001_req,"REC",380001_rep)
 
 	set iValidate = 0
	if(380001_rep->status_data.status = "S")
		set iValidate = 1
	endif
 
	if(idebugFlag > 0)
		call echo(concat("Req_380001 Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
 	return(iValidate)
end ;End Subroutine
 
/*************************************************************************
;  Name: Req_500286
;  Description: dcp_get_privs - Get privileges
**************************************************************************/
subroutine Req_500286(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Req_500286 Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iAPPLICATION = 380000
	set iTASK = 380000
	set iREQUEST = 500286
 
	set 500286_req->chk_prsnl_ind = 1
	set 500286_req->chk_psn_ind = 1
	set 500286_req->prsnl_id = dPrsnlID
	set stat = alterlist(500286_req->plist,1)
	set 500286_req->plist[1].privilege_cd = c_privilege_cd_rxverify
 
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",500286_req,"REC",500286_rep)
 
	set iValidate = -1
	if(500286_rep->status_data.status = "S")
		set iValidate = 0
		if(500286_rep->qual[1].priv_value_mean = "YES")
			set iValidate = 1
		endif
	endif
 
	if(idebugFlag > 0)
		call echo(concat("Req_500286 Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
 	return(iValidate)
end ;End Subroutine
 
/*************************************************************************
;  Name: Req_360005(null)
;  Description: Entity_Lock - Set Patient Lock
**************************************************************************/
subroutine Req_360005(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Req_360005 Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iAPPLICATION = 380000
	set iTASK = 380004
	set iREQUEST = 360005
 
	set 360005_req->patientId = dPersonID
 
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",360005_req,"REC",360005_rep)
 
	if(idebugFlag > 0)
		call echo(concat("Req_360005 Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
 	return(360005_rep->success)
end ;End Subroutine
 
/*************************************************************************
;  Name: Req_560000(null)
;  Description: rx_get_format_id & ORM.FrmtQuery
**************************************************************************/
subroutine Req_560000(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Req_560000 Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
 
	; Get OE format ID
 	select into "nl:"
  	from order_entry_format oef
  	where oef.oe_format_name = "Primary Pharmacy"
  	detail
  		560000_req->oeFormatId = oef.oe_format_id
  	with nocounter
 
  	set 560000_req->actionTypeCd = c_order_action_cd_order
 
	set iAPPLICATION = 380000
	set iTASK = 380000
	set iREQUEST = 560000
 
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",560000_req,"REC",560000_rep)
 
	if(560000_rep->status_data.status = "S")
		set iValidate = 1
	endif
 
	if(idebugFlag > 0)
		call echo(concat("Req_560000 Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
 	return(iValidate)
end ;End Subroutine
 
/*************************************************************************
;  Name: Req_560201(null)
;  Description: ORM.OrderWriteSynch - Verify Order
**************************************************************************/
subroutine Req_560201(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Req_560201 Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iAPPLICATION = 380000
	set iTASK = 380002
	set iREQUEST = 560201
 
	set iActSeq = 380001_rep->orderlist[1].lastactionseq
 
	set 560201_req->personId = dPersonID
	set 560201_req->encntrId = 380001_rep->encntrid
	set 560201_req->commitGroupInd = 1
	set 560201_req->orderSheetInd = 1
	set 560201_req->lockKeyId = 360005_rep->lockKeyId
	set stat = alterlist(560201_req->orderList,1)
	set 560201_req->orderList[1]->orderId = dOrderID
	set 560201_req->orderList[1]->actionTypeCd = c_action_type_cd_review
	set 560201_req->orderList[1]->communicationTypeCd = 380001_rep->orderlist[1]->actionlist[iActSeq].communicationtypecd
	set 560201_req->orderList[1]->orderProviderId = 380001_rep->orderlist[1]->actionlist[iActSeq].orderproviderid
	set 560201_req->orderList[1]->orderDtTm = 380001_rep->orderlist[1]->actionlist[iActSeq].orderdttm
	set 560201_req->orderList[1]->currentStartDtTm = 380001_rep->orderlist[1].current_start_dt_tm
	set 560201_req->orderList[1]->oeFormatId = 380001_rep->orderlist[1].oeformatid
	set 560201_req->orderList[1]->catalogTypeCd = 380001_rep->orderlist[1].catalogtypecd
	set 560201_req->orderList[1]->lastUpdtCnt = 380001_rep->orderlist[1].lastupdtcnt
 
	set stat = alterlist(560201_req->orderList[1]->reviewList,1)
	set 560201_req->orderList[1]->reviewList[1].reviewTypeFlag = 3
	set 560201_req->orderList[1]->reviewList[1].reviewPersonnelId = dPrsnlID
	set 560201_req->orderList[1]->reviewList[1].actionSequence = iActSeq
 
	set 560201_req->orderList[1]->deptMiscLine = 380001_rep->orderlist[1].dept_misc_line
	set 560201_req->orderList[1]->catalogCd = 380001_rep->orderlist[1].catalogcd
	set 560201_req->orderList[1]->synonymId = 380001_rep->orderlist[1].synonymid
	set 560201_req->orderList[1]->passingOrcInfoInd = 1
	set 560201_req->orderList[1]->contOrderMethodFlag = 2
	set 560201_req->orderList[1]->orderStatusCd = 380001_rep->orderlist[1].order_status_cd
	set 560201_req->orderList[1]->medOrderTypeCd = 380001_rep->orderlist[1].medordertypecd
	set 560201_req->orderList[1]->validDoseDtTm = 380001_rep->orderlist[1].valid_dose_dt_tm
 
	; Get the action initiated dttm
	select into "nl:"
	from order_action oa
	where oa.order_id = dOrderID and oa.action_sequence = iActSeq
	detail
		560201_req->orderList[1]->actionInitiatedDtTm = oa.action_initiated_dt_tm
	with nocounter
 
	; Temp structure for OE format details
	free record temp
	record temp (
		1 qual[*]
	    	2 oeFieldId = f8
			2 oeFieldValue = f8
	        2 oeFieldDisplayValue = vc
	        2 oeFieldDtTmValue = dq8
	        2 oeFieldMeaning = vc
	        2 oeFieldMeaningId = f8
	        2 valueRequiredInd = i2
	        2 groupSeq = i4
	        2 fieldSeq = i4
	        2 modifiedInd = i2
	)
 
	; Load OE format details from 56000 request
	declare repSize = i4
	set repSize = size(560000_rep->fieldList,5)
 
	select into "nl:"
	from (dummyt d1 with seq = repSize)
	head report
		stat = alterlist(temp->qual,repSize)
	detail
		x  = d1.seq
 
		temp->qual[x].oeFieldId = 560000_rep->fieldList[d1.seq].oeFieldId
		temp->qual[x].oeFieldMeaning = 560000_rep->fieldList[d1.seq].oeFieldMeaning
		temp->qual[x].oeFieldMeaningId = 560000_rep->fieldList[d1.seq].oeFieldMeaningId
		temp->qual[x].groupSeq = 560000_rep->fieldList[d1.seq].groupSeq
		temp->qual[x].fieldSeq = 560000_rep->fieldList[d1.seq].fieldSeq
	with nocounter
 
	; Load specific OE format details tied to order
	select into "nl:"
	from (dummyt d1 with seq = size(temp,5))
	, (dummyt d2 with seq = size(380001_rep->orderlist[1].actionlist[iActSeq].detaillist,5))
 
	plan d1
	join d2 where 380001_rep->orderlist[1].actionlist[iActSeq].detaillist[d2.seq].oefieldid =
					temp->qual[d1.seq].oeFieldId
	head report
		x = 0
	detail
		temp->qual[d1.seq].oeFieldValue =  380001_rep->orderlist[1].actionlist[iActSeq].detaillist[d2.seq].oefieldvalue
	    temp->qual[d1.seq].oeFieldDisplayValue = 380001_rep->orderlist[1].actionlist[iActSeq].detaillist[d2.seq].oefielddisplayvalue
	   	temp->qual[d1.seq].oeFieldDtTmValue = 380001_rep->orderlist[1].actionlist[iActSeq].detaillist[d2.seq].oefielddttmvalue
	    temp->qual[d1.seq].oeFieldMeaning = 380001_rep->orderlist[1].actionlist[iActSeq].detaillist[d2.seq].oefieldmeaning
	    temp->qual[d1.seq].oeFieldMeaningId = 380001_rep->orderlist[1].actionlist[iActSeq].detaillist[d2.seq].oefieldmeaningid
	    temp->qual[d1.seq].valueRequiredInd = 380001_rep->orderlist[1].actionlist[iActSeq].detaillist[d2.seq].valuerequiredind
	    temp->qual[d1.seq].groupSeq = 380001_rep->orderlist[1].actionlist[iActSeq].detaillist[d2.seq].groupseq
	    temp->qual[d1.seq].fieldSeq = 380001_rep->orderlist[1].actionlist[iActSeq].detaillist[d2.seq].fieldseq
	    temp->qual[d1.seq].modifiedInd = 380001_rep->orderlist[1].actionlist[iActSeq].detaillist[d2.seq].modifiedind
 
	    case(temp->qual[d1.seq].oeFieldMeaning)
	    	of "NEXTDISPENSEDTTM":
	    		x = x + 1
	    		stat = alterlist(560201_req->orderList[1].miscList,x)
 
	    		560201_req->orderList[1].miscList[x].fieldMeaning = temp->qual[d1.seq].oeFieldMeaning
	    		560201_req->orderList[1].miscList[x].fieldMeaningId = temp->qual[d1.seq].oeFieldMeaningId
	    		560201_req->orderList[1].miscList[x].fieldValue = temp->qual[d1.seq].oeFieldValue
	    		560201_req->orderList[1].miscList[x].fieldDisplayValue = temp->qual[d1.seq].oeFieldDisplayValue
	    		560201_req->orderList[1].miscList[x].fieldDtTmValue = temp->qual[d1.seq].oeFieldDtTmValue
	    		560201_req->orderList[1].miscList[x].modifiedInd = 1
 
	    	of "WRITEORDISP":
	    		x = x + 1
	    		stat = alterlist(560201_req->orderList[1].miscList,x)
 
	    		560201_req->orderList[1].miscList[x].fieldMeaning = temp->qual[d1.seq].oeFieldMeaning
	    		560201_req->orderList[1].miscList[x].fieldMeaningId = temp->qual[d1.seq].oeFieldMeaningId
	    		560201_req->orderList[1].miscList[x].fieldValue = temp->qual[d1.seq].oeFieldValue
	    		560201_req->orderList[1].miscList[x].fieldDisplayValue = temp->qual[d1.seq].oeFieldDisplayValue
	    		560201_req->orderList[1].miscList[x].fieldDtTmValue = temp->qual[d1.seq].oeFieldDtTmValue
	    		560201_req->orderList[1].miscList[x].modifiedInd = 1
	    	of "DISPENSECATEGORY":
	    		dDispCategoryCd = temp->qual[d1.seq].oeFieldValue
	    	of "DISPENSEFROMLOC":
	    		dDispFromLocCd = temp->qual[d1.seq].oeFieldValue
	    endcase
 
	with nocounter
 
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",560201_req,"REC",560201_rep)
 
 	set iValidate = 0
 	if(560201_rep->status_data.status = "S")
 		set iValidate = 1
 	endif
 
	if(idebugFlag > 0)
		call echo(concat("Req_560201 Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
 	return(iValidate)
end ;End Subroutine
 
/*************************************************************************
;  Name: Req_380076(null)
;  Description:  rx_get_pc_pref - Verify preferences for MED_CHG_ON_ADMIN
**************************************************************************/
subroutine Req_380076(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Req_380076 Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iAPPLICATION = 380000
	set iTASK = 380000
	set iREQUEST = 380076
 
	set 380076_req->prsnl_id = dPrsnlID
	set 380076_req->application_number = 600005
	set 380076_req->parent_entity_name = "APP_PREFS"
	set 380076_req->pvc_name = "MED_CHG_ON_ADMIN"
 
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",380076_req,"REC",380076_rep)
 
	if(idebugFlag > 0)
		call echo(concat("Req_380076 Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
 	return(cnvtint(380076_rep->pvc_value))
end ;End Subroutine
 
/*************************************************************************
;  Name: Req_305660(null)
;  Description: PHA.AdminCharge
**************************************************************************/
subroutine Req_305660(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Req_305660 Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set stat = alterlist(305660_req->qual,1)
	set 305660_req->qual[1].order_id = dOrderID
	set 305660_req->qual[1].dispense_type_cd = c_charge_on_admin
 
	set iAPPLICATION = 380000
	set iTASK = 380002
	set iREQUEST = 305660
 
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",305660_req,"REC",305660_rep)
 
 	set iValidate = 0
 	if(305660_rep->qual[1].status = "S")
 		set iValidate = 1
 	endif
 
	if(idebugFlag > 0)
		call echo(concat("Req_305660 Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
 	return(iValidate)
end ;End Subroutine
 
/*************************************************************************
;  Name: Req_305665(null)
;  Description: PHA.BatchDispense
**************************************************************************/
subroutine Req_305665(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Req_305665 Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iAPPLICATION = 380000
	set iTASK = 380002
	set iREQUEST = 305665
 
 	set stat = alterlist(305665_req->dispense_list,1)
 	set 305665_req->dispense_list[1].dispense_type_cd = c_disp_type_cd_initialdose
 
 	select into "nl:"
	from dispense_category dc
	where dc.dispense_category_cd = dDispCategoryCd
	detail
 		305665_req->dispense_list[1].output_format_cd = dc.label_format_cd
 	with nocounter
 
 	set 305665_req->dispense_list[1].dispense_ind = 1
 	set 305665_req->dispense_list[1].bill_ind = 1
 	set 305665_req->dispense_list[1].print_ind = 1
 
 	set stat = alterlist(305665_req->dispense_list[1].order_list,1)
 	set 305665_req->dispense_list[1].order_list[1].order_id = dOrderID
 	set 305665_req->dispense_list[1].order_list[1].dispense_category_cd = dDispCategoryCd
 	set 305665_req->dispense_list[1].order_list[1].next_iv_sequence = 380001_rep->orderlist[1].next_iv_seq
 	set 305665_req->dispense_list[1].order_list[1].next_dispense = 380001_rep->orderlist[1].next_dispense_dt_tm
 	set 305665_req->dispense_list[1].order_list[1].dispense_dt_tm = cnvtdatetime(curdate,curtime3)
 	set 305665_req->dispense_list[1].order_list[1].num_labels = 1
 	;set 305665_req->dispense_list[1].order_list[1]
 
 	set 305665_req->dispense_list[1].label_type_cd = c_label_type_cd_new
 	set 305665_req->dispense_list[1].dispense_from_cd = dDispFromLocCd
 	;set 305665_req->dispense_list[1].inv_location_cd
 
 
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",305665_req,"REC",305665_rep)
 	set iValidate = 0
 	if(305665_rep->status_data.status = "S")
 		set iValidate = 1
 	endif
 
	if(idebugFlag > 0)
		call echo(concat("Req_305665 Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
 	return(iValidate)
end ;End Subroutine
 
/*************************************************************************
;  Name: Req_360009(null)
;  Description: Entity_Unlock - Release patient lock
**************************************************************************/
subroutine Req_360009(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Req_360009 Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iAPPLICATION = 380000
	set iTASK = 380004
	set iREQUEST = 360009
 
	set 360009_req->lockKeyId = 360005_rep->lockKeyId
 
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",360009_req,"REC",360009_rep)
 
	if(idebugFlag > 0)
		call echo(concat("Req_360009 Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
 	return(360009_rep->success)
end ;End Subroutine
 
 
end go
set trace notranslatelock go
 
 
