/***********************************************************************
*
*  Copyright Notice:  (c) 2018 Sansoro Health, LLC
*
*  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
*  This material contains the valuable properties and trade secrets of
*  Sansoro Health, United States of
*  America, embodying substantial creative efforts and
*  confidential information, ideas and expressions, no part of which
*  may be reproduced or transmitted in any form or by any means, or
*  retained in any storage or retrieval system without the express
*  written permission of Sansoro Health.
*
************************************************************************
      Source file name: snsro_post_proposed_orders.prg
      Object name:      snsro_post_proposed_orders
      Program purpose:  POST a proposed order in Millennium.
      Executing from:   Emissary
 ***********************************************************************
                  MODIFICATION CONTROL LOG
 ***********************************************************************
 Mod Date     Engineer  Comment
 -----------------------------------------------------------------------
 001 09/20/18 RJC		Initial Write
 ************************************************************************/
drop program snsro_post_proposed_orders go
create program snsro_post_proposed_orders
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username" = ""        		;Required
		, "ArgumentList" = ""			;Required
		, "Debug" = 0					;Optional
 
 
with OUTDEV, USERNAME, ARGS, DEBUG_FLAG
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.16.6.1" ;003
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
;560000 - ORM.FmtQuery
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
 
;500698 - orm_get_next_sequence
free record 500698_req
record 500698_req (
  1 seq_name = vc
  1 number = i2
)
 
free record 500698_rep
record 500698_rep (
   1 qual [* ]
     2 seq_value = f8
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
)
 
