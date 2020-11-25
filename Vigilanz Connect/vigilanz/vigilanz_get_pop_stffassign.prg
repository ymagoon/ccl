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
	Source file name:   snsro_get_pop_stffassign.prg
	Object name:        vigilanz_get_pop_stffassign
	Program purpose:    Staff Assignment associated with GET Population Staff Assignment
	Executing from:     MPages Discern Web Service
	Special Notes:      NONE
******************************************************************************************
                  MODIFICATION CONTROL LOG
******************************************************************************************
Mod 	Date     	Engineer    Comment
------------------------------------------------------------------------------------------
000		12/31/18	STV			Initial write
001     01/14/19 	STV     	updated to pull in assgnment group or assignment_reltn
002     01/28/19 	STV      	fix for nulled out updt_dt_tm
003     01/29/19  	STV       	update for ED facilty filtering
004     02/06/19 	STV        	update for pulling location staff assignments as well
005     04/29/19 	STV      	Added 115 second timeout
006		04/29/19	RJC			Performance changes - removed dummyt refs
******************************************************************************************/
drop program vigilanz_get_pop_stffassign go
create program vigilanz_get_pop_stffassign
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Username" = ""
	, "Beg Date" = ""
	, "End Date" = ""
	, "Facility Code List" = ""
	, "Debug Flag" = 1
	, "Time Max" = 3600
 
with OUTDEV, USERNAME, FROM_DATE, TO_DATE, LOC_LIST, DEBUG_FLAG, TIME_MAX
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common
 
