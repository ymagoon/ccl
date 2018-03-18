/************************************************************************
 *                                                                      *
 *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
 *                              Technology, Inc.                        *
 *       Revision      (c) 1984-2008 Cerner Corporation                 *
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
 
          Author:             MC4839
          Date Written:       07/30/2008
          Source file name:   mayo_mn_optio_extract_output.inc
          Object Name:        mayo_mn_rpt_optio_extract
          Request #:          n/a
 
          Product:            Custom
          Product Team:       Custom - CinC Custom Programming Services
          HNA Version:        V500
 
          Program purpose:    Centralizes report output logic for SELECTs
                              to different output destinations
 
          Tables read:        Various
          Tables Updated:     None
          Executing From:     CCL
 
          Special Notes:
 
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
 *000 08/15/08 MC4839               Initial release                    *
 *001 03/12/09 MC4839               Added attending physician          *
 *002 03/12/09 MC4839               Added alias for 2nd hp             *
 *003 03/12/09 MC4839               Print copay for each hp            *
 ******************** End of Modification Log **************************/
 
  name_last = substring(1,30,hold->qual[d.seq]->name_last),
  name_first = substring(1,30,hold->qual[d.seq]->name_first),
  name_middle = substring(1,30,hold->qual[d.seq]->name_middle),
  dob = format(hold->qual[d.seq]->birth_dt_tm,"MM/DD/YYYY;;D"),
  sex = substring(1,1,UAR_GET_CODE_DISPLAY(hold->qual[d.seq]->sex_cd)),
  age = substring(1,10,cnvtage(hold->qual[d.seq]->birth_dt_tm)),
  fin = substring(1,15,hold->qual[d.seq]->fin),
  mrn = substring(1,15,hold->qual[d.seq]->mrn),
  l9mrn = substring(1,15,hold->qual[d.seq]->l9mrn), ;JRG12
  cmrn = substring(1,15,hold->qual[d.seq]->cmrn), ;JRG12
  pt_street_addr1 = substring(1,60,hold->qual[d.seq]->addr->street_addr1),
  pt_street_addr2 = substring(1,60,hold->qual[d.seq]->addr->street_addr2),
  pt_city = substring(1,20,hold->qual[d.seq]->addr->city),
  pt_state = substring(1,20,hold->qual[d.seq]->addr->state),
  pt_zip = substring(1,10,hold->qual[d.seq]->addr->zip),
  pt_home_phone = substring(1,15,hold->qual[d.seq]->home_phone),
  pt_bus_phone = substring(1,15,hold->qual[d.seq]->bus_phone),
  gt_alias = substring(1,15,hold->qual[d.seq]->guar->alias),
  gt_name = substring(1,100,hold->qual[d.seq]->guar->name_full),
  gt_street_addr1 = substring(1,60,hold->qual[d.seq]->guar->addr->street_addr1),
  gt_street_addr2 = substring(1,60,hold->qual[d.seq]->guar->addr->street_addr2),
  gt_city = substring(1,20,hold->qual[d.seq]->guar->addr->city),
  gt_state = substring(1,20,hold->qual[d.seq]->guar->addr->state),
  gt_zip = substring(1,10,hold->qual[d.seq]->guar->addr->zip),
  fin_class_alias = substring(1,20,hold->qual[d.seq]->fin_class_alias),
  fin_class = substring(1,40,UAR_GET_CODE_DISPLAY(hold->qual[d.seq]->fin_class_cd)),
  hp1_org_alias = substring(1,20,hold->qual[d.seq]->health_plan[1]->org_alias),
  hp1_org_name = substring(1,60,hold->qual[d.seq]->health_plan[1]->org_name),
  hp1_plan_name = substring(1,50,hold->qual[d.seq]->health_plan[1]->plan_name),
  hp1_policy_nbr = substring(1,20,hold->qual[d.seq]->health_plan[1]->policy_nbr),
  hp1_eff_date = format(hold->qual[d.seq]->health_plan[1]->effective_dt_tm,"MM/DD/YYYY;;D"),
  hp2_org_name = substring(1,60,hold->qual[d.seq]->health_plan[2]->org_name),  /*002*/
  hp2_org_alias = substring(1,20,hold->qual[d.seq]->health_plan[2]->org_alias),  /*002*/
  hp2_plan_name = substring(1,50,hold->qual[d.seq]->health_plan[2]->plan_name),
  hp2_policy_nbr = substring(1,20,hold->qual[d.seq]->health_plan[2]->policy_nbr),
  hp2_eff_date = format(hold->qual[d.seq]->health_plan[2]->effective_dt_tm,"MM/DD/YYYY;;D"),
  hp1_copay = format(hold->qual[d.seq]->health_plan[1]->copay_amt,"#######.##"),
  hp2_copay = format(hold->qual[d.seq]->health_plan[2]->copay_amt,"#######.##"),  /*003*/
  appt_date = format(hold->qual[d.seq]->appt->beg_dt_tm,"MM/DD/YYYY;;D"),
  appt_time = format(hold->qual[d.seq]->appt->beg_dt_tm,"HH:MM;;D"),
  appt_type = substring(1,40,UAR_GET_CODE_DESCRIPTION(hold->qual[d.seq]->appt->appt_type_cd)),
  resource_alias = substring(1,10,hold->qual[d.seq]->appt->resource_alias),
  resource = substring(1,40,UAR_GET_CODE_DISPLAY(hold->qual[d.seq]->appt->resource_cd)),
  appt_loc = substring(1,40,UAR_GET_CODE_DISPLAY(hold->qual[d.seq]->appt->appt_location_cd)),
  appt_loc_alias = substring(1,40,hold->qual[d.seq]->appt->appt_loc_alias),
  order_md_alias = substring(1,20,hold->qual[d.seq]->appt->order_md_alias),
  order_md_name = substring(1,60,hold->qual[d.seq]->appt->order_md_name),
  refer_md_alias = substring(1,20,hold->qual[d.seq]->refer_md_alias),
  refer_md_name = substring(1,60,hold->qual[d.seq]->refer_md_name),
