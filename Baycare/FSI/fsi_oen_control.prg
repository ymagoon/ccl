/*********************************************************************************************
 
  Source file name:   fsi_oen_control.prg
  Object name:        fsi_oen_control
  Author:				      Yitzhak Magoon
 
  Program purpose:    Start and Stop interfaces in CCL
  Executing from:     Ops Job or CCL
  Usage:				      A record structure called requestin must be passed into the program
                      that contains a list of all process ID's that need to be started and stopped.      
 
**********************************************************************************************
*                      GENERATED MODIFICATION CONTROL LOG
**********************************************************************************************
*
* Mod Date        Feature  Engineer          Comment
* --- ----------- -------  --------------    -------------------------------------------------
* 000 09/17/2019      	  Yitzhak Magoon     Initial Release							            	     *
*********************************************************************************************/

drop program fsi_oen_control go
create program fsi_oen_control

/*
requestin record structure passed into program

  record requestin (
    1 process = vc
    1 list[*]
      2 proc_id = vc
)
*/

declare appnum = i4 with constant(1241002)
declare tasknum = i4 with constant(1242003)

declare hApp = i4
declare hTask = i4
declare hReq = i4
declare hReply = i4
declare hStep = i4

declare begin(appnum, tasknum, reqnum) = null
declare build_request(hStep, proc_id) = null
declare output_reply(hStep) = null
declare stop(hStep, hTask, hApp) = null

if (requestin->process = "STOP")
  declare reqnum = i4 with constant(1243297)
  
  call begin(appnum, tasknum, reqnum)
  
  for (x = 1 to size(requestin->list,5))
    call build_request(hStep, requestin->list[x].proc_id)
    set stat = uar_CrmPerform(hStep)
    call output_reply(hStep)
  endfor
  
  call stop(hStep, hTask, hApp)
elseif (requestin->process = "START")
  declare reqnum = i4 with constant(1243298)
  
  call begin(appnum, tasknum, reqnum)
  
  for (x = 1 to size(requestin->list,5))
    call build_request(hStep, requestin->list[x].proc_id)
    set stat = uar_CrmPerform(hStep)
    call output_reply(hStep)
  endfor
  
  call stop(hStep, hTask, hApp)
endif

subroutine begin(appnum, tasknum, reqnum)
  call echo(build("beginning begin subroutine"))
  
  call uar_CrmBeginApp(appnum, hApp)
  call uar_CrmBeginTask(hApp, tasknum, hTask)
  call uar_CrmBeginReq(hTask, "", reqnum, hStep)
  
  return (null)
end

subroutine build_request(hStep, proc_id)
  call echo(build("beginning build_request subroutine"))
  
  set hReq = uar_CrmGetRequest(hStep)
  
  set stat = uar_SrvSetULong(hReq, "proc_id", proc_id)
  set stat = uar_SrvSetUChar(hReq, "cmd_id", 0)
  set stat = uar_SrvSetString(hReq, "user_name", "B134316")
  
  return (null)
end

subroutine output_reply(hStep)
  call echo(build("beginning output_reply subroutine"))
  
  set hReply = uar_CrmGetReply(hStep)
  call echo(build("cmd_info =", uar_SrvGetStringPtr(hReply, "cmd_info")))
  call echo(build("cmd_status=" ,uar_SrvGetLong(hReply, "cmd_status")))
end

subroutine stop(hStep, hTask, hApp)
  call echo("beginning stop subroutine")
  
  call uar_CrmEndReq(hStep)
  call uar_CrmEndTask(hTask)
  call uar_CrmEndApp(hApp)
  
  return (null)
end

end
go

