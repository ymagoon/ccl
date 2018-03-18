/*******************************************************************
Report Name:  Luther Downtime Lab
Report Description: This report is used for lab downtimes and
					displays patients that have open lab orders.
					This report is ftp'ed to a PC in the lab.
 
Created by:  Eric Hendrickson
Created date:  11/2005
 
Modified by:  Mary Wiersgalla
Modified date:  09/2009
Modifications:  Converted to PDF.  Added provider name/alias.
	Added order alias.
 
Mod001 by:		Rob Banks
Modified date:	10/25/2011
Modifications:	Modify to use DB2
 
Modified by:	Phil Landry Akcia
Modified date:	2/27/2013
Modifications:	Change mod for DB2 to lookup password in registry
Mod number:     003
 
*******************************************************************/
drop program 1_lm_downtime_lab_lh:dba go
create program 1_lm_downtime_lab_lh:dba
 
prompt  "Output to File/Printer/MINE" = "MINE"
 with  outdev
 
;;;/*** START 001 ***/
;;;;*********************************************************************
;;;;*** If PROD / CERT then run as 2nd oracle instance to improve
;;;;*** efficiency. Will auto Fail-over to Instance 1 if Instance 2 down.
;;;;*********************************************************************
;;;IF(CURDOMAIN = "PROD")
;;;  FREE DEFINE oraclesystem
;;;  DEFINE oraclesystem 'v500/fullmoon@mhprbrpt'
;;;ELSEIF(CURDOMAIN = "MHPRD")
;;;  FREE DEFINE oraclesystem
;;;  DEFINE oraclesystem 'v500/fullmoon@mhprbrpt'
;;;ELSEIF(CURDOMAIN="MHCRT")
;;;  FREE DEFINE oraclesystem
;;;  DEFINE oraclesystem 'v500/java4t2@mhcrtrpt'
;;;ENDIF ;CURDOMAIN
;;;;*** Write instance ccl ran in to the log file
;;;;SET Iname = fillstring(10," ")
;;;;SELECT INTO value("mayo_logfiles:mayo_instance2.log")
;;;;  run_date = format(sysdate,";;q")
;;;; ,Iname = substring(1,7,instance_name)
;;;;FROM v$instance
;;;;DETAIL
;;;;  col  1 run_date
;;;;  col +1 curprog
;;;;  col +1 " *Instance="
;;;;  col +1 Iname
;;;;with nocounter
;;;;   , format
;;;;****************** End of INSTANCE 2 routine ************************
;;;/*** END 001 ***/
 
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
 
;declare mrn_var = f8
declare fin_var = f8
declare canceled_var = f8
declare deleted_var = f8
declare discontinued_var = f8
declare completed_var = f8
 
set fin_var = uar_get_code_by("display", 263, "FIN")
;set mrn_var = uar_get_code_by("meaning", 4, "MRN")
set canceled_var = uar_get_code_by("meaning", 6004, "CANCELED")
set deleted_var = uar_get_code_by("meaning", 6004, "DELETED")
set discontinued_var = uar_get_code_by("meaning", 6004, "DISCONTINUED")
set completed_var = uar_get_code_by("meaning", 6004, "COMPLETED")
 
set maxsecs = 360
 
select distinct into $outdev
 	p.name_full_formatted,
 	p1.name_full_formatted,
 	o_catalog_cdf = uar_get_code_meaning( o.catalog_cd ),
 	o.catalog_cd,
 	o_catalog_disp = uar_get_code_display( o.catalog_cd ),
 	order_id = cnvtint(o.order_id),
 	o.orig_order_dt_tm,
 	p.birth_dt_tm,
 	o.current_start_dt_tm,
  	od.oe_field_display_value,
 	pal.alias,
 	pal.alias_pool_cd,
 	o.order_mnemonic,
 	ea.alias,
 	e_encntr_type_disp = uar_get_code_description( e.encntr_type_cd ),
	o_order_status_disp = uar_get_code_display( o.order_status_cd ),
	e_loc_room_disp = uar_get_code_display (e.loc_room_cd),
	e_loc_nurse_unit_disp = uar_get_code_display(e.loc_nurse_unit_cd),
	cva.alias
 
from
 	orders  o,
 	person  p,
 	prsnl  p1,
 	encounter  e,
 	person_alias pa,
 	encntr_alias  ea,
 	order_detail  od,
 	prsnl_alias pal,
 	code_value_outbound cva,
 	encntr_domain ed
 
