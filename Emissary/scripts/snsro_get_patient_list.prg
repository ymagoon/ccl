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
*                                                                    *
   ~BE~***********************************************************************/
  /*****************************************************************************
      Source file name:    	snsro_get_patient_list.prg
      Object name:         	snsro_get_patient_list
      Program purpose:      Returns all patients within a specific Patient List
      Tables read:
      Tables updated:       NONE
      Executing from:       Emissary Service
      Special Notes:	    NONE
******************************************************************************/
 /***********************************************************************
  *                   MODIFICATION CONTROL LOG                		   *
 ***********************************************************************
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
   000 8/25/14  AAB					Initial write
   001 10/19/14 AAB					Call user friendly reply
   002 10/24/14 AAB   				Add Recent Patient logic
   003 11/10/14 AAB 				User Patient List Type of 4 for recent
									patients
   004 12/22/14 AAB					Added vip_disp to response
   005 12/27/14 AAB                 Added PostAmble subroutine to add
									name_first, name_last, name_middle, name_prefix
									name_suffix to reply
   006 01/01/15 AAB					Changed Recent Patients List Type to 3. Previously 4.
   007 01/07/15 AAB					Added phone object to response
   008 01/26/15	JCO					Added INC_EXTENDED & INC_CARETEAM
   009 01/27/15 JCO					Added Ethnicity, language, and race
   010 01/28/15 JCO					Added SEQUENCE_NBR to PHONE object
   011 02/05/15 AAB 				Added Patient Care object
   012 02/13/15 AAB                 Reset phone count and PCT object count
   013 02/13/15 AAB 				Remove PL_TYPE from Input parameter
   014 03/09/15 AAB 				Add flag to return Identity Object and return object in PostAmble
   015 03/20/15 AAB 				Added address to Extended Object
   016 03/31/15 AAB 				Added notranslatelock
   017 04/06/15 JCO					Added CURRENT qualifier to PERSON_NAME join
   018 06/22/15 AAB 				Added Related Persons to Input and Output
   019 07/17/15 JCO					Added email, marital status, phone to care_team
   020 07/17/15 JCO					Changed pt_care_team from PPR to EPR query
   021 11/24/15 AAB 				Add Audit object
   022 12/6/15  AAB					Fixed error handling to take correct reply handle
   023 12/14/15 AAB 				Return patient class
   024 02/13/16 AAB 				Add inpatient_admit_dt_tm to reply
   025 02/22/16 AAB 				Return encntr_type and encntr_class
   026 04/29/16 AAB 				Added version
   027 10/10/16 AAB 				Add DEBUG_FLAG
   028 07/27/17 JCO					Changed %i to execute; update ErrorHandler2
   029 03/21/18 RJC					Added version code and copyright block
 ***********************************************************************/
drop program snsro_get_patient_list go
create program snsro_get_patient_list
 
/************************************************************************
; REQUEST
************************************************************************/
prompt
  "Output to File/Printer/MINE" = "MINE"
 	, "UserName "			 = ""
    , "Patient List ID"  	 = 0.0
 	,"Include Extended"		 = 0
	,"Include Care Team"	 = 0
	,"Include Identity "	 = 0
	,"Include Related Persons" = 0
	, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, USERNAME, PL_ID, INC_EXTENDED, INC_CARETEAM, INC_IDENTITY, INC_PERSON_RELTN, DEBUG_FLAG   ;027  /*008 , 018*/
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.16.6.1" ;029
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/****************************************************************************
; DECLARED STRUCTURES
****************************************************************************/
free record req_in
record req_in
(
	1 patient_list_id					 = f8
	1 patient_list_type_cd				 = f8
	1 patient_list_name					 = vc
	1 best_encntr_flag					 = i2
	1 arguments[*]
		2 argument_name					 = vc
		2 argument_value				 = vc
		2 parent_entity_name			 = vc
		2 parent_entity_id				 = f8
	1 encntr_type_filters[*]
		2 encntr_type_cd 				 = f8
	1 rmv_pl_rows_flag					 = i2
)
 
