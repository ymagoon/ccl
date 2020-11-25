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

**********************************************************************
      Source file name: snsro_pat_prior_auth.prg
      Object name:      vigilanz_pat_prior_auth
      Program purpose:  Patches a prior authorization in millennium
      Executing from:   MPages Discern Web Service
**********************************************************************
                    MODIFICATION CONTROL LOG
**********************************************************************
 Mod 	Date     	Engineer	Comment
----------------------------------------------------------------------
  001	02/27/20	RJC			Initial Write
***********************************************************************/
drop program vigilanz_pat_prior_auth go
create program vigilanz_pat_prior_auth
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username:" = ""        		;Required
		, "Json Args" = ""				;Required
		, "Debug Flag:" = 0				;Optional
 
with OUTDEV, USERNAME, JSON, DEBUG_FLAG
 
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
 
;140007 - OCX_ADD_FREETEXT_PROVIDER
free record 140007_req
record 140007_req (
  1 esi_ensure_type = c3
  1 person_qual = i4
  1 person [*]
    2 pm_hist_tracking_id = f8
    2 transaction_dt_tm = dq8
    2 action_type = c3
    2 new_person = c1
    2 person_id = f8
    2 active_ind_ind = i2
    2 active_ind = i2
    2 active_status_cd = f8
    2 active_status_prsnl_id = f8
    2 active_status_dt_tm = dq8
    2 beg_effective_dt_tm = dq8
    2 end_effective_dt_tm = dq8
    2 person_type_cd = f8
    2 name_last_key = c100
    2 name_first_key = c100
    2 name_full_formatted = c100
    2 name_first_phonetic = c8
    2 name_last_phonetic = c8
    2 autopsy_cd = f8
    2 birth_dt_cd = f8
    2 birth_dt_tm = dq8
    2 conception_dt_tm = dq8
    2 cause_of_death = c100
    2 cause_of_death_cd = f8
    2 deceased_cd = f8
    2 deceased_dt_tm = dq8
    2 ethnic_grp_cd = f8
    2 language_cd = f8
    2 marital_type_cd = f8
    2 purge_option_cd = f8
    2 race_cd = f8
    2 religion_cd = f8
    2 sex_cd = f8
    2 sex_age_change_ind_ind = i2
    2 sex_age_change_ind = i2
    2 data_status_cd = f8
    2 data_status_dt_tm = dq8
    2 data_status_prsnl_id = f8
    2 contributor_system_cd = f8
    2 language_dialect_cd = f8
    2 name_last = c200
    2 name_first = c200
    2 name_phonetic = c8
    2 last_encntr_dt_tm = dq8
    2 species_cd = f8
    2 confid_level_cd = f8
    2 vip_cd = f8
    2 name_first_synonym_id = f8
    2 citizenship_cd = f8
    2 vet_military_status_cd = f8
    2 mother_maiden_name = c100
    2 nationality_cd = f8
    2 ft_entity_name = c32
    2 ft_entity_id = f8
    2 name_middle_key = c100
    2 name_middle = c200
    2 military_rank_cd = f8
    2 military_service_cd = f8
    2 military_base_location = c100
    2 deceased_source_cd = f8
    2 updt_cnt = i4
    2 birth_tz = i4
    2 birth_tz_disp = vc
    2 birth_prec_flag = i2
    2 deceased_id_method_cd = f8
    2 logical_domain_id = f8
    2 logical_domain_id_ind = i2
    2 person_status_cd = f8
    2 race_list_ind = i2
    2 race_list [*]
      3 value_cd = f8
    2 pre_person_id = f8
    2 ethnic_grp_list_ind = i2
    2 ethnic_grp_list [*]
      3 value_cd = f8
    2 emancipation_dt_tm = dq8
    2 deceased_tz = i4
    2 deceased_dt_tm_prec_flag = i2
  1 prsnl_qual = i4
  1 prsnl [*]
    2 action_type = c3
    2 new_person = c1
    2 person_id = f8
    2 active_ind_ind = i2
    2 active_ind = i2
    2 active_status_cd = f8
    2 active_status_dt_tm = dq8
    2 active_status_prsnl_id = f8
    2 name_last_key = c100
    2 name_first_key = c100
    2 prsnl_type_cd = f8
    2 name_full_formatted = c100
    2 password = c100
    2 email = c100
    2 physician_ind_ind = i2
    2 physician_ind = i2
    2 position_cd = f8
    2 department_cd = f8
    2 free_text_ind_ind = i2
    2 free_text_ind = i2
    2 beg_effective_dt_tm = dq8
    2 end_effective_dt_tm = dq8
    2 section_cd = f8
    2 data_status_cd = f8
    2 data_status_dt_tm = dq8
    2 data_status_prsnl_id = f8
    2 contributor_system_cd = f8
    2 name_last = c200
    2 name_first = c200
    2 username = c50
    2 ft_entity_name = c32
    2 ft_entity_id = f8
    2 prim_assign_loc_cd = f8
    2 log_access_ind_ind = i2
    2 log_access_ind = i2
    2 log_level = i4
    2 updt_cnt = i4
    2 name_middle = c200
    2 name_degree = c200
    2 name_prefix = c200
    2 name_suffix = c200
    2 name_initials = c200
    2 name_title = c100
  1 address_qual = i4
  1 address [*]
    2 action_type = c3
    2 new_person = c1
    2 address_id = f8
    2 parent_entity_name = c32
    2 parent_entity_id = f8
    2 address_type_cd = f8
    2 active_ind_ind = i2
    2 active_ind = i2
    2 active_status_cd = f8
    2 active_status_dt_tm = dq8
    2 active_status_prsnl_id = f8
    2 address_format_cd = f8
    2 beg_effective_dt_tm = dq8
    2 end_effective_dt_tm = dq8
    2 contact_name = c200
    2 residence_type_cd = f8
    2 comment_txt = c200
    2 street_addr = c100
    2 street_addr2 = c100
    2 street_addr3 = c100
    2 street_addr4 = c100
    2 city = c100
    2 state = c100
    2 state_cd = f8
    2 zipcode = c25
    2 zip_code_group_cd = f8
    2 postal_barcode_info = c100
    2 county = c100
    2 county_cd = f8
    2 country = c100
    2 country_cd = f8
    2 residence_cd = f8
    2 mail_stop = c100
    2 data_status_cd = f8
    2 data_status_dt_tm = dq8
    2 data_status_prsnl_id = f8
    2 address_type_seq_ind = i2
    2 address_type_seq = i4
    2 beg_effective_mm_dd_ind = i2
    2 beg_effective_mm_dd = i4
    2 end_effective_mm_dd_ind = i2
    2 end_effective_mm_dd = i4
    2 contributor_system_cd = f8
    2 operation_hours = c255
    2 long_text_id = f8
    2 updt_cnt = i4
    2 address_info_status_cd = f8
    2 primary_care_cd = f8
    2 district_health_cd = f8
    2 pm_hist_tracking_id = f8
    2 transaction_dt_tm = dq8
    2 city_cd = f8
    2 addr_key = c100
    2 addr_key_del_ind = i2
    2 source_identifier = c255
    2 validation_expire_dt_tm = dq8
  1 address_viewer_ind = i2
  1 fsi_unknown_flag = i2
  1 phone_qual = i4
  1 phone [*]
    2 action_type = c3
    2 new_person = c1
    2 phone_id = f8
    2 parent_entity_name = c32
    2 parent_entity_id = f8
    2 phone_type_cd = f8
    2 active_ind_ind = i2
    2 active_ind = i2
    2 active_status_cd = f8
    2 active_status_dt_tm = dq8
    2 active_status_prsnl_id = f8
    2 phone_format_cd = f8
    2 phone_num = c100
    2 phone_type_seq_ind = i2
    2 phone_type_seq = i4
    2 description = c100
    2 contact = c100
    2 call_instruction = c100
    2 modem_capability_cd = f8
    2 extension = c100
    2 paging_code = c100
    2 beg_effective_dt_tm = dq8
    2 end_effective_dt_tm = dq8
    2 data_status_cd = f8
    2 data_status_dt_tm = dq8
    2 data_status_prsnl_id = f8
    2 beg_effective_mm_dd_ind = i2
    2 beg_effective_mm_dd = i4
    2 end_effective_mm_dd_ind = i2
    2 end_effective_mm_dd = i4
    2 contributor_system_cd = f8
    2 operation_hours = c255
    2 long_text_id = f8
    2 updt_cnt = i4
    2 pm_hist_tracking_id = f8
    2 transaction_dt_tm = dq8
    2 email = c255
    2 contact_method_cd = f8
    2 source_identifier = c255
  1 phone_viewer_ind = i2
  1 prsnl_alias_qual = i4
  1 prsnl_alias [*]
    2 action_type = c3
    2 new_person = c1
    2 prsnl_alias_id = f8
    2 person_id = f8
    2 active_ind_ind = i2
    2 active_ind = i2
    2 active_status_cd = f8
    2 active_status_dt_tm = dq8
    2 active_status_prsnl_id = f8
    2 alias_pool_cd = f8
    2 prsnl_alias_type_cd = f8
    2 alias = c200
    2 prsnl_alias_sub_type_cd = f8
    2 check_digit = i4
    2 check_digit_method_cd = f8
    2 beg_effective_dt_tm = dq8
    2 end_effective_dt_tm = dq8
    2 data_status_cd = f8
    2 data_status_dt_tm = dq8
    2 data_status_prsnl_id = f8
    2 contributor_system_cd = f8
    2 updt_cnt = i4
)
 
