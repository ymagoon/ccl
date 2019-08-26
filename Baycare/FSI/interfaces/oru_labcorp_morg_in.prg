/*
*  ---------------------------------------------------------------------------------------------
*  Script Name:  STD_RLI_LABCORP_MODORG_IN
*  Description:  LABCORP_INBOUND_MOD_ORIG
*  Type:  Open Engine Modify Original Script
*  ---------------------------------------------------------------------------------------------
*  Author:  
*  Domain:  c30
*  Creation Date:  08/31/2007 04:09:47 PM
*  ---------------------------------------------------------------------------------------------
*/
/*~BB~********************************************************************
  *                                                                      *
  *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
  *                              Technology, Inc.                        *
  *       Revision      (c) 1984-1999 Cerner Corporation                 *
  *                                                                      *
  *  Cerner (R) Proprietary Rights Notice:  All rights reserved.         *
  *  This material contains the valuable properties and trade secrets of *
  *  Cerner Corporation of Kansas City, Missouri, United States of       *
  *  America (Cerner), embodying substantial creative efforts and        *
  *  confidential information, ideas and expressions, no part of which   *
  *  may be reproduced or transmitted in any form or by any means, or    *
  *  retained in any storage or retrieval system without the express     *
  *  written permission of Cerner.                                       *
  *                                                                      *
  *  Cerner is a registered mark of Cerner Corporation.                  *
  *                                                                      *
  ~BE~**********************************************************************/
/*
  *
  *  Mod#   Date	        Author                 Description & Requestor Information
  *
  *  1:    08/22/16	  H Kaczmarczyk    RFC # 13591 Result Modification w/ Orders outbound to LabCorp
*/

execute oencpm_msglog("Start of STD_RLI_LABCORP_MOD_ORG_IN script.") 

set trace recpersist
free set field
record field (
 1 zps_seg [*]
 	2 zps2 = vc
 	2 zps3 = vc
 	2 zps4 [*]
 		3 zps4_1 = vc
 		3 zps4_3 = vc
 		3 zps4_4 = vc
 		3 zps4_5 = vc
 	2 zps5 = vc
 	2 zps7 [*]
 		3 zps7_1 = vc
 		3 zps7_2 = vc
 		3 zps7_3 = vc
 	)
declare zps_num = i4
set zps_num=0
declare zps_pos_beg = i4
declare zps_pos_end = i4
declare zps_seg_str = vc

set zps_pos_beg = findstring(build(char(13),"ZPS"),oen_request->org_msg,1)
execute oencpm_msglog(build("---zps pos beg: ",zps_pos_beg,char(0)))
WHILE (zps_pos_beg>0)
;IF (zps_pos_beg>0)
 set zps_num = zps_num+1
 set stat = alterlist(field->zps_seg,zps_num)
 set zps_pos_end = findstring(char(13),oen_request->org_msg,zps_pos_beg+1)

 set zps_seg_str = substring(zps_pos_beg,zps_pos_end-zps_pos_beg+1,oen_request->org_msg)

 set field->zps_seg [zps_num]->zps2 = piece(zps_seg_str,"|",3,"")
 set field->zps_seg [zps_num]->zps3 = piece(zps_seg_str,"|",4,"")
 set stat = alterlist(field->zps_seg [zps_num]->zps4,1)
 set field->zps_seg [zps_num]->zps4 [1]->zps4_1 = piece(piece(zps_seg_str,"|",5,""),"^",1,"")
 set field->zps_seg [zps_num]->zps4 [1]->zps4_3 = piece(piece(zps_seg_str,"|",5,""),"^",3,"")
 set field->zps_seg [zps_num]->zps4 [1]->zps4_4 = piece(piece(zps_seg_str,"|",5,""),"^",4,"")
 set field->zps_seg [zps_num]->zps4 [1]->zps4_5 = piece(piece(zps_seg_str,"|",5,""),"^",5,"")
 set field->zps_seg [zps_num]->zps5 = piece(zps_seg_str,"|",6,"")
 set stat = alterlist(field->zps_seg [zps_num]->zps7,1)
 set field->zps_seg [zps_num]->zps7 [1]->zps7_1 = piece(piece(zps_seg_str,"|",8,""),"^",1,"")
 set field->zps_seg [zps_num]->zps7 [1]->zps7_2 = piece(piece(zps_seg_str,"|",8,""),"^",2,"")
 set field->zps_seg [zps_num]->zps7 [1]->zps7_3 = piece(piece(zps_seg_str,"|",8,""),"^",3,"")
 
 set oen_request->org_msg = replace(oen_request->org_msg,build(char(13),"zps_seg_str"),"",1)  
;ENDIF
 set zps_pos_beg = findstring(build(char(13),"ZPS"),oen_request->org_msg,zps_pos_end)
ENDWHILE

set oen_reply->out_msg = build(trim(oen_request->org_msg),char(0))

execute oencpm_msglog("End of STD_RLI_LABCORP_MOD_ORG_IN script.")