/*****************************************************************************
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
/*****************************************************************************
          Date Written:     03/12/18
          Source file name: snsro_post_patient
          Object name:      snsro_post_patient
          Program purpose:  Posts a person into Millennium
          Tables read:      Person, Address, Phone, Person_alias
          Tables updated:   NONE
          Requests:			112505 - PM_GET_ALIAS_POOL
							115161 - pm_get_new_seq
							114327 - PM_GET_ALIAS
							114328 - PM_GET_ALIAS_MASK
							114327 - PM_GET_ALIAS
							114382 - PM_GET_ZIPCODE_DEFAULTS
							114609 - PM.UpdatePersonData
							500727 - orm_add_custom_pat_pref_pharm
							100082 - PM_LOCK_DEL_LOCKS
          Executing from:   EMISSARY SERVICES
          Special Notes:	NONE
 ************************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG    				*
 ************************************************************************
 * Mod 	Date     	Engineer  	Comment                            		*
 * --- 	------- 	--------- 	----------------------------------------*
 * 001 	03/12/18	RJC			V2 Initial write
 * 002  10/6/18     STV         rewrite to fit V1 version
 ************************************************************************/
 drop program snsro_post_patient go
create program snsro_post_patient
 
prompt
		"Output to File/Printer/MINE" = "MINE" 	;Required
		, "Username" = ""        				;Required
		, "Facility" = ""                       ;Required
		, "InterpreterId" = ""                  ;optional
		, "JSON Args" = ""						;Required
		, "DebugFlag" = ""						;Optional
 
with OUTDEV, USERNAME, FAC_ID,INTERP_ID,JSON_ARGS, DEBUG_FLAG
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.16.6.1"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common
;execute snsro2_common_object_init
;execute snsro2_common_object_load
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
; Inputs
declare sUserName				= vc with protect, noconstant("")
declare iDebugFlag				= i2 with protect, noconstant(0)
declare sJsonArgs				= gvc with protect, noconstant("")
declare dFacilityCd				= f8 with protect, noconstant(0.0)
declare qBirthDate				= dq8 with protect, noconstant(0)
declare dConfidentialityCd		= f8 with protect, noconstant(0.0)
declare qDeceasedDate			= dq8 with protect, noconstant(0)
declare dEthnicityCd			= f8 with protect, noconstant(0.0)
declare sFirstName				= vc with protect, noconstant("")
declare dGenderCd				= f8 with protect, noconstant(0.0)
declare dInterpreterCd			= f8 with protect, noconstant(0.0)
declare dLanguageCd				= f8 with protect, noconstant(0.0)
declare sLastName				= vc with protect, noconstant("")
declare dMaritalStatusCd		= f8 with protect, noconstant(0.0)
declare sMiddleName				= vc with protect, noconstant("")
declare sPrefix					= vc with protect, noconstant("")
declare dRaceCd					= f8 with protect, noconstant(0.0)
declare dReligionCd				= f8 with protect, noconstant(0.0)
declare sSSN					= vc with protect, noconstant("")
declare sSuffix					= vc with protect, noconstant("")
declare dVipCd					= f8 with protect, noconstant(0.0)
declare dInterpreterTypeCd      = f8 with protect, noconstant(0.0)
 
; Other
declare dPrsnlId				= f8 with protect, noconstant(0.0)
declare dPersonId				= f8 with protect, noconstant(0.0)
declare cr						= c1 with protect, constant(char(13)) ;Carriage Return
declare sp						= c1 with protect, constant(" ")	  ;Space
declare JSONout					= gvc with protect, noconstant("")
declare dMRNAliasPoolCd			= f8 with protect, noconstant(0.0)
declare dCMRNAliasPoolCd		= f8 with protect, noconstant(0.0)
declare dSSNAliasPoolCd			= f8 with protect, noconstant(0.0)
declare dOrganizationId			= f8 with protect, noconstant(0.0)
declare sNextMRN				= vc with protect, noconstant("")
declare sNextCMRN				= vc with protect, noconstant("")
declare iAddressSeq				= i2 with protect, noconstant(0)
declare iPhoneSeq				= i2 with protect, noconstant(0)
declare iDeleteLock             = i2 with protect, noconstant(0)
 
; Constants
declare c_facility_location_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",222,"FACILITY"))
declare c_now_dt_tm					= dq8 with protect, constant(cnvtdatetime(curdate,curtime3))
declare c_tel_contact_method_cd		= f8 with protect, constant(uar_get_code_by("MEANING",23056,"TEL"))
declare c_active_active_status_cd = f8 with protect, constant(uar_get_code_by("MEANING",48,"ACTIVE"))
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
;112505 - PM_GET_ALIAS_POOL
free record 112505_req
record 112505_req (
  1 org [*]
    2 organization_id = f8
  1 alias_entity_names [*]
    2 alias_entity_name = vc
)
 
free record 112505_rep
record 112505_rep (
  1 org_qual = i4
  1 org [*]
    2 organization_id = f8
    2 alias_cnt = i4
    2 alias [*]
      3 alias_pool_cd = f8
      3 alias_pool_disp = vc
      3 alias_entity_name = vc
      3 alias_entity_alias_type_cd = f8
      3 alias_entity_alias_type_disp = vc
      3 alias_entity_alias_type_mean = vc
      3 updt_cnt = i4
      3 description = vc
      3 numeric_ind = i2
      3 duplicates_allowed_cd = f8
      3 duplicates_allowed_disp = vc
      3 format_mask = vc
      3 check_digit_method_cd = f8
      3 check_digit_method_disp = vc
      3 system_assign_cd = f8
      3 system_assign_disp = vc
      3 prefix_numeric_ind = i2
      3 prefix_length = i4
      3 prefix_default = vc
      3 suffix_numeric_ind = i2
      3 suffix_length = i4
      3 suffix_default = vc
      3 active_ind = i2
      3 dup_allowed_flag = i2
      3 sys_assign_flag = i2
      3 unique_ind = i2
      3 alias_method_cd = f8
      3 alias_method_disp = vc
      3 alias_method_mean = vc
      3 alias_pool_ext_cd = f8
      3 alias_pool_ext_disp = vc
      3 mnemonic = vc
  1 status_data
    2 status = c1
    2 subeventstatus [*]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
  1 mnemonic_exists_ind = i2
)
 
;115161 - pm_get_new_seq
free record 115161_req
record 115161_req (
  1 seq_type = vc
)
 
free record 115161_rep
record 115161_rep (
   1 seq_num = f8
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
)
 
;114327 - PM_GET_ALIAS
free record 114327_req
record 114327_req (
  1 parent_entity_id = f8
  1 parent_entity_name = c32
  1 alias_type_meaning = c12
  1 organization_id = f8
  1 alias_pool_cd = f8
  1 alias_entity_type_cd = f8
  1 alias = vc
  1 action_type = c3
  1 seq_type_name = c32
  1 person_id = f8
  1 encntr_type_cd = f8
)
 
free record 114327_rep
record 114327_rep (
	1 alias_info [* ]
      2 parent_entity_id = f8
      2 alias = vc
      2 alias_pool_cd = f8
      2 alias_format = vc
      2 alias_type_cd = f8
      2 alias_sub_type_cd = f8
      2 check_digit = i2
      2 check_digit_method_cd = f8
      2 organization_id = f8
      2 visit_seq_number = i4
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
)
 
