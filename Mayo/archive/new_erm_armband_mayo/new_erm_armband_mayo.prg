;drop program erm_armband_mayo:dba go
;create program erm_armband_mayo:dba
drop program new_erm_armband_mayo:dba go
create program new_erm_armband_mayo:dba
 
/************************************************************************
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
 ************************************************************************
 
          Date Written:       MM/DD/YYYY
          Source file name:   labelwarmband
          Object name:        labelwarmband
          Request #:          XXXXXX
 
          Product:            CORE V500
          Product Team:       CORE V500
          HNA Version:        V500
          CCL Version:
 
          Program purpose:    Label
 
          Tables read:        VARIABLE
          Tables updated:     None
          Executing from:     PM DBDocs
 
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
 *000 MM/DD/YY Sample Engineer      initial release                    *
 *001 03/29/02 DaRon Holmes         Sized for Tri-State Stock FM1542   *
 *002 01/12/05 Elaine Miller 	    customized FIN & MR# labels        *
 *003 03/31/05 Elaine Miller        Modified for generic doc file      *
 *004 06/10/09 dg5085               customize for mayo_Mn              *
 *005 06/26/08 dg5085               prefix 4 character and adjustements*
 *006 09/25/08 dg5085               next enhancements SR 1-1521526751  *
 *007 10/02/08 dg5085               remove 2 digit from mrn/fin 4 digit*
 *008 10/06/08 dg5085               formatting and year display        *
 *009 10/27/08 dg5085               truncate patient name to 22        *
 *010 05/04/09 dg5085               admit date truncation on armband   *
 *011 05/06/09 rv5893               update the MRN and FIN barcode to the the  *
 *                                  alias_pool_cd formatting           *
 ***********************************************************************
 
 ******************  END OF ALL MODCONTROL BLOCKS  ********************/
%i cclsource:pm_hl7_formatting.inc
execute reportrtl
%i ccluserdir:new_erm_armband_mayo.dvl
set d0 = InitializeReport(0)
declare fin = vc
declare encntr_id= f8 ;mcc
declare full_name = vc
declare dob = vc
declare age = vc
declare age_dp = vc
declare sex_dp = vc
declare admit_dt = vc
declare pattype_dp = vc
declare barcode_mrn = vc
declare mrn_dp = vc
declare barcode_fin = vc
declare Aztec = vc
declare room_dp = vc
declare room_code_dp = vc
;007declare Pfx_barcode_mrn = vc ;006
;007declare pfx_mrn_dp = vc ;006
;007declare pfx_barcode_fin  = vc ;006
;007declare pfx_fin          = vc ;006
declare att_prv = vc
declare prov_att = vc
declare bed_dp = vc ;mcc
declare prov_id= f8 ;mcc
 
 
 
;INITIALIZE
  set fnbr_alias   = request->patient_data->person->encounter->finnbr->alias
    set encntr_id		= request->patient_data->person->encounter->encntr_id
  set fnbr_format  = request->patient_data->person->encounter->finnbr->alias_pool_cd
