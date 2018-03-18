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
          Source file name:   mayo_mn_formfast_extract_output.inc
          Object Name:        mayo_mn_rpt_formfast_extract
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
 
  name_last = substring(1,30,hold->qual[d.seq]->name_last)
  , name_first = substring(1,30,hold->qual[d.seq].name_first)
  , name_middle = substring(1,30,hold->qual[d.seq].name_middle)
  , name_prefix = substring(1,30,hold->qual[d.seq].name_prefix)
  , name_suffix = substring(1,30,hold->qual[d.seq].name_suffix)
  , dob = format(hold->qual[d.seq]->birth_dt_tm,"MM/DD/YYYY;;D")
  , mrn = substring(1,15,hold->qual[d.seq].mrn)
  , sex = substring(1,10,uar_get_code_display(hold->qual[d.seq].sex_cd))
  , pt_street_addr1 = substring(1,60,hold->qual[d.seq].addr.street_addr1)
  , pt_street_addr2 = substring(1,60,hold->qual[d.seq].addr.street_addr2)
  , pt_city = substring(1,20,hold->qual[d.seq].addr.city)
  , pt_state = substring(1,20,hold->qual[d.seq].addr.state)
  , pt_zip = substring(1,10,hold->qual[d.seq].addr.zip)
  , pt_country = substring(1,15,hold->qual[d.seq].addr.country)
  , admit_dt_tm = format(hold->qual[d.seq].admit_dt_tm,"MM/DD/YYYY;;D")
  , attend_md_id = cnvtstring(hold->qual[d.seq].attend_md_id)
  , attend_md_name_last = substring(1,60,hold->qual[d.seq].attend_md_name_last)
  , attend_md_name_first = substring(1,60,hold->qual[d.seq].attend_md_name_first)
  , pt_room = substring(1,30,uar_get_code_display(hold->qual[d.seq].room_cd))
  , pt_bed = substring(1,10,uar_get_code_display(hold->qual[d.seq].bed_cd))
  , pt_fin = substring(1,15,hold->qual[d.seq]->fin)
  , pt_discharge_dt_tm = format(hold->qual[d.seq].disch_dt_tm,"MM/DD/YYYY;;D")
  , refer_md_id = cnvtstring(hold->qual[d.seq].refer_md_id)
  , refer_md_name_last = substring(1,60,hold->qual[d.seq].refer_md_name_last)
  , refer_md_name_first = substring(1,60,hold->qual[d.seq].refer_md_name_first)
  , consult_md_id = cnvtstring(hold->qual[d.seq].consult_md_id)
  , consult_md_name_last = substring(1,60,hold->qual[d.seq].consult_md_name_last)
  , consult_md_name_first = substring(1,60,hold->qual[d.seq].consult_md_name_first)
  ;, alias = 																		;fix
  , pt_mother_name = substring(1,40,hold->qual[d.seq].name_mother)
  , pt_marital_status = substring(1,20,uar_get_code_display(hold->qual[d.seq].marital_status_cd))
  , pt_race = substring(1,20,uar_get_code_display(hold->qual[d.seq].race_cd))
  , pt_religion = substring(1,30,uar_get_code_display(hold->qual[d.seq].religion_cd))
  , pt_home_phone = substring(1,15,hold->qual[d.seq]->home_phone)
  , pt_bus_phone = substring(1,15,hold->qual[d.seq]->bus_phone)
  , pt_encntr_type = substring(1,30,uar_get_code_display(hold->qual[d.seq].encntr_type_cd))
  , pt_med_service = substring(1,30,uar_get_code_display(hold->qual[d.seq].medical_service_cd))
  , pt_nurse_unit = substring(1,30,uar_get_code_display(hold->qual[d.seq].nurse_unit_cd))
  , pt_servicing_facility = substring(1,30,uar_get_code_display(hold->qual[d.seq].facility_cd))
  , pt_disch_rson = substring(1,30,uar_get_code_display(hold->qual[d.seq].disch_disp_cd))
  , pt_admit_source = substring(1,60,uar_get_code_display(hold->qual[d.seq].admit_src_cd))
  , fin_class = substring(1,40,uar_get_code_display(hold->qual[d.seq]->fin_class_cd))
  , nok_name_last = substring(1,30,hold->qual[d.seq].nok.name_last)
  , nok_name_first = substring(1,30,hold->qual[d.seq].nok.name_first)
  , nok_relationship = substring(1,30,uar_get_code_display(hold->qual[d.seq].nok.reltn_type_cd))
  , nok_address1 = substring(1,60,hold->qual[d.seq].nok.street_addr1)
  , nok_address2 = substring(1,60,hold->qual[d.seq].nok.street_addr2)
  , nok_city = substring(1,60,hold->qual[d.seq].nok.city)
  , nok_state = substring(1,60,hold->qual[d.seq].nok.state)
  , nok_zip = substring(1,10,hold->qual[d.seq].nok.zip)
  , nok_home_phone = substring(1,15,hold->qual[d.seq].nok.home_phone)
  , hp1_org_name = substring(1,60,hold->qual[d.seq].health_plan[1].org_name)
  , hp1_plan_name = substring(1,60,hold->qual[d.seq].health_plan[1].plan_name)
  , hp1_address1 = substring(1,60,hold->qual[d.seq].health_plan[1].addr.street_addr1)
  , hp1_address2 = substring(1,60,hold->qual[d.seq].health_plan[1].addr.street_addr2)
  , hp1_city = substring(1,15,hold->qual[d.seq].health_plan[1].addr.city)
  , hp1_state = substring(1,15,hold->qual[d.seq].health_plan[1].addr.state)
  , hp1_zip = substring(1,10,hold->qual[d.seq].health_plan[1].addr.zip)
  , hp1_bus_phone = substring(1,15,hold->qual[d.seq].health_plan[1].bus_phone)
  , hp1_group_nbr = substring(1,15,hold->qual[d.seq].health_plan[1].group_nbr)
  , hp1_policy_nbr = substring(1,15,hold->qual[d.seq].health_plan[1].policy_nbr)
  , hp1_eff_date = format(hold->qual[d.seq].health_plan[1].effective_dt_tm,"MM/DD/YYYY;;D")
  , hp1_expir_date = format(hold->qual[d.seq].health_plan[1].expire_dt_tm,"MM/DD/YYYY;;D")
  ;, hp1_relationship
  ;, hp1_sub_name_last
  ;, hp1_sub_name_first
  ;, hp1_employer
 
  , hp2_org_name = substring(1,60,hold->qual[d.seq].health_plan[2].org_name)
  , hp2_address1 = substring(1,60,hold->qual[d.seq].health_plan[2].addr.street_addr1)
  , hp2_address2 = substring(1,60,hold->qual[d.seq].health_plan[2].addr.street_addr2)
  , hp2_city = substring(1,15,hold->qual[d.seq].health_plan[2].addr.city)
  , hp2_state = substring(1,15,hold->qual[d.seq].health_plan[2].addr.state)
  , hp2_zip = substring(1,10,hold->qual[d.seq].health_plan[2].addr.zip)
  , hp2_bus_phone = substring(1,15,hold->qual[d.seq].health_plan[2].bus_phone)
  , hp2_group_nbr = substring(1,15,hold->qual[d.seq].health_plan[2].group_nbr)
  , hp2_policy_nbr = substring(1,15,hold->qual[d.seq].health_plan[2].policy_nbr)
  , hp2_eff_date = format(hold->qual[d.seq].health_plan[2].effective_dt_tm,"MM/DD/YYYY;;D")
  , hp2_expir_date = format(hold->qual[d.seq].health_plan[2].expire_dt_tm,"MM/DD/YYYY;;D")
  ;, hp2_relationship
  ;, hp2_sub_name_last
  ;, hp2_sub_name_first
  ;, hp2_employer
  , gt_name_last = substring(1,40,hold->qual[d.seq].guar.name_last)
  , gt_name_first = substring(1,40,hold->qual[d.seq].guar.name_first)
  , gt_reltn = substring(1,30,uar_get_code_display(hold->qual[d.seq].guar.reltn_type_cd))
  , gt_number = substring(1,30,hold->qual[d.seq].guar.alias)
  , gt_street_address1 = substring(1,60,hold->qual[d.seq].guar.addr.street_addr1)
  , gt_street_address2 = substring(1,60,hold->qual[d.seq].guar.addr.street_addr2)
  , gt_city = substring(1,20,hold->qual[d.seq].guar.addr.city)
  , gt_state = substring(1,20,hold->qual[d.seq].guar.addr.state)
  , gt_zip = substring(1,10,hold->qual[d.seq].guar.addr.zip)
  , gt_home_phone = substring(1,15,hold->qual[d.seq].guar.home_phone)
  , gt_employer = substring(1,40,hold->qual[d.seq].guar.employer)
  , gt_employer_bus_phone = substring(1,15,hold->qual[d.seq].guar.emp_bus_phone)
  ;, isDNR =
  , cmrn = substring(1,15,hold->qual[d.seq]->cmrn)
  ;, preadmit_dt_tm =
  , appt_type = substring(1,40,uar_get_code_description(hold->qual[d.seq]->appt->appt_type_cd))
  ;, campus_auth =
 
