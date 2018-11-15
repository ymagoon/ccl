/*~BB~************************************************************************
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
   ~BE~***********************************************************************/
  /****************************************************************************
      Source file name:     snsro_get_provider_demog.prg
      Object name:          snsro_get_provider_demog
      Program purpose:      Retrieves provider demographics based on person_id
      Tables read:			PRSNL, PERSON, PRSNL_ALIAS, ADDRESS, PHONE, CREDENTIAL
      Services: 			NONE
      Tables updated:       NONE
      Executing from:       Emissary Service
      Special Notes:
******************************************************************************/
/***********************************************************************
  *                   MODIFICATION CONTROL LOG                       *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
  000 08/23/17 RJC                	Initial write
  001 12/15/17 DJP					Add Doc DEA
  002 03/22/18 RJC					Added version code and copyright block
***********************************************************************/
drop program snsro_get_provider_demog go
create program snsro_get_provider_demog
 
prompt
  "Output to File/Printer/MINE" = "MINE"
    ,"Person ID" = 0.0
	,"User Name" = ""
	,"Debug Flag" = 0
 
 
with OUTDEV, PERSON_ID, USERNAME, DEBUG_FLAG

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
free record prsnl_reply_out
record prsnl_reply_out (
	1 person_id 					= f8
	1 prsnl_type_cd 				= f8
	1 prsnl_type_disp 				= vc
	1 email 						= vc
	1 physician_ind 				= i2
	1 position_cd 					= f8
	1 position_disp 				= vc
	1 username 						= c50
	1 prim_assign_loc_cd 			= f8
	1 prim_assign_loc_disp 			= vc
	1 external_ind 					= i2
	1 name_full_formatted		 	= vc
	1 birth_dt_tm 					= dq8
	1 sex 							= vc
	1 tax_id 						= vc
	1 npi							= vc
	1 dea							= vc
	/*1 npi_info
		2 prov_name 				= vc
		2 prov_gender 				= vc
		2 license 					= vc
		2 NPI 						= vc
		2 entity_type 				= vc
		2 enumeration_date 			= vc
		2 last_update_date 			= vc
		2 business_address
			3 street_addr			= vc
			3 city 					= vc
			3 state 				= vc
			3 zip 					= vc
			3 phone 				= vc
			3 fax 					= vc
		2 practice_address
			3 street_addr 			= vc
			3 city 					= vc
			3 state 				= vc
			3 zip 					= vc
			3 phone 				= vc
			3 fax 					= vc
		2 taxonomy
			3 primary 				= vc
			3 secondary 			= vc
			3 state 				= vc */
	1  address[*]
		2  address_id                  = f8
		2  address_type_cd             = f8
		2  address_type_disp           = vc
		2  address_type_mean           = vc
		2  street_addr                 = vc
		2  street_addr2                = vc
		2  city                        = vc
		2  state_cd                    = f8
		2  state_disp                  = vc
		2  state_mean                  = vc
		2  zipcode                     = vc
	1  phones[*]
		2  phone_id                    = f8
		2  phone_type_cd               = f8
		2  phone_type_disp             = vc
		2  phone_type_mean             = vc
		2  phone_num                   = vc
		2	sequence_nbr			   = i2
	1 credentials[*]
		2 credential_id 				= f8
		2 credential_cd 				= f8
		2 credential_disp 				= vc
		2 credential_type_cd			= f8
		2 credential_type_disp 			= vc
		2 display_seq 					= i4
		2 id_number 					= vc
		2 state_cd 						= f8
		2 state_disp 					= vc
		2 renewal_dt_tm 				= dq8
	1 audit
		2 user_id						= f8
		2 user_firstname				= vc
		2 user_lastname					= vc
		2 patient_id					= f8
		2 patient_firstname				= vc
		2 patient_lastname				= vc
		2 service_version				= vc
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
 
set prsnl_reply_out->status_data->status = "F"
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
declare dPersonID  			= f8 with protect, noconstant(0.0)
declare sUserName			= vc with protect, noconstant("")
declare iRet				= i2 with protect, noconstant(0)
declare idebugFlag			= i2 with protect, noconstant(0)
declare dNPI				= f8 with protect, constant(uar_get_code_by("MEANING",320,"NPI"))
declare dTaxID				= f8 with protect, constant(uar_get_code_by("MEANING",320,"TAXID"))
declare dDEA				= f8 with protect, constant(uar_get_code_by("MEANING",320,"DOCDEA"));001
/*************************************************************************
;INITIALIZE
**************************************************************************/
set dPersonID = cnvtreal($PERSON_ID)
set sUserName = trim($USERNAME, 3)
set idebugFlag = cnvtint($DEBUG_FLAG)
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetPrsnlDemographics(null)	= null with protect
declare GetNPIdetails(npi = vc) = null with protect
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
if(dPersonID > 0.0)
	set iRet = PopulateAudit(sUserName, dPersonID, prsnl_reply_out, sVersion)   ;020   ;016
	if(iRet = 0)
		call ErrorHandler2("VALIDATE", "F", "PRSNL DEMOGRAPHICS", "Invalid User for Audit.",
		"1001", build("UserId is invalid: ", sUserName), prsnl_reply_out)	;023
		go to EXIT_SCRIPT
	endif
 
	call GetPrsnlDemographics(null)
	;if(prsnl_reply_out->npi_info[1].NPI != "")
	;	call GetNPIdetails(prsnl_reply_out->npi_info.NPI)
	;endif
 
	call ErrorHandler("EXECUTE", "S", "PRSNL DEMOGRAPHICS",
	"Person Demographics retrieved successfully.", prsnl_reply_out)
 
else
	call ErrorHandler2("VALIDATE", "F", "PRSNL DEMOGRAPHICS", "Missing required field: Person ID.",
	"2055", "Missing required field: PatientId", prsnl_reply_out)	;023
	go to EXIT_SCRIPT
endif
 
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(prsnl_reply_out)
 
if(idebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_provider_demog.json")
	call echo(build2("_file : ", _file))
	call echojson(prsnl_reply_out, _file, 0)
 
	call echo(JSONout)
	call echorecord(prsnl_reply_out)
 
endif
 
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: GetPrsnlDemographics
;  Description: Retrieve Prsnl information by person_id
**************************************************************************/
subroutine GetPrsnlDemographics(null)
	if(idebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetPrsnlDemographics Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	; Retrieve Prsnl
	select into "nl:"
	from prsnl pr
		,person p
	plan pr where pr.person_id = dPersonID
	   	and pr.active_ind = 1
   		and pr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
   		and pr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
   	join p where p.person_id = pr.person_id
	detail
		prsnl_reply_out->person_id = pr.person_id
		prsnl_reply_out->prsnl_type_cd = pr.prsnl_type_cd
		prsnl_reply_out->prsnl_type_disp = uar_get_code_display(pr.prsnl_type_cd)
		prsnl_reply_out->email = pr.email
		prsnl_reply_out->physician_ind = pr.physician_ind
		prsnl_reply_out->position_cd = pr.position_cd
		prsnl_reply_out->position_disp = uar_get_code_display(pr.position_cd)
		prsnl_reply_out->username = pr.username
		prsnl_reply_out->prim_assign_loc_cd = pr.prim_assign_loc_cd
		prsnl_reply_out->prim_assign_loc_disp = uar_get_code_display(pr.prim_assign_loc_cd)
		prsnl_reply_out->external_ind = pr.external_ind
		prsnl_reply_out->name_full_formatted = trim(p.name_full_formatted,3)
		prsnl_reply_out->birth_dt_tm = p.birth_dt_tm
		prsnl_reply_out->sex = uar_get_code_display(p.sex_cd)
	with nocounter
 
	; Retrieve aliases (NPI & Tax ID )
	SELECT INTO "nl:"
FROM
	prsnl_alias   pa
 
where pa.person_id = dPersonID
		and pa.active_ind = 1
		and pa.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and pa.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
		and pa.prsnl_alias_type_cd in (dNPI, dTaxID, dDEA);001 add dDEA
 
detail
		if(pa.prsnl_alias_type_cd = dNPI)
			prsnl_reply_out->npi = pa.alias
		elseif (pa.prsnl_alias_type_cd = dTaxID) ;001
			prsnl_reply_out->tax_id = pa.alias
		else
			prsnl_reply_out->dea = pa.alias	;001
		endif
 
WITH nocounter
 
	; Retrieve Addresses
	select into "nl:"
	from address a
	where a.parent_entity_id = dPersonID
		and a.parent_entity_name = "PERSON"
		and a.active_ind = 1
		and a.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
	   	and a.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	head report
		ax = 0
	detail
		ax = ax + 1
		stat = alterlist(prsnl_reply_out->address,ax)
 
		prsnl_reply_out->address[ax].address_id = a.address_id
		prsnl_reply_out->address[ax].address_type_cd = a.address_type_cd
		prsnl_reply_out->address[ax].address_type_disp = uar_get_code_display(a.address_type_cd)
		prsnl_reply_out->address[ax].street_addr = trim(a.street_addr,3)
		prsnl_reply_out->address[ax].street_addr2 = trim(a.street_addr2,3)
		prsnl_reply_out->address[ax].city = trim(a.city,3)
		prsnl_reply_out->address[ax].state_cd = a.state_cd
		prsnl_reply_out->address[ax].state_disp = uar_get_code_display(a.state_cd)
		prsnl_reply_out->address[ax].zipcode = a.zipcode
	with nocounter
 
	; Retrieve Phone Nums
	select into "nl:"
	from phone ph
	where ph.parent_entity_id = dPersonID
		and ph.parent_entity_name = "PERSON"
		and ph.active_ind = 1
		and ph.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
	   	and ph.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	head report
		px = 0
	detail
		px = px + 1
		stat = alterlist(prsnl_reply_out->phones,px)
 
		prsnl_reply_out->phones[px].phone_id = ph.phone_id
		prsnl_reply_out->phones[px].phone_type_cd = ph.phone_type_cd
		prsnl_reply_out->phones[px].phone_type_disp = uar_get_code_display(ph.phone_type_cd)
		prsnl_reply_out->phones[px].phone_num = ph.phone_num
		prsnl_reply_out->phones[px].sequence_nbr = ph.phone_type_seq
	with nocounter
 
	; Credentials
	select into "nl:"
	from credential c
	where c.prsnl_id = dPersonID
		and c.active_ind = 1
		and c.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
	   	and c.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	head report
		cx = 0
	detail
		cx = cx + 1
		stat = alterlist(prsnl_reply_out->credentials,cx)
 
		prsnl_reply_out->credentials[cx].credential_id = c.credential_id
		prsnl_reply_out->credentials[cx].credential_cd = c.credential_cd
		prsnl_reply_out->credentials[cx].credential_disp = uar_get_code_display(c.credential_cd)
		prsnl_reply_out->credentials[cx].credential_type_cd = c.credential_type_cd
		prsnl_reply_out->credentials[cx].credential_type_disp = uar_get_code_display(c.credential_type_cd)
		prsnl_reply_out->credentials[cx].id_number = c.id_number
		prsnl_reply_out->credentials[cx].state_cd = c.state_cd
		prsnl_reply_out->credentials[cx].state_disp = uar_get_code_display(c.state_cd)
		prsnl_reply_out->credentials[cx].display_seq = c.display_seq
		prsnl_reply_out->credentials[cx].renewal_dt_tm = c.renewal_dt_tm
	with nocounter
 
 
	if(idebugFlag > 0)
		call echo(concat("GetPrsnlDemographics Runtime: ",
	                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	                 " seconds"))
	endif
end ; End Subroutine
/*************************************************************************
;  Name: GetNPIdetails
;  Description: Retrieve NPI details from www.npinumberlookup.org
**************************************************************************/
subroutine GetNPIdetails(npi)
	if(idebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetNPIdetails Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set filename = build("npi_",format(cnvtdatetime(curdate,curtime3),"MMDDHHMMSS;;Q"),".dat")
 
	;Send cURL request from backend
	declare dclCmd = vc
	set dclCmd = build("curl --silent http://www.npinumberlookup.org/getResultDetails.php?npinum=",npi,
		 "| sed -E 's/<BR>/\,/g' ",
		 "| sed -E 's/<[^>]*//g' ",
		 "| sed -E 's/\&nbsp;/\|/g' ",
		 "| sed -E 's/(>>| >| > |> |>)//g' ",
		 "| sed -E 's/\([^\)]*\)//g' ",
		 "|tr '\n' '\|'",
		 "> ",filename)
 
	set len = size(trim(dclCmd))
	set status = -1
	set dclStat = DCL(dclCmd,len,status)
	declare data = vc
 
	;Parse the result text for the necessary data
	free define rtl2
	define rtl2 is filename
 
	select into "nl:"
	  r.*
	from rtl2t r ; rtl2t is a type 2000 character field named LINE
	detail
	  	data = trim(r.line,3)
	with nocounter
 
	declare str = vc with noconstant("")
	declare notfnd = vc with constant("<not_found>")
	declare num = i4 with noconstant(1)
    while (str != notfnd)
		set str = piece(data,'|',num,notfnd)
 
		case(str)
			of "Provider Information:":
				set name = piece(data,'|',num + 3,notfnd)
				set gender = piece(data,'|',num + 4,notfnd)
				set license = piece(data,'|',num + 5,notfnd)
 
				set prsnl_reply_out->npi_info->prov_name = piece(name,":",2,"NA")
				set prsnl_reply_out->npi_info->prov_gender = piece(gender,":",2,"NA")
				set prsnl_reply_out->npi_info->license = piece(license,":",2,"NA")
 
			of "NPIInformation:":
				set entity_type = piece(data,'|',num + 4,notfnd)
				set enum_date = piece(data,'|',num + 5,notfnd)
				set last_upd_date = piece(data,'|',num + 6,notfnd)
 
				set prsnl_reply_out->npi_info->entity_type = piece(entity_type,":",2,"NA")
				set prsnl_reply_out->npi_info->enumeration_date = piece(enum_date,":",2,"NA")
				set prsnl_reply_out->npi_info->last_update_date = piece(last_upd_date,":",2,"NA")
 
			of "Provider Business Mailing Address:":
				set bm_address = piece(data,'|',num + 3,notfnd)
				set bm_phone = piece(data,'|',num + 4,notfnd)
				set bm_fax = piece(data,'|',num + 5,notfnd)
 
				set bm_add_detail = piece(bm_address,":",2,"NA")
				set prsnl_reply_out->npi_info->business_address->street_addr = piece(bm_add_detail,",",1,"NA")
				set prsnl_reply_out->npi_info->business_address->city = piece(bm_add_detail,",",2,"NA")
				set bm_state_zip = trim(piece(bm_add_detail,",",3,"NA"),3)
				set prsnl_reply_out->npi_info->business_address->state = piece(bm_state_zip," ",1,"NA")
				set prsnl_reply_out->npi_info->business_address->zip = piece(bm_state_zip," ",2,"NA")
 
				set prsnl_reply_out->npi_info->business_address->phone = piece(bm_phone,":",2,"NA")
				set prsnl_reply_out->npi_info->business_address->fax = piece(bm_fax,":",2,"NA")
 
			of "Provider Business Practice Location Address:":
				set pm_address = piece(data,'|',num + 3,notfnd)
				set pm_phone = piece(data,'|',num + 4,notfnd)
				set pm_fax = piece(data,'|',num + 5,notfnd)
 
				set pm_add_detail = piece(pm_address,":",2,"NA")
				set prsnl_reply_out->npi_info->practice_address->street_addr = piece(pm_add_detail,",",1,"NA")
				set prsnl_reply_out->npi_info->practice_address->city = piece(pm_add_detail,",",2,"NA")
				set pm_state_zip = trim(piece(pm_add_detail,",",3,"NA"),3)
				set prsnl_reply_out->npi_info->practice_address->state = piece(pm_state_zip," ",1,"NA")
				set prsnl_reply_out->npi_info->practice_address->zip = piece(pm_state_zip," ",2,"NA")
				set prsnl_reply_out->npi_info->practice_address->phone = piece(pm_phone,":",2,"NA")
				set prsnl_reply_out->npi_info->practice_address->fax = piece(pm_fax,":",2,"NA")
 
			of "Provider Taxonomy:":
				set primary = piece(data,'|',num + 3,notfnd)
				set secondary = piece(data,'|',num + 4,notfnd)
				set state = piece(data,'|',num + 5,notfnd)
 
				set prsnl_reply_out->npi_info->taxonomy->primary = piece(primary,":",2,"NA")
				set prsnl_reply_out->npi_info->taxonomy->secondary = piece(secondary,":",2,"NA")
				set prsnl_reply_out->npi_info->taxonomy->state = piece(state,":",2,"NA")
		endcase
 
       	set num = num + 1
     endwhile
 
    ;Delete the file once parsed
	set dclCmd = build2("rm ",filename)
	set len = size(dclCmd)
	set status = -1
 
	if(idebugFlag > 0)
		call echo(concat("GetNPIdetails Runtime: ",
	                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	                 " seconds"))
	endif
end ;Subroutine
 
end go
set trace notranslatelock go
