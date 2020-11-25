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
      Source file name: snsro_get_pop_prsnl.prg
      Object name:      vigilanz_get_pop_prsnl
      Program purpose:  Get updated personnel
      Executing from:   Emissary
 ***********************************************************************
                  MODIFICATION CONTROL LOG
 ***********************************************************************
 Mod Date     Engineer  Comment
 -----------------------------------------------------------------------
 001 5/10/20  KRD	Initial Write
 ************************************************************************/
drop program vigilanz_get_pop_prsnl go
create program vigilanz_get_pop_prsnl
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Username:" = ""
	, "Beg Date:" = ""
	, "End Date:" = ""
	, "Facility_Code_List" = ""
	, "Debug Flag" = 0
	, "Time Max" = 3600
 
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
 
free record person_temp
record person_temp (
1 person_cnt = i4
1 persons[*]
    2 person_id = f8
    2 updt_dt_tm = dq8
)
 
free record pop_prsnl_reply_out
free record pop_prsnl_reply_out
record pop_prsnl_reply_out (
1 prsnl_cnt = i4
1 prsnl[*]
	2 prsnl_id 					= f8
	2 username 					= vc
  	2 position                  = vc
    2 position_cd				= f8
    2 userstatus                = vc
    2 activeStatus
    	3 id                    = f8
    	3 name                  = vc
	2 display_name 				= vc
	2 last_name					= vc
	2 first_name				= vc
	2 middle_name				= vc
    2 title						= vc
	2 gender
		3 id 					= f8
		3 name 					= vc
	2 birth_date_time  			= dq8
    2 created_updated_date_time	= dq8
	2 beg_effective_dt_tm 		= dq8
  	2 end_effective_dt_tm   	= dq8
  	2 account_disabled    		 = i4
  	2 AssociatedAccounts[*]
		3 prsnl_id             	 = f8
		3 active_ind          	 = i4
		3 account_disabled     	 = i4
		3 beg_effective_dt_tm	 = dq8
		3 end_effective_dt_tm 	 = dq8
  	2 prsnl_alias [*]
    	3 person_alias_id      	 = f8
    	3 person_alias_type_disp = vc
    	3 alias             	 = vc
  	2 specialties[*]
  		3 id 					 = f8
  		3 name 					 = vc
  	2 Addresses[*]
		  3 address_id = f8
		  3 street_addr = vc
		  3 street_addr2 = vc
		  3 City = vc
		  3 State_disp = vc
		  3 Address_Type_cd = f8
		  3 Address_Type_disp = vc
		  3 Zipcode = vc
		  3 Country_disp = vc
		  3 Country_cd = vc
		  3 county_cd = f8
		  3 county_disp = vc
		  3 sequence_nbr  =   i4
		  3 end_effective_dt_tm = dq8
	2 Phones[*]
		  3 phone_id = f8
		  3 phone_num = vc
		  3 Extension = vc
		  3 Phone_type_cd = f8
		  3 phone_type_disp = vc
		  3 phone_type_mean = vc
		  3 sequence_nbr = i4
		  3 end_effective_dt_tm = dq8
 
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
 
free record org_list
record org_list(
		1 qual_cnt = i4
		1 qual[*]
		  2 organization_id = f8
		)
 
 
;initialize status to FAIL
set pop_prsnl_reply_out->status_data.status = "F"
 
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
declare GetPersonnelList(null)	= null with protect ;Creates qualified persons list
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Validate Username
set iRet = PopulateAudit(sUserName, 0.0, pop_prsnl_reply_out, sVersion)
 if(iRet = 0)
	call ErrorHandler2("ORDERS", "F","User is invalid", "Invalid User for Audit.","1001",build("User is invalid. ",
	"Invalid User for Audit."),pop_prsnl_reply_out) ;008
	go to EXIT_SCRIPT
endif
 
; Validate from date is not greather than to date - 012
if (qFromDateTime > qToDateTime)
	call ErrorHandler2("SELECT", "F", "VALIDATE", "From Date Greater than To Date. Refine Dates Entered.",
	"2010", "From Date Greater than To Date. Refine Dates Entered.", pop_prsnl_reply_out)
	go to EXIT_SCRIPT
endif
 
 
 ; Validate timespan doesn't exceed threshold
set iRet = ThreshHoldValidator(iTimeMax,"s",qFromDateTime,qToDateTime)
if(iRet = 0)
	call ErrorHandler2("SELECT", "F", "VALIDATE", "Date Range Too Long. Refine Query.",
	"2011","Date Range Too Long. Refine Query.",pop_prsnl_reply_out) ;008
	 go to EXIT_SCRIPT
endif
 
; Parse locations if provided
if(sLocFacilities > " ")
	call ParseLocations(sLocFacilities)
endif
 
;Get alias pool list for given facility:
call GetAliasPoolsList(null)
 
if(iDebugFlag > 0)
  call echorecord(org_list)
  call echorecord(loc_req)
endif
 
;Get persons List:
call GetPersonnelList(null)
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(pop_prsnl_reply_out)
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_pop_prsnl.json")
	call echo(build2("_file : ", _file))
	call echojson(pop_prsnl_reply_out, _file, 0)
    call echorecord(pop_prsnl_reply_out)
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
					"2040", build("Invalid Facility Code: ",loc_req->codes[num]->code_value),pop_prsnl_reply_out) ;012
					set stat = alterlist(pop_prsnl_reply_out,0)
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
;Get Alias Pools for given locations and stor it in the structure.
;=====================================================================================
subroutine GetAliasPoolsList(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetAliasPoolsList Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
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
		plan l
			where expand(num,1,loc_size,l.location_cd ,loc_req->codes[num].code_value)
		head report
			x = 0
			detail
				x = x + 1
				stat = alterlist(org_list->qual,x)
				org_list->qual[x].organization_id = l.organization_id
			foot report
				org_list->qual_cnt = x
	    with nocounter, expand = value(exp), time = value(timeOutThreshold)
    endif
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag)
 		call echo(build("------Qual Cnt = ",org_list->qual_cnt))
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
subroutine GetPersonnelList(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetPersonnelList Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	;Set expand control value
	if(size(loc_req->codes,5) > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
;Get prsnl updates
	select ;into "nl:"
  	 if(org_list->qual_cnt > 0)
		from prsnl pr, prsnl_org_reltn por
		plan pr where pr.updt_dt_tm between cnvtdatetime(qFromDateTime) and cnvtdatetime(qToDateTime)
		join por
		where por.person_id = pr.person_id
	    and expand(num,1,org_list->qual_cnt,por.organization_id,org_list->qual[num].organization_id)
		and por.active_ind = 1
		and por.beg_effective_dt_tm <= cnvtdatetime(curdate, curtime3)
		and por.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
		order by  pr.updt_dt_tm , pr.person_id
		with nocounter
	 else
		from prsnl pr
		plan pr where pr.updt_dt_tm between cnvtdatetime(qFromDateTime) and cnvtdatetime(qToDateTime)
		order by pr.updt_dt_tm , pr.person_id
	 endif
	into 'nl:'
		pr.updt_dt_tm , pr.person_id
	head report
		x = 0
		max_reached = 0
		stat = alterlist(person_temp->persons,iMaxRecs)
	head pr.updt_dt_tm
   		if(x > iMaxRecs)
      		max_reached = 1
   		endif
   	head pr.person_id
		count = 0
		if(max_reached = 0)
			x = x + 1
			if(mod(x,100) = 1 and x > iMaxRecs)
			stat = alterlist(person_temp->persons,x + 99)
			endif
			person_temp->persons[x].person_id = pr.person_id
			person_temp->persons[x].updt_dt_tm = pr.updt_dt_tm
			endif
	foot report
		stat = alterlist(person_temp->persons,x)
		person_temp->person_cnt = x
 	with nocounter
 
;Get prsnl_alias updates
	select into 'nl:'
		pa.updt_dt_tm , pa.person_id
	from prsnl_alias pa
	plan pa where pa.updt_dt_tm between cnvtdatetime(qFromDateTime) and cnvtdatetime(qToDateTime)
	order by pa.updt_dt_tm , pa.person_id
	head report
		x = person_temp->person_cnt
		max_reached = 0
		stat = alterlist(person_temp->persons,x + iMaxRecs)
	head pa.updt_dt_tm
   		if(x > iMaxRecs)
      		max_reached = 1
   		endif
   	head pa.person_id
		count = 0
		if(max_reached = 0)
			x = x + 1
			if(mod(x,100) = 1 and x > iMaxRecs)
			stat = alterlist(person_temp->persons,x + 99)
			endif
			person_temp->persons[x].person_id = pa.person_id
			person_temp->persons[x].updt_dt_tm = pa.updt_dt_tm
			endif
	foot report
		stat = alterlist(person_temp->persons,x)
		person_temp->person_cnt = x
 	with nocounter
 
 
;Build the main structure - pop_prsnl_reply_out
	set num = 0
	set pos = 0
    select into "nl:"
     p.updt_dt_tm , p.person_id, p.active_ind, p.end_effective_dt_tm
    from prsnl p, person pr
	plan p
	where expand(num,1,person_temp->person_cnt,p.person_id,person_temp->persons[num].person_id)
    join pr
    where pr.person_id = outerjoin(p.person_id)
	order by p.updt_dt_tm , p.person_id, p.active_ind desc, p.end_effective_dt_tm desc
  	head report
 	 aaCnt = 0
  	 aacnts = 0
	 x = 0
	 max_reached = 0
	 stat = alterlist(pop_prsnl_reply_out->prsnl,iMaxRecs)
	 head p.updt_dt_tm
	   if(x > iMaxRecs)
		 max_reached = 1
	   endif
 	   head p.person_id
 	    pos = 0
 	    count= 0
 	    aaCnts = 0
		if(max_reached = 0)
		    aaCnt = aaCnt + 1
			x = x + 1
			if(mod(x,100) = 1 and x > iMaxRecs)
				stat = alterlist(pop_prsnl_reply_out->prsnl,x + 99)
			endif
		endif
		pos = locateval(num,1,person_temp->person_cnt,p.person_id,person_temp->persons[num].person_id)
		if(max_reached = 0)
		if (aaCnt = 1)
	 		pop_prsnl_reply_out->prsnl[x].created_updated_date_time = p.updt_dt_tm
	 		pop_prsnl_reply_out->prsnl[x].beg_effective_dt_tm = p.beg_effective_dt_tm
	 		pop_prsnl_reply_out->prsnl[x].end_effective_dt_tm  = p.end_effective_dt_tm
  			pop_prsnl_reply_out->prsnl[x].prsnl_id = p.person_id
			pop_prsnl_reply_out->prsnl[x].middle_name = pr.name_middle
			pop_prsnl_reply_out->prsnl[x].display_name= p.name_full_formatted
			pop_prsnl_reply_out->prsnl[x].first_name = p.name_first
			pop_prsnl_reply_out->prsnl[x].last_name = p.name_last
			pop_prsnl_reply_out->prsnl[x].birth_date_time = pr.birth_dt_tm
			pop_prsnl_reply_out->prsnl[x].gender->id  = pr.sex_cd
			pop_prsnl_reply_out->prsnl[x].gender->name  = uar_get_code_display(pr.sex_cd)
			pop_prsnl_reply_out->prsnl[x].username = p.username
			pop_prsnl_reply_out->prsnl[x].activeStatus.id = p.active_status_cd
			pop_prsnl_reply_out->prsnl[x].activeStatus.name = uar_get_code_display(p.active_status_cd)
			if(p.active_ind = 1)
				pop_prsnl_reply_out->prsnl[x]->userstatus = "ACTIVE"
			else
				pop_prsnl_reply_out->prsnl[x]->userstatus = "INACTIVE"
			endif
			pop_prsnl_reply_out->prsnl[x]->position_cd = p.position_cd
			pop_prsnl_reply_out->prsnl[x]->position = uar_get_code_display(p.position_cd)
			if (p.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3))
				pop_prsnl_reply_out->prsnl[x]->account_disabled   = 1
			endif
		else
			aaCnts = aaCnts + 1
			stat = alterlist(pop_prsnl_reply_out->prsnl[x]->AssociatedAccounts,aaCnts)
			pop_prsnl_reply_out->prsnl[x]->AssociatedAccounts[aaCnts]->prsnl_id = p.person_id
			if (p.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3))
				pop_prsnl_reply_out->prsnl[x]->AssociatedAccounts[aaCnts]->account_disabled  = 1
			endif
			pop_prsnl_reply_out->prsnl[x]->AssociatedAccounts[aaCnts]->beg_effective_dt_tm = p.beg_effective_dt_tm
			pop_prsnl_reply_out->prsnl[x]->AssociatedAccounts[aaCnts]->end_effective_dt_tm = p.end_effective_dt_tm
        endif
 
      endif
	foot p.person_id
	  aaCnt = 0
	  aaCnts = 0
 	foot report
 	    stat = alterlist(pop_prsnl_reply_out->prsnl,x)
 		pop_prsnl_reply_out->prsnl_cnt = x
	with nocounter,expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag)
 		call echo(build("------Qual Cnt = ",pop_prsnl_reply_out->prsnl_cnt))
 	endif
 
