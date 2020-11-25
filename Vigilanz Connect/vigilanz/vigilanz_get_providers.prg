/*****************************************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

******************************************************************************************
	Source file name:   snsro_get_providers.prg
	Object name:        vigilanz_get_providers
	Program purpose:    Providers Discovery associated with GET Providers API
	Executing from:     MPages Discern Web Service
	Special Notes:      NONE
******************************************************************************************
                  MODIFICATION CONTROL LOG
******************************************************************************************
Mod 	Date Engineer   Comment
------------------------------------------------------------------------------------------
000	08/16/18 SVO		Initial write
001 12/27/18 SVO        Added Username to object
002	07/19/19 RJC		Fixed filtering issue; Added identities object; Added specialties object
******************************************************************************************/
 
drop program vigilanz_get_providers go
create program vigilanz_get_providers
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "User Id" = ""
	, "NPI" = ""
	, "First Name" = ""
	, "Last Name" = ""
	, "Gender Id" = "0.0"
	, "Specialty Id" = "0.0"
	, "Language Id" = "0.0"
	, "Location Id" = "0.0"
	, "Debug Flag" = "0"
 
with OUTDEV, userId, NPI, firstName, lastName, genderId, specialtyId, langId, locId,
	debug_flag
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/*************************************************************************
;DECLARE RECORDS
**************************************************************************/
free record providers_reply_out
record providers_reply_out(
	1 prov_cnt = i4
	1 prov[*]
		2 provider_id 			= f8
		2 username				= vc
		2 provider_name 		= vc
		2 tax_id 				= vc
		2 dea_number 			= vc
		2 npi_number 			= vc
		2 addr_cnt 				= i4
		2 addresses[*]
			3 address_id 		= f8
			3 address_type_cd 	= f8
			3 address_type_disp = vc
			3 address_type_mean = vc
			3 street_addr 		= vc
			3 street_addr2 		= vc
			3 city 				= vc
			3 state_cd 			= f8
			3 state_disp		= vc
			3 state_mean 		= vc
			3 zipcode 			= vc
			3 country_cd 		= f8
			3 country_disp 		= vc
		2 phone_cnt 			= i4
		2 phone[*]
			3 phone_id 			= f8
			3 phone_type_cd 	= f8
			3 phone_type_disp 	= vc
			3 phone_type_mean 	= vc
			3 phone_num 		= vc
			3 sequence_number 	= i4
		2 identities[*]
			3 code				= f8
			3 description		= vc
			3 value				= vc
		2 specialties[*]
			3 id 				= f8
			3 name				= vc
 1 status_data
    2 status 					= c1
    2 subeventstatus[1]
      3 OperationName 			= c25
      3 OperationStatus 		= c1
      3 TargetObjectName 		= c25
      3 TargetObjectValue 		= vc
      3 Code 					= c4
      3 Description 			= vc
1 audit
		2 user_id				= f8
		2 user_firstname		= vc
		2 user_lastname			= vc
		2 patient_id			= f8
		2 patient_firstname		= vc
		2 patient_lastname		= vc
 	    2 service_version		= vc
 	    2 query_execute_time	= vc
	    2 query_execute_units	= vc
)
 
set providers_reply_out->status_data->status = "F"
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Inputs
declare sUserName 		= vc with protect, noconstant("")
declare sNpi 			= vc with protect, noconstant("")
declare sFirstName 		= vc with protect, noconstant("")
declare sLastName 		= vc with protect, noconstant("")
declare dGenderId		= f8 with protect, noconstant(0.00)
declare dSpecialtyId 	= f8 with protect, noconstant(0.00)
declare dLanguageId 	= f8 with protect, noconstant(0.00)
declare dLocationId 	= f8 with protect, noconstant(0.00)
declare iDebugFlag 		= i2 with protect, noconstant(0)
 
;Other
declare name_last 		= vc
declare name_first 		= vc
declare sex_str 		= vc
declare lang_str 		= vc
declare specialty_str 	= vc
declare found 			= i2	;boolean for validating values
declare npi_query_ind 	= i2	;boolean to set for GetProvidersByNPI call
 
