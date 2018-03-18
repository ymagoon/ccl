

/* !Program: uh_mp_cust_pt_notes_upd */
	drop program uh_mp_cust_pt_notes_upd go
	create program uh_mp_cust_pt_notes_upd
	 
	prompt
		"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
		, "patient_id" = ""
		, "item key" = ""
		, "notes" = ""
	 
	with OUTDEV, PATIENT_ID, ITEMKEY, NOTES
	 
	 
	/**************************************************************
	; DVDev DECLARED SUBROUTINES
	**************************************************************/
	 
	/**************************************************************
	; DVDev DECLARED VARIABLES
	**************************************************************/
	 
	/**************************************************************
	; DVDev Start Coding
	**************************************************************/
		
		UPDATE 	
		FROM	UNMH.cust_patient_notes c
		SET		c.notes = $NOTES,
				c.created = cnvtdatetime(curdate, curtime3)
		WHERE	c.patient_id = cnvtreal($PATIENT_ID)
		AND		c.key = $ITEMKEY
				
		COMMIT
	 
	/**************************************************************
	; DVDev DEFINED SUBROUTINES
	**************************************************************/
	RETURN('{"success":true}')
	 
	end
	go
