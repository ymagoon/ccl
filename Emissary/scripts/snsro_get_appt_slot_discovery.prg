/*~BB~************************************************************************
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
  ~BE~*************************************************************************
          Date Written:       08/16/18
          Source file name:   snsro_get_appt_slot_discovery.prg
          Object name:        snsro_get_appt_slot_discovery
          Program purpose:    Provides a list of appointment types and associated locations, resources and details
          Executing from:     EMISSARY SERVICES
          Special Notes:	  NONE
 ***********************************************************************
                   GENERATED MODIFICATION CONTROL LOG
 ***********************************************************************
 Mod Date        Engineer     Comment
 ---   --------    ----------------------------------------------------
 000 08/16/18 RJC			Initial Write
 ***********************************************************************/
drop program snsro_get_appt_slot_discovery go
create program snsro_get_appt_slot_discovery
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "UserName:" = ""        		;Optional
		, "AppointmentTypeId:" = ""		;Required
		, "FromDate" = ""				;Optional
		, "ToDate" = ""					;Optional
		, "ResourceLocations" = ""		;NA - future functionality
		, "ResourceId" = ""				;Either Resource or location required
		, "LocationCd" = ""				;Either resource or location required
		, "MaxSlots" = ""				;Optional
		, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV,USERNAME,APPT_TYPE_ID,FROM_DATE,TO_DATE,RESLOCS,RESOURCE,LOCATION,MAX_SLOTS,DEBUG_FLAG
 
/*************************************************************************
;VERSION CONTROL
**************************************************************************/
set sVersion = "1.16.6.1"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
;650328 - sch_get_appt_block
free record 650328_req
record 650328_req (
  1 call_echo_ind = i2
  1 security_ind = i2
  1 security_user_id = f8
  1 secured_scheme_ind = i2
  1 secured_scheme_id = f8
  1 qual [*]
    2 resource_cd = f8
    2 person_id = f8
    2 beg_dt_tm = dq8
    2 end_dt_tm = dq8
    2 resource_ind = i2
    2 person_ind = i2
)
 
free record 650328_rep
record 650328_rep (
   1 qual_cnt = i4
   1 qual [* ]
     2 resource_cd = f8
     2 person_id = f8
     2 qual_cnt = i4
     2 appointment [* ]
       3 view_sec_ind = i2
       3 sch_appt_id = f8
       3 appt_type_cd = f8
       3 appt_type_desc = vc
       3 beg_dt_tm = dq8
       3 end_dt_tm = dq8
       3 orig_beg_dt_tm = dq8
       3 orig_end_dt_tm = dq8
       3 sch_state_cd = f8
       3 state_meaning = vc
       3 sch_event_id = f8
       3 schedule_seq = i4
       3 schedule_id = f8
       3 location_cd = f8
       3 appt_reason_free = vc
       3 location_freetext = vc
       3 appt_synonym_cd = f8
       3 appt_synonym_free = vc
       3 duration = i4
       3 setup_duration = i4
       3 cleanup_duration = i4
       3 appt_scheme_id = f8
       3 req_prsnl_id = f8
       3 req_prsnl_name = vc
       3 primary_resource_cd = f8
       3 primary_resource_mnem = vc
       3 slot_type_id = f8
       3 sch_flex_id = f8
       3 interval = i4
       3 apply_def_id = f8
       3 slot_mnemonic = vc
       3 slot_scheme_id = f8
       3 description = vc
       3 apply_list_id = f8
       3 slot_state_cd = f8
       3 slot_state_meaning = vc
       3 def_slot_id = f8
       3 border_style = i4
       3 border_size = i4
       3 border_color = i4
       3 shape = i4
       3 pen_shape = i4
       3 apply_slot_id = f8
       3 booking_id = f8
       3 contiguous_ind = i2
       3 primary_synonym_id = f8
       3 primary_description = vc
       3 surgeon_id = f8
       3 surgeon_disp = vc
       3 surgeon2_id = f8
       3 surgeon2_disp = vc
       3 surgeon3_id = f8
       3 surgeon3_disp = vc
       3 surgeon4_id = f8
       3 surgeon4_disp = vc
       3 surgeon5_id = f8
       3 surgeon5_disp = vc
       3 anesthesia_id = f8
       3 anesthesia_disp = vc
       3 anesthesia2_id = f8
       3 anesthesia2_disp = vc
       3 anesthesia3_id = f8
       3 anesthesia3_disp = vc
       3 anesthesia4_id = f8
       3 anesthesia4_disp = vc
       3 anesthesia5_id = f8
       3 anesthesia5_disp = vc
       3 priority_cd = f8
       3 priority_display = vc
       3 anesthesia_type_cd = f8
       3 anesthesia_type_display = vc
       3 sch_role_cd = f8
       3 role_meaning = vc
       3 surg_case_id = f8
       3 surg_case_display = vc
       3 encntr_type_cd = f8
       3 encntr_type_display = vc
       3 last_verified_dt_tm = dq8
       3 t_appttype_granted = i2
       3 t_location_granted = i2
       3 t_slottype_granted = i2
       3 qual_cnt = i4
       3 patient [* ]
         4 person_id = f8
         4 name = vc
         4 encntr_id = f8
         4 parent_id = f8
         4 person_hom_phone = vc
         4 person_bus_phone = vc
         4 birth_dt_tm = dq8
         4 birth_tz = i4
       3 bit_mask = i4
       3 warn_bit_mask = i4
       3 release_ind = i2
       3 def_qual_cnt = i4
       3 def_qual [* ]
         4 appt_def_id = f8
         4 beg_dt_tm = dq8
         4 end_dt_tm = dq8
         4 duration = i4
         4 slot_type_id = f8
         4 sch_flex_id = f8
         4 interval = i4
         4 slot_mnemonic = vc
         4 description = vc
         4 slot_scheme_id = f8
         4 t_slottype_granted = i2
       3 role_seq = i2
       3 grpsession_id = f8
       3 grp_desc = vc
       3 grp_capacity = i4
       3 grp_nbr_sched = i4
       3 grp_appt_type_cd = f8
       3 grp_appt_type_syn_free = vc
       3 grp_location_cd = f8
       3 grp_location_free = vc
       3 link_flag = i4
       3 par_release_ind = i2
       3 ubrn = vc
       3 t_grp_location_granted = i2
       3 t_grp_appttype_granted = i2
       3 mrn = vc
       3 ssn = vc
       3 referral_encntr_closed_ind = i2
       3 cdi_work_items_cnt = i4
       3 cdi_work_items [* ]
         4 cdi_work_item_id = f8
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
)
 
