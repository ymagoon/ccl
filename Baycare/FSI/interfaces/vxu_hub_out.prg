/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  VXU_HUB_OUT
 *  Description:  VXU_HUB_OUT
 *  Type:  Open Engine Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:  CERNER
 *  Domain:  P645
 *  Creation Date:  6/26/2017 11:43:27 AM
 *  ---------------------------------------------------------------------------------------------
 */
/*
*  ---------------------------------------------------------------------------------------------
*  Script Name:  VXU_HUB_OUT
*  Description:  Modify Object script for 2.5.1 VXU immunization outbound
*  Type:  Open Engine Modify Object Script
*  ---------------------------------------------------------------------------------------------
*  Author:  SS019580
*  Domain:  ALL
*  Creation Date:  2/24/2015
*  ---------------------------------------------------------------------------------------------
*  Mod    	 Date        Engineer   Comment                             
*  -------   --------    --------- 	----------------------------------- 
*  000       02/24/2015	 ss019580   Initial
*  001       07-11-2016  sd5836     CAMC_WV
*  002       04-27-2017  sd5836     CAMC_WV
*  003       01-03-2019      CJM       Changing the Pid 3.5 check from Historical MRN to CMRN
*/

; Declared Subroutines

declare get_double_value(double_meaning = vc) = vc

; Custom Coding

;Filter out un-aliased locations

declare location_prefix = vc
declare er_prefix = vc

set location_prefix = 
  substring(1,3, oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->VISIT_GROUP [1]->PV1->assigned_pat_loc->facility_id->name_id )

set er_prefix = 
  substring(1,3,oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->VISIT_GROUP [1]->PV1->assigned_pat_loc->nurse_unit)

if (location_prefix = "CD:" and er_prefix = "CD:")
  execute oencpm_msglog(build2("------>admin location not valid - so skipped CD: "
    ,oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->VISIT_GROUP [1]->PV1->assigned_pat_loc->facility_id->name_id
    ," <------"
    ,char(0)))
    set oenstatus->ignore = 1
    set oenstatus->ignore_text = "SKIPPED: LOC AND ER PREFIX IS CD:"
    go to end_of_script
endif

/*;Fix issue with RXA:11-4
if (trim(oen_reply->RXA_GROUP [1]->RXA->administered_at_location->facility->name_id,3) = "")
  set oen_reply->RXA_GROUP [1]->RXA->administered_at_location->facility->name_id =   
    oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->VISIT_GROUP [1]->PV1->assigned_pat_loc->facility_id->name_id 
  execute oencpm_msglog(build2("------>We have set admin loc to PV1 value: "
    ,oen_reply->RXA_GROUP [1]->RXA->administered_at_location->facility->name_id
    ," <------"
    ,char(0)))
endif */


declare PV1_3_4 = vc
declare PV1_3_7 = vc
declare PV1_3_1 = vc

if (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->VISIT_GROUP [1]->PV1->assigned_pat_loc->facility_id->name_id != "")
set PV1_3_4 = 
oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->VISIT_GROUP [1]->PV1->assigned_pat_loc->facility_id->name_id 
endif

if (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->VISIT_GROUP [1]->PV1->assigned_pat_loc->building != "")
set PV1_3_7 = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->VISIT_GROUP [1]->PV1->assigned_pat_loc->building 
endif

if (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->VISIT_GROUP [1]->PV1->assigned_pat_loc->nurse_unit != "")
set PV1_3_1 = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->VISIT_GROUP [1]->PV1->assigned_pat_loc->nurse_unit 
endif

execute oencpm_msglog(build("PV1 3.4 = ",PV1_3_4,char(0)))
execute oencpm_msglog(build("PV1 3.7 = ",PV1_3_7,char(0)))
;execute oencpm_msglog(build("PV1 3.1 = ",PV1_3_1,char(0)))

if (PV1_3_4 != "") 
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = PV1_3_4
endif

if (PV1_3_7 != "") 
Set oen_reply->RXA_GROUP [1]->RXA->administered_at_location->facility->name_id = PV1_3_7
endif

; MSH

