drop program mp_dcp_import_list:dba go
create program mp_dcp_import_list:dba
/*~BB~************************************************************************
  *                                                                      *
  *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
  *                              Technology, Inc.                        *
  *       Revision      (c) 1984-2003 Cerner Corporation                 *
  *                                                                      *
  *  Cerner (R) Proprietary Rights Notice:  All rights reserved.         *
  *  This material contains the valuable properties and trade secrets of *
  *  Cerner Corporation of Kansas City, Missouri, United States of       *
  *  America (Cerner), embodying substantial creative efforts and        *
  *  confidential information, ideas and expressions, no part of which   *
  *  may be reproduced or transmitted in any form or by any means, or    *
  *  retained in any storage or retrieval system without the express     *
  *  written permission of Cerner.                                       *
  *                                                                      *
  *  Cerner is a registered mark of Cerner Corporation.                  *
  *                                                                      *
  ~BE~***********************************************************************/
/*****************************************************************************
 
        Source file name:       mp_dcp_list_import.prg
        Object name:            mp_dcp_list_import
 
        Program purpose:        Evaluates and manages CSV files with
        						patients for specified registries
 
        Executing from:         <***INSERT MPAGE NAME AND OBJECT HERE****>
******************************************************************************/
;~DB~*************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG               *
;    *************************************************************************
;    *                                                                       *
;    *Mod Date       Engineer Comment                                        *
;    *--- ---------- -------- -----------------------------------------------*
;     000 06/22/2012 NS9429   Initial Release                                *
;     000 06/22/2012 KC7701   Initial Release                                *
;	  001 12/27/2012 NS9429   Add For Loop to AuditPerson to handle large	 *
;							  import records, improved query efficiency		 *
;~DE~*************************************************************************
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  *********************
/*free record request
record request
(
	1 blob_in = vc
)
 
Converted JSON Rec. JavaScript object defined within mp_dcp_import_frame.js which is convertd
to JSON string and passed to CCL.
;Initial Import File
record import_csv
	1 CSV_FAILURE_IND
	1 SUCCESS_CNT
	1 FAILURE_CNT
    1 LOCATION_CD
	1 ORGANIZATION_ID
	1 import_data[*]
		2 CONDITION
		2 LAST_NAME
		2 FIRST_NAME
		2 MIDDLE_NAME
		2 SEX
		2 DOB
		2 MRN
		2 MATCH_PERSON_ID
        ;Fields added in addition to csv headers
        2 CONDITION_ID
        2 NAME_FULL_FORMATTED
		2 IGNORE_IND
		2 DUP_IND
        2 AC_CLASS_PERSON_RELTN_ID
        2 PARENT_CLASS_PERSON_RELTN_ID
        2 INSERT_REG_IND
        2 INSERT_CON_IND
        2 UPDATE_REG_IND
        2 UPDATE_CON_IND
        2 INDEPENDENT_PARENT_IND
        2 GROUPID
        2 SELECTED_IND
        2 DUP_ID;position of the record from the JavaScript Object
)
*/
 
 
;******************************************************************************
;Prompts
;******************************************************************************
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Action Meaning" = ""
	, "Registry ID" = 0
	, "PRSNL ID" = ""
 	, "Template Params" = ""
with OUTDEV, ACTION_MEAN, REGISTRY_ID, PRSNL_ID, TEMPLATE_PARAMS
 
declare action_mean 	 = vc with constant(trim(cnvtupper($ACTION_MEAN)))
declare registry_id 	 = f8 with constant($REGISTRY_ID)
declare prsnl_id 	 	 = f8 with constant($PRSNL_ID)
declare template_params  = vc with constant($TEMPLATE_PARAMS)
if (validate(debug_mode, -99) = -99)
	declare debug_mode = i4 with noconstant(0)
endif
 
;******************************************************************************
;INCLUDES
;******************************************************************************
%i cclsource:mp_script_logging.inc
set log_program_name = "MP_DCP_IMPORT_LIST"
 
set modify maxvarlen 52428800
 
call log_message("In MP_DCP_IMPORT_LIST", LOG_LEVEL_DEBUG)
declare BEGIN_DATE_TIME = dq8 with constant(cnvtdatetime(curdate, curtime3)), private
 
 
;******************************************************************************
;Delcare Subroutines
;******************************************************************************
declare PrsnlSecurityAccess(PRSNL_ID = f8)	= null
declare AuditPerson(null)					= null
declare AuditCondition(null)				= null
declare AuditSuccessFailure(null)			= null
declare scrubDuplicateData(null)			= null
declare commitRegistryData(null)			= null
declare commitConditionData(null)			= null
declare PersonLookup(null)					= null
declare queryImportData(null)				= null
declare inactivateSelected(null)			= null
declare generateTemplate(null)				= null
declare exportList(null)					= null
declare replyFailure(null)					= null
declare CnvtCCLRec(CCL_QUAL = vc(REF))		= null
 
 
;******************************************************************************
;DECLARE RECORD STRUCTURES
;******************************************************************************
free record access_qual
record access_qual(
	1 logical_domain_ind	= i2
	1 logical_domain_id		= f8
	1 qual_cnt			= i4
	;not currently using org_id security access, maintaining for possible future need
	;AuditPerson will only evaluate the organization selected before clicking import
	1 qual[*]
		2 org_id			= f8
)
 
;Returned for manage actions
free record query_qual
record query_qual(
	1 qual_cnt	= i4
	1 import_data[*]
		2 ac_class_person_reltn_id		= f8
		2 parent_class_person_reltn_id	= f8
		2 independent_parent_ind		= i4
		2 match_person_id				= f8
		2 condition						= vc
		2 registry						= vc
		2 name_full_formatted			= vc
		2 sex						= vc
		2 DOB							= vc
		2 MRN							= vc
		2 import_dt_tm					= vc
		2 delete_ind					= i4
		2 location_name					= vc
		2 last_name						= vc
		2 first_name					= vc
		2 middle_name					= vc
)
 
free record mrn_qual
record mrn_qual(
	1 qual [*]
		2 alias = vc
)
 
;defining reply record seperately per the record being defined in JS
;JS will check for the reply structure and display error message
;reply will only be sent to JS on failure
free record reply
record reply
(
%i cclsource:status_block.inc
)
;001+

free record temp_imprec
record temp_imprec
(
 	1 import_data[*]
		2 CONDITION						= vc
		2 LAST_NAME						= vc
		2 FIRST_NAME					= vc
		2 MIDDLE_NAME					= vc
		2 SEX							= vc
		2 DOB							= vc
		2 MRN							= vc
		2 MATCH_PERSON_ID 				= f8
		2 CONDITION_ID					= f8
	    2 NAME_FULL_FORMATTED 			= vc
		2 IGNORE_IND					= i4
		2 DUP_IND						= i4
        2 AC_CLASS_PERSON_RELTN_ID 		= f8
        2 INSERT_REG_IND				= i4
        2 INSERT_CON_IND				= i4
        2 PARENT_CLASS_PERSON_RELTN_ID 	= f8
        2 UPDATE_CON_IND				= i4
        2 UPDATE_REG_IND				= i4
        2 INDEPENDENT_PARENT_IND 		= i4
        2 GROUPID						= i4
        2 SELECTED_IND					= i4
        2 DUP_ID 						= f8;position of the record from the JavaScript Object
)
 
free record person_match
record person_match
(
	1 qual[*]
		2 MATCH_PERSON_ID 		= f8
		2 LAST_NAME				= vc
		2 FIRST_NAME			= vc
		2 MIDDLE_NAME			= vc
		2 NAME_FULL_FORMATTED 	= vc
		2 MRN					= vc
		2 SEX					= vc
		2 DOB					= vc
)
;001- 
;******************************************************************************
;DECLARE & SET LOCAL VARIABLES
;******************************************************************************
declare 4_MRN = f8 with constant(uar_get_code_by_cki("CKI.CODEVALUE!2623"))
 
set reply->status_data.status = "S"

declare fail_operation = vc
declare failed = i2 with NOCONSTANT(0)
set ERRMSG =  FILLSTRING(132," ")
set ERRCODE = error(ERRMSG,1)

 
;******************************************************************************
;Subroutine Calls
;******************************************************************************
call PrsnlSecurityAccess(prsnl_id)
 
 
;program not always processing a request structure
if (validate(request->blob_in))
	if (request->blob_in > " ")
		;Defining the record structure globally to allow passing to various subroutines
		call log_message("Begin CnvtJSONRec", LOG_LEVEL_DEBUG)
		declare CNVTBEG_DATE_TIME = dq8 with constant(cnvtdatetime(curdate, curtime3)), private
 
		declare jrec = i4
		set jrec = cnvtjsontorec(trim(request->blob_in))
 
		call log_message(build("Finish CnvtJSONRec(), Elapsed time in seconds:",
		datetimediff(cnvtdatetime(curdate,curtime3),CNVTBEG_DATE_TIME, 5)), LOG_LEVEL_DEBUG)
 
	endif
endif
 
case(ACTION_MEAN)
	of "AUDIT":
		;'Import' from the Import Page
		call AuditCondition(null)
		call AuditPerson(null)
		call AuditSuccessFailure(null)
		call scrubDuplicateData(null)
		call CnvtCCLRec(IMPORT_CSV)
	of "PERSLOOKUP":
		;Manually searching and associating patients via the Import page
		call PersonLookup(null)
		call CnvtCCLRec(PERS_LOOKUP)
	of "COMMIT":
		;'Save to Registry' from the Import page
		call commitRegistryData(null)
		call commitConditionData(null)
		call CnvtCCLRec(IMPORT_CSV)
	of "INACTIVATE":
		;'Inactivate Selected' from the Manage page
		call inactivateSelected(null)
		call queryImportData(null)
		call CnvtCCLRec(query_qual)
	of "QUERYDATA":
		;Launching Manage. Will auto query if the end-user only has 1 org relation or will executed on 'Apply'
		;Organization_id is the highest level of detail and is the only filter used within CCL. All other filtering
		;completed within JS
		call queryImportData(null)
		call CnvtCCLRec(query_qual)
	of "TEMPLATE":
		;'New Template' from the Import page
		call generateTemplate(null)
	of "EXPORT":
		;'Export' from either Import or Manage page.
		;	* cannot create save file via JS in IE version
		;	* nor execute a CCLLINK api call and pass an object to display in discernoutputviewer
		;	* option to display output in HTML passed on as the comma delimted output not desirable
		;	* NOT implemented, however, subroutines ready to process record and display output
		call exportList(null)
