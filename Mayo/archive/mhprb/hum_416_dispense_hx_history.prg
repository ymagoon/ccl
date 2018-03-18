/******************************************************
  note: be sure to clean up the dm_info table with this
select *
 from dm_info dm
where  dm.info_domain="HUMEDICA"
   and dm.info_name = "humedica_dispense_hx"
go
 
delete from dm_info dm
where  dm.info_domain="HUMEDICA"
   and dm.info_name = "humedica_dispense_hx"
 go
commit go
;002 04/11/12 kmcdaniel - rewritten for Client 416
 *****************************************************/
drop   program hum_dispense_hx_history:dba go
create program hum_dispense_hx_history:dba
 
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
set testdt = cnvtdatetime("01-JAN-2010 0000")
set end_run_date = cnvtdatetime("01-JAN-2012 0000")
set run_date = cnvtdatetime(curdate,curtime3)
 
declare domain_info_name = vc
set domain_info_name = trim("humedica_dispense_hx")
declare month = vc
 
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
 
	set print_file = concat("hum_dispense_hx_history_",dirdt,".dat")
	set hold_file = concat("/cerner/d_mhprd/ccluserdir/",print_file)
	set file_ext = "_dispense_history.txt"
 
free set encounters
record encounters
(
  1 out_line                    = vc
  1 enc_cnt                     = i4
  1 qual[*]                  ; 86 entries
    2 action_sequence            = vc
    2 authorization_nbr          = vc
    2 auto_credit_ind            = vc
    2 bill_qty                   = vc
    2 charge_dt_tm               = vc
    2 charge_ind                 = vc
    2 charge_on_sched_admin_ind  = vc
    2 charge_tz                  = vc
    2 chrg_dispense_hx_id        = vc
    2 copay                      = vc ;10
 
    2 cost                       = vc
    2 crdt_dispense_hx_id        = vc
    2 discount_amount            = vc
    2 dispense_dt_tm             = vc
    2 dispense_fee               = vc
    2 dispense_hx_id             = vc
    2 dispense_prsnl_id          = vc
    2 dispense_tz                = vc
    2 disp_event_type_cd         = vc
    2 disp_loc_cd                = vc ;20
 
    2 disp_priority_cd           = vc
    2 disp_priority_dt_tm        = vc
    2 disp_priority_tz           = vc
    2 disp_qty                   = vc
    2 disp_qty_unit_cd           = vc
    2 disp_sr_cd                 = vc
    2 doses                      = vc
    2 early_reason_cd            = vc
    2 event_id                   = vc
    2 event_total_price          = vc ;30
 
    2 extra_reason_cd            = vc
    2 fill_hx_id                 = vc
    2 fill_nbr                   = vc
    2 first_dose_time            = vc
    2 first_dose_tz              = vc
    2 first_iv_seq               = vc
    2 first_schedule_seq         = vc
    2 future_charge_ind          = vc
    2 health_plan_id             = vc
    2 incentive_amt              = vc ;40
 
    2 late_reason_cd             = vc
    2 level5_cd                  = vc
    2 next_dispense_dt_tm        = vc
    2 next_dispense_tz           = vc
    2 order_id                   = vc
    2 org_action_sequence        = vc
    2 pf_dispense_hx_id          = vc
    2 pf_reason_cd               = vc
    2 pharm_type_cd              = vc
    2 prev_dispense_dt_tm        = vc ;50
 
    2 prev_dispense_tz           = vc
    2 qty_remaining              = vc
    2 reason_cd                  = vc
    2 rebill_dispense_hx_id      = vc
    2 rebill_flag                = vc
    2 refills_remaining          = vc
    2 refr_dispense_hx_id        = vc
    2 reimbursement              = vc
    2 residual_copay_amt         = vc
    2 residual_cost_amt          = vc ;60
 
    2 residual_discount_amt      = vc
    2 residual_dispense_fee_amt  = vc
    2 residual_disp_qty          = vc
    2 residual_doses             = vc
    2 residual_incentive_fee_amt = vc
    2 residual_price             = vc
    2 residual_reimbursement_amt = vc
    2 residual_sales_tax_amt     = vc
    2 residual_uc_price          = vc
    2 reverse_ind                = vc ;70
 
    2 rev_dispense_hx_id         = vc
    2 rowid                      = vc
    2 run_user_id                = vc
    2 sales_tax                  = vc
    2 skipped_schedule_seq       = vc
    2 track_nbr                  = vc
    2 track_nbr_cd               = vc
    2 transfer_to_loc_cd         = vc
    2 uc_price                   = vc
    2 unique_schedule_seq_nbr    = vc ;80
 
    2 updt_applctx               = vc
    2 updt_cnt                   = vc
    2 updt_dt_tm                 = vc
    2 updt_id                    = vc
    2 updt_task                  = vc
    2 witns_prsnl_id             = vc ;86
   )
 
 
