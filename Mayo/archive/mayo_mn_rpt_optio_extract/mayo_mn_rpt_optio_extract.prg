  drop program mayo_mn_rpt_optio_extract:dba go
create program mayo_mn_rpt_optio_extract:dba
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
 
          Author:             MC4839
          Date Written:       07/30/2008
          Source file name:   mayo_mn_rpt_optio_extract.prg
          Object Name:        mayo_mn_rpt_optio_extract
          Request #:          n/a
 
          Product:            Custom
          Product Team:       Custom - CinC Custom Programming Services
          HNA Version:        V500
 
          Program purpose:    Custom optio extract
 
          Tables read:        Various
          Tables Updated:     None
          Executing From:     CCL
 
          Special Notes:
 
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
 *000 07/30/08 MC4839               Initial release                    *
 *001 01/13/09 MC4839               Add guarantor retrieval logic to   *
 *                                  handle the scenario when the       *
 *                                  guarantor is an org instead of a   *
 *                                  person (as with client billing)    *
 *002 01/13/09 MC4839               Change the logic for the financial *
 *                                  class alias to retrieve and parse  *
 *                                  the insurance alias instead.  The  *
 *                                  current format of the insurance    *
 *                                  alias is something like "12345,L". *
 *                                  They want us to parse that and send*
 *                                  just the "L" in the financial class*
 *                                  alias field.                       *
 *003 03/12/09 MC4839               Added attending physician          *
 *004 05/05/09 MC4839               Correct issue with missing phys    *
 *005 10/20/11 Rob Banks            Modify to use DB2                  *
 *006 03/21/13 Akcia-SE        Change mod 005 to lookup password in registry*
 ******************** End of Modification Log **************************/
 
prompt
	"Messages Output To:" = "MINE"   ;* Messages will be output to MINE.
	, "Appt Date" = "CURDATE"        ;* Please enter the appointment date.
	, "Facility" = "FSH"             ;* Please select the facility.
	, "MRN" = ""                     ;* Please enter the medical record number.
	, "FIN" = ""                     ;* Please enter the financial number.
	, "Appt Type" = 0.000000         ;* Please select the appointment type.
	, "Form Printer" = ""            ;* If no printer is selected, value of Printer accept format for each appointment will be use
	, "Print Queue Override" = ""    ;* Overrides the print queue and outputs raw data directly to specified destination.
 
with OUTDEV, APPTDATE, FACILITY, MRN, FIN, APPTTYPE, PRINTER, PRINTQUEUE
 
 
;006 comment out start
/*** START 005 ***/
;*********************************************************************
;*** If PROD / CERT then run as 2nd oracle instance to improve
;*** efficiency. Will auto Fail-over to Instance 1 if Instance 2 down.
;*********************************************************************
;IF(CURDOMAIN = "PROD")
;  FREE DEFINE oraclesystem
;  DEFINE oraclesystem 'v500_piread/v500piread@mhprbrpt'
;ELSEIF(CURDOMAIN = "MHPRD")
;  FREE DEFINE oraclesystem
;  DEFINE oraclesystem 'v500_piread/v500piread@mhprbrpt'
;ELSEIF(CURDOMAIN="MHCRT")
;  FREE DEFINE oraclesystem
;  DEFINE oraclesystem 'v500/java4t2@mhcrtrpt'
;ENDIF ;CURDOMAIN
 
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
/*** END 005 ***/
;comment out end 006
 
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
 
set trace nocost                        ; turn off cost displaying
set message noinformation               ; turn off info displaying
 
#MAIN
execute from 1000_INIT  to 1000_INIT_EXIT
execute from 2000_LOAD  to 2000_LOAD_EXIT
execute from 3000_WRITE to 3000_WRITE_EXIT
go to 9999_EXIT
 
 
#1000_INIT
free set tmp_io
record tmp_io
(
  1 cnt                   = i4
  1 qual[*]
    2 line                = vc
)
 
call echo("Initializing...")
 
declare start_date             = dq8 with protect, noconstant(cnvtdatetime("31-DEC-2100"))
declare end_date               = dq8 with protect, noconstant(cnvtdatetime("01-JAN-1800"))
declare fin_parm               = vc  with protect, noconstant(trim(cnvtstring(cnvtreal($FIN)),3))
declare mrn_parm               = vc  with protect, noconstant(trim(cnvtstring(cnvtreal($MRN)),3))
declare cmrn_parm			   = vc  with protect, noconstant("")		;JRG
declare l9mrn_parm		       = vc  with protect, noconstant("")		;JRG
declare encntr_id              = f8  with protect, noconstant(0.0)
declare person_id              = f8  with protect, noconstant(0.0)
declare fin_person_name        = vc  with protect, noconstant("")
declare printer_name           = vc  with protect, constant(trim(cnvtlower($PRINTER),3))
 
declare sch_event_id           = f8  with protect, noconstant(0.0)
declare contrib_src_cd         = f8  with protect, noconstant(0.0)
declare org_alias_pool_cd      = f8  with protect, noconstant(0.0)
declare gtorg_alias_pool_cd    = f8  with protect, noconstant(0.0)  /*001*/
declare prsnl_alias_pool_cd    = f8  with protect, noconstant(0.0)
declare print_queue_name       = vc  with protect, noconstant("")
declare facility               = vc  with protect, noconstant("")
declare print_attempt_ind      = i2  with protect, noconstant(0)
declare FIN_POOL_CD            = f8  with protect, noconstant(0.0)
declare MRN_POOL_CD            = f8  with protect, noconstant(0.0)
declare CMRN_POOL_CD		   = f8  with protect, constant(UAR_GET_CODE_BY("DISPLAYKEY",263,"CMRN"))				;JRG
declare L9MRN_POOL_CD          = f8  with protect, noconstant(UAR_GET_CODE_BY("DISPLAYKEY",263,"L9MRN"))			;JRG
;declare CMRN_POOL_CD           = f8  with protect, noconstant(0.0)	;JRG
;declare L9MRN_POOL_CD    	   = f8  with protect, noconstant(0.0)	;JRG
declare L1FIN_POOL_CD          = f8  with protect, constant(UAR_GET_CODE_BY("DISPLAYKEY",263,"L1FIN")) ;JRG
declare L2FIN_POOL_CD          = f8  with protect, constant(UAR_GET_CODE_BY("DISPLAYKEY",263,"L2FIN")) ;JRG
declare L9FIN_POOL_CD          = f8  with protect, constant(UAR_GET_CODE_BY("DISPLAYKEY",263,"L9FIN")) ;JRG
declare ENCNTR_MRN_ALIAS_TYPE_CD   = f8  with protect, constant(UAR_GET_CODE_BY("DISPLAYKEY",319,"MRN")) ;JRG
declare ENCNTR_FIN_ALIAS_TYPE_CD   = f8  with protect, constant(UAR_GET_CODE_BY("DISPLAYKEY",319,"FINNBR")) ;JRG
 