;MSH:3.1-3
set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_application->name_id = "BAYC_FL"
set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_application->univ_id = ""
set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_application->univ_id_type = ""
  
;MSH:4
set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->univ_id_type      = ""

if (oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = "HKT55060")
set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->univ_id = "BayCare Health System"
endif
if (oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = "CLX43486")
set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->univ_id = "SunCoast Medical Clinic"
endif

if (oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = "KYG38940")
set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->univ_id = "Baycare Medical Group"
endif

if (oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = "MHW38320")
set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->univ_id = "Baycare Urgent Care"
endif

if (oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = "SJCO01")
set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->univ_id = "SJCC Mobile Clinic"
endif

IF (oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id not in  ("SJCO01",
"MHW38320", "KYG38940", "CLX43486", "HKT55060"))
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = "HKT55060"
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->univ_id = "BayCare Health System" 
ENDIF

;MSH:5
set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id      = ""
set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->univ_id      = ""
set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->univ_id_type = ""

;MSH:6
set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_facility->name_id         = ""
set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_facility->univ_id         = ""
set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_facility->univ_id_type    = ""

;MSH:8
;;Set oen_reply->CONTROL_GROUP [1]->MSH [1]->security = concat("CAMCPHYSICIANSHL7","^","AJg3OLynvm")

; PD1

;Add consent scripting here if needed

; modify MSH



; ; PID

declare pid_size = i4
declare p = i4

set pid_size = size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->patient_id_int, 5)
  set p = 1
  for (p = 1 to pid_size)

;003 CJM changing the historical check on the pid 3.5 from Historical CMRN to Community Medical Record Number
IF (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->patient_id_int [p]->id_type = "Community Medical Record Number") ;BayCare CMRN
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->patient_id_int [p]->id_type = ""
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->patient_id_int [p]->id_type = "MR"
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->patient_id_int [p]->assign_auth->name_id = ""
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->patient_id_int [p]->assign_auth->univ_id = ""
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->patient_id_int [p]->assign_auth->univ_id_type = "" 
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->patient_id_int [p]->assign_fac_id->name_id = ""
Endif
Endfor

;Add baby name scripting if needed


; PID:3

declare pid_3_att_x 	= i4 with noconstant(1)
declare pid_3_att_sz 	= i4 with noconstant(0)

set pid_3_att_sz = size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->patient_id_int,5)

while(pid_3_att_x <= pid_3_att_sz)

  execute oencpm_msglog(build2(
    "------> type_pat_id: "
    , oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->patient_id_int [pid_3_att_x]->id_type
    , char(0)))

  ;remove any identifiers that aren't alias_id_type
  if(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->patient_id_int [pid_3_att_x]->id_type not in ("MR"))
    set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->patient_id_int,pid_3_att_sz - 1, pid_3_att_x -1)
    set pid_3_att_x = pid_3_att_x -1
    set pid_3_att_sz = size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->patient_id_int,5)
  endif
  
 set pid_3_att_x = pid_3_att_x + 1;
endwhile

;filter out OIDs
for (x = 1 to size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->patient_id_int,5))
  ;filter out OIDs
  set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->patient_id_int [x]->assign_auth->name_id        = ""
  set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->patient_id_int [x]->assign_auth->univ_id        = ""
  set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->patient_id_int [x]->assign_auth->univ_id_type   = ""
  set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->patient_id_int [x]->assign_fac_id->name_id      = ""
  set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->patient_id_int [x]->assign_fac_id->univ_id      = ""
  set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->patient_id_int [x]->assign_fac_id->univ_id_type = ""
endfor

; PID:5

/*declare pid_5_att_x 	= i4 with noconstant(1)
declare pid_3_att_sz 	= i4 with noconstant(0)

set pid_5_att_sz = SIZE(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->patient_name ,5)

;Remove any names that aren't alias_name_type
if(pid_5_att_sz > 1)
  Set pid_5_att_x = 1
  while(pid_5_att_x <= pid_5_att_sz)
    if(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->patient_name [pid_5_att_x]->name_type_cd not in ("L"))
      Set STAT = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->patient_name, pid_5_att_sz-1, pid_5_att_x - 1)
      Set pid_5_att_sz = pid_5_att_sz - 1
    else
      Set pid_5_att_x = pid_5_att_x + 1
    endif
  endwhile
endif */

