 ;;Solution_Test/script/PathNet -- BB Transfusion/BBT_EXCEPTIONS/bbt_add_bb_exception.inc Turn on black mode

 
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
 
        Source file name:       BBT_ADD_BB_EXCEPTION.INC
        Object name:            BB_ADD_BB_EXCEPTION
        Request #:              ?
 
        Product:                Transfusion
        Product Team:           Blood Bank
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        Add row to BB_Exception table
 
        Tables read:            Code_value
 
        Tables updated:         BB_Exception
 
        Executing from:         Dispense, Pool, Result Entry
 
        Special Notes:          Needs bb_exception_id defined in main program.
                                Also exception_status needs to be defined by
                                main program.
******************************************************************************/
;~DB~************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *                                                                      *
;    *Mod Date     Engineer             Comment                             *
;    *--- -------- -------------------- ----------------------------------- *
;     000 11/06/96 Teresa Davis         Initial Release                     *
;    *001 10/09/98 Doug Saus            Added fields for CXM exception      *
;    *002 04/06/99 Matt Benson          Changed CV select to uar call       *
;    *003 07/29/02 Christi Ditmars      Add function declare becuase we     *
;                                       weren't always getting back the cv  *
;    *004 08/30/04 Ronda Zheng          Added ADD_BB_INACTIVE_EXCEPTION to  *
;                                       support clinical validation         *
;    *005 02/03/05 Ronda Zheng          Declared a variable and use nullterm*
;                                       before uar calls.                   *
;    *006 10/25/05 Jeff Wain		Added sub_bb_exception_id to fix    *
;					CCLQuery errors                     *
;    *007 10/27/06 Tom Brecht           Added sub_default_expiration_dt_tm  *
;                                       for flexible specimen exceptions    *
;    *008 01/14/14 Fitsum Abebe         Added Add_Invd_Prod_Ord_Exception() *
;~DE~************************************************************************
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************
 
declare ADD_BB_EXCEPTION
   (
     sub_person_id = f8,
     sub_order_id = f8,
     sub_exception_prsnl_id = f8,
     exception_dt_tm = dq8,
     prod_event_id = f8,
     exception_type_mean = c12,       /* from code_set 14072 */
     sub_override_reason_cd = f8,        /* from code_set 1614  */
     sub_event_type_cd = f8,             /* from code_set 1610  */
     sub_result_id = f8,
     sub_perform_result_id = f8,
     sub_from_abo_cd = f8,
     sub_from_rh_cd = f8,
     sub_to_abo_cd = f8,
     sub_to_rh_cd = f8,
     sub_default_expiration_dt_tm = dq8
   ) = null
 
subroutine ADD_BB_EXCEPTION
   (
     sub_person_id,
     sub_order_id,
     sub_exception_prsnl_id,
     exception_dt_tm,
     prod_event_id,
     exception_type_mean,       /* from code_set 14072 */
     sub_override_reason_cd,        /* from code_set 1614  */
     sub_event_type_cd,             /* from code_set 1610  */
     sub_result_id,
     sub_perform_result_id,
     sub_from_abo_cd,
     sub_from_rh_cd,
     sub_to_abo_cd,
     sub_to_rh_cd,
     sub_default_expiration_dt_tm
 
   )
         set EXCEPTION_STATUS = "I"
         set sub_exception_type_cd = 0.0
 
        declare sub_bb_exception_id   = f8  with protect, noconstant(0.0)
 
        declare except_type_mean = c12
        set except_type_mean = fillstring(12, " ")
        set except_type_mean = exception_type_mean
        set stat = uar_get_meaning_by_codeset(14072, nullterm(except_type_mean), 1, sub_exception_type_cd)    ;001
 
