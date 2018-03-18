drop program 1_MHS_MHS_EMPI_PRSN_CMB_2 go
create program 1_MHS_MHS_EMPI_PRSN_CMB_2
 
/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/
 
/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
 
/**************************************************************
; DVDev Start Coding
**************************************************************/
 
 
;    Your Code Goes Here
 
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
 
          Date Written:       10/28/2003
          Source file name:   mayo_mn_empi_rpt_prsn_cmb.prg
          Object name:        mayo_mn_empi_rpt_prsn_cmb
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
 
/*** Modification log **
Mod     Date     Engineer                      Description
------- -------- ----------------------------- -------------------------------------------------
001     01/22/01 Jared Nyhus                   Feature 15487
002     04/20/01 Chris Huber                   Feature 17456
003     05/14/01 Jared Nyhus                   Took out set true and set false commands
004     02/12/02 Jacy Conley                   Feature 23496
JE005   03/19/03 Justin Ellis                  Feature 31533
JS006   04/03/03 Jennifer Song                 Feature 31683
49187   12/08/04 Charley Donnici/Justin Ellis  Corrected CAPEP00148799
143985  07/25/07 Joy Circo                     CR 1-1132349365 - Display details on all combines
MP9098  08/05/08 Marcia Pugh                   SR 1-1939267501 - Add prompt for facility; add qualifier;
                                                  add column
SE007	09/29/09 Akcia, Inc					    change combine date to pull from person_combine table instead of
												person table
 
 
ASYST CHANGES
m061596	04/10/2009 		- MAde changes in qualification of the query and made formatting
						  changes to make geniric to all sites
m001484	07/12/2010		- Changed sort order to last name/first name. CAB 14964
*/
 
;prompts
;mp9098 - Added prompt4 - Facility Selection.
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Start Date:" = CURDATE
	, "End Date:" = CURDATE
	, "Facility Selection:" = ""
 
with OUTDEV, STARTDATE, ENDDATE, FACILITY
;below 4 statements commented by m061596
 
;declare last_mod = c6 with noconstant(""), private    ;JS006
;set last_mod = "JS006"                                              ;JS006
;set last_mod = "143985" ;143985
;set last_mod = "08/08/2008 MP9098"     ;mp9098
 
;report prolog
; START 002 *****************
;CHECKS  DATE PARMAMETERS TO SET to CURDATE or Numeric Date
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
End
 
 
set parm_2 = 0
set parm_3 = 0
set parm_2 = ValidateDateParms($2)
set parm_3 = ValidateDateParms($3)
call echo(build("start date: ", parm_2))
call echo(build("end date: ", parm_3))
 
;END 004 MODS ***************
 
 
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
 
set range1 =  concat(startdt," - ",enddt)
 
;Request HNAM sign-on when executed from CCL on host
IF (VALIDATE(IsOdbc, 0) = 0)  EXECUTE CCLSECLOGIN  ENDIF
 
free set tmp
record tmp
(  1 maxrow_land = i4   ; landscape page size
   1 maxrow_port = i4   ; portrait page size
)
 
 if (cursys = "AXP")
   set tmp->maxrow_land = 48
   set tmp->maxrow_port = 65
 else ;*** aix sites
   set tmp->maxrow_land = 47
   set tmp->maxrow_port = 64
 endif
 
free set pmrptcombinelist
  record pmrptcombinelist
  (  1 list[*]
       2 person_combine_id = f8
       2 weight = i4
       2 app_flag = i2
       2 trans_type = c8
       2 to_person_id = f8
       2 to_name_full_formatted = c20
       2 to_birth_dt_tm = c10
       2 to_sex_cd = f8
       2 to_ssn = c15
       2 to_mrn[*]
         3 mrn = c15
         3 pool = c15
         3 source = c10
       2 to_cmrn = c15
       2 to_fac[*]                             ;mp9098
         3 facility_cd = f8                    ;mp9098
         3 facility_alias = vc                 ;mp9098
       2 to_contributor_system_disp = c14
       2 to_facility_desc[*]
         3 desc = c13
         3 code = f8
       2 to_combine_dt_tm = c20                ;JE005
       2 from_person_id = f8
       2 from_name_full_formatted = c20
       2 from_birth_dt_tm = c10
       2 from_sex_cd = f8
       2 from_ssn = c15
       2 from_mrn[*]
         3 mrn = c15
         3 pool = c15
         3 source = c10
       2 from_cmrn = c15
       2 from_contributor_system_disp = c14
       2 from_facility_desc[*]
         3 desc = c13
         3 code = f8
      2 from_combine_dt_tm = c20                ;JE005
   )
 
