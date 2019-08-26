/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  bar_morg_out
 *  Description:  Script to build ZDR segment
 *  Type:         Modify Original Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:         Peggie Hopkins
 *  Library:        OEOCF23BARBAR
 *  Creation Date:  06/28/13
 *  ---------------------------------------------------------------------------------------------
 *  Mod#  Date    Author       Description & Requestor Information
 *
 *   1:      6/28/13   P Hopkins    Script to build ZDR segment
 *  ---------------------------------------------------------------------------------------------
*/


FREE SET TMPMSG

RECORD TMPMSG
(
1 TMPTEXT = VC
1 FINALTXT=vc
)

/***required***/
SET recvmsg = Oen_request->org_msg
/***************/

DECLARE zdrseg = vc

SET TMPMSG->TMPTEXT = BUILD(TRIM(recvmsg),char(13))
   
SET msgsize = SIZE(TMPMSG->TMPTEXT,1)
execute oencpm_msglog(build("message length =  ",msgsize))


SET zdrseg =build(zdrseg,"ZDR|","|","|","|",zdrnew->sev,"|",zdrnew->rom,char(13))

execute oencpm_msglog(build("newzdr segment = ",zdrseg))

SET TMPMSG->FINALTXT = BUILD(TMPMSG->FINALTXT,TMPMSG->TMPTEXT,zdrseg)

 
SET msgsize = SIZE(TMPMSG->FINALTXT,1)
execute oencpm_msglog(build("message length =  ",msgsize))

/*************Required*******************/
SET oen_reply->out_msg = build(TMPMSG->FINALTXT,char(0))