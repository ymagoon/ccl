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
 
          Date Written:       11/08/14
          Source file name:   snsro_get_diagnosis.prg
          Object name:        vigilanz_get_diagnosis
 
          Request #:          4170154 (KIA_GET_CLIN_DX_BY_ENCNTR_ID)
 
          Program purpose:    Searches for clinical diagnosis given
                              a patient identifier.
 
          Tables read:		  DIAGNOSIS
          Tables updated:     NONE
          Executing from:     EMISSARY SERVICES
          Special Notes:	  NONE
 
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
  000 11/09/14 JCO					Initial write
  001 01/08/15 AAB					Changed reply_out to diagnosis_reply_out
									Added admit_diagnosis to reponse
  003 06/24/15 JCO					Added snomed, icd9 and icd10 fields
  004 08/12/15 AAB 					Added new fields that Cerner added to response
  005 09/14/15 AAB					Add audit object
  006 12/9/15  AAB					Add encntr_type_cd and encntr_type_disp
  007 02/20/16 AAB 					Return encntr_type and encntr_class
  008 04/29/16 AAB 					Added version
  009 06/10/16 AAB 					Map DIAGNOSIS_DISPLAY to CLINICAL_DIAG
  010 10/10/16 AAB 					Add DEBUG_FLAG
  011 07/05/17 JCO					Fixed ICD10-CM field
  012 07/27/17 JCO					Changed %i to execute; update ErrorHandler2
  013 03/21/18 RJC					Added version code and copyright block
  014 04/05/19 RJC					Added person_id to reply
 ***********************************************************************/
drop program vigilanz_get_diagnosis go
create program vigilanz_get_diagnosis
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Encounter ID:" = 0.0
		, "Inactive Ind:" = 0
		, "User Name:" = ""        ;005
		, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
with OUTDEV, ENCNTR_ID, INACTIVE_IND,USERNAME, DEBUG_FLAG   ;010   ;005

/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2" ;013
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
 
free record req_in
record req_in (
  1 encntr_id 					= f8
  1 clinical_service_list [*]
    2 clinical_service_cd 		= f8
  1 diag_type_list [*]
    2 diag_type_cd 				= f8
  1 classification_list [*]
    2 classification_cd 		= f8
  1 inactive_ind 				= i2
  1 encntr_id_list [*]
    2 encntr_id 				= f8
)
 
