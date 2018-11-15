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
*                                                               *
  ~BE~***********************************************************************/
/*****************************************************************************
          Date Written:       12/22/14
          Source file name:   snsro_add_recent_patients
          Object name:        snsro_add_recent_patients
          Program purpose:    Add recently opened patients to list of recent patients
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
  000 12/22/14  AAB		    Initial write
  001 12/29/14  AAB         Moved the Recent PERSON_ID to first ID in HIST_PID list
  002 04/02/18	RJC			Re-added script back to repository. Minor rewrite to conform to standards
 ***********************************************************************/
drop program snsro_add_recent_patients go
create program snsro_add_recent_patients
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		,"Username" = ""			; Required
		,"PatientId" = ""			; Required
		, "ListType" = ""			; Required
		, "Debug Flag" = 0			; Optional
 
with OUTDEV, USERNAME, PATIENT_ID, LIST_TYPE, DEBUG_FLAG
 
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
; 961206 - cps-ens
free record 961206_req
record 961206_req
(
   1  qual_knt = i4
   1  qual[*]
      2  app_prefs_id   = f8
      2  app_number     = i4
      2  position_cd    = f8
      2  prsnl_id       = f8
      2  pref_qual      = i4
      2  pref[*]
         3  pref_id     = f8
         3  pref_name   = c32
         3  pref_value  = vc
         3  sequence    = i4
         3  merge_id    = f8
         3  merge_name  = vc
         3  active_ind  = i2
)
 
free record 961206_rep
record 961206_rep (
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
 )
 
 ; Final Reply
free record recent_patient_reply_out
record recent_patient_reply_out
(
  1  person_id 					= f8
  1  name_value_prefs_id       	= f8
	1 audit
		2 user_id             	= f8
		2 user_firstname        = vc
		2 user_lastname         = vc
		2 patient_id            = f8
		2 patient_firstname     = vc
		2 patient_lastname      = vc
		2 service_version       = vc
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
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Inputs
declare sUserName 					= vc with protect, noconstant("")
declare dPatientId  				= f8 with protect, noconstant(0.0)
declare iListType					= i2 with protect, noconstant(0)
declare iDebugFlag					= i2 with protect, noconstant(0)
 
;Other
declare dPrsnlId					= f8 with protect, noconstant(0.0)
declare sPatientId					= vc with protect, noconstant("")
declare dPositionCd					= f8 with protect, noconstant(0.0)
declare sNameList					= vc with protect, noconstant("")
declare sIdList						= vc with protect, noconstant("")
 
;Constants
declare iApplication 		= i4 with protect, constant (600005)
declare iTask	 			= i4 with protect, constant (961206)
declare iRequest 			= i4 with protect, constant (961206)
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
;Inputs
set sUserName 						= trim($USERNAME,3)
set dPatientId 						= cnvtreal($PATIENT_ID)
set iListType						= cnvtint($LIST_TYPE)
set iDebugFlag						= cnvtint($DEBUG_FLAG)
 
;Other
set dPrsnlId						= GetPrsnlIDfromUserName(sUserName)
set sPatientId						= concat(trim(cnvtstring(dPatientId),3),".000000")
set reqinfo->updt_id				= dPrsnlId
 
if(iDebugFlag)
	call echo(build("sUserName->", sUserName))
	call echo(build("dPatientId ->", dPatientId))
	call echo(build("dPrsnlId ->", dPrsnlId))
	call echo(build("iListType ->", iListType))
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetPosition(null)					= i2 with protect
declare UpdateRecentPatients(null)			= i2 with protect
declare GetRecentPatients(null)				= i2 with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
;Validate List Type = Recent
if(iListType != 4)
	call ErrorHandler2("VALIDATE", "F", "POST PATIENTLIST", "Invalid ListType",
	"2034","Invalid List Type: This endpoint only supports the RecentPatients list.", recent_patient_reply_out)
	go to exit_script
endif
 
;Validate PatientId exists
if(dPatientId  = 0)
	call ErrorHandler2("VALIDATE", "F", "POST PATIENTLIST", "Invalid PatientId",
	"2003","Missing Required Field: PatientId", recent_patient_reply_out)
	go to exit_script
endif
 
; Validate username
set iRet = PopulateAudit(sUserName, dPatientId, recent_patient_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "POST PATIENTLIST", "Invalid User for Audit.",
	"1001",build("Invalid user: ",sUserName), recent_patient_reply_out)
	go to exit_script
endif
 
; Get Prsnl Id's position
set iRet = GetPosition(null)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "POST PATIENTLIST", "Invalid Username",
	"1001",build("Invalid user: ",sUserName), recent_patient_reply_out)
	go to exit_script
