/***********************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

************************************************************************
          Date Written:       01/04/19
          Source file name:   snsro_get_labloc_disc.prg
          Object name:        vigilanz_get_labloc_disc
          Program purpose:    Provides lab location discovery
          Executing from:     Emissary mPages Web Service
 ***********************************************************************
                   GENERATED MODIFICATION CONTROL LOG
 ***********************************************************************
 Mod Date		Engineer	Comment
 -----------------------------------------------------------------------
 000 01/14/19   RJC			Initial Write
 001 09/09/19   RJC         Renamed file and object
 **********************************************************************/
;drop program snsro_get_lablocation_disc go
drop program vigilanz_get_labloc_disc go
create program vigilanz_get_labloc_disc
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "UserName" = ""        	;Optional
		, "SearchString" = ""		;Optional
		, "Debug Flag" = 0			;Optional. Verbose logging when set to one (1).
 
with OUTDEV,USERNAME,SEARCH,DEBUG_FLAG
 
/*************************************************************************
;VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
 
; Temp record
free record temp
record temp (
	1 laboratory_locations[*]
		2 address
			3  address_id  				= f8
			3  address_type_cd 			= f8
			3  address_type_disp  		= vc
			3  address_type_mean  		= vc
			3  street_addr  			= vc
			3  street_addr2				= vc
			3  city 					= vc
			3  state_cd 				= f8
			3  state_disp 				= vc
			3  state_mean 				= vc
			3  zipcode     				= vc
			3  country_cd				= f8
			3  country_disp				= vc
		2 clia 							= vc
		2 lab_id 						= f8
		2 lab_name 						= vc
		2 location_cd					= f8
		2 medical_director 				= vc
		2 telephone 					= vc
 )
 
; Final reply
free record final_reply_out
record final_reply_out (
	1 laboratory_locations[*]
		2 address
			3  address_id  				= f8
			3  address_type_cd 			= f8
			3  address_type_disp  		= vc
			3  address_type_mean  		= vc
			3  street_addr  			= vc
			3  street_addr2				= vc
			3  city 					= vc
			3  state_cd 				= f8
			3  state_disp 				= vc
			3  state_mean 				= vc
			3  zipcode     				= vc
			3  country_cd				= f8
			3  country_disp				= vc
		2 clia 							= vc
		2 lab_id 						= f8
		2 lab_name 						= vc
		2 location_cd					= f8
		2 medical_director 				= vc
		2 telephone 					= vc
	1 status_data
		2 status 						= c1
	    2 subeventstatus[1]
	    	3 OperationName 			= c25
	      	3 OperationStatus 			= c1
		      3 TargetObjectName 		= c25
		      3 TargetObjectValue 		= vc
		      3 Code 					= c4
		      3 Description 			= vc
	1 audit
		2 user_id						= f8
		2 user_firstname				= vc
		2 user_lastname					= vc
		2 patient_id					= f8
		2 patient_firstname				= vc
		2 patient_lastname				= vc
 	    2 service_version				= vc
 	    2 query_execute_time			= vc
	    2 query_execute_units			= vc
)
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Input
declare sUserName					= vc with protect, noconstant("")
declare sSearchText					= vc with protect, noconstant("")
declare iDebugFlag					= i2 with protect, noconstant(0)
 
; Constants
declare c_error_handler_name 		= vc with protect, constant("LAB LOCATION DISCOVERY")
declare c_lab_discipline_type_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",6000,"GENERAL LAB"))
declare c_business_address_type_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",212,"BUSINESS"))
declare c_business_phone_type_cd	= f8 with protect, constant(uar_get_code_by("MEANING",43,"BUSINESS"))
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
;Input
set sUserName						= trim($USERNAME, 3)
set sSearchText						= trim($SEARCH,3)
set iDebugFlag						= cnvtint($DEBUG_FLAG)
 
if(iDebugFlag > 0)
	call echo(build("sUserName  	->", sUserName))
	call echo(build("sSearchText  	->", sSearchText))
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetLabLocations(null)		= null with protect
declare PostAmble(null)				= null with protect
 
/*************************************************************************
; MAIN
**************************************************************************/
; Validate username
set iRet = PopulateAudit(sUserName, 0.0, final_reply_out, sVersion)
if(iRet = 0)
 	call ErrorHandler2(c_error_handler_name, "F", "Validate", "Invalid User for Audit.",
	"1001",build("Invlid user: ",sUserName), final_reply_out)
 	go to exit_script
endif
 
; Get Lab Locations
call GetLabLocations(null)
 
; PostAmble
call PostAmble(null)
 
; Set audit to success
call ErrorHandler2(c_error_handler_name, "S", "Success", "Completed successfully.",
"0000","Completed successfully.", final_reply_out)
 
