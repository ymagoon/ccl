/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  mod_obj_bridge_orm_out
 *  Description:  Orders to Bridge
 *  Type:  Open Engine Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:  C15597
 *  Domain:  P604
 *  Creation Date:  12/11/2017 12:58:33 PM
 *  ---------------------------------------------------------------------------------------------
 */
if(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->diag_serv_sec_id  in ("Human Milk Diet",
"Pediatric Formulas","Pediatric Supplements","HumanMilkDiet","DIETS","DIETARY"))
execute oencpm_msglog(build("SEND ORM",char(0)))     

;if(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->diag_serv_sec_id !=  "Pediactric Formulas")
  ;   set oenstatus->ignore = 1
 ; go to endofscript
else 
;execute oencpm_msglog(build("SEND ORM",char(0)))

set oenstatus->ignore = 1
 go to endofscript
endif

If( substring(1,3,oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->univ_service_id [1]->identifier) = "CD:" )
  set oenstatus->ignore = 1
;  go to endofscript
endif

Execute op_mobj_prsnl_filter_out
#endofscript