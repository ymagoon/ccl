drop program 1_mhs_prsn_mtch_dup:dba go
 create program 1_mhs_prsn_mtch_dup:dba
 
/****************************************************************************
 *                                                                          *
 *  Copyright Notice:  (c) 1983 Laboratory Information Systems &            *
 *                              Technology, Inc.                            *
 *       Revision      (c) 1984-1996 Cerner Corporation                     *
 *                                                                          *
 *  Cerner (R) Proprietary Rights Notice:  All rights reserved.             *
 *  This material contains the valuable properties and trade secrets of     *
 *  Cerner Corporation of Kansas City, Missouri, United States of           *
 *  America (Cerner), embodying substantial creative efforts and            *
 *  confidential information, ideas and expressions, no part of which       *
 *  may be reproduced or transmitted in any form or by any means, or        *
 *  retained in any storage or retrieval system without the express         *
 *  written permission of Cerner.                                           *
 *                                                                          *
 *  Cerner is a registered mark of Cerner Corporation.                      *
 *                                                                          *
 ****************************************************************************
 
          Date Written:       10/01/2003
          Source file name:   mayo_mn_empi_rpt_prsn_mtch_dup.prg
          Object name:        mayo_mn_empi_rpt_prsn_mtch_dup
          Request #:          none
 
          Product:            EMPI
          Product Team:       EMPI
          HNA Version:        500
          CCL Version:
 
          Program purpose:
          Tables read:
          Tables updated:     None
          Executing from:
 
          Special Notes:
 
 **************************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                    *
 **************************************************************************
 *                                                                        *
 *Mod    Date     Engineer             Comment                            *
 *-----  -------- -------------------- -----------------------------------*
  CD000  10/01/03 Charley Donnici      Rewrite - for old mods and
                                       version see .vcl reports.
  46142   09/30/04 Nathan Gray         CAPEP00134778 - Corrected MRN pool filters
  48443  12/02/04 Nathan Gray          MRN filter removes white space
         08/06/08 Marcia Pugh          SR 1-1939267501 - Add prompt for facility; add qualifier;
                                          add column
  m061596 06/09/09 Bharti Jain		   Removed facility alias display from the report an made formatting changes
  									    in report appearance.
 ***********************************************************************
 ******************  END OF ALL MODCONTROL BLOCKS  ********************/
 
prompt
	"Output to File/Printer/MINE:" = "MINE"
	, "Start Date" = CURDATE
	, "End Date" = CURDATE
	, "MRN Pool" = "ALL"
	, "Facility Selection" = 0
 
with PROMPT1, PROMPT2, PROMPT3, prompt4, PROMPT5
 
declare searchstr = vc
declare last_mod = c5 with noconstant(""), private
declare mrn_count = i4
 
free set tmp
record tmp
  (  1 maxrow_land = i4   ; landscape page size
     1 maxrow_port = i4   ; portrait page size
  )
 
free set empi
record empi
  (  1 qual[*]
       2 flag = i2
       2 weight = c6
       2 person_matches_id = f8
       2 a_person_id = f8
       2 a_name_last = c20
       2 a_name_first = c15
       2 a_name_middle = c15
       2 a_updt_dt_tm = c10
       2 a_birth_dt_tm = c10
       2 a_atd_dt_tm = c10
       2 a_sex_cd = f8
       2 a_csystem_disp = c15
       2 a_ssn = c15
       2 a_cmrn = c15
       2 a_mrn[*]
         3 person_alias_id = f8
         3 mrn = c15
         3 pool = f8
         3 pool_disp = c15
       2 a_fac[*]                              ;mp9098
         3 facility_cd = f8                    ;mp9098
         3 facility_alias = c15                ;mp9098
       2 b_person_id = f8
       2 b_name_last = c20
       2 b_name_first = c15
       2 b_name_middle = c15
       2 b_updt_dt_tm = c10
       2 b_birth_dt_tm = c10
       2 b_atd_dt_tm = c10
       2 b_sex_cd = f8
       2 b_csystem_disp = c15
       2 b_ssn = c15
       2 b_cmrn = c15
       2 b_mrn[*]
         3 person_alias_id = f8
         3 mrn = c15
         3 pool = f8
         3 pool_disp = c15
       2 b_fac[*]                              ;mp9098
         3 facility_cd = f8                    ;mp9098
         3 facility_alias = c15                ;mp9098
   )
 
