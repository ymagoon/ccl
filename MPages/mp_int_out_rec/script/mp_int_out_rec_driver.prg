drop program mp_int_out_rec_driver:dba go
create program mp_int_out_rec_driver:dba
 
; Request
prompt
	"Output to File/Printer/MINE" = "MINE"
	,"Patient ID:"   = 0.0
	,"Encounter ID:" = 0.0
	,"Personnel ID:" = 0.0
	,"Provider Position Code:" = 0.0
	,"Patient Provider Relationship Code:" = 0.0
	,"Executable in Context:" = ""
	,"Static Content Location:" = ""
with OUTDEV, PAT_ID, ENCNTR_ID, PRSNL_ID, POS_CD, PPR_CD, APPNAME, STATIC_LOC

/**************************************************************
; DVDev DECLARED RECORDS
**************************************************************/
record criterion
(
	1 encntr_id           = f8
	1 executable          = vc
	1 locale_id           = vc
	1 person_id           = f8
	1 position_cd         = f8
	1 ppr_cd              = f8
	1 prsnl_id            = f8
	1 static_content      = vc
%i cclsource:status_block.inc
)

; Includes
%i cclsource:mp_script_logging.inc
set log_program_name = "mp_int_out_rec_driver"
 
/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/
declare GenerateHTML(NULL)        = NULL
declare Geti18nFileName(NULL)     = vc
declare GetLocaleId(NULL)         = vc
declare InitializeCriterion(NULL) = NULL
 
/**************************************************************
; Execution
**************************************************************/
call InitializeCriterion(NULL)
call GenerateHtml(NULL)
 
/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
subroutine GenerateHtml(NULL)
	call log_message("Begin GenerateHtml()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
 
	declare STATIC_CONTENT = vc with constant($STATIC_LOC), private
	declare i18nFile = vc with noconstant(""), private
	set i18nFile = Geti18nFileName(NULL)

	declare criterionJson = vc with noconstant("")
	set criterionJSON = replace(cnvtrectojson(criterion), "\", "\\", 0)
	set criterionJSON = replace(criterionJSON, "'", "\'", 0)

	; Generate HTML
	set _memory_reply_string = build2(
		^<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">^,
		^<?xml version="1.0" encoding="UTF-8" ?>^,
		^<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">^,
			^<head>^,
				^<meta http-equiv="Content-Type" content="APPLINK,XMLCCLREQUEST,MPAGES_EVENT,CCLLINK,CCLLINKPOPUP,^,
				^XMLCCLREQUESTOBJECTPOINTER,CCLNEWSESSIONWINDOW" name="discern"/>^,
				^<meta http-equiv="X-UA-Compatible" content="IE=10" />^,
				^<script type="text/javascript" src="^, STATIC_CONTENT, ^/js/util/jquery.min.js"></script>^,
				^<script type="text/javascript" src="^, STATIC_CONTENT, ^/js/util/blackbird.js"></script>^,
				^<script type="text/javascript" src="^, STATIC_CONTENT, ^/js/util/mp_core.js"></script>^,
				^<link type="text/css" rel="stylesheet" href="^, STATIC_CONTENT, ^/css/util/blackbird.css"/>^,
				^<script type="text/javascript" src="^, STATIC_CONTENT, ^/js/i18n/^, i18nFile, ^"></script>^,
				^<script type="text/javascript" src="^, STATIC_CONTENT, ^/js/Driver.js"></script>^,
				^<script type="text/javascript" src="^, STATIC_CONTENT, ^/js/Lib.js"></script>^,
				^<script type="text/javascript" src="^, STATIC_CONTENT, ^/js/Modal.js"></script>^,
				^<script type="text/javascript" src="^, STATIC_CONTENT, ^/js/TabButton.js"></script>^,
				^<script type="text/javascript" src="^, STATIC_CONTENT, ^/js/TabContent.js"></script>^,
				^<script type="text/javascript" src="^, STATIC_CONTENT, ^/js/Tab.js"></script>^,
				^<script type="text/javascript" src="^, STATIC_CONTENT, ^/js/TabsControl.js"></script>^,
				^<script type="text/javascript">^,
					^var CRITERION = ^, criterionJSON, ^;^,
					^CRITERION = CRITERION.CRITERION;^,
				^</script>^,
				^<link type="text/css" rel="stylesheet" href="^, STATIC_CONTENT, ^/css/Modal.css"/>^,
				^<link type="text/css" rel="stylesheet" href="^, STATIC_CONTENT, ^/css/TabButton.css"/>^,
				^<link type="text/css" rel="stylesheet" href="^, STATIC_CONTENT, ^/css/TabContent.css"/>^,
				^<link type="text/css" rel="stylesheet" href="^, STATIC_CONTENT, ^/css/TabsControl.css"/>^,
			^</head>^,
			^<body onload="App.driver();">^,
			^</body>^,
		^</html>^
	)
 
	call log_message(build2("Exit GenerateHtml(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end

subroutine Geti18nFileName(NULL)
	call log_message("Begin Geti18nFileName()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private

	declare LOCALE_ID = vc with noconstant(""), private
	set LOCALE_ID = GetLocaleId(NULL)
	declare LANG_ID = vc with constant(cnvtlower(substring(1,2,LOCALE_ID))), private
	declare LANG_LOCALE_ID = vc with constant(cnvtlower(substring(4,2,LOCALE_ID))), private
	declare i18n_file = vc with noconstant(""), private
	case(LANG_ID)
		of "en":
			if(LANG_LOCALE_ID = "au")
				set i18n_file = "i18n.en_AU"
			elseif(LANG_LOCALE_ID = "gb")
				set i18n_file = "i18n.en_GB"
			else
				set i18n_file = "i18n"
			endif
		of "es":
			set i18n_file = "i18n.es"
		of "de":
			set i18n_file = "i18n.de"
		of "fr":
			set i18n_file = "i18n.fr"
		of "pt":
			if(LANG_LOCALE_ID = "br")
				set i18n_file = "i18n.pt_br"
			endif
		else
			set i18n_file = "i18n"
	endcase
	set i18n_file = concat(i18n_file, ".js")

	call log_message(build2("Exit Geti18nFileName(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)

	return(i18n_file)
end

subroutine GetLocaleId(NULL)
	call log_message("Begin GetLocaleId()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
 
	declare locale = vc with noconstant(""), private
 
	set locale = cnvtupper(logical("CCL_LANG"))
	if(locale = "")
		set locale = cnvtupper(logical("LANG"))
	endif
 
	call log_message(build2("Exit GetLocaleId(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
	return(locale)
end

subroutine InitializeCriterion(NULL)
	call log_message("Begin InitializeCriterion()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
 
	; Get parameters.
	set criterion->prsnl_id = $PRSNL_ID
	set criterion->person_id = $PAT_ID
	set criterion->encntr_id = $ENCNTR_ID
	set criterion->position_cd = $POS_CD
	set criterion->ppr_cd = $PPR_CD
	set criterion->executable = $APPNAME
	set criterion->static_content = $STATIC_LOC
	set criterion->locale_id = GetLocaleId(NULL)
 
	call log_message(build2("Exit InitializeCriterion(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end
 
end
go
