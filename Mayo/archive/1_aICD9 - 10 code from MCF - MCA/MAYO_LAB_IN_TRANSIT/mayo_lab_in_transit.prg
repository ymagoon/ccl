drop program mayo_lab_in_transit:dba go
create program mayo_lab_in_transit:dba
;~DB~************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *                                                                      *
;    *Mod Date     Engineer             Comment                             *
;    *--- -------- -------------------- ----------------------------------- *
;    * 001 05/03/13 m063907             CAB 13629 layout changes            *
;    * 002 01/17/14 m026751             CAB 13629 logic changes, add prompts*
;~DE~************************************************************************************************************
 
 
 
 
;*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
;*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
;*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
;*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
;
;
;
;;;;************ added outer join to collection list to allow records to qualify    ;;;;;;;***************
;
;
;
;
;*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
;notes from converence call 10/27/2014
;  Add a reprint prompt to allow them to reprint a batch.  Make batch id required if it is selected and encntr_type/fin class
;   Hidden.  if it is not selected hid batch number prompt.
;  Need to flex query based on reprint ind.  Fill out same record structure for layout.
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "By Date or Batch Number" = 1
	, "Facility Group" = ""
	, "From Lab Bench" = 0
	, "To Lab Facillity Group" = ""
	, "To Lab Bench" = 0
	, "Fiancial Class" = ""
	, "Encounter Type" = ""
	, "Start Date" = CURDATE
	, "End Date" = CURDATE
	, "Batch Number" = 0                     ;* Batch Number
 
with OUTDEV, Format_ind, fac_grp, fr_lab, to_lab_facility_group, to_lab,
	fin_class, enc_type, sdate, edate, batch_nbr
 
declare home_cd = f8 with protect, constant(uar_get_code_by("MEANING",212,"HOME"))
declare Bus_addr_cd = f8 with protect, constant(uar_get_code_by("MEANING",212,"BUSINESS"))
declare NPI_cd = f8 with protect, constant(uar_get_code_by("MEANING",320,"NPI"))
declare MRN_cd = f8 with protect, constant(uar_get_code_by("MEANING",319,"MRN")) ;002
declare fin_cd = f8 with protect, constant(uar_get_code_by("MEANING",319,"FIN NBR")) ;002
 
declare ord_status_cd = f8 with protect, constant(uar_get_code_by("MEANING",6004,"ORDERED"))
declare comp_status_cd = f8 with protect, constant(uar_get_code_by("MEANING",6004,"COMPLETED"))
declare INPROCESS_status_cd = f8 with protect, constant(uar_get_code_by("MEANING",6004,"INPROCESS"))
 
;declare del_status_cd = f8 with protect, constant(uar_get_code_by("MEANING",6004,"DELETED"))   ;002
 
declare inc_status_cd = f8 with protect, constant(uar_get_code_by("MEANING",6004,"INCOMPLETE"))
declare in_transit_cd = f8 with protect, constant(uar_get_code_by("MEANING",14281,"LABINTRANSIT"))
declare in_lab_cd = f8 with protect, constant(uar_get_code_by("MEANING",14281,"LABINLAB"))
declare complete_dept_status_cd = f8 with protect, constant(uar_get_code_by("MEANING",14281,"COMPLETED"))
declare INPROCESS_dept_status_cd = f8 with protect, constant(uar_get_code_by("MEANING",14281,"LABINPROCESS"))
declare lab_prelim_cd = f8 with protect, constant(uar_get_code_by("MEANING",14281,"LABPRELIM"))
declare lab_final_cd = f8 with protect, constant(uar_get_code_by("MEANING",14281,"LABFINAL"))
 
declare gen_lab_cd = f8 with protect, constant(uar_get_code_by("MEANING",106,"GLB"))
declare BB_ACTIVITY_cd = f8 with protect, constant(uar_get_code_by("MEANING",106,"BB"))
declare MICRO_ACTIVITY_cd = f8 with protect, constant(uar_get_code_by("MEANING",106,"MICROBIOLOGY"))
declare order_action_cd =  F8 with protect, constant(uar_get_code_by("MEANING",6003,"ORDER"))
declare batch_select = vc
if($batch_nbr > 0 )
   set batch_select = build( " col_list.collection_list_nbr =",  $batch_nbr)
