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
          Date Written:       06/08/15
          Source file name:   snsro_get_io_discovery
          Object name:        snsro_get_io_discovery
          Request #:          1000013 - Event Query
          Program purpose:    Query for all intake and output view
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
  000 03/10/16 JCO		    		Initial write
  001 03/31/16 JCO					Added PopulateAudit
  002 04/29/16 AAB 					Added version
  003 10/10/16 AAB 					Add DEBUG_FLAG
  004 07/27/17 JCO					Changed %i to execute; update ErrorHandler2
  005 03/21/18 RJC					Added version code and copyright block
 ***********************************************************************/
drop program snsro_get_io_discovery go
create program snsro_get_io_discovery
 
/************************************************************************
; REQUEST
************************************************************************/
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "USERNAME: "		= ""
		, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, USERNAME, DEBUG_FLAG   ;003

/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.16.6.1" ;005
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
 
free record io_discovery_reply_out
record io_discovery_reply_out (
  1 io_main_id  				        = f8
  1 io_main_disp		 		        = vc
  1 io_main_name                        = vc
  1 io_main_desc                        = vc
  1 io_main_parent_id                   = f8
  1 intake_categories [*]
    2 category_id 				        = f8
    2 category_disp 				    = vc
    2 category_name                     = vc
    2 category_desc                     = vc
	2 display_seq						= i4
    2 parent_id                         = f8
	2 intake_components [*]
		3 component_id					= f8
		3 component_disp				= vc
        3 component_name                = vc
        3 component_desc                = vc
        3 display_seq                   = i4
        3 parent_id                     = f8
        3 accumulation_ind  			= i2
  1 output_categories [*]
    2 category_id 				        = f8
    2 category_disp 				    = vc
    2 category_name                     = vc
    2 category_desc                     = vc
	2 display_seq						= i4
    2 parent_id                         = f8
	2 output_components [*]
		3 component_id					= f8
		3 component_disp				= vc
        3 component_name                = vc
        3 component_desc                = vc
        3 display_seq                   = i4
        3 parent_id                     = f8
        3 accumulation_ind				= i2
  1 audit /*001*/
 	2 user_id							= f8
 	2 user_firstname					= vc
 	2 user_lastname						= vc
	2 patient_id						= f8
	2 patient_firstname					= vc
	2 patient_lastname					= vc
    2 service_version					= vc		;002
;004 %i cclsource:status_block.inc
/*004 begin */
  1 status_data
    2 status = c1
    2 subeventstatus[1]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
      3 Code = c4
      3 Description = vc
/*004 end */
)
 
set io_discovery_reply_out->status_data->status = "F"
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
declare APPLICATION_NUMBER 			= i4 with protect, constant (600005)
declare TASK_NUMBER 				= i4 with protect, constant (3200200)
declare REQ_NUMBER 					= i4 with protect, constant (1000013)
declare iRet						= i2 with protect, noconstant(0)			;001
declare dPersonID					= f8 with protect, noconstant(0)
declare sUsername					= vc with protect, noconstant("")
declare query_mode					= i4 with protect, noconstant (8)
declare idebugFlag					= i2 with protect, noconstant(0) ;003
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetIntakeOutputView(null)					= null with protect
declare PostAmble(null)								= null with protect
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
set sUsername   = trim($USERNAME,3)
set idebugFlag	= cnvtint($DEBUG_FLAG)  ;003
 
call echo(build("query_mode  ->", query_mode))
/****************************************************************************
;INCLUDES
****************************************************************************/
;004 %i ccluserdir:snsro_common.inc
execute snsro_common
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
call GetIntakeOutputView(null)
call PostAmble(null)
set iRet = PopulateAudit(sUsername, dPersonID, io_discovery_reply_out, sVersion)   ;002 	;001
 
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT

/*************************************************************************
; RETURN JSON
**************************************************************************/
 	set JSONout = CNVTRECTOJSON(io_discovery_reply_out)
 
if(idebugFlag > 0)
 
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_io_discovery.json")
	call echo(build2("_file : ", _file))
	call echojson(io_discovery_reply_out, _file, 0)
 
    ;call echorecord(io_discovery_reply_out)
 
	call echo(JSONout)
 
