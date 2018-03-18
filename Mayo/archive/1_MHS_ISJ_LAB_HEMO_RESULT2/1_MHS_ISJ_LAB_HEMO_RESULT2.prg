/*******************************************************************
 
Report Name:  Lab Result For Hemo
Report Path:  /mayo/mhprd/prg/1_mhs_isj_lab_hemo_result1.prg
Report Description:  Report is used to comfiem that ISJ have the appropriate labs that ensure payments for
dialysis services. Report gives patient detials and test result information (CAB: 6011). Runs on date range and
facility information
 
Created by: Bharti Jain , M061596
Created date:  07/08/2009 - re-written on 09/01/2009
 
Modified by:   Akcia - Phil Landry
Modified date:  08/14/2012
Modifications:  Oracle 11 performance changes
Modificaion Nbr:  001
 
Modified by:
Modified date:
Modifications:
 
*******************************************************************/
 
 
drop program 1_mhs_isj_lab_hemo_result2 go
create program 1_mhs_isj_lab_hemo_result2
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Begin Date" = CURDATE
	, "End Date" = CURDATE
	, "Location" = 0
 
with OUTDEV, bdate, edate, loc
 
 
 
/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
;oreders variable
declare bun_cd = f8 with public,constant(uar_get_code_by("DISPLAYKEY",200,"BUN"))
declare bun1_cd = f8 with public,constant(uar_get_code_by("DISPLAYKEY",200,"BUN1"))
declare bun2_cd = f8 with public,constant(uar_get_code_by("DISPLAYKEY",200,"BUN2"))
declare cbc_cd = f8 with public,constant(uar_get_code_by("DISPLAYKEY",200,"CBC"))
declare cbc_wo_diff_cd = f8 with public,constant(uar_get_code_by("DISPLAYKEY",200,"CBCWITHOUTDIFF"))
declare cbc_sed_cd = f8 with public,constant(uar_get_code_by("DISPLAYKEY",200,"CBCANDSEDRATEESR"))
declare cbc_abs_net_cd = f8 with public,constant(uar_get_code_by("DISPLAYKEY",200,"CBCWITHABSOLUTENEUTROPHILICCOUNT"))
declare cbc_manual_cd = f8 with public,constant(uar_get_code_by("DISPLAYKEY",200,"CBCWITHMANUALDIFFERENTIAL"))
declare cbc_auto_diff_cd = f8 with public,constant(uar_get_code_by("DISPLAYKEY",200,"CBCINCLUDESAUTODIFFERENTIAL"))
declare hgb_cd = f8 with public,constant(uar_get_code_by("DISPLAYKEY",200,"HEMOGLOBIN"))
declare creat_clearance_cd = f8 with public,constant(uar_get_code_by("DISPLAYKEY",200,"CREATFORCLEARANCE"))
declare creatinine_cd = f8 with public,constant(uar_get_code_by("DISPLAYKEY",200,"CREATININE"))
declare crea_cd = f8 with public,constant(uar_get_code_by("DISPLAYKEY",200,"CREATININECREA"))
declare potassium_cd = f8 with public,constant(uar_get_code_by("DISPLAYKEY",200,"POTASSIUMLEVEL"))
declare calc_lvl_cd = f8 with public,constant(uar_get_code_by("DISPLAYKEY",200,"CALCIUMLEVELTOTAL"))
declare albumin_cd = f8 with public,constant(uar_get_code_by("DISPLAYKEY",200,"ALBUMINLEVEL"))
declare cmp_cd = f8 with public,constant(uar_get_code_by("DISPLAYKEY",200,"COMPREHENSIVEMETABOLICPANEL"))
declare cca_cd = f8 with public,constant(uar_get_code_by("DISPLAYKEY",200,"CALCIUMCORRECTED"))
declare phos_cd = f8 with public,constant(uar_get_code_by("DISPLAYKEY",200,"PHOSPHORUSLEVEL"))
declare iron_cd = f8 with public,constant(uar_get_code_by("DISPLAYKEY",200,"IRONLEVELANDTIBC"))
declare ferr_cd = f8 with public,constant(uar_get_code_by("DISPLAYKEY",200,"FERRITIN"))
 
