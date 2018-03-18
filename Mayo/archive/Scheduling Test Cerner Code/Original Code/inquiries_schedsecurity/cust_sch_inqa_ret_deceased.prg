drop program cust_sch_inqa_ret_deceased:dba go
create program cust_sch_inqa_ret_deceased:dba

/*~BB~************************************************************************
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
  ~BE~***********************************************************************/
 
/*****************************************************************************
 
        Source file name:       cust_sch_inqa_ret_deceased.prg
        Object name:            cust_sch_inqa_ret_deceased
        Request #:
 
        Product:                DCP
        Product Team:           Scheduling
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:
 
        Tables read:
 
        Tables updated:         None
        Executing from:
 
        Special Notes:
 
******************************************************************************/
 
;~DB~************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *                                                                      *
;    *Mod Date     Engineer             Comment                             *
;    *000 05/2012  Jay Widby            Modified from sch_inqa_pat_retain_deceased.prg 
;~DE~************************************************************************

set trace nocost                        ; turn off cost displaying
set message noinformation               ; turn off info displaying

if ( ( validate ( last_mod ,  "NOMOD" ) = "NOMOD" ) ) 
 declare  last_mod  =  c100  with  noconstant ( " " ), private 
endif

set  last_mod  =  "jw5489 - uar_sch_modified / custom ccl not supported by the irc/iac" 

SUBROUTINE EchoOut(echo_str)
  call echo(concat(echo_str,"  ",format(cnvtdatetime(curdate,curtime3),"MM/DD/YYYY HH:MM:SS;;D")))
END ;EchoOut

call EchoOut("initializing")
 
if (validate(ACTION_NONE,-1) != 0) 
    declare ACTION_NONE = i2 with protect, noconstant(0) 
 endif 
 if (validate(ACTION_ADD, -1) != 1) 
    declare ACTION_ADD = i2 with protect, noconstant(1) 
 endif 
 if (validate(ACTION_CHG,-1) != 2) 
    declare ACTION_CHG = i2 with protect, noconstant(2) 
 endif 
 if (validate(ACTION_DEL,-1) != 3) 
    declare ACTION_DEL = i2 with protect, noconstant(3) 
 endif 
 if (validate(ACTION_GET,-1) != 4) 
    declare ACTION_GET = i2 with protect, noconstant(4) 
 endif 
 if (validate(ACTION_INA,-1) != 5) 
    declare ACTION_INA = i2 with protect, noconstant(5) 
 endif 
 if (validate(ACTION_ACT,-1) != 6) 
    declare ACTION_ACT = i2 with protect, noconstant(6) 
 endif 
 if (validate(ACTION_TEMP,-1) != 999) 
    declare ACTION_TEMP = i2 with protect, noconstant(999) 
 endif 
 if (validate(TRUE,-1) != 1) 
    declare TRUE = i2 with protect, noconstant(1) 
 endif 
 if (validate(FALSE,-1) != 0) 
   declare FALSE = i2 with protect, noconstant(0) 
 endif 
 if (validate(GEN_NBR_ERROR,-1) != 3) 
    declare GEN_NBR_ERROR = i2 with protect, noconstant(3) 
 endif 
 if (validate(INSERT_ERROR,-1) != 4) 
    declare INSERT_ERROR = i2 with protect, noconstant(4) 
 endif 
 if (validate(UPDATE_ERROR,-1) != 5) 
    declare UPDATE_ERROR = i2 with protect, noconstant(5) 
 endif 
 if (validate(REPLACE_ERROR,-1) != 6) 
    declare REPLACE_ERROR = i2 with protect, noconstant(6) 
 endif 
 if (validate(DELETE_ERROR,-1) != 7) 
    declare DELETE_ERROR = i2 with protect, noconstant(7) 
 endif 
 if (validate(UNDELETE_ERROR,-1) != 8) 
    declare UNDELETE_ERROR = i2 with protect, noconstant(8) 
 endif 
 if (validate(REMOVE_ERROR,-1) != 9) 
    declare REMOVE_ERROR = i2 with protect, noconstant(9) 
 endif 
 if (validate(ATTRIBUTE_ERROR,-1) != 10) 
    declare ATTRIBUTE_ERROR = i2 with protect, noconstant(10) 
 endif 
 if (validate(LOCK_ERROR,-1) != 11) 
    declare LOCK_ERROR = i2 with protect, noconstant(11) 
 endif 
 if (validate(NONE_FOUND,-1) != 12) 
    declare NONE_FOUND = i2 with protect, noconstant(12) 
 endif 
 if (validate(SELECT_ERROR,-1) != 13) 
    declare SELECT_ERROR = i2 with protect, noconstant(13) 
 endif 
 if (validate(UPDATE_CNT_ERROR,-1) != 14) 
    declare UPDATE_CNT_ERROR = i2 with protect, noconstant(14) 
 endif 
 if (validate(NOT_FOUND,-1) != 15) 
    declare NOT_FOUND = i2 with protect, noconstant(15) 
 endif 
 if (validate(VERSION_INSERT_ERROR,-1) != 16) 
    declare VERSION_INSERT_ERROR = i2 with protect, noconstant(16) 
 endif 
 if (validate(INACTIVATE_ERROR,-1) != 17) 
    declare INACTIVATE_ERROR = i2 with protect, noconstant(17) 
 endif 
 if (validate(ACTIVATE_ERROR,-1) != 18) 
    declare ACTIVATE_ERROR = i2 with protect, noconstant(18) 
 endif 
 if (validate(VERSION_DELETE_ERROR,-1) != 19) 
    declare VERSION_DELETE_ERROR = i2 with protect, noconstant(19) 
 endif 
 if (validate(UAR_ERROR,-1) != 20) 
    declare UAR_ERROR = i2 with protect, noconstant(20) 
 endif 
 if (validate(DUPLICATE_ERROR,-1) != 21) 
    declare DUPLICATE_ERROR = i2 with protect, noconstant(21 )                                ;42372 
 endif 
 if (validate(CCL_ERROR,-1) != 22) 
    declare CCL_ERROR = i2 with protect, noconstant(22)                                       ;42372 
 endif 
 if (validate(EXECUTE_ERROR,-1) != 23) 
    declare EXECUTE_ERROR = i2 with protect, noconstant(23)                                   ;42372 
 endif 
 if (validate(failed,-1) != 0) 
    declare failed  = i2 with protect, noconstant(FALSE) 
 endif 
 if (validate(table_name,"ZZZ") = "ZZZ") 
    declare table_name = vc with protect, noconstant("") 
 else 
    set table_name = fillstring(100," ") 
 endif 
 if (validate(call_echo_ind,-1) != 0) 
    declare call_echo_ind = i2 with protect, noconstant(FALSE) 
 endif 
 if (validate(i_version,-1) != 0) 
    declare i_version = i2 with protect, noconstant(0) 
 endif 
 if (validate(program_name,"ZZZ") = "ZZZ") 
    declare program_name = vc with protect, noconstant(fillstring(30, " ")) 
 endif 
 if (validate(sch_security_id,-1) != 0) 
    declare sch_security_id = f8 with protect, noconstant(0.0) 
 endif 

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
   
    ;87486+ 
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
    ;87486- 
 endif    

