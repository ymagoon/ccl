 ;;Solution_Test/script/PathNet -- BB Transfusion/Bbt_Product_Event_Inc/BBT_ADD_PRODUCT_EVENT.INC Turn on black mode

/*
 *  PURPOSE:  add row to product_event table
 *
 *  PRELIMINARIES:
 *   1)  Include the following code in calling program:
 *           %i cclsource:bbt_add_product_event.inc
 *           END        ; end subroutine CHG_PRODUCT_EVENT
 *   2)  Declare the followoing variables in the calling program, prior to calling the subroutine:
 *             set gsub_product_event_status = "  " (gsub = global subroutine variable)
 *             set product_event_id = 0.0
 *   3)  Call subroutine using CALL FORMAT below
 *   4)  After control returns from subroutine, evaluate gsub_product_event_status as follows:
 *         "FS" = get product_event_id (seq) failed
 *         "FA" = add product_event failed                                
 *         "OK" = add successful                                           
 *
 *  CALL FORMAT (this may be copied into calling program): */
 ;       call ADD_PRODUCT_EVENT
 ;          (                             ** These <variables> set in calling program **
 ;           /* product_id               */ <product_id>,
 ;           /* person_id                */ <person_id>,
 ;           /* encntr_id                */ <encntr_id>,
 ;           /* order_id                 */ <order_id>,
 ;           /* bb_result_id             */ <bb_resulst>,
 ;           /* event_type_cd            */ <event_type_cd>,
 ;           /* event_dt_tm              */ cnvtdatetime(<event_dt_tm>),
 ;           /* event_prsnl_id           */ <event_prsnl_id>,
 ;           /* event_status_flag        */ <event_status_flag>,
 ;           /* override_ind             */ <override_ind>,
 ;           /* override_reason_cd       */ <override_reason_cd>,
 ;           /* related_product_event_id */ <related_product_event_id>,
 ;           /* active_ind               */ <active_ind>,
 ;           /* active_status_cd         */ <reqdata->active_status_cd>,
 ;           /* active_status_dt_tm      */ cnvtdatetime(<active_status_dt_tm>),
 ;           /* active_status_prsnl_id   */ <active_status_prsnl_id>
 ;          )
 ;
 ;~DB~************************************************************************
 ;    *                      GENERATED MODIFICATION CONTROL LOG              *
 ;    ************************************************************************
 ;    *                                                                      *
 ;    *Mod Date     Engineer             Comment                             *
 ;    *--- -------- -------------------- ----------------------------------- *
 ;    *001 04/21/03 John Rieck            Updated to store the time zone on  *
 ;    *                                   the PRODUCT_EVENT table for UTC    *
 ;    *                                   compliance.                        *
 ;    *002 07/27/05 Jeff Wain            Renamed product_event_id to         *
 ;    *                                  sub_product_event_id and added call *
 ;    *                                  to set global _id to sub _id.       *         
 ;~DE~************************************************************************
 
    subroutine ADD_PRODUCT_EVENT
        (
         sub_product_id,
         sub_person_id,
         sub_encntr_id,
         sub_order_id,
         sub_bb_result_id,
         sub_event_type_cd,
         sub_event_dt_tm,
         sub_event_prsnl_id,
         sub_event_status_flag,
         sub_override_ind,
         sub_override_reason_cd,
         sub_related_product_event_id,
         sub_active_ind,
         sub_active_status_cd,
         sub_active_status_dt_tm,
         sub_active_status_prsnl_id
        )

    /* Initialize gsub_product_event_status */
    set gsub_product_event_status = "  "
    /* initialize product_event_id */
    set product_event_id = 0.0
    set sub_product_event_id = 0.0

    /*
     * Retrieve new sequence number for sub_product_event_id
     */
%i cclsource:bbt_get_pathnet_seq.inc

    if (curqual = 0)
        set gsub_product_event_status = "FS"
    else
       set sub_product_event_id = new_pathnet_seq
       insert into product_event pe
            set pe.product_event_id         = sub_product_event_id,
                pe.product_id               = sub_product_id,
                pe.person_id                
                    =   if (sub_person_id = NULL)
                            0
                        else
                            sub_person_id
                        endif,
                pe.encntr_id                 
                    =   if (sub_encntr_id = NULL)
                            0
                        else
                            sub_encntr_id
                        endif,
                pe.order_id                 
                    =   if (sub_order_id = NULL)
                            0
                        else
                            sub_order_id
                        endif,
                pe.bb_result_id             = sub_bb_result_id,
                pe.event_type_cd            = sub_event_type_cd,
                pe.event_dt_tm              = cnvtdatetime(sub_event_dt_tm),
                pe.event_prsnl_id           = sub_event_prsnl_id,
                pe.event_status_flag        = sub_event_status_flag,
                pe.override_ind             = sub_override_ind,
                pe.override_reason_cd       = sub_override_reason_cd,
                pe.related_product_event_id = sub_related_product_event_id,
                pe.active_ind               = sub_active_ind,
                pe.active_status_cd         = sub_active_status_cd,
                pe.active_status_dt_tm      = cnvtdatetime(sub_active_status_dt_tm),
                pe.active_status_prsnl_id   = sub_active_status_prsnl_id,
                pe.updt_cnt                 = 0,
                pe.updt_dt_tm               = cnvtdatetime(curdate, curtime3),
                pe.updt_id                  = ReqInfo->updt_id,
                pe.updt_task                = ReqInfo->updt_task,
                pe.updt_applctx             = ReqInfo->updt_applctx,
                pe.event_tz                 = if (CurUTC = 1)
                                                 CurTimeZoneApp
                                              else
                                                 0
                                              endif
        with    nocounter
        ;Sets global new_product_event_id and product_event_id back to subroutine-exclusive sub_product_event_id
        set product_event_id = sub_product_event_id
        set new_product_event_id = sub_product_event_id

        if (curqual = 0)
            set gsub_product_event_status = "FA"
        else
            set gsub_product_event_status = "OK"
        endif           ; endif curqual = 0 product_event   
    endif               ; endif curqual = 0 seq
/* END for subroutine is to be included in calling program code */

;Generated by GNU enscript 1.6.4.
