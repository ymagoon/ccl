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
 
        Source file name:       rad_packet_addresses_data.inc
        Object name:            n/a
        Request #:              multiple
 
        Product:                GARPP
        Product Team:           Radnet
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        Data for printing addresses on packet forms
 
        Tables read:            many
 
        Tables updated:         none
        Executing from:         rad_rpt_packet_get_info
 
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
 call echo ("****************START ADDRESS DATA********************")

 
;facility name
    if(data->req[req_ndx]->patient_data->facility_desc > " ")
        A_facility->facility_name = data->req[req_ndx]->patient_data->facility_desc 
    else
        A_facility->facility_name = " "
    endif
 
;inst name
    if(data->req[req_ndx]->sections[sect_ndx]->inst_desc > " ")
        A_facility->inst_name = data->req[req_ndx]->sections[sect_ndx]->inst_desc
    else
        A_facility->inst_name = " "
    endif
 
;section display
    if(data->req[req_ndx]->sections[sect_ndx]->section_disp > " ")
        A_facility->sect_disp = data->req[req_ndx]->sections[sect_ndx]
                           ->section_disp
    else
        A_facility->sect_disp = " "
    endif
 
;dept name
    if(data->req[req_ndx]->sections[sect_ndx]->dept_name > " ")
        A_facility->dept_name = data->req[req_ndx]->sections[sect_ndx]->dept_name
    else
        A_facility->dept_name = " "
    endif
 
;dept desc
    if(data->req[req_ndx]->sections[sect_ndx]->dept_desc > " ")
        A_facility->dept_desc = data->req[req_ndx]->sections[sect_ndx]->dept_desc
    else
        A_facility->dept_desc = " "
    endif
 
;address
    if (data->req[req_ndx]->patient_data->fac_addr > " ")
        A_facility->address = data->req[req_ndx]->patient_data->fac_addr 
    else
        A_facility->address = " "
    endif
 
;city
    if (data->req[req_ndx]->patient_data->fac_city > " ")
        A_facility->city = data->req[req_ndx]->patient_data->fac_city
    else
        A_facility->city = " "
    endif
 
;state
    if (data->req[req_ndx]->patient_data->fac_state > " ")
        A_facility->state = data->req[req_ndx]->patient_data->fac_state
    else
        A_facility->state = " "
    endif
 
;zip
    if (data->req[req_ndx]->patient_data->fac_zip > " ")
        A_facility->zip = data->req[req_ndx]->patient_data->fac_zip
    else
        A_facility->zip = " "
    endif 
 


