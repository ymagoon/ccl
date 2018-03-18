 
;****************************************************************************
; SUCCESS CODES
;****************************************************************************
declare SUCCESS = i2 with protect, constant(0)
 
 
 
;****************************************************************************
; INVALID REQUEST ERRORS
;****************************************************************************
declare INVALID_PERSON_ID = i2 with protect, constant(1)
declare INVALID_ENCNTR_ID = i2 with protect, constant(2)
declare INVALID_PRINTER_NAME = i2 with protect, constant(3)
 
 
 
;****************************************************************************
; FAILED SCRIPTS
;****************************************************************************
declare FAILED_PATIENT_LOOKUP = i2 with protect, constant(4)
declare FAILED_PRINTER_LOOKUP = i2 with protect, constant(5)
 
 
 
 
;****************************************************************************
; STATUS/ERROR HANDLER
;****************************************************************************
declare StatusHandler("") = NULL
 
subroutine StatusHandler("")
	declare sErrMsg = vc with private
 
	if (errorCode = SUCCESS)
		set reply->status_data.status = "S"
	else
		case (errorCode)
			of (INVALID_PERSON_ID):
				set sErrMsg = "Invalid person_id"
			of (INVALID_ENCNTR_ID):
				set sErrMsg = "Invalid encntr_id"
			of (INVALID_PRINTER_NAME):
				set sErrMsg = "Invalid printer_name"
			of (FAILED_PATIENT_LOOKUP):
				set sErrMsg = "Patient lookup failed"
			of (FAILED_PRINTER_LOOKUP):
				set sErrMsg = "Printer lookup failed"
		endcase
 
		set reply->status_data->status = "F"
	    set reply->status_data->subeventstatus[1]->OperationStatus = "F"
	    set reply->status_data->subeventstatus[1]->TargetObjectValue = sErrMsg
	endif
end
 
 
;****************************************************************************
; CLEANUP RECORD STRUCTURES
;****************************************************************************
declare DestroyRecords("") = NULL
 
subroutine DestroyRecords("")
	if (validate(patientRec))
		free record patientRec
	endif
 
	if (validate(allergy))
		free record allergy
	endif
 
	if (validate(ordersRec))
		free record ordersRec
	endif
end
 
 
 
 
 

