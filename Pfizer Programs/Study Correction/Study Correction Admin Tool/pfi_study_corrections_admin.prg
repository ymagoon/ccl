/* 	*******************************************************************************
 
	Script Name:	pfi_study_corrections_admin.prg
	Description:	Prompt administrators with a form that allows them to review all
					of the study correction requests made by end-users with the
					pfi_study_corrections.prg program and either reject or accept them.
					Accepting them writes them to the permenant STUDY_CORRECTION table.
 
	Date Written:	March 17, 2015
	Written By:		Yitzhak Magoon
					Pfizer
 
	Executed from:	Explorer Menu
 
	*******************************************************************************
								REVISION INFORMATION
	*******************************************************************************
	Rev	Date		By			Comment
	---	-----------	-----------	---------------------------------------------------
 	001 4/22/15		Magoon, Yitzhak  Issue with large amount of rows being written for same
 									 group_id. Fixed so same date/tm gets updated for same
 									 group_id.
 	002 9/28/16		Magoon, Yithak	 Updated to trim spaces from timepoint
	******************************************************************************* */
 
 
drop program pfi_study_corrections_admin go
create program pfi_study_corrections_admin
 
prompt
	"Output to File/Printer/MINE" = "MINE"     ;* Enter or select the printer or file name to send this report to.
	, "Accept or Reject Request Number" = ""   ;* Select whether you want to accept or reject end-user correction submission
	, "Correction Number" = 0                  ;* Select the correction request you want to review and submit
	, "View and or Submit" = ""
 
with OUTDEV, run_type, group_id, submit
 
record data (
	1 qual[*]
		2 study_correction_req_id		=	f8
		2 study_correction_id			=	f8
		2 group_id						=	f8
		2 organization_id				=	f8
		2 accession_id					=	f8
		2 order_id						=	f8
		2 container_id					=	f8
		2 ce_event_id					=	f8
		2 correction_type				=	c15
		2 correction_reason_cd			=	f8
		2 cur_coll_dt_tm				=	dq8
		2 new_coll_dt_tm				=	dq8
		2 cur_timepoint					=	vc
		2 new_timepoint					=	vc
		2 orig_user_id					=	f8
		2 request_user_id				=	f8
		2 request_dt_tm					=	dq8
	1 organization_id					=	f8
	1 group_id							=	f8
	1 submit							=	vc
)
 
declare rCnt = i4
declare reject_ind = i2
declare submit_dt_tm = dq8 ;001
 
set data->group_id = $group_id
set data->submit = $submit
 
if ($run_type = "REJECT")
	set reject_ind = 1
endif
 
select into "nl:"
	scr.study_correction_req_id
	, scr.group_id
	, scr.organization_id
	, scr.accession_id
	, scr.order_id
	, scr.container_id
	, scr.event_id
	, scr.correction_type
	, scr.correction_reason_cd
	, scr.old_coll_dt_tm
	, scr.new_coll_dt_tm
	, scr.old_timepoint
	, scr.new_timepoint
	, scr.orig_user_id
	, scr.request_user_id
	, scr.request_dt_tm
 
from
	study_correction_request scr
where scr.group_id = $group_id
order by
	scr.group_id
head report
	rCnt = 0
detail
	rCnt = rCnt + 1
 
	if (rCnt > size(data->qual,5))
		stat = alterlist(data->qual, rCnt + 4)
	endif
 
	data->qual[rCnt].study_correction_id  = scr.study_correction_req_id
	data->qual[rCnt].group_id 			  = scr.group_id
	data->qual[rCnt].organization_id 	  = scr.organization_id
	data->qual[rCnt].accession_id 		  = scr.accession_id
	data->qual[rCnt].order_id 			  = scr.order_id
	data->qual[rCnt].container_id 		  = scr.container_id
	data->qual[rCnt].ce_event_id 		  = scr.event_id
	data->qual[rCnt].correction_type 	  = scr.correction_type
	data->qual[rCnt].correction_reason_cd = scr.correction_reason_cd
	data->qual[rCnt].cur_coll_dt_tm 	  = scr.old_coll_dt_tm
	data->qual[rCnt].new_coll_dt_tm 	  = scr.new_coll_dt_tm
	data->qual[rCnt].cur_timepoint 		  = trim(scr.old_timepoint)
	data->qual[rCnt].new_timepoint 		  = trim(scr.new_timepoint)
	data->qual[rCnt].orig_user_id 		  = scr.orig_user_id
	data->qual[rCnt].request_user_id 	  = scr.request_user_id
	data->qual[rCnt].request_dt_tm		  = scr.request_dt_tm
