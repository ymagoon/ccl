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
          Date Written:       09/06/19
          Source file name:   snsro_version_validation.prg
          Object name:        vigilanz_version_validation
          Program purpose:    Run versions on each node through mpages webservice
          Executing from:     DVDev
 ***********************************************************************
                   GENERATED MODIFICATION CONTROL LOG
 ***********************************************************************
 Mod Date		Engineer	Comment
 -----------------------------------------------------------------------
 000 09/06/19 	RJC			Initial Write
 001 09/17/19	RJC			Added prefix option for multi-vendor support
 ***********************************************************************/
drop program vigilanz_version_validation go
create program vigilanz_version_validation
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "UserName" = ""       ;Required
		, "Password (This will show as plain text. Turn of screen sharing!)" = ""		;Required
		, "Debug Flag" = 0		;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV,USERNAME,PWD,DEBUG_FLAG
 
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
;3011006 - EKS_GET_SYSINFO
free record 3011006_rep
record 3011006_rep (
	1 operating_system = c3
	1 curuser_name = vc
	1 curuser_group = i2
	1 ccluser_group = i2
	1 hnam_location = vc
	1 cclrev = i4
	1 cclrevminor = i4
	1 cclrevminor2 = i4
	1 status_data
		2 status = c1
		2 subeventstatus [1 ]
			3 operationname = c25
			3 operationstatus = c1
			3 targetobjectname = c25
			3 targetobjectvalue = vc
	1 hosts [* ]
		2 host_name = vc
	1 v500_read_dba = i2
	1 compile_mode_rdb = i2
)
 
; Response from versions call
free record versions_reply_out
record versions_reply_out (
  1 versions [*]
    2 object_name = vc
    2 filename = vc
    2 datetime = dq8
    2 username = vc
    2 user = vc
    2 group = i1
    2 version = vc
  1 audit
		2 user_id				= f8
		2 user_firstname		= vc
		2 user_lastname			= vc
		2 patient_id			= f8
		2 patient_firstname		= vc
		2 patient_lastname		= vc
	    2 service_version		= vc
	    2 query_execute_time	= vc
	    2 query_execute_units	= vc
  1 status_data
    2 status 					= c1
    2 subeventstatus[1]
      3 OperationName 			= c25
      3 OperationStatus 		= c1
      3 TargetObjectName 		= c25
      3 TargetObjectValue 		= vc
      3 Code 					= c4
      3 Description 			= vc
)
 
; Final reply
free record final_reply_out
record final_reply_out (
	1 list[*]
		2 object_name 	= vc
		2 nodes[*]
			3 node 		= vc
			3 version 	= vc
	1 status_msg = vc
)
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Input
declare sUsername					= vc with protect, noconstant("")
declare sPassword					= vc with protect, noconstant("")
declare iDebugFlag					= i2 with protect, noconstant(0)
declare sPrefix						= vc with protect, noconstant("")
 
;Other
declare sAuth						= vc with protect, noconstant("")
declare iHostSize					= i4 with protect, noconstant(0)
declare hHeader         			= i4 with protect, noconstant(0)
declare hCustom						= i4 with protect, noconstant(0)
declare hHttpMsg           			= i4 with protect, noconstant(0)
declare hHttpReq       				= i4 with protect, noconstant(0)
declare hHttpRep           			= i4 with protect, noconstant(0)
declare nHttpStatus        			= i4 with protect, noconstant(0)
declare sResponsJson				= gvc with protect, noconstant("")
declare sURL						= vc with protect, noconstant("")
 
; Constants
declare c_error_handler_name 		= vc with protect, constant("VERSION_VALIDATION")
declare c_domain					= vc with protect, constant(curdomain)
declare c_http_success              = i4  with protect, constant(200)
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
;Input
set sUsername						= trim($USERNAME, 3)
set sPassword						= trim($PWD,3)
set iDebugFlag						= cnvtint($DEBUG_FLAG)
set sPrefix							= trim("vigilanz",3)
if(replace(sPrefix,"_","") = "PREFIX")
	set sPrefix = "snsro"
endif
 
;Other
set sAuth 							= build2("Basic ",base64_encode(build(sUsername,"@",c_domain,":",sPassword)))
 
if(iDebugFlag > 0)
	call echo(build("sUserName  ->", sUserName))
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetSysInfo(null)			= null	with protect ;3011006 - EKS_GET_SYSINFO
declare CallVersions(host = vc)		= null with protect
 
declare uar_SrvGetAsIs(p1=i4(value), p2=vc(ref), p3=vc(ref), p4=i4(value)) = i4 with image_axp="srvrtl"
			,image_aix="libsrv.a(libsrv.o)",uar="SrvGetAsIs", persist
 
/*************************************************************************
; MAIN
**************************************************************************/
; Get System Information
call GetSysInfo(null)
 
; Get Version data
for(h = 1 to iHostSize)
	call CallVersions(3011006_rep->hosts[h].host_name)
endfor
 
/*************************************************************************
 EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************
 Display final_reply
**************************************************************/
if(size(final_reply_out->list,5) > 0)
	select into $OUTDEV
		obj_name = final_reply_out->list[d.seq].object_name
		,node_name = final_reply_out->list[d.seq].nodes[d1.seq].node
	from (dummyt d with seq = size(final_reply_out->list,5))
		, (dummyt d1 with seq = 1)
	plan d where maxrec(d1,size(final_reply_out->list[d.seq].nodes,5))
	join d1
	order by obj_name, node_name
	head report
		col 000 "Object Name"
		col 040 "Node"
		col 070 "Version"
		row + 1
	head obj_name
		col 000 final_reply_out->list[d.seq].object_name
	head node_name
		col 040 final_reply_out->list[d.seq].nodes[d1.seq].node
		col 070 final_reply_out->list[d.seq].nodes[d1.seq].version
		row + 1
	with nocounter
