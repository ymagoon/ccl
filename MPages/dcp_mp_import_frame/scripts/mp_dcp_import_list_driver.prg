/*************************************************************************
  *                                                                      *
  *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
  *                              Technology, Inc.                        *
  *       Revision      (c) 1984-1997 Cerner Corporation                 *
  *                                                                      *
  *  Cerner (R) Proprietary Rights Notice:  All rights reserved.         *
  *  This material contains the valuable properties and trade secrets of *
  *  Cerner Corporation of Kansas City, Missouri, United States of       *
  *  America (Cerner), embodying substantial creative efforts and        *
  *  confidential information, ideas and expressions, no part of which   *
  *  may be reproduced or transmitted in any form or by any means, or    *
  *  retained in any storage or retrieval system without the express     *
  *  written permission of Cerner.                                       *
  *                                                                      *
  *  Cerner is a registered mark of Cerner Corporation.                  *
  *                                                                      *
  ~BE~*******************************************************************/
/*************************************************************************
 
        Source file name:       mp_dcp_import_list_driver.prg
        Object name:            mp_dcp_import_list_driver
        Request #:              N/A
 
        Product:                PowerWorks IP
        Product Team:           PowerWorks IP
 
        Program purpose:        Outputs data in html format and calls javascript
 
        Tables read:            None
 
        Tables updated:         None
 
        Executing from:         Power Chart
 
        Special Notes:          Build in Prefmaint.exe:
                               "mine", $USR_PERSONID$,  $USR_PositionCd$,
                               , "$APP_AppName$", "$DEV_Location$", "STATICCONTENTLOCATION", "CATEGORY_MEAN"
 
***************************************************************************************/
;~DB~**********************************************************************************
;    *                   GENERATED MODIFICATION CONTROL LOG                           *
;    **********************************************************************************
;    *                                                                                *
;    *Mod Date     Engineer            Feature    Comment                             *
;    *--- -------- ------------------- -------    ----------------------------------- *
;    *000 02/17/11 Shaun Franken       000000     Initial release                     *
;~DE~**********************************************************************************
;~END~ ************************  END OF ALL MODCONTROL BLOCKS  ************************
drop program mp_dcp_import_list_driver:dba go
create program mp_dcp_import_list_driver:dba
 
/* REQUEST ***************************************************************************************/
prompt
        "Output to File/Printer/MINE" = "MINE"
        ,"Personnel ID:" = 0.00
        ,"Provider Position Code:" = 0.00
        ,"Executable in Context:" = ""
        ,"Device Location:" = ""
        ,"Static Content Location:" = ""
with outdev, personnelid, positionCode, executableInContext , deviceLocation, staticContentLocation
;execute mp_dcp_import_list_driver,55772264.0,2192727847.0,"","","\\\\filesrvwhq\\provide\\User\\SM017997\\ACM\\mp-dcp-import-frame"


/* REPLY *****************************************************************************************/
 
/* DECLARE RECORDS *******************************************************************************/
free record criterion
record criterion
(
	1 prsnl_id = f8
	1 executable = vc
	1 static_content = vc
	1 position_cd = f8
	1 help_file_local_ind = i2
	1 category_mean = vc
	1 locale_id = vc
	1 device_location = vc
	1 help_link = vc
	1 import_process_prg = vc
	1 import_access_ind = i2
	1 manage_access_ind = i2
	1 manage_add_ind	= i2
	1 manage_del_ind	= i2
	1 def_cnt		= i4
	1 def[*]
		2 def_id	= f8
		2 def_disp	= vc
		2 def_disp_key = vc
;		2 def_mean	= vc
		2 def_type	= i2 ;1 = Registry, 2 = Condition, 3 = Measure
	1 logical_domain_id		= f8
	1 logical_domain_ind	= i2
	1 org_list[*]
		2 org_name			= vc
		2 org_id			= f8
		2 loc_list[*]
			3 loc_name		= vc
			3 loc_cd		= f8
%i cclsource:status_block.inc
)
 
 
/* INCLUDES **************************************************************************************/
%i cclsource:mp_common.inc
%i cclsource:mp_script_logging.inc
set log_program_name = "MP_DCP_IMPORT_LIST_DRIVER"

