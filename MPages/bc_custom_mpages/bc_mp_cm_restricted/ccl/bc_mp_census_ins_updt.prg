drop program bc_mp_census_ins_updt go
create program bc_mp_census_ins_updt

prompt 
	"Output to File/Printer/MINE" = "MINE"                   ;* Enter or select the printer or file name to send this report to.
	, "USER TYPE" = 0
	;<<hidden>>"Search Health Plan (Enter * For All)" = ""
	, "HP_CODE" = ""
	, "Reason" = "" 

with OUTDEV, PG, HP, Reason

declare UpdateStatus = vc

	record temp(
	 1 cnt = i4
	     )    ; 589928.00
	     
	SELECT cnt = count(*)
	FROM CUST_CCL_INSURANCE_VIEW CCL
	WHERE CCL.PRSNL_USER_GRP_CD  = cnvtreal($PG) and ccl.HEALTH_PLAN_ALIAS = $HP
	DETAIL
	 temp->cnt = cnt
	WITH FORMAT
	
	IF (temp->cnt < 1) ;record does not exist
	 INSERT INTO CUST_CCL_INSURANCE_VIEW 
	  SET ACTIVE_ID = 1,
	  HEALTH_PLAN_ALIAS = $HP,
	  PRSNL_USER_GRP_CD = cnvtreal($PG),
	  UPDT_APPLCTX = REQINFO -> UPDT_APPLCTX, 
	  UPDT_CNT = 1,
	  UPDT_DT_TM =  CNVTDATETIME(CURDATE, CURTIME),  
	  UPDT_ID = REQINFO -> UPDT_ID, 
	  UPDT_REASON = $REASON
	 WITH NOCOUNTER
 
  IF ( ( CURQUAL > 0 ) )
   COMMIT ;apply the changes if there is a record to update
   SET UpdateStatus = "RECORD WAS INSERTED SUCCESSFULLY"
   
  
  ELSE
   SET UpdateStatus = concat("RECORD WAS NOT INSERTED")
  
  ENDIF
ELSE 
 
  SET UpdateStatus = concat("RECORD ALREADY EXISTS")
ENDIF
SELECT  INTO $OUTDEV 
  HEAD REPORT
 ROW 1 COL 0 UpdateStatus /*show if the status is successful or not */
 
 
WITH NOCOUNTER, Maxrec = 1, SEPARATOR=" ", FORMAT
end
go
 

