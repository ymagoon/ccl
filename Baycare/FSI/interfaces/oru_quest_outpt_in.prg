/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  oru_BMGQuest_in
 *  Description:  Mod object script for BMG Quest results inbound to Cerner
 *  Type:  Open Engine Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:  AM023455
 *  Domain:  B3299
 *  Creation Date:  06/03/13 08:37:14
 *  ---------------------------------------------------------------------------------------------
 *  MOD      DATE	 BY		             COMMENT
 * ----------------------------------------------------------------------------------------------
 *   001	7/30/2014    Hope Kaczmarczyk     Customized for BayCare
 *   002   8/15/2014    Hope Kaczmarczyk      Moved PID NTEs to OBX NTEs
 *   003   9/4/2014      Hope Kaczmarczyk       Added coding for Blank PID NTEs
 *   004   9/17/2014    Hope Kaczmarczyk      Commented out Prelim Changes
 *   005   12/08/2015  Hope Kaczmarczyk     Moved Viet Cao (Cerner) received d/t coding from m30
*    006   11/21/2016  Sailaja parimi                RFC 15124 Code updates from Cerner (Viet) with Quest Interface changes
*    007   07/25/2017  Sailaja Parimi               RFC 4663 Update code in MOVE OBX;3 VALUES 
*    008   01/10/2018  Sailaja Parimi                RFC 8051 Update PV1-3 with REF for Quest created encounters
*    009   04/09/2018  Hope Kaczmarczyk    RFC 10346 Coding to blank out Pt Address/Phone for QUEST_UNMATCH
*    010   06/17/2019  Hope Kaczmarczyk    Coding Change to handle multiple FIN tags (i.e., BMGFN abd BCFN)
 */

;010
Declare PID_18_assign_auth_FIN = VC

;******* RAM/See Note *******
declare see_comment_string = c50
;The message in this variable will appear as the result value (OBX;5)
;when Quest sends "RAM" (Read Always Message) or "See Note".
set see_comment_string = "See Result Comment"

;******* Performing Info ********

;This variable will determine how the Performing Site
;information will appear.
;1 = Performed At info appears with FIRST DTA (OBX)
;2 = Performed At info appears with LAST DTA (OBX)
;3 = Performed At info appears with ALL DTAs (OBXs)

set performing_info_ind = 1
execute oencpm_msglog build("PERF_IND= ", performing_info_ind , char(0))

set stat = logerror("STDCQMModObjIn", 3, build("*** Perform_Info_Ind=",performing_info_ind))
;subroutine declarations
declare logerror(logmnem, loglevel, errormsg) = i2

;CMRN Querying
DECLARE REC_CNT = i4

SET DOB = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->date_of_birth
SET DOB_FORMAT = FORMAT(CNVTDATE2(DOB,"YYYYMMDD"), "YYYYMMDD;;d") 
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

;010
if (size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_fac_id, 5) > 0)
  SET PID_18_assign_auth_FIN = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_fac_id
endif

;010 added this logic because the HL7 tag BCFN is different from the Display value, BayCare FIN
if (PID_18_assign_auth_FIN = "BCFN")
    set PID_18_assign_auth_FIN = "BayCare FIN" ; because display differs from alias tag 
endif

SET CMRN = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->pat_id
SET CMRN_POOL = uar_get_code_by("DISPLAY", 263, "BayCare CMRN")
SET FIN_POOL = uar_get_code_by("DISPLAY", 263, PID_18_assign_auth_FIN)
;;SET FIN_POOL = uar_get_code_by("DISPLAY", 263, "BMGFN")
;;Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID[1]->patient_account_nbr->assign_fac_id = "BMGFN"

	execute oencpm_msglog build("FIN_POOL Val:", FIN_POOL , char(0))
	execute oencpm_msglog build("CMRN_POOL Val:", CMRN_POOL , char(0))

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
where pa.alias = CMRN
  and pa.alias_pool_cd = CMRN_POOL
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
with nocounter
;End CMRN Querying

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


if (SIZE(person_recon->who_qual,5) > 0)
  Set oen_reply->CONTROL_GROUP[1]->MSH[1]->sending_application = "BMGQUEST"
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->assign_fac_id = "BayCareCMRN"
  ;execute oencpm_msglog (BUILD ("found 1 match",char(0)))

; just encounter failed
  IF (size(encntr_recon->who_qual,5)<1)
