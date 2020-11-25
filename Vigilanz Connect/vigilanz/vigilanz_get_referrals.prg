/***********************************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

************************************************************************************
      Source file name:  	snsro_get_referrals.prg
      Object name:       	vigilanz_get_referrals
      Program purpose:    	Gets Referral Information
      Executing from:   	MPages Discern Web Service
************************************************************************
                   MODIFICATION CONTROL LOG                      		
***********************************************************************
 Mod Date     Engineer             Comment                            
------------------------------------------------------------------
  001 12/19/17 RJC					Initial Write
  002 03/22/18 RJC					Added version code and copyright block
  003 03/30/19 RJC					Fixed issue where error is returned when no results exist  
***********************************************************************/
drop program vigilanz_get_referrals go
create program vigilanz_get_referrals
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username:" = ""        		;Required
		, "PatientId:" = ""				;Required
		, "Debug Flag:" = 0				;Optional
 
with OUTDEV, USERNAME, PATIENT_ID, DEBUG_FLAG

/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2" ;002
if($OUTDEV = "VERSION")
	go to exit_version
endif

/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common

/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record temp
record temp (
	1 referrals[*]
		2 order_id = f8
		2 patient_id = f8
		2 order_status_cd = f8
		2 order_provider_id = f8
		2 department_status_cd = f8
		2 encounter_id = f8
		2 department_name = vc
		2 order_comment_ind = i2
		2 order_comments = vc
		2 current_start_dt_tm = dq8
		2 projected_stop_dt_tm = dq8
		2 catalog_cd = f8
		2 synonym_id = f8
		2 catalog_type_cd = f8
		2 activity_type_cd = f8
		2 clinical_category_cd = f8
		2 oe_format_id = f8
		2 last_action_sequence = i4
		2 link_order_flag = i2
		2 link_nbr = f8
		2 linked_orders[*]
			3 id = f8
		2 procedures[*]
			3 order_id = f8
			3 description = vc
			3 active_ind = i2
		2 details[*]
			3 oe_field_id = f8
			3 oe_field_meaning_id = f8
			3 oe_field_value = f8
			3 oe_field_dt_tm = dq8
			3 oe_field_display_value = vc
			3 oe_field_meaning_disp = vc
			3 label_text = vc
			3 action_sequence = i4
			3 detail_sequence = i4
			3 updt_dt_tm = dq8
			3 updt_id = f8
		2 form_id = f8
		2 powerforms[*]
			3 dcp_forms_activity_id = f8
			3 dcp_forms_ref_id = f8
			3 description = vc
			3 task_id = f8
			3 beg_activity_dt_tm = dq8
			3 last_activity_dt_tm = dq8
			3 flags = i4
			3 form_event_id = f8
			3 sections[*]
				4 section_event_id = f8
				4 child_events[*]
					5 clinical_event_id = f8
					5 event_id = f8
					5 valid_until_dt_tm = dq8
					5 clinsig_updt_dt_tm = dq8
					5 view_level = i4
					5 order_id = f8
					5 catalog_cd = f8
					5 series_ref_nbr = vc
					5 person_id = f8
					5 encntr_id = f8
					5 encntr_financial_id = f8
					5 accession_nbr = vc
					5 contributor_system_cd = f8
					5 reference_nbr = vc
					5 parent_event_id = f8
					5 valid_from_dt_tm = dq8
					5 event_class_cd = f8
					5 event_cd = f8
					5 event_tag = vc
					5 event_reltn_cd = f8
					5 event_start_dt_tm = dq8
					5 event_end_dt_tm = dq8
					5 event_end_dt_tm_os = f8
					5 task_assay_cd = f8
					5 record_status_cd = f8
					5 result_status_cd = f8
					5 authentic_flag = i2
					5 inquire_security_cd = f8
					5 resource_group_cd = f8
					5 resource_cd = f8
					5 event_title_text = vc
					5 collating_seq = vc
					5 result_val = vc
					5 result_units_cd = f8
					5 result_time_units_cd = f8
					5 verified_dt_tm = dq8
					5 verified_prsnl_id = f8
					5 performed_dt_tm = dq8
					5 performed_prsnl_id = f8
					5 expiration_dt_tm = dq8
					5 updt_dt_tm = dq8
					5 updt_id = f8
					5 updt_cnt = i4
)
 
