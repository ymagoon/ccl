/*
*  ---------------------------------------------------------------------------------------------
*  Script Name:  mobj_ambquest_orm_out
*  Description:  Modify Object Script for Amb Quest Msgs Outbound - OrderGroup Cleanup
*  Type:  Open Engine Modify Object Script
*  ---------------------------------------------------------------------------------------------
*  Author:  FSI
*  Domain:  All
*  ---------------------------------------------------------------------------------------------
*
* 11/21/16   Sailaja Parimi   Coding to clear cc Provider info from OBR;28
*/
/**************************************************************/
;                 Site specific variable declaration
Declare ord_cntr_id = vc		;ORC 1
Declare Doc_Type = vc			;Value to indicate which doctor ID that will be sent

Set ord_cntr_id = "NW"			;CS 6004  to New Order
Set Doc_Type = "NPI"			;CS 263   This alias_pool must exist to be aliased - Quest requires NPI

;NOTE
; if DRG_TYPE "Diagnosis to Order" is not aliased to SEND_OUT on cs 23549, the DG1 segment will be removed.
; if it is, clear the DRG_TYPE field before sending.

; End of Site Specific Coding
/**************************************************************/


declare current_program = vc
Set current_program = curprog
execute oencpm_msglog build("In-", current_program, char(0))

declare ord_sz = i4
declare ord_x = i4
Set ord_sz = size(oen_reply->ORDER_GROUP, 5)
Set ord_x = 1

while (ord_x <= ord_sz)

  ; ORC Segment
  ; Extend ORC Segment size by 1, and move values needed into it
  Set stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->ORC, 2)

  ; ORC.1 - Set to "NW"
  Set oen_reply->ORDER_GROUP [ord_x]->ORC [2]->order_ctrl = ord_cntr_id

  ; ORC.10 - Send NPI, if present.
  ; If not, just send name components
  declare orc10_sz = i4
  declare orc10_x = i4
  declare norc10_sz = i4
  Set orc10_sz = size(oen_reply->ORDER_GROUP [ord_x]->ORC [1]->entered_by, 5)
  Set orc10_x = 1
  Set norc10_sz = 0

  while (orc10_x <= orc10_sz)
execute oencpm_msglog build("Entered By Ass_Auth_ID ->",
oen_reply->ORDER_GROUP [ord_x]->ORC [1]->entered_by [orc10_x]->assign_auth->name_id , char(0))
    if (trim(oen_reply->ORDER_GROUP [ord_x]->ORC [1]->entered_by [orc10_x]->assign_auth->name_id) = Doc_Type)
      Set norc10_sz = norc10_sz + 1
      Set stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->ORC [2]->entered_by, norc10_sz)

      Set oen_reply->ORDER_GROUP [ord_x]->ORC [2]->entered_by [norc10_sz]->id_nbr =
        trim(oen_reply->ORDER_GROUP [ord_x]->ORC [1]->entered_by [orc10_x]->id_nbr)
      Set oen_reply->ORDER_GROUP [ord_x]->ORC [2]->entered_by [norc10_sz]->last_name =
        trim(oen_reply->ORDER_GROUP [ord_x]->ORC [1]->entered_by [orc10_x]->last_name)
      Set oen_reply->ORDER_GROUP [ord_x]->ORC [2]->entered_by [norc10_sz]->first_name =
        trim(oen_reply->ORDER_GROUP [ord_x]->ORC [1]->entered_by [orc10_x]->first_name)
      Set oen_reply->ORDER_GROUP [ord_x]->ORC [2]->entered_by [norc10_sz]->middle_name =
        trim(oen_reply->ORDER_GROUP [ord_x]->ORC [1]->entered_by [orc10_x]->middle_name)
      Set oen_reply->ORDER_GROUP [ord_x]->ORC [2]->entered_by [norc10_sz]->assign_auth->name_id =
        trim(oen_reply->ORDER_GROUP [ord_x]->ORC [1]->entered_by [orc10_x]->assign_auth->name_id)
    endif
    Set orc10_x = orc10_x + 1
  endwhile

  if ((norc10_sz = 0) AND (orc10_sz > 0))
      ; Send Name Components only if no NPI was moved and there was a provider populated in the field.
      Set stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->ORC [2]->entered_by, 1)

      Set oen_reply->ORDER_GROUP [ord_x]->ORC [2]->entered_by [1]->last_name =
        trim(oen_reply->ORDER_GROUP [ord_x]->ORC [1]->entered_by [1]->last_name)
      Set oen_reply->ORDER_GROUP [ord_x]->ORC [2]->entered_by [1]->first_name =
        trim(oen_reply->ORDER_GROUP [ord_x]->ORC [1]->entered_by [1]->first_name)
      Set oen_reply->ORDER_GROUP [ord_x]->ORC [2]->entered_by [1]->middle_name =
        trim(oen_reply->ORDER_GROUP [ord_x]->ORC [1]->entered_by [1]->middle_name)
  endif

  ; ORC.11 - Send NPI, if present.
  ; If not, just send name components
  declare orc11_sz = i4
  declare orc11_x = i4
  declare norc11_sz = i4
  Set orc11_sz = size(oen_reply->ORDER_GROUP [ord_x]->ORC [1]->verified_by, 5)
  Set orc11_x = 1
  Set norc11_sz = 0

  while (orc11_x <= orc11_sz)
