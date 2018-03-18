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
 
        Source file name:       rad_packet_last_exams_data.inc
        Object name:            n/a
        Request #:              multiple
 
        Product:                GARPP
        Product Team:           Radnet
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        last exams data fields for printing previous exam data
 
        Tables read:            many
 
        Tables updated:         none
        Executing from:         ?
 
        Special Notes:          ?
 
******************************************************************************/
;****************************************************************************
;*                      GENERATED MODIFICATION CONTROL LOG                  *
;****************************************************************************
;*Mod Date     Feature  Engineer     Comment                                *
;*--- -------- ------- ------------- -------------------------------------- *
;*### 08/19/03          Tammy Baack/ Initial Release                        *
;*                      Sandra Prow                                         *
;*001 01/30/06  78417   jb010592    Removed prev structure references within*
;*                                   all, lib, fac, and act.                *
;*002 09/22/06  109567  jb010592    Refactored name of "all" record         *
;*                                   structure                              *
;****************************************************************************

call echo ("*****START OF LAST EXAMS DATA*****")

;BEGIN 002
if (size(all_facs->last_exam,5) > 0)
 A_Previous_Exam_ALL_1->Exam_Name =
               all_facs->last_exam[1]->Exam_Name
 A_Previous_Exam_ALL_1->Request_Date_Time =
               all_facs->last_exam[1]->Request_Date_Time
 A_Previous_Exam_ALL_1->Complete_Date_Time =
               all_facs->last_exam[1]->Complete_Date_Time
 A_Previous_Exam_ALL_1->Transcribe_Date_Time =
               all_facs->last_exam[1]->Transcribe_Date_Time
 A_Previous_Exam_ALL_1->Final_Date_Time =
               all_facs->last_exam[1]->Final_Date_Time
 A_Previous_Exam_ALL_1->Accession =
               FormatAccession(all_facs->last_exam[1]->Accession)
 A_Previous_Exam_ALL_1->Facility_Display =
               all_facs->last_exam[1]->Facility_Display
 A_Previous_Exam_ALL_1->Facility_Description =
               all_facs->last_exam[1]->Facility_Description
 A_Previous_Exam_ALL_1->Completing_Location_Display =
               all_facs->last_exam[1]->Completing_Location_Display
 A_Previous_Exam_ALL_1->Completing_Location_Description =
               all_facs->last_exam[1]->Completing_Location_Description
 A_Previous_Exam_ALL_1->Image_Class_Type_Display =
               all_facs->last_exam[1]->Image_Class_Type_Display
 A_Previous_Exam_ALL_1->Image_Class_Type_Description =
               all_facs->last_exam[1]->Image_Class_Type_Description
 A_Previous_Exam_ALL_1->Exam_Status =
              all_facs->last_exam[1]->Exam_Status


 if (validate(working_array->debug_flag) = 1)
        if (cnvtupper(working_array->debug_flag) = 'Y')
                call echo (build("Previous1 ALL -->",
            A_Previous_Exam_ALL_1->Complete_Date_Time ))
                call echo (build("Previous1 ALL -->",
                        A_Previous_Exam_ALL_1->Exam_Name ))
                call echo (build("Previous1 ALL -->",
                        A_Previous_Exam_ALL_1->Image_Class_Type_Display ))
                call echo (build("Previous1 ALL -->",
                A_Previous_Exam_ALL_1->Image_Class_Type_Description ))
                call echo (build("Previous1 ALL -->",
                A_Previous_Exam_ALL_1->Completing_Location_Display ))
 call echo (build("Previous1 ALL -->",
              A_Previous_Exam_ALL_1->Completing_Location_Description ))
 call echo (build("Previous1 ALL -->",
              A_Previous_Exam_ALL_1->Facility_Display ))
 call echo (build("Previous1 ALL -->",
              A_Previous_Exam_ALL_1->Facility_Description ))
 call echo (build("Previous1 ALL -->",
              A_Previous_Exam_ALL_1->Accession ))
 call echo (build("Previous1 ALL -->",
              A_Previous_Exam_ALL_1->Transcribe_Date_Time ))
 call echo (build("Previous1 ALL -->",
                A_Previous_Exam_ALL_1->Final_Date_Time ))
                call echo (build("Previous1 ALL -->",
                A_Previous_Exam_ALL_1->Request_Date_Time ))
                call echo (build("Previous1 ALL -->",
                A_Previous_Exam_ALL_1->Exam_Status ))
        endif
 endif
endif

if (size(all_facs->last_exam,5) > 1)
 A_Previous_Exam_ALL_2->Complete_Date_Time =
           all_facs->last_exam[2]->Complete_Date_Time
 A_Previous_Exam_ALL_2->Exam_Name =
           all_facs->last_exam[2]->Exam_Name
 A_Previous_Exam_ALL_2->Image_Class_Type_Display =
           all_facs->last_exam[2]->Image_Class_Type_Display
 A_Previous_Exam_ALL_2->Image_Class_Type_Description =
           all_facs->last_exam[2]->Image_Class_Type_Description
 A_Previous_Exam_ALL_2->Completing_Location_Display =
           all_facs->last_exam[2]->Completing_Location_Display
 A_Previous_Exam_ALL_2->Completing_Location_Description =
           all_facs->last_exam[2]->Completing_Location_Description
 A_Previous_Exam_ALL_2->Facility_Display =
           all_facs->last_exam[2]->Facility_Display
 A_Previous_Exam_ALL_2->Facility_Description =
           all_facs->last_exam[2]->Facility_Description
 A_Previous_Exam_ALL_2->Accession =
           FormatAccession(all_facs->last_exam[2]->Accession)
 A_Previous_Exam_ALL_2->Transcribe_Date_Time =
           all_facs->last_exam[2]->Transcribe_Date_Time
 A_Previous_Exam_ALL_2->Final_Date_Time =
           all_facs->last_exam[2]->Final_Date_Time
 A_Previous_Exam_ALL_2->Request_Date_Time =
           all_facs->last_exam[2]->Request_Date_Time
 A_Previous_Exam_ALL_2->Exam_Status =
           all_facs->last_exam[2]->Exam_Status
endif
 
if (size(all_facs->last_exam,5) > 2)
 A_Previous_Exam_ALL_3->Complete_Date_Time =
              all_facs->last_exam[3]->Complete_Date_Time
 A_Previous_Exam_ALL_3->Exam_Name =
              all_facs->last_exam[3]->Exam_Name
 A_Previous_Exam_ALL_3->Image_Class_Type_Display =
              all_facs->last_exam[3]->Image_Class_Type_Display
 A_Previous_Exam_ALL_3->Image_Class_Type_Description =
              all_facs->last_exam[3]->Image_Class_Type_Description
 A_Previous_Exam_ALL_3->Completing_Location_Display =
              all_facs->last_exam[3]->Completing_Location_Display
 A_Previous_Exam_ALL_3->Completing_Location_Description =
              all_facs->last_exam[3]->Completing_Location_Description
 A_Previous_Exam_ALL_3->Facility_Display =
              all_facs->last_exam[3]->Facility_Display
 A_Previous_Exam_ALL_3->Facility_Description =
              all_facs->last_exam[3]->Facility_Description
 A_Previous_Exam_ALL_3->Accession =
              FormatAccession(all_facs->last_exam[3]->Accession)
 A_Previous_Exam_ALL_3->Transcribe_Date_Time =
              all_facs->last_exam[3]->Transcribe_Date_Time
 A_Previous_Exam_ALL_3->Final_Date_Time =
              all_facs->last_exam[3]->Final_Date_Time
 A_Previous_Exam_ALL_3->Request_Date_Time =
              all_facs->last_exam[3]->Request_Date_Time
 A_Previous_Exam_ALL_3->Exam_Status =
              all_facs->last_exam[3]->Exam_Status
endif
 
if (size(all_facs->last_exam,5) > 3)
 A_Previous_Exam_ALL_4->Complete_Date_Time =
            all_facs->last_exam[4]->Complete_Date_Time
 A_Previous_Exam_ALL_4->Exam_Name =
            all_facs->last_exam[4]->Exam_Name
 A_Previous_Exam_ALL_4->Image_Class_Type_Display =
            all_facs->last_exam[4]->Image_Class_Type_Display
 A_Previous_Exam_ALL_4->Image_Class_Type_Description =
            all_facs->last_exam[4]->Image_Class_Type_Description
 A_Previous_Exam_ALL_4->Completing_Location_Display =
            all_facs->last_exam[4]->Completing_Location_Display
 A_Previous_Exam_ALL_4->Completing_Location_Description =
            all_facs->last_exam[4]->Completing_Location_Description
 A_Previous_Exam_ALL_4->Facility_Display =
            all_facs->last_exam[4]->Facility_Display
 A_Previous_Exam_ALL_4->Facility_Description =
            all_facs->last_exam[4]->Facility_Description
 A_Previous_Exam_ALL_4->Accession =
            FormatAccession(all_facs->last_exam[4]->Accession)
 A_Previous_Exam_ALL_4->Transcribe_Date_Time =
            all_facs->last_exam[4]->Transcribe_Date_Time
 A_Previous_Exam_ALL_4->Final_Date_Time =
            all_facs->last_exam[4]->Final_Date_Time
 A_Previous_Exam_ALL_4->Request_Date_Time =
            all_facs->last_exam[4]->Request_Date_Time
 A_Previous_Exam_ALL_4->Exam_Status =
            all_facs->last_exam[4]->Exam_Status
