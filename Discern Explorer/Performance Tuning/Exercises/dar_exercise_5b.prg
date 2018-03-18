drop program dar_exercise_5b go
create program dar_exercise_5b

;this query is returning the encntr_id, prsnl_person_id, and person_id 
;based on the person_id passed in from the record structure

record reply
(1 qual[*]
  2 person_id = f8
  2 encntr_id = f8
  2 prsnl_list[*]
    3 prsnl_person_id = f8
) with protect

declare expand_idx           = i4 with protect, noconstant(0)
declare physician_code_value = f8 with protect, noconstant(0.0)

select into "nl:"
  from code_value c 
  plan c
       where c.code_set = 333 
         and c.display_key = "PHYSICIAN"
  foot report
       physician_code_value = c.code_value
  with nocounter

select into "nl:" 
       p.name_full_formatted
  from encounter e, 
       encntr_prsnl_reltn epr, 
       prsnl p
  plan e 
       where expand(expand_idx, 1, size(request->qual,5), e.person_id, request->qual[expand_idx].person_id)
  join epr 
       where epr.encntr_id = outerjoin(e.encntr_id)
         and epr.encntr_prsnl_r_cd = outerjoin(physician_code_value)
         and epr.expiration_ind = outerjoin(0)
         and epr.active_ind = outerjoin(1)
  join p 
       where p.person_id = outerjoin(epr.updt_id)
 order by e.person_id, e.encntr_id
  head report
       encntr_count = 0
  head e.encntr_id
	   encntr_count = encntr_count+1
	   if (encntr_count > size(reply->qual,5))
	     stat = alterlist(reply->qual, encntr_count+5)
	   endif
	   reply->qual[encntr_count].encntr_id = e.encntr_id
	   reply->qual[encntr_count].person_id = e.person_id
	   prsnl_count = 0
detail
	   if (epr.prsnl_person_id > 0)
	     prsnl_count = prsnl_count+1
	     if (prsnl_count > size(reply->qual[encntr_count].prsnl_list,5))
	       stat = alterlist(reply->qual[encntr_count].prsnl_list, prsnl_count+5)
	     endif
	     reply->qual[encntr_count].prsnl_list[prsnl_count].prsnl_person_id = epr.prsnl_person_id
	   endif
  foot e.encntr_id
       stat = alterlist(reply->qual[encntr_count].prsnl_list, prsnl_count)
  foot report
       stat = alterlist(reply->qual, encntr_count)
  with nocounter

call echorecord(reply)
end
go