else
   set batch_select =  " 1 = 1"
 
endif
 
free record rec
record rec
(1 qual[*]
   2  encntr_id = f8
   2  person_id = f8
   2  facility_name = vc
   2  patient_name = vc
   2  address = vc
   2  ADDRESS1 = VC
   2  ADDRESS2 = VC
   2  ADDRESS3 = VC
   2  CITY  = VC
   2  STATE = VC
   2  ZIP = VC
   2  dob = vc
   2  sex = vc
   2  encntr_type_cd = f8
   2  encntr_type = vc
   2  fin_class_cd = f8                     ;001
   2  fin_class = vc                        ;001
   2  mrn	= vc							;999
   2  fin	= vc
   2  health_plan_type = vc
   2  group_nbr = vc
   2  policy_nbr = vc
   2  group_name = vc
   2  health_plan_id = f8
   2  health_plan_name = vc 					;001
   2  plan_addr  = vc 						;001
   2  plan_addr2  = vc 						;001
   2  plan_addr3  = vc 						;001
   2  plan_addr4  = vc 						;001
   2  plan_CITY  = VC 						;001
   2  plan_STATE = VC 						;001
   2  plan_ZIP = VC 						;001
   2  plan_city_st_zip = vc                 ;001
 
;001
   2  sec_health_plan_type = vc
   2  sec_group_nbr = vc
   2  sec_policy_nbr = vc
   2  sec_group_name = vc
   2  sec_health_plan_id = f8
   2  sec_health_plan_name = vc                 ;001
   2  sec_plan_addr  = vc 						;001
   2  sec_plan_addr2  = vc 						;001
   2  sec_plan_addr3  = vc 						;001
   2  sec_plan_addr4  = vc 						;001
   2  sec_plan_CITY  = VC 						;001
   2  sec_plan_STATE = VC 						;001
   2  sec_plan_ZIP = VC							;001
   2  sec_plan_city_st_zip = vc                 ;001
 
;001
 
   2  orders[*]
      3  order_id = f8
      3  ord_phys_id = f8
      3  ord_phy_name = vc
      3  ord_phy_npi = vc
 
	  3  Test_name = vc
	  3  ICD9_code = vc
	  3  Diagnosis = vc
	  3  nomen_id = f8
	  3  transfer_list_id = f8
      3  collection_list_nbr = i4
      3  to_location_cd = f8  ;001
      3  to_lab_bench = vc    ;001
      3  from_location_cd = f8 ;001
      3  from_lab_bench = vc
      3  ACCN_LIST = VC
      3  accn[*]
	     4  Accession_nbr = vc
	     4  Service_date = vc ;002
 
 
)
 
set list_nbr_prnt_ind = 0
 
;declare fin_where = vc
;if ($fin_class = 99.99)
;   set fin_where = " 1 = 1"
;	set fin_where = build(" e.financial_class_cd > 0  ","")
;
;else
;	set fin_where = build(" e.financial_class_cd = " ,value($fin_class))
;endif
;
;declare enc_type_where = vc
;if ($enc_type = 99.99)
;   set enc_type_where = " 1 = 1"
;else
;	set enc_type_where = build(" e.encntr_type_cd = " ,value($enc_type))
;endif
 