endif
 
if (size(all_facs->last_exam,5) > 4)
 A_Previous_Exam_ALL_5->Complete_Date_Time =
            all_facs->last_exam[5]->Complete_Date_Time
 A_Previous_Exam_ALL_5->Exam_Name =
            all_facs->last_exam[5]->Exam_Name
 A_Previous_Exam_ALL_5->Image_Class_Type_Display =
            all_facs->last_exam[5]->Image_Class_Type_Display
 A_Previous_Exam_ALL_5->Image_Class_Type_Description =
            all_facs->last_exam[5]->Image_Class_Type_Description
 A_Previous_Exam_ALL_5->Completing_Location_Display =
            all_facs->last_exam[5]->Completing_Location_Display
 A_Previous_Exam_ALL_5->Completing_Location_Description =
            all_facs->last_exam[5]->Completing_Location_Description
 A_Previous_Exam_ALL_5->Facility_Display =
            all_facs->last_exam[5]->Facility_Display
 A_Previous_Exam_ALL_5->Facility_Description =
            all_facs->last_exam[5]->Facility_Description
 A_Previous_Exam_ALL_5->Accession =
            FormatAccession(all_facs->last_exam[5]->Accession)
 A_Previous_Exam_ALL_5->Transcribe_Date_Time =
            all_facs->last_exam[5]->Transcribe_Date_Time
 A_Previous_Exam_ALL_5->Final_Date_Time =
            all_facs->last_exam[5]->Final_Date_Time
 A_Previous_Exam_ALL_5->Request_Date_Time =
            all_facs->last_exam[5]->Request_Date_Time
 A_Previous_Exam_ALL_5->Exam_Status =
            all_facs->last_exam[5]->Exam_Status
endif
 
if (size(all_facs->last_exam,5) > 5)
 A_Previous_Exam_ALL_6->Complete_Date_Time =
            all_facs->last_exam[6]->Complete_Date_Time
 A_Previous_Exam_ALL_6->Exam_Name =
            all_facs->last_exam[6]->Exam_Name
 A_Previous_Exam_ALL_6->Image_Class_Type_Display =
            all_facs->last_exam[6]->Image_Class_Type_Display
 A_Previous_Exam_ALL_6->Image_Class_Type_Description =
            all_facs->last_exam[6]->Image_Class_Type_Description
 A_Previous_Exam_ALL_6->Completing_Location_Display =
            all_facs->last_exam[6]->Completing_Location_Display
 A_Previous_Exam_ALL_6->Completing_Location_Description =
            all_facs->last_exam[6]->Completing_Location_Description
 A_Previous_Exam_ALL_6->Facility_Display =
            all_facs->last_exam[6]->Facility_Display
 A_Previous_Exam_ALL_6->Facility_Description =
            all_facs->last_exam[6]->Facility_Description
 A_Previous_Exam_ALL_6->Accession =
            FormatAccession(all_facs->last_exam[6]->Accession)
 A_Previous_Exam_ALL_6->Transcribe_Date_Time =
            all_facs->last_exam[6]->Transcribe_Date_Time
 A_Previous_Exam_ALL_6->Final_Date_Time =
            all_facs->last_exam[6]->Final_Date_Time
 A_Previous_Exam_ALL_6->Request_Date_Time =
            all_facs->last_exam[6]->Request_Date_Time
 A_Previous_Exam_ALL_6->Exam_Status =
            all_facs->last_exam[6]->Exam_Status
endif
 
if (size(all_facs->last_exam,5) > 6)
 A_Previous_Exam_ALL_7->Complete_Date_Time =
            all_facs->last_exam[7]->Complete_Date_Time
 A_Previous_Exam_ALL_7->Exam_Name =
            all_facs->last_exam[7]->Exam_Name
 A_Previous_Exam_ALL_7->Image_Class_Type_Display =
            all_facs->last_exam[7]->Image_Class_Type_Display
 A_Previous_Exam_ALL_7->Image_Class_Type_Description =
            all_facs->last_exam[7]->Image_Class_Type_Description
 A_Previous_Exam_ALL_7->Completing_Location_Display =
            all_facs->last_exam[7]->Completing_Location_Display
 A_Previous_Exam_ALL_7->Completing_Location_Description =
            all_facs->last_exam[7]->Completing_Location_Description
 A_Previous_Exam_ALL_7->Facility_Display =
            all_facs->last_exam[7]->Facility_Display
 A_Previous_Exam_ALL_7->Facility_Description =
            all_facs->last_exam[7]->Facility_Description
 A_Previous_Exam_ALL_7->Accession =
            FormatAccession(all_facs->last_exam[7]->Accession)
 A_Previous_Exam_ALL_7->Transcribe_Date_Time =
            all_facs->last_exam[7]->Transcribe_Date_Time
 A_Previous_Exam_ALL_7->Final_Date_Time =
            all_facs->last_exam[7]->Final_Date_Time
 A_Previous_Exam_ALL_7->Request_Date_Time =
            all_facs->last_exam[7]->Request_Date_Time
 A_Previous_Exam_ALL_7->Exam_Status =
            all_facs->last_exam[7]->Exam_Status
endif
 
if (size(all_facs->last_exam,5) > 7)
 A_Previous_Exam_ALL_8->Complete_Date_Time =
            all_facs->last_exam[8]->Complete_Date_Time
 A_Previous_Exam_ALL_8->Exam_Name =
            all_facs->last_exam[8]->Exam_Name
 A_Previous_Exam_ALL_8->Image_Class_Type_Display =
            all_facs->last_exam[8]->Image_Class_Type_Display
 A_Previous_Exam_ALL_8->Image_Class_Type_Description =
            all_facs->last_exam[8]->Image_Class_Type_Description
 A_Previous_Exam_ALL_8->Completing_Location_Display =
            all_facs->last_exam[8]->Completing_Location_Display
 A_Previous_Exam_ALL_8->Completing_Location_Description =
            all_facs->last_exam[8]->Completing_Location_Description
 A_Previous_Exam_ALL_8->Facility_Display =
            all_facs->last_exam[8]->Facility_Display
 A_Previous_Exam_ALL_8->Facility_Description =
            all_facs->last_exam[8]->Facility_Description
 A_Previous_Exam_ALL_8->Accession =
            FormatAccession(all_facs->last_exam[8]->Accession)
 A_Previous_Exam_ALL_8->Transcribe_Date_Time =
            all_facs->last_exam[8]->Transcribe_Date_Time
 A_Previous_Exam_ALL_8->Final_Date_Time =
            all_facs->last_exam[8]->Final_Date_Time
 A_Previous_Exam_ALL_8->Request_Date_Time =
            all_facs->last_exam[8]->Request_Date_Time
 A_Previous_Exam_ALL_8->Exam_Status =
            all_facs->last_exam[8]->Exam_Status
endif
 
if (size(all_facs->last_exam,5) > 8)
 A_Previous_Exam_ALL_9->Complete_Date_Time =
            all_facs->last_exam[9]->Complete_Date_Time
 A_Previous_Exam_ALL_9->Exam_Name =
            all_facs->last_exam[9]->Exam_Name
 A_Previous_Exam_ALL_9->Image_Class_Type_Display =
            all_facs->last_exam[9]->Image_Class_Type_Display
 A_Previous_Exam_ALL_9->Image_Class_Type_Description =
            all_facs->last_exam[9]->Image_Class_Type_Description
 A_Previous_Exam_ALL_9->Completing_Location_Display =
            all_facs->last_exam[9]->Completing_Location_Display
 A_Previous_Exam_ALL_9->Completing_Location_Description =
            all_facs->last_exam[9]->Completing_Location_Description
 A_Previous_Exam_ALL_9->Facility_Display =
            all_facs->last_exam[9]->Facility_Display
 A_Previous_Exam_ALL_9->Facility_Description =
            all_facs->last_exam[9]->Facility_Description
 A_Previous_Exam_ALL_9->Accession =
            FormatAccession(all_facs->last_exam[9]->Accession)
 A_Previous_Exam_ALL_9->Transcribe_Date_Time =
            all_facs->last_exam[9]->Transcribe_Date_Time
 A_Previous_Exam_ALL_9->Final_Date_Time =
            all_facs->last_exam[9]->Final_Date_Time
 A_Previous_Exam_ALL_9->Request_Date_Time =
            all_facs->last_exam[9]->Request_Date_Time
 A_Previous_Exam_ALL_9->Exam_Status =
            all_facs->last_exam[9]->Exam_Status
endif
 
