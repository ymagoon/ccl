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
 
        Source file name:       mayo_mn_fn_udt_problems.PRG
        Object name:            mayo_mn_fn_udt_problems
        Request #:
 
        Product:                SC custom discern programming
        Product Team:           FirstNet
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:
 
        Tables read:			nomenclature, encounter, problem
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
;                                             of KIA_PROBLEM_LIST_GENSPREAD *
;     001   02/05/10	 Akcia				  reformat output;remove check on end_effective_dt_tm
;												on the nomenclature table	*
;     002   11/01/11	 Akcia				  remove check of active_ind and beg_effective_dt_tm
;												on the nomenclature table
;     003   01/23/12	 Akcia				  remove check Resolved and Inactive problems
;     004   04/12/12     Akcia				  change display to annotated display
;     005   04/24/12	 Akcia				  add code to handle multiple comments
;****************************************************************************
 
drop program mayo_mn_fn_udt_problems:dba go
create program mayo_mn_fn_udt_problems:dba
 
%i cclsource:mayo_mn_html.inc
 
/****************************************************************************
*       Declare Variables                                                   *
*****************************************************************************/
 
;003 declare RESOLVED       = f8 with public, noconstant(0.0)
declare ACTIVE         = f8 with public, noconstant(0.0)
;003 declare INACTIVE       = f8 with public, noconstant(0.0)
 
 
declare sSpanOpen = vc with CONSTANT("<tr><td width=150 valign=top><span style=font-family:arial font-size:12.0pt>")
declare sSpanClose = vc with CONSTANT("</span></td></tr>")
declare sSpanHOpen = vc with CONSTANT("<td width=150 valign=top><span style=font-family:arial font-size:12.0pt>")
declare sSpanHClose = vc with CONSTANT("</span></td>")
declare sText = vc
declare populate = i2 with NOCONSTANT(0)
declare comment_text = vc				;005
 
/****************************************************************************
*       Initialize Variables                                                *
*****************************************************************************/
;003 set RESOLVED = uar_get_code_by("MEANING",12030,"RESOLVED")
set ACTIVE    = uar_get_code_by("MEANING",12030,"ACTIVE")
;003 set INACTIVE  = uar_get_code_by("MEANING",12030,"INACTIVE")
declare sStyleCenter = vc																						;001
with constant(" style='text-align: center;font-size:8.0pt;font-family:Tahoma,sans-serif;font-weight:bold;'>")	;001
 
;set sText = BUILD(csBegin, csParagraph,csTable)
;001 set sText = BUILD(csBegin, csTable)
set sText = BUILD(csBegin, "<TABLE border ='1' cellpadding=2")   ;csTable)  ;001
set sText = build(sText,"<TR>","<td width=200", sStyleCenter, ;001
								"<b>Problem</b>", csSpanEnd, csTableDefEnd)
set sText = build(sText,"<td width=75", sStyleCenter, ;001
								"<b>Status</b>", csSpanEnd, csTableDefEnd)
set sText = build(sText,"<td width=75", sStyleCenter, ;001
								"<b>Onset</b>", csSpanEnd, csTableDefEnd)
set sText = build(sText,"<td width=360", sStyleCenter, ;001
								"<b>Comments</b>", csSpanEnd, csTableDefEnd)
 
 
select into "nl:"
    status = substring(1,10,uar_get_code_display(p.life_cycle_status_cd))
from
    problem p
    , nomenclature nm
    , problem_comment pc
 
plan p
  where p.person_id = request->person_id
;003   and  p.life_cycle_status_cd IN(RESOLVED,ACTIVE,INACTIVE)
   and  p.life_cycle_status_cd = ACTIVE                         ;003
   and (p.active_ind = 1
   and  p.beg_effective_dt_tm <= cnvtdatetime(curdate, curtime3)
   and  p.end_effective_dt_tm > cnvtdatetime(curdate, curtime3))
join nm
  where nm.nomenclature_id = outerjoin(p.nomenclature_id)
;002   and nm.active_ind = outerjoin(1)
;002   and  nm.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate, curtime3))
;001   and  nm.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate, curtime3)))
join pc
  where pc.problem_id = outerjoin(p.problem_id)
    and pc.active_ind = outerjoin(1)
    and pc.beg_effective_dt_tm <= outerjoin(sysdate)
    and pc.end_effective_dt_tm >  outerjoin(sysdate)
 
order by
	 status
	 ,p.problem_id 				;005
 
head p.problem_id				;005
comment_text = " " 				;005
com_cnt = 0						;005
 
detail
;005 start
com_cnt = com_cnt + 1
if (com_cnt = 1)
  comment_text = concat(format(pc.beg_effective_dt_tm,"mm/dd/yy;;d")," ",trim(pc.problem_comment,3))
else
  comment_text = concat(comment_text,"; ",format(pc.beg_effective_dt_tm,"mm/dd/yy;;d")," ",trim(pc.problem_comment,3))
endif
;005 end

foot p.problem_id 				;005
      populate = 1
      if(p.nomenclature_id > 0)
        ;004  problem = nm.source_string
        problem = p.annotated_display				;004
        sText = BUILD(sText, "<TR>","<td width=200>",csTableDef, problem, csSpanEnd, csTableDefEnd)
 
      else
        problem = p.problem_ftdesc
 
        sText = BUILD(sText, "<TR>","<td width=200>",csTableDef, problem, csSpanEnd, csTableDefEnd)
      endif
 
      if(p.life_cycle_status_cd >0)
        stat = uar_get_code_display(p.life_cycle_status_cd)
        sText = BUILD(sText, "<td width=200>", csTableDef,stat, csSpanEnd, csTableDefEnd)
      else
        sText = BUILD(sText, "<td width=200>",csTableDef, csSpanEnd, csTableDefEnd)
      endif
 
      if(p.onset_dt_tm > 0)
        ondate = format(p.onset_dt_tm,"mm/dd/yyyy;;q")
        sText = BUILD(sText, "<td width=75>",csTableDef, ondate, csSpanEnd, csTableDefEnd)
      else
        sText = BUILD(sText, "<td width=75>",csTableDef, csSpanEnd, csTableDefEnd)
      endif
 
      ;005 if(pc.problem_comment_id > 0)
      ;005  comm = pc.problem_comment
      if (comment_text > " ")					;005
        comm = comment_text						;005
        sText = BUILD(sText, "<td width=360>",csTableDef, comm, csSpanEnd, csTableDefEnd)
      else
        sText = BUILD(sText, "<td width=360>",csTableDef, csSpanEnd, csTableDefEnd)
      endif
 
      sText = BUILD(sText, "</TR>")
 
with nocounter
 
if(populate = 0)
  set sText = BUILD(sText, "<TR>",csTableDef1, "No Problems found",csSpanEnd, csTableDefEnd)
endif
 
;set sText = BUILD(sText,"</TR>",csTableEnd, csParagraphEnd, csEnd)
;set sText = BUILD(sText,csTableEnd, csParagraphEnd, csEnd)
set sText = BUILD(sText,csTableEnd, csEnd)
 
set reply->text = sText
 
set reply->format = 1 ; this means HTML so the caller will know how to handle
call echo(reply->text) ;FE Added so that I can get the html piece and see what it looks like
set MOD = "004 Akcia 04/12/2012"
end go
 
