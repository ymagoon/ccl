/**************************************************************************
                      MODIFICATION CONTROL LOG                 *
**************************************************************************
 Mod Date     Engineer      Comment
 --- -------- ------------  ---------------------------------------
 000 02/16/11 Akcia - SE    Initial release
 
*************************************************************************/
drop program mayo_mn_trans_care_nh_poc:dba go
create program mayo_mn_trans_care_nh_poc:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
 
with OUTDEV
 
 
declare census_cd = f8 with protect, constant(uar_get_code_by("MEANING", 339, "CENSUS"))
declare canceled_cd = f8 with protect, constant(uar_get_code_by("MEANING", 12025, "CANCELED"))
;declare ssn_cd = f8 with protect, constant(uar_get_code_by("MEANING", 4, "SSN"))
declare emer_contact_cd = f8 with protect, constant(uar_get_code_by("MEANING", 351, "EMC"))
declare home_cd = f8 with protect, constant(uar_get_code_by("MEANING", 43, "HOME"))
declare ordered_cd = f8 with protect, constant(uar_get_code_by("MEANING", 6004, "ORDERED"))
declare sens_deficits_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 14003, "SENSORYDEFICITS"))
declare swallow_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 14003, "SWALLOWINGDIFFICULTYASPIRATIONRISK"))
declare speech_char_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 14003, "SPEECHCHARACTERISTICS"))
declare language_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 14003, "LANGUAGES"))
declare urinary_elim_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 14003, "URINARYELIMINATION"))
declare clin_indication_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 14003, "URINARYCATHETERCLINICALINDICATION"))
declare last_bowel_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 14003, "BOWELMOVEMENTLASTDATE"))
declare fall_risk_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 14003, "FALLRISKSCOREHENDRICHII"))
declare skin_integrity_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 14003, "SKININTEGRITY"))
declare skin_integ_risk_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 14003, "BRADENSCORE"))
declare speech_mem_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 14003, "SPEECHMEMORYANDJUDGEMENT"))
declare speech_exp_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 14003, "SPEECHEXPRESSION"))
declare speech_prod_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 14003, "SPEECHPRODUCTION"))
declare speech_comp_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 14003, "SPEECHCOMPREHENSION"))
declare gait_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 14003, "GAIT"))
declare orientation_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 14003, "ORIENTATION"))
declare level_cons_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 14003, "LEVELOFCONSCIOUSNESS"))
 
declare activity_status_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 14003, "ACTIVITYSTATUSADL"))
declare activity_assist_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 14003, "ACTIVITYASSISTANCE"))
declare assist_device_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 14003, "ASSISTIVEDEVICE"))
declare feed_assist_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 14003, "FEEDING ASSISTANCE"))
declare elim_assist_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 14003, "ELIMINATIONASSISTANCEOFFEREDQ2H"))
declare foley_cath_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 14003, "FOLEYCATHETERCAREDONE"))
 
declare pd_patient_cd = f8 with protect, constant(uar_get_code_by("DESCRIPTION", 72, "Personal Devices-With Patient"))
declare pd_family_cd = f8 with protect, constant(uar_get_code_by("DESCRIPTION", 72, "Personal Devices-With Family"))
declare pd_security_cd = f8 with protect, constant(uar_get_code_by("DESCRIPTION", 72, "Personal Devices-Sent to Security"))
declare pd_bedside_cd = f8 with protect, constant(uar_get_code_by("DESCRIPTION", 72, "Personal Devices-At Bedside"))
declare ostomy_loc_1_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "OSTOMY1LOCATION"))
declare ostomy_type_1_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "OSTOMY1TYPE"))
declare ostomy_loc_2_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "OSTOMY2LOCATION"))
declare ostomy_type_2_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "OSTOMY2TYPE"))
declare ostomy_loc_3_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "OSTOMY3LOCATION"))
declare ostomy_type_3_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "OSTOMY3TYPE"))
 
declare ostomy_act_1_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "OSTOMY1ACTIVITY"))
declare ostomy_lumen_1_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "OSTOMY1LUMEN"))
declare ostomy_act_2_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "OSTOMY2ACTIVITY"))
declare ostomy_lumen_2_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "OSTOMY2LUMEN"))
declare ostomy_act_3_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "OSTOMY3ACTIVITY"))
declare ostomy_lumen_3_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "OSTOMY3LUMEN"))
 
declare ostomy_mucosa_1_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "OSTOMY1MUCOSA"))
declare ostomy_skin_1_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "OSTOMY1PERISTOMALSKIN"))
declare ostomy_mucosa_2_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "OSTOMY2MUCOSA"))
declare ostomy_skin_2_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "OSTOMY2PERISTOMALSKIN"))
declare ostomy_mucosa_3_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "OSTOMY3MUCOSA"))
declare ostomy_skin_3_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "OSTOMY3PERISTOMALSKIN"))
 
declare skin_abnorm_grid_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "SKINABNORMALITYLOCATIONGRID"))
 
;declare inc_wou_type_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "INCISIONWOUNDTYPE"))
;declare inc_wou_location_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "INCISIONWOUNDLOCATION"))
;declare inc_wou_lateral_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "INCISIONWOUNDLATERALITY"))
;declare inc_wou_desc_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "INCISIONWOUNDDESCRIPTION"))
;declare inc_wou_color_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "INCISIONWOUNDCOLOR"))
;declare inc_wou_length_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "INCISIONWOUNDLENGTH"))
;declare inc_wou_width_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "INCISIONWOUNDWIDTH"))
;declare inc_wou_depth_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "INCISIONWOUNDDEPTH"))
;declare inc_wou_drain_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "INCISIONWOUNDDRAINAGE"))
;declare inc_wou_drain_amt_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "INCISIONWOUNDDRAINAGEAMOUNT"))
;declare wound_clean_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "WOUNDCLEANSINGIRRIGATION"))
;declare wound_dress_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "WOUNDDRESSING"))
;declare neuro_vasc_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "NEUROVASCULARSTATUS"))
;declare inc_wou_comment_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "INCISIONWOUNDCOMMENT"))
 
declare adv_dir_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "ADVANCEDIRECTIVES"))
declare adv_dir_date_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "ADVANCEDIRECTIVEDATE"))
declare adv_dir_type_cd = f8 with protect, constant(uar_get_code_by("DESCRIPTION", 72, "Advance Directive Type"))
declare med_poa_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "MEDICALPOWEROFATTORNEYNAME"))
declare act_poa_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "ACTIVATIONOFPOWEROFATTORNEY"))
declare poa_act_date_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "POWEROFATTORNEYACTIVATIONDATE"))
declare poa_inact_date_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "POWEROFATTORNEYINACTIVATIONDATE"))
declare guard_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "GUARDIANSHIP"))
declare guard_type_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "GUARDIANSHIPTYPE"))
declare guard_date_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "GUARDIANSHIPDATE"))
 
declare dia_bp_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "DIASTOLICBLOODPRESSURE"))
declare sys_bp_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "SYSTOLICBLOODPRESSURE"))
declare height_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "HEIGHT"))
declare act_weight_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "ACTUALWEIGHT"))
declare bp_loc_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "BPLOCATION"))
declare pulse_rate_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "PERIPHERALPULSERATE"))
declare resp_rate_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "RESPIRATORYRATE"))
declare temp_core_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "TEMPERATURECORE"))
declare limb_alert_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "LIMBALERT"))
declare limb_reason_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "LIMBALERTREASON"))
 
declare apical_hr_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "APICALHEARTRATE"))
declare spo2_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "SPO2"))
declare o2_flow_rate_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "OXYGENFLOWRATE"))
declare oxygen_therapy_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "OXYGENTHERAPY"))
 
declare bed_bath_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "BEDBATH"))
declare oral_care_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "ORALCARE"))
declare peri_care_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "PERICARE"))
declare shave_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "SHAVE"))
declare shower_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "SHOWER"))
 
