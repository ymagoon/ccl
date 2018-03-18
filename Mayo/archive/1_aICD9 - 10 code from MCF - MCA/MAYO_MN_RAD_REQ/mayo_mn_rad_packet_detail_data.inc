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
 
        Source file name:       rad_packet_detail_data.inc
        Object name:            n/a
        Request #:              multiple
 
        Product:                GARPP
        Product Team:           Radnet
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        Order detail data for printing order details
 
        Tables read:            many
 
        Tables updated:         none
        Executing from:         ?
 
        Special Notes:          ?
 
******************************************************************************/
;~DB~************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *Mod Date     Feature Engineer                Comment
;    *--- -------- ------- --------------------    -----------------------------------
;     ### 08/19/03         Tammy Baack/Sandra Prow Initial Release
;     001 09/05/06 0107463 Van Batchelder          Correction for missing details
;~DE~************************************************************************
 
 
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************
call echo ("****************START OF DETAIL DATA********************")
 
;IV
     cnt = (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                ->for_this_page[1]->order_detail_array,5))
     row +1,
      cndx = 0
            for (c =1 to cnt)
                if (trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                        ->for_this_page[1]->order_detail_array[c]
                        ->oe_field_meaning) = iv)
                    cndx = c
                    c = cnt +1
                endif
            endfor
        if (cndx > 0)
            if (size(trim(data->req[req_ndx]->sections[sect_ndx]
                              ->exam_data[x]->for_this_page[1]
                              ->order_detail_array[cndx]
                              ->oe_field_display_value)) > 0)
 
                A_detail->IV = trim(data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[1]
                                ->order_detail_array[cndx]
                                ->oe_field_display_value)
           else
                A_detail->IV = " "
             endif
        else
           A_detail->IV = " "
        endif
 
;O2
     cnt = (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                ->for_this_page[1]->order_detail_array,5))
     row +1,
      cndx = 0
            for (c =1 to cnt)
                if (trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                        ->for_this_page[1]->order_detail_array[c]
                        ->oe_field_meaning) = o2)
                    cndx = c
                    c = cnt +1
                endif
            endfor
        if (cndx > 0)
            if (size(trim(data->req[req_ndx]->sections[sect_ndx]
                              ->exam_data[x]->for_this_page[1]
                              ->order_detail_array[cndx]
                              ->oe_field_display_value)) > 0)
 
                A_detail->O2 = trim(data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[1]
                                ->order_detail_array[cndx]
                                ->oe_field_display_value)
           else
                A_detail->O2 = " "
             endif
        else
           A_detail->O2 = " "
        endif
 
;pregnant
     cnt = (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                ->for_this_page[1]->order_detail_array,5))
     row +1,
      cndx = 0
            for (c =1 to cnt)
                if (trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                        ->for_this_page[1]->order_detail_array[c]
                        ->oe_field_meaning) = preg)
                    cndx = c
                    c = cnt +1
                endif
            endfor
        if (cndx > 0)
            if (size(trim(data->req[req_ndx]->sections[sect_ndx]
                              ->exam_data[x]->for_this_page[1]
                              ->order_detail_array[cndx]
                              ->oe_field_display_value)) > 0)
 
                A_detail->preg = trim(data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[1]
                                ->order_detail_array[cndx]
                                ->oe_field_display_value)
           else
                A_detail->preg = " "
             endif
        else
           A_detail->preg = " "
        endif
 
;isolation
     cnt = (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                ->for_this_page[1]->order_detail_array,5))
     row +1,
      cndx = 0
            for (c =1 to cnt)
                if (trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                        ->for_this_page[1]->order_detail_array[c]
                        ->oe_field_meaning) = isolation)
                    cndx = c
                    c = cnt +1
                endif
            endfor
        if (cndx > 0)
            if (size(trim(data->req[req_ndx]->sections[sect_ndx]
                              ->exam_data[x]->for_this_page[1]
                              ->order_detail_array[cndx]
                              ->oe_field_display_value)) > 0)
 
                A_detail->iso = trim(data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[1]
                                ->order_detail_array[cndx]
                                ->oe_field_display_value)
           else
                A_detail->iso = " "
             endif
        else
           A_detail->iso = " "
        endif
