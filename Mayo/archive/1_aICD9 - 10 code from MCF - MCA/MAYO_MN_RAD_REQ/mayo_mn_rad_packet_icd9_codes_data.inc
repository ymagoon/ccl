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
 
        Source file name:       rad_packet_icd9_codes_data.inc
        Object name:            n/a
        Request #:              multiple
 
        Product:                GARPP
        Product Team:           Radnet
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        Data fields for ICD9 codes to print on patient packet
 
        Tables read:            many
 
        Tables updated:         none
        Executing from:         ?
 
        Special Notes:          ?
 
******************************************************************************/
;~DB~************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *Mod Date     Engineer             Feature                 Comment             *
;    *--- -------- -------------------- --------------- ------------------- *
;     ### 08/19/03 Tammy Baack/Sandra Prow                              Initial Release     *
;        *001 01/25/06 Sean Turk                        78168                   CR 1-577563874 adjust A_ICD9 to
;                                                                                                               be consistent across GARPP.  Almost all
;                                                                                                               lines of code adjusted.
;~DE~************************************************************************
 
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************
call echo("*****START OF ICD9 CODES DATA*****")
 
if (size(icd9->exam,5) > data->req[req_ndx]->sections[sect_ndx]->nbr_of_exams_per_req)  ;001
        exam_ndx = exam_ndx + (x-1)*(data->req[req_ndx]->sections[sect_ndx]->nbr_of_exams_per_req)      ;001
endif   ;001
 
stat = initrec(A_ICD9)  ;001
 
if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                         ->for_this_page,5) > 0)
;exam 1 icd9 1
    if (size(icd9->exam,5) >= exam_ndx)
        if (size(icd9->exam[exam_ndx]->code,5) > 0)
            if (icd9->exam[exam_ndx]->code[1]->value != " ")
                A_ICD9->icd9_1_1 = icd9->exam[exam_ndx]->code[1]->value
                A_ICD9->icd9_1_desc_1 = icd9->exam[exam_ndx]->code[1]->desc
            else
                A_ICD9->icd9_1_1 = " "
                A_ICD9->icd9_1_desc_1 = " "
            endif
        else
            A_ICD9->icd9_1_1 = " "
            A_ICD9->icd9_1_desc_1 = " "
        endif
    else
        A_ICD9->icd9_1_1 = " "
        A_ICD9->icd9_1_desc_1 = " "
    endif
 
;exam 1 icd9 2
 
    if (size(icd9->exam,5) >= exam_ndx)
        if (size(icd9->exam[exam_ndx]->code,5) > 1)
            if (icd9->exam[exam_ndx]->code[2]->value != " ")
                A_ICD9->icd9_1_2 = icd9->exam[exam_ndx]->code[2]->value
                A_ICD9->icd9_1_desc_2 = icd9->exam[exam_ndx]->code[2]->desc
            else
                                A_ICD9->icd9_1_2 = " "
                A_ICD9->icd9_1_desc_2 = " "
            endif
        else
                        A_ICD9->icd9_1_2 = " "
            A_ICD9->icd9_1_desc_2 = " "
        endif
    else
        A_ICD9->icd9_1_2 = " "
        A_ICD9->icd9_1_desc_2 = " "
    endif
 
 
 
;exam 1 icd9 3
 
    if (size(icd9->exam,5) >= exam_ndx)
        if (size(icd9->exam[exam_ndx]->code,5) > 2)
            if (icd9->exam[exam_ndx]->code[3]->value != " ")
                A_ICD9->icd9_1_3 = icd9->exam[exam_ndx]->code[3]->value
                    A_ICD9->icd9_1_desc_3 = icd9->exam[exam_ndx]->code[3]->desc
            else
                A_ICD9->icd9_1_3 = " "
                A_ICD9->icd9_1_desc_3 = " "
            endif
        else
            A_ICD9->icd9_1_3 = " "
            A_ICD9->icd9_1_desc_3 = " "
        endif
    else
        A_ICD9->icd9_1_3 = " "
        A_ICD9->icd9_1_desc_3 = " "
    endif
 
 
;exam 1 icd9 4
     if (size(icd9->exam,5) >= exam_ndx)
        if (size(icd9->exam[exam_ndx]->code,5) > 3)
            if (icd9->exam[exam_ndx]->code[4]->value != " ")
                A_ICD9->icd9_1_4 = icd9->exam[exam_ndx]->code[3]->value
                A_ICD9->icd9_1_desc_4 = icd9->exam[exam_ndx]->code[4]->desc
            else
                A_ICD9->icd9_1_4 = " "
                A_ICD9->icd9_1_desc_4 = " "
            endif
        else
            A_ICD9->icd9_1_4 = " "
            A_ICD9->icd9_1_desc_4 = " "
        endif
    else
        A_ICD9->icd9_1_4 = " "
        A_ICD9->icd9_1_desc_4 = " "
    endif
