/************************************************************************
 *                                                                      *
 *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
 *                              Technology, Inc.                        *
 *       Revision      (c) 1984-2008 Cerner Corporation                 *
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
 ************************************************************************
 
          Author:             M142151
          Date Written:       06/09/2015
          Source file name:   mayo_mn_rpt_formfast_extract.prg
          Object Name:        mayo_mn_rpt_formfast_extract
          Request #:          n/a
 
          Program purpose:    Custom formfast extract
 
          Tables read:        Various
          Tables Updated:     None
          Executing From:     CCL
 
          Special Notes: Most of this code was copied from mayo_mn_rpt_optia_extract.prg
          				 Some additions were made and the formatting of the output was modified
          				 Reduce amount of code by creating subroutines to calculate address/phone
          				 in future releases. Rush release so no time to investigate and integrate
          				 in existing code.
 
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
 *000 06/09/15 m142151              Initial release                    *
 *																	   *
 ******************** End of Modification Log **************************/
 
drop program mayo_mn_rpt_formfast_extract go
create program mayo_mn_rpt_formfast_extract
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Messages will be output to MINE.
	, "Appt Date" = "CURDATE"                ;* Please enter the appointment date.
	, "Facility" = ""                        ;* Please select the facility.
	, "MRN" = ""                             ;* Please enter the medical record number.
	, "FIN" = ""                             ;* Please enter the financial number.
	, "Appt Type" = 0.000000                 ;* Please select the appointment type.
	, "Form Printer" = ""                    ;* If no printer is selected, value of the Printer accept format for each appointment
	, "Print Queue Override" = ""            ;* WARNING: Bypasses print queue/form printer! Outputs raw data to specified destinat
 
with OUTDEV, appdate, facility, mrn, fin, appttype, printer, printqueue
 
 
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
free define rtl
define rtl is "dbinfo.dat"
 
declare pass = vc
 
select distinct into "nl:"
  line = substring(1,30,r.line)   ; 9,9       10,9
from
  rtlt r
plan r
 
detail
  if (line = "dbpw*")
    pass_in = substring(9,15,line)
    pass = trim(pass_in,3)
  endif
with counter
 
;*** Now we are finished with the dbinfo.dat file and will delete it.
set dcl_command = ""
set dcl_command = "rm $CCLUSERDIR/dbinfo.dat"
set dcl_size = size(dcl_command)
set dcl_stat = 0
 
call dcl(dcl_command,dcl_size,dcl_stat)
 
declare system = vc
 
;*** This section redifines the OracleSystem variable pointing it to
;***   database instance 2 using the password read in above.
;*** This only applies to PRD and CRT, because they are the only domains
;***   that have multiple instance databases.
if (curdomain = "MHPRD")
  free define oraclesystem
  set system = build(concat('v500/', pass, '@mhprdrpt'))
  define oraclesystem system
elseif (curdomain = "MHCRT")
  free define oraclesystem
  set system=build(concat('v500/', pass, '@mhcrtrpt'))
  define oraclesystem system
endif
 
/*** End Oracle Instance code ***/
 
set trace nocost                        ; turn off cost displaying
set message noinformation               ; turn off info displaying
 
call echo("Initializing...")
 
declare start_date             = dq8 with protect, noconstant(cnvtdatetime("31-DEC-2100"))
declare end_date               = dq8 with protect, noconstant(cnvtdatetime("01-JAN-1800"))
declare fin_parm               = vc  with protect, noconstant(trim(cnvtstring(cnvtreal($FIN)),3))
declare mrn_parm               = vc  with protect, noconstant(trim(cnvtstring(cnvtreal($MRN)),3))
declare cmrn_parm			   = vc  with protect, noconstant("")
declare l9mrn_parm		       = vc  with protect, noconstant("")
declare encntr_id              = f8  with protect, noconstant(0.0)
declare person_id              = f8  with protect, noconstant(0.0)
declare fin_person_name        = vc  with protect, noconstant("")
declare printer_name           = vc  with protect, constant(trim(cnvtlower($PRINTER),3))
 
declare sch_event_id           = f8  with protect, noconstant(0.0)
declare contrib_src_cd         = f8  with protect, noconstant(0.0)
declare org_alias_pool_cd      = f8  with protect, noconstant(0.0)
declare gtorg_alias_pool_cd    = f8  with protect, noconstant(0.0)
declare prsnl_alias_pool_cd    = f8  with protect, noconstant(0.0)
declare print_queue_name       = vc  with protect, noconstant("")
declare facility               = vc  with protect, noconstant("")
declare print_attempt_ind      = i2  with protect, noconstant(0)
declare fin_pool_cd            = f8  with protect, noconstant(0.0)
declare mrn_pool_cd            = f8  with protect, noconstant(0.0)
declare cmrn_pool_cd		   = f8  with protect, constant(uar_get_code_by("DISPLAYKEY",263,"CMRN"))
declare mother_reltn_cd		   = f8  with protect, constant(uar_get_code_by("MEANING",40,"MOTHER"))
declare next_of_kin			   = f8  with protect, constant(uar_get_code_by("MEANING",351,"NOK"))
declare l9mrn_pool_cd          = f8  with protect, noconstant(uar_get_code_by("DISPLAYKEY",263,"L9MRN"))
declare l1fin_pool_cd          = f8  with protect, constant(uar_get_code_by("DISPLAYKEY",263,"L1FIN"))
declare l2fin_pool_cd          = f8  with protect, constant(uar_get_code_by("DISPLAYKEY",263,"L2FIN"))
declare l9fin_pool_cd          = f8  with protect, constant(uar_get_code_by("DISPLAYKEY",263,"L9FIN"))
declare encntr_mrn_alias_type_cd   = f8  with protect, constant(uar_get_code_by("DISPLAYKEY",319,"MRN"))
declare encntr_fin_alias_type_cd   = f8  with protect, constant(uar_get_code_by("DISPLAYKEY",319,"FINNBR"))
declare person_org_reltn_cd	   = f8  with protect, constant(uar_get_code_by("MEANING",338,"EMPLOYER"))
 