;Constants
declare c_npi_prsnl_alias_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",320,"NPI"))
declare c_taxid_prsnl_alias_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",320,"TAXID"))
declare c_dea_prsnl_alias_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",320,"DOCDEA"))
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
set sUserName 			= trim($userId,3)
set dPrsnlId 			= GetPrsnlIDfromUserName(sUserName)
set sNpi 				= trim($NPI,3)
set sFirstName 			= trim($firstName,3)
set sLastName 			= trim($lastName,3)
set dGenderId 			= cnvtreal(trim($genderId,3))
set dSpecialtyId 		= cnvtreal($specialtyId)
set dLanguageId 		= cnvtreal($langId)
set dLocationId 		= cnvtreal($locId)
set iDebugFlag 			= cnvtint($debug_flag)
 
if(iDebugFlag > 0)
	call echo(build("sUserName->",sUserName))
	call echo(build("dPrsnlId->",dPrsnlId))
	call echo(build("sNpi->",sNpi))
	call echo(build("sFirstName->",sFirstName))
	call echo(build("sLastName->",sLastName))
	call echo(build("dGenderId->",dGenderId))
	call echo(build("dSpecialtyId->",dSpecialtyId))
	call echo(build("dLanguageId->",dLanguageId))
	call echo(build("dLocationId->",dLocationId))
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ValidateInputs(null) = null with protect
declare GetProviders(null) = null with protect
declare GetProvidersByLocation(null) = null with protect
declare GetProvidersByNPI(null) = null with protect
declare GetProvidersBySpecialty(null) = null with protect
declare GetAddressPhone(null) = null with protect
declare GetAlias(null) = null with protect
declare GetSpecialties(null) = null with protect

/***********************************************************************
;MAIN
***********************************************************************/
; Validate username
set iRet = PopulateAudit(sUserName, 0.0, providers_reply_out, sVersion);PopulateAudit(sUserName, 0.0, providers_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "PROVIDERS DISCOVERY", "Invalid User for Audit.",
	"2016",build2("Invalid UserId: ",sUserName), providers_reply_out)	;001
	go to EXIT_SCRIPT
endif
 
; Validate Inputs
call ValidateInputs(null)
 
; Get Provider List
if(sNpi > " ")
	call GetProvidersByNPI(null)
elseif(dLocationId > 0.0)
	call GetProvidersByLocation(null)
elseif(dSpecialtyId > 0.0)
	call GetProvidersBySpecialty(null)
else
	call GetProviders(null)
endif
 
; Get Aliases, Addresses and Phone numbers if providers found
if(providers_reply_out->prov_cnt > 0)
	call GetAlias(null)
	call GetAddressPhone(null)
	call GetSpecialties(null)
else
	call ErrorHandler2("VALIDATE", "Z", "PROVIDERS DISCOVERY", "No Results Found",
	"0000","Please check paramters.", providers_reply_out)
	go to EXIT_SCRIPT
endif
 
