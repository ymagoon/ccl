/******************************************************
 
;  note: be sure to clean up the dm_info table with this
****************************************************
select
 dm.info_domain,
 dm.info_name,
 dm.updt_dt_tm
 from dm_info dm
where  dm.info_domain="HUMEDICA"
   and dm.info_name = "humedica_order_dispense"
go
 
delete from dm_info dm
where  dm.info_domain="HUMEDICA"
   and dm.info_name = "humedica_order_dispense"
 go
commit go
 
     added encntr_type_cd filter per Cathy and Adriana
;002 04/14/12 kmcdaniel - rewritten for Mayo (416)
 *****************************************************/
drop   program hum_order_dispense_history:dba go
create program hum_order_dispense_history:dba
 
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
 
;prompt
;	"Extract File (MINE = screen)" = "MINE"
;     , "Start Date (dd-mmm-yyyy)" = "CURDATE"
;with OUTDEV, STARTDT
 
 
free set testdt
set testdt = cnvtdatetime("01-JAN-2009 0000")
set end_run_date = cnvtdatetime("01-JAN-2012 0000")
set run_date = cnvtdatetime(curdate,curtime3)
 
declare domain_info_name = vc
set domain_info_name = trim("humedica_order_dispense")
declare month = vc
 
 
free set encounters
record encounters
(
  1 out_line                    = vc
  1 enc_cnt                     = i4
  1 qual[*]                  ; 98 entries
    2 auto_credit_ind            = vc
    2 cart_fill1_tz              = vc
    2 cart_fill2_tz              = vc ;dq8
    2 cart_fill3_tz              = vc
    2 cart_fill_doses1           = vc ;dq8
    2 cart_fill_doses2           = vc
    2 cart_fill_doses3           = vc
    2 cart_fill_dt_tm1           = vc
    2 cart_fill_dt_tm2           = vc
    2 cart_fill_dt_tm3           = vc ;10
 
    2 cart_fill_run_id1          = vc
    2 cart_fill_run_id2          = vc
    2 cart_fill_run_id3          = vc
    2 Claim_flag                 = vc
    2 cob_ind                    = vc
    2 daw_cd                     = vc
    2 days_supply                = vc
    2 dept_status_cd             = vc
    2 dispense_category_cd       = vc
    2 display_line               = vc ;20
 
    2 encntr_id                  = vc
    2 expire_dt_tm               = vc
    2 expire_tz                  = vc
    2 fill_nbr                   = vc
    2 floorstock_ind             = vc
    2 floorstock_override_ind    = vc
    2 frequency_id               = vc
    2 future_loc_facility_cd     = vc
    2 future_loc_nurse_unit_cd   = vc
    2 health_plan_id             = vc ;30
 
    2 ignore_ind                 = vc
    2 iv_set_size                = vc
    2 last_clin_review_act_seq   = vc
    2 last_clin_review_ingr_seq  = vc
    2 last_fill_act_seq          = vc
    2 last_fill_dispense_hx_id   = vc
    2 last_fill_hx_id            = vc
    2 last_fill_ingr_seq         = vc
    2 last_fill_status           = vc
    2 last_refill_dt_tm          = vc ;40
 
    2 last_refill_tz             = vc
    2 last_rx_dispense_hx_id     = vc
    2 last_ver_act_seq           = vc
    2 last_ver_ingr_seq          = vc
    2 legal_status_cd            = vc
    2 need_rx_prod_assign_flag   = vc
    2 need_rx_verify_ind         = vc
    2 next_dispense_dt_tm        = vc
    2 next_dispense_tz           = vc
    2 next_iv_seq                = vc ;50
 
    2 order_cost_value           = vc
    2 order_dispense_ind         = vc
    2 order_id                   = vc
    2 order_price_value          = vc
    2 order_type                 = vc
    2 owe_qty                    = vc
    2 parent_order_id            = vc
    2 par_doses                  = vc
    2 par_doses                  = vc
    2 patient_med_ind            = vc
    2 person_id                  = vc ;60
 
    2 pharm_type_cd              = vc
    2 price_code_cd              = vc
    2 price_schedule_id          = vc
    2 print_ind                  = vc
    2 prn_ind                    = vc
    2 profile_display_dt_tm      = vc
    2 qty_remaining              = vc
    2 refills_remaining          = vc
    2 replace_every              = vc
    2 replace_every_cd           = vc ;70
 
    2 research_account_id        = vc
    2 resume_dt_tm               = vc
    2 resume_tz                  = vc
    2 reviewed_parent_action_seq = vc
    2 rowid                      = vc
    2 rx_nbr                     = vc
    2 rx_nbr_cd                  = vc
    2 source_parent_action_seq   = vc
    2 start_dispense_dt_tm       = vc
    2 start_dispense_tz          = vc ;80
 
    2 stop_dt_tm                 = vc
    2 stop_type_cd               = vc
    2 stop_tz                    = vc
    2 suspend_dt_tm              = vc
    2 suspend_tz                 = vc
    2 total_dispense_doses       = vc
    2 total_rx_qty               = vc
    2 transfer_cnt               = vc
    2 unverified_action_type_cd  = vc
    2 unverified_comm_type_cd    = vc ;90
 
    2 unverified_route_cd        = vc
    2 unverified_rx_ord_priority_cd = vc
    2 updt_applctx               = vc
    2 updt_cnt                   = vc
    2 updt_dt_tm                 = vc
    2 updt_id                    = vc
    2 updt_task                  = vc
    2 workflow_cd                = vc ;98
   )
 
 
