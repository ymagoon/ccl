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
/****************************************************************************
      Source file name:     snsro_get_pop_diagnosis.prg
      Object name:          vigilanz_get_pop_diagnosis
      Program purpose:      Retrieve Diagnosis within a timeframe
      Executing from:       Emissary Service
      Special Notes:      	This population query will check for maximum records
      						and a maximum date range and if those are exceeded
      						a failure status and message will get returned.
******************************************************************************
                     MODIFICATION CONTROL LOG
 ***********************************************************************
  Mod Date     Engineer     Comment
  --- -------- ------------	--------------------------------------------
  000 07/17/19  STV         Intitial Release
***********************************************************************/
drop program vigilanz_get_pop_diagnosis go
create program vigilanz_get_pop_diagnosis
 
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
;CCL PROGRAM VERSION CONTROL - 014
**************************************************************************/
set sVersion = "1.21.6.2"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record pop_diagnosis_reply_out
record pop_diagnosis_reply_out
(
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
    2 diag_cnt = i4
    2 diagnosis[*]
    	3 diagnosis_id 				= f8
    	3 description               = vc
    	3 updt_dt_tm				= dq8
    	3 diag_dt_tm                = dq8
    	3 rank
    		4 id = f8
    		4 name = vc
    	3 codes[*]
    		4 nomen_id = f8
    		4 description = vc
    		4 value = vc
    		4 type
    	   		5 id = f8
    	  		5 name = vc
 		3 classification
    		4 id = f8
    		4 name = vc
    	3 confidential
    		4 id = f8
    		4 name = vc
   		3 diagnosis_type
    		4 id = f8
    		4 name = vc
    	3 diagnosis_provider
    		4 provider_id = f8
    		4 provider_name = vc
    		4 procedure_reltn_disp = vc
    	3 severity
    		4 id = f8
    		4 name = vc
    	3 long_blob_id = f8
    	3 comments[1]; size is only one per longblobid
    		4 note_date_time = dq8
    		4 comments = vc
    		4 format
    			5 id = f8
    			5 name = vc
    		4 provider
    			5 provider_id = f8
    			5 provider_name = vc
    	3 is_present_on_admission
    		4 id = f8
    		4 name = vc
    	3 is_hosp_acquired = i2
    	3 confirmed_status
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
set pop_diagnosis_reply_out->status_data.status = "F"
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common	;009
 
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
declare iObsSize				= i4 with protect, noconstant(0)
declare ndx2                    = i4 with protect, noconstant(0)
declare UTCmode					= i2 with protect, noconstant(0);003
declare UTCpos 					= i2 with protect, noconstant(0);003
declare sLocWhereClause				= vc with protect, noconstant("")
declare sEncWhereClause					= vc with protect, noconstant("")
declare timeOutThreshold = i4 with protect, noconstant(115);setting to 115 seconds
declare queryStartTm = dq8
declare iMaxRecs						= i4 with protect, constant(2001)
declare iNomenInd = i2
 
;Constants
declare c_mrn_encntr_alias_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",319,"MRN"))
declare c_fin_encntr_alias_type_cd 		= f8 with protect,constant(uar_get_code_by("MEANING",319,"FIN NBR"))
declare c_compressed_cd = f8 with protect,constant(uar_get_code_by("MEANING",120,"OCFCOMP"))
/**************************************************************************
;DECLARE SUBROUTINES
***************************************************************************/
 
declare getDiagnosisEncounters(null) 		= null with protect
declare getPrsnl(null) 						= null with protect
declare ParseLocations(sLocFacilities = vc)	= null with protect
declare PostAmble(null)						= null with protect
declare getComments(null)                   = null with protect
 
 
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
set iRet = PopulateAudit(sUserName, 0.0, pop_diagnosis_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F","POP_DIAGNOSIS", "Invalid User for Audit.",
	"1001",build("UserId is invalid: ", sUserName),pop_diagnosis_reply_out) ;019
	go to EXIT_SCRIPT
endif
 
;Validate from date is not greater than to date
if (qFromDateTime > qToDateTime)
	call ErrorHandler2("VALIDATE", "F", "POP_DIAGNOSIS", "From Date Greater than To Date. Refine Dates Entered.",
	"2010", "From Date Greater than To Date. Refine Dates Entered.", pop_diagnosis_reply_out)
	go to EXIT_SCRIPT
endif
 
 
; Validate Time Window doesn't exceed threshold
set iRet = ThreshHoldValidator(iTimeMax,"s",qFromDateTime,qToDateTime)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "POP_DIAGNOSIS", "Date Range Too Long. Refine Query.",
	"2011","Date Range Too Long. Refine Query.",pop_diagnosis_reply_out)
	go to EXIT_SCRIPT
