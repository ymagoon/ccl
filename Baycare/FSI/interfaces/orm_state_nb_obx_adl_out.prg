/*************************************************************************
** Adding additional OBX for State requirements                          **
** Script Name:  orm_state_nb_obx_adl_out                                     **    
**Author: Cerner Corporation                                                                 **
 **************************************************************************/
/**  ---------------------------------------------------------------------------------------------
 *  Mod#   Date	        Author            Description & Requestor Information
 *  1         12/05/16   S Parimi            RFC 155559 update the code in 3rd OBX Birth Plurality
*   2         01/19/17   S Parimi            RFC 674 Retrieve most recent results from CE table
*/

execute oencpm_msglog build("Beginning of orm_state_nb_obx_adl_out", char(0))

/**************************************************************************************************************
Declaring the variables that we'll use to get the information to send to the State.
Trying to use DISPLAYKEY, but it isn't always working.  Sometimes hard-coding event_code.
***************************************************************************************************************/
;;Metabolic Screening Card Number
declare fl_card_nbr_event_cd= f8
set fl_card_nbr_event_cd = uar_get_code_by("DISPLAYKEY", 72, "METABOLICSCREENINGCARDNUMBER")
declare fl_card_nbr = vc
set fl_card_nbr = ""

;;Metabolic Screening Initial Card Number
declare fl_initial_card_nbr_event_cd= f8
set fl_initial_card_nbr_event_cd = uar_get_code_by("DISPLAYKEY", 72, "METABOLICSCREENINGCARDNUMBER")
declare fl_initial_card_nbr = vc
set fl_initial_card_nbr = ""

;;Metabolic Screening Date/Time
declare fl_collection_dt_event_cd= f8
set fl_collection_dt_event_cd = uar_get_code_by("DISPLAYKEY", 72, "METABOLICSCREENINGDATETIMEDRAWN")
declare fl_collection_dt = vc
set fl_collection_dt = ""

;;Metabolic Screening Recollect
declare fl_recollect_event_cd= f8
set fl_recollect_event_cd = uar_get_code_by("DISPLAYKEY", 72, "METABOLICSCREENINGRECOLLECT")
declare fl_recollect = vc
set fl_recollect = ""

;;Birth Type - Single, Twin A, Twin B, etc
declare fl_birth_type_event_cd = f8
set fl_birth_type_event_cd = uar_get_code_by("DISPLAYKEY", 72, "NEONATALMULTIPLEGESTATIONDESCRIPTION")
declare fl_birth_type = vc
set fl_birth_type = ""

;;Birth Order - If twins, triplets
declare fl_birth_order_event_cd = f8
set fl_birth_order_event_cd = uar_get_code_by("DISPLAYKEY", 72, "NEONATALBIRTHORDER")
declare fl_birth_order = vc
set fl_birth_order = ""

;; Feeding type  - maybe various ways to gather this
declare fl_feeding_type_event_cd = f8
set fl_feeding_type_event_cd = uar_get_code_by("DISPLAYKEY", 72, "FEEDINGMETHODNEWBORN")
;;;set fl_feeding_type_event_cd = uar_get_code_by("DISPLAYKEY", 72, "TYPEOFHUMANMILK")
;;;set fl_feeding_type_event_cd = uar_get_code_by("DISPLAYKEY", 72, "HUMANMILK")
;;;set fl_feeding_type_event_cd = uar_get_code_by("DISPLAYKEY", 72, "FORMULATYPES")
;;;set fl_feeding_type_event_cd = uar_get_code_by("DISPLAYKEY", 72, "LATCHSCORE")
declare fl_feeding_type = vc
set fl_feeding_type = ""
       execute oencpm_msglog build("feeding type: ", fl_feeding_type_event_cd, char(0))


;;Transfused ??
declare fl_transfused_ind_event_cd = f8
set fl_transfused_ind_event_cd = uar_get_code_by("DISPLAYKEY", 72, "NEWBORNSCREENINGTRANSFUSED")
declare fl_transfused_ind = vc
set fl_transfused_ind = ""

