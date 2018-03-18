drop program dar_exercise_1 go
create program dar_exercise_1

;This script is displaying all fields from the PROCEDURE,
;NOMENCLATURE, and ENCOUNTER tables to the displayer for
;a given PRINCIPLE_TYPE_CD, SOURCE_VOCABULARY_CD, and
;PERSON_ID.

/*
record request(
  1 person_id = f8
  1 type_cd = f8
  1 vocabulary_cd = f8
) with protect go
*/
select *
  from
       procedure p,
       nomenclature n,
       encounter e
  plan n 
       where n.principle_type_cd    = request->type_cd
         and n.source_vocabulary_cd = request->vocabulary_cd
         and n.nomenclature_id      > 0
  join p 
       where p.nomenclature_id = n.nomenclature_id 
         and p.encntr_id > 0
  join e 
       where e.encntr_id       = p.encntr_id 
         and e.person_id       = request->person_id
         and e.organization_id = 1
end 
; end of dar_exercise_1
go

;Below code can be used to test dar_exercise_1

record request(
    1 person_id = f8
    1 type_cd = f8
    1 vocabulary_cd = f8
) with protect go

set request->person_id     = 78675 go
set request->type_cd       = 442 go
set request->vocabulary_cd = 416 go
dar_exercise_1 go