endif
 
; Get recent patients
set iRet = GetRecentPatients(null)
if(iRet = 0)
	call ErrorHandler2("EXECUTE", "F", "POST PATIENTLIST", "Could not retrieve recent patient list.",
	"9999","Could not retrieve recent patient list.", recent_patient_reply_out)
	go to exit_script
endif
 
; Update recent patient list
set iRet = UpdateRecentPatients(null)
if(iRet = 0)
	call ErrorHandler2("EXECUTE", "F", "POST PATIENTLIST", "Could not update recent patient list.",
	"9999","Could not update recent patient list.", recent_patient_reply_out)
	go to exit_script
endif
 
; Set audit to successful
call ErrorHandler2("SUCCESS", "S", "POST PATIENTLIST", "Recent patient list updated successfully.",
"0000","Recent patient list updated successfully.", recent_patient_reply_out)
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
  if(idebugFlag > 0)
	  call echorecord(recent_patient_reply_out)
 
	  set file_path = logical("ccluserdir")
	  set _file = build2(trim(file_path),"/snsro_add_recent_patients.json")
	  call echo(build2("_file : ", _file))
	  call echojson(recent_patient_reply_out, _file, 0)
  endif
 
  set JSONout = CNVTRECTOJSON(recent_patient_reply_out)
 
  if(idebugFlag > 0)
	call echo(JSONout)
  endif
 
   if(validate(_MEMORY_REPLY_STRING))
    set _MEMORY_REPLY_STRING = trim(JSONout,3)
  endif
 
#EXIT_VERSION
 