;; Transfused date
declare fl_transfused_date_event_cd = f8
set fl_transfused_date_event_cd = uar_get_code_by("DISPLAYKEY", 72, "TRANSFUSEDDATEFORNEWBORNSCREENING")
declare fl_transfused_date = vc
set fl_transfused_date = ""

;;;Birth Date/Time
;declare fl_birth_date_time_event_cd = f8
;set fl_birth_date_time_event_cd = uar_get_code_by("DISPLAYKEY", 72, "DELIVERYDATETIMEOFBIRTH")
;declare fl_birth_time = i4
;set fl_birth_time = ""

;declare fl_birth_time = vc
;select into "nl:"
;  p.birth_dt_tm
;from person p
;where p.person_id = person_id
;and p.active_ind = 1
;detail fl_birth_time = format(p.birth_dt_tm, "YYYYMMDDHHMMSS;;d")
  ;execute oencpm_msglog build("DELIVERY_DATE_CD: ", fl_birth_date_time_event_cd, char(0))

;;Gestation Age - send only whole weeks
declare fl_gestation_age_event_cd = f8
set fl_gestation_age_event_cd = uar_get_code_by("DISPLAYKEY", 72, "WEEKSOFGESTATIONATBIRTH")
declare fl_gestation_age = vc
set fl_gestation_age = ""

;;;Birth Weight - send in grams, will need to convert from kg to g
declare fl_birth_weight_event_cd = f8
set fl_birth_weight_event_cd = uar_get_code_by("DISPLAYKEY", 72, "BIRTHWEIGHTKG")
;uar_get_code_by("DISPLAYKEY", 72, "WEIGHTACTUALKGMANUAL")
declare fl_birth_weight = vc
set fl_birth_weight = ""
        execute oencpm_msglog build("BIRTH_WEIGHT_CD: ", fl_birth_weight_event_cd, char(0))

;;;Collection Weight -  send in grams, will need to convert from kg to g
declare fl_coll_weight_event_cd = f8
set fl_coll_weight_event_cd = uar_get_code_by("DISPLAYKEY", 72, "WEIGHTACTUALKG")
declare fl_coll_weight = vc
set fl_coll_weight = ""
        execute oencpm_msglog build("COLLECTION_WEIGHT_CD: ", fl_coll_weight_event_cd, char(0))

;; Specimen date
declare fl_specimen_date_event_cd = f8
set fl_specimen_date_event_cd = 323781239.00
declare fl_specimen_date = vc
set fl_specimen_date = ""
declare fl_specimen_time = vc
set fl_specimen_time = ""

;;Procedure Date/Time
declare fl_procedure_date_event_cd = f8
set fl_procedure_date_event_cd = uar_get_code_by("DISPLAYKEY", 72, "PROCEDUREDATETIME")
declare fl_procedure_date = vc
set fl_procedure_date = ""

;;SPO2 - preductal (RH)
declare fl_spo2_preductal_event_cd = f8
set fl_spo2_preductal_event_cd = uar_get_code_by("DISPLAYKEY", 72, "SPO2PREDUCTALRH")
declare fl_spo2_preductal = vc
set fl_spo2_preductal = ""

;;SPO2 - post ductal (either foot)
declare fl_spo2_postductal_event_cd = f8
set fl_spo2_postductal_event_cd = uar_get_code_by("DISPLAYKEY", 72, "SPO2POSTDUCTALEITHERFOOT")
declare fl_spo2_postductal = vc
set fl_spo2_postductal = ""

;;Post-ductal probe site location
declare fl_postductal_site_event_cd = f8
set fl_postductal_site_event_cd = uar_get_code_by("DISPLAYKEY", 72, "POSTDUCTALPROBESITELOCATION")
declare fl_postductal_site = vc
set fl_postductal_site = ""

