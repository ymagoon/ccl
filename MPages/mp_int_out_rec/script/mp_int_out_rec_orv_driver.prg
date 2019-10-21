drop program mp_int_out_rec_orv_driver:dba go
create program mp_int_out_rec_orv_driver:dba

; Request
prompt
	"Output to File/Printer/MINE" = "MINE"
	,"Patient ID:"              = 0.0
	,"Encounter ID:"            = 0.0
	,"Personnel ID:"            = 0.0
	,"Static Content Location:" = ""
	,"HTML Backend Location:"   = ""
	,"HTML File Name:"          = ""
with OUTDEV, PAT_ID, ENCNTR_ID, PRSNL_ID, STATIC_LOC, BACKEND_LOC, HTML_FILE_NAME

/**************************************************************
; DVDev DECLARED RECORDS
**************************************************************/
free record eksGetSourceRequest
record eksGetSourceRequest (
	1 Module_Dir  = vc
	1 Module_Name = vc
	1 bAsBlob     = i2
)
free record eksGetSourceReply
record eksGetSourceReply (
	1 INFO_LINE[*]
		2 new_line   = vc
	1 data_blob      = gvc
	1 data_blob_size = i4
%i cclsource:status_block.inc
)

; Includes
%i cclsource:mp_script_logging.inc

/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/
declare GenerateHtml(BACKEND_LOCATION = vc, FILE_NAME = vc, STATIC_PATH = vc)     = vc
declare GetContextVariableHtml(PERSON_ID = f8, ENCOUNTER_ID = f8, PRSNL_ID = f8)  = vc
declare GetStandardHtml(STATIC_PATH = vc)                                         = vc
declare RetrieveFileContents(BACKEND_LOCATION = vc, FILE_NAME = vc)               = vc
declare RetrieveOrvHtml(BACKEND_LOCATION = vc, FILE_NAME = vc, OVERRIDE_IND = i2) = vc
declare RetrieveValueByKeyFromDmInfo(INFO_NAME = vc)                              = vc

/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
declare person_id      = f8 with noconstant(0.0), public
declare encounter_id   = f8 with noconstant(0.0), public
declare prsnl_id       = f8 with noconstant(0.0), public
declare static_loc     = vc with noconstant(""),  public
declare backend_loc    = vc with noconstant(""),  public
declare html_file_name = vc with noconstant(""),  public

/**************************************************************
; Execution
**************************************************************/
set person_id      = $PAT_ID
set encounter_id   = $ENCNTR_ID
set prsnl_id       = $PRSNL_ID
set static_loc     = $STATIC_LOC
set backend_loc    = $BACKEND_LOC
set html_file_name = $HTML_FILE_NAME

set _memory_reply_string = GenerateHtml(backend_loc, html_file_name, static_loc)

call log_message(build("_memory_reply_string:", _memory_reply_string), LOG_LEVEL_DEBUG)

