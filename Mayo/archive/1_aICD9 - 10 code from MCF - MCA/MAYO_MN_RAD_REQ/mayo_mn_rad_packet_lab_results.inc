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
 
        Source file name:       rad_packet_lab_results.inc
        Object name:            n/a
        Request #:              multiple
 
        Product:                GARPP
        Product Team:           Radnet
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        gather data for retreiving lab results
 
        Tables read:            clinical event
 
        Tables updated:         na
        Executing from:         ?
 
        Special Notes:          ?
 
******************************************************************************/
;~DB~************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *Mod Date     Engineer             Comment                             *
;    *--- -------- -------------------- ----------------------------------- *
;     ### 08/19/03 Tammy Baack/Sandra Prow    Initial Release               *
;     001 03/03/06 Jason Buchanan       Free/rename lab_values record       *
;                                        structure to rad_lab_values        *
;~DE~************************************************************************
 
 
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************
 
 
;*******************************************************
;**           Get Lab Values
;*******************************************************
call echo ("****************START OF LAB RESULTS********************")
 
 
;****************VALUES TO CHANGE*********************
;Add DISPLAY_KEY from CRMCODE32 (code value table) for each
;clinical event data element for the specific lab value you wish
 
;CLINICAL EVENT VALUE 1
;example:
;set lab1a = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"CREATININE")
;set lab1b = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"CREAT")
 
declare lab1a = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"BUN"))
declare lab1b = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY2"))
declare lab1c = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY3"))
declare lab1d = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY4"))
declare lab1e = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY5"))
;How many days do you want to look back for this lab result?
declare lab1time = i4 with public, noconstant(90);<<---CHANGE THE 90 TO THE NUMBER OF DAYS
;(THIS WILL CAUSE THE PROGRAM TO DISPLAY RESULTS NEWER THAN 90 DAYS)
 
 call echo (build("lab 1a---->", lab1a))
;CLINICAL EVENT VALUE 2
declare lab2a = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"CREATININE"))
declare lab2b = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY2"))
declare lab2c = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY3"))
declare lab2d = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY4"))
declare lab2e = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY5"))
;How many days do you want to look back for this lab result?
declare lab2time = i4 with public, noconstant(90)
 
;CLINICAL EVENT VALUE 3
declare lab3a = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"EGFRMDRD"))
declare lab3b = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY2"))
declare lab3c = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY3"))
declare lab3d = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY4"))
declare lab3e = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY5"))
;How many days do you want to look back for this lab result?
declare lab3time = i4 with public, noconstant(90)
 
;CLINICAL EVENT VALUE 4
declare lab4a = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"PTT"))
declare lab4b = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY2"))
declare lab4c = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY3"))
declare lab4d = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY4"))
declare lab4e = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY5"))
;How many days do you want to look back for this lab result?
declare lab4time = i4 with public, noconstant(90)
 
;CLINICAL EVENT VALUE 5
declare lab5a = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"INR"))
declare lab5b = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY2"))
declare lab5c = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY3"))
declare lab5d = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY4"))
declare lab5e = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY5"))
;How many days do you want to look back for this lab result?
declare lab5time = i4 with public, noconstant(90)
 
;CLINICAL EVENT VALUE 6
declare lab6a = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"PT"))
declare lab6b = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"POCPROTIME"))
declare lab6c = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY3"))
declare lab6d = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY4"))
declare lab6e = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY5"))
;How many days do you want to look back for this lab result?
declare lab6time = i4 with public, noconstant(90)
 
;CLINICAL EVENT VALUE 7
declare lab7a = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"PLATELETS"))
declare lab7b = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"PLATELET"))
declare lab7c = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY3"))
declare lab7d = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY4"))
declare lab7e = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY5"))
;How many days do you want to look back for this lab result?
declare lab7time = i4 with public, noconstant(90)
 
