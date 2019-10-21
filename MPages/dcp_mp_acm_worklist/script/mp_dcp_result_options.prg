drop program mp_dcp_result_options:dba go
create program mp_dcp_result_options:dba

prompt
	"Output to File/Printer/MINE" = "MINE" ,
	"JSON_ARGS:" = ""

with OUTDEV, JSON_ARGS

%i cclsource:mp_dcp_blob_in_params.inc
set stat = cnvtjsontorec(ExtractParamsFromRequest(request, $JSON_ARGS))

/*
record result_request
(
	1 pos_cd = f8 ; the position code of the user.
	1 text = vc ;the text to match
	1 parent_event_set[*]
		2 event_set = vc ;the event_set_name to search under. ie: LABORATORY
	1 concept = vc ;the concept to search in.  format: "EVENT_SET_CONCEPT_#"
)
*/

call echorecord(result_request)

free record reply
record reply
(
	1 catalog = vc ;LABS
	1 result_options[*]
		2 event_set_name = vc
		;2 event_set_cd = f8 ;(code set 92)
		2 event_set_disp = vc
	1 event_set_concepts[*]
		2 event_codes[*]
			3 display_name = vc
			3 name = vc
			3 id = f8
		2 id = f8
		2 name = vc
%i cclsource:status_block.inc
)

%i cclsource:mp_script_logging.inc
%i cclsource:mp_dcp_pl_includes.inc
set modify maxvarlen 52428800
call log_message("In mp_dcp_result_options", LOG_LEVEL_DEBUG)

/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/
declare getLabDropDown(search = vc) = NULL
declare queryEventSetConcepts(search = vc, concept = vc, category_id = f8, flex_id = f8) = NULL
declare getEventSetConcepts(search = vc, concept = vc) = NULL
declare replyFailure(NULL) = NULL
declare CnvtCCLRec(NULL) = NULL

/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
declare error_string = vc
declare fail_operation = vc
declare failed = i2 with NOCONSTANT(0)
set ERRMSG =  FILLSTRING(132," ")
set ERRCODE = error(ERRMSG,1)
set reply->status_data.status = "Z"

/**************************************************************
; DVDev Start Coding
**************************************************************/

if(result_request->text != "")
	call getLabDropDown(result_request->text)
	call getEventSetConcepts(result_request->text, result_request->concept)
endif

go to exit_script

