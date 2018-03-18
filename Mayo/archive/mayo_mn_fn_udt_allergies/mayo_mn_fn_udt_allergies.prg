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
 
        Source file name:       mayo_mn_fn_udt_allergies.PRG
        Object name:            mayo_mn_fn_udt_allergies
        Request #:
 
        Product:                SC custom discern programming
        Product Team:           FirstNet
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:
 
        Tables read:			Allergy, nomenclature,allergy_comment
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
;     001   01/25/09   Akcia				  change column header "type" to "Category"
;	  002   09/29/11   Akcia				  change so inactive allergies display
;     003   03/12/12   Akcia                  changed taxt for NKA to No Known Allergy
;     004   04/12/12   Akcia				  only display allergies with the status of active
;****************************************************************************
 
drop program mayo_mn_fn_udt_allergies:dba go
create program mayo_mn_fn_udt_allergies:dba
 
%i cclsource:mayo_mn_html.inc
 
record allergy
(
   1 allgy_cnt                         = i4
   1 allgy_qual[*]
     2 allergy                         = vc
     2 reaction                        = vc
     2 type                            = vc
     2 comment                         = vc
)
 
;variables
declare sSpanOpen = vc with CONSTANT("<tr><td width=150><span style=font-family:arial font-size:12.0pt>")
declare sSpanClose = vc with CONSTANT("</span></td></tr>")
declare sSpanHOpen = vc with CONSTANT("<td width=150><span style=font-family:arial font-size:10.0pt>")  ;000
declare sSpanHClose = vc with CONSTANT("</span></td>")  ;  000
declare sStyleCenter = vc
with constant(" style='text-align: center;font-size:8.0pt;font-family:Tahoma,sans-serif;font-weight:bold;'>")
declare sText = vc
declare populate = i2 with NOCONSTANT(0)
set active_cd    = uar_get_code_by("MEANING",12025,"ACTIVE")				;004
 
 
 
;set sText = BUILD(csBegin, csParagraph,csTable)
set sText = BUILD(csBegin, "<TABLE border ='1' cellpadding=2")   ;csTable)  ;001
set sText = build(sText,"<TR>","<td width=200", sStyleCenter, ;001
								"<b>Substance</b>", csSpanEnd, csTableDefEnd)
set sText = build(sText,"<td width=200", sStyleCenter, ;001
 								"<b>Reaction Symptoms</b>", csSpanEnd, csTableDefEnd)
;set sText = build(sText,"<td width=80>",csTableDef, "<b>Type</b>", csSpanEnd, csTableDefEnd)
set sText = build(sText,"<td width=80", sStyleCenter, ;001
			;"<span style='font-size:8.0pt;font-family:Tahoma,sans-serif;'>",
			"Category", csTableDefEnd)   ;001  csSpanEnd,
set sText = build(sText,"<td width=230", sStyleCenter, ;001
						"<b>Comments</b>", csSpanEnd, csTableDefEnd)
 
 
;main selecte
  select into "nl:"
    substance = substring(1,15,uar_get_code_display(a.substance_type_cd))
 
    from allergy a
      , nomenclature nm
      , reaction r
      , nomenclature nm2
      , allergy_comment ac
 
    plan a
      where a.person_id = request->person_id
	    and a.active_ind = 1
	    and a.beg_effective_dt_tm <= sysdate
	    and a.end_effective_dt_tm >  sysdate
	    and a.cancel_dt_tm = null
	    and a.reaction_status_cd = active_cd 				;004
	    
    join nm
      where nm.nomenclature_id = outerjoin(a.substance_nom_id)
	    and nm.active_ind = outerjoin(1)
	    and nm.beg_effective_dt_tm <= outerjoin(sysdate)
	    ;002  and nm.end_effective_dt_tm >  outerjoin(sysdate)
 
	join r
	  where r.allergy_instance_id = outerjoin(a.allergy_instance_id)
	    and r.active_ind = outerjoin(1)
	    and r.beg_effective_dt_tm <= outerjoin(sysdate)
	    and r.end_effective_dt_tm >  outerjoin(sysdate)
 
	join nm2
      where nm2.nomenclature_id = outerjoin(r.reaction_nom_id)
	    and nm2.active_ind = outerjoin(1)
	    and nm2.beg_effective_dt_tm <= outerjoin(sysdate)
	    ;002  and nm2.end_effective_dt_tm >  outerjoin(sysdate)
 
	join ac
	  where ac.allergy_instance_id = outerjoin(a.allergy_instance_id)
	    and ac.active_ind = outerjoin(1)
	    and ac.beg_effective_dt_tm <= outerjoin(sysdate)
	    and ac.end_effective_dt_tm >  outerjoin(sysdate)
 
 
	order by substance
 
	;head person_id
    detail
      AllergyInfo = fillstring(200," ")          ;003 
      populate = 1
      if(a.substance_nom_id > 0)                 ;003
        if (nm.source_string = "NKA")            ;003
           AllergyInfo = "No Known Allergies"    ;003
        else                                     ;003
           AllergyInfo = nm.source_string
        endif                                    ;003
        sText = BUILD(sText,"<TR>","<td width=200>",csTableDef,AllergyInfo, csSpanEnd, csTableDefEnd)
      else
        AllergyInfo = a.substance_ftdesc
        sText = BUILD(sText,"<TR>","<td width=200>",csTableDef,AllergyInfo, csSpanEnd, csTableDefEnd)
      endif
 
      if(r.reaction_nom_id > 0)
 
        reac_symp = substring(1,30,nm2.source_string)
        sText = BUILD(sText,"<td width=200>",csTableDef,reac_symp, csSpanEnd, csTableDefEnd)
      else
        reac_symp = r.reaction_ftdesc
        sText = BUILD(sText,"<td width=200>",csTableDef,reac_symp, csSpanEnd, csTableDefEnd)
      endif
 
      if(a.substance_type_cd > 0)
        type = substring(1,30,uar_get_code_display(a.substance_type_cd))
        sText = BUILD(sText,"<td width=80>",csTableDef,type, csSpanEnd, csTableDefEnd)
      else
 
        sText = BUILD(sText,"<td width=80>",csTableDef, csSpanEnd, csTableDefEnd)
      endif
 
      if(ac.allergy_comment_id > 0)
        comm = ac.allergy_comment
        sText = BUILD(sText,"<td width=230>",csTableDef,comm, csSpanEnd, csTableDefEnd)
      else
        sText = BUILD(sText,"<td width=230>",csTableDef, csSpanEnd, csTableDefEnd)
      endif
 
      sText = BUILD(sText, "</TR>")
  with nocounter
 
 
if(populate = 0)
  set sText = BUILD(sText,"<TR>",csTableDef1,"No Allergies found",csSpanEnd, csTableDefEnd)
endif
 
;set sText = BUILD(sText,"</TR>",csTableEnd, csParagraphEnd, csEnd)
;set sText = BUILD(sText,csTableEnd, csParagraphEnd, csEnd)
set sText = BUILD(sText,csTableEnd, csEnd)
 
set reply->text = sText
set reply->format = 1 ; this means HTML so the caller will know how to handle
 
call echo(reply->text) ;FE Added so that I can get the html piece and see what it looks like
set MOD = "004 Akcia 04/12/2012"
end go
 
 
 
