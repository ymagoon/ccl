 ;;Solution_Test/script/PathNet -- BB Transfusion/Modifycrossmatch/bbt_chg_event_rein_req.inc Turn on black mode

/*~BB~************************************************************************
      *                                                                      *
      *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
      *                              Technology, Inc.                        *
      *       Revision      (c) 1984-2006 Cerner Corporation                 *
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
  ~BE~************************************************************************
      *                   PathNet Blood Bank Transfusion                     *
      *                           V500 Script                                *
      *                     BBT_CHG_EVENT_REIN_REQ.INC                       *
      *                                                                      *
      * PURPOSE:          Hold copy of request/reply for 225222 to execute   *
      *                   it from other scripts.                             *
      *                                                                      *
      ************************************************************************/
;~DB~ ************************************************************************
;     *                      GENERATED MODIFICATION CONTROL LOG              *
;     ************************************************************************
;     *                                                                      *
;     *Mod Date     Engineer             Comment                             *
;     *--- -------- -------------------- ----------------------------------- *
;     *000 09/29/06 Christi Ditmars      Initial Release                     *
;~DE~ ************************************************************************
 
 
;******************************************************************************************
;* request/reply structures, used to pass data between bbt_upd_flex_expiration and          *
;* bbt_chg_event_reinstate.                                                               *
;* Calling script must include glb_script_logging.inc                                     *
;******************************************************************************************
record modxm_request
(
   1 productlist[*]
      2 product_id          = f8
      2 product_event_id    = f8             ;xm product_event_id
      2 xm_exp_dt_tm        = dq8
      2 pe_xm_updt_cnt      = i4
      2 xm_updt_cnt         = i4
      2 p_updt_cnt          = i4             ;info for product table
      2 reinstate_reason_cd = f8             ;info for updating the assign table
   1 more_processing_ind  = i2               ;when this is true, do not unlock product and don't do hard commits
)
 
record modxm_reply
(
%i cclsource:status_block.inc
   1  results[1]
      2 product_event_id      = f8
      2 new_product_event_id  = f8
      2 status                = c1
      2 err_process           = vc
      2 err_message           = vc
)
 
record unique_prods
(    1 products[*]
      2 product_id               = f8
)
 
;******************************************************************************************
;* Declarations                                                                           *
;******************************************************************************************
declare nModXMProdCnt       =i2 with protect, noconstant(0)
 
declare AddModXMProduct(product_id = f8 (value),
                        product_event_id =f8 (value),
                        xm_exp_dt_tm =dq8 (value),
                        reason_cd = f8 (value)
                        ) = NULL
declare ModXMProducts(lock_prods_ind = i2 (value)) = i2 ;1= success
declare UnlockXMProducts() = i2
  
;******************************************************************************************
;* Subroutine: AddModXMProduct - Adds product to modxm_request                            *
;******************************************************************************************
subroutine AddModXMProduct(product_id,
                        product_event_id,
                        xm_exp_dt_tm,
                        reason_cd
                        )
 
;*************** LOCAL VARIABLES ****************
    declare lStat =                i4 with protect,noconstant(0)
;***************** INSTRUCTIONS *****************
    set nModXMProdCnt =    nModXMProdCnt + 1
    if(nModXMProdCnt > size(modxm_request->productlist,5))
        set lstat = alterlist(modxm_request->productlist,nModXMProdCnt+9)
    endif
 
    set modxm_request->productlist[nModXMProdCnt].product_id = product_id
    set modxm_request->productlist[nModXMProdCnt].product_event_id = product_event_id
    set modxm_request->productlist[nModXMProdCnt].xm_exp_dt_tm = xm_exp_dt_tm
    set modxm_request->productlist[nModXMProdCnt].reinstate_reason_cd = reason_cd
 
end
 
;******************************************************************************************
;* Subroutine: ModXMProducts - locks products and looks up updt_cnts                      *
;******************************************************************************************
subroutine ModXMProducts(lock_prods_ind)
 
;*************** LOCAL VARIABLES ****************
    declare lStat                   =i4 with protect,noconstant(0)
    declare nProdCnt              =i2 with protect,noconstant(0)
    declare nErrorInd              =i2 with protect,noconstant(0)
    declare nFoundCnt             =i2 with protect, noconstant(0)