;CLINICAL EVENT VALUE 8
declare lab8a = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"BETAHCG"))
declare lab8b = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"BETAHCGQNT"))
declare lab8c = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"HCGMAYO"))
declare lab8d = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"UBETAHCGQL"))
declare lab8e = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY5"))
;How many days do you want to look back for this lab result?
declare lab8time = i4 with public, noconstant(90)
 
;CLINICAL EVENT VALUE 9
declare lab9a = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"EGFRAFRICANAMERICANMDRD"))
declare lab9b = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY2"))
declare lab9c = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY3"))
declare lab9d = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY4"))
declare lab9e = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY5"))
;How many days do you want to look back for this lab result?
declare lab9time = i4 with public, noconstant(90)
 
;CLINICAL EVENT VALUE 10
declare lab10a = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY1"))
declare lab10b = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY2"))
declare lab10c = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY3"))
declare lab10d = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY4"))
declare lab10e = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY5"))
;How many days do you want to look back for this lab result?
declare lab10time = i4 with public, noconstant(90)
 
;CLINICAL EVENT VALUE 11
declare lab11a = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY1"))
declare lab11b = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY2"))
declare lab11c = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY3"))
declare lab11d = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY4"))
declare lab11e = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY5"))
;How many days do you want to look back for this lab result?
declare lab11time = i4 with public, noconstant(90)
 
;CLINICAL EVENT VALUE 12
declare lab12a = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY1"))
declare lab12b = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY2"))
declare lab12c = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY3"))
declare lab12d = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY4"))
declare lab12e = f8 with public, noconstant(uar_get_code_by("DISPLAY_KEY",72,"LABDISPLAYKEY5"))
;How many days do you want to look back for this lab result?
declare lab12time = i4 with public, noconstant(90)
 
 
;******************************************************************
;****              DO NOT CHANGE ANYTHING BELOW                 ***
;******************************************************************
 
 
;***The script will fill this array with the latest lab values
;***Make sure to size this array to at least the size of the lookup array
free record rad_lab_values ;001
;001 record lab_values
record rad_lab_values ;001
( 1 lab_exams[12]
    2 clinical_event_id  = f8
    2 person_id          = f8
    2 results_status_cd  = f8
    2 result_val         = vc
    2 perform_dt_tm      = dq8
    2 result_status_cd   = f8
    2 event_title_text   = vc
    2 result_units       = vc
    2 lab_name           = vc
    2 norm_range         = vc
    2 lab_normal_low     = vc
    2 lab_normal_high    = vc
    )
 
 
call echo ("-+-+-+-+-+-+-+ START OF LAB STATUS CODES -+-+-+-+-+-")
 
;******************************************************************
;****DO NOT CHANGE ANYTHING IN THIS SECTION***
;******************************************************************
 
;**********GET RESULT STATUS CODES**************
 
declare result_status_authenticated_cd = f8 with public,
     noconstant(uar_get_code_by( "MEANING", 8, "AUTH"))
 
declare result_status_modified_cd = f8 with public,
     noconstant(uar_get_code_by( "MEANING", 8, "MODIFIED"))
 
declare result_status_altered_cd = f8 with public,
     noconstant(uar_get_code_by( "MEANING", 8, "ALTERED"))
 
;*********GET DISPLAY KEYS***********************************************
 
call echo ("-+-+-+-+-+-+ BEGIN LAB CODE +-+-+-+-+-+-")
 
select into "nl:"
       ce.clinical_event_id,
       ce.person_id,
       ce.result_status_cd,
       ce.result_val,
       ce.performed_dt_tm,
       ce.event_title_text,
       ce.normal_low,
       ce.normal_high,
       result_units = UAR_GET_CODE_DISPLAY(ce.result_units_cd),
       lab_name = UAR_GET_CODE_DISPLAY(ce.event_cd)
 
from   clinical_event ce
 
