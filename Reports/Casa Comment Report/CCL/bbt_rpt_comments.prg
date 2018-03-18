/*~BB~************************************************************************
  *                                                                          *
  *  Copyright Notice:  (c) 1983 Laboratory Information Systems &            *
  *                              Technology, Inc.                            *
  *       Revision      (c) 1984-2004 Cerner Corporation                     *
  *                                                                          *
  *  Cerner (R) Proprietary Rights Notice:  All rights reserved.             *
  *  This material contains the valuable properties and trade secrets of     *
  *  Cerner Corporation of Kansas City, Missouri, United States of           *
  *  America (Cerner), embodying substantial creative efforts and            *
  *  confidential information, ideas and expressions, no part of which       *
  *  may be reproduced or transmitted in any form or by any means, or        *
  *  retained in any storage or retrieval system without the express         *
  *  written permission of Cerner.                                           *
  *                                                                          *
  *  Cerner is a registered mark of Cerner Corporation.                      *
  *                                                                          *
  ~BE~***********************************************************************/
/*****************************************************************************
 
        Source file name:       bbt_rpt_comments.prg
        Object name:            bbt_rpt_comments
        Request #:
 
        Product:                Pathnet
        Product Team:           Blood Bank Transfusion
        HNA Version:            500
        CCL Version:            1.0
 
        Program purpose:        Print order, result, product and Blood Bank comments
 
        Tables read:            person, orders, order_comment, accession_order_r, long_text, prsnl
 
        Tables updated:         None
 
        Executing from:
 
        Special Notes:          ??
***********************************************************************************/
;~DB~*******************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG                     *
;    *******************************************************************************
;    *                                                                             *
;    * v  Mod Date     Engineer             Comment                                *
;    *--- -------- -------------------- --------------------------------------     *
;     000 08/26/13   Yitzhak Magoon     Initial Release                            *
 
;~DE~*******************************************************************************
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ***************************
 
/****************************************************************
* Prompt Storage                                                *
****************************************************************/
 
drop program bbt_rpt_comments go
create program bbt_rpt_comments
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Begin Date/Time" = "SYSDATE"          ;* Enter Beginning Date and Time
	, "End Date/Time" = "SYSDATE"            ;* Enter Ending Date and Time
	, "Comment Type" = 0                     ;* Select Comment Report to Run
 
with OUTDEV, beg_dt_tm, end_dt_tm, cmt_type
 
 
record prompts
(
  ;1  activity_type_cd         = f8 future development
  ;1  address_location_cd      = f8 future development
  1  beg_dt_tm                = di8
  1  comment_type         	  = f8
  ;1  cur_inv_area_cd          = f8 future development
  ;1  cur_owner_area_cd        = f8 future development
  1  end_dt_tm                = di8
  ;1  facility_cd              = f8 future development
  ;1  order_dt_tm              = di8 future development
  ;1  order_mnemonic           = vc future development
  ;1  pat_name                 = vc future development
  ;1  result_dt_tm             = di8 future development
  ;1  result_mnemonic          = vc future development
  ;1  svs_resource_cd          = f8 future development
 
)
 
 
record ord_data
(
  1 qual[*]
  	 2 person_name			   = vc
  	 2 accession_nbr		   = vc
  	 2 dept_name			   = vc
  	 2 text_result			   = vc
  	 2 username				   = vc
  	 2 updt_dt_tm			   = dq8
  	 2 comment_type_cd		   = vc
  1 nbr_comments			   = i4
  1 nbr_notes				   = i4
  1 nbr_cmt_tot				   = i4
)
 
record rslt_data
(
  1 qual[*]
     2 result_id 			   = f8
     2 catalog_cd	  	   	   = vc
     2 task_assay_cd 		   = vc
     2 accession_nbr		   = vc
     ;2 service_resource_cd 	   = f8
    ; 2 result_status_cd 	   = f8
     2 comment_type_cd		   = vc
     2 text_result 			   = vc
     2 updt_dt_tm			   = dq8
     2 username 			   = vc
  1 nbr_comments			   = i4
  1 nbr_notes				   = i4
  1 nbr_cmt_tot				   = i4
)
 
record prod_data
(
  1 qual[*]
  	 2 product_cd			   = vc
  	 2 product_nbr 			   = vc
  	 2 product_sub_nbr		   = vc
  	 2 event_type_cd		   = vc
  	 2 text_result			   = vc
  	 2 username				   = vc
  	 2 updt_dt_tm			   = dq8
  1 nbr_cmt_tot				   = i4
 
)
 
record bb_data
(
  1 qual[*]
  	 2 person_name			   = vc
  	 2 alias				   = vc
  	 2 text_result			   = vc
  	 2 username				   = vc
  	 2 updt_dt_tm			   = vc
  1 nbr_cmt_tot				   = i4
)
 
