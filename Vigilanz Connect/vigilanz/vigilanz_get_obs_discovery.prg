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
                                                                    *
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
  004 01/24/19 STV                  update for flowsheet event set error
  005 01/25/19 RJC					Added eventset check
  006 12/19/19 DSH                  Ability to return uncategorized components.
									Ability to use ALLOCFEVENTSETS as the default flowsheet type.
 ***********************************************************************/
drop program vigilanz_get_obs_discovery go
create program vigilanz_get_obs_discovery
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Event_set"                   = "" ;OPTIONAL. Must be unset if Load_Uncategorized is set to one (1).
		, "Load_Uncategorized"          = 0  ;OPTIONAL. Loads uncategorized components. Must be set to zero (0) if Event_set is provided.
		, "Debug Flag"                  = 0  ;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, EVENT_SETS, LOAD_UNCATEGORIZED, DEBUG_FLAG ;001
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2" ;003
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
declare flowsheet_event_set_cd 		= f8 with protect, noconstant(0.00)
declare query_mode					= i4 with protect, noconstant (4)
declare event_set_cds 				= vc with protect, noconstant("")
declare idebugFlag					= i2 with protect, noconstant(0) ;001
declare iLoadUncategorized			= i2 with protect, noconstant(0) ;006
declare iCategorySize				= i2 with protect, noconstant(0) ;006
declare iCategoryIndex				= i2 with protect, noconstant(0) ;006
declare iSubCategorySize			= i2 with protect, noconstant(0) ;006
declare iSubCategoryIndex			= i2 with protect, noconstant(0) ;006
declare c_event_set_code_set		= i4 with protect, constant(93) ;006
declare c_event_code_set			= i4 with protect, constant(72) ;006
declare c_active_status_cd			= f8 with protect, constant(uar_get_code_by("MEANING", 48, "ACTIVE")) ;006
declare c_auth_event_status_cd		= f8 with protect, constant(uar_get_code_by("MEANING", 8, "AUTH")) ;006
declare c_uncategorized_description	= vc with protect, constant("Uncategorized Observations") ;006
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetFlowsheetEventSet(null)					= null with protect
declare PostAmble(null)								= null with protect
declare BuildEHS(EventSetReply=vc(REF), cnt = i2) 	= null with protect
declare ParseEventSets(event_set_cds = vc)			= null with protect
declare ProcessReply(EventSetReply=vc, cnt = i4)	= null with protect
declare IsBlank(sValue = vc)						= i2 with protect ;006
declare GetUncategorizedComponents(null)			= null with protect ;006
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
set event_set_cds    = trim($EVENT_SETS, 3)
set iLoadUncategorized = cnvtint($LOAD_UNCATEGORIZED) ;006
set idebugFlag		= cnvtint($DEBUG_FLAG)  ;001
 
if(idebugFlag > 0)
	call echo(build("event_set_cds  ->", event_set_cds))
	call echo(build("iLoadUncategorized  ->", iLoadUncategorized)) ;006
endif
 
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common	;002
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
 
if(event_set_cds > "")
	if(iLoadUncategorized != FALSE) ;006
		call ErrorHandler2("EXECUTE", "F", "OBS DISCOVERY", "Cannot load a specific categories and uncategorized",
			"9999", "Cannot load a specific categories and uncategorized", observations_discovery_reply_out)
		go to EXIT_SCRIPT
	endif
 
	set query_mode = 16
	call ParseEventSets(event_set_cds)
elseif(event_set_cds = "")
	set query_mode = 4
endif
 
if(idebugFlag > 0)
	call echo(build("query_mode  ->", query_mode))
endif
 
if (iLoadUncategorized = FALSE) ;006
	call GetFlowsheetEventSet(null)
else
	call GetUncategorizedComponents(null) ;006
