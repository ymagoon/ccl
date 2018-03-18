drop program cust_sch_inqa_ordernoreq:dba go
create program cust_sch_inqa_ordernoreq:dba

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

/****************************************************************************
        Source file name:       cust_sch_inqa_ordernoreq.prg
        Object name:            cust_sch_inqa_ordernoreq
        Request #:              
        Product:                DCP
        Product Team:           Scheduling
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        Person Inquiry w/Orders
 
        Tables read:
        Tables updated:
        Executing from:
 
        Special Notes:
 
****************************************************************************/

;~DB~************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *                                                                      *
;    *Mod Date     Engineer             Comment                             *
;    *--- -------- -------------------- ----------------------------------- *
;    *000 05/2012  Jay Widby            initial release                     *
;~DE~************************************************************************

;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************

/*               READ BEFORE CALLING THE IRC/IAC                        *
 *		 This report is an unsupported client owned             *
 *		 custom script.                                         *
 *               Therefore, this script is not supported by either      *
 *                the IRC or IAC within Cerner Corporation.             *
 *		 Custom changes must be made by the IS/IT staff at      *
 *		 the individual hospital/institution.                   *
 *		 Cerner Consulting can make changes to this script      *
 *		 on a fee for services arrangement through a            *
 *		 Cerner Client Executive.                               */


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

call EchoOut("initializing")

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

call EchoOut("grabbing person info from scheduling request")
free set t_getf_record
record t_getf_record
(
  1 person_id = f8
  1 resource_cd = f8
  1 beg_dt_tm = dq8
  1 end_dt_tm = dq8
)
set t_getf_record->person_id = 0
set t_getf_record->resource_cd = 0
set t_getf_record->beg_dt_tm = 0
set t_getf_record->end_dt_tm = 0

for (i_input = 1 to size(request->qual,5))
   if (request->qual[i_input]->oe_field_meaning_id = 0)
      case (request->qual[i_input]->oe_field_meaning)
         of "PERSON":
            set t_getf_record->person_id = request->qual[i_input]->oe_field_value
         of "BEGDTTM":
            set t_getf_record->beg_dt_tm = request->qual[i_input]->oe_field_dt_tm_value
         of "ENDDTTM":
            set t_getf_record->end_dt_tm = request->qual[i_input]->oe_field_dt_tm_value
      endcase
   endif
endfor

call EchoOut(build("   PERSON_ID::",t_getf_record->person_id))
call EchoOut(concat("  BEGDTTM  [",format(t_getf_record->beg_dt_tm,"MM/DD/YYYY HH:MM:SS;;D"),"]"))
call EchoOut(concat("  ENDDTTM    [",format(t_getf_record->end_dt_tm,"MM/DD/YYYY HH:MM:SS;;D"),"]"))
call EchoOut(build("   PRSNL_ID::",reqinfo->updt_id))
call EchoOut(build("   POSITION_CD::",reqinfo->position_cd))

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
    2 beg_dt_tm = dq8
    2 duration = i4
    2 state_display = vc
    2 appt_synonym_free = vc
    2 requestor_display = vc
    2 resource_display = vc
    2 ord = vc
    2 location = vc
    2 sch_event_id = f8
    2 schedule_id = f8
    2 state_meaning = vc
    2 encntr_id = f8
    2 person_id = f8
    2 bit_mask = i4
  1 status_data
    2 status = c1
    2 subeventstatus[1]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
) with persistscript                  

set reply->status_data->status = "F" 

set reply->attr_qual_cnt = 13
set t_index = 0 
set stat = alterlist(reply->attr_qual, reply->attr_qual_cnt)

set t_index = t_index + 1
set reply->attr_qual[t_index]->attr_name  = "beg_dt_tm"
set reply->attr_qual[t_index]->attr_label = "Begin Date"
set reply->attr_qual[t_index]->attr_type  = "DQ8"

set t_index = t_index + 1
set reply->attr_qual[t_index]->attr_name  = "appt_synonym_free"
set reply->attr_qual[t_index]->attr_label = "Appt Type"
set reply->attr_qual[t_index]->attr_type  = "VC"

set t_index = t_index + 1
set reply->attr_qual[t_index]->attr_name  = "ord"
set reply->attr_qual[t_index]->attr_label = "Orders"
set reply->attr_qual[t_index]->attr_type  = "VC"

set t_index = t_index + 1
set reply->attr_qual[t_index]->attr_name  = "state_display"
set reply->attr_qual[t_index]->attr_label = "State"
set reply->attr_qual[t_index]->attr_type  = "VC"

set t_index = t_index + 1
set reply->attr_qual[t_index]->attr_name  = "duration"
set reply->attr_qual[t_index]->attr_label = "Duration"
set reply->attr_qual[t_index]->attr_type  = "I4"
      
set t_index = t_index + 1
set reply->attr_qual[t_index]->attr_name  = "location"
set reply->attr_qual[t_index]->attr_label = "Location"
set reply->attr_qual[t_index]->attr_type  = "VC"

set t_index = t_index + 1
set reply->attr_qual[t_index]->attr_name  = "resource_display"
set reply->attr_qual[t_index]->attr_label = "Resource"
set reply->attr_qual[t_index]->attr_type  = "VC"