;;Intervention
declare fl_intervention_event_cd = f8
set fl_intervention_event_cd = uar_get_code_by("DISPLAYKEY", 72, "INTERVENTION")
declare fl_intervention = vc
set fl_intervention = ""


/*****************************************************************************************************
Now reading clinical event table, using baby's encounter, to get all of the needed info.
******************************************************************************************************/
execute oencpm_msglog build("RECOLLECT_CD: ", fl_recollect_event_cd, char(0))
select into "nl:"
   ce.result_val
from
   clinical_event ce
where
   ce.encntr_id = encntr_id and
   ce.view_level = 1 and
   ce.valid_until_dt_tm > sysdate
order ce.updt_dt_tm
detail 


   ;;Specimen Recollect
   if (ce.event_cd = fl_recollect_event_cd)
      fl_recollect = trim(ce.result_val, 3)
   endif


   ;;Feeding Type
   if (ce.event_cd = fl_feeding_type_event_cd)
      fl_feeding_type = trim(ce.result_val, 3)
   endif

   ;;Screening Card Number
   if (ce.event_cd = fl_card_nbr_event_cd)
         fl_card_nbr = trim(ce.result_val, 3)     	
   endif

   ;;Birth Type
   if (ce.event_cd = fl_birth_type_event_cd)
         fl_birth_type = trim(ce.result_val, 3)     	
   endif

   ;;Birth Order
   if (ce.event_cd = fl_birth_order_event_cd)
         fl_birth_order = trim(ce.result_val, 3)     	
   endif

   ;;Gestational Age  - send only the weeks, not any portion of a week.  ex: 35 2/3 = 35
   if (ce.event_cd = fl_gestation_age_event_cd)
         fl_gestation_age = substring(1,2,ce.result_val)
   endif

   ;;Specimen Date
   if (ce.event_cd = fl_specimen_date_event_cd)
      fl_specimen_date = substring(3, 8, ce.result_val)
   endif   

   ;;Procedure Date/Time
   if (ce.event_cd = fl_procedure_date_event_cd)
      fl_procedure_date = substring(3,8,ce.result_val)
   endif   

   ;;SPO2 - preductal (RH)
   if (ce.event_cd = fl_spo2_preductal_event_cd)
      fl_spo2_preductal = trim(ce.result_val, 3)
   endif  

   ;;SPO2 - post ductal (either foot)
   if (ce.event_cd = fl_spo2_postductal_event_cd)
      fl_spo2_postductal = trim(ce.result_val, 3)
   endif  

   ;;Post-ductal probe site location
   if (ce.event_cd = fl_postductal_site_event_cd)
      fl_postductal_site = trim(ce.result_val, 3)
   endif  

   ;;Intervention
   ;if (ce.event_cd = fl_intervention_event_cd)
   ;   fl_intervention = trim(ce.result_val, 3)
   ;endif  
with nocounter


;;;Separate for Intervention
if (fl_intervention = "")
     set fl_intervention = "Not Tested"
endif

select into "nl:"
   ce.result_val
from
   clinical_event ce
where
   ce.encntr_id = encntr_id and
   ce.event_cd = fl_intervention_event_cd and
   ce.view_level = 1
   ;ce.valid_until_dt_tm > sysdate
order ce.updt_dt_tm
detail
   if (ce.event_cd = fl_intervention_event_cd)
      fl_intervention = trim(ce.result_val, 3)
   endif  

   if (fl_intervention = "Passed")
     fl_intervention = "Passed"
   elseif (fl_intervention = "Notify MD")
      fl_intervention = "Failed"
   else
     fl_intervention = ""
   endif
with nocounter


;;;Separate for Birth Weight
select into "nl:"
   ce.result_val
from
   clinical_event ce
where
   ce.encntr_id = encntr_id and
   ce.event_cd = fl_birth_weight_event_cd and
   ce.view_level = 1 
order ce.event_cd
head ce.event_cd
   ;;Birth Weight  
   if (ce.event_cd = fl_birth_weight_event_cd)
      fl_birth_weight = trim(ce.result_val, 3)
   endif