if (size(all_facs->last_exam,5) > 9)
 A_Previous_Exam_ALL_10->Complete_Date_Time =
            all_facs->last_exam[10]->Complete_Date_Time
 A_Previous_Exam_ALL_10->Exam_Name =
            all_facs->last_exam[10]->Exam_Name
 A_Previous_Exam_ALL_10->Image_Class_Type_Display =
            all_facs->last_exam[10]->Image_Class_Type_Display
 A_Previous_Exam_ALL_10->Image_Class_Type_Description =
            all_facs->last_exam[10]->Image_Class_Type_Description
 A_Previous_Exam_ALL_10->Completing_Location_Display =
            all_facs->last_exam[10]->Completing_Location_Display
 A_Previous_Exam_ALL_10->Completing_Location_Description =
            all_facs->last_exam[10]->Completing_Location_Description
 A_Previous_Exam_ALL_10->Facility_Display =
            all_facs->last_exam[10]->Facility_Display
 A_Previous_Exam_ALL_10->Facility_Description =
            all_facs->last_exam[10]->Facility_Description
 A_Previous_Exam_ALL_10->Accession =
            FormatAccession(all_facs->last_exam[10]->Accession)
 A_Previous_Exam_ALL_10->Transcribe_Date_Time =
            all_facs->last_exam[10]->Transcribe_Date_Time
 A_Previous_Exam_ALL_10->Final_Date_Time =
            all_facs->last_exam[10]->Final_Date_Time
 A_Previous_Exam_ALL_10->Request_Date_Time =
            all_facs->last_exam[10]->Request_Date_Time
 A_Previous_Exam_ALL_10->Exam_Status =
            all_facs->last_exam[10]->Exam_Status
endif
;END 002

 
/****************************************************************/
if (size(fac->last_exam,5) > 0)
 A_Previous_Exam_FAC_1->Complete_Date_Time =
            fac->last_exam[1]->Complete_Date_Time
 A_Previous_Exam_FAC_1->Exam_Name =
            fac->last_exam[1]->Exam_Name
 A_Previous_Exam_FAC_1->Image_Class_Type_Display =
            fac->last_exam[1]->Image_Class_Type_Display
 A_Previous_Exam_FAC_1->Image_Class_Type_Description =
            fac->last_exam[1]->Image_Class_Type_Description
 A_Previous_Exam_FAC_1->Completing_Location_Display =
            fac->last_exam[1]->Completing_Location_Display
 A_Previous_Exam_FAC_1->Completing_Location_Description =
            fac->last_exam[1]->Completing_Location_Description
 A_Previous_Exam_FAC_1->Facility_Display =
            fac->last_exam[1]->Facility_Display
 A_Previous_Exam_FAC_1->Facility_Description =
            fac->last_exam[1]->Facility_Description
 A_Previous_Exam_FAC_1->Accession =
            FormatAccession(fac->last_exam[1]->Accession)
 A_Previous_Exam_FAC_1->Transcribe_Date_Time =
            fac->last_exam[1]->Transcribe_Date_Time
 A_Previous_Exam_FAC_1->Final_Date_Time =
            fac->last_exam[1]->Final_Date_Time
 A_Previous_Exam_FAC_1->Request_Date_Time =
            fac->last_exam[1]->Request_Date_Time
 A_Previous_Exam_FAC_1->Exam_Status =
            fac->last_exam[1]->Exam_Status

 if (validate(working_array->debug_flag) = 1)
        if (cnvtupper(working_array->debug_flag) = 'Y')
                call echo (build("Previous1 FAC ---->",
                A_Previous_Exam_FAC_1->Complete_Date_Time ))
                call echo (build("Previous1 FAC ---->",
            A_Previous_Exam_FAC_1->Exam_Name ))
                call echo (build("Previous1 FAC ---->",
            A_Previous_Exam_FAC_1->Image_Class_Type_Display ))
 call echo (build("Previous1 FAC ---->",
            A_Previous_Exam_FAC_1->Image_Class_Type_Description ))
 call echo (build("Previous1 FAC ---->",
            A_Previous_Exam_FAC_1->Completing_Location_Display ))
 call echo (build("Previous1 FAC ---->",
            A_Previous_Exam_FAC_1->Completing_Location_Description ))
 call echo (build("Previous1 FAC ---->",
            A_Previous_Exam_FAC_1->Facility_Display ))
 call echo (build("Previous1 FAC ---->",
            A_Previous_Exam_FAC_1->Facility_Description ))
 call echo (build("Previous1 FAC ---->",
            A_Previous_Exam_FAC_1->Accession ))
 call echo (build("Previous1 FAC ---->",
            A_Previous_Exam_FAC_1->Transcribe_Date_Time ))
 call echo (build("Previous1 FAC ---->",
            A_Previous_Exam_FAC_1->Final_Date_Time ))
                call echo (build("Previous1 FAC ---->",
            A_Previous_Exam_FAC_1->Request_Date_Time ))
                call echo (build("Previous1 FAC ---->",
            A_Previous_Exam_FAC_1->Exam_Status ))
        endif
 endif
endif

if (size(fac->last_exam,5) > 1)
 A_Previous_Exam_FAC_2->Complete_Date_Time =
            fac->last_exam[2]->Complete_Date_Time
 A_Previous_Exam_FAC_2->Exam_Name =
            fac->last_exam[2]->Exam_Name
 A_Previous_Exam_FAC_2->Image_Class_Type_Display =
            fac->last_exam[2]->Image_Class_Type_Display
 A_Previous_Exam_FAC_2->Image_Class_Type_Description =
            fac->last_exam[2]->Image_Class_Type_Description
 A_Previous_Exam_FAC_2->Completing_Location_Display =
            fac->last_exam[2]->Completing_Location_Display
 A_Previous_Exam_FAC_2->Completing_Location_Description =
            fac->last_exam[2]->Completing_Location_Description
 A_Previous_Exam_FAC_2->Facility_Display =
            fac->last_exam[2]->Facility_Display
 A_Previous_Exam_FAC_2->Facility_Description =
            fac->last_exam[2]->Facility_Description
 A_Previous_Exam_FAC_2->Accession =
            FormatAccession(fac->last_exam[2]->Accession)
 A_Previous_Exam_FAC_2->Transcribe_Date_Time =
            fac->last_exam[2]->Transcribe_Date_Time
 A_Previous_Exam_FAC_2->Final_Date_Time =
            fac->last_exam[2]->Final_Date_Time
 A_Previous_Exam_FAC_2->Request_Date_Time =
            fac->last_exam[2]->Request_Date_Time
 A_Previous_Exam_FAC_2->Exam_Status =
            fac->last_exam[2]->Exam_Status
endif
 
if (size(fac->last_exam,5) > 2)
 A_Previous_Exam_FAC_3->Complete_Date_Time =
            fac->last_exam[3]->Complete_Date_Time
 A_Previous_Exam_FAC_3->Exam_Name =
            fac->last_exam[3]->Exam_Name
 A_Previous_Exam_FAC_3->Image_Class_Type_Display =
            fac->last_exam[3]->Image_Class_Type_Display
 A_Previous_Exam_FAC_3->Image_Class_Type_Description =
            fac->last_exam[3]->Image_Class_Type_Description
 A_Previous_Exam_FAC_3->Completing_Location_Display =
            fac->last_exam[3]->Completing_Location_Display
 A_Previous_Exam_FAC_3->Completing_Location_Description =
            fac->last_exam[3]->Completing_Location_Description
 A_Previous_Exam_FAC_3->Facility_Display =
            fac->last_exam[3]->Facility_Display
 A_Previous_Exam_FAC_3->Facility_Description =
            fac->last_exam[3]->Facility_Description
 A_Previous_Exam_FAC_3->Accession =
            FormatAccession(fac->last_exam[3]->Accession)
 A_Previous_Exam_FAC_3->Transcribe_Date_Time =
            fac->last_exam[3]->Transcribe_Date_Time
 A_Previous_Exam_FAC_3->Final_Date_Time =
            fac->last_exam[3]->Final_Date_Time
 A_Previous_Exam_FAC_3->Request_Date_Time =
            fac->last_exam[3]->Request_Date_Time
 A_Previous_Exam_FAC_3->Exam_Status =
            fac->last_exam[3]->Exam_Status
endif
 
if (size(fac->last_exam,5) > 3)
 A_Previous_Exam_FAC_4->Complete_Date_Time =
            fac->last_exam[4]->Complete_Date_Time
 A_Previous_Exam_FAC_4->Exam_Name =
            fac->last_exam[4]->Exam_Name
 A_Previous_Exam_FAC_4->Image_Class_Type_Display =
            fac->last_exam[4]->Image_Class_Type_Display
 A_Previous_Exam_FAC_4->Image_Class_Type_Description =
            fac->last_exam[4]->Image_Class_Type_Description
 A_Previous_Exam_FAC_4->Completing_Location_Display =
            fac->last_exam[4]->Completing_Location_Display
 A_Previous_Exam_FAC_4->Completing_Location_Description =
            fac->last_exam[4]->Completing_Location_Description
 A_Previous_Exam_FAC_4->Facility_Display =
            fac->last_exam[4]->Facility_Display
 A_Previous_Exam_FAC_4->Facility_Description =
            fac->last_exam[4]->Facility_Description
 A_Previous_Exam_FAC_4->Accession =
            FormatAccession(fac->last_exam[4]->Accession)
 A_Previous_Exam_FAC_4->Transcribe_Date_Time =
            fac->last_exam[4]->Transcribe_Date_Time
 A_Previous_Exam_FAC_4->Final_Date_Time =
            fac->last_exam[4]->Final_Date_Time
 A_Previous_Exam_FAC_4->Request_Date_Time =
            fac->last_exam[4]->Request_Date_Time
 A_Previous_Exam_FAC_4->Exam_Status =
            fac->last_exam[4]->Exam_Status
