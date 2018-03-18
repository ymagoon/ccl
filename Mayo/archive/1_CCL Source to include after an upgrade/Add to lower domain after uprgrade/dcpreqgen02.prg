 
/*~BB~************************************************************************
      *                                                                      *
      *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
      *                              Technology, Inc.                        *
      *       Revision      (c) 1984-1995 Cerner Corporation                 *
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
 
        Source file name:     	CERN_DCPREQGEN02.PRG
        Object name:           	dcpreqgen02
        Request #:             	N/A
 
        Product:               	PowerChart
        Product Team:          	Order Management
        HNA Version:            500
        CCL Version:
 
        Program purpose:
 
        Tables read:
 
        Tables updated:
 
        Executing from:
 
        Special Notes:
 
******************************************************************************/
;~DB~************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *                                                                      *
;    *Mod Date     Engineer             Comment                             *
;    *--- -------- -------------------- ----------------------------------- *
;    *002 09/08/00 SB3282               Fix field printing twice            *
;    *004 05/01/05 LP010060             Fix multiple order details defects  *
;    *005 05/26/05 RM010964             Fix printing age, height and weight *
;    *006 04/10/06 AT012526             Order details with multiple lines   *
;                                       print correctly (CR 1-365117141)    *
;                                       Reduced unnecessary calls to script *
;                                       dcp_parse_text.                     *
;                                       Allow for page breaks               *
;    *007 12/13/06 KS012546             CR 1-853090761 - Orders requiring   *
;                                       dr. cosign are not printing a       *
;                                       requisition.                        *
;    *008 11/14/07 NV013841             More than two lines of allergies    *
;                                       prompts that the patient has        *
;                                       additional allergies.CR 1-899593881 *
;    *009 04/17/07 GG013711             Added Free set for various records  * 
;    *010 06/12/07 SH016288             Add Modify, & Discontinue Banner Bar*
;                                       CR 1-899593932                      * 
;                                       CR 1-899593932 & CR 1-1127184359    *
;    *011 06/05/07 SH016288             Remove activity&catalogCR1-919486213*
;    *012 06/05/07 SH016288             Add printing on activate action     *
;                                       Removed print on future action      *
;                                       CR 1-1127184331                     *
;    *013 06/12/07 SH016288             Remove time zone on dob and admit   *
;                                       CR 1-919486297                      *
;    *014 06/05/07 SH016288             Remove dcpreq02 CR 1-919486121      *
;    *015 06/05/07 SH016288             Move order details up by half of    *
;                                       the space available                 *
;                                       CR 1-1127184340                     *
;    *016 06/05/07 SH016288             Add ordered time to order d/t       *
;                                       display time zone if utc            *
;                                       CR 1-919486328                      *
;    *017 06/05/07 SH016288             DOB one day off CR 1-1065284374     *
;    *018 06/20/07 SH016288             Requisition tries to print the total*
;                                       number of orders instead of orders  *
;                                       that count                          *
;                                       CR 1-1162354921                     *
;	 *019 08/07/07 RD012555 			Add ellipsis to mnemonics that are 	*
;										truncated.   						*
;	 *020 09/25/07 MK012585 			Fix to display Dt/Tm fields         *
;                                       correctly when UTC is on            *
;    *021 10/05/07 MK012585             Fix to format the time correctly    *
;                                       when UTC is on                      *
;    *022 10/10/07 MK012585             Fix to display the time in military *
;                                       format                              *
;    *023 08/20/08 KK014173             Update the subscript to print the   *
;                                        correct comments of the orders.    *
;    *024 04/04/09 KW8277               Correction for orders that do not   *
;                                       qualify to print, being printed on  *
;                                       multi-action. CR 1-2898209013       *
;    *025 02/05/09 MK012585             Join Order_action table using       *
;                                       conversation_id if one is passed in.*
;	 *026 06/05/09 AS017690				Complex Med Changes					*
;    *027 08/20/09 AD010624             Replace > " " comparisons with      *
;                                       size() > 0, trim both sides of order*
;                                       details instead of right side only  *
;    *028 10/31/09 SK018443             If the admitting dx string length is*
;					                    greater than the display area,      *
;				                      	truncate and add ellipsis	        *
;    *029 11/05/09 RD012555             Do not print for Protocols          *
;	 *030 10/17/11 KM019227		    	If special instruction is exceeding *
;										the page limit then break the line 	*
;	 *031 12/13/11 KM019227				If order label text longer than the *
;										order detail value text then print  *
;										order detail on next page	        *
;    *032 12/22/11 SS019071				Globalization Regional locale support*
;    *033 04/25/12 KK023353             CR 1-5689212177 - Admit Date        *
;                                       displays a day early on DCPREQGEN0x *
;                                       when UTC is enabled                 *
;	 *034 09/06/12 KM019227 			Display most recent comment entered *
;	 *035 10/16/12 VK020525				CR 1-6343700374						*
;										Do not truncate order comments		*
;										displayed in each line.				*
;    *036 04/04/13 PB027274             Fixed incorrect conversion of DOB   *
;                                       from UTC to local by adding birth   *
;                                       timezone.                           *
;    *037 07/22/13 BK024219             Reverted the changes done in 		*
;										previous check-in and removing the 	*
;                                       line which was overriding the value *
;                                       as label text for field type yes/no.*
;~DE~************************************************************************
 
drop program dcpreqgen02:dba go
create program dcpreqgen02:dba

;Request structure always be present as the first record
;declaration as Output server calls CCLSET_RECORD without
;passing in a record structure name. The memory gets allocated
;to this request definition
 
record request
( 1 person_id = f8
  1 print_prsnl_id = f8
  1 order_qual[*]
    2 order_id = f8
    2 encntr_id = f8
    2 conversation_id = f8
  1 printer_name = c50
)
; mod 009
free set orders
free set allergy
free set diagnosis
free set pt
 
record orders
( 1 name = vc
  1 age = vc
  1 dob = vc
  1 mrn = vc
  1 location = vc
  1 facility = vc
  1 nurse_unit = vc
  1 room = vc
  1 bed = vc
  1 sex = vc
  1 fnbr = vc
  1 med_service = vc
  1 admit_diagnosis = vc
  1 height = vc
  1 weight = vc
  1 admit_dt = vc
  1 attending = vc
  1 admitting = vc
  1 order_location = VC
  1 spoolout_ind = i2
  1 cnt = i2
  1 qual[*]
    2 order_id = f8
    2 display_ind = i2
    2 template_order_flag = i2
    2 cs_flag = i2
    2 iv_ind = i2
    2 mnemonic = vc
    2 mnem_ln_cnt = i2
    2 mnem_ln_qual[*]
      3 mnem_line = vc
    2 display_line = vc
    2 disp_ln_cnt = i2
    2 disp_ln_qual[*]
      3 disp_line = vc
    2 order_dt = vc
    2 signed_dt = vc
    2 status = vc
    2 accession = vc
    2 catalog = vc
    2 catalog_type_cd = f8
    2 activity = vc
    2 activity_type_cd = f8
    2 last_action_seq = i4
    2 enter_by = vc
    2 order_dr = vc
    2 type = vc
    2 action = vc
    2 action_type_cd = f8
    2 comment_ind = i2
    2 comment = vc
    2 com_ln_cnt = i2
    2 com_ln_qual[*]
      3 com_line = vc
    2 oe_format_id = f8
    2 clin_line_ind = i2
    2 stat_ind = i2
    2 d_cnt = i2
    2 d_qual[*]
      3 field_description = vc
      3 label_text = vc
      3 value = vc
      3 value_cnt = i2
      3 value_qual[*]
      	4 value_line = vc
      3 field_value = f8
      3 oe_field_meaning_id = f8
      3 group_seq = i4
      3 print_ind = i2
      3 clin_line_ind = i2
      3 label = vc
      3 suffix = i2
      3 field_type_flag = i2
    2 priority = vc
    2 req_st_dt = vc
    2 frequency = vc
    2 rate = vc
    2 duration = vc
    2 duration_unit = vc
    2 nurse_collect = vc
    2 fmt_action_cd = f8
)
 
