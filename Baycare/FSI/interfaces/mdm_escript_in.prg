/*
 *  ------------------------------------------------------------------------------------------
 *  Script Name: mdm_escript_in
 *  Description:  Script for dictation documents inbound from Escription
 *  Type:         Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:         Peggie Hopkins
 *  Library:        OEOCFMDMMDM
 *  Creation Date:  01/30/12
 *  ---------------------------------------------------------------------------------------------
 *  Mod#  Date    Author       Description & Requestor Information
 *
 *  1:   1/30/12 - P Hopkins - Added logic to check if a TR document already exists for a DI (T02) status message.  
            If so, ignore the DI message.  This corrects an issue with Escription sending DI status messages after a 
            TR document has already been received.
 * 2:     6/12/12 - P Hopkins - Added a contributor system qualifier to the Select statement to eliminate failures 
           caused by pre-existing series_ref_nbr's on the CE table.
 * 3:     6/12/12 - P Hopkins - changes the Curqual qualifier to Auth_flag
 *        6/06/14 - R Quack - Added FIN lookup logic for Soarian Cut-Over at SFB
 * 4:    7/15/14 - R Quack - Added SJ's sites to the FIN lookup logic for Cut-Over at Joes (Not SJS They Start w/o Inv FIN)
*  5:    8/20/15 - T McArtor - Added West Sites sites to the FIN lookup logic for Cut-Over 
*  6:  07/09/18 -  HKaczmarczyk   Change from CPI (Historical CMRN) to BCCPI (BayCare CMRN)- RFC 5540
*  7:  07/22/19    S Parimi CHG0031162 Removed code for PRDOC with MSNumber standardization
*  ---------------------------------------------------------------------------------------------
*/

/***
  01/30/2012 - Logic to check if document already exists for DI (T02) status messages.  If so ignore message.  
  This is to fix an issue with Escription sending DI status messages after a document has already been created.
***/

Free set obx_nbr_1
Set obx_nbr_1=size(oen_reply->TXA_GROUP [1]->OBX_GROUP,5)

If (oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_trigger = "T02")
 If (obx_nbr_1 < 1)

Declare series_ref_nb = vc
Declare auth_flag = f8
Declare con_sys = f8

Set series_ref_nb = concat(oen_reply->TXA_GROUP [1]->TXA->unique_doc_nbr->id,"1")
Set con_sys = uar_get_code_by("DISPLAYKEY",89,"ESCRIPTION")

EXECUTE OENCPM_MSGLOG(BUILD("series_ref_nb = ", series_ref_nb))
EXECUTE OENCPM_MSGLOG(BUILD("contributor_system= ", con_sys))

/****
6/12/2012 - add eScription contributor system to the qualifying select statemnt
****/

select into "nl:"
  ce.authentic_flag ;ce.verified_prsnl_id
from clinical_event ce
where ce.series_ref_nbr = series_ref_nb
and ce.contributor_system_cd = con_sys
order by ce.updt_cnt desc
detail
   auth_flag=ce.authentic_flag ;ce.verified_prsnl_id
with maxrec=1
EXECUTE OENCPM_MSGLOG(BUILD("authentic_flag = ", auth_flag))

If (auth_flag != 0)
;If (curqual != 0)
    Set oen_reply->TXA_GROUP [1]->TXA->doc_completion_stat = ""
    ;Set oen_reply->TXA_GROUP [1]->OBX_GROUP [1]->OBX->observation_res_status = ""
   Set oen_reply->TXA_GROUP [1]->TXA->doc_completion_stat = "ZZ"
   ;Set oen_reply->TXA_GROUP [1]->OBX_GROUP [1]->OBX->observation_res_status = "ZZ"
   Set oen_reply->TXA_GROUP [1]->TXA->unique_doc_nbr->id = ""
   Set oen_reply->TXA_GROUP [1]->TXA->document_type->identifier = ""
Endif
Endif
Endif