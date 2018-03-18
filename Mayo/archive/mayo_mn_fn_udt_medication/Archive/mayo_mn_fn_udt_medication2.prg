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
;****************************************************************************
 
drop program mayo_mn_fn_udt_medication:dba go
create program mayo_mn_fn_udt_medication:dba
 
%i cclsource:mayo_mn_html.inc
/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
 
declare dOrderedCd = f8 with NOCONSTANT(0.0)
declare sText = vc
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
declare ldose = vc
declare udose = vc
declare l_udose = vc
declare lunit = vc
 
 
declare nRecorded = i4 with CONSTANT(2)
declare nOwnMeds = i4 with CONSTANT(3)
declare nNormal0 = i4 with CONSTANT(0)
declare nNormal1 = i4 with CONSTANT(1)
declare ord_comment_cd      = f8 with public, noconstant(0.0)
declare hard_stop_cd = f8 with public, constant(uar_get_code_by("MEANING",4009,"DRSTOP"))		;002
declare physician_stop_cd = f8 with public, constant(uar_get_code_by("MEANING",4009,"HARD"))	;002

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
 
/**************************************************************
; DVDev Start Coding
**************************************************************/
 
set dOrderedCd = UAR_GET_CODE_BY("MEANING", 6004, "ORDERED")
set ord_comment_cd = UAR_GET_CODE_BY("MEANING", 14, "ORD COMMENT")
declare sStyleCenter = vc
with constant(" style='text-align: center;font-size:8.0pt;font-family:Tahoma,sans-serif;font-weight:bold;'>")
 
;set sText = BUILD(csBegin, csParagraph,csTable)
set sText = BUILD(csBegin, "<TABLE border ='1' cellpadding=2")   ;csTable)  ;001
set sText = build(sText,"<TR>","<td width=150", sStyleCenter, ;001
								"<b>Medication/Strength</b>", csSpanEnd, csTableDefEnd)
set sText = build(sText,"<td width=90", sStyleCenter, ;001
								"<b>Dose</b>", csSpanEnd, csTableDefEnd)
set sText = build(sText,"<td width=90", sStyleCenter, ;001
								"<b>Route</b>", csSpanEnd, csTableDefEnd)
set sText = build(sText,"<td width=90", sStyleCenter, ;001
								"<b>Frequency</b>", csSpanEnd, csTableDefEnd)
set sText = build(sText,"<td width=290", sStyleCenter, ;001
								"<b>Indications/Special Instructions/Comments</b>", csSpanEnd, csTableDefEnd)
 
 
 
select into "nl:"
from orders o,
     order_detail od,
     oe_format_fields oeff,
     order_entry_fields oef,
     (dummyt d2 with seq = 1),
     code_value cv,
     order_comment oc,
     long_text lt
 
plan o
    where o.person_id = request->person_id
    and o.order_status_cd+0 = dOrderedCd
    and o.active_ind = 1
    and
        (o.orig_ord_as_flag+0 = nRecorded
         OR
         o.orig_ord_as_flag+0 = nOwnMeds
         OR
         o.orig_ord_as_flag+0 = nNormal1)
join od
    where od.order_id = o.order_id
join oeff
    where oeff.oe_format_id = o.oe_format_id
    and oeff.oe_field_id = od.oe_field_id
join oc
    where oc.order_id = outerjoin(o.order_id)
    and oc.comment_type_cd = outerjoin(ord_comment_cd)
 
join lt
    where lt.long_text_id = outerjoin(oc.long_text_id)
    and lt.active_ind = outerjoin(1)
join oef
    where oef.oe_field_id = oeff.oe_field_id