record allergy
( 1 cnt = i2
  1 qual[*]
    2 list = vc
  1 line = vc
  1 line_cnt = i2
  1 line_qual[*]
    2 line = vc
)
 
record diagnosis
( 1 cnt = i2
  1 qual[*]
    2 diag = vc
  1 dline = vc
  1 dline_cnt = i2
  1 dline_qual[*]
    2 dline = vc
)
 
record pt
( 1 line_cnt = i2
  1 lns[*]
    2 line = vc
)
 
/*****************************************************************************
*    Program Driver Variables                                                *
*****************************************************************************/
 
declare order_cnt      = i4 with protect, noconstant(size(request->order_qual,5))
declare ord_cnt        = i4 with protect, noconstant(size(request->order_qual,5));018
set stat = alterlist(orders->qual,order_cnt)
 
declare person_id      = f8 with protect, noconstant(0.0)
declare encntr_id      = f8 with protect, noconstant(0.0)
 
set orders->spoolout_ind = 0
set pharm_flag = 0     ; Set to 1 if you want to pull the MNEM_DISP_LEVEL and IV_DISP_LEVEL from the tables.
 
declare mrn_alias_cd   = f8 with protect, constant(uar_get_code_by("MEANING", 4, "MRN"))
declare comment_cd     = f8 with protect, constant(uar_get_code_by("MEANING", 14, "ORD COMMENT"))
declare fnbr_cd        = f8 with protect, constant(uar_get_code_by("MEANING", 319, "FIN NBR"))
declare admit_doc_cd   = f8 with protect, constant(uar_get_code_by("MEANING", 333, "ADMITDOC"))
declare attend_doc_cd  = f8 with protect, constant(uar_get_code_by("MEANING", 333, "ATTENDDOC"))
declare canceled_cd    = f8 with protect, constant(uar_get_code_by("MEANING", 12025, "CANCELED"))
declare inerror_cd     = f8 with protect, constant(uar_get_code_by("MEANING", 8, "INERROR"))
declare pharmacy_cd    = f8 with protect, constant(uar_get_code_by("MEANING", 6000, "PHARMACY"))
declare iv_cd          = f8 with protect, constant(uar_get_code_by("MEANING", 16389, "IVSOLUTIONS"))
declare complete_cd    = f8 with protect, constant(uar_get_code_by("MEANING", 6003, "COMPLETE"))
declare modify_cd      = f8 with protect, constant(uar_get_code_by("MEANING", 6003, "MODIFY"))
declare order_cd       = f8 with protect, constant(uar_get_code_by("MEANING", 6003, "ORDER"))
declare cancel_cd      = f8 with protect, constant(uar_get_code_by("MEANING", 6003, "CANCEL"))
declare discont_cd     = f8 with protect, constant(uar_get_code_by("MEANING", 6003, "DISCONTINUE"))
declare studactivate_cd = f8 with protect, constant(uar_get_code_by("MEANING", 6003, "STUDACTIVATE")) ;007
declare activate_cd    = f8 with protect, constant(uar_get_code_by("MEANING", 6003, "ACTIVATE")) ;011
declare void_cd    = f8 with protect, constant(uar_get_code_by("MEANING", 6003, "VOID"))				;026
declare suspend_cd    = f8 with protect, constant(uar_get_code_by("MEANING", 6003, "SUSPEND"))			;026
declare resume_cd    = f8 with protect, constant(uar_get_code_by("MEANING", 6003, "RESUME"))			;026
declare intermittent_cd = f8 with protect, constant(uar_get_code_by("MEANING", 18309, "INTERMITTENT")) 	;026
 
declare last_mod = c3 with private, noconstant(fillstring(3, "000"))
declare offset = i2 with protect, noconstant(0)
declare daylight = i2 with protect, noconstant(0)
declare saved_pos = i4 with protect, noconstant(0)
declare max_length = i4 with protect, noconstant(0)
declare xcol = i4 with protect, noconstant(0)
declare ycol = i4 with protect, noconstant(0)

declare mnemonic_size = i4 with protect, noconstant(0)	;019
declare mnem_length = i4 with protect, noconstant(0)	;019

/******************************************************************************
*     PATIENT INFORMATION                                                     *
******************************************************************************/
 
select into "nl:"
from person p,
     encounter e,
     person_alias pa,
     encntr_alias ea,
     encntr_prsnl_reltn epr,
     prsnl pl,
    (dummyt d1 with seq = 1),
    (dummyt d2 with seq = 1),
    (dummyt d3 with seq = 1)
  ,encntr_loc_hist elh
  ,time_zone_r t
plan p
  where p.person_id = request->person_id
join e
  where e.encntr_id = request->order_qual[1].encntr_id
join elh
  where elh.encntr_id = e.encntr_id
join t
  where t.parent_entity_id = outerjoin(elh.loc_facility_cd)
   and t.parent_entity_name = outerjoin("LOCATION")
join d1
join pa
  where pa.person_id = p.person_id
    and pa.person_alias_type_cd = mrn_alias_cd
    and pa.active_ind = 1
    and pa.beg_effective_dt_tm < cnvtdatetime(curdate,curtime3)
    and pa.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
join d2
join ea
  where ea.encntr_id = e.encntr_id
    and ea.encntr_alias_type_cd = fnbr_cd
    and ea.active_ind = 1
join d3
join epr
  where epr.encntr_id = e.encntr_id
    and (epr.encntr_prsnl_r_cd = admit_doc_cd
         or epr.encntr_prsnl_r_cd = attend_doc_cd)
    and epr.active_ind = 1
join pl
  where pl.person_id = epr.prsnl_person_id
head report
  person_id = p.person_id
  encntr_id = e.encntr_id
  orders->name = p.name_full_formatted
  orders->sex = uar_get_code_display(p.sex_cd)
  orders->age = cnvtage(p.birth_dt_tm) ;005

  orders->dob = format(cnvtdatetimeutc(datetimezone(p.birth_dt_tm,p.birth_tz),1),"@SHORTDATE") ;036
  orders->admit_dt = format(e.reg_dt_tm, "@SHORTDATE")	;033
  orders->facility = uar_get_code_description(e.loc_facility_cd)
  orders->nurse_unit = uar_get_code_display(e.loc_nurse_unit_cd)
  orders->room = uar_get_code_display(e.loc_room_cd)
  orders->bed = uar_get_code_display(e.loc_bed_cd)
  orders->location = concat(trim(orders->nurse_unit),"/",trim(orders->room),"/",
    trim(orders->bed))
  orders->admit_diagnosis = trim(e.reason_for_visit , 3)
  orders->med_service = uar_get_code_display(e.med_service_cd)
