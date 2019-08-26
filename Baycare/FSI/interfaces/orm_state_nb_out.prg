/**********************************************************************************
 *  Script Name:  orm_state_nb_out
 *  Description:  Newborn screening orders to FL Dept of Health
*  Type:  Open Engine Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:  CERNER
 ***********************************************************************************/
/***********************************************************************************
 *  Mod#   Date	        Author                 Description & Requestor Information
 *
 *  1:  07/27/2016   S Parimi               CAB # 8966 implementation of Newborn Screening Orders to State  
*   2:  02/28/2017   S Parimi               CAB #  1515 PID-7 logic uses clinical_event and ce_date_result tables
*   3.  11/14/2017   S Parimi               CAB # 6393 Send Facility NPI in ORC-21
*   4.   02/15/2019   Y Magoon           Ticket # 807825 Modify Insured DOB to "YYYYMMDD"
*   5.   06/13/2018  Y Magoon           Fix issue with date/time crashing interface
***********************************************************************************/


execute oencpm_msglog build("Beginning of orm_state_newborn_out", char(0))

;;**************************************
;;** Variable Definition              **
;;**************************************
;;Get the values of a few variables that will be used throughout the script
set pku_contrib_source_cd = uar_get_code_by("DISPLAYKEY", 73,"STATE_NEWBORN")
set pku_contrib_system_cd = uar_get_code_by("DISPLAYKEY", 89,"STATE_NEWBORN")

;;Getting the organization of the encounter
declare organization_id = f8
set organization_id = 0
declare encntr_id = f8
set encntr_id = 0.00
declare person_id = f8
set person_id = 0.00

for (doublelist_index = 1 to size(oen_reply->cerner->doublelist, 5))
   if (oen_reply->cerner->doublelist[doublelist_index]->strmeaning = "encntr_id")
      set encntr_id = oen_reply->cerner->doublelist[doublelist_index]->dval
   endif 
   if (oen_reply->cerner->doublelist[doublelist_index]->strmeaning = "person_id")
      set person_id = oen_reply->cerner->doublelist[doublelist_index]->dval
   endif           
endfor

;;Get mother's info
declare mother_person_id = f8
set mother_person_id = 0.00
declare mother_first_name = vc
set mother_first_name = ""
declare mother_last_name = vc
set mother_last_name = ""
declare mother_mrn = vc
set mother_mrn = ""
declare mother_age = vc
set mother_age = ""

set child_cv = UAR_GET_CODE_BY ("DISPLAY" ,40 ,"Child" )
set person_reltn_cv = UAR_GET_CODE_BY ("DISPLAY" ,351 ,"Next of Kin" )        ;** this can vary from site to site

select into "nl:"
   p.person_id
from
   person_person_reltn ppr,
   person p,
   person_alias pa
plan ppr where
   ppr.person_id = person_id and
   ppr.related_person_reltn_cd = child_cv and
   ppr.person_reltn_type_cd = person_reltn_cv and
   ppr.active_ind = 1 and
   ppr.end_effective_dt_tm > sysdate
join p where
   p.person_id = ppr.related_person_id
join pa where
   pa.person_id = p.person_id and
   pa.person_alias_type_cd = 4 and       ;;;;** this can vary from site to site.  this is for MRN.
   pa.active_ind = 1 and
   pa.end_effective_dt_tm > sysdate
detail
   mother_person_id = p.person_id
   mother_first_name = cnvtalphanum(p.name_first)
   mother_last_name = cnvtalphanum(p.name_last)
   mother_mrn = pa.alias
   mother_age = substring(1, 3, cnvtage(p.birth_dt_tm))
   ;mother_age = cnvtage(p.birth_dt_tm)   
with nocounter


;;*********************************************************
;;** MSH Segment                                                           **
;;**********************************************************
;;MSH-3
set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_application->name_id = "2.16.480.1.113883.3.13.2.7.2"

;;MSH-4
set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = "2.16.840.1.114222.4.1.217621"

