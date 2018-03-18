/*~BB~************************************************************************
      *                                                                      *
      *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
      *                              Technology, Inc.                        *
      *       Revision      (c) 1984-1995 Cerner Corporation                 *
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
  ~BE~***********************************************************************/
 
/*****************************************************************************
 
        Source file name:       rad_packet_detail_record.inc
        Object name:            n/a
        Request #:              multiple
 
        Product:                GARPP
        Product Team:           Radnet
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        record structure for order details
 
        Tables read:            many
 
        Tables updated:         none
        Executing from:         ?
 
        Special Notes:          ?
 
******************************************************************************/
;~DB~************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *Mod Date     Engineer             Comment                             *
;    *--- -------- -------------------- ----------------------------------- *
;     ### 08/19/03 Tammy Baack/Sandra Prow    Initial Release               *
;~DE~************************************************************************
 
 
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************
call echo ("****************START OF DETAIL RECORD********************")
 
free record A_detail 
record A_detail
   (1 IV   = c15
    1 O2   = c15
    1 preg = c15
    1 iso  = c20
    1 LMP  = c15
    1 comment_type1 = vc
    1 comment_type2 = vc
    1 comment_text1 = vc
    1 comment_text2 = vc
    1 detail1 = vc
    1 detail2 = vc
    1 detail3 = vc
    1 detail4 = vc
    1 detail5 = vc
    1 detail6 = vc
    1 detail7 = vc
    1 detail8 = vc
    1 detail9 = vc
    1 detail10 = vc
)
 


