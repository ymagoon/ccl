/*****************************************************************************
 
        Source file name:       mayo_mn_home_meds.PRG
        Object name:            mayo_mn_home_meds
        Request #:
 
 
        Program purpose:        Smart template for home meds review in depart process
 
        Tables read:            order_recon, order_recon_detail
        Tables updated:         None
        Executing from:
 
        Special Notes:
 
******************************************************************************
;~DB~************************************************************************
;*                      GENERATED MODIFICATION CONTROL LOG              *
;************************************************************************
;*                                                                      *
;*Mod Date     Engineer                Comment                          *
;*--- -------- --------------------    ---------------------------------*
;000 04/18/2012 Akcia                 Initial Release - copy of mayo_az_home_meds2                 *
 
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************/
drop program mayo_mn_home_meds:dba go
create program mayo_mn_home_meds:dba
 
/*
free record request
record request
(
  1 output_device   = vc
  1 script_name     = vc
  1 person_cnt      = i4
  1 person [1]
    2 person_id     = f8
  1 visit_cnt       = i4
  1 visit [1]
    2 encntr_id     = f8
  1 prsnl_cnt       = i4
  1 prsnl [*]
    2 prsnl_id      = f8
  1 nv_cnt          = i4
  1 nv [*]
    2 pvc_name      = vc
    2 pvc_value     = vc
  1 batch_selection = vc
)
set request->person[1].person_id = 5212750 ;5212772
set request->visit[1].encntr_id = 16573571 ;16573586
*/
 
 
/*The embedded RTF commands at top of document */
set rhead =
"{\rtf1\ansi \deff0{\fonttbl{\f0\fswiss Arial;}}{\colortbl;\red0\green0\blue0;\red255\green255\blue255;}\deftab1134"
/*The embedded RTF commands at top of document for a 1st line reqular */
SET RH2r = "\plain \f0 \fs22 \cb2 \pard\sl0 "		;mod009 fs18
/*The embedded RTF commands at top of document for a 1st line bold */
SET RH2b = "\plain \f0 \fs22 \b \cb2 \pard\sl0 "	;mod009 fs18
; same size as med, but not bold
SET RH2nb = "\plain \f0 \fs28 \cb2 \pard\sl0 "		;mod009 fs24
/*The embedded RTF commands at top of document for a 1st line bold-underlined */
SET RH2bu = "\plain \f0 \fs28 \b \ul \cb2 \pard\sl0 "	;mod009 fs24
/*The embedded RTF commands at top of document for a 1st line underlined */
SET RH2u = "\plain \f0 \fs22 \u \cb2 \pard\sl0 "	;mod009 fs18
/*The embedded RTF commands at top of document for a 1st line italized */
SET RH2i = "\plain \f0 \fs2 \i \cb2 \pard\sl0 "		;mod009 fs18
/*The end of line embedded RTF command */
set Reol = "\par "
/*The tab embedded RTF command */
set Rtab = "\tab "
/*the embedded RTF commands for normal word(s) */
set wr = " \plain \f0 \fs20 \cb2 "
/*the embedded RTF commands for bold word(s) */
set wb = " \plain \f0 \fs20 \b \cb2 "
/*the embedded RTF commands for underlined word(s) */
set wu = " \plain \f0 \fs18 \ul \cb2 "
/*the embedded RTF commands for italics word(s) */
set wi = " \plain \f0 \fs18 \i \cb2 "
/*the embedded RTF commands for bold-italics word(s) */
set wbi = " \plain \f0 \fs18 \b \i \cb2 "
/*the embedded RTF commands for bold-underline-italics word(s) */
set wiu = " \plain \f0 \fs18 \i \ul \cb2 "
/*the embedded RTF commands for italics word(s) */
set wbiu = " \plain \f0 \fs18 \b \ul \i \cb2 "
/*the embedded RTF commands for bold-underline word(s) */
set wbu = " \plain \f0 \fs18 \b \ul \cb2 "
/*the embedded RTF commands to end the document*/
set rtfeof = "}"
 
free set rpt_data
record rpt_data
(
  1 order_qual[*]
    2 order_id = f8
    2 action = vc
    2 drug_name = vc
    2 ordered_as = vc
    2 synonym_type = f8
    2 order_status = vc
    2 med_given_to_patient = vc
    2 FREQ = vc
    2 STRENGTHDOSE  = vc
    2 VOLUMEDOSE = vc
    2 STRENGTHDOSEUNIT = vc
    2 VOLUMEDOSEUNIT = vc
    2 RXROUTE = vc
    2 INFUSEOVER = vc
    2 INFUSEOVERUNIT = vc
    2 DURATION = vc
    2 DURATIONUNIT = vc
    2 RATE = vc
    2 RATEUNIT = vc
    2 PRNINSTRUCTIONS = vc
    2 INDICATION = vc
    2 FREETXTDOSE = vc
    2 SPECINX = vc
    2 REQROUTINGTYPE = vc
    2 freetext_ord = vc
    2 detail_display = vc
    2 comment = vc
    2 prn = vc
    2 prn_instructions = vc
    2 hard_stop_flag = i2
)
 
free set rpt_data2
record rpt_data2
(
  1 order_qual[*]
    2 order_id = f8
    2 action = vc
    2 drug_name = vc
    2 ordered_as = vc
    2 synonym_type = f8
    2 order_status = vc
    2 med_given_to_patient = vc
    2 FREQ = vc
    2 STRENGTHDOSE  = vc
    2 VOLUMEDOSE = vc
    2 STRENGTHDOSEUNIT = vc
    2 VOLUMEDOSEUNIT = vc
    2 RXROUTE = vc
    2 INFUSEOVER = vc
    2 INFUSEOVERUNIT = vc
    2 DURATION = vc
    2 DURATIONUNIT = vc
    2 RATE = vc
    2 RATEUNIT = vc
    2 PRNINSTRUCTIONS = vc
    2 INDICATION = vc
    2 FREETXTDOSE = vc
    2 SPECINX = vc
    2 REQROUTINGTYPE = vc
    2 freetext_ord = vc
    2 detail_display = vc
    2 comment = vc
    2 prn = vc
    2 prn_instructions = vc
    2 hard_stop_flag = i2
)
 
