/*****************************************************************************
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
******************************************************************************
      Source file name:   snsro_add_document.prg
      Object name:        SNSRO_ADD_DOCUMENT
      Program purpose:    POST a new document in Millennium.
      Executing from:     MPages Discern Web Service
******************************************************************************
                    MODIFICATION CONTROL LOG
******************************************************************************
 Mod Date     Engineer             Comment
 -----------------------------------------------------------------------------
  000 07/01/16  AAB         Initial creation
  001 10/10/16  AAB 		Add DEBUG_FLAG
  002 11/23/16  AAB 		Fix event prsnl
  003 07/27/17  JCO			Changed %i to execute; update ErrorHandler2
  004 09/13/17	RJC			Added code to process binary > 65K and updates with privs, sig line and result status
  005 11/09/17	RJC			Added check to validate doc body is not empty and is properly base64 encoded
  006 03/21/18	RJC			Added version code
  007 03/23/18	RJC			Added paramater to add_binary call and made default storage the custom table.
  008 03/26/18	RJC			Updated reqinfo->updt_id to prsnl_id that is passed in parameters
  009 04/02/18	RJC			Added encounter timezone to performed_tz
  010 04/18/18 	RJC			Added author, cosigning, dictated dttm, transcribed dttm
  011 05/09/18	RJC			Added external document id, patientid type and encounter alias fields, moved
  							GetDateTime to snsro_common
  012 06/06/18 RJC			Added Transcribed status, fixed sig line and timezone issues
  013 06/08/18 RJC			Sig Line changes, Added task creation, added ServiceDepartmentId(contrib system)
  014 06/13/18 RJC			Reverted parameter order to original state to prevent issues with Emissary and CCL version differences
  015 10/08/18 RJC			Added check to ensure external document id doesn't already exist
  DO NOT ADD ANY CHANGES TO THIS SCRIPT. ANYTHING NEW SHOULD BE DONE IN SNSRO_POST_DOCUMENT
/******************************************************************************/
drop program snsro_add_document go
create program snsro_add_document
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username:" = ""        		;required
		, "Patient Id:" = ""			;required
		, "Encounter Id:" = ""			;optional
		, "Document Type:" = ""			;Required - Codified document type (codeset 72)
		, "Document Date:" = ""			;Default to todays date
		, "Document Format:" = ""		;Optional - RTF, PDF, TIFF, JPEG (codset 23) - Default is RTF
		, "Document Subject:" = ""		;Optional - A brief description of the nature of the contents of the Clinical Document.
		, "Document Status" = ""		;Optional - Document Status (CodeSet 8) - IN PROGRESS or AUTH(signed) Defualt to Signed ;004 - Added
		, "Document Body:" = ""			;Required - base64 encoded document string
		, "Transaction ID" = ""			;Trans ID created in Emissary.   ;004
		, "Sequence Number" = 1			;Sequence of the call			 ;004
		, "Total"	= 1					;Total number of calls expected to rebuild binary	;004
		, "Storage Type" = 2			;1 = To file; 2 = To custom table ;004
		, "Directory" = "ccluserdir"	;Should be NFS share - CCLUSERDIR is default
		, "Author" = ""					;Optional
		, "Cosigner" = ""				;Optional
		, "Dictated Date" = ""			;Optional
		, "Transcribed Date" = ""		;Optional
		, "PatientIdType:" = ""			;optional - if blank, person_id is assumed ;011
		, "EncounterAlias:" = ""		;optional - must be FIN number ;011
		, "ExternalDocId" = ""			;Optional - required if ServiceDeptId(contrib system) provided
		, "ServiceDeptId" = ""			;optional ;013 - Contributor System Cd
		, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, USERNAME, PERSON_ID, ENCNTR_ID, DOC_TYPE, DOC_DATE, DOC_FORMAT, DOC_SUBJECT,
	DOC_STATUS, DOC_BODY, TRANS_ID, SEQ_NUM, TOTAL, STOR_TYPE, DIR, AUTHOR, COSIGNER, DICTATED_DT,
	TRANSCRIBED_DT, PAT_ID_TYPE, ENC_ALIAS, EXT_DOC_ID, CONTRIB_SYS, DEBUG_FLAG
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL - 006
**************************************************************************/
set sVersion = "1.16.6.1"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
if($OUTDEV = "TEST")
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_add_document_test.json")
	call echojson(request, _file, 0)
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record document_reply_out
record document_reply_out(
  1 document_id             = f8
  1 audit
    2 user_id             = f8
    2 user_firstname          = vc
    2 user_lastname           = vc
    2 patient_id            = f8
    2 patient_firstname         = vc
    2 patient_lastname          = vc
    2 service_version         = vc
/*003 begin */
  1 status_data
    2 status = c1
    2 subeventstatus[1]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
      3 Code = c4
      3 Description = vc
/*003 end */
)
 
;004 Start
free record binary_req
record binary_req (
	1 user_id			= f8	; used for table logging
	1 transaction_id 	= vc	; Unique ID generated in Emissary
	1 sequence 			= i4	; Sequence number of particular call
	1 total		 		= i4 	; Number of calls to expect
	1 storage	 		= i2	; 1 = To file; 2 = To custom table
	1 action			= vc 	; "ADD" or "DELETE" ;This either will add data to a file or table OR
								; delete the file or data in table. The default is to add
	1 filename			= vc 	; filename
	1 directory			= vc	; Logical should be NFS share.
	1 binary			= gvc 	; Base64 encoded data
	1 debug_flag		= i2 	; OPTIONAL. Verbose logging when set to one (1).
)
 
free record binary_rep
record binary_rep(
  1 filename				= vc
  1 audit
    2 service_version       = vc
  1 status_data
    2 status				= c1
    2 subeventstatus[1]
      3 OperationName 		= c25
      3 OperationStatus		= c1
      3 TargetObjectName 	= c25
      3 TargetObjectValue 	= vc
      3 Code 				= c4
      3 Description 		= vc
)
 
free record 100190_req
record 100190_req (
  	1 encntrs [*]
    	2 encntr_id = f8
    	2 transaction_dt_tm = dq8
  	1 facilities [*]
    	2 loc_facility_cd = f8
)
 
free record 100190_rep
record 100190_rep (
    	1 encntrs_qual_cnt = i4
    	1 encntrs [*]
		  2 encntr_id = f8
      	  2 time_zone_indx = i4
      	  2 time_zone = vc
      	  2 transaction_dt_tm = dq8
      	  2 check = i2
      	  2 status = i2
      	  2 loc_fac_cd = f8
    	1 facilities_qual_cnt = i4
    	1 facilities [*]
      	  2 loc_facility_cd = f8
      	  2 time_zone_indx = i4
      	  2 time_zone = vc
          2 status = i2
    	1 status_data
      	  2 status = c1
      	  2 subeventstatus [1]
        	3 operationname = c25
        	3 operationstatus = c1
        	3 targetobjectname = c25
        	3 targetobjectvalue = vc
)
 
free record 680501_req
 record 680501_req (
  1 patient_user_criteria
    2 user_id = f8
    2 patient_user_relationship_cd = f8
  1 event_privileges
    2 event_set_level
      3 event_sets [*]
        4 event_set_name = vc
      3 view_results_ind = i2
      3 add_documentation_ind = i2
      3 modify_documentation_ind = i2
      3 unchart_documentation_ind = i2
      3 sign_documentation_ind = i2
    2 event_code_level
      3 event_codes [*]
        4 event_cd = f8
      3 view_results_ind = i2
      3 document_section_viewing_ind = i2
      3 add_documentation_ind = i2
      3 modify_documentation_ind = i2
      3 unchart_documentation_ind = i2
      3 sign_documentation_ind = i2
)
 
free record 680501_rep
record 680501_rep (
  1 patient_user_information
    2 user_id = f8
    2 patient_user_relationship_cd = f8
    2 role_id = f8
  1 event_privileges
    2 view_results
      3 granted
        4 event_sets [*]
          5 event_set_name = vc
        4 event_codes [*]
          5 event_cd = f8
      3 status
        4 success_ind = i2
    2 document_section_viewing
      3 granted
        4 event_codes [*]
          5 event_cd = f8
      3 status
        4 success_ind = i2
    2 add_documentation
      3 granted
        4 event_sets [*]
          5 event_set_name = vc
        4 event_codes [*]
          5 event_cd = f8
      3 status
        4 success_ind = i2
    2 modify_documentation
      3 granted
        4 event_sets [*]
          5 event_set_name = vc
        4 event_codes [*]
          5 event_cd = f8
      3 status
        4 success_ind = i2
    2 unchart_documentation
      3 granted
        4 event_sets [*]
          5 event_set_name = vc
        4 event_codes [*]
          5 event_cd = f8
      3 status
        4 success_ind = i2
    2 sign_documentation
      3 granted
        4 event_sets [*]
          5 event_set_name = vc
        4 event_codes [*]
          5 event_cd = f8
      3 status
        4 success_ind = i2
  1 transaction_status
    2 success_ind = i2
    2 debug_error_message = vc
)
 
