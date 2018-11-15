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
~BE~**************************************************************************
  Source file name:     snsro_get_pop_observations.prg
  Object name:          snsro_get_pop_observations
  Program purpose:      Retrieve observations from CLINICAL_EVENT based on
  						date range and event_cd list parameters.
  Tables read:			CLINICAL_EVENT, PERSON, ENCOUNTER
  Tables updated:       NONE
  Executing from:       Emissary Service
  Special Notes:      	This population query will check for maximum records
  						and a maximum date range and if those are exceeded
  						a failure status and message will get returned.
***********************************************************************
                MODIFICATION CONTROL LOG
***********************************************************************
Mod Date   	 Engineer         	Comment
--- -------- ------------------	-----------------------------------
000 09/29/14 JCO                Initial write
001 08/10/16 DJP				Add additional subroutines to work with
								expand function and option to process
								input data matching 4 distinct scenarios
								Add Patient MRN/FIN
002 8/25/16 DJP					Changed name of program to
								snsro_pop_get_observations
								changed field names:
								from 			to:
								last_name	name_last
								first_name	name_first
								middle_name	name_middle
								admit_dt_tm	arrive_date
								encntr_id 	encounter_id
003 08/30/16 DJP				Prompt validation of event and facility codes entered
004 09/06/16 DJP				Renamed program to snsro_get_pop_observations
005 10/13/16 JCO				Added OBSERVED_DT_TM to get populated in the response
006 12/13/16 DJP				Added facility object and created_date_time
007 12/27/16 DJP				Added error code for "Z" status, no data
008 01/09/17 DJP				Added Patient Location Object; Removed Facility Object
009 01/12/17 DJP				Changed End Time from Required to Optional
								Default "" to Now minus 1 minute
010 01/25/17 DJP				Moved Location Object to within Encounter Object
011 01/31/17 DJP				Added Event Set as Category Parameter
012 03/06/17 DJP				Added ErrorHandler2 fields
013 05/18/17 DJP				Add Gender/DOB to Person object
014 07/10/17 DJP				UTC date/time code changes
015 07/10/17 DJP 				Check for From Date > To Date
016 07/31/17 JCO				Changed %i to execute; update ErrorHandler2
017 03/22/18 RJC				Added version code and copyright block
018 04/11/18 DJP				Added string Birthdate to person object
019 06/11/18 DJP				Comment out MAXREC on Selects
020 08/01/18 RJC				Code cleanup
021 08/09/18 RJC				Changed max rec behavior. Max recs will no longer error out. It will return the max recs and
								once the limit is reached, it return all recs tied to the same second.
022 08/10/18 RJC				Added the Observation group object
023 08/14/18 RJC				Made expand clause variable depending on number of elements in record
024 08/27/18 RJC				Added valid_until_dt_tm to clinical_event query
025 08/28/18 STV				Moved dates init to the GetDateTime function
026 10/18/18 RJC					Outerjoin on person_alias table
**********************************************************************/
drop program snsro_get_pop_observations go
create program snsro_get_pop_observations
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Username:" = ""  			;REQUIRED. Valid HNA Millennium user account.
	, "Beg Date:" = ""				;REQUIRED. Beginning of bookmark date range.
	, "End Date:" = ""				;OPTIONAL. No longer REQUIRED. End of bookmark date range. ;009
	, "Categories" = ""				;OPTIONAL. ;011
	, "Components" = ""				;OPTIONAL. List of event codes from code set 72/93.
	, "Facilities" = ""				;OPTIONAL. List of location facility codes from code set 220.
	, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
	, "Time Max" = 3600			;DO NOT USE. Undocumented value to override maximum date range in seconds.
 
