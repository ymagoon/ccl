/*****************************************************************************
      *                                                                      *
      *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
      *                              Technology, Inc.                        *
      *       Revision      (c) 1984-1995 Cerner Corporation                 *
      *                                                                      *
      *  Cerner (R) Proprietary Rights Notice:  All rights reserved.         *
      *  This material contains the valuable properties and trade secrets of *
      *  Cerner Corporation of Kansas City, Missouri, United States of       *
      *  America (Cerner), embodying substantial creative efforts and        *
      *  confidential information, ideas and expressions, no part of which   *
      *  may be reproduced or transmitted in any form or by any means, or    *
      *  retained in any storage or retrieval system without the express     *
      *  written permission of Cerner.                                       *
      *                                                                      *
      *  Cerner is a registered mark of Cerner Corporation.                  *
      *                                                                      *
      ***********************************************************************/
 
/*****************************************************************************
 
        Source file name:       MAYO_MN_PROFILE_ORDERS.PRG
        Object name:            mayo_mn_profile_orders
        Request #:
 
        Product:                SC custom discern programming
        Product Team:           Profile
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:
 
        Tables read:			person, encounter_alias, sch_appt,
                                v500_event_set_canon, v500_event_set_explode,
                                code_value, encntr_prsnl_reltn
        Tables updated:         None
        Executing from:			Explorer Menu
 
        Special Notes:
 
******************************************************************************/
 
;****************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *                                                                      *
;    *Mod    Date     	Engineer              Comment                       *
;    *---   ------------ -------------------- ------------------------------*
;     000   09/18/08 	 NT5990               Initial Release SR1-2193822061*
;     001   02/03/11	 Akcia - SE			  change doctor to doctor associated with appt
;											  add appt_type_cd to report
;											  sort by doctor, add prompt for date range
;											  add reason for visit, only pull certain locations
;     002   12/13/11     Rob Banks            Modify to use DB2
;    *003 03/19/13       akcia - se        Change mod 002 to lookup password in registry*
;    *004 06/09/14       akcia - se        add additional role for database change
;****************************************************************************
Drop program mayo_mn_profile_orders:dba go
create program mayo_mn_profile_orders:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Facility" = 0
	, "Appointment Location" = 0
	, "Appointment Start Date" = CURDATE
	, "Appointment End Date" = CURDATE
	, "Format Type" = 0
 
with OUTDEV, FACILITY, appt_loc, appt_start_date, appt_end_date, RPT_FORM
 
/*** START 002 ***/
;*********************************************************************
;*** If PROD / CERT then run as 2nd oracle instance to improve
;*** efficiency. Will auto Fail-over to Instance 1 if Instance 2 down.
;*********************************************************************
/****Start 003  -Comment out mod 001
 
IF(CURDOMAIN = "PROD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprbrpt'
ELSEIF(CURDOMAIN = "MHPRD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprbrpt'
ELSEIF(CURDOMAIN="MHCRT")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/java4t2@mhcrtrpt'
ENDIF ;CURDOMAIN
                                    END 003 -Comment out mod 001****/
;*** Write instance ccl ran in to the log file
;SET Iname = fillstring(10," ")
;SELECT INTO value("mayo_logfiles:mayo_instance2.log")
;  run_date = format(sysdate,";;q")
; ,Iname = substring(1,7,instance_name)
;FROM v$instance
;DETAIL
;  col  1 run_date
;  col +1 curprog
;  col +1 " *Instance="
;  col +1 Iname
;with nocounter
;   , format
;****************** End of INSTANCE 2 routine ************************
/*** END 002 ***/
/*** Start 003 - New Code ****/
;****************** Begin ORACLE INSTANCE 2 routine ****************
;*** If PROD / CERT then run as 2nd oracle instance to improve
;***   efficiency. Will auto Fail-over to Instance 1 if Instance 2 down.
;***   Then after at the end, set the program back to instance 1.
;******************************************************************************
 
;*** This section calls an O/S scritp that reads the current v500 password
;***   from the Millennium registry and stores it in a file named
;***   $CCLUSERDIR/dbinfo.dat
declare dcl_command = vc
declare dcl_size = i4
declare dcl_stat = i4
 
set dcl_command = "/mayo/procs/req_query.ksh"
set dcl_size = size(dcl_command)
set dcl_stat = 0
 
