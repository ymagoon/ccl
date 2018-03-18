/*****************************************************************************
 
        Source file name:       mayo_mn_fn_udt_medication.PRG
        Object name:            mayo_mn_fn_udt_medication
        Request #:
 
        Product:                SC custom discern programming
        Product Team:           FirstNet
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:
 
        Tables read:			Orders, order_detail, oe_format_fields,code_value
        Tables updated:         None
        Executing from:			PowerChart
 
        Special Notes:
 
******************************************************************************/
 
;****************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *                                                                      *
;    *Mod    Date     	Engineer              Comment                       *
;    *---   ------------ -------------------- ------------------------------*
;     000   11/03/08 	 NT5990               Initial Release SR1-2094297910*
;                                             start of script was based off *
;                                             of FNGetHomeMedsHxTrans.prg   *
;     001 	02/05/10	 Akcia				  reformatting of data			*
;     002   09/28/11	 Akcia				  Add duration and change <,> to html
;												so it displays properly
;     003   11/01/11     Akcia - SE			  Make efficiency changes		*
;	  004	09/19/12	 Akcia - SE			  Add check for "not taking" and not as prescribed and add
;											  sentence to bottom of report
;	  005	10/02/12	 Akcia - PEL		  Fixed words running together in message
;     006   03/26/13	 Akcia - SE 		  complete rewrite
;     007   11/25/13	 Akcia - SE 		  add subselect to order_compliance to not pull back so many rows
;     008   12/03/13	 Akcia - SE			  fixes for:
;								 			- outerjoin on order details for orders without order details
;											- stopped orders will look back to midnight
;											- orders on pre reg ordered before reg_dt_tm now appear
;											- multiples not trigger change properly
;											- wrong pharmacy address displaying
;											- order comment changes to not check on new or stop
;											- add pending complete as order status not to pull
;	 009    01/08/13     Akcia-se			fix html syntax problems.
;    110    02/20/14     Akcia-SE           fix to not make server call as many times
;    112    05/19/14     Akcia-SE			efficiency changes suggested by cerner
;    113	05/20/14     Akcia-SE			remove code which causes subscript overload error
;****************************************************************************
drop program   mayo_mn_fn_udt_medication : dba  go
create program  mayo_mn_fn_udt_medication : dba
 
call echo(format(sysdate,"mm/dd/yy  hh:mm:ss;;d"))
 
record reply(
 1 text = vc
 1 format = i4 )
 
declare sText = vc
declare disp = vc
declare csBegin = vc with constant("<html><body>")
declare csBold = vc with constant("<B>")
declare csBoldEnd = vc with constant("</B>")
declare csSpan = vc with constant("<span style='font-size:12.0pt;font-family:arial'>")
declare csSpanEnd = vc with constant("</span>")
declare csParagraph = vc with constant("<P class=MsoNormal style='TEXT-ALIGN: left' align=left>")
declare csParagraphEnd = vc with constant("</P>")
declare csEnd = vc with constant("</body></html>")
declare csTable = vc with constant("<TABLE border ='1'")
declare csTableEnd = vc with constant("</TABLE>")
declare csTableDef1 = vc with constant("<TD valign=top><span style='font-size:8.0pt;font-family:Tahoma,sans-serif'>")
declare csTableDef = vc with constant("<span style='font-size:8.0pt;font-family:Tahoma,sans-serif'>")
declare csTableDefEnd = vc with constant("</TD>")
declare sSpanOpen = vc with CONSTANT("<tr><td width=150 valign=top><span style=font-family:arial font-size:12.0pt>")
declare sSpanClose = vc with CONSTANT("</span></td></tr>")
declare sSpanHOpen = vc with CONSTANT("<td width=150 valign=top><span style=font-family:arial font-size:12.0pt>")
declare sSpanHClose = vc with CONSTANT("</span></td>")
declare sStyleCenter = vc
with constant(" style='text-align: center;font-size:8.0pt;font-family:Tahoma,sans-serif;font-weight:normal;'>")
 
 
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
    2 dontprintrxreason = vc
    2 freetext_ord = vc
    2 detail_display = vc
    2 comment = vc
    2 prn = vc
    2 prn_instructions = vc
    2 hard_stop_flag = i2
    2 home_inpat = c1
    2 last_dose = vc
    2 action_meaning = vc
    2 pharmacy = vc
    2 pharm_street = vc
    2 pharm_city_state_zip = vc
    2 pharm_phone = vc
    2 prnreason = vc
    2 new_prescription = vc
    2 iv_type = c1
    2 recon_note = vc
    2 multiple = c1
    2 stop_type_cd = f8
  1 pharmacy[*]						;110
    2 pharm_id = vc					;110
    2 orders[*]						;110
      3 seq = i2					;110
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
    2 dontprintrxreason = vc
    2 freetext_ord = vc
    2 detail_display = vc
    2 comment = vc
    2 prn = vc
    2 prn_instructions = vc
    2 hard_stop_flag = i2
    2 last_dose = vc
    2 action_meaning = vc
    2 pharmacy = vc
    2 pharm_street = vc
    2 pharm_city_state_zip = vc
    2 pharm_phone = vc
    2 new_prescription = vc
    2 iv_type = c1
    2 recon_note = vc
    2 multiple = c1
    2 stop_type_cd = f8
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
declare pending_comp_cd = f8 with protect, constant(uar_get_code_by("MEANING", 6004, "PENDING"))	;008
 
declare maintenance_cd = f8 with protect, constant(uar_get_code_by("MEANING", 4009, "SOFT"))
declare void_cd = f8 with protect, constant(uar_get_code_by("MEANING", 6004, "DELETED"))
declare admin_recon_dt_tm = dq8
declare disch_recon_dt_tm = dq8
declare reg_dt_tm = dq8
declare discharge_dt_tm = dq8
declare med_hist_comp_dt = dq8
declare missing_order = vc with protect, noconstant("")
declare missing_fin = vc with protect, noconstant("")
declare hard_stop_cd = f8 with public, constant(uar_get_code_by("MEANING",4009,"DRSTOP"))
declare physician_stop_cd = f8 with public, constant(uar_get_code_by("MEANING",4009,"HARD"))
 
declare brandname_cd = f8 with protect, constant(uar_get_code_by("MEANING",6011,"BRANDNAME"))
declare c_cd = f8 with protect, constant(uar_get_code_by("MEANING",6011,"DISPDRUG"))
declare y_cd = f8 with protect, constant(uar_get_code_by("MEANING",6011,"GENERICPROD"))
declare z_cd = f8 with protect, constant(uar_get_code_by("MEANING",6011,"TRADEPROD"))
declare m_cd = f8 with protect, constant(uar_get_code_by("MEANING",6011,"GENERICTOP"))
declare n_cd = f8 with protect, constant(uar_get_code_by("MEANING",6011,"TRADETOP"))
declare primary_cd = f8 with protect, constant(uar_get_code_by("MEANING",6011,"PRIMARY"))
declare non_form_med = f8 with protect, constant(uar_get_code_by("DISPLAYKEY",200,"MISCPRESCRIPTION"))
 
declare person_id = f8
declare encntr_id = f8
DECLARE NUM = I4 WITH NOCONSTANT(0),PUBLIC
declare num1 = i4 with protect, noconstant(0)
DECLARE START = I4 WITH NOCONSTANT(1),PUBLIC
declare start1 = i4 with protect, noconstant(0)
declare loc_pos = i4 with protect, noconstant(0)
declare ord_pos = i4 with protect, noconstant(0)
declare pharmacy_cd = f8 with protect, constant(uar_get_code_by("MEANING", 6000, "PHARMACY"))
declare current_encntr = c1 with protect, noconstant("Y")
declare oe_non_form = f8
declare oe_freetext	= f8
declare not_taking_flag = c1
set not_taking_flag = "N"
declare not_taking_cd = f8 with public, constant(uar_get_code_by("MEANING",30254,"NOTTAKING"))
declare not_as_prescribed_cd = f8 with public, constant(uar_get_code_by("MEANING",30254,"TAKINGNOTRX"))
declare recon_status = f8
declare pend_complete_cd = f8 with public, constant(uar_get_code_by("MEANING",4002695,"PENDCOMPLETE"))	;se
declare show_data = vc
declare reg_dt = i4
set show_data = "Y"
set disch_recon_dt_tm = NULL
 
declare prsnl_sig=vc
	declare hApp = i4 with private, noconstant(0)
	declare hTask = i4 with private, noconstant(0)
	declare hStep = i4 with private, noconstant(0)
	declare pharmacyid = c36
	declare pharm_street = vc
	declare pharm_city = vc
	declare pharm_state = vc
	declare pharm_zip = vc
	declare pharm_phone = vc
 
subroutine GetPharmacyAddress(PharmId)
	set hApp = 0
	set hTask = 0
	set hStep = 0
 
	call uar_CrmBeginApp(600005, hApp)
	call uar_CrmBeginTask(hApp, 500195, hTask)
	call uar_CrmBeginReq(hTask, "", 3202501, hStep)
 
	set hRequest = uar_CrmGetRequest(hStep)
	call uar_SrvSetShort(hRequest, "active_status_flag", 1)
	call uar_SrvSetShort(hRequest, "transmit_capability_flag", 1)
	call echo(pharmid)
	set pharmacyid = pharmid
	set hids = uar_SrvAddItem(hRequest, "ids")
	call uar_SrvSetString(hids, "id", value(pharmacyid))
 
	set performDtTm = cnvtdatetime(curdate, curtime3)
	call uar_CrmPerform(hStep)
 
	set hReply = uar_CrmGetReply(hStep)
 
	call echo(build("pharmacies count: ", uar_SrvGetItemCount(hReply, "pharmacies")))
	set hpharmacies = uar_SrvGetItem(hReply, "pharmacies", 0)
	call echo(build("id: ", uar_SrvGetStringPtr(hpharmacies, "id")))
 
	;call uar_SrvGetDate(hpharmacies, "version_dt_tm", daterec->datetime)
	call echo(build("pharmacy_name: ", uar_SrvGetStringPtr(hpharmacies, "pharmacy_name")))
	call echo(build("pharmacy_number: ", uar_SrvGetStringPtr(hpharmacies, "pharmacy_number")))
 
	set hpharmacy_contributions = uar_SrvGetItem(hpharmacies, "pharmacy_contributions", 0)
	set haddresses = uar_SrvGetItem(hpharmacy_contributions, "addresses", 0)
 
	call echo(build("street_address_lines count: ", uar_SrvGetItemCount(haddresses, "street_address_lines")))
	set hstreet_address_lines = uar_SrvGetItem(haddresses, "street_address_lines", 0)
	call echo(build("street_address_line: ", uar_SrvGetStringPtr(hstreet_address_lines, "street_address_line")))
	call echo(build("city: ", uar_SrvGetStringPtr(haddresses, "city")))
	call echo(build("state: ", uar_SrvGetStringPtr(haddresses, "state")))
	call echo(build("postal_code: ", uar_SrvGetStringPtr(haddresses, "postal_code")))
	call echo(build("country: ", uar_SrvGetStringPtr(haddresses, "country")))
 
	set pharm_street = uar_SrvGetStringPtr(hstreet_address_lines, "street_address_line")
	set pharm_city = uar_SrvGetStringPtr(haddresses, "city")
	set pharm_state = uar_SrvGetStringPtr(haddresses, "state")
	set pharm_zip = uar_SrvGetStringPtr(haddresses, "postal_code")
 
  set hprimary_business_telephone = uar_SrvGetStruct(hpharmacies,"primary_business_telephone")
  set pharm_phone = uar_SrvGetStringPtr(hprimary_business_telephone,"value")
	call echo(build("phone: ", uar_SrvGetStringPtr(hprimary_business_telephone,"value")))
 
	set hstatus_data = uar_SrvGetStruct(hReply, "status_data")
	call echo(build("status: ", uar_SrvGetStringPtr(hstatus_data, "status")))
 
	call uar_CrmEndReq(hStep)
	call uar_CrmEndTask(hTask)
	call uar_CrmEndApp(hApp)
 
