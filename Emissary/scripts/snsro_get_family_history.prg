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
          Date Written:       01/08/15
          Source file name:   snsro_get_family_history
          Object name:        snsro_get_family_history
          Request #:          601202 - kia_get_family_history
 
          Program purpose:    Reads family history for given person ids.
 
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
  000 01/08/15  JCO		    		Initial
  001 02/05/15  JCO					Added Related Person details
  002 02/10/15  JCO					Added SNOMED detail
  003 02/16/15  AAB					Changed PERSON_ID to a number in Input param
  004 02/18/15  AAB 				Switched order of Input Params
  005 09/14/15  AAB					Add audit object
  006 04/29/16  AAB 				Added version
  007 06/13/16  JCO					Added beg_effective_dt_tm for 2015 Cerner Rev
  008 07/27/17 	JCO					Changed %i to execute; update ErrorHandler2
  009 03/21/18 	RJC					Added version code and copyright block
 ***********************************************************************/
drop program snsro_get_family_history go
create program snsro_get_family_history
 
/************************************************************************
; REQUEST
************************************************************************/
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username:" = ""
		, "Person ID:" = 0.0
 
with OUTDEV, USERNAME, PERSON_ID

/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.16.6.1" ;009
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record req_in
record req_in (
  1 person_id = f8
  1 prsnl_id = f8
)
 
free record family_history_reply_out
record family_history_reply_out
(
  1 result_qual [*]
    2 fhx_activity_id = f8
    2 fhx_activity_group_id = f8
    2 person_id = f8
    2 type_mean = c12
    2 fhx_value_flag = i2
    2 related_person_id = f8
    2 nomenclature_id = f8
    2 source_string = vc
    2 onset_age_prec_cd = f8
    2 onset_age = i2
    2 onset_age_unit_cd = f8
    2 life_cycle_status_cd = f8
    2 severity_cd = f8
    2 course_cd = f8
    2 updt_cnt = i4
    2 concept_cki = vc
    2 comment_qual [*]
      3 fhx_long_text_r_id = f8
      3 long_text_id = f8
      3 long_text = vc
      3 comment_prsnl_id = f8
      3 comment_prsnl_full_name = vc
      3 comment_dt_tm = dq8
      3 comment_dt_tm_tz = i4
    2 prsnl_qual [*]
      3 fhx_action_id = f8
      3 prsnl_id = f8
      3 prsnl_full_name = vc
      3 action_type_mean = c12
      3 action_dt_tm = dq8
      3 action_tz = i4
    2 result_reltn_qual [*]
      3 fhx_activity_s_id = f8
      3 fhx_activity_t_id = f8
      3 type_mean = c12
    2 beg_effective_dt_tm = dq8	;007
    2 related_person_reltn_type = vc
    2 related_person_reltn_name = vc
    2 snomed = vc
  1 last_updt_prsnl_id = f8
  1 last_updt_prsnl_name = vc
  1 last_updt_dt_tm = dq8
  1 incomplete_data_ind = i2
  1 audit			;005
	2 user_id							= f8
	2 user_firstname					= vc
	2 user_lastname						= vc
	2 patient_id						= f8
	2 patient_firstname					= vc
	2 patient_lastname					= vc
	2 service_version					= vc		;006
/*008 begin */
  1 status_data
    2 status = c1
    2 subeventstatus[1]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
      3 Code = c4
      3 Description = vc
/*008 end */
)
 
set family_history_reply_out->status_data->status = "F"
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
declare dPersonID  		= f8 with protect, noconstant(0.0)
declare dPrsnlID		= f8 with protect, noconstant(0.0)
declare fhCnt			= i2 with protect, noconstant(0)
declare sSourceVocab    = vc with protect, noconstant("")		;002
declare sSourceIdent	= vc with protect, noconstant("")		;002
declare sUserName		= vc with protect, noconstant("")
declare iRet		    = i2 with protect, noconstant(0) 	;005
 
declare APPLICATION_NUMBER 			= i4 with protect, constant (600005)
declare TASK_NUMBER 				= i4 with protect, constant (601025)
declare REQ_NUMBER 					= i4 with protect, constant (601202)
 
