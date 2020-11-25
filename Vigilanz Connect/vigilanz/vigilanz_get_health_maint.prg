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
          Date Written:       11/08/14
          Source file name:   snsro_get_health_maint.prg
          Object name:        SNSRO_GET_HEALTH_MAINT
          Request #:          966307 (PCO_GET_HM_RECOMMENDATION_TWO)
          Program purpose:    Searches for a list of health maintenance
                              reminders and historic satisfiers for
                              a given patient identifier & date range.
          Tables read:		  HM_EXPECT, HM_EXPECT_MOD, HM_EXPECT_SAT
          					  HM_SCHED, HM_SERIES
          Tables updated:     NONE
          Executing from:     EMISSARY SERVICES
          Special Notes:	  NONE
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
  000 11/01/14 JCO		    		Initial write
  001 11/18/15 AAB 					Changed reminder_list to reminders
  002 11/23/15 AAB 					Add Audit object
  003 04/29/16 AAB					Change Status message
  004 04/29/16 AAB 					Added version
  005 10/10/16 AAB 					Add DEBUG_FLAG
  006 07/27/17 JCO					Changed %i to execute; update ErrorHandler2
  007 08/17/17 JCO					Added UTC logic
  008 03/21/18 RJC					Added version code and copyright block
 ***********************************************************************/
drop program vigilanz_get_health_maint go
create program vigilanz_get_health_maint
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		,"Username" = ""
		,"Person ID" = 0.0
		,"Start Date" = "1900-JAN-01 00:00:00"
		,"End Date" = "2100-DEC-31 59:59:59"
		,"Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, USERNAME, PERSONID, STARTDATE, ENDDATE, DEBUG_FLAG   ;005

/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2" ;008
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
 
free record req_in
record req_in (
  1 eval_start_dt_tm = dq8
  1 eval_end_dt_tm = dq8
  1 location_cd = f8
  1 prsnl_id = f8
  1 override_relationship = i2
  1 person [*]
    2 person_id = f8
    2 sex_cd = f8
    2 use_sex = i2
    2 birth_dt_tm = dq8
    2 use_birth_dt_tm = i2
    2 use_problems = i2
    2 problem [*]
      3 nomenclature_id = f8
      3 life_cycle_status_cd = f8
      3 organization_id = f8
    2 use_diagnoses = i2
    2 diagnosis [*]
      3 nomenclature_id = f8
      3 diag_type_cd = f8
      3 organization_id = f8
    2 use_procedures = i2
    2 procedure [*]
      3 procedure_id = f8
      3 nomenclature_id = f8
      3 proc_prsnl_id = f8
      3 proc_prsnl_name = vc
      3 active_ind = i2
      3 proc_dt_tm = dq8
      3 text = vc
      3 organization_id = f8
  1 allow_recommendation_server_ind = i2
)
 
free record health_maint_reply_out
record health_maint_reply_out
(
  1 patient_id = f8
  1 reminder_cnt = i4
  1 reminders[*]
    2 id = f8
    2 name = vc
    2 status = vc
    2 due_dt_tm = dq8
    2 start_dt_tm = dq8
    2 end_dt_tm = dq8
    2 last_sat_dt_tm = dq8
    2 last_sat_provider_id = f8
    2 last_sat_provider_name = vc
    2 priority = vc
    2 comment = vc
    2 frequency = vc
    2 frequency_unit = vc
    2 histories [*]
    	3 id = f8
    	3 name = vc
    	3 code = f8
    	3 reason = vc
    	3 reason_cd = f8
    	3 provider_id = f8
    	3 provider_name = vc
    	3 action_dt_tm = dq8
    	3 comment = vc
 1 audit
  2 user_id	= f8
  2 user_firstname = vc
  2 user_lastname = vc
  2 patient_id = f8
  2 patient_firstname = vc
  2 patient_lastname = vc
  2 service_version			= vc	;004
;006 %i cclsource:status_block.inc
/*006 begin */
  1 status_data
    2 status = c1
    2 subeventstatus[1]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
      3 Code = c4
      3 Description = vc
/*006 end */
)
 