endif
 
 
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
	set _file = build2(trim(file_path),"/snsro_get_obs_discovery.json")
	call echo(build2("_file : ", _file))
	call echojson(observations_discovery_reply_out, _file, 0)
 
	call echo(JSONout)
	call echorecord(observations_discovery_reply_out)
 
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
 
		select into "nl:"
			ves.event_set_cd
			,ves.event_set_cd_disp
			,vesc.event_set_collating_seq
			,ves2.event_set_cd
			,ves2.event_set_cd_disp
			,vesc2.event_set_collating_seq
			,ves3.event_set_cd
			,ves3.event_set_cd_disp
		from
			v500_event_set_code ves
			,v500_event_set_canon vesc
			,v500_event_set_code ves2
			,v500_event_set_canon vesc2
			,v500_event_set_code ves3
		plan ves where ves.event_set_name_key = "ALLOCFEVENTSETS"
			and ves.code_status_cd = value(uar_get_code_by("MEANING",48,"ACTIVE"))
		join vesc where vesc.parent_event_set_cd = outerjoin(ves.event_set_cd)
			and vesc.event_set_status_cd = outerjoin(value(uar_get_code_by("MEANING",48,"ACTIVE")))
		join ves2 where ves2.event_set_cd = outerjoin(vesc.event_set_cd)
			and ves2.code_status_cd = outerjoin(value(uar_get_code_by("MEANING",48,"ACTIVE")))
		join vesc2 where vesc2.parent_event_set_cd = outerjoin(ves2.event_set_cd)
			and vesc2.event_set_status_cd = outerjoin(value(uar_get_code_by("MEANING",48,"ACTIVE")))
		join ves3 where ves3.event_set_cd = outerjoin(vesc2.event_set_cd)
			and ves3.code_status_cd = outerjoin(value(uar_get_code_by("MEANING",48,"ACTIVE")))
		order by vesc.event_set_collating_seq,vesc2.event_set_collating_seq
		head report
 
			iCategorySize = 0
			iCategoryIndex = 0
			iSubCategorySize = 0
			iSubCategoryIndex = 0
 
			observations_discovery_reply_out->flowsheet_type_id = ves.event_set_cd
			observations_discovery_reply_out->flowsheet_type_desc = trim(ves.event_set_cd_disp, 3)
 
		head vesc.event_set_collating_seq
 
			iSubCategorySize = 0
			iSubCategoryIndex = 0
 
			; Category
			iCategoryIndex += 1
			if(iCategorySize < iCategoryIndex)
				iCategorySize += 10
				stat = alterlist(observations_discovery_reply_out->flowsheet_categories, iCategorySize)
			endif
 
			observations_discovery_reply_out->flowsheet_categories[iCategoryIndex]
				.category_id = ves2.event_set_cd
			observations_discovery_reply_out->flowsheet_categories[iCategoryIndex]
				.category_desc = trim(ves2.event_set_cd_disp, 3)
			observations_discovery_reply_out->flowsheet_categories[iCategoryIndex]
				.display_seq = iCategoryIndex
 
		head vesc2.event_set_collating_seq
 
			; Sub Category
			iSubCategoryIndex += 1
			if(iSubCategorySize < iSubCategoryIndex)
				iSubCategorySize += 10
				stat = alterlist(
					observations_discovery_reply_out->flowsheet_categories[iCategoryIndex].flowsheet_categories,
					iSubCategorySize)
			endif
 
			observations_discovery_reply_out->flowsheet_categories[iCategoryIndex].flowsheet_categories[iSubCategoryIndex]
				.category_id = ves3.event_set_cd
			observations_discovery_reply_out->flowsheet_categories[iCategoryIndex].flowsheet_categories[iSubCategoryIndex]
				.category_desc = trim(ves3.event_set_cd_disp, 3)
			observations_discovery_reply_out->flowsheet_categories[iCategoryIndex].flowsheet_categories[iSubCategoryIndex]
				.display_seq = iSubCategoryIndex
 
		detail
			dummy = 0
		foot vesc.event_set_collating_seq
 
			if (iCategoryIndex > 0)
				if(iSubCategorySize > iSubCategoryIndex)
					stat = alterlist(
						observations_discovery_reply_out->flowsheet_categories[iCategoryIndex].flowsheet_categories,
						iSubCategoryIndex)
				endif
			endif
 
		foot report
 
			if(iCategorySize > iCategoryIndex)
				stat = alterlist(observations_discovery_reply_out->flowsheet_categories, iCategoryIndex)
			endif
 
		with nocounter
 
		if (curqual = 0)
 
			call ErrorHandler2("EXECUTE", "F", "OBS DISCOVERY", "Error retrieving observation discovery",
			"9999", "Error retrieving observation discovery", observations_discovery_reply_out)
			go to EXIT_SCRIPT
 
		endif
 
		; Populate code sets
		for(iCategoryIndex = 1 to size(observations_discovery_reply_out->flowsheet_categories, 5))
 
			set observations_discovery_reply_out->flowsheet_categories[iCategoryIndex]
				.code_set = GetCodeSet(observations_discovery_reply_out->flowsheet_categories[iCategoryIndex].category_id)
 
			for(iSubCategoryIndex = 1 to
				size(observations_discovery_reply_out->flowsheet_categories[iCategoryIndex].flowsheet_categories, 5))
 
				set observations_discovery_reply_out->flowsheet_categories[iCategoryIndex].flowsheet_categories[iSubCategoryIndex]
					.code_set = GetCodeSet(observations_discovery_reply_out->flowsheet_categories[iCategoryIndex]
						.flowsheet_categories[iSubCategoryIndex].category_id)
			endfor
		endfor
 
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
 
