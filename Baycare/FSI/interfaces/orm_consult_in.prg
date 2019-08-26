/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  ORM_CONSULT_MODOBJ_IN
 *  Description:  mod obj for statuses back in for consults
 *  Type:  Open Engine Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:  NE13905
 *  Domain:  B30
 *  Creation Date:  03/16/09 15:18:16
 *  ---------------------------------------------------------------------------------------------
 */
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_application = "CONSULT"
;Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [1]->id_type = ""