; Set Final Audit to success
call ErrorHandler2("SUCCESS", "S", "PROVIDERS DISCOVERY", "Providers discovery completed successfully.",
"0000","Providers discovery completed successfully.", providers_reply_out)
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(providers_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_providers.json")
	call echo(build2("_file : ", _file))
	call echojson(providers_reply_out, _file, 0)
	call echorecord(providers_reply_out)
	call echo(JSONout)
endif
 
#EXIT_VERSION
 
/******************************************************
 Name: ValidateInputs(null)
 Description: performs query when a specialty id is valid
******************************************************/
subroutine ValidateInputs(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateInputs Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	;LastName
	if(sLastName > " ")
		set sLastName = DisplayKeyHelper(sLastName)
		set name_last = build('pr.name_last_key = "',sLastName,'*"')
	else
		set name_last = '1 = 1'
	endif
 
	;FirstName
	if(sFirstName > " ")
		set sFirstName = DisplayKeyHelper(sFirstName)
		set name_first = build('pr.name_first_key = "',sFirstName,'*"')
	else
		set name_first = '1 = 1'
	endif
 
	;GenderId
	if(dGenderId > 0)
		set iRet = GetCodeSet(dGenderId)
		if(iRet != 57)
		    call ErrorHandler2("VALIDATE", "F", "PROVIDERS DISCOVERY", "Not a valid sex_cd ",
			"2038","Please enter valid code value.", providers_reply_out)
			go to EXIT_SCRIPT
		else
			set sex_str = 'p.sex_cd > dGenderId'
		endif
	else
		set sex_str = '1 = 1'
	endif
 
	;LanguageId
	if(dLanguageId > 0.00)
		set iRet = GetCodeSet(dLanguageId)
		if(iRet != 36)
			call ErrorHandler2("VALIDATE", "F", "PROVIDERS DISCOVERY", "Not a valid language_cd ",
			"2069","Please enter valid code value.", providers_reply_out)
			go to EXIT_SCRIPT
		else
			set lang_str = 'p.language_cd = dLanguageId'
		endif
	else
		set lang_str = '1 = 1'
	endif
 
	;SpecialtyId
	set specialty_str = '1 = 1'
	if(dSpecialtyId > 0.00)
 
		select into "nl:"
		from code_value cv
		where cv.code_set = 357
		and cv.cdf_meaning = "MEDSERVICE"
		and cv.code_value = dSpecialtyId
		and cv.active_ind = 1
		head report
			found = 0
			detail
				found = 1
				specialty_str = 'pg.prsnl_group_type_cd = dSpecialtyId'
		with nullreport
 
		if(found < 1)
			call ErrorHandler2("VALIDATE", "F", "PROVIDERS DISCOVERY", "Not a valid specialty_id ",
				"2095","Please enter valid code.", providers_reply_out)
				go to EXIT_SCRIPT
		endif
	endif
 
	;LocationId
	if(dLocationId > 0.00)
	 	set ORG_FAC_TYPE_CD = uar_get_code_by("MEANING",222,"FACILITY")
	 	free record org
	 	record org(
	 		1 qual_cnt = i4
	 		1 qual[*]
	 			2 org_id = f8
	    )
 
	 	select into "nl:"
	 	from location l
	 	plan l
	 		where l.location_cd = dLocationId
	 			and l.location_type_cd = ORG_FAC_TYPE_CD
	 			and l.organization_id > 0
	 			and l.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
	 			and l.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		order by l.organization_id
	   	head report
	      x = 0
	      head l.organization_id
	      	x = x + 1
	      	stat = alterlist(org->qual,x)
	      	org->qual[x].org_id = l.organization_id
	   foot report
	   	 org->qual_cnt = x
	   with nocounter
 
	   if( org->qual_cnt < 1)
	 		call ErrorHandler2("VALIDATE", "F", "PROVIDERS DISCOVERY", "Not a valid facilty_cd ",
			"2040","Please enter valid code.", providers_reply_out)
			go to EXIT_SCRIPT
		endif
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("ValidateInputs Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;End Sub
 
/******************************************************
 Name: GetProvidersBySpecialty(null)
 Description: performs query when a specialty id is valid
******************************************************/
subroutine GetProvidersBySpecialty(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetProvidersBySpecialty Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	select into "nl:"
	from prsnl_group pg
		 ,prsnl_group_reltn pgr
		 ,prsnl pr
		 ,person p
	plan pg
		where pg.prsnl_group_type_cd = dSpecialtyId
			and pg.active_ind = 1
	join pgr
		where pgr.prsnl_group_id = pg.prsnl_group_id
			and pgr.active_ind = 1
	join pr
		where pr.person_id = pgr.person_id
			and pr.physician_ind = 1
			and parser(name_last)
			and parser(name_first)
			and pr.position_cd > 0
			and pr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and pr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
	join p
		where p.person_id = pr.person_id
			and parser(sex_str)
			and parser(lang_str)
			and p.active_ind = 1
	order by pr.person_id
	head report
		x = 0
	head pr.person_id
		x = x + 1
		stat = alterlist(providers_reply_out->prov,x)
		providers_reply_out->prov[x].provider_name = trim(pr.name_full_formatted)
		providers_reply_out->prov[x].provider_id = pr.person_id
		providers_reply_out->prov[x].username = trim(pr.username)
 
	foot report
		providers_reply_out->prov_cnt = x
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetProvidersBySpecialty Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;End Sub
 
/******************************************************
 Name: GetProvidersByNPI(null)
 Description: performs query when a NPI is valid
******************************************************/
subroutine GetProvidersByNPI(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetProvidersByNPI Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set npi_query_ind = 1;indicates if the GetAlias call is coming from this query
 
	select into "nl:"
	from prsnl_alias pa
		 ,prsnl pr
		 ,person p
	plan pa
		where pa.alias = sNPI
			and pa.prsnl_alias_type_cd = c_npi_prsnl_alias_type_cd
	join pr
		where pr.person_id = pa.person_id
			and pr.physician_ind > 0
			and parser(name_last)
			and parser(name_first)
			and pr.position_cd > 0
			and pr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and pr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
	join p
		where p.person_id = pr.person_id
			and parser(sex_str)
			and parser(lang_str)
			and p.active_ind = 1
	order by p.person_id
	head report
		x = 0
		head p.person_id
			x = x + 1
			stat = alterlist(providers_reply_out->prov,x)
			providers_reply_out->prov[x].provider_name = trim(pr.name_full_formatted)
			providers_reply_out->prov[x].npi_number = trim(pa.alias)
			providers_reply_out->prov[x].provider_id = pr.person_id
			providers_reply_out->prov[x].username = trim(pr.username)
	foot report
		providers_reply_out->prov_cnt = x
	with nocounter
	if(providers_reply_out->prov_cnt > 0)
 		call GetAlias(null)
		call GetAddressPhone(null)
	else
		set providers_reply_out->status_data->status = "Z"
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetProvidersByNPI Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;End Sub
 
/******************************************************
 Name: GetProvidersByLocation(null)
 Description: performs query when a Location based on facilty is valid
******************************************************/
subroutine GetProvidersByLocation(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetProvidersByLocation Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare num = i4
	select into "nl:"
	from prsnl_org_reltn por
		 ,prsnl_group pg
		 ,prsnl_group_reltn pgr
	     ,prsnl pr
	     ,person p
	plan por
		where expand(num,1,org->qual_cnt,por.organization_id,org->qual[num].org_id)
			and por.updt_dt_tm <= cnvtdatetime(curdate,curtime3)
			and por.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and por.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
	join pgr
		where pgr.person_id = por.person_id
			and pgr.active_ind = 1
			and pgr.beg_effective_dt_tm <= cnvtdatetime(curdate, curtime3)
			and pgr.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
	join pg
		where pg.prsnl_group_id = pgr.prsnl_group_id
			and parser(specialty_str)
	join pr
		where pr.person_id = pgr.person_id
			and pr.physician_ind = 1
			and parser(name_last)
			and parser(name_first)
			and pr.position_cd > 0
			and pr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and pr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
	join p
		where p.person_id = pr.person_id
			and parser(sex_str)
			and parser(lang_str)
			and p.active_ind = 1
	order pr.person_id
	head report
		x = 0
		head p.person_id
		x = x + 1
		stat = alterlist(providers_reply_out->prov,x)
		providers_reply_out->prov[x].provider_id = pr.person_id
		providers_reply_out->prov[x].provider_name = trim(pr.name_full_formatted)
		providers_reply_out->prov[x].username = trim(pr.username)
	foot report
	    providers_reply_out->prov_cnt = x
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetProvidersByLocation Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/******************************************************
 Name: GetProviders(null)
 Description: performs query when a only user name is valid or when location,npi, nor specialty are entered
******************************************************/
subroutine GetProviders(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetProviders Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	select into "nl:"
	from prsnl pr
	 	 ,person p
	plan pr
		where pr.physician_ind > 0
			and parser(name_last)
			and parser(name_first)
			and pr.position_cd > 0
			and pr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and pr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
	join p
		where p.person_id = pr.person_id
			and parser(sex_str)
			and parser(lang_str)
			and p.active_ind = 1
	order by pr.person_id
	head report
		x = 0
		head pr.person_id
			x = x + 1
			stat = alterlist(providers_reply_out->prov,x)
			providers_reply_out->prov[x].provider_name = trim(pr.name_full_formatted)
			providers_reply_out->prov[x].provider_id = pr.person_id
			providers_reply_out->prov[x].username = trim(pr.username)
	foot report
		providers_reply_out->prov_cnt = x
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetProviders Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;End Sub
 
/******************************************************
 Name: GetAddressPhone(null)
 Description: returns addresses and phones of provider id
******************************************************/
subroutine GetAddressPhone(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetAddressPhone Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set idx = 1
	if(providers_reply_out->prov_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	;Gettting address
	select into "nl:"
	from address a
	plan a
		where expand(idx,1,providers_reply_out->prov_cnt,a.parent_entity_id,providers_reply_out->prov[idx].provider_id)
			and a.parent_entity_name = "PERSON"
			and a.active_ind = 1
			and a.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and a.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
	order by a.parent_entity_id,a.address_type_seq,a.address_type_seq,a.address_id
	head a.parent_entity_id
		x = 0
	head a.address_id
		x = x + 1
		next = 1
		pos = locateval(idx,next,providers_reply_out->prov_cnt,a.parent_entity_id,providers_reply_out->prov[idx].provider_id)
 
		while(pos > 0 and next <= providers_reply_out->prov_cnt)
			stat = alterlist(providers_reply_out->prov[pos].addresses,x)
 
			providers_reply_out->prov[pos].addresses[x].address_id = a.address_id
			providers_reply_out->prov[pos].addresses[x].address_type_cd = a.address_type_cd
			providers_reply_out->prov[pos].addresses[x].address_type_disp = trim(uar_get_code_display(a.address_type_cd),3)
			providers_reply_out->prov[pos].addresses[x].street_addr = trim(a.street_addr,3)
			providers_reply_out->prov[pos].addresses[x].street_addr2 = trim(build(trim(a.street_addr2)," ",trim(a.street_addr3)),3)
			providers_reply_out->prov[pos].addresses[x].city = trim(a.city,3)
			providers_reply_out->prov[pos].addresses[x].state_cd = a.state_cd
			providers_reply_out->prov[pos].addresses[x].state_disp = trim(a.state,3)
			providers_reply_out->prov[pos].addresses[x].zipcode = trim(a.zipcode,3)
			providers_reply_out->prov[pos].addresses[x].country_cd = a.country_cd
			providers_reply_out->prov[pos].addresses[x].country_disp = trim(a.country,3)
			providers_reply_out->prov[pos].addr_cnt = x
 
			next = pos + 1
			pos = locateval(idx,next,providers_reply_out->prov_cnt,a.parent_entity_id,providers_reply_out->prov[idx].provider_id)
		endwhile
	with nocounter, expand = value(exp)
 
	;Getting phonenumber
	select into "nl:"
	from phone ph
	plan ph
		where expand(idx,1,providers_reply_out->prov_cnt,ph.parent_entity_id,providers_reply_out->prov[idx].provider_id)
			and ph.parent_entity_name = "PERSON"
			and ph.active_ind = 0
			and ph.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and ph.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
	order by ph.parent_entity_id,ph.phone_type_cd, ph.phone_type_seq,ph.phone_id
	head ph.parent_entity_id
		x = 0
	head ph.phone_id
		x = x + 1
		next = 1
		pos = locateval(idx,next,providers_reply_out->prov_cnt,ph.parent_entity_id,providers_reply_out->prov[idx].provider_id)
 
		while(pos > 0 and next <= providers_reply_out->prov_cnt)
			stat = alterlist(providers_reply_out->prov[pos].phone,x)
 
			providers_reply_out->prov[pos].phone[x].phone_id = ph.phone_id
			providers_reply_out->prov[pos].phone[x].phone_type_cd = ph.phone_type_cd
			providers_reply_out->prov[pos].phone[x].phone_type_disp = trim(uar_get_code_display(ph.phone_type_cd),3)
			providers_reply_out->prov[pos].phone[x].phone_num = trim(ph.phone_num,3)
			providers_reply_out->prov[pos].phone[x].sequence_number = ph.phone_type_seq
			providers_reply_out->prov[pos].phone_cnt = x
 
			next = pos + 1
			pos = locateval(idx,next,providers_reply_out->prov_cnt,ph.parent_entity_id,providers_reply_out->prov[idx].provider_id)
		endwhile
	with nocounter, expand = value(exp)
 
	if(iDebugFlag > 0)
		call echo(concat("GetProviders Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;End Sub
 
/******************************************************
 Name: GetAlias(null)
 Description: performs query to return aliases
******************************************************/
subroutine GetAlias(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetAlias Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set idx = 1
	if(providers_reply_out->prov_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	select into "nl:"
	from prsnl_alias pa
	plan pa where expand(idx,1,providers_reply_out->prov_cnt,pa.person_id,providers_reply_out->prov[idx].provider_id)
			and pa.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and pa.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
			and pa.active_ind = 1
	order by pa.person_id
	head pa.person_id
		x = 0
	detail
		x = x + 1
		next = 1
		pos = locateval(idx,next,providers_reply_out->prov_cnt,pa.person_id,providers_reply_out->prov[idx].provider_id)
 
		while(pos > 0 and next <= providers_reply_out->prov_cnt)
			stat = alterlist(providers_reply_out->prov[pos].identities,x)
 
			providers_reply_out->prov[pos].identities[x].code = pa.prsnl_alias_type_cd
			providers_reply_out->prov[pos].identities[x].description = uar_get_code_display(pa.prsnl_alias_type_cd)
			providers_reply_out->prov[pos].identities[x].value = pa.alias
 
			case(pa.prsnl_alias_type_cd)
				of c_npi_prsnl_alias_type_cd: providers_reply_out->prov[pos].npi_number = trim(pa.alias)
				of c_taxid_prsnl_alias_type_cd: providers_reply_out->prov[pos].tax_id = trim(pa.alias)
				of c_dea_prsnl_alias_type_cd: providers_reply_out->prov[pos].dea_number = trim(pa.alias)
			endcase
 
			next = pos + 1
			pos = locateval(idx,next,providers_reply_out->prov_cnt,pa.person_id,providers_reply_out->prov[idx].provider_id)
		endwhile
	with nocounter, expand = value(exp)
 
	if(iDebugFlag > 0)
		call echo(concat("GetAlias Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;End Sub

/******************************************************
 Name: GetSpecialties(null)
 Description: performs query to return specialties
******************************************************/
subroutine GetSpecialties(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetSpecialties Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
	
	set idx = 1
	if(providers_reply_out->prov_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif

	select into "nl:"
	from prsnl_group pg
		 ,prsnl_group_reltn pgr
	plan pgr where expand(idx,1,providers_reply_out->prov_cnt,pgr.person_id,providers_reply_out->prov[idx].provider_id)
		and pgr.active_ind = 1
	join pg where pg.prsnl_group_id = pgr.prsnl_group_id
		and pg.active_ind = 1
		and pg.prsnl_group_type_cd > 0
	order by pgr.person_id, pg.prsnl_group_type_cd
	head pgr.person_id
		x = 0
	head pg.prsnl_group_type_cd
		x = x + 1
		next = 1
		pos = locateval(idx,next,providers_reply_out->prov_cnt,pgr.person_id,providers_reply_out->prov[idx].provider_id)
		
		while(pos > 0 and next <= providers_reply_out->prov_cnt)
			stat = alterlist(providers_reply_out->prov[pos].specialties,x)
			
			providers_reply_out->prov[pos].specialties[x].id = pg.prsnl_group_type_cd
			providers_reply_out->prov[pos].specialties[x].name = uar_get_code_display(pg.prsnl_group_type_cd)
			
			next = pos + 1
			pos = locateval(idx,next,providers_reply_out->prov_cnt,pgr.person_id,providers_reply_out->prov[idx].provider_id)
		endwhile
	with nocounter, expand = value(exp)
	
	if(iDebugFlag > 0)
		call echo(concat("GetSpecialties Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;End Sub

/******************************************************
 Name: DisplayKeyHelper
 Description: Removes special characters to assure display_key validation
******************************************************/
subroutine DisplayKeyHelper(str)
	declare tempstr = vc
	set tempstr = cnvtupper(str)
	for(i = 1 to size(tempstr))
		set char = ichar(substring(i,1,tempstr))
		if(char < 65 or char > 90)
			set tempstr = replace(tempstr,char(char)," ")
		endif
	endfor
	set tempstr = trim(tempstr,9)
	return(tempstr)
end ;End Sub
 
end
go
 
 
