/*~BB~************************************************************************
*
*  Copyright Notice:  (c) 2018 Sansoro Health, LLC
*
*  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
*  This material contains the valuable properties and trade secrets of
*  Sansoro Health, United States of
*  America, embodying substantial creative efforts and
*  confidential information, ideas and expressions, no part of which
*  may be reproduced or transmitted in any form or by any means, or
*  retained in any storage or retrieval system without the express
*  written permission of Sansoro Health.
*
  ~BE~***********************************************************************/
/*****************************************************************************
          Date Written:       01/08/15
          Source file name:   snsro_get_social_history
          Object name:        snsro_get_social_history
          Request #:          601052 - shx_get_activity
          Program purpose:    Reads social history for given person ids.
          Tables read:
          Tables updated:     NONE
          Executing from:     EMISSARY SERVICES
          Special Notes:	  NONE
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
  000 01/08/15 JCO		    Initial
  001 02/18/15 AAB			Changed PERSON_ID input param to Number
							Changed order of input params
  002 04/02/15 JCO			Added SHX_CATEGORY_LABEL to reply
  003 09/14/15 AAB			Add audit object
  004 04/29/16 AAB 			Added version
  005 06/13/16 JCO			Added beg_effective_dt_tm for Cerner 2015 rev
  006 10/10/16 AAB 			Add DEBUG_FLAG
  007 07/27/17 JCO			Changed %i to execute; update ErrorHandler2
  008 03/22/18 RJC			Added version code and copyright block
 ***********************************************************************/
drop program snsro_get_social_history go
create program snsro_get_social_history
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username:" = ""
		, "Person ID:" = 0.0
		, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
 
 
with OUTDEV, USERNAME, PERSON_ID, DEBUG_FLAG   ;006
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.16.6.1" ;008
if($OUTDEV = "VERSION")
	go to exit_version
endif

/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record req_in
record req_in (
  1 person_id = f8
  1 prsnl_id = f8
  1 category_qual [*]
    2 shx_category_ref_id = f8
)
 
