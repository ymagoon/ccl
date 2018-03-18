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
 
        Source file name:       rad_packet_req.prg
        Object name:            radpacketreq
        Request #:              multiple
 
        Product:                GARPP
        Product Team:           Radnet
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        gather information for printing programs
 
        Tables read:            many
 
        Tables updated:         none
        Executing from:         ?
 
        Special Notes:          ?
 
******************************************************************************/
;~DB~************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *Mod Date     Engineer             Feature Comment                             *
;    *--- -------- -------------------- ------- --------------------------- *
;     ### 08/19/04 Tammy Baack/Sandra Prow    	Initial Release               *
;	  001 04/10/06 Sean Turk			78168	CR 1-577563874 code to re-initialize ICD9
;~DE~************************************************************************
 
 
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************
 
 
drop program mayo_mn_rad_req:dba go
create program mayo_mn_rad_req:dba
 
%i mhs_prg:mayo_mn_rad_packet_subs.inc
 
set req_ndx = value($1),
set sect_ndx = value($2),
set print_sub = value($3)
 
execute reportrtl
/**************************************************************
Query includes
**************************************************************/
;***ADD DISPLAY KEYS FROM CLINICAL EVENT TO THIS FILE
%i mhs_prg:mayo_mn_rad_packet_lab_results.inc
 
;***ADD OE_FIELD_NAMES AND OE_FIELD_IDS FROM ORDER_DETAIL TO THIS FILE
%i mhs_prg:mayo_mn_rad_packet_detail.inc
 
;***DO NOT CHANGE ANYTHING BELOW
%i mhs_prg:mayo_mn_rad_packet_allergy.inc
;%i /mayo/mhprd/ccl/rad_packet_cdm.inc
;%i /mayo/mhprd/ccl/rad_packet_cpt4_codes.inc
%i mhs_prg:mayo_mn_rad_packet_icd9_codes.inc
%i mhs_prg:mayo_mn_rad_packet_last_exams.inc
%i mhs_prg:mayo_mn_rad_packet_modify_status.inc
 
/**************************************************************
Report Record Structures
**************************************************************/
 
;***DO NOT CHANGE ANYTHING BELOW
%i mhs_prg:mayo_mn_rad_packet_addresses_record.inc
%i mhs_prg:mayo_mn_rad_packet_allergy_record.inc
;%i /mayo/mhprd/ccl/rad_packet_cdm_record.inc
;%i /mayo/mhprd/ccl/rad_packet_cpt4_codes_record.inc
%i mhs_prg:mayo_mn_rad_packet_detail_record.inc
%i mhs_prg:mayo_mn_rad_packet_exam_record.inc
%i mhs_prg:mayo_mn_rad_packet_icd9_codes_record.inc
%i mhs_prg:mayo_mn_rad_packet_lab_results_record.inc
%i mhs_prg:mayo_mn_rad_packet_last_exams_record.inc
%i mhs_prg:mayo_mn_rad_packet_modify_record.inc
%i mhs_prg:mayo_mn_rad_packet_other_exams_record.inc
%i mhs_prg:mayo_mn_rad_packet_pacs_id_record.inc
%i mhs_prg:mayo_mn_rad_packet_patient_record.inc
%i mhs_prg:mayo_mn_rad_packet_physician_record.inc
 
/*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+
Site specific records
*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*/
 
;***Change this file to add to the site specific record structure
 
%i mhs_prg:mayo_mn_rad_packet_site_specific_record.inc
/**************************************************************
Layout
**************************************************************/
 
;%i /mayo/mhprd/ccl/rad_packet_req.dvl
%i mhs_prg:mayo_mn_rad_req.dvl
 
/**************************************************************
Report Body
**************************************************************/
for (x=1 to size(data->req[req_ndx]->sections[sect_ndx]->exam_data,5))
 
set order_id = cnvtstring(data->req[req_ndx]->sections[sect_ndx]->exam_data[x]
                ->for_this_page[1]->order_id)
 
 
set tempdir = "cer_temp:radreq"
 
if ((validate( _outfile,"1")!= "1"))
    set tempfile = _outfile
else
    set tempfile = concat(tempdir, "_",
                   trim(cnvtstring(curtime3)),
                   "_",trim(order_id), ".dat")
endif
 
call echo(value(tempfile))
 
call InitializeReport(0)
 
declare stat = i4 with noconstant(0)
 
select into "nl:"
 
detail
call echo("DETAIL")
for(exam_ndx = 1 to size(data->req[req_ndx]
                 ->sections[sect_ndx]->exam_data[x]->for_this_page,5)
          by data->req[req_ndx]->sections[sect_ndx]->nbr_of_exams_per_req)
 
 
/*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+
Data Set includes
*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*/
;***DO NOT CHANGE ANYTHING BELOW
 
%i mhs_prg:mayo_mn_rad_packet_addresses_data.inc
%i mhs_prg:mayo_mn_rad_packet_allergy_data.inc
;%i /mayo/mhprd/ccl/rad_packet_cdm_data.inc
;%i /mayo/mhprd/ccl/rad_packet_cpt4_codes_data.inc
%i mhs_prg:mayo_mn_rad_packet_detail_data.inc
%i mhs_prg:mayo_mn_rad_packet_exam_data.inc
%i mhs_prg:mayo_mn_rad_packet_icd9_codes_data.inc
%i mhs_prg:mayo_mn_rad_packet_lab_results_data.inc
%i mhs_prg:mayo_mn_rad_packet_last_exams_data.inc
%i mhs_prg:mayo_mn_rad_packet_modify_data.inc
%i mhs_prg:mayo_mn_rad_packet_other_exams_data.inc
%i mhs_prg:mayo_mn_rad_packet_pacs_id_data.inc
%i mhs_prg:mayo_mn_rad_packet_patient_data.inc
%i mhs_prg:mayo_mn_rad_packet_physician_data.inc
 
/*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+
Site specific data
*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*/
 
;***Change this file to add site specific customized data
 
%i mhs_prg:mayo_mn_rad_packet_site_specific_data.inc
 
/*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+
The rest of the report
*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*+-+*/
 
    dummy_val = LayoutSection0(RPT_RENDER)
endfor
 
with nocounter
 
call FinalizeReport(tempfile)
 
if (working_array->print_flag != "N")
    if (working_array->debug_flag = "Y")
            set spool = value(trim(tempfile)) $4 with notify
        else
            set spool = value(concat(trim(tempfile))) $4 with deleted
    endif
endif
 
endfor
end
go