;set fin_parm="2441704" ;JRG FORCING FOR TESTING, DELETE LATER
;set mrn_parm="1009566" ;JRG FORCING FOR TESTING, DELETE LATER
 
if (validate(optio_request->sch_event_id))
  set sch_event_id = optio_request->sch_event_id
  set print_queue_name = optio_request->printer
  set facility = optio_request->facility
 
  SELECT INTO "nl:"
  FROM sch_appt a,  ;RESOURCE
    sch_appt a2  ;PATIENT
  PLAN a WHERE a.sch_event_id = sch_event_id
    AND a.role_meaning != "PATIENT"
    AND a.state_meaning IN ("CONFIRMED","CHECKED IN")  ;"CHECKED OUT","CANCELED","RESCHEDULED","NOSHOW","VOID","HOLD"
    AND a.primary_role_ind = 1
    AND a.version_dt_tm = cnvtdatetime("31-DEC-2100")
    AND a.active_ind = 1
    AND a.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
    AND a.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
  JOIN a2 WHERE a2.sch_event_id = a.sch_event_id +0
    AND a2.role_meaning = "PATIENT"
    AND a2.state_meaning IN ("CONFIRMED","CHECKED IN")  ;"CHECKED OUT","CANCELED","RESCHEDULED","NOSHOW","VOID","HOLD"
    AND a2.version_dt_tm = cnvtdatetime("31-DEC-2100")
    AND a2.active_ind = 1
    AND a2.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
    AND a2.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
  DETAIL
    start_date = LEAST(a.beg_dt_tm,a2.beg_dt_tm,start_date)
    end_date = GREATEST(a.beg_dt_tm,a2.beg_dt_tm,end_date)
  WITH nocounter
else
  set facility     = cnvtupper($FACILITY)
  set start_date   = cnvtdatetime(concat($APPTDATE," 00:00:00"))
  set end_date     = cnvtdatetime(concat($APPTDATE," 23:59:59"))
 
  SELECT INTO "nl:"
  FROM
	  sch_appt s
	  , person_alias p
	  , encounter e
	  , encntr_alias ea
  PLAN ea where ea.alias = fin_parm
  JOIN e where e.encntr_id = ea.encntr_id
  JOIN s where ea.encntr_id = s.encntr_id
    AND s.active_ind = 1
  JOIN p where p.person_id = e.person_id
  AND p.alias = mrn_parm
  DETAIL
    sch_event_id = s.sch_event_id
  WITH nocounter
 
endif
 
 
CALL ECHO(facility)
CALL ECHO(start_date)
CALL ECHO(end_date)
CALL ECHO(sch_event_id)
 
case (facility)
  of "FSH":
    ;Need to capture the fin_parm