endif
 
    if(validate(_MEMORY_REPLY_STRING))
		set _MEMORY_REPLY_STRING = trim(JSONout,3)
	endif
 
 
#EXIT_VERSION
/*************************************************************************
;  Name: GetIntakeOutputView(null)
;  Description: Returns Intake Output iView Reference Structure
;
**************************************************************************/
subroutine GetIntakeOutputView(null)
 
if(idebugFlag > 0)
 
	set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetIntakeOutputView Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
set req_in->event_set_cd 			= 0
set req_in->event_set_disp          = ""
set req_in->batch_size				= 0
set req_in->event_set_name 			= "IO"
set req_in->query_mode 				= query_mode
set req_in->cache_mode 				= 1
set req_in->decode_flag 			= 1
 
if(idebugFlag > 0)
 
	call echorecord(req_in)
 
endif
 
set stat = tdbexecute(REQ_NUMBER, REQ_NUMBER, REQ_NUMBER,"REC",req_in,"REC",eventset_reply_out,1)
 
;call echorecord(eventset_reply_out)
 
if (stat = 1)
    call ErrorHandler2("EXECUTE", "F", "IO DISCOVERY", "Error retrieving Intake/Output view",
    "9999", "Error retrieving Intake/Output view - 1000013 - ", io_discovery_reply_out)	;004
    go to EXIT_SCRIPT
endif
 
