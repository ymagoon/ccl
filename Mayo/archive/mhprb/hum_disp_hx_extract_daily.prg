/*****************************************************/
drop   program hum_disp_hx_extract_daily:dba go
create program hum_disp_hx_extract_daily:dba
 
prompt
	"Extract File (MINE = screen)" = "MINE"
	, "Extract Date" = "CURDATE"
 
with OUTDEV, s_beg
 
;**** BEGINNING OF PREAMBLE ****
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
 
call echo(build("prompt_date:",$2))
call echo(build("stardt_var:",stardt))
 
set startdt = cnvtdatetime(stardt)
set enddt = cnvtdatetime(endt)
free set today
declare today = f8
declare edt = vc
declare ydt = vc
 
declare month = vc
set month = format(startdt,"mmm;;d")
set dir_date = format(curdate,"yyyymm;;d")
 
set today = cnvtdatetime(curdate,curtime3)
set edt = format(today,"yyyymmdd;;d")
set dirdt = format(startdt,"yyyymmdd;;d")
set ydt = format(startdt,"yyyy;;d")
 
set beg_dt = startdt
set echo_beg_dt = format(beg_dt,"dd/mmm/yyyy hh:mm;;d")
call echo(build("beg_dt = ",echo_beg_dt))
set end_dt = enddt
set echo_end_dt = format(end_dt,"dd/mmm/yyyy hh:mm;;d")
call echo(build("end_dt = ",echo_end_dt))
 
set prg_name = cnvtlower(trim(curprog))
call echo(concat("running script: ",prg_name))
 
;002 unique file logic - change for each script
set print_file = concat("hum_bc_dispense_hx_daily_",dirdt,".dat")
set print_dir = ""
set hold_file = concat("$CCLUSERDIR/",print_file)
set file_ext = "_dispense_hx.txt"
 
;*****  END OF PREAMBLE ****
 
declare pharm_cd = f8 with constant(uar_get_code_by("MEANING",6000,"PHARMACY"))
 
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
 
 
select into concat(print_dir,print_file)
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
;86
from orders o
    ,dispense_hx dhx
    ,person p
plan o where o.orig_order_dt_tm between cnvtdatetime(beg_dt) and cnvtdatetime(end_dt)
	and o.catalog_type_cd = pharm_cd
	and o.active_ind = 1
	and exists(select e.person_id from encounter e where e.person_id = o.person_id
		and not e.encntr_type_cd in (642981, 691981, 29219744, 41572220, 52657925, 73400037,
			73400154, 82897834, 82898652, 87087410, 92671966, 99308883, 100245257) )
 
join dhx where dhx.order_id = o.order_id
join p where p.person_id      = o.person_id
	and p.deceased_cd +0 = 43473805 ; Billings clinic patients
order dhx.updt_dt_tm
head report
  enCOunTERs->out_line = build(
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
 
col 0 encounters->out_line
row + 1
 
head dhx.updt_dt_tm
  encounters->out_line     = build(
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
 
  col 0, encounters->out_line
  row + 1
 
with ;formfeed = none,
     maxrow = 1,
     nocounter,
     maxcol = 5000,
     format = variable,
     append
 
 
;$cust_output/humedica/cerner/daily/[yyyymm]/
declare newdir = vc
declare LEN = i4
declare DCLCOM = vc
 
set newdir = concat("/humedica/mhprd/data/daily")
set DCLCOM = concat("mkdir ",newdir)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir = concat("/humedica/mhprd/data/daily/",dir_date)
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
 
