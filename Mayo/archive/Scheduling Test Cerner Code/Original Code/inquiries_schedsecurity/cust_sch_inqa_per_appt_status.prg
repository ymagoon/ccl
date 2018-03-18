  drop program cust_sch_inqa_per_appt_status:dba go 
 create program cust_sch_inqa_per_appt_status:dba 
 /************************************************************************ 
  *                                                                      * 
  *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        * 
  *                              Technology, Inc.                        * 
  *       Revision      (c) 1984-2006 Cerner Corporation                 * 
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
   
         Source file name:       cust_sch_inqa_per_appt_status.prg 
         Object name:            cust_sch_inqa_per_appt_status 
         Request #: 
   
         Product:                Custom - Pre Built 
         Product Team:           Custom - Pre Built 
         HNA Version: 
         CCL Version: 
   
         Program purpose:        Pre-built appt status ESM inquiry 
   
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
  *000 08/25/06 Michael Chapman      Initial Release                     * 
  *001 08/22/07 Michael Chapman      Remove qual on order status         * 
  *002                                                                   * 
  *003 06/09/09 Michael Chapman      Prevent dup rows caused by dup alias* 
  *004 10/29/09 Matthew Heins        Add back in the order status qual   * 
  *                            Fix alias join issue        * 
  *005 11/01/10 Jamie Carbery        Rem'd unecessary lines, add encntr  * 
  *                                           status                     * 
  *999 05/2012  Jay Widby            add scheduling security             *
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
     2 first_ind            = i2 
     2 est_arrive_date      = vc 
     2 fin                  = vc 
     2 encntr_type          = vc 
     2 appt_date            = vc 
     2 appt_time            = vc 
     2 appt_location        = vc 
     2 appt_duration        = vc 
     2 appt_type            = vc 
     2 order_desc           = vc 
 ;    2 abn_status           = vc 
 ;    2 med_nec_state        = vc 
 ;    2 price                = vc 
 ;    2 icd9_code            = vc 
     2 appt_status          = vc 
     2 order_md             = vc 
     2 reason_exam          = vc 
     2 resource             = vc 
     2 encntr_status        = vc  /*005*/ 
     2 updt_phone           = vc 
     2 hide#scheventid      = f8 
     2 hide#scheduleid      = f8 
     2 hide#scheduleseq     = f8 
     2 hide#oeformatid      = f8 
     2 hide#statemeaning    = vc 
     2 hide#encounterid     = f8 
     2 hide#personid        = f8 
     2 hide#bitmask         = i4 
     2 hide#orderid         = f8 
   1 status_data 
     2 status  = c1 
     2 subeventstatus[1] 
       3 operationname      = c25 
       3 operationstatus    = c1 
       3 targetobjectname   = c25 
       3 targetobjectvalue  = vc 
 ) with  persistscript 
 set stat = alterlist(reply->query_qual,10) 
 
 ;999 setting up security locks
if(validate(schuar_def, 999)=999) 
    call echo("Declaring schuar_def") 
    declare schuar_def = i2 with persist 
    set schuar_def = 1 
     declare uar_sch_check_security(sec_type_cd=f8(ref), 
                                   parent1_id=f8(ref), 
                                   parent2_id=f8(ref), 
                                   parent3_id=f8(ref), 
                                   sec_id=f8(ref), 
                                   user_id=f8(ref)) = i4 
       with image_axp="shrschuar",image_aix="libshrschuar.a(libshrschuar.o)",uar="uar_sch_check_security", persist 
     declare uar_sch_security_insert(user_id=f8(ref), 
                                    sec_type_cd=f8(ref), 
                                    parent1_id=f8(ref), 
                                    parent2_id=f8(ref), 
                                    parent3_id=f8(ref), 
                                    sec_id=f8(ref)) = i4 
       with image_axp="shrschuar",image_aix="libshrschuar.a(libshrschuar.o)",uar="uar_sch_security_insert", persist 
     declare uar_sch_security_perform() = i4 
       with image_axp="shrschuar",image_aix="libshrschuar.a(libshrschuar.o)",uar="uar_sch_security_perform", persist 
     declare uar_sch_check_security_ex(user_id=f8(ref), 
                                      sec_type_cd=f8(ref), 
                                      parent1_id=f8(ref), 
                                      parent2_id=f8(ref), 
                                      parent3_id=f8(ref), 
                                      sec_id=f8(ref)) = i4 
       with image_axp="shrschuar",image_aix="libshrschuar.a(libshrschuar.o)",uar="uar_sch_check_security_ex", persist  
    declare uar_sch_check_security_ex2(user_id=f8(ref), 
                                      sec_type_cd=f8(ref), 
                                      parent1_id=f8(ref), 
                                      parent2_id=f8(ref), 
                                      parent3_id=f8(ref), 
                                      sec_id=f8(ref), 
                                      position_cd=f8(ref)) = i4 
       with image_axp="shrschuar",image_aix="libshrschuar.a(libshrschuar.o)",uar="uar_sch_check_security_ex2", persist    
    declare uar_sch_security_insert_ex2(user_id=f8(ref), 
                                    sec_type_cd=f8(ref), 
                                    parent1_id=f8(ref), 
                                    parent2_id=f8(ref), 
                                    parent3_id=f8(ref), 
                                    sec_id=f8(ref), 
                                    position_cd=f8(ref)) = i4 
       with image_axp="shrschuar",image_aix="libshrschuar.a(libshrschuar.o)",uar="uar_sch_security_insert_ex2", persist 
 endif

 declare view_action_cd = f8 with public, noconstant(0.0)
 declare appttype_type_cd = f8 with public, noconstant(0.0)
 declare location_type_cd = f8 with public, noconstant(0.0)
 
 set view_action_cd = uar_get_code_by("MEANING",16166,"VIEW")
 if (view_action_cd <= 0)
  call EchoOut("error: unable to find VIEW on 16166")
  go to exit_script
 endif
 
 set appttype_type_cd = uar_get_code_by("MEANING",16165,"APPTTYPE")
 if (appttype_type_cd <= 0)
  call EchoOut("error: unable to find APPTTYPE on 16165")
  go to exit_script
 endif
 
 set location_type_cd = uar_get_code_by("MEANING",16165,"LOCATION")
 if (location_type_cd <= 0)
  call EchoOut("error: unable to find LOCATION on 16165")
  go to exit_script
 endif
 
 if (validate(failed,-1) != 0)
    declare failed  = i2 with protect, noconstant(FALSE)
 endif
 if (validate(table_name,"ZZZ") = "ZZZ")
    declare table_name = vc with protect, noconstant("")
 else
    set table_name = fillstring(100," ")
 endif
 if (validate(t_granted,-1) != 0)
    declare t_granted = i2 with protect, noconstant(0)
 endif
 if (validate(sch_security_id,-1) != 0)
    declare sch_security_id = f8 with protect, noconstant(0.0)
 endif
 if (validate(t_granted_loc,-1) != 0)
    declare t_granted_loc = i2 with protect, noconstant(0)
 endif
 if (validate(sch_security_id_loc,-1) != 0)
    declare sch_security_id_loc = f8 with protect, noconstant(0.0)
