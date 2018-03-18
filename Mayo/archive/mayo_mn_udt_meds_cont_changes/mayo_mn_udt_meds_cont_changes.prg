/*****************************************************************************
 
        Source file name:       mayo_mn_udt_meds_cont_changes.PRG
        Object name:            mayo_mn_udt_meds_cont_changes
        Request #:
 
 
        Program purpose:        token for home meds review in depart process
 
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
;000 05/10/2012 Akcia                 Initial Release - copy of pieces of mayo_az_home_meds2                 *
 
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************/
drop program mayo_mn_udt_meds_cont_changes:dba go
create program mayo_mn_udt_meds_cont_changes:dba
 
%i cclsource:mayo_mn_html.inc
declare sText = vc
 
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
    2 home_inpat = c1
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
 
; get the reg_dt_tm of the current encounter
call echo("get the reg_dt_tm of the current encounter")
 
select into "nl:"
from
encounter e
where e.encntr_id =  request->encntr_id
detail
person_id = e.person_id
encntr_id = e.encntr_id
reg_dt_tm = e.reg_dt_tm
with nocounter
 
 
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
  and orr.performed_dt_tm != null
 
order orr.performed_dt_tm desc
detail
  disch_recon_dt_tm = orr.performed_dt_tm
with nocounter
 
 
if (disch_recon_dt_tm != NULL)
 
select
o.order_id,
o2.order_id,
od.oe_field_display_value,
od2.oe_field_display_value
from
  orders o,
  orders o2,
  order_detail od,
  order_detail od2
 
plan o
  where o.encntr_id = 78679460
  and o.orig_ord_as_flag in (1,2)
  and o.active_ind = 1
  and o.catalog_type_cd = pharmacy_cd
  and o.order_status_cd in (2550, 2548)
 
join o2
where o2.person_id = o.person_id
  and o2.catalog_cd = o.catalog_cd
  and o2.order_id != o.order_id
  ;and o2.updt_dt_tm > reg_dt_tm
 
join od
where od.order_id = o.order_id
  and od.oe_field_meaning_id in (2056,2057,2058,2059,2063,2050,2011,1103,2037,142,2101)
 
join od2
where od.order_id = o2.order_id
  and od.oe_field_meaning_id = od.oe_field_meaning_id
 
 
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
  call echo(o.hna_order_mnemonic)
 else
  add_new = 0
 endif
foot report
  stat = alterlist(rpt_data->order_qual, cnt)
with nocounter
 
call echo(build("new: ",start_cnt))
call echo(build("cont: ",continue_cnt))
 
if (size(rpt_data->order_qual,5) > 0)
 
if (size(rpt_data->order_qual,5) > 0)
 
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
endif
 
call echo("create reply")
;call echorecord(rpt_data)
;create the reply
 
declare dashed_line = vc with protect, constant(fillstring(60, "-"))
declare star_line = vc with protect, constant(fillstring(60, "*"))
 
 
;set reply->text = concat(rhead,RH2bu)
;set reply->text = concat(reply->text, RH2r, reol, "This is your current active medication list based on information provided ")
;set reply->text = concat(reply->text, " during your hospitalization. If you have any questions or need additional ")
;set reply->text = concat(reply->Text, " information about your medications, please contact your primary care provider.")
 
set sText = csBegin
set sText = concat(sText,"<span style='font-size:10.0pt;font-family:Tahoma,sans-serif'><B><U>CONTINUE</U>",
					"</B> taking the following ",trim(cnvtstring(continue_cnt),3)," medication(s):<BR><BR>")
 
 
;if (start_orders_ind = 1)
;set reply->text =
;  concat(reply->text,reol, reol, RH2bu, "NEW ", RH2r, "Start taking the following ",
;                  trim(cnvtstring(start_cnt)), " medication(s):", reol)
  for (x = 1 to size(rpt_data2->order_qual,5))
    if (rpt_data2->order_qual[x].action = "continued")
      set start_cnt = start_cnt - 1
     if (rpt_data2->order_qual[x].DURATION > " " and rpt_data2->order_qual[x].hard_stop_flag = 1)
      if (findstring("es", rpt_data2->order_qual[x].prn))
      set sText = concat(sText, "<B>",rpt_data2->order_qual[x]->drug_name,"</B>",
                  rpt_data2->order_qual[x]->ordered_as,
                  " - ", rpt_data2->order_qual[x]->detail_display,
                  "  ", rpt_data2->order_qual[x].prn_instructions, "  Duration: ",
                  rpt_data2->order_qual[x].DURATION," ",
                  rpt_data2->order_qual[x].DURATIONUNIT,
                  rpt_data2->order_qual[x].INDICATION,
                  rpt_data2->order_qual[x].SPECINX,"<BR>")
      else
      set sText = concat(sText, "<B>",rpt_data2->order_qual[x]->drug_name,
                  "</B>", rpt_data2->order_qual[x]->ordered_as,
                  " - ", rpt_data2->order_qual[x]->detail_display,"  Duration: ",
                  rpt_data2->order_qual[x].DURATION," ",
                  rpt_data2->order_qual[x].DURATIONUNIT,
                  rpt_data2->order_qual[x].INDICATION,
                  rpt_data2->order_qual[x].SPECINX,"<BR>")
      endif
    else
     if (findstring("es", rpt_data2->order_qual[x].prn))
      set sText = concat(sText, "<B>", rpt_data2->order_qual[x]->drug_name,
                  "</B>", rpt_data2->order_qual[x]->ordered_as,
                  " - ", rpt_data2->order_qual[x]->detail_display,
                  "  ", rpt_data2->order_qual[x].prn_instructions,
                  rpt_data2->order_qual[x].INDICATION,
                  rpt_data2->order_qual[x].SPECINX,"<BR>")
      else
      set sText = concat(sText, "<B>", rpt_data2->order_qual[x]->drug_name,
                  "</B>", rpt_data2->order_qual[x]->ordered_as,
                  " - ", rpt_data2->order_qual[x]->detail_display,
                  rpt_data2->order_qual[x].INDICATION,
                  rpt_data2->order_qual[x].SPECINX,"<BR>")
      endif
    endif
     set sText = concat(sText, "Take your next dose:" , "<BR>")
    ;if (start_cnt > 0)
    set sText = concat(sText, dashed_line, "<BR>")
    ;endif
    endif ;
  endfor
  ;set reply->text = concat(reply->text, reol, star_line, reol)
;endif
 
 
 
;set time_string =  concat(format(curdate, "mm-dd-yy;;d")," ",format(curtime, "HH:MM;;mr"))
;set sText = concat(sText, "Medication list for discharge reconciliation updated on ", time_string, "<BR>")
;
;set sText = concat(sText, prsnl_sig, "<BR>")
else
  ;set reply->text = concat(rhead,RH2bu)
  set sText = concat(sText, "Discharge Med Recon not done, can not display data.", "<BR>")
endif
 
set sText = concat(sText,"</span>",csEnd)
 
call echo(sText)
set reply->text = sText
 
set reply->format = 1 ; this means HTML so the caller will know how to handle
 
 
#exit_script
;call echorecord(rpt_data2)
free set rpt_data
;free set ord_rec
end go
 
 
 
