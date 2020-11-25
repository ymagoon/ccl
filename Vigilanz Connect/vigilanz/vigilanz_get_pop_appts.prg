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
      Source file name: snsro_get_pop_appts.prg
      Object name:      vigilanz_get_pop_appts
      Program purpose:  Get updated appts
      Executing from:   Emissary
 ***********************************************************************
                  MODIFICATION CONTROL LOG
 ***********************************************************************
 Mod Date     Engineer  Comment
 -----------------------------------------------------------------------
 001 01/21/2020 KRD	Initial Write
 002 03/20/2020 KRD Changed the logic to check updt_dt_tm instead of
                    beg_dt_tm.
 002 03/24/2020 KRD Added appointment_actions object
 002 03/31/2020 KRD Added visit_reason object
************************************************************************/
drop program vigilanz_get_pop_appts go
create program vigilanz_get_pop_appts
 
prompt
	"Output to File/Printer/MINE" = "MINE"
 	, "Username:"  = ""  			;REQUIRED. Valid HNA Millennium user account.
	, "Beg Date:"  = ""				;REQUIRED. Beginning of bookmark date range.
	, "End Date:"  = ""				;OPTIONAL. No longer REQUIRED. End of bookmark date range.
	, "Facility_Code_List" = ""		;OPTIONAL. List of location facility codes from code set 220.
	, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
	, "Time Max"   = 3600			;DO NOT USE. Undocumented value to override maximum date range in seconds.
 
with OUTDEV, USERNAME, BEG_DATE, END_DATE, LOC_LIST, DEBUG_FLAG, TIME_MAX
 
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
 
