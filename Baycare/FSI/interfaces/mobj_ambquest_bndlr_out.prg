/*
*  ---------------------------------------------------------------------------------------------
*  Script Name:  mobj_ambquest_bndlr_out
*  Description:  Modify Object Script for Amb Quest Msgs Outbound - Bundler Logic
*  Type:  Open Engine Modify Object Script
*  ---------------------------------------------------------------------------------------------
*  Author:  FSI
*  Domain:  All
*  ---------------------------------------------------------------------------------------------
*  Mod#   Date	          Author              Description & Requestor Information
*
*  1:           05/21/18       Hope K            Adding new collection class for urine specimens
*
*/

/**************************************************************/
;Site specific variable declaration
;Code Set 231 must be aliased to Display for Collection Class to work
/**************************************************************/

declare current_program = vc
Set current_program = curprog
execute oencpm_msglog build("In-", current_program, char(0))

; We only want to keep the ORC/OBR Grouping at the split_index position.
; Therefore, we will remove all other values
; Note, if the split index is greater than the current size of the OBR's, then we have had an issue
; Where DONOTSEND logic was used.
; Therefore, since alterlisting will error, we will ignore any index value greater than the current size of the list.
if (value(oen_request_data->split_index) > 0)
  if (value(oen_request_data->split_index) <= size(oen_reply->ORDER_GROUP, 5))
    ; Valid Split Index and valid order grouping - remove all order group iterations except the one at the split index position.
    ; First, lop off all order group positions AFTER the index position
    Set stat = alterlist(oen_reply->ORDER_GROUP, value(oen_request_data->split_index))

    ; Then, reduce list to a size of 1, by removing all values starting at the head of the list, up to the index position.
    Set stat = alterlist(oen_reply->ORDER_GROUP, 1, 0)
    Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->set_id  = "1"
  else
    ; If Split Index is greater than the current size of the ORDER_GROUP, then we have an issue
    ; where ESORTL has removed iterations in the SCS_NET ORDER GROUP.
    ; Most likely culprit is SKIPMSG/DONOTSEND Logic aliasing for Codeset 200 value in OBR.4.1
    ; Therefore, throw this out, as index will cause alterlisting errors
    execute oencpm_msglog build("Split Index is greater than current ORDER_GROUP Size - suppress message", char(0))
    Set oenstatus->ignore = 1
    Go To BUNDLE_EXIT
  endif
else
  ; Problem with Split Index variable - throw out message
  execute oencpm_msglog build("Split Index is not valued - suppress message", char(0))
  Set oenstatus->ignore = 1
  Go To BUNDLE_EXIT
endif


Set trace = recpersist

; Global Record Structure for use in Modify Original Scripting
free record bundle_data
record bundle_data
(
  1 order_id = f8
  1 conversation_id = f8
  1 container_id = f8
  1 coll_class_cd = f8
  1 nurse_coll = vc  
  1 perform_loc = vc
  1 req_control_id = vc
  1 ap_coll_class_cd = f8
  1 frz_coll_class_cd = f8
  1 rm_coll_class_cd = f8
  1 frg_coll_class_cd = f8
  1 ur_coll_class_cd = f8
)

Set trace = norecpersist


; Setup by Pathnet Team (RLN team) and built into pathNet applications.
; May be customized from site to site
Set bundle_data->ap_coll_class_cd = uar_get_code_by("DISPLAY", 231, "RLN AP")
Set bundle_data->frz_coll_class_cd = uar_get_code_by("DISPLAY", 231, "RLN Frozen")
Set bundle_data->rm_coll_class_cd = uar_get_code_by("DISPLAY", 231, "RLN Room/Refrig")
Set bundle_data->frg_coll_class_cd = uar_get_code_by("DISPLAY", 231, "RLN Room/Refrig")
Set bundle_data->ur_coll_class_cd = uar_get_code_by("DISPLAY", 231, "RLN Urine")