while (testdt < cnvtdatetime(end_run_date))
 
	if(testdt >= end_run_date) go to exit_program endif
 
   free set dtfnd
   set dtfnd = "N"
   declare mnth = vc
   declare yr = vc
   declare edt = vc
   declare startdt = f8
   declare enddt = f8
   declare nxtmnth = f8
 
   select into "nl:"
   dm.updt_dt_tm
   from dm_info dm
   where dm.info_domain = "HUMEDICA"
     and dm.info_name   = domain_info_name
   detail
    dtfnd = "Y"
    startdt = dm.updt_dt_tm
;	enddt = datetimefind(cnvtdatetime(startdt),"M", "E","E")
	enddt = cnvtdatetime(cnvtdate(startdt),235959)
    month = format(startdt,"MMM;;d")
	nxtmnth = cnvtdatetime(cnvtdate(enddt)+1,0)
    mnth = format(nxtmnth,"MMM;;d")
    yr = format(nxtmnth,"YYYY;;d")
    edt = concat("01-",mnth,"-",yr," 0000")
   with nocounter
 
   if (dtfnd = "N")
	set startdt = cnvtdatetime(testdt)
;	set enddt = datetimefind(cnvtdatetime(startdt),"M", "E","E")
	set enddt = cnvtdatetime(cnvtdate(startdt),235959)
    set month = format(startdt,"MMM;;d")
	set nxtmnth = cnvtdatetime(cnvtdate(enddt)+1,0)
    set mnth = format(nxtmnth,"MMM;;d")
    set yr = format(nxtmnth,"YYYY;;d")
    set edt = concat("01-",mnth,"-",yr," 0000")
      insert into dm_info dm
      set	dm.info_domain="HUMEDICA",
      		dm.info_name = domain_info_name,
			dm.updt_dt_tm = cnvtdatetime(nxtmnth)	;cnvtdatetime(enddt)
      with nocounter
      commit
   endif
 
   call echo(build("start_date = ",format(startdt,"mm/dd/yyyy hh:mm;;d")))
   call echo(build("end_date = ",format(enddt,"mm/dd/yyyy hh:mm;;d")))
 
   free set today
   declare today = f8
   declare edt = vc
   declare ydt = vc
   declare month = vc
   set today = cnvtdatetime(curdate,curtime3)
   set edt = format(today,"yyyymmdd;;d")
   set dirdt = format(startdt,"yyyymmdd;;d")
   set ydt = format(startdt,"yyyy;;d")
   set month = format(startdt,"mmm;;d")
   set beg_dt = startdt
   call echo(build("beg_dt = ",beg_dt))
   set end_dt = enddt
   call echo(build("end_dt = ",end_dt))
 
	set print_file = concat("hum_order_dispense_",dirdt,".dat")
	set hold_file = concat("$CCLUSERDIR","/",print_file)
 
