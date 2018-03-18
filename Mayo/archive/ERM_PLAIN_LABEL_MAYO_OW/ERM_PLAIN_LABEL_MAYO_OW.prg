drop program erm_plain_label_mayo_ow:dba go
create program erm_plain_label_mayo_ow:dba
 
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
 *007 10/27/08 dg5085               truncate patient name to 23        *
 *008 12/09/08 dg5085               Chaged label to use layout builder *
 *                                  from SR 1-2058963541               *
 *009 05/07/09 rv5893               fix formatting of the fin and mrn alias
 ***********************************************************************
 
 ******************  END OF ALL MODCONTROL BLOCKS  ********************/
%i ccluserdir:pm_hl7_formatting.inc
execute reportrtl
%i CCLUSERDIR:erm_plain_label_mayo_ow.dvl
set d0 = InitializeReport(0)
declare fin = vc
declare full_name = vc
declare fnbr_format = f8
declare fnbr= vc
declare barcode_fin = vc
declare mrn_format = f8
declare mrn_alias = vc
declare mnr_cnvt = vc
declare dob = vc
declare age = vc
declare age_dp = vc
declare sex_dp = vc
declare admit_dt = vc
declare pattype_dp = vc
declare barcode_mrn = vc
declare mrn_dp = vc
declare room_dp = vc
declare att_doc = vc
declare v1= vc
declare v2= f8
declare prov_att = vc
declare arr_dt_tm = vc
declare p1 = vc
declare p2 = vc
declare p3 = vc
 
;INITIALIZE
  set fnbr_alias   = request->patient_data->person->encounter->finnbr->alias
  set fnbr_format  = request->patient_data->person->encounter->finnbr->alias_pool_cd
  set fnbr         = cnvtalias(fnbr_alias, fnbr_format)
  set barcode_fin  = build("*",fnbr,"*")
  set fin          = build("FIN# ",fnbr)
  set full_name    = cnvtupper(substring(1,70,request->patient_data->person->name_full_formatted))
  set dob          = format(request->patient_data->person->birth_dt_tm,"MM/DD/YYYY;;D")
  set mrn_format   = request->patient_data->person->mrn->alias_pool_cd
  set mrn_alias    = request->patient_data->person->mrn->alias
  set mrn_cnvt     = cnvtalias(mrn_alias, mrn_format)
  set  v1= substring(1, 4, mrn_cnvt)
  if (textlen(trim(v1))>0)
  set p1 = cnvtalias(mrn_alias, mrn_format)
  set p2 = substring(1,6,p1)
  set p3 = concat(trim (p2),substring(8,2,p1),substring(11,2,p1),substring(14,1,p1))
  set mrn_dp = build("MR# ",p3)
  set barcode_mrn  = build("*",p3,"*")
  else
  set v2= size(mrn_cnvt,1)-4
  set mrn_cnvt = substring(5,v2,mrn_cnvt)
  set p1 = cnvtalias(mrn_alias, mrn_format)
  set p2 = substring(5,2,p1)
  set p3 = concat(trim (p2),substring(8,2,p1),substring(11,2,p1),substring(14,1,p1))
  set mrn_dp = build("MR# ",p3)
   set barcode_mrn  = build("*",p3,"*")
  endif
  set admit_dt     = format(request->patient_data->person->encounter->reg_dt_tm,"MM/DD/YYYY;;D")
  set age = cnvtage(request->patient_data->person->birth_dt_tm)
  set arr_dt_tm = format(request->patient_data->PERSON->ENCOUNTER->EST_ARRIVE_DT_TM,"@SHORTDATETIME")
 
 ;Physician Info
  set att_doc_last  = substring(1,17,
    pm_hl7_provider(request->patient_data->person->encounter->attenddoc->prsnl_person_id,prv_last_name))
  set att_doc_first = substring(1,12,
    pm_hl7_provider(request->patient_data->person->encounter->attenddoc->prsnl_person_id,prv_first_name))
  set att_doc_mid   = substring(1,1,
    pm_hl7_provider(request->patient_data->person->encounter->attenddoc->prsnl_person_id,prv_middle_name))
  set att_doc_suf   = substring(1,7,
    pm_hl7_provider(request->patient_data->person->encounter->attenddoc->prsnl_person_id,prv_suffix))
  if (textlen(trim(att_doc_last)) > 0)
    set att_doc = cnvtupper(concat(trim(att_doc_last),", ",trim(att_doc_first)," ",trim(att_doc_mid)," ",trim(att_doc_suf)))
  else
    set att_doc = " "
  endif
 
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
  set pattype_dp  = substring(1,20,uar_get_code_display(request->patient_data->person->encounter->encntr_type_cd)),
  set room_dp    = uar_get_code_display(request->patient_data->PERSON->SUBSCRIBER_01->PERSON->
  HEALTH_PLAN->PLAN_INFO->FINANCIAL_CLASS_CD)
 
  select
    d.seq
  from dummyt d
  plan d
 
  detail
    d0=DetailSection(Rpt_Render)
 
  with nocounter;, noformfeed, DIO = POSTSCRIPT
  set d0 = FinalizeReport($1);"cer_print:ds.dat");request->printer_name)
 
  end
  go
 
