drop program dar_exercise_4a go
create program dar_exercise_4a

;This program find the number of encounters for 100 persons with atleast one encounter and their allergies.

record request(
    1 qual[*]
	2 person_id = f8
	2 num_encounters = i4
	2 allergies[*]
	    3 allergy_id = f8
            3 substance_type_cd = f8
            3 reaction_class_cd = f8
)	
record temp(
    1 person_id = f8
    1 allergies[*]
      2 allergy_id = f8
      2 substance_type_cd = f8
      2 reaction_class_cd = f8
)   

set encntr_cnt = 0
set cnt        = 0

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
  with nocounter, maxqual(p, 100)

for (i = 1 to size(request->qual, 5))
     set stat = alterlist(temp->allergies,0)
     set temp->person_id = request->qual[i].person_id
     execute dar_exercise_4b with replace("REQUEST", temp)
     set stat = alterlist(request->qual[i].allergies, 
                          size(temp->allergies,5))
     for (j = 1 to size(temp->allergies, 5))
         set request->qual[i].allergies[j].allergy_id        = 
                                 temp->allergies[j].allergy_id
         set request->qual[i].allergies[j].substance_type_cd = 
                                 temp->allergies[j].substance_type_cd
         set request->qual[i].allergies[j].reaction_class_cd = 
                                 temp->allergies[j].reaction_class_cd
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
record request(
    1  person_id = f8
    1  allergies[*]
       2 allergy_id = f8
       2 substance_type_cd = f8
       2 reaction_class_cd = f8
)*/

set cnt = 0

select into "nl:" 
  from allergy a
 where a.person_id = request->person_id
detail
       cnt  = cnt+ 1
       stat = alterlist(request->allergies, cnt)
       request->allergies[cnt].allergy_id        = a.allergy_id
       request->allergies[cnt].substance_type_cd = a.substance_type_cd
       request->allergies[cnt].reaction_class_cd = a.reaction_class_cd 
  with nocounter 
end 
;end of dar_exercise_4b
go

;Issue the below code to execute and test dar_exercise_4a
; in DEVTEST environment
;Dar_exercise_4a calls dar_exercise_4b

dar_exercise_4a go

