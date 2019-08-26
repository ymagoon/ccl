/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  LabCorp_AMB_Route_In
 *  Description:  Labcorp Ambulatory Custom Route Inbound
 *  Type:  Open Engine Custom Route Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:  CERNER
 *  Domain:  BUILD
 *  Creation Date:  July 2016
 *  ---------------------------------------------------------------------------------------------
 *  08/22/16         H Kaczmarczyk    RFC # 13591 Result Modification w/ Orders outbound to LabCorp
* 07/25/19           C Markwardt          Had to update the route due to renaming ESI server names 
 */

execute oencpm_msglog build("In route_in_labcorp...", char(0))

Declare out_pid=f8
declare res_sz = i4
Set res_sz = size(oenobj->RES_ORU_GROUP, 5)

IF (trim(oenobj->CONTROL_GROUP[1]->MSH[1]->sending_application) = "LABCORP_AMB_UNMATCH")
  select p.interfaceid
  from oen_procinfo p
  where cnvtupper(p.proc_name) = "ORU_LCORP_OUTPT_UNMATCH_ESI"
  detail
    out_pid = p.interfaceid
  with nocounter 

Set stat = alterlist(oenRoute->route_list,1)
Set oenroute->route_list[1]->r_pid = out_pid
Set oenstatus->status=1

ELSE
  select p.interfaceid
  from oen_procinfo p
  where p.proc_name = "ORU_LCORP_OUTPT_MATCH_ESI"
  detail
    out_pid = p.interfaceid
  with nocounter

Set stat = alterlist(oenRoute->route_list,1)
Set oenroute->route_list[1]->r_pid = out_pid
Set oenroute->route_list[1]->split_cnt = res_sz
Set oenstatus->status=1

ENDIF


execute oencpm_msglog build("r_pid = ", oenroute->route_list[1]->r_pid, char(0))
execute oencpm_msglog build("In route_in_labcorp...", char(0))