;100080 - PM_LOCK_GET_LOCKS
free record 100080_req
record 100080_req (
  1 person_id = f8
  1 super_user = i2
  1 mode = i2
  1 unmask_alias = i2
)
 
free record 100080_rep
record 100080_rep (
    1 person [* ]
      2 person_id = f8
      2 user_id = f8
      2 user_name = vc
      2 name = vc
      2 mrn = vc
      2 gender = vc
      2 birth_date = dq8
      2 birth_tz = i4
      2 lockkeyid = i4
      2 entname = vc
      2 user_name_full = vc
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
)
 
;100081 - PM_LOCK_ADD_LOCK
free record 100081_req
record 100081_req (
  1 person_id = f8
)
 
free record 100081_rep
record 100081_rep (
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = vc
       3 operationstatus = c1
       3 targetobjectname = vc
       3 targetobjectvalue = vc
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
 
; Final reply
free record auth_reply_out
record auth_reply_out(
  1 priorAuthorizationId	= f8
  1 audit
    2 user_id             	= f8
    2 user_firstname        = vc
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
 
free record arglist
record arglist (
	1 PriorAuthorizationId			= vc
	1 PriorAuthorization
		2 StatusId 					= vc
		2 AuthorizationNumber 		= vc
		2 AuthorizationStartDate  	= vc
		2 AuthorizationEndDate 		= vc
		2 Comment 					= vc
		2 NoteText 					= vc ;Not used
		2 AuthorizationRequiredId 	= vc
		2 AuthorizationAgency 		= vc
		2 TypeId 					= vc
		2 Phone
			3 PhoneId				= vc
			3 Number 				= vc
			3 TypeId 				= vc
			3 Extension 			= vc
			3 FormatId 				= vc
			3 Contact 				= vc
		2 ProvidersType[*]
			3 ProviderId 			= vc 	;If this is a real number, then do a lookup for provider prsnl. If not, this
											;will be the name of the free text provider
			3 ProviderType 			= vc
			3 Address 				= vc
				4 AddressId			= vc
			  	4 Address1 			= vc
			  	4 Address2 			= vc
			  	4 Address3 			= vc
			  	4 City 				= vc
			  	4 State 			= vc
			  	4 ZIP 				= vc
			  	4 TypeId 			= vc
			  	4 County 			= vc
			  	4 Country 			= vc
			3 Email 				= vc
			3 NPI 					= vc
			3 LicenseNumber 		= vc
			3 Phones[*]
				4 PhoneId			= vc
				4 Number			= vc
				4 TypeId 			= vc
				4 Extension			= vc
				4 FormatId 			= vc
				4 Contact 			= vc
)
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
; Input params
free record input
record input (
	1 username						= vc
	1 authorization_id				= f8
	1 prsnl_id						= f8
	1 patient_id 					= f8
	1 encntr_id						= f8
	1 encntr_plan_reltn_id			= f8
	1 cert_status_cd				= f8
	1 auth_nbr						= vc
	1 service_beg_dt_tm				= dq8
	1 service_end_dt_tm				= dq8
	1 comment_txt					= vc
	1 auth_required_cd				= f8
	1 auth_company					= vc
	1 auth_type_cd					= f8
	1 phone
		2 number					= vc
		2 phone_type_cd				= f8
		2 extension					= vc
		2 phone_format_cd			= f8
		2 contact					= vc
	1 providers[*]
		2 provider					= vc
		2 provider_id				= f8
		2 provider_type_cd			= f8
		2 first_name				= vc
		2 last_name					= vc
		2 free_text_ind				= i2
		2 address
			3 address_type_cd		= f8
			3 address1				= vc
			3 address2				= vc
			3 address3				= vc
			3 city					= vc
			3 state					= vc
			3 state_cd				= f8
			3 zip					= vc
			3 county				= vc
			3 county_cd				= f8
			3 country				= vc
			3 country_cd			= f8
		2 phones[*]
			3 phone_type_cd			= f8
			3 number				= vc
			3 extension				= vc
			3 format_id				= f8
			3 contact				= vc
		2 email						= vc
		2 npi						= vc
		2 license_number			= vc
	1 other_active_plans[*]
	 	2 plan_reltn_id				= f8
	1 other_auths[*]
		2 authorization_id			= f8
)
 
; Other
declare sJsonArgs						= vc with protect, noconstant("")
 
; Constants
declare c_error_handler					= vc with protect, constant("PUT PRIOR AUTH")
declare c_insured_person_reltn_type_cd	= f8 with protect, constant(uar_get_code_by("MEANING",351,"INSURED"))
declare c_npi_prsnl_alias_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",320,"NPI"))
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ErrorMsg(msg = vc, error_code = c4, type = vc) 	= null with protect
declare ValidateInputParams(null)				= null with protect
declare ValidatePerson(person_id = f8) 			= i2 with protect
declare ValidateProvider(provider_id = f8)		= i2 with protect
declare SetFreetextProvider(null)				= i2 with protect	;140007 - OCX_ADD_FREETEXT_PROVIDER
declare GetZipDefaults(zipcode = vc)			= null with protect ;114382 - PM_GET_ZIPCODE_DEFAULTS
declare GetLocks(null) 							= i2 with protect 	;100080 - PM_LOCK_GET_LOCKS
declare AddLock(null) 							= i2 with protect	;100081 - PM_LOCK_ADD_LOCKS
declare PostInsurance(null) 					= null with protect	;114609 - PM.UpdatePersonData
declare DeleteLock(null) 						= i2 with protect	;100082 - PM_LOCK_DEL_LOCKS
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
;Inputs
set iDebugFlag 				= cnvtint($DEBUG_FLAG)
set input->username 		= trim($USERNAME, 3)
set stat					= cnvtjsontorec($JSON)
set input->prsnl_id 		= GetPrsnlIDfromUserName(input->username)
 
;PriorAuthorization Details
set input->authorization_id = cnvtreal(arglist->PriorAuthorizationId)
set input->auth_company = trim(arglist->PriorAuthorization.AuthorizationAgency,3)
set input->auth_nbr = trim(arglist->PriorAuthorization.AuthorizationNumber,3)
if(trim(arglist->PriorAuthorization.AuthorizationRequiredId,3) != c_null_value)
	set input->auth_required_cd = cnvtreal(arglist->PriorAuthorization.AuthorizationRequiredId)
else
	set input->auth_required_cd = -1
endif
if(trim(arglist->PriorAuthorization.TypeId,3) != c_null_value)
	set input->auth_type_cd = cnvtreal(arglist->PriorAuthorization.TypeId)
else
	set input->auth_type_cd = -1
endif
if(trim(arglist->PriorAuthorization.StatusId,3) != c_null_value)
	set input->cert_status_cd = cnvtreal(arglist->PriorAuthorization.StatusId)
else
	set input->cert_status_cd = -1
endif
set input->comment_txt = trim(arglist->PriorAuthorization.Comment,3)
if(trim(arglist->PriorAuthorization.AuthorizationStartDate,3) > " ")
	set input->service_beg_dt_tm = GetDateTime(arglist->PriorAuthorization.AuthorizationStartDate)
endif
if(trim(arglist->PriorAuthorization.AuthorizationEndDate,3) > " ")
	set input->service_end_dt_tm = GetDateTime(arglist->PriorAuthorization.AuthorizationEndDate)
endif
 
;Phone
if(trim(arglist->PriorAuthorization.Phone.TypeId,3) != c_null_value)
	set input->phone.phone_type_cd = cnvtreal(arglist->PriorAuthorization.Phone.TypeId)
else
	set input->phone.phone_type_cd = -1
endif
set input->phone.number = trim(arglist->PriorAuthorization.Phone.Number,3)
set input->phone.extension = trim(arglist->PriorAuthorization.Phone.Extension,3)
if(trim(arglist->PriorAuthorization.Phone.FormatId,3) != c_null_value)
	set input->phone.phone_format_cd = cnvtreal(arglist->PriorAuthorization.Phone.FormatId)
else
	set input->phone.phone_format_cd = -1
endif
set input->phone.contact = trim(arglist->PriorAuthorization.Phone.Contact,3)
 
;Providers
set pSize = size(arglist->PriorAuthorization.ProvidersType,5)
if(pSize > 0)
	set stat = alterlist(input->providers,pSize)
	for(i = 1 to pSize)
		set input->providers[i].provider = trim(arglist->PriorAuthorization.providersType[i].providerId,3)
		set input->providers[i].provider_id = cnvtreal(arglist->PriorAuthorization.providersType[i].providerId)
		set input->providers[i].provider_type_cd = cnvtreal(arglist->PriorAuthorization.providersType[i].providerType)
		set input->providers[i].email = trim(arglist->PriorAuthorization.providersType[i].email,3)
		set input->providers[i].npi = trim(arglist->PriorAuthorization.providersType[i].npi,3)
		set input->providers[i].license_number = trim(arglist->PriorAuthorization.providersType[i].licenseNumber,3)
 
		;Provider Address
		set input->providers[i].address.address_type_cd = cnvtreal(arglist->PriorAuthorization.providersType[i].address.typeId)
		if(input->providers[i].address.address_type_cd > 0)
			set input->providers[i].address.address1 = trim(arglist->PriorAuthorization.providersType[i].address.address1,3)
			set input->providers[i].address.address2 = trim(arglist->PriorAuthorization.providersType[i].address.address2,3)
			set input->providers[i].address.address3 = trim(arglist->PriorAuthorization.providersType[i].address.address3,3)
			set input->providers[i].address.city = trim(arglist->PriorAuthorization.providersType[i].address.city,3)
 
			;State
			set input->providers[i].address.state = trim(arglist->PriorAuthorization.providersType[i].address.state,3)
			if(cnvtreal(input->providers[i].address.state)> 0)
				set input->providers[i].address.state_cd = cnvtreal(input->providers[i].address.state)
			else
				set input->providers[i].address.state_cd =
					uar_get_code_by("DISPLAYKEY",62,cnvtupper(input->providers[i].address.state))
			endif
			;County
			set input->providers[i].address.county = trim(arglist->PriorAuthorization.providersType[i].address.county,3)
			if(cnvtreal(input->providers[i].address.county)> 0)
				set input->providers[i].address.county_cd = cnvtreal(input->providers[i].address.county)
			else
				set input->providers[i].address.county_cd =
					uar_get_code_by("DISPLAYKEY",74,cnvtupper(input->providers[i].address.county))
			endif
			;Country
			set input->providers[i].address.country = trim(arglist->PriorAuthorization.providersType[i].address.country,3)
			if(cnvtreal(input->providers[i].address.country)> 0)
				set input->providers[i].address.country_cd = cnvtreal(input->providers[i].address.country)
			else
				set input->providers[i].address.country_cd =
					uar_get_code_by("DISPLAYKEY",15,cnvtupper(input->providers[i].address.country))
			endif
		endif
 
		;Provider Phone
		set phSize = size(arglist->PriorAuthorization.providersType[i].phones,5)
		if(phSize > 0)
			set stat = alterlist(input->providers[i].phones,phSize)
			for(p = 1 to phSize)
				set input->providers[i].phones[p].phone_type_cd = cnvtreal(arglist->PriorAuthorization.providersType[i].phones[p].typeId)
				set input->providers[i].phones[p].number = trim(arglist->PriorAuthorization.providersType[i].phones[p].number,3)
				set input->providers[i].phones[p].extension = trim(arglist->PriorAuthorization.providersType[i].phones[p].extension,3)
				set input->providers[i].phones[p].format_id = cnvtreal(arglist->PriorAuthorization.providersType[i].phones[p].formatId)
				set input->providers[i].phones[p].contact = trim(arglist->PriorAuthorization.providersType[i].phones[p].Contact,3)
			endfor
		endif
	endfor
endif
 
;Other
set reqinfo->updt_id = input->prsnl_id
 
if(iDebugFlag > 0)
	call echorecord(input)
endif
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Validate Input Parameters
call ValidateInputParams(null)
 
;Validate Username
set iRet = PopulateAudit(input->username, input->patient_id, auth_reply_out, sVersion)
if(iRet = 0) call ErrorMsg("UserId","1001","I") endif
 
;Create free text provider if needed
if(size(input->providers,5) > 0)
	for(i = 1 to size(input->providers,5))
		if(input->providers[i].provider_id = 0)
			set iRet = SetFreetextProvider(null)
			if(iRet = 0) call ErrorMsg("Could not create freetext provider.","9999","E") endif
		endif
	endfor
endif
 
; Get patient locks - Request 100080
set iRet = GetLocks(null)
if(iRet = 0) call ErrorMsg("Could not retrieve patient locks (100080).","9999","E") endif
 
; Create Patient Lock - Request 100081
set iRet = AddLock(null)
if(iRet = 0) call ErrorMsg("Could not set patient lock (100081).","9999","E") endif
 
; Update Authorization
set iRet = PostInsurance(null)
if(iRet = 0)
  	  call ErrorMsg("Could not update prior authorization.","9999","E")
else
	call ErrorHandler2(c_error_handler, "S", c_error_handler, "Authorization updated successfully.",
  		"0000",build2("Authorization updated successfully."), auth_reply_out)
endif
 
#EXIT_SCRIPT
 
; Delete Lock - 100082
if(100081_rep->status_data.status = "S")
	set iRet = DeleteLock(null)
	if(iRet = 0) call ErrorMsg("Could not delete patient lock (100082).","9999","E") endif
endif
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(auth_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_patch_prior_auth.json")
	call echo(build2("_file : ", _file))
	call echojson(auth_reply_out, _file, 0)
	call echorecord(auth_reply_out)
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
			error_code, build2("Missing required field: ",msg), auth_reply_out)
		of "I": ;Invalid
			call ErrorHandler2(c_error_handler, "F", "Validate", build2("Invalid input field: ",msg),
			error_code, build2("Invalid input field: ",msg), auth_reply_out)
		of "E": ;Execute
 			call ErrorHandler2(c_error_handler, "F", "Execute", msg, error_code, msg, auth_reply_out)
	endcase
 
	go to exit_script
 
end ;End Subroutine
 
/*************************************************************************
;  Name: ValidateInputParams(null)	= null
;  Description: Validate input parameters
**************************************************************************/
subroutine ValidateInputParams(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateInputParams Begin",format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	; Validate PriorAuthorizationId exists
	if(input->authorization_id = 0)
		call ErrorMsg("PriorAuthorizationId","9999","M")
	endif
 
	select into "nl:"
	from encntr_plan_auth_r epar
		, authorization a
		, encounter e
	plan epar where epar.authorization_id = input->authorization_id
	join a where a.authorization_id = epar.authorization_id
	join e where e.encntr_id = a.encntr_id
	detail
		input->encntr_id = e.encntr_id
		input->patient_id = e.person_id
		input->encntr_plan_reltn_id = epar.encntr_plan_reltn_id
	with nocounter
 
	;Validate PriorAuthorizationId is valid
	if(input->encntr_plan_reltn_id = 0 or input->encntr_id = 0 or input->patient_id = 0)
		call ErrorMsg("PriorAuthorizationId","9999","I")
	endif
 
	;Validate StatusId
	if(input->cert_status_cd > 0)
		set iRet = GetCodeSet(input->cert_status_cd)
		if(iRet != 14155) call ErrorMsg("StatusId","9999","I") endif
	endif
 
	;Validate AuthorizationRequiredId
	if(input->auth_required_cd > 0)
		set iRet = GetCodeSet(input->auth_required_cd)
		if(iRet != 14167) call ErrorMsg("AuthorizationRequiredId","9999","I") endif
	endif
 
	;Validate PhoneTypeId
	if(input->phone.phone_type_cd > 0)
		set iRet = GetCodeSet(input->phone.phone_type_cd)
		if(iRet != 43) call ErrorMsg("Phone.TypeId","9999","I") endif
	endif
 
	;Validate PhoneFormatId
	if(input->phone.phone_format_cd > 0)
		set iRet = GetCodeSet(input->phone.phone_format_cd)
		if(iRet != 281) call ErrorMsg("Phone.FormatId","9999","I") endif
	endif
 
	;Validate TypeId
	if(input->auth_type_cd > 0)
		set iRet = GetCodeSet(input->auth_type_cd)
		if(iRet != 14949) call ErrorMsg("TypeId","9999","I") endif
	endif
 
	;Validate Provider Data
	set provSize = size(input->providers,5)
	if(provSize > 0)
		if(provSize > 1)
			call ErrorMsg("Only one provider can be tied to a prior authorization.","9999","E")
		else
			for(i = 1 to provSize)
				;ProviderTypeCd
				if(input->providers[i].provider_type_cd > 0)
					set iRet = GetCodeSet(input->providers[i].provider_type_cd)
					if(iRet != 333) call ErrorMsg("Provider.TypeId","9999","I") endif
				endif
 
	 			;ProviderId
	 			if(input->providers[i].provider_id > 0)
					if(ValidateProvider(input->providers[i].provider_id) = 0) call ErrorMsg("ProviderId","9999","I") endif
				else
					set input->providers[i].free_text_ind = 1
				endif
 
	 			;Validate Address/Phone data for free text providers
	 			if(input->providers[i].free_text_ind = 1)
					;Provider Address
					if(input->providers[i].address.address1 > " "
					or input->providers[i].address.address2 > " "
					or input->providers[i].address.city > " "
					or input->providers[i].address.state > " "
					or input->providers[i].address.county > " "
					or input->providers[i].address.country > " "
					or input->providers[i].address.zip > " ")
						set iRet = GetCodeSet(input->providers[i].address.address_type_cd)
						if(iRet != 212) call ErrorMsg("Provider.AddressTypeId","9999","I") endif
		 			endif
 
					; Get Zipcode defaults
					if(input->providers[i].address.zip > " ")
						set stat = initrec(114382_req)
						set stat = initrec(114382_rep)
						call GetZipDefaults(input->providers[i].address.zip)
						if(input->providers[i].address.county_cd = 0)
							set input->providers[i].address.county_cd = 114382_rep->county_cd
						endif
						if(input->providers[i].address.county = "")
							set input->providers[i].address.county = 114382_rep->county
						endif
						if(input->providers[i].address.state_cd <= 0)
							set input->providers[i].address.state_cd = 114382_rep->state_cd
						endif
					endif
 
					;Get Country
					if(input->providers[i].address.country_cd = 0 or input->providers[i].address.country = "")
						select into "nl:"
						from code_value_group cvg
						, code_value cv
						plan cvg where cvg.child_code_value = input->providers[i].address.state_cd
						join cv where cv.code_value = cvg.parent_code_value
								and cv.code_set = 15
						detail
							if(input->providers[i].address.country_cd <= 0)
								input->providers[i].address.country_cd = cv.code_value
							endif
							if(input->providers[i].address.country = "")
								input->providers[i].address.country = cv.display
							endif
						with nocounter
					endif
 
					;Provider Phone
					set pSize = size(input->providers[i].phones,5)
					if(pSize > 0)
						for(p = 1 to pSize)
							set iRet = GetCodeSet(input->providers[i].phones[p].phone_type_cd)
							if(iRet != 43) call ErrorMsg("Provider.PhoneTypeId","9999","I") endif
 
							if(input->providers[i].phones[p].format_id > 0)
								set iRet = GetCodeSet(input->providers[i].phones[p].format_id)
								if(iRet != 281) call ErrorMsg("Provider.FormatId","9999","I") endif
							endif
						endfor
					endif
	 			endif
			endfor
		endif
	endif
 
	;Get other active insurance plans
	select into "nl:"
	from encntr_plan_reltn epr
		, encounter e
	plan epr where epr.encntr_id = input->encntr_id
		and epr.encntr_plan_reltn_id != input->encntr_plan_reltn_id
		and epr.active_ind = 1
		and epr.beg_effective_dt_tm <= sysdate
		and epr.end_effective_dt_tm > sysdate
	join e where e.encntr_id = epr.encntr_id
	head report
		x = 0
	detail
		x = x + 1
		stat = alterlist(input->other_active_plans,x)
		input->other_active_plans[x].plan_reltn_id = epr.encntr_plan_reltn_id
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("ValidateInputParams Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: ValidatePerson(person_id = f8) = i2
;  Description: Validate the person id if prsnl or not
**************************************************************************/
subroutine ValidatePerson(person_id)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidatePerson Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iValidate = 0
 
 	select into "nl:"
 	from person p
	plan p where p.person_id = person_id
		and p.active_ind = 1
		and p.beg_effective_dt_tm < cnvtdatetime(curdate,curtime3)
		and p.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
		and ( p.deceased_cd = value(uar_get_code_by("MEANING",268,"NO"))
			or p.deceased_cd = 0)
 	detail
		iValidate = 1
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("ValidatePerson Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
 	return (iValidate)
end ;End Subroutine
 
/*************************************************************************
;  Name: ValidateProvider(provider_id) = i2
;  Description:  Validates the provider is a valid person on the prsnl table.
**************************************************************************/
subroutine ValidateProvider(provider_id)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateProvider Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
 
	select into "nl:"
	from prsnl pr
	plan pr where pr.person_id = por.person_id
		and pr.active_ind = 1
		and pr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and pr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
		;and pr.physician_ind = 1
	detail
		iValidate = iValidate + 1
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("ValidateProvider Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: SetFreetextProvider(null) = i2
;  Description: Add free text provider
**************************************************************************/
subroutine SetFreetextProvider(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("SetFreetextProvider Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iValidate = 1
 
	set iApplication = 100000
	set iTask = 140001
	set iRequest = 140007
 
	;Setup request
	for(i = 1 to size(input->providers,5))
		if(input->providers[i].free_text_ind = 1)
			;Set Person Name
			set stat = alterlist(140007_req->person,1)
			set 140007_req->person[1].name_last = piece(input->providers[i].provider,",",1,"")
			set 140007_req->person[1].name_first = piece(input->providers[i].provider,",",2,"")
 
 			;Set Prsnl Name
			set stat = alterlist(140007_req->prsnl,1)
			set 140007_req->prsnl[1].name_last = piece(input->providers[i].provider,",",1,"")
			set 140007_req->prsnl[1].name_first = piece(input->providers[i].provider,",",2,"")
 
 			;Set Address
			if(input->providers[i].address.address_type_cd > 0)
				set 140007_req->address_qual = 1
				set stat = alterlist(140007_req->address,1)
				set 140007_req->address[1].address_type_cd = input->providers[i].address.address_type_cd
				set 140007_req->address[1].street_addr = input->providers[i].address.address1
				set 140007_req->address[1].street_addr2 = input->providers[i].address.address2
				set 140007_req->address[1].city = input->providers[i].address.city
				set 140007_req->address[1].state = input->providers[i].address.state
				set 140007_req->address[1].state_cd = input->providers[i].address.state_cd
				set 140007_req->address[1].zipcode = input->providers[i].address.zip
				set 140007_req->address[1].county = input->providers[i].address.county
				set 140007_req->address[1].county_cd = input->providers[i].address.county_cd
				set 140007_req->address[1].country = input->providers[i].address.country
				set 140007_req->address[1].country_cd = input->providers[i].address.country_cd
			endif
 
			;Set Phone
			set pSize = size(input->providers[i].phones,5)
			if(pSize > 0)
				for(p = 1 to pSize)
					set 140007_req->phone_qual = p
					set stat = alterlist(140007_req->phone,p)
					set 140007_req->phone[p].phone_type_cd = input->providers[i].phones[p].phone_type_cd
					set 140007_req->phone[p].phone_num = input->providers[i].phones[p].number
					set 140007_req->phone[p].extension = input->providers[i].phones[p].extension
					set 140007_req->phone[p].phone_format_cd = input->providers[i].phones[p].format_id
				endfor
			endif
 
			;Set email
			if(input->providers[i].email > " ")
				set 140007_req->prsnl[1].email = input->providers[i].email
			endif
 
			;Set NPI
			if(input->providers[i].npi > " ")
				set 140007_req->prsnl_alias_qual = 1
				set stat = alterlist(140007_req->prsnl_alias,1)
				set 140007_req->prsnl_alias[1].prsnl_alias_type_cd = c_npi_prsnl_alias_type_cd
				set 140007_req->prsnl_alias[1].alias = input->providers[i].npi
 
				select into "nl:"
			 	from prsnl_org_reltn por
			 		, org_alias_pool_reltn oapr
			 	plan por where por.person_id = input->prsnl_id
			 		and por.active_ind = 1
			 		and por.beg_effective_dt_tm <= sysdate
			 		and por.end_effective_dt_tm > sysdate
			 	join oapr where oapr.organization_id = por.organization_id
			 		and oapr.alias_entity_name = "PRSNL_ALIAS"
			 		and oapr.alias_entity_alias_type_cd = c_npi_prsnl_alias_type_cd
			 		and oapr.active_ind = 1
			 		and oapr.beg_effective_dt_tm <= sysdate
			 		and oapr.end_effective_dt_tm > sysdate
			 	detail
			 		140007_req->prsnl_alias[1].alias_pool_cd = oapr.alias_pool_cd
			 	with nocounter
			 endif
 
			;Execute request
			set stat = tdbexecute(iApplication,iTask,iRequest,"REC",140007_req,"REC",140007_rep)
 
			if(140007_rep->status_data.status = "F")
				set iValidate = 0
			else
				;Set new person id
				set input->providers[i].provider_id = 140007_rep->person[1].person_id
			endif
		endif
 	endfor
 
	if(iDebugFlag > 0)
		call echo(concat("SetFreetextProvider Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetLocks(null) = i2
;  Description: Request 100080 - Get patient locks
**************************************************************************/
subroutine GetLocks(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetLocks Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iAPPLICATION = 100000
	set iTASK = 100080
 	set iREQUEST = 100080
 
 	; Setup request
	set 100080_req->person_id = input->patient_id
	set 100080_req->super_user = 1
 
	; Execute Request
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",100080_req,"REC",100080_rep)
	if(100080_rep->status_data.status = "S")
		set iValidate = 1
 
		if(size(100080_rep->person,5) > 0)
			call ErrorMsg("Patient is locked. Please try again later.","9999","E")
		endif
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetLocks Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: AddLock(null) = i2
;  Description:  Request 100081 - create patient lock
**************************************************************************/
subroutine AddLock(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("AddLock Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iAPPLICATION = 100000
	set iTASK = 100080
 	set iREQUEST = 100081
 
	set 100081_req->person_id = input->patient_id
 
	; Execute Request
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",100081_req,"REC",100081_rep)
	if(100081_rep->status_data.status = "S")
		set iValidate = 1
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("AddLock Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: PostInsurance(null) = null
;  Description: Post new insurance(s)
**************************************************************************/
subroutine PostInsurance(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostInsurance Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iValidate = 0
 
 	;Populate DataMap -- GetPersonData(action = i4, person_id = f8, encntr_id = f8)
 	call GetPersonData(201,input->patient_id,input->encntr_id)
 
	; Transaction Info
	set pm_obj_req->transaction_type = 201 ;Update encounter
	set pm_obj_req->transaction_info.prsnl_id = input->prsnl_id
	set pm_obj_req->transaction_info.trans_dt_tm = cnvtdatetime(curdate,curtime3)
 
	;Add update_reltn_ind to all other active insurances - this prevents them from being inactivated
	if( size(input->other_active_plans,5) > 0)
	 	select into "nl:"
	 	from (dummyt d with seq = size(pm_obj_req->person.person_person_reltn,5))
	 		,(dummyt d2 with seq = 1)
	 		,(dummyt d3 with seq = size(input->other_active_plans,5))
	 	plan d where maxrec(d2,size(pm_obj_req->person.person_person_reltn[d.seq].person.person_plan_reltn,5))
	 	join d2
	 	join d3 where pm_obj_req->person.person_person_reltn[d.seq].person.person_plan_reltn[d2.seq].encntr_plan_reltn_id =
	 		input->other_active_plans[d3.seq].plan_reltn_id
	 	detail
	 		pm_obj_req->person.person_person_reltn[d.seq].update_reltn_ind = 1
	 	with nocounter
	 endif
 
	; Insurance/Subscriber
	; Get indexes of current data
	set idx = 1
	set pos1 = 0
	set pos2 = 0
 	set pos3 = 0
 	set pos4 = 0
 
	select into "nl:"
 	from (dummyt d with seq = size(pm_obj_req->person.person_person_reltn,5))
 		,(dummyt d2 with seq = 1)
 	plan d where maxrec(d2,size(pm_obj_req->person.person_person_reltn[d.seq].person.person_plan_reltn,5))
 	join d2 where pm_obj_req->person.person_person_reltn[d.seq].person.person_plan_reltn[d2.seq].encntr_plan_reltn_id =
 			input->encntr_plan_reltn_id
 	detail
 		pos1 = d.seq
 		pos2 = d2.seq
 		pm_obj_req->person.person_person_reltn[d.seq].update_reltn_ind = 1
 	with nocounter
 
 	;Encntr_Plan_Reltn
 	set eprSize = size(pm_obj_req->person.person_person_reltn[pos1].person.person_plan_reltn[pos2].encntr_plan_reltn,5)
 	set pos3 = locateval(idx,1,eprSize,input->encntr_plan_reltn_id,
 			pm_obj_req->person.person_person_reltn[pos1].person.person_plan_reltn[pos2].encntr_plan_reltn[idx].encntr_plan_reltn_id)
 
 	;Auth Info
 	set aSize = size(pm_obj_req->person.person_person_reltn[pos1].person.person_plan_reltn[pos2].encntr_plan_reltn[pos3].auth_info,5)
	set pos4 = locateval(idx,1,aSize,input->authorization_id,
		pm_obj_req->person.person_person_reltn[pos1].person.person_plan_reltn[pos2].encntr_plan_reltn[pos3]
		.auth_info[idx].authorization_id)
 
 	if(input->auth_nbr != c_null_value)
		set pm_obj_req->person.person_person_reltn[pos1].person.person_plan_reltn[pos2].encntr_plan_reltn[pos3].auth_info[pos4].
			auth_nbr =	input->auth_nbr
	endif
	if(input->auth_type_cd > -1)
		set pm_obj_req->person.person_person_reltn[pos1].person.person_plan_reltn[pos2].encntr_plan_reltn[pos3].auth_info[pos4].
			auth_type_cd = input->auth_type_cd
	endif
	if(input->cert_status_cd > -1)
		set pm_obj_req->person.person_person_reltn[pos1].person.person_plan_reltn[pos2].encntr_plan_reltn[pos3].auth_info[pos4].
			cert_status_cd = input->cert_status_cd
	endif
	if(trim(arglist->PriorAuthorization.AuthorizationStartDate,3) > " ")
		set pm_obj_req->person.person_person_reltn[pos1].person.person_plan_reltn[pos2].encntr_plan_reltn[pos3].auth_info[pos4].
			beg_effective_dt_tm  = input->service_beg_dt_tm
	endif
	if(trim(arglist->PriorAuthorization.AuthorizationEndDate,3) > " ")
		set pm_obj_req->person.person_person_reltn[pos1].person.person_plan_reltn[pos2].encntr_plan_reltn[pos3].auth_info[pos4].
			end_effective_dt_tm = input->service_end_dt_tm
	endif
	if(input->comment_txt != c_null_value)
		set pm_obj_req->person.person_person_reltn[pos1].person.person_plan_reltn[pos2].encntr_plan_reltn[pos3].auth_info[pos4].
			comment_txt = input->comment_txt
	endif
	if(size(input->providers,5) > 0)
		set pm_obj_req->person.person_person_reltn[pos1].person.person_plan_reltn[pos2].encntr_plan_reltn[pos3].auth_info[pos4].
			provider_prsnl_id = input->providers[1].provider_id
	endif
 
	;Auth Detail
	set detSize = size(pm_obj_req->person.person_person_reltn[pos1].person.person_plan_reltn[pos2].encntr_plan_reltn[pos3].
		auth_info[pos4].auth_detail,5)
	if(detSize = 0)
		set stat = alterlist(pm_obj_req->person.person_person_reltn[pos1].person.person_plan_reltn[pos2].encntr_plan_reltn[pos3].
		auth_info[pos4].auth_detail,1)
	endif
 	if(input->auth_company != c_null_value)
		set pm_obj_req->person.person_person_reltn[pos1].person.person_plan_reltn[pos2].encntr_plan_reltn[pos3].auth_info[pos4].
			auth_detail[1].auth_company = input->auth_company
	endif
	if(input->phone.number != c_null_value)
		set pm_obj_req->person.person_person_reltn[pos1].person.person_plan_reltn[pos2].encntr_plan_reltn[pos3].auth_info[pos4].
			auth_detail[1].auth_phone_num = input->phone.number
	endif
	if(input->phone.phone_format_cd > -1)
		set pm_obj_req->person.person_person_reltn[pos1].person.person_plan_reltn[pos2].encntr_plan_reltn[pos3].auth_info[pos4].
			auth_detail[1].phone_format_cd = input->phone.phone_format_cd
	endif
	if(input->phone.contact != c_null_value)
		set pm_obj_req->person.person_person_reltn[pos1].person.person_plan_reltn[pos2].encntr_plan_reltn[pos3].auth_info[pos4].
			auth_detail[1].auth_contact = input->phone.contact
	endif
 
 	; Execute Request
 	call UpdatePersonData(null)
 
 	if(pm_obj_rep->status_data.status = "S")
 		set iValidate = 1
 		set auth_reply_out->priorAuthorizationId = input->authorization_id
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("PostInsurance Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: DeleteLock(null) = i2
;  Description: Request 100082 - Remove patient lock
**************************************************************************/
subroutine DeleteLock(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("DeleteLock Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iAPPLICATION = 100000
	set iTASK = 100080
 	set iREQUEST = 100082
 
 	set stat = alterlist(100082_req->person,1)
	set 100082_req->person[1].person_id = input->patient_id
 
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",100082_req,"REC",100082_rep)
	if(100082_rep->status_data.status = "S")
		set iValidate = 1
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("DeleteLock Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
end go
set trace notranslatelock go
