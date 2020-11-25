/*~BB~************************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

  ~BE~*************************************************************************
          Date Written:       08/28/18
          Source file name:   snsro_get_appt_loc_disc.prg
          Object name:        vigilanz_get_appt_loc_disc
          Program purpose:    Provides a list of appointment locations
          Executing from:     EMISSARY SERVICES
          Special Notes:	  NONE
 ***********************************************************************
                   GENERATED MODIFICATION CONTROL LOG
 ***********************************************************************
 Mod Date        Engineer     Comment
 ---   --------    ----------------------------------------------------
 000 08/28/18 RJC			Initial Write
 001 09/09/19 RJC           Renamed file and object
 ***********************************************************************/
;drop program snsro_get_appt_loc_discovery go
drop program vigilanz_get_appt_loc_disc go
create program vigilanz_get_appt_loc_disc
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "UserName" = ""        	;Optional
		, "ApptTypeId" = ""			;Optional
		, "ResourceId" = ""			;Optional
		, "SearchString" = ""		;Optional
		, "Debug Flag" = 0			;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV,USERNAME,APPTTYPE,RESOURCE,SEARCH,DEBUG_FLAG
 
/*************************************************************************
;VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
 
free record appt_discovery_reply_out
record appt_discovery_reply_out (
	1 qual[*]
		2 location
			3 id = f8
			3 name = vc
		2 address
			3  address_id     		= f8
			3  address_type_cd  	= f8
			3  address_type_disp  	= vc
			3  address_type_mean 	= vc
			3  street_addr   		= vc
			3  street_addr2  		= vc
			3  city   				= vc
			3  state_cd   			= f8
			3  state_disp  			= vc
			3  state_mean 			= vc
			3  zipcode				= vc
			3  country_cd			= f8
			3  country_disp			= vc
		2 phone[*]
			3 phone_id 				= f8
			3 phone_type_cd 		= f8
			3 phone_type_disp 		= vc
			3 phone_type_mean 		= vc
			3 phone_num 			= vc
			3 sequence_number 		= i4
	1 audit
		2 user_id					= f8
		2 user_firstname			= vc
		2 user_lastname				= vc
		2 patient_id				= f8
		2 patient_firstname			= vc
		2 patient_lastname			= vc
		2 service_version			= vc
	1 status_data
		2 status 					= c1
		2 subeventstatus[1]
			3 OperationName 		= c25
			3 OperationStatus 		= c1
			3 TargetObjectName 		= c25
			3 TargetObjectValue 	= vc
			3 Code 					= c4
			3 Description 			= vc
)
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
; Input
declare sUserName						= vc with protect, noconstant("")
declare dResourceCd						= f8 with protect, noconstant(0.0)
declare dApptTypeCd						= f8 with protect, noconstant(0.0)
declare sSearchString					= vc with protect, noconstant("")
declare iDebugFlag						= i2 with protect, noconstant(0)
 
; Constants
declare c_error_handler_name 			= vc with protect, constant("APPT_DISCOVERY")
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
; Input
set sUserName							= trim($USERNAME, 3)
set dResourceCd							= cnvtreal($RESOURCE)
set dApptTypeCd							= cnvtreal($APPTTYPE)
set sSearchString						= trim(concat("*",cnvtupper($SEARCH),"*"),3)
set iDebugFlag							= cnvtint($DEBUG_FLAG)
 
if(iDebugFlag > 0)
	call echo(build("sUserName  	->", sUserName))
	call echo(build("dApptTypeCd  	->", dApptTypeCd))
	call echo(build("dResourceCd  	->", dResourceCd))
	call echo(build("sSearchString  ->", sSearchString))
	call echo(build("iDebugFlag  	->", iDebugFlag))
endif
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetLocations(null)			= null with protect
declare GetAddress(null)			= null with protect
declare GetPhones(null)				= null with protect
 
/*************************************************************************
; MAIN
**************************************************************************/
; Validate username
set iRet = PopulateAudit(sUserName, 0.0, appt_discovery_reply_out, sVersion)
if(iRet = 0)
 	call ErrorHandler2(c_error_handler_name, "F", "Validate", "Invalid User for Audit.",
	"1001",build("Invlid user: ",sUserName), appt_discovery_reply_out)
 	go to exit_script
endif
 
; Validate ResourceId if provided
if(dResourceCd > 0)
	set iRet = GetCodeSet(dResourceCd)
	if(iRet != 14231)
		call ErrorHandler2(c_error_handler_name, "F", "Validate", "Invalid ResourceId.",
		"9999",build("Invalid ResourceId: ",dResourceCd), appt_discovery_reply_out)
 		go to exit_script
	endif
endif
 
; Validate AppointmentTypeId if provided
if(dApptTypeCd > 0)
	set iRet = GetCodeSet(dApptTypeCd)
	if(iRet != 14230)
		call ErrorHandler2(c_error_handler_name, "F", "Validate", "Invalid AppointmentTypeId.",
		"2105",build("Invalid AppointmentTypeId: ",dApptTypeCd), appt_discovery_reply_out)
 		go to exit_script
	endif
endif
 
; Get Locations
call GetLocations(null)
 
; Get Addresses
call GetAddress(null)
 
; Get Phones
call GetPhones(null)
 
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
#EXIT_SCRIPT
 
set JSONout = CNVTRECTOJSON(appt_discovery_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)  																;008
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_appt_loc_discovery.json")
	call echo(build2("_file : ", _file))
	call echorecord(appt_discovery_reply_out)
	call echojson(appt_discovery_reply_out, _file, 0)