; Now that we have our single order instance, we need to do further logic evaluation on the order_id itself.
; The order_id is present in the OBR.2 value (not the DoubleList header info like we normally pull)
Set bundle_data->order_id = cnvtreal(trim(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->placer_ord_nbr [1]->entity_id))


if (bundle_data->order_id > 0.0)
  ; Gather attributes about this order that we need later.

  ; The conversation_id is the "grouper" identifer for all orders submitted at the same time.  Pull from DoubleList header info.
  Set bundle_data->conversation_id = get_double_value("conversation_id")

  ; Container ID/Collection Class
  select ocr.container_id, c.coll_class_cd
  from order_container_r ocr, container c
  plan ocr
  where ocr.order_id = bundle_data->order_id
  join c
  where c.container_id = ocr.container_id
  detail
    bundle_data->container_id = ocr.container_id
    bundle_data->coll_class_cd = c.coll_class_cd
  with nocounter

  ; Nurse Collect Indicator
  select od.oe_field_display_value
  from order_detail od
  where od.order_id = bundle_data->order_id
    and od.oe_field_meaning = "NURSECOLLECT"
  order od.action_sequence desc
  detail
    bundle_data->nurse_coll = trim(od.oe_field_display_value)
  with maxrec = 1, nocounter

  ; Performing Location
  select od.oe_field_display_value
  from order_detail od
  where od.order_id = bundle_data->order_id
    and od.oe_field_meaning = "PERFORMLOC"
  order od.action_sequence desc
  detail
    bundle_data->perform_loc = trim(od.oe_field_display_value)
  with maxrec = 1, nocounter


  ; Troubleshooting Print Statements for all Initialized Data above
  execute oencpm_msglog build("Data In Record Structure", char(0))
  execute oencpm_msglog build("Order id=", bundle_data->order_id, char(0))
  execute oencpm_msglog build("Conversation id=", bundle_data->conversation_id, char(0))
  execute oencpm_msglog build("Container id=", bundle_data->container_id, char(0))
  execute oencpm_msglog build("Collection Class=", bundle_data->coll_class_cd, char(0))
  execute oencpm_msglog build("Nurse Collect Indicator=", bundle_data->nurse_coll, char(0))
  execute oencpm_msglog build("Performing Location=", bundle_data->perform_loc, char(0))
  execute oencpm_msglog build("AP Collection Class=", bundle_data->ap_coll_class_cd, char(0))
  execute oencpm_msglog build("Frozen Collection Class=", bundle_data->frz_coll_class_cd, char(0))
  execute oencpm_msglog build("Room Collection Class=", bundle_data->rm_coll_class_cd, char(0))
  execute oencpm_msglog build("Refrig Collection Class=", bundle_data->frg_coll_class_cd, char(0))
  execute oencpm_msglog build("Urine Collection Class=", bundle_data->ur_coll_class_cd, char(0))

  ; Get last 5 digits of conversation_id, for use in algorithm below.
;ko3600 - 04/15/15 - Redoing the conv_id_digits to pull from the order_action table so that
;                    reprinting the requisitions needs to have the order_conversation_id
  declare conv_id_digits = vc
  declare action_seq = i4
  set action_seq = get_double_value("action_sequence")
    ; order_conversation_id
  select oa.order_conversation_id  
    from order_action oa
  where oa.order_id = bundle_data->order_id
    and oa.action_sequence = action_seq
  detail
    conv_id_digits =     substring(size(trim(cnvtstringchk(oa.order_conversation_id, 20, 0)), 1) - 4, 
      5, trim(cnvtstringchk(oa.order_conversation_id, 20, 0)))
;cnvtstring(oa.order_conversation_id) 
  with maxrec = 1, nocounter
