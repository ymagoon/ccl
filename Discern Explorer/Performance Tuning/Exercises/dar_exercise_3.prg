drop program   dar_exercise_3 go
create program dar_exercise_3 

;This script gets a person's name based on a person_id passed in through the request.  If the  
;person has encounters or allergies for the encounter, the data is stored in the reply record
;structure.

/*
record request(
  1 person_id = f8
 )

record reply(
  1 name_full_formatted   = vc
  1 qual[*]
    2 encntr_id = f8
    2 allergies[*]
       3  allergy_id = f8
)
*/

set cnt = 0

select into "nl:"
  from person p,
       dummyt d, 
       encounter e
  plan p
       where p.person_id = value(request->person_id)
  join d
  join e
       where p.person_id = e.person_id
  order by e.encntr_id
   head report
       reply->name_full_formatted   = p.name_full_formatted
   head e.encntr_id
       cnt = cnt + 1
       stat = alterlist(reply->qual,cnt)
       reply->qual[cnt].encntr_id    = e.encntr_id       
   with nocounter, outerjoin = d
  

 select into "nl:"
   from (dummyt d with seq = size(reply->qual, 5)),
        allergy a
   plan d 
   join a 
        where reply->qual[d.seq].encntr_id = a.encntr_id
   head d.seq
      cnt = 0
 detail 
      cnt = cnt + 1
      stat = alterlist(reply->qual[d.seq].allergies, cnt)
      reply->qual[d.seq].allergies[cnt].allergy_id = a.allergy_id
 with nocounter

call echorecord(reply)

end
;end of dar_exercise_3
go