;000 setting up security locks
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

if (  not ( validate ( get_atgroup_exp_request ,  0 ) ) ) 
 record  get_atgroup_exp_request  (
  1  security_ind  =  i2 
  1  call_echo_ind  =  i2 
  1  qual [*] 
   2  sch_object_id  =  f8 
   2  duplicate_ind  =  i2 )
endif


if (  not ( validate ( get_atgroup_exp_reply ,  0 ) ) ) 
 record  get_atgroup_exp_reply  (
  1  qual_cnt  =  i4 
  1  qual [*] 
   2  sch_object_id  =  f8 
   2  qual_cnt  =  i4 
   2  qual [*] 
    3  appt_type_cd  =  f8 )
endif


if (  not ( validate ( get_locgroup_exp_request ,  0 ) ) ) 
 record  get_locgroup_exp_request  (
  1  security_ind  =  i2 
  1  call_echo_ind  =  i2 
  1  qual [*] 
   2  sch_object_id  =  f8 
   2  duplicate_ind  =  i2 )
endif


if (  not ( validate ( get_locgroup_exp_reply ,  0 ) ) ) 
 record  get_locgroup_exp_reply  (
  1  qual_cnt  =  i4 
  1  qual [*] 
   2  sch_object_id  =  f8 
   2  qual_cnt  =  i4 
   2  qual [*] 
    3  location_cd  =  f8 )
endif


if (  not ( validate ( get_res_group_exp_request ,  0 ) ) ) 
 record  get_res_group_exp_request  (
  1  security_ind  =  i2 
  1  call_echo_ind  =  i2 
  1  qual [*] 
   2  res_group_id  =  f8 
   2  duplicate_ind  =  i2 )
endif


if (  not ( validate ( get_res_group_exp_reply ,  0 ) ) ) 
 record  get_res_group_exp_reply  (
  1  qual_cnt  =  i4 
  1  qual [*] 
   2  res_group_id  =  f8 
   2  qual_cnt  =  i4 
   2  qual [*] 
    3  resource_cd  =  f8 
    3  mnemonic  =  vc )
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

