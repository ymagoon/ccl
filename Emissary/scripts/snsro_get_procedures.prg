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
*
  ~BE~***********************************************************************/
/*****************************************************************************
          Date Written:       01/08/15
          Source file name:   snsro_get_procedures
          Object name:        snsro_get_procedures
          Program purpose:    Reads a list of procedures, the comments
          					  for each procedure, and the personnel
          					  relationships to each procedure
          					  by the given Person ID
          Executing from:     EMISSARY SERVICES
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
  000 02/05/15 JCO		    		Initial
  001 02/18/15 AAB					Changed Person_ID to number in input param
  002 09/14/15 AAB					Add audit object
  003 12/14/15 AAB 					Return patient class
  004 02/22/16 AAB 					Add encntr_type_cd and encntr_type_disp
  005 04/29/16 AAB 					Added version
  006 06/13/16 JCO					Added UPDATE_DT_TM for Cerner 2015 rev
  007 10/10/16 AAB 					Add DEBUG_FLAG
  008 06/12/17 JCO					Added CPT
  009 06/14/17 JCO					Added PATIENT_ID
  010 06/22/17 DJP					Fixed Encounter list parameter to handle empty string
  011 07/27/17 JCO					Changed %i to execute; updated status block
  012 11/27/17 RJC					Fixed typo with uar_get_code_display
  013 03/22/18 RJC					Added version code and copyright block
  014 08/07/18 RJC					Removed contrib systems from request. It filtered out results from 3M
  									Added code for the encounter list feature
 ***********************************************************************/
drop program snsro_get_procedures go
create program snsro_get_procedures
 
/************************************************************************
; REQUEST
************************************************************************/
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Person ID:" = 0.0
		, "Encounter List:" = "0"
 		, "User Name:" = ""        		;002
		, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, PERSON_ID, ENCNTR_LIST, USERNAME, DEBUG_FLAG   ;007
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.16.6.1" ;013
if($OUTDEV = "VERSION")
	go to exit_version
endif

/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record 115468_req
record 115468_req
(
  1 procedure_type = i4
  1 include_inactive_procs_ind = i2
  1 encounters [*]
    2 encounter_id = f8
  1 contributor_systems [*]
    2 contributor_system_cd = f8
)
 
free record procedures_reply_out
record procedures_reply_out
(
  1 procedures [*]
    2 providers [*]
      3 proc_prsnl_reltn_id = f8
      3 provider_id = f8
      3 provider_name = vc
      3 procedure_reltn_cd = f8
      3 procedure_reltn_disp = vc
    2 comments [*]
      3 comment_id = f8
      3 prsnl_id = f8
      3 comment_dt_tm = dq8
      3 comment = vc
      3 prsnl_name = vc
    2 modifier_groups [*]
      3 sequence = i4
      3 modifiers [*]
        4 proc_modifier_id = f8
        4 sequence = i4
        4 nomenclature_id = f8
        4 source_string = vc
        4 concept_cki = vc
        4 source_vocabulary_cd = f8
        4 source_identifier = vc
    2 diagnosis_groups [*]
      3 nomen_entity_reltn_id = f8
      3 diagnosis_group_id = f8
    2 procedure_id = f8
    2 version = i4
    2 encounter_id = f8
	2 encntr_type_cd					= f8	;003
	2 encntr_type_disp					= vc	;003
	2 encntr_type_class_cd				= f8	;004
	2 encntr_type_class_disp			= vc	;004
    2 nomenclature_id = f8
    2 source_string = vc
    2 concept_cki = vc
    2 source_vocabulary_cd = f8
    2 source_identifier = vc
    2 performed_dt_tm = dq8
    2 performed_dt_tm_prec = i4
    2 minutes = i4
    2 priority = i4
    2 anesthesia_cd = f8
    2 anesthesia_minutes = i4
    2 tissue_type_cd = f8
    2 location_id = f8
    2 free_text_location = vc
    2 free_text = vc
    2 note = vc
    2 ranking_cd = f8
    2 clinical_service_cd = f8
    2 active_ind = i2
    2 end_effective_dt_tm = dq8
    2 contributor_system_cd = f8
    2 procedure_type = i4
    2 suppress_narrative_ind = i2
    2 last_action_dt_tm = dq8
    2 free_text_timeframe = vc
    2 performed_dt_tm_prec_cd = f8
    2 laterality_cd = f8
    2 laterality_disp = vc
    2 update_dt_tm	= dq8							;006
	2 icd9code = vc
    2 icd10code = vc
    2 snomed = vc
    2 cpt = vc										;008
    2 patient_id = f8
 1 audit											;002
		2 user_id							= f8
		2 user_firstname					= vc
		2 user_lastname						= vc
		2 patient_id						= f8
		2 patient_firstname					= vc
		2 patient_lastname					= vc
	    2 service_version					= vc	;005
  1 status_data										;011
    2 status = c1
    2 subeventstatus[1]
      3 operationname = c25
      3 operationstatus = c1
      3 targetobjectname = c25
      3 targetobjectvalue = vc
      3 code = c4
      3 description = vc
)

