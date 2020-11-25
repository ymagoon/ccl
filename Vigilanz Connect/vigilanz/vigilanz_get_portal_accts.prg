/***********************************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

************************************************************************************
          Date Written:       11/02/2017
          Source file name:   vigilanz_get_portal_accts
          Object name:        vigilanz_get_portal_accts
          Request #:        100045 (PM_SCH_GET_SETUP
          					100040 (PM_SCH_GET_PERSONS)
          Program purpose:    Searches for a list of persons best
										matching the given search criteria.
										Returns all persons that have portal accounts associated
          Tables read: PERSON, PERSON_ALIAS, DM_INFO, ADDRESS, PHONE
          Tables updated:     NONE
          Executing from:     EMISSARY SERVICES
          Special Notes:	  NONE
 ***********************************************************************
                   GENERATED MODIFICATION CONTROL LOG     			   
 ***********************************************************************
 Mod Date     Engineer             Comment                            
 ------------------------------------------------------------------
 001  11/02/17 RJC					Initial Write
 002  03/22/18 RJC					Added version code and copyright block
 003  09/09/19 RJC                  Renamed file and object
 ***********************************************************************/
;drop program snsro_get_portal_accounts go
drop program vigilanz_get_portal_accts go
create program vigilanz_get_portal_accts
 
prompt
 
		"Output to File/Printer/MINE" = "MINE"
		, "Username:" = ""			; Required
		, "Portal User Id:" = ""	; Optional
		, "Patient Id" = 0.0		; Optional
		, "Email Address" = ""		; Optional
		, "First Name" = ""			; Optional
		, "Last Name" = ""			; Optional
		, "Debug Flag" = 0			; Optional. Verbose logging when set to one (1).
 
with OUTDEV, USERNAME, PORTAL_ID, PATIENT_ID, EMAIL, FNAME, LNAME, DEBUG_FLAG
 
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
free record portal_map
record portal_map (
	1 client_mnem = vc
	1 service_url = vc
	1 org_alias_pool_display = vc
	1 org_alias_type_meaning = vc
	1 send_flag_display = vc
	1 sent_flag_display = vc
	1 challenge_question_display = vc
	1 free_text_challenge_question = vc
	1 challenge_answer_display = vc
	1 email_from_phone = vc
	1 is_multi_tenant = vc
	1 iqh_reg_code_set_display = vc
	1 accessexpiredate_display = vc
	1 add_iqh_alias_on_create = vc
	1 iqh_alias_pool_display = vc
	1 iqh_alias_type_meaning = vc
	1 debug_ind = vc
	1 numeric_challenge_answer = vc
	1 send_error_notification = vc
	1 email_subject = vc
	1 email_from_address = vc
	1 email_to_address = vc
)
 
free record person_list
record person_list (
	1 person_cnt = i4
	1 persons[*]
		2 person_id = f8
)
 
free record 100045_req
record 100045_req (
  1 application_number = i4
  1 person_id = f8
  1 style = i2
  1 task_number = i4
)
 
free record 100045_rep
 record 100045_rep (
   1 limit_ind = i2
   1 locked = i2
   1 max = i4
   1 max_encntr = i4
   1 opf = i2
   1 options = vc
   1 phonetic = i2
   1 threshold = f8
   1 title = vc
   1 wildcard = i2
   1 filter [* ]
     2 flag = i2
     2 scenario = i4
     2 display = vc
     2 hidden = i2
     2 meaning = vc
     2 options = vc
     2 required = i2
     2 value = vc
   1 result [* ]
     2 flag = i2
     2 scenario = i4
     2 display = vc
     2 format = vc
     2 meaning = vc
     2 options = vc
     2 sort = i2
   1 limit [* ]
     2 encntr_type_class_cd = f8
     2 date_option = i2
     2 num_days = i2
   1 exact_match = f8
   1 percent_top = f8
   1 simple_percent = f8
   1 cutoff_mode_flag = i2
   1 family_limit [* ]
     2 family_reltn_limit = vc
   1 max_mpi = i4
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
   1 common_first = vc
   1 common_last = vc
   1 common_combo = vc
   1 netrics_on = i2
 )
 