;==> Option Flag 
 ;==>    0 = Required, routine should drop an error if code_value missing 
 ;==>    1 = Optional, routine should just return 0.0 if code_value missing 
  declare loadcodevalue(code_set = i4, cdf_meaning = vc, option_flag = i2) = f8 
 declare s_cdf_meaning = c12 with public, noconstant(fillstring(12, " ")) 
 declare s_code_value = f8 with public, noconstant(0.0) 
  subroutine loadcodevalue(code_set, cdf_meaning, option_flag) 
    set s_cdf_meaning = cdf_meaning 
    set s_code_value = 0.0 
    set stat = uar_get_meaning_by_codeset(code_set, s_cdf_meaning, 1, s_code_value) 
    if (stat != 0 or s_code_value <= 0) 
       set s_code_value = 0.0 
       case (option_flag) 
          of 0: 
             set table_name = build("ERROR-->loadcodevalue (",code_set,",",'"',s_cdf_meaning,'"',",",option_flag, 
                ") not found, CURPROG [",CURPROG,"]") 
             call echo (table_name) 
             set failed = UAR_ERROR 
             go to exit_script                    ;==> the scripts calling this sub need to have a #exit_script section 
          of 1: 
             call echo (build("INFO-->loadcodevalue (",code_set,",",'"',s_cdf_meaning,'"',",",option_flag, 
                ") not found, CURPROG [",CURPROG,"]")) 
       endcase 
    else 
       call echo (build("SUCCESS-->loadcodevalue (",code_set,",",'"',s_cdf_meaning,'"',",",option_flag, 
          ") CODE_VALUE [",s_code_value,"]")) 
    endif 
    return (s_code_value) 
 end 
  
record reply
(
  1  attr_qual_cnt      = i4 
   1  attr_qual [*] 
      2  attr_name       = c31 
      2  attr_label      = c60 
      2  attr_type       = c8 
      2  attr_def_seq    = i4 
      2  attr_alt_sort_column = vc 
   1 query_qual_cnt      = i4 
   1 query_qual[*] 
    2 HIDE#SCHENTRYID = f8
    2 HIDE#REQACTIONID = f8
    2 HIDE#ACTIONID = f8
    2 HIDE#SCHAPPTID = f8
    2 HIDE#SCHEVENTID = f8
    2 HIDE#SCHEDULEID = f8
    2 HIDE#STATEMEANING = vc
    2 HIDE#ENCOUNTERID = f8
    2 HIDE#PERSONID = f8
    2 HIDE#BITMASK = i4
    2 HIDE#WAITTIMESORT = i4
    2 HIDE#REQACTIONMEANING = c12
    2 beg_dt_tm = dq8
    2 duration = i4
    2 state_display = vc
    2 appt_synonym_free = vc
    2 resource_display = vc
    2 requestor = vc
    2 person_name = vc
    2 adm_offer_outcome = vc  ;130593
    2 outcome_of_attend = vc  ;130593
    2 sched_attend = vc       ;130593
  1 status_data 
     2 status = c1 
     2 subeventstatus[1] 
       3 OperationName = c25 
       3 OperationStatus = c1 
       3 TargetObjectName = c25 
       3 TargetObjectValue = vc 
) with persistscript
 
set reply->attr_qual_cnt = 20
set stat = alterlist(reply->attr_qual, reply->attr_qual_cnt)
 
set t_index = 0
 
; This will be hidden
set t_index = t_index + 1
set reply->attr_qual[t_index]->attr_name  = "hide#schentryid"
set reply->attr_qual[t_index]->attr_label = "HIDE#SCHENTRYID"
set reply->attr_qual[t_index]->attr_type  = "f8"
 
; This will be hidden
set t_index = t_index + 1
set reply->attr_qual[t_index]->attr_name  = "hide#scheventid"
set reply->attr_qual[t_index]->attr_label = "HIDE#SCHEVENTID"
set reply->attr_qual[t_index]->attr_type  = "f8"
 
; This will be hidden
set t_index = t_index + 1
set reply->attr_qual[t_index]->attr_name  = "hide#scheduleid"
set reply->attr_qual[t_index]->attr_label = "HIDE#SCHEDULEID"
set reply->attr_qual[t_index]->attr_type  = "f8"
 
; This will be hidden
set t_index = t_index + 1
set reply->attr_qual[t_index]->attr_name  = "hide#reqactionid"
set reply->attr_qual[t_index]->attr_label = "HIDE#REQACTIONID"
set reply->attr_qual[t_index]->attr_type  = "f8"
 
; This will be hidden
set t_index = t_index + 1
set reply->attr_qual[t_index]->attr_name  = "hide#actionid"
set reply->attr_qual[t_index]->attr_label = "HIDE#ACTIONID"
set reply->attr_qual[t_index]->attr_type  = "f8"
 