;plan e
;where (e.encntr_status_cd!= 856.00)
;and e.encntr_type_cd != 3990509	;dialysis
;and e.loc_facility_cd+0 =
;  	value(633867,3186521)  				;eu luther hospital & bh
 
plan ed
 where ed.end_effective_dt_tm = cnvtdatetime("31-DEC-2100 00:00")
 and ed.loc_facility_cd in(633867,3186521)  ;eu luther hospital & bh
 and ed.active_ind+0 = 1
join e
 where e.encntr_id = ed.encntr_id
 and   e.encntr_status_cd+0 != 856.00
 and   e.encntr_type_cd+0 != 3990509
 
join ea
where ea.encntr_id = e.encntr_id
  and ea.alias_pool_cd = fin_var
 
join o
 where o.encntr_id = e.encntr_id
 and o.current_start_dt_tm between cnvtdatetime(curdate-90,curtime3) and cnvtdatetime(curdate+2,curtime3)
 and o.order_status_cd not in ( canceled_var, deleted_var, discontinued_var, completed_var )
 
join od
where od.order_id = o.order_id
  and od.oe_field_meaning="COLLPRI"  ;collection priority
 
join p
 where p.person_id = o.person_id
 and p.name_last_key != "TESTPATIENT"
 and p.name_last_key != "TEST"
 
join pa
where pa.person_id = p.person_id
  ;and pa.person_alias_type_cd = mrn_var
   and pa.alias_pool_cd = 3844508.00	;LH MRN
  and pa.active_ind = 1
 
join cva
where cva.code_value = o.catalog_cd
and cva.contributor_source_cd =     3458509.00
 
join p1
where o.last_update_provider_id = p1.person_id
 
join pal
where outerjoin(p1.person_id) = pal.person_id
  ; 4530509 = cycare #
  and pal.alias_pool_cd = outerjoin(4530509)
  and pal.active_ind = outerjoin(1)
 
 
order by
e_loc_nurse_unit_disp,
e_loc_room_disp,
p.name_full_formatted,
o.current_start_dt_tm,
order_id
 
head report
	m_numlines = 0
%i cclsource:vccl_diortf.inc
	y_pos = 18
subroutine offset( yval )
	call print( format( y_pos + yval, "###" ))
end
	count = 0
 
head page
		if (curpage > 1)  y_pos = 10 endif
	"{f/0}{cpi/14}"
	count = count + 1
	row + 1, "{f/9}{cpi/9}"
	call print(calcpos(250,y_pos+7)) "Luther Hospital"
	call print(calcpos(240,y_pos+21)) "Current Lab Orders"
	row + 1
	row + 1, "{f/9}{cpi/11}"
	call print(calcpos(280,y_pos+35)) curdate
	;row + 1
	row + 1, "{f/0}{cpi/15}"
	row + 1,
 
 
	row + 1
	y_pos = y_pos + 51
 