;JE005 ++
declare date = vc with noconstant("") ;49187
declare AUTH          = f8 with public;, noconstant(0.0)
declare page_nu = vc with noconstant("")
set date = format(curdate, 'MM/DD/YYYY ;;D')
set time = cnvtupper(format(curtime3, ' HH:MM:SS;;S'))
;declare previous_fac_exists = f8 with public
;set	previous_fac_exists = 0
set today = concat(date,time)
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
 ;JE005--
 
 
  subroutine firststring(astring, bstring)
    if (astring > bstring)
        return(bstring)
    else
        return(astring)
    endif
  end
 
  subroutine get_code_value(codeset, meaning)
   set code_returned = 0.0
   select into "nl:" cv.code_value
    from   code_value cv
     where  cv.code_set = codeset
      and    cv.cdf_meaning = cnvtupper(trim(meaning))
      and    cv.active_ind = 1
   ;   and cv.active_type_cd = 188 ;m061596
      and    cv.begin_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
      and    cv.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
   detail
     code_returned = cv.code_value
   with nocounter
   return(code_returned)
  End
 
  set debug = "0"
;  set TRUE = 1
;  set FALSE = 0
  set cnt = 0
  set dt = 0
  set ssn_cd = 0
  set mrn_cd = 0
  set cmrn_cd = 0
  set rec_invalid_cd = 0
  set rec_unknown_cd = 0
  set rec_active_cd = 0
  set rec_combined_cd = 0
  set rec_deleted_cd = 0
  set rec_inactive_cd = 0
  set rec_review_cd = 0
  set male_cd = 0
  set female_cd = 0
  set unknown_cd = 0
  set other_cd = 0
  set file_name = concat("cer_log:PRSNCMBN",format(curdate,"ddmmmyyyy;;d"),".DAT")
  set rptcombinecnt = 0
  set mrncnt = 0
  set cur_row = 0.0
  set mrn_cd =          get_code_value(4,"MRN")
  set chart_num_cd = get_code_value(4,"CHART_NUM")
  set ssn_cd =          get_code_value(4,"SSN")
  set cmrn_cd =         get_code_value(4,"CMRN")
  set rec_invalid_cd =  get_code_value(48,"INVALID")
  set rec_unknown_cd =  get_code_value(48,"UNKNOWN")
  set rec_active_cd =   get_code_value(48,"ACTIVE")
  set rec_combined_cd = get_code_value(48,"COMBINED")
  set rec_deleted_cd =  get_code_value(48,"DELETED")
  set rec_inactive =    get_code_value(48,"INACTIVE")
  set rec_review_cd =   get_code_value(48,"REVIEW")
  set male_cd =         get_code_value(57,"MALE")
  set female_cd =       get_code_value(57,"FEMALE")
  set unknown_cd =      get_code_value(57,"UNKNOWN")
  set other_cd =        get_code_value(57,"OTHER")
  set date = format(curdate, 'MM/DD/YYYY;;D')
set time = cnvtupper(format(curtime3, ' HH:MM:SS;;S'))
set today = concat(date, time)
 
#1099_INITIALIZE_EXIT
 
#6000_REPORT
  select into "nl:"
     p.seq,
     p1.name_last_key,							;m001484, 07/2010
     p1.name_first_key,							;m001484, 07/2010
     birth_tz_1 = validate(p1.birth_tz, 0),    ;JS006
     birth_tz_2 = validate(p2.birth_tz, 0)     ;JS006
   from person_combine p,
        person p1,
        person p2, ; bpb comma
    ;    person_alias pa1,      ; added to pull pcd.updt_dt_tm from CAB 10496  by m061596 on 09/22
     ;   person_combine_det pcd1,  ; added to pull pcd.updt_dt_tm from CAB 10496  by m061596 on 09/22
      ;  person_alias pa2,   ; added to pull pcd.updt_dt_tm from CAB 10496  by m061596 on 09/22
       ; person_combine_det pcd2,   ; added to pull pcd.updt_dt_tm from CAB 10496  by m061596 on 09/22
        code_value c1,
        code_value c2
   plan p
   where p.active_ind = TRUE
  ; and p.active_status_cd = 188 ;m061596
   and p.updt_dt_tm between cnvtdatetime(cnvtdate2(startdt,"MM/DD/YYYY"), 0)
                        and cnvtdatetime(cnvtdate2(enddt,"MM/DD/YYYY"),235959)
