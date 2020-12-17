/**********************************************************************
  
  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

***********************************************************************
          Date Written:       11/16/16
          Source file name:   vigilanz_get_pop_lab_res
          Object name:        vigilanz_get_pop_lab_res
          Program purpose:    Returns population lab results
          Tables read:		  CLINICAL_EVENT, PERSON, ENCOUNTER, ORDERS
          Tables updated:     NONE
          Executing from:     EMISSARY SERVICES
          Special Notes:	  NONE
***********************************************************************
                   GENERATED MODIFICATION CONTROL LOG
***********************************************************************
 Mod Date     Engineer             Comment
-----------------------------------------------------------------------
  000 11/16/16 DJP					Initial write
  001 12/27/16 DJP					Added error code for "Z" status, no data
  003 01/09/17 DJP					Added Patient Location Object; Removed Facility Object
  004 01/13/17 DJP					Change To Date to allow for blank input and default to
  									now minus 1 minute.. Required additional dt_tm variables
  005 01/25/17 DJP					Move Location object within Encounter
  006 01/26/17 DJP					Add Ordering Provider ID and NAME
  007 03/07/17 DJP					Added ErrorHandler 2 fields
  008 03/17/17 DJP					Add Max record check and error handling
  009 05/18/17 DJP					Added Gender/DOB to Person object
  010 07/10/17 DJP					UTC date/time code changes
  011 07/10/17 DJP 					Check for From Date > To Date
  012 07/27/17 JCO					Changed %i to execute; update ErrorHandler2
  013 03/21/18 RJC					Added version code and copyright block
  014 04/11/18 DJP					Added string Birthdate to person object
  015 06/07/18 DJP					Commented out MAXREC from all Selects
  016 06/22/18 RJC					Added Emissary Parent Event Set Parameter. Code cleanup
  017 07/18/18 RJC					Removed the code to default a parent_event_set if not provided
  018 07/31/18 RJC					Performance enhancements
  019 08/09/18 RJC					Changed max rec behavior. Max recs will no longer error out. It will return the max recs and
									once the limit is reached, it return all recs tied to the same second.
  020 08/14/18 RJC					Made expand clause variable depending on number of elements in record
  021 08/27/18 RJC					Added valid_until_dt_tm to query.
  022 08/29/18 STV                  Rework for nonutc environments and use of funtions for datetime
  023 10/18/18 RJC					Outerjoin on person_alias table
  024 01/07/19 STV                  switch mrn to encntr mrn
  025 01/15/19 RJC					Added lab_id, lab phone to payload; Added LOINC logic to look at ref_cd_map tables
  026 04/22/19 RJC					Performance and efficiency changes
  027 04/24/19 STV                  Adding 115 second timeout
  028 04/29/19 RJC					Performance changes
  002 09/09/19 RJC                  Renamed file and object
  031 09/09/19 KRD                  Added parser to check PARENT_EVENT_SET
   ***********************************************************************/
;drop program snsro_get_pop_lab_results go
drop program vigilanz_get_pop_lab_res go
create program vigilanz_get_pop_lab_res
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "User Name:" = ""				;REQUIRED
		, "From Date:" = ""				;REQUIRED
		, "To Date:" = ""				;Optional. No longer REQUIRED ;004
		, "Component IDS:" = ""			;Event cds of the lab component (Required)
		, "Facility_Code_List:" = ""	;OPTIONAL. List of location facility codes from code set 220.
		, "Parent Event Set" = ""		;OPTIONAL - this is the parameter passed from the emissarysettings file - 016
		, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
 		, "Time Max" = 3600				;DO NOT USE. Undocumented value to override maximum date range in seconds.
with OUTDEV, USERNAME, FROM_DATE, TO_DATE, COMPONENT_ID, LOC_LIST, PARENT_EVENT_SET, DEBUG_FLAG, TIME_MAX
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL changed to Emissary version ;013
**************************************************************************/
set sVersion = "1.21.6.2"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record lab_component_req
record lab_component_req (
	1 event_cds[*]
		2 event_cd						= f8
		2 source_identifier				= vc
)
 
free record loc_req
record loc_req (
	1 codes[*]
		2 code_value					= f8
		2 fac_identifier				= vc
)
 
