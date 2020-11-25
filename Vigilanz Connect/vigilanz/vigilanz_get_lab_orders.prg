/*************************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

**************************************************************************
          Date Written:       11/08/14
          Source file name:   snsro_get_lab_orders.prg
          Object name:        vigilanz_get_lab_orders
          Program purpose:    Performs a query for LAB orders by
          					  Collected Date/Time or Reported Date/Time
          					  and return lab order and result reference
          					  information.
          Tables read:		  ORDERS, ORDER_DETAIL
          Executing from:     EMISSARY SERVICES
***********************************************************************
                  GENERATED MODIFICATION CONTROL LOG
***********************************************************************
 
 Mod Date     Engineer             Comment
-----------------------------------------------------------------------
  000 12/09/14 JCO					Initial write
  001 01/08/15 JCO					Added OUTERJOIN to main query
  002 01/09/15 JCO					Added NORMAL_HIGH, NORMAL_LOW
  003 01/12/15 AAB					Made the query to retrieve Lab orders
									dynamic to flex with the optional fields.
  004 01/13/15 AAB 					Populate LOINC for each result component
  005 01/18/15 AAB 					Support MAX_RECORDS
  006 02/18/15 AAB 					Changed Date Type to (1,2).
  006 02/18/15 AAB					Added some better checks for Blank date values
  007 04/20/15 AAB 					Fixed counter. oCnt was being used for the size which
									is not correct if MaxRecs is set
  008 04/27/15 AAB 					Change lab_loc to a list
  009 05/18/15 AAB 					Added ORDER_ID to input parameters and query by order_id
  010 05/22/15 AAB 					Changed query to use oa.order_provider_id and not oa.action_personnel_id
  011 05/26/15 AAB 					Added clinsig_updt_dt_tm to result object
  012 05/26/15 AAB 					Use CDF_Meaning when pulling the display value for normalcy_cd
  013 09/14/15 AAB					Add audit object
  014 12/14/15 AAB					Return patient class
  015 02/23/16 AAB					Add encntr_type_cd and encntr_type_disp
  016 04/12/16 AAB 					Use event_start_dt_tm for COLLECTED_DATE
  017 04/29/16 AAB 					Added version
  018 06/13/16 JCO					Use ORDERED_AS_MNEMONIC to match PowerChart display
  019 10/10/16 AAB 					Add DEBUG_FLAG
  020 07/27/17 JCO					Changed %i to execute; update ErrorHandler2
  021 08/17/17 JCO					Added UTC logic
  022 02/19/18 RJC					Changed Get Orders parser commands to select if to improve efficiency
  023 03/21/18 RJC					Added version code and copyright block
  024 03/27/18 RJC					Fixed issue with order detail in GetLabOrders routine. defaulted datetype to 1
  025 02/25/19 RJC					Added parent order id
  026 04/05/19 RJC					Added patient_id to list object
  027 08/29/19 RJC					Added isNurseReviewed field
 ***********************************************************************/
drop program vigilanz_get_lab_orders go
create program vigilanz_get_lab_orders
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Person ID:" = 0.0			;required
		, "Encounter ID:" = 0.0			;optional
		, "Order ID:" = 0.0				;optional
		, "Order Type:" = "ALL LABS" 	;default to ALL LABS, example: Glucose,
		, "Date Type:" = 1				;1=Ordered Date(default), 2=Collected Date
		, "From Date:" = "01-JAN-1900"	;default beginning of time
		, "To Date:" = "31-DEC-2100"	;default end of time
		, "Include Results:" = 0		;show result components
		, "Include Audit:" = 0			;show user actions and date/time
		, "Include Lab Location: " = 0	;show lab address information
		, "Maximum records: " = 0		;limit the number of results returned	if 0 then no limit
		, "User Name:" = ""        		;013
		, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, PERSON_ID, ENCNTR_ID, ORDER_ID, ORDER_TYPE, DATE_TYPE, FROM_DATE, TO_DATE,
	INC_RESULTS, INC_AUDIT, INC_LAB_LOC, MAX_RECORDS,USERNAME, DEBUG_FLAG   ;019
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2" ;023
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record laborders_reply_out
record laborders_reply_out
(
  1 person_id 					= f8
  1 encntr_id 					= f8
  1 lab_orders_qual 			= i4
  1 lab_orders [*]
    2 order_id 					= f8
    2 accession_nbr 			= vc
    2 specimen_type 			= vc
    2 order_status 				= vc
    2 order_desc 				= vc
    2 ordered_date 				= dq8
    2 ordered_by 				= vc
    2 collected_date 			= dq8
	2 encntr_id 				= f8	;014
	2 encntr_type_cd			= f8	;014
	2 encntr_type_disp			= vc	;014
	2 encntr_type_class_cd		= f8	;015
	2 encntr_type_class_disp	= vc	;015
	2 patient_id				= f8
    ;2 authorized_by = vc
    2 link_to_send_out 			= vc
    2 lab_result [*]
      3 result_id 				= f8	;event id
      3 seq_number 				= i4
      3 result_date 			= dq8
      3 result_value 			= vc
      3 component_id 			= f8	;result event code
      3 component_desc 			= vc
      3 normal_low 				= vc	;002
      3 normal_high 			= vc	;002
	  3 clinsig_updt_dt_tm		= dq8	;011
      ;3 ref_range 				= vc	;002
	  3 units_of_measure 		= vc
      3 normalcy 				= vc
      3 result_status 			= vc
	  3 resource_cd 			= f8
	  3 loinc 					= vc
      3 specimen_coll_date 		= dq8	 ;016
      3 result_note [*]
      	4 note_body 			= gvc
      	4 note_dt_tm 			= dq8
      	4 note_format 			= vc
      	4 note_provider_id 		= f8
      	4 note_provider_name 	= vc
    2 lab_loc[*]
      3 lab_id					= f8
      3 lab_name 				= vc
      3 address
      	4 address_id 			= f8
      	4 address_type_cd 		= f8
      	4 address_type_disp		= vc
      	4 address_type_mean 	= vc
      	4 street_addr 			= vc
      	4 street_addr2 			= vc
      	4 city 					= vc
      	4 state_cd 				= f8
      	4 state_disp 			= vc
      	4 state_mean 			= vc
      	4 zipcode 				= vc
    2 lab_prsnl [*]
      3 action_prsnl_date 		= dq8
      3 action_prsnl_name 		= vc
      3 action_prsnl_type 		= vc
      3 action_prsnl_status 	= vc
    2 parent_order_id			= f8
    2 is_nurse_reviewed			= i2
  1 audit			;013
		2 user_id							= f8
		2 user_firstname					= vc
		2 user_lastname						= vc
		2 patient_id						= f8
		2 patient_firstname					= vc
		2 patient_lastname					= vc
		2 service_version					= vc		;017
/*020 begin */
  1 status_data
    2 status = c1
    2 subeventstatus[1]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
      3 Code = c4
      3 Description = vc
/*020 end */
)
 