;call echo (fin_where)
select if ($Format_ind = 1)
	plan oa2
		where oa2.action_dt_tm  between cnvtdatetime(cnvtdate($sdate),0)
	     						and  cnvtdatetime(cnvtdate($edate),235959)
		and oa2.dept_status_cd =  in_transit_cd  ;  653073.00
 
	join o where o.order_id = oa2.order_id
 
		and o.order_status_cd in (ord_status_cd,inc_status_cd,comp_status_cd,INPROCESS_status_cd)
		and o.dept_status_cd in (in_transit_cd,
								 in_lab_cd,
								 complete_dept_status_cd,
								 INPROCESS_dept_status_cd,
								 lab_prelim_cd,
								 lab_final_cd)
		and o.activity_type_cd IN ( gen_lab_cd, BB_ACTIVITY_cd,MICRO_ACTIVITY_cd );001
 
 
	join e where e.encntr_id = o.encntr_id
	; and e.loc_facility_cd = $fac_cd
	join enc_fac
		where enc_fac.code_value = e.loc_facility_cd
		and enc_fac.display_key = $fac_grp
	join enc_type
		where enc_type.code_value = e.encntr_type_cd
		and enc_type.display_key = $enc_type
	join fin_class
		where fin_class.code_value = e.financial_class_cd
		and fin_class.display_key = $fin_class
 
	join ea
		where ea.encntr_id=e.encntr_id
		and ea.encntr_alias_type_cd= fin_cd
		and ea.active_ind= 1
	    and ea.end_effective_dt_tm > sysdate
 
 
	join p where p.person_id = o.person_id
	;join opr
	;	where opr.organization_id = outerjoin(e.organization_id)
	;	and opr.alias_entity_name = outerjoin("PERSON_ALIAS")
 
 
	join oa
		where oa.order_id = o.order_id
		and oa.action_type_cd = order_action_cd ;       2534.00
	join phy
		where phy.person_id = oa.order_provider_id
	JOIN PA
		where pa.person_id = outerjoin(oa.order_provider_id)
		and pa.prsnl_alias_type_cd = outerjoin(npi_cd)
		and pa.active_ind = outerjoin(1)
		and pa.beg_effective_dt_tm < outerjoin(sysdate)
		and pa.end_effective_dt_tm > outerjoin(sysdate)
	 ;002 begin new table
	JOIN MRN
		where MRN.encntr_id = outerjoin(e.encntr_id)
		and MRN.encntr_alias_type_cd = outerjoin(mrn_cd)
		and MRN.active_ind = outerjoin(1)
		and MRN.beg_effective_dt_tm < outerjoin(sysdate)
		and MRN.end_effective_dt_tm > outerjoin(sysdate)
	;;;JOIN PAMRN
	;;;	where PAMRN.person_id = outerjoin(p.person_id)
	;;;	and PAMRN.person_alias_type_cd = outerjoin(mrn_cd)
	;;;;	and PAMRN.alias_pool_cd = outerjoin(opr.alias_pool_cd)
	;;;	and PAMRN.active_ind = outerjoin(1)
	;;;	and PAMRN.beg_effective_dt_tm < outerjoin(sysdate)
	;;;	and PAMRN.end_effective_dt_tm > outerjoin(sysdate)
	;002 end new table
	join aor
		where aor.order_id = o.order_id
	;002 begin new table
	join acc
	    where aor.accession_id = acc.accession_id
	;;;     and acc.updt_dt_tm between cnvtdatetime(cnvtdate($sdate),0)
	;;;     						and  cnvtdatetime(cnvtdate($edate),235959)
	;002 end new table
	join osrc where osrc.order_id = o.order_id
	   AND OSRC.CURRENT_LOCATION_CD  > 0 ;003  WAS CAUSING DUPLICATES
 
	join con
		where con.container_id = osrc.container_id
	JOIN CONE
		WHERE CONE.container_id = CON.container_id
		AND CONE.event_sequence = (SELECT MAX(CONE2.EVENT_SEQUENCE )
										FROM CONTAINER_EVENT CONE2
										WHERE CONE2.container_id = CONE.container_id
										AND CONE2.transfer_list_id > 0)
	join col_list
		where col_list.collection_list_id = outerjoin(conE.transfer_list_id)
		and col_list.to_location_cd   =  $to_lab
		and col_list.from_location_cd = $fr_lab
else
	plan col_list
	where col_list.collection_list_dt_tm between  cnvtdatetime(cnvtdate($sdate),0)
								and cnvtdatetime(cnvtdate($sdate),235959)
		and col_list.collection_list_nbr = $batch_nbr
		and col_list.list_type_flag = 2
	join cone
	where conE.transfer_list_id = col_list.collection_list_id
;		and cone.event_type_cd =         1798.00 ; 	In Transit
;	join col_list
;		where col_list.collection_list_id = outerjoin(conE.transfer_list_id)
		and col_list.collection_list_nbr = $batch_nbr
	join osrc
		where osrc.container_id = cone.container_id
	join con
		where con.container_id =  CONE.container_id
	join o
		where o.order_id = osrc.order_id
