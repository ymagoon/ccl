/*
 *  ---------------------------------------------------------------------------\
------------------
 *  Script Name:  si_pyxis_packager_ModOrig
 *  Description:  outbound mod orig for Pyxis/Packager
 *  Type:  Open Engine Modify Original Script
 *  ---------------------------------------------------------------------------\
------------------
 *  Author:  SKOBEL -- copied from si_pyxis_mod_orig, and modified
 *  Domain:  PROD
 *  Creation Date:  11/29/05 12:44:16
 *  Included in PROD on 12-8-2005 by JWS
 *  ---------------------------------------------------------------------------\
------------------
 */

set msg = trim(oen_request->org_msg,1)
set msg_out = build(msg, char(13), trim(ZRC->string,1), char(13))

set oen_reply->out_msg = build(trim(msg_out,1),char(0))
set oen_reply->out_msg = replace(oen_reply->out_msg, "~^", "^", 0)