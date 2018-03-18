drop program bgr_flex_order_using_prompt go
create program bgr_flex_order_using_prompt

prompt 
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Sort on:" = "Person ID" 

with OUTDEV, SortP

;use Select If to flex the sort based on prompt
;for efficiency purposes this would be the preferred method
select if(cnvtupper($sortp) = "PERSON ID")
			order p.person_id
		elseif(cnvtupper($sortp) = "NAME")
			order p.name_last_key
		endif

 into $outdev
	p.person_id,
	name = substring(1,20,p.name_last_key),
	p.updt_dt_tm ";;q"

from
	person  p
where p.updt_dt_tm > cnvtdatetime(curdate-7,0)
order p.updt_dt_tm

with maxrec = 100 , nocounter, separator=" ", format


;;use evaluate to flex sort based on prompt
;select into $outdev
;	p.person_id,
;	name = substring(1,20,p.name_last_key),
;	p.updt_dt_tm ";;q",
;	sort_var = evaluate(cnvtupper($sortp), "PERSON ID", cnvtstring(p.person_id), "NAME", p.name_last_key)
;from
;	person  p
;where p.updt_dt_tm > cnvtdatetime(curdate-7000,0)
;order 
;	evaluate(cnvtupper($sortp), "PERSON ID", cnvtstring(p.person_id), "NAME", p.name_last_key)
;
;with maxrec = 100 , nocounter, separator=" ", format
;

end
go

set trace rdbdebug go
set trace rdbbind go
 bgr_flex_order_using_prompt "nl:", "person id" go