endcase
 
 
;******************************************************************************
;Subroutines
;******************************************************************************
subroutine PrsnlSecurityAccess(PRSNL_ID)
	call log_message("In PrsnlSecurityAccess()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(cnvtdatetime(curdate, curtime3)), private
 
	select into "nl:"
	from
	prsnl pr,
	prsnl_org_reltn por,
	organization org
	plan pr
		where pr.person_id = PRSNL_ID
	join por
		where por.person_id = pr.person_id
	  	and por.beg_effective_dt_tm < sysdate
  		and por.end_effective_dt_tm > sysdate
  		and por.active_ind = 1
  	join org
  		where org.organization_id = por.organization_id
  		and org.beg_effective_dt_tm < sysdate
  		and org.end_effective_dt_tm > sysdate
  		and org.active_ind = 1
  	head report
  		ocnt = 0
 
  		; Check if logical_domain_id exists in prsnl table.  If it doesn't, use 0.
        if (CHECKDIC("PRSNL.LOGICAL_DOMAIN_ID","A",0) > 0 )
            access_qual->logical_domain_id = pr.logical_domain_id
            access_qual->logical_domain_ind = TRUE
        else
            access_qual->logical_domain_id = 0.0
            access_qual->logical_domain_ind = FALSE
        endif
 
  	detail
  		ocnt = ocnt + 1
  		if(mod(ocnt,10) = 1)
  			stat = alterlist(access_qual->qual,ocnt +9)
  		endif
 
  		access_qual->qual[ocnt].org_id = org.organization_id
  	foot report
  		access_qual->qual_cnt = ocnt
  		stat = alterlist(access_qual->qual,access_qual->qual_cnt)
  	with nocounter
 
	SET ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
	  set failed = 1
	  set fail_operation = "SECURITY ACCESS FAILURE"
	  call replyFailure(null)
    endif
 
  	call log_message(build("Exit PrsnlSecurityAccess(), Elapsed time in seconds:",
	datetimediff(cnvtdatetime(curdate,curtime3),BEGIN_DATE_TIME, 5)), LOG_LEVEL_DEBUG)
end ;PrsnlSecurityAccess
 
 
subroutine PersonLookup(null)
 	call log_message("In PersonLookup()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(cnvtdatetime(curdate, curtime3)), private
 
	;There is no need for an access level check because the user selected via the front-end search
	select into "nl:"
	from
	person p,
	person_alias pa
 
	plan p
		where p.person_id = PERS_LOOKUP->SELECT_PERSON_ID
		and p.active_ind = 1
	join pa
		where pa.person_id = outerjoin(p.person_id)
		and pa.active_ind = outerjoin(1)
        and pa.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		and pa.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
		and pa.person_alias_type_cd = outerjoin(4_MRN)
	head p.person_id
 
 		PERS_LOOKUP->NAME_FULL_FORMATTED = trim(p.name_full_formatted)
	    PERS_LOOKUP->MATCH_PERSON_ID = p.person_id
	    PERS_LOOKUP->LAST_NAME = trim(p.name_last)
	    PERS_LOOKUP->FIRST_NAME = trim(p.name_first)
	    PERS_LOOKUP->MIDDLE_NAME = trim(p.name_middle)
	    PERS_LOOKUP->SEX = trim(uar_get_code_display(p.sex_cd))
        PERS_LOOKUP->DOB = format(cnvtdatetimeutc(p.birth_dt_tm, 1), "MM/DD/YYYY ;;D")
 	detail
	 	PERS_LOOKUP->MRN = build2(trim(PERS_LOOKUP->MRN),";",trim(pa.alias))
	foot p.person_id
		;Remove first comma
	    PERS_LOOKUP->MRN  = trim(replace(PERS_LOOKUP->MRN ,";","",1),3)
    	;Add a space after each comma
    	PERS_LOOKUP->MRN  = replace(PERS_LOOKUP->MRN ,";","; ")
	with nocounter
 
	SET ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
	  set failed = 1
	  set fail_operation = "PERSON LOOKUP FAILURE"
	  call replyFailure(null)
    endif
 
	call log_message(build("Exit PersonLookup(), Elapsed time in seconds:",
	datetimediff(cnvtdatetime(curdate,curtime3),BEGIN_DATE_TIME, 5)), LOG_LEVEL_DEBUG)
end ;PersonLookup
 
 
subroutine scrubDuplicateData(null)
	call log_message("In scrubDuplicateData()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(cnvtdatetime(curdate, curtime3)), private
 
	set	stat = alterlist(IMPORT_CSV->IMPORT_DUP,0)
 
	select into "nl:"
	person_match_id = IMPORT_CSV->import_data[d1.seq].MATCH_PERSON_ID,
	condition_id	= IMPORT_CSV->import_data[d1.seq].CONDITION_ID,
	dup_id			= IMPORT_CSV->import_data[d1.seq].DUP_ID
 
	from
	(dummyt d1 with seq = size(IMPORT_CSV->import_data,5))
 
	plan d1
		where IMPORT_CSV->import_data[d1.seq].IGNORE_IND = 0
		and IMPORT_CSV->import_data[d1.seq].MATCH_PERSON_ID > 0
		and IMPORT_CSV->import_data[d1.seq].CONDITION_ID >= 0;0 is considered a none condition
	order person_match_id,condition_id
	head report
		record_size = size(IMPORT_CSV->import_data,5)
		dup_cnt = 0
 
	head person_match_id
		null
	head condition_id
		mcnt = 0
	detail
		mcnt = mcnt + 1
 
		if (mcnt > 1)
			duppos = 0
			dupseq = 0
			duppos = locateval(dupseq,1,record_size,dup_id,IMPORT_CSV->IMPORT_DATA[dupseq].DUP_ID)
 			dup_cnt = dup_cnt + 1
 			stat = alterlist(IMPORT_CSV->IMPORT_DUP,dup_cnt)
 			IMPORT_CSV->IMPORT_DUP[dup_cnt].CONDITION_ID = IMPORT_CSV->IMPORT_DATA[duppos].CONDITION_ID
 			IMPORT_CSV->IMPORT_DUP[dup_cnt].MATCH_PERSON_ID = IMPORT_CSV->IMPORT_DATA[duppos].MATCH_PERSON_ID
 			IMPORT_CSV->IMPORT_DUP[dup_cnt].NAME_FULL_FORMATTED = IMPORT_CSV->IMPORT_DATA[duppos].NAME_FULL_FORMATTED
 			IMPORT_CSV->IMPORT_DUP[dup_cnt].IGNORE_IND = IMPORT_CSV->IMPORT_DATA[duppos].IGNORE_IND
 			IMPORT_CSV->IMPORT_DUP[dup_cnt].AC_CLASS_PERSON_RELTN_ID = IMPORT_CSV->IMPORT_DATA[duppos].AC_CLASS_PERSON_RELTN_ID
 			IMPORT_CSV->IMPORT_DUP[dup_cnt].INSERT_REG_IND = IMPORT_CSV->IMPORT_DATA[duppos].INSERT_REG_IND
 			IMPORT_CSV->IMPORT_DUP[dup_cnt].INSERT_CON_IND = IMPORT_CSV->IMPORT_DATA[duppos].INSERT_CON_IND
 			IMPORT_CSV->IMPORT_DUP[dup_cnt].PARENT_CLASS_PERSON_RELTN_ID = IMPORT_CSV->IMPORT_DATA[duppos].PARENT_CLASS_PERSON_RELTN_ID
 			IMPORT_CSV->IMPORT_DUP[dup_cnt].UPDATE_CON_IND = IMPORT_CSV->IMPORT_DATA[duppos].UPDATE_CON_IND
 			IMPORT_CSV->IMPORT_DUP[dup_cnt].UPDATE_REG_IND = IMPORT_CSV->IMPORT_DATA[duppos].UPDATE_REG_IND
 			IMPORT_CSV->IMPORT_DUP[dup_cnt].INDEPENDENT_PARENT_IND = IMPORT_CSV->IMPORT_DATA[duppos].INDEPENDENT_PARENT_IND
 			IMPORT_CSV->IMPORT_DUP[dup_cnt].GROUPID = IMPORT_CSV->IMPORT_DATA[duppos].GROUPID
 			IMPORT_CSV->IMPORT_DUP[dup_cnt].CONDITION = IMPORT_CSV->IMPORT_DATA[duppos].CONDITION
 			IMPORT_CSV->IMPORT_DUP[dup_cnt].LAST_NAME = IMPORT_CSV->IMPORT_DATA[duppos].LAST_NAME
 			IMPORT_CSV->IMPORT_DUP[dup_cnt].FIRST_NAME = IMPORT_CSV->IMPORT_DATA[duppos].FIRST_NAME
 			IMPORT_CSV->IMPORT_DUP[dup_cnt].MIDDLE_NAME = IMPORT_CSV->IMPORT_DATA[duppos].MIDDLE_NAME
 			IMPORT_CSV->IMPORT_DUP[dup_cnt].SEX = IMPORT_CSV->IMPORT_DATA[duppos].SEX
 			IMPORT_CSV->IMPORT_DUP[dup_cnt].DOB = IMPORT_CSV->IMPORT_DATA[duppos].DOB
 			IMPORT_CSV->IMPORT_DUP[dup_cnt].MRN = IMPORT_CSV->IMPORT_DATA[duppos].MRN
 			IMPORT_CSV->IMPORT_DUP[dup_cnt].DUP_ID= IMPORT_CSV->IMPORT_DATA[duppos].DUP_ID
			stat = alterlist(IMPORT_CSV->IMPORT_DATA,record_size-1,duppos-1)
			record_size = size(IMPORT_CSV->IMPORT_DATA,5)
 			IMPORT_CSV->SUCCESS_CNT = IMPORT_CSV->SUCCESS_CNT - 1
		endif
	with nocounter
 
	SET ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
	  set failed = 1
	  set fail_operation = "SCRUB DUPLICATE FAILURE"
	  call replyFailure(null)
    endif
 
	call log_message(build("Exit scrubDuplicateData(), Elapsed time in seconds:",
	datetimediff(cnvtdatetime(curdate,curtime3),BEGIN_DATE_TIME, 5)), LOG_LEVEL_DEBUG)
end ;scrubDuplicateData
 
 
subroutine commitRegistryData(null)
 	call log_message("In commitRegistryData()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(cnvtdatetime(curdate, curtime3)), private
 
	select into "nl:"
	person_match_id = IMPORT_CSV->import_data[d1.seq].MATCH_PERSON_ID
	from
	(dummyt d1 with seq = size(IMPORT_CSV->import_data,5)),
	ac_class_person_reltn acpr,
	ac_class_person_reltn acpr2
	plan d1
		where IMPORT_CSV->import_data[d1.seq].IGNORE_IND = 0
		and IMPORT_CSV->import_data[d1.seq].DUP_IND = 0
		and IMPORT_CSV->import_data[d1.seq].MATCH_PERSON_ID > 0
	join acpr
		where acpr.ac_class_def_id = REGISTRY_ID
		and acpr.person_id = IMPORT_CSV->import_data[d1.seq].MATCH_PERSON_ID
		and acpr.organization_id = cnvtreal(IMPORT_CSV->organization_id)
		and acpr.location_cd = cnvtreal(IMPORT_CSV->location_cd)
	join acpr2
		where acpr2.parent_class_person_reltn_id = outerjoin(acpr.ac_class_person_reltn_id)
		and acpr2.person_id = outerjoin(acpr.person_id)
		and acpr2.ac_class_def_id = outerjoin(cnvtreal(IMPORT_CSV->import_data[d1.seq].CONDITION_ID))
		and acpr2.organization_id = outerjoin(cnvtreal(IMPORT_CSV->organization_id))
		and acpr2.location_cd = outerjoin(cnvtreal(IMPORT_CSV->location_cd))
	order person_match_id
	head report
		reg_cnt = 0
	head person_match_id
		;Set only the first instance of the new person to import--only want one row per person/registry relation
		if (acpr.ac_class_person_reltn_id = 0)
			IMPORT_CSV->import_data[d1.seq].INSERT_REG_IND = 1
			IMPORT_CSV->import_data[d1.seq].PARENT_CLASS_PERSON_RELTN_ID = 0.0
		elseif(acpr.ac_class_person_reltn_id > 0)
                ;only execute the update on registries that are inactive
                if (acpr.active_ind = 0 )
                    IMPORT_CSV->import_data[d1.seq].UPDATE_REG_IND = 1
                endif
				IMPORT_CSV->import_data[d1.seq].PARENT_CLASS_PERSON_RELTN_ID = acpr.ac_class_person_reltn_id
		endif
	detail
		if (acpr.ac_class_person_reltn_id > 0)
			IMPORT_CSV->import_data[d1.seq].INSERT_REG_IND = 0
			IMPORT_CSV->import_data[d1.seq].PARENT_CLASS_PERSON_RELTN_ID = acpr.ac_class_person_reltn_id
		endif
 
 		if(acpr2.ac_class_person_reltn_id = 0 and IMPORT_CSV->import_data[d1.seq].CONDITION_ID > 0)
 			IMPORT_CSV->import_data[d1.seq].INSERT_CON_IND = 1
 
 		elseif (acpr2.ac_class_person_reltn_id > 0)
				IMPORT_CSV->import_data[d1.seq].UPDATE_CON_IND = 1
				IMPORT_CSV->import_data[d1.seq].AC_CLASS_PERSON_RELTN_ID = acpr2.ac_class_person_reltn_id
		elseif (IMPORT_CSV->import_data[d1.seq].CONDITION_ID = 0)
			;set aINDEPENDENT_PARENT_IND = 1 to alert us that a 'NONE' has been loaded to track the patient at the registry level
			;only
			IMPORT_CSV->import_data[d1.seq].INDEPENDENT_PARENT_IND = 1
 		endif
	with nocounter,outerjoin=d1
 
	SET ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
	  set failed = 1
	  set fail_operation = "REG COND QUERY FAILURE"
	  call replyFailure(null)
    endif
 
	;using FOR to set a variable for the next sequence to use in multiple columns in the insert statement
	for (insidx = 1 to size(IMPORT_CSV->import_data,5))
 
		if (IMPORT_CSV->import_data[insidx].INSERT_REG_IND = 1)
			set new_seq = 0.0
 
			select into "nl:"
			y = seq(HEALTH_STATUS_SEQ, nextval)
					 "##################;rp0"
			from dual
			detail
			  new_seq = cnvtreal(y)
			with format, counter
 
			insert into
			ac_class_person_reltn acpr
 
			set
			acpr.ac_class_person_reltn_id  		= new_seq,
			acpr.person_id						= IMPORT_CSV->import_data[insidx].MATCH_PERSON_ID,
			acpr.parent_class_person_reltn_id	= new_seq,
			acpr.ac_class_def_id				= REGISTRY_ID,
			acpr.organization_id 				= cnvtreal(IMPORT_CSV->organization_id),
			acpr.location_cd 					= cnvtreal(IMPORT_CSV->location_cd),
			acpr.active_ind						= 1,
			acpr.independent_parent_ind 		= 0,
			acpr.begin_effective_dt_tm			= cnvtdatetime(curdate,curtime3),
			acpr.end_effective_dt_tm			= cnvtdatetime("31-DEC-2100 00:00:00"),
			acpr.updt_applctx					= ReqInfo->updt_applctx,
			acpr.updt_dt_tm						= cnvtdatetime(curdate,curtime3),
			acpr.updt_id						= ReqInfo->updt_id,
			acpr.updt_task						= ReqInfo->updt_task,
			acpr.updt_cnt						= 0
 
			plan acpr
 
			with nocounter
		endif
 	endfor
 
	SET ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
	  set failed = 1
	  set fail_operation = "INSERT REGISTRY FAILURE"
	  call replyFailure(null)
	else
	  commit
    endif
 
	if (curqual > 0)
 
 		select into "nl:"
 		person_match_id = IMPORT_CSV->import_data[d1.seq].MATCH_PERSON_ID
		from
		ac_class_person_reltn acpr,
		(dummyt d1 with seq = size(IMPORT_CSV->import_data,5))
		plan d1
			where IMPORT_CSV->import_data[d1.seq].PARENT_CLASS_PERSON_RELTN_ID = 0
			and IMPORT_CSV->import_data[d1.seq].IGNORE_IND = 0
			and IMPORT_CSV->import_data[d1.seq].DUP_IND = 0
			and IMPORT_CSV->import_data[d1.seq].MATCH_PERSON_ID > 0
		join acpr
			where acpr.ac_class_def_id = REGISTRY_ID
			and acpr.person_id = IMPORT_CSV->import_data[d1.seq].MATCH_PERSON_ID
			and acpr.organization_id = cnvtreal(IMPORT_CSV->organization_id)
			and acpr.location_cd = cnvtreal(IMPORT_CSV->location_cd)
		order person_match_id
		detail
			IMPORT_CSV->import_data[d1.seq].INSERT_REG_IND = 0
			IMPORT_CSV->import_data[d1.seq].PARENT_CLASS_PERSON_RELTN_ID = acpr.ac_class_person_reltn_id
		with nocounter
 
		SET ERRCODE = ERROR(ERRMSG,0)
		if(ERRCODE != 0)
		  set failed = 1
		  set fail_operation = "POP PARENT RELTN FAILURE"
		  call replyFailure(null)
	    endif
	endif
 
	;re-activate registries
	update into
	ac_class_person_reltn acpr,
	(dummyt d1 with seq = size(IMPORT_CSV->import_data,5))
 
	set
	acpr.active_ind				= 1,
	acpr.begin_effective_dt_tm	= cnvtdatetime(curdate,curtime3),
	acpr.end_effective_dt_tm	= cnvtdatetime("31-DEC-2100 00:00:00"),
	acpr.updt_dt_tm				= cnvtdatetime(curdate,curtime3),
	acpr.updt_id				= ReqInfo->updt_id,
	acpr.updt_cnt				= acpr.updt_cnt + 1,
	acpr.updt_applctx			= ReqInfo->updt_applctx,
	acpr.updt_task				= ReqInfo->updt_task
 
	plan d1
		where IMPORT_CSV->import_data[d1.seq].UPDATE_REG_IND = 1
	join acpr
		where acpr.ac_class_person_reltn_id = IMPORT_CSV->import_data[d1.seq].PARENT_CLASS_PERSON_RELTN_ID
	with nocounter
 
	SET ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
	  set failed = 1
	  set fail_operation = "UPDATE REGISTRY FAILURE"
	  call replyFailure(null)
	else
	  commit
    endif
 
	;update independent_parent_ind; set the registries that were indicated as NONE condition
	update into
	ac_class_person_reltn acpr,
	(dummyt d1 with seq = size(IMPORT_CSV->import_data,5))
 
	set
	acpr.independent_parent_ind = 1
 
	plan d1
		where IMPORT_CSV->import_data[d1.seq].INDEPENDENT_PARENT_IND = 1
	join acpr
		where acpr.ac_class_person_reltn_id = IMPORT_CSV->import_data[d1.seq].PARENT_CLASS_PERSON_RELTN_ID
	with nocounter
 
	SET ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
	  set failed = 1
	  set fail_operation = "REG IND_PARENT FAILURE"
	  call replyFailure(null)
	else
	  commit
    endif
 
	if (curqual > 0)
 		;if inserting a "NONE" condition row, keep total to reply back in json rec
 		set import_csv->SUCCESS_CNT = import_csv->SUCCESS_CNT + curqual
	endif
 
	call log_message(build("Exit commitRegistryData(), Elapsed time in seconds:",
	datetimediff(cnvtdatetime(curdate,curtime3),BEGIN_DATE_TIME, 5)), LOG_LEVEL_DEBUG)
end ;commitRegistryData
 
 
subroutine commitConditionData(null)
 	call log_message("In commitConditionData()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(cnvtdatetime(curdate, curtime3)), private
 
	insert into
	ac_class_person_reltn acpr,
	(dummyt d1 with seq = size(IMPORT_CSV->import_data,5))
 
	set
	acpr.ac_class_person_reltn_id  		= seq(HEALTH_STATUS_SEQ,nextval),
	acpr.person_id						= IMPORT_CSV->import_data[d1.seq].MATCH_PERSON_ID,
	acpr.parent_class_person_reltn_id	= IMPORT_CSV->import_data[d1.seq].PARENT_CLASS_PERSON_RELTN_ID,
	acpr.ac_class_def_id				= IMPORT_CSV->import_data[d1.seq].CONDITION_ID,
	acpr.independent_parent_ind 		= 0,
	acpr.organization_id 				= cnvtreal(IMPORT_CSV->organization_id),
	acpr.location_cd 					= cnvtreal(IMPORT_CSV->location_cd),
	acpr.active_ind						= 1,
	acpr.begin_effective_dt_tm			= cnvtdatetime(curdate,curtime3),
	acpr.end_effective_dt_tm			= cnvtdatetime("31-DEC-2100 00:00:00"),
	acpr.updt_dt_tm						= cnvtdatetime(curdate,curtime3),
	acpr.updt_id						= ReqInfo->updt_id,
	acpr.updt_cnt						= 0,
	acpr.updt_applctx					= ReqInfo->updt_applctx,
	acpr.updt_task						= ReqInfo->updt_task
 
	plan d1
		;only insert condition rows that do not exist already on the table for the selected registry
		where	IMPORT_CSV->import_data[d1.seq].INSERT_CON_IND = 1
	join acpr
 
	with nocounter
 
	SET ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
	  set failed = 1
	  set fail_operation = "INSERT CONDITION FAILURE"
	  call replyFailure(null)
	else
	  commit
    endif
 
	if (curqual > 0)
 		;if inserting condition rows, keep total to reply back in json rec
 		set import_csv->SUCCESS_CNT = import_csv->SUCCESS_CNT + curqual
	endif
 
	;re-activate conditions
	update into
	ac_class_person_reltn acpr,
	(dummyt d1 with seq = size(IMPORT_CSV->import_data,5))
 
	set
	acpr.active_ind				= 1,
	acpr.begin_effective_dt_tm	= cnvtdatetime(curdate,curtime3),
	acpr.end_effective_dt_tm	= cnvtdatetime("31-DEC-2100 00:00:00"),
	acpr.updt_dt_tm				= cnvtdatetime(curdate,curtime3),
	acpr.updt_id				= ReqInfo->updt_id,
	acpr.updt_cnt				= acpr.updt_cnt + 1,
	acpr.updt_applctx			= ReqInfo->updt_applctx,
	acpr.updt_task				= ReqInfo->updt_task
 
	plan d1
		where IMPORT_CSV->import_data[d1.seq].UPDATE_CON_IND = 1
	join acpr
		where acpr.ac_class_person_reltn_id = IMPORT_CSV->import_data[d1.seq].AC_CLASS_PERSON_RELTN_ID
	with nocounter
 
	SET ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
	  set failed = 1
	  set fail_operation = "UPDATE CONDITION FAILURE"
	  call replyFailure(null)
	else
	  commit
    endif
 
	if (curqual > 0)
		;if updating condition rows, keep total to reply back in json rec
		set import_csv->SUCCESS_CNT = import_csv->SUCCESS_CNT + curqual
	endif
 
	call log_message(build("Exit commitConditionData(), Elapsed time in seconds:",
	datetimediff(cnvtdatetime(curdate,curtime3),BEGIN_DATE_TIME, 5)), LOG_LEVEL_DEBUG)
end ;commitConditionData
 
 
subroutine inactivateSelected(null)
	call log_message("In inactivateSelected()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(cnvtdatetime(curdate, curtime3)), private
 
	;Update the registry association indicator to 0 if the user has indicated the patient should no longer be tracked at the
	;registry only level
	update into
	ac_class_person_reltn acpr,
	(dummyt d1 with seq = size(IMPORT_CSV->import_data,5))
 
	set
	acpr.independent_parent_ind = 0,
	acpr.updt_dt_tm				= cnvtdatetime(curdate,curtime3),
	acpr.updt_id				= ReqInfo->updt_id,
	acpr.updt_cnt				= acpr.updt_cnt + 1,
	acpr.updt_applctx			= ReqInfo->updt_applctx,
	acpr.updt_task				= ReqInfo->updt_task
 
	plan d1
		where IMPORT_CSV->import_data[d1.seq].DELETE_IND = 1
	join acpr
		where acpr.ac_class_person_reltn_id = IMPORT_CSV->import_data[d1.seq].AC_CLASS_PERSON_RELTN_ID
		and acpr.independent_parent_ind = 1
	with nocounter
 
	SET ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
	  set failed = 1
	  set fail_operation = "INACT IND_PAR FAILURE"
	  call replyFailure(null)
    endif
 
	;update all of the condition rows where selected for delete/inactivate
	update into
	ac_class_person_reltn acpr,
	(dummyt d1 with seq = size(IMPORT_CSV->import_data,5))
 
	set
	acpr.active_ind				= 0,
	acpr.end_effective_dt_tm	= cnvtdatetime(curdate,curtime3),
	acpr.updt_dt_tm				= cnvtdatetime(curdate,curtime3),
	acpr.updt_id				= ReqInfo->updt_id,
	acpr.updt_cnt				= acpr.updt_cnt + 1,
	acpr.updt_applctx			= ReqInfo->updt_applctx,
	acpr.updt_task				= ReqInfo->updt_task
 
	plan d1
		where IMPORT_CSV->import_data[d1.seq].DELETE_IND = 1
	join acpr
		where acpr.ac_class_person_reltn_id = IMPORT_CSV->import_data[d1.seq].AC_CLASS_PERSON_RELTN_ID
		and acpr.ac_class_person_reltn_id != acpr.parent_class_person_reltn_id
		and acpr.parent_class_person_reltn_id > 0
	with nocounter
 
	SET ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
	  set failed = 1
	  set fail_operation = "INACT SELECTED FAILURE"
	  call replyFailure(null)
    endif
 
	;update the registry rows to end_effective if they should not be maintained or there are no longer conditions
	;associated to the registry
	update into ac_class_person_reltn acpr
 	set
	acpr.active_ind				= 0,
	acpr.end_effective_dt_tm	= cnvtdatetime(curdate,curtime3),
	acpr.updt_dt_tm				= cnvtdatetime(curdate,curtime3),
	acpr.updt_id				= ReqInfo->updt_id,
	acpr.updt_cnt				= acpr.updt_cnt + 1,
	acpr.updt_applctx			= ReqInfo->updt_applctx,
	acpr.updt_task				= ReqInfo->updt_task
 
	plan acpr
		where acpr.independent_parent_ind = 0
		and acpr.ac_class_person_reltn_id = acpr.parent_class_person_reltn_id
		and acpr.active_ind = 1
        and acpr.begin_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and acpr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
		and not exists (select 1 from ac_class_person_reltn acpr2
						where acpr2.parent_class_person_reltn_id = acpr.ac_class_person_reltn_id
						and acpr2.ac_class_person_reltn_id != acpr2.parent_class_person_reltn_id
						and acpr2.active_ind = 1
                        and acpr2.begin_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
                        and acpr2.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
						)
 
	with nocounter
 
	SET ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
	  set failed = 1
	  set fail_operation = "INACT EMPTY REG FAILURE"
	  call replyFailure(null)
    endif
 
    if (ERRCODE = 0)
		commit
	endif
 
	call log_message(build("Exit inactivateSelected(), Elapsed time in seconds:",
	datetimediff(cnvtdatetime(curdate,curtime3),BEGIN_DATE_TIME, 5)), LOG_LEVEL_DEBUG)
end ;inactivateSelected
 
 
subroutine queryImportData(null)
	call log_message("In queryImportData()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(cnvtdatetime(curdate, curtime3)), private
 
	declare req_seq = i4 with noconstant(0)
	declare req_pos = i4 with noconstant(0)
 
	select into "nl:"
	registry = trim(acd.class_display_name),
	condition = trim(acd2.class_display_name)
	from
	ac_class_person_reltn acpr,
	ac_class_person_reltn acpr2,
	ac_class_def acd,
	ac_class_def acd2,
	person p,
	person_alias pa
 
	plan acpr
		where acpr.organization_id = IMPORT_CSV->ORGANIZATION_ID
		and acpr.ac_class_person_reltn_id = acpr.parent_class_person_reltn_id
		and acpr.active_ind = 1
        and acpr.begin_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and acpr.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
	join acd
		where acd.ac_class_def_id = acpr.ac_class_def_id
	join p
		where p.person_id = acpr.person_id
	join pa
		where pa.person_id = outerjoin(p.person_id)
		and pa.active_ind = outerjoin(1)
        and pa.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		and pa.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
		and pa.person_alias_type_cd = outerjoin(4_MRN)
	join acpr2
		where acpr2.parent_class_person_reltn_id = outerjoin(acpr.ac_class_person_reltn_id)
		and acpr2.ac_class_person_reltn_id != outerjoin(acpr.parent_class_person_reltn_id)
		and acpr2.active_ind = outerjoin(1)
        and acpr2.begin_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		and acpr2.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
	join acd2
		where acd2.ac_class_def_id = outerjoin(acpr2.ac_class_def_id)
	order registry,condition,acpr.organization_id,acpr.location_cd,p.person_id
	head report
		qcnt = 0
 
	head registry
		null
	head condition
		null
	head acpr.organization_id
		null
	head acpr.location_cd
		null
	head p.person_id
		hold_mrn = FILLSTRING(255," ")
		FOUND_INDEP_IND = FALSE
	detail
		hold_mrn = concat(trim(hold_mrn),";",trim(pa.alias,3))
 	foot p.person_id
 
 		 ;Remove first comma
	     hold_mrn = trim(replace(hold_mrn,";","",1),3)
    	 ;Add a space after each comma
    	 hold_mrn = replace(hold_mrn,";","; ")
 
		;determines if primary id is already added to the record and ensurese duplicate 'NONE' conditions are not
		;added for the same person and registry
 		reg_seq = 0
 		reg_pos = locateval(reg_seq,1,size(query_qual->import_data,5),
 				acpr.parent_class_person_reltn_id,query_qual->import_data[reg_seq].ac_class_person_reltn_id)
 
		if (reg_pos > 0)
			if (query_qual->import_data[reg_pos].condition = 'NONE')
				FOUND_INDEP_IND = TRUE
			else
				FOUND_INDEP_IND = FALSE
			endif
 		else
 			FOUND_INDEP_IND = FALSE
 		endif
 
 		if (acpr.independent_parent_ind = 1 and FOUND_INDEP_IND = FALSE)
			qcnt = qcnt + 1
 
			if (mod(qcnt,1000)=1)
				stat = alterlist(query_qual->import_data,qcnt + 999)
			endif
 
			query_qual->import_data[qcnt].condition						= 'NONE'
			query_qual->import_data[qcnt].ac_class_person_reltn_id		= acpr.ac_class_person_reltn_id
			query_qual->import_data[qcnt].match_person_id				= acpr.person_id
			query_qual->import_data[qcnt].parent_class_person_reltn_id	= acpr.parent_class_person_reltn_id
			;query_qual->import_data[qcnt].import_dt_tm					= format(acpr.begin_effective_dt_tm, "MM/DD/YYYY;;d")
            query_qual->import_data[qcnt].import_dt_tm	                =
            ;            format(cnvtdatetimeutc(acpr.begin_effective_dt_tm, 1), "MM/DD/YYYY ;;D")
                                evaluate(curutc,1,format(CNVTDATETIME(acpr.begin_effective_dt_tm), "MM/DD/YYYY;;d"),
                        format(CNVTDATETIMEUTC(acpr.begin_effective_dt_tm,3), "MM/DD/YYYY;;d"))
			query_qual->import_data[qcnt].registry						= registry
			query_qual->import_data[qcnt].name_full_formatted			= trim(p.name_full_formatted)
			query_qual->import_data[qcnt].sex						= trim(uar_get_code_display(p.sex_cd))
			;query_qual->import_data[qcnt].dob							= datetimezoneformat(p.birth_dt_tm,p.birth_tz,"MM/DD/YYYY")
            query_qual->import_data[qcnt].dob							= format(cnvtdatetimeutc(p.birth_dt_tm, 1), "MM/DD/YYYY ;;D")
			query_qual->import_data[qcnt].location_name					= trim(uar_get_code_description(acpr.location_cd))
			query_qual->import_data[qcnt].last_name						= trim(p.name_last)
			query_qual->import_data[qcnt].first_name					= trim(p.name_first)
			query_qual->import_data[qcnt].middle_name					= trim(p.name_middle)
			query_qual->import_data[qcnt].MRN							= hold_mrn
 
		endif
 
		if (acpr2.ac_class_person_reltn_id > 0)
			qcnt = qcnt + 1
 
			if (mod(qcnt,1000)=1)
				stat = alterlist(query_qual->import_data,qcnt + 999)
			endif
 
			query_qual->import_data[qcnt].condition						= condition
			query_qual->import_data[qcnt].match_person_id				= acpr2.person_id
			query_qual->import_data[qcnt].ac_class_person_reltn_id		= acpr2.ac_class_person_reltn_id
			query_qual->import_data[qcnt].parent_class_person_reltn_id	= acpr2.parent_class_person_reltn_id
			;query_qual->import_data[qcnt].import_dt_tm					= format(acpr2.begin_effective_dt_tm, "MM/DD/YYYY;;d")
            query_qual->import_data[qcnt].import_dt_tm	                =
            ;            format(cnvtdatetimeutc(acpr2.begin_effective_dt_tm, 1), "MM/DD/YYYY ;;D")
                    evaluate(curutc,1,format(CNVTDATETIME(acpr2.begin_effective_dt_tm), "MM/DD/YYYY;;d"),
                        format(CNVTDATETIMEUTC(acpr2.begin_effective_dt_tm,3), "MM/DD/YYYY;;d"))
			query_qual->import_data[qcnt].registry						= registry
			query_qual->import_data[qcnt].name_full_formatted			= trim(p.name_full_formatted)
			query_qual->import_data[qcnt].sex						= trim(uar_get_code_display(p.sex_cd))
            query_qual->import_data[qcnt].dob	                       = format(cnvtdatetimeutc(p.birth_dt_tm, 1), "MM/DD/YYYY ;;D")
			;query_qual->import_data[qcnt].dob							= datetimezoneformat(p.birth_dt_tm,p.birth_tz,"MM/DD/YYYY")
			query_qual->import_data[qcnt].location_name					= trim(uar_get_code_description(acpr.location_cd))
			query_qual->import_data[qcnt].last_name						= trim(p.name_last)
			query_qual->import_data[qcnt].first_name					= trim(p.name_first)
			query_qual->import_data[qcnt].middle_name					= trim(p.name_middle)
			query_qual->import_data[qcnt].MRN							= hold_mrn
 		endif
 
 	foot report
 		query_qual->qual_cnt = qcnt
 		stat = alterlist(query_qual->import_data,query_qual->qual_cnt)
	with nocounter
 
	SET ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
	  set failed = 1
	  set fail_operation = "QUERY DATA FAILURE"
	  call replyFailure(null)
    endif
 
	call log_message(build("Exit queryImportData(), Elapsed time in seconds:",
	datetimediff(cnvtdatetime(curdate,curtime3),BEGIN_DATE_TIME, 5)), LOG_LEVEL_DEBUG)
end ;queryImportData
 
 
subroutine AuditCondition(null)
	call log_message("In AuditCondition()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(cnvtdatetime(curdate, curtime3)), private
 
	select into "nl:"
	from
		(dummyt d1 with seq = size(IMPORT_CSV->import_data,5))
		,ac_class_def acd
 
	plan d1
		where d1.seq > 0
 
	join acd
		where acd.class_display_name_key = cnvtalphanum(cnvtupper(import_csv->import_data[d1.seq].condition))
		and acd.logical_domain_id = access_qual->logical_domain_id
		and acd.class_type_flag = 2 ;CONDITION
		and acd.active_ind = 1
        and acd.begin_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and acd.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
	order
		d1.seq
	detail
		if (acd.ac_class_def_id > 0)
 			import_csv->import_data[d1.seq].CONDITION_ID = acd.ac_class_def_id
 			import_csv->import_data[d1.seq].CONDITION = acd.class_display_name
 		;considering NONE to be a valid condition
		elseif ( (acd.ac_class_def_id = 0) and (cnvtalphanum(cnvtupper(import_csv->import_data[d1.seq].condition))= "NONE") )
 			import_csv->import_data[d1.seq].CONDITION_ID = 0
			import_csv->import_data[d1.seq].CONDITION = cnvtupper(import_csv->import_data[d1.seq].condition)
 		else
			import_csv->import_data[d1.seq].CONDITION_ID = -1
			import_csv->import_data[d1.seq].CONDITION = import_csv->import_data[d1.seq].condition
 		endif
 
	with nocounter, outerjoin = d1
 
	SET ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
	  set failed = 1
	  set fail_operation = "AUDIT CONDITION FAILURE"
	  call replyFailure(null)
    endif
 
	call log_message(build("Exit AuditCondition(), Elapsed time in seconds:",
	datetimediff(cnvtdatetime(curdate,curtime3),BEGIN_DATE_TIME, 5)), LOG_LEVEL_DEBUG)
end ;AuditCondition
 
 
subroutine AuditPerson(null)
	call log_message("In AuditPerson()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(cnvtdatetime(curdate, curtime3)), private
 	declare BATCH_AUDIT_TIME = dq8
 
 	declare tempmrnstring = vc with noconstant(FILLSTRING(255," "))
 	declare eOrg = i4 with noconstant (0)
 	;001+
	declare impBatchSize 	= i4 with constant(200)
	declare impBatchCnt		= i4 with noconstant(0)
	declare imp_begloop		= i4 with noconstant(0)
	declare imp_endloop		= i4 with noconstant(0)
	declare imp_numrecs		= i4 with noconstant(0)
 
	;Deriving number of batches to be executed.
	set impBatchCnt = ceil(cnvtreal(size(import_csv->import_data,5)) / impBatchSize)

	call log_message(build("Import Batch Count: ",trim(cnvtstring(impBatchCnt))), LOG_LEVEL_DEBUG)
	
	if (impBatchCnt > 0)
 
		for (bidx = 1 to impBatchCnt)
			set BATCH_AUDIT_TIME = cnvtdatetime(curdate, curtime3)
 
			call log_message(build("Begin Batch #: ", trim(cnvtstring(bidx))), LOG_LEVEL_DEBUG)
 
			set stat = assign(imp_begloop, EVALUATE(bidx,1,1,imp_begloop + impBatchSize))
			set stat = assign(imp_endloop, EVALUATE2(if((imp_begloop + (impBatchSize-1)) > size(import_csv->import_data,5))
											imp_begloop + (MOD(size(import_csv->import_data,5),impBatchSize) - 1)
									   else
											imp_begloop + (impBatchSize - 1)
									   endif
									   ))
			set stat = assign(imp_numrecs, EVALUATE2(if((imp_begloop + (impBatchSize-1)) > size(import_csv->import_data,5))
														MOD(size(import_csv->import_data,5),impBatchSize)
												   else
														impBatchSize
												   endif
												   ))
			set stat = initrec(temp_imprec)
			set stat = alterlist(temp_imprec->import_data,imp_numrecs)
			set stat = movereclist(import_csv->import_data,temp_imprec->import_data,imp_begloop,1,imp_numrecs,FALSE)
	
			call log_message(build("Loop Records: ",trim(cnvtstring(imp_begloop)),"-->",trim(cnvtstring(imp_endloop))), LOG_LEVEL_DEBUG)
			call log_message(build("Number of Records to Move: ",trim(cnvtstring(imp_numrecs))), LOG_LEVEL_DEBUG)
			call log_message("Begin Option 1 - based on person id and selected demographic fields", LOG_LEVEL_DEBUG)
 		;001-
 			;Select to query the persons in the import record against person records in database
			select into "nl:"
			from
				(dummyt d1 with seq = size(temp_imprec->import_data,5))
				,person p
				,person_alias pa
			plan d1
				where d1.seq > 0
                and temp_imprec->import_data[d1.seq].match_person_id > 0
		 	join p
				where p.person_id = temp_imprec->import_data[d1.seq].match_person_id
                and p.logical_domain_id = access_qual->logical_domain_id
                and p.name_first_key = cnvtalphanum(cnvtupper(temp_imprec->import_data[d1.seq].first_name))
                and p.active_ind = 1
                and p.sex_cd = (select cv.code_value from code_value cv
                                where cv.code_set = 57
                                and cv.active_ind = 1
                                and substring(1,1,cv.display_key) =
                                    substring(1,1,cnvtalphanum(cnvtupper(trim(temp_imprec->import_data[d1.seq].SEX))))
                                )
				and EXISTS
	                ( select 1 from encounter e
	                    where e.person_id = p.person_id
	                    and e.organization_id = cnvtreal(IMPORT_CSV->organization_id)
	                    and e.active_ind = 1
	                )
			;outerjoin person_alias table - not all person's may have MRN alias
			join pa
				where pa.person_id = outerjoin(p.person_id)
				and pa.active_ind = outerjoin(1)
		        and pa.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
				and pa.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
				and pa.person_alias_type_cd = outerjoin(4_MRN)
 
			order
				d1.seq
 
			head report
 				p_match_cnt = 0
 				imprec_pos = 0 ;001
			head d1.seq
				;001+
				imprec_pos = 0
				imprec_seq = 0
				imprec_pos = locateval(imprec_seq,imp_begloop,imp_endloop,
					temp_imprec->import_data[d1.seq].DUP_ID,IMPORT_CSV->IMPORT_DATA[imprec_seq].DUP_ID)
				;001-
				
				if (debug_mode = 1)
					call log_message(concat("imprec_pos : ",trim(cnvtstring(imprec_pos))),LOG_LEVEL_DEBUG)
					call log_message("***Starting AUDIT Person:",LOG_LEVEL_DEBUG)
					call log_message(trim(build("Name: ",import_csv->import_data[imprec_pos].name_full_formatted)),LOG_LEVEL_DEBUG)
					call log_message(trim(build("  LAST_NAME: ",import_csv->import_data[imprec_pos].LAST_NAME)), LOG_LEVEL_DEBUG)
					call log_message(trim(build("  MATCH_PERSON_ID: ",
									trim(cnvtstring(import_csv->import_data[imprec_pos].MATCH_PERSON_ID)))), LOG_LEVEL_DEBUG)					
					call log_message(trim(build("  FIRST_NAME: ",import_csv->import_data[imprec_pos].FIRST_NAME)), LOG_LEVEL_DEBUG)
					call log_message(trim(build("  MIDDLE_NAME: ",import_csv->import_data[imprec_pos].MIDDLE_NAME)), LOG_LEVEL_DEBUG)
					call log_message(trim(build("  SEX: ",import_csv->import_data[imprec_pos].sex)), LOG_LEVEL_DEBUG)
					call log_message(trim(build("  dob: ",import_csv->import_data[imprec_pos].dob)), LOG_LEVEL_DEBUG)
					call log_message(trim(build("  MRN: ",import_csv->import_data[imprec_pos].MRN)), LOG_LEVEL_DEBUG)
				endif
				
				stat = initrec(person_match)
				p_match_cnt = 0
		 	head p.person_id
 		 		if (debug_mode = 1)
		 	 		call log_message(build("EVALUATING PERSON_ID : ",trim(cnvtstring(p.person_id)), " PERSON #: ",
		 	 			trim(cnvtstring(imprec_pos)) ),LOG_LEVEL_DEBUG)
		 		endif;(debug_mode = 1)
		 		
		 		;initalize for each person's set of MRNs
				tempmrnstring = ""
 
			detail
                ; build each person's MRN into a string containing all of their MRNs
                tempmrnstring = build2(trim(tempmrnstring),";",trim(pa.alias))
 
			foot p.person_id
 
				if ((import_csv->import_data[imprec_pos].match_person_id > 0) and (p.person_id > 0))
                    ;set match_person_ind to TRUE if DOB matches for the person
                    matched_person_ind = TRUE
                endif
 
                ;Add person the person_match record if person was a match based on import_csv criteria
                if (matched_person_ind = TRUE)
                    p_match_cnt = p_match_cnt + 1
                    stat = alterlist(person_match->qual,p_match_cnt)
 
                    person_match->qual[p_match_cnt].MATCH_PERSON_ID 		= p.person_id
                    person_match->qual[p_match_cnt].LAST_NAME				= trim(p.name_last)
                    person_match->qual[p_match_cnt].FIRST_NAME				= trim(p.name_first)
                    person_match->qual[p_match_cnt].MIDDLE_NAME				= trim(p.name_middle)
                    person_match->qual[p_match_cnt].NAME_FULL_FORMATTED		= trim(p.name_full_formatted)
                    person_match->qual[p_match_cnt].MRN						= trim(replace(replace(trim(tempmrnstring),";","",1),";","; "))
                    person_match->qual[p_match_cnt].SEX					= trim(uar_get_code_display(p.sex_cd))
                    person_match->qual[p_match_cnt].DOB						= datetimezoneformat(p.birth_dt_tm,p.birth_tz,"MM/DD/YYYY")
 
                endif ;(matched_person_ind = TRUE)
 
			foot d1.seq
 
                if (debug_mode = 1)
					call log_message(build("Person Match Record Size: ",
						trim(cnvtstring(size(person_match->qual,5)))),LOG_LEVEL_DEBUG)
					call log_message("***END AUDIT Person ***",LOG_LEVEL_DEBUG)
                endif;(debug_mode = 1)
 
 
				;check when person_id is being used because not all fields may be populated
				;and we want to pull back and display
				;person information for the database to the end user based on the person
				;that was matched, even if they still have
				;missing information - would be a match if name_full_formatted was found
				if (size(person_match->qual,5) = 1)
					;populate with data from person record in database to reply back in json record
					import_csv->import_data[imprec_pos].MATCH_PERSON_ID 		= person_match->qual[1].MATCH_PERSON_ID
					import_csv->import_data[imprec_pos].LAST_NAME				= person_match->qual[1].LAST_NAME
					import_csv->import_data[imprec_pos].FIRST_NAME				= person_match->qual[1].FIRST_NAME
					import_csv->import_data[imprec_pos].MIDDLE_NAME				= person_match->qual[1].MIDDLE_NAME
					import_csv->import_data[imprec_pos].NAME_FULL_FORMATTED		= person_match->qual[1].NAME_FULL_FORMATTED
					import_csv->import_data[imprec_pos].MRN						= person_match->qual[1].MRN
					import_csv->import_data[imprec_pos].SEX						= person_match->qual[1].SEX
					import_csv->import_data[imprec_pos].DOB						= person_match->qual[1].DOB
 
				;if no person match was found ensure match_person_id is 0
				;so it does not qualify as success and carry forward
				;data entered in import csv file data fields, also then
				;the record can be "search/ignore" in registry import
				else
					import_csv->import_data[imprec_pos].MATCH_PERSON_ID = 0.00
				endif ;(size(person_match->qual,5) = 1)
 
			with nocounter, outerjoin = d1

			call log_message("Begin Option 2 - based on demographics only", LOG_LEVEL_DEBUG)
			
			;Select to query the persons in the import record against person records in database
			select into "nl:"
			from
				(dummyt d1 with seq = size(temp_imprec->import_data,5))
				,person p
				,person_alias pa
			plan d1
				where d1.seq > 0
				and temp_imprec->import_data[d1.seq].match_person_id = 0
		 	join p
				where p.name_last_key = cnvtalphanum(cnvtupper(temp_imprec->import_data[d1.seq].last_name))
						and p.name_first_key = cnvtalphanum(cnvtupper(temp_imprec->import_data[d1.seq].first_name))
						and p.logical_domain_id = access_qual->logical_domain_id
						and p.active_ind = 1
						and p.sex_cd = (select cv.code_value from code_value cv
										where cv.code_set = 57
		                                and cv.active_ind = 1
										and substring(1,1,cv.display_key) =
											substring(1,1,cnvtalphanum(cnvtupper(trim(temp_imprec->import_data[d1.seq].SEX))) )
										)
			and EXISTS
                ( select 1 from encounter e
                    where e.person_id = p.person_id
                    and e.organization_id = cnvtreal(IMPORT_CSV->organization_id)
                    and e.active_ind = 1
                )
			;outerjoin person_alias table - not all person's may have MRN alias
			join pa
				where pa.person_id = outerjoin(p.person_id)
				and pa.active_ind = outerjoin(1)
		        and pa.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
				and pa.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
				and pa.person_alias_type_cd = outerjoin(4_MRN)
 
			order
				d1.seq
 
			head report
 
				mrnchk = FALSE ;flag to use optional MRN alias for person matching
				midnmchk = FALSE ;flag to use option middle name for person matching
                p_match_cnt = 0
 				imprec_pos = 0 ;001
                matched_person_ind = FALSE

			head d1.seq
				;001+
				imprec_pos = 0
				imprec_seq = 0
				imprec_pos = locateval(imprec_seq,imp_begloop,imp_endloop,
					temp_imprec->import_data[d1.seq].DUP_ID,IMPORT_CSV->IMPORT_DATA[imprec_seq].DUP_ID)
 
				if (debug_mode = 1)
					call log_message(concat("imprec_pos : ",trim(cnvtstring(imprec_pos))),LOG_LEVEL_DEBUG)
					call log_message("***Starting AUDIT Person:",LOG_LEVEL_DEBUG)
					call log_message(trim(build("Name: ",import_csv->import_data[imprec_pos].name_full_formatted)),LOG_LEVEL_DEBUG)
					call log_message(trim(build("  LAST_NAME: ",import_csv->import_data[imprec_pos].LAST_NAME)), LOG_LEVEL_DEBUG)
					call log_message(trim(build("  FIRST_NAME: ",import_csv->import_data[imprec_pos].FIRST_NAME)), LOG_LEVEL_DEBUG)
					call log_message(trim(build("  MIDDLE_NAME: ",import_csv->import_data[imprec_pos].MIDDLE_NAME)), LOG_LEVEL_DEBUG)
					call log_message(trim(build("  SEX: ",import_csv->import_data[imprec_pos].sex)), LOG_LEVEL_DEBUG)
					call log_message(trim(build("  dob: ",import_csv->import_data[imprec_pos].dob)), LOG_LEVEL_DEBUG)
					call log_message(trim(build("  MRN: ",import_csv->import_data[imprec_pos].MRN)), LOG_LEVEL_DEBUG)
 
				endif
				;001-
 
				;initialize counters and varibles
				pcnt = 0
				mrncnt = 0
				midnmcnt = 0
		        matchmrnstring = FILLSTRING(255," ")
		        dob_month = FILLSTRING(255," ")
				dob_day   = FILLSTRING(255," ")
				dob_year  = FILLSTRING(255," ")
				dob_full  = FILLSTRING(255," ")
 
                ;check if mrn is sent in the import record
 
                if (size(trim(import_csv->import_data[imprec_pos].mrn,3)) > 0)
                    mrnchk = TRUE
                else
                    ;not using mrn for matching
                    mrnchk = FALSE
                endif
                ;check if using middle name for matching
 
                if (size(trim(import_csv->import_data[imprec_pos].middle_name,3)) > 0)
                    midnmchk = TRUE
                else
                    ;not using middle name for matching
                    midnmchk = FALSE
                endif
 
                ;initialize person_match record before processing the potential person matches
                stat = initrec(person_match)
                p_match_cnt = 0
 
		 	head p.person_id
 
		 		prsnmrncnt = 0 ;counter for each person's MRNs
                matched_person_ind = FALSE
		 		;perform delimiter check in DOB (only accepting "/" or "-" as delimiter and format = Month<delimiter>Day<delimiter>Year
 
		 		if (debug_mode = 1)
		 	 		call log_message(build("EVALUATING PERSON_ID : ",trim(cnvtstring(p.person_id)), " PERSON #: ",
		 	 			trim(cnvtstring(imprec_pos)) ),LOG_LEVEL_DEBUG)
		 		endif;(debug_mode = 1)
 
		 		;initalize for each person's set of MRNs
				tempmrnstring = ""
 
			detail
 
			; build each person's MRN into a string containing all of their MRNs
			tempmrnstring = build2(trim(tempmrnstring),";",trim(pa.alias))
 
		 	;check if MRN is sent in the import record
			if ( (mrnchk = TRUE) )
 
		 			if (debug_mode = 1)
		 				call log_message(build("MRN STRING: ",import_csv->import_data[imprec_pos].mrn),LOG_LEVEL_DEBUG)
		 			endif;(debug_mode = 1)
 
					mrn_tot = 0
					pos_start = 1
 
					test_string=FINDSTRING(";", import_csv->import_data[imprec_pos].mrn, pos_start)
 
					if (debug_mode = 1)
						call log_message(build("FIND SEMI-COLON: ",	trim(cnvtstring(test_string))),LOG_LEVEL_DEBUG)
					endif;(debug_mode = 1)
 
					;check if optional mrn field has multiple mrn aliases separated by semicolons
					if (FINDSTRING(";", import_csv->import_data[imprec_pos].mrn, pos_start) > 0)
		 				;check if first character of imported MRN field is a semicolon remove it
		 				if (FINDSTRING(";", import_csv->import_data[imprec_pos].mrn, pos_start) = 1)
		 					import_csv->import_data[imprec_pos].mrn = REPLACE(import_csv->import_data[imprec_pos].mrn,";","",1)
		 				endif
		 				;loop through the imported MRN record string and parse out each MRN if when multiple are provided
						while ( (pos_start > 0) )
							mrn_tot = mrn_tot + 1 ;counting MRNs provided in import record, also used for PIECE function to parse out MRNs
 
							;build temporary record structure based on total MRN's in import field
							stat = alterlist (mrn_qual->qual,mrn_tot)
 
							;populate temporary record structure with MRN's in import field using PIECE
							mrn_qual->qual[mrn_tot]->alias = PIECE(trim(import_csv->import_data[imprec_pos].mrn,3),";",mrn_tot,"NoAlias")
							pos_start = FINDSTRING(";", import_csv->import_data[imprec_pos].mrn, pos_start+1)
 
							if (debug_mode = 1)
		 						call log_message(build("MRN #: ",mrn_tot, " MRN PIECE: ",mrn_qual->qual[mrn_tot]->alias),LOG_LEVEL_DEBUG)
		 						call log_message(build("Check Alias ",mrn_tot, " = ", mrn_qual->qual[mrn_tot]->alias),LOG_LEVEL_DEBUG)
		 					endif;(debug_mode = 1)
 
		 					;checking each MRN sent in the import record matches to a person's MRN
							if ( (pa.alias = mrn_qual->qual[mrn_tot]->alias) )
 
								;keep count of all MRN's that match to person's MRN (only for this instance of the import record)
								mrncnt = mrncnt + 1
 
								;keep count of all MRN's that match to person's MRN (only for this person)
								prsnmrncnt = prsnmrncnt + 1 ;keep count of all MRN's that match to person's MRN (only for this person)
 
								;setting if MRN in the import record matches to the person's MRN
								matchmrnstring = mrn_qual->qual[mrn_tot]->alias
 
								if (debug_mode = 1)
									call log_message(build("Matching Alias ",mrn_tot, " = ",
										mrn_qual->qual[mrn_tot]->alias),LOG_LEVEL_DEBUG)
		 						endif;(debug_mode = 1)
 
 
							endif;( (pa.alias = mrn_qual->qual[mrn_tot]->alias) )
 
						endwhile;( (pos_start > 0) )
 
					else ;mulitple MRNs not in the import record, use entire value as MRN
 
						;build temporary record structure and populate the one MRN from the import field
						stat = alterlist (mrn_qual->qual,1)
 
						mrn_qual->qual[1]->alias = trim(import_csv->import_data[imprec_pos].mrn,3)
 
		 					;checking if the MRN sent in the import record matches to a person's MRN
							if ( (pa.alias = mrn_qual->qual[1]->alias) )
 
								;add to count of all MRN's that match to person's MRN (only one instance in the import record)
								mrncnt = mrncnt + 1
 
								;add to count of all MRN's that match to person's MRN (only for this person)
								prsnmrncnt = prsnmrncnt + 1
 
								;setting if MRN in the import record matches to the person's MRN
								matchmrnstring = mrn_qual->qual[1]->alias
 
								if (debug_mode = 1)
									call log_message(build("Matching Alias ",mrn_tot, " = ",
										mrn_qual->qual[mrn_tot]->alias),LOG_LEVEL_DEBUG)
		 						endif;(debug_mode = 1)
 
							endif;( (pa.alias = mrn_qual->qual[1]->alias) )
 
					endif;(FINDSTRING(";", import_csv->import_data[imprec_pos].mrn, pos_start) > 0)
 
			endif;(mrnchk = TRUE)
 
			foot p.person_id
                ;format DOB to create match string
 				if (FINDSTRING("/", import_csv->import_data[imprec_pos].DOB, 1) > 0)
					dob_month = PIECE(trim(import_csv->import_data[imprec_pos].DOB,3),"/",1,"NoMonth")
					dob_day   = PIECE(trim(import_csv->import_data[imprec_pos].DOB,3),"/",2,"NoDay")
					dob_year  = PIECE(trim(import_csv->import_data[imprec_pos].DOB,3),"/",3,"NoYear")
					dob_full  = BUILD(trim(dob_year,3),FORMAT(trim(dob_month,3), "##;P0"),FORMAT(trim(dob_day,3), "##;P0") )
				elseif (FINDSTRING("-", import_csv->import_data[imprec_pos].DOB, 1) > 0)
					dob_month = PIECE(trim(import_csv->import_data[imprec_pos].DOB,3),"-",1,"NoMonth")
					dob_day   = PIECE(trim(import_csv->import_data[imprec_pos].DOB,3),"-",2,"NoDay")
					dob_year  = PIECE(trim(import_csv->import_data[imprec_pos].DOB,3),"-",3,"NoYear")
					dob_full  = BUILD(trim(dob_year,3),FORMAT(trim(dob_month,3), "##;P0"),FORMAT(trim(dob_day,3), "##;P0") )
				;001-
				else
					;if delimiters are not found DOB is set to null
					dob_full  = ""
				endif
 
                ;DOB is a required match
		        if ((cnvtdate2(datetimezoneformat(p.birth_dt_tm,p.birth_tz,"MM/DD/YYYY"),"MM/DD/YYYY")) = cnvtdate2(dob_full, "YYYYMMDD"))
                    ;set match_person_ind to TRUE if DOB matches for the person
                    matched_person_ind = TRUE
 
                    if (debug_mode = 1)
                		call log_message("DOB Match",LOG_LEVEL_DEBUG)
               		endif
                    ;Evaluate Middle Name if check is on
                    if (midnmchk = TRUE)
                    	if (debug_mode = 1)
                			call log_message("Middle Name Match ON",LOG_LEVEL_DEBUG)
                			call log_message(build("Import Middle Name: ",
                								cnvtalphanum(cnvtupper(trim(import_csv->import_data[imprec_pos].middle_name,3))),
                									"-->Person Middle Name: ",p.name_middle_key),LOG_LEVEL_DEBUG)
						endif
                        ;check if middle was sent in import record and if it was complete middle name or just initial
                        ;if middle name check is on and a match is not created set the match_person_ind to false
                        ;to indicate the person should not be added to person_match record
                        if (size(trim(import_csv->import_data[imprec_pos].middle_name,3)) = 1)
                            if ( SUBSTRING(1,1,p.name_middle_key) !=
                            				cnvtalphanum(cnvtupper(trim(import_csv->import_data[imprec_pos].middle_name,3))) )
                                matched_person_ind = FALSE
 
								if (debug_mode = 1)
                					call log_message("Single Character Middle Name Match Failure",LOG_LEVEL_DEBUG)
               					endif
 
                            endif
                        elseif(size(trim(import_csv->import_data[imprec_pos].middle_name,3)) > 1)
                        	if ( p.name_middle_key !=
                        		cnvtalphanum(cnvtupper(trim(import_csv->import_data[imprec_pos].middle_name,3))) )
                                matched_person_ind = FALSE
 
                                if (debug_mode = 1)
                					call log_message("Full Middle Name Match Failure",LOG_LEVEL_DEBUG)
               					endif
                            endif
                        endif
                    endif
 
                    ;Evaluate MRN if check is on
                    if (mrnchk = TRUE)
                    	if (debug_mode = 1)
                			call log_message("MRN Match ON",LOG_LEVEL_DEBUG)
							call log_message(build("Import MRN: ",cnvtupper(trim(import_csv->import_data[imprec_pos].MRN,3)),
                									"-->Person MRN: ",trim(tempmrnstring)),LOG_LEVEL_DEBUG)
						endif
                        ;If MRN check is on and didnt create a match or created more than
                        ;one match do not add person to the person_match record
                        if ((mrncnt = 0) or (mrncnt > 1))
                            matched_person_ind = FALSE
                            if (debug_mode = 1)
                				call log_message("MRN Match Failure",LOG_LEVEL_DEBUG)
               				endif
                        endif
                    endif
                else
					if (debug_mode = 1)
						call log_message("DOB Match Failure",LOG_LEVEL_DEBUG)
					endif
                endif
 
                ;Add person the person_match record if person was a match based on import_csv criteria
                if (matched_person_ind = TRUE)
                    p_match_cnt = p_match_cnt + 1
                    stat = alterlist(person_match->qual,p_match_cnt)
 
                    person_match->qual[p_match_cnt].MATCH_PERSON_ID 		= p.person_id
                    person_match->qual[p_match_cnt].LAST_NAME				= trim(p.name_last)
                    person_match->qual[p_match_cnt].FIRST_NAME				= trim(p.name_first)
                    person_match->qual[p_match_cnt].MIDDLE_NAME				= trim(p.name_middle)
                    person_match->qual[p_match_cnt].NAME_FULL_FORMATTED		= trim(p.name_full_formatted)
                    person_match->qual[p_match_cnt].MRN						= trim(replace(replace(trim(tempmrnstring),";","",1),";","; "))
                    person_match->qual[p_match_cnt].SEX					= trim(uar_get_code_display(p.sex_cd))
                    person_match->qual[p_match_cnt].DOB						= datetimezoneformat(p.birth_dt_tm,p.birth_tz,"MM/DD/YYYY")
 
                endif ;(matched_person_ind = TRUE)
 
			foot d1.seq
 
				if (debug_mode = 1)
			 		call log_message(build("Person Match Record Size: ",trim(cnvtstring(size(person_match->qual,5)))),LOG_LEVEL_DEBUG)
			 		call log_message("***END AUDIT Person ***",LOG_LEVEL_DEBUG)
				endif;(debug_mode = 1)
 
 
				;check when person_id is being used because not all fields may be populated and we want to pull back and display
				;person information for the database to the end user based on the person that was matched, even if they still have
				;missing information - would be a match if name_full_formatted was found
				if (size(person_match->qual,5) = 1)
                    ;populate with data from person record in database to reply back in json record
                    import_csv->import_data[imprec_pos].MATCH_PERSON_ID 		= person_match->qual[1].MATCH_PERSON_ID
                    import_csv->import_data[imprec_pos].LAST_NAME				= person_match->qual[1].LAST_NAME
                    import_csv->import_data[imprec_pos].FIRST_NAME				= person_match->qual[1].FIRST_NAME
                    import_csv->import_data[imprec_pos].MIDDLE_NAME				= person_match->qual[1].MIDDLE_NAME
                    import_csv->import_data[imprec_pos].NAME_FULL_FORMATTED		= person_match->qual[1].NAME_FULL_FORMATTED
                    import_csv->import_data[imprec_pos].MRN						= person_match->qual[1].MRN
                    import_csv->import_data[imprec_pos].SEX						= person_match->qual[1].SEX
                    import_csv->import_data[imprec_pos].DOB						= person_match->qual[1].DOB
 
 
				;if no person match was found ensure match_person_id is 0
                ;so it does not qualify as success and carry forward
				;data entered in import csv file data fields, also then
				;the record can be "search/ignore" in registry import
				else
					import_csv->import_data[imprec_pos].MATCH_PERSON_ID = 0.00
				endif ;(size(person_match->qual,5) = 1)
 
			with nocounter, outerjoin = d1
 
			SET ERRCODE = ERROR(ERRMSG,0)
			if(ERRCODE != 0)
			  set failed = 1
			  set fail_operation = "AUDIT PERSON FAILURE"
			  call replyFailure(null)
		    endif
 
		    call log_message(build("End Batch #",trim(cnvtstring(bidx)),"--Elapsed time in seconds:",
				datetimediff(cnvtdatetime(curdate,curtime3),BATCH_AUDIT_TIME, 5)), LOG_LEVEL_DEBUG)
		endfor ;for (bidx = 1 to impBatchCnt)
	endif	;if (impBatchCnt > 0)
 
	SET ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
	  set failed = 1
	  set fail_operation = "AUDIT PERSON FAILURE"
	  call replyFailure(null)
    endif
 
 	if (debug_mode = 1)
		for (i=1 to size(IMPORT_CSV->IMPORT_DATA,5))
			call log_message(build("Record #: ",i, "  ***Starting AUDIT Person: ",
			trim(import_csv->import_data[i].name_full_formatted),"***"),LOG_LEVEL_DEBUG)
 
			call log_message(build("--MATCH_PERSON_ID: ",
			trim(cnvtstring(import_csv->import_data[i].MATCH_PERSON_ID))), LOG_LEVEL_DEBUG)
			call log_message(build("--LAST_NAME: ",trim(import_csv->import_data[i].LAST_NAME)), LOG_LEVEL_DEBUG)
			call log_message(build("--FIRST_NAME: ",trim(import_csv->import_data[i].FIRST_NAME)), LOG_LEVEL_DEBUG)
			call log_message(build("--MIDDLE_NAME: ",trim(import_csv->import_data[i].MIDDLE_NAME)), LOG_LEVEL_DEBUG)
			call log_message(build("--SEX: ",trim(import_csv->import_data[i].sex)), LOG_LEVEL_DEBUG)
			call log_message(build("--dob: ",trim(import_csv->import_data[i].dob)), LOG_LEVEL_DEBUG)
			call log_message(build("--MRN: ",trim(import_csv->import_data[i].MRN )), LOG_LEVEL_DEBUG)
			call log_message(build("***END AUDIT Person: ", trim(import_csv->import_data[i].name_full_formatted),"***"), LOG_LEVEL_DEBUG)
		endfor
	endif;(debug_mode = 1)
 
	call log_message(build("Exit AuditPerson(), Elapsed time in seconds:",
	datetimediff(cnvtdatetime(curdate,curtime3),BEGIN_DATE_TIME, 5)), LOG_LEVEL_DEBUG)
end ;AuditPerson
 
 
subroutine AuditSuccessFailure(null)
	call log_message("In AuditSuccessFailure()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(cnvtdatetime(curdate, curtime3)), private
 
	for (rec_loop = 1 to size(import_csv->import_data,5))
		if ( (import_csv->import_data[rec_loop].MATCH_PERSON_ID > 0) and
		   	 (import_csv->import_data[rec_loop].CONDITION_ID >= 0) and
		   	 (size(trim(import_csv->import_data[rec_loop].NAME_FULL_FORMATTED,3)) > 0)
		   )
			set import_csv->SUCCESS_CNT = import_csv->SUCCESS_CNT + 1
			set import_csv->import_data[rec_loop].GROUPID = 0
		elseif
			( (import_csv->import_data[rec_loop].MATCH_PERSON_ID = 0) or
		   	 (import_csv->import_data[rec_loop].CONDITION_ID < 0) or
		   	 (size(trim(import_csv->import_data[rec_loop].NAME_FULL_FORMATTED,3)) = 0)
		   )
			set import_csv->FAILURE_CNT = import_csv->FAILURE_CNT + 1
			set import_csv->import_data[rec_loop].GROUPID = 2
		endif
	endfor
 
	call log_message(build("Exit AuditSuccessFailure(), Elapsed time in seconds:",
	datetimediff(cnvtdatetime(curdate,curtime3),BEGIN_DATE_TIME, 5)), LOG_LEVEL_DEBUG)
end ;AuditSuccessFailure
 
subroutine generateTemplate(null)

	call log_message("In generateTemplate()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(cnvtdatetime(curdate, curtime3)), private

 
 
 
 	record rec (
       1 list [*]  
              2 condition = c40  
              2 last = c40  
              2 first = c40  
              2 middle = c40
              2 sex = c40
              2 dob = c40
              2 mrn = c40  )
 
	declare cnt = i4 with noconstant(1),Protect
 
 	;declare/set variables - could just put these values directly into the first position of the record
	set conditionCol = piece(template_params, "," , 1, "")
	set lastNameCol = piece(template_params, "," , 2, "")
	set firstNameCol = piece(template_params, "," , 3, "")
	set middleNameCol = piece(template_params, "," , 4, "")
	set sexCol = piece(template_params, "," , 5, "")
	set dobCol = piece(template_params, "," , 6, "")
	set mrnCol = piece(template_params, "," , 7, "")
	set dobValue = piece(template_params, "," , 8, "")
	set sexValue = piece(template_params, "," , 9, "")
	set conditionValue = piece(template_params, "," , 10, "")
	
	;	declare dcondition = c40 with noconstant("ExampleCondition"),Protect
	;store header row values, 
	set stat = alterlist(rec->list,50)
	set rec->list[cnt].condition = conditionCol
	set rec->list[cnt].first = firstNameCol
	set rec->list[cnt].last = lastNameCol
	set rec->list[cnt].middle = middleNameCol
	set rec->list[cnt].sex = sexCol
	set rec->list[cnt].dob = dobCol
	set rec->list[cnt].mrn = mrnCol
	;select data and load into additional positions of record structure
	select into "NL     :"
	from dummyt
	head report
	      row +0
	detail
	      cnt = cnt +1 ;don't reset to cnt to 0 in this select or you overwrite the header row in the record structure list
	      if(mod(cnt,50) = 1 and cnt > 50)
	            stat = alterlist(rec->list,cnt +49)
	      endif
	      rec->list[cnt].condition = conditionValue
	      rec->list[cnt].middle = "Example"
	      rec->list[cnt].first = "Jane"
	      rec->list[cnt].last = "Doe"
	      rec->list[cnt].sex = sexValue
		  rec->list[cnt].dob = dobValue
		  rec->list[cnt].mrn = "123456789"
	foot report
	      stat = alterlist(rec->list,cnt)
	with format, separator = " ", time = 30, maxrec = 100
	;use select with NOHEADER to display data and headers
	select into $outdev
	      list_condition = rec->list[d1.seq].condition
	      , list_last = rec->list[d1.seq].last
	      , list_first = rec->list[d1.seq].first
	      , list_middle = rec->list[d1.seq].middle
	      , list_sex = rec->list[d1.seq].sex
	      , list_dob = rec->list[d1.seq].dob
	      , list_mrn = rec->list[d1.seq].mrn
	from
	      (dummyt   d1  with seq = value(size(rec->list, 5)))
	plan d1
	with nocounter, separator=" ", format, NOHEADING
	
 
 	
	SET ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
	  set failed = 1
	  set fail_operation = "GENERATE TEMPLATE FAILURE"
	  call replyFailure(null)
    endif
 
	call log_message(build("Exit generateTemplate(), Elapsed time in seconds:",
	datetimediff(cnvtdatetime(curdate,curtime3),BEGIN_DATE_TIME, 5)), LOG_LEVEL_DEBUG)
end;generateTemplate
 
subroutine exportList(null)
	call log_message("In exportList()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(cnvtdatetime(curdate, curtime3)), private
 
 	if (validate(EXP_IMPORT))
 		select into $OUTDEV
 			condition = trim(substring(1,255,EXP_IMPORT->qual[d1.seq].condition)),
			last_name = trim(substring(1,255,EXP_IMPORT->qual[d1.seq].last_name)),
			first_name = trim(substring(1,255,EXP_IMPORT->qual[d1.seq].first_name)),
			middle_name = trim(substring(1,255,EXP_IMPORT->qual[d1.seq].middle_name)),
			sex = trim(substring(1,255,EXP_IMPORT->qual[d1.seq].sex)),
			DOB = trim(substring(1,255,EXP_IMPORT->qual[d1.seq].DOB)),
			MRN = trim(substring(1,255,EXP_IMPORT->qual[d1.seq].MRN)),
			Match_person_id = EXP_IMPORT->qual[d1.seq].Match_person_id
 		from
 		(dummyt d1 with seq = size(EXP_IMPORT->qual,5))
 		plan d1
 			where d1.seq > 0
 		with nocounter,SEPARATOR=" ", FORMAT
 	elseif(validate(EXP_MANAGE))
 	 	select into $OUTDEV
 	 	 	condition = trim(substring(1,255,EXP_MANAGE->qual[d1.seq].condition)),
			last_name = trim(substring(1,255,EXP_MANAGE->qual[d1.seq].last_name)),
			first_name = trim(substring(1,255,EXP_MANAGE->qual[d1.seq].first_name)),
			middle_name = trim(substring(1,255,EXP_MANAGE->qual[d1.seq].middle_name)),
			sex = trim(substring(1,255,EXP_MANAGE->qual[d1.seq].sex)),
			DOB = trim(substring(1,255,EXP_MANAGE->qual[d1.seq].DOB)),
			MRN = trim(substring(1,255,EXP_MANAGE->qual[d1.seq].MRN)),
			Match_person_id = EXP_MANAGE->qual[d1.seq].Match_person_id,
			registry = trim(substring(1,255,EXP_MANAGE->qual[d1.seq].registry)),
			Location = trim(substring(1,255,EXP_MANAGE->qual[d1.seq].location_name)),
			Date_added = trim(substring(1,255,EXP_MANAGE->qual[d1.seq].import_dt_tm))
 		from
 		(dummyt d1 with seq = size(EXP_MANAGE->qual,5))
 		plan d1
 			where d1.seq > 0
 		with nocounter,SEPARATOR=" ", FORMAT
 	endif
 
	SET ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
	  set failed = 1
	  set fail_operation = "EXPORT FAILURE"
	  call replyFailure(null)
    endif
 
	call log_message(build("Exit exportList(), Elapsed time in seconds:",
	datetimediff(cnvtdatetime(curdate,curtime3),BEGIN_DATE_TIME, 5)), LOG_LEVEL_DEBUG)
end;exportList
 
subroutine replyFailure(null)
	call log_message("In replyFailure()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(cnvtdatetime(curdate, curtime3)), private
 
	rollback
  	set reply->status_data.status = "F"
  	set reply->status_data.subeventstatus[1].OperationName = fail_operation
  	set reply->status_data.subeventstatus[1].OperationStatus = "F"
  	set reply->status_data.subeventstatus[1].TargetObjectName = ACTION_MEAN
  	set reply->status_data.subeventstatus[1].TargetObjectValue = ERRMSG
 
    call log_message(trim(reply->status_data.subeventstatus[1].TargetObjectValue), LOG_LEVEL_ERROR)
 
  	call CnvtCCLRec(reply)
 
  	call log_message(build("Exit replyFailure(), Elapsed time in seconds:",
	datetimediff(cnvtdatetime(curdate,curtime3),BEGIN_DATE_TIME, 5)), LOG_LEVEL_DEBUG)
 
  	go to EXIT_SCRIPT
end
 
subroutine CnvtCCLRec(CCL_QUAL)
	call log_message("In CnvtCCLRec()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(cnvtdatetime(curdate, curtime3)), private
	declare strJSON = vc
	declare _Memory_Reply_String = vc
 
	set strJSON = cnvtrectojson(CCL_QUAL)
	set _Memory_Reply_String = strJSON
 
	call log_message(build("Exit CnvtCCLRec(), Elapsed time in seconds:",
	datetimediff(cnvtdatetime(curdate,curtime3),BEGIN_DATE_TIME, 5)), LOG_LEVEL_DEBUG)
end ;CnvtCCLRec
 
 
#EXIT_SCRIPT
if (validate(IMPORT_CSV))
    if (debug_mode = 1)
        call echorecord(IMPORT_CSV)
    endif
 
	free record IMPORT_CSV
endif
 
if (validate(PERS_LOOKUP))
    if (debug_mode = 1)
        call echorecord(PERS_LOOKUP)
    endif
 
	free record PERS_LOOKUP
endif
 
if (validate(EXP_IMPORT))
    if (debug_mode = 1)
        call echorecord(EXP_IMPORT)
    endif
 
	free record EXP_IMPORT
endif
 
if (validate(EXP_MANAGE))
    if (debug_mode = 1)
        call echorecord(EXP_MANAGE)
    endif
 
	free record EXP_MANAGE
endif
 
if (debug_mode = 1)
    if(ACTION_MEAN in ("QUERYDATA","INACTIVATE"))
        call echorecord(query_qual)
    endif
    call echorecord(access_qual)
    call echorecord(reply)
endif
 
free record query_qual
free record access_qual
free record reply
free record person_match
free record temp_imprec
 
set modify maxvarlen 524288
 
call log_message(build("END MP_DCP_IMPORT_LIST, Elapsed time in seconds:",
datetimediff(cnvtdatetime(curdate,curtime3),BEGIN_DATE_TIME, 5)), LOG_LEVEL_DEBUG)
 
end go
