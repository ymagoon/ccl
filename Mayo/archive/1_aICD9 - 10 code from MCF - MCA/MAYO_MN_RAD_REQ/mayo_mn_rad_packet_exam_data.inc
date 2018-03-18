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
 
        Source file name:       rad_packet_exam_data.inc
        Object name:            n/a
        Request #:              multiple
 
        Product:                GARPP
        Product Team:           Radnet
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        data fields for printing exam info for patient packet
 
        Tables read:            many
 
        Tables updated:         none
        Executing from:         ?
 
        Special Notes:          ?
 
******************************************************************************/
;~DB~************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *Mod Date     Feature Engineer             Comment                     *
;    *--- -------- ------- -------------  ----------------------------------*
;     ### 08/19/03         Tammy Baack/Sandra Prow Initial Release          *
;     001 03/08/06  89823  Jason Buchanan Clear out fields between pages    *
;~DE~************************************************************************
 
 
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************
 call echo ("****************START OF EXAM DATA********************")
 
;1st exam starts here
 if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                         ->for_this_page,5) > 0)
 
;1st exam name
 
        A_exam->exam_name_1 = data->req[req_ndx]
                          ->sections[sect_ndx]->exam_data[x]
                          ->for_this_page[exam_ndx]->exam_name
 
 
;1st exam order date
       A_exam->order_date_1 = cnvtdatetime(data->req[req_ndx]->sections[sect_ndx]
                            ->exam_data[x]
                           ->for_this_page[exam_ndx]
                            ->order_dt_tm)
 
;1st exam order time
         A_exam->order_time_1 = cnvtdatetime(data->req[req_ndx]->sections[sect_ndx]
                           ->exam_data[x]
                           ->for_this_page[exam_ndx]
                            ->order_dt_tm)
 
;1st exam rqst date
       A_exam->rqst_date_1 = cnvtdatetime(data->req[req_ndx]->sections[sect_ndx]
                           ->exam_data[x]
                           ->for_this_page[exam_ndx]
                           ->request_dt_tm)
 
;1st exam rqst time
       A_exam->rqst_time_1 = cnvtdatetime(data->req[req_ndx]->sections[sect_ndx]
                           ->exam_data[x]
                           ->for_this_page[exam_ndx]
                           ->request_dt_tm)
 
;1st exam start date
       A_exam->start_date_1 = cnvtdatetime(data->req[req_ndx]->sections[sect_ndx]
                           ->exam_data[x]
                           ->for_this_page[exam_ndx]
                           ->start_dt_tm)
 
;1st exam start time
       A_exam->start_time_1 = cnvtdatetime(data->req[req_ndx]->sections[sect_ndx]
                           ->exam_data[x]
                           ->for_this_page[exam_ndx]
                           ->start_dt_tm)
 
;exam section
     if(size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
        ->for_this_page[exam_ndx]->activity_subtype_disp)) >0)
        A_exam->exam_section_1 = data->req[req_ndx]
                          ->sections[sect_ndx]->exam_data[x]
                          ->for_this_page[exam_ndx]
                          ->activity_subtype_disp
     else
        A_exam->exam_section_1 = " "
     endif
 
;1st exam reason
    if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                          ->for_this_page[exam_ndx]->reason_for_exam)) > 0)
         A_exam->reason_for_exam_1 =data->req[req_ndx]
                          ->sections[sect_ndx]->exam_data[x]
                         ->for_this_page[exam_ndx]->reason_for_exam
    else
         A_exam->reason_for_exam_1 = " "
    endif
 
;1st special instruction
    if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                  ->for_this_page[exam_ndx]->special_instructions)) > 0)
         A_exam->special_instr_1 = data->req[req_ndx]->sections[sect_ndx]
                           ->exam_data[x]
                             ->for_this_page[exam_ndx]->special_instructions
    else
         A_exam->special_instr_1 = " "
    endif
;1st comments
    if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                      ->for_this_page[exam_ndx]->order_comment_chartable))>0)
         A_Exam->comments_1 =  data->req[req_ndx]
                               ->sections[sect_ndx]->exam_data[x]
                               ->for_this_page[exam_ndx]
                               ->order_comment_chartable
    else
         A_Exam->comments_1 = " "
    endif
 
;accession/barcode
     if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                       ->for_this_page[exam_ndx]->accession)) > 0)
          A_exam->accession = FormatAccession(data->req[req_ndx]
                            ->sections[sect_ndx]
                            ->exam_data[x]->for_this_page[exam_ndx]->accession)
          A_exam->bc_acc_nbr = concat("*"
                                ,trim(cnvtalphanum(A_exam->accession))
                                ,"*")
 
     else
          A_exam->accession = " "
          A_exam->bc_acc_nbr = " "
     endif
;1st exam priority
    if((size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                       ->for_this_page[exam_ndx]->priority)))> 0)
        A_exam->priority_1 = data->req[req_ndx]
                           ->sections[sect_ndx]
                            ->exam_data[x]->for_this_page[exam_ndx]->priority
    else
          A_exam->priority_1 = " "
    endif
 
;1st exam trans mode
    if((size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                ->for_this_page[exam_ndx]->transport_mode )))> 0)
        A_exam->transport_mode_1 = data->req[req_ndx]->sections[sect_ndx]
                                 ->exam_data[x]
                                 ->for_this_page[exam_ndx]->transport_mode
    else
        A_exam->transport_mode_1 = " "
    endif
 
;order by id
        A_exam->order_by_id_1 = cnvtstring(data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx]
                                ->order_by_prsnl_id,15,0,L)
 
 
;order by name
        A_exam->order_by_name_1 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx]
                                ->order_by_prsnl_name
;order by user_name
        A_exam->order_by_user_name_1  = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx]
                                ->order_by_prsnl_username
 
;exam room
    if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx]->exam_room_disp)) > 0)
        A_exam->exam_room_1 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx]
                                ->exam_room_disp
    else
        A_exam->exam_room_1 = " "
    endif
;order location
    if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx]->ord_loc_disp)) > 0)
        A_exam->order_location_1 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx]
                                ->ord_loc_disp
    else
        A_exam->order_location_1 = " "
    endif
;order location phone
    if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx]->ord_loc_phone)) > 0)
        A_exam->order_loc_phone_1 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx]
                                ->ord_loc_phone
    else
        A_exam->order_loc_phone_1 = " "
    endif
endif
 
;2nd exam data starts here
 
if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                         ->for_this_page,5) > 1)
;2nd exam name
 
        if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                  ->for_this_page[exam_ndx+1]->exam_name)) > 0)
             A_exam->exam_name_2 = data->req[req_ndx]
                                 ->sections[sect_ndx]->exam_data[x]
                                 ->for_this_page[exam_ndx+1]->exam_name
        else
            A_exam->exam_name_2 = " "
        endif
 
 