declare stop_cnt = i4 with protect, noconstant(0)
declare start_cnt = i4 with protect, noconstant(0)
declare continue_cnt = i4 with protect, noconstant(0)
 
declare stop_orders_ind = i2 with protect, noconstant(0)
declare start_orders_ind = i2 with protect, noconstant(0)
declare continue_orders_ind = i2 with protect, noconstant(0)
declare pharm = f8 with public,constant(uar_get_code_by("MEANING", 6000, "PHARMACY"))
declare cnt = i4 with protect, noconstant(0)
declare temp_string = vc with protect, noconstant(" ")
declare ordered_cd = f8 with protect, constant(uar_get_code_by("MEANING", 6004, "ORDERED"))
declare completed_cd = f8 with protect, constant(uar_get_code_by("MEANING", 6004, "COMPLETED")) ;007
declare inprocess_cd = f8 with protect, constant(uar_get_code_by("MEANING", 6004, "INPROCESS"))
declare discontinued_cd = f8 with protect, constant(uar_get_code_by("MEANING", 6004, "DISCONTINUED"))
declare cancelled_cd = f8 with protect, constant(uar_get_code_by("MEANING", 6004, "CANCELED"))
declare void_cd = f8 with protect, constant(uar_get_code_by("MEANING", 6004, "DELETED"))
declare admin_recon_dt_tm = dq8
declare disch_recon_dt_tm = dq8
declare reg_dt_tm = dq8
declare missing_order = vc with protect, noconstant("")
declare missing_fin = vc with protect, noconstant("");dmr 012 adding fin
declare hard_stop_cd = f8 with public, constant(uar_get_code_by("MEANING",4009,"DRSTOP"))		;se
declare physician_stop_cd = f8 with public, constant(uar_get_code_by("MEANING",4009,"HARD"))	;se
 
declare brandname_cd = f8 with protect, constant(uar_get_code_by("MEANING",6011,"BRANDNAME")) ;001
declare c_cd = f8 with protect, constant(uar_get_code_by("MEANING",6011,"DISPDRUG"))          ;001
declare y_cd = f8 with protect, constant(uar_get_code_by("MEANING",6011,"GENERICPROD"))       ;002
declare z_cd = f8 with protect, constant(uar_get_code_by("MEANING",6011,"TRADEPROD"))         ;002
declare m_cd = f8 with protect, constant(uar_get_code_by("MEANING",6011,"GENERICTOP"))        ;002
declare n_cd = f8 with protect, constant(uar_get_code_by("MEANING",6011,"TRADETOP"))          ;002
declare primary_cd = f8 with protect, constant(uar_get_code_by("MEANING",6011,"PRIMARY"))     ;001
declare non_form_med = f8 with protect, constant(uar_get_code_by("DISPLAYKEY",200,"MISCPRESCRIPTION"));mod009
 
declare person_id = f8
declare encntr_id = f8
DECLARE NUM = I4 WITH NOCONSTANT(0),PUBLIC
declare num1 = i4 with protect, noconstant(0)
DECLARE START = I4 WITH NOCONSTANT(1),PUBLIC
declare start1 = i4 with protect, noconstant(0)
declare loc_pos = i4 with protect, noconstant(0)
declare ord_pos = i4 with protect, noconstant(0)
declare pharmacy_cd = f8 with protect, constant(uar_get_code_by("MEANING", 6000, "PHARMACY"))
 
declare oe_non_form = f8
declare oe_freetext	= f8
 
declare prsnl_sig=vc
 
select into "nl:"
from order_entry_format oef
plan oef
where oef.oe_format_name in ("Pharmacy Freetext Med", "Pharmacy Med Non-Formulary")
detail
case(oef.oe_format_name)
 of "Pharmacy Freetext Med":
  oe_freetext = oef.oe_format_id
 of "Pharmacy Med Non-Formulary":
  oe_non_form = oef.oe_format_id
endcase
with nocounter
; get the reg_dt_tm of the current encounter
call echo("get the reg_dt_tm of the current encounter")
 
select into "nl:"
from
encounter e
where e.encntr_id =  request->visit[1].encntr_id
detail
person_id = e.person_id
encntr_id = e.encntr_id
reg_dt_tm = e.reg_dt_tm
with nocounter
 
;see if the med rec is complete.  If not warn, user
free set ord_rec
record ord_rec
(
  1 qual[*]
    2 order_id = f8
    2 synonym_type = f8
    2 found = i2
    2 recon_ind = f8
)
 
;get all meds orders for the person
;011 changed this section to look at each order for reconciliation.
call echo("get all meds orders for the person")
 
select into "nl:"
from
  orders o,
  order_catalog_synonym ocs ;001
  , order_recon_detail ord
  , encounter e
  , order_recon orr
  , encntr_alias ea
 
plan o
  where o.person_id = person_id
  and o.orig_ord_as_flag in (0,1,2)
  and o.template_order_flag in (0,1)
  and o.order_status_cd in (inprocess_cd, ordered_cd)
  and o.orderable_type_flag != 6 		;mod008 careset order
  and o.catalog_type_cd = 2776
  and o.dept_misc_line != ("*+*");dmr 016 multi ingredient meds have plus sign
  and o.iv_ind=0  ; iv change for depart
join e where e.encntr_id=o.encntr_id
  and e.encntr_type_cd != 5810
join ea where ea.encntr_id=e.encntr_id;dmr 012 adding fin
  and ea.encntr_alias_type_cd=141.00
  and ea.active_ind=1
; dmr 012 - put this table back so only encounters that are disch rec'd will qualify
; this is to eliminate partially reconciled orders from qualifying.
;join oi where oi.order_id=o.order_id
join ord
  where ord.ORDER_NBR = outerjoin(o.ORDER_ID)
join orr
  where orr.ORDER_RECON_ID = outerjoin(ord.ORDER_RECON_ID)
join ocs                                  			 ;001
  where ocs.synonym_id = outerjoin(o.synonym_id)     ;001	;mod010
  and   ocs.active_ind = outerjoin(1)                ;001	;mod010
order by o.order_id, orr.recon_type_flag desc
 
head o.order_id
 
