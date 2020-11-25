/*~BB~***********************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

*****************************************************************************
          Date Written:       09/16/14
          Source file name:   vigilanz_get_encounters
          Object name:        vigilanz_get_encounters
          Program purpose:    Returns encounter information.
          					  If a FIN NBR is passed in,  it will return encounter
          					  information for that given encounter.  If a FIN NBR
          					  is not passed in,  it will return all encounters
          					  associated to that patient.
          Tables updated:     NONE
          Executing from:     EMISSARY SERVICES
 ****************************************************************************
                   GENERATED MODIFICATION CONTROL LOG
 ****************************************************************************
 
  Mod Date     Engineer             Comment
  ---------------------------------------------------------------------------
  000 9/15/14  AAB					Initial write
  001 11/7/14  AAB					Change PrsnlID to Username
  002 11/11/14 AAB					Added Encntr_detail search
  003 11/12/14 AAB					Add Person ID to reply and reuse GetEncounters
  004 11/13/14 AAB					Changed reply_out to patient_encounters_reply_out
  005 11/24/14 AAB          		Remove Fin NBR from request and query param
									Remove person_id from response
  006 12/10/14 AAB					Add a Best Encounter search feature to existing service
  007 12/09/14 AAB        		    Moved EXIT_SCRIPT to ensure reply is sent back
  008 12/17/14 JCO					Changed BestEncounter - 1, EncounterDetail - 2
  009 02/18/15 AAB					Changed Enumeration to start at 1.
  010 03/26/15 AAB					Added PCT object .
  011 03/31/15 AAB 					Added notranslatelock
  012 05/31/15 AAB					Add FIN NBR to response -- alias_finnbr
  013 08/19/15 AAB 					Only return current/ongoing PCT relationships
  014 09/14/15 AAB					Add audit object
  015 12/14/15 AAB					Return Patient class
  016 02/22/16 AAB 					Add encntr_type_cd and encntr_type_disp
  017 04/29/16 AAB 					Added version
  018 08/11/16 DJP					Add NPI to PatientCareTeam Object
  019 08/24/16 DJP					Added facility_org_id to patient_encounters_reply_out and
  									 added condition to check for encntrCnt  > 0
  020 03/31/17 DJP					Added ReasonForVisit and EncounterStatus fields to payload
  										when Encounter Search type is selected
  021 03/31/17 DJP					Add FIN_NBR as search parameter
  022 07/27/17 JCO					Changed %i to execute; update ErrorHandler2
  023 03/21/18 RJC					Added version and copyright block
  024 11/15/18 STV                  Added Discharge_dispostion
  025 12/18/18 RJC					Code cleanup. Added missing input/output fields, added ED location fix
  026 01/11/19 STV                  Added discharge to location
  027 01/14/19 RJC 					Add is_manually_added boolean to patient care team object
  028 04/19/19 STV                  Adjustment to ED Locations query
  029 02/01/20 KRD                  Added arrive_date_time, reg_date_time, pre_reg_date_time
  029 03/09/20 KRD                  Added internal_seq to patient_care_team object
  030 03/12/20 KRD                  Added Comments
  031 03/20/20 STV                  Added Isolation
  026 04/11/20 KRD                  Added patient_valuables
  027 04/29/20 KRD                  Added custom fields object
  027 05/01/20 KRD                  Added Subscriber address and phone objects
***********************************************************************/
drop program vigilanz_get_encounters go
create program vigilanz_get_encounters
 
/************************************************************************
; REQUEST
************************************************************************/
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Username:" = ""
	, "Person ID:" = ""
	, "Search Type:" = 1
	, "Include Care Team" = 0
	, "Financial Number:" = ""
	, "FromDate" = ""
	, "ToDate" = ""
	, "EncounterTypeId" = ""
	, "Include Comments:" = 0
	, "Include Custom  Fields:" = 0
	, "DebugFlag" = 0
 
with OUTDEV, USERNAME, PERSON_ID, SEARCH_TYPE, INC_CARETEAM, FIN_NBR, FROM_DATE,
	TO_DATE, ENC_TYPE, INC_COMMENTS, INC_CUSTOM_FIELDS, DEBUG_FLAG
 
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
; 100041 - PM_SCH_GET_ENCOUNTERS
free record 100041_req
record 100041_req
(
  1  debug                        = i2
  1  encounter_id                 = f8
  1  options                      = vc
  1  person_id                    = f8
  1  return_all                   = i2
  1  security                     = i2
  1  user_id                      = f8
  1  user_name                    = vc
  1  limit_ind                    = i2
  1  max_encntr                   = i4
  1  filter[*]
     2  flag                      = i2
     2  meaning                   = vc
     2  options                   = vc
     2  phonetic                  = i2
     2  value                     = vc
     2  weight                    = f8
     2	values[*]
     	  3  value                = vc
  1  result[*]
     2  flag                      = i2
     2  meaning                   = vc
     2  options                   = vc
  1  limit[*]
     2  encntr_type_class_cd      = f8
     2  date_option               = i2
     2  num_days                  = i2
  1  end_effective_dt_tm		 = dq8
)
 
free record 100041_rep
record 100041_rep
(
  1  filter_str                   	= vc
  1  limited_count			 	  	= i2
  1  encounter[*]
	2 attending_provider_id			= f8
    2  encounter_id              	= f8
    2  admit_type                	= vc
    2  alias_xxx                 	= vc
    2  arrive_date               	= dq8
    2  facility                  	= vc
    2  building                  	= vc
    2  nursing_unit              	= vc
    2  loc_bed_cd				  	= f8
    2  bed                       	= vc
    2  client                    	= vc
    2  depart_date               	= dq8
    2  discharge_date            	= dq8
    2  discharge_location        	= vc
    2  discharge_disposition_disp 	= vc
    2  discharge_disposition_cd 	= f8
    2  encounter_status          	= vc
    2  encounter_type            	= vc
    2  encounter_type_class      	= vc
	2  encntr_type_cd			  	= f8
	2  encntr_type_disp		  		= vc
	2  encntr_type_class_cd	  		= f8
	2  encntr_type_class_disp	  	= vc
    2  estimated_arrive_date     	= dq8
    2  estimated_depart_date     	= dq8
    2  financial_class           	= vc
    2  isolation                 	= vc
    2  medical_service           	= vc
    2  preregistration_clerk     	= vc
    2  preregistration_date      	= dq8
    2  provider_xxx              	= vc
    2  reason_for_visit          	= vc
    2  registration_clerk        	= vc
    2  registration_date         	= dq8
    2  room                      	= vc
    2  vip                       	= vc
    2  billingentity             	= vc
    2  program_service           	= vc
    2  specialty_unit            	= vc
    2  episode_display			  	= vc
    2  location_extension        	= vc
    2  removal_dt_tm             	= dq8
    2  alias_finnbr		      		= vc
    2  ghost_encntr_ind	  	  		= i2
    2  encounter_type_cd		  	= f8
    2  organization_id			  	= f8
    2  primary_guar_name		  	= vc
    2  facility_org_id			  	= f8
	2  patient_care_team[*]
		 3 provider_id			  	= f8
		 3 provider_name		  	= vc
		 3 reltn_type			  	= vc
		 3 from_date              	= dq8
		 3 to_date                	= dq8
		 3 npi					  	= vc
  1 status_data
    2 status 						= c1
    2 subeventstatus[1]
      3 OperationName 				= c25
      3 OperationStatus 			= c1
      3 TargetObjectName 			= c25
      3 TargetObjectValue 			= vc
      3 Code 						= c4
      3 Description = vc
 
)
 
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
 