;******************************************************************************
;CODE TO FETCH THE LOCALE AND THEN STORE THE LOCALE LANGUAGE
;****************************************************************************** 
 
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
 
	;set criterion->locale_id = LOCALE
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
		else
			set localeFileName = "i18n"
	endcase 
	
set criterion->locale_id = localeFileName
 
/* DECLARE SUBROUTINES ***************************************************************************/
declare GetBedrockSettings(PARENTID = f8) = null with protect
declare GenerateStaticContentReqs(null) = null with protect
declare GeneratePageHTML(null) = vc with protect
declare GatherLocations(PERSID = f8) = null with protect, copy
declare CheckLogicalDomain(PRSNL_ID = f8)	= null
declare GetRefDefinitions(PRSNL_ID = f8)	= null
 
/* DECLARE VARIABLES *****************************************************************************/
declare vcJSReqs = vc with protect, noconstant("")
declare vcCSSReqs = vc with protect, noconstant("")
declare bbCSSReqs = vc with protect, noconstant("")
declare bbJSReqs = vc with protect, noconstant("")
declare vcLocaleReqs = vc with protect, noconstant("")
declare vcJSRenderFunc = vc with protect, noconstant("")
declare vcPageLayout = vc with protect, noconstant("")
declare vcStaticContent  = vc with protect, noconstant( "" )
declare lStat = i4 with protect, noconstant( 0 )
declare z = i4 with private, noconstant(0)
declare position_bedrock_settings = i2
declare 222_FAC			= f8 with public, constant(uar_get_code_by_cki("CKI.CODEVALUE!2844"))
/* BEGIN PROGRAM *********************************************************************************/
set criterion->prsnl_id = $PERSONNELID
set criterion->executable = $EXECUTABLEINCONTEXT
set criterion->position_cd = $POSITIONCODE
set criterion->locale_id = ""
set criterion->static_content = $STATICCONTENTLOCATION
set criterion->device_location = $DEVICELOCATION
set criterion->help_link = "https://wiki.ucern.com/plugins/servlet/helpServlet?eas=registrylistimport&culture=en-US&release=2012.01"

;default settings to blank
set criterion->import_access_ind = 0
set criterion->manage_access_ind = 0
set criterion->manage_add_ind = 0
set criterion->manage_del_ind = 0 

call GetBedrockSettings($POSITIONCODE)
if(position_bedrock_settings = 0)
	call GetBedrockSettings(0.00)
