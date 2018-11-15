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
  ~BE~*************************************************************************
          Date Written:       11/08/14
          Source file name:   snsro_get_allergies.prg
          Object name:        snsro_get_allergies
          Request #:          3200123 (HNA_OBJ_GET_ALLERGY)
          Program purpose:    Searches for a list of allergies given a patient identifier.
          Executing from:     EMISSARY SERVICES
          Special Notes:	  NONE
 ***********************************************************************
                   GENERATED MODIFICATION CONTROL LOG                 
 ***********************************************************************
 Mod Date     Engineer             Comment                            
 --- -------- -------------------- -------------------------------------
  000 11/08/14 JCO					Initial write
  001 11/30/14 JCO					Added PostAmble and NKA reply fields
  002 12/07/14 JCO					Added MOVERECLIST( ) logic
  003 12/08/14 JCO					Added call echojson( ) to dump JSON
  004 09/14/15 AAB					Add audit object
  005 02/22/16 AAB 					Return encntr_type and encntr_class
  006 04/06/16 JCO					Added version
  007 04/29/16 AAB 					Support FreeText Description
  008 10/10/16 AAB 					Add DEBUG_FLAG
  009 07/27/17 JCO					Changed %i to execute; update ErrorHandler2
  010 08/10/17 JCO					Added to each allergy
  011 09/29/17 RJC					Added PERSON_ID to allergy record to fix movereclist error. 
  012 03/21/18 RJC					Added version code and copyright block
  013 08/16/18 RJC					Removed MoveRecList sub; used moverec in post amble instead. Code cleanup		
 ***********************************************************************/
drop program snsro_get_allergies go
create program snsro_get_allergies

prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Person ID:" = 0.0		;Required
		, "Show Cancelled:" = 0		;Optional
		, "UserName:" = ""        	;Optional
		, "Debug Flag" = 0			;OPTIONAL. Verbose logging when set to one (1).   008
 
with OUTDEV,PERSON_ID, SHOW_CANCELLED,USERNAME, DEBUG_FLAG   ;008		;004

/*************************************************************************
;VERSION CONTROL
**************************************************************************/
set sVersion = "1.16.6.1" 
if($OUTDEV = "VERSION")
	go to exit_version
endif

/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
; 3200123 - hna_obj_get_allergy
free record 3200123_req
record 3200123_req (
  1 person_id = f8
  1 person [*]
    2 person_id = f8
  1 allergy [*]
    2 allergy_id = f8
  1 cancel_ind = i2
)
 