%I CCLSOURCE:BBT_GET_PATHNET_SEQ.INC
 
          set sub_bb_exception_id = new_pathnet_seq
          /* Insert row into bb_exception table */
          insert into bb_exception b set
              b.exception_id                 = sub_bb_exception_id,
              b.product_event_id             = prod_event_id,
              b.exception_type_cd            = sub_exception_type_cd,
              b.event_type_cd                = sub_event_type_cd,
              b.from_abo_cd                  = sub_from_abo_cd,
              b.from_rh_cd                   = sub_from_rh_cd,
              b.to_abo_cd                    = sub_to_abo_cd,
              b.to_rh_cd                     = sub_to_rh_cd,
              b.override_reason_cd           = sub_override_reason_cd,
              b.result_id                    = sub_result_id,
              b.perform_result_id            = sub_perform_result_id,
              b.updt_cnt                     = 0,
              b.updt_dt_tm                   = cnvtdatetime(curdate, curtime3),
              b.updt_id                      = ReqInfo->updt_id,
              b.updt_task                    = ReqInfo->updt_task,
              b.updt_applctx                 = ReqInfo->updt_applctx,
              b.active_ind                   = 1,
              b.active_status_cd             = ReqData->active_status_cd,
              b.active_status_dt_tm          = cnvtdatetime(curdate, curtime3),
              b.active_status_prsnl_id       = ReqInfo->updt_id,
              b.donor_contact_id             = 0.0,
              b.donor_contact_type_cd        = 0.0,
              b.order_id                     = sub_order_id,                                ;001
              b.exception_prsnl_id           = sub_exception_prsnl_id,                      ;001
              b.exception_dt_tm              = cnvtdatetime(exception_dt_tm),           ;001
              b.person_id                    = sub_person_id,                                ;001
              b.default_expire_dt_tm         = cnvtdatetime(sub_default_expiration_dt_tm)
          with counter
 
 		  set bb_exception_id = sub_bb_exception_id
 
          if (curqual = 0)
              set exception_status = "F"
          else
              set exception_status = "S"
          endif
 
end          ; end subroutine

declare Add_Invd_Prod_Ord_Exception (product_order_id = f8) = null
subroutine Add_Invd_Prod_Ord_Exception (product_order_id)
 
%I CCLSOURCE:BBT_GET_PATHNET_SEQ.INC
 
          declare sub_bb_exception_id   = f8  with protect, noconstant(0.0)
          set sub_bb_exception_id = bb_exception_id
 
          /* Insert row into bb_invld_prod_ord_exception table */
          insert into bb_invld_prod_ord_exceptn b set
              b.bb_invld_prod_ord_exceptn_id = new_pathnet_seq,
              b.exception_id                   = sub_bb_exception_id,
              b.product_order_id               = product_order_id,
              b.updt_cnt                       = 0,
              b.updt_dt_tm                     = cnvtdatetime(curdate, curtime3),
              b.updt_id                        = ReqInfo->updt_id,
              b.updt_task                      = ReqInfo->updt_task,
              b.updt_applctx                   = ReqInfo->updt_applctx
          with counter
 
          if (curqual = 0)
              set exception_status = "F"
          else
              set exception_status = "S"
          endif
 
end          ; end subroutine

 
subroutine ADD_REQS_EXCEPTION
   ( sub_special_testing_cd,
     sub_requirement_cd
   )
 
%I CCLSOURCE:BBT_GET_PATHNET_SEQ.INC
 
          declare sub_bb_exception_id   = f8  with protect, noconstant(0.0)
          set sub_bb_exception_id = bb_exception_id
 
          /* Insert row into bb_reqs_exception table */
          insert into bb_reqs_exception b set
              b.reqs_exception_id            = new_pathnet_seq,
              b.exception_id                 = sub_bb_exception_id,
              b.special_testing_cd           = sub_special_testing_cd,
              b.requirement_cd               = sub_requirement_cd,
              b.updt_cnt                     = 0,
              b.updt_dt_tm                   = cnvtdatetime(curdate, curtime3),
              b.updt_id                      = ReqInfo->updt_id,
              b.updt_task                    = ReqInfo->updt_task,
              b.updt_applctx                 = ReqInfo->updt_applctx,
              b.active_ind                   = 1,
              b.active_status_cd             = ReqData->active_status_cd,
              b.active_status_dt_tm          = cnvtdatetime(curdate, curtime3),
              b.active_status_prsnl_id       = ReqInfo->updt_id
          with counter
 
          if (curqual = 0)
              set exception_status = "F"
          else
              set exception_status = "S"
          endif
 
end          ; end subroutine
 
 
 
subroutine ADD_AUTODIR_REQS_EXCEPTION
   (sub_product_id
   )
 
