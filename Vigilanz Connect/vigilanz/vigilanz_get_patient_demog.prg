/*~BB~************************************************************************
 
  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

 ~BE~***********************************************************************/
/*****************************************************************************
          Date Written:       11/25/14
          Source file name:   vigilanz_get_patient_demog
          Object name:        vigilanz_get_patient_demog
          Request #:
          Program purpose:    Returns Person information
                              for a given patient
          Tables read:        Person, Address, Phone, Person_alias
          Tables updated:     NONE
          Executing from:     EMISSARY SERVICES
          Special Notes:	  NONE
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
  000 11/25/14  AAB		Initial write
  001 12/05/14  JCO		Fixed extra string spaces.  Added
						Language, Religion, and MRN fields
  002 12/24/14  AAB     Added person_id to reply
  003 12/27/14  AAB     Added name_first, name_last, name_middle, name_prefix
						name_suffix to reply
  004 01/20/15  AAB		Added PCT object
  005 01/22/15  AAB		Added ethnic_cd and ethnic_disp
  006 01/26/15  JCO		Added INC_EXTENDED & INC_CARETEAM flags
  007 01/28/15  AAB     Added vip and confid.  Removed check for phone seq and changed
						field name.
  008 03/09/15  AAB     Add an Address type to Address Object
  009 03/12/15  AAB 	Add Identity flag to input
  010 03/20/15	AAB 	Changed Person_alias to Patient_alias to match Patient_List service
  011 03/26/15  JCO		Added INC_PERSON_RELTN & Related Persons object
  012 04/07/15  JCO		Added PHONE objects to CARETEAM and RELATED PERSONS
  013 04/08/15	JCO		Return MRN at top level regardless of INC_IDENTITY flag
  014 05/26/15  AAB  	Added Emergency contact to Related Persons
  015 07/17/15  JCO		Added email address and marital status to reply
  016 09/14/15  AAB		Add audit object
  017 11/03/15  AAB     Add head back into Phone query
  018 01/08/15  AAB     Use Best Encntr logic to get MRN
  019 02/13/16  AAB 	Add inpatient_admit_dt_tm to reply
  020 04/29/16  AAB 	Added version
  021 08/16/16  AAB		Return Health plan info
  022 10/10/16  AAB 	Add DEBUG_FLAG
  023 07/27/17  JCO		Changed %i to execute; update ErrorHandler2
  024 09/01/17 	DJP		Added payor and subscriber fields to HP Object
  025 11/14/17	DJP		Add Default Patient Preferred Pharmacy Object
  026 12/22/17	RJC		Add Subscriber Address Object
  027 01/04/18  DJP		Add Country to Patient Address Object
  028 01/29/18  DJP		Add Subscriber phone and fax numbers
  029 03/21/18	RJC		Added version code and copyright block
  030 04/17/18 	DJP		Added String DOB
  031 01/14/19 	RJC 	Add is_manually_added boolean to patient care team object
  032 01/31/19  STV     Conversion to only grab raw mrn
  033 03/29/19  STV     Update to include MRN block
  034 04/05/19	RJC		Added marital status cd
  035 03/06/20  KRD     Added internal_seq to patient_care_team object
  036 03/15/20  KRD     Added Comments object to the structure
  037 03/17/20  KRD     Added StudentStatus fields
  038 03/20/20  STV     Added WrittenFormat
 ***********************************************************************/
drop program vigilanz_get_patient_demog go
create program vigilanz_get_patient_demog
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Person ID" = 0.0
	, "Include Extended" = 0
	, "Include Care Team" = 0
	, "Include Identity" = 0
	, "Include Related Persons" = 0
	, "User Name:" = ""
	, "Include Healthplan Info" = 0
	, "Include Comments:" = 0
	, "Debug Flag" = 0
 