;2nd exam order date
 
             A_exam->order_date_2 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]
                           ->exam_data[x]
                           ->for_this_page[exam_ndx + 1]
                            ->order_dt_tm)
 
;2nd exam order time
 
            A_exam->order_time_2 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]
                           ->exam_data[x]
                           ->for_this_page[exam_ndx+1]
                           ->order_dt_tm)
 
;2nd exam rqst date
 
            A_exam->rqst_date_2 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 1]
                           ->request_dt_tm)
 
;2nd exam rqst time
 
           A_exam->rqst_time_2 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 1]
                           ->request_dt_tm)
 
;2nd exam start date
 
            A_exam->start_date_2 = cnvtdatetime(data->req[req_ndx]
                   ->sections[sect_ndx]->exam_data[x]
                                ->for_this_page[exam_ndx + 1]
                           ->start_dt_tm)
 
;2nd exam start time
 
           A_exam->start_time_2 = cnvtdatetime(data->req[req_ndx]
                      ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 1]
                           ->start_dt_tm)
 
;2nd exam section
        if(size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
            ->for_this_page[exam_ndx + 1]->activity_subtype_disp)) >0)
            A_exam->exam_section_2 = data->req[req_ndx]
                          ->sections[sect_ndx]->exam_data[x]
                          ->for_this_page[exam_ndx + 1]
                          ->activity_subtype_disp
        else
            A_exam->exam_section_2 = " "
        endif
 
 
;2nd exam reason
 
       if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                          ->for_this_page[exam_ndx + 1]->reason_for_exam)) > 0)
             A_exam->reason_for_exam_2 = data->req[req_ndx]->sections[sect_ndx]
                          ->exam_data[x]->for_this_page[exam_ndx + 1]
                          ->reason_for_exam
        else
            A_exam->reason_for_exam_2 = " "
        endif
 
 
;2nd special instruction
 
        if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                  ->for_this_page[exam_ndx + 1]->special_instructions)) > 0)
           A_exam->special_instr_2 = data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                             ->for_this_page[exam_ndx + 1]->special_instructions
        else
           A_exam->special_instr_2 = " "
        endif
 
;2nd exam priority
 
        if((size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                       ->for_this_page[exam_ndx + 1]->priority)))> 0)
            A_exam->priority_2 = data->req[req_ndx]
                           ->sections[sect_ndx]
                            ->exam_data[x]->for_this_page[exam_ndx + 1]->priority
        else
            A_exam->priority_2 = " "
        endif
 
 
;2nd exam trans mode
 
        if((size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                ->for_this_page[exam_ndx + 1]->transport_mode )))> 0)
           A_exam->transport_mode_2 = data->req[req_ndx]
                                 ->sections[sect_ndx]->exam_data[x]
                                 ->for_this_page[exam_ndx + 1]->transport_mode
        else
           A_exam->transport_mode_2 = " "
        endif
 
 
;2nd order by id
 
        if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                    for_this_page[exam_ndx + 1]->order_by_prsnl_id) > 0)
            A_exam->order_by_id_2 = cnvtstring(data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 1]
                                ->order_by_prsnl_id,15,0,L)
        else
            A_exam->order_by_id_2 = " "
        endif
 
;order by name
 
        if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx + 1]->order_by_prsnl_id) > 0)
            A_exam->order_by_name_2 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 1]
                                ->order_by_prsnl_name
        else
            A_exam->order_by_name_2 = " "
        endif
;order by user_name
        if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx + 1]->order_by_prsnl_id) > 0)
 
                A_exam->order_by_user_name_2  = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 1]
                                ->order_by_prsnl_username
        else
 
            A_exam->order_by_user_name_2  = " "
        endif
 
;exam room 2
 
        if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx + 1]->exam_room_disp)) > 0)
            A_exam->exam_room_2 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 1]
                                ->exam_room_disp
        else
            A_exam->exam_room_2 = " "
        endif
;order location
    if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx+1]->ord_loc_disp)) > 0)
        A_exam->order_location_2 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx+1]
                                ->ord_loc_disp
    else
        A_exam->order_location_2 = " "
    endif
;order location phone
    if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx+1]->ord_loc_phone)) > 0)
        A_exam->order_loc_phone_2 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx+1]
                                ->ord_loc_phone
    else
        A_exam->order_loc_phone_2 = " "
    endif
 
else
    A_exam->exam_name_2 = " "
    A_exam->exam_section_2  = " "
        A_exam->order_date_2 = null ;001
        A_exam->order_time_2 = null ;001
        A_exam->rqst_date_2 = null ;001
        A_exam->rqst_time_2 = null ;001
        A_exam->start_date_2 = null ;001
        A_exam->start_time_2 = null ;001
    A_exam->reason_for_exam_2 = " "
    A_exam->special_instr_2 = " "
    A_exam->priority_2     = " "
    A_exam->transport_mode_2  = " "
    A_exam->order_by_id_2  = " "
    A_exam->order_by_name_2 = " "
    A_exam->order_by_user_name_2 = " "
    A_exam->exam_room_2  = " "
    A_exam->order_location_2 = " "
    A_exam->order_loc_phone_2 = " "
endif
 
;3rd exam data starts here
if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                         ->for_this_page,5) > 2)
 
;3rd exam name
 
        if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                  ->for_this_page[exam_ndx+2]->exam_name)) > 0)
             A_exam->exam_name_3 = data->req[req_ndx]
                                 ->sections[sect_ndx]->exam_data[x]
                                 ->for_this_page[exam_ndx+2]->exam_name
        else
            A_exam->exam_name_3 = " "
        endif
 
 
;3rd exam order date
 
            A_exam->order_date_3 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 2]
                            ->order_dt_tm)
 
;3rd exam order time
            A_exam->order_time_3 = cnvtdatetime(data->req[req_ndx]
                            ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx+2]
                            ->order_dt_tm)
;3rd exam rqst date
 
            A_exam->rqst_date_3 = cnvtdatetime(data->req[req_ndx]
                       ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 2]
                           ->request_dt_tm)
 
;3rd exam rqst time
 
           A_exam->rqst_time_3 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 2]
                           ->request_dt_tm)
 
;3rd exam start date
 
            A_exam->start_date_3 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 2]
                           ->start_dt_tm)
 
;3rd exam start time
 
           A_exam->start_time_3 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 2]
                           ->start_dt_tm)
 
;3rd exam section
 
        if(size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
            ->for_this_page[exam_ndx + 2]->activity_subtype_disp)) >0)
            A_exam->exam_section_3 = data->req[req_ndx]
                          ->sections[sect_ndx]->exam_data[x]
                          ->for_this_page[exam_ndx + 2]
                          ->activity_subtype_disp
        else
            A_exam->exam_section_3 = " "
        endif
 