free record tmpmrn
record tmpmrn
  (
     1 qual[*]
       2 mrn_pool_cd = f8
  )
 
 
 
 
;Checks date parameters to set to curdate or numeric Date
subroutine ValidateDateParms(strParm)
  set minus = 0
  set plus = 0
  set signpos = 0
  set nodays = 0
  set lastchar = "         "
  set parmater = 0
  if (isnumeric(strParm) = 1 )
    set parameter = cnvtint(strParm)
  else
    set minus = findstring("-",strParm)
    set signpos = minus
    if (minus <= 0)
       set plus = findstring("+",strParm)
       set minus = signpos
    endif
    if( minus <= 0 and plus <= 0)
       if(cnvtupper( substring (1,7,strParm)) = "CURDATE")
          set parameter = curdate
       else
            go to exit_script
       endif
    else
      set lastchar = substring (signpos+1,size(trim(strParm))-signpos,strParm)
      if (isnumeric(lastchar) = 1 )
        set nodays = cnvtint(trim(lastchar))
        set dtparm = cnvtupper(substring(1,7,strParm))
        if( dtparm = "CURDATE")
          if( plus > 0)
            set parameter = curdate + nodays
          elseif(minus > 0)
             set parameter = curdate - nodays
          else
             go to exit_script
          endif
        else
            go to exit_script
        endif
    else
        go to exit_script
     endif
  endif
endif
  return(parameter)
end  ;ValidateDateParms
 
declare get_code_value(codeset =i4,meaning = vc) = f8
subroutine get_code_value(codeset, meaning)
  set code_returned = 0.0
  select into "nl:" c.code_value
    from code_value c
  where c.code_set = codeset
    and c.cdf_meaning = cnvtupper(trim(meaning))
    and c.active_ind = 1
    and c.begin_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
    and c.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
  detail
    code_returned = c.code_value
  with nocounter
  return(code_returned)
end ;get_code_value
 
; This routine will search to see that a pool exists
declare poolexists(inpool=f8) = i2
subroutine poolexists(inpool)
  call write_pmdebug(build("inpool:",inpool))
  if (searchstr = "ALL")
     return(TRUE)
  endif
 
  for (xx = 1 to size(tmpmrn->qual,5))
     if (tmpmrn->qual[xx].mrn_pool_cd = inpool)
        return(TRUE)
     endif
  endfor
  return(FALSE)
end ;poolexists
 
 
 
#1000_INITIALIZE
;Set the last mod command
;set last_mod = "11/07/2008 MP9098"
 
; init the  params and validate the dates fields
set parm_2 = 0
set parm_3 = 0
set parm_2 = ValidateDateParms($2)
set parm_3 = ValidateDateParms($3)
 
if(parm_3 >= 1000000 )
    set edtstr = cnvtstring(parm_3)
    if(size(trim(edtstr,3),1) = 7 )
         set edtstr = concat("0", edtstr)
    endif
    set sysedt = cnvtdate2(edtstr, "MMDDYYYY")
    set enddt = format(sysedt, "MM/DD/YYYY;;D")
else
    set enddt = format(parm_3, "MM/DD/YYYY;;D")
endif
 
if(parm_2 >= 1000000)
    set sdtstr = cnvtstring(parm_2)
    if(size(trim(sdtstr,3),1) = 7)
        set sdtstr = concat("0", sdtstr)
    endif
    set syssdt = cnvtdate2(sdtstr, "MMDDYYYY")
    set startdt = format(syssdt, "MM/DD/YYYY;;D")
else
    set startdt = format(parm_2, "MM/DD/YYYY;;D")
endif
 
set isodbc = 0
 
;Request HNAM sign-on when executed from CCL on host
if (validate(IsOdbc, 0) = 0)
  execute cclseclogin
endif
 
if (cursys = "AXP")
  set tmp->maxrow_land = 48
  set tmp->maxrow_port = 65
else ;*** aix sites
  set tmp->maxrow_land = 47
  set tmp->maxrow_port = 64
endif
 
