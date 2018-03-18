/*****************************************************************************
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
      ***********************************************************************/
 
/*****************************************************************************
 
        Source file name:       mayo_mn_fn_udt_appointments.PRG
        Object name:            mayo_mn_fn_udt_appointments
        Request #:
 
        Product:                SC custom discern programming
        Product Team:           FirstNet
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:
 
        Tables read:			sch_appt, sch_event_detail
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
;     001   05/06/09     nt5993               Schedule appt weren't being   *
;                                             pulled in.                    *
;     002   02/5/10		 Akcia				  reformating table layout		*
;											  fix how provider is being pulled*
;     003   03/28/13	 Akcia-SE			  change to consistently get provider
;												and only pull for certain beharivoral health locations
;****************************************************************************
 
drop program mayo_mn_fn_udt_appointments:dba go
create program mayo_mn_fn_udt_appointments:dba
 
%i cclsource:mayo_mn_html.inc
 
/****************************************************************************
*       Declare Variables                                                   *
*****************************************************************************/
 
declare confirmCd   = f8 with NOCONSTANT(0.0)
declare scheduledCd = f8 with NOCONSTANT(0.0)
 
declare sStyleCenter = vc																						;002
with constant(" style='text-align: center;font-size:8.0pt;font-family:Tahoma,sans-serif;font-weight:bold;'>")	;002
declare sSpanOpen = vc with CONSTANT("<tr><td width=150 valign=top><span style=font-family:arial font-size:12.0pt>")
declare sSpanClose = vc with CONSTANT("</span></td></tr>")
declare sSpanHOpen = vc with CONSTANT("<td width=150 valign=top><span style=font-family:arial font-size:12.0pt>")
declare sSpanHClose = vc with CONSTANT("</span></td>")
declare sText = vc
declare populate = i2 with NOCONSTANT(0)
 
/****************************************************************************
*       Initialize Variables                                                *
*****************************************************************************/
set confirmCd = UAR_GET_CODE_BY("MEANING", 14233, "CONFIRMED")
set scheduledCd = UAR_GET_CODE_BY("MEANING", 14233, "SCHEDULED")
declare eu_behav_cd = f8 with CONSTANT(UAR_GET_CODE_BY("DISPLAYKEY", 220, "EUMBBEHAVHLTH"))  ;003
declare me_behav_cd = f8 with CONSTANT(UAR_GET_CODE_BY("DISPLAYKEY", 220, "MEBHBEHAVHLTH"))	;003
set blank = fillstring(12," ")
 
 
;set sText = BUILD(csBegin, csParagraph,csTable)
;002 set sText = BUILD(csBegin, csTable)
set sText = BUILD(csBegin, "<TABLE border ='1' cellpadding=2")   ;csTable)  ;002
set sText = build(sText,"<TR>","<td width=75", sStyleCenter, ;002
								 "<b>Date</b>", csSpanEnd, csTableDefEnd)
set sText = build(sText,"<td width=75", sStyleCenter, ;002
								"<b>Time</b>", csSpanEnd, csTableDefEnd)
set sText = build(sText,"<td width=150", sStyleCenter, ;002
								"<b>Location</b>", csSpanEnd, csTableDefEnd)
set sText = build(sText,"<td width=200", sStyleCenter, ;002
								"<b>Reason</b>", csSpanEnd, csTableDefEnd)
set sText = build(sText,"<td width=210", sStyleCenter, ;002
								"<b>Provider</b>", csSpanEnd, csTableDefEnd)
 
select distinct into "nl:"
 
from
    sch_appt sa
    , sch_event_detail sed
;002    , sch_event_detail sed2
;003    ,sch_appt sa1		;002
	,sch_event_disp disp    ;003
 
plan sa
 where sa.person_id = request->person_id
;001   and sa.sch_state_cd in (confirmCd)
   and sa.sch_state_cd in (confirmCd,scheduledCd)  ;001 included scheduled appts
   and sa.active_ind = 1
   and sa.beg_dt_tm > sysdate		;002
   and sa.beg_effective_dt_tm <= sysdate
   and sa.end_effective_dt_tm >  sysdate
 
join sed
 where sed.sch_event_id = outerjoin(sa.sch_event_id)
   and sed.active_ind = outerjoin(1)
   and sed.beg_effective_dt_tm <= outerjoin(sysdate)
   and sed.end_effective_dt_tm >  outerjoin(sysdate)
   and sed.version_dt_tm > outerjoin(sysdate)					;003
   and sed.oe_field_meaning = outerjoin("REASONFOREXAM")
 