; Final reply out
free record patient_encounters_reply_out
record patient_encounters_reply_out(
	1 encounter[*]
		2 attending_provider
			3 provider_id						= f8
			3 provider_name						= vc
		2 discharge_disposition_disp			= vc
		2 disch_disposition_cd                  = f8
		2 discharge_to_loc_cd        		    = f8
 		2 discharge_to_loc_disp                 = vc
		2 alias_finnbr							= vc
		2 registration_date						= dq8
		2 encounter_status						= vc
		2 facility_id							= f8
		2 facility								= vc
		2 nursing_unit_id						= f8
		2 nursing_unit							= vc
		2 room_id								= f8
		2 room									= vc
		2 bed_id								= f8
		2 bed									= vc
		2 medical_service						= vc
  		2 arrive_date_time              		= dq8	;029
  		2 reg_date_time                 		= dq8	;029
  		2 pre_reg_date_time             		= dq8	;029
    	2 patient_valuables [*]
  	  		3 id = f8
  	  		3 name = vc
  		2 isolation
  			3 id = f8
  			3 name = vc
    	2 Comments [*]
			 3 CMT_TEXT 						= vc
	         3 UPDT_ID  						= f8
	         3 UPDT_DT_TM 						= dq8
	         3 Internal_Seq 					= i4
		2 CustomFields[*]
		  3 Field
			4 id = f8
			4 name = vc
		  3 ResponseValueText [*] = vc
		  3 ResponseValueCodes[*]
			4 id = f8
			4 name = vc
		2 patient_care_team[*]
   	        3 internal_seq                      = i4
			3 provider_id			  			= f8
			3 provider_name		  				= vc
			3 reltn_type			  			= vc
			3 from_date              			= dq8
			3 to_date                			= dq8
			3 npi					  			= vc
			3 phones[*]
				4 phone_id 						= f8
				4 phone_type_cd 				= f8
				4 phone_type_disp 				= vc
				4 phone_type_mean 				= vc
				4 phone_num 					= vc
				4 sequence_nbr 					= i4
			3 is_manually_added					= i2
		2 patient_id							= f8
		2 reason_for_visit						= vc
		2 patient_class
			3 id								= f8
			3 name								= vc
		2 admit_type
			3 id								= f8
			3 name								= vc
		2 admit_source
			3 id								= f8
			3 name								= vc
		2 health_plans[*]   						;021
			3 plan_name							= vc
			3 plan_desc							= vc
			3 group_nbr							= vc
			3 group_name						= vc
			3 policy_nbr						= vc
			3 plan_class_cd 					= f8
			3 plan_class_disp					= vc
			3 plan_type_cd    					= f8
			3 plan_type_disp    				= vc
			3 member_nbr						= vc
			3 payor_name						= vc
			3 payor_phone						= vc
			3 payor_state						= vc
		 	3 subscriber_last_name				= vc
			3 subscriber_first_name				= vc
			3 subscriber_date_of_birth			= dq8
			3 subscriber_reltn_to_patient_cd 	= f8
			3 subscriber_reltn_to_patient_desc 	= vc
			3 patient_reltn_to_subscriber_cd 	= f8
			3 patient_reltn_to_subscriber_desc 	= vc
			3 priority_sequence 				= i4
			3 begin_effective_dt_tm				= dq8
			3 end_effective_dt_tm				= dq8
	        3 insurance_id = f8
	        3 active_ind = i2
	        3 active_status_cd = f8
	        3 active_status_disp = vc
	        3 active_status_prsnl_id = f8
	        3 active_status_dt_tm = dq8
	        3 data_status_cd = f8
	        3 data_status_disp = vc
	        3 data_status_prsnl_id = f8
	        3 data_status_dt_tm = dq8
	        3 ins_card_copied
	          4 id = f8
	          4 name = vc
	        3 health_plan_id = f8
	        3 eligibility_status
	          4 id = f8
	          4 name = vc
	        3 subscriber_id = f8
	        3 insured_card_name_first = vc
	        3 insured_card_name_middle = vc
	        3 insured_card_name_last = vc
	        3 insured_card_name = vc
	        3 subs_member_nbr = vc
	        3 verify_status
	          4 id = f8
	          4 name = vc
	        3 verify_source
	          4 id = f8
	          4 name = vc
	        3 verify_prsnl_id = f8
	        3 verify_dt_tm = dq8
	        3 assign_benefits
	          4 id = f8
	          4 name = vc
	        3 deduct_amt = f8
	        3 deduct_remain_amt = f8
	        3 deduct_inc_max_oop = f8
	        3 copay_amt = f8
	        3 copay_inc_max_oop = f8
	        3 max_out_pckt_amt = f8
	        3 fam_deduct_met_amt = f8
	        3 subscriber_address
	          4 address_id = f8
	          4 address_type_cd = f8
	          4 address_type_disp = vc
	          4 address_type_mean = vc
	          4 street_addr = vc
	          4 street_addr2 = vc
	          4 street_addr3 = vc
	          4 city = vc
	          4 state_cd = f8
	          4 state_disp = vc
	          4 state_mean = vc
	          4 zipcode = vc
	          4 country_cd = f8
	          4 country_disp = vc
	          4 county_cd = f8
	          4 county_disp = vc
	          4 sequence_nbr = i4
	          4 end_effective_dt_tm = dq8
	        3 subscriber_phones[*]
	          4 phone_id = f8
	          4 phone_type_cd = f8
	          4 phone_type_disp = vc
	          4 phone_type_mean = vc
	          4 phone_num = vc
	          4 sequence_nbr = i4
	          4 extension = vc
	          4 end_effective_dt_tm = dq8
	          4 phone_format
	            5 id = f8
	            5 name = vc
 
		2 encounter_id							= f8
		2 encounter_type_cv
			3 id								= f8
			3 name								= vc
		2 discharge_date						= dq8
	1 audit
		2 user_id					= f8
		2 user_firstname			= vc
		2 user_lastname			 	= vc
		2 patient_id				= f8
		2 patient_firstname		 	= vc
		2 patient_lastname			= vc
		2 service_version			= vc
	1 status_data
		2 status 					= c1
		2 subeventstatus[1]
			3 OperationName 		= c25
			3 OperationStatus 		= c1
			3 TargetObjectName 		= c25
			3 TargetObjectValue 	= vc
			3 Code 					= c4
			3 Description 			= vc
)
 
