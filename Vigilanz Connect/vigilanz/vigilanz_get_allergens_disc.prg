/*~BB~**********************************************************************************

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
  ~BE~***********************************************************************************/
/*****************************************************************************************
 
      Source file name:    vigilanz_get_allergens_disc
      Object name:         vigilanz_get_allergens_disc
 
      Program purpose:      Get allergen codes
 
      Tables read:          NOMENCLATURE
      Tables updated:       NONE
      Executing from:       MPages Discern Web Service
 
      Special Notes:      NONE
******************************************************************************/
 /***********************************************************************
 *                   MODIFICATION CONTROL LOG                      *
 ***********************************************************************
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
  001 01/17/18	DJC				    Initial creation
  002 03/21/18	RJC					Added version code and copyright block
  002 09/09/19  RJC                 Renamed file and object
 ***********************************************************************/
/**********************************************************************/
;drop program snsro_get_allergens_discovery go
drop program vigilanz_get_allergens_disc go
create program vigilanz_get_allergens_disc
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Search Name :"  = ""
		, "Include Inactive" = 0
		, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, NAME, INACTIVE_FLAG, DEBUG_FLAG

/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2" ;002
if($OUTDEV = "VERSION")
	go to exit_version
endif

/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
 
free record allergens_reply_out
record allergens_reply_out (
	1 allergens[*]
		2 allergen_id 		= f8
		2 allergen_desc		= vc
		2 active_ind		= i4
 
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
; cps_nomen_get_pickitems (963000) for allergy search
free record request
record REQUEST (
  1 vocabularies [*]
    2 source_vocabulary_cd = f8
  1 principleTypes [*]
    2 principle_type_cd = f8
  1 vocabularyCnt = i2
  1 principleTypeCnt = i2
  1 all_ind = i2
  1 max_items = i2
  1 nameString = c200
  1 codeString = c200
  1 compare_dt_tm = dq8
  1 vocab_axis_cnt = i2
  1 vocab_axis [*]
    2 vocab_axis_cd = f8
  1 primary_vterm_ind = i2
  1 force_disallowed_ind = i2
)
 
 
 /*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
declare sName				= vc with protect, noconstant("")
declare iDebugFlag			= i2 with protect, noconstant(0)
declare dSourceVocabCd1		= f8 with protect ,constant (uar_get_code_by ("MEANING",400,"ALLERGY"))
declare dSourceVocabCd2		= f8 with protect ,constant (uar_get_code_by ("MEANING",400,"MUL.ALGCAT"))
declare dSourceVocabCd3		= f8 with protect ,constant (uar_get_code_by ("MEANING",400,"MEDICOM.ALG"))
declare dPrincipleTypeCd	= f8 with protect ,constant (uar_get_code_by ("MEANING",401,"ALLERGY"))
declare section_startDtTm			= dq8 with protect, constant(cnvtdatetime(curdate,curtime3))
declare iRet			= i2 with protect, noconstant(0)
/*************************************************************************
;INCLUDES
**************************************************************************/
execute snsro_common
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
set sName   	= ($NAME)
set iDebugFlag = cnvtint($DEBUG_FLAG)
set iInactiveFlag = cnvtint($INACTIVE_FLAG)
 
 if(idebugFlag > 0)
	call echo(build("sName  ->", sName))
	call echo(build("idebugFlag  ->", idebugFlag))
	call echo(build("iInactiveFlag  ->", iInactiveFlag))
	call echo(build("dPrincipleTypeCd ->", dPrincipleTypeCd))
	call echo(build("dSourceVocabCd1 ->", dSourceVocabCd1))
	call echo(build("dSourceVocabCd2 ->", dSourceVocabCd2))
	call echo(build("dSourceVocabCd3 ->", dSourceVocabCd3))
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetAllergens(null)				= i2 with protect
declare GetAllergenSearchByName(null)	= null with protect
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/

; Get Allergens
set iRet = GetAllergens(null)
if(iRet = 0)
	call ErrorHandler2("GET ALLERGENS", "F", "Allergens Search", "No Allergens Found.",
	"9999","No Allergens Found", allergens_reply_out)
	go to exit_script
endif
 
; Transaction is successful Update status
call ErrorHandler2("ALLERGENS DISCOVERY", "S", "SUCCESS","Get Allergens Discovery processed successfully" ,
"0000", "Get Allergens Discovery processed successfully" , allergens_reply_out)
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON - Future functionality if this turns into an API call
**************************************************************************/
  if(idebugFlag > 0)
	  call echorecord(allergens_reply_out)
 
	  set file_path = logical("ccluserdir")
	  set _file = build2(trim(file_path),"/snsro_get_allergens_discovery.json")
	  call echo(build2("_file : ", _file))
	  call echojson(allergens_reply_out, _file, 0)
	  ;call echorecord(reqinfo,_file,1)
  endif
 
  set JSONout = CNVTRECTOJSON(allergens_reply_out)
 
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
;  Name: GetAllergens(null)
;  Description:  Get allergens built in the health system
**************************************************************************/
subroutine GetAllergens(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetAllergens Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
if (sName = "" and iInactiveFlag = 1)
	set iValidate = 0
 
	select into "nl:"
	from nomenclature n
	where n.principle_type_cd = dPrincipleTypeCd
 
	head report
		x = 0
	detail
		x = x + 1
		stat = alterlist(allergens_reply_out->allergens,x)
 
 		allergens_reply_out->allergens[x].allergen_id = n.nomenclature_id
 		allergens_reply_out->allergens[x].allergen_desc = n.source_string
 		allergens_reply_out->allergens[x].active_ind = n.active_ind
 
	foot report
		iValidate = x
 
	with nocounter
 
 elseif (sName = "" and iInactiveFlag = 0)
 
 set iValidate = 0
 
	select into "nl:"
	from nomenclature n
	where n.principle_type_cd = dPrincipleTypeCd
 
	head report
		x = 0
	detail
		if (n.active_ind = 1)
		x = x + 1
 
		stat = alterlist(allergens_reply_out->allergens,x)
 
 		allergens_reply_out->allergens[x].allergen_id = n.nomenclature_id
 		allergens_reply_out->allergens[x].allergen_desc = n.source_string
 		allergens_reply_out->allergens[x].active_ind = n.active_ind
 		endif
	foot report
		iValidate = x
 
 
 
	with nocounter
 
else
 	call GetAllergenSearchByName(null)
 
endif
 
 if(idebugFlag > 0)
		call echo(concat("GetAllergens Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
 endif
end ; end GetAllergens subroutine
 
 
 /*************************************************************************
 ;    Name: subroutine GetAllergenSearchByName
 ;    Description Subroutine to return allergies by search phrase (4174062)
 **************************************************************************/
 subroutine GetAllergenSearchByName(null)
 declare num_of_items = i4 with protect
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetAllergenSearchByName Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
set stat = alterlist(request->vocabularies,3)
set stat = alterlist(request->principleTypes,1)
set request->vocabularyCnt = 3
set request->vocabularies[1].source_vocabulary_cd = dSourceVocabCd1
set request->vocabularies[2].source_vocabulary_cd = dSourceVocabCd2
set request->vocabularies[3].source_vocabulary_cd = dSourceVocabCd3
 
set request->principleTypes[1].principle_type_cd = dPrincipleTypeCd
set request->principleTypeCnt = 1
 
set request->nameString = sName
 
 set stat = tdbexecute(600005,963000,963000,"REC",REQUEST,"REC",REPLY )
 call echorecord(request)
 call echorecord(reply)
 
 set num_of_items = reply->item_cnt
 set stat = alterlist(allergens_reply_out->allergens,num_of_items)
 
 for (item = 1 to num_of_items)
 		set allergens_reply_out->allergens[item]->allergen_id = reply->items[item]->nomenclature_id
 		set allergens_reply_out->allergens[item]->allergen_desc = reply->items[item]->source_string
		set allergens_reply_out->allergens[item]->active_ind = reply->items[item]->active_ind
 endfor
 
 
 
 if(idebugFlag > 0)
 
	call echo(concat("GetAllergenSearchByName Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
 
end
 
 
end
go
