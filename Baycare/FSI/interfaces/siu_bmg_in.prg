 /*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  siu_bmg_in
 *  Description:  Used for SIU_TCPIP_BMG_IN Interface
 *  Type:         Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:         Sarah Thies
 *  Library:        OEOCFSIUSIU
 *  Creation Date:  02/21/2014 
 *  ---------------------------------------------------------------------------------------------
 *  Mod#   Date	       Author        Description & Requestor Information
 *
 *  1:      04/21/2014   S Thies     Start of new script 
 *  2:                                                   Saving logic to blank out 999-99-9999  SSN values
 *  ---------------------------------------------------------------------------------------------
*/

/***Mod 1 - 11/06/2007 - Adding logic to blank out 999-99-9999  SSN values***/
if(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ssn_nbr ="999999999")
   set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ssn_nbr =""
endif