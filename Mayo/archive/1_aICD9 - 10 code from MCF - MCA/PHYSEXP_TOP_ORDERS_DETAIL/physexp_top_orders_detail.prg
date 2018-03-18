drop program physexp_top_orders_detail go
create program physexp_top_orders_detail
 
prompt
	"Output to File/Printer/MINE" = "MINE"                                     ;* Enter or select the printer or file name
	, "Specialty (if using multiple specialties separate by comma):" = ""
	, "Begin Date (MMDDYYYY):" = CURDATE
	, "End Date (MMDDYYYY):" = CURDATE
 
with OUTDEV, SPECIALTY, BDATE, EDATE
;**********************************************************************************
 
if (validate(request->batch_selection) = 1) ; Run from OPS
  set begindate = $BDATE
  set enddate = $EDATE
  set log_domain_id = 0.0
else
  if ($BDATE = curdate)
    set begindate = $BDATE
  else
    set begindate = cnvtdate($BDATE)
  endif
  if ($EDATE = curdate)
    set enddate = $EDATE
  else
    set enddate = cnvtdate($EDATE)
  endif
 
  set log_domain_id = 0.0
  select into "nl:"
  from person p
  where p.person_id = reqinfo->updt_id
  detail
  log_domain_id = p.logical_domain_id
  with nullreport
endif
set output_filename = $OUTDEV
 
;Load Cerner Specialties
free record specialty_rec
record specialty_rec
(
  1 specialty_cnt = i2
  1 specialties [*]
    2 specialty = vc
)
set specialty_rec->specialty_cnt = 0
 
;Load Cerner Specialties from csv file
set specialty_file_destination = "ccluserdir:cern_specialty.csv"
free define rtl3
define rtl3 is value(specialty_file_destination)
select into "nl:"
  line = r.line
from rtl3t r
head report
  cnt = 0
  stat = alterlist(specialty_rec->specialties,10)
detail
  cnt = (cnt + 1)
  if ((mod(cnt,10) = 1))
    stat = alterlist(specialty_rec->specialties, (cnt + 9))
  endif
  specialty_rec->specialties[cnt]->specialty = cnvtupper(trim(line))
foot report
 stat = alterlist(specialty_rec->specialties,cnt)
 specialty_rec->specialty_cnt = cnt
with nullreport
 
;Set input information record structure
free record input_info
record input_info
(
  1 input_filename = vc
  1 username_cnt = i2
  1 usernames [*]
    2 line = vc
    2 username = vc
    2 specialty = vc
  1 id_cnt = i4
  1 ids[*]
    2 person_id = f8
  1 specialty_cnt = i2
  1 specialties [*]
    2 specialty = vc
  1 error_message = vc
)
set input_info->username_cnt = 0
set input_info->specialty_cnt = 0
set input_info->input_filename = "ccluserdir:cern_infile.csv"
 
;Load Specialty Input Prompt
set specialty_input = $SPECIALTY
set specialty_string_length = size(specialty_input,1)
set stat = alterlist(input_info->specialties,100)
set start_pos = 1
for (x = 1 to 100)
    set comma_pos = findstring(",",specialty_input,start_pos,0)
    if (comma_pos > 0)
      set string_field_length = comma_pos - start_pos
      set input_info->specialties[x]->specialty = cnvtupper(substring(start_pos,string_field_length,specialty_input))
      set start_pos = comma_pos + 1
    else
      set string_field_length = specialty_string_length - comma_pos
      set input_info->specialties[x]->specialty = cnvtupper(substring(start_pos,string_field_length,specialty_input))
      set input_info->specialty_cnt = x
      set x = 101
    endif
endfor
set stat = alterlist(input_info->specialties,input_info->specialty_cnt)
 
;validate Specialty Input
set error_message = fillstring(100," ")
set error_flag = "N"
select into "nl:"
from (dummyt d1 with seq = input_info->specialty_cnt)
plan d1
head report
  input_info->error_message = fillstring(100," ")
  match_found = "N"
detail
  for (x = 1 to specialty_rec->specialty_cnt)
    if (input_info->specialties[d1.seq]->specialty = specialty_rec->specialties[x]->specialty)
      match_found = "Y"
    endif
  endfor
  if (match_found = "N")
    error_flag = "Y"
    input_info->error_message = concat(trim(input_info->error_message),
                                trim(input_info->specialties[d1.seq]->specialty),":")
  endif
  match_found = "N"