where ce.person_id = data->req[req_ndx]->patient_data->person_id
     and ce.event_cd in (lab1a, lab1b, lab1c, lab1d, lab1e,
                         lab2a, lab2b, lab2c, lab2d, lab2e,
                         lab3a, lab3b, lab3c, lab3d, lab3e,
                         lab4a, lab4b, lab4c, lab4d, lab4e,
                         lab5a, lab5b, lab5c, lab5d, lab5e,
                         lab6a, lab6b, lab6c, lab6d, lab6e,
                         lab7a, lab7b, lab7c, lab7d, lab7e,
                         lab8a, lab8b, lab8c, lab8d, lab8e,
                         lab9a, lab9b, lab9c, lab9d, lab9e,
                         lab10a, lab10b, lab10c, lab10d, lab10e,
                         lab11a, lab11b, lab11c, lab11d, lab11e,
                         lab12a, lab12b, lab12c, lab12d, lab12e)
 
     and ce.result_status_cd in (result_status_authenticated_cd,
                                 result_status_modified_cd,
                                 result_status_altered_cd)
      and ce.valid_until_dt_tm > cnvtdatetime(curdate, curtime3)
      and ce.valid_from_dt_tm < cnvtdatetime(curdate, curtime3)
 
 
order by ce.performed_dt_tm desc
 
detail
 
if (ce.event_cd in (lab1a, lab1b, lab1c, lab1d, lab1e))
lab1 = ce.event_cd
elseif (ce.event_cd in (lab2a, lab2b, lab2c, lab2d, lab2e))
lab2 = ce.event_cd
elseif (ce.event_cd in (lab3a, lab3b, lab3c, lab3d, lab3e))
lab3 = ce.event_cd
elseif (ce.event_cd in (lab4a, lab4b, lab4c, lab4d, lab4e))
lab4 = ce.event_cd
elseif (ce.event_cd in (lab4a, lab4b, lab4c, lab4d, lab4e))
lab4 = ce.event_cd
elseif (ce.event_cd in (lab5a, lab5b, lab5c, lab5d, lab5e))
lab5 = ce.event_cd
elseif (ce.event_cd in (lab6a, lab6b, lab6c, lab6d, lab6e))
lab6 = ce.event_cd
elseif (ce.event_cd in (lab7a, lab7b, lab7c, lab7d, lab7e))
lab7 = ce.event_cd
elseif (ce.event_cd in (lab8a, lab8b, lab8c, lab8d, lab8e))
lab8 = ce.event_cd
elseif (ce.event_cd in (lab9a, lab9b, lab9c, lab9d, lab9e))
lab9 = ce.event_cd
elseif (ce.event_cd in (lab10a, lab10b, lab10c, lab10d, lab10e))
lab10 = ce.event_cd
elseif (ce.event_cd in (lab11a, lab11b, lab11c, lab11d, lab11e))
lab11 = ce.event_cd
elseif (ce.event_cd in (lab12a, lab12b, lab12c, lab12d, lab12e))
lab12 = ce.event_cd
endif
 
case (ce.event_cd)
    of lab1:
if (ce.performed_dt_tm > 0)
        if( (datetimecmp(cnvtdatetime(curdate,curtime3),ce.performed_dt_tm)
                                         <= lab1time)
;001 BEGIN renaming of lab_values to rad_lab_values
        and (ce.performed_dt_tm > rad_lab_values->lab_exams[1]->perform_dt_tm))
            rad_lab_values->lab_exams[1]->clinical_event_id =ce.clinical_event_id,
            rad_lab_values->lab_exams[1]->perform_dt_tm = ce.performed_dt_tm,
            rad_lab_values->lab_exams[1]->result_status_cd = ce.result_status_cd,
            rad_lab_values->lab_exams[1]->result_val= ce.result_val,
            rad_lab_values->lab_exams[1]->clinical_event_id =ce.clinical_event_id,
            rad_lab_values->lab_exams[1]->perform_dt_tm = ce.performed_dt_tm,
            rad_lab_values->lab_exams[1]->result_status_cd = ce.result_status_cd,
            rad_lab_values->lab_exams[1]->result_val= ce.result_val
            rad_lab_values->lab_exams[1]->event_title_text = ce.event_title_text
            rad_lab_values->lab_exams[1]->result_units = result_units
            rad_lab_values->lab_exams[1]->lab_name = lab_name
            if (size(ce.normal_low) > 0)
                rad_lab_values->lab_exams[1]->norm_range =
                        build("(",ce.normal_low, "-", ce.normal_high,")")
            else
                rad_lab_values->lab_exams[1]->norm_range = ""
            endif
        endif