call echo("---------------------------")
call echo(build("start_date = ",format(startdt,"mm/dd/yyyy hh:mm;;d")))
call echo(build("end_date = ",format(enddt,"mm/dd/yyyy hh:mm;;d")))
call echo("----------write to array -----------------")
 
 
select into value(print_file)
  auto_credit_ind         = cnvtstring(od.auto_credit_ind)
  ,cart_fill1_tz           = cnvtstring(od.cart_fill1_tz)
  ,cart_fill2_tz           = cnvtstring(od.cart_fill2_tz)
  ,cart_fill3_tz           = cnvtstring(od.cart_fill3_tz)
  ,cart_fill_doses1           = cnvtstring(od.cart_fill_doses1)
  ,cart_fill_doses2           = cnvtstring(od.cart_fill_doses2)
  ,cart_fill_doses3           = cnvtstring(od.cart_fill_doses3)
  ,cart_fill_dt_tm1     = format(od.cart_fill_dt_tm1,"yyyyMMddhhmmss;;d")
  ,cart_fill_dt_tm2     = format(od.cart_fill_dt_tm2,"yyyyMMddhhmmss;;d")
  ,cart_fill_dt_tm3     = format(od.cart_fill_dt_tm3,"yyyyMMddhhmmss;;d")
;10
  ,cart_fill_run_id1  = cnvtstring(od.cart_fill_run_id1)
  ,cart_fill_run_id2  = cnvtstring(od.cart_fill_run_id2)
  ,cart_fill_run_id3  = cnvtstring(od.cart_fill_run_id3)
  ,Claim_flag         = cnvtstring(od.Claim_flag)
  ,cob_ind            = cnvtstring(od.cob_ind)
  ,daw_cd             = cnvtstring(od.daw_cd)
  ,days_supply            = cnvtstring(od.days_supply)
  ,dept_status_cd         = cnvtstring(od.dept_status_cd)
  ,dispense_category_cd   = cnvtstring(od.dispense_category_cd)
  ,display_line           = trim(od.display_line,3)
;20
  ,encntr_id               = cnvtstring(od.encntr_id)
  ,expire_dt_tm            = format(od.expire_dt_tm,"yyyyMMddhhmmss;;d")
  ,expire_tz               = cnvtstring(od.expire_tz)
  ,fill_nbr                = cnvtstring(od.fill_nbr)
  ,floorstock_ind          = cnvtstring(od.floorstock_ind)
  ,floorstock_override_ind = cnvtstring(od.floorstock_override_ind)
  ,frequency_id            = cnvtstring(od.frequency_id)
  ,future_loc_facility_cd  = cnvtstring(od.future_loc_facility_cd)
  ,future_loc_nurse_unit_cd = cnvtstring(od.future_loc_nurse_unit_cd)
  ,health_plan_id           = cnvtstring(od.health_plan_id)
;30
  ,ignore_ind               = cnvtstring(od.ignore_ind)
  ,iv_set_size              = cnvtstring(od.iv_set_size)
  ,last_clin_review_act_seq = cnvtstring(od.last_clin_review_act_seq)
  ,last_clin_review_ingr_seq= cnvtstring(od.last_clin_review_ingr_seq)
  ,last_fill_act_seq        = cnvtstring(od.last_fill_act_seq)
  ,last_fill_dispense_hx_id = cnvtstring(od.last_fill_dispense_hx_id)
  ,last_fill_hx_id          = cnvtstring(od.last_fill_hx_id)
  ,last_fill_ingr_seq       = cnvtstring(od.last_fill_ingr_seq)
  ,last_fill_status         = cnvtstring(od.last_fill_status)
  ,last_refill_dt_tm        = format(od.last_refill_dt_tm,"yyyyMMddhhmmss;;d")