call dcl(dcl_command,dcl_size,dcl_stat)
 
;*** Next the password is read from the dbinfo.dat file to variable 'pass'.
FREE DEFINE RTL
DEFINE RTL IS "dbinfo.dat"
 
declare pass=vc
 
SELECT DISTINCT INTO "NL:"
  line = substring(1,30,R.LINE)   ; 9,9       10,9
FROM RTLT R
PLAN R
 
detail
 
if (line = "dbpw*")
  pass_in=substring(9,15,line)
  pass=trim(pass_in,3)
endif
 
with counter
 
;*** Now we are finished with the dbinfo.dat file and will delete it.
set dcl_command = ""
set dcl_command = "rm $CCLUSERDIR/dbinfo.dat"
set dcl_size = size(dcl_command)
set dcl_stat = 0
 
call dcl(dcl_command,dcl_size,dcl_stat)
 
declare system=vc
 
;*** This section redifines the OracleSystem variable pointing it to
;***   database instance 2 using the password read in above.
;*** This only applies to PRD and CRT, because they are the only domains
;***   that have multiple instance databases.
IF (curdomain = "MHPRD")
  Free define oraclesystem
  set system=build(concat('v500/', pass, '@mhprdrpt'))
  DEFINE oraclesystem system
ELSEIF (CURDOMAIN="MHCRT")
    FREE DEFINE oraclesystem
    set system=build(concat('v500/', pass, '@mhcrtrpt'))
    DEFINE oraclesystem system
ENDIF
/*** END 003 - New Code ***/
 
;set s_d = cnvtdatetime(cnvtdate2($APPT_START_DATE,"dd-mmm-yyyy"),0)		;001
;set e_d = cnvtdatetime(cnvtdate2($APPT_END_DATE,"dd-mmm-yyyy"),235959) 	;001
set s_d = cnvtdatetime(cnvtdate($appt_start_date),0)		;001
set e_d = cnvtdatetime(cnvtdate($appt_end_date),235959) 	;001
call echo(format(s_d,"mm/dd/yy;;d"))
call echo(format(e_d,"mm/dd/yy;;d"))
if (datetimecmp(e_d,s_d) > 7)													;001
  select into $outdev															;001
  from (dummyt d with seq = 1)													;001
  detail																		;001
    col 1, "End date must be no more than 7 days from the start date."			;001
    row + 1  																	;001
  with nocounter																;001
  go to exit_script																;001
endif										;001
 
;record structures
record appt_list
(
   1 org_cnt                         = i4
   1 org_qual[*]
     2 org_id                        = f8
     2 org_name                      = vc
     2 pat_cnt                       = i4
     2 pat_qual[*]
       3 encntr_id                   = f8
       3 pat_id                      = f8
       3 pat_name                    = vc
       3 mrn                         = vc
       3 fin                         = vc
       3 doc_name                    = vc
       3 appt_loc                    = vc
       3 appt_type					 = vc    ;001
       3 rsv						 = vc    ;001
;001       3 beg_dt_tm                   = dq8
       3 beg_dt_tm                   = vc
       3 end_dt_tm                   = dq8
       3 print_ind                   = i2
 
)
 
free set t_record
record t_record
(
   1 org_cnt                         = i4
   1 org_qual[*]
     2 facility                      = vc
     2 facility_cd                   = f8
     2 loc_cnt                       = i4
     2 loc_qual[*]
       3 unit_loc_cd                 = f8
       3 unit_loc                    = vc
 
 
)
 
free set cv_rec
record cv_rec
(
   1 cv_cnt                          = i4
   1 cv_qual[*]
     2 event_cd                      = f8
 
)
 
;Variables
declare STATUS_CD             = f8 with Constant(uar_get_code_by("MEANING",14233,"CHECKED IN")),protect
declare check_out_cd          = f8 with Constant(uar_get_code_by("MEANING",14233,"CHECKED OUT")),protect	;001
declare attend_doc            = f8 with Constant(uar_get_code_by("MEANING",333,"ATTENDDOC")),protect
declare fnbr_cd               = f8 with protect, constant(uar_get_code_by("MEANING", 319, "FIN NBR"))
declare mrn_cd                = f8 with protect, constant(uar_get_code_by("MEANING", 319, "MRN"))
declare num                   = I4
declare cv                    = I4
declare page_num              = I4
set page_num = 0
declare disp 				  = vc  ;001
 
