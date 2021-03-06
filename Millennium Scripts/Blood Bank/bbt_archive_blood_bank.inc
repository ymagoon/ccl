 ;;Solution_Test/script/PathNet -- BB Transfusion/BBT_PERSONNOTES/BBT_ARCHIVE_BLOOD_BANK_COMMENT.INC Turn on black mode

/* 
 * bbt_archive_blood_bank_comment.inc:  archives (inactivates) blood_bank_comment and long_text rows
 *
 * USE:
 *  1.  Initialize the following GLOBAL variables in the calling program:
 *        set gsub_status = " "
 *        set gsub_process = fillstring(200, " ")
 *        set gsub_message = fillstring(200, " ")
 *  3.  Include in calling program as follows (NOTE:  the 'END' for the subroutine is to be coded in the calling program
 *      to allow for additional functionality for the subroutine by the calling program):
 *        %i cclsource:bbt_archive_blood_bank_comment.inc
 *        END           ; end subroutine ARCHIVE_BB_COMMENT
 *  4.  Include 'bbt_chg_long_text.inc' in calling program as well, as follows (NOTE: the 'END' for the subroutine is to
 *      be coded in the calling program here as well):
 *        %i cclsource:bbt_chg_long_text.inc
 *        END           ; end subroutine CHG_LONG_TEXT
 *  5.  Call 'ARCIVE_BB_COMMENT' as follows: */
 ;          call ARCHIVE_BB_COMMENT
 ;              (
 ;               /* bb_comment_id       */ <bb_comment_id>, 
 ;               /* person_id           */ <person_id,        
 ;               /* bb_comment_updt_cnt */ <bb_comment_updt_cnt>,
 ;               /* lont_text_id        */ <long_text_id>,
 ;               /* long_text_updt_cnt  */ <long_text_updt_cnt>
 ;              )
/*  6.  Evaluate gsub_process to determine success/failure ("S"/"F").  gsub_process and gsub_message will have information
 *      regarding the success or failure.
 */

subroutine ARCHIVE_BB_COMMENT
    (
     sub_bb_comment_id,
     sub_person_id,
     sub_bb_comment_updt_cnt,
     sub_pn_long_text_id,
     sub_pn_long_text_updt_cnt
    )

    /*
     * Inactivate current active blood_bank_comment row
     */

    update into blood_bank_comment bbc
        set bbc.active_ind               = 0,
            bbc.active_status_cd         = reqdata->inactive_status_cd,
            bbc.active_status_dt_tm      = cnvtdatetime(curdate, curtime3),
            bbc.active_status_prsnl_id   = reqinfo->updt_id,
            bbc.updt_cnt                 = bbc.updt_cnt + 1,
            bbc.updt_dt_tm               = cnvtdatetime(curdate, curtime3), 
            bbc.updt_id                  = reqinfo->updt_id,
            bbc.updt_task                = reqinfo->updt_task,
            bbc.updt_applctx             = reqinfo->updt_applctx

    where   bbc.bb_comment_id           = sub_bb_comment_id
              and bbc.person_id         = sub_person_id
              and bbc.updt_cnt          = sub_bb_comment_updt_cnt

    with    nocounter

    if (curqual = 0)
        set gsub_status = "F"
        set gsub_process = "inactivate/archive blood_bank_comment"
        set gsub_message = "current active blood_bank_comment row could not be archived--blood_bank_comment not added"
    else
        
        /* Inactivate long_text row */
        call CHG_LONG_TEXT
            (
             /* long_text_id       */ sub_pn_long_text_id,
             /* long_text_updt_cnt */ sub_pn_long_text_updt_cnt,
             /* long_text          */ " ",
             /* active_ind         */ 0, 
             /* active_status_cd   */ reqdata->inactive_status_cd, 
             /* update_text_ind    */ 0                             ; 1=update text, 0 = do NOT update text 
            )

        if (curqual = 0)
            set gsub_status = "F"
            set gsub_process = "inactivate/archive long_text"
            set gsub_message = "current active long_text row could not be archived--blood_bank_comment not added"
        endif           ; endif curqual = 0 long_text
    endif           ; endif curqual = 0 blood_bank_comment

;Generated by GNU enscript 1.6.4.
