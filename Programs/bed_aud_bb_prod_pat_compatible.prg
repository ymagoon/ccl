drop program bed_aud_bb_prod_pat_compatible:dba go
create program bed_aud_bb_prod_pat_compatible:dba
 
if (not (validate (request,0)))
 record request
  (
    1 program_name = vc
    1 skip_volume_check_ind = i2
    1 output_filename = vc
    1 paramlist[*]
      2 param_type_mean = vc
      2 pdate1 = dq8
      2 pdate2 = dq8
      2 vlist[*]
        3 dbl_value = f8
        3 string_value = vc
  )
endif
 
if (not(validate(reply,0)))
 record reply
  (
    1  collist[*]
      2  header_text = vc
      2  data_type = i2
      2  hide_ind = i2
    1  rowlist[*]
      2 celllist[*]
        3 date_value = dq8
        3 nbr_value = i4
        3 double_value = f8
        3 string_value = vc
        3 display_flag = i2 ;0-regular,1-bold,2-???
    1  high_volume_flag = i2
    1  output_filename = vc
    1  run_status_flag = i2
    1  statlist[*]
       2 statistic_meaning = vc
       2 status_flag = i2
       2 qualifying_items = i4
       2 total_items = i4
    1  status_data
      2  status  =  C1
      2  SUBEVENTSTATUS [ 1 ]
        3  OPERATIONNAME  =  C15
        3  OPERATIONSTATUS  =  C1
        3  TARGETOBJECTNAME  =  C15
        3  TARGETOBJECTVALUE  =  C100
  )
endif
 
free record temp
record temp
(
  1 tqual[*]
    2 blood_product			= vc
    2 product_aborh_type	= vc
    2 validate_aborh_flag	= vc
    2 validate_rh_only_flag	= vc
    2 crossmatch_flag		= vc
    2 autologous_flag		= vc
    2 yes_list[*]
      3 code_value			= f8
	  3 display				= vc
    2 warn_list[*]
      3 code_value			= f8
      3 display				= vc
    2 no_list[*]
      3 code_value			= f8
      3 display				= vc
)
 
 
 
free record aborh
record aborh
(
  1 types[*]
    2 code_value	= f8
    2 display		= vc
)
 
 
declare HIGH_DATA_LIMIT = i4 with protect, noconstant(5000)
declare MEDIUM_DATA_LIMIT = i4 with protect, noconstant(3000)
 
set high_volume_cnt = 0
if (request->skip_volume_check_ind = 0)
  select into "nl:"
    hv_cnt = count(*)
  from product_aborh pa
	where pa.active_ind = 1
  detail
    high_volume_cnt = hv_cnt
  with nocounter
 
  call echo(high_volume_cnt)
 
  if (high_volume_cnt > HIGH_DATA_LIMIT)
    set reply->high_volume_flag = 2
    go to exit_script
  elseif (high_volume_cnt > MEDIUM_DATA_LIMIT)
    set reply->high_volume_flag = 1
    go to exit_script
  endif
endif
 
 
 
 
set tcnt = 0
select into "NL:"
from product_aborh pa,
	 product_patient_aborh ppa,
	 code_value cv1,
	 code_value cv2,
	 code_value cv3
 
plan pa
	where pa.active_ind 		= 1
 
join ppa
	where ppa.product_cd		= outerjoin(pa.product_cd)
	  and ppa.prod_aborh_cd		= outerjoin(pa.product_aborh_cd)
	  and ppa.active_ind 		= outerjoin(1)
 
join cv1
  where cv1.code_value 			= outerjoin(pa.product_cd)
    and cv1.active_ind 			= outerjoin(1)
 
join cv2
  where cv2.code_value 			= outerjoin(pa.product_aborh_cd)
    and cv2.active_ind 			= outerjoin(1)
 
join cv3
  where cv3.code_value 			= outerjoin(ppa.prsn_aborh_cd)
    and cv3.active_ind 			= outerjoin(1)
 
order cv1.display, cv2.display, cv3.display, pa.product_cd, pa.product_aborh_cd
 
head pa.product_cd
	tcnt = tcnt
 
