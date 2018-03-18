;This script is performing unnecessary queries.  Rather than
;storing information to a record structure and then selecting
;from the record structure, the script could simply get all
;data in one query by joining the ORDERS and PRODUCT tables.
;The unnecessary queries will drive up disk reads, buffer gets,
;executions, and elapsed time.

drop program dar_unnec_queries_1 go
create program dar_unnec_queries_1

free record temprec
record temprec(
  1 qual[*]
    2 product_id = f8
    2 product_nbr = c20
) with protect

;variables set earlier in the program
set catalog_var = request->catalog

select into "nl:"
  from  orders o
  where o.catalog_cd = catalog_var
  head report
       cnt = 0
detail
       cnt = cnt + 1
       if (cnt > size(temprec->qual,5))
          stat = alterlist(temprec->qual, cnt + 10)
       endif
       temprec->qual[cnt].product_id = o.product_id
  foot report
       stat = alterlist(temprec->qual, cnt)
  with nocounter

;  This is the SQL statement that will be passed to Oracle
; RDB
;   SELECT  /*+  CCL<DAR_SCRIPT_4:S0000:O1:R000:Q01> */ O.PRODUCT_ID 
; FROM  ORDERS O  
; WHERE (O.CATALOG_CD =     :1    ) 
; GO


select into "nl:"
  from (dummyt d with seq = size(temprec->qual,5)),
       product p
  plan d
  join p where p.product_id = temprec->qual[d.seq].product_id
detail
       temprec->qual[d.seq].product_nbr = p.product_nbr
  with nocounter

;  This is the SQL statement that will be passed to Oracle
; RDB
;   SELECT  /*+  CCL<DAR_SCRIPT_4:S0000:O1:R000:Q01> */ P.PRODUCT_ID,
;  P.PRODUCT_NBR FROM  PRODUCT P  WHERE (P.PRODUCT_ID =     :1   ) 
; GO

end go