declare current_name_cd        = f8  with protect, constant(uar_get_code_by("MEANING",213,"CURRENT"))
declare home_ph_type_cd        = f8  with protect, constant(uar_get_code_by("MEANING",43,"HOME"))
declare bus_ph_type_cd         = f8  with protect, constant(uar_get_code_by("MEANING",43,"BUSINESS"))
declare addr_type_cd           = f8  with protect, constant(uar_get_code_by("MEANING",212,"HOME"))
declare bus_addr_type_cd       = f8  with protect, constant(uar_get_code_by("MEANING",212,"BUSINESS"))
declare guar_type_cd           = f8  with protect, constant(uar_get_code_by("MEANING",351,"DEFGUAR"))
declare guarnbr_pool_cd        = f8  with protect, constant(uar_get_code_by("DISPLAYKEY",263,"CUSTGUARNBR"))
declare referdoc1_reltn_cd     = f8  with protect, constant(uar_get_code_by("DISPLAYKEY",333,"REFERRINGPHYSICIAN"))
declare referdoc2_reltn_cd     = f8  with protect, constant(uar_get_code_by("DISPLAYKEY",333,"REFERRINGPHYSICIANHOSPITAL"))
declare attenddoc_reltn_cd     = f8  with protect, constant(uar_get_code_by("MEANING",333,"ATTENDDOC"))
declare consultdoc_reltn_cd	   = f8  with protect, constant(uar_get_code_by("MEANING",333,"CONSULTDOC"))
declare fin_type_cd            = f8  with protect, constant(uar_get_code_by("MEANING",319,"FIN NBR"))
declare mrn_type_cd            = f8  with protect, constant(uar_get_code_by("MEANING",4,"MRN"))
declare eo_reltn_cd            = f8  with protect, noconstant(uar_get_code_by("MEANING",352,"GUARANTOR"))
declare eo_reltn_type_cd       = f8  with protect, noconstant(uar_get_code_by("MEANING",362,"GUARANTOR"))
 
declare tmp_str                = vc  with protect, noconstant("")
declare idx					   = i2  with protect, noconstant(0)
declare jdx					   = i2	 with protect, noconstant(0)
declare pos					   = i2	 with protect, noconstant(0)
 
set fin_parm="6593347" ;JRG FORCING FOR TESTING, DELETE LATER
set mrn_parm="1058721" ;JRG FORCING FOR TESTING, DELETE LATER
 
free set tmp_io
record tmp_io
(
  1 cnt                   = i4
  1 qual[*]
    2 line                = vc
)
 
free set hold
record hold
(
  1 cnt                   = i4
  1 qual[*]
    2 person_id           = f8
    2 encntr_id           = f8
    2 sch_event_id        = f8
    2 name_last           = vc
    2 name_first          = vc
    2 name_middle         = vc
    2 name_prefix		  = vc
    2 name_suffix		  = vc
    2 birth_dt_tm         = dq8
    2 sex_cd              = f8
    2 marital_status_cd	  = f8
    2 race_cd			  = f8
    2 religion_cd		  = f8
    2 name_mother		  = vc
    2 fin                 = vc
    2 mrn                 = vc
    2 cmrn				  = vc
    2 l9mrn				  = vc
    2 facility_cd		  = f8
    2 nurse_unit_cd		  = f8
    2 room_cd			  = f8
    2 bed_cd			  = f8
    2 medical_service_cd  = f8
    2 disch_disp_cd		  = f8
    2 disch_dt_tm		  = dq8
    2 addr
      3 street_addr1      = vc
      3 street_addr2      = vc
      3 city              = vc
      3 state             = vc
      3 zip               = vc
      3 country			  = vc
    2 home_phone          = vc
    2 bus_phone           = vc
    2 nok
      3 person_id		  = f8
      3 name_last		  = vc
      3 name_first		  = vc
      3 reltn_type_cd	  = f8
      3 street_addr1  	  = vc
      3 street_addr2   	  = vc
      3 city          	  = vc
      3 state             = vc
      3 zip            	  = vc
      3 home_phone		  = vc
    2 guar
      3 person_id         = f8
      3 organization_id   = f8
      3 alias             = vc
      3 name_last         = vc
      3 name_first		  = vc
      3 reltn_type_cd	  = vc
      3 home_phone		  = vc
      3 employer		  = vc
      3 emp_bus_phone	  = vc
      3 addr
        4 street_addr1    = vc
        4 street_addr2    = vc
        4 city            = vc
        4 state           = vc
        4 zip             = vc
    2 fin_class_alias_db  = vc
    2 fin_class_alias     = vc
    2 fin_class_cd        = f8
    2 health_plan[2]
      3 organization_id   = f8
      3 org_alias         = vc
      3 org_name          = vc
      3 plan_name         = vc
      3 policy_nbr        = vc
      3 group_nbr		  = vc
      3 effective_dt_tm   = dq8
      3 expire_dt_tm	  = dq8
      3 copay_amt         = f8
      3 bus_phone         = vc
      3 addr
        4 street_addr1    = vc
        4 street_addr2    = vc
        4 city            = vc
        4 state           = vc
        4 zip             = vc
    2 appt
      3 beg_dt_tm         = dq8
      3 appt_type_cd      = f8
      3 resource_alias    = vc
      3 resource_cd       = f8
      3 appt_location_cd  = f8
      3 appt_loc_alias    = vc
      3 order_md_id       = f8
      3 order_md_alias    = vc
      3 order_md_name     = vc
      3 printer_name      = vc
    2 refer_md_id         = f8
    2 refer_md_alias      = vc
    2 refer_md_name       = vc
    2 attend_md_id        = f8
    2 attend_md_alias     = vc
    2 attend_md_name      = vc
    2 consult_md_id		  = f8
    2 consult_md_alias	  = vc
    2 consult_md_name	  = vc
)
 