record reply
        (
          1 rpt_list[*]
             2 rpt_filename  = vc
%i cclsource:status_block.inc
        )
 
/*****************************************************************************
* Internationalization                                                       *
*****************************************************************************/
 
%i cclsource:i18n_uar.inc
%i ccluserdir:sc_cps_word_wrap.inc
 
set i18nHandle = 0
set h = uar_i18nlocalizationinit(i18nHandle, curprog, "", curcclrev)
 
/* Internationalization is the conversion of information written in english to another language assuming
 * that the there is a translation file being used.
 *
 * The captions record structure stores all of the hard coded values
 * for the data field captions.
 *
 * Setting each item of the record structure to a hard coded value passed to the uar_i18ngetmessage
 * function ensures the data is translated correctly.
*/
 
record captions
(
  1  accession_nbr       = vc ;"Accession Nbr"
  1  as_of_date          = vc ;"As of Date:"
  1  bb_owner            = vc ;"Blood Bank Owner: "
  1  bb_title            = vc ;"BLOOD BANK COMMENT REPORT"
  1  beg_date            = vc ;"Beginning Date:"
  1  comment             = vc ;"Comment"
  1  comment_bb          = vc ;"Blood Bank Comments"
  1  comment_ord         = vc ;"Order Notes and Comments"
  1  comment_prod        = vc ;"Product Comments"
  1  comment_rslt        = vc ;"Result Notes and Comments"
  1  comment_type        = vc ;"Type"
  1  end_date            = vc ;"Ending Date:"
  1  end_of_report       = vc ;"* * * End of Report * * *"
  1  facility            = vc ;"Facility:"
  1  inventory_area      = vc ;"Inventory Area: "
  1  not_on_file         = vc ;"<Not on File>"
  1  nbr_comments		 = c19 ;"Number of Comments:"
  1  nbr_notes			 = c19 ;"Number of Notes:"
  1  orderable           = vc ;"Order"
  1  order_dt_tm		 = vc ;"Order Date/Time"
  1  page_no             = vc ;"Page:"
  1  patient_dob         = vc ;"Patient DOB"
  1  patient_mrn         = vc ;"Patient MRN"
  1  patient_name        = vc ;"Patient Name"
  1  patient_user        = vc ;"Username"
  1  printed             = vc ;"Printed:"
  1  product_number      = vc ;"Product Number"
  1  product_type        = vc ;"Product Category"
  1  product_state		 = vc ;"State"
  1  report_id           = vc ;"Report ID: BBT_RPT_COMMENTS"
  1  assay               = vc ;"Assay"
  1  service_resource    = vc ;"Service Resource:"
  1  time                = vc ;"Time:"
  1  updt_dt_tm          = vc ;"Update Date/Time"
  1  username			 = vc ;"Username"
 
)
 
set captions->accession_nbr = uar_i18ngetmessage(i18nHandle,
  "accession_nbr", "Accession Nbr")
set captions->as_of_date = uar_i18ngetmessage(i18nHandle,
  "as_of_date", "As of Date:")
set captions->bb_owner = uar_i18ngetmessage(i18nHandle,
  "bb_owner", "Blood Bank Owner: ")
set captions->bb_title = "B L O O D   B A N K   C O M M E N T   R E P O R T"  ;no internationalization
set captions->beg_date = uar_i18ngetmessage(i18nHandle,
  "beg_date", "Beginning Date:")
set captions->comment = "Comment" ;no internationalization
set captions->comment_bb = "Blood Bank Comments"
set captions->comment_ord = "Order Notes and Comments" ;no internationalization
set captions->comment_prod = "Product Comments" ;no internationalization
set captions->comment_rslt = "Result Notes and Comments" ;no internationalization
set captions->comment_type = "Type" ;no internationalization
set captions->end_date = uar_i18ngetmessage(i18nHandle,
  "end_date", "Ending Date:")
set captions->end_of_report = uar_i18ngetmessage(i18nHandle,
  "end_of_report", "* * * End of Report * * *")
set captions->facility = uar_i18ngetmessage(i18nHandle,
   "facility", "Facility:")
set captions->inventory_area= uar_i18ngetmessage(i18nHandle,
  "inventory_area", "Inventory Area: ")
set captions->not_on_file = uar_i18ngetmessage(i18nHandle,
  "not_on_file", "<Not on File>")
set captions->orderable = uar_i18ngetmessage(i18nHandle,
  "orderable", "Order")
 set captions->order_dt_tm = "Order Date/Time"
set captions->page_no = uar_i18ngetmessage(i18nHandle,
  "page_no", "Page:")
set captions->patient_dob = uar_i18ngetmessage(i18nHandle,
   "dateofbirth", "Patient DOB")
set captions->patient_mrn = uar_i18ngetmessage(i18nHandle,
   "patient_mrn", "Patient MRN")
set captions->patient_name = uar_i18ngetmessage(i18nHandle,
  "patient_name", "Patient Name")