/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
subroutine GenerateHtml(BACKEND_LOCATION, FILE_NAME, STATIC_PATH)
	call log_message("Begin GenerateHtml()", LOG_LEVEL_DEBUG)
	call log_message(build("PARAMS->"
							,"BACKEND_LOCATION: '", BACKEND_LOCATION, "'"
							,", FILE_NAME: '",      FILE_NAME,        "'"
							,", STATIC_PATH: '",    STATIC_PATH,      "'"
						), LOG_LEVEL_DEBUG)
	declare BEGIN_TIME   = f8 with constant(curtime3), private

	declare I_DRIVE_PATH    = vc with constant("I:\Winintel\static_content\outside_record_viewer_hiempage"), protect
	declare IS_OVERRIDE_IND = i2 with constant(1), protect
	declare NO_OVERRIDE_IND = i2 with constant(0), protect

	declare html         = vc with noconstant(""), private
	declare is_backend   = i2 with noconstant(0),  private
	declare is_frontend  = i2 with noconstant(0),  private

	; Check DM_INFO for an override.
	set html = RetrieveOrvHtml("", "", IS_OVERRIDE_IND)

	; If no override was found.
	if(html = "")
		; Determine the location type.
		if(BACKEND_LOCATION != "" and FILE_NAME != "")
			call log_message("Location is back end.", LOG_LEVEL_DEBUG)
			set is_backend = 1
		endif
		if(STATIC_PATH != "")
			call log_message("Location is front end.", LOG_LEVEL_DEBUG)
			set is_frontend = 1
		endif
		; Get the HTML.
		if(is_backend = 1 and is_frontend = 0)
			call log_message("Retrieving HTML from back end.", LOG_LEVEL_DEBUG)
			set html = RetrieveOrvHtml(BACKEND_LOCATION, FILE_NAME, NO_OVERRIDE_IND)
		elseif(is_backend = 0 and is_frontend = 1)
			call log_message("Using standard HTML with frontend location.", LOG_LEVEL_DEBUG)
			set html = GetStandardHtml(STATIC_PATH)
		else
			call log_message("Using standard HTML at the I drive.", LOG_LEVEL_DEBUG)
			set html = GetStandardHtml(I_DRIVE_PATH)
		endif
	endif

	call log_message(build2("End GenerateHtml(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)

	return(html)
end ; end GenerateHtml

subroutine GetContextVariableHtml(PERSON_ID, ENCOUNTER_ID, PRSNL_ID)
	call log_message("Begin GetContextVariableHtml()", LOG_LEVEL_DEBUG)
	call log_message(build("PARAMS->"
							,"PERSON_ID: '",      PERSON_ID,    "'"
							,", ENCOUNTER_ID: '", ENCOUNTER_ID, "'"
							,", PRSNL_ID: '",     PRSNL_ID,     "'"
						), LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private

	declare html_contents = vc with noconstant(""), private

	set html_contents = build2(
			^<script type="text/javascript">^,
				^var context_variable = {^,
					^pat_personid: ^,    PERSON_ID,    ^,^,
					^vis_encounterid: ^, ENCOUNTER_ID, ^,^,
					^usr_personid: ^,    PRSNL_ID,
				^};^,
			^</script>^
		)

	call log_message(build2("End GetContextVariableHtml(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)

	return(html_contents)
end ; end GetContextVariableHtml

subroutine GetStandardHtml(STATIC_PATH)
	call log_message("Begin GetStandardHtml()", LOG_LEVEL_DEBUG)
	call log_message(build("PARAMS->"
							,"STATIC_PATH: '", STATIC_PATH, "'"
						), LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private

	declare html_contents = vc with noconstant(""), private

	set html_contents = build2(
			^<?xml version="1.0" encoding="UTF-8" ?>^,
			^<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">^,
			^<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">^,
				^<head>^,
					^<meta http-equiv="Content-Type" content="XMLCCLREQUEST,APPLINK,MPAGES_EVENT" name="discern"/>^,
					GetContextVariableHtml(person_id, encounter_id, prsnl_id),
					^<script type="text/javascript" ^,
						^src="^, STATIC_PATH, ^\outside_record_viewer_hiempage.js"></script>^,
					^<link rel="stylesheet" type="text/css" ^,
						^href="^, STATIC_PATH, ^\outside_record_viewer_hiempage.css"></link>^,
				^</head>^,
				^<body onload='getEvents()'>^,
					^<p align=center style='text-align:center'>^,
						^<b>^,
							^<span style='font-family:"Albertus Extra Bold","sans-serif"'>Please wait, Page is loading.....</span>^,
						^</b>^,
					^</p>^,
				^</body>^,
			^</html>^
		)

	call log_message(build2("End GetStandardHtml(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)

	return(html_contents)
end ; end GetStandardHtml

subroutine RetrieveFileContents(BACKEND_LOCATION, FILE_NAME)
	call log_message("Begin RetrieveFileContents()", LOG_LEVEL_DEBUG)
	call log_message(build("PARAMS->"
							,"BACKEND_LOCATION: '", BACKEND_LOCATION, "'"
							,", FILE_NAME: '",      FILE_NAME,        "'"
						), LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private

	declare html_contents = vc with noconstant(""), private

	set eksGetSourceRequest->module_dir = BACKEND_LOCATION
	set eksGetSourceRequest->Module_name = trim(FILE_NAME, 3)
	set eksGetSourceRequest->bAsBlob = 1
	execute eks_get_source with replace (REQUEST,eksGetSourceRequest),replace(REPLY,eksGetSourceReply)
	set html_contents = eksGetSourceReply->data_blob

	call log_message(build2("End RetrieveFileContents(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)

	return(html_contents)
end ; end RetrieveFileContents

subroutine RetrieveOrvHtml(BACKEND_LOCATION, FILE_NAME, OVERRIDE_IND)
	call log_message("Begin RetrieveOrvHtml()", LOG_LEVEL_DEBUG)
	call log_message(build("PARAMS->"
							,"BACKEND_LOCATION: '", BACKEND_LOCATION, "'"
							,", FILE_NAME: '",      FILE_NAME,        "'"
							,", OVERRIDE_IND: '",   OVERRIDE_IND,     "'"
						), LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private

	declare HTML_KEY         = vc with constant("OUTSIDE_RECORDS_SUMMARY.HTML"), protect
	declare HTML_TO_REPLACE  = vc with constant("</head>"),                      protect

	declare context_variable = vc with noconstant(""), protect
	declare html_contents    = vc with noconstant(""), private

	set context_variable = build2(
								GetContextVariableHtml(person_id, encounter_id, prsnl_id),
								HTML_TO_REPLACE
							)

	if(OVERRIDE_IND = 1)
		set html_contents = RetrieveValueByKeyFromDmInfo(HTML_KEY)
	else
		set html_contents = RetrieveFileContents(BACKEND_LOCATION, FILE_NAME)
	endif
	set html_contents = replace(html_contents, HTML_TO_REPLACE, context_variable)

	call log_message(build2("End RetrieveOrvHtml(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)

	return(html_contents)
end ; end RetrieveOrvHtml

subroutine RetrieveValueByKeyFromDmInfo(INFO_NAME)
	call log_message("Begin RetrieveValueByKeyFromDmInfo()", LOG_LEVEL_DEBUG)
	call log_message(build("PARAMS->"
							,"INFO_NAME: '", INFO_NAME, "'"
						), LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private

	declare html_contents = vc with noconstant(""), protect

	select into "nl:"
	from dm_info di
	where di.info_name = INFO_NAME
	head report
		html_contents = di.info_char
	with nocounter, maxqual(di,1)

	if(curqual = 0)
		call log_message("No value found on DM_INFO.", LOG_LEVEL_DEBUG)
	else
		call log_message("Found a value on DM_INFO.", LOG_LEVEL_DEBUG)
	endif

	call log_message(build2("End RetrieveValueByKeyFromDmInfo(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)

	return(html_contents)
end ; end RetrieveValueByKeyFromDmInfo

/**************************************************************
; Exit Script
**************************************************************/

end
go