%I CCLSOURCE:BBT_GET_PATHNET_SEQ.INC
 
          declare sub_bb_exception_id   = f8  with protect, noconstant(0.0)
          set sub_bb_exception_id = bb_exception_id
 
          /* Insert row into bb_reqs_exception table */
          insert into bb_autodir_exception b set
              b.bb_autodir_exc_id            = new_pathnet_seq,
              b.bb_exception_id              = sub_bb_exception_id,
              b.product_id                   = sub_product_id,
              b.updt_cnt                     = 0,
              b.updt_dt_tm                   = cnvtdatetime(curdate, curtime3),
              b.updt_id                      = ReqInfo->updt_id,
              b.updt_task                    = ReqInfo->updt_task,
              b.updt_applctx                 = ReqInfo->updt_applctx,
              b.active_ind                   = 1,
              b.active_status_cd             = ReqData->active_status_cd,
              b.active_status_dt_tm          = cnvtdatetime(curdate, curtime3),
              b.active_status_prsnl_id       = ReqInfo->updt_id
          with counter
 
          if (curqual = 0)
              set exception_status = "F"
          else
              set exception_status = "S"
          endif
 
end          ; end subroutine ADD_BB_EXCEPTION
 
 
;Add these new subroutines because ADD_BB_EXCEPTION is used by bbt_add_pat_dispense.prg, it can't be added
;another parameter.
declare ADD_BB_INACTIVE_EXCEPTION
   (
     sub_person_id = f8,
     sub_order_id = f8,
     sub_exception_prsnl_id = f8,
     exception_dt_tm = dq8,
     prod_event_id = f8,
     exception_type_mean = c12,       /* from code_set 14072 */
     sub_override_reason_cd = f8,        /* from code_set 1614  */
     sub_event_type_cd = f8,             /* from code_set 1610  */
     sub_result_id = f8,
     sub_perform_result_id = f8,
     sub_from_abo_cd = f8,
     sub_from_rh_cd = f8,
     sub_to_abo_cd = f8,
     sub_to_rh_cd = f8,
     sub_default_expiration_dt_tm = dq8
   ) = null
 
subroutine ADD_BB_INACTIVE_EXCEPTION
   (
     sub_person_id,
     sub_order_id,
     sub_exception_prsnl_id,
     exception_dt_tm,
     prod_event_id,
     exception_type_mean,       /* from code_set 14072 */
     sub_override_reason_cd,        /* from code_set 1614  */
     sub_event_type_cd,             /* from code_set 1610  */
     sub_result_id,
     sub_perform_result_id,
     sub_from_abo_cd,
     sub_from_rh_cd,
     sub_to_abo_cd,
     sub_to_rh_cd,
     sub_default_expiration_dt_tm
 
   )
 
        set EXCEPTION_STATUS = "I"
        declare sub_exception_type_cd = f8  with protect, noconstant(0.0)
        declare sub_bb_exception_id   = f8  with protect, noconstant(0.0)
 
        ;uar call failed in AIX if doesn't declare the variable or use nullterm.
        declare except_type_mean = c12
        set except_type_mean = fillstring(12, " ")
        set except_type_mean = exception_type_mean
 
        set stat = uar_get_meaning_by_codeset(14072, nullterm(except_type_mean), 1, sub_exception_type_cd)
 
        if (sub_exception_type_cd = 0.0)
          set exception_status = "FU"
 
        else
 
