drop program mp_dcp_pl_driver:dba go
create program mp_dcp_pl_driver:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Personnel Id:" = 0.0
	, "Provider Position Code:" = 0.0
	, "Executable in Context" = ""
	, "Static Content Location" = ""
 
with OUTDEV, PRSNL_ID, POS_CD, APPNAME, STATIC_LOC
 
/* DECLARE RECORDS ********************/
 
free record criterion
record criterion
(
	1 prsnl_id = f8
	1 prsnl_name = vc
	1 position_cd = f8
	1 app_name = vc
	1 static_content = vc
	1 help_file_local_ind = i2
	1 locale_id = vc
	1 utc_on = i2
	1 privileges[*]
      2 name                  = vc
      2 value                 = i2
)
 
free record plRequest
record plRequest
(
	1 owner_prsnl_id = f8
)
 
free record plReply
record plReply
(
	1 patient_lists[*]
		2 patient_list_id = f8
		2 patient_list_name = vc
		2 owner_id = f8
		2 query_type_cd = f8
		2 query_type_cd_meaning = vc
		2 arguments[*]
			3 argument_name = vc
			3 argument_value = vc
			3 parent_entity_name = vc
			3 parent_entity_id = f8
		2 filters[*]
			3 argument_name = vc
			3 argument_value = vc
			3 parent_entity_name = vc
			3 parent_entity_id = f8
		2 proxies[*]
			3 prsnl_id = f8
			3 prsnl_group_id = f8
			3 prsnl_name = vc
			3 prsnl_group_name = vc
			3 list_access_cd = f8
			3 beg_effective_dt_tm = dq8
			3 end_effective_dt_tm = dq8
		; 3 sort[*]
%i cclsource:status_block.inc
)
%i cclsource:mp_tdm_priv_utils.inc
%i cclsource:mp_script_logging.inc
set modify maxvarlen 52428800
call log_message("In mp_dcp_pl_driver", LOG_LEVEL_DEBUG)
 
/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/
declare RetrievePatientLists(NULL) = NULL
declare PopulateRequest(dummy) = null
declare GenerateHTML(dummy) = null
declare replyFailure(NULL) = NULL
declare GetPrivileges (NULL) = NULL
 
/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
declare fail_operation = vc
declare failed = i2 with NOCONSTANT(0)
declare dwl_criterion = vc with protect, NOCONSTANT("")
declare dwl_patientlists = vc with protect, NOCONSTANT("")
set ERRMSG =  FILLSTRING(132," ")
set ERRCODE = error(ERRMSG,1)
 
/**************************************************************
; Execution
**************************************************************/
 
select into "nl:"
	d.info_char
from dm_info d
where d.info_domain = "DATA MANAGEMENT"
and d.info_name = "HELP LOCATION"
detail
	criterion->help_file_local_ind = 1
with nocounter
 
set ERRCODE = ERROR(ERRMSG,0)
if(ERRCODE != 0)
   set failed = 1
   set fail_operation = "Domain select"
   call replyFailure("SELECT")
endif
 
set criterion->prsnl_id = $PRSNL_ID
set criterion->static_content = $STATIC_LOC
set criterion->position_cd = $POS_CD
set criterion->app_name = $APPNAME
set criterion->locale_id = ""
set criterion->utc_on = CURUTC
 
select into "nl:"
from prsnl p
where p.person_id = $PRSNL_ID
detail
	criterion->prsnl_name = p.name_full_formatted
with nocounter
 
if(ERRCODE != 0)
   set failed = 1
   set fail_operation = "Prsnl name select"
   call replyFailure("SELECT")
endif
 
declare localeFileName = vc with protect, noconstant("i18n")
;Get the locale
declare LOCALE = vc with protect, noconstant("")
declare LANG_ID = vc with noconstant(""), protect
declare LANG_LOCALE_ID = vc with noconstant(""), protect
declare LOCALE_FILE = vc with noconstant(""), protect
 
set LOCALE = cnvtupper(logical("CCL_LANG"))
if (LOCALE = "")
	set LOCALE = cnvtupper(logical("LANG"))
endif
 
set criterion->locale_id = LOCALE
 
set LANG_ID = cnvtlower(substring(1,2,LOCALE))
	set LANG_LOCALE_ID = cnvtlower(substring(4,2,LOCALE))
 
	case (LANG_ID)
		of "en":
			if (LANG_LOCALE_ID = "au")
				set localeFileName = "i18n_en_AU"
			elseif (LANG_LOCALE_ID = "gb")
				set localeFileName = "i18n_en_GB"
			else
				set localeFileName = "i18n"
			endif
		of "es":
			set localeFileName = "i18n_es"
		of "de":
			set localeFileName = "i18n_de"
		of "fr":
			set localeFileName = "i18n_fr"
		of "pt":
		    if (LANG_LOCALE_ID = "br")
		        set localeFileName = "i18n_pt_br"
		    endif
		else
			set localeFileName = "i18n"
	endcase
 
