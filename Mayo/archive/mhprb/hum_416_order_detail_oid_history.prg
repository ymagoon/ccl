/******************************************************
  note: be sure to clean up the dm_info table with this
select
dm.info_number,
dm.updt_dt_tm "@SHORTDATETIME",
dm.info_name
from dm_info dm
where  dm.info_domain="HUMEDICA"
and dm.info_name = "humedica_order_detail_oid_history"
go
 
delete from dm_info dm
where  dm.info_domain="HUMEDICA"
   and dm.info_name = "humedica_order_detail_oid_history"
 go
commit go
 
;  19May 2011 mrhine - select approved by Adriana, Cathy
;  05 Jul 2011 kmcdaniel - rewrite script to support range
;	by order_id
; set new end date for Mock
;  12 Jul 2011 kmcdaniel
;  1. add algorithm to keep track of current and previous runs
;002 04/14/12 kmcdaniel - rewritten for Mayo (416)
 *****************************************************/
drop   program hum_order_detail_oid_history:dba go
create program hum_order_detail_oid_history:dba
 
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
set domain_info_name = trim("humedica_order_detail_oid_history")
 
set beg_dt = testdt
set end_dt = end_run_date ;cnvtdatetime(curdate,0)	;run to current date in Mock
set startdt = beg_dt
set enddt = cnvtdatetime(cnvtdate(end_dt)-1,235959)
 
;max_rec_value determines the maximum number of order IDs to process
set max_rec_value = 1000000	;1M maxrec
 
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
 
set lowest_order_id =  74889254	;Jan 1, 2009
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
;	enddt = cnvtdatetime(cnvtdate(dm.updt_dt_tm)+1,0)
	start_order_id = dm.info_number
	dtfnd = "Y"
with nocounter
 
if (dtfnd = "N")
 insert into dm_info dm
	set 	dm.info_domain = "HUMEDICA",
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
 
free set cnt
set cnt = 0
set current_processed_record_cnt = 0
set processed_order_id = 0
 
 
set print_file = concat("hum_orders_history_",dirdt,".dat")
set hold_file = concat("$CCLUSERDIR","/",print_file)
 
select into value(print_file)
   action_sequence         = cnvtstring(od.action_sequence)
   ,detail_sequence         = cnvtstring(od.detail_sequence)
   ,oe_field_display_value  = trim(od.oe_field_display_value,3)
   ,oe_field_dt_tm_value    = format(od.oe_field_dt_tm_value,"yyyyMMddhhmmss;;d")
   ,oe_field_id             = cnvtstring(od.oe_field_id)
   ,oe_field_meaning        = trim(od.oe_field_meaning,3)
   ,oe_field_meaning_id     = cnvtstring(od.oe_field_meaning_id)
   ,oe_field_tz             = cnvtstring(od.oe_field_tz)
   ,oe_field_value          = cnvtstring(od.oe_field_value)
   ,order_id                = cnvtstring(od.order_id)
   ,parent_action_sequence  = cnvtstring(od.parent_action_sequence)
   ,rowid                   = cnvtstring(od.rowid)
   ,updt_applctx            = cnvtstring(od.updt_applctx)
   ,updt_cnt                = cnvtstring(od.updt_cnt)
   ,updt_dt_tm              = format(od.updt_dt_tm,"yyyyMMddhhmmss;;d")
   ,updt_id                 = cnvtstring(od.updt_id)
   ,updt_task               = cnvtstring(od.updt_task)
;17
from orders o
    ,order_detail od
    ,encounter enc
    ,person p
;--controls range of order IDs per batch
;--use this for complex days -- many OIDs with wide range
;--must first determine starting point
;--also comment out maxrec
;plan o where o.order_id between
;	start_order_id and (start_order_id + max_rec_value)
;  	and o.active_ind+0 = 1
;	and o.updt_dt_tm+0 between cnvtdatetime(startdt)
;  		and cnvtdatetime(enddt)
;    and o.ACTIVITY_TYPE_CD+0 in (705, 1277452, 48563399)
 
plan o where o.order_id > start_order_id
	and o.updt_dt_tm+0 between cnvtdatetime(startdt)
  		and cnvtdatetime(enddt)
    and o.active_ind = 1
    and o.current_start_dt_tm+0 > cnvtdatetime(cnvtdate(startdt)-365,0)
 
join od where o.order_id = od.order_id
	and od.action_sequence >= 1
	and od.detail_sequence >=  0
join enc  where enc.encntr_id = o.encntr_id
	and enc.active_ind = 1
	and enc.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
join p where p.person_id      = o.person_id
order o.order_id, od.action_sequence, od.detail_sequence
head report
	rtxt = build(
	  "action_sequence",
	"||detail_sequence",
	"||oe_field_display_value",
	"||oe_field_dt_tm_value",
	"||oe_field_id",
	"||oe_field_meaning",
	"||oe_field_meaning_id",
	"||oe_field_tz",
	"||oe_field_value",
	"||order_id",
	"||parent_action_sequence",
	"||rowid",
	"||updt_applctx",
	"||updt_cnt",
	"||updt_dt_tm",
	"||updt_id",
	"||updt_task|"
	)
 
  col +0 rtxt
  row + 1
 
	x=0
	current_processed_record_cnt = 0
	cnt=0
 
head o.order_id
	processed_order_id = o.order_id
	last_order_id = o.order_id
	processed_record_cnt = processed_record_cnt + 1
;	current_processed_record_cnt = current_processed_record_cnt + 1
	testdt = o.updt_dt_tm
 
	if(mod(current_processed_record_cnt,10000) = 0)
		call echo(build("current_processed_record_cnt = ", current_processed_record_cnt))
	endif
 
head od.detail_sequence
	abc = 0
detail
	abc = 0
	current_processed_record_cnt = current_processed_record_cnt + 1
 
foot od.detail_sequence
 
	rtxt2 = fillstring(3000,"")
	rtxt2 = build(
	  action_sequence
	,"||",detail_sequence
	,"||",oe_field_display_value
	,"||",oe_field_dt_tm_value
	,"||",oe_field_id
	,"||",oe_field_meaning
	,"||",oe_field_meaning_id
	,"||",oe_field_tz
	,"||",oe_field_value
	,"||",order_id
 
	,"||",parent_action_sequence
	,"||",rowid
	,"||",updt_applctx
	,"||",updt_cnt
	,"||",updt_dt_tm
	,"||",updt_id
	,"||",updt_task
	,"|"
	)
 
  col +0 rtxt2
  row + 1
with nocounter,
	maxrec = value(max_rec_value),
     maxrow = 1,
     format = variable,
     maxcol = 8000,
     append
 
 
call echo("------- finished extracting records -------")
call echo(build("start_order_id = ",format(start_order_id,"###########")))
call echo(build("last_order_id = ",format(last_order_id,"###########")))
call echo("---------------------------------------")
call echo(build("total_processed_record_cnt = ", format(processed_record_cnt,"###########")))
call echo(build("current_processed_record_cnt = ", format(current_processed_record_cnt,"###########")))
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
set outfile = concat("H416989_T",dirdt,"_E",edt,"_",batch_num,"_order_detail.txt")
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
