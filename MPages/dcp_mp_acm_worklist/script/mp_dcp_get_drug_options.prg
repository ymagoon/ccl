drop program mp_dcp_get_drug_options:dba go
create program mp_dcp_get_drug_options:dba

prompt
	"Output to File/Printer/MINE" = "MINE" ,
	"JSON_ARGS:" = ""
 
with OUTDEV, JSON_ARGS
 
%i cclsource:mp_dcp_blob_in_params.inc
set stat = cnvtjsontorec(ExtractParamsFromRequest(request, $JSON_ARGS))

/*
record med_request
(
	1 text = vc ;the text to match
	1 catalog_flag = i2 ;0 = drug, 1 = class
)
*/

call echorecord(med_request)

free record reply
record reply
(
	1 catalog = vc ;MED, MEDCLASS
	1 meds[*]
		2 drug_name = vc
	1 drug_class[*]
		2 name = vc
		2 id = f8
%i cclsource:status_block.inc
)

%i cclsource:mp_script_logging.inc
set modify maxvarlen 52428800 
call log_message("In mp_dcp_get_drug_options", LOG_LEVEL_DEBUG)

/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/
declare getMedName(search = vc) = NULL
declare getMedClass(search = vc) = NULL
declare replyFailure(NULL) = NULL
declare CnvtCCLRec(NULL) = NULL

/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
declare error_string = vc
declare fail_operation = vc
declare failed = i2 with NOCONSTANT(0)

set ERRMSG =  FILLSTRING(132," ")
set ERRCODE = error(ERRMSG,1)
set reply->status_data->status = "Z"

/**************************************************************
; DVDev Start Coding
**************************************************************/

if(med_request->catalog_flag = "0")
	call getMedName(med_request->text)
else
	call getMedClass(med_request->text)
endif
 
#exit_script
 
if (reply->status_data->status = "Z")
	if(size(reply->meds, 5) > 0 OR size(reply->drug_class, 5) > 0)
		set reply->status_data->status = "S"
	endif
endif

call echorecord(reply)
if(failed = 0)
	call CnvtCCLRec(null)
endif

