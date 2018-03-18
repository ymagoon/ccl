/* 	*******************************************************************************
 
	Script Name:	pfi_study_corrections.prg
	Description:	Prompt users with a form that allows them to specify the study
					correction necessary. Possible options: Timepoint, Global
					Timepoint and Collection dt/tm change. The submission gets
					written to the custom table STUDY_CORRECTION_REQUEST and read
					by the admin program pfi_study_corrections_admin.prg.
 
	Date Written:	March 17, 2015
	Written By:		Yitzhak Magoon
					Pfizer
 
	Executed from:	Explorer Menu
 
	*******************************************************************************
								REVISION INFORMATION
	*******************************************************************************
	Rev	Date		By			Comment
	---	-----------	-----------	---------------------------------------------------
 	001 4/22/15     Magoon, Yitzhak Issue when large submission is made - the request dt/tm
 									is different times for the same group_id messing up the
 									admin program
 	002 9/04/15		Magoon, Yitzhak	Issue when Collection dt/tm submission is made -
 									if an accession has more than one container, only
 									the first container is updated
 	003 9/28/16		Magoon, Yitzhak Added trim to current timepoint to eliminate issues
 									when a space is in the timepoint
	******************************************************************************* */
 
 
drop program pfi_study_corrections_v2 go
create program pfi_study_corrections_v2
 
prompt
	"Output to File/Printer/MINE" = "MINE"                       ;* Enter or select the printer or file name to send this report t
	, "Correction Type" = ""                                     ;* Please enter the type of correction
	, "Reason for Correction" = 0
	;<<hidden>>"Enter all or part of study protocol name" = ""
	, "Protocol" = 0                                             ;* Select the appropriate protocol study
	, "Select accessions to modify" = ""
	, "Current Timepoint" = ""
	, "Correct Timepoint" = ""
	, "Enter the current Collection dt/tm" = ""
	, "Enter the correct Collection dt/tm" = ""
	, "View and submit study correction request" = ""
 
with OUTDEV, correction_type, corr_reason, protocol, accessions, inc_timepoint,
	corr_timepoint, inc_collection, corr_collection, submit
 
 
record data (
	1 group_id							=	f8
	1 organization_id					=	f8
	1 accession[*]
		2 accession_id					=	f8
		2 accession_nbr					=	c20
		2 fin							=	c20
		2 subject						=	c20
		2 orders[*]
			3 order_id					=	f8
			3 orig_user_id				=	f8
		2 container[*]
			3 container_id				=	f8
			3 orig_user_id				=	f8
		2 event[*]
			3 ce_event_id				=	f8
			3 orig_user_id				=	f8
	1 correction_type					=	c15
	1 correction_reason_cd				=	f8
	1 cur_coll_dt_tm					=	dq8
	1 new_coll_dt_tm					=	dq8
	1 cur_timepoint						=	vc
	1 new_timepoint						=	vc
	1 orig_user_id						=	f8
	1 request_user_id					=	f8
	1 timepoint_err						=	i4
	1 collection_err					=	i4
	1 submit							=	vc
)
 
declare aCnt 							=	i4
declare eCnt							=	i4
declare cCnt							=	i4
declare oCnt							= 	i4
declare request_dt_tm					= 	dq8 ;001
 
set data->organization_id 				= $protocol
set data->correction_type 				= $correction_type
set data->correction_reason_cd 			= $corr_reason
set data->request_user_id 				= reqinfo->updt_id
set data->submit 						= $submit
 
;if collection change is being made timepoint rows on table are blank and visa versa
if ($correction_type = "COLLECTION")
	set data->cur_coll_dt_tm 			= cnvtdatetime($inc_collection)
	set data->new_coll_dt_tm 			= cnvtdatetime($corr_collection)
else
	set data->cur_timepoint 			= trim($inc_timepoint)
	set data->new_timepoint			 	= trim($corr_timepoint)
endif
 
/*   **************************************************************************    */
/***    Begin code for writing accession_nbrs from prompt to record structure    ***/
/*   **************************************************************************    *
 
The Reflect( ) function returns a character string in the format type length that indicates the data type of the expression.
If the expression is not found, a space is returned. The return type is a single character that indicates the data type of
the expression. The following table shows the types that can be returned:
 
L - List Indicates the expression is an item list passed as a parameter. An item list is a list of values enclosed in the Value( )
	function. If the parameter is a single item passed in the Value( ) function, the return type will be the type of the item and
	not a list.
 
The data type is combined with a length value which indicates the length of the expression.
If the expression is an item list passed as a parameter, the length is the number of items in the list.
*/
 
 ;if global request is generated this doesn't run because accession numbers are gathered in code below
