drop program dar_exercise_3 go
create program dar_exercise_3 

;This program obtains all the encounters for the person and if the personnel ;information for the encounter
;is available, it obtains the personnel id and the personnel type.

 record reply(
     1 qual[*]
       2 encntr_id = f8
       2 prsnl_person_id = f8
       2 prsnl_type_cd = f8
)   

set cnt = 0
 
select into "nl:"
  from encounter e,
       dummyt d, 
       encntr_prsnl_reltn epr
  plan e 
       where value(request->person_id) = e.person_id
  join d
  join epr 
       where e.encntr_id = epr.encntr_id
detail
       cnt = cnt + 1
       stat = alterlist(reply->qual,cnt)
       reply->qual[cnt].encntr_id       = e.encntr_id
       reply->qual[cnt].prsnl_person_id = epr.prsnl_person_id 
  with nocounter, outerjoin = d
 
 select into "nl:"
   from (dummyt d with seq = value(size(reply->qual, 5))),
        prsnl p
   plan d 
        where reply->qual[d.seq].prsnl_person_id > 0
   join p 
        where reply->qual[d.seq].prsnl_person_id = p.person_id
 detail 
        reply->qual[d.seq].prsnl_type_cd = p.prsnl_type_cd
   with nocounter
end 
; ;end of dar_exercise_3
go

;Below code can be used to test dar_exercise_3 in DEVTEST environment

free record request go
record request(
    1 person_id = f8
 )go
set request->person_id = 106002 go
dar_exercise_3 go