;114328 - PM_GET_ALIAS_MASK
free record 114328_req
record 114328_req (
  1 alias_pool_cd = f8
  1 organization_id = f8
  1 alias_entity_name = c32
  1 alias_entity_type = c32
)
 
free record 114328_rep
record 114328_rep (
   1 mask = vc
   1 alias_entity_type_cd = f8
   1 alias_pool_cd = f8
   1 sys_assign_flag = i2
   1 auto_assign_flag = i2
   1 dup_allowed_flag = i2
   1 unique_ind = i2
   1 alias_method_cd = f8
   1 alias_pool_ext_cd = f8
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c8
       3 operationstatus = c1
       3 targetobjectname = c8
       3 targetobjectvalue = c100
)
 
;114382 PM_GET_ZIPCODE_DEFAULTS
free record 114382_req
record 114382_req (
  1 zipcode = vc
  1 city = vc
  1 state_cd = f8
  1 state = vc
  1 search_option = i2
)
 
free record 114382_rep
record 114382_rep (
   1 list [* ]
     2 zipcode = vc
     2 primary_ind = i2
     2 prefix = vc
     2 city_cd = f8
     2 city = vc
     2 county = vc
   1 city = vc
   1 county = vc
   1 county_cd = f8
   1 county_fips = vc
   1 preferred_type = c1
   1 prefix = vc
   1 state = vc
   1 state_cd = f8
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = vc
       3 operationstatus = c1
       3 targetobjectname = vc
       3 targetobjectvalue = vc
   1 city_cd = f8
 )
 
/* 
;500727 - orm_add_custom_pat_pref_pharm
free record 500727_req
record 500727_req (
  1 person_id = f8
  1 pharmacies [*]
    2 pharmacy_id_str = vc
    2 default_ind = i2
    2 inactive_ind = i2
)
 
free record 500727_rep
record 500727_rep (
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
)
*/
;100082 - PM_LOCK_DEL_LOCKS
free record 100082_req
record 100082_req (
  1 person [*]
    2 person_id = f8
)
 
free record 100082_rep
record 100082_rep (
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = vc
       3 operationstatus = c1
       3 targetobjectname = vc
       3 targetobjectvalue = vc
)

/* 
 ;Argument List
 free record arglist
 record arglist (
	1 FacilityId = vc
	1 Addresses[*]
		2 Address1 = vc
		2 Address2 = vc
		2 City = vc
		2 State = vc
		2 TypeId = vc
		2 Zip = vc
	1 BirthDate = vc
	1 ConfidentialityId = vc
	1 DeceasedDate = vc
	1 Emails[*] = vc
	1 EthnicityId = vc
	1 FirstName = vc
	1 GenderId = vc
	1 Languages[*]
		2 InterpreterId = vc
		2 IsPreferred = vc
		2 LanguageId = vc
		2 TypeId = vc
	1 LastName = vc
	1 MaritalStatusId = vc
	1 MiddleName = vc
	1 OtherKnownNames[*]
		2 FirstName = vc
		2 MiddleName = vc
		2 LastName = vc
		2 Prefix = vc
		2 Suffix = vc
		2 TypeId = vc
	1 Phones[*]
		2 Number = vc
		2 TypeId = vc
	1 PreferredPharmacies[*] = vc
	1 Prefix = vc
	1 RaceIds[*] = vc
	1 ReligionId = vc
	1 SSN = vc
	1 Suffix = vc
	1 VipId = vc
 )
 
; Final Reply
declare final_reply = gvc
call parser("free record post_patient_reply_out go")
set final_reply = build2(
	"record post_patient_reply_out (",cr,
	"1 patient_id = f8",cr,
	CernerAudit(1),
	CernerStatusData(1),
	CernerDebug(1),
	") go")
call parser(final_reply)
*/

 ;Argument List
 free record arglist
 record arglist(
 	1 LastName = vc
 	1 FirstName = vc
 	1 MiddleName = vc
 	1 Prefix = vc
 	1 Suffix = vc
 	1 ConfidentialityId = vc
 	1 GenderId = vc
 	1 SSN = vc
 	1 VipId = vc
 	1 BirthDateTime = vc
 	1 DeceasedDateTime= vc
 	1 extendedinfo
 		2 Email = vc
 		2 Ethnicity = vc
 		2 Language = vc
 		2 Marital_Status = vc
 		2 NeedsInterpreter = vc
		2 Race = vc
		2 Religion = vc
 		2 Addresses[*]
			3 Address1 = vc
			3 Address2 = vc
			3 City = vc
			3 State = vc
			3 Address_Type_cd = vc
			3 Zip = vc
	    2 Phones[*]
			3 Number = vc
			3 Phone_type_cd = vc
 
)

free record post_patient_reply_out
record post_patient_reply_out(
  1 patient_id       	= f8
  1 audit
    2 user_id             	= f8
    2 user_firstname     	= vc
    2 user_lastname         = vc
    2 patient_id            = f8
    2 patient_firstname     = vc
    2 patient_lastname      = vc
    2 service_version       = vc
  1 status_data
    2 status 				= c1
    2 subeventstatus[1]
      3 OperationName 		= c25
      3 OperationStatus 	= c1
      3 TargetObjectName 	= c25
      3 TargetObjectValue 	= vc
      3 Code 				= c4
      3 Description 		= vc
 
)
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
;Input
set sUserName							= trim($USERNAME, 3)
set iDebugFlag							= cnvtint($DEBUG_FLAG)
set sJsonArgs 							= trim($JSON_ARGS,3)
set jrec 								= cnvtjsontorec(sJsonArgs) ;This loads the arglist record
set dFacilityCd 						= cnvtreal(trim($FAC_ID,3))
set qBirthDate 							= cnvtdatetime(arglist->BirthDateTime)
set dConfidentialityCd  				= cnvtreal(arglist->ConfidentialityId)
set qDeceasedDate  						= cnvtdatetime(arglist->DeceasedDateTime)
set dEthnicityCd 						= cnvtreal(arglist->extendedinfo->Ethnicity)
set sFirstName 							= trim(arglist->FirstName,3)
set dGenderCd  							= cnvtreal(arglist->GenderId)
set dLanguageCd 						= cnvtreal(trim(arglist->extendedinfo->Language,3))
set dInterpreterTypeCd  				= cnvtreal(trim($INTERP_ID,3))
set sLastName 							= trim(arglist->LastName,3)
set dMaritalStatusCd 					= cnvtreal(arglist->extendedinfo->Marital_Status)
set sMiddleName   						= trim(arglist->MiddleName,3)
set sPrefix 							= trim(arglist->Prefix,3)
set dReligionCd 						= cnvtreal(arglist->extendedinfo->Religion)
set sSSN 								= trim(arglist->SSN)
set sSuffix 							= trim(arglist->Suffix)
set dVipCd 								= cnvtreal(arglist->VipId)
set dRaceCd 							= cnvtreal(trim(arglist->extendedinfo->Race,3))
 
;Other
set dPrsnlId							= GetPrsnlIDfromUserName(sUserName)
 