declare uc_insert_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "URINARYCATHETERINSERTION"))
declare uc_discont_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "CATHETERDISCONTINUED"))
declare uc_insert_dt_tm_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "DATETIMECATHETERINSERTION"))
declare uc_discon_dt_tm_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "DATETIMECATHETERDISCONTINUED"))
declare cath_insert_site_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "URINARYCATHETERINSERTIONSITE"))
declare cath_size_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "URINARYCATHETERSIZE"))
declare cath_type_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "URINARYCATHETERTYPE"))
declare cath_balloon_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "URINARYCATHETERBALLOONINFLATION"))
declare urinary_cath_form_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "URINARYCATHETERINSERTDISCONTINUEFORM"))
declare adult_adm_assess_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "ADULTADMISSIONASSESSMENTFORM"))
 
declare influ_inactivated_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "INFLUENZAVIRUSVACCINEINACTIVATED"))
declare influ_live_triv_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "INFLUENZAVIRUSVACCINELIVETRIVALENT"))
declare influ_virus_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "INFLUENZAVIRUSVACCINE"))
declare influ_h1n1_inact_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "INFLUENZAVIRUSVACCINEH1N1INACTIVAT"))
declare influ_h1n1_live_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "INFLUENZAVIRUSVACCINEH1N1LIVE"))
declare pneumo_23_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "PNEUMOCOCCAL23VALENTVACCINE"))
declare pneumo_13_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "PNEUMOCOCCAL13VALENTVACCINE"))
declare pneumo_7_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "PNEUMOCOCCAL7VALENTVACCINE"))
declare central_line1_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "CENTRALIV1"))
declare central_line2_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "CENTRALIV2"))
declare central_line3_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "CENTRALIV3"))
declare central_line4_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "CENTRALIV4"))
declare wound_care_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "INCISIONWOUNDCAREGRID"))
declare incis_activity_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "INCISIONWOUNDACTIVITY"))
declare incis_numbering_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "INCISIONWOUNDNUMERING"))
declare pain1_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "PAIN1"))
declare pain2_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "PAIN2"))
declare pain3_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "PAIN3"))
declare diet_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 200, "DIET"))
declare diet_npo_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 200, "DIETNPO"))
declare diet_npo_pro_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 200, "DIETNPOFORPROCEDURE"))
declare trans_platelets_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 200, "TRANSFUSEBLOODPRODUCTPLATELETSPHER"))
declare trans_packed_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 200, "TRANSFUSEBLOODPRODUCTREDBLOODCELLS"))
declare trans_frozen_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 200, "TRANSFUSEBLOODPRODUCTFRESHFROZENPL"))
declare trans_cryo_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 200, "TRANSFUSEBLOODPRODUCTCRYOPRECIPITATE"))
declare code_status_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 200, "RESUSCITATIONSTATUS"))
declare diag_sug_bill_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 17, "SUGGESTEDBILLING"))
declare diag_bill_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 17, "BILLINGDIAGNOSIS"))
declare diag_admit_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 17, "ADMITTING"))
declare diag_rfv_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 17, "REASONFORVISIT"))
declare diag_work_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 17, "WORKING"))
declare snomed_cd = f8 with protect, constant(uar_get_code_by("MEANING", 400, "SNMCT"))
declare icd9_cd = f8 with protect, constant(uar_get_code_by("MEANING", 400, "ICD9"))
declare hours_back_24_cd = f8 with protect, constant(cnvtlookbehind("24,H"))

;declare _cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 14003, ""))
 
call echo(pd_patient_cd)
record data (
1 person_id = f8
1 encntr_id = f8
1 pat_name = vc
1 dob = vc
1 ssn = vc
1 facility = vc
1 address1 = vc
1 address2 = vc
1 city = vc
1 state = vc
1 zipcode = vc
1 home_phone = vc
1 emer_contact = vc
1 emer_phone = vc
1 admit_dt_tm = vc
1 speech_char = vc
1 swallow_diff = vc
1 language = vc
1 sensory_deficits = vc
1 speech_comp = vc
1 speech_express= vc
1 speech_prod = vc
1 speech_memory = vc
1 pd_bedside = vc
1 pd_security = vc
1 pd_family = vc
1 pd_patient = vc
1 urinary_elim = vc
1 clinical_ind = vc
1 ostomy = vc
1 last_bm = vc
1 uc_insert = vc
1 uc_discon = vc
1 uc_insert_dt_tm = vc
1 uc_discon_dt_tm = vc
1 insertion_site = vc
1 catheter_size = vc
1 catheter_type = vc
1 balloon_inflation = vc
1 diagnosis = vc
1 infect_illness = vc
1 problems = vc
1 allergies = vc
1 blood_product = vc
1 fall_risk = vc
1 code_status = vc
1 vaccines = vc
1 diet_order = vc
1 orientation = vc
1 level_cons = vc
1 gait = vc
1 core_temp = vc
1 height = vc
1 act_weight = vc
1 sys_bp = vc
1 dia_bp = vc
1 bp_loc = vc
1 peri_pulse = vc
1 resp_rate = vc
1 apical_hr = vc
1 spo2 = vc
1 o2_flow_rate = vc
1 oxygen_therapy = vc
1 limb_alert = vc
1 limb_reason = vc
1 pain1 = vc
1 pain2 = vc
1 pain3 = vc
1 skin_integ = vc
1 skin_integ_risk = vc
1 wound_care[*]
  2 wound_num = vc
  2 wound_detail = vc
1 skin_abnorm[*]
  2 skin_num = vc
  2 skin_detail = vc
1 ostomy_1 = vc
1 ostomy_2 = vc
1 ostomy_3 = vc
1 ostomy_type_1 = vc
1 ostomy_loc_1 = vc
1 ostomy_type_2 = vc
1 ostomy_loc_2 = vc
1 ostomy_type_3 = vc
1 ostomy_loc_3 = vc
1 ostomy_act_1 = vc
1 ostomy_lumen_1 = vc
1 ostomy_act_2 = vc
1 ostomy_lumen_2 = vc
1 ostomy_act_3 = vc
1 ostomy_lumen_3 = vc
1 ostomy_mucosa_1 = vc
1 ostomy_skin_1 = vc
1 ostomy_mucosa_2 = vc
1 ostomy_skin_2 = vc
1 ostomy_mucosa_3 = vc
1 ostomy_skin_3 = vc
1 central_line1 = vc
1 central_line2 = vc
1 central_line3 = vc
1 central_line4 = vc
1 activity_status= vc
1 activity_assistance = vc
1 assistive_device = vc
1 ha_bed_bath = vc
1 ha_oral_care = vc
1 ha_peri_care = vc
1 ha_shave = vc
1 ha_shower = vc
1 foley_catheter = vc
1 elim_assistance = vc
1 feeding_assist = vc
1 adv_dir = vc
1 adv_dir_date = vc
1 adv_dir_type = vc
1 power_of_attorney = vc
1 activation_poa = vc
1 act_poa_date = vc
1 inact_poa_date = vc
1 guardianship = vc
1 guard_type = vc
1 guard_date = vc
1 hp_fin_class = vc
1 hp_plan_type = vc
1 hp_plan_name = vc
)
; set data->central_line_test = concat("Activity Type: Insert new site, Date of Insertion: 06/08/2009,",
;  " Access Type: Implanted port, Number of Lumens:  Single, Central Line Site:  Femoral vein,",
;  " Central IV Laterality:  Left, Central Line IV Size: 2, Catheter Length: 10, External Catheter Length:  5 cm," ,
;  " Radiographic Confirmation: No, IV Mid Arm Circumference: 5 cm")
; set data->allergy_test = concat("Substance: latex",char(10),"Reaction: rash")
;
 
select into "nl:"
 
from
encounter e,
person p,
address a,
;person_alias pa,
person_person_reltn ppr,
person p1,
phone ph,
phone ph1,
encntr_plan_reltn epr,
health_plan hp
 
plan e
where e.encntr_id = request->visit[1]->encntr_id   ; 88281581.00 ;  ;77572743.00  ;72206354.00    ;72204630.00  ;   72204627.00
 
