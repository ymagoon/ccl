/**************************************************************************************
  *                                                                                   *
  *  Copyright Notice:  (c) 1983 Laboratory Information Systems &                     *
  *                              Technology, Inc.                                     *
  *       Revision      (c) 1984-1997 Cerner Corporation                              *
  *                                                                                   *
  *  Cerner (R) Proprietary Rights Notice:  All rights reserved.                      *
  *  This material contains the valuable properties and trade secrets of              *
  *  Cerner Corporation of Kansas City, Missouri, United States of                    *
  *  America (Cerner), embodying substantial creative efforts and                     *
  *  confidential information, ideas and expressions, no part of which                *
  *  may be reproduced or transmitted in any form or by any means, or                 *
  *  retained in any storage or retrieval system without the express                  *
  *  written permission of Cerner.                                                    *
  *                                                                                   *
  *  Cerner is a registered mark of Cerner Corporation.                               *
  *                                                                                   *
  *************************************************************************************/
/**************************************************************************************
 
        Source file name:                   mp_common.inc
        Object name:                        n/a
 
        Product:                            Discern MPages
        Product Team:                       Discern ABU
 
        Program purpose:                    Utility subroutines for MPages
 
        Tables read:                        None
 
        Tables updated:                     None
 
        Executing from:                     PowerChart
 
        Special Notes:                      None
 
/**************************************************************************************
	***********************************************************************
	*                   GENERATED MODIFICATION CONTROL LOG                *
	***********************************************************************
	 Mod	Date        Feature Engineer        Comment
     ----	--------	-------	---------------	---------------------------------------
     0000	01/25/11	 		Sean Turk		Added returnViewerType subroutine
     0001	06/20/11			Lisa Moore		Took out end_effective_dt_tm from OutputPersonnelList subroutine so "inactive" authors still show
**************************************************************************************************/
/* DECLARE VARIABLES *****************************************************************************/
declare CURRENT_DATE_TIME		= dq8 with constant(cnvtdatetime(curdate,curtime3)), protect
declare CURRENT_TIME_ZONE		= i4 with constant(datetimezonebyname(curtimezone)), protect
declare ENDING_DATE_TIME		= dq8 with constant(cnvtdatetime("31-DEC-2100")), protect
declare BIND_CNT				= i4 with constant(50), protect
declare lower_bound_date 		= vc with constant("01-JAN-1800 00:00:00.00"),protect
declare upper_bound_date 		= vc with constant ("31-DEC-2100 23:59:59.99"),protect
declare codeListCnt				= i4 with noconstant(0), protect
declare prsnlListCnt			= i4 with noconstant(0), protect
declare phoneListCnt			= i4 with noconstant(0), protect
 
declare code_idx = i4 with noconstant(0), protect
declare prsnl_idx = i4 with noconstant(0), protect
declare phone_idx = i4 with noconstant(0), protect
declare prsnl_cnt = i4 with noconstant(0), protect
 
declare MPC_AP_TYPE_CD = f8 with  protect, noconstant(0.0)
declare MPC_DOC_TYPE_CD = f8 with  protect, noconstant(0.0)
declare MPC_MDOC_TYPE_CD = f8 with  protect, noconstant(0.0)
declare MPC_RAD_TYPE_CD = f8 with  protect, noconstant(0.0)
declare MPC_TXT_TYPE_CD = f8 with  protect, noconstant(0.0)
declare MPC_NUM_TYPE_CD = f8 with  protect, noconstant(0.0)
declare MPC_IMMUN_TYPE_CD = f8 with  protect, noconstant(0.0)
declare MPC_MED_TYPE_CD = f8 with  protect, noconstant(0.0)
declare MPC_DATE_TYPE_CD = f8 with  protect, noconstant(0.0)
declare MPC_DONE_TYPE_CD = f8 with  protect, noconstant(0.0)
declare MPC_MBO_TYPE_CD = f8 with  protect, noconstant(0.0)
declare MPC_PROCEDURE_TYPE_CD = f8 with  protect, noconstant(0.0)
declare MPC_GRP_TYPE_CD = f8 with  protect, noconstant(0.0)
declare MPC_HLATYPING_TYPE_CD = f8 with  protect, noconstant(0.0)
declare eventClassCdPopulated = i2 with  protect, noconstant(0)
 
/* DECLARE SUBROUTINES ***************************************************************************/
declare AddCodeToList(P1=F8(VAL), P2=VC(REF)) = null with protect
declare AddPersonnelToList(P1=F8(VAL), P2=VC(REF)) = null with protect
declare AddPersonnelToListWithDate(P1=F8(VAL), P2=VC(REF),P3=F8(VAL)) = null with protect
declare AddPhonesToList(P1=F8(VAL), P2=VC(REF)) = null with protect
declare PutJSONRecordToFile(P1=VC(REF)) = null with protect
declare PutStringToFile(P1=VC(VAL)) = null with protect
declare PutUnboundedStringToFile(P1=VC(REF)) = null with protect
declare OutputCodeList(P1=VC(REF)) = null with protect
declare OutputPersonnelList(P1=VC(REF)) = null with protect
declare OutputPhoneList(P1=VC(REF), P2=VC(REF)) = null with protect
declare GetParameterValues(P1=I4(VAL), P2=VC(REF)) = null with protect
declare GetLookbackDateByType(P1=I4(VAL), P2=I4(VAL)) = dq8 with protect
declare GetCodeValuesFromCodeset(P1=VC(REF), P2=VC(REF)) = null with protect
declare GetEventSetNamesFromEventSetCds(P1=VC(REF), P2=VC(REF)) = null with protect
declare returnViewerType(P1=F8(VAL), P2=F8(VAL)) = vc with protect
declare cnvtIsoDtTmToDQ8(P1=VC) = DQ8 with protect
declare cnvtDQ8ToIsoDtTm(P1=F8) = VC with protect
declare GetOrgSecurityFlag(NULL) = i2 with protect
declare GetCompOrgSecurityFlag(P1=VC(VAL)) = i2 with protect
declare PopulateAuthorizedOrganizations(P1=F8(VAL), P2=VC(REF)) = null with protect
declare GetUserLogicalDomain (P1=f8) = f8 with protect
declare GetPersonnelOverride (ppr_cd=F8(VAL)) = i2 with protect
declare cclImpersonation(null) = null with protect
declare GetEventSetDisplaysFromEventSetCds(P1=VC(REF), P2=VC(REF)) = null with protect
declare DecodeStringParameter(description=VC(VAL)) = VC with protect
declare URLEncode(json=VC(VAL)) = VC with protect
declare IsTaskGranted(task_number=i4(VAL)) = i2 with protect
 