end
 
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
where e.encntr_id =  request->encntr_id
detail
person_id = e.person_id
encntr_id = e.encntr_id
reg_dt_tm = e.reg_dt_tm
reg_dt = cnvtint(format(e.reg_dt_tm,"mmddyyyy;;d"))  ;008
discharge_dt_tm = e.disch_dt_tm
if (e.disch_dt_tm != NULL)
  show_data = "discharge"
endif
if (not e.encntr_type_cd in (309308.00,309309.00,309311.00,309312.00,3990510.00,3990511.00,11196260.00,10947271.00,
							10579519.00,24987150.00,24987151.00))
  show_data = "encounter"
endif
 
with nocounter
 
;check for multiple active encounters
select into "nl:"
from
encounter e
where e.person_id =  person_id
  and e.active_ind= 1
  and e.end_effective_dt_tm > sysdate
  and e.encntr_type_cd in (309308.00,309309.00,309311.00,309312.00,3990510.00,3990511.00,11196260.00,10947271.00,
							10579519.00,24987150.00,24987151.00)
  and e.reg_dt_tm < sysdate
  and e.disch_dt_tm = NULL
 
order e.reg_dt_tm, e.person_id
 
head report
acnt = 0
 
detail
acnt = acnt + 1
 
foot report
if (acnt > 1)
	person_id = e.person_id
	encntr_id = e.encntr_id
	reg_dt_tm = e.reg_dt_tm
	reg_dt = cnvtint(format(e.reg_dt_tm,"mmddyyyy;;d"))  ;008
	discharge_dt_tm = e.disch_dt_tm
endif
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
call echo("get all meds orders for the person")
 
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
 
order orr.performed_dt_tm
 
head e.encntr_id
  disch_recon_dt_tm = orr.performed_dt_tm
if (orr.recon_status_cd = pend_complete_cd)
  show_data = "pending"
endif
with nocounter
 
 ;;;;set show_data = "Y"   ;;;;;take out
 
 
if (show_data = "Y")
;;************************************************
;; get new orders
;;************************************************
 
call echo("get new orders")
select into "nl:"
from
  encounter e,
  orders o,
  order_recon_detail ord
 
plan e
 ;se where e.encntr_id = encntr_id
 where e.person_id = person_id
 
join o
  where o.encntr_id = e.encntr_id
    and o.person_id = e.person_id		;112
;se  and o.orig_ord_as_flag = 1
  and o.orig_ord_as_flag in (1,2)
  and ((o.current_start_dt_tm >= cnvtdatetime(reg_dt_tm) and e.pre_reg_dt_tm = NULL) or			;008
        e.pre_reg_dt_tm != NULL)																;008
;008  and o.current_start_dt_tm >= cnvtdatetime(reg_dt_tm)
  and o.order_status_cd in (inprocess_cd, ordered_cd)
 
join ord
where ord.order_nbr = outerjoin(o.order_id)
 
order by
  o.hna_order_mnemonic
 ,o.order_id
 ,ord.updt_dt_tm desc
 
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
  if (o.orig_ord_as_flag = 1)
    if (ord.recon_order_action_mean = "CANCEL REORD" or o.prescription_group_value > 0)
      rpt_data->order_qual[cnt].action = "continued"
    else
      if (e.pre_reg_dt_tm != NULL and e.encntr_id != encntr_id)
        rpt_data->order_qual[cnt].action = "continued"
      else
        rpt_data->order_qual[cnt].action = "new"
      endif
    endif
    rpt_data->order_qual[cnt].order_id = o.order_id
  call echo(o.ordered_as_mnemonic)
  call echo(o.orig_ord_as_flag)
 
  else
    if (o.orig_order_dt_tm >= cnvtdatetime(cnvtlookbehind("1,MIN",disch_recon_dt_tm)) and disch_recon_dt_tm != NULL)
      if (e.pre_reg_dt_tm != NULL and e.encntr_id != encntr_id)
        rpt_data->order_qual[cnt].action = "continued"
      else
        rpt_data->order_qual[cnt].action = "new"
      endif
    else
      rpt_data->order_qual[cnt].action = "continued"
    endif
  call echo(o.ordered_as_mnemonic)
  call echo(format(cnvtdatetime(e.reg_dt_tm),"mm/dd/yy hh:mm:ss;;d"))
  call echo(format(cnvtdatetime(o.orig_order_dt_tm),"mm/dd/yy hh:mm:ss;;d"))
      rpt_data->order_qual[cnt].order_id = o.order_id
  endif
 else
  add_new = 0
 endif
foot report
  stat = alterlist(rpt_data->order_qual, cnt)
with nocounter
,orahintcbo("index(o xie18orders)")    ;112
 
call echo(build("new: ",start_cnt))
call echo(build("cont: ",continue_cnt))
 
if (size(rpt_data->order_qual,5) > 0)
;change new prescription orders that were previously home meds to continued
select into "nl:"
 
from
  (dummyt d2 with seq = value(size(rpt_data->order_qual,5))),
  orders o,
  orders o2
 
plan d2
 where rpt_data->order_qual[d2.seq].action = "new"
 
join o
  where o.order_id = rpt_data->order_qual[d2.seq].order_id
 
 
join o2
where o2.person_id = o.person_id
  and o2.order_id != o.order_id
  and o2.catalog_cd = o.catalog_cd
  and o2.orig_ord_as_flag in (1,2)
  and o2.active_ind = 1
  and ((o2.order_status_cd = ordered_cd) or
 		(o2.order_status_cd in (discontinued_cd,completed_cd) and
  		  ((o2.status_dt_tm > cnvtlookbehind("5,MIN",cnvtdatetime(disch_recon_dt_tm)))
  		  or (cnvtdatetime(disch_recon_dt_tm) = NULL))))
order d2.seq
 
head d2.seq
call echo(build("hello",o.order_mnemonic))
call echo(o.order_id)
if (datetimecmp(o.orig_order_dt_tm,o2.orig_order_dt_tm) != 0 or o.order_status_cd != ordered_cd
		or o2.order_status_cd != ordered_cd)
	rpt_data->order_qual[d2.seq].action = "continued"
	continue_cnt = continue_cnt + 1
	start_cnt = start_cnt - 1
endif
with nocounter
endif
 
call echo(build("new: ",start_cnt))
call echo(build("cont: ",continue_cnt))
 
;*************************************************
; get convert_hx orders
;*************************************************
declare add_new = i2 with protect, noconstant(0)
 
call echo("get convert hx orders")
 
select into "nl:"
from
  ;encounter e,
  order_recon orr,
  order_recon_detail ord,
  orders o
 
;plan e
;  where e.person_id = person_id
;  ;and e.encntr_id != encntr_id
;
;join orr
plan orr
  where orr.encntr_id = encntr_id   ;e.encntr_id
  and orr.recon_type_flag = 3 ;discharge
 
join ord
  where ord.order_recon_id = orr.order_recon_id
   and ord.recon_order_action_mean in ("CONVERT_HX")
 
join o
  where o.order_id = ord.order_nbr
  and o.orig_ord_as_flag in (2)  ;1,
  and o.order_status_cd not in (cancelled_cd, discontinued_cd, completed_cd, void_cd,pending_comp_cd)  ;008
 
order by
  o.hna_order_mnemonic
 ,o.order_id
 
head report
 
  stat = alterlist(rpt_data->order_qual, cnt + 10)
 
head o.order_id
  call echo(o.ordered_as_mnemonic)
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
    rpt_data->order_qual[loc_pos].action = "new"
   endif
foot report
  stat = alterlist(rpt_data->order_qual, cnt)
with nocounter
call echo("convert hx orders")
call echo(build("new: ",start_cnt))
call echo(build("cont: ",continue_cnt))
 
;;************************************************
;; get new home med orders entered after disch recon
;;************************************************
 
call echo("get home med after disch recon orders")
select into "nl:"
from
  orders o
 
plan o
  where o.encntr_id = encntr_id
  and o.orig_ord_as_flag = 2
  and o.orig_order_dt_tm >= cnvtdatetime(cnvtlookbehind("1,MIN",disch_recon_dt_tm))
  and o.order_status_cd in (inprocess_cd, ordered_cd)
 
order by
  o.hna_order_mnemonic
 ,o.order_id
 
head report
  stat = alterlist(rpt_data->order_qual, cnt + 10)
head o.order_id
 loc_pos = locateval(num, start, size(rpt_data->order_qual,5), o.order_id, rpt_data->order_qual[num]->order_id)
call echo(loc_pos)
 if (loc_pos = 0)
call echo(o.ordered_as_mnemonic)
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
,orahintcbo("index(o xie2orders)")			;110
call echo(build("new: ",start_cnt))
call echo(build("cont: ",continue_cnt))
 
 
if (size(rpt_data->order_qual,5) > 0)
 
;decide if new meds were converted from home med or prescription
 select into "nl:"
 
from
  (dummyt d2 with seq = value(size(rpt_data->order_qual,5))),
  orders o,
  orders o2
 
plan d2
where rpt_data->order_qual[d2.seq].action = "new"
 
join o
where o.order_id = rpt_data->order_qual[d2.seq].order_id
 
join o2
where o2.encntr_id = o.encntr_id
  and o2.catalog_cd+0 = o.catalog_cd
  and o2.order_id+0 != o.order_id
  and o2.active_ind = 1
 
order d2.seq, o2.orig_order_dt_tm desc
 
head d2.seq
rpt_data->order_qual[d2.seq].home_inpat = "H"
if (o2.orig_ord_as_flag = 0)
  rpt_data->order_qual[d2.seq].home_inpat = "I"
endif
 
with nocounter
endif
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
  ;se  and ord.recon_order_action_mean in ("RECON_RESUME", "RECON_CONTINUE", "CONVERT_HX")
   and ord.recon_order_action_mean in ("RESUME", "RECON_CONTINUE", "CONVERT_RX","MODIFY","RECON_RESUME")
   ;might need this "RENEW_RX"
 
join o
  where o.order_id = ord.order_nbr
  and o.orig_ord_as_flag in (1,2)
  and o.order_status_cd not in (cancelled_cd, discontinued_cd, completed_cd, void_cd,pending_comp_cd)  ;008
 
order by
  o.hna_order_mnemonic
 ,o.order_id
 
head report
 
  stat = alterlist(rpt_data->order_qual, cnt + 10)
 
