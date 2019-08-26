/*
*  ---------------------------------------------------------------------------------------------
*  Cerner Script Name:  morg_amblc_esi_in
*  Description:  Modify Original Script for Amb LabCorp Result Msgs Intbound Cleanup
*  Type:  Open Engine Modify Original Script
*  ---------------------------------------------------------------------------------------------
*  Author:  Cerner FSI
*  Domain:  All
* Create Date: July 2016
*  ---------------------------------------------------------------------------------------------
*
*  Mod#   Date	        Author                 Description & Requestor Information
 *
 *  1:    08/22/16	  H Kaczmarczyk    RFC # 13591 Result Modification w/ Orders outbound to LabCorp
*/

execute oencpm_msglog build("morg_ambquest_esi_in...", char(0))

Set oen_reply->out_msg = concat(oen_request->org_msg, char(0))

execute oencpm_msglog build("morg_ambquest_esi_in...", char(0))