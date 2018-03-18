;declare record structure for all segments
free record upload
record upload(
  1 msh_line = vc
  1 enc_cnt = i4
  1 enc[*]
  	2 encntr_id = f8
  	2 person_id = f8
  	2 load_exception_ind = i2
  	2 patient_load_ind = i2
  	2 contrib_system_cd =f8
  	2 contrib_source_cd =f8
  	2 msh_line = vc
  	2 pid_line = vc
  	2 pv1_line = vc
  	2 pv2_line = vc
  	2 zpi_line = vc
  	2 allergy_cnt = i2
  	2 allergy[*]
  	  3 allergy_id = f8
  	  3 substance_type_cd = f8
  	  3 nomenclature_id = f8
  	  3 substance_desc = vc
  	  3 source_identifier = vc
  	  3 source_string = vc
  	  3 source_vocabulary_cd = f8
  	  3 severity_cd = f8
  	  3 onset_dt_tm = dq8
  	  3 reaction_class_cd = f8
  	  3 reaction_status_cd = f8
  	  3 source_of_info_cd = f8
  	  3 reactions[*]
  	    4 source_vocabulary_cd = f8
  	    4 source_identifier = vc
  	  	4 source_string = vc
  	    4 reaction_desc = vc
  	  3 comments[*]
  	  	4 text = vc
  	  	4 nte_line = vc
  	  3 source_of_info_ft = vc
  	  3 cancel_prsnl_id = f8
  	  3 reviewed_dt_tm = dq8
  	  3 reviewed_prsnl_id = f8
  	  3 verified_status_flag = i2
  	  3 al1_line = vc
  	  3 zal_line = vc
 
  	2 procedure_cnt = i2
  	2 procedure[*]
  	  3 procedure_id = f8
  	  3 source_vocabulary_cd = f8
  	  3 procedure_disp = vc
  	  3 procedure_dt_tm = vc
  	  3 proc_func_type = f8
  	  3 anes = f8
  	  3 anes_cd = f8
  	  3 surgeon = f8
  	  3 caregiver = f8
  	  3 proc_priority = vc
  	  3 pr1_line = vc
 
  	2 problem_cnt = i2
  	2 problem[*]
  	  3 problem_id = f8
  	  3 course_cd = f8
  	  3 beg_effective_dt_tm = vc
  	  3 problem_disp = vc
  	  3 source_vocabulary_cd = f8
  	  3 estimated_resolution_dt_tm = vc
  	  3 actual_resolution_dt_tm = vc
  	  3 classification_cd = f8
  	  3 management_discipline_cd = f8
  	  3 persistence_cd = f8
  	  3 confirmation_status_cd = f8
  	  3 life_cycle_status_cd = f8
  	  3 life_cycle_dt_tm = vc
  	  3 onset_dt_tm = vc
  	  3 ranking_cd = f8
  	  3 certainty_cd = f8
  	  3 probability = vc
  	  3 person_aware_cd = f8
  	  3 prognosis_cd = f8
  	  3 person_aware_prognosis_cd = f8
  	  3 family_aware_cd = f8
  	  3 prb_line = vc
  	  3 var_line = vc
  	  3 qualifier_cd = f8
  	  3 annotated_display = vc
  	  3 severity_cd = f8
  	  3 severity_class_cd = f8
      3 nte_found = c1
      3 comments[*]
  	    4 nte_line = vc
  	  3 prsnl[*]
  	    4 prsnl_id = f8
  	    4 problem_reltn_cd = f8
  	    4 beg_effective_dt_tm = vc
  	    4 end_effective_dt_tm = vc
  	    4 rol_line = vc
 	  3 ft_disp = vc ;MV
 
  	2 event_ord_list[*]
  	  3 event_list[*]
  	    4 event_id =f8
  	  3 order_id =f8
  	  3 no_results_ind = i2
  	  3 event_id =f8
  	  3 msh_line = vc ;MV added
  	  3 pv1_line = vc ;lh added for perform location for pharm med
  	  3 orc_line = vc
  	  3 orc_line2 = vc ;MV added to support multiple orc groups in pharm med
  	  3 multi_orc_ind = i2 ;MV added to support multiple orc groups in pharm med
  	  3 obr_line = vc
  	  3 obx_line = vc
  	  3 rxe_line = vc ;MV
  	  3 rxe_line2 = vc ;MV added
  	  3 rxo_line = vc
  	  3 rxa_line = vc
  	  3 rxr_line = vc
  	  3 rxc_line = vc
  	  3 nte_line = vc
  	  3 comments[*]
  	    4 nte_line = vc
 
  	  3 action_sequence    = i4
  	  3 complete_upon_order_ind    = i4 ;lh added to not send 2nd action for orders if catalog automatically completes order
	  3 order_alias   = vc
 	  3 order_status_cd       = f8
 	  3 dcreason			  = vc
 	  3 dc_dt_tm			  = dq8
	  3 dept_status_cd        = f8
	  3 med_order_type_cd     = f8
	  3 ordered_as_mnemonic   = vc
	  3 prn_ind               = i2
	  3 current_start_dt_tm   = dq8
 	  3 projected_stop_dt_tm  = dq8
	  3 order_mnemonic        = vc
	  3 hna_order_mnemonic    = vc
	  3 orig_ord_as_flag      = i2
	  3 action_type_cd     = f8
	  3 eso_action_cd     = f8
	  3 action_personnel_id     = f8
	  3 action_personnel_str     = vc
	  3 effective_dt_tm     = dq8
	  3 order_dt_tm     = dq8
	  3 order_locn_cd     = f8
	  3 order_provider_id     = f8
	  3 order_provider_str     = vc
	  3 order_status_cd     = f8
 
  	2 event_id = f8
  	2 TXA_line = vc
  	2 OBX_line = vc
)
 
