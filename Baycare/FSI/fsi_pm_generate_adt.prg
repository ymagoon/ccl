drop program fsi_pm_generate_adt go
create program fsi_pm_generate_adt

/*********************************************************************************************
 
        Source file name:   fsi_pm_send_update.prg
        Object name:        fsi_pm_send_update
		Author:				Yitzhak Magoon
 
        Program purpose:    Trigger an ADT update (A08) for a provided encounter_id
		Executing from:     EKM Module Action Template or CCL
		Usage:				If called via CCL, provide 2 parameters. PersonID, then EncounterID
							> fsi_pm_send_update 12345.00, 67890.00 go
							
							If called via the EKM action template EKS_EXEC_CCL_A, do not provide parameters.
							It will automatically pick up the trigger_personid, and trigger_encntrid.         
 
**********************************************************************************************
*                      GENERATED MODIFICATION CONTROL LOG
**********************************************************************************************
*
* Mod Date        Feature  Engineer          Comment
* --- ----------- -------  --------------    -------------------------------------------------
* 000 08/01/2019      	  Yitzhak Magoon    Initial Release								     *
*********************************************************************************************/

call echo("defining record structures")

free record err
record err (
  1 list[*]
    2 msg = vc
)

free set reply
record reply (
  1 status_data
    2 status = c1
    2 subeventstatus [1 ]
      3 operationname = c15
      3 operationstatus = c1
      3 targetobjectname = c15
      3 targetobjectvalue = vc
)

;declare subroutines
declare send_outbound(person_id = f8, encntr_id = f8, subtype = f8, trigger = vc) = null
declare destroy_handles(idummy = i2) = null
declare load_encounters() = null
declare outbound_messages() = null
declare write_log = null

;declare variables
declare nbr_encntrs = i4 with public, noconstant(0)
declare total_encounters = i4 with public, noconstant(0)
declare err_cnt = i4 with public, noconstant(0)
declare in_personid = f8 with noconstant(0.0)
declare in_encntrid = f8 with noconstant(0.0)

set logfile = concat("cer_temp:", "bc_pmsendupdt", format(curdate,"mmddyy;;d"), ".log")
set par_type = reflect(parameter(1,0))

;determine whether script was executed from CCL or EKS
if (par_type = " ")
  if(validate(link_template,0) = 0)
    set in_personid = trigger_personid
    set in_encntrid = trigger_encntrid
  else
    set in_encntrid = link_encntrid
    set in_personid = link_personid
  endif
  call echo(build("Received EKM PersonID: ", in_personid))
  call echo(build("Received EKM EncounterID: ", in_encntrid))
else
  set in_personid = $1
  set in_encntrid = $2
  call echo(build("Received CCL PersonID: ", in_personid))
  call echo(build("Received CCL EncounterID: ", in_encntrid))
endif
 
;execute si_esocallsrtl
execute si_esocallsrtl

call echo("calling load encounters...")
call load_encounters(0)
call echo("end load encounters...")

call echo("calling write_log...")
call write_log(0)
call echo("end write_log...")

subroutine load_encounters(null)
  call echo("executing load_encounters subroutine")
	
  free set encntr
  record encntr (
    1 list [*]
      2 encntr_id = f8
      2 person_id = f8
      2 organization_id = f8
      2 outbound_yn = c1
      2 encntr_type_cd = f8
      2 outbound_ind = i4
  )
	
  set nbr_encntrs = 1
  set stat = alterlist(encntr->list, nbr_encntrs)
	
  set encntr->list[nbr_encntrs]->person_id = in_personid
  set encntr->list[nbr_encntrs]->encntr_id = in_encntrid
  set encntr->list[nbr_encntrs]->outbound_yn = "Y"
  set encntr->list[nbr_encntrs]->outbound_ind = 1	
  
  call echo("Calling outbound_messages")
  call outbound_messages(0)
  call echo("Returned from outbound_messages")
  
  set total_encounters = total_encounters + nbr_encntrs