with nullreport
 
if (error_flag = "Y")
  set input_info->error_message = concat("Invalid Specialty Input: ",input_info->error_message)
  call write_error_message(input_info->error_message, output_filename)
  go to EXIT_SCRIPT
endif
 
;Load Usernames into input record structure
free define rtl3
define rtl3 is value(input_info->input_filename)
 
select into "nl:"
  line = r.line
from rtl3t r
head report
  cnt = 0
  stat = alterlist(input_info->usernames,10)
detail
  username = trim(piece(line,",",1, ""))
  specialty = cnvtupper(trim(piece(line,",",2, "")))
  for (x = 1 to input_info->specialty_cnt)
    if (specialty = input_info->specialties[x]->specialty)
      cnt = (cnt + 1)
      if ((mod(cnt,10) = 1))
        stat = alterlist(input_info->usernames, (cnt + 9))
      endif
      input_info->usernames[cnt]->line      = line
      input_info->usernames[cnt]->username  = username
      input_info->usernames[cnt]->specialty = specialty
    endif
  endfor
foot report
 stat = alterlist(input_info->usernames,cnt)
 input_info->username_cnt = cnt
with nullreport
 
if (input_info->username_cnt = 0)
  set input_info->error_message = "No Users found for Specialties input"
  call write_error_message(input_info->error_message, output_filename)
  go to EXIT_SCRIPT
endif
 
;Load person_id of users
if (log_domain_id > 0)
  select into "nl:"
  p.person_id,
  d1seq = d1.seq
  from (dummyt d1 with seq = input_info->username_cnt),
       prsnl p,
       person p2
  plan d1
  join p
  where p.username = input_info->usernames[d1.seq]->username
    and p.person_id != 0
    and p.active_ind = 1
    and p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
    and p.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
  join p2
  where p2.person_id = p.person_id
    and p2.logical_domain_id = log_domain_id
  head report
    cnt = 0
    stat = alterlist(input_info->ids,10)
  detail
    cnt = (cnt + 1)
    if ((mod(cnt,10) = 1))
      stat = alterlist(input_info->ids, (cnt + 9))
    endif
    input_info->ids[cnt]->person_id = p.person_id
  foot report
    stat = alterlist(input_info->ids,cnt)
    input_info->id_cnt = cnt
  with nullreport
  if (input_info->id_cnt = 0)
    set input_info->error_message = "No Users found for Domain Id"
    call write_error_message(input_info->error_message, output_filename)
    go to EXIT_SCRIPT
  endif
else
  select into "nl:"
  p.person_id,
  d1seq = d1.seq
  from (dummyt d1 with seq = input_info->username_cnt),
       prsnl p
  plan d1
  join p
  where p.username = input_info->usernames[d1.seq]->username
    and p.person_id != 0
    and p.active_ind = 1
    and p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
    and p.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
  head report
    cnt = 0
    stat = alterlist(input_info->ids,10)
  detail
    cnt = (cnt + 1)
    if ((mod(cnt,10) = 1))
      stat = alterlist(input_info->ids, (cnt + 9))
    endif
    input_info->ids[cnt]->person_id = p.person_id
  foot report
    stat = alterlist(input_info->ids,cnt)
    input_info->id_cnt = cnt
  with nullreport
  if (input_info->id_cnt = 0)
    set input_info->error_message = "No Users found for Usernames Input"
    call write_error_message(input_info->error_message, output_filename)
    go to EXIT_SCRIPT
  endif
endif
 
;Load Output information
free record output_info
record output_info
(
  1 order_cnt = i4
  1 orders [*]
    2 catalog_type_cd = f8
    2 catalog_cd_disp = c100
    2 catalog_cd = f8
    2 orig_ord_as_flag_0_cnt = i4
    2 catalog_cd_total = i4
    2 rank = i2
    2 id_cnt = i4
    2 ids [*]
      3 order_id = f8
      3 orig_ord_as_flag = i2
      3 oe_format_id = f8
    2 desc_cnt = i2
    2 descriptions [*]
      3 oe_field_description = c25
      3 accept_flag_disp = c14
      3 oe_field_default_value = c100
      3 display_value_cnt = i2
      3 display_value [*]
        4 oe_field_display_value = c255
        4 rank = i2
        4 displayed_cnt = i4
  1 error_message = vc
 
)
set output_info->order_cnt = 0
 