set procedures_reply_out->status_data->status = "F"
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Input 
declare sUserName  						= vc with protect, noconstant("") ;002
declare dPersonID  						= f8 with protect, noconstant(0.0)
declare sEncntrList						= vc with protect, noconstant("")
declare iDebugFlag						= i2 with protect, noconstant(0) ;007

;Constants
declare c_icd9_source_vocabulary_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",400,"ICD9"))
declare c_icd10_source_vocabulary_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",400,"ICD10"))
declare c_snmct_source_vocabulary_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",400,"SNMCT"))
declare c_cpt_source_vocabulary_cd		= f8 with protect, constant(uar_get_code_by("MEANING",400,"CPT4"))	;008

;Other
declare sCKI							= vc with protect, noconstant("")

/*************************************************************************
;INITIALIZE
**************************************************************************/
; Input
set dPersonID 					= cnvtreal($PERSON_ID)
set sEncntrList 				= trim($ENCNTR_LIST,3)
set sUserName					= trim($USERNAME, 3)   ;002
set iDebugFlag					= cnvtint($DEBUG_FLAG)  ;007

if(iDebugFlag > 0)
	call echo(build("sUserName ->", sUserName))
	call echo(build("dPersonID ->", dPersonID))
	call echo(build("sEncntrList ->", sEncntrList))
endif
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetEncounters(null)					= null with protect
declare GetProcedures(null)					= null with protect
declare PostAmble(null)						= null with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Validate person id exists
if(dPersonID = 0)
	call ErrorHandler2("VALIDATE", "F", "GET PROCEDURES", "Missing required field: PatientId.",
	"2055", "Missing required field: PatientId.", procedures_reply_out )
	go to EXIT_SCRIPT
endif

; Validate username & populate audit
set iRet = PopulateAudit(sUserName, dPersonID, procedures_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "GET PROCEDURES", "Invalid User for Audit.",
	"1001", build("UserId is invalid: ", sUserName), procedures_reply_out)
	go to EXIT_SCRIPT
endif

; Setup encounter list
call GetEncounters(null)
	
; Get Procedures
call GetProcedures(null)

; Post Amble
call PostAmble(null)