; This will be hidden
set t_index = t_index + 1
set reply->attr_qual[t_index]->attr_name  = "hide#statemeaning"
set reply->attr_qual[t_index]->attr_label = "HIDE#STATEMEANING"
set reply->attr_qual[t_index]->attr_type  = "vc"
 
; This will be hidden
set t_index = t_index + 1
set reply->attr_qual[t_index]->attr_name  = "hide#reqactionmeaning"
set reply->attr_qual[t_index]->attr_label = "HIDE#REQACTIONMEANING"
set reply->attr_qual[t_index]->attr_type  = "vc"
 
; This will be hidden
set t_index = t_index + 1
set reply->attr_qual[t_index]->attr_name  = "hide#encounterid"
set reply->attr_qual[t_index]->attr_label = "HIDE#ENCOUNTERID"
set reply->attr_qual[t_index]->attr_type  = "f8"
 
; This will be hidden
set t_index = t_index + 1
set reply->attr_qual[t_index]->attr_name  = "hide#personid"
set reply->attr_qual[t_index]->attr_label = "HIDE#PERSONID"
set reply->attr_qual[t_index]->attr_type  = "f8"
 
; This will be hidden
set t_index = t_index + 1
set reply->attr_qual[t_index]->attr_name  = "hide#bitmask"
set reply->attr_qual[t_index]->attr_label = "HIDE#BITMASK"
set reply->attr_qual[t_index]->attr_type  = "i4"
 
set t_index = t_index + 1
set reply->attr_qual[t_index]->attr_name  = "person_name"
set reply->attr_qual[t_index]->attr_label = "Person Name"
set reply->attr_qual[t_index]->attr_type  = "vc"
set reply->attr_qual[t_index]->attr_def_seq = 1    ;130593
 
set t_index = t_index + 1
set reply->attr_qual[t_index]->attr_name  = "appt_synonym_free"
set reply->attr_qual[t_index]->attr_label = "Appt Type"
set reply->attr_qual[t_index]->attr_type  = "vc"
set reply->attr_qual[t_index]->attr_def_seq = 2    ;130593
 
set t_index = t_index + 1
set reply->attr_qual[t_index]->attr_name  = "resource_display"
set reply->attr_qual[t_index]->attr_label = "Resource"
set reply->attr_qual[t_index]->attr_type  = "vc"
set reply->attr_qual[t_index]->attr_def_seq = 3    ;130593
 
set t_index = t_index + 1
set reply->attr_qual[t_index]->attr_name  = "beg_dt_tm"
set reply->attr_qual[t_index]->attr_label = "Begin Date"
set reply->attr_qual[t_index]->attr_type  = "dq8"
set reply->attr_qual[t_index]->attr_def_seq = 4    ;130593
 
set t_index = t_index + 1
set reply->attr_qual[t_index]->attr_name  = "duration"
set reply->attr_qual[t_index]->attr_label = "Duration"
set reply->attr_qual[t_index]->attr_type  = "i4"
set reply->attr_qual[t_index]->attr_def_seq = 5    ;130593
 
set t_index = t_index + 1
set reply->attr_qual[t_index]->attr_name  = "state_display"
set reply->attr_qual[t_index]->attr_label = "State"
set reply->attr_qual[t_index]->attr_type  = "vc"
set reply->attr_qual[t_index]->attr_def_seq = 6    ;130593
 
set t_index = t_index + 1
set reply->attr_qual[t_index]->attr_name  = "requestor"
set reply->attr_qual[t_index]->attr_label = "Req Doctor"
set reply->attr_qual[t_index]->attr_type  = "vc"
set reply->attr_qual[t_index]->attr_def_seq = 7    ;130593
 
;130593+
set t_index = t_index + 1
set reply->attr_qual[t_index]->attr_name  = "adm_offer_outcome"
set reply->attr_qual[t_index]->attr_label = "Adm Offer Outcome"
set reply->attr_qual[t_index]->attr_type  = "vc"
 
set t_index = t_index + 1
set reply->attr_qual[t_index]->attr_name  = "outcome_of_attend"
set reply->attr_qual[t_index]->attr_label = "Outcome of Attend"
set reply->attr_qual[t_index]->attr_type  = "vc"
 
set t_index = t_index + 1
set reply->attr_qual[t_index]->attr_name  = "sched_attend"
set reply->attr_qual[t_index]->attr_label = "Sched Attend"
set reply->attr_qual[t_index]->attr_type  = "vc"
;130593-
 
set reply->query_qual_cnt = 0
set stat = alterlist(reply->query_qual, reply->query_qual_cnt)
 
 
/*****************************************************************************
*Initialize variables
******************************************************************************/
declare canceled_cd = f8 with public, constant(loadcodevalue(14233,"CANCELED",0))
declare auto_deceased_cd = f8 with public, constant(loadcodevalue(14229,"AUTODECEASED",0))