set date = format(curdate, 'MM/DD/YYYY;;D')
set time = cnvtupper(format(curtime3, ' HH:MM:SS;;S'))
set today = concat(date, time)
 
;Grab the domain information
set domain = fillstring(10," ")
select into "nl:" v.name
from v$database v
detail
if (v.name = "MHPRB")
	domain = "MHPRD"
else
  domain = v.name
endif
with nocounter
 
set cnt = 0
set ssn_cd = 0.0
set mrn_cd = 0.0
set cmrn_cd = 0.0
set cmrn_cd = get_code_value(4,"CMRN")
set ssn_cd = get_code_value(4,"SSN")
set mrn_cd = get_code_value(4,"MRN")
#1099_INITIALIZE_EXIT
 
#6000_REPORT
set count = 0
set Start_time = cnvtdatetime(curdate,curtime3)
select distinct into "nl:"
   p1.name_full_formatted,
   p2.name_full_formatted,
    p.seq,
    birth_tz_1 = validate(p1.birth_tz, 0),   ;JS007
    birth_tz_2 = validate(p2.birth_tz, 0)    ;JS007
from person_matches p,
     person p1, person p2,
     person_patient pp1, person_patient pp2
     , encounter e1        ; join to encounter, this one is for a_person
     , encounter e2        ; join to encounter, this one is for b_person
     , dummyt d1            ; have to join to the dummyt table for outerjoin
     , dummyt d2
 
plan p where p.match_dt_tm >= cnvtdatetime(cnvtdate2(startdt,"MM/DD/YYYY"), 0)
  and p.match_dt_tm <= cnvtdatetime(cnvtdate2(enddt,"MM/DD/YYYY"),235959)
     and ((p.a_person_id in(select person_id from encounter e1 where e1.person_id = p.a_person_id
                               and e1.loc_facility_cd = $5))
          or (p.b_person_id in(select person_id from encounter e2 where e2.person_id = p.b_person_id
                               and e2.loc_facility_cd = $5)))
 
  and p.active_ind +0 = 1
  and p.beg_effective_dt_tm +0 <= cnvtdatetime(curdate,curtime3)
  and p.end_effective_dt_tm +0 >= cnvtdatetime(curdate,curtime3)
join p1 where p1.person_id = p.a_person_id
  and p1.active_ind +0 = 1
  and p1.beg_effective_dt_tm +0 <= cnvtdatetime(curdate,curtime3)
  and p1.end_effective_dt_tm +0 >= cnvtdatetime(curdate,curtime3)
join pp1 where outerjoin(p1.person_id) = pp1.person_id
  and pp1.active_ind = outerjoin(1)
  and pp1.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
  and pp1.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
join p2 where p2.person_id = p.b_person_id
  and p2.active_ind +0 = 1
  and p2.beg_effective_dt_tm +0 <= cnvtdatetime(curdate,curtime3)
  and p2.end_effective_dt_tm +0 >= cnvtdatetime(curdate,curtime3)
join pp2 where outerjoin(p2.person_id) = pp2.person_id
  and pp2.active_ind = outerjoin(1)
  and pp2.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
  and pp2.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
  join d1
  join e1 where e1.person_id = p.a_person_id ;and e1.loc_facility_cd = $5
  ; and (e1.loc_facility_cd = $5 or e1.loc_facility_cd = NULL)
  join d2
  join e2 where e2.person_id = p.b_person_id ; and e2.loc_facility_cd = $5
  ; and (e2.loc_facility_cd = $5 or e2.loc_facility_cd = NULL)
order p.person_matches_id, p.match_weight desc, p1.name_last_key
 
