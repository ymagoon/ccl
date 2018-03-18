set trace backdoor p30ins go
DROP PROGRAM univnm_query_to_json GO
CREATE PROGRAM univnm_query_to_json
prompt
	"SQL:" = ""
 
	with sqlStr
	
	declare q2j(in_param=vc,in_param=f8,in_param=vc)=NULL with sql="UNMH.univnm.to_json"
 
	declare resp = cc with protect, noconstant(' ')
	declare full_name = vc with protect, noconstant("")
	declare user_id = f8 with protect, noconstant(reqinfo -> updt_id)
	
	select into "NL:"
		p.name_full_formatted
	from prsnl p
	where parser("p.person_id = user_id") 
	detail
		full_name = substring(1, 20, p.name_full_formatted)
	with nocounter
	
	;output is stored in cust_clob_data (global temp table), 
	;and only visible to this session
	CALL q2j($SQLSTR,user_id,full_name)

	; Hack to get around CCL's pathological need to trim spaces, even with build2
	; This adds a (ETX) character to the end of each block retrieved, which
	; CCL does not interpret as white space. Then once the response is built up,
	; the ETX chars are stripped
	set d = char(3);(ETX - End  of Text)
	
	select into "NL:"
		select data = concat(c.data,d) ; add the ETX char
	from unmh.cust_clob_data c
	order by ordinal

	detail
		resp =  build2(resp,data)
	WITH check 
 
	if (size(resp,1)=0)
		set resp = '"No Response from Oracle"'
	endif
	
	
 	; strip ETX chars before returning
	set _memory_reply_string =trim(replace(resp,d,"",0),1)
 
END GO