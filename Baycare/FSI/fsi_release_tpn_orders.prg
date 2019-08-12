drop program fsi_release_tpn_orders go
create program fsi_release_tpn_orders
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
 
with OUTDEV
 
record request1234846 (
  1 utility_type = i2
  1 days_to_keep = i4
  1 release_id = f8
  1 release_type = vc
)
 
record hq (
  1 qual[*]
    2 queue_id = f8
    2 order_id = f8
)
 
set hq_cnt = 0
 
/*
;send email out if ops job fails
 SELECT INTO "nl:"
  FROM (ops2_step s ),
   (ops2_sched_step ss )
  PLAN (s
   WHERE (cnvtupper (s.batch_selection_txt ) = "*BC_INT_EICU_FLOWSHEET*" ) )
   JOIN (ss
   WHERE (ss.ops2_step_id = s.ops2_step_id )
   AND (ss.status_cd = value (uar_get_code_by ("MEANING" ,460 ,"COMPLETE" ) ) )
   AND (ss.actual_start_dt_tm > (sysdate - 1 ) )
   AND (ss.end_effective_dt_tm > sysdate ) )
  ORDER BY ss.actual_end_dt_tm DESC
  HEAD REPORT
   begin_date = cnvtlookahead ("1,SEC" ,cnvtdatetime
   (substring ((findstring ("thru " ,ss.ops_event_txt ) + 5 ) ,23 ,ss.ops_event_txt ) ) )
  WITH nocounter
 ;end select
 SET e_addr = "CCLTechTeam@baycare.org"
 SET e_subject = concat ("Warning: " ,request->batch_selection ," - " ,currdbname ," OPS job run " )
 SET dcl_ind = 0
 IF ((curqual = 0 ) )
  SET begin_date = cnvtlookbehind ("2,D" ,sysdate )
  SET dcl_ind = 1
  SET e_msg = "eICU OPS job ops2_sched_step record not found. begin_date set to lookbehind 2, D"
 ELSEIF ((begin_date < cnvtlookbehind ("1,D" ,sysdate ) ) )
  SET dcl_ind = 1
  IF ((cnvtlower (currdbname ) = "p30" ) )
   SET e_msg = "eICU OPS job date range > 1 Day."
  ELSE
   SET e_msg = "eICU OPS job date range > 1 Day.  begin_date set to lookbehind 1, D"
   SET begin_date = cnvtlookbehind ("1,D" ,sysdate )
  ENDIF
 ENDIF
 IF ((dcl_ind = 1 ) )
  SET dclcmd = concat (
   'echo -e "This is an automatically generated Email.  Please review this job in OPS monitor for additional information. '
   ,"\nObject name: " ,curprog ,"\nInfo: " ,e_msg ,'" | mail -s "' ,trim (e_subject ) ,'" ' ,trim (
    e_addr ) )
  SET st = 0
  CALL dcl (dclcmd ,size (trim (dclcmd ) ) ,st )
  CALL echo (dclcmd )
  CALL echo (build ("st=" ,st ) )
 ENDIF
 */
 
select into "nl:"
from
  hold_queue hq
  , dispense_hx dh
plan hq
  where hq.hold_queue_id > 0
join dh
  where dh.order_id = hq.order_id
detail
  hq_cnt = hq_cnt + 1
  stat = alterlist(hq->qual, hq_cnt)
 
  hq->qual[hq_cnt].queue_id = hq.queue_id
  hq->qual[hq_cnt].order_id = hq.order_id
with nocounter
 
call echo("...begin...")
call echorecord(hq)
call echo(build("size=",size(hq->qual,5)))
 
set request1234846->utility_type = 4
set request1234846->days_to_keep = 0
set request1234846->release_type = "ORDER"
 
;set trace callecho
;set trace rdbdebug
;set trace rdbbind
 
if (curqual > 0)
  for (x = 1 to size(hq->qual, 5))
    call echo("...set order_id...")
 
    set request1234846->release_id = hq->qual[x].order_id
 
    call echorecord(request1234846)
    execute sim_eso_hold_utilities with replace("REQUEST",request1234846)
  endfor
endif
 
;call echorecord(request1234846)
 
 
if (validate(reply->ops_event) and validate(request->output_dist) and validate(reply->status_data.status))
  set reply->status_data.status = "S"
;  set reply->ops_event = concat(format(cnvtdatetime(begin_date),";;q") ," thru " ,format(cnvtdatetime(end_date) ,";;q"))
endif
 
#exit_script
end
go
 
 
 ;release multiple orders
 ;add emails
 ;build hold rules for all tpn orders
