/*~BB~**********************************************************************************
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
  ~BE~***********************************************************************************/
/*****************************************************************************************
      Source file name:    	snsro_get_registries
      Object name:         	snsro_get_registries
      Program purpose:      Get patient registries defined by the health system
      Tables read:          AC_CLASS_PERSON_RELTN, PERSON
      Tables updated:       NONE
      Executing from:       MPages Discern Web Service
      Special Notes:      	NONE
******************************************************************************/
 /***********************************************************************
 *                   MODIFICATION CONTROL LOG                      *
 ***********************************************************************
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
  001 11/06/17 RJC				    Initial creation
  002 03/22/18 RJC					Added version code and copyright block
 ***********************************************************************/
/**********************************************************************/
drop program snsro_get_registries go
create program snsro_get_registries
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username:" = ""        		;required
		, "Registry Id" = 0.0			; required
		, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, USERNAME, REG_ID, DEBUG_FLAG
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.16.6.1" ;002
if($OUTDEV = "VERSION")
	go to exit_version
endif

/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record pat_reg_rep_out
record pat_reg_rep_out (
	1 patients[*]
		2 patient_added_dt_tm = dq8
		2 last_updated_dt_tm = dq8
		2 person
			3 person_id = f8
			3 name_full_formatted = vc
			3 name_last = vc
			3 name_first = vc
			3 name_middle = vc
			3 mrn = vc
			3 dob = dq8
			3 gender
				4 id = f8
				4 name = vc
	1 audit
	    2 user_id           = f8
	    2 user_firstname    = vc
	    2 user_lastname     = vc
	    2 patient_id        = f8
	    2 patient_firstname = vc
	    2 patient_lastname  = vc
	    2 service_version   = vc
	  1 status_data
	    2 status 				= c1
	    2 subeventstatus[1]
	      3 OperationName 		= c25
	      3 OperationStatus 	= c1
	      3 TargetObjectName	= c25
	      3 TargetObjectValue	= vc
	      3 Code 				= c4
	      3 Description 		= vc
 
)
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
declare sUserName			= vc with protect, noconstant("")
declare dRegistryId			= f8 with protect, noconstant(0.0)
declare iDebugFlag			= i2 with protect, noconstant(0)
 
/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
set dRegistryId	= cnvtreal($REG_ID)
set iDebugFlag = cnvtint($DEBUG_FLAG)

/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetPatients(null)		= i2 with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
if(dRegistryId > 0)
	; Validate username
		set iRet = PopulateAudit(sUserName, 0.00, pat_reg_rep_out, sVersion)
		if(iRet = 0)
	  	  call ErrorHandler2("GET PATIENTS", "F", "User is invalid", "Invalid User for Audit.",
	  	  "1001",build("Invalid user: ",sUserName), pat_reg_rep_out)
	  	  go to exit_script
		endif
 
	; Get Patients by Registry Id
		set iRet = GetPatients(null)
		if(iRet = 0)
			  call ErrorHandler2("GET PATIENTS", "F", "Registry Search", "No Patients Found.",
			  "9999","No Patients Found", pat_reg_rep_out)
			  go to exit_script
		endif
 
	; Transaction is successful Update status
		call ErrorHandler2("GET PATIENTS", "S", "SUCCESS","Get Patient Registries processed successfully" ,
		"0000", "Get Patient Registries processed successfully" , pat_reg_rep_out)
else
	 call ErrorHandler2("GET PATIENTS", "F", "Validate", "Missing Registry Id.",
	 "2055","Missing Registry Id", pat_reg_rep_out)
	 go to exit_script
endif

#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON - Future functionality if this turns into an API call
**************************************************************************/
  if(idebugFlag > 0)
	  call echorecord(pat_reg_rep_out)
 
	  set file_path = logical("ccluserdir")
	  set _file = build2(trim(file_path),"/snsro_get_patient_registries_discovery.json")
	  call echo(build2("_file : ", _file))
	  call echojson(pat_reg_rep_out, _file, 0)
	  call echorecord(reqinfo,_file,1)
  endif
 
  set JSONout = CNVTRECTOJSON(pat_reg_rep_out)
 
  if(idebugFlag > 0)
	call echo(JSONout)
  endif
 
   if(validate(_MEMORY_REPLY_STRING))
    set _MEMORY_REPLY_STRING = trim(JSONout,3)
  endif
 
#EXIT_VERSION
/*************************************************************************
; SUBROUTINES
**************************************************************************/
 
/*************************************************************************
;  Name: GetPatients(null)
;  Description:  Get registries built in the health system
**************************************************************************/
subroutine GetPatients(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetPatients Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
 
	select into "nl:"
	from ac_class_person_reltn acp
	, person p
	, person_alias pa
	plan acp where acp.ac_class_def_id = dRegistryId
	join p where p.person_id = acp.person_id
	join pa where pa.active_ind = 1
			and pa.beg_effective_dt_tm < sysdate
			and pa.end_effective_dt_tm > sysdate
			and pa.person_alias_type_cd = value(uar_get_code_by("MEANING",4,"MRN"))
	head report
		x = 0
	detail
		x = x + 1
		stat = alterlist(pat_reg_rep_out->patients,x)
 
		pat_reg_rep_out->patients[x].last_updated_dt_tm = acp.updt_dt_tm
		pat_reg_rep_out->patients[x].patient_added_dt_tm = acp.begin_effective_dt_tm
		pat_reg_rep_out->patients[x].person.person_id = p.person_id
		pat_reg_rep_out->patients[x].person.mrn = pa.alias
		pat_reg_rep_out->patients[x].person.name_full_formatted = p.name_full_formatted
		pat_reg_rep_out->patients[x].person.name_last = p.name_last
		pat_reg_rep_out->patients[x].person.name_first = p.name_first
		pat_reg_rep_out->patients[x].person.name_middle = p.name_middle
		pat_reg_rep_out->patients[x].person.dob = p.birth_dt_tm
		pat_reg_rep_out->patients[x].person.gender.id = p.sex_cd
		pat_reg_rep_out->patients[x].person.gender.name = uar_get_code_display(p.sex_cd)
	foot report
		iValidate = x
	with nocounter
 
	if(idebugFlag > 0)
		call echo(concat("GetPatients Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
end ;End Subroutine
 
 
end go
set trace notranslatelock go
 