;Load order data
select  into "nl:"
o.order_id,
o.catalog_type_cd,
o.catalog_cd,
oa.order_provider_id,
o.orig_ord_as_flag,
o.oe_format_id
from (dummyt d1 with seq = input_info->id_cnt),
     order_action oa,
     orders o
plan o
where o.orig_order_dt_tm >= cnvtdatetime(begindate,000000)
  and o.orig_order_dt_tm <= cnvtdatetime(enddate,235959)
  and o.template_order_id +0 = 0
  and o.orig_ord_as_flag in (0,1,2,5)
join oa
where oa.order_id = o.order_id
  and oa.action_sequence = 1
join d1
where input_info->ids[d1.seq]->person_id = oa.order_provider_id
head report
  cnt = 0
  stat = alterlist(output_info->orders,100)
detail
    if (cnt > 0)
      ptr = 0
      for (y = 1 to cnt)
        if (o.catalog_cd = output_info->orders[y]->catalog_cd)
          ptr = y
        endif
      endfor
      if (ptr > 0)
        output_info->orders[ptr]->catalog_cd_total = (output_info->orders[ptr]->catalog_cd_total + 1)
        if (o.orig_ord_as_flag in (0,5))
          output_info->orders[ptr]->orig_ord_as_flag_0_cnt =
              (output_info->orders[ptr]->orig_ord_as_flag_0_cnt + 1)
        endif
        ocnt = (output_info->orders[ptr]->id_cnt + 1)
        stat = alterlist(output_info->orders[ptr]->ids, ocnt)
        output_info->orders[ptr]->ids[ocnt]->order_id = o.order_id
        output_info->orders[ptr]->ids[ocnt]->orig_ord_as_flag = o.orig_ord_as_flag
        output_info->orders[ptr]->ids[ocnt]->oe_format_id = o.oe_format_id
        output_info->orders[ptr]->id_cnt = ocnt
      else
        cnt = (cnt + 1)
        if ((mod(cnt,100) = 1))
          stat = alterlist(output_info->orders, (cnt + 99))
        endif
        output_info->orders[cnt]->catalog_type_cd = o.catalog_type_cd
        output_info->orders[cnt]->catalog_cd = o.catalog_cd
        output_info->orders[cnt]->catalog_cd_disp = uar_get_code_display(o.catalog_cd)
        output_info->orders[cnt]->catalog_cd_total = (output_info->orders[cnt]->catalog_cd_total + 1)
        if (o.orig_ord_as_flag = 0)
          output_info->orders[cnt]->orig_ord_as_flag_0_cnt =
              (output_info->orders[cnt]->orig_ord_as_flag_0_cnt + 1)
        endif
        output_info->order_cnt = (output_info->order_cnt + 1)
        ocnt = (output_info->orders[cnt]->id_cnt + 1)
        stat = alterlist(output_info->orders[cnt]->ids, ocnt)
        output_info->orders[cnt]->ids[ocnt]->order_id = o.order_id
        output_info->orders[cnt]->ids[ocnt]->orig_ord_as_flag = o.orig_ord_as_flag
        output_info->orders[cnt]->ids[ocnt]->oe_format_id = o.oe_format_id
        output_info->orders[cnt]->id_cnt = ocnt
      endif
    else
      cnt = (cnt + 1)
      output_info->orders[cnt]->catalog_type_cd = o.catalog_type_cd
      output_info->orders[cnt]->catalog_cd = o.catalog_cd
      output_info->orders[cnt]->catalog_cd_disp = uar_get_code_display(o.catalog_cd)
      output_info->orders[cnt]->catalog_cd_total = (output_info->orders[cnt]->catalog_cd_total + 1)
      if (o.orig_ord_as_flag = 0)
        output_info->orders[cnt]->orig_ord_as_flag_0_cnt =
            (output_info->orders[cnt]->orig_ord_as_flag_0_cnt + 1)
      endif
      output_info->order_cnt = (output_info->order_cnt + 1)
      stat = alterlist(output_info->orders[cnt]->ids, 1)
      output_info->orders[cnt]->ids[1]->order_id = o.order_id
      output_info->orders[cnt]->ids[1]->orig_ord_as_flag = o.orig_ord_as_flag
      output_info->orders[cnt]->ids[1]->oe_format_id = o.oe_format_id
      output_info->orders[cnt]->id_cnt = 1
    endif
