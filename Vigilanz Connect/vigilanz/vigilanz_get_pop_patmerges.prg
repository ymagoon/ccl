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

   ~BE~***********************************************************************
      Source file name:     snsro_get_pop_patmerges.prg
      Object name:          vigilanz_get_pop_patmerges
      Program purpose:      Retrieve merge information from millennium
      Executing from:       Emissary Service
 *******************************************************************************
                     MODIFICATION CONTROL LOG
 *******************************************************************************
 Mod  Date     Engineer             Comment
 -------------------------------------------------------------------------------
  000 09/07/18 STV                  Initial write
  001 10/18/18 RJC					Outerjoin on person_alias table
  002 04/26/19 STV                  added 115 sec timout
  003 09/09/19 RJC                  Renamed file and object
 *******************************************************************************/
;drop program snsro_get_pop_patientmerges go
drop program vigilanz_get_pop_patmerges go
create program vigilanz_get_pop_patmerges
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "User Name" = ""
	, "BegDate" = ""
	, "End Date" = ""
	, "debug flag" = ""
 
with OUTDEV, UserName, beg_date, end_date, debug_flag
 
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
free record patientmerges_reply_out
record patientmerges_reply_out(
	1 patient_merge_cnt= i4
	1 patient_merge[*]
		2 prior_mrn = vc
		2 prior_patient_id = f8
		2 create_updt_dt_tm = dq8
		2 patient
			3 patient_id = f8
			3 display_name = vc
			3 last_name = vc
			3 first_name = vc
			3 middle_name = vc
			3 mrn = vc
			3 birth_date_time = dq8
			3 sdob = c10
			3 gender
				4 id = f8
				4 name = vc
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
  1 status_data
    2 status = c1
    2 subeventstatus[1]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
      3 Code = c4
      3 Description = vc
 
)
 
;initialize status to FAIL
set patientmerges_reply_out->status_data->status = "F"
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common	;008
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
 
; Input
declare sUserName					= vc with protect, noconstant("")
declare sFromDate					= vc with protect, noconstant("")
declare sToDate						= vc with protect, noconstant("")
declare iDebugFlag					= i2 with protect, noconstant(0)
declare iTimeMax					= i4 with protect, noconstant(0)
 
;other
declare UTCmode						= i2 with protect, noconstant(0)
declare UTCpos 						= i2 with protect, noconstant(0)
declare qFromDateTime					= dq8 with protect, noconstant(CNVTDATETIME(CURDATE, CURTIME3))
declare qToDateTime						= dq8 with protect, noconstant(CNVTDATETIME(CURDATE, CURTIME3))
declare timeOutThreshold = i4 with protect, noconstant(115);setting to 115 seconds
declare queryStartTm = dq8
 
 
;Constants
declare c_prsnl_action_cd						= f8 with protect, constant(uar_get_code_by("MEANING",327,"PRSNLCMB"))
declare c_mrn_person_alias_type_cd				= f8 with protect, constant(uar_get_code_by("MEANING",4,"MRN"))
 
/*************************************************************************
; INIIALIZE VARIABLES
**************************************************************************/
 
set UTCmode							= CURUTC	;005
set UTCpos							= findstring("Z",sFromDate,1,0) ;005
set iDebugFlag                      = cnvtint($debug_flag)
set sFromDate                       = trim($beg_date,3)
set sTodate							= trim($end_date,3)
 
set qFromDateTime = GetDateTime(sFromDate)
set qToDateTime = GetDateTime(sToDate)
 
if(iDebugFlag > 0)
	call echo(build2("UTCmode-> ", cnvtstring(UTCmode)))
	call echo(build2("UTCpos-> ", cnvtstring(UTCpos)))
	call echo(build2("sFromDate-> ", sFromDate))
	call echo(build2("sToDate-> ", sTodate))
	call echo(build2("qFromDateTime->", cnvtstring(qFromDateTime)))
	call echo(build2("qToDateTime->", cnvtstring(qToDateTime)))
