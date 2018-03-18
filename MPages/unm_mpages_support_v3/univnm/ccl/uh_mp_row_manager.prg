set trace backdoor p30ins go
DROP PROGRAM uh_mp_row_manager GO
CREATE PROGRAM uh_mp_row_manager
	prompt
	   "outdev:" = "MINE"
	   ,"table:" = ""
	   ,"type:" = ""
	   ,"values" = ""
 
	with outdev,t,type,values
 
	set trace rdbdebug
 
	declare save(in_param=vc,in_param=vc,in_param=vc)=NULL with sql="UNMH.row_manager.save"
	declare resp = vc with protect, noconstant("")
	declare full_name = vc with protect, noconstant("")
	
	declare user_id = f8 with protect, noconstant(reqinfo -> updt_id)
	
	select into "NL:"
		p.name_full_formatted
	from prsnl p
	where parser("p.person_id = user_id") 
	detail
		full_name = substring(1, 20, p.name_full_formatted)
	with nocounter
 
	CALL save( $t,$type,$values,user_id,full_name)


	set resp ='{"success":true}' 
	
	set _memory_reply_string  = resp
	RETURN(resp)
 
END GO