foot report
 stat = alterlist(output_info->orders,cnt)
with orahintcbo("index(O XIE17ORDERS) index(OA XPKORDER_ACTION)")
 
 
if (output_info->order_cnt = 0)
  set output_info->error_message = "No Data Returned for Usernames Input"
  call write_error_message(output_info->error_message, output_filename)
  go to EXIT_SCRIPT
endif
 
;Rank Orders
select into "nl:"
nbr_of_orders = output_info->orders[d1.seq]->catalog_cd_total,
d1seq = d1.seq
from (dummyt d1 with seq = output_info->order_cnt)
plan d1
order nbr_of_orders desc, d1seq asc
head report
  previous_nbr_of_orders = nbr_of_orders
  rank_cnt = 0
detail
  if (rank_cnt < 100)
    rank_cnt = (rank_cnt + 1)
    output_info->orders[d1.seq]->rank = rank_cnt
    previous_nbr_of_orders = nbr_of_orders
  elseif ((nbr_of_orders = previous_nbr_of_orders) and (rank_cnt = 100))
    output_info->orders[d1.seq]->rank = rank_cnt
    previous_nbr_of_orders = nbr_of_orders
  else
    rank_cnt = (rank_cnt + 1)
  endif
with nullreport
 
;Get order detail data and limit orders to only those we want to display
declare order_action_type_cd = f8 with constant(uar_get_code_by("MEANING",6003,"ORDER")),protect
select into "nl:"
d1seq = d1.seq,
d2seq = d2.seq,
accept_flag = IF (oeff.accept_flag = 0) "REQUIRE"
              ELSEIF (oeff.accept_flag = 1) "OPTIONAL"
              ELSEIF (oeff.accept_flag = 2) "DO NOT DISPLAY"
              ELSEIF (oeff.accept_flag = 3) "DISPLAY ONLY"
              ELSE " "
              ENDIF,
oe_format_field_default = oeff.default_value,
oe_field_display_value = od.oe_field_display_value,
oe_field_description = oef.description
from (dummyt d1 with seq = output_info->order_cnt),
     (dummyt d2 with seq = 1),
     order_detail od,
     order_entry_fields oef,
     oe_format_fields oeff
plan d1
where maxrec(d2, output_info->orders[d1.seq]->id_cnt)
  and output_info->orders[d1.seq]->rank > 0
join d2
where output_info->orders[d1.seq]->ids[d2.seq]->orig_ord_as_flag = 0
join od
where od.order_id = output_info->orders[d1.seq]->ids[d2.seq]->order_id
  and od.action_sequence = 1
  and od.oe_field_dt_tm_value is NULL
  and od.oe_field_meaning != "ICD9"
join oef
where oef.oe_field_id = od.oe_field_id
join oeff
where oeff.oe_format_id = output_info->orders[d1.seq]->ids[d2.seq]->oe_format_id
  and oeff.oe_field_id = od.oe_field_id
  and oeff.action_type_cd = order_action_type_cd
order d1seq, oe_field_description, oe_field_display_value
head d1seq
  dcnt = 0
  stat = alterlist(output_info->orders[d1.seq]->descriptions,10)
head oe_field_description
  dcnt = (dcnt + 1)
  if ((mod(dcnt,10) = 1))
    stat = alterlist(output_info->orders[d1.seq]->descriptions, (dcnt + 9))
  endif
  output_info->orders[d1.seq]->descriptions[dcnt]->oe_field_description = oe_field_description
  output_info->orders[d1.seq]->descriptions[dcnt]->accept_flag_disp = accept_flag
  output_info->orders[d1.seq]->descriptions[dcnt]->oe_field_default_value = oe_format_field_default
  vcnt = 0
