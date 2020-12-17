/****************************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

*****************************************************************************
          Date Written:     03/12/18
          Source file name: vigilanz_post_patient
          Object name:      vigilanz_post_patient
          Program purpose:  Posts a person into Millennium
          Executing from:   EMISSARY SERVICES
************************************************************************
                   GENERATED MODIFICATION CONTROL LOG
************************************************************************
  Mod 	Date     	Engineer  	Comment
  --- 	------- 	--------- 	----------------------------------------
  001 	03/12/18	RJC			V2 Initial write
  002  	10/06/18    STV         Rewrite to fit V1 version
  003	02/07/18	RJC			Added alternative identifiers object to response
  004	04/10/19	RJC			Fixed issue with interpretercd
  005   11/09/19    STV         Additional fields added - AlternateNames, CustomFields, Extension, County, Country
  005   11/11/19    RJC         Code cleanup to match Put patient
  006	11/27/19	RJC			Added BirthGenderId
  007	12/19/19	RJC			Added phone format_cd, patient portal object
  008 	12/20/19	RJC			Changed AlternateNames object to AlternativeNames to match Emissary
  009	12/20/19	RJC			Fixed issue with written_format_cd in custom_fields
  010	01/07/20	RJC			Updated to use snsro_common_pm_obj framework
  011	01/21/20	RJC			Removed Address/Phone requirement
  012	02/03/20	RJC			Pulled written_format_cd from customFields into its own field
  013	02/04/20	RJC			Added StudentStatusId
  014	03/03/20	RJC			Added tel contact_method_cd to phones
  015	03/16/20	RJC			Added SystemId and Identity object - ability to post person aliases
************************************************************************/
 drop program vigilanz_post_patient go
create program vigilanz_post_patient
 
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
set sVersion = "1.21.6.2"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common
execute snsro_common_pm_obj
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
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
 
;Arglist
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
 	1 DeceasedDateTime = vc
 	1 SystemId = vc
 	1 Identities[*]
 		2 SubTypeId = vc
 		2 Value = vc
 	1 ExtendedInfo
 		2 BirthGenderId	= vc
 		2 Email = vc
 		2 Ethnicity = vc
 		2 Language = vc
 		2 Marital_Status = vc
 		2 NeedsInterpreter = vc
		2 Race = vc
		2 Religion = vc
		2 EducationLevelId = vc
		2 WrittenFormatId = vc
		2 StudentStatusId = vc
 		2 Addresses[*]
			3 Address1 = vc
			3 Address2 = vc
			3 City = vc
			3 State = vc
			3 Address_Type_cd = vc
			3 Zip = vc
			3 County = vc
			3 Country = vc
	    2 Phones[*]
			3 Number = vc
			3 Phone_type_cd = vc
			3 Extension = vc
			3 FormatId = vc
		2 AlternativeNames[*]
			3 NameTypeId = vc
			3 LastName = vc
		 	3 FirstName = vc
		 	3 MiddleName = vc
		 	3 Prefix = vc
		 	3 Suffix = vc
		 2 CustomFields[*]
		 	3 FieldId = vc
		 	3 ResponseValue = vc
		 2 PatientPortal
		 	3 ChallengeQuestionId  = vc
		 	3 ChallengeAnswer	= vc
)
 
