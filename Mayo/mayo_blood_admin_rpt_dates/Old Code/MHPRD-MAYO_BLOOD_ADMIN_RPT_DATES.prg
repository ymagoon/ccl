/****************************************************************************
Program:  mayo_blood_admin_rpt
Created by:  Phil Landry (Akcia)
Created Date:  05/2009
 
Modifications:
1-06/08/09, Mary Wiersgalla (LM):
   Removed TESTPATIENTs from displaying.
2-06/08/09, Mary Wiersgalla (LM):
   Display vitals prior to 30 minutes before transfusion start time
   and up to one hour after transfusion stop time.
3-09/16/09, Akcia:
   change the orderables that are being pulled; modified the joins to the
   clinical_event table to make it more efficent
4-10/23/09, Akcia:
   change the layout so that it breaks on the transfusion instead of running of the page;
   fix vitals so they all print with the appropriate date range.
5-11/1/09, Akcia:0
   fix the order_dt_tm so it prints, Remove "Not Done" results, as well as "Date/Time Correction"
   and "In Progess" in the vitals section
6-01/26/09, Akcia:
   fix to get encntr_id per transaction so it pulls all vitals for each transfusion.
7-01/29/09, Akcia:
	change event_cd to handle truncated value.
8-08/06/10, Akcia:
	Increase size of maxcol and maxrec for printed report.
	fixed issue with script always acting like it was called from ops.
9-02/20/2012, Akcia:
    Update displaykey for blood products
10 - 11/06/2013 M026751 / JTW:
    Add TRANSFUSEADDITIONALREDBLOODCELLR in code_set 200
11 - 12/02/2013, JTW:
    Add check for child orders spawned and documentation does not attach to parent order id
    code added o.template_order_id to table join syntax.
*****************************************************************************/
 
 
drop program mayo_blood_admin_rpt_dates:dba  go
create program mayo_blood_admin_rpt_dates:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Begin Date" = CURDATE
	, "End date" = CURDATE
	, "Facility Group" = ""
	, "Period" = "U"
 
with OUTDEV, sdate, edate, facility_grp, period
 
declare ops_ind  				= c1 with noconstant("N")
set ops_ind = validate(request->batch_selection, "Z")
;call echo (ops_ind)
;call echorecord(request)
;if (ops_ind != "N")
if (cnvtupper(substring(1,1,$period)) = "W")
	if (ops_ind = "Z")
	  set beg_dt = format(cnvtdate($sdate) - 7, "mmddyyyy;;d")
 
  	  set end_dt = $sdate;format(curdate, "mmddyyyy;;d")
  	else
   	  set beg_dt = format(curdate - 7, "mmddyyyy;;d")
	  set end_dt = format(curdate , "mmddyyyy;;d")
	endif
;else
elseif  (cnvtupper(substring(1,1,$period)) = "M")
	if (ops_ind = "Z")
 
	  set beg_dt = ;format(curdate - 7, "mmddyyyy;;d")
      format(cnvtlookbehind("1,M",cnvtdatetime(cnvtdate($sdate),0)), "mmddyyyy;;d")
	  set end_dt = $sdate
	else
	  set beg_dt = ;format(curdate - 7, "mmddyyyy;;d")
	  format(cnvtlookbehind("1,M",cnvtdatetime(curdate,0)), "mmddyyyy;;d")
	  set end_dt = format(curdate , "mmddyyyy;;d")
	endif
else
	if (ops_ind = "Z")
 
	  SET beg_dt = $sdate
	  set end_dt = $edate
	else
	  set beg_dt = format(curdate - 7, "mmddyyyy;;d")
	  set end_dt = format(curdate , "mmddyyyy;;d")
	endif
endif
 
call echo (beg_dt)
call echo (end_dt)
 
record facilities
(	1 qual[*]
		2 facility_cd = f8
)
 
 
select into "nl:"
cv.* from code_value cv
plan cv where cv.code_set = 220 and cv.cdf_meaning = "FACILITY"
and cv.display_key = value(concat(trim($Facility_grp,3),"*"))
 
head report
	f_cnt = 0
detail
	f_cnt = f_cnt + 1
	stat = alterlist(facilities->qual,f_cnt)
	facilities->qual[f_cnt].facility_cd = cv.code_value
 
with nocounter
declare num = i2
declare error_cd = f8 with public,constant(uar_get_code_by("MEANING",8,"INERROR"))
declare inprogress_cd = f8 with public,constant(uar_get_code_by("MEANING",8,"IN PROGRESS"))
 
declare core_temp_cd = f8 with public,constant(uar_get_code_by("DISPLAYKEY",72,"TEMPERATURECORE"))
declare Dbp_cd = f8 with public,constant(uar_get_code_by("DISPLAYKEY",72,"DIASTOLICBLOODPRESSURE"))
declare Sbp_cd = f8 with public,constant(uar_get_code_by("DISPLAYKEY",72,"SYSTOLICBLOODPRESSURE"))
 