;Tests variables
 declare bun1_test = f8 with public,constant(uar_get_code_by("DISPLAYKEY",72,"BUN"))
 declare bun_pre_test = f8 with public,constant(uar_get_code_by("DISPLAYKEY",72,"BUNPRERUN"))
 declare bun_post_test = f8 with public,constant(uar_get_code_by("DISPLAYKEY",72,"BUNPOSTRUN"))
 declare crea_test = f8 with public,constant(uar_get_code_by("DISPLAYKEY",72,"CREATININE"))
 declare pota_test = f8 with public,constant(uar_get_code_by("DISPLAYKEY",72,"POTASSIUMLVL"))
 declare callv_test = f8 with public,constant(uar_get_code_by("DISPLAYKEY",72,"CALCIUMLVL"))
 declare alb_test = f8 with public,constant(uar_get_code_by("DISPLAYKEY",72,"ALBUMINLVL"))
 declare cca_test = f8 with public,constant(uar_get_code_by("DISPLAYKEY",72,"CACORRECTED"))
 declare phos_test = f8 with public,constant(uar_get_code_by("DISPLAYKEY",72,"PHOSPHORUS"))
 declare hgb_test = f8 with public,constant(uar_get_code_by("DISPLAY",72,"Hgb"))
 declare hgb2_test = f8 with public,constant(uar_get_code_by("DISPLAY",72,"HGB"))
 declare iron_test = f8 with public,constant(uar_get_code_by("DISPLAYKEY",72,"IRON"))
 declare ironsat_test = f8 with public,constant(uar_get_code_by("DISPLAYKEY",72,"IRONSAT"))
 declare uibc_test = f8 with public,constant(uar_get_code_by("DISPLAYKEY",72,"TIBC"))
 declare ferr_test = f8 with public,constant(uar_get_code_by("DISPLAYKEY",72,"FERRITINLVL"))
 
 
declare lab_cnt = i4 with protected,noconstant(0)
set lab_cnt = 0
 
declare order_action_type_cd = f8 with public, constant(uar_get_code_by("MEANING",6003,"COMPLETE"))
declare ORDER_COMP_STAT_cd = f8 with public, constant(uar_get_code_by("MEANING",6004,"COMPLETED"))
;declare PAT_MRN_CD = f8 with public, constant(uar_get_code_by("MEANING",319,"MRN"))
declare bun_hold_date = dq8
declare bun_hold_value = f8
 
free record rec
record rec(
 	1 cnt = i4
	1 qual[*]
		2 loc_facility_cd = f8
		2 loc_facility_name = vc
		2 person_id = f8
		2 name = vc
	;	2 mrn = vc
	;	2 order_action_type_cd = f8
		2 order_cmp_stat_cd = f8
		2 lab [*]
			3 order_collection_data_time = vc
			3 order_id = f8
			3 bun1_val = vc
			3 urr_val = vc
			3 hgb_val = vc
			3 crea_val = vc
			3 pota_val = vc
			3 callv_val = vc
			3 cca_val = vc
			3 phos_val = vc
			3 alb_val = vc
			3 iron_val = vc
			3 uibc_val = vc
			3 ironsat_val = vc
			3 ferr_val = vc
	)
 
/**************************************************************
; DVDev Start Coding
**************************************************************/
 
declare date1 = vc
declare date2 = vc
declare date_time = vc
set report_run_date_disp = format(curdate, "mm/dd/yy;;d")
set report_run_time_disp = format(curtime, "hh:mm;;m" )
set date_time  = concat(report_run_date_disp," ",report_run_time_disp)
 
select into "nl:"
 
from orders o,
	encounter e,
	person p,
;	encntr_alias ea,
	clinical_event cv1
