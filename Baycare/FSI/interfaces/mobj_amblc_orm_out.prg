/*
*  ---------------------------------------------------------------------------------------------
*  Cerner Script Name:  mobj_amblc_orm_out
*  Description:  Modify Object Script for Amb LabCorp Msgs Outbound - OrderGroup Cleanup
*  Type:  Open Engine Modify Object Script
*  ---------------------------------------------------------------------------------------------
*  Author:  FSI
*  Domain:  All
* Create Date: 3/30/16
*  ---------------------------------------------------------------------------------------------
*
*  Mod#   Date	        Author                           Description & Requestor Information
 *
 *  1:    08/19/16	  S Parimi                           RFC # 13591 implementation of Orders outbound to LabCorp
*   2:   11/09/16      Hope  Kaczmarczyk    RFC # 15087 Coding to clear cc Provider info from OBR;28
*/
/**************************************************************/
;                 Site specific variable declaration


;NOTE
; if DRG_TYPE "Diagnosis to Order" is not aliased to SEND_OUT on cs 23549, the DG1 segment will be removed.
; if it is, clear the DRG_TYPE field before sending.

; End of Site Specific Coding
/**************************************************************/


declare current_program = vc
Set current_program = curprog
execute oencpm_msglog build("In-", current_program, char(0))

; Global Record Structure for storing Order Level Diagnosis information
Set trace = recpersist

free record diagnosis_info
record diagnosis_info
(
  1 seg [*]
    2 set_id = vc
    2 coding_method = vc
    2 code [1]
      3 id = vc
      3 text = vc
      3 coding_system = vc
  1 seg_str = vc
)

Set trace = norecpersist

declare ord_sz = i4
declare ord_x = i4
Set ord_sz = size(oen_reply->ORDER_GROUP, 5)
Set ord_x = 1

while (ord_x <= ord_sz)

  ; ORC Segment
  ; Extend ORC Segment size by 1, and move values needed into it
  Set stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->ORC, 2)

  ; ORC.1 - Set to "NW"
  Set oen_reply->ORDER_GROUP [ord_x]->ORC [2]->order_ctrl = "NW"

  ; ORC.12 - Send NPI, if present.
  ; If not, just send name components
  declare orc12_sz = i4
  declare orc12_x = i4
  declare norc12_sz = i4
  Set orc12_sz = size(oen_reply->ORDER_GROUP [ord_x]->ORC [1]->ord_provider, 5)
  Set orc12_x = 1
  Set norc12_sz = 0

  while (orc12_x <= orc12_sz)
    if (trim(oen_reply->ORDER_GROUP [ord_x]->ORC [1]->ord_provider [orc12_x]->assign_auth->name_id) = "NPI")
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
      ; LabCorp uses the source subfield.
      ; N = "NPI"
      Set oen_reply->ORDER_GROUP [ord_x]->ORC [2]->ord_provider [norc12_sz]->source  = "N"
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

  ; ORC.2
  Set oen_reply->ORDER_GROUP [ord_x]->ORC [1]->placer_ord_nbr [1]->entity_id =
    trim(bundle_data->req_control_id)

  ; OBR.2
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->placer_ord_nbr [1]->entity_id =
    trim(bundle_data->req_control_id)

  ; Clear OBR.19 of all data
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->placer_field2 = ""

  ; OBR.20
  Set stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->filler_field1, 0)
  Set stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->filler_field1, 1)
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->filler_field1 [1]->value = 
    trim(bundle_data->req_control_id)

  ; Clear OBR.21 of all data
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->filler_field2 = ""

  ; OBR.4 - Set 4.3 = "L" per LabCorp specs
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->univ_service_id [1]->coding_system = "L"

  ; OBR.7 - Per LabCorp spec, only YYYYMMDDHHMM, and set to OBR.27.4
  ; Therefore, substring to 12 characters (to remove SS from Cerner date)
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->observation_dt_tm =
    trim(substring(1,12,oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->quantity_timing [1]->start_dt_tm))

  ; OBR.10 - Clear Per LabCorp Spec
  Set stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->collector_id, 0)

  ; OBR.11 - Set to "N"
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->specimen_act_cd = "N"

  ; OBR.15 - Per LabCorp, send identifier, clear all other subfields
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
    if (trim(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->ord_provider [obr16_x]->assign_auth->name_id) = "NPI")
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
      ; LabCorp uses the source subfield.
      ; N = "NPI"
      Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->ord_provider [nobr16_sz + obr16_sz]->source = "N"
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

  ; OBR.22 - Clear
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->status_change_dt_tm = ""

  ; OBR.24 - Clear
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->diag_serv_sec_id = ""

  ; OBR.27 - Send first iteration only.
  ; Also, clear OBR.27.1, .3, and .4 (quantity, duration, and start date/time)
  Set stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->quantity_timing, 1)
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->quantity_timing [1]->quantity = ""
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->quantity_timing [1]->duration = ""
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->quantity_timing [1]->start_dt_tm = ""

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

  ; OBR.36 - Clear
  Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBR->sched_dt_tm = ""


  ; DG1 Segments
