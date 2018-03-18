/*******************************************************************
 
Report Name: EU All Sites Charges
Report Path:  /mayo/mhprd/prg/1_LM_CHRG_EXCEL
Report Description:  displays all charges for all sites
 
Created by:  Lisa Sword
Created date:  05/2009
 
Modified by:
Modified date:
Modifications:
 
*******************************************************************/
 
drop program 1_LM_CHRG_EXCEL go
create program 1_LM_CHRG_EXCEL
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Start Date" = "CURDATE"
	, "End Date" = "CURDATE"
 
with OUTDEV, startdate, enddate
SET MaxSecs = 300
 
SELECT INTO $OUTDEV
	FACILITY = UAR_GET_CODE_DISPLAY(I.FACILITY_CD)
	, ACCOUNT = I.FIN_NBR
	, NAME = I.PERSON_NAME
	, CHARGE = I.CHARGE_DESCRIPTION
	, I.POSTED_DT_TM "@SHORTDATETIMENOSEC"
	, SERVICE_DATE = I.SERVICE_DT_TM
	, CDM = I.PRIM_CDM
	, I.QUANTITY
	, CHARGE_TYPE = UAR_GET_CODE_DISPLAY(I.CHARGE_TYPE_CD)
	, ACCOUNT_TYPE = UAR_GET_CODE_DISPLAY(I.ENCNTR_TYPE_CD)
	, MED_SERVICE = UAR_GET_CODE_DISPLAY(I.MED_SERVICE_CD)
	, DEPARTMENT = UAR_GET_CODE_DISPLAY(I.ACTIVITY_TYPE_CD)
	, ORDER_TYPE = UAR_GET_CODE_DISPLAY(O.CATALOG_TYPE_CD)
	, C.ORDER_ID
	, C.CHARGE_ITEM_ID
 
FROM
	INTERFACE_CHARGE   I
	, CHARGE   C
	, ORDERS   ORD
	, ORDER_CATALOG   O
 
PLAN I WHERE I.POSTED_DT_TM between cnvtdatetime(concat($startdate, " 23:00:00"))
		and cnvtdatetime(concat($enddate, " 23:00:00"))+1
AND I.FACILITY_CD IN (633867,3186521,3196534,
3196530,3196529,3196528,3196527, 3196532, 3196531,3180507,
3186522,3196533)
;and I.ACTIVITY_TYPE_CD !=705
 
JOIN C where I.CHARGE_ITEM_ID = C.CHARGE_ITEM_ID
JOIN ORD WHERE ORD.ORDER_ID = C.ORDER_ID
JOIN O WHERE O.CATALOG_CD = ORD.CATALOG_CD
 
ORDER BY
	FACILITY
	, I.FIN_NBR
	, I.PRIM_CDM
	, C.ORDER_ID
	, C.CHARGE_ITEM_ID
	, 0
 
WITH NOCOUNTER, SEPARATOR=" ", NULLREPORT , FORMAT, CHECK, TIME= VALUE( MaxSecs )
 
 
END GO
 