head pa.product_aborh_cd
	tcnt = tcnt + 1
	stat = alterlist(temp->tqual,tcnt)
	temp->tqual[tcnt].blood_product			= cv1.display
	temp->tqual[tcnt].product_aborh_type	= cv2.display
 
	if (pa.aborh_option_flag = 1)
		temp->tqual[tcnt].validate_aborh_flag	= "Yes"
		temp->tqual[tcnt].validate_rh_only_flag	= "No"
	elseif (pa.aborh_option_flag = 0)
		temp->tqual[tcnt].validate_aborh_flag	= "No"
		temp->tqual[tcnt].validate_rh_only_flag	= "Yes"
	else
		temp->tqual[tcnt].validate_aborh_flag	= " "
		temp->tqual[tcnt].validate_rh_only_flag	= " "
	endif
	if (pa.no_gt_on_prsn_flag = 0)
		temp->tqual[tcnt].crossmatch_flag		= "No"
	elseif (pa.no_gt_on_prsn_flag = 1)
		temp->tqual[tcnt].crossmatch_flag		= "Yes"
	elseif (pa.no_gt_on_prsn_flag = 2)
		temp->tqual[tcnt].crossmatch_flag		= "Warn"
	endif
	if (pa.no_gt_autodir_prsn_flag = 0)
		temp->tqual[tcnt].autologous_flag		= "No"
	elseif (pa.no_gt_autodir_prsn_flag = 1)
		temp->tqual[tcnt].autologous_flag		= "Yes"
	elseif (pa.no_gt_autodir_prsn_flag = 2)
		temp->tqual[tcnt].autologous_flag		= "Warn"
	endif
	yes_cnt = 0
	warn_cnt = 0
 
detail
	if (ppa.warn_ind = 0)
		yes_cnt = yes_cnt + 1
		stat = alterlist(temp->tqual[tcnt]->yes_list, yes_cnt)
		temp->tqual[tcnt]->yes_list[yes_cnt].code_value		= ppa.prsn_aborh_cd
		temp->tqual[tcnt]->yes_list[yes_cnt].display		= cv3.display
	else
		warn_cnt = warn_cnt + 1
		stat = alterlist(temp->tqual[tcnt]->warn_list, warn_cnt)
		temp->tqual[tcnt]->warn_list[warn_cnt].code_value	= ppa.prsn_aborh_cd
		temp->tqual[tcnt]->warn_list[warn_cnt].display		= cv3.display
	endif
 
with nocounter
 
 
 
 
 
set stat = alterlist(reply->collist,9)
set reply->collist[1].header_text = "Blood Product"
set reply->collist[1].data_type = 1 ;string
set reply->collist[1].hide_ind = 0
set reply->collist[2].header_text = "Product ABO/Rh Type"
set reply->collist[2].data_type = 1 ;string
set reply->collist[2].hide_ind = 0
set reply->collist[3].header_text = "Validate Patient's ABO/Rh?"
set reply->collist[3].data_type = 1 ;string
set reply->collist[3].hide_ind = 0
set reply->collist[4].header_text = "Validate Patient's Rh Only?"
set reply->collist[4].data_type = 1 ;string
set reply->collist[4].hide_ind = 0
set reply->collist[5].header_text = "Crossmatch or dispense to patient with no group or type?"
set reply->collist[5].data_type = 1 ;string
set reply->collist[5].hide_ind = 0
set reply->collist[6].header_text = "If Autologous or Directed, associate to patient with no group or type when received?"
set reply->collist[6].data_type = 1 ;string
set reply->collist[6].hide_ind = 0
set reply->collist[7].header_text = "Compatible Patient ABO/Rh Type - Yes"
set reply->collist[7].data_type = 1 ;string
set reply->collist[7].hide_ind = 0
set reply->collist[8].header_text = "Compatible Patient ABO/Rh Type - Yes w/ Warning"
set reply->collist[8].data_type = 1 ;string
set reply->collist[8].hide_ind = 0
set reply->collist[9].header_text = "Compatible Patient ABO/Rh Type - No"
set reply->collist[9].data_type = 1 ;string
set reply->collist[9].hide_ind = 0
 
 
 
