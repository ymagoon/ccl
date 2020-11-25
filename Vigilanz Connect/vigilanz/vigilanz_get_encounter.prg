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
          Date Written:       08/09/2017
          Source file name:   vigilanz_get_encounter
          Object name:        vigilanz_get_encounter
          Program purpose:    Returns individual encounter information.
          					  If a FIN NBR is passed in,  it will return encounter
          					  information for that given encounter.
          Executing from:     EMISSARY SERVICES
***********************************************************************
                   GENERATED MODIFICATION CONTROL LOG
***********************************************************************
  Mod Date     Engineer             Comment
 ------------------------------------------------------------------
  000 08/09/17  DJP					Initial write
  001 03/21/18	RJC					Added version code and copyright block
  002 12/20/18	RJC					Code cleanup. ED location fix
  003 01/11/19  STV                 Added Discharge to location disp
  004 01/14/19 	RJC 				Add is_manually_added boolean to patient care team object
  005 01/23/19	RJC					Added loction history object
  006 04/17/19  STV                 readjustment to ED locations to grab the most recent place
  007 11/21/19  KRD                 adjustment for validating enounters exists
  022 02/01/20  KRD                 Added arrive_date_time, reg_date_time, pre_reg_date_time
  023 03/08/20  KRD     			Added internal_seq to patient_care_team object
  024 03/11/20  KRD     			Added inc_comments boolean to prompt
 									Added Comments object to the structure
  025 03/20/20  STV                 Added Isolation
  026 04/11/20  KRD                 Added patient_valuables
  027 04/29/20  KRD                 Added custom fields object
  027 05/01/20 KRD                  Added Subscriber address and phone objects
***********************************************************************/
drop program vigilanz_get_encounter go
create program vigilanz_get_encounter
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Username:" = ""
	, "EncounterId:" = ""
	, "Include Insurance Plan" = 0
	, "Include Care Team" = 0
	, "Financial Number:" = ""
	, "Include comments:" = 0
	, "Debug Flag" = 0
 
with OUTDEV, USERNAME, ENCNTR_ID, INC_HEALTHPLAN, INC_CARETEAM, FIN_NBR,
	INC_COMMENTS, DEBUG_FLAG
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
; 100043 - PM_SCH_GET_ENCOUNTER_DETAIL
free record 100043_req
record 100043_req (
	1 encntr_id 			= f8
	1 options 				= vc
	1 end_effective_dt_tm 	= dq8
)
 
free record 100043_rep
record 100043_rep
(
  1  accommodation_cd            = f8
  1  accommodation_disp          = vc
  1  accommodation_mean          = vc
  1  accommodation_request_cd    = f8
  1  accommodation_request_disp  = vc
  1  accommodation_request_mean  = vc
  1  admit_mode_cd               = f8
  1  admit_mode_disp             = vc
  1  admit_mode_mean             = vc
  1  admit_src_cd                = f8
  1  admit_src_disp              = vc
  1  admit_src_mean              = vc
  1  admit_type_cd               = f8
  1  admit_type_disp             = vc
  1  admit_type_mean             = vc
  1  admit_with_medication_cd    = f8
  1  admit_with_medication_disp  = vc
  1  admit_with_medication_mean  = vc
  1  alt_result_dest_cd          = f8
  1  alt_result_dest_disp        = vc
  1  alt_result_dest_mean        = vc
  1  ambulatory_cond_cd          = f8
  1  ambulatory_cond_disp        = vc
  1  ambulatory_cond_mean        = vc
  1  arrive_dt_tm                = dq8
  1  confid_level_cd             = f8
  1  confid_level_disp           = vc
  1  confid_level_mean           = vc
  1  courtesy_cd                 = f8
  1  courtesy_disp               = vc
  1  courtesy_mean               = vc
  1  data_status_cd              = f8
  1  data_status_disp            = vc
  1  data_status_mean            = vc
  1  depart_dt_tm                = dq8
  1  diet_type_cd                = f8
  1  diet_type_disp              = vc
  1  diet_type_mean              = vc
  1  disch_dt_tm                 = dq8
  1  disch_disposition_cd        = f8
  1  disch_disposition_disp      = vc
  1  disch_disposition_mean      = vc
  1  disch_to_loctn_cd           = f8
  1  disch_to_loctn_disp         = vc
  1  disch_to_loctn_mean         = vc
  1  encntr_class_cd             = f8
  1  encntr_class_disp           = vc
  1  encntr_class_mean           = vc
  1  encntr_financial_id         = f8
  1  encntr_status_cd            = f8
  1  encntr_status_disp          = vc
  1  encntr_status_mean          = vc
  1  encntr_type_cd              = f8
  1  encntr_type_disp            = vc
  1  encntr_type_mean            = vc
  1  est_arrive_dt_tm            = dq8
  1  est_depart_dt_tm            = dq8
  1  financial_class_cd          = f8
  1  financial_class_disp        = vc
  1  financial_class_mean        = vc
  1  guarantor_type_cd           = f8
  1  guarantor_type_disp         = vc
  1  guarantor_type_mean         = vc
  1  isolation_cd                = f8
  1  isolation_disp              = vc
  1  isolation_mean              = vc
  1  location_cd                 = f8
  1  location_disp               = vc
  1  location_mean               = vc
  1  loc_bed_cd                  = f8
  1  loc_bed_disp                = vc
  1  loc_building_cd             = f8
  1  loc_building_disp           = vc
  1  loc_facility_cd             = f8
  1  loc_facility_disp           = vc
  1  loc_nurse_unit_cd           = f8
  1  loc_nurse_unit_disp         = vc
  1  loc_nurse_unit_mean         = vc
  1  loc_room_cd                 = f8
  1  loc_room_disp               = vc
  1  loc_temp_cd                 = f8
  1  loc_temp_disp               = vc
  1  loc_temp_mean               = vc
  1  med_service_cd              = f8
  1  med_service_disp            = vc
  1  med_service_mean            = vc
  1  organization_id             = f8
  1  pre_reg_dt_tm               = dq8
  1  pre_reg_prsnl_id            = f8
  1  preadmit_nbr                = vc
  1  preadmit_testing_cd         = f8
  1  preadmit_testing_disp       = vc
  1  preadmit_testing_mean       = vc
  1  readmit_cd                  = f8
  1  readmit_disp                = vc
  1  readmit_mean                = vc
  1  reason_for_visit            = vc
  1  referring_comment           = vc
  1  reg_dt_tm                   = dq8
  1  reg_prsnl_id                = f8
  1  result_dest_cd              = f8
  1  result_dest_disp            = vc
  1  result_dest_mean            = vc
  1  vip_cd                      = f8
  1  vip_disp                    = vc
  1  vip_mean                    = vc
  1  person_id                   = f8
  1  program_service_cd          = f8
  1  program_service_disp        = vc
  1  program_service_mean        = vc
  1  specialty_unit_cd           = f8
  1  specialty_unit_disp         = vc
  1  specialty_unit_mean         = vc
  1  phone_id                    = f8
  1  location_extension          = vc
  1  multi_preadmit_testing[*]
     2  preadmit_testing_cd		 = f8
     2  preadmit_testing_disp	 = c40
     2  preadmit_testing_mean	 = c12
  1  alias[*]
     2  encntr_alias_id          = f8
     2  alias                    = vc
     2  alias_formatted          = vc
     2  alias_pool_cd            = f8
     2  alias_pool_disp          = vc
     2  alias_pool_mean          = vc
     2  encntr_alias_type_cd     = f8
     2  encntr_alias_type_disp   = vc
     2  encntr_alias_type_mean   = vc
  1  provider[*]
     2  encntr_prsnl_reltn_id    = f8
     2  encntr_prsnl_r_cd        = f8
     2  encntr_prsnl_r_disp      = vc
     2  encntr_prsnl_r_mean      = vc
     2  name_first               = vc
     2  name_full_formatted      = vc
     2  name_last                = vc
     2  physician_ind            = i2
     2  prsnl_person_id          = f8
  1  status_data
     2  status                   = c1
     2  subeventstatus[1]
        3  operationname         = vc
        3  operationstatus       = c1
        3  targetobjectname      = vc
        3  targetobjectvalue     = vc
  1  encntr_id                   = f8
  1  active_ind	                 = i2
)
 