; 	SELECT INTO "nl:"
;	FROM SCH_APPT   S
;	, ENCNTR_ALIAS   EA
;	PLAN S WHERE S.SCH_EVENT_ID = SCH_EVENT_ID
;	JOIN EA
;	WHERE EA.ENCNTR_ID = S.ENCNTR_ID
;	AND EA.ALIAS_POOL_CD IN (L1FIN_POOL_CD, L2FIN_POOL_CD, L9FIN_POOL_CD)
;	DETAIL
;	   FIN_PARM = EA.ALIAS
;	WITH NOCOUNTER
 
	/*JRG CAB 5895, need encounter specific fin and MRN*/
		select into "NL:"
  	 	FROM sch_appt s
  	 	, encntr_alias ea ;FIN
  		, encntr_alias ea2 ;MRN
  		, encounter e
  		PLAN s WHERE s.sch_event_id = sch_event_id
  		JOIN ea WHERE ea.encntr_id = s.encntr_id
  		  AND ea.encntr_alias_type_cd = ENCNTR_FIN_ALIAS_TYPE_CD
  		  AND ea.alias_pool_cd in (L1FIN_POOL_CD, L2FIN_POOL_CD, L9FIN_POOL_CD)
  		  AND ea.active_ind = 1
  		  AND ea.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
  		  AND ea.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
  		JOIN ea2 WHERE ea2.encntr_id=ea.encntr_id
		  AND ea2.encntr_alias_type_cd = ENCNTR_MRN_ALIAS_TYPE_CD
		  AND ea2.active_ind = 1
  		  AND ea2.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
  	      AND ea2.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
  		JOIN e WHERE e.encntr_id=ea.encntr_id
  		  AND e.active_ind = 1
  		  AND e.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
  		  AND e.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
  		DETAIL
  		  FIN_POOL_CD = ea.alias_pool_cd
  		  MRN_POOL_CD = ea2.alias_pool_cd
  		  ;FIN_PARM = ea.alias
  		WITH nocounter, time = 30
 	CALL ECHO(CONCAT(" FIN PARM--->",FIN_PARM))
 	call echo(concat(" ",build("ENCNTR_FIN_ALIAS_TYPE_CD--->",ENCNTR_FIN_ALIAS_TYPE_CD)))
 	call echo(concat(" ",build("L1FIN_POOL_CD--->",L1FIN_POOL_CD)))
 	call echo(concat(" ",build("L2FIN_POOL_CD--->",L2FIN_POOL_CD)))
 	call echo(concat(" ",build("L9FIN_POOL_CD--->",L9FIN_POOL_CD)))
 	call echo(concat(" ",build("ENCNTR_MRN_ALIAS_TYPE_CD--->",ENCNTR_MRN_ALIAS_TYPE_CD)))
 	call echo(concat(" ",build("FIN_POOL_CD--->",FIN_POOL_CD)))
 	call echo(concat(" ",build("MRN_POOL_CD--->",MRN_POOL_CD)))
 
    set contrib_src_cd         = UAR_GET_CODE_BY("DISPLAYKEY",73,"FSHHPPSRC")
    set org_alias_pool_cd      = UAR_GET_CODE_BY("DISPLAYKEY",263,"INSURANCECODELAHPP")
    set gtorg_alias_pool_cd    = UAR_GET_CODE_BY("DISPLAYKEY",263,"GUARANTORLA")
    set prsnl_alias_pool_cd    = UAR_GET_CODE_BY("DISPLAYKEY",263,"LALEGACY1")
 
    if (textlen(trim(print_queue_name,3)) = 0)
      set print_queue_name     = "optiocern"
    endif
  of "RCMC":
    set contrib_src_cd         = UAR_GET_CODE_BY("DISPLAYKEY",73,"RCMCHPPSRC")
    set org_alias_pool_cd      = UAR_GET_CODE_BY("DISPLAYKEY",263,"INSURANCECODEME")
    set gtorg_alias_pool_cd    = UAR_GET_CODE_BY("DISPLAYKEY",263,"GUARANTORME")
    set prsnl_alias_pool_cd    = UAR_GET_CODE_BY("DISPLAYKEY",263,"MELEGACY2")
    set FIN_POOL_CD            = UAR_GET_CODE_BY("DISPLAYKEY",263,"MEFIN")
    set MRN_POOL_CD            = UAR_GET_CODE_BY("DISPLAYKEY",263,"MEMRN")
    ;Since L9MRN pool cd is not used by RCMC, just making it duplicate of MEMRN to prevent issues below.
    set L9MRN_POOL_CD          = UAR_GET_CODE_BY("DISPLAYKEY",263,"MEMRN")
    if (textlen(trim(print_queue_name,3)) = 0)
      set print_queue_name     = "routeslipcerner"
    endif
endcase
 
if (textlen(trim($PRINTQUEUE,3)) > 0)
  set print_queue_name = trim(cnvtlower($PRINTQUEUE),3)
endif
 
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
    2 birth_dt_tm         = dq8
    2 sex_cd              = f8
    2 fin                 = vc
    2 mrn                 = vc
    2 cmrn				  = vc 	;JRG
    2 l9mrn				  = vc  ;JRG
    2 addr
      3 street_addr1      = vc
      3 street_addr2      = vc
      3 city              = vc
      3 state             = vc
      3 zip               = vc
    2 home_phone          = vc
    2 bus_phone           = vc
    2 guar
      3 person_id         = f8  /*001*/
      3 organization_id   = f8  /*001*/
      3 alias             = vc
      3 name_full         = vc
      3 addr
        4 street_addr1    = vc
        4 street_addr2    = vc
        4 city            = vc
        4 state           = vc
        4 zip             = vc
    2 fin_class_alias_db  = vc  /*002*/
    2 fin_class_alias     = vc
    2 fin_class_cd        = f8
    2 health_plan[2]
      3 organization_id   = f8
      3 org_alias         = vc
      3 org_name          = vc
      3 plan_name         = vc
      3 policy_nbr        = vc
      3 effective_dt_tm   = dq8
      3 copay_amt         = f8
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
/*003 BEGIN*/
    2 attend_md_id        = f8
    2 attend_md_alias     = vc
    2 attend_md_name      = vc
/*003 END*/
)
 
declare CURRENT_NAME_CD        = f8  with protect, constant(UAR_GET_CODE_BY("MEANING",213,"CURRENT"))
declare HOME_PH_TYPE_CD        = f8  with protect, constant(UAR_GET_CODE_BY("MEANING",43,"HOME"))
declare BUS_PH_TYPE_CD         = f8  with protect, constant(UAR_GET_CODE_BY("MEANING",43,"BUSINESS"))
declare ADDR_TYPE_CD           = f8  with protect, constant(UAR_GET_CODE_BY("MEANING",212,"HOME"))
declare BUS_ADDR_TYPE_CD       = f8  with protect, constant(UAR_GET_CODE_BY("MEANING",212,"BUSINESS"))  /*001*/
declare GUAR_TYPE_CD           = f8  with protect, constant(UAR_GET_CODE_BY("MEANING",351,"DEFGUAR"))
declare GUARNBR_POOL_CD        = f8  with protect, constant(UAR_GET_CODE_BY("DISPLAYKEY",263,"CUSTGUARNBR"))
declare REFERDOC1_RELTN_CD     = f8  with protect, constant(UAR_GET_CODE_BY("DISPLAYKEY",333,"REFERRINGPHYSICIAN"))
declare REFERDOC2_RELTN_CD     = f8  with protect, constant(UAR_GET_CODE_BY("DISPLAYKEY",333,"REFERRINGPHYSICIANHOSPITAL"))
declare ATTENDDOC_RELTN_CD     = f8  with protect, constant(UAR_GET_CODE_BY("MEANING",333,"ATTENDDOC"))  /*003*/
declare FIN_TYPE_CD            = f8  with protect, constant(UAR_GET_CODE_BY("MEANING",319,"FIN NBR"))
declare MRN_TYPE_CD            = f8  with protect, constant(UAR_GET_CODE_BY("MEANING",4,"MRN"))
declare EO_RELTN_CD            = f8  with protect, noconstant(UAR_GET_CODE_BY("MEANING",352,"GUARANTOR"))  /*001*/
declare EO_RELTN_TYPE_CD       = f8  with protect, noconstant(UAR_GET_CODE_BY("MEANING",362,"GUARANTOR"))  /*001*/
 
