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
*                                                                     *
  ~BE~***********************************************************************/
/*****************************************************************************
          Date Written:       05/28/15
          Source file name:   snsro_get_documents
          Object name:        snsro_get_documents
          Request #:
          Program purpose:    Returns all Documents
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
  000 05/28/15   AAB		    Initial write
  001 06/29/15   AAB            Changed active_ind to i4 and check record_status_cd
								to set the value
  002 08/05/15   AAB 			Add Document_format to Master document
  003 08/18/15   AAB            Check format_cd from ce_blob_result table
  004 08/23/15   AAB            Parent_event_id was set incorrectly.
  005 09/14/2015 AAB			Add audit object
  006 12/9/15    AAB			Return encntr_type_cd and encntr_type_disp
  007 12/19/15   AAB 			Externalize event_set_cd
  008 02/22/16   AAB			Add encntr_type_cd and encntr_type_disp
  009 04/26/16   JCO			Added document author
  010 04/29/16   AAB 			Added version
  011 05/05/16   AAB  			Return Rad documents and Clinical Documents
  012 10/10/16   AAB 			Add DEBUG_FLAG
  013 07/27/17   JCO			Changed %i to execute; update ErrorHandler2
  014 08/17/17   JCO			Added UTC logic
  015 03/21/18	 RJC			Added version code and copyright block
 ***********************************************************************/
drop program snsro_get_documents go
create program snsro_get_documents
 
/************************************************************************
; REQUEST
************************************************************************/
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Person Id:" 		= 0.0
		, "Encounter Id :"  = 0.0
		, "From Date:" 		= "01-JAN-1900"	; default beginning of time
		, "To Date:" 		= ""	; default end of time
 		, "User Name:" 		= ""        ;005
		, "Event_set"		= 0.0		;007
  		, "Debug Flag" 		= 0		;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, PERSON_ID, ENCNTR_ID, FROM_DATE, TO_DATE, USERNAME, EVENT_SET_CD, DEBUG_FLAG   ;012   ;005  007

/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.16.6.1" ;015
if($OUTDEV = "VERSION")
	go to exit_version
endif

/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record req_event_query
record req_event_query (
  1 query_mode  = i4
  1 query_mode_ind = i2
  1 event_set_cd = f8
  1 person_id = f8
  1 order_id = f8
  1 encntr_id = f8
  1 encntr_financial_id = f8
  1 contributor_system_cd = f8
  1 accession_nbr = vc
  1 compress_flag = i2
  1 subtable_bit_map = i4
  1 subtable_bit_map_ind = i2
  1 small_subtable_bit_map = i4
  1 small_subtable_bit_map_ind = i2
  1 search_anchor_dt_tm = dq8
  1 search_anchor_dt_tm_ind = i2
  1 seconds_duration = f8
  1 direction_flag = i2
  1 events_to_fetch = i4
  1 date_flag = i2
  1 view_level = i4
  1 non_publish_flag = i2
  1 valid_from_dt_tm = dq8
  1 valid_from_dt_tm_ind = i2
  1 decode_flag = i2
  1 encntr_list [*]
    2 encntr_id = f8
  1 event_set_list [*]
    2 event_set_name = vc
  1 encntr_type_class_list [*]
    2 encntr_type_class_cd = f8
  1 order_id_list_ext [*]
    2 order_id = f8
  1 event_set_cd_list_ext [*]
    2 event_set_cd = f8
    2 event_set_name = vc
    2 fall_off_seconds_dur = f8
  1 ordering_provider_id = f8
  1 action_prsnl_id = f8
  1 query_mode2  = i4
  1 encntr_type_list [*]
    2 encntr_type_cd = f8
  1 end_of_day_tz = i4
  1 perform_prsnl_list [*]
    2 perform_prsnl_id = f8
  1 result_status_list [*]
    2 result_status_cd = f8
  1 search_begin_dt_tm = dq8
  1 search_end_dt_tm = dq8
  1 action_prsnl_group_id = f8
)
 
