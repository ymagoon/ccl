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
 
		Source file name:		CERN_ORMREQ02.PRG
		Object name:			cern_ormreq02
		Request #:				N/A
 
		Product:				PowerChart
		Product Team:			Order Management
		HNA Version:			500
		CCL Version:			8.3.0
 
		Program purpose:		Patient order requisition template
 
		Tables read:			person
								encounter
								person_alias
								encntr_alias
								encntr_prsnl_reltn
								prsnl
								clinical_event
								allergy
								nomenclature
								name_value_prefs
								app_prefs
								orders
								order_action
								oe_format_fields
								order_detail
								order_entry_fields
								accession_order_r
								order_ingredient
								order_comment
 
		Tables updated:			N/A
 
		Executing from:			PowerChart
 
		Special Notes:			Revision of dcpreqgen template
 
******************************************************************************/
;~DB~*************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG               *
;    *************************************************************************
;    *                                                                       *
;    *Mod Date     Engineer             Comment                              *
;    *--- -------- -------------------- -------------------------------------*
;    *001 **/**/** CERNER               Initial Release                      *
;    *002 08/07/07 RD012555             Add ellipsis to mnemonics that are   *
;                                       truncated.                           *
;    *003 02/05/09 MK012585             Join Order_action table using        *
;                                       conversation_id if one is passed in. *
;    *004 04/30/09 KW8277               Correct dummytable error.            *
;    *005 06/02/09 AS017690				Complex Meds changes 		         *
;    *006 08/20/09 AD010624             Replace > " " comparisons with       *
;                                       size() > 0, trim both sides of order *
;                                       details instead of right side only   *
;    *007 10/31/09 SK018443             If the admitting dx string length is *
;										greater than the display area,       *
;										truncate and add ellipsis	         *
;    *008 11/05/09 RD012555             Do not print for Protocols           *
;    *009 10/17/11 KM019227	      	    If special instruction is exceeding  *
;										the page limit then break the line and*
;										allow for page breaks.		         *
;    *010 12/13/11 KM019227				If order label text longer than the  *
;										order detail value text then print   *
;										order detail with ellipses after label text*
;    *011 12/22/11 SS019071				Globalization Regional locale support*
;    *012 04/25/12 KK023353             CR 1-5689212177 - Admit Date        *
;                                       displays a day early on DCPREQGEN0x *
;                                       when UTC is enabled                 *
;	 *013 09/06/12 KM019227 			Display most recent comment entered *
;    *014 09/013/12 MS021481				CR 1-6172020321						*
;										do not display the most recent		*
;										attending physician					*
;    *015 04/18/13  Akcia-SE			changes requested in cab 21765
;    *016 12/29/14  Akcia				major rewrite
;~DE~*************************************************************************
 
drop program custreq02:dba go
create program custreq02:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
 
with OUTDEV
 
 
/*********************************************************************
*  NOTE: The request record definition MUST come first in the script *
*  and cannot be modified without changing the entire script		 *
**********************************************************************/
 
record request
( 1 person_id = f8
  1 print_prsnl_id = f8
  1 order_qual[*]
    2 order_id = f8
    2 encntr_id = f8
    2 conversation_id = f8
  1 printer_name = c50
)
free set orders
free set allergy
free set diagnosis
free set pt
 
record orders
( 1 name = vc
  1 pat_type = vc
  1 age = vc
  1 dob = vc
  1 mrn = vc
  1 cmrn = vc				;015
  1 location = vc
  1 facility = vc
  1 facility_cd = f8    	;015
  1 fac_address1 = vc   	;015
  1 fac_address2 = vc   	;015
  1 fac_city_st_zip = vc   	;015
  1 fac_phone = vc 			;015
  1 nurse_unit = vc
  1 room = vc
  1 bed = vc
  1 sex = vc
  1 fnbr = vc
  1 med_service = vc
  1 admit_diagnosis = vc
  1 height = vc
  1 height_dt_tm = vc
  1 weight = vc
  1 weight_dt_tm = vc
  1 admit_dt = vc
  1 los = i4
  1 attending_cnt = i2
  1 attending [*]
  	2 attending_phy = vc
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
    2 enter_for = vc
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
      3 field_value = f8
      3 oe_field_meaning_id = f8
      3 group_seq = i4
      3 print_ind = i2
      3 clin_line_ind = i2
      3 label = vc
      3 suffix = i2
      3 special_ind = i2
      3 priority_ind = i2
    2 priority = vc
    2 req_st_dt = vc
    2 frequency = vc
    2 rate = vc
    2 duration = vc
    2 duration_unit = vc
    2 nurse_collect = vc
    2 fmt_action_cd = f8
    2 communication_type = vc
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
 
 
subroutine parse_text(sent_text,max_len)
call echo("in sub")
IF ((VALIDATE (BLOB ) = 0 ) )
RECORD BLOB (
  1 LINE = VC
  1 CNT = I2
  1 QUAL [*]
    2 LINE = VC
    2 SZE = I4
)
ENDIF
DECLARE L = I4 WITH PRIVATE ,NOCONSTANT (0 )
DECLARE H = I4 WITH PRIVATE ,NOCONSTANT (0 )
DECLARE CR = I4 WITH PRIVATE ,NOCONSTANT (0 )
DECLARE LENGTH = I4 WITH PRIVATE ,NOCONSTANT (0 )
DECLARE MAXLENGTH = I4 WITH PRIVATE ,NOCONSTANT (0 )
DECLARE CHECK_BLOB = VC WITH PRIVATE ,NOCONSTANT (FILLSTRING (65535 ," " ) )
DECLARE LF = VC WITH PRIVATE ,NOCONSTANT (CONCAT (CHAR (13 ) ,CHAR (10 ) ) )
DECLARE C = I4 WITH PRIVATE ,NOCONSTANT (0 )
SET CHECK_BLOB = ""
SET CHECK_BLOB = sent_text
SET MAXLENGTH = max_len
call echo(check_blob)
call echo(maxlength)
SET CHECK_BLOB = CONCAT (TRIM (CHECK_BLOB ) ,LF )
SET BLOB->CNT = 0
SET CR = FINDSTRING (LF ,CHECK_BLOB )
SET LENGTH = TEXTLEN (CHECK_BLOB )
WHILE ((CR > 0 ) )
SET BLOB->LINE = SUBSTRING (1 ,(CR - 1 ) ,CHECK_BLOB )
SET CHECK_BLOB = SUBSTRING ((CR + 2 ) ,LENGTH ,CHECK_BLOB )
SET BLOB->CNT = (BLOB->CNT + 1 )
SET STAT = ALTERLIST (BLOB->QUAL ,BLOB->CNT )
SET BLOB->QUAL[BLOB->CNT ]->LINE = TRIM (BLOB->LINE )
SET BLOB->QUAL[BLOB->CNT ]->SZE = TEXTLEN (TRIM (BLOB->LINE ) )
SET CR = FINDSTRING (LF ,CHECK_BLOB )
ENDWHILE
FOR (J = 1 TO BLOB->CNT )
WHILE ((BLOB->QUAL[J ]->SZE > MAXLENGTH ) )
SET H = L
SET C = MAXLENGTH
WHILE ((C > 0 ) )
IF ((SUBSTRING (C ,1 ,BLOB->QUAL[J ]->LINE ) IN (" " ,"-" ) ) )
SET L = (L + 1 )
SET STAT = ALTERLIST (PT->LNS ,L )
SET PT->LNS[L ]->LINE = SUBSTRING (1 ,C ,BLOB->QUAL[J ]->LINE )
SET BLOB->QUAL[J ]->LINE = SUBSTRING ((C + 1 ) ,(BLOB->QUAL[J ]->SZE - C ) ,BLOB->QUAL[J ]->LINE )
SET C = 1
ENDIF
SET C = (C - 1 )
ENDWHILE
IF ((H = L ) )
SET L = (L + 1 )
SET STAT = ALTERLIST (PT->LNS ,L )
SET PT->LNS[L ]->LINE = SUBSTRING (1 ,MAXLENGTH ,BLOB->QUAL[J ]->LINE )
SET BLOB->QUAL[J ]->LINE = SUBSTRING ((MAXLENGTH + 1 ) ,(BLOB->QUAL[J ]->SZE - MAXLENGTH ) ,BLOB->
QUAL[J ]->LINE )
ENDIF
SET BLOB->QUAL[J ]->SZE = SIZE (TRIM (BLOB->QUAL[J ]->LINE ) )
ENDWHILE
SET L = (L + 1 )
SET STAT = ALTERLIST (PT->LNS ,L )
SET PT->LNS[L ]->LINE = SUBSTRING (1 ,BLOB->QUAL[J ]->SZE ,BLOB->QUAL[J ]->LINE )
SET PT->LINE_CNT = L
ENDFOR
end
;end sub
 
/*****************************************************************************
*    Program Driver Variables                                                *
*****************************************************************************/
 
declare order_cnt      = i4 with protect, noconstant( size(request->order_qual,5))
declare ord_cnt        = i4 with protect, noconstant(size(request->order_qual,5))
declare vv             = i4 with protect
set stat = alterlist(orders->qual,order_cnt)
declare num 		   = i4						;015
declare  hold_text     = vc
declare person_id      = f8 with protect, noconstant(0.0)
declare encntr_id      = f8 with protect, noconstant(0.0)
 
set orders->spoolout_ind = 0
set pharm_flag 			 = 0 ;set to 1 if you want to pull the MNEM_DISP_LEVEL and IV_DISP_LEVEL from the tables.
set vv 					 = 0
 
declare comment_cd     = f8 with protect, constant(uar_get_code_by("MEANING", 14, "ORD COMMENT"))
declare mrn_cd         = f8 with protect, constant(uar_get_code_by("MEANING", 319, "MRN"))
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
declare transfer_cd    = f8 with protect, constant(uar_get_code_by("MEANING", 6003, "TRANSFER/CAN"))
declare reorder_cd     = f8 with protect, constant(uar_get_code_by("MEANING", 6003, "CANCEL REORD"))
declare studactivate_cd = f8 with protect, constant(uar_get_code_by("MEANING", 6003, "STUDACTIVATE"))
declare activate_cd    = f8 with protect, constant(uar_get_code_by("MEANING", 6003, "ACTIVATE"))
declare void_cd    = f8 with protect, constant(uar_get_code_by("MEANING", 6003, "VOID"))				;018
declare suspend_cd    = f8 with protect, constant(uar_get_code_by("MEANING", 6003, "SUSPEND"))			;018
declare resume_cd    = f8 with protect, constant(uar_get_code_by("MEANING", 6003, "RESUME"))			;018
declare intermittent_cd = f8 with protect, constant(uar_get_code_by("MEANING", 18309, "INTERMITTENT")) 	;018
declare cmrn_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 263, "CMRN")) 				;015
 
