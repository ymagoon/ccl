;Data to add
;1) argument_count
;4.5) list type code

;3) patient list id?
;4) some type of identifier that indicates a current list execution?
;6) org security on?
;7) confid security on?

;5) description?
;2) before and after patient count

declare ACMPERFORMANCEMONITOR(execution_date = dq8, query_description = vc, num_rows = i4, execution_duration = f8, args = vc, 
arg_value = vc, pe_name = vc, pe_value = vc, argument_count = i4, list_type_cd = f8, user_id = f8) = NULL  

subroutine ACMPERFORMANCEMONITOR(execution_date, query_description, num_rows, execution_duration, args, arg_value, pe_name, 
pe_value, argument_count, list_type_cd, user_id)

	;rm /cerner/d_provide/ccluserdir/acm_performance_monitor.csv
	;rm acm_performance_monitor.csv
	declare csv_file_name = vc with constant("ACM_PERFORMANCE_MONITOR")
	declare ccluserdir_path = vc with constant(build(logical("CCLUSERDIR"), "/", csv_file_name,".csv"))
	declare header_line = vc with noconstant("execution_date, query_descrition, qualifying_patients, execution_duration,\
argument_count, arguments, argument_values, PE_Name, PE_Id, list_type_cd, user_id")
	declare col_spacer = c2 with constant(", ")
	declare val = vc with noconstant("")
	declare dt_str = vc with noconstant("")
	declare name_str = vc with noconstant("")
	declare desc_str = vc with noconstant("")
	set found = findfile(ccluserdir_path)
	
	select into value(ccluserdir_path)
	from dummyt d
	where d.seq
	
	head report
	
		if(found != 1)
			header_line, row+1
		endif
		
	detail
	
		dt_str = format(execution_date, "@SHORTDATETIME")
	
		val = concat(trim(dt_str), col_spacer, trim(query_description), col_spacer, 
			trim(cnvtstring(num_rows)), col_spacer, trim(cnvtstring(execution_duration, 11, 4)), col_spacer
			, trim(cnvtstring(argument_count)), col_spacer, trim(args), col_spacer, trim(arg_value), col_spacer, trim(pe_name), col_spacer,
			 trim(pe_value),  col_spacer, trim(cnvtstring(list_type_cd)), col_spacer, trim(cnvtstring(user_id))) 
		val
			
	with nocounter, append, format=variable, maxrow=1, formfeed=none, maxcol=512
	
end