;3rd exam reason
 
        if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                          ->for_this_page[exam_ndx + 2]->reason_for_exam)) > 0)
             A_exam->reason_for_exam_3 = data->req[req_ndx]->sections[sect_ndx]
                          ->exam_data[x]->for_this_page[exam_ndx + 2]
                          ->reason_for_exam
        else
            A_exam->reason_for_exam_3 = " "
        endif
 
;3rd special instruction
 
        if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                  ->for_this_page[exam_ndx + 2]->special_instructions)) > 0)
           A_exam->special_instr_3 = data->req[req_ndx]
                            ->sections[sect_ndx]->exam_data[x]
                             ->for_this_page[exam_ndx + 2]->special_instructions
        else
           A_exam->special_instr_3 = " "
        endif
 
;3rd exam priority
 
        if((size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                       ->for_this_page[exam_ndx + 2]->priority)))> 0)
            A_exam->priority_3 = data->req[req_ndx]
                           ->sections[sect_ndx]
                            ->exam_data[x]->for_this_page[exam_ndx + 2]->priority
        else
            A_exam->priority_3 = " "
        endif
 
;3rd exam trans mode
 
        if((size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                ->for_this_page[exam_ndx + 2]->transport_mode )))> 0)
           A_exam->transport_mode_3 = data->req[req_ndx]
                                 ->sections[sect_ndx]->exam_data[x]
                                 ->for_this_page[exam_ndx + 2]->transport_mode
        else
           A_exam->transport_mode_3 = " "
        endif
 
;3rd order by id
 
        if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                    for_this_page[exam_ndx + 2]->order_by_prsnl_id) > 0)
            A_exam->order_by_id_3 = cnvtstring(data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 2]
                                ->order_by_prsnl_id,15,0,L)
        else
            A_exam->order_by_id_3 = " "
        endif
 
 
;3rd order by name
 
        if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx + 2]->order_by_prsnl_id) > 0)
            A_exam->order_by_name_3 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 2]
                                ->order_by_prsnl_name
        else
            A_exam->order_by_name_3 = " "
        endif
;order by user_name
        if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx + 2]->order_by_prsnl_id) > 0)
 
                A_exam->order_by_user_name_3  = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 2]
                                ->order_by_prsnl_username
        else
 
            A_exam->order_by_user_name_3  = " "
        endif
 
;3rd exam room
 
        if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx + 2]->exam_room_disp)) > 0)
            A_exam->exam_room_3 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 2]
                                ->exam_room_disp
        else
            A_exam->exam_room_3 = " "
        endif
;order location
    if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx+2]->ord_loc_disp)) > 0)
        A_exam->order_location_3 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx+2]
                                ->ord_loc_disp
    else
        A_exam->order_location_3 = " "
    endif
;order location phone
    if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx+2]->ord_loc_phone)) > 0)
        A_exam->order_loc_phone_3 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx+2]
                                ->ord_loc_phone
    else
        A_exam->order_loc_phone_3 = " "
    endif
 
else
    A_exam->exam_name_3 = " "
    A_exam->exam_section_3  = " "
        A_exam->order_date_3 = null ;001
        A_exam->order_time_3 = null ;001
        A_exam->rqst_date_3 = null ;001
        A_exam->rqst_time_3 = null ;001
        A_exam->start_date_3 = null ;001
        A_exam->start_time_3 = null ;001
    A_exam->reason_for_exam_3 = " "
    A_exam->special_instr_3 = " "
    A_exam->priority_3 = " "
    A_exam->transport_mode_3  = " "
    A_exam->order_by_id_3  = " "
    A_exam->order_by_user_name_3 = " "
    A_exam->order_by_name_3 = " "
    A_exam->exam_room_3  = " "
    A_exam->order_location_3 = " "
    A_exam->order_loc_phone_3 = " "
 
 
endif
 
;4th exam starts here
 if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                         ->for_this_page,5) > 3)
 
;4th exam name
 
        if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                  ->for_this_page[exam_ndx+3]->exam_name)) > 0)
             A_exam->exam_name_4 = data->req[req_ndx]
                                 ->sections[sect_ndx]->exam_data[x]
                                 ->for_this_page[exam_ndx+3]->exam_name
        else
            A_exam->exam_name_4 = " "
        endif
 
 
;4th exam order date
 
             A_exam->order_date_4 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 3]
                            ->order_dt_tm)
 
;4th exam order time
 
            A_exam->order_time_4 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx+3]
                            ->order_dt_tm)
 
;4th exam rqst date
 
            A_exam->rqst_date_4 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 3]
                           ->request_dt_tm)
 
;4th exam rqst time
 
           A_exam->rqst_time_4 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 3]
                           ->request_dt_tm)
 
;4th exam start date
 
            A_exam->start_date_4 = cnvtdatetime(data->req[req_ndx]
                             ->sections[sect_ndx]->exam_data[x]
                                ->for_this_page[exam_ndx + 3]
                           ->start_dt_tm)
 
;4th exam start time
 
           A_exam->start_time_4 = cnvtdatetime(data->req[req_ndx]
                          ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 3]
                           ->start_dt_tm)
 
 
;4th exam section
 
        if(size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
            ->for_this_page[exam_ndx + 3]->activity_subtype_disp)) >0)
            A_exam->exam_section_4 = data->req[req_ndx]
                          ->sections[sect_ndx]->exam_data[x]
                          ->for_this_page[exam_ndx + 3]
                          ->activity_subtype_disp
        else
            A_exam->exam_section_4 = " "
        endif
 
;4th exam reason
 
        if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                          ->for_this_page[exam_ndx + 3]->reason_for_exam)) > 0)
             A_exam->reason_for_exam_4 = data->req[req_ndx]->sections[sect_ndx]
                          ->exam_data[x]->for_this_page[exam_ndx + 3]
                          ->reason_for_exam
        else
            A_exam->reason_for_exam_4 = " "
        endif
 
;4th special instruction
 
        if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                  ->for_this_page[exam_ndx + 3]->special_instructions)) > 0)
           A_exam->special_instr_4 = data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                             ->for_this_page[exam_ndx + 3]->special_instructions
        else
           A_exam->special_instr_4 = " "
        endif
 
;4th exam priority
 
        if((size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                       ->for_this_page[exam_ndx + 3]->priority)))> 0)
            A_exam->priority_4 = data->req[req_ndx]
                           ->sections[sect_ndx]
                            ->exam_data[x]->for_this_page[exam_ndx + 3]->priority
        else
            A_exam->priority_4 = " "
        endif
 
;4th exam trans mode
 
        if((size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                ->for_this_page[exam_ndx + 3]->transport_mode )))> 0)
           A_exam->transport_mode_4 = data->req[req_ndx]
                                  ->sections[sect_ndx]->exam_data[x]
                                 ->for_this_page[exam_ndx + 3]->transport_mode
        else
           A_exam->transport_mode_4 = " "
        endif
 
