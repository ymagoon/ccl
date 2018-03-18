 ;;Solution_Test/script/PathNet -- BB Transfusion/RETURNPRODUCTS/bbt_prod_ret_transfuse.inc Turn on black mode

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
      *                   PathNet Blood Bank Return                          *
      *                           V500 Script                                *
      *                    CHG_DISPENSE_ASSGN_EVENT                          *
      *                                                                      *
      * PURPOSE:          Do the functional processing for returning a       *
      *                   product to the blood bank.  This includes adding   * 
      *                   a quarantine event, releasing a crossmatch or      *
      *                   assignment, updating return information on the     *
      *                   product event table                                *
      * LAST UPDATED BY:  mo2420                                             *
      * DATE CREATED:     09/10/1996                                         *
      * LAST MODIFIED:    01/13/2000                                         *
      * TABLES USED:      PRODUCT_EVENT, TRANSFUSION,                        *
      * SPECIAL NOTES:    to be included by bbt_product_return               *
      ************************************************************************ /


             /*inacitvate the transfuse event on the product_event table and the transfusion table*/          
             select into "nl:"
                      tr.product_id,
                      tr.product_event_id
               from transfusion tr                
               plan tr where (tr.product_event_id = request->productlist[prod]->trans_prod_event_id)
                            And (tr.product_id = request->productlist[prod]->product_id) 
                            And (tr.updt_cnt = request->productlist[prod]->trans_updt_cnt)
               detail
                     quantity_val = tr.cur_transfused_qty  
                     quantity_iu  = tr.transfused_intl_units            
               with nocounter ,forupdate(tr)
             if (curqual = 0)    
               set error_process = "lock transfusion"
               set error_message = "transfusion not locked"
               set failure_occured = "T"
             else 
             	set unreturned_qty = quantity_val - request->productlist[prod]->return_qty
             	set unreturned_iu = quantity_iu - request->productlist[prod]->return_iu	
               select into "nl:"
                      pe.product_id,
                      pe.product_event_id
                  from product_event pe               
                  plan pe where (pe.product_event_id = request->productlist[prod]->trans_prod_event_id)
                             And (pe.product_id = request->productlist[prod]->product_id) 
                             And (pe.updt_cnt = request->productlist[prod]->trans_pe_updt_cnt)
                  detail
                     request->productlist[prod]->pd_prod_event_id = pe.related_product_event_id ;004 see parent script       
                  with nocounter , forupdate(pe)
               if (curqual = 0)    
                  set error_process = "lock product_event"
                  set error_message = "product_event not locked"
                  set failure_occured = "T"
               else 
                    ;______________________________________ update transfusion table ____________________________________
                  update into transfusion tr 
                      set  
                         tr.cur_transfused_qty  = if (request->productlist[prod]->product_type = "B")
                                                     0
                                                  elseif (quantity_val <= request->productlist[prod]->return_qty)
                                                     0 
                                                  else
                                                     (quantity_val - request->productlist[prod]->return_qty)
                                                  endif,
                         tr.transfused_intl_units = if (request->productlist[prod]->product_type = "B")
                                                       0
                                                    else
                                                       (quantity_iu - request->productlist[prod]->return_iu)
                                                    endif,
                         tr.transfused_vol     = if (request->productlist[prod]->product_type = "B")
                                                     0
                                                 else
                                                     (quantity_iu - request->productlist[prod]->return_iu)
                                                 endif,                      
                         tr.updt_cnt           = tr.updt_cnt + 1,
                         tr.updt_dt_tm         = cnvtdatetime(curdate,curtime3),
                         tr.updt_task          = reqinfo->updt_task,
                         tr.updt_id            = reqinfo->updt_id,
                         tr.updt_applctx       = reqinfo->updt_applctx,
                         tr.active_ind         =  if (request->productlist[prod]->product_type = "B")
                                                     0
                                                  elseif (quantity_val <= request->productlist[prod]->return_qty)
                                                     0
                                                  else
                                                     1     
                                                  endif,
                         tr.active_status_cd   = if (request->productlist[prod]->product_type = "B")
                                                    ReqData->inactive_status_cd
                                                 elseif (quantity_val <= request->productlist[prod]->return_qty)
                                                    ReqData->inactive_status_cd
                                                 else
                                                    ReqData->active_status_cd    
                                                 endif
                  plan tr where (tr.product_event_id = request->productlist[prod]->trans_prod_event_id)
                            And (tr.product_id = request->productlist[prod]->product_id) 
                            And (tr.updt_cnt = request->productlist[prod]->trans_updt_cnt)
                  with counter
                  if (curqual = 0)    
                     set error_process = "update transfusion"
                     set error_message = "transfusion not updated"
                     set failure_occured = "T"
                  else 
                     update into product_event pe
                         set  
                             pe.active_ind = if (request->productlist[prod]->product_type = "B")
                                                         0
                                                     elseif (quantity_val <= request->productlist[prod]->return_qty)
                                                         0
                                                     else
                                                         1     
                                                     endif,
                             pe.active_status_cd = if (quantity_val <= request->productlist[prod]->return_qty)              
                                                                  ReqData->inactive_status_cd
                                                               else 
                                                                   ReqData->active_status_cd
                                                               endif,                                                                                          
                             pe.updt_cnt = pe.updt_cnt + 1,
                             pe.updt_dt_tm = cnvtdatetime(curdate,curtime3),
                             pe.updt_task  = reqinfo->updt_task,
                             pe.updt_id    = reqinfo->updt_id,
                             pe.updt_applctx = reqinfo->updt_applctx
                     plan pe where (pe.product_event_id = request->productlist[prod]->trans_prod_event_id)
                                           And (pe.product_id = request->productlist[prod]->product_id) 
                                           And (pe.updt_cnt = request->productlist[prod]->trans_pe_updt_cnt)
                     with counter
                     if (curqual = 0)    
                        set error_process = "update event"
                        set error_message = "transfusion product_event not updated"
                        set failure_occured = "T"                    
                     endif   ;update product event failed
                  endif   ;update crossmatch
                endif  ; product_event lock failed
             endif   ; transfusion lock failed

               
               /* if  there is an asignment or crossmatch and it is not to be released then reacitivate it*/
               /*if it is  a derivative and it is to be quarantined do not reactivate the assignment*/ 
               /*if it is  a derivative it will either be made available or quarantined             */ 
               if (    (request->productlist[prod]->rel_assign_flag = "F") 
                   and (request->productlist[prod]->rel_xmatch_flag = "F")
                   and (request->productlist[prod]->assgn_prod_event_id > 0)
                   and (request->productlist[prod]->product_type = "B") 
                   and (failure_occured = "F")  
                  )
                  select into "nl:"
                       pe.product_event_id,
                       a.product_event_id,
                       xm.product_event_id,
                       tablefrom = decode(a.seq, "asgn", xm.seq, "xmtc","unkn") 
                  from assign a, crossmatch xm, product_event pe,(dummyt d1 with seq = 1)
                  plan pe where (pe.product_event_id = request->productlist[prod]->assgn_prod_event_id)            
                                and (pe.updt_cnt = request->productlist[prod]->pe_as_updt_cnt)
                  join (d1 where (d1.seq = 1))   
                        join (a where ((a.product_event_id = request->productlist[prod]->assgn_prod_event_id)
                                       and (a.updt_cnt = request->productlist[prod]->as_updt_cnt))
                             )
                        orjoin (xm where ((xm.product_event_id = request->productlist[prod]->assgn_prod_event_id)
                                          and (xm.updt_cnt = request->productlist[prod]->as_updt_cnt))                                   
                               )   
                  detail 
                       if (tablefrom = "asgn")
                            thistable = "asgn"
                       elseif (tablefrom = "xmtc")
                            thistable = "xmtc"
                       endif
                  with nocounter
                  if (curqual = 0)
                     set failure_occured = "T"
                     set reply->status_data->status = "F"
                     set reply->status_data->subeventstatus[prod]->OperationName = "lock"
                     set reply->status_data->subeventstatus[prod]->OperationStatus = "F"
                     set error_process = "lock tables for update"
                     set error_message = "reinstate: unable to lock tables for update"
                  else    
                  ;set the active_ind in the product event table
                     update into product_event pe   
                     set  
                        pe.active_ind = 1,
                        pe.active_status_cd = ReqData->active_status_cd,                                                                                             
                        pe.updt_cnt = pe.updt_cnt + 1,
                        pe.updt_dt_tm = cnvtdatetime(curdate,curtime3),
                        pe.updt_task  = reqinfo->updt_task,
                        pe.updt_id    = reqinfo->updt_id,
                        pe.updt_applctx = reqinfo->updt_applctx
                     plan pe where (pe.product_event_id = request->productlist[prod]->assgn_prod_event_id)            
                                   and (pe.updt_cnt = request->productlist[prod]->pe_as_updt_cnt)
                     with counter
                     if (curqual = 0)
                        set reply->status_data->status = "F"
                        set reply->status_data->subeventstatus[prod]->OperationName = "update"
                        set reply->status_data->subeventstatus[prod]->OperationStatus = "F"    
                        set error_process = "update product event"
                        set error_message = "reinstate product_event for assign/xmatch not updated"
                        set failure_occured = "T"
                     elseif (thistable = "asgn")                    
                        update into assign a
                           set
                              a.updt_cnt                      = a.updt_cnt + 1,
                              a.updt_dt_tm                    = cnvtdatetime(curdate, curtime3),
                              a.updt_id                       = ReqInfo->updt_id,
                              a.updt_task                     = ReqInfo->updt_task,
                              a.updt_applctx                  = ReqInfo->updt_applctx,
                              a.active_ind                    = 1,
                              a.active_status_cd              = ReqData->active_status_cd                                                                
                        where (a.product_event_id = request->productlist[prod]->assgn_prod_event_id)
                               and (a.updt_cnt = request->productlist[prod]->as_updt_cnt)
                        with nocounter
                        if (curqual = 0)
                           set failure_occured = "T"
                           set reply->status_data->status = "F"
                           set reply->status_data->subeventstatus[prod]->OperationName = "chg"
                           set reply->status_data->subeventstatus[prod]->OperationStatus = "F"
                           set error_process = "reisntate assign"
                           set error_message = "unable to reistate assign"
                        endif
                     elseif (thistable = "xmtc")
                        update into crossmatch xm
                           set
                              xm.updt_cnt                      = xm.updt_cnt + 1,
                              xm.updt_dt_tm                    = cnvtdatetime(curdate, curtime3),
                              xm.updt_id                       = ReqInfo->updt_id,
                              xm.updt_task                     = ReqInfo->updt_task,
                              xm.updt_applctx                  = ReqInfo->updt_applctx,
                              xm.active_ind                    = 1,
                              xm.active_status_cd              = ReqData->active_status_cd
                        where (xm.product_event_id = request->productlist[prod]->assgn_prod_event_id)
                               and (xm.updt_cnt = request->productlist[prod]->as_updt_cnt)     
                        with nocounter
                        if (curqual = 0)
                           set failure_occured = "T"
                           set reply->status_data->status = "F"
                           set reply->status_data->subeventstatus[prod]->OperationName = "chg"
                           set reply->status_data->subeventstatus[prod]->OperationStatus = "F"
                           set error_process = "reinstate crossmatch"
                           set error_message = "unable to reinstate crossmatch"
                        endif
                     endif
                  endif
               endif     
                                      
                    

;Generated by GNU enscript 1.6.4.
