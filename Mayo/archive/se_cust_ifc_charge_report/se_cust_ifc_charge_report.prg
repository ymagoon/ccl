 
drop program se_cust_ifc_charge_report go
create program se_cust_ifc_charge_report
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Enter Location:" = ""
	, "Begin Date (MMDDYYYY)" = "TODAY"
	, "End Date (MMDDYYYY)" = "TODAY"
 
with OUTDEV, LOC, BEGIN_DT, ENDING_DT
 
 
/*************************************************************************
Source file name:   MHS_cust_ifc_report.prg
Object name:        MHS_cust_ifc_charge_report
Service Request #:  n/a
Program purpose:    This script will pull back all charges interfaced for
                    a particular interface file.
 
Tables updated:     n/a
 
Executing from:     CCL
 
Special Notes:		This script is based on cust_get_rpt_interface_chgs
*************************************************************************/
/*************************************************************************
Prompt Query for location:
SELECT DISTINCT
	I.DESCRIPTION
FROM
	INTERFACE_FILE   I
	, INTERFACE_CHARGE   IC
WHERE I.ACTIVE_IND = 1  and IC.ACTIVE_IND=1
and ic.interface_file_id = i.interface_file_id
ORDER BY
	I.DESCRIPTION
WITH MAXREC = 100, NOCOUNTER, SEPARATOR=" ", FORMAT
*************************************************************************/
/*************************************************************************
GENERATED MODIFICATION CONTROL LOG
**************************************************************************
Mod Date     Engineer             Comment
--- -------- -------------------- -----------------------------------
000 4/13/09   JLB85               Initial Creation
								  (based on cust_get_rpt_interface_chgs)
001 09/15/11  Akcia - SE		  change prompt and code for efficiency (changes were made to all of the selects
									removing the interface file table)	
002 10/20/11  Akcia - SE		  add code to run in db2							  
*************************************************************************/

/*** START 002 ***/
;*********************************************************************
;*** If PROD / CERT then run as 2nd oracle instance to improve
;*** efficiency. Will auto Fail-over to Instance 1 if Instance 2 down.
;*********************************************************************
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
 
 
if(($begin_dt = "TODAY"))
	set beg_dt = curdate
else
	set beg_dt = cnvtdate($begin_dt,"MMDDYYYY")
endif
if(($ending_dt = "TODAY"))
	set end_dt= curdate
else
  set end_dt = cnvtdate($ending_dt,"MMDDYYYY")
endif
 
;DEBIT CODE VALUE=3490
declare DEBIT_IND = f8 with Constant(uar_get_code_by("DISPLAYKEY",13028,"DEBIT")),protect
declare DEBIT_CNT = f8
declare DEBIT_QTY = f8
declare CREDIT_IND = f8 with Constant(uar_get_code_by("DISPLAYKEY",13028,"CREDIT")),protect
declare CREDIT_CNT = f8
declare CREDIT_QTY = f8
declare loc_interface_file_id = f8
SET DEBIT_CNT=0
SET DEBIT_QTY=0
SET CREDIT_CNT=0
SET CREDIT_QTY=0
 
select inf.interface_file_id
from interface_file inf
where inf.description = $loc
  and inf.active_ind = 1
detail
loc_interface_file_id = inf.interface_file_id
with nocounter
 
;Get DEBIT Transactions
SELECT INTO "NL:"
	HOWMANY=COUNT(IC.CHARGE_TYPE_CD)
FROM
 INTERFACE_CHARGE   IC
plan ic
   where ic.updt_dt_tm between cnvtdatetime(beg_dt,0) and cnvtdatetime(end_dt,235959)
   and ic.interface_file_id+0 = loc_interface_file_id
   and ic.active_ind = 1
   and IC.CHARGE_TYPE_CD=DEBIT_IND
GROUP BY
	IC.CHARGE_TYPE_CD
DETAIL
 DEBIT_CNT =HOWMANY
WITH NOCOUNTER
 
SELECT INTO "NL:"
	HOWMANY=SUM(IC.QUANTITY)
FROM
 INTERFACE_CHARGE   IC
plan ic
   where ic.updt_dt_tm between cnvtdatetime(beg_dt,0) and cnvtdatetime(end_dt,235959)
   and ic.interface_file_id+0 = loc_interface_file_id
   and ic.active_ind = 1
   and IC.CHARGE_TYPE_CD=DEBIT_IND
DETAIL
 DEBIT_QTY =HOWMANY
WITH NOCOUNTER
 
;Get CREDIT Transactions
SELECT INTO "NL:"
	HOWMANY=COUNT(IC.CHARGE_TYPE_CD)
FROM
 INTERFACE_CHARGE   IC
plan ic
   where ic.updt_dt_tm between cnvtdatetime(beg_dt,0) and cnvtdatetime(end_dt,235959)
   and ic.interface_file_id+0 = loc_interface_file_id
   and ic.active_ind = 1
   and IC.CHARGE_TYPE_CD=CREDIT_IND
GROUP BY
	IC.CHARGE_TYPE_CD
DETAIL
 CREDIT_CNT =HOWMANY
