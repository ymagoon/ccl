  drop program cust_sch_inqa_rehab:dba go
create program cust_sch_inqa_rehab:dba
/************************************************************************
 *                                                                      *
 *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
 *                              Technology, Inc.                        *
 *       Revision      (c) 1984-2012 Cerner Corporation                 *
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
 
        Source file name:       cust_sch_inqa_rehab.prg
        Object name:            cust_sch_inqa_rehab
        Request #:
 
        Product:                Custom - Pre Built
        Product Team:           Custom - Pre Built
        HNA Version:
        CCL Version:
 
        Program purpose:        Pre-built rehab ESM inquiry
 
        Tables read:
 
        Tables updated:         None
 
        Executing from:         Scheduling
 
        Special Notes:
 
 ************************************************************************
 *                      GENERATED MODIFICATION CONTROL LOG              *
 ************************************************************************
 *                                                                      *
 *Mod Date     Engineer             Comment                             *
 *--- -------- -------------------- ----------------------------------- *
 *000 03/27/12 MC4839               Initial Release                     *
 *001 02/27/13 MC4839               Correct nbr of auth visits          *
 ************************************************************************/
 
;DEFINE REPLY RECORD STRUCTURE
free set reply
record reply
(
  1 attr_qual_cnt          = i4
  1 attr_qual[*]
    2 attr_name            = c31
    2 attr_label           = c60
    2 attr_type            = c8
    2 attr_def_seq         = i4
  1 query_qual_cnt         = i4
  1 query_qual[*]
    2 fin                  = vc
    2 name_full            = vc
    2 appt_location        = vc
    2 resource             = vc
    2 home_phone           = vc
    2 cell_phone           = vc
    2 appt_type            = vc
    2 auth_start_date      = dq8 ;Sch Auth Start Date
    2 auth_end_date        = dq8 ;Sch Auth End Date
    2 nbr_visits_auth      = i4  ;Sch Number of Auth Visits
    2 nbr_visits_unbooked  = i4  ;(calculated)
    2 nbr_visits_booked    = i4  ;(calculated)
    2 nbr_visits_checkedin = i4  ;(calculated)
    2 nbr_visits_remain    = i4  ;(calculated)
    2 plan_name            = vc  ;PM Health Plan Name
    2 plan_name2           = vc  ;Sch Health Plan Name
    2 plan_phone           = vc  ;loaded from database for health plan
    2 auth_nbr             = vc  ;Sch Auth Number
    2 hide#series_tag      = vc  ;string used to group series using person_id, appt_type_cd & auth start date
    2 hide#healthplanid    = f8  ;health_plan_id when plan loaded from health plan tables
    2 hide#scheventid      = f8
    2 hide#scheduleid      = f8
    2 hide#scheduleseq     = f8
    2 hide#oeformatid      = f8
    2 hide#statemeaning    = vc
    2 hide#encounterid     = f8
    2 hide#personid        = f8
    2 hide#bitmask         = i4
    2 hide#confirm_dt_tm   = dq8
  1 status_data
    2 status  = c1
    2 subeventstatus[1]
      3 operationname      = c25
      3 operationstatus    = c1
      3 targetobjectname   = c25
      3 targetobjectvalue  = vc
) with  persistscript
 
 
;DEFINE TEMP RECORD STRUCTURE
free set t_record
record t_record
(
  1 beg_dt_tm              = dq8
  1 end_dt_tm              = dq8
  1 location_cd            = f8
  1 locgroup_id            = f8
  1 location_qual_cnt      = i4
  1 location_qual[*]
    2 location_cd          = f8
  1 resource_cd            = f8
  1 res_group_id           = f8
  1 resource_qual_cnt      = i4
  1 resource_qual[*]
    2 resource_cd          = f8
    2 person_id            = f8
  1 person_id              = f8
 
;  1 appt[*]
;    2 name_full            = vc
;    2 home_phone           = vc
;    2 cell_phone           = vc
;    2 appt_type            = vc
;    2 auth_start_date      = dq8 ;Sch Auth Start Date
;    2 auth_end_date        = dq8 ;Sch Auth End Date
;    2 nbr_visits_auth      = i4  ;Sch Number of Auth Visits
;    2 plan_name            = vc  ;Sch Health Plan Name
;    2 plan_phone           = vc  ;loaded from database for health plan
;    2 auth_nbr             = vc  ;Sch Auth Number
;    2 series_tag           = vc  ;Series tag - unique for each person, appt type & auth start date
;    2 reply_ind            = i2  ;whether or not appt is returned in the reply
;    2 hide#scheventid      = f8
;    2 hide#scheduleid      = f8
;    2 hide#scheduleseq     = f8
;    2 hide#oeformatid      = f8
;    2 hide#statemeaning    = vc
;    2 hide#encounterid     = f8
;    2 hide#personid        = f8
;    2 hide#bitmask         = i4
;    2 hide#confirm_dt_tm   = dq8
)
 