free record lab_component_req
record lab_component_req
(
	1 event_cds[*]
		2 event_cd					= f8
		2 source_identifier			= vc
)
 
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
declare dPersonID					= f8 with protect, noconstant(0.0)
declare dEncntrID					= f8 with protect, noconstant(0.0)
declare dOrderID					= f8 with protect, noconstant(0.0)
declare sOrderType					= vc with protect, noconstant("")
declare dDateType					= i4 with protect, noconstant(0)
declare dFromDate					= vc with protect, noconstant("")
declare dToDate						= vc with protect, noconstant("")
declare dIncResults					= i4 with protect, noconstant(0)
declare dIncAudit					= i4 with protect, noconstant(0)
declare dIncLabLoc					= i4 with protect, noconstant(0)
declare iMax_recs	 				= i4 with protect, noconstant(0)
declare qualCnt						= i4 with protect, noconstant(0)
declare dCatTypeCode 				= f8 with protect, constant(uar_get_code_by("MEANING",6000,"GENERAL LAB"))
declare dActivityTypeCode			= f8 with protect, constant(uar_get_code_by("MEANING",106,"GLB"))
declare dOrderActionCode			= f8 with protect, constant(uar_get_code_by("MEANING",6003,"ORDER"))
declare addressTypeCd				= f8 with protect, constant(uar_get_code_by("MEANING",212,"BUSINESS"))
declare locationCd					= f8 with protect, noconstant(0)
declare sUserName					= vc with protect, noconstant("")   ;013
declare iRet						= i2 with protect, noconstant(0) 	;013
 
;declare eventCd						= f8 with protect, constant(uar_get_code_by("DISPLAY",72,sOrderType))
declare crlf2                   	= vc with constant(concat(char(13),char(10)))
declare nocomp_cd               	= f8 with protect, constant(UAR_GET_CODE_BY( "MEANING", 120, "NOCOMP"))
declare comp_cd                 	= f8 with protect, constant(UAR_GET_CODE_BY( "MEANING", 120, "OCFCOMP"))
declare blob_in                 	= c69999 with noconstant(" ")
declare blob_out                	= c69999 with noconstant(" ")
declare blob_out2               	= c69999 with noconstant(" ")
declare blob_out3               	= c69999 with noconstant(" ")
declare blob_ret_len            	= i4 with noconstant(0)
declare loinc_src_cd				= f8 with protect, constant(UAR_GET_CODE_BY( "MEANING", 400, "LOINC"))
declare section_start_dt_tm 		= dq8 with protect, noconstant(cnvtdatetime(curdate, curtime3))
declare oCnt						= i4 with noconstant(0)
declare ordResCnt					= i4 with protect, noconstant(0)
declare idebugFlag					= i2 with protect, noconstant(0) ;019
declare UTCmode						= i2 with protect, noconstant(0);021
declare UTCpos 						= i2 with protect, noconstant(0);021
 
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
set file_name 					= $OUTDEV
set laborders_reply_out->status_data->status = "F"
 
set dPersonID					= cnvtint($PERSON_ID)
set dEncntrID					= cnvtint($ENCNTR_ID)
set dOrderID 					= cnvtint($ORDER_ID)
set sOrderType					= trim($ORDER_TYPE, 3)
set dDateType					= cnvtint($DATE_TYPE)
if(dDateType = 0) 			;024
	set dDateType = 1
endif
set dFromDate					= trim($FROM_DATE, 3)
set dToDate						= trim($TO_DATE, 3)
set dIncResults					= cnvtint($INC_RESULTS)
set dIncAudit					= cnvtint($INC_AUDIT)
set dIncLabLoc					= cnvtint($INC_LAB_LOC)
set iMax_recs	 				= cnvtint($MAX_RECORDS)
set sUserName					= trim($USERNAME, 3)   ;013
set idebugFlag					= cnvtint($DEBUG_FLAG)  ;019
set UTCmode						= CURUTC ;021
set UTCpos						= findstring("Z",dFromDate,1,0);021
 
 
if(dFromDate = "")
	set dFromDate = "01-JAN-1900"
endif
 
if(dToDate = "")
	set dToDate = "31-DEC-2100"
endif
 
/*021 UTC begin */
 if (UTCmode = 1 and UTCpos > 0)
	set startDtTm = cnvtdatetimeUTC(dFromDate) ;;;
	if (dToDate = "")
	;set endDtTm2 = cnvtdatetime(cnvtdatetime(curdate,curtime3))
		set endDtTm = cnvtdatetimeUTC(cnvtdatetimeUTC(curdate,curtime3-60))
	else
		set endDtTm = cnvtdatetimeUTC(dToDate)
	endif
