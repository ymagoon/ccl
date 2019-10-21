drop program mp_dcp_get_demographics:dba go
create program mp_dcp_get_demographics:dba

/**************************************************************
Load demographic information for the specified patients needed
by the Registry Worklist mpage.  This script is intended to be
called by other Registry Worklist scripts which all need to 
return a certain set of demographics
**************************************************************/

/*
record request
(
     1 patients[*]
         2 person_id = f8
)
*/

if (not validate(reply,0))
record reply
(
	1 patients[*]
		2 person_id = f8
		2 rank = i4
		2 last_action_dt_tm = dq8
		2 last_action_desc = vc
		2 name_full_formatted = vc
		2 name_last_key = vc
		2 name_first_key = vc
		2 name_middle_key = vc
		2 birth_dt_tm = vc
		2 birth_date = dq8
		2 birth_tz = i4
		2 deceased_dt_tm = vc
		2 sex_cd = f8
		2 sex_disp = vc
		2 races[*]
			3 race_cd = f8
		2 marital_type_cd = f8
		2 language_cd = f8
		2 language_dialect_cd = f8
		2 confid_level_cd = f8
		2 mrn = vc
		2 home_phone = vc
		2 home_ext = vc
		2 mobile_phone = vc
		2 mobile_ext = vc
		2 work_phone = vc
		2 work_ext = vc
		2 contact_method_cd = f8
%i cclsource:status_block.inc
) with public
endif
%i cclsource:mp_dcp_pl_includes.inc
%i cclsource:mp_script_logging.inc
set modify maxvarlen 52428800 
call log_message("In mp_dcp_get_demographics", LOG_LEVEL_DEBUG)

/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/
declare replyFailure(null) = null

/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
declare loop_cnt = i4 with noconstant(0), protect
declare batch_size = i4 with noconstant(40), protect
declare new_list_size = i4 with noconstant(0), protect
declare cur_list_size = i4 with noconstant(0), protect
declare idx = i4 with noconstant(0)
declare nstart = i4 with noconstant(1)
declare num = i4 with noconstant(0)
declare patient_cnt = i4 with noconstant(0), protect
declare race_cnt = i4 with noconstant(0), protect
declare mrn_CDFmeaning = f8 with constant(uar_get_code_by( "MEANING", 4, "MRN")), public
declare work_phone_cd = f8 with Constant(uar_get_code_by("MEANING",43,"BUSINESS")),protect
declare mobile_phone_cd = f8 with Constant(uar_get_code_by("MEANING",43,"MOBILE")),protect
declare home_phone_cd = f8 with Constant(uar_get_code_by("MEANING",43,"HOME")),protect
declare multi_race_cd = f8 with Constant(uar_get_code_by("MEANING",282,"MULTIPLE")),protect
declare fail_operation = vc
declare failed = i2 with NOCONSTANT(0)
 
declare phoneNumberFormatted = vc with noconstant(""), protect
 
set ERRMSG =  FILLSTRING(132," ")
set ERRCODE = error(ERRMSG,1)
/**************************************************************
; DVDev Start Coding
**************************************************************/

/* Buffer the request */
set cur_list_size = size(request->patients,5)
set loop_cnt = ceil( cnvtreal(cur_list_size) / batch_size)
set new_list_size = loop_cnt * batch_size
set stat = alterlist(request->patients, new_list_size)
 
for (i = cur_list_size+1 to new_list_size)
	set request->patients[i].person_id = request->patients[cur_list_size].person_id
endfor
 

/* Select the demographic information */  
select into "nl:"
from (dummyt d1 with seq = value(loop_cnt)),
	 person p,
	 person_alias pa,
	 person_code_value_r pr,
	 phone ph,
	 person_patient pp
plan d1 where
	initarray(nstart,evaluate(d1.seq,1,1,nstart+batch_size))
join p where
	expand(idx,nstart,nstart+(batch_size-1),p.person_id, request->patients[idx].person_id)
join pa where pa.person_id = outerjoin(p.person_id)
    	and pa.person_alias_type_cd = outerjoin(mrn_CDFmeaning)
    	and pa.active_ind = outerjoin(1)
    	and pa.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		and pa.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
join pr where pr.person_id = outerjoin(p.person_id) and
		pr.code_set = outerjoin(282) and ;282 is the code set for race
		pr.active_ind = outerjoin(1)
join ph where
		ph.parent_entity_name = outerjoin("PERSON")  AND
	    outerjoin(p.person_id) = ph.parent_entity_id AND
	    ph.active_ind = outerjoin(1)  AND
	    ph.beg_effective_dt_tm < outerjoin(cnvtdatetime(curdate,curtime3))  AND
	    ph.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
join pp where
		pp.person_id = outerjoin(p.person_id) AND
		pp.active_ind = outerjoin(1) AND
		pp.beg_effective_dt_tm < outerjoin(cnvtdatetime(curdate,curtime3)) AND
		pp.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
