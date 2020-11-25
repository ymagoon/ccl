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
      Source file name:     snsro_get_pop_encounters.prg
      Object name:          vigilanz_get_pop_encounters
      Program purpose:      Retrieves encounters from PM_TRANSACTION based on
      						date range parameters.
      Tables read:			PM_TRANSACTION, PERSON, ENCOUNTER
      Tables updated:       NONE
      Executing from:       Emissary Service
      Special Notes:      	This population query will check for maximum records
      						and a maximum date range and if those are exceeded
      						a failure status and message will get returned.
************************************************************************************
                     MODIFICATION CONTROL LOG
************************************************************************************
 Mod Date     Engineer             Comment
------------------------------------------------------------------------------------
   000 12/28/16 DJP                Initial write
   001 01/06/17	DJP					Renamed Location to Patient_Location, Removed Facility Object
   002 01/12/17 DJP					Changed End Time from Required to Optional, Default "" to Now minus 1 minute
   003 03/03/17	DJP					Added ErrorHandler2 fields
   004 04/21/17	DJP					Added Attending Provider ID
   005 05/12/17 DJP					Added Admission Source/Discharge Disposition, DOB/Gender
   006 07/10/17	DJP					UTC date/time code changes
   007 07/10/17	DJP					Check for From Date > To Date
   008 07/27/17 JCO					Changed %i to execute; update ErrorHandler2
   009 03/21/18 RJC					Added version code and copyright block
   010 04/11/18 DJP					Added string Birthdate to person object
   011 06/11/18	DJP					Comment out MAXREC on Selects
   012 07/30/18 RJC					Code Cleanup.
   013 08/09/18 RJC					Changed max rec behavior. Max recs will no longer error out. It will return the max recs and
									once the limit is reached, it return all recs tied to the same second.
   014 08/14/18 RJC					Made expand clause variable depending on number of elements in record
   015 08/29/18 STV                 Rework for nonutc environments and use of new functions
   016 10/04/18 STV                 Added prior_enc,prior_fin, mode_of_arrival, pt_acuity(to structure)
   017 10/18/18 RJC					Outerjoin on person_alias table
   018 12/10/18 RJC					Check ED encounters for room/bed if not there on tracking tables
   019 01/07/19 STV                 Switch MRN to Enounter based mrn
   020 01/11/19 STV                 Added disch to location
   021 04/24/19 STV                 Adding Timeout of 115 seconds
   022 02/01/20 KRD                 Added arrive_date_time, reg_date_time, pre_reg_date_time
   023 03/09/20 KRD                 Added patient_care_team object
   023 03/11/20 KRD     			Added inc_comments boolean to prompt
 									Added Comments object to the structure
   024 03/18/20 STV                 Added Isolation Coded value
   025 03/23/20 KRD                 Added patient_valuables
   026 04/23/20 KRD                 Added custom fields object
******************************************************************************/
drop program vigilanz_get_pop_encounters go
create program vigilanz_get_pop_encounters
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Username:" = ""
	, "Beg Date:" = ""
	, "End Date:" = ""
	, "Facility_Code_List" = ""
	, "Include care team:" = 0
	, "Include comements:" = 0
	, "Include Custom Fields:" = 0
	, "Debug Flag" = 0
	, "Time Max" = 3600
 