free record 3200246_req
record 3200246_req (
  1 signature_line_criteria [*]
    2 result_status_cd = f8
    2 type_cd = f8
    2 activity_type_cd = f8
    2 activity_subtype_cd = f8
    2 event_title_text = vc
    2 personnel_actions [*]
      3 action_type_cd = f8
      3 action_status_cd = f8
      3 action_personnel_id = f8
      3 proxy_personnel_id = f8
      3 action_date = dq8
      3 action_tz = i4
      3 action_comment = vc
      3 request_comment = vc
)
 
free record 3200246_rep
record 3200246_rep (
  1 transaction_status
    2 success_ind = i2
    2 debug_error_message = vc
  1 signature_lines [*]
    2 text = vc
    2 isBuilt = i2
)
;004 End
 
;967143 - Task.AddMessages
free record 967143_req
record 967143_req (
  1 task_list [*]
    2 person_id = f8
    2 encntr_id = f8
    2 event_id = f8
    2 event_cd = f8
    2 event_class_cd = f8
    2 task_type_cd = f8
    2 task_type_meaning = vc
    2 task_activity_cd = f8
    2 task_activity_meaning = vc
    2 task_status_cd = f8
    2 task_status_meaning = vc
    2 stat_ind = i2
    2 msg_sender_person_id = f8
    2 msg_sender_prsnl_id = f8
    2 msg_subject = vc
    2 msg_subject_cd = f8
    2 comments = c255
    2 msg_text = gvc
    2 contributor_system_cd = f8
    2 external_reference_nbr = vc
    2 assign_prsnl_list [*]
      3 assign_prsnl_id = f8
      3 copy_type_flag = i2
    2 assign_person_list [*]
      3 assign_person_id = f8
      3 copy_type_flag = i2
    2 assign_prsnl_group_list [*]
      3 assign_prsnl_group_id = f8
      3 assign_prsnl_id = f8
      3 copy_type_flag = i2
    2 msg_sender_prsnl_group_id = f8
    2 scheduled_dt_tm = dq8
    2 remind_dt_tm = dq8
    2 sub_activity_list [*]
      3 action_request_cd = f8
      3 order_proposal_id = f8
      3 rx_renewal_id = f8
    2 suggested_entity_name = vc
    2 suggested_entity_id = f8
    2 source_tag = vc
    2 orig_pool_task_id = f8
    2 order_id = f8
)
 
free record 967143_rep
record 967143_rep (
  1 error_nbr = i4
  1 error_severity = i4
  1 error_description = vc
  1 task_list [*]
    2 task_id = f8
  1 status_data
    2 status = c1
    2 substatus = i2
    2 subeventstatus [*]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = c100
)
 
 RECORD cv_atr (
   1 stat = i4
   1 app_nbr = i4
   1 task_nbr = i4
   1 step_nbr = i4
   1 happ = i4
   1 htask = i4
   1 hstep = i4
   1 hrequest = i4
   1 hreply = i4
 ) WITH protect
 
IF ((validate (reply->status_data.status ) = 0 ) )
  FREE
  SET reply
  RECORD reply (
    1 sb_severity = i4
    1 sb_status = i4
    1 sb_statustext = vc
    1 event_id = f8
    1 status_data
      2 status = c1
      2 subeventstatus [*]
        3 operationname = c25
        3 operationstatus = c1
        3 targetobjectname = c25
        3 targetobjectvalue = vc
  )
 ENDIF
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
; Inputs
declare sUserName			= vc with protect, noconstant("")
declare dPatientId  		= f8 with protect, noconstant(0.0)
declare sPatientId  		= vc with protect, noconstant("") ;011
declare dPatientIdType		= f8 with protect, noconstant(0.0) ;011
declare dUserId				= f8 with protect, noconstant(0.0)
declare dEncounterId  			= f8 with protect, noconstant(0.0)
declare sEncntrAlias		= vc with protect, noconstant("") ;011
declare dDocType 			= f8 with protect, noconstant(0.0)
declare dDocFormat 			= f8 with protect, noconstant(0.0)
declare dDocStatus			= f8 with protect, noconstant(0.0) 	;004
declare sDocSubject			= vc with protect, noconstant("")
declare sDocStatus			= vc with protect, noconstant("")
declare sDocStatusMean		= vc with protect, noconstant("")
declare sDocBody  			= gvc with protect, noconstant("")
declare sDecodedBody		= gvc with protect, noconstant("")
declare idebugFlag			= i2 with protect, noconstant(0) 	;001
declare sTransId			= vc with protect, noconstant("") 	;004
declare iSeqNum				= i4 with protect, noconstant(0) 	;004
declare iTotal				= i4 with protect, noconstant(0) 	;004
declare iStorage			= i2 with protect, noconstant(0)	;004
declare sDirectory			= vc with protect, noconstant("")	;004
declare sFilename			= vc with protect, noconstant("")	;004
declare dAuthorId			= f8 with protect, noconstant(0.0)	;010
declare dCosignerId			= f8 with protect, noconstant(0.0)	;010
declare qDictatedDttm		= dq8 with protect, noconstant(0)	;010
declare qTranscribedDttm	= dq8 with protect, noconstant(0)	;010
declare qDocumentDttm		= dq8 with protect, noconstant(0)	;010
declare sExternalDocId		= vc with protect, noconstant("")	;011
declare dContributorSystemCd = f8 with protect, noconstant(0.0) ;013
declare now_dt_tm			= dq8 with protect, noconstant(0)
 
; Other
declare iTimeZone			= i4 with protect, noconstant(CURTIMEZONEAPP)	;009
declare iAuthenticFlag		= i2 with protect, noconstant(0)
declare cvbeginatr ((p_app_nbr = i4 ) ,(p_task_nbr = i4 ) ,(p_step_nbr = i4 ) ) = i4 WITH protect
declare cvperformatr (null ) 	= i4 WITH protect
declare cvendatr (null )		= null WITH protect
declare hce 					= i4 WITH protect
declare hce2 					= i4 WITH protect
declare hprsnl 					= i4 WITH protect
declare hce_type 				= i4 WITH protect
declare hce_struct 				= i4 WITH protect
declare hblob 					= i4 WITH protect
declare hblob2 					= i4 WITH protect
declare hstatus 				= i4 WITH protect
declare hrb_list 				= i4 WITH protect
declare hrb 					= i4 WITH protect
declare rb_cnt 					= i4 WITH protect
declare rb_idx 					= i4 WITH protect
declare g_event_id 				= f8 WITH protect
declare g_parent_event_id 		= f8 WITH protect
declare note_size 				= i4 WITH protect ,noconstant(0 )
 
; Constants
declare UTCmode						= i2 with protect, constant(CURUTC)
declare c_encntr_alias_type_cd		= f8 with protect, constant (uar_get_code_by("MEANING",319,"FIN NBR"))
declare c_event_class_doc 			= f8 with protect ,constant (uar_get_code_by ("MEANING" ,53 ,"DOC" ) )
declare c_event_class_mdoc 			= f8 with protect ,constant (uar_get_code_by ("MEANING" ,53 ,"MDOC" ) )
declare c_succession_interim 		= f8 with protect ,constant (uar_get_code_by ("MEANING" ,63 ,"INTERIM") )
declare c_succession_final 			= f8 with protect ,constant (uar_get_code_by ("MEANING" ,63 ,"FINAL") )
declare c_format_rtf 				= f8 with protect ,constant (uar_get_code_by ("MEANING" ,23 ,"RTF" ) )
declare c_storage_blob 				= f8 with protect ,constant (uar_get_code_by ("MEANING" ,25 ,"BLOB" ) )
declare c_action_type_perform 		= f8 with protect ,constant (uar_get_code_by ("MEANING" ,21 ,"PERFORM" ) )  ;002
declare c_action_type_verify 		= f8 with protect ,constant (uar_get_code_by ("MEANING" ,21 ,"VERIFY" ) )    ;002
declare c_action_type_sign 			= f8 with protect ,constant (uar_get_code_by ("MEANING" ,21 ,"SIGN" ) )
declare c_action_type_cosign 		= f8 with protect ,constant (uar_get_code_by ("MEANING" ,21 ,"COSIGN" ) ) ;010
declare c_action_type_modify 		= f8 with protect ,constant (uar_get_code_by ("MEANING" ,21 ,"MODIFY" ) ) ;004
declare c_action_type_transcribe 	= f8 with protect ,constant (uar_get_code_by ("MEANING" ,21 ,"TRANSCRIBE" ) ) ;010
declare c_action_status_completed 	= f8 with protect ,constant (uar_get_code_by ("MEANING" ,103 ,"COMPLETED" ) )
declare c_action_status_pending 	= f8 with protect ,constant (uar_get_code_by ("MEANING" ,103 ,"PENDING" ) )
declare c_root_reltn_cd 			= f8 with protect ,constant (uar_get_code_by ("MEANING" ,24 ,"ROOT" ) )
declare c_child_reltn_cd 			= f8 with protect ,constant (uar_get_code_by ("MEANING" ,24 ,"CHILD" ) )
declare c_entry_mode_cd 			= f8 with protect ,constant (uar_get_code_by ("MEANING" ,29520 ,"UNDEFINED" ) ) ;004
declare c_compression_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",23,"PAPER")) ;004
declare c_activity_type_cd			= f8 with protect, constant(uar_get_code_by("MEANING",106,"CLINDOC")) ;004
declare c_activity_subtype_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",5801,"TRANSCRIPT")) ;004
 
