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
      Source file name:     snsro_get_pop_procedures.prg
      Object name:          vigilanz_get_pop_procedures
      Program purpose:      Retrieve procedures within a timeframe
      Executing from:       Emissary Service
      Special Notes:      	This population query will check for maximum records
      						and a maximum date range and if those are exceeded
      						a failure status and message will get returned.
************************************************************************
                     MODIFICATION CONTROL LOG
 ***********************************************************************
  Mod Date     Engineer     Comment
  --- -------- ------------	--------------------------------------------
  000 09/04/19  STV         Intitial Release
  001 09/19/19	STV			Fixed issue with wrong record name
  002 04/06/20  STV         Fix for out of bounds error in comment and modifier functions
***********************************************************************/
drop program vigilanz_get_pop_procedures go
create program vigilanz_get_pop_procedures
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Username:"  = ""  			;REQUIRED. Valid HNA Millennium user account.
	, "Beg Date:"  = ""				;REQUIRED. Beginning of bookmark date range.
	, "End Date:"  = ""				;OPTIONAL. No longer REQUIRED. End of bookmark date range.
	, "Facility_Code_List" = ""		;OPTIONAL. List of location facility codes from code set 220.
	, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
	, "Time Max"   = 3600			;DO NOT USE. Undocumented value to override maximum date range in seconds.
 
with OUTDEV, USERNAME, BEG_DATE, END_DATE, LOC_LIST, DEBUG_FLAG, TIME_MAX
 
/*************************************************************************
;VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record pop_procedures_reply_out
record pop_procedures_reply_out(
	1 enc_cnt = i4
	1 encounter[*]
		2 create_updt_dt_tm = dq8
  	 	2 encounter
    		3 encounter_id = f8
    		3 encounter_date_time = dq8
    		3 discharge_date_time = dq8
    		3 financial_number = vc
    		3 encounter_type
    			4 id = f8
    			4 name = vc
    		3 patient_class
    			4 id = f8
    			4 name = vc
    		3 location
    			4 hospital
    				5 id = f8
    				5 name = vc
    			4 unit
    				5 id = f8
    				5 name = vc
    			4 room
    				5 id = f8
    				5 name = vc
    			4 bed
    				5 id = f8
    				5 name = vc
     	2 patient
    		3 patient_id = f8
    		3 display_name = vc
    		3 last_name = vc
    		3 first_name = vc
    		3 middle_name = vc
    		3 mrn = vc
    		3 birth_date_time = dq8
    		3 gender
    			4 id = f8
    			4 name = vc
    		3 sdob = vc
    	2 proc_cnt = i4
      	2 procedures[*]
      		3 procedure_id = f8
      		3 description =  vc
      		3 proc_dt_tm = dq8
      		3 rank
      			4 id = f8
      			4 name = vc
      		/*
      		3 performing_provider
      			4 provider_id = f8
    			4 provider_name = vc
    			4 procedure_reltn_disp = vc
    		*/
    		3 provider_cnt = i4
    		3 providers[*]
    			4 provider_id = f8
    			4 provider_name = vc
    			4 procedure_reltn_disp = vc
    		3 code_cnt = i4
    		3 codes[*]
    			4 nomen_id = f8
    			4 description = vc
    			4 value = vc
    			4 type
    	   			5 id = f8
    	  			5 name = vc
    	  	3 comment_cnt = i4
    	  	3 long_text_id = f8
    	  	3 comments[*]; size is only one per procedureid
    			4 note_date_time = dq8
    			4 comments = vc
    			4 format
    				5 id = f8
    				5 name = vc
    			4 provider
    				5 provider_id = f8
    				5 provider_name = vc
    		3 modifier_cnt = i4
    		3 modifiers[*]
    			4 id = f8
    			4 name = vc
   1 audit
		2 user_id					= f8
		2 user_firstname			= vc
		2 user_lastname				= vc
		2 patient_id				= f8
		2 patient_firstname			= vc
		2 patient_lastname			= vc
	    2 service_version			= vc
	    2 query_execute_time		= vc
	    2 query_execute_units		= vc
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
 
free record loc_req
record loc_req (
	1 codes[*]
		2 code_value					= f8
		2 fac_identifier				= vc
)
 