; set fnbr         = substring(1,15, cnvtalias(fnbr_alias, fnbr_format))
  set fnbr         = cnvtalias(fnbr_alias, fnbr_format)
  set barcode_fin  = build("*",fnbr,"*")
  set fin          = build("FIN: ",fnbr)
  set full_name    = cnvtupper(substring(1, 22, request->patient_data->person->name_full_formatted));was 40
  set dob          = format(request->patient_data->person->birth_dt_tm,"MM/DD/YYYY;;D")
  set mrn_format   = request->patient_data->person->mrn->alias_pool_cd
  set mrn_alias    = request->patient_data->person->mrn->alias
  set mrn_cnvt     = cnvtalias(mrn_alias, mrn_format)
  set barcode_mrn  = build("*",mrn_cnvt,"*")
  set mrn_dp       = build("MR#: ",trim(mrn_cnvt))
  set admit_dt     = format(request->patient_data->person->encounter->reg_dt_tm,"MM/DD/YYYY;;D")
  set age = cnvtage(cnvtdate(request->patient_data->person->birth_dt_tm),
      cnvttime(request->patient_data->person->birth_dt_tm))
   set prov_id	= request->patient_data->PERSON->ENCOUNTER->ATTENDDOC->PRSNL_PERSON_ID ;mcc
 
  if (findstring("Hour", age) > 1)
    set age_dp = concat(substring(1, 2, age), "H")
  elseif (findstring("Day", age) > 1)
    if (cnvtint(substring(1, 3, age)) > 0)
      set age_dp = concat(substring(1, 3, age), "D")
    else
      set age_dp = ""
    endif
  elseif (findstring("Week", age) > 1)
    set age_dp = concat(substring(1, 3, age), "W")
  elseif (findstring("Month", age) > 1)
    set age_dp = concat(substring(1, 3, age), "M")
  elseif (findstring("Year", age) > 1)
    set age_dp = concat(substring(1, 3, age), "Y")
  else
    set age_dp = ""
  endif
  set sex_dp      = substring(1,1,uar_get_code_display(request->patient_data->person->sex_cd)),
  set pattype_dp  = substring(1,15,uar_get_code_display(request->patient_data->person->encounter->encntr_type_cd)),
  set room_code_dp     = uar_get_code_display(request->patient_data->person->encounter->loc_room_cd),
  set bed_dp     = uar_get_code_display(request->patient_data->person->encounter->loc_bed_cd),
 set room_dp = concat(room_code_dp,"/",bed_dp)
/*select distinct cva.alias,cva.CONTRIBUTOR_SOURCE_CD from encounter e,CODE_VALUE_OUTBOUND cva
plan e where e.loc_facility_cd = 642288
join cva where cva.code_value  = e.loc_facility_cd
        and cva.CONTRIBUTOR_SOURCE_CD = 642220
order by e.loc_facility_cd
*/
 
/* mcc   SELECT into "nl:";P.name_full_formatted
  					FROM
					ENCNTR_ALIAS EA, ENCNTR_PRSNL_RELTN	E, PRSNL P
					PLAN EA
					WHERE
					EA.alias = fnbr_alias;"100052364"
					AND ea.encntr_alias_type_cd = 1077
					JOIN E
					WHERE
					E.ENCNTR_PRSNL_R_CD = 1119
					AND e.active_ind = 1
					AND E.encntr_id = EA.encntr_id
					AND E.BEG_EFFECTIVE_DT_TM <= cnvtdatetime(curdate,curtime)
					AND E.END_EFFECTIVE_DT_TM >= cnvtdatetime(curdate,curtime)
					JOIN P
					WHERE
					P.active_ind = 1
					AND P.PERSON_ID = E.PRSNL_PERSON_ID
					order by p.name_full_formatted
					detail
					att_prv = p.name_full_formatted
					with nocounter
 
  set prov_att = att_prv */
 
  ;mcc
 	select into "nl:"
	from prsnl p
	where p.person_id= prov_id
	detail
	att_prv= p.name_full_formatted
	with nocounter
 
  set prov_att = att_prv
 
  select
    d.seq
  from dummyt d,
       ;code_value_alias cva
       CODE_VALUE_OUTBOUND cva
  plan d
  join cva where request->patient_data->person->encounter->loc_facility_cd = cva.code_value
       and cva.contributor_source_cd = 25047293 ;642220; 414
;djs       and cva.contributor_source_cd = 642220; djs
 
  detail
    prefix = substring(1,4,cva.alias);007 back to 4 from 2 ;006 was 4 ;005 was 2
    Aztec = concat(prefix,fnbr)
;007    Pfx_barcode_mrn  = concat("*",prefix,trim(mrn_cnvt),"*") ;006
;007    pfx_mrn_dp       = concat("MR#: ",prefix,substring(1,8,mrn_cnvt));006
;007    pfx_barcode_fin  = concat("*",prefix,trim(fnbr),"*") ;006
;007    pfx_fin          = build("FIN: ",prefix,trim(fnbr)) ;006
    d0=DetailSection(Rpt_Render)
;007    call echo(pfx_mrn_dp)
;007    call echo(pfx_fin)
 
  with nocounter;, noformfeed, DIO = POSTSCRIPT
 
 
  set d0 = FinalizeReport($1);"cer_print:ds.dat");request->printer_name)
 
set last_mod = "011 05/07/09 rv5893"
 
  end
  go
 