declare c2_note_type_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",14,"SIGN LINE")) ;004
declare c2_note_format_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",23,"AH")) ;004
declare c2_entry_method_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",13,"UNKNOWN")) ;004
declare c2_compression_cd			= f8 with protect, constant(uar_get_code_by("MEANING",120,"NOCOMP")) ;004
 
declare c_endorsements_task_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",6026,"ENDORSE")) ;013
declare c_pending_task_status_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",79,"PENDING")) ;013
declare c_saveddoc_task_activity_cd	= f8 with protect, constant(uar_get_code_by("MEANING",6027,"SAVED DOC")) ;013
declare c_signresult_task_activity_cd	= f8 with protect, constant(uar_get_code_by("MEANING",6027,"SIGN RESULT")) ;013
 
declare applicationid 				= i4 WITH constant (1000012 ) ,protect
declare taskid 						= i4 WITH constant (1000012 ) ,protect
declare requestid 					= i4 WITH constant (1000012 ) ,protect
 
/*************************************************************************
;INCLUDES
**************************************************************************/
;003 %i ccluserdir:snsro_common.inc
execute snsro_common
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
set sUserName						= trim($USERNAME, 3)
set sPatientId 						= trim($PERSON_ID,3)
set dPatientIdType					= cnvtreal($PAT_ID_TYPE) ;011
set dEncounterId					= cnvtreal($ENCNTR_ID)
set sEncntrAlias					= trim($ENC_ALIAS,3)
set dUserId							= GetPrsnlIDfromUserName(sUserName) ;004 defined in snsro_common
set reqinfo->updt_id				= dUserId 	;008
set sPrsnlName						= GetNameFromPrsnlID(dUserId)  ;004 defined in snsro_common
set dDocType						= cnvtreal($DOC_TYPE)
set dDocFormat						= cnvtreal($DOC_FORMAT)
set sDocSubject						= trim($DOC_SUBJECT, 3)
set dDocStatus						= cnvtreal($DOC_STATUS) ;004
set sDocBody						= trim($DOC_BODY, 3)
set idebugFlag						= cnvtint($DEBUG_FLAG)  ;001
set sExternalDocId					= trim($EXT_DOC_ID,3) ;011
set dContributorSystemCd			= cnvtreal($CONTRIB_SYS)
;010 start
set qDocumentDttm					= GetDateTime(trim($DOC_DATE,3))
set qDictatedDttm					= GetDateTime(trim($DICTATED_DT,3))
set qTranscribedDttm				= GetDateTime(trim($TRANSCRIBED_DT,3))
set now_dt_tm						= GetDateTime("")
 
if(trim($AUTHOR,3) > " ")
	set dAuthorId					= GetPrsnlIDfromUserName(trim($AUTHOR,3))
else
	set dAuthorId					= dUserId
endif
if(trim($COSIGNER,3) > " ")
	set dCosignerId					= GetPrsnlIDfromUserName(trim($COSIGNER,3))
endif
 ;010 end
;004 Start
set sTransId						= trim($TRANS_ID,3)
set iSeqNum							= cnvtint($SEQ_NUM)
set iTotal							= cnvtint($TOTAL)
set iStorage						= cnvtint($STOR_TYPE)
set sDirectory						= trim($DIR)
set sFilename						= build2("snsro_",sTransId,".dat")
if(iStorage = 1)
	if(sDirectory > " ")
		set sDirectory = logical(sDirectory)
	else
		set sDirectory = logical("ccluserdir")
	endif
else
	set iStorage = 2 ;007 Make custom table the default storage option if not defined
endif
;004 End
 
SET reply->status_data.status = "F"
 
if(idebugFlag > 0)
	call echo(build("sPatientId -> ",sPatientId))
	call echo(build("dPatientIdType -> ",dPatientIdType))
	call echo(build("dEncounterId -> ",dEncounterId))
	call echo(build("sEncntrAlias -> ",sEncntrAlias))
	call echo(build("dDocType -> ", dDocType))
	call echo(build("dDocFormat -> ", dDocFormat))
	call echo(build("sDocSubject -> ", sDocSubject))
	call echo(build("debug flag -> ", idebugFlag))
	call echo(build("dDocStatus -> ",dDocStatus)) ;004
	call echo(build("sDocBody -> ", sDocBody))
	call echo(build("sDecodedBody -> ",sDecodedBody))
	call echo(build("sUserName -> ",sUserName))
	call echo(build("sTransId -> ",sTransId))
	call echo(build("iSeqNum -> ",iSeqNum))
	call echo(build("iTotal -> ",iTotal))
	call echo(build("iStorage -> ",iStorage))
	call echo(build("sDirectory -> ",sDirectory))
	call echo(build("sExternalDocId -> ",sExternalDocId))
	call echo(build("qDocumentDttm -> ",qDocumentDttm))
	call echo(build("qDictatedDttm -> ",qDictatedDttm))
	call echo(build("qTranscribedDttm -> ",qTranscribedDttm))
	call echo(build("now_dt_tm -> ",now_dt_tm))
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare BuildBinary(action = vc) 	= i4 with protect 	;004
declare RetrieveBinary(null)		= i4 with protect 	;004
declare VerifyPrivs(null)			= i4 with protect  	;004 - 680501 MSVC_CheckPrivileges
declare GetTimezone(null)			= i4 with protect 	;004 - 100190 PM_GET_ENCNTR_LOC_TZ
declare GetSigLine(null)			= i4 with protect 	;004 - 3200246 msvc_svr_get_signature_line
declare PostDocument(null)			= null with protect
declare CreateSignTask(null)			= null with protect 	;013 560300 DCP Add Task
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
;Validate PatientId exists
if(sPatientId <= " ")
	call ErrorHandler2("POST DOCUMENT", "F", "Invalid URI Parameters", "Missing required field: Person ID.",
	"2055", "Missing required field: Person ID", document_reply_out)
	go to EXIT_SCRIPT
endif
 
;Validate dates are not in the future
if(qDocumentDttm > sysdate or qTranscribedDttm > sysdate or qDictatedDttm > sysdate)
	call ErrorHandler2("POST DOCUMENT", "F", "ValidateDates", "Invalid dates provided. ",
	"9999",build2("Invalid dates provided."), document_reply_out)
	go to exit_script
endif
 
;Validate PatientIdType and retrieve person_id
if(dPatientIdType > 0)
	; Vaidate PatientIdType is a proper code
	set iRet = GetCodeSet(dPatientIdType)
	if(iRet != 4)
		call ErrorHandler2("POST DOCUMENT", "F", "Validate", "Invalid PatientIdType. ",
		"2045",build2("Invalid PatientIdType."), document_reply_out)
		go to exit_script
	endif
 
	;Get Person Id from alias
	set dPatientId = GetPersonIdByAlias(sPatientId,dPatientIdType)
	if(dPatientId = 0)
		call ErrorHandler2("POST DOCUMENT", "F", "Validate", "Invalid PatientId.",
		"2003",build2("Invalid PatientId."), document_reply_out)
		go to exit_script
	endif
else
	set dPatientId = cnvtreal(sPatientId)
endif
 
if(idebugFlag > 0)
	call echo(build("dPatientId -> ",dPatientId))
endif
 
; Validate username
set iRet = PopulateAudit(sUserName, dPatientId, document_reply_out, sVersion)
if(iRet = 0)
  	  call ErrorHandler2("POST DOCUMENT", "F", "User is invalid", "Invalid User for Audit.",
  	  "1001",build("Invalid user: ",sUserName), document_reply_out)
  	  go to exit_script
endif
 
;Retrieve EncounterId from Alias
if(dEncounterId = 0 and sEncntrAlias > " ")
	set dEncounterId = GetEncntrIdByAlias(sEncntrAlias,c_encntr_alias_type_cd)
	if(dEncounterId = 0)
		call ErrorHandler2("POST DOCUMENT", "F", "ValidateEncntrAlias", "Invalid EncounterAlias.",
		"2084",build2("Invalid EncounterAlias."), document_reply_out)
		go to exit_script
	endif
endif
 
;Validate EncounterId goes with PatientId ;011
if(dEncounterId > 0)
	set iRet = ValidateEncntrPatientReltn(dPatientId,dEncounterId)
	if(iRet = 0)
		call ErrorHandler2("POST DOCUMENT", "F", "Validate", "EncounterId does not link to PatientId.",
		"9999","EncounterId does not link to PatientId.", document_reply_out)
		go to exit_script
	endif
 
	if(idebugFlag > 0)
		call echo(build("dEncounterId -> ",dEncounterId))
	endif
endif
 
; Validate Doc Type ;004
set iRet = GetCodeSet(dDocType)
if(iRet != 72)
	call ErrorHandler2("POST DOCUMENT", "F", "ValidateDocTypeCode", "Invalid Doc Type Code",
	"9999",build2("Invalid Doc Type Code: ",dDocStatus), document_reply_out)
	go to exit_script
