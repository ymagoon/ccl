/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  fsi_read_excel.prg
 *  Object Name:  fsi_read_excel
 *
 *  Description:  Parent program to read csv files and execute child scripts after loading the
 *				  csv file in memory.
 *
 *				  kia_dm_dbimport is a standard Cerner script used to read csv files
 *				  1. The first parameter is the filename and directory
 *				  2. The second parameter is the name of the script to pass the record structure to
 *				  3. The third parameter is the max record count
 *				  4. The final parameter is the start count
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
 
drop program avh_read_csv go
create program avh_read_csv
 
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
 execute avh_read_csv "MINE", "avh_import_employees", 0 go
