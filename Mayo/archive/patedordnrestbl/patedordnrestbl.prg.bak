;****************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *                                                                      *
;    *Mod    Date     	Engineer              Comment                       *
;    *---   ------------ -------------------- ------------------------------*
;     000   12/27/11    Akcia - SE			  New program					*
;****************************************************************************
drop program patedordnrestbl:dba go
create program patedordnrestbl:dba
 
%i cclsource:mayo_mn_html.inc
declare sSpanOpen = vc with CONSTANT("<tr><td width=150 valign=top><span style=font-family:arial font-size:12.0pt>")
declare sSpanClose = vc with CONSTANT("</span></td></tr>")
declare sSpanHOpen = vc with CONSTANT("<td width=150 valign=top><span style=font-family:arial font-size:12.0pt>")
declare sSpanHClose = vc with CONSTANT("</span></td>")
declare sText = vc
declare ed_cd = f8 with protect, constant(uar_get_code_by("MEANING", 6000, "ED"))
declare lab_cd = f8 with protect, constant(uar_get_code_by("MEANING", 6000, "GENERAL LAB"))
declare rad_cd = f8 with protect, constant(uar_get_code_by("MEANING", 6000, "RADIOLOGY"))
 
declare sStyleCenter = vc
with constant(" style='text-align: center;font-size:8.0pt;font-family:Tahoma,sans-serif;font-weight:bold;'>")
 
set sText = BUILD(csBegin, "<TABLE border ='1' cellpadding=2")
set sText = build(sText,"<TR>","<td width=200", sStyleCenter,
								"<b>Order</b>", csSpanEnd, csTableDefEnd)
set sText = build(sText,"<td width=75", sStyleCenter,
								"<b>Status</b>", csSpanEnd, csTableDefEnd,"</TR>")
 
select  into "nl:"
from orders o
 
 plan o
where o.encntr_id = request->encntr_id
  and o.active_ind = 1
  and o.catalog_type_cd in (ed_cd,rad_cd,lab_cd)
  and (o.interest_dt_tm >= sysdate  or  o.interest_dt_tm = null)
  and o.orig_ord_as_flag = 0
 
;join p
;where p.person_id = o.last_update_provider_id
;  and p.active_ind=1
;  and p.beg_effective_dt_tm <= sysdate
; and p.end_effective_dt_tm >= sysdate
 
 
detail
sText = BUILD(sText, "<TR>","<td width=200>",csTableDef, trim(o.hna_order_mnemonic,3), csSpanEnd, csTableDefEnd)
sText = BUILD(sText, "<td width=75>",csTableDef, trim(uar_get_code_display(o.order_status_cd),3), csSpanEnd, csTableDefEnd,"</TR>")
 
 with  nocounter
set sText = BUILD(sText,csTableEnd, csEnd)
 
set reply->text = sText
 
set reply->format = 1 ; this means HTML so the caller will know how to handle
;call echo(reply->text)
set MOD = "000 Akcia 12/27/2011"
end go
 
