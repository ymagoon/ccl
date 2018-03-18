	
	
/* !Program: uh_mp_cust_pt_tasks_ins */
	drop program uh_mp_cust_pt_tasks_ins go
	create program uh_mp_cust_pt_tasks_ins
	 
	prompt
		"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
		, "patient_id" = ""
		, "owner_id" = ""
		, "title" = ""
		, "details" = ""
		, "due_by" = ""
	 
	with OUTDEV, PATIENT_ID, OWNER_ID, TITLE, DETAILS, DUE_BY
	 
	 
	/**************************************************************
	; DVDev DECLARED SUBROUTINES
	**************************************************************/
	 
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
	  
		insert 
		into 	UNMH.CUST_PATIENT_TASKS set
				patient_id = cnvtreal($PATIENT_ID),
				owner_id = cnvtreal($OWNER_ID),
				title = $TITLE,
				details = $DETAILS,
				due_by = cnvtdatetime($DUE_BY),
				created = cnvtdatetime(curdate, curtime3),
				is_closed = 0
		 
		commit
		 
	RETURN('{"success":true}')
	 
	/**************************************************************
	; DVDev DEFINED SUBROUTINES
	**************************************************************/
	 
	end
	go