if ($correction_type != "GTIMEPOINT")
	;check to see if multiple values were selected at the (5th) prompt - $accessions
	set lcheck = substring(1,1,reflect(parameter(5,0)))
	if(lcheck = "L");if multiple selections were made at the $accessions prompt
		;get the multiple values one at a time and load into record structure
		while(lcheck > " ")
			set aCnt = aCnt +1
			set lcheck = substring(1,1,reflect(parameter(5,aCnt)))
 
			if(lcheck > " ")  ;lcheck will equal " " when there are no more values in the list
 
				if(aCnt > size(data->accession,5))
					set stat = alterlist(data->accession,aCnt +4)
		    	endif
 
				set data->accession[aCnt].accession_nbr = parameter(5,aCnt) ;load the current value from the list into the record
			endif
		endwhile
 
		set stat = alterlist(data->accession, aCnt-1)
	else
		;A single value was selected at glist prompt
		set stat = alterlist(data->accession,1)
		set data->accession[1].accession_nbr = $accessions ;load the single value into the record
	endif
endif
 
/*   *********************************************************************************    */
/***    Begin code for writing order_id's from ACCESSION_ORDER_R to record structure    ***/
/*   *********************************************************************************    */
if ($correction_type != "GTIMEPOINT")
	select
	  if ($correction_type = "TIMEPOINT") ;separated so data->timepoint_err can be populated if necessary
	  	from
			accession_order_r aor
			, orders o
			, order_detail od
			, encounter e
			, encntr_alias ea
			, person_alias pa
			, (dummyt d1 with seq = value(size(data->accession,5)))
		plan d1
		join aor where aor.accession = data->accession[d1.seq].accession_nbr
		join o where aor.order_id = o.order_id
		join od where od.order_id = o.order_id
			and od.oe_field_meaning = "DCDISPLAYDAYS"
			;and od.oe_field_display_value = data->cur_timepoint							;003
			and trim(od.oe_field_display_value,3) = data->cur_timepoint						;003
		join e where e.encntr_id = o.encntr_id
		join ea where ea.encntr_id = e.encntr_id
			and ea.encntr_alias_type_cd = value(uar_get_code_by("MEANING",319,"FIN NBR"))
		join pa where pa.person_id = e.person_id
			and pa.person_alias_type_cd = value(uar_get_code_by("MEANING",4,"MRN"))
			and pa.active_ind = 1
			and pa.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
 
	  else ;if "COLLECTION"
 
		from
			accession_order_r aor
			, orders o
			, encounter e
			, encntr_alias ea
			, person_alias pa
			, (dummyt d1 with seq = value(size(data->accession,5)))
		plan d1
		join aor where aor.accession = data->accession[d1.seq].accession_nbr
		join o where aor.order_id = o.order_id
		join e where e.encntr_id = o.encntr_id
		join ea where ea.encntr_id = e.encntr_id
			and ea.encntr_alias_type_cd = value(uar_get_code_by("MEANING",319,"FIN NBR"))
		join pa where pa.person_id = e.person_id
			and pa.person_alias_type_cd = value(uar_get_code_by("MEANING",4,"MRN"))
			and pa.active_ind = 1
			and pa.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
 
 	  endif ;end
 
 	into "nl:"
 		order_id = aor.order_id
		, accession = aor.accession
		, updt_id = o.updt_id
		, person_id = e.person_id
		, subject = pa.alias
		, fin = ea.alias
 
	order by accession
 
	head accession
		oCnt = 0
 
	detail
		oCnt = oCnt + 1
 
		if (oCnt > size(data->accession[d1.seq].orders,5))
			stat = alterlist(data->accession[d1.seq].orders, oCnt + 4)
		endif
 
		data->accession[d1.seq].orders[oCnt].order_id = aor.order_id
		data->accession[d1.seq].accession_id = aor.accession_id
		data->accession[d1.seq].orders[oCnt].orig_user_id = updt_id
		data->accession[d1.seq].fin = fin
		data->accession[d1.seq].subject = subject
	foot accession
		stat = alterlist(data->accession[d1.seq].orders, oCnt)
	with nocounter
 
 	if (curqual = 0)
 		set data->timepoint_err = 1
 	endif
 
