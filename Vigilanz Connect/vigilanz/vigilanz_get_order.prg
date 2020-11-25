/**************************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

***************************************************************************
          Date Written:       07/11/2015
          Source file name:   vigilanz_get_order
          Object name:        vigilanz_get_order
          Program purpose:    Returns a specific Order
          Executing from:     EMISSARY SERVICES
***********************************************************************
                  GENERATED MODIFICATION CONTROL LOG
***********************************************************************
 Mod Date     Engineer             Comment
------------------------------------------------------------------
  000 07/28/15  AAB					Initial write
  001 07/31/15  AAB					Add missing fields in response
  002 09/01/15  AAB					Changed fields in response to VC in comment obj
  003 09/14/15  AAB					Add audit object
  004 12/14/15  AAB 				Return patient class
  005 02/22/16 	AAB 				Add encntr_type_cd and encntr_type_disp
  006 04/29/16  AAB 				Added version
  007 10/10/16  AAB 				Add DEBUG_FLAG
  008 07/27/17  JCO					Changed %i to execute; update ErrorHandler2
  009 03/21/18	RJC					Added version code and copyright block
  010 11/23/18  STV                 Activated GetAddtnlOrder(null) to get accession_nbr
  011 02/25/19	RJC					Added parent order id
  012 08/27/19	RJC					Added VerifiedStatus and IsNurseReviewed fields; code cleanup
 ***********************************************************************/
drop program vigilanz_get_order go
create program vigilanz_get_order
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Order ID:" = 0.0
		, "Username:" = ""
		, "Debug Flag" = 0		;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, ORDER_ID, USERNAME, DEBUG_FLAG   ;007
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
;500236 - orm_get_order_info
free record 500236_req
record 500236_req
(
  1 order_id                       = f8
)
 
free record 500236_rep
record 500236_rep
(
    1 person_id                    = f8
    1 encntr_id                    = f8
    1 order_mnemonic               = vc
    1 hna_mnemonic 		  		   = vc
    1 ordered_as_mnemonic          = vc
    1 action_personnel_id          = f8
    1 communication_type_cd        = f8
    1 communication_type_disp      = c40
    1 provider_id                  = f8
    1 catalog_type_cd              = f8
    1 catalog_type_disp            = c40
    1 action_dt_tm                 = dq8
    1 action_tz                    = i4
    1 orig_order_dt_tm		  	   = dq8
    1 orig_order_tz		    	   = i4
    1 medstudent_action_ind        = i2
    1 template_order_id            = f8
    1 action_sequence              = i4
    1 discontinue_type_cd          = f8
    1 med_order_type_cd			   = f8
    1 additive_count_for_IVPB	   = i4
    1 orderable_type_flag		   = i4
    1 clinically_sig_diluent_count = i4
    1 therap_sbsttn_id 			   = f8
  1 status_data
    2 status = c1
    2 subeventstatus[1]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
)
 
;500257 - orm_get_order_info_addinfo
free record 500257_req
record 500257_req
(
	1 order_id 						= f8
)
 
free record 500257_rep
record 500257_rep
(
  1 order_syn               		= vc
  1 ancillary_value         		= vc
  1 ancillary_cd            		= f8
  1 ancillary_disp          		= c40
  1 brand_name_value        		= vc
  1 brand_name_cd           		= f8
  1 brand_name_disp         		= c40
  1 generic_name_value      		= vc
  1 generic_name_cd         		= f8
  1 generic_name_disp       		= c40
  1 accession_nbr           		= vc
  1 activity_type_cd        		= f8
  1 careset                 		= vc
  1 order_id                		= f8
  1 cs_order_id             		= f8
  1 template_order_id       		= f8
  1 template_order_detail   		= vc
  1 catalog_type_cd         		= f8
  1 catalog_type_disp       		= vc
  1 catalog_type_mean       		= c12
  1 freq                    		= vc
  1 freq_label              		= vc
  1 freq_cd                 		= f8
  1 adhoc_freq_instance     		= f8
  1 template_order_flag     		= i2
  1 current_start_dt_tm     		= dq8
  1 current_start_tz     			= i4
  1 projected_stop_dt_tm    		= dq8
  1 projected_stop_tz    			= i4
  1 stop_type_cd            		= f8
  1 stop_type_disp         			= vc
  1 stop_type_mean          		= c12
  1 catalog_cd              		= f8
  1 provider_id             		= f8
  1 suspend_dt_tm           		= dq8
  1 suspend_tz           			= i4
  1 resume_dt_tm            		= dq8
  1 resume_tz            			= i4
  1 suspend_ind             		= i2
  1 resume_ind              		= i2
  1 dept_status_cd          		= f8
  1 dept_status_disp        		= c40
  1 lookup_status   				= I4
  1 cs_qual_cnt             		= i2
  1 cs_qual[1]
    2 order_mnemonic        		= vc
    2 order_detail_display_line 	= vc
 1 pw_qual_cnt              		= i2
 1 pw_qual[1]
    2 pathway_id            		= f8
    2 pathway_description   		= vc
 1 order_instance_cnt       		= i2
 1 synonym_id						= f8
 1 vdpa_ind 						= i2
 1 instance_qual[*]
    2 current_start_dt_tm   		= dq8
    2 current_start_tz   			= i4
    2 vdpa_strength_dose 			= f8
    2 vdpa_strength_dose_unit_cd 	= f8
    2 vdpa_volume_dose 				= f8
    2 vdpa_volume_dose_unit_cd 		= f8
    2 vdpa_ordered_dose_type_flag 	= i2
 1 order_schedule_precision_bit 	= i4
 1 status_data
   2 status 						= c1
   2 subeventstatus[1]
     3 OperationName 				= c25
     3 OperationStatus 				= c1
     3 TargetObjectName 			= c25
     3 TargetObjectValue 			= vc
     3 Code 						= c4
     3 Description 					= vc
)
 
