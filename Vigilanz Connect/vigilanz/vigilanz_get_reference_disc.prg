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
          Date Written:       06/25/15
          Source file name:   vigilanz_get_reference_disc
          Object name:        vigilanz_get_reference_disc
          Request #:
          Program purpose:    Queries for reference lists based on CODE_SETs
          Tables read:
          Tables updated:     NONE
          Executing from:     EMISSARY SERVICES
          Special Notes:	  NONE
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
  000 03/13/15  AAB		    	Initial write
  001 05/13/15	AAB 			Update input params,  biz logic, and flag for inactive
  002 05/18/15  AAB 			Support Object Name
  003 06/25/15  AAB  			Support Clinical Categories 16389
  004 02/02016  AAB 			Add Orders and Encounters Objects
  005 04/29/16  AAB 			Added version
  006 10/10/16  AAB 			Add DEBUG_FLAG
  007 07/27/17 	JCO				Changed %i to execute; update ErrorHandler2
  008 10/10/17	RJC				Updated discovery based on Emissary changes - Request/Response model
  009 10/10/17 	RJC				Added Post Observation and Put Observation services
  010 11/06/17	RJC				Added Get Patient Registries, Get Patient Registries Discovery & Get Portal Accts endpoints
  011 12/01/17	RJC				Added Post Encounter Endpoint
  012 12/06/17	RJC				Added Post MedOrder Endpoint & Put MedOrder Verify endpoint
  013 12/13/17 	RJC				Added Pop Pharm Interv & Get Pharm Interv
  014 12/22/17	RJC				Added Get Referrals Endpoint
  015 12/25/17	RJC				Added Subscriber Address and health plan info to Get Patient endpoint
  016 01/18/18	RJC				Added Post & Put pharmacy interventions
  017 01/25/18	RJC				Added Post Problem
  018 02/06/18	DJP				Added Post Allergy
  019 03/22/18	RJC				Added version code and copyright block
  020 04/23/18	RJC				Pop Sched Admin, Sched Admin object on Get Meds and Get Med Id
  021 04/23/18	RJC				Post/Put Documents - Cosigning changes, author and date additions
  022 04/23/18	RJC				Get pharmacies discovery
  023 04/23/18	RJC				Orders discovery coding system addition
  024 05/10/18	RJC				Post Document changes
  025 05/14/18	RJC				Added Put/Delete Allergy
  026 05/16/18	RJC				Added Put/Delete Problem
  027 05/30/18	RJC				Added Put Allergies (AllergyInfo)
  028 06/12/18	RJC				Added ServiceDepartmentId to Post/Put Documents
  029 08/22/18  SVO				Added Customfilters for Get Providers
  030 09/25/18	RJC				Added Post/Put Appointment, Post Proposed Order
  031 09/28/18	RJC				Added DiagnosisCodes Discovery and update ProblemCodes Discovery
  032 09/30/18  SVO             Added Patient_put codes
  033 10/02/18	RJC				Added Delete Observations
  034 10/29/18	RJC				Added Post Med Administration
  035 01/03/19	RJC				Added Post Lab Result
  036 01/06/19	RJC				Added Get Observation Component Discovery
  037 01/08/19	RJC				Added SourceId, SystemId and ValueCodes to Post Observation
  038 01/14/19  STV             Added assigned_type and assigned_type_reltn_cd
  039 02/22/19	RJC				Added Billing Accts, SurgCases, Pop Tasks
  040 03/06/19	RJC				Added Tasks
  041 03/08/19	RJC				Added Delete MedAdmin
  042 04/10/19	RJC				Added Post/Put Patient
  045 06/07/19  STV             Added TaskClass to the endpoints that return task class
  046 06/07/19  STV             Added Post Adhoc medAdmin
  047 08/19/19	RJC				Added Post MedAdmin changes
  048 09/09/19  RJC             Renamed file and object
  049 11/27/19	RJC				Added Post/Put Person updated Post/Put Patient
  051 03/08/20  KRD				Added the following:
								PATIENTENCOUNTERINSURANCE_POST
								IMMUNIZATIONADMINISTRATION_POST
								PATIENTENCOUNTERS_PATCH
								PATIENTENCOUNTERRELATIONS_POST
								PATIENTENCOUNTERRELATIONS_PUT
								PATIENTENCOUNTERRELATIONS_PATCH
								PATIENTS_POST
								PATIENTENCOUNTERINSURANCE_POST\
								PATIENTENCOUNTERINSURANCE_PATCH
								PRIORAUTHORIZATIONS_PATCH
								PRIORAUTHORIZATIONS_PUT
								PRIORAUTHORIZATIONS_POST
								PERSONS_PUT
								PERSONS_PUT
  052 03/20/20                  Added Isolation to PopEncounter
**********************************************************************/
;drop program vigilanz_get_reference_disc go
drop program vigilanz_get_reference_disc go
create program vigilanz_get_reference_disc
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Field Path  "			 = ""
		, "Include Inactive "		 = 0
		, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, FIELD_PATH, INC_INACTIVE, DEBUG_FLAG
 
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
 
