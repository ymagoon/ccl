;This script has an issue with the amount of data being returned by Oracle.
;The if/else statement on P.PHONE_NUM found in the detail section can be
;moved to the WHERE clause.  By not filtering the data set early, the query
;will be slow and consume large amounts of database resources.

drop program dar_amount_of_data_1 go
create program dar_amount_of_data_1

;variables set earlier in the program
set primary_phone_var   = request->primary_phone
set alternate_phone_var = request->alternate_phone

free record temprec
record temprec(
    1 qual[*]
       2 primary_line_ind = i2
       2 person_id = f8
)

select into "nl:"
  from  phone p
  where p.active_ind         = 1
    and p.parent_entity_name = "PERSON"
   head report
        cnt = 0
detail
        if (p.phone_num = primary_phone_var)
           cnt = cnt + 1
           if (cnt > size(temprec->qual,5))
              stat = alterlist(temprec->qual, cnt+5)
           endif
           temprec->qual[cnt].primary_line_ind = 1
           temprec->qual[cnt].person_id        = p.parent_entity_id
        elseif (p.phone_num = alternate_phone_var)
           cnt = cnt + 1
           if (cnt > size(temprec->qual,5))
              stat = alterlist(temprec->qual, cnt+5)
           endif
           temprec->qual[cnt].person_id = p.parent_entity_id
        endif
   foot report
        stat = alterlist(temprec->qual, cnt)
  with nocounter
  
;This is the SQL statement that will be sent to Oracle
;RDB
;  SELECT  /*+  CCL<:S0000:O1:R000:Q01> */ P.PARENT_ENTITY_ID, P.PHONE_NUM 
;  FROM  PHONE P  
;  WHERE (P.ACTIVE_IND =     :1    AND P.PARENT_ENTITY_NAME =     :2   ) 
;GO

end go

