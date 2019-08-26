/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  orm_bridge_out
 *  Description:  For Breast Milk/Infant Feeding orders to Bridge
 *  Type:  Open Engine Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:  Hope Kaczmarczyk
 *  Library:  OEOCF23ORMORM
 *  Creation Date:  08/02/2017 10:46:00
 *  ---------------------------------------------------------------------------------------------
 *  Mod#  Date        Author                         Description & Requestor Information
 * * 
 *  1:      01/11/18     H Kaczmarczyk       Copy/Modification of orm_getwell_emmi_out mod object script
 *  ---------------------------------------------------------------------------------------------
 */


EXECUTE OP_MSH_FAC_MODOBJ_OUT

/* Remove PID;5.7 & PID;18 extra fields */
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_name [1]->name_type_cd = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->type_cd = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_fac_id->name_id = ""

/* Remove PV1;19 extra fields */
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->visit_nbr [1]->check_digit = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->visit_nbr [1]->check_digit_scheme = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->visit_nbr [1]->assign_auth->name_id = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->visit_nbr [1]->assign_auth->univ_id = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->visit_nbr [1]->assign_auth->univ_id_type = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->visit_nbr [1]->type_cd = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->visit_nbr [1]->assign_fac_id->name_id = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->visit_nbr [1]->assign_fac_id->univ_id = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->visit_nbr [1]->assign_fac_id->univ_id_type = ""

/* ssn fix  */
if(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ssn_nbr ="999999999")
  set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ssn_nbr =""
endif

/* change to New Order */
If(oen_reply->ORDER_GROUP [1]->ORC [1]->order_ctrl = "SN")
 Set oen_reply->ORDER_GROUP [1]->ORC [1]->order_ctrl = "NW"
Endif