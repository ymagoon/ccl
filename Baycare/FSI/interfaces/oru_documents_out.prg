 /*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:    oru_documents_out
 *  Description:    Outbound mod object for ORU MDOCs and DOCs
 *  Type:           Open Engine Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:         Yitzhak Magoon
 *  Library:        OEOCF23ORUORU
 *  Creation Date:  03/06/2019
 *  ---------------------------------------------------------------------------------------------
 *  Mod#   Date          Author                        Description & Requestor Information
 *  001       04/02/19   Hope K                      Cleaned up to work with route and suppression logic
*   002       05/10/19   H Kaczmarczyk      Add logic to get MUSE contrib system from the magic tree
*   000       06/03/19   S Thies                     Copied from C30 for Model Pre-build Phase 1
 *  ---------------------------------------------------------------------------------------------
*/

execute oencpm_msglog(build("begin mod object"))
execute op_fsi_common

set obx_flag = obx_exists(null)
execute oencpm_msglog(build("obx_flag=", obx_flag))

if (obx_flag = 0)
    set oenstatus->ignore = 1
    set oenstatus->ignore_text = "SKIPPED: NO OBX SEGMENTS"
    go to exit_script
endif

    ;MAGIC TREE START
    declare activity_type_cd = f8
    declare activity_type_cd_disp = vc

    set  cqmrefnum = get_string_value_mobj("cqm_refnum")
    execute oencpm_msglog(build("CQM REF NUM:",cqmrefnum,char(0)))
    set oru_contribsys_cd = piece(cqmrefnum, "~",2,"0")
    execute oencpm_msglog(build("ORU CONTRIB SYS CD:",oru_contribsys_cd,char(0)))
    set oru_contribsys = uar_get_code_display(cnvtreal(oru_contribsys_cd))
    execute oencpm_msglog(build("ORU CONTRIB SYS:",oru_contribsys,char(0)))

    if (oru_contribsys_cd = "0")
      go to PCPE_Logic
    
    ;MUSE ONLY for placer order_id
    elseif (oru_contribsys = "MUSE")

     ;Extract the real order id from string in OBR-3
     
     declare ord_id = vc
     declare char = c1
 
     set loop = 1
     set pos = 1
     set filler_order_nbr = oen_reply->RES_ORU_GROUP [1]->OBR [1]->filler_ord_nbr [1]->entity_id
     if (filler_order_nbr > "")
         while (loop = 1)
             set char = substring(pos, 1, filler_order_nbr)

             if (char in ("0","1","2","3","4","5","6","7","8","9"))
                 set ord_id = concat(ord_id, char)
                 set pos = pos + 1
             else
                set loop = 0
             endif
         endwhile
        
         set order_id = ord_id
         set oen_reply->RES_ORU_GROUP [1]->OBR [1]->placer_ord_nbr [1]->entity_id = order_id
         execute oencpm_msglog(build("ORDER_ID = ",order_id, char(0)))
     endif
    endif

    ;All Qualifying Cardiolgy Rebounds based on Activty Type
    if (oru_contribsys in("MUSE", "MUSE BOI", "PHILIPS"))
    select into "nl:"
    o.activity_type_cd
    from orders o
            , order_catalog oc
    where o.order_id = cnvtreal(oen_reply->RES_ORU_GROUP [1]->OBR [1]->placer_ord_nbr [1]->entity_id )
    AND O.CATALOG_CD = OC.CATALOG_CD

    Detail
    activity_type_cd = o.activity_type_cd
    with nocounter
    execute oencpm_msglog(build("activity_type_cd = ",activity_type_cd, char(0)))
					 
    set activity_type_cd_disp = UAR_GET_CODE_DISPLAY(activity_type_cd)
    execute oencpm_msglog(build("activity_type_cd_disp = ",activity_type_cd_disp, char(0)))

      IF (activity_type_cd_disp in ("Cardiology Services", "Cardiac Cath Lab", "Cardiac Tx/Procedures", 
        "Pedi Cardiology Services", "BOI Cardiology", "BOI Cardiovascular", "OP DX Card", "Ambulatory ECHO", 
         "Cardiovascular", "Ambulatory Cardiovascular" ))
      set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = "CARDIOLOGY"
      set oen_reply->RES_ORU_GROUP [1]->OBR [1]->univ_service_id [1]->coding_system = activity_type_cd_disp 
      ELSE	    
      set oenstatus->ignore=1
      set oenstatus->ignore_text = "SKIPPED: UNWANTED CARDIOLOGY ACTIVITY TYPES"
      ENDIF
    Endif