declare last_mod = c3 with private, noconstant(fillstring(3, "000"))
declare offset = i2 with protect, noconstant(0)
declare daylight = i2 with protect, noconstant(0)
 
declare mnemonic_size = i4 with protect, noconstant(0)	;002
declare mnem_length = i4 with protect, noconstant(0)	;002
/******************************************************************************
*     PATIENT INFORMATION                                                     *
******************************************************************************/
 
select into "nl:"
 
from
	person  p,
	encounter  e,
	person_alias  pa,
	encntr_alias  ea,
	encntr_alias  ea1,				;015
	encntr_prsnl_reltn  epr,
	prsnl  pl,
	(dummyt d1 with seq = 1),
    encntr_loc_hist elh,
    time_zone_r t
plan p
  where p.person_id =  request->person_id
join e
  where e.encntr_id = request->order_qual[1].encntr_id
join elh
  where elh.encntr_id = e.encntr_id
join t
  where t.parent_entity_id = outerjoin(elh.loc_facility_cd)
   and t.parent_entity_name = outerjoin("LOCATION")
;start 015
join pa
  where pa.person_id = outerjoin(p.person_id)
    and pa.active_ind =  outerjoin(1)
    and pa.alias_pool_cd = outerjoin(cmrn_cd)
    and pa.person_alias_type_cd = outerjoin(2)
    and pa.beg_effective_dt_tm <  outerjoin(sysdate)
    and pa.end_effective_dt_tm >  outerjoin(sysdate)
join ea
  where ea.encntr_id = outerjoin(e.encntr_id)
    and ea.encntr_alias_type_cd = outerjoin(fnbr_cd)
    and ea.active_ind = outerjoin(1)
    and ea.end_effective_dt_tm > outerjoin(sysdate)
join ea1
  where ea1.encntr_id = outerjoin(e.encntr_id)
    and ea1.encntr_alias_type_cd = outerjoin(mrn_cd)
    and ea1.active_ind = outerjoin(1)
    and ea1.end_effective_dt_tm > outerjoin(sysdate)
;join pa
;  where pa.person_id = outerjoin(p.person_id)
;    and pa.active_ind = 1
;    and pa.beg_effective_dt_tm < cnvtdatetime(curdate,curtime3)
;    and pa.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
;join ea
;  where ea.encntr_id = outerjoin(e.encntr_id)
;    and (ea.encntr_alias_type_cd = mrn_cd
;      or ea.encntr_alias_type_cd = fnbr_cd)
;    and ea.active_ind = 1
;end 015
join d1
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
  orders->pat_type = trim(uar_get_code_display(e.encntr_type_cd))
  orders->sex = uar_get_code_display(p.sex_cd)
  orders->age = cnvtage(p.birth_dt_tm)
  orders->admit_dt = format(e.reg_dt_tm, "@SHORTDATE")	;012
;016  orders->dob = format(datetimezone(p.birth_dt_tm, p.birth_tz,2),"@SHORTDATE")
  orders->dob = format(datetimezone(p.abs_birth_dt_tm, p.birth_tz,2),"@SHORTDATE")		;016
  orders->facility = uar_get_code_description(e.loc_facility_cd)
  orders->facility_cd = e.loc_facility_cd   			;015
  orders->nurse_unit = uar_get_code_display(e.loc_nurse_unit_cd)
  orders->room = uar_get_code_display(e.loc_room_cd)
  orders->bed = uar_get_code_display(e.loc_bed_cd)
  orders->location = concat(trim(orders->room)," ",
    trim(orders->bed))
  orders->admit_diagnosis = trim(e.reason_for_visit , 3)
  orders->med_service = uar_get_code_display(e.med_service_cd)
 
  if (e.disch_dt_tm = null or e.disch_dt_tm = 0)
    orders->los = datetimecmp(cnvtdatetime(curdate,curtime3),e.reg_dt_tm)+1
  else
    orders->los = datetimecmp(e.disch_dt_tm,e.reg_dt_tm)+1
  endif
 
head epr.encntr_prsnl_r_cd
  if (epr.encntr_prsnl_r_cd = admit_doc_cd)
    orders->admitting = pl.name_full_formatted
  endif
 
detail
    if (pa.alias_pool_cd > 0)										;015
      orders->cmrn = cnvtalias(pa.alias,pa.alias_pool_cd)			;015
    else															;015
      orders->cmrn = pa.alias										;015
    endif															;015