; PID:6

;set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->mothers_maiden_name, 0)

; PID:11

declare pid_11_att_x = i4 with noconstant(1)
declare pid_11_att_sz = i4 with noconstant(0)

set pid_11_att_sz = size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address,5)

while(pid_11_att_x <= pid_11_att_sz)
  if(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [pid_11_att_x]->types not in ("H"))
    set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address, pid_11_att_sz-1, pid_11_att_x - 1)
    set pid_11_att_x = pid_11_att_x - 1
    set pid_11_att_sz = size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address,5)
  endif
  set pid_11_att_x = pid_11_att_x + 1
endwhile

set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address, 1)

; PID:13

declare pid_13_att_x = i4 with noconstant(1)
declare pid_13_att_sz = i4 with noconstant(0)

set pid_13_att_sz = SIZE(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->ph_nbr_home ,5)

while(pid_13_att_x <= pid_13_att_sz)
  if(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->ph_nbr_home [pid_13_att_x]->equip_type_cd not in ("PRN"))
  ;;if(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->ph_nbr_home [pid_13_att_x]->equip_type_cd not in ("PH"))
    Set STAT = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->ph_nbr_home, pid_13_att_sz-1, pid_13_att_x - 1)
    Set pid_13_att_sz = pid_13_att_sz - 1
  else
    Set pid_13_att_x = pid_13_att_x + 1
  endif
endwhile

; PID:15

Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->language_patient->alt_identifier = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->language_patient->alt_text = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->language_patient->alt_coding_system = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->language_patient->coding_system_version = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->language_patient->alt_coding_system_ver = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->language_patient->original_text = ""

; PID:16

Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->marital_status->alt_identifier = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->marital_status->alt_text = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->marital_status->alt_coding_system = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->marital_status->coding_system_version = "" 
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->marital_status->alt_coding_system_ver = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->marital_status->original_text = ""

; PID:17

Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->religion->alt_identifier = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->religion->alt_text = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->religion->alt_coding_system = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->religion->coding_system_version = "" 
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->religion->alt_coding_system_ver = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->religion->original_text = ""

; PID:18

set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->patient_account_nbr->assign_auth->name_id = ""
set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->patient_account_nbr->assign_auth->univ_id = ""
set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->patient_account_nbr->assign_auth->univ_id_type = ""

; PID:22

Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->ethnic_grp [1]->alt_identifier = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->ethnic_grp [1]->alt_text = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->ethnic_grp [1]->alt_coding_system = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->ethnic_grp [1]->coding_system_version = "" 
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->ethnic_grp [1]->alt_coding_system_ver = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->ethnic_grp [1]->original_text = ""

;PID 24, PID 25 Birth Order
if (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->multiple_birth_ind != "Y")
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID->birth_order = ""
endif

; modify PD1

; PD1:3

if(size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PD1 [1]->patient_primary_facility, 5) > 0)
 set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PD1 [1]->patient_primary_facility,0)
endif 


; PD1:4

if(size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PD1 [1]->Prim_Care_Prov, 5) > 0)
 set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PD1 [1]->Prim_Care_Prov,0)
endif 

  
; modify NK1
;removed by default


