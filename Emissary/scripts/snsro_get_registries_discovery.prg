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
      Source file name:    	snsro_get_registries_discovery
      Object name:         	snsro_get_registries_discovery
      Program purpose:      Get patient registries defined by the health system
      Tables read:          AC_CLASS_DEF, AC_CLASS_PERSON_RELTN, PERSON
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
drop program snsro_get_registries_discovery go
create program snsro_get_registries_discovery
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username:" = ""        		;required
		, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, USERNAME, DEBUG_FLAG

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
free record registries_rep_out
record registries_rep_out (
	1 registries[*]
		2 registry_id 		= f8
		2 registry_name 	= vc
		2 registry_type
			3 id 			= f8
			3 name 			= vc
		2 registry_category
			3 id 			= f8
			3 name 			= vc
		2 valid_from_date 	= dq8
		2 valid_to_date 	= dq8
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
declare iDebugFlag			= i2 with protect, noconstant(0)
 
/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
set iDebugFlag = cnvtint($DEBUG_FLAG)
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetRegistries(null)		= i2 with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Validate username
	set iRet = PopulateAudit(sUserName, 0.00, registries_rep_out, sVersion)
	if(iRet = 0)
  	  call ErrorHandler2("GET REGISTRIES", "F", "User is invalid", "Invalid User for Audit.",
  	  "1001",build("Invalid user: ",sUserName), registries_rep_out)
  	  go to exit_script
	endif
 
; Get Registries
	set iRet = GetRegistries(null)
	if(iRet = 0)
		  call ErrorHandler2("GET REGISTRIES", "F", "Registry Search", "No Registries Found.",
		  "9999","No Registries Found", registries_rep_out)
		  go to exit_script
	endif
 
; Transaction is successful Update status
	call ErrorHandler2("REGISTRY DISCOVERY", "S", "SUCCESS","Get Patient Registries Discovery processed successfully" ,
	"0000", "Get Patient Registries Discovery processed successfully" , registries_rep_out)
 
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON - Future functionality if this turns into an API call
**************************************************************************/
  if(idebugFlag > 0)
	  call echorecord(registries_rep_out)
 
	  set file_path = logical("ccluserdir")
	  set _file = build2(trim(file_path),"/snsro_get_patient_registries_discovery.json")
	  call echo(build2("_file : ", _file))
	  call echojson(registries_rep_out, _file, 0)
	  call echorecord(reqinfo,_file,1)
  endif
 
  set JSONout = CNVTRECTOJSON(registries_rep_out)
 
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
;  Name: GetRegistries(null)
;  Description:  Get registries built in the health system
**************************************************************************/
subroutine GetRegistries(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetRegistries Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set iValidate = 0
 
	select into "nl:"
	from ac_class_def acd
		, dm_flags dm
	plan acd where acd.ac_class_def_id != 0.00
	join dm where dm.flag_value = acd.class_type_flag
			and dm.table_name = "AC_CLASS_DEF"
			and dm.column_name = "CLASS_TYPE_FLAG"
	head report
		x = 0
	detail
		x = x + 1
		stat = alterlist(registries_rep_out->registries,x)
 
		registries_rep_out->registries[x].registry_id = acd.ac_class_def_id
		registries_rep_out->registries[x].registry_name = acd.class_display_name
		registries_rep_out->registries[x].registry_type.id = acd.class_type_flag
		registries_rep_out->registries[x].registry_type.name = dm.description
		registries_rep_out->registries[x].valid_from_date = acd.begin_effective_dt_tm
		registries_rep_out->registries[x].valid_to_date = acd.end_effective_dt_tm
	foot report
		iValidate = x
	with nocounter
 
	if(idebugFlag > 0)
		call echo(concat("GetRegistries Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
	return(iValidate)
end ;End Subroutine
 
 
end go
set trace notranslatelock go
 