;POPULATE PARAMETER VALUES
for (j = 1 to size(request->qual,5))
  if (request->qual[j].oe_field_meaning_id = 0)
    case (request->qual[j].oe_field_meaning)
      of "BEGDTTM":   set t_record->beg_dt_tm    = request->qual[j].oe_field_dt_tm_value
      of "ENDDTTM":   set t_record->end_dt_tm    = request->qual[j].oe_field_dt_tm_value
      of "PERSON":    set t_record->person_id    = request->qual[j].oe_field_value
      of "LOCATION":  set t_record->location_cd  = request->qual[j].oe_field_value
      of "LOCGROUP":  set t_record->locgroup_id  = request->qual[j].oe_field_value
      of "RESOURCE":  set t_record->resource_cd  = request->qual[j].oe_field_value
      of "RESGROUP":  set t_record->res_group_id = request->qual[j].oe_field_value
    endcase
  endif
endfor
 
 
;SUBROUTINE TO ADD QUERY RESULT ATTRIBUTE DEFINITION TO RECORD STRUCTURE
SUBROUTINE INC_ATTR(S_ATTR_NAME, S_ATTR_LABEL, S_ATTR_TYPE, S_ATTR_DEF_SEQ)
  set reply->attr_qual_cnt = reply->attr_qual_cnt + 1
  set stat = alterlist(reply->attr_qual,reply->attr_qual_cnt)
 
  set reply->attr_qual[reply->attr_qual_cnt].attr_name = S_ATTR_NAME
  set reply->attr_qual[reply->attr_qual_cnt].attr_label = S_ATTR_LABEL
  set reply->attr_qual[reply->attr_qual_cnt].attr_type = S_ATTR_TYPE
 
  if (S_ATTR_DEF_SEQ > 0)
    if (reply->attr_qual_cnt > 1)
      set reply->attr_qual[reply->attr_qual_cnt].attr_def_seq =
          reply->attr_qual[reply->attr_qual_cnt - 1].attr_def_seq + 1
    else
      set reply->attr_qual[reply->attr_qual_cnt].attr_def_seq = S_ATTR_DEF_SEQ
    endif
  endif
END ;INC_ATTR
 
 
;DEFINE LOCATION GROUP REQUEST/REPLY
if (not validate(get_locgroup_exp_request, 0))
  record get_locgroup_exp_request
  (
    1 security_ind     = i2
    1 call_echo_ind    = i2
    1 qual [*]
      2 sch_object_id  = f8
      2 duplicate_ind  = i2
  )
endif
if (not validate(get_locgroup_exp_reply, 0))
  record get_locgroup_exp_reply
  (
    1 qual_cnt         = i4
    1 qual [*]
      2 sch_object_id  = f8
      2 qual_cnt       = i4
      2 qual [*]
        3 location_cd  = f8
  )
endif
 
;EXPLODE THE LOCATION GROUP (IF ANY)
if (t_record->locgroup_id > 0)
  set get_locgroup_exp_request->call_echo_ind = 0
  set get_locgroup_exp_request->security_ind = 1
  set get_locgroup_exp_reply->qual_cnt = 1
  set stat = alterlist(get_locgroup_exp_request->qual, get_locgroup_exp_reply->qual_cnt)
  set get_locgroup_exp_request->qual[get_locgroup_exp_reply->qual_cnt].sch_object_id = t_record->locgroup_id
  set get_locgroup_exp_request->qual[get_locgroup_exp_reply->qual_cnt].duplicate_ind = 1
  execute sch_get_locgroup_exp
  for (i_input = 1 to get_locgroup_exp_reply->qual_cnt)
    set t_record->location_qual_cnt = get_locgroup_exp_reply->qual[i_input].qual_cnt
    set stat = alterlist(t_record->location_qual, t_record->location_qual_cnt)
    for (j_input = 1 to t_record->location_qual_cnt)
      set t_record->location_qual[j_input].location_cd
          = get_locgroup_exp_reply->qual[i_input].qual[j_input].location_cd
    endfor
  endfor
