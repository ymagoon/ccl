;OUTDEV, Format_ind, fac_grp, fr_lab, to_lab_facility_group, to_lab,
;	fin_class, enc_type, sdate, edate, batch_nbr
;mayo_lab_in_transit "mine",2,"MA",0,0,0,"*","*",01062015,158 go

select
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
,dummyt d1
,dummyt d2
,dummyt d3
,dummyt d4
,dummyt d5


	plan col_list
	where col_list.collection_list_dt_tm between  cnvtdatetime(cnvtdate(01062015),0)
								and cnvtdatetime(cnvtdate(01062015),235959)
		and col_list.collection_list_nbr = 158
		and col_list.list_type_flag = 2
	join cone
	where conE.transfer_list_id = col_list.collection_list_id
;		and cone.event_type_cd =         1798.00 ; 	In Transit
;	join col_list
;		where col_list.collection_list_id = outerjoin(conE.transfer_list_id)
		and col_list.collection_list_nbr =158
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
join d5
	join oa2
		where o.order_id = oa2.order_id
;		and oa2.action_dt_tm  between cnvtdatetime(cnvtdate($sdate),0)
;	     						and  cnvtdatetime(cnvtdate($edate),235959)
		and oa2.dept_status_cd =  653073.00
	join e where e.encntr_id = o.encntr_id
	; and e.loc_facility_cd = $fac_cd
join d1
	join enc_fac
		where enc_fac.code_value = e.loc_facility_cd
;		and enc_fac.display_key = $fac_grp
	join enc_type
		where enc_type.code_value = e.encntr_type_cd
;		and enc_type.display_key = $enc_type
join d2
	join fin_class
		where fin_class.code_value = e.financial_class_cd
;		and fin_class.display_key = $fin_class
 
	join ea
		where ea.encntr_id=e.encntr_id
		and ea.encntr_alias_type_cd= 1077
		and ea.active_ind= 1
	    and ea.end_effective_dt_tm > sysdate
 
join d3
 
	join p where p.person_id = o.person_id
	;join opr
	;	where opr.organization_id = outerjoin(e.organization_id)
	;	and opr.alias_entity_name = outerjoin("PERSON_ALIAS")
 
 
	join oa
		where oa.order_id = o.order_id
		and oa.action_type_cd =      2534.00
join d4

	join phy
		where phy.person_id = oa.order_provider_id
	JOIN PA
		where pa.person_id = outerjoin(oa.order_provider_id)
;		and pa.prsnl_alias_type_cd = outerjoin(npi_cd)
		and pa.active_ind = outerjoin(1)
		and pa.beg_effective_dt_tm < outerjoin(sysdate)
		and pa.end_effective_dt_tm > outerjoin(sysdate)
	 ;002 begin new table
	JOIN MRN
		where MRN.encntr_id = outerjoin(e.encntr_id)
		and MRN.encntr_alias_type_cd = outerjoin(1079)
		and MRN.active_ind = outerjoin(1)
		and MRN.beg_effective_dt_tm < outerjoin(sysdate)
		and MRN.end_effective_dt_tm > outerjoin(sysdate)
		
		go