;190497++
declare dPMOSchOutcomeAttend = f8 with noconstant(0.0)
declare sSEDSchOutcomeAttend = vc with noconstant("")
declare dPMOAttendance = f8 with noconstant(0.0)
declare sSEDAttendance = vc with noconstant("")
declare dPMOSchAdmitOfferOutcome = f8 with noconstant(0.0)
declare sSEDSchAdmitOfferOutcome= vc with noconstant("")
;190497--
 
free set t_record
record t_record
(
  1 queue_id = f8
  1 person_id = f8
  1 resource_cd = f8
  1 location_cd = f8
  1 beg_dt_tm = dq8
  1 end_dt_tm = dq8
  1 atgroup_id = f8
  1 locgroup_id = f8
  1 res_group_id = f8
  1 slot_group_id = f8
  1 title = vc
  1 appttype_qual_cnt = i4
  1 appttype_qual [*]
    2 appt_type_cd = f8
  1 location_qual_cnt = i4
  1 location_qual [*]
    2 location_cd = f8
  1 resource_qual_cnt = i4
  1 resource_qual [*]
    2 resource_cd = f8
    2 person_id = f8
  1 slot_qual_cnt = i4
  1 slot_qual [*]
    2 slot_type_id = f8
  1 user_defined = vc
)
 
;==> Search thru the input list and extract the parameters
for (i_input = 1 to size(request->qual,5))
   if (request->qual[i_input]->oe_field_meaning_id = 0)
      ;==> Process the Standard Tokens
      case (request->qual[i_input]->oe_field_meaning)
         of "PERSON":
            set t_record->person_id = request->qual[i_input]->oe_field_value
         of "BEGDTTM":
            set t_record->beg_dt_tm = request->qual[i_input]->oe_field_dt_tm_value
         of "ENDDTTM":
            set t_record->end_dt_tm = request->qual[i_input]->oe_field_dt_tm_value
      endcase
   endif
endfor
 
;==> Explode the Appointment Type Group (if defined)
if (t_record->atgroup_id > 0)
   set get_atgroup_exp_request->call_echo_ind = 0
   set get_atgroup_exp_request->security_ind = 1
   set get_atgroup_exp_reply->qual_cnt = 1
   set stat = alterlist(get_atgroup_exp_request->qual, get_atgroup_exp_reply->qual_cnt)
   set get_atgroup_exp_request->qual[get_atgroup_exp_reply->qual_cnt]->sch_object_id = t_record->atgroup_id
   set get_atgroup_exp_request->qual[get_atgroup_exp_reply->qual_cnt]->duplicate_ind = 1
   execute sch_get_atgroup_exp
   for (i_input = 1 to get_atgroup_exp_reply->qual_cnt)
      set t_record->appttype_qual_cnt = get_atgroup_exp_reply->qual[i_input]->qual_cnt
      set stat = alterlist(t_record->appttype_qual, t_record->appttype_qual_cnt)
      for (j_input = 1 to t_record->appttype_qual_cnt)
         set t_record->appttype_qual[j_input]->appt_type_cd
            = get_atgroup_exp_reply->qual[i_input]->qual[j_input]->appt_type_cd
      endfor
   endfor
else
   set t_record->appttype_qual_cnt = 0
endif
 
;==> Explode the Location Group (if defined)
if (t_record->locgroup_id > 0)
   set get_locgroup_exp_request->call_echo_ind = 0
   set get_locgroup_exp_request->security_ind = 1
   set get_locgroup_exp_reply->qual_cnt = 1
   set stat = alterlist(get_locgroup_exp_request->qual, get_locgroup_exp_reply->qual_cnt)
   set get_locgroup_exp_request->qual[get_locgroup_exp_reply->qual_cnt]->sch_object_id = t_record->locgroup_id
   set get_locgroup_exp_request->qual[get_locgroup_exp_reply->qual_cnt]->duplicate_ind = 1
   execute sch_get_locgroup_exp
   for (i_input = 1 to get_locgroup_exp_reply->qual_cnt)
      set t_record->location_qual_cnt = get_locgroup_exp_reply->qual[i_input]->qual_cnt
      set stat = alterlist(t_record->location_qual, t_record->location_qual_cnt)
      for (j_input = 1 to t_record->location_qual_cnt)
         set t_record->location_qual[j_input]->location_cd
            = get_locgroup_exp_reply->qual[i_input]->qual[j_input]->location_cd
      endfor
   endfor
else
   set t_record->location_qual_cnt = 0
endif
 