;**** when creating encounters, use OBR-14 for admit d/t and dschg date, and "2359" for dischg time
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->account_stat = "D"
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->admit_dt_tm = 
            oen_reply->RES_ORU_GROUP [1]->OBR->spec_rec_dt_tm      
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->dschg_dt_tm =
            substring(1, 8, oen_reply->RES_ORU_GROUP [1]->OBR->spec_rec_dt_tm)
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->dschg_dt_tm =
             concat(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->dschg_dt_tm,"2359")

    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->patient_class = "RLN"    ;CS321
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->patient_type = "RLN"      ;CS71
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->pat_id =
      concat("Q",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->PATIENT_ID_INT [1]->PAT_ID)
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_fac_id = "QUEST"
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit = "REF"
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->facility_id = "REF"
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->building = "REF"
  ENDIF
else  

; person and encounter failed
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->pat_id = "" 
  ;MOD09
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [1]->street = ""
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [1]->other_desig = ""
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [1]->city = ""
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [1]->state_prov = ""
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [1]->zip_code = ""
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ph_nbr_home [1]->area_cd = ""
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ph_nbr_home [1]->phone_nbr_comp = ""
  Set oen_reply->CONTROL_GROUP[1]->MSH[1]->sending_application = "QUEST_UNMATCH"
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->account_stat = "D"
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->admit_dt_tm = 
            oen_reply->RES_ORU_GROUP [1]->OBR->spec_rec_dt_tm      
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->dschg_dt_tm =
            substring(1, 8, oen_reply->RES_ORU_GROUP [1]->OBR->spec_rec_dt_tm)
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->dschg_dt_tm =
             concat(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->dschg_dt_tm,"2359")
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->patient_class = "RLN"
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->patient_type = "RLN"  
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->pat_id =
    concat("Q",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->PATIENT_ID_INT [1]->PAT_ID)
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [1]->assign_fac_id = "QUEST_MRN"
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_fac_id = "QUEST"
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit = "REF"
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->facility_id = "REF"
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->building = "REF"
  execute oencpm_msglog (BUILD ("MRN mismatch",char(0))) 
endif

set stat = logerror("STDCQMModObjIn", 3, "Start of STD_QUEST_IP_MOD_OBJ_IN script.") 
if(oen_reply->CONTROL_GROUP[1]->MSH[1]->message_type->messg_type = "ORU")

    ;**** ORU PROCESSING *****