;LNMP
     cnt = (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                ->for_this_page[1]->order_detail_array,5))
     row +1,
      cndx = 0
            for (c =1 to cnt)
                if (trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                        ->for_this_page[1]->order_detail_array[c]
                        ->oe_field_meaning) = lnmp)
                    cndx = c
                    c = cnt +1
                endif
            endfor
        if (cndx > 0)
            if (size(trim(data->req[req_ndx]->sections[sect_ndx]
                              ->exam_data[x]->for_this_page[1]
                              ->order_detail_array[cndx]
                              ->oe_field_display_value)) > 0)
 
                A_detail->LMP = trim(data->req[req_ndx]->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[1]
                                ->order_detail_array[cndx]
                                ->oe_field_display_value)
           else
                A_detail->LMP = " "
             endif
        else
           A_detail->LMP = " "
        endif
 
;comment type 1
     cnt = (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                ->for_this_page[exam_ndx]->order_detail_array,5))
     row +1,
      cndx = 0
            for (c =1 to cnt)
                if (trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                        ->for_this_page[exam_ndx]->order_detail_array[c]
                        ->oe_field_meaning) = comment1)
                    cndx = c
                    c = cnt +1
                endif
            endfor
        if (cndx > 0)
            if (size(trim(data->req[req_ndx]->sections[sect_ndx]
                              ->exam_data[x]->for_this_page[exam_ndx]
                              ->order_detail_array[cndx]
                              ->oe_field_display_value)) > 0)
 
                A_detail->comment_type1 = trim(data->req[req_ndx]
                                ->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx]
                                ->order_detail_array[cndx]
                                ->oe_field_display_value)
           else
                A_detail->comment_type1 = " "
             endif
        else
           A_detail->comment_type1 = " "
        endif
 
;comment type 2
     cnt = (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                ->for_this_page[exam_ndx]->order_detail_array,5))
     row +1,
      cndx = 0
            for (c =1 to cnt)
                if (trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                        ->for_this_page[exam_ndx]->order_detail_array[c]
                        ->oe_field_meaning) = comment2)
                    cndx = c
                    c = cnt +1
                endif
            endfor
        if (cndx > 0)
            if (size(trim(data->req[req_ndx]->sections[sect_ndx]
                              ->exam_data[x]->for_this_page[exam_ndx]
                                    ->order_detail_array[cndx]
                              ->oe_field_display_value)) > 0)
 
                A_detail->comment_type2 = trim(data->req[req_ndx]
                                ->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx]
                                ->order_detail_array[cndx]
                                ->oe_field_display_value)
           else
                A_detail->comment_type2 = " "
             endif
        else
           A_detail->comment_type2 = " "
        endif
 
;comment text 1
     cnt = (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                ->for_this_page[exam_ndx]->order_detail_array,5))
     row +1,
      cndx = 0
            for (c =1 to cnt)
                if (trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                        ->for_this_page[exam_ndx]->order_detail_array[c]
                        ->oe_field_meaning) = commenttext1)
                    cndx = c
                    c = cnt +1
                endif
            endfor
        if (cndx > 0)
            if (size(trim(data->req[req_ndx]->sections[sect_ndx]
                              ->exam_data[x]->for_this_page[exam_ndx]
                              ->order_detail_array[cndx]
                              ->oe_field_display_value)) > 0)
 
                A_detail->comment_text1 = trim(data->req[req_ndx]
                                ->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx]
                                ->order_detail_array[cndx]
                                ->oe_field_display_value)
           else
                A_detail->comment_text1 = " "
             endif
        else
           A_detail->comment_text1 = " "
        endif
 
;comment text 2
     cnt = (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                ->for_this_page[exam_ndx]->order_detail_array,5))
     row +1,
      cndx = 0
            for (c =1 to cnt)
                if (trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                        ->for_this_page[exam_ndx]->order_detail_array[c]
                        ->oe_field_meaning) = commenttext2)
                    cndx = c
                    c = cnt +1
                endif
            endfor
        if (cndx > 0)
            if (size(trim(data->req[req_ndx]->sections[sect_ndx]
                              ->exam_data[x]->for_this_page[exam_ndx]
                                    ->order_detail_array[cndx]
                              ->oe_field_display_value)) > 0)
 
                A_detail->comment_text2 = trim(data->req[req_ndx]
                                ->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[exam_ndx]
                                ->order_detail_array[cndx]
                                ->oe_field_display_value)
           else
                A_detail->comment_text2 = " "
             endif
        else
           A_detail->comment_text2 = " "
        endif
 