head o.order_id
  loc_pos = locateval(num, start, size(rpt_data->order_qual,5), o.order_id, rpt_data->order_qual[num]->order_id)
  if (loc_pos = 0)
call echo(o.ordered_as_mnemonic)
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
    if (ord.recon_order_action_mean = "CONVERT_RX" and rpt_data->order_qual[loc_pos].action != "continued"
    		and rpt_data->order_qual[loc_pos].home_inpat != "I")
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
 
select into "nl:"
from
  orders o
 
plan o
  where o.person_id = person_id
  and o.encntr_id != encntr_id
  and o.orig_ord_as_flag in (1,2)
  and o.order_status_cd not in (cancelled_cd, discontinued_cd, completed_cd, void_cd,pending_comp_cd)	;008
 
order by
  o.hna_order_mnemonic
 ,o.order_id
 
;113 head report
;113  if(o.orig_order_dt_tm < reg_dt_tm)
;113
;113  stat = alterlist(rpt_data->order_qual, cnt + 10)
;113  endif
head o.order_id
  add_new = 0
  loc_pos = locateval(num, start, size(rpt_data->order_qual,5), o.order_id, rpt_data->order_qual[num]->order_id)
  if (loc_pos = 0)
  call echo(o.order_mnemonic)
    call echo(format(o.orig_order_dt_tm,"mm/dd/yy hh:mm;;d"))
    call echo(format(admin_recon_dt_tm,"mm/dd/yy hh:mm;;d"))
    if(o.orig_order_dt_tm < reg_dt_tm)
      add_new = 1
      continue_orders_ind = 1
      cnt = cnt + 1
     ;113 if(mod(cnt,10) = 1)
        stat = alterlist(rpt_data->order_qual, cnt )
     ;113 endif
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
, orahintcbo("index(o xie18orders)")		;110
 
 call echo(build("new: ",start_cnt))
call echo(build("cont: ",continue_cnt))
 
;get stop orders
;07/29/13 add future, incomplete and unscheduled to the status not to pull
call echo(reg_dt)
select into "nl:"
o.orig_ord_as_flag
 
from
  orders o
 
plan o
  where o.person_id = person_id
  and o.orig_ord_as_flag in (1,2)
  and o.template_order_flag in (0,1)
  and o.catalog_type_cd = pharmacy_cd
  and not o.order_status_cd in (2550, 2548,2543, 2544, 643467, 2542, 2546, 2547, 2553)
  and o.updt_dt_tm > cnvtdatetime(cnvtdate(reg_dt),0)				;008
;008  and o.updt_dt_tm > cnvtdatetime(reg_dt_tm)
  and not exists (select o2.order_id from orders o2
  							where o2.encntr_id = encntr_id
  							and o2.catalog_cd = o.catalog_cd
  							and o2.orig_ord_as_flag in (1,2)
							and o2.order_status_cd in (2550, 2548))
 
order o.order_mnemonic
 
head o.order_id
 if (o.orig_ord_as_flag = 2 or (o.orig_ord_as_flag = 1 and o.encntr_id != encntr_id))
  cnt = cnt + 1
  stat = alterlist(rpt_data->order_qual, cnt)
  rpt_data->order_qual[cnt].order_id = o.order_id
  rpt_data->order_qual[cnt].action = "stop"
 endif
with nocounter
 
;get iv orders
select into "nl:"
o.orig_ord_as_flag
 
from
  orders o,
  order_detail od,
  order_recon_detail ord,
  order_recon ore
 
plan o
  where o.encntr_id = encntr_id
  and o.orig_ord_as_flag in (1,2)
  and o.template_order_flag in (0,1)
  and o.catalog_type_cd = pharmacy_cd
  and o.order_status_cd not in (cancelled_cd, discontinued_cd, completed_cd, void_cd,pending_comp_cd)	;008
 
join od
where od.order_id = o.order_id
  and od.oe_field_meaning = "PHARMORDERTYPE"
  and od.oe_field_display_value in ("2","3")
 
join ord
where ord.order_nbr = od.order_id
 
join ore
where ore.order_recon_id = ord.order_recon_id
  and ore.recon_type_flag = 3
 
order o.order_id, ord.updt_dt_tm desc
 
head o.order_id
if (ord.recon_order_action_mean in ("RECON_CONTINUE","CONVERT_RX"))
  cnt = cnt + 1
  stat = alterlist(rpt_data->order_qual, cnt)
  rpt_data->order_qual[cnt].order_id = o.order_id
  rpt_data->order_qual[cnt].action = "new"
  rpt_data->order_qual[cnt].iv_type = od.oe_field_display_value
endif
 
with nocounter
 
 call echo(cnt)
 call echo(size(rpt_data->order_qual,5))
 
if (size(rpt_data->order_qual,5) > 0)
 declare hold_comment = vc
 declare hold_com_date = dq8
select into "nl:"
 
from
  (dummyt d2 with seq = value(size(rpt_data->order_qual,5))),
  orders o,
  order_compliance_detail ocd,
  order_catalog_synonym ocs,
  order_detail od,
;110  code_value cv,
  dummyt d3,
  dummyt d4,		;007
  dummyt d5,		;110
  order_comment oc,
  long_text lt
 
plan d2
 
join o
  where o.order_id = rpt_data->order_qual[d2.seq].order_id
 
join ocs
  where ocs.synonym_id = outerjoin(o.synonym_id)
  and   ocs.active_ind = outerjoin(1)
 
join d5																											;110
join od
where od.order_id = o.order_id																					;110
   and od.oe_field_meaning in ("STRENGTHDOSE","STRENGTHDOSEUNIT", "VOLUMEDOSE","VOLUMEDOSEUNIT","RXROUTE",		;110
 		"ROUTINGPHARMACYNAME",	"SPECINX","SCH/PRN","PRNINSTRUCTIONS","FREQ","PRNREASON","DURATION",			;110
 		"INFUSEOVERUNIT","INFUSEOVER","ROUTINGPHARMACYID","PRNREASON","DURATIONUNIT","RATE","FREETXTDOSE",		;110
		"RATEUNIT", "INDICATION","REQROUTINGTYPE","DONTPRINTRXREASON","FREETEXTORD","STOPTYPE")					;110
;110  where od.order_id = outerjoin(o.order_id)				;008
;008  where od.order_id = o.order_id
 
;110  join cv
;110    where cv.code_value = outerjoin(od.oe_field_value)
 
join d4								;007
join ocd
where ocd.order_nbr = o.order_id
   and ocd.compliance_capture_dt_tm = (select max(ocd2.compliance_capture_dt_tm)		;007
  										from order_compliance_detail ocd2				;007								;007
  										  where ocd2.order_nbr = ocd.order_nbr)			;007
join d3
join oc
  where oc.order_id =  o.order_id
;    and oc.action_sequence = (select max(oc2.action_sequence) from order_comment oc2
;    							where oc2.order_id = oc.order_id)
join lt
  where lt.long_text_id = oc.long_text_id
 
order by
  o.hna_order_mnemonic
 ,o.order_id
 ,od.oe_field_meaning
 ,od.action_sequence desc
  ,ocd.compliance_capture_dt_tm desc
   ,oc.action_sequence desc
 
head report
first_time = "Y"
hold_comment = ""
cnt = 0
pcnt = 0   ;110
ocnt = 0   ;110
 
head o.order_id
  rpt_data->order_qual[d2.seq].synonym_type = ocs.mnemonic_type_cd
  if (ocd.compliance_status_cd in (not_as_prescribed_cd,not_taking_cd) and
  			rpt_data->order_qual[d2.seq].action != "stop")
    rpt_data->order_qual[d2.seq].drug_name  = concat("<B>*</b>",trim(o.order_mnemonic))
    not_taking_flag = "Y"
  else
    rpt_data->order_qual[d2.seq].drug_name  = trim(o.order_mnemonic)
  endif
 	rpt_data->order_qual[d2.seq].stop_type_cd = o.stop_type_cd
  rpt_data->order_qual[d2.seq].new_prescription = "N"
  if (o.orig_order_dt_tm > cnvtdatetime(reg_dt_tm) and o.orig_ord_as_flag = 1)
  	rpt_data->order_qual[d2.seq].new_prescription = "Y"
  endif
  rpt_data->order_qual[d2.seq].ordered_as = concat(" (", trim(o.ordered_as_mnemonic), ")")
  rpt_data->order_qual[d2.seq].order_status = uar_get_code_display(o.order_status_cd)
  rpt_data->order_qual[d2.seq].comment = lt.long_text
first_time = "Y"
hold_comment = ""
cnt = 0
hold_com_date = cnvtdate(01011900)
 
head od.oe_field_meaning
case (od.oe_field_meaning)
 
  of "PRNREASON":
    rpt_data->order_qual[d2.seq].prnreason = od.oe_field_display_value
  of "PRNINSTRUCTIONS":
    rpt_data->order_qual[d2.seq].prnreason = od.oe_field_display_value
  of "ROUTINGPHARMACYNAME":
    rpt_data->order_qual[d2.seq].pharmacy = cnvtalphanum(od.oe_field_display_value,2)
  of "ROUTINGPHARMACYID":
	 loc_pos = locateval(num, start, size(rpt_data->pharmacy,5), od.oe_field_display_value, rpt_data->pharmacy[num]->pharm_id)
	 if (loc_pos = 0)														;110
	    pcnt = pcnt + 1														;110
	    stat = alterlist(rpt_data->pharmacy,pcnt)							;110
	    rpt_data->pharmacy[pcnt].pharm_id = od.oe_field_display_value		;110
	    ocnt = size(rpt_data->pharmacy[pcnt].orders,5) + 1					;110
	    stat = alterlist(rpt_data->pharmacy[pcnt].orders,ocnt)				;110
	    rpt_data->pharmacy[pcnt]->orders[ocnt].seq = d2.seq					;110
     else																	;110
        pcnt = loc_pos
     	ocnt = size(rpt_data->pharmacy[pcnt].orders,5) + 1					;110
	    stat = alterlist(rpt_data->pharmacy[pcnt].orders,ocnt)					;110
	    rpt_data->pharmacy[pcnt]->orders[ocnt].seq = d2.seq					;110
     endif																	;110
 
;110      call GetPharmacyAddress(od.oe_field_display_value)
;110  rpt_data->order_qual[d2.seq].pharm_street = pharm_street
;110  rpt_data->order_qual[d2.seq].pharm_city_state_zip = concat(trim(pharm_city,3),", ",trim(pharm_state,3),"  ",trim(pharm_zip,3))
;110      rpt_data->order_qual[d2.seq].pharm_phone = cnvtphone(pharm_phone,0)
  of "FREQ":
    rpt_data->order_qual[d2.seq].FREQ = uar_get_code_description(od.oe_field_value)
  of "STRENGTHDOSE":
    rpt_data->order_qual[d2.seq].STRENGTHDOSE = od.oe_field_display_value
  of "VOLUMEDOSE":
    rpt_data->order_qual[d2.seq].VOLUMEDOSE = od.oe_field_display_value
  of "STRENGTHDOSEUNIT":
    rpt_data->order_qual[d2.seq].STRENGTHDOSEUNIT = od.oe_field_display_value
  of "VOLUMEDOSEUNIT":
