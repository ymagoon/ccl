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
  ~BE~***********************************************************************/
  /****************************************************************************
      Source file name:     snsro_get_pop_medadmins.prg
      Object name:          snsro_get_pop_medadmins
      Program purpose:      Retrieve medication administrations from CLINICAL_EVENT based on
      						date range parameters.
      Tables read:			CLINICAL_EVENT, CE_MED_RESULT, PERSON, ENCOUNTER, PRSNL
      Tables updated:       NONE
      Executing from:       Emissary Service
      Special Notes:      	This population query will check for maximum records
      						and a maximum date range and if those are exceeded
      						a failure status and message will get returned.
******************************************************************************/
/***********************************************************************
                     MODIFICATION CONTROL LOG
***********************************************************************
Mod Date     	Engineer	Comment
----  -------- 	  --------	----------------------------------
000 09/01/16 DJP          	Initial write
001 12/12/16 DJP			Added Facility object,_updated date/time,
							administration status and reason not administered
							fixed NDC routine to use variables for med identifier type
							and pharmacy type
002 12/27/16 DJP			Added error code for "Z" status, no data
003 01/09/17 DJP			Added Patient Location Object; Removed Facility Object
004 01/12/17 DJP			Changed End Time from Required to Optional
								Default "" to Now minus 1 minute
005 01/25/17 DJP			Moved Location Object to within Encounter Object
006 01/26/17 DJP			Fix Medication Ordering Provider ID and NAME
007 01/31/17 DJP			Added Med Admins Comments(RESULT_NOTE)
008 03/06/17 DJP			Added ErrorHandler2 Fields
009 05/18/17 AAB 			Fixed ingredients
010 05/19/17 DJP			Added Gender/DOB to Person object
011 06/06/17 AAB 			Move Order_Ingredient to under MedAdmin object
011 07/10/17 DJP			UTC date/time code changes
012 07/10/17 DJP 			Check for From Date > To Date
023 07/25/17 DJP			Remove med given restriction from query
024 07/26/17 DJP			Added condition to pop order id with
							template order id when template flag > 1
025 07/31/17 DJP			change CreatedUpdatedDateTime to mae.updt_dt_tm
026 08/16/17 DJP			Changed %i to execute; updated ErrorHandler
027 10/05/17 DJP			Removed restriction for event_class_cd
028 03/22/18 RJC			Added version code and copyright block
029 04/11/18 DJP			Added string Birthdate to person object
030 06/11/18 DJP			Comment out MAXREC on Selects
031 07/03/18 RJC			Performance improvement and code cleanup
032 07/31/18 RJC			Performance improvement with encounter filtering
033 08/09/18 RJC			Changed max rec behavior. Max recs will no longer error out. It will return the max recs and
							once the limit is reached, it return all recs tied to the same second.
034 08/13/18 RJC			Created updated dttm changed to be ce.updt_dt_tm
035 08/14/18 RJC			Made expand clause variable depending on number of elements in record
036 08/27/18 RJC			Added valid_until_dt_tm to query.
038 08/29/18 STV            Added rework for non utc environments
039 10/18/18 RJC			Outerjoin on person_alias table
***********************************************************************/
drop program snsro_get_pop_medadmins go
create program snsro_get_pop_medadmins
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Username:" = ""  			;REQUIRED. Valid HNA Millennium user account.
	, "Beg Date:" = ""				;REQUIRED. Beginning of bookmark date range.
	, "End Date:" = ""				;OPTIONAL. No longer REQUIRED. End of bookmark date range. ;004
	, "Event Code List:" = ""		;OPTIONAL. List of event codes from code set 72/93.
	, "Include Rx Norm:" = 0    	;OPTIONAL.
	, "Include NDC:" = 0			;OPTIONAL.
	, "Facility_Code_List" = ""		;OPTIONAL. List of location facility codes from code set 220.
	, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
	, "Time Max" = 3600			;DO NOT USE. Undocumented value to override maximum date range in seconds.
 
