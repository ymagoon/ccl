 
/*~BB~************************************************************************
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
  ~BE~***********************************************************************/
 
/*****************************************************************************
 
        Source file name:   MAYO_MN_LAB_EXT.PRG
        Object name:        MAYO_MN_LAB_EXT
        Request #:          -
 
        Product:            Discern Custom Programming Services
        Product Team:       Discern Custom Programming Services
        HNA Version:        500
        CCL Version:        Rev:8x
 
        Program purpose:    Extract of Lab data for Diabetes program
        Tables read:        encounter, encntr_alias, clinical_event, person,
                            code_value
 
        Tables updated:     None
        Executing from:     Operations/CCL/Explorer Menu
 
        Special Notes:      OPS String:    "nl:",x     where x = lookback day
 
*****************************************************************************/
;~DB~************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *                                                                      *
;    *Mod Date       Engineer Comment                                       *
;    *--- --------   -------- ----------------------------------------------*
;     000 04/02/2009 DL4887   Initial Release
;     001 04/25/2009 DL4887   Only Auth and Modified labs should display
;     002                     remove testing remnant
;     003 06/01/09   DL4887   Remove 3.0 prompts - use v2.0 prompt builder
;     004 12/10/09	  Akcia		add code to get rid of extra lline on A1C results
;     005 04/27/2012  Akcia		changes to reduce buffer gets and add db2 code
;     006 02/28/2013  Akcia   Change mod 001 to lookup password in registry
;~DE~************************************************************************
 
 
drop program mayo_mn_lab_ext:dba go
 create program mayo_mn_lab_ext:dba
 
prompt
	"Printer" = "MINE"
	, "Look Back X Days" = 0
	, "Start Date" = "CURDATE"
	, "End Date" = "CURDATE"
 
with OUTDEV, LOOKBACK, STARTDATE, ENDDATE
 
;;/*** START 005 ***/
;;;*********************************************************************
;;;*** If PROD / CERT then run as 2nd oracle instance to improve
;;;*** efficiency. Will auto Fail-over to Instance 1 if Instance 2 down.
;;;*********************************************************************
;;IF(CURDOMAIN = "PROD")
;;  FREE DEFINE oraclesystem
;;  DEFINE oraclesystem 'v500/fullmoon@mhprbrpt'
;;ELSEIF(CURDOMAIN = "MHPRD")
;;  FREE DEFINE oraclesystem
;;  DEFINE oraclesystem 'v500/fullmoon@mhprbrpt'
;;ELSEIF(CURDOMAIN="MHCRT")
;;  FREE DEFINE oraclesystem
;;  DEFINE oraclesystem 'v500/java4t2@mhcrtrpt'
;;ENDIF ;CURDOMAIN
;;;*** Write instance ccl ran in to the log file
;;;SET Iname = fillstring(10," ")
;;;SELECT INTO value("mayo_logfiles:mayo_instance2.log")
;;;  run_date = format(sysdate,";;q")
;;; ,Iname = substring(1,7,instance_name)
;;;FROM v$instance
;;;DETAIL
;;;  col  1 run_date
;;;  col +1 curprog
;;;  col +1 " *Instance="
;;;  col +1 Iname
;;;with nocounter
;;;   , format
;;;****************** End of INSTANCE 2 routine ************************
;;/*** END 005 ***/
 
/*** Start 006 - New Code ****/
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
/*** END 006 - New Code ***/
 
if (not validate(reply,0))
 record reply
 (
 1 elapsed_time          = F8
%I cclsource:status_block.inc
  )
endif
set reply->status_data.status = "F"
 
declare startdate = dq8 with protect, noconstant(cnvtdatetime(cnvtdate2($startdate,"dd-mmm-yyyy"),000000))
declare enddate = dq8 with protect, noconstant(cnvtdatetime(cnvtdate2($enddate,"dd-mmm-yyyy"),235959))
 
if ($lookback > 0)
 set startdate = cnvtdatetime(curdate-$lookback,000000)
 set enddate = cnvtdatetime(curdate,235959)
endif
declare filename = vc with protect, constant
  (concat("mhs_ops:Lab_Download_",format(startdate,"mmddyy;;d"),".txt"))
 
