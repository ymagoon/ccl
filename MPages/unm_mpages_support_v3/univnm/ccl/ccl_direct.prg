drop program ccl_direct go
create program ccl_direct
	prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Data:" = 'CCL~mark_test~rpc~2~"MINE","1","2","3"|CCL~mark_test~rpc~3~"MINE","1","2","3"'
 
 
	with outdev, data
 
 
	declare resp = vc with protect, noconstant("")
	declare error_messages = vc with protect, noconstant("")
	declare json_output = vc with protect
	declare tcount = i4 with noconstant(1)
	declare curLine = vc with noconstant("")
	
	
	record curTrans (
		1 action = vc
		1 method = vc
		1 type = vc
		1 tid = vc
		1 data = vc
		1 message = vc
		1 where = vc
	)
 
	set resp = '['
	set curLine =piece($data,"|",tcount,"NOT_FOUND")
	set curline = replace(curline,"CCL_DIRECT_PIPE","|",0)
	while(curLine != "NOT_FOUND")
		set curTrans->action = piece(curLine,"~",1,"")
		set curTrans->method = piece(curLine,"~",2,"")
		set curTrans->type = piece(curLine,"~",3,"")
		set curTrans->tid = piece(curLine,"~",4,"")
		set curTrans->data = replace(piece(curLine,"~",5,""),"__CARET__","^",0)
		set curTrans->data = replace(curTrans->data,"CCL_DIRECT_TILDE","~",0)
		set curTrans->data = replace(curTrans->data,"__DQUOTE__",'"',0)
		
		call Parser(build2("execute ",cnvtupper(curTrans->method)," ",curTrans->data," go"))
		
		
		
		
		
		SET ERRMSG = FILLSTRING(132," ")
		
		SET ERRCODE = 1
		SET error_messages = build2("Error in ccl ",curTrans->method,CHAR(10))
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
			set curTrans->message = trim(text(error_messages))
			set curTrans->type = "exception"
			set json_output="false"
		else
			set json_output=curreturn
			if (size(json_output,1)=0)
				set json_output="false"
				call echo(reflect(curreturn))
			endif	
		endif

		
		set resp = build2(resp, build2(
			'{',
				'"action":"',curTrans->action,'",',
				'"method":"',curTrans->method,'",',
				'"type":"',curTrans->type,'",',
				'"tid":"',curTrans->tid,'",',
				'"message":"',curTrans->message,'",',
				'"data":'
		))
		set resp = build2(resp, json_output)
		set resp = build2(resp, "}")
		
		set tcount =tcount +1
		set curLine =piece($data,"|",tcount,"NOT_FOUND")
		
		if (curline != "NOT_FOUND")
			set resp = build2(resp, ",")
		endif
	endwhile
	
	
	set resp = concat(resp, "]")
 
	;set magic output variable
	set _memory_reply_string = resp
	
	return(resp)
end
go
