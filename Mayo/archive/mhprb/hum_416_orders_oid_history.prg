/************************************
26 Jun 2011 kmcdaniel
  1. add check for dm_info
06 Jul 2011 kmcdaniel
  1. add algorithm to keep track of current and previous runs
 
;use the select and delete of dm_info(if needed)
;to manage records prior to run
select
dm.info_number,
dm.updt_dt_tm "@SHORTDATETIME",
dm.info_name
 from dm_info dm
where  dm.info_domain="HUMEDICA"
   and dm.info_name = "humedica_orders_oid_history"
go
 
delete from dm_info dm
where  dm.info_domain="HUMEDICA"
   and dm.info_name = "humedica_orders_oid_history"
 go
commit go
;002 04/14/12 kmcdaniel - rewritten for Mayo (416)
*************************************/
 
drop program hum_orders_oid_history:dba go
create program hum_orders_oid_history:dba
 
;prompt
;	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
;
;with OUTDEV
 
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
 
free set testdt
free set rtime
set testdt = cnvtdatetime("01-JAN-2009 0000")
set rtime = cnvtstring(curtime2)
set end_run_date = cnvtdatetime("01-JAN-2010 0000")
set run_date = cnvtdatetime(curdate,curtime3)
 
declare domain_info_name = vc
set domain_info_name = trim("humedica_orders_oid_history")
 
set beg_dt = testdt
set end_dt = end_run_date
set startdt = beg_dt
set enddt = cnvtdatetime(cnvtdate(end_dt)-1,235959)
 
;max_rec_value determines the maximum number of order IDs to process
set max_rec_value = 1000000	;1M maxrec
;set max_rec_value = 10000	;test only
 
;max_rec_count determines the maximum number of records to process
;this can be adjusted up or down to management performance or file size
declare max_record_cnt = f8
declare processed_record_cnt = f8
set processed_record_cnt = 0
if(weekday(curdate) = 0 or weekday(curdate) = 6)
	set max_record_cnt = 100000000	;100M on weekends
else
	set max_record_cnt = 500000		;5M	on weekdays
endif
 
;these variables are used to hold counts and processed order IDs
declare last_order_id = f8		;001 rkm
declare lowest_order_id = f8
declare start_order_id = f8
declare processed_order_id = f8
declare ord_batch_cnt = i4
declare same_day_ind = i4
set same_day_ind = 0
 
set lowest_order_id = 74889254	;Jan 1, 2009
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
while (processed_record_cnt < max_record_cnt
	and testdt < end_dt)
	set ord_batch_cnt = ord_batch_cnt + 1
	set complete_ind = 0
;steps below use dm_info table to record Daily Orders processed
free set dtfnd
set dtfnd = "N"
 
;look at dm_info and determine last order_id and updt_dt
select into "nl:"
	dm.updt_dt_tm
from dm_info dm
where dm.info_domain = "HUMEDICA"
	and dm.info_name = domain_info_name
detail
	startdt = cnvtdatetime(cnvtdate(dm.updt_dt_tm),0)
	enddt = cnvtdatetime(cnvtdate(dm.updt_dt_tm),235959)
	start_order_id = dm.info_number
	dtfnd = "Y"
with nocounter
 
if (dtfnd = "N")
 insert into dm_info dm
	set 	dm.info_domain="HUMEDICA",
			dm.info_name = domain_info_name,
			dm.updt_dt_tm = cnvtdatetime(beg_dt),
			dm.info_number = start_order_id
 with nocounter
 commit
 set dtfnd = "Y"
 set enddt = cnvtdatetime(cnvtdate(startdt),235959)
endif
 