; 001	plan e where  e.location_cd = cnvtint($loc);24989517
; 001
; 001	join o where o.encntr_id = e.encntr_id
; 001	 and o.catalog_cd+0 in (bun_cd,bun1_cd,bun2_cd,cbc_cd,cbc_wo_diff_cd,cbc_sed_cd,cbc_abs_net_cd,cbc_manual_cd,
; 001	 						creat_clearance_cd,creatinine_cd,crea_cd,potassium_cd,calc_lvl_cd,albumin_cd,cca_cd,
; 001	 						phos_cd,cmp_cd,hgb_cd,iron_cd,ferr_cd,cbc_auto_diff_cd)
; 001	 and o.orig_order_dt_tm between cnvtdatetime(cnvtdate($bdate),0)and cnvtdatetime(cnvtdate($edate),235959)
; 001	 and o.order_status_cd+0 = ORDER_COMP_STAT_cd
 
	plan o                                                        ;001
	where o.orig_order_dt_tm between cnvtdatetime(cnvtdate($bdate),0)and cnvtdatetime(cnvtdate($edate),235959) ;001
	and o.activity_type_cd =         692.00 ; 001
	 and o.catalog_cd in (bun_cd,bun1_cd,bun2_cd,cbc_cd,cbc_wo_diff_cd,cbc_sed_cd,cbc_abs_net_cd,cbc_manual_cd, ; 001
	 						creat_clearance_cd,creatinine_cd,crea_cd,potassium_cd,calc_lvl_cd,albumin_cd,cca_cd, ; 001
	 						phos_cd,cmp_cd,hgb_cd,iron_cd,ferr_cd,cbc_auto_diff_cd) ; 001
	 and o.order_status_cd = ORDER_COMP_STAT_cd 			; 001
 
    join e 													; 001
    	where e.encntr_id = o.encntr_id 					; 001
    	and e.location_cd = cnvtint($loc);24989517 			; 001
 
	join p where p.person_id =  o.person_id
 
