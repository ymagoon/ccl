 ;;Solution_Test/script/PathNet -- BB Transfusion/RESULTENTRYFORBLOODBANK/BBT_CHG_PRS_ANTIBODY.INC Turn on black mode

/*
 *  PURPOSE:  inactivate row in person_antibody table
 *
 *  PRELIMINARIES:
 *   1)  Include the following code in calling program:
 *           %i cclsource:bbt_chg_prs_antibody.inc
 *           END        ; end subroutine CHG_PERSON_ANTIBODY
 *   2)  Declare the followoing variables in the calling program, prior to calling the subroutine:
 *             set gsub_inactive_prs_antibody_status = "  " (gsub = global subroutine variable)
 *   3)  Call subroutine using CALL FORMAT below
 *   4)  After control returns from subroutine, evaluate gsub_person_antibody_status as follows:
 *         "FL" =  lock for update failed
 *         "FU" =  update to inactive failed
 *         "OK" = add successful
 *
 *  CALL FORMAT (this may be copied into calling program): */
 ;       call CHG_PERSON_ANTIBODY
 ;          (                             ** These <variables> set in calling program **
 ;           /* person_id              */ <person_id>,
 ;           /* encntr_id              */ <encntr_id>,
 ;           /* antibody_cd            */ <antibody_cd>,
 ;           /* result_id              */ <result_id>,
 ;           /* bb_result_id           */ <bb_result_id>,
 ;           /* active_ind             */ <active_ind>,
 ;           /* active_status_cd       */ <reqdata->active_status_cd>,
 ;           /* updt_cnt               */ <updt_cnt>,
 ;           /* lock_forupdate_ind     */ <1>, = "Yes" or <0>, = "No"
 ;          )
 
    subroutine CHG_PERSON_ANTIBODY
        (
         sub_person_id,
         sub_encntr_id,
         sub_antibody_cd,
         sub_result_id,
         sub_bb_result_id,
         sub_active_ind,
         sub_active_status_cd,
         sub_updt_cnt,
         sub_lock_forupdate_ind
        )
 
    /* Initialize gsub_person_antibody_status */
    set gsub_inactive_prs_antibody_status = "  "
 
    if (sub_lock_forupdate_ind = 1)
        select into "nl:"
            pa.person_id,
            pa.antibody_cd,
            pa.encntr_id,
            pa.result_id,
            pa.bb_result_id
        from
            person_antibody pa
        where   pa.person_id     = sub_person_id
        and     pa.antibody_cd = sub_antibody_cd
        and     pa.active_ind = 1
        and     pa.encntr_id = sub_encntr_id
        and     pa.result_id = sub_result_id
        and     pa.bb_result_id = sub_bb_result_id
        and     pa.updt_cnt       = sub_updt_cnt
        with    nocounter, forupdate(pa)
        if (curqual = 0)
            set gsub_inactive_prs_antibody_status = "FL"
        endif
    endif
 
    if ((sub_lock_forupdate_ind = 0)
    or (sub_lock_forupdate_ind = 1 and curqual > 0))
            update into person_antibody pa
                set pa.active_ind               = sub_active_ind,
                    pa.active_status_cd         = sub_active_status_cd,
                    pa.updt_cnt                 = pa.updt_cnt + 1,
                    pa.updt_dt_tm               = cnvtdatetime(curdate, curtime3),
                    pa.updt_id                  = ReqInfo->updt_id,
                    pa.updt_task                = ReqInfo->updt_task,
                    pa.updt_applctx             = ReqInfo->updt_applctx
            where   pa.person_id                = sub_person_id
                    and pa.antibody_cd          = sub_antibody_cd
                    and pa.active_ind           = 1
                    and pa.encntr_id            = sub_encntr_id
                    and pa.result_id            = sub_result_id
                    and pa.bb_result_id         = sub_bb_result_id
                    and pa.updt_cnt             = sub_updt_cnt
            with    nocounter
 
        if (curqual = 0)
            set gsub_inactive_prs_antibody_status = "FU"
        else
            set gsub_inactive_prs_antibody_status = "OK"
        endif
    endif
/* END for subroutine is to be included in calling program code */
 
 
 
/*This subroutine is used when a person antibody result goes to review queue. Since the result status changes to
  Corr-InReview, the antibody_verify_yn is set to "N", no row is written to person_antibody table.
  The result_code_set_cd in perform_result table thus is not match the antibody_cd in person_antibody table.
  Since there is only one active row per result_id and bb_result_id in person_antibody table, the row can be
  updated without matching antibody_cd.
*/
 
    declare CHG_PERSON_ANTIBODY_2
     (
         sub_person_id        = f8,
         sub_encntr_id        = f8,
         sub_result_id        = f8,
         sub_bb_result_id     = f8,
         sub_active_ind       = i2,
         sub_active_status_cd = f8
     ) = null
 
    subroutine CHG_PERSON_ANTIBODY_2
        (
         sub_person_id,
         sub_encntr_id,
         sub_result_id,
         sub_bb_result_id,
         sub_active_ind,
         sub_active_status_cd
        )
 
    /* Initialize gsub_person_antibody_status */
    set gsub_inactive_prs_antibody_status = "  "
    declare dPerson_antibody_id = f8   with protect, noconstant(0.0)
 
    select into "nl:"
        pa.result_id,
        pa.bb_result_id
    from
        person_antibody pa
    where   pa.person_id    = sub_person_id
    and     pa.active_ind   = 1
    and     pa.encntr_id    = sub_encntr_id
    and     pa.result_id    = sub_result_id
    and     pa.bb_result_id = sub_bb_result_id
 
    detail
      dPerson_antibody_id = pa.person_antibody_id
    with    nocounter, forupdate(pa)
 
    if (curqual = 0)
        set gsub_inactive_prs_antibody_status = "FL"
    endif
 
 
    if (curqual > 0)
        update into person_antibody pa
            set pa.active_ind               = sub_active_ind,
                pa.active_status_cd         = sub_active_status_cd,
                pa.updt_cnt                 = pa.updt_cnt + 1,
                pa.updt_dt_tm               = cnvtdatetime(curdate, curtime3),
                pa.updt_id                  = ReqInfo->updt_id,
                pa.updt_task                = ReqInfo->updt_task,
                pa.updt_applctx             = ReqInfo->updt_applctx
        where   pa.person_antibody_id       = dPerson_antibody_id
        with    nocounter
 
        if (curqual = 0)
            set gsub_inactive_prs_antibody_status = "FU"
        else
            set gsub_inactive_prs_antibody_status = "OK"
        endif
    endif
end

;Generated by GNU enscript 1.6.4.