end

subroutine outbound_messages(null)
  call echo("executing outbound_messages subroutine")
  call echo("Calling SEND_OUTBOUND")
  
  call send_outbound (encntr->list[nbr_encntrs]->person_id
  					  ,encntr->list[nbr_encntrs]->encntr_id
					  ,encntr->list[nbr_encntrs]->person_id
					  ,"A08")	
  call echo("Returned from SEND_OUTBOUND")
end

subroutine send_outbound(person_id ,encntr_id ,subtype ,trigger)
  call echo("Executing CRMRTL & SRVRTL")
 
  execute crmrtl
  execute srvrtl
			
  declare continue_yn = c1

  declare hApp = i4
  declare hTask = i4
  declare hReq = i4
  declare hReply = i4
  declare hStep = i4
  declare hList = i4
  declare crmStatus = i2

  declare dAllAliasOutbnd = f8 with noconstant(0.0)
		
  if (validate(bDebugSendOutbndSub, -9) = -9)
    declare bDebugSendOutbndSub = i2 with noconstant (false)
  endif
		
  set continue_yn = "Y"
  ;Person Mgmt: Conversation Launcher
  set appnum = 100000
  set tasknum = 100000
  set crmStatus = uar_CrmBeginApp(appnum, hApp)
		
  ;begin the task if the app was started successfully
  if (crmStatus = 0)
    set crmStatus = uar_CrmBeginTask(hApp,tasknum,hTask)
 
    if (crmStatus != 0)
      call echo(build("begintask=",crmStatus))
      call uar_CrmEndApp(hApp)
    endif
  endif
 
  if (crmStatus != 0 or hTask = 0)
    set err_cnt = err_cnt + 1
    set stat = alterlist(err->list,err_cnt)
    set err->list[err_cnt]->msg = "%Error -- Beginning App/Task 100000"
 
    call destroy_handles(1) return
  endif
		
  if (encntr_id != 0.0)
    set action = 201
  else
    set action = 101
  endif
		
  if (hTask != 0)
    set reqnum = 114604 ;PM.GetPersonInfo
    set all_person_aliases = 0
    set crmStatus = uar_CrmBeginReq(hTask,"",reqnum,hStep)
			
    if (crmStatus = 0)
      set hReq = uar_CrmGetRequest(hStep)
      
      set stat = uar_SrvSetDouble(hReq,"person_id",person_id)
      set stat = uar_SrvSetDouble(hReq,"encntr_id",encntr_id)
      set stat = uar_SrvSetShort(hReq,"action" ,action)
      set stat = uar_get_meaning_by_codeset(207902,"allaliasout",1,dAllAliasOutbnd)
				
      if (dAllAliasOutbnd > 0)
        set stat = uar_SrvSetShort(hReq ,"all_person_aliases",1)
      else
        set stat = uar_SrvSetShort(hReq,"all_person_aliases",0 )
      endif
				
      if (bDebugSendOutbndSub)
        call uar_CrmLogMessage(hReq,"pm_req114604.dat")
      endif
		
      set stat = uar_CrmPerform(hStep)
			
      if (stat != 0)
        set continue_yn = "N"
        set err_cnt = err_cnt + 1
        set stat = alterlist(err->list ,err_cnt)
        set err->list[err_cnt]->msg = build("%Error -- Calling Pm_get_patient_data(encntr_id = "
          ,encntr_id,",person_id = ",person_id ,")" )
      endif
				
      set hReply = uar_CrmGetReply(hStep)
		
      if (hReply = 0)
        set continue_yn = "N"
        set err_cnt = err_cnt + 1
        set stat = alterlist(err->list,err_cnt)
        set err->list[err_cnt]->msg = build("%Error -- Pm_get_patient_data Reply (encntr_id = ",
          encntr_id,",person_id = ",person_id ,")")
      endif
		
      if (bDebugSendOutbndSub )
        call uar_CrmLogMessage(hReply,"pm_rep114604.dat")
      endif

      set hPatPersonInfo = uar_SrvGetStruct(hReply,"person")
      set hPatEncntrInfo = uar_SrvGetStruct(hReply,"encounter")
		
      if (hPatPersonInfo = 0)
        set continue_yn = "N"
        set err_cnt = err_cnt + 1
        set stat = alterlist(err->list,err_cnt)
        set err->list[err_cnt]->msg = build ("%Error --Pm_get_patient_data person info(encntr_id = " ,
          encntr_id ," ,person_id = " ,person_id ,")")
      endif
      
    else ;crmStatus = 0, failed to start request
      set continue_yn = "N"
      set err_cnt = err_cnt + 1
      set stat = alterlist(err->list ,err_cnt)
      set err->list[err_cnt]->msg = concat("beginreq=",cnvtstring(crmStatus))
    endif ;end crmStatus=0
  endif ;end task != 0

  if (continue_yn = "Y")
    declare hPersonStruct = i4
    declare hEncntrStruct = i4
    declare hSubPersonStruct = i4
    declare dQueueId = f8
    declare EsiEsoNotCalled = i4 with noconstant(0)
    declare EsiEsoSuccess = i4 with noconstant(1)
    declare EsiEsoSrvExecFail = i4 with noconstant(2)
    declare EsiEsoMemFail = i4 with noconstant(3)
    declare EsiEsoSrvOutMem = i4 with noconstant(4)
    declare EsiEsoCopyFail = i4 with noconstant(5)
    declare EsiEsoCompressFail = i4 with noconstant(6)
    declare EsiEsoScriptFail = i4 with noconstant(7)
    declare EsiEsoInvalidMsg = i4 with noconstant(8)
    declare EsiEsoSrvFail = i4 with noconstant(9)
    declare EsiEsoInvalidAlias = i4 with noconstant(10)
    declare EsiEsoRouteFail = i4 with noconstant(11)
    declare EsiEsoDbFail = i4 with noconstant(12)
    declare EsiEsoGenericErr = i4 with noconstant(13)
 
    set hReqMsg = uar_SrvSelectMessage(1215013)

    if (hReqMsg = 0)
      set err_cnt = err_cnt + 1
      set stat = alterlist(err->list ,err_cnt)
      set err->list[err_cnt]->msg = "Unable to obtain message for TDB 1215013"
      call destroy_handles(1) return
    endif
 
    set hReqStruct = uar_SrvCreateRequest(hReqMsg)
      
    call uar_SrvDestroyMessage(hReqMsg)
 
    set hMsgStruct = uar_SrvGetStruct(hReqStruct,"message")
    set hCqmInfoStruct = uar_SrvGetStruct(hMsgStruct ,"cqminfo")

    set stat = uar_SrvSetString(hCqmInfoStruct,"AppName" ,"FSIESO")
    set stat = uar_SrvSetString(hCqmInfoStruct,"ContribAlias","PM_TRANSACTION")
    set stat = uar_SrvSetString(hCqmInfoStruct,"ContribRefnum","114700")
    set stat = uar_SrvSetDate(hCqmInfoStruct,"ContribDtTm",cnvtdatetime(curdate ,curtime3))
    set stat = uar_SrvSetString(hCqmInfoStruct,"Class","PM_TRANS")
    set stat = uar_SrvSetLong(hCqmInfoStruct,"Priority",99)
    set stat = uar_SrvSetString(hCqmInfoStruct,"Type","ADT")
    set stat = uar_SrvSetString(hCqmInfoStruct,"Subtype",nullterm(trigger))
    set stat = uar_SrvSetLong(hCqmInfoStruct,"Verbosity_Flag",1)
    set stat = uar_SrvSetString(hCqmInfoStruct,"subtype_detail",nullterm(trim(cnvtstring(subtype),5)))

    ;populate ESOInfo portion of record structure
    set hEsoInfoStruct = uar_SrvGetStruct(hMsgStruct,"ESOInfo")
			
    if (hEsoInfoStruct = 0)
      set continue_yn = "N"
      set err_cnt = err_cnt + 1
      set stat = alterlist(err->list ,err_cnt)
      set err->list[err_cnt]->msg = "%Error -- Retrieving Reply --> ESOInfo"
    endif
		
    if (continue_yn = "Y")
      if (not(validate(longlist ,0)))
          record longlist (
            1 qual [4]
            2 val = i4
            2 str = vc
          )
      endif
 
      set longlist->qual[1]->val = 0
      set longlist->qual[1]->str = "person first event"
      
      if (encntr_id != 0.0)
        set longlist->qual[2]->val = 0
      else
        set longlist->qual[2]->val = 1
      endif
 
      set longlist->qual[2]->str = "encntr first event"
 
      if (encntr_id != 0.0)
        set longlist->qual[3]->val = 1
      else
        set longlist->qual[3]->val = 0
      endif
 
      set longlist->qual[3]->str = "encntr event ind"
      set longlist->qual[4]->val = action
      set longlist->qual[4]->str = "action type"
 
      for (x = 1 to 4)
        set hList = uar_SrvAddItem(hEsoInfoStruct,"longlist")
 
        if (hList > 0)
          set stat = uar_SrvSetLong(hList,"lVal",longlist->qual[x]->val)
          set stat = uar_SrvSetString(hList,"StrMeaning",nullterm(longlist->qual[x]->str))
        else
          set continue_yn = "N"
          set err_cnt = err_cnt + 1
          set stat = alterlist(err->list,err_cnt)
          set err->list[err_cnt]->msg = "%Error -- Retrieving Reply --> longList"
          set x = 4
        endif
      endfor
    endif ;end continue_yn = "Y"
			
    ;populate TRIGInfo portion of record structure
    if (continue_yn = "Y")
      set hTrigInfoStruct = uar_SrvGetStruct(hMsgStruct,"TRIGInfo")
 
      if (hTrigInfoStruct = 0)
        set continue_yn = "N"
        set err_cnt = err_cnt + 1
        set stat = alterlist(err->list,err_cnt)
        set err->list[err_cnt]->msg = "%Error -- Retrieving Reply --> triginfo"
      endif
    endif
    ;TRIGInfo->transaction_type
    if (continue_yn = "Y")
      set stat = uar_SrvSetShort(hTrigInfoStruct,"transaction_type",201)
      set hTransInfoStruct = uar_SrvGetStruct(hTrigInfoStruct,"transaction_info")
 
      if (hTransInfoStruct = 0)
        set continue_yn = "N"
        set err_cnt = err_cnt + 1
        set stat = alterlist(err->list,err_cnt)
        set err->list[err_cnt]->msg = "%Error -- Retrieving Reply --> transaction_info"
      endif
    endif	
    ;TRIGInfo->transaction_info
    if (continue_yn = "Y")
      set stat = uar_SrvSetDouble(hTransInfoStruct,"prsnl_id",reqinfo->updt_id)
      set stat = uar_SrvSetLong(hTransInfoStruct,"applctx",reqinfo->updt_applctx)
      set stat = uar_SrvSetLong(hTransInfoStruct,"updt_task",reqinfo->updt_task)
      set stat = uar_SrvSetDate(hTransInfoStruct,"trans_dt_tm",cnvtdatetime(curdate ,curtime3))
      set stat = uar_SrvSetShort(hTransInfoStruct,"print_doc_ind",0)
      ;TRIGInfo->person
      set hPersonStruct = uar_SrvGetStruct(hTrigInfoStruct,"person")

      if (hPersonStruct = 0)
        set continue_yn = "N"
        set err_cnt = err_cnt + 1
        set stat = alterlist(err->list,err_cnt)
        set err->list[err_cnt]->msg = "%Error -- Retrieving Reply --> person"
      endif
      ;TRIGInfo->encounter
      set hEncntrStruct = uar_SrvGetStruct(hTrigInfoStruct,"encounter")
 
      if (hEncntrStruct = 0)
        set continue_yn = "N"
        set err_cnt = err_cnt + 1
        set stat = alterlist(err->list,err_cnt)
        set err->list[err_cnt]->msg = "%Error -- Retrieving Reply --> encounter"
      endif
      ;TRIGInfo->encounter.movement
      set hMovmntStruct = uar_SrvGetStruct(hPatEncntrInfo,"movement")
    endif
			
    ;copy person and encounter info from request 114604 to 1215013
    if (continue_yn = "Y")
      set stat = uar_SrvCopy(hPersonStruct,hPatPersonInfo)
      set stat = uar_SrvCopy(hEncntrStruct,hPatEncntrInfo)
 
      set hSubPersonStruct = uar_SrvGetStruct(hPersonStruct ,"person")
 
      if (hSubPersonStruct = 0)
        set continue_yn = "N"
        set err_cnt = err_cnt + 1
        set stat = alterlist(err->list,err_cnt)
        set err->list[err_cnt]->msg = "%Error -- Retrieving Reply --> person --> person"
      endif
    endif
			
    ;double check person_id is copied correctly
    if (continue_yn = "Y")
      set chk_pid = uar_SrvGetDouble(hSubPersonStruct,"person_id")
 
      if (chk_pid = 0)
        set continue_yn = "N"
        set err_cnt = err_cnt + 1
        set stat = alterlist(err->list ,err_cnt)
        set err->list[err_cnt]->msg = concat("%Error -- Srv Copy Failed Person_id = 0")
      endif
    endif
    
    if (continue_yn = "Y")
      call echo("Contiune Y: UAR_SRVSELECTMESSAGE(1215001)")
      set hMsg = uar_SrvSelectMessage(1215001)
 
      if (hMsg = 0)
        call echo("FAILED: hMsg != 0")
        set err_cnt = err_cnt + 1
        set stat = alterlist(err->list,err_cnt)
        set err->list[err_cnt]->msg = "Unable to obtain message for TDB 1215001"
        call destroy_handles(1) return
      endif
 
      call echo("UAR_SRVSELECTMESSAGE(1215013)")
      set hReqMsg = uar_SrvSelectMessage(1215013)
 
      call echo("uar_SrvCreateReply(hReqMsg)")
      set hReply = uar_SrvCreateReply(hReqMsg)
      call uar_SrvDestroyMessage(hReqMsg)
 
      set iSiEsoStatus = 0
      set iSiEsoStatus = uar_SiScriptEsoCompdtTrig(hReqStruct,dQueueId)
      call echo("ESOSTATUS RETURNED")
 
      if (iSiEsoStatus != EsiEsoSuccess)
        call echo("ESOSTATUS FAILED")
        set continue_yn = "N"
        set err_cnt = err_cnt + 1
        set stat = alterlist(err->list,err_cnt)
        set err->list[err_cnt]->msg =
				build("%Error --Error sending outbound message (encntr_id = ",encntr_id,",person_id = ",person_id,")")
        set err_cnt = err_cnt + 1
        set stat = alterlist(err->list ,err_cnt)
 
        case (iSiEsoStatus)
          of EsiEsoNotCalled:
            set err->list[err_cnt]->msg = "    Si ESO Not Called"
          of EsiEsoSrvExecFail:
            set err->list[err_cnt]->msg = "    ESO SrvExecute returned a status of Fail"
          of EsiEsoMemFail:
            set err->list[err_cnt]->msg = "    ESO Failed to allocate memory for compression buffer"
          of EsiEsoSrvOutMem:
            set err->list[err_cnt]->msg = "    Memory failure occurred in ESO server"
          of EsiEsoCopyFail:
            set err->list[err_cnt]->msg = "    ESO Server Failed to copy trigger to downtime request"
          of EsiEsoCompressFail:
            set err->list[err_cnt]->msg = "    ESO Server Failed to compress trigger"
          of EsiEsoScriptFail:
            set err->list[err_cnt]->msg = "    ESO Script Faile"
          of EsiEsoInvalidMsg:
            set err->list[err_cnt]->msg = "    ESO Missing CQM structure in downtime request"
          of EsiEsoSrvFail:
            set err->list[err_cnt]->msg = "    ESO Failed to set SRV"
          of EsiEsoInvalidAlias:
            set err->list[err_cnt]->msg = "    ESO returned contributor alias invalid"
          of EsiEsoRouteFail:
            set err->list[err_cnt]->msg = "    Routing error occurred within ESO"
          of EsiEsoDbFail:
            set err->list[err_cnt]->msg = "    ESO returned database failure"
          of EsiEsoGenericErr:
            set err->list[err_cnt]->msg = "    Generic Error encountered when calling ESO"
        endcase
      else
        call echo("ESOSTATUS SUCCESS")
      endif
    endif ;if continue_yn = "Y"
  endif ;if continue_yn = "Y"
		
  call destroy_handles(1)
		