free record 3200123_rep
record 3200123_rep (
  1 person [*]
    2 person_id = f8
    2 allergy_qual = i4
    2 allergy [*]
      3 allergy_id = f8
      3 allergy_instance_id = f8
      3 encntr_id = f8
	  3 encntr_type_class_cd	= f8		;005
	  3 encntr_type_class_disp	= vc		;005
	  3 encntr_type_cd			= f8		;005
	  3 encntr_type_disp		= vc		;005
      3 source_string = vc
      3 substance_nom_id = f8
      3 substance_ftdesc = vc
      3 substance_type_cd = f8
      3 substance_type_disp = vc
      3 substance_type_mean = vc
      3 reaction_class_cd = f8
      3 reaction_class_disp = vc
      3 reaction_class_mean = vc
      3 severity_cd = f8
      3 severity_disp = vc
      3 severity_mean = vc
      3 source_of_info_cd = f8
      3 source_of_info_disp = vc
      3 source_of_info_mean = vc
      3 onset_dt_tm = dq8
      3 onset_precision_cd = f8
      3 onset_precision_disp = vc
      3 onset_precision_flag = i2
      3 reaction_status_cd = f8
      3 reaction_status_disp = vc
      3 reaction_status_mean = vc
      3 reaction_status_dt_tm = dq8 	;orosco
      3 created_dt_tm = dq8
      3 created_prsnl_id = f8
      3 created_prsnl_name = vc
      3 reviewed_dt_tm = dq8
      3 reviewed_prsnl_id = f8
      3 reviewed_prsnl_name = vc
      3 cancel_reason_cd = f8
      3 cancel_reason_disp = vc
      3 active_ind = i2
      3 orig_prsnl_id = f8
      3 orig_prsnl_name = vc
      3 updt_id = f8
      3 updt_name = vc
      3 updt_dt_tm = dq8
      3 updt_cnt = i4
      3 cki = vc
      3 concept_source_cd = f8
      3 concept_source_disp = vc
      3 concept_source_mean = vc
      3 concept_identifier = vc
      3 cancel_dt_tm = dq8
      3 cancel_prsnl_id = f8
      3 cancel_prsnl_name = vc
      3 beg_effective_dt_tm = dq8
      3 end_effective_dt_tm = dq8
      3 data_status_cd = f8
      3 data_status_dt_tm = dq8
      3 data_status_prsnl_id = f8
      3 contributor_system_cd = f8
      3 source_of_info_ft = vc
      3 active_status_cd = f8
      3 active_status_dt_tm = dq8
      3 active_status_prsnl_id = f8
      3 rec_src_identifier = vc
      3 rec_src_string = vc
      3 rec_src_vocab_cd = f8
      3 verified_status_flag = i2
      3 reaction_qual = i4
      3 reaction [*]
        4 allergy_instance_id = f8
        4 reaction_id = f8
        4 reaction_nom_id = f8
        4 source_string = vc
        4 reaction_ftdesc = vc
        4 beg_effective_dt_tm = dq8
        4 active_ind = i2
        4 end_effective_dt_tm = dq8
        4 data_status_cd = f8
        4 data_status_dt_tm = dq8
        4 data_status_prsnl_id = f8
        4 contributor_system_cd = f8
        4 active_status_cd = f8
        4 active_status_dt_tm = dq8
        4 active_status_prsnl_id = f8
        4 updt_id = f8
        4 updt_dt_tm = dq8
        4 updt_cnt = i4
      3 comment_qual = i4
      3 comment [*]
        4 allergy_comment_id = f8
        4 allergy_instance_id = f8
        4 comment_dt_tm = dq8
        4 comment_prsnl_id = f8
        4 comment_prsnl_name = vc
        4 allergy_comment = vc
        4 beg_effective_dt_tm = dq8
        4 active_ind = i2
        4 end_effective_dt_tm = dq8
        4 data_status_cd = f8
        4 data_status_dt_tm = dq8
        4 data_status_prsnl_id = f8
        4 contributor_system_cd = f8
        4 active_status_cd = f8
        4 active_status_dt_tm = dq8
        4 active_status_prsnl_id = f8
        4 updt_id = f8
        4 updt_dt_tm = dq8
        4 updt_cnt = i4
      3 substance_mnemonic = vc
      3 person_id = f8					;010
    2 noknown = i2						;001
    2 noknown_dt_tm = dq8				;001
    2 noknown_documented_by = vc		;001
  1 status_data
    2 status = c1
    2 subeventstatus[1]
      3 operationname = c25
      3 operationstatus = c1
      3 targetobjectname = c25
      3 targetobjectvalue = vc
)
 
