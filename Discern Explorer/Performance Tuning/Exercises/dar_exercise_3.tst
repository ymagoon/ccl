
;Below code can be used to test dar_exercise_3

free record request go
record request(
  1 person_id = f8
) go

free record reply go
record reply(
  1 name_full_formatted   = vc
  1 qual[*]
    2 encntr_id = f8
    2 allergies[*]
       3  allergy_id = f8
) go

;This select can be used to test the exercise in any environment
/*
select
 a.person_id,
 var = count(*)
from 
allergy a 
plan a where a.person_id > 0
group by a.person_id 
order by var 
  detail
      request->person_id       = a.person_id
 
  with nocounter go
*/
set request->person_id       = 18847666.0 go
dar_exercise_3 go