;		and o.order_status_cd in (ord_status_cd,inc_status_cd,comp_status_cd) ;,del_status_cd)
;		and o.dept_status_cd in (in_transit_cd,in_lab_cd,complete_dept_status_cd,lab_prelim_cd,lab_final_cd)
;		and o.activity_type_cd IN ( gen_lab_cd, BB_ACTIVITY_cd,MICRO_ACTIVITY_cd );001
	join aor
		where aor.order_id = o.order_id
	;002 begin new table
	join acc
	    where aor.accession_id = acc.accession_id
	join oa2
		where o.order_id = oa2.order_id
;		and oa2.action_dt_tm  between cnvtdatetime(cnvtdate($sdate),0)
;	     						and  cnvtdatetime(cnvtdate($edate),235959)
		and oa2.dept_status_cd =  in_transit_cd  ;  653073.00
	join e where e.encntr_id = o.encntr_id
	; and e.loc_facility_cd = $fac_cd
	join enc_fac
		where enc_fac.code_value = e.loc_facility_cd
		and enc_fac.display_key = $fac_grp
	join enc_type
		where enc_type.code_value = e.encntr_type_cd
		and enc_type.display_key = $enc_type
	join fin_class
		where fin_class.code_value = e.financial_class_cd
		and fin_class.display_key = $fin_class
 
	join ea
		where ea.encntr_id=e.encntr_id
		and ea.encntr_alias_type_cd= fin_cd
		and ea.active_ind= 1
	    and ea.end_effective_dt_tm > sysdate
 
 
	join p where p.person_id = o.person_id
	;join opr
	;	where opr.organization_id = outerjoin(e.organization_id)
	;	and opr.alias_entity_name = outerjoin("PERSON_ALIAS")
 
 
	join oa
		where oa.order_id = o.order_id
		and oa.action_type_cd = order_action_cd ;       2534.00
	join phy
		where phy.person_id = oa.order_provider_id
	JOIN PA
		where pa.person_id = outerjoin(oa.order_provider_id)
		and pa.prsnl_alias_type_cd = outerjoin(npi_cd)
		and pa.active_ind = outerjoin(1)
		and pa.beg_effective_dt_tm < outerjoin(sysdate)
		and pa.end_effective_dt_tm > outerjoin(sysdate)
	 ;002 begin new table
	JOIN MRN
		where MRN.encntr_id = outerjoin(e.encntr_id)
		and MRN.encntr_alias_type_cd = outerjoin(mrn_cd)
		and MRN.active_ind = outerjoin(1)
		and MRN.beg_effective_dt_tm < outerjoin(sysdate)
		and MRN.end_effective_dt_tm > outerjoin(sysdate)
 
endif
 
 
into "nl:";$outdev
o.order_id,
facility_name = uar_get_code_description(e.loc_facility_cd),
p.name_full_formatted,
date_of_birth = format(p.birth_dt_tm ,"mm/dd/yyyy ;;d"),
mrn = MRN.alias,  ;002
 
sex = uar_get_code_display(p.sex_cd),
accession_nbr = cnvtacc(aor.accession),
Service_date = format(acc.updt_dt_tm ,"mm/dd/yyyy hh:mm ;;d"), ;002
o.hna_order_mnemonic,
 
 
oa.*, osrc.* from
order_action oa2,
 
orders o,
encounter e,
code_value enc_fac,
code_value enc_type,
code_value fin_class,
person p,
order_action oa,
PRSNL_ALIAS PA,
;PERSON_ALIAS PAMRN, ;002
encntr_alias mrn,
person phy,
accession acc, ;002
accession_order_r aor,
order_serv_res_container osrc,
container con,
CONTAINER_EVENT CONE,
collection_list col_list
;,org_alias_pool_reltn opr
,encntr_alias ea
 
;, clinical_event ce
 
order by o.encntr_id,o.order_id,accession_nbr
head report
	e_cnt = 0
	SEP = FILLSTRING(3," ")