;;MSH-5
set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = "2.16.840.1.114222.4.3.3.8.1.5"

;;MSH-6
set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_facility->name_id = "2.16.840.1.114222.4.1.10000"

;;MSH-9
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_type = "OML"
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_trigger = "O21^OML_O21"

;;MSH-11
set oen_reply->CONTROL_GROUP [1]->MSH [1]->processing_id->proc_id = "P"

;;MSH-12
set oen_reply->CONTROL_GROUP [1]->MSH [1]->version_id = "2.5.1"
 
;;***************************************
;;** PID Segment                       **
;;***************************************
;;PID-2 ;;Remove PID-2 completely
set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->id = ""
set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->assign_auth->name_id = ""
set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->type_cd = ""
set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->assign_fac_id->name_id = ""

;;PID-3
declare mrn = vc
declare mrn_auth = vc
for (alias_index = 1 to size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int, 5))
   if (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [alias_index]->assign_auth->name_id = "BayCare MRN")
      set mrn = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [alias_index]->id 
      set mrn_auth = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [alias_index]->assign_auth->name_id 
   endif
endfor
execute oencpm_msglog build("MRN: ", mrn, char(0))

set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int, 0)
set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int, 1)
set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [1]->id = mrn
set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [1]->assign_auth->name_id = mrn_auth
set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [1]->type_cd = "MR"

;;PID-4 ;;Remove PID-4 completely
set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->alternate_pat_id, 0)
set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->alternate_pat_id, 1)


;;PID-5
set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_name [1]->last_name = 
    cnvtalphanum(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_name [1]->last_name)
set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_name [1]->first_name = 
    cnvtalphanum(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_name [1]->first_name)
;Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_name [1]->name_type_cd = "L"
    
;;PID-6
;set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->mothers_maiden_name->last_name = mother_last_name      
;set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->mothers_maiden_name->first_name = mother_first_name

;;PID-7, send only 8-digit date
declare DELIVERYDATETIMEOFBIRTH_72_VAR = f8 with Constant(uar_get_code_by("DISPLAYKEY",72,"DELIVERYDATETIMEOFBIRTH")),protect

select into "nl:"
from clinical_event ce
        ,ce_date_result cdr
plan ce
        where ce.encntr_id = encntr_id
        and ce.event_cd = DELIVERYDATETIMEOFBIRTH_72_VAR
        and ce.view_level = 1    
join cdr
         where cdr.event_id = ce.event_id   
detail
         oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->date_of_birth = 
                format(cdr.result_dt_tm, "YYYYMMDDHHMMSS;;d")
with nocounter

Set fl_birth_date_time = substring(1, 12, oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->date_of_birth)

Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->date_of_birth = 
       substring(1,8, oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->date_of_birth)


;;PID-9
set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_alias, 0)

;;PID-10
set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->race, 0) 
declare race_cd = f8
set indian_cd = uar_get_code_by("DISPLAY", 282, "American Indian or Alaskan Native")
set asian_cd = uar_get_code_by("DISPLAY", 282, "Asian")
set black_cd = uar_get_code_by("DISPLAY", 282, "Black")
set hawaiian_cd = uar_get_code_by("DISPLAY", 282, "Hawaiian Other Pacific")
set white_cd = uar_get_code_by("DISPLAY", 282, "White")
set other_cd = uar_get_code_by("DISPLAY", 282, "Other")

   select into "nl:"
                p.race_cd
   from      person p
   where   p.person_id = person_id 
   detail    race_cd = p.race_cd
   with      nocounter  