; Final Reply
free record encounter_reply_out
record encounter_reply_out
(
 	1 encounter_id 							= f8	;e.encntr_id
	1 encounter_type_cd						= f8	;e.encntr_type_cd
	1 encounter_type_disp					= vc	;encounter type display
 	1 encounter_type_class_cd				= f8	;encounter_type_class_cd
 	1 encounter_type_class_disp				= vc	;encounter type class display
	1 encounter_status_cd					= f8
	1 encounter_status						= vc
	1 attending_provider					= vc
	1 attending_provider_id					= f8
	1 reason_for_visit     	    			= vc
	1 admission_source_cd					= f8
	1 admission_source_disp					= vc
	1 admit_type_cd							= f8
	1 admit_type_disp						= vc
	1 med_service_cd            			= f8
	1 med_service_disp          			= vc
	1 arrive_date							= dq8	;e.arrive_dt_tm, e.reg_dt_tm or pre_reg_dt_tm
	1 discharge_date						= dq8	;e.discharge_dt_tm
	1 discharge_disposition_cd				= f8
	1 discharge_disposition_disp			= vc
	1 discharge_to_loc_cd         			= f8
 	1 discharge_to_loc_disp       			= vc
	1 fin_nbr								= vc	;ea.alias
  	1 arrive_date_time              		= dq8   ;008
  	1 reg_date_time                 		= dq8   ;008
    1 pre_reg_date_time             		= dq8   ;008
	1 patient_id							= f8
	1 CustomFields[*]
	  2 Field
		3 id = f8
		3 name = vc
	  2 ResponseValueText [*] = vc
	  2 ResponseValueCodes[*]
		3 id = f8
		3 name = vc
    1 patient_valuables [*]
  	  2 id = f8
  	  2 name = vc
	1 isolation
		2 id = f8
		2 name = vc
	1 patient_location
		2  location_cd              		= f8
		2  location_disp            		= vc
		2  loc_bed_cd               		= f8
		2  loc_bed_disp             		= vc
		2  loc_building_cd					= f8
		2  loc_building_disp        		= vc
		2  loc_facility_cd          		= f8
		2  loc_facility_disp        		= vc
		2  loc_nurse_unit_cd        		= f8
		2  loc_nurse_unit_disp      		= vc
		2  loc_room_cd              		= f8
 		2  loc_room_disp            		= vc
 		2  loc_temp_cd              		= f8
 		2  loc_temp_disp            		= vc
 	1 health_plans[*]   							;021
		2 plan_name							= vc
		2 plan_desc							= vc
		2 group_nbr							= vc
		2 group_name						= vc
		2 policy_nbr						= vc
		2 plan_class_cd 					= f8
		2 plan_class_disp					= vc
		2 plan_type_cd    					= f8
		2 plan_type_disp    				= vc
		2 member_nbr						= vc
		2 payor_name						= vc
		2 payor_phone						= vc
		2 payor_state						= vc
	 	2 subscriber_last_name				= vc
		2 subscriber_first_name				= vc
		2 subscriber_date_of_birth			= dq8
		2 subscriber_reltn_to_patient_cd 	= f8
		2 subscriber_reltn_to_patient_desc 	= vc
		2 patient_reltn_to_subscriber_cd 	= f8
		2 patient_reltn_to_subscriber_desc 	= vc
		2 priority_sequence 				= i2
		2 begin_effective_dt_tm				= dq8
		2 end_effective_dt_tm				= dq8
        2 insurance_id = f8
        2 active_ind = i2
        2 active_status_cd = f8
        2 active_status_disp = vc
        2 active_status_prsnl_id = f8
        2 active_status_dt_tm = dq8
        2 data_status_cd = f8
        2 data_status_disp = vc
        2 data_status_prsnl_id = f8
        2 data_status_dt_tm = dq8
        2 ins_card_copied
          3 id = f8
          3 name = vc
        2 health_plan_id = f8
        2 eligibility_status
          3 id = f8
          3 name = vc
        2 subscriber_id = f8
        2 insured_card_name_first = vc
        2 insured_card_name_middle = vc
        2 insured_card_name_last = vc
        2 insured_card_name = vc
        2 subs_member_nbr = vc
        2 verify_status
          3 id = f8
          3 name = vc
        2 verify_source
          3 id = f8
          3 name = vc
        2 verify_prsnl_id = f8
        2 verify_dt_tm = dq8
        2 assign_benefits
          3 id = f8
          3 name = vc
        2 deduct_amt = f8
        2 deduct_remain_amt = f8
        2 deduct_inc_max_oop = f8
        2 copay_amt = f8
        2 copay_inc_max_oop = f8
        2 max_out_pckt_amt = f8
        2 fam_deduct_met_amt = f8
	    2 subscriber_address
          3 address_id = f8
          3 address_type_cd = f8
          3 address_type_disp = vc
          3 address_type_mean = vc
          3 street_addr = vc
          3 street_addr2 = vc
          3 street_addr3 = vc
          3 city = vc
          3 state_cd = f8
          3 state_disp = vc
          3 state_mean = vc
          3 zipcode = vc
          3 country_cd = f8
          3 country_disp = vc
          3 county_cd = f8
          3 county_disp = vc
          3 sequence_nbr = i4
          3 end_effective_dt_tm = dq8
        2 subscriber_phones[*]
          3 phone_id = f8
          3 phone_type_cd = f8
          3 phone_type_disp = vc
          3 phone_type_mean = vc
          3 phone_num = vc
          3 sequence_nbr = i4
          3 extension = vc
          3 end_effective_dt_tm = dq8
          3 phone_format
            5 id = f8
            5 name = vc
 	1  Comments [*]
		2 CMT_TEXT 							= vc
		2 UPDT_ID  							= f8
		2 UPDT_DT_TM 						= dq8
		2 Internal_Seq 						= i4
	1  patient_care_team[*]
   	     2 internal_seq                     = i4
		 2 provider_id						= f8
		 2 provider_name					= vc
		 2 reltn_type						= vc
		 2 from_date                 		= dq8
		 2 to_date                			= dq8
		 2 npi								= vc
		 2 phones[*]
			3 phone_id						= f8
			3 phone_type_cd					= f8
			3 phone_type_disp				= vc
			3 phone_type_mean				= vc
			3 phone_num						= vc
			3 sequence_nbr					= i2
	 	 2 is_manually_added				= i2
	1 location_history[*]
		2 location_history_id = f8
		2 hospital
			3 id = f8
			3 name = vc
		2 unit
			3 id = f8
			3 name = vc
		2 room
			3 id = f8
			3 name = vc
		2 bed
			3 id = f8
			3 name = vc
		2 effective_from_date = dq8
		2 effective_to_date = dq8
		2 encounter_type
			3 id = f8
			3 name = vc
		2 patient_class
			3 id = f8
			3 name = vc
  	1 audit
 		2 user_id					 		= f8
		2 user_firstname				 	= vc
	 	2 user_lastname				 		= vc
	 	2 patient_id				 		= f8
		2 patient_firstname		 			= vc
	 	2 patient_lastname			 		= vc
	 	2 service_version			 		= vc
	1 status_data
		2 status 							= c1
    	2 subeventstatus[1]
     		3 OperationName 				= c25
      		3 OperationStatus 				= c1
      		3 TargetObjectName	 			= c25
      		3 TargetObjectValue 			= vc
      		3 Code 							= c4
      		3 Description 					= vc
)
 