else
  set t_record->location_qual_cnt = 0
endif
 
;IF THE LOCATION QUAL IS EMPTY AND A LOCATION WAS PASSED AS A PARAMTER,
;THEN SET THE LOCATION AS THE FIRST ENTRY IN THE LOCATION GROUP
if (t_record->location_qual_cnt <= 0 and t_record->location_cd > 0)
  set t_record->location_qual_cnt = 1
  set stat = alterlist (t_record->location_qual,t_record->location_qual_cnt)
  set t_record->location_qual[1].location_cd = t_record->location_cd
endif
 
;ADD NURSE UNITS TO QUAL FOR FACILITIES IN QUAL
if (t_record->location_qual_cnt > 0)
  SELECT INTO "nl:"
  FROM (dummyt d with seq=value(t_record->location_qual_cnt)),
    nurse_unit n
  PLAN d
  JOIN n WHERE n.loc_facility_cd = t_record->location_qual[d.seq].location_cd
    AND n.active_ind = 1
    AND n.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
    AND n.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
  HEAD report
    cnt = 0
  DETAIL
    t_record->location_qual_cnt = t_record->location_qual_cnt + 1
    cnt = t_record->location_qual_cnt
    stat = alterlist(t_record->location_qual,cnt)
    t_record->location_qual[cnt].location_cd = n.location_cd
  WITH nocounter
endif
 
;DEFINE RESOURCE GROUP REQUEST/REPLY
if (not validate(get_res_group_exp_request, 0))
  record get_res_group_exp_request
  (
    1 security_ind     = i2
    1 call_echo_ind    = i2
    1 qual [*]
      2  res_group_id  = f8
      2  duplicate_ind = i2
  )
endif
if (not validate(get_res_group_exp_reply, 0))
  record get_res_group_exp_reply
  (
    1 qual_cnt         = i4
    1 qual [*]
      2 res_group_id   = f8
      2 qual_cnt       = i4
      2 qual [*]
        3 resource_cd  = f8
        3 mnemonic     = vc
  )
endif
 
;EXPLODE THE RESOURCE GROUP (IF ANY)
if (t_record->res_group_id > 0)
  set get_res_group_exp_request->call_echo_ind = 0
  set get_res_group_exp_request->security_ind = 1
  set get_res_group_exp_reply->qual_cnt = 1
  set stat = alterlist(get_res_group_exp_request->qual, get_res_group_exp_reply->qual_cnt)
  set get_res_group_exp_request->qual[get_res_group_exp_reply->qual_cnt].res_group_id = t_record->res_group_id
  set get_res_group_exp_request->qual[get_res_group_exp_reply->qual_cnt].duplicate_ind = 1
  execute sch_get_res_group_exp
  for (i_input = 1 to get_res_group_exp_reply->qual_cnt)
    set t_record->resource_qual_cnt = get_res_group_exp_reply->qual[i_input].qual_cnt
    set stat = alterlist(t_record->resource_qual, t_record->resource_qual_cnt)
    for (j_input = 1 to t_record->resource_qual_cnt)
      set t_record->resource_qual[j_input].resource_cd
          = get_res_group_exp_reply->qual[i_input].qual[j_input].resource_cd
    endfor
  endfor
else
  set t_record->resource_qual_cnt = 0
endif
 
;IF THE RESOURCE QUAL IS EMPTY AND A RESOURCE WAS PASSED AS A PARAMTER,
;THEN SET THE RESOURCE AS THE FIRST ENTRY IN THE RESOURCE GROUP
if (t_record->resource_qual_cnt <= 0 and t_record->resource_cd > 0)
  set t_record->resource_qual_cnt = 1
  set stat = alterlist (t_record->resource_qual,t_record->resource_qual_cnt)
  set t_record->resource_qual[1].resource_cd = t_record->resource_cd
endif
 
call echorecord(t_record)
 
;DEFINE DATA ELEMENTS TO BE RETURNED (MUST MATCH NAME AND TYPE IN QUERY_QUAL)
call INC_ATTR("fin",                  "FIN",                 "vc", 1)
 
if (t_record->person_id = 0.0)
  call INC_ATTR("name_full",          "Patient Name",        "vc", 1)