;560221 - OAR.AddProposal
free record 560221_req
record 560221_req (
  1 newOrderList [*]
    2 personId = f8
    2 encounterId = f8
    2 proposalSourceTypeCd = f8
    2 responsiblePrsnlId = f8
    2 medOrderTypeCd = f8
    2 synonymId = f8
    2 origOrdAsFlag = i2
    2 projectedOrderId = f8
    2 detailList [*]
      3 oeFieldId = f8
      3 oeFieldValue = f8
      3 oeFieldDisplayValue = vc
      3 oeFieldDtTmValue = dq8
      3 oeFieldMeaning = vc
      3 oeFieldMeaningId = f8
      3 detailDefaultValue = c254
      3 detailHistoryList [*]
        4 oeFieldValue = f8
        4 oeFieldDisplayValue = vc
        4 oeFieldDtTmValue = dq8
        4 detailAlterTriggerCd = f8
    2 commentList [*]
      3 commentType = f8
      3 commentText = vc
    2 subComponentList [*]
      3 scSynonymId = f8
      3 scOrderedAsMnemonic = vc
      3 scStrengthDose = f8
      3 scStrengthDoseDisp = vc
      3 scStrengthUnit = f8
      3 scStrengthUnitDisp = vc
      3 scVolumeDose = f8
      3 scVolumeDoseDisp = vc
      3 scVolumeUnit = f8
      3 scVolumeUnitDisp = vc
      3 scFreetextDose = vc
      3 scIngredientTypeFlag = i2
      3 scClinicallySignificantFlag = i2
      3 scIngredientSourceFlag = i2
      3 scOrderedDose = f8
      3 scOrderedDoseUnitCd = f8
      3 scDoseCalculatorLongText = vc
      3 scBagFrequencyCd = f8
      3 scBagFrequencyDisp = vc
      3 scIncludeInTotalVolumeFlag = i2
      3 scNormalizedRate = f8
      3 scNormalizedRateDisp = vc
      3 scNormalizedRateUnitCd = f8
      3 scNormalizedRateUnitDisp = vc
      3 scConcentration = f8
      3 scConcentrationDisp = vc
      3 scConcentrationUnitCd = f8
      3 scConcentrationUnitDisp = vc
      3 scDoseAdjustmentDisp = vc
      3 scTherapeuticSubstitutionList [*]
        4 therapeuticSubstitutionId = f8
        4 acceptType
          5 acceptInd = i2
          5 overrideInd = i2
          5 alternateRegimenInd = i2
        4 overrideReasonCd = f8
      3 scHistoryList [*]
        4 alterTriggerCd = f8
        4 synonymId = f8
        4 strengthDose
          5 value = f8
          5 unitOfMeasureCd = f8
        4 volumeDose
          5 value = f8
          5 unitOfMeasureCd = f8
        4 freetextDose = vc
    2 diagnosisList [*]
      3 diagnosisId = f8
      3 rankSequence = i4
    2 adHocFreqTimeList [*]
      3 adHocTime = i2
    2 promptTestList [*]
      3 oeFieldId = f8
      3 oeFieldValue = f8
      3 oeFieldDisplayValue = vc
      3 oeFieldDtTmValue = dq8
    2 ivSetSynonymId = f8
    2 orderedAsMnemonic = vc
    2 projectedCSOrderId = f8
    2 communicationTypeCd = f8
    2 relatedOrderInfo [*]
      3 orderId = f8
      3 actionSequence = i4
      3 relationshipType
        4 copyRepeatInd = i2
        4 cancelReorderInd = i2
        4 renewRxInd = i2
        4 convertInd = i2
    2 futureInfo [*]
      3 scheduleNewOrderAsEstimated [*]
        4 startDateTimeInd = i2
        4 stopDateTimeInd = i2
      3 location [*]
        4 facilityCd = f8
        4 nurseUnitCd = f8
      3 applyStartRange [*]
        4 value = i4
        4 unit
          5 daysInd = i2
          5 weeksInd = i2
          5 monthsInd = i2
        4 rangeAnchorPoint
          5 startInd = i2
          5 centerInd = i2
    2 supervisingProviderId = f8
    2 billingproviderinfo [*]
      3 orderProviderInd = i2
      3 supervisingProviderInd = i2
    2 protocolInfo [*]
      3 protocolType = i2
    2 incompleteToPharmacy [*]
      3 noSynonymMatchInd = i2
      3 missingOrderDetailsInd = i2
    2 originatingEncounterId = f8
  1 completeOrderList [*]
    2 orderId = f8
    2 proposalSourceTypeCd = f8
    2 responsiblePrsnlId = f8
    2 orderUpdtCnt = i4
    2 detailList [*]
      3 oeFieldId = f8
      3 oeFieldValue = f8
      3 oeFieldDisplayValue = vc
      3 oeFieldDtTmValue = dq8
      3 oeFieldMeaning = vc
      3 oeFieldMeaningId = f8
      3 detailAlterFlag = i2
    2 communicationTypeCd = f8
  1 cancelOrderList [*]
    2 orderId = f8
    2 proposalSourceTypeCd = f8
    2 responsiblePrsnlId = f8
    2 orderUpdtCnt = i4
    2 detailList [*]
      3 oeFieldId = f8
      3 oeFieldValue = f8
      3 oeFieldDisplayValue = vc
      3 oeFieldDtTmValue = dq8
      3 oeFieldMeaning = vc
      3 oeFieldMeaningId = f8
      3 detailAlterFlag = i2
    2 communicationTypeCd = f8
    2 supervisingProviderId = f8
    2 billingproviderinfo [*]
      3 orderProviderInd = i2
      3 supervisingProviderInd = i2
  1 discontinueOrderList [*]
    2 orderId = f8
    2 proposalSourceTypeCd = f8
    2 responsiblePrsnlId = f8
    2 orderUpdtCnt = i4
    2 detailList [*]
      3 oeFieldId = f8
      3 oeFieldValue = f8
      3 oeFieldDisplayValue = vc
      3 oeFieldDtTmValue = dq8
      3 oeFieldMeaning = vc
      3 oeFieldMeaningId = f8
      3 detailAlterFlag = i2
    2 communicationTypeCd = f8
    2 supervisingProviderId = f8
    2 billingproviderinfo [*]
      3 orderProviderInd = i2
      3 supervisingProviderInd = i2
  1 modifyOrderList [*]
    2 orderId = f8
    2 newEncounterId = f8
    2 proposalSourceTypeCd = f8
    2 responsiblePrsnlId = f8
    2 orderUpdtCnt = i4
    2 detailList [*]
      3 oeFieldId = f8
      3 oeFieldValue = f8
      3 oeFieldDisplayValue = vc
      3 oeFieldDtTmValue = dq8
      3 oeFieldMeaning = vc
      3 oeFieldMeaningId = f8
      3 detailAlterFlag = i2
      3 detailHistoryList [*]
        4 oeFieldValue = f8
        4 oeFieldDisplayValue = vc
        4 oeFieldDtTmValue = dq8
        4 detailAlterTriggerCd = f8
    2 commentList [*]
      3 commentType = f8
      3 commentText = vc
    2 subComponentList [*]
      3 scSynonymId = f8
      3 scOrderedAsMnemonic = vc
      3 scStrengthDose = f8
      3 scStrengthDoseDisp = vc
      3 scStrengthUnit = f8
      3 scStrengthUnitDisp = vc
      3 scVolumeDose = f8
      3 scVolumeDoseDisp = vc
      3 scVolumeUnit = f8
      3 scVolumeUnitDisp = vc
      3 scFreetextDose = vc
      3 scIngredientTypeFlag = i2
      3 scClinicallySignificantFlag = i2
      3 scIngredientSourceFlag = i2
      3 scOrderedDose = f8
      3 scOrderedDoseUnitCd = f8
      3 scDoseCalculatorLongText = vc
      3 scBagFrequencyCd = f8
      3 scBagFrequencyDisp = vc
      3 scIncludeInTotalVolumeFlag = i2
      3 scNormalizedRate = f8
      3 scNormalizedRateDisp = vc
      3 scNormalizedRateUnitCd = f8
      3 scNormalizedRateUnitDisp = vc
      3 scConcentration = f8
      3 scConcentrationDisp = vc
      3 scConcentrationUnitCd = f8
      3 scConcentrationUnitDisp = vc
      3 scAlterFlag = i2
      3 scDoseAdjustmentDisp = vc
      3 scTherapeuticSubstitutionList [*]
        4 therapeuticSubstitutionId = f8
        4 acceptType
          5 acceptInd = i2
          5 overrideInd = i2
          5 alternateRegimenInd = i2
        4 overrideReasonCd = f8
      3 scHistoryList [*]
        4 alterTriggerCd = f8
        4 synonymId = f8
        4 strengthDose
          5 value = f8
          5 unitOfMeasureCd = f8
        4 volumeDose
          5 value = f8
          5 unitOfMeasureCd = f8
        4 freetextDose = vc
    2 diagnosisList [*]
      3 diagnosisId = f8
      3 rankSequence = i4
      3 diagnosisAlterFlag = i2
    2 adHocFreqTimeList [*]
      3 adHocTime = i2
    2 promptTestList [*]
      3 oeFieldId = f8
      3 oeFieldValue = f8
      3 oeFieldDisplayValue = vc
      3 oeFieldDtTmValue = dq8
    2 communicationTypeCd = f8
    2 futureInfo [*]
      3 changeScheduleToPrecise [*]
        4 startDateTimeInd = i2
        4 stopDateTimeInd = i2
      3 location [*]
        4 facilityCd = f8
        4 nurseUnitCd = f8
    2 supervisingProviderId = f8
    2 billingproviderinfo [*]
      3 orderProviderInd = i2
      3 supervisingProviderInd = i2
  1 suspendOrderList [*]
    2 orderId = f8
    2 proposalSourceTypeCd = f8
    2 responsiblePrsnlId = f8
    2 orderUpdtCnt = i4
    2 detailList [*]
      3 oeFieldId = f8
      3 oeFieldValue = f8
      3 oeFieldDisplayValue = vc
      3 oeFieldDtTmValue = dq8
      3 oeFieldMeaning = vc
      3 oeFieldMeaningId = f8
      3 detailAlterFlag = i2
    2 communicationTypeCd = f8
    2 supervisingProviderId = f8
    2 billingproviderinfo [*]
      3 orderProviderInd = i2
      3 supervisingProviderInd = i2
  1 resumeOrderList [*]
    2 orderId = f8
    2 proposalSourceTypeCd = f8
    2 responsiblePrsnlId = f8
    2 orderUpdtCnt = i4
    2 detailList [*]
      3 oeFieldId = f8
      3 oeFieldValue = f8
      3 oeFieldDisplayValue = vc
      3 oeFieldDtTmValue = dq8
      3 oeFieldMeaning = vc
      3 oeFieldMeaningId = f8
      3 detailAlterFlag = i2
    2 communicationTypeCd = f8
    2 supervisingProviderId = f8
    2 billingproviderinfo [*]
      3 orderProviderInd = i2
      3 supervisingProviderInd = i2
  1 renewOrderList [*]
    2 orderId = f8
    2 proposalSourceTypeCd = f8
    2 responsiblePrsnlId = f8
    2 orderUpdtCnt = i4
    2 detailList [*]
      3 oeFieldId = f8
      3 oeFieldValue = f8
      3 oeFieldDisplayValue = vc
      3 oeFieldDtTmValue = dq8
      3 oeFieldMeaning = vc
      3 oeFieldMeaningId = f8
      3 detailAlterFlag = i2
    2 communicationTypeCd = f8
    2 supervisingProviderId = f8
    2 billingproviderinfo [*]
      3 orderProviderInd = i2
      3 supervisingProviderInd = i2
)
 
