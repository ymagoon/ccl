/*~BB~***********************************************************************************
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
*                                                                    			*
  ~BE~***********************************************************************************/
/*****************************************************************************************
          Date Written:       	06/08/15
          Source file name:   	snsro_get_document_discovery
          Object name:        	snsro_get_document_discovery
          Program purpose:    Queries for all document types
          Tables read:
          Tables updated:     	NONE
		  Services Called:		1000013 - event_set_query
          Executing from:     	EMISSARY SERVICES
          Special Notes:	  		NONE
 
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
  000 06/08/15  AAB		    	Initial write
  001 12/19/15  AAB 			Externalize event_set_cd
  002 04/29/16  AAB 			Added version
  003 10/10/16  AAB 			Add DEBUG_FLAG
  004 07/27/17  JCO				Changed %i to execute; updated ErrorHandler2
  005 02/21/18	RJC				Rewrite. Now will build dynamic record structure to accommodate deep event nesting.
  006 03/21/18	RJC				Added version code and copyright block
  007 03/30/18  RJC				Bug fix. Renamed subroutine
  008 05/10/18	RJC				Rewrite. Dynamic build was too memory intensive. The dynamic build is now handled in Emissary
 ***********************************************************************/
drop program snsro_get_document_discovery go
create program snsro_get_document_discovery
 
/************************************************************************
; REQUEST
************************************************************************/
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username" = ""
		, "Event_set"	= ""
		, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, USERNAME, EVENT_SET_CD, DEBUG_FLAG
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.16.6.1" ;006
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record 1000013_req
record 1000013_req (
  1 batch_size  			= i4
  1 event_set_name 			= vc
  1 event_set_disp 			= vc
  1 event_set_cd		    = f8
  1 query_mode 				= i4
  1 cache_mode 				= i2
  1 decode_flag 			= i2
)
 
free record 1000013_rep
record 1000013_rep (
  1 sb
    2 severityCd 						= i4
    2 statusCd 							= i4
    2 statusText 						= vc
  1 rb_list [*]
    2 self_name 						= vc
    2 self_cd 							= f8
    2 self_disp 						= vc
    2 self_descr 						= vc
    2 self_icon_name 					= vc
	2 self_status_cd					= f8
	2 self_auth_status_cd				= f8
	2 primitive_es_count				= i4
	2 primitive_es_count_ind			= i2
	2 leaf_event_cd_count				= i4
	2 leaf_event_cd_count_ind			= i2
	2 updt_id							= f8
	2 updt_dt_tm						= dq8
	2 expand_ind						= i2
	2 expand_ind_ind					= i2
	2 def_event_class_cd				= f8
	2 operation_display_flag			= i2
	2 operation_display_flag_ind 		= i2
    2 primitive_ind 					= i2
    2 primitive_ind_ind 				= i2
    2 collating_seq 					= i4
    2 collating_seq_ind 				= i2
    2 category_flag 					= i2
    2 category_flag_ind 				= i2
    2 parent_event_set_cd 				= f8
    2 show_if_no_data_ind 				= i2
    2 show_if_no_data_ind_ind 			= i2
    2 grouping_rule_flag 				= i2
    2 grouping_rule_flag_ind 			= i2
    2 accumulation_ind 					= i2
    2 accumulation_ind_ind 				= i2
    2 display_association_ind 			= i2
    2 display_association_ind_ind 		= i2
    2 concept_cki 						= vc
    2 event_list [*]
		3 clinical_event_id 			= f8
		3 event_id 						= f8
		3 view_level 					= i4
		3 encntr_id 					= f8
		3 order_id 						= f8
		3 catalog_cd 					= f8
		3 parent_event_id 				= f8
		3 event_class_cd 				= f8
		3 event_cd 						= f8
		3 event_cd_disp 				= vc
		3 event_tag 					= vc
		3 event_end_dt_tm 				= dq8
		3 event_end_dt_tm_ind 			= i2
		3 task_assay_cd 				= f8
		3 record_status_cd 				= f8
		3 record_status_cd_disp 		= vc
		3 result_status_cd 				= f8
		3 result_status_cd_disp 		= vc
		3 publish_flag 					= i2
		3 normalcy_cd 					= f8
		3 subtable_bit_map 				= i4
		3 event_title_text 				= vc
		3 result_val 					= vc
		3 result_units_cd 				= f8
		3 result_units_cd_disp 			= vc
		3 performed_dt_tm 				= dq8
		3 performed_dt_tm_ind 			= i2
		3 performed_prsnl_id 			= f8
		3 normal_low 					= vc
		3 normal_high 					= vc
		3 reference_nbr 				= vc
		3 contributor_system_cd 		= f8
		3 valid_from_dt_tm 				= dq8
		3 valid_from_dt_tm_ind 			= i2
		3 valid_until_dt_tm 			= dq8
		3 valid_until_dt_tm_ind 		= i2
		3 note_importance_bit_map 		= i2
		3 updt_dt_tm 					= dq8
		3 updt_dt_tm_ind 				= i2
		3 updt_id 						= f8
		3 clinsig_updt_dt_tm 			= dq8
		3 clinsig_updt_dt_tm_ind 		= i2
	    3 collating_seq 				= vc
		3 order_action_sequence 		= i4
		3 entry_mode_cd 				= f8
		3 source_cd 					= f8
		3 source_cd_disp 				= vc
		3 source_cd_mean 				= vc
		3 clinical_seq 					= vc
		3 event_end_tz 					= i2
		3 performed_tz 					= i2
		3 task_assay_version_nbr 		= f8
		3 modifier_long_text 			= vc
		3 modifier_long_text_id 		= f8
		3 endorse_ind 					= i2
		3 new_result_ind 				= i2
		3 organization_id 				= f8
		3 src_event_id 					= f8
		3 src_clinsig_updt_dt_tm 		= dq8
		3 person_id 					= f8
		3 nomen_string_flag 			= i2
		3 ce_dynamic_label_id 			= f8
		3 trait_bit_map 				= i4
		3 order_action_sequence 		= i4
%i cclsource:status_block.inc
)
 