head o.encntr_id
    o_cnt = 0
    e_cnt = e_cnt + 1
	stat = alterlist(rec->qual,e_cnt)
	rec->qual[e_cnt].encntr_id = o.encntr_id
	rec->qual[e_cnt].person_id = o.person_id
	rec->qual[e_cnt].dob = date_of_birth
	rec->qual[e_cnt].facility_name = facility_name
	rec->qual[e_cnt].patient_name = p.name_full_formatted
	rec->qual[e_cnt].sex = sex
	rec->qual[e_cnt].mrn = mrn	 ;002
	rec->qual[e_cnt].FIN = EA.ALIAS
	rec->qual[e_cnt].encntr_type_cd = e.encntr_type_cd
	rec->qual[e_cnt].encntr_type = uar_get_code_display(e.encntr_type_cd)
	rec->qual[e_cnt].fin_class_cd = e.financial_class_cd						;001
	rec->qual[e_cnt].fin_class = uar_get_code_display(e.financial_class_cd)   	;001
	rec->qual[e_cnt].health_plan_id = 0
 
head o.order_id
	o_cnt = o_cnt + 1
	stat = alterlist(rec->qual[e_cnt].orders,o_cnt)
 
	rec->qual[e_cnt].orders[o_cnt].Test_name = o.hna_order_mnemonic
	rec->qual[e_cnt].orders[o_cnt].order_id = o.order_id
	rec->qual[e_cnt].orders[o_cnt].collection_list_nbr = col_list.collection_list_nbr
	rec->qual[e_cnt].orders[o_cnt].to_location_cd = col_list.to_location_cd  							;001
	rec->qual[e_cnt].orders[o_cnt].to_lab_bench = uar_get_code_display(col_list.to_location_cd) 		;001
	rec->qual[e_cnt].orders[o_cnt].from_location_cd = col_list.from_location_cd 						;001
	rec->qual[e_cnt].orders[o_cnt].from_lab_bench = uar_get_code_display(col_list.from_location_cd) 	;001
 
	rec->qual[e_cnt].orders[o_cnt].ord_phys_id = OA.order_provider_id
	rec->qual[e_cnt].orders[o_cnt].ord_phy_name = phy.name_full_formatted
	rec->qual[e_cnt].orders[o_cnt].ord_phy_npi = cnvtalias(pa.alias,pa.alias_pool_cd)
	a_cnt = 0
	SEP = ""
;detail
head accession_nbr
    rec->qual[e_cnt].orders[o_cnt].ACCN_LIST = CONCAT(TRIM(rec->qual[e_cnt].orders[o_cnt].ACCN_LIST) , SEP,
    										ACCESSION_NBR)
    										SEP = ", "
	a_cnt = a_cnt + 1
	stat = alterlist(rec->qual[e_cnt].orders[o_cnt].accn,a_cnt)
 
	rec->qual[e_cnt].orders[o_cnt].accn[a_cnt].Accession_nbr = accession_nbr
	rec->qual[e_cnt].orders[o_cnt].accn[a_cnt].Service_date = Service_date ;002
 
 
with nocounter
 
	select into "nl:"
	from (dummyt d with seq = size(rec->qual,5)),
 
		address a
	plan d
	join A
		where a.parent_entity_id = rec->qual[d.seq].person_id
		AND A.parent_entity_name = "PERSON"
		and a.address_type_cd = home_cd
		and a.active_ind = 1
	detail
		rec->qual[d.seq].address = a.street_addr
		rec->qual[d.seq].address1 = a.street_addr2
		rec->qual[d.seq].address2 = a.street_addr3
		rec->qual[d.seq].address3 = a.street_addr4
		if (a.city_cd = 0)
			rec->qual[d.seq].CITY = a.city
		else
			rec->qual[d.seq].CITY = uar_get_code_display(a.city_cd)
		endif
		if (a.state_cd = 0)
			rec->qual[d.seq].STATE =a.state
		else
			rec->qual[d.seq].STATE = uar_get_code_display(a.state_cd)
		endif
		rec->qual[d.seq].ZIP = a.zipcode
 
 	with nocounter
 
