 ;;Solution_Test/script/PathNet -- BB Transfusion/RETURNPRODUCTS/bbt_prod_ret_rel_assign.inc Turn on black mode

 
/*~BB~************************************************************************
      *                                                                      *
      *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
      *                              Technology, Inc.                        *
      *       Revision      (c) 1984-1994 Cerner Corporation                 *
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
  ~BE~************************************************************************
      *                   PathNet Blood Bank Transfusion                     *
      *                           V500 Script                                *
      *                     bbt_prod_ret_rel_assign.inc                      *
      *                                                                      *
      * PURPOSE:          update tables with product return information      *
      * LAST UPDATED BY:  CERMAO                                             *
      * DATE CREATED:     6-21-96                                            *
      * LAST MODIFIED:    6-21-96                                            *
      * TABLES USED:      product_return, assign                             *
      * PASSED IN:        record structure "request"                         *
      * PASSED OUT:       record structure "reply"                           *
      * ACTION#:          225002                                             *
      * REQUEST#:         225002                                             *
      * APPLICATION#:     225001                                             *
      * SPECIAL NOTES:                                                       *
      ************************************************************************/
;~DB~ ************************************************************************
;     *                      GENERATED MODIFICATION CONTROL LOG              *
;     ************************************************************************
;     *                                                                      *
;     *Mod Date     Engineer             Comment                             *
;     *--- -------- -------------------- ----------------------------------- *
;     *001 04/14/05 Jim Jensen           Correct Defect:  CR 1-319387292     *
;~DE~ ************************************************************************
               select into "nl:"
                      a.product_id,
                      a.product_event_id,
                      pe.product_id,
                      pe.product_event_id
 
               from assign a, product_event pe
               plan a where (a.product_event_id = request->productlist[prod]->assgn_prod_event_id)
                            And (a.product_id = request->productlist[prod]->product_id)
                            And (a.updt_cnt = request->productlist[prod]->as_updt_cnt)
               join pe where (pe.product_event_id = request->productlist[prod]->assgn_prod_event_id)
                             And (pe.product_id = request->productlist[prod]->product_id)
                             And (pe.event_type_cd = assgn_event_type_cd)
                             And (pe.updt_cnt = request->productlist[prod]->pe_as_updt_cnt)
 
               detail
                     quantity_val = a.cur_assign_qty          ;store the quantity assigened
                     quantity_iu  = a.cur_assign_intl_units   ;store the international units
               with nocounter
 
               if (curqual != 0)
                  select into "nl:"
                        a.product_id,
                        a.product_event_id
                     from assign a
                     plan a where (a.product_event_id = request->productlist[prod]->assgn_prod_event_id)
                              And (a.product_id = request->productlist[prod]->product_id)
                              And (a.updt_cnt = request->productlist[prod]->as_updt_cnt)
                     with nocounter ,forupdate(a)
                  if (curqual != 0)
                     select into "nl:"
                           pe.product_id,
                           pe.product_event_id
                        from product_event pe
                        plan pe where (pe.product_event_id = request->productlist[prod]->assgn_prod_event_id)
                                  And (pe.product_id = request->productlist[prod]->product_id)
                                  And (pe.event_type_cd = assgn_event_type_cd)
                                  And (pe.updt_cnt = request->productlist[prod]->pe_as_updt_cnt)
                        with nocounter ,forupdate(pe)
                  endif
               endif
 
               if (curqual = 0)
                  set error_process = "lock assign/product_event"
                  set error_message = "assign/product_event not locked"
                  set failure_occured = "T"
               else
                  ;__________________________________  update tables _____________________________________
                  update into assign a
                  set
                          a.cur_assign_qty   = if (request->productlist[prod]->product_type = "B")
                                                   0
                                                elseif (quantity_val <= request->productlist[prod]->return_qty)
                                                   0
                                                else
                                                   (quantity_val - request->productlist[prod]->return_qty)
                                                endif,
 
                          a.cur_assign_intl_units = if (request->productlist[prod]->product_type = "B")
                                                       0
                                                    elseif (quantity_val <= request->productlist[prod]->return_iu)
                                                       0
                                                    else
                                                       (quantity_iu - request->productlist[prod]->return_iu)
                                                    endif,
                          a.updt_cnt         = a.updt_cnt + 1,
                          a.updt_dt_tm       = cnvtdatetime(curdate,curtime3),
                          a.updt_task        = reqinfo->updt_task,
                          a.updt_id          = reqinfo->updt_id,
                          a.updt_applctx     = reqinfo->updt_applctx,
                          a.active_ind       =  if (request->productlist[prod]->product_type = "B")
                                                   0
                                                elseif (quantity_val <= request->productlist[prod]->return_qty)
                                                   0
                                                else
                                                   1
                                                endif,
                          a.active_status_cd   = if (request->productlist[prod]->product_type = "B")
                                                    ReqData->inactive_status_cd
                                                 elseif (quantity_val <= request->productlist[prod]->return_qty)
                                                    ReqData->inactive_status_cd
                                                 else
                                                    ReqData->active_status_cd
                                                 endif
                  plan a where (a.product_event_id = request->productlist[prod]->assgn_prod_event_id)
                               And (a.product_id = request->productlist[prod]->product_id)
                               And (a.updt_cnt = request->productlist[prod]->as_updt_cnt)
                  with counter
                  if (curqual = 0)
                     set error_process = "update assign"
                     set error_message = "assign row not updated"
                     set failure_occured = "T"
                  else
                     ;insert a row into the assign release table
                     /*
                     * Retrieve new sequence number for product_event_id
                     */
                     select into "nl:"
                          seqn        = seq(pathnet_seq,nextval)
                     from
                          dual
                     detail
                          assign_release_id   = seqn
                     with format, nocounter
                     if (curqual = 0)
                        set error_process = "insert assign_release_id"
                        set error_message = "assign_release_id not generated"
                        set failure_occured = "T"
                     else
                        insert into assign_release ar
                           set
                              ar.assign_release_id = assign_release_id,
                              ar.product_event_id  = request->productlist[prod]->assgn_prod_event_id,
                              ar.release_reason_cd = request->productlist[prod]->release_reason_cd,
                              ar.release_dt_tm     = cnvtdatetime(request->productlist[prod]->return_dt_tm),
                              ar.release_prsnl_ID  = reqinfo->updt_id,
                              ar.release_qty       = if (request->productlist[prod]->product_type = "B")
                                                        0
                                                     else
                                                        request->productlist[prod]->return_qty
                                                      endif,
                              ar.release_intl_units = if (request->productlist[prod]->product_type = "B")
                                                         0
                                                      else
                                                         request->productlist[prod]->return_iu
                                                       endif,
                              ar.updt_cnt          = 0,
                              ar.updt_dt_tm       = cnvtdatetime(curdate,curtime3),
                              ar.updt_task        = reqinfo->updt_task,
                              ar.updt_id          = reqinfo->updt_id,
                              ar.updt_applctx     = reqinfo->updt_applctx,
                              ar.active_ind       = 1,
                              ar.active_status_cd = ReqData->active_status_cd,
                              ar.active_status_dt_tm  = cnvtdatetime(curdate, curtime3),
                              ar.active_status_prsnl_id = ReqInfo->updt_id
                        with nocounter
                        ;update the product_event table
                        if (curqual = 0)
                           set error_process = "insert assign_release row"
                           set error_message = "assign_release row not updated"
                           set failure_occured = "T"
                        else
                           update into product_event pe
                           set
                              pe.active_ind =  if (request->productlist[prod]->product_type = "B")
                                                  0
                                               elseif (quantity_val <= request->productlist[prod]->return_qty)
                                                  0
                                               else
                                                  1
                                               endif,
                              pe.active_status_cd   = if (request->productlist[prod]->product_type = "B")
                                                         ReqData->inactive_status_cd
                                                      elseif (quantity_val <= request->productlist[prod]->return_qty)
                                                         ReqData->inactive_status_cd
                                                      else
                                                         ReqData->active_status_cd
                                                     endif,
                              pe.active_status_dt_tm  = cnvtdatetime(curdate, curtime3),
                              pe.active_status_prsnl_id = ReqInfo->updt_id,
                              pe.updt_cnt = pe.updt_cnt + 1,
                              pe.updt_dt_tm = cnvtdatetime(curdate,curtime3),
                              pe.updt_task  = reqinfo->updt_task,
                              pe.updt_id    = reqinfo->updt_id,
                              pe.updt_applctx = reqinfo->updt_applctx
                           plan pe where (pe.product_event_id = request->productlist[prod]->assgn_prod_event_id)
                                      And (pe.product_id = request->productlist[prod]->product_id)
                                      And (pe.event_type_cd = assgn_event_type_cd)
                                      And (pe.updt_cnt = request->productlist[prod]->pe_as_updt_cnt)
                           with counter
                           if (curqual = 0)
                              set error_process = "update event"
                              set error_message = "assign product_event event row not updated"
                              set failure_occured = "T"
                           elseif ((failure_occured = "F")
                                  ;if a blood product make sure there isn't an invalid state active for the product
                                   and (((active_quar = "F")
                                         and (active_uncfrm = "F")
                                         and (multiple_xm = "F")
                                         and (bActiveAutoFlag = "F")
                                         and (bActiveDirFlag  = "F")
                                         and (request->productlist[prod]->product_type = "B"))
                                        ;this should never be the case because the only event for a derivative will be
                                        ;transfused (release_assign flag will be "F".  This is in case derivatives are
                                        ;allowed multiple states at a later date or the specs of return change
                                        or (request->productlist[prod]->product_type = "D")
                                       )
                                  and (active_avail = "F")
                                  and (request->productlist[prod]->quar_flag != "T")
                                  )
                              ;add available event
                              call ADD_PRODUCT_EVENT
                                   (
                                   /* product_id               */ request->productlist[prod]->product_id,
                                   /* person_id                */ 0,
                                   /* encntr_id                */ 0,
                                   /* order_id                 */ 0,
                                   /* bb_result_id             */ 0,
                                   /* event_type_cd            */ avail_event_type_cd,
                                   /* event_dt_tm              */ cnvtdatetime(request->productlist[prod]->return_dt_tm),
                                   /* event_prsnl_id           */ ReqInfo->updt_id,
                                   /* event_status_flag        */ 0,
                                   /* override_ind             */ 0,
                                   /* override_reason_cd       */ 0,
                                   /* related_product_event_id */ 0,
                                   /* active_ind               */ 1,
                                   /* active_status_cd         */ ReqData->active_status_cd,
                                   /* active_status_dt_tm      */ cnvtdatetime(curdate, curtime3),
                                   /* active_status_prsnl_id   */ ReqInfo->updt_id
                                   )
                              if (curqual = 0)
                                 set error_process = "add product_event"
                                 set error_message = "available product_event row not added for assign"
                                 set failure_occured = "T"
                              endif   ;available product_event row not added
                           endif   ;update product event failed
                        endif   ;assign_release row not updated
                     endif   ;generate the assign_release_id
                  endif   ;assign row not updated
               endif   ;lock failed
 

;Generated by GNU enscript 1.6.4.