free record post_patient_reply_out
record post_patient_reply_out(
  1 patient_id       	= f8
  1 alternative_identifiers[*]
  	2 code					= f8
  	2 description			= vc
  	2 value					= vc
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
; DECLARE VARIABLES
**************************************************************************/
; Inputs
free record input
record input (
	1 username 				= vc
	1 birthdate 			= dq8
	1 confidentiality_cd 	= f8
	1 deceased_date 		= dq8
	1 ethnicity_cd			= f8
	1 first_name			= vc
	1 last_name 			= vc
	1 middle_name			= vc
	1 prefix				= vc
	1 suffix				= vc
	1 gender_cd				= f8
	1 birth_gender_cd		= f8
	1 race_list[*]
		2 race_cd			= f8
	1 language_cd			= f8
	1 marital_status_cd		= f8
	1 religion_cd			= f8
	1 ssn					= vc
	1 vip_cd				= f8
	1 interpreter_cd		= f8
	1 email					= vc
	1 facility_cd			= f8
	1 education_level_cd	= f8
	1 written_format_cd		= f8
	1 student_cd			= f8
	1 addresses[*]
		2 address1 			= vc
		2 address2 			= vc
		2 city 				= vc
		2 state 			= vc
		2 state_cd			= f8
		2 address_type_cd 	= f8
		2 zip 				= vc
		2 county 			= vc
		2 county_cd 		= f8
		2 country 			= vc
		2 country_cd 		= f8
	1 phones[*]
		2 number 			= vc
		2 phone_type_cd 	= f8
		2 extension 		= vc
		2 format_cd			= f8
		2 contact_method_cd	= f8
	1 alternate_names[*]
		2 name_id			= f8
		2 name_type_cd 		= f8
		2 last_name			= vc
	 	2 first_name 		= vc
	 	2 middle_name 		= vc
	 	2 prefix 			= vc
	 	2 suffix 			= vc
	1 custom_fields[*]
		2 field_id 			= f8
		2 text_value 		= vc
		2 codeset			= i4
 		2 field				= vc
 		2 length			= i4
 		2 level				= vc
 		2 type				= vc
 		2 numeric_value		= f8
 		2 date_value		= dq8
	1 alias_pools[*]
		2 alias_type_cd		= f8
		2 alias				= vc
		2 alias_pool_cd		= f8
		2 next_alias		= vc
		2 dup_allowed_flag	= i2
		2 sys_assign_flag 	= i2
	1 portal
		2 challenge_question_cd = f8
		2 challenge_answer = vc
	1 contributor_system_cd = f8
	1 identities[*]
		2 alias = vc
		2 alias_pool_cd = f8
		2 alias_type_cd = f8
)
declare iDebugFlag				= i2 with protect, noconstant(0)
declare sJsonArgs				= gvc with protect, noconstant("")
declare sRaces					= vc with protect, noconstant("")
 
; Other
declare dPersonId				= f8 with protect, noconstant(0.0)
declare dPrsnlId				= f8 with protect, noconstant(0.0)
declare iDeleteLock				= i2 with protect, noconstant(0)
 
; Constants
declare c_error_handler					= vc with protect, constant("POST PATIENT")
declare c_now_dt_tm						= dq8 with protect, constant(cnvtdatetime(curdate,curtime3))
declare c_mrn_person_alias_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",4,"MRN"))
declare c_cmrn_person_alias_type_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",4,"CMRN"))
declare c_ssn_person_alias_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",4,"SSN"))
declare c_facility_location_type_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",222,"FACILITY"))
declare c_active_active_status_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",48,"ACTIVE"))
declare c_email_address_type_cd			= f8 with protect, constant(uar_get_code_by("MEANING",212,"EMAIL"))
declare c_send_invite_action_cd			= f8 with protect, constant(uar_get_code_by("MEANING",4352007,"SEND"))
declare c_mailto_contact_method_cd		= f8 with protect, constant(uar_get_code_by("MEANING",23056,"MAILTO"))
declare c_tel_contact_method_cd			= f8 with protect, constant(uar_get_code_by("MEANING",23056,"TEL"))
declare c_home_phone_type_cd			= f8 with protect, constant(uar_get_code_by("MEANING",43,"HOME"))
declare c_current_name_type_cd			= f8 with protect, constant(uar_get_code_by("MEANING",213,"CURRENT"))
declare c_userdefined_info_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",355,"USERDEFINED"))
declare c_multiple_race_cd				= f8 with protect, constant(uar_get_code_by("MEANING",282,"MULTIPLE"))
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
;Input
set iDebugFlag						= cnvtint($DEBUG_FLAG)
set sJsonArgs 						= trim($JSON_ARGS,3)
set jrec 							= cnvtjsontorec(sJsonArgs) ;This loads the arglist record
set input->facility_cd				= cnvtreal($FAC_ID)
set input->interpreter_cd 			= cnvtreal($INTERP_ID)
 
set input->username					= trim($USERNAME, 3)
set input->birthdate				= cnvtdatetime(arglist->BirthDateTime)
set input->confidentiality_cd  		= cnvtreal(arglist->ConfidentialityId)
set input->deceased_date  			= cnvtdatetime(arglist->DeceasedDateTime)
set input->ethnicity_cd 			= cnvtreal(arglist->ExtendedInfo->Ethnicity)
set input->first_name 				= trim(arglist->FirstName,3)
set input->middle_name   			= trim(arglist->MiddleName,3)
set input->last_name 				= trim(arglist->LastName,3)
set input->prefix 					= trim(arglist->Prefix,3)
set input->suffix 					= trim(arglist->Suffix)
set input->gender_cd				= cnvtreal(arglist->GenderId)
set input->language_cd				= cnvtreal(trim(arglist->ExtendedInfo->Language,3))
set input->marital_status_cd		= cnvtreal(arglist->ExtendedInfo->Marital_Status)
set input->religion_cd 				= cnvtreal(arglist->ExtendedInfo->Religion)
set input->ssn						= trim(arglist->SSN)
set input->vip_cd					= cnvtreal(arglist->VipId)
set input->email					= trim(arglist->ExtendedInfo.Email,3)
set input->education_level_cd		= cnvtreal(arglist->ExtendedInfo.EducationLevelId)
set sRaces							= trim(arglist->ExtendedInfo->Race,3)
set input->birth_gender_cd			= cnvtreal(arglist->ExtendedInfo->BirthGenderId)
set input->portal.challenge_question_cd = cnvtreal(arglist->ExtendedInfo.PatientPortal.ChallengeQuestionId)
set input->portal.challenge_answer 	= trim(arglist->ExtendedInfo.PatientPortal.ChallengeAnswer,3)
set input->written_format_cd 		= cnvtreal(arglist->ExtendedInfo.WrittenFormatId)
set input->student_cd				= cnvtreal(arglist->ExtendedInfo.StudentStatusId)
set input->contributor_system_cd	= cnvtreal(arglist->SystemId)
 
;Addresses
if(size(arglist->ExtendedInfo.Addresses,5) > 0)
	for(i = 1 to size(arglist->ExtendedInfo.Addresses,5))
		set stat = alterlist(input->addresses,i)
		set input->addresses[i].address_type_cd = cnvtreal(arglist->ExtendedInfo.Addresses[i].Address_Type_cd)
		set input->addresses[i].address1 = trim(arglist->ExtendedInfo.Addresses[i].Address1,3)
		set input->addresses[i].address2 = trim(arglist->ExtendedInfo.Addresses[i].Address2,3)
		set input->addresses[i].city = trim(arglist->ExtendedInfo.Addresses[i].City,3)
		set input->addresses[i].zip = trim(arglist->ExtendedInfo.Addresses[i].Zip,3)
 
		;State
		set input->addresses[i].state = trim(arglist->ExtendedInfo.Addresses[i].State,3)
		if(cnvtreal(input->addresses[i].state) > 0)
			set input->addresses[i].state_cd = cnvtreal(input->addresses[i].state)
		else
			set input->addresses[i].state_cd = uar_get_code_by("DISPLAYKEY",62,cnvtupper(input->addresses[i].state))
		endif
 
		;County
		set input->addresses[i].county = arglist->ExtendedInfo.Addresses[i].County
		if(cnvtreal(input->addresses[i].county) > 0)
			set input->addresses[i].county_cd = cnvtreal(input->addresses[i].county)
		else
			set input->addresses[i].county_cd = uar_get_code_by("DISPLAYKEY",74,cnvtupper(input->addresses[i].county))
		endif
 
		;Country
		set input->addresses[i].country = arglist->ExtendedInfo.Addresses[i].Country
		if(cnvtreal(input->addresses[i].country) > 0)
			set input->addresses[i].country_cd = cnvtreal(input->addresses[i].country)
		else
			set input->addresses[i].country_cd = uar_get_code_by("DISPLAYKEY",15,cnvtupper(input->addresses[i].country))
		endif
	endfor
endif
 
;Phones
if(size(arglist->ExtendedInfo.Phones,5) > 0)
	for(i = 1 to size(arglist->ExtendedInfo.Phones,5))
		set stat = alterlist(input->phones,i)
		set input->phones[i].phone_type_cd = cnvtreal(arglist->ExtendedInfo.Phones[i].Phone_type_cd)
		set input->phones[i].number = trim(arglist->ExtendedInfo.Phones[i].Number,3)
		set input->phones[i].extension = trim(arglist->ExtendedInfo.Phones[i].Extension,3)
		set input->phones[i].format_cd = cnvtreal(arglist->ExtendedInfo.Phones[i].FormatId)
	endfor
endif
 
;AlternativeNames
if(size(arglist->ExtendedInfo.AlternativeNames,5) > 0)
	for(i = 1 to size(arglist->ExtendedInfo.AlternativeNames,5))
		set stat = alterlist(input->alternate_names,i)
		set input->alternate_names[i].name_type_cd = cnvtreal(arglist->ExtendedInfo.AlternativeNames[i].NameTypeId)
		set input->alternate_names[i].first_name = trim(arglist->ExtendedInfo.AlternativeNames[i].FirstName,3)
		set input->alternate_names[i].middle_name = trim(arglist->ExtendedInfo.AlternativeNames[i].MiddleName,3)
		set input->alternate_names[i].last_name = trim(arglist->ExtendedInfo.AlternativeNames[i].LastName,3)
		set input->alternate_names[i].prefix = trim(arglist->ExtendedInfo.AlternativeNames[i].Prefix,3)
		set input->alternate_names[i].suffix = trim(arglist->ExtendedInfo.AlternativeNames[i].Suffix,3)
	endfor
endif
 
;Custom Fields
if(size(arglist->ExtendedInfo.CustomFields,5) > 0)
	for(i = 1 to size(arglist->ExtendedInfo.CustomFields,5))
		set stat = alterlist(input->custom_fields,i)
		set input->custom_fields[i].field_id = cnvtreal(arglist->ExtendedInfo.CustomFields[i].FieldId)
		set input->custom_fields[i].text_value = trim(arglist->ExtendedInfo.CustomFields[i].ResponseValue,3)
	endfor
endif
 
;Identities
if(size(arglist->Identities,5) > 0)
	for(i = 1 to size(arglist->Identities,5))
		set stat = alterlist(input->identities,i)
		set input->identities[i].alias = trim(arglist->Identities[i].Value,3)
		set input->identities[i].alias_pool_cd = cnvtreal(arglist->Identities[i].SubTypeId)
	endfor
endif
 
;Other
set dPrsnlId	= GetPrsnlIDfromUserName(input->username)
 
if(iDebugFlag)
	call echorecord(input)
	call echo(build("c_mrn_person_alias_type_cd-->",c_mrn_person_alias_type_cd))
	call echo(build("c_cmrn_person_alias_type_cd-->",c_cmrn_person_alias_type_cd))
	call echo(build("c_ssn_person_alias_type_cd-->",c_ssn_person_alias_type_cd))
	call echo(build("dPrsnlId-->",dPrsnlId))
	call echo(build("sRaces-->",sRaces))
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ErrorMsg(msg = vc, error_code = c4, type = vc) 	= null with protect
declare GetAliasPools(null)								= i2 with protect
declare ValidateInputParams(null)						= null with protect
declare GetNextPersonId(null)							= i2 with protect 	;115161 - pm_get_new_seq
declare GetNextMrn(alias_pool = f8, type = vc)			= i2 with protect 	;114327 - PM_GET_ALIAS
declare AddPerson(null)									= null with protect ;114609 - PM.UpdatePersonData
declare GetZipDefaults(zipcode = vc)					= null with protect ;114382 - PM_GET_ZIPCODE_DEFAULTS
declare UpdateTableData(null)					= null with protect
declare DeleteLock(null)								= i2 with protect 	;100082 - PM_LOCK_DEL_LOCKS
declare ReturnAltIdentifiers(null) 						= null with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
;Validate Username
set iRet = PopulateAudit(input->username, 0.0, post_patient_reply_out, sVersion)
if(iRet = 0) call ErrorMsg("UserId","1001","I") endif
 
; Get Alias Pools based on prsnl and facility
if(input->facility_cd > 0)
	set iRet = GetAliasPools(null)
	if(iRet = 0) call ErrorMsg("No alias pools found for user and/or facility.","9999","E") endif
else
	if(iRet = 0) call ErrorMsg("FacilityId.","9999","M") endif
endif
 
; Validate Input Parameters
call ValidateInputParams(null)
 
; Get Next PersonId sequence -- 115161 - pm_get_new_seq
set iRet = GetNextPersonId(null)
if(iRet = 0) call ErrorMsg("Could not retrieve PersonId sequence - 115161.","9999","E") endif
 
; Get Next MRN and/or CMRN sequence if needed -- 114327 - PM_GET_ALIAS
call GetNextMrn(null)
 
; Post Person
set iRet = AddPerson(null)
if(iRet = 0) call ErrorMsg("Could not post  person- 114609.","9999","E") endif
 
 ; Delete PM Lock -- 100082 - PM_LOCK_DEL_LOCKS
set iRet = DeleteLock(null)
if(iRet = 0) call ErrorMsg("Could not remove lock - 100082.","9999","E") endif
 
;Update Phone & Address data status codes
call UpdateTableData(null)
 
; Return Alternatived Identifiers
call ReturnAltIdentifiers(null)
 
;Set Audit to Successful
call ErrorHandler2("SUCCESS", "S", "POST PATIENT", "Process completed successfully.",
"0000", "Process completed successfully.", post_patient_reply_out)
 
#EXIT_SCRIPT
 
; Delete Lock - 100082
if(iDeleteLock)
	set iRet = DeleteLock(null)
	if(iRet = 0) call ErrorMsg("Could not delete patient lock (100082).","9999","E") endif
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
	call echorecord(post_patient_reply_out)
	call echo(JSONout)
endif
 
#EXIT_VERSION
/*************************************************************************
; SUBROUTINES
**************************************************************************/
 
/*************************************************************************
;  Name: ErrorMsg(msg = vc, error_code = c4, type = vc) = null
;  Description: This is a quick way to setup the error message and exit the script for input params
**************************************************************************/
subroutine ErrorMsg(msg, error_code, type)
	case (cnvtupper(type))
		of "M": ;Missing
			call ErrorHandler2(c_error_handler, "F", "Validate", build2("Missing required field: ",msg),
			error_code, build2("Missing required field: ",msg), post_patient_reply_out)
		of "I": ;Invalid
			call ErrorHandler2(c_error_handler, "F", "Validate", build2("Invalid input field: ",msg),
			error_code, build2("Invalid input field: ",msg), post_patient_reply_out)
		of "E": ;Execute
 			call ErrorHandler2(c_error_handler, "F", "Execute", msg, error_code, msg, post_patient_reply_out)
	endcase
 
	go to exit_script
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetAliasPools(null)	= null ;112505 - PM_GET_ALIAS_POOL
;  Description: Get Alias pool listing for the facility. This determines which pool to use for SSN and MRN
**************************************************************************/
subroutine GetAliasPools(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetAliasPools Begin",format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iValidate = 0
 
 	select into "nl:"
 	from prsnl_org_reltn por
 		, org_alias_pool_reltn oapr
 		, location l
 		, organization o
 		, alias_pool ap
 	plan por where por.person_id = dPrsnlId
 		and por.active_ind = 1
 		and por.beg_effective_dt_tm <= sysdate
 		and por.end_effective_dt_tm > sysdate
 	join oapr where oapr.organization_id = por.organization_id
 		and oapr.alias_entity_name = "PERSON_ALIAS"
 		and oapr.active_ind = 1
 		and oapr.beg_effective_dt_tm <= sysdate
 		and oapr.end_effective_dt_tm > sysdate
 	join l where l.location_cd = input->facility_cd
 		and l.organization_id = oapr.organization_id
 		and l.active_ind = 1
 		and l.beg_effective_dt_tm <= sysdate
 		and l.end_effective_dt_tm > sysdate
 	join o where o.organization_id = oapr.organization_id
 		and o.active_ind = 1
 		and o.beg_effective_dt_tm <= sysdate
 		and o.end_effective_dt_tm > sysdate
 	join ap where ap.alias_pool_cd = oapr.alias_pool_cd
 		and ap.active_ind = 1
 		and ap.beg_effective_dt_tm <= sysdate
 		and ap.end_effective_dt_tm > sysdate
 	order by oapr.alias_pool_cd
	head report
 		x = 0
	head oapr.alias_pool_cd
		iValidate = 1
 
		x = x + 1
		stat = alterlist(input->alias_pools,x)
 
		input->alias_pools[x].alias_pool_cd = oapr.alias_pool_cd
		input->alias_pools[x].alias_type_cd = oapr.alias_entity_alias_type_cd
		input->alias_pools[x].dup_allowed_flag = ap.dup_allowed_flag
		input->alias_pools[x].sys_assign_flag = ap.sys_assign_flag
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetAliasPools Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
	return(iValidate)
 
end ;End Sub
 
/*************************************************************************
;  Name: ValidateInputParams(null)	= null
;  Description: Validate input parameters
**************************************************************************/
subroutine ValidateInputParams(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateInputParams Begin",format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	;Validate Address data
	if(size(input->addresses,5) > 0)
		for(i = 1 to size(input->addresses,5))
			set iRet = GetCodeSet(input->addresses[i].address_type_cd)
			if(iRet != 212) call ErrorMsg("AddressTypeId","9999","I") endif
 
			; Get Zipcode defaults
			if(input->addresses[i].zip > " ")
				set stat = initrec(114382_req)
				set stat = initrec(114382_rep)
				call GetZipDefaults(input->addresses[i].zip)
				if(input->addresses[i].county_cd = 0)
					set input->addresses[i].county_cd = 114382_rep->county_cd
				endif
				if(input->addresses[i].county = "")
					set input->addresses[i].county = 114382_rep->county
				endif
				if(input->addresses[i].state_cd <= 0)
					set input->addresses[i].state_cd = 114382_rep->state_cd
				endif
			endif
 
			;Get Country
			if(input->addresses[i].country_cd = 0 or input->addresses[i].country = "")
				select into "nl:"
				from code_value_group cvg
				, code_value cv
				plan cvg where cvg.child_code_value = input->addresses[i].state_cd
				join cv where cv.code_value = cvg.parent_code_value
						and cv.code_set = 15
				detail
					if(input->addresses[i].country_cd <= 0)
						input->addresses[i].country_cd = cv.code_value
					endif
					if(input->addresses[i].country = "")
						input->addresses[i].country = cv.display
					endif
				with nocounter
			endif
 
			; Validate state_cd
			if(input->addresses[i].state_cd > 0)
				set iRet = GetCodeSet(input->addresses[i].state_cd)
				if(iRet != 62) call ErrorMsg("State","9999","I") endif
	 		endif
 
	 		;Validate county_cd
	 		if(input->addresses[i].county_cd > 0)
				set iRet = GetCodeSet(input->addresses[i].county_cd)
				if(iRet != 74) call ErrorMsg("County","9999","I") endif
	 		endif
 
	 		;Validate country_cd
	 		if(input->addresses[i].country_cd > 0)
				set iRet = GetCodeSet(input->addresses[i].country_cd)
				if(iRet != 15) call ErrorMsg("Country","9999","I") endif
	 		endif
		endfor
	endif
 
	;Validate Phone Exists and PhoneType is valid
	if(size(input->phones,5) > 0)
	 	for(i = 1 to size(input->phones,5))
			set iRet = GetCodeSet(input->phones[i].phone_type_cd)
			if(iRet != 43) call ErrorMsg("PhoneTypeId","9999","I") endif
 
			if(input->phones[i].format_cd > 0)
				set iRet = GetCodeSet(input->phones[i].format_cd)
				if(iRet != 281) call ErrorMsg("FormatId","9999","I") endif
			endif
		endfor
	endif
 
	;Validate Birthdate
	if(input->birthdate = 0 or input->birthdate > sysdate) call ErrorMsg("BirthDate","2037","I") endif
 
	; Validate SSN
	if(input->ssn > " ")
		set input->ssn = trim(replace(input->ssn,"-",""),3)
		if(textlen(input->ssn) != 9 or cnvtreal(input->ssn) = 0)
			call ErrorMsg("SSN","2069","I")
		endif
 
		set poolCnt = 0
		set aliasPool = 0
		set dup = 0
		select into "nl:"
		from (dummyt d with seq = size(input->alias_pools,5))
		plan d where input->alias_pools[d.seq].alias_type_cd = c_ssn_person_alias_type_cd
		head report
			x = 0
		detail
			x = x + 1
			aliasPool = input->alias_pools[d.seq].alias_pool_cd
			dup = input->alias_pools[d.seq].dup_allowed_flag
		foot report
			poolCnt = x
		with nocounter
 
		if(poolCnt > 1)
			call ErrorMsg("Multiple SSN Alias pools exist. Cannot update SSN.","9999","E")
		endif
 
	 	;Check for duplicates
	 		; Duplicates flag value meanings
		    ;	0.00	Duplicates are allowed
	        ;	1.00	Duplicates are allowed
	        ;	2.00	Duplicates are allowed but warn user
	        ;	3.00	Duplicates are not allowed
		if(dup = 3)
			set qualCnt = 0
			select into "nl:"
			from person_alias pa
			where pa.alias_pool_cd = aliasPool
				and pa.alias = input->ssn
				and pa.active_ind = 1
				and pa.beg_effective_dt_tm <= sysdate
				and pa.end_effective_dt_tm > sysdate
			detail
				qualCnt = qualCnt + 1
			with nocounter
 
			if(qualCnt > 0)
				call ErrorMsg("SSN already exists and duplicates are not allowed.","9999","E")
			endif
		endif
	endif
 
	; Validate Confidentiality
	if(input->confidentiality_cd > 0)
		set iRet = GetCodeSet(input->confidentiality_cd)
		if(iRet != 87) call ErrorMsg("ConfidentialityId","2063","I") endif
	endif
 
	; Validate DeceasedDate
	if(input->deceased_date > 0)
		if(input->deceased_date < input->birthdate or input->deceased_date > sysdate)
			call ErrorMsg("DeceasedDate","2064","I")
		endif
	endif
 
	; Validate Ethnicity
	if(input->ethnicity_cd > 0)
		set iRet = GetCodeSet(input->ethnicity_cd)
		if(iRet != 27) call ErrorMsg("EthnicityId","2068","I") endif
	endif
 
	; Validate FirstName
	if(input->first_name <= " ") call ErrorMsg("FirstName","2057","I") endif
 
	; Validate LastName
	if(input->last_name <= " ") call ErrorMsg("LastName","2058","I") endif
 
	; Validate Gender
	set iRet = GetCodeSet(input->gender_cd)
	if(iRet != 57) call ErrorMsg("Gender","2038","I") endif
 
	; Validate Birth Gender
	if(input->birth_gender_cd > 0)
		set iRet = GetCodeSet(input->birth_gender_cd)
		if(iRet != 56) call ErrorMsg("BirthGenderId","2038","I") endif
	endif
 
	; Validate Interpreter
	if(input->interpreter_cd > 0)
		set iRet = GetCodeSet(input->interpreter_cd)
		if(iRet != 329) call ErrorMsg("NeedsInterpreterId","2111","I") endif
	endif
 
	 ; Validate Language
	 if(input->language_cd > 0)
		set iRet = GetCodeSet(input->language_cd)
		if(iRet != 36) call ErrorMsg("LanguageId","2069","I") endif
	endif
 
	; Validate Marital Status
	if(input->marital_status_cd > 0)
		set iRet = GetCodeSet(input->marital_status_cd)
		if(iRet != 38) call ErrorMsg("MaritalStatusId","2072","I") endif
	endif
 
	; Validate Religion
	if(input->religion_cd > 0)
		set iRet = GetCodeSet(input->religion_cd)
		if(iRet != 49) call ErrorMsg("ReligionId","2070","I") endif
	endif
 
	; Validate Race
	if(sRaces > " ")
		declare notfnd 	= vc with constant("<not_found>")
		declare num 	= i4 with noconstant(1)
		declare str 	= vc with noconstant("")
 
		while (str != notfnd)
	     	set str =  piece(sRaces,',',num,notfnd)
	     	if(str != notfnd)
	      		set stat = alterlist(input->race_list, num)
	     		set input->race_list[num].race_cd = cnvtreal(str)
				set iRet = GetCodeSet(input->race_list[num].race_cd)
				if(iRet != 282) call ErrorMsg("RaceId","2071","I") endif
			endif
			set num = num + 1
		endwhile
	endif
 
	; Validate VIP
	if(input->vip_cd > 0)
		set iRet = GetCodeSet(input->vip_cd)
		if(iRet != 67) call ErrorMsg("VipId","2062","I") endif
	endif
 
 	;Validate Email
 	if(input->email > " ")
 		set found = findstring("@",input->email)
 		if(found < 0) call ErrorMsg("Email","9999","I") endif
 	endif
 
 	;Validate Name Type
 	set nameSize = size(input->alternate_names,5)
 	if(nameSize > 0)
 		for(i = 1 to nameSize)
 			set iRet = GetCodeSet(input->alternate_names[i].name_type_cd)
 			if(iRet != 213) call ErrorMsg("NameTypeId","9999","I") endif
 		endfor
 	endif
 
 	;Validate FacilityId
 	set iRet = 0
 	select into "nl:"
 	from location l
 	where l.location_cd = input->facility_cd
 		and l.location_type_cd = value(uar_get_code_by("MEANING",222,"FACILITY"))
 		and l.active_ind = 1
 		and l.beg_effective_dt_tm <= sysdate
 		and l.end_effective_dt_tm > sysdate
 	detail
 		iRet = 1
 	with nocounter
 
 	if(iRet = 0) call ErrorMsg("FacilityId","9999","I") endif
 
 	;Validate Education Level
 	if(input->education_level_cd > 0)
 		set iRet = GetCodeSet(input->education_level_cd)
 		if(iRet != 284) call ErrorMsg("EducationLevelId","9999","I") endif
 	endif
 
 	;Validate WrittenFormatId
 	if(input->written_format_cd > 0)
 		set iRet = GetCodeSet(input->written_format_cd)
 		if(iRet != 4000760)call ErrorMsg("WrittenFormatId","9999","I") endif
 	endif
 
 	;Validate StudentStatusId
 	if(input->student_cd > 0)
 		set iRet = GetCodeSet(input->student_cd)
 		if(iRet != 287) call ErrorMsg("StudentStatusId","9999","I") endif
 	endif
 
 	;Validate SystemId
 	if(input->contributor_system_cd > 0)
 		set iRet = GetCodeSet(input->contributor_system_cd)
 		if(iRet != 89) call ErrorMsg("SystemId","9999","I") endif
 	endif
 
 	;Validate Identities
 	if(size(input->identities,5) > 0)
 		for(i = 1 to size(input->identities,5))
 			set check = 0
			set aliasPool = 0
			set dup = 0
 
			select into "nl:"
			from (dummyt d with seq = size(input->alias_pools,5))
			plan d where input->alias_pools[d.seq].alias_pool_cd = input->identities[i].alias_pool_cd
			head report
				x = 0
			detail
				x = x + 1
				dup = input->alias_pools[d.seq].dup_allowed_flag
				input->identities[i].alias_type_cd = input->alias_pools[d.seq].alias_type_cd
			foot report
				check = x
			with nocounter
 
			if(check = 0)
				call ErrorMsg("User doesn't have access to Identities.SubTypeId.","9999","E")
			endif
 
		 	;Check for duplicates
		 		; Duplicates flag value meanings
			    ;	0.00	Duplicates are allowed
		        ;	1.00	Duplicates are allowed
		        ;	2.00	Duplicates are allowed but warn user
		        ;	3.00	Duplicates are not allowed
			if(dup = 3)
				set qualCnt = 0
				select into "nl:"
				from person_alias pa
				where pa.alias_pool_cd = input->identities[i].alias_pool_cd
					and pa.alias = input->identities[i].alias
					and pa.active_ind = 1
					and pa.beg_effective_dt_tm <= sysdate
					and pa.end_effective_dt_tm > sysdate
				detail
					qualCnt = qualCnt + 1
				with nocounter
 
				if(qualCnt > 0)
					call ErrorMsg("Identity.Value already exists and duplicates are not allowed.","9999","E")
				endif
			endif
 		endfor
 	endif
 
 	;Validate custom fields
 	set customSize = size(input->custom_fields,5)
 	if(customSize > 0)
 		declare temp_date = vc
 		declare temp_time = vc
 		declare date_format = vc
 
 		for(i = 1 to customSize)
 			set iRet = GetCodeSet(input->custom_fields[i].field_id)
 			if(iRet = 356)
 				select into "nl:"
 				from code_value_extension cve
 				where cve.code_value = input->custom_fields[i].field_id
 				detail
 					case(cve.field_name)
 						of "CODE_SET": input->custom_fields[i].codeset = cnvtint(cve.field_value)
 						of "FIELD": input->custom_fields[i].field = trim(cve.field_value,3)
 						of "LENGTH": input->custom_fields[i].length = cnvtint(cve.field_value)
 						of "LEVEL": input->custom_fields[i].level = trim(cve.field_value,3)
 						of "TYPE": input->custom_fields[i].type = trim(cve.field_value,3)
					endcase
				with nocounter
 
 				if(input->custom_fields[i].level != "PERSON")
 					call ErrorMsg("CustomFieldId","9999","I")
 				else
	 				;Validate fieldtype CODE
					if(input->custom_fields[i].type = "CODE")
						set input->custom_fields[i].numeric_value = cnvtreal(input->custom_fields[i].text_value)
						if(input->custom_fields[i].numeric_value > 0)
	 						set iRet = GetCodeSet(input->custom_fields[i].numeric_value)
	 						if(iRet != input->custom_fields[i].codeset)
	 							call ErrorMsg(build2(input->custom_fields[i].field_id,
	 							" FieldId requires a coded value from codeset ", input->custom_fields[i].codeset),"9999","E")
	 						endif
						else
							call ErrorMsg(build2(input->custom_fields[i].field_id," FieldId requires a coded value."),"9999","E")
						endif
					endif
 
					;Validate fieldtype STRING
					if(input->custom_fields[i].type = "STRING")
						if(input->custom_fields[i].length > 0 and
						   textlen(input->custom_fields[i].text_value) > input->custom_fields[i].length)
 
						   call ErrorMsg(build2(input->custom_fields[i].field_id,
						   " FieldId has a max length of ",input->custom_fields[i].length ),"9999","E")
						endif
					endif
 
					;Validate fieldtype DATE
					if(input->custom_fields[i].type = "DATE")
					 	set temp_date = ""
	 					set temp_time = ""
	 					set date_format = ""
 
						set input->custom_fields[i].text_value = replace(input->custom_fields[i].text_value,"T"," ")
						set checkSpace = findstring(" ",input->custom_fields[i].text_value)
						if(checkSpace = 0)
							set temp_date = input->custom_fields[i].text_value
						else
							set temp_date = substring(1,checkSpace,input->custom_fields[i].text_value)
							set temp_time = substring(checkSpace + 1, textlen(input->custom_fields[i].text_value),
							input->custom_fields[i].text_value)
						endif
 
						set temp_date = trim(replace(temp_date,"/",""),3)
						set temp_time = trim(replace(temp_time,":",""),3)
 
						if(cnvtdate2(temp_date,"MMDDYY") != 0)
							set date_format = "MMDDYY"
						elseif(cnvtdate2(temp_date,"MMDDYYYY") != 0)
							set date_format = "MMDDYYYY"
						elseif(cnvtdate2(temp_date,"YYYYMMDD") != 0)
							set date_format = "YYYYMMDD"
						else
						   	call ErrorMsg(build2("Invalid Date format for Custom FieldId: ",input->custom_fields[i].field_id),"9999","E")
						endif
 
						if(temp_time > " ")
							if(textlen(temp_time) = 4)
								if(cnvtreal(temp_time) >= 2400)
									call ErrorMsg(build2("Invalid DateTime format for Custom FieldId: ",input->custom_fields[i].field_id),"9999","E")
								endif
							elseif(textlen(temp_time) = 6)
								if(cnvtreal(temp_time) >= 240000)
									call ErrorMsg(build2("Invalid DateTime format for Custom FieldId: ",input->custom_fields[i].field_id),"9999","E")
								endif
							else
								call ErrorMsg(build2("Invalid DateTime format for Custom FieldId: ",input->custom_fields[i].field_id),"9999","E")
							endif
						else
							set temp_time = "0"
						endif
 
						set input->custom_fields[i].date_value = cnvtdatetime(cnvtdate2(temp_date,date_format),cnvtint(temp_time))
					endif
 
					;Validate fieldtype NUMERIC
					if(input->custom_fields[i].type = "NUMERIC")
						if(cnvtreal(input->custom_fields[i].text_value) = 0)
							call ErrorMsg(build2(input->custom_fields[i].field_id," FieldId is a numeric field." ),"9999","E")
						else
							if(texlen(input->custom_fields[i].text_value) > input->custom_fields[i].length)
								call ErrorMsg(build2(input->custom_fields[i].field_id,
						   		" FieldId has a max length of ",input->custom_fields[i].length ),"9999","E")
							endif
 
							set input->custom_fields[i].numeric_value = cnvtreal(input->custom_fields[i].text_value)
						endif
					endif
				endif
 			else
 				call ErrorMsg("CustomFieldId","9999","I")
 			endif
 		endfor
 	endif
 
 	;Validate Challenge Question
 	if(input->portal.challenge_question_cd > 0)
 		set iRet = GetCodeSet(input->portal.challenge_question_cd)
 		if(iRet != 4003353) call ErrorMsg("ChallengeQuestionId","9999","E") endif
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("ValidateInputParams Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetZipDefaults(zipcode = vc)	= null 114382 - PM_GET_ZIPCODE_DEFAULTS
;  Description: Gets data based on zipcode
**************************************************************************/
subroutine GetZipDefaults(zipcode)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetZipDefaults Begin",format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
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
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetNextPersonId(null)	= null  ;115161 - pm_get_new_seq
;  Description: Gets the next person_id sequence for the person table
**************************************************************************/
subroutine GetNextPersonId(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetNextPersonId Begin",format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
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
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
	return(iValidate)
end ;End Sub
 
/*************************************************************************
;  Name: GetNextMrn(null)		= null ;114327 - PM_GET_ALIAS
;  Description: Gets the next MRN sequence in the alias pool
**************************************************************************/
subroutine GetNextMrn(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetNextMrn Begin",format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	for(i = 1 to size(input->alias_pools,5))
 		if(	input->alias_pools[i].sys_assign_flag = 1 and
 		   	input->alias_pools[i].alias_type_cd in (c_mrn_person_alias_type_cd, c_cmrn_person_alias_type_cd))
 
		 	;Initialize 114327 record structures
		 	set stat = initrec(114327_req)
		 	set stat = initrec(114327_rep)
 
		 	set iValidate = 0
			set iApplication = 100000
			set iTask = 100000
			set iRequest = 114327
 
			;Set request params
			set 114327_req->alias_pool_cd = input->alias_pools[i].alias_pool_cd
			set 114327_req->action_type = "NEW"
			set 114327_req->seq_type_name = "DEFAULT"
 
		 	;Execute request
			set stat = tdbexecute(iApplication, iTask, iRequest,"REC",114327_req,"REC",114327_rep)
 
			;Verify status
			if(114327_rep->status_data.status = "S")
				set input->alias_pools[i].next_alias = nullterm(trim(114327_rep->alias_info[1].alias,3))
			else
				call ErrorMsg("Could not retrieve next MRN sequence - 114327.","9999","E")
			endif
		endif
 	endfor
 
	if(iDebugFlag > 0)
		call echo(concat("GetNextMrn Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: AddPerson(null) = null  ;114609 - PM.UpdatePersonData
;  Description: Post the Person
**************************************************************************/
subroutine AddPerson(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("AddPerson Begin",format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	; Transaction Info
	set pm_obj_req->transaction_type = 100 ;100 = create person
	set pm_obj_req->transaction_info.prsnl_id = dPrsnlId
	set pm_obj_req->transaction_info.trans_dt_tm = cnvtdatetime(c_now_dt_tm)
 
	; Person
	set pm_obj_req->person.person.person_id = 0.0
	set pm_obj_req->person.person.new_person_ind = 1
	set pm_obj_req->person.person.create_prsnl_id = dPrsnlId
	set pm_obj_req->person.person.birth_dt_tm = input->birthdate
	set pm_obj_req->person.person.confid_level_cd = input->confidentiality_cd
	set pm_obj_req->person.person.deceased_dt_tm = input->deceased_date
	set pm_obj_req->person.person.ethnic_grp_cd = input->ethnicity_cd
	set pm_obj_req->person.person.sex_cd = input->gender_cd
	set pm_obj_req->person.person.language_cd = input->language_cd
	set pm_obj_req->person.person.marital_type_cd = input->marital_status_cd
	set pm_obj_req->person.person.religion_cd = input->religion_cd
	set pm_obj_req->person.person.name_last = input->last_name
	set pm_obj_req->person.person.name_first = input->first_name
	set pm_obj_req->person.person.name_middle = input->middle_name
	set pm_obj_req->person.person.vip_cd = input->vip_cd
	set pm_obj_req->person.person.birth_tz = curtimezoneapp
	set pm_obj_req->person.person.birth_tz_disp = datetimezonebyindex(curtimezoneapp)
	set pm_obj_req->person.person.pre_person_id = 115161_rep->seq_num
 	set pm_obj_req->person.person.contributor_system_cd = input->contributor_system_cd
 
	;Patient - InterpreterCd
	set pm_obj_req->person.person_patient.interp_required_cd = input->interpreter_cd
	set pm_obj_req->person.person_patient.written_format_cd = input->written_format_cd
	set pm_obj_req->person.person_patient.highest_grade_complete_cd = input->education_level_cd
	set pm_obj_req->person.person_patient.birth_sex_cd = input->birth_gender_cd
	set pm_obj_req->person.person_patient.student_cd = input->student_cd
 
	;Races
 	set raceSize = size(input->race_list,5)
 	if(raceSize > 0)
 		; Person table change
 		if(raceSize = 1)
 			set pm_obj_req->person.person.race_cd = cnvtreal(input->race_list[1].race_cd)
 		else
 			set pm_obj_req->person.person.race_cd = c_multiple_race_cd
 		endif
 
 		; If multiple race codes exist, add to race_list which updates the PERSON_CODE_VALUE_R table
		set pm_obj_req->person.person.race_list_ind = 1
 		set stat = alterlist(pm_obj_req->person.person.race_list,raceSize)
 		for(rc = 1 to raceSize)
 			set pm_obj_req->person.person.race_list[rc].value_cd = input->race_list[rc].race_cd
 		endfor
 	else
 		set pm_obj_req->person.person.race_cd = 0.0
 		set stat = alterlist(pm_obj_req->person.person.race_list,raceSize)
 	endif
 
	; Emails
	if(textlen(input->email) > 0)
		set stat = alterlist(pm_obj_req->person.address,1)
		set pm_obj_req->person.address[1].address_type_cd = c_email_address_type_cd
		set pm_obj_req->person.address[1].street_addr = input->email
		set pm_obj_req->person.address[1].parent_entity_name = "PERSON"
 
		set stat = alterlist(pm_obj_req->person.phone,1)
		set pm_obj_req->person.phone[1].phone_type_cd = c_home_phone_type_cd
		set pm_obj_req->person.phone[1].phone_num = input->email
		set pm_obj_req->person.phone[1].email = input->email
		set pm_obj_req->person.phone[1].contact_method_cd = c_mailto_contact_method_cd
	endif
 
	; Addresses
	set addrSize = size(input->addresses,5)
	if(addrSize > 0)
		for(addr = 1 to addrSize)
			set aSize = size(pm_obj_req->person.address,5) + 1
			set stat = alterlist(pm_obj_req->person.address,aSize)
 
			set pm_obj_req->person.address[aSize].parent_entity_name = "PERSON"
			set pm_obj_req->person.address[aSize].address_type_cd = input->addresses[addr].address_type_cd
			set pm_obj_req->person.address[aSize].street_addr = input->addresses[addr].address1
			set pm_obj_req->person.address[aSize].street_addr2 = input->addresses[addr].address2
			set pm_obj_req->person.address[aSize].city = input->addresses[addr].city
			set pm_obj_req->person.address[aSize].state = input->addresses[addr].state
			set pm_obj_req->person.address[aSize].state_cd = input->addresses[addr].state_cd
			set pm_obj_req->person.address[aSize].zipcode = input->addresses[addr].zip
			set pm_obj_req->person.address[aSize].county = input->addresses[addr].county
			set pm_obj_req->person.address[aSize].county_cd = input->addresses[addr].county_cd
			set pm_obj_req->person.address[aSize].country = input->addresses[addr].country
			set pm_obj_req->person.address[aSize].country_cd = input->addresses[addr].country_cd
		endfor
	endif
 
	; Phones
	set phoneSize = size(input->phones,5)
	if(phoneSize > 0)
		for(ph = 1 to phoneSize)
			set pSize = size(pm_obj_req->person.phone,5) + 1
			set stat = alterlist(pm_obj_req->person.phone,pSize)
 
			set pm_obj_req->person.phone[pSize].parent_entity_name = "PERSON"
			set pm_obj_req->person.phone[pSize].phone_type_cd = input->phones[ph].phone_type_cd
			set pm_obj_req->person.phone[pSize].phone_format_cd = input->phones[ph].format_cd
			set pm_obj_req->person.phone[pSize].phone_num = input->phones[ph].number
			set pm_obj_req->person.phone[pSize].extension = input->phones[ph].extension
			set pm_obj_req->person.phone[pSize].contact_method_cd = c_tel_contact_method_cd
		endfor
	endif
 
	; Alternate Names
	set current_check = 0
	set altnameSize = size(input->alternate_names,5)
	if(altnameSize > 0)
		for(a = 1 to altnameSize)
			if(input->alternate_names[a].name_type_cd = c_current_name_type_cd)
				set current_check = 1
			endif
 
 			set stat = alterlist(pm_obj_req->person.person_name,a)
 
			set pm_obj_req->person.person_name[a].name_type_cd = input->alternate_names[a].name_type_cd
			set pm_obj_req->person.person_name[a].name_first = input->alternate_names[a].first_name
			set pm_obj_req->person.person_name[a].name_middle = input->alternate_names[a].middle_name
			set pm_obj_req->person.person_name[a].name_last = input->alternate_names[a].last_name
			set pm_obj_req->person.person_name[a].name_prefix = input->alternate_names[a].prefix
			set pm_obj_req->person.person_name[a].name_suffix = input->alternate_names[a].suffix
			set pm_obj_req->person.person_name[a].updt_id = dPrsnlId
		endfor
	endif
 
 	;Current name is always sent regardless if added by consumer
	if(current_check = 0)
		set a = size(pm_obj_req->person.person_name,5) + 1
		set stat = alterlist(pm_obj_req->person.person_name,a)
 
		set pm_obj_req->person.person_name[a].name_type_cd = c_current_name_type_cd
		set pm_obj_req->person.person_name[a].name_first = input->first_name
		set pm_obj_req->person.person_name[a].name_middle = input->middle_name
		set pm_obj_req->person.person_name[a].name_last = input->last_name
		set pm_obj_req->person.person_name[a].name_prefix = input->prefix
		set pm_obj_req->person.person_name[a].name_suffix = input->suffix
		set pm_obj_req->person.person_name[a].updt_id = dPrsnlId
	endif
 
	; Add MRN, CMRN & SSN if not already defined for this facility
	for(i = 1 to size(input->alias_pools,5))
		;MRN & CMRN
		if(input->alias_pools[i].next_alias > " " and
			input->alias_pools[i].alias_type_cd in (c_mrn_person_alias_type_cd,c_cmrn_person_alias_type_cd))
			set aliasSize = size(pm_obj_req->person.person_alias,5) + 1
			set stat = alterlist(pm_obj_req->person.person_alias,aliasSize)
 
			set pm_obj_req->person.person_alias[aliasSize].alias_pool_cd = input->alias_pools[i].alias_pool_cd
			set pm_obj_req->person.person_alias[aliasSize].person_alias_type_cd = input->alias_pools[i].alias_type_cd
			set pm_obj_req->person.person_alias[aliasSize].alias = input->alias_pools[i].next_alias
		endif
 
		;SSN
		if(input->ssn > " " and input->alias_pools[i].alias_type_cd = c_ssn_person_alias_type_cd)
			set aliasSize = size(pm_obj_req->person.person_alias,5) + 1
			set stat = alterlist(pm_obj_req->person.person_alias,aliasSize)
 
			set pm_obj_req->person.person_alias[aliasSize].alias_pool_cd = input->alias_pools[i].alias_pool_cd
			set pm_obj_req->person.person_alias[aliasSize].person_alias_type_cd = input->alias_pools[i].alias_type_cd
			set pm_obj_req->person.person_alias[aliasSize].alias = input->ssn
		endif
	endfor
 
	;Add additional identities
	if(size(input->identities,5) > 0)
		for(i = 1 to size(input->identities,5))
			set aliasSize = size(pm_obj_req->person.person_alias,5) + 1
			set stat = alterlist(pm_obj_req->person.person_alias,aliasSize)
 
			set pm_obj_req->person.person_alias[aliasSize].alias_pool_cd = input->identities[i].alias_pool_cd
			set pm_obj_req->person.person_alias[aliasSize].person_alias_type_cd = input->identities[i].alias_type_cd
			set pm_obj_req->person.person_alias[aliasSize].alias = input->identities[i].alias
		endfor
	endif
 
	;User Defined Fields
	set customSize = size(input->custom_fields,5)
	if(customSize > 0)
		for(c = 1 to customSize)
			if(input->custom_fields[c].level > " ")
				set uSize = size(pm_obj_req->person.person_info,5) + 1
				set stat = alterlist(pm_obj_req->person.person_info,uSize)
 
		 		set pm_obj_req->person.person_info[uSize].info_sub_type_cd = input->custom_fields[c].field_id
		 		set pm_obj_req->person.person_info[uSize].info_type_cd = c_userdefined_info_type_cd
				case(input->custom_fields[c].type)
					of "STRING": set pm_obj_req->person.person_info[uSize].long_text = input->custom_fields[c].text_value
					of "DATE": 	set pm_obj_req->person.person_info[uSize].value_dt_tm = input->custom_fields[c].date_value
					of "CODE": 	set pm_obj_req->person.person_info[uSize].value_cd = input->custom_fields[c].numeric_value
					of "NUMERIC": 	set pm_obj_req->person.person_info[uSize].value_numeric = input->custom_fields[c].numeric_value
				endcase
			endif
		endfor
	endif
 
	;Person Portal Invite
	if(input->portal.challenge_question_cd > 0)
		set pm_obj_req->person.person_portal_invite.challenge_question_cd = input->portal.challenge_question_cd
		set pm_obj_req->person.person_portal_invite.challenge_answer_txt = input->portal.challenge_answer
		set pm_obj_req->person.person_portal_invite.invite_action_cd = c_send_invite_action_cd
	endif
 
 	; Execute Request
 	call UpdatePersonData(null)
 
 	set iDeleteLock = 1
 	set dPersonId = pm_obj_rep->person_id
 
 	if(pm_obj_rep->status_data.status = "S")
 		set iValidate = 1
 		set post_patient_reply_out->patient_id = pm_obj_rep->person_id
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("AddPerson Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
	return(iValidate)
end ;End Sub
 
/*************************************************************************
;  Name: DeleteLock(null)	= null ;100082 - PM_LOCK_DEL_LOCKS
;  Description: Deletes the PM lock
**************************************************************************/
subroutine DeleteLock(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("DeleteLock Begin",format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
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
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
	return(iValidate)
end ;End Sub
 
/*************************************************************************
;  Name: UpdateTableData(null) = null
;  Description: Updates the active_ind and active_status_cd columns for address and phone
				Updates contributor_system_cd column on person table if systemId provided
**************************************************************************/
subroutine UpdateTableData(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("UpdateTableData Begin",format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	;Address Table
	set address_check = 0
	select into "nl:"
	from address a
	where a.parent_entity_name = "PERSON"
 		and a.parent_entity_id = dPersonId
 		and a.active_status_cd = value(uar_get_code_by("MEANING",48,"SUSPENDED"))
 		and a.updt_dt_tm > cnvtlookbehind("20,S")
 	detail
 		address_check = 1
 	with nocounter
 
 	if(address_check)
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
	 		and active_status_cd = value(uar_get_code_by("MEANING",48,"SUSPENDED"))
	 		and updt_dt_tm > cnvtlookbehind("20,S")
 
	 	; Commit changes
	 	commit
	 endif
 
 	;Phone Table
 	set phone_check = 0
 	select into "nl:"
 	from phone p
 	where p.parent_entity_name = "PERSON"
 		and p.parent_entity_id = dPersonId
 		and p.active_status_cd = value(uar_get_code_by("MEANING",48,"SUSPENDED"))
 		and p.updt_dt_tm > cnvtlookbehind("20,S")
 	detail
 		phone_check = 1
 	with nocounter
 
 	if(phone_check)
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
	 		and active_status_cd = value(uar_get_code_by("MEANING",48,"SUSPENDED"))
	 		and updt_dt_tm > cnvtlookbehind("20,S")
 
	 	; Commit changes
	 	commit
	 endif
	 
	;Systemid
	if(input->contributor_system_cd > 0)
		update into person 
			set 
			 updt_dt_tm = cnvtdatetime(curdate,curtime3)
	 		,updt_id = dPrsnlId
	 		,contributor_system_cd = input->contributor_system_cd
	 	where person_id = dPersonId
	 	;Commit changes
	 	commit
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("UpdateTableData Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: ReturnAltIdentifiers(null) = null
;  Description: Return all aliases for a person
**************************************************************************/
subroutine ReturnAltIdentifiers(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ReturnAltIdentifiers Begin",format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	select into "nl:"
	from person_alias pa
	where pa.person_id = dPersonId
		and pa.active_ind = 1
		and pa.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and pa.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
		and pa.active_status_cd = value(uar_get_code_by("MEANING",48,"ACTIVE"))
	head report
		x = 0
	detail
		x = x + 1
		stat = alterlist(post_patient_reply_out->alternative_identifiers,x)
 
		post_patient_reply_out->alternative_identifiers[x].code = pa.person_alias_type_cd
		post_patient_reply_out->alternative_identifiers[x].description = uar_get_code_display(pa.person_alias_type_cd)
		post_patient_reply_out->alternative_identifiers[x].value = pa.alias
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("ReturnAltIdentifiers Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
end go
set trace notranslatelock go