;mp9098 - Added nested select.
   and ((p.to_person_id in(select e.person_id from encounter e where e.person_id = p.to_person_id
                               and e.loc_facility_cd = $4))
          or (p.from_person_id in(select e.person_id from encounter e where e.person_id = p.from_person_id
                               and e.loc_facility_cd = $4)))
   join p1 where p1.person_id = p.to_person_id
 ; join pa1 where pa1.person_id = p1.person_id
  ; join pcd1 where pa1.person_alias_id = pcd1.entity_id
   join p2 where p2.person_id = p.from_person_id
   ;join pa2 where pa2.person_id = p2.person_id
   ;join pcd2 where pa2.person_alias_id = pcd2.entity_id
   join c1 where c1.code_value = p1.contributor_system_cd
   join c2 where c2.code_value = p2.contributor_system_cd
   order by p1.name_last_key desc, p1.name_first_key desc			;m001484, 07/2010
   					,p1.contributor_system_cd, p2.contributor_system_cd
   detail
     rptcombinecnt = rptcombinecnt + 1
     stat = alterlist(pmrptcombinelist->list,rptcombinecnt)
     pmrptcombinelist->list[rptcombinecnt].to_person_id = p.to_person_id
;     pmrptcombinelist->list[rptcombinecnt].to_birth_dt_tm = format(p1.birth_dt_tm, "mm/dd/yyyy;;d")   JS006
     pmrptcombinelist->list[rptcombinecnt].to_birth_dt_tm =
                                  format(datetimezone(p1.birth_dt_tm, birth_tz_1), "mm/dd/yyyy;4;d")    ;JS006
     pmrptcombinelist->list[rptcombinecnt].to_sex_cd = p1.sex_cd
     pmrptcombinelist->list[rptcombinecnt].to_contributor_system_disp = substring(1,20,c1.display)
     pmrptcombinelist->list[rptcombinecnt].to_name_full_formatted = substring(1,20,p1.name_full_formatted)
;SE007     pmrptcombinelist->list[rptcombinecnt].to_combine_dt_tm = format(p1.updt_dt_tm, "mm/dd/yyyy hh:mm:ss;;d") ;JE005 ;49187
     pmrptcombinelist->list[rptcombinecnt].to_combine_dt_tm = format(p.updt_dt_tm, "mm/dd/yyyy hh:mm:ss;;d")    ;SE007
	;modified as per cab 10496 by m061596 on 09/22
     pmrptcombinelist->list[rptcombinecnt].from_person_id = p.from_person_id
     pmrptcombinelist->list[rptcombinecnt].from_name_full_formatted = substring(1,20,p2.name_full_formatted)
;     pmrptcombinelist->list[rptcombinecnt].from_birth_dt_tm = format(p2.birth_dt_tm, "mm/dd/yyyy;;d")     JS006
     pmrptcombinelist->list[rptcombinecnt].from_birth_dt_tm =
                                       format(datetimezone(p2.birth_dt_tm, birth_tz_2), "mm/dd/yyyy;4;d")   ;JS006
     pmrptcombinelist->list[rptcombinecnt].from_sex_cd = p2.sex_cd
     pmrptcombinelist->list[rptcombinecnt].from_contributor_system_disp = substring(1,20,c2.display)
;SE007     pmrptcombinelist->list[rptcombinecnt].from_combine_dt_tm = format(p2.updt_dt_tm, "mm/dd/yyyy hh:mm:ss;;d") ;JE005 ;49187
     pmrptcombinelist->list[rptcombinecnt].from_combine_dt_tm = format(p.updt_dt_tm, "mm/dd/yyyy hh:mm:ss;;d")  ;SE007
     ;modified as per cab 10496 by m061596 on 09/22
     pmrptcombinelist->list[rptcombinecnt].weight = p.combine_weight
     pmrptcombinelist->list[rptcombinecnt].app_flag = p.application_flag
     pmrptcombinelist->list[rptcombinecnt].trans_type = p.transaction_type
     pmrptcombinelist->list[rptcombinecnt].person_combine_id = p.person_combine_id
   with nocounter
