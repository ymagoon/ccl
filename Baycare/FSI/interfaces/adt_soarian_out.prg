/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  adt_soarian_out
 *  Description:  Used for ADT_TCPIP_SOARIAN_OUT interface
 *  Type:         Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:         Hope Kaczmarczyk
 *  Library:        ADTADT23
 *  Creation Date:  01/24/2014
 *  ---------------------------------------------------------------------------------------------
 *  Mod#   Date	       Author        Description & Requestor Information
 *
 *  1: 1/24/14 Hope Kaczmarczyk    Copy and Modifications to adt_master_outv13 used with Invision
 *  2: 2/17/14 Hope Kaczmarczyk    Added coding to block Invision messages.
 *  3: 3/19/14 Hope Kaczmarczyk    Added coding to block Soarian and Invision A03 messages.
 *  4: 6/10/14 Hope Kaczmarczyk    Moved from m30 to p30.
 *  5: 6/11/14 Hope Kaczmarczyk   Changed BOISHORE to BOIBB
 *  6: 9/25/14 Hope Kaczmarczyk           Added Tony's coding for PID 11 e-mail address blocking
 *  7: 11/3/14 Hope Kaczmarczyk    Added coding to send Soarian alias outbound in IN1;2 instead of Cerner's Health Plan ID
 *  8: 05/27/15 S. Thies                        Blocking BMG and BUC messages outbound - includes allergies
 * 9: 04/05/18 Hope Kaczmarczyk    Added coding to only look in the Soarian Health Plan Alias Pool for outbound alias for IN1.2
 *  ---------------------------------------------------------------------------------------------
*/

/*********************  Block BMG and UC messages OB 05/27/2015  ******************************************************/
If (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->patient_type IN ("A", "OFFM", "OFFO", "OFFW", "OFFU", "CLO"))
set oenstatus->ignore=1
set oenstatus->ignore_text = build("SKIPPED: PATIENT TYPE OF ",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->patient_type, 
" IS NOT IN A OFFM, OFFO, OFFW, OFFU, CLO")
go to exit_script
Endif

/*********************  Block Historical Locations OB 05/27/2015  ***********************************************************/

If (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit = "Historical")
set oenstatus->ignore=1
set oenstatus->ignore_text = "SKIPPED: NURSE_UNIT IS HISTORICAL"
go to exit_script
Endif

/*********************Start Add Mod 7 PID 11 e-mail block T McArtor  08/04/14*******************************************/

declare pid_size = i4
declare p = i4
declare Sstreet = vc
declare Stypes = vc
declare Sother_desig = vc
declare Scity = vc
declare Sstate_prov = vc
declare Scountry = vc
declare Sother_geo_desig = vc
declare Scensus = vc
declare Szip_code = vc

  set pid_size = size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address, 5)
  set p = 1

For (p = 1 to pid_size)

  If (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [p]->types = "e-mail")
     Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [p]->street = ""
     Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [p]->types = ""
     Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [p]->other_desig = ""
     Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [p]->city = ""
     Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [p]->state_prov = ""
     Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [p]->zip_code = ""
     Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [p]->country = ""
     Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [p]->other_geo_desig = ""
     Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [p]->county = ""
     Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [p]->census_tract = ""
  Endif
Endfor

  If (pid_size>1)
     If (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [2]->types = "Home")
       Set Sstreet = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [2]->street 
       Set Stypes = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [2]->types
       Set Sother_desig = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [2]->other_desig
       Set Scity = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [2]->city
       Set Sstate_prov = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [2]->state_prov
       Set Scountry = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [2]->country 
       Set Sother_geo_desig = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [2]->other_geo_desig
       Set Scensus = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [2]->census_tract 
       Set Szip_code = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [2]->zip_code 
 
       Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [1]->street = Sstreet
       Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [1]->types = Stypes
       Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [1]->other_desig = Sother_desig
       Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [1]->city = Scity 
       Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [1]->state_prov = Sstate_prov
       Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [1]->zip_code = Szip_code
       Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [1]->country = Scountry
       Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [1]->other_geo_desig = Sother_geo_desig
       Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [1]->census_tract = Scensus

       Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [2]->street = ""
       Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [2]->types = ""
       Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [2]->other_desig = ""
       Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [2]->city = "" 
       Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [2]->state_prov = ""
       Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [2]->zip_code = ""
       Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [2]->country = ""
       Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [2]->other_geo_desig = ""
       Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [2]->census_tract = ""
    Endif
 Endif