endif
;exam 2 icd9 1
 
if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                         ->for_this_page,5) > 1)
 
    if (size(icd9->exam,5) >= exam_ndx + 1)
        if (size(icd9->exam[exam_ndx + 1]->code,5) > 0)
            if (icd9->exam[exam_ndx + 1]->code[1]->value != " ")
                A_ICD9->icd9_2_1 = icd9->exam[exam_ndx + 1]->code[1]->value
                A_ICD9->icd9_2_desc_1 = icd9->exam[exam_ndx + 1]->code[1]->desc
            else
                A_ICD9->icd9_2_1 = " "
                A_ICD9->icd9_2_desc_1 = " "
            endif
        else
            A_ICD9->icd9_2_1 = " "
            A_ICD9->icd9_2_desc_1 = " "
        endif
    else
        A_ICD9->icd9_2_1 = " "
        A_ICD9->icd9_2_desc_1 = " "
    endif
 
;exam 2 icd9 2
    if (size(icd9->exam,5) >= exam_ndx + 1)
        if (size(icd9->exam[exam_ndx + 1]->code,5) > 1)
            if (icd9->exam[exam_ndx + 1]->code[2]->value != " ")
                A_ICD9->icd9_2_2 = icd9->exam[exam_ndx + 1]->code[2]->value
                A_ICD9->icd9_2_desc_2 = icd9->exam[exam_ndx + 1]->code[2]->desc
            else
                A_ICD9->icd9_2_2 = " "
                A_ICD9->icd9_2_desc_2 = " "
            endif
        else
            A_ICD9->icd9_2_2 = " "
            A_ICD9->icd9_2_desc_2 = " "
        endif
    else
        A_ICD9->icd9_2_2 = " "
        A_ICD9->icd9_2_desc_2 = " "
    endif
 
 ;exam 2 icd9 3
    if (size(icd9->exam,5) >= exam_ndx + 1)
        if (size(icd9->exam[exam_ndx + 1]->code,5) > 2)
            if (icd9->exam[exam_ndx + 1]->code[3]->value != " ")
                A_ICD9->icd9_2_3 = icd9->exam[exam_ndx + 1]->code[3]->value
                A_ICD9->icd9_2_desc_3 = icd9->exam[exam_ndx + 1]->code[3]->desc
            else
                A_ICD9->icd9_2_3 = " "
                A_ICD9->icd9_2_desc_3 = " "
            endif
        else
            A_ICD9->icd9_2_3 = " "
            A_ICD9->icd9_2_desc_3 = " "
        endif
    else
        A_ICD9->icd9_2_3 = " "
        A_ICD9->icd9_2_desc_3 = " "
    endif
 
;exam 2 icd9 4
    if (size(icd9->exam,5) >= exam_ndx + 1)
        if (size(icd9->exam[exam_ndx + 1]->code,5) > 3)
            if (icd9->exam[exam_ndx + 1]->code[4]->value != " ")
                A_ICD9->icd9_2_4 = icd9->exam[exam_ndx + 1]->code[4]->value
                A_ICD9->icd9_2_desc_4 = icd9->exam[exam_ndx + 1]->code[4]->desc
            else
                A_ICD9->icd9_2_4 = " "
                A_ICD9->icd9_2_desc_4 = " "
            endif
        else
            A_ICD9->icd9_2_4 = " "
            A_ICD9->icd9_2_desc_4 = " "
        endif
    else
        A_ICD9->icd9_2_4 = " "
        A_ICD9->icd9_2_desc_4 = " "
    endif
endif
 
;exam 3 icd9 1
if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                         ->for_this_page,5) > 2)
 
    if (size(icd9->exam,5) >= exam_ndx + 2)
        if (size(icd9->exam[exam_ndx + 2]->code,5) > 0)
            if (icd9->exam[exam_ndx + 2]->code[1]->value != " ")
                A_ICD9->icd9_3_1 = icd9->exam[exam_ndx + 2]->code[1]->value
                A_ICD9->icd9_3_desc_1 = icd9->exam[exam_ndx + 2]->code[1]->desc
            else
                A_ICD9->icd9_3_1 = " "
                A_ICD9->icd9_3_desc_1 = " "
            endif
        else
            A_ICD9->icd9_3_1 = " "
            A_ICD9->icd9_3_desc_1 = " "
        endif
    else
        A_ICD9->icd9_3_1 = " "
        A_ICD9->icd9_3_desc_1 = " "
    endif
 