detail
count = count + 1
  stat = alterlist(empi->qual,count)
  empi->qual[count].flag = 1
  empi->qual[count].weight = format(p.match_weight, "###.##")
  empi->qual[count].person_matches_id = p.person_matches_id
  empi->qual[count].a_person_id = p.a_person_id
  empi->qual[count].a_name_last = substring(1,20,p1.name_last)
  empi->qual[count].a_name_first = substring(1,15,p1.name_first)
  empi->qual[count].a_name_middle = substring(1,15,p1.name_middle)
  empi->qual[count].a_updt_dt_tm = format(p1.updt_dt_tm, "mm/dd/yyyy;;d")
  empi->qual[count].a_birth_dt_tm = format(datetimezone(p1.birth_dt_tm, birth_tz_1), "mm/dd/yyyy;4;d")
  empi->qual[count].a_atd_dt_tm = format(pp1.last_atd_activity_dt_tm, "mm/dd/yyyy;;d")
  empi->qual[count].a_sex_cd = p1.sex_cd
  empi->qual[count].a_csystem_disp = substring(1,20,uar_get_code_display(p1.contributor_system_cd))
  empi->qual[count].b_person_id = p.b_person_id
  empi->qual[count].b_name_last = substring(1,20,p2.name_last)
  empi->qual[count].b_name_first = substring(1,15,p2.name_first)
  empi->qual[count].b_name_middle = substring(1,15,p2.name_middle)
  empi->qual[count].b_updt_dt_tm = format(p2.updt_dt_tm, "mm/dd/yyyy;;d")
  empi->qual[count].b_birth_dt_tm = format(datetimezone(p2.birth_dt_tm, birth_tz_2), "mm/dd/yyyy;4;d")
  empi->qual[count].b_atd_dt_tm = format(pp2.last_atd_activity_dt_tm, "mm/dd/yyyy;;d")
  empi->qual[count].b_sex_cd = p2.sex_cd
  empi->qual[count].b_csystem_disp = substring(1,20,uar_get_code_display(p2.contributor_system_cd))
with dontcare = e1, dontcare = e2, outerjoin = d1, outerjoin = d2, nocounter
;,skipreport = 1, format, separator=" "
 
;Select Person Alias Information for A Person
if (size(empi->qual, 5) > 0)
  select into "nl:" p.seq
    from person_alias p, code_value c,
    ( DUMMYT  D WITH SEQ = value(size(EMPI->QUAL ,5)) )
  plan d
  join p where p.person_id = empi->qual[d.seq].a_person_id
   and p.person_alias_type_cd in (ssn_cd, mrn_cd, cmrn_cd)
   and p.active_ind = 1
   and p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
   and p.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
  join c where p.alias_pool_cd = c.code_value
  order by cnvtdatetime(p.updt_dt_tm) desc
  detail
   if (p.person_alias_type_cd = ssn_cd)
      empi->qual[d.seq]->a_ssn = substring(1,15,cnvtalias(p.alias,p.alias_pool_cd))
    elseif (p.person_alias_type_cd = cmrn_cd)
      empi->qual[d.seq]->a_cmrn = substring(1,15,cnvtalias(p.alias,p.alias_pool_cd))
    elseif (p.person_alias_type_cd = mrn_cd )
          if (textlen(substring(1,15,cnvtalias(p.alias,p.alias_pool_cd)))  > 0)
            mrncnt = size(empi->qual[d.seq]->a_mrn,5) + 1
            stat = alterlist(empi->qual[d.seq]->a_mrn, mrncnt)
            empi->qual[d.seq]->a_mrn[mrncnt]->person_alias_id = p.person_alias_id
            empi->qual[d.seq]->a_mrn[mrncnt]->mrn = substring(1,15,cnvtalias(p.alias,p.alias_pool_cd))
            empi->qual[d.seq]->a_mrn[mrncnt]->pool = -1
            if (p.alias_pool_cd > 0)
              empi->qual[d.seq]->a_mrn[mrncnt]->pool = p.alias_pool_cd
            endif
            empi->qual[d.seq]->a_mrn[mrncnt]->pool_disp = substring(1,15,c.display)
          endif
        endif
  with nocounter
 
