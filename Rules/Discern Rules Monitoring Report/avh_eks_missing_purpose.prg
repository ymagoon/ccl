/*********************************************************************************************************************************
  Report Name: DA2 - Discern Expert Rules Monitoring Report
  Script Name: avh_eks_missing_purpose
  Source Code: cust_script:avh_eks_missing_purpose.prg
  Created By: Yitzhak Magoon
  Requestor: Yitzhak Magoon
 
  IT PoC: Yitzhak Magoon
 
  Program Description: This script acts as a datasource for the Discern Expert Rules Monitoring Report. It returns a list of 
  					   all modules that are missing a purpose. 

  Path: DA2
 
**********************************************************************************************************************************
                      GENERATED MODIFICATION CONTROL LOG
**********************************************************************************************************************************
  Mod| Date     | Programmer    |  Issue / Req#  |  Comment
  ---| -------- | ------------- | -------------  | ----------------------------------------------------------------------------- *
  000| 01/29/20 | ymagoon       |                | Initial release                                                               *
**********************************************************************************************************************************/

drop program avh_eks_missing_purpose go
create program avh_eks_missing_purpose
 
;Make the AutoSet subroutines available to this program
execute ccl_prompt_api_dataset "autoset"
 
select
  ems.*
  , p.name_full_formatted
from
  eks_module em
  , eks_modulestorage ems
  , prsnl p
  , dummyt d
plan em where em.active_flag = "A"
  and em.maint_validation = "PRODUCTION"
join p
  where p.person_id = em.updt_id
join ems where ems.module_name = em.module_name
  and ems.data_type = 1
  and ems.version = (select
           max(ems2.version)
        from
             eks_modulestorage ems2
        where
             ems2.module_name = ems.module_name)
join d where not ems.ekm_info > " "
order by
  em.module_name
  , em.version
 
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
 
 