free record rep_out
record rep_out
(
	1 patient_list_id					 = f8
	1 name 								 = vc
	1 description 						 = vc
	1 patient_list_type_cd				 = f8
	1 owner_id							 = f8
	1 prsnl_access_cd					 = f8
	1 execution_dt_tm					 = dq8
	1 execution_status_cd				 = f8
	1 execution_status_disp				 = vc
	1 arguments[*]
		2 argument_name					 = vc
		2 argument_value				 = vc
		2 parent_entity_name			 = vc
		2 parent_entity_id				 = f8
	1 encntr_type_filters[*]
		2 encntr_type_cd				 = f8
	1 patients[*]
		2 person_id						 = f8
		2 person_name					 = vc
		2 encntr_id						 = f8
		2 priority						 = i4
		2 active_ind					 = i2
		2 filter_ind					 = i2
		2 responsible_prsnl_id			 = f8
		2 responsible_prsnl_name		 = vc
		2 responsible_reltn_cd			 = f8
 		2 responsible_reltn_disp		 = vc
 		2 responsible_reltn_id			 = f8
 		2 responsible_reltn_flag		 = i2
 		2 organization_id				 = f8
 		2 confid_level_cd				 = f8
 		2 confid_level_disp				 = c40
 		2 confid_level					 = i4
 	    2 birthdate						 = dq8
 	    2 birth_tz						 = i4
 	    2 end_effective_dt_tm		 	 = dq8
 	    2 service_cd             	     = f8
 	    2 service_disp            	     = c40
 	    2 gender_cd                 	 = f8
   		2 gender_disp              	 	 = c40
   		2 temp_location_cd         	     = f8
 	    2 temp_location_disp			 = c40
 	    2 vip_cd                   	     = f8
 	    2 visit_reason             		 = vc
 	    2 visitor_status_cd      	     = f8
   		2 visitor_status_disp     	     = c40
   		2 deceased_date			    	 = dq8
   		2 deceased_tz			    	 = i4
 		2 remove_ind					 = i4
 		2 remove_dt_tm					 = dq8
     1 status_data
 		2 status 					  	 = c1
 		2 subeventstatus[1]
 			3 OperationName 		 	 = c25
 			3 OperationStatus 			 = c1
 			3 TargetObjectName 			 = c25
 			3 TargetObjectValue 		 = vc
)
 
free record ui_req
record ui_req
(
  1 persons[*]
	2 person_id			= f8
	2 encntr_id			= f8
)
 
free record patients_reply_out
record patients_reply_out
(
 1 qual[*]
   2 person_id                 = f8
   2 encntr_id                 = f8
   2 encntr_type_cd			   = f8	;023
   2 encntr_type_disp		   = vc	;023
   2 encntr_type_class_cd	   = f8	;025
   2 encntr_type_class_disp	   = vc	;025
   2 inpatient_admit_dt_tm	   = dq8 ;024
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
   2 service_version				= vc		;026
;028 %i cclsource:status_block.inc
/*028 begin */
  1 status_data
    2 status = c1
    2 subeventstatus[1]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
      3 Code = c4
      3 Description = vc
/*028 end */
)
 
 
free record pref_request
record pref_request (
  1 qual_knt = i4
  1 qual [*]
    2 app_number = i4
    2 position_cd = f8
    2 prsnl_id = f8
)
 
free record pref_reply_out
record pref_reply_out
(
  1 qual_knt = i4
  1 qual [*]
    2 app_number = i4
    2 position_cd = f8
    2 prsnl_id = f8
    2 pref_qual = i4
    2 app_prefs_id = f8
    2 pref [*]
    	3 pref_id = f8
    	3 pref_name = vc
    	3 pref_value = vc
    	3 sequence = i4
    	3 merge_id = f8
    	3 merge_name = vc
    	3 active_ind = i2
%i cclsource:status_block.inc
)
 
set patients_reply_out->status_data->status = "F"
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
declare dPl_ID	 					= f8 with protect, noconstant(0.0)
declare sUserName 					= vc with protect, noconstant("")
declare plType 						= i2 with protect, noconstant(0)
declare dPositionCd					= f8 with protect, noconstant(0.0)
declare dUser_ID	 				= f8 with protect, noconstant(0.0)
declare listType 					= vc with protect, noconstant("")
declare argCnt 						= i4 with protect, noconstant (0)
declare uiCnt						= i4 with protect, noconstant (0)
declare APPLICATION_NUMBER 			= i4 with protect, constant (600005)
declare TASK_NUMBER 				= i4 with protect, constant (600600)
declare PREF_TASK_NUMBER 			= i4 with protect, constant (961200)
declare REQUEST_NUMBER 				= i4 with protect, constant (600733)
declare PREF_REQUEST_NUMBER 		= i4 with protect, constant (961202)
declare RecentInd					= i2 with protect, noconstant(0)
declare persdata 					= vc with protect, noconstant("")
declare PL_TASK_NUMBER 				= i4 with protect, constant (600024)
declare PL_REQUEST_NUMBER 			= i4 with protect, constant (600123)
declare iIncExtended	 			= i4 with protect, noconstant(CNVTINT($INC_EXTENDED))					/*005*/
declare iIncCareteam	 			= i4 with protect, noconstant(CNVTINT($INC_CARETEAM))					/*005*/
declare iIncIdentity	 			= i4 with protect, noconstant(CNVTINT($INC_IDENTITY))
declare iIncPersonReltns			= i4 with protect, noconstant(CNVTINT($INC_PERSON_RELTN))  				/*018*/
declare dEmail						= f8 with protect, constant(uar_get_code_by("MEANING", 212, "EMAIL")) 	/*019*/
declare iRet						= i2 with protect, noconstant(0) 	;021
declare idebugFlag					= i2 with protect, noconstant(0) ;027
 
