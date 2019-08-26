/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  adt_hi_out
 *  Description:  Used for ADT_TCPIP_HI_OUT interface
 *  Type:         Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:        Jean Kaiser
 *  Library:        ADTADT23
 *  Creation Date:  07/08/2015
 *  ---------------------------------------------------------------------------------------------
 *  Mod#   Date	       Author        Description & Requestor Information
 * 07/27/2015             J Kaiser      Copied script from C30 
 * 06/22/2017             J Starke      Modified ignore logic to use HI MRN to allow eSNF ADT
 *
 *  ---------------------------------------------------------------------------------------------
*/

/* Do not send out if no HI MRN */
set mrn_size = size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int,5)
set found = 0
for (mrn_x = 1 to mrn_size)
  IF (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [mrn_x]->assign_auth->name_id  = "HI MRN")
    set found = 1
  endif
endfor

if (found = 0)
  set oenstatus->ignore = 1
  set oenstatus->ignore_text = "SKIPPED: NO HI MRN"
  go to endofscript
endif

/* Do not send e-mail address out */

  set pid_size = size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address, 5)

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
#endofscript