if(iDebugFlag)
	call echo(build("sUserName -> ",sUserName))
	call echo(build("sJsonArgs -> ",sJsonArgs))
	call echo(build("dFacilityCd -> ",dFacilityCd))
	call echo(build("qBirthDate -> ",qBirthDate))
	call echo(build("dConfidentialityCd -> ",dConfidentialityCd))
	call echo(build("qDeceasedDate -> ",qDeceasedDate))
	call echo(build("dEthnicityCd -> ",dEthnicityCd))
	call echo(build("sFirstName -> ",sFirstName))
	call echo(build("dGenderCd -> ",dGenderCd))
	call echo(build("dInterpreterCd -> ",dInterpreterCd))
	call echo(build("dLanguageCd -> ",dLanguageCd))
	call echo(build("sLastName -> ",sLastName))
	call echo(build("dMaritalStatusCd -> ",dMaritalStatusCd))
	call echo(build("sMiddleName -> ",sMiddleName))
	call echo(build("sPrefix -> ",sPrefix))
	call echo(build("dReligionCd -> ",dReligionCd))
	call echo(build("sSSN -> ",sSSN))
	call echo(build("sSuffix -> ",sSuffix))
	call echo(build("dVipCd -> ",dVipCd))
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ValidateInputParams(null)					= null with protect
declare GetAliasPools(null)							= i2 with protect ;112505 - PM_GET_ALIAS_POOL
declare GetNextPersonId(null)						= i2 with protect ;115161 - pm_get_new_seq
declare GetNextMrn(alias_pool = f8, type = vc)		= i2 with protect ;114327 - PM_GET_ALIAS
declare GetSSNAliasPoolAttributes(null)				= i2 with protect ;114328 - PM_GET_ALIAS_MASK
declare CheckSSNDuplicates(null)					= i2 with protect ;114327 - PM_GET_ALIAS
declare AddPerson(null)								= null with protect ;114609 - PM.UpdatePersonData
declare GetZipDefaults(zipcode = vc)				= null with protect ;114382 - PM_GET_ZIPCODE_DEFAULTS
declare UpdatePhoneAddressData(null)				= null with protect
declare DeleteLock(null)							= i2 with protect ;100082 - PM_LOCK_DEL_LOCKS
;declare AddPreferredPharmacy(null)					= i2 with protect ;500727 - orm_add_custom_pat_pref_pharm
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
;Validate Username
set iRet = PopulateAudit(sUserName, dPersonID, post_patient_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "POST PATIENT", "Invalid User for Audit.",
	"1001", build("UserId is invalid: ", sUserName), post_patient_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate Input Parameters
call ValidateInputParams(null)
 
; Get Alias Pools for the Facility -- 112505 - PM_GET_ALIAS_POOL
set iRet = GetAliasPools(null)
if(iRet = 0)
	call ErrorHandler2("EXECUTE", "F", "POST PATIENT", "Could not retrieve Alias Pools - 112505.",
	"9999", "Could not retrieve Alias Pools - 112505.", post_patient_reply_out)
	go to EXIT_SCRIPT
endif
 
; Get Next PersonId sequence -- 115161 - pm_get_new_seq
set iRet = GetNextPersonId(null)
if(iRet = 0)
	call ErrorHandler2("EXECUTE", "F", "POST PATIENT", "Could not retrieve PersonId sequence - 115161.",
	"9999", "Could not retrieve PersonId sequence - 115161.", post_patient_reply_out)
	go to EXIT_SCRIPT
endif
 
; Get Next MRN sequence -- 114327 - PM_GET_ALIAS
set iRet = GetNextMrn(dMRNAliasPoolCd, "MRN")
if(iRet = 0)
	call ErrorHandler2("EXECUTE", "F", "POST PATIENT", "Could not retrieve MRN - 114327.",
	"9999", "Could not retrieve MRN - 114327.", post_patient_reply_out)
	go to EXIT_SCRIPT
endif
 
; Get Next CMRN sequence if the site uses it -- 114327 - PM_GET_ALIAS
if(dCMRNAliasPoolCd > 0)
	set iRet = GetNextMrn(dCMRNAliasPoolCd, "CMRN")
	if(iRet = 0)
		call ErrorHandler2("EXECUTE", "F", "POST PATIENT", "Could not retrieve CMRN - 114327.",
		"9999", "Could not retrieve CMRN - 114327.", post_patient_reply_out)
		go to EXIT_SCRIPT
	endif
endif
 
; Get SSN Alias pool attributes -- 114328 - PM_GET_ALIAS_MASK
set iRet = GetSSNAliasPoolAttributes(null)
if(iRet = 0)
	call ErrorHandler2("EXECUTE", "F", "POST PATIENT", "Could not retrieve SSN alias pool data - 114328.",
	"9999", "Could not retrieve SSN alias pool data - 114328.", post_patient_reply_out)
	go to EXIT_SCRIPT
endif
 
; If duplicates are not allowed, Check if SSN already exists in the system -- 114327 - PM_GET_ALIAS
if(114328_rep->dup_allowed_flag = 3)
	set iRet = CheckSSNDuplicates(null)
	if(iRet = 0)
		call ErrorHandler2("VALIDATE", "F", "POST PATIENT", "SSN already exists and duplicates are not allowed.",
		"9999", "SSN already exists and duplicates are not allowed.", post_patient_reply_out)
		go to EXIT_SCRIPT
	endif
endif
 
; Post Person
set iRet = AddPerson(null)
if(iRet = 0)
	call ErrorHandler2("EXECUTE", "F", "POST PATIENT", "Could not post  person- 114609.",
	"9999", "Could not post  person- 114609.", post_patient_reply_out)
	go to EXIT_SCRIPT
endif
 
 ; Delete PM Lock -- 100082 - PM_LOCK_DEL_LOCKS
set iRet = DeleteLock(null)
if(iRet = 0)
	call ErrorHandler2("EXECUTE", "F", "POST PATIENT", "Could not remove lock - 100082.",
	"9999", "Could not remove lock - 100082.", post_patient_reply_out)
	go to EXIT_SCRIPT
endif
 
;Update Phone & Address data status codes
call UpdatePhoneAddressData(null)
/*
; Add Preferred Pharmacy -- 500727 - orm_add_custom_pat_pref_pharm
if(size(arglist->PreferredPharmacies,5) > 0)
	set iRet = AddPreferredPharmacy(null)
	if(iRet = 0)
		call ErrorHandler2("EXECUTE", "F", "POST PATIENT", "Could not add preferred pharmacy - 101107.",
		"9999", "Could not add preferred pharmacy - 101107.", post_patient_reply_out)
		go to EXIT_SCRIPT
	endif
 endif
*/
;Set Audit to Successful
call ErrorHandler2("SUCCESS", "S", "POST PATIENT", "Process completed successfully.",
"0000", "Process completed successfully.", post_patient_reply_out)
 
#EXIT_SCRIPT
;releases lock if errors inside Addperson
if(iDeleteLock > 0)
	set lockDelete = DeleteLock(null)
endif
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(post_patient_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_post_patient.json")
	call echo(build2("_file : ", _file))
	call echojson(post_patient_reply_out, _file, 0)
	call echo(JSONout)
	call echorecord(post_patient_reply_out)
endif
 
#EXIT_VERSION
/*************************************************************************
; SUBROUTINES
**************************************************************************/
 
/*************************************************************************
;  Name: ValidateInputParams(null)	= null
;  Description: Validate input parameters
**************************************************************************/
subroutine ValidateInputParams(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateInputParams Begin",
		format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	;Validate Facility
	set iRet = GetLocationTypeCode(dFacilityCd)
	if(iRet != c_facility_location_type_cd)
		call ErrorHandler2("VALIDATE", "F", "POST PATIENT", "Invalid Facility.",
		"2073", build2("Invalid Facility: ",dFacilityCd), post_patient_reply_out)
		go to EXIT_SCRIPT
	endif
 
	;Validate Address Exists
	if(size(arglist->Addresses,5) = 0)
		call ErrorHandler2("VALIDATE", "F", "PUT PATIENT", "An address is required.",
		"9999", build2("An address is required."), post_patient_reply_out)
		go to EXIT_SCRIPT
	endif
 
	;Validate Phone Exists
	if(size(arglist->Phones,5) = 0)
		call ErrorHandler2("VALIDATE", "F", "PUT PATIENT", "A phone number is required.",
		"9999", build2("A phone number is required."), post_patient_reply_out)
		go to EXIT_SCRIPT
	endif
 
	;Validate Birthdate
	if(qBirthDate = 0 or qBirthDate > sysdate)
		call ErrorHandler2("VALIDATE", "F", "POST PATIENT", "Invalid DateOfBirth.",
		"2037", build2("Invalid DateOfBirth: ",arglist->BirthDate), post_patient_reply_out)
		go to EXIT_SCRIPT
	endif
 
	; Validate Confidentiality
	if(dConfidentialityCd > 0)
		set iRet = GetCodeSet(dConfidentialityCd)
		if(iRet != 87)
			call ErrorHandler2("VALIDATE", "F", "POST PATIENT", "Invalid Confientiality.",
			"2063", build2("Invalid Confientiality: ",dConfidentialityCd), post_patient_reply_out)
			go to EXIT_SCRIPT
		endif
	endif
 
	; Validate DeceasedDate
	if(qDeceasedDate > 0)
		if(qDeceasedDate < qBirthDate or qDeceasedDate > sysdate)
			call ErrorHandler2("VALIDATE", "F", "POST PATIENT", "Invalid DeceasedDate.",
			"2064", build2("Invalid DeceasedDate: ",arglist->DeceasedDate), post_patient_reply_out)
			go to EXIT_SCRIPT
		endif
	endif
 
	; Validate Ethnicity
	if(dEthnicityCd > 0)
		set iRet = GetCodeSet(dEthnicityCd)
		if(iRet != 27)
			call ErrorHandler2("VALIDATE", "F", "POST PATIENT", "Invalid Ethnicity.",
			"2068", build2("Invalid Ethnicity: ",dEthnicityCd), post_patient_reply_out)
			go to EXIT_SCRIPT
		endif
	endif
 
	; Validate FirstName
	if(sFirstName <= " ")
		call ErrorHandler2("VALIDATE", "F", "POST PATIENT", "Invalid FirstName.",
		"2057", build2("Invalid FirstName: ",sFirstName), post_patient_reply_out)
		go to EXIT_SCRIPT
	endif
 
	; Validate LastName
	if(sLastName <= " ")
		call ErrorHandler2("VALIDATE", "F", "POST PATIENT", "Invalid LastName.",
		"2058", build2("Invalid LastName: ",sLastName), post_patient_reply_out)
		go to EXIT_SCRIPT
	endif
 
	; Validate Gender
	set iRet = GetCodeSet(dGenderCd)
	if(iRet != 57)
		call ErrorHandler2("VALIDATE", "F", "POST PATIENT", "Invalid Gender.",
		"2038", build2("Invalid Gender: ",dGenderCd), post_patient_reply_out)
		go to EXIT_SCRIPT
	endif
 
	; Validate Interpreter
	if(dInterpreterCd > 0)
		set iRet = GetCodeSet(dInterpreterCd)
		if(iRet != 329)
			call ErrorHandler2("VALIDATE", "F", "POST PATIENT", "Invalid InterpreterId.",
			"9999", build2("Invalid InterpreterId: ",dInterpreterCd), post_patient_reply_out)
			go to EXIT_SCRIPT
		endif
	endif
 
	 ; Validate Language
	 if(dLanguageCd > 0)
		set iRet = GetCodeSet(dLanguageCd)
		if(iRet != 36)
			call ErrorHandler2("VALIDATE", "F", "POST PATIENT", "Invalid Language.",
			"2069", build2("Invalid Language: ",dLanguageCd), post_patient_reply_out)
			go to EXIT_SCRIPT
		endif
	endif
 
	; Validate Marital Status
	if(dMaritalStatusCd > 0)
		set iRet = GetCodeSet(dMaritalStatusCd)
		if(iRet != 38)
			call ErrorHandler2("VALIDATE", "F", "POST PATIENT", "Invalid MaritalStatus.",
			"2072", build2("Invalid MaritalStatus: ",dMaritalStatusCd), post_patient_reply_out)
			go to EXIT_SCRIPT
		endif
	endif
 
	; Validate Religion
	if(dReligionCd > 0)
		set iRet = GetCodeSet(dReligionCd)
		if(iRet != 49)
			call ErrorHandler2("VALIDATE", "F", "POST PATIENT", "Invalid Religion.",
			"2070", build2("Invalid Religion: ",dReligionCd), post_patient_reply_out)
			go to EXIT_SCRIPT
		endif
	endif
 
	; Validate Race
	if(dRaceCd > 0)
		set iRet = GetCodeSet(dRaceCd)
		if(iRet != 282)
			call ErrorHandler2("VALIDATE", "F", "POST PATIENT", "Invalid Race.",
				"2071", build2("Invalid Race: ",dRaceCd), post_patient_reply_out)
			go to EXIT_SCRIPT
		endif
	endif
 
	; Validate SSN
	if(sSSN > " ")
		set sSSN = trim(replace(sSSN,"-",""),3)
		if(size(sSSN) != 9)
			call ErrorHandler2("VALIDATE", "F", "POST PATIENT", "Invalid SSN.",
			"2061", build2("Invalid SSN: ",sSSN), post_patient_reply_out)
			go to EXIT_SCRIPT
		endif
	endif
 
	; Validate VIP
	if(dVipCd > 0)
		set iRet = GetCodeSet(dVipCd)
		if(iRet != 67)
			call ErrorHandler2("VALIDATE", "F", "POST PATIENT", "Invalid VIP.",
			"2062", build2("Invalid VIP: ",sSSN), post_patient_reply_out)
			go to EXIT_SCRIPT
		endif
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("ValidateInputParams Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetAliasPools(null)	= null ;112505 - PM_GET_ALIAS_POOL
;  Description: Get Alias pool listing for the facility. This determines which pool to use for SSN and MRN
**************************************************************************/
subroutine GetAliasPools(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetAliasPools Begin",
		format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 100000
	set iTask = 100000
	set iRequest = 112505
 
	;Get Org Id
	select into "nl:"
	from location l
	where l.location_cd = dFacilityCd
	detail
		dOrganizationId = l.organization_id
	with nocounter
 
	;Set request params
	set stat = alterlist(112505_req->org,1)
	set 112505_req->org[1].organization_id = dOrganizationId
 
	;Execute request
	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",112505_req,"REC",112505_rep)
 
	;Verify status & Set variables
	if(112505_rep->status_data.status = "S")
		set iValidate = 1
 
		select into "nl:"
		from (dummyt d with seq = size(112505_rep->org[1].alias,5))
		where 112505_rep->org[1].alias[d.seq].alias_entity_name = "PERSON_ALIAS"
		detail
			if(112505_rep->org[1].alias[d.seq].alias_entity_alias_type_mean = "SSN")
				dSSNAliasPoolCd = 112505_rep->org[1].alias[d.seq].alias_pool_cd
			endif
 
			if(112505_rep->org[1].alias[d.seq].alias_entity_alias_type_mean = "MRN")
				dMRNAliasPoolCd = 112505_rep->org[1].alias[d.seq].alias_pool_cd
			endif
 
			if(112505_rep->org[1].alias[d.seq].alias_entity_alias_type_mean = "CMRN")
				dCMRNAliasPoolCd = 112505_rep->org[1].alias[d.seq].alias_pool_cd
			endif
 
 		with nocounter
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetAliasPools Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
end ;End Sub
 
/*************************************************************************
;  Name: GetNextPersonId(null)	= null  ;115161 - pm_get_new_seq
;  Description: Gets the next person_id sequence for the person table
**************************************************************************/
subroutine GetNextPersonId(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetNextPersonId Begin",
		format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iValidate = 0
	set iApplication = 100000
	set iTask = 100000
	set iRequest = 115161
 
	;Set request params
	set 115161_req->seq_type = "PERSON_ONLY_SEQ"
 
 	;Execute request
	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",115161_req,"REC",115161_rep)
 
	;Verify status
	if(115161_rep->status_data.status = "S")
		set iValidate = 1
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetNextPersonId Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
end ;End Sub
 
/*************************************************************************
;  Name: GetNextMrn(alias_pool = f8, type = vc)		= i2 ;114327 - PM_GET_ALIAS
;  Description: Gets the next MRN sequence in the alias pool
**************************************************************************/
subroutine GetNextMrn(alias_pool, type)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetNextMrn Begin",
		format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	;Initialize 114327 record structures
 	set stat = initrec(114327_req)
 	set stat = initrec(114327_rep)
 
 	set iValidate = 0
	set iApplication = 100000
	set iTask = 100000
	set iRequest = 114327
 
	;Set request params
	set 114327_req->alias_pool_cd = alias_pool
	set 114327_req->action_type = "NEW"
	set 114327_req->seq_type_name = "DEFAULT"
 
 	;Execute request
	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",114327_req,"REC",114327_rep)
 
	;Verify status
	if(114327_rep->status_data.status = "S")
		set iValidate = 1
		if(type = "MRN")
			set sNextMRN = 114327_rep->alias_info[1].alias
		else
			set sNextCMRN = 114327_rep->alias_info[1].alias
		endif
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetNextMrn Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
end ;End Sub
 
/*************************************************************************
;  Name: GetSSNAliasPoolAttributes(null) = null ;114328 - PM_GET_ALIAS_MASK
;  Description: Gets the attributes for the SSN alias pool. Need to know if duplicates are allowed
**************************************************************************/
subroutine GetSSNAliasPoolAttributes(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetSSNAliasPoolAttributes Begin",
		format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 100000
	set iTask = 100003
	set iRequest = 114328
 
	; Duplicates flag value meanings
	      ;0.00	Duplicates are allowed
          ;1.00	Duplicates are allowed
          ;2.00	Duplicates are allowed but warn user
          ;3.00	Duplicates are not allowed
 
	;Set request params
	set 114328_req->alias_pool_cd = dSSNAliasPoolCd
 
 	;Execute request
	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",114328_req,"REC",114328_rep)
 
	;Verify status
	if(114328_rep->status_data.status = "S")
		set iValidate = 1
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetSSNAliasPoolAttributes Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
end ;End Sub
 
/*************************************************************************
;  Name: CheckSSNDuplicates(null)	= null   ;114327 - PM_GET_ALIAS
;  Description: Verifies if the SSN provided already exists in the system
**************************************************************************/
subroutine CheckSSNDuplicates(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("CheckSSNDuplicates Begin",
		format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	;Initialize 114327 record structures
 	set stat = initrec(114327_req)
 	set stat = initrec(114327_rep)
 
 	set iValidate = 0
	set iApplication = 100000
	set iTask = 100000
	set iRequest = 114327
 
	;Set request params
	set 114327_req->alias_pool_cd = dSSNAliasPoolCd
	set 114327_req->action_type = "DUP"
	set 114327_req->alias = sSSN
 
 	;Execute request
	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",114327_req,"REC",114327_rep)
 
	;Verify status
	if(114327_rep->status_data.status = "F") ;Failure means no duplicates exist
		set iValidate = 1
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("CheckSSNDuplicates Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
end ;End Sub
 
/*************************************************************************
;  Name: AddPerson(null) = null  ;114609 - PM.UpdatePersonData
;  Description: Post the Person
**************************************************************************/
subroutine AddPerson(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("AddPerson Begin",
		format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare error_msg = vc
	declare iRequest = i4
	declare iApplication = i4
	declare happ = i4
	declare iTask = i4
	declare htask = i4
	declare hstep = i4
	declare hrequest = i4
	declare hreply = i4
	declare event_id = f8
	declare hperson = i4
	declare htemplate = i4
	declare hfield = i4
	declare crmstatus = i2
 
	set error_msg = "None"
 
	; Get PM  Record Template
	set iApplication = 3200000
	set iTask = 3200032
	set iRequest = 114606
	execute crmrtl
	execute srvrtl
 
	call echo ("Beginning the Application" )
	set crmstatus = uar_crmbeginapp (iApplication ,happ )
	if ((crmstatus = 0 ) )
		set crmstatus = uar_crmbegintask (happ ,iTask ,htask )
		if ((crmstatus != 0 ) )
			set error_msg = concat ("BEGINTASK=" ,cnvtstring (crmstatus ) )
			call uar_crmendapp (happ )
		endif
	else
		set error_msg = concat ("BEGINAPP=" ,cnvtstring (crmstatus ) )
	endif
 
	if ((htask > 0 ) )
		call echo ("Beginning the Step" )
		set crmstatus = uar_crmbeginreq (htask ,"" ,iRequest ,hstep )
		if ((crmstatus != 0 ) )
			set error_msg = concat ("BEGINREQ=" ,cnvtstring (crmstatus ) )
			call uar_crmendapp (happ )
		else
			set hrequest = uar_crmgetrequest (hstep )
			set issuccess = uar_srvsetlong (hrequest ,"type_flag" ,114998 )
			call echo (build ("SrvSetLong for type_flag returned:" ,issuccess ) )
			set crmstatus = uar_crmperform (hstep )
			if ((crmstatus = 0 ) )
				set htemplate = uar_crmgetreply (hstep )
				if ((htemplate = 0 ) )
					set error_msg = "ERR: 114998 Template = null"
				endif
			else
				set error_msg = concat ("ERR: 114998 Perform " ,cnvtstring (crmstatus ) )
			endif
		endif
	endif
 
	if ((error_msg != "None" ) )
		call ErrorHandler2("EXECUTE", "F", "POST PATIENT", error_msg,"9999", error_msg, post_patient_reply_out)
		set iDeleteLock = 1
		go to EXIT_SCRIPT
  	endif
 
	; Post Patient
	set iApplication = 100000
	set iTask = 100000
	set iRequest = 114609
	execute crmrtl
	execute srvrtl
 
	call echo ("Beginning the Application" )
	set crmstatus = uar_crmbeginapp (iApplication ,happ )
	if ((crmstatus = 0 ) )
		set crmstatus = uar_crmbegintask (happ ,iTask ,htask )
		if ((crmstatus != 0 ) )
			set error_msg = concat ("BEGINTASK=" ,cnvtstring (crmstatus ))
			call uar_crmendapp (happ )
			call ErrorHandler2("EXECUTE", "F", "POST PATIENT", error_msg,"9999", error_msg, post_patient_reply_out)
			set iDeleteLock = 1
			go to EXIT_SCRIPT
		endif
	else
		set error_msg = concat ("BEGINAPP=" ,cnvtstring (crmstatus ) )
	endif
 
	if ((htask > 0 ) )
		call echo ("Beginning the Step" )
		set crmstatus = uar_crmbeginreq (htask ,"" ,iRequest ,hstep )
		call echo (build ("hStep->" ,hstep ) )
		if ((crmstatus != 0 ) )
			set error_msg = concat ("BEGINREQ=" ,cnvtstring (crmstatus ) )
			call uar_crmendapp (happ )
			call ErrorHandler2("EXECUTE", "F", "POST PATIENT", error_msg,"9999", error_msg, post_patient_reply_out)
			set iDeleteLock = 1
			go to EXIT_SCRIPT
		else
			; Create request
			set hrequest = uar_crmgetrequest (hstep )
			set hsrvtype = uar_srvcreatetypefrom (htemplate ,0 )
			set issuccess = uar_srvrecreateinstance (hrequest ,hsrvtype )
 
			; Transaction Info
			set stat = uar_srvsetshort(hrequest ,"transaction_type" ,100 )
			set htransactioninfo = uar_srvgetstruct (hrequest ,"transaction_info" )
			set stat = uar_srvsetdouble(htransactioninfo,"prsnl_id",dPrsnlId)
			set stat = uar_srvsetdate(htransactioninfo ,"trans_dt_tm" ,c_now_dt_tm )
			set stat = uar_srvsetlong(htransactioninfo ,"type_flag" ,114998 ) ;This is the request structure used for the call - found above
			set stat = uar_srvsetlong(htransactioninfo,"access_sensitive_data_bits",63) ;This allows filing phone and address data
 
			; Person
			set htemplateperson = uar_srvgetstruct (htemplate ,"person" )
			set hperson = uar_srvgetstruct (hrequest ,"person" )
			set stat = uar_srvsetdouble (hperson ,"person_id" ,0.0)
			set stat = uar_srvsetshort(hperson,"new_person_ind",1)
			set stat = uar_srvsetdouble (hperson ,"create_prsnl_id",dPrsnlId)
			set stat = uar_srvsetdate (hperson ,"birth_dt_tm" ,cnvtdatetime(qBirthDate))
			set stat = uar_srvsetdouble (hperson ,"confid_level_cd" ,dConfidentialityCd )
			set stat = uar_srvsetdate (hperson ,"deceased_dt_tm" ,qDeceasedDate )
			set stat = uar_srvsetdouble (hperson ,"ethnic_grp_cd" ,dEthnicityCd )
			set stat = uar_srvsetdouble (hperson ,"sex_cd" ,dGenderCd )
			set stat = uar_srvsetdouble (hperson ,"language_cd" ,dLanguageCd)
			set stat = uar_srvsetdouble (hperson ,"marital_type_cd" ,dMaritalStatusCd )
			set stat = uar_srvsetdouble (hperson ,"religion_cd" ,dReligionCd )
			set stat = uar_srvsetstring (hperson ,"name_last" ,nullterm (sLastName ))
			set stat = uar_srvsetstring (hperson ,"name_first" ,nullterm (sFirstName ))
			set stat = uar_srvsetstring (hperson ,"name_middle" ,nullterm (sMiddleName))
			set stat = uar_srvsetdouble (hperson ,"vip_cd" ,dVipCd )
			set stat = uar_srvsetlong (hperson ,"birth_tz" ,curtimezoneapp )
			set stat = uar_srvsetstring (hperson ,"birth_tz_disp" ,nullterm(datetimezonebyindex(curtimezoneapp)))
			set stat = uar_srvsetdouble(hperson,"pre_person_id",115161_rep->seq_num)
			set stat = uar_srvsetdouble(hperson,"race_cd",dRaceCd)
            
            /*;;Dont need now since request entity only accepting one Race but keep in place if it expands
 			;Races
 			set raceSize = size(arglist->RaceIds,5)
 			if(raceSize > 0)
 				; If only one race cd, add to person table
 				if(raceSize = 1)
 					set stat = uar_srvsetdouble(hperson,"race_cd",cnvtreal(arglist->RaceIds[1]))
 
 				; If multiple race codes exist, add to race_list which updates the PERSON_CODE_VALUE_R table
 				else
 					for(rc = 1 to raceSize)
 						set dRaceCd = cnvtreal(arglist->RaceIds[rc])
 						set hrace = uar_srvadditem (hperson ,"race_list")
 						set stat = uar_srvsetdouble(hrace,"value_cd",dRaceCd)
 					endfor
 				endif
 			endif
            */
			;Patient - InterpreterCd
			set hpatient = uar_srvgetstruct (hperson ,"patient" )
			set stat = uar_srvsetdouble (hpatient ,"interp_required_cd" ,dInterpreterTypeCd )
 
			; Emails
			
			if(size(arglist->extendedinfo->Email) > 0)
				set hemail = uar_srvadditem (hperson ,"addresses" )
				set stat = uar_srvsetdouble (hemail ,"address_type_cd" ,uar_get_code_by("MEANING",212,"EMAIL"))
				set stat = uar_srvsetstring (hemail ,"street_addr" ,nullterm (arglist->extendedinfo->Email))
				set stat = uar_srvsetstring (hemail ,"parent_entity_name",nullterm("PERSON"))
			endif
 
			; Addresses
			set addrSize = size(arglist->extendedinfo->Addresses,5)
			if(addrSize > 0)
				declare addr_type_cd = f8
				declare dCountyCd = f8
				declare sCounty = vc
				declare dCountryCd = f8
				declare sCountry = vc
				declare dStateCd = f8
				for(addr = 1 to addrSize)
					;Validate Address Type Code
					set addr_type_cd = cnvtreal(arglist->extendedinfo->Addresses[addr].Address_Type_cd)
					set iRet = GetCodeSet(addr_type_cd)
					if(iRet != 212)
						call ErrorHandler2("VALIDATE", "F", "POST PATIENT", "Invalid Address Type Code.",
						"9999", build2("Invalid Addrss Type Code.: ",arglist->extendedinfo->Addresses[addr].Address_Type_cd), post_patient_reply_out)
						set iDeleteLock = 1
						go to EXIT_SCRIPT
					endif
 
					; Get Zipcode defaults
					if(arglist->extendedinfo->Addresses[addr].Zip > " ")
						set stat = initrec(114382_req)
						set stat = initrec(114382_rep)
						call GetZipDefaults(arglist->extendedinfo->Addresses[addr].Zip)
						set dCountyCd = 114382_rep->county_cd
						set sCounty = 114382_rep->county
						set dStateCd = 114382_rep->state_cd
					endif
 
					;Get Country
					if(arglist->extendedinfo->Addresses[addr].State > " " or dStateCd > 0)
						set dStateCd = uar_get_code_by("MEANING",62,trim(arglist->extendedinfo->Addresses[addr].State,3))
						select into "nl:"
						from code_value_group cvg
						, code_value cv
						plan cvg where cvg.child_code_value = dStateCd
						join cv where cv.code_value = cvg.parent_code_value
								and cv.code_set = 15
						detail
							dCountryCd = cv.code_value
							sCountry = cv.display
						with nocounter
					endif
 
					; Update request structure
					set haddr = uar_srvadditem(hperson,"addresses")
					if(haddr)
						set stat = uar_srvsetstring (haddr,"parent_entity_name",nullterm("PERSON"))
						set stat = uar_srvsetdouble(haddr,"address_type_cd",addr_type_cd)
						set stat = uar_srvsetstring(haddr,"street_addr",nullterm(trim(arglist->extendedinfo->Addresses[addr].Address1,3)))
						set stat = uar_srvsetstring(haddr,"street_addr2",nullterm(trim(arglist->extendedinfo->Addresses[addr].Address2,3)))
						set stat = uar_srvsetstring(haddr,"city",nullterm(trim(arglist->extendedinfo->Addresses[addr].City,3)))
						set stat = uar_srvsetstring(haddr,"state",nullterm(trim(arglist->extendedinfo->Addresses[addr].State,3)))
						set stat = uar_srvsetdouble(haddr,"state_cd",dStateCd)
						set stat = uar_srvsetstring(haddr,"zipcode",nullterm(trim(arglist->extendedinfo->Addresses[addr].Zip,3)))
						set stat = uar_srvsetstring(haddr,"county",nullterm(sCounty))
						set stat = uar_srvsetdouble(haddr,"county_cd",dCountyCd)
						set stat = uar_srvsetstring(haddr,"country",nullterm(sCountry))
						set stat = uar_srvsetdouble(haddr,"country_cd",dCountryCd)
 
					else
						call ErrorHandler2("EXECUTE", "F", "POST PATIENT", "Could not create HADDR.",
						"9999", "Could not create HADDR", post_patient_reply_out)
						set iDeleteLock = 1
						go to EXIT_SCRIPT
					endif
				endfor
			endif
 
			; Phones
			set phoneSize = size(arglist->extendedinfo->Phones,5)
			if(phoneSize > 0)
				declare phone_type_cd = f8
				for(ph = 1 to phoneSize)
					;Validate Phone Type Code
					set phone_type_cd = cnvtreal(arglist->extendedinfo->Phones[ph].Phone_type_cd)
					set iRet = GetCodeSet(phone_type_cd)
					if(iRet != 43)
						call ErrorHandler2("VALIDATE", "F", "POST PATIENT", "Invalid Phone Type Code.",
						"9999", build2("Invalid Phone Type Code.: ",arglist->extendedinfo->Phones[ph].Phone_type_cd), post_patient_reply_out)
						set iDeleteLock = 1
						go to EXIT_SCRIPT
					endif
					set hphone = uar_srvadditem(hperson,"phones")
					if(hphone)
						set stat = uar_srvsetstring(hphone,"parent_entity_name",nullterm("PERSON"))
						set stat = uar_srvsetdouble(hphone,"phone_type_cd",phone_type_cd)
						set stat = uar_srvsetdouble(hphone,"phone_format_cd",uar_get_code_by("MEANING",281,"DEFAULT"))
						set stat = uar_srvsetstring(hphone,"phone_num",nullterm(trim(arglist->extendedinfo->Phones[ph].Number,3)))
					else
						call ErrorHandler2("EXECUTE", "F", "POST PATIENT", "Could not create HPHONE.",
						"9999", "Could not create HPHONE.", post_patient_reply_out)
						set iDeleteLock = 1
						go to EXIT_SCRIPT
					endif
				endfor
			endif
/*;;;other known names not being sent in but keeping in place if request changes
			; Other Names
			set otherNameSize = size(arglist->OtherKnownNames,5)
			if(otherNameSize > 0)
				declare name_type_cd = f8
				declare name_type_mean = vc
				declare current_check = i2
				for(okn = 1 to otherNameSize)
					;Validate Name Type Code
					set name_type_cd = cnvtreal(arglist->OtherKnownNames[okn].TypeId)
					set iRet = GetCodeSet(name_type_cd)
					if(iRet != 213)
						call ErrorHandler2("VALIDATE", "F", "POST PATIENT", "Invalid OtherKnownName TypeId.",
						"9999", build2("Invalid OtherKnownName TypeId.: ",arglist->OtherKnownNames[okn].TypeId), post_patient_reply_out)
						go to EXIT_SCRIPT
					endif
					set name_type_mean = uar_get_code_meaning(name_type_cd)
					if(name_type_mean = "CURRENT")
						set current_check = 1
					endif
 					set hothername = uar_srvadditem(hperson,"person_names")
					if(hothername)
						set stat = uar_srvsetdouble (hothername,"name_type_cd", name_type_cd)
						set stat = uar_srvsetstring (hothername,"name_first",nullterm(trim(arglist->OtherKnownNames[okn].FirstName,3)))
						set stat = uar_srvsetstring (hothername,"name_middle",nullterm(trim(arglist->OtherKnownNames[okn].MiddleName,3)))
						set stat = uar_srvsetstring (hothername,"name_last",nullterm(trim(arglist->OtherKnownNames[okn].LastName,3)))
						set stat = uar_srvsetstring (hothername,"name_prefix",nullterm(trim(arglist->OtherKnownNames[okn].Prefix,3)))
						set stat = uar_srvsetstring (hothername,"name_suffix",nullterm(trim(arglist->OtherKnownNames[okn].Suffix,3)))
					else
						call ErrorHandler2("EXECUTE", "F", "POST PATIENT", "Could not create HOTHERNAME.",
						"9999", "Could not create HOTHERNAME", post_patient_reply_out)
						go to EXIT_SCRIPT
					endif
				endfor
 
 				;Current name is always sent regardless if added by consumer
				if(current_check = 0)
*/
					set hothername = uar_srvadditem(hperson,"person_names")
					if(hothername)
						set stat = uar_srvsetdouble (hothername,"name_type_cd", uar_get_code_by("MEANING",213,"CURRENT"))
						set stat = uar_srvsetstring (hothername,"name_first",nullterm(sFirstName))
						set stat = uar_srvsetstring (hothername,"name_middle",nullterm(sMiddleName))
						set stat = uar_srvsetstring (hothername,"name_last",nullterm(sLastName))
						set stat = uar_srvsetstring (hothername,"name_prefix",nullterm(sPrefix))
						set stat = uar_srvsetstring (hothername,"name_suffix",nullterm(sSuffix))
					else
						call ErrorHandler2("EXECUTE", "F", "POST PATIENT", "Could not create HOTHERNAME.",
						"9999", "Could not create HOTHERNAME", post_patient_reply_out)
						set iDeleteLock = 1
						go to EXIT_SCRIPT
					endif
;				endif
/*
			else
				;Current name is always sent regardless if added by consumer
				set hothername = uar_srvadditem(hperson,"person_names")
				if(hothername)
					set stat = uar_srvsetstring (hothername,"name_first",nullterm(sFirstName))
					set stat = uar_srvsetstring (hothername,"name_middle",nullterm(sMiddleName))
					set stat = uar_srvsetstring (hothername,"name_last",nullterm(sLastName))
					set stat = uar_srvsetstring (hothername,"name_prefix",nullterm(sPrefix))
					set stat = uar_srvsetstring (hothername,"name_suffix",nullterm(sSuffix))
				else
					call ErrorHandler2("EXECUTE", "F", "POST PATIENT", "Could not create HOTHERNAME.",
					"9999", "Could not create HOTHERNAME", post_patient_reply_out)
					go to EXIT_SCRIPT
				endif
			endif
*/
			; MRN
			if(dMRNAliasPoolCd > 0)
				set hmrn = uar_srvgetstruct(hperson,"mrn")
				set stat = uar_srvsetdouble(hmrn,"alias_pool_cd", dMRNAliasPoolCd)
				set stat = uar_srvsetdouble(hmrn,"person_alias_type_cd",uar_get_code_by("MEANING",4,"MRN"))
				set stat = uar_srvsetstring(hmrn,"alias",nullterm(sNextMRN))
			endif
 
			; CMRN
			if(dCMRNAliasPoolCd > 0)
				set hcmrn = uar_srvgetstruct(hperson,"cmrn")
				set stat = uar_srvsetdouble(hcmrn,"alias_pool_cd", dCMRNAliasPoolCd)
				set stat = uar_srvsetdouble(hcmrn,"person_alias_type_cd",uar_get_code_by("MEANING",4,"CMRN"))
				set stat = uar_srvsetstring(hcmrn,"alias",nullterm(sNextCMRN))
			endif
 
			; SSN
			if(sSSN > " ")
				set hssn = uar_srvgetstruct(hperson,"ssn")
				set stat = uar_srvsetdouble(hssn,"alias_pool_cd", dSSNAliasPoolCd)
				set stat = uar_srvsetdouble(hssn,"person_alias_type_cd",uar_get_code_by("MEANING",4,"SSN"))
				set stat = uar_srvsetstring(hssn,"alias",nullterm(sSSN))
			endif
 
 			; Execute request
			set crmstatus = uar_crmperform (hstep)
			if ((crmstatus = 0 ) )
				set hreply = uar_crmgetreply (hstep )
				if ((hreply > 0 ) )
					set dPersonId = uar_srvgetdouble (hreply ,"person_id" )
					set post_patient_reply_out->patient_id = dPersonId
					set hstatus_data = uar_srvgetstruct (hreply ,"status_data" )
					set status = uar_srvgetstringptr (hstatus_data ,"status" )
					if(status = "S")
						set iValidate = 1
					endif
				else
					set error_msg = "ERR: Reply = null"
					call ErrorHandler2("EXECUTE", "F", "POST PATIENT", error_msg,"9999", error_msg, post_patient_reply_out)
				endif
			else
				set error_msg = concat ("PERFORM=" ,cnvtstring (crmstatus ) )
				call ErrorHandler2("EXECUTE", "F", "POST PATIENT", error_msg,"9999", error_msg, post_patient_reply_out)
			endif
		endif
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("AddPerson Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
end ;End Sub
 
 
/*************************************************************************
;  Name: GetZipDefaults(zipcode = vc)	= null 114382 - PM_GET_ZIPCODE_DEFAULTS
;  Description: Gets data based on zipcode
**************************************************************************/
subroutine GetZipDefaults(zipcode)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetZipDefaults Begin",
		format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iApplication = 100000
	set iTask = 100003
	set iRequest = 114382
 
	;Set request params
	set 114382_req->zipcode = zipcode
 
 	;Execute request
	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",114382_req,"REC",114382_rep)
 
	if(iDebugFlag > 0)
		call echo(concat("GetZipDefaults Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: DeleteLock(null)	= null ;100082 - PM_LOCK_DEL_LOCKS
;  Description: Deletes the PM lock
**************************************************************************/
subroutine DeleteLock(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("DeleteLock Begin",
		format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iValidate = 0
	set iApplication = 100000
	set iTask = 100080
	set iRequest = 100082
 
	;Set request params
	set stat = alterlist(100082_req->person,1)
	set 100082_req->person[1].person_id = dPersonId
 
 	;Execute request
	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",100082_req,"REC",100082_rep)
 
	;Verify status
	if(100082_rep->status_data.status = "S")
		set iValidate = 1
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("DeleteLock Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
end ;End Sub
 
/*************************************************************************
;  Name: UpdatePhoneAddressData(null) = null
;  Description: Updates the active_ind and active_status_cd columns
**************************************************************************/
subroutine UpdatePhoneAddressData(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("UpdatePhoneAddressData Begin",
		format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	;Address Table
 	update into address
 		set
 		 active_ind = 1
 		,active_status_cd = c_active_active_status_cd
 		,active_status_dt_tm = cnvtdatetime(curdate,curtime3)
 		,active_status_prsnl_id = dPrsnlId
 		,data_status_prsnl_id = dPrsnlId
 		,updt_dt_tm = cnvtdatetime(curdate,curtime3)
 		,updt_id = dPrsnlId
 	where parent_entity_name = "PERSON"
 		and parent_entity_id = dPersonId
 
 	; Commit changes
 	commit
 
 	;Phone Table
 	update into phone
 		set
 		 active_ind = 1
 		,active_status_cd = c_active_active_status_cd
 		,active_status_dt_tm = cnvtdatetime(curdate,curtime3)
 		,active_status_prsnl_id = dPrsnlId
 		,data_status_prsnl_id = dPrsnlId
 		,updt_dt_tm = cnvtdatetime(curdate,curtime3)
 		,updt_id = dPrsnlId
 	where parent_entity_name = "PERSON"
 		and parent_entity_id = dPersonId
 
 	; Commit changes
 	commit
 
	if(iDebugFlag > 0)
		call echo(concat("UpdatePhoneAddressData Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: AddPreferredPharmacy(null)	 = null ;500727 - orm_add_custom_pat_pref_pharm
;  Description: Adds the preferred pharmacy
**************************************************************************/
/*
subroutine AddPreferredPharmacy(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("AddPreferredPharmacy Begin",
		format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iValidate = 0
	set iApplication = 600005
	set iTask = 500196
	set iRequest = 500727
 
	;Set request params
	set 500727_req->person_id = dPersonId
	set phaSize = size(arglist->PreferredPharmacies,5)
	set stat = alterlist(500727_req->pharmacies,phaSize)
	for(i = 1 to phaSize)
		set 500727_req->pharmacies[i].pharmacy_id_str = arglist->PreferredPharmacies[i]
	endfor
 
 	;Execute request
	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",500727_req,"REC",500727_rep)
 
	;Verify status
	if(500727_rep->status_data.status = "S")
		set iValidate = 1
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("AddPreferredPharmacy Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
end ;End Sub
*/
end go
set trace notranslatelock go
 
