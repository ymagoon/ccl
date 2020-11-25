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
          Date Written:       05/28/15
          Source file name:   vigilanz_get_documents
          Object name:        vigilanz_get_documents
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
  016 11/18/19   STV            switch document_dt_tm = valid_from_dt_tm
  017 04/27/20   KRD            Changed the code from tdbexecute to query
                                database.  Added cat_list and comp_list includes
 ***********************************************************************/
drop program vigilanz_get_documents go
create program vigilanz_get_documents
 
/************************************************************************
; REQUEST
************************************************************************/
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Person Id:" = 0.0
	, "Encounter Id :" = 0.0
	, "From Date:" = "01-JAN-1900"
	, "To Date:" = ""
	, "User Name:" = ""
	, "Event_set" = 0.0
	, "Categories" = 0
	, "Components" = 0
	, "Debug Flag" = 0
 
with OUTDEV, PERSON_ID, ENCNTR_ID, FROM_DATE, TO_DATE, USERNAME, EVENT_SET_CD,
	CAT_LIST, COMP_LIST, DEBUG_FLAG
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2" ;015
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record category_req
record category_req (
	1 qual_cnt 							= i4
	1 qual[*]
		2 event_set_cd					= f8
)
 
free record components_req
record components_req (
	1 qual_cnt 							= i4
	1 qual[*]
		2 event_cd						= f8
)
 
 
free record documents_reply_out
record documents_reply_out
(
	1 document_count 					= i4
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
declare dPersonID  					= f8 with protect, noconstant(0.0)
declare dEncntrID           		= f8 with protect, noconstant(0.0)
declare clin_doc_event_set_cd 		= f8 with protect, noconstant(uar_get_code_by("DISPLAY_KEY", 93, "CLINICALDOC"))
declare rad_doc_event_set_cd 		= f8 with protect, noconstant(uar_get_code_by("DISPLAY_KEY", 93, "RADIOLOGYRESULTS")) ;011
declare sFromDate					= vc with protect, noconstant("")
declare sToDate						= vc with protect, noconstant("")
declare sUserName					= vc with protect, noconstant("")   ;005
declare iRet						= i2 with protect, noconstant(0) 	;005
declare APPLICATION_NUMBER 			= i4 with protect, constant (600005)
declare TASK_NUMBER 				= i4 with protect, constant (600107)
declare REQ_NUM_EVENT 				= i4 with protect, constant (1000001)
declare event_set_cd 				= f8 with protect, noconstant(0.0) 		;007
declare sCategories 				= vc with protect, noconstant("")	;011
declare sComponents					= vc with protect, noconstant("")
declare total_size					= i4 with protect, noconstant(0)
declare Section_Start_Dt_Tm 		= DQ8 WITH PROTECT, NOCONSTANT(CNVTDATETIME(CURDATE, CURTIME3))
declare idebugFlag					= i2 with protect, noconstant(0) ;012
declare timeOutThreshold 			= i4 with protect, noconstant(115);setting to 115 seconds
declare queryStartTm 				= dq8
declare ndx                     		= i4
 
declare c_doc_event_class_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",53,"DOC"))
declare c_mdoc_event_class_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",53,"MDOC"))
declare c_document_event_class_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",53,"DOCUMENT"))
declare c_rad_event_class_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",53,"RAD"))
 
declare c_active_record_status_cd	= f8 with protect, constant(uar_get_code_by("MEANING",48,"ACTIVE")) ;021
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
set sUserName		= trim($USERNAME, 3)   ;005
set dPersonID   	= cnvtint($PERSON_ID)
set dEncntrID    	= cnvtint($ENCNTR_ID)
set sFromDate		= trim($FROM_DATE,3)
set sToDate			= trim($TO_DATE,3)
set event_set_cd    = cnvtint($EVENT_SET_CD)	;007
set sCategories  	= trim($CAT_LIST, 3)
set sComponents     = trim($COMP_LIST,3)
 
 
; Set dates
if(sFromDate = "")
	set sFromDate = "01-Jan-1900 00:00:00"
endif
if(sToDate = "")
	set sToDate = "31-Dec-2100 23:59:59"
endif
 
set qFromDateTime = GetDateTime(sFromDate)
set qToDateTime = GetDateTime(sToDate)
 
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
 	call echo(build("sCategories -> ",sCategories))
	call echo(build("sComponents -> ",sComponents))
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ParseCategories(null)					= null with protect
declare CreateComponentsList(cFlag = i4)		= null with protect
declare ParseComponents(null)  					= null with protect
declare GetFormat(dDocumentID = f8)			= vc with protect
declare GetAllDocuments(null)					= null with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Validate person id exists
if(dPersonID = 0)
	call ErrorHandler2("VALIDATE", "F", "ENCOUNTERS", "No Person ID was passed in",
 	"2055", "Missing required field: PatientId", documents_reply_out)	;022
	go to EXIT_SCRIPT
endif
 
; Populate audit
set iRet = PopulateAudit(sUserName, dPersonID, documents_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "ENCOUNTERS", "Invalid User for Audit.",
	"1001", build("UserId is invalid: ",sUserName), documents_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate date parameters
if(qFromDateTime > qToDateTime)
	call ErrorHandler2("VALIDATE", "F", "ENCOUNTERS", "Invalid dates: FromDate is greater than ToDate.",
	"9999", "Invalid dates: FromDate is greater than ToDate.", documents_reply_out)
	go to EXIT_SCRIPT
endif
 
; Parse categories if provided
if(sCategories > " ")
	call ParseCategories(null)
	call CreateComponentsList(1)
elseif(sComponents = "")
	call CreateComponentsList(0)
endif
 
 
; Parse Components if provided
if(sComponents > " ")
	call ParseComponents(null)
endif
 
;call echorecord(category_req)
;call echorecord(components_req)
; Get Document List
call GetAllDocuments(null)
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************
* Convert REC output to JSON
**************************************************************/
set JSONout = CNVTRECTOJSON(documents_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
	call echorecord(documents_reply_out)
	call echo(JSONout)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_documents.json")
	call echo(build2("_file : ", _file))
	call echojson(documents_reply_out, _file, 0)
endif
 
#EXIT_VERSION
 
/*************************************************************************
;  Name: ParseCategories(null)
;  Description: Subroutine to parse a comma delimited string
**************************************************************************/
subroutine ParseCategories(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ParseCategories Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare notfnd 		= vc with constant("<not_found>")
	declare num 		= i4 with noconstant(1)
	declare str 		= vc with noconstant("")
 
	while (str != notfnd)
     	set str =  piece(sCategories,',',num,notfnd)
     	if(str != notfnd)
 
      		; Validate event set
      		set iRet = GetCodeSet(cnvtreal(str))
      		if(iRet != 93)
      			call ErrorHandler2("VALIDATE", "F", "POP_DOCUMENTS",
				build("Invalid Event Set Code: ",category_req->qual[num]->event_set_cd),
				"2026",build("Invalid Event Set Code: ",category_req->qual[num]->event_set_cd), documents_reply_out)	;012
				go to exit_script
			else
      			set stat = alterlist(category_req->qual, num)
      			set category_req->qual[num]->event_set_cd = cnvtreal(str)
      			set category_req->qual_cnt = num
      		endif
       	endif
      	set num = num + 1
	endwhile
end ;end sub
 
/*************************************************************************
;  Name: CreateComponentsList(null)
;  Description: Subroutine to add event codes to complist structure
**************************************************************************/
subroutine CreateComponentsList(cFlag)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("CreateComponentsList Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 
	if(cFlag = 0) ;add clindoc event_set_cd to - category list
	 set category_req->qual_cnt = category_req->qual_cnt + 1
     set stat = alterlist(category_req->qual, category_req->qual_cnt)
     set category_req->qual[category_req->qual_cnt]->event_set_cd = clin_doc_event_set_cd
	endif
 
	;add rad event_set_cd to - category list
	set category_req->qual_cnt = category_req->qual_cnt + 1
    set stat = alterlist(category_req->qual, category_req->qual_cnt)
    set category_req->qual[category_req->qual_cnt]->event_set_cd = rad_doc_event_set_cd
 
 
	if(category_req->qual_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	set tnum = 1
	select into "nl:"
    from v500_event_set_explode ves
    where expand(tnum,1, category_req->qual_cnt,ves.event_set_cd,category_req->qual[tnum]->event_set_cd)
    and ves.event_cd != 0.0
    order by ves.event_cd
	head report
		x = 0
		stat = alterlist(components_req->qual,2000)
	head ves.event_cd
		x = x + 1
		if(mod(x,100) = 1 and x > 2000)
			stat = alterlist(components_req->qual,x + 99)
		endif
 
		components_req->qual[x].event_cd = ves.event_cd
	foot report
		stat = alterlist(components_req->qual,x)
		components_req->qual_cnt = x
	with nocounter, expand = value(exp)
 
	if(iDebugFlag > 0)
		call echo(concat("CreateComponentsList Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: ParseComponents(null)
;  Description: Subroutine to parse a comma delimited string
**************************************************************************/
subroutine ParseComponents(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ParseComponents Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare notfnd 		= vc with constant("<not_found>")
	declare num 		= i4 with noconstant(1)
	declare str 		= vc with noconstant("")
 
	while (str != notfnd)
     	set str =  piece(sComponents,',',num,notfnd)
     	if(str != notfnd)
     		set components_req->qual_cnt = components_req->qual_cnt + num
      		set stat = alterlist(components_req->qual,value(components_req->qual_cnt))
     		set components_req->qual[components_req->qual_cnt].event_cd = cnvtreal(str)
 
     		set iRet = GetCodeSet(components_req->qual[components_req->qual_cnt].event_cd)
			if(iRet != 72)
     			call ErrorHandler2("VALIDATE", "F", "POP_DOCUMENTS",build("Invalid Event Code: ",trim(str,3)),
     			"2018",build("Invalid Event Code: ",trim(str,3), documents_reply_out))
				go to exit_script
			endif    ;003
        endif
      	set num = num + 1
 	endwhile
 
	if(iDebugFlag > 0)
		call echo(concat("ParseComponents Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;End Sub
 
 
/*************************************************************************
;  Name: GetAllDocuments(null)
;  Description: Retrieve all Documents for patient
**************************************************************************/
subroutine GetAllDocuments( null )
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetAllDocuments Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	declare where_event_clause 		= vc with protect, noconstant("")
 	declare where_encounter_clause	= vc with protect, noconstant("")
 
 	; Event Code filter
  	if(components_req->qual_cnt > 0)
 		set where_event_clause =
 		" expand(ndx,1,components_req->qual_cnt,ce.event_cd,components_req->qual[ndx].event_cd)"   ;008
 	else
 		set where_event_clause = "ce.event_cd > 0"
 	endif
 
  	if (dEncntrID > 0)
 		set where_encounter_clause = build(" ce.encntr_id = ", dEncntrID)
 	else
 		set where_encounter_clause = "ce.encntr_id > 0 "
 	endif
 
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	if(components_req->qual_cnt > 200 )
		set exp = 1
	else
		set exp = 0
	endif
 
	select	into "nl:"
		ce.event_id
	from clinical_event ce
		,clinical_event ce2
		,encounter e
		,prsnl pr
	plan ce where ce.person_id = dPersonID
	and parser(where_encounter_clause)
	and ce.valid_from_dt_tm between cnvtdatetime(qFromDateTime)
	                  and cnvtdatetime(qToDateTime)
	and ce.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
	and ce.view_level = 1
	and ce.event_class_cd in (c_mdoc_event_class_cd,c_doc_event_class_cd,c_document_event_class_cd
	                          ,c_rad_event_class_cd)
	and parser(where_event_clause)
	join ce2 where ce2.event_id = ce.parent_event_id
	and ce2.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
	and ce2.record_status_cd = c_active_record_status_cd
	join e
	where e.encntr_id = ce.encntr_id
	join pr
	where pr.person_id = ce.performed_prsnl_id
	order by  ce.event_id
	head report
		x = 0
	head ce.event_id
		if(substring(1,2,ce.reference_nbr) != "AP")
				x = x + 1
				stat = alterlist(documents_reply_out->master_document,x )
				documents_reply_out->master_document[x].document_id = ce.event_id
				documents_reply_out->master_document[x].document_name = uar_get_code_display(ce.event_cd)
				documents_reply_out->master_document[x].document_title = replace(ce.event_title_text,"\n","")
				documents_reply_out->master_document[x].document_ref_cd = ce.event_cd
				documents_reply_out->master_document[x].document_dt_tm = ce.valid_from_dt_tm
				documents_reply_out->master_document[x].document_status = uar_get_code_display(ce.result_status_cd)
				documents_reply_out->master_document[x].person_id = ce.person_id
				documents_reply_out->master_document[x].encntr_id = ce.encntr_id
				documents_reply_out->master_document[x].encntr_type_cd = e.encntr_type_cd
				documents_reply_out->master_document[x].encntr_type_disp = uar_get_code_display(e.encntr_type_cd)
				documents_reply_out->master_document[x].encntr_type_class_cd = e.encntr_type_class_cd
				documents_reply_out->master_document[x].encntr_type_class_disp = uar_get_code_display(e.encntr_type_class_cd)
				documents_reply_out->master_document[x].document_author = pr.name_full_formatted
				documents_reply_out->master_document[x].order_id = ce.order_id
				documents_reply_out->master_document[x].view_level = ce.view_level
				documents_reply_out->master_document[x].parent_document_id = ce.parent_event_id
				if (uar_get_code_display(ce.record_status_cd) = "Active")
					documents_reply_out->master_document[x].active_ind = 1
				else
					documents_reply_out->master_document[x].active_ind = 0
				endif
				documents_reply_out->master_document[x].publish_flag = ce.publish_flag
				documents_reply_out->document_count = x
		endif
	with nocounter,expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag)
 		call echo(build("------Qual Cnt = ",documents_reply_out->document_count))
 	endif
 
	if(documents_reply_out->document_count > 0)
		call ErrorHandler("EXECUTE", "S", "Success", "Get get documents completed successfully.", documents_reply_out)
	else
		call ErrorHandler("EXECUTE", "Z", "No Data.", "No records qualify.", documents_reply_out)
		go to EXIT_SCRIPT
	endif
 
;get document format information
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Getting person_name Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set num = 0
	set pop = 0
	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
    select into "nl:"
		ceb.event_id
	from
	clinical_event ce
	,ce_blob_result  ceb
	plan ce
  	where expand(num,1,documents_reply_out->document_count,ce.parent_event_id
  						,documents_reply_out->master_document[num].parent_document_id  )
	and ce.event_class_cd = c_doc_event_class_cd
    join ceb where ceb.event_id = ce.event_id
	and ceb.valid_until_dt_tm >= cnvtdatetime(curdate, curtime3)
  	order by  ceb.event_id
 
	head report
	  	pos = 0
   	head ceb.event_id
  		pos = locateval(num,1,documents_reply_out->document_count,ce.parent_event_id,documents_reply_out->master_document[num].
  		parent_document_id )
		documents_reply_out->master_document[pos].document_format = uar_get_code_display (ceb.format_cd)
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetAllDcouments Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;end of subroutine
 
 
end go
