/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name: Quest_Mod_Obj_5
 *  Description:   Lab Orders from Quest 
 *  Type:         Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Mod#  Date       Author                   Description & Requestor Information
 *
 *  1:      12/18/17  H Kaczmarczyk   Switched to v5 with a temp fix for un-aliased specimen type 2018 Upgrade issue-SR 418323022.
 *  2:      02/01/18  H Kaczmarczyk   Package 101267 was loaded on 1/31/18 to fix the issue; switched back to this script- v4.
*   3:     07/09/18   H Kaczmarczyk   Change from CPI (Historical CMRN) to BCCPI (BayCare CMRN)- RFC 5540
 *  ---------------------------------------------------------------------------------------------
*/

Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility = ""
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility = "BAYCARE"
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->pat_id = ""

If (oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_application = "QUESTAUTH")
 free set mrn_size
 set mrn_size=size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int, 5)
 for (i = 1 to mrn_size)
  If (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [i]->id_type = "MRN")
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [i]->assign_fac_id = "SJH MRN"
  endif
  If (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [i]->id_type = "BCCPI")
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [i]->assign_fac_id = "BCCPI"
  Endif
 Endfor
 Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_fac_id = "SJH FIN"
 Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->id_type = "FIN"
Endif
/****************************Added 4-8-08 by JR to stop add on transactions from Quest****************************/
;if (oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_application = "TOPLAB")
;if (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->specimen_act_cd = "A")
;set oenstatus->ignore=1
;endif
;endif
/*****************************************************************************************************/
If (oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_type = "ORM")
if (oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_application = "TOPLAB")
 Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->specimen_act_cd = ""
 Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_fac_id = "QUESTFIN"
 Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->id_type = "FIN"
 Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [1]->id_type = "MRN"
 Set oen_reply->ORDER_GROUP [1]->ORC [1]->placer_ord_nbr->id = ""
 Free set quest_orm
 Set quest_orm=size(oen_reply->ORDER_GROUP,5)
 For (q=1 to quest_orm)
  Set oen_reply->ORDER_GROUP [q]->OBR_GROUP [1]->OBR->placer_ord_nbr->id = 
    concat(oen_reply->ORDER_GROUP [q]->OBR_GROUP [1]->OBR->placer_ord_nbr->id,
       oen_reply->ORDER_GROUP [q]->OBR_GROUP [1]->OBR->univ_service_id->identifier)
 Endfor
Endif
endif