join p
where p.person_id = e.person_id
 
;join pa
;where pa.person_id = outerjoin(p.person_id)
;  and pa.person_alias_type_cd = outerjoin(ssn_cd)
;  and pa.active_ind = outerjoin(1)
;  and pa.end_effective_dt_tm > outerjoin(sysdate)
 
join a
where a.parent_entity_id = outerjoin(p.person_id)
  and a.parent_entity_name = outerjoin("PERSON")
  and a.active_ind = outerjoin(1)
  and a.end_effective_dt_tm > outerjoin(sysdate)
 
join ppr
where ppr.person_id = outerjoin(p.person_id)
  and ppr.person_reltn_type_cd = outerjoin(emer_contact_cd)
  and ppr.active_ind = outerjoin(1)
  and ppr.end_effective_dt_tm > outerjoin(sysdate)
 
join p1
where p1.person_id = outerjoin(ppr.related_person_id)
 
join ph
where ph.parent_entity_id = outerjoin(p.person_id)
  and ph.parent_entity_name = outerjoin("PERSON")
  and ph.phone_type_cd = outerjoin(home_cd)
  and ph.active_ind  = outerjoin(1)
  and ph.end_effective_dt_tm > outerjoin(sysdate)
 
join ph1
where ph1.parent_entity_id = outerjoin(ppr.related_person_id)
  and ph1.parent_entity_name = outerjoin("PERSON")
  and ph1.phone_type_cd = outerjoin(home_cd)
  and ph1.active_ind  = outerjoin(1)
  and ph1.end_effective_dt_tm > outerjoin(sysdate)
 
join epr
where epr.encntr_id = outerjoin(e.encntr_id)
  and epr.priority_seq = outerjoin(1)
  and epr.active_ind = outerjoin(1)
  and epr.end_effective_dt_tm > outerjoin(sysdate)
 
join hp
where hp.health_plan_id = outerjoin(epr.health_plan_id)
 
detail
data->person_id = p.person_id
data->encntr_id = e.encntr_id
data->pat_name = p.name_full_formatted
data->dob = format(p.birth_dt_tm,"mm/dd/yy;;d")
;data->ssn = cnvtalias(pa.alias,pa.alias_pool_cd)
data->facility = uar_get_code_description(e.loc_facility_cd)
data->address1 = a.street_addr
data->address2 = a.street_addr2
data->home_phone = cnvtphone(replace(replace(replace(ph.phone_num,"(",""),")",""),"-",""),ph.phone_format_cd)
data->emer_contact = p1.name_full_formatted
data->emer_phone = cnvtphone(replace(replace(replace(ph1.phone_num,"(",""),")",""),"-",""),ph1.phone_format_cd)
data->admit_dt_tm = format(e.reg_dt_tm,"mm/dd/yy hh:mm;;d")
data->hp_fin_class = uar_get_code_display(hp.financial_class_cd)
data->hp_plan_type = uar_get_code_display(hp.plan_type_cd)
data->hp_plan_name = hp.plan_name
with nocounter
 
;get single clinical events
select into "nl:"
from
clinical_event ce,
ce_date_result cdr
 
plan ce
where ce.encntr_id = data->encntr_id
  and ce.task_assay_cd in (sens_deficits_cd,swallow_cd,speech_char_cd,language_cd,urinary_elim_cd,clin_indication_cd,
  							last_bowel_cd,fall_risk_cd,skin_integrity_cd,skin_integ_risk_cd,speech_mem_cd,speech_exp_cd,
  							speech_prod_cd,speech_comp_cd,pd_patient_cd,pd_family_cd,pd_security_cd,pd_bedside_cd,
  							gait_cd,orientation_cd,level_cons_cd,adv_dir_cd,adv_dir_date_cd,adv_dir_type_cd,med_poa_cd,
  							act_poa_cd,poa_act_date_cd,poa_inact_date_cd,guard_cd,guard_type_cd,guard_date_cd,
  							activity_status_cd,activity_assist_cd,assist_device_cd,feed_assist_cd,elim_assist_cd,
  							foley_cath_cd)
  and ce.valid_until_dt_tm > sysdate
  and not ce.result_status_cd in (28,31)
 
join cdr
where cdr.event_id = outerjoin(ce.event_id)
  and cdr.valid_until_dt_tm > outerjoin(sysdate)
 
order ce.task_assay_cd, ce.event_end_dt_tm desc
 
head ce.task_assay_cd
case (ce.task_assay_cd)
  of sens_deficits_cd: data->sensory_deficits = ce.result_val
  of swallow_cd: data->swallow_diff = ce.result_val
  of speech_char_cd: data->speech_char = ce.result_val
  of language_cd: data->language = ce.result_val
  of urinary_elim_cd: data->urinary_elim = ce.result_val
  of clin_indication_cd: data->clinical_ind = ce.result_val
  of last_bowel_cd: data->last_bm = format(cdr.result_dt_tm,"mm/dd/yy;;d")
  of fall_risk_cd: data->fall_risk = ce.result_val
  of skin_integrity_cd: data->skin_integ = ce.result_val
  of skin_integ_risk_cd: data->skin_integ_risk = ce.result_val
  of speech_mem_cd: data->speech_memory = ce.result_val
  of speech_exp_cd: data->speech_express = ce.result_val
  of speech_prod_cd: data->speech_prod = ce.result_val
  of speech_comp_cd: data->speech_comp = ce.result_val
  of pd_patient_cd: data->pd_patient = ce.result_val
  of pd_family_cd: data->pd_family = ce.result_val
  of pd_security_cd: data->pd_security = ce.result_val
  of pd_bedside_cd: data->pd_bedside = ce.result_val
  of gait_cd: data->gait = ce.result_val
  of orientation_cd: data->orientation = ce.result_val
  of level_cons_cd: data->level_cons = ce.result_val
  of adv_dir_cd: data->adv_dir = ce.result_val
  of adv_dir_date_cd: data->adv_dir_date = ce.result_val
  of adv_dir_type_cd: data->adv_dir_type = ce.result_val
  of med_poa_cd: data->power_of_attorney = ce.result_val
  of act_poa_cd: data->activation_poa = ce.result_val
  of poa_act_date_cd: data->act_poa_date = format(cdr.result_dt_tm,"mm/dd/yy;;d")
  of poa_inact_date_cd: data->inact_poa_date = format(cdr.result_dt_tm,"mm/dd/yy;;d")
  of guard_cd: data->guardianship = ce.result_val
  of guard_type_cd: data->guard_type = ce.result_val
  of guard_date_cd: data->guard_date = format(cdr.result_dt_tm,"mm/dd/yy;;d")
  of activity_status_cd: data->activity_status = ce.result_val
  of activity_assist_cd: data->activity_assistance = ce.result_val
  of assist_device_cd: data->assistive_device = ce.result_val
  of feed_assist_cd: data->feeding_assist = ce.result_val
  of elim_assist_cd: data->elim_assistance = ce.result_val
  of foley_cath_cd: data->foley_catheter = ce.result_val
endcase
;detail
 
with nocounter
 
 
;get single clinical events by event_cd
select into "nl:"
from
clinical_event ce,
ce_date_result cdr
 
