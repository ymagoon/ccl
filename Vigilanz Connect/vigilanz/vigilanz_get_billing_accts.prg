/***************************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

****************************************************************************
      Source file name:     snsro_get_billing_accts.prg
      Object name:          vigilanz_get_billing_accts
      Program purpose:      Retrieve charge data for a given patient
      Executing from:       Emissary Service
****************************************************************************
                     MODIFICATION CONTROL LOG
****************************************************************************
  Mod Date     Engineer     Comment
  --------------------------------------------------------------------------
  000 02/12/19 RJC			Initial write
***************************************************************************/
drop program vigilanz_get_billing_accts go
create program vigilanz_get_billing_accts
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Username"  = ""  			;REQUIRED
	, "PatientId" = ""				;REQUIRED
	, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, USERNAME, PATIENT_ID, DEBUG_FLAG
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common
 
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
; Final Reply
free record final_reply_out
record final_reply_out
(
	1 qual[*]
		2 financial_number = vc
		2 billing_status
			3 id = f8
			3 name = vc
		2 admit_date_time = dq8
		2 discharge_date_time = dq8
		2 inpatient_date_time = dq8
		2 birth_weight = f8
		2 birth_weight_units
			3 id = f8
			3 name = vc
		2 patient_class
			3 id = f8
			3 name = vc
		2 admit_source
			3 id = f8
			3 name = vc
		2 admit_type
			3 id = f8
			3 name = vc
		2 admit_unit
			3 id = f8
			3 name = vc
		2 discharge_unit
			3 id = f8
			3 name = vc
		2 discharge_destination
			3 id = f8
			3 name = vc
		2 admitting_provider
			3 provider_id = f8
			3 provider_name = vc
			3 npi = vc
		2 referring_provider
			3 provider_id = f8
			3 provider_name = vc
			3 npi = vc
		2 attending_providers[*]
			3 provider_id = f8
			3 provider_name = vc
			3 npi = vc
		2 emergency_room_providers[*]
			3 provider_id = f8
			3 provider_name = vc
			3 npi = vc
		2 other_providers[*]
			3 provider_id = f8
			3 provider_name = vc
			3 npi = vc
		2 total_charges = f8
		2 total_cost = f8
		2 procedures[*]
			3 procedure_id = f8
			3 procedure_name = vc
			3 code_type
				4 id = f8
				4 name = vc
			3 procedure_code = vc
			3 procedure_date_time = dq8
			3 provider
				4 provider_id = f8
				4 provider_name = vc
				4 npi = vc
			3 modifiers = vc
			3 is_primary = i2
			3 anesthesia_type
				4 id = f8
				4 name = vc
		2 admit_diagnoses[*]
			3 diagnosis_name = vc
			3 code_type
				4 id = f8
				4 name = vc
			3 diagnosis_code = vc
			3 is_primary = i2
		2 final_diagnoses[*]
			3 diagnosis_name = vc
			3 code_type
				4 id = f8
				4 name = vc
			3 diagnosis_code = vc
			3 is_primary = i2
			3 present_on_admission
				4 id = f8
				4 name = vc
			3 is_hospital_acquired = i2
		2 diagnosis_related_groups[*]
			3 diagnosis_related_group_name = vc
			3 diagnosis_related_group_code = vc
			3 major_diagnostic_category
				4 id = f8
				4 name = vc
			3 weight = f8
			3 severity_of_illness
				4 id = f8
				4 name = vc
			3 risk_of_mortality
				4 id = f8
				4 name = vc
			3 length_of_stay = f8
			3 average_length_of_stay = f8
			3 geometric_mean_length_of_stay = f8
			3 outlier_days = f8
			3 outlier_cost = f8
			3 outlier_reimbursement = f8
		2 created_updated_date_time = dq8
		2 patient
			3 patient_id = f8
			3 display_name = vc
			3 last_name = vc
			3 first_name = vc
			3 middle_name = vc
			3 mrn = vc
			3 birth_date_time = dq8
			3 sdob = vc
			3 gender
				4 id = f8
				4 name = vc
		2 encounter
			3 encounter_id = f8
			3 encounter_type
				4 id = f8
				4 name = vc
			3 patient_class
				4 id = f8
				4 name = vc
			3 encounter_date_time = dq8
			3 discharge_date_time = dq8
			3 financial_number = vc
			3 location
				4 hospital
					5 id = f8
					5 name = vc
				4 unit
					5 id = f8
					5 name = vc
				4 room
					5 id = f8
					5 name = vc
				4 bed
					5 id = f8
					5 name = vc
		2 other_detail
			3 pft_encntr_id = f8
	1 audit
		2 user_id					= f8
		2 user_firstname			= vc
		2 user_lastname				= vc
		2 patient_id				= f8
		2 patient_firstname			= vc
		2 patient_lastname			= vc
		2 service_version			= vc
		2 query_execute_time		= vc
		2 query_execute_units		= vc
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
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Input
declare sUserName				= vc with protect, noconstant("")
declare dPatientId				= f8 with protect, noconstant(0.0)
declare iDebugFlag				= i2 with protect, noconstant(0)
 
;Other
declare dPrsnlId				= f8 with protect, noconstant(0.0)
 
;Constants
declare c_error_handler_name			= vc with protect, constant("BILLING ACCTS")
declare c_mrn_encntr_alias_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",319,"MRN"))
declare c_npi_prsnl_alias_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",320,"NPI"))
declare c_birthweight_event_cd			= f8 with protect, constant(uar_get_code_by("DISPLAYKEY",72,"BIRTHWEIGHT"))
declare c_fin_encntr_alias_type_cd 		= f8 with protect,constant(uar_get_code_by("MEANING",319,"FIN NBR"))
declare c_revenue_acct_type_cd 			= f8 with protect,constant(uar_get_code_by("MEANING",18736,"REVENUE"))
declare c_anesthesia_proc_function_cd	= f8 with protect,constant(uar_get_code_by("MEANING",387,"ANESTHESIA"))
declare c_cpt4_source_vocabulary_cd 	= f8 with protect,constant(uar_get_code_by("MEANING",400,"CPT4"))
 
/**************************************************************************
;INITIALIZE
**************************************************************************/
set modify maxvarlen 200000000
 
;Input
set sUserName					= trim($USERNAME,3)
set dPatientId					= cnvtreal($PATIENT_ID)
set iDebugFlag					= cnvtint($DEBUG_FLAG)
 
;Other
set dPrsnlId					= GetPrsnlIDfromUserName(sUserName)
 
 if(iDebugFlag > 0)
	call echo(build("sUserName -> ", sUserName))
	call echo(build("dPatientId -> ", dPatientId))
	call echo(build("dPrsnlId -> ", dPrsnlId))
endif
 
/**************************************************************************
;DECLARE SUBROUTINES
***************************************************************************/
declare GetEncounters(null) 		= null with protect
declare GetChargeData(null) 		= null with protect
declare GetBillingProcedures(null) 	= null with protect
declare GetDiagnoses(null) 			= null with protect
declare GetPrsnl(null) 				= null with protect
declare GetDRG(null) 				= null with protect
declare PostAmble(null) 			= null with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
;Validate Username
set iRet = PopulateAudit(sUserName, dPatientId, final_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2(c_error_handler_name, "F","Validate", "Invalid User for Audit.",
	"1001",build("UserId is invalid: ", sUserName),final_reply_out)
	go to EXIT_SCRIPT
endif
 
; Get Encounters
call GetEncounters(null)
 
; Get Charge Data
call GetChargeData(null)
 
; Get Billing Procedures
call GetBillingProcedures(null)
 
; Get Diagnoses
call GetDiagnoses(null)
 
; Get Prsnl Relationships
call GetPrsnl(null)
 
; Get Diagnosis Related Groups
call GetDRG(null)
 
; Post Amble
call PostAmble(null)

; Set audit to succeess
call ErrorHandler2(c_error_handler_name, "S","Success", "Process completed successfully.",
"0000","Process completed successfully.",final_reply_out)
	
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(final_reply_out)
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_billing_accts.json")
	call echo(build2("_file : ", _file))
	call echojson(final_reply_out, _file, 0)
    call echorecord(final_reply_out)
	call echo(JSONout)
endif
 
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
#EXIT_VERSION
 
/*************************************************************************
;  Name: GetEncounters(null) = null
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
	set 100041_req->encounter_id                 = 0
	set 100041_req->options                      = "1000600005000000000   1"
	set 100041_req->person_id                    = dPatientId
	set 100041_req->return_all                   = 0
	set 100041_req->security                     = 0
	set 100041_req->user_id                      = dPrsnlId
	set 100041_req->user_name                    = sUserName
	set 100041_req->limit_ind                    = 0
	set 100041_req->max_encntr                   = 502
 
	set stat = alterlist(100041_req->result, 19)
	for(i = 1 to size(100041_req->result,5))
		set 100041_req->result[2]->meaning = ""
		set 100041_req->result[2]->options = ""
 
		case(i)
			of  1:	set 100041_req->result[i]->flag = 120
				  	set 100041_req->result[i]->meaning = "FIN NBR"
			of  2: 	set 100041_req->result[i]->flag = 139
			of  3: 	set 100041_req->result[i]->flag = 144
			of  4:	set 100041_req->result[i]->flag = 150
			of  5:	set 100041_req->result[i]->flag = 162
			of  6:	set 100041_req->result[i]->flag = 110
			of  7:	set 100041_req->result[i]->flag = 149
			of  8:	set 100041_req->result[i]->flag = 160
			of  9:	set 100041_req->result[i]->flag = 118
			of 10:	set 100041_req->result[i]->flag = 232
			of 11:	set 100041_req->result[i]->flag = 233
			of 12:	set 100041_req->result[i]->flag = 214
			of 13: 	set 100041_req->result[i]->flag = 216
					set 100041_req->result[i]->meaning = "SSN"
			of 14:	set 100041_req->result[i]->flag = 216
					set 100041_req->result[i]->meaning = "MRN"
			of 15:	set 100041_req->result[i]->flag = 208
			of 16:	set 100041_req->result[i]->flag = 204
			of 17:	set 100041_req->result[i]->flag = 203
			of 18: 	set 100041_req->result[i]->flag = 194
			of 19: 	set 100041_req->result[i]->flag = 198
		endcase
	endfor
 
	; Execute request
	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",100041_req,"REC",100041_rep)
 
	if (100041_rep->status_data->status = "F")
		call ErrorHandler2(c_error_handler_name, "F", "Execute", "Error executing 100040 - Encounter Search",
		"9999", "Error executing 100040 - Encounter Search", final_reply_out)
		go to exit_script
	else
		set encCnt = size(100041_rep->encounter,5)
		set stat = alterlist(final_reply_out->qual,encCnt)
		if(encCnt > 0)
			for(i = 1 to encCnt)
				set final_reply_out->qual[i].encounter.encounter_id = 100041_rep->encounter[i].encounter_id
				set final_reply_out->qual[i].encounter.financial_number = 100041_rep->encounter[i].alias_finnbr
			endfor
		else
			call ErrorHandler2(c_error_handler_name, "Z", "Success", "No encounters found.","0000",
			"No encounters found.", final_reply_out)
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
;  Name: GetChargeData(null) = null
;  Description: Subroutine to get Charge Data
**************************************************************************/
subroutine GetChargeData(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetChargeData Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	; Charge Data - RevCycle Clients
	select into "nl:"
		gl.activity_dt_tm
		,pe.encntr_id
	from (dummyt d with seq = size(final_reply_out->qual,5))
		, gl_trans_log gl
		,pft_trans_reltn ptr
		,pft_trans_reltn ptr2
		,account ac
		,pft_encntr pe
	plan d
	join pe	where pe.encntr_id = final_reply_out->qual[d.seq].encounter.encounter_id
	join ptr where ptr.parent_entity_id = pe.pft_encntr_id
		and ptr.parent_entity_name = "PFTENCNTR"
		and ptr.active_ind = 1
	join ptr2 where ptr2.activity_id = ptr.activity_id
		and ptr2.parent_entity_name = "ACCOUNT"
		and ptr2.active_ind = 1
	join ac where ac.acct_id = ptr2.parent_entity_id
		and ac.acct_type_cd = c_revenue_acct_type_cd
		and ac.active_ind = 1
	join gl where gl.gl_trans_log_id = ptr2.gl_trans_log_id
	detail
		if(gl.activity_dt_tm > final_reply_out->qual[d.seq].created_updated_date_time)
			final_reply_out->qual[d.seq].created_updated_date_time = gl.activity_dt_tm
		endif
 
		final_reply_out->qual[d.seq].other_detail.pft_encntr_id = pe.pft_encntr_id
	with nocounter
 
	; Charge Data - Non-RevCycle Clients
	select into "nl:"
	from (dummyt d with seq = size(final_reply_out->qual,5))
		, charge c
	plan d
	join c where c.encntr_id = final_reply_out->qual[d.seq].encounter.encounter_id
	detail
		if(c.service_dt_tm > final_reply_out->qual[d.seq].created_updated_date_time)
			final_reply_out->qual[d.seq].created_updated_date_time = c.service_dt_tm
		endif
	with nocounter
 
	; Update fin alias and billing status
	declare new_nbr = vc
	declare fin_recur_fin_nbr = vc
 
	select into "nl:"
	from  (dummyt d with seq = size(final_reply_out->qual,5))
		, pft_encntr pe
	plan d
	join pe where pe.encntr_id = final_reply_out->qual[d.seq].encounter.encounter_id
	head d.seq
		final_reply_out->qual[d.seq].billing_status.id = pe.bill_status_cd
		final_reply_out->qual[d.seq].billing_status.name = uar_get_code_display(pe.bill_status_cd)
 
		if(pe.pft_encntr_alias > "")
			if(pe.recur_ind = 1)
				pos = findstring("-",trim(pe.pft_encntr_alias))
				if (pos > 0)
					new_nbr = substring(1, pos-1, trim(pe.pft_encntr_alias))
					fin_recur_fin_nbr = build(new_nbr,"-",trim(cnvtstring(pe.recur_seq)))
					final_reply_out->qual[d.seq].financial_number = fin_recur_fin_nbr
				else
					final_reply_out->qual[d.seq].financial_number = pe.pft_encntr_alias
					final_reply_out->qual[d.seq].encounter.financial_number = pe.pft_encntr_alias
				endif
			else
				final_reply_out->qual[d.seq].financial_number = pe.pft_encntr_alias
				final_reply_out->qual[d.seq].encounter.financial_number = pe.pft_encntr_alias
			endif
		endif
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetChargeData Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end ;End Sub
 
/*************************************************************************
;  Name: GetBillingProcedures(null) = null
;  Description: Subroutine to get billing procedures
**************************************************************************/
subroutine GetBillingProcedures(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetBillingProcedures Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	select into "nl:"
	from (dummyt d with seq = size(final_reply_out->qual,5))
		,nomenclature n
		,procedure p
		,proc_prsnl_reltn proc
		,prsnl pr
		,prsnl_alias pa
	plan d
	join p where p.encntr_id = final_reply_out->qual[d.seq].encounter.encounter_id
		and p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and p.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
		and p.active_ind = 1
	join n where n.nomenclature_id = outerjoin(p.nomenclature_id)
		and n.active_ind = outerjoin(1)
	join proc where proc.procedure_id = outerjoin(p.procedure_id)
		and proc.active_ind = outerjoin(1)
	join pr where pr.person_id = outerjoin(proc.prsnl_person_id)
		and pr.active_ind = outerjoin(1)
	join pa	where pa.person_id = outerjoin(pr.person_id)
		and pa.prsnl_alias_type_cd = outerjoin(c_npi_prsnl_alias_type_cd)
		and pa.active_ind = outerjoin(1)
	order by d.seq, p.procedure_id
	head d.seq
		p = 0
	head p.procedure_id
		p = p + 1
		x = 0
		stat = alterlist(final_reply_out->qual[d.seq].procedures,p)
 
 		final_reply_out->qual[d.seq].procedures[p].procedure_id = p.procedure_id
 		if(p.nomenclature_id > 0)
			final_reply_out->qual[d.seq].procedures[p].procedure_name = n.source_string
		else
			; Free text procedures
			final_reply_out->qual[d.seq].procedures[p].procedure_name = p.proc_ftdesc
		endif
 
		final_reply_out->qual[d.seq].procedures[p].code_type.id = n.source_vocabulary_cd
		final_reply_out->qual[d.seq].procedures[p].code_type.name = uar_get_code_display(n.source_vocabulary_cd)
		final_reply_out->qual[d.seq].procedures[p].procedure_code = n.source_identifier
		final_reply_out->qual[d.seq].procedures[p].procedure_date_time = p.proc_dt_tm
		if(p.proc_priority = 1)
			final_reply_out->qual[d.seq].procedures[p].is_primary = 1
		endif
		final_reply_out->qual[d.seq].procedures[p].anesthesia_type.id = p.anesthesia_cd
		final_reply_out->qual[d.seq].procedures[p].anesthesia_type.name = uar_get_code_display(p.anesthesia_cd)
	detail
		if(proc.prsnl_person_id > 0)
			; If multiple providers exist, return the surgeon if they exist or return the first one
			if(final_reply_out->qual[d.seq].procedures[p].provider.provider_id = 0)
				final_reply_out->qual[d.seq].procedures[p].provider.npi = pa.alias
				final_reply_out->qual[d.seq].procedures[p].provider.provider_id  = pa.person_id
				final_reply_out->qual[d.seq].procedures[p].provider.provider_name  = pr.name_full_formatted
			else
				if(proc.proc_prsnl_reltn_cd = value(uar_get_code_by("MEANING",388,"SURGEON")))
					final_reply_out->qual[d.seq].procedures[p].provider.npi = pa.alias
					final_reply_out->qual[d.seq].procedures[p].provider.provider_id  = pa.person_id
					final_reply_out->qual[d.seq].procedures[p].provider.provider_name  = pr.name_full_formatted
				endif
			endif
		endif
	with nocounter
 
	; Get Procedure modifiers
	for(x = 1 to size(final_reply_out->qual,5))
		set procSize = size(final_reply_out->qual[x].procedures,5)
 
		if(procSize > 0)
			select into "nl:"
			from (dummyt d with seq = procSize)
				, proc_modifier pm
				, nomenclature n
			plan d
			join pm where pm.parent_entity_name = "PROCEDURE"
				and pm.parent_entity_id = final_reply_out->qual[x].procedures[d.seq].procedure_id
				and pm.active_ind = 1
			join n where n.nomenclature_id = pm.nomenclature_id
			head d.seq
				check = 0
			detail
				if(check = 0)
					final_reply_out->qual[x].procedures[d.seq].modifiers = n.source_string
					check = 1
				else
					final_reply_out->qual[x].procedures[d.seq].modifiers =
						build2(final_reply_out->qual[x].procedures[d.seq].modifiers,", ",n.source_string)
				endif
			with nocounter
		endif
	endfor
 
	if(iDebugFlag > 0)
		call echo(concat("GetBillingProcedures Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end ;End Sub
 
/*************************************************************************
;  Name: GetDiagnoses(null) = null
;  Description: Subroutine to get Diagnosis
**************************************************************************/
subroutine GetDiagnoses(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetDiagnoses Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	select into "nl:"
	from (dummyt d WITH seq = size(final_reply_out->qual,5))
		, nomenclature n
		, diagnosis dx
	plan d
	join dx where dx.encntr_id  = final_reply_out->qual[d.seq].encounter.encounter_id
		and dx.active_ind = 1
	join n where n.nomenclature_id = dx.nomenclature_id
		and n.active_ind = 1
	head d.seq
		a = 0
		f = 0
	detail
		; Admit diagnoses
		if(dx.diag_type_cd = value(uar_get_code_by("MEANING",17,"ADMIT")))
			a = a + 1
			stat = alterlist(final_reply_out->qual[d.seq].admit_diagnoses,a)
 
			final_reply_out->qual[d.seq].admit_diagnoses[a].code_type.id = n.source_vocabulary_cd
			final_reply_out->qual[d.seq].admit_diagnoses[a].code_type.name = uar_get_code_display(n.source_vocabulary_cd)
			final_reply_out->qual[d.seq].admit_diagnoses[a].diagnosis_code = n.source_identifier
			final_reply_out->qual[d.seq].admit_diagnoses[a].diagnosis_name = n.source_string
			if(dx.diag_priority = 1)
				final_reply_out->qual[d.seq].admit_diagnoses[a].is_primary = 1
			endif
		endif
 
		;Final diagnoses
		if(dx.diag_type_cd = value(uar_get_code_by("MEANING",17,"FINAL")))
			f = f + 1
			stat = alterlist(final_reply_out->qual[d.seq].final_diagnoses,f)
 
			final_reply_out->qual[d.seq].final_diagnoses[f].code_type.id = n.source_vocabulary_cd
			final_reply_out->qual[d.seq].final_diagnoses[f].code_type.name = uar_get_code_display(n.source_vocabulary_cd)
			final_reply_out->qual[d.seq].final_diagnoses[f].diagnosis_code = n.source_identifier
			final_reply_out->qual[d.seq].final_diagnoses[f].diagnosis_name = n.source_string
			if(dx.diag_priority = 1)
				final_reply_out->qual[d.seq].final_diagnoses[f].is_primary = 1
			endif
			final_reply_out->qual[d.seq].final_diagnoses[f].is_hospital_acquired = dx.hac_ind
			final_reply_out->qual[d.seq].final_diagnoses[f].present_on_admission.id = dx.present_on_admit_cd
			final_reply_out->qual[d.seq].final_diagnoses[f].present_on_admission.name =
				uar_get_code_display(dx.present_on_admit_cd)
		endif
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetDiagnoses Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end ;End Sub
 
/*************************************************************************
;  Name: GetPrsnl(null) = null
;  Description: Subroutine to get  Prsnl
**************************************************************************/
subroutine GetPrsnl(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetPrsnl Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	declare reltn = vc
 
 	select into "nl:"
	from (dummyt d with seq = size(final_reply_out->qual,5))
		, encntr_prsnl_reltn epr
		, prsnl pr
		, prsnl_alias pa
		, code_value cv
	plan d
	join epr where epr.encntr_id = final_reply_out->qual[d.seq].encounter.encounter_id
		and epr.active_ind = 1
	join pr where pr.person_id = epr.prsnl_person_id
		and pr.active_ind = 1
	join pa where pa.person_id   = pr.person_id
		and pa.prsnl_alias_type_cd = c_npi_prsnl_alias_type_cd
		and pa.active_ind = 1
		and pa.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and pa.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
	join cv where cv.code_value = epr.encntr_prsnl_r_cd
	head d.seq
		a = 0
		o = 0
		e = 0
	detail
		if(cv.cdf_meaning > " ")
			reltn = cv.cdf_meaning
		else
			reltn = cv.display_key
		endif
		; Admitting provider
		if(reltn = "ADMITDOC" and final_reply_out->qual[d.seq].admitting_provider.provider_id = 0)
			final_reply_out->qual[d.seq].admitting_provider.provider_id = pr.person_id
			final_reply_out->qual[d.seq].admitting_provider.provider_name = pr.name_full_formatted
			final_reply_out->qual[d.seq].admitting_provider.npi = pa.alias
 
		; Attending provider
		elseif(reltn = "ATTENDDOC")
			a = a + 1
			stat = alterlist(final_reply_out->qual[d.seq].attending_providers,a)
			final_reply_out->qual[d.seq].attending_providers[a].provider_id = pr.person_id
			final_reply_out->qual[d.seq].attending_providers[a].provider_name = pr.name_full_formatted
			final_reply_out->qual[d.seq].attending_providers[a].npi = pa.alias
 
		; Emergency Room Providers
		elseif(reltn = "EDPHYSICIAN")
			e = e + 1
			stat = alterlist(final_reply_out->qual[d.seq].emergency_room_providers,e)
			final_reply_out->qual[d.seq].emergency_room_providers[e].provider_id = pr.person_id
			final_reply_out->qual[d.seq].emergency_room_providers[e].provider_name = pr.name_full_formatted
			final_reply_out->qual[d.seq].emergency_room_providers[e].npi = pa.alias
 
		; Referring Provider
		elseif(reltn = "REFERDOC" and final_reply_out->qual[d.seq].referring_provider.provider_id = 0)
			final_reply_out->qual[d.seq].referring_provider.provider_id = pr.person_id
			final_reply_out->qual[d.seq].referring_provider.provider_name = pr.name_full_formatted
			final_reply_out->qual[d.seq].referring_provider.npi = pa.alias
 
		; Other Providers
		else
			o = o + 1
			stat = alterlist(final_reply_out->qual[d.seq].other_providers,o)
			final_reply_out->qual[d.seq].other_providers[o].provider_id = pr.person_id
			final_reply_out->qual[d.seq].other_providers[o].provider_name = pr.name_full_formatted
			final_reply_out->qual[d.seq].other_providers[o].npi = pa.alias
		endif
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetPrsnl Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end ;End Sub
 
/*************************************************************************
;  Name: GetDRG(null) = null
;  Description: Subroutine to get DRG
**************************************************************************/
subroutine GetDRG(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetDRG Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	select into "nl:"
	from (dummyt d WITH seq = size(final_reply_out->qual,5))
		, drg dg
		, drg_extension de
		, nomenclature n
		, encounter e
	plan d
	join e where e.encntr_id = final_reply_out->qual[d.seq].encounter.encounter_id
	join dg	where dg.encntr_id = e.encntr_id
		and dg.active_ind = 1
	join n where n.nomenclature_id = dg.nomenclature_id
		;and n.source_vocabulary_cd in (c_aprdrg_source_vocabulary_cd, c_msdrg_source_vocabulary_cd)
		and n.active_ind = 1
	join de	where de.source_identifier = outerjoin(n.source_identifier)
		;and de.source_vocabulary_cd  in (c_aprdrg_source_vocabulary_cd, c_msdrg_source_vocabulary_cd)
		and de.active_ind = outerjoin(1)
		and de.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime))
	head d.seq
		x = 0
	detail
		x = x + 1
		stat = alterlist(final_reply_out->qual[d.seq].diagnosis_related_groups,x)
 
		final_reply_out->qual[d.seq].diagnosis_related_groups[x].average_length_of_stay = de.amlos
		final_reply_out->qual[d.seq].diagnosis_related_groups[x].geometric_mean_length_of_stay = de.gmlos
 
		if(e.disch_dt_tm is not null)
			final_reply_out->qual[d.seq].diagnosis_related_groups[x].length_of_stay = datetimediff(e.disch_dt_tm,e.reg_dt_tm)
		else
			final_reply_out->qual[d.seq].diagnosis_related_groups[x].length_of_stay =
				datetimediff(cnvtdatetime(curdate,curtime3),e.reg_dt_tm)
		endif
		final_reply_out->qual[d.seq].diagnosis_related_groups[x].diagnosis_related_group_code = n.source_identifier
		final_reply_out->qual[d.seq].diagnosis_related_groups[x].diagnosis_related_group_name = n.source_string
		final_reply_out->qual[d.seq].diagnosis_related_groups[x].major_diagnostic_category.id = dg.mdc_cd
		final_reply_out->qual[d.seq].diagnosis_related_groups[x].major_diagnostic_category.name = uar_get_code_display(dg.mdc_cd)
		final_reply_out->qual[d.seq].diagnosis_related_groups[x].outlier_cost = dg.outlier_cost
		final_reply_out->qual[d.seq].diagnosis_related_groups[x].outlier_days = dg.outlier_days
		final_reply_out->qual[d.seq].diagnosis_related_groups[x].outlier_reimbursement = dg.outlier_reimbursement_cost
		final_reply_out->qual[d.seq].diagnosis_related_groups[x].risk_of_mortality.id = dg.risk_of_mortality_cd
		final_reply_out->qual[d.seq].diagnosis_related_groups[x].risk_of_mortality.name =
			uar_get_code_display(dg.risk_of_mortality_cd)
		final_reply_out->qual[d.seq].diagnosis_related_groups[x].severity_of_illness.id = dg.severity_of_illness_cd
		final_reply_out->qual[d.seq].diagnosis_related_groups[x].severity_of_illness.name =
			uar_get_code_display(dg.severity_of_illness_cd)
		final_reply_out->qual[d.seq].diagnosis_related_groups[x].weight = de.drg_weight
 
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetDRG Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: PostAmble(null) = null
;  Description: Set encounter, person, clinical event and alias details
**************************************************************************/
subroutine PostAmble(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostAmble Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	; Get Encounter & Person Details
	select into "nl:"
	from (dummyt d with seq = size(final_reply_out->qual,5))
	, encounter e
	, person p
	, omf_encntr_st oes
	plan d
	join e where e.encntr_id = final_reply_out->qual[d.seq].encounter.encounter_id
	join p where p.person_id = e.person_id
		and p.active_ind = 1
	join oes where oes.encntr_id = outerjoin(e.encntr_id)
	detail
		;Person
		final_reply_out->qual[d.seq].patient.patient_id = p.person_id
		final_reply_out->qual[d.seq].patient.display_name = p.name_full_formatted
		final_reply_out->qual[d.seq].patient.first_name = p.name_first
		final_reply_out->qual[d.seq].patient.last_name = p.name_last
		final_reply_out->qual[d.seq].patient.middle_name = p.name_middle
		final_reply_out->qual[d.seq].patient.birth_date_time = p.birth_dt_tm
		final_reply_out->qual[d.seq].patient.gender.id = p.sex_cd
		final_reply_out->qual[d.seq].patient.gender.name = uar_get_code_display(p.sex_cd)
		final_reply_out->qual[d.seq].patient.sdob =
 			datetimezoneformat(p.birth_dt_tm,p.birth_tz,"YYYY-MM-DD",curtimezonedef)
 
		;Encounter
		final_reply_out->qual[d.seq].admit_date_time = e.reg_dt_tm
		final_reply_out->qual[d.seq].admit_source.id = e.admit_src_cd
		final_reply_out->qual[d.seq].admit_source.name = uar_get_code_display(e.admit_src_cd)
		final_reply_out->qual[d.seq].admit_type.id = e.admit_type_cd
		final_reply_out->qual[d.seq].admit_type.name = uar_get_code_display(e.admit_type_cd)
		final_reply_out->qual[d.seq].discharge_destination.id = e.disch_to_loctn_cd
		final_reply_out->qual[d.seq].discharge_destination.name = uar_get_code_display(e.disch_to_loctn_cd)
		final_reply_out->qual[d.seq].discharge_date_time = e.disch_dt_tm
		final_reply_out->qual[d.seq].discharge_unit.id = e.loc_nurse_unit_cd
		final_reply_out->qual[d.seq].discharge_unit.name = uar_get_code_display(e.loc_nurse_unit_cd)
		final_reply_out->qual[d.seq].encounter.discharge_date_time = e.disch_dt_tm
		if(e.arrive_dt_tm != null)
			final_reply_out->qual[d.seq].encounter.encounter_date_time = e.arrive_dt_tm
		else
			final_reply_out->qual[d.seq].encounter.encounter_date_time = e.reg_dt_tm
		endif
		final_reply_out->qual[d.seq].encounter.location.bed.id = e.loc_bed_cd
		final_reply_out->qual[d.seq].encounter.location.bed.name = uar_get_code_display(e.loc_bed_cd)
		final_reply_out->qual[d.seq].encounter.location.room.id = e.loc_room_cd
		final_reply_out->qual[d.seq].encounter.location.room.name = uar_get_code_display(e.loc_room_cd)
		final_reply_out->qual[d.seq].encounter.location.unit.id = e.loc_nurse_unit_cd
		final_reply_out->qual[d.seq].encounter.location.unit.name = uar_get_code_display(e.loc_nurse_unit_cd)
		final_reply_out->qual[d.seq].encounter.location.hospital.id = e.loc_facility_cd
		final_reply_out->qual[d.seq].encounter.location.hospital.name = uar_get_code_display(e.loc_facility_cd)
		final_reply_out->qual[d.seq].inpatient_date_time = e.inpatient_admit_dt_tm
		final_reply_out->qual[d.seq].patient_class.id = e.encntr_type_class_cd
		final_reply_out->qual[d.seq].patient_class.name = uar_get_code_display(e.encntr_type_class_cd)
		final_reply_out->qual[d.seq].encounter.encounter_type.id = e.encntr_type_cd
		final_reply_out->qual[d.seq].encounter.encounter_type.name = uar_get_code_display(e.encntr_type_cd)
		final_reply_out->qual[d.seq].encounter.patient_class.id = e.encntr_type_class_cd
		final_reply_out->qual[d.seq].encounter.patient_class.name = uar_get_code_display(e.encntr_type_class_cd)
 
		;OMF Encntr
		final_reply_out->qual[d.seq].total_charges = oes.total_accum_charges
		final_reply_out->qual[d.seq].total_cost = oes.total_act_cost
	with nocounter
 
	; Get admin unit from encntr_loc_hist
	select into "nl:"
	from (dummyt d with seq = size(final_reply_out->qual,5))
		, encntr_loc_hist elh
	plan d
	join elh where elh.encntr_id = final_reply_out->qual[d.seq].encounter.encounter_id
	order by d.seq,elh.transaction_dt_tm
	head d.seq
		check = 0
	detail
		if(check = 0)
			final_reply_out->qual[d.seq].admit_unit.id = elh.loc_nurse_unit_cd
			final_reply_out->qual[d.seq].admit_unit.name = uar_get_code_display(elh.loc_nurse_unit_cd)
			check = 1
		endif
	with nocounter
 
	; Get encntr & person aliases
	select into "nl:"
	from (dummyt d with seq = size(final_reply_out->qual,5))
	, encntr_alias ea
	plan d
	join ea
    where ea.encntr_id = final_reply_out->qual[d.seq].encounter.encounter_id
		and ea.encntr_alias_type_cd in (c_fin_encntr_alias_type_cd, c_mrn_encntr_alias_type_cd)
		and ea.active_ind = 1
		and ea.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime)
		and ea.end_effective_dt_tm >= cnvtdatetime(curdate,curtime)
	 detail
		if(ea.encntr_alias_type_cd = c_mrn_encntr_alias_type_cd)
			final_reply_out->qual[d.seq].patient.mrn = ea.alias
		else
			if(final_reply_out->qual[d.seq].financial_number = "")
				final_reply_out->qual[d.seq].financial_number = ea.alias
				final_reply_out->qual[d.seq].encounter.financial_number = ea.alias
			endif
 
			if(final_reply_out->qual[d.seq].encounter.financial_number = "")
				final_reply_out->qual[d.seq].financial_number  = ea.alias
				final_reply_out->qual[d.seq].encounter.financial_number = ea.alias
			endif
		endif
	with nocounter
 
	; Get birthweight - check person_patient table first
	select into "nl:"
		pp.birth_weight
		,pp.birth_weight_units_cd
	from (dummyt d with seq = size(final_reply_out->qual,5))
	, person_patient pp
	plan d
	join pp where pp.person_id = outerjoin(final_reply_out->qual[d.seq].patient.patient_id)
	detail
		if(pp.birth_weight > 0)
			final_reply_out->qual[d.seq].birth_weight = pp.birth_weight
			final_reply_out->qual[d.seq].birth_weight_units.name  = uar_get_code_display(pp.birth_weight_units_cd)
			final_reply_out->qual[d.seq].birth_weight_units.id = pp.birth_weight_units_cd
		endif
	with nocounter
 
	; If birthweight not found on person_patient, check clinical_event
	select into "nl:"
		ce.result_val
		,ce.result_units_cd
	from (dummyt d with seq = size(final_reply_out->qual,5))
	, clinical_event ce
	plan d where final_reply_out->qual[d.seq].birth_weight = 0.0
	join ce	where ce.encntr_id =  final_reply_out->qual[d.seq].encounter.encounter_id
				and ce.person_id = final_reply_out->qual[d.seq].patient.patient_id
				and ce.view_level = 1
				and ce.valid_until_dt_tm > cnvtdatetime(curdate, curtime)
				and ce.event_cd = c_birthweight_event_cd
	detail
		final_reply_out->qual[d.seq].birth_weight = cnvtreal(ce.result_val)
		final_reply_out->qual[d.seq].birth_weight_units.name  = uar_get_code_display(ce.result_units_cd)
		final_reply_out->qual[d.seq].birth_weight_units.id = ce.result_units_cd
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("PostAmble Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end ;End Sub
 
end
go
 
 