;exam 3 icd9 2
    if (size(icd9->exam,5) >= exam_ndx + 2)
        if (size(icd9->exam[exam_ndx + 2]->code,5) > 1)
            if (icd9->exam[exam_ndx + 2]->code[2]->value != " ")
                A_ICD9->icd9_3_2 = icd9->exam[exam_ndx + 2]->code[2]->value
                A_ICD9->icd9_3_desc_2 = icd9->exam[exam_ndx + 2]->code[2]->desc
            else
                A_ICD9->icd9_3_2 = " "
                A_ICD9->icd9_3_desc_2 = " "
            endif
        else
            A_ICD9->icd9_3_2 = " "
            A_ICD9->icd9_3_desc_2 = " "
        endif
    else
        A_ICD9->icd9_3_2 = " "
        A_ICD9->icd9_3_desc_2 = " "
    endif
 
 ;exam 3 icd9 3
    if (size(icd9->exam,5) >= exam_ndx + 2)
        if (size(icd9->exam[exam_ndx + 2]->code,5) > 2)
            if (icd9->exam[exam_ndx + 2]->code[3]->value != " ")
                A_ICD9->icd9_3_3 = icd9->exam[exam_ndx + 2]->code[3]->value
                A_ICD9->icd9_3_desc_3 = icd9->exam[exam_ndx + 2]->code[3]->desc
            else
                A_ICD9->icd9_3_3 = " "
                A_ICD9->icd9_3_desc_3 = " "
            endif
        else
            A_ICD9->icd9_3_3 = " "
            A_ICD9->icd9_3_desc_3 = " "
        endif
    else
        A_ICD9->icd9_3_3 = " "
        A_ICD9->icd9_3_desc_3 = " "
    endif
 
;exam 3 icd9 4
    if (size(icd9->exam,5) >= exam_ndx + 2)
        if (size(icd9->exam[exam_ndx + 2]->code,5) > 3)
            if (icd9->exam[exam_ndx + 2]->code[4]->value != " ")
                A_ICD9->icd9_3_4 = icd9->exam[exam_ndx + 2]->code[4]->value
                A_ICD9->icd9_3_desc_4 = icd9->exam[exam_ndx + 2]->code[4]->desc
            else
                A_ICD9->icd9_3_4 = " "
                A_ICD9->icd9_3_desc_4 = " "
            endif
        else
            A_ICD9->icd9_3_4 = " "
            A_ICD9->icd9_3_desc_4 = " "
        endif
    else
        A_ICD9->icd9_3_4 = " "
        A_ICD9->icd9_3_desc_4 = " "
    endif
endif
;exam 4 icd9 1
if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                         ->for_this_page,5) > 3)
 
    if (size(icd9->exam,5) >= exam_ndx + 3)
        if (size(icd9->exam[exam_ndx + 3]->code,5) > 0)
            if (icd9->exam[exam_ndx + 3]->code[1]->value != " ")
                A_ICD9->icd9_4_1 = icd9->exam[exam_ndx + 3]->code[1]->value
                A_ICD9->icd9_4_desc_1 = icd9->exam[exam_ndx + 3]->code[1]->desc
            else
                A_ICD9->icd9_4_1 = " "
                A_ICD9->icd9_4_desc_1 = " "
            endif
        else
            A_ICD9->icd9_4_1 = " "
            A_ICD9->icd9_4_desc_1 = " "
        endif
    else
        A_ICD9->icd9_4_1 = " "
        A_ICD9->icd9_4_desc_1 = " "
    endif
 
;exam 4 icd9 2
    if (size(icd9->exam,5) >= exam_ndx + 3)
        if (size(icd9->exam[exam_ndx + 3]->code,5) > 1)
            if (icd9->exam[exam_ndx + 3]->code[2]->value != " ")
                A_ICD9->icd9_4_2 = icd9->exam[exam_ndx + 3]->code[2]->value
                A_ICD9->icd9_4_desc_2 = icd9->exam[exam_ndx + 3]->code[2]->desc
            else
                A_ICD9->icd9_4_2 = " "
                A_ICD9->icd9_4_desc_2 = " "
            endif
        else
            A_ICD9->icd9_4_2 = " "
            A_ICD9->icd9_4_desc_2 = " "
        endif
    else
        A_ICD9->icd9_4_2 = " "
        A_ICD9->icd9_4_desc_2 = " "
    endif
 
 ;exam 4 icd9 3
    if (size(icd9->exam,5) >= exam_ndx + 3)
        if (size(icd9->exam[exam_ndx + 3]->code,5) > 2)
            if (icd9->exam[exam_ndx + 3]->code[3]->value != " ")
                A_ICD9->icd9_4_3 = icd9->exam[exam_ndx + 3]->code[3]->value
                A_ICD9->icd9_4_desc_3 = icd9->exam[exam_ndx + 3]->code[3]->desc
            else
                A_ICD9->icd9_4_3 = " "
                A_ICD9->icd9_4_desc_3 = " "
            endif
        else
            A_ICD9->icd9_4_3 = " "
            A_ICD9->icd9_4_desc_3 = " "
        endif
    else
        A_ICD9->icd9_4_3 = " "
        A_ICD9->icd9_4_desc_3 = " "
    endif
 
