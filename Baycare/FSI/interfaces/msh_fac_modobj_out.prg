/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  msh_fac_modobj_out
 *  Description:  Common script is executed from within other modobj scripts to set facility code in MSH:5
 *  Type:         Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Mod#Date		Author		Description & Requestor Information
 *        12/28/2016 	DOlszewski	- Cleaned up Script
 *  ---------------------------------------------------------------------------------------------
*/

/*** Set MSH to patient's assigned building***/							
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = 
oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->building 

/*** Outreach locations set to main facility in MSH 5 ***/
IF 
(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->patient_type = "JHOUTREACH")
  Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = "SJH"
ELSEIF 
       (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->patient_type = "WOOUTREACH")
          Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = "WHH"
ELSEIF  
             (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->patient_type = "MPOUTREACH") 
                Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = "MPH"
Endif