endif
 
if (size(fac->last_exam,5) > 4)
 A_Previous_Exam_FAC_5->Complete_Date_Time =
            fac->last_exam[5]->Complete_Date_Time
 A_Previous_Exam_FAC_5->Exam_Name =
            fac->last_exam[5]->Exam_Name
 A_Previous_Exam_FAC_5->Image_Class_Type_Display =
            fac->last_exam[5]->Image_Class_Type_Display
 A_Previous_Exam_FAC_5->Image_Class_Type_Description =
            fac->last_exam[5]->Image_Class_Type_Description
 A_Previous_Exam_FAC_5->Completing_Location_Display =
            fac->last_exam[5]->Completing_Location_Display
 A_Previous_Exam_FAC_5->Completing_Location_Description =
            fac->last_exam[5]->Completing_Location_Description
 A_Previous_Exam_FAC_5->Facility_Display =
            fac->last_exam[5]->Facility_Display
 A_Previous_Exam_FAC_5->Facility_Description =
            fac->last_exam[5]->Facility_Description
 A_Previous_Exam_FAC_5->Accession =
            FormatAccession(fac->last_exam[5]->Accession)
 A_Previous_Exam_FAC_5->Transcribe_Date_Time =
            fac->last_exam[5]->Transcribe_Date_Time
 A_Previous_Exam_FAC_5->Final_Date_Time =
            fac->last_exam[5]->Final_Date_Time
 A_Previous_Exam_FAC_5->Request_Date_Time =
            fac->last_exam[5]->Request_Date_Time
 A_Previous_Exam_FAC_5->Exam_Status =
            fac->last_exam[5]->Exam_Status
endif
 
if (size(fac->last_exam,5) > 5)
 A_Previous_Exam_FAC_6->Complete_Date_Time =
            fac->last_exam[6]->Complete_Date_Time
 A_Previous_Exam_FAC_6->Exam_Name =
            fac->last_exam[6]->Exam_Name
 A_Previous_Exam_FAC_6->Image_Class_Type_Display =
            fac->last_exam[6]->Image_Class_Type_Display
 A_Previous_Exam_FAC_6->Image_Class_Type_Description =
            fac->last_exam[6]->Image_Class_Type_Description
 A_Previous_Exam_FAC_6->Completing_Location_Display =
            fac->last_exam[6]->Completing_Location_Display
 A_Previous_Exam_FAC_6->Completing_Location_Description =
            fac->last_exam[6]->Completing_Location_Description
 A_Previous_Exam_FAC_6->Facility_Display =
            fac->last_exam[6]->Facility_Display
 A_Previous_Exam_FAC_6->Facility_Description =
            fac->last_exam[6]->Facility_Description
 A_Previous_Exam_FAC_6->Accession =
            FormatAccession(fac->last_exam[6]->Accession)
 A_Previous_Exam_FAC_6->Transcribe_Date_Time =
            fac->last_exam[6]->Transcribe_Date_Time
 A_Previous_Exam_FAC_6->Final_Date_Time =
            fac->last_exam[6]->Final_Date_Time
 A_Previous_Exam_FAC_6->Request_Date_Time =
            fac->last_exam[6]->Request_Date_Time
 A_Previous_Exam_FAC_6->Exam_Status =
            fac->last_exam[6]->Exam_Status
endif
 
if (size(fac->last_exam,5) > 6)
 A_Previous_Exam_FAC_7->Complete_Date_Time =
            fac->last_exam[7]->Complete_Date_Time
 A_Previous_Exam_FAC_7->Exam_Name =
            fac->last_exam[7]->Exam_Name
 A_Previous_Exam_FAC_7->Image_Class_Type_Display =
            fac->last_exam[7]->Image_Class_Type_Display
 A_Previous_Exam_FAC_7->Image_Class_Type_Description =
            fac->last_exam[7]->Image_Class_Type_Description
 A_Previous_Exam_FAC_7->Completing_Location_Display =
            fac->last_exam[7]->Completing_Location_Display
 A_Previous_Exam_FAC_7->Completing_Location_Description =
            fac->last_exam[7]->Completing_Location_Description
 A_Previous_Exam_FAC_7->Facility_Display =
            fac->last_exam[7]->Facility_Display
 A_Previous_Exam_FAC_7->Facility_Description =
            fac->last_exam[7]->Facility_Description
 A_Previous_Exam_FAC_7->Accession =
            FormatAccession(fac->last_exam[7]->Accession)
 A_Previous_Exam_FAC_7->Transcribe_Date_Time =
            fac->last_exam[7]->Transcribe_Date_Time
 A_Previous_Exam_FAC_7->Final_Date_Time =
            fac->last_exam[7]->Final_Date_Time
 A_Previous_Exam_FAC_7->Request_Date_Time =
            fac->last_exam[7]->Request_Date_Time
 A_Previous_Exam_FAC_7->Exam_Status =
            fac->last_exam[7]->Exam_Status
endif
 
if (size(fac->last_exam,5) > 7)
 A_Previous_Exam_FAC_8->Complete_Date_Time =
            fac->last_exam[8]->Complete_Date_Time
 A_Previous_Exam_FAC_8->Exam_Name =
            fac->last_exam[8]->Exam_Name
 A_Previous_Exam_FAC_8->Image_Class_Type_Display =
            fac->last_exam[8]->Image_Class_Type_Display
 A_Previous_Exam_FAC_8->Image_Class_Type_Description =
            fac->last_exam[8]->Image_Class_Type_Description
 A_Previous_Exam_FAC_8->Completing_Location_Display =
            fac->last_exam[8]->Completing_Location_Display
 A_Previous_Exam_FAC_8->Completing_Location_Description =
            fac->last_exam[8]->Completing_Location_Description
 A_Previous_Exam_FAC_8->Facility_Display =
            fac->last_exam[8]->Facility_Display
 A_Previous_Exam_FAC_8->Facility_Description =
            fac->last_exam[8]->Facility_Description
 A_Previous_Exam_FAC_8->Accession =
            FormatAccession(fac->last_exam[8]->Accession)
 A_Previous_Exam_FAC_8->Transcribe_Date_Time =
            fac->last_exam[8]->Transcribe_Date_Time
 A_Previous_Exam_FAC_8->Final_Date_Time =
            fac->last_exam[8]->Final_Date_Time
 A_Previous_Exam_FAC_8->Request_Date_Time =
            fac->last_exam[8]->Request_Date_Time
 A_Previous_Exam_FAC_8->Exam_Status =
            fac->last_exam[8]->Exam_Status
endif
 
if (size(fac->last_exam,5) > 8)
 A_Previous_Exam_FAC_9->Complete_Date_Time =
            fac->last_exam[9]->Complete_Date_Time
 A_Previous_Exam_FAC_9->Exam_Name =
            fac->last_exam[9]->Exam_Name
 A_Previous_Exam_FAC_9->Image_Class_Type_Display =
            fac->last_exam[9]->Image_Class_Type_Display
 A_Previous_Exam_FAC_9->Image_Class_Type_Description =
            fac->last_exam[9]->Image_Class_Type_Description
 A_Previous_Exam_FAC_9->Completing_Location_Display =
            fac->last_exam[9]->Completing_Location_Display
 A_Previous_Exam_FAC_9->Completing_Location_Description =
            fac->last_exam[9]->Completing_Location_Description
 A_Previous_Exam_FAC_9->Facility_Display =
            fac->last_exam[9]->Facility_Display
 A_Previous_Exam_FAC_9->Facility_Description =
            fac->last_exam[9]->Facility_Description
 A_Previous_Exam_FAC_9->Accession =
            FormatAccession(fac->last_exam[9]->Accession)
 A_Previous_Exam_FAC_9->Transcribe_Date_Time =
            fac->last_exam[9]->Transcribe_Date_Time
 A_Previous_Exam_FAC_9->Final_Date_Time =
            fac->last_exam[9]->Final_Date_Time
 A_Previous_Exam_FAC_9->Request_Date_Time =
            fac->last_exam[9]->Request_Date_Time
 A_Previous_Exam_FAC_9->Exam_Status =
            fac->last_exam[9]->Exam_Status
endif
 