/* RECORD STRUCTURES *****************************************************************************/
/* The record structure to pass in phone types should look like the following (in order of preference)
free record phone_types
record phone_types(
	1 phone_codes[*]
		2 phone_cd = f8
)
*/
 
/*
AddCodeToList(DOUBLE, VC) adds a code value to the code_list record.
*/
subroutine AddCodeToList(code_value, record_data)
	if (code_value != 0)
		if (codeListCnt = 0 or locateval(code_idx, 1, codeListCnt, code_value, record_data->codes[code_idx].code) <= 0)
			set codeListCnt = codeListCnt + 1
			set stat = alterlist(record_data->codes, codeListCnt)
			set record_data->codes[codeListCnt].code = code_value
			set record_data->codes[codeListCnt].sequence = uar_get_collation_seq(code_value)
			set record_data->codes[codeListCnt].meaning = uar_get_code_meaning(code_value)
			set record_data->codes[codeListCnt].display = uar_get_code_display(code_value)
			set record_data->codes[codeListCnt].description = uar_get_code_description(code_value)
			set record_data->codes[codeListCnt].code_set = uar_get_code_set(code_value)
		endif
	endif
end
 
/*
OutputCodeListXML(VC) given a record structure will populate the code list based on the code values added
to the code list.
*/
subroutine OutputCodeList(record_data)
	call log_message("In OutputCodeList() @deprecated", LOG_LEVEL_DEBUG)
end
 
/*
AddPersonnelToList(DOUBLE, VC) add a personnel id to the prsnl_list record structure.
*/
subroutine AddPersonnelToList(prsnl_id, record_data)
	call AddPersonnelToListWithDate(prsnl_id, record_data, CURRENT_DATE_TIME)
end
 
/*
AddPersonnelToListByDate(DOUBLE, VC, DQ8) add a personnel id to the prsnl_list record structure
by their active name at the specific date and time denoted by active_date.
*/
subroutine AddPersonnelToListWithDate(prsnl_id, record_data, active_date)
	declare PERSONNEL_CD = f8 with protect, constant(uar_get_code_by("MEANING", 213, "PRSNL"))
 
 	if(active_date = null or active_date = 0.0)
 		set active_date = CURRENT_DATE_TIME
 	endif
 
 	if (prsnl_id != 0)
		if (prsnlListCnt = 0 or
			locateval(prsnl_idx, 1, prsnlListCnt, prsnl_id, record_data->prsnl[prsnl_idx].id,
					  active_date, record_data->prsnl[prsnl_idx].active_date) <= 0)
			set prsnlListCnt = prsnlListCnt + 1
			if (prsnlListCnt > size(record_data->prsnl, 5))
				set stat = alterlist(record_data->prsnl, prsnlListCnt + 9)
			endif
			set record_data->prsnl[prsnlListCnt].id = prsnl_id
			if(validate(record_data->prsnl[prsnlListCnt].active_date) != 0)
				set record_data->prsnl[prsnlListCnt].active_date = active_date
			endif
		endif
	endif
end
 
