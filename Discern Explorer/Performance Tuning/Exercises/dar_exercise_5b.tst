
;this will allow you to run dar_exercise_5b
free set request go
record request
(
  1 qual[*]
    2 person_id = f8
) 
with protect go

select into "nl:"
  from encounter e, 
       encntr_prsnl_reltn epr
  plan e
       where e.person_id > 0
  join epr 
  	   where epr.encntr_id = e.encntr_id
  	     and epr.prsnl_person_id > 0
  	     and epr.encntr_prsnl_r_cd = 656866.0
         and epr.expiration_ind = 0
         and epr.active_ind = 1
  head report
       num = 0
  detail
  	   num = num + 1
  	   stat = alterlist(request->qual, num)
  	   request->qual[num].person_id = e.person_id
  with nocounter, maxqual(e, 65) go
  
dar_exercise_5b go