;if working on a new day, find minimum order_id
;determines the lowest order ID within requested date range
/*
declare min_order_id = f8
if(start_order_id = 0)
call echo("------- start search for minimun order ID -------")
call echo(build("new_start_dt = ",format(startdt,"mm/dd/yyyy hh:mm;;dm")))
call echo(build("new_end_dt = ",format(enddt,"mm/dd/yyyy hh:mm;;dm")))
 
	select into "nl:"
	o.order_id
	from orders o
	plan o where o.updt_dt_tm between cnvtdatetime(startdt)
		and cnvtdatetime(enddt)
		and o.active_ind = 1
		and o.order_id+0 > lowest_order_id
		and o.current_start_dt_tm > cnvtdatetime(curdate-360,0)
	order o.order_id
	foot report
		min_order_id = min(o.order_id)
		start_order_id = min(o.order_id)
	with nocounter, maxrec = 10
 
	;if no order IDs found, exit program
	if(min_order_id = 0)
		call echo("No Value Set For Min Order ID")
		call echo("Exiting Program")
		go to exit_program
	endif
endif
*/
;when moved to prod
if(start_order_id = 0)
	set start_order_id = lowest_order_id
endif
 
call echo("----------------------------")
;call echo(build("beg_dt = ",format(beg_dt,"mm/dd/yyyy hh:mm;;dm")))
;call echo(build("end_dt = ",format(end_dt,"mm/dd/yyyy hh:mm;;dm")))
call echo(build("new_start_dt = ",format(startdt,"mm/dd/yyyy hh:mm;;dm")))
call echo(build("new_end_dt = ",format(enddt,"mm/dd/yyyy hh:mm;;dm")))
call echo(build("Start Order ID = ",start_order_id))
;call echo(build("Min Order ID: ", min_order_id))
call echo("----------------------------")
 
set testdt = startdt
 
/*******************************************
*  SELECTION CRITERIA
*******************************************/
 
;these variables are used to label file name
free set today
declare today = f8
declare edt = vc
declare ydt = vc
declare month = vc
set today = cnvtdatetime(curdate,curtime3)
set edt = format(today,"yyyymmdd;;d")
;move to bottom ;rkm
set dirdt = format(testdt,"yyyymmdd;;d")	;001 rkm
;set ydt = format(enddt,"yyyy;;d")		;001 rkm
;set month = format(enddt,"mmm;;d")
 
declare rtime = c6
;moved rtime to set after select
 
 
;no longer using array for record load ... except ...
free record tmp
record tmp (
1 out_line = vc		;this line is still being used
1 orders[*]
  2 encntr_id = f8
  2 person_id = f8
  2 ord_id = f8
  2 ord_stat_cd = f8
  2 facility = vc
  2 order_id = vc
  2 order_detail_display_line = vc
  2 organization_id = vc
  2 catalog_cd = vc
  2 activity_type_cd = vc
  2 MRN = vc
  2 FIN = vc
  2 order_mnemonic = vc
  2 cs_order_id = vc
  2 dept_status_cd = vc
  2 order_status_cd = vc
  2 comp_dt_tm = vc
  2 order_dt_tm = vc
  2 last_action_sequence = i4
  2 last_update_provider_id = vc
  2 cancel_dt_tm = vc
  2 drawn_dt_tm = vc
  2 specimen_type_cd = vc
  2 body_site_cd = vc
  2 ordering_prov_id = vc
  2 collection_method_cd = vc
  2 last_updt_dt = vc
  )
 
free set cnt
set cnt = 0
set complete_ind = 0
set processed_order_id = 0
set current_processed_record_cnt = 0
 
 
set print_file = concat("hum_orders_oid_history_",dirdt,".dat")
set hold_file = concat("/cerner/d_mhprd/ccluserdir/",print_file)
 
;initial select of orders and patient info
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
 
plan ord where ord.order_id > start_order_id
	and ord.updt_dt_tm+0 between cnvtdatetime(startdt)
  		and cnvtdatetime(enddt)
  	and ord.active_ind = 1
    and ord.current_start_dt_tm+0 > cnvtdatetime(cnvtdate(startdt)-365,0)
join per where per.person_id = ord.person_id
join enc where enc.encntr_id = ord.encntr_id
  	and enc.active_ind = 1
  	and enc.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
join oa where outerjoin(ord.order_id) =  oa.order_id
  	and oa.action_sequence = outerjoin(ord.last_action_sequence)
join ea1 where outerjoin(enc.encntr_id) = ea1.encntr_id
  	and ea1.active_ind = outerjoin(1)
  	and ea1.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
  	and ea1.encntr_alias_type_cd = outerjoin(1077)