/*** Find facility, sch_event_id, start date, end date and printer ***/
if (validate(formfast_request->sch_event_id))
  set sch_event_id = formfast_request->sch_event_id
  set print_queue_name = formfast_request->printer
  set facility = formfast_request->facility
 
  select into "nl:"
  from
    sch_appt a  ;RESOURCE
    , sch_appt a2  ;PATIENT
  plan a
    where a.sch_event_id = sch_event_id
      and a.role_meaning != "PATIENT"
      and a.state_meaning in ("CONFIRMED","CHECKED IN")
      and a.primary_role_ind = 1
      and a.version_dt_tm = cnvtdatetime("31-DEC-2100")
      and a.active_ind = 1
      and a.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
      and a.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
  join a2
    where a2.sch_event_id = a.sch_event_id +0
      and a2.role_meaning = "PATIENT"
      and a2.state_meaning in ("CONFIRMED","CHECKED IN")
      and a2.version_dt_tm = cnvtdatetime("31-DEC-2100")
      and a2.active_ind = 1
      and a2.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
      and a2.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
  detail
    start_date = least(a.beg_dt_tm,a2.beg_dt_tm,start_date)
    end_date = greatest(a.beg_dt_tm,a2.beg_dt_tm,end_date)
  with nocounter
else
  set facility     = cnvtupper($FACILITY)
  set start_date   = cnvtdatetime(concat($APPTDATE," 00:00:00"))
  set end_date     = cnvtdatetime(concat($APPTDATE," 23:59:59"))
 
  select into "nl:"
  from
	sch_appt s
	, person_alias p
	, encounter e
	, encntr_alias ea
  plan ea
    where ea.alias = fin_parm
  join e
    where e.encntr_id = ea.encntr_id
  join s
    where ea.encntr_id = s.encntr_id
      and s.active_ind = 1
  join p
    where p.person_id = e.person_id
      and p.alias = mrn_parm
  detail
    sch_event_id = s.sch_event_id
  with nocounter
 
endif
 
call echo(facility)
call echo(start_date)
call echo(end_date)
call echo(sch_event_id)
 
/*** Find alias pool codes ***/
case (facility)
  of "FSH":
    select into "NL:"
  	from
  	  sch_appt s
	  , encntr_alias ea ;FIN
  	  , encntr_alias ea2 ;MRN
  	  , encounter e
  	plan s
  	  where s.sch_event_id = sch_event_id
  	join ea
  	  where ea.encntr_id = s.encntr_id
  		and ea.encntr_alias_type_cd = encntr_fin_alias_type_cd
  		and ea.alias_pool_cd in (l1fin_pool_cd, l2fin_pool_cd, l9fin_pool_cd)
  		and ea.active_ind = 1
  		and ea.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
  		and ea.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
  	join ea2
  	  where ea2.encntr_id = ea.encntr_id
		and ea2.encntr_alias_type_cd = encntr_mrn_alias_type_cd
		and ea2.active_ind = 1
  		and ea2.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
  	    and ea2.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
  	join e
  	  where e.encntr_id = ea.encntr_id
  		and e.active_ind = 1
  		and e.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
  		and e.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
  	detail
  	  fin_pool_cd = ea.alias_pool_cd
  	  mrn_pool_cd = ea2.alias_pool_cd
  	with nocounter, time = 30
 
 	call echo(concat(" FIN PARM--->",FIN_PARM))
 	call echo(concat(" ",build("ENCNTR_FIN_ALIAS_TYPE_CD--->",ENCNTR_FIN_ALIAS_TYPE_CD)))
 	call echo(concat(" ",build("L1FIN_POOL_CD--->",L1FIN_POOL_CD)))
 	call echo(concat(" ",build("L2FIN_POOL_CD--->",L2FIN_POOL_CD)))
 	call echo(concat(" ",build("L9FIN_POOL_CD--->",L9FIN_POOL_CD)))
 	call echo(concat(" ",build("ENCNTR_MRN_ALIAS_TYPE_CD--->",ENCNTR_MRN_ALIAS_TYPE_CD)))
 	call echo(concat(" ",build("FIN_POOL_CD--->",FIN_POOL_CD)))
 	call echo(concat(" ",build("MRN_POOL_CD--->",MRN_POOL_CD)))
 
    set contrib_src_cd         = uar_get_code_by("DISPLAYKEY",73,"FSHHPPSRC")
    set org_alias_pool_cd      = uar_get_code_by("DISPLAYKEY",263,"INSURANCECODELAHPP")
    set gtorg_alias_pool_cd    = uar_get_code_by("DISPLAYKEY",263,"GUARANTORLA")
    set prsnl_alias_pool_cd    = uar_get_code_by("DISPLAYKEY",263,"LALEGACY1")
 
    if (textlen(trim(print_queue_name,3)) = 0)
      set print_queue_name     = "optiocern" ;zzz
    endif
  of "RCMC":
    set contrib_src_cd         = uar_get_code_by("DISPLAYKEY",73,"RCMCHPPSRC")
    set org_alias_pool_cd      = uar_get_code_by("DISPLAYKEY",263,"INSURANCECODEME")
    set gtorg_alias_pool_cd    = uar_get_code_by("DISPLAYKEY",263,"GUARANTORME")
    set prsnl_alias_pool_cd    = uar_get_code_by("DISPLAYKEY",263,"MELEGACY2")
    set fin_pool_cd            = uar_get_code_by("DISPLAYKEY",263,"MEFIN")
    set mrn_pool_cd            = uar_get_code_by("DISPLAYKEY",263,"MEMRN")
    ;Since L9MRN pool cd is not used by RCMC, just making it duplicate of MEMRN to prevent issues below.
    set l9mrn_pool_cd          = uar_get_code_by("DISPLAYKEY",263,"MEMRN")
 
    if (textlen(trim(print_queue_name,3)) = 0)
      set print_queue_name     = "fftest1"
    endif
endcase
 
if (textlen(trim($PRINTQUEUE,3)) > 0)
  set print_queue_name = trim(cnvtlower($PRINTQUEUE),3)
endif
 
declare fin_pool_disp          = vc  with protect, constant(uar_get_code_display(fin_pool_cd))
declare mrn_pool_disp          = vc  with protect, constant(uar_get_code_display(mrn_pool_cd))
 