;015  if (ea.encntr_alias_type_cd = mrn_cd)
;015    if (ea.alias_pool_cd > 0)
;015      orders->mrn = cnvtalias(ea.alias,ea.alias_pool_cd)
;015    else
;015      orders->mrn = ea.alias
;015    endif
;015  endif
;015  if (ea.encntr_alias_type_cd = fnbr_cd)
    if (ea1.alias_pool_cd > 0)										;015
      orders->mrn = cnvtalias(ea1.alias,ea1.alias_pool_cd)			;015
    else															;015
      orders->mrn = ea1.alias										;015
    endif															;015
    if (ea.alias_pool_cd > 0)
      orders->fnbr = cnvtalias(ea.alias,ea.alias_pool_cd)
    else
      orders->fnbr = ea.alias
    endif
;015  endif
 
with nocounter,outerjoin=d1,dontcare=epr
 
;start 015
select into "nl:"
 
from
location l,
address a,
phone ph
 
plan l
where l.location_cd = orders->facility_cd
 
join a
where a.parent_entity_id = outerjoin(l.organization_id)
  and a.parent_entity_name = outerjoin("ORGANIZATION")
  and a.active_ind = outerjoin(1)
  and a.end_effective_dt_tm > outerjoin(sysdate)
 
join ph
where ph.parent_entity_id = outerjoin(l.organization_id)
  and ph.parent_entity_name = outerjoin("ORGANIZATION")
  and ph.active_ind = outerjoin(1)
  and ph.end_effective_dt_tm > outerjoin(sysdate)
 
detail
orders->fac_address1 = a.street_addr
orders->fac_address2 = a.street_addr2
if (a.state_cd = 0)
  orders->fac_city_st_zip = concat(trim(a.city,3),", ",trim(a.state,3)," ",trim(a.zipcode,3))
else
  orders->fac_city_st_zip = concat(trim(a.city,3),", ",trim(uar_get_code_display(a.state_cd),3)," ",trim(a.zipcode,3))
endif
orders->fac_phone = ph.phone_num
 
with nocounter
 
;end 015
 
 
/* Attending MD requires an additional select statement */
 
select into "nl:"
from encntr_prsnl_reltn epr,
     prsnl pl
 
plan epr
  where epr.encntr_prsnl_r_cd = attend_doc_cd
    and epr.encntr_id = request->order_qual[1].encntr_id
    and epr.expiration_ind + 0 = 0
join pl
  where pl.person_id = epr.prsnl_person_id
 
order by epr.active_status_dt_tm DESC									/*14 starts here*/
 
head report
   orders->attending_cnt = 0
   stat = alterlist(orders->attending, 1)
detail
  orders->attending_cnt = orders->attending_cnt + 1
  if (orders->attending_cnt = 1)
  	orders->attending[1].attending_phy = pl.name_full_formatted
  endif
foot report
	row +0
with nocounter															/*14 ends here*/
 
 
/******************************************************************************
*     CLINICAL EVENT INFORMATION                                              *
******************************************************************************/
 
set height_cd = uar_get_code_by("DISPLAYKEY", 72, "CLINICALHEIGHT")
set weight_cd = uar_get_code_by("DISPLAYKEY", 72, "CLINICALWEIGHT")
 
select into "nl:"
 
from
	clinical_event  c
 
plan c
  where c.person_id = person_id
    and c.event_cd in (height_cd,weight_cd)
    and c.view_level = 1
    and c.publish_flag = 1
    and c.valid_until_dt_tm = cnvtdatetime("31-DEC-2100,00:00:00")
    and c.result_status_cd != inerror_cd
 
 
 
order by
	c.event_end_dt_tm
 
detail  if (c.event_cd = height_cd)
    orders->height = concat(trim(c.event_tag)," ",
        trim(uar_get_code_display(c.result_units_cd)))
    orders->height_dt_tm =
        datetimezoneformat(c.performed_dt_tm, c.performed_tz, "@SHORTDATETIMENOSEC")
  elseif (c.event_cd = weight_cd)
    orders->weight = concat(trim(c.event_tag)," ",
        trim(uar_get_code_display(c.result_units_cd)))
    orders->weight_dt_tm =
        datetimezoneformat(c.performed_dt_tm, c.performed_tz, "@SHORTDATETIMENOSEC")
  endif
 
with  nocounter
 
 
/******************************************************************************
*     FIND ACTIVE ALLERGIES AND CREATE ALLERGY LINE                           *
******************************************************************************/
 
select into "nl:"
from allergy a,
     nomenclature n
 
plan a
  where a.person_id =  request->person_id
    and a.active_ind = 1
    and a.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
    and (a.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
      or a.end_effective_dt_tm = NULL)
    and a.reaction_status_cd != canceled_cd
join n
  where n.nomenclature_id = outerjoin(a.substance_nom_id)
 
order cnvtdatetime(a.onset_dt_tm)
 
head report
  allergy->cnt = 0
 
detail
  if (size(n.source_string,1) > 0 or size(a.substance_ftdesc,1) > 0)     ;006
    allergy->cnt = allergy->cnt + 1
    stat = alterlist(allergy->qual,allergy->cnt)
    allergy->qual[allergy->cnt].list = a.substance_ftdesc
    if (size(n.source_string,1) > 0)     ;006
      allergy->qual[allergy->cnt].list = n.source_string
    endif
  endif
 
with nocounter
 
/* Build allergy line without cutting off allergies with multiple words */
 
set allergy->line_cnt = 0
set stat = alterlist(allergy->line_qual, 5)
for (x = 1 to allergy->cnt)
  if ((x = 1) or (allergy->line = " "))
    set allergy->line = allergy->qual[x].list
  else
    set allergy->line = concat(trim(allergy->line),", ",
      trim(allergy->qual[x].list))
  endif
 
  if (size(allergy->line) > 60)
    set allergy->line_cnt = allergy->line_cnt + 1
    set stat = alterlist(allergy->line_qual, allergy->line_cnt)
    set allergy->line_qual[allergy->line_cnt].line = allergy->line
    set allergy->line = " "
  endif
endfor
 
if (size(allergy->line) > 1)
  set allergy->line_cnt = allergy->line_cnt + 1
  set stat = alterlist(allergy->line_qual, allergy->line_cnt)
  set allergy->line_qual[allergy->line_cnt].line = allergy->line
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
set ord_cnt = 0 				;004
set oiCnt = 0					;005
set max_length = 70	;018
 
select into "nl:"
from  orders o,
      order_action oa,
      prsnl pl,
      prsnl pl2,
      (dummyt d1 with seq = value(order_cnt)),
      (dummyt d2 with seq = value(order_cnt)),
      order_ingredient oi											;005
 
plan d1
join o
  where o.order_id = request->order_qual[d1.seq].order_id
join oa
  where oa.order_id = o.order_id
   and ((request->order_qual[d1.seq].conversation_id > 0 and   	;05
         oa.order_conversation_id = request->order_qual[d1.seq].conversation_id) or
          (request->order_qual[d1.seq].conversation_id <= 0 and oa.action_sequence = o.last_action_sequence))
 
join pl
  where pl.person_id = oa.action_personnel_id
join pl2
  where pl2.person_id = oa.order_provider_id
join d2
  join oi where o.order_id = oi.order_id							;005
	and o.last_ingred_action_sequence = oi.action_sequence			;005
 
order by o.oe_format_id, o.activity_type_cd, o.current_start_dt_tm
 
