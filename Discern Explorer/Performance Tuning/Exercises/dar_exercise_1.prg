drop   program dar_exercise_1 go
create program dar_exercise_1

;This script is retrieving the nomenclature id for
;a given PRINCIPLE_TYPE_CD, SOURCE_VOCABULARY_CD,
;PERSON_ID, and ORGANIZATION_ID.

/*
record request(
  1 person_id       = f8
  1 type_cd         = f8
  1 vocabulary_cd   = f8
  1 organization_id = f8
) with protect go
*/

free record reply
record reply(
  1 qual[*]
    2 nomenclature_id = f8
)

select into "nl:"
  from
       procedure p, nomenclature n, encounter e
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
         and e.organization_id = request->organization_id
  head report
       cnt = 0
detail
       cnt = cnt+1
       stat = alterlist( reply->qual, cnt)
       reply->qual[cnt].nomenclature_id = n.nomenclature_id
  with nocounter

call echorecord( reply)

end 
; end of dar_exercise_1
go

