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
      Source file name: snsro_get_pop_patient.prg
      Object name:      vigilanz_get_pop_patient
      Program purpose:  Get updated patients
      Executing from:   Emissary
 ***********************************************************************
                  MODIFICATION CONTROL LOG
 ***********************************************************************
 Mod Date     Engineer  Comment
 -----------------------------------------------------------------------
 001 12/4/19 	KRD		Initial Write
 002 02/27/20	KRD		Made the following changes
						1. Added "Middle_Name"
						3. Changed ALTERNATENAMES to ALTERNATIVENAMES
						4. The PhoneIds and EndEffectiveDateTime were not filled
						6. Added the StudentStatus
						7. The Interpreter Required was pointing to interpreter_cd
						   changed to point to interp_required_cd
						8. Removed comments from custom_fields
 003 03/11/2020 KRD     Added inc_comments boolean to prompt
 						Added Comments object to the structure
                        Added WrittenFormat object to extended info
************************************************************************/
drop program vigilanz_get_pop_patient go
create program vigilanz_get_pop_patient
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Username:" = ""
	, "Beg Date:" = ""
	, "End Date:" = ""
	, "Facility_Code_List" = ""
	, "Include Extended" = ""
	, "Include Identity" = ""
	, "Include Related Persons:" = ""
	, "Include Custom Fields" = ""
	, "Include Comments:" = ""
	, "Debug Flag" = 0
	, "Time Max" = 3600
 
with OUTDEV, USERNAME, BEG_DATE, END_DATE, LOC_LIST, INC_EXTENDED, INC_IDENTITY,
	INC_PERSON_RELTN, INC_CUSTOM_FIELDS, INC_COMMENTS, DEBUG_FLAG, TIME_MAX
 
 
 
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
 
