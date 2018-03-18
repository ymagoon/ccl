drop program mayo_lab_in_transit:dba go
create program mayo_lab_in_transit:dba
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Facility" = ""
 
with OUTDEV, fac_cd
 
declare home_cd = f8 with protect, constant(uar_get_code_by("MEANING",212,"HOME"))
declare NPI_cd = f8 with protect, constant(uar_get_code_by("MEANING",320,"NPI"))
 
declare ord_status_cd = f8 with protect, constant(uar_get_code_by("MEANING",6004,"ORDERED"))
 
declare del_status_cd = f8 with protect, constant(uar_get_code_by("MEANING",6004,"DELETED"))
 
declare inc_status_cd = f8 with protect, constant(uar_get_code_by("MEANING",6004,"INCOMPLETE"))
declare in_transit_cd = f8 with protect, constant(uar_get_code_by("MEANING",14281,"LABINTRANSIT"))
declare gen_lab_cd = f8 with protect, constant(uar_get_code_by("MEANING",106,"GLB"))
declare order_action_cd =  F8 with protect, constant(uar_get_code_by("MEANING",6003,"ORDER"))
 
 
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
   2  health_plan_type = vc
   2  group_nbr = vc
   2  policy_nbr = vc
   2  group_name = vc
   2  health_plan_id = f8
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
      3  ACCN_LIST = VC
      3  accn[*]
	     4  Accession_nbr = vc
 
 
)
 
set list_nbr_prnt_ind = 0
 
select into "nl:";$outdev
o.order_id,
facility_name = uar_get_code_description(e.loc_facility_cd),
p.name_full_formatted,
date_of_birth = format(p.birth_dt_tm ,"mm/dd/yyyy ;;d"),
 
sex = uar_get_code_display(p.sex_cd),
accession_nbr = cnvtacc(aor.accession),
o.hna_order_mnemonic,
 
 
oa.*, osrc.* from
orders o,
encounter e,
person p,
order_action oa,
PRSNL_ALIAS PA,
person phy,
accession_order_r aor,
order_serv_res_container osrc,
container con,
collection_list col_list
;, clinical_event ce
plan o where o.order_status_cd in (ord_status_cd,inc_status_cd,del_status_cd) and
;(2547,2544,2550) and
 o.dept_status_cd =  in_transit_cd  ;  653073.00
and o.activity_type_cd = gen_lab_cd; 692;gl
join e where e.encntr_id = o.encntr_id
 and e.loc_facility_cd = $fac_cd
join p where p.person_id = o.person_id
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
join aor
	where aor.order_id = o.order_id
join osrc where osrc.order_id = o.order_id
join con
	where con.container_id = osrc.container_id
join col_list
	where col_list.collection_list_id = con.transfer_list_id
order by o.encntr_id,o.order_id
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
	rec->qual[e_cnt].encntr_type_cd = e.encntr_type_cd
	rec->qual[e_cnt].encntr_type = uar_get_code_display(e.encntr_type_cd)
	rec->qual[e_cnt].health_plan_id = 0
 
head o.order_id
	o_cnt = o_cnt + 1
	stat = alterlist(rec->qual[e_cnt].orders,o_cnt)
 
	rec->qual[e_cnt].orders[o_cnt].Test_name = o.hna_order_mnemonic
	rec->qual[e_cnt].orders[o_cnt].order_id = o.order_id
	rec->qual[e_cnt].orders[o_cnt].collection_list_nbr = col_list.collection_list_nbr
	rec->qual[e_cnt].orders[o_cnt].ord_phys_id = OA.order_provider_id
	rec->qual[e_cnt].orders[o_cnt].ord_phy_name = phy.name_full_formatted
	rec->qual[e_cnt].orders[o_cnt].ord_phy_npi = cnvtalias(pa.alias,pa.alias_pool_cd)
	a_cnt = 0
	SEP = ""
detail
    rec->qual[e_cnt].orders[o_cnt].ACCN_LIST = CONCAT(TRIM(rec->qual[e_cnt].orders[o_cnt].ACCN_LIST) , SEP,
    										ACCESSION_NBR)
    										SEP = ", "
	a_cnt = a_cnt + 1
	stat = alterlist(rec->qual[e_cnt].orders[o_cnt].accn,a_cnt)
 
	rec->qual[e_cnt].orders[o_cnt].accn[a_cnt].Accession_nbr = accession_nbr
 
 
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
 
	select into "nl:"
	from (dummyt d with seq = size(rec->qual,5)),
 
		encntr_plan_reltn epr,
		health_plan hp,
		code_value cv
	plan d
	join epr
		where epr.encntr_id = rec->qual[d.seq].encntr_id
		and epr.active_ind >= 1
        and epr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
        and epr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
	join hp
		where hp.health_plan_id = epr.health_plan_id
	JOIN cv
	    where cv.code_value = hp.plan_type_cd
	    and cv.display_key in ('GOVERNMENTAGENCIES',
								'HTMEDICAIDGLX',
								'MEDICAID',
								'MEDICAIDIA',
								'MEDICAIDMN',
								'MEDICAIDMEDICARE',
								'MEDICALASSISTANCE',
								'MEDICAREAREG',
								'MEDICAREADVANTAGE',
								'MEDICAREPARTB',
								'MEDICAREWITHGOVERNMENTASSECONDARY',
								'PREPAIDMATHRUMEDICARE',
								'SECUREHORIZONSMEDICARE',
								'UNICAREMEDICARELUMENOSCHHPACEMENT',
								'VETSAFFAIRSPLANS',
								'MEDICARE')
    detail
    	rec->qual[d.seq].health_plan_type = uar_get_code_display(hp.plan_type_cd)
    	rec->qual[d.seq].group_nbr = epr.group_nbr
    	rec->qual[d.seq].group_name = epr.group_name
    	rec->qual[d.seq].policy_nbr = epr.subs_member_nbr
    	rec->qual[d.seq].health_plan_id = hp.health_plan_id
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
%i /mayo/mhcrt/prg/mayo_lab_in_transit.dvl
set _SendTo=$outdev
call LayoutQuery(0)
end
go
