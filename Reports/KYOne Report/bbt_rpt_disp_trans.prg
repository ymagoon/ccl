/*~BB~************************************************************************
  *                                                                      *
  *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
  *                              Technology, Inc.                        *
  *       Revision      (c) 1984-2004 Cerner Corporation                 *
  *                                                                      *
  *  Cerner (R) Proprietary Rights Notice:  All rights reserved.         *
  *  This material contains the valuable properties and trade secrets of *
  *  Cerner Corporation of Kansas City, Missouri, United States of       *
  *  America (Cerner), embodying substantial creative efforts and        *
  *  confidential information, ideas and expressions, no part of which   *
  *  may be reproduced or transmitted in any form or by any means, or    *
  *  retained in any storage or retrieval system without the express     *
  *  written permission of Cerner.                                       *
  *                                                                      *
  *  Cerner is a registered mark of Cerner Corporation.                  *
  *                                                                      *
  ~BE~***********************************************************************/
/*****************************************************************************
 
        Source file name:       bbt_rpt_disp_trans.prg
        Object name:            bbt_rpt_disp_trans
        Request #:
 
        Product:                Pathnet
        Product Team:           Blood Bank Transfusion
        HNA Version:            500
        CCL Version:            1.0
 
        Program purpose:        Report dispensed and transfused units
 
        Tables read:            product, product_event, bb_isbt_product_type
        						blood_product
 
 
        Tables updated:         None
 
        Executing from:
 
        Special Notes:          An owner area and an inventory area must be selected or
        						the report will not print any data. This can be changed
        						by adding Select If logic https://connect.ucern.com/docs/DOC-69586
***********************************************************************************/
;~DB~*******************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG                     *
;    *******************************************************************************
;    *                                                                             *
;    *  v      Mod Date        Engineer             Comment                        *
;    *---      --------    -------------------- -----------------------------------*
;     000      09/06/13     Yitzhak Magoon        Initial Release                  *
;	  001      09/12/13     Yitzhak Magoon        Prevent report from erroring out *
;                                                 when no results are returned     *
;                                                                              	   *
;~DE~*******************************************************************************
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ***************************
 
drop program bbt_rpt_disp_trans go
create program bbt_rpt_disp_trans
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Start Date / Time" = "SYSDATE"        ;* Enter Starting Date and Time
	, "End Date / Time" = "SYSDATE"          ;* Enter Ending Date and Time
	, "Owner Area" = 0                       ;* Enter the Owner Area
	, "Inventory Area" = 0                   ;* Enter Inventory Area
 
with OUTDEV, beg_dt_tm, end_dt_tm, cur_own_area, cur_inv_area
 
/*****************************************************************************
* Begin Internationalization                                                 *
*****************************************************************************/
%i cclsource:i18n_uar.inc
 
set i18nHandle = 0
set h = uar_i18nlocalizationinit(i18nHandle, curprog, "", curcclrev)
 
record captions
(
  1  rpt_title                  = vc
  1  rpt_time                   = vc
  1  rpt_as_of_date             = vc
  1  begin_date                 = vc
  1  ending_date                = vc
  1  blood_bank_owner           = vc
  1  inventory_area             = vc
  1  abo_rh                     = vc
  1  product_number             = vc
  1  product_type               = vc
  1  rpt_id                     = vc
  1  rpt_page                   = vc
  1  printed                    = vc
  1  end_of_report              = vc
  1  ecode						= vc
  1  all						= vc
  1  event_type					= vc
  1  event_dt_tm				= vc
  1  total_disp					= vc
  1  total_trans				= vc
)
 
set captions->rpt_title = uar_i18ngetmessage(i18nHandle,
  "rpt_title", "U N I T S   D I S P E N S E D   A N D   T R A N S F U S E D")
set captions->rpt_time = uar_i18ngetmessage(i18nHandle,
  "rpt_time", "Time:")
set captions->rpt_as_of_date = uar_i18ngetmessage(i18nHandle,
  "rpt_as_of_date", "As of Date:")
set captions->begin_date = uar_i18ngetmessage(i18nHandle,
  "begin_date", "Beginning Date:")
set captions->ending_date = uar_i18ngetmessage(i18nHandle,
  "ending_date", "Ending Date:")