;110    rpt_data->order_qual[d2.seq].VOLUMEDOSEUNIT = cv.description
     rpt_data->order_qual[d2.seq].VOLUMEDOSEUNIT = uar_get_code_description(od.oe_field_value)		;110
  of "RXROUTE":
;110    rpt_data->order_qual[d2.seq].RXROUTE = cv.description
     rpt_data->order_qual[d2.seq].RXROUTE = uar_get_code_description(od.oe_field_value)				;110
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
  	rpt_data->order_qual[d2.seq].dontprintrxreason = od.oe_field_display_value
  of "SCH/PRN":
    rpt_data->order_qual[d2.seq].prn = concat(" PRN ", od.oe_field_display_value)
  of "FREETEXTORD":
    rpt_data->order_qual[d2.seq].freetext_ord = trim(od.oe_field_display_value,3)
  of  "STOPTYPE":			;se
  	if (od.oe_field_value in (hard_stop_cd,physician_stop_cd))		;se
  	  rpt_data->order_qual[d2.seq].hard_stop_flag = 1  				;se
  	endif															;se
  endcase
 
detail
cnt = cnt + 1
  if (first_time = "Y" and not rpt_data->order_qual[d2.seq].action in ("new","stop"))
    if (cnt = 1)
  call echo(lt.long_text)
  call echo(build("disch",format(disch_recon_dt_tm,"mm/dd/yy hh:mm:ss;;d")))
      hold_comment = lt.long_text
      hold_com_date = oc.updt_dt_tm
    elseif (cnt = 2)
      if (hold_comment != lt.long_text)
        if (o.orig_ord_as_flag = 2 and
	  			(disch_recon_dt_tm = NULL or (hold_com_date < cnvtlookbehind("1,MIN",cnvtdatetime(disch_recon_dt_tm)))))
      	  col+0
      	else
      	  if (cnvtdatetime(hold_com_date) > cnvtdatetime(reg_dt_tm))
      	    rpt_data->order_qual[d2.seq].action = "changes"
      	  endif
      	endif
      endif
    endif
  endif
 
foot od.oe_field_meaning
first_time = "N"
if (cnt = 1 and o.orig_order_dt_tm < cnvtdatetime(hold_com_date) and not rpt_data->order_qual[d2.seq].action in ("new","stop")  )
   if (o.orig_ord_as_flag = 2 and
		(disch_recon_dt_tm = NULL or (oc.updt_dt_tm < cnvtlookbehind("1,MIN",cnvtdatetime(disch_recon_dt_tm)))))
	  col+0
   else
	 if (oc.updt_dt_tm > cnvtdatetime(reg_dt_tm))
       rpt_data->order_qual[d2.seq].action = "changes"
     endif
   endif
endif
 
foot o.order_id
 	if (rpt_data->order_qual[d2.seq].prnreason > " ")
 	  rpt_data->order_qual[d2.seq].FREQ = concat(trim(rpt_data->order_qual[d2.seq].FREQ,3), " as needed for ",
 	  								 trim(rpt_data->order_qual[d2.seq].prnreason,3))
 	endif
 
  if(rpt_data->order_qual[d2.seq].VOLUMEDOSE != "")
  rpt_data->order_qual[d2.seq].detail_display = concat(
  rpt_data->order_qual[d2.seq].VOLUMEDOSE , " ",
  rpt_data->order_qual[d2.seq].VOLUMEDOSEUNIT)
			if (rpt_data->order_qual[d2.seq].RXROUTE != "")
			  rpt_data->order_qual[d2.seq].detail_display = concat(rpt_data->order_qual[d2.seq].detail_display,
			  				", ",  rpt_data->order_qual[d2.seq].RXROUTE)
			endif
			if (rpt_data->order_qual[d2.seq].FREQ != "")
			  rpt_data->order_qual[d2.seq].detail_display = concat(rpt_data->order_qual[d2.seq].detail_display,
			  				", ",  rpt_data->order_qual[d2.seq].FREQ)
			endif
 
 
  elseif(rpt_data->order_qual[d2.seq].STRENGTHDOSE != "" and rpt_data->order_qual[d2.seq].VOLUMEDOSE != "")	;mod009
  rpt_data->order_qual[d2.seq].detail_display = concat(
  rpt_data->order_qual[d2.seq].STRENGTHDOSE , " ",
  rpt_data->order_qual[d2.seq].STRENGTHDOSEUNIT , ", ",
  "= ",
  rpt_data->order_qual[d2.seq].VOLUMEDOSE , " ",
  rpt_data->order_qual[d2.seq].VOLUMEDOSEUNIT, ", ",
  rpt_data->order_qual[d2.seq].RXROUTE, ", ",
  rpt_data->order_qual[d2.seq].FREQ, " "
  )  call echo("hello2")
  elseif (rpt_data->order_qual[d2.seq].STRENGTHDOSE != "")
  rpt_data->order_qual[d2.seq].detail_display = concat(
  rpt_data->order_qual[d2.seq].STRENGTHDOSE , " ",
  rpt_data->order_qual[d2.seq].STRENGTHDOSEUNIT , ", ",
  rpt_data->order_qual[d2.seq].RXROUTE, ", ",
  rpt_data->order_qual[d2.seq].FREQ, " "
  )    call echo("hello3")
  else
	if (rpt_data->order_qual[d2.seq].RXROUTE != "")
	  rpt_data->order_qual[d2.seq].detail_display =  rpt_data->order_qual[d2.seq].RXROUTE
	endif
	if (rpt_data->order_qual[d2.seq].FREQ != "")
	  if (rpt_data->order_qual[d2.seq].RXROUTE != "")
	    rpt_data->order_qual[d2.seq].detail_display = concat(rpt_data->order_qual[d2.seq].detail_display,
	  				", ",  rpt_data->order_qual[d2.seq].FREQ)
	  else
	    rpt_data->order_qual[d2.seq].detail_display =  rpt_data->order_qual[d2.seq].FREQ
	  endif
	endif
  ;se rpt_data->order_qual[d2.seq].detail_display = concat(rpt_data->order_qual[d2.seq].RXROUTE, ", ", ;005
  ;se rpt_data->order_qual[d2.seq].FREQ)
  endif
 
  if  ((rpt_data->order_qual[d2.seq].synonym_type in (brandname_cd,c_cd,primary_cd))
                        and (o.orig_ord_as_flag = 1))
        if(rpt_data->order_qual[d2.seq].STRENGTHDOSE != "" and rpt_data->order_qual[d2.seq].VOLUMEDOSE != "")
                rpt_data->order_qual[d2.seq].detail_display = concat(
                rpt_data->order_qual[d2.seq].STRENGTHDOSE , " ",
                rpt_data->order_qual[d2.seq].STRENGTHDOSEUNIT , ", ",
                "= ",	;mod009
                rpt_data->order_qual[d2.seq].VOLUMEDOSE , " ",
                rpt_data->order_qual[d2.seq].VOLUMEDOSEUNIT ,
                ", ",
                rpt_data->order_qual[d2.seq].RXROUTE, ", "
                ,rpt_data->order_qual[d2.seq].FREQ ;, "; "  	;mod008 ;005
                )
                call echo("hello4")
        else
 
                rpt_data->order_qual[d2.seq].detail_display = concat(
                rpt_data->order_qual[d2.seq].STRENGTHDOSE , " ",
                rpt_data->order_qual[d2.seq].STRENGTHDOSEUNIT , ", ",
                ;"= ",	;mod009
                rpt_data->order_qual[d2.seq].VOLUMEDOSE , " ",
                rpt_data->order_qual[d2.seq].VOLUMEDOSEUNIT ,
                ", ",
                rpt_data->order_qual[d2.seq].RXROUTE, ", "
                ,rpt_data->order_qual[d2.seq].FREQ ;, "; "  	;mod008 ;005
                )
                call echo("hello5")
        endif
 
  endif
 
    if (rpt_data->order_qual[d2.seq].freetxtdose != "")              ;006
;                rpt_data->order_qual[d2.seq].detail_display = concat(    ;006
;                rpt_data->order_qual[d2.seq].freetxtdose , ", ",          ;006
;                rpt_data->order_qual[d2.seq].RXROUTE, ", "                ;006
;                ,rpt_data->order_qual[d2.seq].FREQ, " "    ;005          ;006
;                )                                                     ;006
			rpt_data->order_qual[d2.seq].detail_display = rpt_data->order_qual[d2.seq].freetxtdose
			if (rpt_data->order_qual[d2.seq].RXROUTE != "")
			  rpt_data->order_qual[d2.seq].detail_display = concat(rpt_data->order_qual[d2.seq].detail_display,
			  				", ",  rpt_data->order_qual[d2.seq].RXROUTE)
			endif
			if (rpt_data->order_qual[d2.seq].FREQ != "")
			  rpt_data->order_qual[d2.seq].detail_display = concat(rpt_data->order_qual[d2.seq].detail_display,
			  				", ",  rpt_data->order_qual[d2.seq].FREQ)
			endif
 
    endif
 
 call echo(rpt_data->order_qual[d2.seq].detail_display)
;  if (rpt_data->order_qual[d2.seq].INDICATION > "")
;    rpt_data->order_qual[d2.seq].INDICATION = concat("; Indications:  ",
;    rpt_data->order_qual[d2.seq].INDICATION);, "; ") ;mod008
;  endif
;  if (rpt_data->order_qual[d2.seq].SPECINX > "");dmr013 change label
;    rpt_data->order_qual[d2.seq].SPECINX = concat("; Indications/Special Instructions:  ",
;    rpt_data->order_qual[d2.seq].SPECINX)
;  endif
  if (rpt_data->order_qual[d2.seq].DURATION > " " and rpt_data->order_qual[d2.seq].DURATIONUNIT > " "
  						and rpt_data->order_qual[d2.seq].hard_stop_flag = 1 )
    rpt_data->order_qual[d2.seq].detail_display = concat(trim(rpt_data->order_qual[d2.seq].detail_display,3),
    				" x ",rpt_data->order_qual[d2.seq].DURATION," ",rpt_data->order_qual[d2.seq].DURATIONUNIT)
  endif
  if(o.oe_format_id in (oe_non_form, oe_freetext) and
     rpt_data->order_qual[d2.seq].freetext_ord > "")
     rpt_data->order_qual[d2.seq].ordered_as =
               concat(" (", trim(cnvtupper(rpt_data->order_qual[d2.seq].freetext_ord)), ")")
  endif
  if (rpt_data->order_qual[d2.seq].iv_type = "2")
    rpt_data->order_qual[d2.seq].detail_display = concat(trim(rpt_data->order_qual[d2.seq].RATE,3)," ",
    					trim(rpt_data->order_qual[d2.seq].RATEUNIT,3),", ",  rpt_data->order_qual[d2.seq].RXROUTE)
  elseif (rpt_data->order_qual[d2.seq].iv_type = "3")
    rpt_data->order_qual[d2.seq].detail_display = concat("Infuse Over ",trim(rpt_data->order_qual[d2.seq].INFUSEOVER,3)," ",
    					trim(rpt_data->order_qual[d2.seq].INFUSEOVERUNIT,3),", ",rpt_data->order_qual[d2.seq].STRENGTHDOSE , " ",
                rpt_data->order_qual[d2.seq].STRENGTHDOSEUNIT)
			      if (rpt_data->order_qual[d2.seq].RXROUTE != "")
						  rpt_data->order_qual[d2.seq].detail_display = concat(rpt_data->order_qual[d2.seq].detail_display,
						  				", ",  rpt_data->order_qual[d2.seq].RXROUTE)
						endif
						if (rpt_data->order_qual[d2.seq].FREQ != "")
						  rpt_data->order_qual[d2.seq].detail_display = concat(rpt_data->order_qual[d2.seq].detail_display,
						  				", ",  rpt_data->order_qual[d2.seq].FREQ)
						endif
  endif
 
