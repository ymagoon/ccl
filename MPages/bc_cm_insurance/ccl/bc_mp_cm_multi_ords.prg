drop program bc_mp_cm_multi_ords go
create program bc_mp_cm_multi_ords

prompt 
	"Output to File/Printer/MINE" = "MINE"
	, "enc_id" = "" 

with OUTDEV, ENC_ID



RECORD Temp 
(
		
	1 REC_CNT = i4
	1 REC[*]
		2 ORDER_NAME = VC
		2 ORDER_DT = VC
		2 ORDER_STATUS = VC
		2 ADMIT_ORD = i2
		2 COMM_TYPE = VC
		
)


/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/

/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
declare CHANGEOSVTOIP_VAR = f8 with Constant(uar_get_code_by("DISPLAYKEY",200,"CHANGEOSVTOIP")),protect
declare CHANGEIPTOOSV_VAR = f8 with Constant(uar_get_code_by("DISPLAYKEY",200,"CHANGEIPTOOSV")),protect
declare ADMITTOOBSERVATIONSTATUS_VAR = 
		f8 with Constant(uar_get_code_by("DISPLAYKEY",200,"ADMITTOOBSERVATIONSTATUS")),protect
declare ADMITTOINPATIENTSTATUS_VAR = 
		f8 with Constant(uar_get_code_by("DISPLAYKEY",200,"ADMITTOINPATIENTSTATUS")),protect
declare ADMITPERCASEMANAGEMENTPROTOCOL_VAR = 
		f8 with Constant(uar_get_code_by("DISPLAYKEY",200,"ADMITPERCASEMANAGEMENTPROTOCOL")),protect
declare ADMITADDITIONALBEDINFO_VAR = 
		f8 with Constant(uar_get_code_by("DISPLAYKEY",200,"ADMITADDITIONALBEDINFO")),protect
declare ADMITTRANSFERDISCHARGE_VAR = 
	f8 with Constant(uar_get_code_by("DISPLAYKEY",6000,"ADMITTRANSFERDISCHARGE")),protect
declare ADMITTOIP_200_VAR = 
	f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 200, "ADMITTOINPATIENT"))
declare PLACEINOBSERVATION_200_VAR  = 
	f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 200, "PLACEINOBSERVATION"))


/**************************************************************
; DVDev Start Coding
**************************************************************/

;    Your Code Goes Here

SELECT DISTINCT INTO "nl:"
FROM ORDERS O,
	 ORDER_ACTION OA
PLAN O 
WHERE O.encntr_id = $ENC_ID
		AND O.catalog_cd IN (ADMITTOOBSERVATIONSTATUS_VAR,
								ADMITTOINPATIENTSTATUS_VAR,
								ADMITPERCASEMANAGEMENTPROTOCOL_VAR,
								ADMITADDITIONALBEDINFO_VAR,
								CHANGEIPTOOSV_VAR,
								CHANGEOSVTOIP_VAR,
								ADMITTOIP_200_VAR,
								PLACEINOBSERVATION_200_VAR)
	 AND O.catalog_type_cd = ADMITTRANSFERDISCHARGE_VAR
JOIN OA
	 WHERE OA.order_id = Outerjoin(O.order_id)
ORDER BY O.order_id, O.orig_order_dt_tm, 0
HEAD REPORT
	CNT = 0
DETAIL
	CNT = CNT + 1
	IF(MOD(CNT, 10) = 1)
		STAT = ALTERLIST(TEMP->REC, CNT + 9)
	ENDIF
	
	TEMP->REC[CNT].ORDER_NAME = TRIM(uar_get_code_display(o.catalog_cd))
	TEMP->REC[CNT].ORDER_DT = FORMAT(O.orig_order_dt_tm, "@SHORTDATETIME")
	TEMP->REC[CNT].ORDER_STATUS  = UAR_get_code_DISPLAY(O.order_status_cd)
	TEMP->REC[CNT].COMM_TYPE = Uar_get_code_display(oa.communication_type_cd)
	IF (O.catalog_cd IN (ADMITTOOBSERVATIONSTATUS_VAR,
								ADMITTOINPATIENTSTATUS_VAR,
								ADMITPERCASEMANAGEMENTPROTOCOL_VAR,
								ADMITADDITIONALBEDINFO_VAR,
								CHANGEIPTOOSV_VAR,
								CHANGEOSVTOIP_VAR,
								ADMITTOIP_200_VAR,
								PLACEINOBSERVATION_200_VAR))
		TEMP->REC[CNT].ADMIT_ORD = 1
	ENDIF				
								
FOOT REPORT
	TEMP->REC_CNT = CNT
	STAT = ALTERLIST(TEMP->REC, CNT)
	
	 
/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
call echojson(TEMP, $OUTDEV) 

end
go