free record 100040_req
record 100040_req (
  1 debug = i2
  1 max = i2
  1 opf = i2
  1 options = vc
  1 person_id = f8
  1 return_all = i2
  1 security = i2
  1 style = i2
  1 threshold = f8
  1 user_id = f8
  1 user_name = vc
  1 filter [*]
    2 flag = i2
    2 meaning = vc
    2 options = vc
    2 phonetic = i2
    2 value = vc
    2 weight = f8
    2 values [*]
      3 value = vc
  1 result [*]
    2 flag = i2
    2 meaning = vc
    2 options = vc
  1 exact_match = f8
  1 percent_top = f8
  1 simple_percent = f8
  1 cutoff_mode_flag = i2
  1 show_pats_no_encntrs = i2
  1 calling_application = i2
  1 search_all_logical_domains_ind = i2
  1 suppress_held_records_ind = i2
  1 person_list_ind = i2
  1 person_list [*]
    2 person_id = f8
  1 exclude_prsnl_from_search_ind = i2
)
 
free record 100040_rep
record 100040_rep (
	1  filter_str = vc
	1  person[*]
		2  person_id = f8
		2 address1 = vc
		2 address2 = vc
		2 age = vc
		2 alias_mrn = vc
		2 alias_pool_cd_mrn = vc
		2 alias_ssn = vc
		2 alias_pool_cd_ssn = vc
		2 shn_ver_code = c3
		2 nhn_ver_code = c3
		2 alt_char_name = vc
		2 birth_date = dq8
		2 abs_birth_date = vc
		2 birth_prec_flag = i2
		2 birth_tz = i4
		2 city = vc
		2 deceased = vc
		2 ethnic_group = vc
		2 gender = vc
		2 language = vc
		2 last_encounter_date = dq8
		2 maiden_name = vc
		2 marital_status = vc
		2 mothers_maiden_name = vc
		2 name = vc
		2 nationality = vc
		2 person_type = vc
		2 phone = vc
		2 race = vc
		2 religion = vc
		2 species = vc
		2 state = vc
		2 vip = vc
		2 weight = f8
		2 zipcode = vc
		2 shn_province = vc
		2 nhn_province = vc
		2 billing_entity_name = vc
		2 acct_current_balance = f8.0
		2 acct_bad_debt_balance = f8.0
		2 pft_acct_id  = f8
		2 any_name_id = f8
		2 any_name_full = vc
		2 response_cd_display = vc
		2 archive_cd_display = vc
		2 archive_cd_meaning = vc
		2 deceased_dt_tm = dq8
		2 deceased_dt_tm_prec_flag = i2
		2 deceased_tz = i4
		2 paf_key = vc
		2 ppr_guar_reltns_ind = i2
		2 ppr_guar_reltns[*]
			3 person_id = f8
		2 primary_care_trust = vc
		2 source_version_number = vc
	1 status_data
		2 status = c1
		2 subeventstatus[1]
			3 operationname = vc
			3 operationstatus = c1
			3 targetobjectname = vc
			3 targetobjectvalue = vc
	1 search_method_ind = i4
	1 debug_text = vc
)
 
free record portal_accts_rep
 record portal_accts_rep (
 	1 portal_accounts[*]
 		2 person_id				= f8
		2 active				= i2
		2 first_name 			= vc
		2 middle_name 			= vc
		2 last_name 			= vc
		2 birth_date_time 		= dq8
		2 email_address 		= vc
		2 gender
			3 id 				= f8
			3 name 				= vc
		2 address[*]
			3 address_id 		= f8
			3 address_type_cd 	= f8
			3 address_type_disp = vc
			3 address_type_mean = vc
			3 street_addr 		= vc
			3 street_addr2 		= vc
			3 city 				= vc
			3 state_cd 			= f8
			3 state_disp 		= vc
			3 state_mean 		= vc
			3 zipcode 			= vc
		2 phone[*]
			3 phone_id 			= f8
	        3 phone_type_cd 	= f8
	        3 phone_type_disp 	= vc
	        3 phone_type_mean 	= vc
	        3 phone_num 		= vc
	        3 sequence_nbr 		= i4
		2 password_hint 		= vc ; NA in Millennium
		2 password_reset_question = vc ;NA in Millennium
		2 portal_account_id 	= vc
		2 portal_account_name 	= vc ; NA in Millennium
		2 portal_user_id 		= vc ; NA in Millennium. Only stored in Cerner Health
		2 receive_email_notifications = i2
		2 ssn 					= vc
		2 proxy_accounts[*]
			3 proxy_portal_account_id = f8
			3 relation
				4 id 		= f8
				4 name 		= vc
			3 valid_from_date = dq8
			3 valid_to_date	= dq8
			3 security_class
				4 id		= f8
				4 name 		= vc
			3 status
				4 id 		= f8
				4 name 		= vc
	1 audit
		2 user_id             = f8
		2 user_firstname      = vc
		2 user_lastname       = vc
		2 patient_id          = f8
		2 patient_firstname   = vc
		2 patient_lastname    = vc
		2 service_version     = vc
	1 status_data
		2 status = c1
		2 subeventstatus[1]
			3 OperationName 	= c25
			3 OperationStatus 	= c1
			3 TargetObjectName 	= c25
			3 TargetObjectValue = vc
			3 Code 				= c4
			3 Description 		= vc
)
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
declare sUserName 					= vc with protect, noconstant("")
declare sPortalId					= vc with protect, noconstant("")
declare dPatientId					= f8 with protect, noconstant(0.0)
declare sEmail						= vc with protect, noconstant("")
declare sFirstName	 				= vc with protect, noconstant("")
declare sLastName	 				= vc with protect, noconstant("")
declare iDebugFlag					= i2 with protect, noconstant(0)
declare dPrsnlId					= f8 with protect, noconstant(0.0)
 