execute oencpm_msglog build("In DG1 section of Code", char(0))
  declare dg1_sz = i4
  declare dg1_x = i4
  Set dg1_sz = size(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->DG1, 5)
  Set dg1_x = 1
execute oencpm_msglog build("DG1_Size ->",size(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->DG1, 5)
, char(0))

  while (dg1_x <= dg1_sz)
execute oencpm_msglog build("In While Loop", char(0))
    ; For Valid DG1's, move into global record structure
    ; LabCorp processes Diagnosis at Encounter Level, not Order level
    ; if DRG_TYPE "Diagnosis to Order" is aliased to SEND_OUT on cs 23549, store DG1 info (if unique)
execute oencpm_msglog build("DRG_TYPE ->", oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->DG1 [dg1_x]->drg_type, char(0))
    if (trim(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->DG1 [dg1_x]->drg_type) = "SEND_OUT")
      ; Check DG1.3.1 and 3.3 to see if already in record structure.  If not, add to record structure.
execute oencpm_msglog build("DG1 send_out", char(0))
      declare diag_x = i4
      declare diag_sz = i4
      declare bool = i4
      Set diag_x = 1
      Set diag_sz = size(diagnosis_info->seg, 5)
      Set bool = 0

      while (diag_x <= diag_sz)
        if ((trim(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->DG1 [dg1_x]->code->identifier) = 
          trim(diagnosis_info->seg[diag_x]->code[1]->id)) AND
           (trim(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->DG1 [dg1_x]->code->coding_system) = 
          trim(diagnosis_info->seg[diag_x]->code[1]->coding_system)))
          ; Indicate duplicate, and bust out of loop for performance.
          Set bool = 1
          Set diag_x = diag_sz
        endif

        Set diag_x = diag_x + 1
      endwhile

      if (bool != 1)
        ; Unique Diagnosis Code - add to list
execute oencpm_msglog build("Adding Unique Diag", char(0))
        Set diag_sz = diag_sz + 1
        Set stat = alterlist(diagnosis_info->seg, diag_sz)
        Set diagnosis_info->seg[diag_sz]->set_id = cnvtstring(diag_sz) ;"<DG1_SETID>"
        Set diagnosis_info->seg[diag_sz]->coding_method = 
          trim(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->DG1 [dg1_x]->coding_method)
        Set diagnosis_info->seg[diag_sz]->code[1]->id = 
          trim(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->DG1 [dg1_x]->code->identifier)
        Set diagnosis_info->seg[diag_sz]->code[1]->text = 
          trim(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->DG1 [dg1_x]->code->text)
        Set diagnosis_info->seg[diag_sz]->code[1]->coding_system = 
          trim(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->DG1 [dg1_x]->code->coding_system)

      endif

    endif

    Set dg1_x = dg1_x + 1
  endwhile

  ; Clear Diagnosis Segments at order group iteration
  Set stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->DG1, 0)


  ; NTE Segments
  declare nte_sz = i4
  declare nte_x = i4
  Set nte_sz = size(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->NTE, 5)
  Set nte_x = 1

  while (nte_x <= nte_sz)
    ; Per LabCorp, set NTE.2 = "P" for Practice as source of comment
    Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->NTE [nte_x]->src_of_comment = "P"

    Set nte_x = nte_x + 1
  endwhile

  ; OBX Segments
  declare obx_sz = i4
  declare obx_x = i4
  Set obx_sz = size(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBX_GROUP, 5)
  Set obx_x = 1

  while (obx_x <= obx_sz)
    ; Set OBX.3.3 = "L"
    Set oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->OBX_GROUP [obx_x]->OBX->observation_id->coding_system = 
      "L"

    Set obx_x = obx_x + 1
  endwhile

  ; ZCT Segment - Remove
  Set stat = alterlist(oen_reply->ORDER_GROUP [ord_x]->OBR_GROUP [1]->ZCT, 0)

  Set ord_x = ord_x + 1
endwhile

declare current_program = vc
Set current_program = curprog
execute oencpm_msglog build("Out-", current_program, char(0))