declare num = i2 with protect, noconstant(0)
declare mrn_cd        = f8 with protect, constant( uar_get_code_by("MEANING", 319, "MRN"))
declare fnbr_cd       = f8 with protect, constant( uar_get_code_by("MEANING", 319, "FIN NBR"))
declare cmrn_cd        = f8 with protect, constant( uar_get_code_by("MEANING", 4, "CMRN"))
declare error_cd      = f8 with protect, constant( uar_get_code_by("MEANING", 8, "INERROR"))
declare auth_cd      = f8 with protect, constant( uar_get_code_by("MEANING", 8, "AUTH"))  ;001
declare modified_cd      = f8 with protect, constant( uar_get_code_by("MEANING", 8, "MODIFIED"));001
declare canceled_cd   = f8 with protect, constant( uar_get_code_by("MEANING", 12025, "CANCELED"))
declare ordered_cd    = f8 with protect, constant( uar_get_code_by("MEANING", 6004, "ORDERED"))
declare inprocess_cd  = f8 with protect, constant( uar_get_code_by("MEANING", 6004, "INPROCESS"))
declare pending_cd    = f8 with protect, constant( uar_get_code_by("MEANING", 6004, "PENDING REV"))
declare lab_cd        = f8 with protect, constant( uar_get_code_by("MEANING", 6000, "GENERAL LAB"))
declare genlab_cd     = f8 with protect, constant( uar_get_code_by("MEANING", 106, "GLB"))
declare disp_line     = vc with protect, noconstant(" ")
declare diabetes_report_cd     = f8 with protect, constant( uar_get_code_by("DISPLAY_KEY", 93,"DIABETESREPORT"))
declare labfile_cd    = f8 with protect, constant( uar_get_code_by("DISPLAY_KEY", 93,"LABFILE"))
declare inboxmsg_cd   = f8 with protect, constant( uar_get_code_by("MEANING", 69, "INBOXMSG"))
declare phonemsg_cd   = f8 with protect, constant( uar_get_code_by("MEANING", 69, "PHONEMSG"))
 
 
declare EULUTHERHOSP_cd = f8 with protect, constant( uar_get_code_by("DISPLAY_KEY",220,"EULUTHERHOSP"))
declare EUOAKRIDGEHOSP_cd = f8 with protect, constant( uar_get_code_by("DISPLAY_KEY",220,"EUOAKRIDGEHOSP"))
declare EUOAKRIDGECLIN_cd = f8 with protect, constant( uar_get_code_by("DISPLAY_KEY",220,"EUOAKRIDGECLIN"))
declare EUNWHOMECARE_cd = f8 with protect, constant( uar_get_code_by("DISPLAY_KEY",220,"EUNWHOMECARE"))
declare EUPAINCLINIC_cd = f8 with protect, constant( uar_get_code_by("DISPLAY_KEY",220,"EUPAINCLINIC"))
declare EUNORTHLNDHOSP_cd = f8 with protect, constant( uar_get_code_by("DISPLAY_KEY",220,"EUNORTHLNDHOSP"))
declare EUNORTHLNDCLIN_cd = f8 with protect, constant( uar_get_code_by("DISPLAY_KEY",220,"EUNORTHLNDCLIN"))
declare EUCHIPVALHOSP_cd = f8 with protect, constant( uar_get_code_by("DISPLAY_KEY",220,"EUCHIPVALHOSP"))
declare EUCHIPVALCLIN_cd = f8 with protect, constant( uar_get_code_by("DISPLAY_KEY",220,"EUCHIPVALCLIN"))
declare EUMIDELFORTCL_cd = f8 with protect, constant( uar_get_code_by("DISPLAY_KEY",220,"EUMIDELFORTCL"))
declare EULHBEHAVIORHLTH_cd = f8 with protect, constant( uar_get_code_by("DISPLAY_KEY",220,"EULHBEHAVIORHLTH"))
declare EUMCBEHAVHLTH_cd = f8 with protect, constant( uar_get_code_by("DISPLAY_KEY",220,"EUMCBEHAVHLTH"))
 