head epr.encntr_prsnl_r_cd
  if (epr.encntr_prsnl_r_cd = admit_doc_cd)
    orders->admitting = pl.name_full_formatted
  elseif (epr.encntr_prsnl_r_cd = attend_doc_cd)
    orders->attending = pl.name_full_formatted
  endif
detail
  if (pa.person_alias_type_cd = mrn_alias_cd)
    if (pa.alias_pool_cd > 0)
      orders->mrn = cnvtalias(pa.alias,pa.alias_pool_cd)
    else
      orders->mrn = pa.alias
    endif
  endif
  if (ea.encntr_alias_type_cd = fnbr_cd)
    if (ea.alias_pool_cd > 0)
      orders->fnbr = cnvtalias(ea.alias,ea.alias_pool_cd)
    else
      orders->fnbr = ea.alias
    endif
  endif
with nocounter,outerjoin=d1,dontcare=pa,outerjoin=d2,dontcare=ea,
  outerjoin=d3,dontcare=epr
 
/*****************************************************************************
*     CLINICAL EVENT INFORMATION                                             *
******************************************************************************/
 
set height_cd = uar_get_code_by("DISPLAYKEY", 72, "CLINICALHEIGHT")	;005 BEGIN
set weight_cd = uar_get_code_by("DISPLAYKEY", 72, "CLINICALWEIGHT")
 
;select into "nl:"
;from code_value cv
;plan cv
;  where cv.code_set = 72
;    and cv.display_key in ("CLINICALHEIGHT","CLINICALWEIGHT")
;    and cv.active_ind = 1
;detail
;  case (cv.display_key)
;  of "CLINICALHEIGHT":
;    height_cd = cv.code_value
;  of "CLINICALWEIGHT":
;    weight_cd = cv.code_value
;  endcase
;with nocounter
;005 END
 
select into "nl:"
from clinical_event c
plan c
  where c.person_id = person_id
;   and c.encntr_id = encntr_id  ;005
    and c.event_cd in (height_cd,weight_cd)
    and c.view_level = 1
    and c.publish_flag = 1
    and c.valid_until_dt_tm = cnvtdatetime("31-DEC-2100,00:00:00")
    and c.result_status_cd != inerror_cd
order c.event_end_dt_tm
detail
  if (c.event_cd = height_cd)
    orders->height = concat(trim(c.event_tag)," ",
      trim(uar_get_code_display(c.result_units_cd)))
  elseif (c.event_cd = weight_cd)
    orders->weight = concat(trim(c.event_tag)," ",
      trim(uar_get_code_display(c.result_units_cd)))
  endif
with nocounter
 
/******************************************************************************
*     FIND ACTIVE ALLERGIES AND CREATE ALLERGY LINE                           *
******************************************************************************/
 
select into "nl:"
from allergy a,
  (dummyt d with seq = 1),
  nomenclature n
plan a
  where a.person_id = request->person_id
    and a.active_ind = 1
    and a.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
    and (a.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
      or a.end_effective_dt_tm = NULL)
    and a.reaction_status_cd != canceled_cd
join d
join n
  where n.nomenclature_id = a.substance_nom_id
order cnvtdatetime(a.onset_dt_tm)
head report
  allergy->cnt = 0
detail
  if (size(n.source_string,1) > 0 or size(a.substance_ftdesc,1) > 0)     ;027
    allergy->cnt = allergy->cnt + 1
    stat = alterlist(allergy->qual,allergy->cnt)
    allergy->qual[allergy->cnt].list = a.substance_ftdesc
    if (size(n.source_string,1) > 0)     ;027
      allergy->qual[allergy->cnt].list = n.source_string
    endif
  endif
with nocounter,outerjoin=d,dontcare=n
 
for (x = 1 to allergy->cnt)
  if (x = 1)
    set allergy->line = allergy->qual[x].list
  else
    set allergy->line = concat(trim(allergy->line),", ",
      trim(allergy->qual[x].list))
  endif
endfor
 
if (allergy->cnt > 0)
   set pt->line_cnt = 0
   set max_length = 86
   execute dcp_parse_text value(allergy->line), value(max_length)
   set stat = alterlist(allergy->line_qual, pt->line_cnt)
   set allergy->line_cnt = pt->line_cnt
   for (x = 1 to pt->line_cnt)
     set allergy->line_qual[x].line = pt->lns[x].line
   endfor
endif
 
/******************************************************************************
*     USED FOR THE MNEMONIC ON PHARMACY ORDERS                                *
******************************************************************************/
 
set mnem_disp_level = "1"
set iv_disp_level = "0"
 
if (pharm_flag = 1)
   select into "nl:"
   from name_value_prefs n,app_prefs a
   plan n
     where n.pvc_name in ("MNEM_DISP_LEVEL","IV_DISP_LEVEL")
   join a
     where a.app_prefs_id = n.parent_entity_id
       and a.prsnl_id = 0
       and a.position_cd = 0
   detail
     if (n.pvc_name = "MNEM_DISP_LEVEL"
     and n.pvc_value in ("0","1","2"))
       mnem_disp_level = n.pvc_value
     elseif (n.pvc_name = "IV_DISP_LEVEL"
     and n.pvc_value in ("0","1"))
       iv_disp_level = n.pvc_value
     endif
   with nocounter
endif
 
/******************************************************************************
*     ORDER LEVEL INFORMATION                                                 *
******************************************************************************/
declare oiCnt = i4 with protect, noconstant(0)
set ord_cnt = 0
set oiCnt = 0										;026
set max_length = 70									;018
 
select into "nl:"
from  orders o,
      order_action oa,
      prsnl pl,
      prsnl pl2,
      ;oe_format_fields oef,
      (dummyt d1 with seq = value(order_cnt)),
      (dummyt d2 with seq = value(order_cnt)),
      order_ingredient oi	      					;026
plan d1
join o
  where o.order_id = request->order_qual[d1.seq].order_id
join oa
  where oa.order_id = o.order_id
    and ((request->order_qual[d1.seq].conversation_id > 0 and    ;025
          oa.order_conversation_id = request->order_qual[d1.seq].conversation_id) or
          (request->order_qual[d1.seq].conversation_id <= 0 and oa.action_sequence = o.last_action_sequence))
join pl
  where pl.person_id = oa.action_personnel_id
join pl2
  where pl2.person_id = oa.order_provider_id
join d2
  join oi where o.order_id = oi.order_id							;026
	and o.last_ingred_action_sequence = oi.action_sequence			;026
 
order by o.oe_format_id, o.activity_type_cd, o.current_start_dt_tm
 
