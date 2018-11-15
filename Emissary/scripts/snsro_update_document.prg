/***********************************************************************************
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
************************************************************************************
      Source file name:     snsro_update_document.prg
      Object name:          snsro_update_document
      Program purpose:      Update a document in Millennium.
      Executing from:      Emissary MPages Discern Web Service
******************************************************************************
                    MODIFICATION CONTROL LOG
******************************************************************************
  Mod Date     Engineer             Comment
  ----------------------------------------------------------------------------
  001 09/06/17  RJC					Initial write
  002 09/14/17	RJC					Added binary option
  003 11/09/17	RJC					Added check to validate doc body is not empty and is properly base64 encoded
  004 04/02/18	RJC					Update timezone on document. Make custom table default storage option
  005 03/26/18  RJC					Added copyright block and version control
  006 04/19/18	RJC					Added cosigning functionality, author, cosigner, dictation date, transcription date
  006 05/09/18	RJC					Moved GetDateTime function to snsro_common
  007 06/06/18	RJC					Allow transcribed as a status
  008 06/27/18	RJC					Sig Line changes, Added service_dept(contributor system), task creation
  009 10/30/18	RJC					Fixed issue with add binary call
  DO NOT ADD ANY CHANGES TO THIS SCRIPT. ANYTHING NEW SHOULD BE DONE IN SNSRO_PUT_DOCUMENT
******************************************************************************/
drop program snsro_update_document go
create program snsro_update_document
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username:" = ""        			; required
		, "Document Id" = 0.0				; required
		, "Document Format:" = 0.0			; Optional (default RTF) - RTF, PDF, TIFF, JPEG (codset 23)
		, "Document Subject:" = ""			; A brief description of the nature of the contents of the Clinical Document.
		, "Document Status:" = 0.0			; Optional - default is current status. In Progress, Auth, Modified (codeset 8)
		, "Document Body:" = ""				; base64 encoded document string
		, "Transaction ID" = ""				;Trans ID created in Emissary.   ;002
		, "Sequence Number" = 1				;Sequence of the call			 ;002
		, "Total"	= 1						;Total number of calls expected to rebuild binary	;002
		, "Storage Type" = 2				;1 = To file; 2 = To custom table ;002
		, "Directory" = "ccluserdir"		;Should be NFS share - CCLUSERDIR is default
		, "Author" = ""						;Optional
		, "Cosigner" = ""					;Optional
		, "Dictated Date" = ""				;Ignored on a put request
		, "Transcribed Date" = ""			;Ignored on a put request
		, "Debug Flag" = 0					;OPTIONAL. Verbose logging when set to one (1).
with OUTDEV, USERNAME, DOC_ID, DOC_FORMAT, DOC_SUBJECT, DOC_STATUS, DOC_BODY,
 	TRANS_ID, SEQ_NUM, TOTAL, STOR_TYPE, DIR, AUTHOR, COSIGNER, DICTATED_DT, TRANSCRIBED_DT, DEBUG_FLAG
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL  ;005
**************************************************************************/
set sVersion = "1.16.6.1"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record data_detail
record data_detail (
	1 qual_cnt 				= i2
	1 person_id 			= f8
	1 encntr_id 			= f8
	1 encntr_prsnl_r_cd 	= f8
	1 event_id 				= f8
	1 child_event
		2 event_id			= f8
		2 ref_nbr			= vc	;008
		2 series_ref_nbr	= vc	;008
	1 event_cd 				= f8
	1 result_status_cd 		= f8
	1 result_status_mean 	= vc
	1 now_dt_tm 			= vc
	1 sig_line 				= vc
	1 time_zone				= i4 	;004
	1 event_end_dt_tm 		= dq8 	;006
	1 performed_dt_tm 		= dq8 	;008
	1 performed_prsnl_id 	= f8 	;008
	1 event_start_dt_tm 	= dq8 	;008
	1 entry_mode_cd			= f8	;008
	1 contributor_system_cd = f8 	;008
	1 ref_nbr 				= vc	;008
	1 series_ref_nbr		= vc	;008
)
 
;002 Start
 
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
;002 End
 
free record document_reply_out
record document_reply_out(
  1 document_id             	= f8
  1 result_status_cd			= f8
  1 result_status_disp		= vc
  1 audit
    2 user_id            			= f8
    2 user_firstname			= vc
    2 user_lastname			= vc
    2 patient_id					= f8
    2 patient_firstname     	= vc
    2 patient_lastname      	= vc
    2 service_version        	= vc
  1 status_data
    2 status						= c1
    2 subeventstatus[1]
      3 OperationName 		= c25
      3 OperationStatus		= c1
      3 TargetObjectName 	= c25
      3 TargetObjectValue 	= vc
      3 Code 						= c4
      3 Description 				= vc
)
 
 RECORD cv_atr (
   1 stat 		= i4
   1 app_nbr 	= i4
   1 task_nbr = i4
   1 step_nbr = i4
   1 happ 		= i4
   1 htask 		= i4
   1 hstep 		= i4
   1 hrequest = i4
   1 hreply 	= i4
 ) with protect
 
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
 
free record 1005225_parent_req
record 1005225_parent_req (
  1 event_prsnl_id_list [*]
    2 event_prsnl_id = f8
)
 
free record 1005225_parent_rep
record 1005225_parent_rep (
  1 event_prsnl_list [*]
    2 ce_event_prsnl_id = f8
    2 event_prsnl_id = f8
    2 person_id = f8
    2 event_id = f8
    2 valid_from_dt_tm = dq8
    2 valid_from_dt_tm_ind = i2
    2 valid_until_dt_tm = dq8
    2 valid_until_dt_tm_ind = i2
    2 action_type_cd = f8
    2 action_type_cd_disp = vc
    2 request_dt_tm = dq8
    2 request_dt_tm_ind = i2
    2 request_prsnl_id = f8
    2 request_prsnl_ft = vc
    2 request_comment = vc
    2 action_dt_tm = dq8
    2 action_dt_tm_ind = i2
    2 action_prsnl_id = f8
    2 action_prsnl_ft = vc
    2 proxy_prsnl_id = f8
    2 proxy_prsnl_ft = vc
    2 action_status_cd = f8
    2 action_status_cd_disp = vc
    2 action_comment = vc
    2 change_since_action_flag = i2
    2 change_since_action_flag_ind = i2
    2 updt_dt_tm = dq8
    2 updt_dt_tm_ind = i2
    2 updt_id = f8
    2 updt_task = i4
    2 updt_task_ind = i2
    2 updt_cnt = i4
    2 updt_cnt_ind = i2
    2 updt_applctx = i4
    2 updt_applctx_ind = i2
    2 long_text_id = f8
    2 long_text = vc
    2 linked_event_id = f8
    2 request_tz = i4
    2 action_tz = i4
    2 system_comment = vc
    2 digital_signature_ident = vc
    2 action_prsnl_group_id = f8
    2 request_prsnl_group_id = f8
  1 status_data
    2 status = c1
    2 subeventstatus [*]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
)
 
free record 1005225_child_req
record 1005225_child_req (
  1 event_prsnl_id_list [*]
    2 event_prsnl_id = f8
)
 