free record labs
record labs
( 1 cnt = i2
  1 qual[*]
    2 encntr_id = f8
    2 mrn = vc
    2 mrn_alias = vc
    2 org_id = c2
    2 site_id = c2
    2 name = vc
    2 age = vc
    2 sex = vc
    2 nurseunit = vc
    2 room = vc
    2 bed = vc
    2 rb = vc
    2 admit_dt = vc
    2 type = vc
    2 los = vc
    2 fnbr = vc
 ;005 start
    2 labs[*]
      3 result = vc
      3 unit = vc
      3 test_name = vc
      3 test_nbr = vc
      3 event_cd = f8
      3 event_end_datetime = vc
      3 display_flag = i2
      3 date = vc
      3 orig_order_date_time = vc
      3 ref_range = vc
      3 normalcy = vc
 
;    2 result = vc
;    2 unit = vc
;    2 test_name = vc
;    2 test_nbr = vc
;    2 event_cd = f8
;    2 event_end_datetime = vc
;    2 display_flag = i2
;    2 date = vc
;    2 orig_order_date_time = vc
;    2 ref_range = vc
;    2 normalcy = vc
; 005 end
)
free record lab_events
record lab_events
 ( 1 seq[*]
    2 code_value = f8
 )
 
/********** Get event Codes ********/
select into "nl:"
 
from v500_event_set_explode ese
     ,code_value cv
where ese.event_set_cd  = labfile_cd;  (  diabetes_report_cd, labfile_cd)
 and ese.event_cd = cv.code_value
 and cv.active_ind = 1
order by cv.code_value
 
head report
 cnt = 0
detail
 cnt = cnt + 1
  if (mod(cnt,10)=1)
   stat = alterlist(lab_events->seq,cnt+10)
  endif
  lab_events->seq[cnt].code_value = ese.event_cd
foot report
 stat = alterlist(lab_events->seq,cnt)
 
with nocounter
 ;
/* LABS */
select into "nl:"
from
   clinical_event c
   ,orders o
 
plan c where c.clinsig_updt_dt_tm between cnvtdatetime(startdate) and cnvtdatetime(enddate)
                and c.verified_dt_tm between cnvtdatetime(startdate) and cnvtdatetime(enddate)
                and c.view_level = 1
                and c.publish_flag = 1
                and c.valid_until_dt_tm = cnvtdatetime("31-DEC-2100,00:00:00")
                ;001 and c.result_status_cd != error_cd
                and c.result_status_cd in (auth_cd, modified_cd) ;001
                ;and c.task_assay_cd > 0  ;004
                and expand(num,1,size(lab_events->seq,5),c.event_cd,lab_events->seq[num]->code_value)
 
join o where c.order_id = o.order_id
 
;005  order c.event_end_dt_tm
order c.encntr_id, c.event_end_dt_tm   ;005
 
head report
  labs->cnt = 0
;005 start
  ecnt = 0
head c.encntr_id 				;005
  ecnt = ecnt + 1
  if (mod(ecnt,100)=1)
   stat = alterlist(labs->qual,ecnt+100)
  endif
  labs->qual[ecnt].encntr_id = c.encntr_id
  labs->cnt = 0
;005 end
detail
  labs->cnt = labs->cnt + 1
  if (mod(labs->cnt,100)=1)
   ;005  stat = alterlist(labs->qual,labs->cnt+100)
   stat = alterlist(labs->qual[ecnt]->labs,labs->cnt+100)		;005
  endif
 
