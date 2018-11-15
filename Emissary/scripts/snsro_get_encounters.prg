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
/*****************************************************************************
          Date Written:       09/16/14
          Source file name:   snsro_get_encounters
          Object name:        snsro_get_encounters
          Request #:       	  100041 (PM_SCH_GET_ENCOUNTERS)
 
          Program purpose:    Returns encounter information.
          					  If a FIN NBR is passed in,  it will return encounter
          					  information for that given encounter.  If a FIN NBR
          					  is not passed in,  it will return all encounters
          					  associated to that patient.
          Tables read:
          Tables updated:     NONE
          Executing from:     EMISSARY SERVICES
          Special Notes:	  NONE
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
  000 9/15/14  AAB					Initial write
  001 11/7/14  AAB					Change PrsnlID to Username
  002 11/11/14 AAB					Added Encntr_detail search
  003 11/12/14 AAB					Add Person ID to reply and reuse GetEncounters
  004 11/13/14 AAB					Changed reply_out to encounter_reply_out
  005 11/24/14 AAB          		Remove Fin NBR from request and query param
									Remove person_id from response
  006 12/10/14 AAB					Add a Best Encounter search feature to existing service
  007 12/09/14  AAB        		    Moved EXIT_SCRIPT to ensure reply is sent back
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
***********************************************************************/
 
 
drop program snsro_get_encounters go
create program snsro_get_encounters
/************************************************************************
; REQUEST
************************************************************************/
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username:" = ""
		, "Person ID:" = ""
		, "Search Type:" = 1   ;1 - Regular encounter search  2 - Best Encounter 3 - Encounter Detail (not currently supported)
		,"Include Care Team" = 0
		,"Financial Number:" = ""
with OUTDEV, USERNAME, PERSON_ID, SEARCH_TYPE, INC_CARETEAM , FIN_NBR

/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.16.6.1" ;023
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record req_in
record req_in
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
  1  end_effective_dt_tm		  = dq8
)
 
free record patient_encounters_reply_out
record patient_encounters_reply_out
(
  1  filter_str                   = vc
  1  limited_count			 	  = i2
  1  encounter[*]
     2  encounter_id              = f8
     2  admit_type                = vc
     2  alias_xxx                 = vc
     2  arrive_date               = dq8
     2  bed                       = vc
     2  building                  = vc
     2  client                    = vc
     2  depart_date               = dq8
     2  discharge_date            = dq8
     2  discharge_location        = vc
     2  encounter_status          = vc
     2  encounter_type            = vc
     2  encounter_type_class      = vc
	 2  encntr_type_cd			  = f8	;015
	 2  encntr_type_disp		  = vc	;015
	 2  encntr_type_class_cd	  = f8	;016
	 2  encntr_type_class_disp	  = vc	;016
     2  estimated_arrive_date     = dq8
     2  estimated_depart_date     = dq8
     2  facility                  = vc
     2  financial_class           = vc
     2  isolation                 = vc
     2  medical_service           = vc
     2  nursing_unit              = vc
     2  preregistration_clerk     = vc
     2  preregistration_date      = dq8
     2  provider_xxx              = vc
     2  reason_for_visit          = vc
     2  registration_clerk        = vc
     2  registration_date         = dq8
     2  room                      = vc
     2  vip                       = vc
     2  billingentity             = vc
     2  program_service           = vc
     2  specialty_unit            = vc
     2  episode_display			  = vc
     2  location_extension        = vc
     2  removal_dt_tm             = dq8
     2  loc_bed_cd				  = f8
     2  alias_finnbr		      = vc
     2  ghost_encntr_ind	  	  = i2
     2  encounter_type_cd		  = f8
     2  organization_id			  = f8
     2  primary_guar_name		  = vc
     2  facility_org_id			  = f8 ;019
	 2  patient_care_team[*]
		 3 provider_id			  = f8
		 3 provider_name		  = vc
		 3 reltn_type			  = vc
		 3 from_date              = dq8
		 3 to_date                = dq8
		 3 npi					  =	vc ;018
  ;1  person_id				 	  = f8
  1 audit			;014
	 2 user_id					 = f8
	 2 user_firstname			 = vc
	 2 user_lastname			 = vc
	 2 patient_id				 = f8
	 2 patient_firstname		 = vc
	 2 patient_lastname			 = vc
	 2 service_version			 = vc		;017
/*022 begin */
  1 status_data
    2 status = c1
    2 subeventstatus[1]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
      3 Code = c4
      3 Description = vc
/*022 end */
)
 
