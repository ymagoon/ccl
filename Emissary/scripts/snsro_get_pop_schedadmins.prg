/*******************************************************************************
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
********************************************************************************
      Source file name: snsro_get_pop_schedadmins.prg
      Object name:      snsro_get_pop_schedadmins
      Program purpose:  Get list of scheduled medication admins
      Executing from:   MPages Discern Web Service
********************************************************************************
                    MODIFICATION CONTROL LOG
********************************************************************************
  Mod 	Date     	Engineer             	Comment
  ------------------------------------------------------------------------------
  001	04/09/18	RJC						Initial Write
  002   04/17/18	DJP						Added string Birthdate to Patient
  003	04/23/18	RJC						Added strengthdose and strengthdose unit to ingredient object
  004	05/09/18	RJC						Moved GetDateTime function to snsro_common
  005	06/20/18	RJC						Added strength to ingredient list
  006 	08/14/18 	RJC						Made expand clause variable depending on number of elements in record
  007   08/28/18 	STV						Moved dates init to the GetDateTime function
  008 	10/18/18 	RJC						Outerjoin on person_alias table
*******************************************************************************/
drop program snsro_get_pop_schedadmins go
create program snsro_get_pop_schedadmins
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username:" = ""        	;Required
		, "From DateTime:" = ""		;Required
		, "To DateTime:" = ""		;Optional - set an hour ahead of FromDateTime if not set
		, "IncludeRxNorm" = ""		;Optional - default to false
		, "IncludeNDC" = ""			;Optional - default to false
		, "MedicationList" = ""		;Optional
		, "LocationList" = ""		;Optional
		, "Debug Flag:" = ""		;Optional
		, "TimeMax" = ""			;Just used for debugging
 
with OUTDEV, USERNAME, FROM_DTTM, TO_DTTM, INC_RXNORM, INC_NDC, MED_LIST, LOC_LIST, DEBUG_FLAG,TIME_MAX
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.16.6.1"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
;380043 - rx_get_order_action
free record 380043_req
record 380043_req (
  1 order_id = f8
  1 get_all_ind = i2
  1 get_review_decision_ind = i2
  1 on_admin_ind = i2
)
free record 380043_rep
record 380043_rep (
   1 med_order_type_cd = f8
   1 last_core_action_sequence = i4
   1 catalog_cd = f8
   1 orig_order_dt_tm = dq8
   1 orig_order_tz = i4
   1 action_list [* ]
     2 action_sequence = i4
     2 action_type_cd = f8
     2 communication_type_cd = f8
     2 order_provider_id = f8
     2 action_personnel_id = f8
     2 effective_dt_tm = dq8
     2 action_dt_tm = dq8
     2 needs_verify_flag = i2
     2 action_rejected_ind = i2
     2 updt_task = f8
     2 effective_tz = i4
     2 action_tz = i4
     2 order_dt_tm = dq8
     2 order_tz = i4
     2 ingred_list [* ]
       3 comp_sequence = i4
       3 catalog_cd = f8
       3 synonym_id = f8
       3 order_mnemonic = vc
       3 ordered_as_mnemonic = vc
       3 ordered_as_synonym_id = f8
       3 hna_order_mnemonic = vc
       3 strength = f8
       3 strength_unit = f8
       3 volume = f8
       3 volume_unit = f8
       3 freetext_dose = vc
       3 freq_cd = f8
       3 multum_id = vc
       3 rx_mask = i2
       3 generic_name = vc
       3 orderable_type_flag = i2
       3 clinically_significant_flag = i2
       3 include_in_total_volume_flag = i2
       3 ordered_dose = f8
       3 ordered_dose_unit = f8
       3 oe_format_id = f8
       3 real_rx_mask = i4
       3 catalog_description = vc
       3 catalog_type_cd = f8
       3 alt_sel_category_id = f8
       3 synonym_mnemonic = vc
       3 dose_calc_long_text_id = f8
       3 ingred_source_flag = i4
       3 dose_adjustment_display = c100
       3 product_list [* ]
         4 item_id = f8
         4 order_sentence_id = f8
         4 dose_quantity = f8
         4 dose_quantity_unit_cd = f8
         4 tnf_id = f8
         4 product_seq = i4
         4 order_alert1_cd = f8
         4 order_alert2_cd = f8
         4 tnf_shell_item_id = f8
         4 tnf_cost = f8
         4 tnf_description = vc
         4 tnf_ndc = vc
         4 tnf_pkg_qty_per_pkg = f8
         4 tnf_pkg_disp_more_ind = i2
         4 on_admin_ind = i2
         4 unrounded_dose_qty = f8
         4 strength_with_overfill = f8
         4 strength_with_overfill_unit_cd = f8
         4 volume_with_overfill = f8
         4 volume_with_overfill_unit_cd = f8
         4 dose_quantity_text = c150
         4 product_dose_list [* ]
           5 order_product_dose_id = f8
           5 item_id = f8
           5 ingred_sequence = i4
           5 tnf_id = f8
           5 schedule_sequence = i2
           5 dose_quantity = f8
           5 dose_quantity_unit_cd = f8
           5 unrounded_dose_quantity = f8
         4 catalog_cd = f8
         4 catalog_description = vc
         4 compound_flag = i2
       3 normalized_rate = f8
       3 normalized_rate_unit_cd = f8
       3 concentration = f8
       3 concentration_unit_cd = f8
       3 thera_sub_flag = i4
       3 dosing_capacity = i4
       3 days_of_administration_display = c100
       3 ingred_dose_list [* ]
         4 order_ingred_dose_id = f8
         4 ingred_sequence = i4
         4 dose_sequence = i2
         4 schedule_sequence = i2
         4 strength_dose_value = f8
         4 strength_dose_display = c100
         4 strength_dose_unit_cd = f8
         4 volume_dose_value = f8
         4 volume_dose_display = c100
         4 volume_dose_unit_cd = f8
         4 ordered_dose_value = f8
         4 ordered_dose_display = c100
         4 ordered_dose_unit_cd = f8
         4 ordered_dose_type_flag = i4
       3 catalog_active_ind = i2
     2 action_qualifier_cd = f8
     2 contributor_system_cd = f8
     2 decision_source_flag = i2
     2 decision_value_flag = i2
     2 decision_reason_cd = f8
     2 override_on_verify_ind = i2
     2 deciding_prsnl_id = f8
     2 order_schedule_precision_bit = i4
     2 order_status_cd = f8
     2 source_dot_order_id = f8
     2 source_dot_action_seq = i4
     2 source_protocol_action_seq = i4
     2 ordered_dose_type_flag = i4
     2 supervising_provider_id = f8
     2 order_status_reason_bit = i4
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
 )
 
