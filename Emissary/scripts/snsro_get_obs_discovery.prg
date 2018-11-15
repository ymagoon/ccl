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
*                                                                    *
  ~BE~***********************************************************************/
/*****************************************************************************
          Date Written:       06/08/15
          Source file name:   snsro_get_observations_discovery
          Object name:        snsro_get_observations_discovery
          Request #:
          Program purpose:    Queries for all flowsheet types
          Tables read:
          Tables updated:     NONE
          Executing from:     EMISSARY SERVICES
          Special Notes:	  NONE
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
  000 05/15/16 AAB		    		Initial write
  001 10/10/16 AAB 					Add DEBUG_FLAG
  002 07/27/17 JCO					Changed %i to execute; update ErrorHandler2
  003 03/21/18 RJC					Added version code and copyright block
 ***********************************************************************/
drop program snsro_get_obs_discovery go
create program snsro_get_obs_discovery
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Event_set"		= ""
		, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, EVENT_SETS, DEBUG_FLAG   ;001

/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.16.6.1" ;003
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record event_set_req
record event_set_req
(
	1 event_set_cds[*]
		2 event_set_cd					= f8
 
)
 
free record req_in
record req_in (
  1 batch_size  			= i4
  1 event_set_name 			= vc
  1 event_set_disp 			= vc
  1 event_set_cd		    = f8
  1 query_mode 				= i4
  1 cache_mode 				= i2
  1 decode_flag 			= i2
)
 
