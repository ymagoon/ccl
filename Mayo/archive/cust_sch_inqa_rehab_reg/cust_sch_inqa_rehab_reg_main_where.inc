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
 
        Source file name:       cust_sch_inqa_rehab_reg_main_where.inc
        Object name:            cust_sch_inqa_rehab
        Request #:
 
        Product:                Custom - Pre Built
        Product Team:           Custom - Pre Built
        HNA Version:
        CCL Version:
 
        Purpose:                Used by pre-built rehab ESM inquiry to
                                avoid repeating same WHERE clause
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
 
  AND a.beg_dt_tm >= cnvtdatetime(t_record->beg_dt_tm)
  AND a.role_meaning != "PATIENT"
  AND a.state_meaning IN ("CONFIRMED","CHECKED IN","CHECKED OUT")
  AND a.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
  AND a.primary_role_ind = 1
  AND a.active_ind = 1
  AND a.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
  AND a.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
JOIN ev WHERE ev.sch_event_id = a.sch_event_id
JOIN a2 WHERE a2.sch_event_id = ev.sch_event_id
  AND a2.role_meaning = "PATIENT"
  AND a2.state_meaning IN ("CONFIRMED","CHECKED IN","CHECKED OUT")
  AND a2.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
  AND a2.active_ind = 1
  AND a2.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
  AND a2.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
JOIN p WHERE p.person_id = a2.person_id +0
JOIN ed WHERE ed.sch_event_id = a2.sch_event_id
  AND ed.oe_field_id = oef->qual[1].oe_field_id
  AND ed.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
JOIN e WHERE e.encntr_id = outerjoin(a2.encntr_id)
JOIN ea WHERE ea.encntr_id = outerjoin(e.encntr_id)
  AND ea.encntr_alias_type_cd = outerjoin(FIN_CD)
  AND ea.active_ind = outerjoin(1)
  AND ea.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
  AND ea.end_effective_dt_tm >= outerjoin(cnvtdatetime(curdate,curtime3))
 
 
 

