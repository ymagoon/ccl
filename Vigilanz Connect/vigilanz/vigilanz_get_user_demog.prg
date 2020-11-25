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

 ~BE~***********************************************************************/
/*****************************************************************************
          Date Written:       08/25/14
          Source file name:   vigilanz_get_user_demog
          Object name:        vigilanz_get_user_demog
          Request #:
          Program purpose:    Returns PRSNL information
                              when sent a PRSNL_ALIAS or  PRSNL_ID
          Tables read:        PRSNL, PRSNL_ALIAS
          Tables updated:     NONE
          Executing from:     EMISSARY SERVICES
          Special Notes:	  NONE
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
  000 8/25/14  AAB					Initial write
  001 9/14/14  AAB					Return lifetime and visit relationship
  002 10/24/14 AAB					Remove PRSNLID from Input
  003 11/03/14 AAB          		Add NAME_FULL_FORMATTED. Change reply_out name
  004 02/27/15 AAB 					Use new utility method GetPrsnlIDfromUserName to
									retrieve Prsnl_ID from Username
  005 03/03/15 JCO					Added NPI as input search parameter
  006 03/06/15 JCO					Added PCTFlag to output record
  007 03/31/15 AAB 					Added notranslatelock
  008 08/26/15 JCO					Added OUTERJOIN to PRSNL_ALIAS join
  009 04/29/16 AAB 					Added version
  010 10/10/16 AAB	 				Add DEBUG_FLAG
  011 07/27/17 JCO					Changed %i to execute; update ErrorHandler2
  012 03/22/18 RJC					Added version code and copyright block
 ***********************************************************************/
drop program vigilanz_get_user_demog go
create program vigilanz_get_user_demog

prompt
 
  "Output to File/Printer/MINE" = "MINE"
 
    ,"UserName" = ""
    ,"NPI" = ""
	,"Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, USERNAME, NPI, DEBUG_FLAG   ;010
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2" ;012
if($OUTDEV = "VERSION")
	go to exit_version
endif