head report
  orders->order_location = trim(uar_get_code_display(oa.order_locn_cd))
  mnemonic_size = size(o.hna_order_mnemonic,3) - 1	;002
 
head o.order_id
  ord_cnt = ord_cnt + 1
  orders->qual[ord_cnt].status = uar_get_code_display(o.order_status_cd)
  orders->qual[ord_cnt].catalog = uar_get_code_display(o.catalog_type_cd)
  orders->qual[ord_cnt].catalog_type_cd = o.catalog_type_cd
  orders->qual[ord_cnt].activity = uar_get_code_display(o.activity_type_cd)
  orders->qual[ord_cnt].activity_type_cd = o.activity_type_cd
  orders->qual[ord_cnt].display_line = o.clinical_display_line
  orders->qual[ord_cnt].order_id = o.order_id
  orders->qual[ord_cnt].display_ind = 1
  orders->qual[ord_cnt].template_order_flag = o.template_order_flag
  orders->qual[ord_cnt].cs_flag = o.cs_flag
  orders->qual[ord_cnt].oe_format_id = o.oe_format_id
  orders->qual[ord_cnt].communication_type = uar_get_code_display(oa.communication_type_cd)
 
  if (size(substring(245,10,o.clinical_display_line),1) > 0)     ;006
    orders->qual[ord_cnt].clin_line_ind = 1
  else
    orders->qual[ord_cnt].clin_line_ind = 0
  endif
 
  ;BEGIN 002
  mnem_length = size(trim(o.hna_order_mnemonic),1)
  if (mnem_length >= mnemonic_size
  	  and SUBSTRING(mnem_length - 3, mnem_length, o.hna_order_mnemonic) != "...")
  	orders->qual[ord_cnt].mnemonic = concat(cnvtupper(trim(o.hna_order_mnemonic)), "...")
  else
    orders->qual[ord_cnt].mnemonic = cnvtupper(trim(o.hna_order_mnemonic))
  endif
  ;END 002
;002  orders->qual[ord_cnt].mnemonic = cnvtupper(trim(o.hna_order_mnemonic))
  orders->qual[ord_cnt].signed_dt = format(o.orig_order_dt_tm, "@SHORTDATETIME;;Q")
  if(CURUTC>0)
  orders->qual[ord_cnt].order_dt =  concat(format(datetimezone(oa.order_dt_tm, oa.order_tz), "@SHORTDATE"),
        " ", datetimezonebyindex(oa.order_tz,offset,daylight,7,oa.order_dt_tm))
  else
  orders->qual[ord_cnt].order_dt = format(oa.order_dt_tm,"@SHORTDATETIMENOSEC")
  endif
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
 
  head oi.comp_sequence																;005
    if (oi.comp_sequence >0 and o.med_order_type_cd = intermittent_cd)				;005
      ;if the order ingredient is a diluent	and is clinically significant			;005
      if (oi.ingredient_type_flag = 2 and oi.clinically_significant_flag = 2)		;005
        oiCnt = oiCnt + 1															;005
      ;if the order ingredient is a additive										;005
      else if (oi.ingredient_type_flag = 3)											;005
        oiCnt = oiCnt + 1															;005
      endif																			;005
	endif																			;005
  endif																				;005
 
  foot o.order_id																									;005
  if (o.catalog_type_cd = pharmacy_cd)																				;005
    if (o.iv_ind = 1 or (o.med_order_type_cd = intermittent_cd and oiCnt > 1) )										;005
	  if (iv_disp_level = "1")																						;005
	 	;if the display text is larger then the print area , add the '...' at the end								;005
		mnem_length = size(trim(o.ordered_as_mnemonic),1)															;005
	 	if (mnem_length > max_length)																				;005
	 	  orders->qual[ord_cnt].mnemonic = trim(concat(substring(1, max_length-3, o.ordered_as_mnemonic), "..."))	;005
	 	else																										;005
	 	  orders->qual[ord_cnt].mnemonic = o.ordered_as_mnemonic													;005
	 	endif	 																									;005
	  else			  																								;005
	 	;if the display text is larger then the print area , add the '...' at the end								;005
		mnem_length = size(trim(o.hna_order_mnemonic),1)															;005
	 	if (mnem_length > max_length)																				;005
	 	  orders->qual[ord_cnt].mnemonic = trim(concat(substring(1, max_length-3, o.hna_order_mnemonic), "..."))	;005
	 	else																										;005
	 	  orders->qual[ord_cnt].mnemonic = o.hna_order_mnemonic														;005
	 	endif	 																									;005
	  endif																											;005
    else   																											;005
    if (mnem_disp_level = "0")
	  ;BEGIN 002
	  mnem_length = size(trim(o.hna_order_mnemonic),1)
	  if (mnem_length >= mnemonic_size
	  	  and SUBSTRING(mnem_length - 3, mnem_length, o.hna_order_mnemonic) != "...")
	  	orders->qual[ord_cnt].mnemonic = concat(trim(o.hna_order_mnemonic), "...")
	  else
	    orders->qual[ord_cnt].mnemonic = trim(o.hna_order_mnemonic)
	  endif
	  ;END 002
;002      orders->qual[ord_cnt].mnemonic = trim(o.hna_order_mnemonic)
    endif
    if (mnem_disp_level = "1")
      if ((o.hna_order_mnemonic = o.ordered_as_mnemonic)
         or (o.ordered_as_mnemonic = " "))
      	;BEGIN 002
      	mnem_length = size(trim(o.hna_order_mnemonic),1)
	    if (mnem_length >= mnemonic_size
	    	and SUBSTRING(mnem_length - 3, mnem_length, o.hna_order_mnemonic) != "...")
	  	  orders->qual[ord_cnt].mnemonic = concat(trim(o.hna_order_mnemonic), "...")
	    else
	      orders->qual[ord_cnt].mnemonic = trim(o.hna_order_mnemonic)
	    endif
	    ;END 002
;002        orders->qual[ord_cnt].mnemonic = trim(o.hna_order_mnemonic)
      else
      	;BEGIN 002
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
	    ;END 002
;002        orders->qual[ord_cnt].mnemonic = concat(trim(o.hna_order_mnemonic),"(",trim(o.ordered_as_mnemonic),")")
      endif
    endif
    if (mnem_disp_level = "2" and o.iv_ind != 1)
      if ((o.hna_order_mnemonic = o.ordered_as_mnemonic)
         or (o.ordered_as_mnemonic = " "))
      	;BEGIN 002
      	mnem_length = size(trim(o.hna_order_mnemonic),1)
	    if (mnem_length >= mnemonic_size
	    	and SUBSTRING(mnem_length - 3, mnem_length, o.hna_order_mnemonic) != "...")
	  	  orders->qual[ord_cnt].mnemonic = concat(trim(o.hna_order_mnemonic), "...")
	    else
	      orders->qual[ord_cnt].mnemonic = trim(o.hna_order_mnemonic)
	    endif
	    ;END 002
;002        orders->qual[ord_cnt].mnemonic = trim(o.hna_order_mnemonic)
      else
      	;BEGIN 002
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
	    ;END 002
;002        orders->qual[ord_cnt].mnemonic = concat(trim(o.hna_order_mnemonic),"(",trim(o.ordered_as_mnemonic),")")
      endif
      if ((o.order_mnemonic != o.ordered_as_mnemonic) and (size(o.order_mnemonic,1) > 0))     ;006
      	;BEGIN 002
      	mnem_length = size(trim(o.order_mnemonic),1)
      	if (mnem_length >= mnemonic_size
      		and SUBSTRING(mnem_length - 3, mnem_length, o.order_mnemonic) != "...")
	  	  orders->qual[ord_cnt].mnemonic = concat(trim(orders->qual[ord_cnt].mnemonic),"(",trim(o.order_mnemonic),"...)")
	    else
	      orders->qual[ord_cnt].mnemonic = concat(trim(orders->qual[ord_cnt].mnemonic),"(",trim(o.order_mnemonic),")")
	    endif
	    ;END 002