if (orr.recon_type_flag=3)
  if (mod(cnt,10) = 0)
    stat = alterlist(ord_rec->qual, cnt + 10)
  endif
  cnt = cnt + 1
  ord_rec->qual[cnt].order_id = o.order_id
  ord_rec->qual[cnt].synonym_type = ocs.mnemonic_type_cd  ;001
else
  missing_fin=substring(1,20,ea.alias)
  missing_order = substring(1,50,o.ordered_as_mnemonic)
endif
 
 
foot report
  stat = alterlist(ord_rec->qual, cnt)
with nocounter
;call echorecord(ord_rec)
 
if (missing_order > "" or missing_fin > " ")
  set reply->text = concat(rhead,RH2bu)
  set reply->text = concat(reply->text, reol, "Order was not reconciled for FIN ",
    missing_fin, " ", missing_order, reol)
  set reply->text = concat(reply->text,rtfeof)
  go to exit_script
endif
;************************************************
;get stop orders
 
 
/*get electronic signature*/
select into "nl:"
  name=substring(1,40,pr.name_full_formatted)
from order_recon orr,
  prsnl pr
 
plan orr where orr.encntr_id= encntr_id
join pr where pr.person_id=orr.performed_prsnl_id
  and pr.physician_ind=1
 
order by orr.encntr_id, orr.performed_dt_tm desc
 
head orr.encntr_id;orr.performed_dt_tm
 
prsnl_sig=name
 
with nocounter;, maxqual=1

;get the disch reconciliation of the current encounter
call echo("get the first admin reconciliation of the current encounter")
 
select into "nl:"
from
  order_recon orr,
  encounter e
plan e
  where e.encntr_id = encntr_id
join orr
  where orr.encntr_id = e.encntr_id
  and orr.recon_type_flag = 3
order orr.performed_dt_tm desc
detail
  disch_recon_dt_tm = orr.performed_dt_tm
with nocounter
  
;;************************************************
;; get new orders
;;************************************************
 
call echo("get new orders")
select into "nl:"
from
  encounter e,
  orders o
 
plan e
  where e.encntr_id = encntr_id
 
join o
  where o.encntr_id = e.encntr_id
  and o.orig_ord_as_flag = 1
  and o.current_start_dt_tm >= e.reg_dt_tm
  and o.order_status_cd in (inprocess_cd, ordered_cd)
 
order by
  o.hna_order_mnemonic
 ,o.order_id
 
head report
  stat = alterlist(rpt_data->order_qual, cnt + 10)
head o.order_id
 loc_pos = locateval(num, start, size(rpt_data->order_qual,5), o.order_id, rpt_data->order_qual[num]->order_id)
 if (loc_pos = 0)
  start_orders_ind = 1
  add_new = 1
  cnt = cnt + 1
  if(mod(cnt,10) = 1)
    stat = alterlist(rpt_data->order_qual, cnt + 10)
  endif
  start_cnt = start_cnt + 1
  rpt_data->order_qual[cnt].action = "new"
  rpt_data->order_qual[cnt].order_id = o.order_id
 else
  add_new = 0
 endif 
foot report
  stat = alterlist(rpt_data->order_qual, cnt)
with nocounter

call echo(build("new: ",start_cnt))
call echo(build("cont: ",continue_cnt))
;change new prescription orders that were previously home meds to continued
select into "nl:"
 
from
  (dummyt d2 with seq = value(size(rpt_data->order_qual,5))),
  orders o,
  orders o2
 
plan d2
 
join o
  where o.order_id = rpt_data->order_qual[d2.seq].order_id
 
join o2
where o2.person_id = o.person_id
  and o2.catalog_cd = o.catalog_cd
  and o2.orig_ord_as_flag = 2
  and o2.active_ind = 1
  and o2.order_status_cd+0 = discontinued_cd

order d2.seq

head d2.seq
rpt_data->order_qual[d2.seq].action = "continued"
continue_cnt = continue_cnt + 1
start_cnt = start_cnt - 1
with nocounter
call echo(build("new: ",start_cnt))
call echo(build("cont: ",continue_cnt))

;*************************************************
; get convert_hx orders
;*************************************************
declare add_new = i2 with protect, noconstant(0)
 
call echo("get convert hx orders")
 
select into "nl:"
from
  encounter e,
  order_recon orr,
  order_recon_detail ord,
  orders o
 
plan e
  where e.person_id = person_id
  ;and e.encntr_id != encntr_id
 
join orr
  where orr.encntr_id = e.encntr_id
  and orr.recon_type_flag = 3 ;discharge
 
join ord
  where ord.order_recon_id = orr.order_recon_id
   and ord.recon_order_action_mean in ("CONVERT_HX")
 
join o
  where o.order_id = ord.order_nbr
  and o.orig_ord_as_flag in (2)  ;1,
  and o.order_status_cd not in (cancelled_cd, discontinued_cd, completed_cd, void_cd)
 
order by
  o.hna_order_mnemonic
 ,o.order_id
 
head report
 
  stat = alterlist(rpt_data->order_qual, cnt + 10)
 
head o.order_id
  loc_pos = locateval(num, start, size(rpt_data->order_qual,5), o.order_id, rpt_data->order_qual[num]->order_id)
  if (loc_pos = 0)
    add_new = 1
    continue_orders_ind = 1
    cnt = cnt + 1
    if(mod(cnt,10) = 1)
      stat = alterlist(rpt_data->order_qual, cnt + 10)
    endif
    start_cnt = start_cnt + 1
    rpt_data->order_qual[cnt].action = "new"
    rpt_data->order_qual[cnt].order_id = o.order_id
  else
    add_new = 0
   endif
foot report
  stat = alterlist(rpt_data->order_qual, cnt)
with nocounter 
call echo(build("new: ",start_cnt))
call echo(build("cont: ",continue_cnt))

;;************************************************
;; get new home med orders entered after disch recon
;;************************************************
 
call echo("get new orders")
select into "nl:"
from
 ; encounter e,
  orders o
 
plan o
  where o.encntr_id = encntr_id
  and o.orig_ord_as_flag = 2
  and o.orig_order_dt_tm >= cnvtdatetime(disch_recon_dt_tm)
  and o.order_status_cd in (inprocess_cd, ordered_cd)
 
order by
  o.hna_order_mnemonic
 ,o.order_id
 
head report
  stat = alterlist(rpt_data->order_qual, cnt + 10)