with OUTDEV, USERNAME, BEG_DATE, END_DATE, EC_LIST, INC_RX_NORM, INC_NDC, LOC_LIST, DEBUG_FLAG, TIME_MAX
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL changed to Emissary version ;028
**************************************************************************/
set sVersion = "1.16.6.1"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record pop_medadmins_reply_out
record pop_medadmins_reply_out	(
	1 medadmins_count								= i4
	1 medadmins [*]
	  2 parent_event_id								= f8    ;ce.parent_event_id
	  2 event_title_text							= vc	;ce.event_title_text
	  2 primary_key_id 								= f8 	;ce.clinical_event_id
	  2 medadmin_id		    						= f8 	;ce.event_id
      2 person_id 									= f8	;ce.person_id
	  2 component_id     							= f8	;ce.event_cd
	  ;2 component_desc       						= vc	;ce.event_cd (display)
      2 result_date									= dq8 	;ce.performed_dt_tm
	  2 clinsig_updt_dt_tm							= dq8	;ce.clinsig_updt_dt_tm
	 ; 2 observed_dt_tm								= dq8   ;ce.event_end_dt_tm
	  2 update_dt_tm								= dq8	;ce.updt_dt_tm
      2 valid_from_date 							= dq8	;ce.valid_from_dt_tm
     ; 2 result_val 								= vc	;ce.result_val
     ; 2 normalcy_cd 								= f8	;ce.normlacy_cd
	 ; 2 normalcy_disp 								= vc	;normalcy display
	 ; 2 normal_high								= vc	;ce.normal_high
	 ; 2 normal_low									= vc	;ce.normal_low
      2 order_id 									= f8	;ce.order_id
      2 catalog_cd									= f8	;ce.catalog_cd
      2 result_status_cd 							= f8	;ce.result_status_cd
	  2 result_status	 							= vc	;result status display
      2 event_tag 									= vc	;ce.event_tag
      2 event_class_cd 								= f8	;ce.event_class_cd
	  2 event_class_disp 							= vc	;event class display
     ; 2 string_result_text							= vc	;ce.string_result_text
     ; 2 calc_result_text 							= vc	;ce.calc_result_text
     ; 2 date_result 								= dq8	;ce.date_result_dt_tm
     ; 2 date_result_type 							= i2	;ce.date_result_type
    ; 2 date_result_tz 	  							= i4	;ce.date_result_tz
      2 unit_cd 									= f8	;ce.unit_cd
	  2 unit_disp 									= vc	;unit code display
     ; 2 collating_seq 								= vc	;ce.collating_seq
      2 admin_note									= vc    ;cmr.admin_note
      2 admin_prov_id 								= f8
	  2 admin_provider 								= vc
	  2 admin_start_dt_tm 							= dq8
	  2 admin_end_dt_tm 							= dq8
	  2 admin_route_cd 								= f8
      2 admin_route_disp 							= vc
	  2 admin_site_cd 								= f8
	  2 admin_site_disp 							= vc
	  2 admin_method_cd 							= f8
	  2 admin_method_disp 							= vc
	  2 admin_pt_loc_cd 							= f8
	  2 admin_pt_loc_disp 							= vc
	  2 initial_dosage 								= f8
	  2 admin_dosage 								= f8
	  2 dosage_unit_cd 								= f8
	  2 dosage_unit_disp 							= vc
	  2 initial_volume 								= f8
	  2 total_intake_volume 						= f8
	  2 diluent_type_cd 							= f8
	  2 diluent_type_disp 							= vc
	  2 ph_dispense_id 								= f8
	  2 infusion_rate 								= f8
	  2 infusion_rate_ind							= i2
	  2 infusion_unit_cd 							= f8
	  2 infusion_unit_disp 							= vc
	  2 infusion_unit_cd_mean 						= vc
	  2 infusion_time_cd 							= f8
	  2 infusion_time_cd_disp						= vc
	  2 medication_form_cd 							= f8
	  2 medication_form_disp						= vc
	  2 reason_required_flag 						= i2
	  2 response_required_flag						= i2
	  2 admin_strength 								= i4
	  2 admin_strength_ind 							= i2
	  2 admin_strength_unit_cd 						= f8
	  2 admin_strength_unit_disp 					= vc
	  2 substance_lot_number 						= vc
	  2 substance_exp_dt_tm 						= dq8
	  2 substance_manufacturer_cd 					= f8
	  2 substance_manufacturer_disp					= vc
	  2 refusal_cd									= f8
	  2 refusal_cd_disp								= vc
	  2 admin_status_cd 							= f8 	; mae
	  2 admin_status_cd_disp 						= vc 	; mae
	  2 system_entry_dt_tm 							= dq8
	  2 iv_event_cd 								= f8
	  2 infused_volume 								= f8
	  2 infused_volume_unit_cd 						= f8
	  2 infused_volume_unit_disp 					= vc
	  2 remaining_volume 							= f8
	  2 remaining_volume_unit_cd 					= f8
	  2 remaining_volume_unit_disp					= vc
	  2 synonym_id 									= f8
	  2 immunization_type_cd 						= f8
	  2 immunization_type_disp 						= vc
	  2 admin_start_tz 								= i4
	  2 admin_end_tz 								= vc
	  2 created_updated_date_time					= dq8 	;ce.updt_dt_tm 001 to mae.updt_dt_tm
	  2 admin_dt_tm									= dq8
	  ;2 result_note [*]
		;	3 note_body 							= gvc 	;007
			;3 note_dt_tm 							= dq8
			;3 note_format 							= vc
			;3 note_provider_id 					= f8
			;3 note_provider_name 					= vc
	  2 orders
	  		3 order_id								= f8
	  		3 medication_id							= f8 	;event_cd
	  		3 medication_desc						= vc 	; event_cd disp
	  		3 order_status_cd						= f8
	  		3 order_status_disp						= vc
	  		3 current_start_dt_tm					= dq8
	  		3 current_start_tz						= i4
	  		3 projected_stop_dt_tm  				= dq8
	  		3 projected_stop_tz						= i4
	  		3 ordering_provider_id					= f8
	  		3 ordering_provider						= vc
	  		3 catalog_cd							= f8
	  		3 synonym_id							= f8
	  		3 concept_cki							= vc
	  		3 ndc									= vc
 	  		3 rx_norm[*]
				4 code								= vc
				4 code_type							= vc
				4 term_type							= vc
			3 ingred_list [*]								;009
				4 order_mnemonic 					= vc
				4 ordered_as_mnemonic 				= vc
				4 order_detail_display_line 		= vc
			 	4 synonym_id 						= f8
				4 catalog_cd 						= f8
				4 catalog_disp 						= vc
				4 volume_value 						= f8
				4 volume_unit_cd 					= f8
				4 volume_unit_disp 					= vc
				4 strength_value 					= f8
				4 strength_unit_cd 					= f8
				4 strength_unit_disp 				= vc
				4 freetext_dose 					= vc
				4 frequency_cd 						= f8
				4 frequency_disp 					= vc
				4 comp_sequence 					= i4
				4 ingredient_type_flag 				= i2
				4 iv_seq 							= i4
				4 hna_order_mnemonic 				= vc
				4 dose_quantity 					= f8
				4 dose_quantity_unit 				= f8
				4 event_cd 							= f8
				4 normalized_rate 					= f8
				4 normalized_rate_unit_cd 			= f8
				4 normalized_rate_unit_disp 		= vc
				4 concentration 					= f8
				4 concentration_unit_cd 			= f8
				4 concentration_unit_disp			= vc
				4 include_in_total_volume_flag		= i2
				4 ingredient_source_flag 			= i2
				4 ndc								= vc
				4 rx_norm [*]
		        	5 code                  		= vc
		       		5 code_type             		= vc
		       		5 term_type            			= vc
	  2 person
		  3 person_id 								= f8	;p.person_id
		  3 name_full_formatted 					= vc	;p.name_full_formatted
		  3 name_last 								= vc	;p.last_name
		  3 name_first 								= vc	;p.first_name
		  3 name_middle 							= vc	;p.middle_name
		  3 mrn										= vc    ;pa.alias
		  3 dob										= dq8 	;010
		  3 gender_id								= f8  	;010
		  3 gender_disp								= vc  	;010
		  3 sDOB									= c10 	;029
	  2 encounter
		  3 encounter_id 							= f8	;e.encntr_id
		  3 encounter_type_cd						= f8	;e.encntr_type_cd
		  3 encounter_type_disp						= vc	;encounter type display
		  3 encounter_type_class_cd					= f8	;encounter_type_class_cd
	      3 encounter_type_class_disp				= vc	;encounter type class display
 		  3 arrive_date								= dq8	;e.admit_dt_tm
 		  3 discharge_date							= dq8	;e.discharge_dt_tm
 		  3 fin_nbr									= vc	;ea.alias
 	 	  3 patient_location								;003
 		  	4  location_cd              			= f8
  			4  location_disp            			= vc
  			4  loc_bed_cd               			= f8
  			4  loc_bed_disp            				= vc
  			4  loc_building_cd          			= f8
  			4  loc_building_disp        			= vc
  			4  loc_facility_cd          			= f8
  			4  loc_facility_disp        			= vc
  			4  loc_nurse_unit_cd        			= f8
 			4  loc_nurse_unit_disp      			= vc
 			4  loc_room_cd              			= f8
  			4  loc_room_disp           				= vc
  			4  loc_temp_cd              			= f8
  			4  loc_temp_disp           				= vc
    1 audit
		2 user_id									= f8
		2 user_firstname							= vc
		2 user_lastname								= vc
		2 patient_id								= f8
		2 patient_firstname							= vc
		2 patient_lastname							= vc
	    2 service_version							= vc
	    2 query_execute_time						= vc
	    2 query_execute_units						= vc
   1 status_data											;026
    2 status 										= c1
    2 subeventstatus[1]
      3 OperationName 								= c25
      3 OperationStatus 							= c1
      3 TargetObjectName 							= c25
      3 TargetObjectValue 							= vc
      3 Code 										= c4
      3 Description 								= vc
)
 
free record components_req
record components_req(
	1 event_cds[*]
		2 event_cd									= f8
		2 source_identifier							= vc
)
 