with OUTDEV, USERNAME, BEG_DATE, END_DATE, CAT_LIST, COMP_LIST, LOC_LIST, DEBUG_FLAG, TIME_MAX
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL changed to Emissary version ;017
**************************************************************************/
set sVersion = "1.16.6.1"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record ph_observations_reply_out
record ph_observations_reply_out	(
	1 observations_count				= i4
	1 observations [*]
	  2 primary_key_id 					= f8 	;ce.clinical_event_id
	  2 observation_id					= f8 	;ce.event_id
      2 person_id 						= f8	;ce.person_id
	  2 component_id     				= f8	;ce.event_cd
	  2 component_desc       			= vc	;ce.event_cd (display)
      2 result_date						= dq8 	;ce.performed_dt_tm
	  2 clinsig_updt_dt_tm				= dq8	;ce.clinsig_updt_dt_tm
	  2 observed_dt_tm					= dq8   ;ce.event_end_dt_tm
	  2 update_dt_tm					= dq8	;ce.updt_dt_tm
      2 valid_from_date 				= dq8	;ce.valid_from_dt_tm
      2 result_val 						= vc	;ce.result_val
      2 normalcy_cd 					= f8	;ce.normlacy_cd
	  2 normalcy_disp 					= vc	;normalcy display
	  2 normal_high						= vc	;ce.normal_high
	  2 normal_low						= vc	;ce.normal_low
      2 order_id 						= f8	;ce.order_id
      2 result_status_cd 				= f8	;ce.result_status_cd
	  2 result_status	 				= vc	;result status display
      2 event_tag 						= vc	;ce.event_tag
      2 event_class_cd 					= f8	;ce.event_class_cd
	  2 event_class_disp 				= vc	;event class display
      2 string_result_text				= vc	;ce.string_result_text
      2 calc_result_text 				= vc	;ce.calc_result_text
      2 date_result 					= dq8	;ce.date_result_dt_tm
      2 date_result_type 				= i2	;ce.date_result_type
      2 date_result_tz 					= i4	;ce.date_result_tz
      2 unit_cd 						= f8	;ce.unit_cd
	  2 unit_disp 						= vc	;unit code display
      2 collating_seq 					= vc	;ce.collating_seq
      2 created_updated_date_time		= dq8	;ce.updt_dt_tm ; 006 add create dt/tm
      2 observation_group						;021
      	3 id							= f8
      	3 name							= vc
	  2 person
		  3 person_id 					= f8	;p.person_id
		  3 name_full_formatted 		= vc	;p.name_full_formatted
		  3 name_last 					= vc	;p.last_name
		  3 name_first 					= vc	;p.first_name
		  3 name_middle 				= vc	;p.middle_name
		  3 mrn							= vc    ;pa.alias 002
		  3 dob							= dq8 	;013
		  3 gender_id					= f8  	;013
		  3 gender_disp					= vc  	;013
		  3 sDOB						= c10 	;018
	  2 encounter
		  3 encounter_id 				= f8	;e.encntr_id
		  3 encounter_type_cd			= f8	;e.encntr_type_cd
		  3 encounter_type_disp			= vc	;encounter type display
		  3 encounter_type_class_cd		= f8	;encounter_type_class_cd
	      3 encounter_type_class_disp	= vc	;encounter type class display
 		  3 arrive_date					= dq8	;e.arrive_dt_tm
 		  3 discharge_date				= dq8	;e.discharge_dt_tm
 		  3 fin_nbr						= vc	;ea.alias 002
 		  3 patient_location					;008 ; 010
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
  1 status_data									;016
    2 status 							= c1
    2 subeventstatus[1]
      3 OperationName 					= c25
      3 OperationStatus 				= c1
      3 TargetObjectName 				= c25
      3 TargetObjectValue 				= vc
      3 Code 							= c4
      3 Description 					= vc
)
 
free record categories_req	;011
record categories_req (
	1 qual_cnt 							= i4
	1 qual[*]
		2 event_set_cd					= f8
)
 
free record components_req
record components_req (
	1 qual_cnt 							= i4
	1 qual[*]
		2 event_cd						= f8
)
 
free record locations_req
record locations_req (
	1 qual_cnt							= i4
	1 qual[*]
		2 location_cd					= f8
)
 
;initialize status
set ph_observations_reply_out->status_data->status = "F"
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common		;016
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
set MODIFY MAXVARLEN 200000000	;021
 
;Input
declare sUserName					= vc with protect, noconstant("")
declare sFromDate					= vc with protect, noconstant("")
declare sToDate						= vc with protect, noconstant("")
declare sCategories					= vc with protect, noconstant("")
declare sComponents					= vc with protect, noconstant("")
declare sLocFacilities				= vc with protect, noconstant("")
declare iDebugFlag					= i2 with protect, noconstant(0)
declare iTimeMax					= i4 with protect, noconstant(0)
 
