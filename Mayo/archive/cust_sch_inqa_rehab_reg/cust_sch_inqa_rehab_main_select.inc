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
 
        Source file name:       cust_sch_inqa_rehab_main_select.inc
        Object name:            cust_sch_inqa_rehab
        Request #:
 
        Product:                Custom - Pre Built
        Product Team:           Custom - Pre Built
        HNA Version:
        CCL Version:
 
        Purpose:                Used by pre-built rehab ESM inquiry to
                                avoid repeating same SELECT & FROM clauses
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
  SELECT INTO "nl:"
    sortkey = BUILD(format(a2.person_id,"###############;lp0"),"|",
                    format(ev.appt_type_cd,"###############;lp0"),"|",
                    format(ed.oe_field_id,"###############;lp0"),"|",
                    format(ed.oe_field_dt_tm_value,"YYYYMMDDHHMMSS;;D"))
  FROM sch_appt a,
    sch_event ev,
    sch_event_detail ed,
    sch_appt a2,
    encounter e,
    person p,
    encntr_alias ea
 
 
 