head o.order_id
 loc_pos = locateval(num, start, size(rpt_data->order_qual,5), o.order_id, rpt_data->order_qual[num]->order_id)
 if (loc_pos = 0)
  start_orders_ind = 1
  add_new = 1
  cnt = cnt + 1
  if(mod(cnt,10) = 1)
    stat = alterlist(rpt_data->order_qual, cnt + 10)
  endif
  start_cnt = start_cnt + 1
  rpt_data->order_qual[cnt].action = "new"
  rpt_data->order_qual[cnt].order_id = o.order_id
 else
  add_new = 0
 endif 
foot report
  stat = alterlist(rpt_data->order_qual, cnt)
with nocounter
call echo(build("new: ",start_cnt))
call echo(build("cont: ",continue_cnt))


;*************************************************
; get continued orders
;*************************************************
call echo("get continued orders")
 
 
select into "nl:"
from
  encounter e,
  order_recon orr,
  order_recon_detail ord,
  orders o
 
plan e
  where e.person_id = person_id
  ;and e.encntr_id != encntr_id
 
join orr
  where orr.encntr_id = e.encntr_id
  and orr.recon_type_flag = 3 ;discharge
 
join ord
  where ord.order_recon_id = orr.order_recon_id
  ;dmr015 - new action types
  ;se  and ord.recon_order_action_mean in ("RECON_RESUME", "RECON_CONTINUE", "CONVERT_HX")
   and ord.recon_order_action_mean in ("RESUME", "RECON_CONTINUE", "CONVERT_RX","MODIFY","RECON_RESUME")
   ;might need this "RENEW_RX"
 
join o
  where o.order_id = ord.order_nbr
  and o.orig_ord_as_flag in (1,2)
  and o.order_status_cd not in (cancelled_cd, discontinued_cd, completed_cd, void_cd)
 
order by
  o.hna_order_mnemonic
 ,o.order_id
 
head report
 
  stat = alterlist(rpt_data->order_qual, cnt + 10)
 
head o.order_id
  loc_pos = locateval(num, start, size(rpt_data->order_qual,5), o.order_id, rpt_data->order_qual[num]->order_id)
  if (loc_pos = 0)
    add_new = 1
    continue_orders_ind = 1
    cnt = cnt + 1
    if(mod(cnt,10) = 1)
      stat = alterlist(rpt_data->order_qual, cnt + 10)
    endif
    continue_cnt = continue_cnt + 1
    rpt_data->order_qual[cnt].action = "continued"
    rpt_data->order_qual[cnt].order_id = o.order_id
  else
    if (ord.recon_order_action_mean = "CONVERT_RX" and rpt_data->order_qual[loc_pos].action != "continued")
      rpt_data->order_qual[loc_pos].action = "continued"
      continue_cnt = continue_cnt + 1
	  start_cnt = start_cnt - 1
    else
      add_new = 0
    endif
  endif
foot report
  stat = alterlist(rpt_data->order_qual, cnt)
with nocounter

 call echo(build("new: ",start_cnt))
call echo(build("cont: ",continue_cnt))

;get the first admin reconciliation of the current encounter
call echo("get the first admin reconciliation of the current encounter")
 
select into "nl:"
from
  order_recon orr,
  encounter e
plan e
  where e.encntr_id = encntr_id
join orr
  where orr.encntr_id = e.encntr_id
  and orr.recon_type_flag = 1
order orr.performed_dt_tm desc
detail
  admin_recon_dt_tm = orr.performed_dt_tm
with nocounter
 
 
;get active orders entered prior the first admin reconciliation of the current encounter
call echo("get active orders entered prior the first admin reconciliation of the current encounter")
;call echorecord(rpt_data)
select into "nl:"
from
  orders o
 
plan o
  where o.person_id = person_id
  and o.encntr_id != encntr_id
  and o.orig_ord_as_flag in (1,2)
  and o.order_status_cd not in (cancelled_cd, discontinued_cd, completed_cd, void_cd)
  ;and o.orig_order_dt_tm < admin_recon_dt_tm
 
order by
  o.hna_order_mnemonic
 ,o.order_id
 
head report
  if(o.orig_order_dt_tm < admin_recon_dt_tm)
 
  stat = alterlist(rpt_data->order_qual, cnt + 10)
  endif
head o.order_id
  add_new = 0
  loc_pos = locateval(num, start, size(rpt_data->order_qual,5), o.order_id, rpt_data->order_qual[num]->order_id)
  if (loc_pos = 0)
    if(o.orig_order_dt_tm < admin_recon_dt_tm)
      add_new = 1
      continue_orders_ind = 1
      cnt = cnt + 1
      if(mod(cnt,10) = 1)
        stat = alterlist(rpt_data->order_qual, cnt + 10)
      endif
      continue_cnt = continue_cnt + 1
      rpt_data->order_qual[cnt].action = "continued"
      rpt_data->order_qual[cnt].order_id = o.order_id
    else
      add_new = 0
    endif
  endif
 
foot report
  stat = alterlist(rpt_data->order_qual, cnt)
with nocounter
 call echo(build("new: ",start_cnt))
call echo(build("cont: ",continue_cnt))

 
select into "nl:"
 
from
  (dummyt d2 with seq = value(size(rpt_data->order_qual,5))),
  orders o,
  order_catalog_synonym ocs,  ;001
  order_detail od,
  code_value cv
 
plan d2
 
join o
  where o.order_id = rpt_data->order_qual[d2.seq].order_id
 
join od
  where od.order_id = o.order_id
join cv
    where cv.code_value = outerjoin(od.oe_field_value)
join ocs
  where ocs.synonym_id = outerjoin(o.synonym_id)
  and   ocs.active_ind = outerjoin(1)
 
order by
  o.hna_order_mnemonic
 ,o.order_id
 ,od.oe_field_meaning
 ,od.action_sequence desc
 
