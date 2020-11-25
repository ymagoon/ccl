/*~BB~**********************************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

  ~BE~***********************************************************************************/
/*****************************************************************************************
      Source file name:     snsro_post_calc_obs.prg
      Object name:          vigilanz_post_calc_obs
      Program purpose:      POST a new calculated observation and it's components in millennium
      Tables read:          NONE
      Tables updated:       CLINICAL_EVENT
      Executing from:       MPages Discern Web Service
      Special Notes:      NONE
******************************************************************************/
 /****************************************************************************
 *                   MODIFICATION CONTROL LOG                      			 *
 *****************************************************************************
 Mod Date     Engineer            	Comment                            	 	 *
 --- -------- ------------------- 	-----------------------------------------*
 001 12/6/19  STV					Initial Write
 002 12/17/19 DSH                   Added calculation of the result and the ability
                                    to write equation component comments.
 003 01/13/20 STV                   Added error check if there is too many or not all
 										equation compontnets
 004 01/21/20 DSH					Adjustment to allow number calculations
 005 01/29/20 STV                   Adjustment for reference numbers to be written
 006 02/06/20 STV                   Adding component field to reply out and taking out error check for component number
/*****************************************************************************/
drop program vigilanz_post_calc_obs go
create program vigilanz_post_calc_obs
 
prompt
		"Output to File/Printer/MINE" = "MINE" 	;Required
		, "Username" = ""        				;Required
		, "JSON Args" = ""						;Required
		, "DebugFlag" = ""						;Optional
 
with OUTDEV, USERNAME, JSON_ARGS, DEBUG_FLAG
 
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2" ;002
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
; Checks Privileges
free record 680501_req
 record 680501_req (
  1 patient_user_criteria
    2 user_id = f8
    2 patient_user_relationship_cd = f8
  1 event_privileges
    2 event_set_level
      3 event_sets [*]
        4 event_set_name = vc
      3 view_results_ind = i2
      3 add_documentation_ind = i2
      3 modify_documentation_ind = i2
      3 unchart_documentation_ind = i2
      3 sign_documentation_ind = i2
    2 event_code_level
      3 event_codes [*]
        4 event_cd = f8
      3 view_results_ind = i2
      3 document_section_viewing_ind = i2
      3 add_documentation_ind = i2
      3 modify_documentation_ind = i2
      3 unchart_documentation_ind = i2
      3 sign_documentation_ind = i2
)
 
free record 680501_rep
record 680501_rep (
  1 patient_user_information
    2 user_id = f8
    2 patient_user_relationship_cd = f8
    2 role_id = f8
  1 event_privileges
    2 view_results
      3 granted
        4 event_sets [*]
          5 event_set_name = vc
        4 event_codes [*]
          5 event_cd = f8
      3 status
        4 success_ind = i2
    2 document_section_viewing
      3 granted
        4 event_codes [*]
          5 event_cd = f8
      3 status
        4 success_ind = i2
    2 add_documentation
      3 granted
        4 event_sets [*]
          5 event_set_name = vc
        4 event_codes [*]
          5 event_cd = f8
      3 status
        4 success_ind = i2
    2 modify_documentation
      3 granted
        4 event_sets [*]
          5 event_set_name = vc
        4 event_codes [*]
          5 event_cd = f8
      3 status
        4 success_ind = i2
    2 unchart_documentation
      3 granted
        4 event_sets [*]
          5 event_set_name = vc
        4 event_codes [*]
          5 event_cd = f8
      3 status
        4 success_ind = i2
    2 sign_documentation
      3 granted
        4 event_sets [*]
          5 event_set_name = vc
        4 event_codes [*]
          5 event_cd = f8
      3 status
        4 success_ind = i2
  1 transaction_status
    2 success_ind = i2
    2 debug_error_message = vc
)
 
 
;arglist
free record arglist
record arglist(
	1 EquationId = vc
 	1 EncounterId = vc
 	1 CalculatedComponentId = vc
 	1 CalculatedValue = vc
 	1 ObservationDateTime = vc
 	1 SystemId = vc
 	1 ReferenceNumber = vc
 	1 OrderId = vc
 	1 EntryModeId = vc
 	1 CalculatedComponents[*]
 		2 ComponentId = vc
 		2 ObservationValue = vc
 		2 ObservationValueId = vc
 		2 ReferenceNumber = vc
 		2 SourceId = vc
 		2 Comment = vc
)
 
; Final reply
free record calcobs_reply_out
record calcobs_reply_out(
  1 obs_cnt = i4
  1 observations[*]
  	2 observation_id  = f8
  	2 component
  		3 id = f8
  		3 name = vc
  1 audit
    2 user_id            	= f8
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
 
 
;;inputs
free record input
record input(
	1 sUserName	= vc
	1 dPatientId = f8
	1 dEncounterId = f8
	1 dOrderId	= f8
	1 dClinicianId	= f8
	1 dCalculatedComponentId = f8
	1 dCalcTaskAssayCd = f8
 	1 sCalculatedValue = vc
	1 dCalculatedResultUnitCd = f8
 	1 qObservationDateTime = dq8
 	1 dSystemId = f8
 	1 dSourceId = f8
 	1 sReferenceNumber = vc
 	1 dEntryModeId =f8
 	1 dEventClassCd = f8
 	1 dVersionNbr = f8
 	1 sEquation = gvc
 	1 sEquationStrRaw = vc
 	1 sPostFixEquation = vc
 	1 dNormalcyCd = f8
 	1 dNomenclatureId = f8
 	1 sTaskMnemonic =  vc
 	1 dEquationId = f8
 	1 comp_cnt = i4
 	1 Components[*]
 		2 dComponentId = f8
 		2 dNomenclatureId = f8
 		2 dTaskAssayCd = f8
 		2 dEventClassCd = f8
 		2 dSourceId = f8
 		2 sObsVal = vc
 		2 sComment = vc
		2 iCommentSize = i4
 		2 dSequence = f8
 		2 sMnemonic = vc
		2 sShort_string = vc
		2 sDescriptor = vc
		2 dVersionNbr = f8
		2 sReferenceNumber = vc
		2 dNormalcyCd = f8
		2 dResultVal = f8
		2 sTaskMnemonic =  vc
		2 eq_comp_name = vc
		2 found_helper = i2
		2 dResultUnitCd = f8
		2 result_type
			3 coded_ind = i2
			3 numeric_ind = i2
)
 
/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
declare sUserName = vc
declare sJsonArgs			= gvc with protect, noconstant("")
declare iDebugFlag = i2
 
declare time_zone = i4
declare num = i4
 
;constans
declare c_error_handler 				= vc with protect, constant("POST CALCULATED OBSERVATION")
declare c_active_record_status_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",48,"ACTIVE"))
declare c_auth_result_status_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",8,"AUTH"))
declare c_perform_action_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",21,"PERFORM"))
declare c_verify_action_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",21,"VERIFY"))
declare c_completed_action_status_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",103,"COMPLETED"))
declare c_calculated_source_cd          = f8 with protect, constant(uar_get_code_by("MEANING",30200,"CALCULATED"))
declare c_clinician_source_cd			= f8 with protect, constant(uar_get_code_by("MEANING",30200,"CLINICIAN"))
declare c_rescomment_note_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",14,"RES COMMENT"))
declare c_rtf_note_format_cd			= f8 with protect, constant(uar_get_code_by("MEANING",23,"RTF"))
declare c_unknown_entry_method_cd		= f8 with protect, constant(uar_get_code_by("MEANING",13,"UNKNOWN"))
declare c_ocf_compression_cd			= f8 with protect, constant(uar_get_code_by("MEANING",120,"OCFCOMP"))
 
; Code Set 53 - Event Class
declare c_txt_event_class_cd = f8 with protect, constant(uar_get_code_by("MEANING",53,"TXT"))
declare c_num_event_class_cd = f8 with protect, constant(uar_get_code_by("MEANING",53,"NUM"))
 
; Code Set 289 - DTA Result Type
declare c_result_type_text_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"1"))
declare c_result_type_alpha_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"2"))
declare c_result_type_numeric_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"3"))
declare c_result_type_interp_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"4"))
declare c_result_type_multi_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"5"))
declare c_result_type_date_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"6"))
declare c_result_type_freetext_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"7"))
declare c_result_type_calculation_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"8"))
declare c_result_type_on_line_code_set_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"9"))
declare c_result_type_time_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"10"))
declare c_result_type_date_time_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"11"))
declare c_result_type_read_only_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"12"))
declare c_result_type_count_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"13"))
declare c_result_type_provider_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"14"))
declare c_result_type_orc_select_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"15"))
declare c_result_type_inventory_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"16"))
declare c_result_type_bill_only_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"17"))
declare c_result_type_yes_no_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"18"))
declare c_result_type_date_time_time_zone_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"19"))
declare c_result_type_alpha_freetext_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"21"))
declare c_result_type_multi_alpha_freetext_cd = f8 with protect, constant(uar_get_code_by("MEANING",289,"22"))
 
