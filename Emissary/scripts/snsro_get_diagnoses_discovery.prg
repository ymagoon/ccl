/*~BB~*************************************************************************************
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
  ~BE~**************************************************************************************
      Source file name: snsro_get_diagnoses_discovery.prg
      Object name:      snsro_get_diagnoses_discovery
      Program purpose:  GETS list of diagnosis codes based on search parameters
      Executing from:  	MPages Discern Web Service
 *********************************************************************************************
                   MODIFICATION CONTROL LOG
 *********************************************************************************************
 Mod Date     	Engineer   	Comment
 ---------------------------------------------------------------------------------------------
 000 09/27/18	RJC				Initial Write
 *********************************************************************************************/
drop program snsro_get_diagnoses_discovery go
create program snsro_get_diagnoses_discovery
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username:" = ""        	;Required
		, "SearchString:" = ""		;Required
		, "SearchCode:" = ""		;Optional
		, "CodingSystem:" = ""		;Required
		, "Debug Flag:" = 0			;Optional
 
with OUTDEV, USERNAME, SEARCH_STRING, SEARCH_CODE, CODING_SYSTEM, DEBUG_FLAG
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
;655200 - sch_nomen_get_pickitems
free record 655200_req
record 655200_req (
  1 vocabularies [*]
    2 source_vocabulary_cd = f8
  1 principleTypes [*]
    2 principle_type_cd = f8
  1 vocabularyCnt = i4
  1 principleTypeCnt = i4
  1 all_ind = i2
  1 max_items = i4
  1 nameString = c200
  1 codeString = c200
  1 compare_dt_tm = dq8
  1 vocab_axis_cnt = i4
  1 vocab_axis [*]
    2 vocab_axis_cd = f8
  1 primary_vterm_ind = i2
  1 compare_any_beg_eff_ind = i2
  1 compare_any_end_eff_ind = i2
)
 
free record 655200_rep
record 655200_rep (
	1 item_cnt = i2
   	1 items [* ]
     2 active_ind = i2
     2 data_status_cd = f8
     2 source_string = vc
     2 string_identifier = vc
     2 source_identifier = vc
     2 concept_identifier = vc
     2 concept_source_cd = f8
     2 source_vocabulary_cd = f8
     2 source_vocabulary_disp = c40
     2 string_source_cd = f8
     2 string_source_disp = c40
     2 principle_type_cd = f8
     2 principle_type_disp = c40
     2 nomenclature_id = f8
     2 vocab_axis_cd = f8
     2 vocab_axis_disp = c40
     2 contributor_system_cd = f8
     2 contributor_system_disp = c40
     2 primary_vterm_ind = i2
     2 short_string = vc
     2 mnemonic = vc
   1 errormsg = vc
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
)
 
;Final reply
free record diagnoses_discovery_reply_out
record diagnoses_discovery_reply_out(
	1 diagnoses[*]
		2 diagnosis_code_id 			= f8
		2 diagnosis_code_description 	= vc
		2 coding_system
			3 id 						= f8
			3 name 						= vc
		2 identifier 					= vc
	1 audit
		2 user_id             			= f8
		2 user_firstname          		= vc
		2 user_lastname           		= vc
		2 patient_id            		= f8
		2 patient_firstname         	= vc
		2 patient_lastname         		= vc
		2 service_version         		= vc
	1 status_data
		2 status 						= c1
		2 subeventstatus[1]
			3 OperationName 			= c25
			3 OperationStatus 			= c1
			3 TargetObjectName 			= c25
			3 TargetObjectValue 		= vc
			3 Code 						= c4
			3 Description 				= vc
)
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
; Input
declare sUserName						= vc with protect, noconstant("")
declare sSearchString					= vc with protect, noconstant("")
declare sSearchCode						= vc with protect, noconstant("")
declare dCodingSystem					= f8 with protect, noconstant(0.0)
declare iDebugFlag						= i2 with protect, noconstant(0)
 
;Other
declare iMaxResults						= i4 with protect, noconstant(0)
 
;Constants
declare c_error_handler					= vc with protect, constant("GET DIAGNOSES DISCOVERY")
declare c_diagnoses_principle_type_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",401,"DIAG"))
 
/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
;Input
set sUserName				= trim($USERNAME, 3)
set sSearchString			= trim($SEARCH_STRING,3)
set sSearchCode				= trim($SEARCH_CODE,3)
set dCodingSystem			= cnvtreal($CODING_SYSTEM)
set iDebugFlag				= cnvtint($DEBUG_FLAG)
 
;Other
set iMaxResults				= 200	;Max number of diagnoses to return. Could be incorporated to an input param setting later
 