; bpb grab the list peopl on the person combine table
; bpb get their information from person table, removed the contributor stystme detaial. (notneeded?)
/***************************************************************************************************/
 
if (rptcombinecnt > 0)
     select into "nl:"
       pa.seq
     from person_alias pa,  code_value cv, (dummyt d with seq = value(rptcombinecnt))
     plan d
     join pa
       where pa.person_id = pmrptcombinelist->list[d.seq].to_person_id
         and pa.person_alias_type_cd in (mrn_cd,cmrn_cd,ssn_cd)
         and pa.active_ind = TRUE
       ;  and pa.active_status_cd = 188 ;m061596
         and pa.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
         and pa.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
     join cv
       where cv.code_value = pa.alias_pool_cd
     order  pa.person_id, pa.person_alias_type_cd
     detail
       case (pa.person_alias_type_cd)
         of mrn_cd:
           if (cur_row != pmrptcombinelist->list[d.seq].person_combine_id)
             mrncnt = 0
           endif
           cur_row = pmrptcombinelist->list[d.seq].person_combine_id
           if (substring(1,15,cnvtalias(pa.alias,pa.alias_pool_cd)) > " ")
             mrncnt = mrncnt + 1
             stat = alterlist(pmrptcombinelist->list[d.seq]->to_mrn, mrncnt)
             pmrptcombinelist->list[d.seq]->to_mrn[mrncnt]->mrn = substring(1,15,cnvtalias(pa.alias,pa.alias_pool_cd))
             pmrptcombinelist->list[d.seq]->to_mrn[mrncnt]->pool =cv.display
           endif
         of cmrn_cd:
           pmrptcombinelist->list[d.seq]->to_cmrn = substring(1,15,cnvtalias(pa.alias,pa.alias_pool_cd))
         of ssn_cd:
           pmrptcombinelist->list[d.seq]->to_ssn =  substring(1,15,cnvtalias(pa.alias,pa.alias_pool_cd))
       endcase
     with nocounter
 
;JE005++
;     set mrncnt = 0
;     set cur_row = 0.0
;     select into "nl:"
;       pa.seq
;     from person_alias pa, code_value cv, (dummyt d with seq = value(rptcombinecnt))
;     plan d
;     join pa
;      where pa.person_id = pmrptcombinelist->list[d.seq].from_person_id
;       and pa.person_alias_type_cd in (mrn_cd,cmrn_cd,ssn_cd)
;       and pa.active_ind = TRUE
;       and pa.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
;       and pa.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
;     join cv
;       where cv.code_value = pa.alias_pool_cd
;     order  pa.person_id, pa.person_alias_type_cd
;     detail
;       case (pa.person_alias_type_cd)
;       of mrn_cd:
;        if ( cur_row != pmrptcombinelist->list[d.seq].person_combine_id)
;         mrncnt = 0
;           endif
;           cur_row = pmrptcombinelist->list[d.seq].person_combine_id
;           if (substring(1,15,cnvtalias(pa.alias,pa.alias_pool_cd)) > " ")
;             mrncnt = mrncnt + 1
;             stat = alterlist(pmrptcombinelist->list[d.seq]->from_mrn, mrncnt)
;             pmrptcombinelist->list[d.seq]->from_mrn[mrncnt]->mrn = substring(1,15,cnvtalias(pa.alias,pa.alias_pool_cd))
;             pmrptcombinelist->list[d.seq]->from_mrn[mrncnt]->pool = cv.display
;           endif
;         of cmrn_cd:
;           pmrptcombinelist->list[d.seq]->from_cmrn = substring(1,15,cnvtalias(pa.alias,pa.alias_pool_cd))
;         of ssn_cd:
;           pmrptcombinelist->list[d.seq]->from_ssn = substring(1,15,cnvtalias(pa.alias,pa.alias_pool_cd))
;       endcase
;     with nocounter
/****************************************/
;JE005--
; bpb -> remove this entire select for now.
;MP9098 - Added next select to identify the facility outbound alias.
 