declare canceled_cd = f8 with public,constant(uar_get_code_by("MEANING",12025,"CANCELED"))
declare transfuse_cd = f8 with public, constant(uar_get_code_by("DISPLAY_KEY",72, "TRANSFUSEBLOODPRODUCT"))
declare stop_time_cd  = f8 with public, constant(uar_get_code_by("DISPLAY_KEY",72, "BLOODUNITTRANFUSIONSTOPTIME"))
declare start_time_cd  = f8 with public, constant(uar_get_code_by("DISPLAY_KEY",72, "BLOODUNITTRANSFUSIONSTARTTIME"))
declare donor_type_cd  = f8 with public, constant(uar_get_code_by("DISPLAY_KEY",72, "DONORTYPE"))
declare equipment_cd  = f8 with public, constant(uar_get_code_by("DISPLAY_KEY",72, "BLOODADMINISTRATIONEQUIPMENT"))
declare product_cd  = f8 with public, constant(uar_get_code_by("DESCRIPTION",72, "Blood Product"))
 
 
declare blood_pat_info_cd  = f8 with public, constant(uar_get_code_by("DISPLAY_KEY",72, "BLOODANDPATIENTINFORMATIONVERIFIED"))
declare donor_nbr_cd  = f8 with public, constant(uar_get_code_by("DISPLAY_KEY",72, "DONORNUMBER"))
declare Patient_blood_type_cd  = f8 with public, constant(uar_get_code_by("DISPLAY_KEY",72, "PATIENTBLOODTYPE"))
declare special_needs_cd  = f8 with public, constant(uar_get_code_by("DISPLAY_KEY",72, "BLOODUNITSPECIALNEEDS"))
declare ind_for_trans_cd = f8 with public,  constant(uar_get_code_by("DISPLAY_KEY",72, "INDICATIONSFORTRANSFUSION"))
declare transfusion_completed_cd  = f8 with public, constant(uar_get_code_by("DISPLAY_KEY",72,"TRANSFUSIONCOMPLETED"))
declare pat_verify_cd  = f8 with public,
						constant(uar_get_code_by("DISPLAY_KEY",72,"PATIENTVERIFICATIONBLOODADMINISTRATE"))
declare transfusion_calalog_cd  = f8 with public, constant(3512916.00) ;03
;03 uar_get_code_by("DISPLAY_KEY",200, "TRANSFUSEBLOODPRODUCT"))
 
;03 declare Transfuse_Blood_Product_cd = f8 with public, constant(uar_get_code_by("DISPLAYKEY",200,"TRANSFUSEBLOODPRODUCT"))
;03 start
declare cryoprecipitate_cd  = f8 with public, constant(uar_get_code_by("DISPLAY_KEY",200, "TRANSFUSEBLOODPRODUCTCRYOPRECIPITATE"))
declare fresh_frozen_cd  = f8 with public, constant(uar_get_code_by("DISPLAY_KEY",200, "TRANSFUSEBLOODPRODUCTFRESHFROZENPL"))  ;07
;09declare packed_cells_cd  = f8 with public, constant(uar_get_code_by("DISPLAY_KEY",200, "TRANSFUSEBLOODPRODUCTPACKEDCELLS"))
;09declare platelets_cd  = f8 with public, constant(uar_get_code_by("DISPLAY_KEY",200, "TRANSFUSEBLOODPRODUCTPLATELETS"))
;03 end
declare platelets_cd  = f8 with public, constant(uar_get_code_by("DISPLAY_KEY",200, "TRANSFUSEBLOODPRODUCTPLATELETSPHER"))		;09
declare packed_cells_cd  = f8 with public, constant(uar_get_code_by("DISPLAY_KEY",200, "TRANSFUSEBLOODPRODUCTREDBLOODCELLS"))	;09
declare addnl_blood_cells_cd  = f8
with public, constant(uar_get_code_by("DISPLAY_KEY",200, "TRANSFUSEADDITIONALREDBLOODCELLR"))	;10 JTW
 
declare ORDER_COMP_STAT_cd = f8 with public, constant(uar_get_code_by("MEANING",6004,"COMPLETED"))
declare TASK_COMP_STAT_cd = f8 with public, constant(uar_get_code_by("MEANING",79,"COMPLETE"))
declare ENC_mrn_cd = f8 with public, constant(uar_get_code_by("MEANING",319,"MRN"))
declare fnbr_cd = f8 with public, constant(uar_get_code_by("MEANING",319,"FIN NBR"))
declare PAT_MRN_cd = f8 with public, constant(uar_get_code_by("MEANING",4,"MRN"))
declare other_MRN_cd = f8 with public, constant(uar_get_code_by("MEANING",4,"OTHER"))
declare clin_mrn_pool_cd = f8 with public, constant(uar_get_code_by("DISPLAYKEY",263,"CLINICMRN"))
declare lH_mrn_pool_cd = f8 with public, constant(uar_get_code_by("DISPLAYKEY",263,"LHMRN"))
declare BL_mrn_pool_cd = f8 with public, constant(uar_get_code_by("DISPLAYKEY",263,"BLMRN"))
declare OS_mrn_pool_cd = f8 with public, constant(uar_get_code_by("DISPLAYKEY",263,"OSMRN"))
declare BA_mrn_pool_cd = f8 with public, constant(uar_get_code_by("DISPLAYKEY",263,"BAMRN"))
 
 
declare order_action_type_cd = f8 with public, constant(uar_get_code_by("MEANING",6003,"ORDER"))
 
set report_run_date_disp = format(curdate, "mm/dd/yy;;d")
set report_run_time_disp = format(curtime, "hh:mm;;m" )
set report_date_range_disp = ; "date range"
					concat (format(cnvtdatetime(cnvtdate(beg_dt),0),"mm/dd/yy;;d"), " - ",
							         format(cnvtdatetime(cnvtdate(end_dt),0),"mm/dd/yy;;d"))
