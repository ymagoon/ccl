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
 
        Source file name:       rad_packet_physician_data.inc
        Object name:            n/a
        Request #:              multiple
 
        Product:                GARPP
        Product Team:           Radnet
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        Data fields for displaying the various physician 
                                information on the patient packet
 
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

call echo("*****START OF PHYSICIAN DATA*****")
 
;admit doc name
    if(size(data->req[req_ndx]->patient_data->admit_phy_name)>0)
        A_doc->admit_doc_name = data->req[req_ndx]->patient_data->admit_phy_name
    else
        A_doc->admit_doc_name  = " "
    endif
 
;admit doc phone
    if(size(data->req[req_ndx]->patient_data->admit_phy_phone)>0)
        A_doc->admit_doc_phone = data->req[req_ndx]->patient_data
                                   ->admit_phy_phone
    else
        A_doc->admit_doc_phone  = " "
    endif
 
;admit doc fax
    if(size(data->req[req_ndx]->patient_data->admit_phy_fax)>0)
        A_doc->admit_doc_fax = data->req[req_ndx]->patient_data
                                 ->admit_phy_fax
    else
        A_doc->admit_doc_fax = " "
    endif
 
;admit doc pager
    if(size(data->req[req_ndx]->patient_data->admit_phy_pager)>0)
        A_doc->admit_doc_pager = data->req[req_ndx]->patient_data
                                  ->admit_phy_pager
    else
        A_doc->admit_doc_pager = " "
    endif
 
;referring doc name
    if(size(data->req[req_ndx]->patient_data->refer_phy_name)>0)
        A_doc->refer_doc_name  = data->req[req_ndx]->patient_data->refer_phy_name
    else
        A_doc->refer_doc_name = " "
    endif
 
;referring doc phone
    if(size(data->req[req_ndx]->patient_data->refer_phy_phone)>0)
        A_doc->refer_doc_phone = data->req[req_ndx]->patient_data
                                 ->refer_phy_phone
    else
        A_doc->refer_doc_phone = " "
    endif
 
;referring doc fax
    if(size(data->req[req_ndx]->patient_data->refer_phy_fax)>0)
        A_doc->refer_doc_fax = data->req[req_ndx]->patient_data
                                ->refer_phy_fax
   else
        A_doc->refer_doc_fax = " "
    endif
 
;referring doc pager
    if(size(data->req[req_ndx]->patient_data->refer_phy_pager)>0)
        A_doc->refer_doc_pager = data->req[req_ndx]->patient_data
                                   ->refer_phy_pager
    else
        A_doc->refer_doc_pager = " "
    endif
 
;order doc
    if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                ->for_this_page[exam_ndx]->order_physician)) > 0)
        A_doc->order_doc_name = data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                                      ->for_this_page[exam_ndx]->order_physician
    else
         A_doc->order_doc_name = " "
    endif
 
;order doc phone
    if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                ->for_this_page[exam_ndx]->order_phy_phone)) > 0)
      A_doc->order_doc_phone = data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                                   ->for_this_page[exam_ndx]->order_phy_phone
    else
        A_doc->order_doc_phone = " "
    endif
 
;order doc fax
    if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                ->for_this_page[exam_ndx]->order_phy_phone)) > 0)
      A_doc->order_doc_fax = data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                                 ->for_this_page[exam_ndx]->order_phy_fax
    else
        A_doc->order_doc_fax = " "
    endif
 
;order doc pager
    if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                ->for_this_page[exam_ndx]->order_phy_phone)) > 0)
      A_doc->order_doc_pager = data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                                  ->for_this_page[exam_ndx]->order_phy_pager
    else
        A_doc->order_doc_pager = " "
    endif
 
;attending doc name
    if(size(data->req[req_ndx]->patient_data->attend_phy_name)>0)
        A_doc->attend_doc_name = data->req[req_ndx]->patient_data->attend_phy_name
    else
        A_doc->attend_doc_name = " "
    endif
 
;attending doc phone
    if(size(data->req[req_ndx]->patient_data->attend_phy_phone)>0)
        A_doc->attend_doc_phone = data->req[req_ndx]->patient_data
                            ->attend_phy_phone
    else
        A_doc->attend_doc_phone = " "
    endif
 