;initialize status to FAIL
set pop_procedures_reply_out->status_data.status = "F"
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
;Input
declare sUserName				= vc with protect, noconstant("")
declare sFromDate				= vc with protect, noconstant("")
declare sToDate					= vc with protect, noconstant("")
declare sLocFacilities			= vc with protect, noconstant("")
declare iDebugFlag				= i2 with protect, noconstant(0)
declare iTimeMax				= i4 with protect, noconstant(0)
 
;Other
declare qFromDateTime				= dq8 with protect, noconstant(CNVTDATETIME(CURDATE, CURTIME3))
declare qToDateTime					= dq8 with protect, noconstant(CNVTDATETIME(CURDATE, CURTIME3))
declare iTimeDiff				= i4 with protect, noconstant(0)
declare UTCmode					= i2 with protect, noconstant(0);003
declare UTCpos 					= i2 with protect, noconstant(0);003
declare sLocWhereClause				= vc with protect, noconstant("")
declare sEncWhereClause					= vc with protect, noconstant("")
declare timeOutThreshold = i4 with protect, noconstant(115);setting to 115 seconds
declare queryStartTm = dq8
declare iMaxRecs						= i4 with protect, constant(2001)
declare ndx2                    = i4 with protect, noconstant(0)
 
;Constants
declare c_mrn_encntr_alias_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",319,"MRN"))
declare c_fin_encntr_alias_type_cd 		= f8 with protect,constant(uar_get_code_by("MEANING",319,"FIN NBR"))
declare c_compressed_cd = f8 with protect,constant(uar_get_code_by("MEANING",120,"OCFCOMP"))
 
/**************************************************************************
;DECLARE SUBROUTINES
***************************************************************************/
declare getProcedureEncounters(null) 		= null with protect
declare getPrsnl(null) 						= null with protect
declare ParseLocations(sLocFacilities = vc)	= null with protect
declare PostAmble(null)						= null with protect
declare getComments(null)                   = null with protect
declare getModifiers(null)                  = null with protect
/**************************************************************************
;INITIALIZE
**************************************************************************/
set modify maxvarlen 200000000
 
;Input
set sUserName					= trim($USERNAME,3)
set sFromDate					= trim($BEG_DATE,3)
set sToDate						= trim($END_DATE,3)
set sLocFacilities				= trim($LOC_LIST,3)
set iDebugFlag					= cnvtint($DEBUG_FLAG)
set iTimeMax					= cnvtint($TIME_MAX)
 
;Other
set UTCmode						= CURUTC ;003
set UTCpos						= findstring("Z",sFromDate,1,0);003
 
set qFromDateTime = GetDateTime(sFromDate)
set qToDateTime = GetDateTime(sToDate)
 
 if(iDebugFlag > 0)
	call echo(build("sFromDate -> ",sFromDate))
	call echo(build("sToDate -> ",sToDate))
	call echo(build("sUserName -> ", sUserName))
	call echo(build("qFromDateTime -> ", qFromDateTime))
	call echo(build("qToDateTime -> ", qToDateTime))
	call echo(build("debug flag -> ", iDebugFlag))
	call echo(build("Time Maximum -> ", iTimeMax))
	call echo(build("UTC MODE -->",UTCmode));003
 	call echo(build("UTC POS -->",UTCpos));003
	call echo (build("iTimeMax---->",iTimeMax))
	call echo(build("sToDate -> ",sToDate))
	call echo(build("qToDateTime -> ", qToDateTime))
 
endif
 
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
;Validate Username
set iRet = PopulateAudit(sUserName, 0.0, pop_procedures_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F","POP_PROCEDURES", "Invalid User for Audit.",
	"1001",build("UserId is invalid: ", sUserName), pop_procedures_reply_out) ;019
	go to EXIT_SCRIPT
endif
 
;Validate from date is not greater than to date
if (qFromDateTime > qToDateTime)
	call ErrorHandler2("VALIDATE", "F", "POP_PROCEDURES", "From Date Greater than To Date. Refine Dates Entered.",
	"2010", "From Date Greater than To Date. Refine Dates Entered.",  pop_procedures_reply_out)
	go to EXIT_SCRIPT
endif
 
 
; Validate Time Window doesn't exceed threshold
set iRet = ThreshHoldValidator(iTimeMax,"s",qFromDateTime,qToDateTime)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "POP_PROCEDURES", "Date Range Too Long. Refine Query.",
	"2011","Date Range Too Long. Refine Query.", pop_procedures_reply_out)
	go to EXIT_SCRIPT