endif
 
; Parse Locations if any provided
if(sLocFacilities > " ")
	call ParseLocations(sLocFacilities)
endif
 
; Getting popuation of diagnosis updates
call getDiagnosisEncounters(null)
 
; Get additional details if data found
if(pop_diagnosis_reply_out->enc_cnt > 0)
	call getComments(null)
	call getPrsnl(null)
	call PostAmble(null)
 
 	call ErrorHandler("EXECUTE", "S", "POP_DIAGNOSIS", "Success retrieving diagnosis activity",  pop_diagnosis_reply_out) ;019
else
    set pop_diagnosis_reply_out->status_data->status = "Z"
    call ErrorHandler("EXECUTE", "Z", "POP_DIAGNOSIS", "No records qualify.", pop_diagnosis_reply_out)
endif
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(pop_diagnosis_reply_out)
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/pop_diagnosis_reply_out.json")
	call echo(build2("_file : ", _file))
	call echojson(pop_diagnosis_reply_out, _file, 0)
    call echorecord(pop_diagnosis_reply_out)
	call echo(JSONout)
endif
 
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: getDiagnosisEncounters(null) = null 		;013
;  Description: Get encounters based on diagnosis table activity
**************************************************************************/
subroutine getDiagnosisEncounters(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("getDiagnosisEncounters Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
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
	from diagnosis dg
	,encounter e
	plan dg where dg.updt_dt_tm between cnvtdatetime(qFromDateTime) and cnvtdatetime(qToDateTime)
		and dg.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and dg.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
		and dg.active_ind = 1
	join e where e.encntr_id = dg.encntr_id
		and parser(sLocWhereClause)
	order by dg.encntr_id
	head report
		x = 0
 
	head dg.encntr_id
		x = x + 1
		if(x < iMaxRecs)
			stat = alterlist(pop_diagnosis_reply_out->encounter,x)
			;diagnosis updt_dt_tm
			pop_diagnosis_reply_out->encounter[x].create_updt_dt_tm = dg.updt_dt_tm
			;encounter
			pop_diagnosis_reply_out->encounter[x].encounter.encounter_id = e.encntr_id
			pop_diagnosis_reply_out->encounter[x].encounter.encounter_type.id = e.encntr_type_cd
			pop_diagnosis_reply_out->encounter[x].encounter.encounter_type.name = uar_get_code_display(e.encntr_type_cd)
			pop_diagnosis_reply_out->encounter[x].encounter.encounter_date_time = e.reg_dt_tm
			pop_diagnosis_reply_out->encounter[x].encounter.discharge_date_time = e.disch_dt_tm
			pop_diagnosis_reply_out->encounter[x].encounter.location.bed.id = e.loc_bed_cd
			pop_diagnosis_reply_out->encounter[x].encounter.location.bed.name
																				 = uar_get_code_display(e.loc_bed_cd)
			pop_diagnosis_reply_out->encounter[x].encounter.location.hospital.id = e.loc_facility_cd
			pop_diagnosis_reply_out->encounter[x].encounter.location.hospital.name
																				 = uar_get_code_display(e.loc_facility_cd)
			pop_diagnosis_reply_out->encounter[x].encounter.location.room.id = e.loc_room_cd
			pop_diagnosis_reply_out->encounter[x].encounter.location.room.name
																				 = uar_get_code_display(e.loc_room_cd)
			pop_diagnosis_reply_out->encounter[x].encounter.location.unit.id = e.loc_nurse_unit_cd
			pop_diagnosis_reply_out->encounter[x].encounter.location.unit.name
																				 = uar_get_code_display(e.loc_nurse_unit_cd)
			pop_diagnosis_reply_out->encounter[x].encounter.patient_class.id = e.patient_classification_cd
			pop_diagnosis_reply_out->encounter[x].encounter.patient_class.name = uar_get_code_display(e.patient_classification_cd)
			pop_diagnosis_reply_out->encounter[x].patient.patient_id = dg.person_id
		endif
	foot report
 		pop_diagnosis_reply_out->enc_cnt = x
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
 
    ;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	;getting the diagnosis list for the qualifying encounters
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	;Set expand control value - 018
	if(pop_diagnosis_reply_out->enc_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
 	set num = 1

 	select into "nl:"
 	from diagnosis dg
 		 ,nomenclature n1
 		 ,nomenclature n2
 	plan dg
 		where expand(num,1,pop_diagnosis_reply_out->enc_cnt,dg.encntr_id,pop_diagnosis_reply_out->encounter[num].encounter.encounter_id)
		and dg.active_ind = 1
		and dg.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and dg.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
	join n1
		where n1.nomenclature_id = outerjoin(dg.nomenclature_id)
	join n2
		where n2.nomenclature_id = outerjoin(dg.originating_nomenclature_id)
	order by dg.encntr_id
 	head dg.encntr_id
 		x = 0
 		pos = locateval(num,1,pop_diagnosis_reply_out->enc_cnt,dg.encntr_id
 								,pop_diagnosis_reply_out->encounter[num].encounter.encounter_id)
 	detail
 		x = x + 1
 		stat = alterlist(pop_diagnosis_reply_out->encounter[pos].diagnosis,x)
		pop_diagnosis_reply_out->encounter[pos].diagnosis[x].diagnosis_id = dg.diagnosis_id
		pop_diagnosis_reply_out->encounter[pos].diagnosis[x].description = trim(dg.diagnosis_display)
		pop_diagnosis_reply_out->encounter[pos].diagnosis[x].diag_dt_tm =  dg.active_status_dt_tm
		pop_diagnosis_reply_out->encounter[pos].diagnosis[x].confirmed_status.id = dg.confirmation_status_cd
		pop_diagnosis_reply_out->encounter[pos].diagnosis[x].confirmed_status.name = uar_get_code_display(dg.confirmation_status_cd)
		pop_diagnosis_reply_out->encounter[pos].diagnosis[x].confidential.id = dg.confid_level_cd
		pop_diagnosis_reply_out->encounter[pos].diagnosis[x].confidential.name = uar_get_code_display(dg.confid_level_cd)
		pop_diagnosis_reply_out->encounter[pos].diagnosis[x].rank.id = dg.ranking_cd
		pop_diagnosis_reply_out->encounter[pos].diagnosis[x].rank.name = uar_get_code_display(dg.ranking_cd)
		pop_diagnosis_reply_out->encounter[pos].diagnosis[x].is_hosp_acquired = dg.hac_ind
		pop_diagnosis_reply_out->encounter[pos].diagnosis[x].is_present_on_admission.id = dg.present_on_admit_cd
		pop_diagnosis_reply_out->encounter[pos].diagnosis[x].is_present_on_admission = uar_get_code_display(dg.present_on_admit_cd)
		pop_diagnosis_reply_out->encounter[pos].diagnosis[x].diagnosis_provider.provider_id = dg.diag_prsnl_id
		pop_diagnosis_reply_out->encounter[pos].diagnosis[x].diagnosis_provider.provider_name = dg.diag_prsnl_name
		pop_diagnosis_reply_out->encounter[pos].diagnosis[x].diagnosis_type.id = dg.diag_type_cd
		pop_diagnosis_reply_out->encounter[pos].diagnosis[x].diagnosis_type.name = uar_get_code_display(dg.diag_type_cd)
		pop_diagnosis_reply_out->encounter[pos].diagnosis[x].severity.id = dg.severity_cd
		pop_diagnosis_reply_out->encounter[pos].diagnosis[x].severity.name = uar_get_code_display(dg.severity_cd)
		pop_diagnosis_reply_out->encounter[pos].diagnosis[x].long_blob_id = dg.long_blob_id
		pop_diagnosis_reply_out->encounter[pos].diagnosis[x].classification.id = dg.classification_cd
		pop_diagnosis_reply_out->encounter[pos].diagnosis[x].classification.name = uar_get_code_display(dg.classification_cd)
 
		;populating the nomenclatures if present
		y = 0
		if(dg.nomenclature_id > 0)
			iNomenInd = 1
			y = y + 1
			stat = alterlist(pop_diagnosis_reply_out->encounter[pos].diagnosis[x].codes,y)
			pop_diagnosis_reply_out->encounter[pos].diagnosis[x].codes[y].nomen_id = dg.nomenclature_id
			pop_diagnosis_reply_out->encounter[pos].diagnosis[x].codes[y].value = trim(n1.source_identifier)
			pop_diagnosis_reply_out->encounter[pos].diagnosis[x].codes[y].description = trim(n1.source_string)
			pop_diagnosis_reply_out->encounter[pos].diagnosis[x].codes[y].type.id = n1.source_vocabulary_cd
			pop_diagnosis_reply_out->encounter[pos].diagnosis[x].codes[y].type.name = uar_get_code_display(n1.source_vocabulary_cd)
		endif
		if(dg.originating_nomenclature_id > 0)
			iNomenInd = 1
			y = y + 1
			stat = alterlist(pop_diagnosis_reply_out->encounter[pos].diagnosis[x].codes,y)
			pop_diagnosis_reply_out->encounter[pos].diagnosis[x].codes[y].nomen_id = dg.originating_nomenclature_id
			pop_diagnosis_reply_out->encounter[pos].diagnosis[x].codes[y].value = trim(n2.source_identifier)
			pop_diagnosis_reply_out->encounter[pos].diagnosis[x].codes[y].description = trim(n2.source_string)
			pop_diagnosis_reply_out->encounter[pos].diagnosis[x].codes[y].type.id = n2.source_vocabulary_cd
			pop_diagnosis_reply_out->encounter[pos].diagnosis[x].codes[y].type.name = uar_get_code_display(n2.source_vocabulary_cd)
		endif
 
 	foot dg.encntr_id
 		pop_diagnosis_reply_out->encounter[pos].diag_cnt = x
	with nocounter, expand = value(exp), time = value(timeOutThreshold)

    set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
 
    ;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("getDiagnosisEncounters Runtime: ",
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
 	if(pop_diagnosis_reply_out->enc_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	select into "nl:"
	from encntr_prsnl_reltn epr
		 ,(dummyt d1 with seq = pop_diagnosis_reply_out->enc_cnt)
		 ,(dummyt d2 with seq = 1)
	plan d1
		where maxrec(d2,pop_diagnosis_reply_out->encounter[d1.seq].diag_cnt)
	join d2
	join epr
		where epr.encntr_id = pop_diagnosis_reply_out->encounter[d1.seq].encounter.encounter_id
			and epr.prsnl_person_id = pop_diagnosis_reply_out->encounter[d1.seq].diagnosis[d2.seq].diagnosis_provider.provider_id
			and epr.active_ind = 1
			and epr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and epr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
	head d1.seq
		nocnt = 0
 
		head d2.seq
			pop_diagnosis_reply_out->encounter[d1.seq].diagnosis[d2.seq].diagnosis_provider.procedure_reltn_disp =
																									uar_get_code_display(epr.encntr_prsnl_r_cd)
 
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
;  Name:  getComments(null)
;  Description: gets the comments
**************************************************************************/
subroutine  getComments(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("getComments Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
		call echo(build("time_out_begin function: ",trim(cnvtstring(timeOutThreshold))))
	endif
 
	declare blobout = vc
 
 
 	select into "nl:"
 	from long_blob lb
 		 ,prsnl p
 		 ,(dummyt d1 with seq = pop_diagnosis_reply_out->enc_cnt)
		 ,(dummyt d2 with seq = 1)
	plan d1
		where maxrec(d2,pop_diagnosis_reply_out->encounter[d1.seq].diag_cnt)
	join d2
 	join lb
 		where lb.long_blob_id = pop_diagnosis_reply_out->encounter[d1.seq].diagnosis[d2.seq].long_blob_id
 			and lb.parent_entity_name = "DIAGNOSIS"
 	join p
 		where p.person_id =  lb.active_status_prsnl_id
 	head d1.seq
 		nocnt = 0
 		head d2.seq
 				pop_diagnosis_reply_out->encounter[d1.seq].diagnosis[d2.seq].comments[1].note_date_time = lb.active_status_dt_tm
 				pop_diagnosis_reply_out->encounter[d1.seq].diagnosis[d2.seq].comments[1].provider.provider_id = lb.active_status_prsnl_id
 				pop_diagnosis_reply_out->encounter[d1.seq].diagnosis[d2.seq].comments[1].provider.provider_name = p.name_full_formatted
 
 				if(lb.compression_cd = c_compressed_cd)
 					blobout = fillstring(32768, ' ')
 					stat = uar_ocf_uncompress(lb.long_blob, size(trim(lb.long_blob),3), blobout, size(blobout), 32768)
 					pop_diagnosis_reply_out->encounter[d1.seq].diagnosis[d2.seq].comments[1].comments = trim(blobout,3)
 				else
 					pop_diagnosis_reply_out->encounter[d1.seq].diagnosis[d2.seq].comments[1].comments = trim(lb.long_blob)
 				endif
 
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
end
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
					call ErrorHandler2("EXECUTE", "F", "POP_DIAGNOSIS", build("Invalid Facility Code: ", loc_req->codes[num]->code_value),
					"2040", build("Invalid Facility Code: ",loc_req->codes[num]->code_value),pop_diagnosis_reply_out) ;012
					set stat = alterlist(pop_diagnosis_reply_out,0)
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
 
	if(pop_diagnosis_reply_out->enc_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
   ;getting person info
 
   select into "nl:"
   from person p
   plan p
   		where expand(idx,1,pop_diagnosis_reply_out->enc_cnt,p.person_id,pop_diagnosis_reply_out->encounter[idx].patient.patient_id)
   			and p.person_id > 0
   detail
   		pos = locateval(idx,1,pop_diagnosis_reply_out->enc_cnt,p.person_id,pop_diagnosis_reply_out->encounter[idx].patient.patient_id)
   		if(pos > 0)
   			pop_diagnosis_reply_out->encounter[pos].patient.first_name = p.name_first
			pop_diagnosis_reply_out->encounter[pos].patient.last_name = p.name_last
			pop_diagnosis_reply_out->encounter[pos].patient.middle_name = p.name_middle
			pop_diagnosis_reply_out->encounter[pos].patient.gender.id = p.sex_cd
			pop_diagnosis_reply_out->encounter[pos].patient.gender.name =uar_get_code_display(p.sex_cd)
			pop_diagnosis_reply_out->encounter[pos].patient.display_name = trim(p.name_full_formatted)
			pop_diagnosis_reply_out->encounter[pos].patient.birth_date_time = p.birth_dt_tm
			pop_diagnosis_reply_out->encounter[pos].patient.sdob =
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
	plan ea where expand(idx,1,pop_diagnosis_reply_out->enc_cnt,ea.encntr_id
										,pop_diagnosis_reply_out->encounter[idx].encounter.encounter_id)
		and ea.encntr_alias_type_cd in (c_fin_encntr_alias_type_cd, c_mrn_encntr_alias_type_cd) ;1077
		and ea.active_ind = 1
		and ea.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime)
		and ea.end_effective_dt_tm >= cnvtdatetime(curdate,curtime)
	 detail
	 	pos = locateval(idx,1,pop_diagnosis_reply_out->enc_cnt,ea.encntr_id
	 						,pop_diagnosis_reply_out->encounter[idx].encounter.encounter_id)
	 	if(pos > 0)
			if(ea.encntr_alias_type_cd = c_mrn_encntr_alias_type_cd)  ;011
				pop_diagnosis_reply_out->encounter[pos].patient.mrn = ea.alias
			else
				pop_diagnosis_reply_out->encounter[pos].encounter.financial_number = ea.alias
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
 
 