;exam 4 icd9 4
    if (size(icd9->exam,5) >= exam_ndx + 3)
        if (size(icd9->exam[exam_ndx + 3]->code,5) > 3)
            if (icd9->exam[exam_ndx + 3]->code[4]->value != " ")
                A_ICD9->icd9_4_4 = icd9->exam[exam_ndx + 3]->code[4]->value
                A_ICD9->icd9_4_desc_4 = icd9->exam[exam_ndx + 3]->code[4]->desc
            else
                A_ICD9->icd9_4_4 = " "
                A_ICD9->icd9_4_desc_4 = " "
            endif
        else
            A_ICD9->icd9_4_4 = " "
            A_ICD9->icd9_4_desc_4 = " "
        endif
    else
        A_ICD9->icd9_4_4 = " "
        A_ICD9->icd9_4_desc_4 = " "
    endif
endif
 
;exam 5 icd9 1
if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                         ->for_this_page,5) > 4)
 
    if (size(icd9->exam,5) >= exam_ndx + 4)
        if (size(icd9->exam[exam_ndx + 4]->code,5) > 0)
            if (icd9->exam[exam_ndx + 4]->code[1]->value != " ")
                A_ICD9->icd9_5_1 = icd9->exam[exam_ndx + 4]->code[1]->value
                A_ICD9->icd9_5_desc_1 = icd9->exam[exam_ndx + 4]->code[1]->desc
            else
                A_ICD9->icd9_5_1 = " "
                A_ICD9->icd9_5_desc_1 = " "
            endif
        else
            A_ICD9->icd9_5_1 = " "
            A_ICD9->icd9_5_desc_1 = " "
        endif
    else
        A_ICD9->icd9_5_1 = " "
        A_ICD9->icd9_5_desc_1 = " "
    endif
 
;exam 5 icd9 2
    if (size(icd9->exam,5) >= exam_ndx + 4)
        if (size(icd9->exam[exam_ndx + 4]->code,5) > 1)
            if (icd9->exam[exam_ndx + 4]->code[2]->value != " ")
                A_ICD9->icd9_5_2 = icd9->exam[exam_ndx + 4]->code[2]->value
                A_ICD9->icd9_5_desc_2 = icd9->exam[exam_ndx + 4]->code[2]->desc
            else
                A_ICD9->icd9_5_2 = " "
                A_ICD9->icd9_5_desc_2 = " "
            endif
        else
            A_ICD9->icd9_5_2 = " "
            A_ICD9->icd9_5_desc_2 = " "
        endif
    else
        A_ICD9->icd9_5_2 = " "
        A_ICD9->icd9_5_desc_2 = " "
    endif
 
 ;exam 5 icd9 3
    if (size(icd9->exam,5) >= exam_ndx + 4)
        if (size(icd9->exam[exam_ndx + 4]->code,5) > 2)
            if (icd9->exam[exam_ndx + 4]->code[3]->value != " ")
                A_ICD9->icd9_5_3 = icd9->exam[exam_ndx + 4]->code[3]->value
                A_ICD9->icd9_5_desc_3 = icd9->exam[exam_ndx + 4]->code[3]->desc
            else
                A_ICD9->icd9_5_3 = " "
                A_ICD9->icd9_5_desc_3 = " "
            endif
        else
            A_ICD9->icd9_5_3 = " "
            A_ICD9->icd9_5_desc_3 = " "
        endif
    else
        A_ICD9->icd9_5_3 = " "
        A_ICD9->icd9_5_desc_3 = " "
    endif
 
