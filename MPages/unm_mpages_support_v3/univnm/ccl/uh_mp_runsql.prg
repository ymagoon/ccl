set trace backdoor p30ins go
DROP PROGRAM uh_mp_runsql GO
CREATE PROGRAM uh_mp_runsql
prompt
	   "SQL:" = ""
 
	with sqlStr
 
	set trace rdbdebug
 
	declare js2(in_param=vc, out_param=vc)=NULL with sql="UNMH.runSQL"
 
	declare varOut = vc with protect, noconstant("")
	declare resp = cc with protect, noconstant("")
	declare id = i4 
 
	set varOut = fillstring(32000,"")
	set resp = '{"RESULT":'
	rdb  alter session set current_schema=UNMH end
	select
		nextval = SEQ(cust_sql_log_seq,NEXTVAL)
	from dual
	detail
		id = nextval
	with nocounter
    rdb  alter session set current_schema=v500 end
	call echo(id)	
	set sql_part = substring(1,4000,cnvtstring($SQLSTR))
	
	INSERT
	INTO 	UNMH.cust_sql_log c, dummyt d
	SET		c.id=id,
			c.code = sql_part
    plan D join c
	COMMIT
 
	
	
	CALL JS2 ( $SQLSTR ,  VAROUT )

	;delete from UNMH.cust_sql_log where id = id
	DELETE FROM UNMH.cust_sql_log c
		where c.id = id
	WITH  nocounter



	;hack to get around CCL's pathological need to trim spaces, even with build2
	set d = char(3)
	select into "NL:"
		select data = concat(c.data,d)
	from unmh.cust_clob_data c
	order by ordinal

	detail
		resp =  build2(resp,data)
			;call echo(resp)
	WITH check 
 
	if (size(resp,1)=0)
		set resp = '{"RESULT":"No Response from Oracle"}'
	else
		set resp = build2(resp, "}")
	endif
	
	call echo(size(resp,1))
	call echo(resp)
 	;return (resp)
	RETURN(replace(resp,d,"",0))
 
	/* if (size(varOut,1)=0)
		set varOut = '{"RESULT":"No Response from Oracle"}'
	else
		set varOut = build('{"RESULT":',trim(varOut), "}")
	endif 
	
	call echo(varOut)
 
	RETURN(varOut)
	
	*/
END GO