/****************************************************************************
;INCLUDES
****************************************************************************/
;008 %i ccluserdir:snsro_common.inc
execute snsro_common
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
set dPersonID = ($PERSON_ID)
set sUserName = $USERNAME
set dPrsnlID = GetPrsnlIDfromUserName(sUserName)
call echo(build("Person ID -> ", dPersonID))
call echo(build("Username -> ", sUsername))
call echo(build("User ID -> ",  dPrsnlID))
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetFamilyHistory(null)				= null with protect
;declare GetPrsnlIDfromUserName(null)		= null with protect
declare PostAmble(null)						= null with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
if(dPersonID > 0 and sUsername != "")
 
	set iRet = PopulateAudit(sUserName, dPersonID, family_history_reply_out, sVersion)   ;006   ;005
 
	if(iRet = 0)  ;004
		call ErrorHandler2("VALIDATE", "F", "FAMILY HISTORY", "Invalid User for Audit.",
		"1001", build("UserId is invalid: ",sUserName), family_history_reply_out)	;008
		go to EXIT_SCRIPT
 
	endif
 
	;call GetPrsnlIDfromUserName(null)
	call GetFamilyHistory(null)
	call PostAmble(null)
 
else
 
 	call ErrorHandler2("VALIDATE", "F", "FAMILY HISTORY", "No Person ID or Username was passed in",
 	"2055", "Missing required field: PatientId", family_history_reply_out)	;008
	go to EXIT_SCRIPT
 
endif
 
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
/******  Log reply to JSON file -BEGIN- *******/
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_family_history.json")
	call echo(build2("_file : ", _file))
	call echojson(family_history_reply_out, _file, 0)
/******  Log reply to JSON file - END - *******/
 
	set JSONout = CNVTRECTOJSON(family_history_reply_out)
    call echorecord(family_history_reply_out)
	call echo(JSONout)
 
    if(validate(_MEMORY_REPLY_STRING))
		set _MEMORY_REPLY_STRING = trim(JSONout,3)
	endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: GetFamilyHistory(null)
;  Description: This will retrieve family history for a patient
;
**************************************************************************/
subroutine GetFamilyHistory(null)
call echo("GetFamilyHistory")
 
set req_in->person_id = dPersonID
set req_in->prsnl_id = dPrsnlID
 
call echorecord(req_in)
 
set stat = tdbexecute(APPLICATION_NUMBER, TASK_NUMBER, REQ_NUMBER,"REC",req_in,"REC",family_history_reply_out)
 
 
if (family_history_reply_out->status_data->status = "F")
	call ErrorHandler2("EXECUTE", "F", "FAMILY HISTORY", "Error retrieving Family History -- 601202",
	"9999", "Error retrieving Family History -- 601202", family_history_reply_out)	;008
	go to EXIT_SCRIPT
endif
 
    call ErrorHandler("EXECUTE", "S", "FAMILY HISTORY", "Success retrieving Family History -- 600114", family_history_reply_out)
 
 
end
 
/*************************************************************************
;  Name: PostAmble(null)
;  Description: Perform any post-processing steps
;
**************************************************************************/
subroutine PostAmble(null)
call echo("FamilyHistoryPostProcessing...")
 
set fhCnt = size(family_history_reply_out->result_qual,5)
call echo(build("family history count: ",fhCnt))
call echo(build("person id: ",dPersonID))
 
/***********************************
* 001 - Get related family details *
***********************************/
if(fhCnt > 0)
 
	  select into "nl:"
		  from
		  	person_person_reltn ppr
			, person p
			,(dummyt d with seq = fhCnt)
 
		  plan d
 
		  join ppr
			where ppr.person_id = dPersonID and ppr.related_person_id =
												family_history_reply_out->result_qual[d.seq]->related_person_id
		  join p
			where p.person_id = ppr.related_person_id
 
		  detail
				family_history_reply_out->result_qual[d.seq]->related_person_reltn_type =
														uar_get_code_display(ppr.person_reltn_cd)
				family_history_reply_out->result_qual[d.seq]->related_person_reltn_name = p.name_full_formatted
 
		  with nocounter
 
 
/********************************************************
* 002 - Added SNOMED detail								*
********************************************************/
 
	for (x = 1 to fhCnt)
		set sSourceVocab = piece(family_history_reply_out->result_qual[x].concept_cki, "!",1,"Not Found")
		set sSourceIdent = piece(family_history_reply_out->result_qual[x].concept_cki, "!",2,"Not Found")
 
		case (sSourceVocab)
 
		       of "SNOMED" :
			     set family_history_reply_out->result_qual[x].snomed = sSourceIdent
 
		endcase
 
	endfor
else
		call ErrorHandler("EXECUTE", "Z", "FAMILY HISTORY", "No family history records found.", family_history_reply_out)
		go to EXIT_SCRIPT
 
endif
 
end
 
end go
 
