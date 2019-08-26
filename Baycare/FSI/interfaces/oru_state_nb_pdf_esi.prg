/***********************************************************************************
*  Type:  Open Engine Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:  CERNER
 ***********************************************************************************/
/***********************************************************************************
 *  Mod#   Date	        Author                 Description & Requestor Information
 *
 *  1:  07/27/2016   S Parimi               CAB # 8966 implementation of Newborn Screening Results from State  
***********************************************************************************/


;;MSH-3
set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_application = "STATE_NEWBORN_PDF"

;;MSH-5
set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application = "POSTIMAGE"

;;MSH-6
set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_facility = ""

;;Removing all but PDF OBX from Result
Set count = 0

For  (obxres=1 to size(oen_reply->RES_ORU_GROUP [1]->OBX_GROUP,5))
  If (oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [obxres]->OBX->value_type != "ST")
    set count = count+1
              Set oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [count]->OBX->set_id = CNVTSTRING(count)
              Set oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [count]->OBX->value_type
                 = oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [obxres]->OBX->value_type
              Set oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [count]->OBX->observation_id->identifier
                 = oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [obxres]->OBX->observation_id->identifier
              Set oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [count]->OBX->observation_id->text
                 = oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [obxres]->OBX->observation_id->text
              Set oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [count]->OBX->observation_id->coding_system
                 = oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [obxres]->OBX->observation_id->coding_system 
              Set oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [count]->OBX->observation_value [1]->value_1 = 
                    oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [obxres]->OBX->observation_value [1]->value_1 
              Set oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [count]->OBX->observation_value [1]->value_2 = 
                     oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [obxres]->OBX->observation_value [1]->value_2 
              Set oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [count]->OBX->observation_value [1]->value_3 = 
                     oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [obxres]->OBX->observation_value [1]->value_3 
              Set oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [count]->OBX->observation_value [1]->value_4 = 
                     oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [obxres]->OBX->observation_value [1]->value_4 
              Set oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [count]->OBX->observation_value [1]->value_5 = 
                    oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [obxres]->OBX->observation_value [1]->value_5 
               Set oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [count]->OBX->observation_res_status
                   = oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [obxres]->OBX->observation_res_status 
               Set oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [count]->OBX->user_def_access_checks 
                   = oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [obxres]->OBX->user_def_access_checks 
               Set oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [count]->OBX->observation_dt_tm
                   = oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [obxres]->OBX->observation_dt_tm
  Endif

  Set oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [obxres]->OBX->abnormal_flag [1]->abnormal_flag = ""
Endfor
Set stat=alterlist(oen_reply->RES_ORU_GROUP [1]->OBX_GROUP,count)