/*********************End Mod7  PID 11 e-mail block   T McArtor  08/04/14*******************************************/


/***Mod 3 - 1/9/2009 - Adding logic to copy facility code into MSH for cloverleaf routing - FSI redesign***/
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = ""
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = 
oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->facility_id->name_id

/***Mod 1 - 11/06/2007 - Adding logic to blank out 999-99-9999  SSN values***/
if(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ssn_nbr ="999999999")
  set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ssn_nbr =""
endif

/***
Mod 5 - 5/12/2010  - Added logic to populate A31 allergy messages ZAL;2 with create_dt_tm when ZAL;1 is
"Active" requested by Chris Eakes for eCW
***/
Set al1_sz = size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->AL1_GROUP, 5)
for(ax=1 to al1_sz)

  if (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->AL1_GROUP [ax]->ZAL->action_code = "Active")
    if (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->AL1_GROUP [ax]->ZAL->activity_dt_tm = "")
 Set all_id = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->AL1_GROUP [ax]->ZAL->allergy_id

Select a.created_dt_tm
from allergy a
where a.allergy_id = cnvtint(all_id)
and active_ind = 1 
detail

oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->AL1_GROUP [ax]->ZAL->activity_dt_tm = 
   format(a.created_dt_tm, "YYYYMMDDHHMMSS;;Q")

with nocounter

    endif
  endif
endfor

/***
Mod 2 - 1/11/2008 - adding logic for A31 to get personnel person_id of the doctor for the last allergy added/updated.
  The "EVN_OPID" realtionship does not exist in the cerner structure for A31's.
***/
If (oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_trigger != "A31")

declare oper_stat = i4 
Set oper_stat = alterlist(oen_reply->CONTROL_GROUP [1]->EVN [1]->operator_id, 0)
Set oper_stat = alterlist(oen_reply->CONTROL_GROUP [1]->EVN [1]->operator_id, 1) 
declare encntr_sz = i4
declare encntr_x = i4 
Set encntr_sz = size(oen_reply->cerner->encntr_prsnl_info->encntr, 5)
Set encntr_x = 1 

while (encntr_x <= encntr_sz)

if (trim(oen_reply->cerner->encntr_prsnl_info->encntr [encntr_x]->reln_type_cdf) = "EVN_OPID")
  declare prsnl_sz = i4
  declare prsnl_x = i4 
  Set prsnl_sz = size(oen_reply->cerner->encntr_prsnl_info->encntr [encntr_x]->prsnl_r, 5)
  Set prsnl_x = 1 

  while (prsnl_x <= prsnl_sz)
    if (oen_reply->cerner->encntr_prsnl_info->encntr [encntr_x]->prsnl_r [prsnl_x]->prsnl_person_id > 0.0)
    Set oen_reply->CONTROL_GROUP [1]->EVN [1]->operator_id [1]->id_nbr =
    cnvtstring(oen_reply->cerner->encntr_prsnl_info->encntr [encntr_x]->prsnl_r [prsnl_x]->prsnl_person_id)

    endif
    Set prsnl_x = prsnl_x + 1
  endwhile

endif 

Set encntr_x = encntr_x + 1

endwhile

Else
set encntr_cnt=size(oen_reply->cerner->encntr_prsnl_info->encntr,5)
For (zal_var=1 to encntr_cnt)
If (substring(1,4,oen_reply->cerner->encntr_prsnl_info->encntr [zal_var]->reln_type_cdf)="ZAL_")
If (oen_reply->cerner->encntr_prsnl_info->encntr [zal_var]->prsnl_r [1]->prsnl_person_id > 0.0)
    Set oen_reply->CONTROL_GROUP [1]->EVN [1]->operator_id [1]->id_nbr =
    cnvtstring(oen_reply->cerner->encntr_prsnl_info->encntr [zal_var]->prsnl_r [1]->prsnl_person_id)
Endif
Endif
Endfor

Endif

/***2/17/14 Send ADT for Soarian locations only- Block Invision messages Hope K.***/

If (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->assign_fac_id->name_id 
="SOARIAN")
  Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_facility->name_id = ""
  Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_facility->name_id = "SOARIAN"
 Else 
    set oenstatus->ignore=1
    set oenstatus->ignore_text = build("SKIPPED: RECEIVING_FACILITY OF "
,oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->assign_fac_id->name_id, " IS NOT SORIAN")
    go to exit_script
 Endif


