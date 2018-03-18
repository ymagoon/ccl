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
 
        Source file name:       rad_packet_ic9_codes.inc
        Object name:            n/a
        Request #:              multiple
 
        Product:                GARPP
        Product Team:           Radnet
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        record structure for icd9 codes for patient packet
 
        Tables read:            many
 
        Tables updated:         none
        Executing from:         ?
 
        Special Notes:          ?
 
******************************************************************************/
;~DB~************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *Mod Date     Engineer             Feature         Comment                 *
;    *--- -------- -------------------- -----------     ------------------------*
;     ### 08/19/03 Tammy Baack/Sandra Prow                      Initial Release         *
;         001 04/10/06 Sean Turk            78186               Adjusting record structure to be consistent
;                                                                                                       with other record structures in GARPP.  Almost all
;                                                                                                       Lines of code adjusted.
;~DE~************************************************************************
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************

call echo("*****START OF ICD9 CODES RECORD*****")

free record A_ICD9 
   
record A_ICD9
   (1 icd9_1_1          = vc
    1 icd9_1_2          = vc
    1 icd9_1_3          = vc
    1 icd9_1_4          = vc
    1 icd9_1_desc_1     = vc
    1 icd9_1_desc_2     = vc
    1 icd9_1_desc_3     = vc
    1 icd9_1_desc_4     = vc

    1 icd9_2_1          = vc
    1 icd9_2_2          = vc
    1 icd9_2_3          = vc
    1 icd9_2_4          = vc
    1 icd9_2_desc_1     = vc
    1 icd9_2_desc_2     = vc
    1 icd9_2_desc_3     = vc
    1 icd9_2_desc_4     = vc

    1 icd9_3_1          = vc
    1 icd9_3_2          = vc
    1 icd9_3_3         = vc
    1 icd9_3_4          = vc
    1 icd9_3_desc_1     = vc
    1 icd9_3_desc_2     = vc
    1 icd9_3_desc_3     = vc
    1 icd9_3_desc_4     = vc

    1 icd9_4_1          = vc
    1 icd9_4_2          = vc
    1 icd9_4_3          = vc
    1 icd9_4_4          = vc
    1 icd9_4_desc_1     = vc
    1 icd9_4_desc_2     = vc
    1 icd9_4_desc_3     = vc
    1 icd9_4_desc_4     = vc

    1 icd9_5_1          = vc
    1 icd9_5_2          = vc
    1 icd9_5_3          = vc
    1 icd9_5_4          = vc
    1 icd9_5_desc_1     = vc
    1 icd9_5_desc_2     = vc
    1 icd9_5_desc_3     = vc
    1 icd9_5_desc_4     = vc

    1 icd9_6_1          = vc
    1 icd9_6_2          = vc
    1 icd9_6_3          = vc
    1 icd9_6_4          = vc
    1 icd9_6_desc_1     = vc
    1 icd9_6_desc_2     = vc
    1 icd9_6_desc_3     = vc
    1 icd9_6_desc_4     = vc


    1 icd9_7_1          = vc
    1 icd9_7_2          = vc
    1 icd9_7_3          = vc
    1 icd9_7_4          = vc
    1 icd9_7_desc_1     = vc
    1 icd9_7_desc_2     = vc
    1 icd9_7_desc_3    = vc
    1 icd9_7_desc_4     = vc

    1 icd9_8_1          = vc
    1 icd9_8_2          = vc
    1 icd9_8_3          = vc
    1 icd9_8_4          = vc
    1 icd9_8_desc_1     = vc
    1 icd9_8_desc_2     = vc
    1 icd9_8_desc_3     = vc
    1 icd9_8_desc_4     = vc

    1 icd9_9_1          = vc
    1 icd9_9_2          = vc
    1 icd9_9_3          = vc
    1 icd9_9_4          = vc
    1 icd9_9_desc_1     = vc
    1 icd9_9_desc_2     = vc
    1 icd9_9_desc_3     = vc
    1 icd9_9_desc_4     = vc

    1 icd9_10_1          = vc
    1 icd9_10_2          = vc
    1 icd9_10_3          = vc
    1 icd9_10_4          = vc
    1 icd9_10_desc_1     = vc
    1 icd9_10_desc_2     = vc
    1 icd9_10_desc_3     = vc
    1 icd9_10_desc_4     = vc
    )