foot report
call echo("load pharm")
for (y = 1 to size(rpt_data->pharmacy,5))
  call GetPharmacyAddress(rpt_data->pharmacy[y].pharm_id )
  for (z = 1 to size(rpt_data->pharmacy[y].orders,5))
  call echo(rpt_data->pharmacy[y].orders[z].seq)
    rpt_data->order_qual[rpt_data->pharmacy[y].orders[z].seq].pharm_street = pharm_street
    rpt_data->order_qual[rpt_data->pharmacy[y].orders[z].seq].pharm_city_state_zip = concat(trim(pharm_city,3),", "
    								,trim(pharm_state,3),"  ",trim(pharm_zip,3))
    rpt_data->order_qual[rpt_data->pharmacy[y].orders[z].seq].pharm_phone = cnvtphone(pharm_phone,0)
  endfor
endfor
;  stat = alterlist(rpt_data->order_qual, cnt)
;007  with nocounter, outerjoin = d3
;110 with nocounter,outerjoin=d4,dontcare= ocd, outerjoin = d3 ;007
 with nocounter,outerjoin=d4,dontcare= ocd, outerjoin = d5, dontcare = od, outerjoin = d3 	;110
 
call echorecord(rpt_data)
;;get last dose
;select into "nl:"
;from
;  (dummyt d with seq = value(size(rpt_data->order_qual,5))),
;   orders o,
;   clinical_event ce
;
;plan d
;
;join o
;where o.encntr_id = request->encntr_id
;  and ((o.template_order_id = rpt_data->order_qual[d.seq].order_id
;       and o.template_order_flag = 4)  or
;       (o.template_order_id = 0 and o.template_order_flag = 0))
;  and not o.orig_ord_as_flag in (1,2)
;  and o.active_ind = 1
;  and o.catalog_type_cd = 2516
;
;
;join ce
;where ce.order_id = o.order_id
;  and ce.valid_until_dt_tm > sysdate
;  and ce.result_status_cd != 31
;  and ce.view_level = 1
;
;order d.seq, ce.event_end_dt_tm desc
;
;head d.seq
;rpt_data->order_qual[d.seq].last_dose = format(ce.event_end_dt_tm,"mm/dd/yy;;d")
;
;with nocounter
 
;get recon note
select into "nl:"
from
  (dummyt d with seq = value(size(rpt_data->order_qual,5))),
  order_recon_detail ord
 
plan d
join ord
where ord.order_nbr = rpt_data->order_qual[d.seq].order_id
 and exists (select ore.order_recon_id from order_recon ore
  				where ore.order_recon_id = ord.order_recon_id
  				  and ore.encntr_id = request->encntr_id)
 
order d.seq, ord.updt_dt_tm desc
 
head d.seq
rpt_data->order_qual[d.seq].recon_note = ord.recon_note_txt
 
with nocounter
 
;;;remove per Lois on 7/29/13
;;;;get last documented med history
;;;select into "nl:"
;;;from
;;;  order_compliance oc
;;;
;;;plan oc
;;;where oc.encntr_id = request->encntr_id
;;;  and oc.encntr_compliance_status_flag = 0
;;;
;;;order oc.performed_dt_tm desc
;;;
;;;head report
;;;med_hist_comp_dt = oc.performed_dt_tm
;;;
;;;with nocounter
 
select into "nl:"
from
(dummyt d with seq = value(size(rpt_data->order_qual,5))),
orders o
 
plan d
where rpt_data->order_qual[d.seq].action in ("continued","new")
 
join o
where o.order_id = rpt_data->order_qual[d.seq].order_id
 
order o.catalog_cd
 
head report
hold_catalog_cd = 0.0
hold_dseq = 0
cnt = 0
 
head d.seq
;call echo("multiples")
if (hold_catalog_cd = o.catalog_cd)
;call echo(o.ordered_as_mnemonic)
  ;cnt = d.seq
  rpt_data->order_qual[d.seq].multiple = "Y"
  rpt_data->order_qual[hold_dseq].multiple = "Y"
endif
hold_catalog_cd = o.catalog_cd
hold_dseq = d.seq
 
with nocounter
 
 
;check for changes (between orders)
select into "nl:"
from
  (dummyt d with seq = value(size(rpt_data->order_qual,5))),
  orders o,
  order_detail od,
  orders o2,
  order_detail od2
 
plan d
where rpt_data->order_qual[d.seq].action = "continued"
 
join o
where o.order_id = rpt_data->order_qual[d.seq].order_id   ;  799522733.00
 
join od
where od.order_id = o.order_id
  and od.oe_field_meaning in ("STRENGTHDOSE","STRENGTHDOSEUNIT", "VOLUMEDOSE","VOLUMEDOSEUNIT","RXROUTE","FREETXTDOSE",
  								"SPECINX","SCH/PRN","PRNINSTRUCTIONS","FREQ","PRNREASON","DURATION","DURATIONUNIT")
  and od.action_sequence = (select max(od3.action_sequence) from order_detail od3
  														where od3.order_id = o.order_id
  										and od3.oe_field_meaning = od.oe_field_meaning)
join o2
where o2.person_id = o.person_id
  and o2.catalog_cd = o.catalog_cd
  and o2.template_order_flag in (0,1)
  and o2.orig_ord_as_flag in (1,2)
;  and ((o2.orig_ord_as_flag =2) or (o2.orig_ord_as_flag = 1 and o2.encntr_id = o.encntr_id))
  and o2.active_ind = 1
  and o2.order_id != o.order_id
  and (o2.order_status_cd = 2550 or
      (o2.order_status_cd in (2545,2543) and o2.updt_dt_tm > cnvtdatetime(reg_dt_tm)))
 
join od2
where od2.order_id = o2.order_id
  and od2.oe_field_meaning in ("STRENGTHDOSE","STRENGTHDOSEUNIT", "VOLUMEDOSE","VOLUMEDOSEUNIT","RXROUTE","FREETXTDOSE",
  								"SPECINX","SCH/PRN","PRNINSTRUCTIONS","FREQ","PRNREASON","DURATION","DURATIONUNIT")
and od2.oe_field_meaning = od.oe_field_meaning
  and od2.action_sequence = (select max(od4.action_sequence) from order_detail od4
  														where od4.order_id = o2.order_id
  										and od4.oe_field_meaning =od.oe_field_meaning)
 
order o.catalog_cd, d.seq, od.order_id,od2.order_id
 
head report
changes = "N"
skip = "N"
hold_cat_cd = 0.0
hold_syn = 0.0
; call echo("first change")
 
head d.seq
changes = "N"
skip = "N"
hold_syn = 0.0
hold_cat_cd = 0.0
 
head od.order_id
if (hold_cat_cd = o2.catalog_cd)
  if (hold_syn = o.synonym_id)
    skip = "Y"
;  else
;    rpt_data->order_qual[d.seq].action = "continued"
  endif
endif
hold_cat_cd = o2.catalog_cd
hold_syn = o2.synonym_id
 
head od2.order_id
if (rpt_data->order_qual[d.seq].multiple = "Y")
  skip = "N"
  if (o.synonym_id != o2.synonym_id)
    skip = "Y"
    ;call echo(o.ordered_as_mnemonic)
  else
    ;rpt_data->order_qual[d.seq].action = "continued"
    if (od.updt_dt_tm  < cnvtdatetime(reg_dt_tm))
      skip = "Y"
    endif
  endif
endif
 
detail
;call echo(o.order_mnemonic)
;   call echo(concat(trim(o.ordered_as_mnemonic),"  ",skip))
;   call echo(concat(trim(od.oe_field_display_value,3) ,"    ",trim( od2.oe_field_display_value,3)))
 
if (skip = "N")
	if (od.oe_field_display_value != od2.oe_field_display_value)
		if (o.orig_ord_as_flag = 2 and (disch_recon_dt_tm = NULL)) ;or (od2.updt_dt_tm < disch_recon_dt_tm)))
		  changes = "N"
		else
		  if (od.oe_field_meaning in ("DURATION","DURATIONUNIT")
  		       and rpt_data->order_qual[d.seq].stop_type_cd = maintenance_cd)
  		    changes = "N"
  		  else
		      rpt_data->order_qual[d.seq].action = "changes"
		  endif
 
		  ;changes = "Y"
		endif
	endif
endif
 
;foot od.order_id
;if (skip = "N")
;	if (changes = "Y")
;	  rpt_data->order_qual[d.seq].action = "changes"
;	endif
;endif
 
;foot d.seq
; if (rpt_data->order_qual[d.seq].action = "changes")
;	 if (med_hist_comp_dt > o.updt_dt_tm)
;	 	  rpt_data->order_qual[d.seq].action = "continued"
;	 endif
; endif
with nocounter
 
 declare hold_date = dq8
select into "nl:"
from
  (dummyt d with seq = value(size(rpt_data->order_qual,5))),
  orders o,
  order_detail od,
  dummyt d1,
  order_detail od2
 
plan d
where rpt_data->order_qual[d.seq].action = "continued"
 
join o
where o.order_id = rpt_data->order_qual[d.seq].order_id   ;  799522733.00
 
join od
where od.order_id = o.order_id
  and od.oe_field_meaning in ("STRENGTHDOSE","STRENGTHDOSEUNIT", "VOLUMEDOSE","VOLUMEDOSEUNIT","RXROUTE","FREETXTDOSE",
  								"SPECINX","SCH/PRN","PRNINSTRUCTIONS","FREQ","PRNREASON","DURATION","DURATIONUNIT")
;  and od.action_sequence = 1
  and od.action_sequence = (select max(od4.action_sequence) from order_detail od4
  														where od4.order_id = od.order_id
  										and od4.oe_field_meaning =od.oe_field_meaning
  										and od4.action_sequence != 1)
join d1
join od2
where od2.order_id = o.order_id
  and od2.oe_field_meaning in ("STRENGTHDOSE","STRENGTHDOSEUNIT", "VOLUMEDOSE","VOLUMEDOSEUNIT","RXROUTE","FREETXTDOSE",
  								"SPECINX","SCH/PRN","PRNINSTRUCTIONS","FREQ","PRNREASON","DURATION","DURATIONUNIT")
and od2.oe_field_meaning = od.oe_field_meaning
;  and od2.action_sequence = (select max(od4.action_sequence) from order_detail od4
;  														where od4.order_id = o.order_id
;  										and od4.oe_field_meaning =od.oe_field_meaning
;  										and od4.action_sequence != 1)
 
