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
          Source file name:   snsro_get_appt_res_disc.prg
          Object name:        vigilanz_get_appt_res_disc
          Program purpose:    Provides a list of scheduling resources
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
;drop program snsro_get_appt_res_discovery go
drop program vigilanz_get_appt_res_disc go
create program vigilanz_get_appt_res_disc
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "UserName" = ""        	;Optional
		, "ApptTypeId" = ""			;Optional
		, "LocationId" = ""			;Optional
		, "SearchString" = ""		;Optional
		, "Debug Flag" = 0			;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV,USERNAME,APPTTYPE,LOCATION,SEARCH,DEBUG_FLAG
 
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
		2 resource
			3 id = f8
			3 name = vc
		2 type
			3 id = i4
			3 name = vc
		2 provider
			3 provider_id = f8
			3 provider_name = vc
		2 service_resource
			3 id = f8
			3 name = vc
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
declare dLocationCd						= f8 with protect, noconstant(0.0)
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
set dLocationCd							= cnvtreal($LOCATION)
set dApptTypeCd							= cnvtreal($APPTTYPE)
set sSearchString						= trim(concat("*",cnvtupper($SEARCH),"*"),3)
set iDebugFlag							= cnvtint($DEBUG_FLAG)
 
if(iDebugFlag > 0)
	call echo(build("sUserName  	->", sUserName))
	call echo(build("dApptTypeCd  	->", dApptTypeCd))
	call echo(build("dLocationCd  	->", dLocationCd))
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
declare GetResources(null)			= null with protect
 
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
if(dLocationCd > 0)
	set iRet = GetCodeSet(dLocationCd)
	if(iRet != 220)
		call ErrorHandler2(c_error_handler_name, "F", "Validate", "Invalid LocationId.",
		"9999",build("Invalid LocationId: ",dLocationCd), appt_discovery_reply_out)
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
call GetResources(null)
 
 
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
	set _file = build2(trim(file_path),"/snsro_get_appt_res_discovery.json")
	call echo(build2("_file : ", _file))
	call echorecord(appt_discovery_reply_out)
	call echojson(appt_discovery_reply_out, _file, 0)
endif
 
#EXIT_VERSION
 
/*************************************************************************
;  Name: GetResources(null)
;  Description: Get scheduling resources
**************************************************************************/
subroutine GetResources(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetResources  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	;Set location clause
 	declare location_clause = vc
 	if(dLocationCd > 0)
 		set location_clause = " sal.location_cd = dLocationCd"
 	else
 		set location_clause = " sal.location_cd >= 0.0"
 	endif
 
 	;Set ApptType clause
 	declare appt_clause = vc
 	if(dApptTypeCd > 0)
 		set appt_clause = " sal.appt_type_cd = dApptTypeCd"
 	else
 		set appt_clause = " sal.appt_type_cd > 0"
 	endif
 
 	; Get appointment type list
 	select distinct into "nl:"
 		sr.resource_cd
 	from sch_resource sr
 		, sch_list_res slr
 		, sch_list_role slro
 		, sch_appt_loc sal
 		, prsnl p
 	plan sr where sr.mnemonic_key = patstring(sSearchString)
 		and sr.active_ind = 1
 		and sr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
 		and sr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
 		and sr.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00")
 	join slr where slr.resource_cd = sr.resource_cd
 		and slr.active_ind = 1
 		and slr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
 		and slr.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00")
 	join slro where slro.list_role_id = slr.list_role_id
 		and slro.active_ind = 1
 		and slr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
 		and slr.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00")
 	join sal where sal.res_list_id = slro.res_list_id
 		and parser(appt_clause)
 		and parser(location_clause)
 		and sal.active_ind = 1
 		and sal.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
 		and sal.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00")
 	join p where sr.person_id = outerjoin(p.person_id)

 	head report
 		x = 0
 	detail
 		x = x + 1
 		stat = alterlist(appt_discovery_reply_out->qual,x)
 
 		appt_discovery_reply_out->qual[x].resource.id = sr.resource_cd
 		appt_discovery_reply_out->qual[x].resource.name = uar_get_code_display(sr.resource_cd)
 		appt_discovery_reply_out->qual[x].provider.provider_id = sr.person_id
 		appt_discovery_reply_out->qual[x].provider.provider_name = p.name_full_formatted
 		appt_discovery_reply_out->qual[x].service_resource.id = sr.service_resource_cd
 		appt_discovery_reply_out->qual[x].service_resource.name = uar_get_code_display(sr.service_resource_cd)
 
 		appt_discovery_reply_out->qual[x].type.id = sr.res_type_flag
 		case(sr.res_type_flag)
 			of 1: appt_discovery_reply_out->qual[x].type.name = "General"
 			of 2: appt_discovery_reply_out->qual[x].type.name = "Personnel"
 			of 3: appt_discovery_reply_out->qual[x].type.name = "Service"
 			of 4: appt_discovery_reply_out->qual[x].type.name = "Equipment"
 		endcase
 
 	with nocounter
 
	if(curqual > 0)
		call ErrorHandler2(c_error_handler_name, "S", "Success", "Appointment resource discovery completed successfully.",
		"0000","Appointment resource discovery completed successfully.", appt_discovery_reply_out)
	else
		call ErrorHandler2(c_error_handler_name, "Z", "Success", "Zero records found.",
		"0000","Zero records found.", appt_discovery_reply_out)
		go to exit_script
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetResources Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
end go
set trace notranslatelock go
 
 
 
