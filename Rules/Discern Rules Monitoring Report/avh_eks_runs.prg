/*********************************************************************************************************************************
  Report Name: DA2 - Discern Expert Rules Monitoring Report
  Script Name: avh_eks_runs
  Source Code: cust_script:avh_eks_runs.prg
  Created By: Yitzhak Magoon
  Requestor: Yitzhak Magoon
 
  IT PoC: Yitzhak Magoon
 
  Program Description: This script acts as a datasource for the Discern Expert Rules Monitoring Report. It returns a list every 
  					   module and every single instance that rule run over the past 60 days. For each module, the data is
  					   broken down into two groups (first 30 days and second 30 days). It is then further between five 
  					   categories:
  					   
  					   1) Total number of runs
  					   2) Total number of logic true (only works with debugging on)
  					   3) Total number of logic false (only works with debugging on)
  					   4) Total number of successful executions
  					   5) Total number of failures
  					   
  Path: DA2
 
**********************************************************************************************************************************
                      GENERATED MODIFICATION CONTROL LOG
**********************************************************************************************************************************
  Mod| Date     | Programmer    |  Issue / Req#  |  Comment
  ---| -------- | ------------- | -------------  | ----------------------------------------------------------------------------- *
  000| 01/29/20 | ymagoon       |                | Initial release                                                               *
**********************************************************************************************************************************/

drop program avh_eks_runs go
create program avh_eks_runs
 
;Make the AutoSet subroutines available to this program
execute ccl_prompt_api_dataset "autoset"
 
select
  em.module_name
  , lastmodifiedDate = em.updt_dt_tm
  ;30 days
  , runs30 = sum(t.records)
  , count_logic_false30 = sum(evaluate( t.conclude,0 , (t.records),0))
  , count_logic_true30 = sum(evaluate( t.conclude,1 , (t.records),0))
  , count_success30 = sum(evaluate( t.conclude,2 , (t.records),0))
  , count_fail30 = sum(evaluate( t.conclude,3 ,(t.records),0))
  ;60 days
  , runs60 = sum(u.records)
  , count_logic_false60 = sum(evaluate( u.conclude,0 , (u.records),0))
  , count_logic_true60 = sum(evaluate( u.conclude,1 , (u.records),0))
  , count_success60 = sum(evaluate( u.conclude,2 , (u.records),0))
  , count_fail60 = sum(evaluate( u.conclude,3 ,(u.records),0))
from
  eks_module em
  ,((
    select
      records=count(*)
      , e2.module_name
      , e2.conclude
    from EKS_MODULE_AUDIT e2
    where e2.begin_dt_tm between cnvtdatetime(curdate-30,0) and cnvtdatetime(curdate,0)
    group by
      e2.module_name
      , e2.conclude
    with sqltype("f8","vc","i4"),TIME=1
  )T)
  ,((
    select
      records=count(*)
      , e2.module_name
      , e2.conclude
    from EKS_MODULE_AUDIT e2
    where e2.begin_dt_tm between cnvtdatetime(curdate-60,0) and cnvtdatetime(curdate-30,0)
    group by
      e2.module_name
      , e2.conclude
    with sqltype("f8","vc","i4"),TIME=1
  )U)
 
where em.active_flag = "A"
  and em.maint_validation = "PRODUCTION"
  and em.maint_dur_begin_dt_tm < sysdate
  and em.maint_dur_end_dt_tm   > sysdate
  and t.module_name = outerjoin(em.module_name)
  and u.module_name = outerjoin(em.module_name)
 
group by
  em.module_name
  , em.updt_dt_tm
order by
  em.module_name
 
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
 
