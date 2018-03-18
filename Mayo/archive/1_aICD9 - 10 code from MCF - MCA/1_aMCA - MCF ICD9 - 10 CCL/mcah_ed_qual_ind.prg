    /***********************************************************************
    *                                                                      *
    *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
    *                              Technology, Inc.                        *
    *       Revision      (c) 1984-1997 Cerner Corporation                 *
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
    ************************************************************************
 
        Author:                 Natalie Boyd
        Date Written:           April 22, 2010
        Source file name:       mcah_ed_qual_ind.PRG
        Object name:            mcah_ed_qual_ind
        Request #:              na
 
        Product:
        Product Team:
        HNA Version:
        CCL Version:
 
        Program purpose:
 
        Tables read:
        Tables updated:         None
        Executing from:			Explorer Menu
 
        Special Notes:			ED Quality Indicators
 
    ************************************************************************
    *                      GENERATED MODIFICATION CONTROL LOG              *
    ************************************************************************
    *                                                                      *
    *Mod Date     Engineer             Comment                             *
    *--- -------- -------------------- ----------------------------------- *
    *000 04/22/10 nh6580               Initial Release                     *
    *001
    ************************************************************************/
drop program mcah_ed_qual_ind go
create program mcah_ed_qual_ind
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Enter Begin Date" = "CURDATE"
	, "Enter End Date" = "CURDATE"
 
with OUTDEV, DATE1, DATE2
 
;*** declare record structure ***
free record ed
record ed
( 1 patient[*]
    2 person_id = f8
    2 encntr_id	= f8
    2 pat_name	= vc
    2 mrn_alias	= vc
    2 fin_alias = vc
    2 admit_dt	= vc
    2 diag[*]
      3 text	= vc
      3 type	= vc
      3 code	= vc
      3 cd_type	= vc
      3 phys	= vc
  1 beg_date	= vc
  1 end_date	= vc
)
 
;*** declare variables ***
declare keep_ind 		= i2
declare mrn_cd 			= f8 with public, constant(uar_get_code_by("MEANING", 4, "MRN"))
declare fin_cd 			= f8 with public, constant(uar_get_code_by("MEANING", 319, "FIN NBR"))
declare mcah_fac_cd		= f8 with public, constant(uar_get_code_by("DISPLAYKEY", 220, "MAYOCLINICHOSPITALINARIZONA"))
declare mcah_ed_cd		= f8 with public, constant(uar_get_code_by("DISPLAYKEY", 220, "AZMCHED"))
declare ed_order_cd		= f8 with public, constant(uar_get_code_by("DISPLAYKEY", 200, "EDDISPOSITIONADMITTEDAZ"))
declare disch_diag_det	= f8 with public, constant(uar_get_code_by("DISPLAYKEY", 16449, "DISCHARGEDIAGNOSIS"))
declare ord_action_type	= f8 with public, constant(uar_get_code_by("MEANING", 6003, "ORDER"))
declare icd9_cd			= f8 with public, constant(uar_get_code_by("MEANING", 400, "ICD9"))
declare icd10_cd		= f8 with public, constant(uar_get_code_by("MEANING", 400, "ICD10CM")) ; ICD10 Transition - Esteban Garza
 
;*** Date Prompt ***
declare beg_dt		= c11 with public,noconstant(fillstring(11," "))
declare end_dt		= c11 with public,noconstant(fillstring(11," "))
declare beg_dt_tm	= c20 with public,noconstant(fillstring(20," "))
declare end_dt_tm	= c20 with public,noconstant(fillstring(20," "))
set beg_dt 			= patstring($DATE1)
set end_dt 			= patstring($DATE2)
set beg_dt_tm 		= concat(beg_dt," ","00:00:00")
set end_dt_tm 		= concat(end_dt," ","23:59:59")
;set beg_dt_tm 		= cnvtdatetime("01-JUL-2010 000000")
;set end_dt_tm 		= cnvtdatetime("31-JUL-2010 235959")
 
;*** if running report from ops ***
if(findstring("CURDATE", beg_dt_tm))
 set beg_dt_tm = ""
 set end_dt_tm = ""
 