set captions->blood_bank_owner = uar_i18ngetmessage(i18nHandle,
  "blood_bank_owner", "Owner Area: ")
set captions->inventory_area = uar_i18ngetmessage(i18nHandle,
  "inventory_area", "Inventory Area: ")
set captions->abo_rh = uar_i18ngetmessage(i18nHandle,
  "abo_rh", "ABO/Rh")
set captions->product_number = uar_i18ngetmessage(i18nHandle,
  "product_number", "Product Number")
set captions->product_type = uar_i18ngetmessage(i18nHandle,
  "product_type", "Product Type")
set captions->rpt_id = uar_i18ngetmessage(i18nHandle,
  "rpt_id", "Report ID: BBT_RPT_DISP_TRANS")
set captions->rpt_page = uar_i18ngetmessage(i18nHandle,
  "rpt_page", "Page:")
set captions->printed = uar_i18ngetmessage(i18nHandle,
  "printed", "Printed:")
set captions->end_of_report = uar_i18ngetmessage(i18nHandle,
  "end_of_report", "* * * End of Report * * *")
set captions->ecode = "Ecode"
set captions->event_type = "Event Type"
set captions->event_dt_tm = "Event Date / Time"
set captions->all = uar_i18ngetmessage(i18nHandle,
  "all", "All Inventory Areas")
set captions->total_disp = "Total Dispensed:"
set captions->total_trans = "Total Transfused:"
 
/*****************************************************************************
* End of Internationalization                                               *
*****************************************************************************/
 
;begin declarations
declare transfuse_code 		= f8      with noconstant(0.0)
declare dispense_code 		= f8      with noconstant(0.0)
declare xm_code				= f8	  with noconstant(0.0)
declare cur_owner_area_disp = vc  	  with noconstant(fillstring(40, " "))
declare cur_inv_area_disp 	= vc      with noconstant(fillstring(80, " "))
declare code_cnt 			= i4      with noconstant(1)
declare i_cnt				= i4
declare l_cnt				= i4
declare LINE 				= vc      with noconstant(fillstring(125, "_"))
declare prod_cnt			= i4
declare e_cnt				= i4
declare product_abo_disp	= vc
declare product_rh_disp		= vc
declare event_type			= vc
declare total_trans			= i4
declare total_disp			= i4
declare product_type		= vc
declare beg_dt_tm			= dq8
declare beg_dt_tm			= dq8
;end declarations
 
set code_cnt = 1
set stat = uar_get_meaning_by_codeset(1610, nullterm("7"), code_cnt, transfuse_code) ;get transfused code_value
 
set code_cnt = 1
set stat = uar_get_meaning_by_codeset(1610, nullterm("4"), code_cnt, dispense_code) ;get dispensed code_value
 
set code_cnt = 1
set stat = uar_get_meaning_by_codeset(1610, nullterm("3"), code_cnt, xm_code) ;get crossmatched code_value
 
set beg_dt_tm = cnvtdatetime($beg_dt_tm)
set end_dt_tm = cnvtdatetime($end_dt_tm)
 
set cur_owner_area_disp = uar_get_code_display($cur_own_area)
 
/***************************************************************************
* record structure to store inventory areas from prompt $cur_inv_area      *
***************************************************************************/;
record irec (
	1 list[*]
	 2 cv = f8)
 
;check to see if multiple values were selected for $cur_inv_area
set lcheck = substring(1,1,reflect(parameter(5,0)))
 
if(lcheck = "L") ;if multiple selections were made at the $cur_inv_area prompt
	while(lcheck > " ")
		      set i_cnt = i_cnt +1
		      set lcheck = substring(1,1,reflect(parameter(5,i_cnt)))
		      call echo(lcheck)
		      if(lcheck > " ")  ;lcheck will equal " " when there are no more values in the list
			  	if(mod(i_cnt,5) = 1)
					set stat = alterlist(irec->list, i_cnt +4)
				endif
				set irec->list[i_cnt].cv = cnvtint(parameter(5,i_cnt)) ;store the code value in the record
		      endif
	endwhile
	set i_cnt = i_cnt -1
	set stat = alterlist(irec->list, i_cnt)
else
	;A single value was selected at glist prompt
	set stat = alterlist(irec->list, 1)
	set i_cnt = 1
	set irec->list[1].cv = $cur_inv_area