;40
  ,last_refill_tz           = cnvtstring(od.last_refill_tz)
  ,last_rx_dispense_hx_id   = cnvtstring(od.last_rx_dispense_hx_id)
  ,last_ver_act_seq         = cnvtstring(od.last_ver_act_seq)
  ,last_ver_ingr_seq        = cnvtstring(od.last_ver_ingr_seq)
  ,legal_status_cd          = cnvtstring(od.legal_status_cd)
  ,need_rx_prod_assign_flag = cnvtstring(od.need_rx_prod_assign_flag)
  ,need_rx_verify_ind       = cnvtstring(od.need_rx_verify_ind)
  ,next_dispense_dt_tm      = format(od.next_dispense_dt_tm,"yyyyMMddhhmmss;;d")
  ,next_dispense_tz         = cnvtstring(od.next_dispense_tz)
  ,next_iv_seq              = cnvtstring(od.next_iv_seq)
;50
  ,order_cost_value          = cnvtstring(od.order_cost_value)
  ,order_dispense_ind        = cnvtstring(od.order_dispense_ind)
  ,order_id                  = cnvtstring(od.order_id)
  ,order_price_value         = cnvtstring(od.order_price_value)
  ,order_type                = cnvtstring(od.order_type)
  ,owe_qty                   = cnvtstring(od.owe_qty)
  ,parent_order_id           = cnvtstring(od.parent_order_id)
  ,par_doses                 = cnvtstring(od.par_doses)
  ,patient_med_ind           = cnvtstring(od.patient_med_ind)
  ,person_id                 = cnvtstring(od.person_id)
;60
  ,pharm_type_cd             = cnvtstring(od.pharm_type_cd)
  ,price_code_cd             = cnvtstring(od.price_code_cd)
  ,price_schedule_id         = cnvtstring(od.price_schedule_id)
  ,print_ind                 = cnvtstring(od.print_ind)
  ,prn_ind                   = cnvtstring(od.prn_ind)
  ,profile_display_dt_tm     = format(od.profile_display_dt_tm,"yyyyMMddhhmmss;;d")
  ,qty_remaining             = cnvtstring(od.qty_remaining)
  ,refills_remaining         = cnvtstring(od.refills_remaining)
  ,replace_every             = cnvtstring(od.replace_every)
  ,replace_every_cd          = cnvtstring(od.replace_every_cd)
;70
  ,research_account_id       = cnvtstring(od.research_account_id)
  ,resume_dt_tm              = format(od.resume_dt_tm,"yyyyMMddhhmmss;;d")
  ,resume_tz                 = cnvtstring(od.resume_tz)
  ,reviewed_parent_action_seq = cnvtstring(od.reviewed_parent_action_seq)
  ,rowid                     = cnvtstring(od.rowid)
  ,rx_nbr                    = cnvtstring(od.rx_nbr)
  ,rx_nbr_cd                 = cnvtstring(od.rx_nbr_cd)
  ,source_parent_action_seq  = cnvtstring(od.source_parent_action_seq)
  ,start_dispense_dt_tm      = format(od.start_dispense_dt_tm,"yyyyMMddhhmmss;;d")
  ,start_dispense_tz         = cnvtstring(od.start_dispense_tz)
;80
  ,stop_dt_tm          = format(od.stop_dt_tm,"yyyyMMddhhmmss;;d")
  ,stop_type_cd        = cnvtstring(od.stop_type_cd)
  ,stop_tz             = cnvtstring(od.stop_tz)
  ,suspend_dt_tm       = format(od.suspend_dt_tm,"yyyyMMddhhmmss;;d")
  ,suspend_tz          = cnvtstring(od.suspend_tz)
  ,total_dispense_doses = cnvtstring(od.total_dispense_doses)
  ,total_rx_qty        = cnvtstring(od.total_rx_qty)
  ,transfer_cnt        = cnvtstring(od.transfer_cnt)
  ,unverified_action_type_cd = cnvtstring(od.unverified_action_type_cd)
  ,unverified_comm_type_cd   = cnvtstring(od.unverified_comm_type_cd)
