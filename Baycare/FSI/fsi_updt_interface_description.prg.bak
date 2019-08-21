/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  fsi_updt_interface_description.prg
 *  Object Name:  fsi_updt_interface_description
 *
 *  Description:  Child program exectuted by fsi_read_excel. Updates the descriptions on the
 *			      OEN_PROCINFO table for each record passed in the requestin record structure.
 *
 *  ---------------------------------------------------------------------------------------------
 *  Author:         Yitzhak Magoon
 *  Creation Date:  08/02/2019
 *  ---------------------------------------------------------------------------------------------
 *  Mod#    Date          Author               Description & Requestor Information
 *  0	    08/02/2019    Yitzhak Magoon       Initial Release
 *
 *
 *  ---------------------------------------------------------------------------------------------
*/
 
drop program fsi_updt_interface_description go
create program fsi_updt_interface_description
 
/*
record requestin (
  1 list_0[*]
    2 interface = vc
    2 interfaceid = vc
    2 description = vc
    2 new_description = vc
)
*/
 
update from oen_procinfo op
  , (dummyt d with seq = value(size(requestin->list_0,5)))
set op.proc_desc = requestin->list_0[d.seq].new_description
plan d
  ;where requestin->list_0[d.seq].description != requestin->list_0[d.seq].new_description
join op
  where op.interfaceid = cnvtreal(requestin->list_0[d.seq].interfaceid)
with nocounter
 
commit
 
end
go
 
