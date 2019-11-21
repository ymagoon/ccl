/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  rds_pharmo_out
 *  Description:   RDS changed to RDE to Pharmogistics
 *  Type:               Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:         Jim Rachael
 *  Library:        OEOCF23RDERDE
 *  Creation Date:  2009
 *  ---------------------------------------------------------------------------------------------
 *  Mod# Date    Author   Description & Requestor Information
 * 
*   10:   9/22/15   T McArtor             Added SAH SJN per Project (Kelly A) 
*   11:   9/24/15   T McArtor             Added MCS  per Project (Kelly A) 
*   12: 10/27/15   T McArtor              Added MDU  per Project (Kelly A) 
*   13: 10/27/15   T McArtor              Added BAH  per Project (Charlie D) 
*   14: 11/09/15   T McArtor              Added NBY  per Project (Charlie D) 
*   15: 11/17/15   T McArtor              Added SJN adjusted see note below per (Charlie D) 
*   16: 12/01/15   T McArtor              Added WHH WHW adjusted see note below per (Charlie D) 
*   17: 01/05/16   T McArtor              Added SJH SJW adjusted see note below per (Charlie D) 
*   18: 05/28/16   T McArtor              Added BRM adjusted see note below per (T Craft) 
*   19. 07/13/16 D Olszewski              Cart Fills: Only send SAH and Med dispense category
*   20. 07/19/16 D Olszewski              Removing cart fill location filter
*   21. 03/23/17 D Olsz                   Adding in Premix FillLists to go outbound.
*   22. 09/14/18   C Markwardt            Adding Intermittent Premix and Continuous Premix FillLists to go outbound.
*   23. 09/24/18   C Markwardt            Adding "Chemo Med" FillLists to go outbound.
*   024 11/19/19   Y Magoon               Clean up script. Add dispense location
 *  ---------------------------------------------------------------------------------------------
*/

set trace recpersist
free record ZRC

record ZRC (
  1 string = VC
)

set trace norecpersist

;load subroutines
execute op_fsi_common

;variable declarations
declare cqmsubtype = c15

if (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->building not in ("SJS", "SFB",
    "St. Anthony's", "SAH","SJN","St. Joseph's Hos","MCS","Mease Countrysi","MDU","Mease Dunedin",
    "BAH","NBY","MPH","Morton Plant", "WHH","WHW","SJH","SJW","BRM")) 
    set oenstatus->ignore = 1
    set oenstatus->ignore_text = build("SKIPPED: PATIENT BUILDING OF "
    , oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->building, " IS NOT IN LIST")

    go to exit_script
endif

for (rde_cnt = 1 to size(oen_reply->RDE_GROUP,5))
    if (oen_reply->RDE_GROUP [rde_cnt]->RXE_GROUP [1]->RXE->disp_amt = "0") 
        set oenstatus->ignore = 1
        set oenstatus->ignore_text = "SKIPPED: DISPENSE AMOUNT IS 0"
        go to exit_script
    endif
endfor

;;; todo - see if any of these reasons exist in p30
set cqmtype = get_string_value_mobj("cqm_type")
set cqmsubtype = get_string_value_mobj("cqm_subtype")
set cqmclass = get_string_value_mobj("cqm_class")

if (cqmsubtype = "")
    execute oencpm_MsgLog build("No Cerner section in message or CQM_SUBTYPE = null.", char(0))
    set oenstatus->ignore = 1
    set oenstatus->ignore_text = "SKIPPED: CQM_SUBTYPE IS NULL"
    go to exit_script
elseif (cqmsubtype = "0")
    execute oencpm_MsgLog build("Cerner section exists, but no CQM_SUBTYPE value.", char(0))
    set oenstatus->ignore = 1
    set oenstatus->ignore_text = "SKIPPED: CQM_SUBTYPE IS 0"
    go to exit_script
endif

if(oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_type = "RDS")
    execute oencpm_MsgLog build("Start of build Z segment", char(0))

    declare num = i2
    set disp_dt_tm = oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXE->recent_refill_or_disp

    ;formatting ZRC:2 Fill Date & tm to formate MMDDYYYYHHMM00
    set fill_month = substring(5, 2, disp_dt_tm)
    set fill_day = substring(7, 2 , disp_dt_tm)
    set fill_year = substring(0, 4, disp_dt_tm)
    set fill_hour = substring(9, 2, disp_dt_tm)
    set fill_min = substring(11, 2, disp_dt_tm)
    set fill_dt = build(fill_month, fill_day, fill_year, fill_hour, fill_min, "00")

    set ZRC->string = trim(build("ZRC|", oen_reply->RDE_GROUP [1]->ORC->order_ctrl, "|" , fill_dt,"|"))

    execute oencpm_msglog build("NEW FILLDATE ", fill_dt)
    execute oencpm_msglog build("NEW SEGMENT",ZRC->string,char(0))

    /* This interface must be triggered as an RDS - need to switch it to an RDE for Talyst */
    set oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_type = "RDE"
    set oen_reply->RDE_GROUP [1]->ORC->order_ctrl = "NW"

