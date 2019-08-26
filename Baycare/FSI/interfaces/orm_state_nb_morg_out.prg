/***************************************************************************************
 **  Script Name:  orm_state_nb_modorig_out 
*  Type:  Open Engine Modify Original Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:  CERNER                                       	**
 ***************************************************************************************/
/***********************************************************************************
 *  Mod#   Date	        Author                 Description & Requestor Information
 *
 *  1:  07/27/2016   S Parimi               CAB # 8966 implementation of Newborn Screening Orders to State  
***********************************************************************************/

execute oencpm_msglog(build("Beginning of NK1 build. mod-orig script", char(0)))

DECLARE HL7_MSG = VC
DECLARE GT1_STRING = VC
DECLARE NK1_STRING = VC

SET HL7_MSG = OEN_REQUEST->ORG_MSG
SET GT1_STRING = BUILD (CHAR (13 ) ,"GT1|NK1" )
SET NK1_STRING = BUILD (CHAR (13 ) ,"NK1|1" )
SET HL7_MSG = REPLACE (HL7_MSG ,GT1_STRING ,NK1_STRING ,0 )
SET OEN_REPLY->OUT_MSG = HL7_MSG
SET OEN_REPLY->OUT_MSG = BUILD (HL7_MSG ,CHAR (0 ) )



/*
record temp
(
 1 msg =vc
)
set temp->msg = replace(oen_request->org_msg,concat(char(13),"ZCT|"),concat(char(13),"ZNY|"),0)
set oen_reply->out_msg = build(temp->msg,char(0))
*/


execute oencpm_msglog(build("End of NK1 build. mod-orig script", char(0)))