;;	select into "nl:"
;;	from (dummyt d with seq = size(rec->qual,5)),
;;
;;		encntr_plan_reltn epr,
;;		health_plan hp
;;;		code_value cv
;;	plan d
;;	join epr
;;		where epr.encntr_id = rec->qual[d.seq].encntr_id
;;		and epr.active_ind >= 1
;;        and epr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
;;        and epr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
;;
;;	join hp
;;		where hp.health_plan_id = epr.health_plan_id
;;;pel replace join to code_value with sub selects
;;;;	JOIN cv
;;;;	    where cv.code_value = hp.plan_type_cd
;;;;	    and cv.display_key in ('GOVERNMENTAGENCIES',
;;;;								'HTMEDICAIDGLX',
;;;;								'MEDICAID',
;;;;								'MEDICAIDIA',
;;;;								'MEDICAIDMN',
;;;;								'MEDICAIDMEDICARE',
;;;;								'MEDICALASSISTANCE',
;;;;								'MEDICAREAREG',
;;;;								'MEDICAREADVANTAGE',
;;;;								'MEDICAREPARTB',
;;;;								'MEDICAREWITHGOVERNMENTASSECONDARY',
;;;;								'PREPAIDMATHRUMEDICARE',
;;;;								'SECUREHORIZONSMEDICARE',
;;;;								'UNICAREMEDICARELUMENOSCHHPACEMENT',
;;;;								'VETSAFFAIRSPLANS',
;;;;								'MEDICARE')
;;		and (hp.plan_type_cd in (select cv.code_value
;;		                        from code_value cv
;;
;;
;;			    where cv.code_value = hp.plan_type_cd
;;			    and cv.display_key in ('GOVERNMENTAGENCIES',
;;								'HTMEDICAIDGLX',
;;								'MEDICAID',
;;								'MEDICAIDIA',
;;								'MEDICAIDMN',
;;								'MEDICAIDMEDICARE',
;;								'MEDICALASSISTANCE',
;;								'MEDICAREAREG',
;;								'MEDICAREADVANTAGE',
;;								'MEDICAREPARTB',
;;								'MEDICAREWITHGOVERNMENTASSECONDARY',
;;								'PREPAIDMATHRUMEDICARE',
;;								'SECUREHORIZONSMEDICARE',
;;								'UNICAREMEDICARELUMENOSCHHPACEMENT',
;;								'VETSAFFAIRSPLANS',
;;								'MEDICARE'))
;;					OR hp.plan_name_key = "WISCONSINWELLWOMANPROGRAM"
;;				    or hp.financial_class_cd in
;;				    		(select cv.code_value
;;		                        from code_value cv
;;								where cv.code_value = hp.financial_class_cd
;;	   							 and cv.display_key in ('MINNESOTACARE',
;;	   							        'SOUTHCOUNTRYHEALTHUCAREMMSIMAPROG',
;;                                        'UNICAREMEDICARELUMENOSCHHPACEMENT')
;;				             )
;;				)
;;    detail
;;    	rec->qual[d.seq].health_plan_type = uar_get_code_display(hp.plan_type_cd)
;;    	rec->qual[d.seq].group_nbr = epr.group_nbr
;;    	rec->qual[d.seq].group_name = epr.group_name
;;    	rec->qual[d.seq].policy_nbr = epr.subs_member_nbr
;;    	rec->qual[d.seq].health_plan_id = hp.health_plan_id
;;with nocounter
 
	select into "nl:"
	from (dummyt d with seq = size(rec->qual,5)),
 
		encntr_plan_reltn epr,
		health_plan hp
	plan d
	join epr
		where epr.encntr_id = rec->qual[d.seq].encntr_id
		and epr.active_ind >= 1
        and epr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
        and epr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
		and epr.priority_seq in (1,2)  ; Primary or secondary insurance
 
	join hp
		where hp.health_plan_id = epr.health_plan_id
 
 
    detail
    if (epr.priority_seq = 1)
    	rec->qual[d.seq].health_plan_type = uar_get_code_display(hp.plan_type_cd)
    	rec->qual[d.seq].group_nbr = epr.group_nbr
    	rec->qual[d.seq].group_name = epr.group_name
    	rec->qual[d.seq].policy_nbr = epr.subs_member_nbr
    	rec->qual[d.seq].health_plan_id = hp.health_plan_id
    	rec->qual[d.seq].health_plan_name = hp.plan_name
 
    else
    	rec->qual[d.seq].sec_health_plan_type = uar_get_code_display(hp.plan_type_cd)
    	rec->qual[d.seq].sec_group_nbr = epr.group_nbr
    	rec->qual[d.seq].sec_group_name = epr.group_name
    	rec->qual[d.seq].sec_policy_nbr = epr.subs_member_nbr
    	rec->qual[d.seq].sec_health_plan_id = hp.health_plan_id
    	rec->qual[d.seq].sec_health_plan_name = hp.plan_name                        ;001
 
    endif