free record encntr_detail_reply
record encntr_detail_reply
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
 
set patient_encounters_reply_out->status_data->status = "F"
set encntr_detail_reply->status_data->status = "F"
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
declare dPersonID  		= f8 with protect, noconstant(0.0)
declare sUserName  		= vc with protect, noconstant("")
declare sFIN_NBR		= vc with protect, noconstant("0")
declare cnt				= i2 with protect, noconstant(0)
declare dPrsnlID  		= f8 with protect, noconstant(0.0)
declare dFinNbrCd		= f8 with protect, constant(uar_get_code_by("MEANING", 319, "FIN NBR"))
declare dNPI			= f8 with protect, constant(uar_get_code_by("MEANING", 320, "NPI"))
declare dPrnslIdType	= f8 with protect, constant(uar_get_code_by("MEANING", 320, "PRSNLID"))
declare dEncntrID		= f8 with protect, noconstant(0.0)
declare iEncSearchType	= i2 with protect, noconstant(0)
declare iIncCareteam	= i4 with protect, noconstant(0)
declare Section_Start_Dt_Tm = dq8 with protect, noconstant(cnvtdatetime(curdate, curtime3))
 
declare APPLICATION_NUMBER 			= i4 with protect, constant (600005)
declare TASK_NUMBER 				= i4 with protect, constant (100040)
declare REQ_NUMBER 					= i4 with protect, constant (100041)
declare DET_REQ_NUMBER 				= i4 with protect, constant (100043)
 
/****************************************************************************
;INCLUDES
****************************************************************************/
;022 %i ccluserdir:snsro_common.inc
execute snsro_common
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
set sUserName 		= trim($USERNAME, 3)
;set dPersonID 		= cnvtint($PERSON_ID)
set iEncSearchType 	= cnvtint($SEARCH_TYPE)
set iIncCareteam 	= cnvtint($INC_CARETEAM)
set dPrsnlID 		= GetPrsnlIDfromUserName(sUserName)
set sFIN_NBR		= trim($FIN_NBR,3)
 
if (cnvtstring($PERSON_ID) = ".0" and sFIN_NBR != "");person id not entered, FIN NBR entered
select e.person_id
from encounter e
where e.encntr_id = (SELECT
	ea.encntr_id
	FROM
	encntr_alias ea
	where ea.alias = sFIN_NBR)
 
head e.encntr_id
	 dPersonID = e.person_id
with maxrec = 1
else
 set dPersonID = cnvtint($PERSON_ID)
endif
 
if (cnvtstring($PERSON_ID) !=".0") ;person id entered
set dPersonID = cnvtint($PERSON_ID)
endif
 
call echo(build("Person ID ->", dPersonID))
call echo(build("sUserName ->", sUserName))
call echo(build("SEARCH_TYPE ->", iEncSearchType))
call echo(build("INC_CARETEAM ->", iIncCareteam))
call echo(build("FIN NBR ->", sFIN_NBR))
call echo(build("ENCNTR ID->", dEncntrID))
 
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetEncounters(null)					= null with protect
declare GetEncounterDetail(null)			= null with protect
declare GetBestEncntrs(null)				= null with protect
declare PostAmble(null)						= null with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
if((dPersonID > 0) and (iEncSearchType = 1))
 
	set iRet = PopulateAudit(sUserName, dPersonID, patient_encounters_reply_out, sVersion)   ;017      ;014
 
	if(iRet = 0)  ;004
		call ErrorHandler2("VALIDATE", "F", "ENCOUNTERS", "Invalid User for Audit.",
		"1001", build("UserId is invalid: ",sUserName), patient_encounters_reply_out)	;022
		go to EXIT_SCRIPT
 
	endif
 
	call GetEncounters(null)
 	call PostAmble(null)
 
