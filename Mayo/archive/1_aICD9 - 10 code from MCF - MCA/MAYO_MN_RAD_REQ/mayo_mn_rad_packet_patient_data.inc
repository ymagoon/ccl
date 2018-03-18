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
 
        Source file name:       rad_packet_patient_data.inc
        Object name:            n/a
        Request #:              multiple
 
        Product:                GARPP
        Product Team:           Radnet
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        Data fields for patient data on the patient packet
 
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
call echo("*****START OF PATIENT DATA *****")
 
;person_id
   A_pat_data->person_id = data->req[req_ndx]->patient_data->person_id
 
;full name
   A_pat_data->full_name = data->req[req_ndx]->patient_data->name
 
  call echo (build("Patient Name ------->",A_pat_data->full_name))
  call echo (build("From Get Info------->", data->req[req_ndx]->patient_data->name))
 
;last name
   A_pat_data->last_name = data->req[req_ndx]->patient_data->name_last
 
;first name
   A_pat_data->first_name = data->req[req_ndx]->patient_data->name_first
 
;middle name
   A_pat_data->mid_name = data->req[req_ndx]->patient_data->name_middle
 
;dob
   A_pat_data->dob = data->req[req_ndx]->patient_data->dob
 
;Age
   A_pat_data->age = data->req[req_ndx]->patient_data->age
 
;short age
   A_pat_data->short_age = data->req[req_ndx]->patient_data->short_age
 
;gender
    A_pat_data->gender = data->req[req_ndx]->patient_data->gender
 
;short gender
    A_pat_data->short_gender = data->req[req_ndx]->patient_data->short_gender
 
;race
    A_pat_data->race = data->req[req_ndx]->patient_data->race
 
;encounter
    A_pat_data->encounter_id = data->req[req_ndx]->patient_data->encntr_id
 
;location
    A_pat_data->location = data->req[req_ndx]->patient_data->location
 
;pat type
    A_pat_data->pat_type = data->req[req_ndx]->patient_data->encntr_type_disp
 
;arrival date
    A_pat_data->arrival_date = data->req[req_ndx]->patient_data->date_of_arrival
 
;facility
    A_pat_data->facility = data->req[req_ndx]->patient_data->facility
 
;building
    A_pat_data->building = data->req[req_ndx]->patient_data->building
 
;nurse unit
    A_pat_data->nurse_unit = data->req[req_ndx]->patient_data->nurse_unit
 
;nurse unit phone
    A_pat_data->nurse_unit_phone = data->req[req_ndx]->patient_data->nurse_unit_phone
 
;room
    A_pat_data->room = data->req[req_ndx]->patient_data->room
 
;bed
    A_pat_data->bed = data->req[req_ndx]->patient_data->bed
 
;admitting diag
    A_pat_data->admitting_diag = data->req[req_ndx]->patient_data->reason_for_visit
 
;isolation from encounter
    A_pat_data->isolation = data->req[req_ndx]->patient_data->isolation
 
;med service
    A_pat_data->med_service = data->req[req_ndx]->patient_data->med_service
 
;fin class
    A_pat_data->fin_class = data->req[req_ndx]->patient_data->financial_class
 
;client
    A_pat_data->client = data->req[req_ndx]->patient_data->client
 
;ssn
    A_pat_data->ssn = data->req[req_ndx]->patient_data->person_ssn
 
;cmrn
    A_pat_data->cmrn = data->req[req_ndx]->patient_data->community_med_nbr
 
;med nbr
    ;A_pat_data->med_nbr = data->req[req_ndx]->patient_data->person_alias
 
    ;this will show all 9 digits of the MRN
    A_pat_data->med_nbr = format(trim(data->req[req_ndx]->patient_data->person_alias),"#########;P0")
 
;bc med nbr
    if (size(trim(data->req[req_ndx]->patient_data->person_alias)) > 0)
       A_pat_data->bc_med_nbr = concat("*"
                         ,trim(data->req[req_ndx]->patient_data->person_alias)
                         ,"*")
    else
        A_pat_data->bc_med_nbr = " "
    endif
 
;fin nbr
    A_pat_data->fin_nbr = data->req[req_ndx]->patient_data->fin_nbr_alias
 
;bc fin nbr
   if (size(data->req[req_ndx]->patient_data->fin_nbr_alias) > 0)
        A_pat_data->bc_fin_nbr = concat("*"
                         ,A_pat_data->fin_nbr
                         ,"*")
    else
        A_pat_data->bc_fin_nbr = " "
    endif
 
;patient home phone
    A_pat_data->home_phone = data->req[req_ndx]->patient_data->phone
 
;patient work phone
    A_pat_data->work_phone = data->req[req_ndx]->patient_data->work_phone
 
;address
    A_pat_data->address = data->req[req_ndx]->patient_data->address[1]->street_addr
 
;city
    A_pat_data->city = data->req[req_ndx]->patient_data->address[1]->city
 
;state
    A_pat_data->state = data->req[req_ndx]->patient_data->address[1]->state
 
;zip
    A_pat_data->zip = data->req[req_ndx]->patient_data->address[1]->zipcode


