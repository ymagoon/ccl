drop program bc_mp_mvs_init_0 go
create program bc_mp_mvs_init_0

;kls 01/03/2013 added patient_name & fin & mrn

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
	1 fin = vc
)

set initialize->person_id = $PERSONID
set initialize->encntr_id = $ENCNTRID
set initialize->user_id = $USERID

select into "nl:"
from encounter e
,person p
,encntr_alias ea

plan e where e.encntr_id = $ENCNTRID
join p where p.person_id = e.person_id
join ea where ea.encntr_id = e.encntr_id
	and ea.encntr_alias_type_cd in (1077, 1079)
	and ea.active_ind = 1
	and ea.end_effective_dt_tm > sysdate
	and ea.beg_effective_dt_tm < sysdate
HEAD REPORT
initialize->patient_name = p.name_full_formatted

DETAIL
if ( ea.encntr_alias_type_cd = 1079 )
	initialize->mrn = ea.alias
else
	initialize->fin = ea.alias
endif

 with nocounter

call echojson(initialize, $OUTDEV)
end 
go