if(iDebugFlag > 0)
	call echo(build("sUserName -> ",sUserName))
	call echo(build("sSearchString -> ",sSearchString))
	call echo(build("sSearchCode -> ",sSearchCode))
	call echo(build("dCodingSystem -> ",dCodingSystem))
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetDiagnosisCodes(null) = null with protect ;655200 - sch_nomen_get_pickitems
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Validate username
set iRet = PopulateAudit(sUserName, 0.0, diagnoses_discovery_reply_out, sVersion)
if(iRet = 0)
  call ErrorHandler2(c_error_handler, "F", "Validate",build2("Invalid user: ",sUserName),
  "1001",build2("Invalid user: ",sUserName), diagnoses_discovery_reply_out)
  go to exit_script
endif
 
; Validate Search Input
if(sSearchString = "" and sSearchCode = "")
	call ErrorHandler2(c_error_handler, "F", "Validate",
	build2("Missing required URI parameters: Either SearchString or SearchCode is required."),
	"9999",build2("Missing required URI parameters: Either SearchString or SearchCode is required."), diagnoses_discovery_reply_out)
	go to exit_script
elseif(sSearchString > " " and sSearchCode > " ")
	call ErrorHandler2(c_error_handler, "F", "Validate",
	build2("Invalid URI parameters: Cannot have both SearchString and SearchCode parameters."),
	"9999",build2("Invalid URI parameters: Cannot have both SearchString and SearchCode parameters."), diagnoses_discovery_reply_out)
	go to exit_script
endif
 
; Validate CodingSystem
if(dCodingSystem > 0)
	set iRet = GetCodeSet(dCodingSystem)
	if(iRet != 400)
		call ErrorHandler2(c_error_handler, "F", "Validate", "Invalid coding system.",
		"9999","Invalid coding system.", diagnoses_discovery_reply_out)
		go to exit_script
	endif
endif
 
; Get Diagnosis codes
call GetDiagnosisCodes(null)
 
; Set audit to a successful status
call ErrorHandler2(c_error_handler, "S", "Success", "Get Diagnoses Discovery completed successfully.",
"0000",build2("Get Diagnoses Discovery completed successfully."), diagnoses_discovery_reply_out)
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(diagnoses_discovery_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_diagnoses_discovery.json")
	call echo(build2("_file : ", _file))
	call echojson(diagnoses_discovery_reply_out, _file, 0)
	call echorecord(diagnoses_discovery_reply_out)
	call echo(JSONout)
endif
 
#EXIT_VERSION
/*************************************************************************
; SUBROUTINES
**************************************************************************/
 
/*************************************************************************
;  Name: GetDiagnosisCodes(null) = null		655200 - sch_nomen_get_pickitems
;  Description:  Search diagnosis codes
**************************************************************************/
subroutine GetDiagnosisCodes(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetDiagnosisCodes Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iApplication = 650001
	set iTask = 963000
	set iRequest = 655200
 
	;Setup request
	if(dCodingSystem > 0)
		set 655200_req->vocabularyCnt = 1
		set stat = alterlist(655200_req->vocabularies,1)
		set 655200_req->vocabularies[1].source_vocabulary_cd = dCodingSystem
	endif
	
	set 655200_req->principleTypeCnt = 1
	set stat = alterlist(655200_req->principleTypes,1)
	set 655200_req->principleTypes[1].principle_type_cd = c_diagnoses_principle_type_cd
	 
	set 655200_req->max_items = iMaxResults
	if(sSearchString > " ")
		set 655200_req->nameString = sSearchString
	else
		set 655200_req->codeString = sSearchCode
	endif
	set 655200_req->compare_dt_tm = cnvtdatetime(curdate,curtime3)
 
	;Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",655200_req,"REC",655200_rep)
 
	if(655200_rep->status_data.status = "F")
		call ErrorHandler2(c_error_handler, "F", "Execute", "Could not retrieve diagnoses codes (655200).",
		"9999","Could not retrieve diagnoses codes (655200).", diagnoses_discovery_reply_out)
		go to exit_script
	else
		; Build final reply
		set stat = alterlist(diagnoses_discovery_reply_out->diagnoses,655200_rep->item_cnt)
		for(i = 1 to 655200_rep->item_cnt)
			set diagnoses_discovery_reply_out->diagnoses[i].diagnosis_code_id = 655200_rep->items[i].nomenclature_id
			set diagnoses_discovery_reply_out->diagnoses[i].diagnosis_code_description = 655200_rep->items[i].source_string
			set diagnoses_discovery_reply_out->diagnoses[i].identifier = 655200_rep->items[i].source_identifier
			set diagnoses_discovery_reply_out->diagnoses[i].coding_system.id = 655200_rep->items[i].source_vocabulary_cd
			set diagnoses_discovery_reply_out->diagnoses[i].coding_system.name =
				uar_get_code_display(655200_rep->items[i].source_vocabulary_cd)
		endfor
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetDiagnosisCodes Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
 
 
end go
set trace notranslatelock go
 
 