;head report
;  start_orders_ind = 1
;  stat = alterlist(rpt_data->order_qual, cnt + 10)
head o.order_id
;  cnt = cnt + 1
;  if(mod(cnt,10) = 1)
;    stat = alterlist(rpt_data->order_qual, cnt + 10)
;  endif
;  start_cnt = start_cnt + 1
;  rpt_data->order_qual[cnt].action = "new"
;  rpt_data->order_qual[cnt].order_id = o.order_id
  rpt_data->order_qual[d2.seq].synonym_type = ocs.mnemonic_type_cd ;001
  rpt_data->order_qual[d2.seq].drug_name  = trim(cnvtupper(o.hna_order_mnemonic))
  rpt_data->order_qual[d2.seq].ordered_as = concat(" (", trim(cnvtupper(o.ordered_as_mnemonic)), ")")
  rpt_data->order_qual[d2.seq].order_status = uar_get_code_display(o.order_status_cd)	;mod008
;detail;dmr 121911
head od.oe_field_meaning;dmr 014
case (od.oe_field_meaning)
 
  of "FREQ":
    rpt_data->order_qual[d2.seq].FREQ = uar_get_code_description(od.oe_field_value)
  of "STRENGTHDOSE":
    rpt_data->order_qual[d2.seq].STRENGTHDOSE = od.oe_field_display_value
  of "VOLUMEDOSE":
    rpt_data->order_qual[d2.seq].VOLUMEDOSE = od.oe_field_display_value
  of "STRENGTHDOSEUNIT":
    rpt_data->order_qual[d2.seq].STRENGTHDOSEUNIT = od.oe_field_display_value
  of "VOLUMEDOSEUNIT":
    rpt_data->order_qual[d2.seq].VOLUMEDOSEUNIT = cv.description
  of "RXROUTE":
    rpt_data->order_qual[d2.seq].RXROUTE = cv.description
  of "INFUSEOVER":
    rpt_data->order_qual[d2.seq].INFUSEOVER = od.oe_field_display_value
  of "INFUSEOVERUNIT":
    rpt_data->order_qual[d2.seq].INFUSEOVERUNIT = od.oe_field_display_value
  of "DURATION":
    rpt_data->order_qual[d2.seq].DURATION = od.oe_field_display_value
  of "DURATIONUNIT":
    rpt_data->order_qual[d2.seq].DURATIONUNIT = od.oe_field_display_value
  of "RATE":
    rpt_data->order_qual[d2.seq].RATE = od.oe_field_display_value
  of "RATEUNIT":
    rpt_data->order_qual[d2.seq].RATEUNIT = od.oe_field_display_value
  of "INDICATION":
    rpt_data->order_qual[d2.seq].INDICATION = od.oe_field_display_value
  of "FREETXTDOSE":
    rpt_data->order_qual[d2.seq].FREETXTDOSE = od.oe_field_display_value
  of "SPECINX":
    rpt_data->order_qual[d2.seq].SPECINX = od.oe_field_display_value
  of "REQROUTINGTYPE":
    rpt_data->order_qual[d2.seq].REQROUTINGTYPE = od.oe_field_display_value
  of "DONTPRINTRXREASON":
    temp_string = od.oe_field_display_value
  of "SCH/PRN":
    rpt_data->order_qual[d2.seq].prn = concat(" PRN ", od.oe_field_display_value)
  of "PRNINSTRUCTIONS":
    rpt_data->order_qual[d2.seq].prn_instructions = concat(" As needed for ", od.oe_field_display_value)
    if (findstring("FOR", cnvtupper(rpt_data->order_qual[d2.seq].prn_instructions), 1,1) > 15)
      rpt_data->order_qual[d2.seq].prn_instructions =
      replace(rpt_data->order_qual[d2.seq].prn_instructions, "for ", "", 1)
    endif
    rpt_data->order_qual[d2.seq].prn_instructions =
    replace(rpt_data->order_qual[d2.seq].prn_instructions, "As needed as needed",
                                                        "As needed", 0)
  of "REQROUTINGTYPE":
    if (od.oe_field_display_value = "Do Not Route")
      rpt_data->order_qual[d2.seq].med_given_to_patient = "Don't print reason"
    elseif (od.oe_field_display_value = "Print Requisition")
      rpt_data->order_qual[d2.seq].med_given_to_patient = "Printed"
    endif
  of "FREETEXTORD":	;mod009
    rpt_data->order_qual[d2.seq].freetext_ord = trim(od.oe_field_display_value,3)
  of  "STOPTYPE":			;se
  	if (od.oe_field_value in (hard_stop_cd,physician_stop_cd))		;se
  	  rpt_data->order_qual[d2.seq].hard_stop_flag = 1  				;se
  	endif															;se
  endcase
foot o.order_id
  if (rpt_data->order_qual[d2.seq].med_given_to_patient = "Don't print reason")
    rpt_data->order_qual[d2.seq].med_given_to_patient = temp_string
  endif
 
  if(rpt_data->order_qual[d2.seq].VOLUMEDOSE != "")
  rpt_data->order_qual[d2.seq].detail_display = concat(
  rpt_data->order_qual[d2.seq].VOLUMEDOSE , " ",
  rpt_data->order_qual[d2.seq].VOLUMEDOSEUNIT , " ",
  rpt_data->order_qual[d2.seq].RXROUTE, " ",  ;005
  rpt_data->order_qual[d2.seq].FREQ, " "
  )
 
  elseif(rpt_data->order_qual[d2.seq].STRENGTHDOSE != "" and rpt_data->order_qual[d2.seq].VOLUMEDOSE != "")	;mod009
  rpt_data->order_qual[d2.seq].detail_display = concat(
  rpt_data->order_qual[d2.seq].STRENGTHDOSE , " ",
  rpt_data->order_qual[d2.seq].STRENGTHDOSEUNIT , " ",
  "= ",	;mod009
  rpt_data->order_qual[d2.seq].VOLUMEDOSE , " ",
  rpt_data->order_qual[d2.seq].VOLUMEDOSEUNIT, " ",
  rpt_data->order_qual[d2.seq].RXROUTE, " ",  ;005
  rpt_data->order_qual[d2.seq].FREQ, " "
  )
 
  elseif (rpt_data->order_qual[d2.seq].STRENGTHDOSE != "")
  rpt_data->order_qual[d2.seq].detail_display = concat(
  rpt_data->order_qual[d2.seq].STRENGTHDOSE , " ",
  rpt_data->order_qual[d2.seq].STRENGTHDOSEUNIT , " ",
 ;"= ",	;mod009
 ;rpt_data->order_qual[d2.seq].VOLUMEDOSE , " ",
 ;rpt_data->order_qual[d2.seq].VOLUMEDOSEUNIT , " ",
  rpt_data->order_qual[d2.seq].RXROUTE, " ",  ;005
  rpt_data->order_qual[d2.seq].FREQ, " "
  )
  else
