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
 
        Source file name:                   mp_dcp_generate_communication.PRG
        Object name:                        mp_dcp_generate_communication
 
        Product:
        Product Team:
 
        Program purpose:                    Creates communications for a given list of patients
 
        Tables read:                        ENCOUNTER, DUAL
 
        Tables updated:                     LONG_BLOB, DCP_MP_PL_COMM, DCP_MP_PL_COMM_PATIENT
 
        Executing from:                     MPages
 
        Special Notes:                      None
 
        Request Number:                     None
 
/**************************************************************************************
 
    ***********************************************************************
    *                   GENERATED MODIFICATION CONTROL LOG                *
    ***********************************************************************
     Mod    Date        Feature Engineer                    Comment
     ----   --------    ------- --------------------------- --------------------------
     0000   09/22/15    450905  KS026860                     Initial release
*******************************  END OF ALL MODCONTROL BLOCKS  **************************/
 
drop program mp_dcp_generate_communication:dba go
create program mp_dcp_generate_communication:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE" ,
	"JSON_ARGS:" = ""
 
with OUTDEV, JSON_ARGS
 
/*
genComm_request: {
	1 patients[*]
		2 person_id f8
		2 comm_pref_cd f8
		2 encounter_id f8
	1 prsnl_id f8
	1 sender_prsnl_id f8
	1 broadcast_ident vc
	1 comm_subject_text vc
	1 comm_subject_cd f8
	1 comm_msg_text vc
	1 save_to_chart_ind i2
	1 event_cd f8
	1 list_id f8
	1 send_broadcast_flag i2 ; 1 - call broadcast messaging service
}*/
 
%i cclsource:mp_dcp_blob_in_params.inc
declare args = vc with protect, constant(ExtractParamsFromRequest(request, $JSON_ARGS))
declare stat = i4 with protect, noconstant(0)
 
set stat = cnvtjsontorec(args)
 
;call echorecord(genComm_request)
 