/* Create ZX3 segment-dispense category in ZX3-2 for Cloverleaf filtering/filter by disp. loc/ change disp. amt*/
    set rde_sz = size(oen_reply->RDE_GROUP,5)
	
    select
        fpoh.dispense_category_s
        , fpoh.cur_disp_loc_s
        , fpoh.charge_qty
        , fpoh.fill_quantity
    from
        fill_print_ord_hx fpoh
    where expand(num,1,rde_sz,fpoh.order_id,cnvtreal(oen_reply->RDE_GROUP [num]->ORC->placer_ord_nbr [1]->entity_id))
    order by
        fpoh.updt_dt_tm asc
    detail
        pos = locateval(num,1,rde_sz,fpoh.order_id,cnvtreal(oen_reply->RDE_GROUP [num]->ORC->placer_ord_nbr [1]->entity_id))
				
        /* JN Main Pharmacy was removed at direction of project JN Inventory Manager added. Kelly A., 
           Charlie D. held meeting with pharmacy site manager (Jennifer Austin). Initially there was a dose edge 
           issue that caused this code to vary from standard inventory Manager configuration.
        */
        if (oen_reply->RDE_GROUP [1]->ORC->ord_ctrl_rsn_cd->identifier = "Fill List")
            if (fpoh.dispense_category_s not in ("Med","Chemo-adult-Med", "Chemo-pedi-Med","Investigational-Med", "Med-Specialty",
                                         "IV-Intermittent-Premix", "IV-pedi-Intermittent-Premix", "IV-pedi-Continuous-Premix", 
                                         "IV-adult-Continuous-Premix", "IV-adult-Intermittent-Premix","Intermittent Premix",
                                         "Continuous Premix","Chemo Med"))
                oenstatus->ignore = 1
                oenstatus->ignore_text = "SKIPPED: ORD_CTRL_RSN_CD IS NOT Fill List"
            endif
        endif ;end fill list logic
		
        oen_reply->RDE_GROUP [pos]->RXE_GROUP [1]->RXE->disp_amt = cnvtstring(fpoh.charge_qty)
;        oen_reply->RDE_GROUP [pos]->ORC->order_quant_timing [1]->priority = fpoh.order_priority_s
;        oen_reply->RDE_GROUP [pos]->RXE_GROUP [1]->RXE->quant_timing->priority = fpoh.order_priority_s
		
        if (oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXE->give_dosage_form->identifier = "Premix")
            oen_reply->RDE_GROUP [pos]->RXE_GROUP [1]->RXE->disp_amt = cnvtstring(fpoh.fill_quantity)
        endif
		
        oen_reply->RDE_GROUP [pos]->RXE_GROUP [1]->ZX3 [1]->dea_schedule->identifier = "1"
		
        if (fpoh.dispense_category_s = null)
            oen_reply->RDE_GROUP [pos]->RXE_GROUP [1]->ZX3 [1]->dea_schedule->text = "MISSING"
        else
            oen_reply->RDE_GROUP [pos]->RXE_GROUP [1]->ZX3 [1]->dea_schedule->text = fpoh.dispense_category_s
        endif

        foot report
            if (oen_reply->RDE_GROUP [1]->ORC->ord_ctrl_rsn_cd->identifier != "Fill List")
                if (fpoh.cur_disp_loc_s not in ("JS Inventory Manager", "SFB Inventory Manager","JN Inventory Manager"
                    , "MC Inventory Manager","MD Inventory Manager","MP Inventory Manager","NB Inventory Manager"
                    , "WW Inventory Manager","JH Inventory Manager","JW Inventory Manager", "BR Inventory Manager"
                    , "AH Inventory Manager","WH Inventory Manager"))
                    oenstatus->ignore = 1
                    oenstatus->ignore_text = "SKIPPED: ORD_CTRL_RSN_CD IS NOT FILL LIST AND DISPLAYLOC IS NOT IN LIST"
                endif
            endif
    with nocounter

    execute op_doc_filter_gen_outv2

    /* Get the frequency times for non AD-HOC frequencies */
    if (get_long_value_mobj("freq_qualifier") = 16)
        execute oencpm_msglog("freq_qualifier = 16")
        go to exit_script
    endif

    ;determine the correct frequency and populate the RDE_GROUP and RXE_GROUP with it
    set time_of_day = trim(get_string_value_mobj("freq_time_of_day"))
    set day_of_week = trim(get_string_value_mobj("freq_day_of_week"))

    declare frequency = vc

    ;get_string_value returns "0" if the string value is not found and "-1" if there is an error
    if (time_of_day > "" and time_of_day not in ("0","-1"))
        execute oencpm_msglog("inside time_of_day")
        set frequency = time_of_day
    elseif (day_of_week > "" and day_of_week not in ("0","-1"))
        execute oencpm_msglog("inside day_of_week")
        set frequency = day_of_week
    endif

    execute oencpm_msglog(build("frequency=",frequency))
    
    ;if there is a frequency then assign it to each orc and rxe segment

    if (frequency > "")
        declare rde_idx = i2
        declare rxe_idx = i2
        set rde_sz = size(oen_reply->rde_group , 5)
	
        for (rde_idx = 1 to rde_sz)
            set oen_reply->rde_group[rde_idx]->orc->order_quant_timing[1]->interval->time_interval = frequency ;ORC 7.2
            set rxe_size = size(oen_reply->rde_group[rde_idx]->rxe_group, 5)

            for (rxe_idx = 1 to rxe_size)
                set oen_reply->rde_group[rde_idx]->rxe_group[rxe_idx]->rxe->quant_timing->interval->time_interval = 
                    frequency ;RXE 1.2
            endfor
        endfor
    endif ;end of setting the frequency

    set service_resource_cd = cnvtreal(get_double_value_mobj("service_resource_cd"))
    
    ;begin 024
    if (service_resource_cd > 0)
        set oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->ZX1 [1]->disp_from_loc = uar_get_code_display(service_resource_cd) ;ZX1.9
    endif
    ;end 024
endif ; end if (messg_type = "RDS")

#exit_script