;exam 5 icd9 4
    if (size(icd9->exam,5) >= exam_ndx + 4)
        if (size(icd9->exam[exam_ndx + 4]->code,5) > 3)
            if (icd9->exam[exam_ndx + 4]->code[4]->value != " ")
                A_ICD9->icd9_5_4 = icd9->exam[exam_ndx + 4]->code[4]->value
                A_ICD9->icd9_5_desc_4 = icd9->exam[exam_ndx + 4]->code[4]->desc
            else
                A_ICD9->icd9_5_4 = " "
                A_ICD9->icd9_5_desc_4 = " "
            endif
        else
            A_ICD9->icd9_5_4 = " "
            A_ICD9->icd9_5_desc_4 = " "
        endif
    else
        A_ICD9->icd9_5_4 = " "
        A_ICD9->icd9_5_desc_4 = " "
    endif
endif
;exam 6 icd9 1
if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                         ->for_this_page,5) > 5)
 
    if (size(icd9->exam,5) >= exam_ndx + 5)
        if (size(icd9->exam[exam_ndx + 5]->code,5) > 0)
            if (icd9->exam[exam_ndx + 5]->code[1]->value != " ")
                A_ICD9->icd9_6_1 = icd9->exam[exam_ndx + 5]->code[1]->value
                A_ICD9->icd9_6_desc_1 = icd9->exam[exam_ndx + 5]->code[1]->desc
            else
                A_ICD9->icd9_6_1 = " "
                A_ICD9->icd9_6_desc_1 = " "
            endif
        else
            A_ICD9->icd9_6_1 = " "
            A_ICD9->icd9_6_desc_1 = " "
        endif
    else
        A_ICD9->icd9_6_1 = " "
        A_ICD9->icd9_6_desc_1 = " "
    endif
 
;exam 6 icd9 2
    if (size(icd9->exam,5) >= exam_ndx + 5)
        if (size(icd9->exam[exam_ndx + 5]->code,5) > 1)
            if (icd9->exam[exam_ndx + 5]->code[2]->value != " ")
                A_ICD9->icd9_6_2 = icd9->exam[exam_ndx + 5]->code[2]->value
                A_ICD9->icd9_6_desc_2 = icd9->exam[exam_ndx + 5]->code[2]->desc
            else
                A_ICD9->icd9_6_2 = " "
                A_ICD9->icd9_6_desc_2 = " "
            endif
        else
            A_ICD9->icd9_6_2 = " "
            A_ICD9->icd9_6_desc_2 = " "
        endif
    else
        A_ICD9->icd9_6_2 = " "
        A_ICD9->icd9_6_desc_2 = " "
    endif
 
 ;exam 6 icd9 3
    if (size(icd9->exam,5) >= exam_ndx + 5)
        if (size(icd9->exam[exam_ndx + 5]->code,5) > 2)
            if (icd9->exam[exam_ndx + 5]->code[3]->value != " ")
                A_ICD9->icd9_6_3 = icd9->exam[exam_ndx + 5]->code[3]->value
                A_ICD9->icd9_6_desc_3 = icd9->exam[exam_ndx + 5]->code[3]->desc
            else
                A_ICD9->icd9_6_3 = " "
                A_ICD9->icd9_6_desc_3 = " "
            endif
        else
            A_ICD9->icd9_6_3 = " "
            A_ICD9->icd9_6_desc_3 = " "
        endif
    else
        A_ICD9->icd9_6_3 = " "
        A_ICD9->icd9_6_desc_3 = " "
    endif
 
;exam 6 icd9 4
    if (size(icd9->exam,5) >= exam_ndx + 5)
        if (size(icd9->exam[exam_ndx + 5]->code,5) > 3)
            if (icd9->exam[exam_ndx + 5]->code[4]->value != " ")
                A_ICD9->icd9_6_4 = icd9->exam[exam_ndx + 5]->code[4]->value
                A_ICD9->icd9_6_desc_4 = icd9->exam[exam_ndx + 5]->code[4]->desc
            else
                A_ICD9->icd9_6_4 = " "
                A_ICD9->icd9_6_desc_4 = " "
            endif
        else
            A_ICD9->icd9_6_4 = " "
            A_ICD9->icd9_6_desc_4 = " "
        endif
    else
        A_ICD9->icd9_6_4 = " "
        A_ICD9->icd9_6_desc_4 = " "
    endif
endif
;exam 7 icd9 1
if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                         ->for_this_page,5) > 6)
 
    if (size(icd9->exam,5) >= exam_ndx + 6)
        if (size(icd9->exam[exam_ndx + 6]->code,5) > 0)
            if (icd9->exam[exam_ndx + 6]->code[1]->value != " ")
                A_ICD9->icd9_7_1 = icd9->exam[exam_ndx + 6]->code[1]->value
                A_ICD9->icd9_7_desc_1 = icd9->exam[exam_ndx + 6]->code[1]->desc
            else
                A_ICD9->icd9_7_1 = " "
                A_ICD9->icd9_7_desc_1 = " "
            endif
        else
            A_ICD9->icd9_7_1 = " "
            A_ICD9->icd9_7_desc_1 = " "
        endif
    else
        A_ICD9->icd9_7_1 = " "
        A_ICD9->icd9_7_desc_1 = " "
    endif
 