if (race_cd = indian_cd)
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->race [1]->identifier = "1002-5"
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->race [1]->text = "American Indian or Alaska Native"
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->race [1]->coding_system = "HL70005"
elseif (race_cd = asian_cd)
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->race [1]->identifier = "2028-9"
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->race [1]->text = "Asian"
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->race [1]->coding_system = "HL70005"
elseif (race_cd = black_cd)
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->race [1]->identifier = "2054-5"
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->race [1]->text = "Black or African American"
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->race [1]->coding_system = "HL70005"
elseif (race_cd = hawaiian_cd)
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->race [1]->identifier = "2076-8"
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->race [1]->text = "Native Hawaiian or Other Pacific Islander"
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->race [1]->coding_system = "HL70005"
elseif (race_cd = white_cd)
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->race [1]->identifier = "2106-3"
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->race [1]->text = "White"
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->race [1]->coding_system = "HL70005"
elseif (race_cd = other_cd)
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->race [1]->identifier = "2131-1"
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->race [1]->text = "Other Race"
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->race [1]->coding_system = "HL70005"
else
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->race [1]->identifier = "2131-1"
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->race [1]->text = "Other Race"
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->race [1]->coding_system = "HL70005"
endif


;;PID-11 ;;Set array size = 1
set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address, 1)
set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [1]->country = ""
set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [1]->types = ""
set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [1]->county = ""

;;PID-12
set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->county_code = ""

;;PID-13
;;PID-13  Send as unformatted
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ph_nbr_home [1]->phone_nbr = 
       cnvtalphanum(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ph_nbr_home [1]->phone_nbr)


;;PID-14
set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ph_nbr_bus, 0)

;;PID-18
declare fin = vc
declare fin_auth = vc
set fin = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->id 
set fin_auth = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_auth->name_id 

;set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int, 2)
;Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [2]->id = fin
;Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [2]->assign_auth->name_id = fin_auth

;;PID-19
set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ssn_nbr = ""

;;PID-21
;set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->mothers_id, 1)
;set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->mothers_id [1]->id = mother_mrn


;; Birth Type - Single, Twin, etc.  Display key varies site to site
declare fl_birth_type_event_cd = f8
set fl_birth_type_event_cd = uar_get_code_by("DISPLAYKEY", 72, "NEONATALMULTIPLEGESTATIONDESCRIPTION")
  execute oencpm_msglog build("BIRTH_TYPE_CD: ", fl_birth_type_event_cd, char(0))
declare fl_birth_type = vc
set fl_birth_type = ""

;;; Birth Order, if twins, triplets.  Display key varies site to site
declare fl_birth_order_event_cd = f8
set fl_birth_order_event_cd = uar_get_code_by("DISPLAYKEY", 72, "NEONATALBIRTHORDER")
declare fl_birth_order = vc
set fl_birth_order = ""

select into "nl:"
   ce.result_val
from
   clinical_event ce
where
   ce.encntr_id = encntr_id and
   ce.valid_until_dt_tm > sysdate
detail
   if (ce.event_cd = fl_birth_type_event_cd)
         fl_birth_type = trim(ce.result_val, 3)     	
   endif
   if (ce.event_cd = fl_birth_order_event_cd)
         fl_birth_order = trim(ce.result_val, 3)     	
   endif
with nocounter

execute oencpm_msglog build("BIRTH_TYPE: ", fl_birth_type, char(0))
execute oencpm_msglog build("BIRTH_ORDER: ", fl_birth_order, char(0))

;;PID-22
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ethnic_grp [1]->coding_system = "HL70189"


;PID-24  & PID-25
If  (fl_birth_type = "Twins")
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->multiple_birth_ind = "Y"
  ;Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->birth_order = fl_birth_order
Else
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->multiple_birth_ind = "N"
  ;Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->birth_order = ""
Endif

;PID-29 and 30 - Populating Patient Death
If (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->univ_service_id [1]->text = "NMSP-Deceased")
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->pat_death_ind = "Y"
  Set death_cd = uar_get_code_by("DISPLAY", 72, "Date/Time Of Death")

  select into "nl:"
  from 
     clinical_event ce
  where ce.encntr_id = encntr_id 
  and  ce.event_cd = death_cd 
  detail
     oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->pat_death_dt_tm = substring(3,12,ce.result_val)
  with nocounter

Else 
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->pat_death_dt_tm = ""
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->pat_death_ind = "N"

Endif