record rep_out (
  1 person [*]
    2 person_id = f8
    2 long_blob_id = f8
    2 qualify_until_dt_tm = dq8
    2 reminder [*]
      3 schedule_id = f8
      3 series_id = f8
      3 expectation_id = f8
      3 step_id = f8
      3 status_flag = i2
      3 effective_start_dt_tm = dq8
      3 valid_start_dt_tm = dq8
      3 valid_end_dt_tm = dq8
      3 recommend_start_age = i4
      3 recommend_end_age = i4
      3 recommend_due_dt_tm = dq8
      3 over_due_dt_tm = dq8
      3 latest_postponed_dt_tm = dq8
      3 alternate_exp_available = i2
      3 last_sat_dt_tm = dq8
      3 last_sat_prsnl_id = f8
      3 last_sat_prsnl_name = vc
      3 last_sat_comment = vc
      3 last_sat_organization_id = f8
      3 encounter_id = f8
      3 frequency_value = i4
      3 frequency_unit_cd = f8
      3 has_frequency_modification = i2
      3 has_due_date_modification = i2
      3 system_frequency_value = i4
      3 system_frequency_unit_cd = f8
      3 recommendation_id = f8
      3 expectation_ftdesc = vc
      3 has_expectation_modification = i2
      3 near_due_dt_tm = dq8
      3 expectation_name = vc
    2 hmrecord [*]
      3 modifier_id = f8
      3 modifier_type_cd = f8
      3 modifier_type_mean = vc
      3 clinical_event_id = f8
      3 order_id = f8
      3 procedure_id = f8
      3 schedule_id = f8
      3 series_id = f8
      3 expectation_id = f8
      3 step_id = f8
      3 status_flag = i2
      3 modifier_dt_tm = dq8
      3 next_due_dt_tm = dq8
      3 recorded_dt_tm = dq8
      3 recorded_for_prsnl_id = f8
      3 recorded_for_prsnl_name = vc
      3 reason_cd = f8
      3 reason_disp = vc
      3 comment = vc
      3 created_prsnl_id = f8
      3 created_prsnl_name = vc
      3 organization_id = f8
      3 encounter_id = f8
      3 status_ind = i2
      3 recommendation_id = f8
      3 recommendation_action_id = f8
      3 expectation_ftdesc = vc
      3 adr [*]
        4 reltn_entity_id = f8
        4 reltn_entity_all_ind = i2
      3 appointment_id = f8
      3 expectation_name = vc
    2 schedule_reltn [*]
      3 schedule_id = f8
      3 mode_flag = i2
    2 series [*]
      3 series_mean = vc
      3 sched_mean = vc
      3 qualify_flag = i2
      3 explanation = vc
  1 person_org_sec_on = i2
  1 valid_as_of = dq8
  1 coherency_active_ind = i2
  1 status_data
    2 status = c1
    2 status_value = i4
    2 subeventstatus [1 ]
      3 operationname = c25
      3 operationstatus = c1
      3 targetobjectname = c25
      3 targetobjectvalue = vc
)
set health_maint_reply_out->status_data->status = "F"
 