;90
  ,unverified_route_cd             = cnvtstring(od.unverified_route_cd)
  ,unverified_rx_ord_priority_cd   = cnvtstring(od.unverified_rx_ord_priority_cd)
  ,updt_applctx                    = cnvtstring(od.updt_applctx)
  ,updt_cnt                        = cnvtstring(od.updt_cnt)
  ,updt_dt_tm                      = format(od.updt_dt_tm,"yyyyMMddhhmmss;;d")
  ,updt_id                         = cnvtstring(od.updt_id)
  ,updt_task                       = cnvtstring(od.updt_task)
  ,workflow_cd                     = cnvtstring(od.workflow_cd)
;98
 
from order_dispense od
    ,encounter e
plan od where od.updt_dt_tm between cnvtdatetime(beg_dt)
                            and cnvtdatetime(end_dt)
join e where e.encntr_id = od.encntr_id
	and e.active_ind = 1
	and e.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
head report
  head_line = build(
  "auto_credit_ind",
"||cart_fill1_tz",
"||cart_fill2_tz",
"||cart_fill3_tz",
"||cart_fill_doses1",
"||cart_fill_doses2",
"||cart_fill_doses3",
"||cart_fill_dt_tm1",
"||cart_fill_dt_tm2",
"||cart_fill_dt_tm3",
 
"||cart_fill_run_id1",
"||cart_fill_run_id2",
"||cart_fill_run_id3",
"||Claim_flag",
"||cob_ind",
"||daw_cd",
"||days_supply",
"||dept_status_cd",
"||dispense_category_cd",
"||display_line",
 
"||encntr_id",
"||expire_dt_tm",
"||expire_tz",
"||fill_nbr",
"||floorstock_ind",
"||floorstock_override_ind",
"||frequency_id",
"||future_loc_facility_cd",
"||future_loc_nurse_unit_cd",
"||health_plan_id",
 
"||ignore_ind",
"||iv_set_size",
"||last_clin_review_act_seq",
"||last_clin_review_ingr_seq",
"||last_fill_act_seq",
"||last_fill_dispense_hx_id",
"||last_fill_hx_id",
"||last_fill_ingr_seq",
"||last_fill_status",
"||last_refill_dt_tm",
 
"||last_refill_tz",
"||last_rx_dispense_hx_id",
"||last_ver_act_seq",
"||last_ver_ingr_seq",
"||legal_status_cd",
"||need_rx_prod_assign_flag",
"||need_rx_verify_ind",
"||next_dispense_dt_tm",
"||next_dispense_tz",
"||next_iv_seq",
 
"||order_cost_value",
"||order_dispense_ind",
"||order_id",
"||order_price_value",
"||order_type",
"||owe_qty",
"||parent_order_id",
"||par_doses",
"||patient_med_ind",
"||person_id",
 
"||pharm_type_cd",
"||price_code_cd",
"||price_schedule_id",
"||print_ind",
"||prn_ind",
"||profile_display_dt_tm",
"||qty_remaining",
"||refills_remaining",
"||replace_every",
"||replace_every_cd",
 
"||research_account_id",
"||resume_dt_tm",
"||resume_tz",
"||reviewed_parent_action_seq",
"||rowid",
"||rx_nbr",
"||rx_nbr_cd",
"||source_parent_action_seq",
"||start_dispense_dt_tm",
"||start_dispense_tz",
 
"||stop_dt_tm",
"||stop_type_cd",
"||stop_tz",
"||suspend_dt_tm",
"||suspend_tz",
"||total_dispense_doses",
"||total_rx_qty",
"||transfer_cnt",
"||unverified_action_type_cd",
"||unverified_comm_type_cd",
 
"||unverified_route_cd",
"||unverified_rx_ord_priority_cd",
"||updt_applctx",
"||updt_cnt",
"||updt_dt_tm",
"||updt_id",
"||updt_task",
"||workflow_cd|"
)
 