declare c_alias_pool_cd = f8 with protect, noconstant(0.0) 				;CS 263
declare c_alias_type_cd = f8 with protect, noconstant(0.0)				;CS 4
declare c_patient_portal_reg_cd = f8 with protect, noconstant(0.0)		;CS 356
declare c_challenge_question_disp_cd = f8 with protect, noconstant(0.0)	;CS 356
declare c_challenge_answer_disp_cd = f8 with protect, noconstant(0.0)	;CS 356
declare c_invite_sent_cd = f8 with protect, noconstant(0.0)				;CS 101283
declare c_invite_to_send_cd = f8 with protect, noconstant(0.0)			;CS 101283
declare c_email_address_cd = f8 with protect, constant(uar_get_code_by("MEANING",212,"EMAIL"))
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
set sUserName 					= trim($USERNAME,3)
set sPortalId					= trim($PORTAL_ID,3)
set dPatientId					= cnvtreal($PATIENT_ID)
set sEmail						= trim($EMAIL,3)
set sFirstName	 				= trim($FNAME,3)
set sLastName	 				= trim($LNAME,3)
set iDebugFlag					= $DEBUG_FLAG
set dPrsnlId					= GetPrsnlIDfromUserName(sUserName) ;defined in snsro_common
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetPortalMappings(null) = i2 with protect
declare GetByPortalId(null)		= i2 with protect
declare GetByEmail(null)		= i2 with protect
declare PersonSearch(null) 		= i2 with protect
declare PostAmble(null) 		= null with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
	; Validate username
	set iRet = PopulateAudit(sUserName, 0.0, portal_accts_rep, sVersion)
	if(iRet = 0)
	  call ErrorHandler2("GET PORTAL ACCTS", "F", "User is invalid", "Invalid User for Audit.",
	  "1001",build("Invalid user: ",sUserName), portal_accts_rep)
	  go to exit_script
	endif
 
	; Validate Org has Cerner Portal  and get portal mappings
	set iRet = GetPortalMappings(null)
	if(iRet = 0)
		call ErrorHandler2("GET PORTAL ACCTS", "F", "Validate Portal Setup","Health System does not have Cerner Portal",
		"9999","Health System does not have Cerner Portal", portal_accts_rep)
		go to exit_script
	endif
 
	; Get persons by PortalId
	if(sPortalId > " ")
		set iRet = GetByPortalId(null)
		if(iRet = 0)
			call ErrorHandler2("GET PORTAL ACCTS", "F", "PortalId Search", build2("No persons found for portal id: ",sPortalId),
			"9999","No persons found", portal_accts_rep)
			go to exit_script
		else
			go to post_amble
		endif
	endif
 
	; Get persons by PatientId
	if(dPatientId > 0)
		set stat = alterlist(person_list->persons,1)
		set person_list->persons[1].person_id = dPatientId
		set person_list->person_cnt = 1
		go to post_amble
	 endif
 
	 ; Get persons by email
	 if(sEmail > " ")
	 	set iRet = GetByEmail(null)
		if(iRet = 0)
			call ErrorHandler2("GET PORTAL ACCTS", "F", "Email Search", build2("No persons found for email: ",sEmail),
			"9999","No persons found",portal_accts_rep)
			go to exit_script
		else
			go to post_amble
		endif
	 endif
 
	; Patient search if neither PortalId nor PatientId is provided and FirstName and LastName are provided
	if(sFirstName > " " or sLastName > " ")
		set iRet = PersonSearch(null)
		if(iRet = 0)
			call ErrorHandler2("GET PORTAL ACCTS", "F", "Name Search", build2("No Persons found for name ",sFirstName," ",sLastName),
			"9999","No Portal Accounts Found", portal_accts_rep)
			go to exit_script
		else
			go to post_amble
		endif
	endif
 