free record slot_discovery_reply_out
record slot_discovery_reply_out (
	1 qual[*]
		2 appointment_type
			3 id = f8
			3 name = vc
		2 resource
			3 id = f8
			3 name = vc
		2 location
			3 id = f8
			3 name = vc
		2 apply_slot_id = f8
		2 apply_list_id = f8
		2 apply_def_id = f8
		2 sch_appt_id = f8
		2 slot_scheme_id = f8
		2 slot_type
			3 id = f8
			3 name = vc
		2 beg_dt_tm = dq8
		2 end_dt_tm = dq8
		2 setup_duration
			3 time = i4
			3 units
				4 id = f8
				4 name = vc
		2 duration = i4
			3 time = i4
			3 units
				4 id = f8
				4 name = vc
		2 cleanup_duration = i4
			3 time = i4
			3 units
				4 id = f8
				4 name = vc
		2 start_interval = i4
		2 slot_state
			3 id = f8
			3 name = vc
		2 sch_state
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
		2 status = c1
		2 subeventstatus[1]
			3 OperationName = c25
			3 OperationStatus = c1
			3 TargetObjectName = c25
			3 TargetObjectValue = vc
			3 Code = c4
			3 Description = vc
)
 
free record slot_types
record slot_types (
	1 qual_cnt = i4
	1 qual[*]
		2 slot_type_id = f8
)
 
free record resource_locs
record resource_locs (
	1 qual[*]
		2 resource_cd = f8
		2 location_cd = f8
)
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
; Input
declare sUserName				= vc with protect, noconstant("")
declare dApptTypeId				= f8 with protect, noconstant(0.0)
declare sFromDateTime			= vc with protect, noconstant("")
declare sToDateTime				= vc with protect, noconstant("")
declare sResourceLocs			= vc with protect, noconstant("")
declare dResourceCd				= f8 with protect, noconstant(0.0)
declare dLocationCd				= f8 with protect, noconstant(0.0)
declare iMaxSlots				= i4 with protect, noconstant(0)
declare iDebugFlag				= i2 with protect, noconstant(0)
 
; Other
declare UTCMode					= i4 with protect, constant(CURUTC)
declare qFromDateTime			= f8 with protect, noconstant(0)
declare qToDateTime				= f8 with protect, noconstant(0)
declare dUserId					= f8 with protect, noconstant(0.0)
 