endif
 
call echorecord(irec)
 
/*********************************************
* record structure to store product data     *
*********************************************/
record data (
			1 products[*]
				2 product_type		= f8		;product.product_cd
				2 product_nbr 		= vc		;product.product_nbr
				2 aborh				= vc		;blood_product.cur_abo_cd
												;blood_product.cur_rh_cd
				2 ecode				= vc		;bb_isbt_product.isbt_barcode
				2 product_sub_nbr 	= vc		;product.product_sub_nbr
				2 event_type		= vc		;product_event.event_type_cd
				2 event_dt_tm		= dq8		;product_event.event_dt_tm
			1 prod_cnt				= i4		;#of products for output
			1 total_trans			= i4		;#of transfused products
			1 total_disp			= i4)		;#of dispensed products
 
/******************************************
* Select statement to pull product data   *
*******************************************/
 
SELECT into "nl:"
	 pr.product_cd
	, pr.product_nbr
	, bp.cur_abo_cd
	, bp.cur_rh_cd
	, pr.product_sub_nbr ;aliquot units
	, pe.event_type_cd
	, pe.event_dt_tm
 
FROM
	product   pr
	, product_event   pe
	, (dummyt   d_bp  with seq = 1)
	, blood_product   bp
 
plan pe where  pe.active_ind = 1 and pe.event_dt_tm between
	cnvtdatetime($beg_dt_tm) and cnvtdatetime($end_dt_tm)
	and pe.event_type_cd in (transfuse_code, dispense_code) ;dispensed and transfused units
/* Filters by owner area AND inventory area
 * If you want the report to pull all products in an owner area
 * then you must select all of the inventory areas underneath the owner area */
join pr where pe.product_id = pr.product_id
	and pr.cur_owner_area_cd = $cur_own_area
	and pr.cur_inv_area_cd = $cur_inv_area
 
join (d_bp where d_bp.seq = 1
      join bp
        where pr.product_id = bp.product_id)
order by
	pr.product_cd
/************************************************************************
* Report writer section to load product data into record structure      *
*************************************************************************/
 
head report
	prod_cnt = 0
	total_trans = 0
	total_disp = 0
 
detail
	event_type = fillstring(20, " ")
 
	prod_cnt = prod_cnt + 1
 
	if (pe.event_type_cd = transfuse_code)
		total_trans = total_trans + 1
	else
		total_disp = total_disp + 1
	endif
 
	if (mod(prod_cnt, 10) = 1)
		stat = alterlist(data->products, prod_cnt + 9)
	endif
 
 	event_type = uar_get_code_display(pe.event_type_cd)
 	product_abo_disp = uar_get_code_display(bp.cur_abo_cd)
	product_rh_disp = uar_get_code_display(bp.cur_rh_cd)
 
	data->products[prod_cnt].product_type = pr.product_cd ;left as code_value to do ecode comparison in ecode report writer below
	data->products[prod_cnt].product_nbr = trim(pr.product_nbr)
	data->products[prod_cnt].product_sub_nbr = trim(pr.product_sub_nbr)
	data->products[prod_cnt].aborh = concat(trim(product_abo_disp), " " , trim(product_rh_disp))
	data->products[prod_cnt].event_type = trim(event_type)
	data->products[prod_cnt].event_dt_tm = pe.event_dt_tm
 
foot report
	stat = alterlist(data->products, prod_cnt)
	data->prod_cnt = prod_cnt
	data->total_trans = total_trans
	data->total_disp = total_disp
 
with nocounter
 
/********************************************
* Select statement to pull ecodes           *
*********************************************/
 
select into "nl:"
	bbp1.product_cd
	, bbp1.isbt_barcode
from
	bb_isbt_product_type bbp
	, bb_isbt_product_type bbp1
	, (dummyt d1 with seq = data->prod_cnt)
plan bbp where bbp.active_ind =1
join bbp1 where bbp1.product_cd = bbp.product_cd
	and bbp1.active_ind = 1
join d1
 
order by
	bbp1.product_cd
 
/*********************************************************************************************
* Report Writer to load ecodes in record structure and correlate ecodes to products          *
**********************************************************************************************/
head report
	e_cnt = 0
 
