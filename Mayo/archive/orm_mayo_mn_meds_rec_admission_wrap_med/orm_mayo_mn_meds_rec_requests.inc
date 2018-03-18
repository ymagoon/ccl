 
;****************************************************************************
; BUILDING PATIENT REQUEST STRUCTURE
;****************************************************************************
 
/*
	The request structure that is passed to this .inc can be created in 2 ways.
	The first way is by the powerchart framework and the second is by the
	discern expert server.  Depending on how the .inc gets called, the request
	will take on different forms.  If powerchart calls the script, then the request
	will contain the standard request that is shown below.  However, if the discern
	server creates the request, it will be changed and will contain the standard
	request for a discern rule.  The key to this request structure are the n_* and o_*
	fields that designate the new and old values for common values such as
	person_id and encounter_id.  This .inc will determine how the parent script is
	getting called and will populate our internal request based on those findings.
 
 
	POWERCHART REPORT REQUEST
	record request
	(
	  1 output_device = vc
	  1 script_name = vc
	  1 person_cnt = i4
	  1 person[*]
	    2 person_id        = f8
	  1 visit_cnt = i4
	  1 visit[*]
	    2 encntr_id        = f8
	  1 prsnl_cnt = i4
	  1 prsnl[*]
	    2 prsnl_id        = f8
	  1 nv_cnt = i4
	  1 nv[*]
	    2 pvc_name = vc
	    2 pvc_value = vc
	  1 batch_selection = vc
	)
 
*/
 
declare BuildPatientRequest("") = i2
 
subroutine BuildPatientRequest("")
 
;001 	call echo("***  BEGIN - orm_rpt_meds_rec_requests.inc  ***")
 	call echo("***  BEGIN - orm_MAYO_MN_meds_rec_requests.inc  ***")  ;001
 
	if(validate(request->n_person_id))
		if (request->n_encntr_id > 0)
			call echo("***  BEGIN - Locating the closest printer to the patient location.  ***")
 
			declare PRINTER_TYPE_CD = f8 with protect, constant(uar_get_code_by("MEANING", 3000, "PRINTER"))
	 		declare bedPrinter = vc with protect
		 	declare roomPrinter = vc with protect
		 	declare nurseUnitPrinter = vc with protect
		 	declare facilityPrinter = vc with protect
 
			set retval = 100 ;this must be done for the eks monitor to shown this transaction.
			set person_id = request->n_person_id
			set encntr_id = request->n_encntr_id
 
			select
				into "nl:"
			from
				encounter e
				,device_xref dxref
				,device d
				,code_value cv
			plan e
				where e.encntr_id = encntr_id
			join dxref
				where dxref.parent_entity_name = "LOCATION"
				and dxref.parent_entity_id in (e.loc_bed_cd, e.loc_room_cd, e.loc_nurse_unit_cd, e.loc_facility_cd)
				and dxref.usage_type_cd = PRINTER_TYPE_CD
			join d
				where d.device_cd = dxref.device_cd
 			join cv
 				where cv.code_value = dxref.parent_entity_id
 				and cv.code_set = 220
 				and cv.active_ind = 1
 
 			order by cv.cdf_meaning
 
			head cv.cdf_meaning
				if (cv.cdf_meaning = "BED")
					bedPrinter = trim(substring(1, 30, d.name))
				elseif (cv.cdf_meaning = "ROOM")
					roomPrinter = trim(substring(1, 30, d.name))
				elseif (cv.cdf_meaning = "NURSEUNIT" or cv.cdf_meaning = "AMBULATORY")
					nurseUnitPrinter = trim(substring(1, 30, d.name))
				elseif (cv.cdf_meaning = "FACILITY")
					facilityPrinter = trim(substring(1, 30, d.name))
				endif
 
			with nocounter
 
 			call echo(build("Bed printer: ", bedPrinter))
  			call echo(build("Room printer: ", roomPrinter))
  			call echo(build("Nurse Unit printer: ", nurseUnitPrinter))
  			call echo(build("Facility printer: ", facilityPrinter))
 
			if (textlen(bedPrinter) > 0)
				set printer_name = bedPrinter
			elseif (textlen(roomPrinter) > 0)
				set printer_name = roomPrinter
			elseif (textlen(nurseUnitPrinter) > 0)
				set printer_name = nurseUnitPrinter
			elseif (textlen(facilityPrinter) > 0)
				set printer_name = facilityPrinter
			endif
 
			call echo("***  END - Locating the closest printer to the patient location.  ***")
 
		endif
	else
		set encntr_id = request->visit[1].encntr_id
		set printer_name = request->output_device
 
		select into "nl:"
		from encounter e
		where e.encntr_id = encntr_id
		head report
			person_id = e.person_id
		with nocounter
	endif
 
 	if (person_id = 0)
 		return (INVALID_PERSON_ID)
 	endif
 
 	if (encntr_id = 0)
 		return (INVALID_ENCNTR_ID)
 	endif
 
 	if (textlen(printer_name) = 0)
 		return (INVALID_PRINTER_NAME)
 	endif
 
	call echo(build("Person_id:  ", person_id))
	call echo(build("Encntr_id:  ", encntr_id))
	call echo(build("Printer_name:  ", printer_name))
 
 
;001 	call echo("***  END - orm_rpt_meds_rec_requests.inc  ***")
 	call echo("***  END - orm_MAYO_MN_meds_rec_requests.inc  ***")  ;001
 
 	return (SUCCESS)
end
 
 
 
 
 