free record diagnosis_reply_out
record diagnosis_reply_out
(
  1 item [*]
  	2 person_id					= f8
    2 diagnosis_id 				= f8
    2 diagnosis_group 			= f8
    2 encntr_id 				= f8
	2 encntr_type_cd			= f8	;006
	2 encntr_type_disp			= vc	;006
	2 encntr_type_class_cd		= f8	;007
	2 encntr_type_class_disp	= vc	;007
	2 clinical_diag 			= vc
    2 nomenclature_id 			= f8
    2 concept_cki 				= vc
    2 diag_ft_desc 				= vc
    2 diagnosis_display 		= vc
    2 conditional_qual_cd 		= f8
    2 conditional_qual_disp 	= vc
    2 conditional_qual_mean 	= c12
    2 confirmation_status_cd 	= f8
    2 confirmation_status_disp 	= vc
    2 confirmation_status_mean 	= c12
    2 diag_dt_tm 				= dq8
    2 classification_cd 		= f8
    2 classification_disp 		= vc
    2 classification_mean 		= c12
    2 clinical_service_cd 		= f8
    2 clinical_service_disp 	= vc
    2 clinical_service_mean 	= c12
    2 diag_type_cd 				= f8
    2 diag_type_disp 			= vc
    2 diag_type_mean 			= c12
	2 admit_diagnosis			= i2
    2 ranking_cd 				= f8
    2 ranking_disp 				= vc
    2 ranking_mean 				= c12
    2 severity_cd 				= f8
    2 severity_disp 			= vc
    2 severity_mean 			= c12
    2 severity_ftdesc 			= vc
    2 severity_class_cd 		= f8
    2 severity_class_disp 		= vc
    2 severity_class_mean 		= c12
    2 certainty_cd 				= f8
    2 certainty_disp 			= vc
    2 certainty_mean 			= c12
    2 probability 				= i4
    2 long_blob_id 				= f8
    2 comment					= gvc
    2 diag_prsnl_id 			= f8
    2 diag_prsnl_name 			= vc
    2 active_ind 				= i2
    2 diag_priority 			= i4
    2 diagnosis_code 			= vc
    2 source_vocabulary_cd 		= f8
    2 source_vocabulary_disp 	= c40
    2 source_vocabulary_mean 	= c12
    2 short_string 				= vc
    2 mnemonic 					= c25
    2 clinical_diag_priority 	= i4
    2 diagnosis_action_dt_tm 	= dq8
    2 secondary_desc_list [*]
      3 group_sequence 			= i4
      3 group [*]
        4 sequence 				= i4
        4 secondary_desc_id 	= f8
        4 nomenclature_id 		= f8
        4 source_string 		= vc
    2 procedure_cnt 			= i4
    2 procedure_list [*]
      3 procedure_id 			= f8
      3 nomenclature_id 		= f8
      3 source_string 			= vc
      3 concept_cki 			= vc
      3 proc_ftdesc 			= vc
      3 proc_dt_tm 				= dq8
      3 proc_loc_cd 			= f8
      3 proc_loc_disp 			= vc
      3 proc_loc_mean 			= vc
      3 procedure_note 			= vc
      3 anesthesia_cd 			= f8
      3 anesthesia_disp 		= vc
      3 anesthesia_mean 		= vc
      3 anesthesia_minutes 		= i4
      3 tissue_type_cd 			= f8
      3 tissue_type_disp 		= vc
      3 tissue_type_mean 		= vc
      3 proc_priority 			= i4
      3 proc_minutes 			= i4
      3 comment_id 				= f8
      3 comment 				= vc
      3 beg_effective_dt_tm 	= dq8
      3 end_effective_dt_tm 	= dq8
      3 active_ind 				= i2
      3 ranking_cd 				= f8
      3 ranking_disp 			= vc
      3 ranking_mean 			= vc
      3 proc_prsnl_reltn_list [*]
        4 proc_prsnl_reltn_cd 	= f8
        4 proc_prsnl_reltn_disp = vc
        4 proc_prsnl_reltn_mean = vc
        4 prsnl_person_id 		= f8
        4 prsnl_full_name_formatted = vc
      3 secondary_desc_list [*]
        4 group_sequence 		= i4
        4 group [*]
          5 sequence 			= i4
          5 secondary_desc_id 	= f8
          5 nomenclature_id 	= f8
          5 source_string 		= vc
      3 laterality_cd 			= f8
      3 laterality_disp 		= vc
      3 laterality_mean 		= vc
    2 laterality_cd 			= f8
    2 laterality_disp 			= vc
    2 laterality_mean 			= c12
    2 originating_nomenclature_id = f8
    2 originating_source_string = vc
    2 originating_active_ind 	= i2
    2 originating_end_effective_dt_tm = dq8
	2 icd9code						= vc		;003
	2 icd10code						= vc		;003
	2 snomed						= vc		;003
    2 transition_nomenclature_id = f8			;004 +
    2 transition_source_vocabulary_cd = f8
    2 transition_source_string = vc
    2 transition_short_string = vc
    2 transition_mnemonic = c25
    2 transition_concept_cki = vc
    2 transition_source_identifier = vc
    2 beg_effective_dt_tm = dq8
    2 end_effective_dt_tm = dq8					;004 -
  1 related_dx_list [*]
    2 parent_entity_id 			= f8
    2 parent_nomen_id 			= f8
    2 parent_source_string 		= vc
    2 parent_freetext_desc 		= vc
    2 parent_concept_cki 		= vc
    2 child_entity_id 			= f8
    2 child_nomen_id 			= f8
    2 child_source_string 		= vc
    2 child_freetext_desc 		= vc
    2 child_concept_cki 		= vc
    2 reltn_type_cd 			= f8
    2 reltn_type_disp 			= vc
    2 reltn_type_mean 			= c12
    2 reltn_subtype_cd 			= f8
    2 reltn_subtype_disp 		= vc
    2 reltn_subtype_mean 		= c12
    2 priority 					= i4
    2 parent_encntr_id 			= f8
    2 child_encntr_id 			= f8
    2 child_diag_dt_tm 			= dq8
  1 related_proc_list [*]
    2 parent_entity_id 			= f8
    2 parent_nomen_id 			= f8
    2 parent_source_string 		= vc
    2 parent_freetext_desc 		= vc
    2 parent_concept_cki 		= vc
    2 child_entity_id 			= f8
    2 child_nomen_id 			= f8
    2 child_source_string 		= vc
    2 child_freetext_desc 		= vc
    2 child_concept_cki 		= vc
    2 reltn_type_cd 			= f8
    2 reltn_type_disp 			= vc
    2 reltn_type_mean 			= c12
    2 reltn_subtype_cd 			= f8
    2 reltn_subtype_disp 		= vc
    2 reltn_subtype_mean 		= c12
    2 priority 					= i4
    2 child_encntr_id 			= f8
    2 parent_encntr_id 			= f8
    2 child_proc_dt_tm 			= dq8
  1 audit			;005
	2 user_id							= f8
	2 user_firstname					= vc
	2 user_lastname						= vc
	2 patient_id						= f8
	2 patient_firstname					= vc
	2 patient_lastname					= vc
	2 service_version					= vc		;008
/*012 begin */
  1 status_data
    2 status = c1
    2 subeventstatus[1]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
      3 Code = c4
      3 Description = vc
/*012 end */
)
 