free record rec
record rec(
	1 pat[*]
		2 loc_facility_cd = f8
		2 loc_facility_name = vc
;6		2 Encntr_id = f8
		2 person_id = f8
		2 name = vc
		2 mrn = vc
		2 H_MRN
			3 alias = VC
;			3 loc_facility_cd = f8
;			3 facility_key = vc
			3 alias_type_cd = f8
			3 alias_pool_cd = f8
 
		2 fnbr = vc
		2 birthdate = dq8
 
		2 trans[*]
		  3 Encntr_id = f8    ;6
		  3 order_phys_id = f8
		  3 order_id = f8  ;gm
		  3 order_t_id = f8  ;gm
		  3 order_phys = vc
		  3 order_dt_tm = dq8
		  3 donor_nbr = vc
		  3 donor_type = vc
		  3 blood_type = vc
		  3 blood_product = vc
		  3 special_needs = vc
		  3 blood_pat_info = vc
		  3 pat_verif = vc
		  3 equipment = vc
		  3 indication = vc
		  3 trans_completed = vc
		  3 trans_start_dt_tm = dq8
		  3 trans_stop_dt_tm = dq8
		  3 vitals_cnt = i4
		  3 vitals[*]
		    4 event_dt_tm = dq8
		    4 core_temp = vc
		    4 sbp = vc
		    4 dbp = vc
		    )
 
 
select into "nl:"
 pat_name = p.name_full_formatted
 , order_phy_name = phy.name_full_formatted
 ,o.order_mnemonic
 , cedr.result_dt_tm "mm/dd/yy hh:mm:ss;;d"
 , mrn = cnvtalias(pa.alias,pa.alias_pool_cd)
 , fnbr =  cnvtalias(ea.alias,ea.alias_pool_cd)
 , facility = uar_get_code_display(e.loc_facility_cd)
 ;, ce3.*
 
from orders o,
	order_action oa,
; gm	order_detail od,
	prsnl phy,
	person p,
	encounter e,
	code_value c,
	;03 clinical_event ce1,
	;03 clinical_event ce2,
	clinical_event ce3,
;	clinical_event ce4, gm
	encntr_alias ea,
	person_alias pa,
;	person_alias pa1,
;	dummyt test1,
;;	task_activity ta,
	dummyt d1, ;gm
	ce_date_result cedr
 
	plan o
	;03 where o.catalog_cd = transfusion_calalog_cd
	where o.catalog_cd+0 in (cryoprecipitate_cd,fresh_frozen_cd,packed_cells_cd,platelets_cd,transfusion_calalog_cd,
	addnl_blood_cells_cd)  ;03 ;10 addnl_blood_cells_cd added JTW
	and o.orig_order_dt_tm between cnvtdatetime(cnvtdate(beg_dt),0)
	and cnvtdatetime(cnvtdate(end_dt),235959)
	and o.order_status_cd+0 = ORDER_COMP_STAT_cd
	and o.template_order_flag != 1
;	AND O.PERSON_ID  =     7151321.00
 
 
;	join oa where oa.order_id = o.order_id                                          011 JTW
	join oa where (oa.order_id = o.order_id or oa.order_id = o.template_order_id)  ;011 JTW
	and oa.action_type_cd = order_action_type_cd
 
;	join od where od.order_id = o.order_id                                          011 JTW
;	join od where (od.order_id = o.order_id	or od.order_id = o.template_order_id)  ;011 JTW;
;	and od.oe_field_meaning = "OTHER"
 
 	join phy where phy.person_id = oa.order_provider_id ; oa.action_personnel_id
 
	join p where p.person_id = o.person_id
	; do not display TESTPATIENTs -mbw 06/08/09
	and p.name_last_key != "TESTPATIENT"
 
 
;;;
;;;	join pa1 where pa.person_id = outerjoin(p.person_id)
;;;	and pa1.person_alias_type_cd = outerjoin(pat_mrn_cd)
;;;	and pa1.alias_pool_cd = outerjoin(clin_mrn_pool_cd)
;;;	and pa1.active_ind = outerjoin(1)
;;;	and pa1.end_effective_dt_tm > outerjoin(cnvtdatetime(sysdate,curtime))
 
	join e where e.encntr_id = o.encntr_id
		and expand(num, 1, size(facilities->qual,5), e.loc_facility_cd, facilities->qual[num].facility_cd )
 
	join c where c.CODE_VALUE = e.loc_facility_cd
 
;;	join ea where ea.encntr_id = outerjoin(e.encntr_id)
;;	and ea.encntr_alias_type_cd = outerjoin(fnbr_cd)
;;	and ea.active_ind = outerjoin(1)
;;	and ea.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime))
;;
;;	join pa where pa.person_id = outerjoin(p.person_id)
;;	and pa.person_alias_type_cd = outerjoin(pat_mrn_cd)
;;	and pa.active_ind = outerjoin(1)
;;	and pa.end_effective_dt_tm > outerjoin(cnvtdatetime(sysdate,curtime))
;;	and pa.alias_pool_cd = outerjoin(clin_mrn_pool_cd)
 
;	join ta
;	where ta.order_id = o.order_id
;	and ta.event_id > 0
;  	and ta.task_status_cd = TASK_COMP_STAT_cd ; completed
 