; Constants
declare c_error_handler_name 	= vc with protect, constant("SLOT_DISCOVERY")
declare c_minutes_duration_units_cd = f8 with protect, constant(uar_get_code_by("MEANING",54,"MINUTES"))
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
; Input
set sUserName					= trim($USERNAME, 3)
set dApptTypeId					= cnvtreal($APPT_TYPE_ID)
set sFromDateTime				= trim($FROM_DATE,3)
set sToDateTime					= trim($TO_DATE,3)
set sResourceLocs				= trim($RESLOCS,3)
set dResourceCd					= cnvtreal($RESOURCE)
set dLocationCd					= cnvtreal($LOCATION)
set iMaxSlots					= cnvtint($MAX_SLOTS)
set iDebugFlag					= cnvtint($DEBUG_FLAG)
 
; Other
set dUserId						= GetPrsnlIDfromUserName(sUserName)
 
; Set Time parameters
if(sToDateTime <= " ")
	set sToDateTime = "31-DEC-2100 23:59:59"
endif
 
set qFromDateTime = GetDateTime(sFromDateTime)
set qToDateTime = GetDateTime(sToDateTime)
 
;if(iDebugFlag > 0)
	call echo(build("sUserName  ->", sUserName))
	call echo(build("dApptTypeId  ->", dApptTypeId))
	call echo(build("qFromDateTime  ->", qFromDateTime))
	call echo(build("qToDateTime  ->", qToDateTime))
	call echo(build("sFromDateTime  ->", sFromDateTime))
	call echo(build("sToDateTime  ->", sToDateTime))
	call echo(build("sResourceLocs  ->", sResourceLocs,"<-"))
	call echo(build("dResourceCd  ->", dResourceCd))
	call echo(build("dLocationCd  ->", dLocationCd))
	call echo(build("iMaxSlots  ->", iMaxSlots))
	call echo(build("iDebugFlag  ->", iDebugFlag))
;endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare UpdateResLocs(null)		= null with protect
declare GetSlots(null)			= null with protect ;650328 - sch_get_appt_block
declare PostAmble(null)			= null with protect
 
/*************************************************************************
; MAIN
**************************************************************************/
; Validate username
set iRet = PopulateAudit(sUserName, 0.0, slot_discovery_reply_out, sVersion)
if(iRet = 0)
 	call ErrorHandler2(c_error_handler_name, "F", "Validate", "Invalid User for Audit.",
	"1001",build("Invlid user: ",sUserName), slot_discovery_reply_out)
 	go to exit_script
endif
 
; Validate AppointmentTypeCd
set iRet = GetCodeSet(dApptTypeId)
if(iRet != 14230)
	call ErrorHandler2(c_error_handler_name, "F", "Validate", "Invalid AppointmentTypeId.",
	"9999","Invalid AppointmentTypeId.", slot_discovery_reply_out)
	go to exit_script
endif
 