; set AUTH = $4
    select distinct e.loc_facility_cd ;into "nl:"
    from (dummyt d with seq = value(rptcombinecnt)),
         encounter e,
    ;     person p,
         code_value cvo
    plan d
    join e
    where e.person_id = pmrptcombinelist->list[d.seq].to_person_id
 ;     and e.loc_facility_cd = CNVTINT($4) ;633867;$FACILITY ;UAR_GET_CODE_BY("DISPLAY",220,$FACILITY)
      and e.active_ind+0 = 1
   ;   and e.active_status_cd = 188 ;m061596
     ; AND e.beg_effective_dt_tm <= cnvtdatetime(curdate-5,0)
      ;AND e.end_effective_dt_tm >= cnvtdatetime(sysdate,235959)
   ;   and e.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
  ;    and e.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 ;   join p
  ;  where p.person_id= e.person_id
    join cvo
        where cvo.code_value = e.loc_facility_cd
   ;     and cvo.contributor_source_cd = p.contributor_system_cd ;25047293.00 ;MAYO
;        and cvo.contributor_source_cd in (3310544, 653385)      ;DSIGN
        and cvo.code_set = 220
        and cvo.cdf_meaning in ("AMBULATORY","FACILITY","BUILDING")
;       and cvo.alias_type_meaning = "FACILITY"
	order by e.updt_dt_tm desc
 
    head d.seq
        cnt = 0
    detail
        cnt = cnt + 1
        stat = alterlist(pmrptcombinelist->list[d.seq]->to_fac, cnt)
        pmrptcombinelist->list[d.seq].to_fac[cnt].facility_cd = e.loc_facility_cd
 
        pmrptcombinelist->list[d.seq].to_fac[cnt].facility_alias = cvo.display
    with nocounter,MAXREC =7
 
	call echorecord(pmrptcombinelist)
 
 
;;JE005++
;
;If (rptcombinecnt > 0)
;
; for (x=1 to rptcombinecnt )
;
;/*** FROM_SSN ***/
;
;select into "nl:" p.seq
;      from person_combine_det p, person_alias a
;      plan p where p.person_combine_id = pmrptcombinelist->list[x].person_combine_id
;        and trim(p.entity_name) = "PERSON_ALIAS"
;        and trim(p.attribute_name) = "PERSON_ID"
;        and p.active_ind +0 = 1
;      join a where a.person_alias_id = p.entity_id
;        and a.person_alias_type_cd +0 = ssn_cd
;      order a.end_effective_dt_tm
;      detail
;        pmrptcombinelist->list[x]->from_ssn =
;                                substring(1,15,cnvtalias(a.alias,a.alias_pool_cd))
;        with nocounter
;      if (curqual <= 0)
;        set pmrptcombinelist->list[x]->from_ssn  = " "
;      endif
;;JE005++
;
If (rptcombinecnt > 0)
 
 for (x=1 to rptcombinecnt )
 
/*** FROM_SSN ***/
 
select into "nl:" p.seq
      from person_combine_det p, person_alias a
      plan p where p.person_combine_id = pmrptcombinelist->list[x].person_combine_id
        and trim(p.entity_name) = "PERSON_ALIAS"
        and trim(p.attribute_name) = "PERSON_ID"
        and p.active_ind +0 = 1
    ;    and p.active_status_cd = 188 ;m061596
      join a where a.person_alias_id = p.entity_id
        and a.person_alias_type_cd +0 = ssn_cd
      order a.end_effective_dt_tm
      detail
        pmrptcombinelist->list[x]->from_ssn =
                                substring(1,15,cnvtalias(a.alias,a.alias_pool_cd))
        with nocounter
      if (curqual <= 0)
        set pmrptcombinelist->list[x]->from_ssn  = " "
      endif
 
/*** FROM_MRN ***/
      set mrcnt = 0
      select into "nl:" p.seq
      from person_combine_det p, person_alias a, code_value c
      plan p where p.person_combine_id = pmrptcombinelist->list[x].person_combine_id
        and trim(p.entity_name) = "PERSON_ALIAS"
        and trim(p.attribute_name) = "PERSON_ID"
        and p.active_ind +0 = 1
    ;    and p.active_status_cd = 188 ;m061596
      join a where a.person_alias_id = p.entity_id
        and a.person_alias_type_cd +0 = mrn_cd
      join c where a.alias_pool_cd = c.code_value
      detail
 
        if (substring(1,15,cnvtalias(a.alias,a.alias_pool_cd)) > " ")
          mrncnt = mrncnt + 1
            stat = alterlist (pmrptcombinelist->list[x]->from_mrn, mrncnt)
             pmrptcombinelist->list[x]->from_mrn[mrncnt]->mrn =
                                substring(1,15,cnvtalias(a.alias, a.alias_pool_cd))
            pmrptcombinelist->list[x]->from_mrn[mrncnt]->pool = c.display
        endif
 
      with nocounter