/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
subroutine getLabDropDown(search)
	call log_message("Begin getLabDropDown()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
    declare result_count = i4 with noconstant(0)

	declare search_string = vc with constant(build(trim(cnvtupper(search), 7), "*"))
	declare expand_num = i4

	select distinct S2.EVENT_SET_CD_DISP
	from V500_EVENT_SET_CODE S1,
		 V500_EVENT_SET_CODE S2,
		 V500_EVENT_SET_EXPLODE EX1,
		 V500_EVENT_SET_EXPLODE EX2
	PLAN S1 WHERE expand(expand_num, 1, size(result_request->parent_event_set, 5), S1.event_set_name, result_request->
	parent_event_set[expand_num].event_set)
	JOIN EX1 WHERE EX1.EVENT_SET_CD = S1.EVENT_SET_CD
	JOIN EX2 WHERE EX2.EVENT_CD = EX1.EVENT_CD
  		AND EX2.EVENT_SET_LEVEL = 0
	JOIN S2 WHERE EX2.EVENT_SET_CD = S2.EVENT_SET_CD
		AND trim(cnvtupper(S2.event_set_cd_disp), 7) = patstring(search_string)
  	order by s2.event_set_cd_disp

	head report
		result_count = 0
	detail
		result_count = result_count + 1
			if(mod(result_count,20) = 1)
				stat = alterlist(reply->result_options, result_count + 19)
			endif
		reply->result_options[result_count].event_set_name = S2.EVENT_SET_NAME
		reply->result_options[result_count].event_set_disp = S2.EVENT_SET_CD_DISP
	foot report
		stat = alterlist(reply->result_options, result_count)
	with nocounter

	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "getLabDropDown"
       call replyFailure("SELECT")
    endif

	call log_message(build2("Exit getLabDropDown(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)

end

; @desc Retrieve the Event Set Concepts that match the search string.
; @param {vc} search - Search string to match concepts with.
; @param {vc} concept - Which concept to search in.  Ex. EVENT_SET_CONCEPT_#
; @param {f8} category_id - Bedrock category id to search within.
; @param {f8} flex_id - Bedrock flex_id of the position/system to search within.
SUBROUTINE queryEventSetConcepts(search, concept, category_id, flex_id)
	call log_message("Begin queryEventSetConcepts()", LOG_LEVEL_DEBUG)

	DECLARE code_count		= i4 WITH noconstant(0)
	DECLARE concept_count	= i4 WITH noconstant(0)
	DECLARE search_string   = vc WITH constant(build(trim(cnvtupper(search), 7), "*"))
	DECLARE concept_string  = vc WITH constant(concept)
	
	SELECT	INTO "nl:"
			cv_display = UAR_GET_CODE_DISPLAY(begr.parent_entity_id),
			cv_display_key = UAR_GET_DISPLAYKEY(begr.parent_entity_id)
	FROM br_event_grouper       beg,
		 br_event_grouper_reltn begr,
		 br_datamart_filter     bdf,
		 br_datamart_value      bdv
	PLAN bdf  WHERE bdf.br_datamart_category_id = category_id AND
					bdf.filter_mean IN (patstring(concept_string))
	JOIN bdv  WHERE bdv.br_datamart_category_id = bdf.br_datamart_category_id	AND
					bdv.br_datamart_filter_id   = bdf.br_datamart_filter_id		AND
					bdv.br_datamart_flex_id     = flex_id						AND
					bdv.logical_domain_id		= 0
	JOIN beg  WHERE beg.active_ind = 1 AND
					trim(cnvtupper(beg.grouper_name), 7) = patstring(search_string) AND
					beg.br_event_grouper_id  = bdv.parent_entity_id
	JOIN begr WHERE begr.br_event_grouper_id = beg.br_event_grouper_id AND
					begr.parent_entity_name  = "CODE_VALUE"
	ORDER beg.grouper_name, cv_display_key

	HEAD REPORT
		concept_count = 0
	HEAD beg.br_event_grouper_id
		code_count = 0
		concept_count = concept_count + 1
		IF(mod(concept_count,20) = 1)
			stat = alterlist(reply->event_set_concepts, concept_count + 19)
		ENDIF
		reply->event_set_concepts[concept_count].id	= beg.br_event_grouper_id
		reply->event_set_concepts[concept_count].name = beg.grouper_name
	DETAIL
		code_count = code_count + 1
		IF(mod(code_count,20) = 1)
			stat = alterlist(reply->event_set_concepts[concept_count].event_codes, code_count + 19)
		ENDIF
		reply->event_set_concepts[concept_count].event_codes[code_count].display_name = cv_display
		reply->event_set_concepts[concept_count].event_codes[code_count].id	= begr.parent_entity_id
		reply->event_set_concepts[concept_count].event_codes[code_count].name = cv_display_key
	FOOT beg.br_event_grouper_id
		stat = alterlist(reply->event_set_concepts[concept_count].event_codes, code_count)
	FOOT REPORT
		stat = alterlist(reply->event_set_concepts, concept_count)
	WITH nocounter
	
	SET ERRCODE = ERROR(ERRMSG,0)
	IF(ERRCODE != 0)
		SET failed = 1
		SET fail_operation = "queryEventSetConcepts"
		CALL replyFailure("SELECT")
	ENDIF

	call log_message(build2("Exit getEventSetConcepts()"), LOG_LEVEL_DEBUG)
END

subroutine getEventSetConcepts(search, concept)
	call log_message("Begin getEventSetConcepts()", LOG_LEVEL_DEBUG)

	declare BEGIN_TIME = f8 with constant(curtime3), private
	declare dwl_category_id = f8 with noconstant(0.0), protect
	declare pos_flex_id = f8 with noconstant(0.0)
	declare flex_id = f8 with noconstant(0.0)
	set dwl_category_id = GetCategoryId(DWL_CATEGORY_MEAN)
	set pos_flex_id = GetFlexId(result_request->pos_cd)
	set flex_id = GetFlexId(0.0) ; Default to system level preferences.

	; Attempt to find position level prefs, regardless of search string
	;     to see if there is a configuration for this concept at the position level.
	select into "nl:"
	from br_datamart_filter	bdf,
		 br_datamart_value	bdv
	plan bdf  where bdf.br_datamart_category_id = dwl_category_id and
					bdf.filter_mean in (patstring(concept))
	join bdv  where bdv.br_datamart_category_id = bdf.br_datamart_category_id	and
					bdv.br_datamart_filter_id   = bdf.br_datamart_filter_id		and
					bdv.br_datamart_flex_id     = pos_flex_id					and
					bdv.logical_domain_id		= 0
	head report
		flex_id = pos_flex_id	; Found at least pone position pref, we'll search on the position later.
	with nocounter

	set ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
		set failed = 1
		set fail_operation = "getEventSetConcepts"
		call replyFailure("SELECT")
	endif

	; Attempt to find matches to the search string.
	call queryEventSetConcepts(search, concept, dwl_category_id, flex_id)

	call log_message(build2("Exit getEventSetConcepts(), Elapsed time:",
							cnvtint(curtime3-BEGIN_TIME), "0 ms ",
							"getEventSetConcepts found ", size(reply->event_set_concepts, 5)),
					LOG_LEVEL_DEBUG)
end

subroutine replyFailure(targetObjName)
     call log_message("In replyFailure()", LOG_LEVEL_DEBUG)
     declare BEGIN_TIME = f8 with constant(curtime3), private

     call log_message(build("Error: ", targetObjName, " - ", trim(ERRMSG)), LOG_LEVEL_ERROR)

     rollback
     set reply->status_data.status = "F"
     set reply->status_data.subeventstatus[1].OperationName = fail_operation
     set reply->status_data.subeventstatus[1].OperationStatus = "F"
     set reply->status_data.subeventstatus[1].TargetObjectName = targetObjName
     set reply->status_data.subeventstatus[1].TargetObjectValue = ERRMSG

     call CnvtCCLRec(null)

     call log_message(build2("Exit replyFailure(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)

     go to exit_script
end

subroutine CnvtCCLRec(null)
     call log_message("In CnvtCCLRec()", LOG_LEVEL_DEBUG)
     declare BEGIN_TIME = f8 with constant(curtime3), private
     declare strJSON = vc

     set strJSON = cnvtrectojson(reply)
     set _Memory_Reply_String = strJSON

     call log_message(build2("Exit CnvtCCLRec(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end

#exit_script

if (reply->status_data.status = "Z")
	if(size(reply->result_options, 5) > 0 OR size(reply->event_set_concepts, 5) > 0)
		set reply->status_data.status = "S"
	endif
endif

call echorecord(reply)
if(failed = 0)
	call CnvtCCLRec(null)
endif

end
go
