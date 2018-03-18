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
 
        Source file name:       rad_packet_lab_results_data.inc
        Object name:            n/a
        Request #:              multiple
 
        Product:                GARPP
        Product Team:           Radnet
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        data fields for placing lab data on the requisition
 
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
;     001 03/06/06 Jason Buchanan        Renaming of lab_results record     *
;                                         structure to rad_lab_results      *
;~DE~************************************************************************
 
 
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************
 call echo("*****START OF LAB RESULTS DATA*****")

;Lab 1
 
;001 BEGIN renaming of lab_values to rad_lab_values
if(size(rad_lab_values->lab_exams,5)>0)
 
;lab1 low range
 
        if(size(rad_lab_values->lab_exams[1]->lab_normal_low) > 0)
            A_lab_result->low_1 = rad_lab_values->lab_exams[1]->lab_normal_low
        endif
 
;lab1 high range
 
        if(size(rad_lab_values->lab_exams[1]->lab_normal_high) > 0)
           A_lab_result->high_1 = rad_lab_values->lab_exams[1]->lab_normal_high
        endif
 
;lab1 result
 
        if(size(rad_lab_values->lab_exams[1]->result_val) > 0)
            A_lab_result->result_1 = rad_lab_values->lab_exams[1]->result_val
        endif
 
;lab1 date
 
        if (size(rad_lab_values->lab_exams[1]->perform_dt_tm) > 0)
            A_lab_result->result_date_1= rad_lab_values->
                            lab_exams[1]->perform_dt_tm
        endif
 
endif
 
 
;Lab2
 
if(size(rad_lab_values->lab_exams,5)>1)
 
;lab2 low range
 
        if(size(rad_lab_values->lab_exams[2]->lab_normal_low) > 0)
            A_lab_result->low_2 = rad_lab_values->lab_exams[2]->lab_normal_low
        endif
 
;lab2 high range
 
        if(size(rad_lab_values->lab_exams[2]->lab_normal_high) > 0)
           A_lab_result->high_2 = rad_lab_values->lab_exams[2]->lab_normal_high
        endif
 
;lab2 result
 
        if(size(rad_lab_values->lab_exams[2]->result_val) > 0)
            A_lab_result->result_2 = rad_lab_values->lab_exams[2]->result_val
        endif
 
;lab2 date
 
        if (size(rad_lab_values->lab_exams[2]->perform_dt_tm) > 0)
            A_lab_result->result_date_2= rad_lab_values->
                          lab_exams[2]->perform_dt_tm
        endif
 
endif
 
;Lab3
 
if(size(rad_lab_values->lab_exams,5) > 2)
 
;lab3 low range
 
        if(size(rad_lab_values->lab_exams[3]->lab_normal_low) > 0)
            A_lab_result->low_3 = rad_lab_values->lab_exams[3]->lab_normal_low
        endif
 
;lab3 high range
 
        if(size(rad_lab_values->lab_exams[3]->lab_normal_high) > 0)
           A_lab_result->high_3 = rad_lab_values->lab_exams[3]->lab_normal_high
        endif
 
;lab3 result
 
        if(size(rad_lab_values->lab_exams[3]->result_val) > 0)
            A_lab_result->result_3 = rad_lab_values->lab_exams[3]->result_val
        endif
 
;lab3 date
 
        if (size(rad_lab_values->lab_exams[3]->perform_dt_tm) > 0)
               A_lab_result->result_date_3= rad_lab_values->
                             lab_exams[3]->perform_dt_tm
        endif
 
endif
 
;Lab4
 
if(size(rad_lab_values->lab_exams,5)>3)
 
;lab4 low range
 
        if(size(rad_lab_values->lab_exams[4]->lab_normal_low) > 0)
            A_lab_result->low_4 = rad_lab_values->lab_exams[4]->lab_normal_low
        endif
 
;lab4 high range
 
        if(size(rad_lab_values->lab_exams[4]->lab_normal_high) > 0)
           A_lab_result->high_4 = rad_lab_values->lab_exams[4]->lab_normal_high
        endif
 