set captions->patient_user = "Username" ;no internationalization
set captions->printed = uar_i18ngetmessage(i18nHandle,
  "printed", "Printed:")
set captions->product_number = uar_i18ngetmessage(i18nHandle,
  "product_number", "Product Number")
set captions->product_type = uar_i18ngetmessage(i18nHandle,
  "product_type", "Product Type")
set captions->product_state =  "State" ;no internationalization
set captions->report_id = uar_i18ngetmessage(i18nHandle,
  "report_id", "Report ID: BBT_RPT_COMMENTS")
set captions->nbr_comments = "Number of Comments:"
set captions->nbr_notes = "Number of Notes:"
set captions->assay = uar_i18ngetmessage(i18nHandle,
   "results", "Assay")
set captions->service_resource = uar_i18ngetmessage(i18nHandle,
  "service_resource", "Service Resource:")
set captions->time = uar_i18ngetmessage(i18nHandle,
  "time", "Time:")
set captions->updt_dt_tm = uar_i18ngetmessage(i18nHandle,
  "dt_tm", "Update Date/Time")
set captions->username = uar_i18ngetmessage(i18nHandle,
  "tech", "Username")
 
/********************************************************************/
/*  Variable and constant declaration                               */
/********************************************************************/
 
declare CONST_ACTIVITY_TYPE_CS  = i4  with protect, constant(106)
declare CONST_ALIAS_TYPE_CS     = i4  with protect, constant(319)
declare CONST_ORD_COMMENT_CDF   = c11 with protect, constant("ORD COMMENT")
declare CONST_ORD_NOTE_CDF    	= c8  with protect, constant("ORD NOTE")
declare CONST_RES_COMMENT_CDF   = c11 with protect, constant("RES COMMENT")
declare CONST_RES_NOTE_CDF      = c8  with protect, constant("RES NOTE")
declare CONST_PROD_COMMENT_CDF  = c9  with protect, constant("BBPRODUCT")
declare CONST_BB_COMMENT_CDF   	= c9  with protect, constant("BBPATIENT")
declare CONST_BB_ACTIVITY_CDF	= c2  with protect, constant("BB")
declare CONST_MRN_CDF           = c3  with protect, constant("MRN")
declare CONST_COMMENT_TYPE_CS   = i4  with protect, constant(14)
 
declare cmt_txt 				= vc
declare mrn_code 				= f8  with noconstant(0.0)
declare code_cnt				= i4
declare sText					= vc ;stores comment text
declare aliastype_cd            = f8
declare ord_cmt_cd				= f8
declare ord_note_cd				= f8
declare result_cmt_cd	        = f8
declare result_note_cd          = f8
declare prod_cmt_cd				= f8
declare bb_cmt_cd				= f8
declare bb_activity_cd			= f8
declare code_cnt				= i4  with protect, noconstant(0)
declare nbr_prs                 = i4  with protect, noconstant(0)
declare nbr_comments            = i4  with protect, noconstant(0)
declare nbr_notes			    = i4  with protect, noconstant(0)
declare nbr_cmt_tot				= i4  with protect, noconstant(0)
declare product_nbr				= vc
declare beg_dt_tm				= dq8
declare end_dt_tm				= dq8
 
set code_cnt = 1
set stat = uar_get_meaning_by_codeset(CONST_ALIAS_TYPE_CS, CONST_MRN_CDF,code_cnt, aliastype_cd)
set stat = uar_get_meaning_by_codeset(CONST_COMMENT_TYPE_CS, CONST_ORD_COMMENT_CDF,code_cnt, ord_cmt_cd)
set stat = uar_get_meaning_by_codeset(CONST_COMMENT_TYPE_CS, CONST_ORD_NOTE_CDF,code_cnt, ord_note_cd)
set stat = uar_get_meaning_by_codeset(CONST_COMMENT_TYPE_CS, CONST_RES_COMMENT_CDF,code_cnt, result_cmt_cd)
set stat = uar_get_meaning_by_codeset(CONST_COMMENT_TYPE_CS, CONST_PROD_COMMENT_CDF,code_cnt, prod_cmt_cd)
set stat = uar_get_meaning_by_codeset(CONST_COMMENT_TYPE_CS, CONST_BB_COMMENT_CDF,code_cnt, bb_cmt_cd)
set stat = uar_get_meaning_by_codeset(CONST_COMMENT_TYPE_CS, CONST_RES_NOTE_CDF,code_cnt, result_note_cd)
set stat = uar_get_meaning_by_codeset(CONST_ACTIVITY_TYPE_CS, CONST_BB_ACTIVITY_CDF, code_cnt, bb_activity_cd)
 
set 1line = fillstring(138, "_") ;used at the end of a page right above the report id, page # and date printed
set 2line = fillstring(139, "_")
set 3line = fillstring(136, "_")
set 4line = fillstring(115, "_")
set stat = uar_get_meaning_by_codeset(4, "MRN", code_cnt, mrn_code)
 