free record 1005225_child_rep
record 1005225_child_rep (
  1 event_prsnl_list [*]
    2 ce_event_prsnl_id = f8
    2 event_prsnl_id = f8
    2 person_id = f8
    2 event_id = f8
    2 valid_from_dt_tm = dq8
    2 valid_from_dt_tm_ind = i2
    2 valid_until_dt_tm = dq8
    2 valid_until_dt_tm_ind = i2
    2 action_type_cd = f8
    2 action_type_cd_disp = vc
    2 request_dt_tm = dq8
    2 request_dt_tm_ind = i2
    2 request_prsnl_id = f8
    2 request_prsnl_ft = vc
    2 request_comment = vc
    2 action_dt_tm = dq8
    2 action_dt_tm_ind = i2
    2 action_prsnl_id = f8
    2 action_prsnl_ft = vc
    2 proxy_prsnl_id = f8
    2 proxy_prsnl_ft = vc
    2 action_status_cd = f8
    2 action_status_cd_disp = vc
    2 action_comment = vc
    2 change_since_action_flag = i2
    2 change_since_action_flag_ind = i2
    2 updt_dt_tm = dq8
    2 updt_dt_tm_ind = i2
    2 updt_id = f8
    2 updt_task = i4
    2 updt_task_ind = i2
    2 updt_cnt = i4
    2 updt_cnt_ind = i2
    2 updt_applctx = i4
    2 updt_applctx_ind = i2
    2 long_text_id = f8
    2 long_text = vc
    2 linked_event_id = f8
    2 request_tz = i4
    2 action_tz = i4
    2 system_comment = vc
    2 digital_signature_ident = vc
    2 action_prsnl_group_id = f8
    2 request_prsnl_group_id = f8
  1 status_data
    2 status = c1
    2 subeventstatus [*]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
)
 
;967143 - Task.AddMessages 				;008
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
 
IF ((validate (reply->status_data.status ) = 0 ) )
  FREE
  SET reply
  RECORD reply (
    1 sb_severity 	= i4
    1 sb_status 		= i4
    1 sb_statustext = vc
    1 event_id 		= f8
    1 status_data
      2 status 			= c1
      2 subeventstatus [* ]
        3 operationname 		= c25
        3 operationstatus 		= c1
        3 targetobjectname 	= c25
        3 targetobjectvalue 	= vc
  )
 ENDIF
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
; Inputs
declare sUserName			= vc with protect, noconstant("")
declare dUserId				= f8 with protect, noconstant(0.0)
declare sPrsnlName			= vc with protect, noconstant("")
declare dDocId				= f8 with protect, noconstant(0.0)
declare dDocFormat 			= f8 with protect, noconstant(0.0)
declare dDocStatus			= f8 with protect, noconstant(0.0)
declare sDocStatusMean		= vc with protect, noconstant("")
declare sDocSubject			= vc with protect, noconstant("")
declare sDocBody  			= gvc with protect, noconstant("")
declare sDecodedBody		= gvc with protect, noconstant("")
declare iDebugFlag			= i2 with protect, noconstant(0)
declare sTransId			= vc with protect, noconstant("") 	;002
declare iSeqNum				= i4 with protect, noconstant(0) 	;002
declare iTotal				= i4 with protect, noconstant(0) 	;002
declare iStorage			= i2 with protect, noconstant(0)	;002
declare sDirectory			= vc with protect, noconstant("")	;002
declare sFilename			= vc with protect, noconstant("")	;002
declare dAuthorId			= f8 with protect, noconstant(0.0)	;006
declare dCosignerId			= f8 with protect, noconstant(0.0)	;006
declare qDictatedDttm		= dq8 with protect, noconstant(0)	;006
declare qTranscribedDttm	= dq8 with protect, noconstant(0)	;006
 
; Other
declare now_dt_tm			= dq8 with protect, noconstant(0)
declare iCosignerExists		= i2 with protect, noconstant(0)
declare iAuthenticFlag		= i2 with protect, noconstant(0)
 
declare cvbeginatr ((p_app_nbr = i4 ) ,(p_task_nbr = i4 ) ,(p_step_nbr = i4 ) ) = i4 with protect
declare cvperformatr (null ) = i4 with protect
declare cvendatr (null ) = null with protect
declare hce = i4 with protect
declare hce2 = i4 with protect
declare hprsnl = i4 with protect
declare hce_type = i4 with protect
declare hce_struct = i4 with protect
declare hblob = i4 with protect
declare hblob2 = i4 with protect
declare hstatus = i4 with protect
declare hrb_list = i4 with protect
declare hrb = i4 with protect
declare rb_cnt = i4 with protect
declare rb_idx = i4 with protect
declare g_event_id = f8 with protect
declare g_parent_event_id = f8 with protect
declare note_size = i4 with protect ,noconstant(0 )
 
;Constants
declare UTCmode	= i2 with protect, constant(CURUTC)
declare c_event_class_doc = f8 with protect ,constant (uar_get_code_by ("MEANING" ,53 ,"DOC" ) )
declare c_event_class_mdoc = f8 with protect ,constant (uar_get_code_by ("MEANING" ,53 ,"MDOC" ) )
declare c_succession_interim = f8 with protect ,constant (uar_get_code_by ("MEANING" ,63 ,"INTERIM") )
declare c_succession_final = f8 with protect ,constant (uar_get_code_by ("MEANING" ,63 ,"FINAL") )
declare c_format_rtf = f8 with protect ,constant (uar_get_code_by ("MEANING" ,23 ,"RTF" ) )
declare c_storage_blob = f8 with protect ,constant (uar_get_code_by ("MEANING" ,25 ,"BLOB" ) )
declare c_action_type_perform = f8 with protect ,constant (uar_get_code_by ("MEANING" ,21 ,"PERFORM" ) )
declare c_action_type_verify = f8 with protect ,constant (uar_get_code_by ("MEANING" ,21 ,"VERIFY" ) )
declare c_action_type_sign = f8 with protect ,constant (uar_get_code_by ("MEANING" ,21 ,"SIGN" ) )
declare c_action_type_cosign = f8 with protect ,constant (uar_get_code_by ("MEANING" ,21 ,"COSIGN" ) )
declare c_action_type_modify = f8 with protect ,constant (uar_get_code_by ("MEANING" ,21 ,"MODIFY" ) )
declare c_action_type_transcribe = f8 with protect ,constant (uar_get_code_by ("MEANING" ,21 ,"TRANSCRIBE" ) ) ;007
declare c_action_status_completed = f8 with protect ,constant (uar_get_code_by ("MEANING" ,103 ,"COMPLETED" ) )
declare c_action_status_pending = f8 with protect ,constant (uar_get_code_by ("MEANING" ,103 ,"PENDING" ) )
declare c_root_reltn_cd = f8 with protect ,constant (uar_get_code_by ("MEANING" ,24 ,"ROOT" ) )
declare c_child_reltn_cd = f8 with protect ,constant (uar_get_code_by ("MEANING" ,24 ,"CHILD" ) )
declare c_entry_mode_cd = f8 with protect ,constant (uar_get_code_by ("MEANING" ,29520 ,"UNDEFINED" ) )
declare c_compression_cd = f8 with protect, constant(uar_get_code_by("MEANING",23,"PAPER"))
declare c_activity_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",106,"CLINDOC"))
declare c_activity_subtype_cd = f8 with protect, constant(uar_get_code_by("MEANING",5801,"TRANSCRIPT"))
 
declare c2_note_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",14,"SIGN LINE"))
declare c2_note_format_cd = f8 with protect, constant(uar_get_code_by("MEANING",23,"AH"))
declare c2_entry_method_cd = f8 with protect, constant(uar_get_code_by("MEANING",13,"UNKNOWN"))
declare c2_compression_cd = f8 with protect, constant(uar_get_code_by("MEANING",120,"NOCOMP"))
 