elseif((dPersonID > 0) and (iEncSearchType = 2))
 
	set iRet = PopulateAudit(sUserName, dPersonID, patient_encounters_reply_out, sVersion)   ;017      ;014
 
	if(iRet = 0)  ;004
		call ErrorHandler2("VALIDATE", "F", "ENCOUNTERS", "Invalid User for Audit.",
		"1001", build("UserId is invalid: ",sUserName), patient_encounters_reply_out)	;022
		go to EXIT_SCRIPT
 
	endif
 
	call GetBestEncntrs(null)
	call PostAmble(null)
    call ErrorHandler("EXECUTE", "S", "ENCOUNTERS", "Success executing Best Encounter", patient_encounters_reply_out)
 
;EncSearchType = 2 placeholder for future use
elseif((dPersonID > 0) and (iEncSearchType = 3))
 ;elseif (iEncSearchType = 3)
	;call GetEncounterDetail(null)
	;call PostAmble(null)
    call ErrorHandler2("EXECUTE", "F", "ENCOUNTERS", "Encounter Search Type: unsupported",
    "2033", build("Invalid Search Type: ",iEncSearchType), patient_encounters_reply_out)	;022
 
else
 
 	call ErrorHandler2("VALIDATE", "F", "ENCOUNTERS", "No Person ID was passed in",
 	"2055", "Missing required field: PatientId", patient_encounters_reply_out)	;022
	go to EXIT_SCRIPT
 
endif
 
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
/******  Log reply to JSON file -BEGIN- *******/
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_encounters.json")
	call echo(build2("_file : ", _file))
	call echojson(patient_encounters_reply_out, _file, 0)
/******  Log reply to JSON file - END - *******/
 
    call echorecord(patient_encounters_reply_out)
	set JSONout = CNVTRECTOJSON(patient_encounters_reply_out)
	call echo(JSONout)
 
    if(validate(_MEMORY_REPLY_STRING))
		set _MEMORY_REPLY_STRING = trim(JSONout,3)
	endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: GetEncounters(null)
;  Description: This will retrieve all encounters for a patient
;
**************************************************************************/
subroutine GetEncounters(null)
call echo("GetEncounters")
 
set req_in->debug                        = 0
set req_in->encounter_id                 = dEncntrID
set req_in->options                      = "1000600005000000000   1"
set req_in->person_id                    = dPersonID
set req_in->return_all                   = 0
set req_in->security                     = 0
set req_in->user_id                      = dPrsnlID
set req_in->user_name                    = sUserName
set req_in->limit_ind                    = 0
set req_in->max_encntr                   = 502
 
if(sFIN_NBR != "")
 
	set stat = alterlist(req_in->filter, 1)
	set req_in->filter[cnt]->flag = 120
	set req_in->filter[cnt]->meaning = "FIN NBR"
	set req_in->filter[cnt]->options = ""
	set req_in->filter[cnt]->phonetic = 0
	set req_in->filter[cnt]->value = build(sFIN_NBR,"*")
	set req_in->filter[cnt]->value = sFIN_NBR
	set req_in->filter[cnt]->weight = 0
 
endif
 
set stat = alterlist(req_in->result, 19)
;1
set req_in->result[1]->flag = 120
set req_in->result[1]->meaning = "FIN NBR"
set req_in->result[1]->options = ""
 
;2
set req_in->result[2]->flag = 139
set req_in->result[2]->meaning = ""
set req_in->result[2]->options = ""
 
;3
set req_in->result[3]->flag = 144
set req_in->result[3]->meaning = ""
set req_in->result[3]->options = ""
 
;4
set req_in->result[4]->flag = 150
set req_in->result[4]->meaning = ""
set req_in->result[4]->options = ""
 
;5
set req_in->result[5]->flag = 162
set req_in->result[5]->meaning = ""
set req_in->result[5]->options = ""
 