if (tcnt = 0)
  go to exit_script
endif
 
 
 
 
 
;get all the types from code set 1640
set acnt = 0
select into "NL:"
from code_value cv
where cv.code_set = 1640
  and cv.active_ind = 1
order cv.display
detail
	acnt = acnt + 1
	stat = alterlist(aborh->types, acnt)
	aborh->types[acnt].code_value	= cv.code_value
	aborh->types[acnt].display		= cv.display
with nocounter
 
 
 
 
 
;complete the "no" list for each type
for (t = 1 to tcnt)
 
	set yes_cnt  = size(temp->tqual[t]->yes_list, 5)
	set warn_cnt = size(temp->tqual[t]->warn_list, 5)
	set no_cnt = 0
 
	;check if each type is in either the "yes" list or the "warn" list - if not, then add to the "no" list
	for (a = 1 to acnt)
		set found_ind = 0
		for (y = 1 to yes_cnt)
			if (temp->tqual[t]->yes_list[y].code_value = aborh->types[a].code_value)
				set found_ind = 1
				set y = yes_cnt + 1
			endif
		endfor
		if (found_ind = 0)
			for (w = 1 to warn_cnt)
				if (temp->tqual[t]->warn_list[w].code_value = aborh->types[a].code_value)
					set found_ind = 1
					set w = warn_cnt + 1
				endif
			endfor
		endif
		if (found_ind = 0)
			set no_cnt = no_cnt + 1
			set stat = alterlist(temp->tqual[t]->no_list, no_cnt)
			set temp->tqual[t]->no_list[no_cnt].code_value	= aborh->types[a].code_value
			set temp->tqual[t]->no_list[no_cnt].display		= aborh->types[a].display
		endif
	endfor
 