order  o.order_id, od.action_sequence, od.detail_sequence, od.oe_field_meaning
 
head report
changes = "N"
 poss_change = "N"
 cnt = 0
 
head o.order_id
changes = "N"
 cnt = 0
 poss_change = "N"
 
;head od.detail_sequence
;cnt  = 0
; poss_change = "N"
 
;detail
 
head od.oe_field_meaning
;call echo(o.order_mnemonic)
;cnt = cnt + 1
 
;if (cnt = 1 and od.action_sequence = od2.action_sequence)
;  	if (od.oe_field_meaning in ("DURATION","DURATIONUNIT")
;  				and rpt_data->order_qual[d.seq].stop_type_cd = maintenance_cd
;  				and poss_change = "N")
;  	  poss_change = "N"
;  	else
;  	  poss_change = "Y"
;    endif
;elseif (cnt = 2)
  if ((od.action_sequence > 1) and (od.action_sequence  = od2.action_sequence)
  			and (od.oe_field_display_value = od2.oe_field_display_value))
 
  	if (od.oe_field_meaning in ("DURATION","DURATIONUNIT")
  				and rpt_data->order_qual[d.seq].stop_type_cd = maintenance_cd)
  	  col + 0
  	else
  	  hold_date = od.updt_dt_tm
  	  poss_change = "Y"
  	endif
  endif
 
  if (od.oe_field_display_value != od2.oe_field_display_value and poss_change = "N")
  	if (od.oe_field_meaning in ("DURATION","DURATIONUNIT")
  				and rpt_data->order_qual[d.seq].stop_type_cd = maintenance_cd)
;  				and poss_change = "N")
;  	  poss_change = "N"
      col + 0
  	else
  	  poss_change = "Y"
  	  hold_date = od.updt_dt_tm
;  	  call echo(o.order_mnemonic)
;  	  call echo(poss_change)
 
    endif
;  else
;  	poss_change = "N"
  endif
;endif
;   	  call echo(poss_change)
 
foot o.order_id
 
   ; if (od.oe_field_display_value != od2.oe_field_display_value)
 
	if (poss_change = "Y")
;	call echo(o.orig_ord_as_flag)
;	call echo(format(hold_date,"mm/dd/yy hh:mm;;d"))
;	call echo(format(od2.updt_dt_tm,"mm/dd/yy hh:mm:ss;;d"))
;	call echo("reg_dt")
;	call echo(format(reg_dt_tm,"mm/dd/yy hh:mm:ss;;d"))
;	call echo("dis_rec_dt")
;	call echo(format(disch_recon_dt_tm,"mm/dd/yy hh:mm:ss;;d"))
	  if (o.orig_ord_as_flag = 2 and
	  			(disch_recon_dt_tm = NULL or (cnvtdatetime(hold_date) < cnvtlookbehind("1,MIN",cnvtdatetime(disch_recon_dt_tm)))))
	    changes = "N"
	  else
	    if (o.orig_ord_as_flag = 1 and cnvtdatetime(hold_date) < cnvtdatetime(reg_dt_tm))
	      changes = "N"
	    else
	      changes = "Y"
	    endif
	  endif
	endif
 
 
if (changes = "Y")
  rpt_data->order_qual[d.seq].action = "changes"
endif
 
with nocounter, outerjoin = d1
 
declare hold_drug=vc
declare hold_dose=vc
 
 
/*eliminate stopped meds with new or continued order */
select into "nl:"
 drug_name = cnvtupper(replace(rpt_data->order_qual[d2.seq].drug_name,"<B>*</b>",""))
from (dummyt d2 with seq = value(size(rpt_data->order_qual,5)))
 
plan d2
 
;order by rpt_data->order_qual[d2.seq].ordered_as, rpt_data->order_qual[d2.seq].action
 order by drug_name, rpt_data->order_qual[d2.seq].action
head report
cnt2=0
 
detail
; call echo(drug_name)
if (rpt_data->order_qual[d2.seq].action="stop")
;call echo("in stop")
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
   rpt_data2->order_qual[cnt2].RXROUTE = rpt_data->order_qual[d2.seq].RXROUTE
   rpt_data2->order_qual[cnt2].FREQ = rpt_data->order_qual[d2.seq].FREQ
   rpt_data2->order_qual[cnt2].RATE = rpt_data->order_qual[d2.seq].RATE
   rpt_data2->order_qual[cnt2].RATEUNIT = rpt_data->order_qual[d2.seq].RATEUNIT
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
 	rpt_data2->order_qual[cnt2].last_dose = rpt_data->order_qual[d2.seq].last_dose	;se
 	rpt_data2->order_qual[cnt2].action_meaning = rpt_data->order_qual[d2.seq].action_meaning	;se
 	rpt_data2->order_qual[cnt2].pharmacy = rpt_data->order_qual[d2.seq].pharmacy	;se
 	rpt_data2->order_qual[cnt2].pharm_street = rpt_data->order_qual[d2.seq].pharm_street	;se
 	rpt_data2->order_qual[cnt2].pharm_city_state_zip = rpt_data->order_qual[d2.seq].pharm_city_state_zip	;se
 	rpt_data2->order_qual[cnt2].pharm_phone = rpt_data->order_qual[d2.seq].pharm_phone	;se
 	rpt_data2->order_qual[cnt2].REQROUTINGTYPE = rpt_data->order_qual[d2.seq].REQROUTINGTYPE	;se
 	rpt_data2->order_qual[cnt2].dontprintrxreason = rpt_data->order_qual[d2.seq].dontprintrxreason	;se
 	rpt_data2->order_qual[cnt2].new_prescription = rpt_data->order_qual[d2.seq].new_prescription	;se
 	rpt_data2->order_qual[cnt2].recon_note = rpt_data->order_qual[d2.seq].recon_note	;se
 	rpt_data2->order_qual[cnt2].stop_type_cd = rpt_data->order_qual[d2.seq].stop_type_cd	;se
 	rpt_data2->order_qual[cnt2].multiple = rpt_data->order_qual[d2.seq].multiple	;se
 
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
   rpt_data2->order_qual[cnt2].RXROUTE = rpt_data->order_qual[d2.seq].RXROUTE
   rpt_data2->order_qual[cnt2].FREQ = rpt_data->order_qual[d2.seq].FREQ
   rpt_data2->order_qual[cnt2].RATE = rpt_data->order_qual[d2.seq].RATE
   rpt_data2->order_qual[cnt2].RATEUNIT = rpt_data->order_qual[d2.seq].RATEUNIT
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
 	rpt_data2->order_qual[cnt2].last_dose = rpt_data->order_qual[d2.seq].last_dose	;se
 	rpt_data2->order_qual[cnt2].comment = rpt_data->order_qual[d2.seq].comment		;se
 	rpt_data2->order_qual[cnt2].action_meaning = rpt_data->order_qual[d2.seq].action_meaning	;se
 	rpt_data2->order_qual[cnt2].pharmacy = rpt_data->order_qual[d2.seq].pharmacy	;se
 	rpt_data2->order_qual[cnt2].pharm_street = rpt_data->order_qual[d2.seq].pharm_street	;se
 	rpt_data2->order_qual[cnt2].pharm_city_state_zip = rpt_data->order_qual[d2.seq].pharm_city_state_zip	;se
 	rpt_data2->order_qual[cnt2].pharm_phone = rpt_data->order_qual[d2.seq].pharm_phone	;se
 	rpt_data2->order_qual[cnt2].REQROUTINGTYPE = rpt_data->order_qual[d2.seq].REQROUTINGTYPE	;se
 	rpt_data2->order_qual[cnt2].dontprintrxreason = rpt_data->order_qual[d2.seq].dontprintrxreason	;se
 	rpt_data2->order_qual[cnt2].new_prescription = rpt_data->order_qual[d2.seq].new_prescription	;se
 	rpt_data2->order_qual[cnt2].recon_note = rpt_data->order_qual[d2.seq].recon_note	;se
 	rpt_data2->order_qual[cnt2].stop_type_cd = rpt_data->order_qual[d2.seq].stop_type_cd	;se
 	rpt_data2->order_qual[cnt2].multiple = rpt_data->order_qual[d2.seq].multiple	;se
  hold_drug=rpt_data->order_qual[d2.seq].ordered_as
endif
 
 foot report
 stat = alterlist(rpt_data2->order_qual, cnt2 )
with nocounter
endif
 
call echorecord(rpt_data2)
 
 
set sText = BUILD(csBegin, "<TABLE border ='1' cellpadding=2>")   ;csTable)
set sText = build(sText,"<TR>","<td width=150 valign=top", sStyleCenter,
								"<b>Medication/Strength</b>",  csTableDefEnd)
set sText = build(sText,"<td width=150 valign=top", sStyleCenter,
								"<b>How to Take</b>",  csTableDefEnd)
set sText = build(sText,"<td width=235 valign=top", sStyleCenter,
								"<b>Indications/Special Instructions/Comments/Notes for Patient</b>",  csTableDefEnd)
set sText = build(sText,"<td width=175 valign=top", sStyleCenter, ;006
								"<b>Medication Changes/Routing</b>",  csTableDefEnd,"</TR>")  ;006
 
 
for (x = 1 to size(rpt_data2->order_qual,5))
 if (rpt_data2->order_qual[x].action != "stop")
;  if (rpt_data2->order_qual[x].action in ("new","continued","changes"))
	set sText = concat(sText,"<TR>","<td width=150 valign=top", sStyleCenter,
									trim(rpt_data2->order_qual[x].drug_name,3)," ",trim(rpt_data2->order_qual[x].ordered_as,3),
									 csTableDefEnd)
;  set disp = substring(1,findstring(",",rpt_data2->order_qual[x].detail_display,1,0)-1,rpt_data2->order_qual[x].detail_display)
;call echo(rpt_data2->order_qual[x].detail_display)
;call echo(disp)
 
	set sText = build(sText,"<td width=150 valign=top", sStyleCenter,
									trim(rpt_data2->order_qual[x].detail_display,3), csTableDefEnd)
	set disp = ""
  if (rpt_data2->order_qual[x].INDICATION > " ")
    if (rpt_data2->order_qual[x].SPECINX > " ")
      if (rpt_data2->order_qual[x].comment > " ")
        set disp = concat(trim(rpt_data2->order_qual[x].INDICATION)," / ",trim(rpt_data2->order_qual[x].SPECINX),
        							" / ", trim(rpt_data2->order_qual[x].comment))
      else
        set disp = concat(trim(rpt_data2->order_qual[x].INDICATION)," / ",trim(rpt_data2->order_qual[x].SPECINX))
      endif
    else
      if (rpt_data2->order_qual[x].comment > " ")
        set disp = concat(trim(rpt_data2->order_qual[x].INDICATION)," / ", trim(rpt_data2->order_qual[x].comment))
      else
        set disp = rpt_data2->order_qual[x].INDICATION
      endif
    endif
  else
    if (rpt_data2->order_qual[x].SPECINX > " ")
      if (rpt_data2->order_qual[x].comment > " ")
        set disp = concat(trim(rpt_data2->order_qual[x].SPECINX)," / ", trim(rpt_data2->order_qual[x].comment))
      else
        set disp = rpt_data2->order_qual[x].SPECINX
      endif
    else
      if (rpt_data2->order_qual[x].comment > " ")
        set disp = rpt_data2->order_qual[x].comment
      else
        set disp = ""
      endif
    endif
  endif
  if (disp > " ")
    if (rpt_data2->order_qual[x].recon_note > " ")
      set disp = concat(trim(disp,3)," / ",rpt_data2->order_qual[x].recon_note)
    endif
  else
   	set disp = rpt_data2->order_qual[x].recon_note
  endif
  set disp = REPLACE(disp, "<" , "&lt;" )
  set disp = REPLACE(disp, ">" , "&gt;" )
 
