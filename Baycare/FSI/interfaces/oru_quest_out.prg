/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  Quest_ORU_Mod_Obj_4
 *  Description:  Script for results outbound to Quest
 *  Type:         Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:         XXXXXX
 *  Library:        OEOCF23ORUORU
 *  Creation Date:  XXXXXX
 *  ---------------------------------------------------------------------------------------------
 *  Mod#  Date    Author       Description & Requestor Information
 *
 *  1.   10/29/13     H Kaczmarczyk   Added logic to move LOINC coding in OBX from OBX:3.1,.2,.3 to OBX:3.4,.5,.6 
 *                                                             and to copy Lcoding from OBX:3.1,.2 to OBX:3.4,.5         
 *  2.  12/02/13  H Kaczmarczyk Adding Coding to remove DONOTSEND w LOINC values, renumber OBX segments
 *                                                               and ignore messages when all OBX segments have been removed.

 *  ---------------------------------------------------------------------------------------------
*/

;Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->pat_id = ""
;Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->assign_fac_id = ""
;Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->id_type = ""

Set stat = alterlist (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1,0)
;Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->pat_id = ""
;Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_fac_id = ""
;Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->id_type = ""

If (oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_type="ORU")
 If (oen_reply->RES_ORU_GROUP [1]->OBR [1]->filler_ord_nbr [1]->entity_id>"")
	Set oen_reply->RES_ORU_GROUP [1]->OBR [1]->filler_ord_nbr [1]->entity_id = 
   	substring(1,9,oen_reply->RES_ORU_GROUP [1]->OBR [1]->filler_ord_nbr [1]->entity_id)
 Else
	declare alias_type_var = f8
	declare alias_pool_var = f8
	declare alias_var = vc
	set alias_type_var = uar_get_code_by("DISPLAY_KEY", 319, "FINNBR")
	set alias_pool_var = uar_get_code_by("DISPLAY_KEY", 263, "QUESTFIN")
	select into "nl:"
	 ea.alias
	from encntr_alias ea
	where ea.encntr_id=cnvtint(oen_reply->cerner->person_info->person [1]->encntr_id) and
 	 ea.encntr_alias_type_cd = alias_type_var and
  	 ea.alias_pool_cd = alias_pool_var
	detail
 	 alias_var = ea.alias
	with nocounter
  	set oen_reply->RES_ORU_GROUP [1]->OBR [1]->filler_ord_nbr [1]->entity_id = 
                  substring(1,9,alias_var)
 Endif

/**1/7/2008 Logic to move performing site from OBX;17.4 to OBR;21**/
Set oen_reply->RES_ORU_GROUP [1]->OBR [1]->filler_field2 = build(
oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [1]->OBX->observation_method [1]->alt_identifier,
 "^", oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [1]->OBX->observation_method [1]->alt_text, 
 "^", oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [1]->OBX->observation_method [1]->alt_coding_system)

   Execute op_obx_remove_br_for_oru
   Execute op_nte_remove_br_for_oru
Elseif (oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_type="ORM")
  If (oen_reply->ORDER_GROUP [1]->ORC [1]->order_ctrl in ("F", "SC"))
    set oenstatus->ignore=1
  Endif
 If (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->filler_ord_nbr [1]->entity_id>"")
  	Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->filler_ord_nbr [1]->entity_id = 
   	substring(1,9, oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->filler_ord_nbr [1]->entity_id)
 Else
  	declare alias_type_var = f8
	declare alias_pool_var = f8
	declare alias_var = vc
	set alias_type_var = uar_get_code_by("DISPLAY_KEY", 319, "FINNBR")
	set alias_pool_var = uar_get_code_by("DISPLAY_KEY", 263, "QUESTFIN")
	select into "nl:"
	 ea.alias
	from encntr_alias ea
	where ea.encntr_id=cnvtint(oen_reply->cerner->person_info->person [1]->encntr_id) and
 	 ea.encntr_alias_type_cd = alias_type_var and
  	 ea.alias_pool_cd = alias_pool_var
	detail
 	 alias_var = ea.alias
	with nocounter
  	set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->filler_ord_nbr [1]->entity_id = 
                     substring(1,9,alias_var)
                Set oen_reply->ORDER_GROUP [1]->ORC [1]->filler_ord_nbr [1]->entity_id = 
                    oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->filler_ord_nbr [1]->entity_id 
 Endif
