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
 ~BE~***********************************************************************
      Source file name:     snsro_get_pop_surgeries.prg
      Object name:          snsro_get_pop_surgeries
      Program purpose:      Retrieve surgical cases
      Tables read:			SURGICAL_CASE
      Tables updated:       NONE
      Executing from:       Emissary Service
      Special Notes:      	This population query will check for maximum records
      						and a maximum date range and if those are exceeded
      						a failure status and message will get returned.
 ***********************************************************************
                     MODIFICATION CONTROL LOG
 ***********************************************************************
  Mod Date     Engineer         Comment
  --- -------- ---------------- -----------------------------------
  001 03/10/17 DJP				Initial write
  002 05/18/17 DJP				Added Gender/DOB to Person Object
  003 07/10/17 DJP				UTC date/time code changes
  004 07/10/17 DJP 				Check for From Date > To Date
  005 07/31/17 JCO				Changed %i to execute; update ErrorHandler2
  006 03/22/18 RJC				Added version code and copyright block
  007 04/11/18 DJP	     		Added string Birthdate to person object
  008 06/11/18 DJP				Comment out MAXREC on Selects
  009 08/10/18 RJC				Code Cleanup; Changed max rec behavior. Max recs will no longer error out. It will return the max recs and
								once the limit is reached, it return all recs tied to the same second.
  010 08/14/18 RJC				Made expand clause variable depending on number of elements in record
  011 08/28/18 STV              Moved time intits to use new funtcions
  012 10/18/18 RJC				Outerjoin on person_alias table
 ***********************************************************************/
drop program snsro_get_pop_surgeries go
create program snsro_get_pop_surgeries
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "User Name:" = ""
		, "From Date:" = ""				; beginning of time
		, "To Date:" = ""				;default end of time
		, "Facility_Code_List" = ""		;OPTIONAL. List of location facility codes from code set 220.
		, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
 		, "Time Max" = 3600			;DO NOT USE. Undocumented value to override maximum date range in seconds.
with OUTDEV, USERNAME, FROM_DATE, TO_DATE, LOC_LIST, DEBUG_FLAG, TIME_MAX
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL changed to Emissary version ;006
**************************************************************************/
set sVersion = "1.16.6.1"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record pop_surgeries_reply_out
record pop_surgeries_reply_out(
	1 cases [*]
		2 surg_case_id 					= f8
		2 surg_case_nbr_formatted 		= vc
		2 surgical_service_cd		    = f8
		2 surgical_service_disp	        = vc
		2 surg_case_checked_in_dt_tm	= dq8
		2 ASA_class_cd 					= f8
		2 ASA_class_disp				= vc
		2 OR_room_cd					= f8
		2 OR_room_disp					= vc
		2 surgery_start_dt_tm			= dq8
		2 surgery_end_dt_tm				= dq8
		2 Case_attendees [*]
			3 case_attendee_id			= f8
			3 case_attendee_name		= vc
			3 Role_perf_cd				= f8
			3 Role_perf_disp			= vc
		2 Case_times [*]
			3 time_type_cd				= f8
			3 time_type_disp			= vc
			3 case_time					= dq8
		2 Surgical_Procedure[*]
			3 Procedure_cd				= f8
			3 Procedure_cd_disp			= vc
			3 Provider_id				= f8
			3 Provider_name				= vc
			3 Role_perf_cd				= f8
			3 Role_perf_disp			= vc
			3 surgical_service_cd		= f8
			3 surgical_service_disp	    = vc
			3 wound_class_cd			= f8
			3 would_class_disp			= vc
			3 incision_start_dt_tm		= dq8
			3 incision_close_dt_tm		= dq8
		2 created_updated_date_time		= dq8	;sc.created
	  2 person
		  3 person_id 					= f8	;p.person_id
		  3 name_full_formatted 		= vc	;p.name_full_formatted
		  3 name_last 					= vc	;p.last_name
		  3 name_first 					= vc	;p.first_name
		  3 name_middle 				= vc	;p.middle_name
		  3 mrn							= vc    ;pa.alias
		  3 dob							= dq8 	;002
		  3 gender_id					= f8 	;002
		  3 gender_disp					= vc  	;002
		  3 sDOB						= c10 	;007
	  2 encounter
		  3 encounter_id 				= f8	;e.encntr_id
		  3 encounter_type_cd			= f8	;e.encntr_type_cd
		  3 encounter_type_disp			= vc	;encounter type display
		  3 encounter_type_class_cd		= f8	;encounter_type_class_cd
	      3 encounter_type_class_disp	= vc	;encounter type class display
 		  3 arrive_date					= dq8	;e.arrive_dt_tm
 		  3 discharge_date				= dq8	;e.discharge_dt_tm
 		  3 fin_nbr						= vc	;ea.alias
 		  3 patient_location
 		  	4  location_cd              = f8
  			4  location_disp            = vc
  			4  loc_bed_cd               = f8
  			4  loc_bed_disp             = vc
  			4  loc_building_cd          = f8
  			4  loc_building_disp        = vc
  			4  loc_facility_cd          = f8
  			4  loc_facility_disp        = vc
  			4  loc_nurse_unit_cd        = f8
 			4  loc_nurse_unit_disp      = vc
 			4  loc_room_cd              = f8
  			4  loc_room_disp            = vc
  			4  loc_temp_cd              = f8
  			4  loc_temp_disp            = vc
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
  1 status_data									;005
    2 status 							= c1
    2 subeventstatus[1]
      3 OperationName 					= c25
      3 OperationStatus 				= c1
      3 TargetObjectName 				= c25
      3 TargetObjectValue 				= vc
      3 Code							= c4
      3 Description 					= vc
)
 