endfor
 
 
 
 
set row_nbr = 0
for (x = 1 to tcnt)
	set row_nbr = row_nbr + 1
	set stat = alterlist(reply->rowlist,row_nbr)
	set stat = alterlist(reply->rowlist[row_nbr].celllist,9)
 
	set reply->rowlist[row_nbr].celllist[1].string_value  = temp->tqual[x].blood_product
	set reply->rowlist[row_nbr].celllist[2].string_value  = temp->tqual[x].product_aborh_type
	set reply->rowlist[row_nbr].celllist[3].string_value  = temp->tqual[x].validate_aborh_flag
	set reply->rowlist[row_nbr].celllist[4].string_value  = temp->tqual[x].validate_rh_only_flag
	set reply->rowlist[row_nbr].celllist[5].string_value  = temp->tqual[x].crossmatch_flag
	set reply->rowlist[row_nbr].celllist[6].string_value  = temp->tqual[x].autologous_flag
 
 
	set yes_cnt  = size(temp->tqual[x]->yes_list, 5)
	set warn_cnt = size(temp->tqual[x]->warn_list, 5)
	set no_cnt   = size(temp->tqual[x]->no_list, 5)
 
 
	set w = 0
	set n = 0
 
 
 
	if (yes_cnt > 0)
 
	  	for (y = 1 to yes_cnt)
 
			;;;;;;;;;; add "yes" type to row ;;;;;;;;;;
			set reply->rowlist[row_nbr].celllist[7].string_value = temp->tqual[x]->yes_list[y].display
 
			set w = w + 1
			if (w < warn_cnt or w = warn_cnt)
				;;;;;;;;;; add "warn" type to row ;;;;;;;;;;
				set reply->rowlist[row_nbr].celllist[8].string_value = temp->tqual[x]->warn_list[w].display
			endif
 
			set n = n + 1
			if (n < no_cnt or n = no_cnt)
				;;;;;;;;;; add "no" type to row ;;;;;;;;;;
				set reply->rowlist[row_nbr].celllist[9].string_value = temp->tqual[x]->no_list[n].display
			endif
 
 			if (y < yes_cnt)
				set row_nbr = row_nbr + 1
				set stat = alterlist(reply->rowlist, row_nbr)
				set stat = alterlist(reply->rowlist[row_nbr].celllist, 9)
	  		endif
 
	  	endfor
 
		;;;;;;;;;; if more "warn" types than "yes" types, create more rows to display "warn" types ;;;;;;;;;;
		if (w < warn_cnt)
			set w = w + 1
			for (w = w to warn_cnt)
				set row_nbr = row_nbr + 1
				set stat = alterlist(reply->rowlist, row_nbr)
				set stat = alterlist(reply->rowlist[row_nbr].celllist, 9)
				set reply->rowlist[row_nbr].celllist[8].string_value = temp->tqual[x]->warn_list[w].display
 
				set n = n + 1
				if (n < no_cnt or n = no_cnt)
					;;;;;;;;;; add "no" type to row ;;;;;;;;;;
					set reply->rowlist[row_nbr].celllist[9].string_value = temp->tqual[x]->no_list[n].display
				endif
 
			endfor
		endif
 
		;;;;;;;;;; if still more "no" types, create more rows to display "no" types ;;;;;;;;;;
		if (n < no_cnt)
			set n = n + 1
			for (n = n to no_cnt)
				set row_nbr = row_nbr + 1
				set stat = alterlist(reply->rowlist, row_nbr)
				set stat = alterlist(reply->rowlist[row_nbr].celllist, 9)
				set reply->rowlist[row_nbr].celllist[9].string_value = temp->tqual[x]->no_list[n].display
			endfor
		endif
 
 
 
	elseif (warn_cnt > 0)
 
	  	for (w = 1 to warn_cnt)
 
			;;;;;;;;;; add "warn" type to row ;;;;;;;;;;
			set reply->rowlist[row_nbr].celllist[8].string_value = temp->tqual[x]->warn_list[w].display
 
			set n = n + 1
			if (n < no_cnt or n = no_cnt)
				;;;;;;;;;; add "no" type to row ;;;;;;;;;;
				set reply->rowlist[row_nbr].celllist[9].string_value = temp->tqual[x]->no_list[n].display
			endif
 
			if (w < warn_cnt)
				set row_nbr = row_nbr + 1
				set stat = alterlist(reply->rowlist, row_nbr)
				set stat = alterlist(reply->rowlist[row_nbr].celllist, 9)
	  		endif
 
	  	endfor
 
		;;;;;;;;;; if more "no" types than "warn" types, create more rows to display "no" types ;;;;;;;;;;
		if (n < no_cnt)
			set n = n + 1
			for (n = n to no_cnt)
				set row_nbr = row_nbr + 1
				set stat = alterlist(reply->rowlist, row_nbr)
				set stat = alterlist(reply->rowlist[row_nbr].celllist, 9)
				set reply->rowlist[row_nbr].celllist[9].string_value = temp->tqual[x]->no_list[n].display
			endfor
		endif
 
 
 
	elseif (no_cnt > 0)
 
	  	for (n = 1 to no_cnt)
 
			;;;;;;;;;; add "no" type to row ;;;;;;;;;;
			set reply->rowlist[row_nbr].celllist[9].string_value = temp->tqual[x]->no_list[n].display
 
			if (n < no_cnt)
				set row_nbr = row_nbr + 1
				set stat = alterlist(reply->rowlist, row_nbr)
				set stat = alterlist(reply->rowlist[row_nbr].celllist, 9)
	  		endif
 
	  	endfor
 
 
	endif
    
    if (request->skip_volume_check_ind = 0)
      if (row_nbr > HIGH_DATA_LIMIT)
        set reply->high_volume_flag = 2
        set stat = alterlist(reply->rowlist, 0)
        go to exit_script
      elseif (row_nbr > MEDIUM_DATA_LIMIT)
        set reply->high_volume_flag = 1
        set stat = alterlist(reply->rowlist, 0)
        go to exit_script
      endif
    endif
 
endfor
 
#exit_script
if (reply->high_volume_flag in (1,2))
  set reply->output_filename = build("bb_product_patient_compatibility.csv")
endif
 
if (request->output_filename > " ")
  execute bed_rpt_file
endif
 
end go
