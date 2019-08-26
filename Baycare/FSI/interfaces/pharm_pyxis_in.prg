/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  si_pyxis_mobj_in
 *  Description: Used for SI_Pyxis_Inbound Interface
 *  Type:         Open Engine Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:         R Quack
 *  Library:        ADTADT
 *  Creation Date:  04/13/11
 *  ---------------------------------------------------------------------------------------------
 *  Mod# Date    Author   Description & Requestor Information
 *
 *  ---------------------------------------------------------------------------------------------
*/

; Initialize Route field for load balancing algorithm.
; For the ZPM/QRY data, this is what we'll use (and override in the route script)
; For DFT data, we'll use "last name" to route, copied into this field
;execute oencpm_msglog(build(oen_reply->CONTROL_GROUP[1]->MSH[1]->message_type->messg_trigger,char(0)))
;execute oencpm_msglog(build(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_name [1]->last_name,char(0)))

if (trim(oen_reply->CONTROL_GROUP[1]->MSH[1]->message_type->messg_type) in ("ZPM", "QRY" ))

Set oen_reply->cerner->stringList [1]->strVal = "PXROUTE"

elseif (trim(oen_reply->CONTROL_GROUP[1]->MSH[1]->message_type->messg_type) = "DFT")

Set oen_reply->cerner->stringList [1]->strVal =
     oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_name [1]->last_name

endif