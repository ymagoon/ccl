/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name: rde_rds_pharm_out
 *  Description:  RDE to Theradoc, Pyxis and Getwell
 *  Type:         Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:         Yitzhak Magoon
 *  Library:        OEOCF23RDERDE
 *  Creation Date:  2019
 *  ---------------------------------------------------------------------------------------------
  *  Mod#    Date          Author               Description & Requestor Information
 *  1	 06/10/19      CJM              CAPS Only-Added code to pull the brand name for RXC 2.6 field 
 *  ---------------------------------------------------------------------------------------------
*/

execute oencpm_MsgLog build("Start of rde_consolidated_out script", char(0))
execute oencpm_msglog build("RXE1.7=",oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXE->quant_timing->condition)

if (size(oen_reply->RDE_GROUP , 5) < 1)
    set oenstatus->ignore = 1
    set oenstatus->ignore_text = build("SKIPPED: NO RDE GROUP", char(0))
    go to exit_script
endif

if (oen_reply->RDE_GROUP [1]->ORC->ord_ctrl_rsn_cd->alt_identifier  = "CD:89800833")
    set OenStatus->Ignore=1
    set oenstatus->ignore_text = build("SKIPPED: ORD_CTRL_RSN_CD IS CD:89800833",char(0))
    go to exit_script
endif
/* - added to order suppression
if (oen_reply->RDE_GROUP [1]->ORC->entered_by [1]->last_name = "CONTRIBUTOR_SYSTEM")
    if (oen_reply->RDE_GROUP [1]->ORC->entered_by [1]->first_name = "PYXISRX")
        set oenstatus->ignore = 1
        set oenstatus->ignore_text = build("SKIPPED: ORDER ENTERED BY CONTRIBUTOR_SYSTEM, PYXISRX",char(0))
        go to exit_script
    endif
endif
*/

;load subroutines
execute op_fsi_common
;doctor filter logic
execute op_doc_filter_gen_outv5
set stat = alterlist(oen_reply->RDE_GROUP [1]->ORC->ord_provider,1)

/* Get the frequency times for non AD-HOC frequencies */
if (get_long_value_mobj("freq_qualifier") = 16)
    execute oencpm_msglog("freq_qualifier = 16")
    go to SKIP_AD_HOC_FREQ
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
    set rde_size = size(oen_reply->rde_group , 5)
	
    for (rde_idx = 1 to rde_size)
        set oen_reply->rde_group[rde_idx]->orc->order_quant_timing[1]->interval->time_interval = frequency ;ORC 7.2
        set rxe_size = size(oen_reply->rde_group[rde_idx]->rxe_group, 5)

        for (rxe_idx = 1 to rxe_size)
            set oen_reply->rde_group[rde_idx]->rxe_group[rxe_idx]->rxe->quant_timing->interval->time_interval = frequency ;RXE 1.2
        endfor
    endfor
endif
;end of setting the frequency

execute oencpm_msglog(build("set frequency=",oen_reply->rde_group[1]->rxe_group[1]->rxe->quant_timing->interval->time_interval))

declare pyxis_id = vc
declare num = i2

;get rid of bogus multimix pyxis products named premix
if (size(oen_reply->cerner->object_identifier_info->item, 5) > 0)
    set item_size = size(oen_reply->cerner->object_identifier_info->item, 5)
    
    execute oencpm_msglog(build("item_size=",item_size))
    
    for (item = 1 to item_size)
        set object_size = size(oen_reply->cerner->object_identifier_info->item [item]->object, 5)
        execute oencpm_msglog(build("object_size=",object_size))
		
        ;find the position PREMIX is located within ITEM
        set premix_pos = locateval(num,1,object_size,"PREMIX",
        oen_reply->cerner->object_identifier_info->item [item]->object [num]->value_key)
        execute oencpm_msglog(build("premix_pos=",premix_pos))
		
        ;if PREMIX is one of the objects in item we look for PYXIS
        if (premix_pos > 0)
            execute oencpm_msglog("inside premix_pos")
            set pyxis_pos = locateval(num,1,object_size,"PYXIS",
            oen_reply->cerner->object_identifier_info->item [item]->object [num]->identifier_type_meaning)
            execute oencpm_msglog(build("pyxis_pos=",pyxis_pos))

            set pyxis_id = oen_reply->cerner->object_identifier_info->item [item]->object [pyxis_pos]->VALUE_KEY
        endif
    endfor
endif

set rxc_size = size(oen_reply->RDE_GROUP [1]->RXO_GROUP [1]->RXR_GROUP [1]->RXC_GROUP [1]->RXC, 5)
set rxc_x = 1

while (rxc_x <= rxc_size)
    if (oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXC [rxc_x]->comp_code->identifier = pyxis_id) ;rxc;2.1
        set oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXC [rxc_x]->comp_code->alt_text = cnvtstring(pyxis_id) ;rxc 2.5
    endif
	
    set rxc_x = rxc_x + 1
endwhile

#SKIP_AD_HOC_FREQ

set rxc_size = size(oen_reply->RDE_GROUP [1]->RXO_GROUP [1]->RXR_GROUP [1]->RXC_GROUP [1]->RXC, 5)
set rxc_x = 1

while (rxc_x <= rxc_size)
    ; RXC.3
    set oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXC [rxc_x]->component_amt = 
    oen_reply->RDE_GROUP [1]->RXO_GROUP [1]->RXR_GROUP [1]->RXC_GROUP [1]->RXC [rxc_x]->component_amt
    ; RXC.4
    set oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXC [rxc_x]->comp_units->identifier = 
    oen_reply->RDE_GROUP [1]->RXO_GROUP [1]->RXR_GROUP [1]->RXC_GROUP [1]->RXC [rxc_x]->comp_units->identifier

    set rxc_x = rxc_x + 1