;001 declare appointment locations to not pull
declare merc_ct_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "MERCCT"))
declare merc_diab_ed_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "MERCDIABETICED"))
declare merc_ekg_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "MERCEKG"))
declare merc_holtr_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "MERCHOLTRMONTR"))
declare merc_infusthpy_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "MERCINFUSTHPY"))
declare merc_lab_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "MERCLAB"))
declare merc_mammo_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "MERCMAMMO"))
declare merc_mri_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "MERCMRI"))
declare merc_outptserv_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "MERCOUTPTSERV"))
declare merc_ultrasound_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "MERCULTRASOUND"))
declare merc_xray_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "MERCXRAY"))
declare merc_nucmed_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "MERCNUCMED"))
declare merc_bone_dens_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "MERCBONEDENS"))
declare merc_fluoro_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "MERCFLUORO"))
declare meel_outptserv_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "MEELOUTPTSERV"))
declare meel_xray_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "MEELXRAY"))
declare megc_outptserv_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "MEGCOUTPTSERV"))
declare megc_xray_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 220, "MEGCXRAY"))
declare meel_lab_cd = f8
declare megc_lab_cd = f8
declare acnt = i2
 
;start 001
record locations (
1 qual[*]
  2 loc_codes = f8
)
 
set par = reflect(parameter(3,0))
if (par = "C1")
	select distinct
	loc = uar_get_code_display(sal.location_cd),sal.location_cd
	from sch_appt_loc sal,
	code_value cv,location_group lg,location_group lg2
	plan sal where sal.active_ind =1
	and sal.end_effective_dt_tm > sysdate
	join cv where cv.code_value = sal.location_cd
	  and not cv.display_key in ("*CT","*MRI*","*DIABETIC*")
	  and not cv.display_key in ("*MONTR*","*INFUS*","*LAB*")
	  and not cv.display_key in ("*MAMMO*","*EKG*", "*MRI*")
	  and not cv.display_key in ("*OUTPTSERV*","*ULTRASOUND*","*XRAY*")
	  and not cv.display_key in ("*NUCMED*","*BONEDENS*","*FLUORO*")
	join lg
	where lg.child_loc_cd = cv.code_value
	  and lg.active_ind = 1
	  and lg.end_effective_dt_tm > sysdate
	  and lg.root_loc_cd = 0
 
	join lg2
	where lg2.child_loc_cd = lg.parent_loc_cd
	  and lg2.parent_loc_cd =   $facility
	  and lg2.active_ind = 1
	  and lg2.end_effective_dt_tm > sysdate
	  and lg2.root_loc_cd = 0
	  order loc
	head report
	acnt = 0
 
	detail
	acnt = acnt + 1
	stat = alterlist(locations->qual,acnt)
	locations->qual[acnt]->loc_codes = sal.location_cd
 
	with nocounter
 
elseif (par = "F8")
  set stat = alterlist(locations->qual,1)
  set locations->qual[1]->loc_codes = $appt_loc
elseif (substring(1,1,par) = "L")
    SET lnum = 1
    WHILE (lnum>0)
      SET par2 = reflect(parameter(3,lnum))
      IF (par2 = " ")
        ;no more items in list for parameter
        ;SET cnt2 = lnum-1
        SET lnum = 0
      ELSE
        ;valid item in list for parameter
	    set acnt = acnt + 1
	    set stat = alterlist(locations->qual,acnt)
	    set locations->qual[acnt]->loc_codes = parameter(3,lnum)
        SET lnum = lnum+1
      ENDIF
    ENDWHILE
endif
;end 001
 
select into "nl:"
from
code_value cv
where cv.code_set = 220
  and cv.cdf_meaning = "AMBULATORY"
  and cv.display_key in ("MEELLAB","MEGCLAB")
  and cv.active_ind = 1
  and cv.end_effective_dt_tm > sysdate
detail
if (cv.display_key = "MEELLAB")
  meel_lab_cd = cv.code_value
elseif (cv.display_key = "MEGCLAB")
  megc_lab_cd = cv.code_value
endif
with nocounter
;001 end declares
 