;4th order by id
 
        if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                    for_this_page[exam_ndx + 3]->order_by_prsnl_id) > 0)
            A_exam->order_by_id_4 = cnvtstring(data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 3]
                                ->order_by_prsnl_id,15,0,L)
        else
            A_exam->order_by_id_4 = " "
        endif
 
;4th order by name
 
        if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx + 3]->order_by_prsnl_id) > 0)
            A_exam->order_by_name_4 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 3]
                                ->order_by_prsnl_name
        else
            A_exam->order_by_name_4 = " "
        endif
;order by user_name
        if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx + 3]->order_by_prsnl_id) > 0)
 
                A_exam->order_by_user_name_4  = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 3]
                                ->order_by_prsnl_username
        else
 
            A_exam->order_by_user_name_4  = " "
        endif
 
 
;4th exam room
 
        if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx + 3]->exam_room_disp)) > 0)
            A_exam->exam_room_4 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 3]
                                ->exam_room_disp
        else
            A_exam->exam_room_4 = " "
        endif
;order location
    if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx+3]->ord_loc_disp)) > 0)
        A_exam->order_location_4 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx+3]
                                ->ord_loc_disp
    else
        A_exam->order_location_4 = " "
    endif
;order location phone
    if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx+3]->ord_loc_phone)) > 0)
        A_exam->order_loc_phone_4 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx+3]
                                ->ord_loc_phone
    else
        A_exam->order_loc_phone_4 = " "
    endif
else
    A_exam->exam_name_4 = " "
    A_exam->exam_section_4  = " "
        A_exam->order_date_4 = null ;001
        A_exam->order_time_4 = null ;001
        A_exam->rqst_date_4 = null ;001
        A_exam->rqst_time_4 = null ;001
        A_exam->start_date_4 = null ;001
        A_exam->start_time_4 = null ;001
    A_exam->reason_for_exam_4 = " "
    A_exam->special_instr_4 = " "
    A_exam->priority_4  = " "
    A_exam->transport_mode_4  = " "
    A_exam->order_by_id_4  = " "
    A_exam->order_by_user_name_4 = " "
    A_exam->order_by_name_4 = " "
    A_exam->exam_room_4  = " "
    A_exam->order_location_4 = " "
    A_exam->order_loc_phone_4 = " "
 
 
endif
 
;5th exam starts here
 
if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                         ->for_this_page,5) > 4)
 
;5th exam name
        if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                  ->for_this_page[exam_ndx+4]->exam_name)) > 0)
             A_exam->exam_name_5 = data->req[req_ndx]
                                 ->sections[sect_ndx]->exam_data[x]
                                 ->for_this_page[exam_ndx+4]->exam_name
        else
            A_exam->exam_name_5 = " "
        endif
 
;5th exam order date
 
             A_exam->order_date_5 = cnvtdatetime(data->req[req_ndx]
                          ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 4]
                            ->order_dt_tm)
 
;5th exam order time
 
            A_exam->order_time_5 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx+4]
                            ->order_dt_tm)
 
;5th exam rqst date
 
            A_exam->rqst_date_5 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 4]
                           ->request_dt_tm)
 
;5th exam rqst time
 
           A_exam->rqst_time_5 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 4]
                           ->request_dt_tm)
 
;5th exam start date
 
            A_exam->start_date_5 = cnvtdatetime(data->req[req_ndx]
                               ->sections[sect_ndx]->exam_data[x]
                                ->for_this_page[exam_ndx + 4]
                           ->start_dt_tm)
 
;5th exam start time
 
           A_exam->start_time_5 = cnvtdatetime(data->req[req_ndx]
                          ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 4]
                           ->start_dt_tm)
 
;5th exam section
 
        if(size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
            ->for_this_page[exam_ndx + 4]->activity_subtype_disp)) >0)
            A_exam->exam_section_5 = data->req[req_ndx]
                          ->sections[sect_ndx]->exam_data[x]
                          ->for_this_page[exam_ndx + 4]
                          ->activity_subtype_disp
        else
            A_exam->exam_section_5 = " "
        endif
 
;5th exam reason
 
        if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                          ->for_this_page[exam_ndx + 4]->reason_for_exam)) > 0)
             A_exam->reason_for_exam_5 = data->req[req_ndx]->sections[sect_ndx]
                          ->exam_data[x]->for_this_page[exam_ndx + 4]
                          ->reason_for_exam
        else
            A_exam->reason_for_exam_5 = " "
        endif
 
;5th special instruction
 
        if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                  ->for_this_page[exam_ndx + 4]->special_instructions)) > 0)
           A_exam->special_instr_5 = data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                             ->for_this_page[exam_ndx + 4]->special_instructions
        else
           A_exam->special_instr_5 = " "
        endif
 
;5th exam priority
 
        if((size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                       ->for_this_page[exam_ndx + 4]->priority)))> 0)
            A_exam->priority_5 = data->req[req_ndx]
                           ->sections[sect_ndx]
                            ->exam_data[x]->for_this_page[exam_ndx + 4]->priority
        else
            A_exam->priority_5 = " "
        endif
 
;5th exam trans mode
 
        if((size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                ->for_this_page[exam_ndx + 4]->transport_mode )))> 0)
           A_exam->transport_mode_5 = data->req[req_ndx]
                                 ->sections[sect_ndx]->exam_data[x]
                                 ->for_this_page[exam_ndx + 4]->transport_mode
        else
           A_exam->transport_mode_5 = " "
        endif
 
;5th order by id
 
        if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                    for_this_page[exam_ndx + 4]->order_by_prsnl_id) > 0)
            A_exam->order_by_id_5 = cnvtstring(data->req[req_ndx]
                         ->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 4]
                                ->order_by_prsnl_id,15,0,L)
        else
            A_exam->order_by_id_5 = " "
        endif
 
;5th order by name
 
        if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx + 4]->order_by_prsnl_id) > 0)
            A_exam->order_by_name_5 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 4]
                                ->order_by_prsnl_name
        else
            A_exam->order_by_name_5 = " "
        endif
;5th order by user_name
        if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx + 4]->order_by_prsnl_id) > 0)
 
                A_exam->order_by_user_name_5  = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 4]
                                ->order_by_prsnl_username
        else
 
            A_exam->order_by_user_name_5  = " "
        endif
 
 
;5th exam room
 
        if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx + 4]->exam_room_disp)) > 0)
            A_exam->exam_room_5 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 4]
                                ->exam_room_disp
        else
            A_exam->exam_room_5 = " "
        endif
;order location
    if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx+4]->ord_loc_disp)) > 0)
        A_exam->order_location_5 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx+4]
                                ->ord_loc_disp
    else
        A_exam->order_location_5 = " "
    endif
;order location phone
    if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx+4]->ord_loc_phone)) > 0)
        A_exam->order_loc_phone_5 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx+4]
                                ->ord_loc_phone
    else
        A_exam->order_loc_phone_5 = " "
    endif