;005 start
;  labs->qual[labs->cnt].encntr_id = c.encntr_id
;   labs->qual[labs->cnt].event_cd = c.event_cd
;  labs->qual[labs->cnt].test_nbr = cnvtstring(cnvtint(c.event_cd))
;
;  labs->qual[labs->cnt].test_name = uar_get_code_display(c.event_cd)
;  labs->qual[labs->cnt].result = c.result_val
;  labs->qual[labs->cnt].event_end_datetime = format(c.event_end_dt_tm,"mm/dd/yyyy")
;  labs->qual[labs->cnt].unit = uar_get_code_display(c.result_units_cd)
;  labs->qual[labs->cnt].normalcy = uar_get_code_display(c.normalcy_cd)
;  if (c.normal_low > " " and c.normal_high > " ")
;    labs->qual[labs->cnt].ref_range =
;      build("(",c.normal_low,"-",c.normal_high,")")
;  else
;    labs->qual[labs->cnt].ref_range = "(Nrml rng unspecfd)"
;  endif
;  labs->qual[labs->cnt].orig_order_date_time = format(o.orig_order_dt_tm, "mm/dd/yy hh:mm;;d" )
 
   labs->qual[ecnt]->labs[labs->cnt].event_cd = c.event_cd
  labs->qual[ecnt]->labs[labs->cnt].test_nbr = cnvtstring(cnvtint(c.event_cd))
 
  labs->qual[ecnt]->labs[labs->cnt].test_name = uar_get_code_display(c.event_cd)
  labs->qual[ecnt]->labs[labs->cnt].result = c.result_val
  labs->qual[ecnt]->labs[labs->cnt].event_end_datetime = format(c.event_end_dt_tm,"mm/dd/yyyy")
  labs->qual[ecnt]->labs[labs->cnt].unit = uar_get_code_display(c.result_units_cd)
  labs->qual[ecnt]->labs[labs->cnt].normalcy = uar_get_code_display(c.normalcy_cd)
  if (c.normal_low > " " and c.normal_high > " ")
    labs->qual[ecnt]->labs[labs->cnt].ref_range =
      build("(",c.normal_low,"-",c.normal_high,")")
  else
    labs->qual[ecnt]->labs[labs->cnt].ref_range = "(Nrml rng unspecfd)"
  endif
  labs->qual[ecnt]->labs[labs->cnt].orig_order_date_time = format(o.orig_order_dt_tm, "mm/dd/yy hh:mm;;d" )
 
 foot c.encntr_id
 stat = alterlist(labs->qual[ecnt]->labs,labs->cnt)
;005 end
 
 foot report
  ;005 stat = alterlist(labs->qual,labs->cnt)
 stat = alterlist(labs->qual,ecnt)
with nocounter
 
/* PATIENT INFO */
select into "nl:"
;005  from (dummyt d with seq = labs->cnt),
from (dummyt d with seq = size(labs->qual,5)),		;005
      encounter e,
      person p,
      encntr_alias ea
      ,encntr_alias ea1		;005
     ;005 ,code_value cv
 
plan d
join e  where e.encntr_id = labs->qual[d.seq].encntr_id
          and not e.encntr_type_class_cd in (phonemsg_cd,inboxmsg_cd) ;exclude these
;005  join cv where e.encntr_type_class_cd = cv.code_value
join p  where p.person_id = e.person_id
join ea where ea.encntr_id = e.encntr_id
          ;005  and ea.encntr_alias_type_cd in ( mrn_cd, fnbr_cd)
          and ea.encntr_alias_type_cd = mrn_cd					;005
          and ea.end_effective_dt_tm > sysdate
          and ea.active_ind = 1
join ea1 where ea1.encntr_id = e.encntr_id						;005
          and ea1.encntr_alias_type_cd = fnbr_cd				;005
          and ea1.end_effective_dt_tm > sysdate					;005
          and ea1.active_ind = 1								;005
 