free record loc_req
record loc_req (
	1 codes[*]
		2 code_value					= f8
		2 fac_identifier				= vc
)
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common	;005
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
; Input
declare sUserName			= vc with protect, noconstant("")
declare sFromDate			= vc with protect, noconstant("")
declare sToDate				= vc with protect, noconstant("")
declare sLocFacilities		= vc with protect, noconstant("")
declare iDebugFlag			= i2 with protect, noconstant(0)
declare iTimeMax			= i4 with protect, noconstant(0)
 
; Other
declare UTCmode				= i2 with protect, noconstant(0);;003
declare UTCpos 				= i2 with protect, noconstant(0);;003
declare qFromDateTime			= dq8 with protect, noconstant(CNVTDATETIME(CURDATE, CURTIME3))
declare qToDateTime				= dq8 with protect, noconstant(CNVTDATETIME(CURDATE, CURTIME3))
declare iTimeDiff			= i4 with protect, noconstant(0)
declare iMaxRecs			= i4 with protect, constant(2000) ;009
 
; Constants
declare c_mrn_person_alias_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",4,"MRN"))
declare c_finnbr_encntr_alias_type_cd	= f8 with protect, constant(uar_get_code_by("MEANING",319,"FIN NBR"))
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ParseLocations(null)			= null with protect
declare GetSurgeries(null)				= null with protect
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
; Input
set sUserName						= trim($USERNAME, 3)
set sFromDate						= trim($FROM_DATE, 3)
set sToDate							= trim($TO_DATE, 3)
set sLocFacilities					= trim($LOC_LIST,3)
set iDebugFlag						= cnvtint($DEBUG_FLAG)
set iTimeMax						= cnvtint($TIME_MAX)
 
; Other
set UTCmode							= CURUTC ;003
set UTCpos							= findstring("Z",sFromDate,1,0) ;003
 
set qFromDateTime = GetDateTime(sFromDate)
set qToDateTime = GetDateTime(sToDate)
 
if(iDebugFlag > 0)
	call echo(build("sUserName -> ", sUserName))
	call echo(build("sFromDate -> ",sFromDate))
	call echo(build("sToDate -> ",sToDate))
	call echo(build("sLocFacilities -> ",sLocFacilities))
	call echo(build("qFromDateTime -> ", qFromDateTime))
	call echo(build("qToDateTime -> ", qToDateTime))
	call echo(build("iDebugFlag -> ", iDebugFlag))
	call echo(build("iTimeDiff -> ",iTimeDiff))
	call echo(build("iTimeMax -> ", iTimeMax))
 	call echo(build("UTC MODE -->",UTCmode))  ;;003
 	call echo(build("UTC POS -->",UTCpos))  ;;003
endif
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Validate username
set iRet = PopulateAudit(sUserName, 0.0, pop_surgeries_reply_out, sVersion)
if(iRet = 0)
		call ErrorHandler2("VALIDATE", "F","POP_SURGERIES", "Invalid User for Audit.",
		"1001",build("UserID is invalid: ", sUserName),pop_surgeries_reply_out)
		go to EXIT_SCRIPT