;002        orders->qual[ord_cnt].mnemonic = concat(trim(orders->qual[ord_cnt].mnemonic),"(",trim(o.order_mnemonic),")")
      endif
    endif
  endif
  endif																							;005
 
  if (oa.action_type_cd in (order_cd, suspend_cd, resume_cd, cancel_cd, discont_cd, void_cd))	;005
    orders->qual[ord_cnt].fmt_action_cd = oa.action_type_cd										;005
  else
    orders->qual[ord_cnt].fmt_action_cd = order_cd
  endif
 
  /* Put logic in here if you want to keep certain types of orders to not print
    May be things like complete orders/continuing orders/etc. */
  if ((oa.action_type_cd in (order_cd,modify_cd,cancel_cd,discont_cd,complete_cd,transfer_cd,
       reorder_cd,activate_cd,studactivate_cd)) AND o.encntr_id>0 AND o.template_order_flag != 7)  ;008
 
    orders->spoolout_ind = 1
    orders->qual[ord_cnt]->display_ind = 1
  else
    orders->qual[ord_cnt]->display_ind = 0
  endif
 
with outerjoin = d2, nocounter
 
 
/******************************************************************************
*     ORDER DETAIL INFORMATION                                                *
******************************************************************************/
 
select into "nl:"
from order_detail od,
     oe_format_fields oef,
     order_entry_fields of1,
     (dummyt d1 with seq = value(order_cnt))
     ,nomenclature n				;015
 
plan d1
join od
  where orders->qual[d1.seq].order_id = od.order_id
join oef
  where oef.oe_format_id = orders->qual[d1.seq].oe_format_id
    and oef.action_type_cd = orders->qual[d1.seq].fmt_action_cd
    and oef.oe_field_id = od.oe_field_id
;016    and oef.accept_flag != 2
join of1
  where of1.oe_field_id = oef.oe_field_id
 
join n															;015
where n.nomenclature_id = outerjoin(od.oe_field_value)			;015
 
order by od.order_id, od.oe_field_id, od.action_sequence desc
 
/* If order details need to print in the order on the format:
   order by od.order_id,oef.group_seq,oef.field_seq,od.oe_field_id,
   od.action_sequence desc */
 
head report
  orders->qual[d1.seq].d_cnt = 0
 
head od.order_id
  stat = alterlist(orders->qual[d1.seq].d_qual,5)
  orders->qual[d1.seq].stat_ind = 0
 
head od.oe_field_id
  act_seq = od.action_sequence
  odflag = 1
  case (od.oe_field_meaning)
    of "COLLPRI": orders->qual[d1.seq].priority = od.oe_field_display_value
    of "PRIORITY": orders->qual[d1.seq].priority = od.oe_field_display_value
    of "REQSTARTDTTM": orders->qual[d1.seq].req_st_dt = od.oe_field_display_value
    of "FREQ": orders->qual[d1.seq].frequency = od.oe_field_display_value
    of "RATE": orders->qual[d1.seq].rate = od.oe_field_display_value
    of "DURATION": orders->qual[d1.seq].duration = od.oe_field_display_value
    of "DURATIONUNIT": orders->qual[d1.seq].duration_unit = od.oe_field_display_value
    of "NURSECOLLECT": orders->qual[d1.seq].nurse_collect = od.oe_field_display_value
  endcase
 
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
    if (oef.label_text = "ICD9 Code")										;015
      orders->qual[d1.seq].d_qual[dc].label_text = "Diagnosis Code"			;015
      orders->qual[d1.seq].d_qual[dc].value = concat(trim(n.source_identifier,3)		;015
      													," - ",trim(n.source_string,3))		;015
    else
     orders->qual[d1.seq].d_qual[dc].value = trim(od.oe_field_display_value,3)     ;006
     orders->qual[d1.seq].d_qual[dc].label_text = trim(oef.label_text)
    endif																	;015
    orders->qual[d1.seq].d_qual[dc].field_value = od.oe_field_value
    orders->qual[d1.seq].d_qual[dc].group_seq = oef.group_seq
    orders->qual[d1.seq].d_qual[dc].oe_field_meaning_id = od.oe_field_meaning_id
    orders->qual[d1.seq].d_qual[dc].clin_line_ind = oef.clin_line_ind
    orders->qual[d1.seq].d_qual[dc].label = trim(oef.clin_line_label)
    orders->qual[d1.seq].d_qual[dc].suffix = oef.clin_suffix_ind
 
    ind_flag = cnvtupper(trim(orders->qual[d1.seq].d_qual[dc].label_text))
 
    if (ind_flag in ("SPECIAL INSTRUCTIONS","SPECIAL QUESTION" ))
      orders->qual[d1.seq].d_qual[dc].special_ind = 1
    else
      orders->qual[d1.seq].d_qual[dc].special_ind = 0
    endif
 
    if ((ind_flag = "PRIORITY") or (ind_flag = "COLLECTION PRIORITY") or
        (ind_flag = "REPORTING PRIORITY") or (ind_flag = "PHARMACY PRIORITY")
        or (ind_flag = "PHARMACY ORDER PRIORITY"))
      orders->qual[d1.seq].d_qual[dc].priority_ind = 1
    else
      orders->qual[d1.seq].d_qual[dc].priority_ind = 0
    endif
 
    if (size(od.oe_field_display_value,1) > 0)     ;006
      orders->qual[d1.seq].d_qual[dc].print_ind = 0
    else
      orders->qual[d1.seq].d_qual[dc].print_ind = 1
    endif
 
    if ((od.oe_field_meaning_id = 1100
       or od.oe_field_meaning_id = 8
       or od.oe_field_meaning_id = 127
       or od.oe_field_meaning_id = 43)
       and trim(cnvtupper(od.oe_field_display_value),3) = "STAT")     ;006
      orders->qual[d1.seq].stat_ind = 1
    endif
 
;start 016
;    if (of1.field_type_flag = 7)
;      if (od.oe_field_value = 1)
;        if (oef.disp_yes_no_flag = 0 or oef.disp_yes_no_flag = 1)
;          orders->qual[d1.seq].d_qual[dc].value = trim(oef.label_text)
;        else
;          orders->qual[d1.seq].d_qual[dc].clin_line_ind = 0
;        endif
;      else
;        if (oef.disp_yes_no_flag = 0 or oef.disp_yes_no_flag = 2)
;          orders->qual[d1.seq].d_qual[dc].value = trim(oef.clin_line_label)
;        else
;          orders->qual[d1.seq].d_qual[dc].clin_line_ind = 0
;        endif
;      endif
;    endif
;end 016
 
  endif
 
foot od.order_id
  stat = alterlist(orders->qual[d1.seq].d_qual, dc)
 
with nocounter
 
/* Build order details line if it exceeds 255 characters */
 