;exam 7 icd9 2
    if (size(icd9->exam,5) >= exam_ndx + 6)
        if (size(icd9->exam[exam_ndx + 6]->code,5) > 1)
            if (icd9->exam[exam_ndx + 6]->code[2]->value != " ")
                A_ICD9->icd9_7_2 = icd9->exam[exam_ndx + 6]->code[2]->value
                A_ICD9->icd9_7_desc_2 = icd9->exam[exam_ndx + 6]->code[2]->desc
            else
                A_ICD9->icd9_7_2 = " "
                A_ICD9->icd9_7_desc_2 = " "
            endif
        else
            A_ICD9->icd9_7_2 = " "
            A_ICD9->icd9_7_desc_2 = " "
        endif
    else
        A_ICD9->icd9_7_2 = " "
        A_ICD9->icd9_7_desc_2 = " "
    endif
 
 ;exam 7 icd9 3
    if (size(icd9->exam,5) >= exam_ndx + 6)
        if (size(icd9->exam[exam_ndx + 6]->code,5) > 2)
            if (icd9->exam[exam_ndx + 6]->code[3]->value != " ")
                A_ICD9->icd9_7_3 = icd9->exam[exam_ndx + 6]->code[3]->value
                A_ICD9->icd9_7_desc_3 = icd9->exam[exam_ndx + 6]->code[3]->desc
            else
                A_ICD9->icd9_7_3 = " "
                A_ICD9->icd9_7_desc_3 = " "
            endif
        else
            A_ICD9->icd9_7_3 = " "
            A_ICD9->icd9_7_desc_3 = " "
        endif
    else
        A_ICD9->icd9_7_3 = " "
        A_ICD9->icd9_7_desc_3 = " "
    endif
 
;exam 7 icd9 4
    if (size(icd9->exam,5) >= exam_ndx + 6)
        if (size(icd9->exam[exam_ndx + 6]->code,5) > 3)
            if (icd9->exam[exam_ndx + 6]->code[4]->value != " ")
                A_ICD9->icd9_7_4 = icd9->exam[exam_ndx + 6]->code[4]->value
                A_ICD9->icd9_7_desc_4 = icd9->exam[exam_ndx + 6]->code[4]->desc
            else
                A_ICD9->icd9_7_4 = " "
                A_ICD9->icd9_7_desc_4 = " "
            endif
        else
            A_ICD9->icd9_7_4 = " "
            A_ICD9->icd9_7_desc_4 = " "
        endif
    else
        A_ICD9->icd9_7_4 = " "
        A_ICD9->icd9_7_desc_4 = " "
    endif
endif
;exam 8 icd9 1
if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                         ->for_this_page,5) > 7)
 
    if (size(icd9->exam,5) >= exam_ndx + 7)
        if (size(icd9->exam[exam_ndx + 7]->code,5) > 0)
            if (icd9->exam[exam_ndx + 7]->code[1]->value != " ")
                A_ICD9->icd9_8_1 = icd9->exam[exam_ndx + 7]->code[1]->value
                A_ICD9->icd9_8_desc_1 = icd9->exam[exam_ndx + 7]->code[1]->desc
            else
                A_ICD9->icd9_8_1 = " "
                A_ICD9->icd9_8_desc_1 = " "
            endif
        else
            A_ICD9->icd9_8_1 = " "
            A_ICD9->icd9_8_desc_1 = " "
        endif
    else
        A_ICD9->icd9_8_1 = " "
        A_ICD9->icd9_8_desc_1 = " "
    endif
 
