/*
*  ---------------------------------------------------------------------------------------------
*  Script Name:  mobj_ambquest_pat_out
*  Description:  Modify Object Script for Amb Quest Msgs Outbound - PatGroup Cleanup
*  Type:  Open Engine Modify Object Script
*  ---------------------------------------------------------------------------------------------
*  Author:  FSI
*  Domain:  All
*  ---------------------------------------------------------------------------------------------
*
*/
/**************************************************************/
;                 Site specific variable declaration
Declare PAT_ID_TYPE = vc	               			 ;PID 3
Declare PAT_ID_ASS_AUTH = vc			;PID 3
Declare PAT_ACCT_NBR_TYPE = vc			;PID 18

Set PAT_ID_TYPE = "BCCPI"				;CS 4
Set PAT_ID_ASS_AUTH = "BayCareCMRN"		;CS 263
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
  Set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID, 2)

  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [2]->set_id = "1"

  ; PID.3 - Send out CPI values
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

 ; Valid Quest Assigning Authority Values for PID;2 are MRN and CPI
 ; Will populate with CPI
  if (npid3_sz > 0)
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [2]->patient_id_ext->id = 
      trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [2]->patient_id_int [1]->id)
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [2]->patient_id_ext->assign_auth->name_id = 
      trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [2]->patient_id_int [1]->assign_auth->name_id)
  endif

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

  ; PID.18 - Set to FIN
  if (trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [1]->patient_account_nbr->type_cd) = PAT_ACCT_NBR_TYPE)
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [2]->patient_account_nbr->id = 
      trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [1]->patient_account_nbr->id)
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [2]->patient_account_nbr->assign_auth->name_id = 
      oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [1]->patient_account_nbr->assign_auth->name_id 
    endif

  ; PID.19
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [2]->ssn_nbr = 
    trim(cnvtalphanum(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [1]->ssn_nbr))
  /* ssn fix  */
  If(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [2]->ssn_nbr ="999999999")
  set oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID [2]->ssn_nbr =""
  endif


  Set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PID, 1, 0)

  ; Remove Segments from PAT_Group
  Set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->NTE, 0)
  Set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PD1, 0)
  Set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [patgrp_x]->PV1, 0)
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