set encounter_reply_out->status_data->status = "F"
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Input
declare sUserName  							= vc with protect, noconstant("")
declare dEncounterId						= f8 with protect, noconstant(0.0)
declare iIncHealthPlan						= i4 with protect, noconstant(0)
declare iIncCareteam						= i4 with protect, noconstant(0)
declare iIncComments	 					= i2 with protect, noconstant(0)
declare sFinancialNumber					= vc with protect, noconstant("")
declare iDebugFlag							= i4 with protect, noconstant(0)
 
;Other
declare dPrsnlId							= f8 with protect, noconstant(0.0)
 
;Constants
declare c_attenddoc_encntr_prsnl_reltn_cd	= f8 with protect, constant(uar_get_code_by("MEANING",333,"ATTENDDOC"))
declare c_npi_prsnl_alias_type_cd			= f8 with protect, constant(uar_get_code_by("MEANING",320,"NPI"))
declare c_finnbr_encntr_alias_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",319,"FIN NBR"))
declare c_insured_person_reltn_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",351,"INSURED"))
declare c_active_active_status_cd			= f8 with protect, constant(uar_get_code_by("MEANING",48,"ACTIVE"))
declare c_emergency_encntr_type_class_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",69,"EMERGENCY"))
declare c_comments_info_type_cd             = f8 with protect, constant(uar_get_code_by("MEANING",355,"COMMENT"))
declare c_userdefined_info_type_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",355,"USERDEFINED"))
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
;Input
set sUserName 			= trim($USERNAME, 3)
set dEncounterId 		= cnvtreal($ENCNTR_ID)
set iIncHealthPlan 		= cnvtint($INC_HEALTHPLAN)
set iIncCareteam 		= cnvtint($INC_CARETEAM)
set iIncComments		= cnvtint($INC_COMMENTS)
set sFinancialNumber	= trim($FIN_NBR,3)
set iDebugFlag			= cnvtint($DEBUG_FLAG)
 
;Other
set dPrsnlId 			= GetPrsnlIDfromUserName(sUserName)
 
if(dEncounterId = 0)
	set dEncounterId = GetEncntrIdByAlias(sFinancialNumber,c_finnbr_encntr_alias_type_cd)
endif
 
if(iDebugFlag > 0)
	call echo(build("sUserName  ->", sUserName))
	call echo(build("dEncounterId ->", dEncounterId))
	call echo(build("dPrsnlId ->", dPrsnlId))
	call echo(build("iIncHealthPlan ->",iIncHealthPlan))
	call echo(build("iIncCareTeam ->", iIncCareTeam))
	call echo(build("sFinancialNumber ->",sFinancialNumber))
	call echo(build("c_finnbr_encntr_alias_type_cd->: ", c_finnbr_encntr_alias_type_cd))
 	call echo(build("c_attenddoc_encntr_prsnl_reltn_cd ->",c_attenddoc_encntr_prsnl_reltn_cd))
 	call echo(build("c_npi_prsnl_alias_type_cd->: ", c_npi_prsnl_alias_type_cd))
