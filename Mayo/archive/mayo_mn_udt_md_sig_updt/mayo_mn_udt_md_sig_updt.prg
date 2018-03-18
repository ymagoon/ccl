/*****************************************************************************
 
        Source file name:       mayo_mn_udt_meds_new.PRG
        Object name:            mayo_mn_udt_meds_new
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
drop program mayo_mn_udt_md_sig_updt:dba go
create program mayo_mn_udt_md_sig_updt:dba
 
%i cclsource:mayo_mn_html.inc
declare sText = vc
 
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
 
 
 
declare prsnl_sig=vc
 
 
select into "nl:"
from
encounter e
where e.encntr_id =  request->encntr_id
detail
person_id = e.person_id
encntr_id = e.encntr_id
reg_dt_tm = e.reg_dt_tm
with nocounter
 
 
 
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
 
 
set time_string =  concat(format(disch_recon_dt_tm, "mm-dd-yy hh:mm;;d"))  ;," ",format(curtime, "HH:MM;;mr"))
set sText = csBegin
set sText = concat(sText, "<span style='font-size:12.0pt;font-family:Tahoma,sans-serif'>"
					,"Medication list for discharge reconciliation updated on ", time_string, "<BR>")
 
;set sText = concat(sText, prsnl_sig, "</span><BR>")
 
set sText = concat(sText,csEnd)
 
call echo(sText)
set reply->text = sText
 
set reply->format = 1 ; this means HTML so the caller will know how to handle
 
 
#exit_script
;call echorecord(rpt_data2)
free set rpt_data
;free set ord_rec
end go
 
 
 
