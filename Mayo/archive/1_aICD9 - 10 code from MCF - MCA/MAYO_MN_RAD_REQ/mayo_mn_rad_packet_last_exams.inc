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
 
        Source file name:       rad_packet_last_exam.inc
        Object name:            n/a
        Request #:              multiple
 
        Product:                GARPP
        Product Team:           Radnet
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        get last exam info
 
        Tables read:            none
 
        Tables updated:         none
        Executing from:         ?
 
        Special Notes:          ?
 
******************************************************************************/
 
 
;****************************************************************************
;*                      GENERATED MODIFICATION CONTROL LOG                  *
;****************************************************************************
;*Mod Date     Feature  Engineer    Comment                                 *
;*--- -------- ------- -------------------- ------------------------------- *
;*### 07/29/04          Cheryl Fay  Initial Release                         *
;*001 01/30/06  78417   jb010592    Rewrote. Removed select, using data     *
;*                                   record instead.                        *
;*002 09/22/06  109567  jb010592    Refactored name of "all" record         *
;*                                   structure                              *
;****************************************************************************
 
call echo("*****START OF LAST EXAMS*****")

declare GetAllFac(null) = null ;001
declare GetOneFac(null) = null ;001
declare GetLibGrp(null) = null ;001
declare GetActSubType(null) = null ;001
declare count = i4 ;001
declare stat = i4 ;001
declare p = i4 ;001 
declare r = i4 ;001
declare y = i4 ;001
 
;record structure that holds last exams for all facilities
free record all_facs        ;002
record all_facs             ;002
( 1 last_exam[*]
    2 Exam_Name = vc
    2 Request_Date_Time = dq8
    2 Complete_Date_Time = dq8
    2 Transcribe_Date_Time = dq8
    2 Final_Date_Time = dq8
    2 Accession = c20
    2 Facility_Display = vc
    2 Facility_Description = vc
    2 Completing_Location_Display = vc
    2 Completing_Location_Description = vc
    2 Image_Class_Type_Display = vc
    2 Image_Class_Type_Description = vc
    2 Exam_Status = vc
)
 
;record structure that holds last exams for patient's current facility
free record fac     ;001
record fac
( 1 last_exam[*]
    2 Exam_Name = vc
    2 Request_Date_Time = dq8
    2 Complete_Date_Time = dq8
    2 Transcribe_Date_Time = dq8
    2 Final_Date_Time = dq8
    2 Accession = c20
    2 Facility_Display = vc
    2 Facility_Description = vc
    2 Completing_Location_Display = vc
    2 Completing_Location_Description = vc
    2 Image_Class_Type_Display = vc
    2 Image_Class_Type_Description = vc
    2 Exam_Status = vc
)
 
;record structure that holds last exams by library group
free record lib     ;001
record lib
( 1 last_exam[*]
    2 Exam_Name = vc
    2 Request_Date_Time = dq8
    2 Complete_Date_Time = dq8
    2 Transcribe_Date_Time = dq8
    2 Final_Date_Time = dq8
    2 Accession = c20
    2 Facility_Display = vc
    2 Facility_Description = vc
    2 Completing_Location_Display = vc
    2 Completing_Location_Description = vc
    2 Image_Class_Type_Display = vc
    2 Image_Class_Type_Description = vc
    2 Exam_Status = vc
)
 
 
;record structure that holds last exams by activity subtype cd
free record act     ;001
record act
( 1 last_exam[*]
    2 Exam_Name = vc
    2 Request_Date_Time = dq8
    2 Complete_Date_Time = dq8
    2 Transcribe_Date_Time = dq8
    2 Final_Date_Time = dq8
    2 Accession = c20
    2 Facility_Display = vc
    2 Facility_Description = vc
    2 Completing_Location_Display = vc
    2 Completing_Location_Description = vc
    2 Image_Class_Type_Display = vc
    2 Image_Class_Type_Description = vc
    2 Exam_Status = vc
)

/***********************************
          MAIN
***********************************/
;001 call GetBase(null)
call GetAllFac(null)
call GetOneFac(null)
call GetLibGrp(null)
call GetActSubType(null)
 
 
/****************************
       SUBROUTINES
****************************/


;********************GetLibGrp********************
 
subroutine GetLibGrp(null)
; retrieving from get_info2 not from base record structure
 
set count = 0
 
