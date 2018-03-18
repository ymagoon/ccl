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

;Below code can be used to test dar_exercise_1

record request(
  1 person_id = f8
  1 type_cd = f8
  1 vocabulary_cd = f8
  1 organization_id = f8
) with protect go

;This data is specifically for SOLUTION_ALPHA  11/22/2005
set    request->type_cd         = 1263.0 go
set    request->vocabulary_cd   = 1217.0 go
set    request->person_id       = 590473.0 go
set    request->organization_id = 589743.0 go

dar_exercise_1 go

;;The following select will work to execute the code 
;;in any environment
;select into "nl:"
;       e.person_id,
;       e.organization_id,
;       n.principle_type_cd,
;       n.source_vocabulary_cd
;  from procedure p,
;       nomenclature n,
;       encounter e
;  plan e 
;       where e.organization_id > 0
;         and e.encntr_id + 0   > 0
;  join p 
;       where p.encntr_id         = e.encntr_id + 0
;         and p.nomenclature_id+0 > 0
;  join n 
;       where n.nomenclature_id = p.nomenclature_id+0
;detail
;       request->person_id       = e.person_id
;       request->type_cd         = n.principle_type_cd
;       request->vocabulary_cd   = n.source_vocabulary_cd
;       request->organization_id = e.organization_id
;  with nocounter, maxqual(e, 1) go
;

;dar_exercise_1 go

