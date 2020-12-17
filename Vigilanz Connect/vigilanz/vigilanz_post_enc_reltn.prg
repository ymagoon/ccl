/*********************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

**********************************************************************
      Source file name: snsro_post_enc_reltn.prg
      Object name:      vigilanz_post_enc_reltn
      Program purpose:  POST a new encounter person relation in Millennium.
      Executing from:   MPages Discern Web Service
**********************************************************************
                    MODIFICATION CONTROL LOG
**********************************************************************
 Mod Date     Engineer	Comment
----------------------------------------------------------------------
  001 12/18/19 RJC		Initial Write
  002 01/15/20 RJC		Changed to only allow one relationship to post. Fixed issue with internal seq
  003 03/31/20 RJC		Updated it so either PatientRelationToRelatedPersonId or relatedPersonRelationToPatientId is required.
  004 03/31/20 RJC		Fixed lock check
***********************************************************************/
drop program vigilanz_post_enc_reltn go
create program vigilanz_post_enc_reltn
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username:" = ""        		;Required
		, "Json Args:" = ""				;Required
		, "Debug Flag:" = 0				;Optional
 
with OUTDEV, USERNAME, JSON, DEBUG_FLAG
 
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
;100080 - PM_LOCK_GET_LOCKS
free record 100080_req
record 100080_req (
  1 person_id = f8
  1 super_user = i2
  1 mode = i2
  1 unmask_alias = i2
)
 
free record 100080_rep
record 100080_rep (
    1 person [* ]
      2 person_id = f8
      2 user_id = f8
      2 user_name = vc
      2 name = vc
      2 mrn = vc
      2 gender = vc
      2 birth_date = dq8
      2 birth_tz = i4
      2 lockkeyid = i4
      2 entname = vc
      2 user_name_full = vc
    1 status_data
      2 status = c1
      2 subeventstatus [1 ]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
)
 
;100081 - PM_LOCK_ADD_LOCK
free record 100081_req
record 100081_req (
  1 person_id = f8
)
 
free record 100081_rep
record 100081_rep (
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = vc
       3 operationstatus = c1
       3 targetobjectname = vc
       3 targetobjectvalue = vc
)
 
;100082 - PM_LOCK_DEL_LOCKS
free record 100082_req
record 100082_req (
  1 person [*]
    2 person_id = f8
)
 
free record 100082_rep
record 100082_rep (
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = vc
       3 operationstatus = c1
       3 targetobjectname = vc
       3 targetobjectvalue = vc
)
 
; Final reply
free record encounter_reply_out
record encounter_reply_out(
  1 encounter_reltn_id		= f8
  1 audit
    2 user_id             	= f8
    2 user_firstname        = vc
    2 user_lastname         = vc
    2 patient_id            = f8
    2 patient_firstname     = vc
    2 patient_lastname      = vc
    2 service_version       = vc
  1 status_data
    2 status 				= c1
    2 subeventstatus[1]
      3 OperationName 		= c25
      3 OperationStatus 	= c1
      3 TargetObjectName 	= c25
      3 TargetObjectValue 	= vc
      3 Code 				= c4
      3 Description 		= vc
)
 
free record arglist
record arglist (
	1 encounterId 						= vc	;Required
	1 encounterIdType 					= vc	;Optional
	1 relatedPersonId					= vc	;Required
	1 relationshipTypeId				= vc	;Required
	1 relatedPersonRelationToPatientId	= vc	;Required if patientRelationToRelatedPersonId doesn't exist
	1 patientRelationToRelatedPersonId	= vc	;Required if relatedPersonRelationToPatientId doesn't exist
)
 
/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common
execute snsro_common_pm_obj
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
; Input params
free record input
record input (
	1 username							= vc
	1 prsnl_id							= f8
	1 patient_id 						= f8
	1 encntr_id							= f8
	1 encntr_type_cd					= f8
	1 related_person_id					= f8
	1 reltn_type_cd						= f8
	1 related_person_reltn_2_patient_cd = f8
	1 patient_reltn_2_related_person_cd	= f8
	1 internal_seq						= i4
)
 
