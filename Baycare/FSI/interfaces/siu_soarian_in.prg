 /*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  siu_soarian_in
 *  Description:  Used for SIU_TCPIP_SOARIAN_IN Interface
 *  Type:         Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:         Sarah Thies
 *  Library:        OEOCFSIUSIU
 *  Creation Date:  02/21/2014 
 *  ---------------------------------------------------------------------------------------------
 *  Mod#   Date	       Author        Description & Requestor Information
 *
 *  1:      11/23/2016   S Thies     Start of new script 
 *  2:                                                   Saving logic to blank out 999-99-9999  SSN values
 *  3:      01/09/2017   S Thies     Copied siu_soarian_in_v1 from C30
 *  4:      04/10/2017   S Thies     Coiped siu_soarian_in from M30 for BH 
 *  ---------------------------------------------------------------------------------------------
*/

/***Mod 1 - 11/06/2007 - Adding logic to blank out 999-99-9999  SSN values***/
if(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ssn_nbr ="999999999")
   set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ssn_nbr =""
endif