;Identify Report NTEs following PID segment
   Declare ptnte_size = i4
   Declare p = i4
   Set ptnte_size= size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NTE, 5)

  
  ;  START WHILE LOOP FOR ORU
    
  ; ORC/OBR Segments
  declare oru_sz = i4
  declare oru_x = i4
  Set oru_sz = size(oen_reply->RES_ORU_GROUP, 5)
  Set oru_x = 1
  declare spec_type_cd = f8
    
  execute oencpm_msglog build("ORU SIZE = ", oru_sz, char(0))

  for (oru_x = 1 to oru_sz)
    WHILE(oru_x <= oru_sz)
      ;Set ord_id = cnvtreal(oen_reply->RES_ORU_GROUP [oru_x]->OBR->placer_field1 [1]->value)
      Set stat = alterlist(oen_reply->RES_ORU_GROUP [oru_x]->ORC, 1)
      ;set stat = moverec(oen_reply->RES_ORU_GROUP [1]->ORC, oen_reply->RES_ORU_GROUP [oru_x]->ORC)

      Set oen_reply->RES_ORU_GROUP [oru_x]->ORC->placer_group_nbr->id = 
                                                                    oen_reply->RES_ORU_GROUP [oru_x]->OBR->placer_field2

      Set oen_reply->RES_ORU_GROUP [oru_x]->OBR->univ_service_id->identifier =
        oen_reply->RES_ORU_GROUP [oru_x]->OBR->univ_service_id->alt_identifier 
      
      Set oen_reply->RES_ORU_GROUP [oru_x]->OBR->univ_service_id->text =
        oen_reply->RES_ORU_GROUP [oru_x]->OBR->univ_service_id->alt_text             
      
      Set oen_reply->RES_ORU_GROUP [oru_x]->OBR->univ_service_id->alt_identifier = ""
      Set oen_reply->RES_ORU_GROUP [oru_x]->OBR->univ_service_id->alt_text = ""

      Set oen_reply->RES_ORU_GROUP [oru_x]->OBR->ord_provider->assign_auth_id = ""
      Set oen_reply->RES_ORU_GROUP [oru_x]->OBR->ord_provider->id_type = ""

      IF (size(oen_reply->RES_ORU_GROUP [oru_x]->OBR->placer_field1,5)>0)
        Set oen_reply->RES_ORU_GROUP [oru_x]->OBR->placer_ord_nbr->id = 
          oen_reply->RES_ORU_GROUP [oru_x]->OBR->placer_field1 [1]->value
        Set oen_reply->RES_ORU_GROUP [oru_x]->OBR->filler_ord_nbr->id = 
          oen_reply->RES_ORU_GROUP [oru_x]->OBR->placer_field1 [1]->value
      ENDIF
     
      ;Set oen_reply->RES_ORU_GROUP [oru_x]->OBR->filler_field2 = ""



      ;parse OBR;14 (Specimen Received Dt/tm) and append to beginning of NTE segments for each OBX
      if (size(oen_reply->RES_ORU_GROUP [oru_x]->OBR->spec_rec_dt_tm, 5) >0)
       set spec_rec_dt = oen_reply->RES_ORU_GROUP [oru_x]->OBR->spec_rec_dt_tm
       set spec_yr = substring(1, 4, spec_rec_dt)
       set spec_mo = substring(5, 2, spec_rec_dt)
       set spec_day = substring(7, 2, spec_rec_dt)
       set spec_hr = substring(9, 2, spec_rec_dt)
       set spec_min = substring(11, 2, spec_rec_dt)
       set spec_sec = substring(13, 2, spec_rec_dt)
      endif

      ;parse OBR;21 (filler field2) which contains performing location info
      ;and append to NTE segments for each OBX
      
      free record perform
      record perform
      (
        1 info[*]
          2 value = c300
      )
      set fieldcnt = 0
      set sos = 1
      set eos = 1
      set msgsize = size(trim(oen_reply->RES_ORU_GROUP[oru_x]->OBR->filler_field2))
      while (eos != 0)
        set eos = findstring("^", oen_reply->RES_ORU_GROUP[oru_x]->OBR->filler_field2, sos)
        set fieldcnt = fieldcnt + 1
        set stat = alterlist(perform->info, fieldcnt)
        if (eos)
          set perform->info[fieldcnt]->value = substring(sos, eos-sos, oen_reply->RES_ORU_GROUP[oru_x]->OBR->filler_field2)
          set sos = eos + 1
        elseif( (eos=0) and (msgsize > sos) )
          set perform->info[fieldcnt]->value = substring(sos, msgsize-sos+1, oen_reply->RES_ORU_GROUP[oru_x]->OBR->filler_field2)
        endif
      endwhile      
      set y = 0
      Set oen_reply->RES_ORU_GROUP[oru_x]->OBR->filler_field2 = 
                                     oen_reply->RES_ORU_GROUP [oru_x]->OBR->placer_field2
