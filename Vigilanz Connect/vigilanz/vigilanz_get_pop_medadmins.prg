/*************************************************************************
  
  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

**************************************************************************
      Source file name:     snsro_get_pop_medadmins.prg
      Object name:          vigilanz_get_pop_medadmins
      Program purpose:      Retrieve medication administrations from CLINICAL_EVENT based on
      						date range parameters.
      Tables read:			CLINICAL_EVENT, CE_MED_RESULT, PERSON, ENCOUNTER, PRSNL
      Tables updated:       NONE
      Executing from:       Emissary Service
      Special Notes:      	This population query will check for maximum records
      						and a maximum date range and if those are exceeded
      						a failure status and message will get returned.
***********************************************************************
                     MODIFICATION CONTROL LOG
***********************************************************************
Mod Date     Engineer		Comment
----------------------------------------------------------------------
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
040 01/07/19 STV            switch MRN to encounter based MRN
041 01/09/19 RJC			medication_item_id added
042 03/06/19 RJC			parent order id added; Added GetAdminNotes routine
043 03/11/19 RJC			Added ocf compression check to GetAdminNotes
044 03/25/19 STV            Added orderPriority
045 04/04/19 STV            Added Task Class object
046 04/05/19 STV            Rework to include admins with parent_event_ids
047 04/22/19 RJC			Performance and efficiency changes; Removed IVPARENT filter on ingredients
048 04/26/19 STV            Added Timeout of 115 seconnds
049 04/26/19 RJC			Updated ingredient query; made medication id synonym id; medicaiton desc order mnemonic
050 05/23/19 STV            Added Tasks object
051 05/31/19 STV            Fix for array out of bounds error in the getIngredient function
052 07/24/19 STV    		Update to flex in_error status cd if result is in error for Adminstatus
053	08/26/19 RJC			Add IV fields
054 09/12/19 STV            Flexing admin_start_dt_tm
055 09/20/19 STV            adjust getorderingredient to tweak query
056 10/24/19 STV            Added Dispense ID
057 11/25/19 KRD            flexes the valid_from_date (administration date tim) to the event_end_dt_tm if no valid_from_dt_tm
058 12/18/19 STV            Fix to grab the provider_id's
059 12/31/19 STV            Fix to the child order section of the getOrderIngredient
060 1/16/20  STV            Added Contributer_System_cd
061 1/18/20  STV            Added Scanned Indicators patient and medication
062 1/28/20	 STV            Adjustment for child order ingredient fix to get last_act seq from parent_order
063 3/12/20  STV            Added GetAdminIngredId() and also fix for mapping strength
064 4/6/20   STV            adjustment for ingredient to not compare synonymId to med synonymid
065 4/8/20   STV            Added additional NDC precision for ingredient ndc
066 4/20/20  STV            Added additional entrance query to get admins not flowing through med_admin_event table
***********************************************************************/
drop program vigilanz_get_pop_medadmins go
create program vigilanz_get_pop_medadmins
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Username:" = ""  			;REQUIRED. Valid HNA Millennium user account.
	, "Beg Date:" = ""				;REQUIRED. Beginning of bookmark date range.
	, "End Date:" = ""				;OPTIONAL. No longer REQUIRED. End of bookmark date range. ;004
	, "Event Code List:" = ""		;OPTIONAL. List of event codes from code set 72/93.
	, "Include Rx Norm:" = 0    	;OPTIONAL.
	, "Include NDC:" = 0			;OPTIONAL.
	, "Facility_Code_List" = ""		;OPTIONAL. List of location facility codes from code set 220.
	, "Include Tasks"      = ""     ;OPTIONAL.
	, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
	, "Time Max" = 3600			;DO NOT USE. Undocumented value to override maximum date range in seconds.
 
with OUTDEV, USERNAME, BEG_DATE, END_DATE, EC_LIST, INC_RX_NORM, INC_NDC, LOC_LIST,INC_TASKS,DEBUG_FLAG, TIME_MAX
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL changed to Emissary version ;028
**************************************************************************/
set sVersion = "1.21.6.2"
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
	  2 med_scanned_ind                             = i2
	  2 pt_scanned_ind                              = i2
	  2 system
	  	3 id					                    = f8
	  	3 name										= vc
	  2 admin_ingred_id                             = f8;this is the synonymId of the ingredient
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
	  2 initial_volume 								= f8
	  2 initial_volume_unit
	  	3 id 										= f8
	  	3 name 										= vc
	  2 iv_event
	  	3 id 										= f8
	  	3 name 										= vc
	  2 bag_number									= vc
	  ;2 result_note [*]
		;	3 note_body 							= gvc 	;007
			;3 note_dt_tm 							= dq8
			;3 note_format 							= vc
			;3 note_provider_id 					= f8
			;3 note_provider_name 					= vc
	  2 orders
	  		3 order_id								= f8
	  		3 last_ingred_seq                       = i4
	  		3 pharm_order_priority                  = vc
	  		3 parent_order_id						= f8
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
	  		3 medication_item_id					= f8 	;041
 	  		3 rx_norm[*]
				4 code								= vc
				4 code_type							= vc
				4 term_type							= vc
			3 ingred_list [*]
				4 item_id				            = f8
				4 order_mnemonic 					= vc
				4 ordered_as_mnemonic 				= vc
				4 order_detail_display_line 		= vc
			 	4 synonym_id 						= f8
				4 catalog_cd 						= f8
				4 catalog_disp 						= vc
				4 volume_value 						= f8
				4 volume_unit_cd 					= f8
				4 volume_unit_disp 					= vc
				4 strength                          = vc
				4 strength_dose					    = f8
				4 strength_unit_cd 					= f8
				4 strength_dose_unit_disp 			= vc
				4 strength_unit
					5 id 							= f8
					5 name 							= vc
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
  		2 task_class
			3 description = vc
			3 id = f8
			3 name = vc
		2 tasks[*]
  			3 task_id = f8
  			3 task_class
  				4 id = f8
  				4 name = vc
  			3 task_type
  				4 id = f8
  				4 name = vc
  			3 task_status
  				4 id = f8
  				4 name = vc
  		2 dispense_hx[*]
  			3 dispense_hx_id = f8
  			3 dispense_dt_tm = dq8
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
declare sUserName							= vc with protect, noconstant("")
declare sFromDate							= vc with protect, noconstant("")
declare sToDate								= vc with protect, noconstant("")
declare sLocFacilities						= vc with protect, noconstant("")
declare sComponents							= vc with protect, noconstant("")
declare iIncRxNorm							= i4 with protect, noconstant(0)
declare iIncNDC								= i4 with protect, noconstant(0)
declare iIncTasks                           = i4 with protect, noconstant(0)
declare iDebugFlag							= i2 with protect, noconstant(0)
declare iTimeMax							= i4 with protect, noconstant(0)
 
;Other
declare UTCmode								= i2 with protect, noconstant(0);;011
declare UTCpos 								= i2 with protect, noconstant(0);;011
declare qFromDateTime						= dq8 with protect, noconstant(CNVTDATETIME(CURDATE, CURTIME3))
declare qToDateTime							= dq8 with protect, noconstant(CNVTDATETIME(CURDATE, CURTIME3))
declare iTimeDiff							= i4 with protect, noconstant(0)
declare iObsSize							= i4 with protect, noconstant(0)
declare ndx                     			= i4
declare ndx2                    			= i4
declare medadminsCnt						= i4
declare iMaxRecs							= i4 with protect, constant(2000) ;033
declare timeOutThreshold = i4 with protect, noconstant(115);setting to 115 seconds
declare queryStartTm = dq8
declare parent_order_ind = i2
 
;Constants
declare c_mrn_encounter_alias_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",319,"MRN"))
declare c_finnbr_encntr_alias_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",319,"FIN NBR"))
declare c_primary_mnemonic_type_cd  		= f8 with protect, constant(uar_get_code_by("MEANING", 6011, "PRIMARY"))
declare c_rxnorm_map_type_cd 				= f8 with protect, constant(uar_get_code_by("MEANING", 29223, "MULTUM=RXN"))
declare c_ndc_med_identifier_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",11000,"NDC"))  ;001
declare c_inpatient_pharmacy_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",4500,"INPATIENT"));001
declare c_taskpurged_event_type_cd			= f8 with protect, constant(UAR_GET_CODE_BY("MEANING", 4000040,"TASKPURGED"))
declare c_order_action_type_cd				= f8 with protect, constant(uar_get_code_by("MEANING",6003,"ORDER"))
declare c_nocomp_compression_cd				= f8 with protect, constant(uar_get_code_by("MEANING",120,"NOCOMP"))
declare c_medication_task_type_cd			= f8 with protect, constant(uar_get_code_by("MEANING",6026,"MED"))
declare c_inerror_status_cd			= f8 with protect, constant(uar_get_code_by("MEANING",8,"INERROR"))
declare c_administered_cd			= f8 with protect, constant(uar_get_code_by("MEANING",4000040,"TASKCOMPLETE")) ;057
 
 
 