endif
 
 
call CheckLogicalDomain(criterion->prsnl_id)
call GetRefDefinitions(null)
call GatherLocations($PERSONNELID)
call GenerateStaticContentReqs(null)
call GeneratePageHTML(null)
 
 
/* SUBROUTINES ***********************************************************************************/
subroutine GetBedrockSettings(PARENTID)
	;set criterion->import_process_prg = "mp_dcp_list_import"
 
	call log_message("In GetBedrockSettings()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(cnvtdatetime(curdate, curtime3)), private
 
	set position_bedrock_settings = 0
	select into "nl:"
	from
        br_datamart_category bdc
		, br_datamart_report   br
		, br_datamart_report_filter_r   bfr
		, br_datamart_filter   bf
		, br_datamart_value   bv
		, br_datamart_flex   bx
 
	plan bdc where bdc.category_mean = "MP_DCP_IMPORT_VIEW"
	join br where br.br_datamart_category_id = bdc.br_datamart_category_id
			and br.report_mean = "MP_DCP_IMPORT_VIEW_PAGE"
	join bfr where bfr.br_datamart_report_id = br.br_datamart_report_id
	join bf where bf.br_datamart_filter_id = bfr.br_datamart_filter_id
	join bv where bv.br_datamart_category_id = bf.br_datamart_category_id
			and bv.br_datamart_filter_id = bf.br_datamart_filter_id
	join bx where bx.br_datamart_flex_id = bv.br_datamart_flex_id
	and bx.parent_entity_id = PARENTID
	order by bf.filter_mean, bv.value_seq
	detail
		case (bf.filter_mean)
			of "MP_DCP_IMPORT_IMPORT_ACCESS" : criterion->import_access_ind = cnvtint(trim(bv.freetext_desc))
			of "MP_DCP_IMPORT_MANAGE_ACCESS" : criterion->manage_access_ind = cnvtint(trim(bv.freetext_desc))
			of "MP_DCP_IMPORT_ADD_ACCESS" : criterion->manage_add_ind = cnvtint(trim(bv.freetext_desc))
			of "MP_DCP_IMPORT_DEL_ACCESS" : criterion->manage_del_ind = cnvtint(trim(bv.freetext_desc))
		endcase
	with nocounter
	if(cnvtint(curqual) > 0)
		set position_bedrock_settings = 1
	endif
		
	call ERROR_AND_ZERO_CHECK_REC(curqual, "BEDROCK SETTINGS", "GetBedrockSettings", 1, 0, criterion)
	call log_message(build("Exit GetBedrockSettings(), Elapsed time in seconds:",
	datetimediff(cnvtdatetime(curdate,curtime3),BEGIN_DATE_TIME, 5)), LOG_LEVEL_DEBUG)
end ;GetBedrockSettings
 
 
subroutine CheckLogicalDomain(PRSNL_ID)

	call log_message("In CheckLogicalDomain()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(cnvtdatetime(curdate, curtime3)), private
 
	select into "nl:"
	from
	prsnl pr
	plan pr
		where pr.person_id = PRSNL_ID
	head pr.person_id
  	  		; Check if logical_domain_id exists in prsnl table.  If it doesn't, use 0.
        if (CHECKDIC("PRSNL.LOGICAL_DOMAIN_ID","A",0) > 0 )
            criterion->logical_domain_id = pr.logical_domain_id
            criterion->logical_domain_ind = TRUE
        else
            criterion->logical_domain_id = 0.0
            criterion->logical_domain_ind = FALSE
        endif
 	with nocounter
 	
 	call ERROR_AND_ZERO_CHECK_REC(curqual, "MP_DCP_IMPORT_LIST_DRIVER", "CheckLogicalDomain", 1, 0, criterion)
 
    call log_message(build("Exit CheckLogicalDomain(), Elapsed time in seconds:",
	datetimediff(cnvtdatetime(curdate,curtime3),BEGIN_DATE_TIME, 5)), LOG_LEVEL_DEBUG)
end ;CheckLogicalDomain
 
subroutine GetRefDefinitions(null)
	call log_message("In GetRefDefinitions()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(cnvtdatetime(curdate, curtime3)), private
 
	select into "nl:"
	from
	ac_class_def acd
	Plan acd
		where acd.logical_domain_id = criterion->logical_domain_id
        and acd.class_type_flag in (1,2)
		and acd.active_ind = 1
		and acd.begin_effective_dt_tm <= cnvtdatetime(curdate,curtime)
		and acd.end_effective_dt_tm > cnvtdatetime(curdate,curtime)
	order acd.class_type_flag,acd.class_display_name_key
	head report
		def_cnt = 0
	detail
		def_cnt = def_cnt + 1
 
		if(mod(def_cnt,100) = 1)
			stat = alterlist(criterion->def,def_cnt + 99)
		endif
 
		criterion->def[def_cnt].def_id   		= acd.ac_class_def_id
		criterion->def[def_cnt].def_disp 		= acd.class_display_name
		criterion->def[def_cnt].def_disp_key 	= acd.class_display_name_key
		criterion->def[def_cnt].def_type 		= acd.class_type_flag
 
	foot report
		criterion->def_cnt = def_cnt
		stat = alterlist(criterion->def,criterion->def_cnt)
	with nocounter
 
 	call ERROR_AND_ZERO_CHECK_REC(curqual, "MP_DCP_IMPORT_LIST_DRIVER", "GetRefDefinitions", 1, 0, criterion)
 
    call log_message(build("Exit GetRefDefinitions(), Elapsed time in seconds:",
	datetimediff(cnvtdatetime(curdate,curtime3),BEGIN_DATE_TIME, 5)), LOG_LEVEL_DEBUG)
end ;GetRefDefinitions
 
SUBROUTINE GatherLocations(PERSID)
	call log_message("In GatherLocations()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(cnvtdatetime(curdate, curtime3)), private
 
	SELECT DISTINCT
		location_cd = l3.location_cd
		, location = uar_get_code_description (l3.location_cd)
	from
		prsnl_org_reltn   por
		, organization   org
		, location   l
		, location_group   lg
		, location   l2
		, location_group   lg2
		, location   l3
	plan por where por.person_id =    PERSID
		and por.beg_effective_dt_tm < cnvtdatetime(curdate, curtime3)
     	and por.end_effective_dt_tm >= cnvtdatetime(curdate, curtime3)
     	and por.active_ind = 1
	join org where org.organization_id = por.organization_id
     	and org.beg_effective_dt_tm < cnvtdatetime(curdate, curtime3)
     	and org.end_effective_dt_tm >= cnvtdatetime(curdate, curtime3)
     	and org.active_ind = 1
	join l
     	where l.organization_id = org.organization_id
     	and l.location_type_cd = 222_FAC
     	and l.beg_effective_dt_tm < cnvtdatetime(curdate, curtime3)
     	and l.end_effective_dt_tm >= cnvtdatetime(curdate, curtime3)
     	and l.active_ind = 1
	join lg
    	where lg.parent_loc_cd=l.location_cd
    	and lg.root_loc_cd = 0
    	and lg.beg_effective_dt_tm < cnvtdatetime(curdate, curtime3)
    	and lg.end_effective_dt_tm >= cnvtdatetime(curdate, curtime3)
    	and lg.active_ind = 1
	join l2
    	where l2.location_cd = lg.child_loc_cd
     	and l2.beg_effective_dt_tm < cnvtdatetime(curdate, curtime3)
     	and l2.end_effective_dt_tm >= cnvtdatetime(curdate, curtime3)
     	and l2.active_ind = 1
	join lg2
    	where lg.child_loc_cd = lg2.parent_loc_cd
    	and lg2.root_loc_cd = 0
    	and lg2.beg_effective_dt_tm < cnvtdatetime(curdate, curtime3)
    	and lg2.end_effective_dt_tm >= cnvtdatetime(curdate, curtime3)
    	and lg2.active_ind = 1
	join l3
    	where l3.location_cd = lg2.child_loc_cd
    	and l3.location_type_cd in 
		(select cv.code_value from code_value cv where cv.cdf_meaning in ("AMBULATORY","NURSEUNIT","ANCILSURG"))
    	and l3.beg_effective_dt_tm < cnvtdatetime(curdate, curtime3)
     	and l3.end_effective_dt_tm >= cnvtdatetime(curdate, curtime3)
     	and l3.active_ind = 1
	ORDER BY
		 org.org_name, location
	head report
		org_cnt = 0
		loc_cnt = 0
	head org.org_name
		loc_cnt = 0
		org_cnt = org_cnt + 1
		if(mod(org_cnt,10)=1)
			stat = alterlist(criterion->org_list,org_cnt+9)
		endif
		criterion->org_list[org_cnt].org_id = org.organization_id
		criterion->org_list[org_cnt].org_name = trim(org.org_name)
	detail
	
		loc_cnt = loc_cnt + 1
		if(mod(loc_cnt,10)=1)
			stat = alterlist(criterion->org_list[org_cnt].loc_list,loc_cnt+9)
		endif
	
		criterion->org_list[org_cnt].loc_list[loc_cnt].loc_name = replace(trim(location),concat(char(13),char(10)), " ", 0)
		criterion->org_list[org_cnt].loc_list[loc_cnt].loc_cd = l3.location_cd
	foot org.org_name
		stat = alterlist(criterion->org_list[org_cnt].loc_list,loc_cnt)
	foot report
		stat = alterlist(criterion->org_list,org_cnt)
	with nocounter
 
 	call ERROR_AND_ZERO_CHECK_REC(curqual, "MP_DCP_IMPORT_LIST_DRIVER", "GatherLocations", 1, 0, criterion)
 
 	call log_message(build("Exit GatherLocations(), Elapsed time in seconds:",
	datetimediff(cnvtdatetime(curdate,curtime3),BEGIN_DATE_TIME, 5)), LOG_LEVEL_DEBUG)
end ;GatherLocations(0)
 
subroutine GenerateStaticContentReqs(null)
	call log_message("In GenerateStaticContentReqs()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(cnvtdatetime(curdate, curtime3)), private
 
	;Load Defaults - Case statement can overwrite if different
	set vcJSReqs = build2(^<script type="text/javascript" src="^,
								     criterion->static_content, ^\js\mp_dcp_import_frame.js"></script>^)
	set vcCSSReqs = build2(^<link rel="stylesheet" type="text/css" href="^,
								   criterion->static_content, ^\css\mp_dcp_import_frame.css" />^)
	set bbCSSReqs = build2(^<link rel="stylesheet" type="text/css" href="^,
								   criterion->static_content, ^\css\blackbird.css" />^)
	set bbJSReqs = build2(^<script type="text/javascript" src="^,
								     criterion->static_content, ^\js\blackbird.js"></script>^)
 	set vcLocaleReqs = build2(^<script></script><script type="text/javascript" src="^,
 	criterion->static_content,^\js\i18n\^,localeFileName,^.js"></script>^) 
	;We only want the info for the default view
	set vcJSRenderFunc = "javascript:RenderImportFrame();"
 
; 	if (validate(debug_ind, 0) = 1)
 		call echo(build2("js requirements: ", vcJSReqs))
; 	endif
 
	call log_message(build("Exit GenerateStaticContentReqs(), Elapsed time in seconds:",
		datetimediff(cnvtdatetime(curdate,curtime3),BEGIN_DATE_TIME, 5)), LOG_LEVEL_DEBUG)
end ;GenerateStaticContentReqs
 
 
subroutine GeneratePageHTML(null)
	call log_message("In GeneratePageHTML()", LOG_LEVEL_DEBUG)
 	declare BEGIN_DATE_TIME = dq8 with constant(cnvtdatetime(curdate, curtime3)), private
 
		set _memory_reply_string = build2(
		^<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-\strict.dtd">^,
		^<?xml version="1.0" encoding="UTF-8" ?>^,
		^<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">^,
		^<head>^,
		^	<meta http-equiv="Content-Type" ^,
		^content="APPLINK,CCLLINK,MPAGES_EVENT,XMLCCLREQUEST,CCLLINKPOPUP,CCLNEWSESSIONWINDOW" name="discern"/>^,
		vcLocaleReqs,
		vcJSReqs,
		vcCSSReqs,
		bbCSSReqs,
		bbJSReqs,
		^	<script type="text/javascript">^,
		^	var m_criterionJSON = '^, replace(cnvtrectojson(criterion),"'","\'"), ^';^,
		^	var CERN_static_content = "^, criterion->static_content, ^";^)
	    set _memory_reply_string = build2(_memory_reply_string,
		^	</script>^,
		^</head>^
		)
 
		set _memory_reply_string = build2(_memory_reply_string,
		^<body onload="^, vcJSRenderFunc, ^">^,
		^<div id="mp_dcp_import_frame_head"></div>^,
		^<div id="mp_dcp_import_select_content"></div>^);,
		;^<div id="mp_dcp_import_status_bar"></div>^)
 
		set _memory_reply_string = build2(_memory_reply_string,
		^</body>^,
		^</html>^
		)
 		call echo(_memory_reply_string)
	call log_message(build("Exit GeneratePageHTML(), Elapsed time in seconds:",
	datetimediff(cnvtdatetime(curdate,curtime3),BEGIN_DATE_TIME, 5)), LOG_LEVEL_DEBUG)
 
end ;GeneratePageHTML
 
 
#exit_script
; write all contents to output
; 	if (validate(debug_ind, 0) = 1)
		call echorecord(criterion)
;	endif
 
end
go
SET TRACE NOTRANSLATELOCK GO