;03  	join; ce1 where ce1.event_id = ta.event_id
;03  		ce1 where ce1.order_id = o.order_id
;03  		and ce1.event_cd = transfuse_cd
;03	and ce1.valid_until_dt_tm > cnvtdatetime(curdate,curtime)
;03
;03	join ce2
;03	where ce2.parent_event_id = ce1.event_id
;03	and ce2.valid_until_dt_tm > cnvtdatetime(curdate,curtime)
;03	and ce2.EVENT_TITLE_TEXT in ("Initiation", "Transfusion V2")
 
 
;011 JTW Begin
join d1
	Join ce3
	where (ce3.order_id = o.order_id or ce3.order_id = o.template_order_id) ;03  ce3.parent_event_id = ce2.event_id
	and ce3.valid_until_dt_tm > sysdate   ;03  cnvtdatetime(curdate,curtime)
	and ce3.event_cd in ( stop_time_cd, start_time_cd, donor_type_cd, equipment_cd, product_cd,
	  blood_pat_info_cd, donor_nbr_cd, Patient_blood_type_cd, special_needs_cd, transfusion_completed_cd,
	  pat_verify_cd,ind_for_trans_cd)
	and ce3.event_tag != "Not Done*"
 
;011 JTW Add Second pass on Clinical_Events to capture Template_Order_ID data for performance
;gm - comment out removed oracle join and used dummy join
;join d2
; 	Join ce4
;	where ce4.order_id = o.template_order_id
;	and ce4.valid_until_dt_tm > sysdate
;	and ce4.event_cd in ( stop_time_cd, start_time_cd, donor_type_cd, equipment_cd, product_cd,
;	  blood_pat_info_cd, donor_nbr_cd, Patient_blood_type_cd, special_needs_cd, transfusion_completed_cd,
;	  pat_verify_cd,ind_for_trans_cd)
;	and ce4.event_tag != "Not Done*"
;011 JTW End
 
	join cedr
	where cedr.event_id =  outerjoin(ce3.event_id)
	 AND CEDR.valid_until_dt_tm > OUTERJOIN(SYSDATE)
 
;03	join test1
 
	join ea where ea.encntr_id =  outerjoin(e.encntr_id)
	and ea.encntr_alias_type_cd = outerjoin(fnbr_cd)
	and ea.active_ind = outerjoin(1)
	and ea.end_effective_dt_tm > outerjoin(SYSDATE)
 
	join pa where pa.person_id =  outerjoin(p.person_id)
	and pa.person_alias_type_cd = outerjoin(pat_mrn_cd)
	and pa.active_ind = outerjoin(1)
	and pa.end_effective_dt_tm > outerjoin(SYSDATE)
;	and pa.alias_pool_cd = outerjoin(clin_mrn_pool_cd)
 
 
 
	order facility, pat_name, o.order_id
 
	head report
		pat_cnt = 0
 
	head pat_name
		trans_cnt = 0
		pat_cnt = pat_cnt + 1
      	if (mod(pat_cnt,10) = 1)
          stat = alterlist(rec->pat, pat_cnt + 9)
    	endif
		;6  rec->pat[pat_cnt]->encntr_id = o.encntr_id
		rec->pat[pat_cnt].birthdate = p.birth_dt_tm
		rec->pat[pat_cnt].name = pat_name
		rec->pat[pat_cnt].person_id = p.person_id
		rec->pat[pat_cnt].mrn = mrn
		rec->pat[pat_cnt].fnbr = fnbr
		rec->pat[pat_cnt].loc_facility_cd = e.loc_facility_cd
		rec->pat[pat_cnt].loc_facility_name = facility
 
		if (c.display_key  = "EULUTHERHOSP")
			rec->pat[pat_cnt].h_mrn.alias_pool_cd = LH_Mrn_pool_cd
		elseif (c.display_key  = "EUNORTHLNDHOSP")
			rec->pat[pat_cnt].h_mrn.alias_pool_cd = BA_Mrn_pool_cd
		elseif (c.display_key  = "EUCHIPVALHOSP")
			rec->pat[pat_cnt].h_mrn.alias_pool_cd = BL_Mrn_pool_cd
		elseif (c.display_key  = "EUOAKRIDGEHOSP")
			rec->pat[pat_cnt].h_mrn.alias_pool_cd = OS_Mrn_pool_cd
		ENDIF
 
	head o.order_id
		trans_cnt = trans_cnt + 1
		if (mod(trans_cnt,10) = 1)
          stat = alterlist(rec->pat[pat_cnt]->trans, trans_cnt + 9)
     	endif
     	rec->pat[pat_cnt].trans[trans_cnt]->encntr_id = o.encntr_id			;6
     	rec->pat[pat_cnt].trans[trans_cnt].order_id = o.order_id  ;gm
     	rec->pat[pat_cnt].trans[trans_cnt].order_t_id = o.template_order_id ;gm
     	rec->pat[pat_cnt].trans[trans_cnt].order_phys = order_phy_name
     	rec->pat[pat_cnt].trans[trans_cnt].order_phys_id = phy.person_id
     	rec->pat[pat_cnt].trans[trans_cnt].order_DT_TM = o.orig_order_dt_tm  ;o.order_id
