/*~BB~************************************************************************
      *                                                                      *
      *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
      *                              Technology, Inc.                        *
      *       Revision      (c) 1984-1995 Cerner Corporation                 *
      *                                                                      *
      *  Cerner (R) Proprietary Rights Notice:  All rights reserved.         *
      *  This material contains the valuable properties and trade secrets of *
      *  Cerner Corporation of Kansas City, Missouri, United States of       *
      *  America (Cerner), embodying substantial creative efforts and        *
      *  confidential information, ideas and expressions, no part of which   *
      *  may be reproduced or transmitted in any form or by any means, or    *
      *  retained in any storage or retrieval system without the express     *
      *  written permission of Cerner.                                       *
      *                                                                      *
      *  Cerner is a registered mark of Cerner Corporation.                  *
      *                                                                      *
  ~BE~***********************************************************************/

/*****************************************************************************

        Source file name:       MP_DCP_DWL_GET_BEST_ENCNTR.PRG
        Object name:            MP_DCP_DWL_GET_BEST_ENCNTR
        Request #:              -

        Product:                DCP
        Product Team:           POWERCHART
        HNA Version:            500
        CCL Version:            4.0

        Program purpose:        Selects the best encntr for a person id
                                according to DWL-specific criteria.


        Tables read:            ENCOUNTER
                                ENCNTR_PRSNL_RELTN
                                ENCNTR_LOC_HIST
        Tables updated:         -
        Executing from:         MPages

        Special Notes:          -

******************************************************************************/


;~DB~************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *                                                                      *
;    *Mod Date     Engineer        Comment                                  *
;    *--- -------- --------------- ---------------------------------------- *
;     ### 10/07/15 Jonathan Smith  Initial Release                          *
;~DE~************************************************************************


;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************

drop program mp_dcp_dwl_get_best_encntr:dba go
create program mp_dcp_dwl_get_best_encntr:dba

prompt "Output to File/Printer/MINE" ="MINE" ,
"JSON_ARGS:" = ""
with  OUTDEV , JSON_ARGS

%i cclsource:mp_dcp_blob_in_params.inc
set stat = cnvtjsontorec(ExtractParamsFromRequest(request, $JSON_ARGS))

/*
record best_encntr_request
(
	1 persons[*]             (required)
		2 person_id      = f8
	1 providers[*]
		2 provider_id    = f8
	1 epr_reltn_types[*]
		2 reltn_type_cd  = f8
	1 location_cds[*]
		2 location_cd    = f8
	1 encntr_type_cds[*]
		2 encntr_type_cd = f8
)
*/

record reply
(
	1 persons[*]
		2 person_id = f8
		2 encntr_id = f8
%i cclsource:status_block.inc
)

free record patient_encntrs
record patient_encntrs
(
	1 patients[*]
		2 person_id = f8
		2 encntrs[*]
			3 disch_dt_tm    = dq8
			3 encntr_id      = f8
			3 encntr_type_cd = f8
			3 epr
				4 encntr_prsnl_r_cd     = f8
				4 encntr_prsnl_reltn_id = f8
				4 prsnl_person_id       = f8
			3 loc_hist[*]
				4 beg_effective_dt_tm = dq8
				4 end_effective_dt_tm = dq8
				4 loc_nurse_unit_cd   = f8
			3 pre_reg_dt_tm  = dq8
			3 reg_dt_tm      = dq8
			3 weight         = i4
)

free record temp_encntrs
record temp_encntrs
(
	1 encntrs[*]
		2 encntr_id = f8
)

execute dcp_gen_valid_encounters_recs ; generate get valid encounter request record

%i cclsource:mp_script_logging.inc

set modify maxvarlen 52428800
call log_message("In mp_dcp_dwl_get_best_encntr", LOG_LEVEL_DEBUG)

/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/
declare CnvtCCLRec(NULL)                   = NULL
declare DetermineBestEncntr(NULL)          = NULL
declare GetEncntrs(NULL)                   = NULL
declare PrepPatientEncntrs(NULL)           = NULL
declare ReplyFailure(target_obj_name = vc) = NULL
declare ValidateRequest(NULL)              = NULL
declare WeightEncntrs(NULL)                = NULL

/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
declare fail_operation = vc with noconstant(""), private
declare failed_ind     = i2 with noconstant(0),  private

set ERRMSG  = FILLSTRING(132," ")
set ERRCODE = error(ERRMSG,1)

/**************************************************************
; Execution
**************************************************************/
set reply->status_data->status = "Z"
call ValidateRequest(NULL)
call PrepPatientEncntrs(NULL)
call GetEncntrs(NULL)
call WeightEncntrs(NULL)
call DetermineBestEncntr(NULL)

