/*********************************************************************************************
 
        Source file name:   fsi_orm_generate_scs_net.prg
        Object name:        fsi_orm_generate_scs_net
		Author:				Yitzhak Magoon
 
        Program purpose:    Trigger an SCS_NET ORM^O01 for a provided order_id
		Executing from:     EKM Module Action Template or CCL
		Usage:				If called via CCL, provide 1 parameter - OrderID
							> fsi_orm_generate_scs_net 67890.00 go
							
							If called via the EKM action template EKS_EXEC_CCL_A, do not provide parameters.
							It will automatically pick up the trigger_orderid.         
 
**********************************************************************************************
*                      GENERATED MODIFICATION CONTROL LOG
**********************************************************************************************
*
* Mod Date        Feature  Engineer          Comment
* --- ----------- -------  --------------    -------------------------------------------------
* 000 08/07/2019      	  Yitzhak Magoon    Initial Release								     *
*********************************************************************************************/

drop program fsi_orm_generate_scs_net go
create program fsi_orm_generate_scs_net

free record err
record err (
  1 list[*]
    2 msg = vc
)

;declare subroutines
declare load_orders() = null
declare send_outbound(person_id = f8
				      , encntr_id = f8
				      , subtype = f8
				      , accession = vc
				      , conversation_id = f8
				      , order_id = f8
				      , action_sequence = i2) = null

declare in_orderid = f8 with noconstant(0.0)
declare total_orders = i2

set par_type = reflect(parameter(1,0))

;determine whether script was executed from CCL or EKS
if (par_type = " ")
  if(validate(link_template,0) = 0)
    set in_orderid = trigger_orderid
  else
    set in_orderid = link_orderid
  endif
  
  call echo(build("Received EKM OrderID: ", in_orderid))
else
  set in_orderid = $1
  call echo(build("Received CCL OrderId: ", in_orderid))
endif

execute si_esocallsrtl

call echo("calling load orders...")
call load_orders(0)
call echo("end load orders...")

subroutine load_orders(null)
  call echo("executing load_orders subroutine")
	
  free set ord
  record ord (
    1 list [*]
      2 encntr_id = f8
      2 person_id = f8
      2 order_id = f8
      2 accession = vc
      2 conversation_id = f8
      2 action_sequence = i2
      2 outbound_yn = c1
      2 outbound_ind = i4
  )
	
  set nbr_ords = 1
  set stat = alterlist(ord->list, nbr_ords)
  
  set ord->list[nbr_ords].order_id = in_orderid
  set ord->list[nbr_ords]->outbound_yn = "Y"
  set ord->list[nbr_ords]->outbound_ind = 1	
  
  select into "nl:"
    n.accession
    , n.conversation_id
    , o.person_id
    , o.encntr_id
  from
    netting n
    , orders o
  plan n
    where n.order_id = in_orderid
  join o
    where o.order_id = n.order_id
  head report
    ord->list[nbr_ords].person_id = o.person_id
    ord->list[nbr_ords].encntr_id = o.encntr_id
    ord->list[nbr_ords].accession = n.accession
    ord->list[nbr_ords].conversation_id = n.conversation_id
  with nocounter
  
  call echorecord(ord)
  call echo("Calling SEND_OUTBOUND")
  
  call send_outbound (ord->list[nbr_ords].person_id
  					  ,ord->list[nbr_ords].encntr_id
					  ,ord->list[nbr_ords].person_id
  					  ,ord->list[nbr_ords].accession
  					  ,ord->list[nbr_ords].conversation_id
  					  ,ord->list[nbr_ords].order_id
  					  ,ord->list[nbr_ords].action_sequence)	
  call echo("Returned from SEND_OUTBOUND")
  
  set total_orders = total_orders + nbr_ords
end