for(p = 1 to size(data->req[req_ndx]->sections[sect_ndx]->exam_data,5))
  for(r = 1 to size(data->req[req_ndx]->sections[sect_ndx]->exam_data[p]->for_this_page,5))
    for (y = 1 to size(data->req[req_ndx]->last_exams,5))
      if(data->req[req_ndx]->last_exams[y].library_group_cd  =
          data->req[req_ndx]->sections[sect_ndx]->exam_data[p]->for_this_page[r].lib_grp_cd)
        set count = count + 1
        if( mod(count,10)=1 )
          set stat = alterlist(lib->last_exam,count+10) 
        endif        
        set lib->last_exam[count].complete_date_time  =
          data->req[req_ndx]->last_exams[y].comp_dt_tm
        set lib->last_exam[count].exam_name =
          data->req[req_ndx]->last_exams[y].catalog_mnemonic
        set lib->last_exam[count].image_class_type_display =
          data->req[req_ndx]->last_exams[y].image_class_type_disp
        set lib->last_exam[count].image_class_type_description =
          data->req[req_ndx]->last_exams[y].image_class_type_desc
        set lib->last_exam[count].completing_location_description =
          data->req[req_ndx]->last_exams[y].complete_locn_desc
        set lib->last_exam[count].completing_location_display =
          data->req[req_ndx]->last_exams[y].complete_locn_disp
        set lib->last_exam[count].facility_display =
          data->req[req_ndx]->last_exams[y].facility_disp
        set lib->last_exam[count].facility_description =
          data->req[req_ndx]->last_exams[y].facility_desc
        set lib->last_exam[count].accession =
          data->req[req_ndx]->last_exams[y].accession
        set lib->last_exam[count].transcribe_date_time =
          data->req[req_ndx]->last_exams[y].transcribe_dt_tm
        set lib->last_exam[count].final_date_time =
          data->req[req_ndx]->last_exams[y].final_dt_tm
        set lib->last_exam[count].request_date_time =
          data->req[req_ndx]->last_exams[y].request_dt_tm
        set lib->last_exam[count].exam_status =
          data->req[req_ndx]->last_exams[y].exam_status_disp
      endif
    endfor
  endfor
endfor
set stat = alterlist(lib->last_exam,count)
;call echorecord(lib)
end ;GetLibGrp

 
 
;*******************GetAllFac**************************
 
subroutine GetAllFac(null)
set count = 0

for(y = 1 to size(data->req[req_ndx]->last_exams,5))
  set count = count + 1
  if( mod(count,10)=1 )
    set stat = alterlist(all_facs->last_exam,count+10) 
  endif          
  set all_facs->last_exam[y].complete_date_time  =
    data->req[req_ndx]->last_exams[y].comp_dt_tm
  set all_facs->last_exam[y].exam_name =
    data->req[req_ndx]->last_exams[y].catalog_mnemonic
  set all_facs->last_exam[y].image_class_type_display =
    data->req[req_ndx]->last_exams[y].image_class_type_disp
  set all_facs->last_exam[y].image_class_type_description =
    data->req[req_ndx]->last_exams[y].image_class_type_desc
  set all_facs->last_exam[y].completing_location_description =
    data->req[req_ndx]->last_exams[y].complete_locn_desc
  set all_facs->last_exam[y].completing_location_display =
    data->req[req_ndx]->last_exams[y].complete_locn_disp
  set all_facs->last_exam[y].facility_display =
    data->req[req_ndx]->last_exams[y].facility_disp
  set all_facs->last_exam[y].facility_description =
    data->req[req_ndx]->last_exams[y].facility_desc
  set all_facs->last_exam[y].accession =
    data->req[req_ndx]->last_exams[y].accession
  set all_facs->last_exam[y].transcribe_date_time =
    data->req[req_ndx]->last_exams[y].transcribe_dt_tm
  set all_facs->last_exam[y].final_date_time =
    data->req[req_ndx]->last_exams[y].final_dt_tm
  set all_facs->last_exam[y].request_date_time =
    data->req[req_ndx]->last_exams[y].request_dt_tm
  set all_facs->last_exam[y].exam_status =
    data->req[req_ndx]->last_exams[y].exam_status_disp
endfor
set stat = alterlist(all_facs->last_exam, count)
;call echorecord(all_facs)
end  ;GetAllFac(null)
 
 
;***************GetOneFac***************************
 
subroutine GetOneFac(null)
 
