/**************************************************
Prior to 8.10.4 generally would NOT recommend this method because it uses Parser()
However 8.10.4 included an enhancement to improve the performance of Parser().  So in cases where other options
would be difficult to create or result in overly complex code using the Parser() might be the best option.
For example if you have a prompt form that uses multiple list box controls that allow the Any(*) option.  Writing a 
Select IF to account for all the possible combinations for flexing the qualifications to use where field = $prompt
or where field != 0.0 would be very cumbersome.  In a case like that, using Parser() greatly simplifies the program.
The following is an example that shows using parser() in this situation.
**************************************************/
drop program bgr_use_any_parser_fun_list go
create program bgr_use_any_parser_fun_list

prompt 
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Select the Genders" = 0
	, "Select the Statuses" = 0 

with OUTDEV, gender, status

declare gparser_var = vc
declare gcnt = i4
declare idx = i4
declare sparser_var = vc
declare scnt = i4
declare sidx = i4

record rec(
	1 gender_list[*]
		2 code_val = f8
	1 status_list[*]
		2 code_val = f8)

;get the genders
if($gender = 0.0) ;any was selected at $gender prompt
	set gparser_var = "p.sex_cd != 0.0"
else
	set lcheck = substring(1,1,reflect(parameter(parameter2($gender),0)))
	if(lcheck = "L");if multiple selections were made at the $gender prompt
		;get the multiple values one at a time and load into record structure
			while(lcheck > " ")
				  set gcnt = gcnt +1
			      set lcheck = substring(1,1,reflect(parameter(parameter2($gender),gcnt)))
			      if(lcheck > " ")  ;lcheck will equal " " when there are no more values in the list
	  		        if(mod(gcnt,5) = 1)
			        	set stat = alterlist(rec->gender_list,gcnt +4)
			        endif
					set rec->gender_list[gcnt].code_val = parameter(parameter2($gender),gcnt) ;load the current value from the list into the record
			      endif
			endwhile
			set stat = alterlist(rec->gender_list,gcnt-1)
	else
		;A single value was selected at gender prompt
		set stat = alterlist(rec->gender_list,1)
		set rec->gender_list[1].code_val = $gender ;load the single value into the record
	endif
	set gparser_var = ^expand(idx,1,size(rec->gender_list,5),p.sex_cd,rec->gender_list[idx].code_val )^
endif

;get the statuses
if($status = 0.0) ;any was selected at $status prompt
	set sparser_var = "p.active_status_cd != 0.0"
else
	set lcheck = substring(1,1,reflect(parameter(parameter2($status),0)))
	if(lcheck = "L");if multiple selections were made at the $status prompt
		;get the multiple values one at a time and load into record structure
			while(lcheck > " ")
				  set scnt = scnt +1
			      set lcheck = substring(1,1,reflect(parameter(parameter2($status),scnt)))
			      if(lcheck > " ")  ;lcheck will equal " " when there are no more values in the list
	  		        if(mod(scnt,5) = 1)
			        	set stat = alterlist(rec->status_list,scnt +4)
			        endif
					set rec->status_list[scnt].code_val = parameter(parameter2($status),scnt) ;load the current value from the list into the record
			      endif
			endwhile
			set stat = alterlist(rec->status_list,scnt-1)
	else
		;A single value was selected at status prompt
		set stat = alterlist(rec->status_list,1)
		set rec->status_list[1].code_val = $status ;load the single value into the record
	endif
	set sparser_var = ^expand(sidx,1,size(rec->status_list,5),p.active_status_cd,rec->status_list[sidx].code_val )^
endif

SELECT INTO $outdev
	  P.PERSON_ID
	, P.NAME_FULL_FORMATTED
	, P.SEX_CD
	, P_SEX_DISP = UAR_GET_CODE_DISPLAY( P.SEX_CD )
	, P.ACTIVE_STATUS_CD
	, P_ACTIVE_STATUS_DISP = UAR_GET_CODE_DISPLAY(P.ACTIVE_STATUS_CD)

FROM
	PERSON   P

WHERE  p.updt_dt_tm between cnvtlookbehind("1,D") and cnvtdatetime(curdate,curtime3)
	and parser(gparser_var)
	and parser(sparser_var)

WITH MAXREC = 1000, NOCOUNTER, SEPARATOR=" ", FORMAT



end
go