with OUTDEV, PERSON_ID, INC_EXTENDED, INC_CARETEAM, INC_IDENTITY,
	INC_PERSON_RELTN, USERNAME, INC_HEALTHPLAN_INFO, INC_COMMENTS, DEBUG_FLAG   ;022
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL changed to Emissary version ;029
**************************************************************************/
set sVersion = "1.21.6.2"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record patient_reply_out
record patient_reply_out
(
  1  person_id 						= f8
  1  name_full_formatted            = vc
  1  mrn			    			= vc	;001
  1  mrn_identities[*]
  	2 value = vc
  	2 type
  		3 id = f8
  		3 name = vc
  		3 description = vc
  	2 subtype
  		3 id = f8
  		3 name = vc
  		3 description = vc
  1  birth_dt_tm                    = dq8
  1  sDOB							= c10 ;030
  1  deceased_dt_tm                 = dq8
  1  race_cd                        = f8
  1  race_disp                      = vc
  1  race_mean                      = vc
  1  sex_cd                         = f8
  1  sex_disp                       = vc
  1  sex_mean                       = vc
  1  language_cd					= f8	;001
  1  language_disp					= vc	;001
  1  religion_cd					= f8	;001
  1  religion_disp					= vc	;001
  1  ethnic_cd						= f8	;005
  1  ethnic_disp					= vc	;005
  1  name_last						= vc
  1  name_first						= vc
  1  vip_cd                         = f8
  1  vip_disp                       = vc
  1  confid_cd                      = f8
  1  confid_disp                    = vc
  1  email							= vc	;015
  1  marital_status					= vc	;015
  1  marital_status_cd				= f8
  1  StudentStatus
	 2 id 							= f8
	 2 name 						= vc
  1 WrittenFormat
  	2 id = f8
  	2 name = vc
  1  patient_alias[*]						;010
     2  person_alias_id             = f8
     2  alias_pool_cd               = f8
     2  person_alias_type_cd        = f8
     2  person_alias_type_disp      = vc
     2  person_alias_type_mean      = vc
     2  alias                       = vc
  1  person_name[*]
     2  person_name_id              = f8
     2  name_type_cd                = f8
     2  name_type_disp              = vc
     2  name_type_mean              = vc
     2  name_full                   = vc
     2  name_first                  = vc
     2  name_last                   = vc
	 2  name_middle					= vc
	 2  name_suffix					= vc
	 2  name_prefix					= vc
  1  address[*]
     2  address_id                  = f8
     2  address_type_cd             = f8
     2  address_type_disp           = vc
     2  address_type_mean           = vc
     2  street_addr                 = vc
     2  street_addr2                = vc
     2  city                        = vc
     2  state_cd                    = f8
     2  state_disp                  = vc
     2  state_mean                  = vc
     2  zipcode                     = vc
     2  country_cd					= f8 ;027
     2  country_disp				= vc ;027
  1  phones[*]
     2  phone_id                    = f8
     2  phone_type_cd               = f8
     2  phone_type_disp             = vc
     2  phone_type_mean             = vc
     2  phone_num                   = vc
     2	sequence_nbr				= i2
  1	 Comments [*]
		 2 CMT_TEXT = vc
         2 UPDT_ID  = f8
         2 UPDT_DT_TM = dq8
         2 Internal_Seq = i4
  1  patient_care_team[*]
   	 2 internal_seq                 = i4
	 2 provider_id					= f8
	 2 provider_name				= vc
	 2 reltn_type					= vc
	 2 from_date                 	= dq8
	 2 to_date                		= dq8
	 2 phones[*]	/*012*/
	   3 phone_id					= f8
	   3 phone_type_cd				= f8
	   3 phone_type_disp			= vc
	   3 phone_type_mean			= vc
	   3 phone_num					= vc
	   3 sequence_nbr				= i2
	 2 is_manually_added			= i2
  1  related_persons[*]/*011*/
     2 person_id					= f8
     2 person_name					= vc
     2 reltn_type					= vc
	 2 person_reltn_type			= vc 	;014
     2 from_date					= dq8
     2 to_date						= dq8
     2 phones[*]	/*012*/
	   3 phone_id					= f8
	   3 phone_type_cd				= f8
	   3 phone_type_disp			= vc
	   3 phone_type_mean			= vc
	   3 phone_num					= vc
	   3 sequence_nbr				= i2
  1 health_plans[*]   				;021
	2 plan_name						= vc
	2 plan_desc						= vc
	2 group_nbr						= vc
	2 group_name					= vc
	2 policy_nbr					= vc
	2 plan_class_cd 				= f8
	2 plan_class_disp				= vc
	2 plan_type_cd    				= f8
	2 plan_type_disp    			= vc
	2 member_nbr					= vc
	2 payor_name					= vc ;024+
	2 payor_phone					= vc
	2 payor_state					= vc
	2 subscriber_person_id			= f8 ;026
	2 subscriber_last_name			= vc
	2 subscriber_first_name			= vc
	2 subscriber_date_of_birth		= dq8
	2 subscriber_reltn_to_patient_cd = f8
	2 subscriber_reltn_to_patient_desc = vc
	2 patient_reltn_to_subscriber_cd = f8
	2 patient_reltn_to_subscriber_desc = vc
	2 subscriber_sDOB					= c10 ;030
	2 subscriber_address					;026
    	3  address_id                  = f8
     	3  address_type_cd             = f8
	    3  address_type_disp           = vc
	    3  address_type_mean           = vc
	    3  street_addr                 = vc
	    3  street_addr2                = vc
	    3  city                        = vc
	    3  state_cd                    = f8
	    3  state_disp                  = vc
	    3  state_mean                  = vc
	    3  zipcode                     = vc
	    3  country_cd					= f8
	    3  country_disp					= vc
    2 subscriber_phones[*]					;028
    	3  phone_id                    = f8
     	3  phone_type_cd               = f8
     	3  phone_type_disp             = vc
     	3  phone_type_mean             = vc
     	3  phone_num                   = vc
     	3  sequence_nbr				   = i2
	2 priority_sequence 			= i2
	2 begin_effective_dt_tm			=dq8
	2 end_effective_dt_tm			=dq8;024-
  1 preferred_pharmacy[*]					;025+
  	2 pharmacy_id					= vc
  	2 pharmacy_name					= vc
  	2 NCPDP							= vc
  	2 is_integrated_retail			= i2 ;025-
  1 audit			;016
	2 user_id							= f8
	2 user_firstname					= vc
	2 user_lastname						= vc
	2 patient_id						= f8
	2 patient_firstname					= vc
	2 patient_lastname					= vc
	2 service_version					= vc		;020
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
 
free record ui_req		;018
record ui_req
(
  1 persons[*]
	2 person_id			= f8
	2 encntr_id			= f8
)
 
free record temp_patient_reply_out
record temp_patient_reply_out
(
 1 qual[*]
   2 person_id                 = f8
   2 encntr_id                 = f8
   2 encntr_type_cd			   = f8
   2 encntr_type_disp		   = vc
   2 inpatient_admit_dt_tm	   = dq8 ;019
   2 name_full_formatted       = vc
   2 name_full                 = vc
   2 name_first                = vc
   2 name_last                 = vc
   2 name_middle			   = vc
   2 name_suffix			   = vc
   2 name_prefix			   = vc
   2 gender_cd                 = f8
   2 gender_disp               = vc
   2 language_cd			   = f8	;009
   2 language_disp			   = vc	;009
   2 religion_cd			   = f8	;009
   2 religion_disp			   = vc	;009
   2 ethnic_cd				   = f8	;009
   2 ethnic_disp			   = vc	;009
   2 race_cd                   = f8 ;009
   2 race_disp                 = vc ;009
   2 birthdate                 = dq8
   2 age                       = vc
   2 vip_cd                    = f8
   2 vip_disp                  = vc
   2 confid_cd                 = f8
   2 confid_disp			   = vc
   2 mrn                       = vc
   2 reg_dt_tm                 = dq8
   2 bed_location_cd           = f8
   2 bed_location_disp		   = vc
   2 bed_collation_seq         = i4
   2 room_location_cd          = f8
   2 room_location_disp		   = vc
   2 room_collation_seq        = i4
   2 unit_location_cd          = f8
   2 unit_location_disp		   = vc
   2 unit_collation_seq        = i4
   2 building_location_cd      = f8
   2 building_location_disp    = vc
   2 building_collation_seq    = i4
   2 facility_location_cd      = f8
   2 facility_location_disp	   = vc
   2 facility_collation_seq    = i4
   2 temp_location_cd          = f8
   2 temp_location_disp		   = vc
   2 service_cd                = f8
   2 service_disp              = vc
   2 leave_ind                 = i2
   2 visit_reason              = vc
   2 fin_nbr                   = vc
   2 los                       = vc
   2 encntr_type               = f8
   2 encntr_type_disp          = vc
   2 sticky_notes_ind		   = i2
   2 discharge_date            = dq8
   2 end_effective_dt_tm	   = dq8
   2 visitor_status_cd         = f8
   2 visitor_status_disp       = vc
   2 time_zone_indx			   = i4
   2 birth_tz				   = i4
   2 est_discharge_date        = dq8
   2 encntr_type_new_cd        = f8
   2 encntr_type_new_disp      = vc
   2 deceased_date			   = dq8
   2 deceased_tz			   = i4
   2 email					   = vc ;019
   2 marital_status			   = vc	;019
   2 address[*]
     3  address_id                  = f8
     3  address_type_cd             = f8
     3  address_type_disp           = vc
     3  address_type_mean           = vc
     3  street_addr                 = vc
     3  street_addr2                = vc
     3  city                        = vc
     3  state_cd                    = f8
     3  state_disp                  = vc
     3  state_mean                  = vc
     3  zipcode                     = vc
   2 phone[*]
     3  phone_id               		= f8
     3  phone_type_cd          		= f8
     3  phone_type_disp        		= vc
     3  phone_type_mean        		= vc
     3  phone_num              		= vc
     3  sequence_nbr		   		= i2		;010
   2 patient_care_team[*]
	 3 provider_id					= f8
	 3 provider_name				= vc
	 3 reltn_type					= vc
	 3 from_date                 	= dq8
	 3 to_date                		= dq8
	 3 phones[*]	/*019*/
	   4 phone_id					= f8
	   4 phone_type_cd				= f8
	   4 phone_type_disp			= vc
	   4 phone_type_mean			= vc
	   4 phone_num					= vc
	   4 sequence_nbr				= i2
	 3 is_manually_added			= i2
   2 patient_alias[*]
     3  person_alias_id             = f8
     3  alias_pool_cd               = f8
     3  person_alias_type_cd        = f8
     3  person_alias_type_disp      = vc
     3  person_alias_type_mean      = vc
     3  alias                       = vc
   2 related_persons[*] 			;018
	 3 person_id					= f8
	 3 person_name				 	= vc
	 3 reltn_type				 	= vc
	 3 from_date					= dq8
	 3 to_date					 	= dq8
	 3 phones[*]
	   4 phone_id				 	= f8
	   4 phone_type_cd			 	= f8
	   4 phone_type_disp		 	= vc
	   4 phone_type_mean		 	= vc
	   4 phone_num				 	= vc
	   4 sequence_nbr			 	= i2
 1 audit			;021
   2 user_id						= f8
   2 user_firstname					= vc
   2 user_lastname					= vc
   2 patient_id						= f8
   2 patient_firstname				= vc
   2 patient_lastname				= vc
   2 service_version				= vc		;020
 
%i cclsource:status_block.inc
)
 
 
;025 Pharmacy Record Structures
 
record rx_request (
  1 active_status_flag = i2
  1 transmit_capability_flag = i2
  1 ids [*]
    2 id = vc
)
record rx_reply (
  1 pharmacies [*]
    2 id = vc
    2 version_dt_tm = dq8
    2 pharmacy_name = vc
    2 pharmacy_number = vc
    2 active_begin_dt_tm = dq8
    2 active_end_dt_tm = dq8
    2 pharmacy_contributions [*]
      3 contributor_system_cd = f8
      3 version_dt_tm = dq8
      3 contribution_id = vc
      3 pharmacy_name = vc
      3 pharmacy_number = vc
      3 active_begin_dt_tm = dq8
      3 active_end_dt_tm = dq8
      3 addresses [*]
        4 type_cd = f8
        4 type_seq = i2
        4 street_address_lines [*]
          5 street_address_line = vc
        4 city = vc
        4 state = vc
        4 postal_code = vc
        4 country = vc
        4 cross_street = vc
      3 telecom_addresses [*]
        4 type_cd = f8
        4 type_seq = i2
        4 contact_method_cd = f8
        4 value = vc
        4 extension = vc
      3 service_level = vc
      3 partner_account = vc
      3 service_levels
        4 new_rx_ind = i2
        4 ref_req_ind = i2
        4 epcs_ind = i2
      3 specialties
        4 mail_order_ind = i2
        4 retail_ind = i2
        4 specialty_ind = i2
        4 twenty_four_hour_ind = i2
        4 long_term_ind = i2
    2 primary_business_address
      3 type_cd = f8
      3 type_seq = i2
      3 street_address_lines [*]
        4 street_address_line = vc
      3 city = vc
      3 state = vc
      3 postal_code = vc
      3 country = vc
      3 cross_street = vc
    2 primary_business_telephone
      3 type_cd = f8
      3 type_seq = i2
      3 contact_method_cd = f8
      3 value = vc
      3 extension = vc
    2 primary_business_fax
      3 type_cd = f8
      3 type_seq = i2
      3 contact_method_cd = f8
      3 value = vc
      3 extension = vc
    2 primary_business_email
      3 type_cd = f8
      3 type_seq = i2
      3 contact_method_cd = f8
      3 value = vc
      3 extension = vc
  1 status_data
    2 status = c1
    2 SubEventStatus [*]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
)
 
 
set patient_reply_out->status_data->status = "F"
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
declare dPersonID  			= f8 with protect, noconstant(0.0)
declare iIncExtended	 	= i4 with protect, noconstant(0)	/*006*/
declare iIncCareteam	 	= i4 with protect, noconstant(0)	/*006*/
declare Section_Start_Dt_Tm = DQ8 WITH PROTECT, NOCONSTANT(CNVTDATETIME(CURDATE, CURTIME3))
declare iIncIdentity	 	= i4 with protect, noconstant(0)
declare iIncPersonReltns	= i4 with protect, noconstant(0) 	/*011*/
declare iIncHealthPlans		= i4 with protect, noconstant(0)  ;021
declare dEmergency			= f8 with protect, constant(uar_get_code_by("MEANING", 351, "EMC"))
declare dEmail				= f8 with protect, constant(uar_get_code_by("MEANING", 212, "EMAIL")) /*015*/
declare sUserName			= vc with protect, noconstant("")   ;016
declare iRet				= i2 with protect, noconstant(0) ;016
declare APPLICATION_NUMBER 	= i4 with protect, constant (600005)	;018
declare TASK_NUMBER 		= i4 with protect, constant (600600)	;018
declare REQUEST_NUMBER 		= i4 with protect, constant (600733)	;018
declare iIncComments	 	= i2 with protect, noconstant(0)
declare idebugFlag			= i2 with protect, noconstant(0) ;022
 
declare dPersonReltnType = f8 with protect, constant(uar_get_code_by("MEANING",351, "INSURED")) ;024
declare dActiveStatusCd	= f8 with protect, constant(uar_get_code_by("MEANING",  48, "ACTIVE")) ;024
declare dPharmID		= f8 with protect, constant(uar_get_code_by("MEANING", 355 , "DEFPATPHARM")) ;025
declare c_encntr_mrn_alias_cd       = f8 with protect, constant(uar_get_code_by("MEANING",319,"MRN"))
declare c_mrn_type_cd  = f8 with protect, constant(uar_get_code_by("MEANING",4,"MRN"))
declare c_cmrn_type_cd  = f8 with protect, constant(uar_get_code_by("MEANING",4,"CMRN"))
declare c_refmrn_type_cd  = f8 with protect, constant(uar_get_code_by("MEANING",4,"REF_MRN"))
declare c_comments_info_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",355,"COMMENT"))
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
set dPersonID = cnvtreal($PERSON_ID)
set iIncExtended = cnvtint($INC_EXTENDED)	/*006*/
set iIncCareteam = cnvtint($INC_CARETEAM)	/*006*/
set iIncIdentity = cnvtint($INC_IDENTITY)
set iIncPersonReltns = cnvtint($INC_PERSON_RELTN) /*011*/
set sUserName		= trim($USERNAME, 3)   ;016
set iIncHealthPlans	= cnvtint($INC_HEALTHPLAN_INFO)  ;021
set iIncComments = cnvtint($INC_COMMENTS)
set idebugFlag		= cnvtint($DEBUG_FLAG)  ;022
/****************************************************************************
;INCLUDES
****************************************************************************/
;023 %i ccluserdir:snsro_common.inc
execute snsro_common	;023
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetPersonDemographics(null)	= null with protect
declare PerformBestEncntr (null) 	= null with protect		;018
declare GetBestEnctrMRN(null) 		= null with protect		;018
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
 
if(dPersonID > 0.0)
 
	set iRet = PopulateAudit(sUserName, dPersonID, patient_reply_out, sVersion)   ;020   ;016
	if(iRet = 0)
		call ErrorHandler2("VALIDATE", "F", "PATIENT DEMOGRAPHICS", "Invalid User for Audit.",
		"1001", build("UserId is invalid: ", sUserName), patient_reply_out)	;023
		go to EXIT_SCRIPT
	endif
 
	call GetPersonDemographics(null)
	call PerformBestEncntr(null)		;018
	call GetBestEnctrMRN(null) 			;018
 
	call ErrorHandler("EXECUTE", "S", "PATIENT DEMOGRAPHICS",
	"Person Demographics retrieved successfully.", patient_reply_out)
 
else
	call ErrorHandler2("VALIDATE", "F", "PATIENT DEMOGRAPHICS", "Missing required field: Person ID.",
	"2055", "Missing required field: PatientId", patient_reply_out)	;023
	go to EXIT_SCRIPT
endif
 
 
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
 
set JSONout = CNVTRECTOJSON(patient_reply_out)
 
 
if(idebugFlag > 0)
 
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_patient_demog.json")
	call echo(build2("_file : ", _file))
	call echojson(patient_reply_out, _file, 0)
 
	call echo(JSONout)
	call echorecord(patient_reply_out)
 
endif
 
     if(validate(_MEMORY_REPLY_STRING))
		set _MEMORY_REPLY_STRING = trim(JSONout,3)
	endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: GetPersonDemographics
;  Description: Retrieve Person information by person_id
**************************************************************************/
subroutine GetPersonDemographics(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetPersonDemographics Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
/* RETRIEVE PERSON */
select into "nl:" p.name_full_formatted,
                  p.birth_dt_tm,
                  p.race_cd,
                  p.sex_cd,
                  p.name_last,
                  p.name_first
  from person p
 plan p
 where p.person_id = dPersonID
   and p.active_ind = 1
   and p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
   and p.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
detail
  patient_reply_out->person_id = dPersonID
  patient_reply_out->name_full_formatted = trim(p.name_full_formatted,3)
  patient_reply_out->birth_dt_tm = p.birth_dt_tm
  patient_reply_out->deceased_dt_tm = p.deceased_dt_tm
  patient_reply_out->race_cd = p.race_cd
  patient_reply_out->race_disp  = UAR_GET_CODE_DISPLAY(p.race_cd)
  patient_reply_out->sex_cd = p.sex_cd
  patient_reply_out->sex_disp = UAR_GET_CODE_DISPLAY(p.sex_cd)
  patient_reply_out->name_last = trim(p.name_last,3)
  patient_reply_out->name_first = trim(p.name_first,3)
  patient_reply_out->sDOB = datetimezoneformat(p.birth_dt_tm,p.birth_tz,"YYYY-MM-DD",curtimezonedef);030
 
/*001 Begin */
  patient_reply_out->language_cd = p.language_cd
  patient_reply_out->language_disp = UAR_GET_CODE_DISPLAY(p.language_cd)
  patient_reply_out->religion_cd = p.religion_cd
  patient_reply_out->religion_disp = UAR_GET_CODE_DISPLAY(p.religion_cd)
/*001 End */
 
  patient_reply_out->ethnic_cd = p.ethnic_grp_cd
  patient_reply_out->ethnic_disp = UAR_GET_CODE_DISPLAY(p.ethnic_grp_cd)
 
  patient_reply_out->vip_cd = p.vip_cd
  patient_reply_out->vip_disp = UAR_GET_CODE_DISPLAY(p.vip_cd)
 
  patient_reply_out->confid_cd = p.confid_level_cd
  patient_reply_out->confid_disp = UAR_GET_CODE_DISPLAY(p.confid_level_cd  )
 
  patient_reply_out->marital_status_cd = p.marital_type_cd
  patient_reply_out->marital_status = UAR_GET_CODE_DISPLAY(p.marital_type_cd) /*015*/
 
with nocounter
 
;getting MRN's
select into "nl:"
from person_alias pa
plan pa
	where pa.person_id = dPersonID
		and pa.person_alias_type_cd in(c_mrn_type_cd,c_cmrn_type_cd,c_refmrn_type_cd)
		and pa.active_ind = 1
		and pa.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and pa.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
order by pa.person_alias_type_cd, pa.alias_pool_cd
head report
	x = 0
	detail
		x = x + 1
		stat = alterlist(patient_reply_out->mrn_identities,x)
		patient_reply_out->mrn_identities[x].value = trim(pa.alias)
		patient_reply_out->mrn_identities[x].type.description = trim(uar_get_code_description(pa.person_alias_type_cd))
		patient_reply_out->mrn_identities[x].type.id = pa.person_alias_type_cd
		patient_reply_out->mrn_identities[x].type.name = trim(uar_get_code_display(pa.person_alias_type_cd))
		patient_reply_out->mrn_identities[x].subtype.description = trim(uar_get_code_description(pa.alias_pool_cd))
		patient_reply_out->mrn_identities[x].subtype.id = pa.alias_pool_cd
		patient_reply_out->mrn_identities[x].subtype.name = trim(uar_get_code_display(pa.alias_pool_cd))
 
		;set a random default mrn
		if(pa.person_alias_type_cd = c_mrn_type_cd)
			patient_reply_out->mrn = trim(pa.alias,3)
		endif
with nocounter
 
if (curqual <= 0)
  call ErrorHandler2("SELECT", "Z", "PATIENT DEMOGRAPHICS", "Patient record not found.",
  "2002", "Patient record not found", patient_reply_out)	;023
  go to EXIT_SCRIPT
endif
 
/* RETRIEVE PERSON ALIASES */
 
if (iIncIdentity > 0)
set count = 0
select into "nl:" p.person_alias_id,
                  p.alias_pool_cd,
                  p.person_alias_type_cd,
                  p.alias
  from person_alias p
  where p.person_id = dPersonID
   and p.active_ind = 1
   and p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
   and p.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
detail
  count = count + 1
  stat = alterlist(patient_reply_out->patient_alias, count)
 
  patient_reply_out->patient_alias[count]->person_alias_id = p.person_alias_id
  patient_reply_out->patient_alias[count]->alias_pool_cd = p.alias_pool_cd
  patient_reply_out->patient_alias[count]->person_alias_type_cd = p.person_alias_type_cd
  patient_reply_out->patient_alias[count]->person_alias_type_disp = UAR_GET_CODE_DISPLAY(p.person_alias_type_cd)
 
;013  if (patient_reply_out->patient_alias[count]->person_alias_type_disp = "MRN")
;013  	patient_reply_out->mrn = trim(p.alias,3)
;013  endif
 
  patient_reply_out->patient_alias[count]->alias = trim(p.alias,3)
 
with nocounter
 
endif
 
/* RETRIEVE PERSON NAMES */
set count = 0
select into "nl:" p.person_name_id,
                  p.name_type_cd,
                  p.name_full,
                  p.name_first,
                  p.name_last,
				  p.name_middle,
				  p.name_prefix,
				  p.name_suffix
 
  from person_name p
  where p.person_id = dPersonID
   and p.active_ind = 1
   and p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
   and p.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
 detail
  count = count + 1
  stat = alterlist(patient_reply_out->person_name, count)
 
  patient_reply_out->person_name[count]->person_name_id = p.person_name_id
  patient_reply_out->person_name[count]->name_type_cd = p.name_type_cd
  patient_reply_out->person_name[count]->name_type_disp = UAR_GET_CODE_DISPLAY(p.name_type_cd)
  patient_reply_out->person_name[count]->name_full = trim(p.name_full,3)
  patient_reply_out->person_name[count]->name_first = trim(p.name_first,3)
  patient_reply_out->person_name[count]->name_last = trim(p.name_last,3)
  patient_reply_out->person_name[count]->name_middle = trim(p.name_middle,3)
  patient_reply_out->person_name[count]->name_suffix = trim(p.name_suffix,3)
  patient_reply_out->person_name[count]->name_prefix = trim(p.name_prefix,3)
 
with nocounter
 
/* RETRIEVE ADDRESS */
if(iIncExtended > 0)	/*006*/
	set count = 0
	select into "nl:" a.address_id,
	                  a.address_type_cd,
	                  a.street_addr,
	                  a.street_addr2,
	                  a.city,
	                  a.state_cd,
	                  a.zipcode,
	                  a.country_cd ;027
 
	  from address a
	 where a.parent_entity_id = dPersonID
	   and a.parent_entity_name = "PERSON"
	   and a.active_ind = 1
	   and a.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
	   and a.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
	detail
	  count = count + 1
	  stat = alterlist(patient_reply_out->address, count)
 
	  patient_reply_out->address[count]->address_id = a.address_id
	  patient_reply_out->address[count]->address_type_cd = a.address_type_cd
	  patient_reply_out->address[count]->address_type_disp = UAR_GET_CODE_DISPLAY(a.address_type_cd)
	  patient_reply_out->address[count]->street_addr = trim(a.street_addr,3)
	  patient_reply_out->address[count]->street_addr2 = trim(a.street_addr2,3)
	  patient_reply_out->address[count]->city = a.city
	  if(a.state_cd > 0)
	  	patient_reply_out->address[count]->state_cd = a.state_cd
	  	patient_reply_out->address[count]->state_disp = UAR_GET_CODE_DISPLAY(a.state_cd)
	  else
	  	patient_reply_out->address[count]->state_disp = a.state
	  endif
	  patient_reply_out->address[count]->zipcode = a.zipcode
 
	  if(a.country_cd > 0)
	  	patient_reply_out->address[count]->country_cd = a.country_cd ;027
	  	patient_reply_out->address[count]->country_disp = UAR_GET_CODE_DISPLAY(a.country_cd);027
	  else
	  	patient_reply_out->address[count]->country_disp = a.country
	  endif
 
	  /*015 begin*/
	  if(a.address_type_cd = dEmail and a.parent_entity_name = "PERSON" and a.active_ind = 1)
	  	 patient_reply_out->email = a.street_addr
	  endif
 	  /*015 end*/
 
	with nocounter
 
endif
 
/* RETRIEVE PHONE */
if(iIncExtended > 0)	/*006*/
 
	set count = 0
	select into "nl:" p.phone_id,
	                  p.phone_type_cd,
	                  p.phone_num
 
	  from phone p
	 where p.parent_entity_id = dPersonID
	   and p.parent_entity_name = "PERSON"
	   and p.active_ind = 1
	   and p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
	   and p.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
	detail
	  count = count + 1
	  stat = alterlist(patient_reply_out->phones, count)
 
	  patient_reply_out->phones[count]->phone_id = p.phone_id
	  patient_reply_out->phones[count]->phone_type_cd = p.phone_type_cd
	  patient_reply_out->phones[count]->phone_type_disp = UAR_GET_CODE_DISPLAY(p.phone_type_cd)
	  patient_reply_out->phones[count]->phone_num = p.phone_num
   	  patient_reply_out->phones[count]->sequence_nbr = p.phone_type_seq
 
	with nocounter
 
endif
 
 
 /* RETRIEVE DEFAULT PATIENT PREFERRED PHARMACY  ;025*/
 
if(iIncExtended > 0)
 set count = 0
declare pharmacy_id = vc with protect
 
select into "nl:"
lt.long_text ;, pharmacy_id = substring(1, 38, lt.long_text)
from person_info pi
,long_text lt
plan pi
where pi.person_id = dPersonID
and pi.info_type_cd = dPharmID
join lt
where pi.long_text_id = lt.long_text_id
 
detail
 count= count + 1
 stat = alterlist(rx_request->ids,count)
 rx_request->ids[count].id = substring(1, 38, lt.long_text)
 rx_request->active_status_flag = 1
 rx_request->transmit_capability_flag = 1
 
with nocounter
call echorecord(rx_request)
 
 
	set stat =  tdbexecute(3202004,3202004 ,3202501, "REC",rx_request,"REC",rx_reply)
 
 
call echorecord(rx_reply)
 
set rep_size = size(rx_reply->pharmacies,5)
call echo(build("PHARM REPLY SIZE: ",rep_size))
 
for (count = 1 to rep_size)
 set stat = alterlist(patient_reply_out->preferred_pharmacy,count)
 set patient_reply_out->preferred_pharmacy[count].pharmacy_id = rx_reply->pharmacies[count].id
 set patient_reply_out->preferred_pharmacy[count].pharmacy_name  = rx_reply->pharmacies[count].pharmacy_name
 set patient_reply_out->preferred_pharmacy[count].NCPDP =
 	rx_reply->pharmacies[count].pharmacy_contributions[1].contribution_id
 set patient_reply_out->preferred_pharmacy[count].is_integrated_retail =
 		 rx_reply->pharmacies[count].pharmacy_contributions[1].specialties.retail_ind
 endfor
 
endif
 
 
/*025 end */
 
/* RETRIEVE PRSNL RELTN */
if(iIncCareteam > 0) /*006*/
 
  set pReltnCnt = 0
 
  select into "nl:"
 
    ppr.*, c.code_set
 
  from person_prsnl_reltn  ppr, code_value c, prsnl p, phone ph
 
  plan ppr
 
  where ppr.active_ind = 1  and ppr.person_id = dPersonID
 
  join p
 
  where p.person_id = ppr.prsnl_person_id
 
  join c
 
  where ppr.person_prsnl_r_cd = c.code_value
 
  join ph	/*012*/
  where ph.parent_entity_id = outerjoin(p.person_id)
  		and ph.parent_entity_name = outerjoin("PERSON")
 		and ph.active_ind = outerjoin(1)
	  	and ph.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
	   	and ph.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
 
  head report
 
    pReltnCnt = 0
    pPhCnt = 0	/*012*/
 
  head ppr.person_prsnl_reltn_id
 
  	pPhCnt = 0	/*012*/
 
	if (c.code_set =  331)
 
		pReltnCnt = pReltnCnt + 1
 
	    if (mod(pReltnCnt, 5) = 1)
 
	       stat = alterlist(patient_reply_out->patient_care_team, pReltnCnt + 4)
 
	    endif
 
		patient_reply_out->patient_care_team[pReltnCnt]->reltn_type = uar_get_code_display (ppr.person_prsnl_r_cd)
 		patient_reply_out->patient_care_team[pReltnCnt]->provider_id = p.person_id
 		patient_reply_out->patient_care_team[pReltnCnt]->provider_name = p.name_full_formatted
		patient_reply_out->patient_care_team[pReltnCnt]->from_date = ppr.beg_effective_dt_tm
		patient_reply_out->patient_care_team[pReltnCnt]->to_date = ppr.end_effective_dt_tm
		patient_reply_out->patient_care_team[pReltnCnt]->is_manually_added = ppr.manual_create_ind
		patient_reply_out->patient_care_team[pReltnCnt]->internal_seq = ppr.internal_seq
 	endif
 
 	head ph.phone_id /*012, 017*/
	  	pPhCnt = pPhCnt + 1
 
	    stat = alterlist(patient_reply_out->patient_care_team[pReltnCnt]->phones, pPhCnt)
 
	  	patient_reply_out->patient_care_team[pReltnCnt]->phones[pPhCnt]->phone_id = ph.phone_id
		patient_reply_out->patient_care_team[pReltnCnt]->phones[pPhCnt]->phone_type_cd = ph.phone_type_cd
	 	patient_reply_out->patient_care_team[pReltnCnt]->phones[pPhCnt]->phone_type_disp = UAR_GET_CODE_DISPLAY(ph.phone_type_cd)
	  	patient_reply_out->patient_care_team[pReltnCnt]->phones[pPhCnt]->phone_num = ph.phone_num
   	  	patient_reply_out->patient_care_team[pReltnCnt]->phones[pPhCnt]->sequence_nbr = ph.phone_type_seq
 
 
  with nocounter
 
  set stat = alterlist(patient_reply_out->patient_care_team, pReltnCnt)
 
endif
 
/* RETRIEVE PERSON RELTN -- 011 -- */
if(iIncPersonReltns > 0)
  call echo(" Inside Include Person Relations ")
  set perReltnCnt = 0
 
  select into "nl:"
 
    ppr.*, c.code_set
 
  from person_person_reltn  ppr, code_value c, person p, phone ph
 
  plan ppr
 
  where ppr.person_id = dPersonID
  		and ppr.active_ind = 1
  	  	and ppr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
	   	and ppr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
  join p
 
  where p.person_id = ppr.related_person_id
 
  join c
 
  where ppr.related_person_reltn_cd = c.code_value
 
  join ph	/*012*/
 
  where ph.parent_entity_id = outerjoin(ppr.related_person_id)
  		and ph.parent_entity_name = "PERSON"
 		and ph.active_ind = 1
	  	and ph.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
	   	and ph.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
  head report
 
    perReltnCnt = 0
    perPhCnt = 0	/*012*/
 
  head ppr.person_person_reltn_id
 
 
	perReltnCnt = perReltnCnt + 1
	perPhCnt = 0	/*012*/
 
    if (mod(perReltnCnt, 5) = 1)
 
       stat = alterlist(patient_reply_out->related_persons, perReltnCnt + 4)
 
    endif
 
	patient_reply_out->related_persons[perReltnCnt]->person_reltn_type = uar_get_code_display (ppr.related_person_reltn_cd)   ;014
	patient_reply_out->related_persons[perReltnCnt]->reltn_type = uar_get_code_meaning(ppr.person_reltn_type_cd)			;014
 	patient_reply_out->related_persons[perReltnCnt]->person_id = p.person_id
 	patient_reply_out->related_persons[perReltnCnt]->person_name = p.name_full_formatted
	patient_reply_out->related_persons[perReltnCnt]->from_date = ppr.beg_effective_dt_tm
	patient_reply_out->related_persons[perReltnCnt]->to_date = ppr.end_effective_dt_tm
 
  head ph.phone_id /*012*/
  	perPhCnt = perPhCnt + 1
 
	stat = alterlist(patient_reply_out->related_persons[perReltnCnt]->phones, perPhCnt)
 
  	patient_reply_out->related_persons[perReltnCnt]->phones[perPhCnt]->phone_id = ph.phone_id
	patient_reply_out->related_persons[perReltnCnt]->phones[perPhCnt]->phone_type_cd = ph.phone_type_cd
	patient_reply_out->related_persons[perReltnCnt]->phones[perPhCnt]->phone_type_disp = UAR_GET_CODE_DISPLAY(ph.phone_type_cd)
	patient_reply_out->related_persons[perReltnCnt]->phones[perPhCnt]->phone_num = ph.phone_num
   	patient_reply_out->related_persons[perReltnCnt]->phones[perPhCnt]->sequence_nbr = ph.phone_type_seq
 
 
  with nocounter
 
  set stat = alterlist(patient_reply_out->related_persons, perReltnCnt)
 
endif
 
if(iIncHealthPlans > 0 )
; call echo(" Inside Include HEALTH PLANS ")
declare iHP_cnt				= i4 with protect, noconstant(0)
 
	select into "nl:"
 
	from
				person_plan_reltn PPLR
				,health_plan HP
				,person_person_reltn ppr ;024
				,person p ;024
				,organization o ;024
				,address ad ;024
				,phone ph ;024
 
	plan PPLR
		 where PPLR.person_id = dPersonID
			and PPLR.active_ind = 1
		and PPLR.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and PPLR.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
	join HP
		 where HP.health_plan_id = PPLR.health_plan_id
			and HP.active_ind = 1
			and HP.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and HP.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
;;024+
	join ppr
		where ppr.person_reltn_type_cd = dPersonReltnType ;1158.0
			and ppr.related_person_id = pplr.person_id
  			and ppr.active_ind = 1
  	  		and ppr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
	   		and ppr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	   		and ppr.priority_seq = 1
 
	 join p
 	where ppr.related_person_id = p.person_id
 
join o
 	  where o.organization_id = outerjoin(pplr.organization_id)
 	  and o.active_ind = outerjoin(1)
 	  and o.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
 	  and o.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
 
 	join ad
 		where ad.parent_entity_id = outerjoin(o.organization_id)
 		and ad.parent_entity_name = outerjoin("ORGANIZATION")
 		and ad.active_ind = outerjoin(1)
 		and ad.active_status_cd = outerjoin(dActiveStatusCd); 188.0
 		and ad.address_type_seq <= outerjoin(1)
 		and ad.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
 	 	and ad.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
 
 	join ph
 	 	where ph.parent_entity_id = outerjoin(o.organization_id)
 	 	and ph.parent_entity_name = outerjoin("ORGANIZATION")
 	 	and ph.active_ind = outerjoin(1)
 	 	and ph.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
 	 	and ph.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
;;024 -
	order by pplr.priority_seq, HP.plan_name
 
	detail
 
 
		iHP_cnt =  iHP_cnt + 1
		stat = alterlist(patient_reply_out->health_plans, iHP_cnt)
 
		patient_reply_out->health_plans[iHP_cnt]->plan_name		= HP.plan_name
		patient_reply_out->health_plans[iHP_cnt]->plan_desc		= HP.plan_desc
		patient_reply_out->health_plans[iHP_cnt]->group_nbr		= pplr.group_nbr; HP.group_nbr ;024 source change
		patient_reply_out->health_plans[iHP_cnt]->group_name	= pplr.group_name;HP.group_name;024 source change
		patient_reply_out->health_plans[iHP_cnt]->policy_nbr	= HP.policy_nbr
		patient_reply_out->health_plans[iHP_cnt]->plan_type_cd = HP.plan_type_cd
		patient_reply_out->health_plans[iHP_cnt]->plan_type_disp = uar_get_code_display(HP.plan_type_cd)
		patient_reply_out->health_plans[iHP_cnt]->plan_class_cd	= HP.plan_class_cd
		patient_reply_out->health_plans[iHP_cnt]->plan_class_disp = uar_get_code_display(HP.plan_class_cd)
		patient_reply_out->health_plans[iHP_cnt]->member_nbr = pplr.member_nbr
		patient_reply_out->health_plans[iHP_cnt]->payor_name = o.org_name ;;0024+
		patient_reply_out->health_plans[iHP_cnt]->payor_phone = ph.phone_num
		if (ad.state_cd = 0.0)
			patient_reply_out->health_plans[iHP_cnt]->payor_state = trim(ad.state)
		else
			patient_reply_out->health_plans[iHP_cnt]->payor_state = uar_get_code_display(ad.state_cd)
		endif
		patient_reply_out->health_plans[iHP_cnt]->subscriber_person_id = p.person_id ;026
		patient_reply_out->health_plans[iHP_cnt]->subscriber_last_name = p.name_last
		patient_reply_out->health_plans[iHP_cnt]->subscriber_first_name = p.name_first
		patient_reply_out->health_plans[iHP_cnt]->subscriber_date_of_birth = p.birth_dt_tm
		patient_reply_out->health_plans[iHP_cnt]->subscriber_reltn_to_patient_cd = ppr.person_reltn_cd
		patient_reply_out->health_plans[iHP_cnt]->subscriber_reltn_to_patient_desc =
				uar_get_code_display(ppr.person_reltn_cd)
		patient_reply_out->health_plans[iHP_cnt]->patient_reltn_to_subscriber_cd = ppr.related_person_reltn_cd
 		patient_reply_out->health_plans[iHP_cnt]->patient_reltn_to_subscriber_desc =
 				uar_get_code_display(ppr.related_person_reltn_cd)
 		patient_reply_out->health_plans[iHP_cnt]->priority_sequence = pplr.priority_seq
 		patient_reply_out->health_plans[iHP_cnt]->begin_effective_dt_tm = pplr.beg_effective_dt_tm
 		patient_reply_out->health_plans[iHP_cnt]->end_effective_dt_tm = pplr.end_effective_dt_tm
 		patient_reply_out->health_plans[iHP_cnt]->subscriber_sDOB =
 		datetimezoneformat(p.birth_dt_tm,p.birth_tz,"YYYY-MM-DD",curtimezonedef);030
 		;;0024-
	with nocounter
 
	; 026 - Add subscriber addresses
	for(x = 1 to iHP_cnt)
		select into "nl:"
		from address a
		where a.parent_entity_id = patient_reply_out->health_plans[x].subscriber_person_id
			and a.parent_entity_name = "PERSON"
			and a.active_status_cd = outerjoin(dActiveStatusCd)
 			and a.address_type_seq <= outerjoin(1)
 			and a.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
 	 		and a.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
 	 	detail
 	 		patient_reply_out->health_plans[x].subscriber_address.address_id = a.address_id
 	 		patient_reply_out->health_plans[x].subscriber_address.address_type_cd = a.address_type_cd
 	 		patient_reply_out->health_plans[x].subscriber_address.address_type_disp = uar_get_code_display(a.address_type_cd)
 	 		patient_reply_out->health_plans[x].subscriber_address.address_type_mean = uar_get_code_meaning(a.address_type_cd)
 	 		patient_reply_out->health_plans[x].subscriber_address.city = a.city
 	 		if(a.state_cd > 0)
 	 			patient_reply_out->health_plans[x].subscriber_address.state_cd = a.state_cd
 	 			patient_reply_out->health_plans[x].subscriber_address.state_disp = uar_get_code_display(a.state_cd)
 	 			patient_reply_out->health_plans[x].subscriber_address.state_mean = uar_get_code_meaning(a.state_cd)
 	 		else
 	 			patient_reply_out->health_plans[x].subscriber_address.state_disp = a.state
 	 		endif
 
 	 		patient_reply_out->health_plans[x].subscriber_address.street_addr = a.street_addr
 	 		patient_reply_out->health_plans[x].subscriber_address.street_addr2 = a.street_addr2
 	 		patient_reply_out->health_plans[x].subscriber_address.zipcode = a.zipcode
 
 	 		if(a.country_cd > 0)
 	 			patient_reply_out->health_plans[x].subscriber_address.country_cd = a.country_cd
 	 			patient_reply_out->health_plans[x].subscriber_address.country_disp = uar_get_code_display(a.country_cd)
 	 		else
 	 			patient_reply_out->health_plans[x].subscriber_address.country_disp = a.country
 	 		endif
		with nocounter
	endfor
 
	; 026 - Add subscriber phones including fax
 
	for(x = 1 to iHP_cnt)
		select into "nl:"
 
	from
				person_plan_reltn PPLR
				,health_plan HP
				,person_person_reltn ppr
				,person p
				,phone ph
 
	plan PPLR
		 where PPLR.person_id = dPersonID
			and PPLR.active_ind = 1
		and PPLR.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and PPLR.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
	join HP
		 where HP.health_plan_id = PPLR.health_plan_id
			and HP.active_ind = 1
			and HP.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and HP.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
;;024+
	join ppr
		where ppr.person_reltn_type_cd = dPersonReltnType ;1158.0
			and ppr.related_person_id = pplr.person_id
  			and ppr.active_ind = 1
  	  		and ppr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
	   		and ppr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	   		and ppr.priority_seq = 1
 
	 join p
 	where ppr.related_person_id = p.person_id
 
 	join ph
 	where ph.parent_entity_id = outerjoin(p.person_id)
 	 	and ph.parent_entity_name = outerjoin("PERSON")
 	 	and ph.active_ind = outerjoin(1)
 	 	and ph.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
 	 	and ph.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
 
head report
y = 0
head ph.phone_id
 
	y = y + 1
 
	stat = alterlist(patient_reply_out->health_plans[x].subscriber_phones,y)
 
	patient_reply_out->health_plans[x].subscriber_phones[y].phone_id = ph.phone_id
	patient_reply_out->health_plans[x].subscriber_phones[y].phone_num = ph.phone_num
	patient_reply_out->health_plans[x].subscriber_phones[y].phone_type_cd = ph.phone_type_cd
	patient_reply_out->health_plans[x].subscriber_phones[y].phone_type_disp = uar_get_code_display(ph.phone_type_cd)
	patient_reply_out->health_plans[x].subscriber_phones[y].sequence_nbr = ph.phone_type_seq
 
 
	with nocounter
 endfor
endif
 
;get comments info
if(iIncComments > 0)
  	call echo(" Inside Include Comments")
  	set perCommentCnt = 0
 
  	select into "nl:"
  	p.person_id
  	,p.info_type_cd
  	from person_info p,long_text lt
 	plan p
    where p.person_id = dPersonID
    and p.info_type_cd = c_comments_info_type_cd
  	join lt
  	where p.long_text_id = lt.long_text_id
  	order by p.person_id , p.info_type_cd
 
  	head report
   		perCommentCnt = 0
	head p.info_type_cd
		perCommentCnt = 0
		detail
	  		perCommentCnt = perCommentCnt + 1
	 	    if (mod(perCommentCnt, 5) = 1)
	         	stat = alterlist(patient_reply_out->Comments, perCommentCnt + 4)
	     	endif
	  		patient_reply_out->Comments[perCommentCnt].UPDT_ID = p.updt_id
	  		patient_reply_out->Comments[perCommentCnt].UPDT_DT_TM = P.updt_dt_tm
	        patient_reply_out->Comments[perCommentCnt].CMT_TEXT = trim(lt.long_text,3)
	        patient_reply_out->Comments[perCommentCnt].Internal_Seq = p.internal_seq
	with nocounter
    set stat = alterlist(patient_reply_out->Comments, perCommentCnt)
endif
 
;getting StudentStatus and written format
select into "nl:"
p.person_id
from PERSON_PATIENT p
plan p
	where p.person_id = dPersonID
		and p.active_ind = 1
		and p.beg_effective_dt_tm <= cnvtdatetime(curdate, curtime3)
		and p.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
order by p.person_id
 
head p.person_id
	patient_reply_out->studentStatus.id  = p.student_cd
	patient_reply_out->studentStatus.name = trim(uar_get_code_description(p.student_cd ))
	patient_reply_out->WrittenFormat.id = p.written_format_cd
	patient_reply_out->WrittenFormat.name = trim(uar_get_code_display(p.written_format_cd))
with nocounter
 
if(idebugFlag > 0)
 	call echo(concat("GetPersonDemographics Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
/*****************************************************************************/
;  Name: PerformBestEncntr(null)  ;018
;  Description: Call script to return best encounter based on person_id
/*****************************************************************************/
subroutine PerformBestEncntr(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("PerformBestEncntr Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
declare encntrCnt = i4 with noconstant (0), private
declare x = i4 with noconstant(0), private
 
free record encntrRequest
record encntrRequest
(
	1 persons[*]
		2 person_id = F8
)
 
free record encntrReply
record encntrReply
(
 
  1 encounters[*]
		2 encntr_id = f8
		2 person_id = f8
  1 lookup_status = i4
 
%i cclsource:status_block.inc
 
)
 
	set stat = alterlist (encntrRequest->persons, 1)
	set encntrRequest->persons[1]->person_id = dPersonID
 
	execute pts_get_best_encntr_list WITH REPLACE("REQUEST",encntrRequest),
			REPLACE("REPLY",encntrReply)
 
	if(idebugFlag > 0)
 
		call echorecord(encntrReply)
 
	endif
 
    set encntrCnt = size (encntrReply->encounters, 5)
 
	for(x = 1 to encntrCnt)
 
		if(dPersonID = encntrReply->encounters[x]->person_id)
			set stat = alterlist(ui_req->persons,1)
			set ui_req->persons[1]->encntr_id = encntrReply->encounters[x]->encntr_id
			set ui_req->persons[1]->person_id = encntrReply->encounters[x]->person_id
		endif
 
	endfor
 
if(idebugFlag > 0)
 
	call echo(concat("PerformBestEncntr Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
/*****************************************************************************/
;  Name: GetBestEnctrMRN(null)  ;018
;  Description: Call script to return MRN for Best Encntr
/*****************************************************************************/
Subroutine GetBestEnctrMRN(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetBestEnctrMRN Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
if(idebugFlag > 0)
 
	call echorecord(ui_req)
 
endif
 
declare replyCnt = i4 with noconstant (0), private
 
set stat = tdbexecute(APPLICATION_NUMBER, TASK_NUMBER, REQUEST_NUMBER,"REC",ui_req,"REC",temp_patient_reply_out)
 
if (temp_patient_reply_out->status_data->status = "F")
	call ErrorHandler2("EXECUTE", "F", "PATIENT DEMOGRAPHICS", "Error retrieving Best Encounter (600733)",
	"9999", "Error retrieving Best Encounter (600733)", patient_reply_out)
	go to EXIT_SCRIPT
endif
 
set replyCnt = size(temp_patient_reply_out->qual,5)
if( replyCnt > 0)
 
	select into "nl:"
	from encntr_alias ea
	     ,(dummyt d with seq = size(temp_patient_reply_out->qual,5))
	plan d
		where temp_patient_reply_out->qual[d.seq].encntr_id > 0
	join ea
		where ea.encntr_id = temp_patient_reply_out->qual[d.seq].encntr_id
			and ea.encntr_alias_type_cd = c_encntr_mrn_alias_cd
			and ea.active_ind = 1
			and ea.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and ea.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
	head report
		patient_reply_out->mrn = trim(ea.alias)
	with nocounter
 
endif
 
 
if(idebugFlag > 0)
 
	call echo(concat("GetBestEnctrMRN Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
end go
 
set trace notranslatelock go
 