/*************************************************************************
; DECLARE & INITIALIZE VARIABLES
**************************************************************************/
declare lAPP_ID 					= i4 with protect, constant(966300)
declare lTASK_ID 					= i4 with protect, constant(966310)
declare lREQUEST_ID 				= i4 with protect, constant(966307) ;pco_get_hm_recommendations_two
declare dPrsnlID					= f8 with protect, noconstant(0)
declare x 							= i4 with noconstant(0),protect
declare y 							= i4 with noconstant(0),protect
declare z 							= i4 with noconstant(0),protect
declare pSize						= i4 with noconstant(0),protect
declare rSize						= i4 with noconstant(0),protect
declare hSize						= i4 with noconstant(0),protect
declare sectionStartDtTm 			= dq8 with protect, noconstant(cnvtdatetime(curdate, curtime3))
declare sUsername					= vc with protect, noconstant("")
declare dPersonID  					= f8 with protect, noconstant(0.0)
declare sFromDate					= vc with protect, noconstant("")
declare sToDate						= vc with protect, noconstant("")
declare iRet						= i2 with protect, noconstant(0) 	;002
declare idebugFlag					= i2 with protect, noconstant(0) ;005
declare UTCmode						= i2 with protect, noconstant(0);007
declare UTCpos 						= i2 with protect, noconstant(0);007
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
set sUsername						= $USERNAME
set dPersonID   					= cnvtint($PERSONID)
set sFromDate						= trim($STARTDATE, 3)
set sToDate							= trim($ENDDATE, 3)
set idebugFlag						= cnvtint($DEBUG_FLAG)  ;005
set UTCmode							= CURUTC ;007
set UTCpos							= findstring("Z",sFromDate,1,0);007
 
 
if(idebugFlag > 0)
 
	call echo(build("sUsername: ", sUsername))
	call echo(build("dPersonID: ", dPersonID))
	call echo(build("sFromDate: ", sFromDate))
	call echo(build("sToDate: ", sToDate))
	call echo(build("UTC MODE -->",UTCmode));007
 	call echo(build("UTC POS -->",UTCpos));007
 
 
endif
 
 
/****************************************************************************
;INCLUDES
****************************************************************************/
;006 %i snsro_common.inc
execute snsro_common
 
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetHealthMaint(null)			= null with protect
declare PostAmble(null)					= null with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
	set iRet = PopulateAudit(sUserName, dPersonID, health_maint_reply_out, sVersion)   ;004    ;002
 
	if(iRet = 0)  ;002
		call ErrorHandler2("VALIDATE", "F", "HEALTH MAINT", "Invalid User for Audit.",
		"1001", build("UserId is invalid: ",sUserName), health_maint_reply_out)	;006
		go to EXIT_SCRIPT
 
	endif
 
call GetHealthMaint(null)
call PostAmble(null)
 
if(size(health_maint_reply_out->reminders,5) > 0)  ;003 +
 	call ErrorHandler("EXECUTE", "S", "HEALTH MAINT", "Success retrieving health mainteance activity data", health_maint_reply_out )
else
	call ErrorHandler("EXECUTE", "Z", "HEALTH MAINT", "No records found for this patient", health_maint_reply_out )
endif  ;003 -
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT

/*************************************************************************
; RETURN JSON
**************************************************************************/
 
	set JSONout = CNVTRECTOJSON(health_maint_reply_out)
 
if(idebugFlag > 0)
 
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_health_maint.json")
	call echo(build2("_file : ", _file))
	call echojson(health_maint_reply_out, _file, 0)
    call echorecord(health_maint_reply_out)
	call echo(JSONout)
 
endif
 
    if(validate(_MEMORY_REPLY_STRING))
		set _MEMORY_REPLY_STRING = trim(JSONout,3)
	endif
	