; Code Set 14113
declare c_result_format_numeric_cd = f8 with protect, constant(uar_get_code_by("MEANING",14113,"NUMERIC"))
declare c_result_format_alpha_cd = f8 with protect, constant(uar_get_code_by("MEANING",14113,"ALPHA"))
 
/*************************************************************************
; SET VARIABLES
**************************************************************************/
set sUserName = trim($USERNAME,3)
set sJsonArgs					= trim($JSON_ARGS,3)
set jrec						= cnvtjsontorec(sJsonArgs)
set iDebugFlag = cnvtint($DEBUG_FLAG)
 
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ErrorMsg(msg = vc, error_code = c4, type = vc) = null with protect
declare GetInputData(null) = null with protect; moves the arglist to inputrecord
declare ValidateParameters(null)       = null with protect; validates all the paremeters passed in and fills out inputs
declare GetEquationInfo(null) = null with protect;this fills out the input structure and equation
declare VerifyPrivs(null)		= i4 with protect  		; 680501 MSVC_CheckPrivileges
declare CalculateAndPopulateEquationResult(inputRec=vc(ref)) = null with protect ; Calculates the equation result dynamically
declare PostObservations(null) = null with protect; post the observations
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
 
 
 
;move arglist to input structure
call GetInputData(null)
 