;==> Explode the Resource Group (if defined)
if (t_record->res_group_id > 0)
   set get_res_group_exp_request->call_echo_ind = 0
   set get_res_group_exp_request->security_ind = 1
   set get_res_group_exp_reply->qual_cnt = 1
   set stat = alterlist(get_res_group_exp_request->qual, get_res_group_exp_reply->qual_cnt)
   set get_res_group_exp_request->qual[get_res_group_exp_reply->qual_cnt]->res_group_id = t_record->res_group_id
   set get_res_group_exp_request->qual[get_res_group_exp_reply->qual_cnt]->duplicate_ind = 1
   execute sch_get_res_group_exp
   for (i_input = 1 to get_res_group_exp_reply->qual_cnt)
      set t_record->resource_qual_cnt = get_res_group_exp_reply->qual[i_input]->qual_cnt
      set stat = alterlist(t_record->resource_qual, t_record->resource_qual_cnt)
      for (j_input = 1 to t_record->resource_qual_cnt)
         set t_record->resource_qual[j_input]->resource_cd
            = get_res_group_exp_reply->qual[i_input]->qual[j_input]->resource_cd
      endfor
   endfor
else
   set t_record->resource_qual_cnt = 0
endif
 
;==> Explode the Slot Group (if defined)
if (t_record->slot_group_id > 0)
   set get_slot_group_exp_request->call_echo_ind = 0
   set get_slot_group_exp_request->security_ind = 1
   set get_slot_group_exp_reply->qual_cnt = 1
   set stat = alterlist(get_slot_group_exp_request->qual, get_slot_group_exp_reply->qual_cnt)
   set get_slot_group_exp_request->qual[get_slot_group_exp_reply->qual_cnt]->slot_group_id = t_record->slot_group_id
   set get_slot_group_exp_request->qual[get_slot_group_exp_reply->qual_cnt]->duplicate_ind = 1
   execute sch_get_slot_group_exp
   for (i_input = 1 to get_slot_group_exp_reply->qual_cnt)
      set t_record->slot_qual_cnt = get_slot_group_exp_reply->qual[i_input]->qual_cnt
      set stat = alterlist(t_record->slot_qual, t_record->slot_qual_cnt)
      for (j_input = 1 to t_record->slot_qual_cnt)
         set t_record->slot_qual[j_input]->slot_type_id
            = get_slot_group_exp_reply->qual[i_input]->qual[j_input]->slot_type_id
      endfor
   endfor
else
   set t_record->slot_qual_cnt = 0
endif
 
free set person_record
record person_record
(
   1 qual_cnt  = i4
   1 qual [*]
     2 person_id = f8
)
 
/****************************************************************************
* Determine only person who was marked deceased and now back alive          *
*****************************************************************************/
declare s_column_exists(s_table_name = vc, s_column_name = vc) = i4 
   
 /*************************************************** 
 * Outputs: (i4) 1 - if column exists 
 *               0 - if column does not exist 
 ***************************************************/ 
 subroutine s_column_exists(s_table_name, s_column_name) 
    declare ce_flag = i4 with public, noconstant(0) 
    select into "nl:" 
       l.attr_name 
    from dtableattr a, 
       dtableattrl l 
    where a.table_name = s_table_name 
      and l.attr_name = s_column_name 
      and l.structtype = "F" 
      and btest(l.stat, 11) = 0 
    detail 
      ce_flag = 1 
    with nocounter 
    return(ce_flag) 
 end 
 ;==> For better performace, person token should be defined if the deceased person is known.
if(t_record->person_id > 0.0 and s_column_exists("PERSON_FLEX_HIST","PERSON_FLEX_HIST_ID"))
   select into "nl:"
       p.person_id,
       pfh.person_flex_hist_id
   from person p,
        person_flex_hist pfh
   plan p
   where p.person_id = t_record->person_id
     and nullind(p.deceased_dt_tm) = 1
     and p.active_ind = 1
   join pfh
   where pfh.person_id = p.person_id
     and nullind(pfh.deceased_dt_tm) = 0
   detail
     person_record->qual_cnt = person_record->qual_cnt + 1
     stat = alterlist(person_record->qual,person_record->qual_cnt)
     person_record->qual[person_record->qual_cnt]->person_id = p.person_id
   with nocounter, maxqual(pfh,1)
else
;==> Find deceased person for given date/time range if person_id is not passed in
   select distinct into "nl:"
     pm.n_person_id
   from pm_transaction pm,
        person p
   plan pm
     where pm.activity_dt_tm >= cnvtdatetime(t_record->beg_dt_tm)
       and pm.activity_dt_tm <= cnvtdatetime(t_record->end_dt_tm)
       and nullind(pm.o_deceased_dt_tm) = 0
       and nullind(pm.n_deceased_dt_tm) = 1
   join p
     where p.person_id = pm.n_person_id
       and nullind(p.deceased_dt_tm) = 1
   head report
      person_record->qual_cnt = 0
   detail
      person_record->qual_cnt = person_record->qual_cnt + 1
      if (mod(person_record->qual_cnt,10) = 1)
        stat = alterlist(person_record->qual, person_record->qual_cnt +9)
      endif
      person_record->qual[person_record->qual_cnt]->person_id = p.person_id
   foot report
      if (mod(person_record->qual_cnt,10) != 0 )
          stat = alterlist(person_record->qual, person_record->qual_cnt)
      endif
  with nocounter
