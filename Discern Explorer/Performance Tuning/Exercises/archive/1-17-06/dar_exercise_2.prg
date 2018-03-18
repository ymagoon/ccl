drop program dar_exercise_2 go
create program dar_exercise_2

;This script is populating the reply record structure with
;PERSON_ID's for people with addresses in a certain zipcode
;that have an order with the CKI, CLINICAL_DISPLAY_LINE,
;and DEPT_MISC_LINE fields populated.

/*
free record request go
record request(
    1 zipcode = vc
    1 cki = vc
    1 disp_line = vc
    1 misc_line = vc
) with protect go

free record reply go
record reply(
    1 qual[*]
      2 person_id = f8
) with protect go 
*/

select into "nl:"
  from address a,
       orders o
  plan a 
       where a.parent_entity_name = "PERSON"
         and a.zipcode_key        = request->zipcode
  join o 
       where o.cki                    = request->cki
         and o.clinical_display_line  = request->disp_line
         and o.dept_misc_line         = request->misc_line
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

;Below code can be used to test dar_exercise_2

free record request go
record request(
    1 zipcode = vc
    1 cki = vc
    1 disp_line = vc
    1 misc_line = vc
) with protect go

free record reply go
record reply(
    1 qual[*]
      2 person_id = f8
) with protect go

;Solution_Alpha data 11_22_2005
set request->zipcode = "74477" go
set request->cki = "MUL.ORD!d00124" go
set request->disp_line = "1 tab, PYXIS, NOW, 1 dose(s)/times, 10/25/03 22:41:00, Hard Stop, Stop date 10/25/03 22:41:00" go
set request->misc_line = "sulfamethoxazole-trimethoprim DS 1 TAB PYXIS NOW" go
dar_exercise_2 go

;;The following select can be used to run the exercise in any environment
;select into "nl:"
;       a.zipcode_key
;  from address a
;  plan a
;       where a.parent_entity_name = "PERSON"
;detail
;       request->zipcode = a.zipcode_key
;  with nocounter, maxqual(a, 1) go
;  
;dar_exercise_2 go
;