free record pop_lab_results_reply_out
record pop_lab_results_reply_out (
	1 result_cnt						= i4
	1 lab_result[*]
		2 order_id              		= f8
		2 result_id 					= f8	; ce.event_id
	   	2 result_date					= dq8 	; ce.performed_dt_tm
	   	2 collected_date_time			= dq8
		2 result_value					= vc	; ce.result_val
		2 component_id     				= f8	; ce.event_cd
		2 component_desc       			= vc	; ce.event_cd (Disp)
		;2 ref_range					= vc	; ce.normal_low - ce.normal_high
		2 units_of_measure				= vc	; ce.result_units_cd
	    2 clinsig_updt_dt_tm			= dq8	; ce.clinsig_updt_dt_tm
		;2 clinical_display_line     	= vc	; ce.clinical_display_line
		2 result_status		       		= vc	; ce.result_status_cd (disp)
		2 normalcy						= vc	; ce.normalcy_cd (disp)
		2 flag							= vc    ; ce.normalcy_cd (disp)
		2 normal_high					= vc	; ce.normal_high
		2 normal_low					= vc	; ce.normal_low
		2 resource_cd					= f8	; ce.resource_cd
		;2 performed_prsnl_id			= f8	; ce.performed_prsnl_id
		;2 verified_prsnl_id			= f8	; ce.verified_prsnl_id
		2 ordering_provider_id			= f8  	;006
		2 ordering_provider_name 		= vc  	;006
		2 loinc_cd						= vc	; n.source_identifier
		2 created_updated_date_time		= dq8 	;ce.updt_dt_tm
		2 task_assay_cd					= f8
		2 location_cd					= f8
		2 result_note [*]
			3 note_body 				= gvc
			3 note_dt_tm 				= dq8
			3 note_format 				= vc
			3 note_provider_id 			= f8
			3 note_provider_name 		= vc
		2 lab_loc[*]
		  3 lab_id						= f8
	      3 lab_name 					= vc
	      3 address
	      	4 address_id 				= f8
	      	4 address_type_cd 			= f8
	      	4 address_type_disp			= vc
	      	4 address_type_mean 		= vc
	      	4 street_addr 				= vc
	      	4 street_addr2 				= vc
	      	4 city 						= vc
	      	4 state_cd 					= f8
	      	4 state_disp 				= vc
	      	4 state_mean 				= vc
	      	4 zipcode 					= vc
	      3 telephone					= vc
	    2 person
		  3 person_id 					= f8	;p.person_id
		  3 name_full_formatted 		= vc	;p.name_full_formatted
		  3 name_last 					= vc	;p.last_name
		  3 name_first 					= vc	;p.first_name
		  3 name_middle 				= vc	;p.middle_name
		  3 mrn							= vc    ;pa.alias
		  3 dob							= dq8	;009
		  3 gender_id					= f8 	;009
		  3 gender_disp					= vc  	;009
		  3 sDOB						= c10 	;014
	 	2 encounter
		  3 encounter_id 				= f8	;e.encntr_id
		  3 encounter_type_cd			= f8	;e.encntr_type_cd
		  3 encounter_type_disp			= vc	;encounter type display
		  3 encounter_type_class_cd		= f8	;encounter_type_class_cd
	      3 encounter_type_class_disp	= vc	;encounter type class display
 		  3 arrive_date					= dq8	;e.admit_dt_tm
 		  3 discharge_date				= dq8	;e.discharge_dt_tm
 		  3 fin_nbr						= vc	;ea.alias
 		  3 patient_location					;003;005
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
  1 status_data		;012
    2 status 							= c1
    2 subeventstatus[1]
      3 OperationName 					= c25
      3 OperationStatus 				= c1
      3 TargetObjectName 				= c25
      3 TargetObjectValue 				= vc
      3 Code 							= c4
      3 Description 					= vc
)
 
set pop_lab_results_reply_out->status_data->status = "F"
 
 /****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common	;012
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
set MODIFY MAXVARLEN 200000000 ;019
 
;Input
declare sUserName			= vc with protect, noconstant("")
declare sFromDate			= vc with protect, noconstant("")
declare sToDate				= vc with protect, noconstant("")
declare sComponents			= vc with protect, noconstant("")
declare sLocFacilities		= vc with protect,noconstant("")
declare dParentEventSetCd	= f8 with protect, noconstant(0.0)
declare iDebugFlag			= i2 with protect, noconstant(0)
declare iTimeMax			= i4 with protect, noconstant(0)
 
;Other
declare resultCnt 			= i4 with protect, noconstant (0)
declare qFromDateTime		= dq8 with protect, noconstant(CNVTDATETIME(CURDATE, CURTIME3));;004
declare qToDateTime			= dq8 with protect, noconstant(CNVTDATETIME(CURDATE, CURTIME3));;004
declare blob_in             = c69999 with noconstant(" ")
declare blob_out            = c69999 with noconstant(" ")
declare blob_out2           = c69999 with noconstant(" ")
declare blob_out3           = c69999 with noconstant(" ")
declare blob_ret_len        = i4 with noconstant(0)
declare ndx					= i4
declare ndx2				= i4
declare sLocationClause		= vc
declare sComponentClause	= vc
declare iMaxRecs			= i4 with protect, constant(2000) ;019
declare timeOutThreshold 	= i4 with protect, noconstant(115);setting to 115 seconds
declare queryStartTm 		= dq8
 
;Constants
declare c_glb_activity_type_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",106,"GLB"))
declare c_ordered_order_status_cd		= f8 with protect, constant(uar_get_code_by("MEANING",6004,"ORDERED"))
declare c_ocfcomp_compression_cd    	= f8 with protect, constant(UAR_GET_CODE_BY("MEANING",120,"OCFCOMP"))
declare c_loinc_vocabulary_cd			= f8 with protect, constant(UAR_GET_CODE_BY("MEANING",400,"LOINC"))
declare c_mrn_encounter_alias_type_cd	= f8 with protect, constant(uar_get_code_by("MEANING",319,"MRN"))
declare c_fin_encntr_alias_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",319,"FIN NBR"))
declare c_business_address_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",212,"BUSINESS"))			;014
declare c_micro_event_set_cd			= f8 with protect, constant(uar_get_code_by("DISPLAY_KEY",93,"MICROBIOLOGY")) 	;016
declare c_labresults_event_set_cd		= f8 with protect, constant(uar_get_code_by("DISPLAY_KEY",93,"LABORATORY"))		;017
declare c_business_phone_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",43,"BUSINESS"))
/*************************************************************************
;INITIALIZE
**************************************************************************/
;Input
set sUserName			= trim($USERNAME, 3)
set sFromDate			= trim($FROM_DATE, 3)
set sToDate				= trim($TO_DATE, 3)
set sComponents     	= trim($COMPONENT_ID, 3)
set sLocFacilities 		= trim($LOC_LIST,3)
set dParentEventSetCd  	= cnvtreal($PARENT_EVENT_SET) ;016
set iDebugFlag			= cnvtint($DEBUG_FLAG)
set iTimeMax			= cnvtint($TIME_MAX)
 