; modify RXA_GROUP
for (rxaGroupX = 1 to size(oen_reply->RXA_GROUP, 5))
    ; modify ORC
  
    ; ORC:2 - 11
  
  ;ORC:2
  set stat = alterlist(oen_reply->RXA_GROUP [rxaGroupX]->ORC->placer_ord_nbr,0) 
  ;ORC:3
  set oen_reply->RXA_GROUP [rxaGroupX]->ORC->filler_ord_nbr [1]->univ_id = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->ORC->filler_ord_nbr [1]->univ_id_type = ""
  ;ORC:4
  set oen_reply->RXA_GROUP [rxaGroupX]->ORC->placer_group_nbr = ""
  ;ORC:5
  set oen_reply->RXA_GROUP [rxaGroupX]->ORC->order_stat = ""
  ;ORC:6
  set oen_reply->RXA_GROUP [rxaGroupX]->ORC->resp_flag = ""
  ;ORC:7
  set stat = alterlist(oen_reply->RXA_GROUP [rxaGroupX]->ORC->order_quant_timing,0)
  ;ORC:8
  set stat = alterlist(oen_reply->RXA_GROUP [rxaGroupX]->ORC->parent,0)
  ;ORC:9
  Set oen_reply->RXA_GROUP [rxaGroupX]->ORC->trans_dt_tm = ""
  ;ORC:10
  set stat = alterlist(oen_reply->RXA_GROUP [rxaGroupX]->ORC->entered_by,0)
  ;ORC:11
  set stat = alterlist(oen_reply->RXA_GROUP [rxaGroupX]->ORC->verified_by,0)
  
    ; ORC:12
  
  set att_sz = size(oen_reply->RXA_GROUP [rxaGroupX]->ORC->ord_provider,5)
   
  set att_x = 1
  while(att_x <= att_sz)
     if(oen_reply->RXA_GROUP [rxaGroupX]->ORC->ord_provider [att_x]->id_type not in ("NPI"))
         set stat = alterlist(oen_reply->RXA_GROUP [rxaGroupX]->ORC->ord_provider,att_sz - 1, att_x -1)
         set att_x = att_x -1
         set att_sz = size(oen_reply->RXA_GROUP [rxaGroupX]->ORC->ord_provider,5)
     endif
     set att_x = att_x + 1;
  endwhile
  
    ; ORC:13 - 31
  
  ;ORC:13
  set oen_reply->RXA_GROUP [rxaGroupX]->ORC->enterers_loc = ""
  ;ORC:14
  set stat = alterlist(oen_reply->RXA_GROUP [rxaGroupX]->ORC->callbk_ph_nbr,0)
  ;ORC:15
  set oen_reply->RXA_GROUP [rxaGroupX]->ORC->order_eff_dt_tm = ""
  ;ORC:16
  set oen_reply->RXA_GROUP [rxaGroupX]->ORC->ord_ctrl_rsn_cd = ""
  ;ORC:17
  set oen_reply->RXA_GROUP [rxaGroupX]->ORC->entering_org = ""
  ;ORC:18
  set oen_reply->RXA_GROUP [rxaGroupX]->ORC->entering_dev = ""
  ;ORC:19
  set stat = alterlist(oen_reply->RXA_GROUP [rxaGroupX]->ORC->action_by,0)
  ;ORC:20
  set oen_reply->RXA_GROUP [rxaGroupX]->ORC->adv_benef_notice_cd = ""
  ;ORC:21
  set stat = alterlist(oen_reply->RXA_GROUP [rxaGroupX]->ORC->ord_fac_name,0)
  ;ORC:22
  set stat = alterlist(oen_reply->RXA_GROUP [rxaGroupX]->ORC->ord_fac_address,0)
  ;ORC:23
  set stat = alterlist(oen_reply->RXA_GROUP [rxaGroupX]->ORC->ord_fac_ph_nbr,0)
  ;ORC:24
  set stat = alterlist(oen_reply->RXA_GROUP [rxaGroupX]->ORC->provider_address,0)
  ;ORC:25
  set oen_reply->RXA_GROUP [rxaGroupX]->ORC->order_status_modifier = ""
  ;ORC:26
  set oen_reply->RXA_GROUP [rxaGroupX]->ORC->adv_beneficiary_not_ovrd_rsn = ""
  ;ORC:27
  set oen_reply->RXA_GROUP [rxaGroupX]->ORC->filler_avail_dt_tm = ""
  ;ORC:28
  set oen_reply->RXA_GROUP [rxaGroupX]->ORC->confidentiality_code = ""
  ;ORC:29
  set oen_reply->RXA_GROUP [rxaGroupX]->ORC->order_type = ""
  ;ORC:30
  set oen_reply->RXA_GROUP [rxaGroupX]->ORC->enterer_auth_mode = ""
  ;ORC:31
  set oen_reply->RXA_GROUP [rxaGroupX]->ORC->parent_univ_service_id = ""

  ; modify RXA
  
    ; RXA:1
  
  if (oen_reply->RXA_GROUP [rxaGroupX]->RXA->give_sub_id_counter = "")
    set oenstatus ->ignore = 1
    set oenstatus->ignore_text = "SKIPPED: GIVE_SUB_ID_COUNTER IS BLANK"
    execute oencpm_msglog(build2("------>IGNORED: give_sub_id_counter = ''", char(0)))
    go to end_of_script
  endif
  
    ; RXA:4
  
  if (oen_reply->RXA_GROUP [rxaGroupX]->RXA->admin_end_dt_tm = "")
    set oen_reply->RXA_GROUP [rxaGroupX]->RXA->admin_end_dt_tm = oen_reply->RXA_GROUP [rxaGroupX]->RXA->admin_start_dt_tm
  endif

    ; RXA:5
  