/*001 BEGIN*/
  attend_md_alias = substring(1,20,hold->qual[d.seq]->attend_md_alias),
  attend_md_name = substring(1,60,hold->qual[d.seq]->attend_md_name),
/*001 END*/
  printer_name = substring(1,60,cnvtupper(hold->qual[d.seq]->appt->printer_name)),
  print_queue_name = substring(1,60,cnvtupper(print_queue_name))
FROM (dummyt d with seq=value(hold->cnt))
PLAN d
HEAD report
  if (print_queue_name = "mine")
    for (j = 1 to tmp_io->cnt)
      tmp_str = substring(1,130,tmp_io->qual[j]->line)
      col 0  tmp_str
      row +1
    endfor
 
    break
  endif
DETAIL
  if (d.seq > 1)
    break
  endif
 
  col 1   name_last
  col 31  name_first
  col 61  name_middle
  row +1
 
  col 1   dob
  col 12  sex
  col 14  age
  col 25  fin
  col 40  mrn
  row +1
 
  col 1   pt_street_addr1
  col 61  pt_street_addr2
  row +1
 
  col 1   pt_city
  col 21  pt_state
  col 41  pt_zip
  col 51  pt_home_phone
  col 66  pt_bus_phone
  row +1
 
  col 1   gt_alias
  col 16  gt_name
  row +1
 
  col 1   gt_street_addr1
  col 61  gt_street_addr2
  row +1
 
  col 1   gt_city
  col 21  gt_state
  col 41  gt_zip
  col 51  fin_class_alias
  col 71  fin_class
  row +1
 
  col 1   hp1_org_alias
  col 21  hp1_org_name
  row +1
 
  col 1   hp1_plan_name
  col 51  hp1_policy_nbr
  col 71  hp1_eff_date
  col 82  hp1_copay  /*003*/
  row +1
 
/*002 BEGIN*/
  col 1   hp2_org_alias
  col 21  hp2_org_name
  row +1
/*002 END*/
 
  col 1   hp2_plan_name
  col 51  hp2_policy_nbr
  col 71  hp2_eff_date
;003   col 82  hp1_copay
  col 82  hp2_copay  /*003*/
  row +1
 
  col 1   appt_date
  col 12  appt_time
  col 18  appt_type
  col 58  resource_alias
  col 68  resource
  row +1
 
  col 1   appt_loc
  col 41  appt_loc_alias
  row +1
 
  col 1   order_md_alias
  col 21  order_md_name
  row +1
 
  col 1   refer_md_alias
  col 21  refer_md_name
  row +1
 
/*001 BEGIN*/
  col 1   attend_md_alias
  col 21  attend_md_name
  row +1
 
/*001 END*/
 
  col 1   printer_name
  row +1
 
  col 1   print_queue_name
  row +1
 
  col 1  l9mrn ;JRG12
  col 25  cmrn ;JRG12
  row +1
 

