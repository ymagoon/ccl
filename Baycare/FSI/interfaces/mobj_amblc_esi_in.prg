/*
*  ---------------------------------------------------------------------------------------------
*  Cerner Script Name:  mobj_amblc_esi_in
*  Description:  Modify Object Script for Amb LabCorp Result Msgs Intbound Cleanup
*  Type:  Open Engine Modify Object Script
*  ---------------------------------------------------------------------------------------------
*  Author:  Cerner FSI
*  Domain:  All
* Create Date: July 2016
*  ---------------------------------------------------------------------------------------------
*
*  Mod#   Date	        Author                 Description & Requestor Information
 *
 *  1:    08/22/16	  H Kaczmarczyk    RFC # 13591 Result Modification w/ Orders outbound to LabCorp
*/

execute oencpm_msglog build("mobj_amblc_esi_in...", char(0))

declare x = i4
declare cnt_sz = i4

set x = 1
set cnt_sz = OEN_REQUEST_DATA->SPLIT_CNT

if( VALUE( OEN_REQUEST_DATA->SPLIT_INDEX ) > 1 )
  while( x < VALUE( OEN_REQUEST_DATA->SPLIT_INDEX ) )
    set stat = ALTERLIST(oen_reply->RES_ORU_GROUP, (cnt_sz-1),0 )
    set cnt_sz = SIZE(oen_reply->RES_ORU_GROUP, 5 )
    set x = x + 1
  endwhile
endif

set stat = ALTERLIST(oen_reply->RES_ORU_GROUP, 1 )
set cnt_sz = SIZE(oen_reply->RES_ORU_GROUP, 5 )

execute oencpm_msglog build("mobj_amblc_esi_in...", char(0))