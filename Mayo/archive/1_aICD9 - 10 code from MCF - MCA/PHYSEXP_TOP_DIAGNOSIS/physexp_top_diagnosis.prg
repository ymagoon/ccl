drop program physexp_top_diagnosis go
create program physexp_top_diagnosis
 
prompt
	"Output to File/Printer/MINE" = "MINE"                                  ;* Enter or select the printer or file name to send th
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
 
;Load Output information
free record output_info
record output_info
(
  1 id_cnt = i2
  1 ids[*]
    2 user_id = f8
  1 identifier_cnt = i4
  1 identifier [*]
    2 source_identifier = c50
    2 nbr_of_identifiers = i4
    2 rank = i2
    2 string_cnt = i4
    2 string [*]
      3 nomenclature_id = f8
      3 nbr_of_strings = i4
  1 error_message = vc
 
)
set output_info->id_cnt = 0
set output_info->identifier_cnt = 0
 
 
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
    stat = alterlist(output_info->ids,10)
  detail
    cnt = (cnt + 1)
    if ((mod(cnt,10) = 1))
      stat = alterlist(output_info->ids, (cnt + 9))
    endif
    output_info->ids[cnt]->user_id = p.person_id
  foot report
    stat = alterlist(output_info->ids,cnt)
    output_info->id_cnt = cnt
  with nullreport
  if (output_info->id_cnt = 0)
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
    stat = alterlist(output_info->ids,10)
  detail
    cnt = (cnt + 1)
    if ((mod(cnt,10) = 1))
      stat = alterlist(output_info->ids, (cnt + 9))
    endif
    output_info->ids[cnt]->user_id = p.person_id
  foot report
    stat = alterlist(output_info->ids,cnt)
    output_info->id_cnt = cnt
  with nullreport
  if (output_info->id_cnt = 0)
    set input_info->error_message = "No Users found for Usernames Input"
    call write_error_message(input_info->error_message, output_filename)
    go to EXIT_SCRIPT
  endif
endif
 
;Load Diagnosis info
select into "nl:"
n.nomenclature_id,
n.source_identifier
from (dummyt d1 with seq = output_info->id_cnt),
     diagnosis d,
     nomenclature n
plan d
where d.updt_dt_tm >= cnvtdatetime(begindate,000000)
  and d.updt_dt_tm <= cnvtdatetime(enddate,235959)
join d1
where output_info->ids[d1.seq]->user_id = d.diag_prsnl_id
join n
where n.nomenclature_id = d.nomenclature_id
  and n.active_ind = 1
order n.source_identifier, n.nomenclature_id
head report
  identifier_cnt = 0
  stat = alterlist(output_info->identifier,100)
  string_cnt = 0
head n.source_identifier
  identifier_cnt = (identifier_cnt + 1)
  if ((mod(identifier_cnt,100) = 1))
    stat = alterlist(output_info->identifier, (identifier_cnt + 99))
  endif
  output_info->identifier[identifier_cnt]->source_identifier = n.source_identifier
  output_info->identifier[identifier_cnt]->nbr_of_identifiers = 0
  string_cnt = 0
  stat = alterlist(output_info->identifier[identifier_cnt]->string,10)
head n.nomenclature_id
  string_cnt = (string_cnt + 1)
  if ((mod(string_cnt,10) = 1))
    stat = alterlist(output_info->identifier[identifier_cnt]->string, (string_cnt + 9))
  endif
  output_info->identifier[identifier_cnt]->string[string_cnt]->nbr_of_strings = 0
  output_info->identifier[identifier_cnt]->string[string_cnt]->nomenclature_id = n.nomenclature_id
detail
  output_info->identifier[identifier_cnt]->string[string_cnt]->nbr_of_strings =
      (output_info->identifier[identifier_cnt]->string[string_cnt]->nbr_of_strings + 1)
foot n.nomenclature_id
  output_info->identifier[identifier_cnt]->nbr_of_identifiers =
      (output_info->identifier[identifier_cnt]->nbr_of_identifiers +
       output_info->identifier[identifier_cnt]->string[string_cnt]->nbr_of_strings)
foot n.source_identifier
  stat = alterlist(output_info->identifier[identifier_cnt]->string,string_cnt)
  output_info->identifier[identifier_cnt]->string_cnt = string_cnt
foot report
 stat = alterlist(output_info->identifier,identifier_cnt)
 output_info->identifier_cnt = identifier_cnt
with nullreport
 
;Rank
select into "nl:"
d1seq = d1.seq,
nbr_of_identifiers = output_info->identifier[d1.seq]->nbr_of_identifiers
from (dummyt d1 with seq = output_info->identifier_cnt)
plan d1
order nbr_of_identifiers desc, d1seq asc
head report
  previous_nbr_of_identifiers = nbr_of_identifiers
  rank_cnt = 0
head d1seq
  if (rank_cnt < 100)
    rank_cnt = (rank_cnt + 1)
    output_info->identifier[d1.seq]->rank = rank_cnt
  elseif ((nbr_of_identifiers = previous_nbr_of_identifiers) and (rank_cnt = 100))
    output_info->identifier[d1.seq]->rank = rank_cnt
    previous_nbr_of_identifiers = nbr_of_identifiers
  else
    rank_cnt = (rank_cnt + 1)
  endif
with nullreport
 
;output data
select into value(output_filename)
source_identifier = output_info->identifier[d1.seq]->source_identifier,
nbr_of_identifiers = output_info->identifier[d1.seq]->nbr_of_identifiers,
source_string = trim(n.source_string),
nbr_of_strings = output_info->identifier[d1.seq]->string[d2.seq]->nbr_of_strings
from (dummyt d1 with seq = output_info->identifier_cnt),
     (dummyt d2 with seq = 1),
     nomenclature n
plan d1
where maxrec(d2, output_info->identifier[d1.seq]->string_cnt)
  and output_info->identifier[d1.seq]->rank > 0
join d2
join n
where n.nomenclature_id = output_info->identifier[d1.seq]->string[d2.seq]->nomenclature_id
order nbr_of_identifiers desc, source_identifier asc, nbr_of_strings desc, source_string asc
with nocounter, separator = " ", format
 
 
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
