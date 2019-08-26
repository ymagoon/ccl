/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  msgctrl_trim_out
 *  Description:  Child Script to trip MSH;10 outbound
 *  Type:         Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:         Tami Dillon
 *  Library:        OEOCF23ORUORU
 *  Creation Date:  5/25/11
 *  ---------------------------------------------------------------------------------------------
 *  Mod#  Date    Author       Description & Requestor Information
 *
 *  1:      XX/XX/XX	XX	XXXXXXXXXX
 *  ---------------------------------------------------------------------------------------------
*/

Set oen_reply->CONTROL_GROUP [1]->MSH [1]->message_ctrl_id->ctrl_id1 = 
     substring (1, 20, oen_reply->CONTROL_GROUP [1]->MSH [1]->message_ctrl_id->ctrl_id1)