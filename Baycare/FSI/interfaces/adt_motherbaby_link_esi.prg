/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  adt_mod_obj_esi
 *  Description:  modify object script for the ESI comserver for mother/baby linking
 *  Type:  Open Engine Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:  NE11663
 *  Domain:  C30
 *  Creation Date:  12/12/2011 15:54:26
 *  ---------------------------------------------------------------------------------------------
* Mod#       Date      Author     Description 
* 1:   7/31/12      N.Boyd    Added logic to prevent the use of mother's end-effected
*                                               CPI number if mulitple CPI's are active
* 2: 11/26/12   PHopkins    Added logic to ensure the e.alias is a FIN
* 3: 12/01/14  HKaczmarczyk    Added logic to remove Patient Portal OBX segments
* 4: 01/03/2019 CJM Adding logic to look for the BCCPI instead of the CPI
* 5: 01/03/2019YM Replace hard coded values with variables
* 6: 01/03/2019 YM Add mother's middle initial to PID and NK1 segments, fixed issue with duplicate patients 
*/

execute oencpm_msglog(build("Mother/Baby logic", char(0)))
execute oencpm_msglog(build("Split Index ->", oen_request_data->split_index, char(0)))

if (VALUE(oen_request_data->split_index) > 1)
  if  (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->mothers_id->pat_id !="")
    ;Create A31 messages, one for the baby and one for the mother
    ;with an NK1 segment for babies for mother\baby linking.
    Set oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_trigger = "A31"
    Set oen_reply->CONTROL_GROUP [1]->EVN [1]->event_type_cd = "A31"

    if (size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PD1,5)>0)
      set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PD1,0)
    endif
    if(size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NK1, 5)>0)
      set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NK1,0)
    endif
    if (size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1,5)>0)
    set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1,0)
    endif
    if (size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV2,5)>0)
      set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV2,0)
    endif
    if (size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->OBX,5)>0)
      set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->OBX,0)
    endif
    if (size(oen_reply->PERSON_GROUP [1]->CLIN_GROUP,5)>0)
      set stat = alterlist(oen_reply->PERSON_GROUP [1]->CLIN_GROUP,0)
    endif
    if (size(oen_reply->PERSON_GROUP [1]->FIN_GROUP,5)>0)
      set stat = alterlist(oen_reply->PERSON_GROUP [1]->FIN_GROUP,0)
    endif
    
    set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NK1,1)
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NK1 [1]->set_id = "1"
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NK1 [1]->contact_role->identifier = "FAM" 
    
;***remove leading zeros from mother's identifier***
declare mom_fin = vc
set mom_fin = trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->mothers_id->pat_id)
set mom_fin_size = size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->mothers_id->pat_id, 1)

WHILE(mom_fin_size  > 0)
   IF(cnvtint(SUBSTRING(1, 1, mom_fin)) = 0)
      SET mom_fin= SUBSTRING(2, mom_fin_size  -1, mom_fin)
      SET mom_fin_size  = mom_fin_size  - 1
   ELSE
      SET mom_fin_size  = 0
   ENDIF
ENDWHILE
execute oencpm_msglog(build("Mother FIN ->", mom_fin, char(0)))

 /***Mod 2: 11/26/12   PHopkins    Added logic to ensure the e.alias is a FIN*****/

;begin 5
  declare encntr_alias_type = f8
  declare person_alias_type = f8

  set encntr_alias_type = uar_get_code_by("MEANING", 319, "FIN NBR")
  set person_alias_type = uar_get_code_by("MEANING", 4, "CMRN")
;end 5

/*** Mod 4:09/25/18 CJM changing the person_alias_type from 7 to 2 to get the community MRN ***/
    declare mom_person_id = f8
    declare mom_cmrn = vc
    declare mom_name_first = vc
    declare mom_name_last = vc
    declare mom_name_middle = vc  ;6

    select into "nl:" p.person_id, p.name_first_key, p.name_last_key, pa.alias
    from encntr_alias ea, encounter e, person p, person_alias pa 
    plan ea
      where ea.alias = mom_fin ;oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->mothers_id->pat_id
          and ea.encntr_alias_type_cd = encntr_alias_type  ;5
          and ea.active_ind = 1
          and ea.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
    join e
      where ea.encntr_id = e.encntr_id
    join p
      where e.person_id = p.person_id
    join pa
      where p.person_id = pa.person_id 
          and pa.person_alias_type_cd = person_alias_type ;5
          and pa.active_ind = 1
          and pa.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
    detail
      mom_person_id = p.person_id
      mom_name_first = p.name_first_key
      mom_name_last = p.name_last_key
      mom_name_middle = p.name_middle_key  ;6
      mom_cmrn = pa.alias
    with nocounter