#exit_script

if(failed_ind = 0)
	if(size(reply->persons, 5) > 0 and reply->status_data.status = "Z")
		set reply->status_data.status = "S"
	endif
	call CnvtCCLRec(NULL)
endif

call log_message("Exit mp_dcp_dwl_get_best_encntr", LOG_LEVEL_DEBUG)

/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
subroutine CnvtCCLRec(NULL)
	call log_message("In CnvtCCLRec()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private

	declare strJSON    = vc with noconstant(""), private

	set strJSON = cnvtrectojson(reply)
	set _Memory_Reply_String = strJSON

	call echo(strJSON)

	call log_message(build2("Exit CnvtCCLRec(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end

subroutine DetermineBestEncntr(NULL)
	call log_message("In DetermineBestEncntr()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private

	declare best_encntr_id = f8 with noconstant(0.0), private
	declare encntr_idx     = i4 with noconstant(1),   private
	declare encntr_cnt     = i4 with noconstant(1),   private
	declare person_idx     = i4 with noconstant(1),   private
	declare PERSON_CNT     = i4 with constant(size(patient_encntrs->patients, 5)), private
	declare max_weight     = i4 with noconstant(0),   private

	set stat = alterlist(reply->persons, PERSON_CNT)
	for(person_idx = 1 to PERSON_CNT)
		set encntr_cnt = size(patient_encntrs->patients[person_idx].encntrs, 5)
		set max_weight = -1
		set best_encntr_id = 0.0
		for(encntr_idx = 1 to encntr_cnt)
			if(patient_encntrs->patients[person_idx].encntrs[encntr_idx].weight > max_weight)
				set max_weight     = patient_encntrs->patients[person_idx].encntrs[encntr_idx].weight
				set best_encntr_id = patient_encntrs->patients[person_idx].encntrs[encntr_idx].encntr_id
			endif
		endfor
		if(max_weight < 0)
			set max_weight = 0
		endif
		set reply->persons[person_idx].person_id = patient_encntrs->patients[person_idx].person_id
		set reply->persons[person_idx].encntr_id = best_encntr_id
	endfor

	;call echorecord(reply)

	call log_message(build2("Exit DetermineBestEncntr(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end

subroutine GetEncntrs(NULL)
	call log_message("In GetEncntrs()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private

	declare BATCH_SIZE   = i4 with constant(20),  protect
	declare CANCELLED_CD = f8 with constant(uar_get_code_by("CDF_MEAN", 261, "CANCELLED")), protect
	declare encntr_idx   = i4 with noconstant(0), protect
	declare expand_idx   = i4 with noconstant(1), protect
	declare i            = i4 with noconstant(1), private
	declare j            = i4 with noconstant(1), private
	declare loc_hist_idx = i4 with noconstant(0), protect
	declare loc_val_idx  = i4 with noconstant(0), protect
	declare person_idx   = i4 with noconstant(1), protect
	declare PERSON_CNT   = i4 with constant(size(patient_encntrs->patients, 5)), protect
	declare persons_valid_encntr_cnt = i4 with noconstant(0), protect
	declare temp_encntr_idx            = i4 with noconstant(0), protect
	declare valid_encntr_person_cnt    = i4 with noconstant(0), protect

	set stat = alterlist(gve_request->persons, PERSON_CNT)
	set gve_request->prsnl_id = reqinfo->updt_id
	for(i=1 to PERSON_CNT)
		set gve_request->persons[i].person_id = patient_encntrs->patients[i].person_id
	endfor
	set gve_request->force_encntrs_ind = 1
	execute dcp_get_valid_encounters
		with replace("REQUEST",gve_request)
			 ,replace("REPLY", gve_reply)
			 ,replace("BATCH_SIZE", "GVE_BATCH_SIZE")

	set valid_encntr_person_cnt = size(gve_reply->persons, 5)
	for(i=1 to valid_encntr_person_cnt)
		set persons_valid_encntr_cnt = size(gve_reply->persons[i]->encntrs, 5)
		set stat = alterlist(temp_encntrs->encntrs, size(temp_encntrs->encntrs, 5) + persons_valid_encntr_cnt)
		for(j=1 to persons_valid_encntr_cnt)
			set temp_encntr_idx = temp_encntr_idx + 1
			set temp_encntrs->encntrs[temp_encntr_idx].encntr_id = gve_reply->persons[i].encntrs[j].encntr_id
		endfor
	endfor
	set persons_valid_encntr_cnt = size(temp_encntrs->encntrs, 5)

	select into "nl:"
	from encounter e
		,encntr_prsnl_reltn epr
		,encntr_loc_hist    elh
	plan e
		where expand(expand_idx, 1, persons_valid_encntr_cnt, e.encntr_id, temp_encntrs->encntrs[expand_idx].encntr_id)
			and e.encntr_status_cd != CANCELLED_CD
	join epr
		where epr.encntr_id = outerjoin(e.encntr_id)
			and epr.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
			and epr.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
			and epr.active_ind = outerjoin(1)
	join elh
		where elh.encntr_id = outerjoin(e.encntr_id)
			and elh.loc_nurse_unit_cd > outerjoin(0.0)
			and elh.active_ind = outerjoin(1)
	order by
		e.person_id ASC,
		e.reg_dt_tm DESC,
		e.encntr_id ASC,
		epr.encntr_id ASC,
		elh.loc_nurse_unit_cd ASC
	head e.person_id
		person_idx = locateval(loc_val_idx, 1, PERSON_CNT, e.person_id, patient_encntrs->patients[loc_val_idx].person_id)
		encntr_idx = 0
		stat = alterlist(patient_encntrs->patients[person_idx].encntrs, BATCH_SIZE)
	head e.encntr_id
		loc_hist_idx = 0
		encntr_idx = encntr_idx + 1
		if(mod(encntr_idx, BATCH_SIZE) = 1)
			stat = alterlist(patient_encntrs->patients[person_idx].encntrs, encntr_idx + BATCH_SIZE - 1)
		endif
		stat = alterlist(patient_encntrs->patients[person_idx].encntrs[encntr_idx].loc_hist, BATCH_SIZE - 1)
		patient_encntrs->patients[person_idx].encntrs[encntr_idx].disch_dt_tm    = e.disch_dt_tm
		patient_encntrs->patients[person_idx].encntrs[encntr_idx].encntr_id      = e.encntr_id
		patient_encntrs->patients[person_idx].encntrs[encntr_idx].encntr_type_cd = e.encntr_type_cd
		patient_encntrs->patients[person_idx].encntrs[encntr_idx].pre_reg_dt_tm  = e.pre_reg_dt_tm
		patient_encntrs->patients[person_idx].encntrs[encntr_idx].reg_dt_tm      = e.reg_dt_tm
	head epr.encntr_id
		patient_encntrs->patients[person_idx].encntrs[encntr_idx].epr.encntr_prsnl_reltn_id = epr.encntr_prsnl_reltn_id
		patient_encntrs->patients[person_idx].encntrs[encntr_idx].epr.prsnl_person_id       = epr.prsnl_person_id
		patient_encntrs->patients[person_idx].encntrs[encntr_idx].epr.encntr_prsnl_r_cd     = epr.encntr_prsnl_r_cd
	head elh.loc_nurse_unit_cd
		if(elh.loc_nurse_unit_cd > 0.0)
			loc_hist_idx = loc_hist_idx + 1
			if(mod(loc_hist_idx, BATCH_SIZE) = 1)
				stat = alterlist(patient_encntrs->patients[person_idx].encntrs[encntr_idx].loc_hist, loc_hist_idx + BATCH_SIZE - 1)
			endif
			patient_encntrs->patients[person_idx].encntrs[encntr_idx].loc_hist[loc_hist_idx].loc_nurse_unit_cd   = elh.loc_nurse_unit_cd
			patient_encntrs->patients[person_idx].encntrs[encntr_idx].loc_hist[loc_hist_idx].beg_effective_dt_tm = elh.beg_effective_dt_tm
			patient_encntrs->patients[person_idx].encntrs[encntr_idx].loc_hist[loc_hist_idx].end_effective_dt_tm = elh.end_effective_dt_tm
		endif
	foot e.encntr_id
		stat = alterlist(patient_encntrs->patients[person_idx].encntrs[encntr_idx].loc_hist, loc_hist_idx)
	foot e.person_id
		stat = alterlist(patient_encntrs->patients[person_idx].encntrs, encntr_idx)
	with nocounter, expand=1

	;call echorecord(patient_encntrs)

	call log_message(build2("Exit GetEncntrs(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end

subroutine PrepPatientEncntrs(NULL)
	call log_message("In PrepPatientEncntrs()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private

	declare person_idx = i4 with noconstant(1), protect
	declare PERSON_CNT = i4 with constant(size(best_encntr_request->persons, 5)), protect

	set stat = alterlist(patient_encntrs->patients, PERSON_CNT)
	for(person_idx = 1 to PERSON_CNT)
		set patient_encntrs->patients[person_idx].person_id = best_encntr_request->persons[person_idx].person_id
	endfor

	;call echorecord(patient_encntrs)

	call log_message(build2("Exit PrepPatientEncntrs(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end

subroutine ReplyFailure(target_obj_name)
	call log_message("In ReplyFailure()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private

	call log_message(build("Error: ", target_obj_name, " - ", trim(ERRMSG)), LOG_LEVEL_ERROR)

	rollback
	set reply->status_data.status = "F"
	set reply->status_data.subeventstatus[1].OperationName = fail_operation
	set reply->status_data.subeventstatus[1].OperationStatus = "F"
	set reply->status_data.subeventstatus[1].TargetObjectName = target_obj_name
	set reply->status_data.subeventstatus[1].TargetObjectValue = ERRMSG

	call CnvtCCLRec(NULL)

	call log_message(build2("Exit ReplyFailure(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)

	go to exit_script
end

subroutine ValidateRequest(NULL)
	call log_message("Begin ValidateRequest()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
	declare index = i4 with noconstant(0), private

	if(validate(best_encntr_request->persons) = 0)
		set failed_ind = 1
		set fail_operation = "ValidateRequest"
		call ReplyFailure("persons structure invalid")
	else
		for(index=1 to size(best_encntr_request->persons, 5))
			if(validate(best_encntr_request->persons[index].person_id, 0) = 0)
				set failed_ind = 1
				set fail_operation = "ValidateRequest"
				call ReplyFailure("invalid person_id")
			endif
		endfor
	endif

	if(validate(best_encntr_request->providers) = 1)
		for(index=1 to size(best_encntr_request->providers, 5))
			if(validate(best_encntr_request->providers[index].provider_id, 0) = 0)
				set failed_ind = 1
				set fail_operation = "ValidateRequest"
				call ReplyFailure("invalid provider_id")
			endif
		endfor
	endif

	if(validate(best_encntr_request->epr_reltn_types) = 1)
		for(index=1 to size(best_encntr_request->epr_reltn_types, 5))
			if(validate(best_encntr_request->epr_reltn_types[index].reltn_type_cd, 0) = 0)
				set failed_ind = 1
				set fail_operation = "ValidateRequest"
				call ReplyFailure("invalid reltn_type_cd")
			endif
		endfor
	endif

	if(validate(best_encntr_request->location_cds) = 1)
		for(index=1 to size(best_encntr_request->location_cds, 5))
			if(validate(best_encntr_request->location_cds[index].location_cd, 0) = 0)
				set failed_ind = 1
				set fail_operation = "ValidateRequest"
				call ReplyFailure("invalid location_cd")
			endif
		endfor
	endif

	if(validate(best_encntr_request->encntr_type_cds) = 1)
		for(index=1 to size(best_encntr_request->encntr_type_cds, 5))
			if(validate(best_encntr_request->encntr_type_cds[index].encntr_type_cd, 0) = 0)
				set failed_ind = 1
				set fail_operation = "ValidateRequest"
				call ReplyFailure("invalid encntr_type_cd")
			endif
		endfor
	endif

	call log_message(build2("Exit ValidateRequest(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end

subroutine WeightEncntrs(NULL)
	call log_message("Begin WeightEncntrs()", LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private

	declare PERSON_CNT = i4 with constant(size(patient_encntrs->patients, 5)), private

	declare WEIGHT_NON_DISCHARGE = i4 with constant(32),  private
	declare WEIGHT_LOC_HIST      = i4 with constant(16),  private
	declare WEIGHT_EPR           = i4 with constant(16),  private
	declare WEIGHT_TYPE          = i4 with constant(8),   private
	declare WEIGHT_PRE_REGISTER  = i4 with constant(4),   private
	declare WEIGHT_REGISTER      = i4 with constant(4),   private
	declare WEIGHT_NON_FUTURE    = i4 with constant(2),   private

	declare temp_encntr_weight   = i4 with noconstant(0), private
	declare encntr_idx           = i4 with noconstant(1), protect
	declare encntr_cnt           = i4 with noconstant(1), protect
	declare person_idx           = i4 with noconstant(1), protect
	declare i                    = i4 with noconstant(0), protect
	declare j                    = i4 with noconstant(0), protect
	declare check_encntr_type    = i2 with noconstant(0), protect
	declare num_encntr_types     = i4 with noconstant(0), protect
	declare check_epr            = i4 with noconstant(0), protect
	declare num_single_providers = i4 with noconstant(0), protect
	declare num_reltn_types      = i4 with noconstant(0), protect
	declare num_loc              = i4 with noconstant(0), protect
	declare check_location       = i4 with noconstant(0), protect
	declare loc_hist_cnt         = i4 with noconstant(0), protect

	if(validate(best_encntr_request->encntr_type_cds) = 1)
		set num_encntr_types = size(best_encntr_request->encntr_type_cds, 5)
		if(num_encntr_types > 0)
			set check_encntr_type = 1
		endif
	endif

	if((validate(best_encntr_request->providers) = 1))
		set num_single_providers = size(best_encntr_request->providers, 5)
	endif
	if((num_single_providers > 0) and validate(best_encntr_request->epr_reltn_types) = 1)
		set num_reltn_types = size(best_encntr_request->epr_reltn_types, 5)
		if(num_reltn_types > 0)
			set check_epr = 1
		endif
	endif

	if(validate(best_encntr_request->location_cds) = 1)
		set num_loc = size(best_encntr_request->location_cds, 5)
		if(num_loc > 0)
			set check_location = 1
		endif
	endif

	for(person_idx = 1 to PERSON_CNT) ; For each person.
		set encntr_cnt = size(patient_encntrs->patients[person_idx].encntrs, 5)
		for(encntr_idx = 1 to encntr_cnt) ; For each encounter.
			set temp_encntr_weight = 0

			; Weight non-discharged encounters.
			if(patient_encntrs->patients[person_idx].encntrs[encntr_idx].disch_dt_tm <= 0)
				set temp_encntr_weight = WEIGHT_NON_DISCHARGE
			endif

			; Weight non-future encounters.
			if(patient_encntrs->patients[person_idx].encntrs[encntr_idx].reg_dt_tm > 0
				and patient_encntrs->patients[person_idx].encntrs[encntr_idx].reg_dt_tm <= cnvtdatetime(curdate,curtime)
			)
				set temp_encntr_weight = temp_encntr_weight + WEIGHT_NON_FUTURE
			endif

			; Weight registered encounters.
			if(patient_encntrs->patients[person_idx].encntrs[encntr_idx].reg_dt_tm > 0)
				set temp_encntr_weight = temp_encntr_weight + WEIGHT_REGISTER
			endif

			; Weight pre-registered encounters.
			if(patient_encntrs->patients[person_idx].encntrs[encntr_idx].pre_reg_dt_tm > 0
				and patient_encntrs->patients[person_idx].encntrs[encntr_idx].reg_dt_tm <= 0
			)
				set temp_encntr_weight = temp_encntr_weight + WEIGHT_PRE_REGISTER
			endif

			; Weight type of encounters.
			if(check_encntr_type = 1)
				set i = 0
				if(locateval(i, 1, num_encntr_types, 
					patient_encntrs->patients[person_idx].encntrs[encntr_idx].encntr_type_cd,
					best_encntr_request->encntr_type_cds[i].encntr_type_cd) > 0
				)
					set temp_encntr_weight = temp_encntr_weight + WEIGHT_TYPE
				endif
			endif

			; Weight EPR encounters.
			if(check_epr = 1)
				set i = 0
				set j = 0
				if((locateval(i, 1, num_single_providers,
						patient_encntrs->patients[person_idx].encntrs[encntr_idx].epr.prsnl_person_id,
						best_encntr_request->providers[i].provider_id) > 0)
					and locateval(j, 1, num_reltn_types,
					patient_encntrs->patients[person_idx].encntrs[encntr_idx].epr.encntr_prsnl_r_cd,
					best_encntr_request->epr_reltn_types[j].reltn_type_cd) > 0
				)
					set temp_encntr_weight = temp_encntr_weight + WEIGHT_EPR
				endif
			endif

			; Weight Location encounters.
			if(check_location = 1)
				set i = 0
				set loc_hist_cnt = size(patient_encntrs->patients[person_idx].encntrs[encntr_idx].loc_hist, 5)
				for(j = 0 to loc_hist_cnt)
					if(locateval(i, 1, num_loc,
						patient_encntrs->patients[person_idx].encntrs[encntr_idx].loc_hist[j].loc_nurse_unit_cd,
						best_encntr_request->location_cds[i].location_cd) > 0
					)
						set temp_encntr_weight = temp_encntr_weight + WEIGHT_LOC_HIST
					endif
				endfor
			endif

			; Save encounter weight.
			set patient_encntrs->patients[person_idx].encntrs[encntr_idx].weight = temp_encntr_weight
		endfor
	endfor

	;call echorecord(patient_encntrs)

	call log_message(build2("Exit WeightEncntrs(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
end

end
go