free record loc_req
record loc_req(
	1 codes[*]
		2 code_value								= f8
		2 fac_identifier							= vc
)
 
;initialize status to FAIL
set pop_medadmins_reply_out->status_data->status = "F"
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common ;026
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
set MODIFY MAXVARLEN 200000000	;033
 
;Input
declare sUserName					= vc with protect, noconstant("")
declare sFromDate					= vc with protect, noconstant("")
declare sToDate						= vc with protect, noconstant("")
declare sLocFacilities				= vc with protect, noconstant("")
declare sComponents					= vc with protect, noconstant("")
declare iIncRxNorm					= i4 with protect, noconstant(0)
declare iIncNDC						= i4 with protect, noconstant(0)
declare iDebugFlag					= i2 with protect, noconstant(0)
declare iTimeMax						= i4 with protect, noconstant(0)
 
;Other
declare UTCmode						= i2 with protect, noconstant(0);;011
declare UTCpos 						= i2 with protect, noconstant(0);;011
declare qFromDateTime					= dq8 with protect, noconstant(CNVTDATETIME(CURDATE, CURTIME3))
declare qToDateTime						= dq8 with protect, noconstant(CNVTDATETIME(CURDATE, CURTIME3))
declare iTimeDiff					= i4 with protect, noconstant(0)
declare iObsSize					= i4 with protect, noconstant(0)
declare ndx                     	= i4
declare ndx2                    	= i4
declare medadminsCnt				= i4
declare iMaxRecs					= i4 with protect, constant(2000) ;033
 
;Constants
declare c_mrn_person_alias_type_cd			= f8 with protect, constant(uar_get_code_by("MEANING",4,"MRN"))
declare c_finnbr_encntr_alias_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",319,"FIN NBR"))
declare c_primary_mnemonic_type_cd  		= f8 with protect, constant(uar_get_code_by("MEANING", 6011, "PRIMARY"))
declare c_rxnorm_map_type_cd 				= f8 with protect, constant(uar_get_code_by("MEANING", 29223, "MULTUM=RXN"))
declare c_ndc_med_identifier_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",11000,"NDC"))  ;001
declare c_inpatient_pharmacy_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",4500,"INPATIENT"));001
declare c_taskpurged_event_type_cd			= f8 with protect, constant(UAR_GET_CODE_BY("MEANING", 4000040,"TASKPURGED"))
declare c_order_action_type_cd				= f8 with protect, constant(uar_get_code_by("MEANING",6003,"ORDER"))
 
/**************************************************************************
;DECLARE SUBROUTINES
***************************************************************************/
declare ParseEventComponents(sComponents = vc)		= null with protect
declare ParseLocations(sLocFacilities = vc)			= null with protect
declare GetMedAdmins(null)							= null with protect
declare GetOrderIngredients (null)				 	= null with protect 	;009
declare GetRxNorm(null)								= null with protect
declare GetNDC(null)								= null with protect
 
/**************************************************************************
;INITIALIZE
**************************************************************************/
;Input
set sUserName						= trim($USERNAME, 3)
set sFromDate						= trim($BEG_DATE, 3)
set sToDate							= trim($END_DATE, 3)
set sComponents     				= trim($EC_LIST,3)
set iIncRxNorm						= cnvtint($INC_RX_NORM)
set iIncNDC							= cnvtint($INC_NDC)
set sLocFacilities					= trim($LOC_LIST,3)
set iDebugFlag						= cnvtint($DEBUG_FLAG)
set iTimeMax						= cnvtint($TIME_MAX)
 
;Other
set UTCmode							= CURUTC ;011
set UTCpos							= findstring("Z",sFromDate,1,0) ;011
 
set qFromDateTime = GetDateTime(sFromDate)
set qToDateTime = GetDateTime(sToDate)
 
if(iDebugFlag > 0)
	call echo(build("sFromDate -> ",sFromDate))
	call echo(build("sToDate -> ",sToDate))
	call echo(build("sUserName -> ", sUserName))
	call echo(build("qFromDateTime -> ", qFromDateTime))
	call echo(build("qToDateTime -> ", qToDateTime))
	call echo(build("debug flag -> ", iDebugFlag))
	call echo(build("Time Maximum -> ", iTimeMax))
	call echo(build("Components -> ",sComponents))
	call echo(build("RX NORM FLAG -> ",iIncRxNorm))
	call echo(build("NDC -> ",iIncNDC))
	call echo(build("Loc Facilities -> ",sLocFacilities))
	call echo(build("MRN ->  ", c_mrn_person_alias_type_cd))
	call echo(build("FIN ->  ", c_finnbr_encntr_alias_type_cd))
	call echo(build("MNEMONIC TYPE CD -> ",c_primary_mnemonic_type_cd))
	call echo(build("MAP TYPE CD -> ", c_rxnorm_map_type_cd))
	call echo(build("UTC MODE -->",UTCmode));011
 	call echo(build("UTC POS -->",UTCpos));011
	call echo(build("sToDate -> ",sToDate))
	call echo(build("qFromDateTime -> ",qFromDateTime))
	call echo(build("qToDateTime -> ", qToDateTime))
	call echo(build ("DISPLAY END DT TIME",format(qFromDateTime, "@LONGDATETIME")))
	call echo(build ("DISPLAY END DT TIME",format(qToDateTime, "@LONGDATETIME")))
 	call echo (build("iTimeMax---->",iTimeMax))
endif
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Validate Username
set iRet = PopulateAudit(sUserName, 0.0, pop_medadmins_reply_out, sVersion)
 if(iRet = 0)
	call ErrorHandler2("ORDERS", "F","User is invalid", "Invalid User for Audit.","1001",build("User is invalid. ",
	"Invalid User for Audit."),pop_medadmins_reply_out) ;008
	go to EXIT_SCRIPT
endif
 
; Validate from date is not greather than to date - 012
if (qFromDateTime > qToDateTime)
	call ErrorHandler2("SELECT", "F", "VALIDATE", "From Date Greater than To Date. Refine Dates Entered.",
	"2010", "From Date Greater than To Date. Refine Dates Entered.", pop_medadmins_reply_out)
	go to EXIT_SCRIPT
endif
 
 ; Validate timespan doesn't exceed threshold
set iRet = ThreshHoldValidator(iTimeMax,"s",qFromDateTime,qToDateTime)
if(iRet = 0)
	call ErrorHandler2("SELECT", "F", "VALIDATE", "Date Range Too Long. Refine Query.",
	"2011","Date Range Too Long. Refine Query.",pop_medadmins_reply_out) ;008
	go to EXIT_SCRIPT
endif
 
; Parse components if provided
if(sComponents > " ")
	call ParseEventComponents(sComponents)
endif
 
; Parse locations if provided
if(sLocFacilities > " ")
	call ParseLocations(sLocFacilities)
endif
 
; Get Medication Administrations
call GetMedAdmins(null)
 
; Get Order Ingredients
call GetOrderIngredients (null)
 
; Get RxNorm codes if requested
if(iIncRxNorm)
	call GetRxNorm(null)
endif
 
; Get NDC codes if requested
if(iIncNDC)
	call GetNDC(null)