;exam 8 icd9 2
    if (size(icd9->exam,5) >= exam_ndx + 7)
        if (size(icd9->exam[exam_ndx + 7]->code,5) > 1)
            if (icd9->exam[exam_ndx + 7]->code[2]->value != " ")
                A_ICD9->icd9_8_2 = icd9->exam[exam_ndx + 7]->code[2]->value
                A_ICD9->icd9_8_desc_2 = icd9->exam[exam_ndx + 7]->code[2]->desc
            else
                A_ICD9->icd9_8_2 = " "
                A_ICD9->icd9_8_desc_2 = " "
            endif
        else
            A_ICD9->icd9_8_2 = " "
            A_ICD9->icd9_8_desc_2 = " "
        endif
    else
        A_ICD9->icd9_8_2 = " "
        A_ICD9->icd9_8_desc_2 = " "
    endif
 
 ;exam 8 icd9 3
    if (size(icd9->exam,5) >= exam_ndx + 7)
        if (size(icd9->exam[exam_ndx + 7]->code,5) > 2)
            if (icd9->exam[exam_ndx + 7]->code[3]->value != " ")
                A_ICD9->icd9_8_3 = icd9->exam[exam_ndx + 7]->code[3]->value
                A_ICD9->icd9_8_desc_3 = icd9->exam[exam_ndx + 7]->code[3]->desc
            else
                A_ICD9->icd9_8_3 = " "
                A_ICD9->icd9_8_desc_3 = " "
            endif
        else
            A_ICD9->icd9_8_3 = " "
            A_ICD9->icd9_8_desc_3 = " "
        endif
    else
        A_ICD9->icd9_8_3 = " "
        A_ICD9->icd9_8_desc_3 = " "
    endif
 
;exam 8 icd9 4
    if (size(icd9->exam,5) >= exam_ndx + 7)
        if (size(icd9->exam[exam_ndx + 7]->code,5) > 3)
            if (icd9->exam[exam_ndx + 7]->code[4]->value != " ")
                A_ICD9->icd9_8_4 = icd9->exam[exam_ndx + 7]->code[4]->value
                A_ICD9->icd9_8_desc_4 = icd9->exam[exam_ndx + 7]->code[4]->desc
            else
                A_ICD9->icd9_8_4 = " "
                A_ICD9->icd9_8_desc_4 = " "
            endif
        else
            A_ICD9->icd9_8_4 = " "
            A_ICD9->icd9_8_desc_4 = " "
        endif
    else
        A_ICD9->icd9_8_4 = " "
        A_ICD9->icd9_8_desc_4 = " "
    endif
endif
;exam 9 icd9 1
if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                         ->for_this_page,5) > 8)
 
    if (size(icd9->exam,5) >= exam_ndx + 8)
        if (size(icd9->exam[exam_ndx + 8]->code,5) > 0)
            if (icd9->exam[exam_ndx + 8]->code[1]->value != " ")
                A_ICD9->icd9_9_1 = icd9->exam[exam_ndx + 8]->code[1]->value
                A_ICD9->icd9_9_desc_1 = icd9->exam[exam_ndx + 8]->code[1]->desc
            else
                A_ICD9->icd9_9_1 = " "
                A_ICD9->icd9_9_desc_1 = " "
            endif
        else
            A_ICD9->icd9_9_1 = " "
            A_ICD9->icd9_9_desc_1 = " "
        endif
    else
        A_ICD9->icd9_9_1 = " "
        A_ICD9->icd9_9_desc_1 = " "
    endif
 
;exam 9 icd9 2
    if (size(icd9->exam,5) >= exam_ndx + 8)
        if (size(icd9->exam[exam_ndx + 8]->code,5) > 1)
            if (icd9->exam[exam_ndx + 8]->code[2]->value != " ")
                A_ICD9->icd9_9_2 = icd9->exam[exam_ndx + 8]->code[2]->value
                A_ICD9->icd9_9_desc_2 = icd9->exam[exam_ndx + 8]->code[2]->desc
            else
                A_ICD9->icd9_9_2 = " "
                A_ICD9->icd9_9_desc_2 = " "
            endif
        else
            A_ICD9->icd9_9_2 = " "
            A_ICD9->icd9_9_desc_2 = " "
        endif
    else
        A_ICD9->icd9_9_2 = " "
        A_ICD9->icd9_9_desc_2 = " "
    endif
 
 ;exam 9 icd9 3
    if (size(icd9->exam,5) >= exam_ndx + 8)
        if (size(icd9->exam[exam_ndx + 8]->code,5) > 2)
            if (icd9->exam[exam_ndx + 8]->code[3]->value != " ")
                A_ICD9->icd9_9_3 = icd9->exam[exam_ndx + 8]->code[3]->value
                A_ICD9->icd9_9_desc_3 = icd9->exam[exam_ndx + 8]->code[3]->desc
            else
                A_ICD9->icd9_9_3 = " "
                A_ICD9->icd9_9_desc_3 = " "
            endif
        else
            A_ICD9->icd9_9_3 = " "
            A_ICD9->icd9_9_desc_3 = " "
        endif
    else
        A_ICD9->icd9_9_3 = " "
        A_ICD9->icd9_9_desc_3 = " "
    endif
 