;lab4 result
 
        if(size(rad_lab_values->lab_exams[4]->result_val) > 0)
            A_lab_result->result_4 = rad_lab_values->lab_exams[4]->result_val
        endif
 
;lab4 date
 
        if (size(rad_lab_values->lab_exams[4]->perform_dt_tm) > 0)
                A_lab_result->result_date_4= rad_lab_values->
                          lab_exams[4]->perform_dt_tm
        endif
 
endif
 
;Lab5
 
if(size(rad_lab_values->lab_exams,5)> 4)
;lab5 low range
 
        if(size(rad_lab_values->lab_exams[5]->lab_normal_low) > 0)
            A_lab_result->low_5 = rad_lab_values->lab_exams[5]->lab_normal_low
        endif
 
;lab5 high range
 
        if(size(rad_lab_values->lab_exams[5]->lab_normal_high) > 0)
           A_lab_result->high_5 = rad_lab_values->lab_exams[5]->lab_normal_high
        endif
 
;lab5 result
 
        if(size(rad_lab_values->lab_exams[5]->result_val) > 0)
            A_lab_result->result_5 = rad_lab_values->lab_exams[5]->result_val
        endif
 
;lab5 date
 
        if (size(rad_lab_values->lab_exams[5]->perform_dt_tm) > 0)
            A_lab_result->result_date_5= rad_lab_values->
                           lab_exams[5]->perform_dt_tm
        endif
 
endif
 
;Lab6
 
if(size(rad_lab_values->lab_exams,5) > 5)
 
;lab6 low range
 
        if(size(rad_lab_values->lab_exams[6]->lab_normal_low) > 0)
            A_lab_result->low_6 = rad_lab_values->lab_exams[6]->lab_normal_low
        endif
 
;lab6 high range
 
        if(size(rad_lab_values->lab_exams[6]->lab_normal_high) > 0)
           A_lab_result->high_6 = rad_lab_values->lab_exams[6]->lab_normal_high
        endif
 
;lab6 result
 
        if(size(rad_lab_values->lab_exams[6]->result_val) > 0)
            A_lab_result->result_6 = rad_lab_values->lab_exams[6]->result_val
        endif
 
;lab6 date
 
        if (size(rad_lab_values->lab_exams[6]->perform_dt_tm) > 0)
                 A_lab_result->result_date_6= rad_lab_values->
                         lab_exams[6]->perform_dt_tm
        endif
 
endif
 
;Lab7
 
if(size(rad_lab_values->lab_exams,5) > 6)
 
;lab7 low range
 
        if(size(rad_lab_values->lab_exams[7]->lab_normal_low) > 0)
            A_lab_result->low_7 = rad_lab_values->lab_exams[7]->lab_normal_low
        endif
 
;lab7 high range
 
        if(size(rad_lab_values->lab_exams[7]->lab_normal_high) > 0)
           A_lab_result->high_7 = rad_lab_values->lab_exams[7]->lab_normal_high
        endif
 
;lab7 result
 
        if(size(rad_lab_values->lab_exams[7]->result_val) > 0)
            A_lab_result->result_7 = rad_lab_values->lab_exams[7]->result_val
        endif
 
;lab7 date
 
        if (size(rad_lab_values->lab_exams[7]->perform_dt_tm) > 0)
                    A_lab_result->result_date_7= rad_lab_values->
                        lab_exams[7]->perform_dt_tm
        endif
 
endif
 
;Lab8
 
if(size(rad_lab_values->lab_exams,5) > 7)
 
;lab8 low range
 
        if(size(rad_lab_values->lab_exams[8]->lab_normal_low) > 0)
            A_lab_result->low_8 = rad_lab_values->lab_exams[8]->lab_normal_low
        endif
 
;lab8 high range
 
        if(size(rad_lab_values->lab_exams[8]->lab_normal_high) > 0)
           A_lab_result->high_8 = rad_lab_values->lab_exams[8]->lab_normal_high
        endif
 
;lab8 result
 
        if(size(rad_lab_values->lab_exams[8]->result_val) > 0)
            A_lab_result->result_8 = rad_lab_values->lab_exams[8]->result_val
        endif
 