else ;global timepoint also writes accession numbers since they were not populated from prompt
	select into "nl:"
		person_id = e.person_id
		, encntr_id = e.encntr_id
		, subject = pa.alias
		, fin = ea.alias
		, order_id = o.order_id
		, encntr_id = e.encntr_id
		, orig_user_id = o.updt_id
		, order_id = o.order_id
		, accession = aor.accession
		, accession_id = aor.accession_id
		, timepoint = od.oe_field_display_value
	from
		encounter e
		, encntr_alias ea
		, person_alias pa
		, orders o
		, accession_order_r aor
		, order_detail od
 
	plan e where e.organization_id = data->organization_id
	join ea where ea.encntr_id = e.encntr_id
		and ea.active_ind = 1
		and ea.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
		and ea.encntr_alias_type_cd = value(uar_get_code_by("MEANING",319,"FIN NBR"))
	join pa where pa.person_id = e.person_id
		and pa.active_ind = 1
		and pa.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
		and pa.person_alias_type_cd = value(uar_get_code_by("MEANING",4,"MRN"))
	join o where o.encntr_id = e.encntr_id
	join od where od.order_id = o.order_id
		and od.oe_field_meaning = "DCDISPLAYDAYS"
		;and od.oe_field_display_value = data->cur_timepoint					;003
		and trim(od.oe_field_display_value,3) = data->cur_timepoint				;003
	join aor where aor.order_id = od.order_id
 
	order by
		accession
		, order_id
	head report
		aCnt = 0
	head accession
		oCnt = 0
		aCnt = aCnt + 1
		if (aCnt > size(data->accession,5))
			stat = alterlist(data->accession, aCnt + 4)
		endif
 
		data->accession[aCnt].accession_nbr = accession
		data->accession[aCnt].accession_id = accession_id
		data->accession[aCnt].fin = fin
		data->accession[aCnt].subject = subject
	detail
		oCnt = oCnt + 1
		if (oCnt > size(data->accession[aCnt].orders,5))
			stat = alterlist(data->accession[aCnt].orders, oCnt + 4)
		endif
 
		data->accession[aCnt].orders[oCnt].order_id = order_id
		data->accession[aCnt].orders[oCnt].orig_user_id = orig_user_id
	foot accession
		stat = alterlist(data->accession[aCnt].orders, oCnt)
	foot report
		stat = alterlist(data->accession, aCnt)
	with nocounter
 
	/*
	Since only one query is used for GTIMEPOINT, if the current timepoint does not
	match data->cur_timepoint then set err flag to 1 to output that in report
	*/
	if (curqual = 0)
		set data->timepoint_err = 1
	endif
 
endif
 
 
/*   ************************************************************************************    */
/***  Begin code for writing container_id's from CONTAINER_ACCESSION to record structure   ***/
/*   ************************************************************************************    */
if ($correction_type = "COLLECTION")
		select
			container = ca.container_id
			, accession = ca.accession
		from
			container_accession ca
			, container c
			, (dummyt d1 with seq = value(size(data->accession,5)))
		plan d1
		join ca where ca.accession = data->accession[d1.seq].accession_nbr
		join c where c.container_id = ca.container_id
			and c.drawn_dt_tm = cnvtdatetime(data->cur_coll_dt_tm)
		order by
			accession																		;003
			;container																		;003
 
		head accession																		;003
		;container																			;003
		;head report																		;002
			cCnt = 0
		detail
			cCnt = cCnt + 1
 
			if (cCnt > size(data->accession[d1.seq].container,5))
				stat = alterlist(data->accession[d1.seq].container, cCnt + 1)
			endif
 
			data->accession[d1.seq].container[cCnt].container_id = ca.container_id
			data->accession[d1.seq].container[cCnt].orig_user_id = c.updt_id
		foot accession																		;003
		;container																			;003
		  		stat = alterlist(data->accession[d1.seq].container, cCnt)					;002
		;foot report																		;002
		;	stat = alterlist(data->accession[d1.seq].container, cCnt)
		with nocounter
 
		if (curqual = 0)
			set data->collection_err = 1
		endif
endif
 
;call echorecord(data)
 