;500237 - orm_get_order_info_comment
free record 500237_req
record 500237_req
(
  1 order_id 						= f8
  1 last_cmt_ind 					= i2
  1 cmt_type_cnt 					= i2
  1 cmt_type_qual [*]
		2 cmt_type_cd 				= f8
)
 
free record 500237_rep
record 500237_rep
(
  1 cmt_type_cnt        			= i4
  1 cmt_type_qual[*]
    2 cmt_type_cd       			= f8
    2 cmt_type_disp     			= vc
    2 cmt_type_mean     			= vc
    2 cmt_cnt           			= i4
    2 cmt_qual[*]
        3 cmt_text      			= vc
        3 updt_id       			= f8
        3 updt_dt_tm    			= dq8
  1 lookup_status   				= i4
  1 status_data
    2 status = c1
    2 subeventstatus[1]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
)
 
;Final Reply
free record order_reply_out
record order_reply_out(
	1 order_item
		2 accession_nbr                     = vc
		2 person_id                    		= f8
		2 encntr_id                    		= f8
		2 encntr_type_cd					= f8	;004
		2 encntr_type_disp					= vc	;004
		2 encntr_type_class_cd				= f8	;005
		2 encntr_type_class_disp			= vc	;005
		2 order_id 							= f8
		2 order_mnemonic               		= vc
		2 hna_mnemonic 		  		   		= vc
		2 ordered_as_mnemonic          		= vc
		2 action_personnel_id          		= f8
		2 communication_type_cd        		= f8
		2 communication_type_disp      		= vc
		2 provider_id                  		= f8
		2 order_status_disp          		= vc
		2 activity_type_disp          		= vc
		2 orig_date                 		= dq8
		2 clinical_display_line				= vc
		2 simplified_display_line			= vc
		2 catalog_type_cd              		= f8
		2 catalog_type_disp            		= vc
		2 action_dt_tm                 		= dq8
		2 action_tz                    		= i4
		2 orig_order_dt_tm		  	   		= dq8
		2 orig_order_tz		    	   		= i4
		2 current_start_dt_tm     			= dq8
		2 projected_stop_dt_tm    			= dq8
		2 stop_type_cd            			= f8
		2 stop_type_disp         			= vc
		2 dept_status_cd          			= f8
		2 dept_status_disp        			= vc
		2 medstudent_action_ind        		= i2
		2 template_order_id            		= f8
		2 action_sequence              		= i4
		2 discontinue_type_cd          		= f8
		2 med_order_type_cd			   		= f8
		2 additive_count_for_IVPB	   		= i4
		2 orderable_type_flag		   		= i4
		2 clinically_sig_diluent_count 		= i4
		2 therap_sbsttn_id 			   		= f8
		2 detail_count						= i4
		2 parent_order_id					= f8
		2 verified_status					= vc
		2 is_nurse_reviewed					= i2
	1 detqual[*]
		2 oe_field_display_value 			= vc
		2 label_text						= vc
		2 group_seq							= i4
		2 field_seq							= i4
		2 oe_field_id						= f8
		2 oe_field_dt_tm					= dq8
		2 oe_field_tz						= i4
		2 oe_field_meaning_id				= f8
		2 oe_field_meaning  				= vc
		2 oe_field_value					= f8
		2 order_schedule_precision_bit		= i4
	1 order_comment[*]
		2 cmt_type_cd       				= f8
		2 cmt_type_disp     				= vc
		2 cmt_type_mean     				= vc
		2 cmt_cnt           				= i4
		2 comment[*]
			3 cmt_text      				= vc
			3 updt_id       				= f8
			3 updt_dt_tm    				= dq8
	1 audit
		2 user_id							= f8
		2 user_firstname					= vc
		2 user_lastname						= vc
		2 patient_id						= f8
		2 patient_firstname					= vc
		2 patient_lastname					= vc
	    2 service_version					= vc
  1 status_data
    2 status 								= c1
    2 subeventstatus[1]
      3 OperationName 						= c25
      3 OperationStatus 					= c1
      3 TargetObjectName 					= c25
      3 TargetObjectValue 					= vc
      3 Code 								= c4
      3 Description 						= vc
 
)
 