set iRet = PopulateAudit(sUserName, input->dPatientId, calcobs_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2(c_error_handler, "F", "User is invalid", "Invalid User for Audit.",
			  "1001",build("Invalid user: ",sUserName), calcobs_reply_out)
	go to exit_script
endif
 
;Validate the Parameters
call ValidateParameters(null)
 
 
; Verify user has privileges to post observation
set iRet = VerifyPrivs(null)
if(iRet = 0)
	call ErrorHandler2(c_error_handler, "F", "VerifyPrivs", "User does not have privileges to update component id",
		"1003",build2("User does not have privileges for component id ",sEventCd), calcobs_reply_out);;need to fix here
	go to exit_script
endif
 
;get equation info
call GetEquationInfo(null)
 
;post the calculated values
call PostObservations(null)
 
;Set audit to successful
call ErrorHandler2(c_error_handler, "S", "Success", "Calculated Observation posted successfully.",
"0000", "Calculated Observation posted successfully.", calcobs_reply_out)
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(calcobs_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
	call echorecord(calcobs_reply_out)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_post_calc_obs.json")
	call echo(build2("_file : ", _file))
	call echojson(calcobs_reply_out, _file, 0)
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
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ErrorMsg Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	case (cnvtupper(type))
		of "M": ;Missing
			call ErrorHandler2(c_error_handler, "F", "Validate", build2("Missing required field: ",msg),
			error_code, build2("Missing required field: ",msg), calcobs_reply_out)
		of "I": ;Invalid
			call ErrorHandler2(c_error_handler, "F", "Validate", build2("Invalid input field: ",msg),
			error_code, build2("Invalid input field: ",msg), calcobs_reply_out)
		of "E": ;Execute
 			call ErrorHandler2(c_error_handler, "F", "Execute", msg, error_code, msg, calcobs_reply_out)
	endcase
 
	if(iDebugFlag > 0)
		call echo(concat("ErrorMsg Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	go to exit_script
end ;End Subroutine
 
/*************************************************************************
;  Name: GetInputData
;  Description: moves the arglist
**************************************************************************/
subroutine GetInputData(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetInputData Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	;moving arglist to input record
 
	;setting this as default value
    set input->dEntryModeId = uar_get_code_by("MEANING",29520,"WORKING_VIEW")
 
	set input->dEncounterId = cnvtreal(trim(arglist->EncounterId))
	set input->dCalculatedComponentId = cnvtreal(trim(arglist->CalculatedComponentId))
	set input->sCalculatedValue = trim(arglist->CalculatedValue)
	set input->dEntryModeId = cnvtreal(trim(arglist->EntryModeId))
	set input->dSystemId = cnvtreal(trim(arglist->SystemId,3))
	set input->sReferenceNumber = trim(arglist->ReferenceNumber)
	set input->qObservationDateTime = GetDateTime(arglist->ObservationDateTime)
	set input->dOrderId = cnvtreal(trim(arglist->OrderId))
	set input->dClinicianId = GetPrsnlIDFromUserName(sUserName)
	set input->dEquationId = cnvtreal(trim(arglist->EquationId,3))
 
	;setting timezone
	select into "nl:"
	from encounter e
		, time_zone_r t
	plan e where e.encntr_id = input->dEncounterId
	join t where t.parent_entity_name = "LOCATION"
		and t.parent_entity_id = e.loc_facility_cd
	head report
		time_zone =  datetimezonebyname(trim(t.time_zone,3))
	with nocounter
 
	;validate encounter
	set check = 0
	select into "nl:"
	from encounter e
	where e.encntr_id = input->dEncounterId
		and e.active_ind = 1
	head report
		check = 1
		input->dPatientId = e.person_id
	with nocounter
 
	if(check < 1)
		call ErrorHandler2(c_error_handler, "F", "EncounterId not Valid", "EncounterId not Valid.",
			  "9997","EncounterId not Valid", calcobs_reply_out)
		go to exit_script
	endif
 
	declare c_rtf_prefix = vc with protect, constant(concat("{\rtf1\ansi\ansicpg1252\deff0\deflang1033{\fonttbl"
		,"{\f0\fnil\fcharset0 Segoe UI;}}\viewkind4\uc1\pard\f0\fs20 "))
	declare c_rtf_suffix = vc with protect, constant("\par")
 
	;setting the components list
	set arg_comp_cnt = size(arglist->CalculatedComponents,5)
	select into "nl:"
	from (dummyt d with seq = arg_comp_cnt)
	plan d
	head report
		x = 0
		head d.seq
			x = x + 1
			stat = alterlist(input->Components,x)
			input->Components[x].dComponentId = cnvtreal(trim(arglist->CalculatedComponents[d.seq].ComponentId))
			input->Components[x].dNomenclatureId = cnvtreal(trim(arglist->CalculatedComponents[d.seq].ObservationValueId))
			input->Components[x].sObsVal = trim(arglist->CalculatedComponents[d.seq].ObservationValue)
			input->Components[x].sReferenceNumber = trim(arglist->CalculatedComponents[d.seq].ReferenceNumber)
 
			; Populate the comment as RTF (only if the comment text is provided)
			if (textlen(nullterm(trim(arglist->CalculatedComponents[d.seq].Comment))) > 0)
				input->Components[x].sComment = build2(c_rtf_prefix,
					nullterm(trim(arglist->CalculatedComponents[d.seq].Comment)),c_rtf_suffix)
				input->Components[x].iCommentSize = textlen(nullterm(input->Components[x].sComment))
			endif
 
			input->Components[x].dSourceId = cnvtreal(trim(arglist->CalculatedComponents[d.seq].SourceId))
			;flexing source_id
			if(input->Components[x].dSourceId < 1)
				input->Components[x].dSourceId = c_clinician_source_cd
			endif
 
	foot report
		input->comp_cnt = x
	with nocounter
 
	if(idebugFlag > 0)
		call echorecord(input)
		call echo(concat("GetInputData Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
end; subroutine
 
/*************************************************************************
;  Name: ValidateParameters(null)
;  Description:  Verify user has privileges to add observation
**************************************************************************/
subroutine ValidateParameters(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateParameters Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 
	;Validating the calculated_event_cd is calculated value first
	set c_calc_type_cd = uar_get_code_by("DISPLAYKEY",289,"CALCULATION")
 
	select into "nl:"
	from discrete_task_assay dta, reference_range_factor rrf
	plan dta
		where dta.event_cd = input->dCalculatedComponentId
			and dta.default_result_type_cd = c_calc_type_cd
			and dta.active_ind = 1
			and dta.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and dta.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
	join rrf
		where dta.task_assay_cd = rrf.task_assay_cd
			and rrf.active_ind = 1
			and rrf.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and rrf.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
	head report
		input->dCalcTaskAssayCd = dta.task_assay_cd
		input->dVersionNbr = dta.version_number
		input->sTaskMnemonic = trim(dta.mnemonic)
		input->dCalculatedResultUnitCd = rrf.units_cd
	with nocounter
 
	if(input->dCalcTaskAssayCd < 1)
		call ErrorHandler2(c_error_handler, "F", "Component is not Calculated Type", "Component is not Calculated Type.",
			  "9997",build("ComponentId: ",trim(cnvtstring(input->dCalculatedComponentId))), calcobs_reply_out)
		go to exit_script
	endif
 
	set input->dEventClassCd = c_num_event_class_cd ; putting in for now until we support other values
 
	; If a calculated value is provided then insure it's numeric
	set calc_val_size = size(trim(input->sCalculatedValue))
	if(calc_val_size > 0)
		;checks for num type right now since we support only number types now
		set numeric_check = isnumeric(input->sCalculatedValue)
		if(input->dEventClassCd != c_num_event_class_cd)
			call ErrorHandler2(c_error_handler, "F", "This CCL Package only supports Number Calculations"
					, "This CCL Package only supports Number Calculations", "9997","This CCL Package only supports Number Calculations"
					, calcobs_reply_out)
			go to exit_script
		elseif(numeric_check < 1)
			call ErrorHandler2(c_error_handler, "F", "This CCL Package only supports Number Calculations, Calculated Val not a number"
					, "This CCL Package only supports Number Calculations, Calculated Val not a number", "9997"
					,"This CCL Package only supports Number Calculations, Calculated Val not a number"
					, calcobs_reply_out)
			go to exit_script
 
		endif
	endif
 
	;validate entrymodeid
	if(input->dEntryModeId > 0)
		set iRet = GetCodeSet(input->dEntryModeId)
		if(iRet !=  29520)
			call ErrorMsg("EntryModeId","9999","I")
		endif
 
	endif
 
	;validate SystemId and ReferenceNumber
	if(input->dSystemId > 0)
		set iRet = GetCodeSet(input->dSystemId)
		if(iRet != 89)
			call ErrorMsg("SystemId","9999","I")
		else
			; Validate ReferenceNumber exists on the request and is unique on the table
			if(input->sReferenceNumber = "")
				call ErrorMsg("ReferenceNumber required when SystemId provided.","9999","E")
			else
				;Validate external doc id doesn't already exist
				set check = 0
				select into "nl:"
				from clinical_event ce
				where ce.reference_nbr = input->sReferenceNumber
					and ce.contributor_system_cd = input->dSystemId
				detail
					check = 1
				with nocounter
 
				if(check > 0)
					call ErrorMsg("The ReferenceNumber already exists. Please provide a unique number.","9999","E")
				endif
 
				;check the reference numbers of the components
				declare cmp_ref_number = vc
				set num = 0
				select into "nl:"
				from clinical_event ce
				plan ce
					where expand(num,0,input->comp_cnt, ce.reference_nbr,input->Components[num].sReferenceNumber)
				head report
					check = 1
					cmp_ref_nbr = ce.reference_nbr
				with nocounter
 
 
				if(check > 0)
					call ErrorMsg(build2("The Component ReferenceNumber: ", cmp_ref_nbr
						," already exists. Please provide a unique number.","9999","E"))
				endif
 
			endif
		endif
	else
		set input->dSystemId = reqdata->contributor_system_cd
 
		;Check reference number is null
		if(input->sReferenceNumber > " ")
			call ErrorMsg("A systemId is required for a reference number to be used.","9999","E")
		endif
	endif
 
	;getting component info
	select into "nl:"
	from discrete_task_assay dta
		, (dummyt d with seq = input->comp_cnt)
		, reference_range_factor rrf
	plan d
	join dta
		where dta.event_cd = input->Components[d.seq].dComponentId
			and dta.active_ind = 1
			and dta.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and dta.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
	join rrf
		where dta.task_assay_cd = rrf.task_assay_cd
			and rrf.active_ind = 1
			and rrf.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and rrf.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
	head d.seq
		input->Components[d.seq].dTaskAssayCd = dta.task_assay_cd
		input->Components[d.seq].dVersionNbr = dta.version_number
		input->Components[d.seq].sTaskMnemonic = trim(dta.mnemonic)
 
		if(dta.default_result_type_cd in (c_result_type_alpha_cd, c_result_type_multi_cd))
			input->Components[d.seq].dEventClassCd = c_txt_event_class_cd
			input->Components[d.seq].result_type.coded_ind = 1
			input->Components[d.seq].dResultUnitCd = rrf.units_cd
		elseif(dta.default_result_type_cd in (c_result_type_numeric_cd))
			input->Components[d.seq].dEventClassCd = c_num_event_class_cd
			input->Components[d.seq].result_type.numeric_ind = 1
			input->Components[d.seq].dResultUnitCd = rrf.units_cd
		endif
 
	with nocounter
 
	;validate task_assay_cd found
	declare bad_event_cd = f8
	select into "nl:"
	from (dummyt d with seq = input->comp_cnt)
	plan d
		where input->Components[d.seq].dTaskAssayCd = 0
	detail
		bad_event_cd = input->Components[d.seq].dComponentId
	with nocounter
 
	if(bad_event_cd > 0)
		call ErrorHandler2(c_error_handler, "F", "Could not find Task"
				,build2("Could not find task for Component: ",trim(cnvtstring(bad_event_cd))), "9997"
				,build2("Could not find task for Component: ",trim(cnvtstring(bad_event_cd)))
				, calcobs_reply_out)
		go to exit_script
 
	endif
 
 
	;Checking if all components for equation have been entered
	declare eq_parser_st = vc
	if(input->dEquationId > 0)
		set eq_parser_st = "e.equation_id =  input->dEquationId"
	else
		set eq_parser_st = "e.equation_id > 0.00"
	endif
 
	;choosing the equation if available
	free record e_components
	record e_components(
		1 qual_cnt = i4
		1 qual[*]
			2 task_assay_cd = f8
	)
	select into "nl:"
	from equation e
		 ,equation_component ec
	plan e
		where e.task_assay_cd = input->dCalcTaskAssayCd
 			and e.active_ind = 1
 			and parser(eq_parser_st)
 			;and e.default_ind = 1
 	join ec
 		where ec.equation_id = e.equation_id
 	order by ec.sequence
 	head report
 		x = 0
 		head ec.sequence
 			x = x + 1
 			stat = alterlist(e_components->qual,x)
 			e_components->qual[x].task_assay_cd = ec.included_assay_cd
 	foot report
 		e_components->qual_cnt = x
 	with nocounter
 
	if(e_components->qual_cnt < 1)
		call ErrorHandler2(c_error_handler, "F", "Invalid EquationId, Please Check ObervationComponentDiscovery"
				,"Invalid EquationId, Please Check ObervationComponentDiscovery", "9997"
				,"Invalid EquationId, Please Check ObervationComponentDiscovery"
				, calcobs_reply_out)
			go to exit_script
	endif
 
 	;check if too many components or not enough components
 	if(input->comp_cnt < e_components->qual_cnt)
 			call ErrorHandler2(c_error_handler, "F",
 				"Missing CalculationComponents, Please Check ObervationComponentDiscovery(hint: try using EquationId value)"
				,"Missing CalculationComponents, Please Check ObervationComponentDiscovery(hint: try using EquationId value)"
				, "9997"
				,"Missing CalculationComponents, Please Check ObervationComponentDiscovery(hint: try using EquationId value)"
				, calcobs_reply_out)
			go to exit_script
    elseif(input->comp_cnt > e_components->qual_cnt)
    		call ErrorHandler2(c_error_handler, "F"
    			, "Too Many CalculationComponents, Please Check ObervationComponentDiscovery(hint: try using EquationId value)"
				,"Too Many CalculationComponents, Please Check ObervationComponentDiscovery(hint: try using EquationId value)"
				, "9997"
				,"Too Many CalculationComponents, Please Check ObervationComponentDiscovery(hint: try using EquationId value)"
				, calcobs_reply_out)
			go to exit_script
 	endif
 
 	;for loop to check components are present
 
 	declare pos = i4
 	set check = 0
 	for(x = 1 to e_components->qual_cnt)
 		set num = 0
 		set pos = locateval(num,1,e_components->qual_cnt,e_components->qual[x].task_assay_cd,input->Components[num].dTaskAssayCd)
 
 		if(pos < 1)
 			set check = 1
 		endif
 	endfor
 
 	if(check > 0)
 		call ErrorHandler2(c_error_handler, "F", "CalculationComponents are not correct"
				,"CalculationComponents are not correct", "9997"
				,"CalculationComponents are not correct"
				, calcobs_reply_out)
		go to exit_script
 	endif
 
 	;check if value cds belong to alpha response
 	select into "nl:"
 	from (dummyt d with seq = input->comp_cnt)
 	    , reference_range_factor rrf
	 	,alpha_responses ar
	 	,nomenclature n
    plan d
    	where input->Components[d.seq].dTaskAssayCd > 0
    		and input->Components[d.seq].dNomenclatureId > 0
    join rrf
    	where rrf.task_assay_cd = input->Components[d.seq].dTaskAssayCd
    join ar
    	where ar.reference_range_factor_id = rrf.reference_range_factor_id
    		and ar.nomenclature_id = input->Components[d.seq].dNomenclatureId
    join n
    	where n.nomenclature_id = ar.nomenclature_id
    		and n.active_ind = 1
    		and n.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
    		and n.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
    order by d.seq
    head d.seq
    	input->Components[d.seq].dResultVal = ar.result_value
    	input->Components[d.seq].sMnemonic = trim(n.mnemonic)
    	input->Components[d.seq].sDescriptor = trim(n.short_string)
    	input->Components[d.seq].sShort_string = trim(n.short_string)
    	input->Components[d.seq].found_helper = 1
    	input->Components[d.seq].dEventClassCd = c_txt_event_class_cd
    with nocounter
 
    ;check if nomenclature value has been populated or error
    set check = 0
    for(x = 1 to input->comp_cnt)
    	if(input->Components[x].dNomenclatureId > 0 and input->Components[x].found_helper < 1)
    		set check = 1
    	endif
    endfor
 
    if(check > 0)
    	call ErrorHandler2(c_error_handler, "F", "ValueCode not valid with CalculationComponent"
				,"ValueCode not valid with CalculationComponent", "9997"
				,"ValueCode not valid with CalculationComponent"
				, calcobs_reply_out)
		go to exit_script
    endif
 
 
 
 	if(iDebugFlag > 0)
		call echo(concat("ValidateParameters Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
 
end
 
/*************************************************************************
;  Name: GetEquationInfo(null) = null
;  Description:  Verify user has privileges to add observation
**************************************************************************/
subroutine GetEquationInfo(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetEquationInfo Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare equation_string = vc;string of the equation
 
	select into "nl:"
	from equation e
		 ,equation_component ec
		 ,(dummyt d with seq = input->comp_cnt)
	plan d
	join e
		where e.task_assay_cd = input->dCalcTaskAssayCd
			and e.active_ind = 1
	join ec
		where ec.equation_id = e.equation_id
			and ec.included_assay_cd = input->Components[d.seq].dTaskAssayCd
	order d.seq
	head d.seq
		input->Components[d.seq].eq_comp_name = trim(ec.name)
		equation_string = trim(e.equation_description)
		input->sEquationStrRaw = trim(e.equation_description)
		input->sPostFixEquation = trim(e.equation_postfix)
		input->Components[d.seq].dSequence = cnvtreal(ec.sequence)
	with nocounter
 
	;do calcuation if obsval is blank
	if(textlen(nullterm(trim(input->sCalculatedValue))) < 1)
		call CalculateAndPopulateEquationResult(input)
	endif
 
	;build out the equation string
	set input->sEquation = build2(input->sTaskMnemonic," =")
	declare eq_str_1 = vc; this is before the "$!"
	for(x = 1 to input->comp_cnt)
		if( x < 2)
			set eq_str_1 = replace(equation_string,input->Components[x].eq_comp_name,input->Components[x].sTaskMnemonic)
		else
			set eq_str_1 = replace(eq_str_1,input->Components[x].eq_comp_name,input->Components[x].sTaskMnemonic)
		endif
	endfor
 
	;middle part of the equation
	declare eq_str_2 = vc
	set eq_str_2 = build2("$!",input->sCalculatedValue," =")
 
	;last part of the equation
	declare eq_str_3 = vc
	declare temp_eq_comp_str = vc
	declare temp_res_val_str = vc
	for(x = 1 to input->comp_cnt)
		if(input->Components[x].result_type.coded_ind = 1)
			set temp_res_val_str = trim(cnvtstring(input->Components[x].dResultVal),3)
			set temp_eq_comp_str = build2(input->Components[x].sMnemonic,"[",temp_res_val_str,".000000]")
		elseif(input->Components[x].result_type.numeric_ind = 1)
			set temp_eq_comp_str = trim(build2(cnvtreal(input->Components[x].sObsVal)), 3)
		endif
 
		if( x < 2)
			set eq_str_3 = replace(equation_string,input->Components[x].eq_comp_name,temp_eq_comp_str)
		else
			set eq_str_3 = replace(eq_str_3,input->Components[x].eq_comp_name,temp_eq_comp_str)
		endif
		;resetting vals to empty
		set temp_res_val_str = ""
		set temp_eq_comp = ""
	endfor
 
	;paste all 3 parts to build out the equation string
	set input->sEquation = build2(input->sEquation, eq_str_1," ",eq_str_2," ",eq_str_3)
 
 	if(iDebugFlag > 0)
		call echo(concat("GetEquationInfo Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
 
end
/*************************************************************************
;  Name: VerifyPrivs(null)
;  Description:  Verify user has privileges to add observation
**************************************************************************/
subroutine VerifyPrivs(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("VerifyPrivs Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	; Get personnel relationship to patient
	declare dPrsnlRelCd = f8
	select into "nl:"
	from encntr_prsnl_reltn epr
	where epr.encntr_id = input->dEncounterId
		and epr.prsnl_person_id = input->dClinicianId
	detail
		dPrsnlRelCd = epr.encntr_prsnl_r_cd
	with nocounter
 
	set iAPPLICATION = 600005
	set iTASK = 3202004
 	set iREQUEST = 680501
 
	declare iValidate = i2
	set 680501_req->user_id = input->dClinicianId
	set 680501_req->patient_user_relationship_cd = dPrsnlRelCd;here
	set stat = alterlist(680501_req->event_codes,1)
	set 680501_req->event_codes[1].event_cd = input->dCalculatedComponentId
	set 680501_req->event_privileges->event_code_level.add_documentation_ind = 1
	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",680501_req,"REC",680501_rep)
	set iValidate = 680501_rep->event_privileges->add_documentation.status.success_ind
 
	if(iDebugFlag > 0)
		call echo(concat("VerifyPrivs Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
 
 	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;   Name: CalculateAndPopulateEquationResult(inputRec=vc(ref)) = null
;   Description: Calculates the result for a postfix equation and populates the result
;   Parameter:
;       inputRec: A record structure with, at minimum, the following fields
;           record inputRec (
;               1 sCalculatedValue = vc
;               1 sPostFixEquation = vc
;               1 comp_cnt = i4
;               1 Components[*]
;                   2 dSequence = f8
;                   2 dResultVal = f8
;                   2 eq_comp_name = vc
;           )
**************************************************************************/
subroutine CalculateAndPopulateEquationResult(inputRec)
    if (iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("CalculateAndPopulateEquationResult Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
        call echo(concat('Performing calculation for postfix equation: "', trim(inputRec->sPostFixEquation, 3), '"'))
	endif
 
    declare equation_string = vc with protect, noconstant(nullterm(trim(inputRec->sPostFixEquation,3)))
    if (textlen(nullterm(equation_string)) < 1)
        call ErrorHandler2(c_error_handler, "F", "CalculateAndPopulateEquationResult",
            "Invalid postfix equation",
            "9999", "Invalid postfix equation", inputRec)
            go to exit_script
    endif
 
    free record postfix_tokens
    record postfix_tokens (
        1 token_count = i4
        1 tokens[*]
            2 token_display = vc
            2 token_value = f8
            2 type_flag = i4
            2 component_sequence = i4
    )
 
    declare c_separator = vc with protect, constant("|")
    declare c_token_type_unknown = i4 with protect, constant(0)
    declare c_token_type_constant = i4 with protect, constant(1)
    declare c_token_type_component = i4 with protect, constant(2)
    declare c_token_type_operator = i4 with protect, constant(3)
    declare c_token_type_square_root = i4 with protect, constant(4)
    declare c_token_add = vc with protect, constant("+")
    declare c_token_subtract = vc with protect, constant("-")
    declare c_token_multiply = vc with protect, constant("*")
    declare c_token_divide = vc with protect, constant("/")
 
    declare current_pos = i4 with protect, noconstant(0)
    declare next_pos = i4 with protect, noconstant(0)
    declare token_display = vc with protect, noconstant("")
    declare component_sequence = i4 with protect, noconstant(1)
    declare component_index = i4 with protect, noconstant(0)
    declare token_index = i4 with protect, noconstant(1)
    declare operand1 = f8 with protect, noconstant(0.00)
    declare operand2 = f8 with protect, noconstant(0.00)
    declare numeric_result = f8 with protect, noconstant(0.00)
 
    set current_pos = 1
    set next_pos = findstring(c_separator, equation_string, current_pos)
 
    ; Create the initial postfix tokens
    while (next_pos > 0)
        set token_display = trim(substring(current_pos, next_pos-current_pos, equation_string))
 
        ; Add the new token
        set postfix_tokens->token_count += 1
        set stat = alterlist(postfix_tokens->tokens, postfix_tokens->token_count)
        set postfix_tokens->tokens[postfix_tokens->token_count].token_display = trim(token_display, 3)
        set postfix_tokens->tokens[postfix_tokens->token_count].type_flag = c_token_type_unknown
 
        ; Set the new positions
        set current_pos = next_pos + 1
        set next_pos = findstring(c_separator, equation_string, current_pos)
    endwhile
 
    if (iDebugFlag > 0)
        call echo(concat("Created initial postfix equation tokens:"))
        call echorecord(postfix_tokens)
    endif
 
    ; Finalize the tokens
    for (token_index = 1 to postfix_tokens->token_count)
        set token_display = trim(postfix_tokens->tokens[token_index].token_display)
 
        if (iDebugFlag > 0)
            call echo(concat("Finalizing postfix equation token: ", trim(token_display, 3)))
        endif
 
        ; Constant token
        if (isnumeric(token_display) > 0)
            set postfix_tokens->tokens[token_index].token_value = cnvtreal(trim(token_display, 3))
            set postfix_tokens->tokens[token_index].type_flag = c_token_type_constant
        ; Component token
        elseif (inputRec->comp_cnt >= component_sequence
            and inputRec->Components[component_sequence].eq_comp_name = token_display)
            set postfix_tokens->tokens[token_index].type_flag = c_token_type_component
            set postfix_tokens->tokens[token_index].component_sequence = component_sequence
            set component_sequence += 1
        ; Standard operator
        elseif (token_display in (c_token_add, c_token_subtract, c_token_multiply, c_token_divide))
            set postfix_tokens->tokens[token_index].type_flag = c_token_type_operator
        ; Square root operator
        elseif (token_display in ("SQR"))
            set postfix_tokens->tokens[token_index].type_flag = c_token_type_square_root
        ;Unknown token
        else
            free record postfix_tokens
 
            call ErrorHandler2(c_error_handler, "F", "CalculateAndPopulateEquationResult",
                "Invalid postfix equation token",
                "9999", "Invalid postfix equation token", inputRec)
                go to exit_script
        endif
    endfor
 
    if (iDebugFlag > 0)
        call echo(concat("Finalized postfix equation tokens:"))
        call echorecord(postfix_tokens)
    endif
 
    free record stack
    record stack (
        1 size = i4
        1 elements[*]
            2 element = f8
    )
 
    ; Calculate the postfix equation
    for (token_index = 1 to postfix_tokens->token_count)
        set token_display = trim(postfix_tokens->tokens[token_index].token_display)
        set token_value = postfix_tokens->tokens[token_index].token_value
        set component_sequence = postfix_tokens->tokens[token_index].component_sequence
        set type_flag = postfix_tokens->tokens[token_index].type_flag
 
        case (type_flag)
            ; Process a constant type token
            of value(c_token_type_constant):
                ; Push the constant onto the stack
                set stack->size = stack->size + 1
                set stat = alterlist(stack->elements, stack->size)
                set stack->elements[stack->size].element = token_value
 
                if (iDebugFlag > 0)
                    call echo(concat("Processed a constant postfix equation token: ",
                    build2(stack->elements[stack->size].element)))
 
                    call echorecord(stack)
                endif
            ; Process a component type token
            of value(c_token_type_component):
                ; Find the component with the given sequence
                set component_index = locateval(component_index, 1, inputRec->comp_cnt,
                    cnvtreal(component_sequence), inputRec->Components[component_index].dSequence)
                if (component_index > 0)
                    ; Push the numeric value of the component onto the stack
                    set stack->size = stack->size + 1
                    set stat = alterlist(stack->elements, stack->size)
                    set stack->elements[stack->size].element =
                        inputRec->Components[component_index].dResultVal
 
                    if (iDebugFlag > 0)
                        call echo(concat("Processed a component postfix equation token: ",
                        build2(stack->elements[stack->size].element)))
 
                        call echorecord(stack)
                    endif
                else
                    free record postfix_tokens
                    free record stack
 
                    call ErrorHandler2(c_error_handler, "F", "CalculateAndPopulateEquationResult",
                        "Cannot find component sequence",
                        "9999", "Cannot find component sequence", inputRec)
                        go to exit_script
                endif
            ; Process a binary operator type token
            of value(c_token_type_operator):
                if (stack->size >= 2)
                    ; Pop the last two elements off of the stack
                    set operand2 = stack->elements[stack->size].element
                    set operand1 = stack->elements[stack->size-1].element
 
                    ; Prepare the stack for the result
                    set stack->size = stack->size - 1
                    set stat = alterlist(stack->elements, stack->size)
 
                    case (token_display)
                        of value(c_token_add):
                            set numeric_result = operand1 + operand2
                        of value(c_token_subtract):
                            set numeric_result = operand1 - operand2
                        of value(c_token_multiply):
                            set numeric_result = operand1 * operand2
                        of value(c_token_divide):
                            set numeric_result = operand1 / operand2
                        else
                            free record postfix_tokens
                            free record stack
 
                            call ErrorHandler2(c_error_handler, "F", "CalculateAndPopulateEquationResult",
                                "Unsupported operator",
                                "9999", "Unsupported operator", inputRec)
                                go to exit_script
                    endcase
 
                    set stack->elements[stack->size].element = numeric_result
 
                    if (iDebugFlag > 0)
                        call echo(concat("Processed an operator postfix equation token. Operand 1: ", build2(operand1),
                        " Operator: ", token_display,
                        " Operand 2: ", build2(operand2),
                        " Result: ", build2(stack->elements[stack->size].element)))
 
                        call echorecord(stack)
                    endif
                else
                    free record postfix_tokens
                    free record stack
 
                    call ErrorHandler2(c_error_handler, "F", "CalculateAndPopulateEquationResult",
                        "Insufficient number of operands",
                        "9999", "Insufficient number of operands", inputRec)
                        go to exit_script
                endif
            of value(c_token_type_square_root):
                if (stack->size >= 1)
                    set operand1 = stack->elements[stack->size].element
                    set stack->elements[stack->size].element = operand1**0.50
 
                    if (iDebugFlag > 0)
                        call echo(concat("Processed a square root postfix equation token. Operand 1: ", build2(operand1),
                        " Result: ", build2(stack->elements[stack->size].element)))
 
                        call echorecord(stack)
                    endif
                else
                    free record postfix_tokens
                    free record stack
 
                    call ErrorHandler2(c_error_handler, "F", "CalculateAndPopulateEquationResult",
                        "Insufficient number of operands",
                        "9999", "Insufficient number of operands", inputRec)
                        go to exit_script
                endif
            else
                free record postfix_tokens
                free record stack
 
                call ErrorHandler2(c_error_handler, "F", "CalculateAndPopulateEquationResult",
                    "Invalid token type flag",
                    "9999", "Invalid token type flag", inputRec)
                    go to exit_script
        endcase
    endfor
 
    set numeric_result = stack->elements[stack->size].element
    ; TODO - Ensure calculated value has the appropriate precision
    set inputRec->sCalculatedValue = cnvtstring(numeric_result)
 
    if (iDebugFlag > 0)
        call echo("Result was calculated and successfully populated.")
        call echorecord(inputRec)
 
		call echo(concat("CalculateAndPopulateEquationResult Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
    free record postfix_tokens
    free record stack
end ; Enc Subroutine CalculateAndPopulateEquationResult
 
/*************************************************************************
;  Name: PostObservations(null)
;  Description:  Posting of the set of observations
**************************************************************************/
subroutine PostObservations(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostObservations Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
		call echorecord(input)
	endif
 
	declare error_msg = vc
 	declare happ = i4
	declare htask = i4
	declare hstep = i4
	declare crmstatus = i2
 
	set error_msg = "None"
	set iApplication = 600005
	set iTask = 600108
	set iRequest = 1000071
	set time_zone = 75
	execute crmrtl
	execute srvrtl
 
	call echo ("Beginning the Application" )
	set crmstatus = uar_crmbeginapp (iApplication ,happ )
 
	if ((crmstatus = 0 ) )
		set crmstatus = uar_crmbegintask (happ ,iTask ,htask )
		if ((crmstatus != 0 ) )
			call uar_crmendapp (happ )
 
		endif
	endif
 
	if(htask > 0)
		call echo ("Beginning the Step" )
		set crmstatus = uar_crmbeginreq (htask ,"" ,iRequest ,hstep )
		if ((crmstatus != 0 ) )
			call uar_crmendapp (happ )
			call echo(concat ("BEGINREQ=" ,cnvtstring(crmstatus)),"9999","E")
		else
			;create request
			set hrequest = uar_crmgetrequest (hstep )
 
			;for loop to add req structre
			for(i = 1 to input->comp_cnt)
 
				set hreq = uar_srvadditem(hrequest,"req")
				set stat = uar_srvsetshort (hreq,"ensure_type", 1 )
 				set stat = uar_srvsetstring(hreq,"eso_action_meaning","ESOSKIP")
 				set stat = uar_srvsetshort (hreq,"ensure_type2", 64 )
 
 				;create clin event
 				set hce = uar_srvgetstruct (hreq ,"clin_event")
 
 				if(hce)
 					set stat = uar_srvsetlong (hce ,"view_level" ,1 )
 					set stat = uar_srvsetdouble(hce,"person_id", input->dPatientId)
					set stat = uar_srvsetdouble(hce,"encntr_id",input->dEncounterId)
					set stat = uar_srvsetdouble(hce,"contributor_system_cd",input->dSystemId)
					set stat = uar_srvsetstring(hce,"reference_nbr",nullterm(input->Components[i].sReferenceNumber))
					set stat = uar_srvsetdouble(hce,"event_class_cd",input->Components[i].dEventClassCd)
					set stat = uar_srvsetdouble(hce,"event_cd",input->Components[i].dComponentId)
					set stat = uar_srvsetdate(hce,"event_start_dt_tm",cnvtdatetime(input->qObservationDateTime))
					set stat = uar_srvsetdate(hce,"event_end_dt_tm",cnvtdatetime(input->qObservationDateTime))
					set stat = uar_srvsetdouble(hce,"task_assay_cd",input->Components[i].dTaskAssayCd)
					set stat = uar_srvsetdouble(hce,"record_status_cd",c_active_record_status_cd)
					set stat = uar_srvsetdouble(hce,"result_status_cd",c_auth_result_status_cd)
					set stat = uar_srvsetshort(hce,"authentic_flag",1)
					set stat = uar_srvsetshort(hce,"publish_flag",1)
					set stat = uar_srvsetshort (hce ,"event_start_tz",time_zone)
					set stat = uar_srvsetshort (hce ,"event_end_tz",time_zone)
					set stat = uar_srvsetdouble(hce,"replacement_event_id",input->Components[i].dSequence)
					set stat = uar_srvsetdouble (hce ,"entry_mode_cd",input->dEntryModeId)
					set stat = uar_srvsetdouble (hce ,"source_cd",input->Components[i].dSourceId)
					set stat =  uar_srvsetdouble (hce ,"task_assay_version_nbr" ,input->Components[i].dVersionNbr)
					set stat = uar_srvsetdouble(hce,"result_units_cd",input->Components[i].dResultUnitCd)
 
					; Write the event note
					if(input->Components[i].iCommentSize > 0)
						set henote = uar_srvadditem(hce,"event_note_list")
						if(henote)
							set stat = uar_srvsetdouble(henote,"note_type_cd",c_rescomment_note_type_cd)
							set stat = uar_srvsetdouble(henote,"note_format_cd",c_rtf_note_format_cd)
							set stat = uar_srvsetdouble(henote,"entry_method_cd",c_unknown_entry_method_cd)
							set stat = uar_srvsetdouble(henote,"note_prsnl_id",input->dClinicianId)
							set stat = uar_srvsetdate(henote,"note_dt_tm",cnvtdatetime(input->qObservationDateTime))
							set stat = uar_srvsetdouble(henote,"record_status_cd",c_active_record_status_cd)
							set stat = uar_srvsetdouble(henote,"compression_cd",c_ocf_compression_cd)
							set stat = uar_srvsetasis(henote,"long_blob",
								input->Components[i].sComment,input->Components[i].iCommentSize)
							set stat = uar_srvsetlong(henote,"note_tz",time_zone)
						else
							call ErrorMsg("Could not create henote.","9999","E")
						endif
					endif
				endif;hce clin event
 
					;for loop to add event_prsnl
					set ePrsnlSize = 2
					for(j = 1 to ePrsnlSize)
						set hprsnl = uar_srvadditem (hce ,"event_prsnl_list" )
						case(j)
							of 1: ;Perform
								set stat = uar_srvsetdouble(hprsnl,"action_type_cd",c_perform_action_type_cd)
								set stat = uar_srvsetdate(hprsnl,"action_dt_tm",cnvtdatetime(curdate,curtime3))
								set stat = uar_srvsetdouble(hprsnl,"action_prsnl_id",input->dClinicianId)
								set stat = uar_srvsetdouble(hprsnl,"action_status_cd",c_completed_action_status_cd)
								set stat = uar_srvsetlong(hprsnl,"action_tz",time_zone)
 
							of 2: ;Verify
								set stat = uar_srvsetdouble(hprsnl,"action_type_cd",c_verify_action_type_cd)
								set stat = uar_srvsetdate(hprsnl,"action_dt_tm",cnvtdatetime(curdate,curtime3))
								set stat = uar_srvsetdouble(hprsnl,"action_prsnl_id",input->dClinicianId)
								set stat = uar_srvsetdouble(hprsnl,"action_status_cd",c_completed_action_status_cd)
								set stat = uar_srvsetlong(hprsnl,"action_tz",time_zone)
 
						endcase
 
 
					endfor;end evetn prsnl
 
					if(input->Components[i].result_type.numeric_ind = 1)
						set hstring = uar_srvadditem (hce ,"string_result" )
						if(hstring)
							set stat = uar_srvsetstring(hstring,"string_result_text",nullterm(input->Components[i].sObsVal))
							set stat = uar_srvsetdouble(hstring,"string_result_format_cd",c_result_format_numeric_cd)
							set stat = uar_srvsetdouble(hstring,"unit_of_measure_cd",input->Components[i].dResultUnitCd)
						endif
					;coded_result struct
					elseif(input->Components[i].result_type.coded_ind = 1)
						set hcoded = uar_srvadditem(hce,"coded_result_list")
						if(hcoded)
							set stat = uar_srvsetshort (hcoded,"ensure_type", 2 )
							set stat = uar_srvsetlong(hcoded,"sequence_nbr",1)
							set stat = uar_srvsetdouble(hcoded,"nomenclature_id",input->Components[i].dNomenclatureId)
							set stat = uar_srvsetstring(hcoded,"mnemonic",nullterm(input->Components[i].sMnemonic))
							set stat = uar_srvsetstring(hcoded,"short_string",nullterm(input->Components[i].sShort_string))
							set stat = uar_srvsetstring(hcoded,"descriptor",nullterm(input->Components[i].sDescriptor))
							set stat = uar_srvsetdouble(hcoded,"unit_of_measure_cd",input->Components[i].dResultUnitCd)
						endif
					endif
			endfor ;end req struct for
 
 
			;create the calc val
			set hreq = uar_srvadditem(hrequest,"req")
			set stat = uar_srvsetshort (hreq,"ensure_type", 1 )
 			set stat = uar_srvsetstring(hreq,"eso_action_meaning","ESOSKIP")
 			set stat = uar_srvsetshort (hreq,"ensure_type2", 64 )
 
 			;create clin event
 				set hce = uar_srvgetstruct (hreq ,"clin_event")
 
 				if(hce)
 					set stat = uar_srvsetlong (hce ,"view_level" ,1 )
 					set stat = uar_srvsetdouble(hce,"person_id", input->dPatientId)
					set stat = uar_srvsetdouble(hce,"encntr_id",input->dEncounterId)
					set stat = uar_srvsetdouble(hce,"contributor_system_cd",input->dSystemId)
					set stat = uar_srvsetstring(hce,"reference_nbr",nullterm(input->sReferenceNumber))
					set stat = uar_srvsetdouble(hce,"event_class_cd",input->dEventClassCd);this is numeric class_cd
					set stat = uar_srvsetdouble(hce,"event_cd",input->dCalculatedComponentId);the event_cd
					set stat = uar_srvsetdate(hce,"event_start_dt_tm",cnvtdatetime(input->qObservationDateTime))
					set stat = uar_srvsetdate(hce,"event_end_dt_tm",cnvtdatetime(input->qObservationDateTime))
					set stat = uar_srvsetdouble(hce,"task_assay_cd",input->dCalcTaskAssayCd)
					set stat = uar_srvsetdouble(hce,"record_status_cd",c_active_record_status_cd)
					set stat = uar_srvsetdouble(hce,"result_status_cd",c_auth_result_status_cd)
					set stat = uar_srvsetshort(hce,"authentic_flag",1)
					set stat = uar_srvsetshort(hce,"publish_flag",1)
					set stat = uar_srvsetdouble (hce ,"normalcy_cd",-1.00)
					set stat = uar_srvsetshort (hce ,"event_start_tz",time_zone)
					set stat = uar_srvsetshort (hce ,"event_end_tz",time_zone)
					;set stat = uar_srvsetdouble(hce,"replacement_event_id",)
					set stat = uar_srvsetdouble (hce ,"entry_mode_cd",input->dEntryModeId);4071715
					set stat = uar_srvsetdouble (hce ,"source_cd",c_calculated_source_cd);this is calculated value
					set stat =  uar_srvsetdouble (hce ,"task_assay_version_nbr" ,input->dVersionNbr )
				endif;hce clin event
 
					;for loop to add event_prsnl
					set ePrsnlSize = 2
					for(j = 1 to ePrsnlSize)
						set hprsnl = uar_srvadditem (hce ,"event_prsnl_list" )
						case(j)
							of 1: ;Perform
								set stat = uar_srvsetdouble(hprsnl,"action_type_cd",c_perform_action_type_cd)
								set stat = uar_srvsetdate(hprsnl,"action_dt_tm",cnvtdatetime(curdate,curtime3))
								set stat = uar_srvsetdouble(hprsnl,"action_prsnl_id",input->dClinicianId)
								set stat = uar_srvsetdouble(hprsnl,"action_status_cd",c_completed_action_status_cd)
								set stat = uar_srvsetlong(hprsnl,"action_tz",time_zone)
 
							of 2: ;Verify
								set stat = uar_srvsetdouble(hprsnl,"action_type_cd",c_verify_action_type_cd)
								set stat = uar_srvsetdate(hprsnl,"action_dt_tm",cnvtdatetime(curdate,curtime3))
								set stat = uar_srvsetdouble(hprsnl,"action_prsnl_id",input->dClinicianId)
								set stat = uar_srvsetdouble(hprsnl,"action_status_cd",c_completed_action_status_cd)
								set stat = uar_srvsetlong(hprsnl,"action_tz",time_zone)
 
						endcase
 
 
					endfor;end evetn prsnl
 
				;calulated result list
 
				set hcalc = uar_srvadditem (hce ,"calculation_result_list")
				set stat = uar_srvsetstring(hcalc,"equation",nullterm(input->sEquation))
				set stat = uar_srvsetstring(hcalc,"calculation_result",input->sCalculatedValue)
				set stat = uar_srvsetdouble(hcalc,"unit_of_measure_cd",input->dCalculatedResultUnitCd)
 
				;contributer Link list
				for(z = 1 to input->comp_cnt)
					set hcntrb = uar_srvadditem (hcalc ,"contributor_link_list")
					set stat = uar_srvsetshort (hcntrb,"ensure_type", 2 )
					set stat = uar_srvsetshort (hcntrb,"type_flag", 3 )
					set stat = uar_srvsetdouble(hcntrb,"replacement_event_id",input->Components[z].dSequence)
				endfor
 
		endif;end hrequest
		; Execute request
		set crmstatus = uar_crmperform (hstep)
		if ((crmstatus = 0 ) )
			set hreply = uar_crmgetreply (hstep )
			if ((hreply > 0 ) )
 
				;Rep
				set rep_cnt = uar_srvgetitemcount(hreply,"rep")
				set stat = alterlist(calcobs_reply_out->observations,rep_cnt)
				if(rep_cnt > 0)
					for(x = 1 to rep_cnt)
						set hrep = uar_srvgetitem(hreply,"rep", x - 1)
 
						;Rb
						set rb_cnt = uar_srvgetitemcount(hrep,"rb_list")
							if(rb_cnt > 0)
						;for(i = 1 to rb_cnt);only returns one level here
							set hrb = uar_srvgetitem(hrep,"rb_list",0)
							set calcobs_reply_out->observations[x].observation_id = uar_srvgetdouble(hrb,"event_id")
						;endfor;rb_list for loop
							else
								call ErrorMsg("Rb_list is empty. Could not post administration event.","9997","E")
							endif
 
					endfor;rep for loop
				else
					call ErrorMsg("Rep list is empty. Could not post administration event.","9997","E")
				endif
			else
				call ErrorMsg("Failed to create hreply.","9997","E")
			endif
		else
			call ErrorMsg("Failed to create hreply.","9997","E")
		endif
 	endif
 
 		;getting component to event_ids
 		set calcobs_reply_out->obs_cnt = size(calcobs_reply_out->observations,5)
 		if(calcobs_reply_out->obs_cnt > 0)
 			select into "nl:"
 			from (dummyt d with seq = calcobs_reply_out->obs_cnt)
 				 ,clinical_event ce
 			plan d
 				where calcobs_reply_out->observations[d.seq].observation_id > 0
 			join ce
 				where ce.event_id = calcobs_reply_out->observations[d.seq].observation_id
 			head d.seq
 				 calcobs_reply_out->observations[d.seq].component.id = ce.event_cd
 				 calcobs_reply_out->observations[d.seq].component.name = trim(uar_get_code_display(ce.event_cd))
 			with nocounter
 		endif
 
	if(iDebugFlag > 0)
		call echo(concat("PostMedAdmin Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end
 
 
 
end
go
 