; Final Reply
free record schedadmin_reply_out
record schedadmin_reply_out(
	1 administrations[*]
		2 id	= f8
		2 status
			3 id = f8
			3 name = vc
		2 scheduled_date_time = dq8
		2 dose = f8
		2 dose_unit
			3 id = f8
			3 name = vc
		2 created_updated_dttm = dq8
		2 orders
			3 medication_order_id = f8
			3 medication_id = f8
			3 medication_name = vc
			3 medication_order_status
				4 id = f8
				4 name = vc
			3 medication_ordering_provider
				4 provider_id = f8
				4 provider_name = vc
			3 NDC = vc
			3 rx_norms[*]
				4 code = vc
				4 code_type = vc
				4 term_type = vc
			3 ingredients[*]
				4 AHFS = vc 				;Ignored in Cerner
				4 ingredient_id = f8
				4 ingredient_name = vc
				4 ingredient_rx_norms[*]
					5 code = vc
					5 code_type = vc
					5 term_type = vc
				4 NDC = vc
				4 dose = f8
				4 dose_unit
					5 id = f8
					5 name = vc
				4 strength_dose = f8
				4 strength_dose_unit
					5 id = f8
					5 name = vc
				4 strength = 	f8			;005
				4 strength_unit				;005
					5 id = f8
					5 name = vc
			3 other_details					;Ignoredin Emissary
				4 template_order_id = f8
		2 patient
			3 patient_id = f8
			3 display_name = vc
			3 last_name = vc
			3 first_name = vc
			3 middle_name = vc
			3 MRN = vc
			3 birth_date_time = dq8
			3 gender
				4 id = f8
				4 name = vc
			3 sDOB = c10 ;002
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
				4 bed = vc
					5 id = f8
					5 name = vc
	1 audit
		2 user_id             = f8
		2 user_firstname          = vc
		2 user_lastname           = vc
		2 patient_id            = f8
		2 patient_firstname         = vc
		2 patient_lastname          = vc
		2 service_version         = vc
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
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Input
declare sUserName			= vc with protect, noconstant("")
declare sFromDateTime		= vc with protect, noconstant("")
declare sToDateTime			= vc with protect, noconstant("")
declare sMedicationList 	= vc with protect, noconstant("")
declare dMedicationList[1]	= f8 with protect
declare iIncRxNorm			= i2 with protect, noconstant(0)
declare iIncNDC				= i2 with protect, noconstant(0)
declare sLocationList		= vc with protect, noconstant("")
declare dLocationList[1]	= f8 with protect
declare iDebugFlag			= i2 with protect, noconstant(0)
declare iTimeMax			= i4 with protect, noconstant(0)
 
; Other
declare qFromDateTime		= dq8 with protect, noconstant(0)
declare qToDateTime			= dq8 with protect, noconstant(0)
declare iTimeDiff			= i4 with protect, noconstant(0)
declare UTCpos 				= i2 with protect, noconstant(0)
 
; Constants
declare UTCmode							= i2 with protect, constant(CURUTC)
declare c_scheduled_task_class_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",6025,"SCH"))
declare c_medication_task_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",6026,"MED"))
declare c_facility_location_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING", 222,"FACILITY"))
declare c_inpatient_pharmacy_type_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",4500,"INPATIENT"))
declare c_mrn_alias_type_cd				= f8 with protect, constant(uar_get_code_by("MEANING",4,"MRN"))
declare c_fin_alias_type_cd				= f8 with protect, constant(uar_get_code_by("MEANING",319,"FIN NBR"))
declare c_ndc_med_identifier_type_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",11000,"NDC"))
declare c_inpatient_pharm_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",4500,"INPATIENT"))
declare c_rxnorm_map_type_cd			= f8 with protect, constant(uar_get_code_by("MEANING",29223,"MULTUM=RXN"))
/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ValidateMedicationList(null)	= null with protect
declare ValidateLocationList(null)		= null with protect
declare GetTaskList(null)				= i2 with protect
declare GetOrderDetails(null)			= i2 with protect ;380043 - rx_get_order_action
declare GetNdc(synonym = f8) 			= vc with protect
declare GetRxNorm(null)					= null with protect
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
;Inputs
set sUserName					= trim($USERNAME, 3)
set sFromDateTime				= trim($FROM_DTTM,3)
set sToDateTime					= trim($TO_DTTM,3)
set sMedicationList				= trim($MED_LIST,3)
set iIncRxNorm					= cnvtint($INC_RXNORM)
set iIncNDC						= cnvtint($INC_NDC)
set sLocationList				= trim($LOC_LIST,3)
set iDebugFlag					= cnvtreal($DEBUG_FLAG)
set iTimeMax					= cnvtint($TIME_MAX)
 
; TimeMax
if(iTimeMax = 0)
	set iTimeMax = 3600 ;59min 59sec
endif
 
; FromDateTime
if(sFromDateTime > " ")
	set qFromDateTime = GetDateTime(sFromDateTime)
else
	set qFromDateTime = cnvtlookbehind(build('"',iTimeMax, ',S"'),cnvtdatetime(curdate,curtime3))
endif
 
; ToDateTime
if(sToDateTime > " ")
	set qToDateTime = GetDateTime(sToDateTime)
else
	set qToDateTime = cnvtlookahead(build('"',iTimeMax, ',S"'),qFromDateTime)
endif
 
 
if(idebugFlag > 0)
	call echo(build("sUserName -> ",sUserName))
	call echo(build("sFromDateTime -> ",sFromDateTime))
	call echo(build("sToDateTime -> ",sToDateTime))
	call echo(build("qFromDateTime -> ",format(qFromDateTime,"MM/DD/YY HH:MM:SS;;q")))
	call echo(build("qToDateTime -> ",format(qToDateTime,"MM/DD/YY HH:MM:SS;;q")))
	call echo(build("sMedicationList -> ",sMedicationList))
	call echo(build("iIncRxNorm -> ",iIncRxNorm))
	call echo(build("iIncNDC -> ",iIncNDC))
	call echo(build("sLocationList -> ",sLocationList))
	call echo(build("iTimeMax -> ",iTimeMax))
endif
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Validate username
set iRet = PopulateAudit(sUserName, 0.0, schedadmin_reply_out, sVersion)
if(iRet = 0)
  call ErrorHandler2("VALIDATE", "F", "GET POP SCHEDADMINS", "Invalid User for Audit.",
  "1001",build("Invalid user: ",sUserName), schedadmin_reply_out)
  go to exit_script
endif
 
; Validate time parameters
if(qFromDateTime > qToDateTime)
	call ErrorHandler2("VALIDATE", "F", "GET POP SCHEDADMINS", "FromDateTime is greater than ToDateTime",
	"2010",build( "FromDateTime is greater than ToDateTime"), schedadmin_reply_out)
	go to exit_script
endif
 
; Validate Time Span is within threshold
set iRet = ThreshHoldValidator(iTimeMax,"s",qFromDateTime,qToDateTime)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "GET POP SCHEDADMINS", "DateTime Range Is too large. Refine dates entered.",
	"2010",build( "DateTime Range Is too large. Refine dates entered."), schedadmin_reply_out)
	go to exit_script
