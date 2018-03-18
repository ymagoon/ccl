/*************************************************************************
*                                                                        *
*  Copyright Notice:  (c) 1983 Laboratory Information Systems &          *
*                              Technology, Inc.                          *
*       Revision      (c) 1984-2001 Cerner Corporation                   *
*                                                                        *
*  Cerner (R) Proprietary Rights Notice:  All rights reserved.           *
*  This material contains the valuable properties and trade secrets of   *
*  Cerner Corporation of Kansas City, Missouri, United States of         *
*  America (Cerner), embodying substantial creative efforts and          *
*  confidential information, ideas and expressions, no part of which     *
*  may be reproduced or transmitted in any form or by any means, or      *
*  retained in any storage or retrieval system without the express       *
*  written permission of Cerner.                                         *
*                                                                        *
*  Cerner is a registered mark of Cerner Corporation.                    *
*                                                                        *
**************************************************************************
 
        Source file name:   orm_rpt_meds_rec_admission_data.inc
        Object name:        orm_rpt_meds_rec_admission_data
        Request #:
 
        Solution:           Powerchart
        Solution Team:      Orders Management
        HNA Version:        500
        CCL Version:
 
        Program purpose:    Loads outpatient orders for a given patient
 
        Tables read:		None
 
        Tables updated:		None
 
        Executing from:     orm_rpt_meds_rec_admission.prg
 
        Special notes:
 
**************************************************************************
                      GENERATED MODIFICATION CONTROL LOG                 *
**************************************************************************
 Mod Date     Engineer     Feature Comment
 --- -------- ------------ ------- ---------------------------------------
 000 11/29/05 AT012526     0069455 Initial release - ITN 119015
 001 06/20/06 CG011817     0097536 Filtering out duplicate orders from
                                   Retail Medication Manager.
 002 09/28/06 AT012526     0109655 Performance enhancements. Added qualif-
                                   ication to order_detail.
 003 01/29/07 CG011817     0124603 Stopped filtering out orders originating
                                   in Retail Medication Manager.
 004 05/24/07 CG011817	   0127067 Add Sig to Retail Orders.
 005 12/03/08 NT5990       Custom Change for MAYO_MN SR 1-2733784281.
                           Added last occurred date.
 006 08/21/09 Akcia		   Pull order comments, compliance comments and compliance status
 007 07/28/10 Akcia-SE	   check for Unable to obtain and no know home meds checkboxes and display
 							appropriate messages.
 008 02/21/11 Akcia-SE	   Add 48 hour check for compliance data
 009 05/12/11 Akcia_pel    Wrap meds and comments if needed.
*************************************************************************/
 
;record ordersRec
;(
;  1 orders_list[*]
;    2 order_id              = f8
;    2 rx_ind                = i2
;    2 mnemonic              = vc
;    2 clinical_display_line = vc
;    2 details[*]
;  		3 indication		 = vc
;    	3 last_admin_dt_tm   = vc
;)
 
declare LoadOutpatOrdersOfPatient("") = i2
 
subroutine LoadOutpatOrdersOfPatient("")
	call echo("***  BEGIN - orm_rpt_meds_rec_admission_data.inc  ***")
 
 	declare RETAIL_PHARMACY = f8 with protect, constant(uar_get_code_by("MEANING", 6500, "RETAIL"))
 	declare PHARMACY_SIG_COMMENT_TYPE_CD = f8 with protect, constant(uar_get_code_by("MEANING", 14, "PHARMSIG"))
 	declare FREETEXT_DOSE = f8 with protect, noconstant(2063.0)
 	declare IND_ID = f8 with protect, noconstant(15.0)
	declare ORDERED_STAT_CD = f8 with protect, constant(uar_get_code_by("MEANING", 6004, "ORDERED"))
	declare PHARMACY_TYPE_CD = f8 with protect, constant(uar_get_code_by("MEANING", 6000, "PHARMACY"))
	declare COMPLIANCE_STAT_CD = f8 with protect, constant(uar_get_code_by("MEANING", 30254, "TAKINGASRX"))   ;005
	declare COMPLIANCE2_STAT_CD = f8 with protect, constant(uar_get_code_by("MEANING", 30254, "TAKINGNOTRX"))   ;005
	declare order_comment_cd = f8 with protect, constant(uar_get_code_by("MEANING", 14, "ORD COMMENT"))   ;006
	declare PRESCRIPT_DISCH_FLAG = i2 with protect, constant(1)
	declare RECORDED_HOME_MEDS_FLAG = i2 with protect, constant(2)
	declare NONE_TEMP_FLAG= i2 with protect, constant(0)
	declare TEMPLATE_TEMP_FLAG = i2 with protect, constant(1)
	declare FUTURE_RECUR_TEMP_FLAG = i2 with protect, constant(5)
	declare ct = i4 with protect, noconstant(size(ordersRec->orders_list, 5))
    declare back_48_hours = dq8 with protect, constant(cnvtlookbehind("2,D"))  ;008
 