free record pop_appts_reply_out
record pop_appts_reply_out (
    1 appt_cnt = i4
	1 appointments[*]
      2 sch_event_id = f8
      2 sch_appt_loc_cd = f8
	  2 appointment_comments = vc
	  2 appointment_date_time = dq8
      2 appointment_details[*]
		 3 field_id = f8 ;id
		 3 field_value = vc ;oe_field_value
   	  2 visit_reason = vc
      2 appointment_actions[*]
         3 action
         	4 id = F8
         	4 name = vc
         3 resource
         	4 id = F8
         	4 name = vc
         3 action_reason
         	4 id = F8
         	4 name = vc
         3 action_performed_by
    		4 provider_id = f8
    		4 provider_name = vc
    	 3 action_date_time = dq8
         3 appointment_date_time = dq8
      2 confirmed_date_time = dq8
      2 copay = vc
      2 create_date_time = dq8;this is updt_dt_tm
      2 duration
        3 time = i4
        3 units
        	4 id = f8
        	4 name = vc
      2 encounter
    	3 encounter_id = f8
    	3 encounter_date_time = dq8
    	3 discharge_date_time = dq8
    	3 financial_number = vc
    	3 encounter_type
    		4 id = f8
    		4 name = vc
    	3 patient_class
    		4 id = f8
    		4 name = vc
    	3 location
    		4 hospital
    			5 id = f8
    			5 name = vc
    		4 unit
    			5 id = f8
    			5 name = vc
    		4 room
    			5 id = f8
    			5 name = vc
    		4 bed
    			5 id = f8
    			5 name = vc
        2 patient
    		3 patient_id = f8
    		3 display_name = vc
    		3 last_name = vc
    		3 first_name = vc
    		3 middle_name = vc
    		3 mrn = vc
    		3 birth_date_time = dq8
    		3 gender
    			4 id = f8
    			4 name = vc
    		3 sdob = vc
    	2 is_recurring = i2
    	2 order_id = f8
    	2 resource_department_cnt = i4
    	2 resource_department[*];*long one*
    		3 department
    			4 departmentid = f8
    			4 departmentname = vc
    			4 externalname = vc
    			4 specialty = vc
    			4 address
    				5 addressid = f8
    				5 address1 = vc
    				5 address2 = vc
    				5 city = vc
    				5 state = vc
    				5 zip = vc
    				5 country_cd = vc;would need to convert the float to string
    				5 country_disp = vc
    				5 type
    					6 id = f8
    					6 name = vc
    			4 phones[*]
    				5 phoneid = f8
    				5 number = vc
    		        5 Extension = vc
    				5 sequencenumber = i4
    				5 type
    					6 id = f8
    					6 name = vc
    			4 drivingdirections = vc
    		3 resource
    			4 providerid = f8
    			4 providername = vc
    	2 status
    	    3 id = f8
    	    3 name = vc
    	2 visit_type
    	    3 externalname = vc
    	    3 visittypeid  = f8
    	    3 visittypename  = vc
 
 	  1 audit
			2 user_id					= f8
			2 user_firstname			= vc
			2 user_lastname				= vc
			2 patient_id				= f8
			2 patient_firstname			= vc
			2 patient_lastname			= vc
		    2 service_version			= vc
		    2 query_execute_time		= vc
		    2 query_execute_units		= vc
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
 
free record nurse_unit
record nurse_unit(
		1 qual_cnt = i4
		1 qual[*]
			2 nurse_unit_cd = f8
)
 
;initialize status to FAIL
set pop_appts_reply_out->status_data.status = "F"
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Input
declare sUserName				= vc with protect, noconstant("")
declare sFromDate				= vc with protect, noconstant("")
declare sToDate					= vc with protect, noconstant("")
declare sLocFacilities			= vc with protect, noconstant("")
declare iDebugFlag				= i2 with protect, noconstant(0)
declare iTimeMax				= i4 with protect, noconstant(0)
 
;Other
declare qFromDateTime				= dq8 with protect, noconstant(CNVTDATETIME(CURDATE, CURTIME3))
declare qToDateTime					= dq8 with protect, noconstant(CNVTDATETIME(CURDATE, CURTIME3))
declare iTimeDiff				= i4 with protect, noconstant(0)
declare sLocWhereClause				= vc with protect, noconstant("")
declare sEncWhereClause					= vc with protect, noconstant("")
declare timeOutThreshold = i4 with protect, noconstant(115);setting to 115 seconds
declare queryStartTm = dq8
declare iMaxRecs						= i4 with protect, constant(2001)
 
;Constants
 
declare c_nurseunit_lg_type_cd          = f8 with protect, constant(uar_get_code_by("MEANING",222,"NURSEUNIT"))
declare c_ambulatory_lg_type_cd          = f8 with protect, constant(uar_get_code_by("MEANING",222,"AMBULATORY"))
declare c_facility_lg_type_cd           = f8 with protect, constant(uar_get_code_by("MEANING",222,"FACILITY"))
declare c_builiding_lg_type_cd          = f8 with protect, constant(uar_get_code_by("MEANING",222,"BUILDING"))
declare SCHEDULINGCOMMENTS_CD          = f8 with protect, constant(uar_get_code_by("MEANING",15589,"COMMENT"))  ;13507.00
declare c_fin_encounter_alias_type_cd	= f8 with protect, constant(uar_get_code_by("MEANING",319,"FIN NBR"))
declare c_mrn_encounter_alias_type_cd   = f8 with protect, constant(uar_get_code_by("MEANING",319,"MRN"))
declare c_mrn_person_alias_type_cd			= f8 with protect, constant(uar_get_code_by("MEANING",4,"MRN"))
declare c_action_type_cd                = f8 with protect, constant(uar_get_code_by("MEANING",14232,"APPOINTMENT"))
declare c_view_action_cd 				= f8 with protect, constant(uar_get_code_by("MEANING",14232,"VIEW"))
 
 
declare num = i4 with protect, noconstant(0)
declare num1 = i4 with protect, noconstant(0)
declare pop = i4 with protect, noconstant(0)
/**************************************************************************
;INITIALIZE
**************************************************************************/
set modify maxvarlen 200000000
 
;Input
set sUserName					= trim($USERNAME,3)
set sFromDate					= trim($BEG_DATE,3)
set sToDate						= trim($END_DATE,3)
set sLocFacilities				= trim($LOC_LIST,3)
set iDebugFlag					= cnvtint($DEBUG_FLAG)
set iTimeMax					= cnvtint($TIME_MAX)
 
set qFromDateTime = GetDateTime(sFromDate)
set qToDateTime = GetDateTime(sToDate)
 
 
/**************************************************************************
;DECLARE SUBROUTINES
***************************************************************************/
;get_appointments
declare ParseLocations(sLocFacilities = vc)	= null with protect ;list parse out code values
declare GetAppointmentLocList(null)	= null with protect ;list parse out code values
declare GetPatientsList(null)	    = null with protect ;list parse out code values
declare GetPatientInfo(null)        = null with protect
declare GetEncounterInfo(null)      = null with protect
declare GetOEDetails(null)      	= null with protect
declare GetResourceDepartment(null) = null with protect
declare GetApptComments(null) 		= null with protect
declare	GetApGetCopay (null) 		= null with protect
declare GetAppointmentActions(null) = null with protect
declare GetVisitReason(null) 		= null with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Validate Username
set iRet = PopulateAudit(sUserName, 0.0, pop_appts_reply_out, sVersion)
 if(iRet = 0)
	call ErrorHandler2("ORDERS", "F","User is invalid", "Invalid User for Audit.","1001",build("User is invalid. ",
	"Invalid User for Audit."),pop_appts_reply_out) ;008
	go to EXIT_SCRIPT
endif
 
; Validate from date is not greather than to date - 012
 
if (qFromDateTime > qToDateTime)
	call ErrorHandler2("SELECT", "F", "VALIDATE", "From Date Greater than To Date. Refine Dates Entered.",
	"2010", "From Date Greater than To Date. Refine Dates Entered.", pop_appts_reply_out)
	go to EXIT_SCRIPT
endif
 
;Validate timespan doesn't exceed threshold
set iRet = ThreshHoldValidator(iTimeMax,"s",qFromDateTime,qToDateTime)
if(iRet = 0)
	call ErrorHandler2("SELECT", "F", "VALIDATE", "Date Range Too Long. Refine Query.",
	"2011","Date Range Too Long. Refine Query.",pop_appts_reply_out) ;008
	go to EXIT_SCRIPT
endif
 
 
;Parse locations if provided
if(sLocFacilities > " ")
	call ParseLocations(sLocFacilities)
endif
 
;Get appointment locations list for given facility:
if(loc_req->qual_cnt > 0)
call GetAppointmentLocList(null)
endif
 
;Get Patients List:
call GetPatientsList(null)
 
;Get Patients List:
if (pop_appts_reply_out->appt_cnt > 0)
	call GetPatientInfo(null)
	call GetEncounterInfo(null)
	call GetOEDetails(null)
	call GetApptComments(null)
	call GetResourceDepartment(null)
	call GetApGetCopay(null)
	call GetAppointmentActions(null)
	call GetVisitReason(null)
endif
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(pop_appts_reply_out)
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_pop_appts.json")
	call echo(build2("_file : ", _file))
	call echojson(pop_appts_reply_out, _file, 0)
    call echorecord(pop_appts_reply_out)
	call echo(JSONout)
endif
 
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
#EXIT_VERSION
 
 
/*************************************************************************
;  Name: ParseLocations(sLocFacilties = vc)
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
			 where code_set = 220
			 and cdf_meaning = "FACILITY"
			 and loc_req->qual[num]->location_cd = code_value
 
	 		if (curqual = 0)
	 			call ErrorHandler2("EXECUTE", "F", "POP_DOCUMENTS", build("Invalid Facility Code: ",
	 			loc_req->qual[num]->location_cd),
				"2040", build("Invalid Facility Code: ",loc_req->qual[num]->location_cd),patient_reply_out)
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
;================================================================
;  Name: GetAppointmentLocList
;  Description: Get scheduling appointments from Scheduling Tables
;================================================================
subroutine GetAppointmentLocList(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetAppointmentLocList Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set loc_size = size(loc_req->qual,5)
	if(loc_size > 0)
	 	set queryStartTm = cnvtdatetime(curdate, curtime3)
		select into "nl:"
		from location_group lg
			,location_group lg2
			;,location_group lg3
		plan lg
			where expand(num1,1,loc_size,lg.parent_loc_cd,loc_req->qual[num1].location_cd)
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
;		join lg3
;			where lg3.parent_loc_cd = lg2.child_loc_cd
;			and lg3.active_ind = 1
;			and lg3.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
;			and lg3.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
;		 	and lg3.location_group_type_cd in (c_ambulatory_lg_type_cd, c_nurseunit_lg_type_cd)
;		 	and lg3.root_loc_cd = 0
		order by lg2.child_loc_cd
		head report
			x = 0
			head lg2.child_loc_cd
				x = x + 1
				stat = alterlist(nurse_unit->qual,x)
				nurse_unit->qual[x].nurse_unit_cd = lg2.child_loc_cd
			foot report
				nurse_unit->qual_cnt = x
		with nocounter, time = 60
	endif
 
   	if(iDebugFlag > 0)
		call echo(concat("get appointment location list Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
 
end ;end of sub
 
;===================================================================
;getPatientsList - create patients list
;===================================================================
 
subroutine GetPatientsList(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("getting Patients List Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	;Set expand control value
	if(nurse_unit->qual_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	declare alias_pools_string = vc
	declare num = i4
 
	;resetting alias_pools_string to use in location assignment query
	if(nurse_unit->qual_cnt > 0)
		set nurse_unit_string = " expand(num,1,nurse_unit->qual_cnt,sa.appt_location_cd,nurse_unit->qual[num].nurse_unit_cd)"
	else
		set nurse_unit_string = "sa.appt_location_cd > -1.0"
	endif
	call echo(nurse_unit_string)
   	select into "nl:"
		sa.appt_location_cd
		,sa.person_id
		,sa.encntr_id
		,sa.sch_appt_id
		,sa.sch_event_id
	from sch_event se, sch_appt sa
	plan se
		where se.updt_dt_tm between cnvtdatetime(qFromDateTime) and cnvtdatetime(qToDateTime)
	join sa
		where sa.sch_event_id = se.sch_event_id
	    and parser(nurse_unit_string)
	order by sa.updt_dt_tm, sa.appt_location_cd , sa.person_id , sa.encntr_id, sa.sch_appt_id , sa.sch_event_id
 
 	head report
	 x = 0
	 max_reached = 0
	 stat = alterlist(pop_appts_reply_out->appointments,iMaxRecs)
	 y = 0
	 head sa.updt_dt_tm
	   if(x > iMaxRecs)
		 max_reached = 1
	   endif
 	   head sa.sch_event_id
		if(max_reached = 0)
			x = x + 1
			if(mod(x,100) = 1 and x > iMaxRecs)
				stat = alterlist(pop_appts_reply_out->appointments,x + 99)
			endif
		endif
      	detail
		  if(max_reached = 0)
 			stat = alterlist(pop_appts_reply_out->appointments,x)
			pop_appts_reply_out->appointments[x].appointment_date_time = sa.beg_dt_tm
 			pop_appts_reply_out->appointments[x].confirmed_date_time  = sa.beg_effective_dt_tm
 			pop_appts_reply_out->appointments[x].encounter.encounter_id = sa.encntr_id
 			pop_appts_reply_out->appointments[x].is_recurring = se.recur_type_flag
 			pop_appts_reply_out->appointments[x].create_date_time = sa.updt_dt_tm
 			pop_appts_reply_out->appointments[x].duration.time = sa.duration
 			pop_appts_reply_out->appointments[x].duration.units.name = "MINUTES";duration in cerner is minutes
	 		pop_appts_reply_out->appointments[x].sch_event_id = se.sch_event_id
	 		pop_appts_reply_out->appointments[x].sch_appt_loc_cd = sa.appt_location_cd
	 		pop_appts_reply_out->appointments[x].patient.patient_id  = sa.person_id
	  		pop_appts_reply_out->appointments[x].status.id  = sa.sch_state_cd
	 		pop_appts_reply_out->appointments[x].status.name = uar_get_code_display (sa.sch_state_cd)
	 		pop_appts_reply_out->appointments[x].visit_type.visittypeid  = se.appt_type_cd
	 		pop_appts_reply_out->appointments[x].visit_type.visittypename = uar_get_code_display(se.appt_type_cd)
	 		pop_appts_reply_out->appointments[x].visit_type.externalname  = se.appt_synonym_free
		  endif
 	foot report
 		pop_appts_reply_out->appt_cnt = x
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag)
 		call echo(build("------Qual Cnt = ",pop_appts_reply_out->appt_cnt))
 	endif
 
	; Populate audit
	if(pop_appts_reply_out->appt_cnt  > 0)
		call ErrorHandler("EXECUTE", "S", "Success", "Get Pop appointments completed successfully.", pop_appts_reply_out)
	else
		call ErrorHandler("EXECUTE", "Z", "No Data.", "No records qualify.", pop_appts_reply_out)
		go to EXIT_SCRIPT
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
	if(pop_appts_reply_out->appt_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from person p
	     ,person_alias pa
	plan p where expand(idx,1,pop_appts_reply_out->appt_cnt,p.person_id,
						pop_appts_reply_out->appointments[idx].patient->patient_id)
		and p.person_id > 0
	join pa
		where p.person_id = outerjoin(pa.person_id)
		and pa.person_alias_type_cd = outerjoin(c_mrn_person_alias_type_cd)
		and pa.active_ind  = outerjoin (1)
		and pa.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate, curtime3))
	detail
		next = 1
		pos = locateval(idx,next,pop_appts_reply_out->appt_cnt,p.person_id,
						pop_appts_reply_out->appointments[idx].patient->patient_id)
 
		while(pos > 0 and next <= pop_appts_reply_out->appt_cnt)
			pop_appts_reply_out->appointments[pos].patient->display_name = trim(p.name_full_formatted)
			pop_appts_reply_out->appointments[pos].patient->birth_date_time = p.birth_dt_tm
			pop_appts_reply_out->appointments[pos].patient->first_name = trim(p.name_first)
			pop_appts_reply_out->appointments[pos].patient->last_name = trim(p.name_last)
			pop_appts_reply_out->appointments[pos].patient->middle_name = trim(p.name_middle)
			pop_appts_reply_out->appointments[pos].patient->gender->id = p.sex_cd
			pop_appts_reply_out->appointments[pos].patient->gender->name = trim(uar_get_code_display(p.sex_cd))
			pop_appts_reply_out->appointments[pos].patient->mrn  = trim(pa.alias )
			pop_appts_reply_out->appointments[pos].patient->sdob =
			datetimezoneformat(p.birth_dt_tm,p.birth_tz,"YYYY-MM-DD",curtimezonedef)
 
			next = pos + 1
			pos = locateval(idx,next,pop_appts_reply_out->appt_cnt,p.person_id,
			pop_appts_reply_out->appointments[idx].patient->patient_id)
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
	if(pop_appts_reply_out->appt_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from encounter e
		 ,encntr_alias ea1
		 ,encntr_alias ea2
	plan e where expand(idx,1,pop_appts_reply_out->appt_cnt,e.encntr_id,
		pop_appts_reply_out->appointments[idx].encounter->encounter_id)
	join ea1 where ea1.encntr_id = outerjoin(e.encntr_id)
			and ea1.encntr_alias_type_cd = outerjoin(c_fin_encounter_alias_type_cd)
			and ea1.active_ind = outerjoin(1)
			and ea1.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate, curtime3))
	join ea2 where ea2.encntr_id = outerjoin(e.encntr_id)
			and ea2.encntr_alias_type_cd = outerjoin(c_mrn_encounter_alias_type_cd)
			and ea2.active_ind = outerjoin(1)
			and ea2.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate, curtime3))
	detail
		next = 1
		pos = locateval(idx,next,pop_appts_reply_out->appt_cnt,e.encntr_id,
		pop_appts_reply_out->appointments[idx].encounter->encounter_id)
 
		while(pos > 0 and next <= pop_appts_reply_out->appt_cnt)
			pop_appts_reply_out->appointments[pos].encounter->discharge_date_time = e.disch_dt_tm
			pop_appts_reply_out->appointments[pos].encounter->encounter_date_time = e.reg_dt_tm
			pop_appts_reply_out->appointments[pos].encounter->encounter_type->id = e.encntr_type_cd
			pop_appts_reply_out->appointments[pos].encounter->encounter_type->name = trim(uar_get_code_display(e.encntr_type_cd))
			pop_appts_reply_out->appointments[pos].encounter->patient_class.id = e.patient_classification_cd
			pop_appts_reply_out->appointments[pos].encounter->patient_class.name =
			                                                 trim(uar_get_code_display(e.patient_classification_cd))
  			pop_appts_reply_out->appointments[pos].encounter->financial_number = trim(ea1.alias)
			if(trim (ea2.alias) > "")
				pop_appts_reply_out->appointments[pos].patient->mrn = trim(ea2.alias)
			endif
  			pop_appts_reply_out->appointments[pos].encounter->location.bed.id = e.loc_bed_cd
  			pop_appts_reply_out->appointments[pos].encounter->location.bed.name = trim(uar_get_code_display(e.loc_bed_cd))
  			pop_appts_reply_out->appointments[pos].encounter->location.hospital.id = e.loc_facility_cd
  			pop_appts_reply_out->appointments[pos].encounter->location.hospital.name=trim(uar_get_code_display(e.loc_facility_cd))
  			pop_appts_reply_out->appointments[pos].encounter->location.room.id = e.loc_room_cd
  			pop_appts_reply_out->appointments[pos].encounter->location.room.name = trim(uar_get_code_display(e.loc_room_cd))
  			pop_appts_reply_out->appointments[pos].encounter->location.unit.id = e.loc_nurse_unit_cd
  			pop_appts_reply_out->appointments[pos].encounter->location.unit.name =trim(uar_get_code_display(e.loc_nurse_unit_cd))
 
	 		next = pos + 1
			pos = locateval(idx,next,pop_appts_reply_out->appt_cnt,e.encntr_id,
			pop_appts_reply_out->appointments[idx].encounter->encounter_id)
		endwhile
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
end;end sub
 
/*************************************************************************
;  Name: GetOEDetails(null)
;  Description: Get the OE Format details
**************************************************************************/
subroutine GetOEDetails(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetOEDetails Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
	set idx = 1
	if(pop_appts_reply_out->appt_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
 	; Get Field data
	select into "nl:"
	 se.sch_event_id , off.oe_field_id
	from sch_event se
		 ,sch_event_detail sed
	     ,oe_format_fields oef
	     ,order_entry_fields off
 
	plan se
		where expand(idx,1,pop_appts_reply_out->appt_cnt,se.sch_event_id,
						pop_appts_reply_out->appointments[idx].sch_event_id )
	    and se.active_ind = 1
		and se.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
 
	join sed
		where sed.sch_event_id = se.sch_event_id
		and sed.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
		and sed.active_ind = 1
 
	join oef
		where oef.oe_format_id = se.oe_format_id
		and oef.oe_field_id = sed.oe_field_id
		and oef.action_type_cd = c_action_type_cd
			and oef.oe_field_id > 0
	join off
		where off.oe_field_id = oef.oe_field_id
 
	order by se.sch_event_id , off.oe_field_id
 
	head report
		x = 0
	head se.sch_event_id
	    x = 0
	    pos = 0
	head off.oe_field_id
		x = x + 1
		pos = locateval(idx,1,pop_appts_reply_out->appt_cnt,se.sch_event_id,
						pop_appts_reply_out->appointments[idx].sch_event_id )
		stat = alterlist(pop_appts_reply_out->appointments[pos].appointment_details, x)
		pop_appts_reply_out->appointments[pos].appointment_details[x].field_id = off.oe_field_id
		pop_appts_reply_out->appointments[pos].appointment_details[x].field_value = trim(oef.label_text,3)
 
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetOEDetails Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ; End Subroutine
 
/*************************************************************************
;  Name: GetAppointmentActions(null)
;  Description: Get the OE Format details
**************************************************************************/
subroutine GetAppointmentActions(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetAppointmentActions Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
	set idx = 1
	if(pop_appts_reply_out->appt_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	select into 'nl:'
	idx,sa.sch_event_id , S.action_dt_tm , sa.sch_appt_id
	from sch_event_action s
		,sch_appt sa
		,prsnl p
	plan s
	where expand(idx,1,pop_appts_reply_out->appt_cnt,s.sch_event_id,
				pop_appts_reply_out->appointments[idx].sch_event_id )
	and s.sch_action_cd != c_view_action_cd
	and s.active_ind = 1
	and s.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
	join sa
	where  sa.sch_event_id = s.sch_event_id
	and sa.schedule_id = s.schedule_id
	and sa.resource_cd  > 0.0
	join p
	where p.person_id = s.action_prsnl_id
	order by  sa.sch_event_id , S.action_dt_tm , sa.sch_appt_id
 
	head report
		x = 0
	head sa.sch_event_id
	    x = 0
	    pos = 0
		pos = locateval(idx,1,pop_appts_reply_out->appt_cnt,s.sch_event_id,
						pop_appts_reply_out->appointments[idx].sch_event_id )
    detail
		x = x + 1
		stat = alterlist(pop_appts_reply_out->appointments[pos].appointment_actions, x)
		pop_appts_reply_out->appointments[pos].appointment_actions[x].action.id = s.sch_action_cd
		pop_appts_reply_out->appointments[pos].appointment_actions[x].action.name = uar_get_code_display(s.sch_action_cd)
		pop_appts_reply_out->appointments[pos].appointment_actions[x].resource.id = sa.resource_cd
		pop_appts_reply_out->appointments[pos].appointment_actions[x].resource.name = uar_get_code_display(sa.resource_cd)
		pop_appts_reply_out->appointments[pos].appointment_actions[x].action_reason.id = s.sch_reason_cd
		pop_appts_reply_out->appointments[pos].appointment_actions[x].action_reason.name = uar_get_code_display(s.sch_reason_cd)
		pop_appts_reply_out->appointments[pos].appointment_actions[x].action_performed_by.provider_id = p.person_id
		pop_appts_reply_out->appointments[pos].appointment_actions[x].action_performed_by.provider_name= p.name_full_formatted
		pop_appts_reply_out->appointments[pos].appointment_actions[x].action_date_time = s.action_dt_tm
		pop_appts_reply_out->appointments[pos].appointment_actions[x].appointment_date_time = sa.beg_dt_tm
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetAppointmentActions Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ; End Subroutine
 
/*************************************************************************
;  Name: GetVisitReason(null)
;  Description: Get the OE Format details
**************************************************************************/
subroutine GetVisitReason(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetVisitReason Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
	set idx = 1
	if(pop_appts_reply_out->appt_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	select into 'nl:'
	idx,s.sch_event_id
	from sch_event_disp s
	plan s
	where expand(idx,1,pop_appts_reply_out->appt_cnt,s.sch_event_id,
				pop_appts_reply_out->appointments[idx].sch_event_id )
     and s.parent_id > 0
     and s.disp_field_meaning = "APPT_REASON"
     and s.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00" )
	order by s.sch_event_id
	head report
	    pos = 0
	head s.sch_event_id
	    pos = 0
		pos = locateval(idx,1,pop_appts_reply_out->appt_cnt,s.sch_event_id,
						pop_appts_reply_out->appointments[idx].sch_event_id )
		pop_appts_reply_out->appointments[pos].visit_reason = s.disp_display
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetVisitReason Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
end ; End Subroutine
 
/*************************************************************************
;  Name: GetResourceDepartment(null)
;  Description: Get the OE Format details
**************************************************************************/
subroutine GetResourceDepartment(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetResourceDepartment Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
	set idx = 1
	if(pop_appts_reply_out->appt_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
	select into "nl:"
	  ss.sch_event_id
	  ,ss.schedule_id
	  ,l.location_cd
	from sch_schedule ss
		, sch_location a
		,location l
	plan ss
		where expand(idx,1,pop_appts_reply_out->appt_cnt,ss.sch_event_id,
						pop_appts_reply_out->appointments[idx].sch_event_id  )
		;and l.active_status_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
    join a
    	where a.schedule_id = ss.schedule_id
    	and a.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00" )
    join l
    	where l.location_cd = a.location_cd
 
	order by ss.sch_event_id , ss.schedule_id , l.location_cd
 
	head report
		x = 0
	head ss.schedule_id
	   x = 0
	   pos = 0
	head l.location_cd
	    x = 0
		x = x + 1
		pos = locateval(idx,1,pop_appts_reply_out->appt_cnt, ss.sch_event_id  ,
						pop_appts_reply_out->appointments[idx].sch_event_id )
		stat = alterlist(pop_appts_reply_out->appointments[pos].resource_department, x)
		pop_appts_reply_out->appointments[pos].resource_department[x].department.departmentid = l.location_cd
		pop_appts_reply_out->appointments[pos].resource_department[x].department.departmentname =
																							uar_get_code_display(l.location_cd )
		pop_appts_reply_out->appointments[pos].resource_department[x].department.externalname =
																							uar_get_code_display(l.location_cd )
 
    foot l.location_cd
      pop_appts_reply_out->appointments[pos].resource_department_cnt = x
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("Get Resouce_Department Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
;get address and phone for department collected above
	for(i = 1 to pop_appts_reply_out->appt_cnt)
 		for (x=1 to pop_appts_reply_out->appointments[i].resource_department_cnt)
				; Location Address
				select into "nl:"
				from address a
				plan a
					 where a.parent_entity_id =pop_appts_reply_out->Appointments[i].resource_department[x].department.departmentid
					 and a.parent_entity_name = "LOCATION"
					 and a.address_type_cd = value(uar_get_code_by("MEANING",212,"BUSINESS"))
					 and a.active_ind = 1
					 and a.end_effective_dt_tm > sysdate
					 and a.beg_effective_dt_tm <= sysdate
				detail
					pop_appts_reply_out->Appointments[i].resource_department[x].Department.Address.AddressId = a.address_id
					pop_appts_reply_out->Appointments[i].resource_department[x].Department.Address.addressid = a.address_id
					pop_appts_reply_out->Appointments[i].resource_department[x].Department.Address.Address1 = trim(a.street_addr)
					pop_appts_reply_out->Appointments[i].resource_department[x].Department.Address.Address2 = trim(a.street_addr2)
					if (a.city_cd > 0 )
						pop_appts_reply_out->Appointments[i].resource_department[x].Department.Address.City =
																								uar_get_code_display(a.city_cd )
					else
						pop_appts_reply_out->Appointments[i].resource_department[x].Department.Address.City = trim(a.city)
					endif
 
					pop_appts_reply_out->Appointments[i].resource_department[x].Department.Address.Zip = a.zipcode
 
					if(a.state_cd > 0)
						pop_appts_reply_out->Appointments[i].resource_department[x].Department.Address.State =
																								uar_get_code_display(a.state_cd)
					else
						pop_appts_reply_out->Appointments[i].resource_department[x].Department.Address.State = trim(a.state)
					endif
 
					if(a.country_cd > 0)
						pop_appts_reply_out->Appointments[i].resource_department[x].Department.Address.country_disp =
																							uar_get_code_display(a.country_cd )
						pop_appts_reply_out->Appointments[i].resource_department[x].Department.Address.country_cd =
																								cnvtstring(a.country_cd)
					else
						pop_appts_reply_out->Appointments[i].resource_department[x].Department.Address.country_disp =
																								trim(a.country)
 
					endif
 
					pop_appts_reply_out->Appointments[i].resource_department[x].Department.Address.Type.Id = a.address_type_cd
					pop_appts_reply_out->Appointments[i].resource_department[x].Department.Address.Type.Name =
																						uar_get_code_display(a.address_type_cd)
 
				with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
				;keeping track of cumulative time out
				set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
				;exits the script because query timed out
				if(timeOutThreshold < 1)
					go to EXIT_SCRIPT
				endif
 
				if(iDebugFlag > 0)
					call echo(concat("Get Resource_department-address Runtime: ",
	    			trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    			" seconds"))
				endif
 
	 			; Location Phones
				select into "nl:"
					ph.parent_entity_id
					,ph.phone_type_cd
				from phone ph
					where ph.parent_entity_id=pop_appts_reply_out->Appointments[i].resource_department[x].department.departmentid
					and ph.parent_entity_name = "LOCATION"
					and ph.active_ind = 1
					and ph.end_effective_dt_tm > sysdate
					and ph.beg_effective_dt_tm <= sysdate
				order by ph.parent_entity_id , ph.phone_type_cd
				head report
					p = 0
				head ph.parent_entity_id
				    p = 0
				detail
					p = p + 1
					stat = alterlist(pop_appts_reply_out->Appointments[i].resource_department[x].Department.Phones,p)
					pop_appts_reply_out->Appointments[i].resource_department[x].Department.Phones[p].PhoneId = ph.phone_id
					pop_appts_reply_out->Appointments[i].resource_department[x].Department.Phones[p].Number = ph.phone_num
					pop_appts_reply_out->Appointments[i].resource_department[x].Department.Phones[p].SequenceNumber =
																											ph.phone_type_seq
					pop_appts_reply_out->Appointments[i].resource_department[x].Department.Phones[p].Extension = ph.extension
					pop_appts_reply_out->Appointments[i].resource_department[x].Department.Phones[p].Type.Id = ph.phone_type_cd
					pop_appts_reply_out->Appointments[i].resource_department[x].Department.Phones[p].Type.Name =
						uar_get_code_display(ph.phone_type_cd)
				with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
				;keeping track of cumulative time out
				set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
				;exits the script because query timed out
				if(timeOutThreshold < 1)
					go to EXIT_SCRIPT
				endif
 
				if(iDebugFlag > 0)
					call echo(concat("Get Resource_department-phone Runtime: ",
	    			trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    			" seconds"))
				endif
 
				;get resource->provider info
  				SELECT INTO "nl:"
   					a.sch_event_id
					,r.resource_cd
   				FROM (sch_appt a ),
    				(sch_appt_def ad ),
    				(sch_resource r )
   				PLAN  (a
				where a.sch_event_id = pop_appts_reply_out->appointments[i].sch_event_id
   				;WHERE (a.sch_event_id = request->qual[d.seq ].sch_event_id )
    			;AND (a.schedule_id = request->qual[d.seq ].schedule_id )
    			and a.resource_cd > 0
    			AND (a.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00" ) ) )
    			JOIN (ad
    			WHERE (ad.apply_def_id = a.apply_def_id )
    			;AND (cnvtdatetime (t_get_event_schedule->current_dt_tm ) >= ad.vis_beg_dt_tm )
    			;AND (cnvtdatetime (t_get_event_schedule->current_dt_tm ) < ad.vis_end_dt_tm )
    			AND (ad.def_state_meaning != "REMOVED" )
    			AND (a.beg_dt_tm >= ad.beg_dt_tm )
    			AND (a.beg_dt_tm < ad.end_dt_tm )
    			AND (ad.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00" ) ) )
    			JOIN (r
    			WHERE (r.resource_cd = a.resource_cd )
    			AND (r.version_dt_tm = cnvtdatetime ("31-DEC-2100 00:00:00.00" ) ) )
    			ORDER BY A.sch_event_id, r.resource_cd DESC
				head report
					p = 0
				head a.sch_event_id
				    p = 0
				detail
					pop_appts_reply_out->Appointments[i].resource_department[x].resource.providerid = r.resource_cd
					pop_appts_reply_out->Appointments[i].resource_department[x].resource.providername  =
																							uar_get_code_display(r.resource_cd )
 
				with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
				;keeping track of cumulative time out
				set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
				;exits the script because query timed out
				if(timeOutThreshold < 1)
					go to EXIT_SCRIPT
				endif
 
				if(iDebugFlag > 0)
					call echo(concat("Get Resource_department-resource Runtime: ",
	    			trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    			" seconds"))
				endif
		endfor
	endfor
 
end ; End Subroutine
 
 
/*************************************************************************
;  Name: GetApptComments(null)
;  Description: ;GetApptComments
**************************************************************************/
subroutine GetApptComments (null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetApptComments Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
	set idx = 1
	if(pop_appts_reply_out->appt_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
 	; Get Field data
	select into "nl:"
	 sc.sch_event_id , l.long_text_id
	from sch_event_comm sc
	     ,long_text l
	plan sc
		where expand(idx,1,pop_appts_reply_out->appt_cnt,sc.sch_event_id,
						pop_appts_reply_out->appointments[idx].sch_event_id )
	    and sc.active_ind = 1
		and sc.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
	join l
    	where l.long_text_id = sc.text_id
	order by sc.sch_event_id , l.long_text_id
 
	head report
		pos = 0
	head sc.sch_event_id
	    pos = 0
	head l.long_text_id
		pos = locateval(idx,1,pop_appts_reply_out->appt_cnt,sc.sch_event_id,
						pop_appts_reply_out->appointments[idx].sch_event_id )
   		if (l.long_text_id > 0 )
   			pop_appts_reply_out->appointments[pos].appointment_comments = l.long_text
     	else
   			pop_appts_reply_out->appointments[pos].appointment_comments = ""
     	endif
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetOEDetails Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end  ;End subroutine
 
 
/*************************************************************************
;  Name: GetCopay(null)
;  Description: ;GetApGetCopay
**************************************************************************/
subroutine GetApGetCopay(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetCopay Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
	set idx = 1
	if(pop_appts_reply_out->appt_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
 	; Get Field data
	select into "nl:"
	 pp.person_id , pp.health_plan_id
	from  person_plan_reltn pp
	,health_plan h
	plan pp
		where expand(idx,1,pop_appts_reply_out->appt_cnt,pp.person_id ,
						pop_appts_reply_out->appointments[idx].patient.patient_id )
	join h
    	where h.health_plan_id = pp.health_plan_id
	order by pp.person_id , pp.health_plan_id
 
	head report
		pos = 0
	head pp.person_id
	    pos = 0
	head pp.health_plan_id
		pos = locateval(idx,1,pop_appts_reply_out->appt_cnt,pp.person_id ,
						pop_appts_reply_out->appointments[idx].patient.patient_id )
		pop_appts_reply_out->appointments[pos].copay  = cnvtstring(pp.deduct_amt)
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetOEDetails Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end  ;End subroutine
 
;******************************************************************/
;!!put this at end of every select
 
;with nocounter, expand = value(exp), time = value(timeOutThreshold)
;
; 	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
;
;    ;exits the script because query timed out
;	if(timeOutThreshold < 1)
;		go to EXIT_SCRIPT
;	endif
 
call echo(build2("jmod $beg_dt", cnvtdatetime($BEG_DATE) ))
;
 
end go