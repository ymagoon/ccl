 ;;Solution_Test/script/PathNet -- BB Transfusion/RETURNPRODUCTS/bbt_prod_ret_return.inc Turn on black mode


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
      *                        bbt_prod_ret_return.inc                       *
      *                                                                      *
      * PURPOSE:          update tables with product return information      *
      * LAST UPDATED BY:  mo2420                                             *
      * DATE CREATED:     6-21-96                                            *
      * LAST MODIFIED:    2-4-97                                             *
      * TABLES USED:      patient dispense, dispense_return,product_return   *
      * PASSED IN:        record structure "request"                         *
      * PASSED OUT:       record structure "reply"                           *
      * ACTION#:          225002                                             *
      * REQUEST#:         225002                                             *
      * APPLICATION#:     225                                                *
      * SPECIAL NOTES:                                                       *
      ************************************************************************/
;~DB~ ************************************************************************
;     *                      GENERATED MODIFICATION CONTROL LOG              *
;     ************************************************************************
;     *                                                                      *
;     *Mod Date     Engineer             Comment                             *
;     *--- -------- -------------------- ----------------------------------- *
;     *001 04/14/05 Jim Jensen           Correct Defect:  CR 1-319387292     *
;     *002 09/06/05 Jason Osborn         Correct Defect:  CR 1-451765011     *
;     *003 01/24/07 Rahul Deshpande      Enhancement:	  CR 1-1714485721    *
;     *004 02/19/09 Sachin Yadav		 added return_temperature_txt        *
;~DE~ ************************************************************************
 
