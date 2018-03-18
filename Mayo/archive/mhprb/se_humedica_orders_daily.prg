/**********************************************/
 
drop program se_humedica_orders_daily:dba go
create program se_humedica_orders_daily:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Begin Date" = "CURDATE"
 
with OUTDEV, s_beg
 
;**** BEGINNING OF PREAMBLE ****
;humedica_orders_daily "nl:", "10-JUL-2012"
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
;********************************************************
 
declare fin_cd = f8 with constant(uar_get_code_by("MEANING",319,"FIN NBR"))
declare mrn_cd = f8 with constant(uar_get_code_by("MEANING",319,"MRN"))
 
declare startdt = f8
declare enddt = f8
 
;this used in daily extract only
if(validate(request->batch_selection,"999") != "999")
	set stardt = cnvtdatetime(curdate-1,0)
	set endt = cnvtdatetime(curdate-1,235959)
else
	;$2 = "dd-mmmm-yyyy"
	set stardt = cnvtdatetime(cnvtdate2($2,"dd-mmm-yyyy"),0)
	set endt = cnvtdatetime(cnvtdate2($2,"dd-mmm-yyyy"),235959)
endif
 
free set testdt
call echo(build("prompt_date:",$2))
call echo(build("stardt_var:",stardt))
 
set startdt = cnvtdatetime(stardt)
set enddt = cnvtdatetime(endt)
 
set beg_dt = startdt
set echo_beg_dt = format(beg_dt,"dd/mmm/yyyy hh:mm;;d")
call echo(build("beg_dt = ",echo_beg_dt))
set end_dt = enddt
set echo_end_dt = format(end_dt,"dd/mmm/yyyy hh:mm;;d")
call echo(build("end_dt = ",echo_end_dt))
 
set prg_name = cnvtlower(trim(curprog))
call echo("-----------------------------")
call echo(concat("running script: ",prg_name))
 
set dir_date = format(curdate,"yyyymm;;d")
set testdt = beg_dt
set dirdt = format(startdt,"yyyymmdd;;d")
 
 
;these variables are used to label file name
free set today
declare today = f8
declare edt = vc
declare ydt = vc
declare month = vc
set today = cnvtdatetime(curdate,curtime3)
set edt = format(today,"yyyymmdd;;d")
 
;002 unique file logic - change for each script
set print_file = concat("hum_bc_orders_",dirdt,".dat")
set print_dir = ""
set hold_file = concat("$CCLUSERDIR/",print_file)
set file_ext = "_orders.txt"
 
;max_rec_value determines the maximum number of order IDs to process
set max_rec_value = 10000000	;10M maxrec
 
declare processed_record_cnt = f8
declare current_processed_record_cnt = f8
set processed_record_cnt = 0
set current_processed_record_cnt = 0
 
;these variables are used to hold counts and processed order IDs
declare last_order_id = f8		;001 rkm
declare lowest_order_id = f8
declare min_order_id = f8
declare max_order_id = f8
declare start_order_id = f8
declare processed_order_id = f8
declare ord_batch_cnt = i4
declare same_day_ind = i4
set same_day_ind = 0
 
;set lowest_order_id = 146828427.00	;Jan 1, 2008
set lowest_order_id =  146828427.00
set start_order_id = 0
set last_order_id = start_order_id
 
 
call echo("----- Initial Run-Time Parameters -----")
call echo(build("beg_dt = ",format(beg_dt,"mm/dd/yyyy hh:mm;;dm")))
call echo(build("end_dt = ",format(end_dt,"mm/dd/yyyy hh:mm;;dm")))
call echo(build("Start Order ID = ",start_order_id))
call echo("---------------------------------------")
 
;-------------------------------------------------------"
;BEGIN LOOP THROUGH RANGE OF ORDER IDs WITHIN DATE RANGE
;-------------------------------------------------------"
 
;if working on a new day, find minimum order_id
;determines the lowest order ID within requested date range
/*  moved to primary select and limiting lookback to 360 days
 
if(start_order_id = 0)
call echo("------- start search for minimun order ID -------")
call echo(build("new_start_dt = ",format(startdt,"mm/dd/yyyy hh:mm;;dm")))
call echo(build("new_end_dt = ",format(enddt,"mm/dd/yyyy hh:mm;;dm")))
 
set min_order_id = 0
set max_order_id = 0
 
	select into "nl:"
	o.order_id
	from orders o
	plan o where o.updt_dt_tm between cnvtdatetime(startdt)
		and cnvtdatetime(enddt)
		and o.active_ind = 1
		and o.order_id+0 > lowest_order_id
;		and o.current_start_dt_tm > cnvtdatetime(curdate-360,0)
	order o.order_id
	foot report
		min_order_id = min(o.order_id)
		start_order_id = min(o.order_id)
	with nocounter, maxrec = 10
 
	;if no order IDs found, exit program
	if(min_order_id = 0)
		call echo("No Value Set For Min Order ID")
;		call echo("Exiting Program")
;		go to exit_program
	endif
 
endif
*/
;when moved to prod
if(start_order_id = 0)
	set start_order_id = lowest_order_id
