  /*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  adt_bmg_in
 *  Description:  Used for ADT_TCPIP_BMG_IN Interface
 *  Type:         Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:         Sarah Thies
 *  Library:        ADTADT
 *  Creation Date:  02/21/2014
 *  ---------------------------------------------------------------------------------------------
 *  Mod#   Date	        Author                 Description & Requestor Information
 *
 *  1:      04/21/2014   S Thies                Start of new script
 *  2:                                                              Saving logic to blank out 999-99-9999  SSN values
*   3:      04/14/2014  H Kaczmarczyk  Added coding for Patient Portal
*   4:      09/11/2014  H Kaczmarczyk  Changed check for Patient ID from PID;3 to PID;2 for Patient Portal
*   5:      12/01/2014  H Kaczmarczyk  Changed coding for when Patient Portal build is initiated
*                                                                     Patient Portal Update to evaluate Yes/No "Invitation Sent"
*                                                                     answers in the DB and send invitation if DOB changed age
*                                                                     range from the NO 12-17 to the YES 18 or greater.
*   6:    12/11/14   H Kaczmarczyk        Backed out Patient Portal Update to evaluate Yes/No "Invitation Sent"
*                                                                    answers
*   7:     01/11/16  H Kaczmarczyk       Updated the patient portal email match to qualify on address active indicator = 1
*   8:     01/21/16  H Kaczmarczyk       Removed last 5 characters from zip code value going to Patient Portal
*   9:     12/27/16  H Kaczmarczyk    New Patient Portal coding:
*
*           - Identify the BayCare CMRN alias pool used for Patient Portal look-up
*           - Prevent additional "No, Not Interested" responses when email addr is "none"
*           - Added "For Loop" in case PID address fields for HOME and EMAIL are not always sent in the same iteration
*           - OBX coding to prevent GE OBXs from being overwritten by Patient Portal OBXs if GE ever starts sending OBX segs
*           - Prevent Patient Portal Invitation from being sent if the patient's zip code is missing in the message
*
*   10:  06/13/17 H Kaczmarczyk    - Updated the patient portal invite status and CPI match to qualify on active
*                                                                  indicator row only.
*                                                                - Update to accept Canadian Alpha-Numeric Zip Code.
*   11:  03/12/18 H Kaczmarczyk    - PPI Update and Insert commands for Database Tables
*   12:  03/19/18 H Kaczmarczyk     - Coding fix for PPI Email Not Defined error via timing issue
*   13:  04/25/18 H Kaczmarczyk     - Code updated to prevent invites on email address none@baycare.org
*   14:  04/25/18 H Kaczmarczyk     - Pkgs loaded updated pfmt_pm_person_portal_invite script and removed the need to call
*                                                                 the script - coding to call script removed.
*   15:  04/26/18 H Kaczmarczyk     - Pkgs from 4/25 load were uninstalled; added coding back from last version to call
*                                                                   pfmt_pm_person_portal_invite script.
*
*   16:  03/27/19 H Kaczmarczyk      - Updates made with NEW Object Library field and added logic to check for self enrollment
*                                                                    to prevent duplicate invites
*  ---------------------------------------------------------------------------------------------
*/

/***Mod 1 - 11/06/2007 - Adding logic to blank out 999-99-9999  SSN values***/
;if(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ssn_nbr ="999999999")
;   set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ssn_nbr =""
;endif

/******************************For Patient Portal ***********************************/
/* Creating OBX segments for Patient Portal info, questions, and answers*/

If ((oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_trigger = "A31")
   and (size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address, 5) >1))

; 2/6/19, Check Self Enrollment by person_id
    declare pt_alias = vc

    set pt_alias =oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->pat_id ;cpi
    set pt_alias_pool = uar_get_code_by ("DISPLAY",263,"BayCare CMRN")
    set pt_self_enroll = uar_get_code_by ("MEANING",4,"MESSAGING")

    select into "nl:"
	PA.PERSON_ID

    FROM
	PERSON_ALIAS   PA
	, PERSON_ALIAS   PA2

    PLAN PA

    WHERE PA.ALIAS = pt_alias
         and PA.ALIAS_POOL_CD = pt_alias_pool
         and PA.ACTIVE_IND = 1

    JOIN PA2
         WHERE PA.PERSON_ID = PA2.PERSON_ID
         AND PA2.person_alias_type_cd = pt_self_enroll

     with nocounter

       if (curqual > 0 )
         execute oencpm_msglog build("*****MESSAGING***** = ", pt_self_enroll, char(0))
         go to skip_INVITE
       endif