;	if (rpt_data2->order_qual[x].INDICATION > " ")
;	  set disp = rpt_data2->order_qual[x].INDICATION
;	endif
;	if (rpt_data2->order_qual[x].SPECINX > " ")
;		if (rpt_data2->order_qual[x].INDICATION  > " ")
;			set disp = concat(trim(disp,3),"; ",rpt_data2->order_qual[x].SPECINX)
;		else
;		  set disp = rpt_data2->order_qual[x].SPECINX
;		endif
;	endif
;	if (rpt_data2->order_qual[x].comment > " ")
;		if (disp > " ")
;			set disp = concat(trim(disp,3),"; ",rpt_data2->order_qual[x].comment)
;		else
;		  set disp = rpt_data2->order_qual[x].comment
;		endif
;	endif
	set sText = concat(sText,"<td width=235 valign=top", sStyleCenter,
									trim(disp,3),  csTableDefEnd)
	set disp = ""
	if (rpt_data2->order_qual[x].action = "new")
	  set disp = "<B>New</b>"
	elseif (rpt_data2->order_qual[x].action = "changes")
	  set disp = "<b>This is a CHANGE</b>"
	endif
	if (rpt_data2->order_qual[x].new_prescription = "Y")
		if (rpt_data2->order_qual[x].pharmacy > " ")
;		call echo(rpt_data2->order_qual[x].drug_name)
			if (disp > " ")
			  set disp = concat(disp,"<BR>")
			endif
		  set disp = concat(disp,"Routed to ",trim(rpt_data2->order_qual[x].pharmacy,3),"<BR>",
		  										trim(rpt_data2->order_qual[x].pharm_street,3),"<BR>",			;008
		  										trim(rpt_data2->order_qual[x].pharm_city_state_zip,3),"<BR>",	;008
		  										trim(rpt_data2->order_qual[x].pharm_phone,3))					;008
;008		  										trim(rpt_data->order_qual[x].pharm_street,3),"<BR>",
;008		  										trim(rpt_data->order_qual[x].pharm_city_state_zip,3),"<BR>",
;008		  										trim(rpt_data->order_qual[x].pharm_phone,3))
	  elseif (rpt_data2->order_qual[x].REQROUTINGTYPE = "Print Requisition")
;	  call echo("printer")
			if (disp > " ")
			  set disp = concat(disp,"<BR>")
			endif
	    set disp = concat(disp,char(32),"Routed to Printer")
	  elseif (rpt_data2->order_qual[x].REQROUTINGTYPE = "Do Not Route" and
	  					rpt_data2->order_qual[x].dontprintrxreason = "called to pharmacy (Rx)")
			if (disp > " ")
			  set disp = concat(disp,"<BR>")
			endif
	    set disp = concat(disp,char(32),char(32),char(32),char(32),char(32),char(32),char(32),char(32),
		  											"Called to pharmacy")
		endif
	endif
	set sText = concat(sText,"<td width=175 valign=top", sStyleCenter,
									trim(disp,3),  csTableDefEnd,"</TR>")
 endif
endfor
if (not_taking_flag = "Y")
  set sText = BUILD(sText, "<TR>",csTableDef1,                                                                  ;005
                        concat( "<b>*</B>  You have let us know that you are not taking this medication as ",   ;005
  						"listed.  Please talk with your primary care provider or the health care provider who prescribed the ",
  						"medication as soon as possible."), csTableDefEnd,"</TR>")                    ;005
 
endif
if (size(rpt_data2->order_qual,5) < 1)
  set sText = BUILD(sText, "<TR>",csTableDef1, "No Medications found", csTableDefEnd,"</TR>")
endif
set sText = concat(sText,"</TABLE><BR>")
 
set sText = concat(sText,"<b>Stop Taking the Following Medications:</b><BR><BR>")
for (x = 1 to size(rpt_data2->order_qual,5))
  if (rpt_data2->order_qual[x].action = "stop")
	  set sText = concat(sText, trim(rpt_data2->order_qual[x].drug_name,3)," ",rpt_data2->order_qual[x].ordered_as,"<BR>")
	endif
endfor
 
set time_string =  concat(format(curdate, "mm-dd-yy;;d")," ",format(curtime, "HH:MM;;mr"))
set sText = concat(sText,"<BR>", "Medication list as of ", time_string, "<BR>")
 
elseif (not show_data in ( "discharge","active","encounter"))
  if (show_data = "pending")
	  set sText = concat(csBegin,csSpan,"<BR>", "Discharge Medication Reconciliation is in 'Pending Complete' status.", csSpanEnd)
;  elseif (show_data = "encounter")
;	  set sText = concat(csBegin,csSpan,
;	  								"<BR><B>*******************************************************************************************",
;	  								"<BR>*** Encounter Med List is not viewable here on this type of encounter ***",
;	  								"<BR>+ To see the patient's current medication list, click Current Med List from the dropdown.",
;	  								"<BR>+ To see the medications from this specific encounter, access Notes for this encounter date.",
;	  								"<BR>*******************************************************************************************</B>",
;	  								 csSpanEnd)
;  elseif (show_data = "active")
;    set sText = concat(csBegin, csSpan,
;    								"<BR><B>******************************************************************************************",
;	  								"<BR>Encounter Med List is not viewable here because this patient has more than one active encounter",
;	  								"<BR>+ To see the patient's current medication list, click Current Med List from the dropdown.",
;	  								"<BR>+ To see the medications from this specific encounter, access Notes for this encounter date.",
;	  								"<BR>*******************************************************************************************</B>",  csSpanEnd)
;  elseif (show_data = "discharge")
;    set sText = concat(csBegin, csSpan,
;    								"<BR><B>******************************************************************************************",
;	  								"<BR>*** Encounter Med List is not viewable here on discharged encounters ***",
;	  								"<BR>+ To see the patient's current medication list, click Current Med List from the dropdown.",
;	  								"<BR>+ To see the medications from this specific encounter, access Notes for this encounter date.",
;	  								"<BR>******************************************************************************************</B>", csSpanEnd)
    endif
  elseif (show_data in ( "discharge","active","encounter"))
;  ********
;   The following is the previous version of the medication token it is displayed when the encounter is discharged has multiple
;	active encounters or is of a certain encounter type
; *********
 
	declare dOrderedCd = f8 with NOCONSTANT(0.0)
	;declare sText = vc
	declare sOrderName = vc
	declare sRoute = vc
	declare sFreq = vc
	declare sStrengthDose = vc
	declare sStrengthDoseUnit = vc
	declare sVolumeDose = vc
	declare sVolumeDoseUnit = vc
	declare sFreeTextDose = vc
	declare sDuration = vc
	declare sDurationUnit = vc
	declare sPrnInstructions = vc
	declare sPrnReason = vc
	declare freqPRN = vc
	declare sSpecialInstructions = vc
	declare sRefills = vc
	declare sprnspec = vc
	declare ordcmt = vc
	declare sIndications = vc
	declare recon_note = vc			;006
	declare ldose = vc
	declare udose = vc
	declare l_udose = vc
	declare lunit = vc
 
	declare nRecorded = i4 with CONSTANT(2)
	declare nOwnMeds = i4 with CONSTANT(3)
	declare nNormal0 = i4 with CONSTANT(0)
	declare nNormal1 = i4 with CONSTANT(1)
	declare ord_comment_cd      = f8 with public, noconstant(0.0)
;	declare hard_stop_cd = f8 with public, constant(uar_get_code_by("MEANING",4009,"DRSTOP"))		;002
;	declare physician_stop_cd = f8 with public, constant(uar_get_code_by("MEANING",4009,"HARD"))	;002
;	declare not_taking_cd = f8 with public, constant(uar_get_code_by("MEANING",30254,"NOTTAKING"))	;004
;	declare not_as_prescribed_cd = f8 with public, constant(uar_get_code_by("MEANING",30254,"TAKINGNOTRX"))	;004
 
	declare nRoute = i4 with CONSTANT(2050)
	declare nFreq = i4 with CONSTANT(2011)
	declare nStrengthDose = i4 with CONSTANT(2056)
	declare nStrengthDoseUnit = i4 with CONSTANT(2057)
	declare nVolumeDose = i4 with CONSTANT(2058)
	declare nVolumeDoseUnit = i4 with CONSTANT(2059)
	declare nFreeTextDose = i4 with CONSTANT(2063)
	declare nDuration = i4 with CONSTANT(2061)
	declare nDurationUnit = i4 with CONSTANT(2062)
	declare nPRN = i4 with CONSTANT(2101)
	declare nPRNReason = i4 with CONSTANT(142)
	declare nSpecialInstructs = i4 with CONSTANT(1103)
	declare nRefills = i4 with CONSTANT(67)
 
	declare nActSeq = i4 with NOCONSTANT(0)
	declare bOdFlag = i1 with NOCONSTANT(0)
 
	declare nMedCount = i4 with NOCONSTANT(0)
	declare populate = i2 with NOCONSTANT(0)
 
;	declare not_taking_flag = c1			;004
;	set not_taking_flag = "N"				;004
 
	/**************************************************************
	; DVDev Start Coding
	**************************************************************/
 
	set dOrderedCd = UAR_GET_CODE_BY("MEANING", 6004, "ORDERED")
	set ord_comment_cd = UAR_GET_CODE_BY("MEANING", 14, "ORD COMMENT")
