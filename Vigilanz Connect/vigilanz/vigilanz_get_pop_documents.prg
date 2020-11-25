/****************************************************************************
 
  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

*****************************************************************************
      Source file name:     snsro_get_pop_documents.prg
      Object name:          vigilanz_get_pop_documents
      Program purpose:      Retrieve documents from CLINICAL_EVENT based on
      						date range and event_cd list parameters.
      Tables read:			CLINICAL_EVENT, PERSON, ENCOUNTER
      Tables updated:       NONE
      Executing from:       Emissary Service
      Special Notes:      	This population query will check for maximum records
      						and a maximum date range and if those are exceeded
      						a failure status and message will get returned.
******************************************************************************
                     MODIFICATION CONTROL LOG
 *****************************************************************************
 Mod Date     Engineer             Comment
 -----------------------------------------------------------------------------
  001 04/03/17  DJP                 Initial write
  002 05/18/17	DJP					Add Gender/DOB to Person Object
  003 05/25/17  DJP					Add Prsnl Id of document author
  004 07/06/17  DJP 				Check for From Date > To Date
  005 07/06/17  DJP					Change to accept UTC date/time
  006 07/27/17 	JCO					Changed %i to execute; update ErrorHandler2
  007 11/28/17  DJP					Update tdb request to use
  008 01/31/18 	RJC					Fixed event_set_cd index issue causing documents to not appear
  009 03/22/18  RJC					Added version code and copyright block
  010 04/11/18  DJP					Added string Birthdate field to person object
  011 05/08/18	RJC					Increased size of 100011 reply structure
  012 06/11/18 	DJP					Comment out MAXREC on Selects
  013 07/11/18	RJC					Performance Improvements - using req 1000079 instead of 1000011, code cleanup
  014 07/13/18	RJC					Added maxvarlen for large documents issue
  015 07/31/18	RJC					Additional performance improvements around encounter filtering
  016 08/09/18  RJC					Changed max rec behavior. Max recs will no longer error out. It will return the max recs and
									once the limit is reached, it return all recs tied to the same second.
  017 08/14/18 RJC					Made expand clause variable depending on number of elements in record
  018 08/23/18 RJC					Added valid_until_dt_tm to query. Added blob size data to chunk up 100079
  019 08/27/18 RJC					Changed the chunk size of 1000079 to 7.5MB
  020 08/29/18 STV                  Rework for UTC BUG and now leveraging new functions
  021 08/31/18 RJC					Added filter for parent events with a record_status_cd of Active
  022 10/18/18 RJC					Outerjoin on person_alias table
  023 01/07/19 STV                  Switched MRN to encntr based MRN
  024 01/16/19 RJC					Added maxblob size as input parameter
  025 04/15/19 STV                  Added Query time threshold
  026 04/29/19 RJC					Performance improvements -removed dummyt refs, removed tdbexecute; maxblobsize param no longer
  									needed; removed blob check part of structure
 ***********************************************************************/
drop program vigilanz_get_pop_documents go
create program vigilanz_get_pop_documents
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Username:" = ""  			;REQUIRED. Valid HNA Millennium user account.
	, "Beg Date:" = ""				;REQUIRED. Beginning of bookmark date range.
	, "End Date:" = ""				;OPTIONAL. No longer REQUIRED. End of bookmark date range. ;009
	, "Categories" = ""				;OPTIONAL. ;011 Document
	, "Components:" = ""			;OPTIONAL. List of event codes from code set 72/93.
	, "Locations" = ""				;OPTIONAL. List of location facility codes from code set 220.
	, "Include Body" = 0			;Defaults to no
	, "MaxBlobSize" = 0				;Optional - emissary setting
	, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
	, "Time Max" = 3600				;DO NOT USE. Undocumented value to override maximum date range in seconds.
 