col 0 head_line
row + 1
 
head od.updt_dt_tm
detail_line     = build(
      auto_credit_ind
,'||',cart_fill1_tz
,'||',cart_fill2_tz
,'||',cart_fill3_tz
,'||',cart_fill_doses1
,'||',cart_fill_doses2
,'||',cart_fill_doses3
,'||',cart_fill_dt_tm1
,'||',cart_fill_dt_tm2
,'||',cart_fill_dt_tm3
 
,'||',cart_fill_run_id1
,'||',cart_fill_run_id2
,'||',cart_fill_run_id3
,'||',Claim_flag
,'||',cob_ind
,'||',daw_cd
,'||',days_supply
,'||',dept_status_cd
,'||',dispense_category_cd
,'||',display_line
 
,'||',encntr_id
,'||',expire_dt_tm
,'||',expire_tz
,'||',fill_nbr
,'||',floorstock_ind
,'||',floorstock_override_ind
,'||',frequency_id
,'||',future_loc_facility_cd
,'||',future_loc_nurse_unit_cd
,'||',health_plan_id
 
,'||',ignore_ind
,'||',iv_set_size
,'||',last_clin_review_act_seq
,'||',last_clin_review_ingr_seq
,'||',last_fill_act_seq
,'||',last_fill_dispense_hx_id
,'||',last_fill_hx_id
,'||',last_fill_ingr_seq
,'||',last_fill_status
,'||',last_refill_dt_tm
 
 
,'||',last_refill_tz
,'||',last_rx_dispense_hx_id
,'||',last_ver_act_seq
,'||',last_ver_ingr_seq
,'||',legal_status_cd
,'||',need_rx_prod_assign_flag
,'||',need_rx_verify_ind
,'||',next_dispense_dt_tm
,'||',next_dispense_tz
,'||',next_iv_seq
 
,'||',order_cost_value
,'||',order_dispense_ind
,'||',order_id
,'||',order_price_value
,'||',order_type
,'||',owe_qty
,'||',parent_order_id
,'||',par_doses
,'||',patient_med_ind
,'||',person_id
 
,'||',pharm_type_cd
,'||',price_code_cd
,'||',price_schedule_id
,'||',print_ind
,'||',prn_ind
,'||',profile_display_dt_tm
,'||',qty_remaining
,'||',refills_remaining
,'||',replace_every
,'||',replace_every_cd
 
,'||',research_account_id
,'||',resume_dt_tm
,'||',resume_tz
,'||',reviewed_parent_action_seq
,'||',rowid
,'||',rx_nbr
,'||',rx_nbr_cd
,'||',source_parent_action_seq
,'||',start_dispense_dt_tm
,'||',start_dispense_tz
 
,'||',stop_dt_tm
,'||',stop_type_cd
,'||',stop_tz
,'||',suspend_dt_tm
,'||',suspend_tz
,'||',total_dispense_doses
,'||',total_rx_qty
,'||',transfer_cnt
,'||',unverified_action_type_cd
,'||',unverified_comm_type_cd
 
,'||',unverified_route_cd
,'||',unverified_rx_ord_priority_cd
,'||',updt_applctx
,'||',updt_cnt
,'||',updt_dt_tm
,'||',updt_id
,'||',updt_task
,'||',workflow_cd
,'|')
 
  col 0, detail_line
  row + 1
 
with ;formfeed = none,
     maxrow = 1,
     nocounter,
     maxcol = 32000,
     format = variable,
     append
 
 
   if (dtfnd = "Y")
      set dtfnd = "N"
      update into dm_info dm
      set dm.updt_dt_tm = cnvtdatetime(nxtmnth)	;cnvtdatetime(enddt)
      where dm.info_domain="HUMEDICA" and dm.info_name = domain_info_name
      with nocounter
      commit
   endif
 
   set testdt = nxtmnth	;enddt
 
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
set outfile = concat("H416989_T",dirdt,"_E",edt,"_order_dispense.txt")
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