;Other
declare UTCmode						= i2 with protect, noconstant(0);014
declare UTCpos 						= i2 with protect, noconstant(0);014
declare iTimeDiff					= i4 with protect, noconstant(0)
declare qFromDateTime				= dq8 with protect, noconstant(CNVTDATETIME(CURDATE, CURTIME3))
declare qToDateTime					= dq8 with protect, noconstant(CNVTDATETIME(CURDATE, CURTIME3))
declare ndx                     	= i4 with protect, noconstant(1)
declare ndx2                     	= i4 with protect, noconstant(1)
declare iMaxRecs					= i4 with protect, constant(2000) ;021
 
;Constants
declare c_mrn_person_alias_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",4,"MRN"))
declare c_finnbr_encntr_alias_type_cd	= f8 with protect, constant(uar_get_code_by("MEANING",319,"FIN NBR"))
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ParseLocations(null)				= null with Protect
declare ParseCategories(null)				= null with protect	;011
declare ParseComponents(null)  				= null with Protect
declare GetObservations(null)				= null with protect
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
;Input
set sUserName						= trim($USERNAME, 3)
set sFromDate						= trim($BEG_DATE, 3)
set sToDate							= trim($END_DATE, 3)
set iDebugFlag						= cnvtint($DEBUG_FLAG)
set sCategories  					= trim($CAT_LIST, 3) ;011
set sComponents     				= trim($COMP_LIST,3)
set sLocFacilities					= trim($LOC_LIST,3)
set iTimeMax						= cnvtint($TIME_MAX)
 
;Other
set UTCmode							= CURUTC ;014
set UTCpos							= findstring("Z",sFromDate,1,0) ;014
 
set qFromDateTime = GetDateTime(sFromDate)
set qToDateTime = GetDateTime(sToDate)
 
if(iDebugFlag > 0)
	call echo(build("sUserName -> ", sUserName))
	call echo(build("sFromDate -> ",sFromDate))
	call echo(build("sToDate -> ",sToDate))
	call echo(build("qFromDateTime -> ", qFromDateTime))
	call echo(build("qToDateTime -> ", qToDateTime))
	call echo(build ("qFromDateTime Display",format(qFromDateTime, "@LONGDATETIME")))
	call echo(build ("qToDateTime Display",format(qToDateTime, "@LONGDATETIME")))
	call echo(build("debug flag -> ", iDebugFlag))
	call echo(build("Time Maximum -> ", iTimeMax))
	call echo(build("Components -> ",sComponents))
	call echo(build("Loc Facilities -> ",sLocFacilities))
 	call echo(build("UTC MODE -->",UTCmode));013
 	call echo(build("UTC POS -->",UTCpos));014
	call echo(build("datediff-->", iTimeDiff))