with OUTDEV, USERNAME, BEG_DATE, END_DATE, LOC_LIST, INC_CARETEAM, INC_COMMENTS,
	INC_CUSTOM_FIELDS, DEBUG_FLAG, Time_Max
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL changed to Emissary version ;009
**************************************************************************/
set sVersion = "1.21.6.2"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record pop_encounters_reply_out
record pop_encounters_reply_out (
	1 encounter_count					= i4
 	1 encounter[*]
		  2 encounter_id 				= f8	;e.encntr_id
		  2 encounter_type_cd			= f8	;e.encntr_type_cd
		  2 encounter_type_disp			= vc	;encounter type display
		  2 encounter_type_class_cd		= f8	;encounter_type_class_cd
	      2 encounter_type_class_disp	= vc	;encounter type class display
	      2 encounter_status_cd			= f8
	      2 encounter_status			= vc
	      2 attending_provider			= vc
	      2 attending_provider_id		= f8  ;004
	      2 reason_for_visit     	    = vc
	      2 admission_source_cd			= f8   ;005
	      2 admission_source_disp		= vc  ;005
	      2 med_service_cd              = f8
  		  2 med_service_disp            = vc
  		  2 arrive_date					= dq8	;e.admit_dt_tm
 		  2 discharge_date				= dq8	;e.discharge_dt_tm
 		  2 discharge_disposition_cd	= f8  ;;005
 		  2 discharge_disposition_disp	= vc  ;;005
 		  2 discharge_to_loc_cd         = f8
 		  2 discharge_to_loc_disp       = vc
  		  2 patient_valuables [*]
 		  	3 id = f8
 		  	3 name = vc
 		  2 isolation
 		  	3 id = f8
 		  	3 name = vc
 		  2 fin_nbr						= vc	;ea.alias
 		  2 created_updated_date_time	= dq8
 		  2 prior_encntr_id             = f8
 		  2 prior_fin_nbr               = vc
 		  2 patient_acuity              = vc
 		  2 mode_of_arrival             = vc
		  2 arrive_date_time           = dq8	;022
		  2 reg_date_time              = dq8	;022
		  2 pre_reg_date_time          = dq8	;022
		  2 CustomFields[*]
			3 Field
				4 id = f8
				4 name = vc
			3 ResponseValueText [*] = vc
			3 ResponseValueCodes[*]
				4 id = f8
				4 name = vc
    	  2 Comments [*]
			 3 CMT_TEXT 				= vc
	         3 UPDT_ID  				= f8
	         3 UPDT_DT_TM 				= dq8
	         3 Internal_Seq 			= i4
		  2 patient_care_team[*]
   	        3 internal_seq             	= i4
			3 provider_id			  	= f8
			3 provider_name		  		= vc
			3 reltn_type			  	= vc
			3 from_date              	= dq8
			3 to_date                	= dq8
			3 npi					  	= vc
			3 phones[*]
				4 phone_id 				= f8
				4 phone_type_cd 		= f8
				4 phone_type_disp 		= vc
				4 phone_type_mean 		= vc
				4 phone_num 			= vc
				4 sequence_nbr 			= i4
			3 is_manually_added			= i2
 		  2 patient_location						;001
 		  	3  location_cd              = f8
  			3  location_disp            = vc
  			3  loc_bed_cd               = f8
  			3  loc_bed_disp             = vc
  			3  loc_building_cd			= f8
  			3  loc_building_disp        = vc
  			3  loc_facility_cd          = f8
  			3  loc_facility_disp        = vc
  			3  loc_nurse_unit_cd        = f8
 			3  loc_nurse_unit_disp      = vc
 			3  loc_room_cd              = f8
  			3  loc_room_disp            = vc
  			3  loc_temp_cd              = f8
  			3  loc_temp_disp            = vc
 		 2 person
		  	3 person_id 				= f8	;p.person_id
		  	3 name_full_formatted 		= vc	;p.name_full_formatted
		  	3 name_last 				= vc	;p.last_name
		  	3 name_first 				= vc	;p.first_name
		  	3 name_middle 				= vc	;p.middle_name
		  	3 mrn						= vc    ;pa.alias
		  	3 dob						= dq8 ;005
		  	3 gender_id					= f8  ;005
		  	3 gender_disp				= vc  ;005
		  	3 sDOB						= c10 ;010
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
  1 status_data												;008
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
	1 codes[*]
		2 code_value					= f8
		2 fac_identifier				= vc
)
 
;initialize status to FAIL
set pop_encounters_reply_out->status_data->status = "F"
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common	;008
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
set MODIFY MAXVARLEN 200000000	;013
 
; Input
declare sUserName					= vc with protect, noconstant("")
declare sFromDate					= vc with protect, noconstant("")
declare sToDate						= vc with protect, noconstant("")
declare sLocFacilities				= vc with protect, noconstant("")
declare iDebugFlag					= i2 with protect, noconstant(0)
declare iTimeMax					= i4 with protect, noconstant(0)
declare iIncCareteam				= i4 with protect, noconstant(0) ;This field is ignored. It is used within Emissary
declare iIncComments	 			= i2 with protect, noconstant(0)
declare iIncCustomFields	 		= i2 with protect, noconstant(0)
declare num = i4 with protect, noconstant(0)
declare pop = i4 with protect, noconstant(0)
 
;Other
declare iTimeDiff					= i4 with protect, noconstant(0)
declare qFromDateTime				= dq8 with protect, noconstant(CNVTDATETIME(CURDATE, CURTIME3))
declare qToDateTime					= dq8 with protect, noconstant(CNVTDATETIME(CURDATE, CURTIME3))
declare sLocWhereClause				= vc with protect, noconstant("")
declare ndx                     	= i4
declare iMaxRecs					= i4 with protect, constant(2000)
declare timeOutThreshold = i4 with protect, noconstant(115);setting to 115 seconds
declare queryStartTm = dq8
 
;Constants
declare c_mrn_encounter_alias_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",319,"MRN"))
declare c_finnbr_encntr_alias_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",319,"FIN NBR"))
declare c_attenddoc_encntr_prsnl_r_cd		= f8 with protect, constant(uar_get_code_by("MEANING",333,"ATTENDDOC"))
declare c_emergency_encntr_type_class_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",69,"EMERGENCY"))
declare c_comments_info_type_cd             = f8 with protect, constant(uar_get_code_by("MEANING",355,"COMMENT"))
declare c_userdefined_info_type_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",355,"USERDEFINED"))
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetEncounters(null)							= null with protect
declare GetEDLocationInfo(null)						= null with protect
declare GetCareTeamInfo(null)                       = null with protect
declare GetComments(null)                           = null with protect
declare GetPatientValuables(null)                   = null with protect
declare GetCustomFields(null)                   	= null with protect
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
;Input
set sUserName 						= trim($USERNAME, 3)
set sFromDate						= trim($BEG_DATE, 3)
set sToDate							= trim($END_DATE, 3)
set iIncCareteam 					= cnvtint($INC_CARETEAM)
set iIncComments					= cnvtint($INC_COMMENTS)
set iIncCustomFields				= cnvtint($INC_CUSTOM_FIELDS)
set iDebugFlag						= cnvtint($DEBUG_FLAG)
set sLocFacilities					= trim($LOC_LIST,3)
set iTimeMax						= cnvtint($TIME_MAX)
 