set  SEPERATOR  =  FILLSTRING ( 142 ,  "-" )
;001  set s_d = cnvtdatetime(cnvtdate2($APPT_DATE,"dd-mmm-yyyy"),0)
;001  set e_d = cnvtdatetime(cnvtdate2($APPT_DATE,"dd-mmm-yyyy"),235959)
 
/*  001 start
select into "nl:"
from nurse_unit nu
 
plan nu
where nu.loc_facility_cd in($FACILITY)
  and nu.beg_effective_dt_tm <= sysdate
  and nu.end_effective_dt_tm > sysdate
  and nu.active_ind = 1
 
order by nu.loc_facility_cd, nu.location_cd
 
head report
  org_cnt = 0
 
head nu.loc_facility_cd
  loc_cnt = 0
 
  org_cnt = org_cnt + 1
 
  if (mod(org_cnt, 10) = 1)
    stat = alterlist(t_record->org_qual, org_cnt + 9)
  endif
 
head nu.location_cd
 
  loc_cnt = loc_cnt + 1
  if (mod(loc_cnt, 10) = 1)
    stat = alterlist(t_record->org_qual[org_cnt]->loc_qual, loc_cnt + 9)
  endif
  t_record->org_qual[org_cnt]->facility    = uar_get_code_display(nu.loc_facility_cd)
 
detail
  t_record->org_qual[org_cnt]->loc_qual[loc_cnt]->unit_loc_cd = nu.location_cd
  t_record->org_qual[org_cnt]->loc_qual[loc_cnt]->unit_loc    = uar_get_code_display(nu.location_cd)
 
 
foot nu.location_cd
null
 
foot nu.loc_facility_cd
  stat = alterlist(t_record->org_qual[org_cnt]->loc_qual, loc_cnt)
  t_record->org_qual[org_cnt]->loc_cnt = loc_cnt
 
foot report
  stat = alterlist(t_record->org_qual, org_cnt)
  t_record->org_cnt = org_cnt
with nocounter
 
call echorecord(t_record)
end 001 */
 
select distinct into "nl:"
  event_set = uar_get_code_display(vec.event_set_cd),
  event_cd = uar_Get_code_display(vec.event_cd)
 
from code_value cv,
  v500_event_set_canon v,
  v500_event_set_explode vec
plan cv
where cv.code_set = 93
and cv.display_key in ("CLINIC","DIAGNOSTICS","THERAPIES")   ;001
;001 and (cv.display_key = "CLINIC"
;001   or cv.display_key = "DIAGNOSTICS"
;001   or cv.display_key = "THERAPIES")
  and cv.active_ind = 1
join v
	where v.parent_event_set_cd = cv.code_value
join vec
	where vec.event_set_cd = v.event_set_cd
order by event_set, event_cd
 
head report
  cv_cnt = 0
 
head event_cd
  cv_cnt = cv_cnt + 1
  if (mod(cv_cnt, 10) = 1)
    stat = alterlist(cv_rec->cv_qual, cv_cnt + 9)
  endif
 
  cv_rec->cv_qual[cv_cnt]->event_cd = vec.event_cd
 
foot event_cd
null
foot report
  stat = alterlist(cv_rec->cv_qual, cv_cnt)
  cv_rec->cv_cnt = cv_cnt
 
 
with nocounter
 
;call echorecord(cv_rec)
 
 
 
;main select
select distinct into "nl:"
  ;001  fac_name = t_record->org_qual[d.seq]->facility
  fac_name = uar_get_code_display($facility)
from (dummyt d with seq = size(locations->qual,5))  ;001
;001  (dummyt d with seq = value(t_record->org_cnt))
  , sch_appt sa
  , sch_event se   ;001
  , encounter e
;001    , encntr_prsnl_reltn epr
  , person p
;001   , prsnl pr
  , encntr_alias ea
  , encntr_alias ea2
  , dummyt d1					;001
  , sch_event_disp sep  		;001
  , sch_appt sa1				;001
 
plan d
 
join sa
;001 where expand(num,1,size(t_record->org_qual[d.seq]->loc_qual,5),sa.appt_location_cd,t_record->org_qual[d.seq]->
;001                          loc_qual[num]->unit_loc_cd)
where sa.beg_dt_tm between cnvtdatetime(s_d) and cnvtdatetime(e_d)			;001
  and sa.appt_location_cd+0 = locations->qual[d.seq]->loc_codes				;001