endif
 
; Validate Doc Status Code ;004
set iRet = GetCodeSet(dDocStatus)
if(iRet != 8)
	call ErrorHandler2("POST DOCUMENT", "F", "ValidateDocStatusCode", "Invalid Doc Status Code",
	"9999",build2("Invalid Doc Status Code: ",dDocStatus), document_reply_out)
	go to exit_script
else
	set sDocStatus = uar_get_code_display(dDocStatus)
	set sDocStatusMean = uar_get_code_meaning(dDocStatus)
endif
 
;Validate Doc Status is Valid
if(dAuthorId = dUserId) ;010
	if(sDocStatusMean not in ("IN PROGRESS","AUTH"))
		call ErrorHandler2("POST DOCUMENT", "F", "ValidateDocStatus", "Ineligible doc status code",
		"9999",build2("The only valid document statuses are 'IN PROGRESS' or 'AUTH': ",sDocStatusMean), document_reply_out)
		go to exit_script
	endif
else
	if(sDocStatusMean not in ("TRANSCRIBED","IN PROGRESS"))
		call ErrorHandler2("POST DOCUMENT", "F", "ValidateDocStatus", "Ineligible doc status code - user is not the author.",
		"9999",build2("The user is not the author and only valid statuses are 'TRANSCRIBED' or 'IN PROGRESS': ",
		sDocStatusMean), document_reply_out)
		go to exit_script
	endif
endif
 
; Validate doc format code ;004
if(dDocFormat > 0)
	set iRet = GetCodeSet(dDocFormat)
	if(iRet != 23)
		call ErrorHandler2("POST DOCUMENT", "F", "ValidateDocFormat", "Invalid Doc Format Code",
		"9999",build2("Invalid Doc Format Code: ",dDocFormat), document_reply_out)
		go to exit_script
	endif
else
	set dDocFormat = c_format_rtf
endif
 
; Validate ContributorSystem if provided, set default
if(dContributorSystemCd > 0)
	set iRet = GetCodeSet(dContributorSystemCd)
	if(iRet != 89)
		call ErrorHandler2("POST DOCUMENT", "F", "ValidateContribSystem", "Invalid ServiceDepartmentId.",
		"9999",build2("Invalid ServiceDepartmentId: ",dContributorSystemCd), document_reply_out)
		go to exit_script
	endif
 
	; External Doc Id required when contrib system provided.
	if(sExternalDocId <= " ")
		call ErrorHandler2("POST DOCUMENT", "F", "ExternalDocId", build2("An ExternalDocumentId is required when a ServiceDepartmentId ",
		"is provided."),"9999",
		build2("An ExternalDocumentId is required when a ServiceDepartmentId is provided."), document_reply_out)
		go to exit_script
	endif
else
	set dContributorSystemCd = reqdata->contributor_system_cd
endif
 
;Validate external doc id doesn't already exist
if(sExternalDocId > " ")
	set check = 0
	select into "nl:"
	from clinical_event ce
	where ce.reference_nbr = sExternalDocId
	detail
		check = 1
	with nocounter
 
	if(check > 0)
		call ErrorHandler2("POST DOCUMENT", "F", "Validate",
		build2("The ExternalDocumentId provided is linked to another document. Please provide a unique ExternalDocumentId."),"9999",
		build2("The ExternalDocumentId provided is linked to another document. Please provide a unique ExternalDocumentId.")
		, document_reply_out)
		go to exit_script
	endif
endif
 
; If the binary data is greater than 65K, then Emissary will send a total greater than 1.
; If the total is greater than 1, then the buildbinary process is invoked
if(iTotal > 1)
	if(iSeqNum = iTotal)
		set iRet = BuildBinary("ADD")
		if(iRet = 0)
	  	  call ErrorHandler2("POST DOCUMENT", "F", "BuildBinary", "Binary Build Failed",
	  	  "9999",build("Operating system returned error ",binary_rep->status), document_reply_out)
	  	  go to exit_script
		endif
 
		call RetrieveBinary(null)
		call BuildBinary("DELETE")
 
	else
		set iRet = BuildBinary("ADD")
		if(iRet = 0)
	  	  call ErrorHandler2("POST DOCUMENT", "F", "BuildBinary", "Binary Build Failed",
	  	  "9999",build("Operating system returned error ",binary_rep->status), document_reply_out)
	  	  go to exit_script
		 endif
 
		call ErrorHandler2("POST DOCUMENT", "S", "Building Binary", "Added Binary data and waiting for remainder",
		"0000", build2("Sequence ",iSeqNum, " of ",iTotal," processed"), document_reply_out)
		go to EXIT_SCRIPT
	endif
endif
 
; Validate Doc Body is not empty and base64 encoded 	;005
if(sDocBody > " ")
	set iRet = operator(sDocBody,"REGEXPLIKE","^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$")
	if(iRet = 0)
		call ErrorHandler2("POST DOCUMENT", "F", "ValidateBase64", "Invalid document body. Text is not proper base64 format.",
		"9999","Invalid document body. Text is not proper base64 format.", document_reply_out)
		go to exit_script
	else
		; Decode base64
		set sDecodedBody = base64_decode(sDocBody)
	endif
else
	call ErrorHandler2("POST DOCUMENT", "F", "ValidateDocBody", "Missing document body",
	"2055","Missing document body.", document_reply_out)
	go to exit_script
endif
 
; Verify privileges. ;004
set iRet = VerifyPrivs(null)
if(iRet = 0)
	call ErrorHandler2("POST DOCUMENT", "F", "VerifyPrivs", "User does not have privileges to create document",
	"9999",build2("User does not have privileges for status ",sDocStatusMean), document_reply_out)
	go to exit_script
endif
 
; Get the timezone for the encounter ;004
if(dEncounterId > 0)
	set iRet = GetTimezone(null)
	if(iRet = 0)
		call ErrorHandler2("POST DOCUMENT", "F", "GetTimezone", "Could not retrieve timezone",
		"9999","Could not retrieve timezone", document_reply_out)
		go to exit_script
	endif
endif
 
; Execute Server calls
EXECUTE crmrtl
EXECUTE srvrtl
 
; Add the document
call PostDocument(null)
 