;Select Person Alias Information for the B Person
  select into "nl:" p.seq
    from person_alias p, code_value c,
       ( DUMMYT  D WITH SEQ = value(size(EMPI->QUAL ,5)) )
   plan d
   join p where p.person_id = empi->qual[d.seq].b_person_id
    and p.person_alias_type_cd in (ssn_cd, mrn_cd,cmrn_cd)
    and p.active_ind = 1
    and p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
    and p.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
   join c where p.alias_pool_cd = c.code_value
   order by cnvtdatetime(p.updt_dt_tm) desc
   detail
     if (p.person_alias_type_cd = ssn_cd)
       empi->qual[d.seq]->b_ssn = substring(1,15,cnvtalias(p.alias,p.alias_pool_cd))
       elseif (p.person_alias_type_cd = cmrn_cd)
       empi->qual[d.seq]->b_cmrn = substring(1,15,cnvtalias(p.alias,p.alias_pool_cd))
     elseif (p.person_alias_type_cd = mrn_cd )
          if (textlen(substring(1,15,cnvtalias(p.alias,p.alias_pool_cd)))  > 0)
             mrncnt = size(empi->qual[d.seq]->b_mrn,5) + 1
             stat = alterlist(empi->qual[d.seq]->b_mrn, mrncnt)
             empi->qual[d.seq]->b_mrn[mrncnt]->person_alias_id = p.person_alias_id
             empi->qual[d.seq]->b_mrn[mrncnt]->mrn = substring(1,15,cnvtalias(p.alias,p.alias_pool_cd))
             empi->qual[d.seq]->b_mrn[mrncnt]->pool = p.alias_pool_cd
             empi->qual[d.seq]->b_mrn[mrncnt]->pool_disp = substring(1,15,c.display)
           endif
     endif
   with nocounter
 
;MP9098 - Added next selects to identify the facility outbound alias.
 
    select into "nl:"
    from (dummyt d with seq = value(size(EMPI->QUAL ,5))),
         encounter e,
         code_value_outbound cvo
    plan d
    join e
    where e.person_id = empi->qual[d.seq].a_person_id
      and e.active_ind = TRUE
      and e.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
      and e.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
    join cvo
        where e.loc_facility_cd = cvo.code_value
        and cvo.contributor_source_cd = 25047293.00 ;MAYO
        and cvo.code_set = 220
        and cvo.alias_type_meaning = "FACILITY"
    head d.seq
        acnt = 0
    detail
        acnt = acnt + 1
        stat = alterlist(empi->qual[d.seq]->a_fac, acnt)
        empi->qual[d.seq]->a_fac[acnt].facility_cd = e.loc_facility_cd
        empi->qual[d.seq]->a_fac[acnt].facility_alias = cvo.alias
    with nocounter
 
 
    select into "nl:"
    from (dummyt d with seq = value(size(EMPI->QUAL ,5))),
         encounter e,
         code_value_outbound cvo
    plan d
    join e
    where e.person_id = empi->qual[d.seq].b_person_id
      and e.active_ind = TRUE
      and e.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
      and e.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
    join cvo
        where e.loc_facility_cd = cvo.code_value
        and cvo.contributor_source_cd = 25047293.00 ;MAYO
        and cvo.code_set = 220
        and cvo.alias_type_meaning = "FACILITY"
    head d.seq
        bcnt = 0
    detail
        bcnt = bcnt + 1
        stat = alterlist(empi->qual[d.seq]->b_fac, bcnt)
        empi->qual[d.seq]->b_fac[bcnt].facility_cd = e.loc_facility_cd
        empi->qual[d.seq]->b_fac[bcnt].facility_alias = cvo.alias
    with nocounter
 
 
;*** FROM_CMRN ***
;      set cmrncnt = 0
;      select into "nl:"
;      from (dummyt d with seq = value(size(EMPI->QUAL ,5))),
;       person_combine_det p, person_alias a
;       plan d
;      join p where p.person_combine_id = empi->qual[d.seq].a_person_id
;        and trim(p.entity_name) = "PERSON_ALIAS"
;        and trim(p.attribute_name) = "PERSON_ID"
;        and p.active_ind +0 = 1
;    ;    and p.active_status_cd = 188 ;m061596
;      join a where a.person_alias_id = p.entity_id
;        and a.person_alias_type_cd +0 = cmrn_cd
;      detail
;        if (substring(1,15,cnvtalias(a.alias,a.alias_pool_cd)) > " ")
;       empi->qual[d.seq].a_mrn[bcnt].cmrn  = substring(1,15,cnvtalias(a.alias,a.alias_pool_cd))
;        endif
;      with nocounter
;
endif
;
 
 
;Calculate the processing time and report it
set total_seconds = datetimediff(cnvtdatetime(curdate,curtime3), start_time) * (24 * 60 * 60)
call echo(concat(build("Time: " , total_seconds)  , " Seconds"))
 
;Store the search parameter
 
set searchstr = cnvtalphanum(cnvtupper(trim($4,3))) ;48443 added: cnvtalphanum()
 