%I CCLSOURCE:BBT_GET_PATHNET_SEQ.INC
 
          set sub_bb_exception_id = new_pathnet_seq
          /* Insert row into bb_exception table */
          insert into bb_exception b set
              b.exception_id                 = sub_bb_exception_id,
              b.product_event_id             = prod_event_id,
              b.exception_type_cd            = sub_exception_type_cd,
              b.event_type_cd                = sub_event_type_cd,
              b.from_abo_cd                  = sub_from_abo_cd,
              b.from_rh_cd                   = sub_from_rh_cd,
              b.to_abo_cd                    = sub_to_abo_cd,
              b.to_rh_cd                     = sub_to_rh_cd,
              b.override_reason_cd           = sub_override_reason_cd,
              b.result_id                    = sub_result_id,
              b.perform_result_id            = sub_perform_result_id,
              b.updt_cnt                     = 0,
              b.updt_dt_tm                   = cnvtdatetime(curdate, curtime3),
              b.updt_id                      = ReqInfo->updt_id,
              b.updt_task                    = ReqInfo->updt_task,
              b.updt_applctx                 = ReqInfo->updt_applctx,
              b.active_ind                   = 0,
              b.active_status_cd             = ReqData->inactive_status_cd,
              b.active_status_dt_tm          = cnvtdatetime(curdate, curtime3),
              b.active_status_prsnl_id       = ReqInfo->updt_id,
              b.donor_contact_id             = 0.0,
              b.donor_contact_type_cd        = 0.0,
              b.order_id                     = sub_order_id,
              b.exception_prsnl_id           = sub_exception_prsnl_id,
              b.exception_dt_tm              = cnvtdatetime(exception_dt_tm),
              b.person_id                    = sub_person_id,
              b.default_expire_dt_tm         = cnvtdatetime(sub_default_expiration_dt_tm)
          with counter
 
          set bb_exception_id = sub_bb_exception_id
 
          if (curqual = 0)
              set exception_status = "F"
          else
              set exception_status = "S"
          endif
 
        endif
 
end          ; end subroutine
 
 
 
declare ADD_INACTIVE_REQS_EXCEPTION
   ( sub_special_testing_cd,
     sub_requirement_cd
   ) = null
 
subroutine ADD_INACTIVE_REQS_EXCEPTION
   ( sub_special_testing_cd,
     sub_requirement_cd
   )
 
%I CCLSOURCE:BBT_GET_PATHNET_SEQ.INC
 
          declare sub_bb_exception_id   = f8  with protect, noconstant(0.0)
          set sub_bb_exception_id = bb_exception_id
 
          /* Insert row into bb_reqs_exception table */
          insert into bb_reqs_exception b set
              b.reqs_exception_id            = new_pathnet_seq,
              b.exception_id                 = sub_bb_exception_id,
              b.special_testing_cd           = sub_special_testing_cd,
              b.requirement_cd               = sub_requirement_cd,
              b.updt_cnt                     = 0,
              b.updt_dt_tm                   = cnvtdatetime(curdate, curtime3),
              b.updt_id                      = ReqInfo->updt_id,
              b.updt_task                    = ReqInfo->updt_task,
              b.updt_applctx                 = ReqInfo->updt_applctx,
              b.active_ind                   = 0,
              b.active_status_cd             = ReqData->inactive_status_cd,
              b.active_status_dt_tm          = cnvtdatetime(curdate, curtime3),
              b.active_status_prsnl_id       = ReqInfo->updt_id
          with counter
 
          if (curqual = 0)
              set exception_status = "F"
          else
              set exception_status = "S"
          endif
 
end          ; end subroutine
 
 
;Activate the exceptions after the results are approved.
declare ACTIVATE_BB_EXCEPTION
   (
     sub_exception_id = f8,
     updt_cnt     = i4
   ) = null
 
subroutine ACTIVATE_BB_EXCEPTION
   (
     sub_exception_id,
     updt_cnt
 
   )
 
        set EXCEPTION_STATUS = "I"
 
        select into "nl:"
            b.exception_id
        from
            bb_exception b
        where   b.exception_id = sub_exception_id
        and     b.active_ind = 0
        and     b.updt_cnt = updt_cnt
 
        with    nocounter, forupdate(b)
        if (curqual = 0)
            set exception_status = "FL"
        endif
 
        if (curqual = 1)
          update into bb_exception b
                set b.active_ind               = 1,
                    b.active_status_cd         = reqdata->active_status_cd,
                    b.updt_cnt                 = b.updt_cnt + 1,
                    b.updt_dt_tm               = cnvtdatetime(curdate, curtime3),
                    b.updt_id                  = ReqInfo->updt_id,
                    b.updt_task                = ReqInfo->updt_task,
                    b.updt_applctx             = ReqInfo->updt_applctx
            where   b.exception_id             = sub_exception_id
 
            with    nocounter
 
          if (curqual = 0)
              set EXCEPTION_STATUS = "F"
          else
              set EXCEPTION_STATUS = "S"
          endif
 
        endif
 
end          ; end subroutine
 

;Generated by GNU enscript 1.6.4.
