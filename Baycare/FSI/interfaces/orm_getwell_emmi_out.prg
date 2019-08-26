/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  orm_getwell_emmi_out
 *  Description:  For Education orders to Getwell Edutainment and EMMI
 *  Type:  Open Engine Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:  Hope Kaczmarczyk
 *  Library:  OEOCF23ORMORM
 *  Creation Date:  11/20/2013 9:44:00
 *  ---------------------------------------------------------------------------------------------
 *  Mod# Date    Author   Description & Requestor Information
 *
 *  1:   11/20/13    H Kaczmarczyk  Mod Object script for new Outbound Getwell ORM Interface
 *   2:   6/12/14      H Kaczmarczyk   Added New Dr filter script from Rick Quack for SJB and Soarian
 *  3:  12/02/14     H Kaczmarczyk   Added SJS
 *  4:  05/20/16     T McArtor              Added BRM
 *  5:  08/18/16     H Kaczmarczyk  Added WHH and WHW
 *  6:  12/19/16     S Thies                 Commented Out Ignore Logic for EMMI Orders, BMG
 *  7:  12/23/16     S Thies                 Commented Out 2nd Doctor Filter Script, never worked, calling v5 only
 *  8:  02/13/17     S Thies                 Promoting v1 script from non-prod for EMMI App, RFC-976
 *  ---------------------------------------------------------------------------------------------
 */


EXECUTE OP_MSH_FAC_MODOBJ_OUT

;12/19/2016 Commented Out Ignore Logic for EMMI Orders, BMG
; If (oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id not in("SJH","SJN","SAH","SJW","MCS" ,
;      "NBY", "MPH","SFB","MDU", "SJS","BRM","WHH","WHW"))
; Set OenStatus->Ignore=1
; endif

/* Remove PID;5.7 & PID;18 extra fields */
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_name [1]->name_type_cd = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->type_cd = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_fac_id->name_id = ""

/* Remove PV1;19 extra fields */
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->visit_nbr [1]->check_digit = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->visit_nbr [1]->check_digit_scheme = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->visit_nbr [1]->assign_auth->name_id = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->visit_nbr [1]->assign_auth->univ_id = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->visit_nbr [1]->assign_auth->univ_id_type = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->visit_nbr [1]->type_cd = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->visit_nbr [1]->assign_fac_id->name_id = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->visit_nbr [1]->assign_fac_id->univ_id = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->visit_nbr [1]->assign_fac_id->univ_id_type = ""

/* ssn fix  */
if(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ssn_nbr ="999999999")
  set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ssn_nbr =""
endif

/* change to New Order */
If(oen_reply->ORDER_GROUP [1]->ORC [1]->order_ctrl = "SN")
 Set oen_reply->ORDER_GROUP [1]->ORC [1]->order_ctrl = "NW"
Endif

/*12/23/16 - Adding EMMI BMG Doctors - call only this doctor filter script */
execute op_doc_filter_gen_outv5


/*12/23/16, commenting out logic below, calling op_doc_filter_gen_out never worked 
because the set facility is not the assigning auth for the ms providers, the working script is v5 
6/12/14 - New logic to call doctor filter script by R Quack
If(oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id in 
("SFB","MCS","MPH","MDU","NBY","SJH","SJN","SAH","SJW", "SJS","BRM","WHH","WHW", "SGA"))
     execute op_doc_filter_gen_outv5
else
    execute op_doc_filter_gen_out
EndIf*/