if(idebugFlag > 0)
 
	call echo(concat("GetIntakeOutputView Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
/*************************************************************************
;  Name: PostAmble(null)
;  Description: Populate Intake Output discovery reply structure
;
**************************************************************************/
subroutine PostAmble(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("PostAmble Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
declare eventCnt				= i4 with protect, noconstant (0)
declare mainParentCnt			= i4 with protect, noconstant (0)
declare intakeCatCnt			= i4 with protect, noconstant (0)
declare outputCatCnt			= i4 with protect, noconstant (0)
declare io_flag					= i4 with protect, noconstant (0)
declare intakeParentId			= f8 with protect, noconstant (0.0)
declare outputParentId			= f8 with protect, noconstant (0.0)
declare intakeCatId				= f8 with protect, noconstant (0.0)
declare outputCatId				= f8 with protect, noconstant (0.0)
declare intakeCompCnt			= i4 with protect, noconstant (0)
declare outputCompCnt			= i4 with protect, noconstant (0)
declare intakePrimParentId		= f8 with protect, noconstant (0.0)
declare outputPrimParentId		= f8 with protect, noconstant (0.0)
 
set eventCnt = size(eventset_reply_out->rb_list, 5)
 
if(idebugFlag > 0)
 
	call echo(build("eventCnt: ", eventCnt))
 
endif
 
if(eventCnt > 0)
    ;IO Main Category is always first item in rb_list
    set io_discovery_reply_out->io_main_id = eventset_reply_out->rb_list[1].self_cd
    set io_discovery_reply_out->io_main_desc = eventset_reply_out->rb_list[1].self_descr
    set io_discovery_reply_out->io_main_name = eventset_reply_out->rb_list[1].self_name
    set io_discovery_reply_out->io_main_disp = eventset_reply_out->rb_list[1].self_disp
    set io_discovery_reply_out->io_main_parent_id = eventset_reply_out->rb_list[1].parent_event_set_cd
 
    if (io_discovery_reply_out->io_main_id = 0)
	    call ErrorHandler2("EXECUTE", "F", "IO DISCOVERY",
	    	"Unable to establish IO Main Category - io_main_id = 0",
	    	"9999", "Unable to establish IO Main Category - io_main_id = 0 (1000013)",
	    	io_discovery_reply_out)	;004
    	go to EXIT_SCRIPT
    endif
    if (io_discovery_reply_out->io_main_name != "IO")
	    call ErrorHandler2("EXECUTE", "F", "IO DISCOVERY",
	    	"Unable to establish IO Main Category - io_main_name not equal to IO",
	    	"9999", "Unable to establish IO Main Category - io_main_name not equal to IO (1000013)",
	    	io_discovery_reply_out)	;004
    	go to EXIT_SCRIPT
    endif
else
    call ErrorHandler("EXECUTE", "Z", "IO DISCOVERY", "Zero records found in Intake/Output view", io_discovery_reply_out)
    go to EXIT_SCRIPT
endif
 
;Loop through eventset_reply_out list and populate io_discovery_reply_out
;use IO_MAIN_PARENT_ID to determine both Intake and Output categories
;skip the first item in the list since that was accounted for above
for (x = 2 to eventCnt)
 
	;determine if we dealing with a child of top level IO Main Category
	if(eventset_reply_out->rb_list[x].parent_event_set_cd = io_discovery_reply_out->io_main_id)
		set mainParentCnt = mainParentCnt + 1
		if(mainParentCnt = 1)
			set intakeParentId = eventset_reply_out->rb_list[x].self_cd
			set io_flag = 1
		else
			set outputParentId = eventset_reply_out->rb_list[x].self_cd
			set io_flag = 2
		endif
	endif
 
	if(io_flag = 1)	; INTAKE
		;check if this is child of Intake parent, if so this is a new category
		if(eventset_reply_out->rb_list[x].parent_event_set_cd = intakeParentId)
			;increment intake category list
			set intakeCatCnt = intakeCatCnt + 1
			;update intake category id to identify children later
			set intakeCatId = eventset_reply_out->rb_list[x].self_cd
			;increase the size of the intake category list
			set stat = alterlist(io_discovery_reply_out->intake_categories,intakeCatCnt)
			;reset intake component count for new category
			set intakeCompCnt = 0
 
			if(idebugFlag > 0)
 
				call echo(build("Intake Cat Cnt: ",intakeCatCnt))
				call echo(build("Intake Comp Cnt: ",intakeCompCnt))
 
			endif
 
			set io_discovery_reply_out->intake_categories[intakeCatCnt].category_id = eventset_reply_out->rb_list[x].self_cd
			set io_discovery_reply_out->intake_categories[intakeCatCnt].category_disp = eventset_reply_out->rb_list[x].self_disp
			set io_discovery_reply_out->intake_categories[intakeCatCnt].category_name = eventset_reply_out->rb_list[x].self_name
			set io_discovery_reply_out->intake_categories[intakeCatCnt].category_desc = eventset_reply_out->rb_list[x].self_descr
			set io_discovery_reply_out->intake_categories[intakeCatCnt].parent_id = eventset_reply_out->rb_list[x].parent_event_set_cd
			set io_discovery_reply_out->intake_categories[intakeCatCnt].display_seq = eventset_reply_out->rb_list[x].collating_seq
 
		endif
		;check to see if this is a child of the current intake category
		if(eventset_reply_out->rb_list[x].parent_event_set_cd = intakeCatId)
			;check primitive indicator, if 1 then it is the top-level event code, if 0 then it is the bottom-level event code
			if(eventset_reply_out->rb_list[x].primitive_ind = 1)
				set intakeCompCnt = intakeCompCnt + 1
				set intakePrimParentId = eventset_reply_out->rb_list[x].self_cd
				set stat = alterlist(io_discovery_reply_out->intake_categories[intakeCatCnt]->intake_components,intakeCompCnt)
				set io_discovery_reply_out->intake_categories[intakeCatCnt]->intake_components[intakeCompCnt].accumulation_ind
					= eventset_reply_out->rb_list[x].accumulation_ind
				set io_discovery_reply_out->intake_categories[intakeCatCnt]->intake_components[intakeCompCnt].display_seq
					= eventset_reply_out->rb_list[x].collating_seq
			endif
		endif
		;check to see if this is a child of the primitive intake component
		if(eventset_reply_out->rb_list[x].parent_event_set_cd = intakePrimParentId)
 			set io_discovery_reply_out->intake_categories[intakeCatCnt]->intake_components[intakeCompCnt].component_id
 					= eventset_reply_out->rb_list[x].self_cd
			set io_discovery_reply_out->intake_categories[intakeCatCnt]->intake_components[intakeCompCnt].component_name
				= eventset_reply_out->rb_list[x].self_name
			set io_discovery_reply_out->intake_categories[intakeCatCnt]->intake_components[intakeCompCnt].component_desc
				= eventset_reply_out->rb_list[x].self_descr
			set io_discovery_reply_out->intake_categories[intakeCatCnt]->intake_components[intakeCompCnt].component_disp
				= eventset_reply_out->rb_list[x].self_disp
			set io_discovery_reply_out->intake_categories[intakeCatCnt]->intake_components[intakeCompCnt].parent_id
				= eventset_reply_out->rb_list[x].parent_event_set_cd
		endif
 
	else					; OUTPUT
		;check if this is child of Output parent, if so this is a new category
		if(eventset_reply_out->rb_list[x].parent_event_set_cd = outputParentId)
			;increment output category list
			set outputCatCnt = outputCatCnt + 1
			;update output category id to identify children later
			set outputCatId = eventset_reply_out->rb_list[x].self_cd
			;increase the size of the output category list
			set stat = alterlist(io_discovery_reply_out->output_categories,outputCatCnt)
			;reset output component count for new category
			set outputCompCnt = 0
 
 			call echo(build("Output Cat Cnt: ",outputCatCnt))
 			call echo(build("Output Comp Cnt: ",outputCompCnt))
			set io_discovery_reply_out->output_categories[outputCatCnt].category_id = eventset_reply_out->rb_list[x].self_cd
			set io_discovery_reply_out->output_categories[outputCatCnt].category_disp = eventset_reply_out->rb_list[x].self_disp
			set io_discovery_reply_out->output_categories[outputCatCnt].category_name = eventset_reply_out->rb_list[x].self_name
			set io_discovery_reply_out->output_categories[outputCatCnt].category_desc = eventset_reply_out->rb_list[x].self_descr
			set io_discovery_reply_out->output_categories[outputCatCnt].parent_id = eventset_reply_out->rb_list[x].parent_event_set_cd
			set io_discovery_reply_out->output_categories[outputCatCnt].display_seq = eventset_reply_out->rb_list[x].collating_seq
 
		endif
		;check to see if this is a child of the current output category
		if(eventset_reply_out->rb_list[x].parent_event_set_cd = outputCatId)
			;check primitive indicator, if 1 then it is the top-level event code, if 0 then it is the bottom-level event code
			if(eventset_reply_out->rb_list[x].primitive_ind = 1)
				set outputCompCnt = outputCompCnt + 1
				set outputPrimParentId = eventset_reply_out->rb_list[x].self_cd
				set stat = alterlist(io_discovery_reply_out->output_categories[outputCatCnt]->output_components,outputCompCnt)
				set io_discovery_reply_out->output_categories[outputCatCnt]->output_components[outputCompCnt].accumulation_ind
					= eventset_reply_out->rb_list[x].accumulation_ind
				set io_discovery_reply_out->output_categories[outputCatCnt]->output_components[outputCompCnt].display_seq
					= eventset_reply_out->rb_list[x].collating_seq
			endif
		endif
		;check to see if this is a child of the primitive output component
		if(eventset_reply_out->rb_list[x].parent_event_set_cd = outputPrimParentId)
 			set io_discovery_reply_out->output_categories[outputCatCnt]->output_components[outputCompCnt].component_id
 					= eventset_reply_out->rb_list[x].self_cd
			set io_discovery_reply_out->output_categories[outputCatCnt]->output_components[outputCompCnt].component_name
				= eventset_reply_out->rb_list[x].self_name
			set io_discovery_reply_out->output_categories[outputCatCnt]->output_components[outputCompCnt].component_desc
				= eventset_reply_out->rb_list[x].self_descr
			set io_discovery_reply_out->output_categories[outputCatCnt]->output_components[outputCompCnt].component_disp
				= eventset_reply_out->rb_list[x].self_disp
			set io_discovery_reply_out->output_categories[outputCatCnt]->output_components[outputCompCnt].parent_id
				= eventset_reply_out->rb_list[x].parent_event_set_cd
		endif
	endif
 
endfor
 
call ErrorHandler("EXECUTE", "S", "IO DISCOVERY", "Success executing 1000013 - intake/output views", io_discovery_reply_out)
 
if(idebugFlag > 0)
 
	call echo(concat("PostAmble Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
 
end
 
end go
 