call echo(concat("     ",build("CURRENT_NAME_CD->",CURRENT_NAME_CD)))
call echo(concat("     ",build("HOME_PH_TYPE_CD->",HOME_PH_TYPE_CD)))
call echo(concat("     ",build("BUS_PH_TYPE_CD->",BUS_PH_TYPE_CD)))
call echo(concat("     ",build("ADDR_TYPE_CD->",ADDR_TYPE_CD)))
call echo(concat("     ",build("BUS_ADDR_TYPE_CD->",ADDR_TYPE_CD)))
call echo(concat("     ",build("FIN_POOL_CD->",FIN_POOL_CD)))
call echo(concat("     ",build("MRN_POOL_CD->",MRN_POOL_CD)))
call echo(concat("     ",build("CMRN_POOL_CD->",CMRN_POOL_CD)))
call echo(concat("     ",build("L9MRN_POOL_CD->",L9MRN_POOL_CD)))
call echo(concat("     ",build("FIN_TYPE_CD->",FIN_TYPE_CD)))
call echo(concat("     ",build("MRN_TYPE_CD->",MRN_TYPE_CD)))
call echo(concat("     ",build("GUAR_TYPE_CD->",GUAR_TYPE_CD)))
call echo(concat("     ",build("GUARNBR_POOL_CD->",GUARNBR_POOL_CD)))
call echo(concat("     ",build("REFERDOC1_RELTN_CD->",REFERDOC1_RELTN_CD)))
call echo(concat("     ",build("REFERDOC2_RELTN_CD->",REFERDOC2_RELTN_CD)))
call echo(concat("     ",build("EO_RELTN_CD->",EO_RELTN_CD)))
call echo(concat("     ",build("EO_RELTN_TYPE_CD->",EO_RELTN_TYPE_CD)))
call echo(concat("     ",build("contrib_src_cd->",contrib_src_cd)))
call echo(concat("     ",build("org_alias_pool_cd->",org_alias_pool_cd)))
call echo(concat("     ",build("gtorg_alias_pool_cd->",gtorg_alias_pool_cd)))
call echo(concat("     ",build("prsnl_alias_pool_cd->",prsnl_alias_pool_cd)))
 
call echo (fin_pool_cd)
set fin_pool_cd =    25036941.00 ;zzz
 
/*** Gather FIN and MRN ***/
if (fin_parm > "0")
  call EchoOut("Loading data for FIN...")
 
  select into "nl:"
  from
    encntr_alias ea
    , encounter e
    , person p
  plan ea
    where ea.alias = fin_parm
      and ea.alias_pool_cd = fin_pool_cd
      and ea.encntr_alias_type_cd = fin_type_cd
      and ea.active_ind = 1
      and ea.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
      and ea.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
  join e
    where e.encntr_id = ea.encntr_id +0
  join p
    where p.person_id = e.person_id +0
 
  detail
    encntr_id = e.encntr_id
    person_id = e.person_id
    fin_person_name = trim(p.name_full_formatted,3)
 
    call EchoOut(concat("  FIN ",fin_parm," returns ",format(e.reg_dt_tm,"MM/DD/YYYY HH:MM;;D"),
                        " encounter for ",fin_person_name,"."))
  with nocounter
 
  if (curqual > 1)
    call EchoOut(concat("  ###ERROR: Multiple encounters found for ",fin_pool_disp," ",fin_parm,"."))
    go to 9999_EXIT
  elseif (encntr_id = 0)
    call EchoOut(concat("  ###ERROR: No encounter found for ",fin_pool_disp," ",fin_parm,"."))
    go to 9999_EXIT
  elseif (person_id = 0)
    call EchoOut(concat("  ###ERROR: No person associated to ",fin_pool_disp," ",fin_parm,"."))
    go to 9999_EXIT
  endif
endif
 
 set mrn_pool_cd =    25036940.00 ;zzz
if (mrn_parm > "0")
  call EchoOut("Loading data for MRN...")
 
  select into "nl:"
  from
    person_alias pa
    , person p
  plan pa
    where pa.alias = mrn_parm
      and person_id in (0, pa.person_id)
      and pa.alias_pool_cd = mrn_pool_cd
      and pa.person_alias_type_cd = mrn_type_cd
      and pa.active_ind = 1
      and pa.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
      and pa.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
  join p
    where p.person_id = pa.person_id +0
  detail
    call EchoOut(concat("  ",trim(p.name_full_formatted,3)," returned for ",mrn_pool_disp," ",mrn_parm,"."))
    call echo(p.person_id)
 
    person_id = p.person_id
  with nocounter
 
  if (curqual > 1)
    call EchoOut(concat("  ###ERROR: Multiple persons found for ",mrn_pool_disp," ",mrn_parm,"."))
    go to 9999_EXIT
  elseif (curqual = 0 and person_id > 0)
    call EchoOut(concat("  ###ERROR: ",fin_person_name," does not have an ",mrn_pool_disp," of ",mrn_parm,"."))
    go to 9999_EXIT
  elseif (person_id = 0)
    call EchoOut(concat("  ###ERROR: No person found for ",mrn_pool_disp," ",mrn_parm,"."))
    go to 9999_EXIT
  endif
endif
 
/*** Gather Core Patient Data ***/
call EchoOut("Loading records...")
 
select into "nl:"
from
  sch_appt a  ;RESOURCE
  , sch_appt a2  ;PATIENT
  , sch_event ev
  , encounter e
  , person p
  , person_name pn
  , person_person_reltn ppr
  , person p2 ;MOTHER
  , person_alias pa
  , person_alias pa2 ;L9MRN
  , person_alias pa3 ;CMRN
  , encntr_alias ea
  , code_value_outbound cvo
  , code_value_outbound cvo2
  , code_value_outbound cvo3
plan a
  where a.beg_dt_tm >= cnvtdatetime(start_date)
    and a.beg_dt_tm <= cnvtdatetime(end_date)
    and sch_event_id in (0, a.sch_event_id)
    and a.role_meaning != "PATIENT"
    and a.state_meaning in ("CONFIRMED","CHECKED IN")
    and a.primary_role_ind = 1
    and a.version_dt_tm = cnvtdatetime("31-DEC-2100")
    and a.active_ind = 1
    and a.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
    and a.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
join a2
  where a2.sch_event_id = a.sch_event_id
    and a2.role_meaning = "PATIENT"
    and encntr_id in (0, a2.encntr_id)
    and person_id in (0, a2.person_id)
    and a2.state_meaning in ("CONFIRMED","CHECKED IN")
    and a2.version_dt_tm = cnvtdatetime("31-DEC-2100")
    and a2.active_ind = 1
    and a2.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
    and a2.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