/*************************************************************************
;DECLARE RECORDS
**************************************************************************/
free record stffassign_reply_out
record stffassign_reply_out(
	1 stffassign_cnt = i4
	1 stffassign[*]
		2 assignment_id = vc
		2 create_updt_dt_tm = dq8
		2 beg_effective_dt_tm = dq8
		2 end_effective_dt_tm = dq8
		2 active_ind = i2
		2 assigned_reltn
			3 reltn_desc = vc
			3 reltn_id = f8
			3 reltn_type = i4
		2 assigned_location
				3 location_cd = f8
				3 location_disp = vc
				3 loc_bed_disp = vc
				3 loc_bed_cd = f8
				3 loc_facility_disp = vc
				3 loc_facility_cd= f8
				3 loc_room_disp = vc
				3 loc_room_cd = f8
				3 loc_nurse_unit_disp = vc
				3 loc_nurse_unit_cd = f8
				3 loc_building_cd = f8
				3 loc_building_disp = vc
				3 loc_temp_cd = f8
				3 loc_temp_disp = vc
		2 encounter
			3 encounter_type_cd = f8
			3 encounter_type_disp = vc
			3 encounter_type_class_cd = f8
			3 encounter_type_class_disp = vc
			3 discharge_date = dq8
			3 arrive_date = dq8
			3 encounter_id = f8
			3 encounter_type
				4 id = f8
				4 name = vc
			3 fin_nbr = vc
			3 patient_location
				4 location_cd = f8
				4 location_disp = vc
				4 loc_bed_disp = vc
				4 loc_bed_cd = f8
				4 loc_facility_disp = vc
				4 loc_facility_cd= f8
				4 loc_room_disp = vc
				4 loc_room_cd = f8
				4 loc_nurse_unit_disp = vc
				4 loc_nurse_unit_cd = f8
				4 loc_building_cd = f8
				4 loc_building_disp = vc
				4 loc_temp_cd = f8
				4 loc_temp_disp = vc
			3 encounter_class
				4 id = f8
				4 name = vc
		2 patient
			3 patient_id = f8
			3 last_name = vc
			3 first_name = vc
			3 middle_name = vc
			3 mrn = vc
			3 birth_date_time = dq8
			3 display_name = vc
			3 sdob = c10
			3 gender
				4 id = f8
				4 name = vc
		2 patient_care_team
			3 id = f8
			3 name = vc
		2 provider
			3 provider_id = f8
			3 provider_name = vc
		2 provider_reltn
			3 reltn_desc = vc
			3 reltn_id = f8
			3 reltn_type = i4
	1 audit
		2 user_id             = f8
		2 user_firstname          = vc
		2 user_lastname           = vc
		2 patient_id            = f8
		2 patient_firstname         = vc
		2 patient_lastname          = vc
		2 service_version         = vc
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
 
free record loc_req
record loc_req (
	1 qual_cnt 							= i4
	1 qual[*]
		2 location_cd					= f8
)
 
/****************************************************************************
;VARIABLES
****************************************************************************/
;Input
declare sUserName						= vc with protect, noconstant("")
declare sFromDate						= vc with protect, noconstant("")
declare sToDate							= vc with protect, noconstant("")
declare sLocFacilities					= vc with protect, noconstant("")
declare iDebugFlag						= i2 with protect, noconstant(0)
declare iTimeMax						= i4 with protect, noconstant(0)
 
;Other
declare qFromDateTime					= dq8 with protect, noconstant(CNVTDATETIME(CURDATE, CURTIME3))
declare qToDateTime						= dq8 with protect, noconstant(CNVTDATETIME(CURDATE, CURTIME3))
declare iTimeDiff						= i4 with protect, noconstant(0)
declare timeOutThreshold 				= i4 with protect, noconstant(115);setting to 115 seconds
declare queryStartTm = dq8
 
;Constants
declare c_team_cd						= f8 with protect, constant(uar_get_code_by("MEANING",16409,"TEAM"))
declare c_mrn_encounter_alias_type_cd	= f8 with protect, constant(uar_get_code_by("MEANING",319,"MRN"))
declare c_fin_encounter_alias_type_cd	= f8 with protect, constant(uar_get_code_by("MEANING",319,"FIN NBR"))
declare c_facility_lg_type_cd           = f8 with protect, constant(uar_get_code_by("MEANING",222,"FACILITY"))
declare c_builiding_lg_type_cd          = f8 with protect, constant(uar_get_code_by("MEANING",222,"BUILDING"))
declare c_nurseunit_lg_type_cd          = f8 with protect, constant(uar_get_code_by("MEANING",222,"NURSEUNIT"))
 
 
/**************************************************************************
;INITIALIZE
**************************************************************************/
;Input
set sUserName					= trim($USERNAME,3)
set sFromDate					= trim($FROM_DATE,3)
set sToDate						= trim($TO_DATE,3)
set sLocFacilities				= trim($LOC_LIST,3)
set iDebugFlag					= cnvtint($DEBUG_FLAG)
set iTimeMax					= cnvtint($TIME_MAX)
 
;Other
set qFromDateTime = GetDateTime(sFromDate)
set qToDateTime = GetDateTime(sToDate)
 
if(iDebugFlag > 0)
 	call echo(build("sUserName -> ", sUserName))
	call echo(build("sFromDate -> ", sFromDate))
	call echo(build("qFromDateTime -> ",qFromDateTime))
	call echo(build("sToDate -> ",sToDate))
	call echo(build("qToDateTime -> ", qToDateTime))
	call echo(build("sLocFacilities -->",sLocFacilities))
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ParseLocations(null)		= null with protect
declare GetShifts(null)             = null with protect
declare GetPatientInfo(null)        = null with protect
declare GetEncounterInfo(null)      = null with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
;Validate Username
set iRet = PopulateAudit(sUserName, 0.0, stffassign_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F","POP_STAFFASSIGNMENT", "Invalid User for Audit.",
	"1001",build("UserId is invalid: ", sUserName),stffassign_reply_out)
	go to EXIT_SCRIPT
endif
 
;Validate from date is not greater than to date
if (qFromDateTime > qToDateTime)
	call ErrorHandler2("VALIDATE", "F", "POP_STAFFASSIGNMENT", "From Date Greater than To Date. Refine Dates Entered.",
	"2010", "From Date Greater than To Date. Refine Dates Entered.", stffassign_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate Time Window doesn't exceed threshold
set iRet = ThreshHoldValidator(iTimeMax,"s",qFromDateTime,qToDateTime)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "POP_STAFFASSIGNMENT", "Date Range Too Long. Refine Query.",
	"2011","Date Range Too Long. Refine Query.",stffassign_reply_out)
	go to EXIT_SCRIPT
endif
 
; Parse locations if provided
if(size(sLocFacilities) > 0)
	call ParseLocations(null)
endif
 
; Getting the Shifts
call GetShifts(null)
 
; Get Patient Info
call GetPatientInfo(null)
 
; Get Encounter Info
call GetEncounterInfo(null)
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(stffassign_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(idebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_pop_stffassign.json")
	call echo(build2("_file : ", _file))
	call echojson(stffassign_reply_out, _file, 0)
    call echorecord(stffassign_reply_out)
	call echo(JSONout)
endif
 
#EXIT_VERSION
 
/*************************************************************************
;  Name: ParseLocations(null)
;  Description: Subroutine to parse a comma delimited string
**************************************************************************/
subroutine ParseLocations(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ParseLocations Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare notfnd 		= vc with constant("<not_found>")
	declare num 		= i4 with noconstant(1)
	declare str 		= vc with noconstant("")
 
	while (str != notfnd)
	 	set str =  piece(sLocFacilities,',',num,notfnd)
	 	if(str != notfnd)
	  		set stat = alterlist(loc_req->qual,num)
	 		set loc_req->qual[num]->location_cd = cnvtint(str)
	 		set loc_req->qual_cnt = num
 
	 		 select into code_value
	 		 from code_value
			 where code_set = 220 and cdf_meaning = "FACILITY" and
			 loc_req->qual[num]->location_cd = code_value
 
	 		if (curqual = 0)
	 			call ErrorHandler2("EXECUTE", "F", "POP_DOCUMENTS", build("Invalid Facility Code: ", loc_req->qual[num]->location_cd),
				"2040", build("Invalid Facility Code: ",loc_req->qual[num]->location_cd),stffassign_reply_out) ;012
				go to Exit_Script
			endif
	 	endif
	  	set num = num + 1
	endwhile
 
	if(iDebugFlag > 0)
		call echo(concat("ParseLocations Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;End Sub
 
/*************************************************************************
;  Name: GetShifts(null)
;  Description: returns the shifts
**************************************************************************/
subroutine GetShifts(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetShifts Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare parser_string = vc
	declare nurse_unit_string = vc
	declare num = i4
	set loc_size = size(loc_req->qual,5)
 
	if(loc_size > 0)
		set parser_string = " expand(num,1,loc_size,e.loc_facility_cd,loc_req->qual[num].location_cd)"
		set nurse_unit_string = " expand(num,1,loc_size,lg.parent_loc_cd,loc_req->qual[num].location_cd)"
		;;;this is to build the nurse unit list based on parameter
		free record nurse_unit
		record nurse_unit(
			1 qual_cnt = i4
			1 qual[*]
				2 nurse_unit_cd = f8
		)
 
	 	set queryStartTm = cnvtdatetime(curdate, curtime3)
		select into "nl:"
		from location_group lg
			,location_group lg2
			,location_group lg3
		plan lg
			where parser(nurse_unit_string)
				and lg.active_ind = 1
				and lg.location_group_type_cd = c_facility_lg_type_cd
				and lg.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
				and lg.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
				and lg.root_loc_cd = 0
		join lg2
			where lg2.parent_loc_cd = lg.child_loc_cd
				and lg2.active_ind = 1
				and lg2.location_group_type_cd = c_builiding_lg_type_cd
				and lg2.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
				and lg2.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
				and lg2.root_loc_cd = 0
		join lg3
			where lg3.parent_loc_cd = lg2.child_loc_cd
				and lg3.active_ind = 1
				and lg3.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
				and lg3.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
		 		and lg3.location_group_type_cd = c_nurseunit_lg_type_cd
		 		and lg3.root_loc_cd = 0
		order by lg3.parent_loc_cd
		head report
			x = 0
			head lg3.parent_loc_cd
				x = x + 1
				stat = alterlist(nurse_unit->qual,x)
				nurse_unit->qual[x].nurse_unit_cd = lg3.parent_loc_cd
			foot report
				nurse_unit->qual_cnt = x
		with nocounter, time = value(timeOutThreshold)
 
		;keeping track of cumulative time out
		set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
		;exits the script because query timed out
		if(timeOutThreshold < 1)
			go to EXIT_SCRIPT
		endif
 
		;resetting nurse_unit_string to use in location assignment query
		if(nurse_unit->qual_cnt > 0)
			set nurse_unit_string = " expand(num,1,nurse_unit->qual_cnt,dsa.loc_unit_cd,nurse_unit->qual[num].nurse_unit_cd)"
		endif
	else
		set parser_string = "e.loc_facility_cd > outerjoin(-1.0)"
		set nurse_unit_string = "dsa.loc_unit_cd > -1.0"
	endif
 
 
	;;this is filter out non-provider relationships
	free record reltn
	record reltn(
		1 qual_cnt = i4
		1 qual[*]
			2 id = f8
	)
 
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from code_value cv
	where cv.code_set = 4003145
		and cv.cdf_meaning = "NONPROVIDER"
	head report
		x = 0
		head cv.code_value
			x = x + 1
			stat = alterlist(reltn->qual,x)
			reltn->qual[x].id = cv.code_value
	foot report
		reltn->qual_cnt = x
	with nocounter, time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(reltn->qual_cnt > 0)
		set parser_string2 = " expand(num2,1,reltn->qual_cnt,dsa.assigned_reltn_type_cd,reltn->qual[num2].id)"
	else
		set parser_string2 = "dsa.assigned_reltn_type_cd > -1.0"
	endif
 
	set ASSIGN_RELTN_CD = 4003145
	set ASSIGN_TYPE_CD = 259571
	set num = 0
	set num2 = 0
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from dcp_shift_assignment dsa
	     ,encounter e
	plan dsa
		where dsa.updt_dt_tm >= cnvtdatetime(qFromDateTime)
			and dsa.updt_dt_tm <= cnvtdatetime(qToDateTime)
			and dsa.person_id > 0
			;and parser(parser_string)
			and not parser(parser_string2)
	join e
		where e.encntr_id = outerjoin(dsa.encntr_id)
			and parser(parser_string)
	order by dsa.updt_dt_tm
	head report
		x = 0
		head dsa.assignment_id
			x = x + 1
			stat = alterlist(stffassign_reply_out->stffassign,x)
				stffassign_reply_out->stffassign[x].assignment_id = trim(cnvtstring(dsa.assignment_id),3)
			if(dsa.assigned_reltn_type_cd > 0)
				stffassign_reply_out->stffassign[x].assigned_reltn.reltn_desc = uar_get_code_display(dsa.assigned_reltn_type_cd)
				stffassign_reply_out->stffassign[x].assigned_reltn.reltn_id = dsa.assigned_reltn_type_cd
			    stffassign_reply_out->stffassign[x].assigned_reltn.reltn_type = ASSIGN_RELTN_CD
			elseif(dsa.assign_type_cd > 0)
				stffassign_reply_out->stffassign[x].assigned_reltn.reltn_desc = uar_get_code_display(dsa.assign_type_cd)
				stffassign_reply_out->stffassign[x].assigned_reltn.reltn_id = dsa.assign_type_cd
			    stffassign_reply_out->stffassign[x].assigned_reltn.reltn_type = ASSIGN_TYPE_CD
			endif
			stffassign_reply_out->stffassign[x].active_ind = dsa.active_ind
			stffassign_reply_out->stffassign[x].beg_effective_dt_tm = dsa.beg_effective_dt_tm
			stffassign_reply_out->stffassign[x].end_effective_dt_tm = dsa.end_effective_dt_tm
			stffassign_reply_out->stffassign[x].create_updt_dt_tm = dsa.updt_dt_tm
			stffassign_reply_out->stffassign[x].encounter->encounter_id = dsa.encntr_id
			stffassign_reply_out->stffassign[x].patient->patient_id = dsa.person_id
			stffassign_reply_out->stffassign[x].encounter->patient_location->loc_nurse_unit_disp = uar_get_code_display(e.loc_nurse_unit_cd)
			stffassign_reply_out->stffassign[x].encounter->patient_location->loc_nurse_unit_cd= e.loc_nurse_unit_cd
			stffassign_reply_out->stffassign[x].encounter->patient_location->loc_facility_disp = uar_get_code_display(e.loc_facility_cd)
			stffassign_reply_out->stffassign[x].encounter->patient_location->loc_facility_cd = e.loc_facility_cd
			stffassign_reply_out->stffassign[x].encounter->patient_location->loc_room_disp = uar_get_code_display(e.loc_room_cd)
			stffassign_reply_out->stffassign[x].encounter->patient_location->loc_room_cd = e.loc_room_cd
			stffassign_reply_out->stffassign[x].encounter->patient_location->loc_bed_disp = uar_get_code_display(e.loc_bed_cd)
			stffassign_reply_out->stffassign[x].encounter->patient_location->loc_bed_cd = e.loc_bed_cd
 
			stffassign_reply_out->stffassign[x].assigned_location->loc_nurse_unit_disp = uar_get_code_display(dsa.loc_unit_cd)
			stffassign_reply_out->stffassign[x].assigned_location->loc_nurse_unit_cd= dsa.loc_unit_cd
			stffassign_reply_out->stffassign[x].assigned_location->loc_facility_disp = uar_get_code_display(dsa.loc_facility_cd)
			stffassign_reply_out->stffassign[x].assigned_location->loc_facility_cd = dsa.loc_facility_cd
			stffassign_reply_out->stffassign[x].assigned_location->loc_room_disp = uar_get_code_display(dsa.loc_room_cd)
			stffassign_reply_out->stffassign[x].assigned_location->loc_room_cd = dsa.loc_room_cd
			stffassign_reply_out->stffassign[x].assigned_location->loc_bed_disp = uar_get_code_display(dsa.loc_bed_cd)
			stffassign_reply_out->stffassign[x].assigned_location->loc_bed_cd = dsa.loc_bed_cd
			stffassign_reply_out->stffassign[x].provider->provider_id = dsa.prsnl_id
 
			if(dsa.careteam_id > 0)
				stffassign_reply_out->stffassign[x].patient_care_team->id = dsa.careteam_id
			elseif(dsa.pct_care_team_id > 0)
				stffassign_reply_out->stffassign[x].patient_care_team->id = dsa.pct_care_team_id
			endif
	foot report
		stffassign_reply_out->stffassign_cnt = x
	with nocounter, time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	;;;;getting the shift assignments only tied to locations
	set num = 0
	set num2 = 0
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from dcp_shift_assignment dsa
	plan dsa
		where dsa.updt_dt_tm >= cnvtdatetime(qFromDateTime)
			and dsa.updt_dt_tm <= cnvtdatetime(qToDateTime)
			and dsa.person_id < 1
			and parser(nurse_unit_string)
			and not parser(parser_string2)
		order by dsa.updt_dt_tm
	head report
		x = stffassign_reply_out->stffassign_cnt
		head dsa.assignment_id
			x = x + 1
			stat = alterlist(stffassign_reply_out->stffassign,x)
				stffassign_reply_out->stffassign[x].assignment_id = trim(cnvtstring(dsa.assignment_id),3)
			if(dsa.assigned_reltn_type_cd > 0)
				stffassign_reply_out->stffassign[x].assigned_reltn.reltn_desc = uar_get_code_display(dsa.assigned_reltn_type_cd)
				stffassign_reply_out->stffassign[x].assigned_reltn.reltn_id = dsa.assigned_reltn_type_cd
			    stffassign_reply_out->stffassign[x].assigned_reltn.reltn_type = ASSIGN_RELTN_CD
			elseif(dsa.assign_type_cd > 0)
				stffassign_reply_out->stffassign[x].assigned_reltn.reltn_desc = uar_get_code_display(dsa.assign_type_cd)
				stffassign_reply_out->stffassign[x].assigned_reltn.reltn_id = dsa.assign_type_cd
			    stffassign_reply_out->stffassign[x].assigned_reltn.reltn_type = ASSIGN_TYPE_CD
			endif
			stffassign_reply_out->stffassign[x].active_ind = dsa.active_ind
			stffassign_reply_out->stffassign[x].beg_effective_dt_tm = dsa.beg_effective_dt_tm
			stffassign_reply_out->stffassign[x].end_effective_dt_tm = dsa.end_effective_dt_tm
			stffassign_reply_out->stffassign[x].create_updt_dt_tm = dsa.updt_dt_tm
			stffassign_reply_out->stffassign[x].assigned_location->loc_nurse_unit_disp = uar_get_code_display(dsa.loc_unit_cd)
			stffassign_reply_out->stffassign[x].assigned_location->loc_nurse_unit_cd= dsa.loc_unit_cd
			stffassign_reply_out->stffassign[x].assigned_location->loc_facility_disp = uar_get_code_display(dsa.loc_facility_cd)
			stffassign_reply_out->stffassign[x].assigned_location->loc_facility_cd = dsa.loc_facility_cd
			stffassign_reply_out->stffassign[x].assigned_location->loc_room_disp = uar_get_code_display(dsa.loc_room_cd)
			stffassign_reply_out->stffassign[x].assigned_location->loc_room_cd = dsa.loc_room_cd
			stffassign_reply_out->stffassign[x].assigned_location->loc_bed_disp = uar_get_code_display(dsa.loc_bed_cd)
			stffassign_reply_out->stffassign[x].assigned_location->loc_bed_cd = dsa.loc_bed_cd
			stffassign_reply_out->stffassign[x].provider->provider_id = dsa.prsnl_id
 
			if(dsa.careteam_id > 0)
				stffassign_reply_out->stffassign[x].patient_care_team->id = dsa.careteam_id
			elseif(dsa.pct_care_team_id > 0)
				stffassign_reply_out->stffassign[x].patient_care_team->id = dsa.pct_care_team_id
			endif
	foot report
		stffassign_reply_out->stffassign_cnt = x
	with nocounter, time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	; Set audit
	if(stffassign_reply_out->stffassign_cnt > 0)
		call ErrorHandler2("SUCCESS", "S", "POPULATION STAFF ASSIGNMENT", "Population Staff Assignment completed successfully.",
		"0000","Population Staff Assignment completed successfully.", stffassign_reply_out)
	else
		call ErrorHandler2("VALIDATE", "Z", "POPULATION STAFF ASSIGNMENT", "No Results Found",
		"0000","Please check parameters.", stffassign_reply_out)
		go to EXIT_SCRIPT
	endif
 
	;;;getting the team if it is from a careteam_id
	set idx = 1
	if(stffassign_reply_out->stffassign_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from dcp_care_team t
	plan t where expand(idx,1,stffassign_reply_out->stffassign_cnt,t.careteam_id,
		stffassign_reply_out->stffassign[idx].patient_care_team->id)
		and t.careteam_id > 0
	detail
		next = 1
		pos = locateval(idx,next,stffassign_reply_out->stffassign_cnt,t.careteam_id,
		stffassign_reply_out->stffassign[idx].patient_care_team->id)
 
		while(pos > 0 and next <= stffassign_reply_out->stffassign_cnt)
			stffassign_reply_out->stffassign[pos].patient_care_team->name = trim(t.name)
 
			next = pos + 1
			pos = locateval(idx,next,stffassign_reply_out->stffassign_cnt,t.careteam_id,
			stffassign_reply_out->stffassign[idx].patient_care_team->id)
		endwhile
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	;;;get's the med_service_code for the team name
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from pct_care_team pct
	plan pct where expand(idx,1,stffassign_reply_out->stffassign_cnt,pct.pct_care_team_id,
		stffassign_reply_out->stffassign[idx].patient_care_team->id)
		and pct.pct_care_team_id > 0
	detail
		next = 1
		pos = locateval(idx,next,stffassign_reply_out->stffassign_cnt,pct.pct_care_team_id,
		stffassign_reply_out->stffassign[idx].patient_care_team->id)
 
		while(pos > 0 and next <= stffassign_reply_out->stffassign_cnt)
			if(stffassign_reply_out->stffassign[pos].patient_care_team->name = "")
				stffassign_reply_out->stffassign[pos].patient_care_team->name = trim(uar_get_code_display(pct.pct_med_service_cd))
			endif
 
			next = pos + 1
			pos = locateval(idx,next,stffassign_reply_out->stffassign_cnt,pct.pct_care_team_id,
			stffassign_reply_out->stffassign[idx].patient_care_team->id)
		endwhile
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	;;;getting the ED assignments
	set num = 0
	if(loc_size > 0)
		set parser_string = " expand(num,1,loc_size,e.loc_facility_cd,loc_req->qual[num].location_cd)"
	else
		set parser_string = "e.loc_facility_cd > -1.0"
	endif
 
	declare provider_id = f8
	declare reltn_desc = vc
 
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from tracking_item ti
		,tracking_checkin tc
		,tracking_locator tl
		,encounter e
		,track_reference tr
	plan tc
		where tc.updt_dt_tm >= cnvtdatetime(qFromDateTime)
			and tc.updt_dt_tm  <= cnvtdatetime(qToDateTime)
	join ti
		where ti.tracking_id = tc.tracking_id
				and ti.active_ind = 1
				and ti.person_id > 0.0
	join tl
		where tl.tracking_locator_id = ti.cur_tracking_locator_id
			and tl.tracking_id = ti.tracking_id
	join e
		where e.encntr_id = ti.encntr_id
			and parser(parser_string)
	join tr
		where tr.tracking_ref_id = outerjoin(tc.team_id)
			and tr.tracking_ref_type_cd = outerjoin(c_team_cd)
	head report
		x = stffassign_reply_out->stffassign_cnt
		detail
			check = 0
			reltn_desc = ""
			provider_id = 0.0
 
		   ;this may need to expand in a differnt way because of nurse/doc assignment
		    if(tc.primary_doc_id > 0)
				check = 1
				reltn_desc = "Primary Emergency Doctor"
				provider_id = tc.primary_doc_id
			endif
 
			 if(tc.secondary_doc_id > 0)
			 	check = 1
			 	reltn_desc = "Secondary Emergency Doctor"
			 	provider_id = tc.secondary_doc_id
			 endif
 
			 if(tc.primary_nurse_id > 0)
			 	check = 1
			 	reltn_desc = "Primary Emergency Nurse"
			 	provider_id = tc.primary_nurse_id
			 endif
 
			 if(tc.secondary_nurse_id > 0)
			 	check = 1
			 	reltn_desc = "Secondary Emergency Nurse"
				provider_id = tc.secondary_nurse_id
			 endif
 
			 if(tc.primary_doc_id = 0 and tc.secondary_doc_id = 0 and tc.secondary_doc_id = 0
			 		and tc.secondary_nurse_id = 0 and tc.team_id > 0)
			 	check = 1
			 endif
 
			 if(check)
			 	x = x + 1
				stat = alterlist(stffassign_reply_out->stffassign,x)
				stffassign_reply_out->stffassign[x].assignment_id = concat(trim(cnvtstring(ti.tracking_id),3),"_ED")
				stffassign_reply_out->stffassign[x].active_ind = tc.active_ind
				stffassign_reply_out->stffassign[x].beg_effective_dt_tm = tc.checkin_dt_tm
				stffassign_reply_out->stffassign[x].end_effective_dt_tm = tc.checkout_dt_tm
				stffassign_reply_out->stffassign[x].create_updt_dt_tm = tc.updt_dt_tm
				stffassign_reply_out->stffassign[x].encounter->encounter_id = ti.encntr_id
				stffassign_reply_out->stffassign[x].patient->patient_id = ti.person_id
				stffassign_reply_out->stffassign[x].encounter->patient_location->loc_nurse_unit_disp =
					uar_get_code_display(tl.loc_nurse_unit_cd)
				stffassign_reply_out->stffassign[x].encounter->patient_location->loc_nurse_unit_cd = tl.loc_nurse_unit_cd
				stffassign_reply_out->stffassign[x].encounter->patient_location->loc_room_disp = uar_get_code_display(tl.loc_room_cd)
				stffassign_reply_out->stffassign[x].encounter->patient_location->loc_room_cd = tl.loc_room_cd
				stffassign_reply_out->stffassign[x].encounter->patient_location->loc_bed_disp= uar_get_code_display(tl.loc_bed_cd)
				stffassign_reply_out->stffassign[x].encounter->patient_location->loc_bed_cd = tl.loc_bed_cd
				stffassign_reply_out->stffassign[x].encounter->patient_location->loc_facility_disp = uar_get_code_display(e.loc_facility_cd)
				stffassign_reply_out->stffassign[x].encounter->patient_location->loc_facility_cd = e.loc_facility_cd
				stffassign_reply_out->stffassign[x].provider->provider_id = provider_id
				stffassign_reply_out->stffassign[x].assigned_reltn.reltn_desc = reltn_desc
 
				if(tc.team_id > 0)
					stffassign_reply_out->stffassign[x].patient_care_team->id = tc.team_id
					stffassign_reply_out->stffassign[x].patient_care_team->name = trim(tr.display)
				endif
			 endif
	foot report
		stffassign_reply_out->stffassign_cnt = x
	with nocounter, time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetShifts Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;end sub
 
/*************************************************************************
;  Name: GetPatientInfo(null)
;  Description: Subroutine to get patient info
**************************************************************************/
subroutine GetPatientInfo(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetPatientInfo Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set idx = 1
	if(stffassign_reply_out->stffassign_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from person p
	plan p where expand(idx,1,stffassign_reply_out->stffassign_cnt,p.person_id,
		stffassign_reply_out->stffassign[idx].patient->patient_id)
		and p.person_id > 0
	detail
		next = 1
		pos = locateval(idx,next,stffassign_reply_out->stffassign_cnt,p.person_id,
		stffassign_reply_out->stffassign[idx].patient->patient_id)
 
		while(pos > 0 and next <= stffassign_reply_out->stffassign_cnt)
			stffassign_reply_out->stffassign[pos].patient->display_name = trim(p.name_full_formatted)
			stffassign_reply_out->stffassign[pos].patient->birth_date_time = p.birth_dt_tm
			stffassign_reply_out->stffassign[pos].patient->first_name = trim(p.name_first)
			stffassign_reply_out->stffassign[pos].patient->last_name = trim(p.name_last)
			stffassign_reply_out->stffassign[pos].patient->middle_name = trim(p.name_middle)
			stffassign_reply_out->stffassign[pos].patient->gender->id = p.sex_cd
			stffassign_reply_out->stffassign[pos].patient->gender->name = trim(uar_get_code_display(p.sex_cd))
			stffassign_reply_out->stffassign[pos].patient->sdob = datetimezoneformat(p.birth_dt_tm,p.birth_tz,"YYYY-MM-DD",curtimezonedef)
 
			next = pos + 1
			pos = locateval(idx,next,stffassign_reply_out->stffassign_cnt,p.person_id,
			stffassign_reply_out->stffassign[idx].patient->patient_id)
		endwhile
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetPatientInfo Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end;end sub
 
/*************************************************************************
;  Name: GetEncounterInfo(null)
;  Description: Subroutine to get encounter info
**************************************************************************/
subroutine GetEncounterInfo(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetEncounterInfo Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set idx = 1
	if(stffassign_reply_out->stffassign_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from encounter e
	     ,encntr_alias ea1
	     ,encntr_alias ea2
	plan e where expand(idx,1,stffassign_reply_out->stffassign_cnt,e.encntr_id,
		stffassign_reply_out->stffassign[idx].encounter->encounter_id)
	join ea1 where ea1.encntr_id = outerjoin(e.encntr_id)
			and ea1.encntr_alias_type_cd = outerjoin(c_fin_encounter_alias_type_cd)
			and ea1.active_ind = outerjoin(1)
			and ea1.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate, curtime3))
	join ea2 where ea2.encntr_id = outerjoin(e.encntr_id)
			and ea2.encntr_alias_type_cd = outerjoin(c_mrn_encounter_alias_type_cd)
			and ea2.active_ind = outerjoin(1)
			and ea2.end_effective_dt_tm >outerjoin(cnvtdatetime(curdate, curtime3))
	detail
		next = 1
		pos = locateval(idx,next,stffassign_reply_out->stffassign_cnt,e.encntr_id,
		stffassign_reply_out->stffassign[idx].encounter->encounter_id)
 
		while(pos > 0 and next <= stffassign_reply_out->stffassign_cnt)
			stffassign_reply_out->stffassign[pos].encounter->discharge_date = e.disch_dt_tm
			stffassign_reply_out->stffassign[pos].encounter->arrive_date = e.reg_dt_tm
			stffassign_reply_out->stffassign[pos].encounter->encounter_type->id = e.encntr_type_cd
			stffassign_reply_out->stffassign[pos].encounter->encounter_type->name = trim(uar_get_code_display(e.encntr_type_cd))
			stffassign_reply_out->stffassign[pos].encounter->fin_nbr = trim(ea1.alias)
			stffassign_reply_out->stffassign[pos].patient->mrn = trim(ea2.alias)
			stffassign_reply_out->stffassign[pos].encounter->encounter_class->id = e.encntr_type_class_cd
			stffassign_reply_out->stffassign[pos].encounter->encounter_class->name= trim(uar_get_code_display(e.encntr_type_class_cd))
			stffassign_reply_out->stffassign[pos].encounter->encounter_type_cd = e.encntr_type_cd
			stffassign_reply_out->stffassign[pos].encounter->encounter_type_disp = trim(uar_get_code_display(e.encntr_type_cd))
			stffassign_reply_out->stffassign[pos].encounter->encounter_type_class_cd = e.encntr_type_class_cd
			stffassign_reply_out->stffassign[pos].encounter->encounter_type_class_disp = trim(uar_get_code_display(e.encntr_type_class_cd))
 
	 		next = pos + 1
			pos = locateval(idx,next,stffassign_reply_out->stffassign_cnt,e.encntr_id,
			stffassign_reply_out->stffassign[idx].encounter->encounter_id)
		endwhile
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	set idx = 1
	if(stffassign_reply_out->stffassign_cnt > 100) ;Change to 100 for multi var expands
		set exp = 2
	else
		set exp = 0
	endif
 
	;;getting the encounter provider relation
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from encntr_prsnl_reltn epr
		 ,prsnl p
	plan epr where expand(idx,1,stffassign_reply_out->stffassign_cnt,epr.encntr_id,
			stffassign_reply_out->stffassign[idx].encounter->encounter_id,
			epr.prsnl_person_id,stffassign_reply_out->stffassign[idx].provider->provider_id)
		and epr.encntr_id > 0
		and epr.prsnl_person_id > 0
	join p where p.person_id = epr.prsnl_person_id
		and p.active_ind = 1
	detail
		next = 1
		pos = locateval(idx,next,stffassign_reply_out->stffassign_cnt,epr.encntr_id,
			stffassign_reply_out->stffassign[idx].encounter->encounter_id,
			epr.prsnl_person_id,stffassign_reply_out->stffassign[idx].provider->provider_id)
 
		while(pos > 0 and next <= stffassign_reply_out->stffassign_cnt)
			stffassign_reply_out->stffassign[pos].provider->provider_name = trim(p.name_full_formatted)
			stffassign_reply_out->stffassign[pos].provider_reltn->reltn_desc = trim(uar_get_code_display(epr.encntr_prsnl_r_cd))
			stffassign_reply_out->stffassign[pos].provider_reltn->reltn_id = epr.encntr_prsnl_r_cd
			stffassign_reply_out->stffassign[pos].provider_reltn->reltn_type = 333
 
			next = pos + 1
			pos = locateval(idx,next,stffassign_reply_out->stffassign_cnt,epr.encntr_id,
			stffassign_reply_out->stffassign[idx].encounter->encounter_id,
			epr.prsnl_person_id,stffassign_reply_out->stffassign[idx].provider->provider_id)
		endwhile
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetEncounterInfo Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end;end sub
 
end
go
 