set order_reply_out->status_data->status = "F"
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Input
declare dOrderId  			= f8 with protect, noconstant(0.0)
declare sUserName			= vc with protect, noconstant("")   ;003
declare iRet				= i2 with protect, noconstant(0) 	;003
declare iDebugFlag			= i2 with protect, noconstant(0) ;007
 
; Constants
declare c_ord_comment_cmt_type_cd 	= f8 with protect, constant(uar_get_code_by("MEANING", 14, "ORD COMMENT"))
declare c_clinhist_cmt_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING", 14, "CLINHIST"))
declare c_genclinhist_cmt_type_cd 	= f8 with protect, constant(uar_get_code_by("MEANING", 14, "GENCLINHIST"))
declare c_marnote_cmt_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING", 14, "MARNOTE"))
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
;Input
set dOrderId 				= cnvtreal($ORDER_ID)
set sUserName				= trim($USERNAME, 3)
set iDebugFlag				= cnvtint($DEBUG_FLAG)
 
if(iDebugFlag > 0)
	call echo(build("sUserName  ->", sUserName))
	call echo(build("dOrderId  ->", dOrderId))
endif
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetOrder(null)				 	= null with protect ;500236 - orm_get_order_info
declare GetAddtnlOrder(null)			= null with protect	;500257 - orm_get_order_info_addinfo
declare GetOrderDetails(null)			= null with protect
declare GetOrderComments(null)			= null with protect	;500237 - orm_get_order_info_comment
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Verify OrderId exists
if(dOrderId = 0)
	call ErrorHandler2("EXECUTE", "F", "ORDER", "No Order ID was passed in",
	"2055", "Missing required field: OrderId", order_reply_out)	;008
	go to EXIT_SCRIPT
endif
 
; Get Order Information -- 500236 - orm_get_order_info
call GetOrder(null)
 
; Validate Username
set iRet = PopulateAudit(sUserName, order_reply_out->order_item->person_id, order_reply_out, sVersion)   ;006    ;003
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "ORDER", "Invalid User for Audit.",
	"1001", build("UserId is invalid: ", sUserName), order_reply_out)	;008
	go to EXIT_SCRIPT
endif
 
; Get AdditionalOrder details -- 500257 - orm_get_order_info_addinfo
call GetAddtnlOrder(null)
 
; Get Order Details
call GetOrderDetails(null)
 
; Get Order Comments -- 500237 - orm_get_order_info_comment
call GetOrderComments(null)
 