;determines previous month
declare yr         = i4 with protect, noconstant(0)
declare tmp_dt_str = c11 with protect, noconstant(" ")
declare cnvt_dt    = i4 with protect, noconstant(0)
declare beg_dt2    = dq8 with protect
declare beg_dt_int = i4 with protect, noconstant(0)
declare end_dt2    = dq8 with protect
declare end_dt_int = i4 with protect, noconstant(0)
 
if(month(curdate) = 1)
    set yr = year(curdate)-1
else
    set yr = year(curdate)
endif
 
case(month(curdate))
   of 1: set tmp_dt_str = CONCAT("1201",TRIM(CNVTSTRING(yr),3))
   of 2: set tmp_dt_str = CONCAT("0101",TRIM(CNVTSTRING(yr),3))
   of 3: set tmp_dt_str = CONCAT("0201",TRIM(CNVTSTRING(yr),3))
   of 4: set tmp_dt_str = CONCAT("0301",TRIM(CNVTSTRING(yr),3))
   of 5: set tmp_dt_str = CONCAT("0401",TRIM(CNVTSTRING(yr),3))
   of 6: set tmp_dt_str = CONCAT("0501",TRIM(CNVTSTRING(yr),3))
   of 7: set tmp_dt_str = CONCAT("0601",TRIM(CNVTSTRING(yr),3))
   of 8: set tmp_dt_str = CONCAT("0701",TRIM(CNVTSTRING(yr),3))
   of 9: set tmp_dt_str = CONCAT("0801",TRIM(CNVTSTRING(yr),3))
   of 10:set tmp_dt_str = CONCAT("0901",TRIM(CNVTSTRING(yr),3))
   of 11:set tmp_dt_str = CONCAT("1001",TRIM(CNVTSTRING(yr),3))
   of 12:set tmp_dt_str = CONCAT("1101",TRIM(CNVTSTRING(yr),3))
endcase
 
set cnvt_dt = CNVTDATE2(tmp_dt_str,"MMDDYYYY")
set beg_dt2 = DATETIMEFIND(CNVTDATETIME(cnvt_dt,0),"M","B","B")
set beg_dt_int = CNVTINT(SUBSTRING(1,8, FORMAT(beg_dt2,"MMDDYYYY;;d")))   ;for ValidateDateParms routine
set end_dt2 = DATETIMEFIND(CNVTDATETIME(cnvt_dt,235959),"M","E","E")
set end_dt_int = CNVTINT(SUBSTRING(1,8, FORMAT(end_dt2,"MMDDYYYY;;d")))   ;for ValidateDateParms routine
 
call echo(build("BEGIN DATE -> ", format(beg_dt2, "mm/dd/yy hh:mm;;q")))
call echo(build("END DATE -> ", format(end_dt2, "mm/dd/yy hh:mm;;q")))
 
 set month_beg_dt = format(beg_dt2, "dd-mmm-yyyy hh:mm:ss;;d")
 set month_end_dt = format(end_dt2, "dd-mmm-yyyy hh:mm:ss;;d")
 set beg_dt_tm = month_beg_dt ;cnvtdatetime(curdate, curtime3)
 set end_dt_tm = month_end_dt
endif
 
set ed->beg_date  	= format(cnvtdatetime(beg_dt_tm), "mm/dd/yyyy;;d")
set ed->end_date 	= format(cnvtdatetime(end_dt_tm), "mm/dd/yyyy;;d")
 
execute reportrtl  ;ALLOWS EXECUTION FROM BACKEND CCL SESSION
%i mayo_prg:mcah_ed_qual_ind.dvl
 
select into "nl:"
from encounter e
    ,encntr_loc_hist elh
    ,person p
    ,person_alias pa
    ,encntr_alias ea
plan e
where e.disch_dt_tm between cnvtdatetime(beg_dt_tm) and cnvtdatetime(end_dt_tm)
 ;and e.loc_facility_cd+0 = mcah_fac_cd
 ;and e.loc_nurse_unit_cd+0 = mcah_ed_cd