/*
OutputPersonnelList(VC) based on the record structure will output the personnel list stored on the prsnl table.
*/
subroutine OutputPersonnelList(report_data)
	call log_message("In OutputPersonnelList()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(cnvtdatetime(curdate, curtime3)), private
 	declare PRSNL_NAME_TYPE_CD	= f8 with constant(uar_get_code_by("MEANING", 213, "PRSNL")), protect
	declare active_date_ind = i2 with protect, noconstant(0)
	declare filteredCnt = i4 with protect, noconstant(0)
	declare prsnl_seq = i4 with protect, noconstant(0)
	declare idx = i4 with protect, noconstant(0)
 
	if (prsnlListCnt > 0)
		select into "nl:"
		from prsnl p
			, (left join person_name pn on (pn.person_id = p.person_id and pn.name_type_cd = PRSNL_NAME_TYPE_CD and pn.active_ind = 1))
		plan p
			where expand(idx, 1, size(report_data->prsnl, 5), p.person_id, report_data->prsnl[idx]->id)
		join pn
		order by p.person_id, pn.end_effective_dt_tm desc
		head report
			prsnl_seq = 0
			active_date_ind = validate(report_data->prsnl[1]->active_date, 0)
		head p.person_id
			;This code is here for passivity and just retrieves the latest name
			if(active_date_ind = 0)
				prsnl_seq = locateval(idx, 1, prsnlListCnt, p.person_id, report_data->prsnl[idx].id)
				if (pn.person_id > 0)
					report_data->prsnl[prsnl_seq].provider_name.name_full = trim(pn.name_full, 3)
					report_data->prsnl[prsnl_seq].provider_name.name_first = trim(pn.name_first, 3)
					report_data->prsnl[prsnl_seq].provider_name.name_middle = trim(pn.name_middle, 3)
					report_data->prsnl[prsnl_seq].provider_name.name_last = trim(pn.name_last, 3)
					report_data->prsnl[prsnl_seq].provider_name.username = trim(p.username, 3)
					report_data->prsnl[prsnl_seq].provider_name.initials = trim(pn.name_initials, 3)
					report_data->prsnl[prsnl_seq].provider_name.title = trim(pn.name_initials, 3)
				else
					report_data->prsnl[prsnl_seq].provider_name.name_full = trim(p.name_full_formatted, 3)
					report_data->prsnl[prsnl_seq].provider_name.name_first = trim(p.name_first, 3)
					report_data->prsnl[prsnl_seq].provider_name.name_last = trim(p.name_last, 3)
					report_data->prsnl[prsnl_seq].provider_name.username = trim(p.username, 3)
				endif
			endif
		detail
			;This is the new logic for retrieving personnel names based on a specific date and time
			if(active_date_ind != 0)
				prsnl_seq = locateval(idx, 1, prsnlListCnt, p.person_id, report_data->prsnl[idx].id)
	 			while(prsnl_seq > 0)
	 				if(report_data->prsnl[prsnl_seq]->active_date between pn.beg_effective_dt_tm and pn.end_effective_dt_tm)
						if (pn.person_id > 0)
							report_data->prsnl[prsnl_seq].person_name_id = pn.person_name_id
							report_data->prsnl[prsnl_seq].beg_effective_dt_tm = pn.beg_effective_dt_tm
							report_data->prsnl[prsnl_seq].end_effective_dt_tm = pn.end_effective_dt_tm
							report_data->prsnl[prsnl_seq].provider_name.name_full = trim(pn.name_full, 3)
							report_data->prsnl[prsnl_seq].provider_name.name_first = trim(pn.name_first, 3)
							report_data->prsnl[prsnl_seq].provider_name.name_middle = trim(pn.name_middle, 3)
							report_data->prsnl[prsnl_seq].provider_name.name_last = trim(pn.name_last, 3)
							report_data->prsnl[prsnl_seq].provider_name.username = trim(p.username, 3)
							report_data->prsnl[prsnl_seq].provider_name.initials = trim(pn.name_initials, 3)
							report_data->prsnl[prsnl_seq].provider_name.title = trim(pn.name_initials, 3)
						else
							report_data->prsnl[prsnl_seq].provider_name.name_full = trim(p.name_full_formatted, 3)
							report_data->prsnl[prsnl_seq].provider_name.name_first = trim(p.name_first, 3)
							report_data->prsnl[prsnl_seq].provider_name.name_last = trim(pn.name_last, 3)
							report_data->prsnl[prsnl_seq].provider_name.username = trim(p.username, 3)
						endif
						if(report_data->prsnl[prsnl_seq].active_date = CURRENT_DATE_TIME)
							report_data->prsnl[prsnl_seq].active_date = 0
						endif
					endif
					prsnl_seq = locateval(idx, prsnl_seq + 1, prsnlListCnt, p.person_id, report_data->prsnl[idx].id)
				endwhile
			endif
		foot report
			stat = alterlist(report_data->prsnl, prsnlListCnt)
		with nocounter
 
		call ERROR_AND_ZERO_CHECK_REC(curqual, "PRSNL", "OutputPersonnelList", 1, 0, report_data)
 
		;filter out duplicate names
	 	if(active_date_ind != 0)
	 		select into "nl:"
	 			end_effective_dt_tm = report_data->prsnl[d.seq].end_effective_dt_tm
	 			, person_name_id = report_data->prsnl[d.seq].person_name_id
	 			, prsnl_id = report_data->prsnl[d.seq].id
	 		from (dummyt d with seq = size(report_data->prsnl, 5))
	 		order by end_effective_dt_tm desc, person_name_id, prsnl_id
	 		head report
	 			filteredCnt = 0
	 			idx = size(report_data->prsnl, 5)
	 			stat = alterlist(report_data->prsnl, idx * 2)
 
	 		head end_effective_dt_tm
	 			donothing = 0
 
	 		head prsnl_id
				idx = idx + 1
				filteredCnt = filteredCnt + 1
 			 	report_data->prsnl[idx]->id = report_data->prsnl[d.seq]->id
				report_data->prsnl[idx]->person_name_id = report_data->prsnl[d.seq]->person_name_id
				if(report_data->prsnl[d.seq]->person_name_id > 0.0)
					report_data->prsnl[idx]->beg_effective_dt_tm = report_data->prsnl[d.seq]->beg_effective_dt_tm
					report_data->prsnl[idx]->end_effective_dt_tm = report_data->prsnl[d.seq]->end_effective_dt_tm
				else
					report_data->prsnl[idx]->beg_effective_dt_tm = cnvtdatetime("01-JAN-1900")
					report_data->prsnl[idx]->end_effective_dt_tm = cnvtdatetime("31-DEC-2100")
				endif
				report_data->prsnl[idx]->provider_name->name_full = report_data->prsnl[d.seq]->provider_name->name_full
				report_data->prsnl[idx]->provider_name->name_first = report_data->prsnl[d.seq]->provider_name->name_first
				report_data->prsnl[idx]->provider_name->name_middle = report_data->prsnl[d.seq]->provider_name->name_middle
				report_data->prsnl[idx]->provider_name->name_last = report_data->prsnl[d.seq]->provider_name->name_last
				report_data->prsnl[idx]->provider_name->username = report_data->prsnl[d.seq]->provider_name->username
				report_data->prsnl[idx]->provider_name->initials = report_data->prsnl[d.seq]->provider_name->initials
				report_data->prsnl[idx]->provider_name->title = report_data->prsnl[d.seq]->provider_name->title
 
	 		foot report
	 			;resize by newListCnt to filter down the unused elements
	 			stat = alterlist(report_data->prsnl, idx)
	 			;resize the list to just show the results that were not filtered
	 			stat = alterlist(report_data->prsnl, filteredCnt, 0)
	 		with nocounter
 
	 		call ERROR_AND_ZERO_CHECK_REC(curqual, "PRSNL", "FilterPersonnelList", 1, 0, report_data)
	 	endif
	endif
 
	call log_message(build("Exit OutputPersonnelList(), Elapsed time in seconds:",
	datetimediff(cnvtdatetime(curdate,curtime3),BEGIN_DATE_TIME, 5)), LOG_LEVEL_DEBUG)
end
 
/*
AddPhonesToList(DOUBLE, VC) add a personnel id to the phone_list record structure
*/
subroutine AddPhonesToList(prsnl_id, record_data)
 
 	if (prsnl_id != 0)
		if (phoneListCnt = 0 or
			locateval(phone_idx, 1, phoneListCnt, prsnl_id, record_data->phone_list[prsnl_idx].person_id) <= 0)
			set phoneListCnt = phoneListCnt + 1
			if (phoneListCnt > size(record_data->phone_list, 5))
				set stat = alterlist(record_data->phone_list, phoneListCnt + 9)
			endif
			set record_data->phone_list[phoneListCnt].person_id = prsnl_id
			set prsnl_cnt = prsnl_cnt + 1
		endif
	endif
 
end
 
 
/*
OutputPhoneList(VC) based on the record structure will output the phone list stored on the phone table.
*/
subroutine OutputPhoneList(report_data, phone_types)
	call log_message("In OutputPhoneList()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(cnvtdatetime(curdate, curtime3)), private
	declare PERSONCNT = i4 with protect, constant(size(report_data->phone_list, 5))
	declare idx = i4 with protect, noconstant(0)
	declare idx2 = i4 with protect, noconstant(0)
	declare idx3 = i4 with protect, noconstant(0)
	declare phoneCnt = i4 with protect, noconstant(0)
	declare prsnlIdx = i4 with protect, noconstant(0)
 
 	;;report_data->phone_list size is greater than 0.  prsnlListCnt is set in AddPhonesToList() in mp_common.inc
	if (phoneListCnt > 0)
		select
			if(size(phone_types->phone_codes, 5) = 0)
				phone_sorter = ph.phone_id
				from phone ph
				where expand(idx, 1, PERSONCNT, ph.parent_entity_id, report_data->phone_list[idx]->person_id)
					and ph.parent_entity_name = "PERSON"
					and ph.beg_effective_dt_tm <= cnvtdatetime(curdate, curtime3)
					and ph.end_effective_dt_tm >= cnvtdatetime(curdate, curtime3)
					and ph.active_ind = 1
					and ph.phone_type_seq = 1
				order by ph.parent_entity_id, phone_sorter
			else
				phone_sorter = locateval(idx2, 1, size(phone_types->phone_codes, 5), ph.phone_type_cd,
					phone_types->phone_codes[idx2]->phone_cd)
				from phone ph
				where expand(idx, 1, PERSONCNT, ph.parent_entity_id, report_data->phone_list[idx]->person_id)
					and ph.parent_entity_name = "PERSON"
					and ph.beg_effective_dt_tm <= cnvtdatetime(curdate, curtime3)
					and ph.end_effective_dt_tm >= cnvtdatetime(curdate, curtime3)
					and ph.active_ind = 1
					and expand(idx2, 1, size(phone_types->phone_codes, 5), ph.phone_type_cd,
						phone_types->phone_codes[idx2]->phone_cd)
					and ph.phone_type_seq = 1
				order by ph.parent_entity_id, phone_sorter
			endif
		into "nl:"
 
		head ph.parent_entity_id
			phoneCnt = 0
			prsnlIdx = locateval(idx3, 1, PERSONCNT, ph.parent_entity_id, report_data->phone_list[idx3]->person_id)
		head phone_sorter
			phoneCnt = phoneCnt + 1
			if(size(report_data->phone_list[prsnlIdx]->phones,5) < phoneCnt)
				stat = alterlist(report_data->phone_list[prsnlIdx]->phones, phoneCnt + 5)
			endif
			report_data->phone_list[prsnlIdx]->phones[phoneCnt].phone_id = ph.phone_id
			report_data->phone_list[prsnlIdx]->phones[phoneCnt].phone_type_cd = ph.phone_type_cd
			report_data->phone_list[prsnlIdx]->phones[phoneCnt].phone_type = uar_get_code_display(ph.phone_type_cd)
			report_data->phone_list[prsnlIdx]->phones[phoneCnt].phone_num =
						FormatPhoneNumber(ph.phone_num, ph.phone_format_cd, ph.extension)
		foot ph.parent_entity_id
			stat = alterlist(report_data->phone_list[prsnlIdx]->phones, phoneCnt)
		with nocounter, expand = value(evaluate(floor((PERSONCNT - 1)/30), 0, 0, 1))  ;If more than 30 persons use global temp table.
 
 		set stat = alterlist(report_data->phone_list, prsnl_cnt)
 
		call ERROR_AND_ZERO_CHECK_REC(curqual, "PHONE", "OutputPhoneList", 1, 0, report_data)
	endif
 
	call log_message(build("Exit OutputPhoneList(), Elapsed time in seconds:",
	datetimediff(cnvtdatetime(curdate,curtime3),BEGIN_DATE_TIME, 5)), LOG_LEVEL_DEBUG)
end
 
subroutine PutStringToFile(sValue)
	call log_message("In PutStringToFile()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(cnvtdatetime(curdate, curtime3)), private
 
	if(validate(_Memory_Reply_String)=1)
		set _Memory_Reply_String = sValue
	else
		; REQUEST record to display the file
		free record putREQUEST
		record putREQUEST (
			1 source_dir = vc
			1 source_filename = vc
			1 nbrlines = i4
			1 line [*]
				2 lineData = vc
			1 OverFlowPage [*]
				2 ofr_qual [*]
					3 ofr_line = vc
			1 IsBlob = c1
			1 document_size = i4
			1 document = gvc
		)
 
		; Set parameters for displaying the file
		set putRequest->source_dir = $outdev
		set putRequest->IsBlob = "1"
		set putRequest->document = sValue
		set putRequest->document_size = size(putRequest->document)
 
		;  Display the file.  This allows XmlCclRequest to receive the output
		execute eks_put_source with replace("REQUEST",putRequest),replace("REPLY",putReply)
	endif
 
	call log_message(build("Exit PutStringToFile(), Elapsed time in seconds:",
	datetimediff(cnvtdatetime(curdate,curtime3),BEGIN_DATE_TIME, 5)), LOG_LEVEL_DEBUG)
end
 
/*
 * PutUnboundedStringToFile is a wrapper around the PutStringToFile that will increase the maximum varchar length
 * when the string to be set to _memory_reply_string is too large. PutStringToFileSafe maintains the original
 * maximum length as defined at the start of the subroutine and will restore that length when the maxvarlen reserved
 * variable has been modified. This is used to prevent truncation of output.
 *
 * @param tRec - A record structure of the form:
 *     record tRec(
 *       1 val = gvc
 *     )
 */
subroutine PutUnboundedStringToFile(tRec)
	call log_message("In PutUnboundedStringToFile()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(cnvtdatetime(curdate, curtime3)), private
 
	declare curStringLength = i4 with noconstant(textlen(tRec->val))
	declare newMaxVarLen = i4 with noconstant(0)
	declare origCurMaxVarLen = i4 with noconstant(0)
 
	; Is the string value larger than the maximum varchar length?
	if (curStringLength > curmaxvarlen)
		set origCurMaxVarLen = curmaxvarlen
		set newMaxVarLen = curStringLength + 10000  ; additional just-in-case buffer
 
		;; Modify the maxvarlen reserved variable
		set modify maxvarlen newMaxVarLen
	endif
 
	call PutStringToFile(tRec->val)
 
	; If maxvarlen was changed, reset it back to its original value
	if (newMaxVarLen > 0)
		set modify maxvarlen origCurMaxVarLen
	endif
 
	call log_message(
		build(
			"Exit PutUnboundedStringToFile(), Elapsed time in seconds:",
			datetimediff(cnvtdatetime(curdate, curtime3), BEGIN_DATE_TIME, 5)
		), LOG_LEVEL_DEBUG
	 )
end
 
 
/*
PutJSONRecordToFile(VC) puts the current record to the output
*/
subroutine PutJSONRecordToFile(record_data)
	call log_message("In PutJSONRecordToFile()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(cnvtdatetime(curdate, curtime3)), private
 
	; Temporary record to circumvent maxvarlen limitations using a gvc variable within the record
	record _tempJson(
		1 val = gvc
	)
 
	; Place the converted JSON into the unbounded record member
	set _tempJson->val = cnvtrectojson(record_data)
 
	call PutUnboundedStringToFile(_tempJson)
 
	call log_message(build("Exit PutJSONRecordToFile(), Elapsed time in seconds:",
	datetimediff(cnvtdatetime(curdate,curtime3),BEGIN_DATE_TIME, 5)), LOG_LEVEL_DEBUG)
end
 
/*
GetParameterValues(index, value_rec) get the parameter values passed into the prompt at a given index.  An assumption is
made that the values are all 'I4's and 'F8's.  The value_rec is also required to look like:
 
 
free record temp_rec
record temp_rec
(
	1 cnt = i4
	1 qual[*]
		2 value = f8
)
 
For example of usage of this method, if the following is executed:
mp_get_allergies "mine", <person_id>, <encntr_id> go
mp_get_allergies "mine", 1548144, value(1550459, 1550468) go
 
The 1st index is the parameter "mine".  The 2nd index is the parameter '1548144' which is the person_id, and the 3rd index is
the parameter array 'value(1550459, 1550468)'.  To extract all the _cds or _ids from an index you would call the method as
follows for the current example
 
call GetParameterValues(3, temp_rec)
 
The outcome of the retrieval of the parameter values is
>>>Begin EchoRecord VALUE_REC   ;ENCNTR_REC
 1 CNT= I4   {2}
 1 QUAL[1,2*]
  2 VALUE=F8   {1550459.0000000000                      }
 1 QUAL[2,2*]
  2 VALUE=F8   {1550468.0000000000                      }
 
*/
subroutine GetParameterValues(index, value_rec)
	declare par = vc with noconstant(""), protect
	declare lnum = i4 with noconstant(0), protect
	declare num = i4 with noconstant(1), protect
	declare cnt = i4 with noconstant(0), protect
	declare cnt2 = i4 with noconstant(0), protect
	declare param_value = f8 with noconstant(0.0), protect
	declare param_value_str = vc with noconstant(""), protect
 
	SET par = reflect(parameter(index,0))
	if (validate(debug_ind, 0) = 1)
		call echo(par)
	endif
	if (par = "F8" or par = "I4")
		set param_value = parameter(index,0)
		if (param_value > 0)
			set value_rec->cnt = value_rec->cnt + 1
			set stat = alterlist(value_rec->qual, value_rec->cnt)
			set value_rec->qual[value_rec->cnt].value = param_value
		endif
	elseif (substring(1,1,par) = "C")
		set param_value_str = parameter(index,0)
		if (trim(param_value_str, 3) != "")
			set value_rec->cnt = value_rec->cnt + 1
			set stat = alterlist(value_rec->qual, value_rec->cnt)
			set value_rec->qual[value_rec->cnt].value = trim(param_value_str, 3)
		endif
	elseif (substring(1,1,par) = "L") ;this is list type
		set lnum = 1
		while (lnum>0)
			set par = reflect(parameter(index,lnum))
			if (par != " ")
				if (par = "F8" or par = "I4")
					;valid item in list for parameter
					set param_value = parameter(index,lnum)
					if (param_value > 0)
						set value_rec->cnt = value_rec->cnt + 1
						set stat = alterlist(value_rec->qual, value_rec->cnt)
						set value_rec->qual[value_rec->cnt].value = param_value
					endif
					set lnum = lnum+1
				elseif (substring(1,1,par) = "C")
					;valid item in list for parameter
					set param_value_str = parameter(index,lnum)
					if (trim(param_value_str, 3) != "")
						set value_rec->cnt = value_rec->cnt + 1
						set stat = alterlist(value_rec->qual, value_rec->cnt)
						set value_rec->qual[value_rec->cnt].value = trim(param_value_str, 3)
					endif
					set lnum = lnum+1
				endif
			else
				set lnum = 0
			endif
		endwhile
	endif
	if (validate(debug_ind, 0) = 1)
		call echorecord(value_rec)
	endif
end
 
subroutine GetLookbackDateByType(units,flag)
	declare looback_date = dq8 with noconstant(cnvtdatetime("01-JAN-1800 00:00:00"))
	if(units != 0)
		case (flag)
			of 1: set looback_date = cnvtlookbehind(build(units,",H"),cnvtdatetime(curdate,curtime3))
			of 2: set looback_date = cnvtlookbehind(build(units,",D"),cnvtdatetime(curdate,curtime3))
			of 3: set looback_date = cnvtlookbehind(build(units,",W"),cnvtdatetime(curdate,curtime3))
			of 4: set looback_date = cnvtlookbehind(build(units,",M"),cnvtdatetime(curdate,curtime3))
			of 5: set looback_date = cnvtlookbehind(build(units,",Y"),cnvtdatetime(curdate,curtime3))
		endcase
	endif
	return (looback_date)
end
 
subroutine GetCodeValuesFromCodeset(evt_set_rec, evt_cd_rec)
	declare csIdx = i4 with noconstant(0)
 
	select distinct into "nl:"
	from v500_event_set_explode vese
		where expand(csIdx, 1, evt_set_rec->cnt, vese.event_set_cd, evt_set_rec->qual[csIdx].value)
	detail
		evt_cd_rec->cnt = evt_cd_rec->cnt + 1
		stat = alterlist(evt_cd_rec->qual, evt_cd_rec->cnt)
 
		evt_cd_rec->qual[evt_cd_rec->cnt].value = vese.event_cd
	with nocounter
end
 
/*
	GetEventSetNamesFromEventSetCds
	params:
		evt_set_rec : Record containing event set cds
		evt_set_name_rec : Destination Record for event set names
				Record Structure for both:
					free record temp_rec
					record temp_rec
					(
						1 cnt = i4
						1 qual[*]
							2 value = f8
					)
 
    Returns:
		null
 
*/
 
subroutine GetEventSetNamesFromEventSetCds(evt_set_rec, evt_set_name_rec)
  declare index = i4 with protect,noconstant(0)
  declare pos =i4 with protect, noconstant(0)
 
  select into "nl:"
  from v500_event_set_code v
  where expand(index,1,evt_set_rec->cnt,v.event_set_cd,evt_set_rec->qual[index].value)
 
  head report
    cnt = 0
    evt_set_name_rec->cnt = evt_set_rec->cnt
    stat = alterlist(evt_set_name_rec->qual,evt_set_rec->cnt)
  detail
   	pos = locateval(index,1,evt_set_rec->cnt,v.event_set_cd,evt_set_rec->qual[index].value)
 	while(pos > 0)
		cnt = cnt +1
		evt_set_name_rec->qual[pos].value = v.event_set_name
    	pos = locateval(index,pos+1,evt_set_rec->cnt,v.event_set_cd,evt_set_rec->qual[index].value)
    endwhile
  foot report
  	;Now remove blank values
  	pos = locateval(index,1,evt_set_name_rec->cnt,"",evt_set_name_rec->qual[index].value)
	while(pos > 0)
	    evt_set_name_rec->cnt = evt_set_name_rec->cnt-1
		stat = alterlist(evt_set_name_rec->qual,evt_set_name_rec->cnt,pos-1)
    	pos = locateval(index,pos,evt_set_name_rec->cnt,"",evt_set_name_rec->qual[index].value)
    endwhile
    evt_set_name_rec->cnt = cnt
    stat = alterlist(evt_set_name_rec->qual,evt_set_name_rec->cnt)
  with nocounter, expand = value(evaluate(floor((evt_set_rec->cnt-1)/30),0,0,1))
 
end
 
/*
	returnViewerType
	params:
		eventClassCd = the event_class_cd of the document to be viewed
		EventId = the event_id of the document to be viewed
	returns:
		String representing viewer
*/
subroutine returnViewerType(eventClassCd, eventId)
	call log_message("In returnViewerType()", LOG_LEVEL_DEBUG)
	declare BEGIN_DATE_TIME = dq8 with constant(cnvtdatetime(curdate, curtime3)), private
	if(eventClassCdPopulated = 0)
	  	 set MPC_AP_TYPE_CD = uar_get_code_by("MEANING", 53, "AP")
		 set MPC_DOC_TYPE_CD = uar_get_code_by("MEANING", 53, "DOC")
		 set MPC_MDOC_TYPE_CD = uar_get_code_by("MEANING", 53, "MDOC")
		 set MPC_RAD_TYPE_CD = uar_get_code_by("MEANING", 53, "RAD")
		 set MPC_TXT_TYPE_CD = uar_get_code_by("MEANING", 53, "TXT")
		 set MPC_NUM_TYPE_CD = uar_get_code_by("MEANING", 53, "NUM")
		 set MPC_IMMUN_TYPE_CD = uar_get_code_by("MEANING", 53, "IMMUN")
		 set MPC_MED_TYPE_CD = uar_get_code_by("MEANING", 53, "MED")
		 set MPC_DATE_TYPE_CD = uar_get_code_by("MEANING", 53, "DATE")
		 set MPC_DONE_TYPE_CD = uar_get_code_by("MEANING", 53, "DONE")
		 set MPC_MBO_TYPE_CD = uar_get_code_by("MEANING", 53, "MBO")
		 set MPC_PROCEDURE_TYPE_CD = uar_get_code_by("MEANING", 53, "PROCEDURE")
		 set MPC_GRP_TYPE_CD = uar_get_code_by("MEANING", 53, "GRP")
		 set MPC_HLATYPING_TYPE_CD = uar_get_code_by("MEANING", 53, "HLATYPING")
		 set eventClassCdPopulated = 1
	endif
	declare sViewerFlag = vc with protect, noconstant("")
 
	case(eventClassCd)
		of MPC_AP_TYPE_CD:
			set sViewerFlag = "AP"
		of MPC_DOC_TYPE_CD:
		of MPC_MDOC_TYPE_CD:
		of MPC_RAD_TYPE_CD:
			set sViewerFlag = "DOC"
		of MPC_TXT_TYPE_CD:
		of MPC_NUM_TYPE_CD:
		of MPC_IMMUN_TYPE_CD:
		of MPC_MED_TYPE_CD:
		of MPC_DATE_TYPE_CD:
		of MPC_DONE_TYPE_CD:
			set sViewerFlag = "EVENT"
		of MPC_MBO_TYPE_CD:
			set sViewerFlag = "MICRO"
		of MPC_PROCEDURE_TYPE_CD:
			set sViewerFlag = "PROC"
		of MPC_GRP_TYPE_CD:
			set sViewerFlag = "GRP"
		of MPC_HLATYPING_TYPE_CD:
			set sViewerFlag = "HLA"
		else
			set sViewerFlag = "STANDARD"
	endcase
 
	if(eventClassCd = MPC_MDOC_TYPE_CD)
		select into "nl:"
			c2.*
		from clinical_event c1
			,clinical_event c2
		plan c1 where c1.event_id = eventId
		join c2 where c1.parent_event_id = c2.event_id
			and c2.valid_until_dt_tm = cnvtdatetime("31-DEC-2100")
 
		head c2.event_id
			if(c2.event_class_cd = MPC_AP_TYPE_CD)
				sViewerFlag = "AP"
			endif
		with nocounter
	endif
 
	call log_message(build("Exit returnViewerType(), Elapsed time in seconds:",
	datetimediff(cnvtdatetime(curdate,curtime3),BEGIN_DATE_TIME, 5)), LOG_LEVEL_DEBUG)
 
	return(sViewerFlag)
end
 
/**
 * cnvtIsoDtTmToDQ8()
 * Purpose:
 *   Converts an ISO 8601 formatted date into a DQ8
 *
 * @return {dq8, which is the same as a f8}
 *
 * @param {vc} isoDtTmStr ISO 8601 formatted string (ie, 2013-10-24T15:08:77Z)
*/
subroutine cnvtIsoDtTmToDQ8(isoDtTmStr)
	declare convertedDq8 = dq8 with protect, noconstant(0)
 
	set convertedDq8 =
		cnvtdatetimeutc2(substring(1,10,isoDtTmStr),"YYYY-MM-DD",substring(12,8,isoDtTmStr),"HH:MM:SS", 4, CURTIMEZONEDEF)
 
	return(convertedDq8)
 
end  ;subroutine cnvtIsoDtTmToDQ8
 
 
/**
 * cnvtDQ8ToIsoDtTm()
 * Purpose:
 *   Converts a DQ8 into an ISO 8601 formatted date string
 *
 * @return {vc}
 *
 * @param {f8, which is the same as a dq8} dq8DtTm DateTime Value
*/
subroutine cnvtDQ8ToIsoDtTm(dq8DtTm)
	declare convertedIsoDtTm = vc with protect, noconstant("")
 
	if(dq8DtTm > 0.0)
		set convertedIsoDtTm = build(replace(datetimezoneformat(cnvtdatetime(dq8DtTm) ,
			DATETIMEZONEBYNAME("UTC"),"yyyy-MM-dd HH:mm:ss",curtimezonedef)," ","T",1),"Z")
	else
		set convertedIsoDtTm = nullterm(convertedIsoDtTm)
	endif
 
	return(convertedIsoDtTm)
 
end  ;subroutine cnvtDQ8ToIsoDtTm
 
/**
 *GetOrgSecurityFlag
 *Purpose:
 *	detecting if organization security is enabled
 *  @return {i2} authorizedOrganizations record
*/
subroutine GetOrgSecurityFlag(null)
	declare org_security_flag = i2 with noconstant(0), protect
	select into "nl:"
	from dm_info di
	where di.info_domain = "SECURITY"
	  and di.info_name = "SEC_ORG_RELTN"
	head report
		org_security_flag = 0
	detail
	  	org_security_flag = cnvtint(di.info_number)
	with nocounter
	return (org_security_flag)
end
 
/**
 *GetCompOrgSecurityFlag
 *Purpose:
 *	detecting if organization security is enabled
 *  @return {i2} authorizedOrganizations record
*/
subroutine GetCompOrgSecurityFlag(dminfo_name)
	declare org_security_flag = i2 with noconstant(0), protect
	select into "nl:"
	from dm_info di
	where di.info_domain = "SECURITY"
	  and di.info_name = dminfo_name
	head report
		org_security_flag = 0
	detail
	  	org_security_flag = cnvtint(di.info_number)
	with nocounter
	return (org_security_flag)
end
 
/**
 *PopulateAuthorizedOrganizations
 *Purpose:
 *	get authorized organization Ids for a personnel
 *
 *
 *  @param {f8} personnel_id value
 *	@param {vc} authorizedOrganizations record
*/
;free record authorizedOrganizations
;record authorizedOrganizations
;(
;	1 cnt					= i4
;	1 organizations[*]
;		2 organizationId	= f8
;)
subroutine PopulateAuthorizedOrganizations(personId, value_rec)
	declare organization_cnt = i4 with noconstant(0), protect
	select into "nl:"
      from prsnl_org_reltn por
      where por.person_id = personId
      	and por.active_ind = 1
      	and (por.beg_effective_dt_tm between cnvtdatetime(lower_bound_date) and cnvtdatetime(curdate,curtime3))
    	and (por.end_effective_dt_tm between cnvtdatetime(curdate,curtime3) and cnvtdatetime(upper_bound_date))
      order by por.organization_id
    head report
    	organization_cnt = 0
    detail
      organization_cnt = organization_cnt + 1
      if (mod(organization_cnt, 20) = 1)
        stat = alterlist(value_rec->organizations, organization_cnt + 19)
      endif
 
      value_rec->organizations[organization_cnt].organizationId = por.organization_id
    foot report
	  value_rec->cnt = organization_cnt
      stat = alterlist(value_rec->organizations, organization_cnt)
    with nocounter
    if (validate(debug_ind, 0) = 1)
		call echorecord(value_rec)
	endif
end
 
/**
 *GetUserLogicalDomain
 *Purpose:
 *	this subroutine obtains the user's logical domain if needed
 *
 *  @return {f8}
 *  @param {f8} person_id value
*/
subroutine GetUserLogicalDomain(id)
 
	declare returnId = f8 with protect, noconstant(0.0)
 
	select into "nl:"
	from prsnl p
	where p.person_id = id
 
	detail
		returnId = p.logical_domain_id
 
	with nocounter
 
	return (returnId)
 
end ;GetUserLogicalDomain
 
/**
 *GetPersonnelOverride
 *Purpose:
 *	this subroutine returns the personnel override indicator value
 *
 *  @return {i2}
 *  @param {f8} ppr_cd value
 */
subroutine GetPersonnelOverride(ppr_cd)
	declare override_ind = i2 with protect, noconstant(0)
 
	if(ppr_cd <= 0.0)
		return(0)
	endif
 
 	select into "nl:"
  	from code_value_extension cve
  		where cve.code_value = ppr_cd
    	and cve.code_set = 331
      	and (cve.field_value = "1" or cve.field_value = "2")
      	and cve.field_name = "Override"
  	detail
    	override_ind = 1
 	with nocounter
 
	return (override_ind)
end
 
 
/**
 *cclImpersonation
 *Purpose:
 *	In somecases in-house the user context (reqinfo->updt_id) is lost in server jumps.
 *
 *  @return {null}
 */
subroutine cclImpersonation(null)
	call log_message("In cclImpersonation()", LOG_LEVEL_DEBUG)
    declare BEGIN_DATE_TIME = dq8 with constant(cnvtdatetime(curdate, curtime3)), private
 
	execute secrtl
	declare uar_SecSetContext ( hCtx = i4) = i2
	with image_axp="secrtl",image_aix="libsec.a(libsec.o)",uar="SecSetContext",   persist
 
	declare secCntxt = i4 with public
	declare namelen = i4  with public
	declare domainNameLen = i4 with public
 
	set nameLen = uar_SecGetClientUserNameLen()+1
	set domainNameLen = uar_SecGetClientDomainNameLen()+2
	set stat = memalloc(name,1,build("C",nameLen))
	set stat = memalloc(domainname,1,build("C",domainNameLen))
	set stat = uar_secGetClientUserName(name,nameLen)
	set stat = uar_secGetClientDomainName(domainName,domainNameLen)
	set setCntxt = uar_secImpersonate(nullterm(name),nullterm(domainName))
 
    call log_message(build("Exit cclImpersonation(), Elapsed time in seconds:",
        datetimediff(cnvtdatetime(curdate,curtime3),BEGIN_DATE_TIME, 5)), LOG_LEVEL_DEBUG)
end ;cclImpersonation
 
/*
    GetEventSetDisplaysFromEventSetCds
    params:
        evt_set_rec : Record containing event set cds
        evt_set_name_rec : Destination Record for event set display name
                Record Structure for both:
                    free record temp_rec
                    record temp_rec
                    (
                        1 cnt = i4
                        1 qual[*]
                            2 value = f8
                    )
 
    Returns:
        null
 
*/
subroutine GetEventSetDisplaysFromEventSetCds(evt_set_rec, evt_set_disp_rec)
    declare index = i4 with protect,noconstant(0)
    declare pos = i4 with protect, noconstant(0)
 
    select into "nl:"
    from v500_event_set_code v
    where expand(index,1,evt_set_rec->cnt,v.event_set_cd,evt_set_rec->qual[index].value)
 
    head report
      cnt = 0
      evt_set_disp_rec->cnt = evt_set_rec->cnt
      stat = alterlist(evt_set_disp_rec->qual,evt_set_rec->cnt)
    detail
        pos = locateval(index,1,evt_set_rec->cnt,v.event_set_cd,evt_set_rec->qual[index].value)
        while(pos > 0)
            cnt = cnt +1
            evt_set_disp_rec->qual[pos].value = v.event_set_cd_disp
            pos = locateval(index,pos+1,evt_set_rec->cnt,v.event_set_cd,evt_set_rec->qual[index].value)
        endwhile
    foot report
    ;Now remove blank values
        pos = locateval(index,1,evt_set_disp_rec->cnt,"",evt_set_disp_rec->qual[index].value)
        while(pos > 0)
            evt_set_disp_rec->cnt = evt_set_disp_rec->cnt-1
            stat = alterlist(evt_set_disp_rec->qual,evt_set_disp_rec->cnt,pos-1)
            pos = locateval(index,pos,evt_set_disp_rec->cnt,"",evt_set_disp_rec->qual[index].value)
        endwhile
        evt_set_disp_rec->cnt = cnt
        stat = alterlist(evt_set_disp_rec->qual,evt_set_disp_rec->cnt)
    with nocounter, expand = value(evaluate(floor((evt_set_rec->cnt-1)/30),0,0,1))
end
/**
 *DecodeStringParameter
 *Purpose:
 *	this subroutine takes description and returns it with decoded values for semicolon and percentile
 *
 *  @return {VC} decodedDescription, decoded description will be returned
 *  @param {VC} description
 */
subroutine DecodeStringParameter(description)
    declare decodedDescription = vc with private
    set decodedDescription = REPLACE(description,"%3B",";",0)
    set decodedDescription = REPLACE(decodedDescription,"%25","%",0)
    return(decodedDescription)
end
/**
 * URLEncode
 * Purpose:
 *   this subroutine will take a portion of a URL with JSON and URL-encode it
 *                         string only URL-encoded, per:
 *                         https://www.w3schools.com/tags/ref_urlencode.asp
 * @param {VC} json - this is a string of JSON
 * @return {VC} encodedJson - this URL encoded version of the input string
 */
subroutine URLEncode(json)
    declare encodedJson = vc with private
	set encodedJson = replace(json, char(91), "%5B", 0) ; replace all '[' with %5B
	set encodedJson = replace(encodedJson, char(123), "%7B", 0) ; '{'
	set encodedJson = replace(encodedJson, char(58), "%3A", 0) ; ':'
	set encodedJson = replace(encodedJson, char(125), "%7D", 0) ; '}'
	set encodedJson = replace(encodedJson, char(93), "%5D", 0) ; ']'
	set encodedJson = replace(encodedJson, char(44), "%2C", 0) ; ','
	set encodedJson = replace(encodedJson, char(34), "%22", 0) ; "
	return(encodedJson)
end
 
/***********************************************************************************************************************************
* IsTaskGranted                                                                                                       *
***********************************************************************************************************************************/
/***********************************************************************
    *   The IsTaskGranted routine checks to see if the user's position_cd *
    *   has been granted access to the given task. The check is application *
    *   group agnostic, meaning, we do not check for a specific group having *
    *   the access.*
    *                                                                     *
    *   Parameter: task_number                                            *
    *   Return values: 1 = the user has access to the task             *
    *                  0 = the user does not have access to the task  *
 ***********************************************************************/
subroutine IsTaskGranted(task_number)
  call log_message("In IsTaskGranted", LOG_LEVEL_DEBUG)
  declare FNTime = f8 with private, noconstant(curtime3)
 
  declare task_granted = i2 with noconstant(0), protect
  ;Checks whether the logged in user position has acces to task or not.
 
  select into "nl:"
  from task_access ta, application_group ag
  plan ta
    where ta.task_number = task_number
      and ta.app_group_cd > 0.0
  join ag
    where ag.position_cd = reqinfo->position_cd
      and ag.app_group_cd = ta.app_group_cd
      and ag.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
      and ag.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
  detail
    task_granted = 1
  with nocounter, maxqual(ta, 1)
  ; it is enough that there is at least one entry. We don't want to repetitively set the task_granted flag.
  call log_message(build("Exit IsTaskGranted - ", build2(cnvtint(curtime3 - FNTime)), "0 ms"), LOG_LEVEL_DEBUG)
 
  return(task_granted)
end ; IsTaskGranted