/*   ******************************************************************************    */
/***    Begin code for writing event_id's from CLINICAL_EVENT to record structure    ***/
/*   ******************************************************************************    */
if ($correction_type = "COLLECTION")
		select
			event_id = ce.event_id
			, accession = ce.accession_nbr
		from
			clinical_event ce
			, (dummyt d1 with seq = value(size(data->accession,5)))
		plan d1
		join ce where ce.accession_nbr = data->accession[d1.seq].accession_nbr
			and ce.event_id > 0
			and ce.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
		order by
			accession
			,event_id
 
		head accession
			eCnt = 0
		detail
			eCnt = eCnt + 1
 
			if(eCnt > size(data->accession[d1.seq].event,5))
				stat = alterlist(data->accession[d1.seq].event, eCnt + 4)
			endif
 
 			data->accession[d1.seq].event[eCnt].ce_event_id = ce.event_id
 			data->accession[d1.seq].event[eCnt].orig_user_id = ce.updt_id
		foot accession
			stat = alterlist(data->accession[d1.seq].event, eCnt)
		with nocounter
endif
 
;call echo(data->cur_coll_dt_tm)
;call echorecord(data)
 
if ($submit = "VIEW")
	go to VIEW_REPORT
endif
 
/*   ******************************************************************    */
/***    Begin code for inserting tables onto STUDY_CORRECTION_REQUEST    ***/
/*   ******************************************************************    */
if (data->collection_err = 0 and data->timepoint_err = 0)
 
	select into "nl:"
   		nextseqnum = seq(STUDY_CORRECTION_GROUP_SEQ, nextval)
	from dual
	detail
		data->group_id = cnvtreal(nextseqnum)
	with nocounter
 
 	set request_dt_tm = cnvtdatetime(curdate,curtime)													;001
 
	if ($correction_type = "COLLECTION")
 
 
	/*   ******************************************************    */
	/***    Inserting CONTAINER onto STUDY_CORRECTION_REQUEST    ***/
	/*   ******************************************************    */
		insert into study_correction_request scr
			, (dummyt d1 with seq = value(size(data->accession,5)))
			, (dummyt d2 with seq = 1)
	  	  set
	  		scr.study_correction_req_id = seq(STUDY_CORRECTION_SEQ,nextval)
			, scr.group_id 				= data->group_id
			, scr.organization_id 		= data->organization_id
			, scr.container_id 			= data->accession[d1.seq].container[d2.seq].container_id
			, scr.correction_type 		= data->correction_type
			, scr.correction_reason_cd 	= data->correction_reason_cd
			, scr.old_coll_dt_tm 		= cnvtdatetime(data->cur_coll_dt_tm)
			, scr.new_coll_dt_tm 		= cnvtdatetime(data->new_coll_dt_tm)
			, scr.orig_user_id 			= data->accession[d1.seq].container[d2.seq].orig_user_id
			, scr.request_user_id 		= data->request_user_id
			, scr.request_dt_tm			= cnvtdatetime(request_dt_tm)								;001
			, scr.updt_id 				= reqinfo->updt_id
			, scr.updt_cnt				= 0
			, scr.updt_dt_tm 			= cnvtdatetime(curdate,curtime3)
			, scr.updt_task 			= reqinfo->updt_task
			, scr.updt_applctx 			= reqinfo->updt_applctx
			, scr.active_ind			= 1
		plan d1 where maxrec(d2,size(data->accession[d1.seq].container,5))
		join d2
		join scr
 
		with nocounter
 
		commit
 
	/*   ********************************************************************************    */
	/***    Inserting CE_SPECIMEN_COLL and CLINICAL_EVENT onto STUDY_CORRECTION_REQUEST    ***/
	/*   ********************************************************************************    */
 
		insert into study_correction_request scr
			, (dummyt d1 with seq = value(size(data->accession,5)))
			, (dummyt d2 with seq = 1)
	  	  set
	  		scr.study_correction_req_id = seq(STUDY_CORRECTION_SEQ,nextval)
			, scr.group_id 				= data->group_id
			, scr.organization_id 		= data->organization_id
			, scr.event_id 				= data->accession[d1.seq].event[d2.seq].ce_event_id
			, scr.correction_type 		= data->correction_type
			, scr.correction_reason_cd 	= data->correction_reason_cd
			, scr.old_coll_dt_tm 		= cnvtdatetime(data->cur_coll_dt_tm)
			, scr.new_coll_dt_tm 		= cnvtdatetime(data->new_coll_dt_tm)
			, scr.orig_user_id 			= data->accession[d1.seq].event[d2.seq].orig_user_id
			, scr.request_user_id 		= data->request_user_id
			, scr.request_dt_tm			= cnvtdatetime(request_dt_tm)								;001
			, scr.updt_id 				= reqinfo->updt_id
			, scr.updt_cnt				= 0
			, scr.updt_dt_tm 			= cnvtdatetime(curdate,curtime3)
			, scr.updt_task 			= reqinfo->updt_task
			, scr.updt_applctx 			= reqinfo->updt_applctx
			, scr.active_ind			= 1
		plan d1 where maxrec(d2,size(data->accession[d1.seq].event,5))
		join d2
		join scr
 
		with nocounter
 
		commit
	endif ;end "COLLECTION" inserts
 