;009
/****** break a long line up ******/
free record pt
record pt
( 1 line_cnt = i2
  1 lns[*]
    2 line = vc
)
set linelen = 0
declare  temp_text = vc
 
/****** break a long line up ******/
SUBROUTINE CalcLineLen( txt, maxlength )
  set c = maxlength
  set linelen = maxlength
 
  WHILE (c > maxlength-18)
    set tempchar = substring(c,1,txt)
    IF ((tempchar = " ") or (tempchar=",") or (tempchar=";"))
      set linelen=c
      set c=0
    endif
    set c = c - 1
  ENDWHILE
END ;sub
 
 
/****** break a long line up ******/
 
SUBROUTINE PARSE_TEXT( txt, maxlength )
  set holdstr = txt
  set pt->line_cnt = 0
  set stat = alterlist( pt->lns, pt->line_cnt)
 
  WHILE (textlen(trim(holdstr)) > 0 )
    set pt->line_cnt = pt->line_cnt + 1
    set stat = alterlist( pt->lns, pt->line_cnt)
    call CalcLineLen( holdstr, maxlength)
    set pt->lns[pt->line_cnt].line = substring(1,linelen,holdstr)
    set holdstr = substring( linelen+1, textlen(holdstr)-linelen, holdstr)
 
  ENDWHILE
END ;sub
;009 end
 
 
	select into "nl:"
		last_occurred = if (ocd.last_occurred_dt_tm = NULL)		;006
						cnvtdatetime(cnvtdate(01011900),0)		;006
				 	else										;006
				 		ocd.last_occurred_dt_tm					;006
				 	endif,										;006
		o.ordered_as_mnemonic,
		o.hna_order_mnemonic,
		o.clinical_display_line
 
 
	from orders o
	, order_compliance_detail ocd   	;005
	, long_text lt						;006
	, order_comment oc					;006
	, long_text lt2						;006
 
	plan o
		where o.person_id          = person_id
		and o.catalog_type_cd+0    = PHARMACY_TYPE_CD
		and o.order_status_cd+0    = ORDERED_STAT_CD
		and o.orig_ord_as_flag    in (PRESCRIPT_DISCH_FLAG, RECORDED_HOME_MEDS_FLAG)
		and o.template_order_flag in (NONE_TEMP_FLAG, TEMPLATE_TEMP_FLAG, FUTURE_RECUR_TEMP_FLAG)
		and o.active_ind           = 1
		and o.prescription_order_id = 0.0
 
	;005 Begin
	join ocd
	  where ocd.order_nbr = outerjoin(o.order_id)
	    and ocd.updt_dt_tm > outerjoin(cnvtdatetime(back_48_hours))			;008
	    ;and ocd.compliance_status_cd in(COMPLIANCE_STAT_CD,COMPLIANCE2_STAT_CD)
	;005 End
 
    join lt															;006
      where lt.long_text_id = outerjoin(ocd.long_text_id) 			;006
 
    join oc
      where oc.order_id = outerjoin(o.order_id) 					;006
        and oc.comment_type_cd = outerjoin(order_comment_cd)		;006
 
    join lt2															;006
      where lt2.long_text_id = outerjoin(oc.long_text_id) 			;006
 
	;005 order by cnvtupper(o.ordered_as_mnemonic), o.order_id
	;006 order by ocd.last_occurred_dt_tm,cnvtupper(o.ordered_as_mnemonic), o.order_id  ;005 added order of date
 	order by cnvtupper(o.ordered_as_mnemonic),o.order_id, ocd.updt_dt_tm desc  ;006 last_occurred desc,
 
 
	head o.order_id
		ct = ct + 1
		if (ct > size(ordersRec->orders_list, 5))
			stat = alterlist(ordersRec->orders_list, ct + 10)
		endif
 
	 	stat = alterlist(ordersRec->orders_list[ct].details, 1)
 
		ordersRec->orders_list[ct].order_id = o.order_id
