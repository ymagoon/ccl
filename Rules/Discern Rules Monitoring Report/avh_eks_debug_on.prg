/*********************************************************************************************************************************
  Report Name: DA2 - Discern Expert Rules Monitoring Report
  Script Name: avh_eks_debug_on
  Source Code: cust_script:avh_eks_debug_on.prg
  Created By: Yitzhak Magoon
  Requestor: Yitzhak Magoon
 
  IT PoC: Yitzhak Magoon
 
  Program Description: This script acts as a datasource for the Discern Expert Rules Monitoring Report. It returns a list of 
  					   all modules that have the EKS_DEBUGEKM_E* template associated to them and whether FullAudit is turned on.

  Path: DA2
 
**********************************************************************************************************************************
                      GENERATED MODIFICATION CONTROL LOG
**********************************************************************************************************************************
  Mod| Date     | Programmer    |  Issue / Req#  |  Comment
  ---| -------- | ------------- | -------------  | ----------------------------------------------------------------------------- *
  000| 01/29/20 | ymagoon       |                | Initial release                                                               *
**********************************************************************************************************************************/

drop program AVH_EKS_DEBUG_ON go
create program AVH_EKS_DEBUG_ON
 
;Make the AutoSet subroutines available to this program
execute ccl_prompt_api_dataset "autoset"
 
select
  full_audit_turned_on = if (ems.ekm_info = "*FullAudit*") "Y" else "N" endif
  , ems.module_name
from
  eks_module em
  , eks_modulestorage ems
where em.active_flag = "A"
  and em.maint_dur_begin_dt_tm < cnvtdatetime(curdate,curtime3)
  and em.maint_dur_end_dt_tm > cnvtdatetime(curdate,curtime3)
  and em.maint_validation = "PRODUCTION"
  and ems.module_name = em.module_name
  and ems.data_type = 7
  and ems.ekm_info like "*EKS_DEBUGEKM_E*"
  and ems.version = (select
        			   max(ems2.version)
       				 from
         			   eks_modulestorage ems2
       				 where
         			   ems2.module_name = ems.module_name)
order by
  em.module_name
  , em.version
  , ems.data_type
 
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
 