; Final record structure
free record referrals_reply_out
record referrals_reply_out (
	1 referrals[*]
		2 referral_id			= f8
		2 patient_id			= f8
		2 status
			3 id				= f8
			3 name				= vc
		2 authorization_number	= vc
		2 priority
			3 id				= f8
			3 name				= vc
		2 start_date			= dq8
		2 end_date				= dq8
		2 referring_provider
			3 provider_id		= f8
			3 provider_name		= vc
		2 referred_to_provider
			3 provider_id		= f8
			3 provider_name		= vc
		2 referral_class
			3 id				= f8
			3 name				= vc
		2 referral_type
			3 id				= f8
			3 name				= vc
		2 reason_for_referral 	= vc
		2 procedures[*]
			3 orderable_code_id	= f8
			3 orderable_code_desc = vc
			3 active			= i2
			3 orderable_code_identities[*]
				4 value			= vc
				4 type			= vc
		2 procedure_notes		= vc
		2 linked_order_ids[*]
			3 id				= f8
		2 notes[*]
			3 note_id			= vc
			3 note_type
				4 id			= f8
				4 name			= vc
			3 note_date_time	= dq8
			3 created_by
				4 provider_id	= f8
				4 provider_name	= vc
			3 note_format
				4 id			= f8
				4 name			= vc
			3 note_text			= gvc
    1 audit
      2 user_id             = f8
      2 user_firstname      = vc
      2 user_lastname       = vc
      2 patient_id          = f8
      2 patient_firstname   = vc
      2 patient_lastname    = vc
      2 service_version     = vc
    1 status_data
      2 status 				= c1
      2 subeventstatus[1]
        3 OperationName 	= c25
        3 OperationStatus 	= c1
        3 TargetObjectName 	= c25
        3 TargetObjectValue = vc
        3 Code 				= c4
        3 Description 		= vc
 
)
 
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
declare sUserName						= vc with protect, noconstant("")
declare dPatientId						= f8 with protect, noconstant(0)
declare iDebugFlag						= i2 with protect, noconstant(0)
 
;Constants
declare c_catalog_type_cd	= f8 with protect, constant(uar_get_code_by("MEANING",6000,"REFERRAL"))

/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetReferrals(null)				= null with protect
declare GetPowerFormData(null) 			= i2 with protect
declare PostAmble(null)					= null with protect
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
set sUserName							= trim($USERNAME, 3)
set dPatientId							= cnvtreal($PATIENT_ID)
set iDebugFlag							= cnvtint($DEBUG_FLAG)
 
if(idebugFlag > 0)
	call echo(build("sUserName -> ",sUserName))
	call echo(build("dPatientId -> ",dPatientId))
endif
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
if(dPatientId > 0)
 
	; Validate username
	set iRet = PopulateAudit(sUserName, dPatientId, referrals_reply_out, sVersion)
	if(iRet = 0)
  	  call ErrorHandler2("GET REFERRALS", "F", "User is invalid", "Invalid User for Audit.",
  	  "1001",build("Invalid user: ",sUserName), referrals_reply_out)
  	  go to exit_script
	endif
 
	; Get Referral List
	set iRet = GetReferrals(null)
	if(iRet = 0)
		call ErrorHandler2("GET REFERRALS", "Z", "Success", "No Referrals found.",
		"0000", "Operation completed successfully.", referrals_reply_out)
		go to exit_script
	endif
 
	; Get PowerForm Data if it exists
	call GetPowerFormData(null)
 
	; Build Final Data Structure
	call PostAmble(null)
 
	; Set audit to successful
	call ErrorHandler2("GET REFERRALS", "S", "Success", "Operation completed successfully.",
	"0000", "Operation completed successfully.", referrals_reply_out)
 