else
    A_exam->exam_name_5 = " "
    A_exam->exam_section_5  = " "
        A_exam->order_date_5 = null ;001
        A_exam->order_time_5 = null ;001
        A_exam->rqst_date_5 = null ;001
        A_exam->rqst_time_5 = null ;001
        A_exam->start_date_5 = null ;001
        A_exam->start_time_5 = null ;001
    A_exam->reason_for_exam_5 = " "
    A_exam->special_instr_5 = " "
    A_exam->priority_5 = " "
    A_exam->transport_mode_5  = " "
    A_exam->order_by_id_5 = " "
    A_exam->order_by_name_5 = " "
    A_exam->order_by_user_name_5 = " "
    A_exam->exam_room_5 = " "
    A_exam->order_location_5 = " "
    A_exam->order_loc_phone_5 = " "
 
endif
 
;exam 6 starts here
 
if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                         ->for_this_page,5) > 5)
;6th exam name
 
        if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                  ->for_this_page[exam_ndx+5]->exam_name)) > 0)
             A_exam->exam_name_6 = data->req[req_ndx]
                                 ->sections[sect_ndx]->exam_data[x]
                                 ->for_this_page[exam_ndx+5]->exam_name
        else
            A_exam->exam_name_6 = " "
        endif
 
;6th exam order date
 
             A_exam->order_date_6 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 5]
                            ->order_dt_tm)
 
;6th exam order time
 
            A_exam->order_time_6 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx+5]
                            ->order_dt_tm)
 
;6th exam rqst date
 
            A_exam->rqst_date_6 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 5]
                           ->request_dt_tm)
 
;6th exam rqst time
 
           A_exam->rqst_time_6 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 5]
                           ->request_dt_tm)
 
;6th exam start date
 
            A_exam->start_date_6 = cnvtdatetime(data->req[req_ndx]
                                ->sections[sect_ndx]->exam_data[x]
                                ->for_this_page[exam_ndx + 5]
                           ->start_dt_tm)
 
;6th exam start time
 
           A_exam->start_time_6 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 5]
                           ->start_dt_tm)
 
;6th exam section
 
        if(size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
            ->for_this_page[exam_ndx + 5]->activity_subtype_disp)) >0)
            A_exam->exam_section_6 = data->req[req_ndx]
                          ->sections[sect_ndx]->exam_data[x]
                          ->for_this_page[exam_ndx + 5]
                          ->activity_subtype_disp
        else
            A_exam->exam_section_6 = " "
        endif
 
;6th exam reason
 
        if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                          ->for_this_page[exam_ndx + 5]->reason_for_exam)) > 0)
             A_exam->reason_for_exam_6 = data->req[req_ndx]->sections[sect_ndx]
                          ->exam_data[x]->for_this_page[exam_ndx + 5]
                          ->reason_for_exam
        else
            A_exam->reason_for_exam_6 = " "
        endif
 
;6th special instruction
 
        if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                  ->for_this_page[exam_ndx + 5]->special_instructions)) > 0)
           A_exam->special_instr_6 = data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                             ->for_this_page[exam_ndx + 5]->special_instructions
        else
           A_exam->special_instr_6 = " "
        endif
 
;6th exam priority
 
        if((size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                       ->for_this_page[exam_ndx + 5]->priority)))> 0)
            A_exam->priority_6 = data->req[req_ndx]
                           ->sections[sect_ndx]
                            ->exam_data[x]->for_this_page[exam_ndx + 5]->priority
        else
            A_exam->priority_6 = " "
        endif
 
;6th exam trans mode
 
        if((size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                ->for_this_page[exam_ndx + 6]->transport_mode )))> 0)
           A_exam->transport_mode_6 = data->req[req_ndx]
                                 ->sections[sect_ndx]->exam_data[x]
                                 ->for_this_page[exam_ndx + 5]->transport_mode
        else
           A_exam->transport_mode_6 = " "
        endif
 
;6th order by id
 
        if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                    for_this_page[exam_ndx + 5]->order_by_prsnl_id) > 0)
            A_exam->order_by_id_6 = cnvtstring(data->req[req_ndx]
                        ->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 5]
                                ->order_by_prsnl_id,15,0,L)
        else
            A_exam->order_by_id_6 = " "
        endif
 
;6th order by name
 
        if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx + 5]->order_by_prsnl_id) > 0)
            A_exam->order_by_name_6 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 5]
                                ->order_by_prsnl_name
        else
            A_exam->order_by_name_6 = " "
        endif
;6th order by user_name
        if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx + 5]->order_by_prsnl_id) > 0)
 
                A_exam->order_by_user_name_6  = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 5]
                                ->order_by_prsnl_username
        else
 
            A_exam->order_by_user_name_6  = " "
        endif
 
 
;6th exam room
 
        if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx + 5]->exam_room_disp)) > 0)
            A_exam->exam_room_6 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 5]
                                ->exam_room_disp
        else
            A_exam->exam_room_6 = " "
        endif
;order location
    if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx+5]->ord_loc_disp)) > 0)
        A_exam->order_location_6 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx+5]
                                ->ord_loc_disp
    else
        A_exam->order_location_6 = " "
    endif
;order location phone
    if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx+5]->ord_loc_phone)) > 0)
        A_exam->order_loc_phone_6 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx+5]
                                ->ord_loc_phone
    else
        A_exam->order_loc_phone_6 = " "
    endif
else
    A_exam->exam_name_6 = " "
    A_exam->exam_section_6  = " "
        A_exam->order_date_6 = null ;001
        A_exam->order_time_6 = null ;001
        A_exam->rqst_date_6 = null ;001
        A_exam->rqst_time_6 = null ;001
        A_exam->start_date_6 = null ;001
        A_exam->start_time_6 = null ;001
    A_exam->reason_for_exam_6 = " "
    A_exam->special_instr_6 = " "
    A_exam->priority_6 = " "
    A_exam->transport_mode_6  = " "
    A_exam->order_by_id_6 = " "
    A_exam->order_by_name_6 = " "
    A_exam->order_by_user_name_6 " "
    A_exam->exam_room_6 = " "
    A_exam->order_location_6 = " "
    A_exam->order_loc_phone_6 = " "
 
 
endif
 
;7th exam starts here
 
if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                         ->for_this_page,5) > 6)
;7th exam name
 
             A_exam->exam_name_7 = data->req[req_ndx]
                                 ->sections[sect_ndx]->exam_data[x]
                                 ->for_this_page[exam_ndx+6]->exam_name
;7th exam order date
 
             A_exam->order_date_7 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 6]
                            ->order_dt_tm)
 
;7th exam order time
 
            A_exam->order_time_7 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx+6]
                            ->order_dt_tm)
 
;7th exam rqst date
 
            A_exam->rqst_date_7 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 6]
                           ->request_dt_tm)
 