;detail 1
if (detail1 != "DETAIL1")
     cnt = (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                ->for_this_page[1]->order_detail_array,5))
     row +1,
      cndx = 0
            for (c =1 to cnt)
                if (trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                        ->for_this_page[1]->order_detail_array[c]
                        ->oe_field_meaning) = detail1 and ;001
                    data->req[req_ndx].sections[sect_ndx].exam_data[x] ;001
                        .for_this_page[1].order_detail_array[c].used_ind = 0) ;001
                    cndx = c
                    data->req[req_ndx].sections[sect_ndx].exam_data[x] ;001
                        .for_this_page[1].order_detail_array[c].used_ind = 1 ;001
                    c = cnt +1
                endif
            endfor
        if (cndx > 0)
            if (size(trim(data->req[req_ndx]->sections[sect_ndx]
                              ->exam_data[x]->for_this_page[1]
                              ->order_detail_array[cndx]
                              ->oe_field_display_value)) > 0)
 
                A_detail->detail1 = trim(data->req[req_ndx]
                                ->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[1]
                                ->order_detail_array[cndx]
                                ->oe_field_display_value)
           else
                A_detail->detail1 = " "
             endif
        else
           A_detail->detail1 = " "
        endif
endif
 
;detail 2
if (detail2 != "DETAIL2")
     cnt = (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                ->for_this_page[1]->order_detail_array,5))
     row +1,
      cndx = 0
            for (c =1 to cnt)
                if (trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                        ->for_this_page[1]->order_detail_array[c]
                        ->oe_field_meaning) = detail2 and ;001
                    data->req[req_ndx].sections[sect_ndx].exam_data[x] ;001
                        .for_this_page[1].order_detail_array[c].used_ind = 0) ;001
                    cndx = c
                    data->req[req_ndx].sections[sect_ndx].exam_data[x] ;001
                        .for_this_page[1].order_detail_array[c].used_ind = 1 ;001
                    c = cnt +1
                endif
            endfor
        if (cndx > 0)
            if (size(trim(data->req[req_ndx]->sections[sect_ndx]
                              ->exam_data[x]->for_this_page[1]
                              ->order_detail_array[cndx]
                              ->oe_field_display_value)) > 0)
 
                A_detail->detail2 = trim(data->req[req_ndx]
                                ->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[1]
                                ->order_detail_array[cndx]
                                ->oe_field_display_value)
           else
                A_detail->detail2 = " "
             endif
        else
           A_detail->detail2 = " "
        endif
endif
 
        ;detail 3
if (detail3 != "DETAIL3")
        cnt = (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                ->for_this_page[1]->order_detail_array,5))
     row +1,
      cndx = 0
            for (c =1 to cnt)
                if (trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                        ->for_this_page[1]->order_detail_array[c]
                        ->oe_field_meaning) = detail3 and ;001
                    data->req[req_ndx].sections[sect_ndx].exam_data[x] ;001
                        .for_this_page[1].order_detail_array[c].used_ind = 0) ;001
                    cndx = c
                    data->req[req_ndx].sections[sect_ndx].exam_data[x] ;001
                        .for_this_page[1].order_detail_array[c].used_ind = 1 ;001
                    c = cnt +1
                endif
            endfor
        if (cndx > 0)
            if (size(trim(data->req[req_ndx]->sections[sect_ndx]
                              ->exam_data[x]->for_this_page[1]
                              ->order_detail_array[cndx]
                              ->oe_field_display_value)) > 0)
 
                A_detail->detail3 = trim(data->req[req_ndx]
                                ->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[1]
                                ->order_detail_array[cndx]
                                ->oe_field_display_value)
           else
                A_detail->detail3 = " "
             endif
        else
           A_detail->detail3 = " "
        endif
endif
 
        ;detail 4
