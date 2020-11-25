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
      Source file name:     snsro_get_pop_billing.prg
      Object name:          vigilanz_get_pop_billing
      Program purpose:      Retrieve charge data for a given time frame
      Executing from:       Emissary Service
      Special Notes:      	This population query will check for maximum records
      						and a maximum date range and if those are exceeded
      						a failure status and message will get returned.
******************************************************************************
                     MODIFICATION CONTROL LOG
 ***********************************************************************
  Mod Date     Engineer     Comment
  --- -------- ------------	--------------------------------------------
  000 06/28/16 AAB			Initial write
  001 07/14/16 AAB 			Update DRG segment
  002 07/17/17 DJP			Check for From Date > To Date
  003 07/17/17 DJP			UTC date/time code changes
  004 07/19/17 AAB 			Added Discharge Unit
  005 07/21/17 AAB 			Added LOC_LIST
  006 07/27/17 AAB 			Support Non Rev Cycle clients
  008 08/01/17 AAB 			Fixed FIN NBR and Created updt_dt_tm
  009 08/07/17 JCO			Changed %i to execute; updated ErrorHandler
  010 08/09/17 AAB 			Add Birth units
  011 08/24/17 AAB 			Fix MRN not populating
  012 02/20/18 RJC			Check Procedure Table for updates
  013 03/14/18 RJC			Check Diagnosis table for updates
  014 03/21/18 RJC			Added version code and copyright block
  015 04/16/18 RJC			Minor rewrite to improve performance and reduce temp data size
  016 04/11/18 DJP			Added string Birthdate to person object
  017 07/11/18 RJC			Performance improvments
  018 07/26/18 RJC			Additional Performance improvements, code cleanup. Removed unnecessary joins and data elements
  019 08/29/18 STV          Fix for nonutc environments and time conversions
  020 12/28/18 STV          outerjoin to fix sparse data on encounter object
  021 02/11/19 RJC			added outerjoins in codedprocs subroutine
  022 02/14/19 RJC			updated billing status; removed drg filters; removed call to claim info; added proc modifiers
  023 04/03/19 STV          Adding Timeout parameter
  024 04/22/19 RJC			Changed dummyt joins to use expand/locateval where possible for efficiency improvements
  025 05/22/19 STV          adjust to only grab the surgeon relationship for the procedure
***********************************************************************/
drop program vigilanz_get_pop_billing go
create program vigilanz_get_pop_billing
 
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
free record pop_billing_reply_out
record pop_billing_reply_out
(
  1 qual[*]
    2 gl_trans_log_id 			= f8
    2 activity_id 				= f8
    2 encntr_id 				= f8
    2 person_id 				= f8
    2 fin_nbr 					= vc
    2 sending_facility			= vc
    2 mrn						= vc
    2 patient_classification_cd = f8
    2 patient_class 			= vc
	2 admission_dt_tm			= dq8
    2 discharge_dt_tm			= dq8
    2 discharge_unit_cd			= f8 	;004
    2 discharge_unit_disp		= vc   	;004
    2 arrive_dt_tm				= dq8
    2 bill_status_cd 			= f8
    2 bill_status_disp			= vc
    2 inpatient_admit_dt_tm		= dq8
    2 admit_care_unit_disp		= vc
    2 admit_care_unit_cd		= f8
    2 discharge_care_unit		= vc
	2 encntr_type_cd			= f8
	2 encntr_type_disp			= vc
	2 encntr_type_class_cd		= f8
	2 encntr_type_class_disp	= vc
    2 name_first				= vc
    2 name_last 				= vc
    2 name_middle				= vc
    2 birth_dt_tm				= dq8
    2 birth_weight 				= vc
    2 birth_units				= vc	;010
    2 birth_unit_cd				= f8	;010
    2 facility_cd				= f8
    2 facility_disp				= vc
    2 nurse_unit_cd				= f8
    2 nurse_unit_disp			= vc
    2 room_cd					= f8
    2 room_disp					= vc
    2 bed_cd					= f8
    2 bed_disp					= vc
	2 created_updated_dt_tm		= dq8
	2 provider_prsnl_list[*]
		 3 prsnl_id			  	= f8
		 3 prsnl_name		  	= vc
		 3 prsnl_type		  	= vc
		 3 prsnl_type_cd		= f8
		 3 prsnl_reltn_type_cd   = f8
		 3 prsnl_reltn_type_disp  = vc
		 3 npi					  =	vc
	2 sex_cd					= f8
	2 sex_disp					= vc
	2 admit_src_cd				= f8
	2 admit_src_disp			= vc
	2 admit_type_cd				= f8
	2 admit_type_disp			= vc
	2 discharge_status_cd		= f8
	2 discharge_status_disp		= vc
	2 disch_to_loctn_cd			= f8
	2 disch_to_loctn			= vc
	2 diagnosis_list[*]
		3 diagnosis_id 				= f8
		3 diag_type_cd				= f8
		3 diag_type_disp			= vc
		3 present_on_admit_cd		= f8
		3 present_on_admit_disp		= vc
		3 clinical_diag				= vc
    	3 source_vocabulary_cd 		= f8
   		3 source_vocabulary_disp 	= c40
   		3 ranking_cd				= f8
   		3 ranking_disp				= vc
   		3 clinical_diag_priority    = i4
   		3 nomenclature_id			= f8
   		3 diag_priority				= i4
   		3 source_ident				= vc
   		3 hospital_acquired_ind     = i2
    2 pft_encntr_id 			= f8
    2 charge_tier_cd 			= f8
    2 charge_tier_disp  		= vc
	2 charge_desc 				= vc
	2 charge_activity_type		= vc
    2 charge_item_id			= f8
    2 claim_nbr 				= vc
    2 ord_location_cd 			= f8
    2 ord_location_disp			= vc
    2 perf_location_cd 			= f8
    2 perf_location_disp		= vc
    2 post_dt_tm				= dq8
    2 service_dt_tm 		    = dq8
    2 ordering_provider_id		= f8
    2 ordering_provider			= vc
    2 billing_provider			= vc
    2 billing_provider_id		= f8
    2 plan_name					= vc
    2 drg_list[*]
    	3 drg_id 						= f8
    	3 drg_name						= vc
    	3 drg_cd						= vc
   	 	3 drg_desc						= vc
   	 	3 IsBilling						= i2
   	 	3 drg_category					= vc
   	 	3 drg_weight					= f8
   	 	3 amlos							= f8
   	 	3 gmlos							= f8
   	 	3 mdc_cd						= f8
   	 	3 mdc_disp						= vc
   	 	3 severity_of_illness_cd		= f8
   	 	3 severity_of_illness_disp		= vc
   	 	3 drg_payment					= i4
   	 	3 drg_payor_cd					= f8
   	 	3 drg_payor_disp				= vc
   	 	3 drg_priority					= i4
   	 	3 outlier_days					= i4
   	 	3 outlier_cost					= i4
   	 	3 outlier_reimbursement_cost 	= i4
   	 	3 risk_of_mortality_cd 			= f8
   	 	3 risk_of_mortality_disp 		= vc
   	 	3 severity_of_illness_cd		= f8
   	 	3 severity_of_illness_disp		= vc
   	 	3 source_vocabulary_cd			= f8
   	 	3 source_vocabulary_disp		= vc
   	 	3 comorbidity_cd				= f8
   	 	3 comorbidity_disp				= vc
    2 icd9code1 = vc
    2 icd9code2 = vc
    2 icd9code3 = vc
    2 icd9code4 = vc
    2 icd9code5 = vc
    2 icd10code1 = vc
    2 icd10code2 = vc
    2 icd10code3 = vc
    2 icd10code4 = vc
    2 icd10code5 = vc
    2 cptCode = vc
    2 modifierCode1 = vc
    2 modifierCode2 = vc
    2 modifierCode3 = vc
    2 modifierCode4 = vc
    2 wrvu = vc
    2 chargeAmt 				= vc
    2 chargeUnits 				= f8
    2 total_charge 				= f8
    2 total_cost				= f8
    2 psych_patient_flag		= i4
    2 correctedCharge = vc
    2 correctedDate = vc ;Y/N
    2 originalChargeID = vc
    2 chargeReportingPeriod = vc
    2 coded_procs
	   3 qual[*]
	        4 Procedure_Id          = f8
	        4 Alias_Pool_Cd         = f8
	        4 Source_Vocabulary_Cd  = f8
	        4 source_vocabulary_disp= vc
	        4 principle_type_disp 	= vc
	        4 Source_Identifier     = vc
	        4 Source_String         = vc
	        4 Principle_Type_Cd     = f8
	        4 Proc_Dt_Tm            = dq8
	        4 Proc_Func_Type_Cd     = f8
	        4 proc_func_type_disp	= vc
	        4 Anesthesia_Minutes    = i4
	        4 Anesthesia_Cd         = f8
	        4 Anesthesia_type		= vc
	        4 Proc_Priority         = i4
	        4 APC_Source_Identifier = vc
	        4 APC_Source_String     = vc
	        4 Practitioner[*]
	            5 Prsnl_Id          = f8
	            5 Last_Name         = vc
	            5 First_Name        = vc
	            5 Id_Type           = vc
	            5 NPI       		= vc
	            5 prsnl_name		= vc
	         4 modifiers			= vc
	2 person
		  3 person_id 					= f8
		  3 name_full_formatted 		= vc
		  3 name_last 					= vc
		  3 name_first 					= vc
		  3 name_middle 				= vc
		  3 mrn							= vc    ;pa.alias
		  3 dob							= dq8
		  3 gender_id					= f8
		  3 gender_disp					= vc
		  3 sDOB						= c10 ;016
 	2 encounter
		  3 encounter_id 				= f8
		  3 encounter_type_cd			= f8
		  3 encounter_type_disp			= vc
		  3 encounter_type_class_cd		= f8
	      3 encounter_type_class_disp	= vc
 		  3 arrive_date					= dq8	;e.admit_dt_tm
 		  3 discharge_date				= dq8	;e.discharge_dt_tm
 		  3 fin_nbr						= vc	;ea.alias
	 	  3 patient_location
	 		  	4  location_cd              = f8
	  			4  location_disp            = vc
	  			4  loc_bed_cd               = f8
	  			4  loc_bed_disp             = vc
	  			4  loc_building_cd          = f8
	  			4  loc_building_disp        = vc
	  			4  loc_facility_cd          = f8
	  			4  loc_facility_disp        = vc
	  			4  loc_nurse_unit_cd        = f8
	 			4  loc_nurse_unit_disp      = vc
	 			4  loc_room_cd              = f8
	  			4  loc_room_disp            = vc
	  			4  loc_temp_cd              = f8
	  			4  loc_temp_disp            = vc
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
;009 %i ccluserdir:snsro_status_block.inc
/*009 begin */
  1 status_data
    2 status = c1
    2 subeventstatus[1]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
      3 Code = c4
      3 Description = vc
/*009 end */
)
 
