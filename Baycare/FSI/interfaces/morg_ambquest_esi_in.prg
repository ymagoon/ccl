/*
* Author: Cerner Corporation
 *  ---------------------------------------------------------------------------------------------
 *  Mod#   Date	        Author          Description & Requestor Information
 *
 *   1:      11/21/2016   S Parimi       New script added on ESI server RFC # 15124 for Quest interface changes server
 *  ---------------------------------------------------------------------------------------------
*/

execute oencpm_msglog build("morg_ambquest_esi_in...", char(0))

Set oen_reply->out_msg = concat(oen_request->org_msg, char(0))

execute oencpm_msglog build("morg_ambquest_esi_in...", char(0))