;        substring(1,
;        size(oen_reply->RES_ORU_GROUP [oru_x]->OBR->placer_field2)-2,oen_reply->RES_ORU_GROUP [oru_x]->OBR->placer_field2)
      
    ;populate obr;27.4 to allow results to populate the inbox
       Set oen_reply->RES_ORU_GROUP [oru_x]->OBR->quantity_timing->start_dt_tm = 
        oen_reply->RES_ORU_GROUP [oru_x]->OBR->observation_dt_tm

      for(y=1 to size(oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP,5))

        ;****MOVE OBX:3 VALUES****
        Set temp1 = oen_reply->RES_ORU_GROUP [oru_x]->OBX_GROUP [y]->OBX->observation_id->identifier
        Set temp2 = oen_reply->RES_ORU_GROUP [oru_x]->OBX_GROUP [y]->OBX->observation_id->text
        Set temp3 = oen_reply->RES_ORU_GROUP [oru_x]->OBX_GROUP [y]->OBX->observation_id->coding_system 
        Set oen_reply->RES_ORU_GROUP [oru_x]->OBX_GROUP [y]->OBX->observation_id->identifier = 
          oen_reply->RES_ORU_GROUP [oru_x]->OBX_GROUP [y]->OBX->observation_id->alt_identifier 
        Set oen_reply->RES_ORU_GROUP [oru_x]->OBX_GROUP [y]->OBX->observation_id->text = 
          oen_reply->RES_ORU_GROUP [oru_x]->OBX_GROUP [y]->OBX->observation_id->alt_text 
        Set oen_reply->RES_ORU_GROUP [oru_x]->OBX_GROUP [y]->OBX->observation_id->coding_system = 
         oen_reply->RES_ORU_GROUP [oru_x]->OBX_GROUP [y]->OBX->observation_id->alt_coding_system
        Set oen_reply->RES_ORU_GROUP [oru_x]->OBX_GROUP [y]->OBX->observation_id->alt_identifier = temp1
        Set oen_reply->RES_ORU_GROUP [oru_x]->OBX_GROUP [y]->OBX->observation_id->alt_text = temp2 
        Set oen_reply->RES_ORU_GROUP [oru_x]->OBX_GROUP [y]->OBX->observation_id->alt_coding_system = temp3
        declare res_size = i4
        set res_size = size(oen_reply->RES_ORU_GROUP [oru_x]->OBX_GROUP [y]->OBX->observation_value [1]->value_1,1)       
        execute oencpm_msglog(build("RESULT SIZE=", res_size,char(0)))
            
        Set oen_reply->RES_ORU_GROUP [oru_x]->OBX_GROUP [y]->OBX->value_type = "ST"    
                   
        ;If no value in OBX;5, then OBX won't post. But result value may be in
        ;comment, so must put something in OBX;5.
        ;Blank OBX;5 means INTERPRETIVE RESULTS from TOPLAB
        ;"RAM" message (Read Always Message) from Quest means result in NTE segment
        if (size(oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[y]->OBX->observation_value,5) = 0)
          set stat = alterlist(oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[y]->OBX->observation_value,1)
          set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[y]->OBX->observation_value->value_1 = ""
        endif
        set z=1
        for (z=1 to size(oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[y]->OBX->observation_value, 5))
          ;"RAM" ("READ ALWAYS MESSAGE")
          ;"SEE NOTE"
          ;blank OBX;5 value
          ;These indicate to simply read result comment
          if ( (oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[y]->OBX->observation_value[z]->value_1 = "RAM") or
            (oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[y]->OBX->observation_value[z]->value_1 = "SEE NOTE") or
            (oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[y]->OBX->observation_value[z]->value_1 = "") )
            set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[y]->OBX->observation_value[z]->value_1 = 
              trim(see_comment_string)
          endif
        endfor ;z
      
            if (performing_info_ind = 3)
          set temp = ""
          ;;Commenting out NTE creation
          set perform_lab_size=size(perform->info,5)
      
          if(perform_lab_size >1)
            set ntecnt = 0
            set ntecnt = size(oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[y]->NTE,5)
            set stat = alterlist(oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[y]-> NTE,(7+ntecnt))
            ;set blank space line
            set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[y]->NTE[1 + ntecnt]->comment[1]->comment =
              concat("     ",char(0))
            ;set 'lab performed by' line
            set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[y]->NTE[2 + ntecnt]->comment[1]->comment =
              "Lab test performed by:"
            ;set lab name line
            set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[y]->NTE[3 + ntecnt]->comment[1]->comment =
              trim(perform->info[2]->value)
            ;set lab address line
            set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[y]->NTE[4 + ntecnt]->comment[1]->comment =
              trim(perform->info[3]->value)
            ;set lab city, state, zip line
             set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[y]->NTE[5 + ntecnt]->comment[1]->comment =
              concat(trim(perform->info[4]->value),",", char(32),trim(perform->info[5]->value),char(32),
              trim(perform->info[6]->value))
            ;set lab director's name
            If (perform_lab_size > 6)
                set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[y]->NTE[6 + ntecnt]->comment[1]->comment =
                       trim(perform->info[7]->value)
            Endif
          ;create blank line for chart formatting
          set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[y]->NTE[7 + ntecnt]->comment[1]->comment = 
            concat("     ",char(0))
      
           If (size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NTE, 5) > 0) 
               Set p=1
               ;set 'comment' line for PID NTEs
               Set stat = alterlist(oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[y]->NTE,(8+ntecnt))
               Set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[y]->NTE[8 + ntecnt]->comment[1]->comment =
               "Quest Comments:"

              For (p=1 to ptnte_size) 
                 Set stat = alterlist(oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[y]->NTE,(9+ntecnt))
                 if (size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NTE [p]->comment [1]->comment,4) = 0)
                   ;set blank space line
                    Set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[y]->NTE[9+ntecnt]->comment[1]->comment = 
                    concat("     ",char(0))
                 else
                    Set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[y]->NTE[9+ntecnt]->comment[1]->comment =  
                    oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NTE [p]->comment [1]->comment
                  endif
                 Set ntecnt = ntecnt+1
              Endfor
           Endif
           
        endif    

          set z=0
          for (z=1 to size(oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[y]->NTE,5))
            set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[y]->NTE[z]->set_id = cnvtstring(z)
            set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[y]->NTE[z]->src_of_comment = "RC"
          endfor ; 2nd z
        endif
      endfor ;y

      set perform_lab_size=size(perform->info,5)
      execute oencpm_msglog build("PERF_COUNT = ", perform_lab_size, char(0))

      if(perform_lab_size>1)
        if (performing_info_ind = 1)
          set temp = ""
          ;;Commenting out NTE creation

         if (size(oen_reply->RES_ORU_GROUP [oru_x]->OBR->spec_rec_dt_tm, 5) >0)
          set ntecnt = 0
          set ntecnt = size(oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[1]->NTE,5)
          set stat = alterlist(oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[1]->NTE,(2+ntecnt))
          ;set blank space line
          set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[1]->NTE[1 + ntecnt]->comment[1]->comment = 
            concat("      ",char(0))
            ;set specimen received_dt_tm
            set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[1]->NTE[2 + ntecnt]->comment[1]->comment =
               concat("Specimen Received d/t:  ", 
                             spec_mo, "/", spec_day, "/", spec_yr, 
                             " ", spec_hr, ":", spec_min, ":", spec_sec)
          endif
      
          set ntecnt = 0
          set ntecnt = size(oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[1]->NTE,5)
          set stat = alterlist(oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[1]->NTE,(7+ntecnt))
          ;set blank space line
          set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[1]->NTE[1 + ntecnt]->comment[1]->comment = 
            concat("      ",char(0))
          ;set 'lab performed by' line
          set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[1]->NTE[2 + ntecnt]->comment[1]->comment =
            "Lab test performed by:"
          ;set lab name line
          set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[1]->NTE[3 + ntecnt]->comment[1]->comment =
            trim(perform->info[2]->value)
          ;set lab address line
          set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[1]->NTE[4 + ntecnt]->comment[1]->comment =
            trim(perform->info[3]->value)
          ;set lab city, state, zip line_r
           set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[1]->NTE[5 + ntecnt]->comment[1]->comment =
            concat(trim(perform->info[4]->value),",", char(32),trim(perform->info[5]->value),char(32),
            trim(perform->info[6]->value))
          ;set lab director's name
            If (perform_lab_size > 6)
               set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[1]->NTE[6 + ntecnt]->comment[1]->comment =
               trim(perform->info[7]->value)
            Endif
          ;create blank line for chart formatting
          set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[1]->NTE[7 + ntecnt]->comment[1]->comment = 
            concat("     ",char(0))
        
          If (size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NTE, 5) > 0)
             Set p=1
            ;set 'comment' line for PID NTEs
             Set stat = alterlist(oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[1]->NTE,(8+ntecnt))
             Set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[1]->NTE[8 + ntecnt]->comment[1]->comment =
              "Quest Comments:"

            For (p=1 to ptnte_size)
                Set stat = alterlist(oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[1]->NTE,(9+ntecnt))
                 if (size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NTE [p]->comment [1]->comment,4) = 0)
                   ;set blank space line
                    Set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[1]->NTE[9+ntecnt]->comment[1]->comment = 
                    concat("      ",char(0))
                 else
                    Set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[1]->NTE[9+ntecnt]->comment[1]->comment =  
                    oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NTE [p]->comment [1]->comment
                  endif
                Set ntecnt = ntecnt+1
            Endfor
         Endif

      endif
      elseif (performing_info_ind = 2)
        set temp = ""
        set totalobx = size(oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP,5)
        set ntecnt = 0
        set ntecnt = size(oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[totalobx]->NTE,5)
        set stat = alterlist(oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[totalobx]->NTE,(7+ntecnt))
        ;set blank space line
        set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[totalobx]->NTE[1 + ntecnt]->comment[1]->comment =
          concat("      ",char(0))
        ;set 'lab performed by' line
        set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[totalobx]->NTE[2 + ntecnt]->comment[1]->comment =
          "Lab test performed by:"
        ;set lab name line
        set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[totalobx]->NTE[3 + ntecnt]->comment[1]->comment =
          trim(perform->info[2]->value)
        ;set lab address line
        set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[totalobx]->NTE[4 + ntecnt]->comment[1]->comment =
          trim(perform->info[3]->value)
        ;set lab city, state, zip line
        set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[totalobx]->NTE[5 + ntecnt]->comment[1]->comment =
          concat(trim(perform->info[4]->value),",", char(32),trim(perform->info[5]->value),char(32),
          trim(perform->info[6]->value))
        ;set lab director's name
            If (perform_lab_size > 6)
               set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[totalobx]->NTE[6 + ntecnt]->comment[1]->comment =
                trim(perform->info[7]->value)
            Endif
          ;create blank line for chart formatting
          set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[totalobx]->NTE[7 + ntecnt]->comment[1]->comment = 
            concat("     ",char(0))

        If (size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NTE, 5) > 0)
             Set p=1
            ;set 'comment' line for PID NTEs
             Set stat = alterlist(oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[totalobx]->NTE,(8+ntecnt))
             Set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[totalobx]->NTE[8 + ntecnt]->comment[1]->comment =
              "Quest Comments:"

           For (p=1 to ptnte_size)
              Set stat = alterlist(oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[totalobx]->NTE,(9+ntecnt))
                  if (size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NTE [p]->comment [1]->comment,4) = 0)
                   ;set blank space line
                    Set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[totalobx]->NTE[9+ntecnt]->comment[1]->comment = 
                    concat("     ",char(0))
                 else
                    Set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[totalobx]->NTE[9+ntecnt]->comment[1]->comment = 
                    oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NTE [p]->comment [1]->comment
                  endif
              Set ntecnt = ntecnt+1
           Endfor
        Endif       
 
      else
        set stat = logerror("STDCQMModObjIn",2,
          "Error - PERFORMING_INFO_IND not equal to 1, 2, or 3.")
        ;go to SCRIPTERROR
      endif     
     
      for (o=1 to size(oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP,5))
        IF (size(oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[o]->NTE,5)>0)
          for (n=1 to size(oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[o]->NTE,5))
            set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[o]->NTE[n]->set_id = cnvtstring(n)
            set oen_reply->RES_ORU_GROUP[oru_x]->OBX_GROUP[o]->NTE[n]->src_of_comment = "RC"
          endfor ;n
        ENDIF
      endfor ;o
    
      Set oru_x = oru_x + 1
      execute oencpm_msglog build("ORU COUNT = ", oru_x, char(0))

    ENDWHILE  ;oru loop    
  endfor ;(oru_x)