;attending doc fax
    if(size(data->req[req_ndx]->patient_data->attend_phy_fax)>0)
        A_doc->attend_doc_fax = data->req[req_ndx]->patient_data
                            ->attend_phy_fax
    else
        A_doc->attend_doc_fax = " "
    endif
 
;attending doc pager
    if(size(data->req[req_ndx]->patient_data->attend_phy_pager)>0)
        A_doc->attend_doc_pager = data->req[req_ndx]->patient_data
                                   ->attend_phy_pager
    else
        A_doc->attend_doc_pager = " "
    endif
;family doc name
    if(size(data->req[req_ndx]->patient_data->family_phy_name)>0)
        A_doc->family_doc_name = data->req[req_ndx]->patient_data->family_phy_name
    else
        A_doc->family_doc_name = " "
    endif
 
;family doc phone
    if(size(data->req[req_ndx]->patient_data->family_phy_phone)>0)
        A_doc->family_doc_phone = data->req[req_ndx]->patient_data
                            ->family_phy_phone
    else
        A_doc->family_doc_phone = " "
    endif
 
;family doc fax
    if(size(data->req[req_ndx]->patient_data->family_phy_fax)>0)
        A_doc->family_doc_fax = data->req[req_ndx]->patient_data
                            ->family_phy_fax
    else
        A_doc->family_doc_fax = " "
    endif
 
;family doc pager
    if(size(data->req[req_ndx]->patient_data->family_phy_pager)>0)
        A_doc->family_doc_pager = data->req[req_ndx]->patient_data
                                   ->family_phy_pager
    else
        A_doc->family_doc_pager = " "
    endif

 ;consult physician 1
if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                        ->for_this_page[exam_ndx]->consult_doc,5) > 0)
        if(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                        ->for_this_page[exam_ndx]->consult_doc[1]
                        ->consult_phy_name) != " ")
            A_doc->consult_doc_name_1 = data->req[req_ndx]
                                ->sections[sect_ndx]->exam_data[x]
                                ->for_this_page[exam_ndx]->consult_doc[1]
                                ->consult_phy_name
        else
            A_doc->consult_doc_name_1  = " "
        endif
 
 
;consult doc 1 phone
 
         if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx]->consult_doc[1]
                          ->consult_phy_phone)) > 0)
             A_doc->consult_doc_phone_1 = data->req[req_ndx]
                                   ->sections[sect_ndx]->exam_data[x]
                                   ->for_this_page[exam_ndx]->consult_doc[1]
                                   ->consult_phy_phone
         else
             A_doc->consult_doc_phone_1 = " "
         endif
 
;consult doc 1 pager
 
         if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx]->consult_doc[1]
                          ->consult_phy_pager)) > 0)
             A_doc->consult_doc_pager_1 = data->req[req_ndx]
                                   ->sections[sect_ndx]->exam_data[x]
                                   ->for_this_page[exam_ndx]->consult_doc[1]
                                   ->consult_phy_pager
         else
             A_doc->consult_doc_pager_1 = " "
         endif
 
;consult doc 1 fax
 
         if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx]->consult_doc[1]
                          ->consult_phy_fax)) > 0)
             A_doc->consult_doc_fax_1 = data->req[req_ndx]
                                   ->sections[sect_ndx]->exam_data[x]
                                   ->for_this_page[exam_ndx]->consult_doc[1]
                                   ->consult_phy_fax
         else
             A_doc->consult_doc_fax_1 = " "
         endif
 
endif
;consult physician 2
    if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                          ->for_this_page[exam_ndx]->consult_doc,5)>1)
 
            if(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                                ->for_this_page[exam_ndx]->consult_doc[2]
                                ->consult_phy_name) != " ")
                A_doc->consult_doc_name_2 = data->req[req_ndx]
                                ->sections[sect_ndx]->exam_data[x]
                                ->for_this_page[exam_ndx]->consult_doc[2]
                                ->consult_phy_name
            else
                A_doc->consult_doc_name_2 = " "
            endif
 
;consult doc 2 phone
 
         if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx]->consult_doc[2]
                           ->consult_phy_phone)) > 0)
              A_doc->consult_doc_phone_2 = data->req[req_ndx]->sections[sect_ndx]
                                    ->exam_data[x]->for_this_page[exam_ndx]
                                    ->consult_doc[2]
                                    ->consult_phy_phone
         else
              A_doc->consult_doc_phone_2 = " "
         endif
 