foot report
	stat = alterlist(data->qual, rCnt)
	data->organization_id = scr.organization_id
with nocounter
 
if ($submit = "VIEW")
	go to VIEW_REPORT
endif
 
;if user entered submission incorrectly admin can delete it
if ($run_type = "REJECT")
	go to DELETE_REQUEST
endif
 
/*   ***************************************************************    */
/***    Begin code for updating tables for Collection dt/tm change    ***/
/*   ***************************************************************    */
 
/*   ************************************************************    */
/***    Begin code for updating CE_SPECIMEN_COLL - table 1 of 4    ***/
/*   ************************************************************    */
update into ce_specimen_coll csc
	, (dummyt d1 with seq = value(size(data->qual,5)))
  set csc.collect_dt_tm 	= cnvtdatetime(data->qual[d1.seq].new_coll_dt_tm)
	, csc.updt_dt_tm 		= cnvtdatetime(curdate,curtime3)
	, csc.updt_id 			= reqinfo->updt_id
	, csc.updt_task 		= reqinfo->updt_task
	, csc.updt_cnt 			= csc.updt_cnt + 1
	, csc.updt_applctx 		= reqinfo->updt_applctx
plan d1
join csc where csc.event_id = data->qual[d1.seq].ce_event_id
	and csc.collect_dt_tm = cnvtdatetime(data->qual[d1.seq].cur_coll_dt_tm)
	and data->qual[d1.seq].correction_type = "COLLECTION"
	and data->qual[d1.seq].ce_event_id> 0
 
/*   ******************************************************   */
/***    Begin code for updating CONTAINER - table 2 of 4    ***/
/*   ******************************************************   */
update into container c
	, (dummyt d1 with seq = value(size(data->qual,5)))
  set c.drawn_dt_tm 	= cnvtdatetime(data->qual[d1.seq].new_coll_dt_tm)
	, c.updt_dt_tm 		= cnvtdatetime(curdate,curtime3)
	, c.updt_id 		= reqinfo->updt_id
	, c.updt_task 		= reqinfo->updt_task
	, c.updt_cnt 		= c.updt_cnt + 1
	, c.updt_applctx 	= reqinfo->updt_applctx
plan d1
join c where c.container_id = data->qual[d1.seq].container_id
	and data->qual[d1.seq].container_id > 0
	and data->qual[d1.seq].correction_type = "COLLECTION"
	and c.drawn_dt_tm = cnvtdatetime(data->qual[d1.seq].cur_coll_dt_tm)
 
/*   ***************************************************   */
/***    Begin code for updating ORDERS - table 3 of 4    ***/
/*   ***************************************************   */
update into orders o
	, (dummyt d1 with seq = value(size(data->qual,5)))
  set o.current_start_dt_tm = cnvtdatetime(data->qual[d1.seq].new_coll_dt_tm)
	, o.updt_dt_tm 			= cnvtdatetime(curdate,curtime3)
	, o.updt_id 			= reqinfo->updt_id
	, o.updt_task 			= reqinfo->updt_task
  	, o.updt_cnt 			= o.updt_cnt + 1
  	, o.updt_applctx 		= reqinfo->updt_applctx
plan d1
join o where o.order_id = data->qual[d1.seq].order_id
	and data->qual[d1.seq].order_id > 0
	and data->qual[d1.seq].correction_type = "COLLECTION"
	and o.current_start_dt_tm = cnvtdatetime(data->qual[d1.seq].cur_coll_dt_tm)
 
/*   ***********************************************************   */
/***    Begin code for updating CLINICAL_EVENT - table 4 of 4    ***/
/*   ***********************************************************   */
update into clinical_event ce
	, (dummyt d1 with seq = value(size(data->qual,5)))
  set ce.event_end_dt_tm = cnvtdatetime(data->qual[d1.seq].new_coll_dt_tm)
	, ce.updt_dt_tm = cnvtdatetime(curdate,curtime3)
	, ce.updt_id = reqinfo->updt_id
	, ce.updt_task = reqinfo->updt_task
	, ce.updt_cnt = ce.updt_cnt + 1
	, ce.updt_applctx = reqinfo->updt_applctx
plan d1
join ce where ce.event_id = data->qual[d1.seq].ce_event_id
	and data->qual[d1.seq].ce_event_id > 0
	and data->qual[d1.seq].correction_type = "COLLECTION"
	;and ce.event_end_dt_tm = cnvtdatetime(data->qual[d1.seq].cur_coll_dt_tm)
 