if (detail4 != "DETAIL4")
      cnt = (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                ->for_this_page[1]->order_detail_array,5))
     row +1,
      cndx = 0
            for (c =1 to cnt)
                if (trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                        ->for_this_page[1]->order_detail_array[c]
                        ->oe_field_meaning) = detail4 and ;001
                    data->req[req_ndx].sections[sect_ndx].exam_data[x] ;001
                        .for_this_page[1].order_detail_array[c].used_ind = 0) ;001
                    cndx = c
                    data->req[req_ndx].sections[sect_ndx].exam_data[x] ;001
                        .for_this_page[1].order_detail_array[c].used_ind = 1 ;001
                    c = cnt +1
                endif
            endfor
        if (cndx > 0)
            if (size(trim(data->req[req_ndx]->sections[sect_ndx]
                              ->exam_data[x]->for_this_page[1]
                              ->order_detail_array[cndx]
                              ->oe_field_display_value)) > 0)
 
                A_detail->detail4 = trim(data->req[req_ndx]
                                ->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[1]
                                ->order_detail_array[cndx]
                                ->oe_field_display_value)
           else
                A_detail->detail4 = " "
             endif
        else
           A_detail->detail4 = " "
        endif
endif
 
;detail 5
if (detail5 != "DETAIL5")
     cnt = (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                ->for_this_page[1]->order_detail_array,5))
     row +1,
      cndx = 0
            for (c =1 to cnt)
                if (trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                        ->for_this_page[1]->order_detail_array[c]
                        ->oe_field_meaning) = detail5 and ;001
                    data->req[req_ndx].sections[sect_ndx].exam_data[x] ;001
                        .for_this_page[1].order_detail_array[c].used_ind = 0) ;001
                    cndx = c
                    data->req[req_ndx].sections[sect_ndx].exam_data[x] ;001
                        .for_this_page[1].order_detail_array[c].used_ind = 1 ;001
                    c = cnt +1
                endif
            endfor
        if (cndx > 0)
            if (size(trim(data->req[req_ndx]->sections[sect_ndx]
                              ->exam_data[x]->for_this_page[1]
                              ->order_detail_array[cndx]
                              ->oe_field_display_value)) > 0)
 
                A_detail->detail5 = trim(data->req[req_ndx]
                                ->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[1]
                                ->order_detail_array[cndx]
                                ->oe_field_display_value)
           else
                A_detail->detail5 = " "
             endif
        else
           A_detail->detail5 = " "
        endif
endif
 
        ;detail 6
if (detail6 > 0)
     cnt = (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                ->for_this_page[1]->order_detail_array,5))
     row +1,
      cndx = 0
            for (c =1 to cnt)
                if (data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                        ->for_this_page[1]->order_detail_array[c]
                        ->oe_field_id = detail6 and ;001
                    data->req[req_ndx].sections[sect_ndx].exam_data[x] ;001
                        .for_this_page[1].order_detail_array[c].used_ind = 0) ;001
                    cndx = c
                    data->req[req_ndx].sections[sect_ndx].exam_data[x] ;001
                        .for_this_page[1].order_detail_array[c].used_ind = 1 ;001
                    c = cnt +1
                endif
            endfor
        if (cndx > 0)
            if (size(trim(data->req[req_ndx]->sections[sect_ndx]
                              ->exam_data[x]->for_this_page[1]
                              ->order_detail_array[cndx]
                              ->oe_field_display_value)) > 0)
 
                A_detail->detail6 = trim(data->req[req_ndx]
                                ->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[1]
                                ->order_detail_array[cndx]
                                ->oe_field_display_value)
           else
                A_detail->detail6 = " "
             endif
        else
           A_detail->detail6 = " "
        endif
endif
 
;detail 7
if (detail7 > 0)
     cnt = (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                ->for_this_page[1]->order_detail_array,5))
     row +1,
      cndx = 0
            for (c =1 to cnt)
                if (data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                        ->for_this_page[1]->order_detail_array[c]
                        ->oe_field_id = detail7 and ;001
                    data->req[req_ndx].sections[sect_ndx].exam_data[x] ;001
                        .for_this_page[1].order_detail_array[c].used_ind = 0) ;001
                    cndx = c
                    data->req[req_ndx].sections[sect_ndx].exam_data[x] ;001
                        .for_this_page[1].order_detail_array[c].used_ind = 1 ;001
                    c = cnt +1
                endif
            endfor
        if (cndx > 0)
            if (size(trim(data->req[req_ndx]->sections[sect_ndx]
                              ->exam_data[x]->for_this_page[1]
                              ->order_detail_array[cndx]
                              ->oe_field_display_value)) > 0)
 
                A_detail->detail7 = trim(data->req[req_ndx]
                                ->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[1]
                                ->order_detail_array[cndx]
                                ->oe_field_display_value)
           else
                A_detail->detail7 = " "
             endif
        else
           A_detail->detail7 = " "
        endif