;Other
set qFromDateTime = GetDateTime(sFromDate)
set qToDateTime = GetDateTime(sToDate)
 
if(iDebugFlag > 0)
	call echo(build("sUserName ->", sUserName))
	call echo(build("sFromDate -> ",sFromDate))
	call echo(build("sToDate -> ",sToDate))
	call echo(build("qFromDateTime -> ", qFromDateTime))
	call echo(build("qToDateTime -> ", qToDateTime))
	call echo(build("iDebugFlag -> ", iDebugFlag))
	call echo(build("iTimeMax -> ", iTimeMax))
	call echo(build("sLocFacilities -> ",sLocFacilities))
	call echo(build("c_mrn_encounter_alias_type_cd   ->",c_mrn_encounter_alias_type_cd))
	call echo(build("c_finnbr_encntr_alias_type_cd   ->",c_finnbr_encntr_alias_type_cd))
	call echo(build("c_attenddoc_encntr_prsnl_r_cd  ->",c_attenddoc_encntr_prsnl_r_cd))
	call echo(build("sToDate -> ",sToDate))
	call echo(build("qToDateTime -> ", qToDateTime))
	call echo(build ("DISPLAY END DT TIME",format(qToDateTime, "@LONGDATETIME")))
	call echo(build("iIncCareteam ->", iIncCareteam))