endif
 
#EXIT_VERSION
 
/*************************************************************************
;  Name: GetLocations(null)
;  Description: Get scheduling locations
**************************************************************************/
subroutine GetLocations(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetLocations  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	;Set Resource clause
 	declare resource_clause = vc
 	if(dResourceCd > 0)
 		set resource_clause = " slr.resource_cd = dResourceCd"
 	else
 		set resource_clause = " slr.resource_cd >= 0.0"
 	endif
 
 	;Set ApptType clause
 	declare appt_clause = vc
 	if(dApptTypeCd > 0)
 		set appt_clause = " sal.appt_type_cd = dApptTypeCd"
 	else
 		set appt_clause = " sal.appt_type_cd > 0"
 	endif
 
 	; Get appointment location list
 	select distinct into "nl:"
 		sal.location_cd
 	from sch_appt_loc sal
 		, code_value cv
 		, sch_list_res slr
 		, sch_list_role slro
 		, sch_resource sr
 	plan sal where parser(appt_clause)
 		and sal.active_ind = 1
 		and sal.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
 		and sal.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00")
 	join cv where cv.code_value = sal.location_cd
 		and cv.code_set = 220
 		and cv.display_key = patstring(sSearchString)
 		and cv.active_ind = 1
 	join slro where slro.res_list_id = sal.res_list_id
 		and slro.active_ind = 1
 		and slro.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
 		and slro.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00")
 	join slr where slr.list_role_id = slro.list_role_id
 		and parser(resource_clause)
 		and slr.active_ind = 1
 		and slr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
 		and slr.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00")
 	join sr where sr.resource_cd = slr.resource_cd
 		and sr.active_ind = 1
 		and sr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
 		and sr.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00")
 	head report
 		x = 0
 	detail
 		x = x + 1
 		stat = alterlist(appt_discovery_reply_out->qual,x)
 
 		appt_discovery_reply_out->qual[x].location.id = sal.location_cd
 		appt_discovery_reply_out->qual[x].location.name = cv.display
 	with nocounter
 
	if(curqual > 0)
		call ErrorHandler2(c_error_handler_name, "S", "Success", "Appointment location discovery completed successfully.",
		"0000","Appointment location discovery completed successfully.", appt_discovery_reply_out)
	else
		call ErrorHandler2(c_error_handler_name, "Z", "Success", "Zero records found.",
		"0000","Zero records found.", appt_discovery_reply_out)
		go to exit_script
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetLocations Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetAddress(null)
;  Description: Get address data
**************************************************************************/
subroutine GetAddress(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetAddress  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	select into "nl:"
	from address a
	     ,(dummyt d with seq = size(appt_discovery_reply_out->qual,5))
	plan d
	join a where a.parent_entity_id = appt_discovery_reply_out->qual[d.seq].location.id
			and a.parent_entity_name = "LOCATION"
			and a.active_ind = 1
			and a.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and a.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
			and a.address_type_cd = value(uar_get_code_by("MEANING",212,"BUSINESS"))
	detail
		appt_discovery_reply_out->qual[d.seq].address.address_id = a.address_id
		appt_discovery_reply_out->qual[d.seq].address.address_type_cd = a.address_type_cd
		appt_discovery_reply_out->qual[d.seq].address.address_type_disp = trim(uar_get_code_display(a.address_type_cd),3)
		appt_discovery_reply_out->qual[d.seq].address.street_addr = trim(a.street_addr,3)
		appt_discovery_reply_out->qual[d.seq].address.street_addr2 = trim(build(trim(a.street_addr2)," ",trim(a.street_addr3)),3)
		appt_discovery_reply_out->qual[d.seq].address.city = trim(a.city,3)
		appt_discovery_reply_out->qual[d.seq].address.state_cd = a.state_cd
		appt_discovery_reply_out->qual[d.seq].address.state_disp = trim(a.state,3)
		appt_discovery_reply_out->qual[d.seq].address.zipcode = trim(a.zipcode,3)
		appt_discovery_reply_out->qual[d.seq].address.country_cd = a.country_cd
		appt_discovery_reply_out->qual[d.seq].address.country_disp = trim(a.country,3)
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetAddress Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetPhones(null)
;  Description: Get phone data
**************************************************************************/
subroutine GetPhones(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetPhones  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	;Getting phonenumber
	select into "nl:"
	from phone ph
	      ,(dummyt d with seq = size(appt_discovery_reply_out->qual,5))
	plan d
	join ph where ph.parent_entity_id = appt_discovery_reply_out->qual[d.seq].location.id
			and ph.parent_entity_name = "LOCATION"
			and ph.active_ind = 1
			and ph.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and ph.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
	order by d.seq,ph.phone_type_cd, ph.phone_type_seq,ph.phone_id
	head d.seq
		x = 0
	head ph.phone_id
		x = x + 1
		stat = alterlist(appt_discovery_reply_out->qual[d.seq].phone,x)
 
		appt_discovery_reply_out->qual[d.seq].phone[x].phone_id = ph.phone_id
		appt_discovery_reply_out->qual[d.seq].phone[x].phone_type_cd = ph.phone_type_cd
		appt_discovery_reply_out->qual[d.seq].phone[x].phone_type_disp = trim(uar_get_code_display(ph.phone_type_cd),3)
		appt_discovery_reply_out->qual[d.seq].phone[x].phone_num = trim(ph.phone_num,3)
		appt_discovery_reply_out->qual[d.seq].phone[x].sequence_number = ph.phone_type_seq
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetPhones Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
end go
set trace notranslatelock go
 
 
 
