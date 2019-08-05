/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  fsi_updt_script_description.prg
 *  Object Name:  fsi_updt_script_description
 *
 *  Description:  Child program exectuted by fsi_read_excel. Updates the descriptions on the
 *			      OEN_SCRIPT table for each record passed in the requestin record structure.
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
 
drop program fsi_updt_script_description go
create program fsi_updt_script_description
 
/*
record requestin (
  1 list_0[*]
    2 script_name = vc
    2 description = vc
    2 new_description = vc
)
*/
 
update from oen_script os
  , (dummyt d with seq = value(size(requestin->list_0,5)))
set os.script_desc = requestin->list_0[d.seq].new_description
plan d
join os
  where cnvtupper(os.script_name) = cnvtupper(requestin->list_0[d.seq].script_name)
with nocounter
 
commit
 
end
go
 