if (size(fac->last_exam,5) > 9)
 A_Previous_Exam_FAC_10->Complete_Date_Time =
            fac->last_exam[10]->Complete_Date_Time
 A_Previous_Exam_FAC_10->Exam_Name =
            fac->last_exam[10]->Exam_Name
 A_Previous_Exam_FAC_10->Image_Class_Type_Display =
            fac->last_exam[10]->Image_Class_Type_Display
 A_Previous_Exam_FAC_10->Image_Class_Type_Description =
            fac->last_exam[10]->Image_Class_Type_Description
 A_Previous_Exam_FAC_10->Completing_Location_Display =
            fac->last_exam[10]->Completing_Location_Display
 A_Previous_Exam_FAC_10->Completing_Location_Description =
            fac->last_exam[10]->Completing_Location_Description
 A_Previous_Exam_FAC_10->Facility_Display =
            fac->last_exam[10]->Facility_Display
 A_Previous_Exam_FAC_10->Facility_Description =
            fac->last_exam[10]->Facility_Description
 A_Previous_Exam_FAC_10->Accession =
            FormatAccession(fac->last_exam[10]->Accession)
 A_Previous_Exam_FAC_10->Transcribe_Date_Time =
            fac->last_exam[10]->Transcribe_Date_Time
 A_Previous_Exam_FAC_10->Final_Date_Time =
            fac->last_exam[10]->Final_Date_Time
 A_Previous_Exam_FAC_10->Request_Date_Time =
            fac->last_exam[10]->Request_Date_Time
 A_Previous_Exam_FAC_10->Exam_Status =
            fac->last_exam[10]->Exam_Status
endif
 
/***************************************************************/
if (size(lib->last_exam,5) > 0)
 A_Previous_Exam_LIB_1->Complete_Date_Time =
            lib->last_exam[1]->Complete_Date_Time
 A_Previous_Exam_LIB_1->Exam_Name =
            lib->last_exam[1]->Exam_Name
 A_Previous_Exam_LIB_1->Image_Class_Type_Display =
            lib->last_exam[1]->Image_Class_Type_Display
 A_Previous_Exam_LIB_1->Image_Class_Type_Description =
            lib->last_exam[1]->Image_Class_Type_Description
 A_Previous_Exam_LIB_1->Completing_Location_Display =
            lib->last_exam[1]->Completing_Location_Display
 A_Previous_Exam_LIB_1->Completing_Location_Description =
            lib->last_exam[1]->Completing_Location_Description
 A_Previous_Exam_LIB_1->Facility_Display =
            lib->last_exam[1]->Facility_Display
 A_Previous_Exam_LIB_1->Facility_Description =
            lib->last_exam[1]->Facility_Description
 A_Previous_Exam_LIB_1->Accession =
            FormatAccession(lib->last_exam[1]->Accession)
 A_Previous_Exam_LIB_1->Transcribe_Date_Time =
            lib->last_exam[1]->Transcribe_Date_Time
 A_Previous_Exam_LIB_1->Final_Date_Time =
            lib->last_exam[1]->Final_Date_Time
 A_Previous_Exam_LIB_1->Request_Date_Time =
            lib->last_exam[1]->Request_Date_Time
 A_Previous_Exam_LIB_1->Exam_Status =
            lib->last_exam[1]->Exam_Status

 if (validate(working_array->debug_flag) = 1)
        if (cnvtupper(working_array->debug_flag) = 'Y')
                call echo (build("Previous1 LIB ---->",
             A_Previous_Exam_LIB_1->Complete_Date_Time ))
                call echo (build("Previous1 LIB ---->",
            A_Previous_Exam_LIB_1->Exam_Name ))
                call echo (build("Previous1 LIB ---->",
            A_Previous_Exam_LIB_1->Image_Class_Type_Display ))
 call echo (build("Previous1 LIB ---->",
            A_Previous_Exam_LIB_1->Image_Class_Type_Description ))
 call echo (build("Previous1 LIB ---->",
            A_Previous_Exam_LIB_1->Completing_Location_Display ))
 call echo (build("Previous1 LIB ---->",
            A_Previous_Exam_LIB_1->Completing_Location_Description ))
 call echo (build("Previous1 LIB ---->",
            A_Previous_Exam_LIB_1->Facility_Display ))
 call echo (build("Previous1 LIB ---->",
            A_Previous_Exam_LIB_1->Facility_Description ))
 call echo (build("Previous1 LIB ---->",
            A_Previous_Exam_LIB_1->Accession ))
 call echo (build("Previous1 LIB ---->",
            A_Previous_Exam_LIB_1->Transcribe_Date_Time ))
 call echo (build("Previous1 LIB ---->",
            A_Previous_Exam_LIB_1->Final_Date_Time ))
                call echo (build("Previous1 LIB ---->",
            A_Previous_Exam_LIB_1->Request_Date_Time ))
                call echo (build("Previous1 LIB ---->",
            A_Previous_Exam_LIB_1->Exam_Status ))
        endif
 endif
endif

if (size(lib->last_exam,5) > 1)
 A_Previous_Exam_LIB_2->Complete_Date_Time =
            lib->last_exam[2]->Complete_Date_Time
 A_Previous_Exam_LIB_2->Exam_Name =
            lib->last_exam[2]->Exam_Name
 A_Previous_Exam_LIB_2->Image_Class_Type_Display =
            lib->last_exam[2]->Image_Class_Type_Display
 A_Previous_Exam_LIB_2->Image_Class_Type_Description =
            lib->last_exam[2]->Image_Class_Type_Description
 A_Previous_Exam_LIB_2->Completing_Location_Display =
            lib->last_exam[2]->Completing_Location_Display
 A_Previous_Exam_LIB_2->Completing_Location_Description =
            lib->last_exam[2]->Completing_Location_Description
 A_Previous_Exam_LIB_2->Facility_Display =
            lib->last_exam[2]->Facility_Display
 A_Previous_Exam_LIB_2->Facility_Description =
            lib->last_exam[2]->Facility_Description
 A_Previous_Exam_LIB_2->Accession =
            FormatAccession(lib->last_exam[2]->Accession)
 A_Previous_Exam_LIB_2->Transcribe_Date_Time =
            lib->last_exam[2]->Transcribe_Date_Time
 A_Previous_Exam_LIB_2->Final_Date_Time =
            lib->last_exam[2]->Final_Date_Time
 A_Previous_Exam_LIB_2->Request_Date_Time =
            lib->last_exam[2]->Request_Date_Time
 A_Previous_Exam_LIB_2->Exam_Status =
            lib->last_exam[2]->Exam_Status
endif
 
if (size(lib->last_exam,5) > 2)
 A_Previous_Exam_LIB_3->Complete_Date_Time =
            lib->last_exam[3]->Complete_Date_Time
 A_Previous_Exam_LIB_3->Exam_Name =
            lib->last_exam[3]->Exam_Name
 A_Previous_Exam_LIB_3->Image_Class_Type_Display =
            lib->last_exam[3]->Image_Class_Type_Display
 A_Previous_Exam_LIB_3->Image_Class_Type_Description =
            lib->last_exam[3]->Image_Class_Type_Description
 A_Previous_Exam_LIB_3->Completing_Location_Display =
            lib->last_exam[3]->Completing_Location_Display
 A_Previous_Exam_LIB_3->Completing_Location_Description =
            lib->last_exam[3]->Completing_Location_Description
 A_Previous_Exam_LIB_3->Facility_Display =
            lib->last_exam[3]->Facility_Display
 A_Previous_Exam_LIB_3->Facility_Description =
            lib->last_exam[3]->Facility_Description
 A_Previous_Exam_LIB_3->Accession =
            FormatAccession(lib->last_exam[3]->Accession)
 A_Previous_Exam_LIB_3->Transcribe_Date_Time =
            lib->last_exam[3]->Transcribe_Date_Time
 A_Previous_Exam_LIB_3->Final_Date_Time =
            lib->last_exam[3]->Final_Date_Time
 A_Previous_Exam_LIB_3->Request_Date_Time =
            lib->last_exam[3]->Request_Date_Time
 A_Previous_Exam_LIB_3->Exam_Status =
            lib->last_exam[3]->Exam_Status
endif
 
if (size(lib->last_exam,5) > 3)
 A_Previous_Exam_LIB_4->Complete_Date_Time =
            lib->last_exam[4]->Complete_Date_Time
 A_Previous_Exam_LIB_4->Exam_Name =
            lib->last_exam[4]->Exam_Name
 A_Previous_Exam_LIB_4->Image_Class_Type_Display =
            lib->last_exam[4]->Image_Class_Type_Display
 A_Previous_Exam_LIB_4->Image_Class_Type_Description =
            lib->last_exam[4]->Image_Class_Type_Description
 A_Previous_Exam_LIB_4->Completing_Location_Display =
            lib->last_exam[4]->Completing_Location_Display
 A_Previous_Exam_LIB_4->Completing_Location_Description =
            lib->last_exam[4]->Completing_Location_Description
 A_Previous_Exam_LIB_4->Facility_Display =
            lib->last_exam[4]->Facility_Display
 A_Previous_Exam_LIB_4->Facility_Description =
            lib->last_exam[4]->Facility_Description
 A_Previous_Exam_LIB_4->Accession =
            FormatAccession(lib->last_exam[4]->Accession)
 A_Previous_Exam_LIB_4->Transcribe_Date_Time =
            lib->last_exam[4]->Transcribe_Date_Time
 A_Previous_Exam_LIB_4->Final_Date_Time =
            lib->last_exam[4]->Final_Date_Time
 A_Previous_Exam_LIB_4->Request_Date_Time =
            lib->last_exam[4]->Request_Date_Time
 A_Previous_Exam_LIB_4->Exam_Status =
            lib->last_exam[4]->Exam_Status
