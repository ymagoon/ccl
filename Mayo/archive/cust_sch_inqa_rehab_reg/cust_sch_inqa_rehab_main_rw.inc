/************************************************************************
 *                                                                      *
 *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
 *                              Technology, Inc.                        *
 *       Revision      (c) 1984-2012 Cerner Corporation                 *
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
 ************************************************************************
 
        Source file name:       cust_sch_inqa_rehab_main_rw.inc
        Object name:            cust_sch_inqa_rehab
        Request #:
 
        Product:                Custom - Pre Built
        Product Team:           Custom - Pre Built
        HNA Version:
        CCL Version:
 
        Purpose:                Used by pre-built rehab ESM inquiry to
                                avoid repeating same report writer section
                                multiple times
 
        Tables read:
 
        Tables updated:         None
 
        Executing from:         Scheduling
 
        Special Notes:
 
 ************************************************************************
 *                      GENERATED MODIFICATION CONTROL LOG              *
 ************************************************************************
 *                                                                      *
 *Mod Date     Engineer             Comment                             *
 *--- -------- -------------------- ----------------------------------- *
 *000 03/27/12 Michael Chapman      Initial Release                     *
 ************************************************************************/
 
ORDER sortkey, a.beg_dt_tm
HEAD report
  cnt = 0
HEAD sortkey
  cnt = cnt + 1
  if (cnt > size(reply->query_qual,5))
    stat = alterlist(reply->query_qual,cnt + 99)
  endif
 
  reply->query_qual[cnt].fin                = cnvtalias(ea.alias,ea.alias_pool_cd)
  reply->query_qual[cnt].name_full          = substring(1,50,p.name_full_formatted)
  reply->query_qual[cnt].appt_location      = UAR_GET_CODE_DISPLAY(a.appt_location_cd)
  reply->query_qual[cnt].resource           = UAR_GET_CODE_DISPLAY(a.resource_cd)
  reply->query_qual[cnt].appt_type          = UAR_GET_CODE_DISPLAY(ev.appt_type_cd)
  reply->query_qual[cnt].auth_start_date    = ed.oe_field_dt_tm_value
  reply->query_qual[cnt].hide#series_tag    = sortkey
  reply->query_qual[cnt].hide#scheventid    = a.sch_event_id
  reply->query_qual[cnt].hide#scheduleid    = a.schedule_id
  reply->query_qual[cnt].hide#scheduleseq   = a.schedule_seq
  reply->query_qual[cnt].hide#oeformatid    = ev.oe_format_id
  reply->query_qual[cnt].hide#statemeaning  = a.state_meaning
  reply->query_qual[cnt].hide#encounterid   = e.encntr_id
  reply->query_qual[cnt].hide#personid      = a2.person_id
  reply->query_qual[cnt].hide#bitmask       = a.bit_mask
FOOT report
  reply->query_qual_cnt = cnt
  stat = alterlist(reply->query_qual,cnt)
WITH nocounter
 
 
 
