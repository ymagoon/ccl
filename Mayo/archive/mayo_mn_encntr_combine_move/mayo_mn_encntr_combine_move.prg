/*** Modification log **
Mod     Date     Engineer                      Description
------- -------- ----------------------------- -------------------------------------------------
000     09/19/11 Akcia - SE                   New Report
*/
 
drop program mayo_mn_encntr_combine_move go
create program mayo_mn_encntr_combine_move
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Start Date:" = CURDATE
	, "End Date:" = CURDATE
	, "Facility Selection:" = ""
 
with OUTDEV, STARTDATE, ENDDATE, FACILITY
 
select into "nl:"
from
encntr_combine ec,
encounter e1,
encounter e2,
person p1,
person p2,
code_value c1,
code_value c2
 
plan ec
where ec.updt_dt_tm between cnvtdatetime(cnvtdate(startdt), 0)
                        and cnvtdatetime(cnvtdate(enddt),235959)
  and ec.active_ind = 1
  and ((ec.to_encntr_id in(select e.encntr_id from encounter e where e.encntr_id = ec.to_encntr_id
                               and e.loc_facility_cd = $4))
          or (ec.from_encntr_id in(select e.encntr_id from encounter e where e.encntr_id = ec.from_encntr_id
                               and e.loc_facility_cd = $4)))
	 join e1 where e1.encntr_id = ec.to_encntr_id
	 join e2 where e2.encntr_id = ec.from_encntr_id
   join p1 where p1.person_id = e1.person_id
   join p2 where p2.person_id = e2.person_id
   join c1 where c1.code_value = e1.contributor_system_cd
   join c2 where c2.code_value = e2.contributor_system_cd
 
 
 
 
 
 
 end go
