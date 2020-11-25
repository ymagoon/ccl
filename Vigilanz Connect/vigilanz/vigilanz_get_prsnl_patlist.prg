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
                                                                     *
  ~BE~***********************************************************************/
/*****************************************************************************
      Source file name:    	snsro_get_prsnl_patlist.prg
      Object name:         	vigilanz_get_prsnl_patlist
      Program purpose:      Returns active patient lists by prsnl.
      Tables read:          DCP_PATIENT_LIST, DCP_PL_ARGUMENT
      Tables updated:       NONE
      Executing from:       Emissary Service
      Special Notes:	    NONE
******************************************************************************/
 /***********************************************************************
 *                   MODIFICATION CONTROL LOG                		   *
 ***********************************************************************
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
  000 8/25/14  AAB					Initial creation
  001 9/25/14  AAB					Add Patient List type as input param
  002 10/19/14 AAB                  Remove Prsnl_id from input param
  003 11/10/14 AAB					Updated Patient_List_Types
  004 12/27/14 AAB                  Added group_name to reply and set to PL_Type
  005 12/31/14 AAB					Changed the PL_TYPE enums to start at 0
  006 01/13/15 JCO					Added logic to return all PLs for Custom Type
  007 02/18/15 AAB 					Changed enumerations for PL_TYPE to start at 1
  008 03/03/15 AAB 					Corrected the display_seq on Patient List
  009 06/24/15 JCO					Added SUB_LIST to account for possible nested lists
  010 01/12/15 AAB 					Make username case insensitive
  011 02/23/16 JCO					Added logic for Custom/Proxy patient lists
  012 04/29/16 AAB 					Added version
  013 10/10/16 AAB 					Add DEBUG_FLAG
  014 07/27/17 JCO					Changed %i to execute; update ErrorHandler2
  015 03/21/18 RJC					Added version code and copyright block
  016 09/09/19 RJC                  Renamed file and object
 ***********************************************************************/
;drop program snsro_get_pat_list_by_prsnl go
drop program vigilanz_get_prsnl_patlist go
create program vigilanz_get_prsnl_patlist
 
/************************************************************************
; REQUEST
************************************************************************/
prompt
  "Output to File/Printer/MINE" = "MINE"
    , "UserName" = ""
	, "Patient List Type" = 1
	, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, USERNAME, PL_TYPE, DEBUG_FLAG   ;013

/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2" ;015
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/****************************************************************************
; DECLARED STRUCTURES
****************************************************************************/
free record patientlists_reply_out
record patientlists_reply_out
(
	1 Group_name						= vc
	1 patient_list[*]
		2 patient_list_id 				= f8
		2 name 							= vc
		2 description 					= vc
		2 patient_list_type  			= vc
		2 owner_id 						= f8
		2 display_seq					= c10
		2 sub_list[*]									;009
			3 patient_list_id			= f8			;009
			3 name						= vc			;009
			3 description				= vc			;009
			3 patient_list_type			= vc			;009
			3 owner_id 					= f8			;009
			3 display_seq				= c10			;009
    1 audit		;012
		2 user_id					= f8
		2 user_firstname			= vc
		2 user_lastname				= vc
		2 patient_id				= f8
		2 patient_firstname			= vc
		2 patient_lastname			= vc
	    2 service_version			= vc
/*014 begin */
  1 status_data
    2 status = c1
    2 subeventstatus[1]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
      3 Code = c4
      3 Description = vc
/*014 end */
) with protect
 
free record patient_list_temp
record patient_list_temp
(
	1 patient_list[*]
		2 patient_list_id 				= f8
		2 name 							= vc
		2 description 					= vc
		2 patient_list_type  			= vc
		2 owner_id 						= f8
		2 display_seq					= c10
)
 
 
 
set patientlists_reply_out->status_data->status = "F"
 
/*************************************************************************
 ; DECLARE VARIABLES
**************************************************************************/
 