;001 END renaming of lab_values to rad_lab_values
endif
 
of lab2:
if (ce.performed_dt_tm > 0)
        if( (datetimecmp(cnvtdatetime(curdate,curtime3),ce.performed_dt_tm)
                                         <= lab2time)
;001 BEGIN renaming of lab_values to rad_lab_values
        and (ce.performed_dt_tm > rad_lab_values->lab_exams[2]->perform_dt_tm))
            rad_lab_values->lab_exams[2]->clinical_event_id =ce.clinical_event_id,
            rad_lab_values->lab_exams[2]->perform_dt_tm = ce.performed_dt_tm,
            rad_lab_values->lab_exams[2]->result_status_cd = ce.result_status_cd,
            rad_lab_values->lab_exams[2]->result_val= ce.result_val,
 
            rad_lab_values->lab_exams[2]->clinical_event_id =ce.clinical_event_id,
            rad_lab_values->lab_exams[2]->perform_dt_tm = ce.performed_dt_tm,
            rad_lab_values->lab_exams[2]->result_status_cd = ce.result_status_cd,
            rad_lab_values->lab_exams[2]->result_val= ce.result_val
            rad_lab_values->lab_exams[2]->event_title_text = ce.event_title_text
            rad_lab_values->lab_exams[2]->result_units = result_units
            rad_lab_values->lab_exams[2]->lab_name = lab_name
            if (size(ce.normal_low) > 0)
                rad_lab_values->lab_exams[2]->norm_range =
                        build("(",ce.normal_low, "-", ce.normal_high,")")
            else
                rad_lab_values->lab_exams[2]->norm_range = ""
            endif
        endif
;001 END renaming of lab_values to rad_lab_values
endif
 
of  lab3:
if (ce.performed_dt_tm > 0)
    if( (datetimecmp(cnvtdatetime(curdate,curtime3),ce.performed_dt_tm)
                                        <= lab3time)
;001 BEGIN renaming of lab_values to rad_lab_values
        and (ce.performed_dt_tm > rad_lab_values->lab_exams[3]->perform_dt_tm))
            rad_lab_values->lab_exams[3]->clinical_event_id =ce.clinical_event_id,
            rad_lab_values->lab_exams[3]->perform_dt_tm = ce.performed_dt_tm,
            rad_lab_values->lab_exams[3]->result_status_cd = ce.result_status_cd,
            rad_lab_values->lab_exams[3]->result_val= ce.result_val,
            rad_lab_values->lab_exams[3]->clinical_event_id =ce.clinical_event_id,
            rad_lab_values->lab_exams[3]->perform_dt_tm = ce.performed_dt_tm,
            rad_lab_values->lab_exams[3]->result_status_cd = ce.result_status_cd,
            rad_lab_values->lab_exams[3]->result_val= ce.result_val
            rad_lab_values->lab_exams[3]->event_title_text = ce.event_title_text
            rad_lab_values->lab_exams[3]->result_units = result_units
            rad_lab_values->lab_exams[3]->lab_name = lab_name
            if (size(ce.normal_low) > 0)
                rad_lab_values->lab_exams[3]->norm_range =
                        build("(",ce.normal_low, "-", ce.normal_high,")")
            else
                rad_lab_values->lab_exams[3]->norm_range = ""
            endif
        endif
