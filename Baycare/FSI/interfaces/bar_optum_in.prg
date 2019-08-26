/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  bar_optum_in
 *  Description:  Script for bar messages from optum 
 *  Type:         Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:        Dan Olszewski
 *  Library:        OEOCFBARBAR
 *  Creation Date:  08/15/16
 *  ---------------------------------------------------------------------------------------------
 *  Mod#  Date    Author       Description & Requestor Information
 *
 *   1:     
 *  ---------------------------------------------------------------------------------------------
*/

/****************PR1 2 set to HCPCS if PR1 is a G code and PR2 is C4************/
; 
FOR (x=1 to size (oen_reply->PERSON_GROUP [1]->FT1_GROUP [1]->PR1_GROUP,5))
     IF (oen_reply->PERSON_GROUP [1]->FT1_GROUP [1]->PR1_GROUP [x]->PR1->coding_method [1]->coding_method = "C4")
           IF (oen_reply->PERSON_GROUP [1]->FT1_GROUP [1]->PR1_GROUP [x]->PR1->proc_code [1]->identifier ="G*")
               Set oen_reply->PERSON_GROUP [1]->FT1_GROUP [1]->PR1_GROUP [x]->PR1->coding_method [1]->coding_method = "HCPCS"
           ENDIF
     ENDIF
ENDFOR
/*************END PR1 2 set to HCPCS if PR1 is a G code and PR2 is C4************/