else
	set startDtTm = cnvtdatetime(dFromDate)
	if (dToDate = "")
	;set endDtTm2 = cnvtdatetime(cnvtdatetime(curdate,curtime3))
		set endDtTm = cnvtdatetime(cnvtdatetime(curdate,curtime3-60))
	else
		set endDtTm = cnvtdatetime(dToDate)
	endif
endif
/*021 UTC end */
 
if(idebugFlag > 0)
 
	call echo(build("dPersonID: ", dPersonID))
	call echo(build("dEncntrID: ", dEncntrID))
	call echo(build("dOrderID: ", dOrderID))
	call echo(build("dDateType: ", dDateType))
	call echo(build("sOrderType: ", sOrderType))
	call echo(build("dFromDate: ", dFromDate))
	call echo(build("dToDate: ", dToDate))
	call echo(build("dIncResults: ", dIncResults))
	call echo(build("dIncAudit: ", dIncAudit))
	call echo(build("dIncLabLoc: ", dIncLabLoc))
	call echo(build("iMax_recs: ", iMax_recs))
	call echo(build("sUserName  ->", sUserName))
	call echo(build("UTC MODE -->",UTCmode));021
 	call echo(build("UTC POS -->",UTCpos));021
 
 
endif
 
/****************************************************************************
;INCLUDES
****************************************************************************/
;020 %i ccluserdir:snsro_common.inc
execute snsro_common
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetLabOrders(null)			= null with protect
declare GetOrderResults(null)		= null with protect
declare GetOrderActionPrsnl(null)	= null with protect
declare GetorderLabLocation(null)	= null with protect
declare GetCodingSystem(null) 		= null with protect
declare GetLabOrderByID(null)		= null with protect				;009
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
if(dOrderID > 0)
 
	set iRet = 	PopulateAudit(sUserName, dPersonID, laborders_reply_out, sVersion)     ;013  017
 
	if(iRet = 0)  ;004
		call ErrorHandler2("VALIDATE", "F", "LAB ORDERS", "Invalid User for Audit.",
		"1001", build("UserId is invalid: ", sUserName), laborders_reply_out)
		go to EXIT_SCRIPT
 
	endif
 
	call GetLabOrderByID(null)				;009
 
else
 
	set iRet = PopulateAudit(sUserName, dPersonID, laborders_reply_out, sVersion)    ;017
 
	if(iRet = 0)  ;004
		call ErrorHandler2("VALIDATE", "F", "LAB ORDERS", "Invalid User for Audit.",
		"1001", build("UserId is invalid: ", sUserName), laborders_reply_out)
		go to EXIT_SCRIPT
 
	endif
 
	call GetLabOrders(null)
 
endif
 
if(idebugFlag > 0)
 
	call echo(build("oCnt: ", oCnt))
	call echo(build("Inc Results: ", dIncResults))
	call echo(build("Inc Audit: ", dIncAudit))
 
endif
 
if(oCnt > 0)
 
	if (dIncResults > 0)
		call GetOrderResults(null)
	endif
 
	if (dIncAudit > 0)
		call GetOrderActionPrsnl(null)
	endif
 
	if (dIncLabLoc > 0)
		call GetOrderLabLocation(null)
	endif
 
	call GetCodingSystem(null)
 
	call PostAmble(null)
 
endif
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
 
if(idebugFlag > 0)
 
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_lab_orders.json")
	call echo(build2("_file : ", _file))
	call echojson(laborders_reply_out, _file, 0)
/******  Log reply to JSON file - END - *******/
	call echorecord(laborders_reply_out)
 
endif
 
	set JSONout = CNVTRECTOJSON(laborders_reply_out)
 
    if(validate(_MEMORY_REPLY_STRING))
		set _MEMORY_REPLY_STRING = trim(JSONout,3)
	endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: GetLabOrders(null)