endif
 
call echo("----------------------------")
call echo(build("new_start_dt = ",format(startdt,"mm/dd/yyyy hh:mm;;dm")))
call echo(build("new_end_dt = ",format(enddt,"mm/dd/yyyy hh:mm;;dm")))
call echo(build("Start Order ID = ",start_order_id))
;call echo(build("Min Order ID: ", min_order_id))
call echo("----------------------------")
 
set testdt = startdt
 
/*******************************************
*  SELECTION CRITERIA
*******************************************/
 
declare rtime = c6
 
free set cnt
set cnt = 0
set current_processed_record_cnt = 0
set processed_order_id = 0
 
select into value(print_file)
	encntr_id = ord.encntr_id
	,facility = cnvtstring(enc.loc_facility_cd)
	,person_id = ord.person_id
	,ord_id = ord.order_id
	,ord_stat_cd = ord.order_status_cd
	,order_id = cnvtstring(ord.order_id)
	,organization_id = cnvtstring(enc.organization_id)
	,catalog_cd = cnvtstring(ord.catalog_cd)
	,cs_order_id = cnvtstring(ord.cs_order_id)
	,order_detail_display_line = trim(ord.order_detail_display_line,3)
	,last_update_provider_id = cnvtstring(ord.last_update_provider_id)
	,activity_type_cd = cnvtstring(ord.activity_type_cd)
	,order_status_cd = cnvtstring(ord.order_status_cd)
	,order_mnemonic = trim(ord.order_mnemonic,3)
	,order_dt_tm = format(ord.orig_order_dt_tm,"YYYYMMDDhhmmss;;d")
	,updt_dt_tm = format(ord.updt_dt_tm,"YYYYMMDDhhmmss;;d")
	,orig_ord_as_flag = ord.orig_ord_as_flag
	,dept_status_cd = cnvtstring(ord.dept_status_cd)
	,last_action_sequence = ord.last_action_sequence
	,FIN = trim(ea1.alias,3)
	,MRN = trim(ea2.alias,3)
	,cancel_dt_tm =
		if (ord.order_status_cd = 2542) ;Cancelled
			format(oa.action_dt_tm,"YYYYMMDDhhmmss;;d")
		endif
	,comp_dt_tm =
		if (ord.order_status_cd = 2543) ;completed
			format(oa.action_dt_tm,"YYYYMMDDhhmmss;;d")
		endif
	,ordering_prov_id = cnvtstring(oa.order_provider_id)
	,last_updt_dt = format(oa.action_dt_tm,"YYYYMMDDhhmmss;;d")
	,drawn_dt_tm = format(spec.drawn_dt_tm,"YYYYMMDDhhmmss;;d")
	,specimen_type_cd = cnvtstring(spec.specimen_type_cd)
	,collection_method_cd = cnvtstring(spec.collection_method_cd)
	,body_site_cd = cnvtstring(spec_co.body_site_cd)
 
from
    orders ord,
    person per,
    encounter enc,
    encntr_alias ea1,
    encntr_alias ea2,
    order_action oa,
	CE_SPECIMEN_COLL spec_co,
	v500_specimen spec,
	container con,
	order_container_r ocr
 
;--controls range of order IDs per batch
;--use this for complex days -- many OIDs with wide range
;--must first determine starting point
;--also comment out maxrec
;plan ord where ord.updt_dt_tm between cnvtdatetime(startdt)
;  		and cnvtdatetime(enddt)
;  	and ord.active_ind = 1
;	and ord.order_id between (start_order_id)
;		and (start_order_id + max_rec_value)
 
plan ord where
	;ord.order_id > start_order_id and
	ord.updt_dt_tm between cnvtdatetime(startdt)
  		and cnvtdatetime(enddt)
  	and ord.active_ind = 1
    and ord.current_start_dt_tm+0 > cnvtdatetime(cnvtdate(startdt)-365,0)
join per where per.person_id = ord.person_id
join enc where enc.encntr_id = ord.encntr_id
join oa where outerjoin(ord.order_id) =  oa.order_id
  	and oa.action_sequence = outerjoin(ord.last_action_sequence)
join ea1 where outerjoin(enc.encntr_id) = ea1.encntr_id
  	and ea1.active_ind = outerjoin(1)
  	and ea1.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
  	and ea1.encntr_alias_type_cd = outerjoin(fin_cd)
join ea2 where outerjoin(enc.encntr_id) = ea2.encntr_id
  	and ea2.active_ind = outerjoin(1)
  	and ea2.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
  	and ea2.encntr_alias_type_cd = outerjoin(mrn_cd)
