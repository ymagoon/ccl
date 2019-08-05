/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  fsi_read_excel.prg
 *  Object Name:  fsi_read_excel
 *
 *  Description:  Parent program to read csv files and execute child scripts after loading the
 *				  csv file in memory.
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
 
drop program fsi_read_excel go
create program fsi_read_excel
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Select Program to Run" = ""
	, "Delete file after import?" = 0
 
with OUTDEV, scriptname, delete_ind
 
set filename = build("/cerner/cmsftp:",$scriptname,".csv")
 
execute kia_dm_dbimport filename,$scriptname,50000,0
 
if ($delete_ind)
  set path = build("/cerner/cmsftp/",$scriptname,".csv")
  set cmd = build2("rm -rf ", path)
 
  call dcl(cmd, size(cmd),0)
endif
 
end
go
 