;;***************************************
;;** ORC Segment                       **
;;***************************************
;;ORC-1
Set oen_reply->ORDER_GROUP [1]->ORC [1]->order_ctrl = "NW"


;;ORC-9
set oen_reply->ORDER_GROUP [1]->ORC [1]->trans_dt_tm = ""

;;ORC-10 - cleanup
Set oen_reply->ORDER_GROUP [1]->ORC [1]->entered_by [1]->suffix = " "
Set oen_reply->ORDER_GROUP [1]->ORC [1]->entered_by [1]->prefix = " "
Set oen_reply->ORDER_GROUP [1]->ORC [1]->entered_by [1]->degree = " "
Set oen_reply->ORDER_GROUP [1]->ORC [1]->entered_by [1]->source = " "
Set oen_reply->ORDER_GROUP [1]->ORC [1]->entered_by [1]->name_type = " "
Set oen_reply->ORDER_GROUP [1]->ORC [1]->entered_by [1]->id_type = " "

;;ORC-12 - send only NPI identifier
set dr_size=size(oen_reply->ORDER_GROUP [1]->ORC [1]->ord_provider ,5)
execute oencpm_msglog build("DOC_SIZE: ", dr_size, char(0))
if(dr_size >1)
                set NPI_dr = "N"
	set a=1
	while (a<=dr_size)
	   if(oen_reply->ORDER_GROUP [1]->ORC [1]->ord_provider [a]->id_type != "National Provider Identifier") 
           	       set dr_size=dr_size-1
           	        set a = a -1
           	        set stat=alterlist(oen_reply->ORDER_GROUP [1]->ORC [1]->ord_provider , dr_size,a)
           	        set NPI_dr ="y"
                    endif
                 set a=a+1
	endwhile
	if(NPI_dr !="y")
	       set stat = alterlist(oen_reply->ORDER_GROUP [1]->ORC [1]->ord_provider  ,0)
	endif
endif

Set oen_reply->ORDER_GROUP [1]->ORC [1]->ord_provider [1]->degree = ""
Set oen_reply->ORDER_GROUP [1]->ORC [1]->ord_provider [1]->name_type = ""	
Set oen_reply->ORDER_GROUP [1]->ORC [1]->ord_provider [1]->assign_auth->name_id = "NPI"
Set oen_reply->ORDER_GROUP [1]->ORC [1]->ord_provider [1]->assign_auth->univ_id = "2.16.840.1.113883.4.6"
Set oen_reply->ORDER_GROUP [1]->ORC [1]->ord_provider [1]->assign_auth->univ_id_type = "ISO"
Set oen_reply->ORDER_GROUP [1]->ORC [1]->ord_provider [1]->id_type = ""
Set oen_reply->ORDER_GROUP [1]->ORC [1]->ord_provider [1]->assign_fac_id = ""  
Set oen_reply->ORDER_GROUP [1]->ORC [1]->ord_provider [1]->assign_fac_id->name_id = ""
Set oen_reply->ORDER_GROUP [1]->ORC [1]->ord_provider [1]->assign_fac_id->univ_id = ""
Set oen_reply->ORDER_GROUP [1]->ORC [1]->ord_provider [1]->assign_fac_id->univ_id_type = ""

;;ORC-13
set oen_reply->ORDER_GROUP [1]->ORC [1]->enterers_loc->nurse_unit = ""

;;ORC-15
set oen_reply->ORDER_GROUP [1]->ORC [1]->order_eff_dt_tm = ""

;;ORC-18
set oen_reply->ORDER_GROUP [1]->ORC [1]->entering_dev->identifier = ""
set oen_reply->ORDER_GROUP [1]->ORC [1]->entering_dev->text = ""

;;ORC-19
set stat = alterlist(oen_reply->ORDER_GROUP [1]->ORC [1]->action_by, 0)

;;ORC-21   FACILITY NAME
declare loc_fac_cd = f8
declare street_add = vc
declare facility_alias = vc
declare facility_npi = f8
Set facility_npi= uar_get_code_by ("DISPLAY",263,"NPI Number")