;7th exam rqst time
 
           A_exam->rqst_time_7 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 6]
                           ->request_dt_tm)
 
;7th exam start date
 
            A_exam->start_date_7 = cnvtdatetime(data->req[req_ndx]
                                ->sections[sect_ndx]->exam_data[x]
                                ->for_this_page[exam_ndx + 6]
                           ->start_dt_tm)
 
;7th exam start time
 
           A_exam->start_time_7 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 6]
                           ->start_dt_tm)
 
;7th exam section
 
        if(size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
            ->for_this_page[exam_ndx + 6]->activity_subtype_disp)) >0)
            A_exam->exam_section_7 = data->req[req_ndx]
                          ->sections[sect_ndx]->exam_data[x]
                          ->for_this_page[exam_ndx + 6]
                          ->activity_subtype_disp
        else
            A_exam->exam_section_7 = " "
        endif
 
;7th exam reason
 
        if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                          ->for_this_page[exam_ndx + 6]->reason_for_exam)) > 0)
             A_exam->reason_for_exam_7 = data->req[req_ndx]->sections[sect_ndx]
                          ->exam_data[x]->for_this_page[exam_ndx + 6]
                          ->reason_for_exam
        else
            A_exam->reason_for_exam_7 = " "
        endif
 
;7th special instruction
 
        if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                  ->for_this_page[exam_ndx + 6]->special_instructions)) > 0)
           A_exam->special_instr_7 = data->req[req_ndx]->sections[sect_ndx]
                           ->exam_data[x]
                             ->for_this_page[exam_ndx + 6]->special_instructions
        else
           A_exam->special_instr_7 = " "
        endif
 
;7th exam priority
 
        if((size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                       ->for_this_page[exam_ndx + 6]->priority)))> 0)
            A_exam->priority_7 = data->req[req_ndx]
                           ->sections[sect_ndx]
                            ->exam_data[x]->for_this_page[exam_ndx + 6]->priority
        else
            A_exam->priority_7 = " "
        endif
 
;7th exam trans mode
 
        if((size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                ->for_this_page[exam_ndx + 6]->transport_mode )))> 0)
           A_exam->transport_mode_7 = data->req[req_ndx]->sections[sect_ndx]
                                 ->exam_data[x]
                                 ->for_this_page[exam_ndx + 6]->transport_mode
        else
           A_exam->transport_mode_7 = " "
        endif
 
;7th order by id
 
        if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                    for_this_page[exam_ndx + 6]->order_by_prsnl_id) > 0)
            A_exam->order_by_id_7 = cnvtstring(data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 6]
                                ->order_by_prsnl_id,15,0,L)
        else
            A_exam->order_by_id_7 = " "
        endif
 
;7th order by name
 
        if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx + 6]->order_by_prsnl_id) > 0)
            A_exam->order_by_name_7 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 6]
                                ->order_by_prsnl_name
        else
            A_exam->order_by_name_7 = " "
        endif
;7th order by user_name
        if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx + 6]->order_by_prsnl_id) > 0)
 
                A_exam->order_by_user_name_7  = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 6]
                                ->order_by_prsnl_username
        else
 
            A_exam->order_by_user_name_7  = " "
        endif
 
;7th exam room
 
        if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx + 6]->exam_room_disp)) > 0)
            A_exam->exam_room_7 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 6]
                                ->exam_room_disp
        else
            A_exam->exam_room_7 = " "
        endif
;order location
    if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx+6]->ord_loc_disp)) > 0)
        A_exam->order_location_7 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx+6]
                                ->ord_loc_disp
    else
        A_exam->order_location_7 = " "
    endif
;order location phone
    if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx+6]->ord_loc_phone)) > 0)
        A_exam->order_loc_phone_7 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx+6]
                                ->ord_loc_phone
    else
        A_exam->order_loc_phone_7 = " "
    endif
 
else
    A_exam->exam_name_7 = " "
    A_exam->exam_section_7  = " "
        A_exam->order_date_7 = null ;001
        A_exam->order_time_7 = null ;001
        A_exam->rqst_date_7 = null ;001
        A_exam->rqst_time_7 = null ;001
        A_exam->start_date_7 = null ;001
        A_exam->start_time_7 = null ;001
    A_exam->reason_for_exam_7 = " "
    A_exam->special_instr_7 = " "
    A_exam->priority_7 = " "
    A_exam->transport_mode_7  = " "
    A_exam->order_by_id_7 = " "
    A_exam->order_by_name_7 = " "
    A_exam->order_by_user_name_7 = " "
    A_exam->exam_room_7 = " "
    A_exam->order_location_7 = " "
    A_exam->order_loc_phone_7 = " "
 
 
endif
 
;exam 8 starts here
 
if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                         ->for_this_page,5) > 7)
;8th exam name
 
             A_exam->exam_name_8 = data->req[req_ndx]
                                 ->sections[sect_ndx]->exam_data[x]
                                 ->for_this_page[exam_ndx+7]->exam_name
;8th exam order date
 
             A_exam->order_date_8 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 7]
                            ->order_dt_tm)
 
;8th exam order time
 
            A_exam->order_time_8 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx+7]
                            ->order_dt_tm)
 
;8th exam rqst date
 
            A_exam->rqst_date_8 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 7]
                           ->request_dt_tm)
 
;8th exam rqst time
 
           A_exam->rqst_time_8 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 7]
                           ->request_dt_tm)
 
;8th exam start date
 
            A_exam->start_date_8 = cnvtdatetime(data->req[req_ndx]
                                ->sections[sect_ndx]->exam_data[x]
                                ->for_this_page[exam_ndx + 7]
                           ->start_dt_tm)
 
;8th exam start time
 
           A_exam->start_time_8 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 7]
                           ->start_dt_tm)
 
;8th exam section
 
        if(size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
            ->for_this_page[exam_ndx + 7]->activity_subtype_disp)) >0)
            A_exam->exam_section_8 = data->req[req_ndx]
                          ->sections[sect_ndx]->exam_data[x]
                          ->for_this_page[exam_ndx + 7]
                          ->activity_subtype_disp
        else
            A_exam->exam_section_8 = " "
        endif
 
;8th exam reason
 
        if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                          ->for_this_page[exam_ndx + 7]->reason_for_exam)) > 0)
             A_exam->reason_for_exam_8 = data->req[req_ndx]->sections[sect_ndx]
                          ->exam_data[x]->for_this_page[exam_ndx + 7]
                          ->reason_for_exam
        else
            A_exam->reason_for_exam_8 = " "
        endif
 
;8th special instruction
 
        if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                  ->for_this_page[exam_ndx + 7]->special_instructions)) > 0)
           A_exam->special_instr_8 = data->req[req_ndx]->sections[sect_ndx]
                           ->exam_data[x]
                             ->for_this_page[exam_ndx + 7]->special_instructions
        else
           A_exam->special_instr_8 = " "
        endif
 
