/***********************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

************************************************************************
          Date Written:       01/04/19
          Source file name:   snsro_get_ord_sent_disc.prg
          Object name:        vigilanz_get_ord_sent_disc
          Program purpose:    Provides order sentences for a synonym_id
          Executing from:     Emissary mPages Web Service
 ***********************************************************************
                   GENERATED MODIFICATION CONTROL LOG
 ***********************************************************************
 Mod Date		Engineer	Comment
 -----------------------------------------------------------------------
 000 01/10/19 	RJC			Initial Write
 002 09/09/19   RJC         Renamed file and object
 ***********************************************************************/
;drop program snsro_get_ord_sentence_disc go
drop program vigilanz_get_ord_sent_disc go
create program vigilanz_get_ord_sent_disc
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "UserName" = ""        	;Optional
		, "OrderableCodeId" = ""	;Required
		, "Debug Flag" = 0			;Optional. Verbose logging when set to one (1).
 
with OUTDEV,USERNAME,ORDERABLE,DEBUG_FLAG
 
/*************************************************************************
;VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
 
; Final reply
free record final_reply_out
record final_reply_out (
	1 order_sentences[*]
		2 order_sentence_id 			= f8
		2 order_sentence_display_line 	= vc
		2 order_comment 				= vc
		2 order_detail_id 				= f8
		2 order_detail_name 			= vc
		2 order_fields[*]
			3 id 						= f8
			3 name 						= vc
			3 type 						= vc
			3 default_value 			= vc
			3 is_multi_response 		= i2
			3 required_flag
				4 id 					= f8
				4 name 					= vc
			3 values[*]
				4 id 					= f8
				4 name 					= vc
			3 visible_flag
				4 id 					= f8
				4 name 					= vc
	1 status_data
		2 status 						= c1
	    2 subeventstatus[1]
	    	3 OperationName 			= c25
	      	3 OperationStatus 			= c1
		      3 TargetObjectName 		= c25
		      3 TargetObjectValue 		= vc
		      3 Code 					= c4
		      3 Description 			= vc
	1 audit
		2 user_id						= f8
		2 user_firstname				= vc
		2 user_lastname					= vc
		2 patient_id					= f8
		2 patient_firstname				= vc
		2 patient_lastname				= vc
 	    2 service_version				= vc
 	    2 query_execute_time			= vc
	    2 query_execute_units			= vc
)
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Input
declare sUserName					= vc with protect, noconstant("")
declare dOrderableCd				= f8 with protect, noconstant(0.0)
declare iDebugFlag					= i2 with protect, noconstant(0)
 
; Constants
declare c_error_handler_name 		= vc with protect, constant("ORDER SENTENCE DISCOVERY")
declare c_ordersent_filter_type_cd	= f8 with protect, constant(uar_get_code_by("MEANING",30620,"ORDERSENT"))
declare c_order_action_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",6003,"ORDER"))
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
;Input
set sUserName								= trim($USERNAME, 3)
set dOrderableCd							= cnvtreal($ORDERABLE)
set iDebugFlag								= cnvtint($DEBUG_FLAG)
 
if(iDebugFlag > 0)
	call echo(build("sUserName  	->", sUserName))
	call echo(build("dOrderableCd  	->", dOrderableCd))
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetOrderSentences(null)		= null with protect
declare GetOrderFieldsDetail(null) 	= null with protect
/*************************************************************************
; MAIN
**************************************************************************/
; Validate username
set iRet = PopulateAudit(sUserName, 0.0, final_reply_out, sVersion)
if(iRet = 0)
 	call ErrorHandler2(c_error_handler_name, "F", "Validate", "Invalid User for Audit.",
	"1001",build("Invlid user: ",sUserName), final_reply_out)
 	go to exit_script
endif
 
; Get Order sentences
call GetOrderSentences(null)

; Get order entry format fields details
call GetOrderFieldsDetail(null)
 
; Set audit to success
call ErrorHandler2(c_error_handler_name, "S", "Success", "Completed successfully.",
"0000","Completed successfully.", final_reply_out)
 