endif
 
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetEncounterDetail(null)= null with protect
declare GetHealthPlans(null)	= null with protect
declare GetEDLocationInfo(null) = null with protect
declare GetLocHistory(null) 	= null with protect
declare GetComments(null) 		= null with protect
declare GetPatientValuables(null)= null with protect
declare GetCustomFields(null)                   	= null with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Validate encounterId exists
 
if (dEncounterId = 0)
	call ErrorHandler2("VALIDATE", "F", "ENCOUNTER", "Invalid EncounterId.",
	"2004", "Invalid EncounterId.", encounter_reply_out)
	go to EXIT_SCRIPT
elseif(ValidateEncounter(dEncounterId) = 0)
	call ErrorHandler2("VALIDATE", "F", "ENCOUNTER", "Invalid EncounterId.",
	"2004", "Invalid EncounterId.", encounter_reply_out)
	go to EXIT_SCRIPT
else
	call GetEncounterDetail(null)
endif
 
; Populute Audit
set iRet = PopulateAudit(sUserName, encounter_reply_out->patient_id, encounter_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "ENCOUNTER", "Invalid User for Audit.",
	"1001", build("UserId is invalid: ",sUserName), encounter_reply_out)
	go to EXIT_SCRIPT
endif
 
; Get healthplans if requested
if(iIncHealthPlan > 0)
	call GetHealthPlans(null)
endif
 
; Get ED location details
call GetEDLocationInfo(null)
 
; Get Location History details
call GetLocHistory(null)
 
;Get patient_care_team information
if (iIncComments > 0)
   call GetComments(null)
endif
 
;Get patient_valuables
call GetPatientValuables(null)
 
;Get custom fields information
call GetCustomFields(null)
 