/*  l9mrn = substring(1,15,hold->qual[d.seq]->l9mrn), ;JRG12
  cmrn = substring(1,15,hold->qual[d.seq]->cmrn), ;JRG12
  pt_home_phone = substring(1,15,hold->qual[d.seq]->home_phone),
  pt_bus_phone = substring(1,15,hold->qual[d.seq]->bus_phone),
 
  fin_class_alias = substring(1,20,hold->qual[d.seq]->fin_class_alias),
 
 
  appt_date = format(hold->qual[d.seq]->appt->beg_dt_tm,"MM/DD/YYYY;;D"),
  appt_time = format(hold->qual[d.seq]->appt->beg_dt_tm,"HH:MM;;D"),
  appt_type = substring(1,40,UAR_GET_CODE_DESCRIPTION(hold->qual[d.seq]->appt->appt_type_cd)),
  resource_alias = substring(1,10,hold->qual[d.seq]->appt->resource_alias),
  resource = substring(1,40,UAR_GET_CODE_DISPLAY(hold->qual[d.seq]->appt->resource_cd)),
  appt_loc = substring(1,40,UAR_GET_CODE_DISPLAY(hold->qual[d.seq]->appt->appt_location_cd)),
  appt_loc_alias = substring(1,40,hold->qual[d.seq]->appt->appt_loc_alias),
  order_md_alias = substring(1,20,hold->qual[d.seq]->appt->order_md_alias),
  order_md_name = substring(1,60,hold->qual[d.seq]->appt->order_md_name),
 
 
  printer_name = substring(1,60,cnvtupper(hold->qual[d.seq]->appt->printer_name)),
  print_queue_name = substring(1,60,cnvtupper(print_queue_name)) */
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
 
  ;patient info
  col 0 "LastName" row+1
  col 0 name_last  row+1
  col 0 "FirstName" row+1
  col 0 name_first row+1
  col 0 "MiddleName" row+1
  col 0 name_middle row+1
  col 0 "NamePrefix" row+1
  col 0 name_prefix row+1
  col 0 "NameSuffix" row+1
  col 0 name_suffix row+1
  col 0 "BirthDate" row+1
  col 0 dob row+1
  col 0 "MedicalRecordNumber" row+1
  col 0 mrn row+1
  col 0 "Gender" row+1
  col 0 sex row+1
  col 0 "Address1" row+1
  col 0 pt_street_addr1 row+1
  col 0 "Address2" row+1
  col 0 pt_street_addr2 row+1
  col 0 "City" row+1
  col 0 pt_city row+1
  col 0 "State" row+1
  col 0 pt_state row+1
  col 0 "Zip" row+1
  col 0 pt_zip row+1
  col 0 "Country" row+1
  col 0 pt_country row+1
 
  ;admit info
  col 0 "VisitNumber" row+1
  col 0 "" row+1
  col 0 "AdmitState" row+1
  col 0 "" row+1
  col 0 "PreviousAdmitState" row+1
  col 0 "" row+1
  col 0 "AdmitDateTime" row+1
  col 0 admit_dt_tm row+1
 
  ;attending physician info
  col 0 "AttendingPhysicianID" row+1
  col 0 if (attend_md_id = "0") "" else attend_md_id endif row+1
  col 0 "AttendingPhysicianLastName" row+1
  col 0 attend_md_name_last row+1
  col 0 "AttendingPhysicianFirstName" row+1
  col 0 attend_md_name_first row+1
 
  col 0 "Room" row+1
  col 0 pt_room row+1
  col 0 "Bed" row+1
  col 0 pt_bed row+1
  col 0 "BillingCode" row+1
  col 0 pt_fin row+1
  col 0 "DischargeDateTime" row+1
  col 0 pt_discharge_dt_tm row+1
 
  ;referring physician info
  col 0 "ReferringPhysicianID" row+1
  col 0 if (refer_md_id = "0") "" else refer_md_id endif row+1
  col 0 "ReferringPhysicianFirstName" row+1
  col 0 refer_md_name_last row+1
  col 0 "ReferringPhysicianLastName" row+1
  col 0 refer_md_name_first row+1
 
  ;consulting physician info
  col 0 "ConsultingPhysicianID" row+1
  col 0 if (consult_md_id = "0") "" else consult_md_id endif row+1
  col 0 "ConsultingPhysicianFirstName" row+1
  col 0 consult_md_name_last row+1
  col 0 "ConsultingPhysicianLastName" row+1
  col 0 consult_md_name_first row+1
  col 0 "SSN" row+1
  col 0 "" row+1
  col 0 "Alias" row+1
  col 0 ""  ;fix
  col 0 "MothersName" row+1
  col 0 pt_mother_name row+1
  col 0 "MaritalStatus" row+1
  col 0 pt_marital_status row+1
  col 0 "Race" row+1
  col 0 pt_race row+1
  col 0 "Religion" row+1
  col 0 pt_religion row+1
  col 0 "HomePhone" row+1
  col 0 pt_home_phone row+1
  col 0 "WorkPhone" row+1
  col 0 pt_bus_phone row+1
  col 0 "AccountNumber" row+1
  col 0 pt_fin row+1
  col 0 "PatientType" row+1
  col 0 pt_encntr_type row+1
  col 0 "HospitalService" row+1
  col 0 pt_med_service row+1
  col 0 "Location" row+1
  col 0 pt_nurse_unit row+1
  col 0 "FinancialClass" row+1
  col 0 fin_class row+1
  col 0 "ServicingFacility" row+1
  col 0 pt_servicing_facility row+1
  col 0 "DischargeDisposition" row+1
  col 0 pt_disch_rson row+1
  col 0 "AdmitSource" row+1
  col 0 pt_admit_source row+1
  col 0 "PriorLoc" row+1
  col 0 "" row+1						;fix
 
  ;next of kin info
  col 0 "NextOfKinLastName" row+1
  col 0 nok_name_first row+1
  col 0 "NextOfKinFirstName" row+1
  col 0 nok_name_first row+1
  col 0 "NextOfKinRelationship" row+1
  col 0 nok_relationship row+1
  col 0 "NextOfKinAddress1" row+1
  col 0 nok_address1 row+1
  col 0 "NextOfKinAddress2" row+1
  col 0 nok_address2 row+1
  col 0 "NextOfKinCity" row+1
  col 0 nok_city row+1
  col 0 "NextOfKinState" row+1
  col 0 nok_state row+1
  col 0 "NextOfKinZip" row+1
  col 0 nok_zip row+1
  col 0 "NextOfKinPhone" row+1
  col 0 nok_home_phone row+1
 
  ;primary insurance info
  col 0 "PrimaryInsCompanyName" row+1
  col 0 hp1_plan_name row+1
  col 0 "PrimaryInsAddress1" row+1
  col 0 hp1_address1 row+1
  col 0 "PrimaryInsAddress2" row+1
  col 0 hp1_address2 row+1
  col 0 "PrimaryInsCity" row+1
  col 0 hp1_city row+1
  col 0 "PrimaryInsState" row+1
  col 0 hp1_state row+1
  col 0 "PrimaryInsZip" row+1
  col 0 hp1_zip row+1
  col 0 "PrimaryInsPhone" row+1
  col 0 hp1_bus_phone row+1
  col 0 "PrimaryInsGroupNumber" row+1
  col 0 hp1_group_nbr row+1
  col 0 "PrimaryInsPolicyNumber" row+1
  col 0 hp1_policy_nbr row+1
  col 0 "PrimaryInsEffectiveDate" row+1
  col 0 hp1_eff_date row+1
  col 0 "PrimaryInsExpirationDate" row+1
  col 0 hp1_expir_date row+1
  col 0 "PrimaryInsRelationship" row+1
  col 0 "" row+1										;fix
  col 0 "PrimaryInsSubscriberLastName" row+1
  col 0 "" row+1										;fix
  col 0 "PrimaryInsSubscriberFirstName" row+1
  col 0 "" row+1										;fix
  col 0 "PrimaryInsEmployerName" row+1
  col 0 "" row+1										;fix
 
  ;secondary insurance info
  col 0 "SecondaryInsCompanyName" row+1
  col 0 hp2_org_name row+1
  col 0 "SecondaryInsAddress1" row+1
  col 0 hp2_address1 row+1
  col 0 "SecondaryInsAddress2" row+1
  col 0 hp2_address2 row+1
  col 0 "SecondaryInsCity" row+1
  col 0 hp2_city row+1
  col 0 "SecondaryInsState" row+1
  col 0 hp2_state row+1
  col 0 "SecondaryInsZip" row+1
  col 0 hp2_zip row+1
  col 0 "SecondaryInsPhone" row+1
  col 0 hp2_bus_phone row+1
  col 0 "SecondaryInsGroupNumber" row+1
  col 0 hp2_group_nbr row+1
  col 0 "SecondaryInsPolicyNumber" row+1
  col 0 hp2_policy_nbr row+1
  col 0 "SecondaryInsEffectiveDate" row+1
  col 0 hp2_eff_date row+1
  col 0 "SecondaryInsExpirationDate" row+1
  col 0 hp2_expir_date row+1
  col 0 "SecondaryInsRelationship" row+1
  col 0 "" row+1									;fix
  col 0 "SecondaryInsSubscriberLastName" row+1
  col 0 "" row+1									;fix
  col 0 "SecondaryInsSubscriberFirstName" row+1
  col 0 "" row+1									;fix
  col 0 "SecondaryInsEmployerName" row+1
  col 0 "" row+1									;fix
 
  ;guarantor info
  col 0 "GuarantorLastName" row+1
  col 0 gt_name_last row+1
  col 0 "GuarantorFirstName" row+1
  col 0 gt_name_first row+1
  col 0 "GuarantorSSN" row+1
  col 0 "" row+1
  col 0 "GuarantorNumber" row+1
  col 0 gt_number row+1
  col 0 "GuarantorRelationship" row+1
  col 0 gt_reltn row+1
  col 0 "GuarantorAddress1" row+1
  col 0 gt_street_address1 row+1
  col 0 "GuarantorAddress2" row+1
  col 0 gt_street_address2 row+1
  col 0 "GuarantorCity" row+1
  col 0 gt_city row+1
  col 0 "GuarantorState" row+1
  col 0 gt_state row+1
  col 0 "GuarantorZip" row+1
  col 0 gt_zip row+1
  col 0 "GuarantorPhone" row+1
  col 0 gt_home_phone row+1
  col 0 "GuarantorEmployerName" row+1
  col 0 gt_employer row+1
  col 0 "GuarantorEmployerPhone" row+1
  col 0 gt_employer_bus_phone row+1
 
  ;extra info
  col 0 "IsDNR" row+1
  col 0
  col 0 "Allergy1" row+1
  col 0 "" row+1
  col 0 "Allergy2" row+1
  col 0 "" row+1
  col 0 "Allergy3" row+1
  col 0 "" row+1
  col 0 "Allergy4" row+1
  col 0 "" row+1
  col 0 "AdmitDateTimeDisplay" row+1
  col 0 admit_dt_tm row+1
  col 0 "DischargeDateTimeDisplay" row+1
  col 0 pt_discharge_dt_tm row+1
  col 0 "CMRN" row+1
  col 0 cmrn row+1
  col 0 "PreAdmitDateTime" row+1
  col 0
  col 0 "AppointmentType"  row+1
  col 0 appt_type row+1
  col 0 "CampusAuth"
  col 0