#EXIT_VERSION
/*************************************************************************
;  Name: GetHealthMaint(null)
;  Description: Get Healthmaint data
;
**************************************************************************/
subroutine GetHealthMaint(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetHealthMaint Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
 
if($USERNAME > "")
	set dPrsnlID = GetPrsnlIDfromUserName($USERNAME)
else
	set dPrsnlID = reqinfo->updt_id
endif
 
if(dPrsnlID = 0)
	call ErrorHandler2("VALIDATE", "F", "HEALTH MAINT",
			build("USERNAME: ",CNVTSTRING($USERNAME)," & REQINFO->UPDT_ID: "
				,reqinfo->updt_id," not valid."),
				"1001", build("USERNAME: ",CNVTSTRING($USERNAME)," & REQINFO->UPDT_ID: "
				,reqinfo->updt_id," not valid."), health_maint_reply_out)
	go to EXIT_SCRIPT
endif
 
if($PERSONID = 0)
	call ErrorHandler2("VALIDATE", "F", "HEALTH MAINT",
			build("Person ID is not valid: ",CNVTSTRING($PERSONID)),
			"2055", "Missing required field: PatientId", health_maint_reply_out)
	go to EXIT_SCRIPT
endif
 
/*007 UTC begin */
 if (UTCmode = 1 and UTCpos > 0)
	set startDtTm = cnvtdatetimeUTC(sFromDate) ;;;
	if (sToDate = "")
	;set endDtTm2 = cnvtdatetime(cnvtdatetime(curdate,curtime3))
		set endDtTm = cnvtdatetimeUTC(cnvtdatetimeUTC(curdate,curtime3-60))
	else
		set endDtTm = cnvtdatetimeUTC(sToDate)
	endif
else
	set startDtTm = cnvtdatetime(sFromDate)
	if (sToDate = "")
	;set endDtTm2 = cnvtdatetime(cnvtdatetime(curdate,curtime3))
		set endDtTm = cnvtdatetime(cnvtdatetime(curdate,curtime3-60))
	else
		set endDtTm = cnvtdatetime(sToDate)
	endif
endif
/*007 UTC end */
 
set req_in->eval_start_dt_tm =startDtTm	;007
set req_in->eval_end_dt_tm = endDtTm ;007
set req_in->location_cd = 0			;Location code from cs200 (optional) - not used right now
set req_in->prsnl_id = dPrsnlID 	;Prsnl ID derived from USERNAME on input
set req_in->override_relationship = 0
set stat = alterlist(req_in->person, 1)
set req_in->person[1].person_id = $PERSONID	;Person ID derived from PERSONID on input
set req_in->person[1].use_sex = 0
set req_in->person[1].birth_dt_tm = cnvtdatetime("0000-00-00 00:00:00")
set req_in->person[1].use_birth_dt_tm = 0
set req_in->person[1].use_problems = 0
set req_in->person[1].use_diagnoses = 0
set req_in->person[1].use_procedures = 0
set req_in->allow_recommendation_server_ind = 1
 
;call echorecord(req_in)
set stat = tdbexecute(lAPP_ID,lTASK_ID,lREQUEST_ID,"REC",req_in,"REC",rep_out)
;call echorecord(rep_out)
 
set health_maint_reply_out->status_data.status = rep_out->status_data.status
 
 
if(idebugFlag > 0)
 
	call echo(concat("GetHealthMaint Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
end
 
 
/*************************************************************************
;  Name: PostAmble(null)
;  Description: Iterate through health maintenance reminders list and
;				populate additional data elements.
;
**************************************************************************/
subroutine PostAmble(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("PostAmble Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
 
	;Set person size for 966307 reply
	set pSize = size(rep_out->person,5)
	;Check size of person list from 966307 reply
	if(pSize > 0)
 
		set health_maint_reply_out->patient_id = rep_out->person[1].person_id
 
		;Set reminder size for person[1] only -- only one patient will have data
		set rSize = size(rep_out->person[1].reminder,5)
		set health_maint_reply_out->reminder_cnt = rSize
 
		;Set history size for person[1] only -- only one patient will have data
		set hSize = size(rep_out->person[1].hmrecord,5)
 
		;Check size of reminder list from 966307 reply
		if(rSize > 0)
			set stat = alterlist(health_maint_reply_out->reminders,rSize)
			;iterate through reminder list and populate health_maint_reply
			for (x=0 to rSize)
				;reset history count variable
				set hCnt = 0
				set expId = rep_out->person[1]->reminder[x].expectation_id
 
				set health_maint_reply_out->reminders[x].id = expId
				set health_maint_reply_out->reminders[x].name = rep_out->person[1]->reminder[x].expectation_name
				set health_maint_reply_out->reminders[x].due_dt_tm = rep_out->person[1]->reminder[x].over_due_dt_tm
				set health_maint_reply_out->reminders[x].start_dt_tm = rep_out->person[1]->reminder[x].valid_start_dt_tm
				set health_maint_reply_out->reminders[x].end_dt_tm = rep_out->person[1]->reminder[x].valid_end_dt_tm
				set health_maint_reply_out->reminders[x].last_sat_dt_tm = rep_out->person[1]->reminder[x].last_sat_dt_tm
				set health_maint_reply_out->reminders[x].last_sat_provider_id = rep_out->person[1]->reminder[x].last_sat_prsnl_id
				set health_maint_reply_out->reminders[x].last_sat_provider_name = rep_out->person[1]->reminder[x].last_sat_prsnl_name
				if(rep_out->person[1]->reminder[x].frequency_value > 0)
					set health_maint_reply_out->reminders[x].frequency =
						cnvtstring(rep_out->person[1]->reminder[x].frequency_value)
					set health_maint_reply_out->reminders[x].frequency_unit =
						UAR_GET_CODE_DISPLAY(rep_out->person[1]->reminder[x].frequency_unit_cd)
				endif
				;iterate through hmRecords to match history to reminders
				for(y=1 to hSize)
					;math hmRecord to Reminder record
					if(expId = rep_out->person[1]->hmrecord[y].expectation_id)
						set hCnt = hCnt + 1
						;call echo(build("hCnt: ",hCnt))
						;increment history count variable
						set stat = alterlist(health_maint_reply_out->reminders[x].histories, hCnt)
						set health_maint_reply_out->reminders[x].status =
								UAR_GET_CODE_DISPLAY(rep_out->person[1]->hmrecord[y].modifier_type_cd)
						set health_maint_reply_out->reminders[x]->histories[hCnt].id = rep_out->person[1]->hmrecord[y].modifier_id
						;set health_maint_reply_out->reminders[x]->histories[hCnt].name =
						set health_maint_reply_out->reminders[x]->histories[hCnt].code = rep_out->person[1]->hmrecord[y].modifier_type_cd
						set health_maint_reply_out->reminders[x]->histories[hCnt].reason = rep_out->person[1]->hmrecord[y].reason_disp
						set health_maint_reply_out->reminders[x]->histories[hCnt].reason_cd =
								rep_out->person[1]->hmrecord[y].reason_cd
						set health_maint_reply_out->reminders[x]->histories[hCnt].provider_id =
								rep_out->person[1]->hmrecord[y].recorded_for_prsnl_id
						set health_maint_reply_out->reminders[x]->histories[hCnt].provider_name =
								rep_out->person[1]->hmrecord[y].recorded_for_prsnl_name
						set health_maint_reply_out->reminders[x]->histories[hCnt].action_dt_tm =
								rep_out->person[1]->hmrecord[y].modifier_dt_tm
						set health_maint_reply_out->reminders[x]->histories[hCnt].comment =
								rep_out->person[1]->hmrecord[y].comment
 
						;retrieve the name of the satisfier
						select into "nl:"
							hes.expect_sat_name
						from hm_expect_mod hem
							,hm_expect_sat hes
						plan hem
							where hem.expect_mod_id = rep_out->person[1].hmrecord[y].modifier_id
						join hes
							where hes.expect_sat_id = hem.expect_sat_id
						detail
							health_maint_reply_out->reminders[x]->histories[hCnt].name = hes.expect_sat_name
						with nocounter
					endif
				endfor
			endfor
 
			;query for expecation name
			select into "nl:"
				he.expectation_name
				,hes.priority_meaning
			from
				(dummyt d with seq = rSize)
				,hm_expect he
				,hm_expect_series hes
			plan d
			join he
				where he.expect_id = rep_out->person[1]->reminder[d.seq].expectation_id
			join hes
				where hes.expect_series_id = he.expect_series_id
			detail
				health_maint_reply_out->reminders[d.seq].name = he.expect_name
				health_maint_reply_out->reminders[d.seq].priority = hes.priority_meaning
			with nocounter
		endif
 
	endif
 
if(idebugFlag > 0)
 
	call echo(concat("PostAmble Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
end go
 
 