endif
 
; Validate from date isn't greater than to date
if (qFromDateTime > qToDateTime)
	call ErrorHandler2("VALIDATE", "F", "POP_SURGERIES", "From Date Greater than To Date. Refine Dates Entered.",
	"2010", "From Date Greater than To Date. Refine Dates Entered.", pop_documents_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate timespan doesn't exceed threshold
set iRet = ThreshHoldValidator(iTimeMax,"s",qFromDateTime,qToDateTime)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "POP_SURGERIES", "Date Range Too Long. Refine Query.",
	"2011","Date Range Too Long. Refine Query.",pop_surgeries_reply_out)
	go to EXIT_SCRIPT
endif
 
; Parse locations if provided
if (sLocFacilities > " ")
	call ParseLocations(null)
endif
 
; Get Surgery Data
call GetSurgeries(null)
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(pop_surgeries_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag = 1)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_pop_surgeries.json")
	call echo(build2("_file : ", _file))
	call echojson(pop_surgeries_reply_out, _file, 0)
	call echorecord(pop_surgeries_reply_out)
	call echo(JSONout)
endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: ParseLocations(null)
;  Description: Subroutine to parse a comma delimited string
**************************************************************************/
subroutine ParseLocations(null)
 	if(iDebugFlag > 0)
		set parseloc_section_start_dttm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ParseLocations Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare notfnd 		= vc with constant("<not_found>")
	declare num 		= i4 with noconstant(1)
	declare str 			= vc with noconstant("")
 
	while (str != notfnd)
		set str =  piece(sLocFacilities,',',num,notfnd)
		if(str != notfnd)
			set stat = alterlist(loc_req->codes, num)
			set loc_req->codes[num]->code_value = cnvtint(str)
 
			 select into code_value
			 from code_value
			 where code_set = 220 and cdf_meaning = "FACILITY"
				and loc_req->codes[num]->code_value = code_value
 
			if (curqual = 0)
				call ErrorHandler2("EXECUTE", "F", "POP_SURGERIES", build("Invalid Facility Code: ", loc_req->codes[num]->code_value),
				"2040", build("Invalid Facility Code: ",loc_req->codes[num]->code_value),pop_surgeries_reply_out)
				go to Exit_Script
			endif
		endif
		set num = num + 1
	endwhile
 
end ;End Sub
 