/*   ***************************************************    */
/***    Inserting ORDERS onto STUDY_CORRECTION_REQUEST    ***/
/*   ***************************************************    */
 
	insert into study_correction_request scr
		, (dummyt d1 with seq = value(size(data->accession,5)))
		, (dummyt d2 with seq = 1)
	  set
	  	scr.study_correction_req_id = seq(STUDY_CORRECTION_SEQ,nextval)
		, scr.group_id 				= data->group_id
		, scr.organization_id 		= data->organization_id
		, scr.accession_id			= data->accession[d1.seq].accession_id
		, scr.order_id				= data->accession[d1.seq].orders[d2.seq].order_id
		, scr.correction_type 		= data->correction_type
		, scr.correction_reason_cd 	= data->correction_reason_cd
		, scr.old_coll_dt_tm 		= cnvtdatetime(data->cur_coll_dt_tm)
		, scr.new_coll_dt_tm 		= cnvtdatetime(data->new_coll_dt_tm)
		, scr.old_timepoint 		= data->cur_timepoint
		, scr.new_timepoint 		= data->new_timepoint
		, scr.orig_user_id 			= data->accession[d1.seq].orders[d2.seq].orig_user_id
		, scr.request_user_id 		= data->request_user_id
		, scr.request_dt_tm			= cnvtdatetime(request_dt_tm)								;001
		, scr.updt_id 				= reqinfo->updt_id
		, scr.updt_cnt				= 0
		, scr.updt_dt_tm 			= cnvtdatetime(curdate,curtime3)
		, scr.updt_task 			= reqinfo->updt_task
		, scr.updt_applctx 			= reqinfo->updt_applctx
		, scr.active_ind			= 1
	plan d1 where maxrec(d2,size(data->accession[d1.seq].orders,5))
	join d2
	join scr
 
	with nocounter
 
	commit
endif ;end all inserts
 
call echorecord(data)
 
/*   ************************************************    */
/***    Begin Output Report for View and Submission    ***/
/*   ************************************************    */
#VIEW_REPORT
 
;email
select into "nl:"
	scr.group_id
from
	study_correction_request scr
where scr.group_id = data->group_id
	and scr.active_ind = 1
 
with nocounter
 
if (curqual > 0)
	execute pfi_study_correction_email
endif
 
execute reportrtl
%i cust_script:pfi_study_corrections2.dvl
;%i must be in the first two columns of the source code file.
;Assuming you changed the program name in your file to
;1_your_initials_add_layt_to_prg.
;set a variable to initializereport(0)
set d0 = InitializeReport(0)
 
;print date for report
set cPrintDate = format(cnvtdatetime(curdate,curtime3),"MM/DD/YYYYHH:MM;;Q")
 
set cUser = fillstring(50," ") ;user for report
select into "nl:"
	user = p.name_full_formatted
from
	prsnl p
plan p where p.person_id = reqinfo->updt_id
detail
	cUser = user
with nocounter
set cUser = trim(cUser)
 
set cProtocol = fillstring(25," ") ;protocol name for report
select into "nl:"
	protocol = o.org_name
from
	organization o
plan o where o.organization_id = data->organization_id
detail
	cProtocol = protocol
with nocounter
 
set cProtocol = trim(cProtocol)
 
 
set _fEndDetail = RptReport->m_pageWidth - RptReport->m_marginBottom
 