free record alias_rec
record alias_rec(
  1 alias[*]
	2 alias = vc
	2 alias_type_cd = f8
	2 alias_pool_cd = f8
	2 alias_sub_type_cd =f8
)
 
 
 declare strAlias = vc with public, noconstant("")
 
 
declare No_results_ind = i2
;;declare GetAlias(  dCodeValue, dContSource) = vc
declare Get_Alias(  dCode, dSource) = vc
declare Get_Alias2(  dCode, dSource) = vc
declare Get_Outbound_Alias(  dCode, dSource) = vc
declare TrimZeros(  dNumber) = vc
declare GetPrsnl(  dPrsnlId, dPrsnlType, dContSource) = vc
declare GetOrderAlias(  dOrderId, dAliasType, dContSource) = vc
declare v_current_name = f8 with public, constant(uar_get_code_by("MEANING",213,"CURRENT"))
 
;;subroutine GetAlias( dCodeValue, dContSource)
;;	call echo(build("code value = ",dCodeValue))
;;	call echo(build("cont source = ",dContSource))
;;	set strAlias = " "
;;	if(dCodeValue > 0)
;;		select into "nl:" cvo.alias from code_value_outbound cvo where cvo.contributor_source_cd = dContSource and
;;			cvo.code_value=dCodeValue
;;		detail
;;			strAlias =cvo.alias
;;		with nocounter
;;		if(trim(strAlias)="")
;;			set strAlias = concat("CD:",cnvtstring(dCodeValue))
;;		endif
;;	else
;;		set strAlias = concat("CD:",cnvtstring(dCodeValue))
;;	endif
;;	call echo (build("alias = ", strAlias))
;;	return(strAlias)
;;end
 
 
subroutine GetPrsnl( dPrsnlId, dPrsnlType, dContSource)
;;;	call echo(build("dPrsnlId = ",dPrsnlId))
;;;	call echo(build("dPrsnlType = ",dPrsnlType))
;;;	call echo(build("cont source = ",dContSource))
	set strAlias = " "
 
	select into "nl:" p.alias
	from prsnl_alias p
	where p.person_id= dPrsnlId and p.person_id> 0
	;if(dPrsnlType > 0)
	;	and p.alias_type_cd = dPrsnlType
	;endif
	and p.active_ind =1
	and (p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
	and (p.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
	or p.end_effective_dt_tm = NULL))
	head report
		idx = 0
	detail
		idx = idx +1
		stat = alterlist(alias_rec->alias,idx)
		alias_rec->alias[idx]->alias = trim(p.alias,3)
		alias_rec->alias[idx]->alias_type_cd = p.prsnl_alias_type_cd
		alias_rec->alias[idx]->alias_pool_cd = p.alias_pool_cd
 
	with nocounter
	for(x=1 to size(alias_rec->alias,5))
		if(x>1)
			set strAlias = concat(strAlias,"~")
		endif
		set strAlias = concat(strAlias,alias_rec->alias[x]->alias,"^^^^^^^^",
			GetAlias(alias_rec->alias[x]->alias_pool_cd,dContSource),"^^^^",
			GetAlias(alias_rec->alias[x]->alias_type_cd,dContSource))
	endfor
	set stat = alterlist(alias_rec->alias,0)
;;;	call echo (build("alias = ", strAlias))
	return(strAlias)
end
 
; New version of get_prsnl
declare prsnl_strAlias = vc
declare prsnl_strAlias_hold = vc
if(validate(prsnl_alias_hold,"999")="999")
set trace = recpersist
free record prsnl_alias
record prsnl_alias(
	1 alias_cnt						= i4
	1 alias_found   				= i2
	1 contrib_source_cd 			= f8
	1 prsnl_id	 					= f8
	1 alias[*]
		2 alias						= vc
		2 alias_type_cd				= f8
		2 alias_pool_cd 			= f8
		2 alias_sub_type_cd			= f8
 
	)
free record prsnl_alias_error
record prsnl_alias_error(
	1 qual[*]
		2 prsnl_id	 				= f8
		2 contrib_source_cd 		= f8
		2 alias						= vc
		2 alias_found   			= i2
	)
 
free record prsnl_alias_hold
record prsnl_alias_hold(
	1 alias_cnt						= i4
	1 qual[*]
		2 prsnl_id					= f8
		2 alias 					= vc
		2 contrib_source_cd 		= f8
		2 name_last_key				= vc
		2 name_first_key			= vc
		2 name_middle_key			= vc
		2 name_suffix				= vc
		2 name_prefix				= vc
		2 name_degree				= vc
		2 name_type_cd				= f8
		2 name_type					= vc
 
 
)
; declare strAlias = vc with public, noconstant("")
 
set trace = norecpersist
endif
 
