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
          Date Written:       08/25/16
          Source file name:   vigilanz_get_location_disc
          Object name:        vigilanz_get_location_disc
          Request #:
          Program purpose:    Returns location hierarchy
          Tables read:
          Tables updated:     NONE
          Executing from:     EMISSARY SERVICES
          Special Notes:	  NONE
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
  000 09/05/16  AAB					Initial write
  001 09/27/16  AAB 				Allow multiple calls to service
  002 10/10/16  AAB 				Add DEBUG_FLAG
  003 07/27/17  JCO					Changed %i to execute; update ErrorHandler2
  004 08/25/17  RJC					Add fac tax_id, fac NPI and fac address
  005 03/21/18	RJC					Added version code and copyright block
  006 06/10/18	RJC					Added username and identifiers (outbound aliases). Added Address to each child structure
  007 06/13/18	RJC					Reverted to original parameter listing to prevent issues with Emissary and CCL version 
  									mismatches
  008 09/09/19 RJC                  Renamed file and object
 ***********************************************************************/
;drop program snsro_get_location_discovery go
drop program vigilanz_get_location_disc go
create program vigilanz_get_location_disc
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Location Code:"  = "0.0"  ;Default to FACILITY if nothing is passed in
		, "Username" = ""
	    , "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, LOCATION, USERNAME, DEBUG_FLAG   ;002
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2" ;005
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record request
record request
( 1 code_set = i4
  1 cdf_meaning = c12
  1 get_all_flag = i2
  1 get_view_flag = i2
  1 get_master_flag = i2
  1 get_facility_flag = i2
  1 skip_loc_group_ind =i2
)
 
 
free record req_child
record req_child
(
  1 location_cd = f8
  1 cdf_meaning = c12
  1 root_loc_cd = f8
  1 get_all_flag = i2
  1 get_master_flag = i2
)
 
 
free record loc_child_reply
record loc_child_reply
(
  1 qual [*]
	2 child_loc_cd = f8
	2 child_loc_disp = vc
	2 child_loc_desc = vc
	2 child_loc_mean = vc
	2 cv_updt_cnt= i2
	2 child_ind= i2
	2 collation_seq= i4
	2 loc_status_ind=i4
	2 loc_active_ind = i4
	2 lg_status_ind=i4
	2 lg_active_ind = i4
	2 lg_updt_cnt = i4
	2 sequence = i4
	2 location_type_mean = vc
	2 data_status_cd = f8
%i cclsource:status_block.inc
)
 
free record loc_child_reply2
record loc_child_reply2
(
  1 qual [*]
	2 child_loc_cd = f8
	2 child_loc_disp = vc
	2 child_loc_desc = vc
	2 child_loc_mean = vc
	2 cv_updt_cnt= i2
	2 child_ind= i2
	2 collation_seq= i4
	2 loc_status_ind=i4
	2 loc_active_ind = i4
	2 lg_status_ind=i4
	2 lg_active_ind = i4
	2 lg_updt_cnt = i4
	2 sequence = i4
	2 location_type_mean = vc
	2 data_status_cd = f8
%i cclsource:status_block.inc
)
 