;consult doc 2 pager
 
         if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx]->consult_doc[2]
                           ->consult_phy_pager)) > 0)
              A_doc->consult_doc_pager_2 = data->req[req_ndx]->sections[sect_ndx]
                                    ->exam_data[x]->for_this_page[exam_ndx]
                                    ->consult_doc[2]
                                    ->consult_phy_pager
         else
              A_doc->consult_doc_pager_2 = " "
         endif
 
;consult doc 2 fax
 
         if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx]->consult_doc[2]
                           ->consult_phy_fax)) > 0)
              A_doc->consult_doc_fax_2 = data->req[req_ndx]->sections[sect_ndx]
                                    ->exam_data[x]->for_this_page[exam_ndx]
                                    ->consult_doc[2]
                                    ->consult_phy_fax
         else
              A_doc->consult_doc_fax_2 = " "
         endif
 
    endif
 
;consult physician 3
        if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                        ->for_this_page[exam_ndx]->consult_doc,5) > 2)
 
            if(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                        ->for_this_page[exam_ndx]->consult_doc[3]
                        ->consult_phy_name) != " ")
                A_doc->consult_doc_name_3 = data->req[req_ndx]
                                ->sections[sect_ndx]->exam_data[x]
                                ->for_this_page[exam_ndx]->consult_doc[3]
                                ->consult_phy_name
            else
                A_doc->consult_doc_name_3 = " "
            endif
 
;consult doc 3 phone
 
         if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx]->consult_doc[3]
                           ->consult_phy_phone)) > 0)
              A_doc->consult_doc_phone_3 = data->req[req_ndx]->sections[sect_ndx]
                                    ->exam_data[x]->for_this_page[exam_ndx]
                                    ->consult_doc[3]
                                    ->consult_phy_phone
         else
              A_doc->consult_doc_phone_3 = " "
         endif
 
;consult doc 3 pager
 
         if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx]->consult_doc[3]
                           ->consult_phy_pager)) > 0)
              A_doc->consult_doc_pager_3 = data->req[req_ndx]->sections[sect_ndx]
                                    ->exam_data[x]->for_this_page[exam_ndx]
                                    ->consult_doc[3]
                                    ->consult_phy_pager
         else
              A_doc->consult_doc_pager_3 = " "
         endif
 
;consult doc 3 fax
 
         if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx]->consult_doc[3]
                           ->consult_phy_fax)) > 0)
              A_doc->consult_doc_fax_3 = data->req[req_ndx]->sections[sect_ndx]
                                    ->exam_data[x]->for_this_page[exam_ndx]
                                    ->consult_doc[3]
                                    ->consult_phy_fax
         else
              A_doc->consult_doc_fax_3 = " "
         endif
 
endif
;consult physician 4
        if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                        ->for_this_page[exam_ndx]->consult_doc,5) > 3)
            if(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                  ->for_this_page[exam_ndx]->consult_doc[4]
                  ->consult_phy_name)!= " ")
                A_doc->consult_doc_name_4 = data->req[req_ndx]
                                ->sections[sect_ndx]->exam_data[x]
                                ->for_this_page[exam_ndx]->consult_doc[4]
                                ->consult_phy_name
            else
                A_doc->consult_doc_name_4 = " "
            endif
 
;consult doc 4 phone
 
         if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx]->consult_doc[4]
                           ->consult_phy_phone)) > 0)
              A_doc->consult_doc_phone_4 = data->req[req_ndx]->sections[sect_ndx]
                                    ->exam_data[x]->for_this_page[exam_ndx]
                                    ->consult_doc[4]
                                    ->consult_phy_phone
         else
              A_doc->consult_doc_phone_4 = " "
         endif
 
;consult doc 4 pager
 
         if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx]->consult_doc[4]
                           ->consult_phy_pager)) > 0)
              A_doc->consult_doc_pager_4 = data->req[req_ndx]->sections[sect_ndx]
                                    ->exam_data[x]->for_this_page[exam_ndx]
                                    ->consult_doc[4]
                                    ->consult_phy_pager
         else
             A_doc->consult_doc_pager_4 = " "
         endif
 