endif
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Validate username
set iRet = PopulateAudit(sUserName, 0.0, pop_encounters_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2("EXECUTE", "F", "POP_ENCOUNTERS", "Invalid User for Audit.",
	"1001",build("User is invalid. ","Invalid User for Audit."), pop_encounters_reply_out)
	 go to EXIT_SCRIPT
endif
 
 ;Validate From Date is not greater than To Date
 if (qFromDateTime > qToDateTime)
	call ErrorHandler2("VALIDATE", "F", "POP_ENCOUNTERS", "From Date Greater than To Date. Refine Dates Entered.",
	"2010", "From Date Greater than To Date. Refine Dates Entered.", pop_encounters_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate time difference doesn't exceed threshold
set iRet = ThreshHoldValidator(iTimeMax,"s",qFromDateTime,qToDateTime)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "POP_ENCOUNTERS", "Date Range Too Long. Refine Query.",
	"2011","Date Range Too Long. Refine Query.",pop_encounters_reply_out)
	go to EXIT_SCRIPT
endif
 
 ; Parse locations if provided
 if (sLocFacilities > " ")
	call ParseLocations(sLocFacilities)
 endif
 
 ; Get Encounter Data
 call GetEncounters(null)
 
; Check ED encounters if missing room/bed
  call GetEDLocationInfo(null)
 
;Get patient_care_team information
 if (iIncCareteam > 0)
   call GetCareTeamInfo(null)
 endif
 
;Get comments information
 if (iIncComments > 0)
   call GetComments(null)
 endif
 
;Get patient valuables
call GetPatientValuables(null)
 
;Get custom fields information
 if (iIncCustomFields > 0)
   call GetCustomFields(null)
 endif
 
 /*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(pop_encounters_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if (iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_pop_encounters.json")
	call echo(build2("_file : ", _file))
	call echojson(pop_encounters_reply_out, _file, 0)
	call echorecord(pop_encounters_reply_out)
	call echo(JSONout)
endif
 
#EXIT_VERSION
 
/*************************************************************************
;  Name: ParseLocations(sLocFacilties = vc)
;  Description: Subroutine to parse a comma delimited string
**************************************************************************/
subroutine ParseLocations(sLocFacilities)
 
	declare notfnd 		= vc with constant("<not_found>")
	set num 		    =  0
	declare str 		= vc with noconstant("")
 
	while (str != notfnd)
		set str =  piece(sLocFacilities,',',num,notfnd)
		if(str != notfnd)
			set stat = alterlist(loc_req->codes, num)
			set loc_req->codes[num]->code_value = cnvtint(str)
 
			 select into code_value
			 from code_value
			 where code_set = 220  and
			 loc_req->codes[num]->code_value = code_value
			 and cdf_meaning = "FACILITY"              ;003
 
			if (curqual = 0)
				call ErrorHandler2("VALIDATE", "F", "POP_ENCOUNTERS", build("Invalid Facility Code: ", loc_req->codes[num]->code_value),
				"2040", build("Invalid Facility Code: ",loc_req->codes[num]->code_value),pop_encounters_reply_out)
				go to Exit_Script
			endif
		endif
		set num = num + 1
	endwhile
 
end ; End Sub
 
/*************************************************************************
;  Name: GetEncounters(null)
;  Description: Subroutine to get Encounters
**************************************************************************/
subroutine GetEncounters(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetEncounters Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	; Set Where clause
 	set iLocFacCnt = size(loc_req->codes,5)
	if (iLocFacCnt > 0)
		set sLocWhereClause = " expand(ndx,1,iLocFacCnt,e.loc_facility_cd,loc_req->codes[ndx].code_value)"
	else
		set sLocWhereClause = " e.loc_facility_cd > 0"
	endif
 
	;Set expand control value - 014
	if(iLocFacCnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from pm_transaction	pm
		,encounter 		e
		,encntr_alias	ea
		,encntr_alias   ea3
		,person			p
		,encntr_prsnl_reltn epr
		,prsnl pr
		,encntr_alias ea2
	plan pm where pm.activity_dt_tm >= cnvtdatetime(qFromDateTime)
		and pm.activity_dt_tm <= cnvtdatetime(qToDateTime)
		and pm.n_person_id != 0
		and pm.n_encntr_id != 0
	join e where e.encntr_id = pm.n_encntr_id
		and parser(sLocWhereClause)
	join ea where ea.encntr_id = outerjoin(e.encntr_id)
		and ea.encntr_alias_type_cd = outerjoin(c_finnbr_encntr_alias_type_cd)
		and ea.active_ind = outerjoin(1)
		and ea.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		and ea.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
	join ea3 where ea3.encntr_id = outerjoin(e.encntr_id)
		and ea3.encntr_alias_type_cd = outerjoin(c_mrn_encounter_alias_type_cd)
		and ea3.active_ind = outerjoin(1)
		and ea3.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		and ea3.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
	join p where p.person_id = pm.n_person_id
	join epr where epr.encntr_id = outerjoin(e.encntr_id)
		and epr.encntr_prsnl_r_cd = outerjoin(c_attenddoc_encntr_prsnl_r_cd)
	join pr where pr.person_id = outerjoin(epr.prsnl_person_id)
	join ea2
		where ea2.encntr_id = outerjoin(pm.o_encntr_id)
			and ea2.encntr_alias_type_cd = outerjoin(c_finnbr_encntr_alias_type_cd)
	order by pm.activity_dt_tm, pm.n_person_id,pm.n_encntr_id
	head report
		encntrCnt = 0
		max_reached = 0
		stat = alterlist(pop_encounters_reply_out->encounter,iMaxRecs)
	head pm.activity_dt_tm
		if(encntrCnt > iMaxRecs)
			max_reached = 1
		endif
	head pm.n_encntr_id
		if(max_reached = 0)
			encntrCnt = encntrCnt + 1
			if(mod(encntrCnt,100) = 1 and encntrCnt > iMaxRecs)
				stat = alterlist(pop_encounters_reply_out->encounter,encntrCnt + 99)
			endif
		endif
	detail
		if(max_reached = 0)
			;Encounter
			pop_encounters_reply_out->encounter[encntrCnt]->encounter_id = pm.n_encntr_id
			pop_encounters_reply_out->encounter[encntrCnt]->encounter_type_cd = pm.n_encntr_type_cd
			pop_encounters_reply_out->encounter[encntrCnt]->encounter_type_disp = uar_get_code_display(pm.n_encntr_type_cd)
			pop_encounters_reply_out->encounter[encntrCnt]->encounter_type_class_cd = pm.n_encntr_type_class_cd
			pop_encounters_reply_out->encounter[encntrCnt]->encounter_type_class_disp = uar_get_code_display(pm.n_encntr_type_class_cd)
			pop_encounters_reply_out->encounter[encntrCnt]->encounter_status_cd = pm.n_encntr_status_cd
			pop_encounters_reply_out->encounter[encntrCnt]->encounter_status = uar_get_code_display(pm.n_encntr_status_cd)
			pop_encounters_reply_out->encounter[encntrCnt]->attending_provider = pr.name_full_formatted
			pop_encounters_reply_out->encounter[encntrCnt]->attending_provider_id = pr.person_id ;;004
			pop_encounters_reply_out->encounter[encntrCnt]->admission_source_cd = pm.n_admit_src_cd ;;005
			pop_encounters_reply_out->encounter[encntrCnt]->admission_source_disp = uar_get_code_display(pm.n_admit_src_cd) ;;005
			pop_encounters_reply_out->encounter[encntrCnt]->reason_for_visit = pm.n_reason_for_visit
		    pop_encounters_reply_out->encounter[encntrCnt]->med_service_cd = pm.n_med_service_cd
	  		pop_encounters_reply_out->encounter[encntrCnt]->med_service_disp = uar_get_code_display(pm.n_med_service_cd)
	  		if (e.arrive_dt_tm > 0)
	  			pop_encounters_reply_out->encounter[encntrCnt]->arrive_date = e.arrive_dt_tm
	  		elseif(e.reg_dt_tm > 0)
				pop_encounters_reply_out->encounter[encntrCnt]->arrive_date = e.reg_dt_tm
			else
				pop_encounters_reply_out->encounter[encntrCnt]->arrive_date = e.pre_reg_dt_tm
			endif
 
			pop_encounters_reply_out->encounter[encntrCnt]->arrive_date_time = e.arrive_dt_tm 	;022
			pop_encounters_reply_out->encounter[encntrCnt]->reg_date_time = e.reg_dt_tm			;022
			pop_encounters_reply_out->encounter[encntrCnt]->pre_reg_date_time = e.pre_reg_dt_tm	;022
			pop_encounters_reply_out->encounter[encntrCnt]->isolation.id = e.isolation_cd
			pop_encounters_reply_out->encounter[encntrCnt]->isolation.name = trim(uar_get_code_display(e.isolation_cd),3)
 
			pop_encounters_reply_out->encounter[encntrCnt]->discharge_date	= e.disch_dt_tm
			pop_encounters_reply_out->encounter[encntrCnt]->discharge_disposition_cd = pm.n_disch_disp_cd  ;;005
			pop_encounters_reply_out->encounter[encntrCnt]->discharge_disposition_disp = uar_get_code_display(pm.n_disch_disp_cd);005
			pop_encounters_reply_out->encounter[encntrCnt]->discharge_to_loc_cd = pm.n_disch_to_loctn_cd
	  		pop_encounters_reply_out->encounter[encntrCnt]->discharge_to_loc_disp =
	  																trim(uar_get_code_display(pm.n_disch_to_loctn_cd))
	 		pop_encounters_reply_out->encounter[encntrCnt]->fin_nbr = ea.alias
	 		pop_encounters_reply_out->encounter[encntrCnt]->created_updated_date_time = pm.activity_dt_tm
	 		pop_encounters_reply_out->encounter[encntrCnt]->prior_encntr_id = pm.o_encntr_id
	  		pop_encounters_reply_out->encounter[encntrCnt]->mode_of_arrival = trim(uar_get_code_display(e.admit_mode_cd))
	  		pop_encounters_reply_out->encounter[encntrCnt]->prior_fin_nbr = trim(ea2.alias)
 
	 		;Patient_Location Structure
	 		pop_encounters_reply_out->encounter[encntrCnt]->patient_location->location_cd = e.location_cd
	 		pop_encounters_reply_out->encounter[encntrCnt]->patient_location->location_disp = uar_get_code_display(e.location_cd)
	  		pop_encounters_reply_out->encounter[encntrCnt]->patient_location->loc_bed_cd = e.loc_bed_cd
	 		pop_encounters_reply_out->encounter[encntrCnt]->patient_location->loc_bed_disp = uar_get_code_display(e.loc_bed_cd)
			pop_encounters_reply_out->encounter[encntrCnt]->patient_location->loc_building_cd = e.loc_building_cd
	 		pop_encounters_reply_out->encounter[encntrCnt]->patient_location->loc_building_disp = uar_get_code_display(e.loc_building_cd)
			pop_encounters_reply_out->encounter[encntrCnt]->patient_location->loc_facility_cd = e.loc_facility_cd
	 		pop_encounters_reply_out->encounter[encntrCnt]->patient_location->loc_facility_disp = uar_get_code_display(e.loc_facility_cd)
			pop_encounters_reply_out->encounter[encntrCnt]->patient_location->loc_nurse_unit_cd = e.loc_nurse_unit_cd
	 		pop_encounters_reply_out->encounter[encntrCnt]->patient_location->loc_nurse_unit_disp =
	 		uar_get_code_display(e.loc_nurse_unit_cd)
			pop_encounters_reply_out->encounter[encntrCnt]->patient_location->loc_room_cd = e.loc_room_cd
	 		pop_encounters_reply_out->encounter[encntrCnt]->patient_location->loc_room_disp = uar_get_code_display(e.loc_room_cd)
			pop_encounters_reply_out->encounter[encntrCnt]->patient_location->loc_temp_cd = e.loc_temp_cd
	 		pop_encounters_reply_out->encounter[encntrCnt]->patient_location->loc_temp_disp = uar_get_code_display(e.loc_temp_cd)
 
			; Person Data
			pop_encounters_reply_out->encounter[encntrCnt]->person->person_id = p.person_id
			pop_encounters_reply_out->encounter[encntrCnt]->person->name_full_formatted = p.name_full_formatted
			pop_encounters_reply_out->encounter[encntrCnt]->person->name_first = p.name_first
			pop_encounters_reply_out->encounter[encntrCnt]->person->name_last = p.name_last
			pop_encounters_reply_out->encounter[encntrCnt]->person->name_middle = p.name_middle
	 		pop_encounters_reply_out->encounter[encntrCnt]->person->mrn = ea3.alias
	 		pop_encounters_reply_out->encounter[encntrCnt]->person->dob = p.birth_dt_tm ;005
	 		pop_encounters_reply_out->encounter[encntrCnt]->person->gender_id = p.sex_cd ;005
	 		pop_encounters_reply_out->encounter[encntrCnt]->person->gender_disp = uar_get_code_display(p.sex_cd);005
	 		pop_encounters_reply_out->encounter[encntrCnt]->person->sDOB =
	 		datetimezoneformat(p.birth_dt_tm,p.birth_tz,"YYYY-MM-DD",curtimezonedef) ;010
	 	endif
	foot report
		stat = alterlist(pop_encounters_reply_out->encounter,encntrCnt)
		pop_encounters_reply_out->encounter_count = encntrCnt
	with nocounter, separator=" ", format, expand = value(exp), time = value(timeOutThreshold) ;, maxrec = 2000 ;011
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	set iObsSize = size(pop_encounters_reply_out->encounter, 5)
	if(iObsSize > 0)
		call ErrorHandler("EXECUTE", "S", "POP_DOCUMENTS", "Success.", pop_encounters_reply_out)
	else
		call ErrorHandler("EXECUTE", "Z", "POP_DOCUMENTS", "No records qualify.", pop_encounters_reply_out)
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetEncounters Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;End Sub
 
 
/*************************************************************************
;  Name: GetEDLocationInfo(null)
;  Description: Subroutine to get firstnet bed/location data
**************************************************************************/
subroutine GetEDLocationInfo(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetEDLocationInfo Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from (dummyt d with seq = size(pop_encounters_reply_out->encounter,5))
		,tracking_item ti
		,tracking_locator tl
	plan d where pop_encounters_reply_out->encounter[d.seq].encounter_type_class_cd = c_emergency_encntr_type_class_cd
		and (pop_encounters_reply_out->encounter[d.seq].patient_location.loc_bed_cd < 1 or
			pop_encounters_reply_out->encounter[d.seq].patient_location.loc_room_cd < 1)
	join ti where ti.encntr_id = pop_encounters_reply_out->encounter[d.seq].encounter_id
	join tl where tl.tracking_id = ti.tracking_id
	order by tl.depart_dt_tm desc
	head report
		pop_encounters_reply_out->encounter[d.seq].patient_location.loc_bed_cd = tl.loc_bed_cd
		pop_encounters_reply_out->encounter[d.seq].patient_location.loc_bed_disp = uar_get_code_display(tl.loc_bed_cd)
		pop_encounters_reply_out->encounter[d.seq].patient_location.loc_room_cd = tl.loc_room_cd
		pop_encounters_reply_out->encounter[d.seq].patient_location.loc_room_disp = uar_get_code_display(tl.loc_room_cd)
	with nocounter, time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetEDLocationInfo Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;End Sub
 
 
/*************************************************************************
;  Name: GetCareTeamInfo(null)
;  Description: Subroutine to get care team data
**************************************************************************/
subroutine GetCareTeamInfo(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetCareTeamInfo Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
	;Set expand control value
	if(pop_encounters_reply_out->encounter_count > 200)
		set exp = 2
	else
		set exp = 0
	endif
    ;get encounter relation information
 	set num = 0
 	set pop = 0
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
  	set pReltnCnt = 0
 
  	select into "nl:"
  	epr.encntr_id , epr.encntr_prsnl_reltn_id, ph.phone_id
  	from encntr_prsnl_reltn  epr
  		;, code_value c
  		, prsnl p
  		, phone ph
  	plan epr
  	where expand(num,1, pop_encounters_reply_out->encounter_count,epr.encntr_id,
  	             pop_encounters_reply_out->encounter[num].encounter_id)
  	;epr.encntr_id = 46608969
	and epr.active_ind = 1
  	join p
  	where p.person_id = epr.prsnl_person_id
  	;join c
  	;where c.code_value = epr.encntr_prsnl_r_cd
  	join ph
 	where ph.parent_entity_id = outerjoin(p.person_id)
  		and ph.parent_entity_name = outerjoin("PERSON")
 		and ph.active_ind = outerjoin(1)
	  	and ph.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
	   	and ph.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
  	order by epr.encntr_id ,epr.encntr_prsnl_reltn_id, ph.phone_id
    head epr.encntr_id
        pos = 0
    	pReltnCnt = 0
    	PhCnt = 0
    head epr.encntr_prsnl_reltn_id
         pos = locateval(num,1, pop_encounters_reply_out->encounter_count,epr.encntr_id ,
  	                     pop_encounters_reply_out->encounter[num].encounter_id)
  		pPhCnt = 0
		pReltnCnt = pReltnCnt + 1
        stat = alterlist(pop_encounters_reply_out->encounter[pos].patient_care_team, pReltnCnt)
		pop_encounters_reply_out->encounter[pos]->patient_care_team[pReltnCnt]->reltn_type =
		                                                               uar_get_code_display (epr.encntr_prsnl_r_cd)
 		pop_encounters_reply_out->encounter[pos]->patient_care_team[pReltnCnt]->provider_id = p.person_id
 		pop_encounters_reply_out->encounter[pos]->patient_care_team[pReltnCnt]->provider_name = p.name_full_formatted
		pop_encounters_reply_out->encounter[pos]->patient_care_team[pReltnCnt]->from_date = epr.beg_effective_dt_tm
		pop_encounters_reply_out->encounter[pos]->patient_care_team[pReltnCnt]->to_date = epr.end_effective_dt_tm
		pop_encounters_reply_out->encounter[pos]->patient_care_team[pReltnCnt]->is_manually_added = epr.manual_create_ind
		pop_encounters_reply_out->encounter[pos]->patient_care_team[pReltnCnt]->internal_seq = epr.internal_seq
 	head ph.phone_id
 		if(ph.phone_id > 0)
		  	pPhCnt = pPhCnt + 1
		    stat = alterlist(pop_encounters_reply_out->encounter[pos]->patient_care_team[pReltnCnt]->phones, pPhCnt)
		  	pop_encounters_reply_out->encounter[pos]->patient_care_team[pReltnCnt]->phones[pPhCnt]->phone_id = ph.phone_id
			pop_encounters_reply_out->encounter[pos]->patient_care_team[pReltnCnt]->phones[pPhCnt]->phone_type_cd = ph.phone_type_cd
		 	pop_encounters_reply_out->encounter[pos]->patient_care_team[pReltnCnt]->phones[pPhCnt]->phone_type_disp =
		 	                                                                       UAR_GET_CODE_DISPLAY(ph.phone_type_cd)
		  	pop_encounters_reply_out->encounter[pos]->patient_care_team[pReltnCnt]->phones[pPhCnt]->phone_num = ph.phone_num
	   	  	pop_encounters_reply_out->encounter[pos]->patient_care_team[pReltnCnt]->phones[pPhCnt]->sequence_nbr = ph.phone_type_seq
	   	  endif
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
 	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	;get person_prsnl info
 	set num = 0
 	set pop = 0
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
   	set pReltnCnt = 0
 
  	select into "nl:"
  	epr.person_id , epr.person_prsnl_reltn_id, ph.phone_id
  	from person_prsnl_reltn  epr
  		;, code_value c
  		, prsnl p
  		, phone ph
  	plan epr
  	where expand(num,1, pop_encounters_reply_out->encounter_count,epr.person_id,
  	             pop_encounters_reply_out->encounter[num].person.person_id)
	and epr.active_ind = 1
  	join p
  	where p.person_id = epr.prsnl_person_id
  	;join c
  	;where c.code_value = epr.person_prsnl_r_cd
  	join ph
 	where ph.parent_entity_id = outerjoin(p.person_id)
  		and ph.parent_entity_name = outerjoin("PERSON")
 		and ph.active_ind = outerjoin(1)
	  	and ph.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
	   	and ph.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
  	order by   	epr.person_id , epr.person_prsnl_reltn_id, ph.phone_id
 
    head epr.person_id
        pos = 0
        pos = locateval(num,1, pop_encounters_reply_out->encounter_count,epr.person_id  ,
  	                     pop_encounters_reply_out->encounter[num].person.person_id)
    	pReltnCnt = size(pop_encounters_reply_out->encounter[pos]->patient_care_team,5)
    	PhCnt = 0
    head epr.person_prsnl_reltn_id
  		pPhCnt = 0
		pReltnCnt = pReltnCnt + 1
        stat = alterlist(pop_encounters_reply_out->encounter[pos].patient_care_team, pReltnCnt)
		pop_encounters_reply_out->encounter[pos]->patient_care_team[pReltnCnt]->reltn_type =
		                                                               uar_get_code_display (epr.person_prsnl_r_cd)
 		pop_encounters_reply_out->encounter[pos]->patient_care_team[pReltnCnt]->provider_id = p.person_id
 		pop_encounters_reply_out->encounter[pos]->patient_care_team[pReltnCnt]->provider_name = p.name_full_formatted
		pop_encounters_reply_out->encounter[pos]->patient_care_team[pReltnCnt]->from_date = epr.beg_effective_dt_tm
		pop_encounters_reply_out->encounter[pos]->patient_care_team[pReltnCnt]->to_date = epr.end_effective_dt_tm
		pop_encounters_reply_out->encounter[pos]->patient_care_team[pReltnCnt]->is_manually_added = epr.manual_create_ind
		pop_encounters_reply_out->encounter[pos]->patient_care_team[pReltnCnt]->internal_seq = epr.internal_seq
 	head ph.phone_id
 	    if(ph.phone_id > 0)
		  	pPhCnt = pPhCnt + 1
		    stat = alterlist(pop_encounters_reply_out->encounter[pos]->patient_care_team[pReltnCnt]->phones, pPhCnt)
		  	pop_encounters_reply_out->encounter[pos]->patient_care_team[pReltnCnt]->phones[pPhCnt]->phone_id = ph.phone_id
			pop_encounters_reply_out->encounter[pos]->patient_care_team[pReltnCnt]->phones[pPhCnt]->phone_type_cd = ph.phone_type_cd
		 	pop_encounters_reply_out->encounter[pos]->patient_care_team[pReltnCnt]->phones[pPhCnt]->phone_type_disp =
		 	                                                                       UAR_GET_CODE_DISPLAY(ph.phone_type_cd)
		  	pop_encounters_reply_out->encounter[pos]->patient_care_team[pReltnCnt]->phones[pPhCnt]->phone_num = ph.phone_num
	   	  	pop_encounters_reply_out->encounter[pos]->patient_care_team[pReltnCnt]->phones[pPhCnt]->sequence_nbr = ph.phone_type_seq
	   	endif
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
 	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetCareTeamInfo Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;sub
 
 
/*************************************************************************
;  Name: GetComments(null)
;  Description: Subroutine to get comments data
**************************************************************************/
subroutine GetComments(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Getting comments Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
	;Set expand control value
	if(pop_encounters_reply_out->encounter_count > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	set count = 0
	set num = 0
	set pop = 0
	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
	select into "nl:"
  	e.encntr_id
    ,e.info_type_cd
  	from encntr_info e,long_text lt
 	plan e
  	where expand(num,1,pop_encounters_reply_out->encounter_count,e.encntr_id
  		                ,pop_encounters_reply_out->encounter[num].encounter_id)
    and e.info_type_cd = c_comments_info_type_cd
  	join lt
  	where e.long_text_id = lt.long_text_id
  	order by e.encntr_id, e.info_type_cd
  	head report
  		count = 0
  		pos = 0
  	  head e.encntr_id
  	    pos = 0
  	    count = 0
  	    x = 0
       val_cnt = 0
  	  head e.info_type_cd
  		x = 0
  		val_cnt = 0
  		pos = locateval(num,1,pop_encounters_reply_out->encounter_count,e.encntr_id
  		                ,pop_encounters_reply_out->encounter[num].encounter_id)
  		detail
  		count = count + 1
  		stat = alterlist(pop_encounters_reply_out->encounter[pos]->Comments,count)
  		pop_encounters_reply_out->encounter[pos].Comments[count].UPDT_ID = e.updt_id
  		pop_encounters_reply_out->encounter[pos].Comments[count].UPDT_DT_TM = e.updt_dt_tm
        pop_encounters_reply_out->encounter[pos].Comments[count].CMT_TEXT = trim(lt.long_text,3)
        pop_encounters_reply_out->encounter[pos].Comments[count].Internal_Seq = e.internal_seq
 
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetComments Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;sub
 
/*************************************************************************
;  Name: GetPatientValuables(null)
;  Description: Subroutine to get patienbt valuables data
**************************************************************************/
subroutine GetPatientValuables(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Getting Patient Valuables Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
	;Set expand control value
	if(pop_encounters_reply_out->encounter_count > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	set count = 0
	set num = 0
	set pop = 0
	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
	select into "nl:"
  	e.encntr_id
  	from encntr_code_value_r   e
 	plan e
  	where expand(num,1,pop_encounters_reply_out->encounter_count,e.encntr_id
  		                ,pop_encounters_reply_out->encounter[num].encounter_id)
  	and e.code_set = 14751.00
    and e.active_ind = 1
    and e.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
  	order by e.encntr_id
  	head report
  		count = 0
  		pos = 0
  	  head e.encntr_id
  	    count = 0
  		pos = 0
  		pos = locateval(num,1,pop_encounters_reply_out->encounter_count,e.encntr_id
  		                ,pop_encounters_reply_out->encounter[num].encounter_id)
  		detail
  		count = count + 1
  		stat = alterlist(pop_encounters_reply_out->encounter[pos]->patient_valuables,count)
  		pop_encounters_reply_out->encounter[pos].patient_valuables[count].id = e.code_value
  		pop_encounters_reply_out->encounter[pos].patient_valuables[count].name =
  		                                        trim(uar_get_code_display(e.code_value ),3)
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetPatientValuables Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;sub
 
/*************************************************************************
;  Name: GetCustomFields(null)
;  Description: Subroutine to get CustomFields data
**************************************************************************/
subroutine GetCustomFields(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Getting Custom Fields Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
	;Set expand control value
	if(pop_encounters_reply_out->encounter_count > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	set count = 0
	set num = 0
	set pop = 0
	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
	select into "nl:"
  	e.encntr_id
  	,e.info_sub_type_cd
  	,e.value_cd
  	from encntr_info e,long_text lt
 	plan e
  	where expand(num,1,pop_encounters_reply_out->encounter_count,e.encntr_id
  		                ,pop_encounters_reply_out->encounter[num].encounter_id)
  	and e.info_type_cd = c_userdefined_info_type_cd
    and e.active_ind  = 1
    and e.end_effective_dt_tm  > cnvtdatetime(curdate,curtime3)
  	join lt
  	where e.long_text_id = lt.long_text_id
  	order by e.encntr_id , e.info_sub_type_cd, e.value_cd
  	head report
  		count = 0
  		pos = 0
  	head e.encntr_id
  	    pos = 0
  	    count = 0
  	    x = 0
        val_cnt = 0
   head e.info_sub_type_cd
  		x = 0
  		val_cnt = 0
  		pos = locateval(num,1,pop_encounters_reply_out->encounter_count,e.encntr_id
  		                ,pop_encounters_reply_out->encounter[num].encounter_id)
  		count = count + 1
  		stat = alterlist(pop_encounters_reply_out->encounter[pos]->CustomFields,count)
  		pop_encounters_reply_out->encounter[pos].CustomFields[count].Field.id = e.info_sub_type_cd
  		pop_encounters_reply_out->encounter[pos].CustomFields[count].Field.name =
  		                                        trim(uar_get_code_display(e.info_sub_type_cd),3)
  		detail
	  	   if(size(trim(lt.long_text)) > 0)
	  		val_cnt = val_cnt+1
	  		stat = alterlist(pop_encounters_reply_out->encounter[pos]->CustomFields[count].ResponseValueText,val_cnt)
 
	  		pop_encounters_reply_out->encounter[pos]->CustomFields[count].ResponseValueText[val_cnt] = trim(lt.long_text,3)
		   endif
		   if (e.value_cd > 0)
    		x= x+1
    		stat = alterlist(pop_encounters_reply_out->encounter[pos]->CustomFields[count].ResponseValueCodes,x)
  			pop_encounters_reply_out->encounter[pos]->CustomFields[count].ResponseValueCodes[x].id = e.value_cd
  			pop_encounters_reply_out->encounter[pos]->CustomFields[count].ResponseValueCodes[x].name = UAR_GET_CODE_DISPLAY(e.value_cd)
		   endif
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
	if(iDebugFlag > 0)
		call echo(concat("GetCustomFields Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;sub
 
end
go
 
 
 
 
