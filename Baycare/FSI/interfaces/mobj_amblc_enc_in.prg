/*
*  ---------------------------------------------------------------------------------------------
*  Cerner Script Name:  mobj_amblc_enc_in
*  Description:  Modify Object Script for Amb LabCorp Result Msgs Intbound 
*  Type:  Open Engine Modify Object Script
*  ---------------------------------------------------------------------------------------------
*  Author:  Cerner FSI
*  Domain:  All
* Create Date: July 2016
*  ---------------------------------------------------------------------------------------------
*
*  Mod#   Date	        Author                 Description & Requestor Information
 *
 *  1:    08/22/16	  H Kaczmarczyk    RFC # 13591 Result Modification w/ Orders outbound to LabCorp
*   2:   11/09/16      S Parimi                   RFC # 15087 Add MsgYear at the end LC number 
*   3:   01/10/18      S Parimi                   RFC 8051 Update PV1-3 with RFC for LabCorp created LC encounters.
*   4:   04/09/18      H Kaczmarczyk     RFC 10346 Coding to blank out Pt Address/Phone for LABCORP_AMB_UNMATCH
*   5:   06/17/19      H Kacz                     Added RLN alias for generic unmatched queue encounters
*/
;;;MRN Querying
DECLARE REC_CNT = i4
DECLARE PERS_ID = f8
DECLARE noenctr = vc

SET noenctr = "n"
SET DOB = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->date_of_birth
SET DOB_FORMAT = FORMAT(CNVTDATE2(DOB,"YYYYMMDD"), "YYYYMMDD;;d") 
SET MRN = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->pat_id
Set sex = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->sex 
If (sex in ("M", "m"))
  set sex_cd = 363.00
Elseif (sex in ("F", "f"))
  set sex_cd = 362.00
Elseif (sex in ("U", "u"))
  set sex_cd = 364.00
Else
  set sex_cd = 364.00
Endif


FREE SET person_recon
RECORD person_recon
 (
 1 who_qual [*]
 	2 alias = vc
 	2 pid = f8
 	2 dob = vc
                2 sex_cd = f8
  )
  
select distinct into "nl:"
from person_alias pa,
  person p
plan pa
where pa.alias = MRN
  and pa.alias_pool_cd = MRN_POOL
  and pa.active_ind = 1
  and pa.beg_effective_dt_tm < cnvtdatetime(curdate, curtime3) 
  and pa.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
join p
where pa.person_id = p.person_id
  and p.active_ind = 1
  and(format(p.abs_birth_dt_tm, "YYYYMMDD;;d") = DOB_FORMAT)
  and p.sex_cd = sex_cd
  and p.beg_effective_dt_tm < cnvtdatetime(curdate, curtime3) 
  and p.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
detail
  rec_cnt = rec_cnt + 1
  rec_sz = SIZE(person_recon->who_qual,5)
  if (rec_cnt > rec_sz)
    stat = alterlist (person_recon->who_qual,rec_sz + 1)
  endif;;;;;rec_sz
  person_recon->who_qual[rec_cnt]->alias = pa.alias
  person_recon->who_qual[rec_cnt]->pid = pa.person_id
  person_recon->who_qual[rec_cnt]->dob = format(p.abs_birth_dt_tm, "YYYYMMDD;;d")
  person_recon->who_qual[rec_cnt]->sex_cd = p.sex_cd
  PERS_ID = pa.person_id
with nocounter
;;;End MRN Querying

;;;FIN Querying
if (size(person_recon->who_qual,5)>0)
  Set rec_cnt = 0
  
  FREE SET encntr_recon
  RECORD encntr_recon
   (
   1 who_qual [*]
   	2 alias = vc
   	2 eid = f8
    )  
  
  Select distinct into "nl:"
  from encntr_alias ea,
    encounter e
  Plan ea
  where ea.alias = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->pat_id
    and ea.alias_pool_cd = FIN_POOL
    and ea.active_ind = 1
  join e where e.encntr_id = ea.encntr_id
    and e.person_id = person_recon->who_qual[1]->pid
  detail
    rec_cnt = rec_cnt + 1
    rec_sz = SIZE(encntr_recon->who_qual,5)
    if (rec_cnt > rec_sz)
      stat = alterlist (encntr_recon->who_qual,rec_sz + 1)
    endif;;;;;rec_sz
    encntr_recon->who_qual[rec_cnt]->alias = ea.alias
    encntr_recon->who_qual[rec_cnt]->eid = ea.encntr_id
  with nocounter
endif
;;;End FIN Querying

;;;Parsing out the year for the encounter creation
   if (size(oen_reply->CONTROL_GROUP [1]->MSH [1]->message_time_stamp, 5) > 0)
     set msg_year = substring(3,2,oen_reply->CONTROL_GROUP [1]->MSH [1]->message_time_stamp)
   endif

