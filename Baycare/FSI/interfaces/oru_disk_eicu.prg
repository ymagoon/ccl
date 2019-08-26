/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  oru_disk_eicu
 *  Description:  EICU Results Outbound mod orig
 *  Type:  Open Engine Modify Original Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:  B107470
 *  Domain:  p30
 *  Creation Date:  2/25/2015 16:25:50
 *  ---------------------------------------------------------------------------------------------
 */

declare msg_size = i4
set msg_size = size(trim(oen_request->org_msg,3),1)
set org_msg = oen_request->org_msg

;EXECUTE OENCPM_MSGLOG(BUILD("MESSAGE SIZE = ", msg_size, char(0)))
if(value(msg_size) = 0)
;EXECUTE OENCPM_MSGLOG(BUILD("inside IGNORE message", char(0)))
  set oen_reply->out_msg = concat("OEN_IGNORE",char(0))
  go to exit_script
else
  set oen_reply->out_msg=build(oen_request->org_msg,char(0))
endif

#exit_script