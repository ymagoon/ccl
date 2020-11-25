/*************************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

**************************************************************************
	Source file name:     snsro_auth_user.prg
	Object name:          vigilanz_auth_user
	Program purpose:      Checks to see if user is active in database.
	Executing from:       Emissary Service
**************************************************************************
                   MODIFICATION CONTROL LOG
**************************************************************************
 Mod Date     Engineer	Comment
 -------------------------------------------------------------------------
 000 09/29/14 AAB  		Initial write
 001 10/17/13 AAB 		Remove PRSNL_ID and add DisplayName
 002 04/29/16 AAB 		Added version
 003 07/05/16 AAB 		Add user demog to service
 004 10/10/16 AAB 		Add DEBUG_FLAG
 005 07/27/17 JCO		Changed %i to execute; update ErrorHandler2
 006 03/21/18 RJC		Added version code and copyright block
 007 11/25/18 STV  		Added title and middle name to payload
 008 12/10/18 RJC		Made username field case insensitive, outjoin to
                        person_name and prsnl_alias tables changed structure
                        to match emissary, added specialties to match udm
 009 04/11/20 KRD       Added the following fields and changed the etntry query
 					    positon_cd, beg_effective_dt_tm, end_effective_dt_tm,
 					    AssociatedAccounts
***********************************************************************/
drop program vigilanz_auth_user go
create program vigilanz_auth_user
 
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
set sVersion = "1.21.6.2" ;006
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
  1 position_cd				= f8
  1 userstatus              = vc
  1 last_name               = vc
  1 first_name              = vc
  1 middle_name             = vc
  1 title					= vc
  1 prsnl_id                = f8
  1 name_full_formatted     = vc
  1 prsnl_npi               = vc
  1 beg_effective_dt_tm 	= dq8
  1 end_effective_dt_tm   	= dq8
  1 account_disabled    	= i4
  1	AssociatedAccounts[*]
	2  prsnl_id             = f8
	2  user_active          = i4
	2  account_disabled     = i4
	2  beg_effective_dt_tm	= dq8
	2  end_effective_dt_tm 	= dq8
  1 prsnl_alias [*]
    2 person_alias_id      	= f8
    2 person_alias_type_disp = vc
    2 alias                 = vc
  1 pct_flag                = i2
  1 reltn_types[*]
    2 id                	= f8
    2 name              	= vc
    2 description           = vc
    2 code_set              = i4
  1 specialties[*]
  	2 id					= f8
  	2 name					= vc
  1 audit			 ;002
  	2 user_id				= f8
  	2 user_firstname		= vc
  	2 user_lastname			= vc
  	2 patient_id			= f8
  	2 patient_firstname		= vc
  	2 patient_lastname		= vc
  	2 service_version		= vc
  1 status_data
    2 status 				= c1
    2 subeventstatus[1]
      3 OperationName 		= c25
      3 OperationStatus 	= c1
      3 TargetObjectName 	= c25
      3 TargetObjectValue 	= vc
      3 Code 				= c4
      3 Description 		= vc
) with protect
 
set user_authorization_reply_out->status_data->status = "F"
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
declare sUserName   	= vc with protect, constant($USERNAME)
declare aliasCnt    	= i4 with protect, noconstant (0)
declare pReltnCnt    	= i4 with protect, noconstant (0)
declare eReltnCnt     	= i4 with protect, noconstant (0)
declare dPrsnlNPITypeCd = f8 with protect, constant(uar_get_code_by("MEANING", 320, "NPI"))
declare dPrsnlID      	= f8 with protect, noconstant(0.0)
declare dPositionCd   	= f8 with protect, noconstant(0.0)
declare iDebugFlag	  	= i2 with protect, noconstant(0) ;004
declare section_start_dt_tm = dq8 with protect, noconstant(cnvtdatetime(curdate, curtime3))
declare c_name_type_cd 	= f8 with protect,  constant(uar_get_code_by("MEANING",  213, "CURRENT"))
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
set iDebugFlag								= cnvtint($DEBUG_FLAG)  ;004
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare AuthUserByUsername(null)  	= null with protect
declare GetReltnTypes(null)		  	= null with protect
declare GetSpecialties(null)		= null with protect
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
;Validate username exists
if(sUserName != "")
    call AuthUserByUsername (null)
