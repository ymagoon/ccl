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
 
        Source file name:       rad_packet_last_exams_rec.inc
        Object name:            n/a
        Request #:              multiple
 
        Product:                GARPP
        Product Team:           Radnet
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        last exams record structure
 
        Tables read:            many
 
        Tables updated:         ?
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
 

/**********************************************************************
*        Record Structure for Previous Exams:  All, regardless of 
*                       Facility, Activity, Library
*********************************************************************/
call echo("*****START OF LAST EXAMS RECORD*****")
 
free record A_Previous_Exam_all_1 

record A_Previous_Exam_ALL_1 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)

free record A_Previous_Exam_all_2 
 
record A_Previous_Exam_ALL_2 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)
 

free record A_Previous_Exam_all_3 

record A_Previous_Exam_ALL_3 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)

free record A_Previous_Exam_all_4 
 
record A_Previous_Exam_ALL_4 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)
 
 free record A_Previous_Exam_all_5 

record A_Previous_Exam_ALL_5 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)
 
free record A_Previous_Exam_all_6 

record A_Previous_Exam_ALL_6 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)
 
free record A_Previous_Exam_all_7 

record A_Previous_Exam_ALL_7 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)
 

free record A_Previous_Exam_all_8 

record A_Previous_Exam_ALL_8 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)
 
free record A_Previous_Exam_all_9 

record A_Previous_Exam_ALL_9 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)
 
free record A_Previous_Exam_all_10 

record A_Previous_Exam_ALL_10 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)
 
/************************************************/
 
/*******************************************************
Record Structure for Previous Exams:  By Facility, 
   regardless of Activity, Library
******************************************************/
 free record A_Previous_Exam_FAC_1 
record A_Previous_Exam_FAC_1 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)

 free record A_Previous_Exam_FAC_2 
record A_Previous_Exam_FAC_2 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)

free record A_Previous_Exam_FAC_3 
 
record A_Previous_Exam_FAC_3 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)

free record A_Previous_Exam_FAC_4 
 
record A_Previous_Exam_FAC_4 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)
 
 free record A_Previous_Exam_FAC_5 
record A_Previous_Exam_FAC_5 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)
free record A_Previous_Exam_FAC_6 
 
record A_Previous_Exam_FAC_6 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)

free record A_Previous_Exam_FAC_7 
 
record A_Previous_Exam_FAC_7 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)

free record A_Previous_Exam_FAC_8 
 
record A_Previous_Exam_FAC_8 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)

free record A_Previous_Exam_FAC_9 
 
record A_Previous_Exam_FAC_9 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)

free record A_Previous_Exam_FAC_10 
 
record A_Previous_Exam_FAC_10 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)
 
/***********************************************/
 
/**********************************************************
Record Structure for Previous Exams:  
 By Library Gp, regardless of Facility, Activity
***********************************************************/
 free record A_Previous_Exam_LIB_1 
record A_Previous_Exam_LIB_1 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)

free record A_Previous_Exam_LIB_2 
 
record A_Previous_Exam_LIB_2 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)
 

free record A_Previous_Exam_LIB_3 
record A_Previous_Exam_LIB_3 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)

free record A_Previous_Exam_LIB_4 
 
record A_Previous_Exam_LIB_4 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)
 
 free record A_Previous_Exam_LIB_5 
record A_Previous_Exam_LIB_5 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)
 

free record A_Previous_Exam_LIB_6 
record A_Previous_Exam_LIB_6 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)

free record A_Previous_Exam_LIB_7 
 
record A_Previous_Exam_LIB_7 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)

free record A_Previous_Exam_LIB_8 
 
record A_Previous_Exam_LIB_8 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)

free record A_Previous_Exam_LIB_9 
 
record A_Previous_Exam_LIB_9 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)

free record A_Previous_Exam_LIB_10 
 
record A_Previous_Exam_LIB_10 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)
 
/*****************************************************/
/******************************************************
*Record Structure for Previous Exams: 
*  By Activity, regardless of Facility, Library
*******************************************************/
 free record A_Previous_Exam_ACT_1 
record A_Previous_Exam_ACT_1 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)

free record A_Previous_Exam_ACT_2 
 
record A_Previous_Exam_ACT_2 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)

free record A_Previous_Exam_ACT_3 
 
record A_Previous_Exam_ACT_3 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)
 

free record A_Previous_Exam_ACT_4 
record A_Previous_Exam_ACT_4 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)
 
 free record A_Previous_Exam_ACT_5 
record A_Previous_Exam_ACT_5 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)

free record A_Previous_Exam_ACT_6 
 
record A_Previous_Exam_ACT_6 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)

free record A_Previous_Exam_ACT_7 
 
record A_Previous_Exam_ACT_7 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)

free record A_Previous_Exam_ACT_8 
 
record A_Previous_Exam_ACT_8 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)

free record A_Previous_Exam_ACT_9 
 
record A_Previous_Exam_ACT_9 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
)

free record A_Previous_Exam_ACT_10 
 
record A_Previous_Exam_ACT_10 (
    1 Exam_Name = vc
    1 Request_Date_Time = dq8
    1 Complete_Date_Time = dq8
    1 Transcribe_Date_Time = dq8
    1 Final_Date_Time = dq8
    1 Accession = vc
    1 Facility_Display = vc
    1 Facility_Description = vc
    1 Completing_Location_Display = vc
    1 Completing_Location_Description = vc
    1 Image_Class_Type_Display = vc
    1 Image_Class_Type_Description = vc
    1 Exam_Status = vc
) 


