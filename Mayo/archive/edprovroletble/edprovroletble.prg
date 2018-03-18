;****************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *                                                                      *
;    *Mod    Date     	Engineer              Comment                       *
;    *---   ------------ -------------------- ------------------------------*
;     000   12/27/11    Akcia - SE			  New program					*
;****************************************************************************
drop program edprovroletble:dba go
create program edprovroletble:dba
 
%i cclsource:mayo_mn_html.inc
declare sSpanOpen = vc with CONSTANT("<tr><td width=150 valign=top><span style=font-family:arial font-size:12.0pt>")
declare sSpanClose = vc with CONSTANT("</span></td></tr>")
declare sSpanHOpen = vc with CONSTANT("<td width=150 valign=top><span style=font-family:arial font-size:12.0pt>")
declare sSpanHClose = vc with CONSTANT("</span></td>")
declare sText = vc
 
declare sStyleCenter = vc
with constant(" style='text-align: center;font-size:8.0pt;font-family:Tahoma,sans-serif;font-weight:bold;'>")
 
set sText = BUILD(csBegin, "<TABLE border ='1' cellpadding=2")
set sText = build(sText,"<TR>","<td width=150", sStyleCenter,
								"<b>Provider</b>", csSpanEnd, csTableDefEnd)
set sText = build(sText,"<td width=100", sStyleCenter,
								"<b>Role</b>", csSpanEnd, csTableDefEnd)
;set sText = build(sText,"<TR>","<td width=150", sStyleCenter,
;								request->tracking_id, csSpanEnd, csTableDefEnd)
;set sText = build(sText,"<td width=100", sStyleCenter,
;								request->tracking_group_cd, csSpanEnd, csTableDefEnd)
;
set sText = build(sText,"<td width=75", sStyleCenter,
								"<b>Provider Contact Time</b>", csSpanEnd, csTableDefEnd,"</TR>")
 
select  into "nl:"
from tracking_prv_reln  tpr,
tracking_checkin tc,
tracking_prsnl  tp,
track_reference  tr,
prsnl  p
 
 plan tpr
where tpr.tracking_id = request->tracking_id
 
join tc
where tc.tracking_id = tpr.tracking_id
 
 join tp
where tp.person_id = tpr.tracking_provider_id
  and tp.tracking_group_cd = tc.tracking_group_cd  ;request->tracking_group_cd
 
 join tr
where tr.tracking_ref_id = tp.tracking_prsnl_task_id
 
 join p
where p.person_id = tp.person_id
 
order by cnvtdatetime(tpr.assign_dt_tm)
 
detail
;if (p.physician_ind = 1)
  sText = BUILD(sText, "<TR>","<td width=150>",csTableDef, trim(p.name_full_formatted,3), csSpanEnd, csTableDefEnd)
;else
;  sText = BUILD(sText, "<TR>","<td width=150>",csTableDef, trim(p.name_first,3), csSpanEnd, csTableDefEnd)
;endif
sText = BUILD(sText, "<td width=100>",csTableDef, trim(tr.description,3), csSpanEnd, csTableDefEnd)
 
if (tpr.assign_dt_tm < sysdate and tpr.assign_dt_tm != null)
  sText = BUILD(sText, "<td width=75>",csTableDef, format(tpr.assign_dt_tm,"mm/dd/yy hh:MM;;d"), csSpanEnd, csTableDefEnd,"</TR>")
else
  sText = BUILD(sText, "<td width=75>",csTableDef, csSpanEnd, csTableDefEnd,"</TR>")
endif
 
 with  nocounter ;, check , memsort
 
 set sText = BUILD(sText,csTableEnd, csEnd)
 
set reply->text = sText
 
set reply->format = 1 ; this means HTML so the caller will know how to handle
call echo(reply->text)
set MOD = "000 Akcia 12/27/2011"
end go
