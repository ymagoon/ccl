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
/*****************************************************************************
 
          Date Written:       11/08/14
          Source file name:   snsro_add_user_message.prg
          Object name:        snsro_add_user_message
 
          Request #:    967503
 
          Program purpose:    Post a message to user Inbox
 
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
  000 11/09/16 AAB					Initial write
  001 07/27/17 JCO					Change % to execute; update ErrorHandler2
  002 08/15/17 AAB 					Moved all code from include file into script
  003 03/21/18 RJC					Added version code and copyright block
  004 10/26/18 STV                  Rework to function as designed originally
 ***********************************************************************/
 
drop program snsro_add_user_message go
create program snsro_add_user_message
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "User Name:" = ""
	,"Recipients:" = 0.0
	,"Patient ID:" = 0.0
	,"Sender ID:" = 0.0
	,"Subject Text:" = ""
	,"Message Text:" = ""
	,"Encounter ID:" = 0.0
	,"Save to chart indicator:" = 0
	,"Target Document Event_cd:" = 0.0
	, "Debug Flag" = 0
 
with OUTDEV, USERNAME, RECIPIENTS, PATIENTID, SENDERID, SUBJECT, MESSAGE, ENCNTRID, STC_IND, EVENTCD, DEBUG_FLAG
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.16.6.1" ;003
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record recipients_rec
record recipients_rec
(
	1 cnt = i4
	1 qual[*]
		2 value = f8
		2 name = vc
)
 
free record message_status
record message_status
(	;1 message_id                    = f8
    1 audit
    2 user_id             	= f8
    2 user_firstname     	= vc
    2 user_lastname         = vc
    2 patient_id            = f8
    2 patient_firstname     = vc
    2 patient_lastname      = vc
    2 service_version       = vc
  1 status_data
    2 status 				= c1
    2 subeventstatus[1]
      3 OperationName 		= c25
      3 OperationStatus 	= c1
      3 TargetObjectName 	= c25
      3 TargetObjectValue 	= vc
      3 Code 				= c4
      3 Description 		= vc
 
)
 