;     	rec->pat[pat_cnt].trans[trans_cnt].indication = od.oe_field_display_value
 
    detail
	    if (ce3.event_cd = stop_time_cd and cedr.event_id = ce3.event_id)
			rec->pat[pat_cnt].trans[trans_cnt].trans_stop_dt_tm = cedr.result_dt_tm
	    elseif (ce3.event_cd = start_time_cd and cedr.event_id = ce3.event_id)
	    	rec->pat[pat_cnt].trans[trans_cnt].trans_start_dt_tm = cedr.result_dt_tm
	    elseif (ce3.event_cd = donor_type_cd)
	    	rec->pat[pat_cnt].trans[trans_cnt].donor_type = ce3.event_tag
	    elseif (ce3.event_cd = equipment_cd)
	    	rec->pat[pat_cnt].trans[trans_cnt].equipment = ce3.event_tag
	    elseif (ce3.event_cd = product_cd)
	    	rec->pat[pat_cnt].trans[trans_cnt].blood_product = ce3.event_tag
	    elseif (ce3.event_cd = blood_pat_info_cd)
	    	rec->pat[pat_cnt].trans[trans_cnt].blood_pat_info = ce3.event_tag
	    elseif (ce3.event_cd = donor_nbr_cd)
	    	rec->pat[pat_cnt].trans[trans_cnt].donor_nbr = ce3.event_tag
	    elseif (ce3.event_cd = Patient_blood_type_cd)
	    	rec->pat[pat_cnt].trans[trans_cnt].blood_type = ce3.event_tag
	    elseif (ce3.event_cd = special_needs_cd)
	    	rec->pat[pat_cnt].trans[trans_cnt].special_needs = ce3.event_tag
	    elseif (ce3.event_cd = ind_for_trans_cd)
	    	rec->pat[pat_cnt].trans[trans_cnt].indication = ce3.event_tag
	    elseif (ce3.event_cd = transfusion_completed_cd)
	    	rec->pat[pat_cnt].trans[trans_cnt].trans_completed = ce3.event_tag
	    elseif (ce3.event_cd = pat_verify_cd)
	    	rec->pat[pat_cnt].trans[trans_cnt].pat_verif = ce3.event_tag
		endif
 
	foot pat_name
		stat = alterlist(rec->pat[pat_cnt]->trans, trans_cnt)
 
 
	foot report
		stat = alterlist(rec->pat, pat_cnt)
 
	with nocounter, outerjoin = d1, maxsecs=60 ;gm - set dummy join up ;, format, separator = " "  ,skipreport = 1
if(size(rec->pat,5) = 0)
   go to program_exit
endif
 
; GET HOSPITAL MRN
select  into "NL:"
 
 
 
from (dummyt d with seq = size(rec->pat,5)),
 
 
	person_alias H_MRN
 
PLAN D
 
 
 
	join H_MRN
	where H_MRN.person_id 			= outerjoin(rec->pat[D.SEQ].person_id )
	and H_MRN.person_alias_type_cd 	= outerjoin(other_MRN_cd)
	and H_MRN.alias_pool_cd 		= outerjoin(rec->pat[D.SEQ].H_MRN.ALIAS_pool_cd)
	and H_MRN.active_ind 			= outerjoin(1)
 
 detail
 
 
   	rec->pat[D.SEQ].H_MRN.ALIAS = cnvtalias(H_MRN.alias,H_MRN.alias_pool_cd)
;;   elseif (c.display_key  = "EUNORTHLNDHOSP")
;;   	rec->pat[D.SEQ].H_MRN = cnvtalias(BAMRN.alias,BAMRN.alias_pool_cd)
;;   elseif (c.display_key  = "EUCHIPVALHOSP")
;;   	rec->pat[D.SEQ].H_MRN = cnvtalias(BLMRN.alias,BLMRN.alias_pool_cd)
;;   elseif (c.display_key  = "EUOAKRIDGEHOSP")
;;   	rec->pat[D.SEQ].H_MRN = cnvtalias(OSMRN.alias,OSMRN.alias_pool_cd)
;;   ENDIF
WITH NOCOUNTER, maxsecs=60
; get vitals
 
for (x = 1 to size(rec->pat,5))
 
	select distinct into "nl:"
	  ;event_dt_tm = format(ce.event_end_dt_tm,"mm/dd/yy hh:mm;;d"),
	  ;trans_stop = format(rec->pat[x].trans[d.seq].trans_stop_dt_tm,"mm/dd/yy hh:mm;;d"),
	  ce.event_tag,
	  event_dt_tm = ce.event_end_dt_tm,
	  res_units = UAR_GET_CODE_DISPLAY(CE.result_units_cd),
	  order_dt_tm   = rec->pat[x].trans[d.seq].order_dt_tm,
		ce.clinical_event_id,
	  d.seq
	from
	(dummyt d with seq = size(rec->pat[x].trans,5)),
	Clinical_event ce
 
	plan d
	join ce where ce.encntr_id = rec->pat[x].trans[d.seq].Encntr_id   ;6
