	
/* !Program: uh_mp_cust_pt_notes_ins */
	drop program uh_mp_cust_pt_notes_ins go
	create program uh_mp_cust_pt_notes_ins
	 
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
		DECLARE rec_count 					= i4 WITH NoConstant(0),Protect
		DECLARE retval 						= vc WITH NoConstant(''),Protect
	/**************************************************************
	; DVDev Start Coding
	**************************************************************/
		SELECT
				c.id
			
		FROM	UNMH.cust_patient_notes c
		
		PLAN c
			WHERE
					c.patient_id = CNVTREAL($PATIENT_ID)
			AND		c.key = $ITEMKEY
		
	
		DETAIL
			rec_count = rec_count + 1
	
		WITH nocounter, separator = " "

		IF (rec_count > 0)
			SET retval = CALLPRG(uh_mp_cust_patient_notes_upd, "MINE", $PATIENT_ID, $ITEMKEY, $NOTES)		
		ELSE
			INSERT 
			INTO 	UNMH.cust_patient_notes c
			SET		c.patient_id = cnvtreal($PATIENT_ID),
					c.key = $ITEMKEY,
					c.notes = $NOTES,
					c.created = cnvtdatetime(curdate, curtime3)
					 
			COMMIT
		ENDIF
	 
	/**************************************************************
	; DVDev DEFINED SUBROUTINES
	**************************************************************/
	RETURN('{"success":true}')
	
	end
	go