execute oencpm_msglog(build("Mother person_id ->", mom_person_id, char(0)))
execute oencpm_msglog(build("Mother Last Name ->", mom_name_last, char(0)))
execute oencpm_msglog(build("Mother BCCPI ->", mom_cmrn, char(0)))
 
 ;*** CJM 09/24 comment this out and looking at the PID 2 for BCCPI instead   
;***remove leading zeros from baby's CPI***
/*
declare baby_cpi = vc
for(x = 1 to size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int, 5))
 if(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [x]->id_type = "CPI")
   set baby_cpi = trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [x]->pat_id )
   set baby_cpi_size = size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [x]->pat_id, 1)
  endif
endfor 
*/

;***remove leading zeros from baby's BCCPI***
declare baby_cpi = vc
for(x = 1 to size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext, 5))
 if(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext [x]->id_type = "BCCPI")
   set baby_cpi = trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext [x]->pat_id )
   set baby_cpi_size = size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext [x]->pat_id, 1)
  endif
endfor 

WHILE(baby_cpi_size  > 0)
   IF(cnvtint(SUBSTRING(1, 1, baby_cpi)) = 0)
      SET baby_cpi= SUBSTRING(2, baby_cpi_size  -1, baby_cpi)
      SET baby_cpi_size  = baby_cpi_size  - 1
   ELSE
      SET baby_cpi_size  = 0
   ENDIF
ENDWHILE
; Mod 4: CJM 09/25/18 Updating the below line to be BCCPI
execute oencpm_msglog(build("Baby BCCPI ->", baby_cpi, char(0)))
; Mod 4: CJM 09/25/18 UPpdating the script to look for the alias_type of 2 instead of 7
    declare baby_id = f8
    select into "nl:"  pa.person_id
    from person_alias pa
    where pa.alias = baby_cpi ;oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->pat_id
        and pa.person_alias_type_cd =  person_alias_type ;5
        and pa.active_ind = 1
        and pa.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
    detail 
       baby_id = pa.person_id
    with nocounter

execute oencpm_msglog(build("Baby person_id ->", baby_id, char(0)))
 
    if (VALUE(oen_request_data->split_index) = 2)
;;;;Create a message relating the mother to the baby 
execute oencpm_msglog(build("creating Mother relationship to Baby", char(0)))

;;;;Check if the relationship already exist, since A08 can be split if they come in groups;
;;;;if the relationship was create from a previous split ignore the message.
      set fam_reltn = uar_get_code_by ("MEANING",351,"FAMILY")
      set mother_reltn = uar_get_code_by ("MEANING",40,"MOTHER")
      select into "nl:" ppr.person_person_reltn_id
      from person_person_reltn ppr 
      where ppr.person_id = baby_id 
         and ppr.related_person_id= mom_person_id 
         and ppr.person_reltn_type_cd = fam_reltn
         and ppr.person_reltn_cd = mother_reltn 
         and ppr.active_ind = 1
      with nocounter
      if (curqual > 0)
      	 set OenStatus->Ignore=1
                 execute oencpm_msglog(build("IGNORE Mother relationship to baby ", char(0)))
      endif
      
      ;*** CJM 0924 Changing the id_type to BCCPI instead of CPI	
      Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NK1 [1]->nk_name [1]->last_name = mom_name_last
      Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NK1 [1]->nk_name [1]->first_name = mom_name_first
      Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NK1 [1]->nk_name [1]->middle_name = mom_name_middle ;6
      Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NK1 [1]->relationship->identifier = "M"
      Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NK1 [1]->nk_identifiers [1]->pat_id = mom_cmrn	  		
      Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NK1 [1]->nk_identifiers [1]->id_type = "BCCPI"

    elseif (VALUE(oen_request_data->split_index) = 3)
;;;;Create a message relating the baby(s) to the mother
execute oencpm_msglog(build("creating Baby(s) relationship to Mother", char(0)))
     
