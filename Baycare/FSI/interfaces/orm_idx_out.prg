/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  orm_idx_out
 *  Description:  Script for Imagecast rad orders outbound
 *  Type:         Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:         Chris Eakes & Jim Rachael
 *  Library:        OEOCF23ORMORM
 *  Creation Date:  01/29/09
 *  ---------------------------------------------------------------------------------------------
 *  Mod#  Date    Author       Description & Requestor Information
 *
 *  1:      8/13/10   R Quack   Added logic to call doc filter script
 *  2:      8/18/10   T Dillon     Modified logic for Cancelled orders for future dtd order issue
 *  3:      2/03/14   R Quack   Adjusted Dr. Filter Script to Call new script with MS number logic for SFB only
 *  4:      7/17/14   R Quack   Adjusted for SJS Clinic Codes Per Tony M
 *  5:      8/17/14   T McArtor Adding Blocking logic for CA & ESI REbound (inactive)
*   6:      3/31/15   S Thies     Adding Urgent Care Location Codes
*   7:      03/14/15 T McArtor WHH WHW Clinic Codes   
*  8:     10/29/15  S Thies     Adding three new BUC locations MTU, CLU, CSU
*  9:     10/29/15  T McArtor Muse EKG Filter  RFC 10634 
*  10:    04/25/16  T McArtor BRM Project RFC 11022
*  11:     04/27/16  T McArtor Echo OBR 24 CARDIO PEDI Change RFC 11694 
*  12:    07/27/16  S Thies  Add new BUC location TYU (RFC Mgr 13217)
*  13:    10/24/16  Starke  Add new BUC location SBU (RFC Mgr 14867)
*  14:    11/09/16  DOlszewski  Add new BUC location HCU (RFC Mgr 15173)
* 15:      1/18/17  S Parimi   Removed the code to populate PV1-39 for BUC/BMG locations (RFC # 529)
 *  ---------------------------------------------------------------------------------------------
*/

/*********************Start Mod 12 Echo OBR 24 CARDIO PEDI Change T McArtor  04/27/16***********************/

IF (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->diag_serv_sec_id = "CARDIO PEDI")    
    Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->diag_serv_sec_id = ""
    Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->diag_serv_sec_id = "CARDIOPED" 
 Endif

/*********************End Mod 12 Echo OBR 24 CARDIO PEDI ChangeT McArtor  04/27/16*************************/

/*********************Start Add EKG Filter T McArtor  02/22/16*******************************************/


IF(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->univ_service_id [1]->identifier IN ("EKG","EKGPEDINEO","EKGRS"
,"EKGCONTSVT","EKGPOST","EKGRTSIDED","EKG15LEAD","EKGSA"))
   set oenstatus->ignore=1
   set oenstatus->ignore_text = build("SKIPPED: UNIV_SERVICE_ID OF  ", 
oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->univ_service_id [1]->identifier, " MUST BE IN LIST")
    go to exit_script
Endif

/*********************End Mod EKG Filter T McArtor  02/22/16****************************************/

execute op_msh_fac_modobj_out

/*8/13/10  by R Quack - adding logic to call doctor filter script*/
execute op_doc_filter_gen_outv5

If(oen_reply->ORDER_GROUP [1]->ORC [1]->order_ctrl = "SN")
 Set oen_reply->ORDER_GROUP [1]->ORC [1]->order_ctrl = "NW"
Endif

/*8/18/10  by T Dillon - Modified logic for Cancelled orders for future dtd order issue*/
If (oen_reply->ORDER_GROUP [1]->ORC [1]->order_stat = "77")
 Set oen_reply->ORDER_GROUP [1]->ORC [1]->order_ctrl = "CA"
 Set oen_reply->ORDER_GROUP [1]->ORC [1]->order_stat = "85"
Endif

If (oen_reply->ORDER_GROUP [1]->ORC [1]->order_stat = "20")
 Set oen_reply->ORDER_GROUP [1]->ORC [1]->order_stat = "IX"
Endif

;;Remove "&" from comments field
If (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->relevent_clin_info != "")
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->relevent_clin_info =
  replace(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->relevent_clin_info,"&","AND",0) 
Endif

If (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->quantity_timing [1]->condition != "")
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->quantity_timing [1]->condition =
  replace(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->quantity_timing [1]->condition,"&","AND",0)
Endif

If (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->reason_for_study->text != "")
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->reason_for_study->text = 
  replace(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->reason_for_study->text ,"&","AND",0)
Endif

Set stat = alterlist(oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->INS_GROUP, 0)

If (oen_reply->ORDER_GROUP [1]->ORC [1]->order_ctrl = "NA")
 Set oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_type = "ORR"
 Set oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_trigger = "O02"
Endif

#exit_script

/*1/18/17 by S Parimi - Removed the code to populate PV1-39 with PV1-3.1(NurseUnit) -  this field is populated
   either by cloverleaf or by cerner default logic (previous script for reference: orm_idx_out3)*/