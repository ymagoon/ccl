;     001   01/30/12     Phil Landry            Modify to use DB2
drop program PEL_ORDERS_FUTURE_OPS_bj:dba go
create program PEL_ORDERS_FUTURE_OPS_bj:dba
 
prompt
	"Output to e-mail" = "xxxxx@mayo.edu"
	, "Facility" = ""
 
with OUTDEV, FAC
 
/*** START 001 ***/
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
/*** END 001 ***/
 
record facilities
( 1 qual[*]
	2 facility_cd = f8
)
 
declare num = i2
 
set maxsec = 1800
 
 
DECLARE output_file = VC WITH NOCONSTANT ( "" )
;;SET output_file = CONCAT ("PEL_lab_orders_future_hold_",
SET output_file = CONCAT ("pel_lab_orders_future_hold_",
FORMAT ( CURDATE , "MMDDYY;;q" ), "_" ,FORMAT ( CURTIME , "HHMM;1;m" ), ".csv")
SET message_file = "labordersfuturehold.msg"
 
SELECT INTO value(output_file)
	Patient_Name = p.name_full_formatted
	,DOB = format(cnvtdatetime(p.birth_dt_tm), "MM/DD/YYYY;;D")
	, Order_Name = o.hna_order_mnemonic
	, Order_ID = o.order_id
	, Order_Entered_By = pr.name_full_formatted
	, Ordering_Provider = prs.name_full_formatted
	, Appt_Location = UAR_GET_CODE_DISPLAY(SA.APPT_LOCATION_CD)
	, Appt_Date = format(cnvtdatetime(sa.beg_dt_tm), "MM/DD/YYYY;;D")
	, Appt_Time = format(cnvtdatetime(sa.beg_dt_tm), "HH:MM:SS;;D")
 
FROM
	orders   o
	, person   p
	, prsnl   pr
	, order_action   oa
	, sch_event_attach   se
	, sch_appt   sa
 	, prsnl prs
 	, CODE_VALUE CV2
 
plan o
where o.order_status_cd =  2546.00	;future status
and o.catalog_type_cd+0 = 2513.00  ;lab
;AND O.ACTIVITY_TYPE_CD  IN (674,696,692)
and o.dept_status_cd = 	 9327.00			; on hold
and o.active_ind = 1
join se
where se.order_id = o.order_id
and se.attach_type_cd =       10473.00
join sa
where sa.sch_event_id = se.sch_event_id
and sa.STATE_MEANING in ("CONFIRMED","CHECKED IN")
and sa.ROLE_MEANING = "PATIENT"
JOIN CV2
WHERE CV2.CODE_VALUE = SA.APPT_LOCATION_CD
AND CV2.display_key = value(concat(trim($2,3),"*"))
AND NOT EXISTS
;AND EXISTS
			(SELECT
			OCS.CATALOG_CD
			FROM
				CODE_VALUE CV1,
				OCS_FACILITY_R  OCSF,
				ORDER_CATALOG_SYNONYM  OCS
				WHERE OCS.catalog_cd = O.CATALOG_CD
				AND ocs.activity_type_cd in (692, 674)
				and ocs.active_ind = 1
				and OCSF.SYNONYM_ID = ocs.synonym_id
				and CV1.CODE_VALUE = OCSF.FACILITY_CD
				AND CV1.ACTIVE_IND= 1
				AND  cv1.DISPLAY = Value(Concat(trim($2,3),"*"))) ;concat($2,"*"))
join p where p.person_id = SA.person_id
and p.name_last_key != "TESTPATIENT" or p.name_last_key != "*TEST*"
join oa where oa.order_id = o.order_id
and oa.action_type_cd =        2534.00
join pr
where pr.person_id = oa.action_personnel_id
join prs
where prs.person_id = oa.order_provider_id
 
ORDER BY
	Appt_Location,
	Appt_Date,
	Appt_Time,
	Patient_Name
 
;wITH format, skipreport = 1, TIME= VALUE(maxsec),SEPARATOR = " "
WITH TIME = VALUE( MaxSec ), SKIPREPORT = 1, DIO= 08, PCFORMAT ('"', ',' , 1), FORMAT=STREAM, FORMAT
Set dclcom1 = concat( 'echo "Attached is the Lab Orders in Future_Hold Status. \n\n',
						' " > ',
	message_file, ' && ', 'uuencode ', output_file, ' ',
	output_file, ' >> ',
	message_file, ' && ', 'cat ',
	message_file, ' | mailx -s "Lab Orders in Future_Hold_Status" ', $outdev )
set dcllen1 = size( trim( dclcom1 ) )
set dclstatus = 0
call dcl( dclcom1, dcllen1, dclstatus )
 
/*** START 001 ***/
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
/*** END 001 ***/
 
end
go
 
 
