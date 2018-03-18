drop program shared_get_app_list go
create program shared_get_app_list
 
	prompt
		"Output to File/Printer/MINE" = "MINE"
		, "App name:" = "ALL"
		
	with outdev, app_name
	 
	FREE RECORD	data
	RECORD data (
		1 apps [*]
			2 app_name				=	vc
			2 display_name			=	vc
			2 is_portlet			=	i1
		
	) 
	declare resp = vc with protect, noconstant("")
	
	 
	select into "NL:"
		select 
			app_name = a.app_name,
			display_name = a.display_name,
			is_portlet = a.is_portlet
	from unmh.cust_applications a
	where $app_name ="ALL" or app_name =$app_name
	HEAD REPORT
		STAT = ALTERLIST(data->apps,20)
		cur_row=0
	
	DETAIL
		cur_row=cur_row+1
		
		IF (MOD(cur_row,20) = 1 AND cur_row > 20)
			STAT = ALTERLIST(data->apps,20)
		ENDIF
		
		
		
		data->apps[cur_row].app_name = app_name
		data->apps[cur_row].display_name = display_name
		data->apps[cur_row].is_portlet = is_portlet
		
		
	FOOT REPORT
		STAT = ALTERLIST(data->apps,cur_row)
	
	set resp = cnvtrectojson(data)
	
	
	 
	record putREQUEST (
	  1 source_dir = vc
	  1 source_filename = vc
	  1 nbrlines = i4
	  1 line [*]
		2 lineData = vc
	  1 OverFlowPage [*]
		2 ofr_qual [*]
		  3 ofr_line = vc
	  1 IsBlob = c1
	  1 document_size = i4
	  1 document = gvc
	)
	 
	set putRequest->source_dir = $outdev
	set putRequest->IsBlob = "1"
	set putRequest->document = resp
	set putRequest->document_size = size(putRequest->document)
	 
	execute eks_put_source with replace(Request,putRequest),replace(reply,putReply)
	
	return (resp)

end
go