with nocounter


;;;Separate for Collection Weight
select into "nl:"
   ce.result_val
from
   clinical_event ce
where
   ce.encntr_id = encntr_id and
   ce.event_cd = fl_coll_weight_event_cd and
   ce.view_level = 1 
order ce.event_cd
,ce.clinsig_updt_dt_tm desc
head ce.event_cd
   ;;Collection Weight  
   if (ce.event_cd = fl_coll_weight_event_cd)
      fl_coll_weight = trim(ce.result_val, 3)
   endif
with nocounter

/***
;;;Separate for Birth & Collection Weight
select into "nl:"
   ce.result_val
from
   clinical_event ce
where
   ce.encntr_id = encntr_id and
   ce.view_level = 1 and
   ce.valid_until_dt_tm > sysdate
order ce.updt_dt_tm desc
detail

   ;;Birth Weight  
   if (ce.event_cd = fl_birth_weight_event_cd)
      fl_birth_weight = trim(ce.result_val, 3)
   endif
with nocounter

;;;Separate for Birth & Collection Weight
select into "nl:"
   ce.result_val
from
   clinical_event ce
where
   ce.encntr_id = encntr_id and
   ce.view_level = 1 and
   ce.valid_until_dt_tm > sysdate
order ce.updt_dt_tm desc
detail

   ;;Collection Weight  
   if (ce.event_cd = fl_coll_weight_event_cd)
      fl_coll_weight = trim(ce.result_val, 3)
   endif
with nocounter
***/

   execute oencpm_msglog build("RECOLLECT_ANSWER:  ", fl_recollect, char(0))

 execute oencpm_msglog build("birth weight: ", fl_birth_weight, char(0))


;*** Query for Provider Follow-up
declare follow_doc_id = vc
declare follow_doc_name = vc
declare st_add = vc
declare st_add2 = vc
declare city = vc
declare state = vc
declare zip = vc
declare phone = vc
set pool_cd = uar_get_code_by("DISPLAY", 263, "NPI Number")
set add_type_cd = uar_get_code_by("MEANING", 212, "BUSINESS")
set phone_type_cd = uar_get_code_by("MEANING", 43, "BUSINESS")
  
select into "nl:"
from
   pat_ed_document ped,
   pat_ed_doc_followup pedf,
   prsnl_alias pa,
   address ad,
   phone ph
plan ped
where ped.encntr_id = encntr_id
join pedf
where pedf.pat_ed_doc_id = ped.pat_ed_document_id
join pa
where pa.person_id = pedf.provider_id
and pa.alias_pool_cd = pool_cd
join ad
where ad.parent_entity_id = pa.person_id
and ad.address_type_cd = add_type_cd
and ad.active_ind = 1
join ph
where ph.parent_entity_id = pa.person_id
and ph.phone_type_cd = phone_type_cd
and ph.active_ind = 1
detail 
   follow_doc_id = pa.alias
   follow_doc_name = pedf.provider_name
   st_add = ad.street_addr
   st_add2 = ad.street_addr2
   city = ad.city
   state = ad.state
   zip = ad.zipcode
   phone = ph.phone_num
with nocounter


/******
;*** separate query for birth time.  Need to get event_id from CE table, and then read ce_date_result table.

declare event_id = f8
select into "nl:"
   ce.event_id
from
   clinical_event ce
where
   ce.encntr_id = encntr_id and
   ce.view_level = 1 and
   ce.valid_until_dt_tm > sysdate and
   ce.event_cd = fl_birth_date_time_event_cd
detail
  event_id = ce.event_id
with nocounter

select into "nl:"
    cdr.result_dt_tm
from
   ce_date_result cdr
where
   cdr.event_id = event_id
detail
   fl_birth_time = cnvttime(cdr.result_dt_tm)
with nocounter
******/