free record rep_event_query
record rep_event_query (
  1 sb
    2 severityCd = i4
    2 statusCd = i4
    2 statusText = vc
    2 subStatusList [*]
        3 subStatusCd = i4
  1 query_dt_tm = dq8
  1 query_dt_tm_ind = i2
  1 rb_list [*]
    2 event_set_list [*]
		3 self_name = vc
		3 self_cd = f8
		3 self_disp = vc
		3 self_descr = vc
		3 self_icon_name = vc
		3 primitive_ind = i2
		3 primitive_ind_ind = i2
		3 collating_seq = i4
		3 collating_seq_ind = i2
		3 category_flag = i2
		3 category_flag_ind = i2
		3 parent_event_set_cd = f8
		3 show_if_no_data_ind = i2
		3 show_if_no_data_ind_ind = i2
		3 grouping_rule_flag = i2
		3 grouping_rule_flag_ind = i2
		3 accumulation_ind = i2
		3 accumulation_ind_ind = i2
		3 display_association_ind = i2
		3 display_association_ind_ind = i2
		3 concept_cki = vc
    2 event_list [*]
		3 clinical_event_id = f8
		3 event_id = f8
		3 view_level = i4
		3 encntr_id = f8
		3 order_id = f8
		3 catalog_cd = f8
		3 parent_event_id = f8
		3 event_class_cd = f8
		3 event_cd = f8
		3 event_cd_disp = vc
		3 event_tag = vc
		3 event_end_dt_tm = dq8
		3 event_end_dt_tm_ind = i2
		3 task_assay_cd = f8
		3 record_status_cd = f8
		3 record_status_cd_disp = vc
		3 result_status_cd = f8
		3 result_status_cd_disp = vc
		3 publish_flag = i2
		3 normalcy_cd = f8
		3 subtable_bit_map = i4
		3 event_title_text = vc
		3 result_val = vc
		3 result_units_cd = f8
		3 result_units_cd_disp = vc
		3 performed_dt_tm = dq8
		3 performed_dt_tm_ind = i2
		3 performed_prsnl_id = f8
		3 normal_low = vc
		3 normal_high = vc
		3 reference_nbr = vc
		3 contributor_system_cd = f8
		3 valid_from_dt_tm = dq8
		3 valid_from_dt_tm_ind = i2
		3 valid_until_dt_tm = dq8
		3 valid_until_dt_tm_ind = i2
		3 note_importance_bit_map = i2
		3 updt_dt_tm = dq8
		3 updt_dt_tm_ind = i2
		3 updt_id = f8
		3 clinsig_updt_dt_tm = dq8
		3 clinsig_updt_dt_tm_ind = i2
	    3 collating_seq = vc
		3 order_action_sequence = i4
		3 entry_mode_cd = f8
		3 source_cd = f8
		3 source_cd_disp = vc
		3 source_cd_mean = vc
		3 clinical_seq = vc
		3 event_end_tz = i2
		3 performed_tz = i2
		3 task_assay_version_nbr = f8
		3 modifier_long_text = vc
		3 modifier_long_text_id = f8
		3 endorse_ind = i2
		3 new_result_ind = i2
		3 organization_id = f8
		3 src_event_id = f8
		3 src_clinsig_updt_dt_tm = dq8
		3 person_id = f8
		3 nomen_string_flag = i2
		3 ce_dynamic_label_id = f8
		3 trait_bit_map = i4
		3 order_action_sequence = i4
		3 event_prsnl_list [*]
			4 event_id					= f8
			4 action_type_cd			= f8
			4 action_type_cd_disp   	= vc
			4 request_dt_tm				= dq8
			4 request_dt_tm_ind			= i2
			4 request_prsnl_id			= f8
			4 request_prsnl_ft			= vc
			4 action_dt_tm				= dq8
			4 action_dt_tm_ind			= i2
			4 action_prsnl_id			= f8
			4 action_prsnl_ft			= vc
			4 proxy_prsnl_id			= f8
			4 proxy_prsnl_ft			= vc
			4 action_status_cd			= f8
			4 action_status_cd_disp		= vc
			4 valid_from_dt_tm			= dq8
			4 valid_from_dt_tm_ind		= i2
			4 valid_until_dt_tm			= dq8
			4 valid_until_dt_tm_ind		= i2
			4 linked_event_id			= f8
			4 request_tz				= i2
			4 action_tz					= i2
			4 event_prsnl_id			= f8
			4 system_comment			= vc
			4 digital_signature_ident	= vc
			4 action_prsnl_group_id		= f8
			4 request_prsnl_group_id	= f8
 
 
%i cclsource:status_block.inc
)
 
 
free record documents_reply_out
record documents_reply_out
(
	1 master_document[*]
		2 document_id 			= f8		;event_id
		2 document_name 		= vc		;event_code display
		2 document_title		= vc		;TitleText
		2 document_ref_cd		= f8		;event_code
		2 document_dt_tm		= dq8		;event_end_dt_tm
		2 document_status		= vc		;result status display
		2 document_format		= vc		;cen.format_cd   ;002
		2 person_id				= f8
		2 encntr_id 			= f8
		2 encntr_type_cd		= f8	;006
		2 encntr_type_disp		= vc	;006
		2 encntr_type_class_cd	= f8	;008
		2 encntr_type_class_disp= vc	;008
		2 order_id				= f8
		2 view_level			= i4
		2 parent_document_id	= f8
		2 active_ind			= i2		;record status = ACTIVE ?   001
		2 publish_flag			= i2		;published display
		2 document_author		= vc	;009
	1 audit			;005
		2 user_id							= f8
		2 user_firstname					= vc
		2 user_lastname						= vc
		2 patient_id						= f8
		2 patient_firstname					= vc
		2 patient_lastname					= vc
		2 service_version					= vc			;010
;013 %i cclsource:status_block.inc
/*013 being */
	  1 status_data
	    2 status = c1
	    2 subeventstatus[1]
	      3 OperationName = c25
	      3 OperationStatus = c1
	      3 TargetObjectName = c25
	      3 TargetObjectValue = vc
	      3 Code = c4
	      3 Description = vc
/*013 end */
)
set documents_reply_out->status_data->status = "F"
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
declare dPersonID  				= f8 with protect, noconstant(0.0)
declare dEncntrID           	= f8 with protect, noconstant(0.0)
declare clin_doc_event_set_cd 	= f8 with protect, noconstant(uar_get_code_by("DISPLAY_KEY", 93, "CLINICALDOC"))
declare rad_doc_event_set_cd 	= f8 with protect, noconstant(uar_get_code_by("DISPLAY_KEY", 93, "RADIOLOGYRESULTS")) ;011
declare sFromDate				= vc with protect, noconstant("")
declare sToDate					= vc with protect, noconstant("")
declare sUserName					= vc with protect, noconstant("")   ;005
declare iRet						= i2 with protect, noconstant(0) 	;005
declare APPLICATION_NUMBER 			= i4 with protect, constant (600005)
declare TASK_NUMBER 				= i4 with protect, constant (600107)
declare REQ_NUM_EVENT 				= i4 with protect, constant (1000001)
declare event_set_cd 				= f8 with protect, noconstant(0.0) 		;007
declare total_size					= i4 with protect, noconstant(0)
declare Section_Start_Dt_Tm 		= DQ8 WITH PROTECT, NOCONSTANT(CNVTDATETIME(CURDATE, CURTIME3))
declare idebugFlag					= i2 with protect, noconstant(0) ;012
declare UTCmode						= i2 with protect, noconstant(0);014
declare UTCpos 						= i2 with protect, noconstant(0);014
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
set sUserName		= trim($USERNAME, 3)   ;005
set dPersonID   	= cnvtint($PERSON_ID)
set dEncntrID    	= cnvtint($ENCNTR_ID)
set sFromDate		= trim($FROM_DATE, 3)
set sToDate			= trim($TO_DATE, 3)
set event_set_cd    = cnvtint($EVENT_SET_CD)	;007
set UTCmode			= CURUTC ;014
set UTCpos			= findstring("Z",sFromDate,1,0);014
 
 
if(event_set_cd > 0.0)
	set clin_doc_event_set_cd = event_set_cd
