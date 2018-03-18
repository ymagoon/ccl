;This script is performing 3 outerjoins to the PERSON table.  This is 
;inefficient because there is no relationship between the 3 outerjoining 
;tables.  This query should be split in order to reduce the disk reads and 
;buffer gets.

drop   program dar_unnec_queries_3 go
create program dar_unnec_queries_3


select into 'nl:'
  from person p, encounter e, orders o, charge_event ce
  plan p 
       where p.person_id = 610039.00
  join e 
       where e.person_id = outerjoin(p.person_id)
  join o 
       where o.person_id = outerjoin(p.person_id)
  join ce 
       where ce.person_id = outerjoin(p.person_id)
  with nocounter
end go