free record reply
record reply
(
	1 message_patients_group[*]
		2 person_id = f8
	1 letters_patient_group[*]
		2 person_id = f8
		2 encounter_id = f8
	1 phone_calls_group[*]
		2 person_id = f8
		2 encounter_id = f8
	1 broadcast_id = vc
	1 message_sent_ind = i2 ; 0 = call failed, 1 = call did not fail (or wasn't called because no patients needed portal messages)
	1 phone_calls_ind = i2 
%i cclsource:status_block.inc
)
 
free record portal
record portal
(
	1 patients[*]
		2 person_id = f8
		2 encounter_id = f8
		2 remove_ind = i2
)
 
%i cclsource:mp_script_logging.inc
set modify maxvarlen 52428800
call log_message("In mp_dcp_generate_communication", LOG_LEVEL_DEBUG)
 
/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/
declare FilterDeceasedPatients(NULL)												= NULL
declare RemovePatientByIndex(item_idx = i4)											= NULL
declare GroupPatientsByCommPref(NULL)												= NULL
declare CheckMessagingAlias(NULL)													= NULL
declare RealignPatientGroups(NULL)													= NULL
declare SendBroadcastMessages(NULL)													= NULL
declare StoreMessage(NULL)															= NULL
declare CreateCommunications(NULL)													= NULL
declare StoreCommunication(person_id = f8, encounter_id = f8, comm_flag = i2)		= NULL
declare CompleteCommunications(NULL)												= NULL
declare ReplyFailure(NULL)															= NULL
declare CnvtCCLRec(NULL)															= NULL
 
/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
declare error_string = vc
declare fail_operation = vc
declare failed = i2 with NOCONSTANT(0)
declare GEN_COMM_STATUS_CODESET = i4 with constant(4116002), protect
declare COMM_PREF_CODESET = i4 with constant(23042), protect
declare PATIENTPORTAL_CD = f8 with constant(uar_get_code_by("MEANING",COMM_PREF_CODESET,"PATPORTAL")),protect
declare TELEPHONE_CD = f8 with constant(uar_get_code_by("MEANING",COMM_PREF_CODESET,"TELEPHONE")),protect
declare LETTER_CD = f8 with constant(uar_get_code_by("MEANING",COMM_PREF_CODESET,"LETTER")),protect
declare CREATED_CD = f8 with constant(uar_get_code_by("MEANING",GEN_COMM_STATUS_CODESET,"CREATED")),protect
declare COMPLETE_CD = f8 with constant(uar_get_code_by("MEANING",GEN_COMM_STATUS_CODESET,"COMPLETE")),protect
declare long_blob_id = f8 with noconstant(0), protect
declare gen_comm_id = f8 with noconstant(0), protect
 
set ERRMSG = FILLSTRING(132," ")
set ERRCODE = error(ERRMSG,1)
set reply->status_data->status = "Z"
set reply->phone_calls_ind = 0

set reply->message_sent_ind = 1
 
/**************************************************************
; DVDev Start Coding
**************************************************************/
call FilterDeceasedPatients(NULL)
call GroupPatientsByCommPref(NULL)
call StoreMessage(NULL)
call CreateCommunications(NULL)
call CompleteCommunications(NULL)

; if script gets to here, phone calls were successful
set reply->phone_calls_ind = 1

if(genComm_request->send_broadcast_flag = 1 and size(reply->message_patients_group, 5) > 0)
	call SendBroadcastMessages(NULL)
endif
 
#exit_script
 
if(reply->status_data->status = "Z")
	set reply->status_data->status = "S"
endif
 
if(failed = 0)
	set reqinfo->commit_ind = 1 ;commit
	call CnvtCCLRec(null)
else
	set reqinfo->commit_ind = 0 ;rollback
endif
 
/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
subroutine FilterDeceasedPatients(NULL)
	call log_message("In FilterDeceasedPatients()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private

	declare DECEASED_CD_SET = i4 with constant(268), protect
	declare DECEASED_YES_CD = f8 with constant(uar_get_code_by("MEANING", DECEASED_CD_SET, "YES")), protect
	declare PERSON_CNT      = i4 with constant(size(genComm_request->patients, 5)), protect

	declare exp_idx    = i4 with noconstant(1), protect
	declare loc_idx    = i4 with noconstant(1), protect
	declare person_pos = i4 with noconstant(1), private

	select into "nl:"
	from person p
	where expand(exp_idx, 1, PERSON_CNT, p.person_id, genComm_request->patients[exp_idx].person_id)
		and (p.deceased_cd = DECEASED_YES_CD or p.deceased_dt_tm != NULL)
		and p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and p.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
		and p.active_ind = 1
	head p.person_id
		person_pos = locateval(loc_idx, 1, size(genComm_request->patients, 5), p.person_id, genComm_request->patients[loc_idx]->person_id)
		call RemovePatientByIndex(person_pos)
	with nocounter, expand=1

	call log_message(build2("Exit FilterDeceasedPatients(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end

subroutine RemovePatientByIndex(item_idx)
	call log_message("In RemovePatientByIndex()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private

	declare LIST_SIZE = i4 with constant(size(genComm_request->patients, 5)), protect

	if(LIST_SIZE > 0 and (item_idx > 0 and item_idx <= LIST_SIZE))
		set stat = alterlist(genComm_request->patients, LIST_SIZE-1, item_idx-1)
	endif

	call log_message(build2("Exit RemovePatientByIndex(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end

subroutine GroupPatientsByCommPref(NULL)
	call log_message("In GroupPatientsByCommPref()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
	declare num = i4 with noconstant(0), protect
	declare num_patients = i4 with constant(size(genComm_request->patients,5)), protect
	declare portal_cnt = i4 with noconstant(0), protect
	declare phone_cnt = i4 with noconstant(0), protect
	declare letter_cnt = i4 with noconstant(0), protect
 
	for(num = 1 to num_patients)
		;If patients indicate they want a letter, assign them to print group
		if(genComm_request->patients[num].comm_pref_cd = LETTER_CD)
			set letter_cnt = letter_cnt + 1
			if(mod(letter_cnt,50) = 1)
				set stat = alterlist(reply->letters_patient_group, letter_cnt + 49)
			endif
			set reply->letters_patient_group[letter_cnt].person_id = genComm_request->patients[num].person_id
			set reply->letters_patient_group[letter_cnt].encounter_id = genComm_request->patients[num].encounter_id
		;If patients indicate they want a phone call, assign them to the phone calls group
		elseif(genComm_request->patients[num].comm_pref_cd = TELEPHONE_CD)
			set phone_cnt = phone_cnt + 1
			if(mod(phone_cnt,50) = 1)
				set stat = alterlist(reply->phone_calls_group, phone_cnt + 49)
			endif
			set reply->phone_calls_group[phone_cnt].person_id = genComm_request->patients[num].person_id
			set reply->phone_calls_group[phone_cnt].encounter_id = genComm_request->patients[num].encounter_id
		;If the patient did not indicate whether they want a letter or phone call AND they don't have an encounter,
		;fall back and assign them to the letters group
		elseif(genComm_request->patients[num].encounter_id = 0.0)
			set letter_cnt = letter_cnt + 1
			if(mod(letter_cnt,50) = 1)
				set stat = alterlist(reply->letters_patient_group, letter_cnt + 49)
			endif
			set reply->letters_patient_group[letter_cnt].person_id = genComm_request->patients[num].person_id
		;At this point, a patient would have the last preference of portal messages. Assign them to the messages group.
		else
			set portal_cnt = portal_cnt + 1
			if(mod(portal_cnt,50) = 1)
				set stat = alterlist(portal->patients, portal_cnt + 49)
			endif
			set portal->patients[portal_cnt].person_id = genComm_request->patients[num].person_id
			set portal->patients[portal_cnt].encounter_id = genComm_request->patients[num].encounter_id
			set portal->patients[portal_cnt].remove_ind = 1
		endif
	endfor
 
	set stat = alterlist(portal->patients, portal_cnt)
	set stat = alterlist(reply->phone_calls_group, phone_cnt)
	set stat = alterlist(reply->letters_patient_group, letter_cnt)
 
	if(portal_cnt > 0)
		call CheckMessagingAlias(NULL)
	endif
 
	call log_message(build2("Exit GroupPatientsByCommPref(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end
 
subroutine CheckMessagingAlias(NULL)
	call log_message("In CheckMessagingAlias()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
	declare MESSAGING_CD = f8 with constant(uar_get_code_by("MEANING",4,"MESSAGING")), protect
	declare idx = i4 with noconstant(0), protect
	declare idx2 = i4 with noconstant(0), protect
	declare pos = i4 with noconstant(0), protect
	declare cnt = i4 with noconstant(0), protect
	declare portal_size = i4 with noconstant(size(portal->patients, 5))
	declare BATCH_SIZE = i4 with constant(20), protect
 
	select distinct into "nl:" p.person_id
	from
		person_alias p
	where
		expand(idx,1,portal_size,p.person_id, portal->patients[idx].person_id) and
		p.person_alias_type_cd = MESSAGING_CD and
		p.active_ind = 1
	detail
		pos = locateVal(idx2, 1, portal_size, p.person_id, portal->patients[idx2].person_id)
		portal->patients[pos].remove_ind = 0
		cnt = cnt + 1
		if(mod(cnt,BATCH_SIZE) = 1)
		  stat = alterlist(reply->message_patients_group,cnt + BATCH_SIZE - 1)
	    endif
		reply->message_patients_group[cnt].person_id = p.person_id
	foot report
		stat = alterlist(reply->message_patients_group, cnt)
	with nocounter, expand = 1
 
	set ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
		set failed = 1
		set fail_operation = "CheckMessagingAlias"
		call replyFailure("SELECT")
	endif
 
	if(cnt < portal_size)
		call RealignPatientGroups(NULL)
	endif
 
	call log_message(build2("Exit CheckMessagingAlias(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end
 
subroutine SendBroadcastMessages(NULL)
	call log_message("In SendBroadcastMessages()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
	declare hMsg = i4 with noconstant(0), protect
	declare hRequest = i4 with noconstant(0), protect
	declare hReply = i4 with noconstant(0), protect
	declare hPatient = i4 with noconstant(0), protect
	declare i = i4 with noconstant(0), protect
	declare num = i4 with constant(size(portal->patients, 5)), protect
	declare broadcastMessageService = i4 with constant(967735), protect
 
	set hMsg = uar_SrvSelectMessage(broadcastMessageService)
	set hRequest = uar_SrvCreateRequest(hMsg)
	set hReply = uar_SrvCreateReply(hMsg)
 
	set stat = uar_SrvSetDouble(hRequest, "msg_sender_prsnl_id", genComm_request->prsnl_id)
	set stat = uar_SrvSetString(hRequest, "msg_subject", nullterm(genComm_request->comm_subject_text))
	set stat = uar_SrvSetAsIs(hRequest, "msg_text", nullterm(genComm_request->comm_msg_text),size(genComm_request->comm_msg_text))
	set stat = uar_SrvSetDate(hRequest, "action_dt_tm", cnvtdatetime(curdate,curtime3))
	set stat = uar_SrvSetLong(hRequest, "action_tz", curtimezoneapp)
	set stat = uar_SrvSetShort(hRequest, "save_to_chart_ind", genComm_request->save_to_chart_ind)
	set stat = uar_SrvSetDouble(hRequest, "event_cd", genComm_request->event_cd)
	set stat = uar_SrvSetString(hRequest, "broadcast_ident", nullterm(genComm_request->broadcast_ident))
 
	for(i = 1 to num)
		if(portal->patients[i].remove_ind = 0)
			set hPatient = uar_SrvAddItem(hRequest, "patient_recipients")
			set stat = uar_SrvSetDouble(hPatient, "patient_id", portal->patients[i].person_id)
			set stat = uar_SrvSetDouble(hPatient, "encounter_id", portal->patients[i].encounter_id)
			set stat = uar_SrvSetDouble(hPatient, "responsible_prsnl_id", genComm_request->sender_prsnl_id)
		endif
	endfor
 
	set hPatients = uar_SrvGetStruct(hRequest, "patient_recipients")
 
	set stat = uar_SrvExecute(hMsg, hRequest, hReply)
	set reply->message_sent_ind = 1
	
	if (stat > 0)
		set reply->message_sent_ind = 0
		; Destroy the UAR calls
		call uar_SrvDestroyInstance(hReply)
		call uar_SrvDestroyInstance(hRequest)
		
		call PortalFailure(NULL)
	endif
 
	call log_message(build2("Exit SendBroadcastMessages(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end
 
subroutine RealignPatientGroups(NULL)
	call log_message("In RealignPatientGroups()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
	declare letter_cnt = i4 with noconstant(size(reply->letters_patient_group, 5)), protect
	declare portal_cnt = i4 with noconstant(size(portal->patients, 5)), protect
	declare num = i4 with noconstant(0), protect
 
	;alter the list to ensure enough space for the added portal patients
	set stat = alterlist(reply->letters_patient_group, letter_cnt + portal_cnt)
	for(num = 1 to portal_cnt)
		if(portal->patients[num].remove_ind = 1)
			set letter_cnt = letter_cnt + 1
			set reply->letters_patient_group[letter_cnt].person_id = portal->patients[num].person_id
			set reply->letters_patient_group[letter_cnt].encounter_id = portal->patients[num].encounter_id
		endif
	endfor
	;alter the list to the correct size
	set stat = alterlist(reply->letters_patient_group, letter_cnt)
 
	call log_message(build2("Exit RealignPatientGroups(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end
 
subroutine StoreMessage(NULL)
	call log_message("In StoreMessage()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
 
	select into "nl:"
		nextseqnum = seq(LONG_DATA_SEQ, nextval)
	from dual
	detail
		long_blob_id = cnvtreal(nextseqnum)
	with nocounter
 
	set ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
		set failed = 1
		set fail_operation = "StoreMessage"
		call replyFailure("SELECT")
	endif
 
	insert into long_blob l
	set
		l.long_blob_id		= long_blob_id,
		l.long_blob			= genComm_request->comm_msg_text,
		l.active_ind		= 1,
		l.updt_applctx		= reqinfo->updt_applctx,
		l.updt_cnt			= 0,
		l.updt_dt_tm		= cnvtdatetime(curdate,curtime3),
		l.updt_id			= reqinfo->updt_id,
		l.updt_task			= reqinfo->updt_task
	with nocounter
 
	set ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
		set failed = 1
		set fail_operation = "StoreMessage"
		call replyFailure("INSERT")
	endif
 
 
 
	call log_message(build2("Exit StoreMessage(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end
 
subroutine CreateCommunications(NULL)
	call log_message("In CreateCommunications()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
	declare portal_cnt = i4 with noconstant(size(portal->patients, 5)), protect
	declare phone_cnt = i4 with noconstant(size(reply->phone_calls_group, 5)), protect
	declare letter_cnt = i4 with noconstant(size(reply->letters_patient_group, 5)), protect
	declare i = i4 with noconstant(0), protect
	declare j = i4 with noconstant(0), protect
	declare k = i4 with noconstant(0), protect
 
	select into "nl:"
		nextseqnum = seq(DCP_PATIENT_LIST_SEQ, nextval)
	from dual
	detail
		gen_comm_id = cnvtreal(nextseqnum)
	with nocounter
 
	set ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
		set failed = 1
		set fail_operation = "CreateCommunications"
		call replyFailure("SELECT")
	endif
 
	insert into dcp_mp_pl_comm c
	set
		c.active_ind				= 1,
		c.broadcast_ident_uuid		= genComm_request->broadcast_ident,
		c.created_by_prsnl_id		= genComm_request->prsnl_id,
		c.sender_prsnl_id			= genComm_request->sender_prsnl_id,
		c.comm_status_cd			= CREATED_CD,
		c.comm_status_dt_tm			= cnvtdatetime(curdate,curtime3),
		c.comm_subject_cd			= genComm_request->comm_subject_cd,
		c.comm_subject_txt			= genComm_request->comm_subject_text,
		c.dcp_mp_pl_comm_id			= gen_comm_id,
		c.list_id					= genComm_request->list_id,
		c.msg_long_blob_id			= long_blob_id,
		c.updt_applctx				= reqinfo->updt_applctx,
		c.updt_cnt					= 0,
		c.updt_dt_tm				= cnvtdatetime(curdate,curtime3),
		c.updt_id					= reqinfo->updt_id,
		c.updt_task					= reqinfo->updt_task
	with nocounter
 
	set ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
		set failed = 1
		set fail_operation = "CreateCommunications"
		call replyFailure("INSERT")
	endif
 
 
 
	; Update reply to have generate communication ID.
	set reply->broadcast_id = genComm_request->broadcast_ident
 
	for(i = 1 to portal_cnt)
		if(portal->patients[i].remove_ind = 0)
			call StoreCommunication(portal->patients[i].person_id, portal->patients[i].encounter_id, 1)
		endif
	endfor
	for(j = 1 to phone_cnt)
		call StoreCommunication(reply->phone_calls_group[j].person_id, reply->phone_calls_group[j].encounter_id, 0)
	endfor
	for(k = 1 to letter_cnt)
		call StoreCommunication(reply->letters_patient_group[k].person_id, reply->letters_patient_group[k].encounter_id, 2)
	endfor
 
	call log_message(build2("Exit CreateCommunications(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end
 
subroutine CompleteCommunications(NULL)
	call log_message("In CompleteCommunications()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
 
	update into dcp_mp_pl_comm c
	set
		c.comm_status_cd = COMPLETE_CD,
		c.comm_status_dt_tm = cnvtdatetime(curdate,curtime3)
	where
		c.dcp_mp_pl_comm_id = gen_comm_id
	with nocounter
 
	set ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
		set failed = 1
		set fail_operation = "CompleteCommunications"
		call replyFailure("UPDATE")
	endif
 
 
 
	call log_message(build2("Exit CompleteCommunications(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end
 
subroutine StoreCommunication(person_id, encounter_id, comm_flag)
	call log_message("In StoreCommunication()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
	declare comm_patient_id = f8 with noconstant(0)
 
	select into "nl:"
		nextseqnum = seq(DCP_PATIENT_LIST_SEQ, nextval)
	from dual
	detail
		comm_patient_id = cnvtreal(nextseqnum)
	with nocounter
 
	set ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
		set failed = 1
		set fail_operation = "StoreCommunication"
		call replyFailure("SELECT")
	endif
 
	insert into dcp_mp_pl_comm_patient c
	set
		c.active_ind				= 1,
		c.comm_status_cd			= CREATED_CD,
		c.comm_status_dt_tm			= cnvtdatetime(curdate,curtime3),
		c.comm_submitted_dt_tm		= cnvtdatetime(curdate,curtime3),
		c.comm_type_flag			= comm_flag,
		c.dcp_mp_pl_comm_id			= gen_comm_id,
		c.dcp_mp_pl_comm_patient_id	= comm_patient_id,
		c.encntr_id					= encounter_id,
		c.last_updt_prsnl_id		= genComm_request->prsnl_id,
		c.person_id					= person_id,
		c.updt_applctx				= reqinfo->updt_applctx,
		c.updt_cnt					= 0,
		c.updt_dt_tm				= cnvtdatetime(curdate,curtime3),
		c.updt_id					= reqinfo->updt_id,
		c.updt_task					= reqinfo->updt_task
	with nocounter
 
	set ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
		set failed = 1
		set fail_operation = "StoreCommunication"
		call replyFailure("INSERT")
	endif
 
 
	call log_message(build2("Exit StoreCommunication(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end

subroutine PortalFailure(null)
 	call log_message("In PortalFailure()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
	
 
	call log_message(build("Error: EXECUTE - ", trim(ERRMSG)), LOG_LEVEL_ERROR)

	set reply->status_data.status = "Z"
	set reply->status_data.subeventstatus[1].OperationName = "Broadcast Messaging Service"
	set reply->status_data.subeventstatus[1].OperationStatus = "Z"
	set reply->status_data.subeventstatus[1].TargetObjectName = "EXECUTE"
	set reply->status_data.subeventstatus[1].TargetObjectValue = ERRMSG
 
	call CnvtCCLRec(null)
 
	call log_message(build2("Exit ReplyFailure(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end

subroutine ReplyFailure(targetObjName)
	call log_message("In ReplyFailure()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
 
	call log_message(build("Error: ", targetObjName, " - ", trim(ERRMSG)), LOG_LEVEL_ERROR)

	set reply->status_data.status = "F"
	set reply->status_data.subeventstatus[1].OperationName = fail_operation
	set reply->status_data.subeventstatus[1].OperationStatus = "F"
	set reply->status_data.subeventstatus[1].TargetObjectName = targetObjName
	set reply->status_data.subeventstatus[1].TargetObjectValue = ERRMSG
 
	call CnvtCCLRec(null)
 
	call log_message(build2("Exit ReplyFailure(), Elapsed time:",
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
