;This program obtains the encounters for a person regardless of whether
;or not the person has an order.  The discern outerjoin uses a dummyT join 
;which splits the query into multiple executions in Oracle.

drop program dar_high_query_exec_1 go
create program dar_high_query_exec_1 
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
  with outerjoin = d    
end go   