endif
 
if (t_record->location_qual_cnt = 0)
  call INC_ATTR("appt_location",      "Appt Location",       "vc", 1)
endif
 
if (t_record->resource_qual_cnt = 0)
  call INC_ATTR("resource",           "Resource",            "vc", 1)
endif
 
call INC_ATTR("home_phone",           "Home Phone No.",         "vc", 1)
call INC_ATTR("cell_phone",           "Cell Phone No.",         "vc", 1)
call INC_ATTR("appt_type",            "Appt Type",              "vc", 1)
call INC_ATTR("auth_start_date",      "Auth Start Date",        "dq8",1)
call INC_ATTR("auth_end_date",        "Auth End Date",          "dq8",1)
call INC_ATTR("nbr_visits_auth",      "Auth Visits",            "i4", 1)
call INC_ATTR("nbr_visits_unbooked",  "Visits Not Scheduled",   "i4", 1)
call INC_ATTR("nbr_visits_booked",    "Future Visits Scheduled","i4", 1)
call INC_ATTR("nbr_visits_checkedin", "Visits Checked In",      "i4", 1)
call INC_ATTR("nbr_visits_remain",    "Visits Remaining",       "i4", 1)
call INC_ATTR("plan_name",            "HP from Registration",   "vc", 1)
call INC_ATTR("plan_name2",           "HP from Scheduling",     "vc", 1)
call INC_ATTR("plan_phone",           "HP Phone",               "vc", 1)
call INC_ATTR("auth_nbr",             "Auth #",                 "vc", 1)
call INC_ATTR("hide#scheventid",      "HIDE#SCHEVENTID",        "f8", 0)
call INC_ATTR("hide#scheduleid",      "HIDE#SCHEDULEID",        "f8", 0)
call INC_ATTR("hide#scheduleseq",     "HIDE#SCHEDULESEQ",       "f8", 0)
call INC_ATTR("hide#oeformatid",      "HIDE#OEFORMATID",        "f8", 0)
call INC_ATTR("hide#statemeaning",    "HIDE#STATEMEANING",      "vc", 0)
call INC_ATTR("hide#encounterid",     "HIDE#ENCOUNTERID",       "f8", 0)
call INC_ATTR("hide#personid",        "HIDE#PERSONID",          "f8", 0)
call INC_ATTR("hide#bitmask",         "HIDE#BITMASK",           "i4", 0)
call INC_ATTR("hide#confirm_dt_tm",   "HIDE#CONFIRM_DT_TM",     "i4", 0)
 
;DEFINE CODE VALUES
declare HOME_CD     = f8 with protect, constant(UAR_GET_CODE_BY("MEANING",43,"HOME"))
declare CELL_CD     = f8 with protect, constant(UAR_GET_CODE_BY("MEANING",43,"MOBILE"))
declare BUSINESS_CD = f8 with protect, constant(UAR_GET_CODE_BY("MEANING",43,"BUSINESS"))
 
;GET OE_FIELD_IDs
free record oef
record oef
(
  1 qual[5]
    2 oe_field_id      = f8
    2 description      = vc
    2 meaning          = vc
)
set oef->qual[1].description = "Sch Auth Start Date"
set oef->qual[1].meaning     = "OTHER"
set oef->qual[2].description = "Sch Auth End Date"
set oef->qual[2].meaning     = "OTHER"
set oef->qual[3].description = "Sch Number of Auth Visits"
set oef->qual[3].meaning     = "OTHER"
set oef->qual[4].description = "Sch Health Plan Name"
set oef->qual[4].meaning     = "OTHER"
set oef->qual[5].description = "Sch Auth Number"
set oef->qual[5].meaning     = "SCHEDAUTHNBR"
 
SELECT INTO "nl:"
FROM (dummyt d with seq=value(size(oef->qual,5))),
  order_entry_fields oef,
  oe_field_meaning ofm
PLAN d
JOIN oef WHERE oef.description = oef->qual[d.seq].description
JOIN ofm WHERE ofm.oe_field_meaning_id = oef.oe_field_meaning_id
  AND ofm.oe_field_meaning = oef->qual[d.seq].meaning
ORDER BY d.seq, oef.updt_dt_tm
DETAIL
  oef->qual[d.seq].oe_field_id = oef.oe_field_id
WITH nocounter
call echorecord(oef)
 
