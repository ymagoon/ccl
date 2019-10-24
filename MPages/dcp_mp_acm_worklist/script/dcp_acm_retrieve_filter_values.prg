drop program dcp_acm_retrieve_filter_values:dba go
create program dcp_acm_retrieve_filter_values:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE" ,
	"JSON_ARGS:" = ""
 
with OUTDEV, JSON_ARGS
 
%i cclsource:mp_dcp_blob_in_params.inc
set stat = cnvtjsontorec(ExtractParamsFromRequest(request, $JSON_ARGS))
 
/*
record filter_request
(
	1 user_id = f8
	1 pos_cd = f8
	1 query_type_cd = f8
	1 filter_list[*]
	  2 argument_name = vc
)
*/
 
call echorecord(filter_request)
 
free record reply
record reply
(
	1 query_type_cd = f8
	1 filter_list[*]
		2 argument_name = vc
		2 code_set = f8
		2 available_values[*]
			3 argument_value = vc
			3 argument_meaning = vc
			3 argument_type = vc
			3 parent_entity_name = vc
			3 parent_entity_id = f8
			3 child_values[*]
				4 argument_value = vc
				4 parent_entity_name = vc
				4 parent_entity_id = f8
	1 risk_flag = i2 ;0 if risk values not found, 1 if values found
	1 case_status_flag = i2 ; 0 if case status values not found, 1 if values found
%i cclsource:status_block.inc
)
 
free record rule_consq_map
record rule_consq_map
(
	1 rule_list[*]
		2 name = vc
		2 consq_list[*]
			3 name = vc
)
 
free record encounters
record encounters
(
	1 encntr_data[*]
		2 argument_value = vc
		2 parent_entity_name = vc
		2 parent_entity_id = f8
)
 
 
%i cclsource:mp_dcp_pl_includes.inc
%i cclsource:mp_script_logging.inc
set modify maxvarlen 52428800
call log_message("In dcp_acm_retrieve_filter_values", LOG_LEVEL_DEBUG)
 
/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/
 
declare SaveAvailableValue(idx_filter=i4,idx_val=i4,arg_val=vc,arg_mean=vc,arg_type=vc,parent_name=vc,parent_id=f8) = NULL
declare RetrieveFacilities(filter_cnt = i4)             = NULL
declare RetrieveACMGroups(count = i4)             		= NULL
declare RetrieveCodeValues(code_set = f8, count = i4)   = NULL
declare RetrieveBarriers(NULL)              			= NULL
declare RetrieveProblems(NULL)              			= NULL
declare RetrieveConditions(count = i4)            		= NULL
declare RetrieveConsequentNames(cond_index = i4) 		= NULL
declare RetrieveDiagnosis(NULL)             			= NULL
declare RetrieveMeasures(NULL)              			= NULL
declare RetrieveRegistries(count = i4)                  = NULL
declare RetrieveEncounterTypeFromBedrock(count = i4)    = NULL
declare RetrieveAppointmentStatuses(count = i4)			= NULL
declare RetrieveOrderStatuses(count = i4)				= NULL
declare RetrieveExpectations(count = i4)				= NULL
declare RetrieveRiskLevels(count = i4)					= NULL
declare RetrieveCommunicationPrefs(filter_cnt = i4)		= NULL
declare RetrievePendingWorkTypes(filter_cnt = i4)		= NULL
declare GetCodeSet(filter_name = vc)        			= f8
declare replyFailure(NULL) 								= NULL
declare CnvtCCLRec(NULL) 			            		= NULL
 
/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
declare user_logical_domain_id = f8 with noconstant(0)
declare requested_filters_cnt = i4 with noconstant(0)
declare count = i4 with noconstant(0)
declare code_set = f8 with noconstant(0.0)
declare TABLE_EXISTS_WITH_ACCESS = i2 with constant(2), protect
declare fail_operation = vc
declare failed = i2 with NOCONSTANT(0)
 
declare dwl_category_id = f8 with noconstant(0.0)
declare pos_flex_id     = f8 with noconstant(0.0)
declare system_flex_id  = f8 with noconstant(0.0)
set dwl_category_id = GetCategoryId(DWL_CATEGORY_MEAN)
set pos_flex_id     = GetFlexId(filter_request->pos_cd)
set system_flex_id  = GetFlexId(0.0)
 
set reply->status_data->status = "Z"
set reply->query_type_cd = filter_request->query_type_cd
set ERRMSG =  FILLSTRING(132," ")
set ERRCODE = error(ERRMSG,1)
 
 
/**************************************************************
; DVDev Start Coding
**************************************************************/
 
select into "nl:"
from prsnl p
where p.person_id = filter_request->user_id
detail
  user_logical_domain_id = p.logical_domain_id
with nocounter
 
set ERRCODE = ERROR(ERRMSG,0)
if(ERRCODE != 0)
   set failed = 1
   set fail_operation = "Logical domain select"
   call replyFailure("SELECT")
endif
 
set requested_filters_cnt = size(filter_request->filter_list,5)
 
if (requested_filters_cnt > 0 )
   set stat = alterlist(reply->filter_list, requested_filters_cnt)
endif
 
; Determine if Case Status is being used.
; Check to see if there are any rows on the case status table.
if(CHECKDIC("ENCNTR_CMNTY_CASE", "T", 0) = TABLE_EXISTS_WITH_ACCESS)
	select into "nl:"
		rows = count(ecc.encntr_cmnty_case_id)
	from encntr_cmnty_case ecc
	head report
		if(rows > 0)	; Case status is being used.
			reply->case_status_flag = 1
		else
			reply->case_status_flag = 0
		endif
	with nocounter, maxqual(ecc, 1)
 
	set ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
	   set failed = 1
	   set fail_operation = "Determine Case Status Usage"
	   call replyFailure("SELECT")
	endif
endif
 
for(count=1 to requested_filters_cnt)
 
   set reply->filter_list[count]->argument_name = filter_request->filter_list[count]->argument_name
 
   if (filter_request->filter_list[count]->argument_name = ARGNAME_PPRCODE   or
	   filter_request->filter_list[count]->argument_name = ARGNAME_EPRCODE   or
	   filter_request->filter_list[count]->argument_name = ARGNAME_RACE      or
	   filter_request->filter_list[count]->argument_name = ARGNAME_GENDER    or
	   filter_request->filter_list[count]->argument_name = ARGNAME_LANGUAGE  or
	   filter_request->filter_list[count]->argument_name = ARGNAME_HEALTHPLAN     or
	   filter_request->filter_list[count]->argument_name = ARGNAME_FINANCIALCLASS  or
	   filter_request->filter_list[count]->argument_name = ARGNAME_CONFIDLEVEL or
	   filter_request->filter_list[count]->argument_name = ARGNAME_ORDERSTATUS or
	   (filter_request->filter_list[count]->argument_name = ARGNAME_CASESTATUS and reply->case_status_flag = 1))
 
 
		 set code_set = GetCodeSet( filter_request->filter_list[count]->argument_name )
		 if (code_set > 0.0)
			set reply->filter_list[count]->code_set = code_set
			call RetrieveCodeValues(code_set, count)
		 endif
   endif
 
   case(filter_request->filter_list[count]->argument_name)
      of ARGNAME_ACMGROUP:
      	 if(size(user_orgs->organizations, 5) <= 0)
      	 	call RetrieveAssociatedOrganizations(filter_request->user_id)
      	 endif
         call RetrieveACMGroups(count)
      of ARGNAME_CONDITION:
         call RetrieveConsequentNames(NULL)
         call RetrieveConditions(count)
      of ARGNAME_REGISTRY:
      	call RetrieveRegistries(count)
      of ARGNAME_ENCOUNTERTYPE:
  		 call RetrieveEncounterTypeFromBedrock(count)
  	  of ARGNAME_APPTSTATUS:
		 call RetrieveAppointmentStatuses(count)
	  of ARGNAME_ORDERSSTATUS:
	  	 call RetrieveOrderStatuses(count)
	  of ARGNAME_EXPECTATIONS:
	  	 call RetrieveExpectations(count)
	  of ARGNAME_RISK:
	  	call RetrieveRiskLevels(count)
	  of ARGNAME_COMMUNICATE_PREF:
		call RetrieveCommunicationPrefs(count)
	  of ARGNAME_PENDING_WORK:
		call RetrievePendingWorkTypes(count)
	  of ARGNAME_LOCATIONS:
	  	if(size(user_orgs->organizations, 5) <= 0)
      			call RetrieveAssociatedOrganizations(NULL)
      		endif
	  	call RetrieveFacilities(count)
   endcase
 
endfor
 
go to exit_script
 
#exit_script
 
if (reply->status_data->status = "Z")
	set reply->status_data->status = "S"
endif
 
call echo(failed)
call echorecord(reply)
if(failed = 0)
	call CnvtCCLRec(null)
endif
 
