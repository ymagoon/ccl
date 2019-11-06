drop program bc_previous_action go
create program bc_previous_action
 
select into "nl:"
from
  eks_module_audit a
  , eks_module_audit_det d
where a.module_name = $1
  and a.begin_dt_tm > cnvtlookbehind($2)
  and d.module_audit_id = a.rec_id
  and d.person_id != 0
  and d.person_id = trigger_personid
with maxrec = 1
 
if (curqual = 0)
  set log_message = build2("Rule has not been run within the past ",$2, " on this patient.")
  set retval = 100
else
  set log_message = build("Rule has already been run within the past ",$2, " on this patient.")
  set retval = 0
endif
 
end
go
 
