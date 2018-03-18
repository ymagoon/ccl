drop program dar_exercise_2 go
create program dar_exercise_2

;This script is populating the reply record structure with
;PERSON_ID's for people with addresses in a certain zipcode
;that have an order with the CKI, CLINICAL_DISPLAY_LINE,
;and DEPT_MISC_LINE fields populated.

/*
;free record request go
;record request(
;    1 zipcode = vc
;) with protect go

;free record reply go
;record reply(
;    1 qual[*]
;      2 person_id = f8
;) with protect go 
*/

select into "nl:"
  from address a,
       orders o
  plan a 
       where a.parent_entity_name = "PERSON"
         and a.zipcode_key        = request->zipcode
  join o 
       where o.cki > " "
         and o.clinical_display_line > " "
         and o.dept_misc_line        > " "
  order by a.parent_entity_id
  head report
       stat = alterlist(reply->qual,0)
       cnt = 0
  head a.parent_entity_id
       cnt = cnt + 1
       if (cnt > size(reply->qual,5))
          stat = alterlist(reply->qual, cnt+100)
       endif
       reply->qual[cnt].person_id = a.parent_entity_id
  foot a.parent_entity_id
       row +0
  foot report
       stat = alterlist(reply->qual, cnt)
  with counter

call echorecord(reply)
end 
;end of dar_exercise_2
go

;Below code can be used to test dar_exercise_2 in DEVTEST environment

free record request go
record request(
    1 zipcode = vc
) with protect go

free record reply go
record reply(
    1 qual[*]
      2 person_id = f8
) with protect go

set request->zipcode = "64011" go
dar_exercise_2 go