free record reference_reply_out
record reference_reply_out (
  1 codes[*]
    2 code_set              = i4
    2 code[*]
      3 code_value          = f8
      3 description         = vc
      3 display             = vc
      3 cdf_meaning         = vc
      3 collation_seq       = i4
	  3 active_ind 			= i2
    1 audit
		2 user_id					= f8
		2 user_firstname			= vc
		2 user_lastname				= vc
		2 patient_id				= f8
		2 patient_firstname			= vc
		2 patient_lastname			= vc
	    2 service_version			= vc
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
 
; Set status to successful initially
set reference_reply_out->status_data.status = "S"
set reference_reply_out->status_data.subeventstatus.OperationName = "REF DISCOVERY"
set reference_reply_out->status_data.subeventstatus.OperationStatus = "S"
set reference_reply_out->status_data.subeventstatus.TargetObjectValue = "Operation completed successfully."
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
declare sFieldPath 					= vc with protect, noconstant("")
declare iIncInactive				= i4 with protect, noconstant(0)
declare idebugFlag					= i2 with protect, noconstant(0) ;006
 
declare sServiceName				= vc with protect, noconstant("")
declare sReqOrResp					= vc with protect, noconstant("")
declare sFieldName					= vc with protect, noconstant("")
declare iCodeSet					= i4 with protect, noconstant(0)
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
set sFieldPath						= trim($FIELD_PATH,3)
set iIncInactive					= cnvtint($INC_INACTIVE)
set idebugFlag						= cnvtint($DEBUG_FLAG)  ;006
 
 if(idebugFlag > 0)
	 call echo(build("sFieldPath -->", sFieldPath))
	 call echo(build("iIncInactive -->", iIncInactive))
 endif
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common	;007
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetReferenceData(null) 						= i2 with protect
declare GetCodeValues(codeset = i4)					= null with protect
declare ReturnMessage(msgtype = vc, itemlist = vc)	= null with protect
declare CustomFilters(filter = vc) = null with protect
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
if(sFieldPath != "")
 
	; Parse and validate full request string
	; Service Name
	set sServiceName = cnvtupper(piece(sFieldPath,".",1,"NotFound"))
	if(sServiceName = "NOTFOUND")
		call ErrorHandler2("VALIDATE", "F", "REF DISCOVERY", "Missing required field",
		"2055", build2("Missing Service Name field"), reference_reply_out)
		go to EXIT_SCRIPT
	endif
 
	; Request or Response
	set sReqOrResp = cnvtupper(piece(sFieldPath,".",2,"NotFound"))
	if(sReqOrResp = "NOTFOUND")
		call ErrorHandler2("VALIDATE", "F", "REF DISCOVERY", "Missing required field",
		"2055", build2("Missing RequestOrResponse field"), reference_reply_out)
		go to EXIT_SCRIPT
	endif
 
	; FieldPath
	set start = textlen(sServiceName) + textlen(sReqOrResp) + 3  ; 3 to account for both periods plus start the next char after
	set sFieldName = cnvtupper(substring(start, textlen(sFieldPath), sFieldPath))
 
 	if(idebugFlag > 0)
   	 call echo(build2("sServiceName -->", sServiceName))
   	 call echo(build2("sReqOrResp -->", sReqOrResp))
	 call echo(build2("sFieldName -->", sFieldName))
    endif
 
	; Get Reference Data
	set iRet = GetReferenceData(null)
	if(iRet = 0)
		call ErrorHandler2("VALIDATE", "F", "CodesetNotFound", "Could not find codeset.",
		"9999",build2("Could not find codeset with input parameters: ",sFieldPath), reference_reply_out)
		go to exit_script
	endif
 
else
	call ErrorHandler2("VALIDATE", "F", "REF DISCOVERY", build("Missing required field: ", sFieldName),
	"2055", build("Missing required field: ", sFieldPath), reference_reply_out)	;007
	go to EXIT_SCRIPT
endif
 
set iRet = PopulateAudit("", 0.00, reference_reply_out, sVersion)   ;005
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(reference_reply_out)
 
if(idebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_reference_discovery.json")
	call echo(build2("_file : ", _file))
	call echojson(reference_reply_out, _file, 0)
    call echorecord(reference_reply_out)
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
;  Name: GetCodeValues(codeset)
;  Description: Update record structure with code values based on codeset
**************************************************************************/
subroutine GetCodeValues(codeset)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetCodeValues Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	; Get CodeValues based on codeset
	select
		if(iIncInactive)
			where cv.code_set = codeset
			order by cv.display_key
		else
			where cv.code_set = codeset
			and cv.active_ind = 1
			order by cv.display_key
		endif
	into "nl:"
	from code_value cv
	head report
		stat = alterlist(reference_reply_out->codes,1)
		reference_reply_out->codes[1].code_set = codeset
 
		stat = alterlist(reference_reply_out->codes[1].code,100)
		x = 0
	detail
		x = x + 1
		if(mod(x,10) = 1 and x >= 100)
			stat = alterlist(reference_reply_out->codes[1].code,x + 9)
		endif
 
		reference_reply_out->codes[1].code[x].code_value = cv.code_value
		reference_reply_out->codes[1].code[x].cdf_meaning = cv.cdf_meaning
		reference_reply_out->codes[1].code[x].display = cv.display
		reference_reply_out->codes[1].code[x].description = cv.description
		reference_reply_out->codes[1].code[x].collation_seq = cv.collation_seq
		reference_reply_out->codes[1].code[x].active_ind = cv.active_ind
	foot report
		stat = alterlist(reference_reply_out->codes[1].code,x)
	with nocounter
 
	if(idebugFlag > 0)
		call echo(concat("GetCodeValues Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
	go to EXIT_SCRIPT
end ; End Subroutine
 
/*************************************************************************
;  Name: GetFlagValues(table, column)
;  Description: Update record structure with flag values from dm_flags table
**************************************************************************/
subroutine GetFlagValues(tablename, column)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetFlagValues Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	; Get DM Flag Values from DM_FLAGS table
	select into "nl:"
	from dm_flags dm
	where dm.table_name = tablename
	and dm.column_name = column
	head report
		stat = alterlist(reference_reply_out->codes,1)
		x = 0
	detail
		x = x + 1
		stat = alterlist(reference_reply_out->codes[1].code,x)
 
		reference_reply_out->codes[1].code[x].code_value = dm.flag_value
		reference_reply_out->codes[1].code[x].description = build2("DM Flag Values: Table: ", tablename, " Column: ", column)
		reference_reply_out->codes[1].code[x].display = dm.description
	with nocounter
 
	if(idebugFlag > 0)
		call echo(concat("GetFlagValues Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	go to EXIT_SCRIPT
end ; End Subroutine
 
 
/*************************************************************************
;  Name: ReturnMessage(msgtype = vc, itemlist = vc)
;  Description: Returns informative messages for end users
**************************************************************************/
subroutine ReturnMessage(msgtype, itemlist)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ReturnMessage Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	case(msgtype)
		of "object":
			call ErrorHandler2(sReqOrResp, "F", sServiceName,
			build2("The ", sReqOrResp, " object for endpoint ",sServiceName," does not have coded values."),
			"9999", build2("The ", sReqOrResp, " object for endpoint ",sServiceName," does not have coded values"), reference_reply_out)
 
		of "field":
			call ErrorHandler2(sReqOrResp, "F", sServiceName, build2("The ", sReqOrResp, " object for endpoint ",sServiceName,
			" does not have coded values for field '",sFieldName,"'."," Possible fields are ",itemlist,"."),"9999",
			build2("Coded values don't exist for this fieldpath."), reference_reply_out)
 
		of "api":
			call ErrorHandler2(sReqOrResp, "F", sServiceName, build2("Please use the ",itemlist," api for this field."),
			"9999", build2("Please use the ",itemlist, " api for this field:  ",sFieldName),
			reference_reply_out)
	endcase
 
	if(idebugFlag > 0)
		call echo(concat("ReturnMessage Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	go to EXIT_SCRIPT
end ; End Subroutine
 
 
/*************************************************************************
;  Name: CustomFilters(filter)
;  Description: Custom filters for specifc endpoints
**************************************************************************/
subroutine CustomFilters(filter)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("CustomFilters Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	; Custom filters for specific endpoints
	if(filter = "PHARMACYTYPES")
		set stat = alterlist(reference_reply_out->codes,1)
		set stat = alterlist(reference_reply_out->codes[1].code,5)
		for(i = 1 to 5)
			case(i)
				of 1:
					set reference_reply_out->codes[1].code[i].cdf_meaning = "MAILORDER"
					set reference_reply_out->codes[1].code[i].description = "MailOrder pharmacy"
					set reference_reply_out->codes[1].code[i].display = "MailOrder pharmacy"
				of 2:
					set reference_reply_out->codes[1].code[i].cdf_meaning = "RETAIL"
					set reference_reply_out->codes[1].code[i].description = "Retail Pharmacy"
					set reference_reply_out->codes[1].code[i].display = "Retail Pharmacy"
				of 3:
					set reference_reply_out->codes[1].code[i].cdf_meaning = "LONGTERM"
					set reference_reply_out->codes[1].code[i].description = "Long-Term Care Pharmacy"
					set reference_reply_out->codes[1].code[i].display = "Long-Term Care Pharmacy"
				of 4:
					set reference_reply_out->codes[1].code[i].cdf_meaning = "SPECIALTY"
					set reference_reply_out->codes[1].code[i].description = "Specialty Pharmacy"
					set reference_reply_out->codes[1].code[i].display = "Specialty Pharmacy"
				of 5:
					set reference_reply_out->codes[1].code[i].cdf_meaning = "24HR"
					set reference_reply_out->codes[1].code[i].description = "Twenty-Four Hour Pharmacy"
					set reference_reply_out->codes[1].code[i].display = "24hr Pharmacy"
			endcase
			set reference_reply_out->codes[1].code[i].code_value = 0
			set reference_reply_out->codes[1].code[i].collation_seq = i
			set reference_reply_out->codes[1].code[i].active_ind = 1
		endfor
	else
		select
			if(filter = "POSTDOCUMENTSTATUS")
				from code_value cv
				where cv.code_set = 8 and cv.cdf_meaning in ("IN PROGRESS", "AUTH", "TRANSCRIBED") and cv.active_ind = 1
				order by cv.code_set, cv.display_key
			elseif(filter = "PUTDOCUMENTSTATUS")
				from code_value cv
				where cv.code_set = 8 and cv.cdf_meaning in ("IN PROGRESS", "AUTH", "MODIFIED") and cv.active_ind = 1
				order by cv.code_set, cv.display_key
			elseif(filter = "USERRELATIONSHIPS")
				from code_value cv
				where cv.code_set in (331,333)
				order by cv.code_set, cv.display_key
			elseif(filter = "LOCATIONID")
				from code_value cv
				where cv.code_set = 220
					and cv.cdf_meaning = "FACILITY"
					order by cv.display_key
			elseif(filter = "SPECIALTYID")
				from code_value cv
				where cv.code_set = 357
					and cv.cdf_meaning = "MEDSERVICE"
			elseif(filter = "PUT_OBS_REASON")
				from code_value cv,
					code_value_extension cve
				where cv.code_set = 6014
					and cve.code_value = cv.code_value
					and cve.field_name = "UNCHART"
					and cve.field_value > " "
			elseif(filter = "ASSIGNEDRELATIONSHIP.RELATIONSHIPDESC")
				from code_value cv
				where cv.code_set in(4003145,259571)
					and (cv.cdf_meaning != "NONPROVIDER"
				  			or cv.cdf_meaning = NULL)
					order by cv.code_set
			elseif(filter = "DELETEMEDADMINISTRATIONSTATUS")
				from code_value cv
				where cv.code_set = 8 and cv.cdf_meaning in ("INERROR")
				order by cv.code_set, cv.display_key
			elseif(filter = "POST_ENCOUNTER_ENC_TYPES")
					from code_value_group cvg
						, code_value cv
						, code_value cv2
					plan cvg ;where cvg.child_code_value = dEncTypeCd
					join cv where cv.code_value = cvg.child_code_value
					join cv2 where cv2.code_value = cvg.parent_code_value
							   and cv2.code_set = 69
							   and cv2.code_value in (value(uar_get_code_by("MEANING",69,"OUTPATIENT")),
							   						  value(uar_get_code_by("MEANING",69,"PREADMIT")))
			elseif(filter = "POST_ENCOUNTER_ENC_CLASS")
				from code_value cv
				where cv.code_set = 69 and cv.cdf_meaning in ("OUTPATIENT","PREADMIT")
				order by cv.code_set, cv.display_key
			elseif(filter = "POST_PATIENT_CUSTOM_FIELD")
				from code_value cv
				where cv.code_set in (356,4000760)
				order by cv.code_set, cv.display_key
			endif
		into "nl:"
		head report
			y = 0
			x = 0
		head cv.code_set
			y = 1
			stat = alterlist(reference_reply_out->codes,y)
			reference_reply_out->codes[y].code_set = cv.code_set
 
			stat = alterlist(reference_reply_out->codes[y].code,100)
 
		detail
			if(iIncInactive = 0 and cv.active_ind = 1)
				x = x + 1
 
				if(mod(x,10) = 1 and x >= 100)
					stat = alterlist(reference_reply_out->codes[y].code,x + 9)
				endif
 
				reference_reply_out->codes[y].code[x].code_value = cv.code_value
				reference_reply_out->codes[y].code[x].cdf_meaning = cv.cdf_meaning
				reference_reply_out->codes[y].code[x].display = cv.display
				reference_reply_out->codes[y].code[x].description = cv.description
				reference_reply_out->codes[y].code[x].collation_seq = cv.collation_seq
				reference_reply_out->codes[y].code[x].active_ind = cv.active_ind
			else
				x = x + 1
				if(mod(x,10) = 1 and x >= 100)
					stat = alterlist(reference_reply_out->codes[y].code,x + 9)
				endif
 
				reference_reply_out->codes[y].code[x].code_value = cv.code_value
				reference_reply_out->codes[y].code[x].cdf_meaning = cv.cdf_meaning
				reference_reply_out->codes[y].code[x].display = cv.display
				reference_reply_out->codes[y].code[x].description = cv.description
				reference_reply_out->codes[y].code[x].collation_seq = cv.collation_seq
				reference_reply_out->codes[y].code[x].active_ind = cv.active_ind
			endif
		foot cv.code_set
			stat = alterlist(reference_reply_out->codes[y].code,x)
		with nocounter
 
	endif
 
	if(idebugFlag > 0)
		call echo(concat("CustomFilters Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
 
	go to EXIT_SCRIPT
end ; End Subroutine
 
/*************************************************************************
;  Name: GetReferenceData(null)
;  Description: Based on service, req or resp and fieldpath. Returns message or codeset number
**************************************************************************/
subroutine GetReferenceData(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetReferenceData Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	case(sServiceName)
 
		; AdHoc Post Med Admin
		of "ADHOCMEDICATIONADMINISTRATIONS_POST":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "MEDICATIONID": call ReturnMessage("api","Medications discovery")
					of "MEDICATIONITEMID":  call ReturnMessage("api","Medications discovery")
					of "COMMUNICATIONTYPEID": set iCodeSet = 6006
					of "ORDERINGPROVIDERID": call ReturnMessage("api","provider discovery")
					of "ADMINISTRATIONROUTEID": set iCodeSet = 4001
					of "ADMINISTRATIONSITEID": set iCodeSet = 97
					of "DOSEUNITID": set iCodeSet = 54
					of "VOLUMEUNITID": set iCodeSet = 54
					else
						call ReturnMessage("field",build2("MEDICATIONID, MEDICATIONITEMID, COMMUNICATIONTYPEID, ",
						"ORDERINGPROVIDERID, ADMINISTRATIONROUTEID, ADMINISTRATIONSITEID, DOSEUNITID, ",
						"VOLUMEUNITID"))
				endcase
			else
				call ReturnMessage("object","")
			endif
 
		; Get Allergies Endpoint
		of "ALLERGIES_GET":
			if(sReqOrResp = "REQUEST")
				call ReturnMessage("object","")
			else
				case(sFieldName)
					of "ALLERGIES.CATEGORY": set iCodeSet = 12020
					of "ALLERGIES.SEVERITY": set iCodeSet = 12022
					of "ALLERGIES.STATUS": set iCodeSet = 12025
					else
						call ReturnMessage("field","ALLERGIES.CATEGORY, ALLERGIES.SEVERITY, ALLERGIES.STATUS")
				endcase
			endif
 
 		; Post Allergies Endpoint
		of "ALLERGIES_POST":
			if(sReqOrResp = "RESPONSE")
				call ReturnMessage("object","")
			else
				case(sFieldName)
					of "CATEGORYID": set iCodeSet = 12020
					of "SEVERITYID": set iCodeSet = 12022
					of "REACTIONTYPEID": set iCodeSet = 12021
 					of "REACTIONIDS": call ReturnMessage("api","problem discovery")
 					of "ALLERGENID": call ReturnMessage("api","allergen discovery")
 					of "PATIENTIDTYPE": set iCodeSet = 4
					else
					 call ReturnMessage("field","ALLERGENID, PATIENTIDTYPE, CATEGORYID, SEVERITYID, REACTIONTYPEID, REACTIONIDS")
				endcase
			endif
 
		; Put Allergies Endpoint
		of "ALLERGIES_PUT":
			if(sReqOrResp = "RESPONSE")
				call ReturnMessage("object","")
			else
				case(sFieldName)
					of "STATUSID": set iCodeSet = 12025
					of "SEVERITYID": set iCodeSet = 12022
					of "REACTIONTYPEID": set iCodeSet = 12021
 					of "REACTIONIDS": call ReturnMessage("api","problem discovery")
 					of "PATIENTIDTYPE": set iCodeSet = 4
					else
					 call ReturnMessage("field",build2("STATUSID, SEVERITYID, REACTIONTYPEID, REACTIONIDS, PATIENTIDTYPE"))
				endcase
			endif
 
		; Delete Allergies Endpoint
		of "ALLERGIES_DELETE":
			if(sReqOrResp = "RESPONSE")
				call ReturnMessage("object","")
			else
				case(sFieldName)
					of "STATUSID": set iCodeSet = 12025
					of "REASONID": set iCodeSet = 14004
					else
					 call ReturnMessage("field","STATUSID, REASONID")
				endcase
			endif
 
		; Delete Appointments Endpoint
		of "APPOINTMENTS_DELETE":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "REASON": set iCodeSet = 14229
					else call ReturnMessage("field","REASON")
				endcase
			else
				call ReturnMessage("object","")
			endif
 
		; Get Appointment and Get Appointments Endpoints
		of "APPOINTMENTS_GET":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "STATUSES": set iCodeSet = 14233
					else call ReturnMessage("field","STATUSES")
				endcase
			else
				case(sFieldName)
					of "STATUS": set iCodeSet = 14233
					of "VISITTYPE.VISITTYPEID": set iCodeSet = 14230
					of "VISITTYPE.VISITTYPENAME": set iCodeSet = 14230
					of "VISITTYPE.EXTERNALNAME": set iCodeSet = 14249
					of value("RESOURCEDEPARTMENT.DEPARTMENT.DEPARTMENTID","RESOURCEDEPARTMENT.DEPARTMENT.DEPARTMENTNAME"):
						call ReturnMessage("api","location discovery")
					of "RESOURCEDEPARTMENT.DEPARTMENT.ADDRESS.TYPE": set iCodeSet = 212
					of "RESOURCEDEPARTMENT.DEPARTMENT.PHONENUMBERS.TYPE": set iCodeSet = 43
					else
						call ReturnMessage("field",build2("STATUS, VISITTYPE.VISITTYPEID, VISITTYPE.EXTERNALNAME, ",
						"RESOURCEDEPARTMENT.DEPARTMENT.DEPARTMENTID, ",
						" RESOURCEDEPARTMENT.DEPARTMENT.DEPARTMENTNAME, ",
						"RESOURCEDEPARTMENT.DEPARTMENT.ADDRESS.TYPE, ",
						" RESOURCEDEPARTMENT.DEPARTMENT.PHONENUMBERS.TYPE"))
				endcase
			endif
 
		; Post Appointments Endpoint
		of "APPOINTMENTS_POST":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "APPOINTMENTDETAILS":  call ReturnMessage("api","appointment details discovery")
					of "APPOINTMENTTYPEID": call ReturnMessage("api","appointment types discovery")
					of "ENCOUNTERIDTYPE": set iCodeSet = 319
					of "PATIENTIDTYPE": set iCodeSet = 4
					of "SLOTS.APPOINTMENTSLOTID": call ReturnMessage("api","appointment slots discovery")
					of "SLOTS.LOCATIONID": call ReturnMessage("api","appointment locations discovery")
					of "SLOTS.RESOURCEID": call ReturnMessage("api","appointment resources discovery")
					else call ReturnMessage("field",build2("APPOINTMENTDETAILS, APPOINTMENTTYPEID, ENCOUNTERIDTYPE, SLOTS.APPOINTMENTSLOTID, ",
					"SLOTS.LOCATIONID, SLOTS.RESOURCEID"))
				endcase
			else
				call ReturnMessage("object","")
			endif
 
		; Put Appointments Endpoint
		of "APPOINTMENTS_PUT":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "APPOINTMENTDETAILS":  call ReturnMessage("api","appointment details discovery")
					of "ENCOUNTERIDTYPE": set iCodeSet = 319
					of "REASONID": set iCodeSet = 14229
					of "SLOTS.APPOINTMENTSLOTID": call ReturnMessage("api","appointment slots discovery")
					of "SLOTS.LOCATIONID": call ReturnMessage("api","appointment locations discovery")
					of "SLOTS.RESOURCEID": call ReturnMessage("api","appointment resources discovery")
					of "STATUSID": set iCodeSet = 14233
					else call ReturnMessage("field",build2("APPOINTMENTDETAILS, REASONID, ENCOUNTERIDTYPE, SLOTS.APPOINTMENTSLOTID, ",
					"SLOTS.LOCATIONID, SLOTS.RESOURCEID, STATUSID"))
				endcase
			else
				call ReturnMessage("object","")
			endif
 
		; Get Pop Billing Endpoint
		of "BILLINGACCOUNTS_GET":
			if(sReqOrResp = "REQUEST")
				call ReturnMessage("object","")
			else
				case(sFieldName)
					of "BILLINGSTATUS": set iCodeSet = 18935
					of "PATIENTCLASS": set iCodeSet = 69
					of "ADMITSOURCE": set iCodeSet = 2
					of "ADMITTYPE": set iCodeSet = 3
					of "ADMITUNIT": call ReturnMessage("api","location discovery")
					of "DISCHARGEUNIT": call ReturnMessage("api","location discovery")
					of "DISCHARGEDESTINATION": set iCodeSet = 20
					of "PROCEDURES.CODETYPE": set iCodeSet = 400
					of "PROCEDURES.ANESTHESIATYPE": set iCodeSet = 10050
					of "ADMITDIAGNOSES.CODETYPE": set iCodeSet = 400
					of "FINALDIAGNOSES.CODETYPE": set iCodeSet = 400
					of "FINALDIAGNOSES.PRESENTONADMISSION": set iCodeSet = 4002009
					of "DIAGNOSISRELATEDGROUPS.MAJORDIAGNOSTICCATEGORY": set iCodeSet = 14285
					of "DIAGNOSISRELATEDGROUPS.SEVERITYOFILLNESS": set iCodeSet = 24291
					of "DIAGNOSISRELATEDGROUPS.RISKOFMORTALITY": set iCodeSet = 24291
					of "PATIENT.GENDER": set iCodeSet = 57
					of "ENCOUNTER.ENCOUNTERTYPE": set iCodeSet = 71
					of "ENCOUNTER.PATIENTCLASS": set iCodeSet = 69
					of "ENCOUNTER.HOSPITAL": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.UNIT": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.ROOM": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.BED": call ReturnMessage("api","location discovery")
					else
						call ReturnMessage("field",build2("BILLINGSTATUS, PATIENTCLASS, ADMITSOURCE, ADMITTYPE, ADMITUNIT, DISCHARGEUNIT, ",
						"DISCHARGEDESTINATION, PROCEDURES.CODETYPE, PROCEDURES.ANESTHESIATYPE, ADMITDIAGNOSES.CODETYPE, ",
						"FINALDIAGNOSES.CODETYPE, FINALDIAGNOSES.PRESENTONADMISSION, DIAGNOSISRELATEDGROUPS.MAJORDIAGNOSTICCATEGORY, ",
						"DIAGNOSISRELATEDGROUPS.SEVERITYOFILLNESS, DIAGNOSISRELATEDGROUPS.RISKOFMORTALITY, PATIENT.GENDER, ",
						"ENCOUNTER.ENCOUNTERTYPE, NCOUNTER.PATIENTCLASS, ENCOUNTER.HOSPITAL, ENCOUNTER.UNIT, ENCOUNTER.ROOM, ENCOUNTER.BED"))
				endcase
			endif
 
		; Get CCD Discovery Endpoint
		of "CONTINUITYOFCAREDOCUMENTS_DISCOVERY_GET": call ReturnMessage("object","")
 
		; Get CCDs Endpoint
		of "CONTINUITYOFCAREDOCUMENTS_GET": call ReturnMessage("object","")
 
		; Get Diagnoses Endpoint
		of "DIAGNOSES_GET":
			if(sReqOrResp = "REQUEST")
				call ReturnMessage("object","")
			else
				case(sFieldName)
					of "ENCOUNTERTYPE": set iCodeSet = 71
					of "PATIENTCLASS": set iCodeSet = 69
					of "SOURCEVOCABULARY": set iCodeSet = 400
					of "CONFIRMATIONSTATUS": set iCodeSet = 12031
					of "CLASSIFICATION": set iCodeSet = 12033
					of "DIAGNOSISTYPE": set iCodeSet = 17
					of "SEVERITY": set iCodeSet = 12022
					of "DIAGNOSISCODE": call ReturnMessage("api","problem discovery")
					else
						call ReturnMessage("field",build2("ENCOUNTERTYPE, PATIENTCLASS, SOURCEVOCABULARY, CONFIRMATIONSTATUS, CLASSIFICATION, ",
						"DIAGNOSISTYPE,SEVERITY, DIAGNOSISCODE"))
				endcase
			endif
 
		; Get Document Endpoint
		of "DOCUMENTS_CONTENT_GET":
			if(sReqOrResp = "REQUEST")
				call ReturnMessage("object","")
			else
				case(sFieldName)
					of value("DOCUMENTTYPE","DOCUMENTS.DOCUMENTTYPE"): call ReturnMessage("api","document discovery")
					of "DOCUMENTAUDITS.ACTIONTYPE": set iCodeSet = 21
					of "DOCUMENTAUDITS.ACTIONSTATUS": set iCodeSet = 103
					of "DOCUMENTS.DOCUMENTSTATUS": set iCodeSet = 8
					of "DOCUMENTS.STORAGE": set iCodeSet = 25
					of "DOCUMENTS.FORMAT": set iCodeSet = 23
					of "DOCUMENTSTATUS": set iCodeSet = 8
					of "ENCOUNTERTYPE": set iCodeSet = 71
					of "PATIENTCLASS": set iCodeSet = 69
					of "DOCUMENTFORMAT": set iCodeSet = 23
					else
						call ReturnMessage("field",build2("DOCUMENTAUDITS.ACTIONTYPE, DOCUMENTAUDITS.ACTIONSTATUS, DOCUMENTS.DOCUMENTTYPE, ",
						"DOCUMENTS.DOCUMENTSTATUS, DOCUMENTS.STORAGE, DOCUMENTS.FORMAT, DOCUMENTTYPE, DOCUMENTSTATUS, ENCOUNTERTYPE, ",
						"PATIENTCLASS, DOCUMENTFORMAT"))
				endcase
			endif
 
		; Get Documents Discovery Endpoint
		of "DOCUMENTS_DISCOVERY_GET": call ReturnMessage("object","")
 
		; Get Documents Endpoint
		of "DOCUMENTS_GET":
			if(sReqOrResp = "REQUEST")
				call ReturnMessage("object","")
			else
				case(sFieldName)
					of "DOCUMENTTYPE": call ReturnMessage("api","document discovery")
					of "DOCUMENTSTATUS": set iCodeSet = 8
					of "ENCOUNTERTYPE": set iCodeSet = 71
					of "PATIENTCLASS": set iCodeSet = 69
					of "DOCUMENTFORMAT": set iCodeSet = 23
					else
						call ReturnMessage("field","DOCUMENTTYPE, DOCUMENTSTATUS, ENCOUNTERTYPE, PATIENTCLASS, DOCUMENTFORMAT")
				endcase
			endif
 
		; Post Documents Endpoint
		of "DOCUMENTS_POST":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "DOCUMENTTYPE": call ReturnMessage("api","document discovery")
					of "STATUS": call CustomFilters("POSTDOCUMENTSTATUS")
					of "FORMAT": set iCodeSet = 23
					of "PATIENTIDTYPEID": set iCodeSet = 4
					of "SERVICEDEPARTMENTID": set iCodeSet = 89
					else
						call ReturnMessage("field","DOCUMENTTYPE, STATUS, FORMAT, PATIENTIDTYPEID, SERVICEDEPARTMENTID")
				endcase
			else
				call ReturnMessage("object","")
			endif
 
		; Put Documents Endpoint
		of "DOCUMENTS_PUT":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "STATUS": call CustomFilters("PUTDOCUMENTSTATUS")
					of "FORMAT": set iCodeSet = 23
					of "SERVICEDEPARTMENTID": set iCodeSet = 89
					else
						call ReturnMessage("field","STATUS, FORMAT, SERVICEDEPARTMENTID")
				endcase
			else
				call ReturnMessage("object","")
			endif
 
		; Get Family History Endpoint
		of "FAMILYHISTORIES_GET":
			if(sReqOrResp = "REQUEST")
				call ReturnMessage("object","")
			else
				case(sFieldName)
					of "FAMILYRELATIONSHIPTYPE": set iCodeSet = 40
					else
						call ReturnMessage("field","FAMILYRELATIONSHIPTYPE")
				endcase
			endif
 
		; Get Health Maintenance Events Endpoint. **NEED TO FIND PATIENT WITH DATA**
		of "HEALTHMAINTENANCEEVENTS_GET":
			if(sReqOrResp = "REQUEST")
				call ReturnMessage("object","")
			else
				case(sFieldName)
					of "HEALTHMAINTENANCEREMINDERS.REMINDERSTATUS": call GetFlagValues("HM_RECOMMENDATION", "STATUS_FLAG" )
					of "HEALTHMAINTENANCEREMINDERS.REMINDERPRIORITY": set iCodeSet = 30283
					of "HEALTHMAINTENANCEREMINDERS.REMINDERFREQUENCYUNIT": set iCodeSet = 54
					of "HEALTHMAINTENANCEREMINDERS.HEALTHMAINTENCEHISTORIES.HISTORYCODE": set iCodeSet = 30281
					of "HEALTHMAINTENANCEREMINDERS.HEALTHMAINTENCEHISTORIES.HISTORYREASONCODE": set iCodeSet = 30440
					else
						call ReturnMessage("field", build2("HEALTHMAINTENANCEREMINDERS.REMINDERSTATUS, HEALTHMAINTENANCEREMINDERS.REMINDERPRIORITY, ",
						"HEALTHMAINTENANCEREMINDERS.REMINDERFREQUENCYUNIT, HEALTHMAINTENANCEREMINDERS.HEALTHMAINTENCEHISTORIES.HISTORYCODE, ",
						"HEALTHMAINTENANCEREMINDERS.HEALTHMAINTENCEHISTORIES.HISTORYREASONCODE"))
				endcase
			endif
 
		; Get Immunizations Endpoint
		of "IMMUNIZATIONS_GET":
			if(sReqOrResp = "REQUEST")
				call ReturnMessage("object","")
			else
				case(sFieldName)
				of "STATUS": set iCodeSet = 8
				of "BODYSITE": set iCodeSet = 97
				of "ROUTE": set iCodeSet = 4001
				of "DOSEUNIT": set iCodeSet = 54
				of "VACCINEMANUFACTURER": set iCodeSet = 4007
				of "ENCOUNTERTYPE": set iCodeSet = 71
				of "PATIENTCLASS": set iCodeSet = 69
				else
					call ReturnMessage("field","STATUS, BODYSITE, ROUTE, DOSEUNIT, VACCINEMANUFACTURER, ENCOUNTERTYPE, PATIENTCLASS")
				endcase
			endif
 
		; Get Intake/Output Discovery Endpoint
		of "INTAKEOUTPUTS_DISCOVERY_GET": call ReturnMessage("object","")
 
		; Get Intake/Output Endpoint
		of "INTAKEOUTPUTS_GET":
			if(sReqOrResp = "REQUEST")
				call ReturnMessage("object","")
			else
				case(sFieldName)
					of "ENCOUNTERTYPE": set iCodeSet = 71
					of "PATIENTCLASS": set iCodeSet = 69
					of "RESULTNAME":  call ReturnMessage("api","intake/outputs discovery")
					of "COMPONENTID": call ReturnMessage("api","intake/outputs discovery")
					else
						call ReturnMessage("field","ENCOUNTERTYPE, PATIENTCLASS, RESULTNAME, COMPONENTID")
				endcase
			endif
 
		; Get LabOrders Endpoint
		of "LABORDERS_GET":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "ORDERTYPE": call ReturnMessage("api","lab discovery")
					else
						call ReturnMessage("field","ORDERTYPE")
				endcase
			else
				case(sFieldName)
					of "LABORDERS.ORDERSTATUS": set iCodeSet = 6004
					of "LABORDERS.ENCOUNTERTYPE": set iCodeSet = 71
					of "LABORDERS.PATIENTCLASS": set iCodeSet = 69
					of "LABORDERS.COMPONENTS.UNITS": set iCodeSet = 54
					of "LABORDERS.COMPONENTS.NORMALCY": set iCodeSet = 52
					of "LABORDERS.COMPONENTS.ORDERSTATUS": set iCodeSet = 8
					of "LABORDERS.COMPONENTS.NOTES.FORMAT": set iCodeSet = 23
					of "LABORDERS.LABLOCATIONS.ADDRESS.TYPE": set iCodeSet = 212
					else
						call ReturnMessage("field",build2("LABORDERS.ORDERSTATUS, LABORDERS.ENCOUNTERTYPE, LABORDERS.PATIENTCLASS, ",
						"LABORDERS.COMPONENTS.UNITS, LABORDERS.COMPONENTS.NORMALCY, LABORDERS.COMPONENTS.ORDERSTATUS, ",
						"LABORDERS.COMPONENTS.NOTES.FORMAT, LABORDERS.LABLOCATIONS.ADDRESS.TYPE"))
				endcase
			endif
 
		; Get LabResults Endpoint
		of "LABRESULTS_GET":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "COMPONENTIDLIST": call ReturnMessage("api","lab discovery")
				endcase
			else
				case(sFieldName)
					of "ENCOUNTERTYPE": set iCodeSet = 71
					of "PATIENTCLASS": set iCodeSet = 69
					of value("COMPONENTID","COMPONENTDESC"): call ReturnMessage("api","lab discovery")
					of "NORMALCY": set iCodeSet = 52
					of "UNITS": set iCodeSet = 54
					of "NOTES.FORMAT": set iCodeSet = 23
					of "LABLOCATIONS.ADDRESS.TYPE": set iCodeSet = 212
					of "STATUS": set iCodeSet = 8
					else
						call ReturnMessage("field",build2("ENCOUNTERTYPE, PATIENTCLASS, COMPONENTID, COMPONENTDESC, NORMALCY, UNITS, ",
							"NOTES.FORMAT, LABLOCATIONS.ADDRESS.TYPE, STATUS"))
				endcase
			endif
 
		; Post LabResults Endpoint
		of "LABRESULTS_POST":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "ORDERSTATUSID": set iCodeSet = 6004
					of "PATIENTIDTYPEID": set iCodeSet = 4
					of "RESULTSTATUSID": set iCodeSet = 8
					of "RESULTGROUPCOMPONENTID": call ReturnMessage("api","lab discovery")
					of "IDENTIFIERS.TYPEID": set iCodeSet = 400
					of "SPECIMEN.SOURCETYPEID": set iCodeSet = 2052
					of "SPECIMEN.BODYSITEID": set iCodeSet = 1028
					of "SPECIEMN.CONTAINERID": set iCodeSet = 2051
					of "SPECIMEN.COLLECTEDBYPROVIDERID": call ReturnMessage("api","provider discovery")
					of "RESULTGROUPS.COMPONENTID": call ReturnMessage("api","lab discovery")
					of "RESULTGROUPS.IDENTIFIERS.TYPEID": set iCodeSet = 400
					of "RESULTGROUPS.NORMALCY": set iCodeSet = 52
					of "RESULTGROUPS.PERFORMINGLABID": call ReturnMessage("api","lab location discovery")
					of "RESULTGROUPS.STATUSID": set iCodeSet = 8
					of "RESULTGROUPS.UNITID": set iCodeSet = 54
					of "UNSOLICITEDRESULTORDERINFORMATION.ENCOUNTERIDTYPEID": set iCodeSet = 319
					of "UNSOLICITEDRESULTORDERINFORMATION.ORDERINGPROVIDERID": call ReturnMessage("api","provider discovery")
					of "UNSOLICITEDRESULTORDERINFORMATION.ORDERINGPROVIDERIDTYPEID": set iCodeSet = 333
					of "SYSTEMID": set iCodeSet = 89
					of "SOURCEID": set iCodeSet = 30200
					else
						call ReturnMessage("field",build2("ORDERSTATUSID, PATIENTIDTYPEID, RESULTSTATUSID, ",
						"RESULTGROUPCOMPONENTID, IDENTIFIERS.TYPEID, SPECIMEN.SOURCETYPEID, SPECIMEN.BODYSITEID, ",
						"SPECIMEN.COLLECTEDBYPROVIDERID, RESULTGROUPS.COMPONENTID, RESULTGROUPS.IDENTIFIERS.TYPEID, ",
						"RESULTGROUPS.NORMALCY, RESULTGROUPS.PERFORMINGLABID, RESULTGROUPS.STATUSID, RESULTGROUPS.UNITID, ",
						"UNSOLICITEDRESULTORDERINFORMATION.ENCOUNTERIDTYPEID, UNSOLICITEDRESULTORDERINFORMATION.ORDERINGPROVIDERID, ",
						"UNSOLICITEDRESULTORDERINFORMATION.ORDERINGPROVIDERIDTYPEID, SYSTEMID, SOURCEID"))
				endcase
			else
 				call ReturnMessage("object","")
 			endif
 
		; Get Labs Discovery Endpoint
		of "LABS_DISCOVERY_GET": call ReturnMessage("object","")
 
		; Delete MedicationAdministration endoint
		of "MEDICATIONADMINISTRATIONS_DELETE":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "STATUSID": call CustomFilters("DELETEMEDADMINISTRATIONSTATUS")
					of "SYSTEMID": set iCodeSet = 89
					else
						call ReturnMessage("field",build2("STATUSID, SYSTEMID"))
				endcase
			else
				call ReturnMessage("object","")
			endif
 
		; Post Medication Administration Endpoint
		of "MEDICATIONADMINISTRATIONS_POST":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "PATIENTIDTYPE": set iCodeSet = 4
					of "PATIENTNOTSCANNEDREASON": set iCodeSet = 4003287
					of "MEDICATIONNOTSCANNEDREASON": set iCodeSet = 4000040
					of "ADMINISTRATIONACTIONID": set iCodeSet = 99
					of "ADMINISTRATIONCLINICIANID": call ReturnMessage("api","provider discovery")
					of "ADMINISTRATIONROUTEID": set iCodeSet = 4001
					of "ADMINISTRATIONSITEID": set iCodeSet = 97
					of "DOSEUNITID": set iCodeSet = 54
					of "DURATIONUNITID": set iCodeSet = 54
					of "REASONNOTGIVENID": set iCodeSet = 27920
					of "RATEUNITID": set iCodeSet = 54
					of "VOLUMEUNITID": set iCodeSet = 54
					of "SYSTEMID": set iCodeSet = 89
					else
						call ReturnMessage("field",build2("PATIENTIDTYPE, PATIENTNOTSCANNEDREASON, MEDICATIONNOTSCANNEDREASON, ",
						"ADMINISTRATIONACTIONID, ADMINISTRATIONCLINICIANID, ADMINISTRATIONROUTEID, ADMINISTRATIONSITEID, DOSEUNITID, ",
						"DURATIONUNITID, REASONNOTGIVENID, RATEUNITID, VOLUMEUNITID, SYSTEMID"))
				endcase
			else
				call ReturnMessage("object","")
			endif
 
		; Post IMMUNIZATIONADMINISTRATION_POST  Endpoint
		of "IMMUNIZATIONADMINISTRATION_POST":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "PATIENTIDTYPE": set iCodeSet = 4
					of "DOSEUNITID": set iCodeSet = 54
					of "VOLUMEUNITID": set iCodeSet = 54
					of "PATIENTNOTSCANNEDREASON": set iCodeSet = 4003287
					of "MEDICATIONNOTSCANNEDREASON": set iCodeSet = 4000040
					of "ADMINISTRATIONACTIONID": set iCodeSet = 99
					of "ADMINISTRATIONCLINICIANID": call ReturnMessage("api","provider discovery")
					of "ADMINISTRATIONROUTEID": set iCodeSet = 4001
					of "ADMINISTRATIONSITEID": set iCodeSet = 97
					of "DURATIONUNITID": set iCodeSet = 54
					of "REASONNOTGIVENID": set iCodeSet = 27920
					of "RATEUNITID": set iCodeSet = 54
					of "SYSTEMID": set iCodeSet = 89
					of "EARLYLATEREASON": set iCodeSet = 4000020
					of "MANUFACTURERID": set iCodeSet = 221
					of "VACCINEFORCHILDRENID": set iCodeSet = 30741
					of "FUNDINGSOURCEID": set iCodeSet = 4002904
					of "VACCINEINFORMATIONSTATEMENTSID": set iCodeSet = 4002875
					else
						call ReturnMessage("field",build2("PATIENTIDTYPE, PATIENTNOTSCANNEDREASON, MEDICATIONNOTSCANNEDREASON, ",
						"ADMINISTRATIONACTIONID, ADMINISTRATIONCLINICIANID, ADMINISTRATIONROUTEID, ADMINISTRATIONSITEID, DOSEUNITID, ",
						"DURATIONUNITID, REASONNOTGIVENID, RATEUNITID, VOLUMEUNITID, SYSTEMID,EARLYLATEREASON, MANUFACTURERID, ",
						"VACCINEFORCHILDRENID, FUNDINGSOURCEID, VACCINEINFORMATIONSTATEMENTSID"))
				endcase
			else
				call ReturnMessage("object","")
			endif
 
		; Get Medications Endpoint
		of value("MEDICATIONORDERS_GET","POPULATION_MEDICATIONORDERS_GET"):
			if(sReqOrResp = "REQUEST")
				call ReturnMessage("object","")
			else
				case(sFieldName)
					of "MEDICATIONORDERS.FREQUENCY": set iCodeSet = 4003
					of "MEDICATIONORDERS.MEDICATIONCATEGORY": set iCodeSet = 16389
					of "MEDICATIONORDERS.MEDICATIONORDERBASIS": call GetFlagValues("ORDERS","ORIG_ORD_AS_FLAG")
					of "MEDICATIONORDERS.MEDICATIONSTATUS": set iCodeSet = 6004
					of "MEDICATIONORDERS.MEDICATIONDEPARTMENTSTATUS": set iCodeSet = 14281
					of "MEDICATIONORDERS.MEDICATIONORDERPRIORITY": set iCodeSet = 4010
					of "MEDICATIONORDERS.MEDICATIONORDERTYPE": set iCodeSet = 6000
					of "MEDICATIONORDERS.MEDICATIONCOMMUNICATIONTYPE": set iCodeSet = 6006
					of "MEDICATIONORDERS.MEDICATIONTYPE": set iCodeSet = 18309
					of "MEDICATIONORDERS.ROUTE": set iCodeSet = 4001
					of "MEDICATIONORDERS.STRENGTHDOSEUNIT": set iCodeSet = 54
					of "MEDICATIONORDERS.VOLUMEDOSEUNIT": set iCodeSet = 54
					of "MEDICATIONORDERS.DRUGFORM": set iCodeSet = 4002
					of "MEDICATIONORDERS.STOPTYPE": set iCodeSet = 4009
					of "MEDICATIONORDERS.DURATIONUNIT": set iCodeSet = 54
					of "MEDICATIONORDERS.PATIENTCLASS": set iCodeSet = 69
					of "MEDICATIONORDERS.ENCOUNTERTYPE": set iCodeSet = 71
					of "MEDICATIONORDERS.MEDADMINISTRATIONS.ADMINISTRATIONACTION": set iCodeSet = 99
					of "MEDICATIONORDERS.MEDADMINISTRATIONS.DOSEUNIT": set iCodeSet = 54
					of "MEDICATIONORDERS.MEDADMINISTRATIONS.DOSEDURATION": set iCodeSet = 54
					of "MEDICATIONORDERS.MEDADMINISTRATIONS.RATEUNIT": set iCodeSet = 54
					of "MEDICATIONORDERS.SCHEDULEDMEDADMINISTRATIONS.STATUS": set iCodeSet = 79
					of "MEDICATIONORDERS.SCHEDULEDMEDADMINISTRATIONS.DOSEUNIT": set iCodeSet = 54
					else
						call ReturnMessage("field",build2("MEDICATIONORDERS.FREQUENCY, MEDICATIONORDERS.MEDICATIONCATEGORY, ",
						"MEDICATIONORDERS.MEDICATIONORDERBASIS, MEDICATIONORDERS.MEDICATIONSTATUS, ",
						"MEDICATIONORDERS.MEDICATIONDEPARTMENTSTATUS, MEDICATIONORDERS.MEDICATIONORDERPRIORITY, ",
						"MEDICATIONORDERS.MEDICATIONORDERTYPE, MEDICATIONORDERS.MEDICATIONCOMMUNICATIONTYPE, ",
						"MEDICATIONORDERS.MEDICATIONTYPE, MEDICATIONORDERS.ROUTE ",
						"MEDICATIONORDERS.STRENGTHDOSEUNIT, MEDICATIONORDERS.VOLUMEDOSEUNIT, MEDICATIONORDERS.DRUGFORM, ",
						"MEDICATIONORDERS.STOPTYPE, MEDICATIONORDERS.DURATIONUNIT ",
						"MEDICATIONORDERS.PATIENTCLASS, MEDICATIONORDERS.ENCOUNTERTYPE, ",
						"MEDICATIONORDERS.MEDADMINISTRATIONS.ADMINISTRATIONACTION, ",
						"MEDICATIONORDERS.MEDADMINISTRATIONS.DOSEUNIT, MEDICATIONORDERS.MEDADMINISTRATIONS.DOSEDURATION, ",
						"MEDICATIONORDERS.MEDADMINISTRATIONS.RATEUNIT, ",
						"MEDICATIONORDERS.SCHEDULEDMEDADMINISTRATIONS.STATUS, ",
						"MEDICATIONORDERS.SCHEDULEDMEDADMINISTRATIONS.DOSEUNIT"))
				endcase
			endif
 
		; Post Medication Order
		of "MEDICATIONORDERS_POST":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "MEDICATIONID": call ReturnMessage("api","orders discovery")
					of "PROVIDERID": call ReturnMessage("api","provider discovery")
					else
						call ReturnMessage("field",build2("MEDICATIONID, PROVIDERID"))
				endcase
			else
				call ReturnMessage("object","")
			endif
 
		;Put Medicaiton Order - Verify
 		of "MEDICATIONORDERS_VERIFY_PUT": call ReturnMessage("object","")
 
		; Get Message Folders and Get Messages - Not built in Cerner
		of value("MESSAGEFOLDERS_GET", "MESSAGES_GET"): call ReturnMessage("object","")
 
		; Post Message Endpoint
		of "MESSAGES_POST": call ReturnMessage("object","")
 
		; Post Portal Account - Not built in Cerner
		of "NONPATIENTPORTALACCOUNTS_POST": call ReturnMessage("object","")
 
		; Get Observations Discovery Endpoint
		of "OBSERVATIONS_DISCOVERY_GET":
			if(sReqOrResp = "REQUEST")
					case(sFieldName)
						of "CATEGORYID": set iCodeSet = 93
						else
							call ReturnMessage("field","CATEGORYID")
					endcase
			else
				call ReturnMessage("object","")
			endif
 
		; Get Observation Component Discovery Endpoint
		of "OBSERVATIONCOMPONENT_DISCOVERY_GET":
			if(sReqOrResp = "REQUEST")
					case(sFieldName)
						of "COMPONENTLIST": call ReturnMessage("api","observation discovery")
						else
							call ReturnMessage("field","COMPONENTLIST")
					endcase
			else
				call ReturnMessage("object","")
			endif
 
		; Get Obersvation & Observations Endpoints
		of "OBSERVATIONS_GET":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "CATEGORYID": set iCodeSet = 93
					of "COMPONENTLIST": call ReturnMessage("api","observation discovery")
					else
						call ReturnMessage("field","CATEGORYID, COMPONENTLIST")
				endcase
			else
				case(sFieldName)
					of "COMPONENTID": call ReturnMessage("api","observation discovery")
					of "OBSERVATIONTYPE": set iCodeSet = 53
					of "OBSERVATIONSTATUS": set iCodeSet = 8
					of "OBSERVATIONUNITS": set iCodeSet = 54
					of "NORMALCY": set iCodeSet = 52
					of "ENCOUNTERTYPE": set iCodeSet = 71
					of "PATIENTCLASS": set iCodeSet = 69
					else
						call ReturnMessage("field","COMPONENTID, OBSERVATIONSTATUS, OBSERVATIONUNITS, NORMALCY, ENCOUNTERTYPE, PATIENTCLASS")
				endcase
			endif
 
		; Post Observations Endpoint
		of "OBSERVATIONS_POST":
				if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "COMPONENTID": call ReturnMessage("api","observation discovery")
					of "SYSTEMID": set iCodeSet = 89
					of "SOURCEID": set iCodeSet = 30200
					of "VALUECODES":  call ReturnMessage("api","observation component discovery")
					else
						call ReturnMessage("field","COMPONENTID, SYSTEMID, SOURCEID, VALUECODES")
				endcase
			else
				call ReturnMessage("object","")
			endif
 
 		;Delete Observations Endpoint
		of "OBSERVATIONS_DELETE":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "STATUSID": set iCodeSet = 8
					of "REASON": call CustomFilters("PUT_OBS_REASON")
					else
						call ReturnMessage("field","STATUSID, REASON")
				endcase
			else
				call ReturnMessage("object","")
			endif
 
		;Put Observations Endpoint
		of "OBSERVATIONS_PUT": call ReturnMessage("object","")
 
		; Get Orders Discovery Endpoint
		of "ORDERS_DISCOVERY_GET":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "ORDERABLETYPEID": set iCodeSet = 106
					of "CODINGSYSTEM": set iCodeSet = 29223
					else
						call ReturnMessage("field","ORDERABLETYPEID, CODINGSYSTEM")
				endcase
			else
				call ReturnMessage("object","")
			endif
 
		; Get Order & Orders Endpoints
		of "ORDERS_GET":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "ORDERTYPES": set iCodeSet = 16389
					else
						call ReturnMessage("field","ORDERTYPES")
				endcase
			else
				case(sFieldName)
					of "ORDERNAME": call ReturnMessage("api","orders discovery")
					of "ORDERSTATUS": set iCodeSet = 6004
					of "ORDERTYPE": set iCodeSet = 106
					of "DEPARTMENTSTATUS": set iCodeSet = 14281
					of "ENCOUNTERTYPE": set iCodeSet = 71
					of "PATIENTCLASS": set iCodeSet = 69
					of "ORDERCOMMENTS.COMMENTTYPE": set iCodeSet = 14
					else
						call ReturnMessage("field","ORDERNAME, ORDERSTATUS, ORDERTYPE, DEPARTMENTSTATUS, ENCOUNTERTYPE, ",
						"PATIENTCLASS, ORDERCOMMENTS.COMMENTTYPE")
				endcase
			endif
 
		; Get Patient Care Teams Endpoint
		of "PATIENTCARETEAMS_POST":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "PERSONRELATIONSHIPID": set iCodeSet = 331
					of "ENCOUNTERRELATIONSHIPID": set iCodeSet = 333
					else
						call ReturnMessage("field","PERSONRELATIONSHIPID, ENCOUNTERRELATIONSHIPID")
				endcase
			else
				call ReturnMessage("object","")
			endif
 
		; Get Patient Encounters Endpoint
		of "PATIENTENCOUNTERS_GET":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "ENCOUNTERTYPEID": set iCodeSet = 71
					else
						call ReturnMessage("field","ENCOUNTERTYPEID")
				endcase
			else
				case(sFieldName)
					of "ENCOUNTERSTATUS": set iCodeSet = 261
					of "ENCOUNTERTYPE": set iCodeSet = 71
					of "MEDICALSERVICE": set iCodeSet = 34
					of "PATIENTCLASS": set iCodeSet = 69
					of "ADMITPRIORITY": set iCodeSet = 3
					of "ADMITSOURCE": set iCodeSet = 2
					of "LOCATION.BED": call ReturnMessage("api","location discovery")
					of "LOCATION.UNIT": call ReturnMessage("api","location discovery")
					of "LOCATION.HOSPITAL": call ReturnMessage("api","location discovery")
					of "LOCATION.ROOM": call ReturnMessage("api","location discovery")
					of "PATIENTCARETEAMS.RELATIONSHIPTYPE": set iCodeSet = 333
					of "PATIENTCARETEAMS.PHONES.TYPE": set iCodeSet = 43
					of "INSURANCEPLANS.PAYORSTATE": set iCodeSet = 62
					of "INSURANCEPLANS.PATIENTRELATIONTOSUBSCRIBER": set iCodeSet = 40
					of "INSURANCEPLANS.SUBSCRIBERRELATIONTOPATIENT": set iCodeSet = 40
					else
						call ReturnMessage("field",build2("ENCOUNTERSTATUS, ENCOUNTERTYPE, MEDICALSERVICE, PATIENTCLASS, ",
						"ADMITPRIORITY, ADMITSOURCE, LOCATION.BED, LOCATION.UNIT, LOCATION.HOSPITAL, LOCATION.ROOM, ",
						"PATIENTCARETEAMS.RELATIONSHIPTYPE, ",
						"PATIENTCARETEAMS.PHONES.TYPE, INSURANCEPLANS.PAYORSTATE, INSURANCEPLANS.PATIENTRELATIONTOSUBSCRIBER, ",
						"INSURANCEPLANS.SUBSCRIBERRELATIONTOPATIENT"))
				endcase
			endif
 
		; Post Patient Encounter Endpoint
		of "PATIENTENCOUNTERS_POST":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "PATIENTIDTYPE": set iCodeSet = 263
					of "ENCOUNTER.ATTENDINGPROVIDERID": call ReturnMessage("api","providers discovery")
					of "ENCOUNTER.ENCOUNTERSTATUSID": set iCodeSet = 261
					of "ENCOUNTER.ENCOUNTERTYPEID": call CustomFilters("POST_ENCOUNTER_ENC_TYPES")
					of "ENCOUNTER.LOCATION.BEDID": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.UNITID": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.HOSPITALID": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.ROOMID": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.MEDICALSERVICEID": set iCodeSet = 34
					of "ENCOUNTER.PATIENTCLASSID": call CustomFilters("POST_ENCOUNTER_ENC_CLASS")
					of "ENCOUNTER.ADMITPRIORITYID": set iCodeSet = 3
					of "ENCOUNTER.ADMITSOURCEID": set iCodeSet = 2
					of "ENCOUNTER.GUARANTORID": call ReturnMessage("api","get patients")
					else
						call ReturnMessage("field",build2("PATIENTIDTYPE,ENCOUNTER.ATTENDINGPROVIDERID,ENCOUNTER.ENCOUNTERTYPEID, ",
						"ENCOUNTER.LOCATION.BEDID,ENCOUNTER.LOCATION.UNITID,ENCOUNTER.LOCATION.HOSPITALID,ENCOUNTER.LOCATION.ROOMID, ",
						"ENCOUNTER.MEDICALSERVICEID,ENCOUNTER.PATIENTCLASSID,ENCOUNTER.ADMITPRIORITYID,ENCOUNTER.ADMITSOURCEID, ",
						"ENCOUNTER.GUARANTORID"))
				endcase
			else
 				call ReturnMessage("object","")
 			endif
 
		; Post Patient Encounter Endpoint
		of "PATIENTENCOUNTERS_PATCH":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "ENCOUNTERIDTYPEID": set iCodeSet = 319
					of "ENCOUNTER.ADMITSOURCEID": set iCodeSet = 2
					of "ENCOUNTER.ADMITPRIORITYID": set iCodeSet = 3
					of "ENCOUNTER.MEDICALSERVICEID": set iCodeSet = 34
					of "ENCOUNTER.VISITORSTATUSID": set iCodeSet = 14754
					of "ENCOUNTER.PROVIDERSTYPE.PROVIDERTYPE": set iCodeSet = 333
					of "ENCOUNTER.PROVIDERSTYPE.ADDRESS.TYPEID": set iCodeSet = 212
					of "ENCOUNTER.PROVIDERSTYPE.PHONES.PHONETYPEID": set iCodeSet = 42
					of "ENCOUNTER.PROVIDERSTYPE.PHONES.FORMATID": set iCodeSet = 281
					of "ENCOUNTER.ENCOUNTERTYPEID": set iCodeSet = 71
					of "ENCOUNTER.ENCOUNTERSTATUSID": set iCodeSet = 261
					of "ENCOUNTER.GUARANTORRELATIONSHIPTOPATIENTID": set iCodeSet = 40
					of "ENCOUNTER.GUARANTORTYPEID": set iCodeSet = 351
					of "ENCOUNTER.TREATMENTPHASEID": set iCodeSet = 4018002
					of "ENCOUNTER.VALUABLES.PATIENTVALUABLESID": set iCodeSet = 14751
					of "ENCOUNTER.EXTENDEDINFO.CUSTOMFIELDS.FIELDID": call CustomFilters("PATCH_PATIENTENCOUNTERS_CUSTOM_FIELD")
					of "ENCOUNTER.LOCATION.BEDID": set iCodeSet = 220
					of "ENCOUNTER.LOCATION.ROOMID": set iCodeSet = 220
					of "ENCOUNTER.LOCATION.UNITID": set iCodeSet = 220
					else
						call ReturnMessage("field",build2("ENCOUNTER.MEDICALSERVICEID, ENCOUNTER.VISITORSTATUSID, ",
						"ENCOUNTER.PROVIDERSTYPE.PROVIDERTYPE, ",
						"ENCOUNTER.PROVIDERSTYPE.ADDRESS.TYPEID, ENCOUNTER.PROVIDERSTYPE.PHONES.PHONETYPEID, ",
						"ENCOUNTER.PROVIDERSTYPE.PHONES.FORMATID, ENCOUNTER.ENCOUNTERTYPEID, ",
						"ENCOUNTER.ENCOUNTERSTATUSID, ENCOUNTER.GUARANTORRELATIONSHIPTOPATIENTID, ",
						"ENCOUNTER.GUARANTORTYPEID, TREATMENTPHASEID, ",
						"ENCOUNTER.VALUABLES.PATIENTVALUABLESID, ENCOUNTER.EXTENDEDINFO.CUSTOMFIELDS.FIELDID, ",
				   	 "ENCOUNTER.LOCATION.BEDID, ENCOUNTER.LOCATION.ROOMID,ENCOUNTER.LOCATION.UNITID"))
				endcase
			else
 				call ReturnMessage("object","")
 			endif
 
		; Post Patient Encounter Relations Endpoint
		of "PATIENTENCOUNTERRELATIONS_POST":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "ENCOUNTERIDTYPEID": set iCodeSet = 319
					of "RELATIONSHIPTYPEID": set iCodeSet = 351
					of "RELATEDPERSONRELATIONTOPATIENTID": set iCodeSet = 40
					of "PATIENTRELATIONTORELATEDPERSONID": set iCodeSet = 40
 
					else
						call ReturnMessage("field",build2("ENCOUNTERIDTYPEID, RELATIONSHIPTYPEID, ",
					"RELATEDPERSONRELATIONTOPATIENTID, PATIENTRELATIONTORELATEDPERSONID"))
				endcase
			else
 				call ReturnMessage("object","")
 			endif
 
	;Put Patient Encounter Relations Endpoint
		of "PATIENTENCOUNTERRELATIONS_PUT":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "PATIENTRELATIONTORELATEDPERSONID": set iCodeSet = 40
					of "RELATEDPERSONRELATIONTOPATIENTID": set iCodeSet = 40
					else
						call ReturnMessage("field",build2("PATIENTRELATIONTORELATEDPERSONID, ",
					"RelatedPersonRelationToPatientId"))
				endcase
			else
 				call ReturnMessage("object","")
 			endif
 
	;Put Patient Encounter Relations Endpoint
		of "PATIENTENCOUNTERRELATIONS_PATCH":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "PATIENTRELATIONTORELATEDPERSONID": set iCodeSet = 40
					of "RELATEDPERSONRELATIONTOPATIENTID": set iCodeSet = 40
					else
						call ReturnMessage("field",build2("PATIENTRELATIONTORELATEDPERSONID, ",
					"RelatedPersonRelationToPatientId"))
				endcase
			else
 				call ReturnMessage("object","")
 			endif
 
		; Post Patient Encounter Endpoint - Not Built in Cerner
		of "PATIENTENCOUNTERS_PUT": call ReturnMessage("object","")
 
		; Post Patient Encounter Endpoint - Not Built in Cerner
		of "PATIENTGUARANTORS_POST": call ReturnMessage("object","")
 
		; Get Patient List Endpoint
		of "PATIENTLIST_GET":
			if(sReqOrResp = "REQUEST")
				call ReturnMessage("object","")
			else
				case(sFieldName)
					of "GENDER": set iCodeSet = 57
					of "ENCOUNTERTYPE": set iCodeSet = 71
					of "VIP": set iCodeSet = 67
					of "CONFIDENTIALITY": set iCodeSet = 87
					of "EXTENDEDINFO.ETHNICITY": set iCodeSet = 27
					of "EXTENDEDINFO.LANGUAGE": set iCodeSet = 36
					of "EXTENDEDINFO.RACE": set iCodeSet = 282
					of "EXTENDEDINFO.RELIGION": set iCodeSet = 49
					of "EXTENDEDINFO.MARITALSTATUS": set iCodeSet = 38
					of "EXTENDEDINFO.ADDRESSES.TYPE": set iCodeSet = 212
					of "EXTENDEDINFO.PHONES.TYPE": set iCodeSet = 43
					of "PATIENTCARETEAMS.RELATIONSHIPTYPE": set iCodeSet = 333
					of "PATIENTCARETEAMS.PHONES.TYPE": set iCodeSet = 43
					of "IDENTITIES.CODE": set iCodeSet = 4
					else
						call ReturnMessage("field",build2("GENDER, ENCOUNTERTYPE, VIP, CONFIDENTIALITY, EXTENDEDINFO.ETHNICITY, ",
						"EXTENDEDINFO.LANGUAGE, EXTENDEDINFO.RACE, EXTENDEDINFO.RELIGION, EXTENDEDINFO.MARITALSTATUS, ",
						"EXTENDEDINFO.ADDRESSES.TYPE, EXTENDEDINFO.PHONES.TYPE, ",
						"PATIENTCARETEAMS.RELATIONSHIPTYPE, PATIENTCARETEAMS.PHONES.TYPE,IDENTITIES.CODE " ))
				endcase
			endif
 
		; Put Patient List - Not Built in Cerner
		of "PATIENTLIST_PUT": call ReturnMessage("object","")
 
		; Get Patient Lists Endpoint
		of "PATIENTLISTS_GET": call ReturnMessage("object","")
 
		; Get Patient Messages Recipients - Not Built in Cerner
		of "PATIENTMESSAGERECIPIENTS_GET": call ReturnMessage("object","")
 
		; Delete Patient Messages - Not Built in Cerner
		of "PATIENTMESSAGES_DELETE": call ReturnMessage("object","")
 
		; Get Patient Messages - Not Built in Cerner
		of "PATIENTMESSAGES_GET": call ReturnMessage("object","")
 
		; Post Patient Messages - Not Built in Cerner
		of "PATIENTMESSAGES_POST": call ReturnMessage("object","")
 
		; Put Patient Messages - Not Built in Cerner
		of "PATIENTMESSAGES_PUT": call ReturnMessage("object","")
 
		; Get Patient Messages Subjects - Not Built in Cerner
		of "PATIENTMESSAGESUBJECTS_GET": call ReturnMessage("object","")
 
		; Post Patient Portal Accounts - Not Built in Cerner
		of "PATIENTPORTALACCOUNTS_POST": call ReturnMessage("object","")
 
		; Get Patient & Patients Endpoints
		of "PATIENTS_GET":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "GENDER": set iCodeSet = 57
					else
						call ReturnMessage("field","GENDER")
				endcase
			else
				case(sFieldName)
					of "GENDER": set iCodeSet = 57
					of "VIP": set iCodeSet = 67
					of "CONFIDENTIALITY": set iCodeSet = 87
					of "EXTENDEDINFO.ETHNICITY": set iCodeSet = 27
					of "EXTENDEDINFO.LANGUAGE": set iCodeSet = 36
					of "EXTENDEDINFO.RACE": set iCodeSet = 282
					of "EXTENDEDINFO.RELIGION": set iCodeSet = 49
					of "EXTENDEDINFO.MARITALSTATUS": set iCodeSet = 38
					of "EXTENDEDINFO.ADDRESSES.TYPE": set iCodeSet = 212
					of "EXTENDEDINFO.PHONES.TYPE": set iCodeSet = 43
					of "PATIENTCARETEAMS.RELATIONSHIPTYPE": set iCodeSet = 331
					of "PATIENTCARETEAMS.PHONES.TYPE": set iCodeSet = 43
					of "IDENTITIES.CODE": set iCodeSet = 4
					of "RELATEDPERSONS.PHONES.TYPE": set iCodeSet = 43
					of "INSURANCEPLANS.PAYORSTATE": set iCodeSet = 62
					of "INSURANCEPLANS.INSURANCECLASS": set iCodeSet = 397	;015
					of "INSURANCEPLANS.INSURANCETYPE": set iCodeSet = 367	;015
					of "INSURANCEPLANS.SUBSCRIBERADDRESS.TYPE": set iCodeSet = 212 ;015
					else
						call ReturnMessage("field",build2("GENDER, VIP, CONFIDENTIALITY, EXTENDEDINFO.ETHNICITY, ",
						"EXTENDEDINFO.LANGUAGE, EXTENDEDINFO.RACE, EXTENDEDINFO.RELIGION, EXTENDEDINFO.MARITALSTATUS, ",
						"EXTENDEDINFO.ADDRESSES.TYPE, PATIENTCARETEAMS.PHONES.TYPE,IDENTITIES.CODE, ",
						"EXTENDEDINFO.PHONES.TYPE, PATIENTCARETEAMS.RELATIONSHIPTYPE,  ",
						"RELATEDPERSONS.PHONES.TYPE, INSURANCEPLANS.PAYORSTATE, INSURANCEPLANS.INSURANCECLASS, ",
						"INSURANCEPLANS.INSURANCETYPE, INSURANCEPLANS.SUBSCRIBERADDRESS.TYPE" ))
				endcase
			endif
 
		; Post Patients
		of "PATIENTS_POST":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "PATIENT.GENDERID": set iCodeSet = 57
					of "PATIENT.VIPID": set iCodeSet = 67
					of "PATIENT.CONFIDENTIALITYID": set iCodeSet = 87
					of "PATIENT.EXTENDEDINFO.BIRTHGENDERID": set iCodeSet = 56
					of "PATIENT.EXTENDEDINFO.ETHNICITYID": set iCodeSet = 27
					of "PATIENT.EXTENDEDINFO.LANGUAGEID": set iCodeSet = 36
					of "PATIENT.EXTENDEDINFO.RACEID": set iCodeSet = 282
					of "PATIENT.EXTENDEDINFO.RELIGIONID": set iCodeSet = 49
					of "PATIENT.EXTENDEDINFO.MARITALSTATUSID": set iCodeSet = 38
					of "PATIENT.EXTENDEDINFO.ADDRESSES.TYPEID": set iCodeSet = 212
					of "PATIENT.EXTENDEDINFO.PHONES.TYPEID": set iCodeSet = 43
					of "PATIENT.EXTENDEDINFO.CUSTOMFIELDS.FIELDID": call CustomFilters("POST_PATIENT_CUSTOM_FIELD")
					of "PATIENT.EXTENDEDINFO.ALTERNATIVENAMES.NAMETYPEID": set iCodeSet = 213
					of "FACILITYID": call ReturnMessage("api","location discovery")
					of "INTERPRETERTYPEID": set iCodeSet = 329
					of "PATIENT.EXTENDEDINFO.ADDRESSES.COUNTY": set iCodeSet = 74
					of "PATIENT.EXTENDEDINFO.ADDRESSES.COUNTRY": set iCodeSet = 15
					of "PATIENT.EXTENDEDINFO.PHONES.FORMATID": set iCodeSet = 281
					of "PATIENT.EXTENDEDINFO.EDUCATIONLEVELID": set iCodeSet = 284
					of "PATIENT.EXTENDEDINFO.WRITTENFORMATID": set iCodeSet = 4000760
					of "PATIENT.EXTENDEDINFO.STUDENTSTATUSID": set iCodeSet = 281
					of "PATIENT.EXTENDEDINFO.PATIENTPORTAL.CHALLENGEQUESTIONID": set iCodeSet = 4003353
					else
						call ReturnMessage("field",build2("PATIENT.GENDERID, PATIENT.VIPID, PATIENT.CONFIDENTIALITYID, ",
						"PATIENT.EXTENDEDINFO.ETHNICITYID, PATIENT.EXTENDEDINFO.LANGUAGEID, PATIENT.EXTENDEDINFO.RACEID, ",
						"PATIENT.EXTENDEDINFO.RELIGIONID, PATIENT.EXTENDEDINFO.MARITALSTATUSID, FACILITYID, ",
						"PATIENT.EXTENDEDINFO.ADDRESSES.TYPEID, PATIENT.EXTENDEDINFO.PHONES.TYPEID, INTERPRETERTYPEID, ",
						"PATIENT.EXTENDEDINFO.CUSTOMFIELDS.FIELDID, PATIENT.EXTENDEDINFO.ALTERNATIVENAMES.NAMETYPEID, ",
						"PATIENT.EXTENDEDINFO.ADDRESSES.COUNTY, PATIENT.EXTENDEDINFO.ADDRESSES.COUNTRY, ",
						"PATIENT.EXTENDEDINFO.PHONES.FORMATID, PATIENT.EXTENDEDINFO.EDUCATIONLEVELID, ",
						"PATIENT.EXTENDEDINFO.WRITTENFORMATID, PATIENT.EXTENDEDINFO.STUDENTSTATUSID, ",
						"PATIENT.EXTENDEDINFO.PATIENTPORTAL.CHALLENGEQUESTIONID, ",
						"PATIENT.EXTENDEDINFO.BIRTHGENDERID"))
				endcase
			else
				case(sFieldName)
					of "ALTERNATIVEIDENTIFIERS.CODE": set iCodeSet = 4
					else
						call ReturnMessage("field",build2("ALTERNATIVEIDENTIFIERS.CODE"))
				endcase
			endif
 
		; Put Patients
		of "PATIENTS_PUT":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "PATIENTIDTYPE": set iCodeSet = 4
					of "PATIENT.GENDERID": set iCodeSet = 57
					of "PATIENT.VIPID": set iCodeSet = 67
					of "PATIENT.CONFIDENTIALITYID": set iCodeSet = 87
					of "PATIENT.EXTENDEDINFO.BIRTHGENDERID": set iCodeSet = 56
					of "PATIENT.EXTENDEDINFO.ETHNICITYID": set iCodeSet = 27
					of "PATIENT.EXTENDEDINFO.LANGUAGEID": set iCodeSet = 36
					of "PATIENT.EXTENDEDINFO.RACEID": set iCodeSet = 282
					of "PATIENT.EXTENDEDINFO.RELIGIONID": set iCodeSet = 49
					of "PATIENT.EXTENDEDINFO.MARITALSTATUSID": set iCodeSet = 38
					of "PATIENT.EXTENDEDINFO.ADDRESSES.TYPEID": set iCodeSet = 212
					of "PATIENT.EXTENDEDINFO.PHONES.TYPEID": set iCodeSet = 43
					of "PATIENT.EXTENDEDINFO.CUSTOMFIELDS.FIELDID": call CustomFilters("POST_PATIENT_CUSTOM_FIELD")
					of "PATIENT.EXTENDEDINFO.ALTERNATIVENAMES.NAMETYPEID": set iCodeSet = 213
					of "FACILITYID": call ReturnMessage("api","location discovery")
					of "PATIENT.EXTENDEDINFO.NEEDSINTERPRETERID": set iCodeSet = 329
					of "PATIENT.EXTENDEDINFO.ADDRESSES.COUNTY": set iCodeSet = 74
					of "PATIENT.EXTENDEDINFO.ADDRESSES.COUNTRY": set iCodeSet = 15
					of "PATIENT.EXTENDEDINFO.PHONES.FORMATID": set iCodeSet = 281
					of "PATIENT.EDUCATIONLEVELID": set iCodeSet = 284
					of "PATIENT.WRITTENFORMATID": set iCodeSet = 4000760
					of "PATIENT.STUDENTSTATUSID": set iCodeSet = 281
					of "PATIENT.PORTAL.CHALLENGEQUESTIONID": set iCodeSet = 4003353
					else
						call ReturnMessage("field",build2("PATIENT.GENDERID, PATIENT.VIPID, PATIENT.CONFIDENTIALITYID, ",
						"PATIENT.EXTENDEDINFO.ETHNICITYID, PATIENT.EXTENDEDINFO.LANGUAGEID, PATIENT.EXTENDEDINFO.RACEID, ",
						"PATIENT.EXTENDEDINFO.RELIGIONID, PATIENT.EXTENDEDINFO.MARITALSTATUSID, FACILITYID, PATIENTIDTYPE, ",
						"PATIENT.EXTENDEDINFO.ADDRESSES.TYPEID, PATIENT.EXTENDEDINFO.PHONES.TYPEID, ",
						"PATIENT.EXTENDEDINFO.NEEDSINTERPRETERID, ",
						"PATIENT.EXTENDEDINFO.CUSTOMFIELDS.FIELDID, PATIENT.EXTENDEDINFO.ALTERNATIVENAMES.NAMETYPEID, ",
						"PATIENT.EXTENDEDINFO.ADDRESSES.COUNTY, PATIENT.EXTENDEDINFO.ADDRESSES.COUNTRY, ",
						"PATIENT.EXTENDEDINFO.PHONES.FORMATID, PATIENT.EDUCATIONLEVELID, ",
						"PATIENT.WRITTENFORMATID, PATIENT.STUDENTSTATUSID, PATIENT.PORTAL.CHALLENGEQUESTIONID, ",
						"PATIENT.EXTENDEDINFO.BIRTHGENDERID"))
				endcase
			else
				call ReturnMessage("object","")
			endif
		; Post Patient Encounter Endpoint
		of "PATIENTENCOUNTERINSURANCE_POST":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
				    of "ENCOUNTERIDTYPE": set iCodeSet = 319
					of "INSURANCES.ELIGIBILITYSTATUSID":  set iCodeSet = 26307
					of "INSURANCES.INSURANCECARDCOPIEDID":  set iCodeSet = 14167
					of "INSURANCES.VERIFICATIONSTATUSID":  set iCodeSet = 14665
					of "INSURANCES.VERIFICATIONSOURCEID":  set iCodeSet = 4002563
					of "INSURANCES.ASSIGNMENTOFBENEFITSID":  set iCodeSet = 14142
					of "PATIENT.EXTENDEDINFO.ADDRESSES.TYPEID": set iCodeSet = 212
					of "PATIENT.EXTENDEDINFO.PHONES.TYPEID": set iCodeSet = 43
					of "PATIENT.EXTENDEDINFO.PHONES.FORMATID": set iCodeSet = 281
					of "PATIENT.EXTENDEDINFO.CUSTOMFIELDS.FIELDID": call CustomFilters("POST_ENCOUNTERINSURANCE_CUSTOM_FIELD")
					of "INSURANCES.PATIENTRELATIONSHIPTOSUBSCRIBER": set iCodeSet = 40
					of "INSURANCES.SUBSCRIBERRELATIONSHIPTOPATIENTID": set iCodeSet = 40
					else
						call ReturnMessage("field",build2("ENCOUNTERTYPEID,INSURANCES.ELIGIBILITYSTATUSID, ",
						"INSURANCES.INSURANCECARDCOPIEDID,INSURANCES.VERIFICATIONSTATUSID,INSURANCES.VERIFICATIONSOURCEID, ",
						"INSURANCES.ASSIGNMENTOFBENEFITSID,PATIENT.EXTENDEDINFO.ADDRESSES.TYPEID, ",
						"PATIENT.EXTENDEDINFO.PHONES.TYPEID, PATIENT.EXTENDEDINFO.PHONES.FORMATID, ",
						"PATIENT.EXTENDEDINFO.CUSTOMFIELDS.FIELDID,INSURANCES.PATIENTRELATIONSHIPTOSUBSCRIBER, ",
						"INSURANCES.SUBSCRIBERRELATIONSHIPTOPATIENTID"))
				endcase
			else
 				call ReturnMessage("object","")
 			endif
 
		; Patch Patient Encounter Endpoint
		of "PATIENTENCOUNTERINSURANCE_PATCH":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "ELIGIBILITYSTATUSID":  set iCodeSet = 26307
					of "INSURANCECARDCOPIEDID":  set iCodeSet = 14167
					of "VERIFICATIONSTATUSID":  set iCodeSet = 14665
					of "VERIFICATIONSOURCEID":  set iCodeSet = 4002563
					of "ASSIGNMENTOFBENEFITSID":  set iCodeSet = 14142
					of "ADDRESS.TYPEID": set iCodeSet = 212
					of "PHONES.TYPEID": set iCodeSet = 43
					of "PHONES.FORMATID": set iCodeSet = 281
					of "PATIENT.EXTENDEDINFO.CUSTOMFIELDS.FIELDID": call CustomFilters("POST_ENCOUNTERINSURANCE_CUSTOM_FIELD")
					of "PATIENTRELATIONSHIPTOSUBSCRIBER": set iCodeSet = 40
					of "SUBSCRIBERRELATIONSHIPTOPATIENTID": set iCodeSet = 40
					else
						call ReturnMessage("field",build2("ENCOUNTERTYPEID,ELIGIBILITYSTATUSID, ",
						"INSURANCECARDCOPIEDID,VERIFICATIONSTATUSID,VERIFICATIONSOURCEID, ",
						"ASSIGNMENTOFBENEFITSID,ADDRESS.TYPEID,PHONES.TYPEID,PHONES.FORMATID, ",
						"CUSTOMFIELDS.FIELDID,PATIENTRELATIONSHIPTOSUBSCRIBER, ",
						"SUBSCRIBERRELATIONSHIPTOPATIENTID"))
				endcase
			else
 				call ReturnMessage("object","")
 			endif
 
 		; Patch Prior Authorization Endpoint
		of "PRIORAUTHORIZATIONS_PATCH":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "PRIORAUTHORIZATION.STATUSID":  set iCodeSet = 14155
					of "PRIORAUTHORIZATION.AUTHORIZATIONREQUIREDID":  set iCodeSet = 14167
					of "PRIORAUTHORIZATION.TYPEID": set iCodeSet = 14949
					of "PRIORAUTHORIZATION.PHONE.TYPEID": set iCodeSet = 43
					of "PRIORAUTHORIZATION.PHONE.FORMATID": set iCodeSet = 281
					of "PRIORAUTHORIZATION.PROVIDERSTYPE.PROVIDERTYPE": set iCodeSet = 333
					of "PRIORAUTHORIZATION.PROVIDERSTYPE.ADDRESS.TYPEID": set iCodeSet = 212
					else
						call ReturnMessage("field",build2("PRIORAUTHORIZATION.STATUSID, ",
						"PRIORAUTHORIZATION.AUTHORIZATIONREQUIREDID,PRIORAUTHORIZATION.TYPEID, ",
						"PRIORAUTHORIZATION.PHONE.TYPEID,PRIORAUTHORIZATION.PHONE.FORMATID, ",
						"PRIORAUTHORIZATION.PROVIDERSTYPE.PROVIDERTYPE, ",
						"PRIORAUTHORIZATION.PROVIDERSTYPE.ADDRESS.TYPEID"))
				endcase
			else
 				call ReturnMessage("object","")
 			endif
 
 		; Put Prior Authorization Endpoint
		of "PRIORAUTHORIZATIONS_PUT":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "PRIORAUTHORIZATION.STATUSID":  set iCodeSet = 14155
					of "PRIORAUTHORIZATION.AUTHORIZATIONREQUIREDID":  set iCodeSet = 14167
					of "PRIORAUTHORIZATION.TYPEID": set iCodeSet = 14949
					of "PRIORAUTHORIZATION.PHONE.TYPEID": set iCodeSet = 43
					of "PRIORAUTHORIZATION.PHONE.FORMATID": set iCodeSet = 281
					of "PRIORAUTHORIZATION.PROVIDERSTYPE.PROVIDERTYPE": set iCodeSet = 333
					of "PRIORAUTHORIZATION.PROVIDERSTYPE.ADDRESS.TYPEID": set iCodeSet = 212
					else
						call ReturnMessage("field",build2("PRIORAUTHORIZATION.STATUSID, ",
						"PRIORAUTHORIZATION.AUTHORIZATIONREQUIREDID,PRIORAUTHORIZATION.TYPEID, ",
						"PRIORAUTHORIZATION.PHONE.TYPEID,PRIORAUTHORIZATION.PHONE.FORMATID, ",
						"PRIORAUTHORIZATION.PROVIDERSTYPE.PROVIDERTYPE, ",
						"PRIORAUTHORIZATION.PROVIDERSTYPE.ADDRESS.TYPEID"))
				endcase
			else
 				call ReturnMessage("object","")
 			endif
 		;Post Prior Authorization Endpoint
		of "PRIORAUTHORIZATIONS_POST":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "PATIENTIDTYPE":  set iCodeSet = 4
					of "PRIORAUTHORIZATION.STATUSID":  set iCodeSet = 14155
					of "PRIORAUTHORIZATION.AUTHORIZATIONREQUIREDID":  set iCodeSet = 14167
					of "PRIORAUTHORIZATION.TYPEID": set iCodeSet = 14949
					of "PRIORAUTHORIZATION.PHONE.TYPEID": set iCodeSet = 43
					of "PRIORAUTHORIZATION.PHONE.FORMATID": set iCodeSet = 281
					of "PRIORAUTHORIZATION.PROVIDERSTYPE.PROVIDERTYPE": set iCodeSet = 333
					of "PRIORAUTHORIZATION.PROVIDERSTYPE.ADDRESS.TYPEID": set iCodeSet = 212
					else
						call ReturnMessage("field",build2("PATIENTIDTYPE, PRIORAUTHORIZATION.STATUSID, ",
						"PRIORAUTHORIZATION.AUTHORIZATIONREQUIREDID,PRIORAUTHORIZATION.TYPEID, ",
						"PRIORAUTHORIZATION.PHONE.TYPEID,PRIORAUTHORIZATION.PHONE.FORMATID, ",
						"PRIORAUTHORIZATION.PROVIDERSTYPE.PROVIDERTYPE, ",
						"PRIORAUTHORIZATION.PROVIDERSTYPE.ADDRESS.TYPEID"))
				endcase
			else
 				call ReturnMessage("object","")
 			endif
 
 
		; Get Patient Registries Discovery
		of "PATIENTREGISTRIES_DISCOVERY_GET": call ReturnMessage("object","")
 
		; Get Patient Registries
		of "PATIENTREGISTRIES_GET":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "REGISTRYID": call ReturnMessage("api","patient registries discovery")
					else
						call ReturnMessage("field","REGISTRYID")
				endcase
			else
				case(sFieldName)
					of "PATIENT.GENDER": set iCodeSet = 57
					else
						call ReturnMessage("field","PATIENT.GENDER")
				endcase
			endif
 
		; Post/Put Persons
		of value("PERSONS_POST","PERSONS_PUT"):
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "PERSON.PERSONTYPEID": set iCodeSet = 302
					of "PERSON.GENDERID": set iCodeSet = 57
					of "PERSON.VIPID": set iCodeSet = 67
					of "PERSON.CONFIDENTIALITYID": set iCodeSet = 87
					of "PERSON.EXTENDEDINFO.ETHNICITYID": set iCodeSet = 27
					of "PERSON.EXTENDEDINFO.LANGUAGEID": set iCodeSet = 36
					of "PERSON.EXTENDEDINFO.RACEIDS": set iCodeSet = 282
					of "PERSON.EXTENDEDINFO.RELIGIONID": set iCodeSet = 49
					of "PERSON.EXTENDEDINFO.MARITALSTATUSID": set iCodeSet = 38
					of "PERSON.EXTENDEDINFO.ADDRESSES.TYPEID": set iCodeSet = 212
					of "PERSON.EXTENDEDINFO.PHONES.TYPEID": set iCodeSet = 43
					of "PERSON.EXTENDEDINFO.PHONES.FORMATID": set iCodeSet = 281
					else
						call ReturnMessage("field",build2("PERSON.GENDERID, PERSON.VIPID, PERSON.CONFIDENTIALITYID, ",
						"PERSON.EXTENDEDINFO.ETHNICITYID, PERSON.EXTENDEDINFO.LANGUAGEID, PERSON.EXTENDEDINFO.RACEIDS, ",
						"PERSON.EXTENDEDINFO.RELIGIONID, PERSON.EXTENDEDINFO.MARITALSTATUSID, ",
						"PERSON.EXTENDEDINFO.ADDRESSES.TYPEID, PERSON.EXTENDEDINFO.PHONES.TYPEID, ",
						"PERSON.EXTENDEDINFO.PHONES.FORMATID"))
				endcase
			else
				call ReturnMessage("object","")
			endif
 
 
		; Get Pharmacy Intervention Discovery
		of "PHARMACYINTERVENTIONS_DISCOVERY_GET": call ReturnMessage("object","")
 
		; Get Pharmacy interventions
		of "PHARMACYINTERVENTIONS_GET":
			if(sReqOrResp = "REQUEST")
				call ReturnMessage("object","")
			else
				case(sFieldName)
					of "STATUS": set iCodeSet = 8
					of "LINKEDORDERS.ORDERS.MEDICATIONID": call ReturnMessage("api","orders discovery")
					of "LINKEDORDERS.ORDERS.MEDICATIONORDERSTATUS": set iCodeSet = 6004
					of "LINKEDORDERS.ORDERS.MEDICATIONORDERINGPROVIDER": call ReturnMessage("api","providers discovery")
					of "LINKEDORDERS.ORDERS.INGREDIENTS.DOSEUNIT": set iCodeSet = 54
					of "ENCOUNTERTYPE": set iCodeSet = 71
					of "PATIENTCLASS": set iCodeSet = 69
					else
						call ReturnMessage("field",build2("STATUS, LINKEDORDERS.ORDERS.MEDICATIONID,",
						"LINKEDORDERS.ORDERS.MEDICATIONORDERSTATUS, LINKEDORDERS.ORDERS.MEDICATIONORDERINGPROVIDER, ",
						"LINKEDORDERS.ORDERS.INGREDIENTS.DOSEUNIT, ENCOUNTERTYPE, PATIENTCLASS"))
				endcase
			endif
 
		; Post Pharmacy interventions
		of "PHARMACYINTERVENTIONS_POST":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "INTERVENTION.FORMID": call ReturnMessage("api","Cerner pharmacy intervention discovery")
					of "INTERVENTION.TYPES": call ReturnMessage("api","Cerner pharmacy intervention discovery")
					of "INTERVENTION.SUBTYPES": call ReturnMessage("api","Cerner pharmacy intervention discovery")
					of "INTERVENTION.SIGNIFICANCE": call ReturnMessage("api","Cerner pharmacy intervention discovery")
					of "INTERVENTION.TIMESPENT": call ReturnMessage("api","Cerner pharmacy intervention discovery")
					of "INTERVENTION.VALUE": call ReturnMessage("api","Cerner pharmacy intervention discovery")
					of "INTERVENTION.ADDITIONALDETAILS": call ReturnMessage("api","Cerner pharmacy intervention discovery")
					else
						call ReturnMessage("field",build2("INTERVENTION.FORMID, INTERVENTION.TYPES, INTERVENTION.SUBTYPES, ",
						"INTERVENTION.SIGNIFICANCE, INTERVENTION.TIMESPENT, INTERVENTION.VALUE, INTERVENTION.ADDITIONALDETAILS"))
				endcase
			else
				call ReturnMessage("object","")
			endif
 
		; Put Pharmacy interventions
		of "PHARMACYINTERVENTIONS_PUT":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "INTERVENTION.STATUS": set iCodeSet = 8
					of "INTERVENTION.FORMID": call ReturnMessage("api","Cerner pharmacy intervention discovery")
					of "INTERVENTION.TYPES": call ReturnMessage("api","Cerner pharmacy intervention discovery")
					of "INTERVENTION.SUBTYPES": call ReturnMessage("api","Cerner pharmacy intervention discovery")
					of "INTERVENTION.SIGNIFICANCE": call ReturnMessage("api","Cerner pharmacy intervention discovery")
					of "INTERVENTION.TIMESPENT": call ReturnMessage("api","Cerner pharmacy intervention discovery")
					of "INTERVENTION.OUTCOMES": call ReturnMessage("api","Cerner pharmacy intervention discovery")
					of "INTERVENTION.RESPONSE": call ReturnMessage("api","Cerner pharmacy intervention discovery")
					of "INTERVENTION.VALUE": call ReturnMessage("api","Cerner pharmacy intervention discovery")
					of "INTERVENTION.ADDITIONALDETAILS": call ReturnMessage("api","Cerner pharmacy intervention discovery")
					else
						call ReturnMessage("field",build2("INTERVENTION.FORMID, INTERVENTION.TYPES, INTERVENTION.SUBTYPES, ",
						"INTERVENTION.SIGNIFICANCE, INTERVENTION.TIMESPENT, INTERVENTION.VALUE, INTERVENTION.ADDITIONALDETAILS, ",
						"INTERVENTION.STATUS, INTERVENTION.OUTCOMES, INTERVENTION.RESPONSE"))
				endcase
			else
				call ReturnMessage("object","")
			endif
 
		; Get Pop Billing Endpoint
		of "POPULATION_BILLINGACCOUNTS_GET":
			if(sReqOrResp = "REQUEST")
				call ReturnMessage("object","")
			else
				case(sFieldName)
					of "BILLINGSTATUS": set iCodeSet = 18935
					of "PATIENTCLASS": set iCodeSet = 69
					of "ADMITSOURCE": set iCodeSet = 2
					of "ADMITTYPE": set iCodeSet = 3
					of "ADMITUNIT": call ReturnMessage("api","location discovery")
					of "DISCHARGEUNIT": call ReturnMessage("api","location discovery")
					of "DISCHARGEDESTINATION": set iCodeSet = 20
					of "PROCEDURES.CODETYPE": set iCodeSet = 400
					of "PROCEDURES.ANESTHESIATYPE": set iCodeSet = 10050
					of "ADMITDIAGNOSES.CODETYPE": set iCodeSet = 400
					of "FINALDIAGNOSES.CODETYPE": set iCodeSet = 400
					of "FINALDIAGNOSES.PRESENTONADMISSION": set iCodeSet = 4002009
					of "DIAGNOSISRELATEDGROUPS.MAJORDIAGNOSTICCATEGORY": set iCodeSet = 14285
					of "DIAGNOSISRELATEDGROUPS.SEVERITYOFILLNESS": set iCodeSet = 24291
					of "DIAGNOSISRELATEDGROUPS.RISKOFMORTALITY": set iCodeSet = 24291
					of "PATIENT.GENDER": set iCodeSet = 57
					of "ENCOUNTER.ENCOUNTERTYPE": set iCodeSet = 71
					of "ENCOUNTER.PATIENTCLASS": set iCodeSet = 69
					of "ENCOUNTER.HOSPITAL": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.UNIT": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.ROOM": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.BED": call ReturnMessage("api","location discovery")
					else
						call ReturnMessage("field",build2("BILLINGSTATUS, PATIENTCLASS, ADMITSOURCE, ADMITTYPE, ADMITUNIT, DISCHARGEUNIT, ",
						"DISCHARGEDESTINATION, PROCEDURES.CODETYPE, PROCEDURES.ANESTHESIATYPE, ADMITDIAGNOSES.CODETYPE, ",
						"FINALDIAGNOSES.CODETYPE, FINALDIAGNOSES.PRESENTONADMISSION, DIAGNOSISRELATEDGROUPS.MAJORDIAGNOSTICCATEGORY, ",
						"DIAGNOSISRELATEDGROUPS.SEVERITYOFILLNESS, DIAGNOSISRELATEDGROUPS.RISKOFMORTALITY, PATIENT.GENDER, ",
						"ENCOUNTER.ENCOUNTERTYPE, NCOUNTER.PATIENTCLASS, ENCOUNTER.HOSPITAL, ENCOUNTER.UNIT, ENCOUNTER.ROOM, ENCOUNTER.BED"))
				endcase
			endif
 
		; Get Population Documents
		of "POPULATION_DOCUMENTS_GET":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of value("DOCUMENTCATEGORIES","DOCUMENTTYPES"):
						call ReturnMessage("api","documents discovery")
					else
						call ReturnMessage("field","DOCUMENTCATEGORIES, DOCUMENTTYPES")
				endcase
			else
				case(sFieldName)
					of value("DOCUMENTTYPE","DOCUMENTS.DOCUMENTTYPE"):
						call ReturnMessage("api","documents discovery")
					of "DOCUMENTSTATUS": set iCodeSet = 8
					of "DOCUMENTFORMAT": set iCodeSet = 23
					of "DOCUMENTS.DOCUMENTSTATUS": set iCodeSet = 8
					of "DOCUMENTS.STORAGE": set iCodeSet = 25
					of "DOCUMENTS.FORMAT": set iCodeSet = 23
					else
						call ReturnMessage("field","DOCUMENTSTATUS, DOCUMENTFORMAT")
				endcase
			endif
 
		; Get Pop Encounters Endpoint
		of "POPULATION_ENCOUNTERS_GET":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "LOCATIONLIST": call ReturnMessage("api","location discovery")
					else
						call ReturnMessage("field","LOCATIONLIST")
				endcase
			else
				case(sFieldName)
					of "ENCOUNTERSTATUS": set iCodeSet = 261
					of "ENCOUNTERTYPE": set iCodeSet = 71
					of "MEDICALSERVICE": set iCodeSet = 34
					of "PATIENTCLASS": set iCodeSet = 69
					of "DISCHARGEDISPOSITION": set iCodeSet = 19
					of "ADMITSOURCE": set iCodeSet = 2
					of "LOCATION.BED": call ReturnMessage("api","location discovery")
					of "LOCATION.UNIT": call ReturnMessage("api","location discovery")
					of "LOCATION.HOSPITAL": call ReturnMessage("api","location discovery")
					of "LOCATION.ROOM": call ReturnMessage("api","location discovery")
					of "PATIENT.GENDER": set iCodeSet = 57
					of "ISOLATION": set iCodeSet = 70
					else
						call ReturnMessage("field",build2("ENCOUNTERSTATUS, ENCOUNTERTYPE, MEDICALSERVICE, PATIENTCLASS, ADMITSOURCE ",
			"DISCHARGEDISPOSITION, LOCATION.BED, LOCATION.UNIT, LOCATION.HOSPITAL, LOCATION.ROOM, PATIENT.GENDER, ISOLATION"))
				endcase
 
			endif
 
		; Get Pop Lab Results Endpoint
		of "POPULATION_LABRESULTS_GET":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "COMPONENTIDLIST": call ReturnMessage("api","lab discovery")
					of "LOCATIONLIST": call ReturnMessage("api","location discovery")
				endcase
			else
				case(sFieldName)
					of "ENCOUNTER.ENCOUNTERTYPE": set iCodeSet = 71
					of "ENCOUNTER.PATIENTCLASS": set iCodeSet = 69
					of value("COMPONENTID","COMPONENTDESC"): call ReturnMessage("api","lab discovery")
					of "NORMALCY": set iCodeSet = 52
					of "UNITS": set iCodeSet = 54
					of "NOTES.FORMAT": set iCodeSet = 23
					of "LABLOCATIONS.ADDRESS.TYPE": set iCodeSet = 212
					of "STATUS": set iCodeSet = 8
					else
						call ReturnMessage("field",build2("ENCOUNTER.ENCOUNTERTYPE, ENCOUNTER.PATIENTCLASS, COMPONENTID, ",
						"COMPONENTDESC, NORMALCY, UNITS, NOTES.FORMAT, LABLOCATIONS.ADDRESS.TYPE, STATUS"))
				endcase
			endif
 
		; Get Pop Med Admins Endpoint
		of "POPULATION_MEDICATIONADMINS_GET":
			if(sReqOrResp = "REQUEST")
				call ReturnMessage("object","")
			else
				case(sFieldName)
					of "ADMINISTRATIONACTION": set iCodeSet = 99
					of "ADMINISTRATIONSTATUS": set iCodeSet = 4000040
					of "ADMINISTRATIONROUTE": set iCodeSet = 4001
					of "ADMINISTRATIONLOCATION": call ReturnMessage("api","location discovery")
					of "DOSEUNIT": set iCodeSet = 54
					of "DOSEDURATION": set iCodeSet = 54
					of "DOSEDURATIONUNIT": set iCodeSet = 54
					of "ORDER.MEDICATIONORDERSTATUS": set iCodeSet = 6004
					of "ORDER.INGREDIENTS.DOSEUNIT": set iCodeSet = 54
					of "PATIENT.GENDER": set iCodeSet = 57
					of "ENCOUNTER.ENCOUNTERTYPE": set iCodeSet = 71
					of "ENCOUNTER.PATIENTCLASS": set iCodeSet = 69
					of "ENCOUNTER.LOCATION.HOSPITAL": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.BED": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.UNIT": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.ROOM": call ReturnMessage("api","location discovery")
					of "TASKCLASS": set iCodeSet = 6025
					else
						call ReturnMessage("field",build2("ADMINISTRATIONACTION, ADMINISTRATIONSTATUS, ADMINISTRATIONROUTE, ADMINISTRATIONLOCATION, ",
						"DOSEUNIT, DOSEDURATION, DOSEDURATIONUNIT, ORDER.MEDICATIONORDERSTATUS, ORDER.INGREDIENTS.DOSEUNIT, PATIENT.GENDER, ",
						"ENCOUNTER.ENCOUNTERTYPE, ENCOUNTER.PATIENTCLASS, ENCOUNTER.LOCATION.HOSPITAL, ENCOUNTER.LOCATION.BED, ",
						"ENCOUNTER.LOCATION.UNIT, ENCOUNTER.LOCATION.ROOM,TASKCLASS"))
				endcase
			endif
 
		; Get Pop Micro Results Endpoint
		of "POPULATION_MICRORESULTS_GET":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "LOCATIONLIST": call ReturnMessage("api","location discovery")
				endcase
			else
				case(sFieldName)
					of value("MICROTESTID","MICROTESTDESC"): call ReturnMessage("api","lab discovery")
					of "NORMALCY": set iCodeSet = 52
					of "SPECIMENSOURCE": set iCodeSet = 2052
					of "BODYSITE": set iCodeSet = 1028
					of value("MICROBIOLOGIES.ORGANISMNAME","MICROBIOLOGIES.ORGANISMDESC"): set iCodeSet = 1021
					of "MICROBIOLOGIES.SUSCEPTIBILITIES.SUSCEPTIBILITYTEST": set iCodeSet = 65
					of "MICROBIOLOGIES.SUSCEPTIBILITIES.PANELANTIBIOTIC": set iCodeSet = 1010
					of "MICROBIOLOGIES.SUSCEPTIBILITIES.ANTIBIOTIC": set iCodeSet = 39
					of "MICROBIOLOGIES.SUSCEPTIBILITIES.ANTIBIOTICDESC": set iCodeSet = 39
					of "MICROBIOLOGIES.SUSCEPTIBILITIES.DILUTIONVALUE": set iCodeSet = 64
					of "MICROBIOLOGIES.SUSCEPTIBILITIES.SUSCEPTIBILITYVALUE": set iCodeSet = 64
					of "MICROBIOLOGIES.SUSCEPTIBILITIES.SUSCEPTIBILITYSTATUS": set iCodeSet = 1901
					of value("MICROREPORTS.COMPONENTID","MICROREPORTS.COMPONENTDESC"): call ReturnMessage("api","lab discovery")
					of "MICROREPORTS.REPORTSTATUS": set iCodeSet = 8
					of value("MICROREPORTS.ORGANISMNAME","MICROREPORTS.ORGANISMDESC"):  set iCodeSet = 102
					else
						call ReturnMessage("field",build2("MICROTESTID, MICROTESTDESC, NORMALCY, SPECIMENSOURCE, BODYSITE, ",
						"MICROBIOLOGIES.ORGANISMNAME, MICROBIOLOGIES.ORGANISMDESC, ",
						"MICROBIOLOGIES.SUSCEPTIBILITIES.SUSCEPTIBILITYTEST, ",
						"MICROBIOLOGIES.SUSCEPTIBILITIES.PANELANTIBIOTIC, ",
						"MICROBIOLOGIES.SUSCEPTIBILITIES.ANTIBIOTIC, MICROBIOLOGIES.SUSCEPTIBILITIES.ANTIBIOTICDESC, ",
						"MICROBIOLOGIES.SUSCEPTIBILITIES.DILUTIONVALUE, ",
						"MICROBIOLOGIES.SUSCEPTIBILITIES.SUSCEPTIBILITYVALUE, ",
						"MICROBIOLOGIES.SUSCEPTIBILITIES.SUSCEPTIBILITYSTATUS, MICROREPORTS.COMPONENTID, ",
						"MICROREPORTS.COMPONENTDESC, MICROREPORTS.REPORTSTATUS, MICROREPORTS.ORGANISMNAME, ",
						"MICROREPORTS.ORGANISMDESC"))
				endcase
			endif
 
		; Get Pop Observations Endpoint
		of "POPULATION_OBSERVATIONS_GET":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "CATEGORYLIST": set iCodeSet = 93
					of "COMPONENTLIST": call ReturnMessage("api","observation discovery")
					of "LOCATIONLIST": call ReturnMessage("api","location discovery")
					else
						call ReturnMessage("field","CATEGORYLIST, COMPONENTLIST, LOCATIONLIST")
				endcase
			else
				case(sFieldName)
					of "COMPONENTID": call ReturnMessage("api","observation discovery")
					of "OBSERVATIONTYPE": set iCodeSet = 53
					of "OBSERVATIONSTATUS": set iCodeSet = 8
					of "OBSERVATIONUNITS": set iCodeSet = 54
					of "NORMALCY": set iCodeSet = 52
					of "ENCOUNTERTYPE": set iCodeSet = 71
					of "PATIENTCLASS": set iCodeSet = 69
					of "ENCOUNTER.LOCATION.HOSPITAL": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.BED": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.UNIT": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.ROOM": call ReturnMessage("api","location discovery")
					else
						call ReturnMessage("field",build2("COMPONENTID, OBSERVATIONSTATUS, OBSERVATIONUNITS, NORMALCY, ENCOUNTERTYPE, PATIENTCLASS, ",
						" ENCOUNTER.LOCATION.HOSPITAL, ENCOUNTER.LOCATION.UNIT, ENCOUNTER.LOCATION.ROOM, ENCOUNTER.LOCATION.BED"))
				endcase
			endif
 
		; Get Pop Orders Endpoint
		of "POPULATION_ORDERS_GET":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "ORDERTYPES": set iCodeSet = 106
					of "ORDERABLECODES": call ReturnMessage("api","orders discovery")
					else
						call ReturnMessage("field", "ORDERTYPES, ORDERABLECODES")
				endcase
			else
				case(sFieldName)
					of "ORDERABLECODE": call ReturnMessage("api","orders discovery")
					of "ORDERSTATUS": set iCodeSet = 6004
					of "ORDERTYPE": set iCodeSet = 106
					of "DIAGNOSES.CODES.CODESET": set iCodeSet = 400
					of "PATIENT.GENDER": set iCodeSet = 57
					of "ENCOUNTER.ENCOUNTERTYPE": set iCodeSet = 71
					of "ENCOUNTER.PATIENTCLASS": set iCodeSet = 69
					of "ENCOUNTER.LOCATION.HOSPITAL": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.UNIT": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.ROOM": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.BED": call ReturnMessage("api","location discovery")
					else
						call ReturnMessage("field","ORDERABLECODE, ORDERSTATUS , ORDERTYPE")
				endcase
			endif
 
		; get POP Staff Assignments
		of "POPULATION_STAFFASSIGNMENTS_GET":
				if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "LOCATIONLIST":  call ReturnMessage("api","location discovery")
					else
						 call ReturnMessage("field","LOCATIONLIST")
				 endcase
			else
				case(sFieldName)
					of "ASSIGNEDRELATIONSHIP.RELATIONSHIPDESC": call CustomFilters("ASSIGNEDRELATIONSHIP.RELATIONSHIPDESC")
					of "PROVIDERRELATIONSHIP.RELATIONSHIPDESC": set iCodeSet = 333
					of "PATIENT.GENDER": set iCodeSet = 57
  					of "ENCOUNTER.ENCOUNTERTYPE": set iCodeSet = 71
  					of "ENCOUNTER.PATIENTCLASS": set iCodeSet = 69
					of "ENCOUNTER.LOCATION.BED": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.UNIT": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.HOSPITAL": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.ROOM": call ReturnMessage("api","location discovery")
				else
					call ReturnMessage("field",build2("ASSIGNEDRELATIONSHIP.RELATIONSHIPDESC,",
						"PROVIDERRELATIONSHIP.RELATIONSHIPDESC, PATIENT.GENDER, ",
						"ENCOUNTER.PATIENTCLASS, ENCOUNTER.ENCOUNTERTYPE,ENCOUNTER.LOCATION.BED,  ",
						"ENCOUNTER.LOCATION.UNIT, ENCOUNTER.LOCATION.HOSPITAL, ",
						"ENCOUNTER.LOCATION.ROOM"))
				endcase
			endif
 
		; Get Pop Pharmacy Interventions
		of "POPULATION_PHARMACYINTERVENTIONS_GET":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "LOCATIONLIST":  call ReturnMessage("api","location discovery")
					else
						 call ReturnMessage("field","LOCATIONLIST")
				 endcase
			else
				case(sFieldName)
					of "STATUS": set iCodeSet = 79
					of "LINKEDORDERS.ORDERS.MEDICATIONID": call ReturnMessage("api","orders discovery")
					of "LINKEDORDERS.ORDERS.MEDICATIONORDERSTATUS": set iCodeSet = 6004
					of "LINKEDORDERS.ORDERS.MEDICATIONORDERINGPROVIDER": call ReturnMessage("api","providers discovery")
					of "LINKEDORDERS.ORDERS.INGREDIENTS.DOSEUNIT": set iCodeSet = 54
					of "PATIENT.GENDER": set iCodeSet = 57
					of "ENCOUNTER.ENCOUNTERTYPE": set iCodeSet = 71
					of "ENCOUNTER.PATIENTCLASS": set iCodeSet = 69
					of "ENCOUNTER.LOCATION.BED": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.UNIT": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.HOSPITAL": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.ROOM": call ReturnMessage("api","location discovery")
					else
						call ReturnMessage("field",build2("STATUS, LINKEDORDERS.ORDERS.MEDICATIONID,",
						"LINKEDORDERS.ORDERS.MEDICATIONORDERSTATUS, LINKEDORDERS.ORDERS.MEDICATIONORDERINGPROVIDER, ",
						"LINKEDORDERS.ORDERS.INGREDIENTS.DOSEUNIT, PATIENT.GENDER, ENCOUNTER.ENCOUNTERTYPE, ",
						"ENCOUNTER.PATIENTCLASS, ENCOUNTER.LOCATION.BED, ENCOUNTER.LOCATION.UNIT, ENCOUNTER.LOCATION.HOSPITAL, ",
						"ENCOUNTER.LOCATION.ROOM"))
				endcase
			endif
 
		; Get Pop Rad Results Endpoint
		of "POPULATION_RADIOLOGYRESULTS_GET":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "LOCATIONLIST":  call ReturnMessage("api","location discovery")
					else
						 call ReturnMessage("field","LOCATIONLIST")
				 endcase
			else
				case(sFieldName)
					of "RESULTSTATUS": set iCodeSet = 8
					of "EXAMTYPE.EXAMTYPEID": call ReturnMessage("api","orders discovery")
					of "EXAMTYPE.EXAMTYPENAME": call ReturnMessage("api","orders discovery")
					of "REPORTS.STORAGE": set iCodeSet = 25
					of "REPORTS.FORMAT": set iCodeSet = 23
					of "PATIENT.GENDER": set iCodeSet = 57
					of "ENCOUNTER.ENCOUNTERTYPE": set iCodeSet = 71
					of "ENCOUNTER.PATIENTCLASS": set iCodeSet = 69
					of "ENCOUNTER.LOCATION.HOSPITAL": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.UNIT": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.ROOM": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.BED": call ReturnMessage("api","location discovery")
					else
						call ReturnMessage("field", build2("RESULTSTATUS, EXAMTYPE.EXAMTYPEID, EXAMTYPE.EXAMTYPENAME, REPORTS.STORAGE, ",
						"REPORTS.FORMAT, PATIENT.GENDER, ENCOUNTER.ENCOUNTERTYPE, ENCOUNTER.PATIENTCLASS, ENCOUNTER.LOCATION.HOSPITAL, ",
						"ENCOUNTER.LOCATION.UNIT, ENCOUNTER.LOCATION.ROOM, ENCOUNTER.LOCATION.BED"))
				endcase
			endif
 
		; Get Pop Scheduled Med Admins Endpoint
		of "POPULATION_SCHEDULEDMEDICATIONADMINS_GET":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "LOCATIONLIST": call ReturnMessage("api","location discovery")
					else
						call ReturnMessage("field",build2("LOCATIONLIST"))
				endcase
			else
				case(sFieldName)
					of "STATUS": set iCodeSet = 4000040
					of "DOSEUNIT": set iCodeSet = 54
					of "ORDER.MEDICATIONID": call ReturnMessage("api","orders discovery")
					of "ORDER.MEDICATIONORDERSTATUS": set iCodeSet = 6004
					of "ORDER.INGREDIENTS.DOSEUNIT": set iCodeSet = 54
					of "ORDER.INGREDIENTS.STRENGTHDOSEUNIT": set iCodeSet = 54
					of "PATIENT.GENDER": set iCodeSet = 57
					of "ENCOUNTER.ENCOUNTERTYPE": set iCodeSet = 71
					of "ENCOUNTER.PATIENTCLASS": set iCodeSet = 69
					of "ENCOUNTER.LOCATION.HOSPITAL": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.BED": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.UNIT": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.ROOM": call ReturnMessage("api","location discovery")
					of "TASKCLASS": set iCodeSet = 6025
					else
						call ReturnMessage("field",build2("STATUS, DOSEUNIT, ORDER.MEDICATIONID, DOSEDURATIONUNIT, ",
						"ORDER.MEDICATIONORDERSTATUS, ORDER.INGREDIENTS.DOSEUNIT, ORDER.INGREDIENTS.STRENGTHDOSEUNIT, ",
						"PATIENT.GENDER, ENCOUNTER.ENCOUNTERTYPE, ENCOUNTER.PATIENTCLASS, ENCOUNTER.LOCATION.HOSPITAL, ",
						"ENCOUNTER.LOCATION.BED, ENCOUNTER.LOCATION.UNIT, ENCOUNTER.LOCATION.ROOM, TASKCLASS"))
				endcase
			endif
 
		; Get Pop Surgical Cases Endpoint
		of "POPULATION_SURGICALCASES_GET":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "LOCATIONLIST": call ReturnMessage("api","location discovery")
					else
						call ReturnMessage("field","LOCATIONLIST")
				endcase
			else
				case(sFieldName)
					of "ASACLASS": set iCodeSet = 10051
					of "OPERATINGROOMID":  set iCodeSet = 221
					of "SURGICALEVENTS.EVENTTYPE":  set iCodeSet = 14003
					of "SURGICALPROCEDURES.PROCEDURECODEID": call ReturnMessage("api","orders discovery")
					of "SURGICALPROCEDURES.WOUNDCLASS": set iCodeSet =10038
					of "ENCOUNTER.ENCOUNTERTYPE": set iCodeSet = 71
					of "ENCOUNTER.PATIENTCLASS": set iCodeSet = 69
					of "ENCOUNTER.LOCATION.HOSPITAL": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.UNIT": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.ROOM": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.BED": call ReturnMessage("api","location discovery")
					else
						call ReturnMessage("field", build2("ASACLASS, OPERATINGROOMID, SURGICALEVENTS.EVENTTYPE, ",
						"SURGICALPROCEDURES.PROCEDURECODEID, SURGICALPROCEDURES.WOUNDCLASS, ENCOUNTER.ENCOUNTERTYPE, ",
						"ENCOUNTER.PATIENTCLASS, ENCOUNTER.LOCATION.HOSPITAL,ENCOUNTER.LOCATION.UNIT, ENCOUNTER.LOCATION.ROOM, ",
						"ENCOUNTER.LOCATION.BED"))
				endcase
			endif
 
 		; Get Pop Tasks Endpoint
		of "POPULATION_TASKS_GET":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "LOCATIONLIST": call ReturnMessage("api","location discovery")
					of "TASKTYPES":	set iCodeSet = 6026
					else
						call ReturnMessage("field","LOCATIONLIST")
				endcase
			else
				case(sFieldName)
					of "TASKCLASS": set iCodeSet = 6025
					of "TASKTYPE": set iCodeSet = 6026
					of "TASKSTATUS": set iCodeSet = 79
					of "TASKPRIORITY": set iCodeSet = 4010
					of "ENCOUNTER.ENCOUNTERTYPE": set iCodeSet = 71
					of "ENCOUNTER.PATIENTCLASS": set iCodeSet = 69
					of "ENCOUNTER.LOCATION.HOSPITAL": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.UNIT": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.ROOM": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.BED": call ReturnMessage("api","location discovery")
					of "PATIENT.GENDER": set iCodeSet = 57
					else
						call ReturnMessage("field", build2("TASKCLASS, TASKTYPE, TASKSTATUS, TASKPRIORITY, ",
						"ENCOUNTER.ENCOUNTERTYPE, ENCOUNTER.PATIENTCLASS,  ENCOUNTER.LOCATION.HOSPITAL, ",
						"ENCOUNTER.LOCATION.UNIT, ENCOUNTER.LOCATION.ROOM, ENCOUNTER.LOCATION.BED, ",
						"PATIENT.GENDER"))
				endcase
			endif
 
		; Put Authenticate Portal Account - Not built in Cerner
		of "PORTALACCOUNTS_AUTHENTICATE_PUT": call ReturnMessage("object","")
 
		; Get Portal Accounts
		of "PORTALACCOUNTS_GET":
			if(sReqOrResp = "REQUEST")
				call ReturnMessage("object","")
			else
				case(sFieldName)
					of "PORTALACCOUNTS.ADDRESS.STATE": set iCodeSet = 62
					of "PORTALACCOUNTS.ADDRESS.TYPE": set iCodeSet = 212
					of "PORTALACCOUNTS.PHONE.TYPE": set iCodeSet = 43
					of "PORTALACCOUNTS.GENDER": set iCodeSet = 57
					else
						call ReturnMessage("field",build2("PORTALACCOUNTS.ADDRESS.STATE, PORTALACCOUNTS.ADDRESS.TYPE, ",
						"PORTALACCOUNTS.PHONE.TYPE"))
				endcase
			endif
 
		; Post Portal Accounts - Not built in Cerner
		of "PORTALACCOUNTS_POST": call ReturnMessage("object","")
 
		; Put Portal Accounts - Not built in Cerner
		of "PORTALACCOUNTS_PUT": call ReturnMessage("object","")
 
		; Get Problems Endpoint
		of "PROBLEMS_GET":
			if(sReqOrResp = "REQUEST")
				call ReturnMessage("object","")
			else
				case(sFieldName)
					of "STATUS": set iCodeSet = 12030
					of "PRIORITY": set iCodeSet = 12034
					of "CLASS":  set iCodeSet = 12032
					else
						call ReturnMessage("field","STATUS, PRIORITY, CLASS")
				endcase
			endif
 
		; Get Problems Endpoint
		of "PROBLEMS_POST":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "PATIENTIDTYPE": set iCodeSet = 4
					of "PROBLEMCODEID": call ReturnMessage("api","problem discovery api")
					of "CLASS":  set iCodeSet = 12033
					of "PRIORITY": set iCodeSet = 12034
					of "ONSETDATE": set iCodeSet = 25320
 
					else
						call ReturnMessage("field","PATIENTIDTYPE, PROBLEMCODEID, CLASS, PRIORITY, ONSETDATE")
				endcase
			else
				call ReturnMessage("object","")
			endif
 
		; Put Problems Endpoint
		of "PROBLEMS_PUT":
			if(sReqOrResp = "RESPONSE")
				call ReturnMessage("object","")
			else
				case(sFieldName)
					of "STATUSID": set iCodeSet = 12030
					of "CLASSID": set iCodeSet = 12033
					of "PRIORITYID": set iCodeSet = 12034
					else
					 call ReturnMessage("field",build2("STATUSID, CLASSID, PRIORITYID"))
				endcase
			endif
 
		; Delete Problems Endpoint
		of "PROBLEMS_DELETE":
			if(sReqOrResp = "RESPONSE")
				call ReturnMessage("object","")
			else
				case(sFieldName)
					of "STATUSID": set iCodeSet = 12030
					of "REASONID": set iCodeSet = 14004
					else
					 call ReturnMessage("field","STATUSID, REASONID")
				endcase
			endif
 
		; Get Procedures Endpoint
		of "PROCEDURES_GET":
			if(sReqOrResp = "REQUEST")
				call ReturnMessage("object","")
			else
				case(sFieldName)
					of "PROCEDURES.BODYLOCATION": set iCodeSet = 4002375
					of "PROCEDURES.ENCOUNTERTYPE": set iCodeSet = 71
					of "PROCEDURES.PATIENTCLASS": set iCodeSet = 69
					else
						call ReturnMessage("field", "PROCEDURES.BODYLOCATION, PROCEDURES.ENCOUNTERTYPE, PROCEDURES.PATIENTCLASS")
				endcase
			endif
 
		; Get Providers Endpoint
		of "PROVIDERS_GET":
			if(sReqOrResp = "REQUEST")
			    case(sFieldName)
			    	of "GENDERID": set iCodeSet = 57
			    	of "SPECIALTYID": call CustomFilters("SPECIALTYID")
			    	of "LANGUAGEID": set iCodeSet = 36
			    	of "LOCATIONID": call CustomFilters("LOCATIONID")
			     else
					call ReturnMessage("object","")
				endcase
			else
				case(sFieldName)
					of "ADDRESS.STATE":  set iCodeSet = 62
					of "ADDRESSES.TYPE":  set iCodeSet = 212
					of "PHONES.TYPE": set iCodeSet = 43
					else
						call ReturnMessage("field", "ADDRESS.STATE, ADDRESSES.TYPE, PHONES.TYPE")
				endcase
			endif
 
 		; Post ProposedOrders Endpoint
		of "PROPOSEDORDERS_POST":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "PATIENTIDTYPE": set iCodeSet = 4
					of "ENCOUNTERIDTYPE": set iCodeSet = 319
					of "ORDERABLECODEID": call ReturnMessage("api","orders discovery api")
					of "RESPONSIBLEPERSONNELID": call ReturnMessage("api","providers discovery api")
					of "MEDICATIONORDERBASIS": call GetFlagValues("ORDERS", "ORIG_ORD_AS_FLAG" )
					of "ORDERFIELDS": call ReturnMessage("api","order details discovery api")
					else
						call ReturnMessage("field", build2("PATIENTIDTYPE, ENCOUNTERIDTYPE,ORDERABLECODEID, ",
						"RESPONSIBLEPERSONNELID, MEDICATIONORDERBASIS, ORDERFIELDS"))
				endcase
			else
				call ReturnMessage("object","")
			endif
 
 		; Put Patient
 		of "PATIENTS_PUT":
 
 			if(sReqOrResp = "REQUEST")
 				case(sFieldName)
 					of "PATIENT.GENDERID": set iCodeset = 57
 					of "PATIENT.VIPID": set iCodeset = 67
 					of "PATIENT.CONFIDENTIALITYID": set iCodeset = 87
 					of "PATIENT.EXTENDEDINFO.ETHNICITYID": set iCodeset = 27
 					of "PATIENT.EXTENDEDINFO.LANGUAGEID": set iCodeset = 36
 					of "PATIENT.EXTENDEDINFO.RACEID": set iCodeset = 282
 					of "PATIENT.EXTENDEDINFO.RELIGIONID": set iCodeset = 49
 					of "PATIENT.EXTENDEDINFO.MARITALSTATUSID": set iCodeset = 38
 					of "PATIENT.EXTENDEDINFO.NEEDSINTERPRETERID": set iCodeset = 329
 				else
					call ReturnMessage("field", build2("PATIENT.GENDERID, PATIENT.VIPID,PATIENT.CONFIDENTIALITYID, ",
						"PATIENT.EXTENDEDINFO.ETHNICITYID, PATIENT.EXTENDEDINFO.LANGUAGEID, PATIENT.EXTENDEDINFO.RACEID, ",
						"PATIENT.EXTENDEDINFO.RELIGIONID, PATIENT.EXTENDEDINFO.MARITALSTATUSID, PATIENT.EXTENDEDINFO.NEEDSINTERPRETERID"))
				endcase
			else
				call ReturnMessage("object","")
			endif
 
		; Get Referrals Endpoint
		of "REFERRALS_GET":
			if(sReqOrResp = "REQUEST")
				call ReturnMessage("object","")
			else
				case(sFieldName)
					of "STATUS": set iCodeSet = 6004
					of "REFERRALCLASS": set iCodeSet = 106
					of "REFERRALTYPE": call ReturnMessage("api","orders discovery")
					of "NOTES.NOTEFORMAT": set iCodeSet = 23
					else
						call ReturnMessage("field", "STATUS, REFERRALCLASS, REFERRALTYPE, NOTES.NOTEFORMAT")
				endcase
			endif
 
		; Get References Discovery Endpoint
		of "REFERENCES_DISCOVERY_GET": call ReturnMessage("object","")
 
		; Get Diagnoses Endpoint
		of "REFERENCES_DIAGNOSISCODES_GET":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "CODINGSYSTEM": set iCodeSet = 400
					else
						call ReturnMessage("field",build2("CODINGSYSTEM"))
				endcase
			else
				call ReturnMessage("object","")
			endif
 
		; Get References Locations Endpoint
		of "REFERENCES_LOCATIONS_GET": call ReturnMessage("object","")
 
		; Get References Locations Endpoint
		of "REFERENCES_PHARMACIES_GET":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "TYPEIDS": call CustomFilters("PHARMACYTYPES")
					else
						call ReturnMessage("field", "TYPEIDS")
				endcase
			else
				case(sFieldName)
					of "PHARMACYTYPES": call CustomFilters("PHARMACYTYPES")
					of "ADDRESSES.TYPE":  set iCodeSet = 212
					of "PHONES.TYPE": set iCodeSet = 43
					else
						call ReturnMessage("field", "PHARMACYTYPES, ADDRESSES.TYPE, PHONES.TYPE")
				endcase
			endif
 
		; Get References Problems Endpoint
		of "REFERENCES_PROBLEMCODES_GET":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "CODINGSYSTEM": set iCodeSet = 400
					else
						call ReturnMessage("field",build2("CODINGSYSTEM"))
				endcase
			else
				call ReturnMessage("object","")
			endif
 
		; Get Social Histories Endpoint
		of "SOCIALHISTORIES_GET": call ReturnMessage("object","")
 
		; Get Pop Surgical Cases Endpoint
		of "SURGICALCASES_GET":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "LOCATIONLIST": call ReturnMessage("api","location discovery")
					else
						call ReturnMessage("field","LOCATIONLIST")
				endcase
			else
				case(sFieldName)
					of "ANESTHESIATYPE": set iCodeSet = 10050
					of "ASACLASS": set iCodeSet = 10051
					of "CASEBLOCKS.BLOCKDURATION" : set iCodeSet = 340
					of "CASECLASS": set iCodeSet = 1304
					of "CASEDELAYS.DELAYDURATION": set iCodeSet = 340
					of "CASEDELAYS.DELAYREASON": set iCodeSet = 10033
					of "CLEANUPDURATION.DURATIONUNIT": set iCodeSet = 340
					of "COMPLEXITY": set iCodeSet = 10036
					of "ENCOUNTER.ENCOUNTERTYPE": set iCodeSet = 71
					of "ENCOUNTER.PATIENTCLASS": set iCodeSet = 69
					of "ENCOUNTER.LOCATION.HOSPITAL": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.UNIT": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.ROOM": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.BED": call ReturnMessage("api","location discovery")
					of "OPERATINGROOMID":  set iCodeSet = 221
					of "PATIENT.GENDER": set iCodeSet = 57
					of "PREOPAPPOINTMENTS.PROCEDURE": call ReturnMessage("api","orders discovery")
					of "PROGRESSSTATUS": set iCodeSet = 10030
					of "SCHEDULINGSTATUS": set iCodeSet = 14233
					of "SETUPDURATION.DURATIONUNIT": set iCodeSet = 340
					of "SURGICALEVENTS.EVENTTYPE":  set iCodeSet = 14003
					of "SURGICALPROCEDURES.ANESTHESIATYPE": set iCodeSet = 10050
					of "SURGICALPROCEDURES.OPERATIVEREGIONS": set iCodeSet = 14045
					of "SURGICALPROCEDURES.PROCEDUREDURATION": set iCodeSet = 340
					of "SURGICALPROCEDURES.PROCEDURECODEID": call ReturnMessage("api","orders discovery")
					of "SURGICALPROCEDURES.WOUNDCLASS": set iCodeSet = 10038
					of "SURGICALREPORTS.REPORTTYPE": call ReturnMessage("api","document discovery")
					of "SURGICALREPORTS.STORAGE": set iCodeSet = 25
					of "SURGICALREPORTS.FORMAT": set iCodeSet = 23
					of "TOTALDURATION.DURATIONUNIT": set iCodeSet = 340
					else
						call ReturnMessage("field",
						build2("ANESTHESIATYPE, ASACLASS, CASEBLOCKS.BLOCKDURATION, CASECLASS, CASEDELAYS.DELAYDURATION, ",
						"CASEDELAYS.DELAYREASON, CLEANUPDURATION.DURATIONUNIT, COMPLEXITY, ENCOUNTER.ENCOUNTERTYPE, ",
						"ENCOUNTER.PATIENTCLASS,ENCOUNTER.LOCATION.HOSPITAL,ENCOUNTER.LOCATION.UNIT,ENCOUNTER.LOCATION.ROOM, ",
						"ENCOUNTER.LOCATION.BED, OPERATINGROOMID, PATIENT.GENDER, PREOPAPPOINTMENTS.PROCEDURE, PROGRESSSTATUS, ",
						"SCHEDULINGSTATUS,SETUPDURATION.DURATIONUNIT,SURGICALEVENTS.EVENTTYPE, SURGICALPROCEDURES.ANESTHESIATYPE, ",
						"SURGICALPROCEDURES.OPERATIVEREGIONS, SURGICALPROCEDURES.PROCEDUREDURATION, SURGICALPROCEDURES.PROCEDURECODEID, ",
						"SURGICALPROCEDURES.WOUNDCLASS, SURGICALREPORTS.REPORTTYPE, SURGICALREPORTS.STORAGE, ",
						"SURGICALREPORTS.FORMAT, TOTALDURATION.DURATIONUNIT"))
				endcase
			endif
 
		; Get Tasks and TaskId endoints
		of "TASKS_GET":
			if(sReqOrResp = "REQUEST")
				case(sFieldName)
					of "PATIENTIDTYPE": set iCodeSet = 4
					of "ENCOUNTERIDTYPE":	set iCodeSet = 319
					of "TASKTYPES": set iCodeSet = 6026
					else
						call ReturnMessage("field","PATIENTIDTYPE,ENCOUNTERIDTYPE,TASKTYPES")
				endcase
			else
				case(sFieldName)
					of "TASKCLASS": set iCodeSet = 6025
					of "TASKTYPE": set iCodeSet = 6026
					of "TASKSTATUS": set iCodeSet = 79
					of "TASKPRIORITY": set iCodeSet = 4010
					of "ENCOUNTER.ENCOUNTERTYPE": set iCodeSet = 71
					of "ENCOUNTER.PATIENTCLASS": set iCodeSet = 69
					of "ENCOUNTER.LOCATION.HOSPITAL": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.UNIT": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.ROOM": call ReturnMessage("api","location discovery")
					of "ENCOUNTER.LOCATION.BED": call ReturnMessage("api","location discovery")
					of "PATIENT.GENDER": set iCodeSet = 57
					else
						call ReturnMessage("field", build2("TASKCLASS, TASKTYPE, TASKSTATUS, TASKPRIORITY, ",
						"ENCOUNTER.ENCOUNTERTYPE, ENCOUNTER.PATIENTCLASS,  ENCOUNTER.LOCATION.HOSPITAL, ",
						"ENCOUNTER.LOCATION.UNIT, ENCOUNTER.LOCATION.ROOM, ENCOUNTER.LOCATION.BED, ",
						"PATIENT.GENDER"))
				endcase
			endif
 
		; Get Users Endpoint
		of "USERS_GET":
			if(sReqOrResp = "REQUEST")
				call ReturnMessage("object","")
			else
				case(sFieldName)
					of "USERROLE":  set iCodeSet = 88
					of "USERRELATIONSHIPS.RELATIONSHIPTYPE":  call CustomFilters("USERRELATIONSHIPS")
					of "USERIDENTITIES.CODE":  set iCodeSet = 320
					else
						call ReturnMessage("field","USERROLE, USERRELATIONSHIPS.RELATIONSHIPTYPE, USERIDENTITIES.CODE" )
				endcase
			endif
 
		; Get Versions Endpoint
		of "VERSIONS_GET": call ReturnMessage("object","")
 
		else
			call ReturnMessage("object","")
	endcase
 
 	; Get CodeValues
	if(iCodeSet > 0)
		call GetCodeValues(iCodeSet)
	endif
 
	return(iCodeSet)
 
	if(idebugFlag > 0)
		call echo(concat("GetReferenceData Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
end ; End Subroutine
 
end go
set trace notranslatelock go
 
 