;Other
set qFromDateTime = GetDateTime(sFromDate)
set qToDateTime = GetDateTime(sToDate)
 
 
if(iDebugFlag > 0)
	call echo(build("sUserName  ->", sUserName))
	call echo(build("sComponents ->",sComponents))
	call echo(build("BEG_DATE -->",sFromDate))
	call echo(build("END_DATE -->",sToDate))
 	call echo(build("sToDate -> ",sToDate))
	call echo(build("qToDateTime -> ", qToDateTime))
	call echo(build ("DISPLAY END DT TIME",format(qToDateTime, "@LONGDATETIME")))
 	call echo(build("dParentEventSetCd -->",dParentEventSetCd)) ;016
endif
 
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ValidateParentEventSet(null)			= null with protect
declare CreateComponentList(null)				= null with protect
declare ParseLocations(sLocFacilities = vc)		= null with protect
declare GetLabResults(null)						= null with protect
declare GetCodingSystem(null)					= null with protect
declare GetOrderLabLocation(null)				= null with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Populate Audit
set iRet = PopulateAudit(sUserName, 0.0, pop_lab_results_reply_out, sVersion)   ;019    ;015
if(iRet = 0)  ;015
	call ErrorHandler2("VALIDATE", "F","POP_LABRESULTS", "Invalid User for Audit."
	,"1001",build2(" Invalid User for Audit."),pop_lab_results_reply_out) ;007
	go to EXIT_SCRIPT
endif
 
;Validate from date is not greater than to date ;011
if (qFromDateTime > qToDateTime)
	call ErrorHandler2("VALIDATE", "F", "POP_LABRESULTS", "From Date Greater than To Date. Refine Dates Entered.",
	"2010", "From Date Greater than To Date. Refine Dates Entered.", pop_lab_results_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate timespan doesn't exceed threshold
set iRet = ThreshHoldValidator(iTimeMax,"s",qFromDateTime,qToDateTime)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "POP_LABRESULTS", "Date Range Too Long. Refine Query.",
	"2011","Date Range Too Long. Refine Query.",pop_lab_results_reply_out) ;007
	go to EXIT_SCRIPT
endif
 
; Validate Parent Event Set
if(dParentEventSetCd > 0)
	call ValidateParentEventSet(null)
;else													;017 - Removed default parent_event_set
	;set dParentEventSetCd = c_labresults_event_set_cd
endif
 
; Create Component List
call CreateComponentList(null)
 
; Parse Locations if provided
if (sLocFacilities > " ")
	call ParseLocations(sLocFacilities)
endif
 
; Get Lab Results
call GetLabResults(null)
 
; Get Lab Result Notes
call GetResultNotes(null)
 
; Get Coding System
call GetCodingSystem(null)
 
; Get Lab Location
call GetOrderLabLocation(null)
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(pop_lab_results_reply_out)
if(iDebugFlag > 0)
 	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_pop_lab_results.json")
	call echo(build2("_file : ", _file))
	call echojson(pop_lab_results_reply_out, _file, 0)
	call echorecord(pop_lab_results_reply_out)
	call echo(JSONout)
endif
 
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
#EXIT_VERSION
 