endif
 
if (person_record->qual_cnt <= 0)
  go to exit_script
endif
 
/****************************************************************************
;==> Select cancelled apts                                                  *
*****************************************************************************/
select into "nl:"
   a.sch_event_id,
   ed_null = nullind(ed.candidate_id ),
   ed1_null = nullind(ed1.candidate_id ),
   sed_null = nullind(sed.candidate_id ),
   pmo_null = nullind(pmo.pm_offer_id )  ;171741
from (dummyt d with seq = value(person_record->qual_cnt)),
   sch_appt a,
   sch_event e,
   person p,
   sch_event_action ea,
   sch_event_disp ed,
   sch_event_disp ed1,
   sch_event_detail sed,  ;130593
   pm_offer pmo  ;190497
plan d where person_record->qual[d.seq]->person_id > 0
join a where
   a.person_id = person_record->qual[d.seq]->person_id
   and a.sch_state_cd = canceled_cd
   and a.role_meaning = "PATIENT"
   and a.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
join e where
   e.sch_event_id = a.sch_event_id
   and e.sch_meaning = "CANCELED"
   and e.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
join p where
   a.person_id = p.person_id
join ea where
   ea.sch_event_id = a.sch_event_id
   and ea.sch_reason_cd = auto_deceased_cd
   and ea.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
join ed where
   ed.sch_event_id = outerjoin(a.sch_event_id)
    and ed.schedule_id = outerjoin(a.schedule_id)
    and ed.disp_field_id = outerjoin(5)     ;Primary resource
    and ed.version_dt_tm = outerjoin(cnvtdatetime("31-DEC-2100 00:00:00.00"))
join ed1 where
   ed1.sch_event_id = outerjoin(a.sch_event_id)
   and ed1.schedule_id = outerjoin(a.schedule_id)
   and ed1.disp_field_id = outerjoin(8)     ;Requestor
   and ed1.version_dt_tm = outerjoin(cnvtdatetime("31-DEC-2100 00:00:00.00"))
join sed where                          ;130593
;139603   sed.sch_event_id = e.sch_event_id    ;130593
       sed.sch_event_id = outerjoin(e.sch_event_id)    ;139603
join pmo where   ;190497
   pmo.schedule_id = outerjoin(a.schedule_id)  ;190497
   and pmo.active_ind = outerjoin(1)  ;190497
order by cnvtdatetime(a.beg_dt_tm), a.sch_appt_id
head report
   reply->query_qual_cnt = 0
head a.sch_appt_id
   
 t_granted = 0
 sch_security_id = 0.0 

 t_granted_loc = 0
 sch_security_id_loc = 0.0 
 
 ;check appt type
 t_granted = uar_sch_security_insert_ex2(reqinfo->updt_id, appttype_type_cd, e.appt_type_cd, 
                                         view_action_cd, 0.0, sch_security_id, reqinfo->position_cd) 

 if (sch_security_id = 0.0 and t_granted = 0)
  t_granted = uar_sch_security_perform()
  t_granted = uar_sch_check_security_ex2(reqinfo->updt_id, appttype_type_cd,      
                                         e.appt_type_cd, view_action_cd, 0.0, sch_security_id, 
                                         reqinfo->position_cd) 
 endif

 ;check appt location
 t_granted_loc = uar_sch_security_insert_ex2(reqinfo->updt_id, location_type_cd, a.appt_location_cd, 
                                         view_action_cd, 0.0, sch_security_id_loc, reqinfo->position_cd) 

 if (sch_security_id_loc = 0.0 and t_granted_loc = 0)
  t_granted_loc = uar_sch_security_perform()
  t_granted_loc = uar_sch_check_security_ex2(reqinfo->updt_id, location_type_cd,      
                                         a.appt_location_cd, view_action_cd, 0.0, sch_security_id_loc, 
                                         reqinfo->position_cd) 
 endif
 
 if (t_granted = 1 and t_granted_loc = 1) 
   reply->query_qual_cnt = reply->query_qual_cnt + 1
   if (mod(reply->query_qual_cnt, 10) = 1)
     stat = alterlist (reply->query_qual, reply->query_qual_cnt + 9)
   endif
   reply->query_qual[reply->query_qual_cnt]->hide#scheventid = a.sch_event_id,
   reply->query_qual[reply->query_qual_cnt]->hide#scheduleid = a.schedule_id,
   reply->query_qual[reply->query_qual_cnt]->hide#statemeaning = a.state_meaning,
   reply->query_qual[reply->query_qual_cnt]->hide#encounterid = a.encntr_id,
   reply->query_qual[reply->query_qual_cnt]->hide#personid = a.person_id,
   reply->query_qual[reply->query_qual_cnt]->hide#bitmask = a.bit_mask
 
   reply->query_qual[reply->query_qual_cnt]->beg_dt_tm = cnvtdatetime(a.beg_dt_tm)
   reply->query_qual[reply->query_qual_cnt]->duration = a.duration,
   reply->query_qual[reply->query_qual_cnt]->state_display = uar_get_code_display(a.sch_state_cd)
   reply->query_qual[reply->query_qual_cnt]->appt_synonym_free = e.appt_synonym_free,
   reply->query_qual[reply->query_qual_cnt]->person_name = p.name_full_formatted,
 
   if (ed_null = 0 and a.primary_role_ind = 0)                    ;40404
      reply->query_qual[reply->query_qual_cnt]->resource_display = ed.disp_display
   endif
   if (ed1_null = 0)
      reply->query_qual[reply->query_qual_cnt]->requestor = ed1.disp_display
   endif
 
   dPMOSchOutcomeAttend = 0.0
   sSEDSchOutcomeAttend = ""
   dPMOAttendance = 0.0
   sSEDAttendance = ""
   dPMOSchAdmitOfferOutcome = 0.0
   sSEDSchAdmitOfferOutcome = ""  
 endif