for (x = 1 to order_cnt)
  if (orders->qual[x].clin_line_ind = 1)
    set started_build_ind = 0
    for (fsub = 1 to 71)
      for (xx = 1 to orders->qual[x].d_cnt)
        if ((orders->qual[x].d_qual[xx].group_seq = fsub or fsub = 71)
             and orders->qual[x].d_qual[xx].print_ind = 0)
          if (orders->qual[x].d_qual[xx].clin_line_ind = 1)
            if (started_build_ind = 0)
              set started_build_ind = 1
              if (orders->qual[x].d_qual[xx].suffix = 0
                  and size(orders->qual[x].d_qual[xx].label,1) > 0)     ;006
                set orders->qual[x].display_line =
                  concat(trim(orders->qual[x].d_qual[xx].label)," ",
                    trim(orders->qual[x].d_qual[xx].value))
              elseif (orders->qual[x].d_qual[xx].suffix = 1
                      and size(orders->qual[x].d_qual[xx].label,1) > 0)     ;006
                set orders->qual[x].display_line =
                  concat(trim(orders->qual[x].d_qual[xx].value)," ",
                    trim(orders->qual[x].d_qual[xx].label))
              else
                set orders->qual[x].display_line =
                  concat(trim(orders->qual[x].d_qual[xx].value)," ")
              endif
            else
              if (orders->qual[x].d_qual[xx].suffix = 0
                  and size(orders->qual[x].d_qual[xx].label,1) > 0)     ;006
                set orders->qual[x].display_line =
                  concat(trim(orders->qual[x].display_line),",",
                    trim(orders->qual[x].d_qual[xx].label)," ",
                    trim(orders->qual[x].d_qual[xx].value))
              elseif (orders->qual[x].d_qual[xx].suffix = 1
                      and size(orders->qual[x].d_qual[xx].label,1) > 0)     ;006
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
 
/* Line wrapping for special instructions */
 
for (x = 1 to order_cnt)
  for (y = 1 to orders->qual[x].d_cnt)
    if (orders->qual[x].d_qual[y].special_ind = 1)
      set pt->line_cnt = 0
      set max_length = 65		;009
      execute dcp_parse_text value(orders->qual[x].d_qual[y].value),value(max_length)
      set stat = alterlist(orders->qual[x].disp_ln_qual, pt->line_cnt)
      set orders->qual[x].disp_ln_cnt = pt->line_cnt
      for (z = 1 to pt->line_cnt)
        set orders->qual[x].disp_ln_qual[z].disp_line = pt->lns[z].line
      endfor
    endif
  endfor
endfor
 
 
/******************************************************************************
*     GET ACCESSION NUMBER                                                    *
******************************************************************************/
 
select into "nl:"
from accession_order_r aor
 
plan aor
  where expand(num, 1, order_cnt, aor.order_id, orders->qual[num].order_id)
 
detail
  orders->qual[num].accession = aor.accession
 
with nocounter
 
 
 
/* Line wrapping for orderable */
 
for (x = 1 to order_cnt)
  if (size(orders->qual[x].mnemonic,1) > 0)     ;006
   set pt->line_cnt = 0
   set max_length = 90
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
 		oc.action_sequence desc	;013
 
    head report
      orders->qual[x].comment = lt.long_text
 
    with nocounter
 
    set pt->line_cnt = 0
    set max_length = 90
    execute dcp_parse_text value(orders->qual[x].comment),value(max_length)
    set stat = alterlist(orders->qual[x].com_ln_qual, pt->line_cnt)
    set orders->qual[x].com_ln_cnt = pt->line_cnt
    for (y = 1 to pt->line_cnt)
      set orders->qual[x].com_ln_qual[y].com_line = pt->lns[y].line
    endfor
  endif
endfor
 
 
/******************************************************************************
*     SEND TO OUTPUT PRINTER                                                  *
******************************************************************************/
 
 if (orders->spoolout_ind = 1)
 
 execute cpm_create_file_name "ormreq02","dat"
 
select into  cpm_cfn_info->file_name_path
 
;select into value(request->printer_name)
d1.seq
from (dummyt d1 with seq = 1)
 
plan d1
 
head report
    BC_DIO    = "{LPI/24}{CPI/8}{BCR/250}{FONT/28/7}"
    REG_DIO   = "{LPI/8}{CPI/12}{FONT/8}"
    REG2_DIO  = "{LPI/6}{CPI/12}{COLOR/0}{FONT/0}"
    REG3_DIO  = "{LPI/8}{CPI/12}{FONT/4}"
 
    /* This script allows for a custom hospital image or logo to be inserted
       at the top of each page.  The image must be in PostScript format and
       must have corresponding .FRM and .DCT files.  Insert the name and location
       of the .FRM file here and uncomment the line. */
 
    ;call printimage(user:[path]filename.frm)
 
    first_page = "Y"
    vv = 0
    save_vv = 1
    save_ww = 0
    next_column = 0
 
 
head page
    REG_DIO, row+1
 
    /* These two lines also need to be modified and uncommented to add a
       hospital logo. */
 
    ;call print(calcpos(700,50))
    ;call printimage(user:[path]filename.dct)
 
;015    "{CPI/12}{POS/85/74}{B}", "Medical Record Number:  ", call print(trim(orders->mrn,3))
	"{CPI/12}{POS/35/64}{B}", "Medical Record Number:  ", call print(trim(orders->mrn,3))		;015
    "{CPI/12}{POS/35/74}{B}", "Mayo Clinic Number:  ", call print(trim(orders->cmrn,3))			;015
    "{CPI/12}{POS/350/74}{B}", "Financial Number:  ", call print(trim(orders->fnbr,3)), row+1
 
    /* The following lines allow for customized hospital information
       to be entered.  Replace the default text with location-specific
       information (NOTE: May need to be re-centered, do so by adjusting
       the numeric value following the text). */
 
/*  start 015
    "{CPI/9}{POS/0/104}{B}{CENTER/Baseline West Medical Center/17}", row+1 ;name
    ;"{CPI/9}{B}", call print(calcpos(0,64)), call center(orders->facility,1,186), row+1
    "{CPI/9}{POS/0/120}{B}{CENTER/123 Holly Way/18}", row+1 ;address 1st line
    "{CPI/9}{POS/0/136}{B}{CENTER/Kansas City, MO 64117/17/5}", row+1 ;address 2nd line
    "{CPI/9}{POS/0/152}{B}{CENTER//17}", row+1 ;additional information
 end 015  */
    "{CPI/12}{POS/0/100}{B}", call print(calcpos(0,100)), call center(orders->facility,1,270), row+1
    "{CPI/12}{POS/0/112}{B}", call print(calcpos(0,112)), call center(orders->fac_address1,1,270), row+1
    "{CPI/12}{POS/0/124}{B}", call print(calcpos(0,124)), call center(orders->fac_address2,1,270), row+1
    "{CPI/12}{POS/0/136}{B}", call print(calcpos(0,136)), call center(orders->fac_city_st_zip,1,270), row+1
 
 
    "{CPI/12}{POS/35/170}", "Name: "
    "{CPI/12}{POS/135/170}{B}", call print(trim(orders->name,3)), "{ENDB}"
    "{CPI/12}{POS/350/170}", "Date of Birth: "
    "{CPI/12}{POS/420/170}", orders->dob, row+1
    "{CPI/12}{POS/35/180}", "Admitting Diagnosis: " ,"{CPI/12}{POS/135/180}",
    if(textlen(orders->admit_diagnosis) > 25)
	    call print(trim(concat(substring(1, 22, orders->admit_diagnosis), "..."))),row+1
    else
	    call print(orders->admit_diagnosis), row+1
    endif
    "{CPI/12}{POS/350/180}", "Age: "
    "{CPI/12}{POS/420/180}", call print(trim(orders->age,3)), row+1
 
    "{CPI/12}{POS/35/200}", "Admit Date: "
    "{CPI/12}{POS/135/200}", call print(trim(orders->admit_dt,3))
    "{CPI/12}{POS/350/190}", "Height: "
    "{CPI/12}{POS/420/190}", call print(trim(orders->height,3)), row+1
    "{CPI/12}{POS/35/210}", "Location: "
    "{CPI/12}{POS/135/210}{B}", orders->nurse_unit, "{ENDB}"
    "{CPI/12}{POS/350/200}", "Weight: "
    "{CPI/12}{POS/420/200}", call print(trim(orders->weight,3)), row+1
    "{CPI/12}{POS/35/220}", "Room: "
    "{CPI/12}{POS/135/220}{B}", orders->location, "{ENDB}"
    "{CPI/12}{POS/350/210}", "Sex: "
    "{CPI/12}{POS/420/210}", orders->sex, row+1
    "{CPI/12}{POS/350/220}", "LOS: "
    "{CPI/12}{POS/420/220}", call print(trim(cnvtstring(orders->los),3)), " Days", row+1
 
    "{CPI/12}{POS/35/240}", "Allergies: "
    if (allergy->line_cnt > 0)
      "{CPI/12}{POS/80/240}{B}", allergy->line_qual[1].line, row+1
    endif
    if (allergy->line_cnt > 1)
      "{CPI/12}{POS/80/250}{B}", allergy->line_qual[2].line, row+1
    endif
    if (allergy->line_cnt > 2)
      "{CPI/12}{POS/80/260}{B}", "(see patient chart for more information)", row+1
    endif
 
    row+1
 
 
 