;exam 9 icd9 4
    if (size(icd9->exam,5) >= exam_ndx + 8)
        if (size(icd9->exam[exam_ndx + 8]->code,5) > 3)
            if (icd9->exam[exam_ndx + 8]->code[4]->value != " ")
                A_ICD9->icd9_9_4 = icd9->exam[exam_ndx + 8]->code[4]->value
                A_ICD9->icd9_9_desc_4 = icd9->exam[exam_ndx + 8]->code[4]->desc
            else
                A_ICD9->icd9_9_4 = " "
                A_ICD9->icd9_9_desc_4 = " "
            endif
        else
            A_ICD9->icd9_9_4 = " "
            A_ICD9->icd9_9_desc_4 = " "
        endif
    else
        A_ICD9->icd9_9_4 = " "
        A_ICD9->icd9_9_desc_4 = " "
    endif
endif
;exam 10 icd9 1
if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                         ->for_this_page,5) > 9)
 
    if (size(icd9->exam,5) >= exam_ndx + 9)
        if (size(icd9->exam[exam_ndx + 9]->code,5) > 0)
            if (icd9->exam[exam_ndx + 9]->code[1]->value != " ")
                A_ICD9->icd9_10_1 = icd9->exam[exam_ndx + 9]->code[1]->value
                A_ICD9->icd9_10_desc_1 = icd9->exam[exam_ndx + 9]->code[1]->desc
            else
                A_ICD9->icd9_10_1 = " "
                A_ICD9->icd9_10_desc_1 = " "
            endif
        else
            A_ICD9->icd9_10_1 = " "
            A_ICD9->icd9_10_desc_1 = " "
        endif
    else
        A_ICD9->icd9_10_1 = " "
        A_ICD9->icd9_10_desc_1 = " "
    endif
 
;exam 10 icd9 2
    if (size(icd9->exam,5) >= exam_ndx + 9)
        if (size(icd9->exam[exam_ndx + 9]->code,5) > 1)
            if (icd9->exam[exam_ndx + 9]->code[2]->value != " ")
                A_ICD9->icd9_10_2 = icd9->exam[exam_ndx + 9]->code[2]->value
                A_ICD9->icd9_10_desc_2 = icd9->exam[exam_ndx + 9]->code[2]->desc
            else
                A_ICD9->icd9_10_2 = " "
                A_ICD9->icd9_10_desc_2 = " "
            endif
        else
            A_ICD9->icd9_10_2 = " "
            A_ICD9->icd9_10_desc_2 = " "
        endif
    else
        A_ICD9->icd9_10_2 = " "
        A_ICD9->icd9_10_desc_2 = " "
    endif
 
 ;exam 10 icd9 3
    if (size(icd9->exam,5) >= exam_ndx + 9)
        if (size(icd9->exam[exam_ndx + 9]->code,5) > 2)
            if (icd9->exam[exam_ndx + 9]->code[3]->value != " ")
                A_ICD9->icd9_10_3 = icd9->exam[exam_ndx + 9]->code[3]->value
                A_ICD9->icd9_10_desc_3 = icd9->exam[exam_ndx + 9]->code[3]->desc
            else
                A_ICD9->icd9_10_3 = " "
                A_ICD9->icd9_10_desc_3 = " "
            endif
        else
            A_ICD9->icd9_10_3 = " "
            A_ICD9->icd9_10_desc_3 = " "
        endif
    else
        A_ICD9->icd9_10_3 = " "
        A_ICD9->icd9_10_desc_3 = " "
    endif
 
;exam 10 icd9 4
    if (size(icd9->exam,5) >= exam_ndx + 9)
        if (size(icd9->exam[exam_ndx + 9]->code,5) > 3)
            if (icd9->exam[exam_ndx + 9]->code[4]->value != " ")
                A_ICD9->icd9_10_4 = icd9->exam[exam_ndx + 9]->code[4]->value
                A_ICD9->icd9_10_desc_4 = icd9->exam[exam_ndx + 9]->code[4]->desc
            else
                A_ICD9->icd9_10_4 = " "
                A_ICD9->icd9_10_desc_4 = " "
            endif
        else
            A_ICD9->icd9_10_4 = " "
            A_ICD9->icd9_10_desc_4 = " "
        endif
    else
        A_ICD9->icd9_10_4 = " "
        A_ICD9->icd9_10_desc_4 = " "
    endif
endif
 
if (size(icd9->exam,5) > data->req[req_ndx]->sections[sect_ndx]->nbr_of_exams_per_req)  ;001
        exam_ndx = exam_ndx - (x-1)*(data->req[req_ndx]->sections[sect_ndx]->nbr_of_exams_per_req)      ;001
endif   ;001
 
 