;009		ordersRec->orders_list[ct].clinical_display_line = o.clinical_display_line
		ordersRec->orders_list[ct].clinical_display_line =
		REPLACE(o.clinical_display_line,"..."," (cont)")     ;009
 
		ordersRec->orders_list[ct].order_flag = 0
 
		if (o.ordered_as_mnemonic = o.hna_order_mnemonic)
			ordersRec->orders_list[ct].mnemonic = o.ordered_as_mnemonic
		else
			ordersRec->orders_list[ct].mnemonic = (concat(trim(o.hna_order_mnemonic), " (",trim(o.ordered_as_mnemonic), ")"))
		endif
 
		if (o.source_cd = RETAIL_PHARMACY)
			ordersRec->orders_list[ct].rx_ind = 1
		endif
	;005 Begin
	;006 detail
	    ordersRec->orders_list[ct]->details[1]->last_admin_dt_tm = format(ocd.last_occurred_dt_tm,"@SHORTDATETIME")
	    ordersRec->orders_list[ct]->details[1]->last_admin_date = format(ocd.last_occurred_dt_tm,"@SHORTDATE")   ;009
	    ordersRec->orders_list[ct]->details[1]->last_admin_time = format(ocd.last_occurred_dt_tm,"hh:mm:ss;3;M")    ;009
 
	    ordersRec->orders_list[ct]->details[1]->compliance_comments = lt.long_text 			;006
	    ordersRec->orders_list[ct]->details[1]->compliance_status = uar_get_code_display(ocd.compliance_status_cd)		;006
	    ordersRec->orders_list[ct]->details[1]->order_comments = lt2.long_text 						;006
 
	    call echo(ocd.last_occurred_dt_tm)
	;005 End
	foot report
		stat = alterlist(ordersRec->orders_list, ct)
 
	with nocounter
 
 
 
	; Check if there is no prescripition/home meds.  Adds a row to notify to show that on report
 
 	if (size(ordersRec->orders_list, 5) = 0)
		;007  start
		; setting the response phrase in case no records qualify on the order compliance table
		set ct = ct + 1
		set stat = alterlist(ordersRec->orders_list, ct)
		set ordersRec->orders_list[ct].order_flag = 0
		set ordersRec->orders_list[ct].mnemonic = "Medication History Not Performed"
 
		select into "nl:"
		from
		order_compliance oc
 
		plan oc
		where oc.encntr_id = encntr_id
 
		order oc.encntr_id, oc.performed_dt_tm desc
 
		head oc.encntr_id
		if (oc.no_known_home_meds_ind = 1)
		  ordersRec->orders_list[ct].mnemonic = "No Known Home Medications"
		elseif (oc.unable_to_obtain_ind = 1)
		  ordersRec->orders_list[ct].mnemonic = "Unable To Obtain Information"
		else
		  ordersRec->orders_list[ct].mnemonic = "Medication History Not Performed"
		endif
 
		with nocounter
		;007 end
 
		;007 set ct = ct + 1
		;007 set stat = alterlist(ordersRec->orders_list, ct)
		;007 set ordersRec->orders_list[ct].order_flag = 0
		;007 set ordersRec->orders_list[ct].mnemonic =
			;007  uar_i18ngetmessage(_hI18NHandle,"no_outpatient_order_qualify", "No known prescription/home medication orders.")
 	else
 
		set iterations = size(ordersRec->orders_list, 5)
		set stat = 0
 
		select into "nl:"
			od.oe_field_meaning_id,
			od.oe_field_display_value,
			oc.long_text_id,
			lt.long_text
 
		from (dummyt d2 with seq = value(iterations)),
			order_detail od,
			order_comment oc,
			long_text lt
 
		plan d2
 
		join od
			where od.order_id = ordersRec->orders_list[d2.seq].order_id and od.oe_field_meaning_id in(FREETEXT_DOSE, IND_ID)
 
		join oc
			where oc.order_id = outerjoin(od.order_id) and oc.comment_type_cd = outerjoin(PHARMACY_SIG_COMMENT_TYPE_CD)
 
		join lt
			where lt.long_text_id = outerjoin(oc.long_text_id)
 
		order by od.order_id, od.oe_field_meaning_id, od.action_sequence, oc.action_sequence desc
 
 		head od.order_id
 
 		x = 0
 
		head od.oe_field_meaning_id
 
			if (od.oe_field_meaning_id = IND_ID)
				ordersRec->orders_list[d2.seq].details[1].indication = od.oe_field_display_value
			endif
 
			if ((od.oe_field_meaning_id = FREETEXT_DOSE) and (size(od.oe_field_display_value) > 0) and
			   (ordersRec->orders_list[d2.seq].rx_ind = 1) and (oc.long_text_id > 0.0))
 
				if (size(ordersRec->orders_list[d2.seq].clinical_display_line) = 0)
					ordersRec->orders_list[d2.seq].clinical_display_line = trim(lt.long_text)
				else
					ordersRec->orders_list[d2.seq].clinical_display_line = concat(trim(lt.long_text), ", ",
																	ordersRec->orders_list[d2.seq].clinical_display_line)
				endif
			endif
		with nocounter
	endif
 