endif
 
if (size(lib->last_exam,5) > 4)
 A_Previous_Exam_LIB_5->Complete_Date_Time =
            lib->last_exam[5]->Complete_Date_Time
 A_Previous_Exam_LIB_5->Exam_Name =
            lib->last_exam[5]->Exam_Name
 A_Previous_Exam_LIB_5->Image_Class_Type_Display =
            lib->last_exam[5]->Image_Class_Type_Display
 A_Previous_Exam_LIB_5->Image_Class_Type_Description =
            lib->last_exam[5]->Image_Class_Type_Description
 A_Previous_Exam_LIB_5->Completing_Location_Display =
            lib->last_exam[5]->Completing_Location_Display
 A_Previous_Exam_LIB_5->Completing_Location_Description =
            lib->last_exam[5]->Completing_Location_Description
 A_Previous_Exam_LIB_5->Facility_Display =
            lib->last_exam[5]->Facility_Display
 A_Previous_Exam_LIB_5->Facility_Description =
            lib->last_exam[5]->Facility_Description
 A_Previous_Exam_LIB_5->Accession =
            FormatAccession(lib->last_exam[5]->Accession)
 A_Previous_Exam_LIB_5->Transcribe_Date_Time =
            lib->last_exam[5]->Transcribe_Date_Time
 A_Previous_Exam_LIB_5->Final_Date_Time =
            lib->last_exam[5]->Final_Date_Time
 A_Previous_Exam_LIB_5->Request_Date_Time =
            lib->last_exam[5]->Request_Date_Time
 A_Previous_Exam_LIB_5->Exam_Status =
            lib->last_exam[5]->Exam_Status
endif
 
if (size(lib->last_exam,5) > 5)
 A_Previous_Exam_LIB_6->Complete_Date_Time =
            lib->last_exam[6]->Complete_Date_Time
 A_Previous_Exam_LIB_6->Exam_Name =
            lib->last_exam[6]->Exam_Name
 A_Previous_Exam_LIB_6->Image_Class_Type_Display =
            lib->last_exam[6]->Image_Class_Type_Display
 A_Previous_Exam_LIB_6->Image_Class_Type_Description =
            lib->last_exam[6]->Image_Class_Type_Description
 A_Previous_Exam_LIB_6->Completing_Location_Display =
            lib->last_exam[6]->Completing_Location_Display
 A_Previous_Exam_LIB_6->Completing_Location_Description =
            lib->last_exam[6]->Completing_Location_Description
 A_Previous_Exam_LIB_6->Facility_Display =
            lib->last_exam[6]->Facility_Display
 A_Previous_Exam_LIB_6->Facility_Description =
            lib->last_exam[6]->Facility_Description
 A_Previous_Exam_LIB_6->Accession =
            FormatAccession(lib->last_exam[6]->Accession)
 A_Previous_Exam_LIB_6->Transcribe_Date_Time =
            lib->last_exam[6]->Transcribe_Date_Time
 A_Previous_Exam_LIB_6->Final_Date_Time =
            lib->last_exam[6]->Final_Date_Time
 A_Previous_Exam_LIB_6->Request_Date_Time =
            lib->last_exam[6]->Request_Date_Time
 A_Previous_Exam_LIB_6->Exam_Status =
            lib->last_exam[6]->Exam_Status
endif
 
if (size(lib->last_exam,5) > 6)
 A_Previous_Exam_LIB_7->Complete_Date_Time =
            lib->last_exam[7]->Complete_Date_Time
 A_Previous_Exam_LIB_7->Exam_Name =
            lib->last_exam[7]->Exam_Name
 A_Previous_Exam_LIB_7->Image_Class_Type_Display =
            lib->last_exam[7]->Image_Class_Type_Display
 A_Previous_Exam_LIB_7->Image_Class_Type_Description =
            lib->last_exam[7]->Image_Class_Type_Description
 A_Previous_Exam_LIB_7->Completing_Location_Display =
            lib->last_exam[7]->Completing_Location_Display
 A_Previous_Exam_LIB_7->Completing_Location_Description =
            lib->last_exam[7]->Completing_Location_Description
 A_Previous_Exam_LIB_7->Facility_Display =
            lib->last_exam[7]->Facility_Display
 A_Previous_Exam_LIB_7->Facility_Description =
            lib->last_exam[7]->Facility_Description
 A_Previous_Exam_LIB_7->Accession =
            FormatAccession(lib->last_exam[7]->Accession)
 A_Previous_Exam_LIB_7->Transcribe_Date_Time =
            lib->last_exam[7]->Transcribe_Date_Time
 A_Previous_Exam_LIB_7->Final_Date_Time =
            lib->last_exam[7]->Final_Date_Time
 A_Previous_Exam_LIB_7->Request_Date_Time =
            lib->last_exam[7]->Request_Date_Time
 A_Previous_Exam_LIB_7->Exam_Status =
            lib->last_exam[7]->Exam_Status
endif
 
if (size(lib->last_exam,5) > 7)
 A_Previous_Exam_LIB_8->Complete_Date_Time =
            lib->last_exam[8]->Complete_Date_Time
 A_Previous_Exam_LIB_8->Exam_Name =
            lib->last_exam[8]->Exam_Name
 A_Previous_Exam_LIB_8->Image_Class_Type_Display =
            lib->last_exam[8]->Image_Class_Type_Display
 A_Previous_Exam_LIB_8->Image_Class_Type_Description =
            lib->last_exam[8]->Image_Class_Type_Description
 A_Previous_Exam_LIB_8->Completing_Location_Display =
            lib->last_exam[8]->Completing_Location_Display
 A_Previous_Exam_LIB_8->Completing_Location_Description =
            lib->last_exam[8]->Completing_Location_Description
 A_Previous_Exam_LIB_8->Facility_Display =
            lib->last_exam[8]->Facility_Display
 A_Previous_Exam_LIB_8->Facility_Description =
            lib->last_exam[8]->Facility_Description
 A_Previous_Exam_LIB_8->Accession =
            FormatAccession(lib->last_exam[8]->Accession)
 A_Previous_Exam_LIB_8->Transcribe_Date_Time =
            lib->last_exam[8]->Transcribe_Date_Time
 A_Previous_Exam_LIB_8->Final_Date_Time =
            lib->last_exam[8]->Final_Date_Time
 A_Previous_Exam_LIB_8->Request_Date_Time =
            lib->last_exam[8]->Request_Date_Time
 A_Previous_Exam_LIB_8->Exam_Status =
            lib->last_exam[8]->Exam_Status
endif
 
if (size(lib->last_exam,5) > 8)
 A_Previous_Exam_LIB_9->Complete_Date_Time =
            lib->last_exam[9]->Complete_Date_Time
 A_Previous_Exam_LIB_9->Exam_Name =
            lib->last_exam[9]->Exam_Name
 A_Previous_Exam_LIB_9->Image_Class_Type_Display =
            lib->last_exam[9]->Image_Class_Type_Display
 A_Previous_Exam_LIB_9->Image_Class_Type_Description =
            lib->last_exam[9]->Image_Class_Type_Description
 A_Previous_Exam_LIB_9->Completing_Location_Display =
            lib->last_exam[9]->Completing_Location_Display
 A_Previous_Exam_LIB_9->Completing_Location_Description =
            lib->last_exam[9]->Completing_Location_Description
 A_Previous_Exam_LIB_9->Facility_Display =
            lib->last_exam[9]->Facility_Display
 A_Previous_Exam_LIB_9->Facility_Description =
            lib->last_exam[9]->Facility_Description
 A_Previous_Exam_LIB_9->Accession =
            FormatAccession(lib->last_exam[9]->Accession)
 A_Previous_Exam_LIB_9->Transcribe_Date_Time =
            lib->last_exam[9]->Transcribe_Date_Time
 A_Previous_Exam_LIB_9->Final_Date_Time =
            lib->last_exam[9]->Final_Date_Time
 A_Previous_Exam_LIB_9->Request_Date_Time =
            lib->last_exam[9]->Request_Date_Time
 A_Previous_Exam_LIB_9->Exam_Status =
            lib->last_exam[9]->Exam_Status
endif
 
if (size(lib->last_exam,5) > 9)
 A_Previous_Exam_LIB_10->Complete_Date_Time =
            lib->last_exam[10]->Complete_Date_Time
 A_Previous_Exam_LIB_10->Exam_Name =
            lib->last_exam[10]->Exam_Name
 A_Previous_Exam_LIB_10->Image_Class_Type_Display =
            lib->last_exam[10]->Image_Class_Type_Display
 A_Previous_Exam_LIB_10->Image_Class_Type_Description =
            lib->last_exam[10]->Image_Class_Type_Description
 A_Previous_Exam_LIB_10->Completing_Location_Display =
            lib->last_exam[10]->Completing_Location_Display
 A_Previous_Exam_LIB_10->Completing_Location_Description =
            lib->last_exam[10]->Completing_Location_Description
 A_Previous_Exam_LIB_10->Facility_Display =
            lib->last_exam[10]->Facility_Display
 A_Previous_Exam_LIB_10->Facility_Description =
            lib->last_exam[10]->Facility_Description
 A_Previous_Exam_LIB_10->Accession =
            FormatAccession(lib->last_exam[10]->Accession)
 A_Previous_Exam_LIB_10->Transcribe_Date_Time =
            lib->last_exam[10]->Transcribe_Date_Time
 A_Previous_Exam_LIB_10->Final_Date_Time =
            lib->last_exam[10]->Final_Date_Time
 A_Previous_Exam_LIB_10->Request_Date_Time =
            lib->last_exam[10]->Request_Date_Time
 A_Previous_Exam_LIB_10->Exam_Status =
            lib->last_exam[10]->Exam_Status