/**************************************************************************
;DECLARE SUBROUTINES
***************************************************************************/
declare ParseEventComponents(sComponents = vc)		= null with protect
declare ParseLocations(sLocFacilities = vc)			= null with protect
declare GetMedAdmins(null)							= null with protect
declare GetOrderIngredients (null)				 	= null with protect 	;009
declare GetRxNorm(null)								= null with protect
declare GetNDC(null)								= null with protect
declare GetAdminNotes(null)							= null with protect
declare GetTasks(null)                              = null with protect
declare GetAdminIngredId(null)                      = null with protect
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
set iIncTasks                       = cnvtint($INC_TASKS)
set iDebugFlag						= cnvtint($DEBUG_FLAG)
set iTimeMax						= cnvtint($TIME_MAX)
 
; Dates
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
	call echo(build("TASK FLAG -> ",iIncTasks))
	call echo(build("MRN ->  ", c_mrn_encounter_alias_type_cd))
	call echo(build("FIN ->  ", c_finnbr_encntr_alias_type_cd))
	call echo(build("MNEMONIC TYPE CD -> ",c_primary_mnemonic_type_cd))
	call echo(build("MAP TYPE CD -> ", c_rxnorm_map_type_cd))
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
 
; Get Admin Notes
call GetAdminNotes(null)
 
; Get Tasks associated to event
if(iIncTasks > 0)
	call GetTasks(null)
endif
 