endif										;001 -
 
set idebugFlag				= cnvtint($DEBUG_FLAG)  ;012
 
if(idebugFlag > 0)
 
	call echo(build("clin_doc_event_set_cd  ->", clin_doc_event_set_cd))
	call echo(build("clin_doc_event_set_cd  ->", rad_doc_event_set_cd))
	call echo(build("$FROM_DATE -->",sFromDate))
	call echo(build("$TO_DATE -->",sToDate))
	call echo(build("sUserName  ->", sUserName))
	call echo(build("UTC MODE -->",UTCmode));014
 	call echo(build("UTC POS -->",UTCpos));014
 
 
endif
 
 
/****************************************************************************
;INCLUDES
****************************************************************************/
;013 %i ccluserdir:snsro_common.inc
execute snsro_common
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetAllDocuments(null)				= null with protect
declare PostAmble(null)						= null with protect
declare GetFormat(dDocumentID = f8)			= vc with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
 
if(dPersonID > 0)
	set iRet = PopulateAudit(sUserName, dPersonID, documents_reply_out, sVersion)   ;010   ;006
 
	if(iRet = 0)  ;004
		call ErrorHandler2("VALIDATE", "F", "DOCUMENTS", "Invalid User for Audit.",
		"1001", build("UserId is invalid: ", sUserName), documents_reply_out)	;013
		go to EXIT_SCRIPT
 
	endif
 
	call GetAllDocuments(null)
	;call PostAmble(null)
 	call ErrorHandler("VALIDATE", "S", "DOCUMENTS", "Document retrieval Successful", documents_reply_out)
 
