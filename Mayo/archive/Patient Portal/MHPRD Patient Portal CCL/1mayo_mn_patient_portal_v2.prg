drop program 1mayo_mn_patient_portal_v2:dba go
create program 1mayo_mn_patient_portal_v2:dba
/****************************************************************************
 *                                                                          *
 *  Copyright Notice:  (c) 1983 Laboratory Information Systems &            *
 *                              Technology, Inc.                            *
 *       Revision      (c) 1984-1999 Cerner Corporation                     *
 *                                                                          *
 *  Cerner (R) Proprietary Rights Notice:  All rights reserved.             *
 *  This material contains the valuable properties and trade secrets of     *
 *  Cerner Corporation of Kansas City, Missouri, United States of           *
 *  America (Cerner), embodying substantial creative efforts and            *
 *  confidential information, ideas and expressions, no part of which       *
 *  may be reproduced or transmitted in any form or by any means, or        *
 *  retained in any storage or retrieval system without the express         *
 *  written permission of Cerner.                                           *
 *                                                                          *
 *  Cerner is a registered mark of Cerner Corporation.                      *
 *                                                                          *
 ****************************************************************************
 
          Date Written:       	11/15/12
          Source file name:   	1mayo_mn_patient_portal_v2.prg
          Object name:        	1mayo_mn_patient_portal_v2
          Request #:
 
          Product:            	Discern MPages
          Product Team:
          HNA Version:        	V500
          CCL Version:        	8.3
 
          Program purpose:    	Wrapper program used to create patient portal on IQHealth
				that determines person id and encounter id from person alias,
				alias type code and alias pool code.
 
          Tables read:        	PERSON_ALIAS
          Tables updated:     	NONE
          Executing from:     	MPages Mobile servers (IQHealth)
 
          Special Notes:		NONE
 **********************************************************************************************
 *                      GENERATED MODIFICATION CONTROL LOG
 **********************************************************************************************
 *
 *Mod Date     Feature  Engineer     Comment
 *--- -------- -------- ------------ -----------------------------------------------------------
 *001 11/15/12   000000 BH018364     Initial Release
 *002 01/03/13	 000000 BH018364	 Updated to allow for cross domain access
 *003 11/05/13   000000 CERWLW       Changes required due to Patient Portal IP de-activiating js
 *                                   in their solution
 *004 01/21/14   000000 CERWLW       Added link to scheduling   
 ;005 02/14/14          m026751      Include for Cerner outside package                  
 **********************************************************************************************/
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Person Alias:" = ""
	, "Alias Type Code:" = ""
	, "Alias Pool Code:" = ""
	, "MPage Webservice Root:" = "http://jaempg700a.mayo.edu"
	, "Static Content Location:" = ""
	, "Debug Mode:" = 0
    , "Appointment URL:" = "https://iqhealth.myhealtheexchange.com/iqhealth/scheduling/mayo_mn/addAppointmentToCalendar"
 
with OUTDEV, inputPersonAlias, inputAliasTypeCode, inputAliasPoolCode, webRoot, scLoc, debugMode, apptURL
 
/**********************************************************************************************
	Varibles/Constants
***********************************************************************************************/
declare person_id = f8 with protect, noconstant(0.0)
 
declare getPersonId( dummy ) = null with protect
declare getHTML( dummy ) = vc with protect
 
/**********************************************************************************************
	Script Execution
***********************************************************************************************/
call getPersonId(0)
 
/**********************************************************************************************
	Subroutines
***********************************************************************************************/
subroutine getPersonId( dummy )
	if (isnumeric($inputAliasTypeCode))
		declare tmp_aliasTypeCd = f8 with protect, constant (CNVTREAL($inputAliasTypeCode))
	else
		declare tmp_aliasTypeCd = f8 with protect, constant (UAR_GET_CODE_BY("MEANING",4,$inputAliasTypeCode))
	endif
 
	SELECT into "nl:"
	FROM
		PERSON_ALIAS   P
	WHERE P.alias = CNVTSTRING($inputPersonAlias)
	and p.person_alias_type_cd = tmp_aliasTypeCd
	and P.active_ind+0 = 1
 
	detail
		person_id = p.person_id
 
	WITH NOCOUNTER, SEPARATOR=" ", FORMAT

 	call echo(BUILD2("person_id:",person_id))
	if (person_id = 0.0)
		go to exit_script
	endif
end ;subroutine getPersonId( dummy )
 
