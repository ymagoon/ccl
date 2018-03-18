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
 
        Source file name:       rad_packet_other_exams_record.inc
        Object name:            n/a
        Request #:              multiple
 
        Product:                GARPP
        Product Team:           Radnet
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        record structure for other exams
 
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
 

/******************************************************
Record Structure for Other Exams
*******************************************************/

call echo("*****START OF OTHER EXAMS RECORD*****")

 free record A_other_exam_1
record A_Other_Exam_1 (
    1 Other_Name_1 = vc
    1 Other_Accession_1 = c20
    1 Other_facility_1 = vc
)
 free record A_other_exam_2
record A_Other_Exam_2 (
    1 Other_Name_2 = vc
    1 Other_Accession_2 = c20
    1 Other_facility_2 = vc
)
 free record A_other_exam_3
record A_Other_Exam_3 (
    1 Other_Name_3 = vc
    1 Other_Accession_3 = c20
    1 Other_facility_3 = vc
)
 free record A_other_exam_4
record A_Other_Exam_4 (
    1 Other_Name_4 = vc
    1 Other_Accession_4 = c20
    1 Other_facility_4 = vc
)
 free record A_other_exam_5
record A_Other_Exam_5 (
    1 Other_Name_5 = vc
    1 Other_Accession_5 = c20
    1 Other_facility_5 = vc
)
 free record A_other_exam_6
record A_Other_Exam_6 (
    1 Other_Name_6 = vc
    1 Other_Accession_6 = c20
    1 Other_facility_6 = vc
)
 free record A_other_exam_7
record A_Other_Exam_7 (
    1 Other_Name_7 = vc
    1 Other_Accession_7 = c20
    1 Other_facility_7 = vc
)
 free record A_other_exam_8
record A_Other_Exam_8 (
    1 Other_Name_8 = vc
    1 Other_Accession_8 = c20
    1 Other_facility_8 = vc
)
 free record A_other_exam_9
record A_Other_Exam_9 (
    1 Other_Name_9 = vc
    1 Other_Accession_9 = c20
    1 Other_facility_9 = vc
)
 free record A_other_exam_10
record A_Other_Exam_10 (
    1 Other_Name_10 = vc
    1 Other_Accession_10 = c20
    1 Other_facility_10 = vc
)
 