;6
set req_in->result[6]->flag = 110
set req_in->result[6]->meaning = ""
set req_in->result[6]->options = ""
 
;7
set req_in->result[7]->flag = 149
set req_in->result[7]->meaning = ""
set req_in->result[7]->options = ""
 
;8
set req_in->result[8]->flag = 160
set req_in->result[8]->meaning = ""
set req_in->result[8]->options = ""
 
;9
set req_in->result[9]->flag = 118
set req_in->result[9]->meaning = ""
set req_in->result[9]->options = ""
 
;10
set req_in->result[10]->flag = 232
set req_in->result[10]->meaning = ""
set req_in->result[10]->options = ""
 
;11
set req_in->result[11]->flag = 233
set req_in->result[11]->meaning = ""
set req_in->result[11]->options = ""
 
;12
set req_in->result[12]->flag = 214
set req_in->result[12]->meaning = ""
set req_in->result[12]->options = ""
 
;13
set req_in->result[13]->flag = 216
set req_in->result[13]->meaning = "SSN"
set req_in->result[13]->options = ""
 
;14
set req_in->result[14]->flag = 216
set req_in->result[14]->meaning = "MRN"
set req_in->result[14]->options = ""
 
;15
set req_in->result[15]->flag = 208
set req_in->result[15]->meaning = ""
set req_in->result[15]->options = ""
 
;16
set req_in->result[16]->flag = 204
set req_in->result[16]->meaning = ""
set req_in->result[16]->options = ""
 
;17
set req_in->result[17]->flag = 203
set req_in->result[17]->meaning = ""
set req_in->result[17]->options = ""
 
;18
set req_in->result[18]->flag = 194
set req_in->result[18]->meaning = ""
set req_in->result[18]->options = ""
 
;19
set req_in->result[19]->flag = 198
set req_in->result[19]->meaning = ""
set req_in->result[19]->options = ""
 
;set req_in->end_effective_dt_tm =
 
call echorecord(req_in)
 
set stat = tdbexecute(APPLICATION_NUMBER, TASK_NUMBER, REQ_NUMBER,"REC",req_in,"REC",patient_encounters_reply_out)
 
 
 
if (patient_encounters_reply_out->status_data->status = "F")
	call ErrorHandler2("EXECUTE", "F", "ENCOUNTERS", "Error executing 100040 - Encounter Search",
	"9999", "Error executing 100040 - Encounter Search", patient_encounters_reply_out)
	go to EXIT_SCRIPT
endif
 
	;set patient_encounters_reply_out->person_id = dPersonID
    call ErrorHandler("EXECUTE", "S", "ENCOUNTERS", "Success executing 100040 - Encounter Search",
    patient_encounters_reply_out)
 
 
 
end
 
/*************************************************************************
;  Name: GetEncounterDetail(null)
;  Description: Retrieves detail information about a
                single person for the search routine.
;
**************************************************************************/
subroutine GetEncounterDetail(null)
 
call echo("GetEncounterDetail")
/*
  select into "nl:"
 
    ea.encntr_id, e.person_id
 
  from encntr_alias ea, encounter e
 
  plan ea
 
  where ea.alias = trim(sFIN_NBR,3)
    and ea.encntr_alias_type_cd = dFinNbrCd
    and ea.active_ind = 1
    and ea.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
    and ea.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
  join e
 
  	where ea.encntr_id = e.encntr_id
 
  detail
 
  dEncntrID = ea.encntr_id
  dPersonID = e.person_id
 
  with nocounter
 
  call GetEncounters(null)
*/
 
free record request
record request (
  1 encntr_id 			= f8
  1 options 			= vc
  1 end_effective_dt_tm = dq8
)
 
set request->encntr_id = dEncntrID
 
call echorecord(request)
 
set stat = tdbexecute(APPLICATION_NUMBER, TASK_NUMBER, DET_REQ_NUMBER,"REC",request,"REC",encntr_detail_reply)
 