detail
 
  for (vv = 1 to VALUE(ord_cnt))
  if (orders->qual[vv]->display_ind = 1)
    if (first_page = "N")
      break
    endif
 
    first_page = "N"
    "{CPI/12}{POS/23/275}{BOX/55/2}"
    "{CPI/12}{POS/35/290}", "Order: "
    if (size(orders->qual[vv].mnemonic) > 55)
      "{CPI/12}{POS/80/290}{B}", call print(concat(substring(1,55,orders->qual[vv].mnemonic),"...")), "{ENDB}", row+1
    else
      "{CPI/12}{POS/80/290}{B}", orders->qual[vv].mnemonic, "{ENDB}", row+1
    endif
    "{CPI/12}{POS/35/325}", "Order Action: "
    "{CPI/12}{POS/145/325}{B}",
        call print(uar_get_code_display(orders->qual[vv].action_type_cd)), row+1
 
    "{CPI/12}{POS/35/340}", "Order Date/Time: "
    "{CPI/12}{POS/145/340}", call print(orders->qual[vv].order_dt), row+1
    "{CPI/12}{POS/35/350}", "Ordered By: "
    "{CPI/12}{POS/145/350}", call print(orders->qual[vv].enter_by), row+1
    "{CPI/12}{POS/35/360}", "Ordering MD: "
    "{CPI/12}{POS/145/360}", call print(orders->qual[vv].order_dr), row+1
    "{CPI/12}{POS/35/370}", "Attending MD: "
    if (orders->attending_cnt = 1)															/*14 starts here*/
    	"{CPI/12}{POS/145/370}", call print(orders->attending[1].attending_phy), row+1
		"{CPI/12}{POS/35/380}", "Order ID: "
    	"{CPI/12}{POS/145/380}", call print(trim(cnvtstring(orders->qual[vv].order_id),3))
    	"{CPI/12}{POS/35/390}", "Communication Type: "
    	"{CPI/12}{POS/145/390}", call print(orders->qual[vv].communication_type), row+1
    elseif (orders->attending_cnt > 1)
    	"{CPI/12}{POS/145/370}", call print(orders->attending[1].attending_phy), row+1
		"{CPI/12}{POS/145/380}", "More Attending MDs Exist",row+1
    	"{CPI/12}{POS/35/390}", "Order ID: "
    	"{CPI/12}{POS/145/390}", call print(trim(cnvtstring(orders->qual[vv].order_id),3))
    	"{CPI/12}{POS/35/400}", "Communication Type: "
    	"{CPI/12}{POS/145/400}", call print(orders->qual[vv].communication_type), row+1
	elseif (orders->attending_cnt = 0)
    	"{CPI/12}{POS/145/370}", row+1
    	"{CPI/12}{POS/35/380}", "Order ID: "
    	"{CPI/12}{POS/145/380}", call print(trim(cnvtstring(orders->qual[vv].order_id),3))
    	"{CPI/12}{POS/35/390}", "Communication Type: "
    	"{CPI/12}{POS/145/390}", call print(orders->qual[vv].communication_type), row+1
    endif																					/*14 ends here*/
;016    "{B}{CPI/8}{POS/0/325}",
;016    call center(orders->qual[vv].catalog,1,180),row+1
    save_ww = -1
    next_column = 0
    xcol = 35
    ycol = 420
    for (fsub = 1 to 71)
      for (ww = 1 to orders->qual[vv]->d_cnt)
        if (((orders->qual[vv].d_qual[ww]->group_seq = fsub)
           or (fsub = 71 and orders->qual[vv]->d_qual[ww]->print_ind = 0))
           and (ycol < 650) and (size(orders->qual[vv]->d_qual[ww]->value,1) > 0))     ;006
          orders->qual[vv]->d_qual[ww]->print_ind = 1
          if (orders->qual[vv]->d_qual[ww]->special_ind = 1)
            save_ww = ww
          else
            if (xcol = 35)
              ;015  if (size(orders->qual[vv]->d_qual[ww]->label_text) > 28)
              ;015    "{CPI/17}"
              ;015  else
                "{CPI/12}"
              ;015  endif
              call print(calcpos(xcol,ycol)),
              ;015  if(textlen(orders->qual[vv]->d_qual[ww]->label_text)>37)
              ;015    	 if ((size(orders->qual[vv]->d_qual[ww]->label_text)
	          ;015     		 + size(orders->qual[vv]->d_qual[ww]->value)) > 65)
	          ;015    		 call print(substring(1,65,concat(orders->qual[vv]->d_qual[ww]->label_text,": ",
	          ;015    		 orders->qual[vv]->d_qual[ww]->value))),"..."
	          ;015  	 	else
	          ;015  		 	 call print(orders->qual[vv]->d_qual[ww]->label_text),": ",
	          ;015  		 	 orders->qual[vv]->d_qual[ww]->value
	          ;015  	 	endif
              ;015  else
	              call print(trim(orders->qual[vv]->d_qual[ww]->label_text,3)), ": ",
	              call print(calcpos(225,ycol))
	              if (orders->qual[vv]->d_qual[ww]->priority_ind = 1)
	                "{B}"
	              endif
	              ;015  if (size(orders->qual[vv]->d_qual[ww]->value) > 28)
	              ;015    "{CPI/12}", call print(concat(substring(1,28,orders->qual[vv]->d_qual[ww]->value),"...")), row+1
	              ;015  else
				  if (size(orders->qual[vv]->d_qual[ww]->value,1) > 85)
    				pt->line_cnt = 0
    				max_length = 85
    				hold_text = orders->qual[vv]->d_qual[ww]->value
    				call echo(hold_text)
    				call parse_text(hold_text,max_length)
				    for (y = 1 to pt->line_cnt)
				      if (y = 1)
				        "{CPI/12}", call print(trim(pt->lns[1].line,3)), row+1
				      else
				        ycol = ycol + 10
	              		call print(calcpos(225,ycol))
				        "{CPI/12}", call print(trim(pt->lns[y].line,3)), row+1
				      endif
				    endfor
				  else
	                "{CPI/12}", call print(trim(orders->qual[vv]->d_qual[ww]->value,3)), row+1
	              endif
	              ;015  endif
	           ;015  endif
	         "{ENDB}"
            elseif (xcol = 325)
              if (size(orders->qual[vv]->d_qual[ww]->label_text) > 28)
                "{CPI/12}"
              else
                "{CPI/12}"
              endif
              call print(calcpos(xcol,ycol)),
                if(textlen(orders->qual[vv]->d_qual[ww]->label_text)>37)
                	 if ((size(orders->qual[vv]->d_qual[ww]->label_text)
	             		 + size(orders->qual[vv]->d_qual[ww]->value)) > 65)
	            		 call print(substring(1,65,concat(orders->qual[vv]->d_qual[ww]->label_text,": ",
	            		 orders->qual[vv]->d_qual[ww]->value))),"..."
	         	 	else
	          		 	 call print(orders->qual[vv]->d_qual[ww]->label_text),": ",
	          		 	 orders->qual[vv]->d_qual[ww]->value
	         	 	endif
                else
                 	 call print(trim(orders->qual[vv]->d_qual[ww]->label_text,3)), ": ",
                 	 call print(calcpos(440,ycol))
             		 if (orders->qual[vv]->d_qual[ww]->priority_ind = 1)
              		  "{B}"
            		  endif
	                 if (size(orders->qual[vv]->d_qual[ww]->value) > 28)
	              		  "{CPI/12}", call print(concat(substring(1,28,orders->qual[vv]->d_qual[ww]->value),"...")), row+1
	             	 else
	               		 "{CPI/12}", call print(trim(orders->qual[vv]->d_qual[ww]->value,3)), row+1
	             	 endif
                endif
              "{ENDB}"
            endif
          endif
 
