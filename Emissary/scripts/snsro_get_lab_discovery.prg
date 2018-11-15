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
          Date Written:       12/21/14
          Source file name:   snsro_get_lab_discovery
          Object name:        snsro_get_lab_discovery
          Program purpose:    Returns all LAB results
          Tables read:		  V500_event_set
          Tables updated:     NONE
          Executing from:     EMISSARY SERVICES
          Special Notes:	  NONE
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG
 ***********************************************************************
  Mod Date     Engineer    	Comment
  --- -------- ----------- 	-----------------------------------
  000 01/01/15  AAB		   	Initial write
  001 03/20/15	AAB 		Re-design of Lab Discovery
  002 03/31/15	AAB 		Added trace notranslatelock
  003 04/08/15	AAB        	Changed naming of lists to lab_categories and lab_components
  004 08/26/15	JCO			Changed "DISPLAY" to "DISPLAY_KEY" for lookup
  005 12/19/15  AAB 		Externalize event_set_cd
  006 04/29/16  AAB 		Added version
  007 10/10/16  AAB 		Add DEBUG_FLAG
  008 06/22/17	DJP			Add LOINC/SNOMED codes
  009 07/27/17  JCO			Changed %i to execute; update ErrorHandler2
  010 03/21/18	RJC			Added version code and copyright block
  011 06/25/18	RJC			Fixed performance issues. Code cleanup. Moved postamble process to Emissary.
 ***********************************************************************/