end ; *** END Subroutine SEND_OUTBOUND

subroutine destroy_handles(idummy)
  call echo("Calling destroy_handles...")
 
  if (validate(hReply,-999) != -999)
    if (hReply)
      call uar_SrvDestroyInstance(hReply)
      set hReply = 0
    endif
  endif
 
  if (validate(hReqStruct,-999) != -999)
    if (hReqStruct)
      call uar_SrvDestroyInstance(hReqStruct)
      set hReqStruct = 0
    endif
  endif
 
  if (validate(hReq,-999) != -999)
    if (hReq)
      call uar_CrmEndReq(hReq)
      set hReq = 0
    endif
  endif
 
  if (validate(hReqMsg,-999) != -999)
    if (hReqMsg)
      set stat = uar_SrvDestroyMessage(hReqMsg)
      set hReqMsg = 0
    endif
  endif
 
  if (validate(hMsg,-999) != -999)
    if (hMsg)
      set stat = uar_SrvDestroyMessage(hMsg)
      set hMsg = 0
    endif
  endif
 
  if (validate(hStep,-999) != -999)
    if (hStep)
      call uar_CrmEndReq(hStep)
      set hStep = 0
    endif
  endif
 
  if (validate(hTask,-999) != -999)
    if (hTask)
      call uar_CrmEndTask(hTask)
      set hTask = 0
    endif
  endif
 
  if (validate(hApp,-999) != -999)
    if (hApp)
      call uar_crmendapp(hApp)
      set hApp = 0
    endif
  endif
end ; *** end subroutine destroy_handles

subroutine write_log(null)
  set updated_nbr = (total_encounters - err_cnt)
  
  select into value(logfile)
    d.seq
  from (dummyt d)
  head report
    tz = curtimezone
    col 0 "timezone: ", tz
	row + 1
  detail
    if (err_cnt > 0) 
      row + 1
      col 0 "***** Completed with errors *****"
      row + 1

      for (x = 1 to err_cnt)
        col 0 err->list[x ]->msg
        row + 1
      endfor
    else
      if (total_encounters > 0) 
        row + 1
        col 0 "***** Completed successfully *****"
        row + 1
      else 
        row + 1
        col 0 "***** No encounters qualified *****"
        row + 1
      endif
    endif

	row + 1
	col 0 "************************************"
	row + 1
	col 0 "Total qualified encntrs: " ,	total_encounters
	row + 1 
	col 0 "Total number of errors:  " , err_cnt
	row + 1
	col 0 "Total records updated:" , updated_nbr
	row + 2
  with nocounter
END ; *** END Subroutine WRITE_LOG

SET retval = 100
SET log_message = "Success!..."

call echorecord(reply)

end
go