;Set final audit
call ErrorHandler("EXECUTE", "S", "ORDER", "Successfully retrieved Order Information", order_reply_out)
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(order_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_order.json")
	call echo(build2("_file : ", _file))
	call echojson(order_reply_out, _file, 0)
	call echorecord(order_reply_out)
	call echo(JSONout)
endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: GetOrder(null) = null  -- 500236 - orm_get_order_info
;  Description: This will retrieve Order information for a given order
**************************************************************************/
subroutine GetOrder(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetOrder Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iApplication = 600005
	set iTask = 500150
	set iRequest = 500236
 
 	;Setup request
	set 500236_req->order_id = dOrderId
 
 	;Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",500236_req,"REC", 500236_rep)
 
	if (500236_rep->status_data->status = "F")
		call ErrorHandler2("EXECUTE", "F", "ORDER", "Error retrieving ORDER information ",
		"9999", "Error retrieving ORDER information", order_reply_out)	;008
		go to EXIT_SCRIPT
	endif
 
	set order_reply_out->order_item->person_id                    	= 500236_rep->person_id
	set order_reply_out->order_item->encntr_id                    	= 500236_rep->encntr_id
	set order_reply_out->order_item->encntr_type_cd					= GetPatientClass(order_reply_out->order_item->encntr_id,1)  	 ;004
	set order_reply_out->order_item->encntr_type_disp				= uar_get_code_display(order_reply_out->order_item->encntr_type_cd)  ;004
	set order_reply_out->order_item->encntr_type_class_cd			= GetPatientClass(order_reply_out->order_item->encntr_id,2)  	 ;005
	set order_reply_out->order_item->encntr_type_class_disp			=
		uar_get_code_display(order_reply_out->order_item->encntr_type_class_cd)  ;005
	set order_reply_out->order_item->order_id						= dOrderId
	set order_reply_out->order_item->order_mnemonic               	= 500236_rep->order_mnemonic
	set order_reply_out->order_item->hna_mnemonic 		  		   	= 500236_rep->hna_mnemonic
	set order_reply_out->order_item->ordered_as_mnemonic          	= 500236_rep->ordered_as_mnemonic
	set order_reply_out->order_item->action_personnel_id          	= 500236_rep->action_personnel_id
	set order_reply_out->order_item->communication_type_cd        	= 500236_rep->communication_type_cd
	set order_reply_out->order_item->communication_type_disp      	= 500236_rep->communication_type_disp
	set order_reply_out->order_item->provider_id                  	= 500236_rep->provider_id
	set order_reply_out->order_item->catalog_type_cd              	= 500236_rep->catalog_type_cd
	set order_reply_out->order_item->catalog_type_disp            	= 500236_rep->catalog_type_disp
	set order_reply_out->order_item->action_dt_tm                 	= 500236_rep->action_dt_tm
	set order_reply_out->order_item->action_tz                    	= 500236_rep->action_tz
	set order_reply_out->order_item->orig_order_dt_tm		  	   	= 500236_rep->orig_order_dt_tm
	set order_reply_out->order_item->orig_order_tz		    	   	= 500236_rep->orig_order_tz
	;set order_reply_out->order_item->current_start_dt_tm     		= 500236_rep->current_start_dt_tm
	;set order_reply_out->order_item->projected_stop_dt_tm    		= 500236_rep->projected_stop_dt_tm
	;set order_reply_out->order_item->stop_type_cd            		= 500236_rep->stop_type_cd
	;set order_reply_out->order_item->stop_type_disp         		= 500236_rep->stop_type_disp
	;set order_reply_out->order_item->dept_status_cd          		= 500236_rep->dept_status_cd
	;set order_reply_out->order_item->dept_status_disp        		= 500236_rep->dept_status_disp
	set order_reply_out->order_item->medstudent_action_ind        	= 500236_rep->medstudent_action_ind
	set order_reply_out->order_item->template_order_id            	= 500236_rep->template_order_id
	set order_reply_out->order_item->action_sequence              	= 500236_rep->action_sequence
	set order_reply_out->order_item->discontinue_type_cd          	= 500236_rep->discontinue_type_cd
	set order_reply_out->order_item->med_order_type_cd			   	= 500236_rep->med_order_type_cd
	set order_reply_out->order_item->additive_count_for_IVPB	   	= 500236_rep->additive_count_for_IVPB
	set order_reply_out->order_item->orderable_type_flag		   	= 500236_rep->orderable_type_flag
	set order_reply_out->order_item->clinically_sig_diluent_count 	= 500236_rep->clinically_sig_diluent_count
	set order_reply_out->order_item->therap_sbsttn_id 			   	= 500236_rep->therap_sbsttn_id
	set order_reply_out->order_item.parent_order_id					= 500236_rep->template_order_id
 
	if(iDebugFlag > 0)
		call echo(concat("GetOrder Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;End Sub
 
/*************************************************************************
;  Name: GetAddtnlOrder(null) = null	-- 500257 - orm_get_order_info_addinfo
;  Description: This will retrieve Additional Order information for a given order
**************************************************************************/
subroutine GetAddtnlOrder(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetAddtnlOrder Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iApplication = 600005
	set iTask = 500150
	set iRequest = 500257
 
	;Setup request
	set 500257_req->order_id = dOrderId
 
	;Execute request
	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",500257_req,"REC", 500257_rep)
	set order_reply_out->order_item->accession_nbr = trim(500257_rep->accession_nbr)
 
	if(500257_rep->status_data->status = "F")
		call ErrorHandler2("EXECUTE", "F", "ORDER", "Error retrieving Additional ORDER information ",
		"9999", order_reply_out)	;008
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetAddtnlOrder Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;End Sub
 
/*************************************************************************
;  Name: GetOrderDetails(null)
;  Description: This will retrieve all order details for an order
**************************************************************************/
subroutine GetOrderDetails(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetOrderDetails Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	select into "nl:"
	from orders os
		,order_detail od
		,oe_format_fields  off
	plan os where  os.order_id = dOrderId
	join od where od.order_id = os.order_id
	join off where off.oe_format_id = os.oe_format_id
		and off.oe_field_id = od.oe_field_id
	head os.order_id
		detail_cnt = 0
 
		order_reply_out->order_item->current_start_dt_tm = os.current_start_dt_tm
		order_reply_out->order_item->projected_stop_dt_tm = os.projected_stop_dt_tm
		order_reply_out->order_item->stop_type_cd = os.stop_type_cd
		order_reply_out->order_item->stop_type_disp = uar_get_code_display(os.stop_type_cd)
		order_reply_out->order_item->dept_status_disp	= uar_get_code_display(dept_status_cd)
		order_reply_out->order_item->dept_status_cd	= os.dept_status_cd
		order_reply_out->order_item->order_status_disp = uar_get_code_display(os.order_status_cd)
		order_reply_out->order_item->activity_type_disp	= uar_get_code_display(os.activity_type_cd)
		order_reply_out->order_item->orig_date = os.orig_order_dt_tm
		order_reply_out->order_item->clinical_display_line	= os.clinical_display_line
		order_reply_out->order_item->simplified_display_line = os.simplified_display_line
 
		if(os.need_nurse_review_ind = 0)
			order_reply_out->order_item.is_nurse_reviewed = 1
		endif
		
		case(os.need_rx_verify_ind)
			of 0: order_reply_out->order_item.verified_status = "Verified"
			of 1: order_reply_out->order_item.verified_status = "Unverified"
			of 2: order_reply_out->order_item.verified_status = "Rejected"
		endcase
	detail
		detail_cnt = detail_cnt + 1
		stat = alterlist(order_reply_out->detqual, detail_cnt)
 
		if (size(od.oe_field_display_value,1) > 0)
			order_reply_out->detqual[detail_cnt]->oe_field_display_value = trim(od.oe_field_display_value,1)
		endif
 
		if (od.oe_field_dt_tm_value > NULL)
	        order_reply_out->detqual[detail_cnt]->oe_field_dt_tm = od.oe_field_dt_tm_value
		endif
 
		order_reply_out->detqual[detail_cnt]->oe_field_id 		   = od.oe_field_id
		order_reply_out->detqual[detail_cnt]->label_text          = off.label_text
		order_reply_out->detqual[detail_cnt]->group_seq           = off.group_seq
		order_reply_out->detqual[detail_cnt]->field_seq           = off.field_seq
		order_reply_out->detqual[detail_cnt]->oe_field_tz         = od.oe_field_tz
		order_reply_out->detqual[detail_cnt]->oe_field_meaning_id = od.oe_field_meaning_id
		order_reply_out->detqual[detail_cnt]->oe_field_meaning    = od.oe_field_meaning
		order_reply_out->detqual[detail_cnt]->oe_field_value      = od.oe_field_value
		order_reply_out->order_item->detail_count				  = detail_cnt
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetOrderDetails Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetOrderComments(null) = null	-- 500237 - orm_get_order_info_comment
;  Description: This will retrieve  Order Comment for a given order
**************************************************************************/
subroutine GetOrderComments(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetOrderComments Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iApplication = 600005
	set iTask = 500150
	set iRequest = 500237
 
	;Setup request
	set 500237_req->order_id 		= dOrderId
	set 500237_req->last_cmt_ind 	= 0
	set 500237_req->cmt_type_cnt	= 4
 
	set stat = alterlist(500237_req->cmt_type_qual, 4)
	set 500237_req->cmt_type_qual[1]->cmt_type_cd = c_ord_comment_cmt_type_cd
	set 500237_req->cmt_type_qual[2]->cmt_type_cd = c_clinhist_cmt_type_cd
	set 500237_req->cmt_type_qual[3]->cmt_type_cd = c_genclinhist_cmt_type_cd
	set 500237_req->cmt_type_qual[4]->cmt_type_cd = c_marnote_cmt_type_cd
 
	;Execute request
	set stat = tdbexecute(iApplication, iTask, iRequest,"REC",500237_req,"REC", 500237_rep)
 
	if (500237_rep->status_data->status = "F")
		call ErrorHandler2("EXECUTE", "F", "ORDER", "Error retrieving ORDER Comments",
		"9999", order_reply_out)	;008
		go to EXIT_SCRIPT
	endif
 
	if(size(500237_rep->cmt_type_qual,5) > 0)
		set stat = moverec(500237_rep->cmt_type_qual,order_reply_out->order_comment)
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetOrderComments Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
end go