else
	call ErrorHandler2("GET REFERRALS", "F", "Invalid URI Parameters", "Missing required field: PatientId.",
	"2055", "Missing required field: PatientId", referrals_reply_out)
	go to EXIT_SCRIPT
 
endif
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
  if(idebugFlag > 0)
	  call echorecord(referrals_reply_out)
	  set file_path = logical("ccluserdir")
	  set _file = build2(trim(file_path),"/snsro_get_referrals.json")
	  call echo(build2("_file : ", _file))
	  call echojson(referrals_reply_out, _file, 0)
  endif
 
  set JSONout = CNVTRECTOJSON(referrals_reply_out)
 
  if(idebugFlag > 0)
	call echo(JSONout)
  endif
 
  if(validate(_MEMORY_REPLY_STRING))
    set _MEMORY_REPLY_STRING = trim(JSONout,3)
  endif

#EXIT_VERSION 
/*************************************************************************
; SUBROUTINES
**************************************************************************/
 
/*************************************************************************
;  Name: GetReferrals(null) = i2
;  Description: Gets a list of referrals based on patient id
**************************************************************************/
subroutine GetReferrals(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetReferrals Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
 
	select into "nl:"
	from orders o
	, order_detail od
	, order_catalog oc
	, order_action oa
	, oe_format_fields off
	plan o where o.person_id = dPatientId and o.catalog_type_cd = c_catalog_type_cd
	join oc where oc.catalog_cd = o.catalog_cd
	join oa where oa.order_id = o.order_id
	join od where od.order_id = o.order_id
			and od.action_sequence = oa.action_sequence
	join off where off.oe_format_id = o.oe_format_id
			and off.oe_field_id = od.oe_field_id
	order by o.order_id, oa.action_sequence, od.detail_sequence
	head report
		x = 0
	head o.order_id
		y = 0
		x = x + 1
		stat = alterlist(temp->referrals,x)
 
		temp->referrals[x].order_id = o.order_id
		temp->referrals[x].patient_id = o.person_id
		temp->referrals[x].order_status_cd = o.order_status_cd
		temp->referrals[x].department_status_cd = o.dept_status_cd
		temp->referrals[x].encounter_id = o.encntr_id
		temp->referrals[x].order_comment_ind = o.order_comment_ind
		temp->referrals[x].current_start_dt_tm = o.current_start_dt_tm
		temp->referrals[x].projected_stop_dt_tm = o.projected_stop_dt_tm
		temp->referrals[x].catalog_cd = o.catalog_cd
		temp->referrals[x].activity_type_cd = o.activity_type_cd
		temp->referrals[x].oe_format_id = o.oe_format_id
		temp->referrals[x].clinical_category_cd = o.dcp_clin_cat_cd
		temp->referrals[x].department_name = oc.dept_display_name
		temp->referrals[x].form_id = oc.form_id
		temp->referrals[x].last_action_sequence = o.last_action_sequence
		temp->referrals[x].link_order_flag = o.link_order_flag
		temp->referrals[x].link_nbr = o.link_nbr
 
		if(oa.action_sequence = 1)
			temp->referrals[x].order_provider_id = oa.order_provider_id
		endif
 
	detail
		y = y + 1
		stat = alterlist(temp->referrals[x].details,y)
 
		temp->referrals[x].details[y].oe_field_id = od.oe_field_id
		temp->referrals[x].details[y].oe_field_meaning_id = od.oe_field_meaning_id
		temp->referrals[x].details[y].oe_field_value = od.oe_field_value
		temp->referrals[x].details[y].oe_field_dt_tm = od.oe_field_dt_tm_value
		temp->referrals[x].details[y].oe_field_display_value = od.oe_field_display_value
		temp->referrals[x].details[y].oe_field_meaning_disp = od.oe_field_meaning
		temp->referrals[x].details[y].label_text = off.label_text
		temp->referrals[x].details[y].updt_dt_tm = od.updt_dt_tm
		temp->referrals[x].details[y].updt_id = od.updt_id
	foot report
		iValidate = x
	with nocounter
 
	if(idebugFlag > 0)
		call echo(concat("GetReferrals Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetPowerFormData(null) = i2
;  Description: Retrieves associated powerforms if they exist
**************************************************************************/
subroutine GetPowerFormData(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetPowerFormData Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	; Check if powerforms are tied to the catalog code
	for(i = 1 to size(temp->referrals,5))
		if(temp->referrals[i].form_id > 0)
 
			set event_id = 0.0
			set form_event_id = 0.0
 
			;If a task is associated to the powerform, then the order_id is on the dcp_forms_activity_comp table. If not,
			;then details will have to be parsed for the event id
			select into "nl:"
			from dcp_forms_activity_comp dfac
			, dcp_forms_activity dfa
			, task_activity ta
			plan dfac where dfac.parent_entity_name = "ORDERS"
				and dfac.parent_entity_id = temp->referrals[i].order_id
			join dfa where dfa.dcp_forms_activity_id = dfac.dcp_forms_activity_id
			join ta where ta.task_id = dfa.task_id
			detail
				event_id = ta.event_id
			with nocounter
 
			if(event_id = 0)
				for(j = 1 to size(temp->referrals[i].details,5))
					set val = cnvtreal(temp->referrals[i].details[j].oe_field_display_value)
					if(val)
						select into "nl:"
						from clinical_event ce
						where ce.event_id = val
						detail
							event_id = ce.event_id
						with nocounter
					endif
				endfor
			endif
 
			; Get parent event which will be the form level event_id
			select into "nl:"
			from clinical_event ce
			where ce.event_id = event_id
			detail
				form_event_id = ce.parent_event_id
			with nocounter
 
			; Get powerform data
			select into "nl:"
			from clinical_event form
			, clinical_event section
			, clinical_event child
			plan form where form.event_id = form_event_id
			join section where section.parent_event_id = form.event_id
				and section.parent_event_id != section.event_id
			join child where child.parent_event_id = section.event_id
			order by form.event_id, section.event_id, child.event_id
			head report
				x = 0
			head form.event_id
				y = 0
				x = x + 1
				stat = alterlist(temp->referrals[i].powerforms,x)
 
				temp->referrals[i].powerforms[x].form_event_id = form.event_id
			head section.event_id
				z = 0
				y = y + 1
				stat = alterlist(temp->referrals[i].powerforms[x].sections,y)
 
				temp->referrals[i].powerforms[x].sections[y].section_event_id = section.event_id
			detail
				z = z + 1
				stat = alterlist(temp->referrals[i].powerforms[x].sections[y].child_events,z)
 
				temp->referrals[i].powerforms[x].sections[y].child_events[z].clinical_event_id = child.clinical_event_id
				temp->referrals[i].powerforms[x].sections[y].child_events[z].event_id = child.event_id
				temp->referrals[i].powerforms[x].sections[y].child_events[z].event_cd = child.event_cd
				temp->referrals[i].powerforms[x].sections[y].child_events[z].order_id = child.order_id
				temp->referrals[i].powerforms[x].sections[y].child_events[z].clinsig_updt_dt_tm = child.clinsig_updt_dt_tm
				temp->referrals[i].powerforms[x].sections[y].child_events[z].catalog_cd = child.catalog_cd
				temp->referrals[i].powerforms[x].sections[y].child_events[z].collating_seq = child.collating_seq
				temp->referrals[i].powerforms[x].sections[y].child_events[z].encntr_id = child.encntr_id
				temp->referrals[i].powerforms[x].sections[y].child_events[z].event_class_cd = child.event_class_cd
				temp->referrals[i].powerforms[x].sections[y].child_events[z].event_end_dt_tm = child.event_end_dt_tm
				temp->referrals[i].powerforms[x].sections[y].child_events[z].event_reltn_cd = child.event_reltn_cd
				temp->referrals[i].powerforms[x].sections[y].child_events[z].event_start_dt_tm = child.event_start_dt_tm
				temp->referrals[i].powerforms[x].sections[y].child_events[z].event_end_dt_tm = child.event_end_dt_tm
				temp->referrals[i].powerforms[x].sections[y].child_events[z].event_tag = child.event_tag
				temp->referrals[i].powerforms[x].sections[y].child_events[z].event_title_text = child.event_title_text
				temp->referrals[i].powerforms[x].sections[y].child_events[z].expiration_dt_tm = child.expiration_dt_tm
				temp->referrals[i].powerforms[x].sections[y].child_events[z].parent_event_id = child.parent_event_id
				temp->referrals[i].powerforms[x].sections[y].child_events[z].performed_dt_tm = child.performed_dt_tm
				temp->referrals[i].powerforms[x].sections[y].child_events[z].performed_prsnl_id = child.performed_prsnl_id
				temp->referrals[i].powerforms[x].sections[y].child_events[z].person_id = child.person_id
				temp->referrals[i].powerforms[x].sections[y].child_events[z].record_status_cd = child.record_status_cd
				temp->referrals[i].powerforms[x].sections[y].child_events[z].result_status_cd = child.result_status_cd
				temp->referrals[i].powerforms[x].sections[y].child_events[z].result_time_units_cd = child.result_time_units_cd
				temp->referrals[i].powerforms[x].sections[y].child_events[z].result_units_cd = child.result_units_cd
				temp->referrals[i].powerforms[x].sections[y].child_events[z].result_val = child.result_val
				temp->referrals[i].powerforms[x].sections[y].child_events[z].task_assay_cd = child.task_assay_cd
				temp->referrals[i].powerforms[x].sections[y].child_events[z].updt_cnt = child.updt_cnt
				temp->referrals[i].powerforms[x].sections[y].child_events[z].updt_dt_tm = child.updt_dt_tm
				temp->referrals[i].powerforms[x].sections[y].child_events[z].updt_id = child.updt_id
				temp->referrals[i].powerforms[x].sections[y].child_events[z].valid_from_dt_tm = child.valid_from_dt_tm
				temp->referrals[i].powerforms[x].sections[y].child_events[z].valid_until_dt_tm = child.valid_until_dt_tm
				temp->referrals[i].powerforms[x].sections[y].child_events[z].verified_dt_tm = child.verified_dt_tm
				temp->referrals[i].powerforms[x].sections[y].child_events[z].verified_prsnl_id = child.verified_prsnl_id
				temp->referrals[i].powerforms[x].sections[y].child_events[z].view_level = child.view_level
			with nocounter
		endif
	endfor
 
	if(idebugFlag > 0)
		call echo(concat("GetPowerFormData Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
/*************************************************************************
;  Name: PostAmble(null)	= null
;  Description: Build final record structure
**************************************************************************/
subroutine PostAmble(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostAmble Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	for(i = 1 to size(temp->referrals,5))
		set stat = alterlist(referrals_reply_out->referrals,i)
 
		set referrals_reply_out->referrals[i].referral_id = temp->referrals[i].order_id
		set referrals_reply_out->referrals[i].patient_id = temp->referrals[i].patient_id
		set referrals_reply_out->referrals[i].status.id = temp->referrals[i].order_status_cd
		set referrals_reply_out->referrals[i].status.name = uar_get_code_display(temp->referrals[i].order_status_cd)
		set referrals_reply_out->referrals[i].start_date = temp->referrals[i].current_start_dt_tm
		set referrals_reply_out->referrals[i].end_date = temp->referrals[i].projected_stop_dt_tm
 
		set referrals_reply_out->referrals[i].referring_provider.provider_id = temp->referrals[i].order_provider_id
		set referrals_reply_out->referrals[i].referring_provider.provider_name =
		GetNameFromPrsnID(temp->referrals[i].order_provider_id)
 
		set referrals_reply_out->referrals[i].referral_class.id = temp->referrals[i].activity_type_cd
		set referrals_reply_out->referrals[i].referral_class.name =	uar_get_code_display(temp->referrals[i].activity_type_cd)
 
		set referrals_reply_out->referrals[i].referral_type.id = temp->referrals[i].catalog_cd
		set referrals_reply_out->referrals[i].referral_type.name =	uar_get_code_display(temp->referrals[i].catalog_cd)
 
		if(temp->referrals[i].link_order_flag > 0)
			select into "nl:"
			from orders o
			where o.link_nbr = temp->referrals[i].link_nbr
			head report
				ln = 0
			detail
				ln = ln + 1
				stat = alterlist(referrals_reply_out->referrals[i].linked_order_ids,ln)
				referrals_reply_out->referrals[i].linked_order_ids[ln].id = o.order_id
			with nocounter
		endif
 
		;set referrals_reply_out->referrals[i].procedures - NA in Cerner?
 
		for(x = 1 to size(temp->referrals[i].details,5))
			set labelTxt = cnvtupper(temp->referrals[i].details[x].label_text)
 
			if(labelTxt like "*AUTH*")
				set referrals_reply_out->referrals[i].authorization_number = temp->referrals[i].details[x].oe_field_display_value
			elseif(labelTxt like "*REASON*")
				set referrals_reply_out->referrals[i].reason_for_referral = temp->referrals[i].details[x].oe_field_display_value
			elseif(labelTxt like "*PROCEDURE*")
				set referrals_reply_out->referrals[i].procedure_notes = temp->referrals[i].details[x].oe_field_display_value
			elseif(labelTxt like "*PRIORITY*")
				set referrals_reply_out->referrals[i].priority.id = temp->referrals[i].details[x].oe_field_value
				set referrals_reply_out->referrals[i].priority.name = temp->referrals[i].details[x].oe_field_display_value
			elseif(labelTxt like "*REFER*TO*")
				set referrals_reply_out->referrals[i].referred_to_provider.provider_id =
				cnvtreal(temp->referrals[i].details[x].oe_field_value)
				set referrals_reply_out->referrals[i].referred_to_provider.provider_name = temp->referrals[i].details[x].oe_field_display_value
 
			else
				; Add other fields to the notes object
				set noteSize = size(referrals_reply_out->referrals[i].notes,5)
				set noteSize = noteSize + 1
				set stat = alterlist(referrals_reply_out->referrals[i].notes,noteSize)
 
				set referrals_reply_out->referrals[i].notes[noteSize].note_id =
				build(cnvtstring(temp->referrals[i].order_id),"_",temp->referrals[i].details[x].action_sequence,"_",
				temp->referrals[i].details[x].detail_sequence)
				set referrals_reply_out->referrals[i].notes[noteSize].note_type.id = 0
				set referrals_reply_out->referrals[i].notes[noteSize].note_type.name = "OE_FIELD"
				set referrals_reply_out->referrals[i].notes[noteSize].note_date_time = temp->referrals[i].details[x].updt_dt_tm
				set referrals_reply_out->referrals[i].notes[noteSize].created_by.provider_id = temp->referrals[i].details[x].updt_id
				set referrals_reply_out->referrals[i].notes[noteSize].created_by.provider_name =
				GetNameFromPrsnID(temp->referrals[i].details[x].updt_id)
 
				set referrals_reply_out->referrals[i].notes[noteSize].note_format.id = uar_get_code_by("MEANING",23,"RTF")
				set referrals_reply_out->referrals[i].notes[noteSize].note_format.name =
				uar_get_code_display(referrals_reply_out->referrals[i].notes[noteSize].note_format.id)
 
				set referrals_reply_out->referrals[i].notes[noteSize].note_text = build2(
				trim(temp->referrals[i].details[x].label_text,3),": ",
				temp->referrals[i].details[x].oe_field_display_value)
			endif
		endfor
 
		; If Order Comments exist, add it to the notes object
 		if(temp->referrals[i].order_comment_ind > 0)
 			select into "nl:"
 			from order_comment oc
 			, long_text lt
 			, person p
 			plan oc where oc.order_id = temp->referrals[i].order_id
 				and oc.action_sequence = temp->referrals[i].last_action_sequence
 			join lt where lt.long_text_id = oc.long_text_id
 			join p where p.person_id = oc.updt_id
 			head report
 				noteSize = size(referrals_reply_out->referrals[i].notes,5)
 			detail
 				noteSize = noteSize + 1
				stat = alterlist(referrals_reply_out->referrals[i].notes,noteSize)
 
				referrals_reply_out->referrals[i].notes[noteSize].note_id = cnvtstring(oc.long_text_id)
				referrals_reply_out->referrals[i].notes[noteSize].note_type.id = oc.comment_type_cd
				referrals_reply_out->referrals[i].notes[noteSize].note_type.name = uar_get_code_display(oc.comment_type_cd)
				referrals_reply_out->referrals[i].notes[noteSize].note_date_time = oc.updt_dt_tm
				referrals_reply_out->referrals[i].notes[noteSize].created_by.provider_id = oc.updt_id
				referrals_reply_out->referrals[i].notes[noteSize].created_by.provider_name = p.name_full_formatted
 
				referrals_reply_out->referrals[i].notes[noteSize].note_format.id = uar_get_code_by("MEANING",23,"RTF")
				referrals_reply_out->referrals[i].notes[noteSize].note_format.name =
				uar_get_code_display(referrals_reply_out->referrals[i].notes[noteSize].note_format.id)
 
				referrals_reply_out->referrals[i].notes[noteSize].note_text = trim(lt.long_text,3)
			with nocounter
 		endif
 
		; If powerform data exists, add it to the notes object
		set pwrFrmSize = size(temp->referrals[i].powerforms,5)
		if(pwrFrmSize > 0)
			for(x = 1 to pwrFrmSize)
				for(y = 1 to size(temp->referrals[i].powerforms[x].sections,5))
					for(z = 1 to size(temp->referrals[i].powerforms[x].sections[y].child_events,5))
						set noteSize = size(referrals_reply_out->referrals[i].notes,5)
						set noteSize = noteSize + 1
						set stat = alterlist(referrals_reply_out->referrals[i].notes,noteSize)
 
						set referrals_reply_out->referrals[i].notes[noteSize].note_id =
						cnvtstring(temp->referrals[i].powerforms[x].sections[y].child_events[z].event_id)
 
						set referrals_reply_out->referrals[i].notes[noteSize].note_type.id = 0
						set referrals_reply_out->referrals[i].notes[noteSize].note_type.name = "POWERFORM_EVENT"
 
						set referrals_reply_out->referrals[i].notes[noteSize].note_date_time =
						temp->referrals[i].powerforms[x].sections[y].child_events[z].performed_dt_tm
 
						set referrals_reply_out->referrals[i].notes[noteSize].created_by.provider_id =
						temp->referrals[i].powerforms[x].sections[y].child_events[z].performed_prsnl_id
 
						set referrals_reply_out->referrals[i].notes[noteSize].created_by.provider_name =
						GetNameFromPrsnID(temp->referrals[i].powerforms[x].sections[y].child_events[z].performed_prsnl_id)
 
						set referrals_reply_out->referrals[i].notes[noteSize].note_format.id = uar_get_code_by("MEANING",23,"RTF")
						set referrals_reply_out->referrals[i].notes[noteSize].note_format.name =
						uar_get_code_display(referrals_reply_out->referrals[i].notes[noteSize].note_format.id)
 
						set referrals_reply_out->referrals[i].notes[noteSize].note_text = build2(
						trim(uar_get_code_display(temp->referrals[i].powerforms[x].sections[y].child_events[z].event_cd),3)
						,": ",temp->referrals[i].powerforms[x].sections[y].child_events[z].result_val)
 
					endfor
				endfor
			endfor
		endif
 
	endfor
 
	if(idebugFlag > 0)
		call echo(concat("PostAmble Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
end go
set trace notranslatelock go