; Populate audit
	if(pop_prsnl_reply_out->prsnl_cnt > 0)
		call ErrorHandler("EXECUTE", "S", "Success", "Get Pop person completed successfully.", pop_prsnl_reply_out)
	else
		call ErrorHandler("EXECUTE", "Z", "No Data.", "No records qualify.", pop_prsnl_reply_out)
		go to EXIT_SCRIPT
	endif
 
 
 
;get alias
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
  	from prsnl_alias p
  	plan p
  	where expand(num,1,pop_prsnl_reply_out->prsnl_cnt,p.person_id,pop_prsnl_reply_out->prsnl[num].prsnl_id )
	   and p.active_ind = 1
	   and p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
	   and p.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
    order by p.person_id
  	head report
  	  count = 0
  	  pos = 0
  	  head p.person_id
  	    pos = 0
  	    count = 0
		pos = locateval(num,1,pop_prsnl_reply_out->prsnl_cnt,p.person_id,pop_prsnl_reply_out->prsnl[num].prsnl_id )
  		detail
  		  if(p.prsnl_alias_type_cd > 0)
  			count = count + 1
  			stat = alterlist(pop_prsnl_reply_out->prsnl[pos]->prsnl_alias,count)
  			pop_prsnl_reply_out->prsnl[pos]->prsnl_alias[count].alias  = p.alias
			pop_prsnl_reply_out->prsnl[pos]->prsnl_alias[count].person_alias_id  = p.prsnl_alias_type_cd
			pop_prsnl_reply_out->prsnl[pos]->prsnl_alias[count].person_alias_type_disp =
															uar_get_code_display(p.prsnl_alias_type_cd)
		  endif
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
 ;get specialties
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("Getting Race Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
	set count = 0
	set num = 0
	set pop = 0
	set queryStartTm = cnvtdatetime(curdate, curtime3)
 
  	select into "nl:"
  	pr.person_id
	, pg.prsnl_group_type_cd
  	from prsnl pr
  	     ,prsnl_group_reltn pgr
  	     ,prsnl_group pg
  	plan pr
  	where expand(num,1,pop_prsnl_reply_out->prsnl_cnt,pr.person_id,pop_prsnl_reply_out->prsnl[num].prsnl_id )
	join pgr where pgr.person_id = pr.person_id
		and pgr.active_ind = 1
	join pg where pg.prsnl_group_id = pgr.prsnl_group_id
		and pg.active_ind = 1
    order by pr.person_id, pg.prsnl_group_type_cd
  	head report
  	  count = 0
  	  pos = 0
  	  head pr.person_id
  	    pos = 0
  	    count = 0
		pos = locateval(num,1,pop_prsnl_reply_out->prsnl_cnt,pr.person_id,pop_prsnl_reply_out->prsnl[num].prsnl_id )
  		detail
  		  if(pg.prsnl_group_type_cd > 0)
  			count = count + 1
  			stat = alterlist(pop_prsnl_reply_out->prsnl[pos]->specialties,count)
			pop_prsnl_reply_out->prsnl[pos]->specialties[count].id   = pg.prsnl_group_type_cd
			pop_prsnl_reply_out->prsnl[pos]->specialties[count].name  =
															uar_get_code_display(pg.prsnl_group_type_cd)
		  endif
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
;Get address
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
    where expand(num,1,pop_prsnl_reply_out->prsnl_cnt,a.parent_entity_id,pop_prsnl_reply_out->prsnl[num].prsnl_id)
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
  			pos = locateval(num,1,pop_prsnl_reply_out->prsnl_cnt
  				,a.parent_entity_id,pop_prsnl_reply_out->prsnl[num].prsnl_id)
  			count = count + 1
  			stat = alterlist(pop_prsnl_reply_out->prsnl[pos]->Addresses,count)
			pop_prsnl_reply_out->prsnl[pos]->Addresses[count].address_id  = a.address_id
			pop_prsnl_reply_out->prsnl[pos]->Addresses[count].Address_Type_cd = a.address_type_cd
  			pop_prsnl_reply_out->prsnl[pos]->Addresses[count].Address_Type_disp = UAR_GET_CODE_DISPLAY(a.address_type_cd)
			pop_prsnl_reply_out->prsnl[pos]->Addresses[count].sequence_nbr  = a.address_type_seq
			pop_prsnl_reply_out->prsnl[pos]->Addresses[count].end_effective_dt_tm  = a.end_effective_dt_tm
     		pop_prsnl_reply_out->prsnl[pos]->Addresses[count].street_addr = trim(a.street_addr,3)
     		pop_prsnl_reply_out->prsnl[pos]->Addresses[count].street_addr2 = trim(a.street_addr2,3)
 
  			if(a.city_cd > 0)
    			pop_prsnl_reply_out->prsnl[pos]->Addresses[count].city = UAR_GET_CODE_DISPLAY(a.city_cd)
 			else
  				pop_prsnl_reply_out->prsnl[pos]->Addresses[count].City = trim(a.city,3)
  			endif
 
  			if(a.state_cd > 0)
    			pop_prsnl_reply_out->prsnl[pos]->Addresses[count].State_disp = UAR_GET_CODE_DISPLAY(a.state_cd)
  			else
  				pop_prsnl_reply_out->prsnl[pos]->Addresses[count].State_disp = trim(a.state,3)
  			endif
  			pop_prsnl_reply_out->prsnl[pos]->Addresses[count].Zipcode  = trim(a.zipcode,3)
 
			if(a.country_cd > 0)
  				pop_prsnl_reply_out->prsnl[pos]->Addresses[count].Country_cd  = cnvtstring(a.country_cd)
  				pop_prsnl_reply_out->prsnl[pos]->Addresses[count].Country_disp = UAR_GET_CODE_DISPLAY(a.country_cd)
  			else
  				pop_prsnl_reply_out->prsnl[pos]->Addresses[count].Country_disp = trim(a.country,3)
  			endif
 
  			if(a.county_cd > 0)
  				pop_prsnl_reply_out->prsnl[pos]->Addresses[count].county_cd = a.county_cd
  				pop_prsnl_reply_out->prsnl[pos]->Addresses[count].county_disp = UAR_GET_CODE_DISPLAY(a.county_cd)
  			else
  				pop_prsnl_reply_out->prsnl[pos]->Addresses[count].county_disp = trim(a.county,3)
  			endif
 
 
  	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
;keeping track of cumulative time out
set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
;exits the script because query timed out
if(timeOutThreshold < 1)
	go to EXIT_SCRIPT
endif
 
 
;Get phone information
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
    where expand(num,1,pop_prsnl_reply_out->prsnl_cnt,ph.parent_entity_id,pop_prsnl_reply_out->prsnl[num].prsnl_id)
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
  			pos = locateval(num,1,pop_prsnl_reply_out->prsnl_cnt,ph.parent_entity_id,pop_prsnl_reply_out->prsnl[num].prsnl_id)
  			count = count + 1
  			stat = alterlist(pop_prsnl_reply_out->prsnl[pos]->Phones ,count)
  			pop_prsnl_reply_out->prsnl[pos].Phones[count].phone_id = ph.phone_id
  			pop_prsnl_reply_out->prsnl[pos].Phones[count].Extension = trim(ph.extension,3)
  			pop_prsnl_reply_out->prsnl[pos].Phones[count].phone_num = trim(ph.phone_num,3)
  			pop_prsnl_reply_out->prsnl[pos].Phones[count].Phone_type_cd = ph.phone_type_cd
  			pop_prsnl_reply_out->prsnl[pos].Phones[count].phone_type_disp = UAR_GET_CODE_DISPLAY(ph.phone_type_cd)
 			pop_prsnl_reply_out->prsnl[pos].Phones[count].sequence_nbr = ph.phone_type_seq
 			pop_prsnl_reply_out->prsnl[pos].Phones[count].end_effective_dt_tm  = ph.end_effective_dt_tm
 
 
  	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
;get title info
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
   	where expand(num,1,pop_prsnl_reply_out->prsnl_cnt,p.Person_Id ,pop_prsnl_reply_out->prsnl[num].prsnl_id)
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
  		pos = locateval(num,1,pop_prsnl_reply_out->prsnl_cnt,p.Person_Id ,pop_prsnl_reply_out->prsnl[num].prsnl_id )
		pop_prsnl_reply_out->prsnl[pos].title  = trim(p.name_title)
 
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
 
 
	if(iDebugFlag > 0)
		call echo(concat("GetPersonnelList Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end ;end sub
 
 
end go