;		and ce.order_id = rec->pat[x].trans[d.seq].order_id ;gm
		and ce.event_cd in (core_temp_cd,Dbp_cd,Sbp_cd)
		; pull in vitals 30 minutes prior to transfusion start time -mbw 06/08/09
		and ce.event_end_dt_tm between cnvtlookbehind("30,MIN",cnvtdatetime(rec->pat[x].trans[d.seq].trans_start_dt_tm))
		;and ce.event_end_dt_tm between cnvtdatetime(rec->pat[x].trans[d.seq].trans_start_dt_tm)
		;and ce.event_end_dt_tm >= cnvtlookbehind("30,MIN",cnvtdatetime(rec->pat[x].trans[d.seq].trans_start_dt_tm))
								; pull in vitals up to 1 hour after transfustion stop time -mbw 06/08/09
		 and  cnvtlookahead("60,MIN",cnvtdatetime(rec->pat[x].trans[d.seq].trans_stop_dt_tm))
 								;and ce.event_end_dt_tm <= cnvtdatetime(rec->pat[x].trans[d.seq].trans_stop_dt_tm)
 		 and not ce.result_status_cd in (error_cd,inprogress_cd)
 		 and ce.event_tag != "Date\Time Correction"
	order by d.seq, ce.event_end_dt_tm, ce.clinical_event_id
	head d.seq
	 vcnt = 0
	head ce.parent_event_id
 		vcnt = vcnt + 1
 		rec->pat[x].trans[d.seq].vitals_cnt = vcnt
 		stat = alterlist(rec->pat[x].trans[d.seq].vitals,vcnt)
 	detail
 		rec->pat[x].trans[d.seq].vitals[vcnt].event_dt_tm = ce.event_end_dt_tm
 
 		if (ce.event_cd = core_temp_cd)
 			if (ce.result_units_cd > 0.0)
 				rec->pat[x].trans[d.seq].vitals[vcnt].core_temp = concat (trim(ce.event_tag,3), " ",res_units)
 			else
 				rec->pat[x].trans[d.seq].vitals[vcnt].core_temp = ce.event_tag
 			endif
 		elseif (ce.event_cd = Dbp_cd)
 			if (ce.result_units_cd > 0.0)
	 			rec->pat[x].trans[d.seq].vitals[vcnt].dbp = concat (trim(ce.event_tag,3), " ",res_units)
	 		else
	 			rec->pat[x].trans[d.seq].vitals[vcnt].dbp = ce.event_tag
	 		endif
 		elseif (ce.event_cd = Sbp_cd)
 		 	if (ce.result_units_cd > 0.0)
	 			rec->pat[x].trans[d.seq].vitals[vcnt].sbp = concat (trim(ce.event_tag,3), " ",res_units)
	 		else
	 			rec->pat[x].trans[d.seq].vitals[vcnt].sbp = ce.event_tag
	 		endif
 		endif
	with nocounter, maxsecs=60  ;,skipreport = 1 , format, separator = " "
endfor
 
