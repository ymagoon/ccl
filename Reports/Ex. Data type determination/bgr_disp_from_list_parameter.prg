drop program bgr_disp_from_list_parameter go
create program bgr_disp_from_list_parameter

prompt 
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Choose Genders" = 0 

with OUTDEV, glist 

declare gcnt = i4
declare lcnt = i4

;create record to store the genders that were selected at the prompt $glist
record grec (
	1 list[*]
	 2 cv = f8)

;check to see if multiple values were selected at the glist (2nd) prompt
set lcheck = substring(1,1,reflect(parameter(2,0)))
if(lcheck = "L");if multiple selections were made at the $glist prompt
	;get the multiple values one at a time
		while(lcheck > " ")
		      set gcnt = gcnt +1
		      set lcheck = substring(1,1,reflect(parameter(2,gcnt)))
		      call echo(lcheck)
		      if(lcheck > " ")  ;lcheck will equal " " when there are no more values in the list
				if(mod(gcnt,5) = 1)
					set stat = alterlist(grec->list, gcnt +4)
				endif
				set grec->list[gcnt].cv = cnvtint(parameter(2,gcnt)) ;store the code value in the record
		      endif
		endwhile
		set gcnt = gcnt -1
		set stat = alterlist(grec->list, gcnt)
else
	;A single value was selected at glist prompt
	set stat = alterlist(grec->list, 1)
	set gcnt = 1
	set grec->list[1].cv = $glist
endif

call echorecord(grec)

select into $outdev
	c.display
from code_value c
where 
	c.code_value = $glist
head report
	col 0 "Genders entered at the prompt" Row +1
	;use loop and uar to get display value of the code_value for the genders that were entered at the prompt:
	for(lcnt = 1 to gcnt)
		disp = uar_get_code_display(grec->list[lcnt].cv )
		col 10 grec->list[lcnt].cv 
		col +1 disp
		row +1
	endfor
	col 0 "Values selected from code_value table"
	row +1
detail
	col 10 c.code_value
	col +1 c.display
	row +1
with format, separator = " ", maxrec = 1000

end
go