join elh
where elh.encntr_id = e.encntr_id
  ;and elh.loc_facility_cd+0 = mcah_fac_cd
 ;and elh.loc_nurse_unit_cd+0 = mcah_ed_cd
join p
where p.person_id = e.person_id
join pa
where pa.person_id = p.person_id
  and pa.person_alias_type_cd = mrn_cd
  and pa.active_ind = 1
  and pa.end_effective_dt_tm >= cnvtdatetime(curdate, curtime3)
join ea
where ea.encntr_id = e.encntr_id
  and ea.encntr_alias_type_cd = fin_cd
  and ea.active_ind = 1
  and ea.end_effective_dt_tm >= cnvtdatetime(curdate, curtime3)
order by p.name_full_formatted, e.encntr_id
 
head report
 a = 0
 
head e.encntr_id
 a = a + 1
 stat = alterlist(ed->patient,a)
 ed->patient[a].encntr_id = e.encntr_id
 ed->patient[a].person_id = p.person_id
 ed->patient[a].pat_name = trim(p.name_full_formatted,3)
 ed->patient[a].mrn_alias = trim(pa.alias,3)
 ed->patient[a].fin_alias = trim(ea.alias,3)
 ed->patient[a].admit_dt = format(e.reg_dt_tm, "mm/dd/yy;;d")
with nocounter
/*
select into "nl:"
from (dummyt d1 with seq = size(ed->patient,5))
    ,orders o
    ,order_detail od
    ,order_action oa
    ,prsnl pr
plan d1
join o
where o.encntr_id = ed->patient[d1.seq].encntr_id
  and o.catalog_cd = ed_order_cd
join od
where od.order_id = o.order_id
  and od.oe_field_id = disch_diag_det
join oa
where oa.order_id = o.order_id
  and oa.action_type_cd = ord_action_type
join pr
where pr.person_id = outerjoin(oa.order_provider_id)
order by d1.seq, o.order_id
 
head d1.seq
 b = size(ed->patient[d1.seq].diag,5)
 
head o.order_id
 keep_ind = 1
 b = b + 1
 stat = alterlist(ed->patient[d1.seq].diag,b)
 ed->patient[d1.seq].diag[b].text = trim(od.oe_field_display_value)
 ed->patient[d1.seq].diag[b].phys = trim(pr.name_full_formatted,3)
with nocounter
*/
 
select into "nl:"
from orders o
    ,order_detail od
    ,order_action oa
    ,prsnl pr
    ,person p
    ,encounter e
    ,person_alias pa
    ,encntr_alias ea
plan o
where o.orig_order_dt_tm between cnvtdatetime(beg_dt_tm) and cnvtdatetime(end_dt_tm)
  and o.catalog_cd = ed_order_cd
join od
where od.order_id = o.order_id
  and od.oe_field_id = disch_diag_det
join oa
where oa.order_id = o.order_id
  and oa.action_type_cd = ord_action_type
join p
where p.person_id = o.person_id
join e
where e.encntr_id = o.encntr_id
join pa
where pa.person_id = p.person_id
  and pa.person_alias_type_cd = mrn_cd
  and pa.active_ind = 1
  and pa.end_effective_dt_tm >= cnvtdatetime(curdate, curtime3)
join ea
where ea.encntr_id = e.encntr_id
  and ea.encntr_alias_type_cd = fin_cd
  and ea.active_ind = 1
  and ea.end_effective_dt_tm >= cnvtdatetime(curdate, curtime3)
  join pr
where pr.person_id = outerjoin(oa.order_provider_id)
order by p.name_full_formatted, e.encntr_id, o.order_id
 
head report
 a = size(ed->patient,5)
 
head e.encntr_id
 b = 0
 a = a + 1
 stat = alterlist(ed->patient,a)
 ed->patient[a].encntr_id = e.encntr_id
 ed->patient[a].person_id = p.person_id
 ed->patient[a].pat_name = trim(p.name_full_formatted,3)
 ed->patient[a].mrn_alias = trim(pa.alias,3)
 ed->patient[a].fin_alias = trim(ea.alias,3)
 ed->patient[a].admit_dt = format(e.reg_dt_tm, "mm/dd/yy;;d")
 
