/*
* Author: Cerner Corporation
 *  ---------------------------------------------------------------------------------------------
 *  Mod#   Date	        Author           Description & Requestor Information
 *
 *   1:      11/21/2016   S Parimi        New script added on ESI server RFC # 15124 for Quest interface changes server
 *  ---------------------------------------------------------------------------------------------
*/

execute oencpm_msglog build("mobj_ambquest_esi_in...", char(0))

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

execute oencpm_msglog build("mobj_amquest_esi_in...", char(0))