set chkpool = 0 ;46142
;If not all then scan alias pools
if (searchstr != "ALL")
  set chkpool = 1 ;46142 chkpool = 0
  set mrn_count = 0
 
  ;Pad asteriks
  set searchstr = concat("*",searchstr,"*")
 
  ;Scan the alias pool code set for matches on display key
  select into "nl:" c.seq
  from code_value c
  where c.display_key = patstring(searchstr) ;cnvtupper(cnvtalphanum($4))
    and c.code_set = 263
;    and c.active_ind = 1
;    and c.begin_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
;    and c.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
  order by c.code_value desc
  detail
    mrn_count = mrn_count + 1
    if (mrn_count > size(tmpmrn->qual,5))
      stat = alterlist(tmpmrn->qual,mrn_count+10)
    endif
    tmpmrn->qual[mrn_count].mrn_pool_cd = c.code_value
  with nocounter
endif
 
 
;Resize it to the size of mrn_count
set stat = alterlist(tmpmrn->qual,mrn_count)
 
  for (xx = 1 to size(tmpmrn->qual,5))
     call write_pmdebug(build("mrn_pool:",tmpmrn->qual[xx].mrn_pool_cd))
  endfor
 
 
call write_pmdebug(build("curqual:",curqual))
call write_pmdebug(build("size:",size(tmpmrn->qual,5)))
call write_pmdebug(build("searchstr:",searchstr))
 
;if we don't get any rows then set chkpool = 0
;46142 if (curqual = 1)
;46142   set chkpool = 1
;46142 else
;46142   set chkpool = 0
;46142 endif
 
;Figure out flag values by checking all matches and their alias pools.
set y = 0
set yy = 0
set yyy = 0
set actcnt = 0
for (y = 1 to size(empi->qual,5))
  for (yy = 1 to size(empi->qual[y]->b_mrn,5))
    for (yyy = 1 to size(empi->qual[y]->a_mrn,5))
      if (empi->qual[y]->a_mrn[yyy].pool = empi->qual[y]->b_mrn[yy].pool)
        if ( (poolexists(empi->qual[y]->a_mrn[yyy].pool) = TRUE) or (chkpool = 0) ) ;46142 added ()
          set empi->qual[y].flag = 1
        endif
      endif
    endfor
  endfor
 
  ;46142 if (size(empi->qual[y]->b_mrn,5) = 0 and size(empi->qual[y]->a_mrn,5) = 0 )
  if ((size(empi->qual[y]->b_mrn,5) = 0) and (size(empi->qual[y]->a_mrn,5) = 0 ) and (chkpool = 0))
    set empi->qual[y].flag = 1
  endif
 
  if (empi->qual[y].flag = 1)
    set actcnt = actcnt + 1
  endif
endfor
 
 
 
set range1 =  concat(startdt," - ",enddt)
;Resize the query
set actcnt2 = size(empi->qual, 5)
 
 
;set maximum execute time for query/report
set MaxSecs = 0
if (validate(IsOdbc, 0) = 1)
   set maxsecs = 15
endif
 
call echorecord(empi)
 
;Report query
select into $prompt1
empi->qual[d.seq].a_name_last,
  p.person_matches_id
from
  person_matches p,
  ( dummyt d with seq = value(size(empi->qual ,5)) )
plan d where empi->qual[d.seq]->person_matches_id > 0.0
join p where  p.person_matches_id = empi->qual[d.seq]->person_matches_id
  and p.person_matches_id > 0.0
  and p.active_ind = 1
order by empi->qual[d.seq].weight desc,
         empi->qual[d.seq].a_name_last desc
head report
        row 1 col 65 "EMPI Possible Duplicates Report - ", domain
      ;  row 1 col 129 "mayo_mn_empi_rpt_prsn_mtch_dup"
        row 2 col 2 "Run Date:"
        row 2 col 22 today
        row 3 col 2 "Date Range: "
        ROW 3 COL 23 range1
       ; row 3 col 22 startdt
       ; row 4 col 22 "To"
       ; row 5 col 22 enddt
        row 4 col 2 "Total Matches: "
        row 4 col 15 actcnt
        row + 1
 
Head Page
        col 160  "Page No: ", curpage
        row + 1
 