; Validate FromDate is not greater than ToDate
if (qFromDateTime > qToDateTime)
	call ErrorHandler2(c_error_handler_name, "F", "Validate", "From Date Greater than To Date. Refine Dates Entered.",
	"2010", "From Date Greater than To Date. Refine Dates Entered.", slot_discovery_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate only one of the following three fields are set - ResourceLocs, ResourceCd, LocationCd
if((sResourceLocs > " " and dResourceCd > 0) or (sResourceLocs > " " and dLocationCd > 0) or (dResourceCd > 0 and dLocationCd > 0))
	call ErrorHandler2(c_error_handler_name, "F", "Validate", "Can only provide resource locations, a resource or a location.",
	"9999","Can only provide resource locations, a resource or a location.", slot_discovery_reply_out)
	go to exit_script
endif
 
; Parse and Validate ResourceLocs
call UpdateResLocs(null)
 
; Get Slots
call GetSlots(null)
 
; Set audit status
if(size(slot_discovery_reply_out->qual,5) = 0)
	call ErrorHandler2(c_error_handler_name, "Z", "Validate", "No available slots found. Refine search parameters.",
	"9999", "No available slots found. Refine search parameters.", slot_discovery_reply_out)
else
	call ErrorHandler2(c_error_handler_name, "S", "Success", "Slot discovery processed successfully.",
	"0000", "Slot discovery processed successfully.", slot_discovery_reply_out)
endif
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
#EXIT_SCRIPT
 
set JSONout = CNVTRECTOJSON(slot_discovery_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)  																;008
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_appt_slot_discovery.json")
	call echo(build2("_file : ", _file))
	call echorecord(slot_discovery_reply_out)
	call echojson(slot_discovery_reply_out, _file, 0)
endif
 
#EXIT_VERSION
 
/*************************************************************************
;  Name: UpdateResLocs(null)
;  Description: Update resource_locs record
**************************************************************************/
subroutine UpdateResLocs(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("UpdateResLocs  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	;Validate a resource or location was provided
	if(dResourceCd = 0 and dLocationCd = 0 )
		call ErrorHandler2(c_error_handler_name, "F", "Validate", "A ResourceId and/or LocationId is required.",
		"9999","A ResourceId and/or LocationId is required.", slot_discovery_reply_out)
		go to exit_script
	endif
 
	; Declare parser strings
 	declare resource_clause = vc
 	declare location_clause = vc
 
	; Validate ResourceCd
	if(dResourceCd > 0)
		set iRet = GetCodeSet(dResourceCd)
		if(iRet != 14231)
			call ErrorHandler2(c_error_handler_name, "F", "Validate", "Invalid ResourceId.",
			"9999","Invalid ResourceId.", slot_discovery_reply_out)
			go to exit_script
		endif
 
		set resource_clause = " slr.resource_cd = dResourceCd"
	else
		set resource_clause = " slr.resource_cd > 0"
	endif
 
	; Validate LocationCd
	if(dLocationCd > 0)
		set iRet = GetCodeSet(dLocationCd)
		if(iRet != 220)
			call ErrorHandler2(c_error_handler_name, "F", "Validate", "Invalid LocationId.",
			"9999","Invalid LocationId.", slot_discovery_reply_out)
			go to exit_script
		endif
 
		set location_clause = " sal.location_cd = dLocationCd"
	else
		set location_clause = " sal.location_cd > 0"
	endif
 
 
	select into "nl:"
	from sch_appt_loc sal
	, sch_list_role slro
	, sch_list_res slr
	, sch_resource sr
	plan sal where sal.appt_type_cd = dApptTypeId
		and parser(location_clause)
		and sal.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00")
		and sal.active_ind = 1
		and sal.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
	join slro where slro.res_list_id = sal.res_list_id
		and slro.role_meaning != "PATIENT"
		and slro.sch_role_cd > 0
		and slro.res_list_id > 0
		and slro.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00")
		and slro.active_ind = 1
		and slro.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
	join slr where slr.list_role_id = slro.list_role_id
		and slr.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00")
		and slr.active_ind = 1
		and slr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
		and parser(resource_clause)
	join sr where sr.resource_cd = slr.resource_cd
		and sr.active_ind = 1
		and sr.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00")
		and sr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
	head report
		x = 0
	detail
		x = x + 1
		stat = alterlist(resource_locs->qual,x)
 
		resource_locs->qual[x].location_cd = sal.location_cd
		resource_locs->qual[x].resource_cd = slr.resource_cd
	with nocounter
 
	/* Possible future functionality
	; Parse resourcelocs variable
	if(sResourceLocs > " ")
		declare notfnd 		= vc with constant("<not_found>")
		declare num 		= i4 with noconstant(1)
		declare str 		= vc with noconstant("")
 
		while (str != notfnd)
	     	set str =  piece(sResourceLocs,';',num,notfnd)
	     	if(str != notfnd)
	 			set resource = cnvtreal(piece(str,",",1,""))
	 			set location = cnvtreal(piece(str,",",2,""))
 
	 			; Validate resource code is valid
	 			set iRet = GetCodeSet(resource)
				if(iRet != 14231)
					call ErrorHandler2(c_error_handler_name, "F", "Validate", "Invalid ResourceId.",
					"9999",build2("Invalid ResourceId: ",resource),slot_discovery_reply_out)
					go to exit_script
				endif
 
				; Validate location code is valid
				set iRet = GetCodeSet(location)
				if(iRet != 220)
					call ErrorHandler2(c_error_handler_name, "F", "Validate", "Invalid LocationId.",
					"9999",build2("Invalid LocationId: ",location),slot_discovery_reply_out)
					go to exit_script
				endif
 
				; Validate location/resource combo is valid
				select into "nl:"
				from sch_appt_loc sal
				, sch_list_role slro
				, sch_list_res slr
				, sch_resource sr
				plan sal where sal.location_cd = location
					and sal.appt_type_cd = dApptTypeId
					and sal.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00")
					and sal.active_ind = 1
					and sal.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
				join slro where slro.res_list_id = sal.res_list_id
					and slro.role_meaning != "PATIENT"
					and slro.sch_role_cd > 0
					and slro.res_list_id > 0
					and slro.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00")
					and slro.active_ind = 1
					and slro.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
				join slr where slr.list_role_id = slro.list_role_id
					and slr.resource_cd = resource
					and slr.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00")
					and slr.active_ind = 1
					and slr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
				join sr where sr.resource_cd = slr.resource_cd
					and sr.active_ind = 1
					and sr.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00")
					and sr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
				detail
					stat = alterlist(resource_locs->qual,num)
					resource_locs->qual[num].location_cd = location
					resource_locs->qual[num].resource_cd = resource
				with nocounter
 
				if(curqual = 0)
					call ErrorHandler2(c_error_handler_name, "F", "Validate", "Invalid ResourceId/LocationId combination.",
					"9999","Invalid ResourceId/LocationId combination.",slot_discovery_reply_out)
					go to exit_script
				endif
	       	endif
	      	set num = num + 1
		endwhile
	endif
 	*/
 
	if(iDebugFlag > 0)
		call echo(concat("UpdateResLocs Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetSlots(null)	- ;650328 - sch_get_appt_block
;  Description: Get available slots
**************************************************************************/
subroutine GetSlots(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetSlots  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iApplication = 650001
	set iTask = 650553
	set iRequest = 650328
 
	for(i = 1 to size(resource_locs->qual,5))
 		set stat = initrec(650328_req)
 		set stat = initrec(650328_rep)
 
		; Get the slot types
		select into "nl:"
		from sch_appt_loc sal
		, sch_list_role slro
		, sch_list_slot sls
		plan sal where sal.location_cd = resource_locs->qual[i].location_cd
			and sal.appt_type_cd = dApptTypeId
		join slro where slro.res_list_id = sal.res_list_id
			and slro.role_meaning != "PATIENT"
			and slro.sch_role_cd > 0
			and slro.res_list_id > 0
			and slro.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00")
			and slro.active_ind = 1
			and slro.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
		join sls where sls.list_role_id = slro.list_role_id
			and sls.active_ind = 1
			and sls.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
			and sls.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00")
		head report
			x = 0
		detail
			x = x + 1
			stat = alterlist(slot_types->qual,x)
 
			slot_types->qual[x].slot_type_id = sls.slot_type_id
		foot report
			slot_types->qual_cnt = x
		with nocounter
 
		;Setup request
		set 650328_req->security_ind = 1
		set 650328_req->secured_scheme_ind = 1
		set 650328_req->security_user_id = dUserId
		set stat = alterlist(650328_req->qual,1)
		set 650328_req->qual[1].resource_cd = resource_locs->qual[i].resource_cd
		set 650328_req->qual[1].resource_ind = 1
		set 650328_req->qual[1].beg_dt_tm = qFromDateTime
		set 650328_req->qual[1].end_dt_tm = qToDateTime
 
		;Execute request
		set stat = tdbexecute(iApplication,iTask,iRequest,"REC",650328_req,"REC",650328_rep)
 
		if(650328_rep->status_data.status = "F")
			call ErrorHandler2(c_error_handler_name, "F", "Validate", "Could not retrieve available slots (650328).",
			"9999", "Could not retrieve available slots (650328).", slot_discovery_reply_out)
			go to EXIT_SCRIPT
		else
			if(650328_rep->qual_cnt > 0)
				if(650328_rep->qual[1].qual_cnt > 0)
					call PostAmble(null)
				endif
			endif
		endif
	endfor
 
	if(iDebugFlag > 0)
		call echo(concat("GetSlots Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: PostAmble(null)
;  Description: Build final reply
**************************************************************************/
subroutine PostAmble(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostAmble  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	if(650328_rep->qual_cnt > 0)
 		set tnum = 1
 
 		select into "nl:"
 		from (dummyt d with seq = 650328_rep->qual[1].qual_cnt)
 		plan d where expand(tnum,1,slot_types->qual_cnt,650328_rep->qual[1].appointment[d.seq].slot_type_id,
 							slot_types->qual[tnum].slot_type_id)
 			and 650328_rep->qual[1].appointment[d.seq].state_meaning = "PENDING"
 		head report
 			x = size(slot_discovery_reply_out->qual,5)
 		detail
 			if((iMaxSlots > 0 and x < iMaxSlots) or iMaxSlots = 0)
 				x = x + 1
 				stat = alterlist(slot_discovery_reply_out->qual,x)
 
	 			slot_discovery_reply_out->qual[x].appointment_type.id = dApptTypeId
	 			slot_discovery_reply_out->qual[x].appointment_type.name = uar_get_code_display(dApptTypeId)
	 			slot_discovery_reply_out->qual[x].resource.id = 650328_rep->qual[1].resource_cd
	 			slot_discovery_reply_out->qual[x].resource.name = uar_get_code_display(650328_rep->qual[1].resource_cd)
	 			slot_discovery_reply_out->qual[x].location.id = 650328_rep->qual[1].appointment[d.seq].location_cd
	 			slot_discovery_reply_out->qual[x].location.name = uar_get_code_display(650328_rep->qual[1].appointment[d.seq].location_cd)
	 			slot_discovery_reply_out->qual[x].apply_def_id = 650328_rep->qual[1].appointment[d.seq].apply_def_id
	 			slot_discovery_reply_out->qual[x].apply_list_id = 650328_rep->qual[1].appointment[d.seq].apply_list_id
	 			slot_discovery_reply_out->qual[x].apply_slot_id = 650328_rep->qual[1].appointment[d.seq].apply_slot_id
	 			slot_discovery_reply_out->qual[x].beg_dt_tm = 650328_rep->qual[1].appointment[d.seq].beg_dt_tm
	 			slot_discovery_reply_out->qual[x].end_dt_tm = 650328_rep->qual[1].appointment[d.seq].end_dt_tm
	 			if(650328_rep->qual[1].appointment[d.seq].setup_duration > 0)
	 				slot_discovery_reply_out->qual[x].setup_duration.time = 650328_rep->qual[1].appointment[d.seq].setup_duration
	 				slot_discovery_reply_out->qual[x].setup_duration.units.id = c_minutes_duration_units_cd
	 				slot_discovery_reply_out->qual[x].setup_duration.units.name = uar_get_code_display(c_minutes_duration_units_cd)
	 			endif
	 			if(650328_rep->qual[1].appointment[d.seq].duration > 0)
		 			slot_discovery_reply_out->qual[x].duration.time = 650328_rep->qual[1].appointment[d.seq].duration
		 			slot_discovery_reply_out->qual[x].duration.units.id = c_minutes_duration_units_cd
		 			slot_discovery_reply_out->qual[x].duration.units.name = uar_get_code_display(c_minutes_duration_units_cd)
		 		endif
		 		if(650328_rep->qual[1].appointment[d.seq].cleanup_duration > 0)
	 				slot_discovery_reply_out->qual[x].cleanup_duration.time = 650328_rep->qual[1].appointment[d.seq].cleanup_duration
	 				slot_discovery_reply_out->qual[x].cleanup_duration.units.id = c_minutes_duration_units_cd
	 				slot_discovery_reply_out->qual[x].cleanup_duration.units.name = uar_get_code_display(c_minutes_duration_units_cd)
	 			endif
	 			slot_discovery_reply_out->qual[x].sch_appt_id = 650328_rep->qual[1].appointment[d.seq].sch_appt_id
	 			slot_discovery_reply_out->qual[x].slot_scheme_id = 650328_rep->qual[1].appointment[d.seq].slot_scheme_id
	 			slot_discovery_reply_out->qual[x].slot_state.id = 650328_rep->qual[1].appointment[d.seq].slot_state_cd
	 			slot_discovery_reply_out->qual[x].slot_state.name = uar_get_code_display(650328_rep->qual[1].appointment[d.seq].slot_state_cd)
	 			slot_discovery_reply_out->qual[x].slot_type.id = 650328_rep->qual[1].appointment[d.seq].slot_type_id
	 			slot_discovery_reply_out->qual[x].slot_type.name = 650328_rep->qual[1].appointment[d.seq].description
	 			slot_discovery_reply_out->qual[x].start_interval = 650328_rep->qual[1].appointment[d.seq].interval
	 			slot_discovery_reply_out->qual[x].sch_state.id = 650328_rep->qual[1].appointment[d.seq].sch_state_cd
	 			slot_discovery_reply_out->qual[x].sch_state.name = uar_get_code_display(650328_rep->qual[1].appointment[d.seq].sch_state_cd)
	 		endif
 		with nocounter
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("PostAmble Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
end go
set trace notranslatelock go
 
 
 
 