call echorecord(encntr_detail_reply)
call echo(build("stat--->", stat))
if (stat > 0)
	call ErrorHandler2("EXECUTE", "F", "ENCOUNTERS", "Error executing 100043",
	"9999", "Error executing 100043", patient_encounters_reply_out)	;022
	go to EXIT_SCRIPT
endif
 
    ;call ErrorHandler("EXECUTE", "S", "Success executing 100043", "Success calling Encounter Detail Search"
    			;, patient_encounters_reply_out)
 
end
 
/*************************************************************************
;  Name: GetBestEncntrs(null)
;  Description: Subroutine to get the Best Encounter for a patient
;
**************************************************************************/
subroutine GetBestEncntrs(null)
 
free record encntrRequest
record encntrRequest
(
	1 persons[*]
		2 person_id = F8
)
 
free record encReply
record encReply
(
 
  1 encounters[*]
		2 encntr_id = f8
		2 person_id = f8
  1 lookup_status = i4
 
%i cclsource:status_block.inc
 
)
 
declare encntrCnt = i4 with noconstant (0), private
declare x = i4 with noconstant(0), private
declare y = i4 with noconstant(0), private
 
 
set stat = alterlist (encntrRequest->persons, 1)
 
set encntrRequest->persons[1]->person_id = dPersonID
 
 
	if (dPersonID > 0)
 
		execute pts_get_best_encntr_list WITH REPLACE(REQUEST,encntrRequest),
			REPLACE(REPLY,encReply)
 
 		call echorecord(encReply)
	endif
 
	set encntrCnt = size (encReply->encounters, 5)
 
	call echo(build(" encntrCnt -->", encntrCnt))
 
		for(x = 1 to encntrCnt)
 
			set dEncntrID = encReply->encounters[x]->encntr_id
 
		endfor
 
	free record encReply
	free record encntrRequest
    call ErrorHandler("EXECUTE", "S", "ENCOUNTERS", "Success executing Best Encounter", patient_encounters_reply_out)
 
    call GetEncounterDetail(null)
 
end
 
/*************************************************************************
;  Name: PostAmble(null)
;  Description: Subroutine to perform Post Processing
;
**************************************************************************/
subroutine PostAmble(null)
 