subroutine Get_Prsnl( dPrsnlId, dPrsnlType, dContSource)
	set prsnl_strAlias = " "
 	set prsnl_alias->contrib_source_cd = dContSource
 	set prsnl_alias->prsnl_id = dPrsnlId
 	set PRSNL_ALIAS->alias_cnt = 0
 	set prsnl_alias->alias_found = 0
 
	if (dPrsnlId > 0)
		if (prsnl_alias_hold->alias_cnt > 0)
			set num = 0
			SET POS = LOCATEVAL(NUM, 1, prsnl_alias_hold->alias_cnt,
					dPrsnlId, prsnl_alias_hold->qual[num]->prsnl_id,
					dContSource, prsnl_alias_hold->qual[num]->contrib_source_cd)
 
			IF (POS > 0)
				set prsnl_strAlias = prsnl_alias_hold->qual[pos]->alias
 
				set prsnl_alias->alias_found = 1
			endif
		endif
		if ( prsnl_alias->alias_found = 0)
					set prsnl_alias_hold->alias_cnt  = prsnl_alias_hold->alias_cnt + 1
					set stat = alterlist(prsnl_alias_hold->qual, prsnl_alias_hold->alias_cnt)
					set prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->prsnl_id 	= dPrsnlId
;					set prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->prsnl_type = prsln_alias->alias_type_cd
					set prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->contrib_source_cd 	= dContSource ;MAValias->contrib_source_cd
					set stat = alterlist(prsnl_alias->alias,0)
					set PRSNL_ALIAS->alias_cnt = 0
 
 
					select into "nl:" pa.alias
					from
						prsnl_alias@compare_link pa,
						person p,
						person_name pn
					plan p
						where p.person_Id = dPrsnlId
					join pn
						where pn.person_id = outerjoin(p.person_id)
						and pn.active_ind = outerjoin(1)
						and pn.name_type_cd = outerjoin(v_current_name)
					join pa
						where pa.person_id= outerjoin(p.person_id)
 						and pa.prsnl_alias_type_cd in(1084,1085,1086,1088)
 						and pa.alias_pool_cd >0
					;if(dPrsnlType > 0)
					;	and pa.alias_type_cd = dPrsnlType
					;endif
						and pa.active_ind = outerjoin(1)
						and (pa.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
						and (pa.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))))
					order by pa.prsnl_alias_type_cd desc
					head report
						idx2 = 0
						prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_last_key = p.name_last_key
						prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_first_key = p.name_first_key
						prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_middle_key = p.name_middle_key
						prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_suffix = pn.name_suffix
						prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_prefix = pn.name_prefix
						prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_degree = pn.name_degree
						prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_type_cd = pn.name_type_cd
 						temp_idx2=0
					detail
						idx2 = idx2 +1
						stat = alterlist(prsnl_alias->alias,idx2)
						prsnl_alias->alias[idx2]->alias = trim(pa.alias,3)
						prsnl_alias->alias[idx2]->alias_type_cd = pa.prsnl_alias_type_cd
						prsnl_alias->alias[idx2]->alias_pool_cd = pa.alias_pool_cd
						prsnl_alias->alias_cnt = idx2
						if(pa.prsnl_alias_type_cd = 1086)
							temp_idx2=idx2
						endif
					foot report
						if(temp_idx2>0)
							prsnl_alias->alias[1]->alias = prsnl_alias->alias[temp_idx2]->alias
							prsnl_alias->alias[1]->alias_type_cd = prsnl_alias->alias[temp_idx2]->alias_type_cd
							prsnl_alias->alias[1]->alias_pool_cd = prsnl_alias->alias[temp_idx2]->alias_pool_cd
							prsnl_alias->alias_cnt = 1
							stat = alterlist(prsnl_alias->alias,1)
						endif
					with nocounter
					if(curqual = 0)
						select into "nl:" pa.alias
						from
							prsnl_alias@compare_link pa,
							person@compare_link  p2,
							person p,
							person_name pn
						plan p
							where p.person_Id = dPrsnlId
						join pn
							where pn.person_id = outerjoin(p.person_id)
							and pn.active_ind = outerjoin(1)
							and pn.name_type_cd = outerjoin(v_current_name)
						join p2
							where p2.name_full_formatted = outerjoin(p.name_full_formatted)
							and p2.active_ind = outerjoin(1)
							;and p2.name_type_cd = outerjoin(v_current_name)
						join pa
							where pa.person_id= outerjoin(p2.person_id)
	 						and pa.prsnl_alias_type_cd in(1084,1085,1086,1088)
	 						and pa.alias_pool_cd >0
						;if(dPrsnlType > 0)
						;	and pa.alias_type_cd = dPrsnlType
						;endif
							and pa.active_ind = outerjoin(1)
							and (pa.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
							and (pa.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))))
						order by pa.prsnl_alias_type_cd desc
						head report
							idx2 = 0
							prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_last_key = p.name_last_key
							prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_first_key = p.name_first_key
							prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_middle_key = p.name_middle_key
							prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_suffix = pn.name_suffix
							prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_prefix = pn.name_prefix
							prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_degree = pn.name_degree
							prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_type_cd = pn.name_type_cd
	 						temp_idx2=0
						detail
							idx2 = idx2 +1
							stat = alterlist(prsnl_alias->alias,idx2)
							prsnl_alias->alias[idx2]->alias = trim(pa.alias,3)
							prsnl_alias->alias[idx2]->alias_type_cd = pa.prsnl_alias_type_cd
							prsnl_alias->alias[idx2]->alias_pool_cd = pa.alias_pool_cd
							prsnl_alias->alias_cnt = idx2
 
							if(pa.prsnl_alias_type_cd = 1086)
								temp_idx2=idx2
							endif
						foot report
							if(temp_idx2>0)
								prsnl_alias->alias[1]->alias = prsnl_alias->alias[temp_idx2]->alias
								prsnl_alias->alias[1]->alias_type_cd = prsnl_alias->alias[temp_idx2]->alias_type_cd
								prsnl_alias->alias[1]->alias_pool_cd = prsnl_alias->alias[temp_idx2]->alias_pool_cd
								prsnl_alias->alias_cnt = 1
								stat = alterlist(prsnl_alias->alias,1)
							endif
						with nocounter
					endif
					if(curqual = 0)
						declare name_full1=vc with public,noconstant("")
						declare name_full2=vc with public,noconstant("")
						select into "nl:" pa.alias,name_full2=p2.name_full_formatted,name_full1=p.name_full_formatted
						from
							prsnl_alias@compare_link pa,
							person@compare_link  p2,
							person p,
							person_name pn
						plan p
							where p.person_Id = dPrsnlId
						join pn
							where pn.person_id = outerjoin(p.person_id)
							and pn.active_ind = outerjoin(1)
							and pn.name_type_cd = outerjoin(v_current_name)
						join p2
							;where cnvtalphanum(name_full2) = outerjoin(cnvtalphanum(p.name_full_formatted))
							where cnvtalphanum(name_full2) = cnvtalphanum(name_full1) and trim(name_full2) > " "
							and p2.name_phonetic = p.name_phonetic
							and p2.active_ind = 1
							;and p2.name_type_cd = outerjoin(v_current_name)
						join pa
							where pa.person_id= outerjoin(p2.person_id)
	 						and pa.prsnl_alias_type_cd in(1084,1085,1086,1088)
	 						and pa.alias_pool_cd >0
						;if(dPrsnlType > 0)
						;	and pa.alias_type_cd = dPrsnlType
						;endif
							and pa.active_ind = outerjoin(1)
							and (pa.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
							and (pa.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))))
						order by pa.prsnl_alias_type_cd desc
						head report
							idx2 = 0
							prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_last_key = p.name_last_key
							prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_first_key = p.name_first_key
							prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_middle_key = p.name_middle_key
							prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_suffix = pn.name_suffix
							prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_prefix = pn.name_prefix
							prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_degree = pn.name_degree
							prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_type_cd = pn.name_type_cd
	 						temp_idx2=0
						detail
							idx2 = idx2 +1
							stat = alterlist(prsnl_alias->alias,idx2)
							prsnl_alias->alias[idx2]->alias = trim(pa.alias,3)
							prsnl_alias->alias[idx2]->alias_type_cd = pa.prsnl_alias_type_cd
							prsnl_alias->alias[idx2]->alias_pool_cd = pa.alias_pool_cd
							prsnl_alias->alias_cnt = idx2
 
							if(pa.prsnl_alias_type_cd = 1086)
						/*call echo(build("p.name_last_key = ",p.name_last_key))
						call echo(build("p2.name_last_key = ",p2.name_last_key))
						call echo(build("p.name_first_key = ",p.name_first_key))
						call echo(build("p2.name_first_key = ",p2.name_first_key))
						call echo(build("p.name_full_formatted = ",p.name_full_formatted))
						call echo(build("p2.name_full_formatted = ",p2.name_full_formatted))*/
 
								temp_idx2=idx2
							endif
						foot report
						call echo(build("name_full1 = ",name_full1))
						call echo(build("name_full2 = ",name_full2))
						call echo(build("alias = ",prsnl_alias->alias[temp_idx2]->alias))
						call echo(build("idx2 = ",idx2))
						call echo(build("idx2 = ",idx2))
						call echo(build("temp_idx2 = ",temp_idx2))
							if(temp_idx2>0)dPrsnlId
						call echo(build("dPrsnlId = ",dPrsnlId))
						call echo(build("alias = ",prsnl_alias->alias[temp_idx2]->alias))
								prsnl_alias->alias[1]->alias = prsnl_alias->alias[temp_idx2]->alias
								prsnl_alias->alias[1]->alias_type_cd = prsnl_alias->alias[temp_idx2]->alias_type_cd
								prsnl_alias->alias[1]->alias_pool_cd = prsnl_alias->alias[temp_idx2]->alias_pool_cd
								prsnl_alias->alias_cnt = 1
								stat = alterlist(prsnl_alias->alias,1)
							endif
						with nocounter
					endif
					if(curqual = 0)
						select into "nl:" pa.alias
						from
							prsnl_alias pa,
							person p,
							person_name pn
						plan p
							where p.person_Id = dPrsnlId
						join pn
							where pn.person_id = outerjoin(p.person_id)
							and pn.active_ind = outerjoin(1)
							and pn.name_type_cd = outerjoin(v_current_name)
						join pa
							where pa.person_id= outerjoin(p.person_id)
	 						and pa.prsnl_alias_type_cd in(1084,1085,1086,1088)
	 						and pa.alias_pool_cd >0
						;if(dPrsnlType > 0)
						;	and pa.alias_type_cd = dPrsnlType
						;endif
							and pa.active_ind = outerjoin(1)
							and (pa.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
							and (pa.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))))
						order by pa.prsnl_alias_type_cd desc
						head report
							idx2 = 0
							prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_last_key = p.name_last_key
							prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_first_key = p.name_first_key
							prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_middle_key = p.name_middle_key
							prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_suffix = pn.name_suffix
							prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_prefix = pn.name_prefix
							prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_degree = pn.name_degree
							prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_type_cd = pn.name_type_cd
	 						temp_idx2=0
						detail
							idx2 = idx2 +1
							stat = alterlist(prsnl_alias->alias,idx2)
							prsnl_alias->alias[idx2]->alias = trim(pa.alias,3)
							prsnl_alias->alias[idx2]->alias_type_cd = pa.prsnl_alias_type_cd
							prsnl_alias->alias[idx2]->alias_pool_cd = pa.alias_pool_cd
							prsnl_alias->alias_cnt = idx2
 
							if(pa.prsnl_alias_type_cd = 1086)
								temp_idx2=idx2
							endif
						foot report
							if(temp_idx2>0)
								prsnl_alias->alias[1]->alias = prsnl_alias->alias[temp_idx2]->alias
								prsnl_alias->alias[1]->alias_type_cd = prsnl_alias->alias[temp_idx2]->alias_type_cd
								prsnl_alias->alias[1]->alias_pool_cd = prsnl_alias->alias[temp_idx2]->alias_pool_cd
								prsnl_alias->alias_cnt = 1
								stat = alterlist(prsnl_alias->alias,1)
							endif
						with nocounter
					endif
 
 					set prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_type = get_alias(
 														prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_type_cd,
 														dContSource)