/*************************************************************************
 EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************
 Convert REC output to JSON
**************************************************************/
set JSONout = CNVTRECTOJSON(final_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_order_sentence_discovery.json")
	call echo(build2("_file : ", _file))
	call echojson(final_reply_out, _file, 0)
 	call echorecord(final_reply_out)
   	call echo(JSONout)
endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: GetOrderSentences(null) = null
;  Description: Routine to get order sentences
**************************************************************************/
subroutine GetOrderSentences(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat(" Begin GetOrderSentences", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	select into "nl:"
 	from order_catalog_synonym ocs
	    ,ord_cat_sent_r ocsr
	    ,order_sentence os
	    ,order_entry_format oef
	    ,long_text lt
	plan ocs where ocs.synonym_id = dOrderableCd
    	and ocs.active_ind = 1
    join ocsr where ocsr.synonym_id = ocs.synonym_id
    	and ocsr.active_ind = 1
    join os where os.order_sentence_id = ocsr.order_sentence_id
    join oef where oef.oe_format_id = os.oe_format_id
		and oef.action_type_cd = c_order_action_type_cd
    join lt where lt.long_text_id = outerjoin(os.ord_comment_long_text_id)
	head report
		x = 0
	detail
		x = x + 1
		stat = alterlist(final_reply_out->order_sentences,x)
 
		final_reply_out->order_sentences[x].order_sentence_id = os.order_sentence_id
		final_reply_out->order_sentences[x].order_sentence_display_line = os.order_sentence_display_line
		final_reply_out->order_sentences[x].order_detail_id = os.oe_format_id
		final_reply_out->order_sentences[x].order_detail_name = oef.oe_format_name
		final_reply_out->order_sentences[x].order_comment = lt.long_text
	with nocounter
	
	; Validate order sentences exist
	if(size(final_reply_out->order_sentences,5) = 0)
		call ErrorHandler2(c_error_handler_name, "Z", "Success", "No records found",
		"0000","No records found.", final_reply_out)
		go to exit_script
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetOrderSentences Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetOrderFieldsDetail(null) = null
;  Description: Routine to get order entry format details
**************************************************************************/
subroutine GetOrderFieldsDetail(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat(" Begin GetOrderFieldsDetail", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	select into "nl:"
 	osd.order_sentence_id
 	, osd.oe_field_id
 	, osd.default_parent_entity_id
	from (dummyt d with seq = size(final_reply_out->order_sentences,5))
		, order_sentence_detail osd
		, oe_format_fields oef
	     ,order_entry_fields off
	     ,dm_flags dm
	     ,dm_flags dm2
	plan d 
	join osd where osd.order_sentence_id = final_reply_out->order_sentences[d.seq].order_sentence_id
	join oef where oef.oe_format_id = final_reply_out->order_sentences[d.seq].order_detail_id
		and oef.oe_field_id = osd.oe_field_id
		and oef.action_type_cd = c_order_action_type_cd
		and oef.oe_field_id > 0
	join off where off.oe_field_id = oef.oe_field_id
	join dm where dm.flag_value = oef.accept_flag
		and dm.table_name = "OE_FORMAT_FIELDS"
		and dm.column_name = "ACCEPT_FLAG"
	join dm2 where dm2.flag_value = off.field_type_flag
		and dm2.table_name = "ORDER_ENTRY_FIELDS"
		and dm2.column_name = "FIELD_TYPE_FLAG"
	order by osd.order_sentence_id, osd.oe_field_id
	head osd.order_sentence_id
		x = 0
	head osd.oe_field_id
		y = 0
		x = x + 1
		stat = alterlist(final_reply_out->order_sentences[d.seq].order_fields,x)
		
		final_reply_out->order_sentences[d.seq].order_fields[x].id = osd.oe_field_id
		final_reply_out->order_sentences[d.seq].order_fields[x].name = trim(oef.label_text,3)
		final_reply_out->order_sentences[d.seq].order_fields[x].is_multi_response = off.allow_multiple_ind
		final_reply_out->order_sentences[d.seq].order_fields[x].required_flag.id = oef.accept_flag
		final_reply_out->order_sentences[d.seq].order_fields[x].required_flag.name = dm.description
		final_reply_out->order_sentences[d.seq].order_fields[x].default_value = oef.default_value
		final_reply_out->order_sentences[d.seq].order_fields[x].type = dm2.description
		final_reply_out->order_sentences[d.seq].order_fields[x].visible_flag.id = oef.accept_flag
		final_reply_out->order_sentences[d.seq].order_fields[x].visible_flag.name = dm.description
	detail
		y = y + 1
		stat = alterlist(final_reply_out->order_sentences[d.seq].order_fields[x].values,y)
		
		final_reply_out->order_sentences[d.seq].order_fields[x].values[y].id = osd.default_parent_entity_id
		final_reply_out->order_sentences[d.seq].order_fields[x].values[y].name = osd.oe_field_display_value
	with nocounter
		
	if(iDebugFlag > 0)
		call echo(concat("GetOrderFieldsDetail Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
end
go