/****************************************************************************
;INITIALIZE
****************************************************************************/
set dPl_ID	 						= $PL_ID
set sUserName 						= trim($USERNAME, 3)
set idebugFlag						= cnvtint($DEBUG_FLAG)  ;027
 
/****************************************************************************
;INCLUDES
****************************************************************************/
;028 %i ccluserdir:snsro_common.inc
execute snsro_common	;028
 
/****************************************************************************
; DECLARED SUBROUTINES
****************************************************************************/
 
declare prepareRequest(null) 	 = null with protect
declare getPatList(null) 		 = null with protect
declare getFriendlyReply(null)   = null with protect
declare getRecentPatients(null)  = null with protect
declare PerformBestEncntr (null) = null with protect
declare PostAmble(null)		     = null with protect
declare getPatientList(null) 	 = null with protect
 
/*****************************************************************************/
;CALL SUBROUTINES
/*****************************************************************************/
if(idebugFlag > 0)
 
    call echo(build(" Username -> ",sUserName))
    call echo(build(" Patient List ID -> ",dPl_ID))
    call echo(build(" plType -> ",plType))
 
endif
 
	set iRet = PopulateAudit(sUserName, 0.0, patients_reply_out, sVersion)   ;026    ;021
 
	if(iRet = 0)  ;021
		call ErrorHandler2("VALIDATE", "F", "PATIENTLIST", "Invalid User for Audit.",
		"1001", build("UserId is invalid: ", sUserName), patients_reply_out)
		go to EXIT_SCRIPT
 
	endif
 
if(dPl_ID > 0.0)
    set plType = 0
	call prepareRequest(null)
	;call getPatList(null)
	call getPatientList(null)
	call getFriendlyReply(null)
    call PostAmble (null)
 
else
    set plType = 4
	call getRecentPatients(null)
	call PerformBestEncntr(null)
    call getFriendlyReply(null)
    call PostAmble (null)
 
endif
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
	set JSONout = CNVTRECTOJSON(patients_reply_out)
 
 
if(idebugFlag > 0)
 
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_patients.json")
	call echo(build2("_file : ", _file))
	call echojson(patients_reply_out, _file, 0)
/******  Log reply to JSON file - END - *******/
 
    call echorecord(patients_reply_out)
	call echo(JSONout)
 
 endif
 
    if(validate(_MEMORY_REPLY_STRING))
		set _MEMORY_REPLY_STRING = trim(JSONout,3)
	endif
 
