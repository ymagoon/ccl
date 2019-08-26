/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  oru_lab_out
 *  Description:  Script for lab results outbound
 *  Type:     Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:     Yitzhak Magoon
 *  Library:    OEOCF23ORUORU
 *  Creation Date:  01/25/2019
 *  ---------------------------------------------------------------------------------------------
 *  Mod#   Date      Author           Description & Requestor Information
 *
 *  001  01/25/19   Yitzhak Magoon    Initial script release with model project
 *  002  07/09/19   Yitzhak Magoon    AP Order ID is going out OBR.3 instead of OBR.2 now
 *  ---------------------------------------------------------------------------------------------
*/

execute op_fsi_common ;load subroutines

if(oen_reply->RES_ORU_GROUP [1]->OBR [1]->diag_serv_sec_id = "AP")
    set oid = oen_reply->RES_ORU_GROUP->OBR[1]->placer_ord_nbr[1]->entity_id
    execute oencpm_msglog(build("*** Order ID = ", oid, char(0)))
/*
    When a physician places a AP request order (e.g. Tissue Request Order) the initial order is a 'fake request order.' 
    The pathologist takes that request order and places the proper AP order. When you look at the message tree for a charted 
    AP result, there are at least two RES_ORU_GROUP's. The first is for the tissue request, the remaining are for the actual AP 
    report. The tissue request order (should be) aliased on CS 200 to DONOTSEND, so it is skipped before it reaches the 
    ModObject script. The only RES_ORU_GROUP you have access to in the mod object script is the last one.
    The following code builds the proper order alias and physician alaises based on this AP build. 
*/

    declare order_action_type = f8 with public, noconstant(uar_get_code_by("MEANING",6003,"ORDER"))
    declare npi_number = f8 with public, noconstant(uar_get_code_by("MEANING", 320, "NPI"))
    declare invision = f8 with public, noconstant(uar_get_code_by("DISPLAYKEY",73,"INVISION"))
  
    declare num = i2
    declare accession_nbr = vc
	
    declare obr_size = i2 with public, noconstant(size(oen_reply->RES_ORU_GROUP->OBR,5))
    declare filler_size = i2 with public, noconstant(size(oen_reply->RES_ORU_GROUP [1]->OBR [1]->filler_field1,5))

    select into "nl:"
        oa.action_type_cd
        , oa.order_provider_id
        , p.name_last_key
        , p.name_first_key
        , pa.alias
        , cvo.alias
        , cv.description
    from 
        order_action oa
        , prsnl p
        , prsnl_alias pa
        , orders o
        , code_value cv
        , code_value_outbound cvo
    plan o
        where expand(num,1, obr_size, o.order_id, cnvtreal(trim(oen_reply->RES_ORU_GROUP->OBR[num]->placer_ord_nbr[1]->entity_id)))
    join oa 
        where oa.order_id = o.order_id
            and oa.action_type_cd =order_action_type
    join cvo
        where cvo.code_value = o.catalog_cd
            and cvo.contributor_source_cd = invision
    join cv
        where cv.code_value = cvo.code_value
    join p 
        where p.person_id = oa.order_provider_id
    join pa
        where pa.person_id = outerjoin(p.person_id)
            and pa.prsnl_alias_type_cd = outerjoin(npi_number)
            and pa.active_ind = outerjoin(1)
            and pa.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate, curtime3))
    head report
        oen_reply->RES_ORU_GROUP [1]->OBR [1]->univ_service_id [1]->identifier = cvo.alias
        oen_reply->RES_ORU_GROUP [1]->OBR [1]->univ_service_id [1]->text = cv.description
    detail
        pos = locateval(num,1, obr_size,o.order_id, 
		    cnvtreal(trim(oen_reply->RES_ORU_GROUP->OBR[num]->placer_ord_nbr[1]->entity_id)))
    
        ;there are tons of ordering physicians set in OBR-16, so we want to clear them out before setting this new one
        stat = alterlist(oen_reply->RES_ORU_GROUP->OBR [num]->ord_provider, 0)
        stat = alterlist(oen_reply->RES_ORU_GROUP->OBR [num]->ord_provider, 1)
    
        oen_reply->RES_ORU_GROUP->OBR[num]->ord_provider [1]->id_nbr = pa.alias
        oen_reply->RES_ORU_GROUP->OBR[num]->ord_provider [1]->last_name = p.name_last_key
        oen_reply->RES_ORU_GROUP->OBR[num]->ord_provider [1]->first_name = p.name_first_key
        oen_reply->RES_ORU_GROUP->OBR[num]->ord_provider [1]->assign_auth->name_id = "NPI Number"
        oen_reply->RES_ORU_GROUP->OBR[num]->ord_provider [1]->id_type = "National Provider Identifier"
    with nocounter
	
/*
    The following code returns the Order ID from the external ordering system (eCW) with the AP result to close out the order
    in that application. 
*/
    for (filler = 1 to filler_size)
        if (oen_reply->RES_ORU_GROUP [1]->OBR [1]->filler_field1 [filler]->field_type in ("HNA_ACCNID", "HNA_AP_ACCN"))
            set accession_nbr = oen_reply->RES_ORU_GROUP [1]->OBR [1]->filler_field1 [filler]->value
        endif
    endfor
    
    execute oencpm_msglog(build("Accession number = ",accession_nbr,char(0)))
    declare order_alias = vc
	
    select 
        ao.order_id
        , o.alias
    from 
        accession_order_r ao
        , order_alias o
    plan ao
        where ao.accession = accession_nbr
    join o 
        where o.order_id = ao.order_id 
            and o.alias not in("",NULL," ")
    detail
        order_alias = o.alias
    with nocounter
   
    execute oencpm_msglog(build("AP Order Alias = ", order_alias,char(0)))

    set oen_reply->RES_ORU_GROUP [1]->OBR [1]->filler_ord_nbr [1]->entity_id = order_alias ;002
endif ;end AP

/* 
    PD1 segments are Lifetime Primary care Physicians, which Baycare doesn't use. Replace the physician with 
    Primary Care Physician at the encounter level. 
*/

execute op_fsi_add_pcpe oen_reply->cerner->encntr_prsnl_info->encntr [1]->encntr_id

/* Remove results with an alias of "DONOTSEND" */
declare index_to_remove = i4
set obx_size = size(oen_reply->RES_ORU_GROUP->OBX_GROUP, 5)
set idx = 1

; find the OBX segment to remove
while(idx <= obx_size)
    set oen_reply->RES_ORU_GROUP ->OBX_GROUP [idx]->OBX->set_id = cnvtstring(idx)
    set index_to_remove = -1
  
    if (oen_reply->RES_ORU_GROUP->OBX_GROUP [idx]->OBX->observation_id->alt_identifier = "DONOTSEND")
        set index_to_remove = idx
    endif
  
    if (index_to_remove > -1)
        set stat = alterlist(oen_reply->RES_ORU_GROUP-> OBX_GROUP, obx_size - 1, idx - 1)
        set obx_size = obx_size - 1
    else
        set idx = idx + 1 
    endif
endwhile

 ;if no obx ignore the message
set obx_flag = obx_exists(null)
;execute oencpm_msglog(build("obx size = ",obx_exists,char(0)))
;call echo(build("obx size = ",obx_exists,char(0)))

if (obx_flag = 0)
    set oenstatus->ignore = 1
    set oenstatus->ignore_text = "SKIPPED: NO OBX SEGMENTS"
endif