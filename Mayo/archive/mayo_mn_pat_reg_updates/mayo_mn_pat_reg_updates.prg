drop program mayo_mn_pat_reg_updates go
create program mayo_mn_pat_reg_updates
 
 
;    *******************************************************************************************************
;    *Mod Date     Engineer      CAB #  Comment                                                            *
;    *--- -------- ------------ ------- ------------------------------------------------------------------ *
;                                                                                                          *
;    * 001 05/14/14 m063907	 	60036   Added CMRN to report                                               *
;~DE~*******************************************************************************************************
 
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Start Date" = CURDATE
	, "End Date" = CURDATE
 
with OUTDEV, start_date, end_date
 
record data (
1 qual[*]
  2 clinic_mrn = vc
  2 pat_name = vc
  2 dob = vc
  2 ssn = vc
  2 state = vc
  2 updt_by = vc
  2 updt_by_name = vc
  2 updt_dt_tm = vc
  2 cmrn = vc			;001
 
)
 
declare pool_cd = f8 with Constant(uar_get_code_by("DESCRIPTION",263,"Clinic MRN")),protect
declare CMRN_cd = f8 with protect, constant(uar_get_code_by("MEANING", 4, "CMRN"))     ;001
 
select into "nl:"
;clinic_mrn = cnvtalias(pa.alias,pa.alias_pool_cd),
;New_Pat_Name = pmt.n_name_formatted,
;Old_Pat_Name = pmt.o_name_formatted,
New_DOB_date = format(pmt.n_birth_dt_tm,"mm/dd/yy;;d") ,
Old_DOB_date = format(pmt.o_birth_dt_tm,"mm/dd/yy;;d")
;New_DOB_time = format(pmt.n_birth_dt_tm,"hh:mm;;d") ,
;Old_DOB_time = format(pmt.o_birth_dt_tm,"hh:mm;;d"),
;New_SSN = pmt.n_ssn,
;Old_SSN = pmt.o_ssn,
;New_State = pmt.n_per_home_addr_state,
;Old_State = pmt.o_per_home_addr_state,
;Updt_By = pl.username,
;Updt_dt_tm = pmt.updt_dt_tm,
;dt = if ((pmt.n_name_formatted != pmt.o_name_formatted))
;       1
;     elseif (pmt.n_birth_dt_tm != pmt.o_birth_dt_tm)
;       2
;     elseif (pmt.n_ssn != pmt.o_ssn)
;       3
;     elseif (pmt.n_per_home_addr_state != pmt.o_per_home_addr_state)
;       4
;     endif
from
pm_transaction pmt,
person_alias pa,
prsnl pl
,person_alias mrn ;001
 
plan pmt
where pmt.activity_dt_tm between cnvtdatetime(cnvtdate($start_date),0) and cnvtdatetime(cnvtdate($end_date),235959)
and not pmt.transaction in ("RBD","ATDS")
and ((pmt.n_name_formatted != pmt.o_name_formatted)
or (pmt.n_birth_dt_tm != pmt.o_birth_dt_tm)
or (pmt.n_ssn != pmt.o_ssn)
or (pmt.n_per_home_addr_state != pmt.o_per_home_addr_state))
 
join pa
where pa.person_id = pmt.o_person_id
  and pa.person_alias_type_cd = 10
  and pa.alias_pool_cd = pool_cd
  and pa.end_effective_dt_tm > sysdate
  and pa.active_ind = 1
 
 join MRN 																				;001
   where mrn.person_id = outerjoin(pmt.o_person_id)										;001
   and mrn.person_alias_type_cd = outerjoin(cmrn_cd)									;001
   and mrn.active_ind = outerjoin(1)													;001
   and mrn.end_effective_dt_tm > outerjoin(sysdate)										;001
 
join pl
where pl.person_id = pmt.updt_id
 
order pmt.n_name_formatted
 
head report
cnt = 0
 
detail
if ((pmt.n_name_formatted != pmt.o_name_formatted)
or (pmt.n_ssn != pmt.o_ssn)
or (pmt.n_per_home_addr_state != pmt.o_per_home_addr_state)
or (New_DOB_date != Old_DOB_date))
	cnt = cnt + 1
	stat = alterlist(data->qual,cnt+1)
	data->qual[cnt]->clinic_mrn = cnvtalias(pa.alias,pa.alias_pool_cd)
	data->qual[cnt]->cmrn = cnvtalias(mrn.alias,mrn.alias_pool_cd)			;001
	data->qual[cnt]->pat_name = pmt.o_name_formatted
	data->qual[cnt]->dob = format(pmt.o_birth_dt_tm,"mm/dd/yyyy hh:mm;;d")
	data->qual[cnt]->ssn = format(pmt.o_ssn,"###-##-####")
	data->qual[cnt]->state = pmt.o_per_home_addr_state
	data->qual[cnt]->updt_by = pl.username
	data->qual[cnt]->updt_by_name = pl.name_full_formatted
	data->qual[cnt]->updt_dt_tm = format(pmt.updt_dt_tm,"mm/dd/yy hh:mm;;d")
 
	cnt = cnt + 1
	data->qual[cnt]->pat_name = pmt.n_name_formatted
	data->qual[cnt]->dob = format(pmt.n_birth_dt_tm,"mm/dd/yyyy hh:mm;;d")
	data->qual[cnt]->ssn = format(pmt.n_ssn,"###-##-####")
	data->qual[cnt]->state = pmt.n_per_home_addr_state
endif
 
 
with nocounter  ;,skipreport = 1, format,separator = " "
;,maxrec = 10000
 
 
 select into $outdev
CMRN = data->qual[d.seq]->cmrn,										;001
Clinic_MRN = data->qual[d.seq]->clinic_mrn,
Pat_Name = substring(1,50,data->qual[d.seq]->pat_name),
DOB = data->qual[d.seq]->dob,
SSN = substring(1,12,data->qual[d.seq]->ssn),
State = data->qual[d.seq]->state,
Update_By = substring(1,20,data->qual[d.seq]->updt_by),
Update_By_Name = substring(1,50,data->qual[d.seq]->updt_by_name),
Update_Date_Time = data->qual[d.seq]->updt_dt_tm
 
from
(dummyt d with seq = size(data->qual,5))
 
 
with format, separator = " "
 
 
 
 
end go