plan ce
where ce.encntr_id = data->encntr_id
  and ce.event_cd in (pd_patient_cd,pd_family_cd,pd_security_cd,pd_bedside_cd,ostomy_loc_1_cd,ostomy_type_1_cd
  						,ostomy_loc_2_cd,ostomy_type_2_cd,ostomy_loc_3_cd,ostomy_type_3_cd,
  						dia_bp_cd,sys_bp_cd,height_cd,act_weight_cd,bp_loc_cd,o2_flow_rate_cd,oxygen_therapy_cd
  						,pulse_rate_cd,resp_rate_cd,temp_core_cd,influ_inactivated_cd,influ_live_triv_cd,influ_virus_cd
  						,pneumo_23_cd,pneumo_7_cd,adv_dir_cd,adv_dir_date_cd,adv_dir_type_cd,act_poa_cd,med_poa_cd,
  						poa_act_date_cd,poa_inact_date_cd,guard_cd,guard_type_cd,guard_date_cd,apical_hr_cd,spo2_cd,
  						ostomy_act_1_cd,ostomy_lumen_1_cd,ostomy_act_2_cd,ostomy_lumen_2_cd,ostomy_act_3_cd,ostomy_lumen_3_cd,
  						ostomy_mucosa_1_cd,ostomy_skin_1_cd,ostomy_mucosa_2_cd,limb_alert_cd,limb_reason_cd,
  						ostomy_skin_2_cd,ostomy_mucosa_3_cd,ostomy_skin_3_cd,bed_bath_cd,oral_care_cd,peri_care_cd,
  						shave_cd,shower_cd,pneumo_13_cd,influ_h1n1_inact_cd,influ_h1n1_live_cd)
  and ce.valid_until_dt_tm > sysdate
  and not ce.result_status_cd in (28,31)
 
join cdr
where cdr.event_id = outerjoin(ce.event_id)
  and cdr.valid_until_dt_tm > outerjoin(sysdate)
 
order ce.event_cd, ce.event_end_dt_tm desc
 
head report
os1_first = "Y"
os2_first = "Y"
os3_first = "Y"
 
head ce.event_cd
case (ce.event_cd)
  of pd_patient_cd: data->pd_patient = ce.result_val
  of pd_family_cd: data->pd_family = ce.result_val
  of pd_security_cd: data->pd_security = ce.result_val
  of pd_bedside_cd: data->pd_bedside = ce.result_val
  of dia_bp_cd: if (ce.event_end_dt_tm > cvntdatetime(hours_back_24_cd))
  				  data->dia_bp = concat(trim(ce.result_val,3),"  ",uar_get_code_display(ce.result_units_cd))
  				endif
  of sys_bp_cd: if (ce.event_end_dt_tm > cvntdatetime(hours_back_24_cd))
  				  data->sys_bp = concat(trim(ce.result_val,3),"  ",uar_get_code_display(ce.result_units_cd))
  				endif
  of height_cd: if (ce.event_end_dt_tm > cvntdatetime(hours_back_24_cd))
  				  data->height = concat(trim(ce.result_val,3),"  ",uar_get_code_display(ce.result_units_cd))
  				endif
  of act_weight_cd: if (ce.event_end_dt_tm > cvntdatetime(hours_back_24_cd))
  				  data->act_weight = concat(trim(ce.result_val,3),"  ",uar_get_code_display(ce.result_units_cd))
  				  endif
  of bp_loc_cd: if (ce.event_end_dt_tm > cvntdatetime(hours_back_24_cd))
  				  data->bp_loc = concat(trim(ce.result_val,3),"  ",uar_get_code_display(ce.result_units_cd))
  				endif
  of pulse_rate_cd: if (ce.event_end_dt_tm > cvntdatetime(hours_back_24_cd))
  				  data->peri_pulse = concat(trim(ce.result_val,3),"  ",uar_get_code_display(ce.result_units_cd))
  				  endif
  of resp_rate_cd: if (ce.event_end_dt_tm > cvntdatetime(hours_back_24_cd))
  				  data->resp_rate = concat(trim(ce.result_val,3),"  ",uar_get_code_display(ce.result_units_cd))
  				  endif
  of temp_core_cd: if (ce.event_end_dt_tm > cvntdatetime(hours_back_24_cd))
  				  data->core_temp = concat(trim(ce.result_val,3),"  ",uar_get_code_display(ce.result_units_cd))
  				endif
  of limb_alert_cd: data->limb_alert = ce.result_val
  of limb_reason_cd: data->limb_reason = ce.result_val
  of adv_dir_cd: data->adv_dir = ce.result_val
  of adv_dir_date_cd: data->adv_dir_date = ce.result_val
  of adv_dir_type_cd: data->adv_dir_type = ce.result_val
  of med_poa_cd: data->power_of_attorney = ce.result_val
  of act_poa_cd: data->activation_poa = ce.result_val
  of poa_act_date_cd: data->act_poa_date = format(cdr.result_dt_tm,"mm/dd/yy;;d")
  of poa_inact_date_cd: data->inact_poa_date = format(cdr.result_dt_tm,"mm/dd/yy;;d")
  of guard_cd: data->guardianship = ce.result_val
  of guard_type_cd: data->guard_type = ce.result_val
  of guard_date_cd: data->guard_date = format(cdr.result_dt_tm,"mm/dd/yy;;d")
  of apical_hr_cd: if (ce.event_end_dt_tm > cvntdatetime(hours_back_24_cd))
  				  data->apical_hr = ce.result_val
  				  endif
  of spo2_cd: if (ce.event_end_dt_tm > cvntdatetime(hours_back_24_cd))
  				  data->spo2 = ce.result_val
  				  endif
  of o2_flow_rate_cd: if (ce.event_end_dt_tm > cvntdatetime(hours_back_24_cd))
  				  data->o2_flow_rate = ce.result_val
  				  endif
  of oxygen_therapy_cd: if (ce.event_end_dt_tm > cvntdatetime(hours_back_24_cd))
  				  data->oxygen_therapy = ce.result_val
  				  endif
;  of ostomy_loc_1_cd: data->ostomy_type_1 = ce.result_val
;  of ostomy_type_1_cd: data->ostomy_loc_1 = ce.result_val
;  of ostomy_loc_2_cd: data->ostomy_type_2 = ce.result_val
;  of ostomy_type_2_cd: data->ostomy_loc_2 = ce.result_val
;  of ostomy_loc_3_cd: data->ostomy_type_3 = ce.result_val
;  of ostomy_type_3_cd: data->ostomy_loc_3 = ce.result_val
;  of ostomy_act_1_cd: data->ostomy_act_1 = ce.result_val
;  of ostomy_lumen_1_cd: data->ostomy_lumen_1 = ce.result_val
;  of ostomy_act_2_cd: data->ostomy_act_2 = ce.result_val
;  of ostomy_lumen_2_cd: data->ostomy_lumen_2 = ce.result_val
;  of ostomy_act_3_cd: data->ostomy_act_3 = ce.result_val
;  of ostomy_lumen_3_cd: data->ostomy_lumen_3 = ce.result_val
;  of ostomy_mucosa_1_cd: data->ostomy_mucosa_1 = ce.result_val
;  of ostomy_skin_1_cd: data->ostomy_skin_1 = ce.result_val
;  of ostomy_mucosa_2_cd: data->ostomy_mucosa_2 = ce.result_val
;  of ostomy_skin_2_cd: data->ostomy_skin_2 = ce.result_val
;  of ostomy_mucosa_3_cd: data->ostomy_mucosa_3 = ce.result_val
;  of ostomy_skin_3_cd: data->ostomy_skin_3 = ce.result_val
  of bed_bath_cd: data->ha_bed_bath = ce.result_val
  of oral_care_cd: data->ha_oral_care = ce.result_val
  of peri_care_cd: data->ha_peri_care = ce.result_val
  of shave_cd: data->ha_shave = ce.result_val
  of shower_cd: data->ha_shower = ce.result_val
 
endcase
 
if (ce.event_cd in (ostomy_loc_1_cd,ostomy_type_1_cd,ostomy_act_1_cd,ostomy_lumen_1_cd,ostomy_mucosa_1_cd,ostomy_skin_1_cd))
    if (os1_first = "Y")
    data->ostomy_1 = concat(trim(replace(uar_get_code_display(ce.event_cd),"Ostomy #1 "," "),3),":  ",
    						trim(ce.result_val,3))
    os1_first = "N"
  else
    data->ostomy_1 = concat(data->ostomy_1,";  ",
    	trim(replace(uar_get_code_display(ce.event_cd),"Ostomy #1 "," "),3),":  ",
    	trim(ce.result_val,3))
  endif
endif
 