else
  call ErrorHandler2("VALIDATE", "F", "User ID and User Name", "User ID and User Name not defined",
  "1001", "UserId field is empty", user_authorization_reply_out)	;005
  go to EXIT_SCRIPT
endif
 
; Get Relationships
call GetReltnTypes(null)
 
; Get Specialties
call GetSpecialties(null)
 
; Populate Audit
set iRet = PopulateAudit(sUserName, 0.0, user_authorization_reply_out, sVersion)     ;002
 
; Set final status
set user_authorization_reply_out->status_data->status = "S"
 
 /*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************
* Convert REC output to JSON
**************************************************************/
set JSONout = CNVTRECTOJSON(user_authorization_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
    call echorecord(user_authorization_reply_out)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_auth_user.json")
	call echo(build2("_file : ", _file))
	call echojson(user_authorization_reply_out, _file, 0)
	call echo(JSONout)
endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: AuthUserByUsername
;  Description: Authenticate user by UserName
**************************************************************************/
subroutine AuthUserByUsername(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("AuthUserByUsername Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	select into "nl:"
		pr.person_id, pr.active_ind, pr.end_effective_dt_tm
	from prsnl pr
		,prsnl_alias pa
		,person_name pn
	plan pr where cnvtlower(pr.username) = cnvtlower(sUserName)
		;and pr.active_ind = 1
		;and pr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		;and pr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	join pn where pn.person_id = outerjoin(pr.person_id)
		and pn.name_type_cd = outerjoin(c_name_type_cd)
		and pn.name_type_seq = outerjoin(1)
		and pn.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		and pn.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
	join pa where pa.person_id = outerjoin(pr.person_id)
		and pa.active_ind = outerjoin(1)
		and pa.end_effective_dt_tm > outerjoin(sysdate)
	order by  pr.active_ind desc, pr.end_effective_dt_tm desc
 	head report
 	 	aaCnt = 0
 	 	aacnts = 0
	head pr.person_id 
		aaCnt = aaCnt + 1
		if (aaCnt = 1)
	 		user_authorization_reply_out->prsnl_id = pr.person_id
	 		user_authorization_reply_out->position_cd  = pr.position_cd
	 		user_authorization_reply_out->beg_effective_dt_tm = pr.beg_effective_dt_tm
	 		user_authorization_reply_out->end_effective_dt_tm = pr.end_effective_dt_tm
			user_authorization_reply_out->displayname = pr.name_full_formatted
			user_authorization_reply_out->name_full_formatted = pr.name_full_formatted
			user_authorization_reply_out->last_name = pr.name_last
			user_authorization_reply_out->first_name = pr.name_first
			user_authorization_reply_out->username = pr.username
			user_authorization_reply_out->position = uar_get_code_display(pr.position_cd)
			if(pr.active_ind = 1)
				user_authorization_reply_out->userstatus = "ACTIVE"
			else
				user_authorization_reply_out->userstatus = "INACTIVE"
			endif
			user_authorization_reply_out->middle_name = trim(pn.name_middle)
			user_authorization_reply_out->title = trim(pn.name_title)
			user_authorization_reply_out->pct_flag = 1
			dPositionCd = pr.position_cd
			if (pr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3))
				user_authorization_reply_out->account_disabled  = 1
			endif
		else
			aaCnts = aaCnts + 1
			stat = alterlist(user_authorization_reply_out->AssociatedAccounts,aaCnts)
			user_authorization_reply_out->AssociatedAccounts[aaCnts]->prsnl_id = pr.person_id
			user_authorization_reply_out->AssociatedAccounts[aaCnts]->user_active = pr.active_ind
			if (pr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3))
				user_authorization_reply_out->AssociatedAccounts[aaCnts]->account_disabled  = 1
			endif
			user_authorization_reply_out->AssociatedAccounts[aaCnts]->beg_effective_dt_tm = pr.beg_effective_dt_tm
			user_authorization_reply_out->AssociatedAccounts[aaCnts]->end_effective_dt_tm = pr.end_effective_dt_tm
		endif
	detail
		if(pa.prsnl_alias_type_cd > 0)
			aliasCnt = aliasCnt + 1
			stat = alterlist(user_authorization_reply_out->prsnl_alias,aliasCnt)
			user_authorization_reply_out->prsnl_alias[aliasCnt]->alias = pa.alias
			user_authorization_reply_out->prsnl_alias[aliasCnt]->person_alias_type_disp =
				uar_get_code_display(pa.prsnl_alias_type_cd)
			user_authorization_reply_out->prsnl_alias[aliasCnt]->person_alias_id = pa.prsnl_alias_type_cd
			if(pa.prsnl_alias_type_cd = dPrsnlNPITypeCd)
				user_authorization_reply_out->prsnl_npi = pa.alias
			endif
		endif
 
	with nocounter
 
	if(curqual = 0)
		;005 No user account found for user name passed in.  Send "F" back instead of "Z"
		call ErrorHandler2("SELECT", "F", "USERNAME", "Account validation failure",
		"1004", build("Unable to validate User Account: ",sUserName), user_authorization_reply_out) ;005
		go to EXIT_SCRIPT
	endif
 
	call ErrorHandler("SELECT", "S", "USERNAME", "User is active in Cerner", user_authorization_reply_out)
 
	if(iDebugFlag > 0)
		call echo(concat("AuthUserByUsername Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetReltnTypes
;  Description: Retrieve EPR and PPR relationship types
**************************************************************************/
subroutine GetReltnTypes(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetReltnTypes Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	select into "nl:"
	  	p.position_cd, p.ppr_cd, c.code_set
	from psn_ppr_reltn p, code_value c
	plan p where p.active_ind = 1  and p.position_cd = dPositionCd
	join c where p.ppr_cd = c.code_value and c.active_ind = 1
	head report
		x = 0
	detail
		x = x + 1
	    stat = alterlist(user_authorization_reply_out->reltn_types, x)
 
	    user_authorization_reply_out->reltn_types[x]->id = p.ppr_cd
	    user_authorization_reply_out->reltn_types[x]->name = uar_get_code_display (p.ppr_cd)
	    user_authorization_reply_out->reltn_types[x]->description = uar_get_code_description (p.ppr_cd)
	    user_authorization_reply_out->reltn_types[x]->code_set = c.code_set
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetReltnTypes Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end ;End Sub
 
/*************************************************************************
;  Name: GetSpecialties(null)  = null
;  Description: Get specialties
**************************************************************************/
subroutine GetSpecialties(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetSpecialties Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	select distinct into "nl:"
		pr.person_id
		, pg.prsnl_group_type_cd
	from prsnl_group pg
		 ,prsnl_group_reltn pgr
		 ,prsnl pr
	plan pr where pr.person_id = user_authorization_reply_out->prsnl_id
	join pgr where pgr.person_id = pr.person_id
		and pgr.active_ind = 1
	join pg where pg.prsnl_group_id = pgr.prsnl_group_id
		and pg.active_ind = 1
	head report
		x = 0
	detail
		if(pg.prsnl_group_type_cd > 0)
			x = x + 1
			stat = alterlist(user_authorization_reply_out->specialties,x)
 
			user_authorization_reply_out->specialties[x].id = pg.prsnl_group_type_cd
			user_authorization_reply_out->specialties[x].name = uar_get_code_display(pg.prsnl_group_type_cd)
		endif
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetSpecialties Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end ;End Sub
end go
 