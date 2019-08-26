/*
*  ---------------------------------------------------------------------------------------------
*  Script Name:  orm_LabCorpAMB_morg_out
* Original script from Cerner: morg_amblc_out
*  Description:  Modify Original Script for Amb LabCorp Msgs Outbound - Main Script
*  Type:  Open Engine Modify Original Script
*  ---------------------------------------------------------------------------------------------
*  Author:  FSI
*  Domain:  All
* Creation Date: 03/29/16
*  ---------------------------------------------------------------------------------------------
*
*  Mod#   Date	        Author                 Description & Requestor Information
*
*   1:    08/19/16	  S Parimi      RFC # 13591 implementation of Orders outbound to LabCorp
*   2:    05/21/18	  H Kaczmarczyk    Adding logic for RLN Urine Collection Class
*/
declare current_program = vc
Set current_program = curprog
execute oencpm_msglog build("In-", current_program, char(0))

execute oencpm_msglog build("Diag_Info Size ->",   size(diagnosis_info->seg, 5), char(0))

; Diagnosis Processing - build seg_str based on info in the array
for (diag_x = 1 to size(diagnosis_info->seg, 5))
  Set diagnosis_info->seg_str = 
    build(trim(diagnosis_info->seg_str), char(13), "DG1|",
      trim(diagnosis_info->seg[diag_x]->set_id), "|",
      trim(diagnosis_info->seg[diag_x]->coding_method), "|",
      trim(diagnosis_info->seg[diag_x]->code[1]->id), "^",
      trim(diagnosis_info->seg[diag_x]->code[1]->text), "^",
      trim(diagnosis_info->seg[diag_x]->code[1]->coding_system), "|")

execute oencpm_msglog build("Building SEG_STR ->", diagnosis_info->seg_str, char(0))
endfor

; Step 1 - verify if the order_id is on the cust_rln_bundler or not already.
; If it is and its a status of 0, then we are ready to update the order-level data
; If it is and its a status of 1, then we will update over what's already there 
;    (assume resend of data prior to bundle "finishing")
; If it is not in a 0 or 1 status, then create a new 0 row for staging data for all orders 
;    that should be bundled together.

declare isValid = i4
Set isValid = 0

select crb.msg_status_flag
from cust_rln_bundler crb
where crb.order_id = bundle_data->order_id
  and crb.conversation_id = bundle_data->conversation_id
  and crb.req_con_nbr = trim(bundle_data->req_control_id)
detail
  if (crb.msg_status_flag in (0, 1))
    isValid = 1
  endif
with nocounter

execute oencpm_msglog build("isValid = ", isValid, char(0))

