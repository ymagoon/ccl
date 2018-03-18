;The program obtains phone numbers for a list of persons.  
;Executing the query within a while loop causes high executions in Oracle

drop program dar_high_query_exec_4A go
create program dar_high_query_exec_4A

record request(
    1 Person[*]
	2 person_id = f8
	2 person_name = vc
)

record reply(
    1 Person[*]
	2 person_id = f8
	2 phone_num = vc
	2 person_name = vc	
)
	
set cnt = 0

select into "nl:"
  from person p
detail 
   cnt  = cnt + 1
   stat = alterlist(request->person, cnt)
   request->person[cnt].person_id   = p.person_id
   request->person[cnt].person_name = p.name_full_formatted
  with maxqual(p, 85)

call echorecord(request)
set loop_cnt = 1
set cnt = 0

while (loop_cnt <= size(request->person,5))
  if (request->person[cnt].person_id > 0)
     select into "nl:"
       from phone ph
       plan ph
            where ph.parent_entity_name = "PERSON"
	        and ph.parent_entity_id   = request->Person[loop_cnt].person_id
     detail
	      cnt  = cnt + 1
	      stat = alterlist(reply->person, cnt)
	      reply->person[cnt].person_id   = 
                                     request->Person[loop_cnt].person_id
	      reply->person[cnt].phone_num   = trim(ph.phone_num)
  endif
  set loop_cnt = loop_cnt + 1
endwhile
call echorecord(reply)
end go