join ev
  where ev.sch_event_id = a.sch_event_id
    and $APPTTYPE in (0, ev.appt_type_cd)
join e
  where e.encntr_id = a2.encntr_id
join p
  where p.person_id = a2.person_id
join pn
  where pn.person_id = p.person_id
    and pn.active_ind = 1
    and pn.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
    and pn.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
join ppr
  where ppr.related_person_id = outerjoin(p.person_id)
  	and ppr.person_reltn_cd = outerjoin(mother_reltn_cd)
  	and ppr.active_ind = outerjoin(1)
  	and ppr.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
  	and ppr.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
join p2
  where p2.person_id = outerjoin(ppr.person_id)
join pa
  where pa.person_id = p.person_id
    and pa.alias_pool_cd = mrn_pool_cd
    and pa.active_ind = 1
    and pa.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
    and pa.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
join pa2
  where pa2.person_id = p.person_id
    and pa2.alias_pool_cd = l9mrn_pool_cd
    and pa2.active_ind = 1
    and pa2.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
    and pa2.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
join pa3
  where pa3.person_id = p.person_id
    and pa3.alias_pool_cd = cmrn_pool_cd
    and pa3.active_ind = 1
    and pa3.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
    and pa3.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
join ea
  where ea.encntr_id = outerjoin(e.encntr_id)
    and ea.encntr_alias_type_cd = outerjoin(fin_type_cd)
    and ea.active_ind = outerjoin(1)
    and ea.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
    and ea.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
join cvo
  where cvo.code_value = outerjoin(e.financial_class_cd)
    and cvo.contributor_source_cd = outerjoin(contrib_src_cd)
join cvo2
  where cvo2.code_value = outerjoin(a2.appt_location_cd)
    and cvo2.contributor_source_cd = outerjoin(contrib_src_cd)
join cvo3
  where cvo3.code_value = outerjoin(a.resource_cd)
    and cvo3.contributor_source_cd = outerjoin(contrib_src_cd)
order
  ev.sch_event_id
head ev.sch_event_id
  hold->cnt = hold->cnt + 1
 
  if (mod(hold->cnt,100) = 1)
    stat = alterlist(hold->qual, hold->cnt + 99)
  endif
 
  hold->qual[hold->cnt].person_id              = p.person_id
  hold->qual[hold->cnt].encntr_id              = e.encntr_id
  hold->qual[hold->cnt].sch_event_id           = ev.sch_event_id
  hold->qual[hold->cnt].name_last              = p.name_last
  hold->qual[hold->cnt].name_first             = p.name_first
  hold->qual[hold->cnt].name_middle            = p.name_middle
  hold->qual[hold->cnt].name_prefix			   = pn.name_prefix
  hold->qual[hold->cnt].name_suffix			   = pn.name_suffix
  hold->qual[hold->cnt].birth_dt_tm            = p.birth_dt_tm
  hold->qual[hold->cnt].sex_cd                 = p.sex_cd
  hold->qual[hold->cnt].marital_status_cd	   = p.marital_type_cd
  hold->qual[hold->cnt].race_cd				   = p.race_cd
  hold->qual[hold->cnt].religion_cd			   = p.religion_cd
  hold->qual[hold->cnt].name_mother			   = concat(p2.name_last, ", ", p2.name_first)
  hold->qual[hold->cnt].fin                    = ea.alias
  hold->qual[hold->cnt].mrn                    = pa.alias
  hold->qual[hold->cnt].l9mrn                  = pa2.alias
  hold->qual[hold->cnt].cmrn                   = pa3.alias
  hold->qual[hold->cnt].facility_cd			   = e.loc_facility_cd
  hold->qual[hold->cnt].nurse_unit_cd		   = e.loc_nurse_unit_cd
  hold->qual[hold->cnt].room_cd			 	   = e.loc_room_cd
  hold->qual[hold->cnt].bed_cd				   = e.loc_bed_cd
  hold->qual[hold->cnt].medical_service_cd	   = e.med_service_cd
  hold->qual[hold->cnt].disch_disp_cd		   = e.disch_disposition_cd
  hold->qual[hold->cnt].disch_dt_tm			   = e.disch_dt_tm
  hold->qual[hold->cnt].fin_class_alias_db     = cvo.alias
  hold->qual[hold->cnt].fin_class_alias        = cvo.alias
  hold->qual[hold->cnt].fin_class_cd           = e.financial_class_cd
  hold->qual[hold->cnt].appt.beg_dt_tm         = a2.beg_dt_tm
  hold->qual[hold->cnt].appt.appt_type_cd      = ev.appt_type_cd
  hold->qual[hold->cnt].appt.resource_alias    = cvo3.alias
  hold->qual[hold->cnt].appt.resource_cd       = a.resource_cd
  hold->qual[hold->cnt].appt.appt_loc_alias    = cvo2.alias
  hold->qual[hold->cnt].appt.appt_location_cd  = a2.appt_location_cd
 
  if (textlen(printer_name) > 0)
    hold->qual[hold->cnt].printer_name = printer_name
  endif
with nocounter
 
set stat = alterlist(hold->qual,hold->cnt)
call EchoOut(concat("  ",trim(cnvtstring(hold->cnt),3)," record(s) loaded."))
 
if (hold->cnt = 0)
  go to 9999_EXIT
endif
 
/*** Gather Patient Phone #'s ***/
call echo("Loading patient phone numbers...")
select into "nl:"
from
  phone ph
plan ph
  where expand(idx,1,hold->cnt,ph.parent_entity_id,hold->qual[idx].person_id)
    and ph.parent_entity_name = "PERSON"
    and ph.phone_type_cd in (home_ph_type_cd, bus_ph_type_cd)
    and ph.phone_type_seq = 1
    and ph.active_ind = 1
    and ph.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
    and ph.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
detail
  pos = locateval(jdx,1,hold->cnt,ph.parent_entity_id,hold->qual[jdx].person_id)
  case (ph.phone_type_cd)
    of home_ph_type_cd:
      hold->qual[pos].home_phone = ph.phone_num
    of bus_ph_type_cd:
      hold->qual[pos].bus_phone = ph.phone_num
  endcase
