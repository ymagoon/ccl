/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  si_pyxis_routeby_hl7
 *  Description:  Route Script by Object for Pyxis
 *  Type:         Open Engine Route Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:         R Quack
 *  Library:        ADTADT
 *  Creation Date:  04/13/11
 *  ---------------------------------------------------------------------------------------------
 *  Mod# Date    Author   Description & Requestor Information
 *
 *  ---------------------------------------------------------------------------------------------
*/


; DFT data will route based on outcome of Load Balancing Algorithm using patient lname which
; we coded into the cerner stringlist variable in the mod obj script
; ZPM and QRY data will route to a outbound pharm_load_unload and si_pyxis_outbound Comservers

if (trim(oenobj->CONTROL_GROUP [1]->MSH [1]->message_type->messg_type) in ("ZPM"))
  execute oencpm_msglog build("In ZPM Routing", char(0))
 
  declare out_pid = i4
 
  select p.interfaceid
  from oen_procinfo p
  where cnvtupper(p.proc_name) = "PHARM_LOAD_UNLOAD"
  detail
    out_pid = p.interfaceid
  with nocounter
 
  execute oencpm_msglog build("out_pid = ", out_pid, char(0))
 
  if (out_pid > 0)
    Set stat = alterlist(oenRoute->route_list,1)
    Set oenroute->route_list[1]->r_pid = out_pid
  else
    execute oencpm_msgLog build("Unable to determine ZPM Routing", char(0))
  endif
 
  execute oencpm_msglog build("r_pid = ", oenroute->route_list[1]->r_pid, char(0))
 
elseif (trim(oenobj->CONTROL_GROUP [1]->MSH [1]->message_type->messg_type) in ("QRY"))
  execute oencpm_msglog build("In QRY Routing", char(0))
 
  declare out_pid = i4
 
  select p.interfaceid
  from oen_procinfo p
  where cnvtupper(p.proc_name) = "SI_PYXIS_OUTBOUND"
  detail
    out_pid = p.interfaceid
  with nocounter
 
  execute oencpm_msglog build("out_pid = ", out_pid, char(0))
 
  if (out_pid > 0)
    Set stat = alterlist(oenRoute->route_list,1)
    Set oenroute->route_list[1]->r_pid = out_pid
  else
    execute oencpm_msgLog build("Unable to determine QRY Routing", char(0))
  endif
 
  execute oencpm_msglog build("r_pid = ", oenroute->route_list[1]->r_pid, char(0))
 
endif
 
Set oenstatus->status = 1