/* 	*******************************************************************************
 
	Script Name:	pfi_study_corrections_admin.prg
	Description:	Prompt administrators with a form that allows them to review all
					of the study correction requests made by end-users with the
					pfi_study_corrections.prg program and either reject or accept them.
					Accepting them writes them to the permenant STUDY_CORRECTION table.
 
	Date Written:	October 16, 2015
	Written By:		Yitzhak Magoon
					Pfizer
 
	Executed from:	Explorer Menu
 
	**************************************************************************************
							    	REVISION INFORMATION
	***************************************************************************************
	Rev	Date		By				    Comment
	---	-----------	---------------		---------------------------------------------------
 	001 10/16/15	Magoon, Yitzhak     Initial Release
 	002 01/06/17    Magoon, Yitzhak		Add filter for order date/time because when orders
 										placed via interface, there is no collection dt/tm
 										so current filter does not work.
	************************************************************************************* */
 
 
drop program pfi_pristima_print_labels_v2 go
create program pfi_pristima_print_labels_v2
 
prompt
	"Output to File/Printer/MINE" = "MINE"                                      ;* Enter or select the printer or file name to sen
	, "Select the Output Destination" = 0
	;<<hidden>>"Enter all or part of the study protocol name" = ""
	, "Select the protocol" = 0
	, "Print all labels for protocol?" = 0
	, "Filter by timepoint(s)" = 0
	, "Select timepoint(s) to print" = ""
	, "Filter by specimen type" = 0
	, "Select specimen type to print" = 0
	, "Apply a date range to the query? (date orders placed)" = 0               ;* The date range is to be used when the samples h
	, "Enter the expected date range" = "SYSDATE"                               ;* The date range is to be used when the samples h
	, "" = "SYSDATE"                                                            ;* The date range is to be used when the samples h
	, "Apply an expected date range to the query? (scheduled collection)" = 0   ;* The date range is to be used BEFORE the samples
	, "Enter the expected date range" = "SYSDATE"                               ;* The date range is to be used BEFORE the samples
	, "" = "SYSDATE"                                                            ;* The date range is to be used BEFORE the samples
 
with OUTDEV, outputdest, protocol, print_all, print_timepoint, timepoint,
	print_coll_type, coll_type, dt_tm_chk, beg_dt_tm, end_dt_tm, exp_dt_tm_chk, exp_beg_dt_tm,
	exp_end_dt_tm
 
free record requestin265072
free record accessions
 
record requestin265072 (
  1 accession					= vc
  1 output_dest_cd				= f8
  1 output_name					= vc
  1 label_type_flag				= i2
)
 
record accessions (
  1 qual[*]
    2 accession_unformatted		= c20
    2 accession_id				= f8
    2 timepoint					= c12
)
 
declare prev_accn				= f8  with noconstant(0.0)
declare aCnt					= i2  with noconstant(0)
declare idx						= i2  with noconstant(0)
 
;populate accessions record structure depending on prompts
select if
  ($print_all = 1)
    accession = aor.accession
    , accession_id = aor.accession_id
    , timepoint = od.oe_field_display_value
   ; , sort = substring(1,1,od.oe_field_display_value)
  from
    organization org
    , encounter e
    , orders o
    , accession_order_r aor
    , order_detail od
    , container_accession ca
    , container c
  plan org
    where org.organization_id = $protocol
 
  join e
    where e.organization_id = org.organization_id
 
  join o
    where o.encntr_id = e.encntr_id
      and (($exp_dt_tm_chk = 1 and o.current_start_dt_tm between cnvtdatetime($exp_beg_dt_tm) and cnvtdatetime($exp_end_dt_tm))
        or ($exp_dt_tm_chk = 0 and 1=1))
  join aor
    where aor.order_id = o.order_id
 
  join od
    where od.order_id = aor.order_id
      and od.oe_field_id = 12785
      and od.oe_field_meaning = "DCDISPLAYDAYS"
 
  join ca
    where ca.accession_id = aor.accession_id
 
  join c
    where c.container_id = ca.container_id
      ;and c.drawn_dt_tm between cnvtdatetime($beg_dt_tm) and cnvtdatetime($end_dt_tm)
      and (($dt_tm_chk = 1 and c.drawn_dt_tm between cnvtdatetime($beg_dt_tm) and cnvtdatetime($end_dt_tm))
        or ($dt_tm_chk = 0 and 1=1))
  order by
    timepoint
    , accession
 
  detail
    if (prev_accn != aor.accession_id)
      aCnt = aCnt + 1
 
      if (aCnt > size(accessions->qual,5))
        stat = alterlist(accessions->qual,aCnt + 9)
      endif
 
      accessions->qual[aCnt].accession_id = aor.accession_id
      accessions->qual[aCnt].accession_unformatted = aor.accession
      accessions->qual[aCnt].timepoint = od.oe_field_display_value
    endif
 
    prev_accn = aor.accession_id
  foot report
    stat = alterlist(accessions->qual,aCnt)
  with nocounter
