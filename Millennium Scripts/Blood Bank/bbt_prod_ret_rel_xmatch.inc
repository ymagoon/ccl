 ;;Solution_Test/script/PathNet -- BB Transfusion/RETURNPRODUCTS/bbt_prod_ret_rel_xmatch.inc Turn on black mode

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
      *                     bbt_prod_ret_rel_xmatch.inc                      *
      *                                                                      *
      * PURPOSE:          update tables with product return information      *
      * LAST UPDATED BY:  CERMAO                                             *
      * DATE CREATED:     6-21-96                                            *
      * LAST MODIFIED:    6-21-96                                            *
      * TABLES USED:      product_return, crossmatch                         *
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
                    xm.product_id,
                    xm.product_event_id
 
                from
                    crossmatch xm
 
                plan    xm  where   xm.product_event_id     = request->productlist[prod]->assgn_prod_event_id
                                      and xm.updt_cnt       = request->productlist[prod]->as_updt_cnt
                detail
                    quantity_val = xm.crossmatch_qty        ; store the quantity xmatched
 
                with    nocounter, forupdate(xm)
 
                if (curqual = 0)
                   set error_process = "lock crossmatch"
                   set error_message = "crossmatch not locked"
                   set failure_occured = "T"
                else
                   select into "nl:"
                       pe.product_id,
                       pe.product_event_id
 
                      from
                         product_event pe
 
                      plan    pe  where   pe.product_event_id     = request->productlist[prod]->assgn_prod_event_id
                                    and pe.updt_cnt       = request->productlist[prod]->pe_as_updt_cnt
 
                      with    nocounter, forupdate(pe)
 
                   if (curqual = 0)
                      set error_process = "lock product_event"
                      set error_message = "product_event not locked"
                      set failure_occured = "T"
                   else
                      ;______________________________________ update tables ____________________________________
                      update into crossmatch xm
                       set
                         xm.release_reason_cd = request->productlist[prod]->release_reason_cd,
                         xm.release_dt_tm = cnvtdatetime(request->productlist[prod]->return_dt_tm),
                         xm.release_prsnl_ID = reqinfo->updt_id,
                         xm.release_qty  = if (request->productlist[prod]->product_type = "B")
                                              0
                                           elseif (quantity_val = request->productlist[prod]->return_qty)
                                              0
                                           else
                                              (request->productlist[prod]->return_qty)
                                           endif,
                         xm.crossmatch_qty = if (request->productlist[prod]->product_type = "B")
                                                0
                                             elseif (quantity_val = request->productlist[prod]->return_qty)
                                                0
                                             else
                                                (quantity_val - request->productlist[prod]->return_qty)
                                             endif,
                         xm.updt_cnt         = xm.updt_cnt + 1,
                         xm.updt_dt_tm       = cnvtdatetime(curdate,curtime3),
                         xm.updt_task        = reqinfo->updt_task,
                         xm.updt_id          = reqinfo->updt_id,
                         xm.updt_applctx     = reqinfo->updt_applctx,
                         xm.active_ind       = if (request->productlist[prod]->product_type = "B")
                                                  0
                                               elseif (quantity_val = request->productlist[prod]->return_qty)
                                                  0
                                               else
                                                   xm.active_ind
                                               endif,
                         xm.active_status_cd = if (request->productlist[prod]->product_type = "B")
                                                  ReqData->inactive_status_cd
                                               elseif (quantity_val = request->productlist[prod]->return_qty)
                                                  ReqData->inactive_status_cd
                                               else
                                                  ReqData->active_status_cd
                                               endif
                       plan xm where (xm.product_event_id = request->productlist[prod]->assgn_prod_event_id)
                               And (xm.product_id = request->productlist[prod]->product_id)
                               And (xm.updt_cnt = request->productlist[prod]->as_updt_cnt)
                       with counter
 
                      if (curqual = 0)
                         set error_process = "update crossmatch"
                         set error_message = "crossmatch not updated"
                         set failure_occured = "T"
                      else
                        update into product_event pe
                         set
                             pe.active_ind = if (request->productlist[prod]->product_type = "B")
                                                  0
                                               elseif (quantity_val = request->productlist[prod]->return_qty)
                                                  0
                                               else
                                                  1
                                               endif,
                             pe.active_status_cd = if (request->productlist[prod]->product_type = "B")
                                                      ReqData->inactive_status_cd
                                                   elseif (quantity_val = request->productlist[prod]->return_qty)
                                                      ReqData->inactive_status_cd
                                                   else
                                                      ReqData->active_status_cd
                                                   endif,
                             pe.updt_cnt               = pe.updt_cnt + 1,
                             pe.updt_dt_tm             = cnvtdatetime(curdate,curtime3),
                             pe.updt_task              = reqinfo->updt_task,
                             pe.updt_id                = reqinfo->updt_id,
                             pe.updt_applctx           = reqinfo->updt_applctx
                         plan pe where (pe.product_event_id = request->productlist[prod]->assgn_prod_event_id)
                                   And (pe.product_id = request->productlist[prod]->product_id)
                                   And (pe.event_type_cd = xmtch_event_type_cd)
                                   And (pe.updt_cnt = request->productlist[prod]->pe_as_updt_cnt)
                         with counter
                        if (curqual = 0)
                           set error_process = "update event"
                           set error_message = "crossmatch product_event not updated"
                           set failure_occured = "T"
                        elseif ((failure_occured = "F")
                             ;if a blood product make sure there isn't an invalid state active for the product
                             and ( ((active_quar = "F") and (active_uncfrm = "F") and (multiple_xm = "F") 
                                and (bActiveAutoFlag = "F") and (bActiveDirFlag  = "F")
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
                           set error_message = "available product_event row not added for crossmatch"
                           set failure_occured = "T"
                        endif   ;available product_event row not added
                       endif   ;update product event failed
                      endif   ;update crossmatch
                   endif  ; product_event lock failed
                endif   ; crossmatch lock failed
 

;Generated by GNU enscript 1.6.4.