with OUTDEV, USERNAME, BEG_DATE, END_DATE, CAT_LIST, COMP_LIST, LOC_LIST, INC_BODY, MAX_BLOB, DEBUG_FLAG, TIME_MAX
/*************************************************************************
;CCL PROGRAM VERSION CONTROL changed to Emissary version ;009
**************************************************************************/
set sVersion = "1.21.6.2"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
; Final reply
free record pop_documents_reply_out
record pop_documents_reply_out
(
	1 document_count 					= i4
	1 master_document[*]
		2 document_id 					= f8	;event_id
		2 parent_document_id			= f8
		2 encntr_id						= f8
		2 document_name 				= vc	;event_code display
		2 document_title				= vc	;TitleText
		2 document_ref_cd				= f8	;event_code
		2 document_dt_tm				= dq8	;event_end_dt_tm
		2 document_status				= vc	;result status display
		2 document_format				= vc
		2 order_id						= f8
		2 view_level					= i4
		2 active_ind					= i2	;record status = ACTIVE ?
		2 publish_flag					= i2	;published display
		2 document_author				= vc	;author of the document
		2 document_author_id 			= f8	;prsnl id ;003
		2 created_updated_date_time 	= dq8	;ce.updt_dttm
		2 document_components[*]				;blob_results
			3 document_id				= f8	;event_id
			3 document_name 			= vc	;event_code display
			3 document_title			= vc	;TitleText
			3 document_ref_cd			= f8	;event_code
			3 document_dt_tm			= dq8	;event_end_dt_tm
			3 document_status			= vc	;result status display
/*001*/		3 document_handle			= vc	;blob_handle or pointer to image/document outside Millennium
			3 view_level				= i4
			3 active_ind				= i2	;record status = ACTIVE ?
			3 publish_flag				= vc	;published display
			3 storage					= vc	;storage display
			3 format					= vc	;format display
			3 body						= vc	;body
			3 length					= i4	;length of body
/*		2 document_notes[*]						;event_note_list
			3 note_id					= f8	;eventNoteId
			3 note_dt_tm				= dq8	;datetime
			3 note_type					= vc	;type display
			3 format					= vc	;format display
			3 body						= vc	;body
			3 length					= i4	;length of body */
		2 person
		  3 person_id 					= f8	;p.person_id
		  3 name_full_formatted 		= vc	;p.name_full_formatted
		  3 name_last 					= vc	;p.last_name
		  3 name_first 					= vc	;p.first_name
		  3 name_middle 				= vc	;p.middle_name
		  3 mrn							= vc    ;pa.alias
		  3 dob							= dq8 	;002
		  3 gender_id					= f8  	;002
		  3 gender_disp					= vc  	;002
		  3 sDOB						= c10 	;010
	  2 encounter
		  3 encounter_id 				= f8	;e.encntr_id
		  3 encounter_type_cd			= f8	;e.encntr_type_cd
		  3 encounter_type_disp			= vc	;encounter type display
		  3 encounter_type_class_cd		= f8	;encounter_type_class_cd
	      3 encounter_type_class_disp	= vc	;encounter type class display
 		  3 arrive_date					= dq8	;e.arrive_dt_tm
 		  3 discharge_date				= dq8	;e.discharge_dt_tm
 		  3 fin_nbr						= vc	;ea.alias 002
 		  3 patient_location						;008 ; 010
 		  	4  location_cd              = f8
  			4  location_disp            = vc
  			4  loc_bed_cd               = f8
  			4  loc_bed_disp             = vc
  			4  loc_building_cd          = f8
  			4  loc_building_disp        = vc
  			4  loc_facility_cd          = f8
  			4  loc_facility_disp        = vc
  			4  loc_nurse_unit_cd        = f8
 			4  loc_nurse_unit_disp      = vc
 			4  loc_room_cd              = f8
  			4  loc_room_disp            = vc
  			4  loc_temp_cd              = f8
  			4  loc_temp_disp            = vc
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
  1 status_data 								;007
    2 status = c1
    2 subeventstatus[1]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
      3 Code = c4
      3 Description = vc
)
 
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
 
free record loc_req
record loc_req (
	1 qual_cnt 							= i4
	1 qual[*]
		2 location_cd					= f8
)
 
;initialize status to FAIL
set pop_documents_reply_out->status_data->status = "F"
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common	;007
 
/**************************************************************
* DECLARE VARIABLES
**************************************************************/
set MODIFY MAXVARLEN 200000000												;014
 