call echo(concat("     ",build("CURRENT_NAME_CD->",CURRENT_NAME_CD)))
call echo(concat("     ",build("HOME_PH_TYPE_CD->",HOME_PH_TYPE_CD)))
call echo(concat("     ",build("BUS_PH_TYPE_CD->",BUS_PH_TYPE_CD)))
call echo(concat("     ",build("ADDR_TYPE_CD->",ADDR_TYPE_CD)))
call echo(concat("     ",build("BUS_ADDR_TYPE_CD->",ADDR_TYPE_CD)))  /*001*/
call echo(concat("     ",build("FIN_POOL_CD->",FIN_POOL_CD)))
call echo(concat("     ",build("MRN_POOL_CD->",MRN_POOL_CD)))
call echo(concat("     ",build("CMRN_POOL_CD->",CMRN_POOL_CD))) ;JRG12
call echo(concat("     ",build("L9MRN_POOL_CD->",L9MRN_POOL_CD))) ;JRG12
call echo(concat("     ",build("FIN_TYPE_CD->",FIN_TYPE_CD)))
call echo(concat("     ",build("MRN_TYPE_CD->",MRN_TYPE_CD)))
call echo(concat("     ",build("GUAR_TYPE_CD->",GUAR_TYPE_CD)))
call echo(concat("     ",build("GUARNBR_POOL_CD->",GUARNBR_POOL_CD)))
call echo(concat("     ",build("REFERDOC1_RELTN_CD->",REFERDOC1_RELTN_CD)))
call echo(concat("     ",build("REFERDOC2_RELTN_CD->",REFERDOC2_RELTN_CD)))
call echo(concat("     ",build("EO_RELTN_CD->",EO_RELTN_CD)))  /*001*/
call echo(concat("     ",build("EO_RELTN_TYPE_CD->",EO_RELTN_TYPE_CD)))  /*001*/
call echo(concat("     ",build("contrib_src_cd->",contrib_src_cd)))
call echo(concat("     ",build("org_alias_pool_cd->",org_alias_pool_cd)))
call echo(concat("     ",build("gtorg_alias_pool_cd->",gtorg_alias_pool_cd)))  /*001*/
call echo(concat("     ",build("prsnl_alias_pool_cd->",prsnl_alias_pool_cd)))
 
declare FIN_POOL_DISP          = vc  with protect, constant(UAR_GET_CODE_DISPLAY(FIN_POOL_CD))
declare MRN_POOL_DISP          = vc  with protect, constant(UAR_GET_CODE_DISPLAY(MRN_POOL_CD))
declare tmp_str                = vc  with protect, noconstant("")
#1000_INIT_EXIT
 
 
#2000_LOAD
if (fin_parm > "0")
  call EchoOut("Loading data for FIN...")
  SELECT INTO "nl:"
  FROM encntr_alias ea,
    encounter e,
    person p
  PLAN ea WHERE ea.alias = fin_parm
    AND ea.alias_pool_cd = FIN_POOL_CD
    AND ea.encntr_alias_type_cd = FIN_TYPE_CD
    AND ea.active_ind = 1
    AND ea.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
    AND ea.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
  JOIN e WHERE e.encntr_id = ea.encntr_id +0
  JOIN p WHERE p.person_id = e.person_id +0
  DETAIL
    encntr_id = e.encntr_id
    person_id = e.person_id
    fin_person_name = trim(p.name_full_formatted,3)
 
    call EchoOut(concat("  FIN ",fin_parm," returns ",format(e.reg_dt_tm,"MM/DD/YYYY HH:MM;;D"),
                        " encounter for ",fin_person_name,"."))
  WITH nocounter
 
  if (curqual > 1)
    call EchoOut(concat("  ###ERROR: Multiple encounters found for ",FIN_POOL_DISP," ",fin_parm,"."))
    go to 9999_EXIT
  elseif (encntr_id = 0)
    call EchoOut(concat("  ###ERROR: No encounter found for ",FIN_POOL_DISP," ",fin_parm,"."))
    go to 9999_EXIT
  elseif (person_id = 0)
    call EchoOut(concat("  ###ERROR: No person associated to ",FIN_POOL_DISP," ",fin_parm,"."))
    go to 9999_EXIT
  endif
endif
 
if (mrn_parm > "0")
  call EchoOut("Loading data for MRN...")
  SELECT INTO "nl:"
  FROM person_alias pa,
    person p
  PLAN pa WHERE pa.alias = mrn_parm
    AND person_id IN (0,pa.person_id)
    AND pa.alias_pool_cd = MRN_POOL_CD
    AND pa.person_alias_type_cd = MRN_TYPE_CD
    AND pa.active_ind = 1
    AND pa.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
    AND pa.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
  JOIN p WHERE p.person_id = pa.person_id +0
  DETAIL
    call EchoOut(concat("  ",trim(p.name_full_formatted,3)," returned for ",MRN_POOL_DISP," ",mrn_parm,"."))
    call echo(p.person_id)
 
    person_id = p.person_id
  WITH nocounter
 
  if (curqual > 1)
    call EchoOut(concat("  ###ERROR: Multiple persons found for ",MRN_POOL_DISP," ",mrn_parm,"."))
    go to 9999_EXIT
  elseif (curqual = 0 and person_id > 0)
    call EchoOut(concat("  ###ERROR: ",fin_person_name," does not have an ",MRN_POOL_DISP," of ",mrn_parm,"."))
    go to 9999_EXIT
  elseif (person_id = 0)
    call EchoOut(concat("  ###ERROR: No person found for ",MRN_POOL_DISP," ",mrn_parm,"."))
    go to 9999_EXIT
  endif