call echorecord(rec)
;/*
; print report here
select into $outdev
		encntr_id = rec->pat[d.seq].trans[d1.seq].encntr_id ,
		birth_date = rec->pat[d.seq].birthdate "MM/DD/YYYY;;D",
		pat_name = substring(1,40,rec->pat[d.seq].name) ,
		person_id = rec->pat[d.seq].person_id ,
		mrn = substring(1,20,rec->pat[d.seq].mrn),
		hmrn = substring(1,20,rec->pat[d.seq].h_mrn.alias),
		fnbr = substring(1,20,rec->pat[d.seq].fnbr),
		order_phys = substring(1,40,rec->pat[d.seq].trans[d1.seq].order_phys ),
     	order_phys_nbr = rec->pat[d.seq].trans[d1.seq].order_phys_id,
     	order_id = rec->pat[d.seq].trans[d1.seq].order_id,
     	order_date = rec->pat[d.seq].trans[d1.seq].order_dt_tm "MM/DD/YY hh:mm;;D",
    	stop_dt_tm =  rec->pat[d.seq].trans[d1.seq].trans_stop_dt_tm "mm/dd/yy  HH:MM;;d",
	    start_time = rec->pat[d.seq].trans[d1.seq].trans_start_dt_tm  "mm/dd/yy  HH:MM;;d",
	    donor_type = substring(1,40,rec->pat[d.seq].trans[d1.seq].donor_type),
	    facility = substring(1,40,rec->pat[d.seq].loc_facility_name)
 
 
from (dummyt d with seq = size(rec->pat,5)),
	(dummyt d1 with seq = 1)
 
plan d
	where maxrec(d1, size(rec->pat[d.seq].trans,5))
join d1
 
 order
 
 facility, pat_name,order_id
HEAD REPORT
 XCOL = 0 ,
 YCOL = 0 ,
 SCOL = 0 ,
 ZCOL = 0 ,
 section_flag = 1
 LINE_CNT = 0 ,
 AST  = "* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *" ,
 AST2 = "* * * * * * * * * * * * * * * * * * * * * * * * * * * *" ,
 line1 = fillstring(105,"_" ),
 x_left_margin = 30
 x_name_off = 30
 x_mrn_off = 185
 x_fin_off = 275
 x_dob_off = 345
 x_hmrn_off = 425
; x_mrn_off = 170
; x_fin_off = 260
; x_dob_off = 330
; x_hmrn_off = 410
 x_detail1 = 50
 x_detail2 = 230
 x_detail3 = 570
; x_core_temp = 120
; x_sbp = 275
; x_dbp = 450
 x_core_temp = 140
 x_sbp = 295
 x_dbp = 470
 x_dbp = 480
 pat_printed = "N"
 
 CAT_LINE = FILLSTRING ( 150 ,  " " )
HEAD PAGE
 XCOL = 0 ,
 YCOL = 0 ,
	col 0 "{ps/792 0 translate 90 rotate 0 11 792 moveto/}"
	row + 1
 
 
	  "{f/0}{cpi/16}{lpi/10}", row + 1
	  ycol = ycol + 13
	  call print(calcpos(x_left_margin, ycol)),"Run Date:  ", report_run_date_disp, row + 1
	  ycol = ycol + 13
 	  call print(calcpos(x_left_margin, ycol)),"Run Time: ",report_run_time_disp, row + 1
	  ycol = ycol + 13
 	  call print(calcpos(x_left_margin, ycol)),"Report dates: ",report_date_range_disp, row + 1
 
	; "{cpi/10}{f/12}" ,
	 "{f/0}{cpi/13}{f/8}" ,
	 ROW + 1 ,
 
	 "{pos/275/13}{b}MHS EMR -" rec->pat[d.seq].loc_facility_name  ,
	 ROW + 1 ,
	 "{pos/275/33}{b}Blood Administration Report" ,
	 ROW + 1 ,
	 "{cpi/13}{f/8}" ,
	 ROW + 1 ,
	 ycol = 60
	 xcol = x_name_off
	 CALL PRINT ( CALCPOS ( XCOL ,  YCOL )) "{b}Patient Name{endb}" ,
	 ROW + 1 ,
	 xcol = x_mrn_off
	 CALL PRINT ( CALCPOS ( XCOL ,  YCOL ))  "{b}Clinic MRN {endb}" ,
	 ROW + 1 ,
	  xcol = x_fin_off
	 CALL PRINT ( CALCPOS ( XCOL ,  YCOL ))  "{b}FIN {endb}" ,
	  ROW + 1 ,
	   xcol = x_dob_off
	 CALL PRINT ( CALCPOS ( XCOL ,  YCOL ))  "{b}Date of Birth {endb}" ,
	 ROW + 1 ,
	  xcol = x_hmrn_off
	 CALL PRINT ( CALCPOS ( XCOL ,  YCOL ))  "{b}Hospital MRN {endb}" ,
	  ROW + 1
	  xcol = x_left_margin
	  ycol = ycol + 13
	 CALL PRINT ( CALCPOS ( XCOL ,  YCOL )) "{b}Order Date/ Time{endb}" ,
	  ROW + 1
	  xcol = x_mrn_off
 
	 CALL PRINT ( CALCPOS ( XCOL ,  YCOL )) "{b}Ordering Provider{endb}" ,
	 xcol = x_left_margin
	  ycol = ycol + 7
	 CALL PRINT ( CALCPOS ( XCOL ,  YCOL ))  "{repeat/140/_/}" ;  line1 ,
	  ROW + 1
 
	 ycol = ycol + 13
	 xcol = x_name_off
	 CALL PRINT ( CALCPOS ( XCOL ,  YCOL )) "{b}" ,pat_name, "{endb}" ,
	  ROW + 1
 
	 xcol = x_mrn_off
	 CALL PRINT ( CALCPOS ( XCOL ,  YCOL )) "{b}" ,mrn , 	 "{endb}" ,
	  ROW + 1
 
	 xcol = x_fin_off
	 CALL PRINT ( CALCPOS ( XCOL ,  YCOL )) "{b}" ,fnbr , 	 "{endb}" ,
	  ROW + 1
 
	 xcol = x_dob_off
	 CALL PRINT ( CALCPOS ( XCOL ,  YCOL )) "{b}" ,birth_date ,  "{endb}" ,
	  ROW + 1
 
	 xcol = x_hmrn_off
	 CALL PRINT ( CALCPOS ( XCOL ,  YCOL )) "{b}" ,hmrn ,  "{endb}" ,
	  ROW + 1
     pat_printed = "Y"
 
head facility
	if (d.seq > 1)
		break
	endif
 
HEAD PAT_NAME
	if ((((rec->pat[d.seq].trans[d1.seq].vitals_cnt + 9) * 13) + ycol) > 575)
		break
	endif
	if (pat_printed = "N")
	  ycol = ycol + 13
	 xcol = x_name_off
	 CALL PRINT ( CALCPOS ( XCOL ,  YCOL )) "{b}" ,pat_name, "{endb}" ,
	  ROW + 1
 
	 xcol = x_mrn_off
	 CALL PRINT ( CALCPOS ( XCOL ,  YCOL )) "{b}" ,mrn , 	 "{endb}" ,
	  ROW + 1
 
	 xcol = x_fin_off
	 CALL PRINT ( CALCPOS ( XCOL ,  YCOL )) "{b}" ,fnbr , 	 "{endb}" ,
	  ROW + 1
 
	 xcol = x_dob_off
	 CALL PRINT ( CALCPOS ( XCOL ,  YCOL )) "{b}" ,birth_date ,  "{endb}" ,
	  ROW + 1
 
	 xcol = x_hmrn_off
	 CALL PRINT ( CALCPOS ( XCOL ,  YCOL )) "{b}" ,hmrn ,  "{endb}" ,
	  ROW + 1
 	endif
 	pat_printed = "N"
 
HEAD ORDER_ID
	if ((((rec->pat[d.seq].trans[d1.seq].vitals_cnt + 8) * 13) + ycol) > 575)
		break
		pat_printed = "N"
	endif
	  ycol = ycol + 13
	 xcol = x_left_margin
	 CALL PRINT ( CALCPOS ( XCOL ,  YCOL ))  "{b}" ,order_date ,  "{endb}" ,
	  ROW + 1
 
	 xcol = x_mrn_off
	 CALL PRINT ( CALCPOS ( XCOL ,  YCOL )) "{b}" ,order_phys ,  "{endb}" ,
	  ROW + 1
 
DETAIL
	if ((((rec->pat[d.seq].trans[d1.seq].vitals_cnt + 7) * 13) + ycol) > 575)
		break
		pat_printed = "N"
	endif
	ycol = ycol + 13
	xcol = x_detail1
	CALL PRINT ( CALCPOS ( XCOL ,  YCOL ))  "Donor Number:  ",rec->pat[d.seq].trans[d1.seq].donor_nbr
	ROW + 1
 
	xcol = x_detail2
	CALL PRINT ( CALCPOS ( XCOL ,  YCOL ))  "Special Needs:  ",rec->pat[d.seq].trans[d1.seq].special_needs
	ROW + 1
 
	xcol = x_detail3
	CALL PRINT ( CALCPOS ( XCOL ,  YCOL ))  "Indication for Transfusion:  ",  rec->pat[d.seq].trans[d1.seq].indication
	ROW + 1
 
	ycol = ycol + 13
	xcol = x_detail1
	CALL PRINT ( CALCPOS ( XCOL ,  YCOL ))  "Donor Type:  ",rec->pat[d.seq].trans[d1.seq].donor_type
	ROW + 1
 
	xcol = x_detail2
	CALL PRINT ( CALCPOS ( XCOL ,  YCOL ))  "Blood/Patient Info Verified:  ",rec->pat[d.seq].trans[d1.seq].blood_pat_info
	ROW + 1
 
	xcol = x_detail3
	CALL PRINT ( CALCPOS ( XCOL ,  YCOL ))  "Transfusion Completed:  ",rec->pat[d.seq].trans[d1.seq].trans_completed
	ROW + 1
 
	ycol = ycol + 13
	xcol = x_detail1
	CALL PRINT ( CALCPOS ( XCOL ,  YCOL ))  "Patient Blood Type:  ",rec->pat[d.seq].trans[d1.seq].blood_type
	ROW + 1
 
	xcol = x_detail2
	CALL PRINT ( CALCPOS ( XCOL ,  YCOL ))  "Patient Verification:  ",rec->pat[d.seq].trans[d1.seq].pat_verif
	ROW + 1
 
	xcol = x_detail3
	CALL PRINT ( CALCPOS ( XCOL ,  YCOL ))  "Transfusion Start:  ",start_time
	ROW + 1
 
	ycol = ycol + 13
	xcol = x_detail1
	CALL PRINT ( CALCPOS ( XCOL ,  YCOL ))  "Blood Product:  ",rec->pat[d.seq].trans[d1.seq].blood_product
	ROW + 1
 
	xcol = x_detail2
	CALL PRINT ( CALCPOS ( XCOL ,  YCOL ))  "Blood Administration Equipment:  ",rec->pat[d.seq].trans[d1.seq].equipment
	ROW + 1
 
	xcol = x_detail3
 
	CALL PRINT ( CALCPOS ( XCOL ,  YCOL ))  "Transfusion Stop:  ",stop_dt_tm
	ROW + 1
 
 
	ycol = ycol + (13 * 2) ; 3 line
 
;	xcol = x_left_margin
		xcol = x_detail1
	CALL PRINT ( CALCPOS ( XCOL ,  YCOL ))  "{u}Vital Signs"
	ROW + 1
		ycol = ycol + 13
	disp_date = "              "
	for (x = 1 to rec->pat[d.seq].trans[d1.seq].vitals_cnt)
		disp_date = format(rec->pat[d.seq].trans[d1.seq].vitals[x].event_dt_tm,"mm/dd/yy hh:mm;;d")
;		xcol = x_left_margin
		xcol = x_detail1
		CALL PRINT ( CALCPOS ( XCOL ,  YCOL ))  disp_date
		ROW + 1
		xcol = x_core_temp
		CALL PRINT ( CALCPOS ( XCOL ,  YCOL ))  "Core Temperature: ",rec->pat[d.seq].trans[d1.seq].vitals[x].core_temp
		ROW + 1
		xcol = x_sbp
		CALL PRINT ( CALCPOS ( XCOL ,  YCOL ))  "Systolic Blood Pressure: ",rec->pat[d.seq].trans[d1.seq].vitals[x].sbp
		ROW + 1
		xcol = x_dbp
		CALL PRINT ( CALCPOS ( XCOL ,  YCOL ))  "Diastolic Blood Pressure: ",rec->pat[d.seq].trans[d1.seq].vitals[x].dbp
		ROW + 1
		ycol = ycol + 13
	endfor
 
 
foot order_date
	ycol = ycol + 13
 
 
foot pat_name
	 xcol = x_left_margin
 
	 ; ycol = ycol + 7
	 CALL PRINT ( CALCPOS ( XCOL ,  YCOL ))  "{repeat/140/_/}" ;  line1 ,
	  ROW + 1
 
foot page
	 xcol = x_left_margin
 
	  ycol = 575
	 CALL PRINT ( CALCPOS ( XCOL ,  YCOL ))  "Blood Administration, page: ",  CURPAGE  "##", ;  line1 ,
	 ROW + 1
;;	with nocounter, format, separator = " "
;WITH  NOCOUNTER , MAXROW = 800 , MAXCOL = 800 , DIO = POSTSCRIPT
WITH  NOCOUNTER , MAXROW = 5000 , MAXCOL = 2000 , DIO = POSTSCRIPT, maxsecs=60
 ;*/
# program_exit
free record rec
end go