Detail
        cnt = cnt + 1
 
      if (empi->qual[d.seq].flag = 1) ; 46142 only add a row if there is data to display
;          row + 1
 
  sep = fillstring(195,"-")        ;mp9098 150 to 198 since list 4 columns need to be moved to right
       ;   row + 1
          col 1 sep
          row + 1
          weight = fillstring(6," ")
          pid =  fillstring(10," ")
          lname =  fillstring(22," ")
          fname = fillstring(15," ")
          mi =  fillstring(15," ")
          sex =  fillstring(5," ")
          dob = fillstring(11," ")
          ssn =  fillstring(12," ")
          consys =  fillstring(15," ")     ;mp9098 changed 10 to 15 to match the c15 in the record structure
          atd =  fillstring(10," ")
          mrn =  fillstring(15," ")        ;mp9098 changed 13 to 15 to match the c15 in the record structure
          cmrn = fillstring(15," ")
          pool =  fillstring(15," ")       ;mp9098 changed 12 to 15 to match the c15 in the record structure
 
          ;46142 MOVED ABOVE cnt = cnt + 1
          ;46142 MOVED ABOVE        if (empi->qual[cnt].flag = 1)
;          sep = fillstring(180,"-")        ;mp9098 150 to 198 since list 4 columns need to be moved to right
;       ;   row + 1
;          col 1 sep
;          row + 1
 
          weight = trim(empi->qual[d.seq].weight,3)
          col 1 weight
          col 8 "Last Name"
          col 30 "First Name"
          col 45 "Middle Name"
          col 60 "DOB"
          col 74 "Sex"
          col 80 "SSN"
          col 94 "MRN"
          col 108 "CMRN"
          col 126 "MRN Pool"
;          col 121 "Fac Alias"
;          col 131 "PID"
;          col 142 "C Sys"
;          col 158 "Last Activity"
	      col 142 "PID"
          col 156 "C Sys"
          col 174 "Last Activity"
          row + 1
 
          pid = trim(cnvtstring(empi->qual[d.seq].a_person_id),3)
          lname = trim(empi->qual[d.seq].a_name_last,3)
          fname = trim(empi->qual[d.seq].a_name_first,3)
          mi = trim(empi->qual[d.seq].a_name_middle,3)
          sex = substring(1,1,uar_get_code_display(empi->qual[d.seq].a_sex_cd))
          dob = trim(empi->qual[d.seq].a_birth_dt_tm,3)
          ssn = trim(empi->qual[d.seq].a_ssn,3)
          consys = trim(empi->qual[d.seq].a_csystem_disp,3)
          atd = trim(empi->qual[d.seq].a_atd_dt_tm,3)
          mrn = trim(empi->qual[d.seq]->a_mrn[1].mrn,3)
          cmrn = trim(empi->qual[d.seq]->a_cmrn,3)
          pool = trim(empi->qual[d.seq]->a_mrn[1].pool_disp,3)
 
          col 3  "A:"
          col 8 lname
          col 30 fname
          col 45 mi
          col 60 dob
          col 74 sex
          col 80 ssn
          col 94 mrn
          col 108 cmrn
          col 126 pool
          col 142 pid
          col 156 consys
          col 174 atd
 
          row + 1
         ; arow = row
          if (size(empi->qual[d.seq]->a_mrn,5) >1)
            for (xx = 2 to size(empi->qual[d.seq]->a_mrn,5))
              mrn = trim(empi->qual[d.seq]->a_mrn[xx].mrn,3)
              pool = trim(empi->qual[d.seq]->a_mrn[xx].pool_disp,3)
              col 94 mrn
              col 112 pool
              row + 1
            endfor
          endif
;	row arow-1
;mp9098 - Added the following IF to display/print the facility outbound alias
  ;  arow = row
