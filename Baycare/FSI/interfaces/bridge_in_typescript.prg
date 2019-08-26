 /*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  bridge_in_typescript
 *  Description:  Used for Inbound Bridge message types
 *  Type:         Type Script
 *  ---------------------------------------------------------------------------------------------
 *  Mod#   Date	        Author                 Description & Requestor Information
 *
 *   1:      01/11/2018 H Kaczmarczyk  Copy and modification of si_pyxis_in_typescript
 *
 ************************************************************************
 */                                                                      


declare foundbts=i4

set foundbts = findstring("|BTS^O31|",oen_request->org_msg,1)
execute oencpm_MsgLog build("Found BTS=", foundbts, char(0))

if (foundbts)
  set oen_reply->type = concat("BTS", char(0))
  set oen_reply->trigger = concat("O31", char(0))
else
  set oen_reply->type = concat("ORU", char(0))
  set oen_reply->trigger = concat("R01", char(0))
endif