declare dPrsnlID  					= f8 with protect, noconstant(0.0)
declare sUserName 					= vc with protect, noconstant("")
declare plCnt 						= i4 with protect, noconstant (0)
declare iAPP_NUMBER 				= i4 with protect, constant(600005)
declare sVIEW_NAME					= vc with protect, constant("PATLISTVIEW")
declare sNAME						= vc with protect, constant("VIEW_CAPTION")
declare sDISPLAY_SEQ				= vc with protect, constant("DISPLAY_SEQ")
declare plType 						= i2 with protect, noconstant(0)
declare plTypeCd					= f8 with protect, noconstant(0.0)
declare dPrvGrpCd 					= f8 with protect, constant(uar_get_code_by("MEANING", 27360, "PROVIDERGRP"))
declare dLocGrpCd 					= f8 with protect, constant(uar_get_code_by("MEANING", 27360, "LOCATIONGRP"))
declare dCustomCd 					= f8 with protect, constant(uar_get_code_by("MEANING", 27360, "CUSTOM"))
declare dServiceCd 					= f8 with protect, constant(uar_get_code_by("MEANING", 27360, "SERVICE"))
declare dAssignmentCd 				= f8 with protect, constant(uar_get_code_by("MEANING", 27360, "ASSIGNMENT"))
declare idebugFlag					= i2 with protect, noconstant(0) ;013
 
/****************************************************************************
 ;INCLUDES
 ****************************************************************************/
 
;014 %i ccluserdir:snsro_common.inc
execute snsro_common		;014
 
/****************************************************************************
 ;INITIALIZE
 ****************************************************************************/
set sUserName				= $USERNAME
set plType					= $PL_TYPE
set idebugFlag				= cnvtint($DEBUG_FLAG)  ;013
 
if(idebugFlag > 0)
 
	call echo(build("Patient List Type --->", plType))
 
endif
 
 
case(plType)
	of 1:
		set plTypeCd = 0
		set patientlists_reply_out->group_name = "My List"
 
	of 2:
		set plTypeCd = dPrvGrpCd
		set patientlists_reply_out->group_name = "Provider Group"
	of 3:
		set plTypeCd = dCustomCd
		set patientlists_reply_out->group_name = "Custom"
	of 4:
		set plTypeCd = 3  ;This is Recent patients and nothing should happen in this call
	    call ErrorHandler2("VALIDATE", "F", "PATIENTLIST", "Invalid Patient List Type",
	    "2034", build("Invalid Patient List Type: ",plTypeCd), patientlists_reply_out)	;014
		if(idebugFlag > 0)
 
			call echorecord(patientlists_reply_out)
 
		endif
 
		go to EXIT_SCRIPT
	of 5:
		set plTypeCd = dAssignmentCd
		set patientlists_reply_out->group_name = "Assignment"
	of 6:
		set plTypeCd = dServiceCd
		set patientlists_reply_out->group_name = "Service"
	of 7:
		set plTypeCd = 1		;All Patient Lists
		set patientlists_reply_out->group_name = "All Patient Lists"
 
endcase
 
 
 
