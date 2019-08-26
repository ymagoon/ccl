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

; On OB, modobj is first, then modorig
; the whole script is from Cerner (Stony Brook) except the last section--added by J Rachael

declare foundqry=i4

; Standardl for Pyxis//Robots/Talyst - for QRY msgs only, changing |ETR to |ETO 

set foundqry = findstring("|QRY^Q02|",oen_reply->out_msg,1)
if (foundqry)
  set oen_reply->out_msg = concat(replace(oen_request->org_msg, "|ETO","|ETR",0), char(0))
else
  set oen_reply->out_msg = concat(oen_request->org_msg, char(0))
endif
; create the Z-segment needed for Packager -- ZRC.     ; SK2402 9/30/05

set zrc_size = size(zrc->string,1)
execute oencpm_msglog(build("ZRC_SIZE:",zrc_size,char(0)))
Declare msg = vc
SET ORIG_MSGSIZE = SIZE(OEN_REQUEST->ORG_MSG,1)
EXECUTE OENCPM_MSGLOG(BUILD("ORG_MSG: ", ORIG_MSGSIZE,CHAR(0)))

Set msg = trim(oen_request->org_msg,1)

SET TRIM_MSGSIZE = SIZE(MSG,1)
EXECUTE OENCPM_MSGLOG(BUILD("TRIM_MSG: ", TRIM_MSGSIZE,CHAR(0)))

SET msg_out =build(msg,CHAR(13),trim(ZRC->string,1), CHAR(13))




; Talyst cannot handle repeators so we are replacing tildes with karat thru out msg
; custom mod by J Rachael during Mar-April 2010 implementation

SET oen_reply->out_msg =build(trim(msg_out,1),char(0))
Set oen_reply->out_msg = Replace(oen_reply->out_msg, "~^", "^", 0)