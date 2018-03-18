drop program uh_mp_cust_values_del go
create program uh_mp_cust_values_del
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "application" = ""
	, "key" = 0
 
with OUTDEV, application, custkey

	DELETE 	
	FROM	UNMH.cust_values c
	WHERE	c.application = $application
	AND		c.key = $custkey
	WITH NOCOUNTER

COMMIT
 
/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
set _memory_reply_string = ""
RETURN('{"success":true}')


end
go