;GET RESOURCE PERSON_IDs
if (t_record->resource_qual_cnt > 0)
  SELECT INTO "nl:"
  FROM (dummyt d with seq=value(t_record->resource_qual_cnt)),
    sch_resource r
  PLAN d
  JOIN r WHERE r.resource_cd = t_record->resource_qual[d.seq].resource_cd
    AND r.person_id > 0
    AND r.active_ind = 1
    AND r.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
    AND r.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
  DETAIL
    t_record->resource_qual[d.seq].person_id = r.person_id
  WITH nocounter
endif
 
;GET APPOINTMENT DATA
declare FIN_CD     = f8 with protect, constant(UAR_GET_CODE_BY("MEANING",319,"FIN NBR"))
 
if (t_record->resource_qual_cnt > 0 and t_record->location_qual_cnt > 0)
  call echo("Loading appointments by resource and location...")
%i ccluserdir:cust_sch_inqa_rehab_main_select.inc
    ,(dummyt d_loc with seq=value(t_record->location_qual_cnt))
    ,(dummyt d_res with seq=value(t_record->resource_qual_cnt))
  PLAN d_loc
  JOIN a WHERE a.resource_cd = t_record->resource_qual[d_res.seq].resource_cd
    AND a.appt_location_cd = t_record->location_qual[d_loc.seq].location_cd
    AND a.beg_dt_tm <= cnvtdatetime(t_record->end_dt_tm)
%i ccluserdir:cust_sch_inqa_rehab_main_where.inc
%i ccluserdir:cust_sch_inqa_rehab_main_rw.inc
elseif (t_record->resource_qual_cnt > 0 and t_record->location_qual_cnt <= 0)
  call echo("Loading appointments by resource...")
%i ccluserdir:cust_sch_inqa_rehab_main_select.inc
    ,(dummyt d_res with seq=value(t_record->resource_qual_cnt))
  PLAN d_res
  JOIN a WHERE a.resource_cd = t_record->resource_qual[d_res.seq].resource_cd
    AND a.beg_dt_tm <= cnvtdatetime(t_record->end_dt_tm)
%i ccluserdir:cust_sch_inqa_rehab_main_where.inc
%i ccluserdir:cust_sch_inqa_rehab_main_rw.inc
elseif (t_record->resource_qual_cnt <= 0 and t_record->location_qual_cnt > 0)
  call echo("Loading appointments by location...")
%i ccluserdir:cust_sch_inqa_rehab_main_select.inc
    ,(dummyt d_loc with seq=value(t_record->location_qual_cnt))
  PLAN d_loc
  JOIN a WHERE a.appt_location_cd = t_record->location_qual[d_loc.seq].location_cd
    AND a.beg_dt_tm <= cnvtdatetime(t_record->end_dt_tm)
%i ccluserdir:cust_sch_inqa_rehab_main_where.inc
%i ccluserdir:cust_sch_inqa_rehab_main_rw.inc
elseif (t_record->person_id > 0)
  call echo("Loading appointments by person...")
%i ccluserdir:cust_sch_inqa_rehab_main_select.inc
  PLAN a WHERE a.beg_dt_tm <= cnvtdatetime(t_record->end_dt_tm)
%i ccluserdir:cust_sch_inqa_rehab_main_where.inc
    AND a2.person_id = t_record->person_id
%i ccluserdir:cust_sch_inqa_rehab_main_rw.inc
else
  call echo("Loading appointments...")
%i ccluserdir:cust_sch_inqa_rehab_main_select.inc
  PLAN a WHERE a.beg_dt_tm <= cnvtdatetime(t_record->end_dt_tm)
%i ccluserdir:cust_sch_inqa_rehab_main_where.inc
%i ccluserdir:cust_sch_inqa_rehab_main_rw.inc
endif
 
call echo(build("total appointments loaded=",reply->query_qual_cnt))
 
if (reply->query_qual_cnt <= 0)
  go to exit_script
endif
 
;GET PLAN NAMES & PHONE NUMBERS FROM HNAM TABLES
SELECT INTO "nl:"
FROM (dummyt d with seq=value(reply->query_qual_cnt)),
  encntr_plan_reltn epr,
  health_plan hp,
  phone ph
PLAN d WHERE reply->query_qual[d.seq].hide#encounterid > 0
JOIN epr WHERE epr.encntr_id = reply->query_qual[d.seq].hide#encounterid
  AND epr.active_ind = 1
  AND epr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
  AND epr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