;001 END renaming of lab_values to rad_lab_values
endif
of lab4:
if (ce.performed_dt_tm > 0)
    if( (datetimecmp(cnvtdatetime(curdate,curtime3),ce.performed_dt_tm)
                                                       <= lab4time)
;001 BEGIN renaming of lab_values to rad_lab_values
    and (ce.performed_dt_tm > rad_lab_values->lab_exams[4]->perform_dt_tm))
            rad_lab_values->lab_exams[4]->clinical_event_id =ce.clinical_event_id,
            rad_lab_values->lab_exams[4]->perform_dt_tm = ce.performed_dt_tm,
            rad_lab_values->lab_exams[4]->result_status_cd = ce.result_status_cd,
            rad_lab_values->lab_exams[4]->result_val= ce.result_val,
 
            rad_lab_values->lab_exams[4]->clinical_event_id =ce.clinical_event_id,
            rad_lab_values->lab_exams[4]->perform_dt_tm = ce.performed_dt_tm,
            rad_lab_values->lab_exams[4]->result_status_cd = ce.result_status_cd,
            rad_lab_values->lab_exams[4]->result_val= ce.result_val
            rad_lab_values->lab_exams[4]->event_title_text = ce.event_title_text
            rad_lab_values->lab_exams[4]->result_units = result_units
            rad_lab_values->lab_exams[4]->lab_name = lab_name
            if (size(ce.normal_low) > 0)
                rad_lab_values->lab_exams[4]->norm_range =
                        build("(",ce.normal_low, "-", ce.normal_high,")")
            else
                rad_lab_values->lab_exams[4]->norm_range = ""
            endif
        endif
;001 END renaming of lab_values to rad_lab_values
endif
of lab5:
if (ce.performed_dt_tm > 0)
    if( (datetimecmp(cnvtdatetime(curdate,curtime3),ce.performed_dt_tm)
                                                           <= lab5time)
;001 BEGIN renaming of lab_values to rad_lab_values
        and (ce.performed_dt_tm > rad_lab_values->lab_exams[5]->perform_dt_tm))
                        rad_lab_values->lab_exams[5]->clinical_event_id =ce.clinical_event_id,
            rad_lab_values->lab_exams[5]->perform_dt_tm = ce.performed_dt_tm,
            rad_lab_values->lab_exams[5]->result_status_cd = ce.result_status_cd,
            rad_lab_values->lab_exams[5]->result_val= ce.result_val,
            rad_lab_values->lab_exams[5]->clinical_event_id =ce.clinical_event_id,
            rad_lab_values->lab_exams[5]->perform_dt_tm = ce.performed_dt_tm,
            rad_lab_values->lab_exams[5]->result_status_cd = ce.result_status_cd,
            rad_lab_values->lab_exams[5]->result_val= ce.result_val
            rad_lab_values->lab_exams[5]->event_title_text = ce.event_title_text
            rad_lab_values->lab_exams[5]->result_units = result_units
            rad_lab_values->lab_exams[5]->lab_name = lab_name
            if (size(ce.normal_low) > 0)
                rad_lab_values->lab_exams[5]->norm_range =
                        build("(",ce.normal_low, "-", ce.normal_high,")")
            else
                rad_lab_values->lab_exams[5]->norm_range = ""
            endif
        endif
;001 END renaming of lab_values to rad_lab_values
endif
 of lab6:
 
 if (ce.performed_dt_tm > 0)
    if( (datetimecmp(cnvtdatetime(curdate,curtime3),ce.performed_dt_tm)
                                               <= lab6time)
;001 BEGIN renaming of lab_values to rad_lab_values
        and (ce.performed_dt_tm > rad_lab_values->lab_exams[6]->perform_dt_tm))
            rad_lab_values->lab_exams[6]->clinical_event_id =ce.clinical_event_id,
            rad_lab_values->lab_exams[6]->perform_dt_tm = ce.performed_dt_tm,
            rad_lab_values->lab_exams[6]->result_status_cd = ce.result_status_cd,
            rad_lab_values->lab_exams[6]->result_val= ce.result_val,
            rad_lab_values->lab_exams[6]->clinical_event_id =ce.clinical_event_id,
            rad_lab_values->lab_exams[6]->perform_dt_tm = ce.performed_dt_tm,
            rad_lab_values->lab_exams[6]->result_status_cd = ce.result_status_cd,
            rad_lab_values->lab_exams[6]->result_val= ce.result_val
            rad_lab_values->lab_exams[6]->event_title_text = ce.event_title_text
            rad_lab_values->lab_exams[6]->result_units = result_units
            rad_lab_values->lab_exams[6]->lab_name = lab_name
            if (size(ce.normal_low) > 0)
                rad_lab_values->lab_exams[6]->norm_range =
                        build("(",ce.normal_low, "-", ce.normal_high,")")
            else
                rad_lab_values->lab_exams[6]->norm_range = ""
            endif
        endif