if (oen_reply->RXA_GROUP [rxaGroupX]->RXA->administered_code->alt_identifier = "DONOTSEND")
    set oenstatus ->ignore = 1
    set oenstatus->ignore_text = "SKIPPED: ALT_IDENTIFIER IS DONOTSEND"
    execute oencpm_msglog(build2("------>IGNORED: administered_code->alt_identifier = "
	  , trim(oen_reply->RXA_GROUP [rxaGroupX]->RXA->administered_code->alt_identifier, 3), char(0)))
    go to end_of_script
  endif 


    ; RXA:6
  
  if (oen_reply->RXA_GROUP [rxaGroupX]->RXA->administered_amount = "999")
  	execute oencpm_msglog(build2("------>IGNORED: administered_amount = "
		, trim(oen_reply->RXA_GROUP [rxaGroupX]->RXA->administered_amount,3), char(0)))
		
    set oenstatus->ignore = 1
    set oenstatus->ignore_text = "SKIPPED: ADMINISTERED_AMOUNT is 999"
    go to end_of_script
  endif

   ;RXA:7
   Set oen_reply->RXA_GROUP [1]->RXA->administered_units->original_text = ""
  
    ; RXA:9
  
  ;set to 01 if identifier is blank and only send first iteration
  if (oen_reply->RXA_GROUP [rxaGroupX]->RXA->administration_notes [1]->identifier = "")
    Set oen_reply->RXA_GROUP [rxaGroupX]->RXA->administration_notes [1]->identifier = "01"
    Set oen_reply->RXA_GROUP [rxaGroupX]->RXA->administration_notes [1]->text = "Historical information - source unspecified"
    Set oen_reply->RXA_GROUP [rxaGroupX]->RXA->administration_notes [1]->coding_system = "NIP001"
  endif
  
  set stat = alterlist(oen_reply->RXA_GROUP [rxaGroupX]->RXA->administration_notes ,1)
  
    ; RXA:10
  
  declare npi_admin_prov = i4 with noconstant(0)
  if (size(oen_reply->RXA_GROUP [rxaGroupX]->RXA->administration_provider, 5) > 0)
    for (x = 1 to size(oen_reply->RXA_GROUP [rxaGroupX]->RXA->administration_provider, 5))
      if(oen_reply->RXA_GROUP [rxaGroupX]->RXA->administration_provider[x]->id_type in ("NPI"))
	    set npi_admin_prov = x
	    set x = size(oen_reply->RXA_GROUP [rxaGroupX]->RXA->administration_provider, 5) + 1
	  endif
    endfor
    
    if (npi_admin_prov > 0)
      ;if NPI found, move it to first position and alterlist to 1, else remove id_nbr and alterlist to 1
      for (x = 1 to npi_admin_prov - 1)
	    set stat = alterlist(oen_reply->RXA_GROUP [rxaGroupX]->RXA->administration_provider
	  	,size(oen_reply->RXA_GROUP [rxaGroupX]->RXA->administration_provider,5) - 1, 0)
	  endfor
    else
	  set oen_reply->RXA_GROUP [rxaGroupX]->RXA->administration_provider [1]->id_nbr = ""
	  set oen_reply->RXA_GROUP [rxaGroupX]->RXA->administration_provider [1]->id_type = ""
    endif
    
	set stat = alterlist(oen_reply->RXA_GROUP [rxaGroupX]->RXA->administration_provider ,1)
    set oen_reply->RXA_GROUP [rxaGroupX]->RXA->administration_provider [1]->check_digit = ""
    set oen_reply->RXA_GROUP [rxaGroupX]->RXA->administration_provider [1]->check_digit_scheme = ""
    set oen_reply->RXA_GROUP [rxaGroupX]->RXA->administration_provider [1]->assign_fac_id->name_id = ""
    set oen_reply->RXA_GROUP [rxaGroupX]->RXA->administration_provider [1]->assign_fac_id->univ_id = ""
    set oen_reply->RXA_GROUP [rxaGroupX]->RXA->administration_provider [1]->assign_fac_id->univ_id_type = ""
    set oen_reply->RXA_GROUP [rxaGroupX]->RXA->administration_provider [1]->name_rep_cd = ""
  endif
  
    ; RXA:11
  
  set oen_reply->RXA_GROUP [rxaGroupX]->RXA->administered_at_location->room = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXA->administered_at_location->bed = ""
  ;set oen_reply->RXA_GROUP [rxaGroupX]->RXA->administered_at_location->facility->name_id = 
   ; oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->VISIT_GROUP [1]->PV1->assigned_pat_loc->facility_id->name_id
  set oen_reply->RXA_GROUP [rxaGroupX]->RXA->administered_at_location->facility->univ_id = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXA->administered_at_location->facility->univ_id_type = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXA->administered_at_location->bed_status = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXA->administered_at_location->location_type_cd = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXA->administered_at_location->building = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXA->administered_at_location->floor = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXA->administered_at_location->street = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXA->administered_at_location->other_desig = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXA->administered_at_location->city = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXA->administered_at_location->state_prov = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXA->administered_at_location->zip_code = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXA->administered_at_location->country = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXA->administered_at_location->types = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXA->administered_at_location->other_geo_desig = ""
 
    ; RXA:17
  
  for (manf_name_num = 1 to size(oen_reply->RXA_GROUP [rxaGroupX]->RXA->substance_manf_name, 5))
    set oen_reply->RXA_GROUP [rxaGroupX]->RXA->substance_manf_name [manf_name_num]->alt_identifier = ""
    set oen_reply->RXA_GROUP [rxaGroupX]->RXA->substance_manf_name [manf_name_num]->alt_text = ""
    set oen_reply->RXA_GROUP [rxaGroupX]->RXA->substance_manf_name [manf_name_num]->alt_coding_system = ""
    set oen_reply->RXA_GROUP [rxaGroupX]->RXA->substance_manf_name [manf_name_num]->coding_system_version = ""
    set oen_reply->RXA_GROUP [rxaGroupX]->RXA->substance_manf_name [manf_name_num]->alt_coding_system_ver = ""
    set oen_reply->RXA_GROUP [rxaGroupX]->RXA->substance_manf_name [manf_name_num]->original_text = ""
  endfor
  
    ; RXA:20
  
  if (oen_reply->RXA_GROUP [rxaGroupX]->RXA->completion_stat != "CP")
    set oenstatus->ignore = 1
    set oenstatus->ignore_text = "SKIPPED: COMPLETION_STAT IS NOT CP"
    execute oencpm_msglog(build2("------>IGNORED: completion_stat = "
	  , trim(oen_reply->RXA_GROUP [rxaGroupX]->RXA->completion_stat, 3), char(0)))
    go to end_of_script
  endif

    ; RXA:21
  
  if (cnvtupper(oen_reply->RXA_GROUP [rxaGroupX]->RXA->action_code_rxa) in ("ND", "ERR", "UNAUTH"))
	execute oencpm_msglog(build2("------>IGNORED: action_code_rxa = "
		, trim(oen_reply->RXA_GROUP [rxaGroupX]->RXA->action_code_rxa,3), char(0)))
		
    set oenstatus->ignore = 1
    set oenstatus->ignore_text = "SKIPPED: ACTION_CODE_RXA IN ND, ERR, UNAUTH"
    go to end_of_script
  endif

  ; modify RXR