head report
  orders->order_location = trim(uar_get_code_display(oa.order_locn_cd))
  mnemonic_size = size(o.hna_order_mnemonic,3) - 1	;019

head o.order_id
  ord_cnt = ord_cnt + 1
  orders->qual[ord_cnt].status = uar_get_code_display(o.order_status_cd)
  orders->qual[ord_cnt].catalog = uar_get_code_display(o.catalog_type_cd)
  orders->qual[ord_cnt].catalog_type_cd = o.catalog_type_cd
  orders->qual[ord_cnt].activity = uar_get_code_display(o.activity_type_cd)
  orders->qual[ord_cnt]->activity_type_cd = o.activity_type_cd
  orders->qual[ord_cnt].display_line = o.clinical_display_line
  orders->qual[ord_cnt].order_id = o.order_id
  orders->qual[ord_cnt].display_ind = 1
  orders->qual[ord_cnt].template_order_flag = o.template_order_flag
  orders->qual[ord_cnt].cs_flag = o.cs_flag
  orders->qual[ord_cnt].oe_format_id = o.oe_format_id
  if (size(substring(245,10,o.clinical_display_line),1) > 0)     ;027
    orders->qual[ord_cnt].clin_line_ind = 1
  else
    orders->qual[ord_cnt].clin_line_ind = 0
  endif
  
  ;BEGIN 019  
  mnem_length = size(trim(o.hna_order_mnemonic),1)
  if (mnem_length >= mnemonic_size
  	  and SUBSTRING(mnem_length - 3, mnem_length, o.hna_order_mnemonic) != "...")
  	orders->qual[ord_cnt].mnemonic = concat(cnvtupper(trim(o.hna_order_mnemonic)), "...")
  else
    orders->qual[ord_cnt].mnemonic = cnvtupper(trim(o.hna_order_mnemonic))
  endif
  ;END 019
;019  orders->qual[ord_cnt].mnemonic = cnvtupper(trim(o.hna_order_mnemonic))
 
  if (CURUTC>0);Begin 016
    orders->qual[ord_cnt].order_dt =  trim(concat(trim(DATETIMEZONEFORMAT(oa.order_dt_tm,oa.order_tz,"@SHORTDATETIMENOSEC")), " ",
	trim(DATETIMEZONEFORMAT(oa.order_dt_tm,oa.order_tz,"ZZZ"))))

    orders->qual[ord_cnt].signed_dt = trim(concat(trim(DATETIMEZONEFORMAT(oa.order_dt_tm,oa.order_tz,"@SHORTDATETIMENOSEC")), " ",
	trim(DATETIMEZONEFORMAT(oa.order_dt_tm,oa.order_tz,"ZZZ"))))
  else
    orders->qual[ord_cnt].order_dt = format(oa.order_dt_tm, "@SHORTDATETIMENOSEC")
    orders->qual[ord_cnt].signed_dt = format(o.orig_order_dt_tm, "@SHORTDATETIMENOSEC")
  endif ;END 016  
  orders->qual[ord_cnt].comment_ind = o.order_comment_ind
  orders->qual[ord_cnt].last_action_seq = o.last_action_sequence
  orders->qual[ord_cnt].enter_by = pl.name_full_formatted
  orders->qual[ord_cnt].order_dr = pl2.name_full_formatted
  orders->qual[ord_cnt].type = uar_get_code_display(oa.communication_type_cd)
  orders->qual[ord_cnt].action_type_cd = oa.action_type_cd
  orders->qual[ord_cnt].action = uar_get_code_display(oa.action_type_cd)
  orders->qual[ord_cnt].iv_ind = o.iv_ind
  if (o.dcp_clin_cat_cd = iv_cd)
    orders->qual[ord_cnt].iv_ind = 1
  endif
 
  head oi.comp_sequence																;026
   if (oi.comp_sequence >0 and o.med_order_type_cd = intermittent_cd)				;026
     ;if the order ingredient is a diluent	and is clinically significant			;026
     if (oi.ingredient_type_flag = 2 and oi.clinically_significant_flag = 2)		;026
       oiCnt = oiCnt + 1															;026
       ;if the order ingredient is a additive										;026
     else if (oi.ingredient_type_flag = 3)											;026
       oiCnt = oiCnt + 1															;026
     endif																			;026
    endif																			;026
  endif																				;026
 
  foot o.order_id																									;026
  if (o.catalog_type_cd = pharmacy_cd)																				;026
    if (o.iv_ind = 1 or (o.med_order_type_cd = intermittent_cd and oiCnt > 1) )										;026
	  if (iv_disp_level = "1")																						;026
	 	;if the display text is larger then the print area , add the '...' at the end								;026
		mnem_length = size(trim(o.ordered_as_mnemonic),1)															;026
	 	if (mnem_length > max_length)																				;026
	 	  orders->qual[ord_cnt].mnemonic = trim(concat(substring(1, max_length-3, o.ordered_as_mnemonic), "..."))	;026
	 	else																										;026
	 	  orders->qual[ord_cnt].mnemonic = o.ordered_as_mnemonic													;026
	 	endif	 																									;026
	  else			  																								;026
	 	;if the display text is larger then the print area , add the '...' at the end								;026
		mnem_length = size(trim(o.hna_order_mnemonic),1)															;026
	 	if (mnem_length > max_length)																				;026
	 	  orders->qual[ord_cnt].mnemonic = trim(concat(substring(1, max_length-3, o.hna_order_mnemonic), "..."))	;026
	 	else																										;026
	 	  orders->qual[ord_cnt].mnemonic = o.hna_order_mnemonic														;026
	 	endif	 																									;026
	  endif		  																									;026
  else 																												;026
    if (mnem_disp_level = "0")
	  ;BEGIN 019  
	  mnem_length = size(trim(o.hna_order_mnemonic),1)  
	  if (mnem_length >= mnemonic_size
	  	  and SUBSTRING(mnem_length - 3, mnem_length, o.hna_order_mnemonic) != "...")
	  	orders->qual[ord_cnt].mnemonic = concat(trim(o.hna_order_mnemonic), "...")
	  else
	    orders->qual[ord_cnt].mnemonic = trim(o.hna_order_mnemonic)
	  endif
	  ;END 019    	                   
;019      orders->qual[ord_cnt].mnemonic = trim(o.hna_order_mnemonic)
    endif
    if (mnem_disp_level = "1")
      if (o.hna_order_mnemonic = o.ordered_as_mnemonic
      or size(o.ordered_as_mnemonic,1) = 0)     ;027
      	;BEGIN 019  
      	mnem_length = size(trim(o.hna_order_mnemonic),1) 
	    if (mnem_length >= mnemonic_size
	    	and SUBSTRING(mnem_length - 3, mnem_length, o.hna_order_mnemonic) != "...")
	  	  orders->qual[ord_cnt].mnemonic = concat(trim(o.hna_order_mnemonic), "...")
	    else
	      orders->qual[ord_cnt].mnemonic = trim(o.hna_order_mnemonic)
	    endif
	    ;END 019 