; Set audit to success
call ErrorHandler("Get Encounters", "S", "Success", "Process completed successfully.", encounter_reply_out)
 
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = cnvtrectojson(encounter_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_encounter.json")
	call echo(build2("_file : ", _file))
	call echojson(encounter_reply_out, _file, 0)
    call echorecord(encounter_reply_out)
	call echo(JSONout)
endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: GetEncounterDetail(null)
;  Description: Retrieves detail information about a single encounterId for the search routine.
**************************************************************************/
subroutine GetEncounterDetail(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetEncounterDetail Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iApplication = 600005
	set iTask = 100040
	set iRequest = 100043
 
	; Setup request
	set 100043_req->encntr_id = dEncounterId
 
	; Execute request
	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",100043_req,"REC",100043_rep)
 
	if(100043_rep->status_data.status = "F")
		call ErrorHandler2("EXECUTE", "F", "ENCOUNTERS", "Error executing 100043",
		"9999", "Error executing 100043", encounter_reply_out)
		go to EXIT_SCRIPT
	else
		; Build final reply
		set encounter_reply_out->admission_source_cd = 100043_rep->admit_src_cd
		set encounter_reply_out->admission_source_disp = 100043_rep->admit_src_disp
		set encounter_reply_out->admit_type_cd = 100043_rep->admit_type_cd
		set encounter_reply_out->admit_type_disp = uar_get_code_display(100043_rep->admit_type_cd)
		if(100043_rep->arrive_dt_tm > 0)
			set encounter_reply_out->arrive_date = 100043_rep->arrive_dt_tm
		elseif(100043_rep->reg_dt_tm > 0)
			set encounter_reply_out->arrive_date = 100043_rep->reg_dt_tm
		else
			set encounter_reply_out->arrive_date = 100043_rep->pre_reg_dt_tm
		endif
		set encounter_reply_out->arrive_date_time = 100043_rep->arrive_dt_tm	;008
		set encounter_reply_out->reg_date_time = 100043_rep->reg_dt_tm			;008
		set encounter_reply_out->pre_reg_date_time = 100043_rep->pre_reg_dt_tm 	;008
		set encounter_reply_out->discharge_date = 100043_rep->disch_dt_tm
		set encounter_reply_out->discharge_disposition_cd = 100043_rep->disch_disposition_cd
		set encounter_reply_out->discharge_disposition_disp = 100043_rep->disch_disposition_disp
		set encounter_reply_out->discharge_to_loc_cd =  100043_rep->disch_to_loctn_cd
		set encounter_reply_out->discharge_to_loc_disp = 100043_rep->disch_to_loctn_disp
		set encounter_reply_out->encounter_id = 100043_rep->encntr_id
		set encounter_reply_out->encounter_status_cd = 100043_rep->encntr_status_cd
		set encounter_reply_out->encounter_status = 100043_rep->encntr_status_disp
		set encounter_reply_out->encounter_type_cd = 100043_rep->encntr_type_cd
		set encounter_reply_out->encounter_type_disp = 100043_rep->encntr_type_disp
		set encounter_reply_out->encounter_type_class_cd = GetPatientClass(100043_rep->encntr_id,2)
		set encounter_reply_out->encounter_type_class_disp =
			uar_get_code_display(encounter_reply_out->encounter_type_class_cd)
		set encounter_reply_out->med_service_cd = 100043_rep->med_service_cd
		set encounter_reply_out->med_service_disp = 100043_rep->med_service_disp
		set encounter_reply_out->patient_id = 100043_rep->person_id
		set encounter_reply_out->reason_for_visit = 100043_rep->reason_for_visit
		set encounter_reply_out->patient_location.loc_facility_cd = 100043_rep->loc_facility_cd
		set encounter_reply_out->patient_location.loc_facility_disp = 100043_rep->loc_facility_disp
		set encounter_reply_out->patient_location.loc_building_cd = 100043_rep->loc_building_cd
		set encounter_reply_out->patient_location.loc_building_disp = 100043_rep->loc_building_disp
		set encounter_reply_out->patient_location.loc_nurse_unit_cd = 100043_rep->loc_nurse_unit_cd
		set encounter_reply_out->patient_location.loc_nurse_unit_disp = 100043_rep->loc_nurse_unit_disp
		set encounter_reply_out->patient_location.loc_room_cd = 100043_rep->loc_room_cd
		set encounter_reply_out->patient_location.loc_room_disp = 100043_rep->loc_room_disp
		set encounter_reply_out->patient_location.loc_bed_cd = 100043_rep->loc_bed_cd
		set encounter_reply_out->patient_location.loc_bed_disp = 100043_rep->loc_bed_disp
		set encounter_reply_out->isolation.id = 100043_rep->isolation_cd
		set encounter_reply_out->isolation.name = 100043_rep->isolation_disp
 
		; Get Financial Number
		for(x = 1 to size(100043_rep->alias,5))
			if(100043_rep->alias[x]->encntr_alias_type_cd = c_finnbr_encntr_alias_type_cd)
				set encounter_reply_out->fin_nbr = 100043_rep->alias[x]->alias
			endif
		endfor
 
		; Patient CareTeam and Attending Provider
		if(iIncCareteam > 0)
			set prsnlSize = size(100043_rep->provider,5)
			if(prsnlSize > 0)
				set stat = alterlist(encounter_reply_out->patient_care_team,prsnlSize)
				for(x = 1 to prsnlSize)
					set encounter_reply_out->patient_care_team[x].provider_id = 100043_rep->provider[x].prsnl_person_id
					set encounter_reply_out->patient_care_team[x].provider_name =
						100043_rep->provider[x].name_full_formatted
					set encounter_reply_out->patient_care_team[x].reltn_type =
						100043_rep->provider[x].encntr_prsnl_r_disp
 
					if(100043_rep->provider[x].encntr_prsnl_r_mean = "ATTENDDOC")
						set encounter_reply_out->attending_provider_id = 100043_rep->provider[x].prsnl_person_id
						set encounter_reply_out->attending_provider = 100043_rep->provider[x].name_full_formatted
					endif
 
					; Get From/To dates
					select into "nl:"
					from encntr_prsnl_reltn epr
					where epr.encntr_prsnl_reltn_id = 100043_rep->provider[x].encntr_prsnl_reltn_id
					detail
						encounter_reply_out->patient_care_team[x].from_date = epr.beg_effective_dt_tm
						encounter_reply_out->patient_care_team[x].to_date = epr.end_effective_dt_tm
						encounter_reply_out->patient_care_team[x].is_manually_added = epr.manual_create_ind
						encounter_reply_out->patient_care_team[x].internal_seq = epr.internal_seq
					with nocounter
 
					; Get NPI
					select into "nl:"
					from prsnl_alias pa
					where pa.person_id = 100043_rep->provider[x].prsnl_person_id
						and pa.prsnl_alias_type_cd = c_npi_prsnl_alias_type_cd
						and pa.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
						and pa.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
					detail
						encounter_reply_out->patient_care_team[x].npi = pa.alias
					with nocounter
 
					; Get phone numbers
					select into "nl:"
					from phone ph
					plan ph where ph.parent_entity_id = encounter_reply_out->patient_care_team[x].provider_id
				  		and ph.parent_entity_name = "PERSON"
				 		and ph.active_ind = 1
					  	and ph.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
					   	and ph.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
					head report
						p = 0
					detail
						p = p + 1
						stat = alterlist(encounter_reply_out->patient_care_team[x].phones,p)
 
						encounter_reply_out->patient_care_team[x].phones[p].phone_id = ph.phone_id
						encounter_reply_out->patient_care_team[x].phones[p].phone_type_cd = ph.phone_type_cd
						encounter_reply_out->patient_care_team[x].phones[p].phone_type_disp =
							uar_get_code_display(ph.phone_type_cd)
						encounter_reply_out->patient_care_team[x].phones[p].phone_type_mean =
							uar_get_code_meaning(ph.phone_type_cd)
						encounter_reply_out->patient_care_team[x].phones[p].phone_num = ph.phone_num
						encounter_reply_out->patient_care_team[x].phones[p].sequence_nbr = ph.seq
					with nocounter
				endfor
			endif
		endif
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetEncounterDetail Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;End Sub
 
/*************************************************************************
;  Name: GetHealthplans(null)
;  Description: Subroutine to get healthplan data
**************************************************************************/
subroutine GetHealthplans(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetHealthplans Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	select into "nl:"
	from encntr_plan_reltn eplr
		,health_plan hp
		,encntr_person_reltn epr
		,person p
		,encntr_plan_eligibility epe
		,encntr_benefit_r ebr
		,person_plan_reltn ppr
		,address ad1
		,phone ph1
		,organization o
		,address ad
		,phone ph
	plan eplr where eplr.encntr_id = dEncounterId
		and eplr.active_ind = 1
		and eplr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and eplr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
	join hp where hp.health_plan_id = eplr.health_plan_id
			and hp.active_ind = 1
			and hp.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and hp.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
	join epr where epr.person_reltn_type_cd = c_insured_person_reltn_type_cd
		and epr.related_person_id = eplr.person_id
		and epr.encntr_id = eplr.encntr_id
		and epr.active_ind = 1
		and epr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
 		and epr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
 	join p where epr.related_person_id = p.person_id
	join epe where epe.encntr_plan_reltn_id = outerjoin(eplr.encntr_plan_reltn_id)
	  and epe.active_ind = outerjoin(1)
	join ebr where ebr.encntr_plan_reltn_id = outerjoin(eplr.encntr_plan_reltn_id)
	  and ebr.active_ind = outerjoin(1)
      and ebr.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate, curtime3))
      and ebr.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate, curtime3))
    join ppr where ppr.person_plan_reltn_id = outerjoin(eplr.person_plan_reltn_id)
      and ppr.active_ind = outerjoin(1)
      and ppr.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate, curtime3))
      and ppr.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate, curtime3))
    join ad1 where ad1.parent_entity_id = outerjoin(epr.related_person_id)
      and ad1.parent_entity_name = outerjoin("PERSON")
      and ad1.active_ind = outerjoin(1)
      and ad1.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate, curtime3))
      and ad1.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate, curtime3))
    join ph1 where ph1.parent_entity_id = outerjoin(epr.related_person_id)
      and ph1.parent_entity_name = outerjoin("PERSON")
      and ph1.active_ind = outerjoin(1)
      and ph1.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate, curtime3))
      and ph1.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate, curtime3))
	join o where o.organization_id = outerjoin(eplr.organization_id)
 	  and o.active_ind = outerjoin(1)
 	  and o.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
 	  and o.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
 	join ad where ad.parent_entity_id = outerjoin(o.organization_id)
 		and ad.parent_entity_name = outerjoin("ORGANIZATION")
 		and ad.active_ind = outerjoin(1)
 		and ad.active_status_cd = outerjoin(c_active_active_status_cd)
 		and ad.address_type_seq <= outerjoin(1)
 		and ad.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
 	 	and ad.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
 	join ph where ph.parent_entity_id = outerjoin(o.organization_id)
 	 	and ph.parent_entity_name = outerjoin("ORGANIZATION")
 	 	and ph.active_ind = outerjoin(1)
 	 	and ph.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
 	 	and ph.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
	order by eplr.priority_seq, hp.plan_name,ph1.phone_type_cd, ph1.phone_type_seq,
             ph1.phone_id
 	head report
 		x = 0
 		iPhoneIndex = 0
	head eplr.priority_seq
 		iPhoneIndex = 0
		x =  x + 1
		stat = alterlist(encounter_reply_out->health_plans, x)
		encounter_reply_out->health_plans[x]->plan_name = hp.plan_name
		encounter_reply_out->health_plans[x]->plan_desc = hp.plan_desc
		encounter_reply_out->health_plans[x]->group_nbr = eplr.group_nbr
		encounter_reply_out->health_plans[x]->group_name = eplr.group_name
		encounter_reply_out->health_plans[x]->policy_nbr = eplr.policy_nbr   ;hp.policy_nbr
		encounter_reply_out->health_plans[x]->plan_type_cd = hp.plan_type_cd
		encounter_reply_out->health_plans[x]->plan_type_disp = uar_get_code_display(hp.plan_type_cd)
		encounter_reply_out->health_plans[x]->plan_class_cd = hp.plan_class_cd
		encounter_reply_out->health_plans[x]->plan_class_disp = uar_get_code_display(hp.plan_class_cd)
		encounter_reply_out->health_plans[x]->member_nbr = eplr.member_nbr
 		encounter_reply_out->health_plans[x].payor_name = o.org_name
 		encounter_reply_out->health_plans[x].payor_phone = ph.phone_num
 		if (ad.state_cd = 0.0)
 			encounter_reply_out->health_plans[x].payor_state = trim(ad.state)
 		else
 			encounter_reply_out->health_plans[x].payor_state = uar_get_code_display(ad.state_cd)
 		endif
        encounter_reply_out->health_plans[x].subscriber_id = p.person_id
		encounter_reply_out->health_plans[x].subscriber_last_name = p.name_last_key
		encounter_reply_out->health_plans[x].subscriber_first_name = p.name_first_key
		encounter_reply_out->health_plans[x].subscriber_date_of_birth = p.birth_dt_tm
		encounter_reply_out->health_plans[x].subscriber_reltn_to_patient_cd = epr.person_reltn_cd
		encounter_reply_out->health_plans[x].subscriber_reltn_to_patient_desc =
			uar_get_code_display(epr.person_reltn_cd)
		encounter_reply_out->health_plans[x].patient_reltn_to_subscriber_cd = epr.related_person_reltn_cd
		encounter_reply_out->health_plans[x].patient_reltn_to_subscriber_desc =
			uar_get_code_display(epr.related_person_reltn_cd)
		encounter_reply_out->health_plans[x].priority_sequence = eplr.priority_seq
		encounter_reply_out->health_plans[x].begin_effective_dt_tm = eplr.beg_effective_dt_tm
		encounter_reply_out->health_plans[x].end_effective_dt_tm = eplr.end_effective_dt_tm
        encounter_reply_out->health_plans[x].insurance_id = eplr.encntr_plan_reltn_id
        encounter_reply_out->health_plans[x].active_ind = eplr.active_ind
        encounter_reply_out->health_plans[x].active_status_cd = eplr.active_status_cd
        encounter_reply_out->health_plans[x].active_status_disp =
                                                                trim(uar_get_code_display(eplr.active_status_cd), 3)
        encounter_reply_out->health_plans[x].active_status_prsnl_id = eplr.active_status_prsnl_id
        encounter_reply_out->health_plans[x].active_status_dt_tm = eplr.active_status_dt_tm
        encounter_reply_out->health_plans[x].data_status_cd = eplr.data_status_cd
        encounter_reply_out->health_plans[x].data_status_disp =
        																trim(uar_get_code_display(eplr.data_status_cd), 3)
        encounter_reply_out->health_plans[x].data_status_prsnl_id = eplr.data_status_prsnl_id
        encounter_reply_out->health_plans[x].data_status_dt_tm = eplr.data_status_dt_tm
        encounter_reply_out->health_plans[x].ins_card_copied.id = eplr.ins_card_copied_cd
        encounter_reply_out->health_plans[x].ins_card_copied.name =
        																trim(uar_get_code_display(eplr.ins_card_copied_cd), 3)
        encounter_reply_out->health_plans[x].health_plan_id = eplr.health_plan_id
         encounter_reply_out->health_plans[x].insured_card_name_first =
        																				trim(eplr.insured_card_name_first,3)
        encounter_reply_out->health_plans[x].insured_card_name_middle =
        																				trim(eplr.insured_card_name_middle,3)
        encounter_reply_out->health_plans[x].insured_card_name_last =
        																				trim(eplr.insured_card_name_last,3)
        encounter_reply_out->health_plans[x].insured_card_name =
        																				trim(eplr.insured_card_name)
        encounter_reply_out->health_plans[x].subs_member_nbr = trim(eplr.subs_member_nbr, 3)
        encounter_reply_out->health_plans[x].verify_status.id = eplr.verify_status_cd
        encounter_reply_out->health_plans[x].verify_status.name =
        																trim(uar_get_code_display(eplr.verify_status_cd), 3)
        encounter_reply_out->health_plans[x].verify_source.id = eplr.verify_source_cd
        encounter_reply_out->health_plans[x].verify_source.name =
        																trim(uar_get_code_display(eplr.verify_source_cd), 3)
        encounter_reply_out->health_plans[x].verify_prsnl_id = eplr.verify_prsnl_id
        encounter_reply_out->health_plans[x].verify_dt_tm = eplr.verify_dt_tm
        encounter_reply_out->health_plans[x].assign_benefits.id = eplr.assign_benefits_cd
        encounter_reply_out->health_plans[x].assign_benefits.name =
        																trim(uar_get_code_display(eplr.assign_benefits_cd),3)
        encounter_reply_out->health_plans[x].eligibility_status.id = epe.eligibility_status_cd
        encounter_reply_out->health_plans[x].eligibility_status.name =
        																trim(uar_get_code_display(epe.eligibility_status_cd),3)
        encounter_reply_out->health_plans[x].deduct_amt = ebr.deduct_amt
        encounter_reply_out->health_plans[x].deduct_remain_amt = ebr.deduct_remain_amt
        encounter_reply_out->health_plans[x].copay_amt = ebr.copay_amt
      	case(ebr.internal_seq)
        	of 0:
          		encounter_reply_out->health_plans[x].deduct_inc_max_oop =
          																ebr.room_coverage_board_incl_cd
        	of 1:
          		encounter_reply_out->health_plans[x].copay_inc_max_oop =
          																ebr.room_coverage_board_incl_cd
      	endcase
 
        encounter_reply_out->health_plans[x].max_out_pckt_amt = ppr.max_out_pckt_amt
        encounter_reply_out->health_plans[x].fam_deduct_met_amt = ppr.fam_deduct_met_amt
 
        ;Subscriber Address
        encounter_reply_out->health_plans[x]->subscriber_address.address_id = ad1.address_id
        encounter_reply_out->health_plans[x]->subscriber_address.address_type_cd = ad1.address_type_cd
        encounter_reply_out->health_plans[x]->subscriber_address.address_type_disp = trim(
        uar_get_code_display(ad1.address_type_cd), 3)
        encounter_reply_out->health_plans[x]->subscriber_address.address_type_mean = trim(
        uar_get_code_meaning(ad1.address_type_cd), 3)
        encounter_reply_out->health_plans[x]->subscriber_address.street_addr = trim(ad1.street_addr, 3)
        encounter_reply_out->health_plans[x]->subscriber_address.street_addr2 = trim(ad1.street_addr2,3)
        encounter_reply_out->health_plans[x]->subscriber_address.street_addr3 = trim(ad1.street_addr3,3)
        encounter_reply_out->health_plans[x]->subscriber_address.city = trim(ad1.city, 3)
        encounter_reply_out->health_plans[x]->subscriber_address.state_cd = ad1.state_cd
        encounter_reply_out->health_plans[x]->subscriber_address.state_disp =
                                                                                   trim(uar_get_code_display(ad1.state_cd), 3)
        encounter_reply_out->health_plans[x]->subscriber_address.state_mean =
                                                                                   trim(uar_get_code_meaning(ad1.state_cd), 3)
        encounter_reply_out->health_plans[x]->subscriber_address.zipcode = trim(ad1.zipcode, 3)
        encounter_reply_out->health_plans[x]->subscriber_address.country_cd = ad.country_cd
        encounter_reply_out->health_plans[x]->subscriber_address.country_disp =
                                                                                   trim(uar_get_code_display(ad1.country_cd), 3)
        encounter_reply_out->health_plans[x]->subscriber_address.county_cd = ad.county_cd
        encounter_reply_out->health_plans[x]->subscriber_address.county_disp =
                                                                                     trim(uar_get_code_display(ad1.county_cd), 3)
        encounter_reply_out->health_plans[x]->subscriber_address.end_effective_dt_tm =
                                                                                     cnvtdatetime(ad1.end_effective_dt_tm)
     head ph1.phone_id
        if(ph1.phone_id > 0.00)
	        iPhoneIndex += 1
	        stat = alterlist(encounter_reply_out->health_plans[x]->subscriber_phones, iPhoneIndex)
	        encounter_reply_out->health_plans[x]->subscriber_phones[iPhoneIndex].phone_id = ph1.phone_id
	        encounter_reply_out->health_plans[x]->subscriber_phones[iPhoneIndex].phone_type_cd =
	                                                                                                           ph1.phone_type_cd
	        encounter_reply_out->health_plans[x]->subscriber_phones[iPhoneIndex].phone_type_disp =
	                                                                                trim(uar_get_code_display(ph1.phone_type_cd), 3)
	        encounter_reply_out->health_plans[x]->subscriber_phones[iPhoneIndex].phone_type_mean =
	                                                                                trim(uar_get_code_meaning(ph1.phone_type_cd), 3)
	        encounter_reply_out->health_plans[x]->subscriber_phones[iPhoneIndex].phone_num =
	                                                                                trim(ph1.phone_num, 3)
	        encounter_reply_out->health_plans[x]->subscriber_phones[iPhoneIndex].sequence_nbr =
	                                                                                                            ph1.phone_type_seq
	        encounter_reply_out->health_plans[x]->subscriber_phones[iPhoneIndex].extension =
	                                                                                                          trim(ph1.extension, 3)
	        encounter_reply_out->health_plans[x]->subscriber_phones[iPhoneIndex].end_effective_dt_tm =
	        cnvtdatetime(ph1.end_effective_dt_tm)
	        encounter_reply_out->health_plans[x]->subscriber_phones[iPhoneIndex].phone_format.id =
	                                                                                                         ph1.phone_format_cd
	        encounter_reply_out->health_plans[x]->subscriber_phones[iPhoneIndex].phone_format.name =
        																	trim(uar_get_code_display(ph1.phone_format_cd), 3)
       endif
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetEncounterDetail Runtime: ",
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
 
 	if(encounter_reply_out->encounter_type_class_cd = c_emergency_encntr_type_class_cd
 		and (encounter_reply_out->patient_location.loc_bed_cd < 1 or
 			 encounter_reply_out->patient_location.loc_room_cd < 1))
 
		select into "nl:"
		from tracking_item ti
			,tracking_locator tl
		plan ti where ti.encntr_id = encounter_reply_out->encounter_id
		join tl where tl.tracking_id = ti.tracking_id
		order by tl.depart_dt_tm desc
		head report
			encounter_reply_out->patient_location.loc_bed_cd = tl.loc_bed_cd
			encounter_reply_out->patient_location.loc_bed_disp = uar_get_code_display(tl.loc_bed_cd)
			encounter_reply_out->patient_location.loc_room_cd = tl.loc_room_cd
			encounter_reply_out->patient_location.loc_room_disp = uar_get_code_display(tl.loc_room_cd)
		with nocounter
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetEDLocationInfo Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;End Sub
 
