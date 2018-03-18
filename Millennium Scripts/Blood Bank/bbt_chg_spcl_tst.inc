 ;;Solution_Test/script/PathNet -- BB Transfusion/RESULTENTRYFORBLOODBANK/BBT_CHG_SPCL_TST.INC Turn on black mode

/*
 *  PURPOSE:  inactivate row in special_testing table
 *
 *  PRELIMINARIES:
 *   1)  Include the following code in calling program:
 *           %i cclsource:bbt_chg_spcl_tst.inc
 *           END        ; end subroutine CHG_SPECIAL_TESTING
 *   2)  Declare the followoing variables in the calling program, prior to calling the subroutine:
 *             set gsub_inactive_spcl_tst_status = "  " (gsub = global subroutine variable)
 *   3)  Call subroutine using CALL FORMAT below
 *   4)  After control returns from subroutine, evaluate gsub_inactive_spcl_tst_status as follows:
 *         "FL" = lock for update failed
 *         "FU" = update to inactive failed
 *         "OK" = update successful
 *
 *  CALL FORMAT (this may be copied into calling program):  */
 ;       call CHG_SPECIAL_TESTING
 ;          (                             ** These <variables> set in calling program **
 ;           /* product_id             */ <product_id>,
 ;           /* special_testing_cd     */ <special_testing_cd>,
 ;           /* active_ind             */ <active_ind>,
 ;           /* active_status_cd       */ <reqdata->active_status_cd>,
 ;           /* updt_cnt               */ <updt_cnt>,
 ;           /* lock_forupdate_ind     */ <1>, = "Yes" or <0>, = "No"
 ;          )
 
    subroutine CHG_SPECIAL_TESTING
        (
         sub_product_id,
         sub_special_testing_cd,
         sub_active_ind,
         sub_active_status_cd,
         sub_updt_cnt,
         sub_lock_forupdate_ind
       )
 
    /* Initialize gsub_special_testing_status */
    set gsub_inactive_spcl_tst_status = "  "
    set orig_special_testing_id = 0
 
    if (sub_lock_forupdate_ind = 1)
        select into "nl:"
            s.special_testing_id
        from
            special_testing s
        where   s.product_id = sub_product_id
        and     s.special_testing_cd = sub_special_testing_cd
        and     s.active_ind = 1
        and     s.updt_cnt = sub_updt_cnt
        detail
          orig_special_testing_id = s.special_testing_id
        with    nocounter, forupdate(s)
        if (curqual = 0)
            set gsub_inactive_spcl_tst_status = "FL"
        endif
    endif
 
    if ((sub_lock_forupdate_ind = 0)
    or (sub_lock_forupdate_ind = 1 and curqual > 0))
            update into special_testing s
                set s.active_ind               = sub_active_ind,
                    s.active_status_cd         = sub_active_status_cd,
                    s.updt_cnt                 = s.updt_cnt + 1,
                    s.updt_dt_tm               = cnvtdatetime(curdate, curtime3),
                    s.updt_id                  = ReqInfo->updt_id,
                    s.updt_task                = ReqInfo->updt_task,
                    s.updt_applctx             = ReqInfo->updt_applctx
            where   s.special_testing_id       = orig_special_testing_id
                    and s.updt_cnt             = sub_updt_cnt
            with    nocounter
 
        if (curqual = 0)
            set gsub_inactive_spcl_tst_status = "FU"
        else
            set gsub_inactive_spcl_tst_status = "OK"
        endif
    endif
/* END for subroutine is to be included in calling program code */
 
 
/*This subroutine is used when a special_testing result goes to review queue. Since the result status changes to
  Corr-InReview, the special_testing_verify_yn is set to "N", no row is written to special_testing and
  special_testing_result tables. The result_code_set_cd in perform_result table thus is not match the
  special_testing_cd in special_testing table. Since there is only one active row per result_id in
  special_testing_result table, the row can be updated without matching special_testing_cd.
*/
    declare CHG_SPECIAL_TESTING_2
        (
         sub_special_testing_id = f8,
         sub_active_ind         = i2,
         sub_active_status_cd   = f8
       ) = null
 
    subroutine CHG_SPECIAL_TESTING_2
        (
         sub_special_testing_id,
         sub_active_ind,
         sub_active_status_cd
       )
 
    /* Initialize gsub_special_testing_status */
    set gsub_inactive_spcl_tst_status = "  "
 
    select into "nl:"
        s.special_testing_id
    from
        special_testing s
    where   s.special_testing_id  = gdSpecial_testing_id
 
    with    nocounter, forupdate(s)
 
    if (curqual = 0)
        set gsub_inactive_spcl_tst_status = "FL"
    endif
 
 
    if (curqual > 0)
        update into special_testing s
            set s.active_ind               = sub_active_ind,
                s.active_status_cd         = sub_active_status_cd,
                s.updt_cnt                 = s.updt_cnt + 1,
                s.updt_dt_tm               = cnvtdatetime(curdate, curtime3),
                s.updt_id                  = ReqInfo->updt_id,
                s.updt_task                = ReqInfo->updt_task,
                s.updt_applctx             = ReqInfo->updt_applctx
        where   s.special_testing_id       = gdSpecial_testing_id
        with    nocounter
 
        if (curqual = 0)
            set gsub_inactive_spcl_tst_status = "FU"
        else
            set gsub_inactive_spcl_tst_status = "OK"
        endif
    endif
 
end

;Generated by GNU enscript 1.6.4.