free record getNames
record getNames
(
	1 cnt = i4
	1 qual[*]
		2 value = f8
		2 name = vc
)
 
	set message_status->status_data.status = 'F'
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
declare setRequestData(null) = null with protect
declare lREQUEST_NUMBER	= i4  with protect, constant(967503)
declare SRV_REQUEST = vc with protect, constant("ADD_NOTIFICATION")
declare sTO_LABEL = vc with protect, constant( "To")
declare sSENT_LABEL = vc with protect, constant("Sent")
declare sSBJT_LABEL = vc with protect, constant("Subject")
declare sRTF_SLASH_PAR = vc with protect, constant("\par")
declare sLessThanReplace = vc with protect, constant("ksuvcmjneiuc")
declare sGreaterThanReplace = vc with protect, constant("cuienjmcvusk")
declare sCarriageReturnReplace = vc with protect, constant("kdoimxsbuepl")
declare sDblQuoteReplacement = vc with protect, constant("mshjuqnxeucn")
declare sSnglQuoteReplacement = vc with protect, constant("ocjwnmruqnsf")
declare lStat = i4 with protect, noconstant(0)
declare hMsgRep = i4 with protect, noconstant(0)
declare dSenderId = f8 with protect, noconstant(0.0)
declare sEncodedText = vc with protect, noconstant("")
declare gvcFinalMsg = gvc with protect, noconstant("")
declare lEndDeftab = i4 with protect, noconstant(0)
declare lStartDeftab = i4 with protect, noconstant(0)
declare sTempRTF = vc with protect, noconstant("")
declare sCnvtSbj = vc with protect, noconstant("")
declare sCnvtMsg = gvc with protect, noconstant("")
declare dPersonID = f8 with protect, noconstant(0.0)
declare dEncntrId = f8 with protect, noconstant(0.0)
declare dEventCd = f8 with protect, noconstant(0.0)
declare sUserName		= vc with protect, noconstant("")
declare sRecipients = vc with protect, noconstant("")
declare iRet			= i2 with protect, noconstant(0)
declare section_start_dt_tm = dq8 with protect, noconstant(cnvtdatetime(curdate, curtime3))
declare lAPP_NUM	= i4  with protect, constant(3202004)
declare lTASK_NUM	= i4  with protect, constant(3202004)
declare eCrmOk		= i2 with protect, constant(0)
declare eSRVOk		= i2 with protect, constant(0)
declare hFailInd	= i2 with protect, constant(0)
declare STRING40	= i4 with protect, constant(40)
declare hMsg		= i4 with protect, noconstant(0)
declare hApp		= i4 with protect, noconstant(0)
declare hTask		= i4 with protect, noconstant(0)
declare hStep		= i4 with protect, noconstant(0)
declare hReq		= i4 with protect, noconstant(0)
declare hRep		= i4 with protect, noconstant(0)
declare hStatusData	= i4 with protect, noconstant(0)
declare nCrmStat	= i2 with protect, noconstant(0)
declare nSrvStat	= i2 with protect, noconstant(0)
declare g_perform_failed = i2 with protect, noconstant(0)
declare CURRENT_DATE_TIME = dq8 with protect, constant(cnvtdatetime(curdate,curtime3))
declare dSTATUS_CANCELED = f8 with protect, constant(uar_get_code_by("MEANING", 79, "CANCELED"))
declare dSTATUS_COMPLETE = f8 with protect, constant(uar_get_code_by("MEANING", 79, "COMPLETE"))
declare dSTATUS_DELETED = f8 with protect, constant(uar_get_code_by("MEANING", 79, "DELETED"))
declare dSTATUS_DELIVERED = f8 with protect, constant(uar_get_code_by("MEANING", 79, "DELIVERED"))
declare dSTATUS_DISCONTINUED = f8 with protect, constant(uar_get_code_by("MEANING", 79, "DISCONTINUED"))
declare dSTATUS_DROPPED = f8 with protect, constant(uar_get_code_by("MEANING", 79, "DROPPED"))
declare dSTATUS_INERROR = f8 with protect, constant(uar_get_code_by("MEANING", 79, "INERROR"))
declare dSTATUS_INPROCESS = f8 with protect, constant(uar_get_code_by("MEANING", 79, "INPROCESS"))
declare dSTATUS_ONHOLD = f8 with protect, constant(uar_get_code_by("MEANING", 79, "ONHOLD"))
declare dSTATUS_OPENED = f8 with protect, constant(uar_get_code_by("MEANING", 79, "OPENED"))
declare dSTATUS_OVERDUE = f8 with protect, constant(uar_get_code_by("MEANING", 79, "OVERDUE"))
declare dSTATUS_PENDING = f8 with protect, constant(uar_get_code_by("MEANING", 79, "PENDING"))
declare dSTATUS_READ = f8 with protect, constant(uar_get_code_by("MEANING", 79, "READ"))
declare dSTATUS_REWORK = f8 with protect, constant(uar_get_code_by("MEANING", 79, "REWORK"))
declare dSTATUS_SUSPENDED = f8 with protect, constant(uar_get_code_by("MEANING", 79, "SUSPENDED"))
declare dFIN_NUM = f8 with protect, constant(uar_get_code_by("MEANING", 319, "FIN NBR"))
declare dACTION_VAL = f8 with protect, constant(uar_get_code_by("MEANING", 21, "PERFORM"))
declare dSTATUS_REFUSED = f8 with protect, constant(uar_get_code_by("MEANING", 79, "REFUSED"))
declare dSTATUS_VALIDATION = f8 with protect, constant(uar_get_code_by("MEANING", 79, "VALIDATION"))
declare dSTATUS_READWAITSIGN = f8 with protect, constant(uar_get_code_by("MEANING", 79, "READWAITSIGN"))
declare dSTATUS_RECALLED = f8 with protect, constant(uar_get_code_by("MEANING", 79, "RECALLED"))
declare dCOSIGN_ORD = f8 with protect, constant(uar_get_code_by("MEANING", 3406, "COSIGN_ORD"))
declare dPROPOSAL_ORD = f8 with protect, constant(uar_get_code_by("MEANING", 3406, "ORD_PROPOSAL"))
declare dFWD_SIGN_DOC = f8 with protect, constant(uar_get_code_by("MEANING", 3406, "FD_SIGN_DOC"))
declare dFWD_REVIEW_DOC = f8 with protect, constant(uar_get_code_by("MEANING", 3406, "FD_RVIEW_DOC"))
declare dREVIEW_DOC = f8 with protect, constant(uar_get_code_by("MEANING", 3406, "REVIEW_DOC"))
declare dSIGN_DOC = f8 with protect, constant(uar_get_code_by("MEANING", 3406, "SIGN_DOC"))
declare dCATEGORY_TRASH = f8 with protect, constant(uar_get_code_by("MEANING", 3404, "TRASH"))
declare dCATEGORY_SENT_ITEMS = f8 with protect, constant(uar_get_code_by("MEANING", 3404, "SENT_ITEMS"))
declare dCATEGORY_CNSLT_ORDERS = f8 with protect, constant(uar_get_code_by("MEANING", 3404, "CNSLT_ORDERS"))
declare dCATEGORY_CONSULTS = f8 with protect, constant(uar_get_code_by("MEANING", 3404, "CONSULTS"))
declare dCATEGORY_DOCUMENTS = f8 with protect, constant(uar_get_code_by("MEANING", 3404, "DOCUMENTS"))
declare dCATEGORY_DICTATE_DOCS = f8 with protect, constant(uar_get_code_by("MEANING", 3404, "DICTATE_DOCS"))
declare dCATEGORY_INCOMP_ORDER = f8 with protect, constant(uar_get_code_by("MEANING", 3404, "INCOMP_ORDER"))
declare dCATEGORY_MESSAGES = f8 with protect, constant(uar_get_code_by("MEANING", 3404, "MESSAGES"))
declare dCATEGORY_NOTIFIES = f8 with protect, constant(uar_get_code_by("MEANING", 3404, "NOTIFIES"))
declare dCATEGORY_ORDERS = f8 with protect, constant(uar_get_code_by("MEANING", 3404, "ORDERS"))
declare dCATEGORY_PAPER_DOCS = f8 with protect, constant(uar_get_code_by("MEANING", 3404, "PAPER_DOCS"))
declare dCATEGORY_REMINDERS = f8 with protect, constant(uar_get_code_by("MEANING", 3404, "REMINDERS"))
declare dCATEGORY_RESULTS = f8 with protect, constant(uar_get_code_by("MEANING", 3404, "RESULTS"))
declare dCATEGORY_SAVED_DOCS = f8 with protect, constant(uar_get_code_by("MEANING", 3404, "SAVED_DOCS"))
declare dCATEGORY_RESULTSFYI = f8 with protect, constant(uar_get_code_by("MEANING", 3404, "RESULTSFYI"))
declare dEVENT_CLASS_NUMERIC = f8 with protect, constant(uar_get_code_by("MEANING", 53, "NUM"))
declare dEVENT_CLASS_TEXT = f8 with protect, constant(uar_get_code_by("MEANING", 53, "TXT"))
declare dEVENT_CLASS_DATE = f8 with protect, constant(uar_get_code_by("MEANING", 53, "DATE"))
declare dEVENT_CLASS_MED = f8 with protect, constant(uar_get_code_by("MEANING", 53, "MED"))
declare dEVENT_CLASS_IMMUN = f8 with protect, constant(uar_get_code_by("MEANING", 53, "IMMUN"))
declare dEVENT_CLASS_COUNT = f8 with protect, constant(uar_get_code_by("MEANING", 53, "COUNT"))
declare dEVENT_CLASS_DOC = f8 with protect, constant(uar_get_code_by("MEANING", 53, "DOC"))
declare dEVENT_CLASS_MDOC = f8 with protect, constant(uar_get_code_by("MEANING", 53, "MDOC"))
declare dEVENT_CLASS_RAD = f8 with protect, constant(uar_get_code_by("MEANING", 53, "RAD"))
declare dEVENT_CLASS_HLA = f8 with protect, constant(uar_get_code_by("MEANING", 53, "HLATYPING"))
declare dEVENT_CLASS_MBO = f8 with protect, constant(uar_get_code_by("MEANING", 53, "MBO"))
declare dNORMALCY_HIGH = f8 with protect, constant(uar_get_code_by("MEANING", 52, "HIGH"))
declare dNORMALCY_LOW = f8 with protect, constant(uar_get_code_by("MEANING", 52, "LOW"))
declare dNORMALCY_CRIT = f8 with protect, constant(uar_get_code_by("MEANING", 52, "CRITICAL"))
declare dNORMALCY_PANIC_H = f8 with protect, constant(uar_get_code_by("MEANING", 52, "PANICHIGH"))
declare dNORMALCY_PANIC_L = f8 with protect, constant(uar_get_code_by("MEANING", 52, "PANICLOW"))
declare dNORMALCY_EXTREME_H = f8 with protect, constant(uar_get_code_by("MEANING", 52, "EXTREMEHIGH"))
declare dNORMALCY_EXTREME_L = f8 with protect, constant(uar_get_code_by("MEANING", 52, "EXTREMELOW"))
declare dNORMALCY_POS = f8 with protect, constant(uar_get_code_by("MEANING", 52, "POSITIVE"))
declare dNORMALCY_NEG = f8 with protect, constant(uar_get_code_by("MEANING", 52, "NEGATIVE"))
declare FromLabel = vc with protect, constant("from:")
 
