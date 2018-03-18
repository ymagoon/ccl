 ;;Solution_Test/script/PathNet -- BB Transfusion/Bbt_Get_Event_Type_Cds_Inc/BBT_GET_EVENT_TYPE_CDS_SUB.INC Turn on black mode

/*
 * bbt_get_event_type_cd_sub.inc
 * 
 * Subroutine to retrieve event_type_cd's for all product states based on cdf_meaning.
 * To be used in accordance with bbt_get_event_type_cd_init.inc
 *
 * USE:
 *   1.  At beginning of calling program:
 *           %i cclsource:bbt_get_event_type_cd_init.inc
 *          
 *               * * *
 *
 *   2.  At some point before event_type code_values are needed
 *      
 *           set get_event_type_cds_status = GET_EVENT_TYPE_CDS("")
 *           if (get_event_type_cds_status = "F") 
 *               ; GET_EVENT_TYPE_CDS select failed
 *               < error processing >
 *           else
 *               ; evaluate required event_type_cd's > 0
 *               ; If all required event_type_cd's > 0.0 continue processing
 *
 *               ; i.e.,
 *                   if (assigned_event_type_cd > 0.0
 *                   and crossmatched_event_type_cd > 0.0
 *                   and quarantined_event_type_cd > 0.0
 *                      < continue processing >
 *                  else
 *                      < error processing >
 *                  endif 
 *           endif
 *
 *    3.  At bottom of calling program
 *            %i cclsource:bbt_get_event_type_cd_sub.inc
 *
 * jow 02/07/97
 *
 * Modifications:
 * 001 Jon Weekes 03/09/99 Modified to use uar_get_meaning_by_codeset instead of join to code_value
 */

declare GET_EVENT_TYPE_CDS(event_type_status) = c1

subroutine GET_EVENT_TYPE_CDS(event_type_cd_dummy)

    set event_type_status = "F"

    set stat = uar_get_meaning_by_codeset(product_state_code_set, assigned_cdf_meaning, 1, assigned_event_type_cd)
    set stat = uar_get_meaning_by_codeset(product_state_code_set, quarantined_cdf_meaning, 1, quarantined_event_type_cd)
    set stat = uar_get_meaning_by_codeset(product_state_code_set, crossmatched_cdf_meaning, 1, crossmatched_event_type_cd)
    set stat = uar_get_meaning_by_codeset(product_state_code_set, issued_cdf_meaning, 1, issued_event_type_cd)
    set stat = uar_get_meaning_by_codeset(product_state_code_set, disposed_cdf_meaning, 1, disposed_event_type_cd)
    set stat = uar_get_meaning_by_codeset(product_state_code_set, transferred_cdf_meaning, 1, transferred_event_type_cd)
    set stat = uar_get_meaning_by_codeset(product_state_code_set, transfused_cdf_meaning, 1, transfused_event_type_cd)
    set stat = uar_get_meaning_by_codeset(product_state_code_set, modified_cdf_meaning, 1, modified_event_type_cd)
    set stat = uar_get_meaning_by_codeset(product_state_code_set, unconfirmed_cdf_meaning, 1, unconfirmed_event_type_cd)
    set stat = uar_get_meaning_by_codeset(product_state_code_set, autologous_cdf_meaning, 1, autologous_event_type_cd)
    set stat = uar_get_meaning_by_codeset(product_state_code_set, directed_cdf_meaning, 1, directed_event_type_cd)
    set stat = uar_get_meaning_by_codeset(product_state_code_set, available_cdf_meaning, 1, available_event_type_cd)
    set stat = uar_get_meaning_by_codeset(product_state_code_set, received_cdf_meaning, 1, received_event_type_cd)
    set stat = uar_get_meaning_by_codeset(product_state_code_set, destroyed_cdf_meaning, 1, destroyed_event_type_cd)
    set stat = uar_get_meaning_by_codeset(product_state_code_set, shipped_cdf_meaning, 1, shipped_event_type_cd)
    set stat = uar_get_meaning_by_codeset(product_state_code_set, in_progress_cdf_meaning, 1, in_progress_event_type_cd)
    set stat = uar_get_meaning_by_codeset(product_state_code_set, pooled_cdf_meaning, 1, pooled_event_type_cd)
    set stat = uar_get_meaning_by_codeset(product_state_code_set, pooled_product_cdf_meaning, 1, pooled_product_event_type_cd)
    set stat = uar_get_meaning_by_codeset(product_state_code_set, confirmed_cdf_meaning, 1, confirmed_event_type_cd)
    set stat = uar_get_meaning_by_codeset(product_state_code_set, drawn_cdf_meaning, 1, drawn_event_type_cd)
    set stat = uar_get_meaning_by_codeset(product_state_code_set, tested_cdf_meaning, 1, tested_event_type_cd)
    set stat = uar_get_meaning_by_codeset(product_state_code_set, intransit_cdf_meaning, 1, in_transit_event_type_cd)
    set stat = uar_get_meaning_by_codeset(product_state_code_set, modified_product_cdf_meaning, 1, modified_product_event_type_cd)
    set stat = uar_get_meaning_by_codeset(product_state_code_set, transferred_from_cdf_meaning, 1, transferred_from_event_type_cd)


    ; 001 NOTE:  With modification to use uar_get_meanings_by_codeset, processing to set event_type_status = "S"
    ;   if select failed is not longer feasible.  Calling program should evaluate that each required event_type_cd
    ;   is > 0 and perform necessary error processing.  This routine will automatically set event_type_status = "S"

    set event_type_status = "S"

    RETURN(event_type_status)
END         ; end subroutine GET_EVENT_TYPE_CDS

;Generated by GNU enscript 1.6.4.
