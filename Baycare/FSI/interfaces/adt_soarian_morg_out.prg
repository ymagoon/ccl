/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  adt_soarian_morg_out
 *  Description:  Replace delimiters in ADT messages
 *  Type:         Modify Original Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:         Hope Kaczmarczyk
 *  Creation Date:  02/21/14
 *  ---------------------------------------------------------------------------------------------
 *  Mod#  Date    Author       Description & Requestor Information
 *
 *   1:      06/10/14   H Kaczmarczyk    Script to remove \.br\ in outbound ADT messages
 *  ---------------------------------------------------------------------------------------------
*/

Set oen_request->org_msg = Replace(oen_request->org_msg, "\.br\", " " , 0)
Set oen_reply->out_msg = oen_request->org_msg