;;;Encounter Creation Section
IF  (SIZE(person_recon->who_qual,5) > 0)  ;;person matches
  set oen_reply->CONTROL_GROUP[1]->MSH[1]->sending_application = SEND_APP ;;matched person uses LABCORP_AMB in modobj
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->assign_fac_id = MAIN_MRN
  execute oencpm_msglog (BUILD ("found 1 match",char(0)))
  if (size(encntr_recon->who_qual,5)<1) ;; Encounter match fails
    declare noenctr = vc
    set noenctr = "y"

    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->account_stat = "D"
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->admit_dt_tm = 
            oen_reply->RES_ORU_GROUP [1]->OBR->spec_rec_dt_tm      
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->dschg_dt_tm =
            substring(1, 8, oen_reply->RES_ORU_GROUP [1]->OBR->spec_rec_dt_tm)
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->dschg_dt_tm =
             concat(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->dschg_dt_tm,"235959")
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->patient_class = "RLN"           ;cs 321 
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->patient_type = "RLN"              ;cs 71
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->pat_id =
         concat("LC",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [1]->pat_id, msg_year)
         ;concat("LC",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [1]->pat_id)
         ;concat("LC",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->PAT_ID, msg_year)
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_fac_id = UMPQ_FIN

   ;;;;;New code for facility;;;;;
   set fac_ind = 0

   select into "nl:"
   from   code_value_alias cva
   where  cva.alias = concat(lc_acct_nbr,"F")
   and    cva.contributor_source_cd = Con_Source
   and   cva.code_set = 220
   detail fac_ind = 1
   with   nocounter

   if (fac_ind = 1)
      Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit = lc_acct_nbr 
      Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->facility_id = concat(lc_acct_nbr,"F")
   else
      Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit = "REF"
      Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->facility_id = "REF"
      Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->building = "REF"

   endif
   ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;   

  endif

ELSE ; the person fails
  
    declare loc_alias = vc
    declare nopatient = vc
    set nopatient = "y"
    
    SET oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->pat_id = ""
;;;MOD004
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [1]->street = ""
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [1]->other_desig = ""
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [1]->city = ""
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [1]->state_prov = ""
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [1]->zip_code = ""
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ph_nbr_home [1]->phone_nbr = ""
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ph_nbr_home [1]->area_cd = ""
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ph_nbr_home [1]->phone_nbr_comp = ""

    Set oen_reply->CONTROL_GROUP[1]->MSH[1]->sending_application = UMPQ_APP
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->account_stat = "D"
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->admit_dt_tm = 
            oen_reply->RES_ORU_GROUP [1]->OBR->spec_rec_dt_tm      
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->dschg_dt_tm =
            substring(1, 8, oen_reply->RES_ORU_GROUP [1]->OBR->spec_rec_dt_tm)
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->dschg_dt_tm =
             concat(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->dschg_dt_tm,"235959")
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->patient_class = "RLN"     
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->patient_type = "RLN" 
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [1]->pat_id = 
        concat(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [1]->pat_id, msg_year)           
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->pat_id =
        concat("LC",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->PATIENT_ID_INT [1]->PAT_ID)
        ;concat("LC",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->PATIENT_ID_INT [1]->PAT_ID, msg_year)
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [1]->assign_fac_id = UMPQ_MRN
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_fac_id = UMPQ_FIN

   ;;;;;New code for facility;;;;;
   set fac_ind = 0

   select into "nl:"
   from   code_value_alias cva
   where  cva.alias = concat(lc_acct_nbr,"F")
   and    cva.contributor_source_cd = Con_Source
   and   cva.code_set = 220
   detail fac_ind = 1
   with   nocounter

   if (fac_ind = 1)
      Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit = lc_acct_nbr 
      Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->facility_id = concat(lc_acct_nbr,"F")
   else
      Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit = "REF"
      Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->facility_id = "REF"
      Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->building = "REF"
 
   endif
   ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;   

    execute oencpm_msglog (BUILD ("MRN mismatch",char(0))) 

ENDIF
;;;End Encounter Creation Section



;******************* GET_INBOUND_ALIAS ********************          
SUBROUTINE get_inbound_alias (code_value)
 declare alias = vc

 SELECT into "nl:"
        cva.alias
 FROM
        code_value_alias cva
 WHERE
        cva.code_value = code_value AND
        cva.code_value != 0.0 AND
        cva.contributor_source_cd = Con_Source
 DETAIL
        alias = trim(cva.alias)
 WITH
        nocounter

 call echo (build("INBOUND ALIAS ->", alias) )
 return (alias)

END ;get_inbound_alias