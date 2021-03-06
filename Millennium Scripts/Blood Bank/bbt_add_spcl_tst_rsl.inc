 ;;Solution_Test/script/PathNet -- BB Transfusion/RESULTENTRYFORBLOODBANK/BBT_ADD_SPCL_TST_RSL.INC Turn on black mode

/*
 *  PURPOSE:  add row to special_testing_result table
 *
 *  PRELIMINARIES:
 *   1)  Include the following code in calling program:
 *           %i cclsource:bbt_add_spc_tst_rsl.inc
 *           END        ; end subroutine ADD_SPECIAL_TESTING_RESULT
 *   2)  Declare the followoing variables in the calling program, prior to calling the subroutine:
 *             set gsub_spc_tst_result_status = "  " (gsub = global subroutine variable)
 *   3)  Call subroutine using CALL FORMAT below
 *   4)  After control returns from subroutine, evaluate gsub_spc_tst_result_status as follows:
 *         "FA" = add special_testing_result failed                                
 *         "OK" = add successful                                           
 *
 *  CALL FORMAT (this may be copied into calling program): */
 ;       call ADD_SPECIAL_TESTING_RESULT
 ;          (                             ** These <variables> set in calling program **
 ;           /* special_testing_id     */ <special_testing_id>,
 ;           /* product_id             */ <product_id>,
 ;           /* result_id              */ <result_id>,
 ;           /* bb_result_id           */ <bb_result_id>,
 ;           /* active_ind             */ <active_ind>,
 ;           /* active_status_cd       */ <reqdata->active_status_cd>,
 ;           /* active_status_dt_tm    */ cnvtdatetime(<active_status_dt_tm>),
 ;           /* active_status_prsnl_id */ <active_status_prsnl_id>
 ;          )

subroutine ADD_SPECIAL_TESTING_RESULT
   (
    sub_special_testing_id,
    sub_product_id,
    sub_result_id,
    sub_bb_result_id,
    sub_active_ind,
    sub_active_status_cd,
    sub_active_status_dt_tm,
    sub_active_status_prsnl_id
   )

/* Initialize gsub_spc_tst_result_status */
set gsub_spc_tst_result_status = "  "

insert into special_testing_result str set
    str.special_testing_id       = sub_special_testing_id,
    str.product_id               = sub_product_id,
    str.result_id                = sub_result_id,
    str.bb_result_id             = sub_bb_result_id, 
    str.active_ind               = sub_active_ind,
    str.active_status_cd         = sub_active_status_cd,
    str.active_status_dt_tm      = cnvtdatetime(sub_active_status_dt_tm),
    str.active_status_prsnl_id   = sub_active_status_prsnl_id,
    str.updt_cnt                 = 0,
    str.updt_dt_tm               = cnvtdatetime(curdate, curtime3),
    str.updt_id                  = ReqInfo->updt_id,
    str.updt_task                = ReqInfo->updt_task,
    str.updt_applctx             = ReqInfo->updt_applctx
with    nocounter

if (curqual = 0)
    set gsub_spc_tst_result_status = "FA"
else
    set gsub_spc_tst_result_status = "OK"
endif      

/* END for subroutine is to be included in calling program code */

;Generated by GNU enscript 1.6.4.