;Other
declare sEncounterId						= vc with protect, noconstant("")
declare sJsonArgs							= vc with protect, noconstant("")
 
; Constants
declare c_error_handler						= vc with protect, constant("POST ENCOUNTER RELATION")
declare c_now_dt_tm							= dq8 with protect, constant(cnvtdatetime(curdate,curtime3))
declare c_insured_person_reltn_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",351,"INSURED"))
 
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ErrorMsg(msg = vc, error_code = c4, type = vc) 	= null with protect
declare ValidateInputParams(null)				= null with protect
declare ValidatePerson(person_id = f8) 			= i2 with protect
declare GetLocks(null) 							= i2 with protect 	;100080 - PM_LOCK_GET_LOCKS
declare AddLock(null) 							= i2 with protect	;100081 - PM_LOCK_ADD_LOCKS
declare UpdateEncounter(null) 					= null with protect	;114609 - PM.UpdatePersonData
declare DeleteLock(null) 						= i2 with protect	;100082 - PM_LOCK_DEL_LOCKS
declare ReturnReltnIds							= null with protect
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
;Inputs
set iDebugFlag = cnvtint($DEBUG_FLAG)
set input->username = trim($USERNAME, 3)
set input->prsnl_id = GetPrsnlIDfromUserName(input->username)
set sJsonArgs = trim($JSON,3)
set jrec = cnvtjsontorec(sJsonArgs)
 
set sEncounterId = trim(arglist->encounterId,3)
set input->encntr_type_cd = cnvtreal(arglist->encounterIdType)
set input->related_person_id = cnvtreal(arglist->relatedPersonId)
set input->reltn_type_cd = cnvtreal(arglist->relationshipTypeId)
set input->patient_reltn_2_related_person_cd = cnvtreal(arglist->patientRelationToRelatedPersonId)
set input->related_person_reltn_2_patient_cd = cnvtreal(arglist->relatedPersonRelationToPatientId)
 
;Other
set reqinfo->updt_id = input->prsnl_id
 
if(iDebugFlag > 0)
	call echorecord(input)
endif
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
;Validate EncounterTypeId if used and set EncounterId
if(input->encntr_type_cd > 0)
	set iRet = GetCodeSet(input->encntr_type_cd)
	if(iRet != 319) call ErrorMsg("EncounterIdTypeId","2065","I") endif
	set input->encntr_id = GetEncntrIdByAlias(sEncounterId,input->encntr_type_cd)
else
	set input->encntr_id = cnvtreal(sEncounterId)
endif
 
; Validate Input Parameters
call ValidateInputParams(null)
 
;Validate Username
set iRet = PopulateAudit(input->username, input->patient_id, encounter_reply_out, sVersion)
if(iRet = 0) call ErrorMsg("UserId","1001","I") endif
 
; Get patient locks - Request 100080
set iRet = GetLocks(null)
if(iRet = 0) call ErrorMsg("Could not retrieve patient locks (100080).","9999","E") endif
 
; Create Patient Lock - Request 100081
set iRet = AddLock(null)
if(iRet = 0) call ErrorMsg("Could not set patient lock (100081).","9999","E") endif
 
; Create the Encounter
set iRet = UpdateEncounter(null)
if(iRet = 0)
  	  call ErrorMsg("Could not post encounter relationship.","9999","E")
else
	call ErrorHandler2("POST ENCOUNTER", "S", "Post Encounter", "Encounter relationship(s) created successfully.",
  	"0000",build2("Encounter relationship(s) created successfully."), encounter_reply_out)
 
	; Update RelationshipIds object
	call ReturnReltnIds(null)
endif
 
#EXIT_SCRIPT
 
