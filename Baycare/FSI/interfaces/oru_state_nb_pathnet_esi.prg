/***********************************************************************************
*  Type:  Open Engine Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:  CERNER
 ***********************************************************************************/
/***********************************************************************************
 *  Mod#   Date	        Author                 Description & Requestor Information
 *
 *  1:  07/27/2016   S Parimi               CAB # 8966 implementation of Newborn Screening Results from State  
***********************************************************************************/


;;;Removing PDF OBX from Result
Set z = size(oen_reply->RES_ORU_GROUP->OBX_GROUP, 5) 
Set x = 1 

While ( x <  z + 1 )
 if (oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [x]->OBX->value_type = "ED")

  ;;;OBX Modifications
  set stat=alterlist (oen_reply->RES_ORU_GROUP [1]->OBX_GROUP, Z - 1 , x - 1) 

  set z = size(oen_reply->RES_ORU_GROUP, 5)

 else
  set x = x + 1

 endif
endwhile