;      echo
     ; if (curqual <= 0)
        ;set pmrptcombinelist->list[x]->from_mrn->mrn = " "
        ;set pmrptcombinelist->list[x]->from_mrn->pool = " "
      ;endif
 
 
/*** FROM_CMRN ***/
      set cmrncnt = 0
      select into "nl:" p.seq
      from person_combine_det p, person_alias a
      plan p where p.person_combine_id = pmrptcombinelist->list[x].person_combine_id
        and trim(p.entity_name) = "PERSON_ALIAS"
        and trim(p.attribute_name) = "PERSON_ID"
        and p.active_ind +0 = 1
    ;    and p.active_status_cd = 188 ;m061596
      join a where a.person_alias_id = p.entity_id
        and a.person_alias_type_cd +0 = cmrn_cd
      detail
        if (substring(1,15,cnvtalias(a.alias,a.alias_pool_cd)) > " ")
          pmrptcombinelist->list[x]->from_cmrn =
                                substring(1,15,cnvtalias(a.alias,a.alias_pool_cd))
        endif
      with nocounter
;      if (curqual <= 0)
;        set pmrptcombinelist->list[x]->from_cmrn = " "
;        endif
 
 endfor
endif
 
;JE005--
  endif
 
 
 
;set maximum execute time for query/report
SET MaxSecs = 0
IF (VALIDATE(IsOdbc, 0) = 1)  SET MaxSecs = 15  ENDIF
;set	page_nu = CONCAT("Page No: ",curpage)
;call echo(rptcombinecnt)
 
;call echorecord(pmrptcombinelist)
 
;fields
SELECT INTO $OUTDEV
	P.PERSON_COMBINE_ID
 
;tables
FROM
;143985++ We put the sequence on the wrong table, so we were only displayed the first
    (DUMMYT  D  WITH seq = value(rptcombinecnt) ),
    PERSON_COMBINE  P
;	( PERSON_COMBINE  P WITH seq = value(rptcombinecnt) ),
;	DUMMYT  D
;143985--
 
;qualifications
plan d
join p
where  p.person_combine_id = pmrptcombinelist->list[d.seq]->person_combine_id
   and p.person_combine_id > 0
   and p.active_ind = 1
   and p.active_status_cd = 188 ;m061596
 
;Sorting
;ORDER BY	P.PERSON_COMBINE_ID
 
 
Head Report
	ROW 1 COL 65 "EMPI Person Combine Report -  ",domain
;	ROW 1 COL 124 "mayo_mn_empi_rpt_prsn_cmb"
	ROW 2 COL 3 "Run Date:"
	;today =  format(curdate,'mm/dd/yy;;d')
	ROW 2 COL 23 	today
;	ROW 2 COL 32 curtime2
	ROW 3 COL 3 "Date Range: "
 
	ROW 3 COL 23 range1 ;changes the way date was displayed - m061596
;	ROW 3 COL 23 startdt
	;ROW 4 COL 23 "To"
	;ROW 5 COL 23 enddt
	ROW 4 COL 3 "Total Combines:"
	ROW 4 COL 19 rptcombinecnt ;changes the col count from 27 to 19 - m061596
	ROW + 2
    cnt = 0
Head Page
	;COL 3
	COL 1 "%Wt"
	COL 6 "Trans" ;6
	COL 16  "Ap Flag" ;16
 
	COL 160  "Page No: ", curpage
	col 170  curpage
	ROW + 1
 call echorecord(pmrptcombinelist)
 
Detail
	mrncnt = 0
 
	weight = fillstring(4," ")
 
	cnt = cnt + 1
;	call echo(cnt)
	sep = fillstring(170,"-")
	col 1 sep
	row + 1
	weight = trim(cnvtstring(pmrptcombinelist->list[cnt].weight),3)
	app = trim(cnvtstring(pmrptcombinelist->list[cnt].app_flag),3)
	trans = trim(pmrptcombinelist->list[cnt].trans_type,3)
	id = cnvtstring(pmrptcombinelist->list[cnt].person_combine_id)
	col 1 weight
	col 6 trans
	col 16 app
	COL 21  "Name"
	COL 43  "DOB"
	COL 55  "S"
	COL 58  "SSN"
