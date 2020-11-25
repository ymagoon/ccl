/*********************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

*********************************************************************
   Date Written:       05/20/19
          Source file name:   snsro_post_medadmin_adh.prg
          Object name:        vigilanz_post_medadmin_adh
          Request #:
          Program purpose:
          Executing from:     EMISSARY SERVICES
          Special Notes:	  NONE
***********************************************************************
                   GENERATED MODIFICATION CONTROL LOG
***********************************************************************
 Mod Date     Engineer	Comment
----------------------------------------------------------------------
 000 05/20/19 STV		Initial write
 001 09/09/19 RJC       Renamed file and object
***********************************************************************/
;drop program snsro_post_adhoc_medadmin go
drop program vigilanz_post_medadmin_adh go
create program vigilanz_post_medadmin_adh
 
/**************************************************************
* SCRIPT INPUT PARAMETERS
**************************************************************/
prompt
	"Output to File/Printer/MINE" = ""
	, "Username" = ""
	, "ENCNTRID" = ""
	, "MEDICATIONID" = ""
	, "MEDICATIONITEMID" = ""
	, "COMMUNICATIONTYPE" = ""
	, "ORDERINGPROVIDERID" = ""
	, "WITNESSID" = ""
	, "DOSE" = ""
	, "DOSEUNIT" = ""
	, "VOLUME" = ""
	, "VOLUMEUNIT" = ""
	, "ADMINROUTE" = ""
	, "ADMINSITE" = ""
	, "DOCUMENTDATETIME" = ""
	, "COMMENTS" = ""
	, "DEBUG" = 0
 
with OUTDEV, USERNAME, ENCNTRID, MEDICATIONID, MEDICATIONITEMID,
	COMMUNICATIONTYPE, ORDERINGPROVIDERID, WITNESSID, DOSE, DOSEUNIT, VOLUME, VOLUMEUNIT,
	ADMINROUTE, ADMINSITE, DOCUMENTDATETIME, COMMENTS, DEBUG
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2" ;002
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common

/**************************************************************************************************
* Request Structure for 390401 -- rx_get_product search to validate item_id would show up in search
****************************************************************************************************/
free record 390401_req
record 390401_req (
  1 search_string = vc
  1 item_id_ind = i2
  1 item_id = f8
  1 ident_qual [*]
    2 identifier_type_cd = f8
  1 other_identifier_cd = f8
  1 med_type_qual [*]
    2 med_type_flag = i2
  1 med_filter_ind = i2
  1 intermittent_filter_ind = i2
  1 continuous_filter_ind = i2
  1 tpn_filter_ind = i2
  1 fac_qual [*]
    2 facility_cd = f8
  1 disp_loc_cd = f8
  1 show_all_ind = i2
  1 formulary_status_cd = f8
  1 set_items_ind = i2
  1 set_med_type_qual [*]
    2 set_med_type_flag = i2
  1 active_ind = i2
  1 pharmacy_type_cd = f8
  1 prev_item_id = f8
  1 max_rec = i4
  1 full_search_string = vc
  1 item_qual [*]
    2 item_id = f8
    2 med_product_id = f8
  1 exclude_fac_flex_ind = i2
  1 qoh_loc1_cd = f8
  1 qoh_loc2_cd = f8
  1 stock_pkg_for_qoh_ind = i2
  1 inv_track_level_ind = i2
)

free record 390401_rep
record 390401_rep (
    1 items [* ]
      2 item_id = f8
      2 active_ind = i2
      2 manf_item_id = f8
      2 med_type_flag = i2
      2 med_filter_ind = i2
      2 intermittent_filter_ind = i2
      2 continuous_filter_ind = i2
      2 tpn_filter_ind = i2
      2 oe_format_flag = i2
      2 dispense_category_cd = f8
      2 formulary_status_cd = f8
      2 formulary_status = vc
      2 ndc = vc
      2 mnemonic = vc
      2 generic_name = vc
      2 description = vc
      2 brand_name = vc
      2 charge_number = vc
      2 other_identifier = vc
      2 strength_form = vc
      2 form_cd = f8
      2 form = vc
      2 strength = f8
      2 strength_unit_cd = f8
      2 strength_unit = vc
      2 volume = f8
      2 volume_unit_cd = f8
      2 volume_unit = vc
      2 primary_ind = i2
      2 brand_ind = i2
      2 divisble_ind = i2
      2 price_sched_id = f8
      2 dispense_qty = f8
      2 dispense_qty_unit_cd = f8
      2 manufacturer = vc
      2 facs [* ]
        3 facility_cd = f8
        3 facility = vc
      2 med_product_id = f8
      2 inner_ndc = vc
      2 qoh_exists_ind_loc1 = i2
      2 qoh_loc1 = f8
      2 qoh_loc1_unit = vc
      2 qoh_exists_ind_loc2 = i2
      2 qoh_loc2 = f8
      2 qoh_loc2_unit = vc
    1 elapsed_time = f8
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
)
/*******************************************************************
* 003 Request structure for 360005 (LockPatientProfile)
*******************************************************************/
free record 360005_req
record 360005_req (
	1 patientId = f8
	1 entityId = f8
	1 entityName = vc
	1 expireMinutes = i2
	1 lockingApplication = vc
)
 
