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
      Source file name:  	vigilanz_get_pharmacy_disc
      Object name:       	vigilanz_get_pharmacy_disc
      Program purpose:    	Get list of pharmacies available based on search params
      Tables read:
      Tables updated:   	NONE
      Executing from:   	MPages Discern Web Service
      Special Notes:      	NONE
*******************************************************************************
                    MODIFICATION CONTROL LOG                      				
********************************************************************************
 Mod 	Date     	Engineer             	Comment                            	
 --- 	-------- 	-------------------- 	-----------------------------------	
 001	04/04/18	RJC						Initial Write
 002	04/23/18	RJC						Object changes around pharmacy types
 003    09/09/19    RJC                     Renamed file and object
 *******************************************************************************/
;drop program snsro_get_pharmacy_discovery go
drop program vigilanz_get_pharmacy_disc go
create program vigilanz_get_pharmacy_disc
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username:" = ""        	;Required
		, "PharmacyName" = ""		;Required if NCPDP not set
		, "NCPDP" = ""				;Required if PharmacyName not set
		, "City" = ""				;Optional
		, "State" = ""				;Optional
		, "Zip" = ""				;Optional
		, "PharmacyTypes" = ""		;Optional list of pharmacy types
		, "Debug Flag:" = ""		;Optional
 
with OUTDEV, USERNAME, PHARM_NAME, NCPDP, CITY, STATE, ZIP, PHARM_TYPES, DEBUG_FLAG
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
 
;3202502 - Pharmacy_RetrievPharmaciesByCriteria
free record 3202502_req
record 3202502_req (
  1 max_threshold_default_ind = i2
  1 max_threshold = i2
  1 active_status_flag = i2
  1 transmit_capability_flag = i2
  1 name = vc
  1 street_address = vc
  1 city = vc
  1 state = vc
  1 postal_code = vc
  1 phone_number = c10
  1 specialty_types
    2 mail_order_ind = i2
    2 retail_ind = i2
    2 specialty_ind = i2
    2 twenty_four_hour_ind = i2
    2 long_term_ind = i2
  1 service_levels
    2 new_rx_ind = i2
    2 ref_req_ind = i2
    2 epcs_ind = i2
    2 cancel_rx_ind = i2
)
 
free record 3202502_rep
record 3202502_rep (
  1 search_result_status_flag = i2
  1 pharmacies [*]
    2 id = vc
    2 version_dt_tm = dq8
    2 pharmacy_name = vc
    2 pharmacy_number = vc
    2 active_begin_dt_tm = dq8
    2 active_end_dt_tm = dq8
    2 pharmacy_contributions [*]
      3 contributor_system_cd = f8
      3 version_dt_tm = dq8
      3 contribution_id = vc
      3 pharmacy_name = vc
      3 pharmacy_number = vc
      3 active_begin_dt_tm = dq8
      3 active_end_dt_tm = dq8
      3 addresses [*]
        4 type_cd = f8
        4 type_seq = i2
        4 street_address_lines [*]
          5 street_address_line = vc
        4 city = vc
        4 state = vc
        4 postal_code = vc
        4 country = vc
        4 cross_street = vc
      3 telecom_addresses [*]
        4 type_cd = f8
        4 type_seq = i2
        4 contact_method_cd = f8
        4 value = vc
        4 extension = vc
      3 service_level = vc
      3 partner_account = vc
      3 service_levels
        4 new_rx_ind = i2
        4 ref_req_ind = i2
        4 epcs_ind = i2
        4 cancel_rx_ind = i2
      3 specialties
        4 mail_order_ind = i2
        4 retail_ind = i2
        4 specialty_ind = i2
        4 twenty_four_hour_ind = i2
        4 long_term_ind = i2
    2 primary_business_address
      3 type_cd = f8
      3 type_seq = i2
      3 street_address_lines [*]
        4 street_address_line = vc
      3 city = vc
      3 state = vc
      3 postal_code = vc
      3 country = vc
      3 cross_street = vc
    2 primary_business_telephone
      3 type_cd = f8
      3 type_seq = i2
      3 contact_method_cd = f8
      3 value = vc
      3 extension = vc
    2 primary_business_fax
      3 type_cd = f8
      3 type_seq = i2
      3 contact_method_cd = f8
      3 value = vc
      3 extension = vc
    2 primary_business_email
      3 type_cd = f8
      3 type_seq = i2
      3 contact_method_cd = f8
      3 value = vc
      3 extension = vc
  1 status_data
    2 status = c1
    2 SubEventStatus [*]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
)
 
