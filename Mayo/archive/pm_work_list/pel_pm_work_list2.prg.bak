drop program pel_pm_work_list2 go
create program pel_pm_work_list2
 
prompt 
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "facility code" = 0
	, "Start date" = CURDATE
	, "End Date" = CURDATE 

with OUTDEV, fac_cd, sdate, edate
 
set preadmit_cd  = UAR_GET_CODE_BY("MEANING",69,"PREADMIT" ) ; go
set msp_cd       = UAR_GET_CODE_BY("DISPLAYKEY",100700,"NO"); go
set fin_cd = UAR_GET_CODE_BY("DISPLAYKEY",319,"FINNBR") ;go
set mrn_cd = UAR_GET_CODE_BY("DISPLAYKEY",319,"MRN") ;go
set look_back = 10


 
 

select into $outdev
  e.encntr_id,
  p.person_id,
  Patient_Name = p.name_full_formatted,
  Patient_Type = UAR_GET_CODE_DISPLAY(e.encntr_type_cd),
  FIN = trim(fin.alias),
  MRN = trim(mrn.alias),
  Location = UAR_GET_CODE_DISPLAY(e.loc_nurse_unit_cd),
  Med_Service = UAR_GET_CODE_DISPLAY(e.med_service_cd),
  Reg_dt_tm = e.reg_dt_tm,
  Disch_dt_tm = e.disch_dt_tm
 
   from 
        encounter e,
        person p,
        encntr_alias fin,
        encntr_alias mrn
 
plan e
  where e.reg_dt_tm between cnvtdatetime(cnvtdate($sdate),0) 
  and cnvtdatetime(cnvtdate($edate),235959)
  and (e.disch_dt_tm+0 >= cnvtdatetime(curdate-look_back,0)
  	or e.disch_dt_tm = null)
  and e.active_ind+0 = 1
  and e.loc_facility_cd+0 = $fac_cd
  and e.encntr_type_class_cd+0 != preadmit_cd
  and e.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
  and e.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
  and exists (select pqa.parent_entity_id
               from pm_qst_questionnaire pq,
     				pm_qst_question pqq,
    	 			pm_qst_answer pqa
 
		 where   pqa.parent_entity_id = e.encntr_id
			and  pqa.parent_entity_name = "ENCOUNTER"
			and pqa.value_cd =      684155.00
 
			AND  pqq.question_id = pqa.question_id
			and pqq.question_seq = 1
			AND pq.questionnaire_id = pqq.questionnaire_id
			and pq.questionnaire_id = 1776243
		    and pq.questionnaire_type_flag = 1)
 
join p where e.person_id = p.person_id
  and p.active_ind = 1
  and p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
  and p.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
join fin where e.encntr_id = fin.encntr_id
  and fin.encntr_alias_type_cd = fin_cd
  and fin.active_ind = 1
  and fin.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
  and fin.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
join mrn where e.encntr_id = mrn.encntr_id
  and mrn.encntr_alias_type_cd = mrn_cd
  and mrn.active_ind = 1
  and mrn.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
  and mrn.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
with nocounter, format , separator = " "
 

end
go