;    join ea where ea.encntr_id =  e.encntr_id
;	 and ea.encntr_alias_type_cd = PAT_MRN_CD
;	 and ea.active_ind = 1
;	 and ea.end_effective_dt_tm > sysdate
 
	join cv1 where cv1.order_id = o.order_id
  	 and cv1.view_level = 1
     and cv1.event_cd in (bun1_test,crea_test,pota_test,callv_test,alb_test,cca_test,phos_test,hgb_test,iron_test,
     						ironsat_test,uibc_test,ferr_test,bun_pre_test,bun_post_test)    ;,hgb2_test)
     and cv1.valid_until_dt_tm > sysdate
 
	order by p.person_id, cnvtdatetime(o.orig_order_dt_tm), o.order_id
 
		head report
		rec->cnt  = 0
 
		head p.person_id
			rec->cnt = rec->cnt + 1
      	if (mod(rec->cnt,10) = 1)
          stat = alterlist(rec->qual, rec->cnt + 9)
    	endif
	   	lab_cnt = 0
	    rec->qual[rec->cnt].loc_facility_cd = cnvtint(e.location_cd)
		rec->qual[rec->cnt].loc_facility_name  = UAR_GET_CODE_DESCRIPTION(e.location_cd)
		rec->qual[rec->cnt].person_id = e.encntr_id
		rec->qual[rec->cnt].name = p.name_full_formatted
		;rec->qual[rec->cnt].mrn = cnvtalias(ea.alias,ea.alias_pool_cd)
	  ;  rec->qual[rec->cnt].order_action_type_cd = oa.action_type_cd
	 	rec->qual[rec->cnt].order_cmp_stat_cd = o.order_status_cd
	 	bun_hold_date = cnvtdatetime(cnvtdate(01011900),0)
		bun_hold_value = 0.0
 
   	 head o.order_id
   	 	 lab_cnt = lab_cnt + 1  ;  	 add alterlist here
   	 if(mod(lab_cnt,10) = 1)
   	 	stat = alterlist(rec->qual[rec->cnt]->lab,lab_cnt+9)
   	 endif
   	 rec->qual[rec->cnt]->lab[lab_cnt]->order_collection_data_time = format(o.orig_order_dt_tm,"mm/dd/yy hh:mm;;d")
 
   	 detail
   	 ; 	 and use case for each lab
   	 case (cv1.event_cd)
   	 	of bun1_test:
   	 			rec->qual[rec->cnt]->lab[lab_cnt]->bun1_val = cv1.result_val
   	 			date1 = format(o.orig_order_dt_tm,"mm/dd/yy;;d")
   	 			date2 = format(bun_hold_date,"mm/dd/yy;;d")
   	 			if (date1 = date2)
   	 			  rec->qual[rec->cnt]->lab[lab_cnt]->urr_val =
   	 			    cnvtstring(((bun_hold_value-cnvtreal(cv1.result_val))/bun_hold_value)*100)
   	 			endif
				bun_hold_date = o.orig_order_dt_tm
				bun_hold_value = cnvtreal(cv1.result_val)
    	of bun_pre_test:
   	 			rec->qual[rec->cnt]->lab[lab_cnt]->bun1_val = cv1.result_val
   	 			date1 = format(o.orig_order_dt_tm,"mm/dd/yy;;d")
   	 			date2 = format(bun_hold_date,"mm/dd/yy;;d")
   	 			if (date1 = date2)
   	 			  rec->qual[rec->cnt]->lab[lab_cnt]->urr_val =
   	 			    cnvtstring(((bun_hold_value-cnvtreal(cv1.result_val))/bun_hold_value)*100)
   	 			endif
				bun_hold_date = o.orig_order_dt_tm
				bun_hold_value = cnvtreal(cv1.result_val)
   	 	of bun_post_test:
   	 			rec->qual[rec->cnt]->lab[lab_cnt]->bun1_val = cv1.result_val
   	 			date1 = format(o.orig_order_dt_tm,"mm/dd/yy;;d")
   	 			date2 = format(bun_hold_date,"mm/dd/yy;;d")
   	 			if (date1 = date2)
   	 			  rec->qual[rec->cnt]->lab[lab_cnt]->urr_val =
   	 			    cnvtstring(((bun_hold_value-cnvtreal(cv1.result_val))/bun_hold_value)*100)
   	 			endif
				bun_hold_date = o.orig_order_dt_tm
				bun_hold_value = cnvtreal(cv1.result_val)
  	 	of crea_test:
   	 			rec->qual[rec->cnt]->lab[lab_cnt]->crea_val = cv1.result_val
   	 	of pota_test:
   	 			rec->qual[rec->cnt]->lab[lab_cnt]->pota_val = cv1.result_val
   	 	of callv_test:
   	 			rec->qual[rec->cnt]->lab[lab_cnt]->callv_val = cv1.result_val
   	 	of alb_test:
   	 			rec->qual[rec->cnt]->lab[lab_cnt]->alb_val = cv1.result_val
   	 	 of cca_test:
   	 			rec->qual[rec->cnt]->lab[lab_cnt]->cca_val = cv1.result_val
   	 	 of hgb_test:
   	 			rec->qual[rec->cnt]->lab[lab_cnt]->hgb_val = cv1.result_val
   	 	 of hgb2_test:
   	 			rec->qual[rec->cnt]->lab[lab_cnt]->hgb_val = cv1.result_val
   	 	 of phos_test:
   	 			rec->qual[rec->cnt]->lab[lab_cnt]->phos_val = cv1.result_val
   	 	 of ferr_test:
   	 			rec->qual[rec->cnt]->lab[lab_cnt]->ferr_val = cv1.result_val
   	 	 of iron_test:
   	 			rec->qual[rec->cnt]->lab[lab_cnt]->iron_val = cv1.result_val
   	 	 of ironsat_test:
   	 			rec->qual[rec->cnt]->lab[lab_cnt]->ironsat_val = cv1.result_val
		 of uibc_test:
   	 			rec->qual[rec->cnt]->lab[lab_cnt]->uibc_val = cv1.result_val
 	endcase
 
 	foot p.person_id
	Stat = alterlist(rec->qual[rec->cnt]->lab,lab_cnt)
 
 	foot report
 		  stat = alterlist(rec->qual,rec->cnt)
 
with nocounter  ;,skipreport = 1, format, separator = " "
 
/**************************************************************
; DVDev DEFINED SUBROUTINES
 
**************************************************************/
call echorecord(rec)
 
Execute reportrtl
%i mhs_prg:1_mhs_isj_lab_hemo_result2.dvl
set _SendTo=$1
 
;;if (cnvtlower(substring(1,10,_SendTo)) = "cer_print/"
;;  and cnvtlower(substring(textlen(_SendTo)-3,4,_SendTo)) != ".dat")
;;  set _SendTo = concat(_SendTo,".dat")
;;endif
;
call LayoutQuery(0)
 
end
go