Endif

 ;/**OBX**/

 declare x = i4
 declare index_to_remove = i4
 set obx_size = size(oen_reply->RES_ORU_GROUP->OBX_GROUP, 5)
 set x = 1

; find the OBX segment to remove
 while(x <=obx_size)
 set oen_reply->RES_ORU_GROUP ->OBX_GROUP [x]->OBX->set_id = cnvtstring(x)
 set index_to_remove = -1
 if (oen_reply->RES_ORU_GROUP->OBX_GROUP [x]->OBX->observation_id->alt_identifier = "DONOTSEND")
 set index_to_remove = x
 endif
; remove the unwanted OBX segment
execute oencpm_msglog(build("remove index is: ", index_to_remove))
 if (index_to_remove > -1)
 set stat = alterlist(oen_reply->RES_ORU_GROUP-> OBX_GROUP, obx_size -1, x -1)
 set obx_size = obx_size -1
 else
 set x = x +1
 endif
 endwhile

; relocate LOINC coding

Set num_size = size(oen_reply->RES_ORU_GROUP->OBX_GROUP, 5)
Set lc = 1

For (lc = 1 to num_size)

     free set LOINC_code
     free set LOINC_desc  
     free set LOINC_contrib_sys
     free set Lcode
     free set Lcode_desc
     free set Lcode_contrib_sys 
     free set Dup_Lcode
     free set Dup_Lcode_desc

       If (oen_reply->RES_ORU_GROUP ->OBX_GROUP [lc]->OBX->observation_id->coding_system != "LOINC")
        Set Dup_Lcode=oen_reply->RES_ORU_GROUP ->OBX_GROUP [lc]->OBX->observation_id->identifier
        Set Dup_Lcode_desc=oen_reply->RES_ORU_GROUP ->OBX_GROUP [lc]->OBX->observation_id->text
        Set oen_reply->RES_ORU_GROUP ->OBX_GROUP [lc]->OBX->observation_id->alt_identifier=Dup_Lcode
        Set oen_reply->RES_ORU_GROUP ->OBX_GROUP [lc]->OBX->observation_id->alt_text =Dup_Lcode_desc
    Endif

       If (oen_reply->RES_ORU_GROUP ->OBX_GROUP [lc]->OBX->observation_id->coding_system = "LOINC")
        Set LOINC_code=oen_reply->RES_ORU_GROUP ->OBX_GROUP [lc]->OBX->observation_id->identifier
        Set LOINC_desc=oen_reply->RES_ORU_GROUP ->OBX_GROUP [lc]->OBX->observation_id->text
        Set LOINC_contrib_sys=oen_reply->RES_ORU_GROUP ->OBX_GROUP [lc]->OBX->observation_id->
        coding_system 
        Set Lcode=oen_reply->RES_ORU_GROUP ->OBX_GROUP [lc]->OBX->observation_id->alt_identifier 
        Set Lcode_desc=oen_reply->RES_ORU_GROUP ->OBX_GROUP [lc]->OBX->observation_id->alt_text 
        Set Lcode_contrib_sys=oen_reply->RES_ORU_GROUP ->OBX_GROUP [lc]->OBX->observation_id->
        alt_coding_system 
        Set oen_reply->RES_ORU_GROUP ->OBX_GROUP [lc]->OBX->observation_id->identifier=Lcode
        Set oen_reply->RES_ORU_GROUP ->OBX_GROUP [lc]->OBX->observation_id->text=Lcode_desc
        Set oen_reply->RES_ORU_GROUP ->OBX_GROUP [lc]->OBX->observation_id->coding_system=
        Lcode_contrib_sys
        Set oen_reply->RES_ORU_GROUP ->OBX_GROUP [lc]->OBX->observation_id->alt_identifier=LOINC_code
        Set oen_reply->RES_ORU_GROUP ->OBX_GROUP [lc]->OBX->observation_id->alt_text =LOINC_desc
        Set oen_reply->RES_ORU_GROUP ->OBX_GROUP [lc]->OBX->observation_id->alt_coding_system=
        LOINC_contrib_sys
    Endif
Endfor

If (size(oen_reply->RES_ORU_GROUP->OBX_GROUP, 5)=0)
 Set OenStatus->Ignore=1
Endif