#EXIT_VERSION
/*****************************************************************************/
;  Name: prepareRequest(null)
;  Description: Prepare script request
/*****************************************************************************/
Subroutine prepareRequest(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("prepareRequest Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
if(idebugFlag > 0)
 
    call echo(build(" Patient List ID -> ",dPl_ID))
 
endif
 
	set req_in->patient_list_id  = dPl_ID
 
 	select into "nl:"
 
	dpl.*,dpa.*
 
	from dcp_patient_list dpl, dcp_pl_argument dpa
 
 	plan dpl
 
 	where dpl.patient_list_id = dPl_ID
 
	join dpa
 
	where dpa.patient_list_id = outerjoin(dpl.patient_list_id)
 
    head report
 
 	argCnt = 0
 
	head dpl.patient_list_id
 
		req_in->patient_list_id 							=  dpl.patient_list_id
		req_in->patient_list_type_cd 						=  dpl.patient_list_type_cd
 		req_in->patient_list_name							=  dpl.name
 
	detail
 
		argCnt = argCnt + 1
 
		stat = alterlist(req_in->arguments, argCnt)
 
		req_in->arguments[argCnt]->argument_name 			=  dpa.argument_name
 
		req_in->arguments[argCnt]->argument_value 			=  dpa.argument_value
 
		req_in->arguments[argCnt]->parent_entity_name 		=  dpa.parent_entity_name
 
		req_in->arguments[argCnt]->parent_entity_id 		=  dpa.parent_entity_id
 
 	with nocounter
 
 
	if(curqual = 0)
 
		call ErrorHandler2("SELECT", "F", "PATIENTLIST", "Patient List does not exist",
		"2034", build("Invalid patient list: ", dPl_ID), patients_reply_out)
 
		go to EXIT_SCRIPT
 
	endif
 
if(idebugFlag > 0)
 
	call echo(concat("prepareRequest Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
/*****************************************************************************/
;  Name: getPatientList(null)
;  Description: Retrieve Patient List details
/*****************************************************************************/
Subroutine getPatientList(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("getPatientList Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
set stat = tdbexecute(APPLICATION_NUMBER, PL_TASK_NUMBER, PL_REQUEST_NUMBER,"REC",
req_in,"REC",rep_out)
 
if (rep_out->status_data->status = "F")
	call ErrorHandler2("EXECUTE", "F", "PATIENTLIST", "Error retrieving Patients in Patient List (600123)",
	"9999", "Error retrieving Patients in Patient List (600123)", patients_reply_out)	;028
	go to EXIT_SCRIPT
endif
 
if(idebugFlag > 0)
 
	call echo(concat("getPatientList Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
 
/*****************************************************************************/
;  Name: getPatList(null)
;  Description: Retrieve Patient List details
/*****************************************************************************/
 
Subroutine getPatList(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("getPatList Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
;declare encntr_org_sec_ind 		 	 = i2 with noconstant(0)
;declare confid_ind				 	 	= i2 with noconstant(0)
declare remove_option 			 	 	= i2 with noconstant(0)
declare LogStatistics (seconds = f8) 	= null
declare begin_time 					 	= f8 with noconstant(cnvtdatetime(curdate,curtime3))
declare finish_time 					= f8 with noconstant(cnvtdatetime(curdate,curtime3))
declare stat 						 	= i4 with noconstant (0)
declare AssignRemoveIndicator (x = i4)  = NULL
 
	set remove_option 					= req_in->rmv_pl_rows_flag
	set listType 					    = uar_get_code_meaning (req_in->patient_list_type_cd)
 
	if(idebugFlag > 0)
 
		call echo(build(" PatientlistType-> ",listType))
 
	endif
 
	if(listType != "")
		case(listType)
 
				of "CUSTOM":
 
					execute dcp_get_pl_custom2
 
				of "CARETEAM":
 
					execute dcp_get_pl_careteam2
 
				of "LOCATION":
 
					execute dcp_get_pl_census
 
				of "LOCATIONGRP":
 
					execute dcp_get_pl_census
 
				of "VRELTN":
 
					execute dcp_get_pl_reltn
 
					if(remove_option = 1)
 
					 call AssignRemoveIndicator (1)
 
					endif
 
				of "LRELTN":
 
					execute dcp_get_pl_reltn
 
					if(remove_option = 1)
 
					 call AssignRemoveIndicator (1)
 
					endif
 
				of "RELTN":
 
					execute dcp_get_pl_reltn
 
					if(remove_option = 1)
 
					 call AssignRemoveIndicator (1)
 
					endif
 
				of "PROVIDERGRP":
 
					execute dcp_get_pl_provider_group2
 
					if(remove_option = 1)
 
					 call AssignRemoveIndicator (1)
 
					endif
 
				of "SERVICE":
 
					execute dcp_get_pl_census
 
				of "ASSIGNMENT":
 
					execute dcp_get_pl_asgmt
 
				of "ANC_ASGMT":
 
					execute dcp_get_pl_ancillary_asgmt
 
				of "QUERY":
 
					execute dcp_get_pl_query
 
				of "SCHEDULE":
 
					execute dcp_get_pl_schedule
 
				else
 
					call ErrorHandler2("VALIDATE", "F", "PATIENTLIST", "Invalid patient_list_type_cd",
					"2034", build("Invalid patient list type: ", listType), patients_reply_out)	;028
					go to EXIT_SCRIPT
 
		endcase
 
 
	else
 
		call ErrorHandler2("VALIDATE", "F", "PATIENTLIST", "Invalid patient_list_type_cd",
		"2034", build("Invalid patient list type: ", listType), patients_reply_out)	;028
		go to EXIT_SCRIPT
 
	endif
 
 
subroutine AssignRemoveIndicator (x)
 
	select into "nl:"
 
	 from dcp_pl_prioritization p
 
	 ,(dummyt d1 with seq = value(size(rep_out->patients,5)))
 
	 plan d1
 
	 join p
 
	 where p.patient_list_id = req_in->patient_list_id
 
	   and p.person_id = rep_out->patients[d1.seq].person_id
 
	   and p.encntr_id = rep_out->patients[d1.seq].encntr_id
 
	  and p.remove_ind = 1
 
	detail
 
	   rep_out->patients[d1.seq].remove_ind = p.remove_ind
 
	   rep_out->patients[d1.seq].remove_dt_tm = cnvtdatetime(p.remove_dt_tm)
 
	with nocounter
 
end
 
if(idebugFlag > 0)
 
	call echo(concat("getPatList Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
 
/*****************************************************************************/
;  Name: PerformBestEncntr(null)
;  Description: Call script to return best encounter based on person_id
/*****************************************************************************/
subroutine PerformBestEncntr(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("PerformBestEncntr Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
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
 
 
 
declare patCount = i4 with constant (size(ui_req->persons, 5)), private
declare encntrCnt = i4 with noconstant (0), private
declare x = i4 with noconstant(0), private
declare y = i4 with noconstant(0), private
 
if(idebugFlag > 0)
 
	call echo(build("Patient count ",patCount ))
 
endif
 
set stat = alterlist (encntrRequest->persons, patCount)
 
	for(x = 1 to patCount)
 
		if(ui_req->persons[x]->encntr_id = 0)
 
			set encntrCnt = encntrCnt + 1
 
			set encntrRequest->persons[encntrCnt]->person_id = ui_req->persons[x]->person_id
 
		endif
 
	endfor
 
	if (encntrCnt > 0)
 
		set stat = alterlist (encntrRequest->persons, encntrCnt)
 
		execute pts_get_best_encntr_list WITH REPLACE(req_in,encntrRequest),
			REPLACE(rep_out,encntrReply)
 
   		set encntrCnt = size (encntrReply->encounters, 5)
 
		for(x = 1 to encntrCnt)
 
			for(y = 1 to patCount)
 
				if(ui_req->persons[y]->person_id = encntrReply->encounters[x]->person_id
					and ui_req->persons[y]->encntr_id = 0)
 
						set ui_req->persons[y]->encntr_id = encntrReply->encounters[x]->encntr_id
 
						set y = patCount + 1
				endif
 
			endfor
 
		endfor
 
		;call echorecord(encntrReply)
	endif
 
	free record encntrReply
	free record encntrRequest
 
if(idebugFlag > 0)
 
	call echo(concat("PerformBestEncntr Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
/*****************************************************************************/
;  Name: getFriendlyReply(null)
;  Description: Call script to return patient demographics
/*****************************************************************************/
Subroutine getFriendlyReply(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("getFriendlyReply Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
if(plType = 0)
 
set uiCnt =  size(rep_out->patients,5)
set stat = alterlist(ui_req->persons, uiCnt)
 
if(idebugFlag > 0)
 
	call echo(build(" uiCnt -->", uiCnt))
 
endif
 
	if (uiCnt > 0)
		for (x = 1 to uiCnt)
 
			set ui_req->persons[x]->person_id = rep_out->patients[x]->person_id
			set ui_req->persons[x]->encntr_id = rep_out->patients[x]->encntr_id
 
		endfor
	endif
 
endif
 
;call echorecord(ui_req)
 
set stat = tdbexecute(APPLICATION_NUMBER, TASK_NUMBER, REQUEST_NUMBER,"REC",ui_req,"REC",patients_reply_out)
 
if (patients_reply_out->status_data->status = "F")
	call ErrorHandler2("EXECUTE", "F", "PATIENTLIST", "Error retrieving patient list (600733)",
	"9999", "Error retrieving patient list executing (600733)", patients_reply_out)	;028
	go to EXIT_SCRIPT
endif
 
set replyCnt = size(patients_reply_out->qual,5)
if( replyCnt > 0)
	for (y = 1 to replyCnt)
 
		set patients_reply_out->qual[y]->vip_disp = UAR_GET_CODE_DISPLAY(patients_reply_out->qual[y]->vip_cd)
 		set patients_reply_out->qual[y]->confid_disp = UAR_GET_CODE_DISPLAY(patients_reply_out->qual[y]->confid_cd)
 		set patients_reply_out->qual[y]->encntr_type_cd	=  GetPatientClass(patients_reply_out->qual[y]->encntr_id,1)		  		;023
 		set patients_reply_out->qual[y]->encntr_type_disp	=  uar_get_code_display(patients_reply_out->qual[y]->encntr_type_cd)	;023
 		set patients_reply_out->qual[y]->encntr_type_class_cd	=  GetPatientClass(patients_reply_out->qual[y]->encntr_id,2)		;025
 		set patients_reply_out->qual[y]->encntr_type_class_disp	=
			uar_get_code_display(patients_reply_out->qual[y]->encntr_type_class_cd);025
	endfor
 
endif
 
    call ErrorHandler("EXECUTE", "S", "PATIENTLIST", "Success retrieving Patient List (600733)", patients_reply_out)
 
if(idebugFlag > 0)
 
	call echo(concat("getFriendlyReply Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
/*****************************************************************************/
;  Name: getRecentPatients(null)
;  Description: Retrieve recent patients that user had acceessed.
/*****************************************************************************/
Subroutine getRecentPatients(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("getRecentPatients Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
set req_size = 0
 
  select into "nl:"
 
    p.position_cd, p.person_id
 
  from prsnl p
 
  where p.username  =  sUserName
 
    and p.active_ind = 1
 
    and p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
 
    and p.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
  detail
 
 	dPositionCd = p.position_cd
  	dUser_ID =  p.person_id
 
  with nocounter
 
if(idebugFlag > 0)
 
  call echo(build(" dPositionCd -> ",dPositionCd))
  call echo(build(" dUser_ID -> ",dUser_ID))
 
endif
 
  select into "nl:"
 
  	nvp.pvc_value
 
  from app_prefs ap, name_value_prefs nvp
 
  plan ap
 
  where ap.prsnl_id = dUser_ID and ap.application_number = APPLICATION_NUMBER
 
  join nvp
 
  where nvp.PARENT_ENTITY_ID = ap.app_prefs_id and nvp.pvc_name = "HIST_PID"
 
  detail
 
   persdata = nvp.pvc_value
 
  with nocounter
 
declare prefQual    = i4 with noconstant (0), private
declare prefCount   = i4 with noconstant (0), private
declare notfnd 		= vc with constant("<not_found>")
declare num 		= i4 with noconstant(1)
declare str 		= vc with noconstant("")
 
if(idebugFlag > 0)
 
	call echo(build(" persdata -> ",persdata))
 
endif
 
if(persdata != "")
 
	while (str != notfnd)
 
      	set stat = alterlist(ui_req->persons, num)
     	set str =  piece(persdata,';',num,notfnd)
     	if(str != notfnd)
     		set ui_req->persons[num]->person_id = cnvtreal(str)
 
     	endif
 
		if(idebugFlag > 0)
 
			call echo(build("piece",num,"=",ui_req->persons[num]->person_id))
 
		endif
 
      	set num = num + 1
 
 
 
 	endwhile
 
     	set stat = alterlist(ui_req->persons, num - 1)
        ;call echorecord(ui_req)
 
endif
 
 
if(idebugFlag > 0)
 
	call echo(concat("getRecentPatients Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
/*************************************************************************
;  Name: PostAmble(null)
;  Description: This will perform any post processing after the search has been performed
;
**************************************************************************/
subroutine PostAmble(null)
 
declare personCnt				= i4 with protect, noconstant (0)
declare phoneCnt 				= i4 with protect, noconstant (0)
declare currentCd				= f8 with protect, constant(uar_get_code_by("MEANING", 213, "CURRENT")) 	;017
 
set personCnt = size(patients_reply_out->qual,5)
 
if( personCnt > 0)
	  select into"nl:"
 
		pn.name_first,
		pn.name_last, pn.name_middle, pn.name_prefix, pn.name_suffix
	  from
 
	  (dummyt d WITH seq = personCnt),
	   person p,
	   person_name pn
 
	  plan d
 	  join p
 
 	  where p.person_id = patients_reply_out->qual[d.seq]->person_id
 
	  join pn
 
	  where pn.person_id = p.person_id ;patients_reply_out->qual[d.seq]->person_id
	   and pn.active_ind = 1
	   and pn.name_type_cd = currentCd		;017
	   and pn.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
	   and pn.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
	   head p.person_id
	   		patients_reply_out->qual[d.seq]->marital_status = UAR_GET_CODE_DISPLAY(p.marital_type_cd)
 
	   head pn.person_id;detail
			patients_reply_out->qual[d.seq]->name_first		 	 = pn.name_first
			patients_reply_out->qual[d.seq]->name_last		 	 = pn.name_last
			patients_reply_out->qual[d.seq]->name_middle		 = pn.name_middle
			patients_reply_out->qual[d.seq]->name_prefix		 = pn.name_prefix
			patients_reply_out->qual[d.seq]->name_suffix		 = pn.name_suffix
 
	with nocounter
 
 
	if(iIncExtended > 0)
 
		set addressCount = 0
		select into "nl:" a.address_id,
						  a.address_type_cd,
						  a.street_addr,
						  a.street_addr2,
						  a.city,
						  a.state_cd,
						  a.zipcode
		  from  (dummyt d4 WITH seq = personCnt), address a
 
		 plan d4
 
		 join a
 
		 where a.parent_entity_id = patients_reply_out->qual[d4.seq]->person_id
		   and a.parent_entity_name = "PERSON"
		   and a.active_ind = 1
		   and a.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		   and a.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
		head d4.seq
		  addressCount = 0
		detail
		  addressCount = addressCount + 1
		  stat = alterlist(patients_reply_out->qual[d4.seq]->address, addressCount)
 
		  patients_reply_out->qual[d4.seq]->address[addressCount]->address_id = a.address_id
		  patients_reply_out->qual[d4.seq]->address[addressCount]->address_type_cd = a.address_type_cd
		  patients_reply_out->qual[d4.seq]->address[addressCount]->address_type_disp = UAR_GET_CODE_DISPLAY(a.address_type_cd)
		  patients_reply_out->qual[d4.seq]->address[addressCount]->street_addr = trim(a.street_addr,3)
		  patients_reply_out->qual[d4.seq]->address[addressCount]->street_addr2 = trim(a.street_addr2,3)
		  patients_reply_out->qual[d4.seq]->address[addressCount]->city = a.city
		  patients_reply_out->qual[d4.seq]->address[addressCount]->state_cd = a.state_cd
		  patients_reply_out->qual[d4.seq]->address[addressCount]->state_disp = UAR_GET_CODE_DISPLAY(a.state_cd)
		  patients_reply_out->qual[d4.seq]->address[addressCount]->zipcode = a.zipcode
 
		  /*019 begin*/
		  if(a.address_type_cd = dEmail and a.parent_entity_name = "PERSON" and a.active_ind = 1)
		  	 patients_reply_out->qual[d4.seq]->email = a.street_addr
		  endif
	 	  /*019 end*/
 
		with nocounter
 
	  select into"nl:"
 
		ph.phone_id, ph.phone_type_cd, ph.phone_num
 
	  from
 
	  (dummyt d1 WITH seq = personCnt), phone ph
 
	  plan d1
 
	  join ph
 
	  where ph.parent_entity_id = patients_reply_out->qual[d1.seq]->person_id
	   and ph.parent_entity_name = "PERSON"
	   and ph.active_ind = 1
	   and ph.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
	   and ph.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
	  head d1.seq
 
		phoneCnt = 0
 
	  detail
 
			phoneCnt = phoneCnt + 1
 
			stat = alterlist(patients_reply_out->qual[d1.seq]->phone, phoneCnt)
 
			patients_reply_out->qual[d1.seq]->phone[phoneCnt]->phone_id = ph.phone_id
			patients_reply_out->qual[d1.seq]->phone[phoneCnt]->phone_type_cd = ph.phone_type_cd
			patients_reply_out->qual[d1.seq]->phone[phoneCnt]->phone_type_disp = UAR_GET_CODE_DISPLAY(ph.phone_type_cd)
			patients_reply_out->qual[d1.seq]->phone[phoneCnt]->phone_num = ph.phone_num
			patients_reply_out->qual[d1.seq]->phone[phoneCnt]->sequence_nbr = ph.phone_type_seq	;010
 
	   with nocounter
	endif
 
 
 
	if(iIncCareteam > 0)
 
	  set pReltnCnt = 0
 
 	  /*020 - modified query to query ecntr_prsnl_reltn rather than person_prsnl_reltn */
	  select into "nl:"
 
		epr.*, c.code_set
 
 
	  from encntr_prsnl_reltn  epr, code_value c, prsnl p,
		   (dummyt d2 WITH seq = personCnt)
 
	  plan d2
 
	  join epr
 
	  where epr.active_ind = 1  and epr.encntr_id = patients_reply_out->qual[d2.seq]->encntr_id
 
	  join p
 
	  where p.person_id = epr.prsnl_person_id
 
	  join c
 
	  where epr.encntr_prsnl_r_cd = c.code_value
 
	  head d2.seq
 
		pReltnCnt = 0
 
	  head epr.prsnl_person_id
 
		if (c.code_set =  333)
 
			pReltnCnt = pReltnCnt + 1
 
			stat = alterlist(patients_reply_out->qual[d2.seq]->patient_care_team, pReltnCnt)
 
			patients_reply_out->qual[d2.seq]->patient_care_team[pReltnCnt]->reltn_type = uar_get_code_display (epr.encntr_prsnl_r_cd)
			patients_reply_out->qual[d2.seq]->patient_care_team[pReltnCnt]->provider_id = p.person_id
			patients_reply_out->qual[d2.seq]->patient_care_team[pReltnCnt]->provider_name = p.name_full_formatted
			patients_reply_out->qual[d2.seq]->patient_care_team[pReltnCnt]->from_date = epr.beg_effective_dt_tm
			patients_reply_out->qual[d2.seq]->patient_care_team[pReltnCnt]->to_date = epr.end_effective_dt_tm
 
		endif
 
 
	  with nocounter
 
	  /*019 begin*/
	  set pPhCnt = 0
 
	  for (z = 1 to personCnt)
 
	  		set pPtCareTmCnt = size(patients_reply_out->qual[z]->patient_care_team, 5)
	  		call echo (build("pt care team size: ",pPtCareTmCnt))
	  		if(pPtCareTmCnt > 0)
		  		select into "nl:"
		  			ph.phone_id
 
		  		from phone ph,
		  			(dummyt d3 WITH seq = pPtCareTmCnt)
 
		  	    plan d3
 
			    join ph
 
		 	    where ph.parent_entity_id = patients_reply_out->qual[z]->patient_care_team[d3.seq]->provider_id
		  		  and ph.parent_entity_name = "PERSON"
		 		  and ph.active_ind = 1
			  	  and ph.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			   	  and ph.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
		  		head d3.seq
		  			pPhCnt = 0
 
		  		head ph.phone_id
				  	pPhCnt = pPhCnt + 1
				  	;call echo(build("head ph.phone_id d3.seq: ",d3.seq))
 
				    stat = alterlist(patients_reply_out->qual[z]->patient_care_team[d3.seq]->phones, pPhCnt)
 
				  	patients_reply_out->qual[z]->patient_care_team[d3.seq]->phones[pPhCnt]->phone_id = ph.phone_id
					patients_reply_out->qual[z]->patient_care_team[d3.seq]->phones[pPhCnt]->phone_type_cd = ph.phone_type_cd
				 	patients_reply_out->qual[z]->patient_care_team[d3.seq]->phones[pPhCnt]->phone_type_disp =
				 		UAR_GET_CODE_DISPLAY(ph.phone_type_cd)
				  	patients_reply_out->qual[z]->patient_care_team[d3.seq]->phones[pPhCnt]->phone_num = ph.phone_num
			   	  	patients_reply_out->qual[z]->patient_care_team[d3.seq]->phones[pPhCnt]->sequence_nbr = ph.phone_type_seq
 
				with nocounter	/*019 end*/
 
	  		endif
 
 
 
	  endfor
 
 
 
	endif
 
 
	/* RETRIEVE PERSON ALIASES */
 
	if(iIncIdentity > 0)
 
		set count = 0
		select into "nl:"
 
			p.person_alias_id,
			p.alias_pool_cd,
			p.person_alias_type_cd,
			p.alias
 
		from
			(dummyt d3 WITH seq = personCnt)
			, person_alias p
 
		plan d3
 
		join p
 
		where p.person_id = patients_reply_out->qual[d3.seq]->person_id
		   and p.active_ind = 1
		   and p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		   and p.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
		order by p.person_alias_id
 
		head p.person_alias_id
 
			count = 0
 
		detail
 
		  count = count + 1
 
			stat = alterlist(patients_reply_out->qual[d3.seq]->patient_alias, count)
 
 
		  patients_reply_out->qual[d3.seq]->patient_alias[count]->person_alias_id = p.person_alias_id
		  patients_reply_out->qual[d3.seq]->patient_alias[count]->alias_pool_cd = p.alias_pool_cd
		  patients_reply_out->qual[d3.seq]->patient_alias[count]->person_alias_type_cd = p.person_alias_type_cd
		  patients_reply_out->qual[d3.seq]->patient_alias[count]->person_alias_type_disp = UAR_GET_CODE_DISPLAY(p.person_alias_type_cd)
		  patients_reply_out->qual[d3.seq]->patient_alias[count]->alias = trim(p.alias,3)
 
 
		with nocounter
 
	endif
 
	if(iIncPersonReltns > 0)  ;018
 
	  call echo(" Inside Include Person Relations ")
	  set perReltnCnt = 0
	  set perPhCnt = 0
 
	  select into "nl:"
 
		ppr.*, c.code_set
 
	  from (dummyt d4 WITH seq = personCnt),
			person_person_reltn  ppr, code_value c, person p, phone ph
 
	  plan d4
 
	  join ppr
 
	  where ppr.person_id = patients_reply_out->qual[d4.seq]->person_id
			and ppr.active_ind = 1
			and ppr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and ppr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
	  join p
 
	  where p.person_id = ppr.related_person_id
 
	  join c
 
	  where ppr.related_person_reltn_cd = c.code_value
 
	  join ph
 
	  where ph.parent_entity_id = outerjoin(ppr.related_person_id)
			and ph.parent_entity_name = "PERSON"
			and ph.active_ind = 1
			and ph.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and ph.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
	  head p.person_id
 
		perReltnCnt = 0
		perPhCnt = 0
 
	  head d4.seq
 
		perReltnCnt = perReltnCnt + 1
		perPhCnt = 0
 
		stat = alterlist(patients_reply_out->qual[d4.seq]->related_persons, perReltnCnt)
 
		patients_reply_out->qual[d4.seq]->related_persons[perReltnCnt]->reltn_type = uar_get_code_display (ppr.person_reltn_type_cd)
		patients_reply_out->qual[d4.seq]->related_persons[perReltnCnt]->person_id = p.person_id
		patients_reply_out->qual[d4.seq]->related_persons[perReltnCnt]->person_name = p.name_full_formatted
		patients_reply_out->qual[d4.seq]->related_persons[perReltnCnt]->from_date = ppr.beg_effective_dt_tm
		patients_reply_out->qual[d4.seq]->related_persons[perReltnCnt]->to_date = ppr.end_effective_dt_tm
 
	  detail
 
		perPhCnt = perPhCnt + 1
 
		stat = alterlist(patients_reply_out->qual[d4.seq]->related_persons[perReltnCnt]->phones, perPhCnt)
 
		patients_reply_out->qual[d4.seq]->related_persons[perReltnCnt]->phones[perPhCnt]->phone_id = ph.phone_id
		patients_reply_out->qual[d4.seq]->related_persons[perReltnCnt]->phones[perPhCnt]->phone_type_cd = ph.phone_type_cd
		patients_reply_out->qual[d4.seq]->related_persons[perReltnCnt]->phones[perPhCnt]->phone_type_disp =
			UAR_GET_CODE_DISPLAY(ph.phone_type_cd)
		patients_reply_out->qual[d4.seq]->related_persons[perReltnCnt]->phones[perPhCnt]->phone_num = ph.phone_num
		patients_reply_out->qual[d4.seq]->related_persons[perReltnCnt]->phones[perPhCnt]->sequence_nbr = ph.phone_type_seq
 
 
	  with nocounter
 
	endif
 
endif /*personCnt > 0*/
 
end
 
end go
 
set trace notranslatelock go