select into value(print_file)
  action_sequence         = cnvtstring(dhx.action_sequence)
  ,authorization_nbr       = trim(dhx.authorization_nbr,3)
  ,auto_credit_ind         = cnvtstring(dhx.auto_credit_ind)
  ,bill_qty                = cnvtstring(dhx.bill_qty)
  ,charge_dt_tm            = format(dhx.charge_dt_tm,"yyyyMMddhhmmss;;d")
  ,charge_ind              = cnvtstring(dhx.charge_ind)
  ,charge_on_sched_admin_ind = cnvtstring(dhx.charge_on_sched_admin_ind)
  ,charge_tz               = cnvtstring(dhx.charge_tz)
  ,chrg_dispense_hx_id     = cnvtstring(dhx.chrg_dispense_hx_id)
  ,copay                   = cnvtstring(dhx.copay)
;10
  ,cost                    = cnvtstring(dhx.cost)
  ,crdt_dispense_hx_id     = cnvtstring(dhx.crdt_dispense_hx_id)
  ,discount_amount         = cnvtstring(dhx.discount_amount)
  ,dispense_dt_tm          = format(dhx.dispense_dt_tm,"yyyyMMddhhmmss;;d")
  ,dispense_fee            = cnvtstring(dhx.dispense_fee)
  ,dispense_hx_id          = cnvtstring(dhx.dispense_hx_id)
  ,dispense_prsnl_id       = cnvtstring(dhx.dispense_prsnl_id)
  ,dispense_tz             = cnvtstring(dhx.dispense_tz)
  ,disp_event_type_cd      = cnvtstring(dhx.disp_event_type_cd)
  ,disp_loc_cd             = cnvtstring(dhx.disp_loc_cd)
;20
  ,disp_priority_cd        = cnvtstring(dhx.disp_priority_cd)
  ,disp_priority_dt_tm     = format(dhx.disp_priority_dt_tm,"yyyyMMddhhmmss;;d")
  ,disp_priority_tz        = cnvtstring(dhx.disp_priority_tz)
  ,disp_qty                = cnvtstring(dhx.disp_qty)
  ,disp_qty_unit_cd        = cnvtstring(dhx.disp_qty_unit_cd)
  ,disp_sr_cd              = cnvtstring(dhx.disp_sr_cd)
  ,doses                   = cnvtstring(dhx.doses)
  ,early_reason_cd         = cnvtstring(dhx.early_reason_cd)
  ,event_id                = cnvtstring(dhx.event_id)
  ,event_total_price       = cnvtstring(dhx.event_total_price)
;30
  ,extra_reason_cd         = cnvtstring(dhx.extra_reason_cd)
  ,fill_hx_id              = cnvtstring(dhx.fill_hx_id)
  ,fill_nbr                = cnvtstring(dhx.fill_nbr)
  ,first_dose_time         = format(dhx.first_dose_time,"yyyyMMddhhmmss;;d")
  ,first_dose_tz           = cnvtstring(dhx.first_dose_tz)
  ,first_iv_seq            = cnvtstring(dhx.first_iv_seq)
  ,first_schedule_seq      = cnvtstring(dhx.first_schedule_seq)
  ,future_charge_ind       = cnvtstring(dhx.future_charge_ind)
  ,health_plan_id          = cnvtstring(dhx.health_plan_id)
  ,incentive_amt           = cnvtstring(dhx.incentive_amt)
;40
  ,late_reason_cd          = cnvtstring(dhx.late_reason_cd)
  ,level5_cd               = cnvtstring(dhx.level5_cd)
  ,next_dispense_dt_tm     = format(dhx.next_dispense_dt_tm,"yyyyMMddhhmmss;;d")
  ,next_dispense_tz        = cnvtstring(dhx.next_dispense_tz)
  ,order_id                = cnvtstring(dhx.order_id)
  ,org_action_sequence     = cnvtstring(dhx.org_action_sequence)
  ,pf_dispense_hx_id       = cnvtstring(dhx.pf_dispense_hx_id)
  ,pf_reason_cd            = cnvtstring(dhx.pf_reason_cd)
  ,pharm_type_cd           = cnvtstring(dhx.pharm_type_cd)
  ,prev_dispense_dt_tm     = format(dhx.prev_dispense_dt_tm,"yyyyMMddhhmmss;;d")
