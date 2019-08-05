/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  fsi_rmv_script.prg
 *  Object Name:  fsi_rmv_script
 *
 *  Description:  Child program exectuted by fsi_read_excel. Removes scripts from the OEN_SCRIPT
 *				  table so no longer show up in the list of scripts in Open View. 
 *
 *  ---------------------------------------------------------------------------------------------
 *  Author:         Yitzhak Magoon
 *  Creation Date:  08/02/2019
 *  ---------------------------------------------------------------------------------------------
 *  Mod#    Date          Author               Description & Requestor Information
 *  0	    08/05/2019    Yitzhak Magoon       Initial Release
 *
 *
 *  ---------------------------------------------------------------------------------------------
*/

drop program fsi_rmv_script go
create program fsi_rmv_script

/*
record requestin (
  1 list_0[*]
    2 script_name = vc
)
*/
 
declare appnum = i4 with constant(1241002)
declare tasknum = i4 with constant(1242004)
declare reqnum = i4 with constant(1243211)
 
declare hApp = i4
declare hTask = i4
declare hReq = i4
declare hReply = i4
declare hStep = i4

for (x = 1 to size(requestin->list_0,5))
 
  call uar_CrmBeginApp(appnum, hApp)
  call uar_CrmBeginTask(hApp,tasknum, hTask)
  call uar_CrmBeginReq(hTask,"",reqnum,hStep)
 
  set hReq = uar_CrmGetRequest(hStep)
 
  set stat = uar_SrvSetString(hReq, "sc_name", requestin->list_0[x].script_name)
 
  set stat = uar_CrmPerform(hStep)

;if (stat = 0)
;  set hReply = uar_CrmGetReply(hStep)
;  call echo(build("del_status=",uar_SrvGetShort(hReply,"del_status"))) ;65535
;endif
 
  call uar_CrmEndReq(hStep)
  call uar_CrmEndTask(hTask)
  call uar_CrmEndApp(hApp)
endfor
 
#exit_script
 
end
go
 