/*************************************************************************
;  Name: GetSurgeries(null)
;  Description: Subroutine to get Surgical Cases
**************************************************************************/
subroutine GetSurgeries(null)
	if(iDebugFlag > 0)
		set surgery_section_start_dttm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetSurgeries Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	; Temp record
	free record temp
	record temp (
		1 qual_cnt = i4
		1 qual[*]
			2 surg_case_id = f8
	)
 
	; Populate temp record
	set loc_size = size(loc_req->codes,5)
	set ndx = 1
 
	;Set expand control value - 010
	if(loc_size > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	select
		if(loc_size > 0)
			from surgical_case sc
				, encounter e
			plan sc where sc.updt_dt_tm > cnvtdatetime(qFromDateTime)
				and sc.updt_dt_tm < cnvtdatetime(qToDateTime)
				and sc.active_ind = 1
			join e where e.encntr_id = sc.encntr_id
				and expand(ndx,1,loc_size,e.loc_facility_cd,loc_req->codes[ndx].code_value)
			order by sc.updt_dt_tm
		else
			from surgical_case sc
			plan sc where sc.updt_dt_tm > cnvtdatetime(qFromDateTime)
				and sc.updt_dt_tm < cnvtdatetime(qToDateTime)
				and sc.active_ind = 1
			order by sc.updt_dt_tm
		endif
 	into "nl:"
 	head report
 		x = 0
 		max_reached = 0
 		stat = alterlist(temp->qual,iMaxRecs)
 	head sc.updt_dt_tm
 		if(x > iMaxRecs)
 			max_reached = 1
 		endif
 	detail
 		if(max_reached = 0)
 			x = x + 1
 			if(mod(x,100) = 1 and x > iMaxRecs)
				stat = alterlist(temp->qual,x+99)
			endif
 
			temp->qual[x].surg_case_id = sc.surg_case_id
 		endif
 	foot report
 		stat = alterlist(temp->qual,x)
 		temp->qual_cnt = x
 	with nocounter, expand = value(exp)
 
	if(iDebugFlag)
 		call echo(build("------Qual Cnt = ",temp->qual_cnt))
 	endif
 
 	; Populate audit
	if(temp->qual_cnt > 0)
		call ErrorHandler("EXECUTE", "S", "POP_SURGERIES", "Success retrieving surgerical cases",  pop_surgeries_reply_out)	;005
	else
		call ErrorHandler("EXECUTE", "Z", "POP_SURGERIES", "No records qualify.", pop_surgeries_reply_out)
		go to exit_script
	endif
 
 
 
 	;Set expand control value - 010
	if(temp->qual_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	; Populate Final record
 	set tnum = 1
 	set caseCnt = 0
 
	select into "nl:"
	from surgical_case   sc
		,surg_case_procedure   scp
		,case_attendance   ca
		,person   p
		,person_alias   pa
		,encounter   e
		,encntr_alias   ea
		,prsnl_group   pg
		,prsnl   pr
	plan sc where expand(tnum,1,temp->qual_cnt,sc.surg_case_id,temp->qual[tnum].surg_case_id)
	join scp where scp.surg_case_id = outerjoin(sc.surg_case_id)
		and scp.active_ind = outerjoin(1)
	join ca where ca.surg_case_id = outerjoin(sc.surg_case_id)
		and ca.case_attendee_id = outerjoin(sc.surgeon_prsnl_id)
		and ca.active_ind = outerjoin(1)
	join p where p.person_id = sc.person_id
		and p.active_ind = 1
	join pa where pa.person_id = outerjoin(p.person_id)
		and pa.person_alias_type_cd = outerjoin(c_mrn_person_alias_type_cd)
		and pa.active_ind = outerjoin(1)
		and pa.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		and pa.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
	join e where e.encntr_id = outerjoin(sc.encntr_id)
	join ea	where ea.encntr_id = outerjoin(e.encntr_id)
		and ea.encntr_alias_type_cd = outerjoin(c_finnbr_encntr_alias_type_cd)
		and ea.active_ind = outerjoin(1)
		and ea.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		and ea.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
	join pg	where pg.prsnl_group_id = outerjoin(sc.surg_specialty_id)
	join pr where pr.person_id = outerjoin(sc.surgeon_prsnl_id)
		and pr.active_ind = outerjoin(1)
	order by
		sc.surg_case_id
	head report
		caseCnt = 0
	head sc.surg_case_id
		procCnt = 0
		caseCnt = caseCnt + 1
		stat = alterlist(pop_surgeries_reply_out->cases,caseCnt)
 
		; Surgical Case Data
		pop_surgeries_reply_out->cases[caseCnt].surg_case_id = sc.surg_case_id
		pop_surgeries_reply_out->cases[caseCnt].surg_case_nbr_formatted = sc.surg_case_nbr_formatted
		pop_surgeries_reply_out->cases[caseCnt].surgical_service_cd = sc.surg_specialty_id
		pop_surgeries_reply_out->cases[caseCnt].surgical_service_disp = pg.prsnl_group_name
		pop_surgeries_reply_out->cases[caseCnt].surg_case_checked_in_dt_tm = sc.checkin_dt_tm
		pop_surgeries_reply_out->cases[caseCnt].ASA_class_cd = sc.asa_class_cd
		pop_surgeries_reply_out->cases[caseCnt].ASA_class_disp = uar_get_code_display(sc.asa_class_cd)
		pop_surgeries_reply_out->cases[caseCnt].OR_room_cd = sc.surg_op_loc_cd
		pop_surgeries_reply_out->cases[caseCnt].OR_room_disp = uar_get_code_display(sc.surg_op_loc_cd)
		pop_surgeries_reply_out->cases[caseCnt].surgery_start_dt_tm = sc.surg_start_dt_tm
		pop_surgeries_reply_out->cases[caseCnt].surgery_end_dt_tm = sc.surg_stop_dt_tm
		pop_surgeries_reply_out->cases[caseCnt].created_updated_date_time = sc.updt_dt_tm
 
		; Person Data
		pop_surgeries_reply_out->cases[caseCnt]->person->person_id = p.person_id
		pop_surgeries_reply_out->cases[caseCnt]->person->name_full_formatted = p.name_full_formatted
		pop_surgeries_reply_out->cases[caseCnt]->person->name_first = p.name_first
		pop_surgeries_reply_out->cases[caseCnt]->person->name_last = p.name_last
		pop_surgeries_reply_out->cases[caseCnt]->person->name_middle = p.name_middle
		pop_surgeries_reply_out->cases[caseCnt]->person->mrn = pa.alias
		pop_surgeries_reply_out->cases[caseCnt]->person->dob = p.birth_dt_tm ;002
		pop_surgeries_reply_out->cases[caseCnt]->person->gender_id = p.sex_cd ;002
		pop_surgeries_reply_out->cases[caseCnt]->person->gender_disp = uar_get_code_display(p.sex_cd);002
		pop_surgeries_reply_out->cases[caseCnt]->person->sDOB =
		datetimezoneformat(p.birth_dt_tm,p.birth_tz,"YYYY-MM-DD",curtimezonedef);007
 
		; Encounter Data
		pop_surgeries_reply_out->cases[caseCnt]->encounter->encounter_id = e.encntr_id
		pop_surgeries_reply_out->cases[caseCnt]->encounter->encounter_type_cd = e.encntr_type_cd
		pop_surgeries_reply_out->cases[caseCnt]->encounter->encounter_type_disp = uar_get_code_display(e.encntr_type_cd)
		pop_surgeries_reply_out->cases[caseCnt]->encounter->encounter_type_class_cd = e.encntr_type_class_cd
		pop_surgeries_reply_out->cases[caseCnt]->encounter->encounter_type_class_disp = uar_get_code_display(e.encntr_type_class_cd)
		pop_surgeries_reply_out->cases[caseCnt]->encounter->arrive_date = e.arrive_dt_tm
		if (e.arrive_dt_tm is null)
			pop_surgeries_reply_out->cases[caseCnt]->encounter->arrive_date = e.reg_dt_tm
		endif
		pop_surgeries_reply_out->cases[caseCnt]->encounter->discharge_date = e.disch_dt_tm
		pop_surgeries_reply_out->cases[caseCnt]->encounter->fin_nbr = ea.alias
 
		; Encounter Location Data
		pop_surgeries_reply_out->cases[caseCnt]->encounter->patient_location->location_cd = e.location_cd
		pop_surgeries_reply_out->cases[caseCnt]->encounter->patient_location->location_disp = uar_get_code_display(e.location_cd)
		pop_surgeries_reply_out->cases[caseCnt]->encounter->patient_location->loc_bed_cd = e.loc_bed_cd
		pop_surgeries_reply_out->cases[caseCnt]->encounter->patient_location->loc_bed_disp = uar_get_code_display(e.loc_bed_cd)
		pop_surgeries_reply_out->cases[caseCnt]->encounter->patient_location->loc_building_cd = e.loc_building_cd
		pop_surgeries_reply_out->cases[caseCnt]->encounter->patient_location->loc_building_disp = uar_get_code_display(e.loc_building_cd)
		pop_surgeries_reply_out->cases[caseCnt]->encounter->patient_location->loc_facility_cd = e.loc_facility_cd
		pop_surgeries_reply_out->cases[caseCnt]->encounter->patient_location->loc_facility_disp = uar_get_code_display(e.loc_facility_cd)
		pop_surgeries_reply_out->cases[caseCnt]->encounter->patient_location->loc_nurse_unit_cd = e.loc_nurse_unit_cd
		pop_surgeries_reply_out->cases[caseCnt]->encounter->patient_location->loc_nurse_unit_disp =
			uar_get_code_display(e.loc_nurse_unit_cd)
		pop_surgeries_reply_out->cases[caseCnt]->encounter->patient_location->loc_room_cd = e.loc_room_cd
		pop_surgeries_reply_out->cases[caseCnt]->encounter->patient_location->loc_room_disp = uar_get_code_display(e.loc_room_cd)
		pop_surgeries_reply_out->cases[caseCnt]->encounter->patient_location->loc_temp_cd = e.loc_temp_cd
		pop_surgeries_reply_out->cases[caseCnt]->encounter->patient_location->loc_temp_disp = uar_get_code_display(e.loc_temp_cd)
	detail
		;Procedures
		procCnt = procCnt + 1
		stat = alterlist(pop_surgeries_reply_out->cases[caseCnt].Surgical_Procedure,procCnt)
 
		pop_surgeries_reply_out->cases[caseCnt].Surgical_Procedure[procCnt].Procedure_cd = scp.surg_proc_cd
		pop_surgeries_reply_out->cases[caseCnt].Surgical_Procedure[procCnt].Procedure_cd_disp = uar_get_code_display(scp.surg_proc_cd)
		pop_surgeries_reply_out->cases[caseCnt].Surgical_Procedure[procCnt].Provider_id = sc.surgeon_prsnl_id
		pop_surgeries_reply_out->cases[caseCnt].Surgical_Procedure[procCnt].Provider_name = pr.name_full_formatted
		pop_surgeries_reply_out->cases[caseCnt].Surgical_Procedure[procCnt].Role_perf_cd = ca.role_perf_cd
		pop_surgeries_reply_out->cases[caseCnt].Surgical_Procedure[procCnt].Role_perf_disp = uar_get_code_display(ca.role_perf_cd)
		pop_surgeries_reply_out->cases[caseCnt].Surgical_Procedure[procCnt].surgical_service_cd = scp.surg_specialty_id
		pop_surgeries_reply_out->cases[caseCnt].Surgical_Procedure[procCnt].surgical_service_disp = pg.prsnl_group_name
		pop_surgeries_reply_out->cases[caseCnt].Surgical_Procedure[procCnt].wound_class_cd = sc.wound_class_cd
		pop_surgeries_reply_out->cases[caseCnt].Surgical_Procedure[procCnt].would_class_disp = uar_get_code_display(sc.wound_class_cd)
		pop_surgeries_reply_out->cases[caseCnt].Surgical_Procedure[procCnt].incision_start_dt_tm = scp.proc_start_dt_tm
		pop_surgeries_reply_out->cases[caseCnt].Surgical_Procedure[procCnt].incision_close_dt_tm = scp.proc_end_dt_tm
	with  nocounter, separator=" ", format, expand = value(exp) ;maxrec = 2000,;008
 
	if (caseCnt > 0)
		; Get Case Attendees
		select into "nl:"
		from (dummyt d with seq = caseCnt)
			,case_attendance ca
			,prsnl pr
		plan d
		join ca where ca.surg_case_id = pop_surgeries_reply_out->cases[d.seq].surg_case_id
		join pr where pr.person_id = outerjoin(ca.case_attendee_id)
			and pr.active_ind = 1
		order by ca.surg_case_id
		head ca.surg_case_id
				attCnt = 0
		detail
 
			attCnt = attCnt + 1
			stat = alterlist(pop_surgeries_reply_out->cases[d.seq].case_attendees, attCnt)
 
			pop_surgeries_reply_out->cases[d.seq].Case_attendees[attCnt].case_attendee_id = ca.case_attendee_id
			pop_surgeries_reply_out->cases[d.seq].Case_attendees[attCnt].case_attendee_name = pr.name_full_formatted
			pop_surgeries_reply_out->cases[d.seq].Case_attendees[attCnt].Role_perf_cd = ca.role_perf_cd
			pop_surgeries_reply_out->cases[d.seq].Case_attendees[attCnt].Role_perf_disp = uar_get_code_display(ca.role_perf_cd)
		with nocounter, separator=" ", format;, maxrec = 2000 ;008
 
	 	; Get Case Times
		select into "nl:"
		from (dummyt d1 with seq = value(caseCnt))
			,case_times ct
		plan d1
		join ct where ct.surg_case_id = pop_surgeries_reply_out->cases[d1.seq].surg_case_id
		order by ct.surg_case_id, ct.case_time_dt_tm
		head ct.surg_case_id
			timeCnt = 0
		detail
			timeCnt = timeCnt + 1
			stat = alterlist(pop_surgeries_reply_out->cases[d1.seq].Case_times, timeCnt)
 
			pop_surgeries_reply_out->cases[d1.seq].Case_times[timeCnt].time_type_cd = ct.task_assay_cd
			pop_surgeries_reply_out->cases[d1.seq].Case_times[timeCnt].time_type_disp = uar_get_code_display(ct.task_assay_cd)
			pop_surgeries_reply_out->cases[d1.seq].Case_times[timeCnt].case_time = ct.case_time_dt_tm
		with nocounter, separator=" ", format;, maxrec = 2000;008
	endif
 
    if(iDebugFlag > 0)
		call echo(concat("GetMedicationOrders Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), surgery_section_start_dttm, 5)), 3),
	    " seconds"))
	endif
end ;End Sub
 
end
go
 