else
 
	call ErrorHandler2("VALIDATE", "F", "DOCUMENTS", "Missing required field: Person ID.",
	"2055", "PatientId is missing.", documents_reply_out)	;013
	go to EXIT_SCRIPT
endif
 
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
	set JSONout = CNVTRECTOJSON(documents_reply_out)
 
if(idebugFlag > 0)
 
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_documents.json")
	call echo(build2("_file : ", _file))
	call echojson(documents_reply_out, _file, 0)
    call echorecord(documents_reply_out)
	call echo(JSONout)
 
endif
 
    if(validate(_MEMORY_REPLY_STRING))
		set _MEMORY_REPLY_STRING = trim(JSONout,3)
	endif

#EXIT_VERSION
/*************************************************************************
;  Name: GetAllDocuments(null)
;  Description: Retrieve all Clinical Documents for patient
;
**************************************************************************/
subroutine GetAllDocuments( null )
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetAllDocuments Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
declare iResultCnt      = i4 with protect, noconstant(0)
 
set req_event_query->query_mode  				= 33793
set req_event_query->query_mode_ind 			= 0
set req_event_query->event_set_cd 				= clin_doc_event_set_cd
set req_event_query->person_id 					= dPersonID
set req_event_query->order_id 					= 0
set req_event_query->encntr_id 					= dEncntrID
set req_event_query->encntr_financial_id 		= 0
set req_event_query->contributor_system_cd 		= 0
set req_event_query->accession_nbr 				= ""
set req_event_query->compress_flag 				= 1
set req_event_query->subtable_bit_map 			= 1
set req_event_query->subtable_bit_map_ind 		= 0
set req_event_query->small_subtable_bit_map 	= 1
set req_event_query->small_subtable_bit_map_ind = 0
 
/*014 UTC begin */
 if (UTCmode = 1 and UTCpos > 0)
	set startDtTm = cnvtdatetimeUTC(sFromDate) ;;;
	if (sToDate = "")
	;set endDtTm2 = cnvtdatetime(cnvtdatetime(curdate,curtime3))
		set endDtTm = cnvtdatetimeUTC(cnvtdatetimeUTC(curdate,curtime3-60))
	else
		set endDtTm = cnvtdatetimeUTC(sToDate)
	endif