;019        orders->qual[ord_cnt].mnemonic = trim(o.hna_order_mnemonic)
      else
      	;BEGIN 019  
      	mnem_length = size(trim(o.hna_order_mnemonic),1)  
	    if (mnem_length >= mnemonic_size
	    	and SUBSTRING(mnem_length - 3, mnem_length, o.hna_order_mnemonic) != "...")
	  	  orders->qual[ord_cnt].mnemonic = concat(trim(o.hna_order_mnemonic), "...")
	    else
	      orders->qual[ord_cnt].mnemonic = trim(o.hna_order_mnemonic)
	    endif
	    
	    mnem_length = size(trim(o.ordered_as_mnemonic),1)
	    if (mnem_length >= mnemonic_size
	    	and SUBSTRING(mnem_length - 3, mnem_length, o.ordered_as_mnemonic) != "...")
	  	  orders->qual[ord_cnt].mnemonic = concat(orders->qual[ord_cnt].mnemonic,"(",trim(o.ordered_as_mnemonic),"...)")
	    else
	      orders->qual[ord_cnt].mnemonic = concat(orders->qual[ord_cnt].mnemonic,"(",trim(o.ordered_as_mnemonic),")")
	    endif
	    ;END 019
;019        orders->qual[ord_cnt].mnemonic = concat(trim(o.hna_order_mnemonic),"(",trim(o.ordered_as_mnemonic),")")
      endif
    endif
    if (mnem_disp_level = "2" and o.iv_ind != 1)
      if (o.hna_order_mnemonic = o.ordered_as_mnemonic
      or size(o.ordered_as_mnemonic,1) = 0)     ;027
      	;BEGIN 019  
      	mnem_length = size(trim(o.hna_order_mnemonic),1)
	    if (mnem_length >= mnemonic_size
	    	and SUBSTRING(mnem_length - 3, mnem_length, o.hna_order_mnemonic) != "...")
	  	  orders->qual[ord_cnt].mnemonic = concat(trim(o.hna_order_mnemonic), "...")
	    else
	      orders->qual[ord_cnt].mnemonic = trim(o.hna_order_mnemonic)
	    endif
	    ;END 019
;019        orders->qual[ord_cnt].mnemonic = trim(o.hna_order_mnemonic)
      else
      	;BEGIN 019  
      	mnem_length = size(trim(o.hna_order_mnemonic),1)
	    if (mnem_length >= mnemonic_size
	    	and SUBSTRING(mnem_length - 3, mnem_length, o.hna_order_mnemonic) != "...")
	  	  orders->qual[ord_cnt].mnemonic = concat(trim(o.hna_order_mnemonic), "...")
	    else
	      orders->qual[ord_cnt].mnemonic = trim(o.hna_order_mnemonic)
	    endif
	    
	    mnem_length = size(trim(o.ordered_as_mnemonic),1)
	    if (mnem_length >= mnemonic_size
	    	and SUBSTRING(mnem_length - 3, mnem_length, o.ordered_as_mnemonic) != "...")
	  	  orders->qual[ord_cnt].mnemonic = concat(orders->qual[ord_cnt].mnemonic,"(",trim(o.ordered_as_mnemonic),"...)")
	    else
	      orders->qual[ord_cnt].mnemonic = concat(orders->qual[ord_cnt].mnemonic,"(",trim(o.ordered_as_mnemonic),")")
	    endif
	    ;END 019
;019        orders->qual[ord_cnt].mnemonic = concat(trim(o.hna_order_mnemonic),"(",trim(o.ordered_as_mnemonic),")")
      endif
      if (o.order_mnemonic != o.ordered_as_mnemonic and size(o.order_mnemonic,1) > 0)     ;027
      	;BEGIN 019
      	mnem_length = size(trim(o.order_mnemonic),1)
      	if (mnem_length >= mnemonic_size
      		and SUBSTRING(mnem_length - 3, mnem_length, o.order_mnemonic) != "...")
	  	  orders->qual[ord_cnt].mnemonic = concat(trim(orders->qual[ord_cnt].mnemonic),"(",trim(o.order_mnemonic),"...)")
	    else
	      orders->qual[ord_cnt].mnemonic = concat(trim(orders->qual[ord_cnt].mnemonic),"(",trim(o.order_mnemonic),")")
	    endif
	    ;END 019
;019        orders->qual[ord_cnt].mnemonic = concat(trim(orders->qual[ord_cnt].mnemonic),"(",trim(o.order_mnemonic),")")
      endif
    endif
  endif
 endif																							;026
 
  if (oa.action_type_cd in (order_cd, suspend_cd, resume_cd, cancel_cd, discont_cd, void_cd))	;026
    orders->qual[ord_cnt].fmt_action_cd = oa.action_type_cd
  else
    orders->qual[ord_cnt].fmt_action_cd = order_cd
  endif
 
/*****************************************************************************
 *Put logic in here if you want to keep certain types of orders to not print *
 *May be things like complete orders/continuing orders/etc..                 *
 *****************************************************************************/
 
;if (oa.action_type_cd in (order_cd,modify_cd,cancel_cd,discont_cd,studactivate_cd)) ;007 012 
  if ((oa.action_type_cd in (order_cd,modify_cd,cancel_cd,discont_cd,activate_cd,studactivate_cd)) AND o.encntr_id>0  ;012
      AND o.template_order_flag != 7) ;029
     orders->qual[ord_cnt].display_ind = 1
     orders->spoolout_ind = 1
  else
     orders->qual[ord_cnt].display_ind = 0
  endif
 
with outerjoin = d2, nocounter
 
/******************************************************************************
*  GET ORDER DETAIL INFORMATION                                               *
******************************************************************************/
 
select into "nl:"
from order_detail od,
     oe_format_fields oef,
     order_entry_fields of1,
     (dummyt d1 with seq = value(order_cnt))
 
plan d1
  join od
    where orders->qual[d1.seq].order_id = od.order_id
  join oef
    where oef.oe_format_id = orders->qual[d1.seq].oe_format_id
      and oef.action_type_cd = orders->qual[d1.seq].fmt_action_cd
      and oef.oe_field_id = od.oe_field_id
  join of1
    where of1.oe_field_id = oef.oe_field_id
  order by od.order_id, od.oe_field_id, od.action_sequence desc
 