/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record user_demographics_reply_out
record user_demographics_reply_out
(
   1 personnel_info[*]
	  2 prsnl_id						    = f8
      2 last_name                			= vc
      2 first_name       			   		= vc
      2 username                 			= vc
      2 name_full_formatted      			= vc
	  2 prsnl_position	 				    = vc
      2 prsnl_npi                  			= vc
	  2 prsnl_alias [*]
		  3 prsnl_alias_type				= vc
		  3 alias							= vc
	  2 pct_flag							= i2
	  2 lifetime_reltn_types[*]
	  	3 ppr_cd						    = f8
		  3 ppr_disp						= c40
		  3 ppr_mean						= c12
		  3 code_set						= i4
	  2 visit_reltn_types[*]
		  3 epr_cd						    = f8
		  3 epr_disp				        = c40
		  3 epr_mean			   	        = c12
		  3 code_set						= i4
    1 audit			 ;009
		2 user_id					= f8
		2 user_firstname			= vc
		2 user_lastname				= vc
		2 patient_id				= f8
		2 patient_firstname			= vc
		2 patient_lastname			= vc
	    2 service_version			= vc
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
 
set user_demographics_reply_out->status_data->status = "F"
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
declare sUserName 		= vc with protect, constant($USERNAME)
declare sNPI			= vc with protect, constant($NPI) 		;005
declare dPrsnlID  		= f8 with protect, noconstant(0.0)
declare aliasCnt 		= i4 with protect, noconstant (0)
declare pReltnCnt 		= i4 with protect, noconstant (0)
declare eReltnCnt 		= i4 with protect, noconstant (0)
declare dPrsnlNPITypeCd = f8 with protect, constant(uar_get_code_by("MEANING", 320, "NPI"))
declare dPositionCd  	= f8 with protect, noconstant(0.0)
declare idebugFlag		= i2 with protect, constant($DEBUG_FLAG) ;010
declare section_startDtTm	= dq8 with protect, constant(cnvtdatetime(curdate,curtime3))
/****************************************************************************
;INCLUDES
****************************************************************************/
;011 %i ccluserdir:snsro_common.inc
execute snsro_common	;011
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
 
if(sUsername != "")
	set dPrsnlID = GetPrsnlIDfromUserName(sUserName)
elseif(sNPI != "")
	set dPrsnlID = GetPrsnlIDfromNPI(sNPI)				;005
else
	call ErrorHandler2("VALIDATE", "F", "USER"
			,"Username and NPI not valid or not provided",
			"1001", build("UserId is invalid: ", sUserName), user_demographics_reply_out)	;011
	go to EXIT_SCRIPT
endif
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetPrsnlInfoByID(null)		= null with protect
declare GetReltnTypes(null) 		= null with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
if(dPrsnlID > 0)
	call GetPrsnlInfoByID(null)
	call GetReltnTypes(null)
 
	call ErrorHandler("EXECUTE", "S", "Username or NPI Search"
			,"User Demographics search successful", user_demographics_reply_out)
else
	call ErrorHandler2("VALIDATE", "F", "USER"
			,"Username and NPI not valid or not provided",
			"1001", build("UserId is invalid: ", sUserName), user_demographics_reply_out)	;011
	go to EXIT_SCRIPT
endif
 
set iRet = PopulateAudit("", 0.0, user_demographics_reply_out, sVersion)   ;009
 
set user_demographics_reply_out->status_data->status = "S"
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(user_demographics_reply_out)
 
if(idebugFlag > 0)
/******  Log reply to JSON file -BEGIN- *******/
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_user_demog.json")
	call echo(build2("_file : ", _file))
	call echojson(user_demographics_reply_out, _file, 0)
/******  Log reply to JSON file - END - *******/
	call echorecord(user_demographics_reply_out)
	call echo(JSONout)
 
endif
 
    if(validate(_MEMORY_REPLY_STRING))
		set _MEMORY_REPLY_STRING = trim(JSONout,3)
	endif
 
#EXIT_VERSION 
/*************************************************************************
;  Name: GetPrsnlInfoByID
;  Description: Retrieve Prsnl information by prsnl_id
**************************************************************************/
subroutine GetPrsnlInfoByID(null)
 
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetPrsnlInfoByID Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
if(idebugFlag > 0)
 
  call echo(build("Prsnl_ID -> ",dPrsnlID))
 
endif
 
  select into "nl:"
 
    p.*, pa.alias, pa.prsnl_alias_type_cd
 
  from prsnl p, prsnl_alias pa
 
  plan p
 
  where p.person_id = dPrsnlID
 
	and p.active_ind = 1
 
    and p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
 
    and p.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
  join pa
 
  where pa.person_id = outerjoin(p.person_id) ;008
 
  head report
 
    aliasCnt = 0
 
  head p.person_id
 
 	stat = alterlist(user_demographics_reply_out->personnel_info, 1)
 
    user_demographics_reply_out->personnel_info[1]->prsnl_id = p.person_id
 
    user_demographics_reply_out->personnel_info[1]->last_name = p.name_last
 
    user_demographics_reply_out->personnel_info[1]->first_name = p.name_first
 
    user_demographics_reply_out->personnel_info[1]->name_full_formatted = p.name_full_formatted
 
    user_demographics_reply_out->personnel_info[1]->prsnl_position = UAR_GET_CODE_DISPLAY(p.position_cd)
 
	dPositionCd = p.position_cd
 
	user_demographics_reply_out->personnel_info[1]->username = p.username
 
 detail
 
    aliasCnt = aliasCnt + 1
 
    if (mod(aliasCnt, 5) = 1)
 
		stat = alterlist(user_demographics_reply_out->personnel_info[1]->prsnl_alias,aliasCnt + 4)
 
	endif
 
	user_demographics_reply_out->personnel_info[1]->prsnl_alias[aliasCnt]->alias = pa.alias
 
	user_demographics_reply_out->personnel_info[1]->prsnl_alias[aliasCnt]->prsnl_alias_type =
																	 UAR_GET_CODE_DISPLAY(pa.prsnl_alias_type_cd)
 
	if(pa.prsnl_alias_type_cd = dPrsnlNPITypeCd)
 
		user_demographics_reply_out->personnel_info[1]->prsnl_npi = pa.alias
 
	endif
 
 user_demographics_reply_out->personnel_info[1]->pct_flag = 1		;006
 
  with nocounter
 
  set stat = alterlist(user_demographics_reply_out->personnel_info[1]->prsnl_alias, aliasCnt)
     call echo(build("curqual -> ",curqual))
  if(curqual = 0)
 
  	call ErrorHandler("SELECT", "Z", "USER", "User ID does not exist in Cerner", user_demographics_reply_out)
 
	go to EXIT_SCRIPT
 
   endif
 
if(idebugFlag > 0)
 
	call echo(concat("GetPrsnlInfoByID Runtime: ",
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
 
	    if (mod(pReltnCnt, 5) = 1)
 
	       stat = alterlist(user_demographics_reply_out->personnel_info[1]->lifetime_reltn_types, pReltnCnt + 4)
 
	    endif
 
		user_demographics_reply_out->personnel_info[1]->lifetime_reltn_types[pReltnCnt]->ppr_cd = p.ppr_cd
 
		user_demographics_reply_out->personnel_info[1]->lifetime_reltn_types[pReltnCnt]->ppr_disp = uar_get_code_display (p.ppr_cd)
 
		user_demographics_reply_out->personnel_info[1]->lifetime_reltn_types[pReltnCnt]->ppr_mean = uar_get_code_meaning (p.ppr_cd)
 
		user_demographics_reply_out->personnel_info[1]->lifetime_reltn_types[pReltnCnt]->code_set = c.code_set
 
 	elseif (c.code_set =  333)
 
	 	eReltnCnt = eReltnCnt + 1
 
	    if (mod(eReltnCnt, 5) = 1)
 
	       stat = alterlist(user_demographics_reply_out->personnel_info[1]->visit_reltn_types, eReltnCnt + 4)
 
	    endif
 
		user_demographics_reply_out->personnel_info[1]->visit_reltn_types[eReltnCnt]->epr_cd = p.ppr_cd
 
		user_demographics_reply_out->personnel_info[1]->visit_reltn_types[eReltnCnt]->epr_disp = uar_get_code_display (p.ppr_cd)
 
		user_demographics_reply_out->personnel_info[1]->visit_reltn_types[eReltnCnt]->epr_mean = uar_get_code_meaning (p.ppr_cd)
 
		user_demographics_reply_out->personnel_info[1]->visit_reltn_types[eReltnCnt]->code_set = c.code_set
 
 
 	endif
 
 
  with nocounter
 
   set stat = alterlist(user_demographics_reply_out->personnel_info[1]->lifetime_reltn_types, pReltnCnt)
   set stat = alterlist(user_demographics_reply_out->personnel_info[1]->visit_reltn_types, eReltnCnt)
 
if(idebugFlag > 0)
 
	call echo(concat("GetReltnTypes Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
end go
 
set trace notranslatelock go