else ;if ($print_timepoint = 1 and or $print_coll_type = 1)
    accession = aor.accession
    , accession_id = aor.accession_id
    , timepoint = od.oe_field_display_value
  from
    order_detail od
    , orders o
    , encounter e
    , organization org
    , accession_order_r aor
    , container_accession ca
    , container c
  plan od
    where od.oe_field_id = 12785
 	  and od.oe_field_meaning = "DCDISPLAYDAYS"
      and (($print_timepoint = 1 and od.oe_field_display_value = $timepoint)
        or ($print_timepoint = 0 and 1=1))
 
  join o
    where o.order_id = od.order_id
      ;002
      and (($exp_dt_tm_chk = 1 and o.current_start_dt_tm between cnvtdatetime($exp_beg_dt_tm) and cnvtdatetime($exp_end_dt_tm))
        or ($exp_dt_tm_chk = 0 and 1=1))
      ;end 002
  join e
    where e.encntr_id = o.encntr_id
 
  join org
    where org.organization_id = e.organization_id
      and org.organization_id = $protocol
 
  join aor
    where aor.order_id = o.order_id
 
  join ca
    where ca.accession_id = aor.accession_id
 
  join c
    where c.container_id = ca.container_id
      and (($print_coll_type = 1 and c.coll_class_cd = $coll_type)
        or ($print_coll_type = 0 and 1=1))
       ;and c.drawn_dt_tm between cnvtdatetime($beg_dt_tm) and cnvtdatetime($end_dt_tm)
      and (($dt_tm_chk = 1 and c.drawn_dt_tm between cnvtdatetime($beg_dt_tm) and cnvtdatetime($end_dt_tm))
       or ($dt_tm_chk = 0 and 1=1))
 
  order by
    accession
    , timepoint
 
 
  detail
    if (prev_accn != aor.accession_id)
      aCnt = aCnt + 1
 
      if (aCnt > size(accessions->qual,5))
        stat = alterlist(accessions->qual,aCnt + 9)
      endif
 
      accessions->qual[aCnt].accession_id = aor.accession_id
      accessions->qual[aCnt].accession_unformatted = aor.accession
      accessions->qual[aCnt].timepoint = od.oe_field_display_value
    endif
 
    prev_accn = aor.accession_id
  foot report
    stat = alterlist(accessions->qual,aCnt)
  with nocounter
endif
 
call echorecord (accessions)
 
set requestin265072->output_dest_cd = value($outputdest) ;603837
set requestin265072->output_name = ""
set requestin265072->label_type_flag = 1
 
 
for (idx = 1 to size(accessions->qual,5))
  free record reply265072
  set requestin265072->accession = accessions->qual[idx].accession_unformatted
  set stat = tdbexecute(274973, 273019, 265072, "REC", requestin265072, "REC", reply265072)
 
  set stat = tdbexecute(274973, 273019, 265084, "REC", reply265072, "REC", reply265084)
  call echo (build2("accession#",idx,"=",accessions->qual[idx].accession_unformatted))
  ;call echorecord (reply265072)
endfor
 
call echorecord (requestin265072)
call echorecord (reply265072)
call echorecord(reply265084)
 
end
go
 
