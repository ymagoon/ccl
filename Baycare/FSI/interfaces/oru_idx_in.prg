 /*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  oru_idx_in
 *  Description:  Mod object script for rad results inbound from IDX
 *  Type:  Open Engine Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:  Chris Eakes
 *  Library:  OEOCFORUORU
 *  Creation Date:  02/19/09 15:50:37
 *  ---------------------------------------------------------------------------------------------
 *  Mod# Date    Author   Description & Requestor Information
 *
 *  1:  03/18/14  R. Quack  Removed logic to identify order_id as Cerner or Invision/HBOC for Soarian project changes and
 *                           moved code from child script into this parent modify object script as the child was uneccessary.
 *                           Also removed SSN code from the child script logic as it was unneccessary as well.
* 2:  12/15/15   T McArtor Provider filter ZDS filter RFC 8947 Approved by CK & GB
* 3:  01/06/16   T McArtor UpDate Provider filter ZDS filter RFC 9221Approved by  CK & GB
* 4:  05/012/16   T McArtor UpDate Provider filter ZDS filter RFC 11942
 *  ---------------------------------------------------------------------------------------------
*/

/***R. Quack: Code moved from the ORR_to_ORM_MODOBJV3 child script that used to be called from within this mod_obj***/

/*****************For PACs url interface 01/16/08 T. Dillon**********/
If (oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_type = "ORU") 
     Set obx_num = size(oen_reply->RES_ORU_GROUP [1]->OBX_GROUP, 5)
     Set x = 0
     For (x = 1 to obx_num)
          If (oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [x]->OBX->value_type="RP")
               execute oencpm_msglog(build("found the RP"))
               set oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [x]->OBX->observation_sub_id ="1"
          EndIf
      EndFor
EndIf

/* Start Provider Filter by Postion */  
                                                                                                                               

declare PHY = f8
declare CARD = f8
declare EDP = f8
declare EDPA = f8
declare PA = f8
declare RAD = f8
declare PHYI = f8
declare BDRN = f8

declare PAS = f8
declare NPP = f8
declare NPR = f8
declare EPAP = f8
declare EPA = f8

Set PHY = uar_get_code_by ("Display",88,"Physician")
Set CARD = uar_get_code_by ("Display",88,"Cardiologist")
Set EDP = uar_get_code_by ("Display",88,"ED Physician")
Set EDPA = uar_get_code_by ("Display",88,"ED Physician Administrator")
Set PA = uar_get_code_by ("Display",88,"Physician Administrator")
Set RAD = uar_get_code_by ("Display",88,"Radiologist")
Set PHYI = uar_get_code_by ("Display",88,"Physician Informaticist")
Set BDRN = uar_get_code_by ("Display",263,"BayCare Dr Number")

Set PAS = uar_get_code_by ("Display",88,"Physician Assistant")
Set NPP = uar_get_code_by ("Display",88,"Nurse Practitioner w PathNet")
Set NPR = uar_get_code_by ("Display",88,"Nurse Practitioner")
Set EPAP = uar_get_code_by ("Display",88,"ED Physician Assistant Phase 2")
Set EPA = uar_get_code_by ("Display",88,"ED Physician Assistant")

declare MSNUMB = vc
declare POSITION = f8
declare zds_size = i4
declare z = i4

;free set MSNUMB

set zds_size = size(oen_reply->RES_ORU_GROUP [1]->ZDS,5)
set z = 1

;If (zds_size>1)
;go to EXITSCRIPT

For (z = 1 to zds_size) 
Set MSNUMB = oen_reply->RES_ORU_GROUP [1]->ZDS [z]->provider [1]->id_nbr

SELECT into "nl:"
	PR.POSITION_CD
FROM
	PRSNL_ALIAS   P
	, PRSNL   PR

PLAN P
WHERE p.alias= MSNUMB                          and
      P.alias_pool_cd = BDRN                         and 
      p.active_ind=1

JOIN PR
WHERE p.person_id = pr.person_id

DETAIL
POSITION = PR.POSITION_CD

WITH NOCOUNTER
;If (POSITION IN (365387365.00, 365381358.00, 365386896.00, 365382531.00, 365387965.00, 365471508.00 ))

IF              (POSITION IN (PHY,CARD,EDP,EDPA,PA,RAD,PHYI,PAS,NPP,NPR,EPAP,EPA)) 
Set oen_reply->RES_ORU_GROUP [1]->ZDS [z]->action_code = ""
Set oen_reply->RES_ORU_GROUP [1]->ZDS [z]->provider [1]->id_nbr =  ""
Set oen_reply->RES_ORU_GROUP [1]->ZDS [z]->provider [1]->last_name = ""
Set oen_reply->RES_ORU_GROUP [1]->ZDS [z]->provider [1]->first_name = ""
Set oen_reply->RES_ORU_GROUP [1]->ZDS [z]->provider [1]->id_type = ""
Set oen_reply->RES_ORU_GROUP [1]->ZDS [z]->action_dt_tm = ""
Set oen_reply->RES_ORU_GROUP [1]->ZDS [z]->action_status ""

Endif
Endfor

;#EXITSCRIPT
;Endif

/********************* End Provider Filter by Postion ********************************************/