set beg_dt_tm = cnvtdatetime($beg_dt_tm)
set end_dt_tm = cnvtdatetime($end_dt_tm)
 
set prompts->beg_dt_tm = cnvtdatetime($beg_dt_tm)
set prompts->end_dt_tm = cnvtdatetime($end_dt_tm)
set prompts->comment_type = $cmt_type
 
 
/****************************************************************************
* #1 Begin Order Comment/Notes Report                                       *
****************************************************************************/
if (prompts->comment_type = 1)
 
SELECT into $outdev
	p.name_full_formatted
	, ac.accession
	, order_mnemonic = ocs.dept_display_name
	, text = lt.long_text
	, pr.username
	, lt.updt_dt_tm
	, comment_type = uar_get_code_display(oc.comment_type_cd)
 
FROM
	person   p
	, orders   o
	, order_catalog ocs
	, order_comment   oc
	, accession_order_r   ac
	, long_text   lt
	, prsnl   pr
	;, dummyt   d
plan p
join o where p.person_id = o.person_id
join ocs where o.catalog_cd = ocs.catalog_cd
join oc where o.order_id = oc.order_id
	and o.activity_type_cd in (bb_activity_cd) ; replace with variable
	and o.order_comment_ind = 1
join ac where o.order_id = ac.order_id
	and ac.primary_flag = 0
join lt where lt.long_text_id = oc.long_text_id
	and lt.updt_dt_tm between cnvtdatetime(prompts->beg_dt_tm)
	and cnvtdatetime(prompts->end_dt_tm)
join pr where lt.updt_id = pr.person_id
	and not pr.username = "SYSTEM"
	and not pr.name_full_formatted = "SYSTEM"
;join d where
	;not trim(lt.long_text) = "Ordered by Discern"
 
ORDER BY ; replace order by to put in dummyt table when outputting when all four reports are in here and working
	oc.comment_type_cd
	, lt.updt_dt_tm desc
	, pr.name_full_formatted
	, ocs.dept_display_name
 
head report
	formatted_acc = fillstring(20, " ")
	patient_name = fillstring(40," ")
	sText = fillstring(30, " ")
	dummyVar = 0
 
head page
	beg_dt_tm = cnvtdatetime(prompts->beg_dt_tm)
	end_dt_tm = cnvtdatetime(prompts->end_dt_tm)
;%cclsource:bbt_print_location_info.loc
	row 0
	call center(captions->bb_title,1,140)
 
	row + 2
	;col 1, captions->bb_owner,
	;col 19, "cur_owner_area_disp", ;place holder until future code gets implemented
	col 112, captions->time,
	col 126, curtime "@TIMENOSECONDS;;M",
	row + 1
	;col 1, captions->inventory_area,
	;col 17, "cur_inv_area_disp" ;place holder until future code gets implemented
	col 112, captions->as_of_date,
	col 126, curdate "@SHORTDATE",
	row + 2
	col  32, captions->beg_date
	col  48, beg_dt_tm  "@SHORTDATE"
	col  58, beg_dt_tm  "@TIMENOSECONDS;;M"
	col  73, captions->end_date
	col  86, end_dt_tm  "@SHORTDATE"
	col  96, end_dt_tm  "@TIMENOSECONDS;;M"
	row + 2
	col   1, captions->comment_ord
	row + 2
 
 	col 6 captions->comment_type
 	col 22 captions->patient_name
	col 44 captions->accession_nbr
	col 64 captions->orderable
	col 83 captions->comment
	col 106 captions->username
	col 119 captions->updt_dt_tm
 
	row + 1
	col 1, "--------------"
	col   17, "----------------------"
	col   41, "------------------"
	col  61, "----------"
	col  73, "------------------------------"
	col  105, "----------"
	col  117, "--------------------" ;145
	row + 1
 
head oc.comment_type_cd
	col 1 comment_type
detail
	nbr_cmt_tot = nbr_cmt_tot + 1
 
	if (ord_cmt_cd = oc.comment_type_cd)
		nbr_comments = nbr_comments + 1
	elseif (ord_note_cd = oc.comment_type_cd)
		nbr_notes = nbr_notes + 1
	endif
	
	patient_name = p.name_full_formatted
	col 17 p.name_full_formatted "###################"
	formatted_acc = cnvtacc(ac.accession)
	col 44 formatted_acc "####################"
	col 61 order_mnemonic "##########" ; dept name for length purposes
	col 107 pr.username "######"
	updt_dt_tm = cnvtdatetime(lt.updt_dt_tm)
	col 119 updt_dt_tm "@SHORTDATE"
	col 129 updt_dt_tm "@TIMENOSECONDS;;M"
 
	sText = trim(text,3)
 
	if (textlen(sText) < 30)
		col 73 sText "##############################"
	else
		dummyVar = word_wrap(sText,30)
 
		for (x = 1 to pt->line_cnt)
			col 73 pt->lns[x].line
 
			if (x < pt->line_cnt)
				row + 1
			;elseif (x  pt->line_cnt)
				;col 73 "more..."
			endif
			if (row > 56) break endif
		endfor
 
	endif
 
	row + 1
	if (row > 56) break endif
 
