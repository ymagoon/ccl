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
 
        Source file name:       rad_packet_physician_record.inc
        Object name:            n/a
        Request #:              multiple
 
        Product:                GARPP
        Product Team:           Radnet
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        record structure for displaying the physician data
                                on the patient packet
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
 
call echo("*****START OF PHYSICIAN RECORD*****")

free record A_doc 
record A_doc
   (1 admit_doc_name      = vc
    1 admit_doc_phone     = vc
    1 admit_doc_pager     = vc
    1 admit_doc_fax       = vc
    1 refer_doc_name      = vc
    1 refer_doc_phone     = vc
    1 refer_doc_pager     = vc
    1 refer_doc_fax       = vc
    1 order_doc_name      = vc
    1 order_doc_phone     = vc
    1 order_doc_pager     = vc
    1 order_doc_fax       = vc
    1 attend_doc_name     = vc
    1 attend_doc_phone    = vc
    1 attend_doc_pager    = vc
    1 attend_doc_fax      = vc
    1 family_doc_name     = vc
    1 family_doc_phone    = vc
    1 family_doc_pager    = vc
    1 family_doc_fax      = vc
    1 consult_doc_name_1  = vc
    1 consult_doc_phone_1 = vc
    1 consult_doc_pager_1 = vc
    1 consult_doc_fax_1   = vc
    1 consult_doc_name_2  = vc
    1 consult_doc_phone_2 = vc
    1 consult_doc_pager_2 = vc
    1 consult_doc_fax_2  = vc
    1 consult_doc_name_3  = vc
    1 consult_doc_phone_3 = vc
    1 consult_doc_pager_3 = vc
    1 consult_doc_fax_3   = vc
    1 consult_doc_name_4  = vc
    1 consult_doc_phone_4 = vc
    1 consult_doc_pager_4 = vc
    1 consult_doc_fax_4   = vc
    1 consult_doc_name_5  = vc
    1 consult_doc_phone_5 = vc
    1 consult_doc_pager_5 = vc
    1 consult_doc_fax_5   = vc
    1 consult_doc_name_6  = vc
    1 consult_doc_phone_6 = vc
    1 consult_doc_pager_6 = vc
    1 consult_doc_fax_6  = vc
)
 