free record 560221_rep
record 560221_rep (
  1 newOrderList [*]
    2 orderProposalId = f8
    2 projectedOrderId = f8
    2 proposalStatusCd = f8
    2 clinicalDisplayLine = vc
    2 simplifiedDisplayLine = vc
    2 statusData
      3 status = vc
      3 errorCd = f8
      3 debugErrorStr = vc
  1 completeOrderList [*]
    2 orderProposalId = f8
    2 orderId = f8
    2 proposalStatusCd = f8
    2 statusData
      3 status = vc
      3 errorCd = f8
      3 debugErrorStr = vc
  1 cancelOrderList [*]
    2 orderProposalId = f8
    2 orderId = f8
    2 proposalStatusCd = f8
    2 statusData
      3 status = vc
      3 errorCd = f8
      3 debugErrorStr = vc
  1 discontinueOrderList [*]
    2 orderProposalId = f8
    2 orderId = f8
    2 proposalStatusCd = f8
    2 statusData
      3 status = vc
      3 errorCd = f8
      3 debugErrorStr = vc
  1 transactionStatus = vc
  1 modifyOrderList [*]
    2 orderProposalId = f8
    2 orderId = f8
    2 proposalStatusCd = f8
    2 clinicalDisplayLine = vc
    2 simplifiedDisplayLine = vc
    2 statusData
      3 status = vc
      3 errorCd = f8
      3 debugErrorStr = vc
  1 suspendOrderList [*]
    2 orderProposalId = f8
    2 orderId = f8
    2 proposalStatusCd = f8
    2 statusData
      3 status = vc
      3 errorCd = f8
      3 debugErrorStr = vc
  1 resumeOrderList [*]
    2 orderProposalId = f8
    2 orderId = f8
    2 proposalStatusCd = f8
    2 statusData
      3 status = vc
      3 errorCd = f8
      3 debugErrorStr = vc
  1 renewOrderList [*]
    2 orderProposalId = f8
    2 orderId = f8
    2 proposalStatusCd = f8
    2 clinicalDisplayLine = vc
    2 simplifiedDisplayLine = vc
    2 statusData
      3 status = vc
      3 errorCd = f8
      3 debugErrorStr = vc
)
 
; Final reply
free record order_reply_out
record order_reply_out(
  1 proposed_order_id      	= f8
  1 audit
    2 user_id             	= f8
    2 user_firstname        = vc
    2 user_lastname         = vc
    2 patient_id         	= f8
    2 patient_firstname  	= vc
    2 patient_lastname  	= vc
    2 service_version   	= vc
  1 status_data
    2 status				= c1
    2 subeventstatus[1]
      3 OperationName 		= c25
      3 OperationStatus 	= c1
      3 TargetObjectName 	= c25
      3 TargetObjectValue 	= vc
      3 Code 				= c4
      3 Description 		= vc
)
 
free record arglist
record arglist (
	1 patientId 				= vc
	1 encounterId 				= vc
	1 orderableCodeId 			= vc
	1 responsiblePersonnelId 	= vc
	1 medicationOrderBasis 		= vc
	1 orderFields[*]
		2 id 					= vc
		2 values[*]				= vc
)
 
