/*********************************************************************************************************************************
  Report Name: DA2 - Discern Expert Rules Monitoring Report
  Script Name: avh_eks_alerts
  Source Code: cust_script:avh_eks_alerts.prg
  Created By: Yitzhak Magoon
  Requestor: Yitzhak Magoon
 
  IT PoC: Yitzhak Magoon
 
  Program Description: This script acts as a datasource for the Discern Expert Rules Monitoring Report. It returns every DLG event
  					   (alert presented to an end-user) associated with a Discern Rule within the last 30 days. 

  Path: DA2
 
**********************************************************************************************************************************
                      GENERATED MODIFICATION CONTROL LOG
**********************************************************************************************************************************
  Mod| Date     | Programmer    |  Issue / Req#  |  Comment
  ---| -------- | ------------- | -------------  | ----------------------------------------------------------------------------- *
  000| 01/29/20 | ymagoon       |                | Initial release                                                               *
**********************************************************************************************************************************/

drop program avh_eks_alerts go
create program avh_eks_alerts
 
;Make the AutoSet subroutines available to this program
execute ccl_prompt_api_dataset "autoset"
 
select
  m.module_name
  , ede.dlg_name
  , ede.dlg_dt_tm
  , ede.action_flag
  , p.name_full_formatted
from
  eks_dlg_event ede
  , eks_dlg ed
  , eks_module m
  , prsnl p
where ed.dlg_name = ede.dlg_name
  and m.module_name = ed.program_name
  and p.person_id = ede.active_status_prsnl_id
  and ede.dlg_dt_tm between cnvtdatetime(curdate-30,0) and cnvtdatetime(curdate,0)
  and ede.action_flag != 5 ;ignore actions from the EKS_LOG_ACTION_A template
  and m.active_flag = "A"
  and m.maint_validation = "PRODUCTION"
  and m.maint_dur_end_dt_tm > sysdate
 
;Do not modify below --->
head report
	stat = MakeDataSet(100)
detail
	stat = WriteRecord(0)
foot report
	stat = CloseDataset(0)
with nocounter, check, reporthelp
 
end
go
 
