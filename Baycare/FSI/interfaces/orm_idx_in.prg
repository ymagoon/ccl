/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  orm_idx_in
 *  Description:  Script for imagecast orders inbound
 *  Type:         Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:         Chris Eakes
 *  Library:        OEOCFORMORM
 *  Creation Date:  01/29/09
 *  ---------------------------------------------------------------------------------------------
 *  Mod#  Date    Author       Description & Requestor Information
 *
 *  1:      3/19/14   R Quack   Added BC standard header block and naming convention, removed commented out code
 *  ---------------------------------------------------------------------------------------------
*/

;;;Adding logic change the modifier for two tests that use laterality instead of right/left indicator.
free set obx_szz
set obx_szz=size(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP,5)
If (obx_szz>=1)
 If (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->univ_service_id [1]->identifier in
     ("MTMJ","UBREAST"))
  Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [1]->OBX->observation_id->identifier = "LAT"
 Else
  Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [1]->OBX->observation_id->identifier = "RTLT"
 Endif
Endif

If (oen_reply->ORDER_GROUP [1]->ORC [1]->order_ctrl = "MO")
 Set oen_reply->ORDER_GROUP [1]->ORC [1]->order_ctrl = "XX"
Endif

If (oen_reply->ORDER_GROUP [1]->ORC [1]->order_ctrl = "CA")
   Set oen_reply->ORDER_GROUP [1]->ORC [1]->ord_ctrl_rsn_cd->identifier = ""
   Set oen_reply->ORDER_GROUP [1]->ORC [1]->order_quant_timing [1]->end_dt_tm   = 
       oen_reply->ORDER_GROUP [1]->ORC [1]->trans_dt_tm 
    Set oen_reply->ORDER_GROUP [1]->ORC [1]->trans_dt_tm = ""
    Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->status_change_dt_tm =""
Endif