;001 END renaming of lab_values to rad_lab_values
endif
of lab7:
if (ce.performed_dt_tm > 0)
    if( (datetimecmp(cnvtdatetime(curdate,curtime3),ce.performed_dt_tm)
                                               <= lab7time)
;001 BEGIN renaming of lab_values to rad_lab_values
        and (ce.performed_dt_tm > rad_lab_values->lab_exams[7]->perform_dt_tm))
            rad_lab_values->lab_exams[7]->clinical_event_id =ce.clinical_event_id,
            rad_lab_values->lab_exams[7]->perform_dt_tm = ce.performed_dt_tm,
            rad_lab_values->lab_exams[7]->result_status_cd = ce.result_status_cd,
            rad_lab_values->lab_exams[7]->result_val= ce.result_val,
            rad_lab_values->lab_exams[7]->clinical_event_id =ce.clinical_event_id,
            rad_lab_values->lab_exams[7]->perform_dt_tm = ce.performed_dt_tm,
            rad_lab_values->lab_exams[7]->result_status_cd = ce.result_status_cd,
            rad_lab_values->lab_exams[7]->result_val= ce.result_val
            rad_lab_values->lab_exams[7]->event_title_text = ce.event_title_text
            rad_lab_values->lab_exams[7]->result_units = result_units
            rad_lab_values->lab_exams[7]->lab_name = lab_name
            if (size(ce.normal_low) > 0)
                rad_lab_values->lab_exams[7]->norm_range =
                        build("(",ce.normal_low, "-", ce.normal_high,")")
            else
                rad_lab_values->lab_exams[7]->norm_range = ""
            endif
        endif
;001 END renaming of lab_values to rad_lab_values
endif
of lab8:
if (ce.performed_dt_tm > 0)
    if( (datetimecmp(cnvtdatetime(curdate,curtime3),ce.performed_dt_tm)
                               <= lab8time)
;001 BEGIN renaming of lab_values to rad_lab_values
    and (ce.performed_dt_tm > rad_lab_values->lab_exams[8]->perform_dt_tm))
            rad_lab_values->lab_exams[8]->clinical_event_id =ce.clinical_event_id,
            rad_lab_values->lab_exams[8]->perform_dt_tm = ce.performed_dt_tm,
            rad_lab_values->lab_exams[8]->result_status_cd = ce.result_status_cd,
            rad_lab_values->lab_exams[8]->result_val= ce.result_val,
            rad_lab_values->lab_exams[8]->clinical_event_id =ce.clinical_event_id,
            rad_lab_values->lab_exams[8]->perform_dt_tm = ce.performed_dt_tm,
            rad_lab_values->lab_exams[8]->result_status_cd = ce.result_status_cd,
            rad_lab_values->lab_exams[8]->result_val= ce.result_val
            rad_lab_values->lab_exams[8]->event_title_text = ce.event_title_text
            rad_lab_values->lab_exams[8]->result_units = result_units
            rad_lab_values->lab_exams[8]->lab_name = lab_name
            if (size(ce.normal_low) > 0)
                rad_lab_values->lab_exams[8]->norm_range =
                        build("(",ce.normal_low, "-", ce.normal_high,")")
            else
                rad_lab_values->lab_exams[8]->norm_range = ""
            endif
        endif