;  rpt_data->order_qual[d2.seq].detail_display = " "
  rpt_data->order_qual[d2.seq].detail_display = concat(rpt_data->order_qual[d2.seq].RXROUTE, " ", ;005
  rpt_data->order_qual[d2.seq].FREQ)
  endif
 
  if  ((rpt_data->order_qual[d2.seq].synonym_type in(brandname_cd,c_cd,primary_cd)) ;001
                        and (o.orig_ord_as_flag = 1))
        if(rpt_data->order_qual[d2.seq].STRENGTHDOSE != "" and rpt_data->order_qual[d2.seq].VOLUMEDOSE != "")	;mod009
                rpt_data->order_qual[d2.seq].detail_display = concat(  ;001
                rpt_data->order_qual[d2.seq].STRENGTHDOSE , " ",       ;001
                rpt_data->order_qual[d2.seq].STRENGTHDOSEUNIT , " ",   ;001
                "= ",	;mod009                                     ;001
                rpt_data->order_qual[d2.seq].VOLUMEDOSE , " ",         ;001
                rpt_data->order_qual[d2.seq].VOLUMEDOSEUNIT ,          ;001
                "; ",                                               ;001
                rpt_data->order_qual[d2.seq].RXROUTE, "; "             ;001
                ,rpt_data->order_qual[d2.seq].FREQ ;, "; "  	;mod008 ;005 ;001
                );001
        else
                rpt_data->order_qual[d2.seq].detail_display = concat(  ;001
                rpt_data->order_qual[d2.seq].STRENGTHDOSE , " ",       ;001
                rpt_data->order_qual[d2.seq].STRENGTHDOSEUNIT , " ",   ;001
                ;"= ",	;mod009                                     ;001
                rpt_data->order_qual[d2.seq].VOLUMEDOSE , " ",         ;001
                rpt_data->order_qual[d2.seq].VOLUMEDOSEUNIT ,          ;001
                "; ",                                               ;001
                rpt_data->order_qual[d2.seq].RXROUTE, "; "             ;001
                ,rpt_data->order_qual[d2.seq].FREQ ;, "; "  	;mod008 ;005 ;001
                );001
        endif
 
  endif ;001
 
        if (rpt_data->order_qual[d2.seq].freetxtdose != "")              ;006
                rpt_data->order_qual[d2.seq].detail_display = concat(    ;006
                rpt_data->order_qual[d2.seq].freetxtdose , " ",          ;006
                rpt_data->order_qual[d2.seq].RXROUTE, " "                ;006
                ,rpt_data->order_qual[d2.seq].FREQ, " "    ;005          ;006
                )                                                     ;006
        endif
 
 
  if (rpt_data->order_qual[d2.seq].INDICATION > "")
    rpt_data->order_qual[d2.seq].INDICATION = concat("; Indications:  ",
    rpt_data->order_qual[d2.seq].INDICATION);, "; ") ;mod008
  endif
  if (rpt_data->order_qual[d2.seq].SPECINX > "");dmr013 change label
    rpt_data->order_qual[d2.seq].SPECINX = concat("; Indications/Special Instructions:  ",
    rpt_data->order_qual[d2.seq].SPECINX)
  endif
 
  if(o.oe_format_id in (oe_non_form, oe_freetext) and
     rpt_data->order_qual[d2.seq].freetext_ord > "")	;mod009
     rpt_data->order_qual[d2.seq].ordered_as =
               concat(" (", trim(cnvtupper(rpt_data->order_qual[d2.seq].freetext_ord)), ")")
  endif
;foot report
;  stat = alterlist(rpt_data->order_qual, cnt)
with nocounter
 
 
 
 
 
 
 
declare hold_drug=vc
declare hold_dose=vc
 
 
/*eliminate stopped meds with new or continued order */
select into "nl:"
 
from (dummyt d2 with seq = value(size(rpt_data->order_qual,5)))
 
plan d2
 
;order by rpt_data->order_qual[d2.seq].ordered_as, rpt_data->order_qual[d2.seq].action
 order by rpt_data->order_qual[d2.seq].action, rpt_data->order_qual[d2.seq].drug_name
head report
cnt2=0
 
detail
 
if (rpt_data->order_qual[d2.seq].action="stop")
call echo("in stop")
 if (rpt_data->order_qual[d2.seq].ordered_as != hold_drug)
   cnt2 = cnt2 + 1
   if(mod(cnt2,10) = 1)
     stat = alterlist(rpt_data2->order_qual, cnt2 + 10)
   endif
 
   rpt_data2->order_qual[cnt2].drug_name=rpt_data->order_qual[d2.seq].drug_name
   rpt_data2->order_qual[cnt2].action=rpt_data->order_qual[d2.seq].action
   rpt_data2->order_qual[cnt2].ordered_as=rpt_data->order_qual[d2.seq].ordered_as
   rpt_data2->order_qual[cnt2].detail_display=rpt_data->order_qual[d2.seq].detail_display
   rpt_data2->order_qual[cnt2].order_id=rpt_data->order_qual[d2.seq].order_id
  rpt_data2->order_qual[cnt2].prn=rpt_data->order_qual[d2.seq].prn
 if (findstring("es", rpt_data->order_qual[d2.seq].prn))
  if (rpt_data->order_qual[d2.seq].prn_instructions>" ")
   rpt_data2->order_qual[cnt2].prn_instructions=rpt_data->order_qual[d2.seq].prn_instructions
  else
   rpt_data2->order_qual[cnt2].prn_instructions = "As Needed"
  endif
 endif
  ;rpt_data2->order_qual[cnt2].prn_instructions=rpt_data->order_qual[d2.seq].prn_instructions
   rpt_data2->order_qual[cnt2].indication=rpt_data->order_qual[d2.seq].indication
   rpt_data2->order_qual[cnt2].specinx=rpt_data->order_qual[d2.seq].specinx
   rpt_data2->order_qual[cnt2].DURATION=rpt_data->order_qual[d2.seq].DURATION;dmr
   rpt_data2->order_qual[cnt2].DURATIONUNIT=rpt_data->order_qual[d2.seq].DURATIONUNIT;dmr
 	rpt_data2->order_qual[cnt2].hard_stop_flag = rpt_data->order_qual[d2.seq].hard_stop_flag	;se
   hold_drug=rpt_data->order_qual[d2.seq].ordered_as
 endif
