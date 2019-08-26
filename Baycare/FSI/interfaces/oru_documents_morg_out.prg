/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  oru_hie_morg_out
 *  Description:  Replace/Remove Special Characters from DynDoc 
 *  Type:         Modify Original Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:         Tony McArtor
 *  Creation Date:  12/10/15
 *  ---------------------------------------------------------------------------------------------
 *  Mod#  Date    Author       Description & Requestor Information
 *
 *   1:      12/10/15   T McArtor        Script to remove "Â" in outbound ORU messages
 *  ---------------------------------------------------------------------------------------------
*/

;Set oen_request->org_msg = Replace(oen_request->org_msg, "Â", "" , 0)
Set oen_request->org_msg = Replace(oen_request->org_msg, (char(194)), "" , 0)
Set oen_request->org_msg = Replace(oen_request->org_msg, (char(195)), "" , 0)
Set oen_request->org_msg = Replace(oen_request->org_msg, (char(160)), "" , 0)
Set oen_request->org_msg = Replace(oen_request->org_msg, (char(176)), "Deg" , 0)
Set oen_request->org_msg = Replace(oen_request->org_msg, (char(151)), "" , 0)
Set oen_reply->out_msg = oen_request->org_msg