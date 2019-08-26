/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  oru_state_newborn_in
*  Type:  Open Engine Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:  CERNER
 *  ---------------------------------------------------------------------------------------------
 */
/***********************************************************************************
 *  Mod#   Date	        Author                 Description & Requestor Information
 *
 *  1:  07/27/2016   S Parimi               CAB # 8966 implementation of Newborn Screening Results from State  
***********************************************************************************/

execute oencpm_msglog build("Beginning of oru_state_newborn_in.", char(0))

;;**************************************
;;** Variable Definition              **
;;**************************************
set ord_id = cnvtreal(oen_reply->RES_ORU_GROUP [1]->OBR->placer_ord_nbr->id)

;;***************************************
;;** MSH Segment                       **
;;***************************************
;;MSH-3
set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_application = "STATE_NEWBORN"

;;MSH-4
set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility = "6000"

;;MSH-5
;set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application = "POSTIMAGE"

;;MSH-6
set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_facility = "RLI"

Set oen_reply->CONTROL_GROUP [1]->MSH [1]->version_id = "2.3"

;;***************************************
;;** PID Segment                       **
;;***************************************

;;PID;3
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [1]->assign_fac_id = "BayCare MRN" 

;;PID-4
set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->alternate_pat_id [1]->pat_id = ""

;;PID;18
Set type_cd = uar_get_code_by("MEANING", 319, "FIN NBR")
Set pool_cd = uar_get_code_by("DISPLAY", 263, "BayCare FIN")
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->pat_id = ""

select into "nl:"
from orders o, 
        encntr_alias ea
plan o 
  where o.order_id = ord_id 
join ea
  where ea.encntr_id = o.encntr_id
  and ea.encntr_alias_type_cd = type_cd
  and ea.alias_pool_cd = pool_cd
detail
  oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->pat_id = ea.alias
  oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_fac_id = "BayCare FIN"
with nocounter


;;***************************************
;;** NK1 Segment                       **
;;***************************************
set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NK1, 0)


;;***************************************
;;** ORC Segment                       **
;;***************************************
;;ORC-1
set stat = alterlist(oen_reply->RES_ORU_GROUP [1]->ORC, 0)
set stat = alterlist(oen_reply->RES_ORU_GROUP [1]->ORC, 1)
set oen_reply->RES_ORU_GROUP [1]->ORC [1]->order_ctrl = "RE"


;;***************************************
;;** OBR Segment                       **
;;***************************************
;;OBR-2
;set oen_reply->RES_ORU_GROUP [1]->OBR->placer_ord_nbr->id =
;    oen_reply->RES_ORU_GROUP [1]->ORC [1]->placer_ord_nbr->id 
Set oen_reply->RES_ORU_GROUP [1]->OBR->placer_ord_nbr->app_id = ""
Set oen_reply->RES_ORU_GROUP [1]->OBR->placer_ord_nbr->univ_id = ""
Set oen_reply->RES_ORU_GROUP [1]->OBR->placer_ord_nbr->id_type = ""
Set oen_reply->RES_ORU_GROUP [1]->OBR->filler_ord_nbr->app_id = ""
Set oen_reply->RES_ORU_GROUP [1]->OBR->filler_ord_nbr->univ_id = ""
Set oen_reply->RES_ORU_GROUP [1]->OBR->univ_service_id->text = ""
Set oen_reply->RES_ORU_GROUP [1]->OBR->univ_service_id->coding_system = ""


;;OBR;19
select into "nl:"
from accession_order_r aor
where  aor.order_id = ord_id
detail
  oen_reply->RES_ORU_GROUP [1]->OBR->placer_field2  = aor.accession
with nocounter

;;***************************************
;;** OBX Segments                      **
;;***************************************

;;;This code will move ALL OBX under first OBR and then remove additional OBRs
For (X = 2 to size(oen_reply->RES_ORU_GROUP,5))
  Set num_obx = size(oen_reply->RES_ORU_GROUP [1]->OBX_GROUP,5)
  Set move_obx = size(oen_reply->RES_ORU_GROUP [X]->OBX_GROUP,5)
  Set stat = alterlist(oen_reply->RES_ORU_GROUP [1]->OBX_GROUP, num_obx+move_obx)

  For (Y = 1 to size(oen_reply->RES_ORU_GROUP [X]->OBX_GROUP,5))    
    Set stat = moverec(oen_reply->RES_ORU_GROUP [X]->OBX_GROUP [Y]->OBX,
                       oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [num_obx+Y]->OBX)
  EndFor
EndFor

Set stat = alterlist(oen_reply->RES_ORU_GROUP,1)

Set oen_reply->RES_ORU_GROUP [1]->OBR->result_status = "F"

for (y=1 to size(oen_reply->RES_ORU_GROUP, 5))
for (obx_index = 1 to size(oen_reply->RES_ORU_GROUP [y]->OBX_GROUP, 5))

;;;Set the Sub_id OBX;4 field
  Set oen_reply->RES_ORU_GROUP [y]->OBX_GROUP [obx_index]->OBX->set_id = cnvtstring(obx_index)
  Set oen_reply->RES_ORU_GROUP [y]->OBX_GROUP [obx_index]->OBX->observation_sub_id = 
         oen_reply->RES_ORU_GROUP [y]->OBX_GROUP [obx_index]->OBX->set_id 