free record allergies_reply_out
record allergies_reply_out (
  1 allergies [*]
    2 person_id = f8
    2 allergy_qual = i4
    2 allergy [*]
      3 allergy_id = f8
      3 allergy_instance_id = f8
      3 encntr_id = f8
	  3 encntr_type_class_cd	= f8		;005
	  3 encntr_type_class_disp	= vc		;005
	  3 encntr_type_cd			= f8		;005
	  3 encntr_type_disp		= vc		;005
      3 source_string = vc
      3 substance_nom_id = f8
      3 substance_ftdesc = vc
      3 substance_type_cd = f8
      3 substance_type_disp = vc
      3 substance_type_mean = vc
      3 reaction_class_cd = f8
      3 reaction_class_disp = vc
      3 reaction_class_mean = vc
      3 severity_cd = f8
      3 severity_disp = vc
      3 severity_mean = vc
      3 source_of_info_cd = f8
      3 source_of_info_disp = vc
      3 source_of_info_mean = vc
      3 onset_dt_tm = dq8
      3 onset_precision_cd = f8
      3 onset_precision_disp = vc
      3 onset_precision_flag = i2
      3 reaction_status_cd = f8
      3 reaction_status_disp = vc
      3 reaction_status_mean = vc
      3 reaction_status_dt_tm = dq8
      3 created_dt_tm = dq8
      3 created_prsnl_id = f8
      3 created_prsnl_name = vc
      3 reviewed_dt_tm = dq8
      3 reviewed_prsnl_id = f8
      3 reviewed_prsnl_name = vc
      3 cancel_reason_cd = f8
      3 cancel_reason_disp = vc
      3 active_ind = i2
      3 orig_prsnl_id = f8
      3 orig_prsnl_name = vc
      3 updt_id = f8
      3 updt_name = vc
      3 updt_dt_tm = dq8
      3 updt_cnt = i4
      3 cki = vc
      3 concept_source_cd = f8
      3 concept_source_disp = vc
      3 concept_source_mean = vc
      3 concept_identifier = vc
      3 cancel_dt_tm = dq8
      3 cancel_prsnl_id = f8
      3 cancel_prsnl_name = vc
      3 beg_effective_dt_tm = dq8
      3 end_effective_dt_tm = dq8
      3 data_status_cd = f8
      3 data_status_dt_tm = dq8
      3 data_status_prsnl_id = f8
      3 contributor_system_cd = f8
      3 source_of_info_ft = vc
      3 active_status_cd = f8
      3 active_status_dt_tm = dq8
      3 active_status_prsnl_id = f8
      3 rec_src_identifier = vc
      3 rec_src_string = vc
      3 rec_src_vocab_cd = f8
      3 verified_status_flag = i2
      3 reaction_qual = i4
      3 reaction [*]
        4 allergy_instance_id = f8
        4 reaction_id = f8
        4 reaction_nom_id = f8
        4 source_string = vc
        4 reaction_ftdesc = vc
        4 beg_effective_dt_tm = dq8
        4 active_ind = i2
        4 end_effective_dt_tm = dq8
        4 data_status_cd = f8
        4 data_status_dt_tm = dq8
        4 data_status_prsnl_id = f8
        4 contributor_system_cd = f8
        4 active_status_cd = f8
        4 active_status_dt_tm = dq8
        4 active_status_prsnl_id = f8
        4 updt_id = f8
        4 updt_dt_tm = dq8
        4 updt_cnt = i4
      3 comment_qual = i4
      3 comment [*]
        4 allergy_comment_id = f8
        4 allergy_instance_id = f8
        4 comment_dt_tm = dq8
        4 comment_prsnl_id = f8
        4 comment_prsnl_name = vc
        4 allergy_comment = vc
        4 beg_effective_dt_tm = dq8
        4 active_ind = i2
        4 end_effective_dt_tm = dq8
        4 data_status_cd = f8
        4 data_status_dt_tm = dq8
        4 data_status_prsnl_id = f8
        4 contributor_system_cd = f8
        4 active_status_cd = f8
        4 active_status_dt_tm = dq8
        4 active_status_prsnl_id = f8
        4 updt_id = f8
        4 updt_dt_tm = dq8
        4 updt_cnt = i4
      3 substance_mnemonic = vc
      3 person_id = f8						;011
    2 noknown = i2							;001
    2 noknown_dt_tm = dq8					;001
    2 noknown_documented_by = vc			;001
  1 audit									;004
	2 user_id					= f8
	2 user_firstname			= vc
	2 user_lastname				= vc
	2 patient_id				= f8
	2 patient_firstname			= vc
	2 patient_lastname			= vc
	2 service_version			= vc		;006
  1 status_data								;009
    2 status = c1
    2 subeventstatus[1]
      3 operationname = c25
      3 operationstatus = c1
      3 targetobjectname = c25
      3 targetobjectvalue = vc
      3 code = c4
      3 description = vc
)
 
set 3200123_rep->status_data->status = "F"
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
; Input
declare sUserName						= vc with protect, noconstant("")   ;004
declare dPersonID						= f8 with protect, noconstant(0.0)
declare iShowCancelled					= i2 with protect, noconstant(0)
declare iDebugFlag						= i2 with protect, noconstant(0) ;008

; Constants
declare c_active_reaction_status_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",12025,"ACTIVE"))	;001

/*************************************************************************
;INITIALIZE
**************************************************************************/
; Input
set sUserName					= trim($USERNAME, 3)   		;004
set dPersonId					= cnvtreal($PERSON_ID)
set iShowCancelled				= cnvtint($SHOW_CANCELLED)
set iDebugFlag					= cnvtint($DEBUG_FLAG)  	;008
 
if(iDebugFlag > 0)
	call echo(build("sUserName  ->", sUserName))
	call echo(build("dPersonId  ->", dPersonId))
	call echo(build("iShowCancelled  ->", iShowCancelled))
	call echo(build("iDebugFlag  ->", iDebugFlag))
endif
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common	;009
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetAllergies(null)			= null with protect
declare PostAmble(null)				= null with protect
 
/*************************************************************************
; MAIN
**************************************************************************/
; Validate PersonId exists
if(dPersonId = 0)
	call ErrorHandler2("ALLERGIES", "F", "Validate", "Missing required field: PatientId.",
	"2055", "PatientId is missing.", allergies_reply_out)
	go to EXIT_SCRIPT
endif
 
 ; Validate username
set iRet = PopulateAudit(sUserName, dPersonID, allergies_reply_out, sVersion)    ;004 ;006
if(iRet = 0)  ;004
 	call ErrorHandler2("ALLERGY", "F", "User is invalid", "Invalid User for Audit.",
	"1001",build("Invlid user: ",sUserName), allergies_reply_out)	;009
 	go to exit_script