/*************************************************************************
;  Name: ValidateParentEventSet(null) = null
;  Description:
**************************************************************************/
subroutine ValidateParentEventSet(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateParentEventSet Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	; Validate CodeSet
	set iRet = GetCodeSet(dParentEventSetCd)
	if(iRet != 93)
		call ErrorHandler2("VALIDATE", "F","POP_LABRESULTS", "Invalid parent event set code."
		,"2018",build2("Invalid parent event set code."),pop_lab_results_reply_out) ;007
		go to EXIT_SCRIPT
	endif
 
	; Ensure parent event cd isn't tied to any Micro results
	set microCheck = 0
 
	if(dParentEventSetCd = c_micro_event_set_cd)
		set microCheck = 1
	endif
 
	select into "nl:"
	from v500_event_set_canon vesc
	where vesc.parent_event_set_cd = c_micro_event_set_cd
		and vesc.event_set_cd = dParentEventSetCd
	detail
		microCheck = 1
	with nocounter
 
	if(microCheck)
		call ErrorHandler2("VALIDATE", "F","POP_LABRESULTS", "Microbiology is an invalid parent event set code for this endpoint."
		,"2018",build2("Invalid parent event set code."),pop_lab_results_reply_out) ;016
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("ValidateParentEventSet Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end ;End Sub
 
/*************************************************************************
;  Name: CreateComponentList(null)
;  Description: Subroutine to parse a comma delimited string
**************************************************************************/
subroutine CreateComponentList(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("CreateComponentList Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	; Create list based on input if provided
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	if(sComponents > " ")
 
		declare notfnd 		= vc with constant("<not_found>")
		declare num 		= i4 with noconstant(1)
		declare str 		= vc with noconstant("")
		declare size0fLab	= i4
		declare invalid 	= i4 with noconstant(0)
		declare micro_flag 	= i4 with noconstant(0)
		declare micro_str 	= vc
 
		if(sComponents != "")
			while (str != notfnd)
		     	set str =  piece(sComponents,',',num,notfnd)
		     	if(str != notfnd)
		     		if(GetCodeSet(cnvtreal(str)) = 72)
		     			set stat = alterlist(lab_component_req->event_cds, num)
		     			set lab_component_req->event_cds[num]->event_cd = cnvtreal(str)
		     		else
		     			call ErrorHandler2("VALIDATE", "F", "POP_LABRESULTS", build2("Invalid event code: ",str),
						"2018", build2("Invalid event code: ",str), pop_lab_results_reply_out)
						go to EXIT_SCRIPT
					endif
		     	endif
		     	set num = num + 1
			endwhile
           ;031
			if(dParentEventSetCd > 0)
				set sEventSet = "vexp.event_set_cd =  dParentEventSetCd "
			else
				set sEventSet = "vexp.event_set_cd > 0 "
			endif
 
		 	; Check if the event code is allowed by parent event restriction. Check for micro results
		 	for(i = 1 to size(lab_component_req->event_cds,5))
			 	set check = 0
		    	select into "nl:"
				from v500_event_set_explode vexp
					,v500_event_set_explode vese
			 	plan vexp where vexp.event_cd = lab_component_req->event_cds[i]->event_cd
					;and vexp.event_set_cd =  dParentEventSetCd
					and parser(sEventSet)
				join vese where  vese.event_cd = vexp.event_cd
				;call echo(sEventSet)
			 	detail
			 		check = 1
					if (vese.event_set_cd = c_micro_event_set_cd)
			 			micro_flag = 1
			 			micro_str = cnvtstring(lab_component_req->event_cds[i]->event_cd)
					endif
			 	with nocounter
 
			 	if(check > 0)
					if (micro_flag = 1)
						call ErrorHandler2("VALIDATE", "F", "POP_LABRESULTS", build2("Invalid Code: ",micro_str," Please use Gen Lab Events Only."),
						"2018", build2("Invalid Code: ",micro_str," Please use Gen Lab Events Only."), pop_lab_results_reply_out) ;007
						go to EXIT_SCRIPT
				 	endif
				 else
				 	call ErrorHandler2("VALIDATE", "F", "POP_LABRESULTS", build2("Invalid code: ",lab_component_req->event_cds[i]->event_cd,
				 	". Code not a part of parent event set: ", cnvtstring(dParentEventSetCd)),
					"2018", build2("Invalid code: ",lab_component_req->event_cds[i]->event_cd,
					". Code not a part of parent event set: ", cnvtstring(dParentEventSetCd)), pop_lab_results_reply_out) ;016
					go to EXIT_SCRIPT
				 endif
			endfor
		endif
	;Create list based on parent event set code and filter micro results
	else
		select into "nl:"
		from v500_event_set_explode vexp
		where vexp.event_set_cd = dParentEventSetCd
 
		;Microbiology result filtering to be used later
		;and vexp.event_cd not in (select v2.event_cd from v500_event_set_explode v2
									;where v2.event_set_cd = c_micro_event_set_cd)
		head report
			x = 0
			stat = alterlist(lab_component_req->event_cds,5000)
		detail
			x = x + 1
 
			if(mod(x,100) = 1 and x > 5000)
				stat = alterlist(lab_component_req->event_cds,x + 99)
			endif
 
			lab_component_req->event_cds[x].event_cd = vexp.event_cd
		foot report
			stat = alterlist(lab_component_req->event_cds,x)
		with nocounter
	endif
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("CreateComponentList Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: ParseLocations(sLocFacilties = vc)
;  Description: Subroutine to parse a comma delimited string
**************************************************************************/
subroutine ParseLocations(sLocFacilities)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ParseLocations Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare notfnd 		= vc with constant("<not_found>")
	declare num 		= i4 with noconstant(1)
	declare str 		= vc with noconstant("")
 
	if(cnvtstring(sLocFacilities) != "")
		while (str != notfnd)
	     	set str =  piece(sLocFacilities,',',num,notfnd)
	     	if(str != notfnd)
	      		set stat = alterlist(loc_req->codes, num)
	     		set loc_req->codes[num]->code_value = cnvtint(str)
 
	     		 select into code_value
	     		 from code_value
				 where code_set = 220 and cdf_meaning = "FACILITY" and
				 loc_req->codes[num]->code_value = code_value              ;003
 
	     		if (curqual = 0)
	     			call ErrorHandler2("VALIDATE", "F", "POP_LABRESULTS", build2("Invalid Facility Code: ", loc_req->codes[num]->code_value),
					"2040", build2("Invalid Facility Code: ",loc_req->codes[num]->code_value),pop_lab_results_reply_out) ;007
					go to Exit_Script
				endif  ;003
	      	endif
	      	set num = num + 1
	 	endwhile
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("ParseLocations Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetLabResults(null)
;  Description: Subroutine to get Lab Results by Order ID
**************************************************************************/
subroutine GetLabResults(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetLabResults Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	; Set component where clause
	set iLocFacCnt = size(loc_req->codes,5)
	set iCompCnt = size(lab_component_req->event_cds,5)
 
	if(dParentEventSetCd > 0)
		set sEventClause = " expand(ndx,1,iCompCnt,ce.event_cd,lab_component_req->event_cds[ndx].event_cd)"
	else
		set sEventClause = " ce.event_cd > 0"
	endif
 
	;Set expand control value - 020
	if(iCompCnt > 200 or iLocFacCnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	; Populate temp record - performance improvement
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select
		if(iLocFacCnt > 0)
			from clinical_event ce
				,encounter e
				,orders o
			plan ce where ce.updt_dt_tm >= cnvtdatetime(qFromDateTime)
				and ce.updt_dt_tm <= cnvtdatetime(qToDateTime)
				and ce.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)	;021
				and parser(sEventClause)
			join o where ce.order_id = outerjoin(o.order_id) ;006
				and o.activity_type_cd = outerjoin(c_glb_activity_type_cd) ;006
			join e where e.encntr_id = ce.encntr_id
				and expand(ndx2,1,iLocFacCnt,e.loc_facility_cd,loc_req->codes[ndx2].code_value)
			order by ce.updt_dt_tm
		else
			from clinical_event ce
			,orders o
			plan ce where ce.updt_dt_tm >= cnvtdatetime(qFromDateTime)
				and ce.updt_dt_tm <= cnvtdatetime(qToDateTime)
				and ce.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)	;021
				and parser(sEventClause)
			join o where ce.order_id = outerjoin(o.order_id) ;006
				and o.activity_type_cd = outerjoin(c_glb_activity_type_cd) ;006
			order by ce.updt_dt_tm, ce.event_id
		endif
	into "nl:"
	head report
		x = 0
		max_reached = 0
		stat = alterlist(pop_lab_results_reply_out->lab_result,iMaxRecs)
	head ce.updt_dt_tm
		if(x > iMaxRecs)
			max_reached = 1
		endif
	head ce.event_id
		if(max_reached = 0)
			x = x + 1
			if(mod(x,100) = 1 and x > iMaxRecs)
				stat = alterlist(pop_lab_results_reply_out->lab_result,x + 99)
			endif
 
			pop_lab_results_reply_out->lab_result[x]->result_id = ce.event_id
			pop_lab_results_reply_out->lab_result[x]->order_id = ce.order_id
			pop_lab_results_reply_out->lab_result[x]->result_date = ce.performed_dt_tm
			pop_lab_results_reply_out->lab_result[x]->collected_date_time = ce.event_start_dt_tm
			pop_lab_results_reply_out->lab_result[x]->result_value = ce.result_val
			pop_lab_results_reply_out->lab_result[x]->component_id = ce.event_cd
			pop_lab_results_reply_out->lab_result[x]->component_desc =  uar_get_code_display(ce.event_cd)
			pop_lab_results_reply_out->lab_result[x]->units_of_measure = uar_get_code_display(ce.result_units_cd)
			pop_lab_results_reply_out->lab_result[x]->clinsig_updt_dt_tm = ce.clinsig_updt_dt_tm	  ;013
			pop_lab_results_reply_out->lab_result[x]->result_status =  uar_get_code_display(ce.result_status_cd)
		 	pop_lab_results_reply_out->lab_result[x]->normalcy = uar_get_code_meaning(ce.normalcy_cd)  ;012
		 	pop_lab_results_reply_out->lab_result[x]->flag = uar_get_code_meaning(ce.normalcy_cd)
		 	pop_lab_results_reply_out->lab_result[x]->resource_cd = ce.resource_cd
			pop_lab_results_reply_out->lab_result[x]->normal_high = ce.normal_high
			pop_lab_results_reply_out->lab_result[x]->normal_low = ce.normal_low
			pop_lab_results_reply_out->lab_result[x]->created_updated_date_time = ce.updt_dt_tm
			pop_lab_results_reply_out->lab_result[x].task_assay_cd = ce.task_assay_cd
			pop_lab_results_reply_out->lab_result[x].resource_cd = ce.resource_cd
			pop_lab_results_reply_out->lab_result[x].person.person_id = ce.person_id
			pop_lab_results_reply_out->lab_result[x].encounter.encounter_id = ce.encntr_id
		endif
	foot report
		stat = alterlist(pop_lab_results_reply_out->lab_result,x)
		pop_lab_results_reply_out->result_cnt = x
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	if(iDebugFlag)
 		call echo(build2("Initial results: ",datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)))
 	endif
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag)
 		call echo(build("------Qual Cnt = ",pop_lab_results_reply_out->result_cnt))
	endif
 
	; Populate audit
	if(pop_lab_results_reply_out->result_cnt > 0)
		call ErrorHandler("EXECUTE", "S", "POP_LABRESULTS", "Success", pop_lab_results_reply_out)
	else
		call ErrorHandler("EXECUTE", "Z", "POP_LABRESULTS", "No records qualify.", pop_lab_results_reply_out)
		go to exit_script
	endif
 
	;Set expand control value - 020
	set idx = 1
	if(pop_lab_results_reply_out->result_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	; Person Data
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from person p
	plan p where expand(idx,1,pop_lab_results_reply_out->result_cnt,p.person_id,
		pop_lab_results_reply_out->lab_result[idx].person.person_id)
	detail
		next = 1
		pos = locateval(idx,next,pop_lab_results_reply_out->result_cnt,p.person_id,
		pop_lab_results_reply_out->lab_result[idx].person.person_id)
 
 		while(pos > 0 and next <= pop_lab_results_reply_out->result_cnt)
			pop_lab_results_reply_out->lab_result[pos]->person->person_id = p.person_id
			pop_lab_results_reply_out->lab_result[pos]->person->name_full_formatted = p.name_full_formatted
			pop_lab_results_reply_out->lab_result[pos]->person->name_first = p.name_first
			pop_lab_results_reply_out->lab_result[pos]->person->name_last = p.name_last
			pop_lab_results_reply_out->lab_result[pos]->person->name_middle = p.name_middle
	 		pop_lab_results_reply_out->lab_result[pos]->person->dob = p.birth_dt_tm ;009
	 		pop_lab_results_reply_out->lab_result[pos]->person->gender_id = p.sex_cd ;009
	 		pop_lab_results_reply_out->lab_result[pos]->person->gender_disp = uar_get_code_display(p.sex_cd);009
	 		pop_lab_results_reply_out->lab_result[pos]->person->sDOB =
	 		datetimezoneformat(p.birth_dt_tm,p.birth_tz,"YYYY-MM-DD",curtimezonedef); 014
 
 			next = pos + 1
			pos = locateval(idx,next,pop_lab_results_reply_out->result_cnt,p.person_id,
			pop_lab_results_reply_out->lab_result[idx].person.person_id)
		endwhile
	with nocounter, separator=" ", format, expand = value(exp), time = value(timeOutThreshold) ;015
 
	if(iDebugFlag)
 		call echo(build2("Person data: ",datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)))
 	endif
 
 	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	; Encounter Data
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from encounter e
		, encntr_alias ea
		, encntr_alias ea2
	plan e where expand(idx,1,pop_lab_results_reply_out->result_cnt,e.encntr_id,
		pop_lab_results_reply_out->lab_result[idx].encounter.encounter_id)
	join ea where ea.encntr_id = outerjoin(e.encntr_id)
		and ea.encntr_alias_type_cd = outerjoin(c_fin_encntr_alias_type_cd)
		and ea.active_ind = outerjoin(1)
		and ea.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		and ea.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
	join ea2 where ea2.encntr_id = outerjoin(e.encntr_id)
		and ea2.encntr_alias_type_cd = outerjoin(c_mrn_encounter_alias_type_cd)
		and ea2.active_ind = outerjoin(1)
		and ea2.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		and ea2.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
	detail
		next = 1
		pos = locateval(idx,next,pop_lab_results_reply_out->result_cnt,e.encntr_id,
		pop_lab_results_reply_out->lab_result[idx].encounter.encounter_id)
 
		while(pos > 0 and next <= pop_lab_results_reply_out->result_cnt)
 
	 		;MRN
	 		pop_lab_results_reply_out->lab_result[pos]->person->mrn = ea2.alias
 
			;Encounter Data
			pop_lab_results_reply_out->lab_result[pos]->encounter->encounter_id = e.encntr_id
			pop_lab_results_reply_out->lab_result[pos]->encounter->encounter_type_cd = e.encntr_type_cd
			pop_lab_results_reply_out->lab_result[pos]->encounter->encounter_type_disp = uar_get_code_display(e.encntr_type_cd)
			pop_lab_results_reply_out->lab_result[pos]->encounter->encounter_type_class_cd = e.encntr_type_class_cd
			pop_lab_results_reply_out->lab_result[pos]->encounter->encounter_type_class_disp =
			uar_get_code_display(e.encntr_type_class_cd)
			pop_lab_results_reply_out->lab_result[pos]->encounter->arrive_date = e.arrive_dt_tm
			if (e.arrive_dt_tm is null)
				pop_lab_results_reply_out->lab_result[pos]->encounter->arrive_date = e.reg_dt_tm
			endif
			pop_lab_results_reply_out->lab_result[pos]->encounter->discharge_date = e.disch_dt_tm
		 	pop_lab_results_reply_out->lab_result[pos]->encounter->fin_nbr = ea.alias
 
			;Patient Location Data
	 		pop_lab_results_reply_out->lab_result[pos]->encounter->patient_location->location_cd = e.location_cd
	 		pop_lab_results_reply_out->lab_result[pos]->encounter->patient_location->location_disp =
	 			uar_get_code_display(e.location_cd)
	  		pop_lab_results_reply_out->lab_result[pos]->encounter->patient_location->loc_bed_cd = e.loc_bed_cd
	 		pop_lab_results_reply_out->lab_result[pos]->encounter->patient_location->loc_bed_disp = uar_get_code_display(e.loc_bed_cd)
			pop_lab_results_reply_out->lab_result[pos]->encounter->patient_location->loc_building_cd = e.loc_building_cd
	 		pop_lab_results_reply_out->lab_result[pos]->encounter->patient_location->loc_building_disp =
	 			uar_get_code_display(e.loc_building_cd)
			pop_lab_results_reply_out->lab_result[pos]->encounter->patient_location->loc_facility_cd = e.loc_facility_cd
	 		pop_lab_results_reply_out->lab_result[pos]->encounter->patient_location->loc_facility_disp =
	 			uar_get_code_display(e.loc_facility_cd)
			pop_lab_results_reply_out->lab_result[pos]->encounter->patient_location->loc_nurse_unit_cd = e.loc_nurse_unit_cd
	 		pop_lab_results_reply_out->lab_result[pos]->encounter->patient_location->loc_nurse_unit_disp =
	 			uar_get_code_display(e.loc_nurse_unit_cd)
			pop_lab_results_reply_out->lab_result[pos]->encounter->patient_location->loc_room_cd = e.loc_room_cd
	 		pop_lab_results_reply_out->lab_result[pos]->encounter->patient_location->loc_room_disp =
	 			uar_get_code_display(e.loc_room_cd)
			pop_lab_results_reply_out->lab_result[pos]->encounter->patient_location->loc_temp_cd = e.loc_temp_cd
	 		pop_lab_results_reply_out->lab_result[pos]->encounter->patient_location->loc_temp_disp =
	 			uar_get_code_display(e.loc_temp_cd)
 
	 		next = pos + 1
			pos = locateval(idx,next,pop_lab_results_reply_out->result_cnt,e.encntr_id,
			pop_lab_results_reply_out->lab_result[idx].encounter.encounter_id)
		endwhile
	with nocounter, separator=" ", format, expand = value(exp), time = value(timeOutThreshold) ;015
 
 	if(iDebugFlag)
 		call echo(build2("Encounter data: ",datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)))
 	endif
 
 	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	; Ordering Provider Data
	if( pop_lab_results_reply_out->result_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from order_action oa
		, prsnl pr
	plan oa where expand(idx,1,pop_lab_results_reply_out->result_cnt,oa.order_id,pop_lab_results_reply_out->lab_result[idx].order_id)
		and oa.order_status_cd = c_ordered_order_status_cd
	join pr where oa.order_provider_id = pr.person_id
	detail
		next = 1
		pos = locateval(idx,next,pop_lab_results_reply_out->result_cnt,oa.order_id,pop_lab_results_reply_out->lab_result[idx].order_id)
 
 		while(pos > 0 and next <= pop_lab_results_reply_out->result_cnt)
			;Order Action
			pop_lab_results_reply_out->lab_result[pos]->ordering_provider_id = oa.order_provider_id ;006
			pop_lab_results_reply_out->lab_result[pos]->ordering_provider_name = pr.name_full_formatted ;006
 
			next = pos + 1
			pos = locateval(idx,next,pop_lab_results_reply_out->result_cnt,oa.order_id,pop_lab_results_reply_out->lab_result[idx].order_id)
 		endwhile
	with nocounter, separator=" ", format, expand = value(exp), time = value(timeOutThreshold) ;015
 
 	if(iDebugFlag)
 		call echo(build2("Ordering provider data: ",datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)))
 	endif
 
 	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetLabResults Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end ;End Sub
 
/*************************************************************************
;  Name: GetResultNotes(null)
;  Description: Subroutine to retrieve result notes
**************************************************************************/
subroutine GetResultNotes(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetResultNotes Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set result_cnt = size(pop_lab_results_reply_out->lab_result,5)
 	set idx  = 1
 
 	if(result_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from ce_event_note cen
		, long_blob lb
		, prsnl pr
	plan cen where expand(idx,1,result_cnt,cen.event_id,pop_lab_results_reply_out->lab_result[idx].result_id)
		and cen.event_id > 0
	join lb where lb.parent_entity_id = cen.ce_event_note_id
		and lb.parent_entity_name = "CE_EVENT_NOTE"
	join pr where pr.person_id  = cen.note_prsnl_id
		and pr.active_ind = 1
	order by cen.event_id
	head cen.event_id
		cenCnt = 0
		pos = locateval(idx,1,result_cnt,cen.event_id,pop_lab_results_reply_out->lab_result[idx].result_id)
	head cen.event_note_id
		cenCnt = cenCnt + 1
 		stat = alterlist(pop_lab_results_reply_out->lab_result[pos]->result_note, cenCnt)
 
		pop_lab_results_reply_out->lab_result[pos]->result_note[cenCnt]->note_format =
			uar_get_code_display(cen.note_format_cd)
		pop_lab_results_reply_out->lab_result[pos]->result_note[cenCnt]->note_dt_tm = cen.note_dt_tm
		pop_lab_results_reply_out->lab_result[pos]->result_note[cenCnt]->note_provider_id = pr.person_id
		pop_lab_results_reply_out->lab_result[pos]->result_note[cenCnt]->note_provider_name = pr.name_full_formatted
 
		blob_out = ""
 
    	if( cen.compression_cd = c_ocfcomp_compression_cd )
    		blob_in = lb.long_blob
        	call uar_ocf_uncompress( blob_in, 69999, blob_out, 69999, blob_ret_len )
        	pop_lab_results_reply_out->lab_result[pos]->result_note[cenCnt]->note_body = blob_out
    	else
        	blob_in = replace(lb.long_blob, "ocf_blob", "",2)
        	call uar_rtf2( blob_in, size(blob_in), blob_out, 69999, blob_ret_len, 1 )
       		pop_lab_results_reply_out->lab_result[pos]->result_note[cenCnt]->note_body = blob_out
    	endif
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
 	if(iDebugFlag)
 		call echo(build2("Result notes: ",datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)))
 	endif
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetResultNotes Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetCodingSystem(null)
;  Description: Subroutine to retrieve coding system and value
**************************************************************************/
subroutine GetCodingSystem(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetCodingSystem Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set result_cnt = size(pop_lab_results_reply_out->lab_result,5)
 	set idx  = 1
 
 	if(result_cnt > 100)
		set exp = 2
	else
		set exp = 0
	endif
 
 	; Check for LOINC to be mapped
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from concept_identifier_dta ci
		,nomenclature n
	plan ci where expand(idx,1,result_cnt,ci.task_assay_cd,pop_lab_results_reply_out->lab_result[idx].task_assay_cd,
						ci.service_resource_cd, pop_lab_results_reply_out->lab_result[idx].resource_cd)
		and ci.active_ind = 1
		and ci.concept_type_flag = 1 ;LOINC analyte code
	join n where n.concept_cki = ci.concept_cki
		and n.source_vocabulary_cd = c_loinc_vocabulary_cd
	detail
		next = 1
		pos = locateval(idx,next,result_cnt,ci.task_assay_cd,pop_lab_results_reply_out->lab_result[idx].task_assay_cd)
		while(pos > 0 and next <= result_cnt)
			pop_lab_results_reply_out->lab_result[pos]->loinc_cd = n.source_identifier
 
			next = pos + 1
			pos = locateval(idx,next,result_cnt,ci.task_assay_cd,pop_lab_results_reply_out->lab_result[idx].task_assay_cd)
		endwhile
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
 	if(iDebugFlag)
 		call echo(build2("Mapped LOINC: ",datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)))
 	endif
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(result_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
 	;Check for LOINC to be tied to patient result
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
 	select into "nl:"
 	from ref_cd_map_header rmh
 		, ref_cd_map_detail rmd
 		, nomenclature n
 	plan rmh where expand(idx,1,result_cnt,rmh.event_id, pop_lab_results_reply_out->lab_result[idx].result_id)
 	join rmd where rmd.ref_cd_map_header_id = rmh.ref_cd_map_header_id
 	join n where n.nomenclature_id = rmd.nomenclature_id
 	detail
 		pos = locateval(idx,1,result_cnt,rmh.event_id, pop_lab_results_reply_out->lab_result[idx].result_id)
 		if(pop_lab_results_reply_out->lab_result[pos].loinc_cd = "")
 			pop_lab_results_reply_out->lab_result[pos].loinc_cd = n.source_identifier
 		endif
 	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
 	if(iDebugFlag)
 		call echo(build2("Patient Result LOINC: ",datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)))
 	endif
 
 	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetCodingSystem Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
/***************************************************************************
;  Name: GetOrderLabLocation (null) - 014
;  Description: Take a list of lab orders and retrieve the lab location
**************************************************************************/
subroutine GetOrderLabLocation(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetOrderLabLocation Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	declare phone_num = vc
	set locationCd = 0
	set addressCnt = 0
	set resultCnt = 0
	set result_cnt = size(pop_lab_results_reply_out->lab_result,5)
 	set idx  = 1
 
 	if(result_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
 	; Check service resource
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from service_resource sr
	where expand(idx,1,result_cnt,sr.service_resource_cd,pop_lab_results_reply_out->lab_result[idx]->resource_cd)
	detail
		next = 1
		pos = locateval(idx,next,result_cnt,sr.service_resource_cd,pop_lab_results_reply_out->lab_result[idx]->resource_cd)
		while(pos > 0 and next <= result_cnt)
			pop_lab_results_reply_out->lab_result[pos].location_cd = sr.location_cd
			next = pos + 1
			pos = locateval(idx,next,result_cnt,sr.service_resource_cd,pop_lab_results_reply_out->lab_result[idx]->resource_cd)
		endwhile
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
 	if(iDebugFlag)
 		call echo(build2("Lab Resource data: ",datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)))
 	endif
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	;Address
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from address a
		, phone p
	plan a where expand(idx,1,result_cnt,a.parent_entity_id,pop_lab_results_reply_out->lab_result[idx].location_cd)
		and a.parent_entity_name = "LOCATION"
		and a.parent_entity_id > 0
		and a.address_type_cd = c_business_address_type_cd
		and a.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and a.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
		and a.active_ind = 1
		and a.address_id != 0
	join p where p.parent_entity_name = outerjoin("LOCATION")
		and p.parent_entity_id = outerjoin(a.parent_entity_id)
		and p.phone_type_cd = outerjoin(c_business_phone_type_cd)
		and p.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		and p.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
		and p.active_ind = outerjoin(1)
		and p.phone_id > outerjoin(0)
	head report
		addressCnt = 0
	head a.address_id
		addressCnt = addressCnt + 1
		next = 1
		x = locateval(idx,next,result_cnt,a.parent_entity_id,pop_lab_results_reply_out->lab_result[idx].location_cd)
 
		while(x > 0 and next <= result_cnt)
			stat = alterlist(pop_lab_results_reply_out->lab_result[x]->lab_loc, addressCnt)
 
	 		pop_lab_results_reply_out->lab_result[x]->lab_loc[addresscnt]->lab_id = pop_lab_results_reply_out->lab_result[x]->resource_cd
			pop_lab_results_reply_out->lab_result[x]->lab_loc[addresscnt]->lab_name = uar_get_code_display(a.parent_entity_id)
			pop_lab_results_reply_out->lab_result[x]->lab_loc[addresscnt]->address->address_id = a.address_id
			pop_lab_results_reply_out->lab_result[x]->lab_loc[addresscnt]->address->address_type_cd = a.address_type_cd
			pop_lab_results_reply_out->lab_result[x]->lab_loc[addresscnt]->address->address_type_disp =
				uar_get_code_display(a.address_type_cd)
			pop_lab_results_reply_out->lab_result[x]->lab_loc[addresscnt]->address->street_addr = a.street_addr
			pop_lab_results_reply_out->lab_result[x]->lab_loc[addresscnt]->address->street_addr2 = a.street_addr2
			pop_lab_results_reply_out->lab_result[x]->lab_loc[addresscnt]->address->city = a.city
			pop_lab_results_reply_out->lab_result[x]->lab_loc[addresscnt]->address->state_cd = a.state_cd
			pop_lab_results_reply_out->lab_result[x]->lab_loc[addresscnt]->address->state_disp = uar_get_code_display(a.state_cd)
			pop_lab_results_reply_out->lab_result[x]->lab_loc[addresscnt]->address->zipcode = a.zipcode
			pop_lab_results_reply_out->lab_result[x]->lab_loc[addresscnt]->telephone = p.phone_num
 
			next = x + 1
			x = locateval(idx,next,result_cnt,a.parent_entity_id,pop_lab_results_reply_out->lab_result[idx].location_cd)
		endwhile
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
 	if(iDebugFlag)
 		call echo(build2("Lab Loc Address-Phone: ",datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)))
 	endif
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
 
	if(iDebugFlag > 0)
		call echo(concat("GetOrderLabLocation Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
end
go