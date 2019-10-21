drop program mp_dcp_rwl_bedrock_prefs:dba go
create program mp_dcp_rwl_bedrock_prefs:dba

prompt
	"Output to File/Printer/MINE" = "MINE" ,
	"JSON_ARGS:" = ""
 
with OUTDEV, JSON_ARGS
 
;record pref_req
;(
;	1	pos_cd = f8
;) 

%i cclsource:mp_dcp_blob_in_params.inc
set stat = cnvtjsontorec(ExtractParamsFromRequest(request, $JSON_ARGS))

free record reply
record reply
(
	1	case_mgr_header = vc
	1	case_mgr_cd[*]
		2 case_mgr_cd_value = f8
	1	pcp_header = vc
	1	pcp_cd[*]
		2 pcp_cd_value = f8
	1	event_filters[*]
		2 section_name = vc
		2 settings[*]
			3 setting_name = vc
			3 values[*]
				4 value = vc
	1	powerform_title = vc
	1	powerform_forms[*]
		2 id = f8
		2 name = vc
	1   summary_mpage_path = vc
	1   summary_mpage_identifier = vc
	1   summary_mpage_driver = vc
	1	appointment_header = vc
	1	orders_header = vc
	1	export_patient_summary_flag = i2
	1	export_flag = i2
	1	customize_filters[*]
		2 filter = vc
	1	healthe_intent
		2 mara_score_flag = i2
	1	generate_communication
		2 enable_ind = i2
		2 phone_note_type = f8
%i cclsource:status_block.inc
)
%i cclsource:mp_script_logging.inc
%i cclsource:i18n_uar.inc
%i cclsource:mp_dcp_pl_includes.inc
set modify maxvarlen 52428800
call log_message("In mp_dcp_rwl_bedrock_prefs", LOG_LEVEL_DEBUG)

/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/ 
declare MapCdfToArgName(inCdfMean = vc)			= vc
declare RetrieveCodeValuesFromBedrock(NULL)		= NULL
declare RetrieveEventFilters(NULL)				= NULL
declare RetrievePowerFormAndSummaryPrefs(NULL)	= NULL
declare RetrieveHeadersFromBedrock(NULL)		= NULL
declare replyFailure(NULL)						= NULL
declare CnvtCCLRec(NULL)						= NULL
 
/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
declare error_string = vc 
declare fail_operation = vc
declare failed = i2 with NOCONSTANT(0)
set ERRMSG =  FILLSTRING(132," ")
set ERRCODE = error(ERRMSG,1)
set reply->status_data->status = "Z"
set reply->export_patient_summary_flag = 0
set reply->export_flag = 0
set reply->healthe_intent.mara_score_flag = 0

declare dwl_category_id = f8 with noconstant(0.0)
declare pos_flex_id = f8 with noconstant(0.0)
declare system_flex_id = f8 with noconstant(0.0)
set dwl_category_id = GetCategoryId(DWL_CATEGORY_MEAN)

if(validate(pref_req->pos_cd, 0) > 0)
	set pos_flex_id = GetFlexId(pref_req->pos_cd)
else
	call replyFailure("pos_cd is required")
endif

set system_flex_id = GetFlexId(0.0)
 
/**************************************************************
; DVDev Start Coding
**************************************************************/

set error_string = FILLSTRING(132," ")

;initialize variable that will keep the handle to i18n data
;https://wiki.ucern.com/display/associates/CCL+Internationalization+UARs
declare i18n_Handle = i4 with constant(0)
set stat = uar_i18nlocalizationinit(i18n_Handle, curprog, "", curcclrev)

call RetrieveCodeValuesFromBedrock(NULL)
call RetrieveEventFilters(NULL)
call RetrievePowerFormAndSummaryPrefs(NULL)
call RetrieveHeadersFromBedrock(NULL)
 
#exit_script
	if (reply->status_data->status = "Z")
		set reply->status_data->status = "S"
	endif
	
	if(failed = 0)
		call CnvtCCLRec(null)
	endif
 