if (isValid != 1)
  ; Step 1 (b) - 
  ; Row doesn't exist, insert 0 row for all orders on a conversation_id that should be "grouped".
  ; This is based on:
  ; 1 - being on same conversation_id
  ; 2 - having same performing location and nurse collect value
  ; 3 - finally, having same "collection class" grouping.
  free record order_list
  record order_list
  (
    1 sz = i4
    1 list[*]
      2 order_id = f8
  )

  Set order_list ->sz = 0
  declare bool = i4

  select distinct ocr.order_id, ce.coll_class_cd
  from order_container_r ocr, order_detail od1, order_detail od2, container_event ce
  plan ce
  where ce.conversation_id = bundle_data->conversation_id
  join ocr
  where ocr.container_id = ce.container_id
  join od1
  where od1.order_id = ocr.order_id
    and od1.oe_field_meaning = "NURSECOLLECT"
    and cnvtupper(od1.oe_field_display_value) = cnvtupper(bundle_data->nurse_coll)
  join od2
  where od2.order_id = ocr.order_id
    and od2.oe_field_meaning = "PERFORMLOC"
    and cnvtupper(od2.oe_field_display_value) = cnvtupper(bundle_data->perform_loc)
  detail
    bool = 0
    if (cnvtupper(bundle_data->nurse_coll) = "NO")
      if (bundle_data->coll_class_cd in (bundle_data->ap_coll_class_cd)) 
        if (ce.coll_class_cd in (bundle_data->ap_coll_class_cd))
          bool = 1
        endif
      elseif (bundle_data->coll_class_cd in (bundle_data->mi_coll_class_cd)) 
        if (ce.coll_class_cd in (bundle_data->mi_coll_class_cd))
          bool = 1
        endif
      elseif 
        (bundle_data->coll_class_cd in 
          (bundle_data->frz_coll_class_cd, bundle_data->rm_coll_class_cd, bundle_data->frg_coll_class_cd, 
                           bundle_data->rmfrg_coll_class_cd ))
        if (ce.coll_class_cd in 
          (bundle_data->frz_coll_class_cd, bundle_data->rm_coll_class_cd, bundle_data->frg_coll_class_cd,  
                            bundle_data->rmfrg_coll_class_cd))
          bool = 1
        endif
      elseif 
        (bundle_data->coll_class_cd in (bundle_data->ur_coll_class_cd))
        if (ce.coll_class_cd in (bundle_data->ur_coll_class_cd))
          bool = 1
        endif
      else ; this individual order passing interface is not an ap/rm/frz/frg value so bundle with orders not of it's type.
        if (ce.coll_class_cd not in 
          (bundle_data->ap_coll_class_cd, bundle_data->mi_coll_class_cd, bundle_data->frz_coll_class_cd, 
           bundle_data->rm_coll_class_cd, bundle_data->frg_coll_class_cd, bundle_data->rmfrg_coll_class_cd))
          bool = 1
        endif
      endif
    elseif (cnvtupper(bundle_data->nurse_coll) = "YES")
      if (bundle_data->coll_class_cd in (bundle_data->ap_coll_class_cd))
        if (ce.coll_class_cd in (bundle_data->ap_coll_class_cd))
          bool = 1
        endif
      elseif (bundle_data->coll_class_cd in (bundle_data->mi_coll_class_cd))
        if (ce.coll_class_cd in (bundle_data->mi_coll_class_cd))
          bool = 1
        endif
      elseif (bundle_data->coll_class_cd in (bundle_data->frz_coll_class_cd))
        if (ce.coll_class_cd in (bundle_data->frz_coll_class_cd))
          bool = 1
        endif
      elseif (bundle_data->coll_class_cd in 
        (bundle_data->rm_coll_class_cd, bundle_data->frg_coll_class_cd,  bundle_data->rmfrg_coll_class_cd))
        if (ce.coll_class_cd in (bundle_data->rm_coll_class_cd, bundle_data->frg_coll_class_cd,  
                                                     bundle_data->rmfrg_coll_class_cd))
          bool = 1
        endif
      elseif (bundle_data->coll_class_cd in 
        (bundle_data->ur_coll_class_cd))
        if (ce.coll_class_cd in (bundle_data->ur_coll_class_cd))
          bool = 1
        endif
      else ; this individual order passing interface is not an ap/rm/frz/frg value - so bundle with orders not of it's type.
        if (ce.coll_class_cd not in 
          (bundle_data->ap_coll_class_cd, bundle_data->mi_coll_class_cd, bundle_data->frz_coll_class_cd, 
           bundle_data->rm_coll_class_cd, bundle_data->frg_coll_class_cd, bundle_data->rmfrg_coll_class_cd))
          bool = 1
        endif
      endif
    endif

    if (bool = 1)
      order_list->sz = order_list->sz + 1
      stat = alterlist(order_list->list, order_list->sz)
      order_list->list[order_list->sz]->order_id = ocr.order_id
    endif
  with nocounter

  for (x = 1 to order_list->sz)
    execute oencpm_msglog build("Order_id = ", order_list->list[x]->order_id, char(0))

    insert into cust_rln_bundler crb
      Set crb.receiving_system = "",
      crb.req_con_nbr = bundle_data->req_control_id,
      crb.conversation_id = bundle_data->conversation_id,
      crb.order_id = order_list->list[x]->order_id,
      crb.coll_class_cd = 0.0,
      crb.nurse_collect = "",
      crb.perform_lab = "",
      crb.msg = "",
      crb.dg1_segs = "",
      crb.msg_status_flag = 0,
      crb.create_dt_tm = cnvtdatetime(curdate, curtime3),
      crb.updt_dt_tm = cnvtdatetime(curdate, curtime3)
    with nocounter

    commit
  endfor

endif



; Step 2 - Row now exists, update with hl7 order info, and set msg_status_flag = 1
; First, break apart hl7 message at the ORC segment.
; Data before the ORC goes in msg_info
; Data after the ORC goes in the order_info
free record hl7_msg
record hl7_msg
(
  1 msg_info  = vc
  1 order_info = vc
  1 dg1_info [*]
    2 seg = vc
  1 dg1_full_segs = vc
)

declare search_val = vc
declare pos = i4
Set search_val = build(char(13), "ORC")
Set pos = findstring(search_val, trim(oen_request->org_msg), 1, 0)