;if order details need to print in the order on the format...try this order by
; order by od.order_id,oef.group_seq,oef.field_seq,od.oe_field_id,
;          od.action_sequence desc
 
  head report
    orders->qual[d1.seq].d_cnt = 0
  head od.order_id
    stat = alterlist(orders->qual[d1.seq].d_qual,5)
    orders->qual[d1.seq].stat_ind = 0
  head od.oe_field_id
    act_seq = od.action_sequence
    odflag = 1
    if (od.oe_field_meaning = "COLLPRI" or
        od.oe_field_meaning = "PRIORITY")
      orders->qual[d1.seq].priority = od.oe_field_display_value
    endif
    if (od.oe_field_meaning = "REQSTARTDTTM")
      if (CURUTC>0) ;Begin 020
        ;Begin 021
        orders->qual[d1.seq].req_st_dt = trim(concat(trim(
        DATETIMEZONEFORMAT(od.oe_field_dt_tm_value,od.oe_field_tz,"@SHORTDATETIMENOSEC")), " ",
		trim(DATETIMEZONEFORMAT(od.oe_field_dt_tm_value,od.oe_field_tz,"ZZZ"))))
        ;End 021
      else
        orders->qual[d1.seq].req_st_dt = format(od.oe_field_dt_tm_value, "@SHORTDATETIMENOSEC")
      endif ;End 020
    endif
    if (od.oe_field_meaning = "FREQ")
      orders->qual[d1.seq].frequency = od.oe_field_display_value
    endif
    if (od.oe_field_meaning = "RATE")
      orders->qual[d1.seq].rate = od.oe_field_display_value
    endif
    if (od.oe_field_meaning = "DURATION")
      orders->qual[d1.seq].duration = od.oe_field_display_value
    endif
    if (od.oe_field_meaning = "DURATIONUNIT")
      orders->qual[d1.seq].duration_unit = od.oe_field_display_value
    endif
    if (od.oe_field_meaning = "NURSECOLLECT")
      orders->qual[d1.seq].nurse_collect = od.oe_field_display_value
    endif
  head od.action_sequence
    if (act_seq != od.action_sequence)
      odflag = 0
    endif
  detail
    if (odflag = 1)
      orders->qual[d1.seq].d_cnt=orders->qual[d1.seq].d_cnt+1
      dc = orders->qual[d1.seq].d_cnt
      if (dc > size(orders->qual[d1.seq].d_qual,5))
        stat = alterlist(orders->qual[d1.seq].d_qual,dc + 5)
      endif
      orders->qual[d1.seq].d_qual[dc].label_text = trim(oef.label_text)
      orders->qual[d1.seq].d_qual[dc].field_value=od.oe_field_value
      orders->qual[d1.seq].d_qual[dc].group_seq = oef.group_seq
      orders->qual[d1.seq].d_qual[dc].oe_field_meaning_id = od.oe_field_meaning_id
      if (od.oe_field_dt_tm_value != NULL) ;Begin 020
        if (CURUTC>0)
          orders->qual[d1.seq].d_qual[dc].value = trim(concat(trim(
          DATETIMEZONEFORMAT(od.oe_field_dt_tm_value,od.oe_field_tz,"@SHORTDATETIMENOSEC")), " ",
		trim(DATETIMEZONEFORMAT(od.oe_field_dt_tm_value,od.oe_field_tz,"ZZZ"))))
        else
          orders->qual[d1.seq].d_qual[dc].value = format(od.oe_field_dt_tm_value, "@SHORTDATETIMENOSEC")
        endif
      else
        orders->qual[d1.seq].d_qual[dc].value = trim(od.oe_field_display_value,3)     ;027
      endif ;End 020
      orders->qual[d1.seq].d_qual[dc].clin_line_ind = oef.clin_line_ind
      orders->qual[d1.seq].d_qual[dc].label =trim(oef.clin_line_label)
      orders->qual[d1.seq].d_qual[dc].suffix = oef.clin_suffix_ind
      orders->qual[d1.seq].d_qual[dc].field_type_flag = of1.field_type_flag
      if (size(od.oe_field_display_value,1) > 0)     ;027
        orders->qual[d1.seq].d_qual[dc].print_ind = 0
      else
        orders->qual[d1.seq].d_qual[dc].print_ind = 1
      endif
      if ((od.oe_field_meaning_id = 1100
           or od.oe_field_meaning_id = 8
           or OD.OE_FIELD_MEANING_ID = 127
           or od.oe_field_meaning_id = 43)
           and trim(cnvtupper(od.oe_field_display_value),3) = "STAT")     ;027
        orders->qual[d1.seq].stat_ind = 1
      endif
      if (of1.field_type_flag = 7)
        if (od.oe_field_value = 1)
          if (oef.disp_yes_no_flag = 2)            
            orders->qual[d1.seq].d_qual[dc].clin_line_ind = 0
          endif
        else
          if (oef.disp_yes_no_flag = 1)          	
            orders->qual[d1.seq].d_qual[dc].clin_line_ind = 0
          endif
        endif         
      endif
    endif
  foot od.order_id
    stat = alterlist(orders->qual[d1.seq].d_qual, dc)
  with nocounter
 
/******************************************************************************
*   BUILD ORDER DETAILS LINE IF IT EXCEEDS 255 CHARACTERS                     *
******************************************************************************/
 
for (x = 1 to order_cnt)
  if (orders->qual[x].clin_line_ind = 1)
    set started_build_ind = 0
    for (fsub = 1 to 31)
      for (xx = 1 to orders->qual[x].d_cnt)
        if ((orders->qual[x].d_qual[xx].group_seq = fsub or fsub = 31)
             and orders->qual[x].d_qual[xx].print_ind = 0)
;          set orders->qual[x].d_qual[xx].print_ind = 1   ;004
          if (orders->qual[x].d_qual[xx].clin_line_ind = 1)
            if (started_build_ind = 0)
              set started_build_ind = 1
              if (orders->qual[x].d_qual[xx].suffix = 0
                  and size(orders->qual[x].d_qual[xx].label,1) > 0)     ;027
                set orders->qual[x].display_line =
                  concat(trim(orders->qual[x].d_qual[xx].label)," ",
                    trim(orders->qual[x].d_qual[xx].value))
              elseif (orders->qual[x].d_qual[xx].suffix = 1
                      and size(orders->qual[x].d_qual[xx].label,1) > 0)     ;027
                set orders->qual[x].display_line =
                  concat(trim(orders->qual[x].d_qual[xx].value)," ",
                    trim(orders->qual[x].d_qual[xx].label))
              else
                set orders->qual[x].display_line =
                  concat(trim(orders->qual[x].d_qual[xx].value)," ")
              endif
            else
              if (orders->qual[x].d_qual[xx].suffix = 0
                  and size(orders->qual[x].d_qual[xx].label,1) > 0)     ;027
                set orders->qual[x].display_line =
                  concat(trim(orders->qual[x].display_line),",",
                    trim(orders->qual[x].d_qual[xx].label)," ",
                    trim(orders->qual[x].d_qual[xx].value))
              elseif (orders->qual[x].d_qual[xx].suffix = 1
                      and size(orders->qual[x].d_qual[xx].label,1) > 0)     ;027
                set orders->qual[x].display_line =
                  concat(trim(orders->qual[x].display_line),",",
                    trim(orders->qual[x].d_qual[xx].value)," ",
                    trim(orders->qual[x].d_qual[xx].label))
              else
                set orders->qual[x].display_line =
                  concat(trim(orders->qual[x].display_line),",",
                    trim(orders->qual[x].d_qual[xx].value)," ")
              endif
            endif
          endif
        endif
      endfor
    endfor
  endif
endfor
 