;original script logic below
    declare x = i4
    declare rzip = vc
    declare ptzip= vc
    declare pt_email = vc

    set  pid_size = size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address, 5)
    set x = 1

   For (x = 1 to pid_size)
    If (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [x]->types= "HOME")
      Set rzip = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [x]->zip_code
        If  (size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [x]->zip_code,1)=10)
           Set convzip = replace(rzip, "-", "", 1)
           Set convziptype = Isnumeric(convzip)
            If (convziptype = 1)
              Set ptzip=CNVTSTRING(convzip, 5)
            Else
              Set ptzip = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [x]->zip_code
            Endif
        Else
           Set rziptype = Isnumeric(rzip)
            If ((rziptype = 1) and (size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [x]->zip_code,1)=9))
                Set ptzip=CNVTSTRING(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [x]->zip_code, 5)
            Else
                Set ptzip = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [x]->zip_code
            Endif
        Endif
    Elseif  (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [x]->types= "EMAIL")
      Set pt_email = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [x]->street
    Endif
   Endfor

      declare pt_dbemail = vc
      declare inv_answer = vc

      Set pt_addrtype = uar_get_code_by ("MEANING",212,"EMAIL")
      Set invite_status = uar_get_code_by ("MEANING",356,"PATIENTPORTA")

         Select into "nl:"
         A.STREET_ADDR,  PI_VALUE_DISP = UAR_GET_CODE_DISPLAY(PI.VALUE_CD);invite answer
         from  ADDRESS   A, PERSON_ALIAS   PA, PERSON_INFO   PI

         Plan PA  WHERE PA.ALIAS=pt_alias and PA.ALIAS_POOL_CD = pt_alias_pool and PA.ACTIVE_IND = 1
           Join PI where PA.PERSON_ID = PI.PERSON_ID and PI.INFO_SUB_TYPE_CD = invite_status and PI.ACTIVE_IND = 1
           Join A where PI.PERSON_ID=A.PARENT_ENTITY_ID and A.ADDRESS_TYPE_CD= pt_addrtype
           and A.ACTIVE_IND = 1

         Detail
         pt_dbemail = A.STREET_ADDR
         inv_answer = PI_VALUE_DISP
         WITH NOCOUNTER

      declare msgdate= i4
      declare ptdtob= i4
      declare ptage= i4
      declare realptage= i4

      Set msgdate= cnvtreal(cnvtstring(trim(oen_reply->CONTROL_GROUP [1]->MSH [1]->message_time_stamp),8))
      Set ptdtob= cnvtreal(cnvtstring(trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->date_of_birth),8))
      Set ptage= msgdate - ptdtob
      Set realptage= cnvtreal(cnvtstring(ptage,2))

      If ((pt_email=pt_dbemail) and (inv_answer in ("Invitation Sent", "Yes, Generate Invitation", "Yes")))
           go to skip_INVITE
      Elseif ((pt_email=pt_dbemail) and (realptage between 12 and 17) and (inv_answer in ("No, Not Interested", "No")))
          go to skip_INVITE
      Elseif ((pt_email=pt_dbemail) and (pt_email = "none") and (inv_answer in ("No, Not Interested", "No")))
          go to skip_INVITE
     Elseif ((pt_email=pt_dbemail) and (pt_email = "none@baycare.org") and (inv_answer in ("No, Not Interested", "No")))
          go to skip_INVITE
      Elseif ((pt_email=pt_dbemail) and (rzip= NULL) and (inv_answer in ("No, Not Interested", "No")))
          go to skip_INVITE
      Endif

     Set obxcnt = size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->OBX,5)
     Set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->OBX,(obxcnt + 1))

     Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->OBX [1 + obxcnt]->set_id = cnvtstring(obxcnt + 1)
     Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->OBX [1 + obxcnt]->value_type = "CE"
     Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->OBX [1 + obxcnt]->observation_id->identifier = "PATIENTPORTA"

          IF ((pt_email  != "*@*" or pt_email = "none@baycare.org") or (realptage between 12 and 17) or (rzip = NULL))
           Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->OBX [1 + obxcnt]->observation_value [1]->value_1 = "NO"
           Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->ZPI [1]->portal_access_offered->identifier = "NO"
          ELSE
          Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->OBX [1 + obxcnt]->observation_value [1]->value_1 = "YES"
          Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->ZPI [1]->portal_access_offered->identifier = "YES"
          Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->ZPI [1]->portal_invite_status->identifier = "SEND" ;code set 4352008
          Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->ZPI [1]->portal_challenge_question->identifier = "ZIP" ;code set 4003353
          Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->ZPI [1]->portal_challenge_answer = ptzip

execute oencpm_msglog build("*****PATIENT ZIP***** = ", ptzip , char(0))

          ENDIF
Endif
#skip_INVITE