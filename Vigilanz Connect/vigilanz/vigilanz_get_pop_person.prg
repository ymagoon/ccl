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
      Source file name: snsro_get_pop_person.prg
      Object name:      vigilanz_get_pop_person
      Program purpose:  Get updated persons
      Executing from:   Emissary
 ***********************************************************************
                  MODIFICATION CONTROL LOG
 ***********************************************************************
 Mod Date     Engineer  Comment
 -----------------------------------------------------------------------
 001 12/4/19  KRD	Initial Write
 002 03/28/20 KRD   Changed include patient logic
 003 04/09/20 KRD   Changed the main criteria query logic
 004 04/09/20 KRD   Added username
 004 04/22/20 KRD   Added display_name and replaced MiddleName with
 					middle_name
 ************************************************************************/
drop program vigilanz_get_pop_person go
create program vigilanz_get_pop_person
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Username:" = ""
	, "Beg Date:" = ""
	, "End Date:" = ""
	, "Facility_Code_List" = ""
	, "Include Extended" = ""
	, "Include Identity" = ""
	, "Include Custom Fields" = 0
	, "Include Prsnl" = ""
	, "Include Patient" = ""
	, "Debug Flag" = 0
	, "Time Max" = 3600
 
with OUTDEV, USERNAME, BEG_DATE, END_DATE, LOC_LIST, INC_EXTENDED, INC_IDENTITY,
	 INC_CUSTOM_FIELDS, INC_PRSNL, INC_PATIENT, DEBUG_FLAG, TIME_MAX
 
 
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
 
free record person_temp
record person_temp (
1 person_cnt = i4
1 persons[*]
    2 person_id = f8
    2 updt_dt_tm = dq8
    2 patient_ind = i2
    2 prsnl_ind = i2
    2 username = vc
    2 pat_alias_cnt = i4
    2 patient_alias[*]
		3  person_alias_id             = f8
		3  alias_pool_cd               = f8
		3  person_alias_type_cd        = f8
		3  person_alias_type_disp      = vc
		3  person_alias_type_mean      = vc
		3  alias                       = vc
)
 