;001  and sa.beg_dt_tm >= cnvtdatetime(s_d)
;001  and sa.end_dt_tm <= cnvtdatetime(e_d)
 
  and sa.version_dt_tm > sysdate
;001   and sa.sch_state_cd = STATUS_CD
  and sa.sch_state_cd in (STATUS_CD,check_out_cd)		;001
  and sa.role_meaning = "PATIENT"
  and sa.beg_effective_dt_tm <= sysdate
  and sa.end_effective_dt_tm >  sysdate
  and sa.active_ind = 1
															;001
 
 
join se										;001
where se.sch_event_id = sa.sch_event_id  	;001
 
join e
where e.encntr_id = sa.encntr_id
  and e.active_ind = 1
  and e.beg_effective_dt_tm <= sysdate
  and e.end_effective_dt_tm >  sysdate
 
join p
where p.person_id = e.person_id
  and p.active_ind = 1
  and p.beg_effective_dt_tm <= sysdate
  and p.end_effective_dt_tm >  sysdate
 
;001  join epr
;001  where epr.encntr_id = outerjoin(e.encntr_id)
;001    and epr.encntr_prsnl_r_cd =    outerjoin(attend_doc)
;001    and epr.active_ind =           outerjoin(1)
;001    and epr.beg_effective_dt_tm <= outerjoin(sysdate)
;001    and epr.end_effective_dt_tm >  outerjoin(sysdate)
 
;001 join pr
;001 where pr.person_id = outerjoin(epr.prsnl_person_id)
;001   and pr.active_ind = outerjoin(1)
;001   and pr.beg_effective_dt_tm <= outerjoin(sysdate)
;001   and pr.end_effective_dt_tm >  outerjoin(sysdate)
 
join ea
where ea.encntr_id = outerjoin(e.encntr_id)
  and ea.encntr_alias_type_cd = outerjoin(fnbr_cd)
  and ea.active_ind = outerjoin(1)
  and ea.beg_effective_dt_tm <= outerjoin(sysdate)
  and ea.end_effective_dt_tm >  outerjoin(sysdate)
 
join ea2
where ea2.encntr_id = outerjoin(e.encntr_id)
  and ea2.encntr_alias_type_cd = outerjoin(mrn_cd)
  and ea2.active_ind = outerjoin(1)
  and ea2.beg_effective_dt_tm <= outerjoin(sysdate)
  and ea2.end_effective_dt_tm >  outerjoin(sysdate)
 
join d1															;001
 join sa1														;001
 where sa1.sch_event_id = sa.sch_event_id			;001
   ;001  and sa1.role_description = "Clinician"		;001
;004   and sa1.role_meaning = "RESOURCE"					;001
   and sa1.role_meaning in ("ATTENDING","RESOURCE")					;004
   and sa1.resource_cd > 0							;001
   and sa1.active_ind = 1							;001
   and sa1.beg_effective_dt_tm <= sysdate			;001
   and sa1.end_effective_dt_tm >  sysdate			;001
 
 
join sep														;001
where sep.sch_event_id = sa1.sch_event_id			;001
  and sep.disp_field_meaning = "PRIMARYRES"			;001
  and sep.end_effective_dt_tm > sysdate				;001
  and sep.disp_value = sa1.resource_cd 				;001
  and sep.active_ind = 1 							;001
 
 
 
order by fac_name, e.encntr_id, sa.appt_location_cd
 
head report
  org_cnt = 0
head fac_name
  org_cnt = org_cnt + 1
  pat_cnt = 0
  if (mod(org_cnt, 10) = 1)
      stat = alterlist(appt_list->org_qual, org_cnt + 9)
  endif
 
head e.encntr_id
call echo(appt_list->org_qual,5)
;001  appt_list->org_qual[org_cnt]->org_name  = t_record->org_qual[d.seq]->facility
  appt_list->org_qual[org_cnt]->org_name  = fac_name
  pat_cnt = pat_cnt + 1
  if (mod(pat_cnt, 10) = 1)
      stat = alterlist(appt_list->org_qual[org_cnt]->pat_qual, pat_cnt + 9)
  endif
 