;endif
 
foot oc.comment_type_cd
null
foot page
	ord_data->nbr_cmt_tot = ord_data->nbr_cmt_tot + nbr_cmt_tot
	ord_data->nbr_notes = ord_data->nbr_notes + nbr_notes
	ord_data->nbr_comments = ord_data->nbr_comments + nbr_comments
	
	row 57
	col   1, 1line
	row + 1
 
	col   1, captions->report_id
	col  71, captions->page_no
	col  75, curpage "###"
	col 111, captions->printed
	col 120, curdate "@SHORTDATETIME;;d"
	col 131, curtime "@TIMENOSECONDS;;M"
foot report
	row 2
	col 1 captions->nbr_comments
	col 20 ord_data->nbr_comments
	row + 1
	col 1 captions->nbr_notes
	col 20 ord_data->nbr_notes
	
	row 60
	col 61, captions->end_of_report
 
With maxcol = 140, maxrow = 61, nocounter,
	nullreport,
	compress, nolandscape
 
endif
 
/****************************************************************************
* #2 Begin Result Comments/Notes Report                                     *
****************************************************************************/
 
if (prompts->comment_type = 2)
 
/*******************************************************************************************
/*  Build the data structure, which will contain all information to display on report      *
/******************************************************************************************/
 
SELECT INTO "nl:"
	rc.result_id
	, rc.comment_type_cd
	, oc.catalog_cd
	, ac.accession
	, r.task_assay_cd
	;, lt.long_text_id
	, lt_long_text = substring(1, 32000, lt.long_text)
	, lt.updt_dt_tm
	, pr.username
FROM
	result_comment rc
	, result r
	, accession_order_r ac
	, order_catalog oc
	, long_text lt
	, prsnl pr
 
PLAN rc
	WHERE rc.updt_dt_tm between cnvtdatetime($beg_dt_tm) and cnvtdatetime($end_dt_tm)
          and (rc.comment_type_cd = result_cmt_cd
           or rc.comment_type_cd = result_note_cd)
JOIN r
	WHERE rc.result_id = r.result_id
JOIN ac
	WHERE r.order_id = ac.order_id
		  and ac.primary_flag = 0
JOIN oc
	WHERE r.catalog_cd = oc.catalog_cd
		  and oc.activity_type_cd = bb_activity_cd
JOIN lt
	WHERE rc.long_text_id = lt.long_text_id
          and lt.long_text_id > 0
JOIN pr
	WHERE lt.updt_id = pr.person_id
		  and pr.person_id > 0
 
ORDER
	rc.comment_type_cd
	, lt.updt_dt_tm
 
head report
	row + 0
detail
	nbr_cmt_tot = nbr_cmt_tot + 1
 
	if (result_cmt_cd = rc.comment_type_cd)
		nbr_comments = nbr_comments + 1
	elseif (result_note_cd = rc.comment_type_cd)
		nbr_notes = nbr_notes + 1
	endif
 
    if (mod(nbr_cmt_tot, 10) = 1)
		stat = alterlist(rslt_data->qual,nbr_cmt_tot + 49)
	endif
 
	rslt_data->qual[nbr_cmt_tot].result_id = rc.result_id
	rslt_data->qual[nbr_cmt_tot].comment_type_cd = uar_get_code_display(rc.comment_type_cd)
	rslt_data->qual[nbr_cmt_tot].catalog_cd = uar_get_code_display(oc.catalog_cd)
	rslt_data->qual[nbr_cmt_tot].task_assay_cd = uar_get_code_display(r.task_assay_cd)
	rslt_data->qual[nbr_cmt_tot].accession_nbr = ac.accession
	rslt_data->qual[nbr_cmt_tot]->text_result = trim(lt_long_text)
	rslt_data->qual[nbr_cmt_tot]->updt_dt_tm = lt.updt_dt_tm
	rslt_data->qual[nbr_cmt_tot]->username = pr.username
 
foot report
	stat = alterlist(rslt_data->qual,nbr_cmt_tot)
	rslt_data->nbr_cmt_tot = nbr_cmt_tot
	rslt_data->nbr_comments = nbr_comments
	rslt_data->nbr_notes = nbr_notes
 
WITH NOCOUNTER
 
/***************************************************************************
/*  output info stored in data                                             *
/**************************************************************************/
 
select into $outdev
	rslt_data->qual[d.seq].comment_type_cd
	, rslt_data->qual[d.seq].updt_dt_tm
from
	(dummyt d with seq = rslt_data->nbr_cmt_tot)