endif
 
 ;SUBROUTINE TO ADD QUERY RESULT ATTRIBUTE DEFINITION TO RECORD STRUCTURE 
 SUBROUTINE INC_ATTR(S_ATTR_NAME, S_ATTR_LABEL, S_ATTR_TYPE, S_ATTR_DEF_SEQ) 
   set reply->attr_qual_cnt = reply->attr_qual_cnt + 1 
   set stat = alterlist(reply->attr_qual,reply->attr_qual_cnt) 
   
   set reply->attr_qual[reply->attr_qual_cnt]->attr_name = S_ATTR_NAME 
   set reply->attr_qual[reply->attr_qual_cnt]->attr_label = S_ATTR_LABEL 
   set reply->attr_qual[reply->attr_qual_cnt]->attr_type = S_ATTR_TYPE 
   
   if (S_ATTR_DEF_SEQ > 0) 
     if (reply->attr_qual_cnt > 1) 
       set reply->attr_qual[reply->attr_qual_cnt]->attr_def_seq = 
           reply->attr_qual[reply->attr_qual_cnt - 1]->attr_def_seq + 1 
     else 
       set reply->attr_qual[reply->attr_qual_cnt]->attr_def_seq = S_ATTR_DEF_SEQ 
     endif 
   endif 
 END ;INC_ATTR 
   
 ;DEFINE DATA ELEMENTS TO BE RETURNED (MUST MATCH NAME AND TYPE IN QUERY_QUAL) 
 call INC_ATTR("est_arrive_date",   "Est Arrival",       "vc", 1) 
 call INC_ATTR("fin",               "FIN",               "vc", 1) 
 call INC_ATTR("encntr_type",       "Patient Type",      "vc", 1) 
 ;call INC_ATTR("mrn",               "MRN",               "vc", 1) 
 ;call INC_ATTR("name_full",         "Patient Name",      "vc", 1) 
 call INC_ATTR("appt_date",         "Appt Date",         "vc", 1) 
 call INC_ATTR("appt_time",         "Appt Time",         "vc", 1) 
 call INC_ATTR("appt_location",     "Appt Loc",          "vc", 1) 
 call INC_ATTR("appt_duration",     "Appt Dur",          "vc", 1) 
 call INC_ATTR("appt_type",         "Appt Type",         "vc", 1) 
 call INC_ATTR("order_desc",        "Order",             "vc", 1) 
 ;call INC_ATTR("med_nec_state",     "Med Nec State",     "vc", 1) 
 ;call INC_ATTR("abn_status",        "ABN Status",        "vc", 1) 
 ;call INC_ATTR("price",             "Price",             "vc", 1) 
 ;call INC_ATTR("icd9_code",         "ICD9 Code",         "vc", 1) 
 call INC_ATTR("appt_status",       "Appt Status",       "vc", 1) 
 call INC_ATTR("order_md",          "Ordering Physician","vc", 1) 
 call INC_ATTR("reason_exam",       "Reason for Exam",   "vc", 1) 
 call INC_ATTR("resource",          "Resource",          "vc", 1) 
 call INC_ATTR("updt_phone",        "Updated Phone" ,    "vc", 1) 
 call INC_ATTR("encntr_status",     "Encounter Status" , "vc", 1)  /*005*/ 
 call INC_ATTR("hide#scheventid",   "HIDE#SCHEVENTID",   "f8", 0) 
 call INC_ATTR("hide#scheduleid",   "HIDE#SCHEDULEID",   "f8", 0) 
 call INC_ATTR("hide#scheduleseq",  "HIDE#SCHEDULESEQ",  "f8", 0) 
 call INC_ATTR("hide#oeformatid",   "HIDE#OEFORMATID",   "f8", 0) 
 call INC_ATTR("hide#statemeaning", "HIDE#STATEMEANING", "vc", 0) 
 call INC_ATTR("hide#encounterid",  "HIDE#ENCOUNTERID",  "f8", 0) 
 call INC_ATTR("hide#personid",     "HIDE#PERSONID",     "f8", 0) 
 call INC_ATTR("hide#bitmask",      "HIDE#BITMASK",      "i4", 0) 
 call INC_ATTR("hide#orderid",      "HIDE#ORDERID",      "f8", 0) 
   