endif
 
 
 
call EchoOut("Loading records...")
 
SELECT INTO "nl:"
FROM sch_appt a,  ;RESOURCE
  sch_appt a2,  ;PATIENT
  sch_event ev,
  encounter e,
  person p,
  person_alias pa,
  person_alias pa2, ;L9MRN JRG
  person_alias pa3, ;CMRN JRG
  encntr_alias ea,
  code_value_outbound cvo,
  code_value_outbound cvo2,
  code_value_outbound cvo3
PLAN a WHERE a.beg_dt_tm >= cnvtdatetime(start_date)
  AND a.beg_dt_tm <= cnvtdatetime(end_date)
  AND sch_event_id IN (0,a.sch_event_id)
  AND a.role_meaning != "PATIENT"
  AND a.state_meaning IN ("CONFIRMED","CHECKED IN")  ;"CHECKED OUT","CANCELED","RESCHEDULED","NOSHOW","VOID","HOLD"
  AND a.primary_role_ind = 1
  AND a.version_dt_tm = cnvtdatetime("31-DEC-2100")
  AND a.active_ind = 1
  AND a.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
  AND a.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
JOIN a2 WHERE a2.sch_event_id = a.sch_event_id
  AND a2.role_meaning = "PATIENT"
  AND encntr_id IN (0,a2.encntr_id)
  AND person_id IN (0,a2.person_id)
  AND a2.state_meaning IN ("CONFIRMED","CHECKED IN")  ;"CHECKED OUT","CANCELED","RESCHEDULED","NOSHOW","VOID","HOLD"
  AND a2.version_dt_tm = cnvtdatetime("31-DEC-2100")
  AND a2.active_ind = 1
  AND a2.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
  AND a2.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
JOIN ev WHERE ev.sch_event_id = a.sch_event_id
  AND $APPTTYPE IN (0,ev.appt_type_cd)
JOIN e WHERE e.encntr_id = a2.encntr_id
JOIN p WHERE p.person_id = a2.person_id
JOIN pa WHERE pa.person_id = p.person_id
  AND pa.alias_pool_cd = MRN_POOL_CD
  AND pa.active_ind = 1
  AND pa.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
  AND pa.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
JOIN pa2 WHERE pa2.person_id = p.person_id        					;JRG
  AND pa2.alias_pool_cd = L9MRN_POOL_CD												;JRG
  AND pa2.active_ind = 1																				;JRG
  AND pa2.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3) ;JRG
  AND pa2.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3) ;JRG
JOIN pa3 WHERE pa3.person_id = p.person_id        					;JRG
  AND pa3.alias_pool_cd = CMRN_POOL_CD												;JRG
  AND pa3.active_ind = 1																				;JRG
  AND pa3.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3) ;JRG
  AND pa3.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3) ;JRG
JOIN ea WHERE ea.encntr_id = outerjoin(e.encntr_id)
  AND ea.encntr_alias_type_cd = outerjoin(FIN_TYPE_CD)
  AND ea.active_ind = outerjoin(1)
  AND ea.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
  AND ea.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
JOIN cvo WHERE cvo.code_value = outerjoin(e.financial_class_cd)
  AND cvo.contributor_source_cd = outerjoin(contrib_src_cd)
JOIN cvo2 WHERE cvo2.code_value = outerjoin(a2.appt_location_cd)
  AND cvo2.contributor_source_cd = outerjoin(contrib_src_cd)
JOIN cvo3 WHERE cvo3.code_value = outerjoin(a.resource_cd)
  AND cvo3.contributor_source_cd = outerjoin(contrib_src_cd)
ORDER ev.sch_event_id
HEAD ev.sch_event_id
  hold->cnt = hold->cnt + 1
 
  if (mod(hold->cnt,100) = 1)
    stat = alterlist(hold->qual,hold->cnt+99)
  endif
 
  hold->qual[hold->cnt]->person_id              = p.person_id
  hold->qual[hold->cnt]->encntr_id              = e.encntr_id
  hold->qual[hold->cnt]->sch_event_id           = ev.sch_event_id
  hold->qual[hold->cnt]->name_last              = p.name_last
  hold->qual[hold->cnt]->name_first             = p.name_first
  hold->qual[hold->cnt]->name_middle            = p.name_middle
  hold->qual[hold->cnt]->birth_dt_tm            = p.birth_dt_tm
  hold->qual[hold->cnt]->sex_cd                 = p.sex_cd
  hold->qual[hold->cnt]->fin                    = ea.alias
  hold->qual[hold->cnt]->mrn                    = pa.alias
  hold->qual[hold->cnt]->l9mrn                  = pa2.alias				;JRG
  hold->qual[hold->cnt]->cmrn                   = pa3.alias				;JRG
  hold->qual[hold->cnt]->fin_class_alias_db     = cvo.alias  /*002*/
  hold->qual[hold->cnt]->fin_class_alias        = cvo.alias
  hold->qual[hold->cnt]->fin_class_cd           = e.financial_class_cd
  hold->qual[hold->cnt]->appt->beg_dt_tm        = a2.beg_dt_tm
  hold->qual[hold->cnt]->appt->appt_type_cd     = ev.appt_type_cd
  hold->qual[hold->cnt]->appt->resource_alias   = cvo3.alias
  hold->qual[hold->cnt]->appt->resource_cd      = a.resource_cd
  hold->qual[hold->cnt]->appt->appt_loc_alias   = cvo2.alias
  hold->qual[hold->cnt]->appt->appt_location_cd = a2.appt_location_cd
 
  if (textlen(printer_name) > 0)
    hold->qual[hold->cnt]->printer_name = printer_name
  endif
WITH nocounter
 
set stat = alterlist(hold->qual,hold->cnt)
call EchoOut(concat("  ",trim(cnvtstring(hold->cnt),3)," record(s) loaded."))
 
if (hold->cnt = 0)
  go to 9999_EXIT