free record loc_req
record loc_req (
	1 codes[*]
		2 code_value					= f8
		2 fac_identifier				= vc
)
 
;initialize status to FAIL
set pop_billing_reply_out->status_data->status = "F"
 
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
 
;Constants
declare c_mrn_encntr_alias_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",319,"MRN"))
declare c_npi_prsnl_alias_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",320,"NPI"))
declare c_birthweight_event_cd			= f8 with protect, constant(uar_get_code_by("DISPLAYKEY",72,"BIRTHWEIGHT"))
declare c_fin_encntr_alias_type_cd 		= f8 with protect,constant(uar_get_code_by("MEANING",319,"FIN NBR"))
declare c_revenue_acct_type_cd 			= f8 with protect,constant(uar_get_code_by("MEANING",18736,"REVENUE"))
declare c_anesthesia_proc_function_cd	= f8 with protect,constant(uar_get_code_by("MEANING",387,"ANESTHESIA"))
declare c_cpt4_source_vocabulary_cd 	= f8 with protect,constant(uar_get_code_by("MEANING",400,"CPT4"))
declare c_msdrg_source_vocabulary_cd 	= f8 with protect,constant(uar_get_code_by("MEANING",400,"MSDRG"))
declare c_aprdrg_source_vocabulary_cd 	= f8 with protect,constant(uar_get_code_by("MEANING",400,"APRDRG"))
 
/**************************************************************************
;DECLARE SUBROUTINES
***************************************************************************/
declare getChargeData(null) 				= null with protect
declare getClaimPlanInfo(null)				= null with protect	;015
declare getProcedureEncounters(null) 		= null with protect ;012
declare getDiagnosisEncounters(null) 		= null with protect ;013
declare getCodedProcs(null) 				= null with protect
declare getDiagnosis(null) 					= null with protect
declare getPrsnl(null) 						= null with protect
declare getDRG(null) 						= null with protect
declare ParseLocations(sLocFacilities = vc)	= null with protect
declare PostAmble(null)						= null with protect
 
 
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
	call echo(build ("DISPLAY END DT TIME",format(qToDateTime, "@LONGDATETIME")))
endif
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
;Validate Username
set iRet = PopulateAudit(sUserName, 0.0, pop_billing_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F","POP_BILLING", "Invalid User for Audit.",
	"1001",build("UserId is invalid: ", sUserName),pop_billing_reply_out) ;019
	go to EXIT_SCRIPT
endif
 
;Validate from date is not greater than to date
if (qFromDateTime > qToDateTime)
	call ErrorHandler2("VALIDATE", "F", "POP_BILLING", "From Date Greater than To Date. Refine Dates Entered.",
	"2010", "From Date Greater than To Date. Refine Dates Entered.", pop_billing_reply_out)
	go to EXIT_SCRIPT
endif
 
 
; Validate Time Window doesn't exceed threshold
set iRet = ThreshHoldValidator(iTimeMax,"s",qFromDateTime,qToDateTime)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "POP_BILLING", "Date Range Too Long. Refine Query.",
	"2011","Date Range Too Long. Refine Query.",pop_billing_reply_out)
	go to EXIT_SCRIPT
endif
 
; Parse Locations if any provided
if(sLocFacilities > " ")
	call ParseLocations(sLocFacilities)
endif
 
; Get Billing Data
call getChargeData(null)
 
; Check Procedures Table for activity ;012
call getProcedureEncounters(null)
 
; Check Diagnoses Table for activity  ;013
call getDiagnosisEncounters(null)
 
; Get additional details if data found
if(size(pop_billing_reply_out->qual,5) > 0)
call echo(build("size: ", cnvtstring(size(pop_billing_reply_out->qual,5))))
	;call getClaimPlanInfo(null)
	call getDiagnosis(null)
	call getCodedProcs(null)
	call getPrsnl(null)
	call getDRG(null)
	call PostAmble(null)
 
 	call ErrorHandler("EXECUTE", "S", "POP_BILLING", "Success retrieving billing activity",  pop_billing_reply_out) ;019
else
    set pop_billing_reply_out->status_data->status = "Z"
    call ErrorHandler("EXECUTE", "Z", "POP_BILLING", "No records qualify.", pop_billing_reply_out)
endif
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(pop_billing_reply_out)
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_pop_billing.json")
	call echo(build2("_file : ", _file))
	call echojson(pop_billing_reply_out, _file, 0)
    call echorecord(pop_billing_reply_out)
	call echo(JSONout)