join ocr where outerjoin(ord.order_id) = ocr.order_id
join con where outerjoin(ocr.container_id) = con.container_id
join spec where outerjoin(con.specimen_id) = spec.specimen_id
join spec_co where outerjoin(con.specimen_id) = spec_co.specimen_id
 
order ord.order_id
head report
	head_line = build(
	"FACILITY_CD||",
	"ORDER_ID||",
	"ORGANIZATION_ID||",
	"CATALOG_CD||",
	"PATIENT_ID||",
	"ENCOUNTER_ID||",
	"CARESET_ORDER_ID||",
	"ORDER_DETAIL_DISPLAY_LINE||",
	"ORDER_COMPLETE_DT_TM||",
	"LAST_UPDT_PROVIDER_ID||",
	"ACTIVITY_TYPE_CD||",
	"ORDER_STATUS_CD||",
	"ORDER_MNEMONIC||",
	"ORDER_DATE||",				;mod 7/6
	"ORDER_UPDATE_DATE||",		;mod 7/6
	"ORIG_ORD_AS_FLAG||",		;added 7/6
	"CANCEL_DATE||",
	"DRAWN_DT_TM||",
	"DEPT_STATUS_CD||",
	"SPECIMENT_TYPE_CD||",
	"COLLECTION_METHOD_CD||",
	"ORDERING_PROVIDER_ID||",
	"ACTION_DT_TM||",			;mod 7/6
;	"LAST_UPDT_ID||",			;<- REMOVE THIS
	"BODY_SITE_CD|"
	)
 
	col 0, head_line
	row+1
 
	x=0
	current_processed_record_cnt = 0
	cnt=0
 
head ord.order_id
	processed_order_id = ord.order_id
	last_order_id = ord.order_id
	processed_record_cnt = processed_record_cnt + 1
	testdt = ord.updt_dt_tm
 
	if(mod(current_processed_record_cnt,5000) = 0)
		call echo(build("current_processed_record_cnt = ", current_processed_record_cnt))
	endif
 
detail
	abc = 0
	current_processed_record_cnt = current_processed_record_cnt + 1
 
foot ord.order_id
	foot_line = fillstring(4500,"")
	foot_line = build(
	facility ,'||',
	order_id ,'||',
	organization_id ,'||',
	catalog_cd ,'||',
	MRN ,'||',
	FIN ,'||',
	cs_order_id ,'||',
	order_detail_display_line ,'||',
	comp_dt_tm ,'||',
	last_update_provider_id ,'||',
	activity_type_cd ,'||',
	order_status_cd ,'||',
	order_mnemonic ,'||',
	order_dt_tm ,'||',
	updt_dt_tm ,'||',				;added 7/6
	orig_ord_as_flag ,'||',			;added 7/6
	cancel_dt_tm ,'||',
	drawn_dt_tm ,'||',
	dept_status_cd ,'||',
	specimen_type_cd ,'||',
	collection_method_cd ,'||',
	ordering_prov_id ,'||',
	last_updt_dt ,'||',
	body_site_cd ,'|'
	)
 
	col 0, foot_line
	row+1
with nocounter,
	;maxrec = value(max_rec_value),
     maxrow = 1,
     format = variable,
     maxcol = 5000,
     append
 
 
call echo("------- finished loading array -------")
call echo(build("start_order_id = ",format(start_order_id,"###########")))
call echo(build("last_order_id = ",format(last_order_id,"###########")))
call echo("---------------------------------------")
call echo(build("total_processed_record_cnt = ", format(processed_record_cnt,"###########")))
call echo("---------------------------------------")
 
 
set rtime = cnvtstring(curtime2)
declare batch_num = c6
set batch_num = format(trim(rtime),"######;p0")
 
;set dirdt = format(testdt,"yyyymmdd;;d")	;001 rkm
set ydt = format(testdt,"yyyy;;d")		;001 rkm
set month = format(testdt,"mmm;;d")
 
 
DECLARE LEN = I4
DECLARE dclcom = vc ;C255
DECLARE newdir = vc ;C255
 
set newdir = "$mhs_ops/"
set DCLCOM = concat("mkdir ",newdir,"humedica/")
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir = "$mhs_ops/humedica/"
set DCLCOM = concat("mkdir ",newdir,"cerner/")
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir ="$mhs_ops/humedica/cerner/"
set DCLCOM = concat("mkdir ",trim(newdir),"daily/")
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir = "$mhs_ops/humedica/cerner/daily/"
set DCLCOM = concat("mkdir ",trim(newdir),dir_date,"/")
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
free set outfile
set outfile = concat("H416989_T",dirdt,"_E",edt,"_",batch_num,file_ext)
set newfile = concat(trim(newdir),dir_date,"/",outfile)
 
set DCLCOM = concat("mv ",trim(hold_file)," ",newfile)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set DCLCOM = concat("gzip -9 ",newfile)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
#exit_program
 
;****** After report put back to instance 1
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
;******************************************
 
end
go
 
 