free record oe_fields
record oe_fields(
	1 qual[*]
		2 oe_field_id 				= f8
		2 oe_field_value 			= f8
		2 oe_field_display_value 	= vc
		2 oe_field_dttm_value 		= dq8
		2 oe_field_meaning_id 		= f8
		2 oe_field_meaning 			= vc
		2 default_value 			= vc
		2 response					= vc
)
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
; Input
declare sUserName						= vc with protect, noconstant("")
declare sJsonArgs						= vc with protect, noconstant("")
declare dPatientId						= f8 with protect, noconstant(0.0)
declare dEncounterId					= f8 with protect, noconstant(0.0)
declare dOrderableId					= f8 with protect, noconstant(0.0)
declare dResponsiblePrsnlId				= f8 with protect, noconstant(0.0)
declare iMedicationOrderBasis			= i4 with protect, noconstant(0)
declare iDebugFlag						= i2 with protect, noconstant(0)
 
; Other
declare dPrsnlId						= f8 with protect, noconstant(0)
declare dPositionCd						= f8 with protect, noconstant(0)
declare dEncntrTypeCd					= f8 with protect, noconstant(0.0)
declare dCatalogCd						= f8 with protect, noconstant(0.0)
declare dOeFormatId						= f8 with protect, noconstant(0.0)
declare sOrderMnemonic					= vc with protect, noconstant("")
declare dEncounterLocCd					= f8 with protect, noconstant(0.0)
declare dActivityTypeCd					= f8 with protect, noconstant(0.0)
 
; Constants
declare c_error_handler 				= vc with protect, constant("POST PROPOSED ORDER")
declare c_order_proposal_source_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",6502,"ORDER"))
declare c_order_action_type_cd			= f8 with protect, constant(uar_get_code_by("MEANING",6003,"ORDER"))
declare c_powerchart_application_cd		= f8 with protect, constant(uar_get_code_by("MEANING",14124,"POWERCHART"))
declare c_med_med_order_type_cd			= f8 with protect, constant(uar_get_code_by("MEANING",18309,"MED"))
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
;Input
set sUserName				= trim($USERNAME, 3)
set sJsonArgs				= trim($ARGS,3)
set jrec					= cnvtjsontorec(sJsonArgs)
set dPatientId				= cnvtreal(arglist->patientId)
set dEncounterId			= cnvtreal(arglist->encounterId)
set dOrderableId			= cnvtreal(arglist->orderableCodeId)
set dResponsiblePrsnlId		= cnvtreal(arglist->responsiblePersonnelId)
set iMedicationOrderBasis	= cnvtint(arglist->medicationOrderBasis)
set iDebugFlag				= cnvtint($DEBUG_FLAG)
 
;Other
set dPrsnlId 				= GetPrsnlIDfromUserName(sUserName)
set dPositionCd 			= GetPositionByPrsnlId(dPrsnlId)
set dEncntrTypeCd			= GetPatientClass(dEncounterId,1)
 
; Add Order Details fields to oe_field rec
set oeSize = size(arglist->orderFields,5)
if(oeSize > 0)
	set stat = alterlist(oe_fields->qual,oeSize)
	for(i = 1 to oeSize)
		set oe_fields->qual[i].oe_field_id = cnvtreal(arglist->orderFields[i].id)
		set respSize = size(arglist->orderFields[i].values,5)
		if( respSize > 0)
			for(x = 1 to respSize)
				if(x = 1)
					set oe_fields->qual[i].response = arglist->orderFields[i].values[x]
				else
					; if multiple responses exist, additional records need to be added with same oe_field_id
					set newSize = size(oe_fields->qual,5)
					set stat = alterlist(oe_fields->qual,newSize + 1)
					set oe_fields->qual[value(newSize + 1)].oe_field_id = cnvtreal(arglist->orderFields[i].id)
					set oe_fields->qual[value(newSize + 1)].response = arglist->orderFields[i].values[x]
				endif
			endfor
		endif
	endfor
endif
 
if(iDebugFlag > 0)
	call echo(build("sUserName -> ",sUserName))
	call echo(build("sJsonArgs -> ",sJsonArgs))
	call echo(build("dPatientId -> ",dPatientId))
	call echo(build("dEncounterId -> ",dEncounterId))
	call echo(build("dOrderableId -> ",dOrderableId))
	call echo(build("dResponsiblePrsnlId -> ",dResponsiblePrsnlId))
	call echo(build("iMedicationOrderBasis -> ",iMedicationOrderBasis))
	call echo(build("dPrsnlId -> ",dPrsnlId))
	call echo(build("dPositionCd -> ",dPositionCd))
	call echo(build("dEncntrTypeCd -> ",dEncntrTypeCd))
	call echorecord(oe_fields)
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetOrderableDetails(null) 		= i2 with protect
declare GetOrderFormatDetails(null) 	= i2 with protect 	;560000 - ORM.FmtQuery
declare GetOrderSeq(null)				= i2 with protect 	;500698 - orm_get_next_sequence
declare PostProposedOrder(null)			= null with protect ;560221 - OAR.AddProposal
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Verify PatientId Exists
if(dPatientId = 0)
	call ErrorHandler2(c_error_handler, "F", "Invalid URI Parameters", "Missing required field: PatientId.",
	"2055", "Missing required field: PatientId", order_reply_out)
	go to EXIT_SCRIPT
endif
 
