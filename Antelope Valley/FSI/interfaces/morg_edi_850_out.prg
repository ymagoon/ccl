/*
*  ---------------------------------------------------------------------------------------------
*  Script Name:  morg_edi_850_out
*  Description:  EDI Purchase Order 850 Outbound Modify Original Starter
*  Type:  Open Engine Modify Original Script
*  ---------------------------------------------------------------------------------------------
*  Author:
*  Domain:
*  Creation Date:
*  ---------------------------------------------------------------------------------------------
*/

;execute oencpm_msglog build("************ In morg_edi_850_out ************",char(0))

;Remove empty ISA segment produced in non-BEGIN events
set oen_reply->out_msg = build(replace(oen_request->org_msg, "ISA****************>~", "", 0), char(0))

;Uncomment to enable sending carriage returns at the end of each segment
;set oen_reply->out_msg = build(replace(oen_reply->out_msg, "~", concat("~", char(13)), 0), char(0))

;execute oencpm_msglog build("************ Out morg_edi_850_out ************", char(0))