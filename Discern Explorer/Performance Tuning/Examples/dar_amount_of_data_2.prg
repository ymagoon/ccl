;This program obtains the person name and phone number of all 
;persons with last name starting with SMIT

drop program dar_amount_of_data_2 go
create program dar_amount_of_data_2

free record reply
record reply
(
  1 qual_cnt = i4
  1 qual[*]
    2 person_id = f8
    2 name_full_formatted = vc
    2 phone_num = vc
)

declare last_name    = vc with constant( "SMIT*" ) 
declare first_name   = vc with constant( "*" ) 
declare maxqual_size = i4 with constant(10)

select into "nl:"
       p.person_id, p.name_full_formatted, ph.phone_num
  from person p,
       phone ph
  plan p  where p.name_last_key        = patstring(last_name)
            and Trim(p.name_first_key) = patstring(first_name)
  join ph where ph.parent_entity_id    = p.person_id
            and ph.parent_entity_name  = "PERSON" 
  head report
       cnt = 0
detail
       cnt = cnt+1
       if (mod( cnt, 20) = 1)
          stat = alterlist( reply->qual, cnt+19)
       endif
       reply->qual[cnt].person_id           = p.person_id
       reply->qual[cnt].name_full_formatted = p.name_full_formatted
       reply->qual[cnt].phone_num           = ph.phone_num
  foot report
       reply->qual_cnt = cnt
       stat = alterlist( reply->qual, cnt)
  with nocounter
end
go