endif
 
call echo("Loading patient phone numbers...")
SELECT INTO "nl:"
FROM (dummyt d with seq=value(hold->cnt)),
  phone ph
PLAN d
JOIN ph WHERE ph.parent_entity_name = "PERSON"
  AND ph.parent_entity_id = hold->qual[d.seq]->person_id
  AND ph.phone_type_cd IN (HOME_PH_TYPE_CD, BUS_PH_TYPE_CD)
  AND ph.phone_type_seq = 1
  AND ph.active_ind = 1
  AND ph.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
  AND ph.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
DETAIL
  case (ph.phone_type_cd)
    of HOME_PH_TYPE_CD:
      hold->qual[d.seq]->home_phone = ph.phone_num ;cnvtphone(ph.phone_num,ph.phone_format_cd)
    of BUS_PH_TYPE_CD:
      hold->qual[d.seq]->bus_phone  = ph.phone_num ;cnvtphone(ph.phone_num,ph.phone_format_cd)
  endcase
WITH nocounter
 
call echo("Loading patient addresses...")
SELECT INTO "nl:"
FROM (dummyt d with seq=value(hold->cnt)),
  address a
PLAN d
JOIN a WHERE a.parent_entity_name = "PERSON"
  AND a.parent_entity_id = hold->qual[d.seq]->person_id
  AND a.address_type_cd = ADDR_TYPE_CD
  AND a.address_type_seq = 1
  AND a.active_ind = 1
  AND a.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
  AND a.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
DETAIL
  hold->qual[d.seq]->addr->street_addr1 = a.street_addr
  hold->qual[d.seq]->addr->street_addr2 = a.street_addr2
  hold->qual[d.seq]->addr->city         = a.city
  hold->qual[d.seq]->addr->zip          = a.zipcode
 
  if (a.state_cd > 0)
    hold->qual[d.seq]->addr->state      = UAR_GET_CODE_DISPLAY(a.state_cd)
  else
    hold->qual[d.seq]->addr->state      = a.state
  endif
 
 
 call echo(CONCAT("JRG PRINT QUEUE NAME ",print_queue_name)) ;JRG
 
 
;could have done this instead
;  hold->qual[d.seq]->addr->state        = EVALUATE(a.state_cd,0.0,a.state,UAR_GET_CODE_DISPLAY(a.state_cd))
 
WITH nocounter
 
call echo("Loading person guarantor info...")
SELECT INTO "nl:"
FROM (dummyt d with seq=value(hold->cnt)),
  encntr_person_reltn epr,
  person p,
  person_alias pa,
  address a
PLAN d
JOIN epr WHERE epr.encntr_id = hold->qual[d.seq]->encntr_id
  AND epr.person_reltn_type_cd = GUAR_TYPE_CD
  AND epr.active_ind = 1
  AND epr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
  AND epr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
JOIN p WHERE p.person_id = epr.related_person_id +0
JOIN pa WHERE pa.person_id = outerjoin(p.person_id)
  AND pa.alias_pool_cd = outerjoin(GUARNBR_POOL_CD)
  AND pa.active_ind = outerjoin(1)
  AND pa.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
  AND pa.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
JOIN a WHERE a.parent_entity_name = outerjoin("PERSON")
  AND a.parent_entity_id = outerjoin(p.person_id)
  AND a.address_type_cd = outerjoin(ADDR_TYPE_CD)
  AND a.address_type_seq = outerjoin(1)
  AND a.active_ind = outerjoin(1)
  AND a.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
  AND a.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
ORDER BY d.seq, epr.priority_seq, a.address_type_seq
HEAD d.seq
  hold->qual[d.seq]->guar->person_id          = p.person_id  /*001*/
  hold->qual[d.seq]->guar->organization_id    = 0  /*001*/
  hold->qual[d.seq]->guar->alias              = pa.alias
  hold->qual[d.seq]->guar->name_full          = p.name_full_formatted
 
  hold->qual[d.seq]->guar->addr->street_addr1 = a.street_addr
  hold->qual[d.seq]->guar->addr->street_addr2 = a.street_addr2
  hold->qual[d.seq]->guar->addr->city         = a.city
  hold->qual[d.seq]->guar->addr->zip          = a.zipcode
 
  if (a.state_cd > 0)
    hold->qual[d.seq]->guar->addr->state      = UAR_GET_CODE_DISPLAY(a.state_cd)
  else
    hold->qual[d.seq]->guar->addr->state      = a.state
  endif
 
;could have done this instead
;  hold->qual[d.seq]->guar->addr->state        = EVALUATE(a.state_cd,0.0,a.state,UAR_GET_CODE_DISPLAY(a.state_cd))
WITH nocounter
 
/*001 BEGIN*/
call echo("Loading org guarantor info...")
SELECT INTO "nl:"
FROM (dummyt d with seq=value(hold->cnt)),
  encntr_org_reltn eor,
  organization o,
  organization_alias oa,
  address a
PLAN d
JOIN eor WHERE eor.encntr_id = hold->qual[d.seq]->encntr_id
  AND eor.encntr_org_reltn_type_cd = EO_RELTN_TYPE_CD
  AND eor.encntr_org_reltn_cd = EO_RELTN_CD
  AND eor.active_ind = 1
  AND eor.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
  AND eor.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
JOIN o WHERE o.organization_id = eor.organization_id
JOIN oa WHERE oa.organization_id = outerjoin(o.organization_id)
  AND oa.alias_pool_cd = outerjoin(gtorg_alias_pool_cd)
  AND oa.active_ind = outerjoin(1)
  AND oa.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
  AND oa.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
JOIN a WHERE a.parent_entity_name = outerjoin("ORGANIZATION")
  AND a.parent_entity_id = outerjoin(o.organization_id)
  AND a.address_type_cd = outerjoin(BUS_ADDR_TYPE_CD)
  AND a.active_ind = outerjoin(1)
  AND a.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
  AND a.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