if (ce.event_cd in (ostomy_loc_2_cd,ostomy_type_2_cd,ostomy_act_2_cd,ostomy_lumen_2_cd,ostomy_mucosa_2_cd,ostomy_skin_2_cd))
  if (os2_first = "Y")
    data->ostomy_2 = concat(trim(replace(uar_get_code_display(ce.event_cd),"Ostomy #2 "," "),3),":  ",
    						trim(ce.result_val,3))
    os2_first = "N"
  else
    data->ostomy_2 = concat(data->ostomy_2,";  ",
    	trim(replace(uar_get_code_display(ce.event_cd),"Ostomy #2 "," "),3),":  ",
    	trim(ce.result_val,3))
  endif
endif
 
if (ce.event_cd in (ostomy_loc_3_cd,ostomy_type_3_cd,ostomy_act_3_cd,ostomy_lumen_3_cd,ostomy_mucosa_3_cd,ostomy_skin_3_cd))
  if (os3_first = "Y")
    data->ostomy_3 = concat(trim(replace(uar_get_code_display(ce.event_cd),"Ostomy #3 "," "),3),":  ",
    						trim(ce.result_val,3))
    os3_first = "N"
  else
    data->ostomy_3 = concat(data->ostomy_3,";  ",
    	trim(replace(uar_get_code_display(ce.event_cd),"Ostomy #3 "," "),3),":  ",
    	trim(ce.result_val,3))
  endif
endif
 
if (ce.event_cd in (influ_inactivated_cd,influ_live_triv_cd,influ_virus_cd,pneumo_23_cd,pneumo_7_cd,pneumo_13_cd,
					influ_h1n1_live_cd,influ_h1n1_inact_cd))
  data->vaccines = concat(data->vaccines,trim(uar_get_code_display(ce.event_cd),3),"    ",
  								format(ce.event_end_dt_tm,"mm/dd/yy hh:mm;;d"),char(10))
endif
 
with nocounter
 
;get pain events
select into "nl:"
result = if (cdr.event_id > 0)
		   format(cdr.result_dt_tm,"mm/dd/yy;;d")
		 else
		   ce1.result_val
		 endif
from
clinical_event ce,
clinical_event ce1,
ce_date_result cdr
 
plan ce
where ce.encntr_id = data->encntr_id
  and ce.event_cd in (pain1_cd,pain2_cd,pain3_cd)
  and ce.valid_until_dt_tm > sysdate
  and ce.event_end_dt_tm > cvntdatetime(hours_back_24_cd)
  and not ce.result_status_cd in (28,31)
  and ce.event_end_dt_tm = (select max(ce3.event_end_dt_tm) from clinical_event ce3
  								where ce3.person_id = ce.person_id
  								    and ce3.event_cd = ce.event_cd
  								    and ce3.encntr_id = ce.encntr_id
  									and ce3.valid_until_dt_tm > sysdate
  									and not ce3.result_status_cd in (28,31))
join ce1
where ce1.parent_event_id = ce.event_id
  and ce1.valid_until_dt_tm > sysdate
  and not ce1.result_status_cd in (28,31)
 
join cdr
where cdr.event_id = outerjoin(ce1.event_id)
  and cdr.valid_until_dt_tm > outerjoin(sysdate)
 
order ce.collating_seq, ce1.collating_seq
 
head report
p1_first = "Y"
p2_first = "Y"
p3_first = "Y"
 
detail
if (ce.event_cd = pain1_cd)
  if (p1_first = "Y")
    data->pain1 = concat(trim(replace(uar_get_code_display(ce1.event_cd),"Pain 1 "," "),3),":  ",
    						trim(result,3))
    p1_first = "N"
  else
    data->pain1 = concat(data->pain1,";  ",
    	trim(replace(uar_get_code_display(ce1.event_cd),"Pain 1 "," "),3),":  ",
    	trim(result,3))
  endif
elseif (ce.event_cd = pain2_cd)
  if (p2_first = "Y")
    data->pain2 = concat(trim(replace(uar_get_code_display(ce1.event_cd),"Pain 2 "," "),3),":  ",
    						trim(result,3))
    p2_first = "N"
  else
    data->pain2 = concat(data->pain2,";  ",
    	trim(replace(uar_get_code_display(ce1.event_cd),"Pain 2 "," "),3),":  ",
    	trim(result,3))
  endif
elseif (ce.event_cd = pain3_cd)
  if (p3_first = "Y")
    data->pain3 = concat(trim(replace(uar_get_code_display(ce1.event_cd),"Pain 3 "," "),3),":  ",
    						trim(result,3))
    p3_first = "N"
  else
    data->pain3 = concat(data->pain3,";  ",
    	trim(replace(uar_get_code_display(ce1.event_cd),"Pain 3 "," "),3),":  ",
    	trim(result,3))
  endif
endif
 
with nocounter
 
 
 ;get skin abnormality events
select into "nl:"
result = if (cdr.event_id > 0)
		   format(cdr.result_dt_tm,"mm/dd/yy;;d")
		 else
		   ce2.result_val
		 endif
from
clinical_event ce,
clinical_event ce1,
clinical_event ce2,
ce_date_result cdr
 
plan ce
where ce.person_id = data->person_id
  and ce.encntr_id+0 = data->encntr_id
  and ce.event_cd = skin_abnorm_grid_cd
  and ce.valid_until_dt_tm > sysdate
  and not ce.result_status_cd in (28,31)
  and ce.event_end_dt_tm = (select max(ce3.event_end_dt_tm) from clinical_event ce3
  								where ce3.person_id = ce.person_id
  								    and ce3.encntr_id+0 = ce.encntr_id
  									and ce3.event_cd = ce.event_cd
  									and ce3.valid_until_dt_tm > sysdate
  									and not ce3.result_status_cd in (28,31))
join ce1
where ce1.parent_event_id = ce.event_id
  and ce1.valid_until_dt_tm > sysdate
  and not ce1.result_status_cd in (28,31)
 
join ce2
where ce2.parent_event_id = ce1.event_id
  and ce2.valid_until_dt_tm > sysdate
  and not ce2.result_status_cd in (28,31)
 
join cdr
where cdr.event_id = outerjoin(ce2.event_id)
  and cdr.valid_until_dt_tm > outerjoin(sysdate)
 
order ce1.collating_seq, ce2.collating_seq
 
head report
cnt = 0
skin_first = "Y"
 
head ce1.collating_seq
cnt = cnt + 1
stat = alterlist(data->skin_abnorm,cnt)
skin_first = "Y"
   data->skin_abnorm[cnt].skin_num = cnvtstring(cnt)
detail
;if (ce2.event_cd = incis_numbering_cd)
 
;else
  if (skin_first = "Y")
    data->skin_abnorm[cnt].skin_detail = concat(trim(uar_get_code_display(ce2.event_cd),3),":  ",
    						trim(result,3))
    skin_first = "N"
  else
    data->skin_abnorm[cnt].skin_detail = concat(data->skin_abnorm[cnt].skin_detail,";  ",
    	trim(uar_get_code_display(ce2.event_cd),3),":  ",
    	trim(result,3))
  endif
;endif
 
 
with nocounter
 
 
;get central line events
select into "nl:"
result = if (cdr.event_id > 0)
		   format(cdr.result_dt_tm,"mm/dd/yy;;d")
		 else
		   ce1.result_val
		 endif
from
clinical_event ce,
clinical_event ce1,
ce_date_result cdr
 
plan ce
where ce.encntr_id = data->encntr_id
  and ce.event_cd in (central_line1_cd,central_line2_cd,central_line3_cd,central_line4_cd)
  and ce.valid_until_dt_tm > sysdate
  and not ce.result_status_cd in (28,31)
  and ce.event_end_dt_tm = (select max(ce3.event_end_dt_tm) from clinical_event ce3
  								where ce3.person_id = ce.person_id
  								    and ce3.event_cd = ce.event_cd
  								    and ce3.encntr_id = ce.encntr_id
  									and ce3.valid_until_dt_tm > sysdate
  									and not ce3.result_status_cd in (28,31))