;  call echo (build("calling for loop from 1 to",prsnl_alias->alias_cnt))
					for(alias_cnt=1 to prsnl_alias->alias_cnt)
						if(prsnl_alias->alias[alias_cnt]->alias!="")
;							call echo("prsnl_alias->alias[alias_cnt]->alias!=....................................................")
							set prsnl_strAlias = concat(prsnl_alias->alias[alias_cnt]->alias,"^",
								trim(prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_last_key,3),"^",
								trim(prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_first_key,3),"^",
								trim(prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_middle_key,3),"^",
								trim(prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_suffix,3),"^",
								trim(prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_prefix,3),"^",
								trim(prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_degree,3),"^^",
								Get_Alias(prsnl_alias->alias[alias_cnt]->alias_pool_cd,dContSource))
								set alias_cnt=prsnl_alias->alias_cnt ;break loop as we have 1 alias
						else ;if no alias there still may be a prsnl name
;							call echo("prsnl_alias->alias[alias_cnt]->alias= NULL....................................................")
 
							set prsnl_strAlias_hold = concat(prsnl_alias->alias[alias_cnt]->alias,"^",
								trim(prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_last_key,3),"^",
								trim(prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_first_key,3),"^",
								trim(prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_middle_key,3),"^",
								trim(prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_suffix,3),"^",
								trim(prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_prefix,3),"^",
								trim(prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_degree,3),"^^",
								Get_Alias(prsnl_alias->alias[alias_cnt]->alias_pool_cd,dContSource))
						endif
 
						/*if(alias_cnt>1)
							set prsnl_strAlias = concat(prsnl_strAlias,"~")
						endif
						set prsnl_strAlias = concat(prsnl_strAlias,prsnl_alias->alias[alias_cnt]->alias,"^",
								trim(prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_last_key,3),"^",
								trim(prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_first_key,3),"^",
								trim(prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_middle_key,3),"^",
								trim(prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_suffix,3),"^",
								trim(prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_prefix,3),"^",
								trim(prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_degree,3),"^",
								;trim(prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->name_type,3),
								"^",
							Get_Alias(prsnl_alias->alias[alias_cnt]->alias_pool_cd,dContSource))
							;,"^^^^",
							;Get_Alias(prsnl_alias->alias[alias_cnt]->alias_type_cd,dContSource))*/
					endfor
					if(prsnl_strAlias="")
						set prsnl_strAlias = prsnl_strAlias_hold
					endif
					set prsnl_alias_hold->qual[prsnl_alias_hold->alias_cnt]->alias 	= prsnl_strAlias
 
 
				endif
				if ( prsnl_alias->alias_found = 0)
	 ; add to the error structure
 
 
 
 
					set prsnl_err_cnt = size(prsnl_alias_error->qual,5) + 1
					set stat = alterlist(prsnl_alias_error->qual,prsnl_err_cnt)
					set prsnl_alias_error->qual[prsnl_err_cnt]->prsnl_id = dPrsnlId
					set prsnl_alias_error->qual[prsnl_err_cnt]->contrib_source_cd = dContSource
 
				endif