detail
 
;optimization point - inefficient search. Searches through entire ecode list for each product
	for (e_cnt = 1 to data->prod_cnt)
		if (data->products[d1.seq].product_type = bbp1.product_cd)
			data->products[d1.seq].ecode = bbp1.isbt_barcode
		endif
	endfor
 
foot report
	null
 
 
/********************************************
* Select statement to output data         *
*********************************************/
 
select into $outdev
	data->products[d.seq].event_dt_tm
	,data->products[d.seq].product_type
from
	(dummyt d with seq = data->prod_cnt)
order by
	data->products[d.seq].event_dt_tm desc
	, data->products[d.seq].product_type
 
 
/********************************************
* Report writer section to output data      *
*********************************************/
 
head report
	product_display = fillstring(20, " ") ;for concatenated product_nbr + product_sub_nbr
	product_type = fillstring(40, " ")
	temp_inv = fillstring(40," ") ;for outputting multiple inventory areas
	lcheck = substring(1,1,reflect(parameter(5,0)))
 
head page
	call center(captions->rpt_title,1,125)
	row + 2
 
	col  1, captions->blood_bank_owner
	col 19, cur_owner_area_disp
	col 102, captions->rpt_time
	col 116, curtime "@TIMENOSECONDS;;M"
	row + 1
 
	col 1, captions->inventory_area
	;multiple inventory areas selected
	if(lcheck = "L")
		cur_inv_area_disp = trim(uar_get_code_display(irec->list[1].cv)) ;initially set display to first record
		for(l_cnt = 2 to i_cnt)
			temp_inv = trim(uar_get_code_display(irec->list[l_cnt].cv))
			cur_inv_area_disp = concat(trim(cur_inv_area_disp), ", ", temp_inv) ; each additional record gets concatenated
		endfor
	else
		;if only one inventory selected
		cur_inv_area_disp = trim(uar_get_code_display(irec->list[i_cnt].cv))
	endif
 
	col 19, cur_inv_area_disp
	col 102, captions->rpt_as_of_date
	col 116, curdate "@SHORTDATE"
    row + 2
 
    col  24, captions->begin_date
    col  41, beg_dt_tm "@SHORTDATE"
    col  51, beg_dt_tm "@TIMENOSECONDS;;M"
    col  80, captions->ending_date
    col  94, end_dt_tm "@SHORTDATE"
    col  104, end_dt_tm "@TIMENOSECONDS;;M"
    row + 2
    col 1 captions->total_disp
    col 19 total_disp
    row + 1
    col 1 captions->total_trans
    col 19 total_trans
    row + 2
 
    col   8, captions->product_type
    col  32, captions->product_number
    col  54, captions->ecode
	col  64, captions->abo_rh
	col  83, captions->event_type
	col 102, captions->event_dt_tm
    row + 1
 
	col   0, "---------------------------",
	col  29, "--------------------",
	col  51, "----------------------------",
	col  81, "--------------",
	col  97, "---------------------------",
	row + 1 ;11
detail
	if (data->prod_cnt >0)					;001
	product_type = trim(uar_get_code_display(data->products[d.seq].product_type))
	col   1 product_type "#########################"
 
	product_display = concat(data->products[d.seq].product_nbr, " ", data->products[d.seq].product_sub_nbr)
	col  31 product_display "################"
	col  54 data->products[d.seq].ecode "#####"
	col  64 data->products[d.seq].aborh
	col  83 data->products[d.seq].event_type
	col 102 data->products[d.seq].event_dt_tm "@SHORTDATE"
	col 112 data->products[d.seq].event_dt_tm "@TIMENOSECONDS;;M"
	row + 1
 	else
 		col 1 ""
 	endif
 
	if (row > 56) break endif
foot page
	row  57
	col   1,  LINE,
	row + 1
 
	col   1, captions->rpt_id
	col  58, captions->rpt_page
	col  64, curpage "###",
	col 100, captions->printed
	col 110, curdate "@SHORTDATE"
	col 120, curtime "@TIMENOSECONDS;;M"
foot report
	row  60
	call center(captions->end_of_report, 1, 125)
 
with nocounter
    ,nullreport
    ,maxrow = 61
    ,maxcol = 130
    ,compress
    ,nolandscape
end
go