; Found ORC Segment, split apart into separate pieces.
if (pos > 0)
  Set hl7_msg->msg_info = substring(1, pos-1, trim(oen_request->org_msg))
  Set hl7_msg->order_info = replace(trim(oen_request->org_msg), hl7_msg->msg_info, "", 1)

  ; Now, post the order_info into the table for this order_id
  update into cust_rln_bundler crb
  Set crb.receiving_system = trim(bundle_data->perform_loc),
    crb.coll_class_cd = bundle_data->coll_class_cd,
    crb.nurse_collect = trim(bundle_data->nurse_coll),
    crb.perform_lab = trim(bundle_data->perform_loc),
    crb.msg = trim(hl7_msg->order_info),
    crb.dg1_segs = trim(diagnosis_info->seg_str),
    crb.msg_status_flag = 1,
    crb.updt_dt_tm = cnvtdatetime(curdate, curtime3)
  where crb.order_id = bundle_data->order_id
    and crb.conversation_id = bundle_data->conversation_id
    and crb.req_con_nbr = trim(bundle_data->req_control_id)
    and crb.msg_status_flag in (0, 1)
  with nocounter

  commit



  ; Finally, if all orders for a req_con_nbr/conversation_id combo are at a status 1, 
  ;   pull all the parts and send out the "bundled" message.
  declare bool = i4
  declare dg1_cnt = i4
  Set bool = 0
  Set dg1_cnt = 0

  Set hl7_msg->order_info = ""

  select crb.msg
  from cust_rln_bundler crb
  where crb.conversation_id = bundle_data->conversation_id
    and crb.req_con_nbr = bundle_data->req_control_id
    and crb.msg_status_flag in (0, 1)
  detail
    if (crb.msg_status_flag = 0)
      bool = 1
    elseif (crb.msg_status_flag = 1)
      hl7_msg->order_info = build(trim(hl7_msg->order_info), trim(crb.msg))
      if (trim(crb.dg1_segs) != "")
        dg1_cnt = dg1_cnt + 1
        stat = alterlist(hl7_msg->dg1_info, dg1_cnt)
        hl7_msg->dg1_info[dg1_cnt]->seg = trim(crb.dg1_segs)
      endif
    endif
  with nocounter

    if (bool = 1)
      execute oencpm_msglog build("Not all orders are status 1 yet, suppress message...", char(0))
      Set oen_reply->out_msg = build("OEN_IGNORE", char(0))
      Go To EXITSCRIPT
    else
      ; Evaluate all DG1 segments for uniqueness, and build master string.
      for (x = 1 to size(hl7_msg->dg1_info, 5))
        declare str = vc
        declare notfnd = vc
        declare cnt = i4
        declare dg1_cnt = i4

        Set str = ""
        Set notfnd = "<not_found>"
        Set cnt = 1
        Set dg1_cnt = 0

        while (str != notfnd)
          Set str = piece(hl7_msg->dg1_info[x]->seg, char(13), cnt, notfnd, 0)
          execute oencpm_msglog build("cnt = ", cnt, char(0))
          execute oencpm_msglog build("str = ", str, char(0))
          if (trim(str) not in ("", notfnd))
            if (findstring(trim(str), trim(hl7_msg->dg1_full_segs), 1, 0) = 0)
              execute oencpm_msglog build("Unique DG1", char(0))
              Set hl7_msg->dg1_full_segs = build(trim(hl7_msg->dg1_full_segs), char(13), trim(str))
              Set dg1_cnt = dg1_cnt + 1
              execute oencpm_msglog build("dg1_cnt=", dg1_cnt, char(0))
            else
              execute oencpm_msglog build("Duplicate DG1", char(0))
            endif      
          endif

          Set cnt = cnt + 1
        endwhile
      endfor

      ; Set sequence of dg1.1 values.
      for (x = 1 to dg1_cnt)
        Set hl7_msg->dg1_full_segs = trim(replace(hl7_msg->dg1_full_segs, "<DG1_SETID>", trim(cnvtstring(x)), 1))
      endfor
execute oencpm_msglog build("dg1_cnt=", dg1_cnt, char(0))
execute oencpm_msglog build("HL7-DG1-Full_seg ->",hl7_msg->dg1_full_segs, char(0))
execute oencpm_msglog build("HL7-order_info ->", hl7_msg->order_info, char(0))
execute oencpm_msglog build("HL7_msg->msg_info ->", hl7_msg->msg_info, char(0))
      ; Finally, Append the DG1 segments PRIOR to the first ORC segment
      if (trim(hl7_msg->dg1_full_segs) != "")
        Set hl7_msg->order_info = 
          trim(replace(hl7_msg->order_info, build(char(13), "ORC"), build(hl7_msg->dg1_full_segs, char(13), "ORC"), 1))
      endif
execute oencpm_msglog build("HL7-order_info  AFTER->", hl7_msg->order_info, char(0))
      ; Set out_msg to send out complete "bundled" message, and update the status to 2 for all rows (to complete)
      ; Also, update the <PSC_IND> in MSH.5 based on NurseCollect (No = PSC, Yes = 1100)
      if (cnvtupper(bundle_data->nurse_coll) = "NO")
        Set oen_reply->out_msg = 
          build(trim(replace(hl7_msg->msg_info, "<PSC_IND>", "PSC", 1)), hl7_msg->order_info, char(13), char(0))
      elseif (cnvtupper(bundle_data->nurse_coll) = "YES")
        Set oen_reply->out_msg = 
          build(trim(replace(hl7_msg->msg_info, "<PSC_IND>", "1100", 1)), hl7_msg->order_info, char(13), char(0))
      endif

      update into cust_rln_bundler crb
      Set crb.msg_status_flag = 2,
        crb.updt_dt_tm = cnvtdatetime(curdate, curtime3)
      where crb.conversation_id = bundle_data->conversation_id
        and crb.req_con_nbr = bundle_data->req_control_id
        and crb.msg_status_flag = 1
      with nocounter
     commit
      execute oencpm_msglog build("Finished Bundled Message has been sent and table is updated to 2", char(0))
    endif

else
  execute oencpm_msglog build("No ORC Segment, suppress message...", char(0))
  Set oen_reply->out_msg = build("OEN_IGNORE", char(0))
  Go To EXITSCRIPT
endif


#EXITSCRIPT

declare current_program = vc
Set current_program = curprog
execute oencpm_msglog build("Out-", current_program, char(0))