endif
 
; Validate Medication List if provided
if(sMedicationList > " ")
	call ValidateMedicationList(null)
endif
 
; Validate Location List if provided
if(sLocationList > " ")
	call ValidateLocationList(null)
endif
 
; Get Task List
set iRet = GetTaskList(null)
if(iRet = 0)
	call ErrorHandler2("SUCCESS", "S", "GET POP SCHEDADMINS", "No records found.",
	"0000","No records found.", schedadmin_reply_out)
	go to exit_script
endif
 
; Get Order Details - 380043 - rx_get_order_action
set iRet = GetOrderDetails(null)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "GET POP SCHEDADMINS", "Could not retrieve order details (380043).",
	"9999","Could not retrieve order details (380043).", schedadmin_reply_out)
	go to exit_script
endif
 
; Get RxNorm identifiers if requested
if(iIncRxNorm)
	call GetRxNorm(null)
endif
 
; Update audit with success
call ErrorHandler2("SUCCESS", "S", "GET POP SCHEDADMINS", "Operation completed successfully.",
"0000","Operation completed successfully.", schedadmin_reply_out)
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(schedadmin_reply_out)
if(idebugFlag > 0)
	call echorecord(schedadmin_reply_out)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_pop_schedadmins.json")
	call echo(build2("_file : ", _file))
	call echojson(schedadmin_reply_out, _file, 0)
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
;  Name: ValidateMedicationList(null) = null
;  Description: Validate the medication list provided is valid
**************************************************************************/
subroutine ValidateMedicationList(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateMedicationList Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare str = vc
	set str = "-"
	set num = 1
 
	while(str != "")
		set str = trim(piece(sMedicationList,",",num,""),3)
		if(str != "")
			set stat = memrealloc(dMedicationList,num,"f8")
			set dMedicationList[num] = cnvtreal(str)
			set num = num + 1
		endif
 	endwhile
 
 	for(i = 1 to size(dMedicationList,5))
 		set check = 0
		select into "nl:"
		from order_catalog_synonym ocs
		where ocs.synonym_id = dMedicationList[i]
		detail
 			check = 1
		with nocounter
 
		if(check = 0)
			call ErrorHandler2("VALIDATE", "F", "GET POP SCHEDADMINS", "Invalid Medication.",
			"9999",build2("Invalid Medication: ",dMedicationList[i]), schedadmin_reply_out)
			go to exit_script
		endif
	endfor
 
	if(idebugFlag > 0)
		call echo(concat("ValidateMedicationList Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(check)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: ValidateLocationList(null) = null
;  Description: Validate the location list provided is valid
**************************************************************************/
subroutine ValidateLocationList(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateLocationList Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare str = vc
	set str = "-"
	set num = 1
 
	while(str != "")
		set str = trim(piece(sLocationList,",",num,""),3)
		if(str != "")
			set stat = memrealloc(dLocationList,num,"f8")
			set dLocationList[num] = cnvtreal(str)
			set num = num + 1
		endif
	endwhile
 
	for(i = 1 to size(dLocationList,5))
 		set check = 0
 
		select into "nl:"
		from location l
		where l.location_cd = dLocationList[i]
			and l.location_type_cd = c_facility_location_type_cd
		detail
			check = 1
		with nocounter
 
		if(check = 0)
			call ErrorHandler2("VALIDATE", "F", "GET POP SCHEDADMINS", "Invalid Location.",
			"9999",build2("Invalid Location: ",dLocationList[i]), schedadmin_reply_out)
			go to exit_script
		endif
	endfor
 
	if(idebugFlag > 0)
		call echo(concat("ValidateLocationList Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(check)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetTaskList(null) = i2
;  Description: Get the admin
**************************************************************************/
subroutine GetTaskList(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetTaskList Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set taskCnt = 0
	set medSize = size(dMedicationList,5)
	set locSize = size(dLocationList,5)
	declare mnum = i4
	declare lnum = i4
 
	;Set expand control value - 006
	if(medSize > 200 or locSize > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
 	select
 		; Med list and Location list provided
 		if(sMedicationList > " " and sLocationList > " ")
 			from task_activity ta
		 	, orders o
		 	, encounter e
		 	, person p
		 	, person_alias pa
		 	, encntr_alias ea
		 	plan ta where ta.updt_dt_tm between cnvtdatetime(qFromDateTime) and cnvtdatetime(qToDateTime)
		 		and ta.active_ind = 1
		 		and ta.task_class_cd = c_scheduled_task_class_cd
		 		and ta.task_type_cd = c_medication_task_type_cd
		 	join o where o.order_id = ta.order_id
		 		and expand(mnum,1,medSize,o.synonym_id,dMedicationList[mnum])
		 	join e where e.encntr_id = ta.encntr_id
		 		and expand(lnum,1,locSize,e.loc_facility_cd,dLocationList[lnum])
		 	join p where p.person_id = ta.person_id
		 	join pa where pa.person_id = outerjoin(p.person_id)
		 		and pa.active_ind = outerjoin(1)
		 		and pa.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		 		and pa.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
		 		and pa.person_alias_type_cd = outerjoin(c_mrn_alias_type_cd)
		 	join ea where ea.encntr_id = outerjoin(e.encntr_id)
		 		and ea.active_ind = outerjoin(1)
		 		and ea.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		 		and ea.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
		 		and ea.encntr_alias_type_cd = outerjoin(c_fin_alias_type_cd)
 
 		; Med list provided
 		elseif(sMedicationList > " " and sLocationList = "")
 			from task_activity ta
		 	, orders o
		 	, encounter e
		 	, person p
		 	, person_alias pa
		 	, encntr_alias ea
		 	plan ta where ta.updt_dt_tm between cnvtdatetime(qFromDateTime) and cnvtdatetime(qToDateTime)
		 		and ta.active_ind = 1
		 		and ta.task_class_cd = c_scheduled_task_class_cd
		 		and ta.task_type_cd = c_medication_task_type_cd
		 	join o where o.order_id = ta.order_id
		 		and expand(mnum,1,medSize,o.synonym_id,dMedicationList[mnum])
		 	join e where e.encntr_id = ta.encntr_id
		 	join p where p.person_id = ta.person_id
		 	join pa where pa.person_id = outerjoin(p.person_id)
		 		and pa.active_ind = outerjoin(1)
		 		and pa.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		 		and pa.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
		 		and pa.person_alias_type_cd = outerjoin(c_mrn_alias_type_cd)
		 	join ea where ea.encntr_id = outerjoin(e.encntr_id)
		 		and ea.active_ind = outerjoin(1)
		 		and ea.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		 		and ea.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
		 		and ea.encntr_alias_type_cd = outerjoin(c_fin_alias_type_cd)
 
		; Location list provided
 		elseif(sMedicationList = "" and sLocationList > " ")
 			from task_activity ta
		 	, orders o
		 	, encounter e
		 	, person p
		 	, person_alias pa
		 	, encntr_alias ea
		 	plan ta where ta.updt_dt_tm between cnvtdatetime(qFromDateTime) and cnvtdatetime(qToDateTime)
		 		and ta.active_ind = 1
		 		and ta.task_class_cd = c_scheduled_task_class_cd
		 		and ta.task_type_cd = c_medication_task_type_cd
		 	join o where o.order_id = ta.order_id
		 	join e where e.encntr_id = ta.encntr_id
		 		and expand(lnum,1,locSize,e.loc_facility_cd,dLocationList[lnum])
		 	join p where p.person_id = ta.person_id
		 	join pa where pa.person_id = outerjoin(p.person_id)
		 		and pa.active_ind = outerjoin(1)
		 		and pa.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		 		and pa.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
		 		and pa.person_alias_type_cd = outerjoin(c_mrn_alias_type_cd)
		 	join ea where ea.encntr_id = outerjoin(e.encntr_id)
		 		and ea.active_ind = outerjoin(1)
		 		and ea.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		 		and ea.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
		 		and ea.encntr_alias_type_cd = outerjoin(c_fin_alias_type_cd)
 
 		; No filters provided
 		else
 			from task_activity ta
		 	, orders o
		 	, encounter e
		 	, person p
		 	, person_alias pa
		 	, encntr_alias ea
		 	plan ta where ta.updt_dt_tm between cnvtdatetime(qFromDateTime) and cnvtdatetime(qToDateTime)
		 		and ta.active_ind = 1
		 		and ta.task_class_cd = c_scheduled_task_class_cd
		 		and ta.task_type_cd = c_medication_task_type_cd
		 	join o where o.order_id = ta.order_id
		 	join e where e.encntr_id = ta.encntr_id
		 	join p where p.person_id = ta.person_id
		 	join pa where pa.person_id = outerjoin(p.person_id)
		 		and pa.active_ind = outerjoin(1)
		 		and pa.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		 		and pa.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
		 		and pa.person_alias_type_cd = outerjoin(c_mrn_alias_type_cd)
		 	join ea where ea.encntr_id = outerjoin(e.encntr_id)
		 		and ea.active_ind = outerjoin(1)
		 		and ea.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		 		and ea.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
		 		and ea.encntr_alias_type_cd = outerjoin(c_fin_alias_type_cd)
 		endif
 	into "nl:"
 	head report
 		x = 0
 	detail
 		x = x + 1
 		stat = alterlist(schedadmin_reply_out->administrations,x)
 
 		schedadmin_reply_out->administrations[x].id = ta.task_id
 		schedadmin_reply_out->administrations[x].status.id = ta.task_status_cd
 		schedadmin_reply_out->administrations[x].status.name = uar_get_code_display(ta.task_status_cd)
 		schedadmin_reply_out->administrations[x].created_updated_dttm = ta.updt_dt_tm
 		schedadmin_reply_out->administrations[x].scheduled_date_time = ta.scheduled_dt_tm
 		schedadmin_reply_out->administrations[x].orders.medication_order_id = ta.order_id
 		schedadmin_reply_out->administrations[x].orders.medication_id = o.synonym_id
 		schedadmin_reply_out->administrations[x].orders.medication_name = o.order_mnemonic
 		schedadmin_reply_out->administrations[x].orders.medication_order_status.id = o.order_status_cd
 		schedadmin_reply_out->administrations[x].orders.medication_order_status.name = uar_get_code_display(o.order_status_cd)
 		schedadmin_reply_out->administrations[x].orders.other_details.template_order_id = o.template_order_id
 
		schedadmin_reply_out->administrations[x].patient.patient_id = p.person_id
		schedadmin_reply_out->administrations[x].patient.MRN = pa.alias
		schedadmin_reply_out->administrations[x].patient.birth_date_time = p.birth_dt_tm
		schedadmin_reply_out->administrations[x].patient.first_name = p.name_first
		schedadmin_reply_out->administrations[x].patient.last_name = p.name_last
		schedadmin_reply_out->administrations[x].patient.middle_name = p.name_middle
		schedadmin_reply_out->administrations[x].patient.display_name = p.name_full_formatted
		schedadmin_reply_out->administrations[x].patient.gender.id = p.sex_cd
		schedadmin_reply_out->administrations[x].patient.gender.name = uar_get_code_display(p.sex_cd)
		schedadmin_reply_out->administrations[x].patient.sDOB =
				datetimezoneformat(p.birth_dt_tm,p.birth_tz,"YYYY-MM-DD",curtimezonedef) ;002
 
		schedadmin_reply_out->administrations[x].encounter.encounter_id = e.encntr_id
		schedadmin_reply_out->administrations[x].encounter.financial_number = ea.alias
		schedadmin_reply_out->administrations[x].encounter.encounter_type.id = e.encntr_type_cd
		schedadmin_reply_out->administrations[x].encounter.encounter_type.name = uar_get_code_display(e.encntr_type_cd)
		schedadmin_reply_out->administrations[x].encounter.encounter_date_time = e.reg_dt_tm
		schedadmin_reply_out->administrations[x].encounter.discharge_date_time = e.disch_dt_tm
		schedadmin_reply_out->administrations[x].encounter.patient_class.id = e.encntr_type_class_cd
		schedadmin_reply_out->administrations[x].encounter.patient_class.name = uar_get_code_display(e.encntr_type_class_cd)
		schedadmin_reply_out->administrations[x].encounter.location.hospital.id = e.loc_facility_cd
		schedadmin_reply_out->administrations[x].encounter.location.hospital.name = uar_get_code_display(e.loc_facility_cd)
		schedadmin_reply_out->administrations[x].encounter.location.unit.id = e.loc_nurse_unit_cd
		schedadmin_reply_out->administrations[x].encounter.location.unit.name = uar_get_code_display(e.loc_nurse_unit_cd)
		schedadmin_reply_out->administrations[x].encounter.location.room.id = e.loc_room_cd
		schedadmin_reply_out->administrations[x].encounter.location.room.name = uar_get_code_display(e.loc_room_cd)
		schedadmin_reply_out->administrations[x].encounter.location.bed.id = e.loc_bed_cd
		schedadmin_reply_out->administrations[x].encounter.location.bed.name = uar_get_code_display(e.loc_bed_cd)
 	foot report
 		taskCnt = x
 	with nocounter, expand = value(exp)
 
 	; Get NDC if requested
 	if(taskCnt)
 		if(iIncNDC)
 			for(i = 1 to taskCnt)
 				set schedadmin_reply_out->administrations[i].orders.NDC =
 				GetNdc(schedadmin_reply_out->administrations[i].orders.medication_id)
 			endfor
 		endif
 	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetTaskList Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(taskCnt)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetOrderDetails(null) = i2  ;380043 - rx_get_order_action
;  Description: Gets order details
**************************************************************************/
subroutine GetOrderDetails(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetOrderDetails Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 380000
	set iTask = 380000
	set iRequest = 380043
 
	for(i = 1 to size(schedadmin_reply_out->administrations,5))
		; Set request items
		set 380043_req->order_id = schedadmin_reply_out->administrations[i].orders.other_details.template_order_id
		set 380043_req->get_all_ind = 1
		set 380043_req->on_admin_ind = 1
		set 380043_req->get_review_decision_ind = 1
 
		; Execute request
		set stat = tdbexecute(iApplication,iTask,iRequest,"REC",380043_req,"REC",380043_rep)
 
		; Process request data if successful
		if(380043_rep->status_data.status = "S")
			set iValidate = 1
 
			for(a = 1 to size(380043_rep->action_list,5))
				if(380043_rep->last_core_action_sequence = 380043_rep->action_list[a].action_sequence)
					set schedadmin_reply_out->administrations[i].orders.medication_ordering_provider.provider_id =
					380043_rep->action_list[a].order_provider_id
 
					set schedadmin_reply_out->administrations[i].orders.medication_ordering_provider.provider_name =
					GetNameFromPrsnID(380043_rep->action_list[a].order_provider_id)
 
					;Ingredients
					set ingredSize = size(380043_rep->action_list[a].ingred_list,5)
					set stat = alterlist(schedadmin_reply_out->administrations[i].orders.ingredients,ingredSize)
					for(ing = 1 to ingredSize)
 
						set schedadmin_reply_out->administrations[i].dose = 380043_rep->action_list[a].ingred_list[ing].volume
 
						set schedadmin_reply_out->administrations[i].dose_unit.id =
						380043_rep->action_list[a].ingred_list[ing].volume_unit
 
						set schedadmin_reply_out->administrations[i].dose_unit.name =
						uar_get_code_display(380043_rep->action_list[a].ingred_list[ing].volume_unit)
 
						set schedadmin_reply_out->administrations[i].orders.ingredients[ing].strength_dose =
						380043_rep->action_list[a].ingred_list[ing].strength
 
						set schedadmin_reply_out->administrations[i].orders.ingredients[ing].strength_dose_unit.id =
						380043_rep->action_list[a].ingred_list[ing].strength_unit
 
						set schedadmin_reply_out->administrations[i].orders.ingredients[ing].strength_dose_unit.name =
						uar_get_code_display(380043_rep->action_list[a].ingred_list[ing].strength_unit)
 
						set schedadmin_reply_out->administrations[i].orders.ingredients[ing].ingredient_id =
						380043_rep->action_list[a].ingred_list[ing].synonym_id
 
						if(iIncNDC)
							set schedadmin_reply_out->administrations[i].orders.ingredients[ing].NDC =
							GetNdc(380043_rep->action_list[a].ingred_list[ing].synonym_id)
						endif
 
						set schedadmin_reply_out->administrations[i].orders.ingredients[ing].ingredient_name =
						380043_rep->action_list[a].ingred_list[ing].order_mnemonic
 
						;Get Med Definition strength ;005
						if(size(380043_rep->action_list[a].ingred_list[ing].product_list,5) > 0)
							select into "nl:"
							from medication_definition md
							where md.item_id = 380043_rep->action_list[a].ingred_list[ing].product_list[1].item_id
							detail
								schedadmin_reply_out->administrations[i].orders.ingredients[ing].strength = md.strength
								schedadmin_reply_out->administrations[i].orders.ingredients[ing].strength_unit.id = md.strength_unit_cd
								schedadmin_reply_out->administrations[i].orders.ingredients[ing].strength_unit.name =
								uar_get_code_display(md.strength_unit_cd)
							with nocounter
						endif
					endfor
				endif
			endfor
		endif
	endfor
 
	if(idebugFlag > 0)
		call echo(concat("GetOrderDetails Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetNdc(synonym = f8) = vc
;  Description: Get medication details
**************************************************************************/
subroutine GetNdc(synonym)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetNdc Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare ndc = vc
 
	select into "nl:"
	from synonym_item_r sir
	, med_identifier mi
	plan sir where sir.synonym_id = synonym
	join mi where mi.item_id = sir.item_id
		and mi.med_identifier_type_cd = c_ndc_med_identifier_type_cd
		and mi.pharmacy_type_cd = c_inpatient_pharm_type_cd
		and mi.active_ind = 1
		and mi.sequence = 1
		and mi.med_product_id > 0
	detail
		ndc = trim(mi.value,3)
	with nocounter
 
	return(ndc)
 
	if(idebugFlag > 0)
		call echo(concat("GetNdc Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(ndc)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetRxNorm(null) = vc
;  Description: Get RxNorm values
**************************************************************************/
subroutine GetRxNorm(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetRxNorm Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	; Get med rxnorm
	for(i = 1 to size(schedadmin_reply_out->administrations,5))
		select into "nl:"
		from order_catalog_synonym ocs
		, cmt_cross_map ccm
		plan ocs where ocs.synonym_id = schedadmin_reply_out->administrations[i].orders.medication_id
		join ccm where ccm.concept_cki = ocs.concept_cki
			and ccm.map_type_cd = c_rxnorm_map_type_cd
		head report
			x = 0
		detail
			x = x + 1
			stat = alterlist(schedadmin_reply_out->administrations[i].orders.rx_norms,x)
 
			schedadmin_reply_out->administrations[i].orders.rx_norms[x].code = trim(ccm.source_identifier,3)
			schedadmin_reply_out->administrations[i].orders.rx_norms[x].code_type = "RXNORM"
			schedadmin_reply_out->administrations[i].orders.rx_norms[x].term_type = "RXNORM"
		with nocounter
 
		; Get ingredient rxnorm
		for(j = 1 to size(schedadmin_reply_out->administrations[i].orders.ingredients,5))
			select into "nl:"
			from order_catalog_synonym ocs
			, cmt_cross_map ccm
			plan ocs where ocs.synonym_id = schedadmin_reply_out->administrations[i].orders.ingredients[j].ingredient_id
			join ccm where ccm.concept_cki = ocs.concept_cki
				and ccm.map_type_cd = c_rxnorm_map_type_cd
			head report
				y = 0
			detail
				y = y + 1
				stat = alterlist(schedadmin_reply_out->administrations[i].orders.ingredients[j].ingredient_rx_norms,y)
 
				schedadmin_reply_out->administrations[i].orders.ingredients[j].ingredient_rx_norms[y].code = trim(ccm.source_identifier,3)
				schedadmin_reply_out->administrations[i].orders.ingredients[j].ingredient_rx_norms[y].code_type = "RXNORM"
				schedadmin_reply_out->administrations[i].orders.ingredients[j].ingredient_rx_norms[y].term_type = "RXNORM"
			with nocounter
		endfor
	endfor
 
	if(idebugFlag > 0)
		call echo(concat("GetRxNorm Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
end go
set trace notranslatelock go