join ce1
where ce1.parent_event_id = ce.event_id
  and ce1.valid_until_dt_tm > sysdate
  and not ce1.result_status_cd in (28,31)
 
join cdr
where cdr.event_id = outerjoin(ce1.event_id)
  and cdr.valid_until_dt_tm > outerjoin(sysdate)
 
order ce.collating_seq, ce1.collating_seq
 
head report
cl1_first = "Y"
cl2_first = "Y"
cl3_first = "Y"
cl4_first = "Y"
 
detail
if (ce.event_cd = central_line1_cd)
  if (cl1_first = "Y")
    data->central_line1 = concat(trim(replace(uar_get_code_display(ce1.event_cd),"Central IV #1 "," "),3),":  ",
    						trim(result,3))
    cl1_first = "N"
  else
    data->central_line1 = concat(data->central_line1,";  ",
    	trim(replace(uar_get_code_display(ce1.event_cd),"Central IV #1 "," "),3),":  ",
    	trim(result,3))
  endif
elseif (ce.event_cd = central_line2_cd)
  if (cl2_first = "Y")
    data->central_line2 = concat(trim(replace(uar_get_code_display(ce1.event_cd),"Central IV #2 "," "),3),":  ",
    						trim(result,3))
    cl2_first = "N"
  else
    data->central_line2 = concat(data->central_line2,";  ",
    	trim(replace(uar_get_code_display(ce1.event_cd),"Central IV #2 "," "),3),":  ",
    	trim(result,3))
  endif
elseif (ce.event_cd = central_line3_cd)
  if (cl3_first = "Y")
    data->central_line3 = concat(trim(replace(uar_get_code_display(ce1.event_cd),"Central IV #3 "," "),3),":  ",
    						trim(result,3))
    cl3_first = "N"
  else
    data->central_line3 = concat(data->central_line3,";  ",
    	trim(replace(uar_get_code_display(ce1.event_cd),"Central IV #3 "," "),3),":  ",
    	trim(result,3))
  endif
elseif (ce.event_cd = central_line4_cd)
  if (cl4_first = "Y")
    data->central_line4 = concat(trim(replace(uar_get_code_display(ce1.event_cd),"Central IV #4 "," "),3),":  ",
    						trim(result,3))
    cl4_first = "N"
  else
    data->central_line4 = concat(data->central_line4,";  ",
    	trim(replace(uar_get_code_display(ce1.event_cd),"Central IV #4 "," "),3),":  ",
    	trim(result,3))
  endif
endif
 
with nocounter
 
;get incision and wound care
select into "nl:"
result = if (cdr.event_id > 0)
		   format(cdr.result_dt_tm,"mm/dd/yy;;d")
		 else
		   ce2.result_val
		 endif
from
clinical_event ce,
clinical_event ce1,
clinical_event ce2,
ce_date_result cdr
 
plan ce
where ce.person_id = data->person_id
  and ce.encntr_id+0 = data->encntr_id
  and ce.event_cd = wound_care_cd
  and ce.valid_until_dt_tm > sysdate
  and not ce.result_status_cd in (28,31)
  and ce.event_end_dt_tm = (select max(ce3.event_end_dt_tm) from clinical_event ce3
  								where ce3.encntr_id = ce.encntr_id
  									and ce3.event_cd = ce.event_cd
  									and ce3.valid_until_dt_tm > sysdate
  									and not ce3.result_status_cd in (28,31))
join ce1
where ce1.parent_event_id = ce.event_id
  and ce1.valid_until_dt_tm > sysdate
  and not ce1.result_status_cd in (28,31)
 
join ce2
where ce2.parent_event_id = ce1.event_id
  and ce2.valid_until_dt_tm > sysdate
  ;and not ce2.event_cd in (incis_activity_cd)
  and not ce2.result_status_cd in (28,31)
 
join cdr
where cdr.event_id = outerjoin(ce2.event_id)
  and cdr.valid_until_dt_tm > outerjoin(sysdate)
 
order ce1.collating_seq, ce2.collating_seq
 
head report
cnt = 0
wound_first = "Y"
 
head ce1.collating_seq
cnt = cnt + 1
stat = alterlist(data->wound_care,cnt)
wound_first = "Y"
data->wound_care[cnt].wound_num = cnvtstring(cnt)
 
detail
 
  if (wound_first = "Y")
    data->wound_care[cnt].wound_detail = concat(trim(replace(uar_get_code_display(ce2.event_cd),"Incision/Wound "," "),3),":  ",
    						trim(result,3))
    wound_first = "N"
  else
    data->wound_care[cnt].wound_detail = concat(data->wound_care[cnt].wound_detail,";  ",
    	trim(replace(uar_get_code_display(ce2.event_cd),"Incision/Wound "," "),3),":  ",
    	trim(result,3))
  endif
 
 
with nocounter
 
;get urinary catheter insertion
select into "nl:"
from
clinical_event ce,
clinical_event ce1,
clinical_event ce2,
ce_date_result cdr
 
plan ce
where ce.encntr_id = data->encntr_id
  and ce.event_cd in (urinary_cath_form_cd,adult_adm_assess_cd)
  and ce.valid_until_dt_tm > sysdate
  and not ce.result_status_cd in (28,31)
  and ce.event_end_dt_tm = (select max(ce3.event_end_dt_tm) from clinical_event ce3
  								where ce3.encntr_id = ce.encntr_id
  									and ce3.event_cd in (urinary_cath_form_cd,adult_adm_assess_cd)
  									and ce3.valid_until_dt_tm > sysdate
  									and not ce3.result_status_cd in (28,31))
join ce1
where ce1.parent_event_id = ce.event_id
  and ce1.event_title_text = "Urinary Catheter"
  and ce1.valid_until_dt_tm > sysdate
  and not ce1.result_status_cd in (28,31)
 
join ce2
where ce2.parent_event_id = ce1.event_id
  and ce2.event_cd in (cath_insert_site_cd,cath_size_cd,cath_type_cd,cath_balloon_cd,uc_insert_cd,uc_discont_cd,
  						uc_insert_dt_tm_cd,uc_discon_dt_tm_cd)
  and ce2.valid_until_dt_tm > sysdate
  and not ce2.result_status_cd in (28,31)
 
join cdr
where cdr.event_id = outerjoin(ce2.event_id)
  and cdr.valid_until_dt_tm > outerjoin(sysdate)
 
order ce2.event_cd, ce2.event_end_dt_tm desc
 
;head report
;data->performed_on = format(ce.event_end_dt_tm,"mm/dd/yy hh:mm;;d")
;
head ce2.event_cd
case (ce2.event_cd)
  of cath_insert_site_cd: data->insertion_site  = ce2.result_val
  of cath_size_cd: data->catheter_size  = ce2.result_val
  of cath_type_cd: data->catheter_type = ce2.result_val
  of cath_balloon_cd: data->balloon_inflation = ce2.result_val
  of uc_insert_cd: data->uc_insert = ce2.result_val
  of uc_discont_cd: data->uc_discon = ce2.result_val
  of uc_insert_dt_tm_cd: data->uc_insert_dt_tm = format(cdr.result_dt_tm,"mm/dd/yy hh:mm;;d")
  of uc_discon_dt_tm_cd: data->uc_discon_dt_tm = format(cdr.result_dt_tm,"mm/dd/yy hh:mm;;d")
endcase
 
with nocounter
 
;get diagnosis
select into "nl:"
from
diagnosis d
 
plan d
where d.encntr_id = data->encntr_id
  ;and d.diag_type_cd in (diag_admit_cd,diag_rfv_cd,diag_work_cd)
  and not d.diag_type_cd in (diag_bill_cd,diag_sug_bill_cd)
  and d.active_ind = 1
  and d.end_effective_dt_tm > sysdate
 
head report
cnt = 0
 
detail
cnt = cnt + 1
if (cnt = 1)
  data->diagnosis = d.diagnosis_display
else
  data->diagnosis = concat(data->diagnosis,char(10),trim(d.diagnosis_display,3))
