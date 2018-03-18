;The program obtains phone numbers for a list of persons
;Using the dummyT table to traverse through the record structure causes high ;executions.  DummyT table splits the query into multiple queries when ;sending the query to Oracle.

drop program dar_high_query_exec_4B go
create program dar_high_query_exec_4B

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

set cnt = 0

select into "nl:"
  from (dummyt d with seq = value(size(request->Person,5))),
       phone ph
  plan d
  join ph 
       where ph.parent_entity_name = "PERSON"
         and ph.parent_entity_id   = request->Person[d.seq].person_id
detail 
    cnt  = cnt + 1
    stat = alterlist(reply->person, cnt) 
    reply->person[cnt].person_id   = request->Person[d.seq].person_id
    reply->person[cnt].phone_num   = trim(ph.phone_num)
end go

