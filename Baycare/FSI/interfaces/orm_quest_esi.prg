if (oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_application = "QUESTAUTH")
If (oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_type = "ORM")

/*******Added 4-8-08 by JR to stop Add on transactions from quest************/
if (oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_application = "TOPLAB")
if (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->specimen_act_cd = "A")
set oenstatus->ignore=1
endif
endif
/*******************************************************************************************/

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
  ; Set oen_reply->ORDER_GROUP [y]->OBR_GROUP [1]->OBR->ord_provider->assign_auth_id = "SJH Dr Number"

  Set oen_reply->ORDER_GROUP [y]->OBR_GROUP [1]->OBR->ord_provider->assign_auth_id = 
	oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider->assign_auth_id

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