free set parse_buff 
 record parse_buff 
 ( 
   1 qual_cnt    = i4 
   1 qual[*] 
     2 parse_str = vc 
 ) 
   
 SUBROUTINE ResetBuff(dummy) 
   set parse_buff->qual_cnt = 0 
   set stat = alterlist(parse_buff->qual,parse_buff->qual_cnt) 
 END ;ResetBuff 
   
 SUBROUTINE AddToBuff(parse_str) 
   set parse_buff->qual_cnt = parse_buff->qual_cnt + 1 
   set stat = alterlist(parse_buff->qual,parse_buff->qual_cnt) 
   set parse_buff->qual[parse_buff->qual_cnt]->parse_str = parse_str 
 END ;AddToBuff 
   
 SUBROUTINE PerformBuff(echo_ind) 
   for (j = 1 to parse_buff->qual_cnt) 
     if (echo_ind = 1) 
       call echo(parse_buff->qual[j]->parse_str) 
     endif 
     call parser(parse_buff->qual[j]->parse_str) 
   endfor 
 END ;PerformBuff 
 
free set sch_parms 
 record sch_parms 
 ( 
   1 queue_id                    = f8 
   1 person_id                   = f8 
   1 resource_cd                 = f8 
   1 location_cd                 = f8 
   1 beg_dt_tm                   = dq8 
   1 end_dt_tm                   = dq8 
   1 atgroup_id                  = f8 
   1 locgroup_id                 = f8 
   1 res_group_id                = f8 
   1 res_group_desc              = vc 
   1 slot_group_id               = f8 
   1 sch_event_id                = f8 
   1 schedule_id                 = f8 
   1 appttype_qual_cnt           = i4 
   1 appttype_qual[*] 
     2 appt_type_cd              = f8 
   1 location_qual_cnt           = i4 
   1 location_qual[*] 
     2 location_cd               = f8 
   1 resource_qual_cnt           = i4 
   1 resource_qual[*] 
     2 resource_cd               = f8 
     2 person_id                 = f8 
   1 slot_qual_cnt               = i4 
   1 slot_qual[*] 
     2 slot_type_id              = f8 
 ) 
   
   
 ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; 
 ;; POPULATE PARAMETER VALUES 
 ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; 
 for (i_input = 1 to size(request->qual,5)) 
   if (request->qual[i_input]->oe_field_meaning_id = 0) 
   
     ;PROCESS THE STANDARD TOKENS 
     case (request->qual[i_input]->oe_field_meaning) 
       of "QUEUE": 
         set sch_parms->queue_id = request->qual[i_input]->oe_field_value 
       of "PERSON": 
         set sch_parms->person_id = request->qual[i_input]->oe_field_value 
       of "RESOURCE": 
         set sch_parms->resource_cd = request->qual[i_input]->oe_field_value 
       of "LOCATION": 
         set sch_parms->location_cd = request->qual[i_input]->oe_field_value 
       of "BEGDTTM": 
         set sch_parms->beg_dt_tm = request->qual[i_input]->oe_field_dt_tm_value 
       of "ENDDTTM": 
         set sch_parms->end_dt_tm = request->qual[i_input]->oe_field_dt_tm_value 
       of "ATGROUP": 
         set sch_parms->atgroup_id = request->qual[i_input]->oe_field_value 
       of "LOCGROUP": 
         set sch_parms->locgroup_id = request->qual[i_input]->oe_field_value 
       of "RESGROUP": 
         set sch_parms->res_group_id = request->qual[i_input]->oe_field_value 
       of "SLOTGROUP": 
         set sch_parms->slot_group_id = request->qual[i_input]->oe_field_value 
       of "TITLE": 
         set sch_parms->title = request->qual[i_input]->oe_field_display_value 
     endcase 
   else 
     ;PROCESS THE ACCEPT FORMAT FIELDS 
     case (request->qual[i_input]->label_text) 
       of "<Label Text Goes Here>": 
         set sch_parms->user_defined = request->qual[i_input]->oe_field_display_value 
     endcase 
   endif 
 endfor 
   
   
 ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; 
 ;; DEFINE RECORD STRUCTURES FOR VARIOUS "EXPLOSIONS" 
 ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; 
 if (not validate(get_atgroup_exp_request, 0)) 
   record get_atgroup_exp_request 
   ( 
     1 security_ind     = i2 
     1 call_echo_ind    = i2 
     1 qual [*] 
       2 sch_object_id  = f8 
       2 duplicate_ind  = i2 
   ) 
 endif 
   
 if (not validate(get_atgroup_exp_reply, 0)) 
   record get_atgroup_exp_reply 
   ( 
     1 qual_cnt         = i4 
     1 qual [*] 
       2 sch_object_id  = f8 
       2 qual_cnt       = i4 
       2 qual [*] 
         3 appt_type_cd = f8 
   ) 
 endif 
   
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
   
 if (not validate(get_slot_group_exp_request, 0)) 
   record get_slot_group_exp_request 
   ( 
     1 security_ind     = i2 
     1 call_echo_ind    = i2 
     1 qual [*] 
       2 slot_group_id  = f8 
       2 duplicate_ind  = i2 
   ) 
 endif 
   
 if (not validate(get_slot_group_exp_reply, 0)) 
   record get_slot_group_exp_reply 
   ( 
     1 qual_cnt         = i4 
     1 qual [*] 
       2 slot_group_id  = f8 
       2 qual_cnt       = i4 
       2 qual [*] 
         3 slot_type_id = f8 
   ) 
 endif 
   
   
 ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; 
 ;; PERFORM VARIOUS EXPLOSIONS 
 ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; 
 ;EXPLODE THE APPOINTMENT TYPE GROUP (IF DEFINED) 
 if (sch_parms->atgroup_id > 0) 
   set get_atgroup_exp_request->call_echo_ind = 0 
   set get_atgroup_exp_request->security_ind = 1 
   set get_atgroup_exp_reply->qual_cnt = 1 
   set stat = alterlist(get_atgroup_exp_request->qual, get_atgroup_exp_reply->qual_cnt) 
   set get_atgroup_exp_request->qual[get_atgroup_exp_reply->qual_cnt]->sch_object_id = sch_parms->atgroup_id 
   set get_atgroup_exp_request->qual[get_atgroup_exp_reply->qual_cnt]->duplicate_ind = 1 
   execute sch_get_atgroup_exp 
   for (i_input = 1 to get_atgroup_exp_reply->qual_cnt) 
     set sch_parms->appttype_qual_cnt = get_atgroup_exp_reply->qual[i_input]->qual_cnt 
     set stat = alterlist(sch_parms->appttype_qual, sch_parms->appttype_qual_cnt) 
     for (j_input = 1 to sch_parms->appttype_qual_cnt) 
       set sch_parms->appttype_qual[j_input]->appt_type_cd 
           = get_atgroup_exp_reply->qual[i_input]->qual[j_input]->appt_type_cd 
     endfor 
   endfor 
 else 
   set sch_parms->appttype_qual_cnt = 0 
 endif 
   
 ;EXPLODE THE LOCATION GROUP (IF DEFINED) 
 if (sch_parms->locgroup_id > 0) 
   set get_locgroup_exp_request->call_echo_ind = 0 
   set get_locgroup_exp_request->security_ind = 1 
   set get_locgroup_exp_reply->qual_cnt = 1 
   set stat = alterlist(get_locgroup_exp_request->qual, get_locgroup_exp_reply->qual_cnt) 
   set get_locgroup_exp_request->qual[get_locgroup_exp_reply->qual_cnt]->sch_object_id = sch_parms->locgroup_id 
   set get_locgroup_exp_request->qual[get_locgroup_exp_reply->qual_cnt]->duplicate_ind = 1 
   execute sch_get_locgroup_exp 
   for (i_input = 1 to get_locgroup_exp_reply->qual_cnt) 
     set sch_parms->location_qual_cnt = get_locgroup_exp_reply->qual[i_input]->qual_cnt 
     set stat = alterlist(sch_parms->location_qual, sch_parms->location_qual_cnt) 
     for (j_input = 1 to sch_parms->location_qual_cnt) 
       set sch_parms->location_qual[j_input]->location_cd 
           = get_locgroup_exp_reply->qual[i_input]->qual[j_input]->location_cd 
     endfor 
   endfor 
 else 
   set sch_parms->location_qual_cnt = 0 
 endif 
   
 ;EXPLODE THE RESOURCE GROUP (IF DEFINED) 
 if (sch_parms->res_group_id > 0) 
   SELECT INTO "nl:" 
     desc = build(cnvtupper(r.description)) 
   FROM sch_res_group r 
   PLAN r WHERE r.res_group_id = sch_parms->res_group_id 
   DETAIL 
     sch_parms->res_group_desc = desc 
   WITH nocounter 
   
   set get_res_group_exp_request->call_echo_ind = 0 
   set get_res_group_exp_request->security_ind = 1 
   set get_res_group_exp_reply->qual_cnt = 1 
   set stat = alterlist(get_res_group_exp_request->qual, get_res_group_exp_reply->qual_cnt) 
   set get_res_group_exp_request->qual[get_res_group_exp_reply->qual_cnt]->res_group_id = sch_parms->res_group_id 
   set get_res_group_exp_request->qual[get_res_group_exp_reply->qual_cnt]->duplicate_ind = 1 
   execute sch_get_res_group_exp 
   for (i_input = 1 to get_res_group_exp_reply->qual_cnt) 
     set sch_parms->resource_qual_cnt = get_res_group_exp_reply->qual[i_input]->qual_cnt 
     set stat = alterlist(sch_parms->resource_qual, sch_parms->resource_qual_cnt) 
     for (j_input = 1 to sch_parms->resource_qual_cnt) 
       set sch_parms->resource_qual[j_input]->resource_cd 
           = get_res_group_exp_reply->qual[i_input]->qual[j_input]->resource_cd 
     endfor 
   endfor 
 else 
   set sch_parms->resource_qual_cnt = 0 
 endif 
   
 ;EXPLODE THE SLOT GROUP (IF DEFINED) 
 if (sch_parms->slot_group_id > 0) 
   set get_slot_group_exp_request->call_echo_ind = 0 
   set get_slot_group_exp_request->security_ind = 1 
   set get_slot_group_exp_reply->qual_cnt = 1 
   set stat = alterlist(get_slot_group_exp_request->qual, get_slot_group_exp_reply->qual_cnt) 
   set get_slot_group_exp_request->qual[get_slot_group_exp_reply->qual_cnt]->slot_group_id = sch_parms->slot_group_id 
   set get_slot_group_exp_request->qual[get_slot_group_exp_reply->qual_cnt]->duplicate_ind = 1 
   execute sch_get_slot_group_exp 
   for (i_input = 1 to get_slot_group_exp_reply->qual_cnt) 
     set sch_parms->slot_qual_cnt = get_slot_group_exp_reply->qual[i_input]->qual_cnt 
     set stat = alterlist(sch_parms->slot_qual, sch_parms->slot_qual_cnt) 
     for (j_input = 1 to sch_parms->slot_qual_cnt) 
       set sch_parms->slot_qual[j_input]->slot_type_id 
           = get_slot_group_exp_reply->qual[i_input]->qual[j_input]->slot_type_id 
     endfor 
   endfor 
 else 
   set sch_parms->slot_qual_cnt = 0 
 endif 
    
 ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; 
 ;; POPULATE REMAINING ITEMS 
 ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;; 
 ;IF A RESOURCE GROUP IS NOT PASSED, BUT A RESOURCE IS, SET THE RESOURCE AS THE FIRST entry in the resource group 
 if (sch_parms->resource_qual_cnt <= 0 and sch_parms->resource_cd > 0) 
   set sch_parms->resource_qual_cnt = 1 
   set stat = alterlist (sch_parms->resource_qual,sch_parms->resource_qual_cnt) 
   set sch_parms->resource_qual[1]->resource_cd = sch_parms->resource_cd 
 endif 
   
 ;FIND THE PERSON_ID FOR EACH RESOURCE IN THE RESOURCE_QUAL. 
 if (sch_parms->resource_qual_cnt > 0) 
   call EchoOut("  select resources") 
   SELECT INTO "nl:" 
     a.person_id, 
     d.seq 
   FROM (dummyt d with seq=value(sch_parms->resource_qual_cnt)), 
     sch_resource a 
   PLAN d 
   JOIN a WHERE a.resource_cd = sch_parms->resource_qual[d.seq]->resource_cd 
     AND a.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00") 
   DETAIL 
     sch_parms->resource_qual[d.seq]->person_id = a.person_id 
   WITH nocounter 
 endif 
   
 ;IF THE LOCATION QUAL IS EMPTY AND A LOCATION WAS PASSED AS A PARAMTER, 
 ;THEN SET THE LOCATION AS THE FIRST ENTRY IN THE LOCATION GROUP 
 if (sch_parms->location_qual_cnt <= 0 and sch_parms->location_cd > 0) 
   set sch_parms->location_qual_cnt = 1 
   set stat = alterlist (sch_parms->location_qual,sch_parms->location_qual_cnt) 
   set sch_parms->location_qual[1]->location_cd = sch_parms->location_cd 
 endif 
   
 ;ADD NURSE UNITS TO QUAL FOR FACILITIES IN QUAL 
 SELECT INTO "nl:" 
 FROM (dummyt d with seq=value(sch_parms->location_qual_cnt)), 
   nurse_unit n 
 PLAN d 
 JOIN n WHERE n.loc_facility_cd = sch_parms->location_qual[d.seq]->location_cd 
   AND n.active_ind = 1 
   AND n.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3) 
   AND n.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3) 
 HEAD report 
   cnt = 0 
 DETAIL 
   sch_parms->location_qual_cnt = sch_parms->location_qual_cnt + 1 
   cnt = sch_parms->location_qual_cnt 
   stat = alterlist(sch_parms->location_qual,cnt) 
   sch_parms->location_qual[cnt]->location_cd = n.location_cd 
 WITH nocounter 
   
 call echorecord(sch_parms) 
 