/****************************************************************************
 ; DECLARED SUBROUTINES
****************************************************************************/
declare getPatListByUserName(null) 	= null with protect
declare getPatListByUserID(null) 	= null with protect
;declare getCustomPatListByUserID(null = null with protect	;011
 
/*****************************************************************************/
 ;CALL SUBROUTINES
/*****************************************************************************/
if (sUserName !="")
 
	call getPatListByUserName(null)
	;call getCustomPatListByUserID(null)	;011
 
else
 
	call ErrorHandler2("VALIDATE", "F", "PATIENTLIST", build("Username is invalid: ", sUserName),
	"1001", build("UserId is invalid: ", sUserName), patientlists_reply_out)	;014
	go to EXIT_SCRIPT
 
endif
 
set  dPersonID = 0.0		;012
 
set iRet = PopulateAudit(sUserName, dPersonID, patientlists_reply_out, sVersion)   ;012
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(patientlists_reply_out)
 
if(idebugFlag > 0)
 
 	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_pat_list_by_prsnl.json")
	call echo(build2("_file : ", _file))
	call echojson(patientlists_reply_out, _file, 0)
 
    call echorecord(patientlists_reply_out)
	call echo(JSONout)
 
endif
 
    if(validate(_MEMORY_REPLY_STRING))
		set _MEMORY_REPLY_STRING = trim(JSONout,3)
	endif
 
#EXIT_VERSION
/*****************************************************************************/
 ;  Name: getPatListByUserID(null)
 ;  Description: Retrieve Patient List by PrsnlID
/*****************************************************************************/
 
Subroutine getPatListByUserID(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("getPatListByUserID Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
if(idebugFlag > 0)
 
   call echo(build(" prsnl_id -> ",dPrsnlID))
   call echo(build(" Patient List Type -> ",plType))
   call echo(build(" Patient List Type Code -> ",plTypeCd))
 
endif
 
    call parser ("Select into 'nl:'")
 
	call parser("dpl.*")
 
	call parser("from dcp_patient_list dpl")
 
	if(plTypeCd = 0)
 
		call parser("where dpl.owner_prsnl_id = dPrsnlID")
 
	elseif(plTypeCd = 1)
 
		call parser("where dpl.patient_list_id > 0")
/*003 Begin*/
	elseif(plTypeCd = dCustomCd)
 
		call parser("where dpl.owner_prsnl_id = dPrsnlID")
/*003 End*/
	else
 
		call parser("where dpl.owner_prsnl_id = dPrsnlID and dpl.patient_list_type_cd = plTypeCd")
 
	endif
 
    call parser("head report")
 
	call parser("plCnt = 0")
 
	call parser("detail")
 
    call parser("plCnt = plCnt + 1")
 
    call parser("if (mod(plCnt, 5) = 1)")
 
	call parser("stat = alterlist(patient_list_temp->patient_list, plCnt + 4)")
 
	call parser("endif")
 
 
		call parser("patient_list_temp->patient_list[plCnt]->patient_list_id 				=  dpl.patient_list_id")
 
		call parser("patient_list_temp->patient_list[plCnt]->name 							=  dpl.name")
 
		call parser("patient_list_temp->patient_list[plCnt]->description 					=  dpl.description")
 
		call parser("patient_list_temp->patient_list[plCnt]->patient_list_type  =  UAR_GET_CODE_DISPLAY(dpl.patient_list_type_cd)")
 
		call parser("patient_list_temp->patient_list[plCnt]->owner_id 						=  dpl.owner_prsnl_id")
 
 		call parser("patient_list_temp->patient_list[plCnt]->display_seq					=  '0'")
 
	call parser("with nocounter go")
 
 	set stat = alterlist(patient_list_temp->patient_list, plCnt)
 
	if(curqual = 0)
 
		call ErrorHandler2("EXECUTE", "F", "PATIENTLIST", "Patient List does not exist for user",
		"2002", build("Patient List not found for UserId: ", sUserName), patientlists_reply_out)	;014
		go to EXIT_SCRIPT
 
	endif
 
if(idebugFlag > 0)
 
	call echo(build(" Number of PL's found  -> ",plCnt))
 
endif
 
free record temp
record temp
 
(
	1 prefs[*]
	 	2 parent_id				= f8
		2 vals[*]
			3 seq 				= vc
			3 name				= vc
)
 
 
	select into "nl:"
 
		nvp.*
 
	from view_prefs vp, name_value_prefs nvp
 
	plan vp
 
	where vp.application_number = iAPP_NUMBER and vp.prsnl_id = dPrsnlID and vp.View_name = sVIEW_NAME
 
	join nvp
 
	where nvp.PARENT_ENTITY_ID = vp.view_prefs_id and nvp.pvc_name in(sDISPLAY_SEQ, sNAME)
 
	order by nvp.parent_entity_id	;011 -- added order by to fix sorting of view + seq together in temp->prefs array
 
	head report
 
	i = 0
 
	head nvp.PARENT_ENTITY_ID
 
	i = i + 1
 
	stat = alterlist(temp->prefs, i)
 
	temp->prefs[i]->parent_id = nvp.parent_entity_id
 
	detail
 
		case (nvp.pvc_name)
 
			of "DISPLAY_SEQ":
 
				stat = alterlist(temp->prefs[i]->vals, 1)
				temp->prefs[i]->vals[1]->seq = nvp.pvc_value
 
			of "VIEW_CAPTION":
 
				stat = alterlist(temp->prefs[i]->vals, 1)
				temp->prefs[i]->vals[1]->name = nvp.pvc_value
 
		endcase
 
 	with nocounter
 
if(idebugFlag > 0)
 
 	call echorecord(temp)
 	call echorecord(patient_list_temp)
 
endif
 
 ; Populate display sequence
	set i = 0
	set tempCnt = size(temp->prefs, 5)
	set ptlistCnt = size(patient_list_temp->patient_list, 5)
 
if(idebugFlag > 0)
 
	call echo(build("tempCnt: ",tempCnt))
	call echo(build("ptlistCnt: ",ptlistCnt))
 
endif
 
	set tempFound = 0	;011 - new variable to track un-matched lists from view prefs to dcp_patient_list query
 
 	for (y = 1 to tempCnt)
	 	set tempFound = 0	 ;011
	 	for (x = 1 to ptlistCnt)
	 		;call echo(build("PL PVC Name: ", patientlists_reply_out->patient_list[x]->name))
			if(trim(patient_list_temp->patient_list[x]->name,3) = trim(temp->prefs[y]->vals[1]->name,3))
				set i = i + 1
				set stat = alterlist(patientlists_reply_out->patient_list, i)
				set patientlists_reply_out->patient_list[i]->display_seq   = temp->prefs[y]->vals[1]->seq
				set patientlists_reply_out->patient_list[i]->patient_list_id    = patient_list_temp->patient_list[x]->patient_list_id
 				set patientlists_reply_out->patient_list[i]->name 			   = patient_list_temp->patient_list[x]->name
 				set patientlists_reply_out->patient_list[i]->description  	   = patient_list_temp->patient_list[x]->description
				set patientlists_reply_out->patient_list[i]->patient_list_type  = patient_list_temp->patient_list[x]->patient_list_type
				set patientlists_reply_out->patient_list[i]->owner_id 		   = patient_list_temp->patient_list[x]->owner_id
 
 				set tempFound = 1	;011
			endif
		endfor
		/*011 Begin*/
		if(tempFound = 0)
		;This patient list was found in the view preferencs, but not in the list from dcp_patient_list which means this is a
		;custom or proxy list.  Need to add this list to patientlists_reply_out as CUSTOM list type
			set i = i + 1
			set stat = alterlist(patientlists_reply_out->patient_list,i)
			set patientlists_reply_out->patient_list[i]->display_seq   = temp->prefs[y]->vals[1]->seq
			set patientlists_reply_out->patient_list[i]->name = temp->prefs[y]->vals[1]->name
 
			select into "nl:"
				vp.view_seq
				,dp.detail_prefs_id
			from view_prefs vp
				,detail_prefs dp
				,name_value_prefs nvp
				,dcp_patient_list dpl
 
			plan vp
			where vp.view_prefs_id = temp->prefs[y]->parent_id
 
			join dp
			where dp.prsnl_id = dPrsnlID
				and dp.view_seq = vp.view_seq
				and dp.view_name = "PATLISTVIEW"
				and dp.comp_name = "CUSTOM"
			join nvp
			where nvp.parent_entity_id = dp.detail_prefs_id
				and nvp.pvc_name = "PatientListId"
			join dpl
			where dpl.patient_list_id = cnvtint(nvp.pvc_value)
 
			detail
				patientlists_reply_out->patient_list[i].patient_list_id = dpl.patient_list_id
				patientlists_reply_out->patient_list[i].description = dpl.description
				patientlists_reply_out->patient_list[i].patient_list_type = UAR_GET_CODE_DISPLAY(dpl.patient_list_type_cd)
				patientlists_reply_out->patient_list[i].owner_id = dpl.owner_prsnl_id
			with nocounter
 
 
		endif /*011 end*/
 	endfor
 
    set patientlists_reply_out->status_data->status = "S"
    call ErrorHandler("EXECUTE", "S", "Patient List retrieved", "Success retrieving Patient List(s)", patientlists_reply_out)
 
if(idebugFlag > 0)
 
	call echo(concat("getPatListByUserID Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
 
 
/*****************************************************************************/
;  Name: getPatListByUserName(null)
;  Description: Retrieve Patient List by UserName
/*****************************************************************************/
subroutine getPatListByUserName(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("getPatListByUserName Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
	select into "nl:"
 
		p.person_id
 
	from prsnl p
 
	where cnvtupper(p.username) = cnvtupper(trim(sUserName,3))  ;010
 
	detail
 
	dPrsnlID = p.person_id
 
	with nocounter
 
    if(curqual > 0)
 
		call getPatListByUserID(null)
 
	else
 
		call ErrorHandler2("VALIDATE", "F", "PATIENTLIST", build("Username is invalid: ", sUserName),
		"1001", build("UserId is invalid: ", sUserName), patientlists_reply_out)	;014
 
		go to EXIT_SCRIPT
 
	endif
 
if(idebugFlag > 0)
 
	call echo(concat("getPatListByUserName Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
end go
 
 