endif
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Validate username
set iRet = PopulateAudit(sUserName, 0.0, ph_observations_reply_out, sVersion)
if(iRet = 0)  ;010
	call ErrorHandler2("VALIDATE", "F","POP_OBSERVATIONS", "Invalid User for Audit.",
	"1001",build("User is invalid: ",sUserName),ph_observations_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate from date is not greater than to date - 015
if (qFromDateTime > qToDateTime)
	call ErrorHandler2("VALIDATE", "F", "POP_OBSERVATIONS", "From Date Greater than To Date. Refine Dates Entered.",
	"2010", "From Date Greater than To Date. Refine Dates Entered.", pop_observations_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate timespan doesn't exceed threshold - 012
set iRet = ThreshHoldValidator(iTimeMax,"s",qFromDateTime,qToDateTime)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "POP_OBSERVATIONS", "Date Range Too Long. Refine Query.",
	"2011","Date Range Too Long. Refine Query.",ph_observations_reply_out)
	go to EXIT_SCRIPT
endif
 
; Parse Locations if provided
if(sLocFacilities > " ")
	call ParseLocations(null)
endif
 
; Parse Categories if provided
if(sCategories > " ")
	call ParseCategories(null)
endif
 
; Parse Components if provided
if(sComponents > " ")
	call ParseComponents(null)
endif
 
; Get Observation Data
call GetObservations(null)
 
/*************************************************************************
 EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************
 Convert REC output to JSON
**************************************************************/
set JSONout = CNVTRECTOJSON(ph_observations_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag = 1)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_pop_observations.json")
	call echo(build2("_file : ", _file))
	call echojson(ph_observations_reply_out, _file, 0)
 	call echorecord(ph_observations_reply_out)
   	call echo(JSONout)
endif
 
#EXIT_VERSION
 
/*************************************************************************
;  Name: ParseLocations(null) = null
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
     		set locations_req->qual_cnt = num
      		set stat = alterlist(locations_req->qual, num)
     		set locations_req->qual[num]->location_cd = cnvtreal(str)
 
     		 select into code_value
     		 from code_value
			 where code_set = 220 and cdf_meaning = "FACILITY"
			 	and locations_req->qual[num]->location_cd = code_value
 
     		if (curqual = 0)
				call ErrorHandler2("VALIDATE", "F", "POP_OBSERVATIONS", build("Invalid Facility Code: ", locations_req->qual[num]->location_cd),
				"2040", build("Invalid Facility Code: ",locations_req->qual[num]->location_cd),ph_observations_reply_out)
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
;  Name: ParseCategories(null) = null
;  Description: Subroutine to parse a comma delimited string
**************************************************************************/
subroutine ParseCategories(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ParseCategories Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare notfnd 		= vc with constant("<not_found>")
	declare num 		= i4 with noconstant(1)
	declare str 		= vc with noconstant("")
 
	while (str != notfnd)
     	set str =  piece(sCategories,',',num,notfnd)
     	if(str != notfnd)
			set iRet = GetCodeSet(cnvtreal(str))
			if(iRet != 93)
				call ErrorHandler2("EXECUTE", "F", "POP_OBSERVATIONS",build("Invalid Event Set Code: ",trim(str,3)),
				"2026",build("Invalid Event Set Code: ",trim(str,3)), ph_observations_reply_out)	;012
				go to Exit_Script
			else
				set categories_req->qual_cnt = num
      			set stat = alterlist(categories_req->qual, num)
      			set categories_req->qual[num]->event_set_cd = cnvtreal(str)
			endif
       	endif
      	set num = num + 1
	endwhile
 
	;Set expand control value - 023
	if(categories_req->qual_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	set num = 1
	; Get event codes for all categories provided
  	select into "nl:"
 	from v500_event_set_explode ves
 	where expand (num,1,categories_req->qual_cnt,ves.event_set_cd,categories_req->qual[num].event_set_cd)
 		and ves.event_cd != 0.0
	head report
		x = 0
		stat = alterlist(components_req->qual,2000)
	detail
		x = x + 1
		if(mod(x,100) = 1 and x > 2000)
			stat = alterlist(components_req->qual,x + 99)
		endif
 
		components_req->qual[x].event_cd = ves.event_cd
	foot report
		stat = alterlist(components_req->qual,x)
		components_req->qual_cnt = x
	with nocounter, expand = 2
 
	if(iDebugFlag > 0)
		call echo(concat("ParseCategories Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: ParseComponents(null) = null
;  Description: Subroutine to parse a comma delimited string
**************************************************************************/
subroutine ParseComponents(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ParseComponents Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare notfnd 		= vc with constant("<not_found>")
	declare num 		= i4 with noconstant(1)
	declare str 		= vc with noconstant("")
 
	while (str != notfnd)
     	set str =  piece(sComponents,',',num,notfnd)
     	if(str != notfnd)
			set iRet = GetCodeSet(cnvtreal(str))
			if(iRet != 72)
     			call ErrorHandler2("EXECUTE", "F", "POP_OBSERVATIONS", build("Invalid Event Code: ",trim(str,3)),
				"2018", build("Invalid Event Code: ",trim(str,3)), ph_observations_reply_out)
      			go to exit_script
			else
				set components_req->qual_cnt = components_req->qual_cnt + num
				set stat = alterlist(components_req->qual, components_req->qual_cnt)
     			set components_req->qual[components_req->qual_cnt]->event_cd = cnvtreal(str)
        	endif
		endif
      	set num = num + 1
 	endwhile
 
	if(iDebugFlag > 0)
		call echo(concat("ParseComponents Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetObservations(null)
;  Description: Subroutine to get Observations
**************************************************************************/
subroutine GetObservations(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetObservations Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	; Temp record
	free record temp
	record temp (
		1 qual_cnt = i4
		1 qual[*]
			2 clinical_event_id = f8
			2 updt_dt_tm = dq8
	)
 
	;Set expand control value - 023
	if(locations_req->qual_cnt > 200 or components_req->qual_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
 	; Populate temp record
 	; Restrict list to iMaxRec records, but adjust if the limit is reached and there are others at the same second - 021
	select
		if(locations_req->qual_cnt > 0 and components_req->qual_cnt > 0)
			from clinical_event ce
				,encounter e
			plan ce where ce.updt_dt_tm >= cnvtdatetime(qFromDateTime)
				and ce.updt_dt_tm <= cnvtdatetime(qToDateTime)
				and ce.valid_until_dt_tm > cnvtdatetime(curdate,curtime3) ;024
				and expand(ndx,1,components_req->qual_cnt,ce.event_cd,components_req->qual[ndx].event_cd)
			join e where e.encntr_id = ce.encntr_id
				and expand(ndx2,1,locations_req->qual_cnt,e.loc_facility_cd,locations_req->qual[ndx2].location_cd)
			order by ce.updt_dt_tm
		elseif(locations_req->qual_cnt > 0)
			from clinical_event ce
				,encounter e
			plan ce where ce.updt_dt_tm >= cnvtdatetime(qFromDateTime)
				and ce.updt_dt_tm <= cnvtdatetime(qToDateTime)
				and ce.valid_until_dt_tm > cnvtdatetime(curdate,curtime3) ;024
			join e where e.encntr_id = ce.encntr_id
				and expand(ndx2,1,locations_req->qual_cnt,e.loc_facility_cd,locations_req->qual[ndx2].location_cd)
			order by ce.updt_dt_tm
		elseif(components_req->qual_cnt > 0)
			from clinical_event ce
			plan ce where ce.updt_dt_tm >= cnvtdatetime(qFromDateTime)
				and ce.updt_dt_tm <= cnvtdatetime(qToDateTime)
				and ce.valid_until_dt_tm > cnvtdatetime(curdate,curtime3) ;024
				and expand(ndx,1,components_req->qual_cnt,ce.event_cd,components_req->qual[ndx].event_cd)
			order by ce.updt_dt_tm
		else
			from clinical_event ce
			plan ce where ce.updt_dt_tm >= cnvtdatetime(qFromDateTime)
				and ce.updt_dt_tm <= cnvtdatetime(qToDateTime)
				and ce.valid_until_dt_tm > cnvtdatetime(curdate,curtime3) ;024
			order by ce.updt_dt_tm
		endif
	into "nl:"
		ce.clinical_event_id,
		ce.updt_dt_tm
	head report
		x = 0
		max_reached = 0
		stat = alterlist(temp->qual,iMaxRecs)
	head ce.updt_dt_tm
		if(x > iMaxRecs)
			max_reached = 1
		endif
	detail
		if(max_reached = 0)
			x = x + 1
			if(mod(x,100) = 1 and x > iMaxRecs)
				stat = alterlist(temp->qual,x + 99)
			endif
 
			temp->qual[x].clinical_event_id = ce.clinical_event_id
			temp->qual[x].updt_dt_tm = ce.updt_dt_tm
		endif
	foot report
		stat = alterlist(temp->qual,x)
		temp->qual_cnt = x
	with nocounter, expand = value(exp)
 
	if(iDebugFlag)
 		call echo(build("------Qual Cnt = ",temp->qual_cnt))
 	endif
 
	;Populate audit
	if(temp->qual_cnt > 0)
		call ErrorHandler("Success", "S", "POP_OBSERVATIONS", "Successfully retrieved observations.", ph_observations_reply_out)
	else
		call ErrorHandler("EXECUTE", "Z", "POP_OBSERVATIONS", "No records qualify.", ph_observations_reply_out);007
		go to exit_script
	endif
 
	;Set expand control value - 023
	if(temp->qual_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	; Populate final record
	set tnum = 1
	select into "nl:"
	from
		clinical_event   ce
		,person p
		,encounter e
		,person_alias pa
		,encntr_alias ea
		,ce_dynamic_label cdl
		,long_text lt
	plan ce where expand(tnum,1,temp->qual_cnt,ce.clinical_event_id,temp->qual[tnum].clinical_event_id)
	join p where p.person_id = ce.person_id
	join pa where pa.person_id = outerjoin(p.person_id)
		and pa.person_alias_type_cd = outerjoin(c_mrn_person_alias_type_cd)
		and pa.active_ind = outerjoin(1)
		and pa.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		and pa.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
	join e where e.encntr_id = outerjoin(ce.encntr_id)
	join ea where ea.encntr_id = outerjoin(e.encntr_id)
		and ea.encntr_alias_type_cd = outerjoin(c_finnbr_encntr_alias_type_cd)
		and ea.active_ind = outerjoin(1)
		and ea.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		and ea.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
	join cdl where cdl.ce_dynamic_label_id = outerjoin(ce.ce_dynamic_label_id)
	join lt where lt.long_text_id = outerjoin(cdl.long_text_id)
 	head report
		x = 0
		stat = alterlist(ph_observations_reply_out->observations,2000)
	detail
		x = x + 1
		if(mod(x,100) and x > 2000)
			stat = alterlist(ph_observations_reply_out->observations,x + 99)
		endif
 
 		; Clinical Event
		ph_observations_reply_out->observations[x].primary_key_id = ce.clinical_event_id
		ph_observations_reply_out->observations[x].observation_id = ce.event_id
		ph_observations_reply_out->observations[x].person_id = ce.person_id
		ph_observations_reply_out->observations[x].component_id = ce.event_cd
		ph_observations_reply_out->observations[x].component_desc = uar_get_code_display(ce.event_cd)
		ph_observations_reply_out->observations[x].result_date = ce.performed_dt_tm
		ph_observations_reply_out->observations[x].clinsig_updt_dt_tm = ce.clinsig_updt_dt_tm	;005
		ph_observations_reply_out->observations[x].observed_dt_tm = ce.event_end_dt_tm			;005
		ph_observations_reply_out->observations[x].update_dt_tm = ce.updt_dt_tm
		ph_observations_reply_out->observations[x].valid_from_date = ce.event_start_dt_tm
		ph_observations_reply_out->observations[x].result_val = ce.result_val
		ph_observations_reply_out->observations[x].normalcy_cd =ce.normalcy_cd
		ph_observations_reply_out->observations[x].normalcy_disp = uar_get_code_display(ce.normalcy_cd)
		ph_observations_reply_out->observations[x].normal_high = ce.normal_high
		ph_observations_reply_out->observations[x].normal_low = ce.normal_low
		ph_observations_reply_out->observations[x].order_id = ce.order_id
		ph_observations_reply_out->observations[x].result_status_cd = ce.result_status_cd
		ph_observations_reply_out->observations[x].result_status = uar_get_code_display(ce.result_status_cd)
		ph_observations_reply_out->observations[x].event_tag = ce.event_tag
		ph_observations_reply_out->observations[x].event_class_cd = ce.event_class_cd
		ph_observations_reply_out->observations[x].event_class_disp = uar_get_code_display(ce.event_class_cd)
		;ph_observations_reply_out->observations[x].string_result_text = ce.string_result_text
		ph_observations_reply_out->observations[x].unit_cd = ce.result_units_cd
		ph_observations_reply_out->observations[x].unit_disp = uar_get_code_display(ce.result_units_cd)
 		ph_observations_reply_out->observations[x].created_updated_date_time = ce.updt_dt_tm ;006
 
 		;CE Dynamic Label - observation group - 021
 		ph_observations_reply_out->observations[x].observation_group.id = cdl.result_set_id
 		if(cdl.long_text_id > 0)
 			ph_observations_reply_out->observations[x].observation_group.name = lt.long_text
 		else
 			ph_observations_reply_out->observations[x].observation_group.name = cdl.label_name
 		endif
 
		; Person Data
		ph_observations_reply_out->observations[x]->person->person_id = p.person_id
		ph_observations_reply_out->observations[x]->person->name_full_formatted = p.name_full_formatted
		ph_observations_reply_out->observations[x]->person->name_first = p.name_first
		ph_observations_reply_out->observations[x]->person->name_last = p.name_last
		ph_observations_reply_out->observations[x]->person->name_middle = p.name_middle
 		ph_observations_reply_out->observations[x]->person->mrn = pa.alias
 		ph_observations_reply_out->observations[x]->person->dob = p.birth_dt_tm ;013
 		ph_observations_reply_out->observations[x]->person->gender_id = p.sex_cd ;013
 		ph_observations_reply_out->observations[x]->person->gender_disp = uar_get_code_display(p.sex_cd);013
 		ph_observations_reply_out->observations[x]->person->sDOB =
 		datetimezoneformat(p.birth_dt_tm,p.birth_tz,"YYYY-MM-DD",curtimezonedef) ;018
 
		; Encounter Data
		ph_observations_reply_out->observations[x]->encounter->encounter_id = e.encntr_id
		ph_observations_reply_out->observations[x]->encounter->encounter_type_cd = e.encntr_type_cd
		ph_observations_reply_out->observations[x]->encounter->encounter_type_disp = uar_get_code_display(e.encntr_type_cd)
		ph_observations_reply_out->observations[x]->encounter->encounter_type_class_cd = e.encntr_type_class_cd
		ph_observations_reply_out->observations[x]->encounter->encounter_type_class_disp =
			uar_get_code_display(e.encntr_type_class_cd)
		ph_observations_reply_out->observations[x]->encounter->arrive_date = e.arrive_dt_tm
		if (e.arrive_dt_tm is null)
			ph_observations_reply_out->observations[x]->encounter->arrive_date = e.reg_dt_tm
		endif
		ph_observations_reply_out->observations[x]->encounter->discharge_date = e.disch_dt_tm
 		ph_observations_reply_out->observations[x]->encounter->fin_nbr = ea.alias
 
 		; Encounter Location data
 		ph_observations_reply_out->observations[x]->encounter->patient_location->location_cd = e.location_cd
 		ph_observations_reply_out->observations[x]->encounter->patient_location->location_disp = uar_get_code_display(e.location_cd)
  		ph_observations_reply_out->observations[x]->encounter->patient_location->loc_bed_cd = e.loc_bed_cd
 		ph_observations_reply_out->observations[x]->encounter->patient_location->loc_bed_disp = uar_get_code_display(e.loc_bed_cd)
		ph_observations_reply_out->observations[x]->encounter->patient_location->loc_building_cd = e.loc_building_cd
 		ph_observations_reply_out->observations[x]->encounter->patient_location->loc_building_disp =
 		 uar_get_code_display(e.loc_building_cd)
		ph_observations_reply_out->observations[x]->encounter->patient_location->loc_facility_cd = e.loc_facility_cd
 		ph_observations_reply_out->observations[x]->encounter->patient_location->loc_facility_disp =
 		 uar_get_code_display(e.loc_facility_cd)
		ph_observations_reply_out->observations[x]->encounter->patient_location->loc_nurse_unit_cd = e.loc_nurse_unit_cd
 		ph_observations_reply_out->observations[x]->encounter->patient_location->loc_nurse_unit_disp =
 		 uar_get_code_display(e.loc_nurse_unit_cd)
		ph_observations_reply_out->observations[x]->encounter->patient_location->loc_room_cd = e.loc_room_cd
 		ph_observations_reply_out->observations[x]->encounter->patient_location->loc_room_disp = uar_get_code_display(e.loc_room_cd)
		ph_observations_reply_out->observations[x]->encounter->patient_location->loc_temp_cd = e.loc_temp_cd
 		ph_observations_reply_out->observations[x]->encounter->patient_location->loc_temp_disp = uar_get_code_display(e.loc_temp_cd)
	foot report
		stat = alterlist(ph_observations_reply_out->observations,x)
	with nocounter, expand = value(exp)
 
	if(iDebugFlag > 0)
		call echo(concat("GetObservations Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
end
go
 
 