/********************************************************************************
This section should only happen if the quantity returned is a dispensed quantity
********************************************************************************/
 
 
        if ((request->productlist[prod]->transfuse_flag != "T" or request->productlist[prod]->product_type = "B")
               and (failure_occured = "F"))
           select into "nl:"
                      pd.product_id,
                      pd.product_event_id,
                      pd.cur_dispense_qty
               from patient_dispense pd
               plan pd where (pd.product_event_id = request->productlist[prod]->pd_prod_event_id)
                             And (pd.product_id = request->productlist[prod]->product_id)
                             And (pd.updt_cnt = request->productlist[prod]->pd_updt_cnt)
               detail
                     quantity_val = pd.cur_dispense_qty        ;store the quantity dispensed
                     quantity_iu = pd.cur_dispense_intl_units  ;store the international units
                     location_cd = pd.dispense_from_locn_cd    ;store the location code
                     ;set the flag if the unit was emergency dispensed 
                     emergency_dispense = if (pd.unknown_patient_ind = 1)
                                             "T"
                                          else
                                             "F"
                                          endif
               with nocounter ,forupdate(pd)
 
           if (curqual = 0)
              set error_process = "lock patient_dispense"
              set error_message = "patient_dispense not locked"
              set failure_occured = "T"
           else
              select into "nl:"
                      pe.product_id,
                      pe.product_event_id
               from product_event pe
               plan pe where (pe.product_event_id = request->productlist[prod]->pd_prod_event_id)
                             And (pe.product_id = request->productlist[prod]->product_id)
                             And (pe.event_type_cd = dispns_event_type_cd)
                             And (pe.updt_cnt = request->productlist[prod]->pe_pd_updt_cnt)
               with nocounter ,forupdate(pe)
 
               if (curqual = 0)
                  set error_process = "lock product_event"
                  set error_message = "product_event not locked"
                  set failure_occured = "T"
               else
                  update into patient_dispense pd
                     set
                        pd.dispense_status_flag = 3,               ;returned
                        pd.cur_dispense_qty = if (request->productlist[prod]->product_type = "B")
                                                 0
                                              elseif (quantity_val <= request->productlist[prod]->return_qty)
                                                 0
                                              else
                                                 pd.cur_dispense_qty - request->productlist[prod]->return_qty
                                              endif,
                        pd.cur_dispense_intl_units = if (request->productlist[prod]->product_type = "B")
                                                        0
                                                     else
                                                        pd.cur_dispense_intl_units - request->productlist[prod]->return_iu
                                                     endif,
                        pd.updt_cnt            = pd.updt_cnt + 1,
                        pd.updt_dt_tm          = cnvtdatetime(curdate,curtime3),
                        pd.updt_task           = reqinfo->updt_task,
                        pd.updt_id             = reqinfo->updt_id,
                        pd.updt_applctx        = reqinfo->updt_applctx,
                        pd.active_ind          =  if (request->productlist[prod]->product_type = "B")
                                                     0
                                                  elseif (quantity_val <= request->productlist[prod]->return_qty)
                                                     0
                                                  else
                                                     1
                                                  endif,
                        pd.active_status_cd     = if (request->productlist[prod]->product_type = "B")
                                                      ReqData->inactive_status_cd
                                                   elseif (quantity_val <= request->productlist[prod]->return_qty)
                                                      ReqData->inactive_status_cd
                                                   else
                                                      ReqData->active_status_cd
                                                   endif
                  plan pd where (pd.product_event_id = request->productlist[prod]->pd_prod_event_id)
                            And (pd.product_id = request->productlist[prod]->product_id)
                            And (pd.updt_cnt = request->productlist[prod]->pd_updt_cnt)
                  with counter
                  if (curqual = 0)
                     set error_process = "update patient_dispense"
                     set error_message = "patient_dispense not updated"
                     set failure_occured = "T"
                  else
                     ;update the patient_dispense row on the product_event table
                     update into product_event pe
                     set
                         pe.updt_cnt = pe.updt_cnt + 1,
                         pe.updt_dt_tm = cnvtdatetime(curdate,curtime3),
                         pe.updt_task  = reqinfo->updt_task,
                         pe.updt_id    = reqinfo->updt_id,
                         pe.updt_applctx = reqinfo->updt_applctx,
                         pe.active_ind           = if (request->productlist[prod]->product_type = "B")
                                                      0
                                                   elseif (quantity_val <= request->productlist[prod]->return_qty)
                                                      0
                                                   else
                                                      1
                                                   endif,
                         pe.active_status_cd     = if (request->productlist[prod]->product_type = "B")
                                                      ReqData->inactive_status_cd
                                                   elseif (quantity_val <= request->productlist[prod]->return_qty)
                                                      ReqData->inactive_status_cd
                                                   else
                                                      ReqData->active_status_cd
                                                   endif
                     plan pe where (pe.product_event_id = request->productlist[prod]->pd_prod_event_id)
                                   And (pe.product_id = request->productlist[prod]->product_id)
                                   And (pe.event_type_cd = dispns_event_type_cd)
                                   And (pe.updt_cnt = request->productlist[prod]->pe_pd_updt_cnt)
                     with counter
                     if (curqual = 0)
                        set error_process = "update event"
                        set error_message = "product_event not updated"
                        set failure_occured = "T"
                     endif   ;updating product event for dispensed failed
                  endif  ;update patient_dispense failed
               endif   ;lock failed - product_event
           endif  ; lock failed - patient dispense
        endif    ;failure_occured = "F"
 
 