drop program snsro_get_lab_discovery go
create program snsro_get_lab_discovery
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Event_set"		= 0.0		;005
		, "Username"		= ""		;011
		, "Debug Flag" 		= 0			;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, EVENT_SET_CD, USERNAME, DEBUG_FLAG   ;007
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.16.6.1" ;010
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record 1000013_req
record 1000013_req (
  1 batch_size  						= i4
  1 event_set_name 						= vc
  1 event_set_disp 						= vc
  1 event_set_cd		    			= f8
  1 query_mode 							= i4
  1 cache_mode 							= i2
  1 decode_flag 						= i2
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
 
; Final Reply
free record labs_reply_out
record labs_reply_out (
	1 qual[*]
		2 code = f8
		2 codeset = i4
		2 description = vc
		2 display = vc
		2 level = i4
		2 parent_cd = f8
		2 task_assay_cd = f8
		2 loinc = vc
		2 snomed = vc
    1 audit										;006
		2 user_id						= f8
		2 user_firstname				= vc
		2 user_lastname					= vc
		2 patient_id					= f8
		2 patient_firstname				= vc
		2 patient_lastname				= vc
	    2 service_version				= vc
  1 status_data									;009
    2 status 							= c1
    2 subeventstatus[1]
      3 OperationName 					= c25
      3 OperationStatus 				= c1
      3 TargetObjectName 				= c25
      3 TargetObjectValue 				= vc
      3 Code 							= c4
      3 Description 					= vc
)
 
set labs_reply_out->status_data->status = "F"
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Input
declare dEventSetCd 				= f8 with protect, noconstant(0.0) 	;005
declare sUserName					= vc with protect, noconstant("") 	;011
declare iDebugFlag					= i2 with protect, noconstant(0) 	;007
 
;Constants
declare c_application_number 		= i4 with protect, constant (600005)
declare c_task_number 				= i4 with protect, constant (3200200)
declare c_request_number 			= i4 with protect, constant (1000013)
declare c_laboratory_event_set_cd 	= f8 with protect, constant(UAR_GET_CODE_BY("DISPLAY_KEY", 93, "LABORATORY")) ;004
declare c_loinc_source_cd			= f8 with protect, constant(UAR_GET_CODE_BY( "MEANING", 400, "LOINC")) ;LOINC ADD ;008
declare c_snomed_source_cd			= f8 with protect, constant(UAR_GET_CODE_BY( "MEANING", 400, "SNMCT"));SNOMED ADD ;008
 
;Other
declare Section_Start_Dt_Tm 		= DQ8 WITH PROTECT, NOCONSTANT(CNVTDATETIME(CURDATE, CURTIME3))
declare iMaxLevel					= i4 with protect, noconstant(0)
declare sParserCmd					= gvc with protect, noconstant("")
declare sStr						= vc with protect, noconstant("")
declare iRecDepth					= i4 with protect, noconstant(0)
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
;Input
set dEventSetCd    	= cnvtint($EVENT_SET_CD)	;005
set sUserName		= trim($USERNAME,3)			;011
set iDebugFlag		= cnvtint($DEBUG_FLAG)  	;007
 
if(dEventSetCd = 0)
	set dEventSetCd = c_laboratory_event_set_cd
endif
 
if(iDebugFlag > 0)
	call echo(build("sUserName  ->", sUserName))
	call echo(build("dEventSetCd  ->", dEventSetCd))
endif
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common ;009
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetLabEventSet(null)				= null with protect
declare PostAmble(null)						= null with protect
declare GetLOINC(null)						= null with protect ;008
declare GetSNOMED(null)						= null with protect ;008
declare BuildEventList(level = i2)			= null with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Populate Audit - 006
set iRet = PopulateAudit(sUserName, 0.0, labs_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F","POP_LABRESULTS", "Invalid User for Audit."
	,"1001",build2(" Invalid User for Audit."),labs_reply_out)
	go to EXIT_SCRIPT
endif
 
; Get Lab Event Codes
call GetLabEventSet(null)
 
; Build labs_reply_out data
call BuildEventList(1)
 
; Get LOINC Codes
call GetLOINC(null)
 
; Get SNOMED Codes
call GetSNOMED(null)
 
;Set audit to success
call ErrorHandler("EXECUTE", "S", "LAB DISCOVERY", "Success retrieving lab discovery.", labs_reply_out)
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(labs_reply_out)
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_lab_discovery.json")
	call echo(build2("_file : ", _file))
	call echojson(labs_reply_out, _file, 0)
    call echorecord(labs_reply_out)
	call echo(JSONout)
endif
 
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: GetLabEventSet(null)
;  Description: Return LABORATORY event set
**************************************************************************/
subroutine GetLabEventSet(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetLabEventSet Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set 1000013_req->event_set_cd 			= dEventSetCd
	set 1000013_req->batch_size				= 0
	set 1000013_req->event_set_name 		= ""
	set 1000013_req->query_mode 			= 8; 16
	set 1000013_req->cache_mode 			= 0
	set 1000013_req->decode_flag 			= 0
 
	set stat = tdbexecute(c_request_number, c_request_number, c_request_number,"REC",1000013_req,"REC",1000013_rep,1)
 
	if (stat = 1 or SIZE(1000013_rep->rb_list, 5) = 0)
		call ErrorHandler2("EXECUTE", "F", "LAB DISCOVERY", "Error retrieving Lab event set",
		"9999", "Error retrieving Lab event set(1000013)", labs_reply_out)	;009
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetLabEventSet Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: BuildEventList(level = i2)		= null with protect
;  Description: Build labs_reply_out structure with event hierarchy. Get number of levels
**************************************************************************/
subroutine BuildEventList(level)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("BuildEventList Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	if(level = 1)
		set stat = alterlist(labs_reply_out->qual,1)
		set labs_reply_out->qual[1].code = 1000013_rep->rb_list[1].self_cd
		set labs_reply_out->qual[1].codeset = GetCodeSet(1000013_rep->rb_list[1].self_cd)
		set labs_reply_out->qual[1].display = 1000013_rep->rb_list[1].self_disp
		set labs_reply_out->qual[1].description = 1000013_rep->rb_list[1].self_descr
		set labs_reply_out->qual[1].level = level
		set labs_reply_out->qual[1].parent_cd = 1000013_rep->rb_list[1].parent_event_set_cd
		call BuildEventList(2)
	else
		select distinct into "nl:"
			code = labs_reply_out->qual[d.seq].code
		from (dummyt d with seq = size(labs_reply_out->qual,5))
			,(dummyt d2 with seq = size(1000013_rep->rb_list,5))
		plan d where labs_reply_out->qual[d.seq].level = level-1
		join d2 where 1000013_rep->rb_list[d2.seq].parent_event_set_cd =
					labs_reply_out->qual[d.seq].code
		order by d2.seq
		head report
			x = size(labs_reply_out->qual,5)
		detail
			x = x + 1
			stat = alterlist(labs_reply_out->qual,x)
 
			labs_reply_out->qual[x].code = 1000013_rep->rb_list[d2.seq].self_cd
			labs_reply_out->qual[x].description = 1000013_rep->rb_list[d2.seq].self_descr
			labs_reply_out->qual[x].display = 1000013_rep->rb_list[d2.seq].self_disp
			labs_reply_out->qual[x].level = level
			labs_reply_out->qual[x].parent_cd = 1000013_rep->rb_list[d2.seq].parent_event_set_cd
		with nocounter
 
		if(curqual)
			call BuildEventList(level + 1)
		else
			set iMaxLevel = level
 
			for(i = 1 to size(labs_reply_out->qual,5))
				set labs_reply_out->qual[i].codeset = GetCodeSet(labs_reply_out->qual[i].code)
			endfor
		endif
	endif
 
 	if(iDebugFlag > 0)
		call echo(concat("BuildEventList Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name:  GetLOINC(null) = null - mod 008
;  Description: Subroutine to retrieve coding system and value
**************************************************************************/
subroutine GetLOINC(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetLOINC Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	select distinct into "nl:"
	from (dummyt d with seq = size(labs_reply_out->qual,5))
		, code_value_event_r cver								;011 performance improvement
		,concept_identifier_dta ci
	plan d where labs_reply_out->qual[d.seq].codeset = 72
	join cver where cver.event_cd = labs_reply_out->qual[d.seq].code
	join ci where ci.task_assay_cd = cver.parent_cd
		and ci.active_ind = 1
		and ci.concept_type_flag = 1 ;LOINC analyte code
	detail
		labs_reply_out->qual[d.seq].loinc = piece(ci.concept_cki,"!",2,"")
		labs_reply_out->qual[d.seq].task_assay_cd = cver.parent_cd
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetLOINCRuntime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetSNOMED(dEventCd,sEventName) - mod 008
;  Description: Subroutine to retrieve coding system and value
**************************************************************************/
subroutine GetSNOMED(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetSNOMED Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	select distinct into "nl:"
	from (dummyt d with seq = size(labs_reply_out->qual,5))
		, nomenclature n
	plan d where labs_reply_out->qual[d.seq].codeset = 72
	join n where n.source_vocabulary_cd = c_snomed_source_cd
		and  n.source_string = labs_reply_out->qual[d.seq].display
	detail
		labs_reply_out->qual[d.seq].snomed = piece(n.concept_cki,"!",2,"")
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetSNOMEDRuntime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
end go