/**************************************************************************************************************
;;;  Building OBX segments manually, populating with information from above, if filled out.  
;;;  Sending all OBX segments, regardless of whether populated or empty
;;;  We get some OBX segments from AOE questions, so we'll query to find out how many OBX 
;;;  segments we already have, then add more to them.
***************************************************************************************************************/
Set obxsz = 0
Set obxsz = size(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP,5)
Set stat = alterlist(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP, (18 + obxsz))

        execute oencpm_msglog build("building OBX segments", char(0))
 execute oencpm_msglog build("OBC_COUNT:",obxsz, char(0))

;;;1st OBX - STATE
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [1+ obxsz]->OBX->value_type = "ST"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [1+ obxsz]->OBX->observation_id->identifier = "57716-3"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [1+ obxsz]->OBX->observation_id->text = "State Identifier"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [1+ obxsz]->OBX->observation_value [1]->value_1 = "FL"


;;;2nd OBX - UNIQUE BAR CODE OF INITIAL SAMPLE
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [2+ obxsz]->OBX->value_type = "ST"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [2+ obxsz]->OBX->observation_id->identifier = "57711-4"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [2+ obxsz]->OBX->observation_id->text = 
                               "Unique bar code of original sample"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [2+ obxsz]->OBX->observation_value [1]->value_1 = ""


;;; 3rd OBX - BIRTH PLUARLITY
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [3+ obxsz]->OBX->value_type = "CE"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [3+ obxsz]->OBX->observation_id->identifier = "57722-1"
 ;    uar_get_code_by("DISPLAYKEY", 72, "NEONATALMULTIPLEGESTATIONDESCRIPTION ")
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [3+ obxsz]->OBX->observation_id->text = "Birth pluarlity of Pregnancy"
If (fl_birth_type = "Singleton") 
  Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [3+ obxsz]->OBX->observation_value [1]->value_1=
                                 "LA12411-7^Singleton^LN"
   ;Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->multiple_birth_ind = "N"
Elseif (fl_birth_type = "Twins")
  Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [3+ obxsz]->OBX->observation_value [1]->value_1=
                                 "LA12412-5^Twins^LN"
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->multiple_birth_ind = "Y"
Elseif (fl_birth_type = "Triplets")
  Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [3+ obxsz]->OBX->observation_value [1]->value_1=
                                 "LA12413-3^Triplets^LN"
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->multiple_birth_ind = "Y"
Elseif (fl_birth_type = "Quadruplets")
  Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [3+ obxsz]->OBX->observation_value [1]->value_1=
                                 "LA12414-1^Quadruplets^LN"
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->multiple_birth_ind = "Y"
Elseif (fl_birth_type = "Quintuplets")
  Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [3+ obxsz]->OBX->observation_value [1]->value_1=
                                 "LA12415-8^Quintuplets^LN"
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->multiple_birth_ind = "Y"
Elseif (fl_birth_type = "Sextuplets")
  Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [3+ obxsz]->OBX->observation_value [1]->value_1=
                                 "LA12416-6^Sextuplets^LN"
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->multiple_birth_ind = "Y"
Elseif (fl_birth_type = "Septuplets")
  Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [3+ obxsz]->OBX->observation_value [1]->value_1=
                                 "LA12453-9^Septuplets^LN"
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->multiple_birth_ind = "Y"
Elseif (fl_birth_type = "Octuplets")
  Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [3+ obxsz]->OBX->observation_value [1]->value_1=
                                 "LA12913-2^Octuplets^LN"
   Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->multiple_birth_ind = "Y"
else
    Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [3+ obxsz]->OBX->observation_value [1]->value_1=
                                   "LA12914-0^Unknown plurality^LN"
    ;Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->birth_order = "N"
Endif


;;;4th OBX - BIRTH-TIME
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [4+ obxsz]->OBX->value_type = "TM"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [4+ obxsz]->OBX->observation_id->identifier = "57715-5"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [4+ obxsz]->OBX->observation_id->text = "Birth time"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [4+ obxsz]->OBX->observation_value [1]->value_1 = 
   concat(substring(9, 4, fl_birth_date_time), "-0500")

