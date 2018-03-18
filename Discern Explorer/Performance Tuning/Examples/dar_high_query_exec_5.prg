;This script will retrieve information from the PERSON table given a list of 
;person_id's using the DUMMYT-Expand.  It will then outerjoin to the ORDERS table.  This will cause 
; a full table scan on the PERSON table.


drop   program dar_high_query_exec_5 go
create program dar_high_query_exec_5


free record temp_request
record temp_request
(
	1 qual[*]
		2 person_id = f8
)

set stat = alterlist(temp_request->qual, 88)

for(idx = 1 to 88)
	set temp_request->qual[idx].person_id = idx
endfor

set batch_size  = 25
set cur_list_size  = size(temp_request->qual,5)
set loop_cnt = ceil(cnvtreal(cur_list_size) / batch_size)
set new_list_size =  loop_cnt * batch_size
set nstart = 1 
set stat = alterlist(temp_request->qual, new_list_size)

for (idx= cur_list_size +1 to new_list_size)
     set temp_request->qual[idx].person_id = temp_request->qual[cur_list_size].person_id
endfor

select into "nl:"
  from (dummyt d1 with seq = value(loop_cnt)),
        person p, orders o
  plan d1 
       where assign(nstart, 
                    evaluate(d1.seq,1,1, nstart +batch_size))
  join p 
       where expand(idx, nstart, nstart + (batch_size-1),
		    p.person_id, temp_request->qual[idx].person_id)
  join o 
       where o.person_id = outerjoin(p.person_id)
  with nocounter
end go