free record 360005_rep
record 360005_rep (
  1 success = i2
  1 lockPrsnlId = f8
  1 lockAquireDtTm = dq8
  1 lockExpireDtTm = dq8
  1 lockKeyId = i4
  1 lockingApplication = vc
  1 status_data
    2 status = vc
    2 substatus = i2
    2 subEventStatus [*]
      3 operationname = vc
      3 operationstatus = vc
      3 targetobjectname = vc
      3 targetobjectvalue = vc
)
 
/*******************************************************************
* 003 Request structure for 360009 (UnLockPatientProfile)
*******************************************************************/
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
 
free record query_lock_req
record query_lock_req (
  1 entityList [*]
    2 entityName = vc
  1 lockPrsnlId = f8
)
 
free record query_lock_rep
record query_lock_rep (
  1 entityList [*]
    2 locked = i2
    2 entityId = f8
    2 entityName = vc
    2 lockPrsnlId = f8
    2 lockAquireDtTm = dq8
    2 lockExpireDtTm = dq8
    2 lockKeyId = i4
    2 applCtx = f8
    2 prsnlName = vc
    2 entityDesc = vc
    2 userName = vc
  1 status_data
    2 status = vc
    2 substatus = i2
    2 subEventStatus [*]
      3 operationname = vc
      3 operationstatus = vc
      3 targetobjectname = vc
      3 targetobjectvalue = vc
)
 
/*******************************************************************
* Request Structure for 500698 -- orm_get_next_sequence
*******************************************************************/
free record 500698_req
record 500698_req (
  1 seq_name = vc
  1 number = i2
)
 
free record 500698_rep
record 500698_rep (
   1 qual [*]
     2 seq_value = f8
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
 )
 
 
/*******************************************************************
* Request Structure for 560271 -- OAR.ProcessNewAdministrationSynch
*******************************************************************/
free record 560271_req
record 560271_req (
  1 adminEventList [*]
    2 catalogCd = f8
    2 synonymId = f8
    2 personId = f8
    2 encntrId = f8
    2 medOrderTypeCd = f8
    2 ingredientList [*]
      3 catalogCd = f8
      3 synonymId = f8
      3 strength = f8
      3 strengthUnit = f8
      3 volume = f8
      3 volumeUnit = f8
      3 ingredientTypeFlag = i2
      3 productList [*]
        4 itemId = f8
        4 manfItemId = f8
        4 barcodeScanDetails
          5 medAdminBarcode = vc
          5 barcodeSourceCd = f8
          5 scanQuantity = f8
          5 dispenseHistoryId = f8
          5 medProductId = f8
      3 orderedAsMnemonic = vc
      3 clinicallySignificantFlag = i2
      3 includeInTotalVolumeFlag = i2
    2 routeCd = f8
    2 frequencyCd = f8
    2 orderProviderId = f8
    2 orderDtTm = dq8
    2 adminPrsnlId = f8
    2 witnessPrsnlId = f8
    2 endAdminDtTm = dq8
    2 systemEntryDtTm = dq8
    2 drugFormCd = f8
    2 communicationTypeCd = f8
    2 dispenseFromLoc = f8
    2 infuseOver = f8
    2 infuseOverUnit = f8
    2 notes = vc
    2 adminSiteCd = f8
    2 intakeList [*]
      3 volumeInML = f8
      3 intakeBeginDtTm = dq8
      3 intakeEndDtTm = dq8
      3 confirmedInd = i2
    2 orderId = f8
    2 infuseEndDtTm = dq8
    2 infuseVolumeInML = f8
    2 orderComment = vc
    2 chargingInfo [*]
      3 chargeOnAdminInd = i2
)
 