/* 
    PD1 segments are Lifetime Primary care Physicians, which Baycare doesn't use. Replace the physician with 
    Primary Care Physician at the encounter level. 
*/
#PCPE_Logic
execute op_fsi_add_pcpe oen_reply->cerner->encntr_prsnl_info->encntr [1]->encntr_id

; modify OBR.32
; not the same as PCPe

declare idx = i2
declare alias_type_cd = f8 with constant(uar_get_code_by("MEANING", 320, "NPI"))

execute oencpm_msglog(build("alias_type_cd=",alias_type_cd,char(0)))

set prsnl_pos = locateval(idx,1,size(oen_reply->cerner->encntr_prsnl_info->encntr,5),"OBR_32_1",
    oen_reply->cerner->encntr_prsnl_info->encntr [idx]->reln_type_cdf)

execute oencpm_msglog(build("prsnl_pos=",prsnl_pos,char(0)))

if (prsnl_pos > 0)
    set prsnl_id = oen_reply->cerner->encntr_prsnl_info->encntr [prsnl_pos]->prsnl_r [1]->prsnl_person_id
    execute oencpm_msglog(build("prsnl_id=",prsnl_id,char(0)))

    set person_pos = locateval(idx,1,size(oen_reply->cerner->prsnl_info->prsnl,5),prsnl_id,
        oen_reply->cerner->prsnl_info->prsnl [idx]->person_id)
    execute oencpm_msglog(build("person_pos=",person_pos,char(0)))
	
    if (person_pos > 0)
        set person_id = oen_reply->cerner->prsnl_info->prsnl [person_pos]->person_id
        execute oencpm_msglog(build("person_id=",person_id,char(0)))
		
        set alias_pos = locateval(idx,1,size(oen_reply->cerner->prsnl_info->prsnl [person_pos]->alias,5),alias_type_cd,
            oen_reply->cerner->prsnl_info->prsnl [person_pos]->alias [idx]->alias_type_cd)
        execute oencpm_msglog(build("alias_pos=",alias_pos,char(0)))
		
        if (alias_pos > 0)
            set alias = oen_reply->cerner->prsnl_info->prsnl [person_pos]->alias [alias_pos]->alias
            execute oencpm_msglog(build("alias=",alias,char(0)))
			
            set oen_reply->RES_ORU_GROUP [1]->OBR [1]->prim_res_interp [1]->prsnl->alias = alias
            set oen_reply->RES_ORU_GROUP [1]->OBR [1]->prim_res_interp [1]->bed_status = ""
            set oen_reply->RES_ORU_GROUP [1]->OBR [1]->prim_res_interp [1]->location_type= "NPI Number"
            set oen_reply->RES_ORU_GROUP [1]->OBR [1]->prim_res_interp [1]->building = ""
            set oen_reply->RES_ORU_GROUP [1]->OBR [1]->prim_res_interp [1]->floor = ""
            set oen_reply->RES_ORU_GROUP [1]->OBR [1]->prim_res_interp [1]->prsnl->assign_univ_id_type = ""
            set oen_reply->RES_ORU_GROUP [1]->OBR [1]->prim_res_interp [1]->prsnl->source = ""
            set oen_reply->RES_ORU_GROUP [1]->OBR [1]->prim_res_interp [1]->prsnl->assign_name_id = ""
        endif
        execute oencpm_msglog(build("past if",char(0)))
    endif
endif

#exit_script