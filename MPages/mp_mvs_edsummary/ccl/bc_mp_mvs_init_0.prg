drop program bc_mp_mvs_init_0 go
create program bc_mp_mvs_init_0

prompt 
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "USERID" = 0
	, "PERSONID" = 0
	, "ENCNTRID" = 0
	, "OPTIONS" = "" 

with OUTDEV, USERID, PERSONID, ENCNTRID, OPTIONS

record initialize(
	1 person_id = f8
	1 encntr_id = f8
	1 user_id = f8
	1 patient_name = vc
	1 mrn = vc
)

set initialize->person_id = $PERSONID
set initialize->encntr_id = $ENCNTRID
set initialize->user_id = $USERID

select into 'nl:'
from person p
plan p
	where p.person_id = $PERSONID
detail
	initialize->patient_name = p.name_full_formatted
with nocounter

select into 'nl:'
from encntr_alias ea
plan ea
	where ea.encntr_id = $ENCNTRID
	and ea.encntr_alias_type_cd = 1079.0
	and ea.active_ind = 1
	and ea.beg_effective_dt_tm < sysdate
	and ea.end_effective_dt_tm > sysdate
detail
	initialize->mrn = ea.alias
with nocounter

call echojson(initialize, $OUTDEV)
end 
go