;Input
declare sUserName						= vc with protect, noconstant("")   ;006
declare sFromDate						= vc with protect, noconstant("")
declare sToDate							= vc with protect, noconstant("")
declare sCategories 					= vc with protect, noconstant("")	;011
declare sComponents						= vc with protect, noconstant("")
declare iIncludeBody					= i2 with protect, noconstant(0)
declare iDebugFlag						= i2 with protect, noconstant(0)
declare iTimeMax						= i4 with protect, noconstant(0)
declare sLocFacilities					= vc with protect, noconstant("")
 
;Other
declare UTCmode							= i2 with protect, noconstant(0)	;005
declare UTCpos 							= i2 with protect, noconstant(0)	;005
declare qFromDateTime					= dq8 with protect, noconstant(CNVTDATETIME(CURDATE, CURTIME3))
declare qToDateTime						= dq8 with protect, noconstant(CNVTDATETIME(CURDATE, CURTIME3))
declare iTimeDiff						= i4 with protect, noconstant(0)
declare iObsSize						= i4 with protect, noconstant(0)
declare ndx                     		= i4
declare ndx2                   			= i4
declare iMaxRecs						= i4 with protect, constant(2000) 	;016
declare iIndex							= i4 with protect, noconstant(1)	;018
declare iTotalBlobSize 					= i4 with protect, noconstant(0)	;018
declare timeOutThreshold 				= i4 with protect, noconstant(115);setting to 115 seconds
declare queryStartTm 					= dq8
declare blob_in             			= c69999 with noconstant(" ")
declare blob_out            			= c69999 with noconstant(" ")
 
;Constants
declare c_mrn_encounter_alias_type_cd	= f8 with protect, constant(uar_get_code_by("MEANING",319,"MRN"))
declare c_fin_encntr_alias_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",319,"FIN NBR"))
declare c_program_start_dttm			= dq8 with protect, constant(cnvtdatetime(curdate,curtime3))
declare c_doc_event_class_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",53,"DOC"))
declare c_mdoc_event_class_cd 			= f8 with protect, constant(uar_get_code_by("MEANING",53,"MDOC"))
declare c_document_event_class_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",53,"DOCUMENT"))
declare c_now_dttm   					= dq8 with protect, constant( cnvtdatetime(curdate, curtime3) )
declare c_nocomp_compression_cd    		= f8 with protect, constant(uar_get_code_by("MEANING", 120, "NOCOMP"))
declare c_ocfcomp_compression_cd   		= f8 with protect, constant(uar_get_code_by("MEANING", 120, "OCFCOMP"))
declare c_active_record_status_cd		= f8 with protect, constant(uar_get_code_by("MEANING",48,"ACTIVE")) ;021
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
;Input
set sUserName						= trim($USERNAME, 3)
set sFromDate						= trim($BEG_DATE, 3)
set sToDate							= trim($END_DATE, 3)
set sCategories  					= trim($CAT_LIST, 3) ;011
set sComponents     				= trim($COMP_LIST,3)
set sLocFacilities					= trim($LOC_LIST,3)
set iIncludeBody					= cnvtint($INC_BODY)
set iDebugFlag						= cnvtint($DEBUG_FLAG)
set iTimeMax						= cnvtint($TIME_MAX)
 