/*************************************************************************
 EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************
 Convert REC output to JSON
**************************************************************/
set JSONout = CNVTRECTOJSON(final_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_lab_location_discovery.json")
	call echo(build2("_file : ", _file))
	call echojson(final_reply_out, _file, 0)
 	call echorecord(final_reply_out)
   	call echo(JSONout)
endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: GetLabLocations(null) = null
;  Description: Return list of lab locations
**************************************************************************/
subroutine GetLabLocations(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetLabLocations Begin ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	; Service Resource data
 	select into "nl:"
	from service_resource sr
	plan sr	where sr.discipline_type_cd = c_lab_discipline_type_cd
		and sr.active_ind = 1
		and sr.location_cd > 0
	head report
		x = 0
	detail
		x = x + 1
		stat = alterlist(temp->laboratory_locations,x)
 
		temp->laboratory_locations[x].lab_id = sr.service_resource_cd
		temp->laboratory_locations[x].lab_name = build2(trim(uar_get_code_display(sr.service_resource_cd),3)," - ",
												 trim(uar_get_code_display(sr.location_cd),3))
		temp->laboratory_locations[x].location_cd = sr.location_cd
		temp->laboratory_locations[x].clia = sr.clia_number_txt
		temp->laboratory_locations[x].medical_director = sr.medical_director_name
	with nocounter
 
	; Addresses
	select into "nl:"
	from (dummyt d with seq = size(temp->laboratory_locations,5))
		, address a
	plan d
	join a where a.parent_entity_name = "LOCATION"
		and a.parent_entity_id = temp->laboratory_locations[d.seq].location_cd
		and a.address_type_cd = c_business_address_type_cd
		and a.active_ind = 1
		and a.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and a.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
	detail
		temp->laboratory_locations[d.seq].address.address_id = a.address_id
		temp->laboratory_locations[d.seq].address.address_type_cd = a.address_type_cd
		temp->laboratory_locations[d.seq].address.address_type_disp = uar_get_code_display(a.address_type_cd)
		temp->laboratory_locations[d.seq].address.address_type_mean = uar_get_code_meaning(a.address_type_cd)
		temp->laboratory_locations[d.seq].address.city = a.city
		temp->laboratory_locations[d.seq].address.street_addr = a.street_addr
		temp->laboratory_locations[d.seq].address.street_addr2 = a.street_addr2
		temp->laboratory_locations[d.seq].address.zipcode = a.zipcode
 
 		if(a.state_cd > 0)
 			temp->laboratory_locations[d.seq].address.state_cd = a.state_cd
			temp->laboratory_locations[d.seq].address.state_disp = uar_get_code_display(a.state_cd)
			temp->laboratory_locations[d.seq].address.state_mean = uar_get_code_meaning(a.state_cd)
		elseif(a.state > " ")
			temp->laboratory_locations[d.seq].address.state_disp = a.state
		endif
 
		if(a.country_cd > 0)
			temp->laboratory_locations[d.seq].address.country_cd = a.country_cd
			temp->laboratory_locations[d.seq].address.country_disp = uar_get_code_display(a.country_cd)
		elseif(a.country > " ")
			temp->laboratory_locations[d.seq].address.country_disp = a.country
		endif
	with nocounter
 
	;Phone
 	select into "nl:"
 	from (dummyt d with seq = size(temp->laboratory_locations,5))
 		, phone p
 	plan d
 	join p where p.parent_entity_name = "LOCATION"
 		and p.parent_entity_id = temp->laboratory_locations[d.seq].location_cd
 		and p.phone_type_cd = c_business_phone_type_cd
 		and p.active_ind = 1
		and p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and p.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
 	detail
 		temp->laboratory_locations[d.seq].telephone = p.phone_num
 	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetLabLocations Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: PostAmble(null) = null
;  Description: Update final reply
**************************************************************************/
subroutine PostAmble(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostAmble Begin ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	if(sSearchText > " ")
		declare search_string = vc
		set search_string = build("*",cnvtlower(sSearchText),"*")
 
		select into "nl:"
		from (dummyt d with seq = size(temp->laboratory_locations,5))
		plan d where (temp->laboratory_locations[d.seq].lab_id	= cnvtreal(sSearchText)
			or cnvtlower(temp->laboratory_locations[d.seq].lab_name) = patstring(search_string)
			or cnvtlower(temp->laboratory_locations[d.seq].medical_director) = patstring(search_string)
			or cnvtlower(temp->laboratory_locations[d.seq].clia) = patstring(search_string)
			or cnvtlower(temp->laboratory_locations[d.seq].telephone) = patstring(search_string)
			or cnvtlower(temp->laboratory_locations[d.seq].address.street_addr) = patstring(search_string)
			or cnvtlower(temp->laboratory_locations[d.seq].address.street_addr2) = patstring(search_string)
			or cnvtlower(temp->laboratory_locations[d.seq].address.city) = patstring(search_string)
			or cnvtlower(temp->laboratory_locations[d.seq].address.state_disp) = patstring(search_string)
			or cnvtlower(temp->laboratory_locations[d.seq].address.zipcode) = patstring(search_string)
			)
		head report
			x = 0
		detail
			x = x + 1
			stat = alterlist(final_reply_out->laboratory_locations,x)
			stat = movereclist(temp->laboratory_locations,final_reply_out->laboratory_locations,d.seq,x,1,false)
		with nocounter
 
	else
		set stat = moverec(temp->laboratory_locations,final_reply_out->laboratory_locations)
	endif
 
 	if(iDebugFlag > 0)
		call echo(concat("PostAmble Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
end
go
 
