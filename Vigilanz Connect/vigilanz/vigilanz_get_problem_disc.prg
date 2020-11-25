/**************************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

***************************************************************************
      Source file name: snsro_get_problem_disc.prg
      Object name:      vigilanz_get_problem_disc
      Program purpose:  GETS list of problems in based on search parameters
      Tables read:      NOMENCLATURE
      Tables updated:  	NONE
	  Services:			961200	cps_get_detail_prefs
						4174010	Nomen_GetNomenclatureByDescription
      Executing from:  	MPages Discern Web Service
      Special Notes:    NONE
***********************************************************************
                    MODIFICATION CONTROL LOG                      
**********************************************************************
Mod Date     Engineer             Comment                            
-----------------------------------------------------------------------
000 08/25/16  AAB					Initial write
001 10/10/16  AAB 				    Add DEBUG_FLAG
002 07/27/17  JCO					Changed %i to execute; update ErrorHandler2
003 01/26/18  RJC					Complete rewrite
004 03/22/18  RJC					Added version code and copyright block
005 09/09/19  RJC                   Renamed file and object
************************************************************************/
;drop program snsro_get_problem_discovery go
drop program vigilanz_get_problem_disc go
create program vigilanz_get_problem_disc
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username:" = ""        	;Required
		, "SearchString:" = ""		;Optional
		, "SearchCode:" = ""		;Optional
		, "CodingSystem:" = ""		;Optional
		, "Debug Flag:" = 0			;Optional
 
with OUTDEV, USERNAME, SEARCH_STRING, SEARCH_CODE, CODING_SYSTEM, DEBUG_FLAG
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2" ;004
if($OUTDEV = "VERSION")
	go to exit_version
endif

/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
 
; Prefs data temp structure
free record pref_codes
record pref_codes (
	1 app_default = f8
	1 position_default = f8
	1 prsnl_default = f8
	1 prefs[*]
		2 pref_name = vc
		2 terminology_cd = f8
)
 
;961200	cps_get_detail_prefs
free record 961200_req
record 961200_req (
  1 app_qual = i4
  1 app [*]
    2 app_number = i4
    2 group_qual = i4
    2 group [*]
      3 view_name = c12
      3 view_seq = i4
      3 comp_name = c12
      3 comp_seq = i4
  1 position_qual = i4
  1 position [*]
    2 app_number = i4
    2 position_cd = f8
    2 group_qual = i4
    2 group [*]
      3 view_name = c12
      3 view_seq = i4
      3 comp_name = c12
      3 comp_seq = i4
  1 prsnl_qual = i4
  1 prsnl [*]
    2 app_number = i4
    2 prsnl_id = f8
    2 group_qual = i4
    2 group [*]
      3 view_name = c12
      3 view_seq = i4
      3 comp_name = c12
      3 comp_seq = i4
)
 
free record 961200_rep
record 961200_rep (
   1 app_qual = i4
   1 app [* ]
     2 app_number = i4
     2 group_qual = i4
     2 group [* ]
       3 group_id = f8
       3 view_name = c12
       3 view_seq = i4
       3 comp_name = c12
       3 comp_seq = i4
       3 pref_qual = i4
       3 pref [* ]
         4 pref_id = f8
         4 pref_name = c32
         4 pref_value = vc
         4 sequence = i4
         4 merge_id = f8
         4 merge_name = vc
         4 active_ind = i2
   1 position_qual = i4
   1 position [* ]
     2 position_cd = f8
     2 app_number = i4
     2 group_qual = i4
     2 group [* ]
       3 group_id = f8
       3 view_name = c12
       3 view_seq = i4
       3 comp_name = c12
       3 comp_seq = i4
       3 pref_qual = i4
       3 pref [* ]
         4 pref_id = f8
         4 pref_name = c32
         4 pref_value = vc
         4 sequence = i4
         4 merge_id = f8
         4 merge_name = vc
         4 active_ind = i2
   1 prsnl_qual = i4
   1 prsnl [* ]
     2 prsnl_id = f8
     2 app_number = i4
     2 group_qual = i4
     2 group [* ]
       3 group_id = f8
       3 view_name = c12
       3 view_seq = i4
       3 comp_name = c12
       3 comp_seq = i4
       3 pref_qual = i4
       3 pref [* ]
         4 pref_id = f8
         4 pref_name = c32
         4 pref_value = vc
         4 sequence = i4
         4 merge_id = f8
         4 merge_name = vc
         4 active_ind = i2
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
)
 