declare c_endorsements_task_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",6026,"ENDORSE")) ;008
declare c_pending_task_status_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",79,"PENDING")) ;008
declare c_saveddoc_task_activity_cd	= f8 with protect, constant(uar_get_code_by("MEANING",6027,"SAVED DOC")) ;008
declare c_signresult_task_activity_cd	= f8 with protect, constant(uar_get_code_by("MEANING",6027,"SIGN RESULT")) ;008
 
declare applicationid = i4 with constant (1000012 ) ,protect
declare taskid = i4 with constant (1000012 ) ,protect
declare requestid = i4 with constant (1000012 ) ,protect
 
/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare BuildBinary(action = vc) 	= i4 with protect 	;002
declare RetrieveBinary(null)		= i4 with protect 	;002
declare GetEventDetails(null)		= i4 with protect  	; custom query
declare ValidateDocStatus(null)		= i4 with protect  	; custom query
declare VerifyPrivs(null)			= i4 with protect  	; 680501 MSVC_CheckPrivileges
declare GetPrsnlList(null)			= i4 with protect	; 1005225 ce_retrieve_action_comment
declare GetSigLine(prsnl_id = f8) 	= vc with protect 	; 3200246 msvc_svr_get_signature_line
declare PostDocument(null)			= null with protect ; 1000012 event_ensure
declare CreateSignTask(null)		= null with protect ; 560300 DCP Add Task - 008
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
set sUserName						= trim($USERNAME, 3)
set dUserId							= GetPrsnlIDfromUserName(sUserName) ;defined in snsro_common
set reqinfo->updt_id				= dUserId
set sPrsnlName						= GetNameFromPrsnlID(dUserId)  ;defined in snsro_common
set dDocId							= cnvtint($DOC_ID)
set dDocFormat						= cnvtint($DOC_FORMAT)
set sDocSubject						= trim($DOC_SUBJECT, 3)
set dDocStatus						= cnvtreal($DOC_STATUS)
set sDocBody						= trim($DOC_BODY, 3)
set iDebugFlag						= cnvtint($DEBUG_FLAG)
 
;002 Start
set sTransId						= trim($TRANS_ID,3)
set iSeqNum							= cnvtint($SEQ_NUM)
set iTotal							= cnvtint($TOTAL)
set iStorage						= cnvtint($STOR_TYPE)
set sDirectory						= trim($DIR)
set sFilename						= build2("snsro_",sTransId,".dat")
if(iStorage = 1)
	if(sDirectory < " ")
		set sDirectory = logical(sDirectory)
	else
		set sDirectory = logical("ccluserdir")
	endif
else
	set iStorage = 2 ;Default to table storage ;004
endif
;002 End
 
;006 start
set qDictatedDttm				= GetDateTime(trim($DICTATED_DT,3))
set qTranscribedDttm			= GetDateTime(trim($TRANSCRIBED_DT,3))
set now_dt_tm					= GetDateTime("")
 
if(trim($AUTHOR,3) > " ")
	set dAuthorId				= GetPrsnlIDfromUserName(trim($AUTHOR,3))
else
	set dAuthorId				= dUserId
endif
if(trim($COSIGNER,3) > " ")
	set dCosignerId				= GetPrsnlIDfromUserName(trim($COSIGNER,3))
endif
 ;006 end
 
SET reply->status_data.status = "F"
 
if(iDebugFlag > 0)
	call echo(build2("sUserName -> ",sUserName))
	call echo(build2("dUserId -> ", dUserId))
	call echo(build2("dDocId -> ", dDocId))
	call echo(build2("dDocFormat -> ", dDocFormat))
	call echo(build2("sDocSubject -> ", sDocSubject))
	call echo(build2("dDocStatus -> ", dDocStatus))
	call echo(build2("sDocBody -> ", sDocBody))
	call echo(build2("debug flag -> ", iDebugFlag))
	call echo(build("sTransId -> ",sTransId))
	call echo(build("iSeqNum -> ",iSeqNum))
	call echo(build("iTotal -> ",iTotal))
	call echo(build("iStorage -> ",iStorage))
	call echo(build("sDirectory -> ",sDirectory))
	call echo(build("qDictatedDttm -> ",qDictatedDttm))
	call echo(build("qTranscribedDttm -> ",qTranscribedDttm))
	call echo(build("now_dt_tm -> ",now_dt_tm))
	call echo(build("dAuthorId -> ",dAuthorId))
	call echo(build("dCosignerId -> ",dCosignerId))