set patient_encounters_reply_out->status_data->status = "F"
set 100043_rep->status_data->status = "F"
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Input
declare dPersonID  			= f8 with protect, noconstant(0.0)
declare sUserName  			= vc with protect, noconstant("")
declare sFinancialNumber	= vc with protect, noconstant("0")
declare iEncSearchType		= i2 with protect, noconstant(0)
declare iIncCareteam		= i4 with protect, noconstant(0) ;This field is ignored. It is used within Emissary
declare iIncComments	 	= i2 with protect, noconstant(0)
declare sFromDate			= vc with protect, noconstant("")
declare sToDate				= vc with protect, noconstant("")
declare dEncounterTypeId	= f8 with protect, noconstant(0.0)
declare iIncCustomFields	 				= i2 with protect, noconstant(0)
declare iDebugFlag			= i2 with protect, noconstant(0)
 
;Other
declare dPrsnlID  		= f8 with protect, noconstant(0.0)
declare dEncntrID		= f8 with protect, noconstant(0.0)
declare qFromDateTime	= dq8 with protect, noconstant(0)
declare qToDateTime		= dq8 with protect, noconstant(0)
 
;Constants
declare c_finnbr_encntr_type_cd				= f8 with protect, constant(uar_get_code_by("MEANING", 319, "FIN NBR"))
declare c_npi_prsnl_alias_type_cd			= f8 with protect, constant(uar_get_code_by("MEANING", 320, "NPI"))
declare c_emergency_encntr_type_class_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",69,"EMERGENCY"))
declare c_insured_person_reltn_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",351,"INSURED"))
declare c_active_active_status_cd			= f8 with protect, constant(uar_get_code_by("MEANING",48,"ACTIVE"))
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
set dPersonId			= cnvtreal($PERSON_ID)
set sFinancialNumber	= trim($FIN_NBR,3)
set iEncSearchType 		= cnvtint($SEARCH_TYPE)
set iIncCareteam 		= cnvtint($INC_CARETEAM)
set iIncComments		= cnvtint($INC_COMMENTS)
set sFromDate			= trim($FROM_DATE,3)
set sToDate				= trim($TO_DATE,3)
set dEncounterTypeId	= cnvtreal($ENC_TYPE)
set iIncCustomFields	= cnvtint($INC_CUSTOM_FIELDS)
set iDebugFlag			= cnvtint($DEBUG_FLAG)
 
;Other
set dPrsnlID 			= GetPrsnlIDfromUserName(sUserName)
 
; Set dates
if(sFromDate = "")
	set sFromDate = "01-Jan-1900 00:00:00"
endif
if(sToDate = "")
	set sToDate = "31-Dec-2100 23:59:59"
endif
 
set qFromDateTime = GetDateTime(sFromDate)
set qToDateTime = GetDateTime(sToDate)
 
; Get encnounter id if FIN provided
if(sFinancialNumber > " ")
	set dEncntrId = GetEncntrIdByAlias(sFinancialNumber,c_finnbr_encntr_type_cd)
endif
 
; Set person id based on encounter id
if(dPersonId = 0 and dEncntrId > 0)
	select into "nl:"
	from encounter e
	where e.encntr_id = dEncntrId
	detail
		dPersonId = e.person_id
	with nocounter
endif
 
if(iDebugFlag > 0)
	call echo(build("dPersonID ->", dPersonID))
	call echo(build("sUserName ->", sUserName))
	call echo(build("iEncSearchType ->", iEncSearchType))
	call echo(build("iIncCareteam ->", iIncCareteam))
	call echo(build("sFinancialNumber ->", sFinancialNumber))
	call echo(build("dEncntrID->", dEncntrID))
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetEncounters(null)					= null with protect
declare GetBestEncntrs(null)				= null with protect
declare GetEncounterDetail(null)			= null with protect
declare GetHealthplans(null)				= null with protect
declare GetEDLocationInfo(null)				= null with protect
declare GetComments(null)                   = null with protect
declare GetPatientValuables(null)			= null with protect
declare GetCustomFields(null)               = null with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Validate person id exists
if(dPersonID = 0)
	call ErrorHandler2("VALIDATE", "F", "ENCOUNTERS", "No Person ID was passed in",
 	"2055", "Missing required field: PatientId", patient_encounters_reply_out)	;022
	go to EXIT_SCRIPT
endif
 