call RetrievePatientLists(NULL)
call GetPrivileges(NULL)
call GenerateHTML(NULL)
 
go to exit_script
 
/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
 
subroutine RetrievePatientLists(NULL)
	call log_message("Begin RetrievePatientLists()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
 
	set plRequest->owner_prsnl_id = criterion->prsnl_id
	execute mp_dcp_retrieve_patient_lists with replace (REQUEST,plRequest),replace(REPLY,plReply)
	if(plReply->status_data.status = "F")
		set stat = moverec(plReply->status_data,reply->status_data)
		return
	endif
	;TODO: Error Handling
 
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "RetrievePatientLists"
       call replyFailure("")
    endif
 
	call log_message(build2("Exit RetrievePatientLists(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end
 
subroutine GenerateHTML(null)
	call log_message("Begin GenerateHTML()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
 
	declare _CRLF = vc with constant( build2(char(13),char(10)))
	declare static_loc = vc with constant(trim($STATIC_LOC,3))
	call echorecord(criterion)

	; Replacing single '\' with '\\' and "'" with "\'" to allow JSON parsing without any errors. 
	;'\' is not allowed in json so we need to escape it with '\\'.
	set dwl_criterion = replace(cnvtrectojson(criterion), "\", "\\", 0)
	set dwl_criterion = replace(dwl_criterion, "'", "\'", 0)
	set dwl_patientlists = replace(cnvtrectojson(plReply), "\", "\\", 0)
	set dwl_patientlists = replace(dwl_patientlists, "'", "\'", 0)

	set _memory_reply_string = build2(
			^<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-\strict.dtd">^,
			^<?xml version="1.0" encoding="UTF-8" ?>^,
			^<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">^,
			^<head>^,
			^<meta http-equiv="Content-Type" content="APPLINK,XMLCCLREQUEST,MPAGES_EVENT,CCLLINK,CCLLINKPOPUP,\
XMLCCLREQUESTOBJECTPOINTER,CCLNEWSESSIONWINDOW" name="discern"/><meta http-equiv="X-UA-Compatible" content="IE=10"/>^,
			^<script type="text/javascript">^, _CRLF,
			^	var m_criterionJSON = '^, dwl_criterion, ^';^, _CRLF,
			^	var m_patientlists = '^, dwl_patientlists, ^';^, _CRLF,
			^	var CERN_static_content = "^, static_loc, ^";^, _CRLF,
			^</script>^,
			^<script type="text/javascript" src="^, static_loc, ^\js\i18n\^,localeFileName,^.js"></script>^,
			^<script type="text/javascript" src="^, static_loc, ^\js\dcp_pl_namespaces.js"></script>^,
			^<script type="text/javascript" src="^, static_loc, ^\js\utils\mp_json_parse.js"></script>^,
			^<script type="text/javascript" src="^, static_loc, ^\js\utils\healthe_library.js"></script>^,
			^<script type="text/javascript" src="^, static_loc, ^\js\utils\jquery\jquery-1.8.3.min.js"></script>^,
			^<script type="text/javascript" src="^, static_loc, ^\js\utils\lodash.escape\index.js"></script>^,
			^<script type="text/javascript" src="^, static_loc, ^\js\utils\date.format.js"></script>^,
			^<script type="text/javascript" src="^, static_loc, ^\js\utils\utils.js"></script>^,
			^<script type="text/javascript" src="^, static_loc, ^\js\utils\element-resize-detector.min.js"></script>^,
			^<script type="text/javascript" src="^, static_loc, ^\js\utils\component\progress_state\dcp_pl_progress_state.js"></script>^,
			^<script type="text/javascript" src="^, static_loc, ^\js\utils\component\progress_indicator\\
dcp_pl_progress_indicator.js"></script>^,
			^<script type="text/javascript" src="^, static_loc, ^\js\utils\component\progress_indicator_bar\\
dcp_pl_progress_indicator_bar.js"></script>^,
			^<script type="text/javascript" src="^, static_loc, ^\js\utils\component\header\\
dcp_pl_header.js"></script>^,
			^<script type="text/javascript" src="^, static_loc, ^\js\utils\component\container\\
dcp_pl_container.js"></script>^,
			^<script type="text/javascript" src="^, static_loc, ^\js\utils\component\container\summary_dialog\\
dcp_pl_summary_dialog.js"></script>^,
			^<script type="text/javascript" src="^, static_loc, ^\js\core\mp_component_defs.js"></script>^,
		 	^<script type="text/javascript" src="^, static_loc, ^\js\core\mp_core.js"></script>^,
			^<script type="text/javascript" src="^, static_loc, ^\js\dcp_pl_driver.js"></script>^,
			^<script type="text/javascript" src="^, static_loc, ^\js\dcp_pl_controller.js"></script>^,
			^<script type="text/javascript" src="^, static_loc, ^\js\dcp_pl_patient_controller.js"></script>^,
			^<script type="text/javascript" src="^, static_loc, ^\js\dcp_pl_filter.js"></script>^,
			^<script type="text/javascript" src="^, static_loc, ^\js\dcp_pl_search.js"></script>^,
			^<script type="text/javascript" src="^, static_loc, ^\js\dcp_pl_worklist.js"></script>^,
			^<script type="text/javascript" src="^, static_loc, ^\js\dcp_pl_expanded_view.js"></script>^,
			^<script type="text/javascript" src="^, static_loc, ^\js\dcp_pl_gen_comm.js"></script>^,
			^<script type="text/javascript" src="^, static_loc, ^\js\dcp_pl_popover.js"></script>^,
			^<script type="text/javascript" src="^, static_loc, ^\js\utils\component\address_popover\dcp_pl_address_popover.js"></script>^,
			^<script type="text/javascript" src="^, static_loc, ^\js\utils\CERN_Platform.js"></script>^,
			^<script type="text/javascript" src="^, static_loc, ^\js\utils\ckeditor\ckeditor-core.js"></script>^,
			^<script type="text/javascript" src="^, static_loc, ^\js\utils\jquery\ui\widgets\tooltip\jquery-ui.min.js"></script>^,
			^<script type="text/javascript" src="^, static_loc, ^\js\utils\uuid.js"></script>^,
			^<script type="text/javascript" src="^, static_loc, ^\js\dcp_pl_custom_blackbird.js"></script>^,
			^<link type="text/css" rel="stylesheet" href="^, static_loc, ^\js\utils\ckeditor\css\editor-common.css"/>^,
			^<link type="text/css" rel="stylesheet" href="^, static_loc, ^\js\utils\ckeditor\css\dyndochover.css"/>^,
			^<link type="text/css" rel="stylesheet" href="^, static_loc, ^\css\dcp_pl_worklist.css"/>^,
			^<link type="text/css" rel="stylesheet" href="^, static_loc, ^\css\acm_filter.css"/>^,
			^<link type="text/css" rel="stylesheet" href="^, static_loc, ^\css\dcp_pl_search.css"/>^,
			^<link type="text/css" rel="stylesheet" href="^, static_loc, ^\css\dcp_pl_expanded_view.css"/>^,
			^<link type="text/css" rel="stylesheet" href="^, static_loc, ^\css\dcp_pl_controller.css"/>^,
			^<link type="text/css" rel="stylesheet" href="^, static_loc, ^\css\dcp_pl_gen_comm.css"/>^,
			^<link type="text/css" rel="stylesheet" href="^, static_loc, ^\css\dcp_pl_popover.css"/>^,
			^<link type="text/css" rel="stylesheet" href="^, static_loc, ^\css\utils\component\address_popover\\
dcp_pl_address_popover.css"/>^,
			^<link type="text/css" rel="stylesheet" href="^, static_loc, ^\css\blackbird.css"/>^,
			^<link type="text/css" rel="stylesheet" href="^, static_loc, ^\css\dcp_pl_custom_blackbird.css"/>^,
			^<link type="text/css" rel="stylesheet" href="^, static_loc, ^\css\utils\component\progress_indicator\\
dcp_pl_progress_indicator.css"/>^,
			^<link type="text/css" rel="stylesheet" href="^, static_loc, ^\css\utils\component\progress_indicator_bar\\
dcp_pl_progress_indicator_bar.css"/>^,
			^<link type="text/css" rel="stylesheet" href="^, static_loc, ^\css\utils\component\container\summary_dialog\\
dcp_pl_summary_dialog.css"/>^,
			^<link type="text/css" rel="stylesheet" href="^, static_loc, ^\css\vendor\jquery\ui\widgets\tooltip\\
jquery-ui.min.css"/>^,
			^</head>^, _CRLF,
			^<body onload="RenderDCPPatientList();">^,
			^</body>^,
			^</html>^
		)
 
	call log_message(build2("Exit GenerateHTML(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end

subroutine GetPrivileges(NULL)
  declare ADD_MEDIA_CD  = f8 with constant(uar_get_code_by("MEANING", 6016, "ADDMEDIA")), private
  declare priv_count    = i4 with noconstant(0), private
      
  call alterlist(priv_request->privilege_criteria.privileges, 1)
  set priv_request->privilege_criteria.privileges[1].privilege_cd = ADD_MEDIA_CD

  call GetPrivilegesByCodes(criterion->prsnl_id, 0.0)

  set priv_count = size(priv_reply->privileges, 5)
  if (priv_count > 0)
    call alterlist(criterion->privileges, 1)
    set criterion->privileges[1].name = "ADDMEDIA"
    set criterion->privileges[1].value = IsPrivilegesGranted(ADD_MEDIA_CD)
  endif   
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
 
     call log_message(build2("Exit replyFailure(), Elapsed time:",
       cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
 
     go to exit_script
end
 
 
/******************************************************************************/
/*      Exit Script                                                           */
/******************************************************************************/
# exit_script
 
 
end
go
 
 
