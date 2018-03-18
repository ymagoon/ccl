;This query is joining to the CODE_VALUE table.  This join to the
;CODE_VALUE table could be replaced with a UAR function.  Every join
;to the CODE_VALUE table should be questioned to determine if it can
;be replaced with a UAR function.  Joins to the CODE_VALUE table are
;very costly and will drive up buffer gets, disk reads, and elapsed
;time.

drop program dar_unnec_queries_2 go
create program dar_unnec_queries_2

;variables set earlier in the program
set short_desc_var = request->short_desc

select into "nl:"
  from bill_item bi,
       code_value cv
  plan bi where bi.ext_short_desc = short_desc_var
  join cv where cv.code_value     = bi.ext_owner_cd
  head report
       cnt = 0
detail
       cnt = cnt +1
       if (cnt > size(temprec->qual,5))
          stat = alterlist(temprec->qual, cnt + 10)
       endif
       temprec->qual[cnt].bill_item_id = bi.bill_item_id
       temprec->qual[cnt].meaning      = cv.cdf_meaning
  foot report
       stat = alterlist(temprec->qual, cnt)
  with nocounter
end go

