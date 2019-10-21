 
 
/***Query Types***/
declare QUERYTYPE_ACMGROUP = vc with Protect,constant("ACMGROUP")
declare DWL_CATEGORY_MEAN  = vc with protect,constant("MP_AMB_CARE_MGT")
 
/***Argument Types***/
declare ARGNAME_ACMGROUP 		  = vc with Protect, constant("ACMPRSNLGROUPS")
declare ARGNAME_SINGLEPROVIDER	  = vc with Protect, constant("SINGLEPROVIDER")
declare ARGNAME_PPRCODE 		  = vc with Protect, constant("PPRCODES")
declare ARGNAME_EPRCODE 		  = vc with Protect, constant("EPRCODES")
declare ARGNAME_LOCATIONS 		  = vc with Protect, constant("LOCATIONS")
declare ARGNAME_LOCATIONDAYS      = vc with Protect, constant("LOCATIONDAYS")
declare ARGNAME_LOCATIONWEEKS     = vc with Protect, constant("LOCATIONWEEKS")
declare ARGNAME_LOCATIONMONTHS     = vc with Protect, constant("LOCATIONMONTHS")
declare ARGNAME_LOCATIONUNITS      = vc with Protect, constant("LOCATIONUNITS")
declare ARGNAME_DISCHARGE		  = vc with Protect, constant("DISCHARGE")
declare ARGNAME_DISCHARGEMONTHS	  = vc with Protect, constant("DISCHARGEMONTHS")
declare ARGNAME_DISCHARGEDAYS	  = vc with Protect, constant("DISCHARGEDAYS")
declare ARGNAME_DISCHARGEWEEKS	  = vc with Protect, constant("DISCHARGEWEEKS")
declare ARGNAME_AUTOREMOVE	  	  = vc with Protect, constant("AUTOREMOVEPATIENTS")
declare ARGNAME_CASESTATUS		  = vc with Protect, constant("CASESTATUS")
declare ARGNAME_RACE              = vc with Protect, constant("RACE")
declare ARGNAME_GENDER            = vc with Protect, constant("GENDER")
declare ARGNAME_LANGUAGE          = vc with Protect, constant("LANGUAGE")
declare ARGNAME_PAYER             = vc with Protect, constant("PAYER")
declare ARGNAME_HEALTHPLAN        = vc with Protect, constant("HEALTHPLAN")
declare ARGNAME_FINANCIALCLASS    = vc with Protect, constant("FINANCIALCLASS")
declare ARGNAME_AGE		       	  = vc with Protect, constant("AGE")
declare ARGNAME_AGEFROM       	  = vc with Protect, constant("AGEFROM")
declare ARGNAME_AGETO      		  = vc with Protect, constant("AGETO")
declare ARGNAME_AGEGREATER        = vc with Protect, constant("AGEGREATER")
declare ARGNAME_AGELESS      	  = vc with Protect, constant("AGELESS")
declare ARGNAME_AGEEQUAL      	  = vc with Protect, constant("AGEEQUAL")
declare ARGNAME_AGEDAYS			  = vc with Protect, constant("AGEDAYS")
declare ARGNAME_AGEWEEKS		  = vc with Protect, constant("AGEWEEKS")
declare ARGNAME_AGEMONTHS		  = vc with Protect, constant("AGEMONTHS")
declare ARGNAME_AGEYEARS		  = vc with Protect, constant("AGEYEARS")
declare ARGNAME_CASEMANAGER       = vc with Protect, constant("CASEMANAGER")
declare ARGNAME_BARRIERS          = vc with Protect, constant("BARRIERS")
declare ARGNAME_PROBLEM           = vc with Protect, constant("PROBLEM")
declare ARGNAME_CONFIDLEVEL       = vc with Protect, constant("CONFIDENTIALITYLEVEL")
declare ARGNAME_CONDITION         = vc with Protect, constant("CONDITION")
declare ARGNAME_DIAGNOSIS         = vc with Protect, constant("DIAGNOSIS")
declare ARGNAME_MEASURES          = vc with Protect, constant("MEASURES")
declare ARGNAME_ADMISSION		  = vc with Protect, constant("ADMISSION")
declare ARGNAME_ADMISSIONMONTHS   = vc with Protect, constant("ADMISSIONMONTHS")
declare ARGNAME_ADMISSIONWEEKS    = vc with Protect, constant("ADMISSIONWEEKS")
declare ARGNAME_ADMISSIONDAYS     = vc with Protect, constant("ADMISSIONDAYS")
declare ARGNAME_ADMISSIONFROM     = vc with Protect, constant("ADMISSIONFROM")
declare ARGNAME_ADMISSIONTO       = vc with Protect, constant("ADMISSIONTO")
declare ARGNAME_ENCOUNTER         = vc with Protect, constant("ENCOUNTER")
declare ARGNAME_ENCOUNTERTYPE     = vc with Protect, constant("ENCOUNTERTYPE")
declare ARGNAME_REGISTRY          = vc with Protect, constant("REGISTRY")
declare ARGNAME_ORDERSTATUS		  = vc with Protect, constant("ORDERSTATUS")
declare ARGNAME_RESULTFILTER1	  = vc with Protect, constant("RESULTFILTER1")
declare ARGNAME_RESULTFILTER2	  = vc with Protect, constant("RESULTFILTER2")
declare ARGNAME_RESULTFILTER3	  = vc with Protect, constant("RESULTFILTER3")
declare ARGNAME_RESULTFILTER4	  = vc with Protect, constant("RESULTFILTER4")
declare ARGNAME_RESULTFILTER5	  = vc with Protect, constant("RESULTFILTER5")
declare ARGNAME_COND_OPERATOR	  = vc with Protect, constant("CONDITION_OPERATOR")
declare ARGNAME_ASSOCPROVIDERS	  = vc with Protect, constant("ASSOC_PROVIDERS")
declare ARGNAME_ASSOCRELTN		  = vc with Protect, constant("ASSOC_RELTN")
declare ARGNAME_APPTSTATUS		  = vc with Protect, constant("APPTSTATUS")
declare ARGNAME_APPTFROM		  = vc with Protect, constant("APPTFROM")
declare ARGNAME_APPTTO			  = vc with Protect, constant("APPTTO")
declare ARGNAME_APPTDATEUNIT	  = vc with Protect, constant("APPTDATEUNIT")
declare ARGNAME_NOAPPT            = vc with Protect, constant("NOAPPT")
declare ARGNAME_ORDERSSTATUS	  = vc with Protect, constant("ORDERSSTATUS")
declare ARGNAME_ORDERTYPE		  = vc with Protect, constant("ORDERTYPE")
declare ARGNAME_ORDERFROM		  = vc with Protect, constant("ORDERFROM")
declare ARGNAME_ORDERTO			  = vc with Protect, constant("ORDERTO")
declare ARGNAME_ORDERDATEUNIT	  = vc with Protect, constant("ORDERDATEUNIT")
declare ARGNAME_EXPECTATIONS	  = vc with Protect, constant("EXPECTATIONS")
declare ARGNAME_RECOMMSTATUS	  = vc with Protect, constant("RECOMMSTATUS")
declare ARGNAME_RISK			  = vc with Protect, constant("RISK")
declare ARGNAME_RANKING           = vc with Protect, constant("RANKING")
declare ARGNAME_QUALIFYING        = vc with Protect, constant("QUALIFYING")
declare ARGNAME_COMMUNICATE_PREF  = vc with Protect, constant("COMMUNICATIONPREF")
declare ARGNAME_PENDING_WORK      = vc with Protect, constant("PENDING_WORK")
declare ARGVAL_NEARDUE			  = vc with Protect, constant("Near Due")
declare ARGVAL_DUE				  = vc with Protect, constant("Due")
declare ARGVAL_OVERDUE			  = vc with Protect, constant("Overdue")
declare ARGVAL_NOTDUE			  = vc with Protect, constant("Not Due")
 
