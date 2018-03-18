drop program pel_shell_labels2 go
create program pel_shell_labels2
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	;<<hidden>>"Fin Number" = "5332000152"
	, "Patient" = 0
 
with OUTDEV, encntr_id
 
 
free record request
record request (
1   patient_data
    2 person
      3 encounter
         4 ENCNTR_ID = f8
      	 4 reg_dt_tm = dq8
      	 4 EST_ARRIVE_DT_TM = dq8
      	 4 encntr_type_cd = f8
      	 4 loc_room_cd = F8
         4 finnbr
            5 alias = vc
            5 alias_pool_cd = f8
         4 attenddoc
            5  prsnl_person_id = f8
	  3 name_full_formatted = vc
	  3 birth_dt_tm = dq8
	  3 sex_cd = f8
	  3 mrn
         4 alias  = vc
         4 alias_pool_cd  = f8
      3 SUBSCRIBER_01
        4 PERSON
          5 HEALTH_PLAN
            6 PLAN_INFO
              7 FINANCIAL_CLASS_CD = f8
              )
 
select
from encounter e
	,person p
	,person_alias pa
	,encntr_alias ea
 
 
plan e
	where e.encntr_id =  $encntr_id
join p
	where p.person_id = e.person_id
join pa
	where pa.person_id = p.person_id
	and pa.person_alias_type_cd = 10 ; mrn
	and pa.active_ind = 1
	and pa.end_effective_dt_tm > sysdate
join  ea
	where ea.encntr_id = e.encntr_id
	and ea.encntr_alias_type_cd = 1077 ; fin
	and ea.active_ind = 1
	and ea.end_effective_dt_tm > sysdate
 
head p.person_id
	 request->patient_data->person->encounter->finnbr->alias = ea.alias
	 request->patient_data->person->encounter->finnbr->alias_pool_cd =   ea.alias_pool_cd
	 request->patient_data->person->encounter->reg_dt_tm = e.reg_dt_tm
	 request->patient_data->PERSON->ENCOUNTER->EST_ARRIVE_DT_TM = e.EST_ARRIVE_DT_TM
	 request->patient_data->person->encounter->encntr_type_cd =   e.encntr_TYPE_CD
	 request->patient_data->person->encounter->encntr_id =   e.encntr_id
 
	 request->patient_data->person->name_full_formatted = P.NAME_FULL_FORMATTED
	 request->patient_data->person->birth_dt_tm = P.BIRTH_DT_TM
	 request->patient_data->person->sex_cd = P.SEX_CD
 
	 request->patient_data->person->mrn->alias_pool_cd =    PA.alias_pool_cd
	 request->patient_data->person->mrn->alias = PA.alias
;	 request->patient_data->person->encounter->attenddoc->prsnl_person_id =      7206255.00
with nocounter
 
;set request->patient_data->person->encounter->finnbr->alias = "120003629"
;set request->patient_data->person->encounter->finnbr->alias_pool_cd =   26411960.00
;set request->patient_data->person->encounter->reg_dt_tm = cnvtdatetime("13-may-2014")
;;set request->patient_data->PERSON->ENCOUNTER->EST_ARRIVE_DT_TM = cnvtdatetime("13-may-2014")
;set request->patient_data->person->encounter->encntr_type_cd =      309309.00
;
;set request->patient_data->person->name_full_formatted = "MHBLD, BRYCE"
;set request->patient_data->person->birth_dt_tm = cnvtdatetime("29-dec-1994")
;set request->patient_data->person->sex_cd =         363.00
;
;set request->patient_data->person->mrn->alias_pool_cd =    25017845.00
;set request->patient_data->person->mrn->alias = "400359"
select  into "nl:"
 
from encntr_prsnl_reltn epr
	where epr.encntr_id = $encntr_id
	and epr.active_ind = 1
	and epr.end_effective_dt_tm > sysdate
	and epr.encntr_prsnl_r_cd =        1119.00;	Attending Physician
 
detail
	request->patient_data->person->encounter->attenddoc->prsnl_person_id =   epr.prsnl_person_id
 
with nocounter
 
select into "nl:"
 
from encntr_plan_reltn epr,
	health_plan hp
plan epr
	where epr.encntr_id = $encntr_id
	and epr.priority_seq = 1
	and epr.active_ind = 1
join hp
	where hp.health_plan_id = epr.health_plan_id
detail
	 request->patient_data->PERSON->SUBSCRIBER_01->PERSON->HEALTH_PLAN->PLAN_INFO->FINANCIAL_CLASS_Cd = hp.financial_class_cd
with nocounter
 
 
 
 
;set request->patient_data->person->encounter->attenddoc->prsnl_person_id =      7206255.00
;;set request->patient_data->PERSON->SUBSCRIBER_01->PERSON->HEALTH_PLAN->PLAN_INFO->FINANCIAL_CLASS_Cd =      634776.00
 
if (request->patient_data->person->encounter->encntr_id > 0 )
	CALL ECHORECORD(REQUEST)
	execute erm_plain_label_mayo value($outdev)
endif
end
go
 
 