/*****************************************************************************/
;  Name: GetPosition(null) = i2
;  Description: Get position code
/*****************************************************************************/
subroutine GetPosition(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetPosition Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iValidate = 0
 
 	select into "nl:"
 	from prsnl p
 	where p.person_id = dPrsnlId
 	detail
 		iValidate = 1
 		dPositionCd = p.position_cd
 	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetPosition Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Sub
 
/*****************************************************************************/
;  Name: GetRecentPatients(null) = i2
;  Description: Retrieve recent patients that user had accessed.
/*****************************************************************************/
subroutine GetRecentPatients(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetRecentPatients Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set iValidate = 0
 
	select into "nl:"
	from app_prefs ap
		, name_value_prefs nvp
	plan ap where ap.prsnl_id = dPrsnlId and ap.application_number = iApplication
	join nvp where nvp.parent_entity_id = ap.app_prefs_id and nvp.pvc_name in ("HIST_PID","HIST_PTNM")
	order by ap.app_prefs_id
	head report
		x = 0
		y = 0
	head ap.app_prefs_id
		x = x + 1
		stat = alterlist(961206_req->qual, x)
 
		961206_req->qual_knt = x
		961206_req->qual[x].app_prefs_id = ap.app_prefs_id
		961206_req->qual[x].app_number = iApplication
		961206_req->qual[x].position_cd = dPositionCd
		961206_req->qual[x].prsnl_id = dPrsnlId
	detail
		y = y + 1
		stat = alterlist(961206_req->qual[x]->pref,y)
 
		if(nvp.pvc_name = "HIST_PID")
			sIdList = trim(nvp.pvc_value,3)
		else
			sNameList = trim(nvp.pvc_value,3)
		endif
 
 		961206_req->qual[x].pref_qual = y
		961206_req->qual[x].pref[y].pref_id = nvp.name_value_prefs_id
		961206_req->qual[x].pref[y].pref_name = nvp.pvc_name
		961206_req->qual[x].pref[y].pref_value = nvp.pvc_value
		961206_req->qual[x].pref[y].sequence = 0
		961206_req->qual[x].pref[y].merge_id = 0.0
		961206_req->qual[x].pref[y].active_ind = nvp.active_ind
	foot report
		iValidate = x
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetRecentPatients Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Sub
 
/*************************************************************************
;  Name: UpdateRecentPatients(null)
;  Description: update the most recent patient to pref table
**************************************************************************/
subroutine UpdateRecentPatients(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("UpdateRecentPatients Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set num = 1
	declare str = vc with noconstant("--")
 
	; Build new patient list
	free record temp
	record temp (
		1 qual[6]
			2 id = f8
			2 string_id = vc
			2 name = vc
			2 seq = i2
	)
 
	while(str != "" and num < 10)
		set str = piece(sIdList,";",num,"")
		set num = num + 1
		if(str != "")
			set temp->qual[num].string_id = str
			set temp->qual[num].id = cnvtreal(str)
		endif
	endwhile
 
	; Remove the patient from the current list so it can be entered as the first item.
	for(i = 1 to 6)
		if(temp->qual[i].id = dPatientid or temp->qual[i].id = 0)
			set temp->qual[i].string_id = "0.000000"
			set temp->qual[i].seq = 8
		else
			set temp->qual[i].seq = i + 1
		endif
	endfor
 
	; Enter patient into the list as the first item
	set temp->qual[1].id = dPatientid
	set temp->qual[1].string_id = sPatientId
	set temp->qual[1].seq = 1
 
	; Get names
	select into "nl:"
	from (dummyt d with seq = size(temp->qual,5))
	, person p
	plan d
	join p where p.person_id = temp->qual[d.seq].id
	detail
		temp->qual[d.seq].name = trim(p.name_full_formatted)
	with nocounter
 
	; Build new list variables
	set sNameList = ""
	set sIdList = ""
 
 	select into "nl:"
 		sequence = temp->qual[d.seq].seq
 	from (dummyt d with seq = size(temp->qual,5))
 	plan d
 	order by sequence
 	head report
 		i = 0
 	detail
 		i = i + 1
 		if(i < 6)
			if(i = 1)
				sNameList = build(sNameList,temp->qual[d.seq].name)
				sIdList = build(sIdList,temp->qual[d.seq].string_id)
			else
				sNameList = build(sNameList,";",temp->qual[d.seq].name)
				sIdList = build(sIdList,";",temp->qual[d.seq].string_id)
			endif
		endif
	with nocounter
 
	; Update request with new lists
 	for(i = 1 to 2)
 		if(961206_req->qual[1].pref[i].pref_name = "HIST_PID")
 			set 961206_req->qual[1].pref[i].pref_value = trim(sIdList,3)
 		else
 			set 961206_req->qual[1].pref[i].pref_value = trim(sNameList,3)
 		endif
 	endfor
 
 	; Execute request
	set stat = tdbexecute(iApplication, iTask, iRequest,"REQUEST",961206_req,"REPLY",961206_rep)
 
	if(961206_rep->status_data.status = "S")
		set iValidate = 1
		set recent_patient_reply_out->person_id = dPatientId
	endif
 
	if(idebugFlag > 0)
		call echo(concat("UpdateRecentPatients Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
 
	    call echorecord(temp)
		call echo(sIdList)
		call echo(sNameList)
		call echorecord(961206_req)
	endif
 
	return(iValidate)
end ;End Sub
 
end go
set trace notranslatelock go
 
 
 
 
 