execute oencpm_msglog build("Verified By Ass_Auth_ID ->",
oen_reply->ORDER_GROUP [ord_x]->ORC [1]->verified_by [orc11_x]->assign_auth->name_id , char(0))

    if (trim(oen_reply->ORDER_GROUP [ord_x]->ORC [1]->verified_by [orc11_x]->assign_auth->name_id) = Doc_Type)
      Set norc11_sz = norc11_sz + 1
      Set stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->ORC [2]->verified_by, norc11_sz)

      Set oen_reply->ORDER_GROUP [ord_x]->ORC [2]->verified_by [norc11_sz]->id_nbr =
        trim(oen_reply->ORDER_GROUP [ord_x]->ORC [1]->verified_by [orc11_x]->id_nbr)
      Set oen_reply->ORDER_GROUP [ord_x]->ORC [2]->verified_by [norc11_sz]->last_name =
        trim(oen_reply->ORDER_GROUP [ord_x]->ORC [1]->verified_by [orc11_x]->last_name)
      Set oen_reply->ORDER_GROUP [ord_x]->ORC [2]->verified_by [norc11_sz]->first_name =
        trim(oen_reply->ORDER_GROUP [ord_x]->ORC [1]->verified_by [orc11_x]->first_name)
      Set oen_reply->ORDER_GROUP [ord_x]->ORC [2]->verified_by [norc11_sz]->middle_name =
        trim(oen_reply->ORDER_GROUP [ord_x]->ORC [1]->verified_by [orc11_x]->middle_name)
      Set oen_reply->ORDER_GROUP [ord_x]->ORC [2]->verified_by [norc11_sz]->assign_auth->name_id =
        trim(oen_reply->ORDER_GROUP [ord_x]->ORC [1]->verified_by [orc11_x]->assign_auth->name_id)
    endif
    Set orc11_x = orc11_x + 1
  endwhile

  if ((norc11_sz = 0) AND (orc11_sz > 0))
      ; Send Name Components only if no NPI was moved and there was a provider populated in the field.
      Set stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->ORC [2]->verified_by, 1)

      Set oen_reply->ORDER_GROUP [ord_x]->ORC [2]->verified_by [1]->last_name =
        trim(oen_reply->ORDER_GROUP [ord_x]->ORC [1]->verified_by [1]->last_name)
      Set oen_reply->ORDER_GROUP [ord_x]->ORC [2]->verified_by [1]->first_name =
        trim(oen_reply->ORDER_GROUP [ord_x]->ORC [1]->verified_by [1]->first_name)
      Set oen_reply->ORDER_GROUP [ord_x]->ORC [2]->verified_by [1]->middle_name =
        trim(oen_reply->ORDER_GROUP [ord_x]->ORC [1]->verified_by [1]->middle_name)
  endif

  ; ORC.12 - Send NPI, if present.
  ; If not, just send name components
  declare orc12_sz = i4
  declare orc12_x = i4
  declare norc12_sz = i4
  Set orc12_sz = size(oen_reply->ORDER_GROUP [ord_x]->ORC [1]->ord_provider, 5)
  Set orc12_x = 1
  Set norc12_sz = 0

  while (orc12_x <= orc12_sz)
