/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  eRx_Med_Hx_Out_Mobj
 *  Description:  ePrescribe Med Hx Outbound
 *  Type:  Open Engine Modify Object Script
 *  Library: OEOCF008001SCRIPTNEWRX or OEOCF008001SCRIPTRXHREQ
 *  ---------------------------------------------------------------------------------------------
 *  Author:  B105072
 *  Domain:  C30
 *  Creation Date:  12/06/13 17:54:39
 *  ---------------------------------------------------------------------------------------------
 *  Mod# Date    Author   Description & Requestor Information
 *  1:  12/06/13 H Kaczmarczyk New ModObject script for Med Hx Update 10.6
 *  ---------------------------------------------------------------------------------------------
*/

Set DOMAIN = cnvtupper( Logical ("ENVIRONMENT") )

;Logic needed for test domain only
if ( DOMAIN != "P30" )
    Set oen_reply->Message->Header->TestMessage = "1"
    if (oen_reply->Message->Header->TertiaryIdentifier = "ACTRXHISTCL" )
      set strPON = concat(oen_reply->Message->Body->RxHistoryRequest->BenefitsCoordination [1]->PBMMemberID, "000")
      set oen_reply->Message->Header->PrescriberOrderNumber = strPON
   endif
endif