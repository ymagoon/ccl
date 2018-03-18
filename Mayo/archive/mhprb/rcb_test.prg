/***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
 *000 00/00/00 Unknown				Unknown                            *
 *001 10/18/11 Rob Banks			Modify to use DB2                  *
 *002 02/28/13 Akcia                Change mod 001 to lookup password in registry
 ******************** End of Modification Log **************************/
drop program rcb_test:dba go
create program rcb_test:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Facility Group" = "*"
 
with OUTDEV, facility_grp
 
;;/*** START 001 ***/
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
;;/*** END 001 ***/
 
/*** Start 002 - New Code ****/
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
/*** END 002 - New Code ***/
 
record facilities
( 1 qual[*]
	2 facility_cd = f8
)
 
select into "nl:"
cv.* from code_value cv
plan cv where cv.code_set = 220 and cv.cdf_meaning = "FACILITY"
and cv.display_key = value(concat(trim($facility_grp,3),"*"))
 
head report
	f_cnt = 0
detail
	f_cnt = f_cnt + 1
	stat = alterlist(facilities->qual,f_cnt)
	facilities->qual[f_cnt].facility_cd = cv.code_value
 
with nocounter
declare num = i2
 
 
set maxsec = 3000
 
select into $outdev
	Patient_Name = p.name_full_formatted
	,DOB = p.birth_dt_tm
	, Order_ID = o.order_id
	, Order_Name = o.hna_order_mnemonic
	, Order_Details = o.order_detail_display_line
	, Order_Entered_By = pr.name_full_formatted
	, Ordering_Provider = prs.name_full_formatted
	;, Order_Status = uar_get_code_display(o.order_status_cd)
	;, Dept_Order_Status = uar_get_code_display(o.dept_status_cd)
	, Facility = uar_get_code_display(e.loc_facility_cd)
	, Building = uar_get_code_display(e.loc_building_cd)
	, Nurse_Unit = uar_get_code_display(e.loc_nurse_unit_cd)
	, Encounter_Type = uar_get_code_display(e.encntr_type_cd)
 
from
	orders o
	, encounter e
	, person p
	, prsnl pr
	, order_action oa
	, prsnl prs
 
plan o
where o.updt_dt_tm >= cnvtdatetime(curdate-3,curtime3) and o.updt_dt_tm <= cnvtdatetime(curdate,curtime3)
and o.order_status_cd+0 =  2550.00  ;ordered status
and o.dept_status_cd  = 9315.00	;dispatched status
 
 
join e where o.encntr_id = e.encntr_id
and expand(num, 1, size(facilities->qual,5), e.loc_facility_cd,
facilities->qual[num].facility_cd)
 
join p where e.person_id = p.person_id
and p.name_last_key != "TESTPATIENT"
and p.name_last_key != "TEST"
and p.name_last_key != "ZTEVRON"
 
join oa where o.order_id = oa.order_id
 
join pr
where pr.person_id = oa.action_personnel_id
 
join prs
where prs.person_id = oa.order_provider_id
 
order by
	;Facility,
	;Building,
	;Nurse_Unit,
	Encounter_Type,
	Patient_Name
 
with  format, skipreport = 1, TIME= VALUE(maxsec)
 
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
 
/****Start 002 - New Code ***/
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
 
/***END 002 - New Code ***/
 
end
go