WITH NOCOUNTER
 
SELECT INTO "NL:"
	HOWMANY=SUM(IC.QUANTITY)
FROM
 INTERFACE_CHARGE   IC
plan ic
   where ic.updt_dt_tm between cnvtdatetime(beg_dt,0) and cnvtdatetime(end_dt,235959)
   and ic.interface_file_id+0 = loc_interface_file_id
   and ic.active_ind = 1
   and IC.CHARGE_TYPE_CD=CREDIT_IND
DETAIL
 CREDIT_QTY =HOWMANY
WITH NOCOUNTER
 
 
;Report Data
SELECT INTO $OUTDEV
	;inf.description "#######################"
	 IC_CHARGE_TYPE_DISP = UAR_GET_CODE_DISPLAY(IC.CHARGE_TYPE_CD)
	, ic.fin_nbr
	, ic.med_nbr
	, ic.person_name
	, ic.posted_dt_tm
	, ic.service_dt_tm
	, ic.prim_cdm
	, ic.prim_cpt
	, mod_1 = uar_get_code_display(ic.code_modifier1_cd)
	, mod_2 = uar_get_code_display(ic.code_modifier2_cd)
	, mod_3 = uar_get_code_display(ic.code_modifier3_cd)
	, ic.diag_code1
	, ic.price
	, ic.quantity
	, activity_type = uar_get_code_display(ic.activity_type_cd)
	, abn_status = uar_get_code_display(ic.abn_status_cd)
	, chg_desc = substring(1,49,ic.charge_description)
	, facility = uar_get_code_display(ic.facility_cd)
 
FROM
 INTERFACE_CHARGE   IC
plan ic
   where ic.updt_dt_tm between cnvtdatetime(beg_dt,0) and cnvtdatetime(end_dt,235959)
   and ic.interface_file_id+0 = loc_interface_file_id
   and ic.active_ind = 1
 
ORDER BY
	IC_CHARGE_TYPE_DISP, IC.Person_Name, IC.FIN_NBR
 
head report
   today = format(curdate, "MM/DD/YYYY;;D")
   line = fillstring(420,"-")
   total = 0
   row +1
   col 45 "DAILY CHARGE REPORT FOR "
   col 69 $loc
   row +1
   col 45 "Report Date: "
   col 66 today
   row +1
   col 45 "TOTAL CREDIT TXNS: "
   col 63 CREDIT_CNT
   col 80 "QUANTITY CREDIT: "
   col 98 CREDIT_QTY
   row +1
   col 45 "TOTAL DEBIT TXNS: "
   col 63 DEBIT_CNT
   col 80 "QUANTITY DEBIT: "
   col 98 DEBIT_QTY
   row +3
head page
   col 0 "LOCATION DESC"
   col 20 "FIN NBR"
   col 32 "MRN"
   col 45 "PERSON NAME"
   col 85 "POSTED DT TM"
   col 100 "SERVICE DT TM"
   col 115 "PRIMARY CDM"
   col 135 "PRIMARY CPT"
   col 155 "MOD 1"
   col 165 "MOD 2"
   col 175 "MOD 3"
   col 185 "DIAG CD"
   col 195 "PRICE"
   col 210 "QUANTITY"
   col 225 "ACTIVITY TYPE"
   col 250 "ABN STATUS"
   col 265 "CHARGE DESC"
   col 315 "FACILITY"
   row +1
head IC_CHARGE_TYPE_DISP
   IC_CHARGE_TYPE_DISP1=SUBSTRING(1,6,IC_CHARGE_TYPE_DISP),
   col 0 "Charge:"
   col 9 IC_CHARGE_TYPE_DISP1
   row +1
detail
   if ((ROW + 1) >= maxrow)  break endif
   col 0 $loc  ;"##############" ;;inf.description
   col 20 ic.fin_nbr
   col 32 ic.med_nbr
   col 45 ic.person_name
   col 85 ic.posted_dt_tm
   col 100 ic.service_dt_tm
   col 115 ic.prim_cdm
   col 135 ic.prim_cpt
   col 155 mod_1
   col 165 mod_2
   col 175 mod_3
   col 185 ic.diag_code1
   col 195 ic.price
   col 210 ic.quantity
   col 225 activity_type
   col 250 abn_status
   col 265 chg_desc
   col 315 facility
   row +1
   total = total +1
foot IC_CHARGE_TYPE_DISP
   IC_CHARGE_TYPE_DISP2=SUBSTRING(1,6,IC_CHARGE_TYPE_DISP),
   col 0 "Total"
   col 6 IC_CHARGE_TYPE_DISP2
   TOT_CHG=count(IC_CHARGE_TYPE_DISP)
   col 14 TOT_CHG
   row +2
foot report
   row +4
   COL 0 "TOTAL NBR OF CHARGES---->"
   COL 33
   GRAND = FORMAT(total, "############.##;R")
   GRAND
   row +1
 
WITH MAXCOL = 400, nocounter
 
/*** START 002 ***/
;*** After report put back to instance 1
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
/*** END 002 ***/ 
 
end
go
