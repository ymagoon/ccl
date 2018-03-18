drop program uh_mp_cust_values_upd go
create program uh_mp_cust_values_upd
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "application" = ""
	, "key" = ""
	, "value" = ""
	, "params" = ""
 
with OUTDEV, application, item_key, item_value, params
 
UPDATE 	
FROM	UNMH.cust_values c
SET		c.value = $item_value,
		c.params = $params
WHERE	c.application = $application
AND		c.key = $item_key

COMMIT
 
/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
;set _memory_reply_string = ""
RETURN('{"success":true}')


end
go

