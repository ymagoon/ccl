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
          Date Written:     11/26/19
          Source file name: vigilanz_post_person
          Object name:      vigilanz_post_person
          Program purpose:  Posts a person into Millennium
          Executing from:   EMISSARY SERVICES
************************************************************************
                   GENERATED MODIFICATION CONTROL LOG
************************************************************************
  Mod 	Date     	Engineer  	Comment
  --- 	------- 	--------- 	----------------------------------------
  001 	11/26/19	RJC			Initial write
  002	12/19/19	RJC			Added personTypeId parameter
  003 	01/21/19	RJC			Removed Address/Phone requirement
  004	03/16/20	RJC			Added SystemId and Identity object - ability to post person aliases
************************************************************************/
 drop program vigilanz_post_person go
create program vigilanz_post_person
 
prompt
		"Output to File/Printer/MINE" = "MINE" 	;Required
		, "Username" = ""        				;Required
		, "JSON Args" = ""						;Required
		, "DebugFlag" = ""						;Optional
 
with OUTDEV, USERNAME, JSON_ARGS, DEBUG_FLAG
 
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
	1 PersonTypeId = vc
 	1 LastName = vc
 	1 FirstName = vc
 	1 MiddleName = vc
 	1 Prefix = vc
 	1 Suffix = vc
 	1 GenderId = vc
 	1 BirthDateTime = vc
 	1 DeceasedDateTime= vc
 	1 ConfidentialityId = vc
 	1 VipId = vc
 	1 FacilityId = vc
 	1 SystemId = vc
 	1 Identities[*]
 		2 SubTypeId = vc
 		2 Value = vc
 	1 ExtendedInfo
 		2 Email = vc
 		2 EthnicityId = vc
 		2 LanguageId = vc
 		2 MaritalStatusId = vc
		2 RaceIds = vc
		2 ReligionId = vc
 		2 Addresses[*]
			3 Address1 = vc
			3 Address2 = vc
			3 City = vc
			3 State = vc
			3 TypeId = vc
			3 Zip = vc
			3 County = vc
			3 Country = vc
	    2 Phones[*]
			3 Number = vc
			3 TypeId = vc
			3 Extension = vc
			3 FormatId	= vc
)
 
free record post_person_reply_out
record post_person_reply_out(
  1 person_id      			= f8
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
	1 person_type_cd		= f8
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
	1 race_list[*]
		2 race_cd			= f8
	1 language_cd			= f8
	1 marital_status_cd		= f8
	1 religion_cd			= f8
	1 vip_cd				= f8
	1 email					= vc
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
	1 facility_cd			= f8
	1 contributor_system_cd = f8
	1 identities[*]
		2 alias = vc
		2 alias_pool_cd = f8
		2 alias_type_cd = f8
	1 alias_pools[*]
		2 alias_type_cd		= f8
		2 alias				= vc
		2 alias_pool_cd		= f8
		2 next_alias		= vc
		2 dup_allowed_flag	= i2
		2 sys_assign_flag 	= i2
)
 
declare iDebugFlag				= i2 with protect, noconstant(0)
declare sJsonArgs				= gvc with protect, noconstant("")
declare sRaces					= vc with protect, noconstant("")
 
; Other
declare dPersonId				= f8 with protect, noconstant(0.0)
declare dPrsnlId				= f8 with protect, noconstant(0.0)
declare iDeleteLock             = i2 with protect, noconstant(0)
 