; This will be hidden       
set t_index = t_index + 1
set reply->attr_qual[t_index]->attr_name  = "sch_event_id"
set reply->attr_qual[t_index]->attr_label = "HIDE#SCHEVENTID"
set reply->attr_qual[t_index]->attr_type  = "F8"

; This will be hidden       
set t_index = t_index + 1
set reply->attr_qual[t_index]->attr_name  = "schedule_id"
set reply->attr_qual[t_index]->attr_label = "HIDE#SCHEDULEID"
set reply->attr_qual[t_index]->attr_type  = "F8"

; This will be hidden       
set t_index = t_index + 1
set reply->attr_qual[t_index]->attr_name  = "state_meaning"
set reply->attr_qual[t_index]->attr_label = "HIDE#STATEMEANING"
set reply->attr_qual[t_index]->attr_type  = "VC"

; This will be hidden       
set t_index = t_index + 1
set reply->attr_qual[t_index]->attr_name  = "encntr_id"
set reply->attr_qual[t_index]->attr_label = "HIDE#ENCOUNTERID"
set reply->attr_qual[t_index]->attr_type  = "F8"

; This will be hidden       
set t_index = t_index + 1
set reply->attr_qual[t_index]->attr_name  = "person_id"
set reply->attr_qual[t_index]->attr_label = "HIDE#PERSONID"
set reply->attr_qual[t_index]->attr_type  = "F8"

; This will be hidden       
set t_index = t_index + 1
set reply->attr_qual[t_index]->attr_name  = "bit_mask"
set reply->attr_qual[t_index]->attr_label = "HIDE#BITMASK"
set reply->attr_qual[t_index]->attr_type  = "I4"

set reply->query_qual_cnt = 0
set stat = alterlist(reply->query_qual, reply->query_qual_cnt)

call EchoOut("finding matching appts per person_id")
         
select into "nl:"
   a.seq
from sch_appt a,
   sch_event e,
   sch_event_disp ed,
   sch_event_detail ed2,
   sch_event_attach ea

plan a 
  where a.person_id = t_getf_record->person_id
    and a.resource_cd = t_getf_record->resource_cd
    and cnvtdatetime(t_getf_record->end_dt_tm) > a.beg_dt_tm
    and cnvtdatetime(t_getf_record->beg_dt_tm) < a.end_dt_tm
    and a.role_meaning = "PATIENT"   
    and a.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
    and a.state_meaning != "RESCHEDULED"
join e 
 where e.sch_event_id = a.sch_event_id
   and e.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
join ed 
 where ed.sch_event_id = e.sch_event_id
   and ed.schedule_id = a.schedule_id
   and ed.disp_field_id = 5
   and ed.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
join ea 
 where ea.sch_event_id = e.sch_event_id
   and ea.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
   and ea.attach_type_meaning = "ORDER"
join ed2 
 where ed2.sch_event_id = outerjoin(a.sch_event_id)
   and ed2.oe_field_meaning_id = outerjoin(8)
   and ed2.version_dt_tm = outerjoin(cnvtdatetime("31-DEC-2100 00:00:00.00"))
   and ed2.active_ind = outerjoin(1)
   and ed2.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
   and ed2.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
order by cnvtdatetime(a.beg_dt_tm)
head report
   reply->query_qual_cnt = 0
detail
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
   if (mod(reply->query_qual_cnt, 100) = 1)
     stat = alterlist (reply->query_qual, reply->query_qual_cnt + 99)
   endif   
   reply->query_qual[reply->query_qual_cnt]->beg_dt_tm = cnvtdatetime(a.beg_dt_tm)
   reply->query_qual[reply->query_qual_cnt]->duration = a.duration,
   reply->query_qual[reply->query_qual_cnt]->state_display = uar_get_code_display(a.sch_state_cd)
   reply->query_qual[reply->query_qual_cnt]->appt_synonym_free = e.appt_synonym_free,
   reply->query_qual[reply->query_qual_cnt]->requestor_display = ed2.oe_field_display_value
   reply->query_qual[reply->query_qual_cnt]->ord = ea.description
   reply->query_qual[reply->query_qual_cnt]->location = uar_get_code_display(a.appt_location_cd)
   reply->query_qual[reply->query_qual_cnt]->resource_display = evaluate(a.primary_role_ind, 0, 
    ed.disp_display, 1, fillstring(40, " ")),
   reply->query_qual[reply->query_qual_cnt]->sch_event_id = a.sch_event_id,
   reply->query_qual[reply->query_qual_cnt]->schedule_id = a.schedule_id,
   reply->query_qual[reply->query_qual_cnt]->state_meaning = a.state_meaning,
   reply->query_qual[reply->query_qual_cnt]->encntr_id = a.encntr_id,
   reply->query_qual[reply->query_qual_cnt]->person_id = a.person_id,
   reply->query_qual[reply->query_qual_cnt]->bit_mask = a.bit_mask
 endif
foot report
   if (mod(reply->query_qual_cnt, 100) != 0)
     stat = alterlist (reply->query_qual, reply->query_qual_cnt)
   endif
with nocounter, orahint("INDEX(A XIE99SCH_APPT)")

call EchoOut(concat("found appts: ", cnvtstring(reply->query_qual_cnt)))
if (reply->query_qual_cnt <= 0)
 go to exit_script
endif

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
   call echorecord(reply)
endif

end go