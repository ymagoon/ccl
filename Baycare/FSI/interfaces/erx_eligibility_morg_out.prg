/*
* ssdir_mod_orig
* Modify Original Scripts for Physician Directory Interface
*
*/

set oen_reply->out_msg = 
   build(trim(replace(oen_request->org_msg, "</To>", "</To><From>mailto:BAYC_FL.ERX.dp@surescripts.com</From>" )), char(0))