detail
  appt_list->org_qual[org_cnt]->pat_qual[pat_cnt]->pat_id    = e.person_id
  appt_list->org_qual[org_cnt]->pat_qual[pat_cnt]->encntr_id = e.encntr_id
  appt_list->org_qual[org_cnt]->pat_qual[pat_cnt]->pat_name  = substring(1,40,p.name_full_formatted)
  appt_list->org_qual[org_cnt]->pat_qual[pat_cnt]->MRN       = substring(1,15,ea2.alias)
  appt_list->org_qual[org_cnt]->pat_qual[pat_cnt]->FIN       = substring(1,15,ea.alias)
  appt_list->org_qual[org_cnt]->pat_qual[pat_cnt]->rsv       = e.reason_for_visit
;001   appt_list->org_qual[org_cnt]->pat_qual[pat_cnt]->doc_name  = substring(1,40,pr.name_full_formatted)
  appt_list->org_qual[org_cnt]->pat_qual[pat_cnt]->doc_name  = uar_get_code_display(sa1.resource_cd)		;001
  appt_list->org_qual[org_cnt]->pat_qual[pat_cnt]->appt_loc  = substring(1,50,uar_get_code_display(sa.appt_location_cd))
  appt_list->org_qual[org_cnt]->pat_qual[pat_cnt]->appt_type  = substring(1,50,uar_get_code_display(se.appt_type_cd))		;001
  appt_list->org_qual[org_cnt]->pat_qual[pat_cnt]->beg_dt_tm  = format(sa.beg_dt_tm,"mm/dd/yy hh:mm;;d")					;001
 
foot e.encntr_id
  null
 
foot fac_name
  stat = alterlist(appt_list->org_qual[org_cnt]->pat_qual, pat_cnt)
  appt_list->org_qual[org_cnt]->pat_cnt = pat_cnt
 
foot report
  stat = alterlist(appt_list->org_qual, org_cnt)
  appt_list->org_cnt = org_cnt
 
with nocounter
    ,outerjoin=d1  ;001
 
;call echorecord(appt_list)
 
select distinct into "nl:"
 
from
   (dummyt d with seq = value(appt_list->org_cnt))
   ,(dummyt d2 with seq = 1)
   , clinical_event ce
 
 
plan d where maxrec(d2, appt_list->org_qual[d.seq]->pat_cnt)
 
join d2
 
join ce
where expand(cv,1,size(cv_rec->cv_qual,5),ce.event_cd,cv_rec->cv_qual[cv]->event_cd,200)
  and ce.encntr_id = appt_list->org_qual[d.seq]->pat_qual[d2.seq]->encntr_id
  and ce.person_id = appt_list->org_qual[d.seq]->pat_qual[d2.seq]->pat_id
 
detail
 
  appt_list->org_qual[d.seq]->pat_qual[d2.seq]->print_ind = 1
 
with nocounter
 
call echorecord(appt_list)
 
select into $OUTDEV
 facility_name  = substring(1,40,uar_get_code_display($facility))
;001  , Patient_Name = substring(1,40,trim(appt_list->org_qual[d.seq]->pat_qual[d2.seq]->pat_name))
, Patient_Name = substring(1,30,trim(appt_list->org_qual[d.seq]->pat_qual[d2.seq]->pat_name))		   ;001
, MRN = substring(1,15,trim(appt_list->org_qual[d.seq]->pat_qual[d2.seq]->mrn))
, FIN = substring(1,15,trim(appt_list->org_qual[d.seq]->pat_qual[d2.seq]->fin))
;001, Provider_Name = substring(1,40,trim(appt_list->org_qual[d.seq]->pat_qual[d2.seq]->doc_name))
, Provider_Name = substring(1,25,trim(appt_list->org_qual[d.seq]->pat_qual[d2.seq]->doc_name))		   ;001
;001 , Appointment_Location = substring(1,50,trim(appt_list->org_qual[d.seq]->pat_qual[d2.seq]->appt_loc))
, Appointment_Location = substring(1,25,trim(appt_list->org_qual[d.seq]->pat_qual[d2.seq]->appt_loc))  ;001
, Appointment_Type = substring(1,20,appt_list->org_qual[d.seq]->pat_qual[d2.seq]->appt_type)           ;001
, Reason_for_Visit = substring(1,50,appt_list->org_qual[d.seq]->pat_qual[d2.seq]->rsv)  	           ;001
, Appointment_Date = appt_list->org_qual[d.seq]->pat_qual[d2.seq]->beg_dt_tm							;001
from
   (dummyt d with seq = value(appt_list->org_cnt))
   ,(dummyt d2 with seq = 1)
 