endif
 
 
; Parse Locations if any provided
if(sLocFacilities > " ")
	call ParseLocations(sLocFacilities)
endif
 
;getting population procedures
call getProcedureEncounters(null)
 
;getting the procedure related info
if(pop_procedures_reply_out->enc_cnt > 0)
	call getPrsnl(null)
	call getModifiers(null)
	call getComments(null)
	call postAmble(null)
	call ErrorHandler("EXECUTE", "S", "POP_PROCEUDURE", "Success retrieving procedure activity",  pop_procedures_reply_out) ;019
else
    set pop_procedures_reply_out->status_data->status = "Z"
    call ErrorHandler("EXECUTE", "Z", "POP_PROCEUDURE", "No records qualify.", pop_procedures_reply_out)
 
endif
 
 
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(pop_procedures_reply_out)
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_pop_procedures.json")
	call echo(build2("_file : ", _file))
	call echojson(pop_procedures_reply_out, _file, 0)
    call echorecord(pop_procedures_reply_out)
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
;  Name: ParseLocations(sLocFacilties = vc)
;  Description: Subroutine to parse a comma delimited string
**************************************************************************/
subroutine ParseLocations(sLocFacilities)
 	declare notfnd 		= vc with constant("<not_found>")
	declare num 		= i4 with noconstant(1)
	declare str 		= vc with noconstant("")
 
	if(cnvtstring(sLocFacilities) != "")
		while (str != notfnd)
			set str =  piece(sLocFacilities,',',num,notfnd)
			if(str != notfnd)
				set stat = alterlist(loc_req->codes, num)
				set loc_req->codes[num]->code_value = cnvtint(str)
 
				set check = 0
				select into "nl:"
				from code_value
				where code_set = 220 and cdf_meaning = "FACILITY"
					and loc_req->codes[num]->code_value = code_value
				detail
					check = 1
				with nocounter
 
				if (check = 0)
					call ErrorHandler2("EXECUTE", "F", "POP_PROCEDURES", build("Invalid Facility Code: ", loc_req->codes[num]->code_value),
					"2040", build("Invalid Facility Code: ",loc_req->codes[num]->code_value),pop_procedures_reply_out) ;012
					set stat = alterlist(pop_procedures_reply_out,0)
					go to exit_script
				endif
			endif
			set num = num + 1
		endwhile
	endif
 
	if(iDebugFlag)
		call echorecord(loc_req)
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: getProcedureEncounters(null) = null 		;013
;  Description: Get encounters based on Procedure table activity
**************************************************************************/
subroutine getProcedureEncounters(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("getProdecureEncounters Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	call echo(build("time_out_begin function: ",trim(cnvtstring(timeOutThreshold))))
	endif
 
	; Location filter
	if(size(loc_req->codes,5) > 0)
		set sLocWhereClause = "expand(ndx2,1,size(loc_req->codes,5),e.loc_facility_cd,loc_req->codes[ndx2].code_value)"
	else
		set sLocWhereClause = "e.loc_facility_cd > 0.0 "
	endif
 
	;Set expand control value - 018
	if(size(loc_req->codes,5) > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
 	set num = 1
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
 	select into "nl:"
 	from procedure p
 	     ,encounter e
 	plan p
 		where p.updt_dt_tm between cnvtdatetime(qFromDateTime) and cnvtdatetime(qToDateTime)
 			and p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
 			and p.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
 	join e
 		where e.encntr_id = p.encntr_id
 			and parser(sLocWhereClause)
 	order by p.encntr_id
 	head report
 		x = 0
 
 		head p.encntr_id
 			y = 0
 			code_cnt = 0
 			x = x + 1
 			if(x < iMaxRecs)
 				stat = alterlist(pop_procedures_reply_out->encounter,x)
 				;create date time
 				pop_procedures_reply_out->encounter[x].create_updt_dt_tm = p.updt_dt_tm
 				;encounter data
 				pop_procedures_reply_out->encounter[x].encounter.discharge_date_time = e.disch_dt_tm
 				pop_procedures_reply_out->encounter[x].encounter.encounter_date_time = e.reg_dt_tm
 				pop_procedures_reply_out->encounter[x].encounter.encounter_type.id = e.encntr_type_cd
 				pop_procedures_reply_out->encounter[x].encounter.encounter_type.name = uar_get_code_display(e.encntr_type_cd)
 				pop_procedures_reply_out->encounter[x].encounter.encounter_id = e.encntr_id
 				pop_procedures_reply_out->encounter[x].encounter.location.bed.id = e.loc_bed_cd
 				pop_procedures_reply_out->encounter[x].encounter.location.bed.name =
 																	uar_get_code_display(e.loc_bed_cd)
 				pop_procedures_reply_out->encounter[x].encounter.location.hospital.id = e.loc_facility_cd
 				pop_procedures_reply_out->encounter[x].encounter.location.hospital.name =
 																	uar_get_code_display(e.loc_facility_cd)
 				pop_procedures_reply_out->encounter[x].encounter.location.room.id = e.loc_room_cd
 				pop_procedures_reply_out->encounter[x].encounter.location.room.name =
 																	uar_get_code_display(e.loc_room_cd)
 				pop_procedures_reply_out->encounter[x].encounter.location.unit.id = e.loc_nurse_unit_cd
 				pop_procedures_reply_out->encounter[x].encounter.location.unit.name =
 																	uar_get_code_display(e.loc_nurse_unit_cd)
 
 				;patient class
 				pop_procedures_reply_out->encounter[x].encounter.patient_class.id = e.patient_classification_cd
 				pop_procedures_reply_out->encounter[x].encounter.patient_class.name =
 																	uar_get_code_display(e.patient_classification_cd)
 				;patient
 				pop_procedures_reply_out->encounter[x].patient.patient_id = e.person_id
 			endif
 
 
 	foot report
 		pop_procedures_reply_out->enc_cnt = x
 	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
 	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
 
    ;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	;getting the procedures list for the qualifying encounters
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	;Set expand control value - 018
	if(pop_procedures_reply_out->enc_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
 	set num = 1
 
 	select into "nl:"
 	from procedure p
 		 ,nomenclature n1
 		 ,nomenclature n2
 		 ,nomenclature n3
 	plan p
 		where expand(num,1,pop_procedures_reply_out->enc_cnt,p.encntr_id,pop_procedures_reply_out->encounter[num].encounter.encounter_id)
 			and p.active_ind = 1
 			and p.beg_effective_dt_tm <= cnvtdatetime(curdate, curtime3)
 			and p.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
 	join n1
 		where n1.nomenclature_id = outerjoin(p.nomenclature_id)
 	join n2
 		where n2.nomenclature_id = outerjoin(p.diag_nomenclature_id)
 	join n3
 		where n3.nomenclature_id = outerjoin(p.mod_nomenclature_id)
 	order by p.encntr_id
 	head p.encntr_id
 		x = 0
 		pos = locateval(num,1,pop_procedures_reply_out->enc_cnt,p.encntr_id
 								,pop_procedures_reply_out->encounter[num].encounter.encounter_id)
 		detail
 		x = x + 1
 		stat = alterlist(pop_procedures_reply_out->encounter[pos].procedures,x)
 		;procedure info
 		pop_procedures_reply_out->encounter[pos].procedures[x].procedure_id = p.procedure_id
 		pop_procedures_reply_out->encounter[pos].procedures[x].proc_dt_tm = p.proc_dt_tm
 		pop_procedures_reply_out->encounter[pos].procedures[x].rank.id = p.ranking_cd
 		pop_procedures_reply_out->encounter[pos].procedures[x].rank.name =
 																	uar_get_code_display(p.ranking_cd)
 		;default set as ftdesc but nomenclature will overwrie if it exists
 		pop_procedures_reply_out->encounter[pos].procedures[x].description = trim(p.proc_ftdesc)
 
 		;getting the codes
 		y = 0
 		if(p.nomenclature_id > 0)
 			y = y + 1
 			stat = alterlist(pop_procedures_reply_out->encounter[pos].procedures[x].codes,y)
 			pop_procedures_reply_out->encounter[pos].procedures[x].codes[y].nomen_id = n1.nomenclature_id
 			pop_procedures_reply_out->encounter[pos].procedures[x].codes[y].description =
 																	trim(n1.source_string)
 			pop_procedures_reply_out->encounter[pos].procedures[x].codes[y].value = trim(n1.source_identifier)
 			pop_procedures_reply_out->encounter[pos].procedures[x].codes[y].type.id = n1.source_vocabulary_cd
 			pop_procedures_reply_out->encounter[pos].procedures[x].codes[y].type.name =
 																	uar_get_code_display(n1.source_vocabulary_cd)
 
 			;setting description if nomenclature exists
 			pop_procedures_reply_out->encounter[pos].procedures[x].description = trim(n1.source_string)
 		endif
 		if(p.diag_nomenclature_id > 0)
 			y = y + 1
 			stat = alterlist(pop_procedures_reply_out->encounter[pos].procedures[x].codes,y)
 			pop_procedures_reply_out->encounter[pos].procedures[x].codes[y].nomen_id = n2.nomenclature_id
 			pop_procedures_reply_out->encounter[pos].procedures[x].codes[y].description =
 																	trim(n2.source_string)
 			pop_procedures_reply_out->encounter[pos].procedures[x].codes[y].value = trim(n2.source_identifier)
 			pop_procedures_reply_out->encounter[pos].procedures[x].codes[y].type.id = n2.source_vocabulary_cd
 			pop_procedures_reply_out->encounter[pos].procedures[x].codes[y].type.name =
 																	uar_get_code_display(n2.source_vocabulary_cd)
 		endif
 		if(p.mod_nomenclature_id > 0)
 			y = y + 1
 			stat = alterlist(pop_procedures_reply_out->encounter[pos].procedures[x].codes,y)
 			pop_procedures_reply_out->encounter[pos].procedures[x].codes[y].nomen_id = n3.nomenclature_id
 			pop_procedures_reply_out->encounter[pos].procedures[x].codes[y].description =
 																	trim(n3.source_string)
 			pop_procedures_reply_out->encounter[pos].procedures[x].codes[y].value = trim(n3.source_identifier)
 			pop_procedures_reply_out->encounter[pos].procedures[x].codes[y].type.id = n3.source_vocabulary_cd
 			pop_procedures_reply_out->encounter[pos].procedures[x].codes[y].type.name =
 																	uar_get_code_display(n3.source_vocabulary_cd)
 		endif
 
 		;setting the codes countsize
 		pop_procedures_reply_out->encounter[pos].procedures[x].code_cnt = y
 
 		;getting the comments
 		pop_procedures_reply_out->encounter[pos].procedures[x].long_text_id = p.long_text_id
 		z = 0
 		if(size(p.procedure_note) > 0)
 			z = z + 1
 			pop_procedures_reply_out->encounter[pos].procedures[x].comment_cnt = z
 			stat = alterlist(pop_procedures_reply_out->encounter[pos].procedures[x].comments,z)
 			pop_procedures_reply_out->encounter[pos].procedures[x].comments[z].comments = trim(p.procedure_note)
 			pop_procedures_reply_out->encounter[pos].procedures[x].comments[z].format.name = "TEXT"
 		endif
 
 	foot p.encntr_id
 		pop_procedures_reply_out->encounter[pos].proc_cnt = x
 	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
    set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
 
     ;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
 
 	if(iDebugFlag > 0)
		call echo(concat("getProdecureEncounters Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: getPrsnl(null)
;  Description: Subroutine to get  Prsnl
**************************************************************************/
subroutine getPrsnl(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("getPrsnl Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
		call echo(build("time_out_begin function: ",trim(cnvtstring(timeOutThreshold))))
	endif
 
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
 	set idx = 1
 	if(pop_procedures_reply_out->enc_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	select into "nl:"
	from proc_prsnl_reltn ppr
		 ,prsnl p
		 ,(dummyt d1 with seq = pop_procedures_reply_out->enc_cnt)
		 ,(dummyt d2 with seq = 1)
	plan d1
		where maxrec(d2,pop_procedures_reply_out->encounter[d1.seq].proc_cnt)
	join d2
	join ppr
		where ppr.procedure_id = pop_procedures_reply_out->encounter[d1.seq].procedures[d2.seq].procedure_id
			and ppr.active_ind = 1
			and ppr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and ppr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
	join p
		where p.person_id = outerjoin(ppr.prsnl_person_id)
			and p.active_ind = outerjoin(1)
	order by d1.seq,d2.seq,ppr.proc_prsnl_reltn_id
	head d1.seq
		nocnt = 0
 
		head d2.seq
			x = 0
 
			head ppr.proc_prsnl_reltn_id
				x = x + 1
				stat =  alterlist(pop_procedures_reply_out->encounter[d1.seq].procedures[d2.seq].providers,x)
				pop_procedures_reply_out->encounter[d1.seq].procedures[d2.seq].providers[x].procedure_reltn_disp =
																					uar_get_code_display(ppr.proc_prsnl_reltn_cd)
 
				if(p.person_id > 0)
					pop_procedures_reply_out->encounter[d1.seq].procedures[d2.seq].providers[x].provider_id = ppr.prsnl_person_id
					pop_procedures_reply_out->encounter[d1.seq].procedures[d2.seq].providers[x].provider_name =
																							trim(p.name_full_formatted)
				elseif(size(ppr.proc_ft_prsnl) > 0)
					pop_procedures_reply_out->encounter[d1.seq].procedures[d2.seq].providers[x].provider_name =
																							trim(ppr.proc_ft_prsnl)
				endif
		foot d2.seq
			pop_procedures_reply_out->encounter[d1.seq].procedures[d2.seq].provider_cnt = x
 
	with nocounter, time = value(timeOutThreshold)
 
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
 
 	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("getPrsnl Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end ;End Sub
 
/*************************************************************************
;  Name: getModifiers(null)
;  Description: Subroutine to get Modifiers
**************************************************************************/
subroutine getModifiers(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("getModifiers Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
		call echo(build("time_out_begin function: ",trim(cnvtstring(timeOutThreshold))))
	endif
 
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
 	select into "nl:"
	from (dummyt d1 with seq =  pop_procedures_reply_out->enc_cnt)
	     ,(dummyt d2 with seq = 1)
	     , proc_modifier pm
		 , nomenclature n
	plan d1
		where maxrec(d2,pop_procedures_reply_out->encounter[d1.seq].proc_cnt)
	join d2
	join pm
		where pm.parent_entity_name = "PROCEDURE"
			and pm.parent_entity_id = pop_procedures_reply_out->encounter[d1.seq].procedures[d2.seq].procedure_id
			and pm.active_ind = 1
	join n
		where n.nomenclature_id = pm.nomenclature_id
	order by d1.seq,d2.seq,pm.proc_modifier_id
	head d1.seq
		 nocnt = 0
	head d2.seq
		 x = 0
		 head pm.proc_modifier_id
		 	x = x + 1
		 	stat = alterlist(pop_procedures_reply_out->encounter[d1.seq].procedures[d2.seq].modifiers,x)
		 	pop_procedures_reply_out->encounter[d1.seq].procedures[d2.seq].modifiers[x].id = n.nomenclature_id
		 	pop_procedures_reply_out->encounter[d1.seq].procedures[d2.seq].modifiers[x].name = trim(n.source_string)
	foot d2.seq
		pop_procedures_reply_out->encounter[d1.seq].procedures[d2.seq].modifier_cnt = x
 	with nocounter, time = value(timeOutThreshold)
 
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
 
 	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("getModifers Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
 
	endif
 
end; end sub
 
/*************************************************************************
;  Name: getComments(null)
;  Description: Subroutine to get Comments
**************************************************************************/
subroutine getComments(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("getComments Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
		call echo(build("time_out_begin function: ",trim(cnvtstring(timeOutThreshold))))
	endif
 
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
 	set ACTIVE_STATUS_CD = uar_get_code_by("MEANING",48,"ACTIVE")
 	select into "nl:"
	from (dummyt d1 with seq =  pop_procedures_reply_out->enc_cnt)
	     ,(dummyt d2 with seq = 1)
	     ,long_text lt
	     ,prsnl p
	plan d1
		where maxrec(d2,pop_procedures_reply_out->encounter[d1.seq].proc_cnt)
	join d2
		where pop_procedures_reply_out->encounter[d1.seq].procedures[d2.seq].long_text_id > 0
	join lt
		where lt.long_text_id = pop_procedures_reply_out->encounter[d1.seq].procedures[d2.seq].long_text_id
			and lt.active_ind = 1
			and lt.active_status_cd = ACTIVE_STATUS_CD
	join p
		where p.person_id = lt.active_status_prsnl_id
			and p.active_ind = 1
	order by d1.seq,d2.seq,lt.long_text_id
	head d1.seq
		 nocnt = 0
	head d2.seq
		 x = pop_procedures_reply_out->encounter[d1.seq].procedures[d2.seq].comment_cnt
		 head lt.long_text_id
		 	x = x + 1
		 	stat = alterlist(pop_procedures_reply_out->encounter[d1.seq].procedures[d2.seq].comments,x)
		 	pop_procedures_reply_out->encounter[d1.seq].procedures[d2.seq].comments[x].comments = trim(lt.long_text)
		 	pop_procedures_reply_out->encounter[d1.seq].procedures[d2.seq].comments[x].note_date_time = lt.active_status_dt_tm
		 	pop_procedures_reply_out->encounter[d1.seq].procedures[d2.seq].comments[x].format.name = "TEXT"
		 	pop_procedures_reply_out->encounter[d1.seq].procedures[d2.seq].comments[x].provider.provider_id = p.person_id
		 	pop_procedures_reply_out->encounter[d1.seq].procedures[d2.seq].comments[x].provider.provider_name =
		 																						trim(p.name_full_formatted)
 
	foot d2.seq
		pop_procedures_reply_out->encounter[d1.seq].procedures[d2.seq].modifier_cnt = x
 	with nocounter, time = value(timeOutThreshold)
 
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
 
 	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("getComments Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end; end sub
 
 /*************************************************************************
;  Name: PostAmble(null) = null
;  Description: Set encounter, person, clinical event and alias details
**************************************************************************/
subroutine PostAmble(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostAmble Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
		call echo(build("time_out_begin function: ",trim(cnvtstring(timeOutThreshold))))
	endif
 
	declare num = i4
 
	set idx = 1
 
	if(pop_procedures_reply_out->enc_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
   ;getting person info
 
   select into "nl:"
   from person p
   plan p
   		where expand(idx,1,pop_procedures_reply_out->enc_cnt,p.person_id,pop_procedures_reply_out->encounter[idx].patient.patient_id)
   			and p.person_id > 0
   detail
   		pos = locateval(idx,1,pop_procedures_reply_out->enc_cnt,p.person_id
   								,pop_procedures_reply_out->encounter[idx].patient.patient_id)
   		if(pos > 0)
   			pop_procedures_reply_out->encounter[pos].patient.first_name = p.name_first
			pop_procedures_reply_out->encounter[pos].patient.last_name = p.name_last
			pop_procedures_reply_out->encounter[pos].patient.middle_name = p.name_middle
			pop_procedures_reply_out->encounter[pos].patient.gender.id = p.sex_cd
			pop_procedures_reply_out->encounter[pos].patient.gender.name =uar_get_code_display(p.sex_cd)
			pop_procedures_reply_out->encounter[pos].patient.display_name = trim(p.name_full_formatted)
			pop_procedures_reply_out->encounter[pos].patient.birth_date_time = p.birth_dt_tm
			pop_procedures_reply_out->encounter[pos].patient.sdob =
	 		datetimezoneformat(p.birth_dt_tm,p.birth_tz,"YYYY-MM-DD",curtimezonedef) ;016
	 	endif
 	with nocounter, time = value(timeOutThreshold), expand = value(exp)
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
 
 	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
 
	; Get encntr & person aliases
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	set idx = 1
	select into "nl:"
	from encntr_alias ea
	plan ea where expand(idx,1,pop_procedures_reply_out->enc_cnt,ea.encntr_id
										,pop_procedures_reply_out->encounter[idx].encounter.encounter_id)
		and ea.encntr_alias_type_cd in (c_fin_encntr_alias_type_cd, c_mrn_encntr_alias_type_cd) ;1077
		and ea.active_ind = 1
		and ea.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime)
		and ea.end_effective_dt_tm >= cnvtdatetime(curdate,curtime)
	 detail
	 	pos = locateval(idx,1,pop_procedures_reply_out->enc_cnt,ea.encntr_id
	 						,pop_procedures_reply_out->encounter[idx].encounter.encounter_id)
	 	if(pos > 0)
			if(ea.encntr_alias_type_cd = c_mrn_encntr_alias_type_cd)  ;011
				pop_procedures_reply_out->encounter[pos].patient.mrn = ea.alias
			else
				pop_procedures_reply_out->encounter[pos].encounter.financial_number = ea.alias
			endif
		endif
	with nocounter, time = value(timeOutThreshold), expand = value(exp)
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
 
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("PostAmble Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end ;End Sub
 
end
go
 