endif ;ORU or ORM
#EXITSCRIPT
;script success
set oenstatus->status = 1

#SCRIPTERROR

set stat = logerror("STDCQMModObjIn", 3, "End of STD_QUEST_IP_MOD_OBJ_IN script.")


;** SUBROUTINE logerror **
subroutine logerror(logmnem, loglevel, errormsg)

  declare scp_id = i4
  declare trace_level = i4
  declare mnemonic = c32

  if (validate(oen_log->LogMsg, "x") = "x")
    ;log to call echo

    call echo(build(errormsg, char(0)))
  else
    ;log to MsgView
    if (logmnem > " ")
      set mnemonic = logmnem
    else
      set mnemonic = "OENScript"
    endif
    if (not(loglevel in (0,1,2,3,4)))
      set loglevel = 4
    endif

    set scp_id = 0
    set trace_level = 0

    if (cnvtupper(CURPRCNAME) = "SRV*" )
      set scp_id = mod(cnvtint(substring(4,4,CURPRCNAME)), 1024)

      select into "nl:"
        pe.value
      from oen_procinfo pi,
           oen_personality pe
      plan pi where pi.scp_eid = scp_id
      join pe where pe.interfaceid = pi.interfaceid
                and pe.name = "TRACE_LEVEL"
      detail
        trace_level = cnvtint(substring(1,1,pe.value))
      with nocounter

      if (curqual = 0)
        set trace_level = 4
      endif
    else
      set trace_level = 4
    endif

    if ( trace_level >= loglevel )
      call uar_sysevent(oen_log->hsys,
      loglevel,
      build(mnemonic,char(0)),
      build(errormsg,char(0)))
    endif
  endif

  return(1)
end  ;logerr