/***Common Records***/
 
	;Stores the relationship code values that are considered to be a "Case Manager"
	free record bedrock_prefs
	record bedrock_prefs
	(
		1 case_mgr[*]
			2 case_mgr_cd = f8
		1 encntr_types[*]
			2 encntr_type_cd = f8
			2 encntr_group = i4 ;1 = inpatient group, 2 = outpatient group, 4 = emergency group.
	)

	free record user_orgs
	record user_orgs
	(
		1 organizations[*]
			2 organization_id = f8
	)
 
declare ARGNAME_DEFAULT = vc with Protect, constant("LISTDEFAULT")
 
 
/***Common Subroutines***/
declare RetrieveCaseManagerFromBedrock(NULL) = NULL
declare RetrieveAssociatedOrganizations(user_id = f8) = NULL
declare FormatPhoneNumber(phoneNumber = vc, phoneFormatCode = f8) = vc
 
subroutine RetrieveCaseManagerFromBedrock(NULL)
 
	declare case_mgr_cnt = i4 with noconstant(0)
 
	;TO DO - need to join on logical domain?
	select into "nl:"
	from
		br_datamart_category bc
		,br_datamart_filter bf
		,br_datamart_value bv
	plan bc
		where bc.category_mean = "MP_AMB_CARE_MGT"
		and bc.category_type_flag = 1
	join bf
		where bf.br_datamart_category_id = bc.br_datamart_category_id
		and bf.filter_mean = "CASE_MGR_CDS"
 	join bv
		where bv.br_datamart_category_id = bf.br_datamart_category_id
		and bv.br_datamart_filter_id = bf.br_datamart_filter_id
		and bv.logical_domain_id = 0
	detail
 
		if(bv.parent_entity_id > 0)
 
			case_mgr_cnt = case_mgr_cnt + 1
			if (mod(case_mgr_cnt, 10) = 1)
    	        stat = alterlist(bedrock_prefs->case_mgr,case_mgr_cnt+9)
			endif
 
			bedrock_prefs->case_mgr[case_mgr_cnt].case_mgr_cd = bv.parent_entity_id
 
		endif
 
	with nocounter
 
	set stat = alterlist (bedrock_prefs->case_mgr, case_mgr_cnt)
 
	if(case_mgr_cnt = 0)
		;Set the 4 default Case Manager Relationships if none are loaded through Bedrock
		if(uar_get_code_by("MEANING", 331, "LIFECASEMGR") > 0)
			set case_mgr_cnt = case_mgr_cnt + 1
			set stat = alterlist(bedrock_prefs->case_mgr,case_mgr_cnt)
			set bedrock_prefs->case_mgr[case_mgr_cnt].case_mgr_cd = uar_get_code_by("MEANING", 331, "LIFECASEMGR")
		endif
 
		if(uar_get_code_by("MEANING", 331, "CMADMIN") > 0)
			set case_mgr_cnt = case_mgr_cnt + 1
			set stat = alterlist(bedrock_prefs->case_mgr,case_mgr_cnt)
			set bedrock_prefs->case_mgr[case_mgr_cnt].case_mgr_cd = uar_get_code_by("MEANING", 331, "CMADMIN")
		endif
 
		if(uar_get_code_by("MEANING", 331, "CMASSIST") > 0)
			set case_mgr_cnt = case_mgr_cnt + 1
			set stat = alterlist(bedrock_prefs->case_mgr,case_mgr_cnt)
			set bedrock_prefs->case_mgr[case_mgr_cnt].case_mgr_cd = uar_get_code_by("MEANING", 331, "CMASSIST")
		endif
 
		if(uar_get_code_by("MEANING", 331, "CASEMGMTPROV") > 0)
			set case_mgr_cnt = case_mgr_cnt + 1
			set stat = alterlist(bedrock_prefs->case_mgr,case_mgr_cnt)
			set bedrock_prefs->case_mgr[case_mgr_cnt].case_mgr_cd = uar_get_code_by("MEANING", 331, "CASEMGMTPROV")
		endif
	endif
 