head oe_field_display_value
  vcnt = (vcnt + 1)
  stat = alterlist(output_info->orders[d1.seq]->descriptions[dcnt]->display_value, vcnt)
  stripped_var = replace(replace(oe_field_display_value, char(13), " "), char(10), " ")
  output_info->orders[d1.seq]->descriptions[dcnt]->display_value[vcnt]->oe_field_display_value = stripped_var
  output_info->orders[d1.seq]->descriptions[dcnt]->display_value[vcnt]->rank = 0
  output_info->orders[d1.seq]->descriptions[dcnt]->display_value[vcnt]->displayed_cnt = 0
  dvcnt = 0
detail
  dvcnt = (dvcnt + 1)
foot oe_field_display_value
    output_info->orders[d1.seq]->descriptions[dcnt]->display_value[vcnt]->displayed_cnt = dvcnt
foot oe_field_description
  output_info->orders[d1.seq]->descriptions[dcnt]->display_value_cnt = vcnt
foot d1seq
  stat = alterlist(output_info->orders[d1.seq]->descriptions, dcnt)
  output_info->orders[d1.seq]->desc_cnt = dcnt
with orahintcbo("index(OEFF XPKOE_FORMAT_FIELDS)")
 
;Rank display values
select into "nl:"
nbr_of_values = output_info->orders[d1.seq]->descriptions[d2.seq]->display_value[d3.seq]->displayed_cnt,
displayed_value = output_info->orders[d1.seq]->descriptions[d2.seq]->display_value[d3.seq]->oe_field_display_value,
d1seq = d1.seq,
d2seq = d2.seq
from (dummyt d1 with seq = output_info->order_cnt),
     (dummyt d2 with seq = 1),
     (dummyt d3 with seq = 1)
plan d1
where maxrec(d2, output_info->orders[d1.seq]->desc_cnt)
  and output_info->orders[d1.seq]->rank > 0
join d2
where maxrec(d3, output_info->orders[d1.seq]->descriptions[d2.seq]->display_value_cnt)
join d3
order d1seq, d2seq, nbr_of_values desc, displayed_value desc
head report
  rank = 0
head d1seq
  rank = 0
head d2seq
  rank = 0
head displayed_value
  rank = (rank + 1)
  if (rank < 6)
    output_info->orders[d1.seq]->descriptions[d2.seq]->display_value[d3.seq]->rank = rank
  endif
with nullreport
 
;output data
select into value(output_filename)
catalog_cd_disp = output_info->orders[d1.seq]->catalog_cd_disp,
cnt_of_catalog_cd_disp = output_info->orders[d1.seq]->orig_ord_as_flag_0_cnt,
order_detail_description = output_info->orders[d1.seq]->descriptions[d2.seq]->oe_field_description,
accept_flag_disp = output_info->orders[d1.seq]->descriptions[d2.seq]->accept_flag_disp,
field_default_value = output_info->orders[d1.seq]->descriptions[d2.seq]->oe_field_default_value,
field_display_value = output_info->orders[d1.seq]->descriptions[d2.seq]->display_value[d3.seq]->
                      oe_field_display_value,
nbr_of_values = output_info->orders[d1.seq]->descriptions[d2.seq]->display_value[d3.seq]->displayed_cnt
from (dummyt d1 with seq = output_info->order_cnt),
     (dummyt d2 with seq = 1),
     (dummyt d3 with seq = 1)
plan d1
where maxrec(d2, output_info->orders[d1.seq]->desc_cnt)
  and output_info->orders[d1.seq]->rank > 0
join d2
where maxrec(d3, output_info->orders[d1.seq]->descriptions[d2.seq]->display_value_cnt)
join d3
where output_info->orders[d1.seq]->descriptions[d2.seq]->display_value[d3.seq]->rank > 0
order cnt_of_catalog_cd_disp desc, catalog_cd_disp, order_detail_description, nbr_of_values desc
with nocounter, separator = "  ", format
 
 
;***** subroutines *****
 
subroutine write_error_message(error_msg,run_file)
 
   select into value(run_file)
    from dummyt d
   detail
      col 2, error_msg
   with nocounter, noheading, noformat
 
end ;subroutine write_error_message
 
 
;************************************************************************
#EXIT_SCRIPT
 
if (validate(request->batch_selection) = 1) ; Run from OPS
  if (validate(reply,0))
    set reply->status_data->status = "S"
  endif
endif
 
end
go
