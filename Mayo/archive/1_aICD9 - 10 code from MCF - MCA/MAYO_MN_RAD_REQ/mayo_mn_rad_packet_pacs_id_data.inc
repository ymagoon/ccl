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
 
        Source file name:       rad_packet_pacs_id_data.inc
        Object name:            n/a
        Request #:              multiple
 
        Product:                GARPP
        Product Team:           Radnet
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        Data fields for the pacs id and barcode
 
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
call echo("*****START OF PACS ID DATA*****")

;exam 1 pacs id
if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                         ->for_this_page,5) > 0)

    if (data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                          ->for_this_page[exam_ndx]->pacs_id > 0)
         A_PACS->pacs_id_1 = cnvtstring(data->req[req_ndx]
                          ->sections[sect_ndx]->exam_data[x]
                         ->for_this_page[exam_ndx]->pacs_id)
         A_PACS->bc_pacs_id_1 = concat("*",trim(A_PACS->pacs_id_1),"*")
    else
         A_PACS->pacs_id_1 = " "
         A_PACS->bc_pacs_id_1 = " "
    endif
endif
;exam 2 pacs id
if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                         ->for_this_page,5) > 1)
    if (data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                          ->for_this_page[exam_ndx+1]->pacs_id > 1)
         A_PACS->pacs_id_2 =cnvtstring(data->req[req_ndx]
                          ->sections[sect_ndx]->exam_data[x]
                         ->for_this_page[exam_ndx+1]->pacs_id)
         A_PACS->bc_pacs_id_2 = concat("*",trim(A_PACS->pacs_id_2),"*")
    else
         A_PACS->pacs_id_2 = " "
         A_PACS->bc_pacs_id_2 = " "
    endif

endif
;exam 3 pacs id
if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                         ->for_this_page,5) > 2)
    if (data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                          ->for_this_page[exam_ndx+2]->pacs_id > 0)
         A_PACS->pacs_id_3 =cnvtstring(data->req[req_ndx]
                          ->sections[sect_ndx]->exam_data[x]
                         ->for_this_page[exam_ndx+2]->pacs_id)
         A_PACS->bc_pacs_id_3 = concat("*",trim(A_PACS->pacs_id_3),"*")
    else
         A_PACS->pacs_id_3 = " "
         A_PACS->bc_pacs_id_3 = " "
    endif

 endif
;exam 4 pacs id
if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                         ->for_this_page,5) > 3)

    if (data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                          ->for_this_page[exam_ndx+3]->pacs_id > 0)
         A_PACS->pacs_id_4 = cnvtstring(data->req[req_ndx]
                          ->sections[sect_ndx]->exam_data[x]
                         ->for_this_page[exam_ndx+3]->pacs_id)
         A_PACS->bc_pacs_id_4 = concat("*",trim(A_PACS->pacs_id_4),"*")
    else
         A_PACS->pacs_id_4 = " "
         A_PACS->bc_pacs_id_4 = " "
    endif   
endif

;exam 5 pacs id
if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                         ->for_this_page,5) > 4)

    if (data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                          ->for_this_page[exam_ndx+4]->pacs_id > 0)
         A_PACS->pacs_id_5 = cnvtstring(data->req[req_ndx]
                          ->sections[sect_ndx]->exam_data[x]
                         ->for_this_page[exam_ndx+4]->pacs_id)
         A_PACS->bc_pacs_id_5 = concat("*",trim(A_PACS->pacs_id_5),"*")
    else
         A_PACS->pacs_id_5 = " "
         A_PACS->bc_pacs_id_5 = " "
    endif
endif
;exam 6 pacs id
if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                         ->for_this_page,5) > 5)

    if (data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                          ->for_this_page[exam_ndx+5]->pacs_id > 0)
         A_PACS->pacs_id_6 =cnvtstring(data->req[req_ndx]
                          ->sections[sect_ndx]->exam_data[x]
                         ->for_this_page[exam_ndx+5]->pacs_id)
         A_PACS->bc_pacs_id_6 = concat("*",trim(A_PACS->pacs_id_6),"*")
    else
         A_PACS->pacs_id_6 = " "
         A_PACS->bc_pacs_id_6 = " "
    endif
endif
;exam 7 pacs id
if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                         ->for_this_page,5) > 6)

    if (data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                          ->for_this_page[exam_ndx+6]->pacs_id > 0)
         A_PACS->pacs_id_7 = cnvtstring(data->req[req_ndx]
                          ->sections[sect_ndx]->exam_data[x]
                         ->for_this_page[exam_ndx+6]->pacs_id)
         A_PACS->bc_pacs_id_7 = concat("*",trim(A_PACS->pacs_id_7),"*")
    else
         A_PACS->pacs_id_7 = " "
         A_PACS->bc_pacs_id_7 = " "
    endif

endif
;exam 8 pacs id
if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                         ->for_this_page,5) > 7)

    if (data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                          ->for_this_page[exam_ndx+7]->pacs_id > 0)
         A_PACS->pacs_id_8 = cnvtstring(data->req[req_ndx]
                          ->sections[sect_ndx]->exam_data[x]
                         ->for_this_page[exam_ndx+7]->pacs_id)
         A_PACS->bc_pacs_id_8 = concat("*",trim(A_PACS->pacs_id_8),"*")
    else
         A_PACS->pacs_id_8 = " "
         A_PACS->bc_pacs_id_8 = " "
    endif

endif
;exam 9 pacs id
if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                         ->for_this_page,5) > 8)
    if (data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                          ->for_this_page[exam_ndx+8]->pacs_id > 0)
         A_PACS->pacs_id_9 = cnvtstring(data->req[req_ndx]
                          ->sections[sect_ndx]->exam_data[x]
                         ->for_this_page[exam_ndx+8]->pacs_id)
         A_PACS->bc_pacs_id_9 = concat("*",trim(A_PACS->pacs_id_9),"*")
    else
         A_PACS->pacs_id_9 = " "
         A_PACS->bc_pacs_id_9 = " "
    endif

endif
;exam 10 pacs id
if (size(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                         ->for_this_page,5) > 9)

    if (data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                          ->for_this_page[exam_ndx+9]->pacs_id > 0)
         A_PACS->pacs_id_10 = cnvtstring(data->req[req_ndx]
                          ->sections[sect_ndx]->exam_data[x]
                         ->for_this_page[exam_ndx+9]->pacs_id)
         A_PACS->bc_pacs_id_10 = concat("*",trim(A_PACS->pacs_id_10),"*")
    else
         A_PACS->pacs_id_10 = " "
         A_PACS->bc_pacs_id_10 = " "
    endif
endif