/*   ***************************************************************   */
/***    Begin code for updating ORDER_DETAIL for timepoint change    ***/
/*   ***************************************************************   */
update into order_detail od
	, (dummyt d1 with seq = value(size(data->qual,5)))
  set od.oe_field_display_value = data->qual[d1.seq].new_timepoint
	, od.updt_dt_tm = cnvtdatetime(curdate,curtime3)
	, od.updt_id = reqinfo->updt_id
	, od.updt_task = reqinfo->updt_task
	, od.updt_cnt = od.updt_cnt + 1
	, od.updt_applctx = reqinfo->updt_applctx
plan d1
join od where od.order_id = data->qual[d1.seq].order_id
	and od.oe_field_meaning = "DCDISPLAYDAYS"
	;and od.oe_field_display_value = data->qual[d1.seq].cur_timepoint						;003
	and trim(od.oe_field_display_value,3) = data->qual[d1.seq].cur_timepoint				;003
	and data->qual[d1.seq].correction_type != "COLLECTION"
	and data->qual[d1.seq].order_id > 0
 
/*   ********************************************************  */
/***    Begin code for updating STUDY_CORRECTION_REQUEST     ***/
/*   *******************************************************   */
update into study_correction_request scr
  set
  	scr.active_ind		= 0
	, scr.updt_dt_tm 	= cnvtdatetime(curdate,curtime3)
  	, scr.updt_id 		= reqinfo->updt_id
  	, scr.updt_task 	= reqinfo->updt_task
  	, scr.updt_cnt 		= scr.updt_cnt + 1
  	, scr.updt_applctx 	= reqinfo->updt_applctx
  where scr.group_id = $group_id
with nocounter
 
/*   *****************************************************************    */
/***    Begin code for inserting into STUDY_CORRECTION_REQUEST table    ***/
/*   *****************************************************************    */
set submit_dt_tm = cnvtdatetime(curdate,curtime)											;001
 
insert into study_correction sc
	, (dummyt d1 with seq = value(size(data->qual,5)))
 set
	sc.study_correction_req_id = data->qual[d1.seq].study_correction_id
	, sc.study_correction_id   = seq(STUDY_CORRECTION_SEQ,nextval)
	, sc.group_id 			   = data->qual[d1.seq].group_id
	, sc.organization_id	   = data->qual[d1.seq].organization_id
	, sc.accession_id		   = data->qual[d1.seq].accession_id
	, sc.order_id			   = data->qual[d1.seq].order_id
	, sc.container_id		   = data->qual[d1.seq].container_id
	, sc.event_id			   = data->qual[d1.seq].ce_event_id
	, sc.correction_type	   = data->qual[d1.seq].correction_type
	, sc.correction_reason_cd  = data->qual[d1.seq].correction_reason_cd
	, sc.old_coll_dt_tm		   = cnvtdatetime(data->qual[d1.seq].cur_coll_dt_tm)
	, sc.new_coll_dt_tm		   = cnvtdatetime(data->qual[d1.seq].new_coll_dt_tm)
	, sc.old_timepoint		   = data->qual[d1.seq].cur_timepoint
	, sc.new_timepoint		   = data->qual[d1.seq].new_timepoint
	, sc.orig_user_id		   = data->qual[d1.seq].orig_user_id
	, sc.request_user_id	   = data->qual[d1.seq].request_user_id
	, sc.request_dt_tm		   = cnvtdatetime(data->qual[d1.seq].request_dt_tm)
	, sc.admin_user_id		   = reqinfo->updt_id
	, sc.corrected_dt_tm	   = cnvtdatetime(submit_dt_tm)							;001
	, sc.updt_id 			   = reqinfo->updt_id
	, sc.updt_cnt			   = 0
	, sc.updt_dt_tm 		   = cnvtdatetime(curdate,curtime3)
	, sc.updt_task 		   	   = reqinfo->updt_task
	, sc.updt_applctx 		   = reqinfo->updt_applctx
plan d1
join sc
 
with nocounter
 
commit
 
/*   ***************************************************************    */
/***    Begin code for deleting rows from STUDY_CORRECTION_REQUEST    ***/
/*   ***************************************************************    */
#DELETE_REQUEST
;deletes incorrectly entered request
if ($run_type = "REJECT")
	delete from study_correction_request scr
		where scr.group_id = $group_id
 
	commit
endif
 
/*   ********************************************************    */
/***    Begin code for viewing report of data to be updated    ***/
/*   ********************************************************    */
#VIEW_REPORT
 
 
 
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
select distinct into "nl:"
	protocol = o.org_name
from
	organization o
