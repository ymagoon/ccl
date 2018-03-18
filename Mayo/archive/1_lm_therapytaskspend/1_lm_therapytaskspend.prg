/*******************************************************************
Report Name: EU Therapy Tasks not completed
Report Path:  /mayo/mhprd/prg/1_LM_THERAPYTASKSPEND
Report Description: Displays tasks for a particular date range,
					that are not in a completed status
					Published in Explorer Menu
 
Created by:  Lisa Sword
Created date:  06/2009
 
Modified by:
Modified date:
Modifications:
 
*******************************************************************/
 
drop program 1_LM_THERAPYTASKSPEND go
create program 1_LM_THERAPYTASKSPEND
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Start Date" = "SYSDATE"
	, "End Date" = "SYSDATE"
 
with OUTDEV, SDATE, EDATE
 SET MaxSecs = 600
 
SELECT INTO $OUTDEV
	CATALOG_TYPE = UAR_GET_CODE_DISPLAY(T.CATALOG_TYPE_CD)
	, LOCATION = UAR_GET_CODE_DISPLAY(T.LOCATION_CD)
	, ACCOUNT = E.ALIAS
	, PATIENT_NAME = P.NAME_FULL_FORMATTED
	, ORDERABLE = UAR_GET_CODE_DISPLAY(T.CATALOG_CD)
	, TASK_STATUS = UAR_GET_CODE_DISPLAY(T.TASK_STATUS_CD)
	, PROVIDER = UAR_GET_CODE_DISPLAY(T.CHARTED_BY_AGENT_CD) ;place holder for blank row
	, SCHEDULED_DT_TM = T.SCHEDULED_DT_TM "@SHORTDATETIME"
	, UPDATE_DT_TM = T.UPDT_DT_TM "@SHORTDATETIME"
	, ORDER_ID = T.ORDER_ID
 
FROM
	TASK_ACTIVITY   T
	, PERSON   P
	, PRSNL   PR
	, ENCNTR_ALIAS   E
 
PLAN  T
WHERE T.SCHEDULED_DT_TM between cnvtdatetime($SDATE) and cnvtdatetime($EDATE)
		and  T.CATALOG_TYPE_CD IN (3422508,3422510,636078,636080,636071,636074,636080)  ;Therapies catalog type
		AND  T.TASK_STATUS_CD !=419
JOIN P  WHERE T.PERSON_ID = P.PERSON_ID
		AND P.NAME_LAST_KEY != "TESTPATIENT" 								;exclude testpaients
JOIN PR WHERE T.PERFORMED_PRSNL_ID = PR.PERSON_ID
JOIN E  WHERE E.ENCNTR_ID = T.ENCNTR_ID
		AND E.ALIAS_POOL_CD = 683992.00										;FIN for Luther
 
ORDER BY
	PATIENT_NAME
	, ORDERABLE
 
WITH MAXREC = 10000, NOCOUNTER, SEPARATOR=" ", FORMAT, TIME= VALUE( MaxSecs )
 
end
go
 