call echo("Entering postamble")
set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
call echo(concat("PostAmble Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
declare encntrsCnt				= i4 with protect, noconstant (0)
declare eReltnCnt				= i4 with protect, noconstant (0)
declare RFV						= vc
declare ES						= vc
set encntrsCnt 					= size(patient_encounters_reply_out->encounter,5)
 
call echo(build("encntrsCnt  ->", encntrsCnt))
call echo(build("iEncSearchType  ->", iEncSearchType))
 
 
;;;;+++20
if (iEncSearchType = 1 and encntrsCnt > 0)
 
for (i= 1 to encntrsCnt)
select into "nl:"
e.*
from encounter e
where e.encntr_id = patient_encounters_reply_out->encounter[i]->encounter_id
head e.encntr_id
 
 patient_encounters_reply_out->encounter[i]->reason_for_visit = e.reason_for_visit
  patient_encounters_reply_out->encounter[i]->encounter_status = uar_get_code_display(e.encntr_status_cd)
 
endfor
 
endif ;;;; ---20
 
if(iEncSearchType = 2)
 
	set patient_encounters_reply_out->filter_str = ""
	set patient_encounters_reply_out->limited_count = 0
	set stat = alterlist(patient_encounters_reply_out->encounter, 1)
	set patient_encounters_reply_out->encounter[1]->encounter_id = encntr_detail_reply->encntr_id
	set patient_encounters_reply_out->encounter[1]->admit_type = encntr_detail_reply->admit_type_disp
	set patient_encounters_reply_out->encounter[1]->alias_xxx = ""
	set patient_encounters_reply_out->encounter[1]->arrive_date = encntr_detail_reply->arrive_dt_tm
	set patient_encounters_reply_out->encounter[1]->bed = encntr_detail_reply->loc_bed_disp
	set patient_encounters_reply_out->encounter[1]->building = encntr_detail_reply->loc_building_disp
	set patient_encounters_reply_out->encounter[1]->client = ""
	set patient_encounters_reply_out->encounter[1]->depart_date = encntr_detail_reply->depart_dt_tm
	set patient_encounters_reply_out->encounter[1]->discharge_date = encntr_detail_reply->disch_dt_tm
	set patient_encounters_reply_out->encounter[1]->discharge_location = encntr_detail_reply->disch_to_loctn_disp
	set patient_encounters_reply_out->encounter[1]->encounter_status = encntr_detail_reply->encntr_status_disp
	set patient_encounters_reply_out->encounter[1]->encounter_type = encntr_detail_reply->encntr_type_disp
	set patient_encounters_reply_out->encounter[1]->encounter_type_class = encntr_detail_reply->encntr_class_disp
	set patient_encounters_reply_out->encounter[1]->estimated_arrive_date = encntr_detail_reply->est_arrive_dt_tm
	set patient_encounters_reply_out->encounter[1]->estimated_depart_date = encntr_detail_reply->est_depart_dt_tm
	set patient_encounters_reply_out->encounter[1]->facility = encntr_detail_reply->loc_facility_disp
	set patient_encounters_reply_out->encounter[1]->financial_class = encntr_detail_reply->financial_class_disp
	set patient_encounters_reply_out->encounter[1]->isolation = encntr_detail_reply->location_disp
	set patient_encounters_reply_out->encounter[1]->medical_service = encntr_detail_reply->med_service_disp
	set patient_encounters_reply_out->encounter[1]->nursing_unit = encntr_detail_reply->loc_nurse_unit_disp
	set patient_encounters_reply_out->encounter[1]->preregistration_clerk = "";encntr_detail_reply->pre_reg_prsnl_id
	set patient_encounters_reply_out->encounter[1]->preregistration_date = encntr_detail_reply->pre_reg_dt_tm
	set patient_encounters_reply_out->encounter[1]->provider_xxx = ""
	set patient_encounters_reply_out->encounter[1]->reason_for_visit = encntr_detail_reply->reason_for_visit
	set patient_encounters_reply_out->encounter[1]->registration_clerk = ""; encntr_detail_reply->reg_prsnl_id
	set patient_encounters_reply_out->encounter[1]->registration_date = encntr_detail_reply->reg_dt_tm
	set patient_encounters_reply_out->encounter[1]->room = encntr_detail_reply->loc_room_disp
	set patient_encounters_reply_out->encounter[1]->vip = encntr_detail_reply->vip_disp
	set patient_encounters_reply_out->encounter[1]->billingentity = ""
	set patient_encounters_reply_out->encounter[1]->program_service = encntr_detail_reply->program_service_disp
	set patient_encounters_reply_out->encounter[1]->specialty_unit = encntr_detail_reply->specialty_unit_disp
	set patient_encounters_reply_out->encounter[1]->episode_display = ""; encntr_detail_reply->""
	set patient_encounters_reply_out->encounter[1]->location_extension = encntr_detail_reply->location_extension
	set patient_encounters_reply_out->encounter[1]->removal_dt_tm = cnvtdatetime(curdate,curtime3) ; encntr_detail_reply->""
	set patient_encounters_reply_out->encounter[1]->loc_bed_cd = encntr_detail_reply->loc_bed_cd
 
	set patient_encounters_reply_out->encounter[1]->ghost_encntr_ind = 0
	set patient_encounters_reply_out->encounter[1]->encounter_type_cd = encntr_detail_reply->encntr_type_cd
	set patient_encounters_reply_out->encounter[1]->organization_id = encntr_detail_reply->organization_id
	set patient_encounters_reply_out->encounter[1]->primary_guar_name = ""
	set patient_encounters_reply_out->encounter[1]->encntr_type_cd =
		GetPatientClass(patient_encounters_reply_out->encounter[1]->encounter_id,1)	 ;015
	set patient_encounters_reply_out->encounter[1]->encntr_type_disp =
		uar_get_code_display(patient_encounters_reply_out->encounter[1]->encntr_type_cd) ;015
	set patient_encounters_reply_out->encounter[1]->encntr_type_class_cd =
		GetPatientClass(patient_encounters_reply_out->encounter[1]->encounter_id,2)	          		;016
	set patient_encounters_reply_out->encounter[1]->encntr_type_class_disp =
		uar_get_code_display(patient_encounters_reply_out->encounter[1]->encntr_type_class_cd) 		;016
 
	for(x = 1 to size(encntr_detail_reply->alias,5))
		if(encntr_detail_reply->alias[x]->encntr_alias_type_cd = dFinNbrCd)
			set patient_encounters_reply_out->encounter[1]->alias_finnbr = encntr_detail_reply->alias[x]->alias
		endif
 
	endfor
 
	set encntrsCnt = size(patient_encounters_reply_out->encounter,5)
 
else
 
 
   for (i = 1 to encntrsCnt)
	set patient_encounters_reply_out->encounter[i]->encntr_type_cd =
		GetPatientClass(patient_encounters_reply_out->encounter[i]->encounter_id,1)	          			;015
	set patient_encounters_reply_out->encounter[i]->encntr_type_disp =
		uar_get_code_display(patient_encounters_reply_out->encounter[i]->encntr_type_cd) 		;015
	set patient_encounters_reply_out->encounter[i]->encntr_type_class_cd =
		GetPatientClass(patient_encounters_reply_out->encounter[i]->encounter_id,2)	          		;016
	set patient_encounters_reply_out->encounter[i]->encntr_type_class_disp =
		uar_get_code_display(patient_encounters_reply_out->encounter[i]->encntr_type_class_cd) 		;016
 
	endfor
endif
 
 
 
if(iIncCareteam > 0 and encntrsCnt > 0)  ;019
 call echo (build("EncntrCnt: ", encntrsCnt))
   set eReltnCnt = 0
   SELECT INTO "nl:"
	epr.*
	, c.code_set
	, pra.alias
	, p.physician_ind
 
FROM
	(dummyt   d1  WITH seq = encntrsCnt)
	, encntr_prsnl_reltn   epr
	, code_value   c
	, prsnl   p
	, prsnl_alias   pra
 
plan d1
 
  join epr
 
  where epr.active_ind = 1 and epr.encntr_id = patient_encounters_reply_out->encounter[d1.seq]->encounter_id
 
  and epr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)		;013
 
  and epr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)		;013
 
  join p
 
  where p.person_id = epr.prsnl_person_id
 
  join pra
 
  where pra.person_id = outerjoin(p.person_id)
  and pra.prsnl_alias_type_cd = outerjoin(dNPI)
 
   join c
 
  where epr.encntr_prsnl_r_cd = c.code_value
 