endif
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
;Validate Doc Id exists
if(dDocId = 0)
	call ErrorHandler2("PUT DOCUMENT", "F", "Invalid URI Parameters", "Missing required field: Document ID.",
	"2055", "Missing required field: DocId", document_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate Doc ID is valid
set iRet = GetEventDetails(null)
if(iRet = 0)
	call ErrorHandler2("PUT DOCUMENT", "F", "GetEventDetails", "Invalid Document ID.",
	"1001", build2("Document ID is invalid: ", dDocId), document_reply_out)
	go to EXIT_SCRIPT
endif
 
; Get event prsnl details
set iRet = GetPrsnlList(null)
if(iRet = 0)
	call ErrorHandler2("PUT DOCUMENT", "F", "GetPrsnlList", "Could not retrieve event personnel",
	"9999","Could not retrieve event personnel", document_reply_out)
	go to exit_script
endif
 
; Validate username
set iRet = PopulateAudit(sUserName, data_detail->person_id, document_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2("PUT DOCUMENT", "F", "PopulateAudit", "Invalid User for Audit.",
  	"1002",build2("Invalid user: ",sUserName), document_reply_out)
	go to exit_script
endif
 
;Validate dates are not in the future
if(qTranscribedDttm > sysdate or qDictatedDttm > sysdate)
	call ErrorHandler2("POST DOCUMENT", "F", "ValidateDates", "Invalid dates provided. ",
	"9999",build2("Invalide dates provided."), document_reply_out)
	go to exit_script
endif
 
; Validate doc format code
if(dDocFormat > 0)
	set iRet = GetCodeSet(dDocFormat)
	if(iRet != 23)
		call ErrorHandler2("PUT DOCUMENT", "F", "GetCodeSet", "Invalid Doc Format Code",
  			"1004",build2("Invalid Doc Format Code: ",dDocFormat), document_reply_out)
		go to exit_script
	endif
else
 	set dDocFormat = c_format_rtf
endif
 
; Validate doc status code
call ValidateDocStatus(null)
 
; If the binary data is greater than 65K, then Emissary will send a total greater than 1.
; If the total is greater than 1, then the buildbinary process is invoked
if(iTotal > 1)
	if(iSeqNum = iTotal)
		set iRet = BuildBinary("ADD")
		if(iRet = 0)
	  	  call ErrorHandler2("PUT DOCUMENT", "F", "BuildBinary", "Binary Build Failed",
	  	  "9999",build2("Operating system returned error ",binary_rep->status), document_reply_out)
	  	  go to exit_script
		endif
 
		call RetrieveBinary(null)
		call BuildBinary("DELETE")
 
	else
		set iRet = BuildBinary("ADD")
		if(iRet = 0)
	  	  call ErrorHandler2("PUT DOCUMENT", "F", "BuildBinary", "Binary Build Failed",
	  	  "9999",build("Operating system returned error ",binary_rep->status), document_reply_out)
	  	  go to exit_script
		endif
 
		call ErrorHandler2("PUT DOCUMENT", "S", "Building Binary", "Added Binary data and waiting for remainder",
		"1000", build2("Sequence ",iSeqNum, " of ",iTotal," processed"), document_reply_out)
		go to EXIT_SCRIPT
	endif
endif
 
; Validate Doc Body is not empty and base64 encoded 	;003
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
 
; Verify privileges
set iRet = VerifyPrivs(null)
if(iRet = 0)
	call ErrorHandler2("PUT DOCUMENT", "F", "VerifyPrivs", "User does not have privileges to update document",
  		"9999",build2("User does not have privileges for status ",sDocStatusMean), document_reply_out)
	go to exit_script
endif
 
; Execute server calls
EXECUTE crmrtl
EXECUTE srvrtl
 
; Update the document
call PostDocument(null)
 
; Create a task for all signers if not already created and status isn't Modified
if(sDocStatusMean != "MODIFIED")
	call CreateSignTask(null)
endif
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(document_reply_out)
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_update_document.json")
	call echo(build2("_file : ", _file))
	call echojson(document_reply_out, _file, 0)
	call echo(JSONout)
	call echorecord(data_detail, _file, 1)
	call echorecord(document_reply_out)
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
	if(iDebugFlag > 0)
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
	set binary_req->debug_flag = iDebugFlag
 
	execute snsro_add_binary "" with replace(REQUEST,binary_req), replace (REPLY,binary_rep)
 
	set iValidate = 1
	if(binary_rep->status_data.status = "F")
		set iValidate = 0
	endif
 
	if(iDebugFlag > 0)
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
	if(iDebugFlag > 0)
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
 
	if(iDebugFlag > 0)
		call echo(concat("RetrieveBinary Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
end ;End Subroutine
 
/*************************************************************************
;  Name: GetEventDetails(null)
;  Description:  Get details based on event_id (DOC_ID)
**************************************************************************/
subroutine GetEventDetails(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetEventDetails Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set data_detail->now_dt_tm = format(cnvtdatetime(curdate, curtime3),"@SHORTDATETIME")
 
 	; Get Parent event_id, event_cd, encntr_id and person_id
	select into "nl:"
	from clinical_event ce
	where ce.event_id = dDocId
	head report
		x = 0
	detail
		x = x + 1
		data_detail->encntr_id = ce.encntr_id
		data_detail->event_cd = ce.event_cd
		data_detail->event_id = ce.event_id
		data_detail->person_id = ce.person_id
		data_detail->result_status_cd = ce.result_status_cd
		data_detail->result_status_mean = uar_get_code_meaning(ce.result_status_cd)
		data_detail->time_zone = ce.performed_tz
		data_detail->event_end_dt_tm = ce.event_end_dt_tm
		data_detail->performed_dt_tm = ce.performed_dt_tm
		data_detail->event_start_dt_tm = ce.event_start_dt_tm
		data_detail->entry_mode_cd = ce.entry_mode_cd
		data_detail->contributor_system_cd = ce.contributor_system_cd
		data_detail->ref_nbr = ce.reference_nbr
		data_detail->series_ref_nbr = ce.series_ref_nbr
	foot report
		data_detail->qual_cnt = x
	with nocounter
 
	if(data_detail->qual_cnt > 0)
 
		; Get Child event id
		select into "nl:"
		from clinical_event ce
		where ce.parent_event_id = data_detail->event_id
			and ce.event_reltn_cd = value(uar_get_code_by("MEANING" ,24 ,"CHILD" ))
			and ce.valid_until_dt_tm > sysdate
		detail
			data_detail->child_event.event_id = ce.event_id
			data_detail->child_event.ref_nbr = ce.reference_nbr
			data_detail->child_event.series_ref_nbr = ce.series_ref_nbr
		with nocounter
 
		; Get encntr/prsnl relation
		select into "nl:"
		from encntr_prsnl_reltn epr
		where epr.encntr_id = data_detail->encntr_id
			and epr.prsnl_person_id = dAuthorId
		detail
			data_detail->encntr_prsnl_r_cd = epr.encntr_prsnl_r_cd
		with nocounter
 
	endif
 
	if(iDebugFlag > 0)
		call echorecord(data_detail)
		call echo(concat("GetEventDetails Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
 
	return(data_detail->qual_cnt)
end ;End Subroutine
 
/*************************************************************************
;  Name: GetPrsnlList(event_id)
;  Description:  Get the event personnel tied to the event id
**************************************************************************/
subroutine GetPrsnlList(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetPrsnlList Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iAPPLICATION = 600005
	set iTASK = 600107
 	set iREQUEST = 1005225
 
	select into "nl:"
	from ce_event_prsnl cep
	where cep.event_id in (data_detail->event_id,data_detail->child_event.event_id)
		and cep.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
	head report
		z = 0
		y = 0
	detail
		if(data_detail->event_id = cep.event_id)
			z = z + 1
 
			stat = alterlist(1005225_parent_req->event_prsnl_id_list,z)
			1005225_parent_req->event_prsnl_id_list[z].event_prsnl_id = cep.event_prsnl_id
		else
			y = y + 1
 
			stat = alterlist(1005225_child_req->event_prsnl_id_list,y)
			1005225_child_req->event_prsnl_id_list[y].event_prsnl_id = cep.event_prsnl_id
		endif
	with nocounter
 
 	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",1005225_parent_req,"REC",1005225_parent_rep)
 	set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",1005225_child_req,"REC",1005225_child_rep)
 
 	set iValidate = 0
 	if(1005225_parent_rep->status_data.status = "Z")
 		set iValidate = 1
 
		; Verify Author Id is valid and cosigner already exists or not ;006
		set authCheck = 0
		if(dAuthorId > 0)
			for(i = 1 to size(1005225_parent_rep->event_prsnl_list,5))
				; Search for Author
				if(1005225_parent_rep->event_prsnl_list[i].action_type_cd_disp = "Perform"
				and 1005225_parent_rep->event_prsnl_list[i].action_prsnl_id = dAuthorId)
					set authCheck = 1
				endif
 
				; Search for Cosigner
				if(1005225_parent_rep->event_prsnl_list[i].action_type_cd_disp in ("Cosign","Sign")
				and 1005225_parent_rep->event_prsnl_list[i].action_prsnl_id = dCosignerId)
					set iCosignerExists = 1
				endif
			endfor
		endif
 
		if(authCheck = 0)
			call ErrorHandler2("PUT DOCUMENT", "F", "Validate", "Invalid Author Id provided. Cannot change document author.",
			"9999",build2("Invalid Author Id provided. Cannot change document author."), document_reply_out)
			go to exit_script
		endif
 	endif
 
 	if(1005225_child_rep->status_data.status = "Z")
 		set iValidate = iValidate + 1
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetPrsnlList Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	     " seconds"))
	endif
 
	if(iValidate > 1)
		return(1)
	else
 		return(0)
	endif
end ;End Subroutine
 
/*******************************************************************************
;  Name: ValidateDocStatus(null)
;  Description: Validate the document status code is correct and that
				status code can update the current document status
*********************************************************************************/
 subroutine ValidateDocStatus(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ValidateDocStatus Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	; Verify docs status is valid if it exists. If it doesn't exist, keep the status the same
	if(dDocStatus > 0)
 		set iRet = GetCodeSet(dDocStatus)
		if(iRet != 8)
			call ErrorHandler2("PUT DOCUMENT", "F", "GetCodeSet", "Invalid Doc Status Code",
  			"1005",build2("Invalid Doc Status Code: ",dDocStatus), document_reply_out)
			go to exit_script
		endif
	else
		set dDocStatus = data_detail->result_status_cd
	endif
 
	set sDocStatusMean = uar_get_code_meaning(dDocStatus)
 
	;Verify status is valid for this request
	if(sDocStatusMean not in("IN PROGRESS","AUTH","MODIFIED","TRANSCRIBED"))
		call ErrorHandler2("PUT DOCUMENT", "F", "Validate", "Ineligible doc status code",
		"9999",build2("The only valid document statuses are 'TRANSCRIBED', 'IN PROGRESS','AUTH' or 'MODIFY "),
		document_reply_out)
		go to exit_script
	endif
 
	; Only signer and cosigner can sign the document ;006
	if(sDocStatusMean = "AUTH")
		if(dUserId != dAuthorId)
			call ErrorHandler2("PUT DOCUMENT", "F", "ValidateDocStatus", "Ineligible doc status code - user is not the author.",
			"9999",build2("The user is not the author and cannot sign the document:",sDocStatusMean), document_reply_out)
			go to exit_script
		else
			set signCheck = 0
			for(i = 1 to size(1005225_parent_rep->event_prsnl_list,5))
				if(1005225_parent_rep->event_prsnl_list[i].action_prsnl_id = dUserId
				and 1005225_parent_rep->event_prsnl_list[i].action_type_cd_disp in ("Perform","Sign","Cosign"))
					set signCheck = 1
				endif
			endfor
 
			if(signCheck = 0)
				call ErrorHandler2("PUT DOCUMENT", "F", "ValidateDocStatus",
				"Ineligible doc status code - user is not the author nor cosigner.",
				"9999",build2("The user is not the author nor cosigner and cannot sign the document:",
				sDocStatusMean), document_reply_out)
				go to exit_script
			endif
		endif
	endif
 
	;Verify the current status can be updated to the new status
	set updateFail = 0
	case(data_detail->result_status_mean)
			of "TRANSCRIBED":
				if(sDocStatusMean not in ("TRANSCRIBED","IN PROGRESS","AUTH"))
					set updateFail = 1
				endif
			of "IN PROGRESS":
				if(sDocStatusMean not in ("IN PROGRESS","AUTH"))
					set updateFail = 1
				endif
			of "AUTH":
				if(sDocStatusMean != "MODIFIED")
					set updateFail = 1
				endif
			of "MODIFIED":
				if(sDocStatusMean != "MODIFIED")
					set updateFail = 1
				endif
		endcase
 
		if(updateFail)
			call ErrorHandler2("PUT DOCUMENT", "F", "Validate", "Ineligible doc status code",
			"9999",build2("Current document status is ", data_detail->result_status_mean, " and cannot be updated to ",
			sDocStatusMean), document_reply_out)
			go to exit_script
		endif
 
	if(iDebugFlag > 0)
		call echo(concat("ValidateDocStatus Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
end ;End Subroutine
 
/*************************************************************************
;  Name: VerifyPrivs(null)
;  Description:  Verify user has privileges to update document
**************************************************************************/
subroutine VerifyPrivs(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("VerifyPrivs Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iAPPLICATION = 600005
	set iTASK = 3202004
 	set iREQUEST = 680501
 
	set 680501_req->user_id = dAuthorId
	set 680501_req->patient_user_relationship_cd = data_detail->encntr_prsnl_r_cd
	set stat = alterlist(680501_req->event_codes,1)
	set 680501_req->event_codes[1].event_cd = data_detail->event_cd
 
	declare iValidate = i2
	if(sDocStatusMean in ("TRANSCRIBED","IN PROGRESS"))
		set 680501_req->event_privileges->event_code_level.modify_documentation_ind = 1
		set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",680501_req,"REC",680501_rep)
		set iValidate = 680501_rep->event_privileges->modify_documentation.status.success_ind
	else
		set 680501_req->event_privileges->event_code_level.sign_documentation_ind = 1
		set stat = tdbexecute(iAPPLICATION,iTASK,iREQUEST,"REC",680501_req,"REC",680501_rep)
		set iValidate = 680501_rep->event_privileges->sign_documentation.status.success_ind
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("VerifyPrivs Runtime: ",
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
 	set 3200246_req->signature_line_criteria[1].type_cd = data_detail->event_cd
 	set 3200246_req->signature_line_criteria[1].activity_type_cd = c_activity_type_cd
 	set 3200246_req->signature_line_criteria[1].activity_subtype_cd = c_activity_subtype_cd
 	set stat = alterlist(3200246_req->signature_line_criteria[1].personnel_actions,5)
 
 	for(i = 1 to 5)
 		set 3200246_req->signature_line_criteria[1].personnel_actions[i].action_personnel_id = prsnl_id
 		set 3200246_req->signature_line_criteria[1].personnel_actions[i].action_date = now_dt_tm
 		set 3200246_req->signature_line_criteria[1].personnel_actions[i].action_tz = data_detail->time_zone
 
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
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostDocument Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare outBuffer = vc with private, noconstant("")
	set outBuffer =  sDecodedBody
	set  note_size = textlen(trim(outBuffer,3))
 
	IF ((cvbeginatr (applicationid ,taskid ,requestid ) != 0 ) )
		call ErrorHandler2("VALIDATE", "F", " FApp, task, Req", "Field to Begin ATR",
		"9999", "Faild to Begin ATR.", document_reply_out)
		GO TO EXIT_SCRIPT
	ENDIF
 
 	; Build Request
	SET stat = uar_srvsetshort (cv_atr->hrequest ,"ensure_type" ,2 )
 	SET hce = uar_srvgetstruct (cv_atr->hrequest ,"clin_event" )
 
	if(sDocStatusMean = "MODIFIED")
		SET stat = uar_srvsetshort (cv_atr->hrequest ,"ensure_type2" ,2 )
	endif
 
	if(iDebugFlag > 0)
		call echo(build2("hce--->", hce))
	endif
 
	if(sDocStatusMean = "AUTH")
	 	set iAuthenticFlag = 1 ;008
	endif
 
	IF (hce )
		SET stat = uar_srvsetlong   (hce ,"view_level" ,1 )
		SET stat = uar_srvsetdouble (hce ,"event_id" ,data_detail->event_id )
		SET stat = uar_srvsetdouble (hce ,"person_id" ,data_detail->person_id )
		SET stat = uar_srvsetdouble (hce ,"encntr_id" ,data_detail->encntr_id )
		SET stat = uar_srvsetdouble (hce ,"contributor_system_cd" ,data_detail->contributor_system_cd ) 			;008
		SET stat = uar_srvsetdouble (hce ,"parent_event_id" ,data_detail->event_id )
		SET stat = uar_srvsetdouble (hce ,"event_class_cd" ,c_event_class_mdoc )
		SET stat = uar_srvsetdouble (hce ,"event_cd" ,data_detail->event_cd )
		SET stat = uar_srvsetdouble (hce ,"event_reltn_cd" ,c_root_reltn_cd )
		SET stat = uar_srvsetdouble (hce ,"record_status_cd" ,reqdata->active_status_cd )
		SET stat = uar_srvsetdouble (hce ,"result_status_cd" , dDocStatus )
		SET stat = uar_srvsetshort (hce ,"authentic_flag" ,iAuthenticFlag )
		SET stat = uar_srvsetshort (hce ,"publish_flag" ,1 )
		SET stat = uar_srvsetstring (hce ,"event_title_text" ,nullterm (sDocSubject))
		SET stat = uar_srvsetdouble (hce ,"performed_prsnl_id" ,data_detail->performed_prsnl_id) 	;008
		SET stat = uar_srvsetdate (hce ,"performed_dt_tm" ,data_detail->performed_dt_tm ) 			;008
		SET stat = uar_srvsetlong(hce, "performed_tz", data_detail->time_zone) 						;004
		SET stat = uar_srvsetdate (hce ,"event_end_dt_tm" ,data_detail->event_end_dt_tm )
		SET stat = uar_srvsetlong (hce ,"event_end_tz",data_detail->time_zone)						;008
		SET stat = uar_srvsetdate (hce ,"event_start_dt_tm" ,data_detail->event_start_dt_tm ) 		;088
		SET stat = uar_srvsetlong (hce ,"event_start_tz",data_detail->time_zone)					;008
		SET stat = uar_srvsetdouble (hce ,"entry_mode_cd" ,data_detail->entry_mode_cd)
		SET stat = uar_srvsetdouble(hce, "updt_id",dUserId)
 
		declare sMsgTxt = vc
		declare eventPrsnlSize = i2
		declare 1005225_size = i2
		set 1005225_size = size(1005225_parent_rep->event_prsnl_list,5)
		set eventPrsnlSize = 1005225_size
 
		if(sDocStatusMean in ("TRANSCRIBED","IN PROGRESS"))
			set eventPrsnlSize = eventPrsnlSize + 1
		else
			SET stat = uar_srvsetdate (hce ,"verified_dt_tm" ,cnvtdatetime (curdate ,curtime3 ) )
			SET stat = uar_srvsetdouble (hce ,"verified_prsnl_id" ,dUserId)
 
			if(sDocStatusMean = "AUTH")
				set eventPrsnlSize = eventPrsnlSize + 3
			else
				set eventPrsnlSize = eventPrsnlSize + 2
			endif
		endif
 
		; Add additional event prsnl for new cosigner if provided ;006
		if(dCosignerId > 0 and iCosignerExists = 0)
			set eventPrsnlSize = eventPrsnlSize + 1
		endif
 
		declare iCheck = i2
		for(y = 1 to eventPrsnlSize)
			if(y <= 1005225_size )
				if(1005225_parent_rep->event_prsnl_list[y].valid_until_dt_tm < cnvtdatetime(curdate,curtime3))
					SET hprsnl = uar_srvadditem (hce ,"event_prsnl_list" )
					if(hprsnl = 0)
						call ErrorHandler2("VALIDATE", "F", " UAR_SRVADDITEM ", "Failed to allocate event_prsnl_list",
						"9999",build2("Failed to allocate event_prsnl_list - ",sMsgTxt), document_reply_out)
						go to EXIT_SCRIPT
					endif
					SET stat = uar_srvsetdouble (hprsnl ,"event_prsnl_id" ,1005225_parent_rep->event_prsnl_list[y].event_prsnl_id )
					SET stat = uar_srvsetdouble (hprsnl ,"person_id" ,1005225_parent_rep->event_prsnl_list[y].person_id )
					SET stat = uar_srvsetdouble (hprsnl ,"event_id" ,1005225_parent_rep->event_prsnl_list[y].event_id )
					SET stat = uar_srvsetdouble (hprsnl ,"action_type_cd" , 1005225_parent_rep->event_prsnl_list[y].action_type_cd )
					SET stat = uar_srvsetdate (hprsnl ,"request_dt_tm" ,1005225_parent_rep->event_prsnl_list[y].request_dt_tm )
					SET stat = uar_srvsetdouble (hprsnl ,"request_prsnl_id",1005225_parent_rep->event_prsnl_list[y].request_prsnl_id)
 
					if(sDocStatusMean = "AUTH" and 1005225_parent_rep->event_prsnl_list[y].action_type_cd = c_action_type_sign)
						SET stat = uar_srvsetdate (hprsnl ,"action_dt_tm" ,now_dt_tm)
						SET stat = uar_srvsetdouble (hprsnl ,"action_status_cd" ,c_action_status_completed )
					else
						SET stat = uar_srvsetdate (hprsnl ,"action_dt_tm" ,1005225_parent_rep->event_prsnl_list[y].action_dt_tm )
						SET stat = uar_srvsetdouble (hprsnl ,"action_status_cd" ,1005225_parent_rep->event_prsnl_list[y].action_status_cd )
					endif
					SET stat = uar_srvsetdouble (hprsnl ,"action_status_cd" ,1005225_parent_rep->event_prsnl_list[y].action_status_cd )
					SET stat = uar_srvsetdouble (hprsnl ,"action_prsnl_id" ,1005225_parent_rep->event_prsnl_list[y].action_prsnl_id)
					set sMsgTxt = uar_get_code_meaning(1005225_parent_rep->event_prsnl_list[y].action_type_cd)
				endif
			else
				SET hprsnl = uar_srvadditem (hce ,"event_prsnl_list" )
				if(hprsnl = 0)
					call ErrorHandler2("VALIDATE", "F", " UAR_SRVADDITEM ", "Failed to allocate event_prsnl_list",
					"9999",build2("Failed to allocate event_prsnl_list - ",sMsgTxt), document_reply_out)
					go to EXIT_SCRIPT
				endif
				set iCheck = y - 1005225_size
				SET stat = uar_srvsetdouble (hprsnl ,"person_id" ,data_detail->person_id )
				SET stat = uar_srvsetdouble (hprsnl ,"event_id" ,data_detail->event_id)
				SET stat = uar_srvsetdate (hprsnl ,"action_dt_tm" ,now_dt_tm )
				SET stat = uar_srvsetdouble(hprsnl,"updt_id",dUserId)
				case(sDocStatusMean)
					of value("IN PROGRESS","TRANSCRIBED"):
						if(iCheck > 1)
							SET stat = uar_srvsetdouble (hprsnl ,"action_prsnl_id" ,dCosignerId)
							SET stat = uar_srvsetdouble (hprsnl ,"action_type_cd" ,c_action_type_cosign )
							SET stat = uar_srvsetdouble (hprsnl ,"action_status_cd" ,c_action_status_pending )
							SET stat = uar_srvsetdate (hprsnl ,"request_dt_tm" ,now_dt_tm )
							SET stat = uar_srvsetdouble (hprsnl ,"request_prsnl_id" ,dUserId)
						else
							SET stat = uar_srvsetdouble (hprsnl ,"action_type_cd" , c_action_type_modify )
							SET stat = uar_srvsetdouble (hprsnl ,"action_prsnl_id" ,dUserId)
							SET stat = uar_srvsetdouble (hprsnl ,"action_status_cd" ,c_action_status_completed )
						endif
					of "AUTH":
						if(iCheck > 3)
							SET stat = uar_srvsetdouble (hprsnl ,"action_prsnl_id" ,dCosignerId)
							SET stat = uar_srvsetdouble (hprsnl ,"action_type_cd" ,c_action_type_cosign )
							SET stat = uar_srvsetdouble (hprsnl ,"action_status_cd" ,c_action_status_pending )
							SET stat = uar_srvsetdate 	(hprsnl ,"request_dt_tm" ,now_dt_tm )
							SET stat = uar_srvsetdouble (hprsnl ,"request_prsnl_id" ,dAuthorId)
						elseif(iCheck = 2)
							SET stat = uar_srvsetdouble (hprsnl ,"action_type_cd" , c_action_type_modify )
							SET stat = uar_srvsetdouble (hprsnl ,"action_prsnl_id" ,dAuthorId)
							SET stat = uar_srvsetdouble (hprsnl ,"action_status_cd" ,c_action_status_completed )
						elseif(iCheck = 1)
							SET stat = uar_srvsetdouble (hprsnl ,"action_type_cd" , c_action_type_sign )
							SET stat = uar_srvsetdouble (hprsnl ,"action_prsnl_id" ,dAuthorId)
							SET stat = uar_srvsetdouble (hprsnl ,"action_status_cd" ,c_action_status_completed )
						else
							SET stat = uar_srvsetdouble (hprsnl ,"action_type_cd" , c_action_type_verify )
							SET stat = uar_srvsetdouble (hprsnl ,"action_prsnl_id" ,dAuthorId)
							SET stat = uar_srvsetdouble (hprsnl ,"action_status_cd" ,c_action_status_completed )
						endif
					of "MODIFIED":
						if(iCheck > 2)
							SET stat = uar_srvsetdouble (hprsnl ,"action_prsnl_id" ,dCosignerId)
							SET stat = uar_srvsetdouble (hprsnl ,"action_type_cd" ,c_action_type_cosign )
							SET stat = uar_srvsetdouble (hprsnl ,"action_status_cd" ,c_action_status_pending )
							SET stat = uar_srvsetdate (hprsnl ,"request_dt_tm" ,now_dt_tm )
							SET stat = uar_srvsetdouble (hprsnl ,"request_prsnl_id" ,dUserId)
						elseif(iCheck = 1)
							SET stat = uar_srvsetdouble (hprsnl ,"action_type_cd" , c_action_type_modify )
							SET stat = uar_srvsetdouble (hprsnl ,"action_prsnl_id" ,dUserId)
							SET stat = uar_srvsetdouble (hprsnl ,"action_status_cd" ,c_action_status_completed )
						else
							SET stat = uar_srvsetdouble (hprsnl ,"action_type_cd" , c_action_type_sign )
							SET stat = uar_srvsetdouble (hprsnl ,"action_prsnl_id" ,dUserId)
							SET stat = uar_srvsetdouble (hprsnl ,"action_status_cd" ,c_action_status_completed )
						endif
				endcase
 
				set sMsgTxt = uar_get_code_meaning(uar_srvgetdouble(hprsnl,"action_status_cd"))
			endif
		endfor
 
		SET hce_type = uar_srvcreatetypefrom (cv_atr->hrequest ,"clin_event" )
		if(iDebugFlag > 0)
			call echo(build2("hCE_Type--->", hce_type))
		endif
 
		SET hce_struct = uar_srvgetstruct (cv_atr->hrequest ,"clin_event" )
		if(iDebugFlag > 0)
			call echo(build2("hCE_Struct--->", hce_struct))
		endif
 
		SET stat = uar_srvbinditemtype (hce_struct ,"child_event_list" ,hce_type )
		SET hce2 = uar_srvadditem (hce_struct ,"child_event_list" )
 
		if(iDebugFlag > 0)
			call echo(build2("hCE2--->", hce2))
		endif
 
		IF (hce2 )
			CALL uar_srvbinditemtype (hce2 ,"child_event_list" ,hce_type )
			if(sDocStatusMean = "MODIFIED")
				SET stat = uar_srvsetdouble (hce2 ,"event_id" ,0.0)
				SET stat = uar_srvsetshort (hce2 ,"authentic_flag" ,0 )
				set addend_line = build2("Addendum added by ",sPrsnlName," on ",trim(format(cnvtdatetime(curdate,curtime3),
				"MMMMMMMMM DD, YYYY HH:MM;;D"),3))
				SET stat = uar_srvsetstring(hce2, "event_title_text",addend_line)
				SET stat = uar_srvsetstring (hce2 ,"collating_seq" ,"2" )
				SET stat = uar_srvsetdate (hce2 ,"event_end_dt_tm" ,now_dt_tm ) ;006
			else
				SET stat = uar_srvsetdouble (hce2 ,"event_id" ,data_detail->child_event.event_id)
				SET stat = uar_srvsetshort (hce2 ,"authentic_flag" ,1)
				SET stat = uar_srvsetstring (hce2 ,"collating_seq" ,"1" )
				SET stat = uar_srvsetdate (hce2 ,"event_end_dt_tm" ,data_detail->event_end_dt_tm ) ;006
			endif
 
			SET stat = uar_srvsetdouble (hce2 ,"person_id" ,data_detail->person_id)
			SET stat = uar_srvsetdouble (hce2 ,"encntr_id" ,data_detail->encntr_id )
			SET stat = uar_srvsetdouble (hce2 ,"contributor_system_cd" ,data_detail->contributor_system_cd )
			SET stat = uar_srvsetdouble (hce2 ,"event_class_cd" ,c_event_class_doc )
			SET stat = uar_srvsetdouble (hce2 ,"event_cd" ,data_detail->event_cd )
			SET stat = uar_srvsetdouble (hce2 ,"event_reltn_cd" ,c_child_reltn_cd )
			SET stat = uar_srvsetdouble (hce2 ,"record_status_cd" ,reqdata->active_status_cd )
			SET stat = uar_srvsetdouble (hce2 ,"result_status_cd" , dDocStatus)
			SET stat = uar_srvsetlong (hce2 ,"view_level" ,0 )
			SET stat = uar_srvsetshort (hce2 ,"publish_flag" ,1 )
			SET stat = uar_srvsetdate (hce2 ,"performed_dt_tm" ,data_detail->performed_dt_tm )
			SET stat = uar_srvsetlong(hce2, "performed_tz", data_detail->time_zone) 						;004
			SET stat = uar_srvsetdouble (hce2 ,"performed_prsnl_id" ,data_detail->performed_prsnl_id)
			SET stat = uar_srvsetdouble (hce2 ,"entry_mode_cd" ,c_entry_mode_cd)
			SET stat = uar_srvsetdouble(hce2, "updt_id",dUserId)
 
			SET hblob = uar_srvadditem (hce2 ,"blob_result" )
			IF (hblob )
	   			if(sDocStatusMean in ("TRANSCRIBED","IN PROGRESS"))
					SET stat = uar_srvsetdouble (hblob ,"succession_type_cd" ,c_succession_interim)
				else
					SET stat = uar_srvsetdouble (hblob ,"succession_type_cd" ,c_succession_final)
				endif
				SET stat = uar_srvsetdouble (hblob ,"storage_cd" ,c_storage_blob )
				SET stat = uar_srvsetdouble (hblob ,"format_cd" ,dDocFormat)
				if(sDocStatusMean = "MODIFIED")
					SET stat = uar_srvsetdouble (hblob, "event_id",0.0)
				else
					SET stat = uar_srvsetdouble (hblob, "event_id",data_detail->child_event.event_id)
				endif
				SET stat = uar_srvsetshort (hblob ,"valid_from_dt_tm_ind" ,1 )
				SET stat = uar_srvsetshort (hblob ,"valid_until_dt_tm_ind" ,1 )
				SET stat = uar_srvsetshort (hblob ,"max_sequence_nbr" ,1 )
 
				SET hblob2 = uar_srvadditem (hblob ,"blob" )
				IF (hblob2 )
					if(iDebugFlag > 0)
						call echo(build2(" outBuffer -->", outBuffer))
					endif
					SET stat = uar_srvsetdouble (hblob2 ,"compression_cd" ,c_compression_cd )
					SET stat = uar_srvsetasis (hblob2  ,"blob_contents" ,outBuffer,note_size )
					if(sDocStatusMean = "MODIFIED")
						SET stat = uar_srvsetdouble (hblob2,"event_id",0.0)
					else
						SET stat = uar_srvsetdouble (hblob2,"event_id",data_detail->child_event.event_id)
					endif
					SET stat = uar_srvsetshort (hblob2 ,"valid_from_dt_tm_ind" ,1 )
					SET stat = uar_srvsetshort (hblob2 ,"valid_until_dt_tm_ind" ,1 )
					SET stat = uar_srvsetlong (hblob2 ,"blob_length" ,note_size )
 
				ELSE
					call ErrorHandler2("VALIDATE", "F", " UAR_SRVADDITEM ", "Failed to allocate blob",
					"9999", "Failed to allocate blob - blob_contents", document_reply_out)
					GO TO EXIT_SCRIPT
				ENDIF
 
			ELSE
				call ErrorHandler2("VALIDATE", "F", " UAR_SRVADDITEM ", "Failed to allocate blob",
				"9999", "Failed to allocate blob - blob_result", document_reply_out)
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
 
			set 1005225_size = size(1005225_child_rep->event_prsnl_list,5)
			set eventPrsnlSize = 1005225_size
			set eventPrsnlSize = eventPrsnlSize + 1
 
			for(y = 1 to eventPrsnlSize)
				set sMsgTxt = " "
				if(y <= 1005225_size )
					if(1005225_child_rep->event_prsnl_list[y].valid_until_dt_tm > cnvtdatetime(curdate,curtime3))
						SET hprsnl2 = uar_srvadditem (hce2 ,"event_prsnl_list" )
						if(hprsnl2 = 0)
							call ErrorHandler2("VALIDATE", "F", " UAR_SRVADDITEM ", "Failed to allocate child event_prsnl_list",
							"9999", sMsgTxt, document_reply_out)
							go to EXIT_SCRIPT
						endif
						SET stat = uar_srvsetdouble (hprsnl2,"event_prsnl_id" ,1005225_child_rep->event_prsnl_list[y].event_prsnl_id )
						SET stat = uar_srvsetdouble (hprsnl2 ,"person_id" ,1005225_child_rep->event_prsnl_list[y].person_id )
						SET stat = uar_srvsetdouble (hprsnl2 ,"event_id" ,1005225_child_rep->event_prsnl_list[y].event_id )
						SET stat = uar_srvsetdouble (hprsnl2 ,"action_type_cd" , 1005225_child_rep->event_prsnl_list[y].action_type_cd )
						SET stat = uar_srvsetdate (hprsnl2 ,"request_dt_tm" ,1005225_child_rep->event_prsnl_list[y].request_dt_tm )
						SET stat = uar_srvsetdate (hprsnl2 ,"action_dt_tm" ,1005225_child_rep->event_prsnl_list[y].action_dt_tm )
						SET stat = uar_srvsetdouble (hprsnl2 ,"action_status_cd" ,1005225_child_rep->event_prsnl_list[y].action_status_cd )
						SET stat = uar_srvsetdouble (hprsnl2 ,"action_prsnl_id" ,1005225_child_rep->event_prsnl_list[y].action_prsnl_id)
						set sMsgTxt = uar_get_code_meaning(1005225_child_rep->event_prsnl_list[y].action_type_cd)
					endif
				else
					SET hprsnl2 = uar_srvadditem (hce2 ,"event_prsnl_list" )
					if(hprsnl2 = 0)
						call ErrorHandler2("VALIDATE", "F", " UAR_SRVADDITEM ", "Failed to allocate child event_prsnl_list",
						"9999", sMsgTxt, document_reply_out)
						go to EXIT_SCRIPT
					endif
					SET stat = uar_srvsetdouble (hprsnl2 ,"person_id" ,data_detail->person_id)
					SET stat = uar_srvsetdouble (hprsnl2 ,"event_id" , data_detail->event_id )
					SET stat = uar_srvsetdouble (hprsnl2 ,"action_type_cd" , c_action_type_modify)
					SET stat = uar_srvsetdate (hprsnl2 ,"action_dt_tm" ,now_dt_tm)
					SET stat = uar_srvsetdouble (hprsnl2 ,"action_status_cd" , c_action_status_completed)
					SET stat = uar_srvsetdouble (hprsnl2 ,"action_prsnl_id" ,dUserId)
					set sMsgTxt = uar_get_code_meaning(c_action_type_modify)
				endif
			endfor
 
		ELSE
			call ErrorHandler2("VALIDATE", "F", " UAR_SRVADDITEM ", "Failed to allocate child_event_list",
			"9999", build2("Failed to allocate child event_prsnl_list - ",sMsgTxt), document_reply_out)
			GO TO EXIT_SCRIPT
		ENDIF
 
	ELSE
		call ErrorHandler2("VALIDATE", "F", " UAR_SRVGETSTRUCT ", "Failed to allocate clin_event",
		"9999", "Failed to allocate clin_event", document_reply_out)
		GO TO EXIT_SCRIPT
	ENDIF
 
	IF ((cvperformatr (null) != 0 ))
		GO TO EXIT_SCRIPT
	ENDIF
 
	SET hstatus = uar_srvgetstruct (cv_atr->hreply ,"sb" )
	IF (hstatus )
		SET reply->sb_severity = uar_srvgetlong (hstatus ,"severityCd" )
		SET reply->sb_status = uar_srvgetlong (hstatus ,"statusCd" )
		SET reply->sb_statustext = uar_srvgetstringptr (hstatus ,"statusText" )
	ELSE
		call ErrorHandler2("VALIDATE", "F", " UAR_SRVGETSTRUCT ", "hStatus returned F",
		"9999", "Invalid hStatus: F", document_reply_out)
		GO TO EXIT_SCRIPT
	ENDIF
 
	SET rb_cnt = uar_srvgetitemcount (cv_atr->hreply ,"rb_list" )
	IF ((rb_cnt >= 1 ) )
		SET hrb = uar_srvgetitem (cv_atr->hreply ,"rb_list" ,1 )
		SET document_reply_out->document_id = uar_srvgetdouble (hrb ,"parent_event_id" )
		SET document_reply_out->result_status_cd = uar_srvgetdouble (hrb ,"result_status_cd" )
		if(iDebugFlag > 0)
			call echo(build2("parent_event_id -->", document_reply_out->document_id))
		endif
	ELSE
		call ErrorHandler2("VALIDATE", "F", " UAR_SRVGETSTRUCT ", build2("Error updating document",reply->sb_statustext),
		"9999", build2("Error updating document",reply->sb_statustext), document_reply_out)
		GO TO EXIT_SCRIPT
	ENDIF
 
 	; Transaction is successful Update status
	call ErrorHandler2("PUT DOCUMENT", "S", "Process completed", "Document has been updated successfully",
	"0000", build2("Document ID: ",data_detail->event_id, " has been updated to status ",sDocStatusMean), document_reply_out)
 
	if(iDebugFlag > 0)
		call echo(concat("PostDocument Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Subroutine
 
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
		set 967143_req->task_list[idx].msg_subject = uar_get_code_display(data_detail->event_cd)
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
		set 967143_req->task_list[idx].msg_subject = uar_get_code_display(data_detail->event_cd)
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
 
 
 