; Verify EncounterId exists
if(dEncounterId = 0)
	call ErrorHandler2(c_error_handler, "F", "Invalid URI Parameters", "Missing required field: EncounterId.",
	"2055", "Missing required field: EncounterId", order_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate username
set iRet = PopulateAudit(sUserName, dPatientId, order_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2(c_error_handler, "F", "User is invalid", "Invalid User for Audit.",
	"1001",build("Invalid user: ",sUserName), order_reply_out)
	go to exit_script
endif
 
; Validate PatientId/EncounterId combo is valid
set iRet = ValidateEncntrPatientReltn(dPatientId,dEncounterId)
if(iRet = 0)
	call ErrorHandler2(c_error_handler, "F", "Validate", "Invalid PatientId/EncounterId combination.",
	"9999",build("Invalid PatientId/EncounterId combination."), order_reply_out)
	go to exit_script
endif
 
;Validate dResponsiblePrsnlId
set sRet = trim(GetNameFromPrsnlID(dResponsiblePrsnlId),3)
if(sRet <= " ")
	call ErrorHandler2(c_error_handler, "F", "Validate", "Invalid ResponsiblePersonnelId.",
	"9999",build("Invalid ResponsiblePersonnelId."), order_reply_out)
	go to exit_script
endif
 
; Validate MedicationOrderBasis
if(iMedicationOrderBasis < 0 or iMedicationOrderBasis > 5)
	call ErrorHandler2(c_error_handler, "F", "Validate", "Invalid MedicationOrderBasis",
	"9999",build("Invalid MedicationOrderBasis"), order_reply_out)
	go to exit_script
endif
 
; Validate OrderableCodeId and gather details
set iRet = GetOrderableDetails(null)
if(iRet = 0)
	call ErrorHandler2(c_error_handler, "F", "Validate", "Invalid OrderableCode",
	"2056",build("Invalid OrderableCode"), order_reply_out)
	go to exit_script
endif
 
; Get OE Format Details - 560000 - ORM.FmtQuery
set iRet = GetOrderFormatDetails(null)
if(iRet = 0)
	call ErrorHandler2(c_error_handler, "F", "Execute", "Could not retrieve order entry format details (560000).",
	"9999","Could not retrieve order entry format details (560000).", order_reply_out)
	go to exit_script
endif
 
; Get Next OrderId - 500698 - orm_get_next_sequence
set iRet = GetOrderSeq(null)
if(iRet = 0)
	call ErrorHandler2(c_error_handler, "F", "Execute", "Could not retrieve OrderId (500698).",
	"9999","Could not retrieve OrderId (500698).", order_reply_out)
	go to exit_script
endif
 
; Post Proposed Order - 560221 - OAR.AddProposal
call PostProposedOrder(null)
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(order_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
	call echorecord(order_reply_out)
	call echo(JSONout)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_post_proposed_orders.json")
	call echo(build2("_file : ", _file))
	call echojson(order_reply_out, _file, 0)
endif
 
#EXIT_VERSION
/*************************************************************************
; SUBROUTINES
**************************************************************************/
 
/*************************************************************************
;  Name: GetOrderableDetails(null) = i2
;  Description: Get the details for the OrderableCodeId provided
**************************************************************************/
subroutine GetOrderableDetails(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetOrderableDetails Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iValidate = 0
 
 	select into "nl:"
 	from order_catalog_synonym ocs
 	where ocs.synonym_id = dOrderableId
 		and ocs.active_ind = 1
 	detail
 		iValidate = 1
 
 		dOeFormatId = ocs.oe_format_id
 		dCatalogCd = ocs.catalog_cd
 		sOrderMnemonic = ocs.mnemonic
 		dActivityTypeCd = ocs.activity_type_cd
 	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetOrderableDetails Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return (iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetOrderFormatDetails(null) = i2
;  Description: Get OE Format Details - 560000 - ORM.FmtQuery
**************************************************************************/
subroutine GetOrderFormatDetails(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetOrderFormatDetails Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	declare date = vc
	declare zero_test = vc
	declare newTime = vc
	declare real_test = i4
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 500196
	set iRequest = 560000
 
 
	;Get Encounter location
	select into "nl:"
	from encounter e
	where e.encntr_id = dEncounterId
	detail
		dEncounterLocCd = e.location_cd
	with nocounter
 
	;Setup request
	set 560000_req->oeFormatId = dOeFormatId
	set 560000_req->actionTypeCd = c_order_action_type_cd
	set 560000_req->positionCd = dPositionCd
	set 560000_req->ordLocationCd = 0
	set 560000_req->patLocationCd = dEncounterLocCd
	set 560000_req->applicationCd = c_powerchart_application_cd
	set 560000_req->encntrTypeCd = dEncntrTypeCd
	set 560000_req->includePromptInd = 1
	set 560000_req->catalogCd = dCatalogCd
	set 560000_req->origOrdAsFlag = iMedicationOrderBasis
 
 	;Execute request
 	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",560000_req,"REC",560000_rep)
 
 	if(560000_rep->status_data.status = "S")
 		set iValidate = 1
 		set fldSize = size(560000_rep->fieldList,5)
 		if(fldSize > 0)
 			for(i = 1 to fldSize)
 				set check = 0
 				set iSeq = 0
 
 				select into "nl:"
 				from (dummyt d with seq = size(oe_fields->qual,5))
 				plan d where oe_fields->qual[d.seq].oe_field_id = 560000_rep->fieldList[i].oeFieldId
 				detail
 					check = 1
 					iSeq = d.seq
 				with nocounter
 
 				if(check = 0)
 					if(560000_rep->fieldList[i].acceptFlag = 0)
		 				call ErrorHandler2(c_error_handler, "F", "Validate",
						build2("Missing required order details - FieldId: ",560000_rep->fieldList[i].oeFieldId),
						"9999",build2("Missing required order details - FieldId: ",560000_rep->fieldList[i].oeFieldId),
						order_reply_out)
						go to exit_script
					endif
 				else
 					set oe_fields->qual[iSeq].oe_field_meaning_id = 560000_rep->fieldList[i].oeFieldMeaningId
 					set oe_fields->qual[iSeq].oe_field_meaning = 560000_rep->fieldList[i].oeFieldMeaning
 					set oe_fields->qual[iSeq].default_value = 560000_rep->fieldList[i].defaultValue
 
 					case(560000_rep->fieldList[i].fieldTypeFlag)
						of 0: 	;ALPHANUMERIC
							if(size(trim(oe_fields->qual[iSeq].response,3)) <= 560000_rep->fieldList[i].accept_size)
								set oe_fields->qual[iSeq].oe_field_display_value = trim(oe_fields->qual[i].response,3)
							else
								set oe_fields->qual[iSeq].oe_field_display_value =
								substring(1,560000_rep->fieldList[i].accept_size,trim(oe_fields->qual[iSeq].response,3))
							endif
						of 1:	;INTEGER
							set oe_fields->qual[iSeq].oe_field_value = cnvtint(oe_fields->qual[iSeq].response)
							set oe_fields->qual[iSeq].oe_field_display_value = trim(oe_fields->qual[iSeq].response,3)
						of 2:	;DECIMIAL
							set oe_fields->qual[iSeq].oe_field_value = cnvtreal(oe_fields->qual[iSeq].response)
							set oe_fields->qual[iSeq].oe_field_display_value = trim(oe_fields->qual[iSeq].response,3)
						of 3:	;DATE
							set date = trim(replace(oe_fields->qual[iSeq].response,"/",""),3)
							if(cnvtdate(date))
								if(UTC)
									set oe_fields->qual[iSeq].oe_field_dt_tm_value = cnvtdatetimeUTC(cnvtdatetime(cnvtdate(date),curtime3))
								else
									set oe_fields->qual[iSeq].oe_field_dt_tm_value = cnvtdatetime(cnvtdate(date),curtime3)
								endif
							else
								call ErrorHandler2(c_error_handler, "F", "Validate",build2(oe_fields->qual[iSeq].oe_field_id,
								" field id is a date field and requires a format of MM/DD/YY, MM/DD/YYYY, MMDDYY or MMDDYYYY"),"9999",
								build2(oe_fields->qual[iSeq].oe_field_id,
								" field id is a date field and requires a format of MM/DD/YY, MM/DD/YYYY, MMDDYY or MMDDYYYY"),
								order_reply_out)
								go to EXIT_SCRIPT
							endif
						of 5:	;DATE/TIME
							set checkSpace = findstring(" ",oe_fields->qual[iSeq].response)
							set date = substring(1,checkSpace,oe_fields->qual[iSeq].response)
							set date = trim(replace(date,"/",""),3)
							set time = trim(substring(checkSpace + 1,textlen(oe_fields->qual[iSeq].response),oe_fields->qual[iSeq].response),3)
							set time = trim(replace(time,":",""),3)
							set dateCheck = cnvtdate(date)
 
							; Validate Time
							set zero_test = trim(replace(replace(origTime,".",""),"0",""),3)
							set newTime = trim(replace(origTime,":",""),3)
							set real_test = cnvtreal(newTime)
 
							if(zero_test = "" or (zero_test != "" and real_test != 0.00 ))
								if(textlen(newTime) = 4 and real_test >= 0 and real_test < 2400)
									set timeCheck = 1
								endif
							endif
 
							if(dateCheck > 0 and timeCheck > 0)
								if(UTC)
									set oe_fields->qual[iSeq].oe_field_dt_tm_value = cnvtdatetimeUTC(cnvtdatetime(cnvtdate(date),cnvtint(time)))
								else
									set oe_fields->qual[iSeq].oe_field_dt_tm_value = cnvtdatetime(cnvtdate(date),cnvtint(time))
								endif
							else
								call ErrorHandler2(c_error_handler, "F", "Validate",
								build2(oe_fields->qual[iSeq].oe_field_id," field id is a datetime field and requires a format of 'MM/DD/YY HHMM', ",
								" 'MM/DD/YYYY HHMM', 'MMDDYY HHMM' or 'MMDDYYYY HHMM'"),
								"9999", build2(oe_fields->qual[iSeq].oe_field_id," field id is a datetime field and requires a format of 'MM/DD/YY HHMM', ",
								" 'MM/DD/YYYY HHMM', 'MMDDYY HHMM' or 'MMDDYYYY HHMM'"),
								order_reply_out)
								go to EXIT_SCRIPT
							endif
						of 6:	;CODESET
							set iRet = GetCodeSet(cnvtreal(oe_fields->qual[iSeq].response))
							if(iRet != 560000_rep->fieldList[i].codeset)
								call ErrorHandler2(c_error_handler, "F", "Validate","Invalid codeset response.",
								"9999","Invalid codeset response.", order_reply_out)
								go to exit_script
							else
								set oe_fields->qual[iSeq].oe_field_value = cnvtreal(oe_fields->qual[iSeq].response)
								set oe_fields->qual[iSeq].oe_field_display_value =
									uar_get_code_display(oe_fields->qual[iSeq].oe_field_value)
							endif
						of 7:	;YES/NO
							if(cnvtlower(trim(oe_fields->qual[iSeq].response,3)) = "yes")
								set oe_fields->qual[iSeq].oe_field_value = 1
								set oe_fields->qual[iSeq].oe_field_display_value = "Yes"
							elseif(cnvtlower(trim(oe_fields->qual[iSeq].response,3)) = "no")
								set oe_fields->qual[iSeq].oe_field_value = 0
								set oe_fields->qual[iSeq].oe_field_display_value = "No"
							else
								call ErrorHandler2(c_error_handler, "F", "Validate","Invalid yes/no response.",
								"9999","Invalid yes/no response.", order_reply_out)
								go to exit_script
							endif
						of 8:	;PROVIDER
							set oe_fields->qual[iSeq].oe_field_value = cnvtreal(oe_fields->qual[iSeq].response)
							set oe_fields->qual[iSeq].oe_field_display_value = GetNameFromPrsnID(oe_fields->qual[iSeq].oe_field_value)
						of 9:	;LOCATION
							set oe_fields->qual[iSeq].oe_field_value = cnvtreal(oe_fields->qual[iSeq].response)
							set oe_fields->qual[iSeq].oe_field_display_value =
									uar_get_code_display(oe_fields->qual[iSeq].oe_field_value)
							set iRet = GetCodeSet(oe_fields->qual[iSeq].oe_field_value)
							if(iRet != 220)
								call ErrorHandler2(c_error_handler, "F", "Validate","Invalid location response.",
								"9999","Invalid location response.", order_reply_out)
								go to exit_script
							endif
						of 10:	;ICD9
							select into "nl:"
							from nomenclature n
							where n.nomenclature_id = cnvtreal(oe_fields->qual[iSeq].response)
								and n.principle_type_cd = value(uar_get_code_by("MEANING",401,"DIAG"))
							detail
								oe_fields->qual[iSeq].oe_field_value = n.nomenclature_id
								oe_fields->qual[iSeq].oe_field_display_value = n.source_string
							with nocounter
							if(curqual = 0)
								call ErrorHandler2(c_error_handler, "F", "Validate","Invalid DiagnosisId.",
								"9999","Invalid DiagnosisId.", order_reply_out)
								go to exit_script
							endif
						of 11:	;PRINTER
							set oe_fields->qual[iSeq].oe_field_value = cnvtreal(oe_fields->qual[iSeq].response)
						of 12:	;LIST
							if(560000_rep->fieldList[i].codeset = 0)
								set oe_fields->qual[iSeq].oe_field_display_value = trim(oe_fields->qual[iSeq].response,3)
							else
								set iRet = GetCodeSet(cnvtreal(oe_fields->qual[iSeq].response))
								if(iRet != 560000_rep->fieldList[i].codeset)
									call ErrorHandler2(c_error_handler, "F", "Validate","Invalid list response.",
									"9999","Invalid list response.", order_reply_out)
									go to exit_script
								else
									set oe_fields->qual[iSeq].oe_field_value = cnvtreal(oe_fields->qual[iSeq].response)
									set oe_fields->qual[iSeq].oe_field_display_value =
										uar_get_code_display(oe_fields->qual[iSeq].oe_field_value)
								endif
							endif
						of 13:	;USER/PERSONNEL
							set oe_fields->qual[iSeq].oe_field_value = cnvtreal(oe_fields->qual[iSeq].response)
							set oe_fields->qual[iSeq].oe_field_display_value = GetNameFromPrsnID(oe_fields->qual[iSeq].oe_field_value)
						of 14:	;ACCESSION
							if(size(trim(oe_fields->qual[iSeq].response,3)) <= oe_fields->qual[iSeq].accept_size)
								set oe_fields->qual[iSeq].oe_field_display_value = trim(oe_fields->qual[iSeq].response,3)
							else
								set oe_fields->qual[iSeq].oe_field_display_value =
								substring(1,oe_fields->qual[iSeq].accept_size,trim(oe_fields->qual[iSeq].response,3))
							endif
						of 15:	;SURGICAL DURATION
							set oe_fields->qual[iSeq].oe_field_value = cnvtint(oe_fields->qual[iSeq].response)
							set oe_fields->qual[iSeq].oe_field_display_value = trim(oe_fields->qual[iSeq].response,3)
					endcase
				endif
 			endfor
 		endif
 	endif
 
 	;Check for extra fields that don't correspond with order format
 	declare oeStr = vc
 	set oeStr = ""
 	set check = 0
 	select into "nl:"
 	from (dummyt d with seq = size(oe_fields->qual,5))
 	plan d where oe_fields->qual[d.seq].oe_field_meaning_id = 0
 	detail
 		check = 1
 		oeStr = build(oeStr," ",cnvtstring(oe_fields->qual[d.seq].oe_field_id))
 	with nocounter
 
 	if(check)
 		call ErrorHandler2(c_error_handler, "F", "Validate",build2("Invalid FieldId(s): ",oeStr),
		"9999",build2("Invalid FieldId(s): ",oeStr),order_reply_out)
		go to exit_script
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetOrderFormatDetails Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return (iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetOrderSeq(null) = i2
;  Description: Get Next OrderId - 500698 - orm_get_next_sequence
**************************************************************************/
subroutine GetOrderSeq(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetOrderSeq Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 500195
	set iRequest = 500698
 
 	;Setup request
 	set 500698_req->seq_name = "order_seq"
 	set 500698_req->number = 1
 
 	;Execute request
 	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",500698_req,"REC",500698_rep)
 
 	if(500698_rep->status_data.status = "S")
 		set iValidate = 1
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetOrderSeq Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return (iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: PostProposedOrder(null) = null
;  Description: Post Proposed Order - 560221 - OAR.AddProposal
**************************************************************************/
subroutine PostProposedOrder(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostProposedOrder Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iApplication = 600005
	set iTask = 500196
	set iRequest = 560221
 
 	;Setup request
 	set stat = alterlist(560221_req->newOrderList,1)
 	set 560221_req->newOrderList[1].synonymId = dOrderableId
 	set 560221_req->newOrderList[1].personId = dPatientId
 	set 560221_req->newOrderList[1].encounterId = dEncounterId
 	set 560221_req->newOrderList[1].originatingEncounterId = dEncounterId
 	set 560221_req->newOrderList[1].proposalSourceTypeCd = c_order_proposal_source_type_cd
 	set 560221_req->newOrderList[1].responsiblePrsnlId = dResponsiblePrsnlId
 	set 560221_req->newOrderList[1].projectedOrderId = 500698_rep->qual[1].seq_value
 	set 560221_req->newOrderList[1].orderedAsMnemonic = sOrderMnemonic
 	set 560221_req->newOrderList[1].communicationTypeCd = 0
 	set 560221_req->newOrderList[1].origOrdAsFlag = iMedicationOrderBasis
 	if(uar_get_code_meaning(dActivityTypeCd) = "PHARMACY")
 		set 560221_req->newOrderList[1].medOrderTypeCd = c_med_med_order_type_cd
 
 		;SubComponentList
 		set stat = alterlist(560221_req->newOrderList[1].subComponentList,1)
 		set 560221_req->newOrderList[1].subComponentList[1].scSynonymId = dOrderableId
 		set 560221_req->newOrderList[1].subComponentList[1].scOrderedAsMnemonic = sOrderMnemonic
 		set 560221_req->newOrderList[1].subComponentList[1].scIngredientTypeFlag = 1
 		set 560221_req->newOrderList[1].subComponentList[1].scClinicallySignificantFlag = 2
 	endif
 
 	;Details
 	set oeSize = size(oe_fields->qual,5)
 	set stat = alterlist(560221_req->newOrderList[1].detailList,oeSize)
 	for(i = 1 to oeSize)
 		set 560221_req->newOrderList[1].detailList[i].oeFieldId = oe_fields->qual[i].oe_field_id
 		set 560221_req->newOrderList[1].detailList[i].oeFieldValue = oe_fields->qual[i].oe_field_value
 		set 560221_req->newOrderList[1].detailList[i].oeFieldDisplayValue = oe_fields->qual[i].oe_field_display_value
 		set 560221_req->newOrderList[1].detailList[i].oeFieldDtTmValue = oe_fields->qual[i].oe_field_dttm_value
 		set 560221_req->newOrderList[1].detailList[i].oeFieldMeaning = oe_fields->qual[i].oe_field_meaning
 		set 560221_req->newOrderList[1].detailList[i].oeFieldMeaningId = oe_fields->qual[i].oe_field_meaning_id
 		set 560221_req->newOrderList[1].detailList[i].detailDefaultValue = oe_fields->qual[i].default_value
 
 		case(560221_req->newOrderList[1].detailList[i].oeFieldMeaning)
 			of "STRENGTHDOSE":
 				set 560221_req->newOrderList[1].subComponentList[1].scStrengthDose = oe_fields->qual[i].oe_field_value
 				set 560221_req->newOrderList[1].subComponentList[1].scStrengthDoseDisp = oe_fields->qual[i].oe_field_display_value
 			of "STRENGTHDOSEUNIT":
 				set 560221_req->newOrderList[1].subComponentList[1].scStrengthUnit = oe_fields->qual[i].oe_field_value
 				set 560221_req->newOrderList[1].subComponentList[1].scStrengthUnitDisp = oe_fields->qual[i].oe_field_display_value
 			of "VOLUMEDOSE":
 				set 560221_req->newOrderList[1].subComponentList[1].scVolumeDose = oe_fields->qual[i].oe_field_value
 				set 560221_req->newOrderList[1].subComponentList[1].scVolumeDoseDisp = oe_fields->qual[i].oe_field_display_value
 			of "VOLUMEDOSEUNIT":
 				set 560221_req->newOrderList[1].subComponentList[1].scVolumeUnit = oe_fields->qual[i].oe_field_value
 				set 560221_req->newOrderList[1].subComponentList[1].scVolumeUnitDisp = oe_fields->qual[i].oe_field_display_value
 			of "FREETXTDOSE":
 				set 560221_req->newOrderList[1].subComponentList[1].scFreetextDose = oe_fields->qual[i].oe_field_display_value
 		endcase
 	endfor
 
 	; Execute Request
 	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",560221_req,"REC",560221_rep)
 
 	if(560221_rep->transactionStatus = "S")
 		set order_reply_out->proposed_order_id = 560221_rep->newOrderList[1].projectedOrderId
 
 		; Set audit to a successful status
		call ErrorHandler2(c_error_handler, "S", "Success", "Proposed order created successfully.",
		"0000","Proposed order created successfully.", order_reply_out)
 	else
 
 		; Set audit to a failed status
 		call ErrorHandler2(c_error_handler, "F","Execute",build2("Failed to create proposed order: ",
 		560221_rep->newOrderList[1].statusData.debugErrorStr),"9999",
 		build2("Failed to create proposed order: ",560221_rep->newOrderList[1].statusData.debugErrorStr),order_reply_out)
		go to exit_script
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("PostProposedOrder Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
end go
set trace notranslatelock go
 
