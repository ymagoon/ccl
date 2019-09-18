/*********************************************************************************************
 
  Source file name:   fsi_updt_process_status_flag.prg
  Object name:        fsi_updt_process_status_flag
  Author:				      Yitzhak Magoon
 
  Program purpose:    Update all old records that are unprocessed
  Executing from:     Ops Job or CCL
  Usage:				          
 
**********************************************************************************************
*                      GENERATED MODIFICATION CONTROL LOG
**********************************************************************************************
*
* Mod Date        Feature  Engineer          Comment
* --- ----------- -------  --------------    -------------------------------------------------
* 000 09/17/2019      	  Yitzhak Magoon     Initial Release							            	     *
*********************************************************************************************/

drop program fsi_updt_process_status_flag go
create program fsi_updt_process_status_flag

prompt 
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to. 

with OUTDEV


record requestin (
  1 process = vc
  1 list[*]
    2 proc_id = i4
)

;collect a list of all interfaces that have queued messages
select distinct
  clc.listener_alias
from 
  cqm_oeninterface_tr_1 cot 
  , cqm_listener_config clc
where cot.process_status_flag = 10
  and cot.process_start_dt_tm > cnvtdatetime(curdate - 1, 0)
  and clc.listener_id = cot.listener_id
order by
  cot.listener_id
  , 0
head report
  stat = alterlist(requestin->list,5)
  interface_cnt = 0
detail
  interface_cnt = interface_cnt + 1
  
  if (interface_cnt > size(requestin->list))
    stat = alterlist(requestin->list, interface_cnt + 5)
  endif
  
  requestin->list[interface_cnt].proc_id = cnvtint(clc.listener_alias)
foot report
  stat = alterlist(requestin->list,interface_cnt)
with nocounter

;skip all messages

update into cqm_oeninterface_tr_1 cot
  set cot.process_status_flag = 75
      , cot.updt_applctx = reqinfo->updt_applctx
      , cot.updt_id = reqinfo->updt_id
      , cot.updt_cnt = cot.updt_cnt + 1
      , cot.updt_dt_tm = cnvtdatetime(curdate,curtime3)
where cot.process_status_flag = 10
  and cot.process_start_dt_tm > cnvtdatetime(curdate - 1, 0)
with nocounter

;stop all interfaces that had messages queued on it
set requestin->process = "STOP"
execute fsi_oen_control

call pause(30)

;start all interfaces that were stopped
set requestin->process = "START"
execute fsi_oen_control


end
go