;;;Set the OBX;2 field to CE if it is blank
  if (oen_reply->RES_ORU_GROUP [y]->OBX_GROUP [obx_index]->OBX->value_type = "")
     Set oen_reply->RES_ORU_GROUP [y]->OBX_GROUP [obx_index]->OBX->value_type = "CE"
  endif

;;;Set OBX;5.2 field to main result if it exist
  ;if (oen_reply->RES_ORU_GROUP [y]->OBX_GROUP [obx_index]->OBX->value_type = "CE")
  ;  if (size(oen_reply->RES_ORU_GROUP [y]->OBX_GROUP [obx_index]->OBX->observation_value [1]->value_5, 5) > 0)
  ;      Set oen_reply->RES_ORU_GROUP [y]->OBX_GROUP [obx_index]->OBX->observation_value [1]->value_1 = 
  ;            oen_reply->RES_ORU_GROUP [y]->OBX_GROUP [obx_index]->OBX->observation_value [1]->value_5 
  ;  elseif (size(oen_reply->RES_ORU_GROUP [y]->OBX_GROUP [obx_index]->OBX->observation_value [1]->value_2, 5) > 0) 
  ;      Set oen_reply->RES_ORU_GROUP [y]->OBX_GROUP [obx_index]->OBX->observation_value [1]->value_1 = 
  ;            oen_reply->RES_ORU_GROUP [y]->OBX_GROUP [obx_index]->OBX->observation_value [1]->value_2 
  ;  endif
  ;endif

  if (oen_reply->RES_ORU_GROUP [y]->OBX_GROUP [obx_index]->OBX->value_type = "CE")
    if (oen_reply->RES_ORU_GROUP [y]->OBX_GROUP [obx_index]->OBX->observation_value [1]->value_6 = "SCT")
      if (oen_reply->RES_ORU_GROUP [y]->OBX_GROUP [obx_index]->OBX->observation_value [1]->value_5 = "")
         Set oen_reply->RES_ORU_GROUP [y]->OBX_GROUP [obx_index]->OBX->observation_value [1]->value_5 = 
                oen_reply->RES_ORU_GROUP [y]->OBX_GROUP [obx_index]->OBX->observation_value [1]->value_2    
      endif
    endif
  endif

  if (oen_reply->RES_ORU_GROUP [y]->OBX_GROUP [obx_index]->OBX->value_type = "CE")
    if (oen_reply->RES_ORU_GROUP [y]->OBX_GROUP [obx_index]->OBX->observation_value [1]->value_6 = "SCT")
        Set oen_reply->RES_ORU_GROUP [y]->OBX_GROUP [obx_index]->OBX->observation_value [1]->value_1 = 
              oen_reply->RES_ORU_GROUP [y]->OBX_GROUP [obx_index]->OBX->observation_value [1]->value_5 
    else
        if (size(oen_reply->RES_ORU_GROUP [y]->OBX_GROUP [obx_index]->OBX->observation_value [1]->value_2, 5) > 0)
          Set oen_reply->RES_ORU_GROUP [y]->OBX_GROUP [obx_index]->OBX->observation_value [1]->value_1 = 
                oen_reply->RES_ORU_GROUP [y]->OBX_GROUP [obx_index]->OBX->observation_value [1]->value_2 
        endif
    endif
  endif

  if(oen_reply->RES_ORU_GROUP [y]->OBX_GROUP [obx_index]->OBX->observation_value [1]->value_1 = "")
    set oen_reply->RES_ORU_GROUP [y]->OBX_GROUP [obx_index]->OBX->observation_value [1]->value_1 = "None"
  endif

;;;Set OBX;2 field to ST for all OBX's
  if (oen_reply->RES_ORU_GROUP [y]->OBX_GROUP [obx_index]->OBX->value_type != "ED")
     Set oen_reply->RES_ORU_GROUP [y]->OBX_GROUP [obx_index]->OBX->value_type = "ST"
  endif

;;;Set OBX;11 field if it is blank
  if(oen_reply->RES_ORU_GROUP [y]->OBX_GROUP [obx_index]->OBX->observation_res_status = "")
     Set oen_reply->RES_ORU_GROUP [y]->OBX_GROUP [obx_index]->OBX->observation_res_status = "F"
  endif

;;;Set OBX;13 to name of PDF
  if (oen_reply->RES_ORU_GROUP [y]->OBX_GROUP [obx_index]->OBX->value_type = "ED")
     Set oen_reply->RES_ORU_GROUP [y]->OBX_GROUP [obx_index]->OBX->observation_dt_tm = 
           oen_reply->RES_ORU_GROUP [y]->OBR->observation_dt_tm 
     Set oen_reply->RES_ORU_GROUP [y]->OBX_GROUP [obx_index]->OBX->user_def_access_checks = "Newborn Screen.pdf"
  endif


endfor  ;obx_index
endfor  ;y

# end_of_script

execute oencpm_msglog build("End of oru_state_newborn_in.", char(0))