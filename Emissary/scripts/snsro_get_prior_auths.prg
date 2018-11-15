/*~BB~**************************************************************************
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
  ~BE~***************************************************************************/
/********************************************************************************
      Source file name: snsro_get_prior_auths
      Object name:      snsro_get_prior_auths
      Program purpose:  Get a list of prior authorizations for a particular patient
      Tables read:      AUTHORIZATION, PERSON, ENCOUNTER
      Tables updated:   NONE
      Executing from:   MPages Discern Web Service
      Special Notes:    NONE
********************************************************************************/
 /*******************************************************************************
 *                   MODIFICATION CONTROL LOG
 ********************************************************************************
  Mod 	Date     	Engineer             	Comment
  --- 	-------- 	-------------------- 	-----------------------------------
  001	04/24/18	RJC						Initial Write
 *******************************************************************************/
/*******************************************************************************/
drop program snsro_get_prior_auths go
create program snsro_get_prior_auths
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username" = ""        	;Required
		, "PatientId" = ""			;Required
		,"StatusIds" = ""			;Optional
		, "Debug Flag:" = ""		;Optional
 
with OUTDEV, USERNAME, PATIENT_ID, STATUSES, DEBUG_FLAG
 
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
; Final Reply
free record priorauth_reply_out
record priorauth_reply_out(
	1 prior_authorization[*]
		2 prior_authorization_id = f8
		2 prior_authorization_number = vc
		2 status
			3 id = f8
			3 name = vc
		2 authorized_end_date = dq8
		2 authorized_start_date = dq8
		2 referred_to_provider
			3 npi = vc
			3 provider_id = f8
			3 provider_name = vc
		2 referring_provider
			3 npi = vc
			3 provider_id = f8
			3 provider_name = vc
		2 notes[*]
			3 note_id = f8
			3 created_by
				4 provider_id = f8
				4 provider_name = vc
			3 note_date_time = dq8
			3 note_format = vc
			3 note_text = gvc
			3 note_type
				4 id = f8
				4 name = vc
		2 orderable_types[*]
			3 orderable_codes[*]
				4 orderable_code_id = f8
				4 orderable_code_desc = vc
				4 active = i2
				4 orderable_code_identities[*]
					5 type = vc
					5 value = vc
			3 orderable_type_desc = vc
			3 orderable_type_id = vc
		2 orders[*]
			3 order_id = f8
			3 order_name = vc
			3	order_codes[*]
				4 type = vc
				4 value = vc
	1 patient
		2 patient_id = f8
		2 display_name = vc
		2 last_name = vc
		2 first_name = vc
		2 middle_name = vc
		2 MRN = vc
		2 birth_date_time = dq8
		2 gender
			3 id = f8
			3 name = vc
		2 sDOB = c10
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
declare dPatientId			= f8 with protect, noconstant(0.0)
declare sStatusIds			= vc with protect, noconstant("")
declare dStatusIds[1]		= f8 with protect, noconstant(0.0)
declare iDebugFlag			= i2 with protect, noconstant(0)
 
; Constants
declare c_authorization_auth_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",14949,"AUTH"))
declare c_mrn_alias_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",4,"MRN"))
declare c_npi_prsnl_alias_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",320,"NPI"))
 
/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ValidateStatuses(null)				= null with protect
declare GetPatientInfo(null)				= null with protect
declare GetAuthorizations(null)				= null with protect
declare GetPrsnlNames(null)					= null with protect
declare GetNPI(prsnl_id = f8)				= vc with protect
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
;Inputs
set sUserName					= trim($USERNAME, 3)
set dPatientId					= cnvtreal($PATIENT_ID)
set sStatusIds					= trim($STATUSES,3)
set iDebugFlag					= cnvtreal($DEBUG_FLAG)
 
if(idebugFlag > 0)
	call echo(build("sUserName -> ",sUserName))
	call echo(build("dPatientId -> ",dPatientId))
	call echo(build("sStatusIds -> ",sStatusIds))
endif
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Validate username
set iRet = PopulateAudit(sUserName, 0.0, priorauth_reply_out, sVersion)
if(iRet = 0)
  call ErrorHandler2("VALIDATE", "F", "GET PRIOR_AUTHS", "Invalid User for Audit.",
  "1001",build("Invalid user: ",sUserName), priorauth_reply_out)
  go to exit_script
endif
 
;Validate PatientId exists
if(dPatientId = 0)
	call ErrorHandler2("VALIDATE", "F", "GET PRIOR_AUTHS", "Missing URI parameters: PatientId.",
  	"2003","Missing URI parameters: PatientId.", priorauth_reply_out)
  	go to exit_script
else
	set iRet = GetPatientInfo(null)
	if(iRet = 0)
		call ErrorHandler2("VALIDATE", "F", "GET PRIOR_AUTHS", "Invalid PatientId.",
  		"2003",build("Invalid PatientId: ",trim($PATIENT_ID,3)), priorauth_reply_out)
  		go to exit_script
  	endif
endif
 
; Parse Statuses if they are provided
if(sStatusIds > " ")
	call ValidateStatuses(null)
endif
 
 ; Get Authorization data
 call GetAuthorizations(null)
 
 ; Get Prsnl info
 if(size(priorauth_reply_out->prior_authorization,5) > 0)
 	call GetPrsnlInfo(null)
 endif
 
; Update audit with success
call ErrorHandler2("SUCCESS", "S", "GET PRIOR_AUTHS", "Operation completed successfully.",
"0000","Operation completed successfully.", priorauth_reply_out)
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
  set JSONout = CNVTRECTOJSON(priorauth_reply_out)
 
  if(idebugFlag > 0)
	  call echorecord(priorauth_reply_out)
	  set file_path = logical("ccluserdir")
	  set _file = build2(trim(file_path),"/snsro_get_prior_auths.json")
	  call echo(build2("_file : ", _file))
	  call echojson(priorauth_reply_out, _file, 0)
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
;  Name: GetPatientInfo(null) = null
;  Description:  Get patient information
**************************************************************************/
subroutine GetPatientInfo(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetPatientInfo Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
 
	select into "nl:"
	from person p
	, person_alias pa
 
	plan p where  p.person_id = dPatientId and p.active_ind = 1
	join pa where pa.person_id = p.person_id
		and pa.person_alias_type_cd = c_mrn_alias_type_cd
		and pa.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and pa.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
		and pa.active_ind = 1
	detail
		iValidate = 1
		priorauth_reply_out->patient.patient_id = p.person_id
		priorauth_reply_out->patient.first_name = p.name_first
		priorauth_reply_out->patient.middle_name = p.name_middle
		priorauth_reply_out->patient.last_name = p.name_last
		priorauth_reply_out->patient.display_name = p.name_full_formatted
		priorauth_reply_out->patient.birth_date_time = p.birth_dt_tm
		priorauth_reply_out->patient.sDOB =
		datetimezoneformat(p.birth_dt_tm,p.birth_tz,"YYYY-MM-DD",curtimezonedef)
		priorauth_reply_out->patient.gender.id = p.sex_cd
		priorauth_reply_out->patient.gender.name = uar_get_code_display(p.sex_cd)
		priorauth_reply_out->patient.MRN = pa.alias
	with nocounter
 
	if(idebugFlag > 0)
		call echo(concat("GetPatientInfo Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: ValidateStatuses(null)	= null
;  Description:  Parse status list and validate code is valid
**************************************************************************/
subroutine ValidateStatuses(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateStatuses Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare str = vc
	set str = "-"
	set num = 1
 
	; Parse comma delimited string
	while(str != "")
		set str = trim(piece(sStatusIds,",",num,""),3)
		if(str != "")
			set stat = memrealloc(dStatusIds,num,"f8")
			set dStatusIds[num] = cnvtreal(str)
 
			; Validate code is from the correct codeset
			set iRet = GetCodeSet(dStatusIds[num])
			if(iRet != 14155)
				call ErrorHandler2("VALIDATE", "F", "GET PRIOR_AUTHS", "Invalid status.",
				"2006",build("Invalid status: ",trim(str)), priorauth_reply_out)
				go to exit_script
			endif
 
			set num = num + 1
		endif
 	endwhile
 
	if(idebugFlag > 0)
		call echo(concat("ValidateStatuses Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
 /*************************************************************************
;  Name: GetAuthorizations(null)  = null
;  Description: Get list of authorizations based on patient id and status
**************************************************************************/
subroutine GetAuthorizations(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetAuthorizations Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare idx = i4
 
	select
		if(sStatusIds > " ")
			from authorization a
			,(left join long_text lt on a.comment_id = lt.long_text_id)
			where a.person_id = dPatientId and expand(num,1,size(dStatusIds,5),a.cert_status_cd,dStatusIds[idx])
			order by a.authorization_id
		else
			from authorization a
			,(left join long_text lt on a.comment_id = lt.long_text_id)
			where a.person_id = dPatientId
			order by a.authorization_id
		endif
	into "nl:"
	head report
		x = 0
	head a.authorization_id
		y = 0
		x = x + 1
		stat = alterlist(priorauth_reply_out->prior_authorization,x)
 
		priorauth_reply_out->prior_authorization[x].prior_authorization_id = a.authorization_id
		priorauth_reply_out->prior_authorization[x].prior_authorization_number = trim(a.auth_nbr)
		priorauth_reply_out->prior_authorization[x].status.id = a.cert_status_cd
		priorauth_reply_out->prior_authorization[x].status.name = uar_get_code_display(a.cert_status_cd)
		priorauth_reply_out->prior_authorization[x].authorized_start_date = a.service_beg_dt_tm
		priorauth_reply_out->prior_authorization[x].authorized_end_date = a.end_effective_dt_tm
		priorauth_reply_out->prior_authorization[x].referred_to_provider.provider_id = a.provider_prsnl_id
	detail
		y = y + 1
		stat = alterlist(priorauth_reply_out->prior_authorization[x].notes,y)
 
		priorauth_reply_out->prior_authorization[x].notes[y].note_id = a.comment_id
		priorauth_reply_out->prior_authorization[x].notes[y].created_by.provider_id = lt.updt_id
		priorauth_reply_out->prior_authorization[x].notes[y].note_date_time = lt.updt_dt_tm
		priorauth_reply_out->prior_authorization[x].notes[y].note_format = "Text"
		priorauth_reply_out->prior_authorization[x].notes[y].note_text = lt.long_text
	with nocounter
 
	if(idebugFlag > 0)
		call echo(concat("GetAuthorizations Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetPrsnlInfo(null) = null
;  Description: Get personnel names based on ids
**************************************************************************/
subroutine GetPrsnlInfo(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetPrsnlInfo Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	for(i = 1 to size(priorauth_reply_out->prior_authorization,5))
 		set priorauth_reply_out->prior_authorization[i].referred_to_provider.provider_name =
 		GetNameFromPrsnID(priorauth_reply_out->prior_authorization[i].referred_to_provider.provider_id)
 
 		set priorauth_reply_out->prior_authorization[i].referred_to_provider.npi =
 		GetNPI(priorauth_reply_out->prior_authorization[i].referred_to_provider.provider_id)
 
 		if(size(priorauth_reply_out->prior_authorization[i].notes,5) > 0)
 			for(j = 1 to size(priorauth_reply_out->prior_authorization[i].notes,5))
 				set priorauth_reply_out->prior_authorization[i].notes.created_by.provider_name =
 				GetNameFromPrsnID(priorauth_reply_out->prior_authorization[i].notes.created_by.provider_id)
 			endfor
 		endif
 	endfor
 
	if(idebugFlag > 0)
		call echo(concat("GetPrsnlInfo Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetNPI(prsnl_id = f8)	= vc
;  Description: Get NPI for personnel
**************************************************************************/
subroutine GetNPI(prsnl_id)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetNPI Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare npi = vc
 
	select into "nl:"
	from prsnl_alias pa
	where pa.person_id = prsnl_id
		and pa.prsnl_alias_type_cd = c_npi_prsnl_alias_type_cd
		and pa.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and pa.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
		and pa.active_ind = 1
	detail
		npi = pa.alias
	with nocounter
 
	if(idebugFlag > 0)
		call echo(concat("GetNPI Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(npi)
 
end ;End Subroutine

end go
set trace notranslatelock go
 
 