;016          if ((ycol < 610) and (orders->qual[vv]->d_qual[ww]->special_ind = 0)
;016              and (next_column = 0))
;016             xcol = 85
;016             ycol = ycol + 10
;016           elseif ((ycol >= 610) and (orders->qual[vv]->d_qual[ww]->special_ind = 0))
;016             xcol = 325
;016             ycol = 510
;016             next_column = 1
;016           elseif ((ycol < 610) and (orders->qual[vv]->d_qual[ww]->special_ind = 0)
;016                  and (next_column = 1))
;016             xcol = 325
;016             ycol = ycol + 10
;016           endif
         if (ycol < 640 and orders->qual[vv]->d_qual[ww]->special_ind = 0)
  			xcol = 35
            ycol = ycol + 10
         elseif (ycol >= 640 and orders->qual[vv]->d_qual[ww]->special_ind = 0 and orders->qual[vv]->d_cnt != ww)
            ycol = ycol + 10
           call print (calcpos(200,ycol)),"**Continued on next page**"
           "{CPI/12}{POS/35/720}{B}", "Electronically Signed By:  ", call print(trim(orders->qual[vv].order_dr,3))		;016
    	   "{CPI/12}{POS/35/730}{B}", "On:  ", call print(trim(orders->qual[vv].signed_dt,3))		;016
		   "{ENDB}{CPI/12}{POS/530/730}", "Page: ", curpage "###"		;016
           saved_pos = vv
    	   break
           xcol=85
		   ycol=275
 
         endif
 
        endif
      endfor
    endfor
 
    if (save_ww >= 0)
      xcol = 35
      if (next_column = 1)
        ycol = 620
      endif
      "{CPI/12}", call print(calcpos(xcol,ycol)),
          call print(trim(orders->qual[vv]->d_qual[save_ww]->label_text,3)), ": "
      for (zz = 1 to orders->qual[vv].disp_ln_cnt)
    	 "{CPI/12}", call print(calcpos(140,ycol)),
            call print(orders->qual[vv].disp_ln_qual[zz].disp_line), row+1
                ycol = ycol + 10
          	if (ycol > 640 and zz < orders->qual[vv].disp_ln_cnt)
          		call print (calcpos(200,ycol)),"**Continued on next page**"
          		"{CPI/12}{POS/35/720}{B}", "Electronically Signed By:  ", call print(trim(orders->qual[vv].order_dr,3))		;016
    			"{CPI/12}{POS/35/730}{B}", "On:  ", call print(trim(orders->qual[vv].signed_dt,3))		;016
			    "{ENDB}{CPI/12}{POS/530/730}", "Page: ", curpage "###"		;016
 
	            saved_pos = vv
           		break
           		xcol=35
				ycol=275
           		"{CPI/12}",call print(calcpos(xcol,ycol)),
               	call print(concat(orders->qual[vv]->d_qual[save_ww]->label_text, " cont. "))
	        endif
      endfor
    endif
  if ( orders->qual[vv].com_ln_cnt > 0)		;016
       ycol = ycol + 10
    if (ycol >= 640 and orders->qual[vv]->d_qual[ww]->special_ind = 0)
       call print (calcpos(200,ycol)),"**Continued on next page**"
       "{CPI/12}{POS/35/720}{B}", "Electronically Signed By:  ", call print(trim(orders->qual[vv].order_dr,3))		;016
       "{CPI/12}{POS/35/730}{B}", "On:  ", call print(trim(orders->qual[vv].signed_dt,3))		;016
	   "{ENDB}{CPI/12}{POS/530/730}", "Page: ", curpage "###"		;016
       saved_pos = vv
       break
       xcol=85
	   ycol=275
	endif
;016    "{CPI/12}{POS/35/670}{B}", "Comments: ", "{ENDB}", row+1
    "{CPI/12}",call print (calcpos(35,ycol)),"{B}Comments: {ENDB}", row+1
;016    ycol = 670
;016    if (orders->qual[vv].com_ln_cnt > 4)			;015
;016      orders->qual[vv].com_ln_cnt = 4				;015
;016    endif											;015
    for (zz = 1 to orders->qual[vv].com_ln_cnt)
      "{CPI/12}", call print(calcpos(116,ycol)),
          call print(orders->qual[vv].com_ln_qual[zz].com_line), row+1
      ycol = ycol + 10
      if (ycol > 640 and zz < orders->qual[vv].com_ln_cnt)
          		call print (calcpos(200,ycol)),"**Continued on next page**"
          		"{CPI/12}{POS/35/720}{B}", "Electronically Signed By:  ", call print(trim(orders->qual[vv].order_dr,3))		;016
    			"{CPI/12}{POS/35/730}{B}", "On:  ", call print(trim(orders->qual[vv].signed_dt,3))		;016
			    "{ENDB}{CPI/12}{POS/530/730}", "Page: ", curpage "###"		;016
 
	            saved_pos = vv
           		break
           		xcol=35
				ycol=275
           		"{CPI/12}",call print(calcpos(xcol,ycol)),"Comment cont. "
	        endif
;015      if (zz = 7)
;016	  if (zz = 4)		;015
;016        "{CPI/12}", call print(calcpos(110,ycol)),
;016            "(see patient chart for more information)", row+1
;016        zz = orders->qual[vv].com_ln_cnt
;016      endif
    endfor
  endif				;016
    "{CPI/12}{POS/35/720}{B}", "Electronically Signed By:  ", call print(trim(orders->qual[vv].order_dr,3))		;015
    "{CPI/12}{POS/35/730}{B}", "On:  ", call print(trim(orders->qual[vv].signed_dt,3))		;015
    "{ENDB}{CPI/12}{POS/530/730}", "Page: ", curpage "###"		;016
    save_vv = vv + 1
  endif
endfor
 
with nocounter, maxrow=800, maxcol=750, dio=postscript
 
 set spool = value(trim(cpm_cfn_info->file_name_path)) value(trim(request->printer_name)) with deleted
 
endif
 
 
#exit_script
set last_mod = "016"
end
go
 
 