;;; 5th OBX - GESTATIONAL AGE - in weeks
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [5+ obxsz]->OBX->value_type = "NM"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [5+ obxsz]->OBX->observation_id->identifier = "57714-8"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [5+ obxsz]->OBX->observation_id->text = 
          "Obstetric estimation of gestational age"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [5+ obxsz]->OBX->observation_value [1]->value_1 = fl_gestation_age
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [5+ obxsz]->OBX->units->identifier = "wk"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [5+ obxsz]->OBX->units->text = "weeks"

;;; 6th OBX - BIRTHWEIGHT - in grams
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [6+ obxsz]->OBX->value_type = "NM"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [6+ obxsz]->OBX->observation_id->identifier = "8339-4"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [6+ obxsz]->OBX->observation_id->text = "Birthweight"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [6+ obxsz]->OBX->observation_value [1]->value_1 = 
  cnvtstring(cnvtreal(fl_birth_weight)*1000)
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [6+ obxsz]->OBX->units->identifier = "g"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [6+ obxsz]->OBX->units->text = "gram"

;;; 7th OBX - COLLECTIONWEIGHT - in grams
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [7+ obxsz]->OBX->value_type = "NM"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [7+ obxsz]->OBX->observation_id->identifier = "58229-6"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [7+ obxsz]->OBX->observation_id->text = 
  "Body weight Measured --when specimen taken"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [7+ obxsz]->OBX->observation_value [1]->value_1 = 
  cnvtstring(cnvtreal(fl_coll_weight)*1000)
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [7+ obxsz]->OBX->units->identifier = "g"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [7+ obxsz]->OBX->units->text = "gram"


;;;8th OBX - POST-DISCHARGE PROVIDER ID 
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [8+ obxsz]->OBX->value_type = "TX"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [8+ obxsz]->OBX->observation_id->identifier = "62323-1"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [8+ obxsz]->OBX->observation_id->text = 
                               "Post-discharge provider ID"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [8+ obxsz]->OBX->observation_value [1]->value_1 = 
     follow_doc_id
     ;oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider [1]->id_nbr 

;;;9h OBX - POST-DISCHARGE PROVIDER NAME 
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [9+ obxsz]->OBX->value_type = "TX"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [9+ obxsz]->OBX->observation_id->identifier = "62324-9"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [9+ obxsz]->OBX->observation_id->text = 
                              "Post-discharge provider Name"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [9+ obxsz]->OBX->observation_value [1]->value_1 = 
     follow_doc_name
     ;build(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider [1]->last_name, ", " ,
     ;         oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->ord_provider [1]->first_name)

;;;10th OBX - POST-DISCHARGE PROVIDER PRACTICE ID 
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [10+ obxsz]->OBX->value_type = "TX"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [10+ obxsz]->OBX->observation_id->identifier = "62325-6"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [10+ obxsz]->OBX->observation_id->text = 
                              "Post-discharge provider practice ID"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [10+ obxsz]->OBX->observation_value [1]->value_1 = 
      oen_reply->ORDER_GROUP [1]->ORC [1]->ord_fac_name [1]->id 

;;;11th OBX - POST-DISCHARGE PROVIDER PRACTICE NAME 
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [11+ obxsz]->OBX->value_type = "TX"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [11+ obxsz]->OBX->observation_id->identifier = "62326-4"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [11+ obxsz]->OBX->observation_id->text = 
                               "Post-discharge provider practice name"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [11+ obxsz]->OBX->observation_value [1]->value_1 = 
       oen_reply->ORDER_GROUP [1]->ORC [1]->ord_fac_name [1]->org_name 