JOIN hp WHERE hp.health_plan_id = epr.health_plan_id
JOIN ph WHERE ph.parent_entity_name = outerjoin("HEALTH_PLAN")
  AND ph.parent_entity_id = outerjoin(hp.health_plan_id)
  AND ph.phone_type_cd = outerjoin(BUSINESS_CD)
  AND ph.active_ind = outerjoin(1)
  AND ph.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
  AND ph.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
ORDER BY d.seq, epr.priority_seq, epr.updt_dt_tm DESC, ph.phone_type_seq, ph.updt_dt_tm DESC
HEAD d.seq
  reply->query_qual[d.seq].plan_name         = hp.plan_name
  reply->query_qual[d.seq].hide#healthplanid = hp.health_plan_id
 
  if (ph.phone_num = cnvtalphanum(ph.phone_num))
    reply->query_qual[d.seq].plan_phone = cnvtphone(ph.phone_num,ph.phone_format_cd)
  else
    reply->query_qual[d.seq].plan_phone = ph.phone_num
  endif
WITH nocounter
 
;SELECT THE EVENT DETAILS (OTHER THAN APPT START DATE)
declare tmpstr = vc
 
SELECT INTO "nl:"
FROM (dummyt d with seq=value(size(reply->query_qual,5))),
  (dummyt d2 with seq=value(size(oef->qual,5))),
  sch_event_detail ed,
  order_entry_fields oe,
  oe_format_fields oef
PLAN d WHERE reply->query_qual[d.seq].hide#scheventid > 0
JOIN d2 WHERE oef->qual[d2.seq].oe_field_id > 0
  AND d2.seq > 1
JOIN ed WHERE ed.sch_event_id = reply->query_qual[d.seq].hide#scheventid
  AND ed.oe_field_id = oef->qual[d2.seq].oe_field_id
  AND ed.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
JOIN oe WHERE oe.oe_field_id = ed.oe_field_id
JOIN oef WHERE oef.oe_field_id = ed.oe_field_id
  AND oef.oe_format_id = reply->query_qual[d.seq].hide#oeformatid
ORDER by d.seq,ed.oe_field_id,ed.updt_dt_tm
DETAIL
  if (oe.description not in ("<Description#1>","<Description#2>"))
    case (oef->qual[d2.seq].description)
      of "Sch Auth End Date":
        reply->query_qual[d.seq].auth_end_date      = ed.oe_field_dt_tm_value
      of "Sch Number of Auth Visits":
;001         reply->query_qual[d.seq].nbr_visits_auth    = cnvtint(ed.oe_field_value)
;001         reply->query_qual[d.seq].nbr_visits_remain  = cnvtint(ed.oe_field_value)
        reply->query_qual[d.seq].nbr_visits_auth    = cnvtint(ed.oe_field_display_value)  ;001
        reply->query_qual[d.seq].nbr_visits_remain  = reply->query_qual[d.seq].nbr_visits_auth  ;001
      of "Sch Health Plan Name":
        reply->query_qual[d.seq].plan_name2         = ed.oe_field_display_value
      of "Sch Auth Number":
        reply->query_qual[d.seq].auth_nbr           = ed.oe_field_display_value
    endcase
  endif
WITH nocounter
 
;SELECT THE PATIENT'S PHONE NUMBERS
SELECT INTO "nl:"
FROM (dummyt d with seq=value(reply->query_qual_cnt)),
  phone p
PLAN d WHERE reply->query_qual[d.seq].hide#personid > 0
JOIN p WHERE p.parent_entity_id = reply->query_qual[d.seq].hide#personid
  AND p.parent_entity_name = "PERSON"
  AND p.phone_type_cd IN (HOME_CD, CELL_CD)
  AND p.phone_type_seq = 1
  AND p.active_ind = 1
  AND p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
  AND p.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
ORDER BY d.seq, p.phone_type_seq, p.updt_dt_tm DESC
HEAD d.seq
  case (p.phone_type_cd)
    of HOME_CD:
      if (p.phone_num = cnvtalphanum(p.phone_num))
        reply->query_qual[d.seq].home_phone = cnvtphone(p.phone_num,p.phone_format_cd)
      else
        reply->query_qual[d.seq].home_phone = p.phone_num
      endif
    of CELL_CD:
      if (p.phone_num = cnvtalphanum(p.phone_num))
        reply->query_qual[d.seq].cell_phone = cnvtphone(p.phone_num,p.phone_format_cd)
      else
        reply->query_qual[d.seq].cell_phone = p.phone_num
      endif
  endcase
