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
          Date Written:       	04/06/16
          Source file name:   	snsro_get_versions.prg
          Object name:        	vigilanz_get_versions
          Request #:    		NONE
          Program purpose:    	returns versions for all CCL programs
          Tables read:		  	DPROTECT
          Tables updated:     	NONE
          Executing from:     	EMISSARY SERVICES
          Special Notes:	  	NONE
***********************************************************************
                   GENERATED MODIFICATION CONTROL LOG
***********************************************************************
 Mod Date     Engineer          Comment
------------------------------------------------------------------
  000 11/08/14 JCO				Initial write
  001 10/20/17 RJC				Modified to use a variable index to allow additions and make alphabetization easier
  002 03/22/18 RJC				Rewrite using new version process with Emissary
  003 04/13/18 RJC				Removed join to prsnl table
  004 09/17/19 RJC				Added audit object, prefix input parameter
  005 01/03/20 RJC				snsro_common* scripts should be returned regardless of prefix
  006 01/27/20 RJC				Appended _ to prefix to narrow down search
***********************************************************************/
drop program vigilanz_get_versions go
create program vigilanz_get_versions
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		,"Prefix" = ""			; optional - prefix for multi-vendor support
with OUTDEV, PREFIX
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
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
 
/************************************************************************
; DECLARED VARIABLES
************************************************************************/
declare sEmissaryVersion 	= vc with protect, noconstant("")
declare sPrefix				= vc with protect, noconstant("")
 
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
set sPrefix					= trim(cnvtupper($PREFIX),3)
if(sPrefix = "")
	set sPrefix = "SNSRO_*"
else
	set sPrefix = build(sPrefix,"_*")
endif
 
/************************************************************************
; DECLARE SUBROUTINES
************************************************************************/
declare GetObjects(null) = null with protect
declare GetVersion(null) = null with protect
 
/************************************************************************
; CALL SUBROUTINES
************************************************************************/
; Get all SNSRO compiled objects
call GetObjects(null)
 
; Get the Emissary version of each object
if(size(versions_reply_out->versions,5) > 0)
	call GetVersion(null)
endif
 
; Update audit
set versions_reply_out->audit.service_version = sVersion
set versions_reply_out->status_data.status = "S"
set versions_reply_out->status_data.subeventstatus[1].Code = "0000"
set versions_reply_out->status_data.subeventstatus[1].Description = "Success"
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
#EXIT_SCRIPT
	set JSONout = CNVTRECTOJSON(versions_reply_out)
 
    if(validate(_MEMORY_REPLY_STRING))
		set _MEMORY_REPLY_STRING = trim(JSONout,3)
	endif
 
	call echorecord(versions_reply_out)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_versions.json")
	call echojson(versions_reply_out, _file, 0)
 
#EXIT_VERSION
/************************************************************************
; SUBROUTINES
************************************************************************/
 
/*************************************************************************
;  Name: GetObjects(null) = null
;  Description:  Gets all SNSRO objects from the DPROTECT table
**************************************************************************/
subroutine GetObjects(null)
	select into "nl:"
	formatted_date = format(d.datestamp, "DD-MMM-YYYY;;d")
	, formatted_time = format(d.timestamp, "HH:MM:SS;2;m")
	from dprotect d
	plan d where d.object_name = patstring(sPrefix)
		or d.object_name = patstring("SNSRO_COMMON*")
		;and d.datestamp between cnvtdate2("21-MAR-2018","DD-MMM-YYYY") and cnvtdate2("22-MAR-2018","DD-MMM-YYYY")
	order by d.object_name
	head report
		x = 0
	detail
		x = x + 1
		stat = alterlist(versions_reply_out->versions,x)
		versions_reply_out->versions[x].object_name = d.object_name
		versions_reply_out->versions[x].filename = check(d.source_name)
		versions_reply_out->versions[x].datetime = cnvtdatetime(build2(formatted_date," ",formatted_time))
		versions_reply_out->versions[x].group = d.group
		versions_reply_out->versions[x].username = d.user_name
	with nocounter
 
end ;End Subroutine
 
/*************************************************************************
;  Name: GetVersion(null) = null
;  Description:  Calls each script to get the version back
**************************************************************************/
subroutine GetVersion(null)
	declare cmd = vc
 
	for(i = 1 to size(versions_reply_out->versions,5))
		; Reset variable each time
		set sEmissaryVersion = ""
 
		; Build parser command
		set cmd = build2("execute ",versions_reply_out->versions[i].object_name,
		" 'VERSION' with replace('SVERSION', sEmissaryVersion) go")
 
		; Execute command
		call parser(cmd)
 
		set versions_reply_out->versions[i].version = sEmissaryVersion
	endfor
 
end ;End Subroutine
 
 
end go