select into "nl:"
from
   encounter e
   ,organization_alias o
where 
    e.encntr_id = encntr_id
    and  e.organization_id = o.organization_id
    and o.alias_pool_cd = facility_npi
detail
   loc_fac_cd = e.loc_facility_cd
   facility_alias = o.alias
with nocounter

Set oen_reply->ORDER_GROUP [1]->ORC [1]->ord_fac_name [1]->org_name = UAR_GET_CODE_DESCRIPTION(loc_fac_cd)
Set oen_reply->ORDER_GROUP [1]->ORC [1]->ord_fac_name [1]->id =  facility_alias
Set oen_reply->ORDER_GROUP [1]->ORC [1]->ord_fac_name [1]->assign_auth->name_id = "NPI"
Set oen_reply->ORDER_GROUP [1]->ORC [1]->ord_fac_name [1]->assign_auth->univ_id = "2.16.840.1.113883.4.6"
Set oen_reply->ORDER_GROUP [1]->ORC [1]->ord_fac_name [1]->assign_auth->univ_id_type = "ISO"
Set oen_reply->ORDER_GROUP [1]->ORC [1]->ord_fac_name [1]->type_cd =  "NPI"


select into "nl:"
from 
   address a
where 
   a.parent_entity_id = loc_fac_cd
detail
   oen_reply->ORDER_GROUP [1]->ORC [1]->ord_fac_address [1]->street = a.street_addr
   oen_reply->ORDER_GROUP [1]->ORC [1]->ord_fac_address [1]->city = a.city
   oen_reply->ORDER_GROUP [1]->ORC [1]->ord_fac_address [1]->state_prov = a.state
   oen_reply->ORDER_GROUP [1]->ORC [1]->ord_fac_address [1]->zip_code = a .zipcode
   oen_reply->ORDER_GROUP [1]->ORC [1]->ord_fac_address [1]->country =  "USA"  ;a.country
   oen_reply->ORDER_GROUP [1]->ORC [1]->ord_fac_address [1]->county = a.county
with nocounter

;;ORC-23  FACILITY PHONE - GETTING IT FROM ORGANIZATION ???
declare org_id = f8
declare org_phone = vc
select into "nl:"
from
   encounter e
where 
   e.encntr_id = encntr_id
detail
   org_id = e.organization_id
with nocounter

select into "nl:"
from 
   phone p
where 
   p.parent_entity_id = org_id
detail
   org_phone = p.phone_num
with nocounter
Set oen_reply->ORDER_GROUP [1]->ORC [1]->ord_fac_ph_nbr [1]->phone_nbr= org_phone

/*  ** no need to format phone number **
Declare area_code = vc
Declare first_three = vc
Declare last_four = vc
Set area_code = substring(1, 3, org_phone)
Set first_three = substring(4, 3, org_phone)
Set last_four = substring(7, 4, org_phone)
Set oen_reply->ORDER_GROUP [1]->ORC [1]->ord_fac_ph_nbr [1]->phone_nbr= 
             build( "(", area_code, ")", first_three, "-", last_four)
*/

;; OEOCF23ORMORM library only goes up to ORC-24
;;ORC-29 - ORDER TYPE  (Inpatient or Outpatient)
Set stat = alterlist(oen_reply->ORDER_GROUP [1]->ORC [1]->provider_address, 0)
Set oen_reply->ORDER_GROUP [1]->ORC [1]->provider_address [1]->street = 
    concat("|||||", oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->patient_class) 

;;***************************************
;;** OBR Segment                       **
;;***************************************

;;OBR-7
If (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->observation_dt_tm = " ")
    Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->observation_dt_tm =
            cnvtstring(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->status_change_dt_tm) ;5
Endif

;;OBR-10  - clean up
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->collector_id [1]->suffix = " "
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->collector_id [1]->prefix = " "
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->collector_id [1]->degree = " "
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->collector_id [1]->source = " "
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->collector_id [1]->name_type = " "
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->collector_id [1]->id_type = " "