;get the Administered Ingredient Id
call GetAdminIngredId(null)
 
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
		set sComponentParser = "1 = 1"
	endif
 
	set LocSize = size(loc_req->codes,5)
 
	;Set expand control value - 023
	if(LocSize > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	; Get initial set of event ids without other restrictions - performance improvement - 031
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select
		if(LocSize > 0)
			from clinical_event   ce
				,med_admin_event mae
				, encounter e
				,ce_med_result cmr
			plan ce where ce.updt_dt_tm >= cnvtdatetime(qFromDateTime)
				and ce.updt_dt_tm <= cnvtdatetime(qToDateTime)
				and ce.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)	;036
				and parser(sComponentParser)
				and ce.view_level = 1
			join e where e.encntr_id = ce.encntr_id
				and expand(ndx2,1,LocSize,e.loc_facility_cd,loc_req->codes[ndx2].code_value)
			join mae
				where (mae.event_id = ce.event_id or mae.event_id = ce.parent_event_id)
					and mae.event_type_cd != c_taskpurged_event_type_cd
			join cmr
				where cmr.event_id = outerjoin(ce.event_id)
			order by ce.updt_dt_tm,ce.clinical_event_id
		else
			from clinical_event   ce
				,med_admin_event mae
				,ce_med_result cmr
			plan ce
				where ce.updt_dt_tm >= cnvtdatetime(qFromDateTime)
					and ce.updt_dt_tm <= cnvtdatetime(qToDateTime)
					and ce.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)	;036
					and parser(sComponentParser)
					and ce.view_level = 1
			join mae
				where (mae.event_id = ce.event_id or mae.event_id = ce.parent_event_id)
					and mae.event_type_cd != c_taskpurged_event_type_cd
			join cmr
				where cmr.event_id = outerjoin(ce.event_id)
			order by ce.updt_dt_tm, ce.clinical_event_id
		endif
	into "nl:"
 
	head report
		x = 0
		max_reached = 0
 
	head ce.updt_dt_tm
		if(x > iMaxRecs)
			max_reached = 1
		endif
	head ce.clinical_event_id
		if(max_reached = 0)
 
			x = x + 1
			stat = alterlist(pop_medadmins_reply_out->medadmins,x)
 
 			;Med Admin Event
 			pop_medadmins_reply_out->medadmins[x].admin_status_cd = mae.event_type_cd
 			;flexing to in_error status if in error
 			if(ce.result_status_cd = c_inerror_status_cd)
 				pop_medadmins_reply_out->medadmins[x].admin_status_cd_disp = uar_get_code_display(ce.result_status_cd)
 			else
				pop_medadmins_reply_out->medadmins[x].admin_status_cd_disp = uar_get_code_display(mae.event_type_cd)
			endif
			pop_medadmins_reply_out->medadmins[x].admin_dt_tm = mae.end_dt_tm
 
			;Clinical Event
			pop_medadmins_reply_out->medadmins[x].created_updated_date_time = ce.updt_dt_tm
			pop_medadmins_reply_out->medadmins[x].parent_event_id = ce.parent_event_id
			pop_medadmins_reply_out->medadmins[x].event_title_text = ce.event_title_text
			pop_medadmins_reply_out->medadmins[x].primary_key_id = ce.clinical_event_id
			pop_medadmins_reply_out->medadmins[x].medadmin_id = ce.event_id
			pop_medadmins_reply_out->medadmins[x].person_id = ce.person_id
			pop_medadmins_reply_out->medadmins[x].component_id = ce.event_cd
			pop_medadmins_reply_out->medadmins[x].clinsig_updt_dt_tm = ce.event_end_dt_tm
			pop_medadmins_reply_out->medadmins[x].update_dt_tm = ce.updt_dt_tm
			pop_medadmins_reply_out->medadmins[x].order_id = ce.order_id
			pop_medadmins_reply_out->medadmins[x].catalog_cd = ce.catalog_cd
			pop_medadmins_reply_out->medadmins[x].result_status_cd = ce.result_status_cd
			pop_medadmins_reply_out->medadmins[x].result_status = uar_get_code_display(ce.result_status_cd)
			pop_medadmins_reply_out->medadmins[x].event_tag = ce.event_tag
			pop_medadmins_reply_out->medadmins[x].event_class_cd = ce.event_class_cd
			pop_medadmins_reply_out->medadmins[x].event_class_disp = uar_get_code_display(ce.event_class_cd)
			pop_medadmins_reply_out->medadmins[x].unit_cd = ce.result_units_cd
			pop_medadmins_reply_out->medadmins[x].unit_disp = uar_get_code_display(ce.result_units_cd)
			pop_medadmins_reply_out->medadmins[x].system.id = ce.contributor_system_cd
			pop_medadmins_reply_out->medadmins[x].system.name = uar_get_code_display(ce.contributor_system_cd)
			pop_medadmins_reply_out->medadmins[x].med_scanned_ind = mae.positive_med_ident_ind
			pop_medadmins_reply_out->medadmins[x].pt_scanned_ind = mae.positive_patient_ident_ind
 
			;CE Med Result
			pop_medadmins_reply_out->medadmins[x].admin_note = cmr.admin_note
			;flexes the DocumentedDateTime to the event_end_dt_tm if no admin_start_dt_tm
			if(cmr.admin_start_dt_tm != NULL)
				pop_medadmins_reply_out->medadmins[x].admin_start_dt_tm = cmr.admin_start_dt_tm
            else
				pop_medadmins_reply_out->medadmins[x].admin_start_dt_tm = mae.end_dt_tm
			endif
			;057 flexes the valid_from_date (administration date tim)to the event_end_dt_tm if no valid_from_dt_tm
			if(cmr.valid_from_dt_tm  != NULL)
				pop_medadmins_reply_out->medadmins[x].valid_from_date  = cmr.valid_from_dt_tm
            elseif (mae.event_type_cd = c_administered_cd or ce.result_status_cd = c_inerror_status_cd )
				pop_medadmins_reply_out->medadmins[x].valid_from_date  = ce.event_end_dt_tm
			endif
 
			pop_medadmins_reply_out->medadmins[x].admin_end_dt_tm = cmr.admin_end_dt_tm
			pop_medadmins_reply_out->medadmins[x].admin_route_cd = cmr.admin_route_cd
			pop_medadmins_reply_out->medadmins[x].admin_route_disp = uar_get_code_display(cmr.admin_route_cd)
			pop_medadmins_reply_out->medadmins[x].admin_site_cd = cmr.admin_site_cd
			pop_medadmins_reply_out->medadmins[x].admin_site_disp = uar_get_code_display(cmr.admin_site_cd)
			pop_medadmins_reply_out->medadmins[x].admin_method_cd = cmr.admin_method_cd
			pop_medadmins_reply_out->medadmins[x].admin_method_disp = uar_get_code_display(cmr.admin_method_cd)
			pop_medadmins_reply_out->medadmins[x].admin_pt_loc_cd = cmr.admin_pt_loc_cd
			pop_medadmins_reply_out->medadmins[x].admin_pt_loc_disp = uar_get_code_display(cmr.admin_pt_loc_cd)
			pop_medadmins_reply_out->medadmins[x].initial_dosage = cmr.initial_dosage
			pop_medadmins_reply_out->medadmins[x].admin_dosage = cmr.admin_dosage
			pop_medadmins_reply_out->medadmins[x].dosage_unit_cd = cmr.dosage_unit_cd
			pop_medadmins_reply_out->medadmins[x].dosage_unit_disp = uar_get_code_display(cmr.dosage_unit_cd)
			pop_medadmins_reply_out->medadmins[x].total_intake_volume = cmr.total_intake_volume
			pop_medadmins_reply_out->medadmins[x].diluent_type_cd = cmr.diluent_type_cd
			pop_medadmins_reply_out->medadmins[x].diluent_type_disp = uar_get_code_display(cmr.diluent_type_cd)
			pop_medadmins_reply_out->medadmins[x].ph_dispense_id = cmr.ph_dispense_id
			pop_medadmins_reply_out->medadmins[x].diluent_type_cd = cmr.diluent_type_cd
			pop_medadmins_reply_out->medadmins[x].infusion_rate = cmr.infusion_rate
			pop_medadmins_reply_out->medadmins[x].infusion_unit_cd = cmr.infusion_unit_cd
			pop_medadmins_reply_out->medadmins[x].infusion_unit_disp = uar_get_code_display(cmr.infusion_unit_cd)
			pop_medadmins_reply_out->medadmins[x].infusion_time_cd = cmr.infusion_unit_cd
			pop_medadmins_reply_out->medadmins[x].infusion_time_cd_disp = uar_get_code_display(cmr.infusion_time_cd)
			pop_medadmins_reply_out->medadmins[x].medication_form_cd = cmr.medication_form_cd
			pop_medadmins_reply_out->medadmins[x].medication_form_disp = uar_get_code_display(cmr.medication_form_cd)
			pop_medadmins_reply_out->medadmins[x].admin_strength = cmr.admin_strength
			pop_medadmins_reply_out->medadmins[x].admin_strength_unit_cd = cmr.admin_strength_unit_cd
			pop_medadmins_reply_out->medadmins[x].admin_strength_unit_disp = uar_get_code_display(cmr.admin_strength_unit_cd)
			pop_medadmins_reply_out->medadmins[x].substance_exp_dt_tm = cmr.substance_exp_dt_tm
			pop_medadmins_reply_out->medadmins[x].substance_lot_number = cmr.substance_lot_number
			pop_medadmins_reply_out->medadmins[x].substance_manufacturer_cd = cmr.substance_manufacturer_cd
			pop_medadmins_reply_out->medadmins[x].substance_manufacturer_disp = uar_get_code_display(cmr.substance_manufacturer_cd)
			pop_medadmins_reply_out->medadmins[x].refusal_cd 	= cmr.refusal_cd
			pop_medadmins_reply_out->medadmins[x].refusal_cd_disp = uar_get_code_display(cmr.refusal_cd)
			pop_medadmins_reply_out->medadmins[x].system_entry_dt_tm 	= cmr.system_entry_dt_tm
			pop_medadmins_reply_out->medadmins[x].infused_volume 	= cmr.infused_volume
			pop_medadmins_reply_out->medadmins[x].infused_volume_unit_cd 	= cmr.infused_volume_unit_cd
			pop_medadmins_reply_out->medadmins[x].infused_volume_unit_disp = uar_get_code_display(cmr.infused_volume_unit_cd)
			pop_medadmins_reply_out->medadmins[x].remaining_volume = cmr.remaining_volume
			pop_medadmins_reply_out->medadmins[x].remaining_volume_unit_cd = cmr.remaining_volume_unit_cd
			pop_medadmins_reply_out->medadmins[x].remaining_volume_unit_disp = uar_get_code_display(cmr.remaining_volume_unit_cd)
			pop_medadmins_reply_out->medadmins[x].synonym_id = cmr.synonym_id
			pop_medadmins_reply_out->medadmins[x].immunization_type_cd = cmr.immunization_type_cd
			pop_medadmins_reply_out->medadmins[x].immunization_type_disp = uar_get_code_display(cmr.immunization_type_cd)
			pop_medadmins_reply_out->medadmins[x].admin_start_tz = cmr.admin_start_tz
			pop_medadmins_reply_out->medadmins[x].admin_end_tz = cnvtstring(cmr.admin_end_tz)
			if(cmr.initial_volume > 0)
				pop_medadmins_reply_out->medadmins[x].initial_volume = cmr.initial_volume
				pop_medadmins_reply_out->medadmins[x].initial_volume_unit.id = cmr.dosage_unit_cd
				pop_medadmins_reply_out->medadmins[x].initial_volume_unit.name = uar_get_code_display(cmr.dosage_unit_cd)
			endif
			if(cmr.iv_event_cd > 0)
				pop_medadmins_reply_out->medadmins[x].bag_number = trim(cmr.substance_lot_number,3)
				pop_medadmins_reply_out->medadmins[x].iv_event.id = cmr.iv_event_cd
				pop_medadmins_reply_out->medadmins[x].iv_event.name = uar_get_code_display(cmr.iv_event_cd)
			endif
 
			;person
			pop_medadmins_reply_out->medadmins[x]->person->person_id = ce.person_id
			pop_medadmins_reply_out->medadmins[x].person_id = ce.person_id
			;encounter
			pop_medadmins_reply_out->medadmins[x]->encounter->encounter_id = ce.encntr_id
 
			;performed_prnsl
			pop_medadmins_reply_out->medadmins[x].admin_prov_id = ce.performed_prsnl_id
 
			;order
			pop_medadmins_reply_out->medadmins[x].orders.order_id = ce.order_id
			pop_medadmins_reply_out->medadmins[x].order_id = ce.order_id
 		endif
	foot report
		pop_medadmins_reply_out->medadmins_count = x
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag)
 		call echo(build("------Qual Cnt = ",pop_medadmins_reply_out->medadmins_count))
 	endif
 
 	;getting the medAdmins that don't flow through med_admin_event
 
	;Set expand control value - 023
	if(LocSize > 200 or pop_medadmins_reply_out->medadmins_count > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
 	set numb = 1
 		set queryStartTm = cnvtdatetime(curdate, curtime3)
	select
		if(LocSize > 0)
			from clinical_event   ce
				, encounter e
				,ce_med_result cmr
			plan ce where ce.updt_dt_tm >= cnvtdatetime(qFromDateTime)
				and ce.updt_dt_tm <= cnvtdatetime(qToDateTime)
				and not expand(numb,1, pop_medadmins_reply_out->medadmins_count,ce.event_id
													,pop_medadmins_reply_out->medadmins[numb].medadmin_id)
				and ce.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)	;036
				and parser(sComponentParser)
				and ce.view_level = 1
			join e where e.encntr_id = ce.encntr_id
				and expand(ndx2,1,LocSize,e.loc_facility_cd,loc_req->codes[ndx2].code_value)
			join cmr
				where cmr.event_id = ce.event_id
			order by ce.updt_dt_tm,ce.clinical_event_id
 
		else
			from clinical_event   ce
				,ce_med_result cmr
			plan ce
				where ce.updt_dt_tm >= cnvtdatetime(qFromDateTime)
					and ce.updt_dt_tm <= cnvtdatetime(qToDateTime)
					and not expand(numb,1, pop_medadmins_reply_out->medadmins_count,ce.event_id
													,pop_medadmins_reply_out->medadmins[numb].medadmin_id)
 
					and ce.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)	;036
					and parser(sComponentParser)
					and ce.view_level = 1
			join cmr
				where cmr.event_id = ce.event_id
			order by ce.updt_dt_tm, ce.clinical_event_id
 
		endif
	into "nl:"
 
	head report
		x = pop_medadmins_reply_out->medadmins_count
		max_reached = 0
 
	head ce.updt_dt_tm
		if(x > iMaxRecs)
			max_reached = 1
		endif
	head ce.clinical_event_id
		if(max_reached = 0)
			x = x + 1
			stat = alterlist(pop_medadmins_reply_out->medadmins,x)
 
 			;Clinical Event
			pop_medadmins_reply_out->medadmins[x].admin_dt_tm = ce.event_end_dt_tm
			pop_medadmins_reply_out->medadmins[x].admin_status_cd_disp = uar_get_code_display(ce.result_status_cd)
			pop_medadmins_reply_out->medadmins[x].created_updated_date_time = ce.updt_dt_tm
			pop_medadmins_reply_out->medadmins[x].parent_event_id = ce.parent_event_id
			pop_medadmins_reply_out->medadmins[x].event_title_text = ce.event_title_text
			pop_medadmins_reply_out->medadmins[x].primary_key_id = ce.clinical_event_id
			pop_medadmins_reply_out->medadmins[x].medadmin_id = ce.event_id
			pop_medadmins_reply_out->medadmins[x].person_id = ce.person_id
			pop_medadmins_reply_out->medadmins[x].component_id = ce.event_cd
			pop_medadmins_reply_out->medadmins[x].clinsig_updt_dt_tm = ce.event_end_dt_tm
			pop_medadmins_reply_out->medadmins[x].update_dt_tm = ce.updt_dt_tm
			pop_medadmins_reply_out->medadmins[x].order_id = ce.order_id
			pop_medadmins_reply_out->medadmins[x].catalog_cd = ce.catalog_cd
			pop_medadmins_reply_out->medadmins[x].result_status_cd = ce.result_status_cd
			pop_medadmins_reply_out->medadmins[x].result_status = uar_get_code_display(ce.result_status_cd)
			pop_medadmins_reply_out->medadmins[x].event_tag = ce.event_tag
			pop_medadmins_reply_out->medadmins[x].event_class_cd = ce.event_class_cd
			pop_medadmins_reply_out->medadmins[x].event_class_disp = uar_get_code_display(ce.event_class_cd)
			pop_medadmins_reply_out->medadmins[x].unit_cd = ce.result_units_cd
			pop_medadmins_reply_out->medadmins[x].unit_disp = uar_get_code_display(ce.result_units_cd)
			pop_medadmins_reply_out->medadmins[x].system.id = ce.contributor_system_cd
			pop_medadmins_reply_out->medadmins[x].system.name = uar_get_code_display(ce.contributor_system_cd)
 
			;CE Med Result
			pop_medadmins_reply_out->medadmins[x].admin_note = cmr.admin_note
			pop_medadmins_reply_out->medadmins[x].admin_start_dt_tm = cmr.admin_start_dt_tm
 
			;057 flexes the valid_from_date (administration date tim)to the event_end_dt_tm if no valid_from_dt_tm
			pop_medadmins_reply_out->medadmins[x].valid_from_date  = cmr.valid_from_dt_tm
 
 
			pop_medadmins_reply_out->medadmins[x].admin_end_dt_tm = cmr.admin_end_dt_tm
			pop_medadmins_reply_out->medadmins[x].admin_route_cd = cmr.admin_route_cd
			pop_medadmins_reply_out->medadmins[x].admin_route_disp = uar_get_code_display(cmr.admin_route_cd)
			pop_medadmins_reply_out->medadmins[x].admin_site_cd = cmr.admin_site_cd
			pop_medadmins_reply_out->medadmins[x].admin_site_disp = uar_get_code_display(cmr.admin_site_cd)
			pop_medadmins_reply_out->medadmins[x].admin_method_cd = cmr.admin_method_cd
			pop_medadmins_reply_out->medadmins[x].admin_method_disp = uar_get_code_display(cmr.admin_method_cd)
			pop_medadmins_reply_out->medadmins[x].admin_pt_loc_cd = cmr.admin_pt_loc_cd
			pop_medadmins_reply_out->medadmins[x].admin_pt_loc_disp = uar_get_code_display(cmr.admin_pt_loc_cd)
			pop_medadmins_reply_out->medadmins[x].initial_dosage = cmr.initial_dosage
			pop_medadmins_reply_out->medadmins[x].admin_dosage = cmr.admin_dosage
			pop_medadmins_reply_out->medadmins[x].dosage_unit_cd = cmr.dosage_unit_cd
			pop_medadmins_reply_out->medadmins[x].dosage_unit_disp = uar_get_code_display(cmr.dosage_unit_cd)
			pop_medadmins_reply_out->medadmins[x].total_intake_volume = cmr.total_intake_volume
			pop_medadmins_reply_out->medadmins[x].diluent_type_cd = cmr.diluent_type_cd
			pop_medadmins_reply_out->medadmins[x].diluent_type_disp = uar_get_code_display(cmr.diluent_type_cd)
			pop_medadmins_reply_out->medadmins[x].ph_dispense_id = cmr.ph_dispense_id
			pop_medadmins_reply_out->medadmins[x].diluent_type_cd = cmr.diluent_type_cd
			pop_medadmins_reply_out->medadmins[x].infusion_rate = cmr.infusion_rate
			pop_medadmins_reply_out->medadmins[x].infusion_unit_cd = cmr.infusion_unit_cd
			pop_medadmins_reply_out->medadmins[x].infusion_unit_disp = uar_get_code_display(cmr.infusion_unit_cd)
			pop_medadmins_reply_out->medadmins[x].infusion_time_cd = cmr.infusion_unit_cd
			pop_medadmins_reply_out->medadmins[x].infusion_time_cd_disp = uar_get_code_display(cmr.infusion_time_cd)
			pop_medadmins_reply_out->medadmins[x].medication_form_cd = cmr.medication_form_cd
			pop_medadmins_reply_out->medadmins[x].medication_form_disp = uar_get_code_display(cmr.medication_form_cd)
			pop_medadmins_reply_out->medadmins[x].admin_strength = cmr.admin_strength
			pop_medadmins_reply_out->medadmins[x].admin_strength_unit_cd = cmr.admin_strength_unit_cd
			pop_medadmins_reply_out->medadmins[x].admin_strength_unit_disp = uar_get_code_display(cmr.admin_strength_unit_cd)
			pop_medadmins_reply_out->medadmins[x].substance_exp_dt_tm = cmr.substance_exp_dt_tm
			pop_medadmins_reply_out->medadmins[x].substance_lot_number = cmr.substance_lot_number
			pop_medadmins_reply_out->medadmins[x].substance_manufacturer_cd = cmr.substance_manufacturer_cd
			pop_medadmins_reply_out->medadmins[x].substance_manufacturer_disp = uar_get_code_display(cmr.substance_manufacturer_cd)
			pop_medadmins_reply_out->medadmins[x].refusal_cd 	= cmr.refusal_cd
			pop_medadmins_reply_out->medadmins[x].refusal_cd_disp = uar_get_code_display(cmr.refusal_cd)
			pop_medadmins_reply_out->medadmins[x].system_entry_dt_tm 	= cmr.system_entry_dt_tm
			pop_medadmins_reply_out->medadmins[x].infused_volume 	= cmr.infused_volume
			pop_medadmins_reply_out->medadmins[x].infused_volume_unit_cd 	= cmr.infused_volume_unit_cd
			pop_medadmins_reply_out->medadmins[x].infused_volume_unit_disp = uar_get_code_display(cmr.infused_volume_unit_cd)
			pop_medadmins_reply_out->medadmins[x].remaining_volume = cmr.remaining_volume
			pop_medadmins_reply_out->medadmins[x].remaining_volume_unit_cd = cmr.remaining_volume_unit_cd
			pop_medadmins_reply_out->medadmins[x].remaining_volume_unit_disp = uar_get_code_display(cmr.remaining_volume_unit_cd)
			pop_medadmins_reply_out->medadmins[x].synonym_id = cmr.synonym_id
			pop_medadmins_reply_out->medadmins[x].immunization_type_cd = cmr.immunization_type_cd
			pop_medadmins_reply_out->medadmins[x].immunization_type_disp = uar_get_code_display(cmr.immunization_type_cd)
			pop_medadmins_reply_out->medadmins[x].admin_start_tz = cmr.admin_start_tz
			pop_medadmins_reply_out->medadmins[x].admin_end_tz = cnvtstring(cmr.admin_end_tz)
			if(cmr.initial_volume > 0)
				pop_medadmins_reply_out->medadmins[x].initial_volume = cmr.initial_volume
				pop_medadmins_reply_out->medadmins[x].initial_volume_unit.id = cmr.dosage_unit_cd
				pop_medadmins_reply_out->medadmins[x].initial_volume_unit.name = uar_get_code_display(cmr.dosage_unit_cd)
			endif
			if(cmr.iv_event_cd > 0)
				pop_medadmins_reply_out->medadmins[x].bag_number = trim(cmr.substance_lot_number,3)
				pop_medadmins_reply_out->medadmins[x].iv_event.id = cmr.iv_event_cd
				pop_medadmins_reply_out->medadmins[x].iv_event.name = uar_get_code_display(cmr.iv_event_cd)
			endif
 
			;person
			pop_medadmins_reply_out->medadmins[x]->person->person_id = ce.person_id
			pop_medadmins_reply_out->medadmins[x].person_id = ce.person_id
			;encounter
			pop_medadmins_reply_out->medadmins[x]->encounter->encounter_id = ce.encntr_id
 
			;performed_prnsl
			pop_medadmins_reply_out->medadmins[x].admin_prov_id = ce.performed_prsnl_id
 
			;order
			pop_medadmins_reply_out->medadmins[x].orders.order_id = ce.order_id
			pop_medadmins_reply_out->medadmins[x].order_id = ce.order_id
 		endif
	foot report
		pop_medadmins_reply_out->medadmins_count = x
	with nocounter, time = value(timeOutThreshold), expand = value(exp)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag)
 		call echo(build("------Qual Cnt = ",pop_medadmins_reply_out->medadmins_count))
 	endif
 
	; Populate audit
	if(pop_medadmins_reply_out->medadmins_count > 0)
		call ErrorHandler("EXECUTE", "S", "Success", "Get Pop MedAdmins completed successfully.", pop_medadmins_reply_out)
	else
		call ErrorHandler("EXECUTE", "Z", "No Data.", "No records qualify.", pop_medadmins_reply_out)
		go to EXIT_SCRIPT
	endif
 
 
	;getting person and encounter info
	set idx = 1
	if(pop_medadmins_reply_out->medadmins_count > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from encounter e
		,person p
		,encntr_alias ea1
		,encntr_alias ea2
	plan e where expand(idx,1,pop_medadmins_reply_out->medadmins_count,e.encntr_id,
		pop_medadmins_reply_out->medadmins[idx].encounter.encounter_id)
	join p where p.person_id = e.person_id
	join ea1 where ea1.encntr_id = outerjoin(e.encntr_id)
			and ea1.encntr_alias_type_cd = outerjoin(c_finnbr_encntr_alias_type_cd)
			and ea1.active_ind = outerjoin(1)
			and ea1.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
			and ea1.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
	join ea2 where ea2.encntr_id = outerjoin(e.encntr_id)
			and ea2.encntr_alias_type_cd = outerjoin(c_mrn_encounter_alias_type_cd)
			and ea2.active_ind = outerjoin(1)
			and ea2.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
			and ea2.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
	order by e.encntr_id
	head e.encntr_id
		next = 1
		pos = locateval(idx,next,pop_medadmins_reply_out->medadmins_count,e.encntr_id,
			pop_medadmins_reply_out->medadmins[idx].encounter.encounter_id)
		while(pos > 0 and next <= pop_medadmins_reply_out->medadmins_count)
			;person
			pop_medadmins_reply_out->medadmins[pos]->person->name_full_formatted = p.name_full_formatted
			pop_medadmins_reply_out->medadmins[pos]->person->name_first = p.name_first
			pop_medadmins_reply_out->medadmins[pos]->person->name_last = p.name_last
			pop_medadmins_reply_out->medadmins[pos]->person->name_middle = p.name_middle
			pop_medadmins_reply_out->medadmins[pos]->person->mrn = ea2.alias
			pop_medadmins_reply_out->medadmins[pos]->person->dob = p.birth_dt_tm ;010
			pop_medadmins_reply_out->medadmins[pos]->person->gender_id = p.sex_cd ;010
			pop_medadmins_reply_out->medadmins[pos]->person->gender_disp = uar_get_code_display(p.sex_cd);010
			pop_medadmins_reply_out->medadmins[pos]->person->sDOB =
			datetimezoneformat(p.birth_dt_tm,p.birth_tz,"YYYY-MM-DD",curtimezonedef);029
 
			;ecnounter
			pop_medadmins_reply_out->medadmins[pos]->encounter->encounter_type_cd = e.encntr_type_cd
			pop_medadmins_reply_out->medadmins[pos]->encounter->encounter_type_disp = uar_get_code_display(e.encntr_type_cd)
			pop_medadmins_reply_out->medadmins[pos]->encounter->encounter_type_class_cd = e.encntr_type_class_cd
			pop_medadmins_reply_out->medadmins[pos]->encounter->encounter_type_class_disp =
			uar_get_code_display(e.encntr_type_class_cd)
			pop_medadmins_reply_out->medadmins[pos]->encounter->arrive_date = e.arrive_dt_tm
			if (e.arrive_dt_tm is null)
				pop_medadmins_reply_out->medadmins[pos]->encounter->arrive_date = e.reg_dt_tm
			endif
			pop_medadmins_reply_out->medadmins[pos]->encounter->discharge_date = e.disch_dt_tm
			pop_medadmins_reply_out->medadmins[pos]->encounter->fin_nbr = ea1.alias
 
			;Encounter Location
			pop_medadmins_reply_out->medadmins[pos]->encounter->patient_location->location_cd = e.location_cd
			pop_medadmins_reply_out->medadmins[pos]->encounter->patient_location->location_disp =
				uar_get_code_display(e.location_cd)
			pop_medadmins_reply_out->medadmins[pos]->encounter->patient_location->loc_bed_cd = e.loc_bed_cd
			pop_medadmins_reply_out->medadmins[pos]->encounter->patient_location->loc_bed_disp =
				uar_get_code_display(e.loc_bed_cd)
			pop_medadmins_reply_out->medadmins[pos]->encounter->patient_location->loc_building_cd = e.loc_building_cd
			pop_medadmins_reply_out->medadmins[pos]->encounter->patient_location->loc_building_disp =
				uar_get_code_display(e.loc_building_cd)
			pop_medadmins_reply_out->medadmins[pos]->encounter->patient_location->loc_facility_cd = e.loc_facility_cd
			pop_medadmins_reply_out->medadmins[pos]->encounter->patient_location->loc_facility_disp =
				uar_get_code_display(e.loc_facility_cd)
			pop_medadmins_reply_out->medadmins[pos]->encounter->patient_location->loc_nurse_unit_cd = e.loc_nurse_unit_cd
			pop_medadmins_reply_out->medadmins[pos]->encounter->patient_location->loc_nurse_unit_disp =
				uar_get_code_display(e.loc_nurse_unit_cd)
			pop_medadmins_reply_out->medadmins[pos]->encounter->patient_location->loc_room_cd = e.loc_room_cd
			pop_medadmins_reply_out->medadmins[pos]->encounter->patient_location->loc_room_disp =
				uar_get_code_display(e.loc_room_cd)
			pop_medadmins_reply_out->medadmins[pos]->encounter->patient_location->loc_temp_cd = e.loc_temp_cd
			pop_medadmins_reply_out->medadmins[pos]->encounter->patient_location->loc_temp_disp =
				uar_get_code_display(e.loc_temp_cd)
 
			next = pos + 1
			pos = locateval(idx,next,pop_medadmins_reply_out->medadmins_count,e.encntr_id,
			pop_medadmins_reply_out->medadmins[idx].encounter.encounter_id)
		endwhile
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	;getting the admin provider
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	set idx = 0
	select into "nl:"
	from prsnl p
	plan p
		where expand(idx,1,pop_medadmins_reply_out->medadmins_count,p.person_id
								,pop_medadmins_reply_out->medadmins[idx].admin_prov_id)
	order by p.person_id
	head p.person_id
		next = 1
		pos = locateval(idx,next,pop_medadmins_reply_out->medadmins_count,p.person_id,
			pop_medadmins_reply_out->medadmins[idx].admin_prov_id)
		while(pos > 0 and next <= pop_medadmins_reply_out->medadmins_count)
 
			pop_medadmins_reply_out->medadmins[pos].admin_provider = trim(p.name_full_formatted)
 
			next = pos + 1
 			pos = locateval(idx,next,pop_medadmins_reply_out->medadmins_count,p.person_id,
 				pop_medadmins_reply_out->medadmins[idx].admin_prov_id)
		endwhile
 
	 with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
    ;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	;getting the ordering info
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from orders o
	     ,order_action oa
	     , prsnl p
	plan o
		where expand(idx,1,pop_medadmins_reply_out->medadmins_count,o.order_id,pop_medadmins_reply_out->medadmins[idx].orders.order_id)
			and o.order_id > 0
	join oa;switching to outerjoin because some rare cases are not filling in ordering_provider for some reason on meds
		where oa.order_id = outerjoin(o.order_id)
			and oa.action_type_cd = outerjoin(c_order_action_type_cd)
	join p
		where p.person_id = outerjoin(oa.order_provider_id)
			and p.active_ind = outerjoin(1)
	order by o.order_id
	head o.order_id
		next = 1
		pos = locateval(idx,next,pop_medadmins_reply_out->medadmins_count,o.order_id,
			pop_medadmins_reply_out->medadmins[idx].orders.order_id)
		while(pos > 0 and next <= pop_medadmins_reply_out->medadmins_count)
			pop_medadmins_reply_out->medadmins[pos].orders.last_ingred_seq = o.last_ingred_action_sequence
			pop_medadmins_reply_out->medadmins[pos].orders.medication_id = o.synonym_id
			pop_medadmins_reply_out->medadmins[pos].orders.medication_desc = o.order_mnemonic
			pop_medadmins_reply_out->medadmins[pos]->orders.order_status_cd = o.order_status_cd
			pop_medadmins_reply_out->medadmins[pos]->orders.order_status_disp = uar_get_code_display(o.order_status_cd)
			pop_medadmins_reply_out->medadmins[pos]->orders.current_start_dt_tm	= o.current_start_dt_tm
			pop_medadmins_reply_out->medadmins[pos]->orders.current_start_tz = o.current_start_tz
			pop_medadmins_reply_out->medadmins[pos]->orders.projected_stop_dt_tm  = o.projected_stop_dt_tm
			pop_medadmins_reply_out->medadmins[pos]->orders.projected_stop_tz = o.projected_stop_tz
			pop_medadmins_reply_out->medadmins[pos]->orders.ordering_provider_id = oa.order_provider_id
			pop_medadmins_reply_out->medadmins[pos]->orders.ordering_provider = trim(p.name_full_formatted)
			pop_medadmins_reply_out->medadmins[pos]->orders.catalog_cd = o.catalog_cd
			pop_medadmins_reply_out->medadmins[pos]->orders.synonym_id = o.synonym_id
	 		pop_medadmins_reply_out->medadmins[pos]->orders.parent_order_id = o.template_order_id
 
	 		;parent_order ind
	 		if(o.template_order_id > 0)
	 			parent_order_ind = 1
	 		endif
 
 			next = pos + 1
 			pos = locateval(idx,next,pop_medadmins_reply_out->medadmins_count,o.order_id,
 				pop_medadmins_reply_out->medadmins[idx].orders.order_id)
 		endwhile
    with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
    ;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
 	;Get medication_item_id
    set idx = 1
    if(pop_medadmins_reply_out->medadmins_count > 200)
    	set exp = 2
    else
    	set exp = 0
    endif
 
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select distinct into "nl:"
	from  orders o
		, order_product op
		, order_product op2
		, synonym_item_r sir
	plan o where expand(idx,1,pop_medadmins_reply_out->medadmins_count,o.order_id,
					pop_medadmins_reply_out->medadmins[idx].orders.order_id)
	join op where op.order_id = outerjoin(o.order_id)
	join op2 where op2.order_id = outerjoin(o.template_order_id)
	join sir where sir.synonym_id = outerjoin(o.synonym_id)
	detail
		next = 1
		pos = locateval(idx,next,pop_medadmins_reply_out->medadmins_count,o.order_id,
					pop_medadmins_reply_out->medadmins[idx].order_id)
		while(pos > 0 and next <= pop_medadmins_reply_out->medadmins_count)
			if(op.item_id > 0)
				pop_medadmins_reply_out->medadmins[pos].orders.medication_item_id = op.item_id
			elseif(op2.item_id > 0)
				pop_medadmins_reply_out->medadmins[pos].orders.medication_item_id = op2.item_id
			else
				pop_medadmins_reply_out->medadmins[pos].orders.medication_item_id = sir.item_id
			endif
 
			next = pos + 1
			pos = locateval(idx,next,pop_medadmins_reply_out->medadmins_count,o.order_id,
					pop_medadmins_reply_out->medadmins[idx].order_id)
		endwhile
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	;getting Order_priroty and task class object
	set queryStartTm = cnvtdatetime(curdate, curtime3)
		select into "nl:"
		from order_detail od
		plan od
			where expand(idx,1,pop_medadmins_reply_out->medadmins_count,od.order_id,pop_medadmins_reply_out->medadmins[idx].orders.order_id)
				and od.oe_field_meaning = "RXPRIORITY"
				and od.order_id > 0
		order by od.order_id,od.action_sequence
		head od.order_id
			next = 1
			pos = locateval(idx,next,pop_medadmins_reply_out->medadmins_count,od.order_id,
				pop_medadmins_reply_out->medadmins[idx].orders.order_id)
		detail
			while(pos > 0 and next <= pop_medadmins_reply_out->medadmins_count)
				pop_medadmins_reply_out->medadmins[pos].orders.pharm_order_priority = trim(od.oe_field_display_value,3)
 
				next = pos + 1
				pos = locateval(idx,next,pop_medadmins_reply_out->medadmins_count,od.order_id,
					pop_medadmins_reply_out->medadmins[idx].orders.order_id)
			endwhile
		with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
		;keeping track of cumulative time out
		set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
		;exits the script because query timed out
		if(timeOutThreshold < 1)
			go to EXIT_SCRIPT
		endif
 
		;getting task_class
		set queryStartTm = cnvtdatetime(curdate, curtime3)
		select into "nl:"
		from task_activity ta
		plan ta
			where expand(idx,1,pop_medadmins_reply_out->medadmins_count,ta.event_id,pop_medadmins_reply_out->medadmins[idx].parent_event_id)
				and ta.active_ind = 1
				and ta.task_type_cd = c_medication_task_type_cd
		order by ta.event_id
		head ta.event_id
			next = 1
			pos = locateval(idx,next,pop_medadmins_reply_out->medadmins_count,ta.event_id,
				pop_medadmins_reply_out->medadmins[idx].parent_event_id)
			while(pos > 0 and next <= pop_medadmins_reply_out->medadmins_count)
				pop_medadmins_reply_out->medadmins[pos].task_class.description = trim(uar_get_code_description(ta.task_class_cd))
				pop_medadmins_reply_out->medadmins[pos].task_class.id = ta.task_class_cd
				pop_medadmins_reply_out->medadmins[pos].task_class.name = trim(uar_get_code_display(ta.task_activity_class_cd))
 
				next = pos + 1
				pos = locateval(idx,next,pop_medadmins_reply_out->medadmins_count,ta.event_id,
					pop_medadmins_reply_out->medadmins[idx].parent_event_id)
			endwhile
		with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
		;keeping track of cumulative time out
		set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
		;exits the script because query timed out
		if(timeOutThreshold < 1)
			go to EXIT_SCRIPT
		endif
 
 
		;getting the dispense_id
		set queryStartTm = cnvtdatetime(curdate, curtime3)
		set idx = 0
		select into "nl:"
		from dispense_hx dh
		plan dh
			where expand(idx,1,pop_medadmins_reply_out->medadmins_count,dh.event_id,pop_medadmins_reply_out->medadmins[idx].parent_event_id)
		order by dh.event_id, dh.dispense_hx_id
		head dh.event_id
			x = 0
			head dh.dispense_hx_id
				x = x + 1
				next = 1
				pos = locateval(idx,1,pop_medadmins_reply_out->medadmins_count,dh.event_id
									,pop_medadmins_reply_out->medadmins[idx].parent_event_id)
				while(pos > 0 and next <= pop_medadmins_reply_out->medadmins_count)
					stat = alterlist(pop_medadmins_reply_out->medadmins[pos].dispense_hx,x)
					pop_medadmins_reply_out->medadmins[pos].dispense_hx[x].dispense_hx_id = dh.dispense_hx_id
					pop_medadmins_reply_out->medadmins[pos].dispense_hx[x].dispense_dt_tm = dh.dispense_dt_tm
 
					next = pos + 1
					pos = locateval(idx,next,pop_medadmins_reply_out->medadmins_count,dh.event_id
									,pop_medadmins_reply_out->medadmins[idx].parent_event_id)
				endwhile
			with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
		;keeping track of cumulative time out
		set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
		;exits the script because query timed out
		if(timeOutThreshold < 1)
			go to EXIT_SCRIPT
		endif
 
 
 
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
 
 
	if(pop_medadmins_reply_out->medadmins_count > 100)
		set exp = 2
	else
		set exp = 0
	endif
 
	set idx = 1
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from order_ingredient oi
	     ,code_value_event_r cver
		 ,order_product op
	plan oi
		where expand(idx,1,pop_medadmins_reply_out->medadmins_count,oi.order_id,
						pop_medadmins_reply_out->medadmins[idx].order_id,
						 oi.action_sequence, pop_medadmins_reply_out->medadmins[idx].orders.last_ingred_seq)
			and oi.order_id > 0
	join cver
		where cver.parent_cd = oi.catalog_cd
	join op
		where op.order_id = outerjoin(oi.order_id)
			and op.ingred_sequence = outerjoin(oi.comp_sequence)
			and op.action_sequence = outerjoin(oi.action_sequence)
	order by oi.order_id,oi.comp_sequence
	head oi.order_id
		icnt = 0
	detail
		icnt = oi.comp_sequence
		next = 1
		pos = locateval(idx,next,pop_medadmins_reply_out->medadmins_count,oi.order_id,
		pop_medadmins_reply_out->medadmins[idx].order_id)
 
		while(pos > 0 and next <= pop_medadmins_reply_out->medadmins_count)
			stat = alterlist(pop_medadmins_reply_out->medadmins[pos].orders.ingred_list,icnt)
			;Order Ingredient
			pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->order_mnemonic = oi.order_mnemonic
			pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->order_detail_display_line = oi.order_detail_display_line
			pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->ordered_as_mnemonic = oi.ordered_as_mnemonic
			pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->synonym_id = oi.synonym_id
			pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->catalog_cd  =  oi.catalog_cd
			pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->catalog_disp = uar_get_code_display(oi.catalog_cd)
			pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->volume_value = oi.volume
			pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->volume_unit_disp = uar_get_code_display(oi.volume_unit)
			;converts strength to 3 decimal strength
			pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->strength = trim(cnvtstring(oi.strength,11,3))
			pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->strength_unit.name = uar_get_code_display(oi.strength_unit)
			pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->strength_dose_unit_disp
																						= uar_get_code_display(oi.strength_unit)
			pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->strength_dose = oi.strength
			pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->freetext_dose = oi.freetext_dose
			pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->frequency_cd = oi.freq_cd
			pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->frequency_disp = uar_get_code_display(oi.freq_cd)
			pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->comp_sequence = oi.comp_sequence
			pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->ingredient_type_flag = oi.ingredient_type_flag
			pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->iv_seq = oi.iv_seq
			pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->hna_order_mnemonic = oi.hna_order_mnemonic
			pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->dose_quantity = oi.dose_quantity
			pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->dose_quantity_unit = oi.dose_quantity_unit
			pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->normalized_rate = oi.normalized_rate
			pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->normalized_rate_unit_disp =
																				uar_get_code_display(oi.normalized_rate_unit_cd)
			pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->normalized_rate_unit_cd = oi.normalized_rate_unit_cd
			pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->concentration = oi.concentration
			pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->concentration_unit_cd = oi.concentration_unit_cd
			pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->concentration_unit_disp =
																				uar_get_code_display(oi.concentration_unit_cd)
			pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->include_in_total_volume_flag =
																				oi.include_in_total_volume_flag
			pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->ingredient_source_flag = oi.ingredient_source_flag
 
			;Code Value Event_R
			pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->event_cd = cver.event_cd
 
			; Item id
			;if(oi.synonym_id = pop_medadmins_reply_out->medadmins[pos]->orders.medication_id)
			;	pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt].item_id =
			;									pop_medadmins_reply_out->medadmins[pos]->orders.medication_item_id
			;else
				pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt].item_id = op.item_id
			;endif
 
	 		next = pos + 1
			pos = locateval(idx,next,pop_medadmins_reply_out->medadmins_count,oi.order_id,
				pop_medadmins_reply_out->medadmins[idx].order_id)
 
		endwhile
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	;getting the ingredient if it is a child order
	if(parent_order_ind > 0)
 
		;gets the last_ingred seq for the template order
		set queryStartTm = cnvtdatetime(curdate, curtime3)
		select into "nl:"
		from orders o
		     ,(dummyt d with seq = pop_medadmins_reply_out->medadmins_count)
		plan d
			where pop_medadmins_reply_out->medadmins[d.seq].orders.parent_order_id > 0
	    join o
	    	where o.order_id = pop_medadmins_reply_out->medadmins[d.seq].orders.parent_order_id
	    head d.seq
	    	 pop_medadmins_reply_out->medadmins[d.seq].orders.last_ingred_seq = o.last_ingred_action_sequence
	    with nocounter, time = value(timeOutThreshold)
 
	    ;keeping track of cumulative time out
		set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
		;exits the script because query timed out
		if(timeOutThreshold < 1)
			go to EXIT_SCRIPT
		endif
 
 
		;gets the order_ingred for the child
		set idx = 1
		set queryStartTm = cnvtdatetime(curdate, curtime3)
		select into "nl:"
		from order_ingredient oi
	     	,code_value_event_r cver
			 ,order_product op
		plan oi
			where expand(idx,1,pop_medadmins_reply_out->medadmins_count,oi.order_id,
						pop_medadmins_reply_out->medadmins[idx].orders.parent_order_id,
						 oi.action_sequence, pop_medadmins_reply_out->medadmins[idx].orders.last_ingred_seq)
				and oi.order_id > 0
		join cver
			where cver.parent_cd = oi.catalog_cd
		join op
			where op.order_id = outerjoin(oi.order_id)
				and op.ingred_sequence = outerjoin(oi.comp_sequence)
				and op.action_sequence = outerjoin(oi.action_sequence)
		order by oi.order_id,oi.comp_sequence
		head oi.order_id
			icnt = 0
		detail
			icnt = oi.comp_sequence
			next = 1
			pos = locateval(idx,next,pop_medadmins_reply_out->medadmins_count,oi.order_id,
							pop_medadmins_reply_out->medadmins[idx].orders.parent_order_id)
 
			while(pos > 0 and next <= pop_medadmins_reply_out->medadmins_count)
				stat = alterlist(pop_medadmins_reply_out->medadmins[pos].orders.ingred_list,icnt)
				;Order Ingredient
				pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->order_mnemonic = oi.order_mnemonic
				pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->order_detail_display_line = oi.order_detail_display_line
				pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->ordered_as_mnemonic = oi.ordered_as_mnemonic
				pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->synonym_id = oi.synonym_id
				pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->catalog_cd  =  oi.catalog_cd
				pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->catalog_disp = uar_get_code_display(oi.catalog_cd)
				pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->volume_value = oi.volume
				pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->volume_unit_disp = uar_get_code_display(oi.volume_unit)
				;cnvtstring to 3 decimal
				pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->strength = trim(cnvtstring(oi.strength,11,3))
				pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->strength_dose = oi.strength
				pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->strength_unit.id = oi.strength_unit
				pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->strength_unit.name = uar_get_code_display(oi.strength_unit)
				pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->strength_dose_unit_disp =
																				uar_get_code_display(oi.strength_unit)
				pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->freetext_dose = oi.freetext_dose
				pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->frequency_cd = oi.freq_cd
				pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->frequency_disp = uar_get_code_display(oi.freq_cd)
				pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->comp_sequence = oi.comp_sequence
				pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->ingredient_type_flag = oi.ingredient_type_flag
				pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->iv_seq = oi.iv_seq
				pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->hna_order_mnemonic = oi.hna_order_mnemonic
				pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->dose_quantity = oi.dose_quantity
				pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->dose_quantity_unit = oi.dose_quantity_unit
				pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->normalized_rate = oi.normalized_rate
				pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->normalized_rate_unit_disp =
																				uar_get_code_display(oi.normalized_rate_unit_cd)
				pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->normalized_rate_unit_cd = oi.normalized_rate_unit_cd
				pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->concentration = oi.concentration
				pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->concentration_unit_cd = oi.concentration_unit_cd
				pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->concentration_unit_disp =
																				uar_get_code_display(oi.concentration_unit_cd)
				pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->include_in_total_volume_flag =
																				oi.include_in_total_volume_flag
				pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->ingredient_source_flag = oi.ingredient_source_flag
 
				;Code Value Event_R
				pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt]->event_cd = cver.event_cd
 
				; Item id
				;if(oi.synonym_id = pop_medadmins_reply_out->medadmins[pos]->orders.medication_id)
				;	pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt].item_id =
				;								pop_medadmins_reply_out->medadmins[pos]->orders.medication_item_id
				;else
					pop_medadmins_reply_out->medadmins[pos]->orders->ingred_list[icnt].item_id = op.item_id
				;endif
 
	 			next = pos + 1
				pos = locateval(idx,next,pop_medadmins_reply_out->medadmins_count,oi.order_id,
											pop_medadmins_reply_out->medadmins[idx].orders.parent_order_id)
 
			endwhile
		with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
		;keeping track of cumulative time out
		set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
		;exits the script because query timed out
		if(timeOutThreshold < 1)
			go to EXIT_SCRIPT
		endif
     endif;parent_order_ind
 
 
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
 
	set idx = 1
	if(pop_medadmins_reply_out->medadmins_count > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
 	; Get Med RxNorms
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
 	from order_catalog_synonym ocs
    	,cmt_cross_map ccm
	plan ocs where expand(idx,1,pop_medadmins_reply_out->medadmins_count,ocs.synonym_id,
		pop_medadmins_reply_out->medadmins[idx].orders.synonym_id)
 	join ccm where ccm.concept_cki = ocs.concept_cki
 		and ccm.map_type_cd = c_rxnorm_map_type_cd
 	order by ocs.synonym_id
 	head ocs.synonym_id
		irx_cnt = 0
	detail
 		next = 1
		pos = locateval(idx,next,pop_medadmins_reply_out->medadmins_count,ocs.synonym_id,
			pop_medadmins_reply_out->medadmins[idx].orders.synonym_id)
 		irx_cnt = irx_cnt + 1
 
 		while(pos > 0 and next <= pop_medadmins_reply_out->medadmins_count)
			stat = alterlist(pop_medadmins_reply_out->medadmins[pos]->orders.rx_norm,irx_cnt)
 
			pop_medadmins_reply_out->medadmins[pos]->orders.rx_norm[irx_cnt].code = trim(ccm.source_identifier,3)
			pop_medadmins_reply_out->medadmins[pos]->orders.rx_norm[irx_cnt].code_type = trim(piece(ccm.target_concept_cki,"!",1,""),3)
			pop_medadmins_reply_out->medadmins[pos]->orders.rx_norm[irx_cnt].term_type = trim(piece(ccm.target_concept_cki,"!",1,""),3)
 
			next = pos + 1
			pos = locateval(idx,next,pop_medadmins_reply_out->medadmins_count,ocs.synonym_id,
				pop_medadmins_reply_out->medadmins[idx].orders.synonym_id)
		endwhile
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
 
	;Get Ingredient RxNorm
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from (dummyt d with seq = pop_medadmins_reply_out->medadmins_count)
		,(dummyt d2 with seq = 1)
		, order_catalog_synonym ocs
		, cmt_cross_map ccm
	plan d where maxrec(d2,size(pop_medadmins_reply_out->medadmins[d.seq].orders.ingred_list,5))
	join d2
	join ocs where ocs.synonym_id = pop_medadmins_reply_out->medadmins[d.seq].orders.ingred_list[d2.seq].synonym_id
	join ccm where ccm.concept_cki = ocs.concept_cki
 		and ccm.map_type_cd = c_rxnorm_map_type_cd
 	head d.seq
 		y = 0
 	head d2.seq
 		y = 0
 	detail
 		y = y + 1
 		stat = alterlist(pop_medadmins_reply_out->medadmins[d.seq].orders.ingred_list[d2.seq].rx_norm,y)
 
 		pop_medadmins_reply_out->medadmins[d.seq].orders.ingred_list[d2.seq].rx_norm[y].code = trim(ccm.source_identifier,3)
 		pop_medadmins_reply_out->medadmins[d.seq].orders.ingred_list[d2.seq].rx_norm[y].code_type =
 			trim(piece(ccm.target_concept_cki,"!",1,""),3)
 		pop_medadmins_reply_out->medadmins[d.seq].orders.ingred_list[d2.seq].rx_norm[y].term_type =
 			trim(piece(ccm.target_concept_cki,"!",1,""),3)
 
	with nocounter, time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetRxNorm Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end ;End Sub
 
/*************************************************************************
;  Name: GetNDC(null)
;  Description: This will retrieve the NDC value for a given event_id or for a given order catalog synonym
**************************************************************************/
subroutine GetNDC(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetNDC Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set idx = 1
	if(pop_medadmins_reply_out->medadmins_count > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
 	; Get Med NDC
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from med_identifier mi
	plan mi where expand(idx,1,pop_medadmins_reply_out->medadmins_count,mi.item_id,
		pop_medadmins_reply_out->medadmins[idx].orders.medication_item_id)
		and mi.med_identifier_type_cd = c_ndc_med_identifier_type_cd
		and mi.active_ind = 1
		and mi.sequence = 1
		and mi.med_product_id > 0
		and mi.pharmacy_type_cd =  c_inpatient_pharmacy_type_cd
	detail
		next = 1
		pos = locateval(idx,next,pop_medadmins_reply_out->medadmins_count,mi.item_id,
			pop_medadmins_reply_out->medadmins[idx].orders.medication_item_id)
		while(pos > 0 and next <= pop_medadmins_reply_out->medadmins_count)
			pop_medadmins_reply_out->medadmins[pos]->orders.ndc = trim(mi.value,3)
 
			next = pos + 1
			pos = locateval(idx,next,pop_medadmins_reply_out->medadmins_count,mi.item_id,
				pop_medadmins_reply_out->medadmins[idx].orders.medication_item_id)
		endwhile
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	; Get Ingredient NDC
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from (dummyt d with seq = pop_medadmins_reply_out->medadmins_count)
		,(dummyt d2 with seq = 1)
		, med_identifier mi
	plan d where maxrec(d2,size(pop_medadmins_reply_out->medadmins[d.seq].orders.ingred_list,5))
	join d2
	join mi where mi.item_id = pop_medadmins_reply_out->medadmins[d.seq].orders.ingred_list[d2.seq].item_id
		and mi.med_identifier_type_cd = c_ndc_med_identifier_type_cd
		and mi.active_ind = 1
		and mi.sequence = 1
		and mi.med_product_id > 0
		and mi.pharmacy_type_cd =  c_inpatient_pharmacy_type_cd
	detail
		 pop_medadmins_reply_out->medadmins[d.seq].orders.ingred_list[d2.seq].ndc = trim(mi.value,3)
	with nocounter, time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	;getting the ingredient NDC when it was actually dispensed
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from (dummyt d with seq = pop_medadmins_reply_out->medadmins_count)
		,(dummyt d2 with seq = 1)
		,dispense_hx dh
		,prod_dispense_hx pd
		,med_identifier mi
	plan d
		where maxrec(d2,size(pop_medadmins_reply_out->medadmins[d.seq].orders.ingred_list,5))
	join d2
	join dh
		where (dh.order_id = pop_medadmins_reply_out->medadmins[d.seq].orders.order_id
				or
			    dh.order_id = pop_medadmins_reply_out->medadmins[d.seq].orders.parent_order_id)
			 and dh.action_sequence =  pop_medadmins_reply_out->medadmins[d.seq].orders.last_ingred_seq
	join pd
		where pd.dispense_hx_id = dh.dispense_hx_id
			and pd.item_id =  pop_medadmins_reply_out->medadmins[d.seq].orders.ingred_list[d2.seq].item_id
	join mi
		where mi.med_product_id = pd.med_product_id
			and mi.med_identifier_type_cd = c_ndc_med_identifier_type_cd
			and mi.active_ind = 1
			and mi.sequence = 1
			and mi.med_product_id > 0
			and mi.pharmacy_type_cd =  c_inpatient_pharmacy_type_cd
	order by d.seq, d2.seq
	head d.seq
		x = 0
		head d2.seq
			 pop_medadmins_reply_out->medadmins[d.seq].orders.ingred_list[d2.seq].ndc = trim(mi.value,3)
	with nocounter, time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetRxNorm Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end ;End Sub
 
 
/*************************************************************************
;  Name: GetAdminNotes(null)
;  Description: Retrieves additional comments tied to administration
**************************************************************************/
subroutine GetAdminNotes(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetAdminNotes Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set blobout = fillstring(32768, ' ')
	set idx = 1
	if(pop_medadmins_reply_out->medadmins_count > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
		lb.long_blob_id
	from clinical_event ce
		, ce_event_note cen
		, long_blob lb
	plan ce where expand(idx,1,pop_medadmins_reply_out->medadmins_count,ce.parent_event_id,
		pop_medadmins_reply_out->medadmins[idx].parent_event_id)
	join cen where cen.event_id = ce.event_id
	join lb where lb.parent_entity_id = cen.ce_event_note_id
		and lb.parent_entity_name = "CE_EVENT_NOTE"
	order by ce.parent_event_id, lb.long_blob_id
	head ce.parent_event_id
		next = 1
		pos = locateval(idx,next,pop_medadmins_reply_out->medadmins_count,ce.parent_event_id,
		pop_medadmins_reply_out->medadmins[idx].parent_event_id)
	head lb.long_blob_id
		while(pos > 0 and next <= pop_medadmins_reply_out->medadmins_count)
			if(cen.compression_cd = c_nocomp_compression_cd)
				blobout = substring(1,findstring("ocf_blob",lb.long_blob,1)-1,lb.long_blob)
			else
				stat = uar_ocf_uncompress(lb.long_blob, size(trim(lb.long_blob)), blobout, size(blobout), 32768)
			endif
 
			pop_medadmins_reply_out->medadmins[pos].admin_note =
			build2(pop_medadmins_reply_out->medadmins[pos].admin_note, " ", blobout)
 
			next = pos + 1
			pos = locateval(idx,next,pop_medadmins_reply_out->medadmins_count,ce.parent_event_id,
			pop_medadmins_reply_out->medadmins[idx].parent_event_id)
		endwhile
 
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetAdminNotes Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end ;End Sub
 
/*************************************************************************
;  Name: GetTasks(null) = null
;  Description: Tasks associated with order
**************************************************************************/
subroutine GetTasks(null)
	if(iDebugFlag > 0)
		set comp_section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetTasks Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from (dummyt d with seq = pop_medadmins_reply_out->medadmins_count)
	    ,task_activity ta
	plan d
		where pop_medadmins_reply_out->medadmins[d.seq].parent_event_id > 0
 	join ta
 		where ta.event_id = pop_medadmins_reply_out->medadmins[d.seq].parent_event_id
 			and ta.active_ind = 1
 
 	order by d.seq, ta.task_id
 	head d.seq
 		x = 0
 		head ta.task_id
 			x = x + 1
 			stat = alterlist(pop_medadmins_reply_out->medadmins[d.seq].tasks,x)
 			pop_medadmins_reply_out->medadmins[d.seq].tasks[x].task_id= ta.task_id
			pop_medadmins_reply_out->medadmins[d.seq].tasks[x].task_class.id = ta.task_class_cd
			pop_medadmins_reply_out->medadmins[d.seq].tasks[x].task_class.name = trim(uar_get_code_display(ta.task_class_cd))
			pop_medadmins_reply_out->medadmins[d.seq].tasks[x].task_type.id = ta.task_type_cd
			pop_medadmins_reply_out->medadmins[d.seq].tasks[x].task_type.name = trim(uar_get_code_display(ta.task_type_cd))
			pop_medadmins_reply_out->medadmins[d.seq].tasks[x].task_status.id = ta.task_status_cd
			pop_medadmins_reply_out->medadmins[d.seq].tasks[x].task_status.name = trim(uar_get_code_display(ta.task_status_cd))
 
 
 	with nocounter, time = value(timeOutThreshold)
 
 	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetTasks Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), comp_section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;End Sub
 
/*************************************************************************
;  Name: GetAdminIngredId(null)
;  Description: Gets the administered Ingred Id tied to the Admin
**************************************************************************/
subroutine GetAdminIngredId(null)
	if(iDebugFlag > 0)
		set comp_section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetAdminIngredId Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 
	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
	select into "nl:"
	from (dummyt d1 with seq = pop_medadmins_reply_out->medadmins_count)
	    ,(dummyt d2 with seq = 1)
	    ,code_value_event_r cvr
	    ,order_catalog oc
	    ,order_catalog_synonym ocs
	plan d1
		where maxrec(d2,size(pop_medadmins_reply_out->medadmins[d1.seq].orders.ingred_list,5))
			and pop_medadmins_reply_out->medadmins[d1.seq].component_id > 0
	join d2
		where pop_medadmins_reply_out->medadmins[d1.seq].orders.ingred_list[d2.seq].synonym_id > 0
	join cvr
		where cvr.event_cd = pop_medadmins_reply_out->medadmins[d1.seq].component_id
	join oc
		where oc.catalog_cd = cvr.parent_cd
			and oc.active_ind = 1
	join ocs
		where ocs.synonym_id = pop_medadmins_reply_out->medadmins[d1.seq].orders.ingred_list[d2.seq].synonym_id
	order by d1.seq, d2.seq
	head d1.seq
		no_cnt = 0
		head d2.seq
			pop_medadmins_reply_out->medadmins[d1.seq].admin_ingred_id = ocs.synonym_id
 
	with nocounter, time = value(timeOutThreshold)
 
 	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
 
	if(iDebugFlag > 0)
		call echo(concat("GetAdminIngredId Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), comp_section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end;end getAdminIngredId
 
end
go