free record temp
record temp (
	1 qual[*]
		2 code = f8
		2 codeset = i4
		2 description = vc
		2 display = vc
		2 level = i4
		2 parent_cd = f8
)
 
; This record will be overwritten below, but is defined for auditing and error purposes
free record document_discovery_reply_out
record document_discovery_reply_out (
  1 qual[*]
		2 code = f8
		2 codeset = i4
		2 description = vc
		2 display = vc
		2 level = i4
		2 parent_cd = f8
  1 audit
	2 user_id					= f8
	2 user_firstname			= vc
	2 user_lastname				= vc
	2 patient_id				= f8
	2 patient_firstname			= vc
	2 patient_lastname			= vc
	2 service_version			= vc
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
 
; Parser Bufferf
free record parser_buff
record parser_buff (
	1 qual[*]
		2 cmd = gvc
)
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Inputs
declare sUsername					= vc with protect, noconstant("")
declare dEventSetCd					= f8 with protect, noconstant(0.0)
declare iDebugFlag					= i2 with protect, noconstant(0) ;003
 
; Other
declare iMaxLevel					= i4 with protect, noconstant(0)
declare sParserCmd					= gvc with protect, noconstant("")
declare sStr						= vc with protect, noconstant("")
declare iRecDepth					= i4 with protect, noconstant(0)
 
; Constants
declare c_clindoc_event_set_cd 		= f8 with protect, noconstant(uar_get_code_by("DISPLAY_KEY", 93, "CLINICALDOC"))
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
set sUsername				= trim($USERNAME,3)
set dEventSetCd 			= cnvtreal($EVENT_SET_CD)
set iDebugFlag				= cnvtint($DEBUG_FLAG)  ;003
 
if(dEventSetCd = 0.0)
	set dEventSetCd = c_clindoc_event_set_cd
endif
 
if(iDebugFlag > 0)
	call echo(build2("sUsername  ->", sUsername))
	call echo(build2("dEventSetCd  ->", dEventSetCd))
endif
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetDocumentEventSet(null)					= null with protect
declare BuildTempEventList(level = i2)				= null with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Get Event Set Hierarchy
set iRet = GetDocumentEventSet(null)
if(iRet = 0)
	call ErrorHandler2("EXECUTE", "F","DOCUMENT DISCOVERY", "Error retrieving document event set",
	"9999", "Error retrieving document event hierarchy - 1000013", document_discovery_reply_out)	;004
  	go to exit_script
endif
 
; Build Temp data
call BuildTempEventList(1)
 
; Validate username and populate user data in audit after new record structure has been created
set iRet = PopulateAudit(sUserName, 0.0, document_discovery_reply_out, sVersion)
if(iRet = 0)
  	  call ErrorHandler2("VALIDATE", "F", "DOCUMENT DISCOVERY", "Invalid User for Audit.",
  	  "1001",build("Invalid user: ",sUserName), document_discovery_reply_out)
  	  go to exit_script
endif
 
;Build Final Reply
set stat = movereclist(temp->qual,document_discovery_reply_out->qual,1,0,size(temp->qual,5),true)
 
; Set audit to successful
call ErrorHandler2("Success", "S", "DOCUMENT DISCOVERY", "Process completed successfully.",
  	"0000","Document discovery completed successfully.", document_discovery_reply_out)
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(document_discovery_reply_out)
 
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_document_discovery.json")
	call echo(build2("_file : ", _file))
	call echojson(document_discovery_reply_out, _file, 0)
	call echorecord(document_discovery_reply_out)
	call echo(JSONout)
endif
 
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: GetDocumentEventSet(null)
;  Description: Returns all Clinical Document types
**************************************************************************/
subroutine GetDocumentEventSet(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetDocumentEventSet Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
	set iApplication = 600005
	set iTask = 3200200
	set iRequest = 1000013
 
	set 1000013_req->event_set_cd 			= dEventSetCd
	set 1000013_req->batch_size				= 0
	set 1000013_req->event_set_name 		= ""
	set 1000013_req->query_mode 			= 8; 16
	set 1000013_req->cache_mode 			= 0
	set 1000013_req->decode_flag 			= 0
 
	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",1000013_req,"REC",1000013_rep,1)
 
	if (stat != 1 and SIZE(1000013_rep->rb_list, 5) != 0)
		set iValidate = 1
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetDocumentEventSet Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
	return(iValidate)
 
end ;End Sub
 
/*************************************************************************
;  Name: BuildTempEventList(level = i2)		= null with protect
;  Description: Build Temp structure with event hierarchy. Get number of levels
**************************************************************************/
subroutine BuildTempEventList(level)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("BuildTempEventList Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	if(level = 1)
		set stat = alterlist(temp->qual,1)
		set temp->qual[1].code = 1000013_rep->rb_list[1].self_cd
		set temp->qual[1].codeset = GetCodeSet(1000013_rep->rb_list[1].self_cd)
		set temp->qual[1].display = 1000013_rep->rb_list[1].self_disp
		set temp->qual[1].description = 1000013_rep->rb_list[1].self_descr
		set temp->qual[1].level = level
		set temp->qual[1].parent_cd = 1000013_rep->rb_list[1].parent_event_set_cd
		call BuildTempEventList(2)
	else
		select distinct into "nl:"
			code = temp->qual[d.seq].code
		from (dummyt d with seq = size(temp->qual,5))
			,(dummyt d2 with seq = size(1000013_rep->rb_list,5))
		plan d where temp->qual[d.seq].level = level-1
		join d2 where 1000013_rep->rb_list[d2.seq].parent_event_set_cd =
					temp->qual[d.seq].code
		order by d2.seq
		head report
			x = size(temp->qual,5)
		detail
			x = x + 1
			stat = alterlist(temp->qual,x)
 
			temp->qual[x].code = 1000013_rep->rb_list[d2.seq].self_cd
			temp->qual[x].description = 1000013_rep->rb_list[d2.seq].self_descr
			temp->qual[x].display = 1000013_rep->rb_list[d2.seq].self_disp
			temp->qual[x].level = level
			temp->qual[x].parent_cd = 1000013_rep->rb_list[d2.seq].parent_event_set_cd
		with nocounter
 
		if(curqual)
			call BuildTempEventList(level + 1)
		else
			set iMaxLevel = level
 
			for(i = 1 to size(temp->qual,5))
				set temp->qual[i].codeset = GetCodeSet(temp->qual[i].code)
			endfor
		endif
 
	endif
 
 	if(iDebugFlag > 0)
		call echo(concat("BuildTempEventList Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
end go
 