;50
  ,prev_dispense_tz        = cnvtstring(dhx.prev_dispense_tz)
  ,qty_remaining           = cnvtstring(dhx.qty_remaining)
  ,reason_cd               = cnvtstring(dhx.reason_cd)
  ,rebill_dispense_hx_id   = cnvtstring(dhx.rebill_dispense_hx_id)
  ,rebill_flag             = cnvtstring(dhx.rebill_flag)
  ,refills_remaining       = cnvtstring(dhx.refills_remaining)
  ,refr_dispense_hx_id     = cnvtstring(dhx.refr_dispense_hx_id)
  ,reimbursement           = cnvtstring(dhx.reimbursement)
  ,residual_copay_amt      = cnvtstring(dhx.residual_copay_amt)
  ,residual_cost_amt       = cnvtstring(dhx.residual_cost_amt)
;60
  ,residual_discount_amt      = cnvtstring(dhx.residual_discount_amt)
  ,residual_dispense_fee_amt  = cnvtstring(dhx.residual_dispense_fee_amt)
  ,residual_disp_qty          = cnvtstring(dhx.residual_disp_qty)
  ,residual_doses             = cnvtstring(dhx.residual_doses)
  ,residual_incentive_fee_amt = cnvtstring(dhx.residual_incentive_fee_amt)
  ,residual_price             = cnvtstring(dhx.residual_price)
  ,residual_reimbursement_amt = cnvtstring(dhx.residual_reimbursement_amt)
  ,residual_sales_tax_amt     = cnvtstring(dhx.residual_sales_tax_amt)
  ,residual_uc_price          = cnvtstring(dhx.residual_uc_price)
  ,reverse_ind                = cnvtstring(dhx.reverse_ind)
;70
  ,rev_dispense_hx_id       = cnvtstring(dhx.rev_dispense_hx_id)
  ,rowid                    = cnvtstring(dhx.rowid)
  ,run_user_id              = cnvtstring(dhx.run_user_id)
  ,sales_tax                = cnvtstring(dhx.sales_tax)
  ,skipped_schedule_seq     = cnvtstring(dhx.skipped_schedule_seq)
  ,track_nbr                = cnvtstring(dhx.track_nbr)
  ,track_nbr_cd             = cnvtstring(dhx.track_nbr_cd)
  ,transfer_to_loc_cd       = cnvtstring(dhx.transfer_to_loc_cd)
  ,uc_price                 = cnvtstring(dhx.uc_price)
  ,unique_schedule_seq_nbr  = cnvtstring(dhx.unique_schedule_seq_nbr)
;80
  ,updt_applctx             = cnvtstring(dhx.updt_applctx)
  ,updt_cnt                 = cnvtstring(dhx.updt_cnt)
  ,updt_dt_tm               = format(dhx.updt_dt_tm,"yyyyMMddhhmmss;;d")
  ,updt_id                  = cnvtstring(dhx.updt_id)
  ,updt_task                = cnvtstring(dhx.updt_task)
  ,witns_prsnl_id           = cnvtstring(dhx.witns_prsnl_id)
from orders o
    ,dispense_hx dhx
    ,person p
plan o where o.orig_order_dt_tm between cnvtdatetime(beg_dt)
	and cnvtdatetime(end_dt)
	and o.catalog_type_cd = 2516.00 ;	Pharmacy
join dhx where dhx.order_id = o.order_id
join p where p.person_id      = o.person_id
;         and p.deceased_cd +0 = 43473805 ; Billings clinic patients
 
head report
head_line = build(
  "action_sequence",
"||authorization_nbr",
"||auto_credit_ind",
"||bill_qty",
"||charge_dt_tm",
"||charge_ind",
"||charge_on_sched_admin_ind",
"||charge_tz",
"||chrg_dispense_hx_id",
"||copay",
 
"||cost",
"||crdt_dispense_hx_id",
"||discount_amount",
"||dispense_dt_tm",
"||dispense_fee",
"||dispense_hx_id",
"||dispense_prsnl_id",
"||dispense_tz",
"||disp_event_type_cd",
"||disp_loc_cd",
 
"||disp_priority_cd",
"||disp_priority_dt_tm",
"||disp_priority_tz",
"||disp_qty",
"||disp_qty_unit_cd",
"||disp_sr_cd",
"||doses",
"||early_reason_cd",
"||event_id",
"||event_total_price",
 
"||extra_reason_cd",
"||fill_hx_id",
"||fill_nbr",
"||first_dose_time",
"||first_dose_tz",
"||first_iv_seq",
"||first_schedule_seq",
"||future_charge_ind",
"||health_plan_id",
"||incentive_amt",
 
"||late_reason_cd",
"||level5_cd",
"||next_dispense_dt_tm",
"||next_dispense_tz",
"||order_id",
"||org_action_sequence",
"||pf_dispense_hx_id",
"||pf_reason_cd",
"||pharm_type_cd",
"||prev_dispense_dt_tm",
 
"||prev_dispense_tz",
"||qty_remaining",
"||reason_cd",
"||rebill_dispense_hx_id",
"||rebill_flag",
"||refills_remaining",
"||refr_dispense_hx_id",
"||reimbursement",
"||residual_copay_amt",
"||residual_cost_amt",
 
"||residual_discount_amt",
"||residual_dispense_fee_amt",
"||residual_disp_qty",
"||residual_doses",
"||residual_incentive_fee_amt",
"||residual_price",
"||residual_reimbursement_amt",
"||residual_sales_tax_amt",
"||residual_uc_price",
"||reverse_ind",
 
"||rev_dispense_hx_id",
"||rowid",
"||run_user_id",
"||sales_tax",
"||skipped_schedule_seq",
"||track_nbr",
"||track_nbr_cd",
"||transfer_to_loc_cd",
"||uc_price",
"||unique_schedule_seq_nbr",
 
"||updt_applctx",
"||updt_cnt",
"||updt_dt_tm",
"||updt_id",
"||updt_task",
"||witns_prsnl_id|"
)
 