/*************************************************************************
;  Name: IsBlank(sValue = vc) = i2
;  Description:  Determines if a string is blank (only whitespace).
;  Parameters:
;    sValue: The string to check.
;  Return: True (1) if the string is blank (only whitespace). Otherwise, false (0).
**************************************************************************/
subroutine IsBlank(sValue)
	if(textlen(nullterm(trim(sValue, 3))) = 0)
		return (TRUE)
	endif
 
	return (FALSE)
end ; End subroutine IsBlank
 
/*************************************************************************
;  Name: GetUncategorizedComponents(null)
;  Description:  Gets uncategorized components
**************************************************************************/
subroutine GetUncategorizedComponents(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetUncategorizedComponents Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set stat = alterlist(observations_discovery_reply_out->flowsheet_categories, 1)
	set observations_discovery_reply_out->flowsheet_categories[1].category_desc = c_uncategorized_description
 
	select into "nl:"
		vec.event_cd
		,vec.event_cd_descr
		,vec.event_cd_disp
		,cv.code_set
		,cv.display
		,cv.description
	from
		v500_event_code vec
		,code_value cv
	plan vec where
		not exists (
			select vese.event_cd from v500_event_set_explode vese where vese.event_cd = vec.event_cd
		)
		and vec.code_status_cd = c_active_status_cd
		and vec.event_code_status_cd = c_auth_event_status_cd
	join cv where
		cv.code_value = vec.event_cd
		and cv.code_set = c_event_code_set
	order by
		vec.event_cd_descr
		,vec.event_cd_disp
		,cv.display
		,cv.description
		,vec.event_cd
	head report
		iIndex = 0
		iSize = 0
	detail
		iIndex += 1
 
		if(iSize < iIndex)
			iSize += 100
			stat = alterlist(observations_discovery_reply_out->flowsheet_categories[1].flowsheet_components, iSize)
		endif
 
		observations_discovery_reply_out->flowsheet_categories[1].flowsheet_components[iIndex]
			.component_id = vec.event_cd
		observations_discovery_reply_out->flowsheet_categories[1].flowsheet_components[iIndex]
			.component_desc = trim(vec.event_cd_descr, 3)
		observations_discovery_reply_out->flowsheet_categories[1].flowsheet_components[iIndex]
			.code_set = cv.code_set
 
		; Event code description
		if(IsBlank(vec.event_cd_descr) = FALSE)
			observations_discovery_reply_out->flowsheet_categories[1].flowsheet_components[iIndex]
				.component_desc = trim(vec.event_cd_descr, 3)
		; Event code display
		elseif(IsBlank(vec.event_cd_disp) = FALSE)
			observations_discovery_reply_out->flowsheet_categories[1].flowsheet_components[iIndex]
				.component_desc = trim(vec.event_cd_disp, 3)
		; Code value display
		elseif(IsBlank(cv.display) = FALSE)
			observations_discovery_reply_out->flowsheet_categories[1].flowsheet_components[iIndex]
				.component_desc = trim(cv.display, 3)
		; Code value description
		elseif(IsBlank(cv.description) = FALSE)
			observations_discovery_reply_out->flowsheet_categories[1].flowsheet_components[iIndex]
				.component_desc = trim(cv.description, 3)
		endif
	foot report
		if(iSize > iIndex)
			stat = alterlist(observations_discovery_reply_out->flowsheet_categories[1].flowsheet_components, iIndex)
		endif
	with nocounter
 
	call ErrorHandler("EXECUTE", "S", "OBS DISCOVERY",
		"Success retrieving uncategorized components", observations_discovery_reply_out)
 
	if(iDebugFlag > 0)
		call echo(concat("GetUncategorizedComponents Runtime: ",
			trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
			" seconds"))
	endif
end ; End subroutine GetUncategorizedComponents
 
end go