with nocounter
 
/*** Gather Patient Addresses ***/
call echo("Loading patient addresses...")
select into "nl:"
from
  address a
plan a
  where expand(idx,1,hold->cnt,a.parent_entity_id,hold->qual[idx].person_id)
    and a.parent_entity_name = "PERSON"
    and a.address_type_cd = addr_type_cd
    and a.address_type_seq = 1
    and a.active_ind = 1
    and a.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
    and a.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
detail
  pos = locateval(jdx,1,hold->cnt,a.parent_entity_id,hold->qual[jdx].person_id)
  hold->qual[pos].addr.street_addr1 = a.street_addr
  hold->qual[pos].addr.street_addr2 = a.street_addr2
  hold->qual[pos].addr->city        = a.city
  hold->qual[pos].addr.zip          = a.zipcode
  hold->qual[pos].addr.state        = evaluate(a.state_cd,0.0,a.state,uar_get_code_display(a.state_cd))
  hold->qual[pos].addr.country		= evaluate(a.country_cd,0.0,a.country,uar_get_code_display(a.country_cd))
with nocounter
 
/*** Gather Next of Kin ***/
select into "nl:"
from
  person_person_reltn ppr
  , person p
  , phone ph
  , address a
plan ppr
  where expand(idx,1,hold->cnt,ppr.related_person_id,hold->qual[idx].person_id)
    and ppr.person_reltn_type_cd = next_of_kin
 	and ppr.active_ind = 1
 	and ppr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
 	and ppr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
join p
  where p.person_id = ppr.person_id
join ph
  where ph.parent_entity_id = outerjoin(p.person_id)
    and ph.parent_entity_name = outerjoin("PERSON")
    and ph.phone_type_cd = outerjoin(home_ph_type_cd)
    and ph.phone_type_seq = outerjoin(1)
    and ph.active_ind = outerjoin(1)
    and ph.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
    and ph.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
join a
  where a.parent_entity_id = outerjoin(p.person_id)
    and a.parent_entity_name = outerjoin("PERSON")
    and a.address_type_cd = outerjoin(addr_type_cd)
    and a.address_type_seq = outerjoin(1)
    and a.active_ind = outerjoin(1)
    and a.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
    and a.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
detail
  pos = locateval(jdx,1,hold->cnt,ppr.related_person_id,hold->qual[jdx].person_id)
  hold->qual[pos].nok.person_id		 	= ppr.person_id
  hold->qual[pos].nok.name_last			= p.name_last
  hold->qual[pos].nok.name_first		= p.name_first
  hold->qual[pos].nok.reltn_type_cd		= ppr.person_reltn_cd
  hold->qual[pos].nok.home_phone		= ph.phone_num
  hold->qual[pos].nok.street_addr1		= a.street_addr
  hold->qual[pos].nok.street_addr2		= a.street_addr2
  hold->qual[pos].nok.city				= a.city
  hold->qual[pos].nok.state				= evaluate(a.state_cd,0.0,a.state,uar_get_code_display(a.state_cd))
  hold->qual[pos].nok.zip				= a.zipcode
with nocounter
 
/*** Gather Guarantor Info here ***/
call echo("Loading person guarantor info...")
select into "nl:"
from
  encntr_person_reltn epr
  , person p
  , person_alias pa
  , person_org_reltn por
  , organization o ;EMPLOYER
  , phone ph2
  , phone ph
  , address a
plan epr
  where expand(idx,1,hold->cnt,epr.encntr_id,hold->qual[idx].encntr_id)
    and epr.person_reltn_type_cd = guar_type_cd
    and epr.active_ind = 1
    and epr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
    and epr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
join p
  where p.person_id = epr.related_person_id +0
join pa
  where pa.person_id = outerjoin(p.person_id)
    and pa.alias_pool_cd = outerjoin(guarnbr_pool_cd)
    and pa.active_ind = outerjoin(1)
    and pa.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
    and pa.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
join por
  where por.person_id = outerjoin(p.person_id)
    and por.person_org_reltn_cd = outerjoin(person_org_reltn_cd) ;EMPLOYER
    and por.active_ind = outerjoin(1)
    and por.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
    and por.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
join o
  where o.organization_id = por.organization_id
join ph2
  where ph2.parent_entity_id = outerjoin(por.organization_id)
    and ph2.parent_entity_name = outerjoin("ORGANIZATION")
    and ph2.phone_type_cd = outerjoin(bus_ph_type_cd)
    and ph2.active_ind = outerjoin(1)
    and ph2.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
    and ph2.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
join ph
  where ph.parent_entity_id = outerjoin(p.person_id)
    and ph.parent_entity_name = outerjoin("PERSON")
    and ph.phone_type_cd = outerjoin(home_ph_type_cd)
    and ph.phone_type_seq = outerjoin(1)
    and ph.active_ind = outerjoin(1)
    and ph.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
    and ph.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
join a where a.parent_entity_name = outerjoin("PERSON")
  and a.parent_entity_id = outerjoin(p.person_id)
  and a.address_type_cd = outerjoin(addr_type_cd)
  and a.address_type_seq = outerjoin(1)
  and a.active_ind = outerjoin(1)
  and a.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
  and a.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
order by
  epr.priority_seq
  , ph.phone_type_seq
  , a.address_type_seq
detail
  pos = locateval(jdx,1,hold->cnt,epr.encntr_id,hold->qual[jdx].encntr_id)
  hold->qual[pos].guar.person_id          = p.person_id
  hold->qual[pos].guar.organization_id    = 0
  hold->qual[pos].guar.alias              = pa.alias
  hold->qual[pos].guar.name_last          = p.name_last
  hold->qual[pos].guar.name_first		  = p.name_first
  hold->qual[pos].guar.reltn_type_cd	  = epr.related_person_reltn_cd
  hold->qual[pos].guar.home_phone		  = ph.phone_num
  hold->qual[pos].guar.employer			  = o.org_name
  hold->qual[pos].guar.emp_bus_phone	  = ph2.phone_num
  hold->qual[pos].guar.addr.street_addr1  = a.street_addr
  hold->qual[pos].guar.addr.street_addr2  = a.street_addr2
  hold->qual[pos].guar.addr.city          = a.city
  hold->qual[pos].guar.addr.state		  = evaluate(a.state_cd,0.0,a.state,uar_get_code_display(a.state_cd))
  hold->qual[pos].guar.addr.zip           = a.zipcode