;			set strAlias = alias->alias
;			set code_value_alias->qual[code_value_alias->cva_cnt]->alias 				= alias->alias
 
 
	endif
 
 
	return(prsnl_strAlias)
end
 
 
subroutine get_prsnl_alias_errors(cnt)
set prsnl_cnt = size(prsnl_alias_error->qual,5)
if (prsnl_cnt > 0)
	select into "nl:"
		missing_contrib_source_cd = prsnl_alias_error->qual[d.seq]->contrib_source_cd,
		missing_prsnl_id = prsnl_alias_error->qual[d.seq]->prsnl_id
	from
		(dummyt d with seq = prsnl_cnt)
	plan d
 
	order missing_contrib_source_cd, missing_prsnl_id
	head report
		call echo("N O   A L I A S E S   F O U N D !!!!!!!")
		CALL ECHO ("CONTRIB_SOURCE_CD,PRSNL_ID")
	head missing_contrib_source_cd
	 row + 0
	head missing_prsnl_id
	  call echo(build(missing_contrib_source_cd ,",",missing_prsnl_id))
 
	with nocounter
endif
	set cnt = prsnl_cnt
return (cnt)
end
 
 
 
 
subroutine GetOrderAlias( dOrderId, dAliasType, dContSource)
;;;	call echo(build("dOrderId = ",dOrderId))
;;;	call echo(build("dAliasType = ",dAliasType))
;;;	call echo(build("cont source = ",dContSource))
	set strAlias = " "
 
	select into "nl:" o.alias
	from order_alias o
	where o.order_id= dOrderId and o.order_id > 0
	head report
		idx = 0
	detail
		idx = idx +1
		stat = alterlist(alias_rec->alias,idx)
		alias_rec->alias[idx]->alias = trim(o.alias,3)
		alias_rec->alias[idx]->alias_type_cd = o.order_alias_type_cd
		alias_rec->alias[idx]->alias_pool_cd = o.alias_pool_cd
 
	with nocounter
	if(size(alias_rec->alias,5) > 0)
		for(x=1 to size(alias_rec->alias,5))
			if(x>1)
				set strAlias = concat(strAlias,"~")
			endif
			set strAlias = concat(strAlias,alias_rec->alias[x]->alias,"^^^^^^^^",
				GetAlias(alias_rec->alias[x]->alias_pool_cd,dContSource),"^^^^",
				GetAlias(alias_rec->alias[x]->alias_type_cd,dContSource))
		endfor
	else
		set strAlias = concat(build(dOrderId),"^ORDER_ALIAS")
	endif
 
	set stat = alterlist(alias_rec->alias,0)