detail
 if (t_granted = 1 and t_granted_loc = 1) 
   if (pmo_null = 0)
      call echo("inside pmo")
      dPMOSchAdmitOfferOutcome = pmo.admit_offer_outcome_cd
      dPMOSchOutcomeAttend = pmo.outcome_of_attendance_cd
      dPMOAttendance = pmo.attendance_cd
   endif
   if (sed_null = 0)
      if (sed.oe_field_meaning = "SCHADMITOFFEROUTCOME")
         sSEDSchAdmitOfferOutcome = sed.oe_field_display_value
      endif
      if (sed.oe_field_meaning = "SCHOUTCOMEATTEND")
         sSEDSchOutcomeAttend = sed.oe_field_display_value
      endif
      if (sed.oe_field_meaning = "SCHATTENDANCE")
         sSEDAttendance = sed.oe_field_display_value
      endif
   endif
 endif
foot a.sch_appt_id
 if (t_granted = 1 and t_granted_loc = 1) 
   ;Use data from pm_offer table if found
   if (dPMOSchAdmitOfferOutcome > 0.0)
      reply->query_qual[reply->query_qual_cnt]->adm_offer_outcome = uar_get_code_display(dPMOSchAdmitOfferOutcome)
   elseif(textlen(sSEDSchAdmitOfferOutcome) > 0)
      reply->query_qual[reply->query_qual_cnt]->adm_offer_outcome = sSEDSchAdmitOfferOutcome
   endif
      
   if (dPMOSchOutcomeAttend > 0.0) 
      reply->query_qual[reply->query_qual_cnt]->outcome_of_attend = uar_get_code_display(dPMOSchOutcomeAttend)
   elseif(textlen(sSEDSchOutcomeAttend) > 0)
      reply->query_qual[reply->query_qual_cnt]->outcome_of_attend = sSEDSchOutcomeAttend
   endif
   
   if (dPMOAttendance > 0.0)
      reply->query_qual[reply->query_qual_cnt]->sched_attend = uar_get_code_display(dPMOAttendance)
   elseif(textlen(sSEDAttendance) > 0)
      reply->query_qual[reply->query_qual_cnt]->sched_attend = sSEDAttendance
   endif
 endif
foot report
   if (mod(reply->query_qual_cnt, 10) != 0)
     stat = alterlist (reply->query_qual, reply->query_qual_cnt)
   endif
with nocounter
 
#exit_script
if (failed = FALSE)
   set reply->status_data->status = "S"
else
   set reply->status_data->status = "Z"
   if (failed != TRUE)
      case (failed)
         of SELECT_ERROR:
            set reply->status_data->subeventstatus[1]->
               operationname = "SELECT"
         else
            set reply->status_data->subeventstatus[1]->
               operationname = "UNKNOWN"
      endcase
      set reply->status_data->subeventstatus[1]->
         operationstatus = "Z"
      set reply->status_data->subeventstatus[1]->
         targetobjectname = "TABLE"
      set reply->status_data->subeventstatus[1]->
         targetobjectvalue = table_name
   endif
endif
if (request->call_echo_ind)
   call echorecord(person_record)
   call echorecord(reply)
endif
end
go
 
 