declare pmrn_type_cd = f8 with constant(UAR_GET_CODE_BY("MEANING",4,"MRN")) 
declare fin_type_cd  = f8 with constant(UAR_GET_CODE_BY("MEANING",319,"FIN NBR")) 
declare emrn_type_cd = f8 with constant(UAR_GET_CODE_BY("MEANING",319,"MRN")) 
declare order_type_cd   = f8 with protect, constant(UAR_GET_CODE_BY("DISPLAYKEY",16110,"ORDER")) 
   
 ;GET APPOINTMENT DATA 
 call AddToBuff('SELECT INTO "nl:"') 
 call AddToBuff('  Est_Arrival = format(e.est_arrive_dt_tm,"MM/DD/YYYY;;D"),') 
 call AddToBuff('  FIN_str = cnvtalias(fin.alias,fin.alias_pool_cd),') 
 call AddToBuff('  Encntr_Type = substring(1,50,trim(UAR_GET_CODE_DISPLAY(e.encntr_type_cd),3)),') 
 call AddToBuff('  Name_Full = substring(1,50,p.name_full_formatted),') 
 call AddToBuff('  MRN_str = cnvtalias(mrn.alias,mrn.alias_pool_cd),') 
 call AddToBuff('  Appt_Date = format(a.beg_dt_tm,"MM/DD/YYYY;;D"),') 
 call AddToBuff('  Appt_Time = format(a.beg_dt_tm,"HH:MM;;S"),') 
 call AddToBuff('  Appt_Loc = substring(1,50,trim(UAR_GET_CODE_DISPLAY(a2.appt_location_cd),3)),') 
 call AddToBuff('  Appt_Type = substring(1,50,trim(UAR_GET_CODE_DISPLAY(ev.appt_type_cd),3)),') 
 call AddToBuff('  Appt_Duration = substring(1,10,cnvtstring(a.duration)),') 
 call AddToBuff('  Order_Desc = substring(1,100,trim(b.mnemonic,3)),') 
 call AddToBuff('  Appt_Status = substring(1,50,trim(UAR_GET_CODE_DISPLAY(a.sch_state_cd),3)),') 
 call AddToBuff('  Resource = substring(1,50,trim(UAR_GET_CODE_DISPLAY(a.resource_cd),3)),') 
 call AddToBuff('  Encntr_Status = substring(1,50,trim(UAR_GET_CODE_DISPLAY(e.encntr_status_cd),3)),')  /*005*/ 
 call AddToBuff('  HIDE#SCHEVENTID = a.sch_event_id,') 
 call AddToBuff('  HIDE#SCHEDULEID = a.schedule_id,') 
 call AddToBuff('  HIDE#SCHEDULESEQ = a.schedule_seq,') 
 call AddToBuff('  HIDE#OEFORMATID = ev.oe_format_id,') 
 call AddToBuff('  HIDE#STATEMEANING = a.state_meaning,') 
 call AddToBuff('  HIDE#ENCOUNTERID = e.encntr_id,') 
 call AddToBuff('  HIDE#PERSONID = a2.person_id,') 
 call AddToBuff('  HIDE#ORDERID = at.order_id,') 
 call AddToBuff('  HIDE#BITMASK = a.bit_mask') 
 call AddToBuff('FROM sch_appt a,') 
 call AddToBuff('  sch_event ev,') 
 call AddToBuff('  sch_appt a2,') 
 call AddToBuff('  encounter e,') 
 call AddToBUff('  encntr_alias mrn,') ;004 
 call AddToBuff('  encntr_alias fin,') 
 call AddToBuff('  sch_event_attach at,') 
 call AddToBuff('  order_catalog_synonym b,') 
 call AddToBuff('  person p') 
 if (sch_parms->person_id > 0) 
   call AddToBuff('PLAN a2 WHERE a2.person_id = sch_parms->person_id') 
   call AddToBuff('  AND a2.beg_dt_tm <= cnvtdatetime(sch_parms->end_dt_tm)') 
   call AddToBuff('  AND a2.end_dt_tm >= cnvtdatetime(sch_parms->beg_dt_tm)') 
   call AddToBuff('  AND a2.role_meaning = "PATIENT"') 
   call AddToBuff('  AND a2.state_meaning NOT IN ("PENDING","CANCELED","DELETED","HOLD","RESCHEDULED")') 
   call AddToBuff('  AND a2.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")') 
   call AddToBuff('  AND a2.active_ind = 1') 
   call AddToBuff('  AND a2.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)') 
   call AddToBuff('  AND a2.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)') 
   call AddToBuff('JOIN a WHERE a.sch_event_id = a2.sch_event_id') 
   call AddToBuff('  AND a.beg_dt_tm <= cnvtdatetime(sch_parms->end_dt_tm)') 
 else 
   call AddToBuff('PLAN a WHERE a.beg_dt_tm <= cnvtdatetime(sch_parms->end_dt_tm)') 
 endif 
   
 call AddToBuff('  AND a.end_dt_tm >= cnvtdatetime(sch_parms->beg_dt_tm)') 
 call AddToBuff('  AND a.role_meaning != "PATIENT"') 
 call AddToBuff('  AND a.state_meaning NOT IN ("PENDING","CANCELED","DELETED","HOLD","RESCHEDULED")') 
 call AddToBuff('  AND a.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")') 
 call AddToBuff('  AND a.primary_role_ind = 1') 
 call AddToBuff('  AND a.active_ind = 1') 
 call AddToBuff('  AND a.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)') 
 call AddToBuff('  AND a.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)') 
 call AddToBuff('JOIN ev WHERE ev.sch_event_id = a.sch_event_id') 
   
 if (sch_parms->appttype_qual_cnt > 0) 
   call AddToBuff('  AND ev.appt_type_cd = sch_parms->appttype_qual[d_atg.seq]->appt_type_cd') 
 endif 
   
 if (sch_parms->person_id = 0) 
   call AddToBuff('JOIN a2 WHERE a2.sch_event_id = ev.sch_event_id') 
   call AddToBuff('  AND a2.role_meaning = "PATIENT"') 
   call AddToBuff('  AND a2.state_meaning NOT IN ("PENDING","CANCELED","DELETED","HOLD","RESCHEDULED")') 
   call AddToBuff('  AND a2.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")') 
   call AddToBuff('  AND a2.active_ind = 1') 
   call AddToBuff('  AND a2.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)') 
   call AddToBuff('  AND a2.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)') 
 endif 
   
 call AddToBuff('JOIN p WHERE p.person_id = a2.person_id') 
 call AddToBuff('  AND p.active_ind = 1') 
 call AddToBuff('  AND p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)') 
 call AddToBuff('  AND p.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)') 
 call AddToBuff('JOIN e WHERE e.encntr_id = outerjoin(a2.encntr_id)') 
 call AddToBuff('  AND e.active_ind = outerjoin(1)') 
 call AddToBuff('  AND e.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))') 
 call AddToBuff('  AND e.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))') 
 call AddToBuff('JOIN mrn WHERE mrn.encntr_id = outerjoin(a2.encntr_id)') ;004 
 call AddToBuff('  AND mrn.encntr_alias_type_cd = outerjoin(emrn_type_cd)') ;004 
 call AddToBuff('  AND mrn.active_ind = outerjoin(1)') 
 call AddToBuff('  AND mrn.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))') 
 call AddToBuff('  AND mrn.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))') 
 call AddToBuff('JOIN fin WHERE fin.encntr_id = outerjoin(a2.encntr_id)') 
 call AddToBuff('  AND fin.encntr_alias_type_cd = outerjoin(fin_type_cd)') 
 call AddToBuff('  AND fin.active_ind = outerjoin(1)') 
 call AddToBuff('  AND fin.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))') 
 call AddToBuff('  AND fin.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))') 
 call AddToBuff('JOIN at WHERE at.sch_event_id = outerjoin(a.sch_event_id)') 
 call AddToBuff('  AND at.attach_type_cd = outerjoin(order_type_cd)') 
 call AddToBuff('  AND at.beg_schedule_seq <= outerjoin(a.schedule_seq)') 
 call AddToBuff('  AND at.end_schedule_seq >= outerjoin(a.schedule_seq)') 
 call AddToBuff('  AND at.order_status_meaning != outerjoin("CANCELED")') ;004 
 call AddToBuff('  AND at.order_status_meaning != outerjoin("COMPLETED")') ;004 
 call AddToBuff('  AND at.order_status_meaning != outerjoin("DISCONTINUED")') ;004 
 call AddToBuff('  AND at.order_status_meaning != outerjoin("ROLLBACK")') ;004 
 call AddToBuff('  AND at.state_meaning != outerjoin("REMOVED")') ;004 
 call AddToBuff('  AND at.version_dt_tm = outerjoin(cnvtdatetime("31-DEC-2100 00:00:00.00"))') 
 call AddToBuff('  AND at.active_ind = outerjoin(1)') 
 call AddToBuff('JOIN b WHERE b.synonym_id = outerjoin(at.synonym_id)') 
 call AddToBuff('ORDER p.name_last_key, p.name_first_key, a.beg_dt_tm, a.sch_appt_id, b.mnemonic') 
 call AddToBuff('HEAD report') 
 call AddToBuff('  new_appt = 0') 
 call AddToBuff('HEAD a.sch_appt_id') 
 call AddToBuff('  new_appt = 1') 
 ;003 call AddToBuff('DETAIL') 
 call AddToBuff('HEAD b.mnemonic')  /*003*/ 
 call AddToBuff(' t_granted = 0') 
 call AddToBuff(' sch_security_id = 0.0 ') 
 call AddToBuff(' t_granted_loc = 0') 
 call AddToBuff(' sch_security_id_loc = 0.0 ') 
 call AddToBuff(' t_granted = uar_sch_security_insert_ex2(reqinfo->updt_id, appttype_type_cd, ev.appt_type_cd,  ') 
 call AddToBuff('                                       view_action_cd, 0.0, sch_security_id, reqinfo->position_cd)  ') 
 call AddToBuff(' if (sch_security_id = 0.0 and t_granted = 0) ') 
 call AddToBuff('  t_granted = uar_sch_security_perform() ') 
 call AddToBuff('  t_granted = uar_sch_check_security_ex2(reqinfo->updt_id, appttype_type_cd,       ') 
 call AddToBuff('                                       ev.appt_type_cd, view_action_cd, 0.0, sch_security_id,  ') 
 call AddToBuff('                                       reqinfo->position_cd)  ') 
 call AddToBuff(' endif ') 
 call AddToBuff(' t_granted_loc = uar_sch_security_insert_ex2(reqinfo->updt_id, location_type_cd, a2.appt_location_cd,  ') 
 call AddToBuff('                                           view_action_cd, 0.0, sch_security_id_loc, reqinfo->position_cd)  ') 
 call AddToBuff(' if (sch_security_id_loc = 0.0 and t_granted_loc = 0) ') 
 call AddToBuff('  t_granted_loc = uar_sch_security_perform() ') 
 call AddToBuff('  t_granted_loc = uar_sch_check_security_ex2(reqinfo->updt_id, location_type_cd,       ') 
 call AddToBuff('                                           a2.appt_location_cd, view_action_cd, 0.0, sch_security_id_loc,  ') 
 call AddToBuff('                                           reqinfo->position_cd)  ') 
 call AddToBuff(' endif ') 
 call AddToBuff(' if (t_granted = 1 and t_granted_loc = 1) ') 
 call AddToBuff('  reply->query_qual_cnt = reply->query_qual_cnt + 1') 
 call AddToBuff('  if (mod(reply->query_qual_cnt,10) = 1 and reply->query_qual_cnt != 1)') 
 call AddToBuff('    stat = alterlist(reply->query_qual,reply->query_qual_cnt + 10)') 
 call AddToBuff('  endif') 
 call AddToBuff('  if (new_appt = 1)') 
 call AddToBuff('   reply->query_qual[reply->query_qual_cnt]->first_ind       = 1') 
 call AddToBuff('   reply->query_qual[reply->query_qual_cnt]->est_arrive_date = Est_Arrival') 
 call AddToBuff('   reply->query_qual[reply->query_qual_cnt]->fin             = FIN_str') 
 call AddToBuff('   reply->query_qual[reply->query_qual_cnt]->encntr_type     = Encntr_Type') 
 ;call AddToBuff('   reply->query_qual[reply->query_qual_cnt]->name_full       = Name_Full') 
 ;call AddToBuff('   reply->query_qual[reply->query_qual_cnt]->mrn             = MRN_str') 
 call AddToBuff('   reply->query_qual[reply->query_qual_cnt]->appt_date       = Appt_Date') 
 call AddToBuff('   reply->query_qual[reply->query_qual_cnt]->appt_time       = Appt_Time') 
 call AddToBuff('   reply->query_qual[reply->query_qual_cnt]->appt_location   = Appt_Loc') 
 call AddToBuff('   reply->query_qual[reply->query_qual_cnt]->appt_type       = Appt_Type') 
 call AddToBuff('   reply->query_qual[reply->query_qual_cnt]->appt_duration   = Appt_Duration') 
 call AddToBuff('   reply->query_qual[reply->query_qual_cnt]->appt_status     = Appt_Status') 
 call AddToBuff('   reply->query_qual[reply->query_qual_cnt]->resource        = Resource') 
 call AddToBuff('   reply->query_qual[reply->query_qual_cnt]->encntr_status   = Encntr_Status')  /*005*/ 
 call AddToBuff('   reply->query_qual[reply->query_qual_cnt]->order_desc = Order_Desc') 
 call AddToBuff('   reply->query_qual[reply->query_qual_cnt]->hide#scheventid = HIDE#SCHEVENTID') 
 call AddToBuff('   reply->query_qual[reply->query_qual_cnt]->hide#scheduleid = HIDE#SCHEDULEID') 
 call AddToBuff('   reply->query_qual[reply->query_qual_cnt]->hide#scheduleseq = HIDE#SCHEDULESEQ') 
 call AddToBuff('   reply->query_qual[reply->query_qual_cnt]->hide#oeformatid = HIDE#OEFORMATID') 
 call AddToBuff('   reply->query_qual[reply->query_qual_cnt]->hide#statemeaning = HIDE#STATEMEANING') 
 call AddToBuff('   reply->query_qual[reply->query_qual_cnt]->hide#encounterid = HIDE#ENCOUNTERID') 
 call AddToBuff('   reply->query_qual[reply->query_qual_cnt]->hide#personid = HIDE#PERSONID') 
 call AddToBuff('   reply->query_qual[reply->query_qual_cnt]->hide#bitmask = HIDE#BITMASK') 
 call AddToBuff('   reply->query_qual[reply->query_qual_cnt]->hide#orderid = HIDE#ORDERID') 
 call AddToBuff('  endif') 
 call AddToBuff(' endif') 
 call AddToBuff(' new_appt = 0') 
 call AddToBuff('WITH nocounter go') 
 call PerformBuff(1) 
 set stat = alterlist(reply->query_qual,reply->query_qual_cnt) 
   
 ;SELECT THE EVENT DETAIL ASSOCIATED WITH THE EVENTS 
 declare ord_md_txt = vc with constant("Scheduling Ordering Physician") 
 declare reason_txt = vc with constant("Reason For Exam") 
 declare phone_txt  = vc with constant("Updated Phone") 
   
 SELECT INTO "nl:" 
 FROM (dummyt d with seq=value(reply->query_qual_cnt)), 
   order_entry_fields oe, 
   sch_event_detail ed 
 PLAN d WHERE reply->query_qual[d.seq]->hide#scheventid > 0 
   and reply->query_qual[d.seq]->first_ind = 1 
 JOIN oe WHERE oe.description IN (ord_md_txt, reason_txt, phone_txt) 
 JOIN ed WHERE ed.sch_event_id = reply->query_qual[d.seq]->hide#scheventid 
   AND ed.oe_field_id = oe.oe_field_id 
   AND ed.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00") 
   AND ed.active_ind = 1 
   AND ed.beg_effective_dt_tm <= sysdate 
   AND ed.end_effective_dt_tm >= sysdate 
 ORDER BY d.seq, ed.updt_dt_tm 
 DETAIL 
   case (oe.description) 
     of ord_md_txt:  reply->query_qual[d.seq]->order_md = ed.oe_field_display_value 
     of reason_txt:  reply->query_qual[d.seq]->reason_exam = ed.oe_field_display_value 
     of phone_txt:   reply->query_qual[d.seq]->updt_phone = ed.oe_field_display_value 
   endcase 
 WITH nocounter 

 set reply->status_data->status = "S" 
 call echorecord(reply) 
 call echo(build(reply->query_qual_cnt)) 
 ;call echorecord(sch_parms) 
   
   
 end 
 go 
 