;	call echo (build("order_alias = ", strAlias))
	return(strAlias)
end
 
 
subroutine TrimZeros( dNumber )
        free set t_initial
        free set t_length
        free set t_decimal
        free set t_last_sig
        free set t_final
        free set t_i
 
        set t_initial = build( dNumber )
        set t_length = size( t_initial )
        set t_decimal = findstring( "." , t_initial , 1 )
        set t_final = trim( t_initial, 3 )
 
        if ( t_decimal > 0 )
                set t_last_sig = t_decimal - 1
                set t_i = 0
                for ( t_i = t_decimal + 1 to t_length )
                        if ( substring( t_i , 1 , t_initial ) > "0" )
                                set t_last_sig = t_i
                        endif
                endfor
                set t_final = trim( substring( 1 , t_last_sig , t_initial ), 3 )
        endif
        free set t_initial
        free set t_length
        free set t_decimal
        free set t_last_sig
        free set t_i
        return( t_final )
 
end
 
 
  declare OutBufMaxSiz                 = i2
  declare TBlobIn                      = c32000
  declare TBlobOut                     = c32000
  declare BlobIn                       = c32000
  declare BlobOut                      = c32000
 
subroutine DECOMPRESS_TEXT(TBlobIn)
    set TBlobOut                       = fillstring(32000, " ")
    set BlobOut                        = fillstring(32000, " ")
    set OutBufMaxSiz                   = 0
 
    set BlobIn = trim(TBlobIn)
    call uar_ocf_uncompress(BlobIn,size(BlobIn),BlobOut,size(BlobOut),OutBufMaxSiz)
    set TBlobOut = BlobOut
 
    set TBlobIn                        = fillstring(32000, " ")
    set BlobIn                         = fillstring(32000, " ")
 
end ;subroutine DECOMPRESS_TEXT
 
subroutine DECOMPRESS_TEXT2(TBlobIn, dCompressionCd)
 
	if( uar_get_code_meaning(dCompressionCd) = "NOCOMP")
		set TBlobOut = replace(TBlobIn,"ocf_blob","",0)
	else
		call DECOMPRESS_TEXT(TBlobIn)
	endif
 
end
 
declare pos = i4 with public,noconstant(0)
declare num = i4 with public,noconstant(0)
declare ae_cnt = i4 with public,noconstant(0)
set ae_cnt = 0
 
free record alias
record alias(
	1 code_value 				= f8
	1 contrib_system_cd 		= f8
	1 contrib_source_cd 		= f8
	1 alias						= vc
	1 alias_found   			= i2
	)
free record alias_error
record alias_error(
	1 qual[*]
		2 code_value 				= f8
		2 contrib_system_cd 		= f8
		2 contrib_source_cd 		= f8
		2 alias						= vc
		2 alias_found   			= i2
	)
 
 
 
if(validate(code_value_alias,"999")="999")
set trace = recpersist
free record code_value_alias
record code_value_alias(
	1 cva_cnt						= i4
	1 qual[*]
		2 code_value 				= f8
		2 contrib_system_cd 		= f8
		2 contrib_source_cd 		= f8
		2 alias						= vc
		2 alias_found   			= i2
	)
 
set trace = norecpersist
endif
 
 
subroutine get_alias(dCode,dSource) ;,strAlias)
;CALL ECHO ("START GET_ALIAS ...................................................................................")
	if (dcode = 0)
		set strAlias = " "
	else
;		set alias->code_value = 0.0
;		set alias->contrib_source_cd = 0.0
		set alias->alias = ""
		set alias->code_value = dcode
		set alias->contrib_source_cd = dSource
 
		set alias->alias_found = 0
		set num  = 0
 
;CALL ECHO ("IN GET_ALIAS ...................................................................................")
		if (code_value_alias->cva_cnt > 0)
			SET POS = LOCATEVAL(NUM, 1, code_value_alias->cva_cnt,
					alias->code_value, code_value_alias->qual[num]->code_value,
					alias->contrib_source_cd, code_value_alias->qual[num]->contrib_source_cd)
 
		endif
 
		IF (POS > 0)