endif
 
with nocounter
 
;get problems (infectious illness)
select into "nl:"
from
problem p,
nomenclature n,
problem_comment pc
 
plan p
where p.person_id = data->person_id
  and p.active_ind = 1
  and p.end_effective_dt_tm > sysdate
 
join n
where n.nomenclature_id = p.nomenclature_id
  and n.active_ind = 1
  and n.end_effective_dt_tm > sysdate
  and n.source_vocabulary_cd in (snomed_cd,icd9_cd)
  ;and n.source_string in ("VRE*","MRSA*","Clostridium difficile*")
 
join pc
where pc.problem_id = outerjoin(p.problem_id)
  and pc.active_ind = outerjoin(1)
  and pc.end_effective_dt_tm > outerjoin(sysdate)
 
 
head report
cnt = 0
cnt1 = 0
 
detail
cnt = cnt + 1
if (n.source_string in ("VRE*","MRSA*","Clostridium difficile*"))
	cnt1 = cnt1 + 1
	if (cnt1 = 1)
	  data->infect_illness = concat("Illness:  ",trim(n.source_string,3))
	  if (pc.problem_comment_id > 0)
	    data->infect_illness = concat(data->infect_illness,char(10),"Comment:  ",trim(pc.problem_comment,3))
	  endif
	else
	  data->infect_illness = concat(data->infect_illness,char(10),char(10),"Illness:  ",trim(n.source_string,3))
	  if (pc.problem_comment_id > 0)
	    data->infect_illness = concat(data->infect_illness,char(10),"Comment:  ",trim(pc.problem_comment,3))
	  endif
	endif
endif
if (cnt = 1)
  data->problems = concat(trim(n.source_string,3)," ")
;  if (pc.problem_comment_id > 0)
;    data->problems = concat(data->problems,char(10),"Comment:  ",trim(pc.problem_comment,3))
;  endif
else
  data->problems = concat(data->problems,char(10),trim(n.source_string,3))
;  if (pc.problem_comment_id > 0)
;    data->problems = concat(data->problems,char(10),"Comment:  ",trim(pc.problem_comment,3))
;  endif
endif
with nocounter
 
;get blood orders
select into "nl:"
from
orders o
 
plan o
where o.encntr_id = data->encntr_id
  and o.catalog_cd+0 in (trans_platelets_cd,trans_packed_cd,trans_frozen_cd,trans_cryo_cd)
  and o.active_ind = 1
 
head report
cnt = 0
 
detail
cnt = cnt + 1
if (cnt = 1)
  data->blood_product = concat(replace(uar_get_code_display(o.catalog_cd),"Transfuse Blood Product: ","",0),
  							char(10),format(o.orig_order_dt_tm,"mm/dd/yy hh:mm;;d"))
else
  data->blood_product = concat(data->blood_product,char(10),char(10),
  							replace(uar_get_code_display(o.catalog_cd),"Transfuse Blood Product: ","",0),
  							char(10),format(o.orig_order_dt_tm,"mm/dd/yy hh:mm;;d"))
endif
 
 
with nocounter
 
;get code status orders
select into "nl:"
from
orders o,
order_detail od
 
plan o
where o.encntr_id = data->encntr_id
  and o.catalog_cd+0 = code_status_cd
  and o.active_ind = 1
 
join od
where od.order_id = o.order_id
  and od.oe_field_meaning in ("RESUSCITATIONSTATUS","SPECINX")
 
order od.oe_field_meaning, od.action_sequence desc
 
head od.oe_field_meaning
if (od.oe_field_meaning = "RESUSCITATIONSTATUS")
  data->code_status = od.oe_field_display_value
else
  data->code_status = concat(trim(data->code_status,3),":  ",trim(od.oe_field_display_value,3))
endif
 
with nocounter
 
 ;get diet orders
select into "nl:"
from
orders o
;,order_detail od
 
plan o
where o.encntr_id = data->encntr_id
  and o.catalog_cd+0 in (diet_cd,diet_npo_cd,diet_npo_pro_cd)
  and o.active_ind = 1
  and o.order_status_cd = ordered_cd
 
;join od
;where od.order_id = o.order_id
;  and od.oe_field_meaning = "RESUSCITATIONSTATUS"
 
 
detail
 data->diet_order = concat(trim(o.hna_order_mnemonic,3)," - ",trim(o.order_detail_display_line,3))
with nocounter
 
;get allergies
select into "nl:"
allergies = if (a.substance_nom_id = 0)
              a.substance_ftdesc
            else
              n.source_string
            endif,
reactions = if (r.reaction_nom_id = 0)
              r.reaction_ftdesc
            else
              n1.source_string
            endif
from
allergy a,
nomenclature n,
reaction r,
nomenclature n1
 
plan a
where a.person_id = data->person_id
  and a.active_ind = 1
  and a.end_effective_dt_tm > sysdate
  and a.cancel_prsnl_id = 0
  and a.reaction_status_cd != canceled_cd
 
join r
where r.allergy_id = outerjoin(a.allergy_id)
  and r.active_ind = outerjoin(1)
  and r.end_effective_dt_tm > outerjoin(sysdate)
 
join n
where n.nomenclature_id = outerjoin(a.substance_nom_id)
 
join n1
where n1.nomenclature_id = outerjoin(r.reaction_nom_id)
 
order allergies, reactions
 
detail
data->allergies = concat(data->allergies,"Substance: ",trim(allergies,3),char(10),"Reaction: ",trim(reactions,3),char(10),char(10))
 
with nocounter
 
 call echorecord(data)
 
execute ReportRtl
 
%i mhs_prg:mayo_mn_trans_care_nh_poc.dvl
 
select into request->output_device  ;$outdev   ;
from
(dummyt with seq = 1)
 
 
head report
call InitializeReport(0)
_fEndDetail = RptReport->m_pageHeight - RptReport->m_marginTop
nPAGE = 1
dumb_var = 0
cl_num = 1
os_num = 0
p_num = 0
cntr = 1
 
x = HeadReportSection(0)
x = VisionSection(Rpt_Render,3.0,dumb_var)
x = BowelBladderSection(0)
if (data->ostomy_1 > " ")
  os_num = 1
  x = OstomySection(Rpt_Render,8.0,dumb_var)
endif
if (data->ostomy_2 > " ")
  os_num = 2
  x = OstomySection(Rpt_Render,8.0,dumb_var)
endif
if (data->ostomy_3 > " ")
  os_num = 3
  x = OstomySection(Rpt_Render,8.0,dumb_var)
endif
x = BowelBladder2(0)
if (_YOffset + DiagAllerBldSection(1,4.0,dumb_var) > (_fEndDetail-0.5) )
_YOffset = 10.0
x = FootPageSection(0)
nPAGE = nPAGE + 1
  call PageBreak(0)
  x = HeadReportSection(0)
endif
x = DiagProbHeader(0)
x = DiagAllerBldSection(Rpt_Render,4.0,dumb_var)
if (_YOffset + AllergyBlood(1,4.0,dumb_var) > (_fEndDetail-0.5) )
_YOffset = 10.0
x = FootPageSection(0)
nPAGE = nPAGE + 1
  call PageBreak(0)
  x = HeadReportSection(0)
endif
x = AllergyBloodHeader(0)
x = AllergyBlood(Rpt_Render,4.0,dumb_var)
if (_YOffset + CodeStatAdvDir(1) > (_fEndDetail-0.5) )
_YOffset = 10.0
x = FootPageSection(0)
nPAGE = nPAGE + 1
  call PageBreak(0)
  x = HeadReportSection(0)
endif
x = CodeStatAdvDir(0)
if (_YOffset + FallCodeVacSection(1,3.0,dumb_var) > (_fEndDetail-0.5))
_YOffset = 10.0
x = FootPageSection(0)
nPAGE = nPAGE + 1
  call PageBreak(0)
  x = HeadReportSection(0)