/*************************************************************************
; INCLUDES
**************************************************************************/
/*001 begin
call echo("Includes")
%i ccluserdir:snsro_add_user_message.inc
call echo("Include mess common")
%i ccluserdir:snsro_messaging_common.inc
call echo("Include sansoro common")
%i ccluserdir:snsro_common.inc
001 end*/
execute snsro_common	;001
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare PostMessage(null)					= null with protect
declare PostAmble(null)						= null with protect
declare InitializeRequest(RecordData=VC(REF), RequestNumber=I4(VAL)) = null with protect
declare InitializeAppTaskRequest(RecordData=VC(REF),
	ApplicationNumber=I4(VAL),
	TaskNumber=I4(VAL),
	RequestNumber=I4(VAL),
	DoNotExitOnFail=I2(VAL,0)) = null with protect
declare Exit_ServiceRequest(hApp = i4, hTask = i4, hStep = i4) = NULL with protect
declare HandleError(OperationName = vc,
                     OperationStatus = c1,
                     TargetObjectName = vc,
                     TargetObjectValue = vc,
                     RecordData=VC(REF)) = NULL with protect
declare HandleNoData(OperationName = vc,
                     OperationStatus = c1,
                     TargetObjectName = vc,
                     TargetObjectValue = vc,
                     RecordData=VC(REF)) = NULL with protect
declare ValidateReply(nCrmStat = i4, hStep = i4, RecordData=VC(REF), ZeroForceExit = i2) = i4 with protect
declare ValidateSubReply(nCrmStat = i4, hStep = i4, RecordData=VC(REF)) = i4 with protect
declare ValidateReplyIndicator(nCrmStat = i4, hStep = i4, RecordData=VC(REF), ZeroForceExit=i2, RecordName=vc) = i4 with protect
declare ValidateReplyIndicatorDynamic(nCrmStat = i4, hStep = i4, RecordData=VC(REF), ZeroForceExit=i2,
	RecordName=vc, StatusBlock=vc) = i4 with protect
declare GetProviderPosition(prsnl_id = f8) = f8 with protect
declare CreateDateTimeFromHandle(P1=I4(REF), P2=VC(VAL), P3=VC(VAL)) = vc with protect
declare InitializeSRVRequest(RecordData=VC(REF), RequestNumber=I4(VAL), DoNotExitOnFail=I2(VAL,0)) = null with protect
declare ValidateSRVReply(nSrvStat = i4, RecordData=VC(REF), ZeroForceExit=i2) = i4 with protect
declare ValidateSRVReplyInd(nSrvStat = i4, RecordData=VC(REF), ZeroForceExit=i2, RecordName=vc, StatusBlock=vc) = i4 with protect
declare createRTFHeaderString(P1=VC(VAL), P2=VC(REF), P3=VC(VAL), P4=VC(VAL),P5=f8(VAL)) = gvc with protect
declare createNewRTF(P1=VC(VAL), P2=VC(VAL)) = vc with protect
declare encodeForRTF(P1=VC(VAL)) = vc with protect
declare populateGetNames(null) = null with protect
 
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
set dSenderId = cnvtreal($SENDERID)
set dPersonID = cnvtreal($PATIENTID)
set dEncntrId = cnvtreal($ENCNTRID)
set dEventCd = cnvtreal($EVENTCD)
set idebugFlag	= cnvtint($DEBUG_FLAG)
set sRecipients = trim($RECIPIENTS,3)
 
call echo(build("dSenderId -->", dSenderId))
call echo(build("dPersonID -->", dPersonID))
call echo(build("dEncntrId -->", dEncntrId))
call echo(build("dEventCd -->", dEventCd))
call echo(build("idebugFlag -->", idebugFlag))
call echo(build("sRecipients -->", sRecipients))
 
if(nullterm($SUBJECT) = null)
 
	call ErrorHandler2("MESSAGES", "F", "Invalid parameter data.", "Check subject or sender id.",
	"2036", "Invalid Subject or Sender Id", message_status)	;001
 
	go to exit_script
endif
 
 
if(size(sRecipients) > 0)
	call ParseRecipients(sRecipients)
else
	call ErrorHandler2("MESSAGES", "F", "Invalid parameter data.", "No recipients entered.",
	"2022", "Invalid receipent list", message_status)	;001
	go to exit_script
endif
 
 
if(idebugFlag > 0)
 
	call echo(build("nullterm($SUBJECT):", nullterm($SUBJECT)))
	call echo(build("nullterm($MESSAGE):", nullterm($MESSAGE)))
 
endif
 
 
set sCnvtSbj = replace(nullterm($SUBJECT), sLessThanReplace, "<", 0)
set sCnvtSbj = replace(sCnvtSbj, sGreaterThanReplace, ">", 0)
set sCnvtSbj = replace(sCnvtSbj, sDblQuoteReplacement, '"', 0)
set sCnvtSbj = replace(sCnvtSbj, sSnglQuoteReplacement, "'", 0)
set sCnvtMsg = replace(nullterm($MESSAGE), sLessThanReplace, "<", 0)
set sCnvtMsg = replace(sCnvtMsg, sGreaterThanReplace, ">", 0)
set sCnvtMsg = replace(sCnvtMsg, sDblQuoteReplacement, '"', 0)
set sCnvtMsg = replace(sCnvtMsg, sSnglQuoteReplacement, "'", 0)
 
 
if(idebugFlag > 0)
 
	call echo(build("sCnvtSbj:", sCnvtSbj))
	call echo(build("sCnvtMsg:", sCnvtMsg))
 
endif
 
 
set	gvcFinalMsg = createNewRTF(sCnvtSbj, sCnvtMsg)
 
if(idebugFlag > 0)
 
	call echo(build("gvcFinalMsg:", gvcFinalMsg))
 
endif
 
 
 
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
set iRet = PopulateAudit(sUserName, dPersonID, message_status, sVersion)
if(iRet = 0)  ;005
	call ErrorHandler2("MESSAGING", "F", "User is invalid", "Invalid User for Audit.",
		"1001", build("Invalid user: ", sUserName), message_status)	;001
		go to exit_script
endif
 
;sets sender to the user
set dSenderId = message_status->audit->user_id;reqinfo->updt_id
call PostMessage(null)
 
