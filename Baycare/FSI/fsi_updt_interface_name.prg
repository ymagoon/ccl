/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  fsi_updt_interface_name.prg
 *  Object Name:  fsi_updt_interface_name
 *
 *  Description:  Child program exectuted by fsi_read_excel. Updates the names on the
 *			      OEN_PROCINFO table for each record passed in the requestin record structure.
 *
 *  ---------------------------------------------------------------------------------------------
 *  Author:         Yitzhak Magoon
 *  Creation Date:  08/19/2019
 *  ---------------------------------------------------------------------------------------------
 *  Mod#    Date          Author               Description & Requestor Information
 *  0	    08/19/2019    Yitzhak Magoon       Initial Release
 *
 *
 *  ---------------------------------------------------------------------------------------------
*/

drop program fsi_updt_interface_name go
create program fsi_updt_interface_name

/*
record requestin (
  1 list_0[*]
    2 proc_name = vc
    2 new_proc_name = vc
    2 interfaceid = vc
)
*/
 
update from oen_procinfo op
  , (dummyt d with seq = value(size(requestin->list_0,5)))
set op.proc_name = requestin->list_0[d.seq].new_proc_name
plan d
join op
  where op.interfaceid = cnvtreal(requestin->list_0[d.seq].interfaceid)
with nocounter
 
commit

end
go