head o.order_id
 keep_ind = 1
 b = b + 1
 stat = alterlist(ed->patient[a].diag,b)
 ed->patient[a].diag[b].text = trim(od.oe_field_display_value)
 ed->patient[a].diag[b].phys = trim(pr.name_full_formatted,3)
with nocounter
 
select into "nl:"
from (dummyt d1 with seq = size(ed->patient,5))
    ,diagnosis d
    ,nomenclature n
    ,prsnl pr1
    ,prsnl pr2
plan d1
join d
where d.encntr_id = ed->patient[d1.seq].encntr_id
  and d.active_ind = 1
  and d.end_effective_dt_tm >= cnvtdatetime(curdate, curtime3)
join n
where n.nomenclature_id = d.nomenclature_id
  and n.source_identifier in ("427.5", "410.90", "428.0", "434.91", "486", "482.9", "480.9",
                              "786.5", "300.9", "303.0", "311", "296.5", "298.9", "305.9",
                              "291.81", "291.0", "977.9", "I46.9", "I21.3", "I50.9", "I63.50",
                              "I63.9", "J18.9", "J15.9", "J12.9",  "F45.9", "F48.9", "F51.13",
                              "F34.9", "F51.05", "F10.229", "F32.9", "F29", "R41.0", "F11.90",
                              "F15.129", "F10.239", "F10.231", "T50.904A", "100005523",
"I46.9", "I21.3", "I50.9", "I63.50", "J18.9", "J15.9", "J12.9",						;ICD10
"0", "F48.9", "F99", "0", "F32.9", "0", "F29", "0",							;ICD10
"F10.239", "F10.231", "T50.901A", "T50.902A", "T50.903A", "T50.904A", "0", "0", "0", "0",		;ICD10
"0", "0", "0", "0", "0", "0", "0",									;ICD10
"0", "0", "0", "0", "0", "0", "0",									;ICD10
"0", "0", "0", "0", "I21.3"										;ICD10
                               )
; These are not mapped
; "786.5", 303.0, 296.5, 305.9, I46.9, I21.3, I50.9, I63.50, I63.9, J18.9, J15.9,
; J12.9, F45.9 , F48.9, F51.13, F34.9, F51.05, F10.229, F32.9, F29, R41.0; F11.90
; F15.129, F10.239, F10.231, T50.904A
  and n.source_vocabulary_cd in (icd9_cd, icd10_cd, 511600958, 698711719)
 
 
  and n.active_ind = 1
join pr1
where pr1.person_id = outerjoin(d.diag_prsnl_id)
join pr2
where pr2.person_id = outerjoin(d.active_status_prsnl_id)
order by d1.seq, d.diagnosis_id
 
head d1.seq
 b = size(ed->patient[d1.seq].diag,5)
 
head d.diagnosis_id
 keep_ind = 1
 b = b + 1
 stat = alterlist(ed->patient[d1.seq].diag,b)
 ed->patient[d1.seq].diag[b].type = uar_get_code_display(d.diag_type_cd)
 ed->patient[d1.seq].diag[b].code = n.source_identifier
 ed->patient[d1.seq].diag[b].cd_type = uar_get_code_display(n.source_vocabulary_cd)
if(n.source_string != NULL)
 ed->patient[d1.seq].diag[b].text = n.source_string
else
 ed->patient[d1.seq].diag[b].text = d.diag_ftdesc
endif
if(d.diag_prsnl_id > 0)
 ed->patient[d1.seq].diag[b].phys = trim(pr1.name_full_formatted,3)
else
 ed->patient[d1.seq].diag[b].phys = trim(pr2.name_full_formatted,3)
endif
 
with nocounter
 
call echorecord(ed)
 
if(keep_ind = 0)
 set stat = alterlist(ed->patient,0)
 set stat = alterlist(ed->patient,1)
 set stat = alterlist(ed->patient[1].diag,1)
 set ed->patient[1].pat_name = "No patients qualified for report"
endif
 
;LAYOUT BUILDER
set _SendTo = $outdev
call LayoutQuery(0)
 
end
go
 
;execute mcah_ed_qual_ind go