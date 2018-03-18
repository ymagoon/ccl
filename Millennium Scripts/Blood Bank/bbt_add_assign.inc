 ;;Solution_Test/script/PathNet -- BB Transfusion/Bbt_Assign/BBT_ADD_ASSIGN.INC Turn on black mode

/*~BB~************************************************************************
  *                                                                      *
  *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
  *                              Technology, Inc.                        *
  *       Revision      (c) 1984-1995 Cerner Corporation                 *
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
  ~BE~***********************************************************************/
/*****************************************************************************

        Source file name:       BBT_GET_SPECIAL_TESTING
        Object name:            BBT_GET_SPECIAL_TESTING
        Request #:              ?

        Product:                Transfusion
        Product Team:           Blood Bank
        HNA Version:            500
        CCL Version:            4.0

        Program purpose:        Get the special testing associated with a 
                                given product

        Tables read:            Special_Testing

        Tables updated:         None

        Executing from:         Dispense,...

        Special Notes:          Needs %i cclsource:bbt_add_product_event.inc
                                      END             ; end subroutine
                                in calling program.  
                                See subroutine parameters which must be passed.
                                Calling program must set assign_status = " "
******************************************************************************/
;~DB~************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *                                                                      *
;    *Mod Date     Engineer             Comment                             *
;    *--- -------- -------------------- ----------------------------------- *
;     000 08/12/96 Teresa Davis         Initial Release                     *
;     001 07/29/05 Jeff Wain            Added sub_product_event_id to fix   *
;                                       CCLQuery errors and changed sets on *
;                                       id/cd values to 0.0 for long sequences
;~DE~************************************************************************
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************

subroutine ADD_ASSIGN
   ( sub_product_id,
     sub_person_id,
     encntr_id,
     sub_assign_reason_cd,
     sub_prov_id,
     qty_assigned,
     assign_intl_units,
     sub_updt_id,
     sub_updt_task,
     sub_updt_applctx,
     sub_active_status_cd,
     sub_active_status_prsnl_id,
     assign_dt_tm
     )
  
   set assign_event_id = 0.0
   set event_type_cd = 0.0
   CALL get_event_type ("1" )
   if (event_type_cd = 0)
       set assign_status = "F"
   else

%I CCLSOURCE:BBT_GET_PATHNET_SEQ.INC

       set product_event_id = 0.0      ; used in bbt_add_product_event.inc
       set sub_product_event_id = 0.0  ; sub_product_event_id added to fix CCLQuery errors.

       /*  insert a row into the Product Event table for the assign *
        *  event                                                      */
       call ADD_PRODUCT_EVENT
       (
          /* sub_product_id             */ sub_product_id,
          /* sub_person_id              */ sub_person_id,
          /* encntr_id              */ encntr_id,   
          /* order_id               */ 0,
          /* bb_result_id           */ 0,
          /* event_type_cd          */ event_type_cd,
          /* event_dt_tm            */ cnvtdatetime(assign_dt_tm),
          /* event_prsnl_id         */ Reqinfo->updt_id,
          /* event_status_flag      */ 0,
          /* override_ind             */ 0,
          /* override_reason_cd       */ 0,
          /* related_product_event_id */ 0,
          /* active_ind             */ 1,
          /* sub_active_status_cd       */ Reqdata->active_status_cd,
          /* active_status_dt_tm    */ cnvtdatetime(curdate, curtime3),
          /* sub_active_status_prsnl_id */ ReqInfo->updt_id
       )
       
       set sub_product_event_id = product_event_id

       if (curqual = 0)
           set assign_status = "F"
       else

          /* Insert row into assign table for assign event */
          insert into assign a set
              a.product_event_id             = sub_product_event_id,
              a.product_id                   = sub_product_id,
              a.person_id                    = sub_person_id,
              a.assign_reason_cd             = sub_assign_reason_cd,
              a.prov_id                      = sub_prov_id,  
              a.orig_assign_qty              = qty_assigned,
              a.cur_assign_qty               = qty_assigned,
              a.cur_assign_intl_units        = assign_intl_units,
              a.orig_assign_intl_units       = assign_intl_units,
              a.updt_cnt                     = 0,
              a.updt_dt_tm                   = cnvtdatetime(curdate, curtime3),
              a.updt_id                      = sub_updt_id,                ;ReqInfo->updt_id,
              a.updt_task                    = sub_updt_task,              ;ReqInfo->updt_task,
              a.updt_applctx                 = sub_updt_applctx,           ;ReqInfo->updt_applctx,
              a.active_ind                   = 1,
              a.active_status_cd             = sub_active_status_cd,       ;ReqData->active_status_cd,
              a.active_status_dt_tm          = cnvtdatetime(curdate, curtime3),
              a.active_status_prsnl_id       = sub_active_status_prsnl_id ; ReqInfo->updt_id
          with counter

          if (curqual = 0)
              set assign_status = "F"              
          else
              set assign_event_id = sub_product_event_id
              set assign_status = "S"
          endif             
      endif
   endif
end
         

subroutine Get_Event_type
    ( meaning
    )
    /* Retrieve assigned_event_type_cd from code_value table */
        
    select into "nl:"
        cv.code_value 
    from 
        code_value cv
    where (cv.code_set = 1610     ; product state code_set
      and cv.cdf_meaning = meaning)    ; assigned cdf_meaning
    detail        event_type_cd = cv.code_value
    with counter
end          ; end subroutine

;Generated by GNU enscript 1.6.4.