execute oencpm_msglog build("Ord Prov Ass_Auth_ID ->",
oen_reply->ORDER_GROUP [ord_x]->ORC [1]->ord_provider [orc12_x]->assign_auth->name_id, char(0))
    if (trim(oen_reply->ORDER_GROUP [ord_x]->ORC [1]->ord_provider [orc12_x]->assign_auth->name_id) = Doc_Type)
      Set norc12_sz = norc12_sz + 1
      Set stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->ORC [2]->ord_provider, norc12_sz)

      Set oen_reply->ORDER_GROUP [ord_x]->ORC [2]->ord_provider [norc12_sz]->id_nbr =
        trim(oen_reply->ORDER_GROUP [ord_x]->ORC [1]->ord_provider [orc12_x]->id_nbr)
      Set oen_reply->ORDER_GROUP [ord_x]->ORC [2]->ord_provider [norc12_sz]->last_name =
        trim(oen_reply->ORDER_GROUP [ord_x]->ORC [1]->ord_provider [orc12_x]->last_name)
      Set oen_reply->ORDER_GROUP [ord_x]->ORC [2]->ord_provider [norc12_sz]->first_name =
        trim(oen_reply->ORDER_GROUP [ord_x]->ORC [1]->ord_provider [orc12_x]->first_name)
      Set oen_reply->ORDER_GROUP [ord_x]->ORC [2]->ord_provider [norc12_sz]->middle_name =
        trim(oen_reply->ORDER_GROUP [ord_x]->ORC [1]->ord_provider [orc12_x]->middle_name)
      Set oen_reply->ORDER_GROUP [ord_x]->ORC [2]->ord_provider [norc12_sz]->assign_auth->name_id =
        trim(oen_reply->ORDER_GROUP [ord_x]->ORC [1]->ord_provider [orc12_x]->assign_auth->name_id)
    endif
    Set orc12_x = orc12_x + 1
  endwhile

  if ((norc12_sz = 0) AND (orc12_sz > 0))
    ; Send Name Components only if no NPI was moved and there was a provider populated in the field.
    Set stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->ORC [2]->ord_provider, 1)

    Set oen_reply->ORDER_GROUP [ord_x]->ORC [2]->ord_provider [1]->last_name =
      trim(oen_reply->ORDER_GROUP [ord_x]->ORC [1]->ord_provider [1]->last_name)
    Set oen_reply->ORDER_GROUP [ord_x]->ORC [2]->ord_provider [1]->first_name =
      trim(oen_reply->ORDER_GROUP [ord_x]->ORC [1]->ord_provider [1]->first_name)
    Set oen_reply->ORDER_GROUP [ord_x]->ORC [2]->ord_provider [1]->middle_name =
      trim(oen_reply->ORDER_GROUP [ord_x]->ORC [1]->ord_provider [1]->middle_name)
  endif

  ; Remove "old" ORC, and retain new ones.
  Set stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->ORC, 1, 0)


  ; OBR Segment

  ; Move OBR.2 (HNAM_ORDER_ID) into OBR.18
  ; This is so it gets returned on results
  Set stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->placer_field1, 0)
  Set stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->placer_field1, 1)
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->placer_field1 [1]->value =
    trim(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->placer_ord_nbr [1]->entity_id)

  ; OBR.3 - Clear
  Set stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->filler_ord_nbr, 0)

  ; Prepare ORC/OBR.2 for req_control_id field
  if (ord_x = 1)
    Set stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->ORC [1]->placer_ord_nbr, 0)
    Set stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->ORC [1]->placer_ord_nbr, 1)
  endif

  Set stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->placer_ord_nbr, 0)
  Set stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->placer_ord_nbr, 1)

  ; Clear OBR.20 of all data
  Set ff1_stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->filler_field1, 0)

  ; ORC.2
  Set oen_reply->ORDER_GROUP [ord_x]->ORC [1]->placer_ord_nbr [1]->entity_id =
    trim(bundle_data->req_control_id)
  ; ORC.4
  Set oen_reply->ORDER_GROUP [ord_x]->ORC [1]->placer_group_nbr->entity_id =
    trim(bundle_data->req_control_id)

  ; OBR.2
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->placer_ord_nbr [1]->entity_id =
    trim(bundle_data->req_control_id)
  ; OBR.19
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->placer_field2  =
    trim(bundle_data->req_control_id)



  ; OBR.4 - Move OBR.4.1/4.2 to OBR.4.4/4.5, and then clear 4.1/4.2, per Quest Spec
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->univ_service_id [1]->alt_identifier =
    trim(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->univ_service_id [1]->identifier)
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->univ_service_id [1]->alt_text =
    trim(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->univ_service_id [1]->text)

  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->univ_service_id [1]->identifier = ""
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->univ_service_id [1]->text = ""

  ; OBR.7 - Per Quest spec, only YYYYMMDDHHMM
  ; Therefore, substring to 12 characters (to remove SS from Cerner date)
  ; If OBR-7 isn't populated, then move OBR-22 to OBR-7

  If (oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->observation_dt_tm = " ")
    Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->observation_dt_tm =
            oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->status_change_dt_tm 
  Endif
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->observation_dt_tm =
    trim(substring(1,12,oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->observation_dt_tm))

  ; OBR.15 - Per Quest, not needed in 2.3.1 (causes format error/ACK Rejection sent) - clear.
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->spec_source->spec_name_cd->identifier = ""
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->spec_source->spec_name_cd->text = ""
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->spec_source->spec_name_cd->coding_system = ""
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->spec_source->spec_name_cd->alt_identifier = ""
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->spec_source->spec_name_cd->alt_text = ""
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->spec_source->spec_name_cd->alt_coding_system = ""
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->spec_source->additives = ""
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->spec_source->coll_meth = ""
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->spec_source->body_site->identifier = ""
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->spec_source->body_site->text = ""
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->spec_source->body_site->coding_system = ""
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->spec_source->body_site->alt_identifier = ""
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->spec_source->body_site->alt_text = ""
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->spec_source->body_site->alt_coding_system = ""
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->spec_source->site_modifier->identifier = ""
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->spec_source->site_modifier->text = ""
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->spec_source->site_modifier->coding_system = ""
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->spec_source->site_modifier->alt_identifier = ""
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->spec_source->site_modifier->alt_text = ""
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->spec_source->site_modifier->alt_coding_system = ""
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->spec_source->coll_meth_modifier->identifier = ""
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->spec_source->coll_meth_modifier->text = ""
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->spec_source->coll_meth_modifier->coding_system = ""
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->spec_source->coll_meth_modifier->alt_identifier = ""
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->spec_source->coll_meth_modifier->alt_text = ""
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->spec_source->coll_meth_modifier->alt_coding_system = ""

  ; OBR.16 - Send NPI, if present.
  ; If not, just send name components.
  declare obr16_sz = i4
  declare obr16_x = i4
  declare nobr16_sz = i4
  Set obr16_sz = size(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->ord_provider, 5)
  Set obr16_x = 1
  Set nobr16_sz = 0

  while (obr16_x <= obr16_sz)
    if (trim(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->ord_provider [obr16_x]->assign_auth->name_id) = Doc_Type)
      Set nobr16_sz = nobr16_sz + 1
      Set stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->ord_provider, nobr16_sz + obr16_sz)

      Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->ord_provider [nobr16_sz + obr16_sz]->id_nbr =
        trim(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->ord_provider [obr16_x]->id_nbr)
      Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->ord_provider [nobr16_sz + obr16_sz]->last_name =
        trim(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->ord_provider [obr16_x]->last_name)
      Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->ord_provider [nobr16_sz + obr16_sz]->first_name =
        trim(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->ord_provider [obr16_x]->first_name)
      Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->ord_provider [nobr16_sz + obr16_sz]->middle_name =
        trim(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->ord_provider [obr16_x]->middle_name)
      Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->ord_provider [nobr16_sz + obr16_sz]->assign_auth->name_id =

        trim(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->ord_provider [obr16_x]->assign_auth->name_id)
    endif
    Set obr16_x = obr16_x + 1
  endwhile

  if ((nobr16_sz = 0) AND (obr16_sz > 0))
    ; Send Name Components only if no NPI was moved and there was a provider populated in the field.
    Set stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->ord_provider, obr16_sz + 1, 0)

    Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->ord_provider [1]->last_name =
      trim(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->ord_provider [2]->last_name)
    Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->ord_provider [1]->first_name =
      trim(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->ord_provider [2]->first_name)
    Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->ord_provider [1]->middle_name =
      trim(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->ord_provider [2]->middle_name)

    Set stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->ord_provider, 1)
  else
    ; NPI identified - alterlist off "old" stuff.
    Set stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->ord_provider, nobr16_sz, 0)
  endif

  ; OBR.27 - Send first iteration only.
  Set stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->quantity_timing, 1)

   ; OBR.28 - clear all cc Provider Info.
  Set stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->result_copies, 0)

  
  ; OBR.32 - clear
  Set stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->prim_res_interp, 0)

  ; OBR.33 - clear
  Set stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->ast_res_interp, 0)

  ; OBR.34 - clear
  Set stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->technician, 0)

  ; OBR.35 - clear
  Set stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->transcriptionist, 0)

  ; DG1 Segments
  IF (size(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->DG1, 5)>0)
    declare dg1_sz = i4
    declare dg1_x = i4
    Set dg1_sz = size(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->DG1, 5)
    Set dg1_x = 1

    while (dg1_x <= dg1_sz)
      ; Resequence DG1.1
      Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->DG1 [dg1_x]->set_id =
        trim(cnvtstring(dg1_x))

      ; if DRG_TYPE "Diagnosis to Order" is not aliased to SEND_OUT on cs 23549, remove the DG1 segment.
      ; if it is, clear the DRG_TYPE field before sending.
      if (trim(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->DG1 [dg1_x]->drg_type) != "SEND_OUT")
        Set stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->DG1 , dg1_sz - 1, dg1_x - 1)
        Set dg1_sz = dg1_sz -1
        Set dg1_x = dg1_x - 1
      else
        Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->DG1 [dg1_x]->drg_type = ""
      endif

      Set dg1_x = dg1_x + 1
    endwhile
  ENDIF

  ; NTE Segments
  declare nte_sz = i4
  declare nte_x = i4
  Set nte_sz = size(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->NTE, 5)
  Set nte_x = 1

  while (nte_x <= nte_sz)
    ; Per Quest, set NTE.2 = "I" for Internal Notes
    Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->NTE [nte_x]->src_of_comment = "I"

    Set nte_x = nte_x + 1
  endwhile



  ; OBX Segments
  declare obx_sz = i4
  declare obx_x = i4
  Set obx_sz = size(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBX_GROUP, 5)
  Set obx_x = 1

  while (obx_x <= obx_sz)
  	;Need to move the requested date/time order prompt to OBR;7 per QUEST
  	IF (trim(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBX_GROUP [obx_x]->OBX->observation_id->identifier) =
	    "Requested Start Date/Time")
      Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->observation_dt_tm =
        oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBX_GROUP [obx_x]->observation_value [1]->value_1
      Set stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBX_GROUP,OBX_Sz - 1, obx_x - 1)
      Set obx_sz = size(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBX_GROUP, 5)
    ELSE
      ; Move OBX.3.1/3.2 to OBX.3.4/3.5, and clear OBX.3.1/3.2, per Quest spec.
      Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBX_GROUP [obx_x]->OBX->observation_id->alt_identifier =
        trim(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBX_GROUP [obx_x]->OBX->observation_id->identifier)
      Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBX_GROUP [obx_x]->OBX->observation_id->alt_text =
        trim(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBX_GROUP [obx_x]->OBX->observation_id->text)

      Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBX_GROUP [obx_x]->OBX->observation_id->identifier = ""
      Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBX_GROUP [obx_x]->OBX->observation_id->text = ""

      Set obx_x = obx_x + 1
    ENDIF
  endwhile

  ; ZCT Segment - Remove
  Set stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->ZCT, 0)

  Set ord_x = ord_x + 1
endwhile

declare current_program = vc
Set current_program = curprog
execute oencpm_msglog build("Out-", current_program, char(0))