endif
 
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: getChargeData(null)
;  Description: Subroutine to get Charge Data
**************************************************************************/
subroutine getChargeData(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("getChargeData Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
call echo(build("time_out_begin function: ",trim(cnvtstring(timeOutThreshold))))
	endif
 
 	; Location filter
	if(size(loc_req->codes,5) > 0)
		set sLocWhereClause = "expand(ndx2,1,size(loc_req->codes,5),e.loc_facility_cd,loc_req->codes[ndx2].code_value)"
	else
		set sLocWhereClause = "e.loc_facility_cd > 0.0 "
	endif
 
	free record temp
	record temp (
		1 qual_cnt = i4
		1 qual[*]
			2 created_updated_dttm = dq8
			2 pft_encntr_id = f8
			2 encntr_id = f8
	)
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
	; Charge Data - RevCycle Clients
	select into "nl:"
		gl.activity_dt_tm
		,pe.encntr_id
	from
		gl_trans_log gl
		,pft_trans_reltn ptr
		,pft_trans_reltn ptr2
		,account ac
		,pft_encntr pe
	plan gl where gl.activity_dt_tm between cnvtdatetime(qFromDateTime)
		and cnvtdatetime(qToDateTime)
	join ptr2 where ptr2.gl_trans_log_id = gl.gl_trans_log_id
		and ptr2.parent_entity_name = "ACCOUNT"
		and ptr2.active_ind = 1
	join ac where ac.acct_id = ptr2.parent_entity_id
		and ac.acct_type_cd = c_revenue_acct_type_cd
		and ac.active_ind = 1
	join ptr where ptr.activity_id = ptr2.activity_id
		and ptr.parent_entity_name = "PFTENCNTR"
		and ptr.active_ind = 1
	join pe	where pe.pft_encntr_id = ptr.parent_entity_id
	head report
		cnt = 0
		stat = alterlist(temp->qual,5000)
	detail
		cnt = cnt + 1
		if(mod(cnt,100) = 1 and cnt > 5000)
			stat = alterlist(temp->qual,cnt + 99)
		endif
 
		temp->qual[cnt]->created_updated_dttm = gl.activity_dt_tm ;015
		temp->qual[cnt]->encntr_id = pe.encntr_id
	foot report
		stat = alterlist(temp->qual,cnt)
		temp->qual_cnt = cnt
 
	with nocounter, time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
 	; Charge Data - Non-RevCycle Clients
	if(temp->qual_cnt = 0)
		set queryStartTm = cnvtdatetime(curdate, curtime3)
 
		select into "nl:"
			c.service_dt_tm
			,c.encntr_id
		from charge c
		plan c where c.service_dt_tm between  cnvtdatetime(qFromDateTime)
			and cnvtdatetime(qToDateTime)
		head report
			cnt = 0
			stat = alterlist(temp->qual,5000)
		detail
			cnt = cnt + 1
			if(mod(cnt,100) = 1 and cnt > 5000)
				stat = alterlist(temp->qual,cnt + 99)
			endif
 
			temp->qual[cnt]->created_updated_dttm = c.service_dt_tm ;015
			temp->qual[cnt]->encntr_id = c.encntr_id
		foot report
			stat = alterlist(temp->qual,cnt)
			temp->qual_cnt = cnt
 
		with nocounter, time = value(timeOutThreshold)
 
		set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
		;exits the script because query timed out
		if(timeOutThreshold < 1)
			go to EXIT_SCRIPT
		endif
	endif
 
 
	; Post Amble - filter by encounter location & get billing status
	declare br_updt_dt_tm = dq8
	declare new_nbr = vc
	declare fin_recur_fin_nbr = vc
 
	;Set expand control value - 018
	if(size(loc_req->codes,5) > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	if(temp->qual_cnt > 0)
	set queryStartTm = cnvtdatetime(curdate, curtime3)
		select into "nl:"
			encntr_id = temp->qual[d.seq].encntr_id
		from  (dummyt d with seq = temp->qual_cnt)
			, encounter e
			, pft_encntr pe
		plan d
		join e where e.encntr_id = temp->qual[d.seq].encntr_id
			and parser(sLocWhereClause)
		join pe where pe.encntr_id = outerjoin(e.encntr_id)
		order by temp->qual[d.seq].encntr_id
		head report
			x = 0
			stat = alterlist(pop_billing_reply_out->qual,temp->qual_cnt)
		head encntr_id
			x = x + 1
 
			if(temp->qual[d.seq].created_updated_dttm > pop_billing_reply_out->qual[x]->created_updated_dt_tm)
				pop_billing_reply_out->qual[x]->created_updated_dt_tm = temp->qual[d.seq].created_updated_dttm
			endif
 
			pop_billing_reply_out->qual[x]->bill_status_cd = pe.bill_status_cd
			pop_billing_reply_out->qual[x]->bill_status_disp = uar_get_code_display(pe.bill_status_cd)
			pop_billing_reply_out->qual[x]->encntr_id = temp->qual[d.seq].encntr_id
			pop_billing_reply_out->qual[x]->person->person_id = e.person_id
 
			;encounter info
			pop_billing_reply_out->qual[x]->discharge_unit_cd = e.loc_nurse_unit_cd   ;004
			pop_billing_reply_out->qual[x]->discharge_unit_disp = uar_get_code_display(e.loc_nurse_unit_cd)   ;004
			pop_billing_reply_out->qual[x]->admit_care_unit_cd = e.loc_nurse_unit_cd
			pop_billing_reply_out->qual[x]->admit_care_unit_disp = uar_get_code_display(e.loc_nurse_unit_cd)
			pop_billing_reply_out->qual[x]->admission_dt_tm = e.reg_dt_tm
			pop_billing_reply_out->qual[x]->admit_src_cd = e.admit_src_cd
			pop_billing_reply_out->qual[x]->admit_src_disp = uar_get_code_display(e.admit_src_cd)
			pop_billing_reply_out->qual[x]->admit_type_cd = e.admit_type_cd
			pop_billing_reply_out->qual[x]->admit_type_disp = uar_get_code_display(e.admit_type_cd)
			pop_billing_reply_out->qual[x]->arrive_dt_tm = e.reg_dt_tm
			pop_billing_reply_out->qual[x]->inpatient_admit_dt_tm = e.inpatient_admit_dt_tm
			pop_billing_reply_out->qual[x]->discharge_dt_tm = e.disch_dt_tm
			pop_billing_reply_out->qual[x]->patient_classification_cd = e.patient_classification_cd
			pop_billing_reply_out->qual[x]->patient_class = uar_get_code_display(e.patient_classification_cd)
			pop_billing_reply_out->qual[x]->discharge_status_cd = e.disch_disposition_cd
			pop_billing_reply_out->qual[x]->discharge_status_disp = uar_get_code_display(e.disch_disposition_cd)
			pop_billing_reply_out->qual[x]->encntr_type_cd = e.encntr_type_cd
			pop_billing_reply_out->qual[x]->encntr_type_disp = uar_get_code_display(e.encntr_type_cd)
			pop_billing_reply_out->qual[x]->encntr_type_class_cd = e.encntr_type_class_cd
			pop_billing_reply_out->qual[x]->encntr_type_class_disp = uar_get_code_display(e.encntr_type_class_cd)
			pop_billing_reply_out->qual[x]->disch_to_loctn_cd = e.disch_to_loctn_cd
			pop_billing_reply_out->qual[x]->disch_to_loctn = uar_get_code_display(e.disch_to_loctn_cd)
			pop_billing_reply_out->qual[x]->sending_facility = uar_get_code_display(e.loc_facility_cd)
			pop_billing_reply_out->qual[x]->patient_class = uar_get_code_display(e.patient_classification_cd)
			pop_billing_reply_out->qual[x]->patient_classification_cd = e.patient_classification_cd
			pop_billing_reply_out->qual[x]->facility_cd = e.loc_facility_cd
			pop_billing_reply_out->qual[x]->nurse_unit_cd = e.loc_nurse_unit_cd
			pop_billing_reply_out->qual[x]->room_cd = e.loc_room_cd
			pop_billing_reply_out->qual[x]->bed_cd = e.loc_bed_cd
			pop_billing_reply_out->qual[x]->facility_disp = uar_get_code_display(e.loc_facility_cd)
			pop_billing_reply_out->qual[x]->nurse_unit_disp = uar_get_code_display(e.loc_nurse_unit_cd)
			pop_billing_reply_out->qual[x]->room_disp = uar_get_code_display(e.loc_room_cd)
			pop_billing_reply_out->qual[x]->bed_disp = uar_get_code_display(e.loc_bed_cd)
			pop_billing_reply_out->qual[x]->encounter->encounter_id  = e.encntr_id
			pop_billing_reply_out->qual[x]->encounter->arrive_date = e.reg_dt_tm
			pop_billing_reply_out->qual[x]->encounter->discharge_date = e.disch_dt_tm
			pop_billing_reply_out->qual[x]->encounter->encounter_type_cd = e.encntr_type_cd
			pop_billing_reply_out->qual[x]->encounter->encounter_type_class_cd = e.encntr_type_class_cd
			pop_billing_reply_out->qual[x]->encounter->encounter_type_class_disp = uar_get_code_display(e.encntr_type_class_cd)
			pop_billing_reply_out->qual[x]->encounter->encounter_type_disp = uar_get_code_display(e.encntr_type_cd)
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_bed_cd = e.loc_bed_cd
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_bed_disp =  uar_get_code_display(e.loc_bed_cd)
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_building_cd = e.loc_building_cd
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_building_disp = uar_get_code_display(e.loc_building_cd)
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_facility_cd = e.loc_facility_cd
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_facility_disp = uar_get_code_display(e.loc_facility_cd)
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_nurse_unit_cd = e.loc_nurse_unit_cd
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_nurse_unit_disp = uar_get_code_display(e.loc_nurse_unit_cd)
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_room_cd = e.loc_room_cd
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_room_disp = uar_get_code_display(e.loc_room_cd)
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_temp_cd  = 0.0
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_temp_disp = ""
			pop_billing_reply_out->qual[x]->encounter->patient_location->location_cd = e.location_cd
			pop_billing_reply_out->qual[x]->encounter->patient_location->location_disp = uar_get_code_display(e.location_cd)
 
 
			if(pe.pft_encntr_alias > "")
				if(pe.recur_ind = 1)
					pos = findstring("-",trim(pe.pft_encntr_alias))
					if (pos > 0)
						new_nbr = substring(1, pos-1, trim(pe.pft_encntr_alias))
						fin_recur_fin_nbr = build(new_nbr,"-",trim(cnvtstring(pe.recur_seq)))
						pop_billing_reply_out->qual[x]->fin_nbr = fin_recur_fin_nbr
					else
						pop_billing_reply_out->qual[x]->fin_nbr = pe.pft_encntr_alias
						pop_billing_reply_out->qual[x]->encounter->fin_nbr = pe.pft_encntr_alias
					endif
				else
					pop_billing_reply_out->qual[x]->fin_nbr = pe.pft_encntr_alias
					pop_billing_reply_out->qual[x]->encounter->fin_nbr =pe.pft_encntr_alias
				endif
			endif
		foot report
			stat = alterlist(pop_billing_reply_out->qual,x)
 
		with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
		set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
		;exits the script because query timed out
		if(timeOutThreshold < 1)
			go to EXIT_SCRIPT
		endif
 
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("getChargeData Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end ;End Sub
 
 /*************************************************************************
;  Name: getClaimPlanInfo(null) = null 		;015
;  Description: Get claim number and plan info
**************************************************************************/
subroutine getClaimPlanInfo(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("getClaimPlanInfo Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
call echo(build("time_out_begin function: ",trim(cnvtstring(timeOutThreshold))))
	endif
 
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
		br.bill_nbr_disp
		,hp.plan_name
	from (dummyt d with seq = value(size(pop_billing_reply_out->qual,5)))
		,benefit_order bo
		,bo_hp_reltn bhr
		,health_plan hp
		,bill_reltn brn
		,bill_rec br
	plan d
	join bo where bo.pft_encntr_id = pop_billing_reply_out->qual[d.seq]->pft_encntr_id
		and bo.fin_class_cd = 0.00
		and bo.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
		and bo.active_ind = 1
	join bhr where bhr.benefit_order_id = bo.benefit_order_id
		and bhr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
		and bhr.active_ind = 1
	join hp where hp.health_plan_id = bhr.health_plan_id
		and hp.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
		and hp.active_ind = 1
	join brn where brn.parent_entity_id = bhr.bo_hp_reltn_id
		and brn.parent_entity_name = "BO_HP_RELTN"
		and brn.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
		and brn.active_ind = 1
	join br where br.corsp_activity_id = brn.corsp_activity_id
		and br.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
		and br.active_ind = 1
	detail
		pop_billing_reply_out->qual[d.seq]->claim_nbr = br.bill_nbr_disp
		pop_billing_reply_out->qual[d.seq]->plan_name = hp.plan_name
	with nocounter, time = value(timeOutThreshold)
 
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("getClaimPlanInfo Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: getProcedureEncounters(null) = null 		;012
;  Description: Get encounters based on procedure table activity
**************************************************************************/
subroutine getProcedureEncounters(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("getProcedureEncounters Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
call echo(build("time_out_begin function: ",trim(cnvtstring(timeOutThreshold))))
	endif
 
 	;Location filter
	if(size(loc_req->codes,5) > 0)
		set sLocWhereClause = "expand(ndx2,1,size(loc_req->codes,5),e.loc_facility_cd,loc_req->codes[ndx2].code_value)"
	else
		set sLocWhereClause = "e.loc_facility_cd > 0.0 "
	endif
 
 	; Encounter filter
	if(size(pop_billing_reply_out->qual,5) > 0)
		set sEncWhereClause =
		" not(expand(num,1,size(pop_billing_reply_out->qual,5),pr.encntr_id,pop_billing_reply_out->qual[num].encntr_id))"
 	else
 		set sEncWhereClause = " pr.encntr_id > 0"
 	endif
 
 	;Set expand control value - 018
	if(size(loc_req->codes,5) > 200 or size(pop_billing_reply_out->qual,5) > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
 	set num = 1
 
    set queryStartTm = cnvtdatetime(curdate, curtime3)
  	; Add encounters if they don't already exist
	select into "nl:"
		pr.updt_dt_tm
		, pr.encntr_id
	from procedure pr
	,encounter e
	plan pr where pr.updt_dt_tm between cnvtdatetime(qFromDateTime) and cnvtdatetime(qToDateTime)
			and pr.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
			and pr.active_ind = 1
			and parser(sEncWhereClause)
	join e where e.encntr_id = pr.encntr_id
			and parser(sLocWhereClause)
	order by pr.encntr_id
	head report
		x = size(pop_billing_reply_out->qual,5)
	head pr.encntr_id
		x = x + 1
		stat = alterlist(pop_billing_reply_out->qual,x)
 
		pop_billing_reply_out->qual[x]->created_updated_dt_tm = pr.updt_dt_tm
		pop_billing_reply_out->qual[x]->encntr_id = pr.encntr_id
 
		pop_billing_reply_out->qual[x]->person->person_id = e.person_id
 
			;encounter info
			pop_billing_reply_out->qual[x]->discharge_unit_cd = e.loc_nurse_unit_cd   ;004
			pop_billing_reply_out->qual[x]->discharge_unit_disp = uar_get_code_display(e.loc_nurse_unit_cd)   ;004
			pop_billing_reply_out->qual[x]->admit_care_unit_cd = e.loc_nurse_unit_cd
			pop_billing_reply_out->qual[x]->admit_care_unit_disp = uar_get_code_display(e.loc_nurse_unit_cd)
			pop_billing_reply_out->qual[x]->admission_dt_tm = e.reg_dt_tm
			pop_billing_reply_out->qual[x]->admit_src_cd = e.admit_src_cd
			pop_billing_reply_out->qual[x]->admit_src_disp = uar_get_code_display(e.admit_src_cd)
			pop_billing_reply_out->qual[x]->admit_type_cd = e.admit_type_cd
			pop_billing_reply_out->qual[x]->admit_type_disp = uar_get_code_display(e.admit_type_cd)
			pop_billing_reply_out->qual[x]->arrive_dt_tm = e.reg_dt_tm
			pop_billing_reply_out->qual[x]->inpatient_admit_dt_tm = e.inpatient_admit_dt_tm
			pop_billing_reply_out->qual[x]->discharge_dt_tm = e.disch_dt_tm
			pop_billing_reply_out->qual[x]->patient_classification_cd = e.patient_classification_cd
			pop_billing_reply_out->qual[x]->patient_class = uar_get_code_display(e.patient_classification_cd)
			pop_billing_reply_out->qual[x]->discharge_status_cd = e.disch_disposition_cd
			pop_billing_reply_out->qual[x]->discharge_status_disp = uar_get_code_display(e.disch_disposition_cd)
			pop_billing_reply_out->qual[x]->encntr_type_cd = e.encntr_type_cd
			pop_billing_reply_out->qual[x]->encntr_type_disp = uar_get_code_display(e.encntr_type_cd)
			pop_billing_reply_out->qual[x]->encntr_type_class_cd = e.encntr_type_class_cd
			pop_billing_reply_out->qual[x]->encntr_type_class_disp = uar_get_code_display(e.encntr_type_class_cd)
			pop_billing_reply_out->qual[x]->disch_to_loctn_cd = e.disch_to_loctn_cd
			pop_billing_reply_out->qual[x]->disch_to_loctn = uar_get_code_display(e.disch_to_loctn_cd)
			pop_billing_reply_out->qual[x]->sending_facility = uar_get_code_display(e.loc_facility_cd)
			pop_billing_reply_out->qual[x]->patient_class = uar_get_code_display(e.patient_classification_cd)
			pop_billing_reply_out->qual[x]->patient_classification_cd = e.patient_classification_cd
			pop_billing_reply_out->qual[x]->facility_cd = e.loc_facility_cd
			pop_billing_reply_out->qual[x]->nurse_unit_cd = e.loc_nurse_unit_cd
			pop_billing_reply_out->qual[x]->room_cd = e.loc_room_cd
			pop_billing_reply_out->qual[x]->bed_cd = e.loc_bed_cd
			pop_billing_reply_out->qual[x]->facility_disp = uar_get_code_display(e.loc_facility_cd)
			pop_billing_reply_out->qual[x]->nurse_unit_disp = uar_get_code_display(e.loc_nurse_unit_cd)
			pop_billing_reply_out->qual[x]->room_disp = uar_get_code_display(e.loc_room_cd)
			pop_billing_reply_out->qual[x]->bed_disp = uar_get_code_display(e.loc_bed_cd)
			pop_billing_reply_out->qual[x]->encounter->encounter_id  = e.encntr_id
			pop_billing_reply_out->qual[x]->encounter->arrive_date = e.reg_dt_tm
			pop_billing_reply_out->qual[x]->encounter->discharge_date = e.disch_dt_tm
			pop_billing_reply_out->qual[x]->encounter->encounter_type_cd = e.encntr_type_cd
			pop_billing_reply_out->qual[x]->encounter->encounter_type_class_cd = e.encntr_type_class_cd
			pop_billing_reply_out->qual[x]->encounter->encounter_type_class_disp = uar_get_code_display(e.encntr_type_class_cd)
			pop_billing_reply_out->qual[x]->encounter->encounter_type_disp = uar_get_code_display(e.encntr_type_cd)
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_bed_cd = e.loc_bed_cd
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_bed_disp =  uar_get_code_display(e.loc_bed_cd)
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_building_cd = e.loc_building_cd
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_building_disp = uar_get_code_display(e.loc_building_cd)
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_facility_cd = e.loc_facility_cd
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_facility_disp = uar_get_code_display(e.loc_facility_cd)
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_nurse_unit_cd = e.loc_nurse_unit_cd
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_nurse_unit_disp = uar_get_code_display(e.loc_nurse_unit_cd)
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_room_cd = e.loc_room_cd
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_room_disp = uar_get_code_display(e.loc_room_cd)
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_temp_cd  = 0.0
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_temp_disp = ""
			pop_billing_reply_out->qual[x]->encounter->patient_location->location_cd = e.location_cd
			pop_billing_reply_out->qual[x]->encounter->patient_location->location_disp = uar_get_code_display(e.location_cd)
 
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
 	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
 
 	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("getProcedureEncounters Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
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
 
	; Encounter filter
	if(size(pop_billing_reply_out->qual,5) > 0)
		set sEncWhereClause =
		" not(expand(num,1,size(pop_billing_reply_out->qual,5),dg.encntr_id,pop_billing_reply_out->qual[num].encntr_id))"
 	else
 		set sEncWhereClause = " dg.encntr_id > 0"
 	endif
 
 	;Set expand control value - 018
	if(size(loc_req->codes,5) > 200 or size(pop_billing_reply_out->qual,5) > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
 	set num = 1
 
    set queryStartTm = cnvtdatetime(curdate, curtime3)
 
  	; Add encounters if they don't already exist
	select into "nl:"
		dg.updt_dt_tm
		,dg.encntr_id
	from diagnosis dg
	,encounter e
	plan dg where dg.updt_dt_tm between cnvtdatetime(qFromDateTime) and cnvtdatetime(qToDateTime)
		and dg.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
		and dg.active_ind = 1
		and parser(sEncWhereClause)
	join e where e.encntr_id = dg.encntr_id
		and parser(sLocWhereClause)
	order by dg.encntr_id
	head report
		x = size(pop_billing_reply_out->qual,5)
	head dg.encntr_id
		x = x + 1
		stat = alterlist(pop_billing_reply_out->qual,x)
 
		pop_billing_reply_out->qual[x]->created_updated_dt_tm = dg.updt_dt_tm
		pop_billing_reply_out->qual[x]->encntr_id = dg.encntr_id
 
		pop_billing_reply_out->qual[x]->person->person_id = e.person_id
 
			;encounter info
			pop_billing_reply_out->qual[x]->discharge_unit_cd = e.loc_nurse_unit_cd   ;004
			pop_billing_reply_out->qual[x]->discharge_unit_disp = uar_get_code_display(e.loc_nurse_unit_cd)   ;004
			pop_billing_reply_out->qual[x]->admit_care_unit_cd = e.loc_nurse_unit_cd
			pop_billing_reply_out->qual[x]->admit_care_unit_disp = uar_get_code_display(e.loc_nurse_unit_cd)
			pop_billing_reply_out->qual[x]->admission_dt_tm = e.reg_dt_tm
			pop_billing_reply_out->qual[x]->admit_src_cd = e.admit_src_cd
			pop_billing_reply_out->qual[x]->admit_src_disp = uar_get_code_display(e.admit_src_cd)
			pop_billing_reply_out->qual[x]->admit_type_cd = e.admit_type_cd
			pop_billing_reply_out->qual[x]->admit_type_disp = uar_get_code_display(e.admit_type_cd)
			pop_billing_reply_out->qual[x]->arrive_dt_tm = e.reg_dt_tm
			pop_billing_reply_out->qual[x]->inpatient_admit_dt_tm = e.inpatient_admit_dt_tm
			pop_billing_reply_out->qual[x]->discharge_dt_tm = e.disch_dt_tm
			pop_billing_reply_out->qual[x]->patient_classification_cd = e.patient_classification_cd
			pop_billing_reply_out->qual[x]->patient_class = uar_get_code_display(e.patient_classification_cd)
			pop_billing_reply_out->qual[x]->discharge_status_cd = e.disch_disposition_cd
			pop_billing_reply_out->qual[x]->discharge_status_disp = uar_get_code_display(e.disch_disposition_cd)
			pop_billing_reply_out->qual[x]->encntr_type_cd = e.encntr_type_cd
			pop_billing_reply_out->qual[x]->encntr_type_disp = uar_get_code_display(e.encntr_type_cd)
			pop_billing_reply_out->qual[x]->encntr_type_class_cd = e.encntr_type_class_cd
			pop_billing_reply_out->qual[x]->encntr_type_class_disp = uar_get_code_display(e.encntr_type_class_cd)
			pop_billing_reply_out->qual[x]->disch_to_loctn_cd = e.disch_to_loctn_cd
			pop_billing_reply_out->qual[x]->disch_to_loctn = uar_get_code_display(e.disch_to_loctn_cd)
			pop_billing_reply_out->qual[x]->sending_facility = uar_get_code_display(e.loc_facility_cd)
			pop_billing_reply_out->qual[x]->patient_class = uar_get_code_display(e.patient_classification_cd)
			pop_billing_reply_out->qual[x]->patient_classification_cd = e.patient_classification_cd
			pop_billing_reply_out->qual[x]->facility_cd = e.loc_facility_cd
			pop_billing_reply_out->qual[x]->nurse_unit_cd = e.loc_nurse_unit_cd
			pop_billing_reply_out->qual[x]->room_cd = e.loc_room_cd
			pop_billing_reply_out->qual[x]->bed_cd = e.loc_bed_cd
			pop_billing_reply_out->qual[x]->facility_disp = uar_get_code_display(e.loc_facility_cd)
			pop_billing_reply_out->qual[x]->nurse_unit_disp = uar_get_code_display(e.loc_nurse_unit_cd)
			pop_billing_reply_out->qual[x]->room_disp = uar_get_code_display(e.loc_room_cd)
			pop_billing_reply_out->qual[x]->bed_disp = uar_get_code_display(e.loc_bed_cd)
			pop_billing_reply_out->qual[x]->encounter->encounter_id  = e.encntr_id
			pop_billing_reply_out->qual[x]->encounter->arrive_date = e.reg_dt_tm
			pop_billing_reply_out->qual[x]->encounter->discharge_date = e.disch_dt_tm
			pop_billing_reply_out->qual[x]->encounter->encounter_type_cd = e.encntr_type_cd
			pop_billing_reply_out->qual[x]->encounter->encounter_type_class_cd = e.encntr_type_class_cd
			pop_billing_reply_out->qual[x]->encounter->encounter_type_class_disp = uar_get_code_display(e.encntr_type_class_cd)
			pop_billing_reply_out->qual[x]->encounter->encounter_type_disp = uar_get_code_display(e.encntr_type_cd)
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_bed_cd = e.loc_bed_cd
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_bed_disp =  uar_get_code_display(e.loc_bed_cd)
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_building_cd = e.loc_building_cd
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_building_disp = uar_get_code_display(e.loc_building_cd)
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_facility_cd = e.loc_facility_cd
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_facility_disp = uar_get_code_display(e.loc_facility_cd)
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_nurse_unit_cd = e.loc_nurse_unit_cd
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_nurse_unit_disp = uar_get_code_display(e.loc_nurse_unit_cd)
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_room_cd = e.loc_room_cd
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_room_disp = uar_get_code_display(e.loc_room_cd)
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_temp_cd  = 0.0
			pop_billing_reply_out->qual[x]->encounter->patient_location->loc_temp_disp = ""
			pop_billing_reply_out->qual[x]->encounter->patient_location->location_cd = e.location_cd
			pop_billing_reply_out->qual[x]->encounter->patient_location->location_disp = uar_get_code_display(e.location_cd)
 
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
;  Name: getCodedProcs a(null)
;  Description: Subroutine to get Coded Procs
**************************************************************************/
subroutine getCodedProcs(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("getCodedProcs Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
call echo(build("time_out_begin function: ",trim(cnvtstring(timeOutThreshold))))
	endif
 
	declare charge_cnt 		= i4 with  protect, noconstant(0)
	declare pr1_cnt 		= i4 with  protect, noconstant(0)
	declare x 				= i4 with  protect, noconstant(0)
	set charge_cnt 			= size(pop_billing_reply_out->qual,5)
	set c_surgeon_reltn_cd = uar_get_code_by("MEANING",388,"SURGEON")
 	set idx = 1
 	if(charge_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
	select into "nl:"
	from nomenclature n
		,procedure p
		,proc_prsnl_reltn proc
		,prsnl pr
		,prsnl_alias pa
	plan p where expand(idx,1,charge_cnt,p.encntr_id,pop_billing_reply_out->qual[idx]->encntr_id)
		and p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and p.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
		and p.active_ind = 1
	join n where n.nomenclature_id = outerjoin(p.nomenclature_id)
		and n.active_ind = outerjoin(1)
	join proc where proc.procedure_id = outerjoin(p.procedure_id)
		and proc.proc_prsnl_reltn_cd = outerjoin(c_surgeon_reltn_cd)
		and proc.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		and proc.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
		and proc.active_ind = outerjoin(1)
	join pr where pr.person_id = outerjoin(proc.prsnl_person_id)
		and pr.active_ind = outerjoin(1)
	join pa	where pa.person_id = outerjoin(pr.person_id)
		and pa.prsnl_alias_type_cd = outerjoin(c_npi_prsnl_alias_type_cd)
		and pa.active_ind = outerjoin(1)
	order by p.encntr_id, p.procedure_id
	head p.encntr_id
		pos = locateval(idx,1,charge_cnt,p.encntr_id,pop_billing_reply_out->qual[idx]->encntr_id)
		pr1_cnt = 0
	head p.procedure_id
		pr1_cnt = pr1_cnt + 1
		x = 0
		stat = alterlist(pop_billing_reply_out->qual[pos]->coded_procs->qual, pr1_cnt )
 
		pop_billing_reply_out->qual[pos]->coded_procs->qual[pr1_cnt]->procedure_id = p.procedure_id
		pop_billing_reply_out->qual[pos]->coded_procs->qual[pr1_cnt]->source_vocabulary_cd = n.source_vocabulary_cd
		pop_billing_reply_out->qual[pos]->coded_procs->qual[pr1_cnt]->source_vocabulary_disp =
			uar_get_code_display(n.source_vocabulary_cd)
		pop_billing_reply_out->qual[pos]->coded_procs->qual[pr1_cnt]->source_identifier = n.source_identifier
 
		if(p.nomenclature_id > 0)
			pop_billing_reply_out->qual[pos]->coded_procs->qual[pr1_cnt]->source_string = n.source_string
		else
			; Free text procedures
			pop_billing_reply_out->qual[pos]->coded_procs->qual[pr1_cnt]->source_string = p.proc_ftdesc
		endif
		pop_billing_reply_out->qual[pos]->coded_procs->qual[pr1_cnt]->principle_type_disp =
			uar_get_code_display(n.principle_type_cd)
		pop_billing_reply_out->qual[pos]->coded_procs->qual[pr1_cnt]->principle_type_cd = n.principle_type_cd
		pop_billing_reply_out->qual[pos]->coded_procs->qual[pr1_cnt]->proc_dt_tm = p.proc_dt_tm
		pop_billing_reply_out->qual[pos]->coded_procs->qual[pr1_cnt]->proc_func_type_disp =
			uar_get_code_display(p.proc_func_type_cd)
		pop_billing_reply_out->qual[pos]->coded_procs->qual[pr1_cnt]->proc_func_type_cd = p.proc_func_type_cd
 
		if (n.source_vocabulary_cd = c_cpt4_source_vocabulary_cd)
			if ((cnvtint(n.source_identifier) >= 100 and cnvtint(n.source_identifier) <= 1999)
			or (cnvtint(n.source_identifier) >= 99100 and cnvtint(n.source_identifier) <= 99140))
				pop_billing_reply_out->qual[pos]->coded_procs->qual[pr1_cnt]->proc_func_type_cd = c_anesthesia_proc_function_cd
			endif
		endif,
 
		pop_billing_reply_out->qual[pos]->coded_procs->qual[pr1_cnt]->anesthesia_minutes = p.anesthesia_minutes
		pop_billing_reply_out->qual[pos]->coded_procs->qual[pr1_cnt]->anesthesia_cd = p.anesthesia_cd
		pop_billing_reply_out->qual[pos]->coded_procs->qual[pr1_cnt]->anesthesia_type = uar_get_code_display(p.anesthesia_cd)
		pop_billing_reply_out->qual[pos]->coded_procs->qual[pr1_cnt]->proc_priority = p.proc_priority
	detail
		if(proc.prsnl_person_id > 0)
			x = x + 1
			stat = alterlist(pop_billing_reply_out->qual[pos]->coded_procs->qual[pr1_cnt]->practitioner,x)
			pop_billing_reply_out->qual[pos]->coded_procs->qual[pr1_cnt]->practitioner[x]->npi = pa.alias
			pop_billing_reply_out->qual[pos]->coded_procs->qual[pr1_cnt]->practitioner[x]->prsnl_id  = pa.person_id
			pop_billing_reply_out->qual[pos]->coded_procs->qual[pr1_cnt]->practitioner[x]->id_type =
				uar_get_code_display(pa.prsnl_alias_type_cd)
			pop_billing_reply_out->qual[pos]->coded_procs->qual[pr1_cnt]->practitioner[x]->prsnl_name  = pr.name_full_formatted
			if (pr.free_text_ind = 0)
				pop_billing_reply_out->qual[pos]->coded_procs->qual[pr1_cnt]->practitioner[x]->last_name = pr.name_last_key
				pop_billing_reply_out->qual[pos]->coded_procs->qual[pr1_cnt]->practitioner[x]->first_name = pr.name_first_key
			else
				last_name_pos = findstring(",",pr.name_full_formatted)
				last_name_pos = last_name_pos - 1
				last_name = substring(1, last_name_pos, pr.name_full_formatted)
				first_name_pos = last_name_pos + 3
				first_name = substring(first_name_pos, 100, pr.name_full_formatted)
				pop_billing_reply_out->qual[pos]->coded_procs->qual[pr1_cnt]->practitioner[x]->last_name = last_name
				pop_billing_reply_out->qual[pos]->coded_procs->qual[pr1_cnt]->practitioner[x]->first_name = first_name
			endif
		endif
	with nocounter, time = value(timeOutThreshold), expand = value(exp)
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
 
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from (dummyt d1 with seq =  size(pop_billing_reply_out->qual,5))
	     ,(dummyt d2 with seq = 1)
	     , proc_modifier pm
		 , nomenclature n
	plan d1
		where maxrec(d2,size(pop_billing_reply_out->qual[d1.seq].coded_procs.qual,5));should do a count var instead of function
	join d2
	join pm
		where pm.parent_entity_name = "PROCEDURE"
				and pm.parent_entity_id = pop_billing_reply_out->qual[d1.seq].coded_procs.qual[d2.seq].Procedure_Id
				and pm.active_ind = 1
	join n
		where n.nomenclature_id = pm.nomenclature_id
	order by d1.seq,d2.seq
	head d1.seq
		 nocnt = 0
	head d2.seq
		check = 0
		detail
			if(check = 0)
					pop_billing_reply_out->qual[d1.seq].coded_procs.qual[d2.seq].modifiers = n.source_string
					check = 1
				else
					pop_billing_reply_out->qual[d1.seq].coded_procs.qual[d2.seq].modifiers =
						build2(pop_billing_reply_out->qual[d1.seq].coded_procs.qual[d2.seq].modifiers,", ",n.source_string)
				endif
 
	with nocounter, time = value(timeOutThreshold)
 
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
 
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
 
	if(iDebugFlag > 0)
		call echo(concat("getCodedProcs Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end ;End Sub
 
/*************************************************************************
;  Name: getDiagnosis(null)
;  Description: Subroutine to get Diagnosis
**************************************************************************/
subroutine getDiagnosis(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("getDiagnosis Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
call echo(build("time_out_begin function: ",trim(cnvtstring(timeOutThreshold))))
	endif
 
	declare charge_Cnt 			= i4 with  protect, noconstant(0)
	declare dx_cnt 				= i4 with  protect, noconstant(0)
	set charge_cnt 				=  size(pop_billing_reply_out->qual,5)
 	set idx = 1
 	if(charge_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
	select into "nl:"
	d.seq
	from nomenclature n,
		diagnosis dx
	plan dx where expand(idx,1,charge_cnt,dx.encntr_id,pop_billing_reply_out->qual[idx]->encntr_id)
		and dx.active_ind = 1
	join n where n.nomenclature_id = dx.nomenclature_id
		and n.active_ind = 1
	order by dx.encntr_id
	head dx.encntr_id
		dx_cnt = 0
		pos = locateval(idx,1,charge_cnt,dx.encntr_id,pop_billing_reply_out->qual[idx]->encntr_id)
	detail
		dx_cnt = dx_cnt + 1
		stat = alterlist(pop_billing_reply_out->qual[pos]->diagnosis_list, dx_cnt )
 
		pop_billing_reply_out->qual[pos]->diagnosis_list[dx_cnt]->diagnosis_id = dx.diagnosis_id
		pop_billing_reply_out->qual[pos]->diagnosis_list[dx_cnt]->clinical_diag = n.source_string ;dx.diagnosis_display
		pop_billing_reply_out->qual[pos]->diagnosis_list[dx_cnt]->diag_priority = dx.diag_priority
		pop_billing_reply_out->qual[pos]->diagnosis_list[dx_cnt]->present_on_admit_cd = dx.present_on_admit_cd
		pop_billing_reply_out->qual[pos]->diagnosis_list[dx_cnt]->present_on_admit_disp =
			trim(uar_get_code_display(dx.present_on_admit_cd),3)
		pop_billing_reply_out->qual[pos]->diagnosis_list[dx_cnt]->ranking_cd = dx.ranking_cd
		pop_billing_reply_out->qual[pos]->diagnosis_list[dx_cnt]->ranking_disp = uar_get_code_display(dx.ranking_cd)
		pop_billing_reply_out->qual[pos]->diagnosis_list[dx_cnt]->source_vocabulary_cd = n.source_vocabulary_cd
		pop_billing_reply_out->qual[pos]->diagnosis_list[dx_cnt]->source_vocabulary_disp =
			trim(uar_get_code_display(n.source_vocabulary_cd),3)
		pop_billing_reply_out->qual[pos]->diagnosis_list[dx_cnt]->source_ident = n.source_identifier
		pop_billing_reply_out->qual[pos]->diagnosis_list[dx_cnt]->diag_type_cd = dx.diag_type_cd
		pop_billing_reply_out->qual[pos]->diagnosis_list[dx_cnt]->diag_type_disp = uar_get_code_display(dx.diag_type_cd)
		pop_billing_reply_out->qual[pos]->diagnosis_list[dx_cnt]->clinical_diag_priority =dx.clinical_diag_priority
		pop_billing_reply_out->qual[pos]->diagnosis_list[dx_cnt]->hospital_acquired_ind = dx.hac_ind
	with nocounter, time = value(timeOutThreshold), expand = value(exp)
 
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
 
 	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("getDiagnosis Runtime: ",
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
 	set charge_cnt = size(pop_billing_reply_out->qual,5)
 	set idx = 1
 	if(charge_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
 	select into "nl:"
		d.seq
	from  encntr_prsnl_reltn epr
		, prsnl pr
		, prsnl_alias pa
	plan epr where expand(idx,1,charge_cnt,epr.encntr_id,pop_billing_reply_out->qual[idx]->encntr_id)
		and epr.active_ind = 1
	join pr where pr.person_id = epr.prsnl_person_id
		and pr.active_ind = 1
	join pa where pa.person_id   = pr.person_id
		and pa.prsnl_alias_type_cd = c_npi_prsnl_alias_type_cd
		and pa.active_ind = 1
	order by epr.encntr_id
	head epr.encntr_id
		prsnl_cnt = 0
		pos = locateval(idx,1,charge_cnt,epr.encntr_id,pop_billing_reply_out->qual[idx]->encntr_id)
	detail
		prsnl_cnt = prsnl_cnt + 1
		stat = alterlist(pop_billing_reply_out->qual[pos]->provider_prsnl_list, prsnl_cnt )
		pop_billing_reply_out->qual[pos]->provider_prsnl_list[prsnl_cnt]->prsnl_id = epr.prsnl_person_id
		pop_billing_reply_out->qual[pos]->provider_prsnl_list[prsnl_cnt]->prsnl_name = pr.name_full_formatted
		pop_billing_reply_out->qual[pos]->provider_prsnl_list[prsnl_cnt]->prsnl_type_cd = pr.prsnl_type_cd
		pop_billing_reply_out->qual[pos]->provider_prsnl_list[prsnl_cnt]->prsnl_type = uar_get_code_display(pr.prsnl_type_cd)
		pop_billing_reply_out->qual[pos]->provider_prsnl_list[prsnl_cnt]->prsnl_reltn_type_disp =
			uar_get_code_display(epr.encntr_prsnl_r_cd)
		pop_billing_reply_out->qual[pos]->provider_prsnl_list[prsnl_cnt]->prsnl_reltn_type_cd = epr.encntr_prsnl_r_cd
		pop_billing_reply_out->qual[pos]->provider_prsnl_list[prsnl_cnt]->npi = pa.alias
	with nocounter, time = value(timeOutThreshold), expand = value(exp)
 
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
;  Name: getDRG(null)
;  Description: Subroutine to get DRG
**************************************************************************/
subroutine getDRG(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("getDRG Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
call echo(build("time_out_begin function: ",trim(cnvtstring(timeOutThreshold))))
	endif
 
	declare cnt 		= i4 with  protect, noconstant(0)
	declare drg_cnt 	= i4 with  protect, noconstant(0)
	set charge_cnt 		=  size(pop_billing_reply_out->qual,5)
	set idx				= 1
 
	if(charge_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from drg dg,
		drg_extension de,
		nomenclature n
	plan dg	where expand(idx,1,charge_cnt,dg.encntr_id,pop_billing_reply_out->qual[idx]->encntr_id)
		and dg.active_ind = 1
	join n where n.nomenclature_id = dg.nomenclature_id
		and n.active_ind = 1
	join de	where de.source_identifier = outerjoin(n.source_identifier)
		and de.active_ind = outerjoin(1)
		and de.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime))
	order by dg.encntr_id
	head dg.encntr_id
		drg_cnt = 0
		pos = locateval(idx,1,charge_cnt,dg.encntr_id,pop_billing_reply_out->qual[idx]->encntr_id)
	detail
		drg_cnt = drg_cnt + 1
		stat = alterlist(pop_billing_reply_out->qual[pos]->drg_list, drg_cnt )
 
		pop_billing_reply_out->qual[pos]->drg_list[drg_cnt]->comorbidity_cd  = dg.comorbidity_cd
		pop_billing_reply_out->qual[pos]->drg_list[drg_cnt]->comorbidity_disp  = uar_get_code_display(dg.comorbidity_cd)
		pop_billing_reply_out->qual[pos]->drg_list[drg_cnt]->drg_cd = n.source_identifier
		pop_billing_reply_out->qual[pos]->drg_list[drg_cnt]->drg_name  = n.source_string
		pop_billing_reply_out->qual[pos]->drg_list[drg_cnt]->drg_id  = dg.drg_id
		pop_billing_reply_out->qual[pos]->drg_list[drg_cnt]->drg_payment  = dg.drg_payment
		pop_billing_reply_out->qual[pos]->drg_list[drg_cnt]->drg_payor_cd  = dg.drg_payor_cd
		pop_billing_reply_out->qual[pos]->drg_list[drg_cnt]->drg_payor_disp = uar_get_code_display(dg.drg_payor_cd)
		pop_billing_reply_out->qual[pos]->drg_list[drg_cnt]->drg_priority = dg.drg_priority
		pop_billing_reply_out->qual[pos]->drg_list[drg_cnt]->outlier_cost = dg.outlier_cost
		pop_billing_reply_out->qual[pos]->drg_list[drg_cnt]->outlier_days = dg.outlier_days
		pop_billing_reply_out->qual[pos]->drg_list[drg_cnt]->outlier_reimbursement_cost = dg.outlier_reimbursement_cost
		pop_billing_reply_out->qual[pos]->drg_list[drg_cnt]->risk_of_mortality_cd = dg.risk_of_mortality_cd
		pop_billing_reply_out->qual[pos]->drg_list[drg_cnt]->risk_of_mortality_disp =
			uar_get_code_display(dg.risk_of_mortality_cd)
		pop_billing_reply_out->qual[pos]->drg_list[drg_cnt]->severity_of_illness_cd = de.severity_of_illness_cd
		pop_billing_reply_out->qual[pos]->drg_list[drg_cnt]->severity_of_illness_disp =
			uar_get_code_display(de.severity_of_illness_cd)
		pop_billing_reply_out->qual[pos]->drg_list[drg_cnt]->source_vocabulary_cd = dg.source_vocabulary_cd
		pop_billing_reply_out->qual[pos]->drg_list[drg_cnt]->source_vocabulary_disp =
			trim(uar_get_code_display(dg.source_vocabulary_cd),3)
		pop_billing_reply_out->qual[pos]->drg_list[drg_cnt]->amlos = de.amlos
		pop_billing_reply_out->qual[pos]->drg_list[drg_cnt]->drg_category = de.drg_category
		pop_billing_reply_out->qual[pos]->drg_list[drg_cnt]->drg_weight = de.drg_weight
		pop_billing_reply_out->qual[pos]->drg_list[drg_cnt]->gmlos = de.gmlos
		pop_billing_reply_out->qual[pos]->drg_list[drg_cnt]->mdc_cd = de.mdc_cd
		pop_billing_reply_out->qual[pos]->drg_list[drg_cnt]->mdc_disp = uar_get_code_display(de.mdc_cd)
	with nocounter, time = value(timeOutThreshold), expand = value(exp)
 
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
 
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("getDRG Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
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
					call ErrorHandler2("EXECUTE", "F", "POP_BILLING", build("Invalid Facility Code: ", loc_req->codes[num]->code_value),
					"2040", build("Invalid Facility Code: ",loc_req->codes[num]->code_value),pop_billing_reply_out) ;012
					set stat = alterlist(pop_billing_reply_out,0)
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
	set charge_cnt = size(pop_billing_reply_out->qual,5)
	set idx = 1
 
	if(charge_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
   ;getting person info
 
   select into "nl:"
   from person p
   plan p
   		where expand(idx,1,charge_cnt,p.person_id,pop_billing_reply_out->qual[idx].person.person_id)
   			and p.active_ind = 1
   			and p.person_id != 0
   detail
   		pos = locateval(idx,1,charge_cnt,p.person_id,pop_billing_reply_out->qual[idx].person.person_id)
   		if(pos > 0)
	   		pop_billing_reply_out->qual[pos]->name_first = p.name_first
			pop_billing_reply_out->qual[pos]->name_last = p.name_last
			pop_billing_reply_out->qual[pos]->name_middle = p.name_middle
			pop_billing_reply_out->qual[pos]->sex_cd = p.sex_cd
			pop_billing_reply_out->qual[pos]->birth_dt_tm = p.birth_dt_tm
			pop_billing_reply_out->qual[pos]->sex_disp = uar_get_code_display(p.sex_cd)
			pop_billing_reply_out->qual[pos]->person->person_id = p.person_id
			pop_billing_reply_out->qual[pos]->person->name_last = p.name_last
			pop_billing_reply_out->qual[pos]->person->name_full_formatted = p.name_full_formatted
			pop_billing_reply_out->qual[pos]->person->name_first = p.name_first
			pop_billing_reply_out->qual[pos]->person->name_middle = p.name_middle
			pop_billing_reply_out->qual[pos]->person->dob = p.birth_dt_tm
			pop_billing_reply_out->qual[pos]->person->gender_disp = uar_get_code_display(p.sex_cd)
			pop_billing_reply_out->qual[pos]->person->gender_id = p.sex_cd
			pop_billing_reply_out->qual[pos]->person->sDOB =
	 		datetimezoneformat(p.birth_dt_tm,p.birth_tz,"YYYY-MM-DD",curtimezonedef) ;016
	 	endif
 	with nocounter, time = value(timeOutThreshold), expand = value(exp)
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
 
 	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
 	;getting OMF encounter info
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
 	select into "nl:"
 	from omf_encntr_st oes
    plan oes
    	where expand(idx,1,charge_cnt,oes.encntr_id,pop_billing_reply_out->qual[idx].encntr_id)
    detail
    	pos = locateval(idx,1,charge_cnt,oes.encntr_id,pop_billing_reply_out->qual[idx].encntr_id)
    	if(pos > 0)
			pop_billing_reply_out->qual[pos]->total_charge = oes.total_accum_charges
			pop_billing_reply_out->qual[pos]->total_cost = oes.total_act_cost
		endif
	with nocounter, time = value(timeOutThreshold), expand = value(exp)
 
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
 
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	; Get encntr & person aliases
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from encntr_alias ea
	plan ea where expand(idx,1,charge_cnt,ea.encntr_id,pop_billing_reply_out->qual[idx].encntr_id)
		and ea.encntr_alias_type_cd in (c_fin_encntr_alias_type_cd, c_mrn_encntr_alias_type_cd) ;1077
		and ea.active_ind = 1
		and ea.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime)
		and ea.end_effective_dt_tm >= cnvtdatetime(curdate,curtime)
	 detail
	 	pos = locateval(idx,1,charge_cnt,ea.encntr_id,pop_billing_reply_out->qual[idx].encntr_id)
	 	if(pos > 0)
			if(ea.encntr_alias_type_cd = c_mrn_encntr_alias_type_cd)  ;011
				pop_billing_reply_out->qual[pos]->MRN = ea.alias
				pop_billing_reply_out->qual[pos]->person->mrn = ea.alias
			else
				if(pop_billing_reply_out->qual[pos].fin_nbr = "")
					pop_billing_reply_out->qual[pos].fin_nbr  = ea.alias
					pop_billing_reply_out->qual[pos].encounter.fin_nbr = ea.alias
				endif
			endif
		endif
	with nocounter, time = value(timeOutThreshold), expand = value(exp)
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
 
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	; Get birthweight - check person_patient table first
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
		pp.birth_weight
		,pp.birth_weight_units_cd
	from person_patient pp
	plan pp where expand(idx,1,charge_cnt,pp.person_id,pop_billing_reply_out->qual[idx].person_id)
	detail
		pos = locateval(idx,1,charge_cnt,pp.person_id,pop_billing_reply_out->qual[idx].person_id)
		if(pos > 0)
			if(pp.birth_weight > 0)
				pop_billing_reply_out->qual[pos]->birth_weight = cnvtstring(pp.birth_weight)
				pop_billing_reply_out->qual[pos]->birth_units  = uar_get_code_display(pp.birth_weight_units_cd)
				pop_billing_reply_out->qual[pos]->birth_unit_cd = pp.birth_weight_units_cd
			endif
		endif
	with nocounter, time = value(timeOutThreshold), expand = value(exp)
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
 
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	; If birthweight not found on person_patient, check clinical_event
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
		ce.result_val
		,ce.result_units_cd
	from clinical_event ce
	plan ce	where expand(idx,1,charge_cnt,ce.encntr_id,pop_billing_reply_out->qual[idx].encntr_id,
										  ce.person_id,pop_billing_reply_out->qual[idx].person_id)
				and ce.view_level = 1
				and ce.valid_until_dt_tm > cnvtdatetime(curdate, curtime)
				and ce.event_cd  = c_birthweight_event_cd
	detail
		pos = locateval(idx,1,charge_cnt,ce.encntr_id,pop_billing_reply_out->qual[idx].encntr_id)
		if(pos > 0)
			if(pop_billing_reply_out->qual[pos].birth_weight = NULL)
				pop_billing_reply_out->qual[pos]->birth_weight = ce.result_val
				pop_billing_reply_out->qual[pos]->birth_units  = uar_get_code_display(ce.result_units_cd)	;010
				pop_billing_reply_out->qual[pos]->birth_unit_cd = ce.result_units_cd  ;010
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
 
 