WITH nocounter
 
;COUNT PATIENT'S USED APPTS IN EACH SERIES
SELECT INTO "nl:"
    sortkey = BUILD(format(a.person_id,"###############;lp0"),"|",
                    format(ev.appt_type_cd,"###############;lp0"),"|",
                    format(ed.oe_field_id,"###############;lp0"),"|",
                    format(ed.oe_field_dt_tm_value,"YYYYMMDDHHMMSS;;D"))
FROM (dummyt d with seq=value(reply->query_qual_cnt)),
  sch_appt a,
  sch_event ev,
  sch_event_detail ed
PLAN d WHERE reply->query_qual[d.seq].hide#personid > 0
JOIN a WHERE a.person_id = reply->query_qual[d.seq].hide#personid
  AND a.role_meaning = "PATIENT"
  AND a.state_meaning IN ("CONFIRMED","CHECKED IN")
  AND a.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
  AND a.active_ind = 1
  AND a.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
  AND a.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
JOIN ev WHERE ev.sch_event_id = a.sch_event_id
JOIN ed WHERE ed.sch_event_id = a.sch_event_id
  AND ed.oe_field_id = oef->qual[1].oe_field_id
  AND ed.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
ORDER BY d.seq, sortkey
HEAD report
  book_cnt = 0
  checkin_cnt = 0
HEAD d.seq
  book_cnt = 0
  checkin_cnt = 0
DETAIL
  if (sortkey = reply->query_qual[d.seq].hide#series_tag)
    case (a.state_meaning)
      of "CONFIRMED":
        book_cnt = book_cnt + 1
      of "CHECKED IN":
        checkin_cnt = checkin_cnt + 1
    endcase
  endif
FOOT d.seq
  reply->query_qual[d.seq].nbr_visits_unbooked = reply->query_qual[d.seq].nbr_visits_auth - book_cnt - checkin_cnt
  reply->query_qual[d.seq].nbr_visits_booked = book_cnt
  reply->query_qual[d.seq].nbr_visits_checkedin = checkin_cnt
 
  if (reply->query_qual[d.seq].nbr_visits_checkedin > reply->query_qual[d.seq].nbr_visits_auth)
    reply->query_qual[d.seq].nbr_visits_remain = 0
  else
    reply->query_qual[d.seq].nbr_visits_remain = reply->query_qual[d.seq].nbr_visits_auth -
                                                 reply->query_qual[d.seq].nbr_visits_checkedin
  endif
WITH nocounter
 
 
#exit_script
set reply->status_data->status = "S"
call echorecord(reply)
call echo(build(reply->query_qual_cnt))
;call echorecord(t_record)
 
end
/*
go
free set request go
record request
(
  1  call_echo_ind                     = i2
  1  program_name                      = vc
  1  file_name                         = vc
  1  file_flag                         = i2
  1  advanced_ind                      = i2
  1  report_type_cd                    = f8
  1  report_meaning                    = c12
  1  sch_report_id                     = f8
  1  to_prsnl_id                       = f8
  1  qual [*]
     2  parameter                      = vc
     2  oe_field_id                    = f8
     2  oe_field_value                 = f8
     2  oe_field_display_value         = vc
     2  oe_field_dt_tm_value           = dq8
     2  oe_field_meaning_id            = f8
     2  oe_field_meaning               = c25
     2  label_text                     = vc
) go
 
set stat = alterlist(request->qual,3) go
 
set request->qual[1].oe_field_dt_tm_value = cnvtdatetime("01-FEB-2013 00:00:00") go
set request->qual[1].oe_field_meaning = "BEGDTTM" go
 
set request->qual[2].oe_field_dt_tm_value = cnvtdatetime("28-FEB-2013 23:59:59") go
set request->qual[2].oe_field_meaning = "ENDDTTM" go
 
;set request->qual[3].oe_field_value =      706558.00 go
;set request->qual[3].oe_field_meaning = "LOCGROUP" go
 
set request->qual[3].oe_field_value = 907937.00 go
set request->qual[3].oe_field_meaning = "PERSON" go
 
 
cust_sch_inqa_rehab
*/
go