else
	set startDtTm = cnvtdatetime(sFromDate)
	if (sToDate = "")
	;set endDtTm2 = cnvtdatetime(cnvtdatetime(curdate,curtime3))
		set endDtTm = cnvtdatetime(cnvtdatetime(curdate,curtime3-60))
	else
		set endDtTm = cnvtdatetime(sToDate)
	endif
endif
 
set req_event_query->search_anchor_dt_tm 		= endDtTm
set start_dt_tm = startDtTm
set end_dt_tm = cnvtdatetime(req_event_query->search_anchor_dt_tm)
/*014 UTC end */
 
if(idebugFlag > 0)
 
	call echo(build("start_dt_tm ->", start_dt_tm))
	call echo(build("end_dt_tm ->", end_dt_tm))
	call echo(build("SECONDS DURATION-->", datetimediff(start_dt_tm,end_dt_tm,5)))
 
endif
 
set req_event_query->search_anchor_dt_tm_ind 	= 0
set req_event_query->seconds_duration 			= datetimediff(start_dt_tm,end_dt_tm,5)
set req_event_query->direction_flag 			= 0
set req_event_query->events_to_fetch 			= 0
set req_event_query->date_flag 					= 0
set req_event_query->view_level 				= 0
set req_event_query->non_publish_flag 			= 1
set req_event_query->valid_from_dt_tm 			= cnvtdatetime("0000-00-00 00:00:00.00")
set req_event_query->valid_from_dt_tm_ind 		= 1
set req_event_query->decode_flag 				= 0
;set req_event_query->encntr_list [*]->encntr_id = 0
set req_event_query->ordering_provider_id 		= 0
set req_event_query->action_prsnl_id 			= 0
set req_event_query->query_mode2  				= 0
set req_event_query->end_of_day_tz 				= 0
set req_event_query->search_begin_dt_tm 		= cnvtdatetime("0000-00-00 00:00:00.00")
set req_event_query->search_end_dt_tm 			= cnvtdatetime("0000-00-00 00:00:00.00")
set req_event_query->action_prsnl_group_id 		= 0
 
if(idebugFlag > 0)
 
	call echorecord(req_event_query)
 
endif
 
set stat = tdbexecute(APPLICATION_NUMBER, TASK_NUMBER, REQ_NUM_EVENT,"REC",req_event_query,"REC",rep_event_query)
 
if (rep_event_query->status_data->status = "F")
	call ErrorHandler2("EXECUTE", "F", "DOCUMENTS", "Error retrieving Documents",
	"9999", "Error retrieving documents - request 1000001.", documents_reply_out)	;013
	go to EXIT_SCRIPT
endif
 
/*
if(size(rep_event_query->rb_list[1]->event_list, 5) = 0)
 
	call ErrorHandler("EXECUTE", "Z", "No records found", "No records found", documents_reply_out)
	go to EXIT_SCRIPT
endif
*/
 
if(idebugFlag > 0)
 
	call echo(build("Size of REPLY 1 ->", size(rep_event_query->rb_list[1]->event_list, 5) ))
 
endif
 
if(size(rep_event_query->rb_list[1]->event_list, 5) > 0)
 
call PostAmble(null)
 