head d1.seq
 
    eReltnCnt = 0
 
  detail
 
	if (c.code_set =  333)
 
		eReltnCnt = eReltnCnt + 1
 
	    stat = alterlist(patient_encounters_reply_out->encounter[d1.seq]->patient_care_team, eReltnCnt)
 
		patient_encounters_reply_out->encounter[d1.seq]->patient_care_team[eReltnCnt]->reltn_type =
			uar_get_code_display (epr.encntr_prsnl_r_cd)
 		patient_encounters_reply_out->encounter[d1.seq]->patient_care_team[eReltnCnt]->provider_id = p.person_id
 		patient_encounters_reply_out->encounter[d1.seq]->patient_care_team[eReltnCnt]->provider_name = p.name_full_formatted
		patient_encounters_reply_out->encounter[d1.seq]->patient_care_team[eReltnCnt]->from_date = epr.beg_effective_dt_tm
		patient_encounters_reply_out->encounter[d1.seq]->patient_care_team[eReltnCnt]->to_date = epr.end_effective_dt_tm
 		patient_encounters_reply_out->encounter[d1.seq]->patient_care_team[eReltnCnt]->npi = pra.alias
 
 
 	endif
WITH nocounter
 
 
   call echo(concat("PostAmble Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
                 " seconds"))
endif
 
end
 
end go
set trace notranslatelock go