;3202509 - Pharmacy_RetrievePharmaciesByNCPDPIds
free record 3202509_req
record 3202509_req (
  1 ncpdp_ids [*]
    2 ncpdp_id = vc
)
 
free record 3202509_rep
record 3202509_rep (
  1 pharmacies [*]
    2 id = vc
    2 version_dt_tm = dq8
    2 pharmacy_name = vc
    2 pharmacy_number = vc
    2 active_begin_dt_tm = dq8
    2 active_end_dt_tm = dq8
    2 pharmacy_contributions [*]
      3 contributor_system_cd = f8
      3 version_dt_tm = dq8
      3 contribution_id = vc
      3 pharmacy_name = vc
      3 pharmacy_number = vc
      3 active_begin_dt_tm = dq8
      3 active_end_dt_tm = dq8
      3 addresses [*]
        4 type_cd = f8
        4 type_seq = i2
        4 street_address_lines [*]
          5 street_address_line = vc
        4 city = vc
        4 state = vc
        4 postal_code = vc
        4 country = vc
        4 cross_street = vc
      3 telecom_addresses [*]
        4 type_cd = f8
        4 type_seq = i2
        4 contact_method_cd = f8
        4 value = vc
        4 extension = vc
      3 service_level = vc
      3 partner_account = vc
      3 service_levels
        4 new_rx_ind = i2
        4 ref_req_ind = i2
        4 epcs_ind = i2
        4 cancel_rx_ind = i2
      3 specialties
        4 mail_order_ind = i2
        4 retail_ind = i2
        4 specialty_ind = i2
        4 twenty_four_hour_ind = i2
        4 long_term_ind = i2
    2 primary_business_address
      3 type_cd = f8
      3 type_seq = i2
      3 street_address_lines [*]
        4 street_address_line = vc
      3 city = vc
      3 state = vc
      3 postal_code = vc
      3 country = vc
      3 cross_street = vc
    2 primary_business_telephone
      3 type_cd = f8
      3 type_seq = i2
      3 contact_method_cd = f8
      3 value = vc
      3 extension = vc
    2 primary_business_fax
      3 type_cd = f8
      3 type_seq = i2
      3 contact_method_cd = f8
      3 value = vc
      3 extension = vc
    2 primary_business_email
      3 type_cd = f8
      3 type_seq = i2
      3 contact_method_cd = f8
      3 value = vc
      3 extension = vc
  1 transaction_status
    2 status = c1
    2 error_msg = vc
)
 
