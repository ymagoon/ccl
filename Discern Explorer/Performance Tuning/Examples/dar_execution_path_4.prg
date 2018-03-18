
;This query will use the ORDER_STATUS_CD as the index for the join to the 
;ORDERS table.  The PERSON_ID is a much better index to use.
;We cannot add a +0 to the ORDER_STATUS_CD because an error will arise if
;it is used with the outerjoin().

drop   program dar_execution_path_4 go
create program dar_execution_path_4


select p.*
  from person p, orders o
  plan p
	     where p.person_id = 703628.00
  join o 
       where o.person_id = outerjoin(p.person_id)
         and o.order_status_cd = outerjoin(2543.00)
  with nocounter
end go