with nocounter
 
	select into "nl:"
	from (dummyt d with seq = size(rec->qual,5)),
 
		address a
	plan d
	join A
		where a.parent_entity_id = rec->qual[d.seq].health_plan_id
		AND A.parent_entity_name = "HEALTH_PLAN"
		and a.address_type_cd = Bus_addr_cd
		and a.active_ind = 1
 
	detail
			rec->qual[d.seq].plan_addr = a.street_addr
			rec->qual[d.seq].plan_addr2 = a.street_addr2
			rec->qual[d.seq].plan_addr3 = a.street_addr3
			rec->qual[d.seq].plan_addr4 = a.street_addr4
 
 
       temp_addr = ""
		if (a.city_cd = 0)
			rec->qual[d.seq].plan_city = a.city
		else
			rec->qual[d.seq].plan_city = uar_get_code_display(a.city_cd)
		endif
		if (a.state_cd = 0)
			rec->qual[d.seq].plan_state = a.state
		else
			rec->qual[d.seq].plan_state = uar_get_code_display(a.state_cd)
		endif
		rec->qual[d.seq].plan_zip = a.zipcode
        rec->qual[d.seq].plan_city_st_zip = concat(rec->qual [d.seq].plan_CITY,",  ",
                                                    rec->qual [d.seq].plan_STATE,"  ",
                                                    rec->qual [d.seq].plan_ZIP)
 
 	with nocounter
 
 	select into "nl:"
	from (dummyt d with seq = size(rec->qual,5)),
 
		address a
	plan d
	join A
		where a.parent_entity_id = rec->qual[d.seq].sec_health_plan_id
		AND A.parent_entity_name = "HEALTH_PLAN"
		and a.address_type_cd = Bus_addr_cd
		and a.active_ind = 1
	detail
			rec->qual[d.seq].sec_plan_addr = a.street_addr
			rec->qual[d.seq].sec_plan_addr2 = a.street_addr2
			rec->qual[d.seq].sec_plan_addr3 = a.street_addr3
			rec->qual[d.seq].sec_plan_addr4 = a.street_addr4
 
 
		if (a.city_cd = 0)
			rec->qual[d.seq].sec_plan_city = a.city
		else
			rec->qual[d.seq].sec_plan_city = uar_get_code_display(a.city_cd)
		endif
		if (a.state_cd = 0)
			rec->qual[d.seq].sec_plan_state = a.state
		else
			rec->qual[d.seq].sec_plan_state = uar_get_code_display(a.state_cd)
		endif
		rec->qual[d.seq].sec_plan_zip = a.zipcode
        rec->qual[d.seq].sec_plan_city_st_zip = concat(rec->qual [d.seq].sec_plan_CITY,",  ",
                                                    rec->qual [d.seq].sec_plan_STATE,"  ",
                                                    rec->qual [d.seq].sec_plan_ZIP)
 
 	with nocounter
 
 CALL ECHORECORD(REC)
 
 
; ICD9 info
	select into "nl:"
	from (dummyt d with seq = size(rec->qual,5)),
		(dummyt d1 with seq = 1),
 		order_detail od,
	 	nomenclature n
 	plan d
 		where maxrec(d1,size(rec->qual[d.seq].orders,5))
	join d1
 	join od
 		where od.order_id = rec->qual[d.seq].orders[d1.seq].order_id
 		and od.oe_field_meaning = "ICD9"
 	join n where n.nomenclature_id = od.oe_field_value
	detail
		rec->qual[d.seq].orders[d1.seq].ICD9_code = n.source_identifier
		rec->qual[d.seq].orders[d1.seq].Diagnosis = n.source_string
				rec->qual[d.seq].orders[d1.seq].nomen_id = n.nomenclature_id
	with nocounter
 
 