/*************************************************************************
;  Name: GetLocHistory(null) = null
;  Description: Subroutine to get firstnet bed/location data
**************************************************************************/
subroutine GetLocHistory(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetLocHistory Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	select into "nl:"
	from encntr_loc_hist elh
	plan elh where elh.encntr_id = encounter_reply_out->encounter_id
			and elh.beg_effective_dt_tm != NULL
	order by elh.encntr_loc_hist_id
	head report
		x = 0
	detail
		x = x + 1
		stat = alterlist(encounter_reply_out->location_history,x)
 
 		encounter_reply_out->location_history[x].location_history_id = elh.encntr_loc_hist_id
		encounter_reply_out->location_history[x].hospital.id = elh.loc_facility_cd
		encounter_reply_out->location_history[x].hospital.name = uar_get_code_display(elh.loc_facility_cd)
		encounter_reply_out->location_history[x].unit.id = elh.loc_nurse_unit_cd
		encounter_reply_out->location_history[x].unit.name = uar_get_code_display(elh.loc_nurse_unit_cd)
		encounter_reply_out->location_history[x].room.id = elh.loc_room_cd
		encounter_reply_out->location_history[x].room.name = uar_get_code_display(elh.loc_room_cd)
		encounter_reply_out->location_history[x].bed.id = elh.loc_bed_cd
		encounter_reply_out->location_history[x].bed.name = uar_get_code_display(elh.loc_bed_cd)
		encounter_reply_out->location_history[x].effective_from_date = elh.beg_effective_dt_tm
		encounter_reply_out->location_history[x].effective_to_date = elh.end_effective_dt_tm
		encounter_reply_out->location_history[x].encounter_type.id = elh.encntr_type_cd
		encounter_reply_out->location_history[x].encounter_type.name = uar_get_code_display(elh.encntr_type_cd)
		encounter_reply_out->location_history[x].patient_class.id = elh.encntr_type_class_cd
		encounter_reply_out->location_history[x].patient_class.name = uar_get_code_display(elh.encntr_type_class_cd)
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetLocHistory Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;End Sub
 
/*************************************************************************
;  Name: GetComments(null)
;  Description: Subroutine to get comments data
**************************************************************************/
subroutine GetComments(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetComments Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
    set x = 0
	select into "nl:"
  	e.encntr_id
    ,e.info_type_cd
  	from encntr_info e,long_text lt
 	plan e
  	where e.encntr_id = encounter_reply_out->encounter_id
    and e.info_type_cd = c_comments_info_type_cd
  	join lt
  	where e.long_text_id = lt.long_text_id
  	order by e.encntr_id, e.info_type_cd
	head report
		x = 0
	detail
		x = x + 1
		stat = alterlist(encounter_reply_out->Comments, x)
 		encounter_reply_out->Comments[x].UPDT_ID = e.updt_id
		encounter_reply_out->Comments[x].UPDT_DT_TM = e.updt_dt_tm
		encounter_reply_out->Comments[x].CMT_TEXT = trim(lt.long_text,3)
		encounter_reply_out->Comments[x].Internal_Seq = e.internal_seq
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetComments Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;End Sub
 
/*************************************************************************
;  Name: GetPatientValuables(null)
;  Description: Subroutine to get patient valuables information
**************************************************************************/
subroutine GetPatientValuables(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetPatientValuables Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
    set x = 0
	select into "nl:"
  	e.encntr_id
  	from encntr_code_value_r e
 	plan e
  	where e.encntr_id = encounter_reply_out->encounter_id
  	and e.code_set = 14751.00
    and e.active_ind = 1
    and e.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
  	order by e.encntr_id
	head report
		x = 0
	head e.encntr_id
		x = 0
	detail
		x = x + 1
	 	if (mod(x, 5) = 1)
	        stat = alterlist(encounter_reply_out->patient_valuables, x + 4)
	    endif
 		encounter_reply_out->patient_valuables[x].id  =  e.code_value
 		encounter_reply_out->patient_valuables[x].name = trim(uar_get_code_display(e.code_value ),3)
	foot e.encntr_id
        stat = alterlist(encounter_reply_out->patient_valuables, x )
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetPatientValuables Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;End Sub
 
/*************************************************************************
;  Name: GetCustomFields(null)
;  Description: Subroutine to get CustomFields data
**************************************************************************/
subroutine GetCustomFields(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Getting Custom Fields Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
	set count = 0
	set num = 0
	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
	select into "nl:"
  	e.encntr_id
  	,e.info_sub_type_cd
  	,e.value_cd
  	from encntr_info e,long_text lt
 	plan e
  	where e.encntr_id = encounter_reply_out->encounter_id
  	and e.info_type_cd = c_userdefined_info_type_cd
    and e.active_ind  = 1
    and e.end_effective_dt_tm  > cnvtdatetime(curdate,curtime3)
  	join lt
  	where e.long_text_id = lt.long_text_id
  	order by e.encntr_id , e.info_sub_type_cd, e.value_cd
  	head report
  		count = 0
  	head e.encntr_id
   	    count = 0
  	    x = 0
        val_cnt = 0
    head e.info_sub_type_cd
  		x = 0
  		val_cnt = 0
  		count = count + 1
  		stat = alterlist(encounter_reply_out->CustomFields,count)
  		encounter_reply_out->CustomFields[count].Field.id = e.info_sub_type_cd
  		encounter_reply_out->CustomFields[count].Field.name = trim(uar_get_code_display(e.info_sub_type_cd),3)
  		detail
	  	   if(size(trim(lt.long_text)) > 0)
	  		val_cnt = val_cnt+1
	  		stat = alterlist(encounter_reply_out->CustomFields[count].ResponseValueText,val_cnt)
 
	  		encounter_reply_out->CustomFields[count].ResponseValueText[val_cnt] = trim(lt.long_text,3)
		   endif
		   if (e.value_cd > 0)
    		x= x+1
    		stat = alterlist(encounter_reply_out->CustomFields[count].ResponseValueCodes,x)
  			encounter_reply_out->CustomFields[count].ResponseValueCodes[x].id = e.value_cd
  			encounter_reply_out->CustomFields[count].ResponseValueCodes[x].name = UAR_GET_CODE_DISPLAY(e.value_cd)
		   endif
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetCustomFields Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;sub
 
 
end
go
set trace notranslatelock go
 