join d2
join cv
    where cv.code_set = oef.codeset
    and trim(cv.display) = od.oe_field_display_value
    and trim(cv.display) > " "
 
 
 
    order o.order_id desc, oeff.group_seq, oeff.field_seq, od.oe_field_id, od.action_sequence desc
 
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
        o_mnem = trim(o.order_mnemonic)
        o_as_mnem = trim(o.ordered_as_mnemonic)
 		hard_stop_flag = 0										;002
        sText = BUILD(sText, "<TR>","<td width=150>",csTableDef,o_mnem,"&nbsp;","(", o_as_mnem, ")",
                           csSpanEnd, csTableDefEnd)
        call echo(BUILD("MNEMONIC:",o_MNEM))
 
 
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
                if(cv.code_value > 0)
                    sRoute = trim(cv.description)
                else
                    sRoute = trim(od.oe_field_display_value)
                endif
            elseif(od.oe_field_meaning_id = nFreq)
                if(cv.code_value > 0)
                    sFreq = trim(cv.description)
                else
                    sFreq = trim(od.oe_field_display_value)
                endif
            ;nt5990 pulled out original code due to it pulling incorrectly
            ;elseif(od.oe_field_meaning_id = nStrengthDose)
            ;    sStrengthDose = trim(od.oe_field_display_value)
            ;elseif(od.oe_field_meaning_id = nStrengthDoseUnit)
            ;    if(cv.code_value > 0)
            ;        sStrengthDoseUnit = trim(cv.description)
            ;    else
            ;        sStrengthDoseUnit = trim(od.oe_field_display_value)
            ;    endif
            ;elseif(od.oe_field_meaning_id = nVolumeDose)
            ;    sVolumeDose = trim(od.oe_field_display_value)
            ;elseif(od.oe_field_meaning_id = nVolumeDoseUnit)
            ;    if(cv.code_value > 0)
            ;        sVolumeDoseUnit = trim(cv.description)
            ;    else
            ;        sVolumeDoseUnit = trim(od.oe_field_display_value)
            ;    endif
            ;elseif(od.oe_field_meaning_id = nFreeTextDose)
            ;    sFreeTextDose = trim(od.oe_field_display_value)
            ;elseif(od.oe_field_meaning_id = nDuration)
            ;    sDuration = trim(od.oe_field_display_value)
    ;002          elseif(od.oe_field_meaning_id = nDurationUnit)
 			elseif(od.oe_field_meaning = "DURATIONUNIT")				;002
                if(cv.code_value > 0)
                    sDurationUnit = trim(cv.description)
                else
                    sDurationUnit = trim(od.oe_field_display_value)
                endif
            elseif(od.oe_field_meaning = "DURATION")				;002  
            	sDuration = od.oe_field_display_value				;002
            elseif(od.oe_field_meaning = "STOPTYPE")				;002 
            	if (od.oe_field_value in (hard_stop_cd,physician_stop_cd))	;002
             		hard_stop_flag = 1										;002
             	endif														;002
            ;elseif(od.oe_field_meaning_id = nPRN)
            ;    sPrnInstructions = trim(od.oe_field_display_value)
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
 SPRNSPEC = REPLACE(SPRNSPEC, "<" , "&lt;" )
 SPRNSPEC = REPLACE(SPRNSPEC, ">" , "&gt;" )
        if(ldose > " ")
          l_udose = concat (ldose," ", lunit)
          sText = BUILD(sText, "<td width=90>",csTableDef, l_udose, csSpanEnd, csTableDefEnd)
        else
          sText = BUILD(sText, "<td width=90>",csTableDef, csSpanEnd, csTableDefEnd)
        endif
 
        if(trim(sRoute) > " ")
            sText = BUILD(sText, "<td width=90>",csTableDef, sRoute,csSpanEnd, csTableDefEnd);sRoute
        else
            sText = BUILD(sText, "<td width=90>",csTableDef, csSpanEnd, csTableDefEnd)
        endif
        if(trim(sFreq) > " ")
          if (trim(sPrnReason) > " ")
            freqPRN = build2(sFreq, " as needed for ", sPrnReason)
            sText = BUILD(sText, "<td width=90>",csTableDef, freqPRN,csSpanEnd, csTableDefEnd)
          else
            freqPRN = sFreq
            if ((sduration > " ") and (sdurationunit > " ") and (hard_stop_flag = 1))  	;002
            	freqprn = concat(sfreq," for ", sduration," ",sdurationunit )			;002
			endif																		;002
            sText = BUILD(sText, "<td width=90>",csTableDef, freqPRN,csSpanEnd, csTableDefEnd)
          endif
        else
          if (trim(sPrnReason) > " ")
            freqPRN = sPrnReason
            sText = BUILD(sText, "<td width=90>",csTableDef, freqPRN,csSpanEnd, csTableDefEnd)
          else
            sText = BUILD(sText, "<td width=90>",csTableDef, csSpanEnd, csTableDefEnd)
          endif
        endif
 
 
        if (trim(sprnspec) > " ")
            sText = BUILD(sText,"<td width=290>",csTableDef, sprnspec,csSpanEnd, csTableDefEnd)
        else
            sText = BUILD(sText, "<td width=290>",csTableDef, csSpanEnd, csTableDefEnd) ;000
        endif
 
        sText = BUILD(sText, "</TR>")
 
with nocounter, outerjoin = d2
 
if(populate = 0)
  set sText = BUILD(sText, "<TR>",csTableDef1, "No Medications found",csSpanEnd, csTableDefEnd)
endif
 
set sText = BUILD(sText,csTableEnd, csEnd)
 
set reply->text = sText
set reply->format = 1 ; this means HTML so the caller will know how to handle
 
call echo(reply->text) ;FE Added so that I can get the html piece and see what it looks like
 
set MOD = "002 Akcia 09/28/2011"
end
go
 
 
 