join ea2 where outerjoin(enc.encntr_id) = ea2.encntr_id
  	and ea2.active_ind = outerjoin(1)
  	and ea2.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
  	and ea2.encntr_alias_type_cd = outerjoin(1079)
join ocr where outerjoin(ord.order_id) = ocr.order_id
join con where outerjoin(ocr.container_id) = con.container_id
join spec where outerjoin(con.specimen_id) = spec.specimen_id
join spec_co where outerjoin(con.specimen_id) = spec_co.specimen_id
 
order ord.order_id
head report
	tmp->out_line = build(
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
 
	col 0, tmp->out_line
	row+1
 
	x=0
	current_processed_record_cnt = 0
	cnt=0
 
head ord.order_id
	processed_order_id = ord.order_id
	last_order_id = ord.order_id
	processed_record_cnt = processed_record_cnt + 1
	testdt = ord.updt_dt_tm
	rtime = format(cnvttime(ord.updt_dt_tm),"hhmmss;;m")
 
	if(mod(current_processed_record_cnt,5000) = 0)
		call echo(build("current_processed_record_cnt = ", current_processed_record_cnt))
	endif
 
detail
	abc = 0
	current_processed_record_cnt = current_processed_record_cnt + 1
 
foot ord.order_id
	tmp->out_line = build(
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
 
	col 0, tmp->out_line
	row+1
with nocounter,
	maxrec = value(max_rec_value),
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
 
if(processed_order_id = 0 or last_order_id = start_order_id)
	if(testdt > cnvtdatetime(cnvtdate(end_dt),0))
		set processed_record_cnt = max_record_cnt
	endif
 
	set last_order_id = 0
	set testdt = cnvtdatetime(cnvtdate(enddt)+1,0)
	set complete_ind = 1
 
	if (dtfnd = "Y")
		set dtfnd = "N"
		update into dm_info dm
			set 	dm.updt_dt_tm = cnvtdatetime(testdt),
					dm.info_number = last_order_id
		where dm.info_domain="HUMEDICA"
			and dm.info_name = domain_info_name
		with nocounter
		commit
	endif
 
endif
 
if (complete_ind = 0) ;write file only if order IDs processed
 
	if (current_processed_record_cnt = max_rec_value)
		set last_order_id = last_order_id - 1
	endif
 
;set rtime = cnvtstring(curtime2)
declare batch_num = c6
set batch_num = format(cnvtstring(curtime2),"######;p0")	;format(trim(rtime),"######;p0")
 
set dirdt = format(testdt,"yyyymmdd;;d")	;001 rkm
set ydt = format(testdt,"yyyy;;d")		;001 rkm
set month = format(testdt,"mmm;;d")
 
declare dir_date = vc
set dir_date = trim(concat(format(run_date,"yyyy;;d"),format(run_date,"mm;;d")))
declare newdir = vc
declare LEN = i4
declare DCLCOM = vc
 
set newdir = concat("/humedica/mhprd/data/cerner")
set DCLCOM = concat("mkdir ",newdir)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir = concat("/humedica/mhprd/data/cerner/historical")
set DCLCOM = concat("mkdir ",newdir)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir = concat("/humedica/mhprd/data/cerner/historical/",dir_date)
set DCLCOM = concat("mkdir ",newdir)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
free set outfile
set outfile = concat("H416989_T",dirdt,"_E",edt,"_",batch_num,"_orders.txt")
free set base
set base = concat(trim(newdir),"/")
 
free set newfile
declare newfile = vc
set newfile = concat(base,outfile)
set DCLCOM = concat("mv ",trim(hold_file)," ",newfile)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set DCLCOM = concat("gzip -9 ",newfile)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
	set dtfnd = "N"
	update into dm_info dm
		set 	dm.updt_dt_tm = cnvtdatetime(testdt),
				dm.info_number = last_order_id
	where dm.info_domain="HUMEDICA"
		and dm.info_name = domain_info_name
	with nocounter
	commit
 
endif
 
endwhile
 
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