;8th exam priority
 
        if((size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                       ->for_this_page[exam_ndx + 7]->priority)))> 0)
            A_exam->priority_8 = data->req[req_ndx]
                           ->sections[sect_ndx]
                            ->exam_data[x]->for_this_page[exam_ndx + 7]->priority
        else
            A_exam->priority_8 = " "
        endif
 
;8th exam trans mode
 
        if((size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                ->for_this_page[exam_ndx + 7]->transport_mode )))> 0)
           A_exam->transport_mode_8 = data->req[req_ndx]
                                 ->sections[sect_ndx]->exam_data[x]
                                 ->for_this_page[exam_ndx + 7]->transport_mode
        else
           A_exam->transport_mode_8 = " "
        endif
 
;8th order by id
 
        if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                    for_this_page[exam_ndx + 7]->order_by_prsnl_id) > 0)
            A_exam->order_by_id_8 = cnvtstring(data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 7]
                                ->order_by_prsnl_id,15,0,L)
        else
            A_exam->order_by_id_8 = " "
        endif
 
;8th order by name
 
        if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx + 7]->order_by_prsnl_id) > 0)
            A_exam->order_by_name_8 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 7]
                                ->order_by_prsnl_name
        else
            A_exam->order_by_name_8 = " "
        endif
;8th order by user_name
        if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx + 7]->order_by_prsnl_id) > 0)
 
                A_exam->order_by_user_name_8  = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 7]
                                ->order_by_prsnl_username
        else
 
            A_exam->order_by_user_name_8  = " "
        endif
 
;8th exam room
 
        if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx + 7]->exam_room_disp)) > 0)
            A_exam->exam_room_8 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 7]
                                ->exam_room_disp
        else
            A_exam->exam_room_8 = " "
        endif
;order location
    if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx+7]->ord_loc_disp)) > 0)
        A_exam->order_location_8 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx+7]
                                ->ord_loc_disp
    else
        A_exam->order_location_8 = " "
    endif
;order location phone
    if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx+7]->ord_loc_phone)) > 0)
        A_exam->order_loc_phone_8 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx+7]
                                ->ord_loc_phone
    else
        A_exam->order_loc_phone_8 = " "
    endif
 
else
    A_exam->exam_name_8 = " "
    A_exam->exam_section_8  = " "
        A_exam->order_date_8 = null ;001
        A_exam->order_time_8 = null ;001
        A_exam->rqst_date_8 = null ;001
        A_exam->rqst_time_8 = null ;001
        A_exam->start_date_8 = null ;001
        A_exam->start_time_8 = null ;001
    A_exam->reason_for_exam_8 = " "
    A_exam->special_instr_8 = " "
    A_exam->priority_8 = " "
    A_exam->transport_mode_8  = " "
    A_exam->order_by_id_8 = " "
    A_exam->order_by_name_8 = " "
    A_exam->order_by_user_name_8 = " "
    A_exam->exam_room_8 = " "
    A_exam->order_location_8 = " "
    A_exam->order_loc_phone_8 = " "
 
endif
 
;exam 9 starts here
if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                         ->for_this_page,5) > 8)
;9th exam name
 
             A_exam->exam_name_9 = data->req[req_ndx]
                                 ->sections[sect_ndx]->exam_data[x]
                                 ->for_this_page[exam_ndx+8]->exam_name
 
;9th exam order date
 
             A_exam->order_date_9 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 8]
                            ->order_dt_tm)
 
;9th exam order time
 
            A_exam->order_time_9 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx+8]
                            ->order_dt_tm)
 
;9th exam rqst date
 
            A_exam->rqst_date_9 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 8]
                           ->request_dt_tm)
 
;9th exam rqst time
 
           A_exam->rqst_time_9 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 8]
                           ->request_dt_tm)
 
;9th exam start date
 
            A_exam->start_date_9 = cnvtdatetime(data->req[req_ndx]
                                ->sections[sect_ndx]->exam_data[x]
                                ->for_this_page[exam_ndx + 8]
                           ->start_dt_tm)
 
;9th exam start time
 
           A_exam->start_time_9 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 8]
                           ->start_dt_tm)
 
;9th exam section
 
        if(size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
            ->for_this_page[exam_ndx + 8]->activity_subtype_disp)) >0)
            A_exam->exam_section_9 = data->req[req_ndx]
                          ->sections[sect_ndx]->exam_data[x]
                          ->for_this_page[exam_ndx + 8]
                          ->activity_subtype_disp
        else
            A_exam->exam_section_9 = " "
        endif
 
;9th exam reason
 
        if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                          ->for_this_page[exam_ndx + 8]->reason_for_exam)) > 0)
             A_exam->reason_for_exam_9 = data->req[req_ndx]->sections[sect_ndx]
                          ->exam_data[x]->for_this_page[exam_ndx + 8]
                          ->reason_for_exam
        else
            A_exam->reason_for_exam_9 = " "
        endif
 
;9th special instruction
 
        if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                  ->for_this_page[exam_ndx + 8]->special_instructions)) > 0)
           A_exam->special_instr_9 = data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                             ->for_this_page[exam_ndx + 8]->special_instructions
        else
           A_exam->special_instr_9 = " "
        endif
 
;9th exam priority
 
        if((size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                       ->for_this_page[exam_ndx + 8]->priority)))> 0)
            A_exam->priority_9 = data->req[req_ndx]
                           ->sections[sect_ndx]
                            ->exam_data[x]->for_this_page[exam_ndx + 8]->priority
        else
            A_exam->priority_9 = " "
        endif
 
;9th exam trans mode
 
        if((size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                ->for_this_page[exam_ndx + 8]->transport_mode )))> 0)
           A_exam->transport_mode_9 = data->req[req_ndx]
                                 ->sections[sect_ndx]->exam_data[x]
                                 ->for_this_page[exam_ndx + 8]->transport_mode
        else
           A_exam->transport_mode_9 = " "
        endif
 
;9th order by id
 
        if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                    for_this_page[exam_ndx + 8]->order_by_prsnl_id) > 0)
            A_exam->order_by_id_9 = cnvtstring(data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 8]
                                ->order_by_prsnl_id,15,0,L)
        else
            A_exam->order_by_id_9 = " "
        endif
 
;9th order by name
 
        if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx + 8]->order_by_prsnl_id) > 0)
            A_exam->order_by_name_9 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 8]
                                ->order_by_prsnl_name
        else
            A_exam->order_by_name_9 = " "
        endif
;9th order by user_name
        if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx + 8]->order_by_prsnl_id) > 0)
 
                A_exam->order_by_user_name_9  = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 8]
                                ->order_by_prsnl_username
        else
 
            A_exam->order_by_user_name_9  = " "
        endif
 
;9th exam room
 
        if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx + 8]->exam_room_disp)) > 0)
            A_exam->exam_room_9 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 8]
                                ->exam_room_disp
        else
            A_exam->exam_room_9 = " "
        endif