#POST_AMBLE
 
	 ;Finalize record structure and validate portal accounts exist
	 call PostAmble(null)
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
	set JSONout = CNVTRECTOJSON(portal_accts_rep)
 
	if(idebugFlag > 0)
		set file_path = logical("ccluserdir")
		set _file = build2(trim(file_path),"/snsro_get_portal_accounts.json")
		call echo(build2("_file : ", _file))
		call echojson(portal_accts_rep, _file, 0)
		call echorecord(portal_accts_rep)
		call echo(JSONout)
	endif
 
	if(validate(_MEMORY_REPLY_STRING))
		set _MEMORY_REPLY_STRING = trim(JSONout,3)
	endif

#EXIT_VERSION
 /*************************************************************************
;  Name:  GetPortalMappings(null)
;  Description: Check DM_INFO to verify mappings for portal setup
**************************************************************************/
subroutine GetPortalMappings(null)
	if(idebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetPortalMappings Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	select into "nl:"
	info_name = trim(di.info_name,3)
	from dm_info di
	where di.info_domain = "IQH_PM_REGISTRATION"
	detail
		case(info_name)
			of "CLIENT_MNEM":	portal_map->client_mnem = trim(di.info_char,3)
			of "SERVICE_URL":		portal_map->service_url = trim(di.info_char,3)
			of "ORG_ALIAS_POOL_DISPLAY":	portal_map->org_alias_pool_display = trim(di.info_char,3)
			of "ORG_ALIAS_TYPE_MEANING":	portal_map->org_alias_type_meaning = trim(di.info_char,3)
			of "SEND_FLAG_DISPLAY":	portal_map->send_flag_display = trim(di.info_char,3)
			of "SENT_FLAG_DISPLAY":	portal_map->sent_flag_display = trim(di.info_char,3)
			of "CHALLENGE_QUESTION_DISPLAY":	portal_map->challenge_question_display = trim(di.info_char,3)
			of "FREE_TEXT_CHALLENGE_QUESTION":	portal_map->free_text_challenge_question = trim(di.info_char,3)
			of "CHALLENGE_ANSWER_DISPLAY":	portal_map->challenge_answer_display = trim(di.info_char,3)
			of "EMAIL_FROM_PHONE":	portal_map->email_from_phone = trim(di.info_char,3)
			of "IS_MULTI_TENANT":	portal_map->is_multi_tenant = trim(di.info_char,3)
			of "IQH_REG_CODE_SET_DISPLAY":	portal_map->iqh_reg_code_set_display = trim(di.info_char,3)
			of "ACCESSEXPIREDATE_DISPLAY":	portal_map->accessexpiredate_display = trim(di.info_char,3)
			of "ADD_IQH_ALIAS_ON_CREATE":	portal_map->add_iqh_alias_on_create = trim(di.info_char,3)
			of "IQH_ALIAS_POOL_DISPLAY":	portal_map->iqh_alias_pool_display = trim(di.info_char,3)
			of "IQH_ALIAS_TYPE_MEANING":	portal_map->iqh_alias_type_meaning = trim(di.info_char,3)
			of "DEBUG_IND":	portal_map->debug_ind = trim(di.info_char,3)
			of "NUMERIC_CHALLENGE_ANSWER":	portal_map->numeric_challenge_answer = trim(di.info_char,3)
			of "SEND_ERROR_NOTIFICATION":	portal_map->send_error_notification = trim(di.info_char,3)
			of "EMAIL_SUBJECT":	portal_map->email_subject = trim(di.info_char,3)
			of "EMAIL_FROM_ADDRESS":	portal_map->email_from_address = trim(di.info_char,3)
			of "EMAIL_TO_ADDRESS":	portal_map->email_to_address = trim(di.info_char,3)
		endcase
	with nocounter
 
	set iValidate = 0
	if(portal_map->service_url > " ")
		set iValidate = 1
		set c_alias_pool_cd = uar_get_code_by("DISPLAYKEY",263,portal_map->iqh_alias_pool_display)
		set c_alias_type_cd = uar_get_code_by("MEANING",4,portal_map->iqh_alias_type_meaning)
		set c_challenge_question_disp_cd = uar_get_code_by("DISPLAYKEY",356,portal_map->challenge_question_display)
		set c_challenge_answer_disp_cd = uar_get_code_by("DISPLAYKEY",356,portal_map->challenge_answer_display)
		set c_patient_portal_reg_cd = uar_get_code_by("DISPLAYKEY",356,portal_map->iqh_reg_code_set_display)
		set c_invite_sent_cd = uar_get_code_by("DISPLAYKEY",101283,portal_map->sent_flag_display)
		set c_invite_to_send_cd = uar_get_code_by("DISPLAYKEY",101283,portal_map->send_flag_display)
	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetPortalMappings Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
	return(iValidate)
end ;End Subroutine
 
/*************************************************************************
;  Name: GetByPortalId(null)
;  Description: Get person id by patient portal id
**************************************************************************/
subroutine GetByPortalId(null)
	if(idebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetByPortalId Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
 
	select into "nl:"
	from person_alias pa
	where pa.alias = sPortalId
		and pa.alias_pool_cd = c_alias_pool_cd
		and pa.person_alias_type_cd = c_alias_type_cd
		and pa.active_ind = 1
		and pa.beg_effective_dt_tm < sysdate
		and pa.end_effective_dt_tm > sysdate
	head report
		x = 0
	detail
		x = x + 1
		stat = alterlist(person_list->persons,x)
		person_list->persons[x].person_id = pa.person_id
	foot report
		person_list->person_cnt = x
		iValidate = x
	with nocounter
 
	if(idebugFlag > 0)
		call echo(concat("GetByPortalId Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
	return(iValidate)
end ;End Subroutine
 
/*************************************************************************
;  Name: GetByEmail(null)
;  Description: Search for patients by email
**************************************************************************/
subroutine GetByEmail(null)
	if(idebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetByEmail Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
 
	select into "nl:"
	from address a
	where a.address_type_cd = c_email_address_cd
		and a.active_ind = 1
		and a.beg_effective_dt_tm < sysdate
		and a.end_effective_dt_tm > sysdate
		and a.parent_entity_name = "PERSON"
		and cnvtupper(trim(a.street_addr,3)) = cnvtupper(sEmail)
	head report
		x = 0
	detail
		x = x + 1
		stat = alterlist(person_list->persons,x)
 
		person_list->persons[x].person_id = a.parent_entity_id
	foot report
		person_list->person_cnt = x
		iValidate = x
	with nocounter
 
	if(idebugFlag > 0)
		call echo(concat("GetByEmail Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
	return(iValidate)
end ;End Subroutine
 
/*************************************************************************
;  Name: PersonSearch(null)
;  Description: Search by firstname and/or lastname
**************************************************************************/
subroutine PersonSearch(null)
	if(idebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PersonSearch Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
 
	declare iAPPLICATION = i4
	declare iTASK = i4
	declare iREQUEST = i4
 
	set iAPPLICATION = 600005
	set iTASK = 100040
 
	; Get filter/result options for the user doing the search
	set iREQUEST = 100045
 
	set 100045_req->application_number = iAPPLICATION
	set 100045_req->person_id = dPrsnlId
	set 100045_req->style = 2
 
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",100045_req,"REC",100045_rep)
 
	if(100045_rep->status_data.status = "S")
		; Perform the name search
		set iREQUEST = 100040
 
		declare fname_search = vc
		declare lname_search = vc
		set fname_search = cnvtupper(build(sFirstName,"*"))
		set lname_search = cnvtupper(build(sLastName,"*"))
 
		set 100040_req->max = 100045_rep->max
		set 100040_req->opf = 100045_rep->opf
		set 100040_req->options = "1000600005000000000   1"
		set 100040_req->style = 2
		set 100040_req->threshold = 100045_rep->threshold
 
		set stat = alterlist(100040_req->filter,2)
		set 100040_req->filter[1].flag = 21
		set 100040_req->filter[1].phonetic = 1
		set 100040_req->filter[1].value = lname_search
 
		set 100040_req->filter[2].flag = 17
		set 100040_req->filter[2].phonetic = 1
		set 100040_req->filter[2].value = fname_search
 
		set stat = alterlist(100040_req->result,size(100045_rep->result,5))
		for(i = 1 to size(100045_rep->result,5))
			set 100040_req->result[i].flag = 100045_rep->result[i].flag
			set 100040_req->result[i].meaning = 100045_rep->result[i].meaning
			set 100040_req->result[i].options = 100045_rep->result[i].options
		endfor
 
		set 100040_req->show_pats_no_encntrs = 1
		set 100040_req->calling_application = 2
 
		set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",100040_req,"REC",100040_rep)
 
		if(100040_rep->status_data.status = "S")
			set iValidate = size(100040_rep->person,5)
			set stat = alterlist(person_list->persons,iValidate)
			set person_list->person_cnt = iValidate
			for(i = 1 to iValidate)
				set person_list->persons[i].person_id = 100040_rep->person[i].person_id
			endfor
		endif
	endif
 
	if(idebugFlag > 0)
		call echo(concat("PersonSearch Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
	return(iValidate)
end ;End Subroutine
 
/*************************************************************************
;  Name: PostAmble(null)
;  Description: Build the record structure to send back to Emissary
**************************************************************************/
subroutine PostAmble(null)
	if(idebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostAmble Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	;Find portal accounts by the person_alias
	declare num = i4
	select
		if(person_list->person_cnt > 0)
			from person p
				, person_alias pa
				,(left join address a on a.parent_entity_id = pa.person_id
					and a.parent_entity_name = "PERSON"
	 				and a.active_ind = 1
	 				and a.beg_effective_dt_tm < sysdate
	 				and a.end_effective_dt_tm > sysdate)
				,(left join phone ph on ph.parent_entity_id = pa.person_id
					and ph.parent_entity_name = "PERSON"
	 				and ph.active_ind = 1
	 				and ph.beg_effective_dt_tm < sysdate
	 				and ph.end_effective_dt_tm > sysdate)
			where expand(num,1,person_list->person_cnt,pa.person_id,person_list->persons[num].person_id)
				and pa.alias_pool_cd = c_alias_pool_cd
				and pa.person_alias_type_cd = c_alias_type_cd
				and pa.active_ind = 1
				and pa.beg_effective_dt_tm < sysdate
				and pa.end_effective_dt_tm > sysdate
			and p.person_id = pa.person_id
			order by p.name_last, p.name_first, pa.alias, a.address_id, ph.phone_id
		else
			from person_alias pa
				,(left join address a on a.parent_entity_id = pa.person_id
					and a.parent_entity_name = "PERSON"
	 				and a.active_ind = 1
	 				and a.beg_effective_dt_tm < sysdate
	 				and a.end_effective_dt_tm > sysdate)
				,(left join phone ph on ph.parent_entity_id = pa.person_id
					and ph.parent_entity_name = "PERSON"
	 				and ph.active_ind = 1
	 				and ph.beg_effective_dt_tm < sysdate
	 				and ph.end_effective_dt_tm > sysdate)
	 			,person p
			where 	pa.alias_pool_cd = c_alias_pool_cd
				and pa.person_alias_type_cd = c_alias_type_cd
				and pa.active_ind = 1
				and pa.beg_effective_dt_tm < sysdate
				and pa.end_effective_dt_tm > sysdate
			and p.person_id = pa.person_id
			order by p.name_last, p.name_first, pa.alias, a.address_id, ph.phone_id
		endif
	into "nl:"
	from dummyt
	head report
		x = 0
		stat = alterlist(portal_accts_rep->portal_accounts,1000)
	head pa.alias
		x = x + 1
		y = 0
		z = 0
		if(mod(x,100) = 1 and x > 1000)
			stat = alterlist(portal_accts_rep->portal_accounts,x + 99)
		endif
 
		portal_accts_rep->portal_accounts[x].person_id = pa.person_id
		portal_accts_rep->portal_accounts[x].active = 1
		portal_accts_rep->portal_accounts[x].portal_account_id = pa.alias
		portal_accts_rep->portal_accounts[x].receive_email_notifications = 1
		portal_accts_rep->portal_accounts[x].birth_date_time = p.birth_dt_tm
 		portal_accts_rep->portal_accounts[x].first_name = p.name_first
 		portal_accts_rep->portal_accounts[x].middle_name = p.name_middle
 		portal_accts_rep->portal_accounts[x].last_name = p.name_last
 		portal_accts_rep->portal_accounts[x].gender.id = p.sex_cd
 		portal_accts_rep->portal_accounts[x].gender.name = uar_get_code_display(p.sex_cd)
 	head a.address_id
 		if(a.address_type_cd = uar_get_code_by("MEANING",212,"EMAIL"))
 			portal_accts_rep->portal_accounts[x].email_address = a.street_addr
 		else
 			y = y + 1
 			stat = alterlist(portal_accts_rep->portal_accounts[x].address,y)
 
 			portal_accts_rep->portal_accounts[x].address[y].address_id = a.address_id
 			portal_accts_rep->portal_accounts[x].address[y].address_type_cd = a.address_type_cd
 			portal_accts_rep->portal_accounts[x].address[y].address_type_disp = uar_get_code_display(a.address_type_cd)
 			portal_accts_rep->portal_accounts[x].address[y].address_type_mean = uar_get_code_meaning(a.address_type_cd)
 			portal_accts_rep->portal_accounts[x].address[y].street_addr = a.street_addr
 			portal_accts_rep->portal_accounts[x].address[y].street_addr2 = a.street_addr2
 			portal_accts_rep->portal_accounts[x].address[y].city = a.city
 			portal_accts_rep->portal_accounts[x].address[y].state_cd = a.state_cd
 			portal_accts_rep->portal_accounts[x].address[y].state_disp = uar_get_code_display(a.state_cd)
 			portal_accts_rep->portal_accounts[x].address[y].state_mean = uar_get_code_meaning(a.state_cd)
 			portal_accts_rep->portal_accounts[x].address[y].zipcode = a.zipcode
 		endif
 	head ph.phone_id
 		z = z + 1
 		stat = alterlist(portal_accts_rep->portal_accounts[x].phone,z)
 
 		portal_accts_rep->portal_accounts[x].phone[z].phone_id = ph.phone_id
 		portal_accts_rep->portal_accounts[x].phone[z].phone_type_cd = ph.phone_type_cd
 		portal_accts_rep->portal_accounts[x].phone[z].phone_type_disp = uar_get_code_display(ph.phone_type_cd)
 		portal_accts_rep->portal_accounts[x].phone[z].phone_type_mean = uar_get_code_meaning(ph.phone_type_cd)
 		portal_accts_rep->portal_accounts[x].phone[z].phone_num = ph.phone_num
 		portal_accts_rep->portal_accounts[x].phone[z].sequence_nbr = ph.seq
	foot report
		stat = alterlist(portal_accts_rep->portal_accounts,x)
	with nocounter
 
 	if(size(portal_accts_rep->portal_accounts,5) > 0)
	 	; Get SSN
	 	select into "nl:"
	 	from (dummyt d with seq = size(portal_accts_rep->portal_accounts,5))
	 		, person_alias pa
 
	 	plan d
	 	join pa where pa.person_id = portal_accts_rep->portal_accounts[d.seq].person_id
	 				and pa.person_alias_type_cd = value(uar_get_code_by("MEANING",4,"SSN"))
					and pa.active_ind = 1
					and pa.beg_effective_dt_tm < sysdate
					and pa.end_effective_dt_tm > sysdate
		detail
			portal_accts_rep->portal_accounts[d.seq].ssn = pa.alias
		with nocounter
 
		/*; Get Proxy Accounts
		select into "nl:"
		from (dummyt d with seq = size(portal_accts_rep->portal_accounts,5))
		, person_person_reltn ppr
		plan d
		join ppr where ppr.p */
 
		; Update status with success
		call ErrorHandler2("GET PORTAL ACCTS", "S", "Successful", "Transaction completed successfully.",
			"0000","Transaction completed successfully.", portal_accts_rep)
	else
		call ErrorHandler2("GET PORTAL ACCTS", "F", "Post Amble", build2("No portal accounts found with current input parameters."),
			"9999","No persons found",portal_accts_rep)
			go to exit_script
	endif
 
	if(idebugFlag > 0)
		call echo(concat("PostAmble Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end ;End Subroutine
 
 
end go
set trace notranslatelock go