;;;;Check if the relationship already exist, since A08 can be split if they come in groups;
;;;;if the relationship was create from a previous split ignore the message.
      set fam_reltn = uar_get_code_by ("MEANING",351,"FAMILY")
      set child_reltn = uar_get_code_by ("MEANING",40,"CHLD_RESP")
      select into "nl:" ppr.person_person_reltn_id
      from person_person_reltn ppr 
      where ppr.person_id= mom_person_id 
         and ppr.related_person_id = baby_id 
         and ppr.person_reltn_type_cd = fam_reltn
         and ppr.person_reltn_cd = child_reltn 
         and ppr.active_ind = 1
      with nocounter
      if (curqual > 0)
      	 set OenStatus->Ignore=1
                 execute oencpm_msglog(build("IGNORE Baby relationship to mother ", char(0)))
      endif

      Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NK1 [1]->nk_name [1]->last_name =
        oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_name [1]->last_name 
      Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NK1 [1]->nk_name [1]->first_name =
        oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_name [1]->first_name 
      Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NK1 [1]->relationship->identifier = "CHILD"
      Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NK1 [1]->nk_identifiers [1]->pat_id = baby_cpi
      Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NK1 [1]->nk_identifiers [1]->id_type = "BCCPI"

      
      declare mom_mrn = vc
      declare alias_type = f8
      set assign_auth = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [1]->act_assign_fac_id 
      set alias_type = uar_get_code_by ("DISPLAY", 263, assign_auth)
      select into "nl:"  pa.alias
      from person_alias pa 
      plan pa  where pa.person_id = mom_person_id 
       and pa.alias_pool_cd = alias_type
       and pa.active_ind = 1
       and pa.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
      detail
        mom_mrn = pa.alias
      with nocounter  
      set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID,0)
      set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID,1)

      Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->pat_id = mom_cmrn ;6
      Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->id_type = "BCCPI" ;6
      Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_name [1]->last_name = mom_name_last
      Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_name [1]->first_name = mom_name_first
      Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_name [1]->middle_name = mom_name_middle ;6

     ;Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [1]->pat_id = mom_cmrn ;6
     ;Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [1]->id_type  = "CPI"       ;6
     ;Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [1]->pat_id = mom_mrn
     ;Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [1]->act_assign_fac_id = assign_auth
;;;;Look up additional related babies, so we don't inactivate the other relationships      
execute oencpm_msglog(build("Look up additional related babies, so we don't inactivate the other relationships", char(0)))
      record baby
      ( 1 qual[*]
          2 last_name = vc
          2 first_name = vc
          2 cmrn = vc
       )with persist
      set cnt = 0
      select into "nl:"  p.name_last, p.name_first, pa.alias
      from person_person_reltn ppr, person p, person_alias pa 
      plan ppr  
      where ppr.person_id = mom_person_id 
          and ppr.person_reltn_type_cd = fam_reltn
          and ppr.person_reltn_cd = child_reltn and ppr.active_ind = 1
      join p 
      where ppr.related_person_id = p.person_id
      join pa 
      where p.person_id = pa.person_id 
         ;and pa.person_alias_type_cd = 7 ;6
         and pa.person_alias_type_cd = person_alias_type ;6
         and pa.active_ind = 1
         and pa.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
      detail
        cnt = cnt + 1
        stat = alterlist(baby->qual,cnt)
        baby->qual[cnt]->last_name = p.name_last
        baby->qual[cnt]->first_name = p.name_first
        baby->qual[cnt]->cmrn = pa.alias
      with nocounter 
      execute oencpm_msglog(build(cnt, " babies found.", char(0)))

      if (cnt>0)
        set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NK1,(cnt+1))
        for (x=1 to cnt)
          Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NK1 [x+1]->set_id = cnvtstring(x+1)
          Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NK1 [x+1]->contact_role->identifier = "FAM" 
          Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NK1 [x+1]->nk_name [1]->last_name = baby->qual[x]->last_name
          Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NK1 [x+1]->nk_name [1]->first_name = baby->qual[x]->first_name
          Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NK1 [x+1]->relationship->identifier = "CHILD"
          Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NK1 [x+1]->nk_identifiers [1]->pat_id =baby->qual[x]->cmrn
          Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NK1 [x+1]->nk_identifiers [1]->id_type = "BCCPI" ;6
          ;Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NK1 [x+1]->nk_identifiers [1]->id_type = "CPI"
        endfor
      endif
      
    endif ;;;;Split index for A31
  endif ;;;;Message trigger
endif  ;;;;Split Index >1