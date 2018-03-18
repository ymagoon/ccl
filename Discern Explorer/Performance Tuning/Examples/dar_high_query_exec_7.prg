;This program takes a list of enctr_ids and order_status_cd's and 
;returns information on particular ORDERS

drop program dar_high_query_exec_7 go
create program dar_high_query_exec_7
/*
record reply(
    1 qual_cnt = i4
    1 qual[*]
      2 encntr_id = f8
      2 order_status_cd = f8
      2 activity_type_cd = f8
      2 catalog_type_cd = f8
      2 person_id = f8
      2 order_id = f8
)
*/

select into "nl:"
  from (dummyt d with seq = value( reply->qual_cnt)),
       orders o,
       encounter e
  plan d
  join e where e.encntr_id       = reply->qual[d.seq].encntr_id
  join o where o.encntr_id       = e.encntr_id  
           and o.order_status_cd = reply->qual[d.seq].order_status_cd
detail 
       reply->qual[d.seq].activity_type_cd = o.activity_type_cd
       reply->qual[d.seq].catalog_type_cd  = o.catalog_type_cd
       reply->qual[d.seq].order_id         = o.order_id
       reply->qual[d.seq].activity_type_cd = o.person_id
  with nocounter
end go