plan d
order by
	rslt_data->qual[d.seq].comment_type_cd
	, rslt_data->qual[d.seq].updt_dt_tm desc
 
 
/********************************************
* Report writer section to output data      *
*********************************************/
 
head report
	formatted_acc = fillstring(20, " ")
	sText = fillstring(30, " ")
	dummyVar = 0
 
head page
	beg_dt_tm = cnvtdatetime(prompts->beg_dt_tm)
	end_dt_tm = cnvtdatetime(prompts->end_dt_tm)
 
	row 0
	call center(captions->bb_title,1,140)
 
	row + 2
	col   1, captions->nbr_comments,
	col  20, nbr_comments, ;place holder until future code gets implemented
	col 112, captions->time,
	col 126, curtime "@TIMENOSECONDS;;M",
	row + 1
	col   1, captions->nbr_notes,
	col  20, nbr_notes ;place holder until future code gets implemented
	col 112, captions->as_of_date,
	col 126, curdate "@SHORTDATE",
	row + 2
	col  32, captions->beg_date
	col  48, beg_dt_tm  "@SHORTDATE"
	col  58, beg_dt_tm  "@TIMENOSECONDS;;M"
	col  73, captions->end_date
	col  86, end_dt_tm  "@SHORTDATE"
	col  96, end_dt_tm  "@TIMENOSECONDS;;M"
	row + 2
	col   1, captions->comment_rslt
	row + 2
 
 	col 6 captions->comment_type
 	col 24 captions->orderable
 	col 44 captions->assay
	col 59 captions->accession_nbr
	col 86 captions->comment
	col 108 captions->username
	col 121 captions->updt_dt_tm
 
	row + 1
	col    1, "--------------"
	col   17, "------------------"
	col   37, "------------------"
	col   57, "----------------"
	col   75, "------------------------------"
	col  107, "----------"
	col  119, "--------------------" ;145
	row + 1
;head data->qual[d.seq].comment_type_cd
;	col 1 data->qual[d.seq].comment_type_cd
detail
	col   1 rslt_data->qual[d.seq].comment_type_cd ;get in head!
	col  19 rslt_data->qual[d.seq].catalog_cd
	col  39 rslt_data->qual[d.seq].task_assay_cd
 
	formatted_acc = cnvtacc(rslt_data->qual[d.seq].accession_nbr)
	col  59 formatted_acc
	col 108 rslt_data->qual[d.seq].username
	col 121 rslt_data->qual[d.seq]->updt_dt_tm "@SHORTDATE"
	col 131 rslt_data->qual[d.seq]->updt_dt_tm "@TIMENOSECONDS;;M"
 
	sText = trim(rslt_data->qual[d.seq].text_result,3)
 
	if (textlen(sText) < 30)
		col 73 sText "##############################"
	else
		dummyVar = word_wrap(sText,30)
 
		for (x = 1 to pt->line_cnt)
			col 75 pt->lns[x].line
 
			if (x < pt->line_cnt)
				row + 1
			;elseif (x  pt->line_cnt)
				;col 75 "more..."
			endif
			if (row > 56) break endif
		endfor
 
	endif
 
	if (row > 56) break endif
 
	row + 1
 
;foot data->qual[d.seq].comment_type_cd
;	NULL
foot page
	row 57
	col 1, 2line
	row + 1
	col 1, captions->report_id
	col 67, captions->page_no
	col 73, curpage "###"
	col 114, captions->printed
	col 123, curdate "@SHORTDATETIME;;d"
	col 134, curtime "@TIMENOSECONDS;;M"
foot report
	row 60
	call center(captions->end_of_report, 1, 139)
 
with nocounter
    ,nullreport
    ,maxrow = 61
    ,maxcol = 150
    ,compress
    ,nolandscape
 
endif
 
/****************************************************************************
* #3 Begin Product Comments Report                                          *
****************************************************************************/
if (prompts->comment_type = 3)
 
SELECT INTO $outdev
	product_type = uar_get_code_display(p.product_cd)
	, p.product_nbr
	, p.product_sub_nbr
	, product_state = uar_get_code_display(pe.event_type_cd)
	, text = lt.long_text
	, pr.username
	, lt.updt_dt_tm
 
FROM
	product_note   pn
	, long_text   lt
	, prsnl   pr
	, product   p
	, product_event pe
 
plan p
join pn where pn.product_id = p.product_id
	and pn.active_ind = 1
join pe where pn.product_id = pe.product_id
	and pe.active_ind = 1
join lt where lt.long_text_id = pn.long_text_id
	and lt.updt_dt_tm between cnvtdatetime(prompts->beg_dt_tm)
	and cnvtdatetime(prompts->end_dt_tm)
join pr where pr.person_id = lt.updt_id
 