;	declare sStyleCenter = vc
;	with constant(" style='text-align: center;font-size:8.0pt;font-family:Tahoma,sans-serif;font-weight:bold;'>")
 
	;set sText = BUILD(csBegin, csParagraph,csTable)
	set sText = BUILD(csBegin, "<TABLE border ='1' cellpadding=2>")   ;csTable)
	set sText = build(sText,"<TR>","<td width=150 valign=top", sStyleCenter,
									"<b>Medication/Strength</b>", csTableDefEnd)
	set sText = build(sText,"<td width=90 valign=top", sStyleCenter,
									"<b>Dose</b>",  csTableDefEnd)
	set sText = build(sText,"<td width=90 valign=top", sStyleCenter,
									"<b>Route</b>", csTableDefEnd)
	set sText = build(sText,"<td width=90 valign=top", sStyleCenter,
									"<b>Frequency</b>", csTableDefEnd)
	set sText = build(sText,"<td width=290 valign=top", sStyleCenter,
						"<b>Indications/Special Instructions/Comments/Notes</b>",  csTableDefEnd, "</TR>")			;006
 
 
 
	select  into "nl:"
	o.order_id ,
	od.oe_field_id,
	oc.action_sequence
	from orders o,
	     order_compliance_detail ocd,	;004
	     dummyt d,   					;003
	     order_detail od ,
 
	     order_comment oc,
	     long_text lt,
	     order_recon_detail ord,  		;006
	     dummyt d1   									;006
	      ,dummyt d2									;007
 
 
	plan o
	    where o.person_id = person_id
	    and o.order_status_cd+0 = dOrderedCd
	    and o.catalog_type_cd = 2516								;003
	    and o.active_ind = 1
	    and o.orig_ord_as_flag in (nRecorded,nOwnMeds,nNormal1)		;003
 
	join oc
	    where oc.order_id = outerjoin(o.order_id)
	    and oc.comment_type_cd = outerjoin(ord_comment_cd)
 
	join lt
	    where lt.long_text_id = outerjoin(oc.long_text_id)
	    and lt.active_ind = outerjoin(1)
 
	join d2
	join ocd																																					;007
	where ocd.order_nbr = o.order_id																								  ;007
	  and ocd.compliance_capture_dt_tm = (select max(ocd2.compliance_capture_dt_tm)		;007
	  										from order_compliance_detail ocd2														;007
	  										  where ocd2.order_nbr = ocd.order_nbr)											;007
 
	join d1																				;006
	join ord																			;006
	where ord.order_nbr = o.order_id													;006
	  and exists (select ore.order_recon_id from order_recon ore 						;006
	  				where ore.order_recon_id = ord.order_recon_id						;006
	  				  and ore.encntr_id = request->encntr_id)							;006
 
	join d																				;003
	join od
	    where od.order_id = o.order_id
	      and od.oe_field_meaning_id in (2050,2011,2062,2061,2055,2101,142,1103,67      ;003
											,15,2056,2058,2063,2057,2059)				;003
 
	    order o.order_id desc,
	    ;003  oeff.group_seq, oeff.field_seq,
	    od.oe_field_id, od.action_sequence desc
	    ,ocd.compliance_capture_dt_tm desc   		;004
	 		,ord.updt_dt_tm desc										;006
 
	    head od.order_id
	        populate = 1
	        nMedCount = nMedCount + 1
	        sRoute = ""
	        sFreq = ""
	        sStrengthDose = ""
	        sStrengthDoseUnit = ""
	        sVolumeDose = ""
	        sVolumeDoseUnit = ""
	        sFreeTextDose = ""
	        sDuration = ""
	        sDurationUnit = ""
	        sPrnInstructions = ""
	        sPrnReason = ""
	        freqPRN = ""
	        sSpecialInstructions = ""
	        sRefills = ""
	        sprnspec = ""
	        ordcmt = ""
	        sIndications = ""
	        ldose = ""
	        lunit = ""
	        udose = ""
	        l_udose = ""
	        if (ocd.compliance_status_cd in (not_as_prescribed_cd,not_taking_cd))			;004
	          o_mnem = concat("<B>*</b>",trim(o.order_mnemonic))							;004
	          not_taking_flag = "Y"															;004
	        else																			;004
	          o_mnem = trim(o.order_mnemonic)
	        endif																			;004
	        o_as_mnem = trim(o.ordered_as_mnemonic)
	 		hard_stop_flag = 0										;002
	        sText = BUILD(sText, "<TR>","<td width=150 valign=top>",csTableDef,o_mnem,"&nbsp;","(", o_as_mnem, ")",
	                            csTableDefEnd)
;	        call echo(BUILD("MNEMONIC:",o_MNEM))
	 				recon_note = ord.recon_note_txt						;006
 
	    head od.oe_field_id
	        nActSeq = od.action_sequence
	        bOdFlag = TRUE
 
	    head od.action_sequence
	        if(nActSeq != od.action_sequence)
	            bOdFlag = FALSE
	        endif
 
	    detail
 
	        if(bOdFlag = TRUE)
	            if(od.oe_field_meaning_id = nRoute)
	              sRoute = uar_get_code_description(od.oe_field_value)   ;003
	            elseif(od.oe_field_meaning_id = nFreq)
	            	sFreq = uar_get_code_description(od.oe_field_value)   ;003
	 			elseif(od.oe_field_meaning = "DURATIONUNIT")				;002
	 			  sDurationUnit = uar_get_code_description(od.oe_field_value)   	;003
	            elseif(od.oe_field_meaning = "DURATION")				;002
	            	sDuration = od.oe_field_display_value				;002
	            elseif(od.oe_field_meaning = "STOPTYPE")				;002
	            	if (od.oe_field_value in (hard_stop_cd,physician_stop_cd))	;002
	             		hard_stop_flag = 1										;002
	             	endif														;002
	            elseif(od.oe_field_meaning_id = nPRN)
	                sPrnReason = trim(od.oe_field_display_value)
	            elseif(od.oe_field_meaning_id = nPRNReason)
	                sPrnReason = trim(od.oe_field_display_value)
	            elseif(od.oe_field_meaning_id = nSpecialInstructs)
	                sSpecialInstructions = trim(od.oe_field_display_value)
 
	            elseif(od.oe_field_meaning_id = nRefills)
	                sRefills = trim(od.oe_field_display_value)
	            elseif (od.oe_field_meaning_id = 15)
	                sIndications = trim(od.oe_field_display_value)
	            endif
 
	     		case (od.oe_field_meaning)
 
	        		of "STRENGTHDOSE":      sStrengthDose           = od.oe_field_display_value
	        		of "VOLUMEDOSE":        sVolumeDose             = od.oe_field_display_value
	        		of "FREETXTDOSE":       sFreeTextDose           = od.oe_field_display_value
	        		of "STRENGTHDOSEUNIT":  sStrengthDoseUnit       = od.oe_field_display_value
	        		of "VOLUMEDOSEUNIT":    sVolumeDoseUnit         = od.oe_field_display_value
	    		endcase
	 		endif
	    foot od.order_id
	    	if (sStrengthDose > " ")
	        	ldose = sStrengthDose
	    	elseif(sVolumeDose > " ")
	        	ldose = sVolumeDose
	    	elseif(sFreeTextDose > " ")
	        	ldose = sFreeTextDose
	        	lunit= " "
	    	endif
	 		if (sStrengthDoseUnit > " ")
	        	lunit = sStrengthDoseUnit
	    	elseif(sVolumeDoseUnit > " ")
	        	lunit = sVolumeDoseUnit
	    	endif
 
	        if (o.order_comment_ind > 0)
	               ordcmt = trim(lt.long_text)
	        else
	               ordcmt = ""
	        endif
 
	        if (trim(sIndications) > " ")
	          if (trim(sSpecialInstructions) > " ")
	            if(trim(ordcmt) > " ")
	              sprnspec = concat(trim(sIndications)," / ",trim(sSpecialInstructions)," / ", trim(ordcmt))
	            else
	              sprnspec = concat(trim(sIndications)," / ",trim(sSpecialInstructions))
	            endif
	          else
	            if (trim(ordcmt) > " ")
	               sprnspec = concat(trim(sIndications)," / ", trim(ordcmt))
	            else
	               sprnspec = trim(sIndications)
	            endif
	          endif
	        else
	          if (trim(sSpecialInstructions) > " ")
	            if (trim(ordcmt) > " ")
	               sprnspec = concat(trim(sSpecialInstructions)," / ", trim(ordcmt))
	            else
	               sprnspec = trim(sSpecialInstructions)
	            endif
	          else
	            if (trim(ordcmt) > " ")
	               sprnspec = trim(ordcmt)
	            else
	               sprnspec = ""
	            endif
	          endif
	        endif
	        ;start 006
	        if (sprnspec > " ")
	        	if (recon_note > " ")
	        	  sprnspec = concat(trim(sprnspec)," / ",trim(recon_note))
	        	endif
	        else
	          if (recon_note > " ")
	        	  sprnspec = recon_note
	        	endif
	        endif
	        ;end 006
	 SPRNSPEC = REPLACE(SPRNSPEC, "<" , "&lt;" )
	 SPRNSPEC = REPLACE(SPRNSPEC, ">" , "&gt;" )
	        if(ldose > " ")
	          l_udose = concat (ldose," ", lunit)
	          sText = BUILD(sText, "<td width=90 valign=top>",csTableDef, l_udose,  csTableDefEnd)
	        else
	          sText = BUILD(sText, "<td width=90 valign=top>",csTableDef, csTableDefEnd)
	        endif
 
	        if(trim(sRoute) > " ")
	            sText = BUILD(sText, "<td width=90 valign=top>",csTableDef, sRoute, csTableDefEnd);sRoute
	        else
	            sText = BUILD(sText, "<td width=90 valign=top>",csTableDef, csTableDefEnd)
	        endif
	        if(trim(sFreq) > " ")
	          if (trim(sPrnReason) > " ")
	            freqPRN = build2(sFreq, " as needed for ", sPrnReason)
	            sText = BUILD(sText, "<td width=90 valign=top>",csTableDef, freqPRN, csTableDefEnd)
	          else
	            freqPRN = sFreq
	            if ((sduration > " ") and (sdurationunit > " ") and (hard_stop_flag = 1))  	;002
	            	freqprn = concat(sfreq," for ", sduration," ",sdurationunit )			;002
				endif																		;002
	            sText = BUILD(sText, "<td width=90 valign=top>",csTableDef, freqPRN, csTableDefEnd)
	          endif
	        else
	          if (trim(sPrnReason) > " ")
	            freqPRN = sPrnReason
	            sText = BUILD(sText, "<td width=90 valign=top>",csTableDef, freqPRN, csTableDefEnd)
	          else
	            sText = BUILD(sText, "<td width=90 valign=top>",csTableDef,  csTableDefEnd)
	          endif
	        endif
 
 
	        if (trim(sprnspec) > " ")
	            sText = BUILD(sText,"<td width=290 valign=top>",csTableDef, sprnspec, csTableDefEnd)
	        else
	            sText = BUILD(sText, "<td width=290 valign=top>",csTableDef,  csTableDefEnd) ;000
	        endif
 
	        sText = BUILD(sText, "</TR>")
 
	with nocounter
	,outerjoin = d2			;007
	,dontcare = ocd			;007
	,outerjoin = d1			;006
	,dontcare = ord			;006
	,outerjoin = d			;003
 
	if (not_taking_flag = "Y")
	  set sText = BUILD(sText, "<TR>",csTableDef1,                                                                  ;005
	                        concat( "<b>*</B>  You have let us know that you are not taking this medication as ",   ;005
	  						"listed.  Please talk with your primary care provider or the health care provider who prescribed the ",
	  						"medication as soon as possible."), csTableDefEnd,"</TR>")                    ;005
 
	endif
 
;	if(populate = 0)
;	  set sText = BUILD(sText, "<TR>",csTableDef1, "No Medications found", csTableDefEnd)
;	endif
 set sText = concat(sText,"</TABLE>")
 
 
endif
set sText = concat(sText,csEnd)
 
set reply->text = sText
 call echo(reply->text)
 
set reply->format = 1 ; this means HTML so the caller will know how to handle
 
call echo(format(sysdate,"mm/dd/yy  hh:mm:ss;;d"))
 
;set MOD = "000 Akcia 03/26/2013"
 
end go
