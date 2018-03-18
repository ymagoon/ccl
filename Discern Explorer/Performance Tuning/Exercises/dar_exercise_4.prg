drop program dar_exercise_4a go
create program dar_exercise_4a

;This program find the number of encounters for some persons with atleast one encounter and their allergies.

free record request
record request(
  1 qual[*]
    2 person_id = f8
    2 num_encounters = i4
    2 allergies[*]
      3 allergy_id = f8
      3 substance_type_cd = f8
      3 reaction_class_cd = f8
)
free record allergy
record allergy(
  1 person_id = f8
  1 allergies[*]
    2 allergy_id = f8
    2 substance_type_cd = f8
    2 reaction_class_cd = f8
)

set encntr_cnt = 0
set cnt        = 0

;NOTE:  This select is here to gather test data for the 
; rest of the script.  Please ignore the performance of this select
; when troubleshooting the performance of this exercise.
select into "nl:"
  from person p,
       encounter e
  plan p
       where p.person_id + 0 > 0
  join e
       where e.person_id = p.person_id
 order by p.person_id
  head p.person_id
       cnt        = cnt + 1
       if( mod( cnt, 50) = 1)
         stat       = alterlist(request->qual, cnt+49)  
       endif 
       encntr_cnt = 0
       request->qual[cnt].person_id = p.person_id
 detail 
       encntr_cnt = encntr_cnt + 1
  foot p.person_id
       request->qual[cnt].num_encounters = encntr_cnt
  foot report
       stat = alterlist( request->qual, cnt)
  with nocounter, maxqual(p, 2000)

for (i = 1 to size(request->qual, 5))
  set stat = alterlist(allergy->allergies,0)
  set allergy->person_id = request->qual[i].person_id
  execute dar_exercise_4b 
  set stat = alterlist(request->qual[i].allergies, size(allergy->allergies,5))
  for (j = 1 to size(allergy->allergies, 5))
    set request->qual[i].allergies[j].allergy_id        = allergy->allergies[j].allergy_id
    set request->qual[i].allergies[j].substance_type_cd = allergy->allergies[j].substance_type_cd
    set request->qual[i].allergies[j].reaction_class_cd = allergy->allergies[j].reaction_class_cd
  endfor
endfor

call echorecord(request)

end 
;end of dar_exercise_4a
go



drop program dar_exercise_4b go
create program dar_exercise_4b

;This program obtains the allergy details for a person.
/*
record allergy(
    1  person_id = f8
    1  allergies[*]
       2 allergy_id = f8
       2 substance_type_cd = f8
       2 reaction_class_cd = f8
)
*/

set cnt = 0

select into "nl:" 
  from allergy a
 where a.person_id = allergy->person_id
detail
       cnt  = cnt+ 1
       stat = alterlist(allergy->allergies, cnt)
       allergy->allergies[cnt].allergy_id        = a.allergy_id
       allergy->allergies[cnt].substance_type_cd = a.substance_type_cd
       allergy->allergies[cnt].reaction_class_cd = a.reaction_class_cd 
  with nocounter 

end
;end of dar_exercise_4b
go