; Setup Time parameters
set qFromDateTime = GetDateTime(sFromDate)
set qToDateTime = GetDateTime(sToDate)
 
 
if(iDebugFlag > 0)
	call echo(build("sFromDate -> ",sFromDate))
	call echo(build("sToDate -> ",sToDate))
	call echo(build("sUserName -> ", sUserName))
	call echo(build("qFromDateTime -> ", qFromDateTime))
	call echo(build("qToDateTime -> ", qToDateTime))
	call echo(build("qFromDateTime -> ", format(qFromDateTime,"MM-DD-YYYY HH:MM:SS;;q")))
	call echo(build("qToDateTime -> ", format(qToDateTime,"MM-DD-YYYY HH:MM:SS;;q")))
	call echo(build("iDebugFlag -> ", iDebugFlag))
	call echo(build("iIncludeBody -> ", iIncludeBody))
	call echo(build("iTimeMax -> ", iTimeMax))
	call echo(build("sCategories -> ",sCategories))
	call echo(build("sComponents -> ",sComponents))
	call echo(build("sLocFacilities -> ",sLocFacilities))
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ParseCategories(null)		= null with protect
declare ParseComponents(null)  		= null with protect
declare ParseLocations(null)		= null with protect
declare GetDocumentList(null)		= null with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Validate username and populate audit
set iRet = PopulateAudit(sUserName, 0.0, pop_documents_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F","POP_DOCUMENTS","Invalid User for Audit.",
		"1001",build2("Invalid User for Audit."),pop_documents_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate from date is not greater than to date - 004
if (qFromDateTime > qToDateTime)
	call ErrorHandler2("VALIDATE", "F", "POP_DOCUMENTS", "From Date Greater than To Date. Refine Dates Entered.",
	"2010", "From Date Greater than To Date. Refine Dates Entered.", pop_documents_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate timespan does not exceed threshold
set iRet = ThreshHoldValidator(iTimeMax,"s",qFromDateTime,qToDateTime)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "POP_DOCUMENTS", "Date Range Too Long. Refine Query.",
	"2011","Date Range Too Long. Refine Query.",pop_documents_reply_out)
	go to EXIT_SCRIPT
endif
 
; Parse categories if provided
if(sCategories > " ")
	call ParseCategories(null)
endif
 
; Parse Components if provided
if(sComponents > " ")
	call ParseComponents(null)
endif
 
; Parse locations if provided
if(sLocFacilities > " ")
	call ParseLocations(null)
endif
 
; Get Document List
call GetDocumentList(null)
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************
* Convert REC output to JSON
**************************************************************/
set JSONout = CNVTRECTOJSON(pop_documents_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
	call echorecord(pop_documents_reply_out)
	call echo(JSONout)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_pop_documents.json")
	call echo(build2("_file : ", _file))
	call echojson(pop_documents_reply_out, _file, 0)
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
				"2026",build("Invalid Event Set Code: ",category_req->qual[num]->event_set_cd), pop_documents_reply_out)	;012
				go to exit_script
			else
      			set stat = alterlist(category_req->qual, num)
      			set category_req->qual[num]->event_set_cd = cnvtreal(str)
      			set category_req->qual_cnt = num
      		endif
       	endif
      	set num = num + 1
	endwhile
 
	;Set expand control value - 017
	if(category_req->qual_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	; Build component list
	set tnum = 1
 
	select into "nl:"
    from v500_event_set_explode ves
    where expand(tnum,1, category_req->qual_cnt,ves.event_set_cd,category_req->qual[tnum]->event_set_cd)
    and ves.event_cd != 0.0
	head report
		x = 0
		stat = alterlist(components_req->qual,2000)
	detail
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
		call echo(concat("ParseCategories Runtime: ",
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
     			"2018",build("Invalid Event Code: ",trim(str,3), pop_documents_reply_out))
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
;  Name: ParseLocations(null)
;  Description: Subroutine to parse a comma delimited string
**************************************************************************/
subroutine ParseLocations(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ParseLocations Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare notfnd 		= vc with constant("<not_found>")
	declare num 		= i4 with noconstant(1)
	declare str 		= vc with noconstant("")
 
	while (str != notfnd)
	 	set str =  piece(sLocFacilities,',',num,notfnd)
	 	if(str != notfnd)
	  		set stat = alterlist(loc_req->qual,num)
	 		set loc_req->qual[num]->location_cd = cnvtint(str)
	 		set loc_req->qual_cnt = num
 
	 		 select into code_value
	 		 from code_value
			 where code_set = 220 and cdf_meaning = "FACILITY" and
			 loc_req->qual[num]->location_cd = code_value              ;003
 
	 		if (curqual = 0)
	 			call ErrorHandler2("EXECUTE", "F", "POP_DOCUMENTS", build("Invalid Facility Code: ", loc_req->qual[num]->location_cd),
				"2040", build("Invalid Facility Code: ",loc_req->qual[num]->location_cd),pop_documents_reply_out) ;012
				go to Exit_Script
			endif  ;003
	 	endif
	  	set num = num + 1
	endwhile
 
	if(iDebugFlag > 0)
		call echo(concat("ParseLocations Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;End Sub
 
/*************************************************************************
;  Name: GetDocumentList
;  Description: Retrieve document ids/persons/encounters
**************************************************************************/
subroutine GetDocumentList(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetDocumentList Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare where_loc_clause 		= vc with protect, noconstant("")
	declare where_event_clause 		= vc with protect, noconstant("")
 
 	; Event Code filter
  	if(components_req->qual_cnt > 0)
 		set where_event_clause =
 		" expand(ndx,1,components_req->qual_cnt,ce.event_cd,components_req->qual[ndx].event_cd)"   ;008
 	else
 		set where_event_clause = "ce.event_cd > 0"
 	endif
 
	;Set expand control value - 017
	if(components_req->qual_cnt > 200 or loc_req->qual_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	;Get event ids
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select
		if(loc_req->qual_cnt > 0)
			from clinical_event ce
				,clinical_event ce2	;021
				,encounter e
			plan ce where ce.updt_dt_tm >= cnvtdatetime(qFromDateTime)
				and ce.updt_dt_tm <= cnvtdatetime(qToDateTime)
				and ce.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)	;018
				and ce.view_level = 1
				and ce.event_class_cd in (c_mdoc_event_class_cd,c_doc_event_class_cd,c_document_event_class_cd)
				and parser(where_event_clause)
			join ce2 where ce2.event_id = ce.parent_event_id
				and ce2.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
				and ce2.record_status_cd = c_active_record_status_cd
			join e where e.encntr_id = ce.encntr_id
				and expand(ndx2,1,loc_req->qual_cnt,e.loc_facility_cd,loc_req->qual[ndx2].location_cd)
			order by ce.updt_dt_tm
		else
			from clinical_event ce
				,clinical_event ce2	;021
			plan ce where ce.updt_dt_tm >= cnvtdatetime(qFromDateTime)
				and ce.updt_dt_tm <= cnvtdatetime(qToDateTime)
				and ce.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)	;018
				and ce.view_level = 1
				and ce.event_class_cd in (c_mdoc_event_class_cd,c_doc_event_class_cd,c_document_event_class_cd)
				and parser(where_event_clause)
			join ce2 where ce2.event_id = ce.parent_event_id
				and ce2.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
				and ce2.record_status_cd = c_active_record_status_cd
			order by ce.updt_dt_tm, ce.event_id
		endif
	into "nl:"
		ce.event_id
		, ce.updt_dt_tm
	head report
		x = 0
		max_reached = 0
		stat = alterlist(pop_documents_reply_out->master_document,iMaxRecs)
	head ce.updt_dt_tm
		if(x > iMaxRecs)
			max_reached = 1
		endif
	head ce.event_id
		if(max_reached = 0)
			if(substring(1,2,ce.reference_nbr) != "AP")
				x = x + 1
				if(mod(x,100) = 1 and x > iMaxRecs)
					stat = alterlist(pop_documents_reply_out->master_document,x + 99)
				endif
 
				pop_documents_reply_out->master_document[x]->document_id = ce.event_id
				pop_documents_reply_out->master_document[x]->parent_document_id = ce.parent_event_id
				pop_documents_reply_out->master_document[x]->person->person_id = ce.person_id
				pop_documents_reply_out->master_document[x].encntr_id = ce.encntr_id
				pop_documents_reply_out->master_document[x].order_id = ce.order_id
				pop_documents_reply_out->master_document[x]->encounter->encounter_id = ce.encntr_id
				pop_documents_reply_out->master_document[x]->document_ref_cd = ce.event_cd
				pop_documents_reply_out->master_document[x]->document_name = uar_get_code_display(ce.event_cd)
				pop_documents_reply_out->master_document[x]->document_title =
					replace(ce.event_title_text,"\n","")
				pop_documents_reply_out->master_document[x]->document_dt_tm = ce.clinsig_updt_dt_tm
				pop_documents_reply_out->master_document[x]->document_status = uar_get_code_display(ce.result_status_cd)
				pop_documents_reply_out->master_document[x]->document_author_id = ce.performed_prsnl_id
				pop_documents_reply_out->master_document[x].view_level = ce.view_level
				pop_documents_reply_out->master_document[x].publish_flag = ce.publish_flag
 
				if (uar_get_code_display(ce.record_status_cd) = "Active")
					pop_documents_reply_out->master_document[x].active_ind = 1
				else
					pop_documents_reply_out->master_document[x].active_ind = 0
				endif
 
				if(ce.updt_dt_tm > pop_documents_reply_out->master_document[x]->created_updated_date_time)
					pop_documents_reply_out->master_document[x]->created_updated_date_time = ce.updt_dt_tm
 				endif
			endif
		endif
	foot report
		stat = alterlist(pop_documents_reply_out->master_document,x)
		pop_documents_reply_out->document_count = x
	with nocounter, expand = value(exp),time = value(timeOutThreshold)
 
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag)
 		call echo(build("------Qual Cnt = ",pop_documents_reply_out->document_count))
 		call echo(build2("Event builder: ",datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)))
 	endif
 
	; Populate Audit
	if(pop_documents_reply_out->document_count > 0)
		call ErrorHandler("EXECUTE", "S", "POP_DOCUMENTS", "Success", pop_documents_reply_out)
	else
		call ErrorHandler("EXECUTE", "Z", "POP_DOCUMENTS", "No records qualify.", pop_documents_reply_out)
		go to exit_script
	endif
 
 	;Set expand control value - 017
 	set idx = 1
	if(pop_documents_reply_out->document_count > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	; Get Person Data
	set queryStartTm = cnvtdatetime(curdate, curtime3)
 	select into "nl:"
	from person p
	plan p where expand(idx,1,pop_documents_reply_out->document_count,p.person_id,
		pop_documents_reply_out->master_document[idx]->person->person_id)
	detail
		next = 1
		pos = locateval(idx,next,pop_documents_reply_out->document_count,p.person_id,
		pop_documents_reply_out->master_document[idx]->person->person_id)
 
		while(pos > 0 and next <= pop_documents_reply_out->document_count)
			pop_documents_reply_out->master_document[pos]->person->person_id = p.person_id
			pop_documents_reply_out->master_document[pos]->person->name_full_formatted = p.name_full_formatted
			pop_documents_reply_out->master_document[pos]->person->name_first = p.name_first
			pop_documents_reply_out->master_document[pos]->person->name_last = p.name_last
			pop_documents_reply_out->master_document[pos]->person->name_middle = p.name_middle
			pop_documents_reply_out->master_document[pos]->person->dob = p.birth_dt_tm ;002
			pop_documents_reply_out->master_document[pos]->person->gender_id = p.sex_cd ;002
			pop_documents_reply_out->master_document[pos]->person->gender_disp = uar_get_code_display(p.sex_cd);002
			pop_documents_reply_out->master_document[pos]->person->sDOB =
			datetimezoneformat(p.birth_dt_tm,p.birth_tz,"YYYY-MM-DD",curtimezonedef)
 
			next = pos + 1
			pos = locateval(idx,next,pop_documents_reply_out->document_count,p.person_id,
			pop_documents_reply_out->master_document[idx]->person->person_id)
		endwhile
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	if(iDebugFlag)
 		call echo(build2("Person Builder: ",datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)))
 	endif
 
 
	; Get Encounter Data
	set queryStartTm = cnvtdatetime(curdate, curtime3)
 	select into "nl:"
	from encounter e
		,encntr_alias ea
		,encntr_alias ea2
	plan e where expand(idx,1,pop_documents_reply_out->document_count,e.encntr_id,
		pop_documents_reply_out->master_document[idx]->encounter->encounter_id)
	join ea where ea.encntr_id = outerjoin(e.encntr_id)
		and ea.encntr_alias_type_cd = outerjoin(c_fin_encntr_alias_type_cd)
		and ea.active_ind = outerjoin(1)
		and ea.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		and ea.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
	join ea2 where ea2.encntr_id = outerjoin(e.encntr_id)
		and ea2.encntr_alias_type_cd = outerjoin(c_mrn_encounter_alias_type_cd)
		and ea2.active_ind = outerjoin(1)
		and ea2.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		and ea2.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
	detail
		next = 1
		pos = locateval(idx,next,pop_documents_reply_out->document_count,e.encntr_id,
		pop_documents_reply_out->master_document[idx]->encounter->encounter_id)
 
		while(pos > 0 and next <= pop_documents_reply_out->document_count)
			;MRN
			pop_documents_reply_out->master_document[pos]->person->mrn = ea2.alias
 
			;Encounter Data
			pop_documents_reply_out->master_document[pos]->encounter->encounter_id = e.encntr_id
			pop_documents_reply_out->master_document[pos]->encounter->encounter_type_cd = e.encntr_type_cd
			pop_documents_reply_out->master_document[pos]->encounter->encounter_type_disp =
				uar_get_code_display(e.encntr_type_cd)
			pop_documents_reply_out->master_document[pos]->encounter->encounter_type_class_cd = e.encntr_type_class_cd
			pop_documents_reply_out->master_document[pos]->encounter->encounter_type_class_disp =
				uar_get_code_display(e.encntr_type_class_cd)
			pop_documents_reply_out->master_document[pos]->encounter->arrive_date = e.arrive_dt_tm
			if (e.arrive_dt_tm is null)
				pop_documents_reply_out->master_document[pos]->encounter->arrive_date = e.reg_dt_tm
			endif
			pop_documents_reply_out->master_document[pos]->encounter->discharge_date = e.disch_dt_tm
			pop_documents_reply_out->master_document[pos]->encounter->fin_nbr = ea.alias
 
			;Patient Location Data
			pop_documents_reply_out->master_document[pos]->encounter->patient_location->location_cd = e.location_cd
			pop_documents_reply_out->master_document[pos]->encounter->patient_location->location_disp =
				uar_get_code_display(e.location_cd)
			pop_documents_reply_out->master_document[pos]->encounter->patient_location->loc_bed_cd = e.loc_bed_cd
			pop_documents_reply_out->master_document[pos]->encounter->patient_location->loc_bed_disp =
				uar_get_code_display(e.loc_bed_cd)
			pop_documents_reply_out->master_document[pos]->encounter->patient_location->loc_building_cd = e.loc_building_cd
			pop_documents_reply_out->master_document[pos]->encounter->patient_location->loc_building_disp =
				uar_get_code_display(e.loc_building_cd)
			pop_documents_reply_out->master_document[pos]->encounter->patient_location->loc_facility_cd = e.loc_facility_cd
			pop_documents_reply_out->master_document[pos]->encounter->patient_location->loc_facility_disp =
				uar_get_code_display(e.loc_facility_cd)
			pop_documents_reply_out->master_document[pos]->encounter->patient_location->loc_nurse_unit_cd = e.loc_nurse_unit_cd
			pop_documents_reply_out->master_document[pos]->encounter->patient_location->loc_nurse_unit_disp =
				uar_get_code_display(e.loc_nurse_unit_cd)
			pop_documents_reply_out->master_document[pos]->encounter->patient_location->loc_room_cd = e.loc_room_cd
			pop_documents_reply_out->master_document[pos]->encounter->patient_location->loc_room_disp =
				uar_get_code_display(e.loc_room_cd)
			pop_documents_reply_out->master_document[pos]->encounter->patient_location->loc_temp_cd = e.loc_temp_cd
			pop_documents_reply_out->master_document[pos]->encounter->patient_location->loc_temp_disp =
				uar_get_code_display(e.loc_temp_cd)
 
			next = pos + 1
			pos = locateval(idx,next,pop_documents_reply_out->document_count,e.encntr_id,
			pop_documents_reply_out->master_document[idx]->encounter->encounter_id)
		endwhile
	with nocounter, separator=" ", format, expand = value(exp),time = value(timeOutThreshold)
 
	if(iDebugFlag)
 		call echo(build2("Encounter Builder: ",datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)))
 	endif
 
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	;Get blob sizes for all event and child events
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from clinical_event ce
		, clinical_event ce2
		, ce_blob_result cbr
		, ce_blob cb
	plan ce where expand(idx,1,pop_documents_reply_out->document_count,ce.event_id,
		pop_documents_reply_out->master_document[idx].document_id)
	join ce2 where (ce2.event_id = ce.event_id
			or ce2.parent_event_id = ce.event_id)
			and ce2.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
	join cbr where cbr.event_id = ce2.event_id
		and cbr.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
	join cb where cb.event_id = outerjoin(cbr.event_id)
		and cb.blob_seq_num = outerjoin(cbr.max_sequence_nbr)
		and cb.valid_until_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
	order by ce.event_id, cbr.event_id
	head ce.event_id
		x = 0
	head cbr.event_id
		x = x + 1
		next = 1
		pos = locateval(idx,next,pop_documents_reply_out->document_count,ce.event_id,
		pop_documents_reply_out->master_document[idx].document_id)
 
		while(pos > 0 and next <= pop_documents_reply_out->document_count)
			stat = alterlist(pop_documents_reply_out->master_document[pos].document_components,x)
 
			pop_documents_reply_out->master_document[pos]->document_components[x].document_id = cbr.event_id
			pop_documents_reply_out->master_document[pos]->document_components[x].document_name = uar_get_code_display(ce2.event_cd)
			pop_documents_reply_out->master_document[pos]->document_components[x].document_ref_cd = ce2.event_cd
			pop_documents_reply_out->master_document[pos]->document_components[x].document_title =
				replace(ce2.event_title_text,"\n","")
			pop_documents_reply_out->master_document[pos]->document_components[x].document_dt_tm = ce2.clinsig_updt_dt_tm
			pop_documents_reply_out->master_document[pos]->document_components[x].document_status =
				uar_get_code_display(cbr.succession_type_cd)
			pop_documents_reply_out->master_document[pos]->document_components[x].active_ind = 1
			pop_documents_reply_out->master_document[pos]->document_components[x].view_level = 1
			pop_documents_reply_out->master_document[pos]->document_components[x].publish_flag = "PUBLISH"
			pop_documents_reply_out->master_document[pos]->document_components[x].storage = uar_get_code_display(cbr.storage_cd)
			pop_documents_reply_out->master_document[pos]->document_components[x].format = uar_get_code_display(cbr.format_cd)
			if(x = 1)
				pop_documents_reply_out->master_document[pos].document_format = uar_get_code_display(cbr.format_cd)
			endif
			pop_documents_reply_out->master_document[pos]->document_components[x].document_handle = cbr.blob_handle
 
			;Include Body if requested and exists
			if(cb.event_id > 0)
				pop_documents_reply_out->master_document[pos]->document_components[x].length = cb.blob_length
				if(iIncludeBody > 0)
					blob_out = ""
			    	if( cb.compression_cd = c_ocfcomp_compression_cd )
			        	call uar_ocf_uncompress(cb.blob_contents, 69999, blob_out, 69999, size(blob_out))
			        	pop_documents_reply_out->master_document[pos]->document_components[x].body  = blob_out
			    	else
			        	blob_in = replace(cb.blob_contents, "ocf_blob", "",2)
			       		pop_documents_reply_out->master_document[pos]->document_components[x].body  = blob_in
			    	endif
				endif
			endif
 
			next = pos + 1
			pos = locateval(idx,next,pop_documents_reply_out->document_count,ce.event_id,
			pop_documents_reply_out->master_document[idx].document_id)
		endwhile
	with nocounter, expand = value(exp), time = value(timeOutThreshold), maxcol=999999
 
 	if(iDebugFlag)
 		call echo(build2("Blob checker: ",datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)))
 	endif
 
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	; Get Doc Author Name
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
 	select into "nl:"
 	from prsnl p
 	plan p where expand(idx,1,pop_documents_reply_out->document_count,p.person_id,
 		pop_documents_reply_out->master_document[idx]->document_author_id)
 	detail
 		next = 1
 		pos = locateval(idx,next,pop_documents_reply_out->document_count,p.person_id,
 		pop_documents_reply_out->master_document[idx]->document_author_id)
 
 		while(pos > 0 and next <= pop_documents_reply_out->document_count)
 			pop_documents_reply_out->master_document[pos]->document_author = p.name_full_formatted
 
 			next = pos + 1
 			pos = locateval(idx,next,pop_documents_reply_out->document_count,p.person_id,
 			pop_documents_reply_out->master_document[idx]->document_author_id)
 		endwhile
 	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
 	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
 	if(iDebugFlag)
 		call echo(build2("Author Name: ",datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)))
 	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetDocumentList Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;End Sub
 
end
go