ORDER BY d.seq, eor.priority_seq, a.address_type_seq, a.updt_dt_tm DESC
HEAD d.seq
  hold->qual[d.seq]->guar->person_id          = 0
  hold->qual[d.seq]->guar->organization_id    = o.organization_id
  hold->qual[d.seq]->guar->alias              = oa.alias
  hold->qual[d.seq]->guar->name_full          = o.org_name
 
  hold->qual[d.seq]->guar->addr->street_addr1 = a.street_addr
  hold->qual[d.seq]->guar->addr->street_addr2 = a.street_addr2
  hold->qual[d.seq]->guar->addr->city         = a.city
  hold->qual[d.seq]->guar->addr->zip          = a.zipcode
 
  if (a.state_cd > 0)
    hold->qual[d.seq]->guar->addr->state      = UAR_GET_CODE_DISPLAY(a.state_cd)
  else
    hold->qual[d.seq]->guar->addr->state      = a.state
  endif
WITH nocounter
/*001 END*/
 
call echo("Loading health plan info...")
SELECT INTO "nl:"
FROM (dummyt d with seq=value(hold->cnt)),
  encntr_plan_reltn epr,
  health_plan hp,
  organization o,
  organization_alias oa,
  encntr_benefit_r ebr
PLAN d
JOIN epr WHERE epr.encntr_id = hold->qual[d.seq]->encntr_id
  AND epr.priority_seq IN (1,2)
  AND epr.active_ind = 1
  AND epr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
  AND epr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
JOIN hp WHERE hp.health_plan_id = epr.health_plan_id
JOIN o WHERE o.organization_id = epr.organization_id
JOIN oa WHERE oa.organization_id = outerjoin(o.organization_id)
  AND oa.alias_pool_cd = outerjoin(org_alias_pool_cd)
  AND oa.active_ind = outerjoin(1)
  AND oa.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
  AND oa.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
JOIN ebr WHERE ebr.encntr_plan_reltn_id = outerjoin(epr.encntr_plan_reltn_id)
  AND ebr.active_ind = outerjoin(1)
  AND ebr.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
  AND ebr.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
/*002 BEGIN*/
HEAD report
  pos = 0
  len = 0
/*002 END*/
DETAIL
  hold->qual[d.seq]->health_plan[epr.priority_seq]->organization_id = o.organization_id
  hold->qual[d.seq]->health_plan[epr.priority_seq]->org_alias       = oa.alias
  hold->qual[d.seq]->health_plan[epr.priority_seq]->org_name        = o.org_name
  hold->qual[d.seq]->health_plan[epr.priority_seq]->plan_name       = hp.plan_name
  hold->qual[d.seq]->health_plan[epr.priority_seq]->policy_nbr      = epr.subs_member_nbr
  hold->qual[d.seq]->health_plan[epr.priority_seq]->effective_dt_tm = epr.beg_effective_dt_tm
  hold->qual[d.seq]->health_plan[epr.priority_seq]->copay_amt       = ebr.copay_amt
 
/*002 BEGIN*/
  if (epr.priority_seq = 1)
    pos = findstring(",",hold->qual[d.seq]->health_plan[epr.priority_seq]->org_alias)
    len = textlen(hold->qual[d.seq]->health_plan[epr.priority_seq]->org_alias)
    if (pos > 0 and pos < len)
      hold->qual[d.seq]->fin_class_alias = substring(pos + 1,len - pos,
                                                     hold->qual[d.seq]->health_plan[epr.priority_seq]->org_alias)
    endif
  endif
/*002 END*/
WITH nocounter
 
;003 call echo("Loading referring physician...")
call echo("Loading physicians from reg...")  /*003*/
SELECT INTO "nl:"
FROM (dummyt d with seq=value(hold->cnt)),
  encntr_prsnl_reltn epr,
  prsnl pl,
  prsnl_alias pla
PLAN d
JOIN epr WHERE epr.encntr_id = hold->qual[d.seq]->encntr_id
;003   AND epr.encntr_prsnl_r_cd IN (REFERDOC1_RELTN_CD,REFERDOC2_RELTN_CD)
  AND epr.encntr_prsnl_r_cd IN (REFERDOC1_RELTN_CD,REFERDOC2_RELTN_CD,ATTENDDOC_RELTN_CD)  /*003*/
  AND epr.active_ind = 1
  AND epr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
  AND epr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
JOIN pl WHERE pl.person_id = epr.prsnl_person_id
JOIN pla WHERE pla.person_id = outerjoin(pl.person_id)
  AND pla.alias_pool_cd = outerjoin(prsnl_alias_pool_cd)
  AND pla.active_ind = outerjoin(1)
  AND pla.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
  AND pla.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
;004 ORDER d.seq, epr.priority_seq, epr.beg_effective_dt_tm
;004 HEAD d.seq
ORDER d.seq, epr.priority_seq DESC, epr.beg_effective_dt_tm  /*004*/
DETAIL  /*004*/
  if (epr.encntr_prsnl_r_cd IN (REFERDOC1_RELTN_CD, REFERDOC2_RELTN_CD))  /*003*/
    hold->qual[d.seq]->refer_md_id        = pl.person_id
    hold->qual[d.seq]->refer_md_alias     = pla.alias
    hold->qual[d.seq]->refer_md_name      = pl.name_full_formatted
/*003 BEGIN*/
  elseif (epr.encntr_prsnl_r_cd = ATTENDDOC_RELTN_CD)
    hold->qual[d.seq]->attend_md_id       = pl.person_id
    hold->qual[d.seq]->attend_md_alias    = pla.alias
    hold->qual[d.seq]->attend_md_name     = pl.name_full_formatted
  endif
/*003 END*/
WITH nocounter
 
 
call echo("Loading ordering physician...")
SELECT INTO "nl:"
FROM (dummyt d with seq=value(hold->cnt)),
  sch_event_detail ed,
  prsnl pl,
  prsnl_alias pla