subroutine getHTML( dummy )
 
	declare htmlStr = gvc with protect, noconstant("")		                   ;003
	declare html_head = vc with protect, noconstant("")
	declare html_foot = vc with protect, noconstant("")
	declare html_body = vc with protect, noconstant("")                        ;003
	declare json_string = gvc with protect, noconstant("")                     ;003
	declare stat = i4 with protect,noconstant(0)                               ;003
	declare recStr = gvc with protect,noconstant("")                           ;003
	declare dayofWeekStr = vc with protect,noconstant(" ")                     ;003
	declare _CRLF = vc with protect,constant(build2(char(13),char(10)))        ;003
	declare brStr = vc with protect,constant(^</div><div>&nbsp;^)              ;003
	declare brStr2 = vc with protect,constant(^</div><div>&nbsp:</div><div>^)  ;003
	declare rowClass = vc with protect, noconstant("")
	declare desc = vc with protect, noconstant("")
	declare apptDt = vc with protect, noconstant("")
	declare apptTm = vc with protect, noconstant("")
	declare apptDtTm = vc with protect, noconstant("")
	declare dayStr = vc with protect, noconstant("")
	declare yearStr = vc with protect, noconstant("")
	declare dayofYearStr = vc with protect, noconstant("")
	declare apptHr = vc with protect, noconstant("")
	declare apptTz = vc with protect, noconstant("")
	declare apptTime = dq8 with protect, noconstant(0)
	declare endDtTm = dq8 with protect, noconstant(0)
	declare apptEndTm = vc with protect, noconstant("")
	declare edt_tm = vc with protect, noconstant("")
	declare css_str = gvc with protect, noconstant("")
 
 
	declare offset_var = i4  with protect, noconstant(0)
	declare daylight_var = i4  with protect, noconstant(0)
  
	if ($debugMode)
		; Attempting to get stylesheet from cer_install and then ccluserdir if failed on cer_install
		free record getREPLY
		record getREPLY (
			1 INFO_LINE[*]
				2 new_line = vc
			1 data_blob = gvc
			1 data_blob_size = i4
%i cclsource:status_block.inc
		)
 
		free record getREQUEST
		record getREQUEST (
		  1 Module_Dir = vc
		  1 Module_Name = vc
		  1 bAsBlob = i2
		)
 
		set getrequest->module_dir= "cer_install:1mayo_mn_patient_portal.css"
		set getrequest->Module_name = ""
		set getrequest->bAsBlob = 1
		set getReply->data_blob = ""
		execute eks_get_source with replace (REQUEST,getREQUEST),replace(REPLY,getREPLY)
		if (getReply->status_data.status = "S")
			set css_str = getReply->data_blob
		else
			set getrequest->module_dir= "ccluserdir:1mayo_mn_patient_portal.css"
			set getrequest->Module_name = ""
			set getrequest->bAsBlob = 1
			set getReply->data_blob = ""
			execute eks_get_source with replace (REQUEST,getREQUEST),replace(REPLY,getREPLY)
			set css_str = getReply->data_blob
		endif
		free record getReply
		free record getREQUEST
 
	    set html_head = BUILD2(
		                  ^<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" ^,
                          ^"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">^,
                          ^<?xml version="1.0" encoding="UTF-8" ?>^,
                          ^<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">^,
                          ^<head>^,
			  ^<META HTTP-EQUIV="CACHE-CONTROL" CONTENT="NO-CACHE">^,
			  ^<meta http-equiv="Content-Type" content="XMLCCLREQUEST" name="discern"/>^,
			  ^<style type="text/css">^,css_str,
			  ^</style>^,
 
			  ^</head>^,
			  ^<body>^)
		set html_foot = ^</body></html>^
	endif
 
	execute 1mayo_mn_pat_appt_list_v2 $OUTDEV, value(person_id), 0
  
    call echorecord(t_list)
 
	select into "nl:"
	from (dummyt d with seq = value(size(t_list->loc,5)))
	plan d
	head report
	    pat_name = trim(t_list->patName,3)
		htmlStr = ^<div>^
		rowCnt = 0
		sdt_tm = fillstring(50," ")
		crlfpos = 0
	detail
		aSeq = 0
		crlfpos = 0
		sdt_tm = fillstring(50," ")
		aLen = size(t_list->loc[d.seq].appt,5)
		for (aSeq = 1 to aLen)
		    rowCnt = rowCnt + 1
 
		    apptDt = concat(substring(1,2,t_list->loc[d.seq].appt[aSeq].dt_tm),"-",    
			            substring(4,2,t_list->loc[d.seq].appt[aSeq].dt_tm),"-",    
				    substring(7,4,t_list->loc[d.seq].appt[aSeq].dt_tm)         
			           )
		    apptTm = substring(12,8,t_list->loc[d.seq].appt[aSeq].dt_tm)	   
		    apptDtTm = concat(apptDt," ",apptTm)
		    monthStr = concat(cnvtcap(format(cnvtdate2(apptDt,"MM-DD-YYYY"),"MMM;;D")),".") ;will get Nov. as display
		    dayStr = format(cnvtdate2(apptDt,"MM-DD-YYYY"),"DD;;D")
		    if (substring(1,1,dayStr) = "0")
			dayStr = substring(2,1,dayStr)
		    endif
 
		    yearStr = substring(7,4,apptDt)
		    dayofYearStr =  concat(monthStr," ",trim(dayStr,3),", ",yearStr)                   
		    dayofWeekStr = format(cnvtdate2(apptDt,"MM-DD-YYYY"),"WWWWWWWWW;;D")               
		    apptHr = substring(12,5,t_list->loc[d.seq].appt[aSeq].dt_tm)                   
		    apptTz = substring(21,3,t_list->loc[d.seq].appt[aSeq].dt_tm)                   
		    apptTime = cnvtdatetime(cnvtdate2(apptDt,"MM-DD-YYYY"),cnvttime2(apptHr,"HH:MM"))
		    timeStr = cnvtupper(format(cnvttime(apptTime),"HH:MM;;S"))                         
 
		    ;strip of the leading "0" if necessary
		    if (substring(1,1,timeStr) = "0")
			timeStr = substring(2,7,timeStr)
		    endif
 
		    sdt_tm = concat(dayofWeekStr,", ",monthStr," ",trim(dayStr,3),", ",trim(yearStr,3)," at ",timeStr,\
					 " ",apptTz)
					; datetimezonebyindex(CURTIMEZONESYS,offset_var,daylight_var,7))
		    ;,"*",datetimezonebyindex(CURTIMEZONEAPP),"*",datetimezonebyindex(CURTIMEZONESYS),"*",cnvtstring(CURTIMEZONEDEF))
 
		    endDtTm = datetimeadd(cnvtdatetime(cnvtdate2(apptDt,"MM-DD-YYYY"),cnvttime2(apptHr,"HH:MM")),((30/1440.0) * 1))
 
		    apptEndTm = cnvtupper(format(cnvttime(endDtTm),"HH:MM;;S"))                           
 
		    ;strip out the leading "0" if necessary
		    if (substring(1,1,apptEndTm) = "0")
		        apptEndTm = substring(2,7,apptEndTm)
		    endif
 
		    edt_tm = concat(dayofWeekStr,", ",monthStr," ",dayStr,", ",yearStr," at ",apptEndTm)  ;
 
                    end_tm = cnvttime(endDtTm)
 
	            sdt_milli = (datetimediff(cnvtdatetime(cnvtdate2(apptDt,"MM-DD-YYYY"),cnvttime2(apptHr,"HH:MM")),
			    cnvtdatetime("01-JAN-1970 00:00:00"),6) * 10)
 
		    edt_milli = (datetimediff(cnvtdatetime(cnvtdate2(apptDt,"MM-DD-YYYY"),cnvttime(end_tm)),
			    cnvtdatetime("01-JAN-1970 00:00:00"),6) * 10)
 
                if (size(t_list->loc[d.seq].appt[aSeq].preps,5) > 0)
					t_list->loc[d.seq].appt[aSeq].preps[1].prepInstruct =
						BUILD2(
						"<h6><div>&nbsp;",
							replace(t_list->loc[d.seq].appt[aSeq].preps[1].prepInstruct,CHAR(10),brStr,0),
						"</div></h6>")
                endif
 
		if (mod(rowCnt,2) = 0)
		    rowClass = "h5" ;"even"
		else
		    rowClass = "h4" ;"odd"
		endif
 
		if (trim(t_list->loc[d.seq].appt[aSeq].RSCDESC,3) = "")
		    desc = "&nbsp;"
		else
		    desc = t_list->loc[d.seq].appt[aSeq].RSCDESC
		endif
 
		htmlStr = CONCAT(htmlStr,
				^<^,trim(rowClass,3),^>^,
				  ;^<td colspan="3">^,
				    ^<div><b>^,trim(sdt_tm,3),^</b></div>^,
				    ^<div><b>Reason:</b>&nbsp;^,trim(desc,3),^</div>^,
				    ^<div><b>Location:</b>&nbsp;^,trim(t_list->loc[d.seq].building,3),^&nbsp;^,
					trim(t_list->loc[d.seq].department,3),^</div>^,
				    ^<div><b>^,trim(t_list->loc[d.seq].appt[aSeq].RSCLBL,3),
				    ^:</b>&nbsp;^,trim(t_list->loc[d.seq].appt[aSeq].RSCTYPE,3),^</div>^
				   ;^</td><td>^,
					/*
					^<!--ul class="actions"><li>^,
				    ^<a title="Click this link to download this appointment to your personal calendar.  ^,
				    ^When prompted to OPEN or SAVE, choose OPEN." href="^,
				    $apptURL,^?id=^,BUILD(t_list->loc[d.seq].appt[aSeq].ENCNTRID),
				    ^&selectedAppointment.id=^,BUILD(t_list->loc[d.seq].appt[aSeq].ENCNTRID),
				    ^&selectedAppointment.dayOfWeek=^,dayofWeekStr,^&selectedAppointment.dayOfYear=^,trim(dayofYearStr,3),
				    ^&selectedAppointment.timeOfDay=^,timeStr,^&selectedAppointment.reason=^,trim(desc,3),
				    ^&selectedAppointment.reasonId=^,BUILD(t_list->loc[d.seq].appt[aSeq].APPTID),
				    ^&selectedAppointment.provider=^,trim(t_list->loc[d.seq].appt[aSeq].RSCTYPE,3),
				    ^&selectedAppointment.location=^,trim(t_list->loc[d.seq].building,3),^ ^,trim(t_list->loc[d.seq].department,3),
				    ^&selectedAppointment.locationId=^,BUILD(t_list->loc[d.seq].LOCCD),
				    ^&selectedAppointment.startDate=^,BUILD(sdt_milli),^&selectedAppointment.endDate=^,BUILD(edt_milli),
				    ^">Add to Calendar</a></li></ul-->^,
					*/
				   ;^</td>^,
				;^</^,trim(rowClass,3),^>^
			)
			if (size(trim(t_list->loc[d.seq].appt[aSeq].preps[1].prepInstruct,3)) > 0)
			    htmlStr = CONCAT(htmlStr,^<div>^,
			                    ;^<td colspan="4">^,
			                        ^<b>Preparations:</b><div>&nbsp;</div>^,trim(t_list->loc[d.seq].appt[aSeq].preps[1].prepInstruct,3),
			                    ;^</td>^,
			                    ^</div>^
			                 )
 
			else
			    htmlStr = concat(htmlStr,"&nbsp;")
			endif
			htmlStr = concat(htmlStr,^</^,trim(rowClass,3),^>^)
		endfor
 
	foot report
		htmlStr = CONCAT(htmlStr,^</div>^)
 
 
	with nocounter
 
	if (not curqual or size(t_list->loc,5) = 0)
	    set htmlStr = "<div style='font-weight:bolder;'>No appointments found.</div>"
	endif
	/***** End Mod 003   *****/
 
	return (BUILD2(
		html_head,
		^<h1 class="sec-hd">^,
			^Upcoming Appointments^,
		^</h1>^,
		^<h2 class="instruct" id="mayo_mn_pat_instruct">^,
			;^<font color="#FF0000">^,
				^<div>Please refer to your paper schedule for complete instructions.</div><div>&nbsp;</div>^,
				^<div>If you'd like to cancel or reschedule an appointment, please ^,
				^<a href="http://mayoclinichealthsystem.org/make-an-appointment" target="_blank">^,
					^choose your appointment phone line by location^,
				^</a>^,
				^ and call us (link opens in new window).</div>^,
			;^</font>^,
		^</h2>^,
		^<a href='https://mayomchc.iqhealth.com/appointments/request' target='_parent'>\
	    						Request an Appointment</a>^,
		^<h3 class="appointmentDisplay" id="mayo_mn_pat_appts">^,htmlStr,^</h3>^,  ;do all of the launchmpage
		html_foot
	))
 
end ;getHTML( dummy )
/**********************************************************************************************
	Exit Script
***********************************************************************************************/
#exit_script
 
set _MEMORY_REPLY_STRING = getHTML(0)
 
if (validate(debug_ind,0) = 1)
	call echo(_MEMORY_REPLY_STRING)
endif
 
end
go
 