;4174010 Nomen_GetNomenclatureByDescription & 4174011 Nomen_GetNomenclatureBySourceId
free record search_req
record search_req(
  1 search_type_flag = i2
  1 preferred_type_flag = i2
  1 search_string = vc
  1 effective_dt_tm = dq8
  1 terminology_cds [*]
    2 terminology_cd = f8
  1 terminology_axis_cds [*]
    2 terminology_axis_cd = f8
  1 principle_type_cds [*]
    2 principle_type_cd = f8
  1 max_results = i2
  1 extensions [*]
    2 icd9
      3 age = f8
      3 gender = vc
    2 ignore_icd9_extension_ind = i2
    2 age = i4
    2 gender_flag = i2
    2 billable_flag = i2
  1 effective_flag = i2
  1 active_flag = i2
  1 local_time_zone = i4
)
 
free record search_rep
record search_rep(
  1 nomenclatures [*]
    2 nomenclature_id = f8
    2 source_identifier = vc
    2 description = vc
    2 short_description = vc
    2 mnemonic = vc
    2 terminology_cd = f8
    2 terminology_axis_cd = f8
    2 principle_type_cd = f8
    2 language_cd = f8
    2 primary_vterm_ind = i2
    2 primary_cterm_ind = i2
    2 cki = vc
    2 active_ind = i2
    2 extensions [*]
      3 icd9 [*]
        4 age = vc
        4 gender = vc
        4 billable = vc
      3 apc [*]
        4 minimum_unadjusted_coinsurance = f8
        4 national_unadjusted_coinsurance = f8
        4 payment_rate = f8
        4 status_indicator = vc
      3 drg [*]
        4 amlos = f8
        4 gmlos = f8
        4 drg_category = vc
        4 drg_weight = f8
        4 mdc_code = f8
    2 beg_effective_dt_tm = dq8
    2 end_effective_dt_tm = dq8
    2 concept_identifier = vc
    2 concept_source_cd = f8
  1 status_data
    2 status = c1
    2 SubEventStatus [*]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
)
 