;;;12th OBX - POST-DISCHARGE PROVIDER PRACTICE ADDRESS
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [12+ obxsz]->OBX->value_type = "TX"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [12+ obxsz]->OBX->observation_id->identifier = "62327-2"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [12+ obxsz]->OBX->observation_id->text = 
                              "Post-discharge provider practice address"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [12+ obxsz]->OBX->observation_value [1]->value_1 = 
       concat(st_add , ", " , st_add2, ", ", city, ", ", state, " ", zip)

       ;concat( oen_reply->ORDER_GROUP [1]->ORC [1]->ord_fac_address [1]->street , ", " ,
       ;         oen_reply->ORDER_GROUP [1]->ORC [1]->ord_fac_address [1]->city , ", " ,
       ;         oen_reply->ORDER_GROUP [1]->ORC [1]->ord_fac_address [1]->state_prov , " ",
       ;         oen_reply->ORDER_GROUP [1]->ORC [1]->ord_fac_address [1]->zip_code )

;;;13th OBX - POST-DISCHARGE PROVIDER PRACTICE PHONE 
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [13+ obxsz]->OBX->value_type = "TX"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [13+ obxsz]->OBX->observation_id->identifier = "62328-0"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [13+ obxsz]->OBX->observation_id->text = 
                               "Post-discharge provider practice phone"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [13+ obxsz]->OBX->observation_value [1]->value_1 = 
      phone
       ;oen_reply->ORDER_GROUP [1]->ORC [1]->ord_fac_ph_nbr [1]->phone_nbr 


;;;14th OBX - Procedure Date/Time
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [14+ obxsz]->OBX->value_type = "DT"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [14+ obxsz]->OBX->observation_id->identifier = "FL-NBS-010"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [14+ obxsz]->OBX->observation_id->text = 
                               "Procedure Date/Time"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [14+ obxsz]->OBX->observation_value [1]->value_1 = fl_procedure_date

;;;15th OBX - SPO2 - preductal (RH)
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [15+ obxsz]->OBX->value_type = "NM"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [15+ obxsz]->OBX->observation_id->identifier = "FL-NBS-011"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [15+ obxsz]->OBX->observation_id->text = 
                               "SPO2 - preductal (RH)"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [15+ obxsz]->OBX->observation_value [1]->value_1 = fl_spo2_preductal

;;;16th OBX - SPO2 - post ductal (either foot)
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [16+ obxsz]->OBX->value_type = "NM"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [16+ obxsz]->OBX->observation_id->identifier = "FL-NBS-012"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [16+ obxsz]->OBX->observation_id->text = 
                               "SPO2 - post ductal (either foot)"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [16+ obxsz]->OBX->observation_value [1]->value_1 = fl_spo2_postductal

;;;17th OBX - Post-ductal probe site location
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [17+ obxsz]->OBX->value_type = "TX"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [17+ obxsz]->OBX->observation_id->identifier = "FL-NBS-013"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [17+ obxsz]->OBX->observation_id->text = 
                               "Post-ductal probe site location"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [17+ obxsz]->OBX->observation_value [1]->value_1 = fl_postductal_site

;;;18th OBX - Intervention
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [18+ obxsz]->OBX->value_type = "TX"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [18+ obxsz]->OBX->observation_id->identifier = "FL-NBS-014"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [18+ obxsz]->OBX->observation_id->text = 
                               "Intervention"
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [18+ obxsz]->OBX->observation_value [1]->value_1 = fl_intervention



        execute oencpm_msglog build("done building OBX segments", char(0))

free set indx
declare indx = i2
declare obx_sz = i2
set  indx = 1
set obx_sz = size(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP,5)

execute oencpm_msglog build("OBX_SIZE: ", obx_sz, char(0))

for (indx = 1 to obx_sz)
   set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [indx]->OBX->set_id =cnvtstring(indx)  ;;** this isn't quite right. 
   set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [indx]->OBX->observation_id->coding_system = "LN"
   set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [indx]->OBX->observation_res_status = "O"
endfor

        execute oencpm_msglog build("done modifying OBX segments", char(0))

# end_of_script

execute oencpm_msglog build("End of orm_state_nb_obx_2", char(0))