endif
x = FallCodeVacSection(Rpt_Render,3.0,dumb_var)
if (_YOffset + LimbAlertSection(1) > (_fEndDetail-0.5) )
_YOffset = 10.0
x = FootPageSection(0)
nPAGE = nPAGE + 1
  call PageBreak(0)
  x = HeadReportSection(0)
endif
x = LimbAlertSection(0)
;if (_YOffset + SkinConSection(1) > (_fEndDetail-0.5) )
;_YOffset = 10.0
;x = FootPageSection(0)
;nPAGE = nPAGE + 1
;  call PageBreak(0)
;  x = HeadReportSection(0)
;endif
if (size(data->skin_abnorm,5) > 0 and size(data->wound_care,5) > 0)
	if (_YOffset + SkinConSection(1) + WoundSection(1,4.0,dumb_var) + SkinAbnormSection(1,8.0,dumb_var)  > (_fEndDetail-0.5) )
	_YOffset = 10.0
	x = FootPageSection(0)
	nPAGE = nPAGE + 1
	  call PageBreak(0)
	  x = HeadReportSection(0)
	endif
elseif (not size(data->skin_abnorm,5) > 0 and size(data->wound_care,5) > 0)
	if (_YOffset + SkinConSection(1) + WoundSection(1,4.0,dumb_var)  > (_fEndDetail-0.5) )
	_YOffset = 10.0
	x = FootPageSection(0)
	nPAGE = nPAGE + 1
	  call PageBreak(0)
	  x = HeadReportSection(0)
	endif
elseif (size(data->skin_abnorm,5) > 0 and not size(data->wound_care,5) > 0)
	if (_YOffset + SkinConSection(1) + SkinAbnormSection(1,8.0,dumb_var)  > (_fEndDetail-0.5) )
	_YOffset = 10.0
	x = FootPageSection(0)
	nPAGE = nPAGE + 1
	  call PageBreak(0)
	  x = HeadReportSection(0)
	endif
elseif (not size(data->skin_abnorm,5) > 0 and not size(data->wound_care,5) > 0)
	if (_YOffset + SkinConSection(1)  > (_fEndDetail-0.5) )
	_YOffset = 10.0
	x = FootPageSection(0)
	nPAGE = nPAGE + 1
	  call PageBreak(0)
	  x = HeadReportSection(0)
	endif
endif
x = SkinConSection(0)
if (size(data->skin_abnorm,5) > 0 )
  for (y = 1 to size(data->skin_abnorm,5))
    cntr = y
    if (_YOffset + SkinAbnormSection(1,8.0,dumb_var) > (_fEndDetail-0.5) )
	    _YOffset = 10.0
	    x = FootPageSection(0)
	    nPAGE = nPAGE + 1
	    call PageBreak(0)
	    x = HeadReportSection(0)
	  endif
    x = SkinAbnormSection(Rpt_Render,8.0,dumb_var)
  endfor
endif
if (size(data->wound_care,5) > 0 )
  for (y = 1 to size(data->wound_care,5))
    cntr = y
    if (_YOffset + WoundSection(1,8.0,dumb_var) > (_fEndDetail-0.5) )
	    _YOffset = 10.0
	    x = FootPageSection(0)
	    nPAGE = nPAGE + 1
	    call PageBreak(0)
	    x = HeadReportSection(0)
	  endif
    x = WoundSection(Rpt_Render,8.0,dumb_var)
  endfor
endif
if (_YOffset + CentralLineCareSection(1) + CLDetailSection(1,4.0,dumb_var) > (_fEndDetail-0.5) )
_YOffset = 10.0
x = FootPageSection(0)
nPAGE = nPAGE + 1
  call PageBreak(0)
  x = HeadReportSection(0)
endif
x = CentralLineCareSection(Rpt_Render)
if (data->central_line1 > " ")
  cl_num = 1
  x = CLDetailSection(Rpt_Render,8.0,dumb_var)
endif
if (data->central_line2 > " ")
  cl_num = 2
 	if (_YOffset + CLDetailSection(1,8.0,dumb_var) > (_fEndDetail-0.5) )
	  _YOffset = 10.0
	  x = FootPageSection(0)
	  nPAGE = nPAGE + 1
	  call PageBreak(0)
	  x = HeadReportSection(0)
	endif
  x = CLDetailSection(Rpt_Render,8.0,dumb_var)
endif
if (data->central_line3 > " ")
  cl_num = 3
 	if (_YOffset + CLDetailSection(1,8.0,dumb_var) > (_fEndDetail-0.5) )
	  _YOffset = 10.0
	  x = FootPageSection(0)
	  nPAGE = nPAGE + 1
	  call PageBreak(0)
	  x = HeadReportSection(0)
	endif
  x = CLDetailSection(Rpt_Render,8.0,dumb_var)
endif
if (data->central_line4 > " ")
  cl_num = 4
 	if (_YOffset + CLDetailSection(1,8.0,dumb_var) > (_fEndDetail-0.5) )
	  _YOffset = 10.0
	  x = FootPageSection(0)
	  nPAGE = nPAGE + 1
	  call PageBreak(0)
	  x = HeadReportSection(0)
	endif
  x = CLDetailSection(Rpt_Render,8.0,dumb_var)
endif
if (_YOffset + ElimAssistance(1) > (_fEndDetail-0.5) )
_YOffset = 10.0
x = FootPageSection(0)
nPAGE = nPAGE + 1
  call PageBreak(0)
  x = HeadReportSection(0)
endif
x = ElimAssistance(Rpt_Render)
if (_YOffset + MentalStatusSection(1,2.0,dumb_var) > (_fEndDetail-0.5) )
_YOffset = 10.0
x = FootPageSection(0)
nPAGE = nPAGE + 1
  call PageBreak(0)
  x = HeadReportSection(0)
endif
x = MentalStatusSection(Rpt_Render,2.0,dumb_var)
if (_YOffset + VitalSignsSection(1) > (_fEndDetail-0.5) )
_YOffset = 10.0
x = FootPageSection(0)
nPAGE = nPAGE + 1
  call PageBreak(0)
  x = HeadReportSection(0)
endif
x = VitalSignsSection(0)
if (data->pain1 > " ")
  p_num = 1
  x = PainSection(Rpt_Render,8.0,dumb_var)
endif
if (data->pain2 > " ")
  p_num = 2
 	if (_YOffset + PainSection(1,8.0,dumb_var) > (_fEndDetail-0.5) )
	  _YOffset = 10.0
	  x = FootPageSection(0)
	  nPAGE = nPAGE + 1
	  call PageBreak(0)
	  x = HeadReportSection(0)
	endif
  x = PainSection(Rpt_Render,8.0,dumb_var)
endif
if (data->pain3 > " ")
  p_num = 3
 	if (_YOffset + PainSection(1,8.0,dumb_var) > (_fEndDetail-0.5) )
	  _YOffset = 10.0
	  x = FootPageSection(0)
	  nPAGE = nPAGE + 1
	  call PageBreak(0)
	  x = HeadReportSection(0)
	endif
  x = PainSection(Rpt_Render,8.0,dumb_var)
endif
if (_YOffset + InsuranceInfoSection(1) > (_fEndDetail-0.5) )
_YOffset = 10.0
x = FootPageSection(0)
nPAGE = nPAGE + 1
  call PageBreak(0)
  x = HeadReportSection(0)
endif
x = InsuranceInfoSection(0)
if (_YOffset + NotesSection(1) > (_fEndDetail-0.5))
_YOffset = 10.0
x = FootPageSection(0)
nPAGE = nPAGE + 1
  call PageBreak(0)
  x = HeadReportSection(0)
endif
x = NotesSection(0)
if (_YOffset + FootPageSection(1) > (_fEndDetail-0.5))
_YOffset = 10.0
x = FootPageSection(0)
nPAGE = nPAGE + 1
  call PageBreak(0)
  x = HeadReportSection(0)
endif
_YOffset = 10.0
x = FootPageSection(0)
 
with nocounter
call FinalizeReport(request->output_device)  ;$outdev)    ;
 
 
end go
 