; Populate audit
set iRet = PopulateAudit(sUserName, dPersonID, patient_encounters_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "ENCOUNTERS", "Invalid User for Audit.",
	"1001", build("UserId is invalid: ",sUserName), patient_encounters_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate date parameters
if(qFromDateTime > qToDateTime)
	call ErrorHandler2("VALIDATE", "F", "ENCOUNTERS", "Invalid dates: FromDate is greater than ToDate.",
	"9999", "Invalid dates: FromDate is greater than ToDate.", patient_encounters_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate EncounterTypeId if provided
if(dEncounterTypeId > 0)
	set iRet = GetCodeSet(dEncounterTypeId)
	if(iRet != 71)
		call ErrorHandler2("VALIDATE", "F", "ENCOUNTERS", "Invalid EncounterTypeId.",
		"9999", "Invalid EncounterTypeId.", patient_encounters_reply_out)
		go to EXIT_SCRIPT
	endif
endif
 
; Validate Search Type and retrieve encounters
if(iEncSearchType < 2) 		; Encounter Search option
	call GetEncounters(null)
elseif(iEncSearchType = 2) 	; Best Encounter
	call GetBestEncntrs(null)
else
    call ErrorHandler2("EXECUTE", "F", "ENCOUNTERS", "Encounter Search Type: unsupported",
    "2033", build("Invalid Search Type: ",iEncSearchType), patient_encounters_reply_out)
endif
 
;Get encounter detail
call GetEncounterDetail(null)
 
;Get health plans
call GetHealthplans(null)
 
; Check ED encounters if missing room/bed
call GetEDLocationInfo(null)
 
;Get patient_care_team information
if (iIncComments > 0)
  call GetComments(null)
endif
 
;Get patient_valuables
call GetPatientValuables(null)
 
;Get custom fields information
if (iIncCustomFields > 0)
   call GetCustomFields(null)
endif
 
; Set audit to success
call ErrorHandler("Get Encounters", "S", "Success", "Process completed successfully.", patient_encounters_reply_out)
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(patient_encounters_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_encounters.json")
	call echo(build2("_file : ", _file))
	call echojson(patient_encounters_reply_out, _file, 0)
	call echorecord(patient_encounters_reply_out)
	call echo(JSONout)
endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: GetEncounters(null)
;  Description: This will retrieve all encounters for a patient
**************************************************************************/
subroutine GetEncounters(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetEncounters Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iApplication = 600005
	set iTask = 100040
	set iRequest = 100041
 
	; Setup request
	set 100041_req->debug                        = 0
	set 100041_req->encounter_id                 = dEncntrID
	set 100041_req->options                      = "1000600005000000000   1"
	set 100041_req->person_id                    = dPersonID
	set 100041_req->return_all                   = 0
	set 100041_req->security                     = 0
	set 100041_req->user_id                      = dPrsnlID
	set 100041_req->user_name                    = sUserName
	set 100041_req->limit_ind                    = 0
	set 100041_req->max_encntr                   = 502
 
	if(sFinancialNumber != "")
		set stat = alterlist(100041_req->filter, 1)
		set 100041_req->filter[1]->flag = 120
		set 100041_req->filter[1]->meaning = "FIN NBR"
		set 100041_req->filter[1]->options = ""
		set 100041_req->filter[1]->phonetic = 0
		set 100041_req->filter[1]->value = build(sFinancialNumber,"*")
		set 100041_req->filter[1]->value = sFinancialNumber
		set 100041_req->filter[1]->weight = 0
	endif
 
	set stat = alterlist(100041_req->result, 19)
	;1
	set 100041_req->result[1]->flag = 120
	set 100041_req->result[1]->meaning = "FIN NBR"
	set 100041_req->result[1]->options = ""
 
	;2
	set 100041_req->result[2]->flag = 139
	set 100041_req->result[2]->meaning = ""
	set 100041_req->result[2]->options = ""
 
	;3
	set 100041_req->result[3]->flag = 144
	set 100041_req->result[3]->meaning = ""
	set 100041_req->result[3]->options = ""
 
	;4
	set 100041_req->result[4]->flag = 150
	set 100041_req->result[4]->meaning = ""
	set 100041_req->result[4]->options = ""
 
	;5
	set 100041_req->result[5]->flag = 162
	set 100041_req->result[5]->meaning = ""
	set 100041_req->result[5]->options = ""
 
	;6
	set 100041_req->result[6]->flag = 110
	set 100041_req->result[6]->meaning = ""
	set 100041_req->result[6]->options = ""
 
	;7
	set 100041_req->result[7]->flag = 149
	set 100041_req->result[7]->meaning = ""
	set 100041_req->result[7]->options = ""
 
	;8
	set 100041_req->result[8]->flag = 160
	set 100041_req->result[8]->meaning = ""
	set 100041_req->result[8]->options = ""
 
	;9
	set 100041_req->result[9]->flag = 118
	set 100041_req->result[9]->meaning = ""
	set 100041_req->result[9]->options = ""
 
	;10
	set 100041_req->result[10]->flag = 232
	set 100041_req->result[10]->meaning = ""
	set 100041_req->result[10]->options = ""
 
	;11
	set 100041_req->result[11]->flag = 233
	set 100041_req->result[11]->meaning = ""
	set 100041_req->result[11]->options = ""
 
	;12
	set 100041_req->result[12]->flag = 214
	set 100041_req->result[12]->meaning = ""
	set 100041_req->result[12]->options = ""
 
	;13
	set 100041_req->result[13]->flag = 216
	set 100041_req->result[13]->meaning = "SSN"
	set 100041_req->result[13]->options = ""
 
	;14
	set 100041_req->result[14]->flag = 216
	set 100041_req->result[14]->meaning = "MRN"
	set 100041_req->result[14]->options = ""
 
	;15
	set 100041_req->result[15]->flag = 208
	set 100041_req->result[15]->meaning = ""
	set 100041_req->result[15]->options = ""
 
	;16
	set 100041_req->result[16]->flag = 204
	set 100041_req->result[16]->meaning = ""
	set 100041_req->result[16]->options = ""
 
	;17
	set 100041_req->result[17]->flag = 203
	set 100041_req->result[17]->meaning = ""
	set 100041_req->result[17]->options = ""
 
	;18
	set 100041_req->result[18]->flag = 194
	set 100041_req->result[18]->meaning = ""
	set 100041_req->result[18]->options = ""
 
	;19
	set 100041_req->result[19]->flag = 198
	set 100041_req->result[19]->meaning = ""
	set 100041_req->result[19]->options = ""
 
	; Execute request
	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",100041_req,"REC",100041_rep)
 
	if (100041_rep->status_data->status = "F")
		call ErrorHandler2("Get Encounters", "F", "Execute", "Error executing 100040 - Encounter Search",
		"9999", "Error executing 100040 - Encounter Search", patient_encounters_reply_out)
		go to exit_script
	else
		set encCnt = size(100041_rep->encounter,5)
		if(encCnt > 0)
			set idx = 0
			for(i = 1 to encCnt)
				; Filter by date
			  if( 100041_rep->encounter[i].preregistration_date between cnvtdatetime(qFromDateTime) and cnvtdatetime(qToDateTime)
				or 100041_rep->encounter[i].registration_date between cnvtdatetime(qFromDateTime) and cnvtdatetime(qToDateTime))
 
					;Filter by encounter type
					if(dEncounterTypeId > 0)
						if(dEncounterTypeId = 100041_rep->encounter[i].encounter_type_cd)
							set idx = idx + 1
							set stat = alterlist(patient_encounters_reply_out->encounter,idx)
							set patient_encounters_reply_out->encounter[idx].encounter_id = 100041_rep->encounter[i].encounter_id
						endif
					else
						set idx = idx + 1
						set stat = alterlist(patient_encounters_reply_out->encounter,idx)
						set patient_encounters_reply_out->encounter[idx].encounter_id = 100041_rep->encounter[i].encounter_id
					endif
				endif
			endfor
			if(size(patient_encounters_reply_out->encounter,5) = 0)
				call ErrorHandler2("Get Encounters", "Z", "Success", "No encounters found.","0000",
				"No encounters found.", patient_encounters_reply_out)
				go to exit_script
			endif
		else
			call ErrorHandler2("Get Encounters", "Z", "Success", "No encounters found.","0000",
			"No encounters found.", patient_encounters_reply_out)
			go to exit_script
		endif
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetEncounters Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;End Sub
 
/*************************************************************************
;  Name: GetBestEncntrs(null)
;  Description: Subroutine to get the Best Encounter for a patient
**************************************************************************/
subroutine GetBestEncntrs(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetBestEncntrs Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	free record encntrRequest
	record encntrRequest (
		1 persons[*]
			2 person_id = F8
	)
 
	free record encntrReply
	record encntrReply (
	  1 encounters[*]
			2 encntr_id = f8
			2 person_id = f8
	  1 lookup_status = i4
	  1 status_data
	    2 status = c1
	    2 subeventstatus[1]
	      3 OperationName = c25
	      3 OperationStatus = c1
	      3 TargetObjectName = c25
	      3 TargetObjectValue = vc
	)
 
 	; Setup request
	set stat = alterlist (encntrRequest->persons, 1)
	set encntrRequest->persons[1]->person_id = dPersonID
 
 	; Execute request
	execute pts_get_best_encntr_list WITH REPLACE(REQUEST,encntrRequest),REPLACE(REPLY,encntrReply)
 	set encntrCnt = size (encntrReply->encounters, 5)
 
 	if(encntrCnt > 0)
 		set stat = alterlist(patient_encounters_reply_out->encounter,1)
		for(x = 1 to encntrCnt)
			set patient_encounters_reply_out->encounter[1].encounter_id = encntrReply->encounters[x]->encntr_id
		endfor
 	else
 		call ErrorHandler2("Get Encounters", "Z", "Success", "No encounters found.","0000",
		"No encounters found.", patient_encounters_reply_out)
		go to exit_script
	endif
 
 	if(iDebugFlag > 0)
		call echo(concat("GetBestEncntrs Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;End Sub
 
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
 
	for(i = 1 to size(patient_encounters_reply_out->encounter,5))
		; Setup request
		set stat = initrec(100043_req)
		set stat = initrec(100043_rep)
		set 100043_req->encntr_id = patient_encounters_reply_out->encounter[i].encounter_id
 
		; Execute request
		set stat = tdbexecute(iApplication, iTask, iRequest,"REC",100043_req,"REC",100043_rep)
 
		if(100043_rep->status_data.status = "F")
			call ErrorHandler2("EXECUTE", "F", "ENCOUNTERS", "Error executing 100043",
			"9999", "Error executing 100043", patient_encounters_reply_out)
			go to EXIT_SCRIPT
		else
			; Build final reply
			set patient_encounters_reply_out->encounter[i]->admit_type.id = 100043_rep->admit_type_cd
			set patient_encounters_reply_out->encounter[i]->admit_type.name = uar_get_code_display(100043_rep->admit_type_cd)
			set patient_encounters_reply_out->encounter[i]->admit_source.id = 100043_rep->admit_src_cd
			set patient_encounters_reply_out->encounter[i]->admit_source.name = 100043_rep->admit_src_disp
			set patient_encounters_reply_out->encounter[i]->bed = 100043_rep->loc_bed_disp
			set patient_encounters_reply_out->encounter[i]->bed_id = 100043_rep->loc_bed_cd
			set patient_encounters_reply_out->encounter[i]->discharge_date = 100043_rep->disch_dt_tm
			set patient_encounters_reply_out->encounter[i]->disch_disposition_cd = 100043_rep->disch_disposition_cd
			set patient_encounters_reply_out->encounter[i]->discharge_disposition_disp = 100043_rep->disch_disposition_disp
			set patient_encounters_reply_out->encounter[i]->discharge_to_loc_cd = 100043_rep->disch_to_loctn_cd
			set patient_encounters_reply_out->encounter[i]->discharge_to_loc_disp = 100043_rep->disch_to_loctn_disp
			set patient_encounters_reply_out->encounter[i]->encounter_status = 100043_rep->encntr_status_disp
			set patient_encounters_reply_out->encounter[i]->encounter_type_cv.id = 100043_rep->encntr_type_cd
			set patient_encounters_reply_out->encounter[i]->encounter_type_cv.name = 100043_rep->encntr_type_disp
			set patient_encounters_reply_out->encounter[i]->facility = 100043_rep->loc_facility_disp
			set patient_encounters_reply_out->encounter[i]->facility_id = 100043_rep->loc_facility_cd
			set patient_encounters_reply_out->encounter[i]->medical_service = 100043_rep->med_service_disp
			set patient_encounters_reply_out->encounter[i]->nursing_unit = 100043_rep->loc_nurse_unit_disp
			set patient_encounters_reply_out->encounter[i]->nursing_unit_id = 100043_rep->loc_nurse_unit_cd
			set patient_encounters_reply_out->encounter[i]->patient_class.id = GetPatientClass(100043_rep->encntr_id,2)
			set patient_encounters_reply_out->encounter[i]->patient_class.name =
				uar_get_code_display(patient_encounters_reply_out->encounter[i]->patient_class.id)
			set patient_encounters_reply_out->encounter[i]->patient_id = 100043_rep->person_id
			set patient_encounters_reply_out->encounter[i]->reason_for_visit = 100043_rep->reason_for_visit
			set  patient_encounters_reply_out->encounter[i]->isolation.id = 100043_rep->isolation_cd
			set  patient_encounters_reply_out->encounter[i]->isolation.name = 100043_rep->isolation_disp
			if(100043_rep->arrive_dt_tm > 0)
				set patient_encounters_reply_out->encounter[i]->registration_date = 100043_rep->arrive_dt_tm
			elseif(100043_rep->reg_dt_tm > 0)
				set patient_encounters_reply_out->encounter[i]->registration_date = 100043_rep->reg_dt_tm
			else
				set patient_encounters_reply_out->encounter[i]->registration_date = 100043_rep->pre_reg_dt_tm
			endif
 
			set patient_encounters_reply_out->encounter[i]->arrive_date_time = 100043_rep->arrive_dt_tm 	;029
			set patient_encounters_reply_out->encounter[i]->reg_date_time = 100043_rep->reg_dt_tm 			;029
			set patient_encounters_reply_out->encounter[i]->pre_reg_date_time = 100043_rep->pre_reg_dt_tm	;029
 
			set patient_encounters_reply_out->encounter[i]->room = 100043_rep->loc_room_disp
			set patient_encounters_reply_out->encounter[i]->room_id = 100043_rep->loc_room_cd
 
			; Get Financial Number
			for(x = 1 to size(100043_rep->alias,5))
				if(100043_rep->alias[x]->encntr_alias_type_cd = c_finnbr_encntr_type_cd)
					set patient_encounters_reply_out->encounter[i]->alias_finnbr = 100043_rep->alias[x]->alias
				endif
			endfor
 
			; Patient CareTeam and Attending Provider
			if(iIncCareteam > 0)
				set prsnlSize = size(100043_rep->provider,5)
				if(prsnlSize > 0)
					set stat = alterlist(patient_encounters_reply_out->encounter[i]->patient_care_team,prsnlSize)
					for(x = 1 to prsnlSize)
						set patient_encounters_reply_out->encounter[i]->patient_care_team[x].provider_id =
						100043_rep->provider[x].prsnl_person_id
						set patient_encounters_reply_out->encounter[i]->patient_care_team[x].provider_name =
							100043_rep->provider[x].name_full_formatted
						set patient_encounters_reply_out->encounter[i]->patient_care_team[x].reltn_type =
							100043_rep->provider[x].encntr_prsnl_r_disp
 
						if(100043_rep->provider[x].encntr_prsnl_r_mean = "ATTENDDOC")
							set patient_encounters_reply_out->encounter[i]->attending_provider.provider_id =
							100043_rep->provider[x].prsnl_person_id
						set patient_encounters_reply_out->encounter[i]->attending_provider.provider_name =
						100043_rep->provider[x].name_full_formatted
						endif
 
						; Get From/To dates
						select into "nl:"
						from encntr_prsnl_reltn epr
						where epr.encntr_prsnl_reltn_id = 100043_rep->provider[x].encntr_prsnl_reltn_id
						detail
							patient_encounters_reply_out->encounter[i]->patient_care_team[x].from_date = epr.beg_effective_dt_tm
							patient_encounters_reply_out->encounter[i]->patient_care_team[x].to_date = epr.end_effective_dt_tm
							patient_encounters_reply_out->encounter[i]->patient_care_team[x].is_manually_added =
							epr.manual_create_ind
							patient_encounters_reply_out->encounter[i]->patient_care_team[x].internal_seq  = epr.internal_seq
						with nocounter
 
						; Get NPI
						select into "nl:"
						from prsnl_alias pa
						where pa.person_id = 100043_rep->provider[x].prsnl_person_id
							and pa.prsnl_alias_type_cd = c_npi_prsnl_alias_type_cd
							and pa.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
							and pa.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
						detail
							patient_encounters_reply_out->encounter[i]->patient_care_team[x].npi = pa.alias
						with nocounter
 
						; Get phone numbers
						select into "nl:"
						from phone ph
						plan ph where ph.parent_entity_id =
						                           patient_encounters_reply_out->encounter[i]->patient_care_team[x].provider_id
					  		and ph.parent_entity_name = "PERSON"
					 		and ph.active_ind = 1
						  	and ph.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
						   	and ph.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
						head report
							p = 0
						detail
							p = p + 1
							stat = alterlist(patient_encounters_reply_out->encounter[i]->patient_care_team[x].phones,p)
 
							patient_encounters_reply_out->encounter[i]->patient_care_team[x].phones[p].phone_id = ph.phone_id
							patient_encounters_reply_out->encounter[i]->patient_care_team[x].phones[p].phone_type_cd =
							                                                                                 ph.phone_type_cd
							patient_encounters_reply_out->encounter[i]->patient_care_team[x].phones[p].phone_type_disp =
								uar_get_code_display(ph.phone_type_cd)
							patient_encounters_reply_out->encounter[i]->patient_care_team[x].phones[p].phone_type_mean =
								uar_get_code_meaning(ph.phone_type_cd)
							patient_encounters_reply_out->encounter[i]->patient_care_team[x].phones[p].phone_num = ph.phone_num
							patient_encounters_reply_out->encounter[i]->patient_care_team[x].phones[p].sequence_nbr = ph.seq
						with nocounter
					endfor
				endif
			endif
		endif
 	endfor
 
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
	from (dummyt d with seq = size(patient_encounters_reply_out->encounter,5))
		,encntr_plan_reltn eplr
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
 	plan d
	join eplr where eplr.encntr_id = patient_encounters_reply_out->encounter[d.seq].encounter_id
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
	order by eplr.priority_seq, hp.plan_name, ph1.phone_type_cd, ph1.phone_type_seq,
             ph1.phone_id
 
 	head report
 		x = 0
 		iPhoneIndex = 0
	head eplr.priority_seq
        iPhoneIndex = 0
		x =  x + 1
		stat = alterlist(patient_encounters_reply_out->encounter[d.seq].health_plans, x)
 
		patient_encounters_reply_out->encounter[d.seq].health_plans[x]->plan_name = hp.plan_name
		patient_encounters_reply_out->encounter[d.seq].health_plans[x]->plan_desc = hp.plan_desc
		patient_encounters_reply_out->encounter[d.seq].health_plans[x]->group_nbr = eplr.group_nbr
		patient_encounters_reply_out->encounter[d.seq].health_plans[x]->group_name = eplr.group_name
		patient_encounters_reply_out->encounter[d.seq].health_plans[x]->policy_nbr = eplr.policy_nbr   ;hp.policy_nbr
		patient_encounters_reply_out->encounter[d.seq].health_plans[x]->plan_type_cd = hp.plan_type_cd
		patient_encounters_reply_out->encounter[d.seq].health_plans[x]->plan_type_disp = uar_get_code_display(hp.plan_type_cd)
		patient_encounters_reply_out->encounter[d.seq].health_plans[x]->plan_class_cd = hp.plan_class_cd
		patient_encounters_reply_out->encounter[d.seq].health_plans[x]->plan_class_disp = uar_get_code_display(hp.plan_class_cd)
		patient_encounters_reply_out->encounter[d.seq].health_plans[x]->member_nbr = eplr.member_nbr
 		patient_encounters_reply_out->encounter[d.seq].health_plans[x].payor_name = o.org_name
 		patient_encounters_reply_out->encounter[d.seq].health_plans[x].payor_phone = ph.phone_num
 		if (ad.state_cd = 0.0)
 			patient_encounters_reply_out->encounter[d.seq].health_plans[x].payor_state = trim(ad.state)
 		else
 			patient_encounters_reply_out->encounter[d.seq].health_plans[x].payor_state = uar_get_code_display(ad.state_cd)
 		endif
        patient_encounters_reply_out->encounter[d.seq].health_plans[x].subscriber_id = p.person_id
		patient_encounters_reply_out->encounter[d.seq].health_plans[x].subscriber_last_name = p.name_last_key
		patient_encounters_reply_out->encounter[d.seq].health_plans[x].subscriber_first_name = p.name_first_key
		patient_encounters_reply_out->encounter[d.seq].health_plans[x].subscriber_date_of_birth = p.birth_dt_tm
		patient_encounters_reply_out->encounter[d.seq].health_plans[x].subscriber_reltn_to_patient_cd = epr.person_reltn_cd
		patient_encounters_reply_out->encounter[d.seq].health_plans[x].subscriber_reltn_to_patient_desc =
			uar_get_code_display(epr.person_reltn_cd)
		patient_encounters_reply_out->encounter[d.seq].health_plans[x].patient_reltn_to_subscriber_cd=
		                                                                                    epr.related_person_reltn_cd
		patient_encounters_reply_out->encounter[d.seq].health_plans[x].patient_reltn_to_subscriber_desc =
			uar_get_code_display(epr.related_person_reltn_cd)
		patient_encounters_reply_out->encounter[d.seq].health_plans[x].priority_sequence = eplr.priority_seq
		patient_encounters_reply_out->encounter[d.seq].health_plans[x].begin_effective_dt_tm = eplr.beg_effective_dt_tm
		patient_encounters_reply_out->encounter[d.seq].health_plans[x].end_effective_dt_tm = eplr.end_effective_dt_tm
        patient_encounters_reply_out->encounter[d.seq].health_plans[x].insurance_id = eplr.encntr_plan_reltn_id
        patient_encounters_reply_out->encounter[d.seq].health_plans[x].active_ind = eplr.active_ind
        patient_encounters_reply_out->encounter[d.seq].health_plans[x].active_status_cd = eplr.active_status_cd
        patient_encounters_reply_out->encounter[d.seq].health_plans[x].active_status_disp =
                                                                trim(uar_get_code_display(eplr.active_status_cd), 3)
        patient_encounters_reply_out->encounter[d.seq].health_plans[x].active_status_prsnl_id = eplr.active_status_prsnl_id
        patient_encounters_reply_out->encounter[d.seq].health_plans[x].active_status_dt_tm = eplr.active_status_dt_tm
        patient_encounters_reply_out->encounter[d.seq].health_plans[x].data_status_cd = eplr.data_status_cd
        patient_encounters_reply_out->encounter[d.seq].health_plans[x].data_status_disp =
        																trim(uar_get_code_display(eplr.data_status_cd), 3)
        patient_encounters_reply_out->encounter[d.seq].health_plans[x].data_status_prsnl_id = eplr.data_status_prsnl_id
        patient_encounters_reply_out->encounter[d.seq].health_plans[x].data_status_dt_tm = eplr.data_status_dt_tm
        patient_encounters_reply_out->encounter[d.seq].health_plans[x].ins_card_copied.id = eplr.ins_card_copied_cd
        patient_encounters_reply_out->encounter[d.seq].health_plans[x].ins_card_copied.name =
        																trim(uar_get_code_display(eplr.ins_card_copied_cd), 3)
        patient_encounters_reply_out->encounter[d.seq].health_plans[x].health_plan_id = eplr.health_plan_id
         patient_encounters_reply_out->encounter[d.seq].health_plans[x].insured_card_name_first =
        																				trim(eplr.insured_card_name_first,3)
        patient_encounters_reply_out->encounter[d.seq].health_plans[x].insured_card_name_middle =
        																				trim(eplr.insured_card_name_middle,3)
        patient_encounters_reply_out->encounter[d.seq].health_plans[x].insured_card_name_last =
        																				trim(eplr.insured_card_name_last,3)
        patient_encounters_reply_out->encounter[d.seq].health_plans[x].insured_card_name =
        																				trim(eplr.insured_card_name)
        patient_encounters_reply_out->encounter[d.seq].health_plans[x].subs_member_nbr = trim(eplr.subs_member_nbr, 3)
        patient_encounters_reply_out->encounter[d.seq].health_plans[x].verify_status.id = eplr.verify_status_cd
        patient_encounters_reply_out->encounter[d.seq].health_plans[x].verify_status.name =
        																trim(uar_get_code_display(eplr.verify_status_cd), 3)
        patient_encounters_reply_out->encounter[d.seq].health_plans[x].verify_source.id = eplr.verify_source_cd
        patient_encounters_reply_out->encounter[d.seq].health_plans[x].verify_source.name =
        																trim(uar_get_code_display(eplr.verify_source_cd), 3)
        patient_encounters_reply_out->encounter[d.seq].health_plans[x].verify_prsnl_id = eplr.verify_prsnl_id
        patient_encounters_reply_out->encounter[d.seq].health_plans[x].verify_dt_tm = eplr.verify_dt_tm
        patient_encounters_reply_out->encounter[d.seq].health_plans[x].assign_benefits.id = eplr.assign_benefits_cd
        patient_encounters_reply_out->encounter[d.seq].health_plans[x].assign_benefits.name =
        																trim(uar_get_code_display(eplr.assign_benefits_cd),3)
        patient_encounters_reply_out->encounter[d.seq].health_plans[x].eligibility_status.id = epe.eligibility_status_cd
        patient_encounters_reply_out->encounter[d.seq].health_plans[x].eligibility_status.name =
        																trim(uar_get_code_display(epe.eligibility_status_cd),3)
        patient_encounters_reply_out->encounter[d.seq].health_plans[x].deduct_amt = ebr.deduct_amt
        patient_encounters_reply_out->encounter[d.seq].health_plans[x].deduct_remain_amt = ebr.deduct_remain_amt
        patient_encounters_reply_out->encounter[d.seq].health_plans[x].copay_amt = ebr.copay_amt
      	case(ebr.internal_seq)
        	of 0:
          		patient_encounters_reply_out->encounter[d.seq].health_plans[x].deduct_inc_max_oop =
          																ebr.room_coverage_board_incl_cd
        	of 1:
          		patient_encounters_reply_out->encounter[d.seq].health_plans[x].copay_inc_max_oop =
          																ebr.room_coverage_board_incl_cd
      	endcase
 
        patient_encounters_reply_out->encounter[d.seq].health_plans[x].max_out_pckt_amt = ppr.max_out_pckt_amt
        patient_encounters_reply_out->encounter[d.seq].health_plans[x].fam_deduct_met_amt = ppr.fam_deduct_met_amt
 
        ;Subscriber Address
        patient_encounters_reply_out->encounter[d.seq].health_plans[x]->subscriber_address.address_id = ad1.address_id
        patient_encounters_reply_out->encounter[d.seq].health_plans[x]->subscriber_address.address_type_cd = ad1.address_type_cd
        patient_encounters_reply_out->encounter[d.seq].health_plans[x]->subscriber_address.address_type_disp = trim(
        uar_get_code_display(ad1.address_type_cd), 3)
        patient_encounters_reply_out->encounter[d.seq].health_plans[x]->subscriber_address.address_type_mean = trim(
        uar_get_code_meaning(ad1.address_type_cd), 3)
        patient_encounters_reply_out->encounter[d.seq].health_plans[x]->subscriber_address.street_addr = trim(ad1.street_addr, 3)
        patient_encounters_reply_out->encounter[d.seq].health_plans[x]->subscriber_address.street_addr2 = trim(ad1.street_addr2,3)
        patient_encounters_reply_out->encounter[d.seq].health_plans[x]->subscriber_address.street_addr3 = trim(ad1.street_addr3,3)
        patient_encounters_reply_out->encounter[d.seq].health_plans[x]->subscriber_address.city = trim(ad1.city, 3)
        patient_encounters_reply_out->encounter[d.seq].health_plans[x]->subscriber_address.state_cd = ad1.state_cd
        patient_encounters_reply_out->encounter[d.seq].health_plans[x]->subscriber_address.state_disp =
                                                                                   trim(uar_get_code_display(ad1.state_cd), 3)
        patient_encounters_reply_out->encounter[d.seq].health_plans[x]->subscriber_address.state_mean =
                                                                                   trim(uar_get_code_meaning(ad1.state_cd), 3)
        patient_encounters_reply_out->encounter[d.seq].health_plans[x]->subscriber_address.zipcode = trim(ad1.zipcode, 3)
        patient_encounters_reply_out->encounter[d.seq].health_plans[x]->subscriber_address.country_cd = ad.country_cd
        patient_encounters_reply_out->encounter[d.seq].health_plans[x]->subscriber_address.country_disp =
                                                                                   trim(uar_get_code_display(ad1.country_cd), 3)
        patient_encounters_reply_out->encounter[d.seq].health_plans[x]->subscriber_address.county_cd = ad.county_cd
        patient_encounters_reply_out->encounter[d.seq].health_plans[x]->subscriber_address.county_disp =
                                                                                     trim(uar_get_code_display(ad1.county_cd), 3)
        patient_encounters_reply_out->encounter[d.seq].health_plans[x]->subscriber_address.end_effective_dt_tm =
                                                                                     cnvtdatetime(ad1.end_effective_dt_tm)
     head ph1.phone_id
        if(ph1.phone_id > 0.00)
	        iPhoneIndex += 1
	        stat = alterlist(patient_encounters_reply_out->encounter[d.seq].health_plans[x]->subscriber_phones, iPhoneIndex)
	        patient_encounters_reply_out->encounter[d.seq].health_plans[x]->subscriber_phones[iPhoneIndex].phone_id = ph1.phone_id
	        patient_encounters_reply_out->encounter[d.seq].health_plans[x]->subscriber_phones[iPhoneIndex].phone_type_cd =
	                                                                                                           ph1.phone_type_cd
	        patient_encounters_reply_out->encounter[d.seq].health_plans[x]->subscriber_phones[iPhoneIndex].phone_type_disp =
	                                                                                trim(uar_get_code_display(ph1.phone_type_cd), 3)
	        patient_encounters_reply_out->encounter[d.seq].health_plans[x]->subscriber_phones[iPhoneIndex].phone_type_mean =
	                                                                                trim(uar_get_code_meaning(ph1.phone_type_cd), 3)
	        patient_encounters_reply_out->encounter[d.seq].health_plans[x]->subscriber_phones[iPhoneIndex].phone_num =
	                                                                                trim(ph1.phone_num, 3)
	        patient_encounters_reply_out->encounter[d.seq].health_plans[x]->subscriber_phones[iPhoneIndex].sequence_nbr =
	                                                                                                            ph1.phone_type_seq
	        patient_encounters_reply_out->encounter[d.seq].health_plans[x]->subscriber_phones[iPhoneIndex].extension =
	                                                                                                          trim(ph1.extension, 3)
	        patient_encounters_reply_out->encounter[d.seq].health_plans[x]->subscriber_phones[iPhoneIndex].end_effective_dt_tm =
	        cnvtdatetime(ph1.end_effective_dt_tm)
	        patient_encounters_reply_out->encounter[d.seq].health_plans[x]->subscriber_phones[iPhoneIndex].phone_format.id =
	                                                                                                         ph1.phone_format_cd
	        patient_encounters_reply_out->encounter[d.seq].health_plans[x]->subscriber_phones[iPhoneIndex].phone_format.name =
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
 
	select into "nl:"
	from (dummyt d with seq = size(patient_encounters_reply_out->encounter,5))
		,tracking_item ti
		,tracking_locator tl
	plan d where patient_encounters_reply_out->encounter[d.seq].patient_class.id = c_emergency_encntr_type_class_cd
		and (patient_encounters_reply_out->encounter[d.seq].bed_id < 1 or
			patient_encounters_reply_out->encounter[d.seq].room_id < 1)
	join ti where ti.encntr_id = patient_encounters_reply_out->encounter[d.seq].encounter_id
	join tl where tl.tracking_id = ti.tracking_id
	order by tl.depart_dt_tm desc
	head report
		patient_encounters_reply_out->encounter[d.seq].bed_id = tl.loc_bed_cd
		patient_encounters_reply_out->encounter[d.seq].bed = uar_get_code_display(tl.loc_bed_cd)
		patient_encounters_reply_out->encounter[d.seq].room_id = tl.loc_room_cd
		patient_encounters_reply_out->encounter[d.seq].room = uar_get_code_display(tl.loc_room_cd)
 
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetEDLocationInfo Runtime: ",
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
		call echo(concat("Getting comments Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
	;Set expand control value
	set encounter_count = size(patient_encounters_reply_out->encounter,5)
	if(encounter_count > 200)
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
  	where expand(num,1,encounter_count,e.encntr_id
  		                ,patient_encounters_reply_out->encounter[num].encounter_id)
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
  		pos = locateval(num,1,encounter_count,e.encntr_id
  		                ,patient_encounters_reply_out->encounter[num].encounter_id)
  		detail
  		count = count + 1
  		stat = alterlist(patient_encounters_reply_out->encounter[pos]->Comments,count)
  		patient_encounters_reply_out->encounter[pos].Comments[count].UPDT_ID = e.updt_id
  		patient_encounters_reply_out->encounter[pos].Comments[count].UPDT_DT_TM = e.updt_dt_tm
        patient_encounters_reply_out->encounter[pos].Comments[count].CMT_TEXT = trim(lt.long_text,3)
        patient_encounters_reply_out->encounter[pos].Comments[count].Internal_Seq = e.internal_seq
 
	with nocounter, expand = value(exp)
 
	if(iDebugFlag > 0)
		call echo(concat("GetComments Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;sub
 
/*************************************************************************
;  Name: GetPatientValuables(null)
;  Description: Subroutine to get Patient Valuables data
**************************************************************************/
subroutine GetPatientValuables(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Getting Patient valuables Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
	;Set expand control value
	set encounter_count = size(patient_encounters_reply_out->encounter,5)
	if(encounter_count > 200)
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
  	from encntr_code_value_r e
 	plan e
  	where expand(num,1,encounter_count,e.encntr_id
  		         ,patient_encounters_reply_out->encounter[num].encounter_id)
  	and e.code_set = 14751.00
    and e.active_ind = 1
    and e.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
  	order by e.encntr_id
  	head report
  		count = 0
  		pos = 0
  	  head e.encntr_id
  	    pos = 0
  	    count = 0
  		pos = locateval(num,1,encounter_count,e.encntr_id
  		                ,patient_encounters_reply_out->encounter[num].encounter_id)
  		detail
  		count = count + 1
	 	if (mod(count, 5) = 1)
  			stat = alterlist(patient_encounters_reply_out->encounter[pos]->patient_valuables,count+4)
	    endif
  		patient_encounters_reply_out->encounter[pos].patient_valuables[count].id  = e.code_value
  		patient_encounters_reply_out->encounter[pos].patient_valuables[count].name = trim(uar_get_code_display(e.code_value ),3)
 	 foot e.encntr_id
  		stat = alterlist(patient_encounters_reply_out->encounter[pos]->patient_valuables,count)
 
	with nocounter, expand = value(exp)
 
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
	set count = 0
	set num = 0
	set pop = 0
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	set encounter_count = size(patient_encounters_reply_out->encounter,5)
	if(encounter_count > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	select into "nl:"
  	e.encntr_id
  	,e.info_sub_type_cd
  	,e.value_cd
  	from encntr_info e,long_text lt
 	plan e
  	where expand(num,1,encounter_count,e.encntr_id
  		         ,patient_encounters_reply_out->encounter[num].encounter_id)
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
  		count = count + 1
  		pos = locateval(num,1,encounter_count,e.encntr_id
  		                ,patient_encounters_reply_out->encounter[num].encounter_id)
  		stat = alterlist(patient_encounters_reply_out->encounter[pos]->CustomFields,count)
  		patient_encounters_reply_out->encounter[pos]->CustomFields[count].Field.id = e.info_sub_type_cd
  		patient_encounters_reply_out->encounter[pos]->CustomFields[count].Field.name = trim(uar_get_code_display(e.info_sub_type_cd),3)
  		detail
	  	   if(size(trim(lt.long_text)) > 0)
	  		val_cnt = val_cnt+1
	  		stat = alterlist(patient_encounters_reply_out->encounter[pos]->CustomFields[count].ResponseValueText,val_cnt)
 
	  		patient_encounters_reply_out->encounter[pos]->CustomFields[count].ResponseValueText[val_cnt] = trim(lt.long_text,3)
		   endif
		   if (e.value_cd > 0)
    		x= x+1
    		stat = alterlist(patient_encounters_reply_out->encounter[pos]->CustomFields[count].ResponseValueCodes,x)
  			patient_encounters_reply_out->encounter[pos]->CustomFields[count].ResponseValueCodes[x].id = e.value_cd
  			patient_encounters_reply_out->encounter[pos]->CustomFields[count].ResponseValueCodes[x].name = UAR_GET_CODE_DISPLAY(e.value_cd)
		   endif
	with nocounter, expand = value(exp)
 
	if(iDebugFlag > 0)
		call echo(concat("GetCustomFields Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;sub
 
 
end go
 
 
 