free record pop_person_reply_out
record pop_person_reply_out (
1 person_cnt = i4
1 persons[*]
    2 created_updated_date_time	= dq8
	2 Deceased_Dt_Tm = dq8
	2 Updated_UserId = f8
	2 Updated_UserName = vc
	2 End_Effective_Dt_Tm = dq8
    2 person
		3 Person_Id= f8
		3 username = vc
		3 display_name = vc
		3 last_name= vc
		3 first_name= vc
		3 middle_name= vc
		3 Prefix = vc
		3 Suffix = vc
		3 gender
			4 id = f8
			4 name = vc
		3 birth_date_time= dq8
		3 Deceased_Dt_Tm = dq8
		3 sdob = vc
	2  patient_alias[*]
		3  person_alias_id             = f8
		3  alias_pool_cd               = f8
		3  person_alias_type_cd        = f8
		3  person_alias_type_disp      = vc
		3  person_alias_type_mean      = vc
		3  alias                       = vc
     2 ExtendedInfo
     	3 Deceased
			4 Id = f8
			4 Name = vc
		3 Vip
			4 Id = f8
			4 Name = vc
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
		3 Race[*]
			4 id = f8
			4 name = vc
		3 Religion
			4 id = f8
			4 name = vc
		3 EducationLevel
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
		  4 county_disp = vc
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
		3 AlternateNames[*]
		  4 NameType
			5 id = f8
			5 name = vc
		  4 LastName = vc
		  4 FirstName = vc
		  4 MiddleName = vc
		  4 Prefix = vc
		  4 Suffix = vc
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
		2 Patient_Id				= f8
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
set pop_person_reply_out->status_data.status = "F"
 
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
declare timeOutThreshold = i4 with protect, noconstant(115);setting to 115 seconds
declare queryStartTm = dq8
 
;Constants
declare iIncIdentity	 	= i4 with protect, noconstant(0)
declare iIncPatientFields	= i4 with protect, noconstant(0)
declare iIncCustomFields	= i4 with protect, noconstant(0)
declare iIncExtended	 	= i4 with protect, noconstant(0)
declare Section_Start_Dt_Tm = DQ8 WITH PROTECT, NOCONSTANT(CNVTDATETIME(CURDATE, CURTIME3))
 
declare dEmail				= f8 with protect, constant(uar_get_code_by("MEANING", 212, "EMAIL")) /*015*/
declare c_mrn_person_alias_type_cd  = f8 with protect, constant(uar_get_code_by("MEANING",4,"MRN"))
declare c_cmrn_person_alias_type_cd  = f8 with protect, constant(uar_get_code_by("MEANING",4,"CMRN"))
declare c_refmrn_person_alias_type_cd  = f8 with protect, constant(uar_get_code_by("MEANING",4,"REF_MRN"))
 
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
set iIncPrsnlFields             = cnvtint($INC_PRSNL)
set iIncPatientFields			= cnvtint($INC_PATIENT)
set iIncIdentity 				= cnvtint($INC_IDENTITY)
 
set iDebugFlag					= cnvtint($DEBUG_FLAG)
set iTimeMax					= cnvtint($TIME_MAX)
declare iMaxRecs				= i4 with protect, constant(2000)
 
set qFromDateTime = GetDateTime(sFromDate)
set qToDateTime = GetDateTime(sToDate)
 
 
/**************************************************************************
;DECLARE SUBROUTINES
***************************************************************************/
declare ParseLocations(sLocFacilities = vc)	= null with protect ;list parse out code values
declare GetAliasPoolsList(null)	= null with protect ;Create the alias list for given location list
declare GetPersonsList(null)	= null with protect ;Creates qualified persons list
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Validate Username
set iRet = PopulateAudit(sUserName, 0.0, pop_person_reply_out, sVersion)
 if(iRet = 0)
	call ErrorHandler2("ORDERS", "F","User is invalid", "Invalid User for Audit.","1001",build("User is invalid. ",
	"Invalid User for Audit."),pop_person_reply_out) ;008
	go to EXIT_SCRIPT
endif
 
; Validate from date is not greather than to date - 012
if (qFromDateTime > qToDateTime)
	call ErrorHandler2("SELECT", "F", "VALIDATE", "From Date Greater than To Date. Refine Dates Entered.",
	"2010", "From Date Greater than To Date. Refine Dates Entered.", pop_person_reply_out)
	go to EXIT_SCRIPT
endif
 
 ; Validate timespan doesn't exceed threshold
set iRet = ThreshHoldValidator(iTimeMax,"s",qFromDateTime,qToDateTime)
if(iRet = 0)
	call ErrorHandler2("SELECT", "F", "VALIDATE", "Date Range Too Long. Refine Query.",
	"2011","Date Range Too Long. Refine Query.",pop_person_reply_out) ;008
	 go to EXIT_SCRIPT
endif
 
; Parse locations if provided
if(sLocFacilities > " ")
	call ParseLocations(sLocFacilities)
endif
 
;Get alias pool list for given facility:
call GetAliasPoolsList(null)
 
;Get persons List:
call GetPersonsList(null)
 
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(pop_person_reply_out)
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_pop_person.json")
	call echo(build2("_file : ", _file))
	call echojson(pop_person_reply_out, _file, 0)
    call echorecord(pop_person_reply_out)
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
				where code_set = 220
					and loc_req->codes[num]->code_value = code_value
				detail
					check = 1
				with nocounter
 
				if (check = 0)
					call ErrorHandler2("EXECUTE", "F", "POP_personS", build("Invalid Facility Code: ", loc_req->codes[num]->code_value),
					"2040", build("Invalid Facility Code: ",loc_req->codes[num]->code_value),pop_person_reply_out) ;012
					set stat = alterlist(pop_person_reply_out,0)
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
subroutine GetAliasPoolsList(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetAliasPoolsList Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare num = i4
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
		call echo(concat("GetAliasPoolsList Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;end sub
 
;===================================================================
;create persons list
;===================================================================
subroutine GetPersonsList(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetPersonsList Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	;Set expand control value
	if(size(loc_req->codes,5) > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	declare num = i4
 
;resetting alias_pools_string to use in location assignment query
	select ;into "nl:"
  	 if(alias_pools->qual_cnt > 0)
		from person p, dummyt d1, prsnl pr, dummyt d2, person_alias pa
		plan p where p.updt_dt_tm between cnvtdatetime(qFromDateTime) and cnvtdatetime(qToDateTime)
		join d1
		join pr where pr.person_id = p.person_id
		join d2
		join pa where pa.person_id = p.person_id
	    	and expand(num,1,alias_pools->qual_cnt,pa.alias_pool_cd,alias_pools->qual[num].alias_pool_cd)
			and pa.active_ind = 1
			and pa.end_effective_dt_tm > sysdate
			and pa.beg_effective_dt_tm <= sysdate
		order by p.updt_dt_tm, p.person_id
		with nocounter, outerjoin = d1, dontcare=pr, outerjoin=d2, dontcare=pa
	 else
		from person p, prsnl pr, person_alias pa
		plan p where p.updt_dt_tm between cnvtdatetime(qFromDateTime) and cnvtdatetime(qToDateTime)
		join pr where pr.person_id = outerjoin(p.person_id)
		join pa where pa.person_id = outerjoin(p.person_id)
			and pa.active_ind = outerjoin(1)
			and pa.end_effective_dt_tm > outerjoin(sysdate)
			and pa.beg_effective_dt_tm <= outerjoin(sysdate)
		order by p.updt_dt_tm, p.person_id
		with nocounter
	 endif
	into 'nl:'
	head report
 
		x = 0
		max_reached = 0
		stat = alterlist(person_temp->persons,iMaxRecs)
	head p.updt_dt_tm
   		if(x > iMaxRecs)
      		max_reached = 1
   		endif
   	head p.person_id
		count = 0
		if(max_reached = 0)
			x = x + 1
			if(mod(x,100) = 1 and x > iMaxRecs)
			stat = alterlist(person_temp->persons,x + 99)
			endif
			person_temp->persons[x].person_id = p.person_id
			person_temp->persons[x].updt_dt_tm = p.updt_dt_tm
			endif
		detail
			if(pa.alias > " ")
				if(pa.person_alias_type_cd  in (c_mrn_person_alias_type_cd,c_cmrn_person_alias_type_cd,c_refmrn_person_alias_type_cd))
					person_temp->persons[x].patient_ind = 1
				endif
				count = count + 1
	  			stat = alterlist(person_temp->persons[x].patient_alias,count)
	  			person_temp->persons[x].patient_alias[count]->person_alias_id = pa.person_alias_id
	  			person_temp->persons[x].patient_alias[count]->alias_pool_cd = pa.alias_pool_cd
	  			person_temp->persons[x].patient_alias[count]->person_alias_type_cd = pa.person_alias_type_cd
	  			person_temp->persons[x].patient_alias[count]->person_alias_type_disp = UAR_GET_CODE_DISPLAY(pa.person_alias_type_cd)
	  			person_temp->persons[x].patient_alias[count]->alias = trim(pa.alias,3)
				person_temp->persons[x].pat_alias_cnt = count
			endif
			if(pr.person_id > 0)
				person_temp->persons[x].prsnl_ind = 1
				person_temp->persons[x].username = trim(pr.username)
			endif
	foot report
		stat = alterlist(person_temp->persons,x)
		person_temp->person_cnt = x
 
;Build the main structure - pop_person_reply_out
	set num = 0
	set pos = 0
    select into "nl:"
    p.updt_dt_tm
    ,p.person_id
    from person p
	plan p
	where expand(num,1,person_temp->person_cnt,p.person_id,person_temp->persons[num].person_id,
			iIncPatientFields, person_temp->persons[num].patient_ind,
			iIncPrsnlFields, person_temp->persons[num].prsnl_ind)
	order by p.updt_dt_tm , p.person_id
  	head report
	 x = 0
	 max_reached = 0
	 stat = alterlist(pop_person_reply_out->persons,iMaxRecs)
	 head p.updt_dt_tm
	   if(x > iMaxRecs)
		 max_reached = 1
	   endif
 	   head p.person_id
 	    pos = 0
 	    count= 0
		if(max_reached = 0)
			x = x + 1
			if(mod(x,100) = 1 and x > iMaxRecs)
				stat = alterlist(pop_person_reply_out->persons,x + 99)
			endif
		endif
		;pos = locateval(num,1,pop_person_reply_out->person_cnt,p.person_id ,pop_person_reply_out->persons[num].person.Person_Id )
		pos = locateval(num,1,person_temp->person_cnt,p.person_id,person_temp->persons[num].person_id,
			 			iIncPatientFields, person_temp->persons[num].patient_ind,
						iIncPrsnlFields, person_temp->persons[num].prsnl_ind)
	    detail
		if(max_reached = 0)
 			stat = alterlist(pop_person_reply_out->persons,x)
	 		pop_person_reply_out->persons[x].created_updated_date_time = p.updt_dt_tm
	 		pop_person_reply_out->persons[x].ExtendedInfo.deceased.name = uar_get_code_display(p.deceased_cd)
	 		pop_person_reply_out->persons[x].ExtendedInfo.deceased.id = p.deceased_cd
	 		pop_person_reply_out->persons[x].person.deceased_dt_tm = p.deceased_dt_tm
	 		pop_person_reply_out->persons[x].Updated_UserId = p.updt_id
	 		pop_person_reply_out->persons[x].End_Effective_Dt_Tm  = p.end_effective_dt_tm
	 		pop_person_reply_out->persons[x].ExtendedInfo.vip.id = p.vip_cd
	 		pop_person_reply_out->persons[x].ExtendedInfo.vip.name = uar_get_code_display(p.vip_cd)
  			pop_person_reply_out->persons[x].person.Person_Id = p.person_id
			pop_person_reply_out->persons[x].person.middle_name = p.name_middle
			pop_person_reply_out->persons[x].person.display_name= p.name_full_formatted
			pop_person_reply_out->persons[x].person.first_name = p.name_first
			pop_person_reply_out->persons[x].person.last_name = p.name_last
			pop_person_reply_out->persons[x].person.birth_date_time = p.birth_dt_tm
			pop_person_reply_out->persons[x].person.Deceased_Dt_Tm = p.deceased_dt_tm
			pop_person_reply_out->persons[x].person.gender->id  = p.sex_cd
			pop_person_reply_out->persons[x].person.gender->name  = uar_get_code_display(p.sex_cd)
			pop_person_reply_out->persons[x].ExtendedInfo.Language.id = p.language_cd
			pop_person_reply_out->persons[x].ExtendedInfo.Language.name = UAR_GET_CODE_DISPLAY(p.language_cd)
			pop_person_reply_out->persons[x].ExtendedInfo.Marital_Status.id = p.marital_type_cd
			pop_person_reply_out->persons[x].ExtendedInfo.Marital_Status.name =  UAR_GET_CODE_DISPLAY(p.marital_type_cd)
			pop_person_reply_out->persons[x].ExtendedInfo.Ethnicity.id = p.ethnic_grp_cd
			pop_person_reply_out->persons[x].ExtendedInfo.Ethnicity.name = UAR_GET_CODE_DISPLAY(p.ethnic_grp_cd )
			pop_person_reply_out->persons[x].ExtendedInfo.Religion.id  = p.religion_cd
			pop_person_reply_out->persons[x].ExtendedInfo.Religion.name  = UAR_GET_CODE_DISPLAY(p.religion_cd)
			pop_person_reply_out->persons[x].person.username  = person_temp->persons[pos].username
			if (iIncIdentity = 1)
		  		stat = alterlist(pop_person_reply_out->persons[x]->patient_alias,person_temp->persons[pos].pat_alias_cnt )
				for (count = 1 to person_temp->persons[pos].pat_alias_cnt )
		  			pop_person_reply_out->persons[x].patient_alias[count]->person_alias_id =
		  													person_temp->persons[pos].patient_alias[count].person_alias_id
		  			pop_person_reply_out->persons[x].patient_alias[count]->alias_pool_cd =
		  													person_temp->persons[pos].patient_alias[count].alias_pool_cd
		  			pop_person_reply_out->persons[x].patient_alias[count]->person_alias_type_cd =
		  													person_temp->persons[pos].patient_alias[count].person_alias_type_cd
		  			pop_person_reply_out->persons[x].patient_alias[count]->person_alias_type_disp =
		  			                                        person_temp->persons[pos].patient_alias [count].person_alias_type_disp
		  			pop_person_reply_out->persons[x].patient_alias[count]->alias =
		  			                                        person_temp->persons[pos].patient_alias [count].alias
				endfor
			endif
		endif
 	foot report
 	    stat = alterlist(pop_person_reply_out->persons,x)
 		pop_person_reply_out->person_cnt = x
	with nocounter,expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag)
 		call echo(build("------Qual Cnt = ",pop_person_reply_out->person_cnt))
 	endif
 
; Populate audit
	if(pop_person_reply_out->person_cnt > 0)
		call ErrorHandler("EXECUTE", "S", "Success", "Get Pop person completed successfully.", pop_person_reply_out)
	else
		call ErrorHandler("EXECUTE", "Z", "No Data.", "No records qualify.", pop_person_reply_out)
		go to EXIT_SCRIPT
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
  	where expand(num,1,pop_person_reply_out->person_cnt,p.person_id,pop_person_reply_out->persons[num].person.Person_Id )
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
  			pos = locateval(num,1,pop_person_reply_out->person_cnt,p.person_id ,pop_person_reply_out->persons[num].person.Person_Id )
  			count = count + 1
  			stat = alterlist(pop_person_reply_out->persons[pos]->ExtendedInfo.race,count)
  			pop_person_reply_out->persons[pos].ExtendedInfo.race[count].id = p.code_value
			pop_person_reply_out->persons[pos].ExtendedInfo.Race [count].name = UAR_GET_CODE_DISPLAY(p.code_value )
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
    where expand(num,1,pop_person_reply_out->person_cnt,a.parent_entity_id,pop_person_reply_out->persons[num].person.Person_Id )
	and a.parent_entity_name = "PERSON"
	and a.active_ind = 1
	and a.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
	and a.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
    order by a.parent_entity_id
    head report
  	  count = 0
  	  pos = 0
  	  head a.parent_entity_id
  	    count = 0
  	    pos = 0
		detail
  			pos = locateval(num,1,pop_person_reply_out->person_cnt
  				,a.parent_entity_id,pop_person_reply_out->persons[num].person.Person_Id)
  			count = count + 1
  			stat = alterlist(pop_person_reply_out->persons[pos]->ExtendedInfo.Addresses,count)
  			pop_person_reply_out->persons[pos].ExtendedInfo.Addresses[count].Address_Type_disp = UAR_GET_CODE_DISPLAY(a.address_type_cd)
			pop_person_reply_out->persons[pos].ExtendedInfo.Addresses[count].address_id = a.address_id
			pop_person_reply_out->persons[pos].ExtendedInfo.Addresses[count].Address_Type_cd = a.address_type_cd
			pop_person_reply_out->persons[pos].ExtendedInfo.Addresses[count].sequence_nbr = a.address_type_seq
			pop_person_reply_out->persons[pos].ExtendedInfo.Addresses[count].end_effective_dt_tm = a.end_effective_dt_tm
 
			if(a.address_type_cd = dEmail)
  	  			pop_person_reply_out->persons[pos].ExtendedInfo.Email = trim(a.street_addr,3)
  			else
     			pop_person_reply_out->persons[pos].ExtendedInfo.Addresses[count].street_addr = trim(a.street_addr,3)
     			pop_person_reply_out->persons[pos].ExtendedInfo.Addresses[count].street_addr2 = trim(a.street_addr2,3)
 
	  			if(a.city_cd > 0)
	    			pop_person_reply_out->persons[pos].ExtendedInfo.Addresses[count].city = UAR_GET_CODE_DISPLAY(a.city_cd)
	 			else
	  				pop_person_reply_out->persons[pos].ExtendedInfo.Addresses[count].City = trim(a.city,3)
	  			endif
 
	  			if(a.state_cd > 0)
	    			pop_person_reply_out->persons[pos].ExtendedInfo.Addresses[count].State_disp = UAR_GET_CODE_DISPLAY(a.state_cd)
	  			else
	  				pop_person_reply_out->persons[pos].ExtendedInfo.Addresses[count].State_disp = trim(a.state,3)
	  			endif
	  			pop_person_reply_out->persons[pos].ExtendedInfo.Addresses[count].Zipcode  = trim(a.zipcode,3)
 
				if(a.country_cd > 0)
	  				pop_person_reply_out->persons[pos].ExtendedInfo.Addresses[count].Country_cd  = cnvtstring(a.country_cd)
	  				pop_person_reply_out->persons[pos].ExtendedInfo.Addresses[count].Country_disp = UAR_GET_CODE_DISPLAY(a.country_cd)
	  			else
	  				pop_person_reply_out->persons[pos].ExtendedInfo.Addresses[count].Country_disp = trim(a.country,3)
	  			endif
 
	  			if(a.county_cd > 0)
	  				pop_person_reply_out->persons[pos].ExtendedInfo.Addresses[count].county_cd = a.county_cd
	  				pop_person_reply_out->persons[pos].ExtendedInfo.Addresses[count].county_disp = UAR_GET_CODE_DISPLAY(a.county_cd)
	  			else
	  				pop_person_reply_out->persons[pos].ExtendedInfo.Addresses[count].county_disp = trim(a.county,3)
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
    where expand(num,1,pop_person_reply_out->person_cnt,ph.parent_entity_id,pop_person_reply_out->persons[num].person.Person_Id )
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
  			pos = locateval(num,1,pop_person_reply_out->person_cnt,ph.parent_entity_id
  			,pop_person_reply_out->persons[num].person.Person_Id )
  			count = count + 1
  			stat = alterlist(pop_person_reply_out->persons[pos]->ExtendedInfo.Phones ,count)
  			pop_person_reply_out->persons[pos].ExtendedInfo.Phones[count].phone_id = ph.phone_id
  			pop_person_reply_out->persons[pos].ExtendedInfo.Phones[count].Extension = trim(ph.extension,3)
  			pop_person_reply_out->persons[pos].ExtendedInfo.Phones[count].phone_num = trim(ph.phone_num,3)
  			pop_person_reply_out->persons[pos].ExtendedInfo.Phones[count].Phone_type_cd = ph.phone_type_cd
  			pop_person_reply_out->persons[pos].ExtendedInfo.Phones[count].phone_type_disp = UAR_GET_CODE_DISPLAY(ph.phone_type_cd)
 			pop_person_reply_out->persons[pos].ExtendedInfo.Phones[count].sequence_nbr = ph.phone_type_seq
 			pop_person_reply_out->persons[pos].ExtendedInfo.Phones[count].end_effective_dt_tm  = ph.end_effective_dt_tm
 
 
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
   	where expand(num,1,pop_person_reply_out->person_cnt,p.person_id,pop_person_reply_out->persons[num].person.Person_Id )
   	and p.active_ind = 1
   	and p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
   	and p.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
    order by p.Person_Id
  	head report
  	  count = 0
  	  pos = 0
  	  head p.Person_Id
  	    count = 0
  	    pos = 0
  		detail
  			pos = locateval(num,1,pop_person_reply_out->person_cnt,p.Person_Id ,pop_person_reply_out->persons[num].person.Person_Id )
  			count = count + 1
  			stat = alterlist(pop_person_reply_out->persons[pos]->ExtendedInfo.AlternateNames,count)
  			pop_person_reply_out->persons[pos].ExtendedInfo.AlternateNames[count].FirstName = trim(p.name_first,3)
			pop_person_reply_out->persons[pos].ExtendedInfo.AlternateNames[count].LastName = trim(p.name_last,3)
			pop_person_reply_out->persons[pos].ExtendedInfo.AlternateNames[count].MiddleName = trim(p.name_middle,3)
			pop_person_reply_out->persons[pos].ExtendedInfo.AlternateNames[count].Prefix = trim(p.name_prefix,3)
			pop_person_reply_out->persons[pos].ExtendedInfo.AlternateNames[count].Suffix = trim(p.name_suffix,3)
			pop_person_reply_out->persons[pos].ExtendedInfo.AlternateNames[count].NameType.id  = p.name_type_cd
			pop_person_reply_out->persons[pos].ExtendedInfo.AlternateNames[count].NameType.name = UAR_GET_CODE_DISPLAY(p.name_type_cd)
 
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
;get interpreter and education information:
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Getting from patient_patient p Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set num = 0
	set pop = 0
	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
  	select into "nl:"
  	from PERSON_PATIENT p
 	plan p
  	where expand(num,1,pop_person_reply_out->person_cnt,p.Person_Id,pop_person_reply_out->persons[num].person.Person_Id )
 
  	head report
  		pos = 0
    	detail
   		x = 0
  		pos = locateval(num,1,pop_person_reply_out->person_cnt,p.Person_Id ,pop_person_reply_out->persons[num].person.Person_Id )
  		pop_person_reply_out->persons[pos].ExtendedInfo.NeedsInterpreter.id = p.interp_type_cd
  		pop_person_reply_out->persons[pos].ExtendedInfo.NeedsInterpreter.name = UAR_GET_CODE_DISPLAY(p.interp_type_cd)
 		pop_person_reply_out->persons[pos].ExtendedInfo.EducationLevel.id = p.highest_grade_complete_cd
  		pop_person_reply_out->persons[pos].ExtendedInfo.EducationLevel.name = UAR_GET_CODE_DISPLAY(p.highest_grade_complete_cd)
 
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
 
	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
	select into "nl:"
	p.person_id
	from prsnl p
		,(dummyt d with seq = pop_person_reply_out->person_cnt)
	plan d
		where pop_person_reply_out->persons[d.seq].Updated_UserId > 0
    join p
    	where p.person_id = pop_person_reply_out->persons[d.seq].Updated_UserId
   			and p.active_ind = 1
   			and p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
   			and p.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
    order by d.seq
 
  	head d.seq
      pop_person_reply_out->persons[d.seq].Updated_UserName = trim(p.username)
  	with nocounter, time = value(timeOutThreshold)
 
 
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
  	p.Person_Id
  	,p.info_sub_type_cd
  	,p.value_cd
  	from person_info p,long_text lt
 	plan p
  	where expand(num,1,pop_person_reply_out->person_cnt,p.Person_Id,pop_person_reply_out->persons[num].person.Person_Id )
  	join lt
  	where p.long_text_id = lt.long_text_id
  	order by p.Person_Id , p.info_sub_type_cd, p.value_cd
 
  	head report
  		count = 0
  		pos = 0
  	 head p.Person_Id
  	    pos = 0
  	    count = 0
  	    x = 0
 		val_cnt = 0
  	  head p.info_sub_type_cd
  		x = 0
  		val_cnt = 0
  		pos = locateval(num,1,pop_person_reply_out->person_cnt,p.Person_Id ,pop_person_reply_out->persons[num].person.Person_Id )
  		count = count + 1
  		stat = alterlist(pop_person_reply_out->persons[pos]->CustomFields,count)
  		pop_person_reply_out->persons[pos].CustomFields[count].Field.id   = p.info_sub_type_cd
  		pop_person_reply_out->persons[pos].CustomFields[count].Field.name = UAR_GET_CODE_DISPLAY(p.info_sub_type_cd)
  		detail
	  	   if((size(trim(lt.long_text))) > 0)
	  		val_cnt = val_cnt+1
	  		stat = alterlist(pop_person_reply_out->persons[pos]->CustomFields[count].ResponseValueText,val_cnt)
	  		pop_person_reply_out->persons[pos].CustomFields[count].ResponseValueText[val_cnt]= trim(lt.long_text,3)
		   endif
		   if (p.value_cd > 0)
     		x= x+1
    		stat = alterlist(pop_person_reply_out->persons[pos]->CustomFields[count].ResponseValueCodes,x)
 
  			pop_person_reply_out->persons[pos].CustomFields[count].ResponseValueCodes[x].id  = p.value_cd
  			pop_person_reply_out->persons[pos].CustomFields[count].ResponseValueCodes[x].name = UAR_GET_CODE_DISPLAY(p.value_cd)
 		   endif
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetPersonsList Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end ;end sub
 
 
end go