free record loc_child_reply3
record loc_child_reply3
(
  1 qual [*]
	2 child_loc_cd = f8
	2 child_loc_disp = vc
	2 child_loc_desc = vc
	2 child_loc_mean = vc
	2 cv_updt_cnt= i2
	2 child_ind= i2
	2 collation_seq= i4
	2 loc_status_ind=i4
	2 loc_active_ind = i4
	2 lg_status_ind=i4
	2 lg_active_ind = i4
	2 lg_updt_cnt = i4
	2 sequence = i4
	2 location_type_mean = vc
	2 data_status_cd = f8
%i cclsource:status_block.inc
)
 
 
free record loc_child_reply4
record loc_child_reply4
(
  1 qual [*]
	2 child_loc_cd = f8
	2 child_loc_disp = vc
	2 child_loc_desc = vc
	2 child_loc_mean = vc
	2 cv_updt_cnt= i2
	2 child_ind= i2
	2 collation_seq= i4
	2 loc_status_ind=i4
	2 loc_active_ind = i4
	2 lg_status_ind=i4
	2 lg_active_ind = i4
	2 lg_updt_cnt = i4
	2 sequence = i4
	2 location_type_mean = vc
	2 data_status_cd = f8
%i cclsource:status_block.inc
)
 
 
free record location_discovery_reply
record location_discovery_reply
(
  1 qual [*]
	2 loc_cd =f8
	2 loc_mean =vc
	2 loc_desc=vc
	2 display=vc
	2 active_ind= i2
	2 beg_effective_dt_tm=dq8
	2 end_effective_dt_tm=dq8
	2 status_ind= i2
	2 child_ind= i2
	2 collation_seq= i4
	2 updt_cnt= i4
	2 root_loc_cd=f8
	2 data_status_cd=f8
	2 org_id 							= f8    ;004
    2 org_npi							= vc	;004
    2 org_tax_id						= vc	;004
    2 address
		3  address_id                  = f8
		3  address_type_cd             = f8
		3  address_type_disp           = vc
		3  address_type_mean           = vc
		3  street_addr                 = vc
		3  street_addr2                = vc
		3  city                        = vc
		3  state_cd                    = f8
		3  state_disp                  = vc
		3  state_mean                  = vc
		3  zipcode                     = vc
		3  country_cd				   = f8
		3  country_disp = vc
	2 identifiers[*] 			;006
		3 value = vc
		3 type
			4 id = f8
			4 name = vc
	2 qual [*]
		3 loc_cd = f8
		3 child_loc_disp = vc
		3 loc_desc = vc
		3 loc_mean = vc
		3 cv_updt_cnt= i2
		3 child_ind= i2
		3 collation_seq= i4
		3 loc_status_ind=i4
		3 loc_active_ind = i4
		3 lg_status_ind=i4
		3 lg_active_ind = i4
		3 lg_updt_cnt = i4
		3 sequence = i4
		3 location_type_mean = vc
		3 data_status_cd = f8
		3 address
			4  address_id                  = f8
			4  address_type_cd             = f8
			4  address_type_disp           = vc
			4  address_type_mean           = vc
			4  street_addr                 = vc
			4  street_addr2                = vc
			4  city                        = vc
			4  state_cd                    = f8
			4  state_disp                  = vc
			4  state_mean                  = vc
			4  zipcode                     = vc
			4  country_cd				   = f8
			4  country_disp = vc
		3 identifiers[*] 			;006
			4 value = vc
			4 type
				5 id = f8
				5 name = vc
		3 qual [*]
			4 loc_cd = f8
			4 child_loc_disp = vc
			4 loc_desc = vc
			4 loc_mean = vc
			4 cv_updt_cnt= i2
			4 child_ind= i2
			4 collation_seq= i4
			4 loc_status_ind=i4
			4 loc_active_ind = i4
			4 lg_status_ind=i4
			4 lg_active_ind = i4
			4 lg_updt_cnt = i4
			4 sequence = i4
			4 location_type_mean = vc
			4 data_status_cd = f8
			4 address
				5  address_id                  = f8
				5  address_type_cd             = f8
				5  address_type_disp           = vc
				5  address_type_mean           = vc
				5  street_addr                 = vc
				5  street_addr2                = vc
				5  city                        = vc
				5  state_cd                    = f8
				5  state_disp                  = vc
				5  state_mean                  = vc
				5  zipcode                     = vc
				5  country_cd				   = f8
				5  country_disp = vc
			4 identifiers[*] 			;006
				5 value = vc
				5 type
					6 id = f8
					6 name = vc
			4 qual [*]
				5 loc_cd = f8
				5 child_loc_disp = vc
				5 loc_desc = vc
				5 loc_mean = vc
				5 cv_updt_cnt= i2
				5 child_ind= i2
				5 collation_seq= i4
				5 loc_status_ind=i4
				5 loc_active_ind = i4
				5 lg_status_ind=i4
				5 lg_active_ind = i4
				5 lg_updt_cnt = i4
				5 sequence = i4
				5 location_type_mean = vc
				5 data_status_cd = f8
				5 address
					6  address_id                  = f8
					6  address_type_cd             = f8
					6  address_type_disp           = vc
					6  address_type_mean           = vc
					6  street_addr                 = vc
					6  street_addr2                = vc
					6  city                        = vc
					6  state_cd                    = f8
					6  state_disp                  = vc
					6  state_mean                  = vc
					6  zipcode                     = vc
					6  country_cd				   = f8
					6  country_disp = vc
				5 identifiers[*] 			;006
					6 value = vc
					6 type
						7 id = f8
						7 name = vc
				5 qual [*]
					6 loc_cd = f8
					6 child_loc_disp = vc
					6 loc_desc = vc
					6 loc_mean = vc
					6 cv_updt_cnt= i2
					6 child_ind= i2
					6 collation_seq= i4
					6 loc_status_ind=i4
					6 loc_active_ind = i4
					6 lg_status_ind=i4
					6 lg_active_ind = i4
					6 lg_updt_cnt = i4
					6 sequence = i4
					6 location_type_mean = vc
					6 data_status_cd = f8
					6 address
						7  address_id                  = f8
						7  address_type_cd             = f8
						7  address_type_disp           = vc
						7  address_type_mean           = vc
						7  street_addr                 = vc
						7  street_addr2                = vc
						7  city                        = vc
						7  state_cd                    = f8
						7  state_disp                  = vc
						7  state_mean                  = vc
						7  zipcode                     = vc
						7  country_cd				   = f8
						7  country_disp = vc
					6 identifiers[*] 			;006
						7 value = vc
						7 type
							8 id = f8
							8 name = vc
  1 audit
	2 user_id							= f8
	2 user_firstname					= vc
	2 user_lastname						= vc
	2 patient_id						= f8
	2 patient_firstname					= vc
	2 patient_lastname					= vc
	2 service_version					= vc
;003 %i cclsource:status_block.inc
/*003 begin */
  1 status_data
    2 status = c1
    2 subeventstatus[1]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
      3 Code = c4
      3 Description = vc
/*003 end */
)
 
 
free record location_discovery_reply2
record location_discovery_reply2
(
  1 qual [*]
	2 code_value =f8
	2 cdf_meaning =vc
	2 description=vc
	2 display=vc
	2 active_ind= i2
	2 beg_effective_dt_tm=dq8
	2 end_effective_dt_tm=dq8
	2 status_ind= i2
	2 child_ind= i2
	2 collation_seq= i4
	2 updt_cnt= i4
	2 root_loc_cd=f8
	2 data_status_cd=f8
	2 identifiers[*] 			;006
		3 value = vc
		3 type
			4 id = f8
			4 name = vc
;003 %i cclsource:status_block.inc
/*003 begin */
  1 status_data
    2 status = c1
    2 subeventstatus[1]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
      3 Code = c4
      3 Description = vc
/*003 end */
)
set location_discovery_reply->status_data->status = "F"
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
declare APPLICATION_NUMBER 		= i4 with protect, constant (13000)
declare TASK_NUMBER 			= i4 with protect, constant (13000)
declare REQ_NUM_GRP 			= i4 with protect, constant (13016)
declare REQ_NUM_CHLD 			= i4 with protect, constant (13013)
declare hMessage 				= i4 with protect, noconstant(0)
declare hRequest 				= i4 with protect, noconstant(0)
declare hReply 					= i4 with protect, noconstant(0)
declare dLocationCd				= f8 with protect, noconstant(0.0)
declare iMaxRec 				= i4 with protect, noconstant(0)
declare sUserName				= vc with protect, noconstant("")
declare iRet					= i2 with protect, noconstant(0)
declare section_startDtTm		= dq8 with protect, constant(cnvtdatetime(curdate,curtime3))
declare idebugFlag				= i2 with protect, noconstant(0) ;002
declare c_npi_org_alias_type_cd	= f8 with protect, constant(uar_get_code_by("MEANING",334,"NPI"))
declare c_business_address_type_cd = f8 with protect, constant(uar_get_code_by("MEANING",212,"BUSINESS"))
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
set dLocationCd 	= cnvtreal($LOCATION)
set sUserName 		= trim($USERNAME,3)
set idebugFlag		= cnvtint($DEBUG_FLAG)  ;002
 