select
  if (data->submit = "VIEW")
  	into "nl:"
		cur_collect_dt_tm = format(data->cur_coll_dt_tm, "DD-MMM-YYYY hh:mm ;;D")
		, new_collect_dt_tm = format(data->new_coll_dt_tm, "DD-MMM-YYYY hh:mm ;;D")
		, cur_timepoint = data->cur_timepoint
		, new_timepoint = data->new_timepoint
		, accession = concat(substring(8,2,data->accession[d.seq].accession_nbr), "-", substring(10,3,data->accession[d.seq].
		accession_nbr), "-", substring(15,4,data->accession[d.seq].accession_nbr))
		, fin = data->accession[d.seq].fin
		, subject = data->accession[d.seq].subject
 
	from
		(dummyt d with seq = value(size(data->accession,5)))
	plan d
	order by
		accession
  else ;report pulls from study_correction_request as opposed to record structure
    distinct into "nl:"
  		cur_collect_dt_tm = format(scr.old_coll_dt_tm, "DD-MMM-YYYY hh:mm ;;D")
  		, new_collect_dt_tm = format(scr.new_coll_dt_tm, "DD-MMM-YYYY hh:mm ;;D")
  		, cur_timepoint = scr.old_timepoint
  		, new_timepoint = scr.new_timepoint
  		, accession = concat(substring(8,2,aor.accession), "-", substring(10,3,aor.accession), "-", substring(15,4,aor.accession))
  		, fin = ea.alias
  		, subject = pa.alias
  		, order_id = o.order_id
  	from
  		study_correction_request scr
  		, accession_order_r aor
  		, orders o
  		, encounter e
  		, encntr_alias ea
  		, person_alias pa
  	plan scr where scr.group_id = data->group_id
  	join aor where aor.accession_id = scr.accession_id
  		and scr.accession_id > 0
  	join o where o.order_id = aor.order_id
 	join e where e.encntr_id = o.encntr_id
	join ea where ea.encntr_id = e.encntr_id
		and ea.encntr_alias_type_cd = value(uar_get_code_by("MEANING",319,"FIN NBR"))
	join pa where pa.person_id = e.person_id
		and pa.person_alias_type_cd = value(uar_get_code_by("MEANING",4,"MRN"))
		and pa.active_ind = 1
		and pa.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
	order by
		accession
  endif
 
head report
	d0 = PageHeader(Rpt_Render)
head subject
 	if (data->correction_type = "COLLECTION" and data->collection_err = 0)
 		if (_Yoffset + cBody(1) + Footer(1) > _fEndDetail)
 			d0 = Footer(0)
 			Call PageBreak(0)
 			d0 = PageHeader(0)
 			d0 = cHead(0)
 		else
 			d0 = cHead(Rpt_Render)
 		endif
 	endif
 
 	if (data->correction_type != "COLLECTION" and data->timepoint_err = 0)
 		nNull = 0
 
 		if (_Yoffset + tBody(1) + Footer(1) > _fEndDetail)
 			d0 = Footer(0)
 			Call PageBreak(0)
 			d0 = PageHeader(0)
 			d0 = tHead(0)
 		else
 			d0 = tHead(Rpt_Render)
 		endif
 	endif
detail
 	if (data->correction_type = "COLLECTION" and data->collection_err = 0)
 		if (_Yoffset + cBody(1) + Footer(1) > _fEndDetail)
 			d0 = Footer(0)
 			Call PageBreak(0)
 			d0 = PageHeader(0)
 			d0 = cHead(0)
 		else
			d0 = cBody(Rpt_Render)
		endif
	endif
 
	if (data->correction_type != "COLLECTION" and data->timepoint_err = 0)
		if (_Yoffset = tBody(1) + Footer(1) > _fEndDetail)
			d0 = Footer(0)
			Call PageBreak(0)
			d0 = PageHeader(0)
			d0 = tHead(0)
		else
			d0 = tBody(Rpt_Render)
		endif
	endif
foot subject
	row + 0
foot report
	if (data->timepoint_err = 1 or data->collection_err = 1)
 		d0 = NoData(0)
 	endif
	_Yoffset = 9.5;9.22
	d0 = Footer(0)
with counter, nullreport
 
set d0 = FinalizeReport($OutDev)
 
end
go
;pfi_study_corrections "MINE", "TIMEPOINT", 4698152, 665385,
;value("000002015067000001","000002015067000002"),"D001","D003","","","SUBMIT" go
 