else
	select into $OUTDEV
	from (dummyt d with seq = 1)
	head report
		col 000 final_reply_out->status_msg
	with nocounter
endif
 
if(iDebugFlag > 0)
	call echorecord(final_reply_out)
endif
 
#EXIT_VERSION
 
/*************************************************************************
;  Name: GetSysInfo(null)	= null	with protect ;3011006 - EKS_GET_SYSINFO
;  Description: Gets node data
**************************************************************************/
subroutine GetSysInfo(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetSysInfo Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iApplication = 3010000
	set iTask = 3011000
	set iRequest = 3011006
 
 	;Execute request
	set stat = tdbexecute(iApplication,iTask,iRequest,"REC",3011006_rep,"REC",3011006_rep)
 
	; Get Versions call from each Node
	set iHostSize = size(3011006_rep->hosts,5)
	if(iHostSize = 0)
		set final_reply_out->status_msg = "Could not retrieve node data (3011006)."
		go to exit_script
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetSysInfo Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
/*************************************************************************
;  Name: CallVersions(host = vc) = null
;  Description: Call versions on each node
**************************************************************************/
subroutine CallVersions(host)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("CallVersions Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iRequest = 2000
 
	; Build base URL
	select into "nl:"
	from dm_info di
	where di.info_name = "CONTENT_SERVICE_URL"
	detail
		sURL = concat(nullterm(replace(di.info_char,"mpage-content","discern")),"/mpages/reports/")
	with nocounter
 
	; Set final URL
	set sURL = build(sURL,sPrefix,"_get_versions?parameters=^MINE^,^",sPrefix,"^&binding=cpmscript_",host)
	
	; Init Message
	set hHttpMsg 	= uar_SrvSelectMessage(iRequest)
 
	; Init Request
	set hHttpReq 	= uar_SrvCreateRequest(hHttpMsg)
 
	;Init Reply
	set hHttpRep 	= uar_SrvCreateReply(hHttpMsg)
 
	; Set URI
	set stat     	= uar_SrvSetStringFixed(hHttpReq,"uri", sURL, size(sURL,1))
 
	; Set Method
	set stat    	= uar_SrvSetString(hHttpReq,"method", "GET")
 
	; Set Headers
	set hHeader  	= uar_srvgetstruct(hHttpReq,"header")
	set stat     	= uar_SRVSetString(hHeader,"Content_Type", "application/json")
	set hCustom  	= uar_SrvAddItem(hHeader,"custom_headers")
	set stat		= uar_SrvSetString(hCustom,"name", "Authorization")
	set stat		= uar_SrvSetString(hCustom,"value", sAuth)
 
	; Execute request (try 2 times before failing)
	set tryCnt = 1
	while(tryCnt <= 2)
		set tryCnt = tryCnt + 1
		set stat     	= uar_srvexecute(hHttpMsg, hHttpReq, hHttpRep)
		set nHttpStatus = uar_SrvGetLong(hHttpRep, "http_status_code")
 
		if(nHttpStatus = c_http_success)
			set tryCnt = 3
 
	  		set nResponseSize = uar_SrvGetAsIsSize(hHttpRep, "response_buffer")
	  		call echo(build("nResponseSize: ", nResponseSize))
 
	  		if (nResponseSize > 0)
				set sJson = notrim(" ")
				set stat = memrealloc(sJson, 1, build2("C", nResponseSize))
				set stat = uar_SrvGetAsIs(hHttpRep,"response_buffer",sJson,nResponseSize)
 
				; Initialize versions_reply_out
				set stat  = initrec(versions_reply_out)
 
				; Load json data to record
				set stat = cnvtjsontorec(sJson)
 
				; Verify if object exists in final_reply_out already
				set idx = 1
				for(i = 1 to size(versions_reply_out->versions,5))
					set pos = locateval(idx,1,size(final_reply_out->list,5),
					versions_reply_out->versions[i].object_name,final_reply_out->list[idx].object_name)
 
					if(pos > 0)
						set nSize = size(final_reply_out->list[pos].nodes,5) + 1
						set stat = alterlist(final_reply_out->list[pos].nodes,nSize)
						set final_reply_out->list[pos].nodes[nSize].version = versions_reply_out->versions[i].version
						set final_reply_out->list[pos].nodes[nSize].node = host
					else
						set fSize = size(final_reply_out->list,5) + 1
						set stat = alterlist(final_reply_out->list,fSize)
						set final_reply_out->list[fSize].object_name = versions_reply_out->versions[i].object_name
 
						set nSize = size(final_reply_out->list[fSize].nodes,5) + 1
						set stat = alterlist(final_reply_out->list[fSize].nodes,nSize)
						set final_reply_out->list[fSize].nodes[nSize].version = versions_reply_out->versions[i].version
						set final_reply_out->list[fSize].nodes[nSize].node = host
					endif
				endfor
			else
				set final_reply_out->status_msg = build2("Could not retrieve version data on node: ",host)
				go to exit_script
			endif
		else
			set final_reply_out->status_msg = build2("HTTP Status: ",nHttpStatus, " GET Versions call failed.")
			go to exit_script
		endif
	endwhile
 
	if(iDebugFlag > 0)
		call echo(concat("CallVersions Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
 
end go