free record problem_discovery_reply_out
record problem_discovery_reply_out(
	1 problems[*]
		2 ProblemCodeId = f8
		2 ProblemCodeDescription = vc
		2 CodingSystem
			3 Id = f8
			3 Name = vc
		2 Identifier = vc
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
; Input
declare sUserName			= vc with protect, noconstant("")
declare sSearchString		= vc with protect, noconstant("")
declare sSearchCode			= vc with protect, noconstant("")
declare dCodingSystem		= f8 with protect, noconstant(0.0)
declare iDebugFlag			= i2 with protect, noconstant(0)
 
;Other
declare dPrsnlId			= f8 with protect, noconstant(0.0)
declare dPositionCd 		= f8 with protect, noconstant(0.0)
declare iMaxResults			= i4 with protect, noconstant(0)
 
 
/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
set sUserName				= trim($USERNAME, 3)
set sSearchString			= trim($SEARCH_STRING,3)
set sSearchCode				= trim($SEARCH_CODE,3)
if($CODING_SYSTEM > " ")
	set dCodingSystem			= cnvtreal($CODING_SYSTEM)
endif
set iDebugFlag				= cnvtint($DEBUG_FLAG)
set dPrsnlId				= GetPrsnlIDfromUserName(sUserName)
set iMaxResults				= 200 ;Max number of problems to return. Could be incorporated to an input param setting later
 
if(idebugFlag > 0)
	call echo(build("sUserName -> ",sUserName))
	call echo(build("sSearchString -> ",sSearchString))
	call echo(build("sSearchCode -> ",sSearchCode))
	call echo(build("dCodingSystem -> ",dCodingSystem))
	call echo(build("dPrsnlId -> ",dPrsnlId))
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetPreferences(null)			= i2 with protect ;961200	cps_get_detail_prefs
declare GetNomenclatureByName(null) 	= null with protect ;4174010	Nomen_GetNomenclatureByDescription
declare GetNomenclatureByCode(null)		= null with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Validate username
set iRet = PopulateAudit(sUserName, 0.0, problem_discovery_reply_out, sVersion)
if(iRet = 0)
  call ErrorHandler2("Validate", "F", "GET PROBLEM DISCOVERY", "Invalid User for Audit.",
  "1001",build2("Invalid user: ",sUserName), problem_discovery_reply_out)
  go to exit_script
endif
 
 ; Validate Input
if(sSearchString = "" and sSearchCode = "")
	call ErrorHandler2("Validate", "F", "GET PROBLEM DISCOVERY", "Missing required URI parameters.",
	 "9999",build2("Missing required URI parameters: Either SearchString or SearchCode is required."), problem_discovery_reply_out)
	 go to exit_script
elseif(sSearchString > " " and sSearchCode > " ")
	call ErrorHandler2("Validate", "F", "GET PROBLEM DISCOVERY", "Invalid URI parameters.",
	 "9999",build2("Invalid URI parameters: Cannot have both SearchString and SearchCode parameters."), problem_discovery_reply_out)
	 go to exit_script
endif
 
; Get preferences - 961200	cps_get_detail_prefs
set iRet = GetPreferences(null)
if(iRet = 0)
  call ErrorHandler2("Execute", "F", "GET PROBLEM DISCOVERY", "Could not retrieve preferences.",
  "9999",build2("Could not retrieve preferences."), problem_discovery_reply_out)
  go to exit_script
endif
 
; Get problems by name - 4174010 Nomen_GetNomenclatureByDescription
if(sSearchString > " ")
	call GetNomenclatureByName(null)
endif
 
; Get problems by code
if(sSearchCode > " ")
	if(dCodingSystem > 0)
		set iRet = GetCodeSet(dCodingSystem)
		if(iRet != 400)
			call ErrorHandler2("Validate", "F", "GET PROBLEM DISCOVERY", "Invalid URI parameters.",
			"9999",build2("Invalid URI parameters: Invalid CodingSystem."), problem_discovery_reply_out)
			go to exit_script
		endif
	endif
 
	call GetNomenclatureByCode(null)
endif
 
; Build final reply
call PostAmble(null)
 
; Set audit to a successful status
call ErrorHandler2("Success", "S", "GET PROBLEM DISCOVERY", "Successfully retrieved problems.",
"0000",build2("Successfully retrieved problems."), problem_discovery_reply_out)
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
  if(idebugFlag > 0)
	  call echorecord(problem_discovery_reply_out)
 
	  set file_path = logical("ccluserdir")
	  set _file = build2(trim(file_path),"/snsro_get_problem_discovery.json")
	  call echo(build2("_file : ", _file))
	  call echojson(problem_discovery_reply_out, _file, 0)
  endif
 
  set JSONout = CNVTRECTOJSON(problem_discovery_reply_out)
 
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
;  Name: GetPreferences(null) = i2 ;961200	cps_get_detail_prefs
;  Description:  Preferences will determing which terminology codes can be used
**************************************************************************/
subroutine GetPreferences(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetPreferences Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 961200
	set iRequest = 961200
 
	;App
	set 961200_req->app_qual = 1
	set stat = alterlist(961200_req->app,1)
	set 961200_req->app[1].app_number = iApplication
	set 961200_req->app[1].group_qual = 1
	set stat = alterlist(961200_req->app[1].group,1)
	set 961200_req->app[1].group[1].view_name = "PROBLEM"
	set 961200_req->app[1].group[1].comp_name = "PROBLEM"
 
	;Position
	select into "nl:"
	from prsnl p
	where p.person_id = dPrsnlId
	detail
		dPositionCd = p.position_cd
	with nocounter
 
	set 961200_req->position_qual = 1
	set stat = alterlist(961200_req->position,1)
	set 961200_req->position[1].app_number = iApplication
	set 961200_req->position[1].position_cd = dPositionCd
	set 961200_req->position[1].group_qual = 1
	set stat = alterlist(961200_req->position[1].group,1)
	set 961200_req->position[1].group[1].view_name = "PROBLEM"
	set 961200_req->position[1].group[1].comp_name = "PROBLEM"
 
	;Prsnl
	set 961200_req->prsnl_qual = 1
	set stat = alterlist(961200_req->prsnl,1)
	set 961200_req->prsnl[1].app_number = iApplication
	set 961200_req->prsnl[1].prsnl_id = dPrsnlId
	set 961200_req->prsnl[1].group_qual = 1
	set stat = alterlist(961200_req->prsnl[1].group,1)
	set 961200_req->prsnl[1].group[1].view_name = "PROBLEM"
	set 961200_req->prsnl[1].group[1].comp_name = "PROBLEM"
 
	;Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",961200_req,"REC",961200_rep)
 
	if(961200_rep->status_data.status = "S")
		set iValidate = 1
 
		; Save PL_Auth_Vocab prefs to a record structure
		;App
		select into "nl:"
		from (dummyt d with seq = size(961200_rep->app[1].group[1].pref,5))
		plan d where 961200_rep->app[1].group[1].pref[d.seq].pref_name like "PL_Auth_Vocab*"
		head report
			x = 0
		detail
			x = x + 1
			stat = alterlist(pref_codes->prefs,x)
			pref_codes->prefs[x].pref_name = trim(961200_rep->app[1].group[1].pref[d.seq].pref_name,3)
			pref_codes->prefs[x].terminology_cd = 961200_rep->app[1].group[1].pref[d.seq].merge_id
 
			if(pref_codes->prefs[x].pref_name = "PL_Auth_Vocab0")
				pref_codes->app_default = pref_codes->prefs[x].terminology_cd
			endif
		with nocounter
 
		;Position
		select into "nl:"
		from (dummyt d with seq = size(961200_rep->position[1].group[1].pref,5))
		plan d where 961200_rep->position[1].group[1].pref[d.seq].pref_name like "PL_Auth_Vocab*"
		head report
			x = size(pref_codes->prefs)
		detail
			x = x + 1
			stat = alterlist(pref_codes->prefs,x)
			pref_codes->prefs[x].pref_name = trim(961200_rep->position[1].group[1].pref[d.seq].pref_name,3)
			pref_codes->prefs[x].terminology_cd = 961200_rep->position[1].group[1].pref[d.seq].merge_id
 
			if(pref_codes->prefs[x].pref_name = "PL_Auth_Vocab0")
				pref_codes->position_default = pref_codes->prefs[x].terminology_cd
			endif
		with nocounter
 
		;Prsnl
		select into "nl:"
		from (dummyt d with seq = size(961200_rep->prsnl[1].group[1].pref,5))
		plan d where 961200_rep->prsnl[1].group[1].pref[d.seq].pref_name like "PL_Auth_Vocab*"
		head report
			x = size(pref_codes->prefs)
		detail
			x = x + 1
			stat = alterlist(pref_codes->prefs,x)
			pref_codes->prefs[x].pref_name = trim(961200_rep->prsnl[1].group[1].pref[d.seq].pref_name,3)
			pref_codes->prefs[x].terminology_cd = 961200_rep->prsnl[1].group[1].pref[d.seq].merge_id
 
			if(pref_codes->prefs[x].pref_name = "PL_Auth_Vocab0")
				pref_codes->prsnl_default = pref_codes->prefs[x].terminology_cd
			endif
		with nocounter
	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetPreferences Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetNomenclatureByName(null)  = null  ;4174010	Nomen_GetNomenclatureByDescription
;  Description:  Search nomenclature by name
**************************************************************************/
subroutine GetNomenclatureByName(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetNomenclatureByName Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iApplication = 600005
	set iTask = 4171505
	set iRequest = 4174010
 
	set search_req->search_type_flag = 1
	set search_req->preferred_type_flag = 1
	set search_req->search_string = sSearchString
	set search_req->max_results = iMaxResults
 	set stat = alterlist(search_req->extensions,1)
 	set search_req->extensions[1].icd9.age = -1
 	set search_req->extensions[1].ignore_icd9_extension_ind = 1
 	set search_req->effective_flag = 0
 	set search_req->active_flag = 0
 	set search_req->local_time_zone = CURTIMEZONEAPP
 
	; Set Terminology Code
	set stat = alterlist(search_req->terminology_cds,1)
 
	/* If coding system not provided, then use default based on prefs.
	 Otherwise verify provided code is an option based on prefs */
	if(dCodingSystem = 0)
		if(pref_codes->prsnl_default > 0)
			set search_req->terminology_cds[1].terminology_cd = pref_codes->prsnl_default
		elseif(pref_codes->position_default > 0)
			set search_req->terminology_cds[1].terminology_cd = pref_codes->position_default
		else
			set search_req->terminology_cds[1].terminology_cd = pref_codes->app_default
		endif
	else
		select into "nl:"
		from (dummyt d with seq = size(pref_codes->prefs,5))
		plan d where pref_codes->prefs[d.seq].terminology_cd = dCodingSystem
		with nocounter
 
		if(curqual)
			set stat = alterlist(search_req->terminology_cds,1)
			set search_req->terminology_cds[1].terminology_cd = dCodingSystem
		else
			call ErrorHandler2("Validate", "F", "GET PROBLEM DISCOVERY", "Insufficient privileges.",
		 	"9999",build2("The coding system provided is not an option based on app and personnel preferences: ",
		 	dCodingSystem), problem_discovery_reply_out)
		 	go to exit_script
		endif
	endif
 
	; Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",search_req,"REC",search_rep)
 
	if(search_rep->status_data.status = "F")
		call ErrorHandler2("Execute", "F", "GET PROBLEM DISCOVERY", "Could not retrieve codes.",
	 	"9999",build2("Could not retrieve codes."), problem_discovery_reply_out)
	 	go to exit_script
	 endif
 
	if(idebugFlag > 0)
		call echo(concat("GetNomenclatureByName Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetNomenclatureByCode(null) = null
;  Description:  Search nomenclature by code
**************************************************************************/
subroutine GetNomenclatureByCode(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetNomenclatureByName Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	; Set Terminology Code
	set stat = alterlist(search_req->terminology_cds,1)
 
	/* If coding system not provided, then use default based on prefs.
	 Otherwise verify provided code is an option based on prefs */
	if(dCodingSystem = 0)
		if(pref_codes->prsnl_default > 0)
			set search_req->terminology_cds[1].terminology_cd = pref_codes->prsnl_default
		elseif(pref_codes->position_default > 0)
			set search_req->terminology_cds[1].terminology_cd = pref_codes->position_default
		else
			set search_req->terminology_cds[1].terminology_cd = pref_codes->app_default
		endif
	else
		select into "nl:"
		from (dummyt d with seq = size(pref_codes->prefs,5))
		plan d where pref_codes->prefs[d.seq].terminology_cd = dCodingSystem
		with nocounter
 
		if(curqual)
			set stat = alterlist(search_req->terminology_cds,1)
			set search_req->terminology_cds[1].terminology_cd = dCodingSystem
		else
			call ErrorHandler2("Validate", "F", "GET PROBLEM DISCOVERY", "Insufficient privileges.",
		 	"9999",build2("The coding system provided is not an option based on app and personnel preferences: ",
		 	dCodingSystem), problem_discovery_reply_out)
		 	go to exit_script
		endif
	endif
 
	set sSearchCode = build("*",sSearchCode,"*")
 
	select into "nl:"
	from nomenclature n
	plan n where n.source_vocabulary_cd = search_req->terminology_cds[1].terminology_cd
		and n.concept_cki = patstring(sSearchCode)
	head report
		x = 0
	detail
		x = x + 1
		stat = alterlist(search_rep->nomenclatures,x)
 
		search_rep->nomenclatures[x].nomenclature_id = n.nomenclature_id
		search_rep->nomenclatures[x].source_identifier = n.source_identifier
		search_rep->nomenclatures[x].description = n.source_string
		search_rep->nomenclatures[x].mnemonic = n.mnemonic
		search_rep->nomenclatures[x].terminology_cd = n.source_vocabulary_cd
		search_rep->nomenclatures[x].principle_type_cd = n.principle_type_cd
		search_rep->nomenclatures[x].language_cd = n.language_cd
		search_rep->nomenclatures[x].primary_vterm_ind = n.primary_vterm_ind
		search_rep->nomenclatures[x].primary_cterm_ind = n.primary_cterm_ind
		search_rep->nomenclatures[x].cki = n.concept_cki
		search_rep->nomenclatures[x].active_ind = n.active_ind
		search_rep->nomenclatures[x].beg_effective_dt_tm = n.beg_effective_dt_tm
		search_rep->nomenclatures[x].end_effective_dt_tm = n.end_effective_dt_tm
		search_rep->nomenclatures[x].concept_identifier = n.concept_identifier
		search_rep->nomenclatures[x].concept_source_cd = n.concept_source_cd
 
	with nocounter, maxrec = 200
 
 
	if(idebugFlag > 0)
		call echo(concat("GetNomenclatureByName Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
/*************************************************************************
;  Name: PostAmble(null) = null
;  Description: Build the final reply structure
**************************************************************************/
subroutine PostAmble(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostAmble Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set listSize = size(search_rep->nomenclatures,5)
 	if(listSize > 0)
	 	set stat = alterlist(problem_discovery_reply_out->problems,listSize)
	 	for(i = 1 to listSize)
	 		set problem_discovery_reply_out->problems[i].ProblemCodeId = search_rep->nomenclatures[i].nomenclature_id
	 		set problem_discovery_reply_out->problems[i].ProblemCodeDescription = search_rep->nomenclatures[i].description
	 		set problem_discovery_reply_out->problems[i].CodingSystem.Id = search_rep->nomenclatures[i].terminology_cd
	 		set problem_discovery_reply_out->problems[i].CodingSystem.Name =
	 		uar_get_code_display(search_rep->nomenclatures[i].terminology_cd)
	 		set problem_discovery_reply_out->problems[i].Identifier = piece(search_rep->nomenclatures[i].cki,"!",2,"")
	 	endfor
 	endif
 
	if(idebugFlag > 0)
		call echo(concat("PostAmble Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine */
 
end go
set trace notranslatelock go
 