endif
 
 
/****************************************************************************
*MAIN Query
*****************************************************************************/
; Validate username and populate audit
set iRet = PopulateAudit(sUserName, 0.0, patientmerges_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F","POP_PATENTMERGES","Invalid User for Audit.",
		"1001",build2("Invalid User for Audit."),patientmerges_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate from date is not greater than to date - 004
if (qFromDateTime > qToDateTime)
	call ErrorHandler2("VALIDATE", "F", "POP_PATENTMERGES", "From Date Greater than To Date. Refine Dates Entered.",
	"2010", "From Date Greater than To Date. Refine Dates Entered.", patientmerges_reply_out)
	go to EXIT_SCRIPT
endif
 
;;Getting Patent Merges
if(iDebugFlag > 0)
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("Main Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
endif
 
set queryStartTm = cnvtdatetime(curdate, curtime3)
select into "nl:"
from person_combine pc
	,person p
	,person_alias pa;current mrn
	,person_alias pa2;prior mrn
plan pc
	where pc.cmb_dt_tm between cnvtdatetime(qFromDateTime) and cnvtdatetime(qToDateTime)
		and pc.combine_action_cd != c_prsnl_action_cd
		and pc.from_person_id != pc.to_person_id
join p
	where p.person_id = pc.to_person_id
join pa
	where pa.person_id = outerjoin(p.person_id)
		and pa.person_alias_type_cd = outerjoin(c_mrn_person_alias_type_cd)
		and pa.active_ind = outerjoin(1)
		and pa.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		and pa.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
join pa2
	where pa2.person_id = outerjoin(pc.from_person_id)
		and pa2.person_alias_type_cd = outerjoin(c_mrn_person_alias_type_cd)
order by pc.from_person_id
head report
	x = 0
	head pc.from_person_id
		x = x + 1
		stat = alterlist(patientmerges_reply_out->patient_merge,x)
		patientmerges_reply_out->patient_merge[x].create_updt_dt_tm = pc.cmb_dt_tm
		patientmerges_reply_out->patient_merge[x].prior_patient_id = pc.from_person_id
		patientmerges_reply_out->patient_merge[x].prior_mrn = trim(pa2.alias,3)
		patientmerges_reply_out->patient_merge[x].patient.patient_id = p.person_id
		patientmerges_reply_out->patient_merge[x].patient.birth_date_time = p.birth_dt_tm
		patientmerges_reply_out->patient_merge[x].patient.display_name = trim(p.name_full_formatted)
		patientmerges_reply_out->patient_merge[x].patient.last_name = trim(p.name_last)
		patientmerges_reply_out->patient_merge[x].patient.first_name = trim(p.name_first)
		patientmerges_reply_out->patient_merge[x].patient.middle_name = trim(p.name_middle)
		patientmerges_reply_out->patient_merge[x].patient.mrn = trim(pa.alias,3)
		patientmerges_reply_out->patient_merge[x].patient.sdob = datetimezoneformat(p.birth_dt_tm,p.birth_tz,"YYYY-MM-DD",curtimezonedef)
		patientmerges_reply_out->patient_merge[x].patient.gender.id = p.sex_cd
		patientmerges_reply_out->patient_merge[x].patient.gender.name = trim(uar_get_code_display(p.sex_cd))
foot report
	patientmerges_reply_out->patient_merge_cnt = x
with nocounter, time = value(timeOutThreshold)
 
;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
if(iDebugFlag > 0)
	call echo(concat("Main Query: ",
	    		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    		" seconds"))
endif
 
 
;;set Final Audit status
if(patientmerges_reply_out->patient_merge_cnt < 1)
	call ErrorHandler2("VALIDATE", "Z", "POP_PATENTMERGES", "No Results Found",
						"9999","Please check paramters.", patientmerges_reply_out)
	go to EXIT_SCRIPT
else
	call ErrorHandler2("SUCCESS", "S", "POP_PATENTMERGES", "Pop PatientMerges completed successfully.",
						"0000","Pop PatientMerges completed successfully.", patientmerges_reply_out)
 
endif
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(patientmerges_reply_out)
 
if(idebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_pop_patientmerges.json")
	call echo(build2("_file : ", _file))
	call echojson(patientmerges_reply_out, _file, 0)
    call echorecord(patientmerges_reply_out)
	call echo(JSONout)
endif
 
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
#EXIT_VERSION
 
end
go