;001 END renaming of lab_values to rad_lab_values
endif
of lab9:
if (ce.performed_dt_tm > 0)
    if( (datetimecmp(cnvtdatetime(curdate,curtime3),ce.performed_dt_tm)
                                                   <= lab9time)
;001 BEGIN renaming of lab_values to rad_lab_values
    and (ce.performed_dt_tm > rad_lab_values->lab_exams[9]->perform_dt_tm))
            rad_lab_values->lab_exams[9]->clinical_event_id =ce.clinical_event_id,
            rad_lab_values->lab_exams[9]->perform_dt_tm = ce.performed_dt_tm,
            rad_lab_values->lab_exams[9]->result_status_cd = ce.result_status_cd,
            rad_lab_values->lab_exams[9]->result_val= ce.result_val,
            rad_lab_values->lab_exams[9]->clinical_event_id =ce.clinical_event_id,
            rad_lab_values->lab_exams[9]->perform_dt_tm = ce.performed_dt_tm,
            rad_lab_values->lab_exams[9]->result_status_cd = ce.result_status_cd,
            rad_lab_values->lab_exams[9]->result_val= ce.result_val
            rad_lab_values->lab_exams[9]->event_title_text = ce.event_title_text
            rad_lab_values->lab_exams[9]->result_units = result_units
            rad_lab_values->lab_exams[9]->lab_name = lab_name
            if (size(ce.normal_low) > 0)
                rad_lab_values->lab_exams[9]->norm_range =
                        build("(",ce.normal_low, "-", ce.normal_high,")")
            else
                rad_lab_values->lab_exams[9]->norm_range = ""
            endif
        endif
;001 END renaming of lab_values to rad_lab_values
endif
of lab10:
if (ce.performed_dt_tm > 0)
    if( (datetimecmp(cnvtdatetime(curdate,curtime3),ce.performed_dt_tm)
                                                       <= lab10time)
;001 BEGIN renaming of lab_values to rad_lab_values
        and (ce.performed_dt_tm > rad_lab_values->lab_exams[10]->perform_dt_tm))
            rad_lab_values->lab_exams[10]->clinical_event_id =ce.clinical_event_id,
            rad_lab_values->lab_exams[10]->perform_dt_tm = ce.performed_dt_tm,
            rad_lab_values->lab_exams[10]->result_status_cd = ce.result_status_cd,
            rad_lab_values->lab_exams[10]->result_val= ce.result_val,
            rad_lab_values->lab_exams[10]->clinical_event_id =ce.clinical_event_id,
            rad_lab_values->lab_exams[10]->perform_dt_tm = ce.performed_dt_tm,
            rad_lab_values->lab_exams[10]->result_status_cd = ce.result_status_cd,
            rad_lab_values->lab_exams[10]->result_val= ce.result_val
            rad_lab_values->lab_exams[10]->event_title_text = ce.event_title_text
            rad_lab_values->lab_exams[10]->result_units = result_units
            rad_lab_values->lab_exams[10]->lab_name = lab_name
            if (size(ce.normal_low) > 0)
                rad_lab_values->lab_exams[10]->norm_range =
                        build("(",ce.normal_low, "-", ce.normal_high,")")
            else
                rad_lab_values->lab_exams[10]->norm_range = ""
            endif
        endif
