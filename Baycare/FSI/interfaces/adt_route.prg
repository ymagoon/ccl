/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  adt_route_inv
 *  Description:  route script for mother baby linking on inbound ADT
 *  Type:  Open Engine Route Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:  NE11663
 *  Domain:  C30
 *  Creation Date:  12/12/2011 15:40:32
 *  ---------------------------------------------------------------------------------------------
 *  Mod# Date    Author   		Description & Requestor Information
 * 1:  04/17/17  J Starke 		RFC#1849 - Updating ESI comserver name for BH project and re-architecture 
 */

if(oenobj->CONTROL_GROUP [1]->MSH [1]->message_type->messg_trigger in ("A01", "A08") 
   and oenobj->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->mothers_id->pat_id !="") 

if(oenobj->CONTROL_GROUP [1]->MSH [1]->message_type->messg_trigger = "A08")
;;;;Check if the relationship already exist, if not split the message
    declare baby_id = f8
    set fam_reltn = uar_get_code_by ("MEANING",351,"FAMILY")
    set child_reltn = uar_get_code_by ("MEANING",40,"CHLD_RESP")
    
    select into "nl:"  pa.person_id
    from person_alias pa
    where pa.alias = oenobj->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->pat_id
        and pa.person_alias_type_cd = 7 and pa.active_ind = 1
    detail 
       baby_id = pa.person_id
    with nocounter

   select into "nl:" 
        ppr.person_person_reltn_id
    from encntr_alias ea, encounter e, person_person_reltn ppr 
    plan ea
      where ea.alias = oenobj->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->mothers_id->pat_id
    join e
      where ea.encntr_id = e.encntr_id
    join ppr
      where e.person_id = ppr.person_id 
          and ppr.related_person_id = baby_id 
          and ppr.person_reltn_type_cd = fam_reltn
          and ppr.person_reltn_cd = child_reltn and ppr.active_ind = 1
    with nocounter
  endif
  
  if ((curqual = 0) OR (oenobj->CONTROL_GROUP [1]->MSH [1]->message_type->messg_trigger = "A01"))
    set stat = alterlist(oenRoute->route_list,1)
    set oenRoute->route_list[1]->r_pid = get_proc_id("ADTSIUORM_ESI_1")
    set oenRoute->route_list[1]->split_cnt = 3
    set oenstatus->status = 1
  else
    set stat = alterlist(oenRoute->route_list,1)
    set oenstatus->status=1 
  endif
  
else
  set stat = alterlist(oenRoute->route_list,1)
  set oenstatus->status=1
endif

;*************************
;GET_PROC_ID SUBROUTINE
;*************************

SUBROUTINE GET_PROC_ID(proc_name)
    declare out_pid=i4
      select into "nl:"
          p.interfaceid
      from
          oen_procinfo p
      where
         cnvtupper(p.proc_name) = cnvtupper(proc_name)
     detail
         out_pid = p.interfaceid
     with nocounter
     if(curqual != 0)
       return(out_pid)
     else
       return (0)
    endif
END ;GET_PROC_ID Subroutine