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
 
        Source file name:       rad_packet_patient_record.inc
        Object name:            n/a
        Request #:              multiple
 
        Product:                GARPP
        Product Team:           Radnet
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        record structure of the patient data information
 
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
 
call echo("*****START OF PATIENT RECORD*****")

free record A_pat_data 

record A_pat_data
( 1 person_id = f8
  1 full_name = vc
  1 last_name = vc
  1 first_name = vc
  1 mid_name = vc
  1 dob = dq8
  1 age = vc
  1 short_age = c10
  1 gender = vc
  1 short_gender = c10
  1 race = vc
  1 encounter_id = f8
  1 location = vc
  1 pat_type = vc
  1 arrival_date = dq8
  1 facility = vc
  1 building = vc
  1 nurse_unit = vc
  1 nurse_unit_phone = vc
  1 room = c10
  1 bed = c10
  1 admitting_diag = vc
  1 isolation = vc
  1 med_service = vc
  1 fin_class = vc
  1 client = vc
  1 ssn = vc
  1 cmrn = vc
  1 med_nbr = vc
  1 bc_med_nbr = vc
  1 fin_nbr = vc
  1 bc_fin_nbr = vc
  1 home_phone = vc
  1 work_phone = vc
  1 address = vc
  1 city = vc
  1 state = vc
  1 zip = c12
)
 