/******************************************************************************
*  LINE WRAPPING FOR ORDER DETAILS                                            *
******************************************************************************/
set max_length = 50		;030
for (x = 1 to order_cnt)
 
  if (size(orders->qual[x].display_line,1) > 0)     ;027
   set pt->line_cnt = 0
   execute dcp_parse_text value(orders->qual[x].display_line),value(max_length)
   set stat = alterlist(orders->qual[x].disp_ln_qual, pt->line_cnt)
   set orders->qual[x].disp_ln_cnt = pt->line_cnt
   for (y = 1 to pt->line_cnt)
     set orders->qual[x].disp_ln_qual[y].disp_line = pt->lns[y].line
   endfor
  endif
 
  for (ww = 1 to orders->qual[x]->d_cnt)
  	;check for long strings and possible free text fields that have return characters
  	if(orders->qual[x].d_qual[ww].field_type_flag = 0  ;alphanumeric detail
  		or orders->qual[x].d_qual[ww].field_type_flag = 11  ;printer detail
  		or textlen(trim(orders->qual[x].d_qual[ww].value,3)) > max_length)
		set pt->line_cnt = 0
		execute dcp_parse_text value(orders->qual[x].d_qual[ww].value),value(max_length)
		set stat = alterlist(orders->qual[x].d_qual[ww].value_qual, pt->line_cnt)
		set orders->qual[x].d_qual[ww].value_cnt = pt->line_cnt
		for (y = 1 to pt->line_cnt)
			set orders->qual[x].d_qual[ww].value_qual[y].value_line = pt->lns[y].line
		endfor
	else
		set orders->qual[x].d_qual[ww].value_cnt = 1
	endif
  endfor
endfor
 
/******************************************************************************
*    GET ACCESSION NUMBER                                                     *
******************************************************************************/
 
for (x = 1 to order_cnt)
  select into "nl:"
  from accession_order_r aor
  plan aor
    where aor.order_id = orders->qual[x].order_id
  detail
    orders->qual[x].accession = aor.accession
  with nocounter
endfor
 
/******************************************************************************
*   LINE WRAPPING FOR ORDERABLE                                               *
******************************************************************************/
 
set max_length = 90
for (x = 1 to order_cnt)
  if (textlen(orders->qual[x].mnemonic) > 0)
   set pt->line_cnt = 0
   execute dcp_parse_text value(orders->qual[x].mnemonic),value(max_length)
   set stat = alterlist(orders->qual[x].mnem_ln_qual, pt->line_cnt)
   set orders->qual[x].mnem_ln_cnt = pt->line_cnt
   for (y = 1 to pt->line_cnt)
     set orders->qual[x].mnem_ln_qual[y].mnem_line = pt->lns[y].line
   endfor
  endif
endfor
 
/******************************************************************************
*     RETRIEVE ORDER COMMENT AND LINE WRAPPING                                *
******************************************************************************/
 
set max_length = 85 ; Mod 035
for (x = 1 to order_cnt)
  if (orders->qual[x].comment_ind = 1)
    select into "nl:"
    from order_comment oc,
      long_text lt
    plan oc
      where oc.order_id = orders->qual[x].order_id
        and oc.comment_type_cd = comment_cd
    join lt
      where lt.long_text_id = oc.long_text_id
    order by
        oc.action_sequence desc	;034
    head report
      orders->qual[x].comment = lt.long_text
    with nocounter
    set pt->line_cnt = 0
    execute dcp_parse_text value(orders->qual[x].comment),value(max_length)
    set stat = alterlist(orders->qual[x].com_ln_qual, pt->line_cnt)
    set orders->qual[x].com_ln_cnt = pt->line_cnt
    for (y = 1 to pt->line_cnt)
      set orders->qual[x].com_ln_qual[y].com_line = pt->lns[y].line
    endfor
  endif
endfor
 
/******************************************************************************
*  SEND TO OUTPUT PRINTER                                                     *
******************************************************************************/
 
if (orders->spoolout_ind = 1)
 
 set new_timedisp = cnvtstring(curtime3)
 set tempfile1a = build(concat("cer_temp:dcpreq", "_",new_timedisp),".dat")
 set cancel_banner = "************************CANCEL*************************" ;010
 set discont_banner = "********************DISCONTINUED***********************" ;010
 set modify_banner = "***********************MODIFIED************************";010
 
 select into value(tempfile1a)
; select into value(request->printer_name)
; select into "mine"
   d1.seq
 from (dummyt d1 with seq = 1)
 
 plan d1
 
head report
 
  first_page = "Y"
  saved_pos = 0
 
Head Page
  "{LPI/8}{CPI/12}{FONT/4}","  ",row+1
  line1 = fillstring(35,"_"),
  line2 = fillstring(10,"_"),
  spaces = fillstring(50, " ")
 
  "{CPI/12}{POS/30/45}", "MEDICAL RECORD NUMBER" ,row+1
  "{CPI/10}{POS/30/55}{b}", "*",orders->mrn,"*" ,row+1
  "{CPI/12}{POS/235/45}", "VISIT NUMBER" ,row+1
  "{CPI/10}{POS/240/55}{b}", "*",
  call print(trim(cnvtstring(cnvtint(request->order_qual[1].encntr_id)))),
    "*",row+1
  "{CPI/12}{POS/420/45}", "PATIENT ACCOUNT NUMBER" ,row+1
  "{CPI/10}{POS/440/55}{b}", "*",orders->fnbr,"*",row+1
 
  "{CPI/12}{POS/30/120}", "PATIENT NAME:",row+1
  "{CPI/10}{POS/125/120}{b}", call print(trim(orders->name,3)),"{endb}", row+1
  "{CPI/12}{POS/410/120}",  "DOB:  ", orders->dob,row+1
  "{CPI/12}{POS/30/130}", "ADMIT DX:", row+1
	if (textlen(orders->admit_diagnosis) > 35)																		;018
		"{CPI/12}{POS/125/130}",call print (trim(concat(substring(1, 32, orders->admit_diagnosis), "..."))),row+1 
	else 																							
		"{CPI/12}{POS/125/130}",call print(orders->admit_diagnosis),row+1													;018
	endif	 																									;018
  "{CPI/12}{POS/410/130}", "AGE:  ", orders->age,row+1
 
  "{CPI/12}{POS/30/160}", "ADMIT DATE:  ",row+1
  "{CPI/12}{POS/125/160}", orders->admit_dt,row+1
  "{CPI/12}{POS/410/160}", "HGT / WT: ",
  call print(trim(orders->height)), "/", call print(trim(orders->weight)),row+1
 
  "{CPI/12}{POS/30/170}", "NURSING UNIT:", row+1
  "{CPI/10}{POS/125/170}{B}", orders->nurse_unit, "{ENDB}",row+1
  "{CPI/12}{POS/410/170}", "SEX:  ",  orders->sex,row+1
  "{CPI/12}{POS/30/180}", "ROOM/BED:", row+1
  "{CPI/12}{POS/125/180}", orders->room,orders->bed, row+1
 
  "{CPI/10}{POS/30/210}", "ALLERGIES:    ","{b}"
 
  if (allergy->line_cnt > 0)
    allergy->line_qual[1].line, row+1
  endif
  if (allergy->line_cnt > 1)
 
    "{POS/110/220}", "{b}", allergy->line_qual[2].line
  endif
 
 if (allergy->line_cnt > 2)
    "{CPI/10}", "{b}", " ..." ,row+1
    "{POS/160/240}", "{b}", "* See patient chart for additional allergy information *", row+1
  endif   ;008
 
 
