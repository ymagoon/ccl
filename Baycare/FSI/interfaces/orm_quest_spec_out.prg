/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  REF_LAB_MODOBJ
 *  Description:  Script to set PID 2.5, 3.5, 18.5 to null
 *  Type:  Open Engine Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:  SYSTEMOE
 *  Domain:  PROD
 *  Creation Date:  12/5/2002 9:19:38 AM
 *  ---------------------------------------------------------------------------------------------
 */

/***********
Version              Date               Name                  Comment

1.0                        12/05/02          Chris Eakes       Original
1.1                        02/20/03          Chris Eakes       Adding logic to move urine total volume from OBX;5 to OBR;9   
1.2	              03/28/03          Chris Eakes      Adding logic to move body site position from OBX;5 to OBR;13
1.3                        06/14/07          Tami Dillon        Adding logic to modify 999-99-999 SSN values to blanks

************/
;1.0
/****Set PID;2.5 and PID;2.6 equal to null*****/
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->type_cd = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->assign_fac_id->name_id = ""

/****Set PID;3.5 and PID;3.6 equal to null*****/

Set PAT_INT_NUM = size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int, 5)
For (i = 1 to PAT_INT_NUM)
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [i]->type_cd = ""
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [i]->assign_fac_id->name_id = ""
Endfor

/*****Set PID;18.5 and PID;18.6 equal to null****/
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->type_cd = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_fac_id->name_id = ""

;1.1
If (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP > "")
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->coll_volume->quantity = 
  oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [1]->OBX->observation_value [1]->value_1
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->coll_volume->quantity = 
  oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->relevent_clin_info  

endif

if(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ssn_nbr ="999999999")
  set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ssn_nbr =""

EndIf