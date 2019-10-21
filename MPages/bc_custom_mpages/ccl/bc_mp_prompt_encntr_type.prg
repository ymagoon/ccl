drop program bc_mp_prompt_encntr_type go
create program bc_mp_prompt_encntr_type

prompt 
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to. 

with OUTDEV


free record temp
record temp(
	1 rec_cnt = i4
	1 PATIENT_TYPE[*]
		2 CODE_VALUE = f8
		2 DESC	= vc
		)


SELECT INTO "NL:"
	CV1.CODE_VALUE
	,CV1.DESCRIPTION
FROM CODE_VALUE CV1 
WHERE CV1.CODE_SET =  71 AND CV1.ACTIVE_IND = 1 
HEAD REPORT
	rcnt = 0
DETAIL
	rcnt =rcnt + 1
	if(mod(rcnt, 20) = 1)
		stat = alterlist(temp->PATIENT_TYPE, rcnt + 19)
	endif
	
	temp->PATIENT_TYPE[rcnt].CODE_VALUE = cv1.code_value
	temp->PATIENT_TYPE[rcnt].DESC = cv1.description
foot report
	;finalizing recordset
	temp->rec_cnt = rcnt
	stat = alterlist(temp->PATIENT_TYPE, temp->rec_cnt)
WITH  FORMAT

call echojson(temp, $OUTDEV)

end
go