set count = 0
 
for (y = 1 to size(data->req[req_ndx]->last_exams,5))
  if(data->req[req_ndx]->last_exams[y].facility_cd = data->req[req_ndx]->patient_data->facility_cd)
    set count = count + 1
    if( mod(count,10)=1 )
      set stat = alterlist(fac->last_exam,count+10) 
    endif        
    set fac->last_exam[count].complete_date_time  =
      data->req[req_ndx]->last_exams[y].comp_dt_tm
    set fac->last_exam[count].exam_name =
      data->req[req_ndx]->last_exams[y].catalog_mnemonic
    set fac->last_exam[count].image_class_type_display =
      data->req[req_ndx]->last_exams[y].image_class_type_disp
    set fac->last_exam[count].image_class_type_description =
      data->req[req_ndx]->last_exams[y].image_class_type_desc
    set fac->last_exam[count].completing_location_description =
      data->req[req_ndx]->last_exams[y].complete_locn_desc
    set fac->last_exam[count].completing_location_display =
      data->req[req_ndx]->last_exams[y].complete_locn_disp
    set fac->last_exam[count].facility_display =
      data->req[req_ndx]->last_exams[y].facility_disp
    set fac->last_exam[count].facility_description =
      data->req[req_ndx]->last_exams[y].facility_desc
    set fac->last_exam[count].accession =
      data->req[req_ndx]->last_exams[y].accession
    set fac->last_exam[count].transcribe_date_time =
      data->req[req_ndx]->last_exams[y].transcribe_dt_tm
    set fac->last_exam[count].final_date_time =
      data->req[req_ndx]->last_exams[y].final_dt_tm
    set fac->last_exam[count].request_date_time =
      data->req[req_ndx]->last_exams[y].request_dt_tm
    set fac->last_exam[count].exam_status =
      data->req[req_ndx]->last_exams[y].exam_status_disp
  endif
endfor
set stat = alterlist(fac->last_exam,count)
;call echorecord(fac)
end ; GetOneFac
 
 
;******************GetActSubType***************************
 
subroutine GetActSubType(null)
 
set count = 0
  
for(p = 1 to size(data->req[req_ndx]->sections[sect_ndx]->exam_data,5))
  for(r = 1 to size(data->req[req_ndx]->sections[sect_ndx]->exam_data[p]->for_this_page,5))
    for (y = 1 to size(data->req[req_ndx]->last_exams,5))
      if(data->req[req_ndx]->last_exams[y].activity_subtype_cd  =
          data->req[req_ndx]->sections[sect_ndx]->exam_data[p]->for_this_page[r].activity_subtype_cd)
        set count = count + 1
        if( mod(count,10)=1 )
      set stat = alterlist(act->last_exam,count+10) 
    endif        
        set act->last_exam[count].complete_date_time  =
          data->req[req_ndx]->last_exams[y].comp_dt_tm
        set act->last_exam[count].exam_name =
          data->req[req_ndx]->last_exams[y].catalog_mnemonic
        set act->last_exam[count].image_class_type_display =
          data->req[req_ndx]->last_exams[y].image_class_type_disp
        set act->last_exam[count].image_class_type_description =
          data->req[req_ndx]->last_exams[y].image_class_type_desc
        set act->last_exam[count].completing_location_description =
          data->req[req_ndx]->last_exams[y].complete_locn_desc
        set act->last_exam[count].completing_location_display =
          data->req[req_ndx]->last_exams[y].complete_locn_disp
        set act->last_exam[count].facility_display =
          data->req[req_ndx]->last_exams[y].facility_disp
        set act->last_exam[count].facility_description =
          data->req[req_ndx]->last_exams[y].facility_desc
        set act->last_exam[count].accession =
          data->req[req_ndx]->last_exams[y].accession
        set act->last_exam[count].transcribe_date_time =
          data->req[req_ndx]->last_exams[y].transcribe_dt_tm
        set act->last_exam[count].final_date_time =
          data->req[req_ndx]->last_exams[y].final_dt_tm
        set act->last_exam[count].request_date_time =
          data->req[req_ndx]->last_exams[y].request_dt_tm
        set act->last_exam[count].exam_status =
          data->req[req_ndx]->last_exams[y].exam_status_disp
      endif
    endfor
  endfor
endfor
set stat = alterlist(act->last_exam,count)
;call echorecord(act)
end ;getactsubtype