free record 560271_rep
record 560271_rep (
  1 adminEventList [*]
    2 status = c1
    2 errorString = vc
    2 orderId = f8
    2 taskId = f8
    2 eventId = f8
    2 externalServicesCalledInfo [*]
      3 chargeOnAdminCalledInd = i2
)
 
 
; Final reply
free record adhoc_medadmin_reply_out
record adhoc_medadmin_reply_out(
  1 order_id      	= f8
  1 task_id = f8
  1 admin_id = f8
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
 
/**************************************************************
; DECLARE and SET VARIABLES
**************************************************************/
declare JSONout 				= vc with protect, noconstant("")
declare sFileName 				= vc with protect, noconstant("")
declare sUserName               = vc with protect, noconstant("")
declare dPatientId  			= f8 with protect, noconstant(0.0)
declare dEncntrId           	= f8 with protect, noconstant(0.0)
declare dMedicationId			= f8 with protect, noconstant(0.0)
declare dMedicationItemId       = f8 with protect, noconstant(0.0)
declare dCommType			    = f8 with protect, noconstant(0.0)
declare dProviderId				= f8 with protect, noconstant(0.0)
declare dWitnessId              = f8 with protect, noconstant(0.0)
declare dDose                   = f8 with protect, noconstant(0.0)
declare dDoseUnit               = f8 with protect, noconstant(0.0)
declare dVolume					= f8 with protect, noconstant(0.0)
declare dVolumeUnit				= f8 with protect, noconstant(0.0)
declare dAdminRoute				= f8 with protect, noconstant(0.0)
declare dAdminSite              = f8 with protect, noconstant(0.0)
declare qDocumentedDateTime		= dq8
declare sComments			    = vc with protect, noconstant("")
declare iDebugFlag              = i2
 
declare dFacilityCd             = f8
declare dCatalogCd				= f8 with protect, noconstant(0.0)
declare dFormCd                 = f8
declare dFrequencyCd            = f8 with protect, constant(uar_get_code_by("MEANING",4003,"ONETIME"))
declare dMedOrderTypeCd			= f8 with protect, constant(uar_get_code_by("MEANING",18309,"MED"))
declare dPharmTypeCd			= f8 with protect, constant(uar_get_code_by("MEANING",106,"PHARMACY"))
declare dPrimMnemonicCd			= f8 with protect, constant(uar_get_code_by("MEANING",6011,"PRIMARY"))
declare dPharmCatTypeCd			= f8 with protect, constant(uar_get_code_by("MEANING",6000,"PHARMACY"))
declare dOrderActionTypeCd		= f8 with protect, constant(uar_get_code_by("MEANING",6003,"ORDER"))
declare dInpatientPharmCd       = f8 with protect, constant(uar_get_code_by("MEANING",4500,"INPATIENT"))
declare dBrandNameCd            = f8 with protect, constant(uar_get_code_by("MEANING",11000,"BRAND_NAME"))
declare dCdmCd            		= f8 with protect, constant(uar_get_code_by("MEANING",11000,"CDM"))
declare dDescCd                 = f8 with protect, constant(uar_get_code_by("MEANING",11000,"DESC"))
declare dGenericNameCd          = f8 with protect, constant(uar_get_code_by("MEANING",11000,"GENERIC_NAME"))
declare dNdcCd           		= f8 with protect, constant(uar_get_code_by("MEANING",11000,"NDC"))
declare dDescShortCd            = f8 with protect, constant(uar_get_code_by("MEANING",11000,"DESC_SHORT"))
declare dCatalogSynCd			= f8 with protect, noconstant(0.0)
declare sOrderedAsMnem			= vc with protect, noconstant("")
declare dOrderEntryFormat		= f8 with protect, noconstant(0.0)
declare dOrderId				= f8 with protect, noconstant(0.0)
declare doseRequired            = i2
declare volumeRequired            = i2
 
 
set sUserName                   = trim($USERNAME,3)
set dEncntrID    				= cnvtreal($ENCNTRID)
set dMedicationId				= cnvtreal($MEDICATIONID)
set dMedicationItemId           = cnvtreal($MEDICATIONITEMID)
set dCommType 					= cnvtreal($COMMUNICATIONTYPE)
set dProviderId					= cnvtreal($ORDERINGPROVIDERID)
set dWitnessId                  = cnvtreal($WITNESSID)
set dDose                       = cnvtreal($DOSE)
set dDoseUnit                   = cnvtreal($DOSEUNIT)
set dVolume                     = cnvtreal($VOLUME)
set dVolumeUnit                 = cnvtreal($VOLUMEUNIT)
set dAdminRoute                 = cnvtreal($ADMINROUTE)
set dAdminSite                  = cnvtreal($ADMINSITE)
set sComments                   = trim($COMMENTS)
set iDebugFlag					= cnvtint($DEBUG)
;setting the DocumentTime
if(size($DOCUMENTDATETIME) > 0)
	set qDocumentedDateTime = GetDateTime($DOCUMENTDATETIME)
else
	set qDocumentedDateTime = cnvtdatetime(curdate,curtime3)
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ValidateParams(null)		= null with protect
declare ValidateItemId(null)        = null with protect
declare LockPatientProfile(null)	= null with protect
declare UnLockPatientProfile(null)	= null with protect
declare GetNewOrderId (null)        = null with protect
declare PostAdhocAdmin(null)        = null with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Validate username
set iRet = PopulateAudit(sUserName, dPatientId, adhoc_medadmin_reply_out, sVersion)
if(iRet = 0)
  call ErrorHandler2("VALIDATE", "F", "User is invalid", "Invalid User for Audit.",
  "1001",build2("Invalid user: ",sUserName), adhoc_medadmin_reply_out)
  go to exit_script
endif
 
;validating parameters
call ValidateParams(null)

;validating ItemId would be found in search UI
call ValidateItemId(null) 
 
;locking the patient for posting
call LockPatientProfile(null)
 
;Getting the new orderID sequence for posting
call GetNewOrderId (null)
 
;posting the adhocMed admin
call PostAdhocAdmin(null)
 
;unlocking the patient
call  UnLockPatientProfile(null)
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
#EXIT_SCRIPT
 
;setting debug echo
if(iDebugFlag > 0)
	call echo(build2("sUserName ->" ,sUserName))
	call echo(build2("dPatientId ->",dPatientId ))
	call echo(build2("dEncntrId ->",dEncntrId))
	call echo(build2("dMedicationId ->",dMedicationId))
	call echo(build2("dMedicationItemId ->",dMedicationItemId))
	call echo(build2("dCommType ->",dCommType))
	call echo(build2("dProviderId ->",dProviderId))
	call echo(build2("dWitnessId ->",dWitnessId))
	call echo(build2("dDose ->", dDose))
	call echo(build2("dDoseUnit ->", dDoseUnit))
	call echo(build2("dVolume ->", dVolume))
	call echo(build2("dVolumeUnit ->",dVolumeUnit))
	call echo(build2("dAdminRoute ->",dAdminRoute))
	call echo(build2("dAdminSite ->",dAdminSite))
 	call echo(build2("qDocumentedDateTime ->",qDocumentedDateTime))
 	call echo(build2("sComments ->",sComments))
endif
 
set file_path = logical("ccluserdir")
set _file = build2(trim(file_path),"/snsro_post_adhoc_medadmin.json")
call echo(build2("_file : ", _file))
call echojson(adhoc_medadmin_reply_out, _file, 0)
 
set JSONout = CNVTRECTOJSON(adhoc_medadmin_reply_out)
call echo(JSONout)
 
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
#EXIT_VERSION
/*************************************************************************
; SUBROUTINES
**************************************************************************/
 
/*************************************************************
* Subroutine: ValidateParams (null)
* Purpose: 	Evaluate all request parameters to ensure they are
* 			valid and effective before calling order server.
**************************************************************/
subroutine ValidateParams(null)
 
if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateParams Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
    declare iValid = i2
/********************************
****** Validate Encounter *******
********************************/
if(dEncntrId > 0)
 
	select into "nl:"
	from encounter e
	plan e
	where e.encntr_id = dEncntrId
		and e.active_ind = 1
	head report
	    iValid = 1
		dPatientId = e.person_id
		dFacilityCd = e.loc_facility_cd
	with nocounter
 
	if(iValid < 1)
		call ErrorHandler2("VALIDATE", "F", "Validate","EncounterId is not Valid",
			"9999", "EncounterId is not Valid", adhoc_medadmin_reply_out)
			go to exit_script
	endif
else
	call ErrorHandler2("VALIDATE", "F", "Validate","EncounterId is Required",
			"9999", "EncounterId is Required", adhoc_medadmin_reply_out)
			go to exit_script
endif
 
/*******************************************************
****** Validate MedicationId and MedidicationItemId ******
*********************************************************/
set iValid = 0
if(dMedicationId > 0)
	select into "nl:"
	from order_catalog_synonym ocs
		 ,synonym_item_r sir
	plan ocs
		where ocs.synonym_id =  dMedicationId
			and ocs.activity_type_cd = dPharmTypeCd
			and ocs.catalog_type_cd = dPharmCatTypeCd
			and ocs.active_ind = 1
	join sir
		where sir.synonym_id = ocs.synonym_id;this join validates that the synonym and item_id are linked
			and sir.item_id = dMedicationItemId
	head report
		iValid = 1
		dCatalogCd = ocs.catalog_cd
	with nocounter
 
	if(iValid < 0)
		call ErrorHandler2("VALIDATE", "F", "Validate","MedicationId is not Valid",
			"9999", "MediciationId is not Valid", adhoc_medadmin_reply_out)
			go to exit_script
	else
		;validating the MedicationItem Id
		if(dMedicationItemId > 0)
			set iValid = 0
			select into "nl:"
			from medication_definition md
			plan md
				where md.item_id = dMedicationItemId
			head report
				iValid = 1
				dFormCd = md.form_cd
				if(md.strength > 0)
					doseRequired = 1
				endif
				if(md.volume > 0)
					volumeRequired = 1
				endif
 
			with nocounter
 
			if(iValid < 1)
				call ErrorHandler2("VALIDATE", "F", "Validate","MedicationItemId is not Valid",
					"9999", "MediciationItemId is not Valid", adhoc_medadmin_reply_out)
					go to exit_script
			endif
		else
			call ErrorHandler2("VALIDATE", "F", "Validate","MedicationItemId is Required",
			"9999", "MedicationItemId is Required", adhoc_medadmin_reply_out)
			go to exit_script
		endif
 
	endif
else
	call ErrorHandler2("VALIDATE", "F", "Validate","MedicationId is Required",
			"9999", "MedicationId is Required", adhoc_medadmin_reply_out)
			go to exit_script
endif

/*************************************
****** Validate Admin Route Code *****
*************************************/
if(dAdminRoute > 0)
	set iValid = 0
	select into "nl:"
		cv.code_value
	from code_value cv
	plan cv
	where cv.code_set = 4001
		and cv.code_value = dAdminRoute
		and cv.active_ind = 1
	head report
		iValid = 1
	with nocounter
	if(iValid < 1)
		call ErrorHandler2("VALIDATE", "F", "Validate","AdminRoute is not Valid",
					"9999", "AdminRoute is not Valid", adhoc_medadmin_reply_out)
					go to exit_script
	else
		;;;;Checking if AdminSite is required for the entered route
		declare siteNeededInd = i2
		select into "nl:"
		from code_value_extension cve
		     ,code_set_extension cse
		plan cve
			where cve.code_set = 4001
				and cve.code_value = dAdminRoute
				and cve.field_name = "IV_SITE_REQ"
				and cve.field_value = "2"
		join cse
			where cse.code_set = cve.code_set
				and cse.field_name = cve.field_name
		detail
			siteNeededInd = 1
		with nocounter
 
		if(siteNeededInd > 0 and dAdminSite = 0)
			call ErrorHandler2("VALIDATE", "F", "Validate","AdminSite is Required",
					"9999", "AdminSite is Required", adhoc_medadmin_reply_out)
					go to exit_script
		endif
 
	endif
else
	call ErrorHandler2("VALIDATE", "F", "Validate","AdminRoute is Required",
					"9999", "AdminRoute is Required", adhoc_medadmin_reply_out)
					go to exit_script
endif
 
 
 
 
/************************************
*004** Validate Strength and/or volume
*************************************/
 
if(dDose = 0)
	call ErrorHandler2("VALIDATE", "F", "Validate","Dose is Required",
					"9999", "Dose is Required", adhoc_medadmin_reply_out)
					go to exit_script
endif
 
if(dVolume = 0 and volumeRequired > 0)
	call ErrorHandler2("VALIDATE", "F", "Validate","Volume is Required for this admin",
					"9999", "Volume is Required for this admin", adhoc_medadmin_reply_out)
					go to exit_script
endif
 
/*************************************
****** Validate Strength Unit *****
*************************************/
if(dDoseUnit > 0)
	set iValid = 0
	select into "nl:"
		cv.code_value
	from code_value cv
	plan cv
	where cv.code_set = 54
		and cv.code_value = dDoseUnit
		and cv.active_ind = 1
	head report
		iValid = 1
	with nocounter
	if(iValid < 1)
		call ErrorHandler2("VALIDATE", "F", "Validate","DoseUnit is not Valid",
					"9999", "DoseUnit is not Valid", adhoc_medadmin_reply_out)
					go to exit_script
	endif
else
	call ErrorHandler2("VALIDATE", "F", "Validate","DoseUnit is Required",
					"9999", "DoseUnit is Required", adhoc_medadmin_reply_out)
					go to exit_script
endif
 
 
 
/*************************************
*004** Validate Volume Unit *****
*************************************/
if(dVolumeUnit > 0)
	set iValid = 0
	select into "nl:"
	from code_value cv
	plan cv
	where cv.code_set = 54
		and cv.code_value = dVolumeUnit
		and cv.active_ind = 1
	head report
		iValid = 1
	with nocounter
	if(iValid < 1)
		call ErrorHandler2("VALIDATE", "F", "Validate","VolumeUnit is not Valid",
					"9999", "VolumeUnit is not Valid", adhoc_medadmin_reply_out)
					go to exit_script
	endif
endif
 
 
/*************************************
****** Validate Provider Id **********
*************************************/
if(dProviderId > 0)
	set iValid = 0
	select into "nl:"
	from prsnl p
	plan p
	where p.person_id  = dProviderId
		and p.physician_ind = 1
		and p.active_ind = 1
	head report
		iValid = 1
	with nocounter
	if(iValid < 1)
		call ErrorHandler2("VALIDATE", "F", "Validate","ProviderId is not Valid",
					"9999", "Provider is not Valid", adhoc_medadmin_reply_out)
					go to exit_script
	endif
else
	call ErrorHandler2("VALIDATE", "F", "Validate","ProviderId is Required",
					"9999", "Provider is Required", adhoc_medadmin_reply_out)
					go to exit_script
endif
 
/**006********************************
****** Validate Admin Site Code ******
*************************************/
if(dAdminSite > 0)
	set iValid = 0
	select into "nl:"
		cv.code_value
	from code_value cv
	plan cv
	where cv.code_set = 97
		and cv.code_value = dAdminSite
		and cv.active_ind = 1
	head report
		iValid = 1
	with nocounter
	if(iValid < 1)
			call ErrorHandler2("VALIDATE", "F", "Validate","AdminSite is not Valid",
					"9999", "AdminSite is not Valid", adhoc_medadmin_reply_out)
					go to exit_script
	endif
endif
 
;validate WitnessId is a provider
if(dWitnessId > 0)
	set valid_witness = 0
	select into "nl:"
	from prsnl p
	where p.person_id = dWitnessId
		;and p.physician_ind = 1
		and p.active_ind = 1
		and p.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
		and p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
	head report
		valid_witness = 1
	with nocounter
 
	if(valid_witness < 1)
		call ErrorHandler2("VALIDATE", "F", "Validate","WitnessId is not a valid provider",
			"9999", "WitnessId is not a valid provider", adhoc_medadmin_reply_out)
			go to exit_script
	endif
 
endif
 
;validate CommtypeCd
if(dCommType > 0)
	set iValid = 0
	select into "nl:"
	from code_value cv
	where cv.code_value = dCommType
		and cv.code_set = 6006
		and cv.active_ind = 1
	detail
		iValid = 1
	with nocounter
 
	if(iValid < 1)
		call ErrorHandler2("VALIDATE", "F", "Validate","CommunicationTypeId is not Valid",
			"9999", "CommunicationTypeId is not Valid", adhoc_medadmin_reply_out)
			go to exit_script
	endif
 
else
	call ErrorHandler2("VALIDATE", "F", "Validate","CommunicationTypeId is Required",
			"9999", "CommunicationTypeId is Required", adhoc_medadmin_reply_out)
			go to exit_script
endif
 
if(iDebugFlag > 0)
		call echo(concat("ValidateParams Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
endif
 
end;subroutine

/*************************************************************
* Subroutine: ValidateItemId (null)
* Purpose: 	Validates the Entered Item Id would be a valid item
			 found in search UI
**************************************************************/
subroutine ValidateItemId (null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateItemId Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
	
	;setting up request
	set 390401_req->item_id_ind = 1
	set 390401_req->active_ind = 1
	set 390401_req->med_filter_ind = 1
	set 390401_req->pharmacy_type_cd = dInpatientPharmCd
	set 390401_req->max_rec = 100
	set 390401_req->show_all_ind = 1
	set stat = alterlist(390401_req->fac_qual,2)
	set 390401_req->fac_qual[1].facility_cd = 0
	set 390401_req->fac_qual[2].facility_cd = dFacilityCd
	set stat = alterlist(390401_req->ident_qual,6)
	set 390401_req->ident_qual[1].identifier_type_cd = dBrandNameCd 
	set 390401_req->ident_qual[2].identifier_type_cd = dCdmCd
	set 390401_req->ident_qual[3].identifier_type_cd = dDescCd  
	set 390401_req->ident_qual[4].identifier_type_cd = dGenericNameCd
	set 390401_req->ident_qual[5].identifier_type_cd = dNdcCd
	set 390401_req->ident_qual[6].identifier_type_cd = dDescShortCd 
	set stat = alterlist(390401_req->med_type_qual,1)
	set 390401_req->med_type_qual[1].med_type_flag = 0
	set stat = alterlist(390401_req->item_qual,1)
	set 390401_req->item_qual[1].item_id = dMedicationItemId

	;execute request
	set iAPPLICATION = 600005
	set iTASK = 3202004
	set iREQUEST = 390401
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",390401_req,"REC",390401_rep)

	;validating item found
	if(size(390401_rep->items,5) = 0)

		call ErrorHandler2("VALIDATE", "F", "Validate","MedicationItemId not found in UI search job",
			"9999", "MedicationItemId not found in UI search job", adhoc_medadmin_reply_out)
			go to exit_script
	endif
	
	if(iDebugFlag > 0)
		call echo(concat("ValidateItemId Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
end;ValidateItemId (null)
 
/*003***************************************************************
* Subroutine: LockPatientProfile (null)
* Request: 360005
* Purpose: Lock the patient's profile before populating request
* 560261 or 560271.
******************************************************************/
subroutine LockPatientProfile(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("LockPatient Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iApplication = 3202004
	set iTask = 3202004
	set iRequest = 360005
 
	/* Set a new lock for the patient's profile */
	set 360005_req->patientId = dPatientId
	set 360005_req->lockingApplication = "POWERORDERS"
 
	set stat = tdbexecute(iApplication, iTask,iRequest,"REC",360005_req,"REC",360005_rep)
 
	if(360005_rep->lockKeyId = 0)
		call ErrorHandler2("VALIDATE", "F", "Validate","Unable to obtain Lock for Patient",
			"9999", "Unable to obtain Lock for Patient", adhoc_medadmin_reply_out)
			go to exit_script
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("LockPatient Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end
 
/*003***************************************************************
* Subroutine: UnLockPatientProfile (null)
* Request: 360009
* Purpose: Unlock the patient's profile
******************************************************************/
subroutine UnLockPatientProfile(null)
 	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("UnLockPatient Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iApplication = 3202004
	set iTask = 3202004
	set iRequest = 360009
	/* Unlock the patient profile */
	set 360009_req->patientId = dPatientId
	set 360009_req->lockKeyId = 360005_rep->lockKeyId
	set stat = tdbexecute(iApplication, iTask,iRequest, "REC", 360009_req, "REC", 360009_rep)
 
	if(iDebugFlag > 0)
		call echo(concat("UnLockPatient Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end
 
/******************************************************************
* Subroutine: GetNewOrderId (null)
* Purpose: 	Generates a new order Id
******************************************************************/
subroutine GetNewOrderId (null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetNewOrderId Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iApplication = 600005
	set iTask = 500195
	set iRequest = 500698
 
	set 500698_req->seq_name = "order_seq"
	set 500698_req->number = 1
	set stat = tdbexecute(iApplication, iTask,iRequest,"REC",500698_req,"REC",500698_rep)
 
	if(size(500698_rep->qual,5) > 0)
		set dOrderId = 500698_rep->qual[1].seq_value
	else
		call UnLockPatientProfile(null)
		call ErrorHandler2("VALIDATE", "F", "Validate","Unable to obtain New OrderId",
			"9999", "Unable to obtain New OrderId", adhoc_medadmin_reply_out)
			go to exit_script
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetNewOrderId Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end;GetNewOrderId
 
/******************************************************************
* Subroutine: PostAdhocAdmin (null)
* Purpose: Post the AdHocAdmin
******************************************************************/
subroutine PostAdhocAdmin (null)
 
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostAdhocAdmin Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	;populating the request
	set stat = alterlist(560271_req->adminEventList,1)
	set 560271_req->adminEventList[1].catalogCd = dCatalogCd
	set 560271_req->adminEventList[1].synonymId = dMedicationId
	set 560271_req->adminEventList[1].personId = dPatientId
	set 560271_req->adminEventList[1].encntrId = dEncntrId
	set 560271_req->adminEventList[1].medOrderTypeCd = dMedOrderTypeCd
	set 560271_req->adminEventList[1].routeCd = dAdminRoute
	set 560271_req->adminEventList[1].frequencyCd = dFrequencyCd
	set 560271_req->adminEventList[1].orderProviderId = dProviderId
	set 560271_req->adminEventList[1].orderDtTm = cnvtdatetime(curdate,curtime3)
	set 560271_req->adminEventList[1].adminPrsnlId = dProviderId
	if(dWitnessId > 0)
		set 560271_req->adminEventList[1].witnessPrsnlId = dWitnessId
	endif
	set 560271_req->adminEventList[1].endAdminDtTm = qDocumentedDateTime
	set 560271_req->adminEventList[1].systemEntryDtTm = cnvtdatetime(curdate,curtime3)
	set 560271_req->adminEventList[1].drugFormCd = dFormCd
	set 560271_req->adminEventList[1].communicationTypeCd = dCommType
	set 560271_req->adminEventList[1].adminSiteCd = dAdminSite
	set 560271_req->adminEventList[1].notes = sComments
    set 560271_req->adminEventList[1].infuseOver = -1
    set 560271_req->adminEventList[1].infuseOverUnit = -1
	;setting the ingredient portion
	set stat = alterlist(560271_req->adminEventList[1].ingredientList,1)
	set 560271_req->adminEventList[1].ingredientList[1].catalogCd = dCatalogCd
	set 560271_req->adminEventList[1].ingredientList[1].synonymId = dMedicationId
	set 560271_req->adminEventList[1].ingredientList[1].strength = dDose
	set 560271_req->adminEventList[1].ingredientList[1].strengthUnit = dDoseUnit
	if(dVolume > 0)
		set 560271_req->adminEventList[1].ingredientList[1].volume = dVolume
		set 560271_req->adminEventList[1].ingredientList[1].volumeUnit = dVolumeUnit
	endif
	set 560271_req->adminEventList[1].ingredientList[1].ingredientTypeFlag = 1
 
	;setting the product
	set stat = alterlist(560271_req->adminEventList[1].ingredientList[1].productList,1)
	set 560271_req->adminEventList[1].ingredientList[1].productList[1].itemId = dMedicationItemId
 
    ;execute the request
    set iApplication = 600005
	set iTask = 560270
	set iRequest = 560271
 
    set stat = tdbexecute(iApplication,iTask ,iRequest,"REC",560271_req,"REC",560271_rep)
 
    if(size(560271_rep->adminEventList,5) > 0)
    	set adhoc_medadmin_reply_out->admin_id = 560271_rep->adminEventList[1].eventId
    	set adhoc_medadmin_reply_out->order_id = 560271_rep->adminEventList[1].orderId
    	call ErrorHandler2("VALIDATE", "S", "Success", "AdHoc Med administration posted successfully.",
				"0000", "AdHoc Med administration posted successfully.", adhoc_medadmin_reply_out)
	else
		call UnLockPatientProfile(null)
		call ErrorHandler2("VALIDATE", "F", "Validate","AdHoc Med administration post failed",
			"9999", "AdHoc Med administration post failed", adhoc_medadmin_reply_out)
			go to exit_script
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("PostAdhocAdmin Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end;PostAdhocAdmin
 
 
end
go