free record pop_patient_reply_out
record pop_patient_reply_out (
1 patient_cnt = i4
1 patients[*]
    2 created_updated_date_time	= dq8
	2 Updated_UserId = f8
	2 Updated_UserName = vc
	2 End_Effective_Dt_Tm = dq8
    2 patient
		3 patient_id = f8
		3 display_name = vc
		3 last_name = vc
		3 middle_name = vc
		3 first_name = vc
		3 mrn = vc
		3 birth_date_time = dq8
		3 gender
			4 id = f8
			4 name = vc
		3 sdob = vc
		3 Deceased_Dt_Tm = dq8
	2  mrn_identities[*]
		3 value = vc
		3 type
			4 id = f8
			4 name = vc
			4 description = vc
		3 subtype
			4 id = f8
			4 name = vc
			4 description = vc
	2  patient_alias[*]                            ;this would be things like ssn but not any mrns; this may also get changed too
		3  person_alias_id             = f8
		3  alias_pool_cd               = f8
		3  person_alias_type_cd        = f8
		3  person_alias_type_disp      = vc
		3  person_alias_type_mean      = vc
		3  alias                       = vc
	2 PatientRelationships[*]
		3  	person_id 				= f8
        3  	person_name			= vc
        3   from_date = dq8
        3   to_date = dq8
        3  	reltn_type = vc
        3   phones[*]
        	4 phone_id = f8
		  	4 phone_num = vc
		  	4 Extension = vc
		 	4 Phone_type_cd = f8
		  	4 phone_type_disp = vc
		  	4 phone_type_mean = vc
		  	4 sequence_nbr = i4
		  	4 end_effective_dt_tm = dq8
 	2 providerRelationship[*]
        3 provider_id = f8
        3 provider_name = vc
        3 provider_reltn = vc
   2 ExtendedInfo
   		3 Deceased
   			4 id = f8
   			4 name = vc
		3 BirthGender
			4 id = f8
			4 name = vc
		3 previous_last_name = vc
		3 Email = vc
		3 Ethnicity
			4 id = f8
			4 name = vc
		3 Language
			4 id = f8
			4 name = vc
		3 Marital_Status
			4 id = f8
			4 name = vc
		3 NeedsInterpreter
			4 id = f8
			4 name = vc
		3 StudentStatus
			4 id = f8
			4 name = vc
		3 Race[*]
			4 id = f8
			4 name = vc
		3 WrittenFormat
		    4 id = f8
		    4 name = vc
		3 Religion
			4 id = f8
			4 name = vc
		3 EducationLevel
			4 id = f8
			4 name = vc
		3 Vip
			4 id = f8
			4 name = vc
		3 Addresses[*]
		  4 address_id = f8
		  4 street_addr = vc
		  4 street_addr2 = vc
		  4 City = vc
		  4 State_disp = vc
		  4 Address_Type_cd = f8
		  4 Address_Type_disp = vc
		  4 Zipcode = vc
		  4 Country_disp = vc
		  4 Country_cd = vc
		  4 county_cd = f8
		  4 county_disp = vc ;
		  4 sequence_nbr  =   i4
		  4 end_effective_dt_tm = dq8
		3 Phones[*]
		  4 phone_id = f8
		  4 phone_num = vc
		  4 Extension = vc
		  4 Phone_type_cd = f8
		  4 phone_type_disp = vc
		  4 phone_type_mean = vc
		  4 sequence_nbr = i4
		  4 end_effective_dt_tm = dq8
		 3 Alternativenames[*]
		  4 NameType
			5 id = f8
			5 name = vc
		  4 LastName = vc
		  4 FirstName = vc
		  4 MiddleName = vc
		  4 Prefix = vc
		  4 Suffix = vc
    2 Comments [*]
		 3 CMT_TEXT = vc
         3 UPDT_ID  = f8
         3 UPDT_DT_TM = dq8
         3 Internal_Seq = i4
	2 CustomFields[*]
		 3 Field
			4 id = f8
			4 name = vc
		 3 ResponseValueText [*] = vc
		 3 ResponseValueCodes[*]
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
 
free record alias_pools
record alias_pools(
		1 qual_cnt = i4
		1 qual[*]
		  2 alias_pool_cd = f8
		  2 alias = vc
		)
 
;initialize status to FAIL
set pop_patient_reply_out->status_data.status = "F"
 
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
 
;Constants
declare c_mrn_encntr_alias_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",319,"MRN"))
declare c_fin_encntr_alias_type_cd 		= f8 with protect,constant(uar_get_code_by("MEANING",319,"FIN NBR"))
declare iIncIdentity	 	= i2 with protect, noconstant(0)
declare iIncPersonReltns	= i2 with protect, noconstant(0)
declare iIncCustomFields	= i2 with protect, noconstant(0)
declare iIncExtended	 	= i2 with protect, noconstant(0)
declare Section_Start_Dt_Tm = DQ8 WITH PROTECT, NOCONSTANT(CNVTDATETIME(CURDATE, CURTIME3))
declare iIncComments	 	= i2 with protect, noconstant(0)
 
declare dEmergency			= f8 with protect, constant(uar_get_code_by("MEANING", 351, "EMC"))
declare dEmail				= f8 with protect, constant(uar_get_code_by("MEANING", 212, "EMAIL")) /*015*/
declare dPersonReltnType = f8 with protect, constant(uar_get_code_by("MEANING",351, "INSURED")) ;024
declare dActiveStatusCd	= f8 with protect, constant(uar_get_code_by("MEANING",  48, "ACTIVE")) ;024
declare c_encntr_mrn_alias_cd       = f8 with protect, constant(uar_get_code_by("MEANING",319,"MRN"))
declare c_mrn_type_cd  = f8 with protect, constant(uar_get_code_by("MEANING",4,"MRN"))
declare c_cmrn_type_cd  = f8 with protect, constant(uar_get_code_by("MEANING",4,"CMRN"))
declare c_refmrn_type_cd  = f8 with protect, constant(uar_get_code_by("MEANING",4,"REF_MRN"))
declare c_userdefined_info_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",355,"USERDEFINED"))
declare c_comments_info_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",355,"COMMENT"))
 
declare num = i4 with protect, noconstant(0)
declare pop = i4 with protect, noconstant(0)
/**************************************************************************
;INITIALIZE
**************************************************************************/
set modify maxvarlen 200000000
 
;Input
set sUserName					= trim($USERNAME,3)
set sFromDate					= trim($BEG_DATE,3)
set sToDate						= trim($END_DATE,3)
set sLocFacilities				= trim($LOC_LIST,3)
 
set iIncExtended 				= cnvtint($INC_EXTENDED)
set iIncCustomFields			= cnvtint($INC_CUSTOM_FIELDS)
set iIncIdentity 				= cnvtint($INC_IDENTITY)
set iIncPersonReltns 			= cnvtint($INC_PERSON_RELTN)
set iIncComments				= cnvtint($INC_COMMENTS)
 
set iDebugFlag					= cnvtint($DEBUG_FLAG)
set iTimeMax					= cnvtint($TIME_MAX)
declare iMaxRecs				= i4 with protect, constant(2000)
 
;Other
set UTCmode						= CURUTC ;003
set UTCpos						= findstring("Z",sFromDate,1,0);003
 
set qFromDateTime = GetDateTime(sFromDate)
set qToDateTime = GetDateTime(sToDate)
 
 
/**************************************************************************
;DECLARE SUBROUTINES
***************************************************************************/
declare ParseLocations(sLocFacilities = vc)	= null with protect ;list parse out code values
declare getAliasPoolsList(null)	= null with protect ;Create the alias list for given location list
declare getPatientsList(null)	= null with protect ;Creates qualified patients list
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Validate Username
set iRet = PopulateAudit(sUserName, 0.0, pop_patient_reply_out, sVersion)
 if(iRet = 0)
	call ErrorHandler2("ORDERS", "F","User is invalid", "Invalid User for Audit.","1001",build("User is invalid. ",
	"Invalid User for Audit."),pop_patient_reply_out) ;008
	go to EXIT_SCRIPT
endif
 
; Validate from date is not greather than to date - 012
if (qFromDateTime > qToDateTime)
	call ErrorHandler2("SELECT", "F", "VALIDATE", "From Date Greater than To Date. Refine Dates Entered.",
	"2010", "From Date Greater than To Date. Refine Dates Entered.", pop_patient_reply_out)
	go to EXIT_SCRIPT
endif
 
 
 ; Validate timespan doesn't exceed threshold
set iRet = ThreshHoldValidator(iTimeMax,"s",qFromDateTime,qToDateTime)
 
if(iRet = 0)
	call ErrorHandler2("SELECT", "F", "VALIDATE", "Date Range Too Long. Refine Query.",
	"2011","Date Range Too Long. Refine Query.",pop_patient_reply_out) ;008
	 go to EXIT_SCRIPT
endif
 
; Parse locations if provided
if(sLocFacilities > " ")
	call ParseLocations(sLocFacilities)
endif
 
;Get alias pool list for given facility:
call getAliasPoolsList(null)
 
;Get Patients List:
call getPatientsList(null)
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(pop_patient_reply_out)
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_pop_patient.json")
	call echo(build2("_file : ", _file))
	call echojson(pop_patient_reply_out, _file, 0)
    call echorecord(pop_patient_reply_out)
	call echo(JSONout)
endif
 
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
#EXIT_VERSION
 
 
/*************************************************************************
;  Name: ParseLocations(sLocFacilties = vc)
;  Description: Subroutine to parse a comma delimited string
**************************************************************************/
subroutine ParseLocations(sLocFacilities)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ParseLocations Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	declare notfnd 		= vc with constant("<not_found>")
	set num 		= 0
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
				where code_set = 220 ;and cdf_meaning = "FACILITY"
					and loc_req->codes[num]->code_value = code_value
				detail
					check = 1
				with nocounter
 
				if (check = 0)
					call ErrorHandler2("EXECUTE", "F", "POP_PATIENTS", build("Invalid Facility Code: ", loc_req->codes[num]->code_value),
					"2040", build("Invalid Facility Code: ",loc_req->codes[num]->code_value),pop_patient_reply_out) ;012
					set stat = alterlist(pop_patient_reply_out,0)
					go to exit_script
				endif
			endif
			set num = num + 1
		endwhile
	endif
 
   if(iDebugFlag > 0)
		call echo(concat("ParseLocations Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
;=====================================================================================
;Get Alias Pools for given locagtions and stor it in the structure.
;=====================================================================================
subroutine getAliasPoolsList(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("getAliasPoolsList Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set num = 0
	set loc_size = size(loc_req->codes,5)
 
	;Set expand control value - 023
	if(loc_size > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	if(loc_size > 0)
	 	set queryStartTm = cnvtdatetime(curdate, curtime3)
		select into "nl:"
		from location l
		,org_alias_pool_reltn oa
		plan l
			where expand(num,1,loc_size,l.location_cd ,loc_req->codes[num].code_value)
		join oa
			where oa.organization_id = l.organization_id
 
		head report
			x = 0
			detail
				x = x + 1
				stat = alterlist(alias_pools->qual,x)
				alias_pools->qual[x].alias_pool_cd = oa.alias_pool_cd
				alias_pools->qual[x].alias = uar_get_code_display(oa.alias_pool_cd)
			foot report
				alias_pools->qual_cnt = x
 
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
  endif
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag)
 		call echo(build("------Qual Cnt = ",alias_pools->qual_cnt))
 	endif
   if(iDebugFlag > 0)
		call echo(concat("getAliasPoolsList Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;end sub
 
 
;===================================================================
;create patients list
;===================================================================
 
subroutine getPatientsList(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("getPatientsList Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	;Set expand control value
	if(alias_pools->qual_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	declare alias_pools_string = vc
	set num = 0
 
	;resetting alias_pools_string to use in location assignment query
	if(alias_pools->qual_cnt > 0)
		set alias_pools_string = " expand(num,1,alias_pools->qual_cnt,pa.alias_pool_cd,alias_pools->qual[num].alias_pool_cd)"
	else
		set alias_pools_string = "pa.alias_pool_cd > -1.0"
	endif
 
    select into "nl:"
    p.person_id
    from person p
	,person_alias pa
	plan p
	where p.updt_dt_tm between cnvtdatetime(qFromDateTime) and cnvtdatetime(qToDateTime)
	join pa
	where pa.person_id = p.person_id
	and pa.person_alias_type_cd in(c_mrn_type_cd,c_cmrn_type_cd,c_refmrn_type_cd)
	;and pa.person_alias_type_cd not in(c_mrn_type_cd,c_cmrn_type_cd,c_refmrn_type_cd) ;use this for person
    and parser(alias_pools_string)
 
	order by p.updt_dt_tm , p.person_id
 
 	head report
	 x = 0
	 max_reached = 0
	 stat = alterlist(pop_patient_reply_out->patients,iMaxRecs)
	 head p.updt_dt_tm
	   if(x > iMaxRecs)
		 max_reached = 1
	   endif
 	   head p.person_id
		if(max_reached = 0)
			x = x + 1
			if(mod(x,100) = 1 and x > iMaxRecs)
				stat = alterlist(pop_patient_reply_out->patients,x + 99)
			endif
		endif
	    detail
		if(max_reached = 0)
 			stat = alterlist(pop_patient_reply_out->patients,x)
	 		pop_patient_reply_out->patients[x].created_updated_date_time = p.updt_dt_tm
  			pop_patient_reply_out->patients[x].ExtendedInfo.Deceased.name = uar_get_code_display(p.deceased_cd )
  			pop_patient_reply_out->patients[x].ExtendedInfo.Deceased.id = p.deceased_cd
			pop_patient_reply_out->patients[x].patient.Deceased_Dt_Tm = p.deceased_dt_tm
			pop_patient_reply_out->patients[x].Updated_UserId =  p.updt_id
 
			pop_patient_reply_out->patients[x].End_Effective_Dt_Tm = p.end_effective_dt_tm
			pop_patient_reply_out->patients[x].ExtendedInfo.vip.id = p.vip_cd
 			pop_patient_reply_out->patients[x].ExtendedInfo.vip.name = uar_get_code_display(p.vip_cd)
			pop_patient_reply_out->patients[x].patient.patient_id = p.person_id
			pop_patient_reply_out->patients[x].patient.display_name= p.name_full_formatted
			pop_patient_reply_out->patients[x].patient.first_name = p.name_first
			pop_patient_reply_out->patients[x].patient.middle_name = p.name_middle
			pop_patient_reply_out->patients[x].patient.last_name = p.name_last
			pop_patient_reply_out->patients[x].patient.birth_date_time = p.birth_dt_tm
			pop_patient_reply_out->patients[x].patient.gender->id  = p.sex_cd
			pop_patient_reply_out->patients[x].patient.gender->name  = uar_get_code_display(p.sex_cd)
			pop_patient_reply_out->patients[x].patient.sdob = datetimezoneformat(p.birth_dt_tm,p.birth_tz,"YYYY-MM-DD",curtimezonedef)
			pop_patient_reply_out->patients[x].ExtendedInfo.Language.id = p.language_cd
			pop_patient_reply_out->patients[x].ExtendedInfo.Language.name = UAR_GET_CODE_DISPLAY(p.language_cd)
			pop_patient_reply_out->patients[x].ExtendedInfo .Marital_Status.id = p.marital_type_cd
			pop_patient_reply_out->patients[x].ExtendedInfo.Marital_Status.name =  UAR_GET_CODE_DISPLAY(p.marital_type_cd)
			pop_patient_reply_out->patients[x].ExtendedInfo.Ethnicity .id = p.ethnic_grp_cd
			pop_patient_reply_out->patients[x].ExtendedInfo.Ethnicity.name = UAR_GET_CODE_DISPLAY(p.ethnic_grp_cd )
			pop_patient_reply_out->patients[x].ExtendedInfo.Religion.id  = p.religion_cd
			pop_patient_reply_out->patients[x].ExtendedInfo.Religion.name  = UAR_GET_CODE_DISPLAY(p.religion_cd)
		endif
 	foot report
 		pop_patient_reply_out->patient_cnt = x
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag)
 		call echo(build("------Qual Cnt = ",pop_patient_reply_out->patient_cnt))
 	endif
 
; Populate audit
	if(pop_patient_reply_out->patient_cnt > 0)
		call ErrorHandler("EXECUTE", "S", "Success", "Get Pop Patient completed successfully.", pop_patient_reply_out)
	else
		call ErrorHandler("EXECUTE", "Z", "No Data.", "No records qualify.", pop_patient_reply_out)
		go to EXIT_SCRIPT
	endif
 
 
;getting MRN's
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Getting MRN Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	if(pop_patient_reply_out->patient_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
	set queryStartTm = cnvtdatetime(curdate, curtime3)
    set num = 0
    select into "nl:"
    from person_alias pa
    plan pa
    where expand(num,1,pop_patient_reply_out->patient_cnt,pa.person_id,pop_patient_reply_out->patients[num].patient.patient_id )
		and pa.person_alias_type_cd in(c_mrn_type_cd,c_cmrn_type_cd,c_refmrn_type_cd)
		and pa.active_ind = 1
		and pa.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and pa.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
    order by pa.person_id , pa.person_alias_type_cd, pa.alias_pool_cd
      head report
	   x = 0
	   head pa.person_id
	    x = 0
	    detail
     		pos = 0
     		pos = locateval(num,1,pop_patient_reply_out->patient_cnt
     						,pa.person_id,pop_patient_reply_out->patients[num].patient.patient_id )
			x = x + 1
			stat = alterlist(pop_patient_reply_out->patients[pos]->mrn_identities,x)
			pop_patient_reply_out->patients[pos].mrn_identities[x].value = trim(pa.alias)
			pop_patient_reply_out->patients[pos].mrn_identities[x].type.description = trim(uar_get_code_description(pa.person_alias_type_cd))
			pop_patient_reply_out->patients[pos].mrn_identities[x].type.id = pa.person_alias_type_cd
			pop_patient_reply_out->patients[pos].mrn_identities[x].type.name = trim(uar_get_code_display(pa.person_alias_type_cd))
			pop_patient_reply_out->patients[pos].mrn_identities[x].subtype.description = trim(uar_get_code_description(pa.alias_pool_cd))
			pop_patient_reply_out->patients[pos].mrn_identities[x].subtype.id = pa.alias_pool_cd
			pop_patient_reply_out->patients[pos].mrn_identities[x].subtype.name = trim(uar_get_code_display(pa.alias_pool_cd))
 
			;set a random default mrn
			if(pa.person_alias_type_cd = c_mrn_type_cd)
				pop_patient_reply_out->patients[pos].mrn = trim(pa.alias,3)
			endif
 
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
;GETTING UPDATED PRSNL
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Getting updated prsnl Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set count = 0
	set num = 0
	set pop = 0
	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
	select into "nl:"
	p.person_id
	from prsnl p
		,(dummyt d with seq = pop_patient_reply_out->patient_cnt)
	plan d
		where pop_patient_reply_out->patients[d.seq].Updated_UserId > 0
    join p
    	where p.person_id = pop_patient_reply_out->patients[d.seq].Updated_UserId
   			and p.active_ind = 1
   			and p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
   			and p.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
    order by d.seq
 
  	head d.seq
      pop_patient_reply_out->patients[d.seq].Updated_UserName = trim(p.username)
  	with nocounter, time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
 
;GETTING PERSON ALIASES
if (iIncIdentity > 0)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Getting person aliases Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set count = 0
	set num = 0
	set pop = 0
	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
	select into "nl:"
	p.person_id
	from person_alias p
    where expand(num,1,pop_patient_reply_out->patient_cnt,p.person_id,pop_patient_reply_out->patients[num].patient.patient_id )
   	and p.active_ind = 1
   	and p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
   	and p.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
    order by p.person_id
 
  	head report
  	  count = 0
  	  pos = 0
      head p.person_id
        count = 0
  	    detail
  		pos = locateval(num,1,pop_patient_reply_out->patient_cnt,p.person_id,pop_patient_reply_out->patients[num].patient.patient_id )
  			count = count + 1
  			stat = alterlist(pop_patient_reply_out->patients[num]->patient_alias,count)
  			pop_patient_reply_out->patients[pos].patient_alias[count]->person_alias_id = p.person_alias_id
  			pop_patient_reply_out->patients[pos].patient_alias[count]->alias_pool_cd = p.alias_pool_cd
  			pop_patient_reply_out->patients[pos].patient_alias[count]->person_alias_type_cd = p.person_alias_type_cd
  			pop_patient_reply_out->patients[pos].patient_alias[count]->person_alias_type_disp
  															= UAR_GET_CODE_DISPLAY(p.person_alias_type_cd)
  			pop_patient_reply_out->patients[pos].patient_alias[count]->alias = trim(p.alias,3)
 			;pos = locateval(num,1,pop_patient_reply_out->patient_cnt,p.person_id, pop_patient_reply_out->patients[num].patient.patient_id)
  	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
endif
;get race info
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Getting Race Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set count = 0
	set num = 0
	set pop = 0
	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
  	select into "nl:"
  	p.person_id
 
  	from PERSON_CODE_VALUE_R p
  	plan p
  	where expand(num,1,pop_patient_reply_out->patient_cnt,p.person_id,pop_patient_reply_out->patients[num].patient.patient_id )
	   and p.active_ind = 1
	   and p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
	   and p.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
       and p.code_set =282.00 ;Race stored in this code_se
    order by p.person_id
  	head report
  	  count = 0
  	  pos = 0
  	  head p.person_id
  	    pos = 0
  	    count = 0
  		detail
  			pos = locateval(num,1,pop_patient_reply_out->patient_cnt,p.person_id ,pop_patient_reply_out->patients[num].patient.patient_id )
  			count = count + 1
  			stat = alterlist(pop_patient_reply_out->patients[pos]->ExtendedInfo.race,count)
  			pop_patient_reply_out->patients[pos].ExtendedInfo.race[count].id = p.code_value
			pop_patient_reply_out->patients[pos].ExtendedInfo.Race [count].name = UAR_GET_CODE_DISPLAY(p.code_value )
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
;Get Person Relations
if(iIncPersonReltns > 0)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Getting Person Relations Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set count = 0
	set num = 0
	set pop = 0
	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
  	select into "nl:"
    	ppr.person_id, ppr.person_person_reltn_id
  	from person_person_reltn  ppr
  		, person p
  		, phone ph
  	plan ppr
  		where expand(num,1,pop_patient_reply_out->patient_cnt,ppr.person_id,pop_patient_reply_out->patients[num].patient.patient_id )
  		and ppr.active_ind = 1
  	  	and ppr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
	   	and ppr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
  	join p
  	where p.person_id = ppr.related_person_id
  	join ph
  		where ph.parent_entity_id = outerjoin(p.person_id)
  			and ph.parent_entity_name = outerjoin("PERSON")
  			and ph.active_ind = outerjoin(1)
  			and ph.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
  			and ph.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
 
	order by ppr.person_id , ppr.person_person_reltn_id,p.person_id,ph.phone_id
 
  	head report
  	  count = 0
  	  pos = 0
      head ppr.person_id
     	count = 0
     	head ppr.person_person_reltn_id
     		pos = locateval(num,1,pop_patient_reply_out->patient_cnt
     							,ppr.person_id,pop_patient_reply_out->patients[num].patient.patient_id )
  			count = count + 1
  			stat = alterlist(pop_patient_reply_out->patients[num]->PatientRelationships,count)
  			pop_patient_reply_out->patients[pos].PatientRelationships[count].person_id = ppr.person_person_reltn_id
			pop_patient_reply_out->patients[pos].PatientRelationships[count].person_name = trim(p.name_full_formatted)
			pop_patient_reply_out->patients[pos].PatientRelationships[count].reltn_type
																		= uar_get_code_display(ppr.person_reltn_type_cd)
			pop_patient_reply_out->patients[pos].PatientRelationships[count].from_date = ppr.beg_effective_dt_tm
			pop_patient_reply_out->patients[pos].PatientRelationships[count].to_date = ppr.end_effective_dt_tm
 
			head p.person_id
				x = 0
 
				head ph.phone_id
					if(ph.phone_id > 0)
 
						x = x + 1
						stat = alterlist(pop_patient_reply_out->patients[pos].PatientRelationships[count].phones,x)
						pop_patient_reply_out->patients[pos].PatientRelationships[count].phones[x].phone_id
																										= ph.phone_id
						pop_patient_reply_out->patients[pos].PatientRelationships[count].phones[x].Extension = ph.extension
						pop_patient_reply_out->patients[pos].PatientRelationships[count].phones[x].phone_num = trim(ph.phone_num)
						pop_patient_reply_out->patients[pos].PatientRelationships[count].phones[x].Phone_type_cd = ph.phone_type_cd
						pop_patient_reply_out->patients[pos].PatientRelationships[count].phones[x].phone_type_disp
																			= uar_get_code_display(ph.phone_type_cd)
						pop_patient_reply_out->patients[pos].PatientRelationships[count].phones[x].sequence_nbr = ph.phone_type_seq
						pop_patient_reply_out->patients[pos].PatientRelationships[count].phones[x].end_effective_dt_tm = ph.
						end_effective_dt_tm
 
					endif
  	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
endif
 
 
;Get provider information
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Getting Provider information Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set count = 0
	set num = 0
	set pop = 0
	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
  	select into 'nl:'
  		ppr.person_id
  		,ppr.person_prsnl_reltn_id
  		,ppr.priority_seq
  	from person_prsnl_reltn ppr
  		,prsnl p
  	plan ppr
   		where expand(num,1,pop_patient_reply_out->patient_cnt,ppr.person_id,pop_patient_reply_out->patients[num].patient.patient_id )
		and ppr.active_ind = 1
 		and ppr.end_effective_dt_tm > sysdate
 	join p
  		where p.person_id = ppr.prsnl_person_id
  	order by ppr.person_id , ppr.person_prsnl_reltn_id , ppr.priority_seq desc
 
  	head report
  	  ount = 0
  	  pos = 0
      head p.person_id
     	count = 0
    	head ppr.person_prsnl_reltn_id
     		pos = locateval(num,1,pop_patient_reply_out->patient_cnt
     					,ppr.person_id,pop_patient_reply_out->patients[num].patient.patient_id )
  			count = count + 1
  			stat = alterlist(pop_patient_reply_out->patients[num]->providerRelationship,count)
  			pop_patient_reply_out->patients[pos].providerRelationship[count].provider_id  = ppr.prsnl_person_id
			pop_patient_reply_out->patients[pos].providerRelationship[count].provider_reltn
																= UAR_GET_CODE_DISPLAY(ppr.person_prsnl_r_cd )
			pop_patient_reply_out->patients[pos].providerRelationship[count].provider_name  = p.name_full_formatted
  	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
;RETRIEVE ADDRESS INFO
if(iIncExtended > 0)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Getting Address Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set count = 0
	set num = 0
	set pop = 0
	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
	select into "nl:"
	a.parent_entity_id
	from address a
    where expand(num,1,pop_patient_reply_out->patient_cnt,a.parent_entity_id
    						,pop_patient_reply_out->patients[num].patient.patient_id )
	and a.parent_entity_name = "PERSON"
	and a.active_ind = 1
	and a.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
	and a.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
    order by a.parent_entity_id
    head report
  	  count = 0
  	  pos = 0
  	  head a.parent_entity_id
  	    count = 0
  	    pos = 0
		detail
  			pos = locateval(num,1,pop_patient_reply_out->patient_cnt
  						,a.parent_entity_id,pop_patient_reply_out->patients[num].patient.patient_id )
  			count = count + 1
  			stat = alterlist(pop_patient_reply_out->patients[pos]->ExtendedInfo.Addresses,count)
  			pop_patient_reply_out->patients[pos].ExtendedInfo.Addresses[count].Address_Type_disp = UAR_GET_CODE_DISPLAY(a.address_type_cd)
  				pop_patient_reply_out->patients[pos].ExtendedInfo.Addresses[count].address_id = a.address_id
  				pop_patient_reply_out->patients[pos].ExtendedInfo.Addresses[count].END_EFFECTIVE_DT_TM   = a.end_effective_dt_tm
  				pop_patient_reply_out->patients[pos].ExtendedInfo.Addresses[count].Address_Type_cd = a.address_type_cd
  				pop_patient_reply_out->patients[pos].ExtendedInfo.Addresses[count].Address_Type_disp
  																						= uar_get_code_display(a.address_type_cd)
  				pop_patient_reply_out->patients[pos].ExtendedInfo.Addresses[count].sequence_nbr = a.address_type_seq
  			if(a.address_type_cd = dEmail)
  	  			pop_patient_reply_out->patients[pos].ExtendedInfo.Email = trim(a.street_addr,3)
  			else
     			pop_patient_reply_out->patients[pos].ExtendedInfo.Addresses[count].street_addr = trim(a.street_addr,3)
     			pop_patient_reply_out->patients[pos].ExtendedInfo.Addresses[count].street_addr2 = trim(a.street_addr2,3)
 
	  			if(a.city_cd > 0)
	    			pop_patient_reply_out->patients[pos].ExtendedInfo.Addresses[count].City = UAR_GET_CODE_DISPLAY(a.city_cd)
	 			else
	  				pop_patient_reply_out->patients[pos].ExtendedInfo.Addresses[count].city = trim(a.city,3)
	  			endif
	  			pop_patient_reply_out->patients[pos].ExtendedInfo.Addresses[count].Zipcode  = trim(a.zipcode,3)
 
	  			if(a.state_cd > 0)
	    			pop_patient_reply_out->patients[pos].ExtendedInfo.Addresses[count].State_disp = UAR_GET_CODE_DISPLAY(a.state_cd)
	  			else
	  				pop_patient_reply_out->patients[pos].ExtendedInfo.Addresses[count].State_disp = trim(a.state,3)
	  			endif
	  			pop_patient_reply_out->patients[pos].ExtendedInfo.Addresses[count].Zipcode  = trim(a.zipcode,3)
 
	  			if(a.country_cd > 0)
	  				pop_patient_reply_out->patients[pos].ExtendedInfo.Addresses[count].Country_disp = UAR_GET_CODE_DISPLAY(a.country_cd)
	  				pop_patient_reply_out->patients[pos].ExtendedInfo.Addresses[count].Country_cd = CNVTSTRING(a.country_cd)
	  			else
	  				pop_patient_reply_out->patients[pos].ExtendedInfo.Addresses[count].Country_disp = trim(a.country,3)
	  			endif
 
	  			if(a.county_cd > 0)
	  				pop_patient_reply_out->patients[pos].ExtendedInfo.Addresses[count].county_disp = UAR_GET_CODE_DISPLAY(a.county_cd)
	  				pop_patient_reply_out->patients[pos].ExtendedInfo.Addresses[count].county_cd = a.county_cd
	  			else
	  				pop_patient_reply_out->patients[pos].ExtendedInfo.Addresses[count].county_disp = trim(a.county,3)
	  			endif
   			endif
 
  	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
endif
 
;Get phone information
if(iIncExtended > 0)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Getting Phone Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	set count = 0
 	set num = 0
 	set pop = 0
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
 	select into "nl:"
 	ph.parent_entity_id
 	from phone ph
    where expand(num,1,pop_patient_reply_out->patient_cnt,ph.parent_entity_id,
    							pop_patient_reply_out->patients[num].patient.patient_id )
	   and ph.parent_entity_name = "PERSON"
	   and ph.active_ind = 1
	   and ph.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
	   and ph.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
    order by ph.parent_entity_id
 	head report
 		count = 0
 		pos = 0
 	head ph.parent_entity_id
 	   count = 0
 	   pos = 0
 		detail
  			pos = locateval(num,1,pop_patient_reply_out->patient_cnt
  							,ph.parent_entity_id,pop_patient_reply_out->patients[num].patient.patient_id )
  			count = count + 1
  			stat = alterlist(pop_patient_reply_out->patients[pos]->ExtendedInfo.Phones ,count)
  			pop_patient_reply_out->patients[pos].ExtendedInfo.Phones[count].phone_id  = ph.phone_id
  			pop_patient_reply_out->patients[pos].ExtendedInfo.Phones[count].end_effective_dt_tm  = ph.end_effective_dt_tm
  			pop_patient_reply_out->patients[pos].ExtendedInfo.Phones[count].Extension = trim(ph.extension,3)
  			pop_patient_reply_out->patients[pos].ExtendedInfo.Phones[count].phone_num = trim(ph.phone_num,3)
  			pop_patient_reply_out->patients[pos].ExtendedInfo.Phones[count].Phone_type_cd = ph.phone_type_cd
  			pop_patient_reply_out->patients[pos].ExtendedInfo.Phones[count].phone_type_disp = UAR_GET_CODE_DISPLAY(ph.phone_type_cd)
 			pop_patient_reply_out->patients[pos].ExtendedInfo.Phones[count].sequence_nbr = ph.phone_type_seq
  	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
endif
 
;get person_name info
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Getting person_name Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set count = 0
	set num = 0
	set pop = 0
	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
  	select into "nl:"
  	p.person_id
  	from person_name p
   	where expand(num,1,pop_patient_reply_out->patient_cnt,p.person_id,pop_patient_reply_out->patients[num].patient.patient_id )
   	and p.active_ind = 1
   	and p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
   	and p.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
    order by p.person_id
  	head report
  	  count = 0
  	  pos = 0
  	  head p.person_id
  	    count = 0
  	    pos = 0
  		detail
  			pos = locateval(num,1,pop_patient_reply_out->patient_cnt,p.person_id ,pop_patient_reply_out->patients[num].patient.patient_id )
  			count = count + 1
  			stat = alterlist(pop_patient_reply_out->patients[pos]->ExtendedInfo.Alternativenames,count)
  			pop_patient_reply_out->patients[pos].ExtendedInfo.Alternativenames[count].FirstName = trim(p.name_first,3)
			pop_patient_reply_out->patients[pos].ExtendedInfo.Alternativenames[count].LastName = trim(p.name_last,3)
			pop_patient_reply_out->patients[pos].ExtendedInfo.Alternativenames[count].MiddleName = trim(p.name_middle,3)
			pop_patient_reply_out->patients[pos].ExtendedInfo.Alternativenames[count].Prefix = trim(p.name_prefix,3)
			pop_patient_reply_out->patients[pos].ExtendedInfo.Alternativenames[count].Suffix = trim(p.name_suffix,3)
			pop_patient_reply_out->patients[pos].ExtendedInfo.Alternativenames[count].NameType.id = p.name_type_cd
			pop_patient_reply_out->patients[pos].ExtendedInfo.Alternativenames[count].NameType.name = UAR_GET_CODE_DISPLAY(p.name_type_cd)
 
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	;getting previous last name
	set num = 0
	set pop = 0
	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
  	select into "nl:"
  	from person_name_hist pnh
  	    ,(dummyt d with seq = pop_patient_reply_out->patient_cnt)
  	plan d
  		where pop_patient_reply_out->patients[d.seq].patient.patient_id > 0
  	join pnh
  		where pnh.person_id = pop_patient_reply_out->patients[d.seq].patient.patient_id
   			and pnh.active_ind = 1
   			and pnh.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
 
    order by d.seq,pnh.beg_effective_dt_tm desc
 
  	  head d.seq
  	  	 pop_patient_reply_out->patients[d.seq].previous_last_name = trim(pnh.name_last_key)
	  with nocounter, time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
 
;get interpreter and education information:
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Getting person_patient Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set num = 0
	set pop = 0
	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
  	select into "nl:"
  	from PERSON_PATIENT p
 	plan p
  	where expand(num,1,pop_patient_reply_out->patient_cnt,p.person_id,pop_patient_reply_out->patients[num].patient.patient_id )
 
  	head report
  		pos = 0
    	detail
   		x = 0
  		pos = locateval(num,1,pop_patient_reply_out->patient_cnt,p.person_id ,pop_patient_reply_out->patients[num].patient.patient_id )
  		pop_patient_reply_out->patients[pos].ExtendedInfo.NeedsInterpreter.id = p.interp_required_cd
  		pop_patient_reply_out->patients[pos].ExtendedInfo.NeedsInterpreter.name = UAR_GET_CODE_DISPLAY(p.interp_required_cd )
  		pop_patient_reply_out->patients[pos].ExtendedInfo.StudentStatus.id = p.student_cd
  		pop_patient_reply_out->patients[pos].ExtendedInfo.StudentStatus.name = UAR_GET_CODE_DISPLAY(p.student_cd )
 		pop_patient_reply_out->patients[pos].ExtendedInfo.EducationLevel.id = p.highest_grade_complete_cd
  		pop_patient_reply_out->patients[pos].ExtendedInfo.EducationLevel.name = UAR_GET_CODE_DISPLAY(p.highest_grade_complete_cd)
 		pop_patient_reply_out->patients[pos].ExtendedInfo.BirthGender.id = p.birth_sex_cd
 		pop_patient_reply_out->patients[pos].ExtendedInfo.BirthGender.name = uar_get_code_display(p.birth_sex_cd)
 		pop_patient_reply_out->patients[pos].ExtendedInfo.WrittenFormat.id = P.written_format_cd
 		pop_patient_reply_out->patients[pos].ExtendedInfo.WrittenFormat.name = uar_get_code_display(p.written_format_cd)
 
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
;get custom fields info
if(iIncCustomFields > 0)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Getting person_name Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set count = 0
	set num = 0
	set pop = 0
	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
  	select into "nl:"
  	p.person_id
  	,p.info_sub_type_cd
  	,p.value_cd
  	from person_info p,long_text lt
 	plan p
  	where expand(num,1,pop_patient_reply_out->patient_cnt,p.person_id,pop_patient_reply_out->patients[num].patient.patient_id )
    and p.info_type_cd = c_userdefined_info_type_cd
  	join lt
  	where p.long_text_id = lt.long_text_id
  	order by p.person_id , p.info_sub_type_cd, p.value_cd
 
  	head report
  		count = 0
  		pos = 0
  	 head p.person_id
  	    pos = 0
  	    count = 0
  	    x = 0
       val_cnt = 0
  	  head p.info_sub_type_cd
  		x = 0
  		val_cnt = 0
  		pos = locateval(num,1,pop_patient_reply_out->patient_cnt,p.person_id ,pop_patient_reply_out->patients[num].patient.patient_id )
  		count = count + 1
  		stat = alterlist(pop_patient_reply_out->patients[pos]->CustomFields,count)
  		pop_patient_reply_out->patients[pos].CustomFields[count].Field.id  = p.info_sub_type_cd
  		pop_patient_reply_out->patients[pos].CustomFields[count].Field.name = UAR_GET_CODE_DISPLAY(p.info_sub_type_cd)
 
  		detail
	  	   if(size(trim(lt.long_text)) > 0)
	  		val_cnt = val_cnt+1
	  		stat = alterlist(pop_patient_reply_out->patients[pos]->CustomFields[count].ResponseValueText,val_cnt)
 
	  		pop_patient_reply_out->patients[pos].CustomFields[count].ResponseValueText[val_cnt] = trim(lt.long_text,3)
		   endif
 
		   if (p.value_cd > 0)
    		x= x+1
    		stat = alterlist(pop_patient_reply_out->patients[pos]->CustomFields[count].ResponseValueCodes,x)
 
  			pop_patient_reply_out->patients[pos].CustomFields[count].ResponseValueCodes[x].id = p.value_cd
  			pop_patient_reply_out->patients[pos].CustomFields[count].ResponseValueCodes[x].name = UAR_GET_CODE_DISPLAY(p.value_cd)
		   endif
 
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
endif
 
;get comments info
if(iIncComments > 0)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Getting comments Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set count = 0
	set num = 0
	set pop = 0
	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
  	select into "nl:"
  	p.person_id
  	,p.info_type_cd
  	from person_info p,long_text lt
 	plan p
  	where expand(num,1,pop_patient_reply_out->patient_cnt,p.person_id,pop_patient_reply_out->patients[num].patient.patient_id )
    and p.info_type_cd = c_comments_info_type_cd
  	join lt
  	where p.long_text_id = lt.long_text_id
  	order by p.person_id , p.info_type_cd
 
  	head report
  		count = 0
  		pos = 0
  	  head p.person_id
  	    pos = 0
  	    count = 0
  	    x = 0
       val_cnt = 0
  	  head p.info_type_cd
  		x = 0
  		val_cnt = 0
  		pos = locateval(num,1,pop_patient_reply_out->patient_cnt,p.person_id ,pop_patient_reply_out->patients[num].patient.patient_id )
  		detail
  		count = count + 1
  		stat = alterlist(pop_patient_reply_out->patients[pos]->Comments,count)
  		pop_patient_reply_out->patients[pos].Comments[count].UPDT_ID = p.updt_id
  		pop_patient_reply_out->patients[pos].Comments[count].UPDT_DT_TM = P.updt_dt_tm
        pop_patient_reply_out->patients[pos].Comments[count].CMT_TEXT = trim(lt.long_text,3)
        pop_patient_reply_out->patients[pos].Comments[count].Internal_Seq = p.internal_seq
 
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
endif
 
	if(iDebugFlag > 0)
		call echo(concat("getPatientsList Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end ;end sub
 
 
;call echo(build2("jmod $beg_dt", cnvtdatetime($BEG_DATE) ))
;
end go
