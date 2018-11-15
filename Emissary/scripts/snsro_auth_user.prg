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
 
      Source file name:     snsro_auth_user.prg
      Object name:          snsro_auth_user
 
      Program purpose:      Checks to see if user is active in database.
 
      Tables read:
 
      Tables updated:       NONE
 
      Executing from:       Emissary Service
 
      Special Notes:      NONE
 
******************************************************************************/
 /***********************************************************************
  *                   MODIFICATION CONTROL LOG                       *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
   000 9/29/14  AAB                 Initial write
   001 10/17/13 AAB                 Remove PRSNL_ID and add DisplayName
   002 04/29/16 AAB 				Added version
   003 07/05/16 AAB                 Add user demog to service
   004 10/10/16 AAB 				Add DEBUG_FLAG
   005 07/27/17 JCO					Changed %i to execute; update ErrorHandler2
   006 03/21/18 RJC					Added version code and copyright block
 ***********************************************************************/
 
drop program snsro_auth_user go
create program snsro_auth_user
 
/************************************************************************
; REQUEST
************************************************************************/
prompt
  "Output to File/Printer/MINE" = "MINE"
    ,"UserName" = ""
	, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, USERNAME, DEBUG_FLAG   ;004

/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.16.6.1" ;006
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/****************************************************************************
; DECLARED STRUCTURES
****************************************************************************/
free record user_authorization_reply_out
record user_authorization_reply_out
(
  1 username                = vc
  1 displayname             = vc
  1 position                = vc
  1 userstatus              = vc
  1 last_name               = vc
  1 first_name              = vc
  1 prsnl_id                = f8
  1 name_full_formatted     = vc
  1 prsnl_npi               = vc
  1 prsnl_alias [*]
    2 prsnl_alias_type      = vc
    2 alias                 = vc
  1 pct_flag                = i2
  1 lifetime_reltn_types[*]
    2 ppr_cd                = f8
    2 ppr_disp              = c40
    2 ppr_mean              = c12
    2 code_set              = i4
  1 visit_reltn_types[*]
    2 epr_cd                = f8
    2 epr_disp              = c40
    2 epr_mean              = c12
    2 code_set              = i4
  1 audit			 ;002
  	2 user_id					      = f8
  	2 user_firstname			  = vc
  	2 user_lastname				  = vc
  	2 patient_id				    = f8
  	2 patient_firstname			= vc
  	2 patient_lastname			= vc
  	2 service_version			  = vc
/*005 begin */
  1 status_data
    2 status = c1
    2 subeventstatus[1]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
      3 Code = c4
      3 Description = vc
/*005 end */
) with protect
 
 
set user_authorization_reply_out->status_data->status = "F"
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
declare sUserName   = vc with protect, constant($USERNAME)
declare aliasCnt    = i4 with protect, noconstant (0)
declare pReltnCnt     = i4 with protect, noconstant (0)
declare eReltnCnt     = i4 with protect, noconstant (0)
declare dPrsnlNPITypeCd = f8 with protect, constant(uar_get_code_by("MEANING", 320, "NPI"))
declare dPrsnlID      = f8 with protect, noconstant(0.0)
declare dPositionCd   = f8 with protect, noconstant(0.0)
declare idebugFlag	  = i2 with protect, noconstant(0) ;004
declare section_start_dt_tm = dq8 with protect, noconstant(cnvtdatetime(curdate, curtime3))
/****************************************************************************
;INCLUDES
****************************************************************************/
;005 %i ccluserdir:snsro_common.inc
execute snsro_common 	;005
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
set idebugFlag								= cnvtint($DEBUG_FLAG)  ;004
 
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare AuthUserByUsername(null)  = null with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
 
if(sUserName != "")
    call AuthUserByUsername (null)
else
  call ErrorHandler2("VALIDATE", "F", "User ID and User Name", "User ID and User Name not defined",
  "1001", "UserId field is empty", user_authorization_reply_out)	;005
  go to EXIT_SCRIPT
endif
 
call GetReltnTypes(null)    ;003
 
set iRet = PopulateAudit(sUserName, 0.0, user_authorization_reply_out, sVersion)     ;002
 
 set user_authorization_reply_out->status_data->status = "S"
 
 /*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************
* Convert REC output to JSON
**************************************************************/
set JSONout = CNVTRECTOJSON(user_authorization_reply_out)
 
if(idebugFlag > 0)
    call echorecord(user_authorization_reply_out)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_auth_user.json")
	call echo(build2("_file : ", _file))
	call echojson(user_authorization_reply_out, _file, 0)
endif
 
if(idebugFlag > 0)
 
  call echo(JSONout)
 