;CALL ECHO ("POS > 0  ...................................................................................")
 
			set strAlias = code_value_alias->qual[pos]->alias
			set alias->alias = code_value_alias->qual[pos]->alias
 
			set alias->alias_found = 1
		else
;CALL ECHO ("POS = 0  ...................................................................................")
			if ( alias->alias_found = 0)
;			CALL ECHO ("alias->alias_found = 0  ...................................................................................")
				set code_value_alias->cva_cnt  = code_value_alias->cva_cnt + 1
				set stat = alterlist(code_value_alias->qual, code_value_alias->cva_cnt)
				set code_value_alias->qual[code_value_alias->cva_cnt]->code_value 			= alias->code_value
				set code_value_alias->qual[code_value_alias->cva_cnt]->contrib_source_cd 	= alias->contrib_source_cd
 
 
				select
				 into "nl:"
				 cv.alias
				from code_value_alias cv
				where cv.code_value = alias->code_value
				and cv.contributor_source_cd = alias->contrib_source_cd
 				order by cv.updt_dt_tm desc
				detail
				  alias->alias = cv.alias
				 with nocounter;,maxrec=1
 
 
				 if (curqual = 0)
 
					set alias->alias = build("CD:",alias->code_value)
				 	set alias->alias_found = 0
				 else
				 	set alias->alias_found = 1
				 endif
			endif
;	CALL ECHO ("CHECK TO SEE IF ALIAS WAS FOUND")
			if (alias->alias_found = 0) ; add to the error structure
; CALL ECHO("NOT FOUND - ADD TO ERROR STRUCTURE")
				set ae_cnt = size(alias_error->qual,5) + 1
				set stat = alterlist(alias_error->qual,ae_cnt)
				set alias_error->qual[ae_cnt]->code_value = alias->code_value
				set alias_error->qual[ae_cnt]->contrib_source_cd = alias->contrib_source_cd
 
			endif
			set strAlias = alias->alias
			set code_value_alias->qual[code_value_alias->cva_cnt]->alias 				= alias->alias
 		endif
	endif
;CALL ECHO ("At end of subrouting  return(strAlias)")
	return(strAlias)
end
 
 
 subroutine get_outbound_alias(dCode,dSource) ;,strAlias)
 
	if (dcode = 0)
		set strAlias = " "
	else
;		set alias->code_value = 0.0
;		set alias->contrib_source_cd = 0.0
		set alias->alias = ""
		set alias->code_value = dcode
		set alias->contrib_source_cd = dSource
 
		set alias->alias_found = 0
		set num  = 0
 
		if (code_value_alias->cva_cnt > 0)
			SET POS = LOCATEVAL(NUM, 1, code_value_alias->cva_cnt,
					alias->code_value, code_value_alias->qual[num]->code_value,
					alias->contrib_source_cd, code_value_alias->qual[num]->contrib_source_cd)
 
		endif
 
		IF (POS > 0)
			set strAlias = code_value_alias->qual[pos]->alias
			set alias->alias = code_value_alias->qual[pos]->alias
 
			set alias->alias_found = 1
		else
			if ( alias->alias_found = 0)
				set code_value_alias->cva_cnt  = code_value_alias->cva_cnt + 1
				set stat = alterlist(code_value_alias->qual, code_value_alias->cva_cnt)
				set code_value_alias->qual[code_value_alias->cva_cnt]->code_value 			= alias->code_value
				set code_value_alias->qual[code_value_alias->cva_cnt]->contrib_source_cd 	= alias->contrib_source_cd
 
 
				select
				 into "nl:"
				 cv.alias
				from code_value_outbound cv
				where cv.code_value = alias->code_value
				and cv.contributor_source_cd = alias->contrib_source_cd
 
				detail
				  alias->alias = cv.alias
				 with nocounter
 
 
				 if (curqual = 0)
 
					set alias->alias = build("CD:",alias->code_value)
				 	set alias->alias_found = 0
				 else
				 	set alias->alias_found = 1
				 endif
			endif
			if (alias->alias_found = 0) ; add to the error structure
 
				set ae_cnt = size(alias_error->qual,5) + 1
				set stat = alterlist(alias_error->qual,ae_cnt)
				set alias_error->qual[ae_cnt]->code_value = alias->code_value
				set alias_error->qual[ae_cnt]->contrib_source_cd = alias->contrib_source_cd
 
			endif
			set strAlias = alias->alias
			set code_value_alias->qual[code_value_alias->cva_cnt]->alias 				= alias->alias
 		endif
	endif
 
	return(strAlias)
