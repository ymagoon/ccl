drop program 0905_diagnosis_order go
create program 0905_diagnosis_order
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	," Order Id" = 0.0
	," Encounter Id" = 0.0
 
 
with OUTDEV, ordid, encid
 
 
/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/
 
/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
 
IF(VALIDATE(RETVAL, -1) = -1 AND VALIDATE(RETVAL, 0) = 0)
  DECLARE RETVAL = I4
  DECLARE LOG_MESSAGE = VC
  DECLARE LOG_MISC1 = VC
 
ENDIF
  set retval =100
 
/**************************************************************
; DVDev Start Coding
**************************************************************/
 
 
;    Your Code Goes Here
SELECT INTO $OUTDEV
	n.SOURCE_STRING
 
FROM
	orders   o
	, nomenclature   n
	, nomen_entity_reltn   ne
 
Plan O
where o.order_id = $ordid  ; Trigger_orderid
  and o.encntr_id = $encid  ; trigger_encntrid
 
JOIN NE
   WHERE O.ORDER_ID = NE.PARENT_ENTITY_ID
  and ne.parent_entity_name = "ORDERS"
JOIN N
  WHERE ne.nomenclature_id=n.nomenclature_id
  and n.active_ind =1
  and n.source_vocabulary_cd in (
				 SELECT
	cv.code_Value
 
FROM
	code_value   cv
 
where
				     (cv.code_set = 400
				      and cv.cdf_meaning = 'ICD*'))
 
 
Head Report
 
Cnt =0
 
 
				detail
 
 
					Cnt = cnt+1
					retval = 100
					log_misc1 = concat(trim(n.source_string),",@","NEWLINE",log_misc1)
					;CALL ECHO("TESTING FIRST GO")
 
 
 
 
 
 
WITH NOCOUNTER, SEPARATOR=" ", FORMAT
 
 
;Set Log_message = (log_misc1)
		If (cnt > 0)
 
		SET LOG_MESSAGE = BUILD("LIST OF DIAGNOSIS:", LOG_MISC1)
 
 
		Elseif (cnt =0)
 
		Set Log_misc1 = "No Diagnosis Listed"
		Set LOG_MESSAGE = Build("Diagnosis:",log_misc1)
 
		Endif
 
 
 
 
 
;Call Echo(log_Message)
;CALL ECHO(CNT)
end
go
;0905_diagnosis_order "NL:", 1121370197 , 108872172  go
;0905_diagnosis_order "NL:", 1121111245, 108766160  go