endif
 
    if(validate(_MEMORY_REPLY_STRING))
    set _MEMORY_REPLY_STRING = trim(JSONout,3)
  endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: AuthUserByUsername
;  Description: Authenticate user by UserName
**************************************************************************/
subroutine AuthUserByUsername(null)
 
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("AuthUserByUsername Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
  select into "nl:"
 
    pr.person_id, pr.position_cd, pr.username
 
  from prsnl pr, prsnl_alias pa
 
  plan pr
 
  where pr.username = sUserName
 
    and pr.active_ind = 1
 
    and pr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
 
    and pr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
  join pa
 
  where pa.person_id = pr.person_id
 
  head pr.person_id
 
    aliasCnt = 0
 
    user_authorization_reply_out->prsnl_id = pr.person_id
    user_authorization_reply_out->displayname = pr.name_full_formatted
    user_authorization_reply_out->name_full_formatted = pr.name_full_formatted
    user_authorization_reply_out->last_name = pr.name_last
    user_authorization_reply_out->first_name = pr.name_first
    user_authorization_reply_out->username = pr.username
    user_authorization_reply_out->position = UAR_GET_CODE_DISPLAY(pr.position_cd)
    user_authorization_reply_out->userstatus = "ACTIVE"
 	dPositionCd = pr.position_cd
 
  detail
 
    aliasCnt = aliasCnt + 1
 
    stat = alterlist(user_authorization_reply_out->prsnl_alias,aliasCnt)
 
    user_authorization_reply_out->prsnl_alias[aliasCnt]->alias = pa.alias
 
    user_authorization_reply_out->prsnl_alias[aliasCnt]->prsnl_alias_type =
                                   UAR_GET_CODE_DISPLAY(pa.prsnl_alias_type_cd)
 
    if(pa.prsnl_alias_type_cd = dPrsnlNPITypeCd)
 
       user_authorization_reply_out->prsnl_npi = pa.alias
 
    endif
 
    user_authorization_reply_out->pct_flag = 1
 
 
   with nocounter
 
  if(curqual = 0)
  ;005 No user account found for user name passed in.  Send "F" back instead of "Z"
    call ErrorHandler2("SELECT", "F", "USERNAME", "Account validation failure",
    "1004", build("Unable to validate User Account: ",sUserName), user_authorization_reply_out) ;005
 
  go to EXIT_SCRIPT
 
  endif
 
 
 call ErrorHandler("SELECT", "S", "USERNAME", "User is active in Cerner", user_authorization_reply_out)
 
if(idebugFlag > 0)
 
	call echo(concat("AuthUserByUsername Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
 
/*************************************************************************
;  Name: GetReltnTypes
;  Description: Retrieve EPR and PPR relationship types
**************************************************************************/
subroutine GetReltnTypes(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetReltnTypes Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
 
 
  select into "nl:"
 
    p.position_cd, p.ppr_cd, c.code_set
 
  from psn_ppr_reltn p, code_value c
 
  plan p
 
  where p.active_ind = 1  and p.position_cd = dPositionCd
 
  join c
 
  where p.ppr_cd = c.code_value and c.active_ind = 1
 
  head report
 
    pReltnCnt = 0
    eReltnCnt = 0
 
  detail
 
  if (c.code_set =  331)
 
    pReltnCnt = pReltnCnt + 1
 
    stat = alterlist(user_authorization_reply_out->lifetime_reltn_types, pReltnCnt )
 
    user_authorization_reply_out->lifetime_reltn_types[pReltnCnt]->ppr_cd = p.ppr_cd
 
    user_authorization_reply_out->lifetime_reltn_types[pReltnCnt]->ppr_disp = uar_get_code_display (p.ppr_cd)
 
    user_authorization_reply_out->lifetime_reltn_types[pReltnCnt]->ppr_mean = uar_get_code_meaning (p.ppr_cd)
 
    user_authorization_reply_out->lifetime_reltn_types[pReltnCnt]->code_set = c.code_set
 
  elseif (c.code_set =  333)
 
    eReltnCnt = eReltnCnt + 1
 
    stat = alterlist(user_authorization_reply_out->visit_reltn_types, eReltnCnt)
 
    user_authorization_reply_out->visit_reltn_types[eReltnCnt]->epr_cd = p.ppr_cd
 
    user_authorization_reply_out->visit_reltn_types[eReltnCnt]->epr_disp = uar_get_code_display (p.ppr_cd)
 
    user_authorization_reply_out->visit_reltn_types[eReltnCnt]->epr_mean = uar_get_code_meaning (p.ppr_cd)
 
    user_authorization_reply_out->visit_reltn_types[eReltnCnt]->code_set = c.code_set
 
 
  endif
 
 
  with nocounter
 
if(idebugFlag > 0)
 
	call echo(concat("GetReltnTypes Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
 
end go
