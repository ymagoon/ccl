/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  oru_endo_in
 *  Description:  Mod object script for Endoscopy results inbound to Cerner
 *  Type:  Open Engine Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:  NE11881 Rick Quackenbush
 *  Domain:  M30
 *  Creation Date:  04/20/10
 *  ---------------------------------------------------------------------------------------------
 *  Mod#  Date    Author       Description & Requestor Information
 *
 *  1:      11/29/10  R Quack    Modified to hard code MDOC in obr;24
 *  2 	8/1/17	 J Starke	adding system logic so provation can use same feed
 *  ---------------------------------------------------------------------------------------------
 */

;;Feed shared by endoworks and provation
Set sending_sys = oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_application

;;;;;For endoworks
;;;;;This logic is to set OBR;4.1 equal to "NOTEID" so it will file under the operative reports section in the ESH 
;;;;;where operative reports has an alias of "NOTEID" on cs 72
IF (sending_sys = "ENDOWORKS")
  Set oen_reply->RES_ORU_GROUP [1]->OBR [1]->univ_service_id [1]->identifier = "NOTEID"
  ;;;;;This logic is to set OBX;3.2 equal to the alias "Operative Report" for every OBX segment in the message  
  Declare obs_var = i4
  Set obs_var = size (oen_reply->RES_ORU_GROUP [1]->OBX_GROUP, 5)
  For (sw = 1 to obs_var)
    Set oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [sw]->OBX->observation_id->text = "Operative Report"
  Endfor  
ENDIF

;;;;;This logic is to set OBR;24 equal to "MDOC" as an alias to cs 53 to create an MDOC parent clinical_event row
Set oen_reply->RES_ORU_GROUP [1]->OBR->diag_serv_sec_id = "MDOC"