free record social_history_reply_out
record social_history_reply_out
(
  1 activity_qual [*]
    2 shx_category_ref_id = f8
    2 shx_category_def_id = f8
    2 shx_activity_id = f8
    2 shx_activity_group_id = f8
    2 person_id = f8
    2 organization_id = f8
    2 type_mean = c12
    2 unable_to_obtain_ind = i2
    2 status_cd = f8
    2 assessment_cd = f8
    2 detail_summary_text_id = f8
    2 detail_summary = vc
    2 last_review_dt_tm = dq8
    2 last_updt_prsnl_id = f8
    2 last_updt_prsnl_name = vc
    2 last_updt_dt_tm = dq8
    2 updt_cnt = i4
    2 comment_qual [*]
      3 shx_comment_id = f8
      3 long_text_id = f8
      3 long_text = vc
      3 comment_prsnl_id = f8
      3 comment_prsnl_full_name = vc
      3 comment_dt_tm = dq8
      3 comment_dt_tm_tz = i4
      3 updt_cnt = i4
    2 action_qual [*]
      3 shx_action_id = f8
      3 prsnl_id = f8
      3 prsnl_full_name = vc
      3 action_type_mean = c12
      3 action_dt_tm = dq8
      3 action_tz = i4
      3 updt_cnt = i4
    2 beg_effective_dt_tm = dq8	;005
    2 shx_category_label = vc	;002
  1 incomplete_data_ind = i2
 1 audit			;003
		2 user_id							= f8
		2 user_firstname					= vc
		2 user_lastname						= vc
		2 patient_id						= f8
		2 patient_firstname					= vc
		2 patient_lastname					= vc
	    2 service_version					= vc		;004
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
 
set social_history_reply_out->status_data->status = "F"
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
declare dPersonID  		= f8 with protect, noconstant(0.0)
declare dPrsnlID		= f8 with protect, noconstant(0.0)
declare shCnt			= i2 with protect, noconstant(0)
declare dTobacco		= f8 with protect, noconstant(0.0)
declare dSubstance		= f8 with protect, noconstant(0.0)
declare dAlcohol		= f8 with protect, noconstant(0.0)
declare idebugFlag		= i2 with protect, noconstant(0) ;006
declare section_startDtTm	= dq8 with protect, constant(cnvtdatetime(curdate,curtime3))
 
declare APPLICATION_NUMBER 			= i4 with protect, constant (600005)
declare TASK_NUMBER 				= i4 with protect, constant (601029)
declare REQ_NUMBER 					= i4 with protect, constant (601052)
 
/****************************************************************************
;INCLUDES
****************************************************************************/
;007 %i ccluserdir:snsro_common.inc
execute snsro_common	;007
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
set dPersonID = $PERSON_ID
set sUserName = $USERNAME
set dPrsnlID  =  GetPrsnlIDfromUserName(sUserName)
set idebugFlag	= cnvtint($DEBUG_FLAG)  ;006
 
if(idebugFlag > 0)
 
	call echo(build("Person ID -> ", dPersonID))
	call echo(build("Username -> ", sUsername))
	call echo(build("dPrsnlID -> ", dPrsnlID))
 
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetSocialHistory(null)				= null with protect
declare PostAmble(null)						= null with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
if(dPersonID > 0 and sUsername != "")
 
	set iRet = PopulateAudit(sUserName, dPersonID, social_history_reply_out, sVersion)   ;004    ;003
 
	if(iRet = 0)  ;003
		call ErrorHandler2("VALIDATE", "F", "SOCIAL HISTORY", "Invalid User for Audit.",
		"1001", build("UserId is invalid: ", sUserName), social_history_reply_out)	;007
		go to EXIT_SCRIPT
 
	endif
	;call GetPrsnlIDfromUserName(null)
	call GetSocialHistory(null)
	call PostAmble(null)
 
else
 
 	call ErrorHandler("EXECUTE", "F", "SOCIAL HISTORY", "No Person ID or Username was passed in -- 601052", social_history_reply_out)
	go to EXIT_SCRIPT
 
endif
 
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(social_history_reply_out)
 
if(idebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_social_history.json")
	call echo(build2("_file : ", _file))
	call echojson(social_history_reply_out, _file, 0)
	call echo(JSONout)
endif
 
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: GetSocialHistory(null)
;  Description: This will retrieve family history for a patient
;
**************************************************************************/
subroutine GetSocialHistory(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetSocialHistory Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
set req_in->person_id = dPersonID
set req_in->prsnl_id = dPrsnlID
set stat = alterlist(req_in->category_qual,4)
select into "nl:"
	shx.description
 
from shx_category_ref shx
 
where shx.description in ("Tobacco", "Alcohol", "Substance Abuse")
 
detail
	case (shx.description)
		of "Tobacco" :
				req_in->category_qual[1].shx_category_ref_id = shx.shx_category_ref_id
				dTobacco = shx.shx_category_ref_id
		of "Alcohol" :
				req_in->category_qual[2].shx_category_ref_id = shx.shx_category_ref_id
				dAlcohol = shx.shx_category_ref_id
		of "Substance Abuse" :
				req_in->category_qual[3].shx_category_ref_id = shx.shx_category_ref_id
				dSubstance = shx.shx_category_ref_id
	endcase
with nocounter
 
if(curqual = 0)
	call ErrorHandler2("EXECUTE", "F", "SOCIAL HISTORY", "Error retreiving Social History (601052)",
	"9999", "Error retreiving Social History (601052)", social_history_reply_out)	;007
	go to EXIT_SCRIPT
endif
;set req_in->category_qual[1]->shx_category_ref_id = 221
;set req_in->category_qual[2]->shx_category_ref_id = 301
;set req_in->category_qual[3]->shx_category_ref_id = 313
set req_in->category_qual[4]->shx_category_ref_id = 0
 
if(idebugFlag > 0)
 
	call echorecord(req_in)
 
endif
 
set stat = tdbexecute(APPLICATION_NUMBER, TASK_NUMBER, REQ_NUMBER,"REC",req_in,"REC",social_history_reply_out)
 
 
if (social_history_reply_out->status_data->status = "F")
	call ErrorHandler2("EXECUTE", "F", "SOCIAL HISTORY", "Error retreiving Social History (601052)",
	"9999", "Error retreiving Social History (601052)", social_history_reply_out)	;007
	go to EXIT_SCRIPT
endif
 
    call ErrorHandler("EXECUTE", "S", "SOCIAL HISTORY", "Success retrieving Social History -- 601052", social_history_reply_out)
 
if(idebugFlag > 0)
 
	call echo(concat("GetSocialHistory Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
 
end
 
/*************************************************************************
;  Name: PostAmble(null)
;  Description: Perform any post-processing steps
;
**************************************************************************/
subroutine PostAmble(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("PostAmble Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
set shCnt = size(social_history_reply_out->activity_qual,5)
 
if(idebugFlag > 0)
 
	call echo(build("social history count: ",shCnt))
 
endif
 
/*002*/
for(x = 1 to shCnt)
	if(social_history_reply_out->activity_qual[x].shx_category_ref_id = dTobacco)
		set social_history_reply_out->activity_qual[x].shx_category_label = "Tobacco"
	elseif(social_history_reply_out->activity_qual[x].shx_category_ref_id = dAlcohol)
		set social_history_reply_out->activity_qual[x].shx_category_label = "Alcohol"
	elseif(social_history_reply_out->activity_qual[x].shx_category_ref_id = dSubstance)
		set social_history_reply_out->activity_qual[x].shx_category_label = "Substance Abuse"
	endif
endfor
 
if(idebugFlag > 0)
 
	call echo(concat("PostAmble Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
 
end
 
end go
 