plan d where maxrec(d2, appt_list->org_qual[d.seq]->pat_cnt)
 
join d2
where appt_list->org_qual[d.seq]->pat_qual[d2.seq]->print_ind = 0
 
order provider_name  			;001
 
head report
  page_num = 0
  first_fac = 1
 
head page
  page_num = page_num + 1
 
  col 0 "{CPI/12}"
  col +1, "{PS/0 0 translate 90 rotate/}"
  row + 1,
  col 0, call center(facility_name,0,152)
  pg_num = format(page_num,"###;L;I")
  col 110, "Page:", pg_num
  row + 1,
  col 0, call center("Clinic Dictation Compliance Report",0,129)
  row + 1,
  col 0, call center("Appointments Without Dictation-Transcription",0,126)
  row + 1,
;001  col 45, "Date of Appointments:"
;001    col + 2, $APPT_DATE
  col 40, "Appointment Date Range:"												;001
  disp = concat(format(cnvtdate($appt_start_date),"mm/dd/yy;;d")," to ",format(cnvtdate($appt_end_date),"mm/dd/yy;;d")) 	;001
  col + 2, disp																	;001
  row + 4,
  col 0, "{CPI/14}"
  row + 1,
  col 0, "Patient Name"
;001  col 41, "MRN"
;001  col 56, "FIN"
;001  col 71, "Provider Name"
;001  col 112, "Appointment Location"
  col 26, "MRN"								;001
  col 35, "FIN"								;001
  col 44, "Provider Name"					;001
  col 71, "Appointment Location"			;001
  col 98, "Appointment Type"				;001
  col 120, "Appointment Date"				;001
  row + 1,
  seperator
  row + 1
 
head facility_name
 if (first_fac = 1)
   first_fac = 0
 else
   page_num = 0
   break
 endif
 
detail
 
  IF ( (( ROW + 3 )>= MAXROW ) )
    BREAK
  ENDIF
 
  pat = patient_name
  col 0, pat
 
;001  col 41, mrn
;001  col 56, fin
;001  col 71, Provider_Name
;001  col 112, Appointment_Location
  col 26, mrn								;001
  col 35, fin								;001
  col 44, provider_name						;001
  col 71, Appointment_Location				;001
  col 98, Appointment_Type					;001
  col 120, Appointment_Date					;001
  row + 1									;001
  col 12, "Reason for Visit:  "								;001
  col 31,  Reason_for_Visit					;001
  row + 3
 
 
 
foot facility_name
  null
 
foot page
  null
 
 
 
foot report
  col 0, call center("********** END OF REPORT **********",0,152)
 
 
with nocounter, maxcol = 200,maxrow = 50, dio=postscript, SEPARATOR=" ", FORMAT, skipreport = value($RPT_FORM), nullreport
 
#exit_script   		;001
 
/*** START 002 ***/
;*** After report put back to instance 1
/**** Start 003 - Comment out mod 001 code
IF(CURDOMAIN = "PROD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprb1'
ELSEIF(CURDOMAIN = "MHPRD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprb1'
ELSEIF(CURDOMAIN="MHCRT")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/java4t2@mhcrt1'
ENDIF ;CURDOMAIN
/*** END 001 ***/
 
/***                       END 003 - Comment out mod 001 code ****/
 
/****Start 003 - New Code ***/
;*** Restore the OracleSystem variable to its normal definition pointing
;***   to instance 1.
IF (curdomain = "MHPRD")
  Free define oraclesystem
  set system=build(concat('v500/', pass, '@mhprd1'))
  DEFINE oraclesystem system
 
ELSEIF (CURDOMAIN="MHCRT")
    FREE DEFINE oraclesystem
    set system=build(concat('v500/', pass, '@mhcrt1'))
    DEFINE oraclesystem system
 
ENDIF
 
/***END 003 - New Code ***/
 
;002 set MOD = "001 Akcia-SE 02/03/11"
set MOD = "002 RBanks 12/13/11"		;002
end go
 