plan o where o.organization_id = data->organization_id
detail
	cProtocol = protocol
with nocounter
 
set cProtocol = trim(cProtocol)
 
execute reportrtl
%i cust_script:pfi_study_corrections_admin.dvl
;%i must be in the first two columns of the source code file.
;Assuming you changed the program name in your file to
;1_your_initials_add_layt_to_prg.
;set a variable to initializereport(0)
set d0 = InitializeReport(0)
 
set _fEndDetail = RptReport->m_pageWidth - RptReport->m_marginBottom
 
select
  if (data->submit = "VIEW")
  	  distinct into "nl:"
		  cur_collect_dt_tm = format(data->qual[d.seq].cur_coll_dt_tm, "MM/DD/YY hh:mm ;;D")
		  , new_collect_dt_tm = format(data->qual[d.seq].new_coll_dt_tm, "MM/DD/YY hh:mm ;;D")
		  , cur_timepoint = data->qual[d.seq].cur_timepoint
		  , new_timepoint = data->qual[d.seq].new_timepoint
		  , accession = concat(substring(8,2,aor.accession), "-", substring(10,3,aor.accession), "-", substring(15,4,aor.accession))
		  , fin = ea.alias
		  , subject = pa.alias
		  , correction_type = data->qual[d.seq].correction_type
 
	  from
		  (dummyt d with seq = value(size(data->qual,5)))
		  , accession_order_r aor
  		  , orders o
  		  , encounter e
  		  , encntr_alias ea
  		  , person_alias pa
	  plan d
	  join aor where aor.accession_id = data->qual[d.seq].accession_id
	      and data->qual[d.seq].accession_id > 0
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
  else;if (data->submit = "SUBMIT" and reject_ind = 0)
  	  distinct into "nl:"
  		  cur_collect_dt_tm = format(sc.old_coll_dt_tm, "MM/DD/YY hh:mm ;;D")
  		  , new_collect_dt_tm = format(sc.new_coll_dt_tm, "MM/DD/YY hh:mm ;;D")
  		  , cur_timepoint = sc.old_timepoint
  		  , new_timepoint = sc.new_timepoint
  		  , accession = concat(substring(8,2,aor.accession), "-", substring(10,3,aor.accession), "-", substring(15,4,aor.accession))
  		  , fin = ea.alias
  		  , subject = pa.alias
  		  , correction_type = sc.correction_type
  	  from
  		  study_correction sc
  		  , accession_order_r aor
  		  , orders o
  		  , encounter e
  		  , encntr_alias ea
  		  , person_alias pa
  	  plan sc where sc.group_id = data->group_id
  	  join aor where aor.accession_id = sc.accession_id
  		  and sc.accession_id > 0
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
	if (reject_ind = 0 or (reject_ind = 1 and data->submit = "VIEW"))
 	if (correction_type = "COLLECTION")
 		if (_Yoffset + cHead(1) + Footer(1) > _fEndDetail)
 			d0 = Footer(0)
 			Call PageBreak(0)
 			d0 = PageHeader(0)
 			d0 = cHead(0)
 		else
 			d0 = cHead(Rpt_Render)
 		endif
 	endif
 
 
 	if (correction_type != "COLLECTION")
 		if (_Yoffset + tHead(1) + Footer(1) > _fEndDetail)
 			d0 = Footer(0)
 			Call PageBreak(0)
 			d0 = PageHeader(0)
 			d0 = tHead(0)
 		else
 			d0 = tHead(Rpt_Render)
 		endif
 	endif
 	endif
detail
	if (reject_ind = 0 or (reject_ind = 1 and data->submit = "VIEW"))
 	if (correction_type = "COLLECTION")
 		if (_Yoffset + cBody(1) + Footer(1) > _fEndDetail)
 			d0 = Footer(0)
 			Call PageBreak(0)
 			d0 = PageHeader(0)
 			d0 = cBody(0)
 		else
 			d0 = cBody(Rpt_Render)
 		endif
 	endif
 
 
 	if (correction_type != "COLLECTION")
 		if (_Yoffset + tBody(1) + Footer(1) > _fEndDetail)
 			d0 = Footer(0)
 			Call PageBreak(0)
 			d0 = PageHeader(0)
 			d0 = tHead(0)
 		else
 			d0 = tBody(Rpt_Render)
 		endif
 	endif
 	endif
foot subject
	row + 0
foot report
	if (reject_ind = 1)
		d0 = Reject(0)
	endif
 
	_Yoffset = 9.22
	d0 = Footer(0)
with counter, nullreport
 
set d0 = FinalizeReport($OutDev)
 
end
go
 
