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
 
        Source file name:       rad_packet_exam_record.inc
        Object name:            n/a
        Request #:              multiple
 
        Product:                GARPP
        Product Team:           Radnet
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        record structure for exam data
 
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
;     ### 08/19/03 Tammy Baack/Sandra Prow Initial Release                  *
;~DE~************************************************************************
 
 
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************
 call echo ("****************START OF EXAM RECORD********************")

free record A_exam 

record A_exam
   (1 accession         = c20
    1 bc_acc_nbr        = c22
    1 exam_name_1             = vc
    1 order_date_1      = dq8
    1 order_time_1      = dq8
    1 rqst_date_1       = dq8
    1 rqst_time_1       = dq8
    1 start_date_1      = dq8
    1 start_time_1      = dq8
    1 exam_section_1    = vc
    1 reason_for_exam_1 = vc
    1 special_instr_1   = vc
    1 comments_1        = vc
    1 priority_1        = vc
    1 transport_mode_1  = vc
    1 order_by_id_1     = c20
    1 order_by_name_1   = vc
    1 order_by_user_name_1  = vc
    1 exam_room_1       = vc
    1 order_location_1  = vc
    1 order_loc_phone_1 = vc
    
 
    1 exam_name_2               = vc
    1 order_date_2      = dq8
    1 order_time_2      = dq8
    1 rqst_date_2       = dq8
    1 rqst_time_2       = dq8
    1 start_date_2      = dq8
    1 start_time_2      = dq8
    1 exam_section_2    = vc
    1 reason_for_exam_2 = vc
    1 special_instr_2   = vc
    1 priority_2        = vc
    1 transport_mode_2  = vc
    1 order_by_id_2     = c20
    1 order_by_name_2   = vc
    1 order_by_user_name_2  = vc
    1 exam_room_2       = vc
    1 order_location_2  = vc
    1 order_loc_phone_2 = vc

    1 exam_name_3               = vc
    1 order_date_3      = dq8
    1 order_time_3      = dq8
    1 rqst_date_3       = dq8
    1 rqst_time_3       = dq8
    1 start_date_3      = dq8
    1 start_time_3      = dq8
    1 exam_section_3    = vc
    1 reason_for_exam_3 = vc
    1 special_instr_3   = vc
    1 priority_3        = vc
    1 transport_mode_3  = vc
    1 order_by_id_3     = c20
    1 order_by_name_3   = vc
    1 order_by_user_name_3  = vc
    1 exam_room_3       = vc
    1 order_location_3  = vc
    1 order_loc_phone_3 = vc   
 
    1 exam_name_4             = vc
    1 order_date_4      = dq8
    1 order_time_4      = dq8
    1 rqst_date_4       = dq8
    1 rqst_time_4       = dq8
    1 start_date_4      = dq8
    1 start_time_4      = dq8
    1 reason_for_exam_4 = vc
    1 special_instr_4   = vc
    1 exam_section_4    = vc
    1 priority_4        = vc
    1 transport_mode_4  = vc
    1 order_by_id_4     = c20
    1 order_by_name_4   = vc
    1 order_by_user_name_4  = vc
    1 exam_room_4       = vc
    1 order_location_4  = vc
    1 order_loc_phone_4 = vc

    
    1 exam_name_5       = vc
    1 order_date_5      = dq8
    1 order_time_5      = dq8
    1 rqst_date_5       = dq8
    1 rqst_time_5       = dq8
    1 start_date_5      = dq8
    1 start_time_5      = dq8
    1 exam_section_5    = vc
    1 reason_for_exam_5 = vc
    1 special_instr_5   = vc
    1 priority_5        = vc
    1 transport_mode_5  = vc
    1 order_by_id_5     = c20
    1 order_by_name_5   = vc
    1 order_by_user_name_5  = vc
    1 exam_room_5       = vc
    1 order_location_5  = vc
    1 order_loc_phone_5 = vc

    
    1 exam_name_6               = vc
    1 order_date_6      = dq8
    1 order_time_6      = dq8
    1 rqst_date_6       = dq8
    1 rqst_time_6       = dq8
    1 start_date_6      = dq8
    1 start_time_6      = dq8
    1 exam_section_6    = vc
    1 reason_for_exam_6 = vc
    1 special_instr_6   = vc
    1 priority_6        = vc
    1 transport_mode_6  = vc
    1 order_by_id_6     = c20
    1 order_by_name_6   = vc
    1 order_by_user_name_6  = vc
    1 exam_room_6       = vc
    1 order_location_6  = vc
    1 order_loc_phone_6 = vc
  
 
    1 exam_name_7             = vc
    1 order_date_7      = dq8
    1 order_time_7      = dq8
    1 rqst_date_7       = dq8
    1 rqst_time_7       = dq8
    1 start_date_7      = dq8
    1 start_time_7      = dq8
    1 exam_section_7    = vc
    1 reason_for_exam_7 = vc
    1 special_instr_7   = vc
    1 priority_7        = vc
    1 transport_mode_7  = vc
    1 order_by_id_7     = c20
    1 order_by_name_7   = vc
    1 order_by_user_name_7  = vc
    1 exam_room_7       = vc
    1 order_location_7  = vc
    1 order_loc_phone_7 = vc

   
    1 exam_name_8               = vc
    1 order_date_8      = dq8
    1 order_time_8      = dq8
    1 rqst_date_8       = dq8
    1 rqst_time_8       = dq8
    1 start_date_8      = dq8
    1 start_time_8      = dq8
    1 exam_section_8    = vc
    1 reason_for_exam_8 = vc
    1 special_instr_8   = vc
    1 priority_8        = vc
    1 transport_mode_8  = vc
    1 order_by_id_8     = c20
    1 order_by_name_8   = vc
    1 order_by_user_name_8  = vc
    1 exam_room_8       = vc
    1 order_location_8  = vc
    1 order_loc_phone_8 = vc

     
    1 exam_name_9               = vc
    1 order_date_9      = dq8
    1 order_time_9      = dq8
    1 rqst_date_9       = dq8
    1 rqst_time_9       = dq8
    1 start_date_9      = dq8
    1 start_time_9      = dq8
    1 exam_section_9    = vc
    1 reason_for_exam_9 = vc
    1 special_instr_9   = vc
    1 priority_9        = vc
    1 transport_mode_9  = vc
    1 order_by_id_9     = c20
    1 order_by_name_9   = vc
    1 order_by_user_name_9  = vc
    1 exam_room_9       = vc
    1 order_location_9  = vc
    1 order_loc_phone_9 = vc

    
    1 exam_name_10       = vc
    1 order_date_10      = dq8
    1 order_time_10      = dq8
    1 rqst_date_10       = dq8
    1 rqst_time_10       = dq8
    1 start_date_10      = dq8
    1 start_time_10      = dq8
    1 exam_section_10    = vc
    1 reason_for_exam_10 = vc
    1 special_instr_10   = vc
    1 priority_10        = vc
    1 transport_mode_10  = vc
    1 order_by_id_10     = c20
    1 order_by_name_10   = vc
    1 order_by_user_name_10  = vc
    1 exam_room_10       = vc
    1 order_location_10  = vc
    1 order_loc_phone_10 = vc

    )