endwhile

/* 
    The soft stop is located as a double value in the message tree, but that value is not always accurate. A Pharmacist can 
    review/modify an order's stop type, which sends two transactions outbound. The double value for the review stop type is 
    the previous stop type (e.g. Physician Stop) but the stop type for the modified order can be different (e.g. Soft Stop). 
    However, both rows exist on the order_detail table when both transactions are sent, so if we hit the database like below, 
    both orders will contain the same stop type. If we use the double value, the values can be different.

    Since we are already hitting the database for the stop type, we might as well hit it for the dispense category. No research 
    was done to determine whether the dispense category in the double values were the same as the order_detail table. 
*/ 

declare od = i2
declare disp_cat = vc
set rde_size = size(oen_reply->rde_group , 5)

select into "nl:"
from
    order_detail od
where expand(od, 1, rde_size, od.order_id, cnvtreal(oen_reply->RDE_GROUP [od]->ORC->placer_ord_nbr [1]->entity_id))
    and od.oe_field_meaning in ("STOPTYPE" , "DISPENSECATEGORY")
order by
    od.order_id
detail
    ;find the corresponding position in the record structure for the the current row/order/orc segment
    pos = locateval(od, 1, rde_size, od.order_id, cnvtreal(oen_reply->RDE_GROUP [od]->ORC->placer_ord_nbr [1]->entity_id))

    /* if trans is a soft stop, take the end date out of ORC;7.5 and RXE;1.5 
        and RXE and ORC durations. Leave it for all other types */
        
    if (od.oe_field_display_value = "Soft Stop" and od.oe_field_meaning = "STOPTYPE")
        oen_reply->RDE_GROUP [pos]->ORC->order_quant_timing [1]->end_dt_tm = ""
        oen_reply->RDE_GROUP [pos]->ORC->order_quant_timing [1]->duration = ""
        oen_reply->RDE_GROUP [pos]->RXE_GROUP [1]->RXE->quant_timing->end_dt_tm = ""
        oen_reply->RDE_GROUP [pos]->RXE_GROUP [1]->RXE->quant_timing->duration = ""
    endif

    /* The dispense category is used by CATO for RDS messages. 
        Logic is included in Cloverleaf to know whether to filter an order or not */
    if (od.oe_field_meaning = "DISPENSECATEGORY")
        oen_reply->RDE_GROUP [pos]->RXE_GROUP [1]->ZX1 [1]->pharmacy_type_cd = od.oe_field_display_value  ;ZX1.7
        disp_cat = od.oe_field_display_value  
    endif
with nocounter

execute oencpm_msglog(build("return=",get_double_value_mobj("service_resource_cd")))
execute oencpm_msglog(build("return2=",cnvtreal(get_double_value_mobj("service_resource_cd"))))

set service_resource_cd = cnvtreal(get_double_value_mobj("service_resource_cd"))

;the service resource is used by CATO for RDE messages. Logic is included in Cloverleaf to know whether to filter an order or not
if (service_resource_cd > 0)
    set oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->ZX1 [1]->disp_from_loc = uar_get_code_display(service_resource_cd) ;ZX1.9
endif

/* 
    CAPS only logic. 
    CAPS does not want our current aliases for drug ingredients in the RXC segments. The following code pulls the brand name 
    of the drug and populates RXC.2.6. Cloverleaf moves this to RXC.2.2 for CAPS only
*/ 

if (disp_cat = "TPN")

    set o_id = cnvtreal(oen_reply->RDE_GROUP[1]->ORC->placer_ord_nbr[1]->entity_id)
    set rxc_cnt = size(oen_reply->RDE_GROUP [1]->RXO_GROUP [1]->RXR_GROUP [1]->RXC_GROUP [1]->RXC ,5)
	
    set brand_name = uar_get_code_by("MEANING",11000,"BRAND_NAME")

    select into "nl:"
    from 
        order_product op 
        , order_ingredient oi
        , med_identifier mi
    plan op
        where op.order_id = o_id
            and op.action_sequence = (select max(op2.action_sequence) ;get most current action
                                        from order_product op2
                                        where op2.order_id = op.order_id)
    join oi
        where oi.order_id = op.order_id
            and oi.comp_sequence = op.ingred_sequence
            and oi.action_sequence = (select max(oi2.action_sequence) ;get most current action
                                        from order_ingredient oi2
                                        where oi2.order_id = oi.order_id)
    join mi
        where mi.item_id = outerjoin(op.item_id)
            and mi.med_product_id = outerjoin(op.med_product_id)
            and mi.med_identifier_type_cd = brand_name
            and mi.active_ind = 1
    head report
        rxc_idx = 0
    detail
        if(rxc_idx < rxc_cnt)
            rxc_idx = rxc_idx + 1
			
            if(oen_reply->RDE_GROUP [1]->RXO_GROUP [1]->RXR_GROUP [1]->RXC_GROUP [1]->RXC [rxc_idx] ->comp_code->alt_text
                = oi.ordered_as_mnemonic)
         oen_reply->RDE_GROUP [1]->RXO_GROUP [1]->RXR_GROUP [1]->RXC_GROUP [1]->RXC [rxc_idx] ->comp_code->alt_coding_system    
                = mi.value
            endif
        endif
    with nocounter
   
endif ;end TPN

#exit_script