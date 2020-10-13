/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  avh_him_upd_prsnl_suspension
 *
 *  Description:  Executed by the Discern Reporting Portal.
 *
 *				  This program is used by HIM to un-suspended a suspended provider. This replaces
 *                the Cerner standard ops job and allows HIM to unsuspend in real-time. Formerly,
 *                the ops job would only allow the unsuspension of the provider at the end of the
 *                day.
 *  ---------------------------------------------------------------------------------------------
 *  Author:     	Yitzhak Magoon
 *  Contact:    	yithak.magoon@avhospital.org
 *  Creation Date:  10/06/2020
 *
 *  Testing:
 *  ---------------------------------------------------------------------------------------------
 *  Mod#   Date        Author           Description & Requestor Information
 *  000    10/06/2020  Yitzhak Magoon   Initial Release
 *
 *
 *  ---------------------------------------------------------------------------------------------
*/
 
drop program avh_him_upd_prsnl_suspension go
create program avh_him_upd_prsnl_suspension
 
prompt
	"Output to File/Printer/MINE" = "MINE"                               ;* Enter or select the printer or file name to send this
	;<<hidden>>"Enter Physician Username" = ""
	, "Select Username to Unsuspend" = 0
	, "Select Organization(s) to Unsuspend Provider From" = VALUE(0.0)
 
with OUTDEV, prsnl_id, organization_id
 
record data (
  1 suspension_qual[*]
    2 prsnl_suspension_id = f8
    2 beg_effective_dt_tm = dq8
    2 end_effective_dt_tm = dq8
    2 susp_begin_dt_tm    = dq8
    2 susp_end_dt_tm      = dq8
)
 
/*
  The $organization_id prompt is set up to allow the Any(*) option.
  The define any option is used to pass 0.0 to the program when Any(*)is selected.
*/
 
declare opr_var = c2
 
if(substring(1,1,reflect(parameter(parameter2($organization_id),0))) = "L")   ;multiple organizations were selected
  set opr_var = "in"
elseif(parameter(parameter2($organization_id),1)= 0.0) ;any was selected
  set opr_var = "!="
else ;a single value was selected
  set opr_var = "="
endif
 
call echo(opr_var)
 
select into "nl:"
from
  prsnl_suspension ps
where ps.prsnl_id = $prsnl_id
  and ps.prsnl_suspension_id > 0
  and ps.active_ind = 1
  and ps.beg_effective_dt_tm < cnvtdatetime(curdate,curtime3)
  and ps.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
  and ps.susp_begin_dt_tm < cnvtdatetime(curdate,curtime3)
  and ps.susp_end_dt_tm = cnvtdatetime("31-DEC-2100 235959") ;use exact time bc users can pick end dt/tm of suspension in future
  and operator(ps.organization_id, opr_var, $organization_id)
 
head report
  cnt = 0
detail
  cnt = cnt + 1
 
  if (mod(cnt,10) = 1)
    stat = alterlist(data->suspension_qual, cnt + 9)
  endif
 
  data->suspension_qual[cnt].prsnl_suspension_id = ps.prsnl_suspension_id
  data->suspension_qual[cnt].beg_effective_dt_tm = ps.beg_effective_dt_tm
  data->suspension_qual[cnt].end_effective_dt_tm = ps.end_effective_dt_tm
  data->suspension_qual[cnt].susp_begin_dt_tm    = ps.susp_begin_dt_tm
  data->suspension_qual[cnt].susp_end_dt_tm      = ps.susp_end_dt_tm
foot report
  stat = alterlist(data->suspension_qual, cnt)
with nocounter
 
call echorecord(data)
 
update from prsnl_suspension ps
  , (dummyt d with seq = value(size(data->suspension_qual,5)))
  set
    ps.susp_end_dt_tm = cnvtdatetime(curdate,curtime3)
    , ps.updt_cnt = (ps.updt_cnt + 1)
    , ps.updt_dt_tm = cnvtdatetime(curdate,curtime3)
    , ps.updt_id = reqinfo->updt_id
    , ps.updt_task = reqinfo->updt_task
    , ps.updt_applctx = reqinfo->updt_applctx
plan d
join ps
  where ps.prsnl_suspension_id = data->suspension_qual[d.seq].prsnl_suspension_id
with nocounter
 
commit
 
if (curqual > 0)
  select into $outdev
    text = "Reinstatement successful"
  from (dummyt d1 with seq = 1)
  plan d1
  detail
    col 0 text
  with nocounter
endif
 
end
go
 
;execute avh_him_upd_prsnl_suspension "MINE",12561023, value(0.0) go