subroutine send_outbound(person_id, encntr_id, subtype, accession, conversation_id, order_id, action_sequence)
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
  
  declare dQueueId = f8
  declare err_cnt = i2
  
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
  
  set continue_yn = "Y"
  
  set hReqMsg = uar_SrvSelectMessage(1215001)

  if (hReqMsg = 0)
    set err_cnt = err_cnt + 1
    set stat = alterlist(err->list ,err_cnt)
    set err->list[err_cnt]->msg = "Unable to obtain message for TDB 1215001"
    call destroy_handles(1) return
  endif
  
  set hReqStruct = uar_SrvCreateRequest(hReqMsg)
  
  call uar_SrvDestroyMessage(hReqMsg)
  
  set hMsgStruct = uar_SrvGetStruct(hReqStruct,"message")
  
  ;populate CQMInfo portion of record structure
  set hCqmInfoStruct = uar_SrvGetStruct(hMsgStruct ,"cqminfo")
  
  set contrib_alias = build(conversation_id, "~", accession)
  
  set stat = uar_SrvSetString(hCqmInfoStruct,"AppName" ,"FSIESO")
  set stat = uar_SrvSetString(hCqmInfoStruct,"ContribAlias","SCS_NETTING")
  set stat = uar_SrvSetString(hCqmInfoStruct,"ContribRefnum",contrib_alias)
  set stat = uar_SrvSetDate(hCqmInfoStruct,"ContribDtTm",cnvtdatetime(curdate ,curtime3))
  set stat = uar_SrvSetString(hCqmInfoStruct,"Class","SCS_NET")
  set stat = uar_SrvSetLong(hCqmInfoStruct,"Priority",99)
  set stat = uar_SrvSetString(hCqmInfoStruct,"Type","ORM")
  set stat = uar_SrvSetString(hCqmInfoStruct,"Subtype","O01")
  set stat = uar_SrvSetLong(hCqmInfoStruct,"Verbosity_Flag",0)
  set stat = uar_SrvSetString(hCqmInfoStruct,"subtype_detail",nullterm(trim(cnvtstring(subtype),5)))
  
  ;populate ESOInfo portion of record structure
  set hEsoInfoStruct = uar_SrvGetStruct(hMsgStruct,"ESOInfo")
			
  if (hEsoInfoStruct = 0)
    set continue_yn = "N"
    set err_cnt = err_cnt + 1
    set stat = alterlist(err->list ,err_cnt)
    set err->list[err_cnt]->msg = "%Error -- Retrieving Reply --> ESOInfo"
  endif
  
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
  
  ;TRIGInfo->order_list
  if (continue_yn = "Y")
    set stat = uar_SrvSetDouble(hTrigInfoStruct,"person_id",person_id)
	set stat = uar_SrvSetDouble(hTrigInfoStruct,"encntr_id",encntr_id)
	set stat = uar_SrvSetDouble(hTrigInfoStruct,"conversation_id",conversation_id)
	set stat = uar_SrvSetString(hTrigInfoStruct,"accession_nbr",accession)
	
    set hOrderListStruct = uar_SrvGetStruct(hTrigInfoStruct,"order_list")
 
    if (hOrderListStruct = 0)
      set continue_yn = "N"
      set err_cnt = err_cnt + 1
      set stat = alterlist(err->list,err_cnt)
      set err->list[err_cnt]->msg = "%Error -- Retrieving Reply --> order_list"
    endif
  endif
  
  ;TRIGInfo->order_list
  if (continue_yn = "Y")
    set stat = uar_SrvSetDouble(hOrderListStruct,"order_id",order_id)
    set stat = uar_SrvSetLong(hTransInfoStruct,"action_sequence",0)
  endif
  
  set iSiEsoStatus = 0
  set iSiEsoStatus = uar_SiScriptEsoInsertCqm(hReqStruct,dQueueId)
  
  call echo("ESOSTATUS RETURNED")
  
  if (iSiEsoStatus != EsiEsoSuccess)
    call echo("ESOSTATUS FAILED")
    set continue_yn = "N"
        set err_cnt = err_cnt + 1
        set stat = alterlist(err->list,err_cnt)
        set err->list[err_cnt]->msg =
				build("%Error --Error sending outbound message order_id = ",order_id)
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
  
  call echorecord(err)
  call destroy_handles(1)
end ;end subroutine send_outbound

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

end
go