; Final Reply
free record pharm_discovery_reply_out
record pharm_discovery_reply_out(
	1 pharmacies[*]
		2 pharmacy_id		= vc
		2 name				= vc
		2 ncpdp				= vc
		2 is_eprescribing	= i2
		2 pharmacy_types[*]
			3 id = vc
			3 name = vc
		2 address
			3 address_id                = f8
			3 address_type_cd           = f8
			3 address_type_disp         = vc
			3 address_type_mean         = vc
			3 street_addr               = vc
			3 street_addr2              = vc
			3 city                      = vc
			3 state_cd                  = f8
			3 state_disp                = vc
			3 state_mean                = vc
			3 zipcode                   = vc
			3 country_cd				= f8
			3 country_disp				= vc
		2 phone[2]
			3  phone_id               	= f8
			3  phone_type_cd          	= f8
			3  phone_type_disp        	= vc
			3  phone_type_mean        	= vc
			3  phone_num              	= vc
			3  sequence_nbr		   		= i2
	1 audit
		2 user_id             	= f8
		2 user_firstname        = vc
		2 user_lastname         = vc
		2 patient_id            = f8
		2 patient_firstname     = vc
		2 patient_lastname      = vc
		2 service_version       = vc
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
;Input
declare sUserName			= vc with protect, noconstant("")
declare sPharmacyName		= vc with protect, noconstant("")
declare sNCPDP				= vc with protect, noconstant("")
declare sCity				= vc with protect, noconstant("")
declare sState				= vc with protect, noconstant("")
declare sZip				= vc with protect, noconstant("")
declare sPharmTypes			= vc with protect, noconstant("")
declare iDebugFlag			= i2 with protect, noconstant(0)
 
;Other
declare iMailOrder			= i2 with protect, noconstant(0)
declare iRetail				= i2 with protect, noconstant(0)
declare i24hr				= i2 with protect, noconstant(0)
declare iLongTerm			= i2 with protect, noconstant(0)
declare iSpecialty			= i2 with protect, noconstant(0)
 
; Constants
declare c_fax_bus_phone_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",43,"FAX BUS"))
 
/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ParseTypes(null)				= null with protect
declare GetPharmaciesByCriteria(null)	= i2 with protect ;Request 3202502 - Pharmacy_RetrievePharmaciesByCriteria
declare GetPharmaciesByNcpdp(null)		= i2 with protect ;Request 3202509 - Pharmacy_RetrievePharmaciesByNCPDPIds
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
set sUserName			= trim($USERNAME, 3)
set sPharmacyName		= trim($PHARM_NAME, 3)
set sNCPDP				= trim($NCPDP, 3)
set sCity				= trim($CITY, 3)
set sState				= trim($STATE, 3)
set sZip				= trim($ZIP, 3)
set sPharmTypes			= trim($PHARM_TYPES)
set iDebugFlag			= cnvtint($DEBUG_FLAG)
 
if(idebugFlag > 0)
	call echo(build("sUserName -> ",sUserName))
	call echo(build("sPharmacyName -> ",sPharmacyName))
	call echo(build("sNCPDP -> ",sNCPDP))
	call echo(build("sCity -> ",sCity))
	call echo(build("sState -> ",sState))
	call echo(build("sZip -> ",sZip))
	call echo(build("sPharmTypes -> ",sPharmTypes))
endif
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Validate username
set iRet = PopulateAudit(sUserName, 0.0, pharm_discovery_reply_out, sVersion)
if(iRet = 0)
  call ErrorHandler2("Validate", "F", "GET PHARMACIES DISCOVERY", "Invalid User for Audit.",
  "1001",build("Invalid user: ",sUserName), pharm_discovery_reply_out)
  go to exit_script
endif
 
if(sPharmTypes > " ")
	call ParseTypes(null)
else
	set iRetail = 1
	set iMailOrder = 0
	set i24hr = 0
	set iSpecialty = 0
	set iLongTerm = 0
endif
 
if(sNCPDP > " ")
	;Request 3202509 - Pharmacy_RetrievePharmaciesByNCPDPIds
	set iRet = GetPharmaciesByNcpdp(null)
	if(iRet = 0)
		call ErrorHandler2("Execute", "F", "GET PHARMACIES DISCOVERY", "Could not retrieve pharmacies (3202509).",
	  	"9999","Could not retrieve pharmacies (3202509).", pharm_discovery_reply_out)
	  	go to exit_script
	endif
else
	if(sPharmacyName <= " ")
		call ErrorHandler2("Validate", "F", "GET PHARMACIES DISCOVERY", "Missing URI Parameters: NCPDP or Name.",
  		"9999",build("Either Name or NCPDP is required."), pharm_discovery_reply_out)
  		go to exit_script
  	else
  		;Request 3202502 - Pharmacy_RetrievePharmaciesByCriteria
		set iRet = GetPharmaciesByCriteria(null)
		if(iRet = 0)
			call ErrorHandler2("Execute", "F", "GET PHARMACIES DISCOVERY", "Could not retrieve pharmacies (3202502).",
		  	"9999","Could not retrieve pharmacies (3202502).", pharm_discovery_reply_out)
		  	go to exit_script
		endif
	endif
endif
 
; Set audit to a successful status
call ErrorHandler2("Success", "S", "GET PHARMACIES DISCOVERY", "Completed Successfully.",
"0000","Pharmacies discovery completed successfully.", pharm_discovery_reply_out)
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
  set JSONout = CNVTRECTOJSON(pharm_discovery_reply_out)
 
  if(idebugFlag > 0)
	  call echorecord(pharm_discovery_reply_out)
	  set file_path = logical("ccluserdir")
	  set _file = build2(trim(file_path),"/snsro_get_pharmacy_discovery.json")
	  call echo(build2("_file : ", _file))
	  call echojson(pharm_discovery_reply_out, _file, 0)
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
;  Name: ParseTypes(null) = null
;  Description: Parses pharmacy types list
**************************************************************************/
subroutine ParseTypes(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ParseTypes Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare str = vc
	set str = "-"
	set num = 1
 
	while(str != "")
		set str = trim(piece(sPharmTypes,",",num,""),3)
		if(str != "")
			case(cnvtupper(str))
				of "MAILORDER": set iMailOrder = 1
				of "RETAIL": set iRetail = 1
				of "24HR": set i24hr = 1
				of "LONGTERM": set iLongTerm = 1
				of "SPECIALTY": set iSpecialty = 1
			endcase
			set num = num + 1
		endif
 	endwhile
 
	if(idebugFlag > 0)
		call echo(concat("ParseTypes Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
/*************************************************************************
;  Name: GetPharmaciesByNcpdp(null)		= i2 -- Request 3202509 - Pharmacy_RetrievePharmaciesByNCPDPIds
;  Description: Searches pharmacy by NCPDP Id
**************************************************************************/
subroutine GetPharmaciesByNcpdp(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetPharmaciesByNcpdp Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 3202004
	set iRequest = 3202509
 
	;Setup request parameters
	set stat = alterlist(3202509_req->ncpdp_ids,1)
	set 3202509_req->ncpdp_ids[1].ncpdp_id = sNCPDP
 
	;Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",3202509_req,"REC",3202509_rep)
 
	if(3202509_rep->transaction_status.status != "F")
		set iValidate = 1
		set phaSize = size(3202509_rep->pharmacies,5)
 
		if(phaSize > 0)
			set stat = alterlist(pharm_discovery_reply_out->pharmacies,phaSize)
			for(i = 1 to phaSize)
				set pharm_discovery_reply_out->pharmacies[i].pharmacy_id = 3202509_rep->pharmacies[i].id
				set pharm_discovery_reply_out->pharmacies[i].name = 3202509_rep->pharmacies[i].pharmacy_name
				set pharm_discovery_reply_out->pharmacies[i].ncpdp = 3202509_rep->pharmacies[i].pharmacy_contributions[1].contribution_id
 
				set pharm_discovery_reply_out->pharmacies[i].is_eprescribing =
				3202509_rep->pharmacies[i].pharmacy_contributions[1].service_levels.epcs_ind
 
				if(3202509_rep->pharmacies[i].pharmacy_contributions[1].specialties.mail_order_ind > 0)
					set phSize = size(pharm_discovery_reply_out->pharmacies[i].pharmacy_types,5)
					set phSize = phSize + 1
					set stat = alterlist(pharm_discovery_reply_out->pharmacies[i].pharmacy_types,phSize)
					set pharm_discovery_reply_out->pharmacies[i].pharmacy_types[phSize].name = "MailOrder"
					set pharm_discovery_reply_out->pharmacies[i].pharmacy_types[phSize].name = "MailOrder"
				endif
 
				if(3202509_rep->pharmacies[i].pharmacy_contributions[1].specialties.retail_ind > 0)
					set phSize = size(pharm_discovery_reply_out->pharmacies[i].pharmacy_types,5)
					set phSize = phSize + 1
					set stat = alterlist(pharm_discovery_reply_out->pharmacies[i].pharmacy_types,phSize)
					set pharm_discovery_reply_out->pharmacies[i].pharmacy_types[phSize].id = "Retail"
					set pharm_discovery_reply_out->pharmacies[i].pharmacy_types[phSize].name = "Retail"
				endif
 
				if(3202509_rep->pharmacies[i].pharmacy_contributions[1].specialties.twenty_four_hour_ind > 0)
					set phSize = size(pharm_discovery_reply_out->pharmacies[i].pharmacy_types,5)
					set phSize = phSize + 1
					set stat = alterlist(pharm_discovery_reply_out->pharmacies[i].pharmacy_types,phSize)
					set pharm_discovery_reply_out->pharmacies[i].pharmacy_types[phSize].id = "24hr"
					set pharm_discovery_reply_out->pharmacies[i].pharmacy_types[phSize].name = "24hr"
				endif
 
				if(3202509_rep->pharmacies[i].pharmacy_contributions[1].specialties.long_term_ind > 0)
					set phSize = size(pharm_discovery_reply_out->pharmacies[i].pharmacy_types,5)
					set phSize = phSize + 1
					set stat = alterlist(pharm_discovery_reply_out->pharmacies[i].pharmacy_types,phSize)
					set pharm_discovery_reply_out->pharmacies[i].pharmacy_types[phSize].id = "LongTerm"
					set pharm_discovery_reply_out->pharmacies[i].pharmacy_types[phSize].name = "LongTerm"
				endif
 
				if(3202509_rep->pharmacies[i].pharmacy_contributions[1].specialties.specialty_ind > 0)
					set phSize = size(pharm_discovery_reply_out->pharmacies[i].pharmacy_types,5)
					set phSize = phSize + 1
					set stat = alterlist(pharm_discovery_reply_out->pharmacies[i].pharmacy_types,phSize)
					set pharm_discovery_reply_out->pharmacies[i].pharmacy_types[phSize].id = "Specialty"
					set pharm_discovery_reply_out->pharmacies[i].pharmacy_types[phSize].name = "Specialty"
				endif
 
				; Address
				set pharm_discovery_reply_out->pharmacies[i].address.address_type_cd =
				3202509_rep->pharmacies[i].primary_business_address.type_cd
 
				set pharm_discovery_reply_out->pharmacies[i].address.address_type_disp =
				uar_get_code_display(3202509_rep->pharmacies[i].primary_business_address.type_cd)
 
				set pharm_discovery_reply_out->pharmacies[i].address.address_type_mean =
				uar_get_code_meaning(3202509_rep->pharmacies[i].primary_business_address.type_cd)
 
				for(st = 1 to size(3202509_rep->pharmacies[i].primary_business_address.street_address_lines,5))
					if(st = 1)
						set pharm_discovery_reply_out->pharmacies[i].address.street_addr =
						3202509_rep->pharmacies[i].primary_business_address.street_address_lines[1].street_address_line
					elseif(st = 2)
						set pharm_discovery_reply_out->pharmacies[i].address.street_addr2 =
						3202509_rep->pharmacies[i].primary_business_address.street_address_lines[2].street_address_line
					endif
				endfor
 
				set pharm_discovery_reply_out->pharmacies[i].address.city =
				3202509_rep->pharmacies[i].primary_business_address.city
 
				set pharm_discovery_reply_out->pharmacies[i].address.state_disp =
				3202509_rep->pharmacies[i].primary_business_address.state
 
				set pharm_discovery_reply_out->pharmacies[i].address.country_disp =
				3202509_rep->pharmacies[i].primary_business_address.country
				
				set pharm_discovery_reply_out->pharmacies[i].address.zipcode = 
				3202509_rep->pharmacies[i].primary_business_address.postal_code
 
				;Phone
				set pharm_discovery_reply_out->pharmacies[i].phone[1].sequence_nbr = 
				3202509_rep->pharmacies[i].primary_business_telephone.type_seq
				
				set pharm_discovery_reply_out->pharmacies[i].phone[1].phone_type_cd =
				3202509_rep->pharmacies[i].primary_business_telephone.type_cd
 
				set pharm_discovery_reply_out->pharmacies[i].phone[1].phone_type_disp =
				uar_get_code_display(3202509_rep->pharmacies[i].primary_business_telephone.type_cd)
 
				set pharm_discovery_reply_out->pharmacies[i].phone[1].phone_type_mean =
				uar_get_code_meaning(3202509_rep->pharmacies[i].primary_business_telephone.type_cd)
 
				set pharm_discovery_reply_out->pharmacies[i].phone[1].phone_num =
				3202509_rep->pharmacies[i].primary_business_telephone.value
 
				;Fax
				set pharm_discovery_reply_out->pharmacies[i].phone[1].sequence_nbr = 
				3202509_rep->pharmacies[i].primary_business_fax.type_seq
				
				set pharm_discovery_reply_out->pharmacies[i].phone[2].phone_type_cd = c_fax_bus_phone_type_cd
 
				set pharm_discovery_reply_out->pharmacies[i].phone[2].phone_type_disp =
				uar_get_code_display(c_fax_bus_phone_type_cd)
 
				set pharm_discovery_reply_out->pharmacies[i].phone[2].phone_type_mean =
				uar_get_code_meaning(c_fax_bus_phone_type_cd)
 
				set pharm_discovery_reply_out->pharmacies[i].phone[2].phone_num =
				3202509_rep->pharmacies[i].primary_business_fax.value
			endfor
		endif
	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetPharmaciesByNcpdp Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
/*************************************************************************
;  Name: GetPharmaciesByCriteria(null)	= i2  -- Request 3202502 - Pharmacy_RetrievePharmaciesByCriteria
;  Description: Searches pharmacy by name, address, phone, pharmacy type, etc
**************************************************************************/
subroutine GetPharmaciesByCriteria(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetPharmaciesByCriteria Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 500195
	set iRequest = 3202502
 
	;Setup request parameters
	set 3202502_req->max_threshold = 200
	set 3202502_req->name = sPharmacyName
	set 3202502_req->city = sCity
	set 3202502_req->state = sState
	set 3202502_req->postal_code = sZip
	set 3202502_req->specialty_types.retail_ind = iRetail
	set 3202502_req->specialty_types.mail_order_ind = iMailOrder
	set 3202502_req->specialty_types.twenty_four_hour_ind = i24hr
	set 3202502_req->specialty_types.long_term_ind = iLongTerm
	set 3202502_req->specialty_types.specialty_ind = iSpecialty
 
	;Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",3202502_req,"REC",3202502_rep)
	if(3202502_rep->status_data.status != "F")
		set iValidate = 1
		set phaSize = size(3202502_rep->pharmacies,5)
 
		if(phaSize > 0)
			set stat = alterlist(pharm_discovery_reply_out->pharmacies,phaSize)
			for(i = 1 to phaSize)
				set pharm_discovery_reply_out->pharmacies[i].pharmacy_id = 3202502_rep->pharmacies[i].id
				set pharm_discovery_reply_out->pharmacies[i].name = 3202502_rep->pharmacies[i].pharmacy_name
				set pharm_discovery_reply_out->pharmacies[i].ncpdp = 3202502_rep->pharmacies[i].pharmacy_contributions[1].contribution_id
 
				set pharm_discovery_reply_out->pharmacies[i].is_eprescribing =
				3202502_rep->pharmacies[i].pharmacy_contributions[1].service_levels.epcs_ind
 
				if(3202502_rep->pharmacies[i].pharmacy_contributions[1].specialties.mail_order_ind > 0)
					set phSize = size(pharm_discovery_reply_out->pharmacies[i].pharmacy_types,5)
					set phSize = phSize + 1
					set stat = alterlist(pharm_discovery_reply_out->pharmacies[i].pharmacy_types,phSize)
					set pharm_discovery_reply_out->pharmacies[i].pharmacy_types[phSize].id = "MailOrder"
					set pharm_discovery_reply_out->pharmacies[i].pharmacy_types[phSize].name = "MailOrder"
				endif
 
				if(3202502_rep->pharmacies[i].pharmacy_contributions[1].specialties.retail_ind > 0)
					set phSize = size(pharm_discovery_reply_out->pharmacies[i].pharmacy_types,5)
					set phSize = phSize + 1
					set stat = alterlist(pharm_discovery_reply_out->pharmacies[i].pharmacy_types,phSize)
					set pharm_discovery_reply_out->pharmacies[i].pharmacy_types[phSize].id = "Retail"
					set pharm_discovery_reply_out->pharmacies[i].pharmacy_types[phSize].name = "Retail"
				endif
 
				if(3202502_rep->pharmacies[i].pharmacy_contributions[1].specialties.twenty_four_hour_ind > 0)
					set phSize = size(pharm_discovery_reply_out->pharmacies[i].pharmacy_types,5)
					set phSize = phSize + 1
					set stat = alterlist(pharm_discovery_reply_out->pharmacies[i].pharmacy_types,phSize)
					set pharm_discovery_reply_out->pharmacies[i].pharmacy_types[phSize].id = "24hr"
					set pharm_discovery_reply_out->pharmacies[i].pharmacy_types[phSize].name = "24hr"
				endif
 
				if(3202502_rep->pharmacies[i].pharmacy_contributions[1].specialties.long_term_ind > 0)
					set phSize = size(pharm_discovery_reply_out->pharmacies[i].pharmacy_types,5)
					set phSize = phSize + 1
					set stat = alterlist(pharm_discovery_reply_out->pharmacies[i].pharmacy_types,phSize)
					set pharm_discovery_reply_out->pharmacies[i].pharmacy_types[phSize].id = "LongTerm"
					set pharm_discovery_reply_out->pharmacies[i].pharmacy_types[phSize].name = "LongTerm"
				endif
 
				if(3202502_rep->pharmacies[i].pharmacy_contributions[1].specialties.specialty_ind > 0)
					set phSize = size(pharm_discovery_reply_out->pharmacies[i].pharmacy_types,5)
					set phSize = phSize + 1
					set stat = alterlist(pharm_discovery_reply_out->pharmacies[i].pharmacy_types,phSize)
					set pharm_discovery_reply_out->pharmacies[i].pharmacy_types[phSize].id = "Specialty"
					set pharm_discovery_reply_out->pharmacies[i].pharmacy_types[phSize].name = "Specialty"
				endif
 
				; Address
				set pharm_discovery_reply_out->pharmacies[i].address.address_type_cd =
				3202502_rep->pharmacies[i].primary_business_address.type_cd
 
				set pharm_discovery_reply_out->pharmacies[i].address.address_type_disp =
				uar_get_code_display(3202502_rep->pharmacies[i].primary_business_address.type_cd)
 
				set pharm_discovery_reply_out->pharmacies[i].address.address_type_mean =
				uar_get_code_meaning(3202502_rep->pharmacies[i].primary_business_address.type_cd)
 
				for(st = 1 to size(3202502_rep->pharmacies[i].primary_business_address.street_address_lines,5))
					if(st = 1)
						set pharm_discovery_reply_out->pharmacies[i].address.street_addr =
						3202502_rep->pharmacies[i].primary_business_address.street_address_lines[1].street_address_line
					elseif(st = 2)
						set pharm_discovery_reply_out->pharmacies[i].address.street_addr2 =
						3202502_rep->pharmacies[i].primary_business_address.street_address_lines[2].street_address_line
					endif
				endfor
 
				set pharm_discovery_reply_out->pharmacies[i].address.city =
				3202502_rep->pharmacies[i].primary_business_address.city
 
				set pharm_discovery_reply_out->pharmacies[i].address.state_disp =
				3202502_rep->pharmacies[i].primary_business_address.state
 
				set pharm_discovery_reply_out->pharmacies[i].address.country_disp =
				3202502_rep->pharmacies[i].primary_business_address.country
				
				set pharm_discovery_reply_out->pharmacies[i].address.zipcode =
				3202502_rep->pharmacies[i].primary_business_address.postal_code
 
				;Phone
				set pharm_discovery_reply_out->pharmacies[i].phone[1].sequence_nbr =
				3202502_rep->pharmacies[i].primary_business_telephone.type_seq
				
				set pharm_discovery_reply_out->pharmacies[i].phone[1].phone_type_cd =
				3202502_rep->pharmacies[i].primary_business_telephone.type_cd
 
				set pharm_discovery_reply_out->pharmacies[i].phone[1].phone_type_disp =
				uar_get_code_display(3202502_rep->pharmacies[i].primary_business_telephone.type_cd)
 
				set pharm_discovery_reply_out->pharmacies[i].phone[1].phone_type_mean =
				uar_get_code_meaning(3202502_rep->pharmacies[i].primary_business_telephone.type_cd)
 
				set pharm_discovery_reply_out->pharmacies[i].phone[1].phone_num =
				3202502_rep->pharmacies[i].primary_business_telephone.value
 
				;Fax
				set pharm_discovery_reply_out->pharmacies[i].phone[2].sequence_nbr =
				3202502_rep->pharmacies[i].primary_business_fax.type_seq
				
				set pharm_discovery_reply_out->pharmacies[i].phone[2].phone_type_cd = c_fax_bus_phone_type_cd
 
				set pharm_discovery_reply_out->pharmacies[i].phone[2].phone_type_disp =
				uar_get_code_display(c_fax_bus_phone_type_cd)
 
				set pharm_discovery_reply_out->pharmacies[i].phone[2].phone_type_mean =
				uar_get_code_meaning(c_fax_bus_phone_type_cd)
 
				set pharm_discovery_reply_out->pharmacies[i].phone[2].phone_num =
				3202502_rep->pharmacies[i].primary_business_fax.value
			endfor
		endif
	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetPharmaciesByCriteria Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
end go
set trace notranslatelock go