/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
; @desc Maps a CDF Meaning to DWL's "argument_name" used in the m_sections array.
; @param {vc} inCdfMean - A CDF Meaning.
; @returns {vc} The corresponding "argument_name". Returns an empty vc if the CDF Meaning is not found.
subroutine MapCdfToArgName(inCdfMean)
	call log_message("Begin MapCdfToArgName()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private

	declare toReturn = vc with noconstant(""), protect
	case(inCdfMean)
		of "ADMITRANGE":
			set toReturn = ARGNAME_ADMISSION
		of "AGE":
			set toReturn = ARGNAME_AGE
		of "APPTSTATUS":
			set toReturn = ARGNAME_APPTSTATUS
		of "ASSOCPROVIDE":
			set toReturn = ARGNAME_ASSOCPROVIDERS
		of "CARECOORD":
			set toReturn = ARGNAME_CASEMANAGER
		of "CASESTATUS":
			set toReturn = ARGNAME_CASESTATUS
		of "CONDITIONS":
			set toReturn = ARGNAME_CONDITION
		of "DISCHARGE":
			set toReturn = ARGNAME_DISCHARGE
		of "ENCNTRTYPE":
			set toReturn = ARGNAME_ENCOUNTERTYPE
		of "FINANCIAL":
			set toReturn = ARGNAME_FINANCIALCLASS
		of "HEALTHMAINT":
			set toReturn = ARGNAME_EXPECTATIONS
		of "HEALTHPLAN":
			set toReturn = ARGNAME_HEALTHPLAN
		of "LANGUAGE":
			set toReturn = ARGNAME_LANGUAGE
		of "MEDICATIONS":
			set toReturn = ARGNAME_ORDERSTATUS
		of "ORDERSTATUS":
			set toReturn = ARGNAME_ORDERSSTATUS
		of "QUALSTATUS":
			set toReturn = ARGNAME_QUALIFYING
		of "RACE":
			set toReturn = ARGNAME_RACE
		of "RANKING":
			set toReturn = ARGNAME_RANKING
		of "READMITRISK":
			set toReturn = ARGNAME_RISK
		of "REGISTRY":
			set toReturn = ARGNAME_REGISTRY
		of "RESULTS1":
			set toReturn = ARGNAME_RESULTFILTER1
		of "RESULTS2":
			set toReturn = ARGNAME_RESULTFILTER2
		of "RESULTS3":
			set toReturn = ARGNAME_RESULTFILTER3
		of "RESULTS4":
			set toReturn = ARGNAME_RESULTFILTER4
		of "RESULTS5":
			set toReturn = ARGNAME_RESULTFILTER5
		of "SEX":
			set toReturn = ARGNAME_GENDER
		of "COMMPREF":
			set toReturn = ARGNAME_COMMUNICATE_PREF
		of "PENDING_WORK":
			set toReturn = ARGNAME_PENDING_WORK
	endcase

	call log_message(build2("Exit MapCdfToArgName(), Elapsed time:", cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)

	return(toReturn)
end

subroutine RetrieveHeadersFromBedrock(NULL)
	call log_message("Begin RetrieveHeadersFromBedrock()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
    
    ;set to default here, rewrites below if the preference is set
	;items with )/*Max=XX*/) are there to limit the i18n translation to XX characters so that the columns don't have overlay
 	declare i18n_OrderHeader = vc with noconstant(uar_i18nGetMessage(i18n_Handle, "i18n_key_OrderHeader", "Order Status"))
 	declare i18n_ApptHeader  = vc with noconstant(uar_i18nGetMessage(i18n_Handle, "i18n_key_ApptHeader", "Appointment Status"))
 	declare i18n_CMHeader    = vc with noconstant(uar_i18nGetMessage(i18n_Handle, "i18n_key_CMHeader", "Care Manager"))
 	declare i18n_PCPHeader   = vc with noconstant(uar_i18nGetMessage(i18n_Handle, "i18n_key_PCPHeader", "Personal Care Provider"))

    select into "nl:"
	from
		br_datamart_filter bf,
		br_datamart_value  bv
	plan bf
		where bf.br_datamart_category_id = dwl_category_id
		and bf.filter_mean in (
				"ORDER_STATUS",
				"APPOINTMENT_STATUS",
				"CARE_MANAGER",
				"PRIM_CARE_PROVIDER"
			)
 	join bv
		where bv.br_datamart_category_id = bf.br_datamart_category_id
		and bv.br_datamart_filter_id = bf.br_datamart_filter_id
		and bv.br_datamart_flex_id in (
				pos_flex_id,
				system_flex_id
			)
		and bv.logical_domain_id = 0
	order by bv.br_datamart_flex_id desc
	head bv.br_datamart_filter_id
		case(bf.filter_mean)
			of "ORDER_STATUS":
				; Only save system pref if no position pref has been found yet.
				if(reply->orders_header = "" or bv.br_datamart_flex_id = pos_flex_id)
					reply->orders_header = bv.mpage_param_value
				endif
			of "APPOINTMENT_STATUS":
				if(reply->appointment_header = "" or bv.br_datamart_flex_id = pos_flex_id)
					reply->appointment_header = bv.mpage_param_value
				endif
			of "CARE_MANAGER":
				if(reply->case_mgr_header = "" or bv.br_datamart_flex_id = pos_flex_id)
					reply->case_mgr_header = bv.mpage_param_value
				endif
			of "PRIM_CARE_PROVIDER":
				if(reply->pcp_header = "" or bv.br_datamart_flex_id = pos_flex_id)
					reply->pcp_header = bv.mpage_param_value
				endif
		endcase
	with nocounter

	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "RetrieveHeadersFromBedrock"
       call replyFailure("SELECT")
    endif

	; Default headers if no preferences were found.
	if(reply->orders_header = "")
		set reply->orders_header = i18n_OrderHeader
	endif
	if(reply->appointment_header = "")
		set reply->appointment_header = i18n_ApptHeader
	endif
	if(reply->case_mgr_header = "")
		set reply->case_mgr_header = i18n_CMHeader
	endif
	if(reply->pcp_header = "")
		set reply->pcp_header = i18n_PCPHeader
	endif

    call log_message(build2("Exit RetrieveHeadersFromBedrock(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end

subroutine RetrievePowerFormAndSummaryPrefs(NULL)
	call log_message("Begin RetrievePowerFormAndSummaryPrefs()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
	declare form_count = i4 with private, noconstant(0)
	declare power_forms_ind = i2 with noconstant(0)
	declare export_patient_summary_ind = i2 with noconstant(0)
	declare export_ind = i2 with noconstant(0)
	declare mara_score_ind = i2 with noconstant(0), private
	declare gen_comm_enable_ind = i2 with noconstant(0), private
	declare phone_note_type_ind = i2 with noconstant(0), private
	
	select into "nl:"
	from
		br_datamart_filter bf,
		br_datamart_value  bv,
		dcp_forms_ref      f
	plan bf
		where bf.br_datamart_category_id = dwl_category_id
		and bf.filter_mean in (
				"POWER_FORMS",
				"AVAILABLE_POWER_FORMS",
				"SUMMARY_IDENTIFIER",
				"SUMMARY_STATIC_PATH",
				"SUMMARY_DRIVER",
				"EXPORT_PATIENT_SUMMARY_FLAG",
				"EXPORT_FLAG",
				"MARA_SCORE_FLAG",
				"GENERATE_COMMUNICATION_IND",
				"PHONE_NOTE_TYPE"
			)
 	join bv
		where bv.br_datamart_category_id = bf.br_datamart_category_id
		and bv.br_datamart_filter_id = bf.br_datamart_filter_id
		and bv.br_datamart_flex_id in (
				pos_flex_id,
				system_flex_id
			)
	join f
		where f.dcp_forms_ref_id = 0
		or (bv.parent_entity_id = f.dcp_forms_ref_id
				and bv.parent_entity_name = "DCP_FORMS_REF"
				and f.active_ind = 1)
	order by bv.br_datamart_flex_id desc
	head report
		form_count = 0
	detail
		if("POWER_FORMS" = bf.filter_mean)
			if((reply->powerform_title = "" and bv.br_datamart_flex_id = system_flex_id)
				or bv.br_datamart_flex_id = pos_flex_id)
				reply->powerform_title = bv.mpage_param_value
			endif
		elseif("AVAILABLE_POWER_FORMS" = bf.filter_mean and f.dcp_forms_ref_id > 0)
			if(bv.br_datamart_flex_id = pos_flex_id)
				power_forms_ind = 1
				form_count = form_count + 1
				if(mod(form_count,20) = 1)
					stat = alterlist(reply->powerform_forms, form_count + 19)
				endif
				reply->powerform_forms[form_count].id = f.dcp_forms_ref_id
				reply->powerform_forms[form_count].name = f.definition
			elseif(power_forms_ind = 0)
				form_count = form_count + 1
				if(mod(form_count,20) = 1)
					stat = alterlist(reply->powerform_forms, form_count + 19)
				endif
				reply->powerform_forms[form_count].id = f.dcp_forms_ref_id
				reply->powerform_forms[form_count].name = f.definition
			endif
		elseif("SUMMARY_IDENTIFIER" = bf.filter_mean)
			if((reply->summary_mpage_identifier = "" and bv.br_datamart_flex_id = system_flex_id)
				or bv.br_datamart_flex_id = pos_flex_id)
				reply->summary_mpage_identifier = bv.freetext_desc
			endif
		elseif("SUMMARY_STATIC_PATH" = bf.filter_mean)
			if((reply->summary_mpage_path = "" and bv.br_datamart_flex_id = system_flex_id)
				or bv.br_datamart_flex_id = pos_flex_id)
				reply->summary_mpage_path = bv.freetext_desc
			endif
		elseif("SUMMARY_DRIVER" = bf.filter_mean)
			if((reply->summary_mpage_driver = "" and bv.br_datamart_flex_id = system_flex_id)
				or bv.br_datamart_flex_id = pos_flex_id)
				reply->summary_mpage_driver = bv.freetext_desc
			endif
		elseif("EXPORT_PATIENT_SUMMARY_FLAG" = bf.filter_mean)
			if(bv.br_datamart_flex_id = pos_flex_id)
				export_patient_summary_ind = 1
				if(bv.freetext_desc = "1")
					reply->export_patient_summary_flag = 1
				else
					reply->export_patient_summary_flag = 0
				endif
			elseif(export_patient_summary_ind = 0 and bv.br_datamart_flex_id = system_flex_id)
				if(bv.freetext_desc = "1")
					reply->export_patient_summary_flag = 1
				else
					reply->export_patient_summary_flag = 0
				endif
			endif
		elseif("EXPORT_FLAG" = bf.filter_mean)
			if(bv.br_datamart_flex_id = pos_flex_id)
				export_ind = 1
				if(bv.freetext_desc = "1")
					reply->export_flag = 1
				else
					reply->export_flag = 0
				endif
			elseif(export_ind = 0 and bv.br_datamart_flex_id = system_flex_id)
				if(bv.freetext_desc = "1")
					reply->export_flag = 1
				else
					reply->export_flag = 0
				endif
			endif
		elseif("MARA_SCORE_FLAG" = bf.filter_mean)
			if(bv.br_datamart_flex_id = pos_flex_id)
				mara_score_ind = 1
				if(bv.freetext_desc = "1")
					reply->healthe_intent.mara_score_flag = 1
				else
					reply->healthe_intent.mara_score_flag = 0
				endif
			elseif(mara_score_ind = 0 and bv.br_datamart_flex_id = system_flex_id)
				if(bv.freetext_desc = "1")
					reply->healthe_intent.mara_score_flag = 1
				else
					reply->healthe_intent.mara_score_flag = 0
				endif
			endif
		elseif("GENERATE_COMMUNICATION_IND" = bf.filter_mean)
			if(bv.br_datamart_flex_id = pos_flex_id)
				gen_comm_enable_ind = 1
				if(bv.freetext_desc = "1")
					reply->generate_communication->enable_ind = 1
				else
					reply->generate_communication->enable_ind = 0
				endif
			elseif(gen_comm_enable_ind = 0 and bv.br_datamart_flex_id = system_flex_id)
				if(bv.freetext_desc = "1")
					reply->generate_communication.enable_ind = 1
				else
					reply->generate_communication.enable_ind = 0
				endif
			endif
		elseif("PHONE_NOTE_TYPE" = bf.filter_mean)
			if(bv.br_datamart_flex_id = pos_flex_id)
				phone_note_type_ind = 1
				reply->generate_communication.phone_note_type = cnvtreal(bv.freetext_desc)
			elseif(phone_note_type_ind = 0 and bv.br_datamart_flex_id = system_flex_id)
				reply->generate_communication.phone_note_type = cnvtreal(bv.freetext_desc)
			endif
		endif
	foot report
		stat = alterlist(reply->powerform_forms, form_count)
	with nocounter

	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "RetrievePowerFormAndSummaryPrefs"
       call replyFailure("SELECT")
    endif	

	call log_message(build2("Exit RetrievePowerFormAndSummaryPrefs(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms ","RetrievePowerFormAndSummaryPrefs found ", form_count), 
     LOG_LEVEL_DEBUG)
end

subroutine RetrieveEventFilters(NULL)
	call log_message("Begin RetrieveEventFilters()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private

	declare findnum = i4 with private, noconstant(0)
	declare prefLoc = i4 with private, noconstant(0)
	declare prefValueIndex = i4 with private, noconstant(0)
	declare argPos = i4 with private, noconstant(0)
	declare num = i4 with private, noconstant(0)
	declare listSize = i4 with noconstant(size(reply->event_filters, 5))
	declare ind_result1 = i2 with noconstant(0)
	declare ind_result2 = i2 with noconstant(0)
	declare ind_result3 = i2 with noconstant(0)
	declare ind_result4 = i2 with noconstant(0)
	declare ind_result5 = i2 with noconstant(0)

	; Get all position level preferences for event filters.
	select into "nl:"
		from
			br_datamart_filter bf,
			br_datamart_value  bv
		plan bf
			where bf.br_datamart_category_id = dwl_category_id
			and bf.filter_mean in (
					patstring("EVENT_SET_GROUP_?"),
					patstring("EVENT_SET_NAME_?"),
					patstring("VALUE_SEARCH_IND_?")
				)
	 	join bv
			where bv.br_datamart_category_id = bf.br_datamart_category_id
			and bv.br_datamart_filter_id = bf.br_datamart_filter_id
			and bv.logical_domain_id = 0
			and bv.br_datamart_flex_id = pos_flex_id
	   	order by bf.filter_seq

		head bf.filter_seq
			prefLoc = 0
			prefValueIndex = 0
			num = cnvtalphanum(bf.filter_mean, 1);1=get number only
			findnum = 0
			listSize = size(reply->event_filters, 5)
			argPos = locateval(findnum, 1, listSize, build("RESULTFILTER", num), reply->event_filters[findnum].section_name)
			;if argPos = 0 allocate space
			if(argPos = 0)
				stat = alterlist(reply->event_filters, listSize + 1)
				reply->event_filters[listSize + 1].section_name = build("RESULTFILTER", num)
				argPos = listSize + 1
			endif
			;set the size of reply->filter_list[num].available_values to 3 if size is zero
			if(argPos != 0)
				case(num)	; Save that we found position prefs, so we don't save over them with system prefs.
					of "1":
						ind_result1 = 1
					of "2":
						ind_result2 = 1
					of "3":
						ind_result3 = 1
					of "4":
						ind_result4 = 1
					of "5":
						ind_result5 = 1
				endcase
				if(size(reply->event_filters[argPos].settings, 5) = 0)
					stat = alterlist(reply->event_filters[argPos].settings, 3)
				endif
				if(findstring("EVENT_SET_NAME", bf.filter_mean) > 0)
		  			prefLoc = 1
					reply->event_filters[argPos].settings[prefLoc].setting_name = "FILTER_NAME"
				elseif(findstring("EVENT_SET_GROUP", bf.filter_mean) > 0)
					prefLoc = 2
					reply->event_filters[argPos].settings[prefLoc].setting_name = "EVENT_SET"
				elseif(findstring("VALUE_SEARCH_IND", bf.filter_mean) > 0)
					prefLoc = 3
					reply->event_filters[argPos].settings[prefLoc].setting_name = "VALUE_QUERY"
				endif
			endif
	
		detail
			if(argPos > 0 and prefLoc > 0)
				prefValueIndex = prefValueIndex + 1
				;increment size of reply->filter_list[num].available_values[prefLoc].child_values
				if(mod(prefValueIndex,20) = 1)
					stat = alterlist(reply->event_filters[argPos].settings[prefLoc].values, prefValueIndex + 19)
				endif
			
				reply->event_filters[argPos].settings[prefLoc].values[prefValueIndex].value = bv.freetext_desc
			endif
			
	 	foot bf.filter_seq
	 		if(argPos != 0 and prefLoc > 0)
				stat = alterlist(reply->event_filters[argPos].settings[prefLoc].values, prefValueIndex)
			endif
		with nocounter

		if( ind_result1 = 0 or
			ind_result2 = 0 or
			ind_result3 = 0 or
			ind_result4 = 0 or
			ind_result5 = 0
		)	; If there was at least one result filter with no position prefs, then search for additional system prefs. 
			select into "nl:"
			from
				br_datamart_filter bf,
				br_datamart_value bv
			plan bf
				where bf.br_datamart_category_id = dwl_category_id
				and bf.filter_mean in (
						patstring("EVENT_SET_GROUP_?"),
						patstring("EVENT_SET_NAME_?"),
						patstring("VALUE_SEARCH_IND_?")
					)
		 	join bv
				where bv.br_datamart_category_id = bf.br_datamart_category_id
				and bv.br_datamart_filter_id = bf.br_datamart_filter_id
				and bv.logical_domain_id = 0
				and bv.br_datamart_flex_id = system_flex_id
		   	order by bf.filter_seq
	
			head bf.filter_seq
				prefLoc = 0
				prefValueIndex = 0
				num = cnvtalphanum(bf.filter_mean, 1);1=get number only
				findnum = 0
				listSize = size(reply->event_filters, 5)
				argPos = locateval(findnum, 1, listSize, build("RESULTFILTER", num), reply->event_filters[findnum].section_name)
				;if argPos = 0 allocate space
				if(argPos = 0)
					stat = alterlist(reply->event_filters, listSize + 1)
					reply->event_filters[listSize + 1].section_name = build("RESULTFILTER", num)
					argPos = listSize + 1
				endif
				;set the size of reply->filter_list[num].available_values to 3 if size is zero
				if(argPos != 0 and (
					(num = "1" and ind_result1 = 0) or
					(num = "2" and ind_result2 = 0) or
					(num = "3" and ind_result3 = 0) or
					(num = "4" and ind_result4 = 0) or
					(num = "5" and ind_result5 = 0)
					)
				)
					if(size(reply->event_filters[argPos].settings, 5) = 0)
						stat = alterlist(reply->event_filters[argPos].settings, 3)
					endif
					if(findstring("EVENT_SET_NAME", bf.filter_mean) > 0)
			  			prefLoc = 1
						reply->event_filters[argPos].settings[prefLoc].setting_name = "FILTER_NAME"
					elseif(findstring("EVENT_SET_GROUP", bf.filter_mean) > 0)
						prefLoc = 2
						reply->event_filters[argPos].settings[prefLoc].setting_name = "EVENT_SET"
					elseif(findstring("VALUE_SEARCH_IND", bf.filter_mean) > 0)
						prefLoc = 3
						reply->event_filters[argPos].settings[prefLoc].setting_name = "VALUE_QUERY"
					endif
				endif
		
			detail
				if((argPos > 0 and prefLoc > 0) and (
						(num = "1" and ind_result1 = 0) or
						(num = "2" and ind_result2 = 0) or
						(num = "3" and ind_result3 = 0) or
						(num = "4" and ind_result4 = 0) or
						(num = "5" and ind_result5 = 0)
					)
				)
					prefValueIndex = prefValueIndex + 1
					;increment size of reply->filter_list[num].available_values[prefLoc].child_values
					if(mod(prefValueIndex,20) = 1)
						stat = alterlist(reply->event_filters[argPos].settings[prefLoc].values, prefValueIndex + 19)
					endif
				
					reply->event_filters[argPos].settings[prefLoc].values[prefValueIndex].value = bv.freetext_desc
				endif
				
		 	foot bf.filter_seq
		 		if(argPos != 0 and prefLoc > 0)
					stat = alterlist(reply->event_filters[argPos].settings[prefLoc].values, prefValueIndex)
				endif
			with nocounter
		endif
		
		set ERRCODE = ERROR(ERRMSG,0)
		if(ERRCODE != 0)
		   set failed = 1
		   set fail_operation = "RetrieveEventFilters"
		   call replyFailure("SELECT")
		endif
		
		call log_message(build2("Exit RetrieveEventFilters(), Elapsed time:", cnvtint(curtime3-BEGIN_TIME),
				"0 ms ","RetrieveEventFilters found ", size(reply->event_filters, 5)), LOG_LEVEL_DEBUG)
end

subroutine RetrieveCodeValuesFromBedrock(NULL)
	call log_message("Begin RetrieveCodeValuesFromBedrock()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
 
	declare case_mgr_cnt = i4 with noconstant(0)
	declare pcp_cnt      = i4 with noconstant(0)
	declare filter_count = i4 with noconstant(0), protect

	declare lifecasemgr_value = f8 with noconstant(0)
	declare cmadmin_value = f8 with noconstant(0)
	declare cmassist_value = f8 with noconstant(0)
	declare casemgmtprov_value = f8 with noconstant(0)
	declare pcp_value = f8 with noconstant(0)

	declare flex_id_case_mgr    = f8 with noconstant(system_flex_id), protect
	declare flex_id_avail_reltn = f8 with noconstant(system_flex_id), protect
	declare flex_id_filter_cds  = f8 with noconstant(system_flex_id), protect
	
	select into "nl:"
	from
		br_datamart_filter bf,
		br_datamart_value  bv
	plan bf
		where bf.br_datamart_category_id = dwl_category_id
		and bf.filter_mean in (
				"CASE_MGR_CDS",
				"AVAILABLE_RELTN_CDS",
				"CUSTOMIZE_FILTER_CDS"
			)
 	join bv
		where bv.br_datamart_category_id = bf.br_datamart_category_id
		and bv.br_datamart_filter_id = bf.br_datamart_filter_id
		and bv.br_datamart_flex_id in (
				pos_flex_id,
				system_flex_id
			)
		and bv.parent_entity_name = "CODE_VALUE"
		and bv.parent_entity_id > 0
		and bv.logical_domain_id = 0
	order by bv.br_datamart_flex_id desc
	detail
		case(bf.filter_mean)
			of "CASE_MGR_CDS":
				if(bv.br_datamart_flex_id = pos_flex_id)
					flex_id_case_mgr = pos_flex_id
				endif
	 			if(bv.br_datamart_flex_id = flex_id_case_mgr)
					case_mgr_cnt = case_mgr_cnt + 1
					if(mod(case_mgr_cnt, 10) = 1)
						stat = alterlist(reply->case_mgr_cd,case_mgr_cnt+9)
					endif
					reply->case_mgr_cd[case_mgr_cnt].case_mgr_cd_value = bv.parent_entity_id
				endif
			of "AVAILABLE_RELTN_CDS":
	 			if(bv.br_datamart_flex_id = pos_flex_id)
	 				flex_id_avail_reltn = pos_flex_id
	 			endif
	 			if(bv.br_datamart_flex_id = flex_id_avail_reltn)
		 			pcp_cnt = pcp_cnt + 1
		 			if (mod(pcp_cnt, 10) = 1)
		 				stat = alterlist(reply->pcp_cd,pcp_cnt+9)
		 			endif
		 			reply->pcp_cd[pcp_cnt].pcp_cd_value = bv.parent_entity_id
				endif
			of "CUSTOMIZE_FILTER_CDS":
				if(bv.br_datamart_flex_id = pos_flex_id)
					flex_id_filter_cds = pos_flex_id
				endif
				if(bv.br_datamart_flex_id = flex_id_filter_cds)
					filter_count = filter_count + 1
					if(mod(filter_count, 24) = 1)
						stat = alterlist(reply->customize_filters, filter_count+23)
					endif
					reply->customize_filters[filter_count].filter = MapCdfToArgName(UAR_GET_CODE_MEANING(bv.parent_entity_id))
				endif
		endcase
 	foot report
 		stat = alterlist (reply->case_mgr_cd, case_mgr_cnt)
 		stat = alterlist (reply->pcp_cd, pcp_cnt)
 		stat = alterlist (reply->customize_filters, filter_count)
 		
	with nocounter
	
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "RetrieveRelationships"
       call replyFailure("SELECT")
    endif
	
	if(case_mgr_cnt = 0)
	
		;Set the 4 default Case Manager Relationships if none are loaded through Bedrock
		set lifecasemgr_value = uar_get_code_by("MEANING", 331, "LIFECASEMGR")
		if(lifecasemgr_value > 0)
			set case_mgr_cnt = case_mgr_cnt + 1
			set stat = alterlist(reply->case_mgr_cd, case_mgr_cnt)
			set reply->case_mgr_cd[case_mgr_cnt].case_mgr_cd_value = lifecasemgr_value
		endif
 
 		set cmadmin_value = uar_get_code_by("MEANING", 331, "CMADMIN")
		if(cmadmin_value > 0)
			set case_mgr_cnt = case_mgr_cnt + 1
			set stat = alterlist(reply->case_mgr_cd, case_mgr_cnt)
			set reply->case_mgr_cd[case_mgr_cnt].case_mgr_cd_value = cmadmin_value
		endif
 
 		set cmassist_value = uar_get_code_by("MEANING", 331, "CMASSIST")
		if(cmassist_value > 0)
			set case_mgr_cnt = case_mgr_cnt + 1
			set stat = alterlist(reply->case_mgr_cd, case_mgr_cnt)
			set reply->case_mgr_cd[case_mgr_cnt].case_mgr_cd_value = cmassist_value
		endif
 
 		set casemgmtprov_value = uar_get_code_by("MEANING", 331, "CASEMGMTPROV")
		if(casemgmtprov_value > 0)
			set case_mgr_cnt = case_mgr_cnt + 1
			set stat = alterlist(reply->case_mgr_cd, case_mgr_cnt)
			set reply->case_mgr_cd[case_mgr_cnt].case_mgr_cd_value = casemgmtprov_value
		endif
	endif
 
	if(pcp_cnt = 0)
		;Set the default Primary Care Provider Relationships if none are loaded through Bedrock
		set pcp_value = uar_get_code_by("MEANING", 331, "PCP")
		if(pcp_value > 0)
			set pcp_cnt = pcp_cnt + 1
			set stat = alterlist(reply->pcp_cd, pcp_cnt)
			set reply->pcp_cd[pcp_cnt].pcp_cd_value = pcp_value
		endif
	endif
	
	call log_message(build2("Exit RetrieveCodeValuesFromBedrock(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms "), LOG_LEVEL_DEBUG) 

end

subroutine replyFailure(targetObjName)
     call log_message("In replyFailure()", LOG_LEVEL_DEBUG)
     declare BEGIN_TIME = f8 with constant(curtime3), private
     
     call log_message(build("Error: ", targetObjName, " - ", trim(ERRMSG)), LOG_LEVEL_ERROR)
 
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
;call echorecord(reply)
end
go
 
 
 ;mp_dcp_rwl_bedrock_prefs go