end
 
; @desc    Get the flex_id of a position.
; @param   {f8} POSITION_CD - A position code from Code Set #88.
; @returns {f8} The flex_id of the provided position code. 0 if a flex_id is not found.
SUBROUTINE GetFlexId(POSITION_CD)
    CALL log_message("Begin GetFlexId()", LOG_LEVEL_DEBUG)
 
    DECLARE BEGIN_TIME = f8 WITH CONSTANT(curtime3), PRIVATE
    ; Default to system configuration if no flex_id is found for given position code.
    DECLARE flex_id = f8 WITH NOCONSTANT(0), PROTECT	; 0 = system level configuration
 
    SELECT INTO "nl:"
    FROM   br_datamart_flex bdf
    WHERE  bdf.parent_entity_id = POSITION_CD AND
           bdf.parent_entity_type_flag = 1    AND
           bdf.grouper_ind = 0                AND
           bdf.grouper_flex_id = 0.0
    HEAD   bdf.br_datamart_flex_id
           flex_id = bdf.br_datamart_flex_id
    WITH   NOCOUNTER
 
    CALL log_message(build2("Exit GetFlexId(), Elapsed time:", cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
 
    RETURN (flex_id)
END
 
; @desc    Get the br_datamart_category_id of a bedrock component.
; @param   {vc30} CATEGORY_MEAN - A unique string for a bedrock component.
; @returns {f8}   The br_datamart_category_id corresponding to the category_mean.
SUBROUTINE GetCategoryId(CATEGORY_MEAN)
    CALL log_message("Begin GetCategoryId()", LOG_LEVEL_DEBUG)
 
    DECLARE BEGIN_TIME  = f8 WITH CONSTANT(curtime3), PRIVATE
    DECLARE category_id = f8 WITH NOCONSTANT(0), PROTECT
 
    SELECT INTO "nl:"
    FROM   br_datamart_category bdc
    WHERE  bdc.category_mean = CATEGORY_MEAN AND
           bdc.category_type_flag = 1	; Only get the MPages type of the category.
    HEAD   bdc.br_datamart_category_id
           category_id = bdc.br_datamart_category_id
    WITH   NOCOUNTER
 
    CALL log_message(build2("Exit GetCategoryId(), Elapsed time:", cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
 
    RETURN (category_id)
END

subroutine RetrieveAssociatedOrganizations(user_id)
	call log_message("Begin RetrieveAssociatedOrganizations()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
 
	declare org_cnt = i4 with noconstant(0), protect
 
	select distinct into "nl:"
	from prsnl_org_reltn por
		,organization o
	plan por
		where por.person_id = user_id
			and por.active_ind = 1
			and por.beg_effective_dt_tm <= cnvtdatetime(curdate, curtime3)
			and por.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	join o
		where o.organization_id = por.organization_id
			and o.active_ind = 1
			and o.beg_effective_dt_tm <= cnvtdatetime(curdate, curtime3)
			and o.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	detail
		org_cnt = org_cnt + 1
		if(mod(org_cnt,100) = 1)
			stat = alterlist(user_orgs->organizations, org_cnt + 99)
		endif
		user_orgs->organizations[org_cnt]->organization_id = por.organization_id
	foot report
		stat = alterlist(user_orgs->organizations,org_cnt)
	with nocounter
 
	set ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
		set failed = 1
		set fail_operation = "RetrieveAssociatedOrganizations"
		call replyFailure("SELECT")
	endif
 
	call log_message(build2("Exit RetrieveAssociatedOrganizations(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end
 
subroutine FormatPhoneNumber(phoneNumber, phoneFormatCode)
	call log_message("In FormatPhoneNumber()", LOG_LEVEL_DEBUG)
 
	declare BEGIN_TIME = f8 with constant(curtime3), private
	declare temp_phone = vc with noconstant(""), protect
	declare format_phone = vc with noconstant(""), protect
 
	set temp_phone = cnvtalphanum(phoneNumber)
	if (temp_phone != phoneNumber)
		set format_phone = phoneNumber
	else
		if (phoneFormatCode > 0)
			set format_phone = cnvtphone(trim(phoneNumber), phoneFormatCode)
		elseif (size(temp_phone) < 8)
			set format_phone = format(temp_phone,"###-####")
		else
			set format_phone = format(temp_phone,"(###) ###-####")
		endif
	endif
	if (size(format_phone) <= 0)
		set format_phone = phoneNumber
	endif
 
	call log_message(build2("Exit FormatPhoneNumber(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
 
	return (format_phone)
end