set diagnosis_reply_out->status_data->status = "F"
/****************************************************************************
;INCLUDES
****************************************************************************/
;012 %i ccluserdir:snsro_common.inc
execute snsro_common	;012
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
declare dEncntrID					= f8 with protect, constant(cnvtint($ENCNTR_ID))
declare dInactiveInd				= i2 with protect, constant(cnvtint($INACTIVE_IND))
declare APPLICATION_NUMBER 			= i4 with protect, constant (600005)
declare TASK_NUMBER 				= i4 with protect, constant (4170139)
declare REQUEST_NUMBER 				= i4 with protect, constant (4170154)
declare section_start_dt_tm 		= dq8 with protect, noconstant(cnvtdatetime(curdate, curtime3))
declare icd9code 					= f8 with protect, constant(uar_get_code_by("MEANING",400,"ICD9"))	;003
;declare icd10code 					= f8 with protect, constant(uar_get_code_by("MEANING",400,"ICD10")) ;003
declare icd10code 					= f8 with protect, constant(uar_get_code_by("MEANING",400,"ICD10-CM")) ;011
declare snomed 						= f8 with protect, constant(uar_get_code_by("MEANING",400,"SNMCT")) ;003
declare sCKI						= vc with protect, noconstant("")									;003
declare dPersonID					= f8 with protect, noconstant(0.0)	;005
declare sUserName					= vc with protect, noconstant("")   ;005
declare iRet						= i2 with protect, noconstant(0) 	;005
declare idebugFlag					= i2 with protect, noconstant(0) ;010
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
set file_name 						= $OUTDEV
set sUserName						= trim($USERNAME, 3)  			 	;005
set dPersonID						= GetPersonIdByEncntrId(dEncntrId)  ;005
set idebugFlag						= cnvtint($DEBUG_FLAG)  ;010
 
if(idebugFlag > 0)
 
	call echo(build("dPersonID  ->", dPersonID))
	call echo(build("sUserName  ->", sUserName))
 
endif
 
 
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetDiagnosis(null)					= null with protect
declare PostAmble(null)						= null with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
if( dEncntrID > 0.0)
 
	set iRet = PopulateAudit(sUserName, dPersonID, diagnosis_reply_out, sVersion)        ;005   008
 
	if(iRet = 0)  ;005
		call ErrorHandler2("VALIDATE", "F", "PRSNL", "Invalid User for Audit.",
		"1001", build("UserId is invalid: ",sUserName), diagnosis_reply_out)	;012
		go to exit_script
 
	endif
 
	call GetDiagnosis(null)
	call PostAmble(null)
else
 	call ErrorHandler2("VALIDATE", "F", "ENCOUNTER", "EncounterId is missing",
 	"2004", "EncounterId field is missing", diagnosis_reply_out)	;012
	go to EXIT_SCRIPT
 
endif
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT

/*************************************************************************
; RETURN JSON
**************************************************************************/
	set JSONout = CNVTRECTOJSON(diagnosis_reply_out)
 
    if(validate(_MEMORY_REPLY_STRING))
		set _MEMORY_REPLY_STRING = trim(JSONout,3)
	endif
 
