drop program dar_execution_path_3 go
create program dar_execution_path_3

/* 
record request
( 
  1 qual[*]
    2 person_id = f8
)
*/

free record reply
record reply
(
  1 qual[*]
    2 person_id = f8
    2 order_id = f8
    2 order_status_cd = f8
    2 encntr_id = f8
    2 encntr_type_cd = f8
)
call echorecord( request) 

declare nstart    = i4 with noconstant( 1)
declare nsize     = i4 with noconstant( 50)
declare orig_size = i4 with noconstant( size(request->qual,5))
declare loop_cnt  = i4 with noconstant( ceil( cnvtreal( orig_size)/nsize))
declare ntotal    = i4 with noconstant( loop_cnt * nsize)
declare num       = i4 with noconstant( 0)

;Retrieves a Facility code with many encounters
declare FACILITY_CD = f8 with noconstant( uar_get_code_by( "DISPLAYKEY", 
                                                      220, "BASEWEST"))
;Pad the list
set stat = alterlist( request->qual, ntotal)
for (i= orig_size+1 to ntotal)
    set request->qual[i].person_id = request->qual[orig_size].person_id
endfor

 
select into "nl:"
  from orders o,
       encounter e,
       (dummyt d with seq = value(loop_cnt))
  plan d where assign( nstart, evaluate( d.seq, 1,1, nstart + nsize))
  join o where expand( num, nstart, nstart + nsize -1, o.person_id, 
                                      request->qual[num].person_id)
  join e where e.encntr_id   = o.encntr_id
           and e.location_cd = FACILITY_CD
  head report
       cnt = 0
detail
       cnt = cnt+1
       if ( mod( cnt, 50) = 1)
          stat = alterlist( reply->qual, cnt+49)
       endif
       reply->qual[cnt].person_id       = o.person_id
       reply->qual[cnt].order_id        = o.order_id
       reply->qual[cnt].order_status_cd = o.order_status_cd
       reply->qual[cnt].encntr_type_cd  = e.encntr_type_cd
       reply->qual[cnt].encntr_id       = e.encntr_id
  foot report
       stat = alterlist( reply->qual, cnt)
  with nocounter 
end
go