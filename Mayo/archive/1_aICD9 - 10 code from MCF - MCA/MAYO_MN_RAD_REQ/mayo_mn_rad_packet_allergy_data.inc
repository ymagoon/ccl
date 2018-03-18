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
 
        Source file name:       rad_packet_allergy_data.inc
        Object name:            n/a
        Request #:              multiple
 
        Product:                GARPP
        Product Team:           Radnet
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        Data fields for allergy info 
 
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
 call echo ("****************START OF ALLERGY DATA********************")

/*******************************
*include file for allergy data**
*******************************/
;allergy 1
        if (size(data->req[req_ndx]->allergy,5) > 0)
           if (trim(data->req[req_ndx]->allergy[1]->flexed_desc) != " ")
              A_allergy->allergy_1 = data->req[req_ndx]
                         ->allergy[1]->flexed_desc
           else
              A_allergy->allergy_1 = " "
           endif
        endif
 
        if (size(data->req[req_ndx]->allergy,5) > 1)
            if (trim(data->req[req_ndx]->allergy[2]->flexed_desc) != " ")
              A_allergy->allergy_2 = data->req[req_ndx]->
                        allergy[2]->flexed_desc
            else
                A_allergy->allergy_2 = " "
            endif
        endif
 
        if (size(data->req[req_ndx]->allergy,5) > 2)
            if (trim(data->req[req_ndx]->allergy[3]->flexed_desc) != " ")
               A_allergy->allergy_3 = data->req[req_ndx]->
                          allergy[3]->flexed_desc
            else
               A_allergy->allergy_3 = " "
            endif
        endif
 
        if (size(data->req[req_ndx]->allergy,5) > 3)
            if (trim(data->req[req_ndx]->allergy[4]->flexed_desc) != " ")
               A_allergy->allergy_4 = data->req[req_ndx]->
                                      allergy[4]->flexed_desc
            else
               A_allergy->allergy_4 = " "
            endif
        endif
 
        if (size(data->req[req_ndx]->allergy,5) > 4)
            if (trim(data->req[req_ndx]->allergy[5]->flexed_desc) != " ")
               A_allergy->allergy_5 = data->req[req_ndx]->
                          allergy[5]->flexed_desc
            else
               A_allergy->allergy_5 = " "
            endif
        endif
 
        if (size(data->req[req_ndx]->allergy,5) > 5)
            if (trim(data->req[req_ndx]->allergy[6]->flexed_desc) != " ")
               A_allergy->allergy_6 = data->req[req_ndx]->
                          allergy[6]->flexed_desc
            else
               A_allergy->allergy_6 = " "
            endif
        endif
 
        if (size(data->req[req_ndx]->allergy,5) > 6)
            if (trim(data->req[req_ndx]->allergy[7]->flexed_desc) != " ")
               A_allergy->allergy_7 = data->req[req_ndx]->
                          allergy[7]->flexed_desc
            else
               A_allergy->allergy_7 = " "
            endif
        endif
 
        if (size(data->req[req_ndx]->allergy,5) > 7)
            if (trim(data->req[req_ndx]->allergy[8]->flexed_desc) != " ")
               A_allergy->allergy_8 = data->req[req_ndx]->
                           allergy[8]->flexed_desc
            else
               A_allergy->allergy_8 = " "
            endif
        endif
 
        if (size(data->req[req_ndx]->allergy,5) > 8)
            if (trim(data->req[req_ndx]->allergy[9]->flexed_desc) != " ")
               A_allergy->allergy_9 = data->req[req_ndx]->allergy[9]
                                      ->flexed_desc
            else
               A_allergy->allergy_9 = " "
            endif
        endif
 
        if (size(data->req[req_ndx]->allergy,5) > 9)
            if (trim(data->req[req_ndx]->allergy[10]->flexed_desc) != " ")
               A_allergy->allergy_10 = data->req[req_ndx]->allergy[10]
                                       ->flexed_desc
            else
               A_allergy->allergy_10 = " "
            endif
        endif
 
        if (size(data->req[req_ndx]->allergy,5) > 10)
            if (trim(data->req[req_ndx]->allergy[11]->flexed_desc) != " ")
               A_allergy->allergy_11 = data->req[req_ndx]->allergy[11]
                                       ->flexed_desc
            else
               A_allergy->allergy_11 = " "
            endif
        endif
 
        if (size(data->req[req_ndx]->allergy,5) > 11)
            if (trim(data->req[req_ndx]->allergy[12]->flexed_desc) != " ")
               A_allergy->allergy_12 = data->req[req_ndx]->allergy[12]
                                       ->flexed_desc
            else
               A_allergy->allergy_12 = " "
            endif
        endif
 