/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
subroutine getMedName(search)
	call log_message("Begin getMedName()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
	;Transaction 680220 is the Orders_GetSearchSuggestions transaction
	;http://repo.release.cerner.corp/nexus/content/sites/main-site/
		;com.cerner.msvc.orders.search.suggest/server-orders-search-suggest/2.2/csa/orderssearchsuggest/Orders_GetSearchSuggestions.html
	declare ordersGetSearchSuggestions = i4 with protect, constant(680220)
	declare hMessage = i4 with protect, noconstant(0)
	declare hRequest = i4 with protect, noconstant(0)
	declare hReply = i4 with protect, noconstant(0)
	declare hPersonnel = i4 with protect, noconstant(0)
	declare hVenue = i4 with protect, noconstant(0)
	declare hPrescription = i4 with protect, noconstant(0)
	declare hContent = i4 with protect, noconstant(0)
	declare hOrdFilter = i4 with protect, noconstant(0)
	declare hPharmFilter = i4 with protect, noconstant(0)
	declare hFilterSet = i4 with protect, noconstant(0)
	declare hStatus = i4 with protect, noconstant(0)
	declare bSuccess = i2 with protect, noconstant(0)
	declare sDebugMsg = vc with protect, noconstant("")
	declare suggHandle = i4 with protect, noconstant(0)
	declare suggCnt = i4 with protect, noconstant(0)
	declare orderHandle = i4 with protect, noconstant(0)
	declare orderCnt = i4 with protect, noconstant(0)
	declare catalogTypeCd = f8 with protect, noconstant(0.0)
	declare stat = i4 with protect, noconstant(0)
	declare foundCnt = i4 with protect, noconstant(0)
	declare newCnt = i4 with protect, noconstant(0)
	declare i = i2 with protect, noconstant(0)
	declare j = i2 with protect, noconstant(0)
	declare START = i4 with protect, constant(1)
	declare medName = vc with protect, noconstant("")
	declare index = i4 with protect, noconstant(0)
	declare medPosition = i4 with protect, noconstant(0)
	;Create and fill the request
	set hMessage = uar_SrvSelectMessage(ordersGetSearchSuggestions)
	set hRequest = uar_SrvCreateRequest(hMessage)
	set stat = uar_SrvSetString(hRequest, "search_phrase", nullterm(search))
	set stat = uar_SrvSetShort(hRequest, "suggestion_limit", 100)
	set hPersonnel = uar_SrvGetStruct(hRequest, "personnel")
	set stat = uar_SrvSetDouble(hPersonnel, "personnel_id", med_request->personnel_id)
	set hVenue = uar_SrvGetStruct(hRequest, "filter_by_venue")
	set stat = uar_SrvAddItem(hVenue, "prescription_venue")
	set hPrescription = uar_SrvGetItem(hVenue, "prescription_venue", 0)
	set hContent = uar_SrvGetStruct(hPrescription, "content")
	set stat = uar_SrvSetShort(hContent, "orderable_ind", 1)
	set hOrdFilter = uar_SrvGetStruct(hPrescription, "orderable_filters")
	set stat = uar_SrvSetShort(hOrdFilter, "historical_ind", 1)

	;Initialize the reply and execute the transation
	set hReply = uar_SrvCreateReply(hMessage)
	set stat = uar_SrvExecute(hMessage, hRequest, hReply)

	;Check the status of the call
	if(stat = 0)
		set hStatus = uar_SrvGetStruct(hReply, "status_data")
		set bSuccess = uar_SrvGetShort(hStatus, "success_ind")
		if(bSuccess = 0)
			set stat = uar_SrvDestroyHandle(hMessage)
			set stat = uar_SrvDestroyHandle(hRequest)
			set stat = uar_SrvDestroyHandle(hReply)
			set sDebugMsg = uar_SrvGetStringPtr(hStatus, "debug_error_message")
			set failed = 1
			set fail_operation = "getMedName"
			call replyFailure(sDebugMsg)
		endif
	else
		set stat = uar_SrvDestroyHandle(hMessage)
		set stat = uar_SrvDestroyHandle(hRequest)
		set stat = uar_SrvDestroyHandle(hReply)
		set failed = 1
		set fail_operation = "getMedName"
		call replyFailure("Orders_GetSearchSuggestions failed")
	endif

	;Read the reply
	set suggCnt = uar_SrvGetItemCount(hReply, "suggestions")
	set stat = alterlist(reply->meds, suggCnt)
	set newCnt = suggCnt
	for(i = 1 to suggCnt)
		set suggHandle = uar_SrvGetItem(hReply, "suggestions", i - 1)
		set orderCnt = uar_SrvGetItemCount(suggHandle, "orderable_suggestion")
		if(orderCnt > 1)
			set newCnt = newCnt + orderCnt - 1
			set stat = alterlist(reply->meds, newCnt)
		endif
		for(j = 1 to orderCnt)
			set orderHandle = uar_SrvGetItem(suggHandle, "orderable_suggestion", j-1)
			set medName = uar_SrvGetStringPtr(orderHandle, "reference_name")
			set medPosition = locateval(index, START, size(reply->meds, 5), medName, reply->meds[index]->drug_name)
			if(medPosition = 0)
				set foundCnt = foundCnt + 1
				set reply->meds[foundCnt].drug_name = medName
			else
				call log_message(build2("Medication name ", medName, " is found as a duplicate in getMedName()"), LOG_LEVEL_DEBUG)
			endif
		endfor
	endfor
	set stat = alterlist(reply->meds, foundCnt) 
	set reply->catalog = "MED"

	set stat = uar_SrvDestroyHandle(hMessage)
	set stat = uar_SrvDestroyHandle(hRequest)
	set stat = uar_SrvDestroyHandle(hReply)
	call log_message(build2("Exit getMedName(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms ","getMedName found ", foundCnt), LOG_LEVEL_DEBUG)
end

subroutine getMedClass(search)
    call log_message("Begin getMedClass()", LOG_LEVEL_DEBUG)
    declare BEGIN_TIME = f8 with constant(curtime3), private
	declare search_string = vc with constant(build(cnvtalphanum(cnvtupper(search)), "*"))
	declare med_count = i4 with noconstant(0) 
	
	select into "nl:" from mltm_drug_categories m 
	where cnvtupper(m.category_name) = patstring(search_string)
	order by cnvtupper(m.category_name)
	head report
		med_count = 0
	detail
		med_count = med_count + 1
			if(mod(med_count,20) = 1)
				stat = alterlist(reply->drug_class, med_count + 19)
			endif
		reply->drug_class[med_count].name = m.category_name
		reply->drug_class[med_count].id = m.multum_category_id
	foot report
		stat = alterlist(reply->drug_class, med_count)
		reply->catalog = "MEDCLASS"
	with nocounter
	
	set ERRCODE = ERROR(ERRMSG,0)
    if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "getMedClass"
       call replyFailure("SELECT")
    endif

	call log_message(build2("Exit getMedClass(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms ","getMedClass found ", med_count), LOG_LEVEL_DEBUG)
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

end
go