PLAN d
JOIN ed WHERE ed.sch_event_id = hold->qual[d.seq]->sch_event_id
  AND ed.oe_field_meaning = "SCHORDPHYS"
  AND ed.active_ind = 1
  AND ed.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
  AND ed.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
  AND ed.version_dt_tm = cnvtdatetime("31-DEC-2100")
JOIN pl WHERE pl.person_id = ed.oe_field_value
JOIN pla WHERE pla.person_id = outerjoin(pl.person_id)
  AND pla.alias_pool_cd = outerjoin(prsnl_alias_pool_cd)
  AND pla.active_ind = outerjoin(1)
  AND pla.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
  AND pla.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
DETAIL
  hold->qual[d.seq]->order_md_id        = pl.person_id
  hold->qual[d.seq]->order_md_alias     = pla.alias
  hold->qual[d.seq]->order_md_name      = pl.name_full_formatted
WITH nocounter
 
if (textlen(trim(printer_name,3)) = 0)
  call echo("Loading printers...")
  SELECT INTO "nl:"
  FROM (dummyt d with seq=value(hold->cnt)),
    order_entry_fields oef,
    sch_event_detail ed
  PLAN d
  JOIN oef WHERE oef.description = "Printer"
    AND oef.codeset = 100113
  JOIN ed WHERE ed.sch_event_id = hold->qual[d.seq]->sch_event_id
    AND ed.oe_field_id = oef.oe_field_id
    AND ed.active_ind = 1
    AND ed.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
    AND ed.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
    AND ed.version_dt_tm = cnvtdatetime("31-DEC-2100")
  ORDER BY d.seq, ed.updt_dt_tm
  DETAIL
    hold->qual[d.seq]->printer_name       = ed.oe_field_display_value
  WITH nocounter
endif
#2000_LOAD_EXIT
 
 
#3000_WRITE
call EchoOut("Sending output to form print queue...")
set print_attempt_ind = 1
 
call echo(print_queue_name)
 
if (print_queue_name = "mine")
  call EchoOut("  MINE...")
  SELECT INTO $OUTDEV
%i ccluserdir:mayo_mn_optio_extract_output.inc ;JRG12 may want to change back from ccluserdir to cclsource:
  WITH nocounter, format=variable, noformfeed, maxrow=1
 
elseif (print_queue_name = "optiocern" or print_queue_name = "routeslipcerner");optiocern and routeslipcerner for prod
  call EchoOut("  dummy queue...")
  declare print_file_name = vc with protect, noconstant("")
  set print_file_name = build("optio_",format(cnvtdatetime(curdate,curtime3),"DDHHMMSSCC;;D"),"_",
                              cnvtstring(rand(0)),".txt")
 
  SELECT INTO value(print_file_name)
%i ccluserdir:mayo_mn_optio_extract_output.inc ;JRG12 may want to change back from ccluserdir to cclsource:
  WITH nocounter, format=variable, noformfeed, maxrow=1
 
  declare cmd = vc with protect, noconstant("")
  declare status = i4 with protect, noconstant(0)
 
  ;REFERENCE OF lpr OPTIONS USED BELOW
  ;  -r      = remove file after print
  ;  -h      = suppress header page
  ;  -w132   = define page width at 132 cols
  ;  -P      = print queue
  set cmd = concat("lpr -r -h -w132 -P ",value(print_queue_name)," ",value(print_file_name))
  call echo(cmd)
  set stat = dcl(cmd,textlen(cmd),status)
else
  call EchoOut("  print_queue_name...")
  SELECT INTO value(print_queue_name)
%i ccluserdir:mayo_mn_optio_extract_output.inc ;JRG12 may want to change back from ccluserdir to cclsource:
  WITH nocounter, format=variable, noformfeed, maxrow=1
endif
 
if (curqual > 0)
  call EchoOut(concat("OUTPUT SUCCESSFULLY SENT TO: ",print_queue_name))
else
  call EchoOut(concat("UNABLE TO SEND OUTPUT TO: ",print_queue_name))
endif
#3000_WRITE_EXIT
 
 
SUBROUTINE EchoOut(echo_str)
  set tmp_io->cnt = tmp_io->cnt + 1
  set stat = alterlist(tmp_io->qual,tmp_io->cnt)
  set tmp_io->qual[tmp_io->cnt]->line = echo_str;concat(echo_str, "  ", Format(cnvtdatetime(curdate, curtime3),
                                                ;                                "MM/DD/YYYY HH:MM:SS;;D"))
  call echo(tmp_io->qual[tmp_io->cnt]->line)
END ;EchoOut
 
 
#9999_EXIT
call echo("Done.")
 
if (print_attempt_ind = 0)
  call EchoOut(concat("NO OUTPUT SENT TO: ",print_queue_name))
endif
 
if (print_queue_name != "mine" or print_attempt_ind = 0)
  SELECT INTO $OUTDEV
    line = substring(1,130,tmp_io->qual[d.seq]->line)
  FROM (dummyt d with seq=value(tmp_io->cnt))
  PLAN d
  DETAIL
    col 0  line
    row +1
  WITH nocounter, format=variable, noformfeed, maxrow=1
endif
 
call echorecord(hold)
 
;006 comment out start
/*** START 005 ***/
;*** After report put back to instance 1
;IF(CURDOMAIN = "PROD")
;  FREE DEFINE oraclesystem
;  DEFINE oraclesystem 'v500_piread/v500piread@mhprb1'
;ELSEIF(CURDOMAIN = "MHPRD")
;  FREE DEFINE oraclesystem
;  DEFINE oraclesystem 'v500_piread/v500piread@mhprb1'
;ELSEIF(CURDOMAIN="MHCRT")
;  FREE DEFINE oraclesystem
;  DEFINE oraclesystem 'v500/java4t2@mhcrt1'
;ENDIF ;CURDOMAIN
/*** END 005 ***/
;006 comment out end
 
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
 
end
go