;;OBR-11
set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->specimen_act_cd = ""

;;OBR-14
set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->spec_rec_dt_tm = ""

;;OBR-15
set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->spec_source->spec_name_cd->identifier = ""
set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->spec_source->spec_name_cd->text = ""


;;OBR-16 -- send only NPI identifier
set dr_size=size(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider  ,5)
if(dr_size >1)
	set NPI_dr = "N"
   	set a=1
   	while (a<=dr_size)
   	    if(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider [a]->id_type !="National Provider Identifier") 		
           	       set dr_size=dr_size-1
           	       set a = a -1
           	       set stat=alterlist(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider  , dr_size,a)
           	       set NPI_dr ="y"
                    endif
                    set a=a+1
                endwhile
    if (NPI_dr !="y")
	set stat = alterlist(oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->ord_provider ,0)
    endif
endif



Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider [1]->degree = ""   
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider [1]->assign_auth->name_id ="NPI"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider [1]->assign_auth->univ_id = "2.16.840.1.113883.4.6"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider [1]->assign_auth->univ_id_type = "ISO"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider [1]->name_type = ""
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider [1]->id_type = ""
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider [1]->assign_fac_id = ""
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider [1]->assign_fac_id->name_id = ""
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider [1]->assign_fac_id->univ_id = ""
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider [1]->assign_fac_id->univ_id_type = ""


;;OBR-19 - copy from OBR-20
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->placer_field2 = 
       cnvtstring(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->filler_field1 [1]->value) ;5

;;OBR-20
set stat = alterlist(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->filler_field1, 0)

;;OBR-22
set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->status_change_dt_tm = ""

;;OBR-27
set stat = alterlist(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->quantity_timing, 0)

;;OBR-36
set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->sched_dt_tm = ""


/**********************************************************************************************************************
*   Formatting of NK1, IN1, and OBX segments that come as Prompts.
**********************************************************************************************************************/
execute OP_ORM_STATE_NB_OBX_OUT

execute OP_ORM_STATE_NB_NK1_OUT

;execute OP_ORM_STATE_NB_IN1_OUT 

;begin 4
set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->INS_GROUP [1]->IN1 [1]->insureds_birth_dt = substring(
  1,8,oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->INS_GROUP [1]->IN1 [1]->insureds_birth_dt)
;end 4

execute OP_ORM_STATE_NB_OBX_ADL_OUT



;;OBR-4.1 & 4.2 & 4.3
set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->univ_service_id [1]->identifier = "54089-9"
set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->univ_service_id [1]->text = "Newborn Screening Panel AHIC"
set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->univ_service_id [1]->coding_system = "LN"


;;***************************************
;;** OBX Segment                       **

;;***************************************

;;OBX;4 - Sub_id modifications
    for (y=1 to size(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP, 5))
      Set obx_3 = oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [y]->OBX->observation_id->identifier
      Set first = 0
      Set sub_cnt = 1
      If (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [y]->OBX->observation_sub_id = "")
        For (z = 1 to size(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP, 5))
          If (y != z)
            If (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [y]->OBX->observation_id->identifier = 
                oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [z]->OBX->observation_id->identifier
                and oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [z]->OBX->observation_sub_id ="")
                If (first = 0)
                  Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [y]->OBX->observation_sub_id  = cnvtstring(sub_cnt)
                  Set sub_cnt = sub_cnt + 1
                  Set first = 1
                EndIf
                Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [z]->OBX->observation_sub_id  = cnvtstring(sub_cnt)
                Set sub_cnt = sub_cnt + 1
           EndIf
         EndIf
       EndFor
       EndIf
    Endfor
   Set sub_cnt = 1


;;**************************************
;;** Remove Segments                  **
;;**************************************
;set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NK1, 0)
;set stat = alterlist(oen_reply->PERSON_GROUP [1]->FIN_GROUP, 0)
set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1, 0)

# end_of_script

execute oencpm_msglog build("End of orm_state_newborn_out", char(0))