/********************************************************************************
This section should happen for all returned quantities, regardless if it's a
transfused quantity.
********************************************************************************/
 
 
            if (failure_occured = "F")
               /*
               * Retrieve new sequence number for product_event_id
               */
               select into "nl:"
                   seqn        = seq(pathnet_seq,nextval)
               from
                    dual
               detail
                    dispense_return_id        =  seqn
               with
                    nocounter
 
               if (curqual = 0)
                  set error_process = "generate dispense_return_id"
                  set error_message = "dispense_return_id not generated"
                  set failure_occured = "T"
               else
                  insert into dispense_return dr
                  set
                     dr.product_event_id    = request->productlist[prod]->pd_prod_event_id,
                     dr.dispense_return_id  = dispense_return_id,
                     dr.product_id          = request->productlist[prod]->product_id,
                     dr.return_prsnl_id     = reqinfo->updt_id,
                     dr.return_qty          = request->productlist[prod]->return_qty,
                     dr.return_intl_units   = request->productlist[prod]->return_iu,
                     dr.return_dt_tm        = cnvtdatetime(request->productlist[prod]->return_dt_tm),
                     dr.return_reason_cd    = request->productlist[prod]->return_reason_cd,
                     dr.return_courier_id   = request->productlist[prod]->return_courier_id,
                     dr.return_courier_text = request->productlist[prod]->return_courier_text,
                     dr.return_vis_insp_cd  = request->productlist[prod]->return_vis_insp_cd,
                     dr.active_ind          = 1,
                     dr.active_status_cd     = ReqData->active_status_cd,
                     dr.active_status_dt_tm  = cnvtdatetime(curdate, curtime3),
                     dr.active_status_prsnl_id = ReqInfo->updt_id,
                     dr.updt_cnt            = 0,
                     dr.updt_dt_tm       = cnvtdatetime(curdate,curtime3),
                     dr.updt_task        = reqinfo->updt_task,
                     dr.updt_id          = reqinfo->updt_id,
                     dr.updt_applctx     = reqinfo->updt_applctx,
                     dr.return_temperature_value = request->productlist[prod]->return_temperature_value,
                     dr.return_temperature_txt    = request->productlist[prod]->return_temperature_txt,
                     dr.return_temperature_degree_cd = request->productlist[prod]->return_temperature_degree_cd
 
                  with counter
                  if (curqual = 0)
                     set error_process = "insert dispense_return"
                     set error_message = "dispense_return event row not added"
                     set failure_occured = "T"
                  else
                     set failure_occured = "F"
                     ;add to quantity available
                     ;if derivative update into the derivative cur_avail_qty and not quarantined
                     ;or if blood product, emergency dispensed, not  to be quarantined and no invalid states
                     ;create an available state for product
                     if (
                         (request->productlist[prod]->product_type = "D")
                         and (request->productlist[prod]->quar_flag != "T")
                        )
                        ;update the update count if there are no other events for this product_id
                        update into derivative der
                        set
                            der.cur_avail_qty = der.cur_avail_qty + request->productlist[prod]->return_qty,
                            der.cur_intl_units = der.cur_intl_units + request->productlist[prod]->return_iu,
                            der.updt_cnt      = if (multiple_events = "F")
                                                   der.updt_cnt + 1
                                                else
                                                   der.updt_cnt
                                                endif,
                            der.updt_dt_tm = cnvtdatetime(curdate,curtime3),
                            der.updt_task  = reqinfo->updt_task,
                            der.updt_id    = reqinfo->updt_id,
                            der.updt_applctx = reqinfo->updt_applctx
                        plan der where (der.product_id = request->productlist[prod]->product_id)
                                  And (der.updt_cnt = request->productlist[prod]->der_updt_cnt)
                        with counter
                        if (curqual = 0)
                           set error_process = "updt derivative"
                           set error_message = "available qty not updated on derivative"
                           set failure_occured = "T"
                        ;else if there is not an active available the make one
                        elseif (active_avail = "F"
                           and  bActiveAutoFlag = "F"
                           and  bActiveDirFlag  = "F")
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
                        endif   ;udpate derivative cur_avail_qty failed
                     elseif ( (request->productlist[prod]->product_type = "B")
                              and (request->productlist[prod]->quar_flag != "T")
                              and (request->productlist[prod]->rel_assign_flag = "F")
                              and (request->productlist[prod]->assgn_prod_event_id = 0.0)
                              and (active_quar = "F")
                              and (active_uncfrm = "F")
                              and (multiple_xm = "F")
                              and (emergency_dispense = "T" or bDispOnlyFlag = "T")
                            )
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
                     endif     ;product a derivative
                  endif   ;insert into dispense_return failed
               endif   ;generating dispense_return_id
            endif
 

;Generated by GNU enscript 1.6.4.
