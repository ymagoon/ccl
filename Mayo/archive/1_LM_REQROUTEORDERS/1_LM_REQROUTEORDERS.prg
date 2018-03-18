/*******************************************************************
Report Name: EU Req Routes with Orders
Report Path: /mayo/mhprd/prg/1_LM_REQROUTEORDERS
Report Description: Displays req routes and the orders that they
				are attached to.
Created by:  Lisa Sword
Created date:  04/2009
 
Modified by:
Modified date:
Modifications:
 
*******************************************************************/
drop program 1_LM_REQROUTEORDERS go
create program 1_LM_REQROUTEORDERS
prompt
	"Output to File/Printer/MINE" = "MINE"
 
with OUTDEV
 SELECT
WITH NOCOUNTER, SEPARATOR=" ", FORMAT
 
Set MaxSecs = 60
 
SELECT INTO $outdev
	  D.ROUTE_DESCRIPTION
	, ReqFormat = UAR_GET_CODE_DISPLAY(O.REQUISITION_FORMAT_CD)
	, CatalogType = UAR_GET_CODE_DISPLAY(O.CATALOG_TYPE_CD)
	, ActivityType = UAR_GET_CODE_DISPLAY(O.ACTIVITY_TYPE_CD)
	, Primary = O.PRIMARY_MNEMONIC
 
FROM
	ORDER_CATALOG   O
	, DCP_OUTPUT_ROUTE   D
 
PLAN O WHERE O.ACTIVE_IND = 1        AND O.PRINT_REQ_IND = 1
join d where D.DCP_OUTPUT_ROUTE_ID = O.Requisition_Routing_cd
 
ORDER BY
	D.ROUTE_DESCRIPTION
 
WITH MAXREC = 10000, NOCOUNTER, SEPARATOR=" ", FORMAT
 
end
go
 