order by p.person_id
		, ph.phone_type_cd
		, ph.phone_type_seq

head report
	patient_cnt = 0

head p.person_id
	patient_cnt = patient_cnt + 1
	race_cnt = 0
	if(mod(patient_cnt,20) = 1)
		stat = alterlist(reply->patients,patient_cnt + 19)
	endif

	reply->patients[patient_cnt].person_id = p.person_id
	reply->patients[patient_cnt].name_full_formatted = p.name_full_formatted
	reply->patients[patient_cnt].name_last_key = p.name_last_key
	reply->patients[patient_cnt].name_first_key = p.name_first_key
	reply->patients[patient_cnt].name_middle_key = p.name_middle_key
	reply->patients[patient_cnt].birth_dt_tm =
		trim(format(cnvtdatetimeutc(datetimezone(p.birth_dt_tm, p.birth_tz),1),'YYYY-MM-DDTHH:MM:SSZ;;Q'), 3)
	if(p.deceased_dt_tm != null)
		reply->patients[patient_cnt].deceased_dt_tm =
			trim(format(cnvtdatetimeutc(datetimezone(p.deceased_dt_tm, p.birth_tz),1),'YYYY-MM-DDTHH:MM:SSZ;;Q'), 3)
	endif
	reply->patients[patient_cnt].birth_date = p.birth_dt_tm
	reply->patients[patient_cnt].birth_tz = p.birth_tz
	reply->patients[patient_cnt].sex_cd = p.sex_cd
	reply->patients[patient_cnt].sex_disp = uar_get_code_display(p.sex_cd)	;is a uar call really needed?
	reply->patients[patient_cnt].marital_type_cd = p.marital_type_cd
	reply->patients[patient_cnt].language_cd = p.language_cd
	reply->patients[patient_cnt].language_dialect_cd = p.language_dialect_cd
	reply->patients[patient_cnt].confid_level_cd = p.confid_level_cd 
	reply->patients[patient_cnt].mrn = pa.alias
	reply->patients[patient_cnt].contact_method_cd = pp.contact_method_cd
	
	if(p.race_cd != multi_race_cd)
 		stat = alterlist(reply->patients[patient_cnt]->races,race_cnt+1)
		reply->patients[patient_cnt]->races[race_cnt+1].race_cd = p.race_cd
	endif
	
	;Hard coded items that should either be overridden or ignored by the calling script
	reply->patients[patient_cnt].rank = 0
	reply->patients[patient_cnt].last_action_dt_tm = cnvtdatetime(curdate,curtime3)
	
head pr.code_value
  if(pr.code_value > 0)
	   race_cnt = race_cnt + 1
	   if(mod(race_cnt,20) = 1)
		  stat = alterlist(reply->patients[patient_cnt]->races,race_cnt + 19)
	   endif
	   reply->patients[patient_cnt]->races[race_cnt].race_cd = pr.code_value
  endif

head ph.phone_type_cd
	phoneNumberFormatted = FormatPhoneNumber(ph.phone_num, ph.phone_format_cd)
	
 	if(ph.phone_type_cd = home_phone_cd)
		reply->patients[patient_cnt].home_phone = phoneNumberFormatted
		reply->patients[patient_cnt].home_ext = ph.extension
	elseif(ph.phone_type_cd = mobile_phone_cd)
		reply->patients[patient_cnt].mobile_phone = phoneNumberFormatted
		reply->patients[patient_cnt].mobile_ext = ph.extension
	elseif(ph.phone_type_cd = work_phone_cd)
		reply->patients[patient_cnt].work_phone = phoneNumberFormatted
 		reply->patients[patient_cnt].work_ext = ph.extension
	endif

foot p.person_id
	stat = alterlist(reply->patients[patient_cnt]->races, race_cnt+1)
	
foot report
	stat = alterlist(reply->patients,patient_cnt)
			
with nocounter

set ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
       set failed = 1
       set fail_operation = "dcp_get_demographics"
       call replyFailure("SELECT")
    endif
    
/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
subroutine replyFailure(targetObjName)
     call log_message("In replyFailure()", LOG_LEVEL_DEBUG)
     declare BEGIN_TIME = f8 with constant(curtime3), private
     
     call log_message(build("Error: ", targetObjName, " - ", trim(ERRMSG)), LOG_LEVEL_ERROR)
 
     rollback
     set reply->status_data.status = "F"
     set reply->status_data.subeventstatus[1].OperationName = fail_operation
     set reply->status_data.subeventstatus[1].OperationStatus = "F"
     set reply->status_data.subeventstatus[1].TargetObjectName = targetObjName
     set reply->status_data.subeventstatus[1].TargetObjectValue = ERRMSG
 
     call log_message(build2("Exit replyFailure(), Elapsed time:",
       cnvtint(curtime3-BEGIN_TIME), "0 ms"), LOG_LEVEL_DEBUG)
 
     go to exit_script
end

#exit_script

end
go