; Set audit to success
call ErrorHandler("EXECUTE", "S", "GET PROCEDURES", "Success retrieving procedures.", procedures_reply_out)
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(procedures_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif

if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_procedures.json")
	call echo(build2("_file : ", _file))
	call echojson(procedures_reply_out, _file, 0)
	call echorecord(procedures_reply_out)
	call echo(JSONout)
endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: GetEncounters(null)
;  Description: This builds the encounter list
**************************************************************************/
subroutine GetEncounters(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetEncounters Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	if(sEncntrList > " ")
		; Parse encounter list if provided
		declare notfnd 		= vc with constant("<not_found>")
		declare num 		= i4 with noconstant(1)
		declare str 		= vc with noconstant("")

		while (str != notfnd)
	     	set str =  piece(sEncntrList,',',num,notfnd)
	     	if(str != notfnd)
				set stat = alterlist(115468_req->encounters, num)
				set 115468_req->encounters[num]->encounter_id = cnvtreal(str)
	        endif
	      	set num = num + 1
	 	endwhile
	else
		; Retrieve all encounters for patient if none provided
		select into "nl:"
		from encounter e
		plan e
		where e.person_id = dPersonID
		order by e.encntr_id
		head report
			encCnt = 0
		detail
			encCnt = encCnt + 1
			stat = alterlist(115468_req->encounters, encCnt)
			115468_req->encounters[encCnt]->encounter_id = e.encntr_id
		with nocounter
	endif

	if(iDebugFlag > 0)
		call echo(concat("GetEncounters Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end ;End Sub
 
/*************************************************************************
;  Name: GetProcedures(null)
;  Description: This will retrieve all procedures for a patient
**************************************************************************/
subroutine GetProcedures(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetProcedures Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif

	set iApplication = 600005
	set iTask = 601027
	set iReq = 115468

	set 115468_req->procedure_type = -1
	set 115468_req->include_inactive_procs_ind = 1
 
	set stat = tdbexecute(iApplication, iTask, iReq,"REC",115468_req,"REC",procedures_reply_out)
 
	if(procedures_reply_out->status_data->status = "F")
		call ErrorHandler2("EXECUTE", "F", "GET PROCEDURES", "Could not retrieve procedures (115468).",
		"9999", "Could not retrieve procedures (115468).", procedures_reply_out)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("PostAmble Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: PostAmble(null)
;  Description: Perform any post-processing steps
**************************************************************************/
subroutine PostAmble(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostAmble Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set procCnt = size(procedures_reply_out->procedures,5)
 
	if(iDebugFlag > 0)
		call echo(build("procedure count: ",procCnt))
		call echo(build("c_icd9_source_vocabulary_cd: ",c_icd9_source_vocabulary_cd))
		call echo(build("c_icd10_source_vocabulary_cd: ",c_icd10_source_vocabulary_cd))
		call echo(build("c_snmct_source_vocabulary_cd : ",c_snmct_source_vocabulary_cd))
		call echo(build("c_cpt_source_vocabulary_cd : ",c_cpt_source_vocabulary_cd))	;008
	 endif
 
	;001 - Add Laterality, ICD9, ICD10, CPT and c_snmct_source_vocabulary_cd details *

	if(procCnt > 0)
		for (x = 1 to procCnt)
		
			; Add patientid to final object - 009
			set procedures_reply_out->procedures[x]->patient_id = dPersonID
		
			; Set Laterality Display
			if(procedures_reply_out->procedures[x].laterality_cd > 0)
				set procedures_reply_out->procedures[x].laterality_disp =
				uar_get_code_display(procedures_reply_out->procedures[x].laterality_cd) ;012
			endif
		
	 	   	; Set Encounter Details
			set procedures_reply_out->procedures[x]->encntr_type_cd = 
			GetPatientClass(procedures_reply_out->procedures[x]->encounter_id,1);003
		
			set procedures_reply_out->procedures[x]->encntr_type_disp =
			uar_get_code_display(procedures_reply_out->procedures[x]->encntr_type_cd)  ;003
		
			set procedures_reply_out->procedures[x]->encntr_type_class_cd   =
			GetPatientClass(procedures_reply_out->procedures[x]->encounter_id,2) ;004
		
			set procedures_reply_out->procedures[x]->encntr_type_class_disp =
			uar_get_code_display(procedures_reply_out->procedures[x]->encntr_type_class_cd)  ;004
 
			; Set Source vocabulary details
			set sCKI = piece(procedures_reply_out->procedures[x].concept_cki,"!",2,"")
 
			case(procedures_reply_out->procedures[x].source_vocabulary_cd)
				of c_snmct_source_vocabulary_cd: set procedures_reply_out->procedures[x].snomed = sCKI
				of c_icd9_source_vocabulary_cd: set procedures_reply_out->procedures[x].icd9code = sCKI
				of c_icd10_source_vocabulary_cd: set procedures_reply_out->procedures[x].icd10code = sCKI
				of c_icd9_source_vocabulary_cd: set procedures_reply_out->procedures[x].cpt = sCKI
			endcase
		
			; Update Providers
			set provCnt = size(procedures_reply_out->procedures[x].providers,5)
			for (y = 1 to provCnt)
				if(procedures_reply_out->procedures[x].providers[y].procedure_reltn_cd > 0)
					set procedures_reply_out->procedures[x].providers[1].procedure_reltn_disp =
					uar_get_code_display(procedures_reply_out->procedures[x].providers[1].procedure_reltn_cd) ;012
				endif
			endfor
		endfor
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("PostAmble Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
end go