with nocounter
 
/*001 BEGIN*/
call echo("Loading org guarantor info...")
select into "nl:"
from
  encntr_org_reltn eor
  , organization o
  , organization_alias oa
  , phone ph
  , address a
plan eor
  where expand(idx,1,hold->cnt,eor.encntr_id,hold->qual[idx].encntr_id)
    and eor.encntr_org_reltn_type_cd = eo_reltn_type_cd
    and eor.encntr_org_reltn_cd = eo_reltn_cd
    and eor.active_ind = 1
    and eor.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
    and eor.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
join o
  where o.organization_id = eor.organization_id
join oa
  where oa.organization_id = outerjoin(o.organization_id)
    and oa.alias_pool_cd = outerjoin(gtorg_alias_pool_cd)
    and oa.active_ind = outerjoin(1)
    and oa.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
    and oa.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
join ph
  where ph.parent_entity_id = outerjoin(o.organization_id)
    and ph.parent_entity_name = outerjoin("ORGANIZATION")
    and ph.phone_type_cd = outerjoin(bus_ph_type_cd)
    and ph.phone_type_seq = outerjoin(1)
    and ph.active_ind = outerjoin(1)
    and ph.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
    and ph.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
join a
  where a.parent_entity_name = outerjoin("ORGANIZATION")
    and a.parent_entity_id = outerjoin(o.organization_id)
    and a.address_type_cd = outerjoin(bus_addr_type_cd)
    and a.active_ind = outerjoin(1)
    and a.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
    and a.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
order by
  eor.priority_seq
  , ph.phone_type_seq
  , a.address_type_seq
  , a.updt_dt_tm desc
detail
  pos = locateval(jdx,1,hold->cnt,eor.encntr_id,hold->qual[jdx].encntr_id)
  hold->qual[pos].guar.person_id          = 0
  hold->qual[pos].guar.organization_id    = o.organization_id
  hold->qual[pos].guar.alias              = oa.alias
  hold->qual[pos].guar.name_last		  = o.org_name
  hold->qual[pos].guar.addr.street_addr1  = a.street_addr
  hold->qual[pos].guar.addr.street_addr2  = a.street_addr2
  hold->qual[pos].guar.addr.city          = a.city
  hold->qual[pos].guar.addr.state		  = evaluate(a.state_cd,0.0,a.state,uar_get_code_display(a.state_cd))
  hold->qual[pos].guar.addr.zip           = a.zipcode
with nocounter
 
/*** Gather Health Plan Insurance Info ***/
call echo("Loading health plan info...")
select into "nl:"
from
  encntr_plan_reltn epr
  , health_plan hp
  , organization o
  , phone ph
  , address a
  , organization_alias oa
  , encntr_benefit_r ebr
  , person_org_reltn por
  , organization o2 ;EMPLOYER
plan epr
  where expand(idx,1,hold->cnt,epr.encntr_id,hold->qual[idx].encntr_id)
    and epr.priority_seq in (1,2)
    and epr.active_ind = 1
    and epr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
    and epr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
join hp
  where hp.health_plan_id = epr.health_plan_id
join o
  where o.organization_id = epr.organization_id
join ph
  where ph.parent_entity_id = outerjoin(o.organization_id)
    and ph.parent_entity_name = outerjoin("ORGANIZATION")
    and ph.phone_type_cd = outerjoin(bus_ph_type_cd)
    and ph.phone_type_seq = outerjoin(1)
    and ph.active_ind = outerjoin(1)
    and ph.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
    and ph.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
join a
  where a.parent_entity_id = outerjoin(o.organization_id)
    and a.parent_entity_name = outerjoin("ORGANIZATION")
    and a.address_type_cd = outerjoin(bus_addr_type_cd)
    and a.address_type_seq = outerjoin(1)
    and a.active_ind = outerjoin(1)
    and a.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
    and a.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
join oa
  where oa.organization_id = outerjoin(o.organization_id)
    and oa.alias_pool_cd = outerjoin(org_alias_pool_cd)
    and oa.active_ind = outerjoin(1)
    and oa.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
    and oa.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
join ebr
  where ebr.encntr_plan_reltn_id = outerjoin(epr.encntr_plan_reltn_id)
    and ebr.active_ind = outerjoin(1)
    and ebr.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
    and ebr.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
join por
  where por.person_id = outerjoin(epr.person_id)
    and por.person_org_reltn_cd = outerjoin(person_org_reltn_cd) ;employer
    and por.active_ind = outerjoin(1)
    and por.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
    and por.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
join o2
  where o2.organization_id = por.organization_id
head report
  cnt = 0
  len = 0
detail
  pos = locateval(jdx,1,hold->cnt,epr.encntr_id,hold->qual[jdx].encntr_id)
  hold->qual[pos].health_plan[epr.priority_seq].organization_id = o.organization_id
  hold->qual[pos].health_plan[epr.priority_seq].org_alias       = oa.alias
  hold->qual[pos].health_plan[epr.priority_seq].org_name        = o.org_name
  hold->qual[pos].health_plan[epr.priority_seq].plan_name       = hp.plan_name
  hold->qual[pos].health_plan[epr.priority_seq].policy_nbr      = epr.subs_member_nbr
  hold->qual[pos].health_plan[epr.priority_seq].group_nbr		= epr.group_nbr
  hold->qual[pos].health_plan[epr.priority_seq].effective_dt_tm = epr.beg_effective_dt_tm
  hold->qual[pos].health_plan[epr.priority_seq].expire_dt_tm	= epr.end_effective_dt_tm
  hold->qual[pos].health_plan[epr.priority_seq].copay_amt       = ebr.copay_amt
 
  if (epr.priority_seq = 1)
    cnt = findstring(",",hold->qual[pos].health_plan[epr.priority_seq].org_alias)
    len = textlen(hold->qual[d.seq].health_plan[epr.priority_seq].org_alias)
    if (cnt > 0 and pos < len)
      hold->qual[pos].fin_class_alias = substring(cnt + 1,len - cnt,
                                                     hold->qual[pos].health_plan[epr.priority_seq].org_alias)
    endif
  endif
 
  hold->qual[pos].health_plan[epr.priority_seq].bus_phone		  = ph.phone_num
  hold->qual[pos].health_plan[epr.priority_seq].addr.street_addr1 = a.street_addr
  hold->qual[pos].health_plan[epr.priority_seq].addr.street_addr1 = a.street_addr2
  hold->qual[pos].health_plan[epr.priority_seq].addr.city		  = a.city
  hold->qual[pos].health_plan[epr.priority_seq].addr.state		  = evaluate(a.state_cd,0.0,a.state,uar_get_code_display(a.state_cd))
  hold->qual[pos].health_plan[epr.priority_seq].addr.zip		  = a.zipcode