; Delete Lock - 100082
if(100081_rep->status_data.status = "S")
	set iRet = DeleteLock(null)
	if(iRet = 0) call ErrorMsg("Could not delete patient lock (100082).","9999","E") endif
endif
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(encounter_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_post_encounter_reltn.json")
	call echo(build2("_file : ", _file))
	call echojson(encounter_reply_out, _file, 0)
	call echorecord(encounter_reply_out)
	call echo(JSONout)
endif
 
#EXIT_VERSION
/*************************************************************************
; SUBROUTINES
**************************************************************************/
 
/*************************************************************************
;  Name: ErrorMsg(msg = vc, error_code = c4, type = vc) = null
;  Description: This is a quick way to setup the error message and exit the script for input params
**************************************************************************/
subroutine ErrorMsg(msg, error_code, type)
	case (cnvtupper(type))
		of "M": ;Missing
			call ErrorHandler2(c_error_handler, "F", "Validate", build2("Missing required field: ",msg),
			error_code, build2("Missing required field: ",msg), encounter_reply_out)
		of "I": ;Invalid
			call ErrorHandler2(c_error_handler, "F", "Validate", build2("Invalid input field: ",msg),
			error_code, build2("Invalid input field: ",msg), encounter_reply_out)
		of "E": ;Execute
 			call ErrorHandler2(c_error_handler, "F", "Execute", msg, error_code, msg, encounter_reply_out)
	endcase
 
	go to exit_script
 
end ;End Subroutine
 
/*************************************************************************
;  Name: ValidateInputParams(null)	= null
;  Description: Validate input parameters
**************************************************************************/
subroutine ValidateInputParams(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateInputParams Begin",format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	; Validate EncounterId
	if(input->encntr_id = 0)
		call ErrorMsg("EncounterId","2055","M")
	else
		set input->patient_id = GetPersonIdByEncntrId(input->encntr_id)
		if(ValidateEncounter(input->encntr_id) = 0) call ErrorMsg("EncounterId","9999","I") endif
	endif
 
	;Validate RelatedPersonId
	if(input->related_person_id = 0 or ValidatePerson(input->related_person_id) = 0)
		call ErrorMsg("RelatdPersonId","9999","I")
	endif
 
	;Validate RelationshipTypeId
	if(input->reltn_type_cd = 0)
		call ErrorMsg("RelationshipTypeId","2055","M")
	else
		set iRet = GetCodeSet(input->reltn_type_cd)
		if(iRet != 351)
			call ErrorMsg("RelationshipTypeId","9999","I")
		else
			if(input->reltn_type_cd = c_insured_person_reltn_type_cd)
				call ErrorMsg("Insured/Subscriber relationships cannot be added with this endpoint.","9999","E")
			endif
		endif
	endif
 
	;Validate RelatedPersonRelationToPatientId or PatientRelationToRelatedPersonId exist and are valid
	if(input->related_person_reltn_2_patient_cd > 0)
		set iRet = GetCodeSet(input->related_person_reltn_2_patient_cd)
		if(iRet != 40) call ErrorMsg("RelatedPersonToPatientRelationId","9999","I") endif
	else if(input->patient_reltn_2_related_person_cd > 0)
		set iRet = GetCodeSet(input->patient_reltn_2_related_person_cd)
		if(iRet != 40) call ErrorMsg("PatientRelationToRelatedPersonId","9999","I") endif
	else
		call ErrorMsg("Either RelatedPersonToPatientRelationId or PatientRelationToRelatedPersonId is required.","9999","E") endif
	endif
 
	;Validate if person/relationship type already exists
	set iRet = 0
	select into "nl:"
	from encntr_person_reltn epr
	plan epr where epr.encntr_id = input->encntr_id
		and epr.person_reltn_type_cd = input->reltn_type_cd
	detail
		if(epr.related_person_id = input->related_person_id)
			iRet = 1
		endif
		if(epr.person_reltn_cd = input->related_person_reltn_2_patient_cd)
			if(epr.internal_seq >= input->internal_seq)
				input->internal_seq = epr.internal_seq + 1
			endif
		endif
	with nocounter
 
	if(iRet) call ErrorMsg("Related person id/relation type already exists.","9999","E") endif
 
	if(iDebugFlag > 0)
		call echo(concat("ValidateInputParams Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: ValidatePerson(person_id = f8) = i2
;  Description: Validate the person id if prsnl or not
**************************************************************************/
subroutine ValidatePerson(person_id)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidatePerson Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iValidate = 0
 
 	select into "nl:"
 	from person p
	plan p where p.person_id = person_id
		and p.active_ind = 1
		and p.beg_effective_dt_tm < cnvtdatetime(curdate,curtime3)
		and p.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
		and ( p.deceased_cd = value(uar_get_code_by("MEANING",268,"NO"))
			or p.deceased_cd = 0)
 	detail
		iValidate = 1
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("ValidatePerson Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
 	return (iValidate)
end ;End Subroutine
 
/*************************************************************************
;  Name: GetLocks(null) = i2
;  Description: Request 100080 - Get patient locks
**************************************************************************/
subroutine GetLocks(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetLocks Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iAPPLICATION = 100000
	set iTASK = 100080
 	set iREQUEST = 100080
 
 	; Setup request
	set 100080_req->person_id = input->patient_id
	set 100080_req->super_user = 1
 
	; Execute Request
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",100080_req,"REC",100080_rep)
	if(100080_rep->status_data.status = "S")
		if(size(100080_rep->person,5) = 0)
			set iValidate = 1
		else
			call ErrorMsg("Person is locked. Please try updating again later.","9999","E")
		endif
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetLocks Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: AddLock(null) = i2
;  Description:  Request 100081 - create patient lock
**************************************************************************/
subroutine AddLock(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("AddLock Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iAPPLICATION = 100000
	set iTASK = 100080
 	set iREQUEST = 100081
 
	set 100081_req->person_id = input->patient_id
 
	; Execute Request
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",100081_req,"REC",100081_rep)
	if(100081_rep->status_data.status = "S")
		set iValidate = 1
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("AddLock Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: UpdateEncounter(null) = null
;  Description:  Request 3200154 - post a new encounter
**************************************************************************/
subroutine UpdateEncounter(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("UpdateEncounter Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iValidate = 0
 
	;Populate DataMap -- GetPersonData(action = i4, person_id = f8, encntr_id = f8)
 	call GetPersonData(201,input->patient_id,input->encntr_id)
 
	; Transaction Info
	set pm_obj_req->transaction_type = 201 ;Update encounter
	set pm_obj_req->transaction_info.prsnl_id = input->prsnl_id
	set pm_obj_req->transaction_info.trans_dt_tm = cnvtdatetime(curdate,curtime3)
 
	;Related Persons - reset record
	set stat = alterlist(pm_obj_req->person.person_person_reltn,0)
	set stat = alterlist(pm_obj_req->person.person_person_reltn,1)
 
 	;Add person relationship id if it exists
	select into "nl:"
	from person_person_reltn ppr
	where ppr.person_id = input->patient_id
		and ppr.active_ind = 1
		and ppr.end_effective_dt_tm > sysdate
		and ppr.related_person_id = input->related_person_id
		and ppr.person_reltn_type_cd = input->reltn_type_cd
	detail
		pm_obj_req->person.person_person_reltn[1].person_person_reltn_id = ppr.person_person_reltn_id
	with nocounter
 
 	set pm_obj_req->person.person_person_reltn[1].update_reltn_ind = 1
 	set pm_obj_req->person.person_person_reltn[1].related_person_id = input->related_person_id
	set pm_obj_req->person.person_person_reltn[1].person_reltn_type_cd = input->reltn_type_cd
 	set pm_obj_req->person.person_person_reltn[1].person_reltn_cd = input->related_person_reltn_2_patient_cd
 	set pm_obj_req->person.person_person_reltn[1].related_person_reltn_cd = input->patient_reltn_2_related_person_cd
 	set pm_obj_req->person.person_person_reltn[1].encntr_id = input->encntr_id
 	set pm_obj_req->person.person_person_reltn[1].person_id = input->patient_id
 	set pm_obj_req->person.person_person_reltn[1].internal_seq = input->internal_seq
 
 	; These two parameters make it so person level updates aren't done. Maybe future functionality
 	;set pm_obj_req->person.person_person_reltn[1].encntr_only_ind = 1
 	;set pm_obj_req->person.person_person_reltn[1].encntr_updt_flag = 1
 
 
 	;Update Related Persons Person object
	select into "nl:"
	from person p
	where p.person_id = pm_obj_req->person.person_person_reltn[1].related_person_id
	detail
		pm_obj_req->person.person_person_reltn[1].person.person.person_id = p.person_id
		pm_obj_req->person.person_person_reltn[1].person.person.create_dt_tm = cnvtdatetime(p.create_dt_tm)
		pm_obj_req->person.person_person_reltn[1].person.person.create_prsnl_id = p.create_prsnl_id
		pm_obj_req->person.person_person_reltn[1].person.person.name_last_key = p.name_last_key
		pm_obj_req->person.person_person_reltn[1].person.person.name_first_key = p.name_first_key
		pm_obj_req->person.person_person_reltn[1].person.person.name_full_formatted = p.name_full_formatted
		pm_obj_req->person.person_person_reltn[1].person.person.name_middle_key = p.name_middle_key
		pm_obj_req->person.person_person_reltn[1].person.person.name_first_synonym_id = p.name_first_synonym_id
		pm_obj_req->person.person_person_reltn[1].person.person.person_type_cd = p.person_type_cd
		pm_obj_req->person.person_person_reltn[1].person.person.autopsy_cd = p.autopsy_cd
		pm_obj_req->person.person_person_reltn[1].person.person.birth_dt_cd = p.birth_dt_cd
		pm_obj_req->person.person_person_reltn[1].person.person.birth_dt_tm = cnvtdatetime(p.birth_dt_tm)
		pm_obj_req->person.person_person_reltn[1].person.person.conception_dt_tm = cnvtdatetime(p.conception_dt_tm)
		pm_obj_req->person.person_person_reltn[1].person.person.confid_level_cd = p.confid_level_cd
		pm_obj_req->person.person_person_reltn[1].person.person.cause_of_death = p.cause_of_death
		pm_obj_req->person.person_person_reltn[1].person.person.cause_of_death_cd = p.cause_of_death_cd
		pm_obj_req->person.person_person_reltn[1].person.person.citizenship_cd = p.citizenship_cd
		pm_obj_req->person.person_person_reltn[1].person.person.data_status_cd = p.data_status_cd
		pm_obj_req->person.person_person_reltn[1].person.person.deceased_cd = p.deceased_cd
		pm_obj_req->person.person_person_reltn[1].person.person.deceased_source_cd = p.deceased_source_cd
		pm_obj_req->person.person_person_reltn[1].person.person.deceased_dt_tm = cnvtdatetime(p.deceased_dt_tm)
		pm_obj_req->person.person_person_reltn[1].person.person.ethnic_grp_cd = p.ethnic_grp_cd
		pm_obj_req->person.person_person_reltn[1].person.person.ft_entity_id = p.ft_entity_id
		pm_obj_req->person.person_person_reltn[1].person.person.ft_entity_name = p.ft_entity_name
		pm_obj_req->person.person_person_reltn[1].person.person.language_cd = p.language_cd
		pm_obj_req->person.person_person_reltn[1].person.person.marital_type_cd = p.marital_type_cd
		pm_obj_req->person.person_person_reltn[1].person.person.purge_option_cd = p.purge_option_cd
		pm_obj_req->person.person_person_reltn[1].person.person.mother_maiden_name = p.mother_maiden_name
		pm_obj_req->person.person_person_reltn[1].person.person.nationality_cd = p.nationality_cd
		pm_obj_req->person.person_person_reltn[1].person.person.race_cd = p.race_cd
		pm_obj_req->person.person_person_reltn[1].person.person.religion_cd = p.religion_cd
		pm_obj_req->person.person_person_reltn[1].person.person.species_cd = p.species_cd
		pm_obj_req->person.person_person_reltn[1].person.person.sex_cd = p.sex_cd
		pm_obj_req->person.person_person_reltn[1].person.person.sex_age_change_ind = p.sex_age_change_ind
		pm_obj_req->person.person_person_reltn[1].person.person.language_dialect_cd = p.language_dialect_cd
		pm_obj_req->person.person_person_reltn[1].person.person.name_last = p.name_last
		pm_obj_req->person.person_person_reltn[1].person.person.name_first = p.name_first
		pm_obj_req->person.person_person_reltn[1].person.person.name_middle = p.name_middle
		pm_obj_req->person.person_person_reltn[1].person.person.name_phonetic = p.name_phonetic
		pm_obj_req->person.person_person_reltn[1].person.person.last_encntr_dt_tm = cnvtdatetime(p.last_encntr_dt_tm)
		pm_obj_req->person.person_person_reltn[1].person.person.military_rank_cd = p.military_rank_cd
		pm_obj_req->person.person_person_reltn[1].person.person.military_service_cd = p.military_service_cd
		pm_obj_req->person.person_person_reltn[1].person.person.military_base_location = p.military_base_location
		pm_obj_req->person.person_person_reltn[1].person.person.vet_military_status_cd = p.vet_military_status_cd
		pm_obj_req->person.person_person_reltn[1].person.person.vip_cd = p.vip_cd
		pm_obj_req->person.person_person_reltn[1].person.person.birth_tz = p.birth_tz
		pm_obj_req->person.person_person_reltn[1].person.person.birth_tz_disp = datetimezonebyindex(p.birth_tz)
		pm_obj_req->person.person_person_reltn[1].person.person.birth_prec_flag = p.birth_prec_flag
		pm_obj_req->person.person_person_reltn[1].person.person.raw_birth_dt_tm = cnvtdatetimeutc(p.birth_dt_tm)
	with nocounter
 
 	; Execute Request
 	call UpdatePersonData(null)
 
 	if(pm_obj_rep->status_data.status = "S")
 		set iValidate = 1
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("UpdateEncounter Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: DeleteLock(null) = i2
;  Description: Request 100082 - Remove patient lock
**************************************************************************/
subroutine DeleteLock(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("DeleteLock Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iAPPLICATION = 100000
	set iTASK = 100080
 	set iREQUEST = 100082
 
 	set stat = alterlist(100082_req->person,1)
	set 100082_req->person[1].person_id = input->patient_id
 
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",100082_req,"REC",100082_rep)
	if(100082_rep->status_data.status = "S")
		set iValidate = 1
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("DeleteLock Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: ReturnReltnIds(null) = null
;  Description: Return the relation ids
**************************************************************************/
subroutine ReturnReltnIds(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ReturnReltnIds Begin",format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set idx = 1
 
	select into "nl:"
	from encntr_person_reltn epr
	plan epr where epr.encntr_id = input->encntr_id
		and epr.related_person_id = input->related_person_id
		and	epr.person_reltn_type_cd = input->reltn_type_cd
	detail
		encounter_reply_out->encounter_reltn_id = epr.encntr_person_reltn_id
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("ReturnReltnIds Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3)," seconds"))
	endif
 
end ;End Sub
 
end go
set trace notranslatelock go