else
 cnt2 = cnt2 + 1
  if(mod(cnt2,10) = 1)
    stat = alterlist(rpt_data2->order_qual, cnt2 + 10)
  endif
 
  rpt_data2->order_qual[cnt2].drug_name=rpt_data->order_qual[d2.seq].drug_name
  rpt_data2->order_qual[cnt2].action=rpt_data->order_qual[d2.seq].action
  rpt_data2->order_qual[cnt2].ordered_as=rpt_data->order_qual[d2.seq].ordered_as
  rpt_data2->order_qual[cnt2].detail_display=rpt_data->order_qual[d2.seq].detail_display
   rpt_data2->order_qual[cnt2].order_id=rpt_data->order_qual[d2.seq].order_id
  rpt_data2->order_qual[cnt2].prn=rpt_data->order_qual[d2.seq].prn
     rpt_data2->order_qual[cnt2].DURATION=rpt_data->order_qual[d2.seq].DURATION;dmr
   rpt_data2->order_qual[cnt2].DURATIONUNIT=rpt_data->order_qual[d2.seq].DURATIONUNIT;dmr
 
 if (findstring("es", rpt_data->order_qual[d2.seq].prn))
  if (rpt_data->order_qual[d2.seq].prn_instructions>" ")
   rpt_data2->order_qual[cnt2].prn_instructions=rpt_data->order_qual[d2.seq].prn_instructions
  else
   rpt_data2->order_qual[cnt2].prn_instructions = "As Needed"
  endif
 endif
 ;rpt_data2->order_qual[cnt2].prn_instructions=rpt_data->order_qual[d2.seq].prn_instructions
   rpt_data2->order_qual[cnt2].indication=rpt_data->order_qual[d2.seq].indication
   rpt_data2->order_qual[cnt2].specinx=rpt_data->order_qual[d2.seq].specinx
 	rpt_data2->order_qual[cnt2].hard_stop_flag = rpt_data->order_qual[d2.seq].hard_stop_flag		;se
  hold_drug=rpt_data->order_qual[d2.seq].ordered_as
endif
 
with nocounter
 
 
call echo("create reply")
;call echorecord(rpt_data)
;create the reply
 
declare dashed_line = vc with protect, constant(fillstring(60, "-"))
declare star_line = vc with protect, constant(fillstring(60, "*"))
 
 
set reply->text = concat(rhead,RH2bu)
set reply->text = concat(reply->text, RH2r, reol, "This is your current active medication list based on information provided ")
set reply->text = concat(reply->text, " during your hospitalization. If you have any questions or need additional ")
set reply->text = concat(reply->Text, " information about your medications, please contact your primary care provider.")
 
if (continue_orders_ind = 1)
set reply->text = concat(reply->text,reol, reol,RH2bu, "CONTINUE ", RH2r, "taking the following ",
            trim(cnvtstring(continue_cnt)), " medication(s):", reol)
  for (x = 1 to size(rpt_data2->order_qual,5))
    if (rpt_data2->order_qual[x].action = "continued")
      set continue_cnt = continue_cnt - 1
    if (rpt_data2->order_qual[x].DURATION > " " and rpt_data2->order_qual[x].hard_stop_flag = 1)
      if (findstring("es", rpt_data2->order_qual[x].prn))
      set reply->text = concat(reply->text, reol, RH2b, rpt_data2->order_qual[x]->drug_name,
                  RH2r, rpt_data2->order_qual[x]->ordered_as,
                  " - ", rpt_data2->order_qual[x]->detail_display,
                  "  ", rpt_data2->order_qual[x].prn_instructions, "  Duration: ",
                  rpt_data2->order_qual[x].DURATION," ",
                  rpt_data2->order_qual[x].DURATIONUNIT,
                  rpt_data2->order_qual[x].INDICATION,
                  rpt_data2->order_qual[x].SPECINX, reol)
      else
      set reply->text = concat(reply->text, reol, RH2b, rpt_data2->order_qual[x]->drug_name,
                  RH2r, rpt_data2->order_qual[x]->ordered_as,
                  " - ", rpt_data2->order_qual[x]->detail_display,"  Duration: ",
                  rpt_data2->order_qual[x].DURATION," ",
                  rpt_data2->order_qual[x].DURATIONUNIT,
                  rpt_data2->order_qual[x].INDICATION,
                  rpt_data2->order_qual[x].SPECINX,
                  reol)
      endif
    else
     if (findstring("es", rpt_data2->order_qual[x].prn))
      set reply->text = concat(reply->text, reol, RH2b, rpt_data2->order_qual[x]->drug_name,
                  RH2r, rpt_data2->order_qual[x]->ordered_as,
                  " - ", rpt_data2->order_qual[x]->detail_display,
                  "  ", rpt_data2->order_qual[x].prn_instructions,
                  rpt_data2->order_qual[x].INDICATION,
                  rpt_data2->order_qual[x].SPECINX, reol)
      else
      set reply->text = concat(reply->text, reol, RH2b, rpt_data2->order_qual[x]->drug_name,
                  RH2r, rpt_data2->order_qual[x]->ordered_as,
                  " - ", rpt_data2->order_qual[x]->detail_display,
                  rpt_data2->order_qual[x].INDICATION,
                  rpt_data2->order_qual[x].SPECINX,
                  reol)
      endif
    endif
    set reply->text = concat(reply->text, RH2r, "Take your next dose:" , reol)
    ;if (continue_cnt > 0)
    set reply->text = concat(reply->text, dashed_line)
    ;endif
    endif ;
  endfor
  ;set reply->text = concat(reply->text, reol, star_line, reol)
endif
 
