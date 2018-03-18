drop program uh_mp_cust_stats_insert go
create program uh_mp_cust_stats_insert
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "id" = ""
	, "session_id" = ""
	, "app_name" = ""
	, "person_id" = ""
	, "detail" = ""
	, "purpose" = ""
 
with OUTDEV, id, session_id, app_name, person_id, detail_text, purpose
 
INSERT 
INTO 	UNMH.cust_stats c
SET		c.id = $id,
		c.session_id = $session_id,
		c.app_name = $app_name,
		c.person_id = cnvtreal($person_id),
		c.detail = $detail_text,
		c.purpose = $purpose
		 
COMMIT
 
/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
set _memory_reply_string = ""
RETURN('{"success":true}')


end
go

