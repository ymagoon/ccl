drop program bc_mp_mvs_problems_21:dba go
create program bc_mp_mvs_problems_21:dba
/**************************************************************************************************
              Purpose: Displays the Problem List
     Source File Name: bc_mp_mvs_problems_21.PRG
              Analyst: MediView Solutions
          Application: PowerChart, SurgiNet
  Execution Locations: 
            Request #: 
      Translated From: 
        Special Notes:
**************************************************************************************************/
/**************************************************************************************************
  Mod  Date            Engineer                Description
   ---  --------------- ----------------------- ------------------------------------------------
    1   08/09/2011      MediView Solutions 	    Initial Release
    2   mm/dd/yyyy      Engineer Name           Initial Release
	3 	mm/dd/yyyy      FirstName LastName      Comments for first modification

**************************************************************************************************/

prompt 
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "USERID" = 0
	, "PERSONID" = 0
	, "ENCNTRID" = 0
	, "OPTIONS" = "" 

with OUTDEV, USERID, PERSONID, ENCNTRID, OPTIONS

RECORD  problem (
	1 encntr_id	= f8
	1 person_id	= f8
	1 cnt = i4	
	1 rec[*]
		2 problem_id = f8
		2 start_dt_tm = vc
		2 desc = vc
)

declare ACTIVE_12030_CV = f8
	with constant(uar_get_code_by("MEANING",12030,"ACTIVE")),protect


set problem->person_id = $PERSONID
set problem->encntr_id = $ENCNTRID

select into 'nl:'
from problem p,
	nomenclature n
plan p
	where p.person_id = $PERSONID
	and p.active_ind = 1
	and p.beg_effective_dt_tm < sysdate
	and p.end_effective_dt_tm > sysdate
	and p.life_cycle_status_cd = ACTIVE_12030_CV
join n
	where n.nomenclature_id  = outerjoin(p.nomenclature_id)
order by p.ranking_cd, n.source_string, p.problem_ftdesc
head p.problem_id
	cnt = problem->cnt + 1
	problem->cnt = cnt
	stat = alterlist(problem->rec, cnt)
	problem->rec[cnt].problem_id = p.problem_id
	problem->rec[cnt].start_dt_tm = format(p.onset_dt_tm, "mm/dd/yyyy;;q")
detail
	if (n.nomenclature_id > 0.0)
		problem->rec[cnt].desc = n.source_string
	else
		problem->rec[cnt].desc = p.problem_ftdesc
	endif
with nocounter

call echojson(problem, $OUTDEV)
end
go