;FOR MU3
if (oen_reply->RXA_GROUP [1]->RXR->route->identifier != "") 
Set oen_reply->RXA_GROUP [1]->RXR->route->identifier = 
oen_reply->RXA_GROUP [1]->RXR->route->alt_identifier 
endif
  
    ; RXR:1
  
  set oen_reply->RXA_GROUP [rxaGroupX]->RXR->route->alt_identifier = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXR->route->alt_text = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXR->route->alt_coding_system = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXR->route->coding_system_version = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXR->route->alt_coding_system_ver = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXR->route->original_text = ""
  
    ; RXR:2
  
  set oen_reply->RXA_GROUP [rxaGroupX]->RXR->site->alt_text = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXR->site->alt_identifier = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXR->site->alt_coding_system = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXR->site->coding_system_version = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXR->site->alt_coding_system_ver = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXR->site->original_text = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXR->site->sec_alt_identifier = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXR->site->sec_alt_text = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXR->site->sec_alt_coding_system = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXR->site->sec_alt_coding_system_vers = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXR->site->coding_system_oid = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXR->site->value_set_oid = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXR->site->value_set_vers_id = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXR->site->alt_coding_system_oid = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXR->site->alt_value_set_oid = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXR->site->alt_value_set_vers_id = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXR->site->sec_alt_code_system_oid = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXR->site->sec_alt_value_set_oid = ""
  set oen_reply->RXA_GROUP [rxaGroupX]->RXR->site->sec_alt_value_set_vers_id = ""

