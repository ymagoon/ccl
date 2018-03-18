;This program obtains all encounters of a given person without any orders.  
;The discern dontexist with option requires the use of a dummyT join.  The ;dummyT join causes multiple executions in Oracle.


drop program dar_high_query_exec_3 go
create program dar_high_query_exec_3

record request(
    1 person_id = f8
 )	
 set request->person_id = 106002
 select into "nl:"
   p.person_id, e.encntr_id, o.order_id
     from person p,
          encounter e,
           dummyt d,
           orders o
 plan p
     where p.person_id = request->person_id 
 join e
     where e.person_id = p.person_id
 join d
 join o
     where o.encntr_id = e.encntr_id
 with outerjoin = d, dontexist  
end go  

