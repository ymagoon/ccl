drop program uh_mp_cust_values_ins go
create program uh_mp_cust_values_ins
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "application" = ""
	, "key" = ""
	, "value" = ""
	, "params" = ""
 
with OUTDEV, application, item_key, item_value, params

DECLARE rec_count 					= i4 WITH NoConstant(0),Protect
DECLARE retval 						= vc WITH NoConstant(''),Protect

DELETE
FROM	UNMH.cust_values c
WHERE	c.application 	= $application
AND		c.key 			= $item_key


;DETAIL
;	rec_count = rec_count + 1

;WITH nocounter, separator = " "

;IF (rec_count > 0)
;	SET retval = CALLPRG(uh_mp_cust_values_upd, "MINE", $application, $item_key, $item_value, $params)		
;ELSE
	INSERT 
	INTO 	UNMH.cust_values c
	SET		c.application = $application,
			c.key = $item_key,
			c.value = $item_value,
			c.params = $params
	COMMIT
;ENDIF 
 
/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
set _memory_reply_string = ""
RETURN('{"success":true}')


end
go

