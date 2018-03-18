 ;;Solution_Test/script/PathNet -- BB Transfusion/DM_UNCOMBINE_BBT/bbt_archive_cmb_ucmb_blood_bank_comment.inc Turn on black mode

/*
 * bbt_archive_cmb_ucmb_blood_bank_comment.inc:  archives combine and un combine blood_bank_comment and long_text rows
 *
 * USE:
 *  1.  Initialize the following GLOBAL variables in the calling program:
 *        set gsub_status = " "
 *        set gsub_process = fillstring(200, " ")
 *        set gsub_message = fillstring(200, " ")
 *  3.  Include in calling program as follows
 *        %i cclsource:bbt_archive_blood_bank_comment.inc
 
 *  5.  Call 'ARCIVE_BB_COMMENT' as follows:
 *           call ARCHIVE_BB_COMMENT
 *           (
 *              bb_comment_id
 *             person_id
 *             bb_comment_updt_cnt
 *             long_text_id
 *             long_text_updt_cnt
 *             active_ind
 *             active_status_cd
 *           )
 */
 
subroutine ARCHIVE_BB_COMMENT
    (
     sub_bbc_bb_comment_id,
     sub_bbc_person_id,
     sub_bbc_bb_comment_updt_cnt,
     sub_bbc_long_text_id,
     sub_bbc_long_text_updt_cnt,
     sub_bbc_active_ind,
     sub_bbc_active_status_cd
    )
 
    /*
     * Inactivate current active blood_bank_comment row
     */
 
    update into blood_bank_comment bbc
        set bbc.active_ind                 = sub_bbc_active_ind
            , bbc.active_status_cd         = sub_bbc_active_status_cd
            , bbc.active_status_dt_tm      = cnvtdatetime(curdate, curtime3)
            , bbc.active_status_prsnl_id   = reqinfo->updt_id
            , bbc.updt_cnt                 = bbc.updt_cnt + 1
            , bbc.updt_dt_tm               = cnvtdatetime(curdate, curtime3)
            , bbc.updt_id                  = reqinfo->updt_id
            , bbc.updt_task                = reqinfo->updt_task
            , bbc.updt_applctx             = reqinfo->updt_applctx
 
    where   bbc.bb_comment_id           = sub_bbc_bb_comment_id
              and bbc.person_id         = sub_bbc_person_id
              and bbc.updt_cnt          = sub_bbc_bb_comment_updt_cnt
 
    with    nocounter
 
    if (curqual = 0)
        set gsub_status = "F"
        set gsub_process = "inactivate/archive blood_bank_comment"
        set gsub_message = "current active blood_bank_comment row could not be archived--blood_bank_comment not added"
    else
 
        /* Inactivate long_text row */
        call CHG_LONG_TEXT
            (
             /* long_text_id       */ sub_bbc_long_text_id
             /* long_text_updt_cnt */ , sub_bbc_long_text_updt_cnt
             /* long_text          */ , " "
             /* active_ind         */ , sub_bbc_active_ind
             /* active_status_cd   */ , sub_bbc_active_status_cd
             /* update_text_ind    */ , 0                             ; 1=update text, 0 = do NOT update text
            )
 
        if (curqual = 0)
            set gsub_status = "F"
            set gsub_process = "inactivate/archive long_text"
            set gsub_message = "current active long_text row could not be archived--blood_bank_comment not added"
        endif           ; endif curqual = 0 long_text
    endif           ; endif curqual = 0 blood_bank_comment
END             ; END subroutine ARCHIVE_BB_COMMENT
 
subroutine CHG_LONG_TEXT
    (
     sub_lt_long_text_id,
     sub_lt_long_text_updt_cnt,
     sub_lt_long_text,
     sub_lt_active_ind,
     sub_lt_active_status_cd,
     sub_lt_update_text_ind
    )
 
 
    if (sub_lt_update_text_ind = 1)
        /* Update long_text in long_text row */
        update into long_text lt
            set lt.long_text                = sub_lt_long_text
                , lt.updt_cnt                 = lt.updt_cnt + 1
                , lt.updt_dt_tm               = cnvtdatetime(curdate, curtime3)
                , lt.updt_id                  = reqinfo->updt_id
                , lt.updt_task                = reqinfo->updt_task
                , lt.updt_applctx             = reqinfo->updt_applctx
                , lt.active_ind               = sub_lt_active_ind
                , lt.active_status_cd         = sub_lt_active_status_cd
                , lt.active_status_dt_tm      = cnvtdatetime(curdate, curtime3)
                , lt.active_status_prsnl_id   = reqinfo->updt_id
 
        where   lt.long_text_id             = sub_lt_long_text_id
                  and lt.updt_cnt           = sub_lt_long_text_updt_cnt
 
        with    nocounter
 
    else
        /* do NOT update text in long_text row */
        update into long_text lt
            set lt.updt_cnt                 = lt.updt_cnt + 1
                , lt.updt_dt_tm               = cnvtdatetime(curdate, curtime3)
                , lt.updt_id                  = reqinfo->updt_id
                , lt.updt_task                = reqinfo->updt_task
                , lt.updt_applctx             = reqinfo->updt_applctx
                , lt.active_ind               = sub_lt_active_ind
                , lt.active_status_cd         = sub_lt_active_status_cd
                , lt.active_status_dt_tm      = cnvtdatetime(curdate, curtime3)
                , lt.active_status_prsnl_id   = reqinfo->updt_id
 
        where   lt.long_text_id             = sub_lt_long_text_id
                  and lt.updt_cnt           = sub_lt_long_text_updt_cnt
 
        with    nocounter
    endif
END             ; END subroutine CHG_LONG_TEXT

;Generated by GNU enscript 1.6.4.