;009 start
	if (size(ordersRec->orders_list, 5) > 0) ; 009 check wrap text
	   for (o_cnt = 1 to size(ordersRec->orders_list, 5))
	      set temp_text = concat(ordersRec->orders_list [o_cnt].mnemonic, " ",
	      ordersRec->orders_list[o_cnt].clinical_display_line)
	      call parse_text(temp_text,41)
	      for (t_cnt = 1 to pt->line_cnt)
	         set stat = alterlist(ordersRec->orders_list[o_cnt].med_lines,t_cnt)
	         set ordersRec->orders_list[o_cnt].med_lines[t_cnt].text = pt->lns[t_cnt].line
          endfor
          for (d_cnt = 1 to size(ordersRec->orders_list[o_cnt].details,5))
		      set temp_text = concat("Comments:  ",
		      ordersRec->orders_list[o_cnt].details[d_cnt].compliance_comments)
		      call parse_text(temp_text,90)
		      for (t_cnt = 1 to pt->line_cnt)
		         set stat = alterlist(ordersRec->orders_list[o_cnt].details[d_cnt].comp_comment_lines,t_cnt)
		         set ordersRec->orders_list[o_cnt].details[d_cnt].comp_comment_lines[t_cnt].text
		         															= pt->lns[t_cnt].line
		      endfor
 
		      set temp_text = concat("Order Comments:  ",
		      	ordersRec->orders_list[o_cnt].details[d_cnt].order_comments)
		      call parse_text(temp_text,90)
		      for (t_cnt = 1 to pt->line_cnt)
		         set stat = alterlist(ordersRec->orders_list[o_cnt].details[d_cnt].ord_comment_lines,t_cnt)
		         set ordersRec->orders_list[o_cnt].details[d_cnt].ord_comment_lines[t_cnt].text
		         															= pt->lns[t_cnt].line
		      endfor
	      endfor
 
	   endfor
	  endif
;009 end
; 	call echorecord(ordersRec)
 	call echo("***  END - orm_rpt_meds_rec_admission_data.inc  ***")
 
 	return (SUCCESS)
end
set last_mod = "007"
set mod_date = "07/28/10"
 
 
 
 
 
 
 
 

