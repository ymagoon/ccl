/*
*  ---------------------------------------------------------------------------------------------
*  Cerner Script Name:  mobj_amblc_pat_out
*  Description:  Modify Object Script for Amb LabCorp Msgs Outbound - PatGroup Cleanup
*  Type:  Open Engine Modify Object Script
*  ---------------------------------------------------------------------------------------------
*  Author:  FSI
*  Domain:  All
* Create Date: 3/30/16
* Object Library: OEOCF23ORMORM
*  ---------------------------------------------------------------------------------------------
*
*  Mod#   Date	        Author                 Description & Requestor Information
 *
 *  001:    08/19/16	  S Parimi      RFC # 13591 implementation of Orders outbound to LabCorp
 *  002:    06/17/19	  H Kacz         Adding FIN tags to PID 4 for BH labs project
*/

/**************************************************************/
;                 Site specific variable declaration
Declare PAT_ID_TYPE = vc	               			 ;PID 3
Declare PAT_ID_ASS_AUTH = vc			;PID 3
Declare PAT_ACCT_NBR_TYPE = vc			;PID 18

Set PAT_ID_TYPE = "BCCPI"				;CS 4
Set PAT_ID_ASS_AUTH = "MRN"		;CS 263
Set PAT_ACCT_NBR_TYPE = "FIN"	     		;CS 319

; End of Site Specific Coding
/**************************************************************/


declare current_program = vc
Set current_program = curprog
execute oencpm_msglog build("In-", current_program, char(0))

declare patgrp_sz = i4
declare patgrp_x = i4
Set patgrp_sz = size(oen_reply->PERSON_GROUP [1]->PAT_GROUP, 5)
Set patgrp_x = 1


while (patgrp_x <= patgrp_sz)

  ; PID Segment
  ;Set up PID-2 with the info you want from PID-1 and other segments then remove/replace PID-1
  Set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID, 2) ; this means there are 2 PIDs now, duh!

  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [2]->set_id = "1"

  ; PID.2 - Send out current value (ENCNTR_ALIAS BCCPI)
  ;Send out CPI values
  declare pid3_sz = i4
  declare pid3_x = i4
  declare npid3_sz = i4
  Set pid3_sz = size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [1]->patient_id_int, 5)
  Set pid3_x = 1
  Set npid3_sz = 0

  while (pid3_x <= pid3_sz)
    if (trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [1]->patient_id_int [pid3_x]->type_cd) = PAT_ID_TYPE)
      Set npid3_sz = npid3_sz + 1
      Set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [2]->patient_id_int, npid3_sz)
      Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [2]->patient_id_int [npid3_sz]->id = 
        trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [1]->patient_id_int [pid3_x]->id)

      Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [2]->patient_id_int [npid3_sz]->assign_auth->name_id = 
        PAT_ID_ASS_AUTH
    endif

    Set pid3_x = pid3_x + 1
  endwhile

 ; Valid Assigning Authority Values for PID;2 
 ; Will populate with BCCPI
  if (npid3_sz > 0)
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [2]->patient_id_ext->id = 
      trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [2]->patient_id_int [1]->id)
  endif

  ; PID.3 - Remove
  Set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [2]->patient_id_int, 0)

; PID.4 - Set to PID.18.1 - new added fin identifier
  Set stat = 
    alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [2]->alternate_pat_id, 1)
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [2]->alternate_pat_id [1]->id = 
    trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [1]->patient_account_nbr->id)
  ;;002 added for sending out FIN assigning auth
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [2]->alternate_pat_id [1]->assign_auth->name_id = 
    trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [1]->patient_account_nbr->assign_auth->name_id)

  ; PID.5
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [2]->patient_name [1]->last_name = 
    trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [1]->patient_name [1]->last_name)
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [2]->patient_name [1]->first_name = 
    trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [1]->patient_name [1]->first_name)
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [2]->patient_name [1]->middle_name = 
    trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [1]->patient_name [1]->middle_name)

  ; PID.7
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [2]->date_of_birth = 
    trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [1]->date_of_birth)

  ; PID.8
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [2]->sex = 
    trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [1]->sex)

  ; PID;10
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [2]->race [1]->identifier =    
     trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [1]->race [1]->identifier)

  ; PID.11 - Move "valid" address.
  ; Valid defined by having a city, state, and zip code populated.
  declare pid11_sz = i4
  declare pid11_x = i4
  declare npid11_sz = i4
  Set pid11_sz = size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [1]->patient_address, 5)
  Set pid11_x = 1
  Set npid11_sz = 0

  while (pid11_x <= pid11_sz)
    if ((trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [1]->patient_address [pid11_x]->city) != "") AND
        (trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [1]->patient_address [pid11_x]->state_prov) != "") AND
        (trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [1]->patient_address [pid11_x]->zip_code) != ""))
      ; Valid Address
      Set npid11_sz = npid11_sz + 1
      Set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [2]->patient_address, npid11_sz)

;Set up PID-2 with the info you want for PID-1
      Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [2]->patient_address [npid11_sz]->street = 
        trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [1]->patient_address [pid11_x]->street)

      Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [2]->patient_address [npid11_sz]->other_desig = 
        trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [1]->patient_address [pid11_x]->other_desig)
      Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [2]->patient_address [npid11_sz]->city = 
        trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [1]->patient_address [pid11_x]->city)
      Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [2]->patient_address [npid11_sz]->state_prov = 
        trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [1]->patient_address [pid11_x]->state_prov)
      Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [2]->patient_address [npid11_sz]->zip_code = 
        trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [1]->patient_address [pid11_x]->zip_code)
    endif

    Set pid11_x = pid11_x + 1
  endwhile

  ; PID.13
  if (size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [1]->ph_nbr_home, 5) > 0)
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [2]->ph_nbr_home [1]->phone_nbr = 
      trim(cnvtalphanum(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [1]->ph_nbr_home [1]->phone_nbr))
  endif

  ; PID.18 - Set to PV1.3.1
  ; Alias on codeset 220 at Nurse Unit/Ambulatory level to print on Lab Req
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [2]->patient_account_nbr->id = 
    trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PV1 [1]->assigned_pat_loc->nurse_unit)

;wipe out PID-1 with PID-2 info
  Set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID, 1, 0)

  ; Remove Segments from PAT_Group
  Set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->NTE, 0)
  Set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PD1, 0)
 ; Set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PV1, 0)  This is needed for mobj_amblc_out
  Set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->OBX, 0)
  Set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PV2, 0)
  Set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->ZVI, 0)

  Set patgrp_x = patgrp_x + 1
endwhile

; Remove AL1_Group Information
Set stat = alterlist(oen_reply->PERSON_GROUP [1]->AL1_GROUP, 0)

declare current_program = vc
Set current_program = curprog
execute oencpm_msglog build("Out-", current_program, char(0))