;*****change made by m061596 on 03/26/2009
;	COL 75  "MRN"
;	COL 89  "MRN Pool"
;	col 102 "FAC Alias"
;	COL 112  "PID"
;	;COL 123  "Contributor System"
;	COL 144 "Combine DT/TM"
	COL 71  "CMRN"
	COL 82  "MRN"
	COL 98  "MRN Pool"
	;col 111 "FAC Alias"
;	COL 134  "PID"
;	COL 146  "Contributor System"
;	COL 162 "Combine DT/TM"
 	COL 111  "PID"
	COL 123  "Contributor System"
	COL 145 "Combine DT/TM"
	row + 1
 
	pid =  fillstring(10," ")
	lname =  fillstring(22," ")
	fname = fillstring(15," ")
	mi =  fillstring(15," ")
	sex =  fillstring(5," ")
	dob = fillstring(11," ")
	ssn =  fillstring(12," ")
	consys =  fillstring(10," ")
	cmrn = fillstring(12," ")
	mrn =  fillstring(13," ")
	pool =  fillstring(12," ")
	combine = fillstring(20," ")      ;JE005    ;49187
 
	pid = trim(cnvtstring(pmrptcombinelist->list[cnt].to_person_id),3)
	name= pmrptcombinelist->list[cnt].to_name_full_formatted
	sex = uar_get_code_display(pmrptcombinelist->list[cnt].to_sex_cd)
	sex = substring(1,1,sex)
	dob = pmrptcombinelist->list[cnt].to_birth_dt_tm
	ssn = pmrptcombinelist->list[cnt].to_ssn
	if (ssn < " ")
	  ssn = "               "
	endif
	consys = pmrptcombinelist->list[cnt].to_contributor_system_disp
	cmrn = pmrptcombinelist->list[cnt].to_cmrn
	if (cmrn < " ")
	  cmrn = "               "
	endif
	combine = pmrptcombinelist->list[cnt].to_combine_dt_tm     ;JE005
		if (validate(pmrptcombinelist->list[cnt]->to_mrn, "N") != "N" )
	 mrncnt = size(pmrptcombinelist->list[cnt]->to_mrn,5)
	 mrn = trim(pmrptcombinelist->list[cnt]->to_mrn[1].mrn,3)    ;49187
	 pool = trim(pmrptcombinelist->list[cnt]->to_mrn[1].pool,3)
	endif
	pcid = cnvtstring(pmrptcombinelist->list[cnt].person_combine_id)
	col 9  "TO:"
	col 21 name
	col 43 dob
	col 55 sex
	col 58 ssn
;*****change made by m061596 on 03/26/2009
;	col 75 mrn
;	col 89 pool
;	col 112 pid
;	col 123 consys
;	col 144 combine  ;JE005
	col 71 cmrn
    col 82 mrn
	col 98 pool
	col 111 pid
	col 123 consys
	col 145 combine  ;JE005
	row+1
;	myrow = row           ;mp9098
 
	if (mrncnt >1)
	 for (xx = 2 to mrncnt)
	   mrn = trim(pmrptcombinelist->list[cnt]->to_mrn[xx].mrn,3)
	   pool =  pmrptcombinelist->list[cnt]->to_mrn[xx].pool
;	   col 75 mrn
;	   col 89 pool
	   col 82 mrn
	   col 98 pool
	   row + 1
	 endfor
	endif
 
	;row myrow-1           ;mp9098
 
	mrncnt = 0
;mp9098 - Added the following IF to display/print the facility outbound alias
;
;	faccnt = 0
;	faccnt = size(pmrptcombinelist->list[cnt].to_fac, 5)
;	if (faccnt > 0)
;	   for (i = 1 to faccnt)
;	  ; 		for (j = i+1 to faccnt )
;	   ;		 if(pmrptcombinelist->list[cnt].to_fac[j].facility_cd != pmrptcombinelist->list[cnt].to_fac[i].facility_cd)
;	   		 fac_disp = trim(substring(1, 20, pmrptcombinelist->list[cnt].to_fac[i].facility_alias),1)
;	   	;	 j=j+1
;	   		;  endif
;	   		  ;row+1
;	   		 ; endfor
;	   		; if (i > faccnt -7)   ;added on 04/27/2009 m0615906
;	  ; 		  col 111, fac_disp
;	   		   row +1
;	   		; endif   ;added on 04/27/2009 m0615906
;
;	   endfor
;	else row+1
;	endif
;
 
