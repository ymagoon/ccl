/******************************************************
  13 June 2011...mrhine changed head in reportwriter
      head e.encntr_id ;e.updt_dt_tm
  20 Jun 2011 changed per Brook/Kevin/mrhine
 
  7 July 2011 mrhine
    1. converted to writing to file instead of array for history/catchup. Memory error!
       commented out all the stuff for later chopping
 
  note: be sure to clean up the dm_info table with this
select *
 from dm_info dm
where  dm.info_domain="HUMEDICA"
   and dm.info_name = "humedica_encounter"
go
 
delete from dm_info dm
where  dm.info_domain="HUMEDICA"
   and dm.info_name = "humedica_encounter"
 go
commit go
;002 04/12/12 kmcdaniel - rewritten for Mayo (416)
 *****************************************************/
drop   program hum_encounter_history:dba go
create program hum_encounter_history:dba
 
;*********************************************************************
;*** If PROD / CERT then run as 2nd oracle instance to improve
;*** efficiency. Will auto Fail-over to Instance 1 if Instance 2 down.
;*********************************************************************
IF(CURDOMAIN = "PROD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprbrpt'
ELSEIF(CURDOMAIN = "MHPRD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprbrpt'
ELSEIF(CURDOMAIN="MHCRT")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/java4t2@mhcrtrpt'
ENDIF ;CURDOMAIN
;********************************************************
 
free set testdt
set testdt = cnvtdatetime("01-JAN-2010 0000")
;set end_run_date = cnvtdatetime("01-JAN-2012 0000")
set end_run_date = cnvtdatetime("01-JAN-2012 0000")
set run_date = cnvtdatetime(curdate,curtime3)
 
declare domain_info_name = vc
set domain_info_name = trim("humedica_encounter")
declare month = vc
 
while (testdt < cnvtdatetime(end_run_date))
 
	if(testdt >= end_run_date) go to exit_program endif
 
   free set dtfnd
   set dtfnd = "N"
   declare mnth = vc
   declare yr = vc
   declare edt = vc
   declare startdt = f8
   declare enddt = f8
   declare nxtmnth = f8
 
   select into "nl:"
   dm.updt_dt_tm
   from dm_info dm
   where dm.info_domain = "HUMEDICA"
     and dm.info_name   = domain_info_name
   detail
    dtfnd = "Y"
    startdt = dm.updt_dt_tm
;	enddt = datetimefind(cnvtdatetime(startdt),"M", "E","E")
	enddt = cnvtdatetime(cnvtdate(startdt),235959)
    month = format(startdt,"MMM;;d")
	nxtmnth = cnvtdatetime(cnvtdate(enddt)+1,0)
    mnth = format(nxtmnth,"MMM;;d")
    yr = format(nxtmnth,"YYYY;;d")
    edt = concat("01-",mnth,"-",yr," 0000")
   with nocounter
 
   if (dtfnd = "N")
	set startdt = cnvtdatetime(testdt)
;	set enddt = datetimefind(cnvtdatetime(startdt),"M", "E","E")
	set enddt = cnvtdatetime(cnvtdate(startdt),235959)
    set month = format(startdt,"MMM;;d")
	set nxtmnth = cnvtdatetime(cnvtdate(enddt)+1,0)
    set mnth = format(nxtmnth,"MMM;;d")
    set yr = format(nxtmnth,"YYYY;;d")
    set edt = concat("01-",mnth,"-",yr," 0000")
      insert into dm_info dm
      set	dm.info_domain="HUMEDICA",
      		dm.info_name = domain_info_name,
			dm.updt_dt_tm = cnvtdatetime(nxtmnth)	;cnvtdatetime(enddt)
      with nocounter
      commit
   endif
 
   call echo(build("start_date = ",format(startdt,"mm/dd/yyyy hh:mm;;d")))
   call echo(build("end_date = ",format(enddt,"mm/dd/yyyy hh:mm;;d")))
 
   free set today
   declare today = f8
   declare edt = vc
   declare ydt = vc
   declare month = vc
   set today = cnvtdatetime(curdate,curtime3)
   set edt = format(today,"yyyymmdd;;d")
   set dirdt = format(startdt,"yyyymmdd;;d")
   set ydt = format(startdt,"yyyy;;d")
   set month = format(startdt,"mmm;;d")
   set beg_dt = startdt
   call echo(build("beg_dt = ",beg_dt))
   set end_dt = enddt
   call echo(build("end_dt = ",end_dt))
 
	set print_file = concat("hum_encounter_history_",dirdt,".dat")
	set hold_file = concat("/cerner/d_mhprd/ccluserdir/",print_file)
 
call echo("------------- write to FILE --------------")
 
select into value(print_file)
   fin                      = trim(ea.alias,3)
,   accommodation_cd          = cnvtstring(e.accommodation_cd)
,   accommodation_reason_cd   = cnvtstring(e.accommodation_reason_cd)
,   accommodation_request_cd  = cnvtstring(e.accommodation_request_cd)
,   accomp_by_cd             = cnvtstring(e.accomp_by_cd)
,   active_ind               = cnvtstring(e.active_ind)
,   active_status_cd         = cnvtstring(e.active_status_cd)
,   active_status_dt_tm      = format(e.active_status_dt_tm,"yyyyMMddhhmmss;;d")
,   active_status_prsnl_id   = cnvtstring(e.active_status_prsnl_id)
,   admit_mode_cd            = cnvtstring(e.admit_mode_cd)
,   admit_src_cd             = cnvtstring(e.admit_src_cd)
;10
,   admit_type_cd            = cnvtstring(e.admit_type_cd)
,   admit_with_medication_cd = cnvtstring(e.admit_with_medication_cd)
,   alc_decomp_dt_tm         = format(e.alc_decomp_dt_tm,"yyyyMMddhhmmss;;d")
,   alc_reason_cd            = cnvtstring(e.alc_reason_cd)
,   alt_lvl_care_cd          = cnvtstring(e.alt_lvl_care_cd)
,   alt_lvl_care_dt_tm       = format(e.alt_lvl_care_dt_tm,"yyyyMMddhhmmss;;d")
,   alt_result_dest_cd       = cnvtstring(e.alt_result_dest_cd)
,   ambulatory_cond_cd       = cnvtstring(e.ambulatory_cond_cd)
,   archive_dt_tm_act        = format(e.archive_dt_tm_act,"yyyyMMddhhmmss;;d")
,   archive_dt_tm_est        = format(e.archive_dt_tm_est,"yyyyMMddhhmmss;;d")
;20
,   arrive_dt_tm             = format(e.arrive_dt_tm,"yyyyMMddhhmmss;;d")
,   assign_to_loc_dt_tm      = format(e.assign_to_loc_dt_tm,"yyyyMMddhhmmss;;d")
,   bbd_procedure_cd         = cnvtstring(e.bbd_procedure_cd)
,   beg_effective_dt_tm      = format(e.beg_effective_dt_tm,"yyyyMMddhhmmss;;d")
,   birth_dt_cd              = cnvtstring(e.birth_dt_cd)
,   birth_dt_tm              = format(e.birth_dt_tm,"yyyyMMddhhmmss;;d")
,   chart_complete_dt_tm     = format(e.chart_complete_dt_tm,"yyyyMMddhhmmss;;d")
,   confid_level_cd          = cnvtstring(e.confid_level_cd)
,   contract_status_cd       = cnvtstring(e.contract_status_cd)
,   contributor_system_cd    = cnvtstring(e.contributor_system_cd)
;30
,  courtesy_cd              = cnvtstring(e.courtesy_cd)
,   create_dt_tm             = format(e.create_dt_tm,"yyyyMMddhhmmss;;d")
,   create_prsnl_id          = cnvtstring(e.create_prsnl_id)
,   data_status_cd           = cnvtstring(e.data_status_cd)
,   data_status_dt_tm        = format(e.data_status_dt_tm,"yyyyMMddhhmmss;;d")
,   data_status_prsnl_id     = cnvtstring(e.data_status_prsnl_id)
,   depart_dt_tm             = format(e.depart_dt_tm,"yyyyMMddhhmmss;;d")
,   diet_type_cd             = cnvtstring(e.diet_type_cd)
,   disch_disposition_cd     = cnvtstring(e.disch_disposition_cd)
,   disch_dt_tm              = format(e.disch_dt_tm,"yyyyMMddhhmmss;;d")
;40
,   disch_to_loctn_cd        = cnvtstring(e.disch_to_loctn_cd)
,   doc_rcvd_dt_tm           = format(e.doc_rcvd_dt_tm,"yyyyMMddhhmmss;;d")
,   encntr_class_cd          = cnvtstring(e.encntr_class_cd)
,   encntr_complete_dt_tm    = format(e.encntr_complete_dt_tm,"yyyyMMddhhmmss;;d")
,   encntr_financial_id      = cnvtstring(e.encntr_financial_id)
,   encntr_id                = cnvtstring(e.encntr_id)
,   encntr_status_cd         = cnvtstring(e.encntr_status_cd)
,   encntr_type_cd           = cnvtstring(e.encntr_type_cd)
,   encntr_type_class_cd     = cnvtstring(e.encntr_type_class_cd)
,   end_effective_dt_tm      = format(e.end_effective_dt_tm,"yyyyMMddhhmmss;;d")
;50
,   est_arrive_dt_tm         = format(e.est_arrive_dt_tm,"yyyyMMddhhmmss;;d")
,   est_depart_dt_tm         = format(e.est_depart_dt_tm,"yyyyMMddhhmmss;;d")
,   est_length_of_stay       = cnvtstring(e.est_length_of_stay)
,   expected_delivery_dt_tm  = format(e.expected_delivery_dt_tm,"yyyyMMddhhmmss;;d")
,   financial_class_cd       = cnvtstring(e.financial_class_cd)
,   guarantor_type_cd        = cnvtstring(e.guarantor_type_cd)
,   info_given_by            = trim(e.info_given_by,3)
,   initial_contact_dt_tm    = format(e.initial_contact_dt_tm,"yyyyMMddhhmmss;;d")
,   inpatient_admit_dt_tm    = format(e.inpatient_admit_dt_tm,"yyyyMMddhhmmss;;d")
,  isolation_cd             = cnvtstring(e.isolation_cd)
;60
,   last_menstrual_period_dt_tm  = format(e.last_menstrual_period_dt_tm,"yyyyMMddhhmmss;;d")
,   location_cd            = cnvtstring(e.location_cd)
,   loc_bed_cd             = cnvtstring(e.loc_bed_cd)
,   loc_building_cd        = cnvtstring(e.loc_building_cd)
,   loc_facility_cd        = cnvtstring(e.loc_facility_cd)
,   loc_nurse_unit_cd      = cnvtstring(e.loc_nurse_unit_cd)
,   loc_room_cd            = cnvtstring(e.loc_room_cd)
,   loc_temp_cd            = cnvtstring(e.loc_temp_cd)
,   med_service_cd         = cnvtstring(e.med_service_cd)
,   mental_category_cd     = cnvtstring(e.mental_category_cd)
;70
,   mental_health_cd       = cnvtstring(e.mental_health_cd)
,   mental_health_dt_tm    = format(e.mental_health_dt_tm,"yyyyMMddhhmmss;;d")
,   name_first             = trim(e.name_first,3)
,   name_first_key         = trim(e.name_first_key,3)
,   name_first_synonym_id  = cnvtstring(e.name_first_synonym_id)
,   name_full_formatted    = trim(e.name_full_formatted,3)
,   name_last              = trim(e.name_last,3)
,   name_last_key          = trim(e.name_last_key,3)
,   name_phonetic          = trim(e.name_phonetic,3)
,   onset_dt_tm            = format(e.onset_dt_tm,"yyyyMMddhhmmss;;d")
;80
,   organization_id            = cnvtstring(e.organization_id)
,   parent_ret_criteria_id     = cnvtstring(e.parent_ret_criteria_id)
,   patient_classification_cd  = cnvtstring(e.patient_classification_cd)
,   pa_current_status_cd       = cnvtstring(e.pa_current_status_cd)
,   pa_current_status_dt_tm    = format(e.pa_current_status_dt_tm,"yyyyMMddhhmmss;;d")
,   person_id                  = cnvtstring(e.person_id)
,   placement_auth_prsnl_id    = cnvtstring(e.placement_auth_prsnl_id)
,   preadmit_nbr               = trim(e.preadmit_nbr,3)
,   preadmit_testing_cd        = cnvtstring(e.preadmit_testing_cd)
,   pregnancy_status_cd        = cnvtstring(e.pregnancy_status_cd)
;90
,   pre_reg_dt_tm            = format(e.pre_reg_dt_tm,"yyyyMMddhhmmss;;d")
,   pre_reg_prsnl_id         = cnvtstring(e.pre_reg_prsnl_id)
,   program_service_cd       = cnvtstring(e.program_service_cd)
,   psychiatric_status_cd    = cnvtstring(e.psychiatric_status_cd)
,   purge_dt_tm_act          = format(e.purge_dt_tm_act,"yyyyMMddhhmmss;;d")
,   purge_dt_tm_est          = format(e.purge_dt_tm_est,"yyyyMMddhhmmss;;d")
,   readmit_cd               = cnvtstring(e.readmit_cd)
,   reason_for_visit         = trim(e.reason_for_visit,3)
,   referral_rcvd_dt_tm      = format(e.referral_rcvd_dt_tm,"yyyyMMddhhmmss;;d")
,   referring_comment        = trim(e.referring_comment,3)
;100
,   refer_facility_cd        = cnvtstring(e.refer_facility_cd)
,   region_cd                = cnvtstring(e.region_cd)
,   reg_dt_tm                = format(e.reg_dt_tm,"yyyyMMddhhmmss;;d")
,   reg_prsnl_id             = cnvtstring(e.reg_prsnl_id)
,   result_accumulation_dt_tm= format(e.result_accumulation_dt_tm,"yyyyMMddhhmmss;;d")
,   result_dest_cd            = cnvtstring(e.result_dest_cd)
,   rowid                     = cnvtstring(e.rowid)
,   safekeeping_cd            = cnvtstring(e.safekeeping_cd)
,   security_access_cd        = cnvtstring(e.security_access_cd)
,   service_category_cd       = cnvtstring(e.service_category_cd)
;110
,   sex_cd                    = cnvtstring(e.sex_cd)
,   sitter_required_cd        = cnvtstring(e.sitter_required_cd)
,   specialty_unit_cd         = cnvtstring(e.specialty_unit_cd)
,   species_cd                = cnvtstring(e.species_cd)
,   trauma_cd                 = cnvtstring(e.trauma_cd)
,   trauma_dt_tm              = format(e.trauma_dt_tm,"yyyyMMddhhmmss;;d")
,   triage_cd                 = cnvtstring(e.triage_cd)
,   triage_dt_tm              = format(e.triage_dt_tm,"yyyyMMddhhmmss;;d")
,   updt_applctx              = cnvtstring(e.updt_applctx)
,   updt_cnt                  = cnvtstring(e.updt_cnt)
;120
,   updt_dt_tm              = format(e.updt_dt_tm,"yyyyMMddhhmmss;;d")
,   updt_id                 = cnvtstring(e.updt_id)
,   updt_task               = cnvtstring(e.updt_task)
;123
 
from encounter e
    ,encntr_alias ea
plan e where e.updt_dt_tm between cnvtdatetime(beg_dt) and cnvtdatetime(end_dt)
	and e.active_ind = 1
	and e.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
join ea  where ea.encntr_id              = outerjoin(e.encntr_id)
           and ea.encntr_alias_type_cd+0 = outerjoin(1077)
           and ea.active_ind+0           = outerjoin(1)
           and ea.end_effective_dt_tm+0  > outerjoin(cnvtdatetime(curdate,curtime3))
 
  head report
  "fin",
"||accommodation_cd",
"||accommodation_reason_cd",
"||accommodation_request_cd",
"||accomp_by_cd",
"||active_ind",
"||active_status_cd",
"||active_status_dt_tm",
"||active_status_prsnl_id",
"||admit_mode_cd",
"||admit_src_cd",
 
"||admit_type_cd",
"||admit_with_medication_cd",
"||alc_decomp_dt_tm",
"||alc_reason_cd",
"||alt_lvl_care_cd",
"||alt_lvl_care_dt_tm",
"||alt_result_dest_cd",
"||ambulatory_cond_cd",
"||archive_dt_tm_act",
"||archive_dt_tm_est",
 
"||arrive_dt_tm",
"||assign_to_loc_dt_tm",
"||bbd_procedure_cd",
"||beg_effective_dt_tm",
"||birth_dt_cd",
"||birth_dt_tm",
"||chart_complete_dt_tm",
"||confid_level_cd",
"||contract_status_cd",
"||contributor_system_cd",
 
"||courtesy_cd",
"||create_dt_tm",
"||create_prsnl_id",
"||data_status_cd",
"||data_status_dt_tm",
"||data_status_prsnl_id",
"||depart_dt_tm",
"||diet_type_cd",
"||disch_disposition_cd",
"||disch_dt_tm",
 
"||disch_to_loctn_cd",
"||doc_rcvd_dt_tm",
"||encntr_class_cd",
"||encntr_complete_dt_tm",
"||encntr_financial_id",
"||encntr_id",
"||encntr_status_cd",
"||encntr_type_cd",
"||encntr_type_class_cd",
"||end_effective_dt_tm",
 
"||est_arrive_dt_tm",
"||est_depart_dt_tm",
"||est_length_of_stay",
"||expected_delivery_dt_tm",
"||financial_class_cd",
"||guarantor_type_cd",
"||info_given_by",
"||initial_contact_dt_tm",
"||inpatient_admit_dt_tm",
"||isolation_cd",
 
"||last_menstrual_period_dt_tm",
"||location_cd",
"||loc_bed_cd",
"||loc_building_cd",
"||loc_facility_cd",
"||loc_nurse_unit_cd",
"||loc_room_cd",
"||loc_temp_cd",
"||med_service_cd",
"||mental_category_cd",
 
"||mental_health_cd",
"||mental_health_dt_tm",
"||name_first",
"||name_first_key",
"||name_first_synonym_id",
"||name_full_formatted",
"||name_last",
"||name_last_key",
"||name_phonetic",
"||onset_dt_tm",
 
"||organization_id",
"||parent_ret_criteria_id",
"||patient_classification_cd",
"||pa_current_status_cd",
"||pa_current_status_dt_tm",
"||person_id",
"||placement_auth_prsnl_id",
"||preadmit_nbr",
"||preadmit_testing_cd",
"||pregnancy_status_cd",
 
"||pre_reg_dt_tm",
"||pre_reg_prsnl_id",
"||program_service_cd",
"||psychiatric_status_cd",
"||purge_dt_tm_act",
"||purge_dt_tm_est",
"||readmit_cd",
"||reason_for_visit",
"||referral_rcvd_dt_tm",
"||referring_comment",
 
"||refer_facility_cd",
"||region_cd",
"||reg_dt_tm",
"||reg_prsnl_id",
"||result_accumulation_dt_tm",
"||result_dest_cd",
"||rowid",
"||safekeeping_cd",
"||security_access_cd",
"||service_category_cd",
 
"||sex_cd",
"||sitter_required_cd",
"||specialty_unit_cd",
"||species_cd",
"||trauma_cd",
"||trauma_dt_tm",
"||triage_cd",
"||triage_dt_tm",
"||updt_applctx",
"||updt_cnt",
 
"||updt_dt_tm",
"||updt_id",
"||updt_task|"
 
row + 1
 
head e.encntr_id
	abc = 0
detail
	abc = 0
foot e.encntr_id
rtxt = build(
       fin
,'||', accommodation_cd
,'||', accommodation_reason_cd
,'||', accommodation_request_cd
,'||', accomp_by_cd
,'||', active_ind
,'||', active_status_cd
,'||', active_status_dt_tm
,'||', active_status_prsnl_id
,'||', admit_mode_cd
,'||', admit_src_cd
 
,'||', admit_type_cd
,'||', admit_with_medication_cd
,'||', alc_decomp_dt_tm
,'||', alc_reason_cd
,'||', alt_lvl_care_cd
,'||', alt_lvl_care_dt_tm
,'||', alt_result_dest_cd
,'||', ambulatory_cond_cd
,'||', archive_dt_tm_act
,'||', archive_dt_tm_est
 
,'||', arrive_dt_tm
,'||', assign_to_loc_dt_tm
,'||', bbd_procedure_cd
,'||', beg_effective_dt_tm
,'||', birth_dt_cd
,'||', birth_dt_tm
,'||', chart_complete_dt_tm
,'||', confid_level_cd
,'||', contract_status_cd
,'||', contributor_system_cd
 
,'||', courtesy_cd
,'||', create_dt_tm
,'||', create_prsnl_id
,'||', data_status_cd
,'||', data_status_dt_tm
,'||', data_status_prsnl_id
,'||', depart_dt_tm
,'||', diet_type_cd
,'||', disch_disposition_cd
,'||', disch_dt_tm
 
,'||', disch_to_loctn_cd
,'||', doc_rcvd_dt_tm
,'||', encntr_class_cd
,'||', encntr_complete_dt_tm
,'||', encntr_financial_id
,'||', encntr_id
,'||', encntr_status_cd
,'||', encntr_type_cd
,'||', encntr_type_class_cd
,'||', end_effective_dt_tm
 
,'||', est_arrive_dt_tm
,'||', est_depart_dt_tm
,'||', est_length_of_stay
,'||', expected_delivery_dt_tm
,'||', financial_class_cd
,'||', guarantor_type_cd
,'||', info_given_by
,'||', initial_contact_dt_tm
,'||', inpatient_admit_dt_tm
,'||', isolation_cd
 
,'||', last_menstrual_period_dt_tm
,'||', location_cd
,'||', loc_bed_cd
,'||', loc_building_cd
,'||', loc_facility_cd
,'||', loc_nurse_unit_cd
,'||', loc_room_cd
,'||', loc_temp_cd
,'||', med_service_cd
,'||', mental_category_cd
 
,'||', mental_health_cd
,'||', mental_health_dt_tm
,'||', name_first
,'||', name_first_key
,'||', name_first_synonym_id
,'||', name_full_formatted
,'||', name_last
,'||', name_last_key
,'||', name_phonetic
,'||', onset_dt_tm
 
,'||', organization_id
,'||', parent_ret_criteria_id
,'||', patient_classification_cd
,'||', pa_current_status_cd
,'||', pa_current_status_dt_tm
,'||', person_id
,'||', placement_auth_prsnl_id
,'||', preadmit_nbr
,'||', preadmit_testing_cd
,'||', pregnancy_status_cd
 
,'||', pre_reg_dt_tm
,'||', pre_reg_prsnl_id
,'||', program_service_cd
,'||', psychiatric_status_cd
,'||', purge_dt_tm_act
,'||', purge_dt_tm_est
,'||', readmit_cd
,'||', reason_for_visit
,'||', referral_rcvd_dt_tm
,'||', referring_comment
 
,'||', refer_facility_cd
,'||', region_cd
,'||', reg_dt_tm
,'||', reg_prsnl_id
,'||', result_accumulation_dt_tm
,'||', result_dest_cd
,'||', rowid
,'||', safekeeping_cd
,'||', security_access_cd
,'||', service_category_cd
 
,'||', sex_cd
,'||', sitter_required_cd
,'||', specialty_unit_cd
,'||', species_cd
,'||', trauma_cd
,'||', trauma_dt_tm
,'||', triage_cd
,'||', triage_dt_tm
 
,'||', updt_applctx
,'||', updt_cnt
,'||', updt_dt_tm
,'||', updt_id
,'||', updt_task
,'|')
 
  col 0 rtxt
  row + 1
 
with ;formfeed = none,
     maxrow = 1,
     nocounter,
     maxcol = 32000,
     format = variable
     ,append
 
 
   if (dtfnd = "Y")
      set dtfnd = "N"
      update into dm_info dm
      set dm.updt_dt_tm = cnvtdatetime(nxtmnth)
      where dm.info_domain="HUMEDICA"
      and dm.info_name = domain_info_name
 
      with nocounter
      commit
   endif
   set testdt = nxtmnth
 
declare dir_date = vc
set dir_date = trim(concat(format(run_date,"yyyy;;d"),format(run_date,"mm;;d")))
declare newdir = vc
declare LEN = i4
declare DCLCOM = vc
 
set newdir = concat("/humedica/mhprd/data/cerner")
set DCLCOM = concat("mkdir ",newdir)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir = concat("/humedica/mhprd/data/cerner/historical")
set DCLCOM = concat("mkdir ",newdir)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir = concat("/humedica/mhprd/data/cerner/historical/",dir_date)
set DCLCOM = concat("mkdir ",newdir)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
free set outfile
set outfile = concat("H416989_T",dirdt,"_E",edt,"_encounter.txt")
free set base
set base = concat(trim(newdir),"/")
 
free set newfile
declare newfile = vc
set newfile = concat(base,outfile)
set DCLCOM = concat("mv ",trim(hold_file)," ",newfile)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set DCLCOM = concat("gzip -9 ",newfile)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
endwhile
 
#exit_program
 
;****** After report put back to instance 1
IF(CURDOMAIN = "PROD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprb1'
ELSEIF(CURDOMAIN = "MHPRD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprb1'
ELSEIF(CURDOMAIN="MHCRT")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/java4t2@mhcrt1'
ENDIF ;CURDOMAIN
;******************************************
 
end
go