if(idebugFlag > 0)
	call echo(build("sUserName -->",(sUserName)))
	call echo(build("dLocationCd -->",(dLocationCd)))
endif
 
/****************************************************************************
;INCLUDES
****************************************************************************/
;003 %i ccluserdir:snsro_common.inc
execute snsro_common 	;003
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetLocations(null)			= null with protect
declare GetLocation(null)			= null with protect
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
set iRet = PopulateAudit(sUserName, 0.0, location_discovery_reply, sVersion)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "LOCATION DISCOVERY", "Invalid User for Audit.",
	"1001", build("UserId is invalid: ", sUserName), location_discovery_reply)	;003
	go to exit_script
endif
 
if(dLocationCd > 0.0)
	call GetLocation(null)
else
	call GetLocations(null)
endif
 
call ErrorHandler("EXECUTE", "S", "LOCATION DISCOVERY", "Success retrieving locations.", location_discovery_reply )
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(location_discovery_reply)
if(idebugFlag > 0)
 	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_location_discovery.json")
	call echo(build2("_file : ", _file))
	call echojson(location_discovery_reply, _file, 0)
	call echorecord(location_discovery_reply)
	call echo(JSONout)
endif
 
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: subroutine GetLocations(null)
;  Description: Subroutine to return Locations
**************************************************************************/
subroutine GetLocations(null)
	if(idebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetLocations Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set request->cdf_meaning = "FACILITY"
	set request->code_set = 220
 
	if(idebugFlag > 0)
		call echo(build("Location --->", request->cdf_meaning))
	endif
 
	set stat = tdbexecute(APPLICATION_NUMBER, TASK_NUMBER, REQ_NUM_GRP,"REC",request,"REC",location_discovery_reply2)
 
	for(f = 1 to  size(location_discovery_reply2->qual,5))
		set stat = alterlist(location_discovery_reply->qual, f)
		set location_discovery_reply->qual[f]->loc_cd = location_discovery_reply2->qual[f]->code_value
		set location_discovery_reply->qual[f]->loc_mean =  trim(location_discovery_reply2->qual[f]->CDF_MEANING,3)
		set location_discovery_reply->qual[f]->loc_desc =  trim(location_discovery_reply2->qual[f]->DESCRIPTION,3)
 
		; 004
		; Org Tax ID
		select into "nl:"
		from location l
		, organization o
		plan l where l.location_cd = location_discovery_reply->qual[f]->loc_cd
		join o where o.organization_id = l.organization_id
		detail
			location_discovery_reply->qual[f].org_id = l.organization_id
			location_discovery_reply->qual[f].org_tax_id = o.federal_tax_id_nbr
		with nocounter
 
		; Get NPI
		select into "nl:"
		from organization_alias oa
		where oa.organization_id = location_discovery_reply->qual[f].org_id
			and oa.org_alias_type_cd = c_npi_org_alias_type_cd
		detail
			location_discovery_reply->qual[f].org_npi = oa.alias
		with nocounter
 
		; Get Address
		select into "nl:"
		from address a
		where a.parent_entity_name = "LOCATION"
			 and a.parent_entity_id = location_discovery_reply->qual[f].loc_cd
			 and a.address_type_cd = c_business_address_type_cd
		detail
			location_discovery_reply->qual[f].address.address_id = a.address_id
			location_discovery_reply->qual[f].address.address_type_cd = a.address_type_cd
			location_discovery_reply->qual[f].address.address_type_disp = uar_get_code_display(a.address_type_cd)
			location_discovery_reply->qual[f].address.street_addr = a.street_addr
			location_discovery_reply->qual[f].address.street_addr2 = a.street_addr2
			location_discovery_reply->qual[f].address.city = a.city
			location_discovery_reply->qual[f].address.state_cd = a.state_cd
			if(a.state_cd > 0)
				location_discovery_reply->qual[f].address.state_disp = uar_get_code_display(a.state_cd)
			else
				location_discovery_reply->qual[f].address.state_disp = a.state
			endif
			location_discovery_reply->qual[f].address.zipcode = a.zipcode
			if(a.country_cd > 0)
				location_discovery_reply->qual[f].address.country_cd = a.country_cd
				location_discovery_reply->qual[f].address.country_disp = uar_get_code_display(a.country_cd)
			else
				location_discovery_reply->qual[f].address.country_disp = a.country
			endif
 
		with nocounter
 
		; End 004
 
		;Get Identifiers (outbound aliases) - 006
		select into "nl:"
		from code_value_outbound cvo
		where cvo.code_set = 220
			and cvo.code_value = location_discovery_reply->qual[f].loc_cd
		head report
			i = 0
		detail
			i = i + 1
			stat = alterlist(location_discovery_reply->qual[f].identifiers,i)
 
			location_discovery_reply->qual[f].identifiers[i].value = cvo.alias
			location_discovery_reply->qual[f].identifiers[i].type.id = cvo.contributor_source_cd
			location_discovery_reply->qual[f].identifiers[i].type.name = uar_get_code_display(cvo.contributor_source_cd)
		with nocounter
	endfor
 
	if(idebugFlag > 0)
		call echo(concat("GetLocations Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
end ;End Sub
 
/*************************************************************************
;  Name: subroutine GetLocation(null)
;  Description: Subroutine to return a specific Location and everything below it
**************************************************************************/
subroutine GetLocation(null)
	if(idebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetLocation Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set req_child->location_cd = dLocationCd
	set req_child->cdf_meaning = uar_get_code_meaning(dLocationCd)
 
	if(idebugFlag > 0)
		call echo(build(" LOC CD -->", req_child->location_cd))
		call echo(build(" LOC MEAN -->", req_child->cdf_meaning))
	endif
 
	set stat = alterlist(location_discovery_reply->qual,1)
 
	set location_discovery_reply->qual[1]->loc_cd = req_child->location_cd
	set location_discovery_reply->qual[1]->loc_mean = req_child->cdf_meaning
	set location_discovery_reply->qual[1]->loc_desc = uar_get_code_description(req_child->location_cd)
 
	if(req_child->cdf_meaning = "FACILITY")
		; Org Tax ID
		select into "nl:"
		from location l
		, organization o
		plan l where l.location_cd = location_discovery_reply->qual[1]->loc_cd
		join o where o.organization_id = l.organization_id
		detail
			location_discovery_reply->qual[1].org_id = l.organization_id
			location_discovery_reply->qual[1].org_tax_id = o.federal_tax_id_nbr
		with nocounter
 
		; Get NPI
		select into "nl:"
		from organization_alias oa
		where oa.organization_id = location_discovery_reply->qual[1].org_id
			and oa.org_alias_type_cd = c_npi_org_alias_type_cd
		detail
			location_discovery_reply->qual[1].org_npi = oa.alias
		with nocounter
	endif
 
	; Get Address
		select into "nl:"
		from address a
		where a.parent_entity_name = "LOCATION"
			 and a.parent_entity_id = location_discovery_reply->qual[1].loc_cd
			 and a.address_type_cd = c_business_address_type_cd
		detail
			location_discovery_reply->qual[1].address.address_id = a.address_id
			location_discovery_reply->qual[1].address.address_type_cd = a.address_type_cd
			location_discovery_reply->qual[1].address.address_type_disp = uar_get_code_display(a.address_type_cd)
			location_discovery_reply->qual[1].address.street_addr = a.street_addr
			location_discovery_reply->qual[1].address.street_addr2 = a.street_addr2
			location_discovery_reply->qual[1].address.city = a.city
			location_discovery_reply->qual[1].address.state_cd = a.state_cd
			location_discovery_reply->qual[1].address.zipcode = a.zipcode
			if(a.state_cd > 0)
				location_discovery_reply->qual[1].address.state_disp = uar_get_code_display(a.state_cd)
			else
				location_discovery_reply->qual[1].address.state_disp = a.state
			endif
			if(a.country_cd > 0)
				location_discovery_reply->qual[1].address.country_cd = a.country_cd
				location_discovery_reply->qual[1].address.country_disp = uar_get_code_display(a.country_cd)
			else
				location_discovery_reply->qual[1].address.country_disp = a.country
			endif
		with nocounter
 
	;Get Identifiers (outbound aliases) - 006
		select into "nl:"
		from code_value_outbound cvo
		where cvo.code_set = 220
			and cvo.code_value = location_discovery_reply->qual[1].loc_cd
		head report
			i = 0
		detail
			i = i + 1
			stat = alterlist(location_discovery_reply->qual[1].identifiers,i)
 
			location_discovery_reply->qual[1].identifiers[i].value = cvo.alias
			location_discovery_reply->qual[1].identifiers[i].type.id = cvo.contributor_source_cd
			location_discovery_reply->qual[1].identifiers[i].type.name = uar_get_code_display(cvo.contributor_source_cd)
		with nocounter
 
	set stat = tdbexecute(APPLICATION_NUMBER, TASK_NUMBER, REQ_NUM_CHLD,"REC",req_child,"REC",loc_child_reply)
 
	for(y = 1 to size(loc_child_reply->qual,5))
 
		set stat = alterlist(location_discovery_reply->qual[1]->qual,y)
 
		set location_discovery_reply->qual[1]->qual[y]->loc_cd  = loc_child_reply->qual[y]->child_loc_cd
		set location_discovery_reply->qual[1]->qual[y]->child_loc_disp = loc_child_reply->qual[y]->child_loc_disp
		set location_discovery_reply->qual[1]->qual[y]->loc_desc = loc_child_reply->qual[y]->child_loc_desc
		set location_discovery_reply->qual[1]->qual[y]->loc_mean     = loc_child_reply->qual[y]->child_loc_mean
		set location_discovery_reply->qual[1]->qual[y]->cv_updt_cnt  = loc_child_reply->qual[y]->cv_updt_cnt
		set location_discovery_reply->qual[1]->qual[y]->child_ind = loc_child_reply->qual[y]->child_ind
		set location_discovery_reply->qual[1]->qual[y]->collation_seq = loc_child_reply->qual[y]->collation_seq
		set location_discovery_reply->qual[1]->qual[y]->loc_status_ind	= loc_child_reply->qual[y]->loc_status_ind
		set location_discovery_reply->qual[1]->qual[y]->loc_active_ind	= loc_child_reply->qual[y]->loc_active_ind
		set location_discovery_reply->qual[1]->qual[y]->lg_status_ind	= loc_child_reply->qual[y]->lg_status_ind
		set location_discovery_reply->qual[1]->qual[y]->lg_active_ind	= loc_child_reply->qual[y]->lg_active_ind
		set location_discovery_reply->qual[1]->qual[y]->lg_updt_cnt	= loc_child_reply->qual[y]->lg_updt_cnt
		set location_discovery_reply->qual[1]->qual[y]->sequence	= loc_child_reply->qual[y]->sequence
		set location_discovery_reply->qual[1]->qual[y]->location_type_mean = loc_child_reply->qual[y]->location_type_mean
		set location_discovery_reply->qual[1]->qual[y]->data_status_cd = loc_child_reply->qual[y]->data_status_cd
 
		; Get Address
		select into "nl:"
		from address a
		where a.parent_entity_name = "LOCATION"
			 and a.parent_entity_id = location_discovery_reply->qual[1]->qual[y].loc_cd
			 and a.address_type_cd = c_business_address_type_cd
		detail
			location_discovery_reply->qual[1]->qual[y].address.address_id = a.address_id
			location_discovery_reply->qual[1]->qual[y].address.address_type_cd = a.address_type_cd
			location_discovery_reply->qual[1]->qual[y].address.address_type_disp = uar_get_code_display(a.address_type_cd)
			location_discovery_reply->qual[1]->qual[y].address.street_addr = a.street_addr
			location_discovery_reply->qual[1]->qual[y].address.street_addr2 = a.street_addr2
			location_discovery_reply->qual[1]->qual[y].address.city = a.city
			location_discovery_reply->qual[1]->qual[y].address.state_cd = a.state_cd
			location_discovery_reply->qual[1]->qual[y].address.zipcode = a.zipcode
			if(a.state_cd > 0)
				location_discovery_reply->qual[1]->qual[y].address.state_disp = uar_get_code_display(a.state_cd)
			else
				location_discovery_reply->qual[1]->qual[y].address.state_disp = a.state
			endif
			if(a.country_cd > 0)
				location_discovery_reply->qual[1]->qual[y].address.country_cd = a.country_cd
				location_discovery_reply->qual[1]->qual[y].address.country_disp = uar_get_code_display(a.country_cd)
			else
				location_discovery_reply->qual[1]->qual[y].address.country_disp = a.country
			endif
		with nocounter
 
		;Get Identifiers (outbound aliases) - 006
		select into "nl:"
		from code_value_outbound cvo
		where cvo.code_set = 220
			and cvo.code_value = location_discovery_reply->qual[1]->qual[y].loc_cd
		head report
			i1 = 0
		detail
			i1 = i1 + 1
			stat = alterlist(location_discovery_reply->qual[1]->qual[y].identifiers,i1)
 
			location_discovery_reply->qual[1]->qual[y].identifiers[i1].value = cvo.alias
			location_discovery_reply->qual[1]->qual[y].identifiers[i1].type.id = cvo.contributor_source_cd
			location_discovery_reply->qual[1]->qual[y].identifiers[i1].type.name = uar_get_code_display(cvo.contributor_source_cd)
		with nocounter
 
 
		set req_child->location_cd = loc_child_reply->qual[y]->child_loc_cd
		set req_child->cdf_meaning = loc_child_reply->qual[y]->child_loc_mean
 
 
		free record loc_child_reply2
		set stat = tdbexecute(APPLICATION_NUMBER, TASK_NUMBER, REQ_NUM_CHLD,"REC",req_child,"REC",loc_child_reply2)
 
		for(k = 1 to size(loc_child_reply2->qual,5))
 
			set stat = alterlist(location_discovery_reply->qual[1]->qual[y]->qual,k)
 
			set location_discovery_reply->qual[1]->qual[y]->qual[k]->loc_cd  = loc_child_reply2->qual[k]->child_loc_cd
			set location_discovery_reply->qual[1]->qual[y]->qual[k]->child_loc_disp = loc_child_reply2->qual[k]->child_loc_disp
			set location_discovery_reply->qual[1]->qual[y]->qual[k]->loc_desc = loc_child_reply2->qual[k]->child_loc_desc
			set location_discovery_reply->qual[1]->qual[y]->qual[k]->loc_mean     = loc_child_reply2->qual[k]->child_loc_mean
			set location_discovery_reply->qual[1]->qual[y]->qual[k]->cv_updt_cnt  = loc_child_reply2->qual[k]->cv_updt_cnt
			set location_discovery_reply->qual[1]->qual[y]->qual[k]->child_ind = loc_child_reply2->qual[k]->child_ind
			set location_discovery_reply->qual[1]->qual[y]->qual[k]->collation_seq = loc_child_reply2->qual[k]->collation_seq
			set location_discovery_reply->qual[1]->qual[y]->qual[k]->loc_status_ind	= loc_child_reply2->qual[k]->loc_status_ind
			set location_discovery_reply->qual[1]->qual[y]->qual[k]->loc_active_ind	= loc_child_reply2->qual[k]->loc_active_ind
			set location_discovery_reply->qual[1]->qual[y]->qual[k]->lg_status_ind	= loc_child_reply2->qual[k]->lg_status_ind
			set location_discovery_reply->qual[1]->qual[y]->qual[k]->lg_active_ind	= loc_child_reply2->qual[k]->lg_active_ind
			set location_discovery_reply->qual[1]->qual[y]->qual[k]->sequence	= loc_child_reply2->qual[k]->sequence
			set location_discovery_reply->qual[1]->qual[y]->qual[k]->location_type_mean = loc_child_reply2->qual[k]->location_type_mean
			set location_discovery_reply->qual[1]->qual[y]->qual[k]->data_status_cd = loc_child_reply2->qual[k]->data_status_cd
 
 			; Get Address
			select into "nl:"
			from address a
			where a.parent_entity_name = "LOCATION"
				 and a.parent_entity_id = location_discovery_reply->qual[1]->qual[y]->qual[k].loc_cd
				 and a.address_type_cd = c_business_address_type_cd
			detail
				location_discovery_reply->qual[1]->qual[y]->qual[k].address.address_id = a.address_id
				location_discovery_reply->qual[1]->qual[y]->qual[k].address.address_type_cd = a.address_type_cd
				location_discovery_reply->qual[1]->qual[y]->qual[k].address.address_type_disp = uar_get_code_display(a.address_type_cd)
				location_discovery_reply->qual[1]->qual[y]->qual[k].address.street_addr = a.street_addr
				location_discovery_reply->qual[1]->qual[y]->qual[k].address.street_addr2 = a.street_addr2
				location_discovery_reply->qual[1]->qual[y]->qual[k].address.city = a.city
				location_discovery_reply->qual[1]->qual[y]->qual[k].address.state_cd = a.state_cd
				location_discovery_reply->qual[1]->qual[y]->qual[k].address.zipcode = a.zipcode
				if(a.state_cd > 0)
					location_discovery_reply->qual[1]->qual[y]->qual[k].address.state_disp = uar_get_code_display(a.state_cd)
				else
					location_discovery_reply->qual[1]->qual[y]->qual[k].address.state_disp = a.state
				endif
				if(a.country_cd > 0)
					location_discovery_reply->qual[1]->qual[y]->qual[k].address.country_cd = a.country_cd
					location_discovery_reply->qual[1]->qual[y]->qual[k].address.country_disp = uar_get_code_display(a.country_cd)
				else
					location_discovery_reply->qual[1]->qual[y]->qual[k].address.country_disp = a.country
				endif
			with nocounter
 
 			;Get Identifiers (outbound aliases) - 006
			select into "nl:"
			from code_value_outbound cvo
			where cvo.code_set = 220
				and cvo.code_value = location_discovery_reply->qual[1]->qual[y]->qual[k].loc_cd
			head report
				i2 = 0
			detail
				i2 = i2 + 1
				stat = alterlist(location_discovery_reply->qual[1]->qual[y]->qual[k].identifiers,i2)
 
				location_discovery_reply->qual[1]->qual[y]->qual[k].identifiers[i2].value = cvo.alias
				location_discovery_reply->qual[1]->qual[y]->qual[k].identifiers[i2].type.id = cvo.contributor_source_cd
				location_discovery_reply->qual[1]->qual[y]->qual[k].identifiers[i2].type.name = uar_get_code_display(cvo.contributor_source_cd)
			with nocounter
 
 			if(loc_child_reply2->qual[k]->child_loc_mean = "NURSEUNIT")
 
 
 				set req_child->location_cd = loc_child_reply2->qual[k]->child_loc_cd
				set req_child->cdf_meaning = loc_child_reply2->qual[k]->child_loc_mean
 
				free record loc_child_reply3
 				set stat = tdbexecute(APPLICATION_NUMBER, TASK_NUMBER, REQ_NUM_CHLD,"REC",req_child,"REC",loc_child_reply3)
 
 
 				for(n = 1 to size(loc_child_reply3->qual,5))
 
					set stat = alterlist(location_discovery_reply->qual[1]->qual[y]->qual[k]->qual, n)
					set location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->loc_cd  = loc_child_reply3->qual[n]->child_loc_cd
					set location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->child_loc_disp = loc_child_reply3->qual[n]->child_loc_disp
					set location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->loc_desc = loc_child_reply3->qual[n]->child_loc_desc
					set location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->loc_mean     = loc_child_reply3->qual[n]->child_loc_mean
					set location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->cv_updt_cnt  = loc_child_reply3->qual[n]->cv_updt_cnt
					set location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->child_ind = loc_child_reply3->qual[n]->child_ind
					set location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->collation_seq = loc_child_reply3->qual[n]->collation_seq
					set location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->loc_status_ind	= loc_child_reply3->qual[n]->loc_status_ind
					set location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->loc_active_ind	= loc_child_reply3->qual[n]->loc_active_ind
					set location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->lg_status_ind	= loc_child_reply3->qual[n]->lg_status_ind
					set location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->lg_active_ind	= loc_child_reply3->qual[n]->lg_active_ind
					set location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->sequence	= loc_child_reply3->qual[n]->sequence
					set location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->location_type_mean =
						loc_child_reply3->qual[n]->location_type_mean
					set location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->data_status_cd = loc_child_reply3->qual[n]->data_status_cd
 
					; Get Address
					select into "nl:"
					from address a
					where a.parent_entity_name = "LOCATION"
						 and a.parent_entity_id = location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n].loc_cd
						 and a.address_type_cd = c_business_address_type_cd
					detail
						location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n].address.address_id = a.address_id
						location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n].address.address_type_cd = a.address_type_cd
						location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n].address.address_type_disp =
						uar_get_code_display(a.address_type_cd)
						location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n].address.street_addr = a.street_addr
						location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n].address.street_addr2 = a.street_addr2
						location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n].address.city = a.city
						location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n].address.state_cd = a.state_cd
						location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n].address.zipcode = a.zipcode
						if(a.state_cd > 0)
							location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n].address.state_disp = uar_get_code_display(a.state_cd)
						else
							location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n].address.state_disp = a.state
						endif
						if(a.country_cd > 0)
							location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n].address.country_cd = a.country_cd
							location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n].address.country_disp = uar_get_code_display(a.country_cd)
						else
							location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n].address.country_disp = a.country
						endif
					with nocounter
 
					;Get Identifiers (outbound aliases) - 006
					select into "nl:"
					from code_value_outbound cvo
					where cvo.code_set = 220
						and cvo.code_value = location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n].loc_cd
					head report
						i3 = 0
					detail
						i3 = i3 + 1
						stat = alterlist(location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n].identifiers,i3)
 
						location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n].identifiers[i3].value = cvo.alias
						location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n].identifiers[i3].type.id = cvo.contributor_source_cd
						location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n].identifiers[i3].type.name =
						uar_get_code_display(cvo.contributor_source_cd)
					with nocounter
 
 
 					if(loc_child_reply3->qual[n]->child_loc_mean = "ROOM")
		 				;call echo(build(" CHILD CD -->", loc_child_reply3->qual[n]->child_loc_cd))
						;call echo(build(" CHILD MEAN -->", loc_child_reply3->qual[n]->child_loc_mean))
		 				set req_child->location_cd = loc_child_reply3->qual[n]->child_loc_cd
						set req_child->cdf_meaning = loc_child_reply3->qual[n]->child_loc_mean
 
						free record loc_child_reply4
		 				set stat = tdbexecute(APPLICATION_NUMBER, TASK_NUMBER, REQ_NUM_CHLD,"REC",req_child,"REC",loc_child_reply4)
 
 						for(b = 1 to size(loc_child_reply4->qual,5))
 
							set stat = alterlist(location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->qual, b)
							set location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->qual[b]->loc_cd  = loc_child_reply4->qual[b]->child_loc_cd
							set location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->qual[b]->child_loc_disp =
								loc_child_reply4->qual[b]->child_loc_disp
							set location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->qual[b]->loc_desc =
								loc_child_reply4->qual[b]->child_loc_desc
							set location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->qual[b]->loc_mean     =
								loc_child_reply4->qual[b]->child_loc_mean
							set location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->qual[b]->cv_updt_cnt  =
								loc_child_reply4->qual[b]->cv_updt_cnt
							set location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->qual[b]->child_ind =
								loc_child_reply4->qual[b]->child_ind
							set location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->qual[b]->collation_seq =
								loc_child_reply4->qual[b]->collation_seq
							set location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->qual[b]->loc_status_ind	=
								loc_child_reply4->qual[b]->loc_status_ind
							set location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->qual[b]->loc_active_ind	=
								loc_child_reply4->qual[b]->loc_active_ind
							set location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->qual[b]->lg_status_ind	=
								loc_child_reply4->qual[b]->lg_status_ind
							set location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->qual[b]->lg_active_ind	=
								loc_child_reply4->qual[b]->lg_active_ind
							set location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->qual[b]->sequence	= loc_child_reply4->qual[b]->sequence
							set location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->qual[b]->location_type_mean =
								loc_child_reply4->qual[b]->location_type_mean
							set location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->qual[b]->data_status_cd =
								loc_child_reply4->qual[b]->data_status_cd
 
							; Get Address
							select into "nl:"
							from address a
							where a.parent_entity_name = "LOCATION"
								 and a.parent_entity_id = location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->qual[b].loc_cd
								 and a.address_type_cd = c_business_address_type_cd
							detail
								location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->qual[b].address.address_id = a.address_id
								location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->qual[b].address.address_type_cd = a.address_type_cd
								location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->qual[b].address.address_type_disp =
								uar_get_code_display(a.address_type_cd)
								location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->qual[b].address.street_addr = a.street_addr
								location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->qual[b].address.street_addr2 = a.street_addr2
								location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->qual[b].address.city = a.city
								location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->qual[b].address.state_cd = a.state_cd
								location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->qual[b].address.zipcode = a.zipcode
								if(a.state_cd > 0)
									location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->qual[b].address.state_disp = uar_get_code_display(a.state_cd)
								else
									location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->qual[b].address.state_disp = a.state
								endif
								if(a.country_cd > 0)
									location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->qual[b].address.country_cd = a.country_cd
									location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->qual[b].address.country_disp =
									uar_get_code_display(a.country_cd)
								else
									location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->qual[b].address.country_disp = a.country
								endif
							with nocounter
 
							;Get Identifiers (outbound aliases) - 006
							select into "nl:"
							from code_value_outbound cvo
							where cvo.code_set = 220
								and cvo.code_value = location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->qual[b].loc_cd
							head report
								i4 = 0
							detail
								i4 = i4 + 1
								stat = alterlist(location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->qual[b].identifiers,i4)
 
								location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->qual[b].identifiers[i4].value = cvo.alias
								location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->qual[b].identifiers[i4].type.id = cvo.contributor_source_cd
								location_discovery_reply->qual[1]->qual[y]->qual[k]->qual[n]->qual[b].identifiers[i4].type.name =
								uar_get_code_display(cvo.contributor_source_cd)
							with nocounter
 
 						endfor
 					endif
 				endfor
 			endif
		endfor
	endfor
 
	if(idebugFlag > 0)
		call echo(concat("GetLocation Runtime: ",
	                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	                 " seconds"))
	endif
end
 
end go
