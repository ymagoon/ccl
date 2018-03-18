 ;;Solution_Test/script/PathNet -- BB Transfusion/RESULTENTRYFORBLOODBANK/BBT_CHG_ABORH_RSL.INC Turn on black mode

/*
 *  PURPOSE:  inactivate row in person_aborh_result
 *
 *  PRELIMINARIES:
 *   1)  Include the following code in calling program:
 *           %i cclsource:bbt_chg_aborh_rsl.inc
 *           END        ; end subroutine CHG_ABORH_RESULT
 *   2)  Declare the followoing variables in the calling program, prior to calling the subroutine:
 *             set gsub_inactive_aborh_rsl_status = "  " (gsub = global subroutine variable)
 *   3)  Call subroutine using CALL FORMAT below
 *   4)  After control returns from subroutine, evaluate gsub_inactive_aborh_rsl_status as follows:
 *         "FL" = lock for update failed
 *         "FU" = update to inactive failed
 *         "OK" = add successful
 *
 *  CALL FORMAT (this may be copied into calling program): */
 ;       call CHG_ABORH_RESULT
 ;          (                             ** These <variables> set in calling program **
 ;           /* person_id               */ <person_id>,
 ;           /* encntr_id               */ <encntr_id>,
 ;           /* result_id               */ <result_id>,
 ;           /* result_cd                */ <result_cd>,
 ;           /* active_ind              */ <active_ind>,
 ;           /* active_status_cd        */ <reqdata->active_status_cd>,
 ;           /* updt_cnt               */ <updt_cnt>,
 ;           /* lock_forupdate_ind     */ <1>, = "Yes" or <0>, = "No",
 ;          )
 
    subroutine CHG_ABORH_RESULT
        (
         sub_person_id,
         sub_encntr_id,
         sub_result_id,
         sub_result_cd,
         sub_active_ind,
         sub_active_status_cd,
         sub_updt_cnt,
         sub_lock_forupdate_ind
        )
 
    declare sub_person_aborh_rs_id = F8 with protect, noconstant(0.0)
    /* Initialize gsub_aborh_result_status */
    set gsub_inactive_aborh_rsl_status = "  "
    set sub_person_aborh_rs_id = 0
 
    if (sub_lock_forupdate_ind = 1)
        select into "nl:"
            pa.person_aborh_rs_id
        from
            person_aborh_result pa
        where   pa.result_id = sub_result_id
        and     pa.result_cd = sub_result_cd
        and     pa.person_id = sub_person_id
        and     pa.encntr_id = sub_encntr_id
        and     pa.active_ind = 1
        and     pa.updt_cnt = sub_updt_cnt
        detail
           sub_person_aborh_rs_id = pa.person_aborh_rs_id
        with    nocounter, forupdate(pa)
        if (curqual = 0)
            set gsub_inactive_aborh_rsl_status = "FL"
        endif
    endif
 
    if ((sub_lock_forupdate_ind = 0)
    or (sub_lock_forupdate_ind = 1 and curqual > 0))
            update into person_aborh_result pa
                set pa.active_ind               = sub_active_ind,
                    pa.active_status_cd         = sub_active_status_cd,
                    pa.updt_cnt                 = pa.updt_cnt + 1,
                    pa.updt_dt_tm               = cnvtdatetime(curdate, curtime3),
                    pa.updt_id                  = ReqInfo->updt_id,
                    pa.updt_task                = ReqInfo->updt_task,
                    pa.updt_applctx             = ReqInfo->updt_applctx
            where   pa.person_aborh_rs_id       = sub_person_aborh_rs_id
                    and pa.updt_cnt             = sub_updt_cnt
            with    nocounter
 
        if (curqual = 0)
            set gsub_inactive_aborh_rsl_status = "FU"
        else
            set gsub_inactive_aborh_rsl_status = "OK"
        endif
    endif
/* END for subroutine is to be included in calling program code */
 
 
 
 
/*This subroutine is used when a person aborh result goes to review queue. Since the result status changes to
  Corr-InReview, the aborh_verify_yn is set to "N", no row is written to person_aborh and person_aborh_result
  tables. The result_code_set_cd in perform_result table thus is not match the result_cd in person_aborh_result
  table. Since there is only one active row per result_id in person_aborh_result table, the row can be updated
  without matching result_cd.
 
*/
    declare CHG_ABORH_RESULT_2
     (
         sub_person_id = f8,
         sub_encntr_id = f8,
         sub_result_id = f8,
         sub_active_ind = i2,
         sub_active_status_cd = f8
     ) = null
 
 
    subroutine CHG_ABORH_RESULT_2
        (
         sub_person_id,
         sub_encntr_id,
         sub_result_id,
         sub_active_ind,
         sub_active_status_cd
        )
 
    /* Initialize gsub_aborh_result_status */
    set gsub_inactive_aborh_rsl_status = "  "
    declare dPerson_aborh_rs_id = f8   with protect, noconstant(0.0)
 
    select into "nl:"
        pa.person_aborh_rs_id
    from
        person_aborh_result pa
    where   pa.result_id  = sub_result_id
    and     pa.person_id  = sub_person_id
    and     pa.encntr_id  = sub_encntr_id
    and     pa.active_ind = 1
 
    detail
       dPerson_aborh_rs_id = pa.person_aborh_rs_id
    with    nocounter, forupdate(pa)
 
    if (curqual = 0)
        set gsub_inactive_aborh_rsl_status = "FL"
    endif
 
 
    if (curqual > 0)
        update into person_aborh_result pa
            set pa.active_ind               = sub_active_ind,
                pa.active_status_cd         = sub_active_status_cd,
                pa.updt_cnt                 = pa.updt_cnt + 1,
                pa.updt_dt_tm               = cnvtdatetime(curdate, curtime3),
                pa.updt_id                  = ReqInfo->updt_id,
                pa.updt_task                = ReqInfo->updt_task,
                pa.updt_applctx             = ReqInfo->updt_applctx
        where   pa.person_aborh_rs_id       = dPerson_aborh_rs_id
 
        with    nocounter
 
        if (curqual = 0)
            set gsub_inactive_aborh_rsl_status = "FU"
        else
            set gsub_inactive_aborh_rsl_status = "OK"
        endif
    endif
 end
 

;Generated by GNU enscript 1.6.4.