; Create a task for all signers if not already created
call CreateSignTask(null)
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(document_reply_out)
if(idebugFlag > 0)
	call echorecord(document_reply_out)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_add_document.json")
	call echo(build2("_file : ", _file))
	call echojson(document_reply_out, _file, 0)
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
;  Name: BuildBinary(null)
;  Description:  Build binary data and store to file or custom table
**************************************************************************/
subroutine BuildBinary(action)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("BuildBinary Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set binary_req->user_id = dUserId
	set binary_req->transaction_id = sTransId
	set binary_req->sequence = iSeqNum
	set binary_req->total = iTotal
	set binary_req->storage = iStorage
	set binary_req->action = action
	set binary_req->filename = sFilename
	set binary_req->directory = sDirectory
	set binary_req->binary = sDocBody
	set binary_req->debug_flag = idebugFlag
 
	execute snsro_add_binary "" with replace(REQUEST,binary_req), replace (REPLY,binary_rep)
 
	set iValidate = 1
	if(binary_rep->status_data.status = "F")
		set iValidate = 0
	endif
 
	if(idebugFlag > 0)
		call echo(concat("BuildBinary Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
end ;End Subroutine
 
/*************************************************************************
;  Name: RetrieveBinary(null)
;  Description:  Retrieve binary data from file or table
**************************************************************************/
subroutine RetrieveBinary(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("RetrieveBinary Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare data = gvc
	set data = ""
 
	if(iStorage = 1) ;Store to File
		free record frec
		record frec (
		     1 FILE_DESC = I4
		     1 FILE_OFFSET = I4
		     1 FILE_DIR = I4
		     1 FILE_NAME = VC
		     1 FILE_BUF = gvc
		   )
 
		declare buff_array = vc
		declare len = i4
		set frec->file_name = build2(sDirectory,"/",sFilename)
 
		; Open File in read mode
		set frec->file_buf = "r"
		set stat = cclio("OPEN",frec)
 
		; Go position of end of file
		set frec->file_dir = 2
		set stat = cclio("SEEK",frec)
 
		; Get size of file
		set len = cclio("TELL",frec)
		call echo(build("len = ",len))
 
		; Put the pointer back to beginning of file
		set frec->file_dir = 0
		set stat = cclio("SEEK",frec)
 
 		; Set buffer size to size of file
		set stat = memrealloc(buff_array,1,build("C",len))
		set frec->file_buf = notrim(buff_array)
 
		; Read file contents and store in buffer
		set stat = cclio("READ",frec)
 
		; Set sDocBody to buffer
		set data = trim(frec->file_buf,3)
		call echorecord(frec,"snsro_add_document_test")
 
		; Close the file
		set stat = cclio("CLOSE",frec)
 
	else ;Store to Table
		select into "nl:"
		from cust_snsro_binary csb
		where csb.trans_id = sTransId
		order by csb.sequence
		detail
			data = build(data,trim(csb.binary,3))
		with nocounter
	endif
 
 	set sDocBody = trim(trim(data,8),3)
 
	if(idebugFlag > 0)
		call echo(concat("RetrieveBinary Runtime: ",
         trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
         " seconds"))
	endif
end ;End Subroutine
 
/*************************************************************************
;  Name: VerifyPrivs(null)
;  Description:  Verify user has privileges to update document
**************************************************************************/
subroutine VerifyPrivs(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("VerifyPrivs Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	; Get personnel relationship to patient
	declare dPrsnlRelCd = f8
	if(dEncounterId > 0)
		select into "nl:"
		from encntr_prsnl_reltn epr
		where epr.encntr_id = dEncounterId
			and epr.prsnl_person_id = dAuthorId
		detail
			dPrsnlRelCd = epr.encntr_prsnl_r_cd
		with nocounter
	else
		select into "nl:"
		from person_prsnl_reltn ppr
		where ppr.person_id = dPatientId
			and ppr.prsnl_person_id = dAuthorId
		detail
			dPrsnlRelCd = ppr.person_prsnl_r_cd
		with nocounter
	endif
 
	set iAPPLICATION = 600005
	set iTASK = 3202004
 	set iREQUEST = 680501
 
	set 680501_req->user_id = dAuthorId
	set 680501_req->patient_user_relationship_cd = dPrsnlRelCd
	set stat = alterlist(680501_req->event_codes,1)
	set 680501_req->event_codes[1].event_cd = dDocType
 
	declare iValidate = i2
	if(sDocStatusMean in ("TRANSCRIBED","IN PROGRESS"))
		set 680501_req->event_privileges->event_code_level.add_documentation_ind = 1
		set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",680501_req,"REC",680501_rep)
		set iValidate = 680501_rep->event_privileges->add_documentation.status.success_ind
	else
		set 680501_req->event_privileges->event_code_level.sign_documentation_ind = 1
		set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",680501_req,"REC",680501_rep)
		set iValidate = 680501_rep->event_privileges->sign_documentation.status.success_ind
	endif
 
	if(idebugFlag > 0)
		call echo(concat("VerifyPrivs Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
 	return(iValidate)
end ;End Subroutine
 
/*************************************************************************
;  Name: GetTimezone(null)
;  Description:  Retrieves the timezone for the encounter
**************************************************************************/
subroutine GetTimezone(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetTimezone Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iAPPLICATION = 600005
	set iTASK = 600701
 	set iREQUEST = 100190
 
	set stat = alterlist(100190_req->encntrs,1)
	set 100190_req->encntrs[1].encntr_id = dEncounterId
 
 	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",100190_req,"REC",100190_rep)
 
 	set iValidate = 0
 	if(100190_rep->status_data->status = "S")
 		set iValidate = 1
 		set iTimeZone = 100190_rep->encntrs[1].time_zone_indx
 	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetTimezone Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
 	return(iValidate)
end ;End Subroutine
 
/*************************************************************************
;  Name: GetSigLine(prsnl_id = f8) = vc
;  Description:  Retrieves the signature line
**************************************************************************/
subroutine GetSigLine(prsnl_id)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetSigLine Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iAPPLICATION = 600005
	set iTASK = 3202004
 	set iREQUEST = 3200246
 
 	set stat = alterlist(3200246_req->signature_line_criteria,1)
 	set 3200246_req->signature_line_criteria[1].result_status_cd = dDocStatus
 	set 3200246_req->signature_line_criteria[1].type_cd = dDocType
 	set 3200246_req->signature_line_criteria[1].activity_type_cd = c_activity_type_cd
 	set 3200246_req->signature_line_criteria[1].activity_subtype_cd = c_activity_subtype_cd
 	set stat = alterlist(3200246_req->signature_line_criteria[1].personnel_actions,5)
 
 	for(i = 1 to 5)
 		set 3200246_req->signature_line_criteria[1].personnel_actions[i].action_personnel_id = prsnl_id
 		set 3200246_req->signature_line_criteria[1].personnel_actions[i].action_date = now_dt_tm
 		set 3200246_req->signature_line_criteria[1].personnel_actions[i].action_tz = iTimeZone
 
 		case(i)
 			of 1:
 				set 3200246_req->signature_line_criteria[1].personnel_actions[i].action_type_cd = c_action_type_sign
 				if(sDocStatusMean = "AUTH")
 					set 3200246_req->signature_line_criteria[1].personnel_actions[i].action_status_cd = c_action_status_completed
 				else
 					set 3200246_req->signature_line_criteria[1].personnel_actions[i].action_status_cd = c_action_status_pending
 				endif
 			of 2:
 				set 3200246_req->signature_line_criteria[1].personnel_actions[i].action_type_cd = c_action_type_perform
 				set 3200246_req->signature_line_criteria[1].personnel_actions[i].action_status_cd = c_action_status_completed
 			of 3:
 				set 3200246_req->signature_line_criteria[1].personnel_actions[i].action_type_cd = c_action_type_verify
 				if(sDocStatusMean = "AUTH")
 					set 3200246_req->signature_line_criteria[1].personnel_actions[i].action_status_cd = c_action_status_completed
 				else
 					set 3200246_req->signature_line_criteria[1].personnel_actions[i].action_status_cd = c_action_status_pending
 				endif
 			of 4:
 				set 3200246_req->signature_line_criteria[1].personnel_actions[i].action_type_cd = c_action_type_transcribe
 				set 3200246_req->signature_line_criteria[1].personnel_actions[i].action_status_cd = c_action_status_completed
 			of 5:
 				set 3200246_req->signature_line_criteria[1].personnel_actions[i].action_type_cd = c_action_type_cosign
 				set 3200246_req->signature_line_criteria[1].personnel_actions[i].action_status_cd = c_action_status_pending
 		endcase
 	endfor
 
 	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",3200246_req,"REC",3200246_rep)
 
	if(idebugFlag > 0)
		call echo(concat("GetSigLine Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
 	if(3200246_rep->transaction_status.success_ind)
 		if(size(3200246_rep->signature_lines,5) > 0)
			return(3200246_rep->signature_lines[1].text)
		else
			return("")
		endif
	else
		call ErrorHandler2("POST DOCUMENT", "F", "GetSigLine", "Could not retrieve signature line",
		"9999","Could not retrieve signature line", document_reply_out)
		go to exit_script
	endif
end ;End Subroutine
 
/*************************************************************************
;  Name: cvbeginatr (p_app_nbr ,p_task_nbr ,p_step_nbr )
;  Description:
**************************************************************************/
subroutine  cvbeginatr (p_app_nbr ,p_task_nbr ,p_step_nbr )
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("cvbeginatr Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set cv_atr->app_nbr = p_app_nbr
	set cv_atr->task_nbr = p_task_nbr
	set cv_atr->step_nbr = p_step_nbr
 
	set cv_atr->stat = uar_crmbeginapp (cv_atr->app_nbr ,cv_atr->happ )
	if ((cv_atr->stat != 0 ) )
		call ErrorHandler2("VALIDATE", "F", " uar_CrmBeginApp ", cnvtstring (cv_atr->stat ),
		"9999", build("Invalid uar_CrmBeginApp Status: ",cnvtstring (cv_atr->stat)),document_reply_out)	;003
		return (1 )
	endif
 
	set cv_atr->stat = uar_crmbegintask (cv_atr->happ ,cv_atr->task_nbr ,cv_atr->htask )
	if ((cv_atr->stat != 0 ) )
		call ErrorHandler2("VALIDATE", "F", " uar_CrmBeginTask ", cnvtstring (cv_atr->stat ),
		"9999", build("Invalid uar_CrmBeginTask: ",cnvtstring (cv_atr->htask)),document_reply_out)	;003
		return (2 )
	endif
 
	set cv_atr->stat = uar_crmbeginreq (cv_atr->htask ,"" ,cv_atr->step_nbr ,cv_atr->hstep )
	if ((cv_atr->stat != 0 ) )
		call ErrorHandler2("VALIDATE", "F", " uar_CrmBeginReq ", cnvtstring (cv_atr->stat ),
		"9999", build("Invalid uar_CrmBeginReq: ", cnvtstring(cv_atr->step_nbr)), document_reply_out)	;003
		return (3 )
	endif
 
	set cv_atr->hrequest = uar_crmgetrequest (cv_atr->hstep )
	if ((cv_atr->hrequest = 0 ) )
		call ErrorHandler2("VALIDATE", "F", " UAR_CrmGetRequest ", "Failed to allocate hrequest" ,
		"9999", "Invalid uar_CrmBeginRequest: Failed to allocate hrequest", document_reply_out)	;003
		return (4 )
	endif
 
	if(idebugFlag > 0)
		call echo( "CvBeginAtr completed successfully" )
		call echo(concat("cvbeginatr Runtime: ",
        trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
        " seconds"))
	endif
 
	return (0)
end ;Subroutine
 
/*************************************************************************
;  Name: cvperformatr (null )
;  Description:
**************************************************************************/
subroutine  cvperformatr (null )
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("cvperformatr Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set cv_atr->stat = uar_crmperform (cv_atr->hstep )
	if ((cv_atr->stat != 0 ) )
		call ErrorHandler2("VALIDATE", "F", " uar_CrmPerform ", cnvtstring (cv_atr->stat ),
		"9999", build("Invalid uar_CrmPerform: ", cnvtstring(cv_atr->stat)), document_reply_out)	;003
		return (1 )
	endif
	set cv_atr->hreply = uar_crmgetreply (cv_atr->hstep )
	if ((cv_atr->hreply = 0 ) )
		call ErrorHandler2("VALIDATE", "F", " uar_CrmGetReply ", "Failed to allocate hReply",
		"9999", "Failed to allocate hReply.", document_reply_out)	;003
		return (2 )
	endif
 
	if(idebugFlag > 0)
		call echo( "cvperformatr completed succesfully" )
		call echo(concat("cvbeginatr Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
 
	return (0 )
end ;subroutine
 
/*************************************************************************
;  Name:  cvendatr (null )
;  Description:
**************************************************************************/
subroutine  cvendatr (null )
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("cvendatr Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	if (cv_atr->hstep )
		call uar_crmendreq (cv_atr->hstep )
	endif
	if (cv_atr->htask )
		call uar_crmendtask (cv_atr->htask )
	endif
	if (cv_atr->happ )
		call uar_crmendapp (cv_atr->happ )
	endif
	set stat = initrec (cv_atr )
 
	if(idebugFlag > 0)
		call echo(concat("cvendatr Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
end ;Subroutine
 
/*************************************************************************
;  Name: PostDocument(null)
;  Description: Post the Document to CE
**************************************************************************/
subroutine PostDocument(null)
	 if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostDocument Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	 endif
 
	  declare OutBuffer     = vc with private, noconstant("")
	  set OutBuffer =  sDecodedBody
	  set  note_size = textlen(trim(outBuffer,3))
 
	 IF ((cvbeginatr (applicationid ,taskid ,requestid ) != 0 ) )
		call ErrorHandler2("VALIDATE", "F", " FApp, task, Req", "Field to Begin ATR",
		"9999", "Faild to Begin ATR.", document_reply_out)	;003
		GO TO EXIT_SCRIPT
	 ENDIF
 
	 ; Build request
	 SET stat = uar_srvsetshort (cv_atr->hrequest ,"ensure_type" ,1 )
	 SET hce = uar_srvgetstruct (cv_atr->hrequest ,"clin_event" )
 
	  if(idebugFlag > 0)
		call echo(build("hce--->", hce))
	  endif
 
	 if(sDocStatusMean = "AUTH")
	 	set iAuthenticFlag = 1
	 endif
 
	IF (hce )
		 SET stat = uar_srvsetlong (hce ,"view_level" ,1 )
		 SET stat = uar_srvsetdouble (hce ,"person_id" ,dPatientId )
		 SET stat = uar_srvsetdouble (hce ,"encntr_id" ,dEncounterId )
		 SET stat = uar_srvsetdouble (hce ,"contributor_system_cd", dContributorSystemCd) ;013
		 SET stat = uar_srvsetdouble (hce ,"parent_event_id" ,0.0 )
		 SET stat = uar_srvsetdouble (hce ,"event_class_cd" ,c_event_class_mdoc )
		 SET stat = uar_srvsetdouble (hce ,"event_cd" ,dDocType )
		 SET stat = uar_srvsetdouble (hce ,"event_reltn_cd" ,c_root_reltn_cd )
		 SET stat = uar_srvsetdouble (hce ,"record_status_cd" ,reqdata->active_status_cd )
		 SET stat = uar_srvsetdouble (hce ,"result_status_cd" , dDocStatus) ;004
		 SET stat = uar_srvsetshort (hce ,"authentic_flag" ,iAuthenticFlag )
		 SET stat = uar_srvsetshort (hce ,"publish_flag" ,1 )
		 SET stat = uar_srvsetstring (hce ,"event_title_text" ,nullterm (sDocSubject ) )
		 SET stat = uar_srvsetdouble (hce ,"performed_prsnl_id" ,dAuthorId) ;004
		 SET stat = uar_srvsetdate (hce ,"performed_dt_tm" ,qDocumentDttm ) ;010
		 SET stat = uar_srvsetlong (hce ,"performed_tz",iTimeZone)		;009
		 SET stat = uar_srvsetdate (hce ,"event_start_dt_tm" ,qDocumentDttm )
		 SET stat = uar_srvsetlong (hce ,"event_start_tz",iTimeZone)
		 SET stat = uar_srvsetdate (hce ,"event_end_dt_tm" ,qDocumentDttm ) ;010
		 SET stat = uar_srvsetlong (hce ,"event_end_tz",iTimeZone)		;009
		 SET stat = uar_srvsetdouble (hce ,"entry_mode_cd" ,c_entry_mode_cd) ;004
		 if(sExternalDocId > " ")
		 	SET stat = uar_srvsetstring(hce,"reference_nbr",nullterm(sExternalDocId)) ;011
		 	SET stat = uar_srvsetstring(hce,"series_ref_nbr",nullterm(sExternalDocId)) ;011
		 endif
 
		 ;004 start
		 declare ePrsnlSize = i2
		 declare sMsgTxt = vc
 
		if(dAuthorId = dUserId)	;010
			if(sDocStatusMean = "IN PROGRESS")
				set ePrsnlSize = 2
			else
				set ePrsnlSize = 3
			endif
		else
				set ePrsnlSize = 3
		endif
 
		if(dCosignerId > 0)	;010
			set ePrsnlSize = ePrsnlSize + 1
		endif
 
		 for(i = 1 to ePrsnlSize )
			SET hprsnl = uar_srvadditem (hce ,"event_prsnl_list" )
			IF (hprsnl )
				SET stat = uar_srvsetdouble (hprsnl ,"person_id" ,dPatientId )
 
				if(sDocStatusMean in ("IN PROGRESS","TRANSCRIBED"))
					case(i)
						of 1:
							SET stat = uar_srvsetdouble (hprsnl ,"action_prsnl_id" ,dAuthorId)
							SET stat = uar_srvsetdate (hprsnl ,"action_dt_tm" ,qDictatedDttm )
							SET stat = uar_srvsetlong(hprsnl,"action_tz",iTimeZone)
							SET stat = uar_srvsetdouble (hprsnl ,"action_type_cd" ,c_action_type_perform )
							SET stat = uar_srvsetdouble (hprsnl ,"action_status_cd" ,c_action_status_completed )
							set sMsgTxt = "Perform"
						of 2:
							SET stat = uar_srvsetdouble (hprsnl ,"action_prsnl_id" ,dAuthorId)
							SET stat = uar_srvsetdate (hprsnl ,"action_dt_tm" ,now_dt_tm )
							SET stat = uar_srvsetlong(hprsnl,"action_tz",iTimeZone)
							SET stat = uar_srvsetdouble (hprsnl ,"action_type_cd" ,c_action_type_sign )
							SET stat = uar_srvsetdouble (hprsnl ,"action_status_cd" ,c_action_status_pending )
							SET stat = uar_srvsetdouble (hprsnl ,"request_prsnl_id" ,dUserId)
							SET stat = uar_srvsetdate (hprsnl ,"request_dt_tm" ,now_dt_tm )
							SET stat = uar_srvsetlong(hprsnl,"request_tz",iTimeZone)
							set sMsgTxt = "Sign"
						of 3: ;010
							if(dAuthorId != dUserId)
								SET stat = uar_srvsetdouble (hprsnl ,"action_prsnl_id" ,dUserId)
								SET stat = uar_srvsetdate (hprsnl ,"action_dt_tm" ,qTranscribedDttm )
								SET stat = uar_srvsetlong(hprsnl,"action_tz",iTimeZone)
								SET stat = uar_srvsetdouble (hprsnl ,"action_type_cd" ,c_action_type_transcribe)
								SET stat = uar_srvsetdouble (hprsnl ,"action_status_cd" ,c_action_status_completed )
								set sMsgTxt = "Transcribe"
							else
								SET stat = uar_srvsetdouble (hprsnl ,"action_prsnl_id" ,dCosignerId)
								SET stat = uar_srvsetdate (hprsnl ,"action_dt_tm" ,now_dt_tm )
								SET stat = uar_srvsetlong(hprsnl,"action_tz",iTimeZone)
								SET stat = uar_srvsetdouble (hprsnl ,"action_type_cd" ,c_action_type_sign )
								SET stat = uar_srvsetdouble (hprsnl ,"action_status_cd" ,c_action_status_pending )
								SET stat = uar_srvsetdate (hprsnl ,"request_dt_tm" ,now_dt_tm )
								SET stat = uar_srvsetlong(hprsnl,"request_tz",iTimeZone)
								SET stat = uar_srvsetdouble (hprsnl ,"request_prsnl_id" ,dUserId)
								set sMsgTxt = "Cosign"
							endif
 
						of 4: ;010
							SET stat = uar_srvsetdouble (hprsnl ,"action_prsnl_id" ,dCosignerId)
							SET stat = uar_srvsetdate (hprsnl ,"action_dt_tm" ,now_dt_tm )
							SET stat = uar_srvsetlong(hprsnl,"action_tz",iTimeZone)
							SET stat = uar_srvsetdouble (hprsnl ,"action_type_cd" ,c_action_type_sign )
							SET stat = uar_srvsetdouble (hprsnl ,"action_status_cd" ,c_action_status_pending )
							SET stat = uar_srvsetdate (hprsnl ,"request_dt_tm" ,now_dt_tm )
							SET stat = uar_srvsetlong(hprsnl,"request_tz",iTimeZone)
							SET stat = uar_srvsetdouble (hprsnl ,"request_prsnl_id" ,dUserId)
							set sMsgTxt = "Cosign"
					endcase
				else
					case(i)
						of 1:
							SET stat = uar_srvsetdouble (hprsnl ,"action_prsnl_id" ,dAuthorId)
							SET stat = uar_srvsetdate (hprsnl ,"action_dt_tm" ,qDictatedDttm )
							SET stat = uar_srvsetlong(hprsnl,"action_tz",iTimeZone)
							SET stat = uar_srvsetdouble (hprsnl ,"action_type_cd" ,c_action_type_perform )
							SET stat = uar_srvsetdouble (hprsnl ,"action_status_cd" ,c_action_status_completed )
							set sMsgTxt = "Perform"
						of 2:
							SET stat = uar_srvsetdouble (hprsnl ,"action_prsnl_id" ,dAuthorId)
							SET stat = uar_srvsetdate (hprsnl ,"action_dt_tm" ,now_dt_tm )
							SET stat = uar_srvsetlong(hprsnl,"action_tz",iTimeZone)
							SET stat = uar_srvsetdouble (hprsnl ,"action_type_cd" ,c_action_type_sign )
							SET stat = uar_srvsetdouble (hprsnl ,"action_status_cd" ,c_action_status_completed)
							set sMsgTxt = "Sign"
						of 3:
							SET stat = uar_srvsetdouble (hprsnl ,"action_prsnl_id" ,dAuthorId)
							SET stat = uar_srvsetdate (hprsnl ,"action_dt_tm" ,now_dt_tm )
							SET stat = uar_srvsetlong(hprsnl,"action_tz",iTimeZone)
							SET stat = uar_srvsetdouble (hprsnl ,"action_type_cd" ,c_action_type_verify )
							SET stat = uar_srvsetdouble (hprsnl ,"action_status_cd" ,c_action_status_completed )
							set sMsgTxt = "Modify"
						of 4: ;010
							SET stat = uar_srvsetdouble (hprsnl ,"action_prsnl_id" ,dCosignerId)
							SET stat = uar_srvsetdate (hprsnl ,"action_dt_tm" ,now_dt_tm )
							SET stat = uar_srvsetlong(hprsnl,"action_tz",iTimeZone)
							SET stat = uar_srvsetdouble (hprsnl ,"action_type_cd" ,c_action_type_sign )
							SET stat = uar_srvsetdouble (hprsnl ,"action_status_cd" ,c_action_status_pending )
							SET stat = uar_srvsetdate (hprsnl ,"request_dt_tm" ,now_dt_tm )
							SET stat = uar_srvsetlong(hprsnl,"request_tz",iTimeZone)
							SET stat = uar_srvsetdouble (hprsnl ,"request_prsnl_id" ,dUserId)
							set sMsgTxt = "Cosign"
					endcase
				endif
			  ELSE
				call ErrorHandler2("VALIDATE", "F", " UAR_SRVADDITEM ", "Failed to allocate event_prsnl_list",
				"9999", build2("Failed to allocate event_prsnl_list - ",sMsgTxt), document_reply_out)
				GO TO EXIT_SCRIPT
			  ENDIF
		  endfor
		  ; 004 end
 
		  SET hce_type = uar_srvcreatetypefrom (cv_atr->hrequest ,"clin_event" )
		  if(idebugFlag > 0)
			call echo(build("hCE_Type--->", hce_type))
		  endif
 
		  SET hce_struct = uar_srvgetstruct (cv_atr->hrequest ,"clin_event" )
		  if(idebugFlag > 0)
			call echo(build("hCE_Struct--->", hce_struct))
		  endif
 
		  SET stat = uar_srvbinditemtype (hce_struct ,"child_event_list" ,hce_type )
		  SET hce2 = uar_srvadditem (hce_struct ,"child_event_list" )
 
		  if(idebugFlag > 0)
			call echo(build("hCE2--->", hce2))
		  endif
 
		  IF (hce2 )
			CALL uar_srvbinditemtype (hce2 ,"child_event_list" ,hce_type )
 
			SET stat = uar_srvsetdouble (hce2 ,"person_id" ,dPatientId )
			SET stat = uar_srvsetdouble (hce2 ,"encntr_id" ,dEncounterId )
			SET stat = uar_srvsetdouble (hce2 ,"contributor_system_cd" ,dContributorSystemCd ) ;013
			SET stat = uar_srvsetdouble (hce2 ,"event_class_cd" ,c_event_class_doc )
			SET stat = uar_srvsetdouble (hce2 ,"event_cd" ,dDocType )
			SET stat = uar_srvsetdouble (hce2 ,"event_reltn_cd" ,c_child_reltn_cd )
			SET stat = uar_srvsetdouble (hce2 ,"record_status_cd" ,reqdata->active_status_cd )
			SET stat = uar_srvsetdouble (hce2 ,"result_status_cd" ,dDocStatus) ;004
			SET stat = uar_srvsetstring (hce2 ,"collating_seq" ,"1" )
			SET stat = uar_srvsetlong (hce2 ,"view_level" ,0 )
			SET stat = uar_srvsetshort (hce2 ,"authentic_flag" ,iAuthenticFlag )
			SET stat = uar_srvsetshort (hce2 ,"publish_flag" ,1 )
			SET stat = uar_srvsetdouble (hce2 ,"performed_prsnl_id" ,dAuthorId) ;004
			SET stat = uar_srvsetdate (hce2 ,"performed_dt_tm" ,qDocumentDttm ) ;010
			SET stat = uar_srvsetlong (hce2 ,"performed_tz",iTimeZone)		;009
			SET stat = uar_srvsetdate (hce2 ,"event_start_dt_tm" ,qDocumentDttm )
			SET stat = uar_srvsetlong (hce2 ,"event_start_tz",iTimeZone)
			SET stat = uar_srvsetdate (hce2 ,"event_end_dt_tm" ,qDocumentDttm ) ;010
			SET stat = uar_srvsetlong (hce2 ,"event_end_tz",iTimeZone)		;009
			SET stat = uar_srvsetdouble (hce2 ,"entry_mode_cd" ,c_entry_mode_cd) ;004
			if(sExternalDocId > " ")
				SET stat = uar_srvsetstring(hce2,"reference_nbr",nullterm(concat(sExternalDocId,"10"))) ;011
		 		SET stat = uar_srvsetstring(hce2,"series_ref_nbr",nullterm(concat(sExternalDocId,"10"))) ;011
		 	endif
 
			SET hblob = uar_srvadditem (hce2 ,"blob_result" )
			IF (hblob )
				if(sDocStatusMean in ("TRANSCRIBE","IN PROGRESS")) ;004
					SET stat = uar_srvsetdouble (hblob ,"succession_type_cd" ,c_succession_interim)
				else
					SET stat = uar_srvsetdouble (hblob ,"succession_type_cd" ,c_succession_final)
				endif
 
				SET stat = uar_srvsetdouble (hblob ,"storage_cd" ,c_storage_blob )
				SET stat = uar_srvsetdouble (hblob ,"format_cd" ,dDocFormat)
				SET hblob2 = uar_srvadditem (hblob ,"blob" )
 
			IF (hblob2 )
				if(idebugFlag > 0)
					call echo(build(" outBuffer -->", outBuffer))
				endif
				SET stat = uar_srvsetasis (hblob2 ,"blob_contents" ,outBuffer,note_size )
				SET stat = uar_srvsetshort (hblob2 ,"valid_from_dt_tm_ind" ,1 ) ;004
				SET stat = uar_srvsetshort (hblob2 ,"valid_until_dt_tm_ind" ,1 ) ;004
				SET stat = uar_srvsetlong (hblob2 ,"blob_length" ,note_size ) ;004
			ELSE
				call ErrorHandler2("VALIDATE", "F", " UAR_SRVADDITEM ", "Failed to allocate blob",
				"9999", "Failed to allocate blob - blob_contents", document_reply_out) ;003
				GO TO EXIT_SCRIPT
			ENDIF
 
			ELSE
			  call ErrorHandler2("VALIDATE", "F", " UAR_SRVADDITEM ", "Failed to allocate blob",
			  "9999", "Failed to allocate blob - blob_result", document_reply_out) ;003
			  GO TO EXIT_SCRIPT
			ENDIF
 
			;Add Author signature line if it exists.
			declare sAuthorSigLine = vc
			set sAuthorSigLine = GetSigLine(dAuthorId)
 
			if(dCosignerId > 0)
				declare sCosignSigLine = vc
				set sCosignSigLine = GetSigLine(dCosignerId)
				set sAuthorSigLine = build2(sAuthorSigLine,sCosignSigLine)
			endif
 
			if(trim(sAuthorSigLine,3) > " ")
				SET henote = uar_srvadditem (hce2 ,"event_note_list" )
				IF (henote )
					SET stat = uar_srvsetdouble (henote ,"note_type_cd" ,c2_note_type_cd)
					SET stat = uar_srvsetdouble (henote ,"note_format_cd" ,c2_note_format_cd)
					SET stat = uar_srvsetdouble (henote ,"entry_method_cd" ,c2_entry_method_cd)
					SET stat = uar_srvsetdouble (henote ,"note_prsnl_id", dAuthorId)
					SET stat = uar_srvsetdate (henote ,"note_dt_tm" ,now_dt_tm)
					SET stat = uar_srvsetdouble (henote ,"record_status_cd" ,dDocStatus)
					SET stat = uar_srvsetdouble (henote ,"compression_cd" , c2_compression_cd)
					set lbsize = textlen(sAuthorSigLine)
					SET stat = uar_srvsetasis (henote ,"long_blob" ,sAuthorSigLine,lbsize)
				ELSE
					call ErrorHandler2("VALIDATE", "F", " UAR_SRVADDITEM ", "Failed to allocate event_note_list",
					"9999", "Failed to allocate event_note_list", document_reply_out)
					GO TO EXIT_SCRIPT
				ENDIF
			endif
 
		   SET hprsnl2 = uar_srvadditem (hce2 ,"event_prsnl_list" )
		   IF (hprsnl2 )
			SET stat = uar_srvsetdouble (hprsnl2 ,"person_id" ,dPatientId )
			SET stat = uar_srvsetdouble (hprsnl2 ,"action_prsnl_id" ,dUserId )
			SET stat = uar_srvsetdouble (hprsnl2 ,"action_type_cd" ,c_action_type_perform ) ;004
			SET stat = uar_srvsetdouble (hprsnl2 ,"action_status_cd" ,c_action_status_completed )
			SET stat = uar_srvsetdate (hprsnl2 ,"action_dt_tm" ,now_dt_tm )
			SET stat = uar_srvsetlong(hprsnl2,"action_tz",iTimeZone)
		   ELSE
			call ErrorHandler2("VALIDATE", "F", " UAR_SRVADDITEM ", "Failed to allocate event_prsnl_list",
			"9999", "Failed to allocate event_prsnl_list - DocAction", document_reply_out)	;003
			GO TO EXIT_SCRIPT
		   ENDIF
 
		  ELSE
			call ErrorHandler2("VALIDATE", "F", " UAR_SRVADDITEM ", "Failed to allocate child_event_list",
			"9999", "Failed to allocate child_event_list", document_reply_out)	;003
			GO TO EXIT_SCRIPT
		  ENDIF
 
	 ELSE
		call ErrorHandler2("VALIDATE", "F", " UAR_SRVGETSTRUCT ", "Failed to allocate clin_event",
		"9999", "Failed to allocate clin_event", document_reply_out)	;003
		GO TO EXIT_SCRIPT
	 ENDIF
 
	 IF ((cvperformatr (null ) != 0 ) )
		GO TO EXIT_SCRIPT
	 ENDIF
 
	SET hstatus = uar_srvgetstruct (cv_atr->hreply ,"sb" )
	IF (hstatus )
		SET reply->sb_severity = uar_srvgetlong (hstatus ,"severityCd" )
		SET reply->sb_status = uar_srvgetlong (hstatus ,"statusCd" )
		SET reply->sb_statustext = uar_srvgetstringptr (hstatus ,"statusText" )
	ELSE
		call ErrorHandler2("VALIDATE", "F", " UAR_SRVGETSTRUCT ", "hStatus returned F",
		"9999", "Invalid hStatus: F", document_reply_out)	;003
		go to EXIT_SCRIPT
	ENDIF
 
	 SET rb_cnt = uar_srvgetitemcount (cv_atr->hreply ,"rb_list" )
	 IF ((rb_cnt >= 1 ) )
		 SET hrb = uar_srvgetitem (cv_atr->hreply ,"rb_list" ,1 )
		 SET document_reply_out->document_id = uar_srvgetdouble (hrb ,"parent_event_id" )
		 if(idebugFlag > 0)
			call echo(build("parent_event_id -->", document_reply_out->document_id))
		 endif
	 ELSE
		 call ErrorHandler2("VALIDATE", "F", " UAR_SRVGETSTRUCT ", "Error adding document.",
		 "9999", build2("Error adding document: ",reply->sb_statustext), document_reply_out)	;003
		 go to EXIT_SCRIPT
	 ENDIF
 
	; Transaction is successful Update status ;004
	call ErrorHandler2("POST DOCUMENT", "S", "Process completed", "Document has been created successfully",
	"0000", build2("Document ID: ",document_reply_out->document_id, " has been created."), document_reply_out)
 
	if(idebugFlag > 0)
		call echo(concat("PostDocument Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: CreateSignTask(null)	= i2 with protect ;967143 Task.AddMessages
;  Description:  Create a sign task for the author and cosigner
**************************************************************************/
subroutine CreateSignTask(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("CreateSignTask Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 967100
	set iTask = 967100
	set iRequest = 967143
 
	; One second delay to allow the task to create by the task server before checking the table
	call pause(1)
 
	; Verify if tasks already exist
	set author_check = 0
	set cosigner_check = 0
 
	select into "nl:"
	from task_activity ta
	, task_activity_assignment taa
	plan ta	where ta.event_id = document_reply_out->document_id
	join taa where taa.task_id = ta.task_id
	order by ta.task_id
	detail
		if(taa.assign_prsnl_id = dAuthorId)
			author_check = 1
		endif
		if(dCosignerId > 0)
			if(taa.assign_prsnl_id = dCosignerId)
				cosigner_check = 1
			endif
		endif
	with nocounter
 
	set idx = 0
	; Create task for author
 	if(author_check = 0 and sDocStatusMean != "AUTH")
 		set idx = idx + 1
 		set stat alterlist(967143_req->task_list,idx)
		set 967143_req->task_list[idx].person_id = dPatientId
		set 967143_req->task_list[idx].encntr_id = dEncounterId
		set 967143_req->task_list[idx].event_id = document_reply_out->document_id
		set 967143_req->task_list[idx].event_class_cd = c_event_class_mdoc
		set 967143_req->task_list[idx].task_type_cd = c_endorsements_task_type_cd
		set 967143_req->task_list[idx].task_type_meaning = uar_get_code_meaning(c_endorsements_task_type_cd)
		set 967143_req->task_list[idx].task_status_cd = c_pending_task_status_cd
		set 967143_req->task_list[idx].task_status_meaning = uar_get_code_meaning(c_pending_task_status_cd)
		set 967143_req->task_list[idx].task_activity_cd = c_signresult_task_activity_cd
		set 967143_req->task_list[idx].task_activity_meaning = uar_get_code_meaning(c_signresult_task_activity_cd)
		set 967143_req->task_list[idx].msg_subject = uar_get_code_display(dDocType)
		set stat = alterlist(967143_req->task_list[idx].assign_prsnl_list,1)
		set 967143_req->task_list[idx].assign_prsnl_list[1].assign_prsnl_id = dAuthorId
 	endif
 
 	; Create task for Cosigner
 	if(dCosignerId > 0 and cosigner_check = 0)
 		set idx = idx + 1
 		set stat alterlist(967143_req->task_list,idx)
		set 967143_req->task_list[idx].person_id = dPatientId
		set 967143_req->task_list[idx].encntr_id = dEncounterId
		set 967143_req->task_list[idx].event_id = document_reply_out->document_id
		set 967143_req->task_list[idx].event_class_cd = c_event_class_mdoc
		set 967143_req->task_list[idx].task_type_cd = c_endorsements_task_type_cd
		set 967143_req->task_list[idx].task_type_meaning = uar_get_code_meaning(c_endorsements_task_type_cd)
		set 967143_req->task_list[idx].task_status_cd = c_pending_task_status_cd
		set 967143_req->task_list[idx].task_status_meaning = uar_get_code_meaning(c_pending_task_status_cd)
		set 967143_req->task_list[idx].task_activity_cd = c_signresult_task_activity_cd
		set 967143_req->task_list[idx].task_activity_meaning = uar_get_code_meaning(c_signresult_task_activity_cd)
		set 967143_req->task_list[idx].msg_subject = uar_get_code_display(dDocType)
		set stat = alterlist(967143_req->task_list[idx].assign_prsnl_list,1)
		set 967143_req->task_list[idx].assign_prsnl_list[1].assign_prsnl_id = dCosignerId
 	endif
 
 	; Execute request
 	if(idx > 0)
 		set stat = tdbexecute(iApplication,iTask,iRequest,"REC",967143_req,"REC",967143_rep)
 
		; Validate success
		if(967143_rep->status_data.status != "S")
			call ErrorHandler2("POST DOCUMENT", "F", "CreateTask", "Could not create task.",
			"9999","Could not create task.", document_reply_out)
			go to exit_script
		endif
	endif
 
	if(idebugFlag > 0)
		call echo(concat("CreateSignTask Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
end ;End Subroutine
 
end go
set trace notranslatelock go
 
 
 
