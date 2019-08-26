/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  orm_idx_morg_in
 *  Description:  Common script is executed from within other modobj scripts to set facility code in MSH:5
 *  Type:         Modify Original Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:         
 *  Library:        
 *  Creation Date:  
 *  ---------------------------------------------------------------------------------------------
 *  Mod#Date		Author		Description & Requestor Information
*/

free record temp
  record temp
  (
   1 msg=vc
  )

Set temp->msg = replace(oen_request->org_msg,"â€“","-",0)
Set oen_reply->out_msg=build(temp->msg,char(0))