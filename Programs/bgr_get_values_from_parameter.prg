drop program bgr_disp_from_list_parameter go
create program bgr_disp_from_list_parameter

prompt 
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Choose Genders" = 0 
with OUTDEV, glist 


declare gcnt = i4
declare idx = i4

record rec(
	1 list[*]
		2 code_val = f8)

;check to see if multiple values were selected at the glist (2nd) prompt
set lcheck = substring(1,1,reflect(parameter(2,0)))
if(lcheck = "L");if multiple selections were made at the $glist prompt
	;get the multiple values one at a time and load into record structure
		while(lcheck > " ")
			  set gcnt = gcnt +1
		      set lcheck = substring(1,1,reflect(parameter(2,gcnt)))
		      if(lcheck > " ")  ;lcheck will equal " " when there are no more values in the list
  		        ;set gcnt = gcnt +1
  		        if(mod(gcnt,5) = 1)
		        	set stat = alterlist(rec->list,gcnt +4)
		        endif
				set rec->list[gcnt].code_val = parameter(2,gcnt) ;load the current value from the list into the record
		      endif
		endwhile
		set stat = alterlist(rec->list,gcnt-1)
else
	;A single value was selected at glist prompt
	set stat = alterlist(rec->list,1)
	set rec->list[1].code_val = $glist ;load the single value into the record
endif

;select the values from the record structure list for display
;SELECT INTO $OUTDEV
;	LIST_CODE_VAL = REC->list[D1.SEQ].code_val
;FROM
;	(DUMMYT   D1  WITH SEQ = VALUE(SIZE(REC->list, 5)))
;PLAN D1
;WITH NOCOUNTER, SEPARATOR=" ", FORMAT

;Qualify using the record in the Expand() function
select into $outdev
	cv1.code_value
	, cv1.display

from
	code_value   cv1
where expand(idx,1,size(rec->list,5),cv1.code_value,rec->list[idx].code_val )
with nocounter, separator=" ", format


end
go