;consult doc 4 fax
 
         if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx]->consult_doc[4]
                           ->consult_phy_fax)) > 0)
              A_doc->consult_doc_fax_4 = data->req[req_ndx]->sections[sect_ndx]
                                    ->exam_data[x]->for_this_page[exam_ndx]
                                    ->consult_doc[4]
                                    ->consult_phy_fax
         else
             A_doc->consult_doc_fax_4 = " "
         endif
 
    endif
 
;consult physician 5
        if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                        ->for_this_page[exam_ndx]->consult_doc,5) > 4)
            if(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                  ->for_this_page[exam_ndx]->consult_doc[5]
                  ->consult_phy_name)!= " ")
                A_doc->consult_doc_name_5 = data->req[req_ndx]
                                ->sections[sect_ndx]->exam_data[x]
                                ->for_this_page[exam_ndx]
                                ->consult_doc[5]->consult_phy_name
            else
                A_doc->consult_doc_name_5 = " "
            endif
 
;consult doc 5 phone
 
         if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx]->consult_doc[5]
                           ->consult_phy_phone)) > 0)
              A_doc->consult_doc_phone_5 = data->req[req_ndx]->sections[sect_ndx]
                                    ->exam_data[x]->for_this_page[exam_ndx]
                                    ->consult_doc[5]
                                    ->consult_phy_phone
         else
             A_doc->consult_doc_phone_5 = " "
         endif
 
;consult doc 5 pager
 
         if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx]->consult_doc[5]
                           ->consult_phy_pager)) > 0)
              A_doc->consult_doc_pager_5 = data->req[req_ndx]->sections[sect_ndx]
                                    ->exam_data[x]->for_this_page[exam_ndx]
                                    ->consult_doc[5]
                                        ->consult_phy_pager
         else
             A_doc->consult_doc_pager_5 = " "
         endif
 
;consult doc 5 fax
 
         if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx]->consult_doc[5]
                           ->consult_phy_fax)) > 0)
              A_doc->consult_doc_fax_5 = data->req[req_ndx]->sections[sect_ndx]
                                    ->exam_data[x]->for_this_page[exam_ndx]
                                    ->consult_doc[5]
                                    ->consult_phy_fax
         else
             A_doc->consult_doc_fax_5 = " "
         endif
 
endif
 
;consult physician 6
if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                        ->for_this_page[exam_ndx]->consult_doc,5) > 5)
            if(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                  ->for_this_page[exam_ndx]->consult_doc[6]
                  ->consult_phy_name)!= " ")
                A_doc->consult_doc_name_6 = data->req[req_ndx]
                                ->sections[sect_ndx]->exam_data[x]
                                ->for_this_page[exam_ndx]->consult_doc[6]
                                ->consult_phy_name
            else
                A_doc->consult_doc_name_6 = " "
            endif
 
;consult doc 6 phone
 
         if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx]->consult_doc[6]
                           ->consult_phy_phone)) > 0)
              A_doc->consult_doc_phone_6 = data->req[req_ndx]->sections[sect_ndx]
                                    ->exam_data[x]->for_this_page[exam_ndx]
                                    ->consult_doc[6]
                                    ->consult_phy_phone
         else
              A_doc->consult_doc_phone_6 = " "
         endif
 
;consult doc 6 pager
 
         if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx]->consult_doc[6]
                           ->consult_phy_pager)) > 0)
              A_doc->consult_doc_pager_6 = data->req[req_ndx]->sections[sect_ndx]
                                    ->exam_data[x]->for_this_page[exam_ndx]
                                    ->consult_doc[6]
                                    ->consult_phy_pager
         else
              A_doc->consult_doc_pager_6 = " "
         endif
 
;consult doc 6 fax
 
         if (size(trim(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                           ->for_this_page[exam_ndx]->consult_doc[6]
                           ->consult_phy_fax)) > 0)
              A_doc->consult_doc_fax_6 = data->req[req_ndx]->sections[sect_ndx]
                                    ->exam_data[x]->for_this_page[exam_ndx]
                                    ->consult_doc[6]
                                    ->consult_phy_fax
         else
              A_doc->consult_doc_fax_6 = " "
         endif
 
 endif
 
 
 


