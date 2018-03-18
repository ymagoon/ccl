drop program dar_example_test_script go
create program dar_example_test_script

/*
 * This script will accept a request of a list of unique person_id's.
 * It will return the zip code, phone number, and a list of
 * encntr_id's and order_id's for each person listed that has.
 * both a phone number and a zip code.
 */


/*
record request
(
  1 debug_flag = i2
  1 qual_cnt = i4
  1 qual[*]
    2 person_id = f8
)
*/

record reply
(
  1 qual_cnt = i4
  1 qual[*]
    2 person_id = f8
    2 name_full_formatted = vc
    2 zip_code = vc
    2 phone_num = vc
    2 orders_qual = i4
    2 orders[*]
      3 order_id = f8
    2 encntr_qual = i4
    2 encntrs[*]
      3 encntr_id = f8
      3 prsnl_person_id = f8
)

declare debug_flag = i2 with noconstant(0)

if( validate( test_flag) = 1)
  if( test_flag = 1)
    set debug_flag = 1
  endif
endif


if( debug_flag = 1)
;Turn on traces to monitor queries 
  set trace cost
  set trace rdbdebug
  set trace rdbbind

  call echo("!!! Checkpoint1 !!!")
;check the memory
  call trace(7)
;check the input data
  call echorecord( request)
;record the time
  set start = sysdate
endif

declare ntotal = i4 with noconstant( 0)
declare nstart = i4 with noconstant( 1)
declare nsize = i4 with noconstant( 50)

set ntotal = ceil( cnvtreal( request->qual_cnt)/nsize) * nsize

set stat = alterlist(request->qual,ntotal)

for (idx=request->qual_cnt+1 to ntotal)
   set request->qual[idx].person_id = 
				  request->qual[request->qual_cnt].person_id
endfor

;This select will find the phone number and zipcode of each person
select into "nl:"
from (dummyt d1 with seq = value(1+((ntotal-1)/nsize))), 
      person p,
      phone ph,
      address a 
plan d1 where initarray(nstart,evaluate(d1.seq,1,1,nstart+nsize))
join p where expand(idx, nstart, nstart+(nsize-1), p.person_id,
              			request->qual[idx].person_id) 
        and p.active_ind = 1
join ph where ph.parent_entity_id = p.person_id
          and ph.parent_entity_name = "PERSON"
join a  where a.parent_entity_id = p.person_id
          and a.parent_entity_name = "PERSON"
order by p.person_id
head report
  cnt = 0
head p.person_id 
  cnt = cnt + 1
  if( mod( cnt, 50) = 1)
    stat = alterlist( reply->qual, cnt + 49)
  endif
  
  reply->qual[cnt].person_id = p.person_id
  reply->qual[cnt].name_full_formatted = p.name_full_formatted
  reply->qual[cnt].phone_num = ph.phone_num
  reply->qual[cnt].zip_code = a.zipcode
foot report
  reply->qual_cnt = cnt
with nocounter

;Don't resize reply until done using dummyt/expand!

if( debug_flag = 1)
  call echo(build2("Query 1 run time: ", datetimediff( sysdate, start, 5)))
  call echo("!!! Checkpoint2 !!!")
;check memory for proper usage
  call trace(7)
;check data integrity
  call echorecord( reply)
;record the time 
  set start2 = sysdate
endif

;This select will get the active orders for each person
select into "nl:"
from (dummyt d1 with seq = value(reply->qual_cnt)), 
      person p,
      orders o 
plan d1 
join p where p.person_id = reply->qual[d1.seq].person_id
        and p.active_ind = 1
join o where o.person_id = p.person_id
        and o.active_ind = 1
head d1.seq
  cnt = 0
detail 
  cnt = cnt + 1
  if( mod( cnt, 10) = 1)
    stat = alterlist( reply->qual[d1.seq].orders, cnt + 9)
  endif
  reply->qual[d1.seq].orders[cnt].order_id = o.order_id
foot d1.seq
  reply->qual[d1.seq].orders_qual = cnt
  stat = alterlist( reply->qual[d1.seq].orders, cnt)
with nocounter          

if( debug_flag = 1)
  call echo(build2("Query 2 run time: ", datetimediff( sysdate, start2, 5)))
  call echo("!!! Checkpoint3 !!!")
;check memory usage
  call trace(7)
;check data integrity
  call echorecord( reply)
;record the time
  set start3 = sysdate
endif

set nstart = 1
set ntotal = reply->qual_cnt

;grab the associated encntr and prsnl for that encounter
select into "nl:"
from (dummyt d1 with seq = value(1+((ntotal-1)/nsize))), 
      person p,
      encounter e,
      encntr_prsnl_reltn epr 
plan d1 where initarray(nstart,evaluate(d1.seq,1,1,nstart+nsize))
join p where expand(idx, nstart, nstart+(nsize-1), p.person_id,
              			reply->qual[idx].person_id) 
        and p.active_ind = 1
join e where e.person_id = p.person_id
        and e.active_ind = 1
join epr where epr.encntr_id = outerjoin( e.encntr_id)
           and epr.active_ind = outerjoin(1)
           and epr.prsnl_person_id > outerjoin(0)
order by p.person_id
head p.person_id
  cnt = 0
  i = locateval( idx, 1, reply->qual_cnt, p.person_id,
              			reply->qual[idx].person_id)
detail 
  cnt = cnt + 1
  if( mod( cnt, 10) = 1)
    stat = alterlist( reply->qual[i].encntrs, cnt + 9)
  endif
  reply->qual[i].encntrs[cnt].encntr_id = e.encntr_id
  reply->qual[i].encntrs[cnt].prsnl_person_id = epr.prsnl_person_id
foot p.person_id
  reply->qual[i].encntr_qual = cnt
  stat = alterlist( reply->qual[i].encntrs, cnt)
with nocounter 

set stat = alterlist( reply->qual, reply->qual_cnt)

if( debug_flag = 1)
  call echo(build2("Query 3 run time: ", datetimediff( sysdate, start3, 5)))
;echo out total run time
  call echo("Script Complete")
  call echo(build2("TOTAL RUN TIME: ", datetimediff( sysdate, start, 5)))

  call echo("!!! Checkpoint3 !!!")
;check memory
  call trace(7)
;check for correct output
  call echorecord( reply)

;turn off traces
  set trace nordbdebug
  set trace nordbbind
endif
set notrace rdbdebug
set notrace rdbbind
end
go

/*
 * The following code can be used to run the example_test_script
 * in devtest.  
 */


free record request go
record request
(
  1 debug_flag = i2
  1 qual_cnt = i4
  1 qual[*]
    2 person_id = f8
)
go

set stat = alterlist( request->qual, 45) go

;Changing this variable between 0-off and 1-on will toggle the testing output
;Not declaring the variable will also turn off the testing output
declare test_flag = i4 with noconstant(1) go

select into "nl:"
from person p, orders o
plan p where p.person_id > 0
join o where p.person_id = o.person_id
head report
 cnt = 0
head p.person_id
 cnt = cnt+1
 request->qual[cnt].person_id = p.person_id
foot report 
 request->qual_cnt = cnt
with maxqual( p, 5), nocounter
go

execute dar_example_test_script go
