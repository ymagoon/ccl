/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  orm_audiology_out
 *  Description:  Rehab Audiology orders outbound
 *  Type:  Open Engine Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:  Hope Kaczmarczyk
 *  Library:  OEOCF23ORMORM
 *  Creation Date:  02/08/2018
*  ---------------------------------------------------------------------------------------------
 *  Mod# Date    Author   Description & Requestor Information
 *
 *  1:   09/28/18    S Parimi  Created Mod Object script for ORM_TCP_AUDIOLOGY_OUT
*   1:   02/27/19    S Parimi  Moved SSN logic to blank out to Cloverleaf
 *  ---------------------------------------------------------------------------------------------
 */


EXECUTE OP_MSH_FAC_MODOBJ_OUT


/* change to New Order */
If(oen_reply->ORDER_GROUP [1]->ORC [1]->order_ctrl = "SN")
 Set oen_reply->ORDER_GROUP [1]->ORC [1]->order_ctrl = "NW"
Endif

execute op_doc_filter_gen_outv5