detail
;005 labs->qual[d.seq].display_flag = 1
        labs->qual[d.seq].name = p.name_full_formatted
        labs->qual[d.seq].age = trim(cnvtage(cnvtdate(p.birth_dt_tm),curdate),3)
        labs->qual[d.seq].sex = uar_get_code_display(p.sex_cd)
        labs->qual[d.seq].type = uar_get_code_display(e.encntr_type_cd)
 
        ;005  if (ea.encntr_alias_type_cd = fnbr_cd)
        ;005        labs->qual[d.seq].fnbr = substring(1,20,cnvtalias(ea.alias,ea.alias_pool_cd))
                labs->qual[d.seq].fnbr = substring(1,20,cnvtalias(ea1.alias,ea1.alias_pool_cd))
        ;005  elseif (ea.encntr_alias_type_cd = mrn_cd)
                labs->qual[d.seq].mrn = replace(substring(1,20,cnvtalias(ea.alias,ea.alias_pool_cd)),"-","")
                labs->qual[d.seq].mrn_alias = ea.alias
        ;005  endif
 
        labs->qual[d.seq].org_id = substring(1,2,uar_get_code_display(e.loc_nurse_unit_cd))
        labs->qual[d.seq].site_id = substring(3,4,uar_get_code_display(e.loc_nurse_unit_cd))
 
        labs->qual[d.seq].nurseunit = uar_get_code_display(e.loc_nurse_unit_cd)
        labs->qual[d.seq].room = uar_get_code_display(e.loc_room_cd)
        labs->qual[d.seq].bed = uar_get_code_display(e.loc_bed_cd)
        labs->qual[d.seq].rb = concat(trim(labs->qual[d.seq].room),"-",trim(labs->qual[d.seq].bed))
 
   if (e.loc_nurse_unit_cd = 0)
    case (e.loc_facility_cd)
     of EULUTHERHOSP_CD     :  labs->qual[d.seq].site_id = "LH", labs->qual[d.seq].org_id = "EU"
     of EUOAKRIDGEHOSP_CD   :  labs->qual[d.seq].site_id = "OH", labs->qual[d.seq].org_id = "EU"
     of EUOAKRIDGECLIN_CD   :  labs->qual[d.seq].site_id = "OM", labs->qual[d.seq].org_id = "EU"
     of EUNWHOMECARE_CD     :  labs->qual[d.seq].site_id = "HC", labs->qual[d.seq].org_id = "EU"
     of EUPAINCLINIC_CD     :  labs->qual[d.seq].site_id = "PC", labs->qual[d.seq].org_id = "EU"
     of EUNORTHLNDHOSP_CD   :  labs->qual[d.seq].site_id = "BH", labs->qual[d.seq].org_id = "EU"
     of EUNORTHLNDCLIN_CD   :  labs->qual[d.seq].site_id = "BC", labs->qual[d.seq].org_id = "EU"
     of EUCHIPVALHOSP_CD    :  labs->qual[d.seq].site_id = "BL", labs->qual[d.seq].org_id = "EU"
     of EUCHIPVALCLIN_CD    :  labs->qual[d.seq].site_id = "BM", labs->qual[d.seq].org_id = "EU"
     of EUMIDELFORTCL_CD    :  labs->qual[d.seq].site_id = "MC", labs->qual[d.seq].org_id = "EU"
     of EULHBEHAVIORHLTH_CD :  labs->qual[d.seq].site_id = "LB", labs->qual[d.seq].org_id = "EU"
     of EUMCBEHAVHLTH_CD    :  labs->qual[d.seq].site_id = "MB", labs->qual[d.seq].org_id = "EU"
      else                     labs->qual[d.seq].site_id = "zz", labs->qual[d.seq].org_id = "xx"
    endcase
   endif
 
with nocounter
 
;;;;;;;;; Output Display ;;;;;;;;;;
 
select into $1
 mrn = labs->qual[d.seq].mrn
;005 start
;from (dummyt d with seq = labs->cnt)
;where labs->qual[d.seq].display_flag = 1
from (dummyt d with seq = size(labs->qual,5)),
     (dummyt d1 with seq = 1)
 
plan d
where maxrec(d1,size(labs->qual[d.seq].labs,5))
 
join d1
;005 end
order by mrn, d.seq
head report
 
 sep_char = "|"
 disp_line = concat(
  "Medical_Record_Number",sep_char,
  "Date_Performed",sep_char,
  "Org_ID",sep_char,
  "Site_ID",sep_char,
  "Results_Value",sep_char,
  "Units_Value",sep_char,
  "Test_Name",sep_char,
  "Test_Number",sep_char,
  "Encounter_Type")
  disp_line row + 1
 