;	if (faccnt > 0)
;	   for (i = 1 to faccnt)
;    	previous_fac_exists = 0;false;
;		fac_disp = trim(substring(1, 20, pmrptcombinelist->list[cnt].to_fac[i].facility_alias),1)
;		if (i > 1)
;	  	  for (j = i-1 to 1 )
;	            if(pmrptcombinelist->list[cnt].to_fac[j].facility_cd = pmrptcombinelist->list[cnt].to_fac[i].facility_cd)
;	   				 previous_fac_exists = 1;true
;		   	    endif
;      		    j=j-1
;	   	   ; row+1  ; <-- don't know what this does?
;	   	  endfor
;		  if (previous_fac_exists = 0)
;	   	     col 111, fac_disp
;	         row +1 ;<-- don't know what this does?
;	      endif
;;		  else
;;	   	    col 111, fac_disp
;;	           row +1 ;<-- don't know what this does?
;	     endif
;	   endfor
;	else
;		row+1
;	endif
 
 
 	pid =  fillstring(10," ")
	lname =  fillstring(22," ")
	fname = fillstring(15," ")
	mi =  fillstring(15," ")
	sex =  fillstring(5," ")
	dob = fillstring(11," ")
	ssn =  fillstring(12," ")
	consys =  fillstring(10," ")
	cmrn = fillstring (12," ")
	mrn =  fillstring(13," ")
	pool =  fillstring(12," ")
	combine = fillstring(20," ")  ;JE005
 
	pid = trim(cnvtstring(pmrptcombinelist->list[cnt].from_person_id),3)
	name= pmrptcombinelist->list[cnt].from_name_full_formatted
	sex = uar_get_code_display(pmrptcombinelist->list[cnt].from_sex_cd)
	sex = substring(1,1,sex)
	dob = pmrptcombinelist->list[cnt].from_birth_dt_tm
	ssn = pmrptcombinelist->list[cnt].from_ssn
	if (ssn < " ")
	  ssn = "               "
	endif
	cmrn = pmrptcombinelist->list[cnt].from_cmrn
	if (cmrn < " ")
	  cmrn = "               "
	endif
	consys = pmrptcombinelist->list[cnt].from_contributor_system_disp
	combine = pmrptcombinelist->list[cnt].from_combine_dt_tm
 
	if (validate(pmrptcombinelist->list[cnt]->from_mrn, "N") != "N" )
	 mrncnt = size(pmrptcombinelist->list[cnt]->from_mrn,5)
	 mrn = trim(pmrptcombinelist->list[cnt]->from_mrn[1].mrn,3)
	 pool = trim(pmrptcombinelist->list[cnt]->from_mrn[1].pool,3)
	endif
	pcid = cnvtstring(pmrptcombinelist->list[cnt].person_combine_id)
 
	col 8  "FROM:"
	col 21 name
	col 43 dob
	col 55 sex
	col 58 ssn
;	col 75 mrn
;	col 89 pool
;	col 112 pid
;	col 123 consys
;	col 144 combine
	col 71 cmrn
	col 82 mrn
	col 98 pool
	col 111 pid
	col 123 consys
	col 145 combine
 
;	row + 1             mp9098 - Causing problem with line spacing.
	if (mrncnt >1)
	 for (xx = 2 to mrncnt)
	   mrn = trim(pmrptcombinelist->list[cnt]->from_mrn[xx].mrn,3) ;49187
	   pool =  pmrptcombinelist->list[cnt]->from_mrn[xx].pool
;	   col 75 mrn
;	   col 89 pool
	   col 82 mrn
	   col 98 pool
;	   row + 1             mp9098 - Causing problem with line spacing.
	 endfor
;mp9098 -  Added row+1, else, row+1 to correct line spacing.
	 row + 1
	else
	 row + 1
	endif
	col 1 sep
 
Foot Report
	COL 72  "<End of Report>"
 
 
;control options
WITH MAXREC = 5000, MAXCOL = 200, MAXROW = 48,
 ;LANDSCAPE, COMPRESS, NOFORMFEED, DIO =  "NONE", maxrow = 49,
NOCOUNTER, LANDSCAPE, COMPRESS, NULLREPORT,
FORMAT = VARIABLE, NOHEADING, TIME= VALUE( MaxSecs )
 
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
 
#exit_script
 
/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
 
end
go
 
