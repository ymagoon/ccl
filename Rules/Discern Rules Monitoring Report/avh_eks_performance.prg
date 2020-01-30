/*********************************************************************************************************************************
  Report Name: DA2 - Discern Expert Rules Monitoring Report
  Script Name: avh_eks_performance
  Source Code: cust_script:avh_eks_performance.prg
  Created By: Yitzhak Magoon
  Requestor: Yitzhak Magoon
 
  IT PoC: Yitzhak Magoon
 
  Program Description: This script acts as a datasource for the Discern Expert Rules Monitoring Report. It returns a list of 
  					   all modules that have executed within the past month that have taken more than 1 second to execute. The 
  					   performance of each module is broken into five categories: 
  					   
  					   1) 1s > time < 2s
  					   2) 2s > time < 3s
  					   3) 3s > time < 4s
  					   4) 4s > time < 4s
  					   5) time >  5s

  Path: DA2
 
**********************************************************************************************************************************
                      GENERATED MODIFICATION CONTROL LOG
**********************************************************************************************************************************
  Mod| Date     | Programmer    |  Issue / Req#  |  Comment
  ---| -------- | ------------- | -------------  | ----------------------------------------------------------------------------- *
  000| 01/29/20 | ymagoon       |                | Initial release                                                               *
**********************************************************************************************************************************/

drop program avh_eks_performance go
create program avh_eks_performance
 
;Make the AutoSet subroutines available to this program
execute ccl_prompt_api_dataset "autoset"
 
select
  t.module_name
  , t.server
  ;30 days
  , count2_30 = sum(evaluate(t.testtime,2,1))
  , count3_30 = sum(evaluate(t.testtime,3,1))
  , count4_30 = sum(evaluate(t.testtime,4,1))
  , count5_30 = sum(evaluate(t.testtime,5,1))
  , countOver5_30 = sum(evaluate(t.testtime,6,1))
from
  ((
    select
      ma.module_name
      , server = ma.server_number
      , testtime = evaluate2(if (datetimediff(ma.end_dt_tm, ma.begin_dt_tm)*24*60*60>5.0)
      						   6
      						 else
      						   datetimediff(ma.end_dt_tm, ma.begin_dt_tm)*24*60*60
      						 endif)
    from eks_module_audit ma
    where ma.begin_dt_tm between cnvtdatetime(curdate-30,0) and cnvtdatetime(curdate,0)
      and datetimediff(ma.end_dt_tm, ma.begin_dt_tm)*24*60*60>1
    with maxrec=10, time=1, format(date,"@SHORTDATETIME"), sqltype("vc","i4","i4")
  )T)
 
group by
  t.module_name
  , t.server
order by
  countOver5_30 desc
 
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
 
