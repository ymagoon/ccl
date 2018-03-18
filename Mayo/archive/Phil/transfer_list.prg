select 
fac = uar_get_code_display(e.loc_facility_cd),
ao.accession,
o.order_id,
clc.*
,col.*
 from collection_list col
,collection_list_container clc
,order_serv_res_container osrc
,orders o
,accession_order_r ao
,encounter e

plan col
where col.collection_list_nbr = 158 ;373
;and col.collection_list_id =       127289121.00
and col.collection_list_dt_tm > cnvtdatetime(cnvtdate(01052015),0)
join clc
	where clc.collection_list_id = col.collection_list_id
	join osrc
		where osrc.container_id = clc.container_id
	join o
		where o.order_id = osrc.order_id	

join ao
where ao.order_id = o.order_id
join e
	where e.encntr_id = o.encntr_id	
select * from container c
where c.container_id in (
   37384038.00,
   37419679.00,
   37420380.00,
   37423755.00
)

select 
dep_stat = uar_get_code_display(oa.dept_status_cd),
oa.dept_status_cd,
* from order_action oa
where oa.order_id =  ; 1749785475.00
					  1749424133.00

select * from code_value 
where code_VALUE = 653073

SELECT 
EVENT_TYPE = UAR_GET_code_display(ce.event_type_cd),
* FROM CONTAINER_EVENT CE
WHERE CE.container_id =    37423755.00