/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
; @desc Stores information for an "available value". Note that this does not handle child_values.
;       If you don't want to specify a value for a parameter, pass 'NULL' in that parameter's place.
; @param {i4} idx_filter  - index to store in reply->filter_list[]
; @param {i4} idx_val     - index to store in reply->filter_list[filter_count]->available_values[]
; @param {vc} arg_val     - argument_value
; @param {vc} arg_type    - argument_type
; @param {vc} parent_name - parent_entity_name
; @param {f8} parent_id   - parent_entity_id
subroutine SaveAvailableValue(idx_filter, idx_val, arg_val, arg_mean, arg_type, parent_name, parent_id)
	call log_message("Begin SaveAvailableValue()", LOG_LEVEL_DEBUG)
	if(arg_val != NULL)
		set reply->filter_list[idx_filter]->available_values[idx_val].argument_value = arg_val
	endif
	if(arg_mean != NULL)
		set reply->filter_list[idx_filter]->available_values[idx_val].argument_meaning = arg_mean
	endif
	if(arg_type != NULL)
		set reply->filter_list[idx_filter]->available_values[idx_val].argument_type = arg_type
	endif
	if(parent_name != NULL)
		set reply->filter_list[idx_filter]->available_values[idx_val].parent_entity_name = parent_name
	endif
	if(parent_id != NULL)
		set reply->filter_list[idx_filter]->available_values[idx_val].parent_entity_id = parent_id
	endif
	call log_message("Exit SaveAvailableValue()", LOG_LEVEL_DEBUG)
end
 