;original code   
;  Set conv_id_digits = 
;    substring(size(trim(cnvtstringchk(bundle_data->conversation_id, 20, 0)), 1) - 4, 
;      5, trim(cnvtstringchk(bundle_data->conversation_id, 20, 0)))

  ; Troubleshooting Print Statement
  execute oencpm_msglog build("Last 5 digits conversation_id=", conv_id_digits, char(0))

  ; Build the Requisition Control ID (for use in place of accession) into message.
  if (trim(cnvtupper(bundle_data->nurse_coll)) in ("NO"))
    ; PSC Hold Orders
    if (bundle_data->coll_class_cd = bundle_data->ap_coll_class_cd)
      ; Format is FIN + "APL" + last 5 digits of conversation_id
      Set bundle_data->req_control_id = 
        build(trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->id), "APL", conv_id_digits)
    elseif (bundle_data->coll_class_cd = bundle_data->frz_coll_class_cd)
      ; Format is FIN + "L" + last 5 digits of conversation_id
      Set bundle_data->req_control_id = 
        build(trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->id), "L", conv_id_digits)
    elseif (bundle_data->coll_class_cd = bundle_data->rm_coll_class_cd)
      ; Format is FIN + "L" + last 5 digits of conversation_id
      Set bundle_data->req_control_id = 
        build(trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->id), "L", conv_id_digits)
    elseif (bundle_data->coll_class_cd = bundle_data->frg_coll_class_cd)
      ; Format is FIN + "L" + last 5 digits of conversation_id
      Set bundle_data->req_control_id = 
        build(trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->id), "L", conv_id_digits)
    elseif (bundle_data->coll_class_cd = bundle_data->ur_coll_class_cd)
      ; Format is FIN + "L" + last 5 digits of conversation_id
      Set bundle_data->req_control_id = 
        build(trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->id), "L", conv_id_digits)
    else
      execute oencpm_msglog build("Not Valid Collection Class for PSC Hold Order", char(0))
      Set oenstatus->ignore = 1
      Go To BUNDLE_EXIT
    endif
  elseif (trim(cnvtupper(bundle_data->nurse_coll)) in ("YES"))
    ; Non-PSC Hold Orders
    if (bundle_data->coll_class_cd = bundle_data->ap_coll_class_cd)
      ; Format is FIN + "AP" + last 5 digits of conversation_id
      Set bundle_data->req_control_id = 
        build(trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->id), "AP", conv_id_digits)
    elseif (bundle_data->coll_class_cd = bundle_data->frz_coll_class_cd)
      ; Format is FIN + "FR" + last 5 digits of conversation_id
      Set bundle_data->req_control_id = 
        build(trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->id), "FR", conv_id_digits)
    elseif (bundle_data->coll_class_cd = bundle_data->rm_coll_class_cd)
      ; Format is FIN + "RR" + last 5 digits of conversation_id
      Set bundle_data->req_control_id = 
        build(trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->id), "RR", conv_id_digits)
    elseif (bundle_data->coll_class_cd = bundle_data->frg_coll_class_cd)
      ; Format is FIN + "RR" + last 5 digits of conversation_id
      Set bundle_data->req_control_id = 
        build(trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->id), "RR", conv_id_digits)
    elseif (bundle_data->coll_class_cd = bundle_data->ur_coll_class_cd)
      ; Format is FIN + "RR" + last 5 digits of conversation_id
      Set bundle_data->req_control_id = 
        build(trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->id), "RR", conv_id_digits)
    else
      execute oencpm_msglog build("Not Valid Collection Class for Non-PSC Hold Order", char(0))
      Set oenstatus->ignore = 1
      Go To BUNDLE_EXIT
    endif
  else
    execute oencpm_msglog build("Invalid Nurse Collect Attribute on Order - suppress message", char(0))
    Set oenstatus->ignore = 1
    Go To BUNDLE_EXIT
  endif


  ; Troubleshooting Print Statements for Requistion Control ID set above
  execute oencpm_msglog build("Requisition Control id=", bundle_data->req_control_id, char(0))

  
else
  execute oencpm_msglog build("Invalid Order ID - suppress message", char(0))
  Set oenstatus->ignore = 1
  Go To BUNDLE_EXIT
endif


#BUNDLE_EXIT

declare current_program = vc
Set current_program = curprog
execute oencpm_msglog build("Out-", current_program, char(0))