;***************** INSTRUCTIONS *****************
 
    if (nModXMProdCnt > 0)
        set lStat = alterlist(modxm_request->productlist,nModXMProdCnt)
 
        select into "nl:"
            pe.updt_cnt,
            xm.updt_cnt,
            p.product_id
        from
            (dummyt d1 with seq = value(nModXMProdCnt)),
            product p,
            product_event pe,
            crossmatch xm
        plan d1
        join pe where pe.product_event_id = modxm_request->productlist[d1.seq].product_event_id
        join xm where xm.product_event_id = pe.product_event_id
        join p  where p.product_id = pe.product_id
        order by p.product_id
 
        head p.product_id
            ;the same product could be in the request (for different patients), so
            ;get a unique list of products to update
            nProdCnt = nProdCnt + 1
            if(nProdCnt > size(unique_prods->products,5))
            lStat = alterlist(unique_prods->products,nProdCnt+9)
            endif
            unique_prods->products[nProdCnt].product_id = p.product_id
 
        detail
            nFoundCnt = nFoundCnt + 1
            modxm_request->productlist[d1.seq].pe_xm_updt_cnt = pe.updt_cnt
            modxm_request->productlist[d1.seq].xm_updt_cnt =  xm.updt_cnt
            if (lock_prods_ind = 1)
               modxm_request->productlist[d1.seq].p_updt_cnt = p.updt_cnt+1 ;add one for lock update
            else
               modxm_request->productlist[d1.seq].p_updt_cnt = p.updt_cnt
            endif
 
        with counter

        if (nFoundCnt != nModXMProdCnt)
            set nErrorInd = 1
            call LOG_MESSAGE("XM Not found", LOG_LEVEL_AUDIT)
        else
            ;Check and log any CCL errors
            set nErrorInd = ERROR_MESSAGE(1)
            if (nErrorInd = 0)
                   set modxm_request->more_processing_ind = 1
     
                ;lock products
                set lStat = alterlist(unique_prods->products,nProdCnt)
     
                if (lock_prods_ind = 1)
     
                    call LOG_MESSAGE("Locking XM Products", LOG_LEVEL_DEBUG)
     
                    select into "nl:"
                         p.product_id
                    from
                        (dummyt d1 with seq = value(nProdCnt)),
                        product p
     
                    plan d1
                    join p where p.product_id = unique_prods->products[d1.seq].product_id
                                and p.locked_ind = 1 and p.product_id > 0
                    with forupdate(p)
     
     
                    ;Check and log any CCL errors
                    set nErrorInd = ERROR_MESSAGE(1)
                    if (nErrorInd = 0)
                        update into product p,
                                (dummyt d1 with seq = value(nProdCnt))
                        set
                            p.locked_ind = 1,
                            p.updt_cnt = p.updt_cnt + 1,
                            p.updt_dt_tm = cnvtdatetime(curdate, curtime3),
                            p.updt_id = reqinfo->updt_id,
                            p.updt_task = reqinfo->updt_task,
                            p.updt_applctx = reqinfo->updt_applctx
                        plan d1
                        join p where p.product_id  = unique_prods->products[d1.seq].product_id
                        with nocounter
     
                        set nErrorInd = ERROR_MESSAGE(1)
                        if (nErrorInd = 0)
                            commit
                        endif
                    endif
                endif
                if (nErrorInd = 0)
                    call LOG_MESSAGE("Calling bbt_chg_event_reinstate", LOG_LEVEL_DEBUG)
                    set modify nopredeclare
                    execute bbt_chg_event_reinstate with replace("REQUEST","MODXM_REQUEST"),replace("REPLY","MODXM_REPLY")               
                    set modify predeclare
                endif
            endif
        endif
    endif
    if (nErrorInd = 0)
        return(1) ;sucess
    else
        return(0)
    endif
end
 
;******************************************************************************************
;* Subroutine: UnlockXMProducts - unlocks products                                        *
;******************************************************************************************
subroutine UnlockXMProducts(NULL)
 
;*************** LOCAL VARIABLES ****************
    declare nProdCnt              =i2 with protect,noconstant(0)
    declare nErrorInd              =i2 with protect,noconstant(0)
;***************** INSTRUCTIONS *****************
    set nProdCnt = size(unique_prods->products,5)
 
    if (nProdCnt > 0)
        select into "nl:"
            p.product_id
        from
            (dummyt d1 with seq = value(nProdCnt)),
            product p
 
        plan d1
        join p where p.product_id = unique_prods->products[d1.seq].product_id
                            and p.locked_ind = 1 and p.product_id > 0

        with forupdate(p)
 
 
        ; Check and log any CCL errors
        set nErrorInd = ERROR_MESSAGE(1)
        if (nErrorInd = 0)
 
            ;unlock products
            update into product p,
                        (dummyt d1 with seq = value(nProdCnt))
                set
                    p.locked_ind = 0,
                    p.updt_cnt = p.updt_cnt + 1,
                    p.updt_dt_tm = cnvtdatetime(curdate, curtime3),
                    p.updt_id = reqinfo->updt_id,
                    p.updt_task = reqinfo->updt_task,
                    p.updt_applctx = reqinfo->updt_applctx
            plan d1
            join p where p.product_id  = unique_prods->products[d1.seq].product_id
            with nocounter
 
             set nErrorInd = ERROR_MESSAGE(1)
 
        endif
    endif
    if (nErrorInd = 0)
        return(1) ;sucess
    else
        return(0)
    endif
end
 

 
 
 

;Generated by GNU enscript 1.6.4.