end
/*subroutine get_alias(dCode,dSource) ;,strAlias)
 
	if (dcode = 0)
		set strAlias = ""
	else
;		set alias->code_value = 0.0
;		set alias->contrib_source_cd = 0.0
		set alias->alias = ""
		set alias->code_value = dcode
		set alias->contrib_source_cd = dSource
 
		set alias->alias_found = 0
		set num  = 0
 
		if (code_value_alias->cva_cnt > 0)
			SET POS = LOCATEVAL(NUM, 1, code_value_alias->cva_cnt,
					alias->code_value, code_value_alias->qual[num]->code_value,
					alias->contrib_source_cd, code_value_alias->qual[num]->contrib_source_cd)
 
			IF (POS > 0)
				set strAlias = code_value_alias->qual[pos]->alias
				set alias->alias = code_value_alias->qual[pos]->alias
 
				set alias->alias_found = 1
			endif
		endif
 
		if ( alias->alias_found = 0)
			set code_value_alias->cva_cnt  = code_value_alias->cva_cnt + 1
			set stat = alterlist(code_value_alias->qual, code_value_alias->cva_cnt)
			set code_value_alias->qual[code_value_alias->cva_cnt]->code_value 			= alias->code_value
			set code_value_alias->qual[code_value_alias->cva_cnt]->contrib_source_cd 	= alias->contrib_source_cd
 
 
			select
			 into "nl:"
			 cv.alias
			from code_value_alias cv
			where cv.code_value = alias->code_value
			and cv.contributor_source_cd = alias->contrib_source_cd
 
			detail
			  alias->alias = cv.alias
			 with nocounter
 
 
			 if (curqual = 0)
 
				set alias->alias = build("CD:",alias->code_value)
					call echo ("in curqal = 0")
			 	set alias->alias_found = 0
			 else
					call echo ("in curqal = 1")
			 	set alias->alias_found = 1
			 endif
		endif
		if (alias->alias_found = 0) ; add to the error structure
					call echo ("in alias_error  ")
 
			set ae_cnt = size(alias_error->qual,5) + 1
			set stat = alterlist(alias_error->qual,ae_cnt)
			set alias_error->qual[ae_cnt]->code_value = alias->code_value
			set alias_error->qual[ae_cnt]->contrib_source_cd = alias->contrib_source_cd
 
		endif
		set strAlias = alias->alias
		set code_value_alias->qual[code_value_alias->cva_cnt]->alias 				= alias->alias
 
	endif
					call echorecord(alias)
					call echo (build("alias->alias = ",alias->alias))
					call echo (build("strAlias = ",strAlias))
					call echo (build("pos = ",pos))
	return(strAlias)
end
*/
 
subroutine get_alias_errors(cnt)
if (ae_cnt > 0)
	select into "nl:"
		missing_contrib_source_cd = alias_error->qual[d.seq]->contrib_source_cd,
		c.code_set,
		missing_code_value = alias_error->qual[d.seq]->code_value,
		c.display
	from
		(dummyt d with seq = ae_cnt)
		,code_value c
	plan d
 	Join c
 		where c.code_value = alias_error->qual[d.seq]->code_value
 
	order missing_contrib_source_cd,c.code_set, missing_code_value
	head report
		call echo("N O   A L I A S E S   F O U N D !!!!!!!")
		CALL ECHO ("CONTRIB_SOURCE_CD,CODE_SET,CODE_VALUE,DISPLAY")
	head missing_contrib_source_cd
	 row + 0
	head missing_code_value
	  call echo(build(missing_contrib_source_cd ,",",c.code_set,",",missing_code_value,",",C.DISPLAY))
 
 
 
	with nocounter
endif
	set cnt = ae_cnt
return (cnt)
end
 
 
 
subroutine Write_alias_errors(cnt)
if (ae_cnt > 0)
	select into "mayo_upload_missing_alias"
		missing_contrib_source_cd = cnvtstring(alias_error->qual[d.seq]->contrib_source_cd),
		code_set = cnvtstring(c.code_set),
		missing_code_value = cnvtstring(alias_error->qual[d.seq]->code_value),
		c.display
	from
		(dummyt d with seq = ae_cnt)
		,code_value c
	plan d
 	Join c
 		where c.code_value = alias_error->qual[d.seq]->code_value
 
	order missing_contrib_source_cd,code_set, missing_code_value
;	head report
;		call echo("N O   A L I A S E S   F O U N D !!!!!!!")
;		CALL ECHO ("CONTRIB_SOURCE_CD,CODE_SET,CODE_VALUE,DISPLAY")
;	head missing_contrib_source_cd
;	 row + 0
;	head missing_code_value
	detail
	  col 0 missing_contrib_source_cd ,
	  col +1 ",",
	  col +1 code_set,
	  col +1 ",",
	  col +1 missing_code_value,
	  col +1 ",",
	  col +1 C.DISPLAY
	  row + 1
;
 
 
	with nocounter, append
endif
	set cnt = ae_cnt
return (cnt)
end
 
 
 
	declare  text_blob   = vc ;= c32000;
	declare  start = i4
	declare  cr_pos = i4
	declare  crlf = vc
	declare  stop = i4
	declare line_num = i4
 
	free record temp
	record temp(
	1 line[*]
		2 text	= vc
	)
 
subroutine load_blob_to_text(text_blob)
 
 
 
	set start = 0
	set cr_pos = 0
	set line_num = 0
;	set crlf = concat(char(13),char(10))
	set crlf = concat(char(10))
 
	set stop = size(text_blob)
     while (start < stop)
		set cr_pos = findstring(crlf,text_blob,start,0)
		if (cr_pos > 0)
			set line_num = line_num + 1
		    set stat = alterlist(temp->line,line_num)
		    if(line_num=1)
		    	set temp->line[line_num]->text = substring(start,cr_pos - start ,text_blob)
		   	 	set temp->line[line_num]->text = replace(temp->line[line_num]->text,crlf,"",0)
		    else
		    	set temp->line[line_num]->text = substring(start,cr_pos - start ,text_blob)
		    endif
		    set start = cr_pos + 1
		elseif(start < stop)
			set line_num = line_num + 1
		    set stat = alterlist(temp->line,line_num)
		    set temp->line[line_num]->text = substring(start,stop,text_blob)
		    set start = stop
		endif
		;call echo(build("start/stop :",start,"/",stop))
	endwhile
;	set text_blob = fillstring(32000, " ")
end ; subroutine load_blob_to_text

