/***********************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

************************************************************************
      Source file name: snsro_get_pop_schedadmin.prg
      Object name:      vigilanz_get_pop_schedadmin
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
  009   01/07/19    STV                     switched to encounter MRN
  010	03/06/19	RJC						added parent order id
  011   03/25/19    STV                     Added order priority
  012   03/26/19    STV                     Removed task_class cd filtr and added medication_item_id
  013   04/04/19    STV                     Added task_class object
  014	04/17/19	RJC						Initrec added in ingredient object
  015	04/26/19	RJC						Changed dummyt refs to use expand instead
  016   04/29/19    STV                     added 115 timeout
  017   05/31/19    STV                     adjusted for getOrderIngredient array out of bounds error
  018   08/16/19    STV                     Adjusted the query to not hang in the order ingredient section
  019 	08/19/19	RJC						Added IV indicator check
  002   09/09/19    RJC                     Renamed file and object
  003   09/10/19    STV                     added IV task_type to filter
  004   01/29/20    STV                     Fix for child order_ingredients
*******************************************************************************/
;drop program snsro_get_pop_schedadmins go
drop program vigilanz_get_pop_schedadmin go
create program vigilanz_get_pop_schedadmin
 
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
		, "TimeMax" = 3600			;Just used for debugging
 
with OUTDEV, USERNAME, FROM_DTTM, TO_DTTM, INC_RXNORM, INC_NDC, MED_LIST, LOC_LIST, DEBUG_FLAG,TIME_MAX
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2"
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
; Final Reply
free record schedadmin_reply_out
record schedadmin_reply_out(
	1 admin_cnt = i4
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
			3 last_ingred_seq = i4
			3 pharm_order_priority = vc
			3 parent_order_id = f8
			3 medication_item_id = f8
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
				4 ingred_item_id = f8
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
				4 bed
					5 id = f8
					5 name = vc
		2 task_class
			3 description = vc
			3 id = f8
			3 name = vc
		2 dispense_hx[*]
			3 dispense_hx_id = f8
			3 dispense_dt_tm = dq8
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
declare qFromDateTime		= dq8 with protect
declare qToDateTime			= dq8 with protect
declare iTimeDiff			= i4 with protect, noconstant(0)
declare timeOutThreshold 	= i4 with protect, noconstant(115);setting to 115 seconds
declare queryStartTm 		= dq8
declare parent_order_ind = i2
 
; Constants
declare c_scheduled_task_class_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",6025,"SCH"))
declare c_medication_task_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",6026,"MED"))
declare c_facility_location_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING", 222,"FACILITY"))
declare c_inpatient_pharmacy_type_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",4500,"INPATIENT"))
declare c_mrn_encounter_alias_type_cd	= f8 with protect, constant(uar_get_code_by("MEANING",319,"MRN"))
declare c_fin_alias_type_cd				= f8 with protect, constant(uar_get_code_by("MEANING",319,"FIN NBR"))
declare c_ndc_med_identifier_type_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",11000,"NDC"))
declare c_inpatient_pharm_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",4500,"INPATIENT"))
declare c_rxnorm_map_type_cd			= f8 with protect, constant(uar_get_code_by("MEANING",29223,"MULTUM=RXN"))
declare c_iv_task_type_cd				= f8 with protect, constant(uar_get_code_by("MEANING",6026,"IV"))
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ValidateMedicationList(null)	= null with protect
declare ValidateLocationList(null)		= null with protect
declare GetTaskList(null)				= null with protect
declare GetOrderDetails(null)			= null with protect
declare GetNdc(null)	 				= null with protect
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
 
; Dates
set qFromDateTime = GetDateTime(sFromDateTime)
set qToDateTime = GetDateTime(sToDateTime)
 
if(iDebugFlag > 0)
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
call GetTaskList(null)
 
; Get Order Details
call GetOrderDetails(null)
 
; Get RxNorm identifiers if requested
if(iIncRxNorm)
	call GetRxNorm(null)
endif
 
; Get NDC if requested
if(iIncNDC)
	call GetNdc(null)
endif
 
; Update audit with success
call ErrorHandler2("SUCCESS", "S", "GET POP SCHEDADMINS", "Operation completed successfully.",
"0000","Operation completed successfully.", schedadmin_reply_out)
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(schedadmin_reply_out)
if(iDebugFlag > 0)
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
	if(iDebugFlag > 0)
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
 
	if(iDebugFlag > 0)
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
	if(iDebugFlag > 0)
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
 
	if(iDebugFlag > 0)
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
	if(iDebugFlag > 0)
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
 
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
 	select
 		; Med list and Location list provided
 		if(sMedicationList > " " and sLocationList > " ")
 			from task_activity ta
		 	, orders o
		 	, encounter e
		 	, person p
		 	, encntr_alias ea
		 	, enctnr_alias ea2
		 	plan ta where ta.updt_dt_tm between cnvtdatetime(qFromDateTime) and cnvtdatetime(qToDateTime)
		 		and ta.active_ind = 1
		 		and (ta.task_type_cd in(c_medication_task_type_cd,c_iv_task_type_cd)
		 			or ta.iv_ind = 1)
		 	join o where o.order_id = ta.order_id
		 		and expand(mnum,1,medSize,o.synonym_id,dMedicationList[mnum])
		 	join e where e.encntr_id = ta.encntr_id
		 		and expand(lnum,1,locSize,e.loc_facility_cd,dLocationList[lnum])
		 	join p where p.person_id = ta.person_id
		 	join ea where ea.encntr_id = outerjoin(e.encntr_id)
		 		and ea.active_ind = outerjoin(1)
		 		and ea.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		 		and ea.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
		 		and ea.encntr_alias_type_cd = outerjoin(c_fin_alias_type_cd)
		 	join ea2 where ea2.encntr_id = outerjoin(e.encntr_id)
		 		and ea2.active_ind = outerjoin(1)
		 		and ea2.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		 		and ea2.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
		 		and ea2.encntr_alias_type_cd = outerjoin(c_mrn_encounter_alias_type_cd)
 
 		; Med list provided
 		elseif(sMedicationList > " " and sLocationList = "")
 			from task_activity ta
		 	, orders o
		 	, encounter e
		 	, person p
		 	, encntr_alias ea
		 	, encntr_alias ea2
		 	plan ta where ta.updt_dt_tm between cnvtdatetime(qFromDateTime) and cnvtdatetime(qToDateTime)
		 		and ta.active_ind = 1
		 		and (ta.task_type_cd in(c_medication_task_type_cd,c_iv_task_type_cd)
		 			or ta.iv_ind = 1)
		 	join o where o.order_id = ta.order_id
		 		and expand(mnum,1,medSize,o.synonym_id,dMedicationList[mnum])
		 	join e where e.encntr_id = ta.encntr_id
		 	join p where p.person_id = ta.person_id
		 	join ea where ea.encntr_id = outerjoin(e.encntr_id)
		 		and ea.active_ind = outerjoin(1)
		 		and ea.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		 		and ea.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
		 		and ea.encntr_alias_type_cd = outerjoin(c_fin_alias_type_cd)
		 	join ea2 where ea2.encntr_id = outerjoin(e.encntr_id)
		 		and ea2.active_ind = outerjoin(1)
		 		and ea2.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		 		and ea2.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
		 		and ea2.encntr_alias_type_cd = outerjoin(c_mrn_encounter_alias_type_cd)
 
		; Location list provided
 		elseif(sMedicationList = "" and sLocationList > " ")
 			from task_activity ta
		 	, orders o
		 	, encounter e
		 	, person p
		 	, encntr_alias ea
		 	, encntr_alias ea2
		 	plan ta where ta.updt_dt_tm between cnvtdatetime(qFromDateTime) and cnvtdatetime(qToDateTime)
		 		and ta.active_ind = 1
		 		and (ta.task_type_cd in(c_medication_task_type_cd,c_iv_task_type_cd)
		 			or ta.iv_ind = 1)
		 	join o where o.order_id = ta.order_id
		 	join e where e.encntr_id = ta.encntr_id
		 		and expand(lnum,1,locSize,e.loc_facility_cd,dLocationList[lnum])
		 	join p where p.person_id = ta.person_id
		 	join ea where ea.encntr_id = outerjoin(e.encntr_id)
		 		and ea.active_ind = outerjoin(1)
		 		and ea.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		 		and ea.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
		 		and ea.encntr_alias_type_cd = outerjoin(c_fin_alias_type_cd)
		 	join ea2 where ea2.encntr_id = outerjoin(e.encntr_id)
		 		and ea2.active_ind = outerjoin(1)
		 		and ea2.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		 		and ea2.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
		 		and ea2.encntr_alias_type_cd = outerjoin(c_mrn_encounter_alias_type_cd)
 
 		; No filters provided
 		else
 			from task_activity ta
		 	, orders o
		 	, encounter e
		 	, person p
		 	, encntr_alias ea
		 	, encntr_alias ea2
		 	plan ta where ta.updt_dt_tm between cnvtdatetime(qFromDateTime) and cnvtdatetime(qToDateTime)
		 		and ta.active_ind = 1
		 		and (ta.task_type_cd in(c_medication_task_type_cd,c_iv_task_type_cd)
		 			or ta.iv_ind = 1)
		 	join o where o.order_id = ta.order_id
		 	join e where e.encntr_id = ta.encntr_id
		 	join p where p.person_id = ta.person_id
		 	join ea where ea.encntr_id = outerjoin(e.encntr_id)
		 		and ea.active_ind = outerjoin(1)
		 		and ea.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		 		and ea.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
		 		and ea.encntr_alias_type_cd = outerjoin(c_fin_alias_type_cd)
		 	join ea2 where ea2.encntr_id = outerjoin(e.encntr_id)
		 		and ea2.active_ind = outerjoin(1)
		 		and ea2.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		 		and ea2.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
		 		and ea2.encntr_alias_type_cd = outerjoin(c_mrn_encounter_alias_type_cd)
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
 		schedadmin_reply_out->administrations[x].orders.parent_order_id = o.template_order_id
 		schedadmin_reply_out->administrations[x].orders.last_ingred_seq = o.last_ingred_action_sequence
 		
 		;sets if the parent_ind is needed
 		if(o.template_order_id > 0)
 			parent_order_ind = 1
 		endif
 
		schedadmin_reply_out->administrations[x].patient.patient_id = p.person_id
		schedadmin_reply_out->administrations[x].patient.MRN = ea2.alias
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
 
		schedadmin_reply_out->administrations[x].task_class.description = trim(uar_get_code_description(ta.task_class_cd))
		schedadmin_reply_out->administrations[x].task_class.id = ta.task_class_cd
		schedadmin_reply_out->administrations[x].task_class.name = trim(uar_get_code_display(ta.task_class_cd))
 
 	foot report
 		schedadmin_reply_out->admin_cnt = x
 	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
 	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
 	if(schedadmin_reply_out->admin_cnt = 0)
 		call ErrorHandler2("SUCCESS", "Z", "GET POP SCHEDADMINS", "No records found.",
		"0000","Operation completed successfully.", schedadmin_reply_out)
		go to exit_script
	endif
 
    ;Get medication_item_id
    set idx = 1
    if(schedadmin_reply_out->admin_cnt > 200)
    	set exp = 2
    else
    	set exp = 0
    endif
 
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
	select distinct into "nl:"
	from  orders o
		, order_product op
		, order_product op2
		, synonym_item_r sir
	plan o where expand(idx,1,schedadmin_reply_out->admin_cnt,o.order_id,
					schedadmin_reply_out->administrations[idx]->orders.medication_order_id)
	join op where op.order_id = outerjoin(o.order_id)
	join op2 where op2.order_id = outerjoin(o.template_order_id)
	join sir where sir.synonym_id = outerjoin(o.synonym_id)
	detail
		next = 1
		pos = locateval(idx,next,schedadmin_reply_out->admin_cnt,o.order_id,
					schedadmin_reply_out->administrations[idx]->orders.medication_order_id)
		while(pos > 0 and next <= schedadmin_reply_out->admin_cnt)
			if(op.item_id > 0)
				schedadmin_reply_out->administrations[idx]->orders.medication_item_id = op.item_id
			elseif(op2.item_id > 0)
				schedadmin_reply_out->administrations[idx]->orders.medication_item_id = op2.item_id
			else
				schedadmin_reply_out->administrations[idx]->orders.medication_item_id = sir.item_id
			endif
 
			next = pos + 1
			pos = locateval(idx,next,schedadmin_reply_out->admin_cnt,o.order_id,
					schedadmin_reply_out->administrations[idx]->orders.medication_order_id)
		endwhile
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	;Get the dispense
    set idx = 1
    if(schedadmin_reply_out->admin_cnt > 200)
    	set exp = 2
    else
    	set exp = 0
    endif
 
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
 	select into "nl:"
 	from dispense_hx dh
 
	plan dh
		where expand(idx,1,schedadmin_reply_out->admin_cnt,dh.order_id,
					schedadmin_reply_out->administrations[idx]->orders.medication_order_id)
 
	order by dh.event_id, dh.dispense_hx_id
	head dh.order_id
		x = 0
		head dh.dispense_hx_id
			x = x + 1
			next = 1
			pos = locateval(idx,1,schedadmin_reply_out->admin_cnt,dh.order_id,
					schedadmin_reply_out->administrations[idx]->orders.medication_order_id)
			while(pos > 0 and next <= schedadmin_reply_out->admin_cnt)
				stat = alterlist(schedadmin_reply_out->administrations[pos].dispense_hx,x)
				schedadmin_reply_out->administrations[pos].dispense_hx[x].dispense_hx_id = dh.dispense_hx_id
 				schedadmin_reply_out->administrations[pos].dispense_hx[x].dispense_dt_tm = dh.dispense_dt_tm
				next = pos + 1
				pos = locateval(idx,next,schedadmin_reply_out->admin_cnt,dh.order_id,
					schedadmin_reply_out->administrations[idx]->orders.medication_order_id)
 
			endwhile
 
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
 
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetTaskList Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
end ;End Subroutine
 
/*************************************************************************
;  Name: GetOrderDetails(null) = i2  ;380043 - rx_get_order_action
;  Description: Gets order details
**************************************************************************/
subroutine GetOrderDetails(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetOrderDetails Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set idx = 1
	if(schedadmin_reply_out->admin_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
 	; Get Priority
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from order_detail od
	plan od where expand(idx,1,schedadmin_reply_out->admin_cnt,od.order_id,
			schedadmin_reply_out->administrations[idx].orders.medication_order_id)
			and od.order_id > 0
			and od.oe_field_meaning = "RXPRIORITY"
	order by od.action_sequence
	detail
		next = 1
		pos = locateval(idx,next,schedadmin_reply_out->admin_cnt,od.order_id,
			schedadmin_reply_out->administrations[idx].orders.medication_order_id)
 
		while(pos > 0 and next <= schedadmin_reply_out->admin_cnt)
			schedadmin_reply_out->administrations[pos].orders.pharm_order_priority = trim(od.oe_field_display_value,3)
 
			next = pos + 1
			pos = locateval(idx,next,schedadmin_reply_out->admin_cnt,od.order_id,
				schedadmin_reply_out->administrations[idx].orders.medication_order_id)
		endwhile
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	; Get ingredients
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	if(schedadmin_reply_out->admin_cnt > 100)
		set exp = 2
	else
		set exp = 0
	endif
 
	select into "nl:"
	from order_ingredient oi
		 ,order_product op
 
	plan oi
		where expand(idx,1,schedadmin_reply_out->admin_cnt,oi.order_id,
						schedadmin_reply_out->administrations[idx].orders.medication_order_id,
						 oi.action_sequence, schedadmin_reply_out->administrations[idx].orders.last_ingred_seq)
			and oi.order_id > 0
	join op
		where op.order_id = outerjoin(oi.order_id)
			and op.ingred_sequence = outerjoin(oi.comp_sequence)
			and op.action_sequence = outerjoin(oi.action_sequence)
 
	order by oi.order_id,oi.comp_sequence
	head oi.order_id
		x = 0
	detail
		x = oi.comp_sequence
		next = 1
		pos = locateval(idx,next,schedadmin_reply_out->admin_cnt,oi.order_id,
		schedadmin_reply_out->administrations[idx].orders.medication_order_id)
 
		while(pos > 0 and next <= schedadmin_reply_out->admin_cnt)
			stat = alterlist(schedadmin_reply_out->administrations[pos].orders.ingredients,x)
 
			schedadmin_reply_out->administrations[pos].dose = oi.volume
			schedadmin_reply_out->administrations[pos].dose_unit.id = oi.volume_unit
 			schedadmin_reply_out->administrations[pos].dose_unit.name = uar_get_code_display(oi.volume_unit)
 			schedadmin_reply_out->administrations[pos].orders.ingredients[x].dose = oi.volume
 			schedadmin_reply_out->administrations[pos].orders.ingredients[x].dose_unit.id = oi.volume_unit
			schedadmin_reply_out->administrations[pos].orders.ingredients[x].dose_unit.name = uar_get_code_display(oi.volume_unit)
 			schedadmin_reply_out->administrations[pos].orders.ingredients[x].strength_dose = oi.strength
			schedadmin_reply_out->administrations[pos].orders.ingredients[x].strength_dose_unit.id = oi.strength_unit
 			schedadmin_reply_out->administrations[pos].orders.ingredients[x].strength_dose_unit.name =
 				uar_get_code_display(oi.strength_unit)
			schedadmin_reply_out->administrations[pos].orders.ingredients[x].ingredient_id = oi.synonym_id
			schedadmin_reply_out->administrations[pos].orders.ingredients[x].ingredient_name = oi.order_mnemonic
 
			schedadmin_reply_out->administrations[pos].orders.ingredients[x].ingred_item_id = op.item_id
 
			next = pos + 1
			pos = locateval(idx,next,schedadmin_reply_out->admin_cnt,oi.order_id,
		schedadmin_reply_out->administrations[idx].orders.medication_order_id)
		endwhile
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	;getting the child order ingredients
	if(parent_order_ind > 0)
		set queryStartTm = cnvtdatetime(curdate, curtime3)
		select into "nl:"
		from orders o
			,(dummyt d with seq = schedadmin_reply_out->admin_cnt)
		plan d
			where schedadmin_reply_out->administrations[d.seq].orders.parent_order_id > 0
		join o
			where o.order_id = schedadmin_reply_out->administrations[d.seq].orders.parent_order_id
		head d.seq
			schedadmin_reply_out->administrations[d.seq].orders.last_ingred_seq = o.last_ingred_action_sequence
		with nocounter, time = value(timeOutThreshold)
		
		;keeping track of cumulative time out
		set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
		;exits the script because query timed out
		if(timeOutThreshold < 1)
			go to EXIT_SCRIPT
		endif
		
 
		; Get ingredients
		set queryStartTm = cnvtdatetime(curdate, curtime3)
		set idx = 0
		select into "nl:"
		from order_ingredient oi
		 	,order_product op
 
		plan oi
			where expand(idx,1,schedadmin_reply_out->admin_cnt,oi.order_id,
						schedadmin_reply_out->administrations[idx].orders.parent_order_id,
						 oi.action_sequence, schedadmin_reply_out->administrations[idx].orders.last_ingred_seq)
				and oi.order_id > 0
		join op
			where op.order_id = outerjoin(oi.order_id)
				and op.ingred_sequence = outerjoin(oi.comp_sequence)
				and op.action_sequence = outerjoin(oi.action_sequence)
 
		order by oi.order_id,oi.comp_sequence
		head oi.order_id
			x = 0
		detail
			x = oi.comp_sequence
			next = 1
			pos = locateval(idx,next,schedadmin_reply_out->admin_cnt,oi.order_id,
			schedadmin_reply_out->administrations[idx].orders.parent_order_id)
 
			while(pos > 0 and next <= schedadmin_reply_out->admin_cnt)
				stat = alterlist(schedadmin_reply_out->administrations[pos].orders.ingredients,x)
 
				schedadmin_reply_out->administrations[pos].dose = oi.volume
				schedadmin_reply_out->administrations[pos].dose_unit.id = oi.volume_unit
 				schedadmin_reply_out->administrations[pos].dose_unit.name = uar_get_code_display(oi.volume_unit)
 				schedadmin_reply_out->administrations[pos].orders.ingredients[x].dose = oi.volume
 				schedadmin_reply_out->administrations[pos].orders.ingredients[x].dose_unit.id = oi.volume_unit
				schedadmin_reply_out->administrations[pos].orders.ingredients[x].dose_unit.name = uar_get_code_display(oi.volume_unit)
 				schedadmin_reply_out->administrations[pos].orders.ingredients[x].strength_dose = oi.strength
				schedadmin_reply_out->administrations[pos].orders.ingredients[x].strength_dose_unit.id = oi.strength_unit
 				schedadmin_reply_out->administrations[pos].orders.ingredients[x].strength_dose_unit.name =
 					uar_get_code_display(oi.strength_unit)
				schedadmin_reply_out->administrations[pos].orders.ingredients[x].ingredient_id = oi.synonym_id
				schedadmin_reply_out->administrations[pos].orders.ingredients[x].ingredient_name = oi.order_mnemonic
 
				schedadmin_reply_out->administrations[pos].orders.ingredients[x].ingred_item_id = op.item_id
 
				next = pos + 1
				pos = locateval(idx,next,schedadmin_reply_out->admin_cnt,oi.order_id,
						schedadmin_reply_out->administrations[idx].orders.parent_order_id)
			endwhile
		with nocounter, expand = value(exp), time = value(timeOutThreshold)
 	
		;keeping track of cumulative time out
		set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
		;exits the script because query timed out
		if(timeOutThreshold < 1)
			go to EXIT_SCRIPT
		endif
	endif; parent_ord_ind
 
	; Get Ordering provider
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	if(schedadmin_reply_out->admin_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	select into "nl:"
	from orders o
		, order_action oa
		, prsnl p
	plan o where expand(idx,1,schedadmin_reply_out->admin_cnt,o.order_id,
		schedadmin_reply_out->administrations[idx].orders.medication_order_id)
	join oa where oa.order_id = o.order_id
		and oa.action_sequence = o.last_action_sequence
	join p where p.person_id = oa.order_provider_id
	detail
		next = 1
		pos = locateval(idx,next,schedadmin_reply_out->admin_cnt,o.order_id,
		schedadmin_reply_out->administrations[idx].orders.medication_order_id)
 
		while(pos > 0 and next <= schedadmin_reply_out->admin_cnt)
			schedadmin_reply_out->administrations[pos].orders.medication_ordering_provider.provider_id = p.person_id
			schedadmin_reply_out->administrations[pos].orders.medication_ordering_provider.provider_name =
				p.name_full_formatted
 
			next = pos + 1
			pos = locateval(idx,next,schedadmin_reply_out->admin_cnt,o.order_id,
			schedadmin_reply_out->administrations[idx].orders.medication_order_id)
		endwhile
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	;Get Med Definition strength ;005
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from (dummyt d with seq = schedadmin_reply_out->admin_cnt)
		, (dummyt d1 with seq = 1)
		, medication_definition md
	plan d where maxrec(d1,size(schedadmin_reply_out->administrations[d.seq].orders.ingredients,5))
	join d1
	join md where md.item_id = schedadmin_reply_out->administrations[d.seq].orders.ingredients[d1.seq].ingred_item_id
	detail
		schedadmin_reply_out->administrations[d.seq].orders.ingredients[d1.seq].strength = md.strength
		schedadmin_reply_out->administrations[d.seq].orders.ingredients[d1.seq].strength_unit.id = md.strength_unit_cd
		schedadmin_reply_out->administrations[d.seq].orders.ingredients[d1.seq].strength_unit.name =
		uar_get_code_display(md.strength_unit_cd)
	with nocounter, time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetOrderDetails Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
end ;End Subroutine
 
/*************************************************************************
;  Name: GetNdc(synonym = f8) = vc
;  Description: Get medication details
**************************************************************************/
subroutine GetNdc(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetNdc Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set idx = 1
	if(schedadmin_reply_out->admin_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
 	; Get Main NDC
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
 	select into "nl:"
	from med_identifier mi
	plan mi where expand(idx,1,schedadmin_reply_out->admin_cnt,mi.item_id,
		schedadmin_reply_out->administrations[idx].orders.medication_item_id)
		and mi.med_identifier_type_cd = c_ndc_med_identifier_type_cd
		and mi.pharmacy_type_cd = c_inpatient_pharm_type_cd
		and mi.active_ind = 1
		and mi.sequence = 1
		and mi.med_product_id > 0
	detail
		next = 1
		pos = locateval(idx,next,schedadmin_reply_out->admin_cnt,mi.item_id,
		schedadmin_reply_out->administrations[idx].orders.medication_item_id)
 
		while(pos > 0 and next <= schedadmin_reply_out->admin_cnt)
			schedadmin_reply_out->administrations[pos].orders.NDC = trim(mi.value,3)
 
			next = pos + 1
			pos = locateval(idx,next,schedadmin_reply_out->admin_cnt,mi.item_id,
			schedadmin_reply_out->administrations[idx].orders.medication_item_id)
		endwhile
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	; Get Ingredient NDC
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from (dummyt d with seq = schedadmin_reply_out->admin_cnt)
		, (dummyt d1 with seq = 1)
		, med_identifier mi
	plan d where maxrec(d1,size(schedadmin_reply_out->administrations[d.seq].orders.ingredients,5))
	join d1
	join mi where mi.item_id = schedadmin_reply_out->administrations[d.seq].orders.ingredients[d1.seq].ingred_item_id
		and mi.med_identifier_type_cd = c_ndc_med_identifier_type_cd
		and mi.pharmacy_type_cd = c_inpatient_pharm_type_cd
		and mi.active_ind = 1
		and mi.sequence = 1
		and mi.med_product_id > 0
	detail
		schedadmin_reply_out->administrations[d.seq].orders.ingredients[d1.seq].NDC = trim(mi.value,3)
	with nocounter, time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetNdc Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
end ;End Subroutine
 
/*************************************************************************
;  Name: GetRxNorm(null) = vc
;  Description: Get RxNorm values
**************************************************************************/
subroutine GetRxNorm(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetRxNorm Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set idx = 1
	if(schedadmin_reply_out->admin_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	; Get med rxnorm
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from order_catalog_synonym ocs
	, cmt_cross_map ccm
	plan ocs where expand(idx,1,schedadmin_reply_out->admin_cnt,ocs.synonym_id,
		schedadmin_reply_out->administrations[idx].orders.medication_id)
		and ocs.synonym_id > 0
	join ccm where ccm.concept_cki = ocs.concept_cki
		and ccm.map_type_cd = c_rxnorm_map_type_cd
	order by ocs.synonym_id
	head ocs.synonym_id
		x = 0
	detail
		x = x + 1
		next = 1
		pos = locateval(idx,next,schedadmin_reply_out->admin_cnt,ocs.synonym_id,
		schedadmin_reply_out->administrations[idx].orders.medication_id)
 
		while(pos > 0 and next <= schedadmin_reply_out->admin_cnt)
			stat = alterlist(schedadmin_reply_out->administrations[pos].orders.rx_norms,x)
 
			schedadmin_reply_out->administrations[pos].orders.rx_norms[x].code = trim(ccm.source_identifier,3)
			schedadmin_reply_out->administrations[pos].orders.rx_norms[x].code_type = "RXNORM"
			schedadmin_reply_out->administrations[pos].orders.rx_norms[x].term_type = "RXNORM"
 
			next = pos + 1
			pos = locateval(idx,next,schedadmin_reply_out->admin_cnt,ocs.synonym_id,
			schedadmin_reply_out->administrations[idx].orders.medication_id)
		endwhile
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	; Get ingredient rxnorm
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from (dummyt d with seq = schedadmin_reply_out->admin_cnt)
		,(dummyt d2 with seq = 1)
		, order_catalog_synonym ocs
		, cmt_cross_map ccm
	plan d where maxrec(d2,size(schedadmin_reply_out->administrations[d.seq].orders.ingredients,5))
	join d2
	join ocs where ocs.synonym_id = schedadmin_reply_out->administrations[d.seq].orders.ingredients[d2.seq].ingredient_id
	join ccm where ccm.concept_cki = ocs.concept_cki
		and ccm.map_type_cd = c_rxnorm_map_type_cd
	head d.seq
		y = 0
	head d2.seq
		y = 0
	detail
		y = y + 1
		stat = alterlist(schedadmin_reply_out->administrations[d.seq].orders.ingredients[d2.seq].ingredient_rx_norms,y)
 
		schedadmin_reply_out->administrations[d.seq].orders.ingredients[d2.seq].ingredient_rx_norms[y].code =
			trim(ccm.source_identifier,3)
		schedadmin_reply_out->administrations[d.seq].orders.ingredients[d2.seq].ingredient_rx_norms[y].code_type = "RXNORM"
		schedadmin_reply_out->administrations[d.seq].orders.ingredients[d2.seq].ingredient_rx_norms[y].term_type = "RXNORM"
	with nocounter, time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetRxNorm Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
end ;End Subroutine
 
end go
