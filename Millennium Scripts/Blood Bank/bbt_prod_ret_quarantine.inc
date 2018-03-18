 ;;Solution_Test/script/PathNet -- BB Transfusion/RETURNPRODUCTS/bbt_prod_ret_quarantine.inc Turn on black mode


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
      *                     bbt_prod_ret_quarantine.inc                      *
      *                                                                      *
      * PURPOSE:          update tables with product return information      *
      * LAST UPDATED BY:  CERMAO                                             *
      * DATE CREATED:     6-21-96                                            *
      * LAST MODIFIED:    6-21-96                                            *
      * TABLES USED:      product_event, quarantine                          *
      * PASSED IN:        record structure "request"                         *
      * PASSED OUT:       record structure "reply"                           *
      * ACTION#:          225002                                             *
      * REQUEST#:         225002                                             *
      * APPLICATION#:     225001                                             *
      * SPECIAL NOTES:                                                       *
      ************************************************************************/

               for (quarcnt = 1 to nbr_quar_reasons)
                  call ADD_PRODUCT_EVENT
                      (                             
                      /* product_id               */ request->productlist[prod]->product_id,
                      /* person_id                */ 0,
                      /* encntr_id                */ 0,
                      /* order_id                 */ 0,   
                      /* bb_result_id             */ 0,
                      /* event_type_cd            */ quar_event_type_cd,
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
                      set error_message = "quarantine product_event row not added"
                      set failure_occured = "T"
                  else 
                  ;insert a row into the quarantine table          
                     
                      insert into quarantine qu
                          set qu.product_event_id     = product_event_id,
                              qu.product_id           = request->productlist[prod]->product_id,
                              qu.quar_reason_cd       = request->productlist[prod]->quarlist[quarcnt]->quar_reason_cd,
                              qu.orig_quar_qty        = if (request->productlist[prod]->product_type = "B")
                                                           0
                                                        else
                                                           request->productlist[prod]->return_qty
                                                        endif,
                              qu.cur_quar_qty         = if (request->productlist[prod]->product_type = "B")
                                                           0
                                                        else
                                                           request->productlist[prod]->return_qty
                                                        endif,
                              qu.orig_quar_intl_units = if (request->productlist[prod]->product_type = "B")
                                                           0
                                                        else
                                                           request->productlist[prod]->return_iu
                                                        endif,
                              qu.cur_quar_intl_units  = if (request->productlist[prod]->product_type = "B")
                                                           0
                                                        else
                                                           request->productlist[prod]->return_iu
                                                        endif,
                              qu.updt_cnt             = 0,
                              qu.updt_dt_tm           = cnvtdatetime(curdate, curtime3),
                              qu.updt_id              = ReqInfo->updt_id,
                              qu.updt_task            = ReqInfo->updt_task,
                              qu.updt_applctx         = ReqInfo->updt_applctx,
                              qu.active_ind           = 1,
                              qu.active_status_cd     = ReqData->active_status_cd,
                              qu.active_status_dt_tm  = cnvtdatetime(curdate, curtime3),
                              qu.active_status_prsnl_id = ReqInfo->updt_id
                     with counter                  
                     if (curqual = 0)    
                        set error_process = "add quarantine"
                        set error_message = "quarantine event row not added"
                        set failure_occured = "T"
                     endif ;add quarantine failed             
                  endif  ;add product event failed  
               endfor  ;1 to nbr_quar_reasons

;Generated by GNU enscript 1.6.4.
