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
 
        Source file name:       rad_packet_other_exam_data.inc
        Object name:            n/a
        Request #:              multiple
 
        Product:                GARPP
        Product Team:           Radnet
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        data fields for other exams to print on the patient packet
 
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
 
call echo("*****START OF OTHER EXAMS DATA*****")

;other exam 1
     if (size(data->req[req_ndx]->other_exams,5) > 0)
          if (size(trim(data->req[req_ndx]->other_exams[1]->
                                catalog_mnemonic)) > 0)
              A_Other_Exam_1->Other_Name_1 = data->req[req_ndx]
                                       ->other_exams[1]->catalog_mnemonic
              A_Other_Exam_1->Other_Accession_1 = FormatAccession(data->req[req_ndx]
                                  ->other_exams[1]->accession)
          else
              A_Other_Exam_1->Other_Name_1 = " "
              A_Other_Exam_1->Other_Accession_1 = " "
          endif
     endif
;other exam 2
     if (size(data->req[req_ndx]->other_exams,5) > 1)
          if (size(trim(data->req[req_ndx]->other_exams[2]->
                                catalog_mnemonic)) > 0)
              A_Other_Exam_2->Other_Name_2 = data->req[req_ndx]
                                     ->other_exams[2]->catalog_mnemonic
              A_Other_Exam_2->Other_Accession_2 = FormatAccession(data->req[req_ndx]
                                  ->other_exams[2]->accession)
          else
              A_Other_Exam_2->Other_Name_2 = " "
              A_Other_Exam_2->Other_Accession_2 = " "
          endif
     endif
;other exam 3
     if (size(data->req[req_ndx]->other_exams,5) > 2)
          if (size(trim(data->req[req_ndx]->other_exams[3]->
                                catalog_mnemonic)) > 0)
              A_Other_Exam_3->Other_Name_3 = data->req[req_ndx]
                                ->other_exams[3]->catalog_mnemonic
              A_Other_Exam_3->Other_Accession_3 = FormatAccession(data->req[req_ndx]
                                  ->other_exams[3]->accession)
          else
              A_Other_Exam_3->Other_Name_3 = " "
              A_Other_Exam_3->Other_Accession_3 = " "
          endif
     endif
;other exam 4
     if (size(data->req[req_ndx]->other_exams,5) > 3)
          if (size(trim(data->req[req_ndx]->other_exams[4]->
                                catalog_mnemonic)) > 0)
              A_Other_Exam_4->Other_Name_4 = data->req[req_ndx]
                                   ->other_exams[4]->catalog_mnemonic
              A_Other_Exam_4->Other_Accession_4 = FormatAccession(data->req[req_ndx]
                                  ->other_exams[4]->accession)
          else
              A_Other_Exam_4->Other_Name_4 = " "
              A_Other_Exam_4->Other_Accession_4 = " "
          endif
     endif
;other exam 5
     if (size(data->req[req_ndx]->other_exams,5) > 4)
          if (size(trim(data->req[req_ndx]->other_exams[5]->
                                catalog_mnemonic)) > 0)
             A_Other_Exam_5->Other_Name_5 = data->req[req_ndx]
                                ->other_exams[5]->catalog_mnemonic
             A_Other_Exam_5->Other_Accession_5 = FormatAccession(data->req[req_ndx]
                                  ->other_exams[5]->accession)
       else
             A_Other_Exam_5->Other_Name_5 = " "
             A_Other_Exam_5->Other_Accession_5 = " "
        endif
     endif
;other exam 6
     if (size(data->req[req_ndx]->other_exams,5) > 5)
          if (size(trim(data->req[req_ndx]->other_exams[6]->
                                catalog_mnemonic)) > 0)
              A_Other_Exam_6->Other_Name_6 = data->req[req_ndx]
                                ->other_exams[6]->catalog_mnemonic
              A_Other_Exam_6->Other_Accession_6 = FormatAccession(data->req[req_ndx]
                                  ->other_exams[6]->accession)
          else
              A_Other_Exam_6->Other_Name_6 = " "
              A_Other_Exam_6->Other_Accession_6 = " "
          endif
     endif
;other exam 7
     if (size(data->req[req_ndx]->other_exams,5) > 6)
          if (size(trim(data->req[req_ndx]->other_exams[7]->
                                catalog_mnemonic)) > 0)
              A_Other_Exam_7->Other_Name_7 = data->req[req_ndx]
                                ->other_exams[7]->catalog_mnemonic
              A_Other_Exam_7->Other_Accession_7 = FormatAccession(data->req[req_ndx]
                                  ->other_exams[7]->accession)
          else
              A_Other_Exam_7->Other_Name_7 = " "
              A_Other_Exam_7->Other_Accession_7 = " "
          endif
     endif
;other exam 8
     if (size(data->req[req_ndx]->other_exams,5) > 7)
          if (size(trim(data->req[req_ndx]->other_exams[8]->
                                catalog_mnemonic)) > 0)
              A_Other_Exam_8->Other_Name_8 = data->req[req_ndx]
                                ->other_exams[8]->catalog_mnemonic
              A_Other_Exam_8->Other_Accession_8 = FormatAccession(data->req[req_ndx]
                                  ->other_exams[8]->accession)
          else
              A_Other_Exam_8->Other_Name_8 = " "
              A_Other_Exam_8->Other_Accession_8 = " "
          endif
     endif
;other exam 9
     if (size(data->req[req_ndx]->other_exams,5) > 8)
          if (size(trim(data->req[req_ndx]->other_exams[9]->
                                catalog_mnemonic)) > 0)
              A_Other_Exam_9->Other_Name_9 = data->req[req_ndx]
                                ->other_exams[9]->catalog_mnemonic
              A_Other_Exam_9->Other_Accession_9 = FormatAccession(data->req[req_ndx]
                                  ->other_exams[9]->accession)
          else
              A_Other_Exam_9->Other_Name_9 = " "
              A_Other_Exam_9->Other_Accession_9 = " "
          endif
     endif
;other exam 10
     if (size(data->req[req_ndx]->other_exams,5) > 9)
          if (size(trim(data->req[req_ndx]->other_exams[10]->
                                catalog_mnemonic)) > 0)
              A_Other_Exam_10->Other_Name_10 = data->req[req_ndx]
                                ->other_exams[10]->catalog_mnemonic
              A_Other_Exam_10->Other_Accession_10 = FormatAccession(data->req[req_ndx]
                                  ->other_exams[10]->accession)
          else
              A_Other_Exam_10->Other_Name_10 = " "
              A_Other_Exam_10->Other_Accession_10 = " "
          endif
     endif
 


