drop program erm_labelsheet_mayo:dba go
create program erm_labelsheet_mayo:dba
 
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
 *004 10/07/08 dg5085               customize for mayo_Mn              *
 *005 10/27/08 dg5085               truncate name to 24                *
 *006 05/07/09 rv5893               adjust the mrn and fin to use alias_pool_cd
 ***********************************************************************
 
 ******************  END OF ALL MODCONTROL BLOCKS  ********************/
%i ccluserdir:pm_hl7_formatting.inc
execute reportrtl
%i ccluserdir:erm_labelsheet_mayo.dvl
set d0 = InitializeReport(0)
declare fin = vc
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
declare room_dp = vc
;declare x = f8
declare attend_doctor = f8
declare prov_att = vc
 
;INITIALIZE
  set fnbr_alias   = request->patient_data->person->encounter->finnbr->alias
  set fnbr_format  = request->patient_data->person->encounter->finnbr->alias_pool_cd
; set fnbr         = substring(1,15, cnvtalias(fnbr_alias, fnbr_format))
  set fnbr         = cnvtalias(fnbr_alias, fnbr_format)
  set barcode_fin  = build("*",fnbr,"*")
  set fin          = build("FIN: ",fnbr)
  set full_name    = cnvtupper(substring(1,24, request->patient_data->person->name_full_formatted));was 40
  set dob          = format(request->patient_data->person->birth_dt_tm,"MM/DD/YYYY;;D")
  set mrn_format   = request->patient_data->person->mrn->alias_pool_cd
  set mrn_alias    = request->patient_data->person->mrn->alias
  set mrn_cnvt     = cnvtalias(mrn_alias, mrn_format)
  set barcode_mrn  = build("*",mrn_cnvt,"*")
  set mrn_dp       = build("MR#: ",mrn_cnvt)
  set admit_dt     = format(request->patient_data->person->encounter->reg_dt_tm,"MM/DD/YYYY;;D")
  set age = cnvtage(cnvtdate(request->patient_data->person->birth_dt_tm),
      cnvttime(request->patient_data->person->birth_dt_tm))
  set attend_doctor = request->patient_data->person->encounter->attenddoc->prsnl_person_id
  set prov_att = substring(1,30,pm_hl7_provider(attend_doctor,prv_name_full_formatted))
 
;  set x = 1
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
  set room_dp     = uar_get_code_display(request->patient_data->person->encounter->loc_room_cd),
 
; SELECT into "nl:";P.name_full_formatted
;  					FROM
;					ENCNTR_ALIAS EA, ENCNTR_PRSNL_RELTN	E, PRSNL P
;					PLAN EA
;					WHERE
;					EA.alias = fnbr_alias;"100052364"
;					AND ea.encntr_alias_type_cd = 1077
;					AND ea.alias_pool_cd = fnbr_format
;					JOIN E
;					WHERE
;					E.ENCNTR_PRSNL_R_CD = 1119
;					AND e.active_ind = 1
;					AND E.encntr_id = EA.encntr_id
;					AND E.BEG_EFFECTIVE_DT_TM <= cnvtdatetime(curdate,curtime)
;					AND E.END_EFFECTIVE_DT_TM >= cnvtdatetime(curdate,curtime)
;					JOIN P
;					WHERE
;					P.active_ind = 1
;					AND P.PERSON_ID = E.PRSNL_PERSON_ID
;					order by p.name_full_formatted
;					detail
;					att_prv = p.name_full_formatted
;					with nocounter
;
;set prov_att = att_prv
;
  select
    d.seq
  from dummyt d
 
  detail
    for (x = 1 to 10)
      d0=DetailSection(Rpt_Render)
    endfor
  with nocounter;, noformfeed, DIO = POSTSCRIPT
  set d0 = FinalizeReport($1);"cer_print:ds.dat");request->printer_name)
 
set last_mod = "006 05/07/09 rv5893"
 
  end
  go
 