free record eventset_reply_out
record eventset_reply_out (
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
 
free record observations_discovery_reply_out
record observations_discovery_reply_out (
  1 flowsheet_type_id  						= f8
  1 flowsheet_type_desc		 				= vc
  1 flowsheet_categories [*]
    2 category_id 						= f8
    2 category_desc 					= vc
	2 display_seq						= i4
	2 code_set							= f8
	2 flowsheet_components [*]
		3 component_id					= f8
		3 component_desc				= vc
		3 short_name					= vc
		3 LOINC							= vc
		3 SNOMED						= vc
		3 code_set						= f8
		3 task_assay_cd					= f8
		3 task_assay_disp				= vc
	2 flowsheet_categories[*]
		3 category_id 					= f8
		3 category_desc 				= vc
		3 display_seq					= i4
		3 code_set						= f8
		3 flowsheet_components [*]
			4 component_id				= f8
			4 component_desc			= vc
			4 short_name				= vc
			4 LOINC						= vc
			4 SNOMED					= vc
			4 code_set					= f8
			4 task_assay_cd				= f8
			4 task_assay_disp			= vc
		3 flowsheet_categories [*]
			4 category_id 				= f8
			4 category_desc 			= vc
			4 display_seq				= i4
			4 code_set					= f8
			4 flowsheet_components [*]
				5 component_id			= f8
				5 component_desc		= vc
				5 short_name			= vc
				5 LOINC					= vc
				5 SNOMED				= vc
				5 code_set				= f8
				5 task_assay_cd			= f8
				5 task_assay_disp		= vc
			4 flowsheet_categories [*]
				5 category_id 				= f8
				5 category_desc 			= vc
				5 display_seq				= i4
				5 code_set					= f8
				5 flowsheet_components [*]
					6 component_id			= f8
					6 component_desc		= vc
					6 short_name			= vc
					6 LOINC					= vc
					6 SNOMED				= vc
					6 code_set				= f8
					6 task_assay_cd			= f8
					6 task_assay_disp		= vc
    1 audit			 ;007
		2 user_id					= f8
		2 user_firstname			= vc
		2 user_lastname				= vc
		2 patient_id				= f8
		2 patient_firstname			= vc
		2 patient_lastname			= vc
	    2 service_version			= vc
;002 %i cclsource:status_block.inc
/*002 begin */
  1 status_data
    2 status = c1
    2 subeventstatus[1]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
      3 Code = c4
      3 Description = vc
/*002 end */
)
 
set observations_discovery_reply_out->status_data->status = "F"
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
declare APPLICATION_NUMBER 			= i4 with protect, constant (600005)
declare TASK_NUMBER 				= i4 with protect, constant (3200200)
declare REQ_NUMBER 					= i4 with protect, constant (1000013)
declare Section_Start_Dt_Tm 		= DQ8 WITH PROTECT, NOCONSTANT(CNVTDATETIME(CURDATE, CURTIME3))
declare flowsheet_event_set_cd 		= f8 with protect, noconstant(uar_get_code_by("DISPLAY_KEY", 93, "ALLSPECIALTYSECTIONS"))
declare query_mode					= i4 with protect, noconstant (16)
declare event_set_cds 				= vc with protect, noconstant("")
declare idebugFlag					= i2 with protect, noconstant(0) ;001
 
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetFlowsheetEventSet(null)					= null with protect
declare PostAmble(null)								= null with protect
declare BuildEHS(EventSetReply=vc(REF), cnt = i2) 	= null with protect
declare ParseEventSets(event_set_cds = vc)			= null with protect
declare ProcessReply(EventSetReply=vc) 				= null with protect
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
set event_set_cds    = trim($EVENT_SETS, 3)
set idebugFlag		= cnvtint($DEBUG_FLAG)  ;001
 
if(idebugFlag > 0)
 
	call echo(build("event_set_cds  ->", event_set_cds))
	call echo(build("flowsheet_event_set_cd  ->", flowsheet_event_set_cd))
 
endif
 
 
/****************************************************************************
;INCLUDES
****************************************************************************/
;002 %i ccluserdir:snsro_common.inc
execute snsro_common	;002
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
 
if(event_set_cds > "")
 
	set query_mode = 16
	call ParseEventSets(event_set_cds)
 
elseif(event_set_cds = "")
 
	set query_mode = 4
 
endif
 
if(idebugFlag > 0)
 
	call echo(build("query_mode  ->", query_mode))
 
endif
 
call GetFlowsheetEventSet(null)
 
 
set iRet = PopulateAudit("", 0.0, observations_discovery_reply_out, sVersion)   ;007
 
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
 
	set JSONout = CNVTRECTOJSON(observations_discovery_reply_out)
 
if(idebugFlag > 0)
 
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_flowsheet_discovery.json")
	call echo(build2("_file : ", _file))
	call echojson(observations_discovery_reply_out, _file, 0)
 
    call echorecord(observations_discovery_reply_out)
	call echo(JSONout)
 
endif
 
    if(validate(_MEMORY_REPLY_STRING))
		set _MEMORY_REPLY_STRING = trim(JSONout,3)
	endif

#EXIT_VERSION
/*************************************************************************
;  Name: GetFlowsheetEventSet(null)
;  Description: Returns all Clinical Flowsheet types
;
**************************************************************************/
subroutine GetFlowsheetEventSet(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetFlowsheetEventSet Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
declare event_set_cnt 				= i4 with protect, noconstant (0)		;004
set event_set_cnt = size(event_set_req->event_set_cds, 5)
 
if(idebugFlag > 0)
 
	call echo (build("event_set_cnt - >", event_set_cnt))
 
endif
 
if(event_set_cnt > 0)
 
	for (x = 1 to event_set_cnt)
 
		set req_in->event_set_cd 			= event_set_req->event_set_cds[x]->event_set_cd
		set req_in->event_set_disp          = uar_get_code_display(event_set_req->event_set_cds[x]->event_set_cd)
		set req_in->batch_size				= 0
		set req_in->event_set_name 			= ""
		set req_in->query_mode 				= query_mode	;006
		set req_in->cache_mode 				= 1
		set req_in->decode_flag 			= 1
		free record eventset_reply_out
		set stat = tdbexecute(REQ_NUMBER, REQ_NUMBER, REQ_NUMBER,"REC",req_in,"REC",eventset_reply_out,1)
 
		if(idebugFlag > 0)
 
			call echo(build("Stat --->",  stat))
			call echo(build("Size  --->",  SIZE(eventset_reply_out->rb_list, 5)))
 
		endif
		;call echorecord(eventset_reply_out)
		if (stat = 1 or SIZE(eventset_reply_out->rb_list, 5) = 0)
 
			call ErrorHandler2("EXECUTE", "F", "OBS DISCOVERY", "Error retrieving flowsheet event set (1000013)",
			"9999", "Error retrieving observation discovery (1000013)", observations_discovery_reply_out)	;002
			go to EXIT_SCRIPT
 
		else
 
			call BuildEHS(eventset_reply_out, x)
 
		endif
 
	endfor
 
else
 
		if(idebugFlag > 0)
 
			call echo(build("Event set --->", uar_get_code_display(flowsheet_event_set_cd)))
 
		endif
 
		set req_in->event_set_cd 			= flowsheet_event_set_cd
		set req_in->event_set_disp          = uar_get_code_display(flowsheet_event_set_cd)
		set req_in->batch_size				= 0
		set req_in->event_set_name 			= ""
		set req_in->query_mode 				= query_mode
		set req_in->cache_mode 				= 1
		set req_in->decode_flag 			= 1
		free record eventset_reply_out
		set stat = tdbexecute(REQ_NUMBER, REQ_NUMBER, REQ_NUMBER,"REC",req_in,"REC",eventset_reply_out,1)
 
		if(idebugFlag > 0)
 
			call echo(build("Stat --->",  stat))
 
		endif
 
		if (stat = 1)
 
			call ErrorHandler2("EXECUTE", "F", "OBS DISCOVERY", "Error retrieving flowsheet event set (1000013)",
			"9999", "Error retrieving observation discovery (1000013)", observations_discovery_reply_out)	;002
			go to EXIT_SCRIPT
 
		else
 
			if(idebugFlag > 0)
 
				call echo(build("Size  --->",  SIZE(eventset_reply_out->rb_list, 5)))
				call echorecord(eventset_reply_out)
 
			endif
 
			call PostAmble(null)
 
		endif
 
 
endif
 
    call ErrorHandler("EXECUTE", "S", "OBS DISCOVERY",
    	"Success retrieving observation hierarchy (1000013)", observations_discovery_reply_out)
 
if(idebugFlag > 0)
 
	call echo(concat("GetflowsheetEventSet Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
 
/*************************************************************************
;  Name: BuildEHS(null)
;  Description: Populate discovery reply
;
**************************************************************************/
subroutine BuildEHS(eventset_reply_out, cnt)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("BuildEHS Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
declare evntCnt				= i4 with protect, noconstant (0)
declare categoryCnt			= i4 with protect, noconstant (0)
declare componentCnt		= i4 with protect, noconstant (0)
declare y 					= i4 with protect, noconstant (0)
 
 
	set evntCnt = size(eventset_reply_out->rb_list, 5)
	if(idebugFlag > 0)
 
		call echo(build("evntCnt --->", evntCnt))
		call echo(build("cnt --->", cnt))
 
	endif
 
	set stat = alterlist(observations_discovery_reply_out->flowsheet_categories, cnt)
    set dParentCd = 0.0
	for( y = 1 to evntCnt)
 
			if(GetCodeSet(eventset_reply_out->rb_list[y]->self_cd) = 93 and
			eventset_reply_out->rb_list[y]->parent_event_set_cd =0)
				if(idebugFlag > 0)
 
					call echo(build("Y1 --->",  y))
					call echo(build("Event Set Cd --->",  eventset_reply_out->rb_list[y]->self_cd))
 
				endif
				set dParentCd = eventset_reply_out->rb_list[y]->self_cd
				;set stat = alterlist(observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories,categoryCnt)
				set observations_discovery_reply_out->flowsheet_categories[cnt]->category_id		= eventset_reply_out->rb_list[y]->self_cd
				set observations_discovery_reply_out->flowsheet_categories[cnt]->category_desc	= eventset_reply_out->rb_list[y]->self_descr
				set observations_discovery_reply_out->flowsheet_categories[cnt]->display_seq		= categoryCnt
				set observations_discovery_reply_out->flowsheet_categories[cnt]->code_set			=
					GetCodeSet(eventset_reply_out->rb_list[y]->self_cd)
			elseif(GetCodeSet(eventset_reply_out->rb_list[y]->self_cd) = 93 and dParentCd =
					eventset_reply_out->rb_list[y]->parent_event_set_cd)
				set categoryCnt = categoryCnt + 1
				set subCategoryCnt = 0
				set componentCnt = 0
				if(idebugFlag > 0)
 
					call echo(build("Y1a --->",  y))
					call echo(build("Event Set Cd --->",  eventset_reply_out->rb_list[y]->self_cd))
 
				endif
				set stat = alterlist(observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories,categoryCnt)
				set observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->category_id		=
					eventset_reply_out->rb_list[y]->self_cd
				set observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->category_desc	=
					eventset_reply_out->rb_list[y]->self_descr
				set observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->display_seq		=
					categoryCnt
				set observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->code_set			=
					GetCodeSet(eventset_reply_out->rb_list[y]->self_cd)
			elseif((observations_discovery_reply_out->flowsheet_categories[cnt]->category_id	 	=
					eventset_reply_out->rb_list[y]->parent_event_set_cd) AND (GetCodeSet(eventset_reply_out->rb_list[y]->self_cd) = 72))
					set componentCnt = componentCnt + 1
					if(idebugFlag > 0)
 
						call echo(build("Y1b --->",  y))
						call echo(build("Event Set Cd --->",  eventset_reply_out->rb_list[y]->self_cd))
 
					endif
 
					set stat = alterlist(observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_components, componentCnt)
					set observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_components[componentCnt]->component_id	=
						eventset_reply_out->rb_list[y]->self_cd
					set observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_components[componentCnt]->component_desc	=
						eventset_reply_out->rb_list[y]->self_descr
					set observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_components[componentCnt]->code_set		=
						GetCodeSet(eventset_reply_out->rb_list[y]->self_cd)
			elseif((observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->category_id	 	=
						eventset_reply_out->rb_list[y]->parent_event_set_cd) AND (GetCodeSet(eventset_reply_out->rb_list[y]->self_cd) = 72))
					set componentCnt = componentCnt + 1
					if(idebugFlag > 0)
 
						call echo(build("Y2 --->",  y))
						call echo(build("Event Set Cd --->",  eventset_reply_out->rb_list[y]->self_cd))
 
					endif
 
					set stat = alterlist(observations_discovery_reply_out->flowsheet_categories[cnt]->
						flowsheet_categories[categoryCnt]->flowsheet_components, componentCnt)
					set observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->
						flowsheet_components[componentCnt]->component_id	= eventset_reply_out->rb_list[y]->self_cd
					set observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->
						flowsheet_components[componentCnt]->component_desc	= eventset_reply_out->rb_list[y]->self_descr
					set observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->
						flowsheet_components[componentCnt]->code_set		= GetCodeSet(eventset_reply_out->rb_list[y]->self_cd)
			elseif((observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->category_id	 =
						eventset_reply_out->rb_list[y]->parent_event_set_cd )AND (GetCodeSet(eventset_reply_out->rb_list[y]->self_cd) = 93))
					set subCategoryCnt = subCategoryCnt + 1
					if(idebugFlag > 0)
 
						call echo(build("Y3 --->",  y))
						call echo(build("Event Set Cd --->",  eventset_reply_out->rb_list[y]->self_cd))
 
					endif
 
					set componentCnt = 0
					set stat = alterlist(observations_discovery_reply_out->flowsheet_categories[cnt]->
						flowsheet_categories[categoryCnt]->flowsheet_categories, subCategoryCnt)
					set observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->
						flowsheet_categories[subCategoryCnt]->category_id	= eventset_reply_out->rb_list[y]->self_cd
					set observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->
						flowsheet_categories[subCategoryCnt]->category_desc	= eventset_reply_out->rb_list[y]->self_descr
					set observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->
						flowsheet_categories[subCategoryCnt]->display_seq	= subCategoryCnt
					set observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->
						flowsheet_categories[subCategoryCnt]->code_set		= GetCodeSet(eventset_reply_out->rb_list[y]->self_cd)
			elseif((observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->
						flowsheet_categories[subCategoryCnt]->category_id =
		eventset_reply_out->rb_list[y]->parent_event_set_cd )AND (GetCodeSet(eventset_reply_out->rb_list[y]->self_cd) = 72))
					set componentCnt = componentCnt + 1
					if(idebugFlag > 0)
 
						call echo(build("Y4 --->",  y))
						call echo(build("Event Set Cd --->",  eventset_reply_out->rb_list[y]->self_cd))
 
					endif
					set stat = alterlist(observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->
						flowsheet_categories[subCategoryCnt]->flowsheet_components,componentCnt)
					set observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->
						flowsheet_categories[subCategoryCnt]->flowsheet_components[componentCnt]->component_id	=
							eventset_reply_out->rb_list[y]->self_cd
					set observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->
						flowsheet_categories[subCategoryCnt]->flowsheet_components[componentCnt]->component_desc	=
							eventset_reply_out->rb_list[y]->self_descr
					set observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->
						flowsheet_categories[subCategoryCnt]->flowsheet_components[componentCnt]->code_set	=
							GetCodeSet(eventset_reply_out->rb_list[y]->self_cd)
			endif
 
		endfor
 
if(idebugFlag > 0)
 
	call echo(concat("BuildEHS Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
 
end
 
/*************************************************************************
;  Name: PostAmble(null)
;  Description: Populate discovery reply
;
**************************************************************************/
subroutine PostAmble(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("PostAmble Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
 
declare eventCnt				= i4 with protect, noconstant (0)
declare parentCatCnt			= i4 with protect, noconstant (0)
declare parentCompCnt			= i4 with protect, noconstant (0)
declare categoryCnt				= i4 with protect, noconstant (0)
declare componentCnt			= i4 with protect, noconstant (0)
declare x 						= i4 with protect, noconstant (0)
 
set eventCnt = size(eventset_reply_out->rb_list, 5)
 
if(eventCnt > 0)
 
	if(query_mode = 4)	;002
 
		set observations_discovery_reply_out->flowsheet_type_id 	= flowsheet_event_set_cd
		set observations_discovery_reply_out->flowsheet_type_desc	= uar_get_code_display(flowsheet_event_set_cd)
 
		for (x = 1 to eventCnt)
 
			set categoryCnt = categoryCnt + 1
			set stat = alterlist(observations_discovery_reply_out->flowsheet_categories,categoryCnt)
			set observations_discovery_reply_out->flowsheet_categories[categoryCnt]->category_id	= eventset_reply_out->rb_list[x]->self_cd
			set observations_discovery_reply_out->flowsheet_categories[categoryCnt]->category_desc	=
				eventset_reply_out->rb_list[x]->self_descr
			set observations_discovery_reply_out->flowsheet_categories[categoryCnt]->display_seq	=  x
			set observations_discovery_reply_out->flowsheet_categories[categoryCnt]->code_set		=
				GetCodeSet(eventset_reply_out->rb_list[x]->self_cd)
 
		endfor
 
	else
 
		set observations_discovery_reply_out->flowsheet_type_id 	= eventset_reply_out->rb_list[1]->self_cd
		set observations_discovery_reply_out->flowsheet_type_desc	= eventset_reply_out->rb_list[1]->self_descr
 
		for( x = 2 to eventCnt)
 
			if(observations_discovery_reply_out->flowsheet_type_id = eventset_reply_out->rb_list[x]->parent_event_set_cd)
				set parentCatCnt = parentCatCnt + 1
				set parentCompCnt = 0
				set categoryCnt = 0
				set stat = alterlist(observations_discovery_reply_out->flowsheet_categories,parentCatCnt)
				set observations_discovery_reply_out->flowsheet_categories[parentCatCnt]->category_id		= eventset_reply_out->rb_list[x]->self_cd
				set observations_discovery_reply_out->flowsheet_categories[parentCatCnt]->category_desc	=
					eventset_reply_out->rb_list[x]->self_descr
				set observations_discovery_reply_out->flowsheet_categories[parentCatCnt]->display_seq		= parentCatCnt
				set observations_discovery_reply_out->flowsheet_categories[parentCatCnt]->code_set		=
					GetCodeSet(eventset_reply_out->rb_list[x]->self_cd)
			elseif((observations_discovery_reply_out->flowsheet_categories[parentCatCnt]->category_id =
					eventset_reply_out->rb_list[x]->parent_event_set_cd) AND (GetCodeSet(eventset_reply_out->rb_list[x]->self_cd) = 72))
				set parentCompCnt = parentCompCnt + 1
				set stat = alterlist(observations_discovery_reply_out->flowsheet_categories[parentCatCnt]->flowsheet_components,parentCompCnt)
				set observations_discovery_reply_out->flowsheet_categories[parentCatCnt]->flowsheet_components[parentCompCnt]->component_id		=
					eventset_reply_out->rb_list[x]->self_cd
				set observations_discovery_reply_out->flowsheet_categories[parentCatCnt]->flowsheet_components[parentCompCnt]->component_desc	=
					eventset_reply_out->rb_list[x]->self_descr
				set observations_discovery_reply_out->flowsheet_categories[parentCatCnt]->flowsheet_components[parentCompCnt]->code_set			=
					GetCodeSet(eventset_reply_out->rb_list[x]->self_cd)
			elseif((observations_discovery_reply_out->flowsheet_categories[parentCatCnt]->category_id =
					eventset_reply_out->rb_list[x]->parent_event_set_cd) AND (GetCodeSet(eventset_reply_out->rb_list[x]->self_cd) = 93))
				set categoryCnt = categoryCnt + 1
				set subCategoryCnt = 0
				set componentCnt = 0
				set stat = alterlist(observations_discovery_reply_out->flowsheet_categories[parentCatCnt]->flowsheet_categories,categoryCnt)
				set observations_discovery_reply_out->flowsheet_categories[parentCatCnt]->flowsheet_categories[categoryCnt]->category_id		=
					eventset_reply_out->rb_list[x]->self_cd
				set observations_discovery_reply_out->flowsheet_categories[parentCatCnt]->flowsheet_categories[categoryCnt]->category_desc	=
					eventset_reply_out->rb_list[x]->self_descr
				set observations_discovery_reply_out->flowsheet_categories[parentCatCnt]->flowsheet_categories[categoryCnt]->display_seq		=
					categoryCnt
				set observations_discovery_reply_out->flowsheet_categories[parentCatCnt]->flowsheet_categories[categoryCnt]->code_set			=
					GetCodeSet(eventset_reply_out->rb_list[x]->self_cd)
			elseif((observations_discovery_reply_out->flowsheet_categories[parentCatCnt]->flowsheet_categories[categoryCnt]->category_id	 	=
					eventset_reply_out->rb_list[x]->parent_event_set_cd) AND (GetCodeSet(eventset_reply_out->rb_list[x]->self_cd) = 72))
					set componentCnt = componentCnt + 1
					set stat = alterlist(observations_discovery_reply_out->flowsheet_categories[parentCatCnt]->
						flowsheet_categories[categoryCnt]->flowsheet_components, componentCnt)
					set observations_discovery_reply_out->flowsheet_categories[parentCatCnt]->flowsheet_categories[categoryCnt]->
						flowsheet_components[componentCnt]->component_id	= eventset_reply_out->rb_list[x]->self_cd
					set observations_discovery_reply_out->flowsheet_categories[parentCatCnt]->flowsheet_categories[categoryCnt]->
						flowsheet_components[componentCnt]->component_desc	= eventset_reply_out->rb_list[x]->self_descr
					set observations_discovery_reply_out->flowsheet_categories[parentCatCnt]->flowsheet_categories[categoryCnt]->
						flowsheet_components[componentCnt]->code_set		= GetCodeSet(eventset_reply_out->rb_list[x]->self_cd)
			elseif((observations_discovery_reply_out->flowsheet_categories[parentCatCnt]->flowsheet_categories[categoryCnt]->category_id	 =
						eventset_reply_out->rb_list[x]->parent_event_set_cd )AND (GetCodeSet(eventset_reply_out->rb_list[x]->self_cd) = 93))
					set subCategoryCnt = subCategoryCnt + 1
					set componentCnt = 0
					set stat = alterlist(observations_discovery_reply_out->flowsheet_categories[parentCatCnt]->
						flowsheet_categories[categoryCnt]->flowsheet_categories, subCategoryCnt)
					set observations_discovery_reply_out->flowsheet_categories[parentCatCnt]->flowsheet_categories[categoryCnt]->
						flowsheet_categories[subCategoryCnt]->category_id	= eventset_reply_out->rb_list[x]->self_cd
					set observations_discovery_reply_out->flowsheet_categories[parentCatCnt]->flowsheet_categories[categoryCnt]->
						flowsheet_categories[subCategoryCnt]->category_desc	= eventset_reply_out->rb_list[x]->self_descr
					set observations_discovery_reply_out->flowsheet_categories[parentCatCnt]->flowsheet_categories[categoryCnt]->
						flowsheet_categories[subCategoryCnt]->display_seq	= subCategoryCnt
					set observations_discovery_reply_out->flowsheet_categories[parentCatCnt]->flowsheet_categories[categoryCnt]->
						flowsheet_categories[subCategoryCnt]->code_set		= GetCodeSet(eventset_reply_out->rb_list[x]->self_cd)
			elseif((observations_discovery_reply_out->flowsheet_categories[parentCatCnt]->flowsheet_categories[categoryCnt]->
						flowsheet_categories[subCategoryCnt]->category_id =
		eventset_reply_out->rb_list[x]->parent_event_set_cd )AND (GetCodeSet(eventset_reply_out->rb_list[x]->self_cd) = 72))
					set componentCnt = componentCnt + 1
					set stat = alterlist(observations_discovery_reply_out->flowsheet_categories[parentCatCnt]->
						flowsheet_categories[categoryCnt]->flowsheet_categories[subCategoryCnt]->flowsheet_components,componentCnt)
					set observations_discovery_reply_out->flowsheet_categories[parentCatCnt]->flowsheet_categories[categoryCnt]->
						flowsheet_categories[subCategoryCnt]->flowsheet_components[componentCnt]->component_id	=
							eventset_reply_out->rb_list[x]->self_cd
					set observations_discovery_reply_out->flowsheet_categories[parentCatCnt]->flowsheet_categories[categoryCnt]->
						flowsheet_categories[subCategoryCnt]->flowsheet_components[componentCnt]->component_desc	=
							eventset_reply_out->rb_list[x]->self_descr
					set observations_discovery_reply_out->flowsheet_categories[parentCatCnt]->flowsheet_categories[categoryCnt]->
						flowsheet_categories[subCategoryCnt]->flowsheet_components[componentCnt]->code_set	=
							GetCodeSet(eventset_reply_out->rb_list[x]->self_cd)
			endif
 
		endfor
 
	endif
 
endif
 
	call ErrorHandler("EXECUTE", "S", "OBS DISCOVERY",
		"Success retrieving observation hierarcy (1000013)", observations_discovery_reply_out)
 
if(idebugFlag > 0)
 
	call echo(concat("PostAmble Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
/*************************************************************************
;  Name: ParseEventSets(event_set_cds)
;  Description: Subroutine to parse a comma delimited string
;
**************************************************************************/
subroutine ParseEventSets(event_set_cds)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("ParseEventSets Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
declare notfnd 		= vc with constant("<not_found>")
declare num 		= i4 with noconstant(1)
declare str 		= vc with noconstant("")
 
if(event_set_cds != "")
 
	while (str != notfnd)
 
     	set str =  piece(event_set_cds,',',num,notfnd)
 
     	if(str != notfnd)
      		set stat = alterlist(event_set_req->event_set_cds, num)
     		set event_set_req->event_set_cds[num]->event_set_cd = cnvtint(str)
     	endif
 
      	set num = num + 1
 
 	endwhile
 
	if(idebugFlag > 0)
 
		call echorecord(event_set_req)
 
	endif
 
endif
 
if(idebugFlag > 0)
 
	call echo(concat("PostAmble Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
/*************************************************************************
;  Name: ProcessReply(EventSetReply, cnt)
;  Description: Build discovery reply
;
**************************************************************************/
subroutine ProcessReply(eventset_reply_out, cnt)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("ProcessReply Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
declare evntCnt				= i4 with protect, noconstant (0)
declare categoryCnt			= i4 with protect, noconstant (0)
declare componentCnt		= i4 with protect, noconstant (0)
declare y 					= i4 with protect, noconstant (0)
 
 
	set evntCnt = size(eventset_reply_out->rb_list, 5)
 
		for( y = 1 to evntCnt)
 
			if(GetCodeSet(eventset_reply_out->rb_list[y]->self_cd) = 93)
				set categoryCnt = categoryCnt + 1
				set subCategoryCnt = 0
				set componentCnt = 0
				set stat = alterlist(observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories,categoryCnt)
				set observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->category_id		=
					eventset_reply_out->rb_list[y]->self_cd
				set observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->category_desc	=
					eventset_reply_out->rb_list[y]->self_descr
				set observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->display_seq		=
					categoryCnt
				set observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->code_set			=
					GetCodeSet(eventset_reply_out->rb_list[y]->self_cd)
			elseif((observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->category_id	 	=
					eventset_reply_out->rb_list[y]->parent_event_set_cd) AND (GetCodeSet(eventset_reply_out->rb_list[y]->self_cd) = 72))
					set componentCnt = componentCnt + 1
					set stat = alterlist(observations_discovery_reply_out->flowsheet_categories[cnt]->
						flowsheet_categories[categoryCnt]->flowsheet_components, componentCnt)
					set observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->
						flowsheet_components[componentCnt]->component_id	= eventset_reply_out->rb_list[y]->self_cd
					set observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->
						flowsheet_components[componentCnt]->component_desc	= eventset_reply_out->rb_list[y]->self_descr
					set observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->
						flowsheet_components[componentCnt]->code_set		= GetCodeSet(eventset_reply_out->rb_list[y]->self_cd)
			elseif((observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->category_id	 =
						eventset_reply_out->rb_list[y]->parent_event_set_cd )AND (GetCodeSet(eventset_reply_out->rb_list[y]->self_cd) = 93))
					set subCategoryCnt = subCategoryCnt + 1
					set componentCnt = 0
					set stat = alterlist(observations_discovery_reply_out->flowsheet_categories[cnt]->
						flowsheet_categories[categoryCnt]->flowsheet_categories, subCategoryCnt)
					set observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->
						flowsheet_categories[subCategoryCnt]->category_id	= eventset_reply_out->rb_list[y]->self_cd
					set observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->
						flowsheet_categories[subCategoryCnt]->category_desc	= eventset_reply_out->rb_list[y]->self_descr
					set observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->
						flowsheet_categories[subCategoryCnt]->display_seq	= subCategoryCnt
					set observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->
						flowsheet_categories[subCategoryCnt]->code_set		= GetCodeSet(eventset_reply_out->rb_list[y]->self_cd)
			elseif((observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->
						flowsheet_categories[subCategoryCnt]->category_id =
		eventset_reply_out->rb_list[y]->parent_event_set_cd )AND (GetCodeSet(eventset_reply_out->rb_list[y]->self_cd) = 72))
					set componentCnt = componentCnt + 1
					set stat = alterlist(observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->
						flowsheet_categories[subCategoryCnt]->flowsheet_components,componentCnt)
					set observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->
						flowsheet_categories[subCategoryCnt]->flowsheet_components[componentCnt]->component_id	=
							eventset_reply_out->rb_list[y]->self_cd
					set observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->
						flowsheet_categories[subCategoryCnt]->flowsheet_components[componentCnt]->component_desc	=
							eventset_reply_out->rb_list[y]->self_descr
					set observations_discovery_reply_out->flowsheet_categories[cnt]->flowsheet_categories[categoryCnt]->
						flowsheet_categories[subCategoryCnt]->flowsheet_components[componentCnt]->code_set	=
							GetCodeSet(eventset_reply_out->rb_list[y]->self_cd)
			endif
 
		endfor
 
if(idebugFlag > 0)
 
	call echo(concat("ProcessReply Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
end go
 
 
 
 
 