endif
;011 +
free record rep_event_query
record rep_event_query (
  1 sb
    2 severityCd = i4
    2 statusCd = i4
    2 statusText = vc
    2 subStatusList [*]
        3 subStatusCd = i4
  1 query_dt_tm = dq8
  1 query_dt_tm_ind = i2
  1 rb_list [*]
    2 event_set_list [*]
		3 self_name = vc
		3 self_cd = f8
		3 self_disp = vc
		3 self_descr = vc
		3 self_icon_name = vc
		3 primitive_ind = i2
		3 primitive_ind_ind = i2
		3 collating_seq = i4
		3 collating_seq_ind = i2
		3 category_flag = i2
		3 category_flag_ind = i2
		3 parent_event_set_cd = f8
		3 show_if_no_data_ind = i2
		3 show_if_no_data_ind_ind = i2
		3 grouping_rule_flag = i2
		3 grouping_rule_flag_ind = i2
		3 accumulation_ind = i2
		3 accumulation_ind_ind = i2
		3 display_association_ind = i2
		3 display_association_ind_ind = i2
		3 concept_cki = vc
    2 event_list [*]
		3 clinical_event_id = f8
		3 event_id = f8
		3 view_level = i4
		3 encntr_id = f8
		3 order_id = f8
		3 catalog_cd = f8
		3 parent_event_id = f8
		3 event_class_cd = f8
		3 event_cd = f8
		3 event_cd_disp = vc
		3 event_tag = vc
		3 event_end_dt_tm = dq8
		3 event_end_dt_tm_ind = i2
		3 task_assay_cd = f8
		3 record_status_cd = f8
		3 record_status_cd_disp = vc
		3 result_status_cd = f8
		3 result_status_cd_disp = vc
		3 publish_flag = i2
		3 normalcy_cd = f8
		3 subtable_bit_map = i4
		3 event_title_text = vc
		3 result_val = vc
		3 result_units_cd = f8
		3 result_units_cd_disp = vc
		3 performed_dt_tm = dq8
		3 performed_dt_tm_ind = i2
		3 performed_prsnl_id = f8
		3 normal_low = vc
		3 normal_high = vc
		3 reference_nbr = vc
		3 contributor_system_cd = f8
		3 valid_from_dt_tm = dq8
		3 valid_from_dt_tm_ind = i2
		3 valid_until_dt_tm = dq8
		3 valid_until_dt_tm_ind = i2
		3 note_importance_bit_map = i2
		3 updt_dt_tm = dq8
		3 updt_dt_tm_ind = i2
		3 updt_id = f8
		3 clinsig_updt_dt_tm = dq8
		3 clinsig_updt_dt_tm_ind = i2
	    3 collating_seq = vc
		3 order_action_sequence = i4
		3 entry_mode_cd = f8
		3 source_cd = f8
		3 source_cd_disp = vc
		3 source_cd_mean = vc
		3 clinical_seq = vc
		3 event_end_tz = i2
		3 performed_tz = i2
		3 task_assay_version_nbr = f8
		3 modifier_long_text = vc
		3 modifier_long_text_id = f8
		3 endorse_ind = i2
		3 new_result_ind = i2
		3 organization_id = f8
		3 src_event_id = f8
		3 src_clinsig_updt_dt_tm = dq8
		3 person_id = f8
		3 nomen_string_flag = i2
		3 ce_dynamic_label_id = f8
		3 trait_bit_map = i4
		3 order_action_sequence = i4
		3 event_prsnl_list [*]
			4 event_id					= f8
			4 action_type_cd			= f8
			4 action_type_cd_disp   	= vc
			4 request_dt_tm				= dq8
			4 request_dt_tm_ind			= i2
			4 request_prsnl_id			= f8
			4 request_prsnl_ft			= vc
			4 action_dt_tm				= dq8
			4 action_dt_tm_ind			= i2
			4 action_prsnl_id			= f8
			4 action_prsnl_ft			= vc
			4 proxy_prsnl_id			= f8
			4 proxy_prsnl_ft			= vc
			4 action_status_cd			= f8
			4 action_status_cd_disp		= vc
			4 valid_from_dt_tm			= dq8
			4 valid_from_dt_tm_ind		= i2
			4 valid_until_dt_tm			= dq8
			4 valid_until_dt_tm_ind		= i2
			4 linked_event_id			= f8
			4 request_tz				= i2
			4 action_tz					= i2
			4 event_prsnl_id			= f8
			4 system_comment			= vc
			4 digital_signature_ident	= vc
			4 action_prsnl_group_id		= f8
			4 request_prsnl_group_id	= f8
 
 
%i cclsource:status_block.inc
)
 
set req_event_query->query_mode  				= 33793
set req_event_query->query_mode_ind 			= 0
set req_event_query->event_set_cd 				= rad_doc_event_set_cd
set req_event_query->person_id 					= dPersonID
set req_event_query->order_id 					= 0
set req_event_query->encntr_id 					= dEncntrID
set req_event_query->encntr_financial_id 		= 0
set req_event_query->contributor_system_cd 		= 0
set req_event_query->accession_nbr 				= ""
set req_event_query->compress_flag 				= 1
set req_event_query->subtable_bit_map 			= 1
set req_event_query->subtable_bit_map_ind 		= 0
set req_event_query->small_subtable_bit_map 	= 1
set req_event_query->small_subtable_bit_map_ind = 0
 