;001 END renaming of lab_values to rad_lab_values
endif
of lab11:
if (ce.performed_dt_tm > 0)
    if( (datetimecmp(cnvtdatetime(curdate,curtime3),ce.performed_dt_tm)
                                                      <= lab11time)
;001 BEGIN renaming of lab_values to rad_lab_values
        and (ce.performed_dt_tm > rad_lab_values->lab_exams[11]->perform_dt_tm))
            rad_lab_values->lab_exams[11]->clinical_event_id =ce.clinical_event_id,
            rad_lab_values->lab_exams[11]->perform_dt_tm = ce.performed_dt_tm,
            rad_lab_values->lab_exams[11]->result_status_cd = ce.result_status_cd,
            rad_lab_values->lab_exams[11]->result_val= ce.result_val,
            rad_lab_values->lab_exams[11]->clinical_event_id =ce.clinical_event_id,
            rad_lab_values->lab_exams[11]->perform_dt_tm = ce.performed_dt_tm,
            rad_lab_values->lab_exams[11]->result_status_cd = ce.result_status_cd,
            rad_lab_values->lab_exams[11]->result_val= ce.result_val
            rad_lab_values->lab_exams[11]->event_title_text = ce.event_title_text
            rad_lab_values->lab_exams[11]->result_units = result_units
            rad_lab_values->lab_exams[11]->lab_name = lab_name
            if (size(ce.normal_low) > 0)
                rad_lab_values->lab_exams[11]->norm_range =
                        build("(",ce.normal_low, "-", ce.normal_high,")")
            else
                rad_lab_values->lab_exams[11]->norm_range = ""
            endif
        endif
;001 END renaming of lab_values to rad_lab_values
endif
of lab12:
if (ce.performed_dt_tm > 0)
    if( (datetimecmp(cnvtdatetime(curdate,curtime3),ce.performed_dt_tm)
                                                    <= lab11time)
;001 BEGIN renaming of lab_values to rad_lab_values
    and (ce.performed_dt_tm > rad_lab_values->lab_exams[12]->perform_dt_tm))
            rad_lab_values->lab_exams[12]->clinical_event_id =ce.clinical_event_id,
            rad_lab_values->lab_exams[12]->perform_dt_tm = ce.performed_dt_tm,
            rad_lab_values->lab_exams[12]->result_status_cd = ce.result_status_cd,
            rad_lab_values->lab_exams[12]->result_val= ce.result_val,
            rad_lab_values->lab_exams[12]->clinical_event_id =ce.clinical_event_id,
            rad_lab_values->lab_exams[12]->perform_dt_tm = ce.performed_dt_tm,
            rad_lab_values->lab_exams[12]->result_status_cd = ce.result_status_cd,
            rad_lab_values->lab_exams[12]->result_val= ce.result_val
            rad_lab_values->lab_exams[12]->event_title_text = ce.event_title_text
            rad_lab_values->lab_exams[12]->result_units = result_units
            rad_lab_values->lab_exams[12]->lab_name = lab_name
            if (size(ce.normal_low) > 0)
                rad_lab_values->lab_exams[12]->norm_range =
                        build("(",ce.normal_low, "-", ce.normal_high,")")
            else
                rad_lab_values->lab_exams[12]->norm_range = ""
            endif
        endif
;001 END renaming of lab_values to rad_lab_values
endif
endcase
with nocounter
 
call echo ("***************END LAB QUERIES*****************")
 
;***************************************************************
 
;001 BEGIN renaming of lab_values to rad_lab_values
/*call echo(build("LabValue1:", rad_lab_values->lab_exams[1]->result_val))
call echo(build("LabValue2:", rad_lab_values->lab_exams[2]->result_val))
call echo(build("LabValue3:", rad_lab_values->lab_exams[3]->result_val))
call echo(build("LabValue4:", rad_lab_values->lab_exams[4]->result_val))
call echo(build("LabValue5:", rad_lab_values->lab_exams[5]->result_val))
call echo(build("LabValue6:", rad_lab_values->lab_exams[6]->result_val))
call echo(build("LabValue7:", rad_lab_values->lab_exams[7]->result_val))
call echo(build("LabValue8:", rad_lab_values->lab_exams[8]->result_val))
call echo(build("LabValue8 range:", rad_lab_values->lab_exams[8]->norm_range))
call echo(build("LabValue9:", rad_lab_values->lab_exams[9]->result_val))
call echo(build("LabValue10:", rad_lab_values->lab_exams[10]->result_val))
call echo(build("LabValue11:", rad_lab_values->lab_exams[11]->result_val))
call echo(build("LabValue12:", rad_lab_values->lab_exams[12]->result_val))*/
;001 END renaming of lab_values to rad_lab_values
 

