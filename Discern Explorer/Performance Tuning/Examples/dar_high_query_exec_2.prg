;This program obtains the phone number and/or address for a given type of ;personnel.  The program uses discern dontcare with option which requires
;the use of a dummyT join.  The dummyT join causes multiple executions in 
;Oracle.

drop program dar_high_query_exec_2 go
create program dar_high_query_exec_2

record request(
    1 qual [*]
       2 person_id = f8
       2 address_id = f8
       2 phone_id = f8
) 

 set prsnlTypeCd = 350.00
 set cnt = 0
 
 select into "nl:"
   from prsnl p, 
        phone ph, 
        address a, 
        dummyt d, 
        dummyt d2
   plan p 
        where  p.prsnl_type_cd = prsnlTypeCd      
   join d
   join ph 
        where ph.parent_entity_name = "PERSON"
          and ph.parent_entity_id   = p.person_id
   join d2
   join a 
        where a.parent_entity_name = "PERSON"
          and a.parent_entity_id   = p.person_id
 detail
        cnt  = cnt + 1
        stat = alterlist(request->qual, cnt) 
        request->qual[cnt].person_id  = p.person_id
        request->qual[cnt].address_id = a.address_id
        request->qual[cnt].phone_id   = ph.phone_id                 
   with  outerjoin = d, outerjoin = d2, dontcare = ph  
 call echorecord(request)
 end go