endif
 
/********************************************************/
if (size(act->last_exam,5) > 0)
 A_Previous_Exam_ACT_1->Complete_Date_Time =
            act->last_exam[1]->Complete_Date_Time
 A_Previous_Exam_ACT_1->Exam_Name =
            act->last_exam[1]->Exam_Name
 A_Previous_Exam_ACT_1->Image_Class_Type_Display =
            act->last_exam[1]->Image_Class_Type_Display
 A_Previous_Exam_ACT_1->Image_Class_Type_Description =
            act->last_exam[1]->Image_Class_Type_Description
 A_Previous_Exam_ACT_1->Completing_Location_Display =
            act->last_exam[1]->Completing_Location_Display
 A_Previous_Exam_ACT_1->Completing_Location_Description =
            act->last_exam[1]->Completing_Location_Description
 A_Previous_Exam_ACT_1->Facility_Display =
            act->last_exam[1]->Facility_Display
 A_Previous_Exam_ACT_1->Facility_Description =
            act->last_exam[1]->Facility_Description
 A_Previous_Exam_ACT_1->Accession =
            FormatAccession(act->last_exam[1]->Accession)
 A_Previous_Exam_ACT_1->Transcribe_Date_Time =
            act->last_exam[1]->Transcribe_Date_Time
 A_Previous_Exam_ACT_1->Final_Date_Time =
            act->last_exam[1]->Final_Date_Time
 A_Previous_Exam_ACT_1->Request_Date_Time =
            act->last_exam[1]->Request_Date_Time
 A_Previous_Exam_ACT_1->Exam_Status =
            act->last_exam[1]->Exam_Status

 if (validate(working_array->debug_flag) = 1)
        if (cnvtupper(working_array->debug_flag) = 'Y')
                call echo (build("Previous1 ACT ---->",
            A_Previous_Exam_ACT_1->Complete_Date_Time ))
                call echo (build("Previous1 ACT ---->",
            A_Previous_Exam_ACT_1->Exam_Name ))
                call echo (build("Previous1 ACT ---->",
            A_Previous_Exam_ACT_1->Image_Class_Type_Display ))
 call echo (build("Previous1 ACT ---->",
            A_Previous_Exam_ACT_1->Image_Class_Type_Description ))
 call echo (build("Previous1 ACT ---->",
            A_Previous_Exam_ACT_1->Completing_Location_Display ))
 call echo (build("Previous1 ACT ---->",
            A_Previous_Exam_ACT_1->Completing_Location_Description ))
 call echo (build("Previous1 ACT ---->",
            A_Previous_Exam_ACT_1->Facility_Display ))
 call echo (build("Previous1 ACT ---->",
            A_Previous_Exam_ACT_1->Facility_Description ))
 call echo (build("Previous1 ACT ---->",
            A_Previous_Exam_ACT_1->Accession ))
 call echo (build("Previous1 ACT ---->",
            A_Previous_Exam_ACT_1->Transcribe_Date_Time ))
 call echo (build("Previous1 ACT ---->",
            A_Previous_Exam_ACT_1->Final_Date_Time ))
                call echo (build("Previous1 ACT ---->",
            A_Previous_Exam_ACT_1->Request_Date_Time ))
                call echo (build("Previous1 ACT ---->",
            A_Previous_Exam_ACT_1->Exam_Status ))
        endif
 endif
endif

if (size(act->last_exam,5) > 1)
 A_Previous_Exam_ACT_2->Complete_Date_Time =
            act->last_exam[2]->Complete_Date_Time
 A_Previous_Exam_ACT_2->Exam_Name =
            act->last_exam[2]->Exam_Name
 A_Previous_Exam_ACT_2->Image_Class_Type_Display =
            act->last_exam[2]->Image_Class_Type_Display
 A_Previous_Exam_ACT_2->Image_Class_Type_Description =
            act->last_exam[2]->Image_Class_Type_Description
 A_Previous_Exam_ACT_2->Completing_Location_Display =
            act->last_exam[2]->Completing_Location_Display
 A_Previous_Exam_ACT_2->Completing_Location_Description =
            act->last_exam[2]->Completing_Location_Description
 A_Previous_Exam_ACT_2->Facility_Display =
            act->last_exam[2]->Facility_Display
 A_Previous_Exam_ACT_2->Facility_Description =
            act->last_exam[2]->Facility_Description
 A_Previous_Exam_ACT_2->Accession =
            FormatAccession(act->last_exam[2]->Accession)
 A_Previous_Exam_ACT_2->Transcribe_Date_Time =
            act->last_exam[2]->Transcribe_Date_Time
 A_Previous_Exam_ACT_2->Final_Date_Time =
            act->last_exam[2]->Final_Date_Time
 A_Previous_Exam_ACT_2->Request_Date_Time =
            act->last_exam[2]->Request_Date_Time
 A_Previous_Exam_ACT_2->Exam_Status =
            act->last_exam[2]->Exam_Status
endif

if (size(act->last_exam,5) > 2)
 A_Previous_Exam_ACT_3->Complete_Date_Time =
            act->last_exam[3]->Complete_Date_Time
 A_Previous_Exam_ACT_3->Exam_Name =
            act->last_exam[3]->Exam_Name
 A_Previous_Exam_ACT_3->Image_Class_Type_Display =
            act->last_exam[3]->Image_Class_Type_Display
 A_Previous_Exam_ACT_3->Image_Class_Type_Description =
            act->last_exam[3]->Image_Class_Type_Description
 A_Previous_Exam_ACT_3->Completing_Location_Display =
            act->last_exam[3]->Completing_Location_Display
 A_Previous_Exam_ACT_3->Completing_Location_Description =
            act->last_exam[3]->Completing_Location_Description
 A_Previous_Exam_ACT_3->Facility_Display =
            act->last_exam[3]->Facility_Display
 A_Previous_Exam_ACT_3->Facility_Description =
            act->last_exam[3]->Facility_Description
 A_Previous_Exam_ACT_3->Accession =
            FormatAccession(act->last_exam[3]->Accession)
 A_Previous_Exam_ACT_3->Transcribe_Date_Time =
            act->last_exam[3]->Transcribe_Date_Time
 A_Previous_Exam_ACT_3->Final_Date_Time =
            act->last_exam[3]->Final_Date_Time
 A_Previous_Exam_ACT_3->Request_Date_Time =
            act->last_exam[3]->Request_Date_Time
 A_Previous_Exam_ACT_3->Exam_Status =
            act->last_exam[3]->Exam_Status
endif
 
if (size(act->last_exam,5) > 3)
 A_Previous_Exam_ACT_4->Complete_Date_Time =
            act->last_exam[4]->Complete_Date_Time
 A_Previous_Exam_ACT_4->Exam_Name =
            act->last_exam[4]->Exam_Name
 A_Previous_Exam_ACT_4->Image_Class_Type_Display =
            act->last_exam[4]->Image_Class_Type_Display
 A_Previous_Exam_ACT_4->Image_Class_Type_Description =
            act->last_exam[4]->Image_Class_Type_Description
 A_Previous_Exam_ACT_4->Completing_Location_Display =
            act->last_exam[4]->Completing_Location_Display
 A_Previous_Exam_ACT_4->Completing_Location_Description =
            act->last_exam[4]->Completing_Location_Description
 A_Previous_Exam_ACT_4->Facility_Display =
            act->last_exam[4]->Facility_Display
 A_Previous_Exam_ACT_4->Facility_Description =
            act->last_exam[4]->Facility_Description
 A_Previous_Exam_ACT_4->Accession =
            FormatAccession(act->last_exam[4]->Accession)
 A_Previous_Exam_ACT_4->Transcribe_Date_Time =
            act->last_exam[4]->Transcribe_Date_Time
 A_Previous_Exam_ACT_4->Final_Date_Time =
            act->last_exam[4]->Final_Date_Time
 A_Previous_Exam_ACT_4->Request_Date_Time =
            act->last_exam[4]->Request_Date_Time
 A_Previous_Exam_ACT_4->Exam_Status =
            act->last_exam[4]->Exam_Status
endif
 
