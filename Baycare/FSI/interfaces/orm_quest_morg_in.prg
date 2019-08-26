Set orc_find=build(char(13),"ORC|NW|")
set oen_request->org_msg=replace(oen_request->org_msg,orc_find,"|",0)
;set oen_reply->out_msg =build(oen_request->org_msg,char(0))

Set obr_string=build(char(13),"OBR|")
Set orc_string=build(char(13), "ORC|",char(13),"OBR|")
set oen_request->org_msg=replace(oen_request->org_msg,obr_string,orc_string,0)
set oen_reply->out_msg =build(oen_request->org_msg,char(0))