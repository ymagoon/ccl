/*
* Author: Cerner Corporation
 *  ---------------------------------------------------------------------------------------------
 *  Mod#   Date	        Author            Description & Requestor Information
 *
 *   1:      11/21/2016   S Parimi         RFC # 15124 code update for splitting of messages to ORU_BMGQUEST_ESI server

 *  ---------------------------------------------------------------------------------------------
*/

execute oencpm_msglog build("In STD_QUEST_ROUTE_IN...", char(0))

Declare out_pid=f8
declare res_sz = i4
Set res_sz = size(oenobj->RES_ORU_GROUP, 5)

IF (trim(oenobj->CONTROL_GROUP[1]->MSH[1]->sending_application) = "QUEST_UNMATCH")
  select p.interfaceid
  from oen_procinfo p
  where cnvtupper(p.proc_name) = "ORU_QUEST_OUTPT_UNMATCH_ESI"
  detail
    out_pid = p.interfaceid
  with nocounter 

Set stat = alterlist(oenRoute->route_list,1)
Set oenroute->route_list[1]->r_pid = out_pid
Set oenstatus->status=1

ELSE
  select p.interfaceid
  from oen_procinfo p
  where p.proc_name = "ORU_QUEST_OUTPT_MATCH_ESI"
  detail
    out_pid = p.interfaceid
  with nocounter

Set stat = alterlist(oenRoute->route_list,1)
Set oenroute->route_list[1]->r_pid = out_pid
Set oenroute->route_list[1]->split_cnt = res_sz
Set oenstatus->status=1

ENDIF

execute oencpm_msglog build("r_pid = ", oenroute->route_list[1]->r_pid, char(0))
execute oencpm_msglog build("Out STD_QUEST_ROUTE...", char(0))