;***mnem box
  "{CPI/10}{POS/20/255}{BOX/75/2}",ROW+1
  "{CPI/8}{POS/24/260}{color/20/145}",ROW+1
  "{CPI/8}{POS/24/267}{color/20/145}",ROW+1
  "{CPI/8}{POS/24/274}{color/20/145}",ROW+1
  "{CPI/8}{POS/24/278}{color/20/145}",ROW+1
 
  "{CPI/12}{POS/30/295}{B}", "ORDER DATE/TIME:"
  "{CPI/12}{POS/30/307}", "ORDERING MD:","{endb}",row+1
  "{CPI/12}{POS/30/319}",  "ORDER ENTERED BY:",ROW+1
  "{CPI/12}{POS/30/331}", "ORDER NUMBER:" ,row+1
 
  if (saved_pos > 0)
    "{CPI/10}{POS/1/90}"," ",
    "{CPI/10}{b}",
    call center(orders->facility,1,190) ;011
    ;011orders->qual[save_vv]->catalog,",  ",orders->qual[save_vv]->activity),1,190)
    row+1
    "{CPI/8}{POS/30/270}{b}", "ORDER:  ", orders->qual[saved_pos].mnemonic, row+1
    "{CPI/10}{POS/210/295}", orders->qual[saved_pos].order_dt, row+1
    "{CPI/12}{POS/210/307}", orders->qual[saved_pos].order_dr,row+1
    "{CPI/12}{POS/210/319}", orders->qual[saved_pos].enter_by,ROW+1
    "{CPI/12}{POS/210/331}", call print(trim(cnvtstring(cnvtint(orders->qual[saved_pos]->order_id)))) ,row+1
  	"{CPI/12}{POS/30/735}", "ORDER    ", "{CPI/9}{B}",orders->qual[saved_pos].mnemonic ;014
  	saved_pos = 0
  endif
 
detail
;018  for (VV = 1 to VALUE(order_cnt))
for (VV = 1 to VALUE(ord_cnt));018
  if (orders->qual[VV].display_ind = 1) 
    go_ahead_and_print  = 1
 
    if (go_ahead_and_print = 1)
      spoolout = 1
      if (first_page = "N")
        break
      endif
;  009
      if (orders->qual[vv]->action_type_cd = cancel_cd)
        "{CPI/12}{POS/120/75}{B}", cancel_banner,row+1
      elseif (orders->qual[vv]->action_type_cd = discont_cd)
        "{CPI/12}{POS/120/75}{B}", discont_banner,row+1
      elseif (orders->qual[vv]->action_type_cd = modify_cd)
        "{CPI/12}{POS/120/75}{B}", modify_banner,row+1
      endif
;  009
      first_page = "N"
 
      "{CPI/10}{POS/1/90}"," ",
      "{CPI/10}{b}", call center(orders->facility,1,190) ;011
      "{CPI/8}{POS/30/270}{b}", "ORDER:  ", orders->qual[vv].mnemonic, row+1
      "{CPI/10}{POS/210/295}", orders->qual[vv].order_dt, row+1
      "{CPI/12}{POS/210/307}", orders->qual[vv].order_dr,row+1
      "{CPI/12}{POS/210/319}", orders->qual[vv].enter_by,ROW+1
      "{CPI/12}{POS/210/331}", call print(trim(cnvtstring(cnvtint(orders->qual[vv]->order_id)))) ,row+1
      "{CPI/12}{POS/30/735}", "ORDER    ", "{CPI/9}{B}",orders->qual[vv].mnemonic ;014
 
      xcol=30
      ycol=363 ;015 
      for (fsub = 1 to 31)
        for (ww = 1 to orders->qual[vv]->d_cnt)
          if ((orders->qual[vv].d_qual[ww]->group_seq = fsub)
          or (fsub = 31 and orders->qual[vv]->d_qual[ww]->print_ind = 0))
            orders->qual[vv]->d_qual[ww]->print_ind = 1
 
 
            if (textlen(trim(orders->qual[vv].d_qual[ww].value,3)) > 0)
            	"{CPI/13}",call print(calcpos(xcol,ycol)),
                call print(orders->qual[vv].d_qual[ww].label_text),"  ",row+1
                if (textlen(orders->qual[vv].d_qual[ww].label_text) > 47)
                	ycol = ycol + 12
                endif
            	xcol = 212
            	if(orders->qual[vv].d_qual[ww].value_cnt > 1)
            		for (dsub = 1 to orders->qual[vv].d_qual[ww].value_cnt)
            			call print (calcpos(xcol,ycol)) "{b}",orders->qual[vv].d_qual[ww].value_qual[dsub].value_line,"{endb}",
                        row+1
                        ycol = ycol + 12
 
                        if (ycol > 600 and dsub < orders->qual[vv].d_qual[ww].value_cnt)
		            		call print (calcpos(xcol,ycol)),"**Continued on next page**"
	            			saved_pos = vv
           				 	break
           				 	xcol = 30
           				 	ycol = 381
           				 	"{CPI/13}",call print(calcpos(xcol,ycol)),
               				 call print(concat(orders->qual[vv].d_qual[ww].label_text, " cont. "))
           				 	xcol = 212
           				 	 if (textlen(orders->qual[vv].d_qual[ww].label_text) > 47)
                				  ycol = ycol + 12
               				 endif
          				endif
 
                    endfor
                else
               		call print (calcpos(xcol,ycol)) "{b}",orders->qual[vv].d_qual[ww].value,"{endb}", row +1
               		ycol = ycol + 12
          	    endif
          	    xcol = 30
       	    endif
          endif
          if (ycol > 600 and ww < orders->qual[vv]->d_cnt)
            saved_pos = vv
            break
            ycol = 381
          endif
        endfor
      endfor
    endif
    if(ycol > 600)
      saved_pos = vv
      break
      ycol = 381
    else
      ycol = ycol + 12
    endif
  	xcol = 30
	if (orders->qual[vv]->comment_ind = 1 and orders->qual[vv]->com_ln_cnt > 0) ;023
		"{CPI/13}"
		call print (calcpos (xcol,ycol)), "Comment "
		if (orders->qual[vv].com_ln_cnt > 7) ;023
			ocnt = 7
		else
			ocnt = orders->qual[vv].com_ln_cnt ;023
		endif
		ycol = ycol + 16
		for (com_cnt = 1 to ocnt)
			call print (calcpos (xcol,ycol)),"{b}", orders->qual[vv].com_ln_qual[com_cnt]->com_line,"{endb}" ;023
			row + 1
			ycol = ycol + 12
		endfor
		if (orders->qual[vv].com_ln_cnt > 7) ;023
          call print (calcpos (xcol,ycol)),
           "{cpi/13}", "**** Please check chart for further comments ****"
        endif
	endif
  endif
endfor
 
;foot page 014	
;014	"{font/8}{cpi/12}{pos/50/750}","dcpreqgen02"
 
with nocounter, maxrow=800, maxcol=800, dio=postscript

set spool = value(trim(tempfile1a)) value(trim(request->printer_name)) with deleted
 
endif
 
#exit_script
set last_mod = "037"
end
go
 