/*
select into $outdev
	facility = substring(1,50,rec->qual[d.seq].facility_name)
,	patient_name = substring(1,30,rec->qual[d.seq].patient_name)
,	dob = TRIM(rec->qual[d.seq].dob,3)
,	sex = substring(1,15,rec->qual[d.seq].sex)
,	Accession_nbr = substring(1,22,rec->qual[d.seq].orders[d1.seq].accn[d2.seq].Accession_nbr)
,	Test_name = substring(1,30,rec->qual[d.seq].orders[d1.seq].Test_name)
,   collection_list_nbr = rec->qual[d.seq].orders[d1.seq].collection_list_nbr
,	order_id = rec->qual[d.seq].orders[d1.seq].order_id
,   nomen_id = rec->qual[d.seq].orders[d1.seq].nomen_id
,	ICD9 = substring(1,18,rec->qual[d.seq].orders[d1.seq].ICD9_code)
,	diagnosis = substring(1,30,rec->qual[d.seq].orders[d1.seq].Diagnosis)
,	health_plan_type = substring(1,30,rec->qual[d.seq].health_plan_type)
,	group_nbr = substring(1,15,rec->qual[d.seq].group_nbr)
,	group_name = substring(1,30,rec->qual[d.seq].group_name)
,   health_plan_id = rec->qual[d.seq].health_plan_id
;fld1 = rec->qual[d.seq]
;fld1 = rec->qual[d.seq]
;fld1 = rec->qual[d.seq]
 
from (dummyt d with seq = size(rec->qual,5))
	,(dummyt d1 with seq = 1)
	,(dummyt d2 with seq = 1)
plan d  where maxrec(d1,size(rec->qual[d.seq].orders,5))
join d1 where maxrec(d2,size(rec->qual[d.seq].orders[d1.seq].accn,5))
join d2
order by facility,collection_list_nbr, patient_name,Test_name
 
head report
  first_fac = 1
head facility
  if (first_fac = 1)
      first_fac =0
  else
      break
  endif
 col 0 Facility
 row +1
head  collection_list_nbr
 COLL_NBR_STR = TRIM(CNVTSTRING(COLLECTION_LIST_NBR),3)
 col 0 "Transfer List#:",
 col +1 COLL_NBR_STR
 row +2
 first_patient_on_list = 1
head patient_name
  if ( first_patient_on_list = 1 )
     first_patient_on_list = 0
  else
    col 0 "------------------------------------------------------------------",
    row + 3
  endif
city_state_zip = FILLSTRING(50," ")
 city_state_zip = concat(trim(rec->qual[D.SEQ].CITY,3), ", ",
 						trim(rec->qual[D.SEQ].STATE,3), " ",
 						trim(rec->qual[D.SEQ].ZIP,3))
 col 0 Patient_name
 row +1
 col 0, rec->qual[D.SEQ].address,
 row +1
 if (rec->qual[D.SEQ].ADDRESS1 > " ")
    col 0, rec->qual[D.SEQ].ADDRESS1
    row + 1
 endif
  if (rec->qual[D.SEQ].ADDRESS2 > " ")
    col 0, rec->qual[D.SEQ].ADDRESS2
    row + 1
 endif
  if (rec->qual[D.SEQ].ADDRESS3 > " ")
    col 0, rec->qual[D.SEQ].ADDRESS3
    row + 1
 endif
 COL 0, city_state_zip,
 ROW +1
 col 0 sex,
 row +1
 col 0 dob
 row + 1
 col 0 "Health Care Plan:"
 col + 1 health_plan_type
 row +1
 col 0  "Referring Physician:"
 col + 1 rec->qual[D.SEQ].orders[D1.SEQ].ord_phy_name
 row + 1
 col 0 "NPI:"
 col + 1 rec->qual[D.SEQ].orders[D1.SEQ].ord_phy_npi
 Row + 2
 
head test_name
;ROW+1 rec->qual[D.SEQ].orders[D1.SEQ].order_id
 row + 1
 col 0 "Accession Number:"
 col + 1 rec->qual[D.SEQ].orders[D1.SEQ].ACCN_LIST
 row + 1
 col 0 "Order:"
 col + 1 test_name
 row + 1
 col 0 "ICD9 Code:"
 col + 1 rec->qual[D.SEQ].orders[D1.SEQ].ICD9_code
 row + 1
 col 0 "Diagnosis:"
 col + 1 rec->qual[D.SEQ].orders[D1.SEQ].Diagnosis
 row + 1
 
;Foot
 
with nocounter,
format,
separator = "  "
*/
CALL ECHORECORD(REC)
 
Execute reportrtl
%i mhs_prg:mayo_lab_in_transit.dvl
set _SendTo=$outdev
call LayoutQuery(0)
end
go
