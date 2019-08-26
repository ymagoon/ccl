Set RESINTRP_var_old=build("|RESINTRP",char(13))
Set RESINTRP_var_new=build("|RESINTRP|",char(13))

Set oen_reply->out_msg=  replace(oen_request->org_msg,RESINTRP_var_old,RESINTRP_var_new,0)