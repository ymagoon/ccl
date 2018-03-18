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
 
        Source file name:       rad_packet_lab_results_record.inc
        Object name:            n/a
        Request #:              multiple
 
        Product:                GARPP
        Product Team:           Radnet
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        record structure for lab data
 
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
call echo("*****START OF LAB RESULTS RECORD*****")
 
free record A_lab_result
record A_lab_result
   (1 low_1            = vc
    1 high_1           = vc
    1 result_1         = vc
    1 result_date_1    = dq8
    1 low_2            = vc
    1 high_2           = vc
    1 result_2         = vc
    1 result_date_2    = dq8
    1 low_3            = vc
    1 high_3           = vc
    1 result_3         = vc
    1 result_date_3    = dq8
    1 low_4            = vc
    1 high_4           = vc
    1 result_4         = vc
    1 result_date_4    = dq8
    1 low_5            = vc
    1 high_5           = vc
    1 result_5         = vc
    1 result_date_5    = dq8
    1 low_6            = vc
    1 high_6           = vc
    1 result_6         = vc
    1 result_date_6    = dq8
    1 low_7            = vc
    1 high_7           = vc
    1 result_7         = vc
    1 result_date_7    = dq8
    1 low_8            = vc
    1 high_8           = vc
    1 result_8         = vc
    1 result_date_8    = dq8
    1 low_9            = vc
    1 high_9           = vc
    1 result_9         = vc
    1 result_date_9    = dq8
    1 low_10           = vc
    1 high_10          = vc
    1 result_10        = vc
    1 result_date_10   = dq8
    1 low_11           = vc
    1 high_11          = vc
    1 result_11        = vc
    1 result_date_11   = dq8
    1 low_12           = vc
    1 high_12          = vc
    1 result_12        = vc
    1 result_date_12   = dq8
)