endif

; Get Allergies
 call GetAllergies(null)

; Post Amble
call PostAmble(null)
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
#EXIT_SCRIPT
 
set JSONout = CNVTRECTOJSON(allergies_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif

if(iDebugFlag > 0)  																;008
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_allergies.json")
	call echo(build2("_file : ", _file))
	call echorecord(allergies_reply_out)
	call echojson(allergies_reply_out, _file, 0)
endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: GetAllergies(null)
;  Description: This will retrieve all allergies for a patient
**************************************************************************/
subroutine GetAllergies(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetAllergies  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif

	set iApplication = 3200000
	set iTask = 3200065
	set iRequest =3200123

	; Setup request
	set 3200123_req->person_id = dPersonID
	set 3200123_req->cancel_ind	= iShowCancelled
	
	; Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",3200123_req,"REC",3200123_rep)

	if (stat > 0)
		call ErrorHandler2("EXECUTE", "F", "ALLERGY", "Error executing 3200123 - snsro_get_allergies",
		"9999", "Error executing 3200123 - snsro_get_allergies", allergies_reply_out)	;009
		go to EXIT_SCRIPT
	else
		call ErrorHandler("EXECUTE", "S", "ALLERGY", "Success executing 3200123 - snsro_get_allergies", allergies_reply_out)
	endif

	if(iDebugFlag > 0)
		call echo(concat("GetAllergies Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 

/*************************************************************************
;  Name: PostAmble(null)
;  Description: Perform any post-processing steps on allergies here
**************************************************************************/
subroutine PostAmble(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostAmble  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
	
	; Move record 3200123_rep to allergies_reply_out - 002;013
	if(size(3200123_rep->person,5) > 0)
		set stat = moverec(3200123_rep->person, allergies_reply_out->allergies)
	endif
 
	; Loop through final reply and add additional encounter and NKA data
	set personCnt = size(allergies_reply_out->allergies,5)
	for(x = 1 to personCnt)
		set allergies_reply_out->allergies[x]->noknown = 0 		;initialize No Known Allergies to false
		set allergyCnt = size(allergies_reply_out->allergies[x]->allergy,5)
		set allergies_reply_out->allergies[x]->allergy_qual = allergyCnt
 
		if(iDebugFlag > 0)
			call echo(build("Allergies count: ",allergyCnt))
		endif
 
		for (y = 1 to allergyCnt)
			if(iDebugFlag > 0)
				call echo(build("source string ",x," : ",trim(allergies_reply_out->allergies[x]->allergy[y]->source_string)))
			endif
 
			; NKA data
			if (trim(allergies_reply_out->allergies[x]->allergy[y]->source_string) = "NKA"
				and allergies_reply_out->allergies[x]->allergy[y].reaction_status_cd = c_active_reaction_status_cd)
				set allergies_reply_out->allergies[x]->noknown = 1
				set allergies_reply_out->allergies[x]->noknown_dt_tm = allergies_reply_out->allergies[x]->allergy[y]->reaction_status_dt_tm
				set allergies_reply_out->allergies[x]->noknown_documented_by = allergies_reply_out->allergies[x]->allergy[y]->updt_name
			endif
 
			; Free text description - 007
			if (trim(allergies_reply_out->allergies[x]->allergy[y]->source_string) = ""	)
			    set allergies_reply_out->allergies[x]->allergy[y]->source_string = 
			    allergies_reply_out->allergies[x]->allergy[y]->SUBSTANCE_FTDESC
			endif
 
			; Encounter data - 005
			set allergies_reply_out->allergies[x]->allergy[y]->encntr_type_cd =
				GetPatientClass(allergies_reply_out->allergies[x]->allergy[y]->encntr_id, 1)
			set allergies_reply_out->allergies[x]->allergy[y]->encntr_type_disp =
				uar_get_code_display(allergies_reply_out->allergies[x]->allergy[y]->encntr_type_cd)
			set allergies_reply_out->allergies[x]->allergy[y]->encntr_type_class_cd =
				GetPatientClass(allergies_reply_out->allergies[x]->allergy[y]->encntr_id, 2)
			set allergies_reply_out->allergies[x]->allergy[y]->encntr_type_class_disp =
				uar_get_code_display(allergies_reply_out->allergies[x]->allergy[y]->encntr_type_class_cd)
 
			;Set PersonId - 011
			set allergies_reply_out->ALLERGIES[x].ALLERGY[y].PERSON_ID = dPersonID
		endfor
	endfor
	 
	if(iDebugFlag > 0)
		call echo(concat("PostAmble Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
  
end go
 