head p.name_full_formatted
	;if (( y_pos + 146) >= 792 ) y_pos = 0,  break endif
	if (( y_pos + 190) >= 792 ) y_pos = 0,  break endif
	row + 1, "{f/1}{cpi/14}"
	call print(calcpos(36,y_pos+11)) "Patient Location"
	;call print(calcpos(136,y_pos+11)) "Room"
	call print(calcpos(180,y_pos+11)) "Patient Name"
	call print(calcpos(350,y_pos+11)) "Birth Date"
	call print(calcpos(425,y_pos+11)) "LH MRN"
	call print(calcpos(500,y_pos+11)) "FIN"
	row + 1
	name_full_formatted1 = substring( 1, 30, p.name_full_formatted ),
	alias1 = substring( 1, 10, pa.alias ),
	aliasfin = substring( 1, 15, ea.alias ),
	encntr_type = substring( 1, 15, e_encntr_type_disp ),
	row + 1, "{f/0}"
	call print(calcpos(36,y_pos+20)) e_loc_nurse_unit_disp
	call print(calcpos(36,y_pos+30)) e_loc_room_disp
	call print(calcpos(180,y_pos+20)) name_full_formatted1
	call print(calcpos(350,y_pos+20)) p.birth_dt_tm
	call print(calcpos(425,y_pos+20)) alias1
	call print(calcpos(500,y_pos+20)) aliasfin
	call print(calcpos(500,y_pos+30)) encntr_type
	/*call print(calcpos(36,y_pos+11)) "nurse unit"
	call print(calcpos(75,y_pos+11)) "room"
	call print(calcpos(100,y_pos+11)) "name"
	call print(calcpos(216,y_pos+11)) "birth date"
	call print(calcpos(300,y_pos+11)) "mrn"
	call print(calcpos(360,y_pos+11)) "fin"
	row + 1
	name_full_formatted1 = substring( 1, 30, p.name_full_formatted ),
	alias1 = substring( 1, 10, pa.alias ),
	aliasfin = substring( 1, 15, ea.alias ),
	row + 1, "{f/0}"
	call print(calcpos(36,y_pos+20)) e_loc_nurse_unit_disp
	call print(calcpos(75,y_pos+20)) e_loc_room_disp
	call print(calcpos(100,y_pos+20)) name_full_formatted1
	call print(calcpos(216,y_pos+20)) p.birth_dt_tm
	call print(calcpos(300,y_pos+20)) alias1
	call print(calcpos(360,y_pos+20)) aliasfin*/
	row + 1
	row + 1, "{f/1}"
	call print(calcpos(36,y_pos+47)) "Priority"
	call print(calcpos(90,y_pos+47)) "Date"
	call print(calcpos(145,y_pos+47)) "Order ID"
	call print(calcpos(220,y_pos+47)) "Order Alias"
	call print(calcpos(300,y_pos+47)) "Order Status"
	call print(calcpos(390,y_pos+47)) "Provider"
	row + 1
	y_pos = y_pos + 59
 
detail
	if (( y_pos + 133) >= 792 ) y_pos = 0,  break endif
	oe_field_display_value1 = substring( 1, 5, od.oe_field_display_value ),
	alias_dt_tm = format(o.current_start_dt_tm,';;Q')
	alias2 = substring( 1, 6, pal.alias ),
	;alias2 = trim(pal.alias)
	provider = trim(p1.name_full_formatted)
	provider_name_alias = concat(alias2, provider)
	order_alias = substring(1,25, cva.alias)
	row + 1, "{f/0}{cpi/14}"
	call print(calcpos(36,y_pos+5)) oe_field_display_value1
	call print(calcpos(90,y_pos+5)) o.current_start_dt_tm
	call print(calcpos(135,y_pos+5)) order_id
	call print(calcpos(220,y_pos+5)) order_alias
	call print(calcpos(300,y_pos+5)) o_order_status_disp
	call print(calcpos(390,y_pos+5)) provider_name_alias
	;row + 1
	;call print(calcpos(72,y_pos+14)) "Encounter Type:"
	;call print(calcpos(160,y_pos+14)) e_encntr_type_disp
	;row + 1
	;call print(calcpos(72,y_pos+24)) "Start Date/Time:"
	;call print(calcpos(160,y_pos+24)) alias_dt_tm
	;row + 1
	;call print(calcpos(72,y_pos+33)) "Status:"
	;call print(calcpos(160,y_pos+33)) o_order_status_disp
	y_pos = y_pos + 15
 
foot p.name_full_formatted
	if (( y_pos + 66) >= 792 ) y_pos = 0,  break endif
 
	row + 1	y_val= 792-y_pos-21
	^{ps/newpath 1 setlinewidth   20 ^, y_val, ^ moveto  590 ^, y_val, ^ lineto stroke 20 ^, y_val, ^ moveto/}^
	;y_pos = y_pos + 12
	call print(calcpos(45,y_pos+12)) "----------------------------------------------------------------------------------------------"
	y_pos = y_pos + 36
 
foot page
	y_pos = 726
	row + 1, "{f/0}{cpi/14}"
	row + 1,
	;call print(calcpos(20,y_pos+11)) count
	call print(calcpos(20,y_pos+11)) "Lab Orders (Luther), page: "
    call print(calcpos(150,y_pos+11)) count
    call print(calcpos(20,y_pos+20))"Run Date/Time:"
    call print(calcpos(100,y_pos+20)) curdate
	call print(calcpos(145,y_pos+20)) curtime2
 
 
 
with maxcol = 300, maxrow = 500 , dio = 38, noheading, format= variable, time= value( maxsecs )
 
;;/*** START 001 ***/
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
;;/*** END 001 ***/
 
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
 
end
go