if(sToDate = "")
 
	set req_event_query->search_anchor_dt_tm 		= cnvtdatetime(curdate,curtime3)
 
else
 
	set req_event_query->search_anchor_dt_tm 		= cnvtdatetime(sToDate)
 
endif
 
set start_dt_tm = cnvtdatetime(sFromDate)
set end_dt_tm = cnvtdatetime(req_event_query->search_anchor_dt_tm)
 
if(idebugFlag > 0)
 
	call echo(build("start_dt_tm ->", start_dt_tm))
	call echo(build("end_dt_tm ->", end_dt_tm))
	call echo(build("SECONDS DURATION-->", datetimediff(start_dt_tm,end_dt_tm,5)))
 
endif
 
set req_event_query->search_anchor_dt_tm_ind 	= 0
set req_event_query->seconds_duration 			= datetimediff(start_dt_tm,end_dt_tm,5)
set req_event_query->direction_flag 			= 0
set req_event_query->events_to_fetch 			= 0
set req_event_query->date_flag 					= 0
set req_event_query->view_level 				= 0
set req_event_query->non_publish_flag 			= 1
set req_event_query->valid_from_dt_tm 			= cnvtdatetime("0000-00-00 00:00:00.00")
set req_event_query->valid_from_dt_tm_ind 		= 1
set req_event_query->decode_flag 				= 0
;set req_event_query->encntr_list [*]->encntr_id = 0
set req_event_query->ordering_provider_id 		= 0
set req_event_query->action_prsnl_id 			= 0
set req_event_query->query_mode2  				= 0
set req_event_query->end_of_day_tz 				= 0
set req_event_query->search_begin_dt_tm 		= cnvtdatetime("0000-00-00 00:00:00.00")
set req_event_query->search_end_dt_tm 			= cnvtdatetime("0000-00-00 00:00:00.00")
set req_event_query->action_prsnl_group_id 		= 0
 
if(idebugFlag > 0)
 
	call echorecord(req_event_query)
 
endif
 
set stat = tdbexecute(APPLICATION_NUMBER, TASK_NUMBER, REQ_NUM_EVENT,"REC",req_event_query,"REC",rep_event_query)
 
if (rep_event_query->status_data->status = "F")
	call ErrorHandler2("EXECUTE", "F", "DOCUMENTS", "Error retrieving Documents",
	"9999", "Error retrieving documents - request 1000001.", documents_reply_out)	;013
	go to EXIT_SCRIPT
endif
/*
if(size(rep_event_query->rb_list[1]->event_list, 5) = 0)
 
	call ErrorHandler("EXECUTE", "Z", "No records found", "No records found", documents_reply_out)
	go to EXIT_SCRIPT
endif
*/
 
call echorecord( rep_event_query)
if(size(rep_event_query->rb_list[1]->event_list, 5) > 0)
 
call PostAmble(null)
 
endif
 
;011 -
if(idebugFlag > 0)
 
	call echo(build("Size of REPLY 2 ->", size(rep_event_query->rb_list[1]->event_list, 5) ))
	call echo(build("total_size 2 ->", total_size ))
 
endif
 
if( size(documents_reply_out->master_document, 5) = 0)
 
	call ErrorHandler("EXECUTE", "Z", "DOCUMENTS", "No records found", documents_reply_out)
	go to EXIT_SCRIPT