endfor
/******
   ; OBX

  ;OBX5.1 for Vaccine Type( 30956-7) = RXA 5.1

for (OBXcount = 1 to size(oen_reply->RXA_GROUP [1]->OBX_GROUP, 5))
  if  (oen_reply->RXA_GROUP [1]->OBX_GROUP [OBXcount ]->OBX->observation_id->identifier =  "30956-7")
    Set oen_reply->RXA_GROUP [1]->OBX_GROUP [OBXcount ]->OBX->observation_value [1]->value_1 = 
       oen_reply->RXA_GROUP [1]->RXA->administered_code->identifier 
  endif
endfor
****/


for (obxGroupX = 1 to size(oen_reply->RXA_GROUP [1]->OBX_GROUP, 5))
    ; modify OBX:5.9
   Set oen_reply->RXA_GROUP [1]->OBX_GROUP [obxGroupX]->OBX->observation_value [1]->value_9 = ""
endfor

; remove segments
;remove NK1 segment
if (size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NK1, 5) > 0)
  set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NK1, 0)
endif

;remove PV1 segment
if (size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->VISIT_GROUP, 5) > 0)
  set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->VISIT_GROUP, 0) 
endif

;; IN1 Segment - Remove all INS
if (size(oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->INS_GROUP, 5) > 0)
  Set stat = alterlist(oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->INS_GROUP  ,0)
endif

;remove TIMING_QTY_GROUP segments
for (rxaGroupX = 1 to size(oen_reply->RXA_GROUP, 5))
  set stat = alterlist(oen_reply->RXA_GROUP [rxaGroupX]->TIMING_QTY_GROUP,  0)
endfor

; end_of_script

#end_of_script

; subroutines

subroutine get_double_value(double_meaning)
  declare eso_idx = i4
  declare list_size = i4
  declare charstat = c100
  set charstat = (validate(oen_reply->cerner, "0"))
  if (charstat = "0")
    return(-1)
  else
    set eso_idx = 0
    set list_size = 0
    set list_size = size(oen_reply->cerner->doubleList,5)
    if( list_size > 0 )
      set eso_x = 1
      for ( eso_x = eso_x to list_size )
        if(oen_reply->cerner->doubleList[eso_x]->strMeaning = double_meaning)
          set eso_idx = eso_x
        endif
      endfor
    endif
    if( eso_idx > 0 )
      return( oen_reply->cerner->doubleList[eso_idx]->dval )
    else
      return(0)
    endif
  endif
end