if (size(act->last_exam,5) > 4)
 A_Previous_Exam_ACT_5->Complete_Date_Time =
            act->last_exam[5]->Complete_Date_Time
 A_Previous_Exam_ACT_5->Exam_Name =
            act->last_exam[5]->Exam_Name

 A_Previous_Exam_ACT_5->Image_Class_Type_Display =
            act->last_exam[5]->Image_Class_Type_Display
 A_Previous_Exam_ACT_5->Image_Class_Type_Description =
            act->last_exam[5]->Image_Class_Type_Description
 A_Previous_Exam_ACT_5->Completing_Location_Display =
            act->last_exam[5]->Completing_Location_Display
 A_Previous_Exam_ACT_5->Completing_Location_Description =
            act->last_exam[5]->Completing_Location_Description
 A_Previous_Exam_ACT_5->Facility_Display =
            act->last_exam[5]->Facility_Display
 A_Previous_Exam_ACT_5->Facility_Description =
            act->last_exam[5]->Facility_Description
 A_Previous_Exam_ACT_5->Accession =
            FormatAccession(act->last_exam[5]->Accession)
 A_Previous_Exam_ACT_5->Transcribe_Date_Time =
            act->last_exam[5]->Transcribe_Date_Time
 A_Previous_Exam_ACT_5->Final_Date_Time =
            act->last_exam[5]->Final_Date_Time
 A_Previous_Exam_ACT_5->Request_Date_Time =
            act->last_exam[5]->Request_Date_Time
 A_Previous_Exam_ACT_5->Exam_Status =
            act->last_exam[5]->Exam_Status
endif
 
if (size(act->last_exam,5) > 5)
 A_Previous_Exam_ACT_6->Complete_Date_Time =
            act->last_exam[6]->Complete_Date_Time
 A_Previous_Exam_ACT_6->Exam_Name =
            act->last_exam[6]->Exam_Name
 A_Previous_Exam_ACT_6->Image_Class_Type_Display =
            act->last_exam[6]->Image_Class_Type_Display
 A_Previous_Exam_ACT_6->Image_Class_Type_Description =
            act->last_exam[6]->Image_Class_Type_Description
 A_Previous_Exam_ACT_6->Completing_Location_Display =
            act->last_exam[6]->Completing_Location_Display
 A_Previous_Exam_ACT_6->Completing_Location_Description =
            act->last_exam[6]->Completing_Location_Description
 A_Previous_Exam_ACT_6->Facility_Display =
            act->last_exam[6]->Facility_Display
 A_Previous_Exam_ACT_6->Facility_Description =
            act->last_exam[6]->Facility_Description
 A_Previous_Exam_ACT_6->Accession =
            FormatAccession(act->last_exam[6]->Accession)
 A_Previous_Exam_ACT_6->Transcribe_Date_Time =
            act->last_exam[6]->Transcribe_Date_Time
 A_Previous_Exam_ACT_6->Final_Date_Time =
            act->last_exam[6]->Final_Date_Time
 A_Previous_Exam_ACT_6->Request_Date_Time =
            act->last_exam[6]->Request_Date_Time
 A_Previous_Exam_ACT_6->Exam_Status =
            act->last_exam[6]->Exam_Status
endif
 
if (size(act->last_exam,5) > 6)
 A_Previous_Exam_ACT_7->Complete_Date_Time =
            act->last_exam[7]->Complete_Date_Time
 A_Previous_Exam_ACT_7->Exam_Name =
            act->last_exam[7]->Exam_Name
 A_Previous_Exam_ACT_7->Image_Class_Type_Display =
            act->last_exam[7]->Image_Class_Type_Display
 A_Previous_Exam_ACT_7->Image_Class_Type_Description =
            act->last_exam[7]->Image_Class_Type_Description
 A_Previous_Exam_ACT_7->Completing_Location_Display =
            act->last_exam[7]->Completing_Location_Display
 A_Previous_Exam_ACT_7->Completing_Location_Description =
            act->last_exam[7]->Completing_Location_Description
 A_Previous_Exam_ACT_7->Facility_Display =
            act->last_exam[7]->Facility_Display
 A_Previous_Exam_ACT_7->Facility_Description =
            act->last_exam[7]->Facility_Description
 A_Previous_Exam_ACT_7->Accession =
            FormatAccession(act->last_exam[7]->Accession)
 A_Previous_Exam_ACT_7->Transcribe_Date_Time =
            act->last_exam[7]->Transcribe_Date_Time
 A_Previous_Exam_ACT_7->Final_Date_Time =
            act->last_exam[7]->Final_Date_Time
 A_Previous_Exam_ACT_7->Request_Date_Time =
            act->last_exam[7]->Request_Date_Time
 A_Previous_Exam_ACT_7->Exam_Status =
            act->last_exam[7]->Exam_Status
endif
 
if (size(act->last_exam,5) > 7)
 A_Previous_Exam_ACT_8->Complete_Date_Time =
            act->last_exam[8]->Complete_Date_Time
 A_Previous_Exam_ACT_8->Exam_Name =
            act->last_exam[8]->Exam_Name
 A_Previous_Exam_ACT_8->Image_Class_Type_Display =
            act->last_exam[8]->Image_Class_Type_Display
 A_Previous_Exam_ACT_8->Image_Class_Type_Description =
            act->last_exam[8]->Image_Class_Type_Description
 A_Previous_Exam_ACT_8->Completing_Location_Display =
            act->last_exam[8]->Completing_Location_Display
 A_Previous_Exam_ACT_8->Completing_Location_Description =
            act->last_exam[8]->Completing_Location_Description
 A_Previous_Exam_ACT_8->Facility_Display =
            act->last_exam[8]->Facility_Display
 A_Previous_Exam_ACT_8->Facility_Description =
            act->last_exam[8]->Facility_Description
 A_Previous_Exam_ACT_8->Accession =
            FormatAccession(act->last_exam[8]->Accession)
 A_Previous_Exam_ACT_8->Transcribe_Date_Time =
            act->last_exam[8]->Transcribe_Date_Time
 A_Previous_Exam_ACT_8->Final_Date_Time =
            act->last_exam[8]->Final_Date_Time
 A_Previous_Exam_ACT_8->Request_Date_Time =
            act->last_exam[8]->Request_Date_Time
 A_Previous_Exam_ACT_8->Exam_Status =
            act->last_exam[8]->Exam_Status
endif
 
if (size(act->last_exam,5) > 8)
 A_Previous_Exam_ACT_9->Complete_Date_Time =
            act->last_exam[9]->Complete_Date_Time
 A_Previous_Exam_ACT_9->Exam_Name =
            act->last_exam[9]->Exam_Name
 A_Previous_Exam_ACT_9->Image_Class_Type_Display =
            act->last_exam[9]->Image_Class_Type_Display
 A_Previous_Exam_ACT_9->Image_Class_Type_Description =
            act->last_exam[9]->Image_Class_Type_Description
 A_Previous_Exam_ACT_9->Completing_Location_Display =
            act->last_exam[9]->Completing_Location_Display
 A_Previous_Exam_ACT_9->Completing_Location_Description =
            act->last_exam[9]->Completing_Location_Description
 A_Previous_Exam_ACT_9->Facility_Display =
            act->last_exam[9]->Facility_Display
 A_Previous_Exam_ACT_9->Facility_Description =
            act->last_exam[9]->Facility_Description
 A_Previous_Exam_ACT_9->Accession =
            FormatAccession(act->last_exam[9]->Accession)
 A_Previous_Exam_ACT_9->Transcribe_Date_Time =
            act->last_exam[9]->Transcribe_Date_Time
 A_Previous_Exam_ACT_9->Final_Date_Time =
            act->last_exam[9]->Final_Date_Time
 A_Previous_Exam_ACT_9->Request_Date_Time =
            act->last_exam[9]->Request_Date_Time
 A_Previous_Exam_ACT_9->Exam_Status =
            act->last_exam[9]->Exam_Status
endif
 
if (size(act->last_exam,5) > 9)
 A_Previous_Exam_ACT_10->Complete_Date_Time =
            act->last_exam[10]->Complete_Date_Time
 A_Previous_Exam_ACT_10->Exam_Name =
            act->last_exam[10]->Exam_Name
 A_Previous_Exam_ACT_10->Image_Class_Type_Display =
            act->last_exam[10]->Image_Class_Type_Display
 A_Previous_Exam_ACT_10->Image_Class_Type_Description =
            act->last_exam[10]->Image_Class_Type_Description
 A_Previous_Exam_ACT_10->Completing_Location_Display =
            act->last_exam[10]->Completing_Location_Display
 A_Previous_Exam_ACT_10->Completing_Location_Description =
            act->last_exam[10]->Completing_Location_Description
 A_Previous_Exam_ACT_10->Facility_Display =
            act->last_exam[10]->Facility_Display
 A_Previous_Exam_ACT_10->Facility_Description =
            act->last_exam[10]->Facility_Description
 A_Previous_Exam_ACT_10->Accession =
            FormatAccession(act->last_exam[10]->Accession)
 A_Previous_Exam_ACT_10->Transcribe_Date_Time =
            act->last_exam[10]->Transcribe_Date_Time
 A_Previous_Exam_ACT_10->Final_Date_Time =
            act->last_exam[10]->Final_Date_Time
 A_Previous_Exam_ACT_10->Request_Date_Time =
            act->last_exam[10]->Request_Date_Time
 A_Previous_Exam_ACT_10->Exam_Status =
            act->last_exam[10]->Exam_Status
endif
 
 