endif
 
 
if(idebugFlag > 0)
 
	call echo(concat("GetAllDocuments Runtime: ",
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
if(total_size > 0)
set x = total_size
else
set total_size = 1
 
endif
 
;iterate through event detail reply
for(x = total_size to size(rep_event_query->rb_list[1]->event_list,5))
 
	set stat = alterlist(documents_reply_out->master_document,x)
 
	set documents_reply_out->master_document[x].document_id = rep_event_query->rb_list[1]->event_list[x].event_id
	set documents_reply_out->master_document[x].document_name = rep_event_query->rb_list[1]->event_list[x].event_cd_disp
	set documents_reply_out->master_document[x].document_title = rep_event_query->rb_list[1]->event_list[x].event_title_text
	set documents_reply_out->master_document[x].document_ref_cd = rep_event_query->rb_list[1]->event_list[x].event_cd
	set documents_reply_out->master_document[x].document_dt_tm = rep_event_query->rb_list[1]->event_list[x].event_end_dt_tm
	set documents_reply_out->master_document[x].document_format =
		GetFormat(rep_event_query->rb_list[1]->event_list[x].parent_event_id)	;002
	set documents_reply_out->master_document[x].document_status = rep_event_query->rb_list[1]->event_list[x].result_status_cd_disp
	set documents_reply_out->master_document[x].person_id = rep_event_query->rb_list[1]->event_list[x].person_id
	set documents_reply_out->master_document[x].encntr_id = rep_event_query->rb_list[1]->event_list[x].encntr_id
	set documents_reply_out->master_document[x].encntr_type_cd =
		GetPatientClass(documents_reply_out->master_document[x].encntr_id,1 )	        ;006
	set documents_reply_out->master_document[x].encntr_type_disp =
		uar_get_code_display(documents_reply_out->master_document[x].encntr_type_cd) ;006
	set documents_reply_out->master_document[x].encntr_type_class_cd =
		GetPatientClass(documents_reply_out->master_document[x].encntr_id,2 )	        ;008
	set documents_reply_out->master_document[x].encntr_type_class_disp =
		uar_get_code_display(documents_reply_out->master_document[x].encntr_type_class_cd) ;008
 
	set documents_reply_out->master_document[x].order_id = rep_event_query->rb_list[1]->event_list[x].order_id
	set documents_reply_out->master_document[x].view_level = rep_event_query->rb_list[1]->event_list[x].view_level
	set documents_reply_out->master_document[x].parent_document_id = rep_event_query->rb_list[1]->event_list[x].parent_event_id  ;004
    set documents_reply_out->master_document[x].document_author =
    	GetNameFromPrsnlID(rep_event_query->rb_list[1]->event_list[x].performed_prsnl_id)		;009
	if(rep_event_query->rb_list[1]->event_list[x].record_status_cd_disp = "Active")     ;001
		set documents_reply_out->master_document[x].active_ind= 1
	else
		set documents_reply_out->master_document[x].active_ind = 0
	endif
 
	set documents_reply_out->master_document[x].publish_flag = rep_event_query->rb_list[1]->event_list[x].publish_flag
 
endfor
 
 set total_size = size(rep_event_query->rb_list[1]->event_list,5)
 
 if(idebugFlag > 0)
 
	call echo(build("TOTAL SIZE -> ", total_size))
 
endif
 
if(idebugFlag > 0)
 
	call echo(concat("PostAmble Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
/*************************************************************************
;  Name: GetFormat(dDocumentID = f8)	;002 003
;  Description: Subroutine to get Format Type
;
**************************************************************************/
subroutine GetFormat(dDocumentID)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetFormat Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
declare doc_cd 	= f8 with protect, constant(uar_get_code_by("MEANING", 53, "DOC"))
 
declare sFormat						= vc with protect, noconstant("")
    select into "nl:"
		ceb.format_cd
	from
	clinical_event ce
	,ce_blob_result  ceb
 
	plan ce
 
	where ce.parent_event_id = dDocumentID and ce.event_class_cd = doc_cd
 
    join ceb where ceb.event_id = outerjoin (ce.event_id)
 
	and ceb.valid_until_dt_tm >= outerjoin(cnvtdatetime(curdate, curtime3))
 
 
	detail
 
		sFormat = uar_get_code_display (ceb.format_cd)
 
	with nocounter
 
	return (sFormat)
 
 
 if(idebugFlag > 0)
 
	call echo(concat("GetFormat Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
end go
 