col 0 head_line
row + 1
 
 
head dhx.updt_dt_tm
detail_line     = build(
      action_sequence
,'||',authorization_nbr
,'||',auto_credit_ind
,'||',bill_qty
,'||',charge_dt_tm
,'||',charge_ind
,'||',charge_on_sched_admin_ind
,'||',charge_tz
,'||',chrg_dispense_hx_id
,'||',copay
 
,'||',cost
,'||',crdt_dispense_hx_id
,'||',discount_amount
,'||',dispense_dt_tm
,'||',dispense_fee
,'||',dispense_hx_id
,'||',dispense_prsnl_id
,'||',dispense_tz
,'||',disp_event_type_cd
,'||',disp_loc_cd
 
,'||',disp_priority_cd
,'||',disp_priority_dt_tm
,'||',disp_priority_tz
,'||',disp_qty
,'||',disp_qty_unit_cd
,'||',disp_sr_cd
,'||',doses
,'||',early_reason_cd
,'||',event_id
,'||',event_total_price
 
,'||',extra_reason_cd
,'||',fill_hx_id
,'||',fill_nbr
,'||',first_dose_time
,'||',first_dose_tz
,'||',first_iv_seq
,'||',first_schedule_seq
,'||',future_charge_ind
,'||',health_plan_id
,'||',incentive_amt
 
 
,'||',late_reason_cd
,'||',level5_cd
,'||',next_dispense_dt_tm
,'||',next_dispense_tz
,'||',order_id
,'||',org_action_sequence
,'||',pf_dispense_hx_id
,'||',pf_reason_cd
,'||',pharm_type_cd
,'||',prev_dispense_dt_tm
 
,'||',prev_dispense_tz
,'||',qty_remaining
,'||',reason_cd
,'||',rebill_dispense_hx_id
,'||',rebill_flag
,'||',refills_remaining
,'||',refr_dispense_hx_id
,'||',reimbursement
,'||',residual_copay_amt
,'||',residual_cost_amt
 
,'||',residual_discount_amt
,'||',residual_dispense_fee_amt
,'||',residual_disp_qty
,'||',residual_doses
,'||',residual_incentive_fee_amt
,'||',residual_price
,'||',residual_reimbursement_amt
,'||',residual_sales_tax_amt
,'||',residual_uc_price
,'||',reverse_ind
 
,'||',rev_dispense_hx_id
,'||',rowid
,'||',run_user_id
,'||',sales_tax
,'||',skipped_schedule_seq
,'||',track_nbr
,'||',track_nbr_cd
,'||',transfer_to_loc_cd
,'||',uc_price
,'||',unique_schedule_seq_nbr
 
,'||',updt_applctx
,'||',updt_cnt
,'||',updt_dt_tm
,'||',updt_id
,'||',updt_task
,'||',witns_prsnl_id
,'|')
 
  col 0, detail_line
  row + 1
detail
	abc = 0
with maxrow = 1,
     nocounter,
     maxcol = 5000,
     format = variable,
     filesort,
     append
 
 
   if (dtfnd = "Y")
      set dtfnd = "N"
      update into dm_info dm
      set dm.updt_dt_tm = cnvtdatetime(nxtmnth)
      where dm.info_domain="HUMEDICA"
      and dm.info_name = domain_info_name
 
      with nocounter
      commit
   endif
   set testdt = nxtmnth
 
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
set outfile = concat("H416989_T",dirdt,"_E",edt,file_ext)
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