detail
 
 disp_line = concat(
;002 trim(labs->qual[d.seq].mrn ,3),sep_char,
;002 trim(labs->qual[d.seq].event_end_datetime ,3),sep_char,
 trim(labs->qual[d.seq].mrn ,3),sep_char,
;005 trim(labs->qual[d.seq].event_end_datetime ,3),sep_char,
 trim(labs->qual[d.seq]->labs[d1.seq].event_end_datetime ,3),sep_char,		;005
 trim(labs->qual[d.seq].org_id,3),sep_char,
 trim(labs->qual[d.seq].site_id,3),sep_char,
 trim(labs->qual[d.seq]->labs[d1.seq].result,3),sep_char,		;005
 trim(labs->qual[d.seq]->labs[d1.seq].unit ,3),sep_char,		;005
 trim(labs->qual[d.seq]->labs[d1.seq].test_name ,3),sep_char,		;005
 trim(labs->qual[d.seq]->labs[d1.seq].test_nbr ,3),sep_char,		;005
;005 trim(labs->qual[d.seq].result,3),sep_char,
;005 trim(labs->qual[d.seq].unit ,3),sep_char,
;005 trim(labs->qual[d.seq].test_name ,3),sep_char,
;005 trim(labs->qual[d.seq].test_nbr ,3),sep_char,
 trim(labs->qual[d.seq].type,3)
 )
  disp_line row + 1
 
with maxrow = 1,maxcol=2000,format=variable, formfeed = none
 
;;;;;;;;; Output to file ;;;;;;;;;;
select into value(trim(filename))
 mrn = labs->qual[d.seq].mrn
;005 start
;from (dummyt d with seq = labs->cnt)
;where labs->qual[d.seq].display_flag = 1
from (dummyt d with seq = size(labs->qual,5)),
     (dummyt d1 with seq = 1)
 
plan d
where maxrec(d1,size(labs->qual[d.seq].labs,5))
 
join d1
;005 end
order by mrn, d.seq
head report
 
 sep_char = "|"
 disp_line = concat(
  "Medical_Record_Number",sep_char,
  "Date_Performed",sep_char,
  "Org_ID",sep_char,
  "Site_ID",sep_char,
  "Results_Value",sep_char,
  "Units_Value",sep_char,
  "Test_Name",sep_char,
  "Test_Number",sep_char,
  "Encounter_Type")
  disp_line row + 1
 
detail
 
 disp_line = concat(
 trim(labs->qual[d.seq].mrn ,3),sep_char,
;005 trim(labs->qual[d.seq].event_end_datetime ,3),sep_char,
 trim(labs->qual[d.seq]->labs[d1.seq].event_end_datetime ,3),sep_char,		;005
 trim(labs->qual[d.seq].org_id,3),sep_char,
 trim(labs->qual[d.seq].site_id,3),sep_char,
 trim(labs->qual[d.seq]->labs[d1.seq].result,3),sep_char,		;005
 trim(labs->qual[d.seq]->labs[d1.seq].unit ,3),sep_char,		;005
 trim(labs->qual[d.seq]->labs[d1.seq].test_name ,3),sep_char,		;005
 trim(labs->qual[d.seq]->labs[d1.seq].test_nbr ,3),sep_char,		;005
;005 trim(labs->qual[d.seq].result,3),sep_char,
;005 trim(labs->qual[d.seq].unit ,3),sep_char,
;005 trim(labs->qual[d.seq].test_name ,3),sep_char,
;005 trim(labs->qual[d.seq].test_nbr ,3),sep_char,
 trim(labs->qual[d.seq].type,3)
 )
  disp_line row + 1
 
with maxrow = 1,maxcol=2000,format=variable, formfeed = none
set reply->status_data.status = "S"
 
 
;; /*** START 005 ***/
;;;*** After report put back to instance 1
;;IF(CURDOMAIN = "PROD")
;;  FREE DEFINE oraclesystem
;;  DEFINE oraclesystem 'v500/fullmoon@mhprb1'
;;ELSEIF(CURDOMAIN = "MHPRD")
;;  FREE DEFINE oraclesystem
;;  DEFINE oraclesystem 'v500/fullmoon@mhprb1'
;;ELSEIF(CURDOMAIN="MHCRT")
;;  FREE DEFINE oraclesystem
;;  DEFINE oraclesystem 'v500/java4t2@mhcrt1'
;;ENDIF ;CURDOMAIN
;;/*** END 005 ***/
 
/****Start 006 - New Code ***/
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
 
/***END 006 - New Code ***/
 
#exit_script
end go
 
 
 
