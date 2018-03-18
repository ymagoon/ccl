drop program pfi_order_alias_import go
create program pfi_order_alias_import
 
/* populated from pfi_upd_awms_chngs
record requestin
(
   1 list_0[*]
     2 tube_id		    				 = vc
     2 awms_nbr							 = vc
     2 test_name						 = vc
)
*/
 
record data (
  1 qual[*]
    2 person_id					 = f8
    2 encntr_id					 = f8
    2 order_id					 = f8
    2 tube_id					 = vc
)
 
declare pristima_esi			 = f8 with constant(uar_get_code_by("DISPLAYKEY",89,"PRISTIMAESI"))
declare placer_ordid			 = f8 with constant(uar_get_code_by("MEANING",754,"PLACERORDID"))
declare pristima_oid			 = f8 with constant(uar_get_code_by("DISPLAYKEY",263,"PRISTIMAORDERID"))
;declare tube_id  				 = vc with requestin->list_0[1].sample
 
;;call echo(tube_id)
;call echo("test from order_alias_import")
 
 
insert from order_alias oa
  set
    oa.order_alias_id 			 = seq(order_seq, nextval)
    , oa.order_id 				 = 20311107.00 ;data->olist[oCnt].order_id
    , oa.updt_dt_tm 			 = cnvtdatetime(curdate, curtime3)
    , oa.updt_id				 = reqinfo->updt_id
    , oa.updt_task				 = reqinfo->updt_task
    , oa.updt_cnt           	 = 0
    , oa.updt_applctx			 = reqinfo->updt_applctx
    , oa.active_ind 			 = 1
    , oa.active_status_cd		 = 188 ;active_status_cd
    , oa.active_status_dt_tm 	 = cnvtdatetime(curdate,curtime3)
    , oa.active_status_prsnl_id  = 1
    , oa.alias_pool_cd			 = pristima_oid ;4701139 ;pristima order id
    , oa.order_alias_type_cd	 = placer_ordid ;1320 ;
    , oa.alias 					 = "14580"
    , oa.order_alias_sub_type_cd = 0.00
    , oa.check_digit 			 = 0
    , oa.check_digit_method_cd 	 = 0.00
    , oa.beg_effective_dt_tm	 = cnvtdatetime(curdate,curtime3) ;beg_effective_dt_tm of orders table
    , oa.end_effective_dt_tm	 = cnvtdatetime("31-dec-2100 00:00:00.00") ;end_effective_dt_tm orders table
    , oa.data_status_cd			 = 0.00
    , oa.data_status_prsnl_id	 = 1.0
    , oa.contributor_system_cd	 = pristima_esi ;4701150 ;
    , oa.bill_ord_nbr_ind		 = 0
    , oa.primary_display_ind	 = 0
    , oa.assign_authority_sys_cd = 0.00
 
with nocounter
 
 
end
go
 
