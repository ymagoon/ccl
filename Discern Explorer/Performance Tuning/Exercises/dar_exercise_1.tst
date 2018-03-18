;Below code can be used to test dar_exercise_1
free record request go
record request(
  1 person_id = f8
  1 type_cd = f8
  1 vocabulary_cd = f8
  1 organization_id = f8
) with protect go

;;The following select will work to execute the code 
;;in any environment
select into "nl:"
       e.person_id,
       e.organization_id,
       n.principle_type_cd,
       n.source_vocabulary_cd
  from procedure p,
       nomenclature n,
       encounter e
  plan e 
       where e.organization_id > 0
         and e.encntr_id + 0   > 0
  join p 
       where p.encntr_id         = e.encntr_id + 0
         and p.nomenclature_id+0 > 0
  join n 
       where n.nomenclature_id = p.nomenclature_id+0
detail
       request->person_id       = e.person_id
       request->type_cd         = n.principle_type_cd
       request->vocabulary_cd   = n.source_vocabulary_cd
       request->organization_id = e.organization_id
  with nocounter, maxqual(e, 1) go


dar_exercise_1 go