;lab8 date
 
        if (size(rad_lab_values->lab_exams[8]->perform_dt_tm) > 0)
                A_lab_result->result_date_8= rad_lab_values->
                            lab_exams[8]->perform_dt_tm
        endif
 
endif
 
;Lab9
 
if(size(rad_lab_values->lab_exams,5) > 8)
 
;lab9 low range
 
        if(size(rad_lab_values->lab_exams[9]->lab_normal_low) > 0)
            A_lab_result->low_9 = rad_lab_values->lab_exams[9]->lab_normal_low
        endif
 
;lab9 high range
 
        if(size(rad_lab_values->lab_exams[9]->lab_normal_high) > 0)
           A_lab_result->high_9 = rad_lab_values->lab_exams[9]->lab_normal_high
        endif
 
;lab9 result
 
        if(size(rad_lab_values->lab_exams[9]->result_val) > 0)
            A_lab_result->result_9 = rad_lab_values->lab_exams[9]->result_val
        endif
 
;lab9 date
 
        if (size(rad_lab_values->lab_exams[9]->perform_dt_tm) > 0)
            A_lab_result->result_date_9= rad_lab_values->
                          lab_exams[9]->perform_dt_tm
        endif
 
endif
 
;Lab10
 
if(size(rad_lab_values->lab_exams,5) > 9)
 
;lab10 low range
 
        if(size(rad_lab_values->lab_exams[10]->lab_normal_low) > 0)
            A_lab_result->low_10 = rad_lab_values->lab_exams[10]->lab_normal_low
        endif
 
;lab10 high range
 
        if(size(rad_lab_values->lab_exams[10]->lab_normal_high) > 0)
           A_lab_result->high_10 = rad_lab_values->lab_exams[10]->lab_normal_high
        endif
 
;lab10 result
 
        if(size(rad_lab_values->lab_exams[10]->result_val) > 0)
            A_lab_result->result_10 = rad_lab_values->lab_exams[10]->result_val
        endif
 
;lab10 date
 
        if (size(rad_lab_values->lab_exams[10]->perform_dt_tm) > 0)
            A_lab_result->result_date_10 = rad_lab_values->
                           lab_exams[10]->perform_dt_tm
        endif
 
endif
 
;Lab11
 
if(size(rad_lab_values->lab_exams,5) > 9)
 
;lab11 low range
 
        if(size(rad_lab_values->lab_exams[11]->lab_normal_low) > 0)
            A_lab_result->low_11 = rad_lab_values->lab_exams[11]->lab_normal_low
        endif
 
;lab11 high range
 
        if(size(rad_lab_values->lab_exams[11]->lab_normal_high) > 0)
           A_lab_result->high_11 = rad_lab_values->lab_exams[11]->lab_normal_high
        endif
 
;lab11 result
 
        if(size(rad_lab_values->lab_exams[11]->result_val) > 0)
            A_lab_result->result_11 = rad_lab_values->lab_exams[11]->result_val
        endif
 
;lab11 date
 
        if (size(rad_lab_values->lab_exams[11]->perform_dt_tm) > 0)
                A_lab_result->result_date_11= rad_lab_values->
                           lab_exams[11]->perform_dt_tm
        endif
 
endif
 
;Lab12
 
if(size(rad_lab_values->lab_exams,5) > 9)
 
;lab12 low range
 
        if(size(rad_lab_values->lab_exams[12]->lab_normal_low) > 0)
            A_lab_result->low_12 = rad_lab_values->lab_exams[12]->lab_normal_low
        endif
 
;lab12 high range
 
        if(size(rad_lab_values->lab_exams[12]->lab_normal_high) > 0)
           A_lab_result->high_12 = rad_lab_values->lab_exams[12]->lab_normal_high
        endif
 
;lab12 result
 
        if(size(rad_lab_values->lab_exams[12]->result_val) > 0)
            A_lab_result->result_12 = rad_lab_values->lab_exams[12]->result_val
        endif
 
;lab12 date
 
        if (size(rad_lab_values->lab_exams[12]->perform_dt_tm) > 0)
                A_lab_result->result_date_12 = rad_lab_values->
                       lab_exams[12]->perform_dt_tm
        endif
 
endif
;001 END renaming of lab_values to rad_lab_values