/***3/25/14 Block all A03 messages except for patient class of E when discharged on FirstNet.  Hope K.***/
 

 If ((oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_trigger = "A03") and 
(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->patient_class != "E"))
 set oenstatus->ignore=1
 set oenstatus->ignore_text = build("SKIPPED: PATIENT_CLASS OF ", 
oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->patient_class, " IS NOT E")
 go to exit_script
Else 
  Declare dval_size = i4
  Set dval_size = size(oen_reply->cerner->doubleList, 5)
    If (dval_size > 0)
      Set cs = 1
        For (cs = 1 to 6)

       FREE SET CONTRIBUTOR_SYSTEM_CD
       FREE SET CONTRIBUTOR_SYSTEM_DISP
               
         If (oen_reply->cerner->doubleList [cs]->strMeaning = "contributor_system_cd")
         Set CONTRIBUTOR_SYSTEM_CD  = oen_reply->cerner->doubleList [cs]->dVal 
         Set CONTRIBUTOR_SYSTEM_DISP = UAR_GET_CODE_DISPLAY(CONTRIBUTOR_SYSTEM_CD )
           If((CONTRIBUTOR_SYSTEM_DISP= "SOARIAN")
           and  (oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_trigger = "A03"))
           Set oenstatus->ignore=1
           set oenstatus->ignore_text = "SKIPPED: CONTRIBUTOR SYSTEM IS SORIAN AND TRIGGER IS A03"
           Set cs = cs+1
         Endif 
           Endif
       Endfor
    Endif
  Endif

/***If (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->servicing_facility NOT IN (
"BOIBARD",       "BOICIC",         "BOICARI",
"BOISTANTH", "BOISCNBC", "BOIMLK",
"BOIBB",    "BOIHAMPL", "BOIHYDEP",
"BOIVAND",       "BOITRIN",      "BCMPCIC",
"BCMPREH",     "BCSTAPET", "SFB"))
set oenstatus->ignore=1
set oenstatus->ignore_text = build("SKIPPED: SERVICING_FACILITY OF ", 
oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->servicing_facility, " NOT IN LIST")
go to exit_script
Endif***/

/*********************Add Soarian Health Plan Alias H Kaczmarczyk 11/3/14*******************************************/

declare pt_enctr_id = f8
declare hlth_plan_alias = vc
declare hlth_plan_id = f8

Set pt_enctr_id = oen_reply->cerner->person_info->person [1]->encntr_id
Set in1_size = size(oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->INS_GROUP [1], 5)

 If (in1_size > 0)
  Set hp = 1
  For(hp=1 to in1_size)
     If (oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->INS_GROUP [hp]->IN1 [1]->ins_plan_id->identifier != "" or NULL or " ")
     Set hlth_plan_id = cnvtreal(oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->INS_GROUP [hp]->IN1 [1]->ins_plan_id->identifier)
     Set soar_hp_aliaspool = uar_get_code_by ("DISPLAY",263,"Health Plan Soarian Alias Pool")

     select into "nl:" 
	E.ENCNTR_ID
	, E.PERSON_ID
	, HP.HEALTH_PLAN_ID
	, HP.ALIAS
      from
	ENCOUNTER   E
	, PERSON_PLAN_RELTN   P
	, HEALTH_PLAN_ALIAS   HP

      PLAN E where E.ENCNTR_ID = pt_enctr_id 
     JOIN P
     WHERE E.PERSON_ID = P.PERSON_ID and P.HEALTH_PLAN_ID = hlth_plan_id
     JOIN HP
      WHERE P.HEALTH_PLAN_ID = HP.HEALTH_PLAN_ID AND HP.ALIAS_POOL_CD = soar_hp_aliaspool  

     detail
       hlth_plan_alias = HP.ALIAS
     WITH NOCOUNTER

; Clear Cerner Health Plan ID Number
    Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->INS_GROUP [hp]->IN1 [1]->ins_plan_id->identifier = ""
; Replace with Soarian Health Plan Alias
    Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->INS_GROUP [hp]->IN1 [1]->ins_plan_id->identifier = hlth_plan_alias
    Endif
 Endfor
Endif
#exit_script