endif
 
 
;detail 8
if (detail8 > 0)
     cnt = (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                ->for_this_page[1]->order_detail_array,5))
     row +1,
      cndx = 0
            for (c =1 to cnt)
                if (data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                        ->for_this_page[1]->order_detail_array[c]
                        ->oe_field_id = detail8 and ;001
                    data->req[req_ndx].sections[sect_ndx].exam_data[x] ;001
                        .for_this_page[1].order_detail_array[c].used_ind = 0) ;001
                    cndx = c
                    data->req[req_ndx].sections[sect_ndx].exam_data[x] ;001
                        .for_this_page[1].order_detail_array[c].used_ind = 1 ;001
                    c = cnt +1
                endif
            endfor
        if (cndx > 0)
            if (size(trim(data->req[req_ndx]->sections[sect_ndx]
                              ->exam_data[x]->for_this_page[1]
                              ->order_detail_array[cndx]
                              ->oe_field_display_value)) > 0)
 
                A_detail->detail8 = trim(data->req[req_ndx]
                                ->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[1]
                                ->order_detail_array[cndx]
                                ->oe_field_display_value)
           else
                A_detail->detail8 = " "
             endif
        else
           A_detail->detail8 = " "
        endif
endif
 
;detail 9
if (detail9 > 0)
     cnt = (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                ->for_this_page[1]->order_detail_array,5))
     row +1,
      cndx = 0
            for (c =1 to cnt)
                if (data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                        ->for_this_page[1]->order_detail_array[c]
                        ->oe_field_id = detail9 and ;001
                    data->req[req_ndx].sections[sect_ndx].exam_data[x] ;001
                        .for_this_page[1].order_detail_array[c].used_ind = 0) ;001
                    cndx = c
                    data->req[req_ndx].sections[sect_ndx].exam_data[x] ;001
                        .for_this_page[1].order_detail_array[c].used_ind = 1 ;001
                    c = cnt +1
                endif
            endfor
        if (cndx > 0)
            if (size(trim(data->req[req_ndx]->sections[sect_ndx]
                              ->exam_data[x]->for_this_page[1]
                              ->order_detail_array[cndx]
                              ->oe_field_display_value)) > 0)
 
                A_detail->detail9 = trim(data->req[req_ndx]
                                ->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[1]
                                ->order_detail_array[cndx]
                                ->oe_field_display_value)
           else
                A_detail->detail9 = " "
             endif
        else
           A_detail->detail9 = " "
        endif
endif
 
 
;detail 10
if (detail10 > 0)
     cnt = (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                ->for_this_page[1]->order_detail_array,5))
     row +1,
      cndx = 0
            for (c =1 to cnt)
                if (data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                        ->for_this_page[1]->order_detail_array[c]
                        ->oe_field_id = detail10 and ;001
                    data->req[req_ndx].sections[sect_ndx].exam_data[x] ;001
                        .for_this_page[1].order_detail_array[c].used_ind = 0) ;001
                    cndx = c
                    data->req[req_ndx].sections[sect_ndx].exam_data[x] ;001
                        .for_this_page[1].order_detail_array[c].used_ind = 1 ;001
                    c = cnt +1
                endif
            endfor
        if (cndx > 0)
            if (size(trim(data->req[req_ndx]->sections[sect_ndx]
                              ->exam_data[x]->for_this_page[1]
                              ->order_detail_array[cndx]
                              ->oe_field_display_value)) > 0)
 
                A_detail->detail10 = trim(data->req[req_ndx]
                                ->sections[sect_ndx]
                                ->exam_data[x]->for_this_page[1]
                                ->order_detail_array[cndx]
                                ->oe_field_display_value)
           else
                A_detail->detail10 = " "
             endif
        else
           A_detail->detail10 = " "
        endif
endif