;	afaccnt = 0
;	afaccnt = size(empi->qual[cnt].a_fac, 5)
;	if (afaccnt > 0)
;	   for (i = 1 to afaccnt)
;	       aout_row = cnvtint(arow + i - 1)
;	      ; afac_disp = substring(1, 5, empi->qual[cnt].a_fac[i].facility_alias)
;	       ;row aout_row,
;	       ;col 121, afac_disp
;	      ; row +1
;	   endfor
;	 else row + 1
;	endif
 
 
          weight = fillstring(6," ")
          pid =  fillstring(10," ")
          lname =  fillstring(22," ")
          fname = fillstring(15," ")
          mi =  fillstring(15," ")
          sex =  fillstring(5," ")
          dob = fillstring(11," ")
          ssn =  fillstring(12," ")
          consys =  fillstring(15," ")           ;mp9098 changed 10 to 15 to match the c15 in the record structure
          atd =  fillstring(10," ")
          mrn =  fillstring(15," ")              ;mp9098 changed 13 to 15 to match the c15 in the record structure
          pool =  fillstring(15," ")             ;mp9098 changed 12 to 15 to match the c15 in the record structure
           cmrn = fillstring(15," ")
 
          pid = trim(cnvtstring(empi->qual[d.seq].b_person_id),3)
          lname = trim(empi->qual[d.seq].b_name_last,3)
          fname= trim(empi->qual[d.seq].b_name_first,3)
          mi = trim(empi->qual[d.seq].b_name_middle,3)
          sex = substring(1,1,uar_get_code_display(empi->qual[d.seq].b_sex_cd))
          dob = trim(empi->qual[d.seq].b_birth_dt_tm,3)
          ssn = trim(empi->qual[d.seq].b_ssn,3)
          consys = trim(empi->qual[d.seq].b_csystem_disp,3)
          atd = trim(empi->qual[d.seq].b_atd_dt_tm,3)
          mrn = trim(empi->qual[d.seq]->b_mrn[1].mrn,3)
          pool = trim(empi->qual[d.seq]->b_mrn[1].pool_disp,3)
           cmrn = trim(empi->qual[d.seq]->b_cmrn,3)
 
          col 3  "B:"
          col 8 lname
          col 30 fname
          col 45 mi
          col 60 dob
          col 74 sex
          col 80 ssn
          col 94 mrn
          col 108 cmrn
          col 126 pool
          col 142 pid
          col 156 consys
          col 174 atd
 
          row + 1
       ;   brow = row
          if (size(empi->qual[d.seq]->b_mrn,5) >1)
            for (xx = 2 to size(empi->qual[d.seq]->b_mrn,5))
              mrn = trim(empi->qual[d.seq]->b_mrn[xx].mrn,3)
              pool = trim(empi->qual[d.seq]->b_mrn[xx].pool_disp,3)
              col 94 mrn
              col 126 pool
              row + 1
            endfor
          endif
	;row brow-1
;mp9098 - Added the following IF to display/print the facility outbound alias
 ;   brow = row
;	bfaccnt = 0
;	bfaccnt = size(empi->qual[cnt].b_fac, 5)
;	if (bfaccnt > 0)
;	   for (i = 1 to bfaccnt)
;	       bout_row = cnvtint(brow + i - 1)
;	       ;bfac_disp = substring(1, 5, empi->qual[cnt].b_fac[i].facility_alias)
;	       ;row bout_row,
;	       ;col 121, bfac_disp
;	       ;row +1
;	   endfor
;	else row + 1
;	endif
       ;col 1 sep
      endif
   col 1 sep
foot report
 
 
        col 72 "<END OF REPORT>"
 
with maxcol = 200, maxrow = value(tmp->maxrow_land), nocounter, landscape, compress, nullreport,
     ;skipreport = 1, format, separator = " "
     format = variable, noheading, time = value(maxsecs)
 
!report epilog
if (validate(reply,0))
  set reply->status_data->status = "S"
endif
 
if (validate(request, 0))
  if (reqinfo->updt_req = 4903)
    set out_p = build($1,".dat")
    set spool = value(out_p) value(request->output_dist)
  endif
endif
 
#6000_REPORT_EXIT
#exit_script
 
;Clean up structures
free set tmp
free set empi
free record tmpmrn
 
declare write_pmdebug(intxt = vc) = i2
subroutine write_pmdebug(intxt)
   declare pmdebug_h = c132
   set pmdebug_h = intxt
   declare tmpMin = i4
   select into "empi_report.dat"
   from dummyt d
   foot report
        pmdebug_h
   with nocounter, append,format= variable, maxrow = 1, maxcol = 200
end ;write_pmdebug
 
end
go
 