endif
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(pop_medadmins_reply_out)
if(iDebugFlag = 1)
	call echorecord(pop_medadmins_reply_out)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_pop_medadmins.json")
	call echo(build2("_file : ", _file))
	call echojson(pop_medadmins_reply_out, _file, 0)
	call echo(JSONout)
endif
 
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: ParseEventComponents(sComponents = vc)
;  Description: Subroutine to parse a comma delimited string
**************************************************************************/
subroutine ParseEventComponents(sComponents)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ParseEventComponents Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare notfnd 		= vc with constant("<not_found>")
	declare num 		= i4 with noconstant(1)
	declare str 		= vc with noconstant("")
 
	while (str != notfnd)
		set str =  piece(sComponents,',',num,notfnd)
		if(str != notfnd)
 
			;Validate codeset
			set iRet = GetCodeSet(cnvtreal(str))
			if(iRet != 72)
				call ErrorHandler2("SELECT", "F", "VALIDATE", build2("Invalid Event Code: ",trim(str,3)),
				"2018", build2("Invalid Event Code: ",trim(str,3)), pop_medadmins_reply_out);008
				go to EXIT_SCRIPT
			else
				set stat = alterlist(components_req->event_cds, num)
				set components_req->event_cds[num]->event_cd = cnvtreal(str)
			endif
		endif
		set num = num + 1
	endwhile
 
	if(iDebugFlag > 0)
		call echo(concat("ParseEventComponents Runtime: ",
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
 
	while (str != notfnd)
		set str =  piece(sLocFacilities,',',num,notfnd)
		if(str != notfnd)
 
			;Validate codeset and location type is facility
			 select into "nl:"
			 from code_value
			 where code_set = 220 and cdf_meaning = "FACILITY"
				and cnvtreal(str) = code_value
			with nocounter
 
			if (curqual = 0)
				call ErrorHandler2("SELECT", "F", "VALIDATE", build2("Invalid Facility Code: ", cnvtreal(str)),
				"2040", build2("Invalid Facility Code: ",cnvtreal(str)),pop_medadmins_reply_out) ;008
				go to EXIT_SCRIPT
			else
				set stat = alterlist(loc_req->codes, num)
				set loc_req->codes[num]->code_value = cnvtreal(str)
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
;  Name: GetMedAdmins(null)
;  Description: Subroutine to get medadmins
**************************************************************************/
subroutine GetMedAdmins(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetMedAdmins Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare sComponentParser = vc
 
	;Component parser string - 031
	if(sComponents > " ")
		set sComponentParser = "expand(ndx,1,size(components_req->event_cds,5),ce.event_cd,components_req->event_cds[ndx].event_cd)"
	else
		set sComponentParser = "ce.event_cd > 0"
	endif
 
	set LocSize = size(loc_req->codes,5)
 
	; Temp structure
	free record temp_ce
	record temp_ce(
		1 qual_cnt = i4
		1 qual[*]
			2 clinical_event_id = f8
	)
 
	;Set expand control value - 023
	if(LocSize > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	; Get initial set of event ids without other restrictions - performance improvement - 031
	select
		if(LocSize > 0)
			from clinical_event   ce
				,med_admin_event mae
				, encounter e
			plan ce where ce.updt_dt_tm >= cnvtdatetime(qFromDateTime)
				and ce.updt_dt_tm <= cnvtdatetime(qToDateTime)
				and ce.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)	;036
				and parser(sComponentParser)
				and ce.view_level = 1
			join e where e.encntr_id = ce.encntr_id
				and expand(ndx2,1,LocSize,e.loc_facility_cd,loc_req->codes[ndx2].code_value)
			join mae where mae.event_id = ce.event_id
				and mae.event_type_cd != c_taskpurged_event_type_cd
			order by ce.updt_dt_tm
		else
			from clinical_event   ce
				,med_admin_event mae
			plan ce where ce.updt_dt_tm >= cnvtdatetime(qFromDateTime)
				and ce.updt_dt_tm <= cnvtdatetime(qToDateTime)
				and ce.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)	;036
				and parser(sComponentParser)
				and ce.view_level = 1
			join mae where mae.event_id = ce.event_id
				and mae.event_type_cd != c_taskpurged_event_type_cd
			order by ce.updt_dt_tm
		endif
	into "nl:"
		ce.clinical_event_id,
		ce.updt_dt_tm
	head report
		x = 0
		max_reached = 0
		stat = alterlist(temp_ce->qual,iMaxRecs)
	head ce.updt_dt_tm
		if(x > iMaxRecs)
			max_reached = 1
		endif
	detail
		if(max_reached = 0)
			x = x + 1
			if(mod(x,100) = 1 and x > iMaxRecs)
				stat = alterlist(temp_ce->qual,x + 99)
			endif
 
			temp_ce->qual[x].clinical_event_id = ce.clinical_event_id
		endif
	foot report
		stat = alterlist(temp_ce->qual,x)
		temp_ce->qual_cnt = x
	with nocounter, expand = value(exp)
 
	if(iDebugFlag)
 		call echo(build("------Qual Cnt = ",temp_ce->qual_cnt))
 	endif
 
	; Populate audit
	if(temp_ce->qual_cnt > 0)
		call ErrorHandler("EXECUTE", "S", "Success", "Get Pop MedAdmins completed successfully.", pop_medadmins_reply_out);002
	else
		call ErrorHandler("EXECUTE", "Z", "No Data.", "No records qualify.", pop_medadmins_reply_out);002
		go to EXIT_SCRIPT
	endif
 
	; Build final record and filter based on input parameters
 
	;Set expand control value - 023
	if(temp_ce->qual_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	set tnum = 1
	select into "nl:"
	from med_admin_event mae
		, clinical_event   ce
		, person   p
		, encounter   e
		, person_alias   pa
		, encntr_alias   ea
		, prsnl   pr
		, ce_med_result   cmr
		, orders   o
		, order_action oa ;006
		, prsnl pr2   ;;006
	plan ce where expand(tnum,1,temp_ce->qual_cnt,ce.clinical_event_id,temp_ce->qual[tnum].clinical_event_id)
	join mae where mae.event_id = ce.event_id
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
	join pr where pr.person_id = ce.performed_prsnl_id
	join cmr where cmr.event_id = outerjoin(ce.event_id)
	join o where o.order_id = outerjoin(ce.order_id)
	join oa where oa.order_id = outerjoin(o.order_id) ;;006+
		and oa.action_type_cd = outerjoin(c_order_action_type_cd)
	join pr2 where pr2.person_id = outerjoin(oa.order_provider_id);006-*/
	order by ce.parent_event_id, ce.event_id
	head report
		medadminsCnt = 0
	head ce.parent_event_id ;report
		medadminsCnt = medadminsCnt + 1
		stat = alterlist(pop_medadmins_reply_out->medadmins,medadminsCnt)
	detail
		;Med Admin Event
 
		pop_medadmins_reply_out->medadmins[medadminsCnt].admin_status_cd = mae.event_type_cd
		pop_medadmins_reply_out->medadmins[medadminsCnt].admin_status_cd_disp = uar_get_code_display(mae.event_type_cd)
		pop_medadmins_reply_out->medadmins[medadminsCnt].admin_dt_tm = mae.end_dt_tm
 
		;Clinical Event
		if(ce.updt_dt_tm > pop_medadmins_reply_out->medadmins[medadminsCnt].created_updated_date_time) ;034
			pop_medadmins_reply_out->medadmins[medadminsCnt].created_updated_date_time = ce.updt_dt_tm
		endif
		pop_medadmins_reply_out->medadmins[medadminsCnt].parent_event_id = ce.parent_event_id
		pop_medadmins_reply_out->medadmins[medadminsCnt].event_title_text = ce.event_title_text
		pop_medadmins_reply_out->medadmins[medadminsCnt].primary_key_id = ce.clinical_event_id
		pop_medadmins_reply_out->medadmins[medadminsCnt].medadmin_id = ce.event_id
		pop_medadmins_reply_out->medadmins[medadminsCnt].person_id = ce.person_id
		pop_medadmins_reply_out->medadmins[medadminsCnt].component_id = ce.event_cd
		;pop_medadmins_reply_out->medadmins[medadminsCnt].component_desc = uar_get_code_display(ce.event_cd)
		;pop_medadmins_reply_out->medadmins[medadminsCnt].result_date = ce.performed_dt_tm
		pop_medadmins_reply_out->medadmins[medadminsCnt].clinsig_updt_dt_tm = ce.event_end_dt_tm
		pop_medadmins_reply_out->medadmins[medadminsCnt].update_dt_tm = ce.updt_dt_tm
		;pop_medadmins_reply_out->medadmins[medadminsCnt].result_val = ce.result_val
		;pop_medadmins_reply_out->medadmins[medadminsCnt].normalcy_cd =ce.normalcy_cd
		;pop_medadmins_reply_out->medadmins[medadminsCnt].normalcy_disp = uar_get_code_display(ce.normalcy_cd)
		;pop_medadmins_reply_out->medadmins[medadminsCnt].normal_high = ce.normal_high
		;pop_medadmins_reply_out->medadmins[medadminsCnt].normal_low = ce.normal_low
		pop_medadmins_reply_out->medadmins[medadminsCnt].order_id = ce.order_id
		pop_medadmins_reply_out->medadmins[medadminsCnt].catalog_cd = ce.catalog_cd
		pop_medadmins_reply_out->medadmins[medadminsCnt].result_status_cd = ce.result_status_cd
		pop_medadmins_reply_out->medadmins[medadminsCnt].result_status = uar_get_code_display(ce.result_status_cd)
		pop_medadmins_reply_out->medadmins[medadminsCnt].event_tag = ce.event_tag
		pop_medadmins_reply_out->medadmins[medadminsCnt].event_class_cd = ce.event_class_cd
		pop_medadmins_reply_out->medadmins[medadminsCnt].event_class_disp = uar_get_code_display(ce.event_class_cd)
		;pop_medadmins_reply_out->medadmins[medadminsCnt].string_result_text = ce.string_result_text
		pop_medadmins_reply_out->medadmins[medadminsCnt].unit_cd = ce.result_units_cd
		pop_medadmins_reply_out->medadmins[medadminsCnt].unit_disp = uar_get_code_display(ce.result_units_cd)
 
		;CE Med Result
		pop_medadmins_reply_out->medadmins[medadminsCnt].valid_from_date = cmr.valid_from_dt_tm
		pop_medadmins_reply_out->medadmins[medadminsCnt].admin_note = cmr.admin_note
		pop_medadmins_reply_out->medadmins[medadminsCnt].admin_start_dt_tm = cmr.admin_start_dt_tm
		pop_medadmins_reply_out->medadmins[medadminsCnt].admin_end_dt_tm = cmr.admin_end_dt_tm
		pop_medadmins_reply_out->medadmins[medadminsCnt].admin_route_cd = cmr.admin_route_cd
		pop_medadmins_reply_out->medadmins[medadminsCnt].admin_route_disp = uar_get_code_display(cmr.admin_route_cd)
		pop_medadmins_reply_out->medadmins[medadminsCnt].admin_site_cd = cmr.admin_site_cd
		pop_medadmins_reply_out->medadmins[medadminsCnt].admin_site_disp = uar_get_code_display(cmr.admin_site_cd)
		pop_medadmins_reply_out->medadmins[medadminsCnt].admin_method_cd = cmr.admin_method_cd
		pop_medadmins_reply_out->medadmins[medadminsCnt].admin_method_disp = uar_get_code_display(cmr.admin_method_cd)
		pop_medadmins_reply_out->medadmins[medadminsCnt].admin_pt_loc_cd = cmr.admin_pt_loc_cd
		pop_medadmins_reply_out->medadmins[medadminsCnt].admin_pt_loc_disp = uar_get_code_display(cmr.admin_pt_loc_cd)
		pop_medadmins_reply_out->medadmins[medadminsCnt].initial_dosage = cmr.initial_dosage
		pop_medadmins_reply_out->medadmins[medadminsCnt].admin_dosage = cmr.admin_dosage
		pop_medadmins_reply_out->medadmins[medadminsCnt].dosage_unit_cd = cmr.dosage_unit_cd
		pop_medadmins_reply_out->medadmins[medadminsCnt].dosage_unit_disp = uar_get_code_display(cmr.dosage_unit_cd)
		pop_medadmins_reply_out->medadmins[medadminsCnt].initial_volume = cmr.initial_volume
		pop_medadmins_reply_out->medadmins[medadminsCnt].total_intake_volume = cmr.total_intake_volume
		pop_medadmins_reply_out->medadmins[medadminsCnt].diluent_type_cd = cmr.diluent_type_cd
		pop_medadmins_reply_out->medadmins[medadminsCnt].diluent_type_disp = uar_get_code_display(cmr.diluent_type_cd)
		pop_medadmins_reply_out->medadmins[medadminsCnt].ph_dispense_id = cmr.ph_dispense_id
		pop_medadmins_reply_out->medadmins[medadminsCnt].diluent_type_cd = cmr.diluent_type_cd
		pop_medadmins_reply_out->medadmins[medadminsCnt].infusion_rate = cmr.infusion_rate
		pop_medadmins_reply_out->medadmins[medadminsCnt].infusion_unit_cd = cmr.infusion_unit_cd
		pop_medadmins_reply_out->medadmins[medadminsCnt].infusion_unit_disp = uar_get_code_display(cmr.infusion_unit_cd)
		pop_medadmins_reply_out->medadmins[medadminsCnt].infusion_time_cd = cmr.infusion_unit_cd
		pop_medadmins_reply_out->medadmins[medadminsCnt].infusion_time_cd_disp = uar_get_code_display(cmr.infusion_time_cd)
		pop_medadmins_reply_out->medadmins[medadminsCnt].medication_form_cd = cmr.medication_form_cd
		pop_medadmins_reply_out->medadmins[medadminsCnt].medication_form_disp = uar_get_code_display(cmr.medication_form_cd)
		pop_medadmins_reply_out->medadmins[medadminsCnt].admin_strength = cmr.admin_strength
		pop_medadmins_reply_out->medadmins[medadminsCnt].admin_strength_unit_cd = cmr.admin_strength_unit_cd
		pop_medadmins_reply_out->medadmins[medadminsCnt].admin_strength_unit_disp = uar_get_code_display(cmr.admin_strength_unit_cd)
		pop_medadmins_reply_out->medadmins[medadminsCnt].substance_lot_number = cmr.substance_lot_number
		pop_medadmins_reply_out->medadmins[medadminsCnt].substance_exp_dt_tm = cmr.substance_exp_dt_tm
		pop_medadmins_reply_out->medadmins[medadminsCnt].substance_manufacturer_cd = cmr.substance_manufacturer_cd
		pop_medadmins_reply_out->medadmins[medadminsCnt].substance_manufacturer_disp = uar_get_code_display(cmr.substance_manufacturer_cd)
		pop_medadmins_reply_out->medadmins[medadminsCnt].refusal_cd 	= cmr.refusal_cd
		pop_medadmins_reply_out->medadmins[medadminsCnt].refusal_cd_disp = uar_get_code_display(cmr.refusal_cd)
		pop_medadmins_reply_out->medadmins[medadminsCnt].system_entry_dt_tm 	= cmr.system_entry_dt_tm
		pop_medadmins_reply_out->medadmins[medadminsCnt].iv_event_cd = cmr.iv_event_cd
		pop_medadmins_reply_out->medadmins[medadminsCnt].infused_volume 	= cmr.infused_volume
		pop_medadmins_reply_out->medadmins[medadminsCnt].infused_volume_unit_cd 	= cmr.infused_volume_unit_cd
		pop_medadmins_reply_out->medadmins[medadminsCnt].infused_volume_unit_disp = uar_get_code_display(cmr.infused_volume_unit_cd)
		pop_medadmins_reply_out->medadmins[medadminsCnt].remaining_volume = cmr.remaining_volume
		pop_medadmins_reply_out->medadmins[medadminsCnt].remaining_volume_unit_cd = cmr.remaining_volume_unit_cd
		pop_medadmins_reply_out->medadmins[medadminsCnt].remaining_volume_unit_disp = uar_get_code_display(cmr.remaining_volume_unit_cd)
		pop_medadmins_reply_out->medadmins[medadminsCnt].synonym_id = cmr.synonym_id
		pop_medadmins_reply_out->medadmins[medadminsCnt].immunization_type_cd = cmr.immunization_type_cd
		pop_medadmins_reply_out->medadmins[medadminsCnt].immunization_type_disp = uar_get_code_display(cmr.immunization_type_cd)
		pop_medadmins_reply_out->medadmins[medadminsCnt].admin_start_tz = cmr.admin_start_tz
		pop_medadmins_reply_out->medadmins[medadminsCnt].admin_end_tz = cnvtstring(cmr.admin_end_tz)
 
		;Prsnl
		pop_medadmins_reply_out->medadmins[medadminsCnt].admin_prov_id = pr.person_id
		pop_medadmins_reply_out->medadmins[medadminsCnt].admin_provider = pr.name_full_formatted
		pop_medadmins_reply_out->medadmins[medadminsCnt]->orders.ordering_provider	= pr2.name_full_formatted ;;006
 
		;Orders
		if (o.template_order_flag > 1 )
			pop_medadmins_reply_out->medadmins[medadminsCnt]->orders.order_id = o.template_order_id
		else
			pop_medadmins_reply_out->medadmins[medadminsCnt]->orders.order_id = o.order_id
		endif
		pop_medadmins_reply_out->medadmins[medadminsCnt]->orders.medication_id = ce.event_cd
		pop_medadmins_reply_out->medadmins[medadminsCnt]->orders.medication_desc = uar_get_code_display(ce.event_cd)
		pop_medadmins_reply_out->medadmins[medadminsCnt]->orders.order_status_cd = o.order_status_cd
		pop_medadmins_reply_out->medadmins[medadminsCnt]->orders.order_status_disp = uar_get_code_display(o.order_status_cd)
		pop_medadmins_reply_out->medadmins[medadminsCnt]->orders.current_start_dt_tm	= o.current_start_dt_tm
		pop_medadmins_reply_out->medadmins[medadminsCnt]->orders.current_start_tz		= o.current_start_tz
		pop_medadmins_reply_out->medadmins[medadminsCnt]->orders.projected_stop_dt_tm  = o.projected_stop_dt_tm
		pop_medadmins_reply_out->medadmins[medadminsCnt]->orders.projected_stop_tz		= o.projected_stop_tz
		pop_medadmins_reply_out->medadmins[medadminsCnt]->orders.ordering_provider_id	= oa.order_provider_id ;;006
		pop_medadmins_reply_out->medadmins[medadminsCnt]->orders.catalog_cd = o.catalog_cd
		pop_medadmins_reply_out->medadmins[medadminsCnt]->orders.synonym_id = o.synonym_id
 
		;Person
		pop_medadmins_reply_out->medadmins[medadminsCnt]->person->person_id = p.person_id
		pop_medadmins_reply_out->medadmins[medadminsCnt]->person->name_full_formatted = p.name_full_formatted
		pop_medadmins_reply_out->medadmins[medadminsCnt]->person->name_first = p.name_first
		pop_medadmins_reply_out->medadmins[medadminsCnt]->person->name_last = p.name_last
		pop_medadmins_reply_out->medadmins[medadminsCnt]->person->name_middle = p.name_middle
		pop_medadmins_reply_out->medadmins[medadminsCnt]->person->mrn = pa.alias
		pop_medadmins_reply_out->medadmins[medadminsCnt]->person->dob = p.birth_dt_tm ;010
		pop_medadmins_reply_out->medadmins[medadminsCnt]->person->gender_id = p.sex_cd ;010
		pop_medadmins_reply_out->medadmins[medadminsCnt]->person->gender_disp = uar_get_code_display(p.sex_cd);010
		pop_medadmins_reply_out->medadmins[medadminsCnt]->person->sDOB =
		datetimezoneformat(p.birth_dt_tm,p.birth_tz,"YYYY-MM-DD",curtimezonedef);029
 
		;Encounter
		pop_medadmins_reply_out->medadmins[medadminsCnt]->encounter->encounter_id = e.encntr_id
		pop_medadmins_reply_out->medadmins[medadminsCnt]->encounter->encounter_type_cd = e.encntr_type_cd
		pop_medadmins_reply_out->medadmins[medadminsCnt]->encounter->encounter_type_disp = uar_get_code_display(e.encntr_type_cd)
		pop_medadmins_reply_out->medadmins[medadminsCnt]->encounter->encounter_type_class_cd = e.encntr_type_class_cd
		pop_medadmins_reply_out->medadmins[medadminsCnt]->encounter->encounter_type_class_disp =
		uar_get_code_display(e.encntr_type_class_cd)
		pop_medadmins_reply_out->medadmins[medadminsCnt]->encounter->arrive_date = e.arrive_dt_tm
		if (e.arrive_dt_tm is null)
			pop_medadmins_reply_out->medadmins[medadminsCnt]->encounter->arrive_date = e.reg_dt_tm
		endif
		pop_medadmins_reply_out->medadmins[medadminsCnt]->encounter->discharge_date = e.disch_dt_tm
		pop_medadmins_reply_out->medadmins[medadminsCnt]->encounter->fin_nbr = ea.alias
 
		;Encounter Location
		pop_medadmins_reply_out->medadmins[medadminsCnt]->encounter->patient_location->location_cd = e.location_cd
		pop_medadmins_reply_out->medadmins[medadminsCnt]->encounter->patient_location->location_disp =
		uar_get_code_display(e.location_cd)
		pop_medadmins_reply_out->medadmins[medadminsCnt]->encounter->patient_location->loc_bed_cd = e.loc_bed_cd
		pop_medadmins_reply_out->medadmins[medadminsCnt]->encounter->patient_location->loc_bed_disp =
		uar_get_code_display(e.loc_bed_cd)
		pop_medadmins_reply_out->medadmins[medadminsCnt]->encounter->patient_location->loc_building_cd = e.loc_building_cd
		pop_medadmins_reply_out->medadmins[medadminsCnt]->encounter->patient_location->loc_building_disp =
		uar_get_code_display(e.loc_building_cd)
		pop_medadmins_reply_out->medadmins[medadminsCnt]->encounter->patient_location->loc_facility_cd = e.loc_facility_cd
		pop_medadmins_reply_out->medadmins[medadminsCnt]->encounter->patient_location->loc_facility_disp =
		uar_get_code_display(e.loc_facility_cd)
		pop_medadmins_reply_out->medadmins[medadminsCnt]->encounter->patient_location->loc_nurse_unit_cd = e.loc_nurse_unit_cd
		pop_medadmins_reply_out->medadmins[medadminsCnt]->encounter->patient_location->loc_nurse_unit_disp =
		uar_get_code_display(e.loc_nurse_unit_cd)
		pop_medadmins_reply_out->medadmins[medadminsCnt]->encounter->patient_location->loc_room_cd = e.loc_room_cd
		pop_medadmins_reply_out->medadmins[medadminsCnt]->encounter->patient_location->loc_room_disp =
		uar_get_code_display(e.loc_room_cd)
		pop_medadmins_reply_out->medadmins[medadminsCnt]->encounter->patient_location->loc_temp_cd = e.loc_temp_cd
		pop_medadmins_reply_out->medadmins[medadminsCnt]->encounter->patient_location->loc_temp_disp =
		uar_get_code_display(e.loc_temp_cd)
	with nocounter, separator=" ", format, maxcol = 9999, expand = value(exp) ;MAXREC = 2000
 
	if(iDebugFlag > 0)
		call echo(concat("GetMedAdmins Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end ;End Sub
 
/*************************************************************************
;  Name: GetOrderIngredients(null)
;  Description: This will retrieve all order ingredients for an order
**************************************************************************/
subroutine GetOrderIngredients(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetOrderIngredients Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare num1			= i4  with protect ,noconstant (0 )
	declare i				= i4  with protect ,noconstant (0 ) ;
	declare irxi_cnt		= i4  with protect ,noconstant (0 )
	declare cntp			= i4 with protect,noconstant(0)
	declare pos				= i4  with protect ,noconstant (-1 )
	declare pos1			= i4  with protect ,noconstant (-1 );007
	declare rxnorm_value	= vc with protect , noconstant("")
	declare ingred_cnt 		= i4  with protect ,noconstant (0 )
	set ingred_cnt 			= size(pop_medadmins_reply_out->medadmins, 5)
 
	for(x = 1 to size(pop_medadmins_reply_out->medadmins, 5))
		if(pop_medadmins_reply_out->medadmins[x]->event_title_text = "IVPARENT")
 
			select into "nl:"
			from orders o
				, order_ingredient   oi
				, code_value_event_r   cver
				, order_catalog_synonym   ocs
				, cmt_cross_map   ccm
				, synonym_item_r   sir
				, med_identifier   mi
			plan o where o.order_id = pop_medadmins_reply_out->medadmins[x]->order_id
			join oi where oi.order_id = o.order_id
				and oi.action_sequence = o.last_ingred_action_sequence
			join cver where cver.parent_cd =  oi.catalog_cd
			join ocs where ocs.catalog_cd = oi.catalog_cd
				and ocs.active_ind = 1
				and ocs.mnemonic_type_cd = c_primary_mnemonic_type_cd
			join ccm where ccm.concept_cki = outerjoin(ocs.concept_cki)
				and ccm.map_type_cd = outerjoin(c_rxnorm_map_type_cd)
			join sir where sir.synonym_id = outerjoin(ocs.synonym_id)
			join mi where mi.item_id = outerjoin(sir.item_id)
				and mi.med_identifier_type_cd = outerjoin(c_ndc_med_identifier_type_cd)
				and mi.active_ind = outerjoin(1)
				and mi.sequence = outerjoin(1)
				and mi.med_product_id > outerjoin(0)
			order by
				oi.order_id
				, oi.action_sequence
				, oi.comp_sequence
				, ccm.target_concept_cki
				, mi.updt_dt_tm   DESC
			head oi.order_id
				icnt = 0
			head oi.synonym_id
				irxi_cnt = 0
 
				icnt = icnt + 1
				stat = alterlist(pop_medadmins_reply_out->medadmins[x]->orders->ingred_list,icnt)
 
				;Order Ingredient
				pop_medadmins_reply_out->medadmins[x]->orders->ingred_list[icnt]->order_mnemonic = oi.order_mnemonic
				pop_medadmins_reply_out->medadmins[x]->orders->ingred_list[icnt]->order_detail_display_line = oi.order_detail_display_line
				pop_medadmins_reply_out->medadmins[x]->orders->ingred_list[icnt]->ordered_as_mnemonic = oi.ordered_as_mnemonic
				pop_medadmins_reply_out->medadmins[x]->orders->ingred_list[icnt]->synonym_id = oi.synonym_id
				pop_medadmins_reply_out->medadmins[x]->orders->ingred_list[icnt]->catalog_cd  =  oi.catalog_cd
				pop_medadmins_reply_out->medadmins[x]->orders->ingred_list[icnt]->catalog_disp = uar_get_code_display(oi.catalog_cd)
				pop_medadmins_reply_out->medadmins[x]->orders->ingred_list[icnt]->volume_value = oi.volume
				pop_medadmins_reply_out->medadmins[x]->orders->ingred_list[icnt]->volume_unit_disp = uar_get_code_display(oi.volume_unit)
				pop_medadmins_reply_out->medadmins[x]->orders->ingred_list[icnt]->strength_value = oi.strength
				pop_medadmins_reply_out->medadmins[x]->orders->ingred_list[icnt]->strength_unit_disp = uar_get_code_display(oi.strength_unit)
				pop_medadmins_reply_out->medadmins[x]->orders->ingred_list[icnt]->freetext_dose = oi.freetext_dose
				pop_medadmins_reply_out->medadmins[x]->orders->ingred_list[icnt]->frequency_cd = oi.freq_cd
				pop_medadmins_reply_out->medadmins[x]->orders->ingred_list[icnt]->frequency_disp = uar_get_code_display(oi.freq_cd)
				pop_medadmins_reply_out->medadmins[x]->orders->ingred_list[icnt]->comp_sequence = oi.comp_sequence
				pop_medadmins_reply_out->medadmins[x]->orders->ingred_list[icnt]->ingredient_type_flag = oi.ingredient_type_flag
				pop_medadmins_reply_out->medadmins[x]->orders->ingred_list[icnt]->iv_seq = oi.iv_seq
				pop_medadmins_reply_out->medadmins[x]->orders->ingred_list[icnt]->hna_order_mnemonic = oi.hna_order_mnemonic
				pop_medadmins_reply_out->medadmins[x]->orders->ingred_list[icnt]->dose_quantity = oi.dose_quantity
				pop_medadmins_reply_out->medadmins[x]->orders->ingred_list[icnt]->dose_quantity_unit = oi.dose_quantity_unit
				pop_medadmins_reply_out->medadmins[x]->orders->ingred_list[icnt]->normalized_rate = oi.normalized_rate
				pop_medadmins_reply_out->medadmins[x]->orders->ingred_list[icnt]->normalized_rate_unit_disp =
				uar_get_code_display(oi.normalized_rate_unit_cd)
				pop_medadmins_reply_out->medadmins[x]->orders->ingred_list[icnt]->normalized_rate_unit_cd = oi.normalized_rate_unit_cd
				pop_medadmins_reply_out->medadmins[x]->orders->ingred_list[icnt]->concentration = oi.concentration
				pop_medadmins_reply_out->medadmins[x]->orders->ingred_list[icnt]->concentration_unit_cd = oi.concentration_unit_cd
				pop_medadmins_reply_out->medadmins[x]->orders->ingred_list[icnt]->concentration_unit_disp =
				uar_get_code_display(oi.concentration_unit_cd)
				pop_medadmins_reply_out->medadmins[x]->orders->ingred_list[icnt]->include_in_total_volume_flag = oi.include_in_total_volume_flag
				pop_medadmins_reply_out->medadmins[x]->orders->ingred_list[icnt]->ingredient_source_flag = oi.ingredient_source_flag
 
				;Code Value Event_R
				pop_medadmins_reply_out->medadmins[x]->orders->ingred_list[icnt]->event_cd = cver.event_cd
 
				; Med Identifier
				if(iIncNDC)
					pop_medadmins_reply_out->medadmins[x]->orders->ingred_list[icnt]->ndc = mi.value
				endif
 
			head ccm.target_concept_cki;detail
				if(iIncRxNorm)
					if(trim(ccm.target_concept_cki,3) > " ")
						irxi_cnt = irxi_cnt + 1
						stat = alterlist(pop_medadmins_reply_out->medadmins[x]->orders->ingred_list[icnt]->rx_norm,irxi_cnt)
 
						pop_medadmins_reply_out->medadmins[x]->orders->ingred_list[icnt]->rx_norm[irxi_cnt]->code = trim(ccm.source_identifier,3)
						pop_medadmins_reply_out->medadmins[x]->orders->ingred_list[icnt]->rx_norm[irxi_cnt]->code_type =
						trim(piece(ccm.target_concept_cki,"!",1,""),3)
						pop_medadmins_reply_out->medadmins[x]->orders->ingred_list[icnt]->rx_norm[irxi_cnt]->term_type =
						trim(piece(ccm.target_concept_cki,"!",1,""),3)
					endif
				endif
			with nocounter
		endif
	endfor
 
	if(iDebugFlag > 0)
		call echo(concat("GetOrderIngredients Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end ;End Sub
 
/*************************************************************************
;  Name: GetRxNorm(null)
;  Description: This will retrieve the RXNorm value for a given catalog_cd
**************************************************************************/
subroutine GetRxNorm(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetRxNorm Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare rxnorm_cnt 	= i4  with protect ,noconstant (0)
 	set rxnorm_cnt 			= size(pop_medadmins_reply_out->medadmins[medadminsCnt],5)
 
	select into "nl:"
		ocs.synonym_id, ccm.target_concept_cki
 	from (dummyt d with seq = value(rxnorm_cnt))
	,order_catalog_synonym ocs
    ,cmt_cross_map ccm
	plan d
 	join ocs where ocs.catalog_cd = pop_medadmins_reply_out->medadmins[d.seq]->orders.catalog_cd
		and ocs.active_ind = 1
		and ocs.mnemonic_type_cd = c_primary_mnemonic_type_cd
 	join ccm
 		where ccm.concept_cki = ocs.concept_cki and ccm.map_type_cd = c_rxnorm_map_type_cd
 	order by d.seq
 	head d.seq
		irx_cnt = 0
 	detail
	 	irx_cnt = irx_cnt + 1
		stat = alterlist(pop_medadmins_reply_out->medadmins[d.seq]->orders.rx_norm,irx_cnt)
 
		pop_medadmins_reply_out->medadmins[d.seq]->orders.rx_norm[irx_cnt].code = trim(ccm.source_identifier,3)
		pop_medadmins_reply_out->medadmins[d.seq]->orders.rx_norm[irx_cnt].code_type = trim(piece(ccm.target_concept_cki,"!",1,""),3)
		pop_medadmins_reply_out->medadmins[d.seq]->orders.rx_norm[irx_cnt].term_type = trim(piece(ccm.target_concept_cki,"!",1,""),3)
		pop_medadmins_reply_out->medadmins[d.seq]->orders.concept_cki = ccm.target_concept_cki
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetRxNorm Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end ;End Sub
 
/*************************************************************************
;  Name: GetRxNDC(null)
;  Description: This will retrieve the NDC value for a given event_id or for a given order catalog synonym
**************************************************************************/
subroutine GetNDC(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetNDC Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare ndc_cnt 				= i4  with protect ,noconstant (0)
	set ndc_cnt 			= size(pop_medadmins_reply_out->medadmins[medadminsCnt],5)
 
	select distinct into "nl:"
	from (dummyt d with seq = value(ndc_cnt))
		, orders o
		, order_catalog_synonym ocs
		, synonym_item_r sir
		, med_identifier mi
	plan d
	join o where o.order_id =  pop_medadmins_reply_out->medadmins[d.seq]->orders.order_id
	join ocs where ocs.catalog_cd = o.catalog_cd
		and ocs.synonym_id = o.synonym_id
	join sir where sir.synonym_id = ocs.synonym_id
	join mi where mi.item_id = sir.item_id
		and mi.med_identifier_type_cd = c_ndc_med_identifier_type_cd
		and mi.active_ind = 1
		and mi.sequence = 1
		and mi.med_product_id > 0
		and mi.pharmacy_type_cd =  c_inpatient_pharmacy_type_cd
	order by d.seq, mi.updt_dt_tm
	head d.seq
		indc_cnt = 0
	detail
		indc_cnt = indc_cnt + 1
		pop_medadmins_reply_out->medadmins[d.seq]->orders.ndc = trim(mi.value,3)
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetRxNorm Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end ;End Sub
 
 
end
go
 
 
