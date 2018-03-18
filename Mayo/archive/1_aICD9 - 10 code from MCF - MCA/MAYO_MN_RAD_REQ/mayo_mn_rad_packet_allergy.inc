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
 
        Source file name:       rad_packet_allergy.inc
        Object name:            n/a
        Request #:              multiple
 
        Product:                GARPP
        Product Team:           Radnet
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        Get allergy info for patient
 
        Tables read:            many
 
        Tables updated:         none
        Executing from:         rad_rpt_packet_get_info
 
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
call echo ("****************START OF ALLERGY SELECT********************")
 
/*******************************************
*     Select to return allergy info        *
*******************************************/
 
declare active_allergy_cd = f8 with public,
                        noconstant(uar_get_code_by( "MEANING", 12025, "ACTIVE"))
  
 
select into "nl:"
    d1.seq,
    hd_packet = request->qual[d1.seq]->packet_id
from (dummyt d1 with seq = value(size(data->req,5))),
      allergy alrgy,
      nomenclature nm
plan d1
join alrgy
where alrgy.person_id = data->req[d1.seq]->patient_data->person_id
  and alrgy.beg_effective_dt_tm <= cnvtdatetime(curdate, curtime3)
  and alrgy.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
  and alrgy.active_ind = 1
  and alrgy.reaction_status_cd = active_allergy_cd
join nm
where nm.nomenclature_id = alrgy.substance_nom_id
 
head hd_packet
    xCounter = 0
 
detail
    xCounter = xCounter + 1
    stat = alterlist(data->req[d1.seq]->patient_data->allergy, xCounter)
    data->req[d1.seq]->patient_data->allergy[xCounter]->substance_ftdesc =
                                  alrgy.substance_ftdesc
    data->req[d1.seq]->patient_data->allergy[xCounter]->onset_dt_tm =
                                  cnvtdatetime(alrgy.onset_dt_tm)
    data->req[d1.seq]->patient_data->allergy[xCounter]->source_string =
                                  nm.source_string
    if (alrgy.substance_ftdesc !=" ")
        data->req[d1.seq]->patient_data->allergy[xCounter]->flexed_desc =
                                 alrgy.substance_ftdesc
    else
        data->req[d1.seq]->patient_data->allergy[xCounter]->flexed_desc =
                                 nm.source_string
    endif
    with nocounter
 