; Constants
declare c_error_handler					= vc with protect, constant("POST PERSON")
declare c_now_dt_tm						= dq8 with protect, constant(cnvtdatetime(curdate,curtime3))
declare c_facility_location_type_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",222,"FACILITY"))
declare c_active_active_status_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",48,"ACTIVE"))
declare c_email_address_type_cd			= f8 with protect, constant(uar_get_code_by("MEANING",212,"EMAIL"))
declare c_mailto_contact_method_cd		= f8 with protect, constant(uar_get_code_by("MEANING",23056,"MAILTO"))
declare c_home_phone_type_cd			= f8 with protect, constant(uar_get_code_by("MEANING",43,"HOME"))
declare c_current_name_type_cd			= f8 with protect, constant(uar_get_code_by("MEANING",213,"CURRENT"))
declare c_multiple_race_cd				= f8 with protect, constant(uar_get_code_by("MEANING",282,"MULTIPLE"))
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
;Input
set iDebugFlag						= cnvtint($DEBUG_FLAG)
set sJsonArgs 						= trim($JSON_ARGS,3)
set jrec 							= cnvtjsontorec(sJsonArgs) ;This loads the arglist record
 
set input->username					= trim($USERNAME, 3)
set input->person_type_cd			= cnvtreal(arglist->PersonTypeId)
set input->birthdate				= cnvtdatetime(arglist->BirthDateTime)
set input->confidentiality_cd  		= cnvtreal(arglist->ConfidentialityId)
set input->deceased_date  			= cnvtdatetime(arglist->DeceasedDateTime)
set input->ethnicity_cd 			= cnvtreal(arglist->ExtendedInfo.EthnicityId)
set input->first_name 				= trim(arglist->FirstName,3)
set input->middle_name   			= trim(arglist->MiddleName,3)
set input->last_name 				= trim(arglist->LastName,3)
set input->prefix 					= trim(arglist->Prefix,3)
set input->suffix 					= trim(arglist->Suffix)
set input->gender_cd				= cnvtreal(arglist->GenderId)
set input->language_cd				= cnvtreal(trim(arglist->ExtendedInfo.LanguageId,3))
set input->marital_status_cd		= cnvtreal(arglist->ExtendedInfo.MaritalStatusId)
set input->religion_cd 				= cnvtreal(arglist->ExtendedInfo.ReligionId)
set input->vip_cd					= cnvtreal(arglist->VipId)
set input->email					= trim(arglist->ExtendedInfo.Email,3)
set sRaces							= trim(arglist->ExtendedInfo.RaceIds,3)
set input->contributor_system_cd	= cnvtreal(arglist->SystemId)
set input->facility_cd 				= cnvtreal(arglist->FacilityId)

;Addresses
if(size(arglist->ExtendedInfo.Addresses,5) > 0)
	for(i = 1 to size(arglist->ExtendedInfo.Addresses,5))
		set stat = alterlist(input->addresses,i)
		set input->addresses[i].address_type_cd = cnvtreal(arglist->ExtendedInfo.Addresses[i].TypeId)
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
		set input->phones[i].phone_type_cd = cnvtreal(arglist->ExtendedInfo.Phones[i].TypeId)
		set input->phones[i].number = trim(arglist->ExtendedInfo.Phones[i].Number,3)
		set input->phones[i].extension = trim(arglist->ExtendedInfo.Phones[i].Extension,3)
		set input->phones[i].format_cd = cnvtreal(arglist->ExtendedInfo.Phones[i].FormatId)
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
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
;Validate Username
set iRet = PopulateAudit(input->username, 0.0, post_person_reply_out, sVersion)
if(iRet = 0) call ErrorMsg("UserId","1001","I") endif

; Get Alias Pools based on prsnl and facility
if(size(input->identities,5) > 0)
	if(input->facility_cd > 0)
		set iRet = GetAliasPools(null)
		if(iRet = 0) call ErrorMsg("No alias pools found for user and/or facility.","9999","E") endif
	else
		if(iRet = 0) call ErrorMsg("FacilityId required when Identities exist.","9999","E") endif
	endif
endif
 
; Validate Input Parameters
call ValidateInputParams(null)
 
; Get Next PersonId sequence -- 115161 - pm_get_new_seq
set iRet = GetNextPersonId(null)
if(iRet = 0) call ErrorMsg("Could not retrieve PersonId sequence - 115161.","9999","E") endif
 