subroutine RetrieveRiskLevels(filter_cnt)
	call log_message("In RetrieveRiskLevels()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
 
	if(CHECKDIC("LH_CNT_READMIT_RISK", "T", 0) = TABLE_EXISTS_WITH_ACCESS)
 
		declare risk_cnt = i4 with private, noconstant(0)
 
		set reply->risk_flag = 0
 
		select distinct lh.risk_factor_txt
		from
			lh_cnt_readmit_risk lh
		where
			lh.active_ind = 1 and
			lh.risk_factor_flag = 5 and ;5 is the flag for All Cause Risk
			lh.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3) and
			lh.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
		order by
			lh.risk_factor_txt
		head report
			reply->risk_flag = 1
			risk_cnt = 0
		detail
			risk_cnt = risk_cnt + 1
			if(mod(risk_cnt,20) = 1)
				stat = alterlist(reply->filter_list[filter_cnt]->available_values, risk_cnt+19)
			endif
 
			reply->filter_list[filter_cnt]->available_values[risk_cnt].argument_value = lh.risk_factor_txt
			reply->filter_list[filter_cnt]->available_values[risk_cnt].parent_entity_id = risk_cnt
			reply->filter_list[filter_cnt]->available_values[risk_cnt].parent_entity_name = "RISK_VALUE"
 
		foot report
			stat = alterlist(reply->filter_list[filter_cnt]->available_values, risk_cnt)
		with nocounter
 
		set ERRCODE = ERROR(ERRMSG,0)
		if(ERRCODE != 0)
			set failed = 1
			set fail_operation = "RetrieveRiskLevels"
			call replyFailure("SELECT")
		endif
 
	else
 
		call log_message("Table lh_cnt_readmit_risk does not exist.", LOG_LEVEL_DEBUG)
 
	endif
 
	call log_message(build2("Exit RetrieveRiskLevels(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end
 
subroutine replyFailure(targetObjName)
     call log_message("In replyFailure()", LOG_LEVEL_DEBUG)
     declare BEGIN_TIME = f8 with constant(curtime3), private
 
     call log_message(build2("Error: ", targetObjName, " - ", trim(ERRMSG)), LOG_LEVEL_ERROR)
 
     rollback
     set reply->status_data.status = "F"
     set reply->status_data.subeventstatus[1].OperationName = fail_operation
     set reply->status_data.subeventstatus[1].OperationStatus = "F"
     set reply->status_data.subeventstatus[1].TargetObjectName = targetObjName
     set reply->status_data.subeventstatus[1].TargetObjectValue = ERRMSG
 
     call CnvtCCLRec(null)
 
     call log_message(build2("Exit replyFailure(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
 
     go to exit_script
end
 
subroutine CnvtCCLRec(null)
     call log_message("In CnvtCCLRec()", LOG_LEVEL_DEBUG)
     declare BEGIN_TIME = f8 with constant(curtime3), private
     declare strJSON = vc
 
     set strJSON = cnvtrectojson(reply)
     set _Memory_Reply_String = strJSON
 
     call log_message(build2("Exit CnvtCCLRec(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end
 
subroutine GetCodeSet(argument_name)
	call log_message("Begin GetCodeSet()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
 
   declare return_value = f8
 
   case (argument_name)
      of ARGNAME_PPRCODE:
         set return_value = 331
 
      of ARGNAME_EPRCODE:
         set return_value = 333
 
      of ARGNAME_RACE:
         set return_value = 282
 
      of ARGNAME_GENDER:
         set return_value = 57
 
      of ARGNAME_LANGUAGE:
         set return_value = 36
 
      of ARGNAME_HEALTHPLAN:
         set return_value = 367
 
      of ARGNAME_FINANCIALCLASS:
         set return_value = 354
 
      of ARGNAME_CONFIDLEVEL:
         set return_value = 87
 
	  of ARGNAME_ORDERSTATUS:
	  	 set return_value = 6004
 
	  of ARGNAME_CASESTATUS:
	  	 set return_value = 4003310
 
      else
         set return_value = 0
   endcase
 
   call log_message(build2("Exit GetCodeSet(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
 
   return(return_value)
 
end



subroutine RetrieveFacilities(filter_cnt)
	call log_message("Begin RetrieveFacilities()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
 
	declare DELETED_TYPE_CD = f8 with constant(uar_get_code_by("MEANING", 48, "DELETED")), protect
	declare FACILITY_TYPE_CD = f8 with constant (uar_get_code_by("MEANING", 222, "FACILITY")), protect
	declare exp_cnt = i4 with noconstant(0), protect
	declare loc_cnt = i4 with noconstant(0), protect
 
	select distinct into "nl:"
		 l.location_cd
		,cv.display
	from location       l
		,location_group lg
		,code_value     cv
	plan l
		where expand(exp_cnt, 1, size(user_orgs->organizations, 5),
				l.organization_id, user_orgs->organizations[exp_cnt]->organization_id)
			and l.location_type_cd = FACILITY_TYPE_CD
			and l.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and l.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
			and l.active_ind = 1
	join lg
		where lg.parent_loc_cd = l.location_cd
			and lg.root_loc_cd = 0 ; Only qualify patient care locations.
			and lg.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and lg.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
			and lg.active_ind = 1
	join cv
		where cv.code_value = l.location_cd
			and cv.active_ind = 1
			and cv.active_type_cd != DELETED_TYPE_CD
	order by
		 cv.collation_seq ASC
		,cv.display_key   ASC
		,l.location_cd    ASC
	detail
		loc_cnt = loc_cnt + 1
		if(mod(loc_cnt,100) = 1)
			stat = alterlist(reply->filter_list[filter_cnt]->available_values, loc_cnt + 99)
		endif
		reply->filter_list[filter_cnt]->available_values[loc_cnt]->argument_value = cv.display
		reply->filter_list[filter_cnt]->available_values[loc_cnt]->parent_entity_id = l.location_cd
		reply->filter_list[filter_cnt]->available_values[loc_cnt]->parent_entity_name = "CODE_VALUE"
	foot report
		stat = alterlist(reply->filter_list[filter_cnt]->available_values,loc_cnt)
	with nocounter, expand=1
 
	set ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
		set failed = 1
		set fail_operation = "RetrieveFacilities"
		call replyFailure("SELECT")
	endif
 
	call log_message(build2("Exit RetrieveFacilities(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end
 
 
subroutine RetrieveACMGroups(filter_cnt)
	call log_message("Begin RetrieveACMGroups()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
 
 	declare expandIndex = i4 with private, noconstant(0)
 	declare expCnt = i4
 	declare findIndex = i4 with private, noconstant(0)
 	declare locatedVal = i4 with private, noconstant(0)
    declare prsnlGroupCd = f8 with constant(uar_get_code_by("MEANING", 19189, "AMBCAREGRP"))
    declare group_cnt = i4 with private, noconstant(0)
 	declare prov_cnt = i4 with private, noconstant(0)
 	declare skipDetail = i2 with noconstant(0)
 
	if (prsnlGroupCd > 0.0)
		;get groups that DO NOT have providers that DO NOT have matching organizations
		select into "nl:"
		from
            prsnl_group   pg
            , prsnl_group_reltn   pgr2
            , prsnl   p2
 
        ;Need to join back to PGR and PRSNL to get the individual
        ;providers of a group.
        plan pg where
            pg.prsnl_group_class_cd = prsnlGroupCd
            and pg.active_ind = 1
            and	pg.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
            and pg.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
            and pg.prsnl_group_id in                
                ;find the groups that have a matching organization with user
                (select pgor.prsnl_group_id
                     from PRSNL_GROUP_ORG_RELTN pgor
                     where pgor.prsnl_group_id = pg.prsnl_group_id
                     and expand(expCnt, 1, size(user_orgs->organizations, 5),
                                pgor.organization_id, user_orgs->organizations[expCnt]->organization_id)
                    )
        join pgr2 where pg.prsnl_group_id = pgr2.prsnl_group_id
 		  		  and pgr2.active_ind = 1
                  and pgr2.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
            	  and pgr2.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
        join p2 where pgr2.person_id = p2.person_id 
         	      and p2.active_ind = 1
                  and p2.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
                  and p2.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
		order by
			pg.prsnl_group_id;pg.prsnl_group_name_key
		head report
			group_cnt = 0
		head pg.prsnl_group_id
			skipDetail = 1
 
			if(uar_get_code_set(pg.prsnl_group_type_cd) = 357)
 
				skipDetail = 0
				group_cnt = group_cnt + 1
				prov_cnt = 0
 
				if(mod(group_cnt,20) = 1)
					stat = alterlist(reply->filter_list[filter_cnt]->available_values, group_cnt + 19)
				endif
 
				reply->filter_list[filter_cnt]->available_values[group_cnt].argument_value = pg.prsnl_group_name
				reply->filter_list[filter_cnt]->available_values[group_cnt].parent_entity_id = pg.prsnl_group_id
				reply->filter_list[filter_cnt]->available_values[group_cnt].parent_entity_name = "PRSNL_GROUP"
 
			endif
		detail
 			if(skipDetail = 0)
				prov_cnt = prov_cnt + 1
 
				if(mod(prov_cnt,20) = 1)
					stat = alterlist(reply->filter_list[filter_cnt]->available_values[group_cnt]->child_values, prov_cnt + 19)
				endif
 
				reply->filter_list[filter_cnt]->available_values[group_cnt]->child_values[prov_cnt].argument_value = \
					p2.name_full_formatted
				reply->filter_list[filter_cnt]->available_values[group_cnt]->child_values[prov_cnt].parent_entity_id = \
					pgr2.person_id
				reply->filter_list[filter_cnt]->available_values[group_cnt]->child_values[prov_cnt].parent_entity_name = \
					"PRSNL"
			endif
		foot pg.prsnl_group_id
            if(skipDetail = 0)
                stat = alterlist(reply->filter_list[filter_cnt]->available_values[group_cnt]->child_values, prov_cnt)
            endif
		foot report
			stat = alterlist(reply->filter_list[filter_cnt]->available_values, group_cnt)
		with nocounter, expand=1
	endif
 
	call echorecord(reply)
 
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "RetrieveACMGroups"
       call replyFailure("SELECT")
    endif
 
	call log_message(build2("Exit RetrieveACMGroups(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms","RetrieveACMGroups found ", group_cnt), LOG_LEVEL_DEBUG)
 
end
 
subroutine RetrieveCommunicationPrefs(filter_cnt)
	call log_message("Begin RetrieveCommunicationPrefs()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
	declare PATIENTPORTAL_CD = f8 with constant(uar_get_code_by("MEANING",23042,"PATPORTAL")),protect
	declare NOPREFERENCE_CD = f8 with constant(uar_get_code_by("MEANING",23042,"NOPREFERENCE")),protect
	declare LETTER_CD = f8 with constant(uar_get_code_by("MEANING",23042,"LETTER")),protect
	declare TELEPHONE_CD = f8 with constant(uar_get_code_by("MEANING",23042,"TELEPHONE")),protect
	declare cv_cnt = i4 with noconstant(0), private
	declare i18n_Handle = i4 with noconstant(0), private
	declare h = i4 with noconstant(uar_i18nlocalizationinit(i18n_Handle, CURPROG, "", CURCCLREV)), protect
	declare i18n_Unknown = vc with constant(uar_i18nGetMessage(i18n_Handle, "i18n_key_Unknown", "Unknown")), private
	declare stat = i4 with noconstant(0), protect
	declare code_cnt = i2 with constant(5)
 
	set stat = alterlist(reply->filter_list[filter_cnt]->available_values, code_cnt)
 
	if(LETTER_CD > 0)
		set cv_cnt = cv_cnt + 1
		set reply->filter_list[filter_cnt]->available_values[cv_cnt].argument_value = uar_get_code_display(LETTER_CD)
		set reply->filter_list[filter_cnt]->available_values[cv_cnt].argument_meaning = "LETTER"
		set reply->filter_list[filter_cnt]->available_values[cv_cnt].parent_entity_id = LETTER_CD
		set reply->filter_list[filter_cnt]->available_values[cv_cnt].parent_entity_name = "CODE_VALUE"
	endif
 
	if(NOPREFERENCE_CD > 0)
		set cv_cnt = cv_cnt + 1
		set reply->filter_list[filter_cnt]->available_values[cv_cnt].argument_value = uar_get_code_display(NOPREFERENCE_CD)
		set reply->filter_list[filter_cnt]->available_values[cv_cnt].argument_meaning = "NOPREFERENCE"
		set reply->filter_list[filter_cnt]->available_values[cv_cnt].parent_entity_id = NOPREFERENCE_CD
		set reply->filter_list[filter_cnt]->available_values[cv_cnt].parent_entity_name = "CODE_VALUE"
	endif
 
	if(PATIENTPORTAL_CD > 0)
		set cv_cnt = cv_cnt + 1
		set reply->filter_list[filter_cnt]->available_values[cv_cnt].argument_value = uar_get_code_display(PATIENTPORTAL_CD)
		set reply->filter_list[filter_cnt]->available_values[cv_cnt].argument_meaning = "PATPORTAL"
		set reply->filter_list[filter_cnt]->available_values[cv_cnt].parent_entity_id = PATIENTPORTAL_CD
		set reply->filter_list[filter_cnt]->available_values[cv_cnt].parent_entity_name = "CODE_VALUE"
	endif
 
	if(TELEPHONE_CD > 0)
		set cv_cnt = cv_cnt + 1
		set reply->filter_list[filter_cnt]->available_values[cv_cnt].argument_value = uar_get_code_display(TELEPHONE_CD)
		set reply->filter_list[filter_cnt]->available_values[cv_cnt].argument_meaning = "TELEPHONE"
		set reply->filter_list[filter_cnt]->available_values[cv_cnt].parent_entity_id = TELEPHONE_CD
		set reply->filter_list[filter_cnt]->available_values[cv_cnt].parent_entity_name = "CODE_VALUE"
	endif
 
	set cv_cnt = cv_cnt + 1
	set reply->filter_list[filter_cnt]->available_values[cv_cnt].argument_value = i18n_Unknown
	set reply->filter_list[filter_cnt]->available_values[cv_cnt].argument_meaning = "UNKNOWN"
	set reply->filter_list[filter_cnt]->available_values[cv_cnt].parent_entity_id = 0
	set reply->filter_list[filter_cnt]->available_values[cv_cnt].parent_entity_name = "COMM_PREF_NULL"
 
	set stat = alterlist(reply->filter_list[filter_cnt]->available_values, cv_cnt)
 
	call log_message(build2("Exit RetrieveCommunicationPrefs(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms","RetrieveCommunicationPrefs found ", cv_cnt, " communication preferences"),
		LOG_LEVEL_DEBUG)
end
 
subroutine RetrievePendingWorkTypes(filter_cnt)
	call log_message("Begin RetrievePendingWorkTypes()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
	declare type_cnt = i2 with noconstant(0), private
	declare CODE_CNT = i2 with constant(5), private
	declare i18n_Handle = i4 with noconstant(0), private
	declare h = i4 with noconstant(uar_i18nlocalizationinit(i18n_Handle, curprog, "", curcclrev)), private
 
	declare PENDING_ACTIONS = vc with constant(uar_i18nGetMessage(i18n_Handle, "i18n_key_PendingActions", "My Pending Actions")), private
	declare PENDING_PHONE_CALLS = vc with constant(uar_i18nGetMessage(i18n_Handle, "i18n_key_PendingCalls", "Pending Phone Calls")), private
 
	set stat = alterlist(reply->filter_list[filter_cnt]->available_values, CODE_CNT)
 
	set type_cnt = type_cnt + 1
	set reply->filter_list[filter_cnt]->available_values[type_cnt].argument_value = PENDING_ACTIONS
	set reply->filter_list[filter_cnt]->available_values[type_cnt].argument_meaning = "PENDING_ACTIONS"
 
	set type_cnt = type_cnt + 1
	set reply->filter_list[filter_cnt]->available_values[type_cnt].argument_value = PENDING_PHONE_CALLS
	set reply->filter_list[filter_cnt]->available_values[type_cnt].argument_meaning = "PENDING_PHONE_CALLS"
 
	set stat = alterlist(reply->filter_list[filter_cnt]->available_values, type_cnt)
 
	call log_message(build2("Exit RetrievePendingWorkTypes(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms","RetrievePendingWorkTypes found ", type_cnt, " pending work types"),
		LOG_LEVEL_DEBUG)
end
 
subroutine RetrieveCodeValues(code_set_num, filter_cnt)
	call log_message("Begin RetrieveCodeValues()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
    declare cv_cnt = i4 with private, noconstant(0)
 
   select into "nl:"
   from
      code_value cv
   where
      cv.code_set = code_set_num and
      cv.active_ind = 1
   order by
      cv.code_set,
      cv.code_value
   head report
      cv_cnt = 0
   head cv.code_value
      cv_cnt = cv_cnt + 1
      if(mod(cv_cnt,20) = 1)
         stat = alterlist(reply->filter_list[filter_cnt]->available_values, cv_cnt+19)
      endif
 
      reply->filter_list[filter_cnt]->available_values[cv_cnt].argument_value = cv.display
      reply->filter_list[filter_cnt]->available_values[cv_cnt].argument_meaning = cv.cdf_meaning
      reply->filter_list[filter_cnt]->available_values[cv_cnt].parent_entity_id = cv.code_value
      reply->filter_list[filter_cnt]->available_values[cv_cnt].parent_entity_name = "CODE_VALUE"
 
 
   foot report
      stat = alterlist(reply->filter_list[filter_cnt]->available_values, cv_cnt)
   with nocounter
 
   set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "RetrieveCodeValues"
       call replyFailure("SELECT")
    endif
 
   call log_message(build2("Exit RetrieveCodeValues(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms","RetrieveCodeValues found ", cv_cnt, " items for code set ",
     code_set_num), LOG_LEVEL_DEBUG)
end
 
subroutine RetrieveConditions(filter_cnt)
	call log_message("Begin RetrieveConditions()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
 
	declare conditionIndex = i4 with noconstant(0), private
	declare ruleIndex = i4 with noconstant(0), private
	declare num = i4 with noconstant(0)
	declare ruleName = vc with noconstant("")
 
	select into "nl:"
	from
	    ac_class_def C, ac_class_he_rule R
	plan c where
		c.class_type_flag = 2 and;2 = condition
		c.active_ind = 1 and
		c.begin_effective_dt_tm <= cnvtdatetime(curdate,curtime) and
		c.end_effective_dt_tm > cnvtdatetime(curdate,curtime) and
		c.logical_domain_id = user_logical_domain_id and
		c.ac_class_def_id > 0
	join r where
		r.ac_class_def_id = c.ac_class_def_id or r.ac_class_he_rule_id = 0
	order by c.ac_class_def_id
 
	head report
		conditionIndex = 0
 
	head c.ac_class_def_id
		ruleIndex = 0
		conditionIndex = conditionIndex + 1
 
		if(mod(conditionIndex,20) = 1)
      		stat = alterlist(reply->filter_list[filter_cnt]->available_values, conditionIndex+19)
      	endif
 
		reply->filter_list[filter_cnt]->available_values[conditionIndex].argument_value = c.class_display_name
		reply->filter_list[filter_cnt]->available_values[conditionIndex].parent_entity_id = c.ac_class_def_id
		reply->filter_list[filter_cnt]->available_values[conditionIndex].parent_entity_name = "AC_CLASS_DEF"
 
	detail
		if(r.ac_class_he_rule_id > 0 and r.health_expert_rule_txt != "")
			ruleName = r.health_expert_rule_txt
			pos = LOCATEVAL(num, 1, size(rule_consq_map->rule_list,5), ruleName, \
				rule_consq_map->rule_list[num].name)
			if(pos > 0)
				;size the consequent list on the reply
				consqIndex = 0
				newConsqSize = size(rule_consq_map->rule_list[pos].consq_list,5)
				existingConsqSize = size(reply->filter_list[filter_cnt]->available_values[conditionIndex].child_values,5)
				stat = alterlist(reply->filter_list[filter_cnt]->available_values[conditionIndex].child_values,
					existingConsqSize + newConsqSize)
 
				;copy over the consquent names
				for(consqIndex = 1 to newConsqSize)
				 reply->filter_list[filter_cnt]->available_values[conditionIndex].child_values[consqIndex + existingConsqSize].argument_value\
					= rule_consq_map->rule_list[pos].consq_list[consqIndex].name
				 reply->filter_list[filter_cnt]->available_values[conditionIndex].child_values[consqIndex + existingConsqSize]\
				    .parent_entity_name = "AC_CLASS_HE_RULE"
				 reply->filter_list[filter_cnt]->available_values[conditionIndex].child_values[consqIndex + existingConsqSize]\
				    .parent_entity_id = r.ac_class_he_rule_id
				endfor
			else
				call echo("could not find rule to match name saved in bedrock.")
			endif
      	endif
 
	foot report
		stat = alterlist(reply->filter_list[filter_cnt]->available_values, conditionIndex)
 
	with nocounter
 
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "RetrieveConditions"
       call replyFailure("SELECT")
    endif
 
	call log_message(build2("Exit RetrieveConditions(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms","RetrieveConditions found ", conditionIndex), LOG_LEVEL_DEBUG)
end
 
subroutine RetrieveConsequentNames(NULL)
	call log_message("Begin RetrieveConsequentNames()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
 
	declare hRule       = i4 with noconstant(0), private
	declare hConsq      = i4 with noconstant(0), private
	declare hParam      = i4 with noconstant(0), private
	declare hValue      = i4 with noconstant(0), private
	declare iRet        = i4 with noconstant(0), private
 
	declare consqValueCnt = i4 with noconstant(0), private
 
	execute srvrtl
 
	set hMsg = uar_SrvSelectMessage(966721)
	set hRequest = uar_SrvCreateRequest(hMsg)
	set hReply = uar_SrvCreateReply(hMsg)
 
	set iRet = uar_SrvSetString(hRequest, "rule_group_name", "Conditions")
 
    ;executing request
    set stat = uar_SrvExecute(hMsg, hRequest, hReply)
    call echo(build2("HRecommendation Server: SRV Perform, Status:", stat))
    if (stat > 0)
        call uar_SrvDestroyInstance(hReply)
		call uar_SrvDestroyInstance(hRequest)
		set failed = 1
		set fail_operation = "HEALTH EXPERT REQUEST"
	    	call replyFailure("")
    endif
 
 
    ;get the status from the server
    set hStatus = uar_SrvGetStruct(hReply, "status_data")
    set status = uar_SrvGetStringPtr(hStatus, "status")
    set statusSize = uar_SrvGetItemCount(hStatus, "subeventstatus")
    set statusCount = 0
    for(statusCount = 0 to statusSize)
      set hSubEvent = uar_SrvGetItem(hStatus, "subeventstatus", statusCount)
 
      set sTargetObjectName = uar_SrvGetStringPtr(hSubEvent, "TargetObjectName")
      set sTargetObjectValue = uar_SrvGetStringPtr(hSubEvent, "TargetObjectValue")
      set sOperationName = uar_SrvGetStringPtr(hSubEvent, "OperationName")
      set sOperationStatus = uar_SrvGetStringPtr(hSubEvent, "OperationStatus")
 
      call echo(status)
      call echo(build("Target Object Name: ", sTargetObjectName))
      call echo(build("Target Object Value: ", sTargetObjectValue))
      call echo(build("Operation Name: ", sOperationName))
      call echo(build("Operation Status: ", sOperationStatus))
    endfor
 
    ;if there is any kind of server failure then we should fail
    if (status = "F")
		call uar_SrvDestroyInstance(hReply)
		call uar_SrvDestroyInstance(hRequest)
		set failed = 1
		set fail_operation = "HEALTH EXPERT RETURN"
        call replyFailure("")
 	endif
 
 	;get the number of returned from the server
 	set ruleIterator = 0
 	set ruleCnt = uar_SrvGetItemCount(hReply, "rules")
 	call echo(build("found rules: ", ruleCnt))
 	set stat = alterlist(rule_consq_map->rule_list, ruleCnt)
 
 	for(ruleIterator = 0 to ruleCnt - 1)
	 	set hRule = uar_SrvGetItem(hReply, "rules", ruleIterator)
 
 		;retain the rule name
 		set ruleName = uar_SrvGetStringPtr(hRule, "name")
 		set rule_consq_map->rule_list[ruleIterator+1].name = ruleName
 
 		set consqCnt = uar_SrvGetItemCount(hRule, "consequents")
 		set consqIterator = 0
 		for(consqIterator = 0 to consqCnt-1)
 			set hConsq = uar_SrvGetItem(hRule, "consequents", consqIterator)
 
 			set paramCnt = uar_SrvGetItemCount(hConsq, "parameters")
	 		set paramIterator = 0
	 		set consqValueCnt = 0
	 		for(paramIterator = 0 to paramCnt-1)
	 			set hParam = uar_SrvGetItem(hConsq, "parameters", paramIterator)
 
	 			set valueCnt = uar_SrvGetItemCount(hParam, "values")
		 		set valueIterator = 0
		 		for(valueIterator = 0 to valueCnt-1)
		 			set hValue = uar_SrvGetItem(hParam, "values", valueIterator)
 
	 				set consqValueCnt = consqValueCnt + 1
	 				set stat = alterlist(rule_consq_map->rule_list[ruleIterator+1].consq_list, consqValueCnt)
					set rule_consq_map->rule_list[ruleIterator+1].consq_list[consqValueCnt].name = uar_SrvGetStringPtr(hValue, "value")
				endfor
			endfor
		endfor
	endfor
 
	call echorecord(rule_consq_map)
 
	call log_message(build2("Exit RetrieveConsequentNames(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms","RetrieveConsequentNames found ", consqValueCnt),
     LOG_LEVEL_DEBUG)
end
 
subroutine RetrieveRegistries(filter_cnt)
	call log_message("Begin RetrieveRegistries()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
 
	declare regCount = i4 with noconstant(0), private
 
	select into "nl:"
	from
	    ac_class_def cd
	where
		cd.class_type_flag = 1 and  ;1 = registry
		cd.active_ind = 1 and
		cd.begin_effective_dt_tm <= cnvtdatetime(curdate,curtime) and
		cd.end_effective_dt_tm > cnvtdatetime(curdate,curtime) and
		cd.logical_domain_id = user_logical_domain_id and
		cd.ac_class_def_id > 0
 
	head report
		regCount = 0
 
	head cd.ac_class_def_id
		regCount = regCount + 1
		if(mod(regCount,20) = 1)
      		stat = alterlist(reply->filter_list[filter_cnt]->available_values, regCount+19)
      	endif
 
		reply->filter_list[filter_cnt]->available_values[regCount].argument_value = cd.class_display_name
		reply->filter_list[filter_cnt]->available_values[regCount].parent_entity_id = cd.ac_class_def_id
		reply->filter_list[filter_cnt]->available_values[regCount].parent_entity_name = "AC_CLASS_DEF"
 
   foot report
      stat = alterlist(reply->filter_list[filter_cnt]->available_values, regCount)
 
	with nocounter
 
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "RetrieveRegistries"
       call replyFailure("SELECT")
    endif
 
	call log_message(build2("Exit RetrieveRegistries(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms","RetrieveRegistries found ", regCount), LOG_LEVEL_DEBUG)
end
 
subroutine RetrieveAppointmentStatuses(filter_cnt)
	call log_message("Begin RetrieveAppointmentStatuses()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
	declare custom_types_ind = i2 with noconstant(0)
	declare value_count = i4 with noconstant(0)
	declare flex_id_appt_status = f8 with noconstant(system_flex_id)
 
	select into "nl:"
		cv_display = UAR_GET_CODE_DISPLAY(bv.parent_entity_id)
	from
		br_datamart_filter bf,
		br_datamart_value  bv
	plan bf
		where bf.br_datamart_category_id = dwl_category_id
		and bf.filter_mean = "APPOINTMENT_STATUS_STATUS"
 	join bv
		where bv.br_datamart_category_id = bf.br_datamart_category_id
		and bv.br_datamart_filter_id = bf.br_datamart_filter_id
		and bv.br_datamart_flex_id in (
				pos_flex_id,
				system_flex_id
			)
		and bv.parent_entity_name = "CODE_VALUE"
		and bv.logical_domain_id = 0
	order by bv.br_datamart_flex_id desc, bv.updt_dt_tm
	head cv_display
		if(cv_display != "")
			if(bv.br_datamart_flex_id = pos_flex_id and flex_id_appt_status = system_flex_id)
				flex_id_appt_status = bv.br_datamart_flex_id
			endif
			if(bv.br_datamart_flex_id = flex_id_appt_status)
				value_count = value_count + 1
				if(mod(value_count,20) = 1)
					stat = alterlist(reply->filter_list[filter_cnt]->available_values, value_count + 19)
				endif
	 			custom_types_ind = 1
				reply->filter_list[filter_cnt]->available_values[value_count].ARGUMENT_VALUE = cv_display
				reply->filter_list[filter_cnt]->available_values[value_count].parent_entity_id = bv.parent_entity_id
				reply->filter_list[filter_cnt]->available_values[value_count].parent_entity_name = bv.parent_entity_name
			endif
		endif
	foot report
		stat = alterlist(reply->filter_list[filter_cnt]->available_values, value_count)
	with nocounter
 
	if(ERRCODE != 0)
		set failed = 1
		set fail_operation = "RetrieveAppointmentStatuses"
		call replyFailure("SELECT")
	endif
 
	; No prefs were found.
	if(custom_types_ind = 0)
	; Set default prefs.
    	set stat = alterlist(reply->filter_list[filter_cnt]->available_values, 4)
    	;Canceled
		declare canceled_cd = f8 with Constant(uar_get_code_by("MEANING",14233,"CANCELED"))
		set reply->filter_list[filter_cnt]->available_values[1].argument_value = uar_get_code_display(canceled_cd)
		set reply->filter_list[filter_cnt]->available_values[1].parent_entity_id = canceled_cd
		set reply->filter_list[filter_cnt]->available_values[1].parent_entity_name = "CODE_VALUE"
 
		;No show
		declare noshow_cd = f8 with Constant(uar_get_code_by("MEANING",14233,"NOSHOW"))
		set reply->filter_list[filter_cnt]->available_values[2].argument_value = uar_get_code_display(noshow_cd)
		set reply->filter_list[filter_cnt]->available_values[2].parent_entity_id = noshow_cd
		set reply->filter_list[filter_cnt]->available_values[2].parent_entity_name = "CODE_VALUE"
 
		;Confirmed
		declare confirmed_cd = f8 with Constant(uar_get_code_by("MEANING",14233,"CONFIRMED"))
		set reply->filter_list[filter_cnt]->available_values[3].argument_value = uar_get_code_display(confirmed_cd)
		set reply->filter_list[filter_cnt]->available_values[3].parent_entity_id = confirmed_cd
		set reply->filter_list[filter_cnt]->available_values[3].parent_entity_name = "CODE_VALUE"
 
		;Scheduled
		declare scheduled_cd = f8 with Constant(uar_get_code_by("MEANING",14233,"SCHEDULED"))
		set reply->filter_list[filter_cnt]->available_values[4].argument_value = uar_get_code_display(scheduled_cd)
		set reply->filter_list[filter_cnt]->available_values[4].parent_entity_id = scheduled_cd
		set reply->filter_list[filter_cnt]->available_values[4].parent_entity_name = "CODE_VALUE"
	endif
 
    call log_message(build2("Exit RetrieveAppointmentStatuses(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms","RetrieveAppointmentStatuses found ",
		size(reply->filter_list[filter_cnt]->available_values, 5)), LOG_LEVEL_DEBUG)
end
 
subroutine RetrieveExpectations(filter_cnt)
	call log_message("Begin RetrieveExpectations()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
    declare expect_count = i4 with noconstant(0)
 
    select distinct into "nl:"
	from
		hm_expect hExpect,
		hm_expect_series hSeries,
		hm_expect_sched hSched
	plan hExpect where
		hExpect.expect_id > 0
		and hExpect.active_ind = 1
		and hExpect.beg_effective_dt_tm <= cnvtdatetime(curdate, curtime3)
		and hExpect.end_effective_dt_tm >= cnvtdatetime(curdate, curtime3)
	join hSeries where
		hExpect.expect_series_id = hSeries.expect_series_id
		and hSeries.active_ind = 1
		and hSeries.beg_effective_dt_tm <= cnvtdatetime(curdate, curtime3)
		and hSeries.end_effective_dt_tm >= cnvtdatetime(curdate, curtime3)
	join hSched where
		hSeries.expect_sched_id = hSched.expect_sched_id
		and hSched.active_ind = 1
		and hSched.beg_effective_dt_tm <= cnvtdatetime(curdate, curtime3)
		and hSched.end_effective_dt_tm >= cnvtdatetime(curdate, curtime3)
		and hSched.expect_sched_type_flag = 0 ;only show health maintenance expectations
 
    head report
    	expect_count = 0
    head hExpect.expect_id
    	expect_count = expect_count + 1
    	if(mod(expect_count,20) = 1)
				stat = alterlist(reply->filter_list[filter_cnt]->available_values, expect_count + 19)
		endif
		reply->filter_list[filter_cnt]->available_values[expect_count].argument_value = hExpect.expect_name
		reply->filter_list[filter_cnt]->available_values[expect_count].parent_entity_id = hExpect.expect_id
		reply->filter_list[filter_cnt]->available_values[expect_count].parent_entity_name = "HM_EXPECT"
 
	with nocounter
 
	;Change size to allow for status arguments
	set stat = alterlist(reply->filter_list[filter_cnt]->available_values, expect_count + 4)
	;Near due argument
	set expect_count = expect_count + 1
	set reply->filter_list[filter_cnt]->available_values[expect_count].argument_value = ARGVAL_NEARDUE
	set reply->filter_list[filter_cnt]->available_values[expect_count].parent_entity_id = 1
	set reply->filter_list[filter_cnt]->available_values[expect_count].parent_entity_name = "RECOMMSTATUS"
 
	;Due argument
	set expect_count = expect_count + 1
	set reply->filter_list[filter_cnt]->available_values[expect_count].argument_value = ARGVAL_DUE
	set reply->filter_list[filter_cnt]->available_values[expect_count].parent_entity_id = 2
	set reply->filter_list[filter_cnt]->available_values[expect_count].parent_entity_name = "RECOMMSTATUS"
 
	;Overdue argument
	set expect_count = expect_count + 1
	set reply->filter_list[filter_cnt]->available_values[expect_count].argument_value = ARGVAL_OVERDUE
	set reply->filter_list[filter_cnt]->available_values[expect_count].parent_entity_id = 3
	set reply->filter_list[filter_cnt]->available_values[expect_count].parent_entity_name = "RECOMMSTATUS"
 
	;Not Due argument
	set expect_count = expect_count + 1
	set reply->filter_list[filter_cnt]->available_values[expect_count].argument_value = ARGVAL_NOTDUE
	set reply->filter_list[filter_cnt]->available_values[expect_count].parent_entity_id = 4
	set reply->filter_list[filter_cnt]->available_values[expect_count].parent_entity_name = "RECOMMSTATUS"
 
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "RetrieveExpectations"
       call replyFailure("SELECT")
    endif
 
    call log_message(build2("Exit RetrieveExpectations(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms","RetrieveExpectations found ", expect_count),
     LOG_LEVEL_DEBUG)
end
 
subroutine RetrieveOrderStatuses(filter_cnt)
	call log_message("Begin RetrieveOrderStatuses()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
	declare custom_types_ind = i2 with noconstant(0)
	declare custom_status_ind = i2 with noconstant(0)
	declare flex_types_id  = f8 with noconstant(0.0)
	declare flex_status_id = f8 with noconstant(0.0)
	declare value_count = i4 with noconstant(0)
	declare type_count = i4 with noconstant(0)
	declare temp_arg_type = vc with noconstant("")
 
 	;Retrieve order statuses
	select into "nl:"
		cv_display = UAR_GET_CODE_DISPLAY(bv.parent_entity_id)
	from
		br_datamart_filter bf,
		br_datamart_value  bv
	plan bf
		where bf.br_datamart_category_id = dwl_category_id
		and bf.filter_mean in (
				"ORDER_STATUS_STATUS",
				"ORDER_STATUS_CAT_TYPE"
			)
 	join bv
		where bv.br_datamart_category_id = bf.br_datamart_category_id
		and bv.br_datamart_filter_id = bf.br_datamart_filter_id
		and bv.br_datamart_flex_id in(
				pos_flex_id,
				system_flex_id
			)
		and bv.parent_entity_name = "CODE_VALUE"
		and bv.logical_domain_id = 0
	order by bv.br_datamart_flex_id desc, bv.updt_dt_tm	; flex_id desc guarantees position prefs are found before any system prefs.
	head bv.parent_entity_id
		if(cv_display != "" and
			; Get the first pref it sees for each possible filter_mean. (using custom_*_ind = 0)
			; Once a pref for the filter_mean has been found (custom_*_ind = 1), we only want prefs with the corresponding flex_id.
			(bf.filter_mean = "ORDER_STATUS_STATUS"   and (custom_status_ind = 0 or bv.br_datamart_flex_id = flex_status_id))
			or
			(bf.filter_mean = "ORDER_STATUS_CAT_TYPE" and (custom_types_ind  = 0 or bv.br_datamart_flex_id = flex_types_id))
		)
			value_count = value_count + 1
			if(mod(value_count,20) = 1)
				stat = alterlist(reply->filter_list[filter_cnt]->available_values, value_count + 19)
			endif
			temp_arg_type = ""
			if(bf.filter_mean = "ORDER_STATUS_STATUS")
				custom_status_ind = 1	; Found a status pref.
				flex_status_id = bv.br_datamart_flex_id	; Save the flex_id.
				temp_arg_type = "status"
			elseif(bf.filter_mean = "ORDER_STATUS_CAT_TYPE")
				custom_types_ind  = 1	; Found a types pref.
				flex_types_id = bv.br_datamart_flex_id	; Save the flex_id.
				temp_arg_type = "type"
			endif
			call SaveAvailableValue(filter_cnt, value_count, cv_display, NULL, temp_arg_type, bv.parent_entity_name, bv.parent_entity_id)
		endif
	foot report
		stat = alterlist(reply->filter_list[filter_cnt]->available_values, value_count)
	with nocounter
 
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "RetrieveOrderSFromBedrock"
       call replyFailure("SELECT")
    endif
 
    ;If no bedrock settings, load defaults
    if(custom_status_ind = 0)
    	set type_count = value_count + 1
    	set stat = alterlist(reply->filter_list[filter_cnt]->available_values, type_count + 1)
 
		;Incomplete
		declare incomplete_cd = f8 with Constant(uar_get_code_by("MEANING",6004,"INCOMPLETE"))
		call SaveAvailableValue(filter_cnt, type_count, uar_get_code_display(incomplete_cd), NULL, "status", "CODE_VALUE", incomplete_cd)
 
		set type_count = type_count + 1
 
		;Ordered
		declare ordered_cd = f8 with Constant(uar_get_code_by("MEANING",6004,"ORDERED"))
		call SaveAvailableValue(filter_cnt, type_count, uar_get_code_display(ordered_cd), NULL, "status", "CODE_VALUE", ordered_cd)
 
		set value_count = type_count
	endif
 
    ;If no bedrock settings, load defaults
    if(custom_types_ind = 0)
		set type_count = value_count + 1
	   	set stat = alterlist(reply->filter_list[filter_cnt]->available_values, type_count + 1)
 
		;GENERAL LAB
		declare genlab_cd = f8 with Constant(uar_get_code_by("MEANING",6000,"GENERAL LAB"))
		call SaveAvailableValue(filter_cnt, type_count, uar_get_code_display(genlab_cd), NULL, "type", "CODE_VALUE", genlab_cd)
 
		set type_count = type_count + 1
 
		;REFERRAL
		declare referral_cd = f8 with Constant(uar_get_code_by("MEANING",6000,"REFERRAL"))
		call SaveAvailableValue(filter_cnt, type_count, uar_get_code_display(referral_cd), NULL, "type", "CODE_VALUE",referral_cd)
 
		set value_count = type_count
	endif
 
    call log_message(build2("Exit RetrieveOrderStatuses(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms","RetrieveOrderStatuses found ", value_count),
     LOG_LEVEL_DEBUG)
end
 
subroutine RetrieveEncounterTypeFromBedrock(filter_cnt)
	call log_message("Begin RetrieveEncounterTypeFromBedrock()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
	declare inpt_enc_type_ind = i2 with noconstant(0), private
	declare outpt_enc_type_ind = i2 with noconstant(0), private
	declare ed_enc_type_ind = i2 with noconstant(0), private
	declare incr_cnt = i4 with noconstant(0), private
 
	; Scope these variables as protected, as they are used inside the query
	declare inpt_type_label_ind = i2 with noconstant(0), protect
	declare outpt_type_label_ind = i2 with noconstant(0), protect
	declare ed_type_label_ind = i2 with noconstant(0), protect
	declare individual_enc_ind = vc with noconstant(""), protect
	declare available_val_cnt = i4 with noconstant(0), protect
	declare individual_enc_cnt = i4 with noconstant(0), protect
	declare individual_enc_index = i4 with noconstant(0), protect
	declare temp_cnt = i4 with noconstant(0), protect
 
  	; Set the default number of encounter groups to 6, including the individual encounters group
  	set stat = alterlist(reply->filter_list[filter_cnt]->available_values,6)
	declare ind_lbl_inpt  = i2 with noconstant(0)
	declare ind_lbl_outpt = i2 with noconstant(0)
	declare ind_lbl_ed    = i2 with noconstant(0)
	declare ind_lbl_grp1  = i2 with noconstant(0)
	declare ind_lbl_grp2  = i2 with noconstant(0)
	declare flex_id_inpt  = f8 with noconstant(0.0)
	declare flex_id_outpt = f8 with noconstant(0.0)
	declare flex_id_ed    = f8 with noconstant(0.0)
	declare flex_id_grp1  = f8 with noconstant(0.0)
	declare flex_id_grp2  = f8 with noconstant(0.0)
	declare flex_id_indiv_enc_type = f8 with noconstant(0.0)
	declare ind_indiv_enc_type = i2 with noconstant(0)
 
	select into "nl:"
	from
		br_datamart_filter bf,
		br_datamart_value  bv
	plan bf
		where bf.br_datamart_category_id = dwl_category_id
		and bf.filter_mean in (
			"INPT_ENC_TYPE_LABEL","OUTPT_ENC_TYPE_LABEL","ED_ENC_TYPE_LABEL","GROUP1_ENC_TYPE_LABEL","GROUP2_ENC_TYPE_LABEL",
			"INPT_ENC_TYPE",	  "OUTPT_ENC_TYPE",		 "ED_ENC_TYPE",		 "GROUP1_ENC_TYPE",		 "GROUP2_ENC_TYPE",
			"INDIVIDUAL_ENC_TYPE","INDIVIDUAL_ENC_TYPE_IND"
		)
 	join bv
		where bv.br_datamart_category_id = bf.br_datamart_category_id
		and bv.br_datamart_filter_id = bf.br_datamart_filter_id
		and bv.br_datamart_flex_id in (
			pos_flex_id,
			system_flex_id
		)
		and bv.logical_domain_id = 0
	order by bv.br_datamart_flex_id desc, bv.br_datamart_value_id	; flex_id to find position level preferences first.
	head bv.br_datamart_value_id
		if(bf.filter_mean != "INDIVIDUAL_ENC_TYPE_IND" and bv.freetext_desc != "" and bv.freetext_desc != null)
			if(bf.filter_mean = "INPT_ENC_TYPE_LABEL" and ind_lbl_inpt = 0)
				ind_lbl_inpt = 1
        		inpt_type_label_ind = 1
 				available_val_cnt = available_val_cnt + 1
				reply->filter_list[filter_cnt]->available_values[available_val_cnt].ARGUMENT_VALUE = bv.freetext_desc
				reply->filter_list[filter_cnt]->available_values[available_val_cnt].PARENT_ENTITY_ID = 1
			elseif (bf.filter_mean = "OUTPT_ENC_TYPE_LABEL" and ind_lbl_outpt = 0)
				ind_lbl_outpt = 1
        		outpt_type_label_ind = 1
 				available_val_cnt = available_val_cnt + 1
				reply->filter_list[filter_cnt]->available_values[available_val_cnt].ARGUMENT_VALUE = bv.freetext_desc
				reply->filter_list[filter_cnt]->available_values[available_val_cnt].PARENT_ENTITY_ID = 2
			elseif (bf.filter_mean = "ED_ENC_TYPE_LABEL" and ind_lbl_ed = 0)
				ind_lbl_ed = 1
        		ed_type_label_ind = 1
 				available_val_cnt = available_val_cnt + 1
				reply->filter_list[filter_cnt]->available_values[available_val_cnt].ARGUMENT_VALUE = bv.freetext_desc
				reply->filter_list[filter_cnt]->available_values[available_val_cnt].PARENT_ENTITY_ID = 4
			elseif (bf.filter_mean = "GROUP1_ENC_TYPE_LABEL" and ind_lbl_grp1 = 0)
				ind_lbl_grp1 = 1
 				available_val_cnt = available_val_cnt + 1
				reply->filter_list[filter_cnt]->available_values[available_val_cnt].ARGUMENT_VALUE = bv.freetext_desc
				reply->filter_list[filter_cnt]->available_values[available_val_cnt].PARENT_ENTITY_ID = 8
			elseif (bf.filter_mean = "GROUP2_ENC_TYPE_LABEL" and ind_lbl_grp2 = 0)
				ind_lbl_grp2 = 1
 				available_val_cnt = available_val_cnt + 1
				reply->filter_list[filter_cnt]->available_values[available_val_cnt].ARGUMENT_VALUE = bv.freetext_desc
				reply->filter_list[filter_cnt]->available_values[available_val_cnt].PARENT_ENTITY_ID = 16
			endif
		elseif (bf.filter_mean = "INDIVIDUAL_ENC_TYPE" or bf.filter_mean = "INDIVIDUAL_ENC_TYPE_IND")
			; Store all the individual encounters in a custom gorup called Individual Encounters
			; Setup the individual group details on the first iteration only
			if(individual_enc_index = 0)
				available_val_cnt = available_val_cnt + 1
				individual_enc_index = available_val_cnt
				reply->filter_list[filter_cnt]->available_values[individual_enc_index].ARGUMENT_VALUE = "Individual Encounters"
				reply->filter_list[filter_cnt]->available_values[individual_enc_index].PARENT_ENTITY_ID = 32
				reply->filter_list[filter_cnt]->available_values[individual_enc_index].PARENT_ENTITY_NAME = "INDIVIDUAL_ENC_TYPE"
			endif
 
			; Add individual encounter indicator to the group details, we use ARGUMENT_MEANING keys to avoid changing the reply structure
			if(bf.filter_mean = "INDIVIDUAL_ENC_TYPE_IND" and ind_indiv_enc_type = 0)
				ind_indiv_enc_type = 1
				individual_enc_ind = bv.freetext_desc
				reply->filter_list[filter_cnt]->available_values[individual_enc_index].ARGUMENT_MEANING = individual_enc_ind
			elseif(bf.filter_mean = "INDIVIDUAL_ENC_TYPE")	; Add only the individual encounters as children
				if(bv.br_datamart_flex_id = pos_flex_id and flex_id_indiv_enc_type = 0.0)	; If a position level preference is found.
					flex_id_indiv_enc_type = pos_flex_id	; Save the corresponding flex_id.
				endif
				if(bv.br_datamart_flex_id = flex_id_indiv_enc_type)	; If the current preference is for the saved flex_id.
					individual_enc_cnt = individual_enc_cnt + 1
		 			stat = alterlist(reply->filter_list[filter_cnt]->available_values[individual_enc_index].child_values, individual_enc_cnt)
 
					reply->filter_list[filter_cnt]->available_values[individual_enc_index].\
						child_values[individual_enc_cnt].ARGUMENT_VALUE = UAR_GET_CODE_DISPLAY(bv.parent_entity_id)
					reply->filter_list[filter_cnt]->available_values[individual_enc_index].\
						child_values[individual_enc_cnt].PARENT_ENTITY_ID = bv.parent_entity_id
					reply->filter_list[filter_cnt]->available_values[individual_enc_index].\
						child_values[individual_enc_cnt].PARENT_ENTITY_NAME = bf.filter_mean
				endif
			endif
 		else
			; If we find a position level preference.
			if(bv.br_datamart_flex_id = pos_flex_id)
				; And we haven't already found a preference for the corresponding type.
				; Save the position flex_id for that type.
				if(bf.filter_mean = "INPT_ENC_TYPE" and flex_id_inpt = 0.0)
					flex_id_inpt = pos_flex_id
				elseif(bf.filter_mean = "OUTPT_ENC_TYPE" and flex_id_outpt = 0.0)
					flex_id_outpt = pos_flex_id
				elseif(bf.filter_mean = "ED_ENC_TYPE" and flex_id_ed = 0.0)
					flex_id_ed = pos_flex_id
				elseif(bf.filter_mean = "GROUP1_ENC_TYPE" and flex_id_grp1 = 0.0)
					flex_id_grp1 = pos_flex_id
				elseif(bf.filter_mean = "GROUP2_ENC_TYPE" and flex_id_grp2 = 0.0)
					flex_id_grp2 = pos_flex_id
				endif
			endif
			; If the encounter type preference is for the saved flex_id.
			if( (bf.filter_mean = "INPT_ENC_TYPE"	and bv.br_datamart_flex_id = flex_id_inpt)	or
				(bf.filter_mean = "OUTPT_ENC_TYPE"	and bv.br_datamart_flex_id = flex_id_outpt)	or
				(bf.filter_mean = "ED_ENC_TYPE"		and bv.br_datamart_flex_id = flex_id_ed)	or
				(bf.filter_mean = "GROUP1_ENC_TYPE" and bv.br_datamart_flex_id = flex_id_grp1)	or
				(bf.filter_mean = "GROUP2_ENC_TYPE" and bv.br_datamart_flex_id = flex_id_grp2)
			)
	 			; store all the encounters related to a group in encounters free record
	 		    temp_cnt = temp_cnt + 1
				stat = alterlist(encounters->encntr_data, temp_cnt)
 
	 		    encounters->encntr_data[temp_cnt].parent_entity_id = bv.parent_entity_id
	        	encounters->encntr_data[temp_cnt].argument_value = UAR_GET_CODE_DISPLAY(bv.parent_entity_id)
	        	encounters->encntr_data[temp_cnt].parent_entity_name = bf.filter_mean
			endif
		endif
 
	foot report
		stat = alterlist(encounters->encntr_data, temp_cnt)
 
	with nocounter
 
	; Alter the available_values list with the total number of filters
	; We alter it here as the head/footer above are not executed if rows are returned by the query above
	set stat = alterlist(reply->filter_list[filter_cnt]->available_values,available_val_cnt)
 
	; Only set defaults if no customization label was defined in bedrock for any of the group encounters
	if(inpt_type_label_ind = 0 or outpt_type_label_ind = 0 or ed_type_label_ind = 0)
 
    /***Set Defaults***/
 
;include i18n function declarations
%i cclsource:i18n_uar.inc
 
		;initialize variable that will keep the handle to i18n data
		declare i18n_Handle = i4 with noconstant(0), private
		declare h = i4 with noconstant(uar_i18nlocalizationinit(i18n_Handle, curprog, "", curcclrev)), private
		declare encounter_type_cd = f8 with noconstant(0), private
 
		; Add the Inpatient Group label if it is not present in the query results
		if(inpt_type_label_ind = 0)
			; We add the available_val_cnt, as we might have individual encounters present, but no encounter groups
			set available_val_cnt = available_val_cnt + 1
			set stat = alterlist(reply->filter_list[filter_cnt]->available_values,available_val_cnt)
 
			; Add the i18n Inpatient label
			declare i18n_InpatientLabel = vc \
				with noconstant(uar_i18nGetMessage(i18n_Handle, "i18n_key_InpatientLabel", "Inpatient")), private
			set reply->filter_list[filter_cnt]->available_values[available_val_cnt].ARGUMENT_VALUE = i18n_InpatientLabel
			set reply->filter_list[filter_cnt]->available_values[available_val_cnt].PARENT_ENTITY_ID = 1
		endif
 
		; Add the Outpatient Group label if it is not present in the query results
		if(outpt_type_label_ind = 0)
			; We add the available_val_cnt, as we might have individual encounters present, but no encounter groups
			set available_val_cnt = available_val_cnt + 1
			set stat = alterlist(reply->filter_list[filter_cnt]->available_values,available_val_cnt)
 
			; Add the i18n Outpatient label
			declare i18n_OutPatientLabel = vc \
				with noconstant(uar_i18nGetMessage(i18n_Handle, "i18n_key_OutpatientLabel", "Outpatient")), private
			set reply->filter_list[filter_cnt]->available_values[available_val_cnt].ARGUMENT_VALUE = i18n_OutPatientLabel
			set reply->filter_list[filter_cnt]->available_values[available_val_cnt].PARENT_ENTITY_ID = 2
		endif
 
		; Add the Emergency Group label if it is not present in the query results
		if(ed_type_label_ind = 0)
			; We add the available_val_cnt, as we might have individual encounters present, but no encounter groups
			set available_val_cnt = available_val_cnt + 1
			set stat = alterlist(reply->filter_list[filter_cnt]->available_values,available_val_cnt)
 
			; Add the i18n Emergency label
			declare i18n_EmergencyLabel = vc \
				with noconstant(uar_i18nGetMessage(i18n_Handle, "i18n_key_EmergencyLabel", "Emergency")), private
			set reply->filter_list[filter_cnt]->available_values[available_val_cnt].ARGUMENT_VALUE = i18n_EmergencyLabel
			set reply->filter_list[filter_cnt]->available_values[available_val_cnt].PARENT_ENTITY_ID = 4
		endif
	endif
 
	; Alter the available_values list with the total number of filters
	; We alter it here as the head/footer above are not executed if rows are returned by the query above
	set stat = alterlist(reply->filter_list[filter_cnt]->available_values,available_val_cnt)
 
	; Add the children only if any of the group encounters is present
	if(size(encounters->encntr_data,5) != 0)
		; loop through all the encounters in encounter record and add them as children for their related groups
		for(idx = 1 to size(reply->filter_list[filter_cnt]->available_values,5))
			for(idx2 = 1 to size(encounters->encntr_data,5))
				if((reply->filter_list[filter_cnt]->available_values[idx].parent_entity_id = 1
				    and encounters->encntr_data[idx2].parent_entity_name = "INPT_ENC_TYPE") or
				  (reply->filter_list[filter_cnt]->available_values[idx].parent_entity_id = 2
				    and encounters->encntr_data[idx2].parent_entity_name = "OUTPT_ENC_TYPE") or
				  (reply->filter_list[filter_cnt]->available_values[idx].parent_entity_id = 4
				    and encounters->encntr_data[idx2].parent_entity_name = "ED_ENC_TYPE") or
				  (reply->filter_list[filter_cnt]->available_values[idx].parent_entity_id = 8
				    and encounters->encntr_data[idx2].parent_entity_name = "GROUP1_ENC_TYPE") or
				  (reply->filter_list[filter_cnt]->available_values[idx].parent_entity_id = 16
				    and encounters->encntr_data[idx2].parent_entity_name = "GROUP2_ENC_TYPE"))
 
						set incr_cnt = size(reply->filter_list[filter_cnt]->available_values[idx].child_values, 5) + 1
					  	set stat = alterlist(reply->filter_list[filter_cnt]->available_values[idx].child_values, incr_cnt)
					  	set reply->filter_list[filter_cnt]->available_values[idx].\
					  		child_values[incr_cnt].argument_value = encounters->encntr_data[idx2].argument_value
					  	set reply->filter_list[filter_cnt]->available_values[idx].\
					    	child_values[incr_cnt].parent_entity_id = encounters->encntr_data[idx2].parent_entity_id
				endif
 
				; Toggle the inpt_enc_type_ind if Inpatient group has any child encounters set in bedrock
				if(encounters->encntr_data[idx2].parent_entity_name = "INPT_ENC_TYPE" and inpt_enc_type_ind = 0)
					set inpt_enc_type_ind = 1
				endif
 
				; Toggle the outpt_enc_type_ind if Outpatient group has any child encounters set in bedrock
				if(encounters->encntr_data[idx2].parent_entity_name = "OUTPT_ENC_TYPE" and outpt_enc_type_ind = 0)
					set outpt_enc_type_ind = 1
				endif
 
				; Toggle the ed_enc_type_ind if Emergency group has any child encounters set in bedrock
				if(encounters->encntr_data[idx2].parent_entity_name = "ED_ENC_TYPE" and ed_enc_type_ind = 0)
					set ed_enc_type_ind = 1
				endif
			endfor
		endfor
	endif
 
	; If any of the groups does not have child encounters set in bedrock, add default child encounters for that group
	if(inpt_enc_type_ind = 0 or outpt_enc_type_ind = 0 or ed_enc_type_ind = 0)
		; Loop through all the groups
		for(idx = 1 to size(reply->filter_list[filter_cnt]->available_values,5))
			; If Inpatient group has no child enoucnters
			if(reply->filter_list[filter_cnt]->available_values[idx].parent_entity_id = 1 and inpt_enc_type_ind = 0)
				set stat = alterlist(reply->filter_list[filter_cnt]->available_values[idx].child_values, 1)
				; Add the Inpatient encounter as child to the Inpatient group
				set encounter_type_cd = uar_get_code_by_cki("CKI.CODEVALUE!3958")
				set reply->filter_list[filter_cnt]->available_values[idx].\
				    child_values[1].argument_value = UAR_GET_CODE_DISPLAY(encounter_type_cd)
				set reply->filter_list[filter_cnt]->available_values[idx].\
				    child_values[1].parent_entity_id = encounter_type_cd
			endif
			; If Outpatient group has no child enoucnters
			if(reply->filter_list[filter_cnt]->available_values[idx].parent_entity_id = 2 and outpt_enc_type_ind = 0)
				set stat = alterlist(reply->filter_list[filter_cnt]->available_values[idx].child_values, 1)
				; Add the Outpatient encounter as child to the Outpatient group
				set encounter_type_cd = uar_get_code_by_cki("CKI.CODEVALUE!3959")
				set reply->filter_list[filter_cnt]->available_values[idx].\
				    child_values[1].argument_value = UAR_GET_CODE_DISPLAY(encounter_type_cd)
				set reply->filter_list[filter_cnt]->available_values[idx].\
				    child_values[1].parent_entity_id = encounter_type_cd
			endif
			; If Emergency group has no child enoucnters
			if(reply->filter_list[filter_cnt]->available_values[idx].parent_entity_id = 4 and ed_enc_type_ind = 0)
				set stat = alterlist(reply->filter_list[filter_cnt]->available_values[idx].child_values, 1)
				; Add the Emergency encounter as child to the Emergency group
				set encounter_type_cd = uar_get_code_by_cki("CKI.CODEVALUE!3957")
				set reply->filter_list[filter_cnt]->available_values[idx].\
				    child_values[1].argument_value = UAR_GET_CODE_DISPLAY(encounter_type_cd)
				set reply->filter_list[filter_cnt]->available_values[idx].\
				    child_values[1].parent_entity_id = encounter_type_cd
			endif
		endfor
	endif
 
	; If individual encounters are configured in bedrock and individual encounter indicator is set to true
	; and if no specific individual encounters are added/selected in bedrock, then get all the individual
	; encounters from code_value table
	if(individual_enc_index != 0 and individual_enc_ind = "1" and individual_enc_cnt = 0)
		select into "nl:"
		from
			code_value cv
		plan cv
			where cv.code_set = 71
			and cv.active_ind = 1
		head cv.display_key
			individual_enc_cnt = individual_enc_cnt + 1
			if(mod(individual_enc_cnt,50) = 1)
				stat = alterlist(reply->filter_list[filter_cnt]->available_values[individual_enc_index].child_values,individual_enc_cnt+49)
			endif
 
			reply->filter_list[filter_cnt]->available_values[individual_enc_index].\
				child_values[individual_enc_cnt].ARGUMENT_VALUE= cv.display
			reply->filter_list[filter_cnt]->available_values[individual_enc_index].child_values[individual_enc_cnt].\
			PARENT_ENTITY_ID = cv.code_value
			reply->filter_list[filter_cnt]->available_values[individual_enc_index].child_values[individual_enc_cnt].\
			PARENT_ENTITY_NAME = 'INDIVIDUAL_ENC_TYPE'
 
		foot report
			stat = alterlist(reply->filter_list[filter_cnt]->available_values[individual_enc_index].child_values, individual_enc_cnt)
 
		with nocounter
	endif
 
	set ERRCODE = ERROR(ERRMSG,0)
		if(ERRCODE != 0)
			set failed = 1
			set fail_operation = "RetrieveEnctrFromBedrock"
			call replyFailure("SELECT")
		endif
 
	call log_message(
		build2("Exit RetrieveEncounterTypeFromBedrock(), Elapsed time:",
			cnvtint(curtime3-BEGIN_TIME), "0 ms","RetrieveEncounterTypeFromBedrock found ", available_val_cnt
		),LOG_LEVEL_DEBUG
	)
end
 
end
go
 
