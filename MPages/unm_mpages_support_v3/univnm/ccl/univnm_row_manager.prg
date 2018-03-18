set trace backdoor p30ins go
DROP PROGRAM univnm_row_manager GO
CREATE PROGRAM univnm_row_manager
	prompt
	   "outdev:" = "MINE"
	   ,"table:" = ""
	   ,"type:" = ""
	   ,"values" = ""
 
	with outdev,t,type,values
 
	set trace rdbdebug
 
	declare save(in_param=vc,in_param=vc,in_param=vc,in_param=f8,in_param=vc)=NULL with sql="UNMH.univnm.save"
	declare resp = vc with protect, noconstant("")
	declare full_name = vc with protect, noconstant("")
	
	declare user_id = f8 with protect, noconstant(reqinfo -> updt_id)
	
	declare error_messages = vc with protect, noconstant("")
	
	select into "NL:"
		p.name_full_formatted
	from prsnl p
	where parser("p.person_id = user_id") 
	detail
		full_name = substring(1, 20, p.name_full_formatted)
	with nocounter
 
	CALL save( $t,$type,$values,user_id,full_name)

	if ($type = 'set')
		; Hack to get around CCL's pathological need to trim spaces, even with build2
		; This adds a (NUL) character to the end of each block retrieved, which
		; CCL does not interpret as white space. Then once the response is built up,
		; the NUL chars are stripped
		set d = char(0);(NUL)
		
		select into "NL:"
			select data = concat(c.data,d) ; add the NUL char
		from unmh.cust_clob_data c
		order by ordinal
	
		detail
			resp =  build2(resp,data)
		WITH check 
	 
		if (size(resp,1)>0)
			; strip NUL chars before returning
			set resp =trim(replace(resp,d,"",0),1)
		else 
			set resp = '[]'
		endif
	endif 
	
	
	SET ERRMSG = FILLSTRING(132," ")
		
		SET ERRCODE = 1
		SET error_messages = build2("Error")
		set hadError = false
		WHILE (ERRCODE != 0)
			SET ERRCODE = ERROR(ERRMSG,0)  ;don't reset error queue
			if (ERRCODE !=0)
				set hadError = true
				
				set error_messages = build2(error_messages, trim(text(ERRMSG)),"\n")
				set error_messages = replace(error_messages,'"',"'",0)
				set error_messages = replace(error_messages,char(10),"\n",0)
				;set error_messages = tmp
			endif
		ENDWHILE
		
		if (hadError = true )
			set _memory_reply_string = error_messages		
		else
			set _memory_reply_string = resp
		endif
 	
	
	
	RETURN(resp)
 
END GO