if(idebugFlag > 0)
 
 	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_diagnosis.json")
	call echo(build2("_file : ", _file))
	call echojson(diagnosis_reply_out, _file, 0)
	call echorecord(diagnosis_reply_out)
	call echo(JSONout)
endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: GetDiagnosis(null)
;  Description: This will retrieve all diagnosis for a patient based on
;  encounter identifier
**************************************************************************/
subroutine GetDiagnosis(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetDiagnosis Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
set req_in->encntr_id                	= dEncntrID
set req_in->inactive_ind 				= dInactiveInd
 
if(idebugFlag > 0)
 
	call echorecord(req_in)
 
endif
 
set stat = tdbexecute(APPLICATION_NUMBER, TASK_NUMBER, REQUEST_NUMBER,"REC",req_in,"REC",diagnosis_reply_out)
 
if(idebugFlag > 0)
 
	call echorecord(diagnosis_reply_out)
 
endif
 
if (stat > 0)
	call ErrorHandler2("EXECUTE", "F", "DIAGNOSIS", "Error executing 4170154",
	"9999", build("Error executing 4170154: ", stat), diagnosis_reply_out)	;012
	go to EXIT_SCRIPT
 
else
	call ErrorHandler("EXECUTE", "S", "DIAGNOSIS", "Success executing 4170154 patient diagnosis", diagnosis_reply_out)
endif
 
if(idebugFlag > 0)
 
	call echo(concat("GetDiagnosis Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
 
end
 
/*************************************************************************
;  Name: PostAmble(null)
;  Description: Subroutine to perform Post Processing
;
**************************************************************************/
subroutine PostAmble(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("PostAmble Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
declare x	= i4 with protect, noconstant(0)
 
 
for(x = 1 to size(diagnosis_reply_out->item,5))
 
	set diagnosis_reply_out->item[x]->admit_diagnosis = 0
	set diagnosis_reply_out->item[x].person_id = dPersonId
 
	if(idebugFlag > 0)
 
		call echo(build("Diag Type Cd -->", diagnosis_reply_out->item[x]->diag_type_cd))
		call echo(build("Diag Type cdf -->", uar_get_code_by ("MEANING",17,"ADMIT")))
 
	endif
 
	if(diagnosis_reply_out->item[x]->diag_type_cd = uar_get_code_by ("MEANING",17,"ADMIT"))
		set diagnosis_reply_out->item[x]->admit_diagnosis = 1
	endif
	set sCKI =
		SUBSTRING(FINDSTRING("!", diagnosis_reply_out->item[x].concept_cki, 1)+1,
			TEXTLEN(diagnosis_reply_out->item[x].concept_cki), diagnosis_reply_out->item[x].concept_cki)
 	call echo(build("sCKI: ",sCKI))
	if (diagnosis_reply_out->item[x]->source_vocabulary_cd = snomed)
		set diagnosis_reply_out->item[x]->snomed = sCKI
	elseif (diagnosis_reply_out->item[x]->source_vocabulary_cd = icd9code)
		set diagnosis_reply_out->item[x]->icd9code = sCKI
	elseif (diagnosis_reply_out->item[x]->source_vocabulary_cd = icd10code)
		set diagnosis_reply_out->item[x]->icd10code = sCKI
	endif
 
	set diagnosis_reply_out->item[x]->encntr_type_cd = GetPatientClass( diagnosis_reply_out->item[x]->encntr_id,1)	          ;006	007
	set diagnosis_reply_out->item[x]->encntr_type_disp = uar_get_code_display(diagnosis_reply_out->item[x]->encntr_type_cd)   ;006	007
	set diagnosis_reply_out->item[x]->encntr_type_class_cd = GetPatientClass( diagnosis_reply_out->item[x]->encntr_id, 2)	  ;007
	set diagnosis_reply_out->item[x].encntr_type_class_disp =
			uar_get_code_display(diagnosis_reply_out->item[x]->encntr_type_class_cd)   ;007
 
	set diagnosis_reply_out->item[x]->clinical_diag = ""											 ;009
	set diagnosis_reply_out->item[x]->clinical_diag = 	diagnosis_reply_out->item[x]->diagnosis_display  ;009
 
endfor
 
 
if(idebugFlag > 0)
 
	call echo(concat("PostAmble Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
 
end go
