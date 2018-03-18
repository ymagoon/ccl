 ;;Solution_Test/script/PathNet -- BB Transfusion/RESULTENTRYFORBLOODBANK/BBT_ADD_SPCL_TST.INC Turn on black mode

/*
 *  PURPOSE:  if special_testing_cd does NOT existing on speclial_testing table, add row to special_testing table 
 *            else update existing special_testing row confirmed_ind to 1 if not currently 1
 *
 *  PRELIMINARIES:
 *   1)  Include the following code in calling program:
 *           %i cclsource:bbt_add_spcl_tst.inc
 *           END        ; end subroutine ADD_SPECIAL_TESTING
 *
 *           %i cclsource:bbt_get_pathnet_seq_sub.inc (this need be in the calling program only once)
 *
 *   2)  Declare the followoing variables in the calling program, prior to calling the subroutine:
 *             set gsub_special_testing_status = "  " (gsub = global subroutine variable)
 *   3)  Call subroutine using CALL FORMAT below
 *   4)  After control returns from subroutine, evaluate gsub_special_testing_status as follows:
 *         "FS" = get special_testing_id (seq) failed
 *         "FA" = add special testing failed                                
 *         "FL" = lock for update to confirmed "Y" failed
 *         "FU" = update for confirmed to "Y" failed
 *         "OK" = add successful                                           
 *
 *  CALL FORMAT (this may be copied into calling program):  */
 ;       call ADD_SPECIAL_TESTING
 ;          (                             ** These <variables> set in calling program **
 ;           /* product_id             */ <product_id>,
 ;           /* special_testing_cd     */ <special_testing_cd>,
 ;           /* sub_confirmed_ind      */ <sub_confirmed_ind>,
 ;           /* rh_phenotype_id        */ <product_rh_phenotype_id>
 ;           /* active_ind             */ <active_ind>,
 ;           /* active_status_cd       */ <reqdata->active_status_cd>,
 ;           /* active_status_dt_tm    */ cnvtdatetime(<active_status_dt_tm>),
 ;           /* active_status_prsnl_id */ <active_status_prsnl_id>,
 ;           /* check_for_duplicate_yn */ <Y/N>  ; Y = Check for duplicate row and Do not add if found
 ;          )

subroutine ADD_SPECIAL_TESTING
   (
    sub_product_id,
    sub_special_testing_cd,
    sub_confirmed_ind,
    sub_rh_phenotype_id,
    sub_active_ind,
    sub_active_status_cd,
    sub_active_status_dt_tm,
    sub_active_status_prsnl_id,
    sub_check_for_duplicate_yn
   )

/* Initialize gsub_special_testing_status */
set gsub_special_testing_status = "  "
set new_special_testing_id = 0.0
set confirmed_ind = 0

if (sub_check_for_duplicate_yn = "Y")
    /*
     * Determine if spestial_testing_cd already exists for product, if so return special_testing_id
     * as new_special_testing_id
     */
    select into "nl:"
        s.special_testing_id
        , s.product_id
        , s.special_testing_cd
        , s.confirmed_ind
    from
        special_testing s
    where   s.product_id                = sub_product_id        
              and s.special_testing_cd  = sub_special_testing_cd
              and s.active_ind          = 1
    detail 
        new_special_testing_id  = s.special_testing_id
        confirmed_ind           = s.confirmed_ind
    with    nocounter
endif

if (curqual = 0
or sub_check_for_duplicate_yn != "Y")
    /*
     * Insert special_testing row for new special_testing_cd
     */
    set new_special_testing_id = NEXT_PATHNET_SEQ(0)

    if (curqual = 0)
        set gsub_special_testing_status = "FS"
    else
        insert into special_testing s set
            s.special_testing_id = new_special_testing_id,
            s.product_id = sub_product_id,
            s.special_testing_cd = sub_special_testing_cd,
            s.confirmed_ind = sub_confirmed_ind,
            s.product_rh_phenotype_id = sub_rh_phenotype_id,
            s.active_ind = sub_active_ind,
            s.active_status_cd         = sub_active_status_cd,
            s.active_status_dt_tm      = cnvtdatetime(sub_active_status_dt_tm),
            s.active_status_prsnl_id   = sub_active_status_prsnl_id,            
            s.updt_dt_tm = cnvtdatetime(curdate,curtime3),
            s.updt_id = reqinfo->updt_id,       
            s.updt_cnt = 0,
            s.updt_task = reqinfo->updt_task,   
            s.updt_applctx = reqinfo->updt_applctx      
        with nocounter 

        if (curqual = 0)
            set gsub_special_testing_status = "FA"       
        else
            set gsub_special_testing_status = "OK"
        endif           ; endif curqual = 0 person_antigen   
    endif
else
    /* 
     * if row already exists for special_testing_cd, set confirmed_ind = 1 if not = 1
     */
    if (confirmed_ind = 1)
        set gsub_special_testing_status = "OK"
    else
        /* lock record */
        select into "nl:"
            s.special_testing_id
        from 
            special_testing s
        where 
            s.special_testing_id = new_special_testing_id
        with nocounter, forupdate(s)

        if (curqual = 0)
            set gsub_special_testing_status = "FL"
        else
            update into special_testing s set 
                s.confirmed_ind            = sub_confirmed_ind,
                s.updt_cnt                 = s.updt_cnt + 1,
                s.updt_dt_tm               = cnvtdatetime(curdate, curtime3),
                s.updt_id                  = ReqInfo->updt_id,
                s.updt_task                = ReqInfo->updt_task,
                s.updt_applctx             = ReqInfo->updt_applctx
            where   s.special_testing_id       = new_special_testing_id
            with    nocounter

            if (curqual = 0)
                set gsub_special_testing_status = "FU"
            else
                set gsub_special_testing_status = "OK"
            endif
        endif     
    endif
endif
/* END for subroutine is to be included in calling program code */

;Generated by GNU enscript 1.6.4.