; Post Person
set iRet = AddPerson(null)
if(iRet = 0) call ErrorMsg("Could not post  person- 114609.","9999","E") endif
 
 ; Delete PM Lock -- 100082 - PM_LOCK_DEL_LOCKS
set iRet = DeleteLock(null)
if(iRet = 0) call ErrorMsg("Could not remove lock - 100082.","9999","E") endif
 
;Update Phone & Address data status codes
call UpdateTableData(null)
 
;Set Audit to Successful
call ErrorHandler2("SUCCESS", "S", "POST PATIENT", "Process completed successfully.",
"0000", "Process completed successfully.", post_person_reply_out)
 
#EXIT_SCRIPT
 
;releases lock if errors inside Addperson
if(iDeleteLock > 0)
	set lockDelete = DeleteLock(null)
endif
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(post_person_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_post_person.json")
	call echo(build2("_file : ", _file))
	call echojson(post_person_reply_out, _file, 0)
	call echorecord(post_person_reply_out)
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
			error_code, build2("Missing required field: ",msg), post_person_reply_out)
		of "I": ;Invalid
			call ErrorHandler2(c_error_handler, "F", "Validate", build2("Invalid input field: ",msg),
			error_code, build2("Invalid input field: ",msg), post_person_reply_out)
		of "E": ;Execute
 			call ErrorHandler2(c_error_handler, "F", "Execute", msg, error_code, msg, post_person_reply_out)
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
			; Validate address_type_cd
			set iRet = GetCodeSet(input->addresses[i].address_type_cd)
			if(iRet != 212) call ErrorMsg("AddressTypeId","9999","I") endif
 
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
			if(input->addresses[i].country_cd = 0 and input->addresses[i].country = "")
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
		endfor
	endif
 
	;Validate Phone data
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
 
 	;Validate PersonTypeId
 	if(input->person_type_cd > 0)
 		set iRet = GetCodeSet(input->person_type_cd)
 		if(iRet != 302) call ErrorMsg("PersonTypeId","9999","I") endif
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
;  Name: AddPerson(null) = null  ;114609 - PM.UpdatePersonData
;  Description: Post the Person
**************************************************************************/
subroutine AddPerson(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("AddPerson Begin",format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iValidate = 0
 
	; Transaction Info
	set pm_obj_req->transaction_type = 100 ;100 = create person
	set pm_obj_req->transaction_info.prsnl_id = dPrsnlId
	set pm_obj_req->transaction_info.trans_dt_tm = cnvtdatetime(c_now_dt_tm)
 
	; Person
	set pm_obj_req->person.person.person_id = 0.0
	set pm_obj_req->person.person.new_person_ind = 1
	set pm_obj_req->person.person.create_prsnl_id = dPrsnlId
	set pm_obj_req->person.person.person_type_cd = input->person_type_cd
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
 
	;Races
 	set raceSize = size(input->race_list,5)
 	if(raceSize > 0)
 		; If only one race cd, add to person table
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
		endfor
	endif
 
	;Current name is always sent regardless if added by consumer
	set a = size(pm_obj_req->person.person_name,5) + 1
	set stat = alterlist(pm_obj_req->person.person_name,a)
 
	set pm_obj_req->person.person_name[a].name_type_cd = c_current_name_type_cd
	set pm_obj_req->person.person_name[a].name_first = input->first_name
	set pm_obj_req->person.person_name[a].name_middle = input->middle_name
	set pm_obj_req->person.person_name[a].name_last = input->last_name
	set pm_obj_req->person.person_name[a].name_prefix = input->prefix
	set pm_obj_req->person.person_name[a].name_suffix = input->suffix
	set pm_obj_req->person.person_name[a].updt_id = dPrsnlId
	
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
 
 
 	; Execute Request
 	call UpdatePersonData(null)
 
 	set iDeleteLock = 1
 	set dPersonId = pm_obj_rep->person_id
 
 	if(pm_obj_rep->status_data.status = "S")
 		set iValidate = 1
 		set post_person_reply_out->person_id = dPersonId
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
 
end go
set trace notranslatelock go
