   if(oen_reply->MFNZFM_GROUP [1]->ZFM [1]->facility_code->identifier != "AVH")
    Set oenstatus->ignore = 1
  endif


 Set domain = cnvtupper(logical("ENVIRONMENT"))
  if (trim(domain) = "<P### Prod Environment>")
    Set oen_reply->CONTROL_GROUP [1]->MSH [1]->processing_id->proc_id = "P"
  else
    Set oen_reply->CONTROL_GROUP [1]->MSH [1]->processing_id->proc_id = "T"
  endif
  ; medstation only needs MFN in MSH.9.1
  ; Clear MSH.9.2
  ;Set oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_trigger = ""
  ; Block MFN messages if ZFM.2 contains "ITEM:"
  ; This is a drug that hasn't had a medstation interface id added yet.
  ;if (findstring("ITEM:", oen_reply->MFNZFM_GROUP [1]->ZFM [1]->item_id->identifier, 1, 0) > 0)
    ;Set oenstatus->ignore = 1
   ; execute oencpm_msglog build("No Medstation Interface ID yet - suppress", char(0))
  ;endif
  ; Block MFN updates temporarily
  ; Set oenstatus->ignore = 1
/*Move NDC to MFE-4 and ZFM-2 */

;Set oen_reply->MFNZFM_GROUP [1]->ZFM [1]->item_id->identifier = 
;oen_reply->MFNZFM_GROUP [1]->ZFM [1]->ndc_primary 
;Set oen_reply->MFNZFM_GROUP [1]->MFE [1]->prim_key_val [1]->identifier = 
;oen_reply->MFNZFM_GROUP [1]->ZFM [1]->ndc_primary 
;end NDC