;  Description: This will retrieve all lab orders for a patient given a
;  specified date range.
**************************************************************************/
subroutine GetLabOrders(null)
 
	if(idebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetLabOrders Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
		set laborders_reply_out->PERSON_ID              = dPersonID
		set laborders_reply_out->ENCNTR_ID				= dEncntrID
 
	if(idebugFlag > 0)
		call echo(build("dPersonID : ", dPersonID))
		call echo(build("dEncntrID : ", dEncntrID))
		call echo(build("sOrderType : ", sOrderType))
		call echo(build("dDateType : ", dDateType))
		call echo(build("dFromtDate : ", dFromDate))
		call echo(build("dToDate : ", dToDate))
	endif
 
	/*****************************************
	;  VALIDATION of prompt field parameters
	*****************************************/
	if (dPersonID = 0)
		call echo("Person ID is zero, null or empty")
		call ErrorHandler2("EXECUTE", "F", "LAB ORDERS", "Person ID not set - vigilanz_get_lab_orders",
		"2055", "Missing required field: PatientId", laborders_reply_out)
		go to EXIT_SCRIPT
	endif
	/*
	if (sOrderType != "ALL LABS")
 		set eventCd = uar_get_code_by("ALL LABS",72,sOrderType)
 		call echo(build("eventCd2: ", eventCd))
 	endif
	*/
 
	;------Start 022 changes---------
 
	/*
	call parser ("select into 'nl:'")
	call parser ("from orders o,order_action oa, prsnl p")
 
	if(dDateType = 2)
		call parser (" ,order_detail od")
	endif
 
	call parser ("plan o where o.person_id = dPersonID")
 
	if(dEncntrID > 0)
		call parser("and o.encntr_id = dEncntrID")
	endif
 
	call parser(" and o.catalog_type_cd = dCatTypeCode")
 
	if(dDateType = 1)
		call parser("and o.orig_order_dt_tm between cnvtdatetime(startDtTm) and cnvtdatetime(endDtTm)")	;021
	endif
 
 	call parser(" join oa where oa.order_id = o.order_id and oa.action_type_cd = dOrderActionCode")
 	call parser(" join p where p.person_id = oa.order_provider_id")								;010
 
	if(dDateType = 2)
 
	 	call parser("join od where od.order_id = o.order_id and (od.oe_field_meaning = 'REQSTARTDTTM' ")
	 	call parser("or od.oe_field_meaning = 'SPECIMEN TYPE') and od.oe_field_dt_tm_value between ")
		call parser("cnvtdatetime(startDtTm) and cnvtdatetime(endDtTm)") ;021
 
	endif
 
	call parser("head report ")
	call parser("oCnt = 0") ; pCnt = 0 odCnt = 0 od2Cnt = 0 rCnt = 0")
 
  	call parser("head o.order_id")
 	call parser(" oCnt = oCnt + 1")
		call parser(" stat = alterlist(laborders_reply_out->lab_orders, ocnt)")
		call parser("laborders_reply_out->lab_orders[ocnt]->order_id = o.order_id")
		call parser("laborders_reply_out->lab_orders[ocnt]->ordered_date = o.orig_order_dt_tm")
		call parser("laborders_reply_out->lab_orders[ocnt]->order_status = uar_get_code_display(o.order_status_cd)")
		call parser("laborders_reply_out->lab_orders[ocnt]->order_desc = o.ordered_as_mnemonic") ;
		call parser("laborders_reply_out->lab_orders[ocnt]->encntr_id = o.encntr_id")		;014
 
  	;call parser("head p.person_id")
		;call parser("pCnt = pCnt + 1")
 		call parser("laborders_reply_out->lab_orders[oCnt]->ORDERED_BY = trim(p.name_full_formatted)")
 
	if(dDateType = 2)
 	  	;call parser("head od.oe_field_id")
 		;call parser("odCnt = odCnt + 1")
 
 	;	call parser("if (od.oe_field_meaning = 'REQSTARTDTTM')")			016
 	;		call parser("laborders_reply_out->lab_orders[oCnt]->COLLECTED_DATE = od.oe_field_dt_tm_value endif")		016
 
  		call parser("if (od.oe_field_meaning = 'SPECIMEN TYPE')")
 			call parser("laborders_reply_out->lab_orders[oCnt]->SPECIMEN_TYPE = od.oe_field_display_value endif")
 
	endif
 
    call parser("with nocounter go")
 	*/
 
    select
    	if(dDateType = 1 and dEncntrID = 0)
    		from orders o
    		, order_action oa
    		, prsnl p
			, order_detail od ;024
 
    		plan o where o.person_id = dPersonId
    				and o.catalog_type_cd = dCatTypeCode
    				and o.orig_order_dt_tm between cnvtdatetime(startDtTm) and cnvtdatetime(endDtTm)
 
    		join oa where oa.order_id = o.order_id and oa.action_type_cd = dOrderActionCode
    		join p where p.person_id = oa.order_provider_id
			join od where od.order_id = o.order_id
 
    	elseif(dDateType = 1 and dEncntrID > 0)
    		from orders o
    		, order_action oa
    		, prsnl p
			, order_detail od   ;024
 
    		plan o where o.person_id = dPersonId
    				and o.encntr_id = dEncntrID
    				and o.catalog_type_cd = dCatTypeCode
    				and o.orig_order_dt_tm between cnvtdatetime(startDtTm) and cnvtdatetime(endDtTm)
 
    		join oa where oa.order_id = o.order_id and oa.action_type_cd = dOrderActionCode
    		join p where p.person_id = oa.order_provider_id
			join od where od.order_id = o.order_id
 
    	elseif(dDateType = 2 and dEncntrID = 0)
    		from orders o
    		, order_action oa
    		, prsnl p
    		,order_detail od
 
    		plan o where o.person_id = dPersonId
    				and o.catalog_type_cd = dCatTypeCode
 
    		join oa where oa.order_id = o.order_id and oa.action_type_cd = dOrderActionCode
    		join p where p.person_id = oa.order_provider_id
    		join od where od.order_id = o.order_id
    			and od.action_sequence = oa.action_sequence
    			and od.oe_field_meaning in( "REQSTARTDTTM","SPECIMEN TYPE")
    			and od.oe_field_dt_tm_value between
    			cnvtdatetime(startDtTm) and cnvtdatetime(endDtTm)
 
    	elseif(dDateType = 2 and dEncntrID > 0)
    		from orders o
    		, order_action oa
    		, prsnl p
    		,order_detail od
 
    		plan o where o.person_id = dPersonId
    				and o.catalog_type_cd = dCatTypeCode
    				and o.encntr_id = dEncntrID
    		join oa where oa.order_id = o.order_id
    		and od.action_sequence = oa.action_sequence
    		and oa.action_type_cd = dOrderActionCode
    		join p where p.person_id = oa.order_provider_id
    		join od where od.order_id = o.order_id
    			and od.oe_field_meaning in ("REQSTARTDTTM","SPECIMEN TYPE")
    			and od.oe_field_dt_tm_value between
    			cnvtdatetime(startDtTm) and cnvtdatetime(endDtTm)
    	endif
 
 	into "nl:"
 
 	head report
 		oCnt = 0
 	head o.order_id
 		oCnt = oCnt + 1
 		stat = alterlist(laborders_reply_out->lab_orders, ocnt)
 
 		laborders_reply_out->lab_orders[ocnt]->order_id = o.order_id
 		laborders_reply_out->lab_orders[ocnt]->ordered_date = o.orig_order_dt_tm
 		laborders_reply_out->lab_orders[ocnt]->order_status = uar_get_code_display(o.order_status_cd)
 		laborders_reply_out->lab_orders[ocnt]->order_desc = o.ordered_as_mnemonic
		laborders_reply_out->lab_orders[ocnt]->encntr_id = o.encntr_id
		laborders_reply_out->lab_orders[oCnt]->ORDERED_BY = trim(p.name_full_formatted)
		laborders_reply_out->lab_orders[oCnt].parent_order_id = o.template_order_id
		if(o.need_nurse_review_ind = 0)
			laborders_reply_out->lab_orders[oCnt].is_nurse_reviewed = 1
		endif
 
		if(dDateType = 2)
  			if(od.oe_field_meaning = 'SPECIMEN TYPE')
 				laborders_reply_out->lab_orders[oCnt]->SPECIMEN_TYPE = od.oe_field_display_value
 			endif
 		endif
 
	with nocounter
 
 	;------End 022 changes---------
 
	if(idebugFlag > 0)
		call echo(build("iMax_recs -->", iMax_recs))
		call echo(build("oCnt -->", oCnt))
	endif
 
	if(iMax_recs > 0)
		if(size(laborders_reply_out->lab_orders, 5) > iMax_recs )
			set stat = alterlist(laborders_reply_out->lab_orders, iMax_recs)
			set laborders_reply_out->LAB_ORDERS_QUAL = iMax_recs
		endif
    else
		set stat = alterlist(laborders_reply_out->lab_orders, oCnt)
		set laborders_reply_out->LAB_ORDERS_QUAL = oCnt
	endif
 
	if (oCnt = 0)
		;call echo("No lab orders found...")
		call ErrorHandler("EXECUTE", "Z", "LAB ORDERS", "No records found - vigilanz_get_lab_orders", laborders_reply_out)
		go to EXIT_SCRIPT
	else
		;set laborders_reply_out->LAB_ORDERS_QUAL = oCnt
		;call echo("Labs found and processed...")
		call ErrorHandler("EXECUTE", "S", "LAB ORDERS",
			"Lab orders successfully processed - vigilanz_get_lab_orders", laborders_reply_out)
	endif
 
	if(idebugFlag > 0)
		call echo(concat("GetLabOrders Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/***************************************************************************
;  Name: GetOrderResults (null)
;  Description: Take a list of lab orders and retreive results and result
;  details.
**************************************************************************/
subroutine GetOrderResults(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetOrderResults Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
set ordResCnt = 0
set ordResCnt = size(laborders_reply_out->lab_orders, 5)  ;007
 
call echo(build("ordResCnt  -> ", ordResCnt))
 
	select into "nl:"
		 normal_low = ce.normal_low
		,normal_high = ce.normal_high
		,event_id = ce.event_id
		,event_note_id = cen.event_note_id
	from (dummyt d1 with seq = value(ordResCnt))		;007
	,clinical_event ce
	,ce_event_note cen
	,long_blob lb
	,prsnl p
 
	plan d1
 
	join ce where ce.order_id = laborders_reply_out->LAB_ORDERS[d1.seq]->ORDER_ID
 
		and ce.view_level = 1
 
/*001*/join cen where cen.event_id = outerjoin (ce.event_id)
 
/*001*/join lb where lb.parent_entity_id = outerjoin (cen.ce_event_note_id) and lb.parent_entity_name = outerjoin("CE_EVENT_NOTE")
 
/*001*/join p where p.person_id = outerjoin (cen.note_prsnl_id) and p.active_ind = outerjoin(1)
 
	order by ce.event_start_dt_tm desc
 
	head report
		/*initialize result and event_note counts*/
		rCnt = 0
		cenCnt = 0
 
 	head d1.seq
 		rCnt = 0  	/*reset result count to zero for each order*/
 
 	head ce.event_id
 		cenCnt = 0	/*reset event_note count to zero for each result*/
 		rCnt = rCnt + 1
 		stat = alterlist(laborders_reply_out->LAB_ORDERS[d1.seq]->LAB_RESULT, rCnt)
 
		if(idebugFlag > 0)
 
			call echo(build("rCnt ", rCnt))
			call echo(build("ce event ", ce.event_id))
 
		endif
 
 		laborders_reply_out->LAB_ORDERS[d1.seq]->ACCESSION_NBR = ce.accession_nbr
 
 		laborders_reply_out->LAB_ORDERS[d1.seq]->LAB_RESULT[rCnt]->RESULT_ID = ce.event_id
 		laborders_reply_out->LAB_ORDERS[d1.seq]->LAB_RESULT[rCnt]->RESULT_VALUE = ce.event_tag
 		laborders_reply_out->LAB_ORDERS[d1.seq]->LAB_RESULT[rCnt]->RESULT_DATE = ce.performed_dt_tm
 		laborders_reply_out->LAB_ORDERS[d1.seq]->LAB_RESULT[rCnt]->RESULT_STATUS = UAR_GET_CODE_DISPLAY(ce.result_status_cd)
 		laborders_reply_out->LAB_ORDERS[d1.seq]->LAB_RESULT[rCnt]->UNITS_OF_MEASURE = UAR_GET_CODE_DISPLAY(ce.result_units_cd)
 		laborders_reply_out->LAB_ORDERS[d1.seq]->LAB_RESULT[rCnt]->clinsig_updt_dt_tm = ce.clinsig_updt_dt_tm   ;011
 		laborders_reply_out->LAB_ORDERS[d1.seq]->LAB_RESULT[rCnt]->NORMALCY = uar_get_code_meaning(ce.normalcy_cd)  ;012
 		laborders_reply_out->LAB_ORDERS[d1.seq]->LAB_RESULT[rCnt]->COMPONENT_ID = ce.event_cd
 		laborders_reply_out->LAB_ORDERS[d1.seq]->LAB_RESULT[rCnt]->COMPONENT_DESC = UAR_GET_CODE_DISPLAY(ce.event_cd)
 		;laborders_reply_out->LAB_ORDERS[d1.seq]->AUTHORIZED_BY = ""
 		laborders_reply_out->LAB_ORDERS[d1.seq]->LAB_RESULT[rCnt]->RESOURCE_CD = ce.resource_cd
 		laborders_reply_out->LAB_ORDERS[d1.seq]->LAB_RESULT[rCnt]->NORMAL_LOW = ce.normal_low
 		laborders_reply_out->LAB_ORDERS[d1.seq]->LAB_RESULT[rCnt]->NORMAL_HIGH = ce.normal_high
 		laborders_reply_out->LAB_ORDERS[d1.seq]->LAB_RESULT[rCnt]->specimen_coll_date = ce.event_start_dt_tm  ;016
 
		/*002 BEGIN ***
		if (normal_low > " " and normal_high > " ")
	 		laborders_reply_out->LAB_ORDERS[d1.seq]->LAB_RESULT[rCnt]->REF_RANGE = build2((trim(cnvtstring(ce.normal_low)))," - "
 				,(trim(cnvtstring(ce.normal_high))))
 		elseif (normal_low > " " and normal_high = "")
 			laborders_reply_out->LAB_ORDERS[d1.seq]->LAB_RESULT[rCnt]->REF_RANGE = trim(normal_low)
 		elseif (normal_low = "" and normal_high > " ")
 			laborders_reply_out->LAB_ORDERS[d1.seq]->LAB_RESULT[rCnt]->REF_RANGE = trim(normal_high)
 		else
 			laborders_reply_out->LAB_ORDERS[d1.seq]->LAB_RESULT[rCnt]->REF_RANGE = ""
		endif
		002 END *****/
 
	;head cen.event_note_id
	detail
 
		if( cen.event_note_id > 0)
			cenCnt = cenCnt + 1
			stat = alterlist(laborders_reply_out->LAB_ORDERS[d1.seq]->LAB_RESULT[rCnt]->RESULT_NOTE, cenCnt)
 
			if(idebugFlag > 0)
 
				call echo(build("rCnt ", rCnt))
				call echo(build("cenCnt ", cenCnt))
				call echo(build("ce event ", ce.event_id))
 
			endif
 
			laborders_reply_out->LAB_ORDERS[d1.seq]->LAB_RESULT[rCnt]->RESULT_NOTE[cenCnt]->NOTE_FORMAT =
																					uar_get_code_display(cen.note_format_cd)
			laborders_reply_out->LAB_ORDERS[d1.seq]->LAB_RESULT[rCnt]->RESULT_NOTE[cenCnt]->NOTE_DT_TM = cen.note_dt_tm
			laborders_reply_out->LAB_ORDERS[d1.seq]->LAB_RESULT[rCnt]->RESULT_NOTE[cenCnt]->NOTE_PROVIDER_ID = p.person_id
			laborders_reply_out->LAB_ORDERS[d1.seq]->LAB_RESULT[rCnt]->RESULT_NOTE[cenCnt]->NOTE_PROVIDER_NAME = p.name_full_formatted
			blob_out = ""
			blob_out2 = ""
			blob_out3 = ""
 
			if( cen.compression_cd = COMP_CD )
				blob_in = lb.long_blob
				call uar_ocf_uncompress( blob_in, 69999, blob_out, 69999, blob_ret_len )
				;call uar_rtf2( blob_out, blob_ret_len, blob_out2, 69999, blob_ret_len, 1 )
				;x1 = size( trim( blob_out2, 3 ))
				;blob_out3 = substring( 1, x1, blob_out2 )
				laborders_reply_out->LAB_ORDERS[d1.seq]->LAB_RESULT[rCnt]->RESULT_NOTE[cenCnt]->NOTE_BODY = blob_out
			else
				blob_in = replace(lb.long_blob, "ocf_blob", "",2)
				call uar_rtf2( blob_in, size(blob_in), blob_out, 69999, blob_ret_len, 1 )
				laborders_reply_out->LAB_ORDERS[d1.seq]->LAB_RESULT[rCnt]->RESULT_NOTE[cenCnt]->NOTE_BODY = blob_out
			endif
 
		endif
 
 
 	with nocounter
 
if(idebugFlag > 0)
 
	call echo(concat("GetOrderResults Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
 
end
 
/***************************************************************************
;  Name: GetOrderActionPrsnl (null)
;  Description: Take a list of lab orders and retrieve the action prsnl list
**************************************************************************/
subroutine GetOrderActionPrsnl(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetOrderActionPrsnl Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
set ordResCnt = 0
set ordResCnt = size(laborders_reply_out->lab_orders, 5)   ;007
 
	select into "nl:"
		oa.order_action_id
 
	from (dummyt d1 with seq = value(ordResCnt))           ;007
	,order_action oa
	,prsnl p
 
	plan d1
 
	join oa where oa.order_id = laborders_reply_out->LAB_ORDERS[d1.seq]->ORDER_ID
 
	join p where oa.action_personnel_id = OUTERJOIN (p.person_id)
 
	head report
		aCnt = 0
 
 	head d1.seq
 		aCnt = 0
 
 	head oa.order_action_id
 		aCnt = aCnt + 1
 		stat = alterlist(laborders_reply_out->LAB_ORDERS[d1.seq]->LAB_PRSNL, aCnt)
 
		if(idebugFlag > 0)
 
			call echo(build("aCnt ", aCnt))
			call echo(build("order action id ", oa.order_action_id))
 
		endif
 
 		laborders_reply_out->LAB_ORDERS[d1.seq]->LAB_PRSNL[aCnt]->ACTION_PRSNL_DATE = oa.action_dt_tm
 		laborders_reply_out->LAB_ORDERS[d1.seq]->LAB_PRSNL[aCnt]->ACTION_PRSNL_TYPE = UAR_GET_CODE_DISPLAY(oa.action_type_cd)
 		laborders_reply_out->LAB_ORDERS[d1.seq]->LAB_PRSNL[aCnt]->ACTION_PRSNL_STATUS = UAR_GET_CODE_DISPLAY(oa.order_status_cd)
 
  	head p.person_id
 
   		laborders_reply_out->LAB_ORDERS[d1.seq]->LAB_PRSNL[aCnt]->ACTION_PRSNL_NAME = p.name_full_formatted
 
   	with nocounter
 
 
if(idebugFlag > 0)
 
	call echo(concat("GetOrderActionPrsnl Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
 
end
 
/***************************************************************************
;  Name: GetOrderLabLocation (null)
;  Description: Take a list of lab orders and retrieve the lab location
**************************************************************************/
subroutine GetOrderLabLocation(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetOrderLabLocation Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
set resultCnt = 0
set locationCd = 0
set addressCnt = 0
 
set ordResCnt = 0
set ordResCnt = size(laborders_reply_out->lab_orders, 5)           ;007
declare lab_id = f8
 
;loop through orders and look up result location
for (x = 0 to ordResCnt)                                           ;007
 
	set resultCnt = size(laborders_reply_out->LAB_ORDERS[x]->LAB_RESULT, 5)
	set addressCnt = 0
 
 
	if (resultCnt > 0)
 
		select into "nl:"
 
		from service_resource sr
		where sr.service_resource_cd = laborders_reply_out->LAB_ORDERS[x]->LAB_RESULT[1]->RESOURCE_CD
 
		head report
			locationCd = sr.location_cd
		with nocounter
 
		if(idebugFlag > 0)
 
			call echo(build("location code: ",locationCd))
			call echo(build("address type: ", addressTypeCd))
 
		endif
 
		if (locationCd > 0)
 
 			; Get Address
			select into "nl:"
			from address a
			where a.parent_entity_name = "LOCATION"
				and a.parent_entity_id = locationCd
				and a.address_type_cd = addressTypeCd
				and a.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
				and a.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
				and a.active_ind = 1
				and a.address_id != 0
			head a.address_id
				addressCnt = addressCnt + 1
				stat = alterlist(laborders_reply_out->LAB_ORDERS[x]->LAB_LOC, addressCnt)
				laborders_reply_out->LAB_ORDERS[x]->LAB_LOC[addressCnt].lab_id = laborders_reply_out->LAB_ORDERS[x]->LAB_RESULT[1]->RESOURCE_CD
				laborders_reply_out->LAB_ORDERS[x]->LAB_LOC[addressCnt]->LAB_NAME = UAR_GET_CODE_DISPLAY (locationCd)
				laborders_reply_out->LAB_ORDERS[x]->LAB_LOC[addressCnt]->ADDRESS->ADDRESS_ID = a.address_id
				laborders_reply_out->LAB_ORDERS[x]->LAB_LOC[addressCnt]->ADDRESS->ADDRESS_TYPE_CD = a.address_type_cd
				laborders_reply_out->LAB_ORDERS[x]->LAB_LOC[addressCnt]->ADDRESS->ADDRESS_TYPE_DISP = UAR_GET_CODE_DISPLAY(a.address_type_cd)
				laborders_reply_out->LAB_ORDERS[x]->LAB_LOC[addressCnt]->ADDRESS->STREET_ADDR = a.street_addr
				laborders_reply_out->LAB_ORDERS[x]->LAB_LOC[addressCnt]->ADDRESS->STREET_ADDR2 = a.street_addr2
				laborders_reply_out->LAB_ORDERS[x]->LAB_LOC[addressCnt]->ADDRESS->CITY = a.city
				laborders_reply_out->LAB_ORDERS[x]->LAB_LOC[addressCnt]->ADDRESS->STATE_CD = a.state_cd
				laborders_reply_out->LAB_ORDERS[x]->LAB_LOC[addressCnt]->ADDRESS->STATE_DISP = UAR_GET_CODE_DISPLAY(a.state_cd)
				laborders_reply_out->LAB_ORDERS[x]->LAB_LOC[addressCnt]->ADDRESS->ZIPCODE = a.zipcode
			with nocounter
 
			; Get Phone
 
		endif
 
	endif
 
endfor
 
if(idebugFlag > 0)
 
	call echo(concat("GetOrderLabLocation Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
 
end
 
 
/*************************************************************************
;  Name: PostAmble(null)
;  Description: Perform any post-processing steps on allergies here
;
**************************************************************************/
 
subroutine PostAmble(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("PostAmble Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
	set qualCnt = size(laborders_reply_out->LAB_ORDERS,5)
	set laborders_reply_out->LAB_ORDERS_QUAL = qualCnt
 
	for (x = 1 to qualCnt) ;014
 		set laborders_reply_out->lab_orders[x].patient_id = dPersonId
		set laborders_reply_out->lab_orders[x]->encntr_type_cd =
			GetPatientClass(laborders_reply_out->lab_orders[x]->encntr_id,1)			  	 ;014
		set laborders_reply_out->lab_orders[x]->encntr_type_disp =
			uar_get_code_display(laborders_reply_out->lab_orders[x]->encntr_type_cd)  ;014
		set laborders_reply_out->lab_orders[x]->encntr_type_class_cd =
			GetPatientClass(laborders_reply_out->lab_orders[x]->encntr_id,2)		 ;015
		set laborders_reply_out->lab_orders[x]->encntr_type_class_disp =
			uar_get_code_display(laborders_reply_out->lab_orders[x]->encntr_type_class_cd)  ;015
 
		if(size(laborders_reply_out->LAB_ORDERS[x]->LAB_RESULT, 5) > 0)		;016
			set laborders_reply_out->lab_orders[x]->collected_date	=
				laborders_reply_out->LAB_ORDERS[x]->LAB_RESULT[1]->specimen_coll_date 	;016
		endif		;016
 
	endfor ;014
 
if(idebugFlag > 0)
 
	call echo(concat("PostAmble Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
 
/*************************************************************************
;  Name: GetCodingSystem(null)
;  Description: Subroutine to retrieve coding system and value
;
**************************************************************************/
subroutine GetCodingSystem(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetCodingSystem Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
declare ordCnt 			= i4 with  protect, noconstant(0)
set ordCnt 				= size(laborders_reply_out->lab_orders,5)
declare resCnt 			= i4 with  protect, noconstant(0)
 
for(x = 1 to ordCnt)
 
		if(size(laborders_reply_out->lab_orders[x]->lab_result,5) > 0)
 
			set resCnt = size(laborders_reply_out->lab_orders[x]->lab_result,5)
 
			  select into "nl:"
 
				  from
				  (dummyt d WITH seq = resCnt)
				    ,clinical_event ce
					, discrete_task_assay dta
					, nomenclature n
 
				  plan d
 
				  join ce
 
					where
						ce.event_id = laborders_reply_out->lab_orders[x]->lab_result[d.seq]->result_id
 
				  join dta
 
					where dta.task_assay_cd = outerjoin(ce.task_assay_cd)
 
				  join n
 
					where n.concept_cki = outerjoin(dta.concept_cki) and n.source_vocabulary_cd = loinc_src_cd
 
				  detail
 
					laborders_reply_out->lab_orders[x]->lab_result[d.seq]->loinc = n.source_identifier
 
				  with nocounter
 
 
		endif
 
 
		set resCnt = 0
 
endfor
 
if(idebugFlag > 0)
 
	call echo(concat("GetCodingSystem Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
/*************************************************************************
;  Name: GetLabOrderByID(null)				;009
;  Description: This will retrieve lab orders for a patient by Order ID
;
**************************************************************************/
subroutine GetLabOrderByID(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetLabOrderByID Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
	set laborders_reply_out->PERSON_ID              = dPersonID
	set laborders_reply_out->ENCNTR_ID				= dEncntrID
 
	if(idebugFlag > 0)
 
		call echo(build("dPersonID : ", dPersonID))
		call echo(build("dEncntrID : ", dEncntrID))
		call echo(build("sOrderType : ", sOrderType))
		call echo(build("dDateType : ", dDateType))
		call echo(build("dFromtDate : ", dFromDate))
		call echo(build("dToDate : ", dToDate))
 
	endif
 
	/*****************************************
	;  VALIDATION of prompt field parameters
	*****************************************/
	if (dPersonID = 0)
		call echo("Person ID is zero, null or empty")
		call ErrorHandler2("EXECUTE", "F", "LAB ORDERS", "Person ID is a required field",
		"2055", "Missing required field: PatientId", laborders_reply_out)
		go to EXIT_SCRIPT
	endif
 
 
	select into 'nl:'
 
		from orders o,order_action oa, prsnl p, order_detail od
 
	plan o
 
		where o.order_id = dOrderID and o.person_id = dPersonID
 
	join oa where oa.order_id = o.order_id and oa.action_type_cd = dOrderActionCode
	join od where od.order_id = outerjoin(o.order_id)
	join p where p.person_id = oa.order_provider_id				;010
 
	head report
	oCnt = 0
 
	head o.order_id
		oCnt = oCnt + 1
		stat = alterlist(laborders_reply_out->lab_orders, ocnt)
		laborders_reply_out->lab_orders[ocnt]->order_id = o.order_id
		laborders_reply_out->lab_orders[ocnt]->ordered_date = o.orig_order_dt_tm
		laborders_reply_out->lab_orders[ocnt]->order_status = uar_get_code_display(o.order_status_cd)
		laborders_reply_out->lab_orders[ocnt]->order_desc = o.order_mnemonic
		laborders_reply_out->lab_orders[ocnt]->encntr_id = o.encntr_id   ;014
		laborders_reply_out->lab_orders[oCnt]->ORDERED_BY = trim(p.name_full_formatted)
 		laborders_reply_out->lab_orders[oCnt].parent_order_id = o.template_order_id
	detail
 
		if (od.oe_field_meaning = 'REQSTARTDTTM')
				laborders_reply_out->lab_orders[oCnt]->COLLECTED_DATE = od.oe_field_dt_tm_value
		endif
 
		if (od.oe_field_meaning = 'SPECIMEN TYPE')
				laborders_reply_out->lab_orders[oCnt]->SPECIMEN_TYPE = od.oe_field_display_value
		endif
 
	with nocounter
 
	if(idebugFlag > 0)
 
		call echo(build("iMax_recs -->", iMax_recs))
		call echo(build("oCnt -->", oCnt))
 
	endif
 
	if(iMax_recs > 0)
 
		if(size(laborders_reply_out->lab_orders, 5) > iMax_recs )
 
			set stat = alterlist(laborders_reply_out->lab_orders, iMax_recs)
			set laborders_reply_out->LAB_ORDERS_QUAL = iMax_recs
 
		endif
 
    else
 
		set stat = alterlist(laborders_reply_out->lab_orders, oCnt)
		set laborders_reply_out->LAB_ORDERS_QUAL = oCnt
 
	endif
 
	if (curqual = 0)
		;call echo("No lab orders found...")
		call ErrorHandler("EXECUTE", "Z", "LAB ORDERS", "No records found - vigilanz_get_lab_orders", laborders_reply_out)
		go to EXIT_SCRIPT
	else
		;set laborders_reply_out->LAB_ORDERS_QUAL = oCnt
		;call echo("Labs found and processed...")
		call ErrorHandler("EXECUTE", "S", "LAB ORDERS",
			"Lab orders successfully processed - vigilanz_get_lab_orders", laborders_reply_out)
	endif
 
if(idebugFlag > 0)
 
	call echo(concat("GetLabOrderByID Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
 
end go