;order location
    if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx+8]->ord_loc_disp)) > 0)
        A_exam->order_location_9 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx+8]
                                ->ord_loc_disp
    else
        A_exam->order_location_9 = " "
    endif
;order location phone
    if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx+8]->ord_loc_phone)) > 0)
        A_exam->order_loc_phone_9 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx+8]
                                ->ord_loc_phone
    else
        A_exam->order_loc_phone_9 = " "
    endif
 
else
    A_exam->exam_name_9 = " "
    A_exam->exam_section_9  = " "
        A_exam->order_date_9 = null ;001
        A_exam->order_time_9 = null ;001
        A_exam->rqst_date_9 = null ;001
        A_exam->rqst_time_9 = null ;001
        A_exam->start_date_9 = null ;001
        A_exam->start_time_9 = null ;001
    A_exam->reason_for_exam_9 = " "
    A_exam->special_instr_9 = " "
    A_exam->priority_9 = " "
    A_exam->transport_mode_9  = " "
    A_exam->order_by_id_9 = " "
    A_exam->order_by_name_9 = " "
    A_exam->order_by_user_name_9 = " "
    A_exam->exam_room_9 = " "
    A_exam->order_location_9 = " "
    A_exam->order_loc_phone_9 = " "
 
 
endif
 
;10th exam starts here
if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                         ->for_this_page,5) > 9)
;10th exam name
 
        if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                  ->for_this_page[exam_ndx+9]->exam_name)) > 0)
 
             A_exam->exam_name_10 = data->req[req_ndx]
                                 ->sections[sect_ndx]->exam_data[x]
                                 ->for_this_page[exam_ndx+9]->exam_name
        else
            A_exam->exam_name_10 = " "
        endif
 
;10th exam order date
 
             A_exam->order_date_10 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 9]
                            ->order_dt_tm)
 
;10th exam order time
 
            A_exam->order_time_10 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx+9]
                            ->order_dt_tm)
 
;10th exam rqst date
 
            A_exam->rqst_date_10 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 9]
                           ->request_dt_tm)
 
;10th exam rqst time
 
           A_exam->rqst_time_10 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 9]
                           ->request_dt_tm)
 
;10th exam start date
 
            A_exam->start_date_10 = cnvtdatetime(data->req[req_ndx]
                                ->sections[sect_ndx]->exam_data[x]
                                ->for_this_page[exam_ndx + 9]
                           ->start_dt_tm)
 
;10th exam start time
 
           A_exam->start_time_10 = cnvtdatetime(data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx + 9]
                           ->start_dt_tm)
 
;10th exam section
 
        if(size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
            ->for_this_page[exam_ndx + 9]->activity_subtype_disp)) >0)
            A_exam->exam_section_10 = data->req[req_ndx]
                          ->sections[sect_ndx]->exam_data[x]
                          ->for_this_page[exam_ndx + 9]
                          ->activity_subtype_disp
        else
            A_exam->exam_section_10 = " "
        endif
 
;10th exam reason
 
        if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                          ->for_this_page[exam_ndx + 9]->reason_for_exam)) > 0)
             A_exam->reason_for_exam_10 = data->req[req_ndx]->sections[sect_ndx]
                          ->exam_data[x]->for_this_page[exam_ndx + 9]
                          ->reason_for_exam
        else
            A_exam->reason_for_exam_10 = " "
        endif
 
;10th special instruction
 
        if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                  ->for_this_page[exam_ndx + 9]->special_instructions)) > 0)
           A_exam->special_instr_10 = data->req[req_ndx]
                           ->sections[sect_ndx]->exam_data[x]
                             ->for_this_page[exam_ndx + 9]->special_instructions
        else
           A_exam->special_instr_10 = " "
        endif
 
;10th exam priority
 
        if((size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                       ->for_this_page[exam_ndx + 9]->priority)))> 0)
            A_exam->priority_10 = data->req[req_ndx]
                           ->sections[sect_ndx]
                            ->exam_data[x]->for_this_page[exam_ndx + 9]->priority
        else
            A_exam->priority_10 = " "
        endif
 
;10th exam trans mode
 
        if((size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                ->for_this_page[exam_ndx + 9]->transport_mode )))> 0)
           A_exam->transport_mode_10 = data->req[req_ndx]
                                 ->sections[sect_ndx]->exam_data[x]
                                 ->for_this_page[exam_ndx + 9]->transport_mode
        else
           A_exam->transport_mode_10 = " "
        endif
 
;10th order by id
 
        if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                    for_this_page[exam_ndx + 9]->order_by_prsnl_id) > 0)
            A_exam->order_by_id_10 = cnvtstring(data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 9]
                                ->order_by_prsnl_id,15,0,L)
        else
            A_exam->order_by_id_10 = " "
        endif
 
;10th order by name
 
        if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx + 9]->order_by_prsnl_id) > 0)
            A_exam->order_by_name_10 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 9]
                                ->order_by_prsnl_name
        else
            A_exam->order_by_name_10 = " "
        endif
;10th order by user_name
        if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx + 9]->order_by_prsnl_id) > 0)
 
                A_exam->order_by_user_name_10  = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 9]
                                ->order_by_prsnl_username
        else
 
            A_exam->order_by_user_name_10  = " "
        endif
 
;10th exam room
 
        if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx + 9]->exam_room_disp)) > 0)
            A_exam->exam_room_10 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx + 9]
                                ->exam_room_disp
        else
            A_exam->exam_room_10 = " "
        endif
;order location
    if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx+9]->ord_loc_disp)) > 0)
        A_exam->order_location_10 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx+9]
                                ->ord_loc_disp
    else
        A_exam->order_location_10 = " "
    endif
;order location phone
    if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]->
                   for_this_page[exam_ndx+9]->ord_loc_phone)) > 0)
        A_exam->order_loc_phone_10 = data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx+9]
                                ->ord_loc_phone
    else
        A_exam->order_loc_phone_10 = " "
    endif
 
  else
    A_exam->exam_name_10 = " "
    A_exam->exam_section_10  = " "
        A_exam->order_date_10 = null ;001
        A_exam->order_time_10 = null ;001
        A_exam->rqst_date_10 = null ;001
        A_exam->rqst_time_10 = null ;001
        A_exam->start_date_10 = null ;001
        A_exam->start_time_10 = null ;001
    A_exam->reason_for_exam_10 = " "
    A_exam->special_instr_10 = " "
    A_exam->priority_10 = " "
    A_exam->transport_mode_10  = " "
    A_exam->order_by_id_10 = " "
    A_exam->order_by_name_10 = " "
    A_exam->order_by_user_name_10  = " "
    A_exam->exam_room_10 = " "
    A_exam->order_location_10 = " "
    A_exam->order_loc_phone_10 = " "
 
 
 endif