/*
if (oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_application = "QUESTAUTH")
If (oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_type = "ORM")


for(v = 1 to 13)
call pause (1)
endfor

 Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->prior_pat_loc->facility_id = "8300"
 ;Set oen_reply->ORDER_GROUP [1]->ORC [1]->order_quant_timing [1]->start_dt_tm = 
  ;oen_reply->CONTROL_GROUP [1]->MSH [1]->message_time_stamp
 ;Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->requested_dt_tm =  
  ;oen_reply->CONTROL_GROUP [1]->MSH [1]->message_time_stamp
 Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->specimen_act_cd = ""
 Set oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_type = "ORM"
 Set oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_trigger = "O01"
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->dschg_dt_tm = ""
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->other_provider [1]->id_nbr = ""

  free set quest_encntr_id
  free set quest_enc_id
  free set quest_source_cd
  declare quest_source_cd = f8
  declare quest_enc_id=f8
  declare quest_encntr_id = vc
  declare osu_alias_hold=vc
  set osu_alias_hold=oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->placer_ord_nbr->id
  set quest_encntr_id=oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->pat_id
  set quest_source_cd=uar_get_code_by("DISPLAY", 73, "Quest")
   
  select into "nl:"
    e.encntr_id
  from encntr_alias e
  where e.alias=quest_encntr_id and
    e.active_ind = 1
  detail
   quest_enc_id=e.encntr_id
  with nocounter
 set osu_count = 0
  select into "nl:"
    o.catalog_cd
  from orders o
  where o.encntr_id = cnvtint(quest_enc_id) and
    o.active_ind = 1
  detail
   osu_count = osu_count + 1
   ;osu->temp[osu_count]->cat_cd = o.catalog_cd
  with nocounter
  
 Free Record osu
 Record osu
 (
  ;1 alias_hold = vc
  1 temp [osu_count]
   2 cat_cd = f8
   2 alias_cd = vc
  )
  set stat=alterlist(oen_reply->ORDER_GROUP,osu_count)
  set osu_count=0
  select into "nl:"
    o.catalog_cd
  from orders o
  where o.encntr_id = cnvtint(quest_enc_id) and
    o.active_ind = 1
  detail
   osu_count = osu_count + 1
   osu->temp[osu_count]->cat_cd = o.catalog_cd
  with nocounter

  ;If (osu_count > 1)
  ;set stat=alterlist(oen_reply->ORDER_GROUP,osu_count)
  ;Set y = 1
  For (y = 1 to osu_count)
   select into "nl:"
    cva.alias
   from code_value_alias cva
   where
    cva.code_value = osu->temp[y]->cat_cd and
    cva.contributor_source_cd = quest_source_cd
   detail
    osu->temp[y]->alias_cd = cva.alias
   with nocounter
    set stat=alterlist(oen_reply->ORDER_GROUP,y)
   Set oen_reply->ORDER_GROUP [y]->OBR_GROUP [1]->OBR->univ_service_id->identifier=
     osu->temp[y]->alias_cd
   ;Set osu->alias_hold=oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->placer_ord_nbr->id
   Set oen_reply->ORDER_GROUP [y]->ORC [1]->order_ctrl = "SC"
   Set oen_reply->ORDER_GROUP [y]->ORC [1]->order_stat = "IP"
   Set oen_reply->ORDER_GROUP [y]->OBR_GROUP [1]->OBR->ord_provider->assign_auth_id = "SJH Dr Number"

   ;Set oen_reply->ORDER_GROUP [y]->OBR_GROUP [1]->OBR->placer_ord_nbr->id =
      ;osu->alias_hold
   Set oen_reply->ORDER_GROUP [y]->OBR_GROUP [1]->OBR->placer_ord_nbr->id = 
    concat(osu_alias_hold,
        oen_reply->ORDER_GROUP [y]->OBR_GROUP [1]->OBR->univ_service_id->identifier)
    Set oen_reply->ORDER_GROUP [y]->ORC [1]->placer_ord_nbr->id = 
       oen_reply->ORDER_GROUP [y]->OBR_GROUP [1]->OBR->placer_ord_nbr->id 
   Set oen_reply->ORDER_GROUP [y]->ORC [1]->order_quant_timing [1]->start_dt_tm = 
        oen_reply->CONTROL_GROUP [1]->MSH [1]->message_time_stamp
   Set oen_reply->ORDER_GROUP [y]->OBR_GROUP [1]->OBR->requested_dt_tm =  
        oen_reply->CONTROL_GROUP [1]->MSH [1]->message_time_stamp
   Set oen_reply->ORDER_GROUP [y]->OBR_GROUP [1]->OBR->ord_provider->id_nbr = 
         oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider->id_nbr 
  Endfor
Endif
Endif
*/
/*******************************************************************IF QUESTAUTH USED TO BE HERE****************************/

If (oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_application = "TOPLAB")
 Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_application = ""
 Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_application = "quest"
 Free set orc_top_size
 Set ord_top_size=size(oen_reply->ORDER_GROUP,5)
 For(z=1 to ord_top_size)
  Set oen_reply->ORDER_GROUP [z]->ORC [1]->order_ctrl = "NW"
  Set oen_reply->ORDER_GROUP [z]->ORC [1]->order_stat = "OH"
  Set oen_reply->ORDER_GROUP [z]->ORC [1]->ord_provider->id_nbr = "QUEST"
  Set oen_reply->ORDER_GROUP [z]->ORC [1]->ord_provider->assign_auth_id = "SJH Dr Number"
 Endfor
 Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->referring_doc [1]->id_nbr = ""
 Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->readmission_ind = ""
 Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->patient_type = ""
 Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [1]->assign_fac_id = "QUESTMRN"
 Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [1]->id_type = "MRN"
Endif


If (oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_trigger = "A34")
 Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->MRG [1]->prior_pat_id_int [1]->assign_fac_id = "QUESTMRN"
 Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->MRG [1]->prior_pat_id_int [1]->id_type = "MRN"
 Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_fac_id = "SJH FIN"
 Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->id_type = "FIN"
Endif


If (oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_trigger = "A35")
 Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->MRG [1]->prior_pat_id_int [1]->assign_fac_id = "SJH MRN"
 Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->MRG [1]->prior_pat_acct_nbr->assign_fac_id = "QUESTFIN"
 Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->MRG [1]->prior_pat_acct_nbr->id_type = "FIN"
Endif