 ;;Solution_Test/script/PathNet -- BB Transfusion/Bbt_Product_Event_Inc/BBT_CHG_PRODUCT_EVENT.INC Turn on black mode

/*
 *  PURPOSE:  change row in product_event table
 *  
 *  PRELIMINARIES:
 *   1)  Include the following code in calling program:
 *           %i cclsource:bbt_chg_product_event.inc
 *           END        ; end subroutine CHG_PRODUCT_EVENT
 *   2)  Declare 'gsub_product_event_status = "  "' prior to calling subroutine (gsub = global subroutine variable)
 *   3)  Call subroutine using CALL FORMAT below
 *   4)  After control returns from subroutine, evaluate gsub_product_event_status as follows:
 *         "FL" = lock forupdate failed
 *         "FU" = update failed (lock forupdate, if requested, successful)
 *         "OK" = update successful (lock forupdate, if requested, successful)
 *
 *  CALL FORMAT (this may be copied into calling program): */
 ;       call CHG_PRODUCT_EVENT        /* These <variables> set in calling program */
 ;          (
 ;           /* product_event_id       */ <product_event_id>,
 ;           /* event_dt_tm            */ cnvtdatetime(<event_dt_tm>),
 ;           /* event_prsnl_id         */ <event_prsnl_id>,
 ;           /* event_status_flag      */ <event_status_flag>,
 ;           /* active_ind             */ <active_ind>,
 ;           /* active_status_cd       */ <reqdata->active_status_cd>,
 ;           /* active_status_dt_tm    */ cnvtdatetime(<active_status_dt_tm>),
 ;           /* active_status_prsnl_id */ <active_status_prsnl_id>,
 ;           /* updt_cnt               */ <pe_updt_cnt>,
 ;           /* lock_forupdate_ind     */ <1>, = "Yes" or <0>, = "No"
 ;           /* updt_dt_tm_prsnl_ind   */ <1>, = "Yes" or <0>, = "No"
 ;          )

    subroutine CHG_PRODUCT_EVENT
        (
         sub_product_event_id,
         sub_event_dt_tm,
         sub_event_prsnl_id,
         sub_event_status_flag,
         sub_active_ind,
         sub_active_status_cd,
         sub_active_status_dt_tm,
         sub_active_status_prsnl_id,
         sub_updt_cnt,
         sub_lock_forupdate_ind,
         sub_updt_dt_tm_prsnl_ind
        )

    /* Initialize gsub_product_event_status */
    set gsub_product_event_status = "  "

    if (sub_lock_forupdate_ind = 1)
        select into "nl:"
            pe.product_event_id
        from
            product_event pe
        where   pe.product_event_id     = sub_product_event_id
                  and pe.updt_cnt       = sub_updt_cnt
        with    nocounter
        if (curqual = 0)
            set gsub_product_event_status = "FL"
        endif
    endif

    if ((sub_lock_forupdate_ind = 0)
    or (sub_lock_forupdate_ind = 1 and curqual > 0))
        if (sub_updt_dt_tm_prsnl_ind = 1)
            /* update event_dt_tm/prsnl_id */
            update into product_event pe
                set pe.event_dt_tm              = cnvtdatetime(sub_event_dt_tm),
                    pe.event_prsnl_id           = sub_event_prsnl_id,
                    pe.event_status_flag        = sub_event_status_flag,
                    pe.active_ind               = sub_active_ind,
                    pe.active_status_cd         = sub_active_status_cd,
                    pe.active_status_dt_tm      = cnvtdatetime(sub_active_status_dt_tm),
                    pe.active_status_prsnl_id   = sub_active_status_prsnl_id,
                    pe.updt_cnt                 = pe.updt_cnt + 1,
                    pe.updt_dt_tm               = cnvtdatetime(curdate, curtime3),
                    pe.updt_id                  = ReqInfo->updt_id,
                    pe.updt_task                = ReqInfo->updt_task,
                    pe.updt_applctx             = ReqInfo->updt_applctx
            where   pe.product_event_id         = sub_product_event_id
                      and pe.updt_cnt           = sub_updt_cnt
            with    nocounter
        else
            /* Do NOT update prsnl_dt_tm/prsnl_id */
            update into product_event pe
                set pe.event_status_flag        = sub_event_status_flag,
                    pe.active_ind               = sub_active_ind,
                    pe.active_status_cd         = sub_active_status_cd,
                    pe.active_status_dt_tm      = cnvtdatetime(sub_active_status_dt_tm),
                    pe.active_status_prsnl_id   = sub_active_status_prsnl_id,
                    pe.updt_cnt                 = pe.updt_cnt + 1,
                    pe.updt_dt_tm               = cnvtdatetime(curdate, curtime3),
                    pe.updt_id                  = ReqInfo->updt_id,
                    pe.updt_task                = ReqInfo->updt_task,
                    pe.updt_applctx             = ReqInfo->updt_applctx
            where   pe.product_event_id         = sub_product_event_id
                      and pe.updt_cnt           = sub_updt_cnt
            with    nocounter
        endif

        if (curqual = 0)
            set gsub_product_event_status = "FU"
        else
            set gsub_product_event_status = "OK"
        endif
    endif
/* END for subroutine is to be included in calling program code */

;Generated by GNU enscript 1.6.4.