;Set Audit to Successful
call ErrorHandler2("SUCCESS", "S", "POST MESSAGE", "Message Sent successfully.",
"0000", "Message Sent successfully.", message_status)
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
	set JSONout = CNVTRECTOJSON(message_status)
 
	if(idebugFlag > 0)
 
		set file_path = logical("ccluserdir")
		set _file = build2(trim(file_path),"/snsro_add_user_message.json")
		call echo(build2("_file : ", _file))
		call echojson(message_status, _file, 0)
		call echo(JSONout)
	endif
 
    if(validate(_MEMORY_REPLY_STRING))
		set _MEMORY_REPLY_STRING = trim(JSONout,3)
	endif
 
 
#EXIT_VERSION
/*************************************************************************
;  Name: PostMessage(null)
;  Description: This will post a message to user inbox
;
**************************************************************************/
subroutine PostMessage(null)
 
	if(idebugFlag > 0)
 
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("PostMessage Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
	endif
 
	declare lNOTIFICATION_CD = f8 with protect, constant(uar_get_code_by("MEANING", 6026, "NOTIFICATION"))
 
	declare hMsgList = i4 with protect, noconstant(0)
	declare hAssignPrsnlList = i4 with protect, noconstant(0)
 
	call InitializeRequest(message_status, lREQUEST_NUMBER)
 
	if(idebugFlag > 0)
		call echo(build("hReq:",hReq))
	endif
 
	if(hReq>0)
		;one message at a time
		set lStat = uar_SrvSetShort(hReq, "skip_validation_ind", 1)
		set hMsgList = uar_SrvAddItem(hReq, "message_list")
		set lStat = uar_SrvSetDouble(hMsgList, "person_id", dPersonID)
		if(idebugFlag > 0)
			call echo(build("patient lStat:",lStat))
		endif
		set lStat = uar_SrvSetDouble(hMsgList, "msg_sender_prsnl_id", dSenderId)
		if(idebugFlag > 0)
			call echo(build("sender lStat:",lStat))
			call echo(build("subject:",sCnvtSbj, "END"))
		endif
		set lStat = uar_SrvSetString(hMsgList, "msg_subject", nullterm(sCnvtSbj))
		if(idebugFlag > 0)
			call echo(build("subject lStat:",lStat))
		endif
		set lStat = uar_SrvSetAsIs(hMsgList, "msg_text", gvcFinalMsg, size(gvcFinalMsg))
		if(idebugFlag > 0)
			call echo(build("message lStat:",lStat))
		endif
		for(x=1 to recipients_rec->cnt)
			set hAssignPrsnlList = uar_SrvAddItem(hMsgList, "assign_prsnl_list")
			if(idebugFlag > 0)
				call echo(build("hAssignPrsnlList:",hAssignPrsnlList))
			endif
 
			set lStat = uar_SrvSetDouble(hAssignPrsnlList, "assign_prsnl_id", recipients_rec->qual[x].value)
			if(idebugFlag > 0)
				call echo(build("prsnl lStat:",lStat))
			endif
			set lStat = uar_SrvSetLong(hAssignPrsnlList, "selection_nbr", x-1)
			if(idebugFlag > 0)
				call echo(build("selection lStat:",lStat))
			endif
		endfor;recipients_rec->cnt
 
		if(dEncntrId > 0.0)
			set lStat = uar_SrvSetDouble(hMsgList, "encntr_id", dEncntrId)
			if(idebugFlag > 0)
				call echo(build("encounter lStat:",lStat))
			endif
		endif
		if(dEventCd > 0.0 )
			set lStat = uar_SrvSetDouble(hMsgList, "event_cd", dEventCd)
			if(idebugFlag > 0)
				call echo(build("event_cd lStat:",lStat))
			endif
		endif
 
		if(cnvtint($STC_IND) = 1)
			set lStat = uar_SrvSetShort(hMsgList, "save_to_chart_ind", 1)
			if(idebugFlag > 0)
				call echo(build("save_to_chart_ind lStat:",lStat))
			endif
		endif
 
	endif;hReq
 
 
	if(hReq>0)
		set lStat = uar_CrmPerform(hStep)
		if(idebugFlag > 0)
			call echo(build("lStat:",lStat))
		endif
		set hMsgRep = ValidateReply(lStat, hStep, message_status, 0)
		if(hMsgRep > 0)
			set message_status->status_data.status = 'S'
		endif
	else
		set message_status->status_data.status = 'F'
		;will not display to user
		set message_status->status_data.TargetObjectValue = "Unable to create request"
	endif;hReq
 
if(idebugFlag > 0)
 
	call echo(concat("PostMessage Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
end
 
/* BEGIN BASIC INITIALIZATION ********************************************************************/
subroutine InitializeAppTaskRequest(RecordData, appNumber, taskNumber, requestNumber, doNotExitOnFail)
  ;Get APP handle
  set nCrmStat = uar_CrmBeginApp(appNumber, hApp)
  if (nCrmStat != eCrmOk OR hApp = 0)
    if (doNotExitOnFail)
      call echo("InitializeAppTaskRequest: BEGIN Application Handle failed")
      call Exit_ServiceRequest(hApp,hTask,hStep)
      return
    else
      ;call HandleError("BEGIN", "F", "Application Handle", cnvtstring(nCrmStat), RecordData)
      call ErrorHandler2("BEGIN", "F", "Application Handle", cnvtstring(nCrmStat),
 	  "9999", build("Application Handle Failed: ", cnvtstring(nCrmStat)), message_status)	;001
      call Exit_ServiceRequest(hApp,hTask,hStep)
	  go to EXIT_SCRIPT
    endif
  endif
 
  ;Get TASK handle
  set nCrmStat = uar_CrmBeginTask(hApp, taskNumber, hTask)
  if (nCrmStat != eCrmOk OR hTask = 0)
    if (doNotExitOnFail)
      call echo("InitializeAppTaskRequest: BEGIN Task Handle failed")
      call Exit_ServiceRequest(hApp,hTask,hStep)
      return
    else
      ;call HandleError("BEGIN", "F", "Task Handle", cnvtstring(nCrmStat), RecordData)
      call ErrorHandler2("BEGIN", "F", "Task Handle", cnvtstring(nCrmStat),
 	  "9999", build("Task Handle Failed: ", cnvtstring(nCrmStat)), message_status)	;001
      call Exit_ServiceRequest(hApp,hTask,hStep)
      go to EXIT_SCRIPT
    endif
  endif
 
  ;Start REQUEST handle
 
  set nCrmStat = uar_CrmBeginReq(hTask, 0, requestNumber, hStep)
  if (nCrmStat != eCrmOk or hStep = 0)
    if (doNotExitOnFail)
      call echo("InitializeAppTaskRequest: BEGIN Request Handle failed")
      call Exit_ServiceRequest(hApp,hTask,hStep)
      return
    else
      ;call HandleError("BEGIN", "F", "Req Handle", cnvtstring(nCrmStat), RecordData)
      call ErrorHandler2("BEGIN", "F", "Begin Req", cnvtstring(nCrmStat),
 	  "9999", build("Begin Req Failed: ", cnvtstring(nCrmStat)), message_status)	;001
      call Exit_ServiceRequest(hApp,hTask,hStep)
    endif
  endif
 
  ;Get REQUEST handle
  set hReq = uar_CrmGetRequest(hStep)
 
  if (hReq = 0)
    if (doNotExitOnFail)
      call echo("InitializeAppTaskRequest: GET Request Handle failed")
      call Exit_ServiceRequest(hApp,hTask,hStep)
      return
    else
      ;call HandleError("GET", "F", "Req Handle", cnvtstring(nCrmStat), RecordData)
      call ErrorHandler2("GET", "F", "Req Handle", cnvtstring(nCrmStat),
 	  "9999", build("Req Handle Failed: ", cnvtstring(nCrmStat)), message_status)	;001
      call Exit_ServiceRequest(hApp,hTask,hStep)
    endif
  endif
end
 
subroutine InitializeRequest(RecordData, requestNumber)
	call InitializeAppTaskRequest(RecordData, lAPP_NUM, lTASK_NUM, requestNumber)
end
 
 
subroutine InitializeSRVRequest(RecordData, requestNumber, doNotExitOnFail)
  ;Get SRV handle
  set hMsg = uar_SrvSelectMessage(requestNumber)
  if (hMsg = hFailInd) ;Message not created successfully
    if (doNotExitOnFail)
      call echo("InitializeSRVRequest: Create Message handle failed")
      call Exit_SrvRequest(hMsg,hReq,hRep)
      return
    else
      ;call HandleError("CREATE", "F", "Message Handle", cnvtstring(hMsg), RecordData)
      call ErrorHandler2("CREATE", "F", "Message Handle", cnvtstring(hMsg),
 	  "9999", build("Message Handle Failed: ", cnvtstring(hMsg)), message_status)	;001
      call Exit_SrvRequest(hMsg,hReq,hRep)
    endif
  endif
  ;Create Request handle
  set hReq = uar_SrvCreateRequest(hMsg)
  if (hReq = hFailInd) ;Request not created successfully
    if (doNotExitOnFail)
      call echo("InitializeSRVRequest: Create Request Handle failed")
      call Exit_SrvRequest(hMsg,hReq,hRep)
      return
    else
      ;call HandleError("CREATE", "F", "Req Handle", cnvtstring(hReq), RecordData)
      call ErrorHandler2("CREATE", "F", "REQ Handle", cnvtstring(hReq),
 	  "9999", build("REQ Handle Failed: ", cnvtstring(hReq)), message_status)	;001
      call Exit_SrvRequest(hMsg,hReq,hRep)
    endif
  endif
  ;Get Reply handle
  set hRep = uar_SrvCreateReply(hMsg)
  if (hRep = hFailInd) ;Reply not created successfully
    if (doNotExitOnFail)
      call echo("InitializeSRVRequest: Create Reply Handle failed")
      call Exit_SrvRequest(hMsg,hReq,hRep)
      return
    else
      ;call HandleError("CREATE", "F", "Rep Handle", cnvtstring(hRep), RecordData)
      call ErrorHandler2("CREATE", "F", "REP Handle", cnvtstring(hRep),
 	  "9999", build("REP Handle Failed: ", cnvtstring(hRep)), message_status)	;001
      call Exit_SrvRequest(hMsg,hReq,hRep)
    endif
  endif
 
end
/* SUBROUTINES ***********************************************************************************/
 
/*
GetProviderPosition(ID) retrieves the providers position code from the PRSNL table.
*/
subroutine GetProviderPosition(prsnl_id)
	declare prsnl_position_cd = f8 with noconstant(0), protect
 
	select into "nl:"
	from prsnl p
	plan p where p.person_id = prsnl_id
		and p.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
	detail
		prsnl_position_cd = p.position_cd
	with nocounter
 
	return(prsnl_position_cd)
end
 
/*
CreateDateTimeFromHandle(handle(I4), dateElement(STRING), timeZone(STRING)) retrieves the date and timezone
from the supplied handle given the dateElement and timeZone parameters.  The timezone shall be ignored, and a UTC date shall
be returned meeting the ISO 8601 standard.
*/
subroutine CreateDateTimeFromHandle(hHandle, sDateDataElement, sTimeZoneDataElement)
	declare time_zone = i4 with noconstant(0), protect
	declare return_val = vc with noconstant(""), protect
 
	set stat = uar_SrvGetDate(hHandle, nullterm(sDateDataElement), recdate->datetime)
	if (sTimeZoneDataElement != "")
		set time_zone = uar_SrvGetLong(hHandle, nullterm(sTimeZoneDataElement))
	endif
 
	if(VALIDATE(recdate->datetime,0))
		set return_val = build(replace(datetimezoneformat(cnvtdatetime(recdate->datetime) ,
		DATETIMEZONEBYNAME("UTC"),"yyyy-MM-dd HH:mm:ss",curtimezonedef)," ","T",1),"Z")
	else
		set return_val = ""
	endif
 
	return (return_val)
end
 
subroutine HandleError(OperationName,
                        OperationStatus,
                        TargetObjectName,
                        TargetObjectValue,
                        RecordData)
	set RecordData->status_data.status = "F"
	if (size(RecordData->status_data.subeventstatus, 5) = 0)
		set stat = alterlist(RecordData->status_data.subeventstatus, 1)
	endif
 
	set RecordData->status_data.subeventstatus[1].OperationName		= OperationName
	set RecordData->status_data.subeventstatus[1].OperationStatus	= OperationStatus
	set RecordData->status_data.subeventstatus[1].TargetObjectName	= TargetObjectName
	set RecordData->status_data.subeventstatus[1].TargetObjectValue	= TargetObjectValue
 
	set g_perform_failed = 1
end
 
subroutine HandleNoData(OperationName,
                        OperationStatus,
                        TargetObjectName,
                        TargetObjectValue,
                        RecordData)
 
	set RecordData->status_data.status = "Z"
	if (size(RecordData->status_data.subeventstatus, 5) = 0)
		set stat = alterlist(RecordData->status_data.subeventstatus, 1)
	endif
	set RecordData->status_data.subeventstatus[1].OperationName		= OperationName
	set RecordData->status_data.subeventstatus[1].OperationStatus	= OperationStatus
	set RecordData->status_data.subeventstatus[1].TargetObjectName	= TargetObjectName
	set RecordData->status_data.subeventstatus[1].TargetObjectValue	= TargetObjectValue
end
 
subroutine Exit_ServiceRequest(hApp, hTask, hStep)
	if (hStep != 0)
		set nCrmStat = uar_CrmEndReq(hStep)
	endif
 
	if (hTask != 0)
		set nCrmStat = uar_CrmEndTask(hTask)
	endif
 
	if (hApp != 0)
		set nCrmStat = uar_CrmEndApp(hApp)
	endif
 
	if (g_perform_failed = 1)
		go to EXIT_SCRIPT
	endif
end
 
subroutine Exit_SrvRequest(hMsg, hReq, hRep)
	if (hMsg != 0)
		set nSrvStat = uar_SrvDestroyInstance(hMsg)
	endif
 
	if (hReq != 0)
		set nSrvStat = uar_SrvDestroyInstance(hReq)
	endif
 
	if (hRep != 0)
		set nSrvStat = uar_SrvDestroyInstance(hRep)
	endif
 
	if (g_perform_failed = 1)
		go to EXIT_SCRIPT
	endif
end
 
subroutine ValidateReply(nCrmStat, hStep, RecordData, ZeroForceExit)
	declare sOperationName		= vc with noconstant(""), protect
	declare sOperationStatus	= vc with noconstant(""), protect
	declare sTargetObjectName	= vc with noconstant(""), protect
	declare sTargetObjectValue	= vc with noconstant(""), protect
 
	declare sStatus = c1 with noconstant(' '), protect
 
	if (nCrmStat = eCrmOk)
		set hRep = uar_CrmGetReply(hStep)
		set hStatusData = uar_SrvGetStruct(hRep, "status_data")
		set sStatus = uar_SrvGetStringPtr(hStatusData, "status")
		if (validate(debug_ind, 0) = 1)
			call echo(build("Status: ", sStatus))
		endif
		if (sStatus = "Z")
			call HandleNoData("PERFORM", "Z", SRV_REQUEST, cnvtstring(nCrmStat), RecordData)
			if (ZeroForceExit = 1)
				call Exit_ServiceRequest(hApp,hTask,hStep)
				go to EXIT_SCRIPT
			endif
		elseif(sStatus != "S")
			if (uar_SrvGetItemCount(hStatusData, "subeventstatus") > 0)
				set hItem = uar_SrvGetItem(hStatusData, "subeventstatus", 0)
				set sOperationName = uar_SrvGetStringPtr(hItem, "OperationName")
				set sOperationStatus = uar_SrvGetStringPtr(hItem, "OperationStatus")
				set sTargetObjectName = uar_SrvGetStringPtr(hItem, "TargetObjectName")
				set sTargetObjectValue = uar_SrvGetStringPtr(hItem, "TargetObjectValue")
            endif
            call HandleError(sOperationName, sStatus, sTargetObjectName, sTargetObjectValue, RecordData)
            call Exit_ServiceRequest(hApp,hTask,hStep)
        endif
		return (hRep)
	else
		call HandleError("PERFORM", "F", SRV_REQUEST, cnvtstring(nCrmStat), RecordData)
		call Exit_ServiceRequest(hApp,hTask,hStep)
	endif
end
 
subroutine ValidateSubReply(nCrmStat, hStep, RecordData)
	declare sOperationName		= vc with noconstant(""), protect
	declare sOperationStatus	= vc with noconstant(""), protect
	declare sTargetObjectName	= vc with noconstant(""), protect
	declare sTargetObjectValue	= vc with noconstant(""), protect
 
	declare sStatus = c1 with noconstant(' '), protect
 
	if (nCrmStat = eCrmOk)
		set hRep = uar_CrmGetReply(hStep)
		set hStatusData = uar_SrvGetStruct(hRep, "status_data")
		set sStatus = uar_SrvGetStringPtr(hStatusData, "status")
		if (validate(debug_ind, 0) = 1)
			call echo(build("Status: ", sStatus))
		endif
		if(sStatus != "S" and sStatus != "Z")
			if (uar_SrvGetItemCount(hStatusData, "subeventstatus") > 0)
				set hItem = uar_SrvGetItem(hStatusData, "subeventstatus", 0)
				set sOperationName = uar_SrvGetStringPtr(hItem, "OperationName")
				set sOperationStatus = uar_SrvGetStringPtr(hItem, "OperationStatus")
				set sTargetObjectName = uar_SrvGetStringPtr(hItem, "TargetObjectName")
				set sTargetObjectValue = uar_SrvGetStringPtr(hItem, "TargetObjectValue")
            endif
            call HandleError(sOperationName, sStatus, sTargetObjectName, sTargetObjectValue, RecordData)
            call Exit_ServiceRequest(hApp,hTask,hStep)
        endif
		return (hRep)
	else
		call HandleError("PERFORM", "F", SRV_REQUEST, cnvtstring(nCrmStat), RecordData)
		call Exit_ServiceRequest(hApp,hTask,hStep)
	endif
end
 
subroutine ValidateReplyIndicatorDynamic(nCrmStat, hStep, RecordData, ZeroForceExit, RecordName, StatusBlock)
	declare sOperationName		= vc with noconstant(""), protect
	declare sOperationStatus	= vc with noconstant(""), protect
	declare sTargetObjectName	= vc with noconstant(""), protect
	declare sTargetObjectValue	= vc with noconstant(""), protect
 
	declare successInd = i2 with noconstant(0), protect
	declare errorMessage = vc with noconstant(""), protect
 
	if (nCrmStat = eCrmOk)
		set hRep = uar_CrmGetReply(hStep)
		set hStatusData = uar_SrvGetStruct(hRep, nullterm(StatusBlock))
		set successInd = uar_SrvGetShort(hStatusData, "success_ind")
		set errorMessage = uar_SrvGetStringPtr(hStatusData, "debug_error_message")
 
		if (validate(debug_ind, 0) = 1)
			call echo(build("Status Indicator: ", successInd))
			call echo(build("Error Message: ", errorMessage))
		endif
 
		if (successInd != 1)
            call HandleError("ValidateReplyIndicator", "F", SRV_REQUEST, errorMessage, RecordData)
            call Exit_ServiceRequest(hApp,hTask,hStep)
		elseif (trim(RecordName) != "")
			set resultListCnt = uar_SrvGetItemCount(hRep, nullterm(RecordName))
			if (resultListCnt = 0)
				if (validate(debug_ind, 0) = 1)
					call echo(build("ZERO RESULTS found in [", trim(RecordName, 3), "]"))
				endif
				call HandleNoData("PERFORM", "Z", SRV_REQUEST, cnvtstring(nCrmStat), RecordData)
				if (ZeroForceExit = 1)
					call Exit_ServiceRequest(hApp,hTask,hStep)
					go to EXIT_SCRIPT
				endif
			endif
		endif
		return (hRep)
	else
		call HandleError("PERFORM", "F", SRV_REQUEST, cnvtstring(nCrmStat), RecordData)
		call Exit_ServiceRequest(hApp,hTask,hStep)
	endif
end
 
subroutine ValidateReplyIndicator(nCrmStat, hStep, RecordData, ZeroForceExit, RecordName)
	call ValidateReplyIndicatorDynamic(nCrmStat, hStep, RecordData, ZeroForceExit, RecordName, "status_data")
end
subroutine ValidateSRVReplyInd(nSrvStat, RecordData, ZeroForceExit, RecordName, StatusBlock)
	declare sOperationName		= vc with noconstant(""), protect
	declare sOperationStatus	= vc with noconstant(""), protect
	declare sTargetObjectName	= vc with noconstant(""), protect
	declare sTargetObjectValue	= vc with noconstant(""), protect
	declare successInd = i2 with noconstant(0), protect
	declare errorMessage = vc with noconstant(""), protect
	if (nSrvStat = eSRVOk)
		set hStatusData = uar_SrvGetStruct(hRep, nullterm(StatusBlock))
		set successInd = uar_SrvGetShort(hStatusData, "success_ind")
		set errorMessage = uar_SrvGetStringPtr(hStatusData, "debug_error_message")
		if (validate(debug_ind, 0) = 1)
			call echo(build("Status Indicator: ", successInd))
			call echo(build("Error Message: ", errorMessage))
		endif
		if (successInd != 1)
            call HandleError("ValidateReply", "F", SRV_REQUEST, errorMessage, RecordData)
            call Exit_SrvRequest(hMsg,hReq,hRep)
		elseif (trim(RecordName) != "")
			set resultListCnt = uar_SrvGetItemCount(hRep, nullterm(RecordName))
			if (resultListCnt = 0)
				if (validate(debug_ind, 0) = 1)
					call echo(build("ZERO RESULTS found in [", trim(RecordName, 3), "]"))
				endif
				call HandleNoData("PERFORM", "Z", SRV_REQUEST, cnvtstring(nSrvStat), RecordData)
				if (ZeroForceExit = 1)
					call Exit_SrvRequest(hMsg,hReq,hRep)
					go to exit_script
				endif
			endif
		endif
		return (hRep)
	else
		call HandleError("PERFORM", "F", SRV_REQUEST, cnvtstring(nSrvStat), RecordData)
		call Exit_SrvRequest(hMsg,hReq,hRep)
	endif
end
subroutine ValidateSRVReply(nSrvStat, RecordData, ZeroForceExit)
	declare sOperationName		= vc with noconstant(""), protect
	declare sOperationStatus	= vc with noconstant(""), protect
	declare sTargetObjectName	= vc with noconstant(""), protect
	declare sTargetObjectValue	= vc with noconstant(""), protect
	declare sStatus = c1 with noconstant(' '), protect
	if (nSrvStat = eSRVOk)
		set hStatusData = uar_SrvGetStruct(hRep, "status_data")
		set sStatus = uar_SrvGetStringPtr(hStatusData, "status")
		if (validate(debug_ind, 0) = 1)
			call echo(build("Status: ", sStatus))
		endif
		if (sStatus = "Z")
			call HandleNoData("PERFORM", "Z", SRV_REQUEST, cnvtstring(nSrvStat), RecordData)
			if (ZeroForceExit = 1)
				call Exit_SrvRequest(hMsg,hReq,hRep)
				go to exit_script
			endif
		elseif(sStatus != "S")
			if (uar_SrvGetItemCount(hStatusData, "subeventstatus") > 0)
				set hItem = uar_SrvGetItem(hStatusData, "subeventstatus", 0)
				set sOperationName = uar_SrvGetStringPtr(hItem, "OperationName")
				set sOperationStatus = uar_SrvGetStringPtr(hItem, "OperationStatus")
				set sTargetObjectName = uar_SrvGetStringPtr(hItem, "TargetObjectName")
				set sTargetObjectValue = uar_SrvGetStringPtr(hItem, "TargetObjectValue")
            endif
            call HandleError(sOperationName, sStatus, sTargetObjectName, sTargetObjectValue, RecordData)
            call Exit_SrvRequest(hMsg,hReq,hRep)
        endif
		return (hRep)
	else
		call HandleError("PERFORM", "F", SRV_REQUEST, cnvtstring(nSrvStat), RecordData)
		call Exit_SrvRequest(hMsg,hReq,hRep)
	endif
end
subroutine createNewRTF(sSubject, sMessage)
 
 call echo("createNewRTF")
	declare sRTF_HEADER = vc with protect, constant("{\rtf1\ansi\ansicpg1252\uc0\deff0{\fonttbl")
	declare sRTF_CHARSET0 = vc with protect, constant("{\f0\fswiss\fcharset0\fprq2 Arial;}")
	declare sRTF_CHARSET1 = vc with protect, constant("{\f1\froman\fcharset0\fprq2 Times New Roman;}")
	declare sRTF_CHARSET2 = vc with protect, constant("{\f2\froman\fcharset2\fprq2 Symbol;}}")
	declare sRTF_COLORTBL1 = vc with protect, constant("{\colortbl;\red0\green0\blue0;\red255\green255\blue255;")
	declare sRTF_COLORTBL2 = vc with protect, constant("\red0\green0\blue0;\red255\green255\blue255;}")
	declare sRTF_GEN = vc with protect, constant("{\*\generator TX_RTF32 10.1.323.501;}")
	declare sRTF_TABDEF = vc with protect, constant("\deftab1134\pard\plain\f0\fs20\cb2\chshdng0\chcfpat0\chcbpat2")
	declare sRTF_TEXT_FIELD1 = vc with protect, constant("{\*\txfieldstart\txfieldtype0\txfieldflags147\txfielddata d469a1f3}")
	declare sRTF_TEXT_FIELD2 = vc with protect, constant("\plain\f1\fs20\cb4\chshdng0\chcfpat0\chcbpat4\par\pard{\*\txfieldend}")
	declare sRTF_TEXT_FIELD3 = vc with protect, constant("\plain\f1\fs20\cb4\chshdng0\chcfpat0\chcbpat4")
	declare sRTF_SLASH_PAR = vc with protect, constant("\par")
 
	declare sCarriageReturnReplace = vc with protect, constant("kdoimxsbuepl")
 
	free record getNames
	record getNames
	(
		1 cnt = i4
		1 qual[*]
			2 value = f8
			2 name = vc
	)
 
	declare sRTFReturn = gvc with protect, noconstant("")
	call populateGetNames(null)
 
	call echorecord(getNames)
	set sRTFReturn = build2(sRTF_HEADER
							,"  "
							,sRTF_CHARSET0
							,"  "
							,sRTF_CHARSET1
							,"  "
							,sRTF_CHARSET2
							,"  "
							,sRTF_COLORTBL1
							,sRTF_COLORTBL2
							,"  "
							,sRTF_GEN
							,"  "
							,sRTF_TABDEF
							,"  "
							,createRTFHeaderString(nullterm(sSubject), getNames, getNames->qual[size(getNames->qual,5)].name, CURRENT_DATE_TIME)
							," ", sRTF_SLASH_PAR, " "
							,sRTF_TEXT_FIELD1
							,sRTF_TEXT_FIELD2
							,sRTF_TEXT_FIELD3
							," "
							,encodeForRTF(nullterm(sMessage))
							,"\par\pard\par }"
						)
 
 
		call echo(sRTFReturn)
 
	set sRTFReturn = replace(sRTFReturn, sCarriageReturnReplace, concat(" ", sRTF_SLASH_PAR, " "), 0)
 
		call echo(sRTFReturn)
 
 
 
	return(sRTFReturn)
end;createRTF
 
/*
	returns an RTF-safe string from the inputted string
	param: string
	return: string with special characters escaped for RTF
*/
subroutine encodeForRTF(sInputString)
 
 
	declare sEncodedString = vc with protect, noconstant("")
 
	set sEncodedString = replace(sInputString, "\", "\\", 0)
	set sEncodedString = replace(sEncodedString, "{", "\{", 0)
	set sEncodedString = replace(sEncodedString, "}", "\}", 0)
 
	if (validate(debug_ind, 0) = 1)
		call echo(sEncodedString)
	endif
 
 
 
	return(sEncodedString)
end;encodeForRTF
 
/*
	returns a header string intended for RTF
	param:	sSbjt - subject of message
			sRecip - record of names
			sPrsnl - full name of personnel
			dSentDtTm - dq8 format of sent dt/tm
	return: RTF string of the header
*/
subroutine createRTFHeaderString(sSbjt, sRecip, sPrsnl, dSentDtTm)
 
 call echo("createRTFHeaderString")
	declare sHeaderString = vc with protect, noconstant("")
	call echorecord(sRecip)
 
 
	set sHeaderString = build2("---------------------"
								," ", sRTF_SLASH_PAR, " "
								,FromLabel, ": "
								,encodeForRTF(trim(sPrsnl,3))
								," ", sRTF_SLASH_PAR, " "
								,sTO_LABEL
							)
 
	call echo(build("	sHeaderString -->", sHeaderString))
 
	for(x=1 to size(sRecip->qual,5)-1)
		if(x=1)
			set sHeaderString = build2(sHeaderString, ": ", encodeForRTF(trim(sRecip->qual[x].name,3)), ";")
		else
			set sHeaderString = build2(sHeaderString, " ", encodeForRTF(trim(sRecip->qual[x].name,3)), ";")
		endif
	endfor
	set sHeaderString = build2(sHeaderString, " ", sRTF_SLASH_PAR, " "
								,sSENT_LABEL, ": "
								,format(dSentDtTm, "@SHORTDATE4YR")
								," "
								,format(dSentDtTm, "@TIMENOSECONDS")
								," ", sRTF_SLASH_PAR, " "
								,sSBJT_LABEL, ": "
								,encodeForRTF(sSbjt)
							)
 
	if (validate(debug_ind, 0) = 1)
		call echo(sHeaderString)
	endif
 
 
	return(sHeaderString)
end;createRTFHeaderString
 
/*
	Populates the getNames record with the names of prsnl
	no parameters
	nothing returned
*/
subroutine populateGetNames(null)
 
 call echo("populateGetNames")
 
	set stat = moverec(recipients_rec, getNames)
 
	set stat = alterlist(getNames->qual, size(getNames->qual,5)+1)
	set getNames->qual[size(getNames->qual,5)].value = dSenderId
	;avoiding expand to allow duplicate
	select into "nl:"
		p.person_id
		,p.name_full_formatted
	from (Dummyt D with seq = value(size(getNames->qual,5)))
		,prsnl p
	plan d
	join p where getNames->qual[d.seq].value = p.person_id
	detail
		getNames->qual[d.seq].name = p.name_full_formatted
	with nocounter
 
end;populateGetNames
 
/*************************************************************************
;  Name: ParseRecipients(sRecipients = vc)
;  Description: Subroutine to parse a comma delimited string
**************************************************************************/
subroutine ParseRecipients(sRecipients)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ParseRecipients Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare notfnd 		= vc with constant("<not_found>")
	declare num 		= i4 with noconstant(1)
	declare str 		= vc with noconstant("")
	declare pid      = f8
	declare rcnt      = i4;size of array and place holder
	declare error_str = vc
 
	while (str != notfnd)
		set str =  piece(sRecipients,',',num,notfnd)
		set pid = cnvtreal(trim(str,3))
		if(pid > 0.0)
			set rcnt = rcnt + 1
			set stat = alterlist(recipients_rec->qual,rcnt)
			set recipients_rec->qual[rcnt].value = pid
			set recipients_rec->cnt = rcnt
		elseif(str != notfnd)
			set error_str = build("Invalid Recipent Format-->",str)
			call ErrorHandler2("MESSAGES", "F", "Invalid parameter data.", error_str,
			"2022", "Invalid receipent list", message_status)	;001
			go to exit_script
		endif
		set num = num + 1
	endwhile
 
 
 
	if(recipients_rec->cnt = 0)
		call ErrorHandler2("MESSAGES", "F", "Invalid parameter data.", "No recipients entered.",
			"2022", "Invalid receipent list", message_status)	;001
		go to exit_script
	else
		;this will iterate through the recipients to see if all recipients have inboxes
		set error_str = ""
		select into "nl:"
		from (dummyt d with seq = recipients_rec->cnt)
			,prsnl p
			,view_prefs v
			,dummyt d2 
		plan d
		join d2
		join p	
			where p.person_id = recipients_rec->qual[d.seq].value
		join v 
  			where v.position_cd = p.position_cd
    		and v.active_ind = 1
    		and v.frame_type = "ORG"
    		and v.view_name = "PVINBOX"
    	head report
    		x = 0
    		detail
    			x = x + 1
    			if(x = 1)
    				error_str = build("Recipent Has no inbox-->",cnvtstring(recipients_rec->qual[d.seq].value))
    			else
    				error_str = build(error_str,", ",cnvtstring(recipients_rec->qual[d.seq].value))
    			endif
  			
		with nocounter, outerjoin = d2,dontexist 
		
		if(size(trim(error_str,3)) > 0)
			call ErrorHandler2("MESSAGES", "F", "Invalid parameter data.", error_str,
			"2022", "Recipients do not have inboxes", message_status)	
			go to exit_script
		endif
 
	endif
 
 
	if(iDebugFlag > 0)
		call echo(concat("ParseRecipients Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;End Sub
 
 
end
go