join disp														;003
 where disp.sch_event_id = outerjoin(sa.sch_event_id)			;003
   and disp.active_ind = outerjoin(1)							;003
   and disp.end_effective_dt_tm > outerjoin(sysdate)			;003
   and disp.schedule_id = outerjoin(sa.schedule_id)				;003
   and disp.disp_field_meaning = outerjoin("PRIMARYRES")		;003
 
;002  join sed2
;002  where sed2.sch_event_id = outerjoin(sa.sch_event_id)
;002   and sed2.active_ind = outerjoin(1)
;002   and sed2.beg_effective_dt_tm <= outerjoin(sysdate)
;002   and sed2.end_effective_dt_tm >  outerjoin(sysdate)
;002   and sed2.oe_field_meaning = outerjoin("SCHORDPHYS")
;003join sa1														;002
;003 where sa1.sch_event_id = outerjoin(sed.sch_event_id)			;002
;003   and sa1.role_description = outerjoin("Clinician")			;002
;003   and sa1.role_meaning = outerjoin("RESOURCE")					;002
;003   and sa1.resource_cd > outerjoin(0)							;002
;003   and sa1.active_ind = outerjoin(1)							;002
;003   and sa1.beg_effective_dt_tm <= outerjoin(sysdate)			;002
;003   and sa1.end_effective_dt_tm >  outerjoin(sysdate)			;002
 
order by sa.beg_dt_tm
detail
      populate = 1
 
      call echo(confirmCd)
      call echo(scheduledCd)
      if(sa.beg_dt_tm > 0)
        bdate = format(sa.beg_dt_tm,"mm/dd/yyyy;;d")
        sText = BUILD(sText, "<TR>","<td width=75>",csTableDef, bdate, csSpanEnd, csTableDefEnd)
      else
        sText = BUILD(sText, "<TR>","<td width=75>",csTableDef, csSpanEnd, csTableDefEnd)
      endif
 
      if(sa.beg_dt_tm > 0)
        btime = format(sa.beg_dt_tm,"hh:mm;;q")
        sText = BUILD(sText, "<td width=75>",csTableDef, btime, csSpanEnd, csTableDefEnd)
      else
        sText = BUILD(sText,"<td width=75>", csTableDef, csSpanEnd, csTableDefEnd)
      endif
 
      if(sa.appt_location_cd > 0)
        loc = substring(1,30,uar_get_code_display(sa.appt_location_cd))
        sText = BUILD(sText,"<td width=150>", csTableDef, loc, csSpanEnd, csTableDefEnd)
      else
        sText = BUILD(sText,"<td width=150>", csTableDef, csSpanEnd, csTableDefEnd)
      endif
 
      if(sed.oe_field_meaning_id > 0.0)
        reason = sed.oe_field_display_value
        sText = BUILD(sText,"<td width=200>", csTableDef, reason, csSpanEnd, csTableDefEnd)
      else
        sText = BUILD(sText,"<td width=200>", csTableDef, csSpanEnd, csTableDefEnd)
      endif
 
;002      if(sed2.oe_field_meaning_id > 0)
;002        provider = sed2.oe_field_display_value
;003      if(sa1.sch_event_id > 0)														;002
;003        provider = substring(1,30,uar_get_code_display(sa1.resource_cd))			;002
      if(disp.sch_event_id > 0 and not sa.appt_location_cd in(eu_behav_cd,me_behav_cd))			;003
        provider = substring(1,30,disp.disp_display)			;003
        sText = BUILD(sText, "<td width=210>",csTableDef, provider, csSpanEnd, csTableDefEnd)
      else
        sText = BUILD(sText, "<td width=210>",csTableDef, csSpanEnd, csTableDefEnd)
      endif
 
      sText = BUILD(sText, "</TR>")
with nocounter
if(populate = 0)
  set sText = BUILD(sText, "<TR>",csTableDef1, "No Appointments found",csSpanEnd, csTableDefEnd)
endif
 
;;set sText = BUILD(sText,"</TR>",csTableEnd, csParagraphEnd, csEnd)
;set sText = BUILD(sText,csTableEnd, csParagraphEnd, csEnd)
set sText = BUILD(sText,csTableEnd, csEnd)
 
set reply->text = sText
 
set reply->format = 1 ; this means HTML so the caller will know how to handle
call echo(reply->text) ;FE Added so that I can get the html piece and see what it looks like
set MOD = "002 Akcia 01/26/2010"
end go
 