ORDER BY
	lt.updt_dt_tm desc
	, product_type
 
 /* future state record structure development for product audit
head report
	row + 0
detail
	nbr_cmt_tot = nbr_cmt_tot + 1
 
    if (mod(nbr_cmt_tot, 10) = 1)
		stat = alterlist(prod_data->qual,nbr_cmt_tot + 49)
	endif
 
	prod_data->qual[nbr_cmt_tot].product_cd = uar_get_code_display(product_type)
	prod_data->qual[nbr_cmt_tot].product_nbr = p.product_nbr
	prod_data->qual[nbr_cmt_tot].product_sub_nbr = p.product_sub_nbr
	prod_data->qual[nbr_cmt_tot].event_type_cd = uar_get_code_display(product_state)
	prod_data->qual[nbr_cmt_tot].text_result = trim(text)
	prod_data->qual[nbr_cmt_tot].username = pr.username
	prod_data->qual[nbr_cmt_tot].updt_dt_tm = lt.updt_dt_tm
foot report
	stat = alterlist(rslt_data->qual,nbr_cmt_tot)
	prod_data->nbr_cmt_tot = nbr_cmt_tot
 
select into $outdev
	prod_data->qual[d.seq].updt_dt_tm
from
	(dummyt d with seq = prod_data->nbr_cmt_tot)
plan d
order by
	prod_data->qual[d.seq].updt_dt_tm desc
 
 
/********************************************
* Report writer section to output data      *
*********************************************/
 
head report
	product_nbr = fillstring(30, " ")
	sText = fillstring(30, " ")
	dummyVar = 0
head page
	beg_dt_tm = cnvtdatetime(prompts->beg_dt_tm)
	end_dt_tm = cnvtdatetime(prompts->end_dt_tm)
	row 0
	call center(captions->bb_title,1,140)
 
	row + 2
	;col   1, captions->bb_owner,
	;col  19, "cur_owner_area_disp", ;place holder until future code gets implemented
	col 112, captions->time,
	col 126, curtime "@TIMENOSECONDS;;M",
	row + 1
	;col   1, captions->inventory_area,
	;col  17, "cur_inv_area_disp" ;place holder until future code gets implemented
	col 112, captions->as_of_date,
	col 126, curdate "@SHORTDATE",
	row + 2
	col  32, captions->beg_date
	col  48, beg_dt_tm  "@SHORTDATE"
	col  58, beg_dt_tm  "@TIMENOSECONDS;;M"
	col  73, captions->end_date
	col  86, end_dt_tm  "@SHORTDATE"
	col  96, end_dt_tm  "@TIMENOSECONDS;;M"
	row + 2
	col   1, captions->comment_prod
	row + 2
 
 	col   5 captions->product_type
 	col  26 captions->product_state
 	col  42 captions->product_number
	col  78 captions->comment
	col 105 captions->username
	col 118 captions->updt_dt_tm
 
	row + 1
	col   1, "-------------------"
	col  22 "--------------"
	col  38, "----------------------"
	col  62, "----------------------------------------"
	col 104, "----------"
	col 116 "--------------------"
	row + 1
