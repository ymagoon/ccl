drop program pfi_insert_order_alias go
create program pfi_insert_order_alias
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
 
with OUTDEV
 
set filename = "ccluserdir:order_alias.csv"
set scriptname = "pfi_order_alias_import"
Execute kia_dm_dbimport filename,scriptname,1000,0
 
end
go
 
