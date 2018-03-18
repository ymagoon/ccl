	
	
/* !Program: uh_mp_cust_pt_tasks_upd */
	drop program uh_mp_cust_pt_tasks_upd go
	create program uh_mp_cust_pt_tasks_upd
	 
	prompt
		"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
		, "id" = ""
		, "details" = ""
		, "due_by" = ""
	 
	with OUTDEV, TASK_ID, DETAILS, DUE_BY
	 
	 
	/**************************************************************
	; DVDev DECLARED VARIABLES
	**************************************************************/
		FREE RECORD	data
		RECORD data (
			1 result
				2 value			= f8
		)
	 
		DECLARE new_id 					= f8 WITH NoConstant(0),Protect
	 
	/**************************************************************
	; DVDev Start Coding
	**************************************************************/
	
		UPDATE
		FROM	UNMH.CUST_PATIENT_TASKS c
		SET		details = $DETAILS,
				due_by = cnvtdatetime($DUE_BY)
		WHERE 	id = CNVTREAL($TASK_ID)
		WITH nocounter
		
		COMMIT
		 
		DECLARE json_reply_string 	= vc WITH protect, noconstant("")
		SET json_reply_string = cnvtrectojson(data)
	 
		;output for the Ext.Direct code
		call echo(json_reply_string)
		RETURN(json_reply_string)
	 
	/**************************************************************
	; DVDev DEFINED SUBROUTINES
	**************************************************************/
	 
	end
	go	
	