detail
	nbr_cmt_tot = nbr_cmt_tot + 1
 
	product_type = uar_get_code_display(p.product_cd)
	, p.product_nbr
	, p.product_sub_nbr
	, product_state = uar_get_code_display(pe.event_type_cd)
	, text = lt.long_text
	, pr.username
	, lt.updt_dt_tm
 
	col 2 product_type;prod_data->qual[d.seq].product_cd
	col 24 product_state;prod_data->qual[d.seq].event_type_cd
 
	product_nbr = concat(p.product_nbr, " ", p.product_sub_nbr)
	;concat(prod_data->qual[d.seq].product_nbr, " ", prod_data->qual[d.seq].product_sub_nbr)
	col 40 product_nbr
	col 106 pr.username;prod_data->qual[d.seq].username
	col 118 lt.updt_dt_tm "@SHORTDATE";prod_data->qual[d.seq].updt_dt_tm "@SHORTDATE"
	col 128 lt.updt_dt_tm "@TIMENOSECONDS;;M";prod_data->qual[d.seq].updt_dt_tm "@TIMENOSECONDS;;M"
 
 
	sText = trim(check(text,char(13)),3)           ;,)check(3
 
	if (textlen(sText) < 40)
		col 62 sText "########################################"
	else
		dummyVar = word_wrap(sText,40)
 
		for (x = 1 to pt->line_cnt)
			col 62 pt->lns[x].line
 
			if (x < pt->line_cnt)
				row + 1
			;elseif (x  pt->line_cnt)
				;col 73 "more..."
			endif
			if (row > 56) break endif
		endfor
 
	endif
 
	row + 1
 
	if (row > 56) break endif
 
foot page
	prod_data->nbr_cmt_tot = prod_data->nbr_cmt_tot + nbr_cmt_tot
 
	row 57
	col   1, 3line
	row + 1
	col   1, captions->report_id
	col  69, captions->page_no
	col  75, curpage "###"
	col 111, captions->printed
	col 120, curdate "@SHORTDATE"
	col 131, curtime "@TIMENOSECONDS;;M"
foot report
	row 2
	col 1 captions->nbr_comments
	col 20 prod_data->nbr_cmt_tot
 
	row 60
	col 62, captions->end_of_report
 
WITH MAXCOL = 160, MAXROW = 61, nocounter,
	nullreport,
	compress, nolandscape
	;SEPARATOR=" ", FORMAT
 
endif
 
 
 
/****************************************************************************
* #4 Begin Blood Bank Comments Report                                       *
****************************************************************************/
 
if (prompts->comment_type = 4)
 
SELECT into $outdev
	p.name_full_formatted
	, pa.alias
	, text = lt.long_text
	, pr.username
	, pr.updt_dt_tm
 
FROM
	blood_bank_comment   bbc
	, person   p
	, person_alias   pa
	, long_text   lt
	, prsnl   pr
 
plan p
join pa where p.person_id = pa.person_id
	and pa.person_alias_type_cd = mrn_code
join bbc where p.person_id = bbc.person_id
	and bbc.active_ind = 1
	and bbc.bb_comment_id > 0
join lt where bbc.long_text_id = lt.long_text_id
	and lt.updt_dt_tm between cnvtdatetime(prompts->beg_dt_tm)
	and cnvtdatetime(prompts->end_dt_tm)
join pr where lt.updt_id = pr.person_id
 
head report
	patient_name = fillstring(40," ")
	patient_mrn = fillstring(40, " ")
	sText = fillstring(30, " ")
head page
	beg_dt_tm = cnvtdatetime(prompts->beg_dt_tm)
	end_dt_tm = cnvtdatetime(prompts->end_dt_tm)
;%cclsource:bbt_print_location_info.loc
	row 0
	call center(captions->bb_title,1,130)
	row + 2
 
	;col   1, captions->bb_owner,
	;col  19, "cur_owner_area_disp", ;place holder until future code gets implemented
	col  94, captions->time,
	col 107, curtime "@TIMENOSECONDS;;M",
	row + 1
 
	;col   1, captions->inventory_area,
	;col  17, "cur_inv_area_disp" ;place holder until future code gets implemented
	col  94, captions->as_of_date,
	col 107, curdate "@SHORTDATE",
	row + 2
 
	col  32, captions->beg_date
	col  48, beg_dt_tm  "@SHORTDATE"
	col  58, beg_dt_tm  "@TIMENOSECONDS;;M"
	col  73, captions->end_date
	col  86, end_dt_tm  "@SHORTDATE"
	col  96, end_dt_tm  "@TIMENOSECONDS;;M"
	row + 2
	col   1, captions->comment_bb
	row + 2
 
 	col   5 captions->patient_name
 	col  25 captions->patient_mrn
	col  58 captions->comment
	col  84 captions->username
	col  98 captions->updt_dt_tm
	row + 1
 
	col   1, "--------------------"
	col  23, "---------------"
	col  40, "----------------------------------------"
	col  82, "------------"
	col  96, "-------------------"
	row + 1
detail
	nbr_cmt_tot = nbr_cmt_tot + 1
 
	patient_name = trim(p.name_full_formatted)
	col   2 patient_name "####################"
	patient_mrn = trim(pa.alias)
	col  24 pa.alias "##########"
;	col  40 lt.long_text "########################################"
	col  84 pr.username
	col  98 lt.updt_dt_tm "@SHORTDATE"
	col 108 lt.updt_dt_tm "@TIMENOSECONDS;;M"
 
	sText = check(trim(text,3),char(13))
 
	if (textlen(sText) < 40)
		col 40 sText "########################################"
	else
		dummyVar = word_wrap(sText,40)
 
		for (x = 1 to pt->line_cnt)
			col 40 pt->lns[x].line
 
			if (x < pt->line_cnt)
				row + 1
			;elseif (x  pt->line_cnt)
				;col 73 "more..."
			endif
			if (row > 56) break endif
		endfor
 
	endif
 
	row + 1
 
	if (row > 56) break endif
 
foot page
	bb_data->nbr_cmt_tot = bb_data->nbr_cmt_tot + nbr_cmt_tot
 
	row 57
	col   1, 4line
	row + 1
 
	col   1, captions->report_id
	col  48, captions->page_no
	col  54, curpage "###"
	col  90, captions->printed
	col  99, curdate "@SHORTDATE"
	col 110, curtime "@TIMENOSECONDS;;M"
foot report
	row 2
	col 1 captions->nbr_comments
	col 20 bb_data->nbr_cmt_tot
 
	row 60
	col 41, captions->end_of_report
 
WITH MAXCOL = 140, MAXROW = 61, nocounter,
	nullreport,
	compress, nolandscape
 
endif
 
end
go
 