with nocounter
 
/*** Loading Physicians ***/
call echo("Loading physicians from reg...")
select into "nl:"
from
  encntr_prsnl_reltn epr
  , prsnl pl
  , prsnl_alias pla
plan epr
  where expand(idx,1,hold->cnt,epr.encntr_id,hold->qual[idx].encntr_id)
    and epr.encntr_prsnl_r_cd in (referdoc1_reltn_cd,referdoc2_reltn_cd,attenddoc_reltn_cd,consultdoc_reltn_cd)
    and epr.active_ind = 1
    and epr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
    and epr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
join pl
  where pl.person_id = epr.prsnl_person_id
join pla
  where pla.person_id = outerjoin(pl.person_id)
    and pla.alias_pool_cd = outerjoin(prsnl_alias_pool_cd)
    and pla.active_ind = outerjoin(1)
    and pla.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
    and pla.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
order
  epr.priority_seq desc
  , epr.beg_effective_dt_tm
detail
  pos = locateval(jdx,1,hold->cnt,epr.encntr_id,hold->qual[idx].encntr_id)
  if (epr.encntr_prsnl_r_cd in (referdoc1_reltn_cd,referdoc2_reltn_cd))
    hold->qual[pos]->refer_md_id        = pl.person_id
    hold->qual[pos]->refer_md_alias     = pla.alias
    hold->qual[pos]->refer_md_name      = pl.name_full_formatted
  elseif (epr.encntr_prsnl_r_cd = attenddoc_reltn_cd)
    hold->qual[pos]->attend_md_id       = pl.person_id
    hold->qual[pos]->attend_md_alias    = pla.alias
    hold->qual[pos]->attend_md_name     = pl.name_full_formatted
  elseif (epr.encntr_prsnl_r_cd = consultdoc_reltn_cd)
    hold->qual[pos].consult_md_id		= pl.person_id
    hold->qual[pos].consult_md_alias	= pla.alias
    hold->qual[pos].consult_md_name		= pl.name_full_formatted
  endif
with nocounter
 
/*** Gather Ordering Physician ***/
call echo("Loading ordering physician...")
select into "nl:"
from
  sch_event_detail ed
  , prsnl pl
  , prsnl_alias pla
plan ed
  where expand(idx,1,hold->cnt,ed.sch_event_id,hold->qual[idx].sch_event_id)
    and ed.oe_field_meaning = "SCHORDPHYS"
    and ed.active_ind = 1
    and ed.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
    and ed.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
    and ed.version_dt_tm = cnvtdatetime("31-DEC-2100")
join pl
  where pl.person_id = ed.oe_field_value
join pla
  where pla.person_id = outerjoin(pl.person_id)
    and pla.alias_pool_cd = outerjoin(prsnl_alias_pool_cd)
    and pla.active_ind = outerjoin(1)
    and pla.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
    and pla.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
detail
  pos = locateval(jdx,1,hold->cnt,ed.sch_event_id,hold->qual[jdx].sch_event_id)
  hold->qual[pos]->order_md_id        = pl.person_id
  hold->qual[pos]->order_md_alias     = pla.alias
  hold->qual[pos]->order_md_name      = pl.name_full_formatted
with nocounter
 
/*** Gather Printers ***/
if (textlen(trim(printer_name,3)) = 0)
  call echo("Loading printers...")
  select into "nl:"
  from
    order_entry_fields oef
    , sch_event_detail ed
  plan oef
    where oef.description = "Printer"
      and oef.codeset = 100113
  join ed
    where expand(idx,1,hold->cnt,ed.sch_event_id,hold->qual[idx].sch_event_id)
      and ed.oe_field_id = oef.oe_field_id
      and ed.active_ind = 1
      and ed.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
      and ed.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
      and ed.version_dt_tm = cnvtdatetime("31-DEC-2100")
  order by
    ed.updt_dt_tm
  detail
    pos = locateval(jdx,1,hold->cnt,ed.sch_event_id,hold->qual[jdx].sch_event_id)
    hold->qual[pos]->printer_name     = ed.oe_field_display_value
  with nocounter
endif
 
#9999_EXIT
call echo("Done.")
 
if (print_attempt_ind = 0)
  call EchoOut(concat("NO OUTPUT SENT TO: ",print_queue_name))
endif
 
if (print_queue_name != "mine" or print_attempt_ind = 0)
  select into $OUTDEV
    line = substring(1,130,tmp_io->qual[d.seq]->line)
  from (dummyt d with seq=value(tmp_io->cnt))
  plan d
  detail
    col 0  line
    row +1
  with nocounter, format=variable, noformfeed, maxrow=1
endif
 
call echorecord(hold)
 
;*** Restore the OracleSystem variable to its normal definition pointing
;***   to instance 1.
if (curdomain = "MHPRD")
  free define oraclesystem
  set system=build(concat('v500/', pass, '@mhprd1'))
  define oraclesystem system
elseif (curdomain = "MHCRT")
    free define oraclesystem
    set system=build(concat('v500/', pass, '@mhcrt1'))
    define oraclesystem system
endif
 
subroutine EchoOut(echo_str)
  set tmp_io->cnt = tmp_io->cnt + 1
  set stat = alterlist(tmp_io->qual,tmp_io->cnt)
  set tmp_io->qual[tmp_io->cnt]->line = echo_str
  call echo(tmp_io->qual[tmp_io->cnt]->line)
end ;EchoOut
 
end
go
 