if (start_orders_ind = 1)
set reply->text =
  concat(reply->text,reol, reol, RH2bu, "NEW ", RH2r, "Start taking the following ",
                  trim(cnvtstring(start_cnt)), " medication(s):", reol)
  for (x = 1 to size(rpt_data2->order_qual,5))
    if (rpt_data2->order_qual[x].action = "new")
      set start_cnt = start_cnt - 1
     if (rpt_data2->order_qual[x].DURATION > " " and rpt_data2->order_qual[x].hard_stop_flag = 1)
      if (findstring("es", rpt_data2->order_qual[x].prn))
      set reply->text = concat(reply->text, reol, RH2b, rpt_data2->order_qual[x]->drug_name,
                  RH2r, rpt_data2->order_qual[x]->ordered_as,
                  " - ", rpt_data2->order_qual[x]->detail_display,
                  "  ", rpt_data2->order_qual[x].prn_instructions, "  Duration: ",
                  rpt_data2->order_qual[x].DURATION," ",
                  rpt_data2->order_qual[x].DURATIONUNIT,
                  rpt_data2->order_qual[x].INDICATION,
                  rpt_data2->order_qual[x].SPECINX, reol)
      else
      set reply->text = concat(reply->text, reol, RH2b, rpt_data2->order_qual[x]->drug_name,
                  RH2r, rpt_data2->order_qual[x]->ordered_as,
                  " - ", rpt_data2->order_qual[x]->detail_display,"  Duration: ",
                  rpt_data2->order_qual[x].DURATION," ",
                  rpt_data2->order_qual[x].DURATIONUNIT,
                  rpt_data2->order_qual[x].INDICATION,
                  rpt_data2->order_qual[x].SPECINX,
                  reol)
      endif
    else
     if (findstring("es", rpt_data2->order_qual[x].prn))
      set reply->text = concat(reply->text, reol, RH2b, rpt_data2->order_qual[x]->drug_name,
                  RH2r, rpt_data2->order_qual[x]->ordered_as,
                  " - ", rpt_data2->order_qual[x]->detail_display,
                  "  ", rpt_data2->order_qual[x].prn_instructions,
                  rpt_data2->order_qual[x].INDICATION,
                  rpt_data2->order_qual[x].SPECINX, reol)
      else
      set reply->text = concat(reply->text, reol, RH2b, rpt_data2->order_qual[x]->drug_name,
                  RH2r, rpt_data2->order_qual[x]->ordered_as,
                  " - ", rpt_data2->order_qual[x]->detail_display,
                  rpt_data2->order_qual[x].INDICATION,
                  rpt_data2->order_qual[x].SPECINX,
                  reol)
      endif
    endif
    if (rpt_data2->order_qual[x].med_given_to_patient > "")
      set reply->text = concat(reply->text, rpt_data2->order_qual[x].med_given_to_patient , reol)
    endif
    set reply->text = concat(reply->text, RH2r, "Take your next dose:" , reol)
    ;if (start_cnt > 0)
    set reply->text = concat(reply->text, dashed_line)
    ;endif
    endif ;
  endfor
  ;set reply->text = concat(reply->text, reol, star_line, reol)
endif
 
if (stop_orders_ind = 1)
set reply->text = concat(reply->text, reol,reol,RH2bu,"STOP/CHANGED PRESCRIPTIONS ", RH2r, "Stop taking the following ",
            trim(cnvtstring(stop_cnt)), " medication(s):", reol)
  for (x = 1 to size(rpt_data2->order_qual,5))
    if (rpt_data2->order_qual[x].action = "stop")
      set stop_cnt = stop_cnt - 1
      if (rpt_data2->order_qual[x].DURATION > " ")
      if (findstring("es", rpt_data2->order_qual[x].prn))
      set reply->text = concat(reply->text, reol, RH2b, rpt_data2->order_qual[x]->drug_name,
                  RH2r, rpt_data2->order_qual[x]->ordered_as,
                  " - ", rpt_data2->order_qual[x]->detail_display,
                  "  ", rpt_data2->order_qual[x].prn_instructions, "  Duration: ",
                  rpt_data2->order_qual[x].DURATION," ",
                  rpt_data2->order_qual[x].DURATIONUNIT,
                  rpt_data2->order_qual[x].INDICATION,
                  rpt_data2->order_qual[x].SPECINX, reol)
      else
      set reply->text = concat(reply->text, reol, RH2b, rpt_data2->order_qual[x]->drug_name,
                  RH2r, rpt_data2->order_qual[x]->ordered_as,
                  " - ", rpt_data2->order_qual[x]->detail_display,"  Duration: ",
                  rpt_data2->order_qual[x].DURATION," ",
                  rpt_data2->order_qual[x].DURATIONUNIT,
                  rpt_data2->order_qual[x].INDICATION,
                  rpt_data2->order_qual[x].SPECINX,
                  reol)
      endif
    else
     if (findstring("es", rpt_data2->order_qual[x].prn))
      set reply->text = concat(reply->text, reol, RH2b, rpt_data2->order_qual[x]->drug_name,
                  RH2r, rpt_data2->order_qual[x]->ordered_as,
                  " - ", rpt_data2->order_qual[x]->detail_display,
                  "  ", rpt_data2->order_qual[x].prn_instructions,
                  rpt_data2->order_qual[x].INDICATION,
                  rpt_data2->order_qual[x].SPECINX, reol)
      else
      set reply->text = concat(reply->text, reol, RH2b, rpt_data2->order_qual[x]->drug_name,
                  RH2r, rpt_data2->order_qual[x]->ordered_as,
                  " - ", rpt_data2->order_qual[x]->detail_display,
                  rpt_data2->order_qual[x].INDICATION,
                  rpt_data2->order_qual[x].SPECINX,
                  reol)
      endif
     endif
    ;if( stop_cnt > 0)
    set reply->text = concat(reply->text, dashed_line)
    ;endif
    endif ;stop
  endfor
  ;set reply->text = concat(reply->text, reol, star_line, reol)
endif
 
set time_string =  concat(format(curdate, "mm-dd-yy;;d")," ",format(curtime, "HH:MM;;mr"))
set reply->text =
concat(reply->text, reol, "Medication list for discharge reconciliation updated on ", time_string, reol)
 
set reply->text =
concat(reply->text, reol, rh2b, prsnl_sig, reol)
 
 
set reply->text = concat(reply->text,rtfeof)
 
#exit_script
;call echorecord(rpt_data2)
free set rpt_data
free set ord_rec
end go
 
;execute mayo_az_home_meds2 go
 
