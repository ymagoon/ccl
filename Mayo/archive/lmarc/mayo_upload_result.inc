free set result_rec
record result_rec
(
 
  1 person_id                    = f8
  1 encounter_id                 = f8
  1 obr_count                    = i4
  1 obr[*]
    2 order_id                   = f8
    2 order_status_cd            = f8
    2 order_status_alias            = vc
    2 catalog_cd                 = f8
    2 catalog_alias            = vc
    2 order_mnemonic             = vc
    2 ordered_as_mnemonic             = vc
    2 catalog_type_cd            = f8
    2 catalog_type_alias            = vc
    2 activity_type_cd           = f8
    2 activity_type_alias            = vc
    2 activity_type_cd_mean      = vc
    2 oe_format_id               = f8
    2 orig_order_dt_tm           = dq8
    2 template_order_flag        = i2
    2 template_order_id          = f8
    2 order_comment_ind          = i2
    2 orig_ord_as_flag        = i2
    2 cs_flag                    = i2
    2 cs_order_id                = f8
    2 dept_status_cd             = f8
    2 dept_status_alias            = vc
    2 current_start_dt_tm        = dq8
    2 projected_stop_dt_tm        = dq8
    2 effective_dt_tm            = dq8
    2 accession                  = c20
    2 accession_id               = f8
    2 synonym_id                 = f8
    2 med_order_type_cd                 = f8
    2 med_order_type_alias            = vc
    2 order_alias_count          = i4
    2 order_alias[*]
      3 alias                    = vc
      3 alias_pool_cd            = f8
      3 alias_pool_alias            = vc
      3 order_alias_type_cd      = f8
      3 order_alias_type_alias            = vc
      3 order_alias_sub_type_cd  = f8
      3 contributor_system_cd    = f8
      3 check_digit              = i4
      3 check_digit_method_cd    = f8
    2 cs_order_alias[*]
      3 alias                    = vc
      3 alias_pool_cd            = f8
      3 alias_pool_alias            = vc
      3 order_alias_type_cd      = f8
      3 alias_pool_type_alias            = vc
      3 order_alias_sub_type_cd  = f8
      3 contributor_system_cd    = f8
      3 check_digit              = i4
      3 check_digit_method_cd    = f8
    2 action_dt_tm               = dq8
    2 action_type_cd             = f8
    2 action_type_alias            = vc
    2 action_personnel_id        = f8
    2 action_personnel2_id        = f8 ;MV Added to support two action personnels
    2 action_personnel_str            = vc
    2 action_personnel2_str            = vc ;MV added
    2 action_personnel_count     = i4
    2 action_personnel[*]
      3 alias                    = vc
      3 alias_type_cd            = f8
      3 alias_pool_type_alias            = vc
      3 alias_subtype_cd         = f8
      3 alias_pool_cd            = f8
      3 alias_pool_alias            = vc
      3 check_digit              = i4
      3 check_digit_method_cd    = f8
      3 contributor_system_cd    = f8
      3 name_last                = vc
      3 name_first               = vc
      3 name_middle              = vc
      3 name_suffix              = vc
      3 name_prefix              = vc
      3 name_degree              = vc
      3 name_type_cd             = f8
      3 name_type_alias            = vc
    2 active_status_prsnl_id        = f8
    2 active_status_prsnl_str            = vc
    2 action_sequence            = i4
    2 communication_type_cd              = f8
    2 communication_type_alias            = vc
    2 order_locn_cd              = f8
    2 order_locn_alias            = vc
    2 order_provider_id          = f8
    2 order_provider_str            = vc
    2 order_provider_count       = i4
    2 order_provider[*]
      3 alias                    = vc
      3 alias_type_cd            = f8
      3 alias_pool_type_alias            = vc
      3 alias_subtype_cd         = f8
      3 alias_pool_cd            = f8
      3 alias_pool_alias            = vc
      3 check_digit              = i4
      3 check_digit_method_cd    = f8
      3 contributor_system_cd    = f8
      3 name_last                = vc
      3 name_first               = vc
      3 name_middle              = vc
      3 name_suffix              = vc
      3 name_prefix              = vc
      3 name_degree              = vc
      3 name_type_cd             = f8
    2 order_dt_tm                = dq8
 
    2 parent_order[*]
      3 catalog_cd               = f8
      3 catalog_alias            = vc
      3 order_id                 = f8
      3 order_mnemonic           = vc
      3 current_start_dt_tm      = dq8
      3 order_status_cd          = f8
      3 order_status_alias            = vc
 
    2 sg_parent_order
      3 catalog_cd               = f8
      3 order_id                 = f8
      3 order_mnemonic           = vc
      3 order_alias[*]
         4 alias                    = vc
         4 alias_pool_cd            = f8
         4 order_alias_type_cd      = f8
         4 order_alias_sub_type_cd  = f8
         4 contributor_system_cd    = f8
         4 check_digit              = i4
         4 check_digit_method_cd    = f8
 
    2 result_status_cd              = f8
    2 result_status_alias            = vc
 
 
    2 order_detail
      3 sched_dt_tm              = dq8
      3 consultdoc_id            = f8
      3 consultdoc_str            = vc
      3 report_prior_cd          = f8
      3 report_prior_alias            = vc
      3 referphys_id             = f8
      3 referphys_str            = vc
      3 sched_dt_tm              = dq8
      3 specrec_dt_tm            = dq8
      3 specrecby_id             = f8
      3 specrecby_str            = vc
      3 specimen_desc            = vc
      3 collby_id                = f8
      3 collby_str            = vc
      3 collby_count             = i4
      3 collby[*]
        4 alias                  = vc
        4 alias_type_cd          = f8
        4 alias_pool_type_alias            = vc
        4 alias_subtype_cd       = f8
        4 alias_pool_cd          = f8
        4 alias_pool_alias            = vc
        4 check_digit            = i4
        4 check_digit_method_cd  = f8
        4 contributor_system_cd  = f8
        4 name_last              = vc
        4 name_first             = vc
        4 name_middle            = vc
        4 name_suffix            = vc
        4 name_prefix            = vc
        4 name_degree            = vc
        4 name_type_cd           = f8
        4 name_type_alias            = vc
      3 collect_prior_cd         = f8
      3 collect_prior_alias            = vc
      3 bodysite_cd              = f8
      3 bodysite_alias            = vc
      3 bodysite_text            = vc
      3 performloc_cd            = f8
      3 performloc_alias            = vc
      3 performloc_disp          = vc  ;MV added
      3 orderloc_cd              = f8
      3 orderloc_alias            = vc
      3 collmeth_cd              = f8
      3 collmeth_alias            = vc
      3 reqstart_dt_tm           = dq8
      3 reqstart_dt_tm_ind       = i2
      3 stop_dt_tm        		= dq8
      3 quantity                 = f8
      3 freetextphys_id          = f8
      3 rendphys_id              = f8
      3 rendphys_str            = vc
      3 priority_cd              = f8
      3 priority_alias            = vc
      3 freq_disp                = vc
      3 freq_cd                  = f8
      3 connected_order_id       = f8
      3 duration                 = f8
      3 duration_unit_cd         = f8
      3 duration_unit_disp       = vc
      3 duration_unit_alias    = vc
      3 isolation_cd             = f8
      3 isolation_alias           = vc
      3 isolation_text           = vc
      3 specimen_type_cd         = f8
      3 specimen_type_alias            = vc
      3 labelcomment             = vc
      3 transportmode_cd         = f8
      3 transportmode_alias                  = vc
      3 specinx                  = vc
      3 nursecollect_ind         = i4
      3 nursecollect_ind_ind     = i2
      3 cancelreason             = vc
      3 suspendreason            = vc
      3 resumereason             = vc
      3 dcreason                 = vc
      3 dc_dt_tm           		 = dq8
      3 cancelreason_cd          = f8
      3 suspendreason_cd         = f8
      3 resumereason_cd          = f8
      3 dcreason_cd              = f8
      3 printdeanbr_cd           = f8
      3 printdeanbr              = vc
      3 collected_ind            = i4
      3 collected_ind_ind        = i2
      3 sourcecmnt               = vc
      3 interval_base_dt_tm      = dq8
      3 consult_doc [*]
        4 id_nbr		 = i4
      3 accession_ind            = i2
      3 reasonforexam            = vc
 ;pharm
    3 drugform
            4 value           = f8
            4 display         = vc
            4 alias         = vc
    3 duration_encoded        = vc
    3 duration_noround        = vc
    3 freqschedid
            4 value           = f8
    3 infuseover
            4 value           = f8
    3 infuseoverunit
            4 value           = f8
            4 alias         = vc
    3 infuseover_encoded      = vc
    3 infuseover_noround      = vc
    3 mlhr                    = f8
    3 rate
            4 value           = f8
    3 rxroute
            4 value           = f8
            4 display         = vc
            4 alias         = vc
    3 titrateind
            4 value           = f8
    3 totalvolume
            4 display         = vc
    3 prnreason
            4 value           = f8
            4 display         = vc
    3 prn_ind	=f8
 
    3 freetext_dose		= vc
    3 freetextrate
            4 display         = vc
    3 replaceevery
            4 id              = f8
            4 display         = vc
    3 replaceeveryunit
            4 value           = f8
            4 display         = vc
    3 dispense_category
            4 value           = f8
            4 alias         = vc
    3 rxpriority
            4 value           = f8
            4 alias         = vc
    3 disp_qty
            4 value           = f8
    3 disp_qty_unit
            4 value           = f8
            4 alias         = vc
    3 nbr_of_refills
            4 value           = f8
    3 rx_qty
            4 value           = f8
    3 indication
            4 display         = vc
    3 sig
            4 display         = vc
    3 daw
            4 value           = f8
            4 display         = vc
            4 alias         = vc
    3 strength                      = f8
    3 strength_unit                 = f8
    3 strength_unit_alias         = vc
 
    3 volume                        = f8
    3 volume_unit                   = f8
    3 volume_unit_alias         = vc
 
   	3 obx_detail_count        = i4
    3 obx_detail[ * ]
        4 value_type      = vc
        4 obs_id          = f8
        4 obs_id_alias      = vc
        4 obs_value_count = i4
        4 obs_value[ * ]
            5 value   = vc
        4 units_id        = vc
        4 units_text      = vc
 
    2 pathnet_detail
      3 received_dt_tm           = dq8
      3 received_dt_tm_ind       = i2
      3 in_lab_dt_tm             = dq8
      3 in_lab_dt_tm_ind         = i2
      3 request_dt_tm            = dq8
      3 request_dt_tm_ind        = i2
      3 collected_dt_tm          = dq8
      3 collected_dt_tm_ind      = i2
      3 body_site_cd             = f8
      3 body_site_cd_ind         = i2
      3 specimen_type_cd         = f8
      3 specimen_type_cd_ind     = i2
 
    2 nte_count                  = i4
    2 nte[*]
      3 set_id                   = i4
      3 comment_type_cd          = f8
      3 comment_type			 = vc
      3 comment_count            = i4
      3 comment                = vc
 
;      3 comment[*]
;        4 comment                = vc
;        4 nte_line 				 = vc
    2 event_list[*]
        3 obx_type					=vc
        3 event_id					=f8
        3 event_cd					=f8
        3 event_alias            = vc
        3 event_class_cd					=f8
        3 event_class_alias            = vc
        3 task_assay_cd					=f8
        3 task_assay_alias            = vc
        3 subtable_bit_map					=i4
        3 result_units_cd					=f8
        3 result_units_alias            = vc
        3 normal_high					=vc
        3 normal_low					=vc
        3 normalcy_cd					=f8
        3 normalcy_alias            = vc
        3 event_title_text            = vc
        3 normalcy_method_cd					=f8
        3 normalcy_method_alias            = vc
        3 result_status_cd					=f8
        3 result_status_alias            = vc
        3 event_start_dt_tm					=dq8
        3 event_end_dt_tm					=dq8
        3 verified_dt_tm					=dq8
        3 performed_dt_tm					=dq8
        3 clinsig_updt_dt_tm					=dq8
        3 verified_prsnl_id					=f8
        3 verified_prsnl_str            = vc
        3 performed_prsnl_id					=f8
        3 performed_prsnl_str            = vc
        3 assisted_prsnl_str            = vc
        3 transcribe_prsnl            = vc
        3 resource_cd					=f8
        3 result_val			= vc
        3 reference_nbr			= vc
        3 clinical_seq			= c40
        3 accession_nbr			= vc
 
        3 blob_result[*]
          4 blob        =vc
          4 blob_handle       =vc
          4 format_cd           = f8
          4 storage_cd           = f8
          4 compression_cd           = f8
        3 string_result[*]
          4 string_result_text        =vc
        3 coded_result[*]
          4 mnemonic        =vc
          4 short_string        =vc
          4 descriptor        =vc
        3 date_result[*]
          4 result_dt_tm 	=dq8
 
        3 med_list[*]
          4 event_id           = f8
          4 admin_start_dt_tm 	=dq8
          4 admin_end_dt_tm 	=dq8
          4 admin_note        =vc
          4 admin_prov_id           = f8
          4 admin_prov_str        =vc
          4 admin_route_cd           = f8
          4 admin_route_alias            = vc
          4 admin_site_cd           = f8
          4 admin_site_alias            = vc
          4 admin_method_cd         = f8
          4 admin_method_alias            = vc
          4 initial_dosage         = f8
          4 admin_dosage         = f8
          4 dosage_unit_cd         = f8
          4 dosage_unit_alias            = vc
          4 initial_volume         = f8
          4 diluent_type_cd         = f8
          4 infusion_rate         = f8
          4 infusion_unit_cd         = f8
          4 infusion_unit_alias            = vc
          4 medication_form_cd         = f8
          4 medication_form_alias            = vc
          4 admin_strength         = i4
          4 admin_strength_unit_cd         = f8
          4 admin_strength_unit_alias            = vc
          4 substance_lot_number         = vc
          4 substance_manufacturer_cd         = f8
          4 substance_exp_dt_tm 	=dq8
          4 substance_manf_alias         = vc
          4 iv_event_cd         = f8
          4 synonym_id         = f8
          4 refusal_cd           = f8
          4 refusal_alias            = vc
          4 system_entry_dt_tm 	=dq8
          4 updt_dt_tm 	=dq8
 
 
        3 ce_prsnl[*]
          4 action_type_cd 	=f8
          4 action_status_cd 	=f8
          4 action_prsnl_id 	=f8
          4 action_prsnl_str 	=vc
 
        3 event_note[*]
        	4 note  =vc
 
 
     2 dg1_count                  = i4
     2 dg1[*]
       3 reltn_type_cd            = f8
       3 reltn_type            = vc
       3 nomenclature_id          = f8
       3 source_vocabulary_cd     = f8
       3 source_vocabulary     = vc
       3 source_string            = vc
       3 source_identifier        = vc
       3 diag_ftdesc              = vc
       3 field_qual_count         = i4
       3 field_type_flag          = i4
       3 field_date_value         = dq8
       3 field_disp_value         = vc
       3 field_value              = f8
       3 field_meaning_id         = f8
       3 field_id                 = f8
  1 exception_data[*]
    2 order_id                     = f8
 
  1 source_identifier            = vc
  1 source_string                = vc
 
 /*
  1 event_list[*]
    2 event_id					=f8
  	2 event_cd					=f8
    2 event_alias            = vc
  	2 task_assay_cd					=f8
    2 task_assay_alias            = vc
  	2 subtable_bit_map					=i4
  	2 result_units_cd					=f8
    2 result_units_alias            = vc
  	2 normal_high					=vc
  	2 normal_low					=vc
  	2 normalcy_cd					=f8
    2 normalcy_alias            = vc
  	2 normalcy_method_cd					=f8
    2 normalcy_method_alias            = vc
  	2 result_status_cd					=f8
    2 result_status_alias            = vc
  	2 verified_dt_tm					=dq8
  	2 clinsig_updt_dt_tm					=dq8
  	2 verified_prsnl_id					=f8
  	2 resource_cd					=f8
 
    2 med_list[*]
      3 event_id         	= f8
      3 admin_start_dt_tm 	=dq8
      3 admin_end_dt_tm 	=dq8
      3 admin_note      	=vc
      3 admin_prov_id         	= f8
      3 admin_route_cd         	= f8
      3 admin_route_alias            = vc
      3 admin_site_cd         	= f8
      3 admin_site_alias            = vc
      3 admin_method_cd         = f8
      3 admin_method_alias            = vc
      3 initial_dosage         = f8
      3 admin_dosage         = f8
      3 dosage_unit_cd         = f8
      3 dosage_unit_alias            = vc
      3 initial_volume         = f8
      3 diluent_type_cd         = f8
      3 infusion_rate         = f8
      3 infusion_unit_cd         = f8
      3 infusion_unit_alias            = vc
      3 medication_form_cd         = f8
      3 medication_form_alias            = vc
      3 admin_strength         = i4
      3 admin_strength_unit_cd         = f8
      3 admin_strength_unit_alias            = vc
      3 substance_lot_number         = vc
      3 iv_event_cd         = f8
      3 synonym_id         = f8
      3 refusal_cd         	= f8
      3 refusal_alias            = vc
      3 system_entry_dt_tm 	=dq8
 */
 
)
 
declare iBlobObx = i2 with public,noconstant(0)
declare v_OCF_COMP = f8 with public,noconstant(uar_get_code_by("MEANING", 120,"OCFCOMP"))
 
 declare dDiagCd = f8 with public,constant(uar_get_code_by("MEANING",23549,"ORDERDIAG"))
declare dICD9Cd = f8 with public,constant(uar_get_code_by("MEANING",23549,"ORDERICD9"))
declare dcstatusCD = f8 with public,constant(uar_get_code_by("MEANING",6004,"DISCONTINUED"))
declare fill_order_detail_cache_glb( dummy ) = I4
declare fill_event_list_cache_glb( dummy ) = I4
declare fill_obr_cache_glb( dummy ) = I4
declare fill_med_list_cache_glb( dummy ) = I4
declare get_ce_prsnl( dummy ) = I4
declare GetAliases( dummy ) = I4
declare fill_obr_dg1( dummy ) = I4
 
subroutine fill_obr_cache_glb( dummy )
 
 
		;order
		select  into "nl:" o.*
		 from orders o, order_action oa,order_action oa2,
		(dummyt d with seq = value(size(upload->enc,5)))
		, (dummyt   d1  with seq = 1)
		,dummyt   d2
		,order_alias oal
		,dummyt   d3
		,accession_order_r aor
		plan d where maxrec(d1,size(upload->enc[d.seq].event_ord_list,5))
		join d1
		join o where ;(o.order_id = upload->enc[d.seq]->event_ord_list[d1.seq]->order_id or
					  o.order_id = upload->enc[d.seq]->event_ord_list[d1.seq]->order_id;) and o.active_ind > 0
					  ;leh and o.encntr_id = upload->enc[d.seq]->encntr_id
		;upload->enc[d.seq]->event_ord_list[d1.seq]->order_id,110084012,113134550
		join oa where o.order_id = oa.order_id and o.last_action_sequence = oa.action_sequence
		join oa2 where o.order_id = oa2.order_id and oa2.action_sequence =1
		join d2
		join oal where oal.order_id=o.order_id and oal.active_ind > 0
		join d3
		join aor where aor.order_id=o.order_id and aor.order_id > 0
 		order by o.person_id, o.encntr_id,d.seq,d1.seq;o.order_id ;
 		head report
 			i_cnt = 0
 		head d.seq
 		xx=0
 		head d1.seq ;changed to this for if order_id=0, immunizations was having problems.
 		;head o.order_id
 		;call echo(build(" o.order_id = ", o.order_id))
 		;call echo(build("d.seq = ",d.seq))
 		;call echo(build("d1.seq = ",d1.seq))
	 		i_cnt= i_cnt +1
 		;call echo(build("i_cnt = ",i_cnt))
	 		stat = alterlist( result_rec->obr, i_cnt   )
            result_rec->obr[i_cnt]->order_id		       = o.order_id
            result_rec->obr[i_cnt]->action_sequence		       = o.last_action_sequence
            result_rec->obr[i_cnt]->catalog_cd            = o.catalog_cd
           /* if(trim(cva3.alias)="" and cva3.code_value>0)
            	result_rec->obr[i_cnt]->catalog_alias       = build("CD:",cva3.code_value)
            else
            	result_rec->obr[i_cnt]->catalog_alias       = trim(cva3.alias)
            endif*/
 
            result_rec->obr[i_cnt]->med_order_type_cd        = o.med_order_type_cd
            result_rec->obr[i_cnt]->orig_ord_as_flag        = o.orig_ord_as_flag
            result_rec->obr[i_cnt]->active_status_prsnl_id            = o.active_status_prsnl_id
            result_rec->obr[i_cnt]->order_mnemonic        = o.order_mnemonic
            result_rec->obr[i_cnt]->ordered_as_mnemonic        = o.ordered_as_mnemonic
            result_rec->obr[i_cnt]->catalog_type_cd       = o.catalog_type_cd
            result_rec->obr[i_cnt]->activity_type_cd      = o.activity_type_cd
            result_rec->obr[i_cnt]->activity_type_cd_mean = trim(uar_get_code_meaning(o.activity_type_cd))
            result_rec->obr[i_cnt]->oe_format_id          = o.oe_format_id
            result_rec->obr[i_cnt]->orig_order_dt_tm      = o.orig_order_dt_tm
            result_rec->obr[i_cnt]->template_order_flag   = o.template_order_flag
            result_rec->obr[i_cnt]->template_order_id     = o.template_order_id
            result_rec->obr[i_cnt]->order_comment_ind     = o.order_comment_ind
            result_rec->obr[i_cnt]->cs_flag               = o.cs_flag
            result_rec->obr[i_cnt]->cs_order_id           = o.cs_order_id
            result_rec->obr[i_cnt]->current_start_dt_tm   = o.current_start_dt_tm
            result_rec->obr[i_cnt]->projected_stop_dt_tm   = o.projected_stop_dt_tm
            result_rec->obr[i_cnt]->synonym_id            = o.synonym_id
            result_rec->obr[i_cnt]->dept_status_cd        = oa.dept_status_cd
            result_rec->obr[i_cnt]->action_type_cd        = oa.action_type_cd
           /* if(trim(cva4.alias)="" and cva4.code_value>0)
            	result_rec->obr[i_cnt]->action_type_alias       = build("CD:",cva4.code_value)
            else
            	result_rec->obr[i_cnt]->action_type_alias       = trim(cva4.alias)
            endif*/
            result_rec->obr[i_cnt]->order_locn_cd        = oa.order_locn_cd
            /*if(trim(cva5.alias)="" and cva5.code_value>0)
            	result_rec->obr[i_cnt]->order_locn_alias       = build("CD:",cva5.code_value)
            else
            	result_rec->obr[i_cnt]->order_locn_alias       = trim(cva5.alias)
            endif*/
            result_rec->obr[i_cnt]->order_dt_tm        = oa.order_dt_tm
            if(oa2.communication_type_cd >0 and oa2.communication_type_cd != uar_get_code_by("MEANING",6006,"ESIDEFAULT"))
            	result_rec->obr[i_cnt]->communication_type_cd        = oa2.communication_type_cd
            else
            	result_rec->obr[i_cnt]->communication_type_cd        = oa.communication_type_cd
            endif
 
            /*if(trim(cva6.alias)="" and cva6.code_value>0)
            	result_rec->obr[i_cnt]->communication_type_alias       = build("CD:",cva6.code_value)
            else
            	result_rec->obr[i_cnt]->communication_type_alias       = trim(cva6.alias)
            endif*/
            result_rec->obr[i_cnt]->order_status_cd       = oa.order_status_cd
           /* if(trim(cva2.alias)="" and cva2.code_value>0)
            	result_rec->obr[i_cnt]->order_status_alias       = build("CD:",cva2.code_value)
            else
            	result_rec->obr[i_cnt]->order_status_alias       = trim(cva2.alias)
            endif*/
 
            if(oa2.action_personnel_id >1 )
            	result_rec->obr[i_cnt]->action_personnel_id        = oa2.action_personnel_id
            	result_rec->obr[i_cnt]->action_personnel2_id        = oa.action_personnel_id   ;MV
            else
            	result_rec->obr[i_cnt]->action_personnel_id        = oa.action_personnel_id
            endif
            result_rec->obr[i_cnt]->order_provider_id            = oa.order_provider_id
            result_rec->obr[i_cnt]->effective_dt_tm            = oa.effective_dt_tm
 
            result_rec->obr[i_cnt]->order_detail->reqstart_dt_tm_ind = 0
            result_rec->obr[i_cnt]->order_detail->collected_ind_ind  = 0
 
 			stat = alterlist( result_rec->obr[i_cnt]->order_alias, 1 )
            result_rec->obr[i_cnt]->order_alias[1]->alias                   = oal.alias
            result_rec->obr[i_cnt]->order_alias[1]->alias_pool_cd           = oal.alias_pool_cd
            result_rec->obr[i_cnt]->order_alias[1]->order_alias_type_cd     = oal.order_alias_type_cd
            result_rec->obr[i_cnt]->order_alias[1]->order_alias_sub_type_cd = oal.order_alias_sub_type_cd
            result_rec->obr[i_cnt]->order_alias[1]->contributor_system_cd   = oal.contributor_system_cd
            result_rec->obr[i_cnt]->order_alias[1]->check_digit             = oal.check_digit
            result_rec->obr[i_cnt]->order_alias[1]->check_digit_method_cd   = oal.check_digit_method_cd
 			if(result_rec->obr[i_cnt]->order_alias[1]->alias ="")
 				result_rec->obr[i_cnt]->order_alias[1]->alias = trimzeros(build(o.order_id))
 			endif
 
            result_rec->obr[i_cnt]->accession   = aor.accession
            result_rec->obr[i_cnt]->accession_id            = aor.accession_id
 			if(size(upload->enc[d.seq]->event_ord_list[d1.seq]->event_list,5)>0)
 				for(i=1 to size(upload->enc[d.seq]->event_ord_list[d1.seq]->event_list,5))
 					stat=alterlist(result_rec->obr[i_cnt]->event_list, i)
 					result_rec->obr[i_cnt]->event_list[i]->event_id=
 						upload->enc[d.seq]->event_ord_list[d1.seq]->event_list[i]->event_id
 				endfor
 			endif
 
	 	detail
	 	 xx=0
			/*if(pr.person_id=oa.action_personnel_id)
		      result_rec->obr[i_cnt]->action_personnel_str =
		      			concat(result_rec->obr[i_cnt]->action_personnel_str,
	         	trim(pa.alias),"^",trim(pr.name_last),"^",trim(pr.name_first),"^^^^^^",trim(cva.alias),"~");,build(cva3.alias),"~")
	 		elseif (pr.person_id=oa.order_provider_id)
	         	result_rec->obr[i_cnt]->order_provider_str =
	         		concat(result_rec->obr[i_cnt]->order_provider_str,
	         	trim(pa.alias),"^",trim(pr.name_last),"^",trim(pr.name_first),"^^^^^^",trim(cva.alias),"~");,build(cva3.alias),"~")
	 		endif*/
 		with nocounter,outerjoin=d1,outerjoin=d2,outerjoin=d3,
 			dontcare=oal,dontcare=aor
 		;need outerjoin on d1 because some events don't have orders tied to them
 		; load order comments
 		select into "nl:"
 		from (dummyt d with seq = value(size(result_rec->obr,5)))
 			,order_comment oc
 			, long_text lt
 		plan d
 		join oc where ; took this out as some orders don't have this set,result_rec->obr[d.seq]->order_comment_ind = 1
 			;and
 			   oc.order_id = result_rec->obr[d.seq]->order_id
; 			and oc.action_sequence = result_rec->obr[d.seq]->action_sequence
 		join lt where lt.long_text_id = oc.long_text_id
 		order by d.seq
 		head d.seq
		;head oc.order_id
 				ct_cnt = 0
 		head oc.comment_type_cd
 			ct_cnt = ct_cnt + 1
 			stat = alterlist(result_rec->obr[d.seq]->nte,ct_cnt)
 			result_rec->obr[d.seq]->nte[ct_cnt]->comment_type_cd = oc.comment_type_cd
		detail
				text_blob = lt.long_text
				;call echo(text_blob)
 				call load_blob_to_text(text_blob)
	  			;call echorecord(temp)
				for (text_line_cnt = 1 to size(temp->line,5))
					if (text_line_cnt = 1)
						result_rec->obr[d.seq]->nte[ct_cnt]->comment = temp->line[text_line_cnt]->text
					else
						result_rec->obr[d.seq]->nte[ct_cnt]->comment =
								concat (result_rec->obr[d.seq]->nte[ct_cnt]->comment,char(126),
										temp->line[text_line_cnt]->text)
					endif
 
 
				endfor
 		with nocounter
	return(1)
end
 
subroutine fill_event_list_cache_glb( dummy )
 ;declare sRftText =vc with public,noconstant("")
 ;declare sAsciiText =vc with public,noconstant("")
; call echorecord(result_rec)
 call echo ("Entering fill_event_list_cache_glb")
		select  into "nl:" ce.*
		 from clinical_event ce,
		(dummyt d with seq = value(size(result_rec->obr,5)))
		, (dummyt   d1  with seq = 1)
		, ce_med_result cm
		, dummyt d2
		, ce_date_result cd
		, dummyt d3
		, ce_coded_result cc
		, dummyt d4
		, ce_string_result cs
		, dummyt d5
		, ce_blob_result cbr
		, ce_blob cb
		, dummyt d6
		, dummyt d7
		, dummyt d8
		, ce_event_note cen
		, long_blob lb
		plan d where maxrec(d1,size(result_rec->obr[d.seq].event_list,5))
		join d1
        join ce
         where ce.event_id = result_rec->obr[d.seq]->event_list[d1.seq]->event_id
            and ce.event_id > 0 and ce.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
        join d2
        join cm
          where cm.event_id = ce.event_id and cm.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
        join d3
        join cd
          where cd.event_id = ce.event_id and cd.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
        join d4
        join cc
          where cc.event_id = ce.event_id and cc.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
        join d5
        join cs
          where cs.event_id = ce.event_id and cs.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
        join d6
        join cbr
          where cbr.event_id = ce.event_id and cbr.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
        join d7
        join cb
          where cb.event_id = ce.event_id and cb.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
        join d8
        join cen
          where cen.event_id = ce.event_id and cen.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
        join lb
          where cen.ce_event_note_id=lb.parent_entity_id and lb.parent_entity_name="CE_EVENT_NOTE"
 
         order ce.event_id
         ;order d.seq,d1.seq
        ; order ce.person_id,ce.encntr_id,d.seq,d1.seq,ce.order_id,ce.event_id
        ;head d.seq
        ; xx=0
        ;head d1.seq
        head ce.event_id
; call echo (build("event_id=",ce.event_id))
   			result_rec->obr[d.seq]->event_list[d1.seq]->event_id = ce.event_id
 			result_rec->obr[d.seq]->event_list[d1.seq]->event_cd = ce.event_cd
 			result_rec->obr[d.seq]->event_list[d1.seq]->event_class_cd = ce.event_class_cd
 			result_rec->obr[d.seq]->event_list[d1.seq]->task_assay_cd = ce.task_assay_cd
 			result_rec->obr[d.seq]->event_list[d1.seq]->subtable_bit_map = ce.subtable_bit_map
 			result_rec->obr[d.seq]->event_list[d1.seq]->result_units_cd = ce.result_units_cd
 			result_rec->obr[d.seq]->event_list[d1.seq]->normal_high = ce.normal_high
 			result_rec->obr[d.seq]->event_list[d1.seq]->normal_low = ce.normal_low
 			result_rec->obr[d.seq]->event_list[d1.seq]->normalcy_cd = ce.normalcy_cd
 			result_rec->obr[d.seq]->event_list[d1.seq]->event_title_text = ce.event_title_text
 			result_rec->obr[d.seq]->event_list[d1.seq]->normalcy_method_cd = ce.normalcy_method_cd
 			result_rec->obr[d.seq]->event_list[d1.seq]->result_status_cd = ce.result_status_cd
 			result_rec->obr[d.seq]->result_status_cd = ce.result_status_cd
 
 			result_rec->obr[d.seq]->event_list[d1.seq]->event_start_dt_tm = ce.event_start_dt_tm
 			result_rec->obr[d.seq]->event_list[d1.seq]->event_end_dt_tm = ce.event_end_dt_tm
 			result_rec->obr[d.seq]->event_list[d1.seq]->verified_dt_tm = ce.verified_dt_tm
 			result_rec->obr[d.seq]->event_list[d1.seq]->performed_dt_tm = ce.performed_dt_tm
 			result_rec->obr[d.seq]->event_list[d1.seq]->clinsig_updt_dt_tm = ce.clinsig_updt_dt_tm
 			result_rec->obr[d.seq]->event_list[d1.seq]->verified_prsnl_id = ce.verified_prsnl_id
 			result_rec->obr[d.seq]->event_list[d1.seq]->resource_cd = ce.resource_cd
 			result_rec->obr[d.seq]->event_list[d1.seq]->reference_nbr = ce.reference_nbr
 			result_rec->obr[d.seq]->event_list[d1.seq]->clinical_seq = ce.clinical_seq
 			result_rec->obr[d.seq]->event_list[d1.seq]->result_val = ce.result_val
 			result_rec->obr[d.seq]->event_list[d1.seq]->verified_prsnl_id = ce.verified_prsnl_id
 			result_rec->obr[d.seq]->event_list[d1.seq]->performed_prsnl_id = ce.performed_prsnl_id
 			result_rec->obr[d.seq]->event_list[d1.seq]->accession_nbr = ce.accession_nbr
 
 if(lb.long_blob_id>0)
 	;result_rec->obr[d.seq]->event_list[d1.seq]->event_note = trim(replace(lb.long_blob,"ocf_blob"," ",0))
 	;result_rec->obr[d.seq]->event_list[d1.seq]->event_note = lb.long_blob
 		txt_cnt = 0
 		if (cen.compression_cd = V_OCF_COMP)
			TBlobIn = lb.long_blob
			call Decompress_text(TBlobIn)
 
			iBlobContentsSize = textlen( trim( TBlobOut ) )
 
			if ( iBlobContentsSize > 0 )
 
					if(findstring("rtf1",TBlobOut)>0)
						;free set sRftText
						;free set sAsciiText
						;free set sAsciiSize
						sRftText=fillstring(32000, " ")
						sAsciiText=fillstring(32000, " ")
						sAsciiSize=0
						iRftTextSize=textlen(TBlobOut)
						sRftText=TBlobOut
						sAsciiText=TBlobOut
						call uar_rtf3(sRftText,iRftTextSize,sAsciiText,iRftTextSize,sAsciiSize)
						text_blob= trim(substring(1,sAsciiSize,sAsciiText))
						sRftText=fillstring(32000, " ")
						sAsciiText=fillstring(32000, " ")
						TBlobOut=fillstring(32000, " ")
						;free set sRftText
						;free set sAsciiText
						;memfree(sRftText)
						;memfree(sAsciiText)
					else
 
						text_blob = replace(TBlobOut,char(00)," ",0)
					endif
				;call echo(text_blob)
 				call load_blob_to_text(text_blob)
	  			;call echorecord(temp)
				for (text_line_cnt = 1 to size(temp->line,5))
					txt_cnt = txt_cnt + 1
					stat = alterlist(result_rec->obr[d.seq]->event_list[d1.seq]->event_note,txt_cnt)
					result_rec->obr[d.seq]->event_list[d1.seq]->event_note[txt_cnt]->note =
						replace(temp->line[text_line_cnt]->text,char(00)," ",0)
				endfor
			endif
 
		else
 
					if(findstring("rtf1",lb.long_blob)>0)
						;free set sRftText
						;free set sAsciiText
						;free set sAsciiSize
						sAsciiSize=0
						iRftTextSize=textlen(lb.long_blob)
						sRftText=lb.long_blob
						sAsciiText=lb.long_blob
						call uar_rtf3(sRftText,iRftTextSize,sAsciiText,iRftTextSize,sAsciiSize)
						text_blob= trim(substring(1,sAsciiSize,sAsciiText))
						;free set sRftText
						;free set sAsciiText
					else
 
						text_blob = lb.long_blob
					endif
			;text_blob = lb.long_blob
 			call load_blob_to_text(text_blob)
	  		;call echorecord(temp)
			for (text_line_cnt = 1 to size(temp->line,5))
				txt_cnt = txt_cnt + 1
					stat = alterlist(result_rec->obr[d.seq]->event_list[d1.seq]->event_note,txt_cnt)
				result_rec->obr[d.seq]->event_list[d1.seq]->event_note[txt_cnt]->note =
						 ;temp->line[text_line_cnt]->text
						replace(replace(temp->line[text_line_cnt]->text,"ocf_blob"," ",0),char(00)," ",0)
						;replace(temp->line[text_line_cnt]->text,concat(char(00),"ocf_blob")," ",0)
			endfor
		endif
		 stat = alterlist ( temp->line,0 ) ;mav
 endif
 
 			med_cnt = 0
         detail
         		med_cnt = med_cnt +1
         	if(band(ce.subtable_bit_map,256)>0 or band(ce.subtable_bit_map,512) >0) ;blob result/blob/blob_handle
	  			stat = alterlist(result_rec->obr[d.seq]->event_list[d1.seq]->blob_result,med_cnt)
				result_rec->obr[d.seq]->event_list[d1.seq]->blob_result[med_cnt]->storage_cd = cbr.storage_cd
				result_rec->obr[d.seq]->event_list[d1.seq]->blob_result[med_cnt]->format_cd = cbr.format_cd
				result_rec->obr[d.seq]->event_list[d1.seq]->blob_result[med_cnt]->blob_handle = cbr.blob_handle
				if(trim(cbr.blob_handle)="")
				result_rec->obr[d.seq]->event_list[d1.seq]->blob_result[med_cnt]->blob = cb.blob_contents
				result_rec->obr[d.seq]->event_list[d1.seq]->blob_result[med_cnt]->compression_cd = cb.compression_cd
				result_rec->obr[d.seq]->event_list[d1.seq]->obx_type="FT"
				else
				result_rec->obr[d.seq]->event_list[d1.seq]->obx_type="RP"
				endif
         	;endif
         	elseif(band(ce.subtable_bit_map,8192)>0) ;string
	  			stat = alterlist(result_rec->obr[d.seq]->event_list[d1.seq]->string_result,med_cnt)
				result_rec->obr[d.seq]->event_list[d1.seq]->string_result[med_cnt]->string_result_text = cs.string_result_text
				result_rec->obr[d.seq]->event_list[d1.seq]->obx_type="event_class_cd-str"
         	;endif
         	elseif(band(ce.subtable_bit_map,32768)>0) ;coded
	  			stat = alterlist(result_rec->obr[d.seq]->event_list[d1.seq]->coded_result,med_cnt)
				result_rec->obr[d.seq]->event_list[d1.seq]->coded_result[med_cnt]->descriptor = cc.descriptor
				result_rec->obr[d.seq]->event_list[d1.seq]->obx_type="CE"
         	;endif
         	elseif(band(ce.subtable_bit_map,4194304)>0) ;date
	  			stat = alterlist(result_rec->obr[d.seq]->event_list[d1.seq]->date_result,med_cnt)
				result_rec->obr[d.seq]->event_list[d1.seq]->date_result[med_cnt]->result_dt_tm = cd.result_dt_tm
				result_rec->obr[d.seq]->event_list[d1.seq]->obx_type="DT"
         	;endif
         	;endif
         	elseif(band(ce.subtable_bit_map,1074266118)>0) ;med
	  			stat = alterlist(result_rec->obr[d.seq]->event_list[d1.seq]->med_list,med_cnt)
	  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[med_cnt]->event_id = ce.event_id
	  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[med_cnt]->admin_start_dt_tm = cm.admin_start_dt_tm
	  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[med_cnt]->admin_end_dt_tm = cm.admin_end_dt_tm
	  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[med_cnt]->admin_note =
	  				replace(cm.admin_note,char(13)," ",0)
	  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[med_cnt]->admin_prov_id = cm.admin_prov_id
	  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[med_cnt]->admin_route_cd = cm.admin_route_cd
	  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[med_cnt]->admin_site_cd = cm.admin_site_cd
	  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[med_cnt]->admin_method_cd = cm.admin_method_cd
	  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[med_cnt]->initial_dosage = cm.initial_dosage
	  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[med_cnt]->admin_dosage = cm.admin_dosage
	  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[med_cnt]->admin_method_cd = cm.admin_method_cd
	  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[med_cnt]->dosage_unit_cd = cm.dosage_unit_cd
	  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[med_cnt]->initial_volume = cm.initial_volume
	  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[med_cnt]->diluent_type_cd = cm.diluent_type_cd
	  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[med_cnt]->infusion_rate = cm.infusion_rate
	  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[med_cnt]->infusion_unit_cd = cm.infusion_unit_cd
	  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[med_cnt]->medication_form_cd = cm.medication_form_cd
	  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[med_cnt]->admin_strength = cm.admin_strength
	  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[med_cnt]->admin_strength_unit_cd = cm.admin_strength_unit_cd
	  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[med_cnt]->substance_exp_dt_tm = cm.substance_exp_dt_tm
	  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[med_cnt]->substance_manufacturer_cd = cm.substance_manufacturer_cd
	  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[med_cnt]->substance_lot_number = cm.substance_lot_number
	  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[med_cnt]->iv_event_cd = cm.iv_event_cd
	  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[med_cnt]->synonym_id = cm.synonym_id
	  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[med_cnt]->refusal_cd = cm.refusal_cd
	  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[med_cnt]->system_entry_dt_tm = cm.system_entry_dt_tm
	  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[med_cnt]->updt_dt_tm = cm.updt_dt_tm
         	elseif(result_rec->obr[d.seq]->event_list[d1.seq]->obx_type="")
         		result_rec->obr[d.seq]->event_list[d1.seq]->obx_type="event_class_cd"
         	endif
 
 		;foot report
 			;stat = alterlist( result_rec->event_list, i_cnt )
 
         with nocounter,outerjoin=d2,outerjoin=d3,outerjoin=d4,outerjoin=d5,outerjoin=d6,outerjoin=d7,
         	dontcare=cm,dontcare=cd,dontcare=cc,dontcare=cs,dontcare=cbr,dontcare=cb
 
 
 
 call echo ("Exiting fill_event_list_cache_glb")
	return (1)
end
 
subroutine get_ce_prsnl(dummy)
 call echo ("Entering get_ce_prsnl")
 
		select  into "nl:" cep.*
		 from ce_event_prsnl cep,
		(dummyt d with seq = value(size(result_rec->obr,5)))
		, (dummyt   d1  with seq = 1)
		plan d where maxrec(d1,size(result_rec->obr[d.seq].event_list,5))
		join d1
        join cep
         where cep.event_id = result_rec->obr[d.seq]->event_list[d1.seq]->event_id
            and cep.event_id > 0 and cep.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
        head cep.event_id
        	p_cnt = 0
        detail
            p_cnt=p_cnt+1
            stat = alterlist(result_rec->obr[d.seq]->event_list[d1.seq]->ce_prsnl, p_cnt)
            result_rec->obr[d.seq]->event_list[d1.seq]->ce_prsnl[p_cnt]->action_status_cd = cep.action_status_cd
            result_rec->obr[d.seq]->event_list[d1.seq]->ce_prsnl[p_cnt]->action_type_cd = cep.action_type_cd
            result_rec->obr[d.seq]->event_list[d1.seq]->ce_prsnl[p_cnt]->action_prsnl_id = cep.action_prsnl_id
 
		with nocounter,outerjoin=d1
 
 call echo ("Exiting get_ce_prsnl")
	return (1)
end
 
subroutine fill_med_list_cache_glb( dummy )
 
 call echo ("Entering fill_med_list_cache_glb")
 		select  into "nl:" o.*
 		 from clinical_event ce, ce_med_result cm,
 		(dummyt d with seq = value(size(result_rec->obr,5)))
 		, (dummyt   d1  with seq = 1)
 		plan d where maxrec(d1,size(result_rec->obr[d.seq].event_list,5))
 		join d1
         join ce
          where ce.event_id = result_rec->obr[d.seq]->event_list[d1.seq]->event_id
             and ce.event_id > 0 and ce.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
         join cm
          where cm.event_id = ce.event_id and cm.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
          order ce.event_id
          head report
  			;stat = alterlist(result_rec->event_list,size(upload->enc[d.seq].event_ord_list,5))
  			i_cnt=0
  		  head cm.event_id
  			i_cnt = i_cnt +1
  			m_cnt=0
          detail
  			m_cnt = m_cnt +1
  			stat = alterlist(result_rec->obr[d.seq]->event_list[d1.seq]->med_list,m_cnt)
  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[m_cnt]->event_id = ce.event_id
  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[m_cnt]->admin_start_dt_tm = cm.admin_start_dt_tm
  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[m_cnt]->admin_end_dt_tm = cm.admin_end_dt_tm
  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[m_cnt]->admin_note = cm.admin_note
  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[m_cnt]->admin_prov_id = cm.admin_prov_id
  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[m_cnt]->admin_route_cd = cm.admin_route_cd
  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[m_cnt]->admin_site_cd = cm.admin_site_cd
  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[m_cnt]->admin_method_cd = cm.admin_method_cd
  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[m_cnt]->initial_dosage = cm.initial_dosage
  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[m_cnt]->admin_dosage = cm.admin_dosage
  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[m_cnt]->admin_method_cd = cm.admin_method_cd
  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[m_cnt]->dosage_unit_cd = cm.dosage_unit_cd
  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[m_cnt]->initial_volume = cm.initial_volume
  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[m_cnt]->diluent_type_cd = cm.diluent_type_cd
  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[m_cnt]->infusion_rate = cm.infusion_rate
  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[m_cnt]->infusion_unit_cd = cm.infusion_unit_cd
  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[m_cnt]->medication_form_cd = cm.medication_form_cd
  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[m_cnt]->admin_strength = cm.admin_strength
  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[m_cnt]->admin_strength_unit_cd = cm.admin_strength_unit_cd
  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[m_cnt]->substance_lot_number = cm.substance_lot_number
  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[m_cnt]->iv_event_cd = cm.iv_event_cd
  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[m_cnt]->synonym_id = cm.synonym_id
  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[m_cnt]->refusal_cd = cm.refusal_cd
  			result_rec->obr[d.seq]->event_list[d1.seq]->med_list[m_cnt]->system_entry_dt_tm = cm.system_entry_dt_tm
 
 
 
          with nocounter
 
 call echo ("Exiting fill_med_list_cache_glb")
	return (1)
end
 
/*
subroutine fill_event_list_cache_glb( dummy )
 
 call echo ("Entering fill_event_list_cache_glb")
		select  into "nl:" o.*
		 from clinical_event ce,
		(dummyt d with seq = value(size(upload->enc,5)))
		, (dummyt   d1  with seq = 1)
		;, clinical_event ce
		plan d where maxrec(d1,size(upload->enc[d.seq].event_ord_list,5))
		join d1
        join ce
         where ce.event_id = upload->enc[d.seq].event_ord_list[d1.seq]->event_id
            and ce.event_id > 0 and ce.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
         order ce.event_id
         head report
 			i_cnt=size(result_rec->event_list,5)
         detail
 			i_cnt = i_cnt +1
 
                 stat = alterlist( result_rec->event_list, i_cnt )
           ; if ( mod( i_cnt , 10 ) = 1 )
            ;     stat = alterlist( result_rec->event_list, i_cnt +9 )
            ;endif
 			result_rec->event_list[i_cnt]->event_id = ce.event_id
 			result_rec->event_list[i_cnt]->event_cd = ce.event_cd
 			result_rec->event_list[i_cnt]->task_assay_cd = ce.task_assay_cd
 			result_rec->event_list[i_cnt]->subtable_bit_map = ce.subtable_bit_map
 			result_rec->event_list[i_cnt]->result_units_cd = ce.result_units_cd
 			result_rec->event_list[i_cnt]->normal_high = ce.normal_high
 			result_rec->event_list[i_cnt]->normal_low = ce.normal_low
 			result_rec->event_list[i_cnt]->normalcy_cd = ce.normalcy_cd
 			result_rec->event_list[i_cnt]->normalcy_method_cd = ce.normalcy_method_cd
 			result_rec->event_list[i_cnt]->result_status_cd = ce.result_status_cd
 			result_rec->event_list[i_cnt]->verified_dt_tm = ce.verified_dt_tm
 			result_rec->event_list[i_cnt]->clinsig_updt_dt_tm = ce.clinsig_updt_dt_tm
 			result_rec->event_list[i_cnt]->verified_prsnl_id = ce.verified_prsnl_id
 			result_rec->event_list[i_cnt]->resource_cd = ce.resource_cd
 
 		;foot report
 			;stat = alterlist( result_rec->event_list, i_cnt )
 
         with nocounter
 
 
 
 call echo ("Exiting fill_event_list_cache_glb")
	return (1)
end
 
subroutine fill_med_list_cache_glb( dummy )
 
 call echo ("Entering fill_med_list_cache_glb")
 		select  into "nl:" o.*
 		 from clinical_event ce, ce_med_result cm,
 		(dummyt d with seq = value(size(upload->enc,5)))
 		, (dummyt   d1  with seq = 1)
 		plan d where maxrec(d1,size(upload->enc[d.seq].event_ord_list,5))
 		join d1
         join ce
          where ce.event_id = upload->enc[d.seq].event_ord_list[d1.seq]->event_id
             and ce.event_id > 0 and ce.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
         join cm
          where cm.event_id = ce.event_id and cm.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
          order ce.event_id
          head report
  			;stat = alterlist(result_rec->event_list,size(upload->enc[d.seq].event_ord_list,5))
  			i_cnt=0
  		  head cm.event_id
  			i_cnt = i_cnt +1
  			m_cnt=0
          detail
  			m_cnt = m_cnt +1
  			stat = alterlist(result_rec->event_list[i_cnt]->med_list,m_cnt)
  			result_rec->event_list[i_cnt]->med_list[m_cnt]->event_id = ce.event_id
  			result_rec->event_list[i_cnt]->med_list[m_cnt]->admin_start_dt_tm = cm.admin_start_dt_tm
  			result_rec->event_list[i_cnt]->med_list[m_cnt]->admin_end_dt_tm = cm.admin_end_dt_tm
  			result_rec->event_list[i_cnt]->med_list[m_cnt]->admin_note = cm.admin_note
  			result_rec->event_list[i_cnt]->med_list[m_cnt]->admin_prov_id = cm.admin_prov_id
  			result_rec->event_list[i_cnt]->med_list[m_cnt]->admin_route_cd = cm.admin_route_cd
  			result_rec->event_list[i_cnt]->med_list[m_cnt]->admin_site_cd = cm.admin_site_cd
  			result_rec->event_list[i_cnt]->med_list[m_cnt]->admin_method_cd = cm.admin_method_cd
  			result_rec->event_list[i_cnt]->med_list[m_cnt]->initial_dosage = cm.initial_dosage
  			result_rec->event_list[i_cnt]->med_list[m_cnt]->admin_dosage = cm.admin_dosage
  			result_rec->event_list[i_cnt]->med_list[m_cnt]->admin_method_cd = cm.admin_method_cd
  			result_rec->event_list[i_cnt]->med_list[m_cnt]->dosage_unit_cd = cm.dosage_unit_cd
  			result_rec->event_list[i_cnt]->med_list[m_cnt]->initial_volume = cm.initial_volume
  			result_rec->event_list[i_cnt]->med_list[m_cnt]->diluent_type_cd = cm.diluent_type_cd
  			result_rec->event_list[i_cnt]->med_list[m_cnt]->infusion_rate = cm.infusion_rate
  			result_rec->event_list[i_cnt]->med_list[m_cnt]->infusion_unit_cd = cm.infusion_unit_cd
  			result_rec->event_list[i_cnt]->med_list[m_cnt]->medication_form_cd = cm.medication_form_cd
  			result_rec->event_list[i_cnt]->med_list[m_cnt]->admin_strength = cm.admin_strength
  			result_rec->event_list[i_cnt]->med_list[m_cnt]->admin_strength_unit_cd = cm.admin_strength_unit_cd
  			result_rec->event_list[i_cnt]->med_list[m_cnt]->substance_lot_number = cm.substance_lot_number
  			result_rec->event_list[i_cnt]->med_list[m_cnt]->iv_event_cd = cm.iv_event_cd
  			result_rec->event_list[i_cnt]->med_list[m_cnt]->synonym_id = cm.synonym_id
  			result_rec->event_list[i_cnt]->med_list[m_cnt]->refusal_cd = cm.refusal_cd
  			result_rec->event_list[i_cnt]->med_list[m_cnt]->system_entry_dt_tm = cm.system_entry_dt_tm
 
 
 
          with nocounter
 
 call echo ("Exiting fill_med_list_cache_glb")
	return (1)
end*/
 
subroutine fill_order_detail_cache_glb( dummy )
 call echo ("Entering fill_order_detail_cache_glb")
         select into "nl:"
		      od.ACTION_SEQUENCE,
		      od.DETAIL_SEQUENCE,
		      od.OE_FIELD_DISPLAY_VALUE,
		      od.OE_FIELD_DT_TM_VALUE,
		      od.OE_FIELD_ID,
		      od.OE_FIELD_MEANING,
		      od.OE_FIELD_MEANING_ID,
		      od.OE_FIELD_VALUE,
		      oef.FIELD_TYPE_FLAG
         from order_detail od, order_entry_fields oef, orders o
         ,(dummyt d with seq = size(result_rec->obr,5))
         plan d
         join o
         	where o.order_id = result_rec->obr[d.seq]->order_id
         join od where o.order_id=od.order_id
            and od.order_id > 0 and od.action_sequence <= result_rec->obr[d.seq]->action_sequence
    join oef where ( oef.oe_field_id = od.oe_field_id )
    order d.seq,o.person_id,o.encntr_id,o.order_id,od.oe_field_id , od.action_sequence desc
    ;order o.person_id, o.encntr_id,d.seq,od.order_id,od.oe_field_id , od.action_sequence desc
 
 head report
	q_idx=0
 head d.seq
; head od.order_id
	q_idx= q_idx+1
 
 head od.order_id
     ;stat = alterlist( result_rec->obr , q_idx  )
	;q_idx= q_idx+1
        count = 0
        map_to_obx = 0
        temp_idx = 0
        found_idx = 0
        act_seq = 0
        highest_act_seq_flag = 0
        qual_idx = 0
        i = 0
    head od.oe_field_id
            act_seq = od.action_sequence
            highest_act_seq_flag = 1
    head od.action_sequence
            if ( act_seq != od.action_sequence )
                    highest_act_seq_flag = 0
            endif
    detail
 
            if ( highest_act_seq_flag = 1 )
 
                                	;call echo(build("oef.field_type_flag= ",oef.field_type_flag))
                                	;call echo(build("od.oe_field_meaning= ",od.oe_field_meaning))
                    map_to_obx = 0
                    case( od.oe_field_meaning )
 
                            of "DRUGFORM" :
                                    result_rec->obr[d.seq]->order_detail->drugform->value = od.oe_field_value
                                    result_rec->obr[d.seq]->order_detail->drugform->display = od.oe_field_display_value
                            of "FREQSCHEDID" :
                                    result_rec->obr[d.seq]->order_detail->freqschedid->value = od.oe_field_value
                            of "INFUSEOVER" :
                                    result_rec->obr[d.seq]->order_detail->infuseover->value = od.oe_field_value
                            of "INFUSEOVERUNIT" :
                                    result_rec->obr[d.seq]->order_detail->infuseoverunit->value = od.oe_field_value
                            of "RATE" :
                                    result_rec->obr[d.seq]->order_detail->rate->value = od.oe_field_value
                            of "RXROUTE" :
                            		if(od.oe_field_value > 0) ;sometimes =-1
                                    	result_rec->obr[d.seq]->order_detail->rxroute->value = od.oe_field_value
                                    endif
                                    result_rec->obr[d.seq]->order_detail->rxroute->display = od.oe_field_display_value
                            of "TITRATEIND" :
                                    result_rec->obr[d.seq]->order_detail->titrateind->value = od.oe_field_value
                            of "NEXTDOSEDTTM" :
                                    map_to_obx = 1
                            of "TOTALVOLUME" :
                                    map_to_obx = 1
                                    result_rec->obr[d.seq]->order_detail->totalvolume->display = od.oe_field_display_value
 
                            of "PRNREASON" :
                                    result_rec->obr[d.seq]->order_detail->prnreason->value = od.oe_field_value
                                    result_rec->obr[d.seq]->order_detail->prnreason->display = od.oe_field_display_value
                            of "PRNINSTRUCTIONS" :
                                    map_to_obx = 1
                            of "SCH/PRN" :
                                    result_rec->obr[d.seq]->order_detail->prn_ind = od.oe_field_value
                            of "FREETEXTRATE" :
                                    result_rec->obr[d.seq]->order_detail->freetextrate->display = od.oe_field_display_value
                            of "REPLACEEVERY" :
                                    result_rec->obr[d.seq]->order_detail->replaceevery->id = od.oe_field_id
                                    result_rec->obr[d.seq]->order_detail->replaceevery->display = od.oe_field_display_value
                            of "REPLACEEVERYUNIT" :
                                    result_rec->obr[d.seq]->order_detail->replaceeveryunit->value = od.oe_field_value
                                    result_rec->obr[d.seq]->order_detail->replaceeveryunit->display = od.oe_field_display_value
                            of "FREETEXTORD" :
                                    map_to_obx = 1
                            of "STOPTYPE" :
                                    map_to_obx = 1
                            of "PREGNANT" :
                                    map_to_obx = 1
                            of "PTHASIV" :
                                    map_to_obx = 1
                            of "CONSTANTIND" :
                                    map_to_obx = 1
                            of "ORDERPRICE" :
                                    map_to_obx = 1
                            of "ORDERCOST" :
                                    map_to_obx = 1
                            of "PRICESCHEDULE" :
                                    map_to_obx = 1
                            of "PARDOSES" :
                                    map_to_obx = 1
                            of "PASSMEDIND" :
                                    map_to_obx = 1
                            ;of "DONTPRINTRXREASON" : inbound the sending app determines this value
                            ;        map_to_obx = 1
                            of "DISPENSECATEGORY" :
                                    result_rec->obr[d.seq]->order_detail->dispense_category->value = od.oe_field_value
                            of "DISPENSEFROMLOC" :
                                    map_to_obx = 1 ;change this back to 1
                            of "TOTALDISPENSEDOSES" :
                                    map_to_obx = 1
                            of "RXPRIORITY" :
                                    result_rec->obr[d.seq]->order_detail->rxpriority->value = od.oe_field_value
                                    map_to_obx = 1
                            of "NBROFBAGS" :
                                   ; if( od.oe_field_value > 1 )
                                        map_to_obx = 1
                                   ; endif
                            of "DISPENSEQTY" :
                                    result_rec->obr[d.seq]->order_detail->disp_qty->value = od.oe_field_value
                            of "DISPENSEQTYUNIT" :
                                    result_rec->obr[d.seq]->order_detail->disp_qty_unit->value = od.oe_field_value
                            of "NBRREFILLS" :
                                    result_rec->obr[d.seq]->order_detail->nbr_of_refills->value = od.oe_field_value
                            of "RXQTY" :
                                    result_rec->obr[d.seq]->order_detail->rx_qty->value = od.oe_field_value
                            of "INDICATION" :
                                    result_rec->obr[d.seq]->order_detail->indication->display = od.oe_field_display_value
                                        map_to_obx = 1
                            of "SIG" :
                                    result_rec->obr[d.seq]->order_detail->sig->display = od.oe_field_display_value
                            of "DAW" :
                                    result_rec->obr[d.seq]->order_detail->daw->value = od.oe_field_value
                                    result_rec->obr[d.seq]->order_detail->daw->display = od.oe_field_display_value
 
                             of "VOLUMEDOSE":
                                    result_rec->obr[d.seq]->order_detail->volume = od.oe_field_value
                             of "VOLUMEDOSEUNIT":
                                    result_rec->obr[d.seq]->order_detail->volume_unit = od.oe_field_value
                             of "STRENGTHDOSE":
                                    result_rec->obr[d.seq]->order_detail->strength = od.oe_field_value
                             of "STRENGTHDOSEUNIT":
                                    result_rec->obr[d.seq]->order_detail->strength_unit = od.oe_field_value
 
 
                             of "REPPRI":
                                result_rec->obr[d.seq]->order_detail->report_prior_cd  = od.OE_FIELD_VALUE
                             of "REFERPHYS":
                                result_rec->obr[d.seq]->order_detail->referphys_id     = od.OE_FIELD_VALUE
                             of "SCHEDDTTM":
                                result_rec->obr[d.seq]->order_detail->sched_dt_tm      = od.OE_FIELD_DT_TM_VALUE
                             of "SPECRECDDATETIME":
                                result_rec->obr[d.seq]->order_detail->specrec_dt_tm    = od.OE_FIELD_DT_TM_VALUE
                             of "SPECRECDBY":
                                result_rec->obr[d.seq]->order_detail->specrecby_id     = od.OE_FIELD_VALUE
                             of "COLLBY":
                                result_rec->obr[d.seq]->order_detail->collby_id        = od.OE_FIELD_VALUE
                             of "COLLPRI":
                                result_rec->obr[d.seq]->order_detail->collect_prior_cd = od.OE_FIELD_VALUE
                             of "BODYSITE":
                                result_rec->obr[d.seq]->order_detail->bodysite_cd      = od.OE_FIELD_VALUE
                                result_rec->obr[d.seq]->order_detail->bodysite_text    = od.OE_FIELD_DISPLAY_VALUE
                             of "PERFORMLOC":
                                result_rec->obr[d.seq]->order_detail->performloc_cd    = od.OE_FIELD_VALUE
                                result_rec->obr[d.seq]->order_detail->performloc_disp  = od.OE_FIELD_DISPLAY_VALUE  ;MV added
                             of "ORDERLOC":
                                result_rec->obr[d.seq]->order_detail->orderloc_cd      = od.OE_FIELD_VALUE
                             of "COLLMETHOD":
                                result_rec->obr[d.seq]->order_detail->collmeth_cd      = od.OE_FIELD_VALUE
                             of "QUANTITY":
                                result_rec->obr[d.seq]->order_detail->quantity         = od.OE_FIELD_VALUE
                             of "FREETEXTPHYS":
                                result_rec->obr[d.seq]->order_detail->freetextphys_id  = od.OE_FIELD_VALUE
                             of "RENDPHYS":
                                result_rec->obr[d.seq]->order_detail->rendphys_id      = od.OE_FIELD_VALUE
 
                             of "COLLECTEDYN":
                                result_rec->obr[d.seq]->order_detail->collected_ind    = od.OE_FIELD_VALUE
                                result_rec->obr[d.seq]->order_detail->collected_ind_ind = 1
                             of "SOURCECMNT":
                                result_rec->obr[d.seq]->order_detail->sourcecmnt       = od.OE_FIELD_DISPLAY_VALUE
                             of "ACCESSION":
                                result_rec->obr[d.seq]->order_detail->accession_ind = 1
                             of "ACCESSION ID":
                                result_rec->obr[d.seq]->order_detail->accession_ind = 1
                             of "REASONFOREXAM":
                                result_rec->obr[d.seq]->order_detail->reasonforexam    = od.OE_FIELD_DISPLAY_VALUE
                             of "SPECIMENDESC":
                                result_rec->obr[d.seq]->order_detail->specimen_desc    = od.OE_FIELD_DISPLAY_VALUE
                             of "CONNECTEDORDERID":
                                result_rec->obr[d.seq]->order_detail->connected_order_id = od.OE_FIELD_VALUE
 
                             of "ISOLATIONCODE":
                                result_rec->obr[d.seq]->order_detail->isolation_cd     = od.OE_FIELD_VALUE
                                result_rec->obr[d.seq]->order_detail->isolation_text   = od.OE_FIELD_DISPLAY_VALUE
                             of "SPECIMEN TYPE":
                                result_rec->obr[d.seq]->order_detail->specimen_type_cd = od.OE_FIELD_VALUE
                             of "LBLCMNT":
                                result_rec->obr[d.seq]->order_detail->labelcomment     = od.OE_FIELD_DISPLAY_VALUE
                             of "TRANSPORTMODE":
                                result_rec->obr[d.seq]->order_detail->transportmode_cd = od.OE_FIELD_VALUE
                             of "NURSECOLLECT":
                                result_rec->obr[d.seq]->order_detail->nursecollect_ind = od.OE_FIELD_VALUE
                                result_rec->obr[d.seq]->order_detail->nursecollect_ind_ind = 1
 
 
                             of "FREETXTDOSE":
                                result_rec->obr[d.seq]->order_detail->freetext_dose      = od.OE_FIELD_DISPLAY_VALUE
                             of "PRIORITY":
                                result_rec->obr[d.seq]->order_detail->priority_cd      = od.OE_FIELD_VALUE
                             of "FREQ":
                                result_rec->obr[d.seq]->order_detail->freq_cd          = od.OE_FIELD_VALUE
                                result_rec->obr[d.seq]->order_detail->freq_disp        = od.OE_FIELD_DISPLAY_VALUE
                             of "DURATION":
                                result_rec->obr[d.seq]->order_detail->duration         = od.OE_FIELD_VALUE
                             of "DURATIONUNIT":
                                result_rec->obr[d.seq]->order_detail->duration_unit_cd = od.OE_FIELD_VALUE
                                result_rec->obr[d.seq]->order_detail->duration_unit_disp = od.OE_FIELD_DISPLAY_VALUE
                             of "SPECINX":
                                result_rec->obr[d.seq]->order_detail->specinx          =
                                	trim(replace(od.OE_FIELD_DISPLAY_VALUE,char(13)," ",0))
                             of "CANCELREASON":
                                result_rec->obr[d.seq]->order_detail->cancelreason     = od.OE_FIELD_DISPLAY_VALUE
                                result_rec->obr[d.seq]->order_detail->cancelreason_cd  = od.OE_FIELD_VALUE
                             of "SUSPENDREASON":
                                result_rec->obr[d.seq]->order_detail->suspendreason    = od.OE_FIELD_DISPLAY_VALUE
                                result_rec->obr[d.seq]->order_detail->suspendreason_cd = od.OE_FIELD_VALUE
                             of "RESUMEREASON":
                                result_rec->obr[d.seq]->order_detail->resumereason     = od.OE_FIELD_DISPLAY_VALUE
                                result_rec->obr[d.seq]->order_detail->resumereason_cd  = od.OE_FIELD_VALUE
                             of "DCREASON":
                                result_rec->obr[d.seq]->order_detail->dcreason         = od.OE_FIELD_DISPLAY_VALUE
                                result_rec->obr[d.seq]->order_detail->dcreason_cd      = od.OE_FIELD_VALUE
                             of "PRINTDEANUMBER":
                                result_rec->obr[d.seq]->order_detail->printdeanbr_cd      = od.OE_FIELD_VALUE
                                if(result_rec->obr[d.seq]->order_detail->printdeanbr_cd > 0) ;only send if yes, otherwise always
																							 ;posts as field_value=1
                                	result_rec->obr[d.seq]->order_detail->printdeanbr         = od.OE_FIELD_DISPLAY_VALUE
                                endif
                                           ; map_to_obx = 1
                             of "TOTALREFILLS":
                                            map_to_obx = 1
                             of "PHYSICIANADDRESSID":
                                            map_to_obx = 1
                             of "ORDEROUTPUTDEST":
                                            map_to_obx = 1
                             of "STOPDTTM":
                            	result_rec->obr[d.seq]->order_detail->stop_dt_tm = od.OE_FIELD_DT_TM_VALUE
 
                            of "OTHER" :
                                    if( oef.field_type_flag >= 0 and oef.field_type_flag <= 7)
                                            map_to_obx = 1
                                    endif
                            else
								if (od.oe_field_meaning = "REQSTARTDTTM"
								  and o.order_status_cd = dcstatusCD
								  and o.last_action_sequence = od.action_sequence)
								  	result_rec->obr[d.seq]->order_detail->dc_dt_tm = od.oe_field_dt_tm_value
								 endif
                                    if ( oef.fsi_map_to_obx_ind = 1 )
                                            map_to_obx = 1
                                    endif
                    endcase
 
                    if ( map_to_obx = 1 )
 
                            found_idx = 0
                            temp_idx = 0
 
                            for ( temp_idx = 1 to i )
                                    if ( result_rec->obr[d.seq]->order_detail->obx_detail[ temp_idx ]->obs_id = od.oe_field_id )
                                            found_idx = temp_idx
                                    endif
                            endfor
 
                            if ( found_idx = 0 )
                                    i = i + 1
                                    if ( mod( i , 10 ) = 1 )
                                            stat = alterlist( result_rec->obr[d.seq]->order_detail->obx_detail , i + 9 )
                                    endif
 
                                    temp_idx = i
                                    result_rec->obr[d.seq]->order_detail->obx_detail[ temp_idx ]->obs_id = od.oe_field_id
                                    result_rec->obr[d.seq]->order_detail->obx_detail[ temp_idx ]->units_id = " "
                                    result_rec->obr[d.seq]->order_detail->obx_detail[ temp_idx ]->units_text = ""
                                    result_rec->obr[d.seq]->order_detail->obx_detail[ temp_idx ]->obs_value_count = 1
 
                                    ;special logic
 
;declare v_URL = f8 with public,constant(uar_get_code_by("MEANING", 25,"URL"))
 
                            else
                                    temp_idx = found_idx
                                    result_rec->obr[d.seq]->order_detail->obx_detail[ temp_idx ]->obs_value_count =
                                            result_rec->obr[d.seq]->order_detail->obx_detail[ temp_idx ]->obs_value_count + 1
                            endif
 
                            qual_idx = result_rec->obr[d.seq]->order_detail->obx_detail[ temp_idx ]->obs_value_count
                            stat = alterlist( result_rec->obr[d.seq]->order_detail->obx_detail[ temp_idx ]->obs_value , qual_idx )
 
                            case( oef.field_type_flag )
                                 of 0  :
                                         result_rec->obr[d.seq]->order_detail->obx_detail[ temp_idx ]->value_type = "ST"
                               result_rec->obr[d.seq]->order_detail->obx_detail[ temp_idx ]->obs_value[ qual_idx ]->value =
                                                 od.oe_field_display_value
                                 of 12  :
                                         result_rec->obr[d.seq]->order_detail->obx_detail[ temp_idx ]->value_type = "ST"
                               result_rec->obr[d.seq]->order_detail->obx_detail[ temp_idx ]->obs_value[ qual_idx ]->value =
                                                 od.oe_field_display_value
                                 of 1 :
                                         result_rec->obr[d.seq]->order_detail->obx_detail[ temp_idx ]->value_type = "NM"
                                    result_rec->obr[d.seq]->order_detail->obx_detail[ temp_idx ]->obs_value[ qual_idx ]->value =
                                                 trim( cnvtstring( od.oe_field_value , 20, 0 ) )
                                 of 2 :
                                         result_rec->obr[d.seq]->order_detail->obx_detail[ temp_idx ]->value_type = "NM"
                                         if( size(trim( od.oe_field_display_value )) > 0 )
                                     result_rec->obr[d.seq]->order_detail->obx_detail[ temp_idx ]->obs_value[ qual_idx ]->value =
                                                 trim( od.oe_field_display_value )
                                         else
                                     result_rec->obr[d.seq]->order_detail->obx_detail[ temp_idx ]->obs_value[ qual_idx ]->value =
                                                 trim(cnvtstring(od.oe_field_value,20,6,L))
                                         endif
                                 of 3 :
                                         result_rec->obr[d.seq]->order_detail->obx_detail[ temp_idx ]->value_type = "TS" ;ws DT
                                    result_rec->obr[d.seq]->order_detail->obx_detail[ temp_idx ]->obs_value[ qual_idx ]->value =
                                                 format(cnvtdatetime( od.oe_field_dt_tm_value) , "MM/DD/YY;3;D" )
                                                 ;format(cnvtdatetime( od.oe_field_dt_tm_value) , "YYYYMMDD;3;D" )
                                 of 4 :
                                         result_rec->obr[d.seq]->order_detail->obx_detail[ temp_idx ]->value_type = "TM"
                                    result_rec->obr[d.seq]->order_detail->obx_detail[ temp_idx ]->obs_value[ qual_idx ]->value =
                                                 format(cnvtdatetime( od.oe_field_dt_tm_value) , "HHMMSS;3;D" )
                                 of 5 :
                                         result_rec->obr[d.seq]->order_detail->obx_detail[ temp_idx ]->value_type = "TS";ws TS
                                     result_rec->obr[d.seq]->order_detail->obx_detail[ temp_idx ]->obs_value[ qual_idx ]->value =
                                                 format(cnvtdatetime( od.oe_field_dt_tm_value) , "MM/DD/YY HH:MM;3;D" )
                                                 ;format(cnvtdatetime( od.oe_field_dt_tm_value) , "YYYYMMDDHHMMSS;3;D" )
                                 of 6 :
                                         result_rec->obr[d.seq]->order_detail->obx_detail[ temp_idx ]->value_type = "IS"
                                     result_rec->obr[d.seq]->order_detail->obx_detail[ temp_idx ]->obs_value[ qual_idx ]->value =
                                                  build(od.oe_field_value)
                                 of 7 :
                                         result_rec->obr[d.seq]->order_detail->obx_detail[ temp_idx ]->value_type = "ID"
                                         if ( od.oe_field_value = 0 )
                                result_rec->obr[d.seq]->order_detail->obx_detail[ temp_idx ]->obs_value[ qual_idx ]->value = "N"
                                         else
                                result_rec->obr[d.seq]->order_detail->obx_detail[ temp_idx ]->obs_value[ qual_idx ]->value = "Y"
                                         endif
                            endcase
                    endif
            endif
 	foot od.order_id
            result_rec->obr[d.seq]->order_detail->obx_detail_count = i
          stat = alterlist( result_rec->obr[d.seq]->order_detail->obx_detail ,
                    result_rec->obr[d.seq]->order_detail->obx_detail_count )
 
           if(result_rec->obr[d.seq]->order_detail->stop_dt_tm <=0)
                 result_rec->obr[d.seq]->order_detail->stop_dt_tm =
                      result_rec->obr[d.seq]->projected_stop_dt_tm
           endif
    with nocounter
 
    free set map_to_obx
 
 call echo ("Exiting fill_order_detail_cache_glb")
	return (1)
end
 
 
subroutine GetAliases( dummy )
 
 
		select  into "nl:" o.*
		 from ;orders o, order_action oa,
		(dummyt d with seq = value(size(result_rec->obr,5)))
		, (dummyt   d1  with seq = 1)
		,code_value_alias cva
		,dummyt   d2
		,code_value_alias cva2
		,dummyt   d3
		,code_value_alias cva3
		,dummyt   d4
		,code_value_alias cva4
		,dummyt   d5
		,code_value_alias cva5
		/*,dummyt   d6
		,code_value_alias cva6
		,dummyt   d7
		,code_value_alias cva7
		,dummyt   d8
		,code_value_alias cva8
		,dummyt   d9
		,code_value_alias cva9
		,dummyt   d10*/
		plan d where maxrec(d1,size(result_rec->obr[d.seq].event_list,5))
		join d1
		join cva
		where cva.code_value = result_rec->obr[d.seq]->order_detail->isolation_cd
		and cva.contributor_source_cd = dDefContSrcCd
		join d2
		join cva2
		where cva2.code_value = result_rec->obr[d.seq]->order_detail->specimen_type_cd
		and cva2.contributor_source_cd = dDefContSrcCd
		join d3
		join cva3
		where cva3.code_value = result_rec->obr[d.seq]->order_detail->bodysite_cd
		and cva3.contributor_source_cd = dDefContSrcCd
		join d4
		join cva4
		where cva4.code_value = result_rec->obr[d.seq]->order_detail->collmeth_cd
		and cva4.contributor_source_cd = dDefContSrcCd
		join d5
		join cva5
		where cva5.code_value = result_rec->obr[d.seq]->activity_type_cd
		and cva5.contributor_source_cd = dDefContSrcCd
		detail
 
            /*result_rec->obr[d.seq]->order_detail->isolation_cd
            result_rec->obr[d.seq]->order_detail->specimen_type_cd
            result_rec->obr[d.seq]->order_detail->bodysite_cd
            result_rec->obr[d.seq]->order_detail->collmeth_cd
            result_rec->obr[d.seq]->order_detail->activity_type_cd
            result_rec->obr[d.seq]->order_detail->result_status_cd
            result_rec->obr[d.seq]->order_detail->collect_prior_cd
            result_rec->obr[d.seq]->order_detail->transportmode_cd  */
            if(trim(cva.alias)="" and cva.code_value>0)
            	result_rec->obr[d.seq]->order_detail->isolation_alias       = build("CD:",cva.code_value)
            else
            	result_rec->obr[d.seq]->order_detail->isolation_alias       = trim(cva.alias)
            endif
            if(trim(cva2.alias)="" and cva2.code_value>0)
            	result_rec->obr[d.seq]->order_detail->specimen_type_alias       = build("CD:",cva2.code_value)
            else
            	result_rec->obr[d.seq]->order_detail->specimen_type_alias       = trim(cva2.alias)
            endif
            if(trim(cva3.alias)="" and cva3.code_value>0)
            	result_rec->obr[d.seq]->order_detail->bodysite_alias       = build("CD:",cva3.code_value)
            else
            	result_rec->obr[d.seq]->order_detail->bodysite_alias       = trim(cva3.alias)
            endif
            if(trim(cva4.alias)="" and cva4.code_value>0)
            	result_rec->obr[d.seq]->order_detail->collmeth_alias       = build("CD:",cva4.code_value)
            else
            	result_rec->obr[d.seq]->order_detail->collmeth_alias       = trim(cva4.alias)
            endif
            if(trim(cva5.alias)="" and cva5.code_value>0)
            	result_rec->obr[d.seq]->activity_type_alias       = build("CD:",cva5.code_value)
            else
            	result_rec->obr[d.seq]->activity_type_alias       = trim(cva5.alias)
            endif
 		with nocounter,outerjoin=d1,outerjoin=d2,outerjoin=d3,outerjoin=d4,outerjoin=d5,;outerjoin=d6,outerjoin=d7,outerjoin=d8,
        	dontcare=cva,dontcare=cva2,dontcare=cva3,dontcare=cva4,dontcare=cva5;,dontcare=cva6
 
end
 
subroutine fill_obr_dg1( dummy )
 
 call echo ("Entering fill_obr_dg1")
   SELECT into "nl:"
      table_ind = decode(n.seq, "n", d.seq, "d", "x" ),
      er.*,
      n.NOMENCLATURE_ID,
      n.SOURCE_VOCABULARY_CD,
      n.SOURCE_IDENTIFIER,
      n.SOURCE_STRING;,
     ; d.DIAGNOSIS_ID,
      ;d.DIAG_FTDESC
 
   from NOMEN_ENTITY_RELTN er, NOMENCLATURE n, DIAGNOSIS d,
   (dummyt d1 with seq = value(size(upload->enc,5)))
		, (dummyt   d2  with seq = 1),
        (dummyt d3 with seq = 1)
        ,(dummyt d4 with seq = 1)
 
	plan d1 where maxrec(d2,size(upload->enc[d1.seq].event_ord_list,5))
		join d2
   join er
        where er.ACTIVE_IND > 0
              AND er.PARENT_ENTITY_NAME = "ORDERS"
              AND er.PARENT_ENTITY_ID = upload->enc[d1.seq].event_ord_list[d2.seq]->order_id
              AND ( er.RELTN_TYPE_CD = dDiagCd
                    OR er.RELTN_TYPE_CD = dICD9Cd )
 
   join d3
   join ( n
          where er.NOMENCLATURE_ID > 0
                AND n.NOMENCLATURE_ID = er.NOMENCLATURE_ID )
   orjoin d4
   join ( d
          where er.NOMENCLATURE_ID <= 0
                AND er.CHILD_ENTITY_NAME = "DIAGNOSIS"
                AND d.DIAGNOSIS_ID = er.CHILD_ENTITY_ID )
 
    order by d1.seq,d2.seq
    head report
 
 		i_cnt=0
  		head d1.seq
 		xx=0
 		head d2.seq
 		i = 0
 
	 		i_cnt= i_cnt +1
   detail
 
      ;call echo(build("upload->order_id = ", upload->enc[d1.seq].event_ord_list[d2.seq]->order_id))
      ;call echo(build("er.PARENT_ENTITY_ID = ", er.PARENT_ENTITY_ID))
      ;call echo(build("er.NOMENCLATURE_ID = ", er.NOMENCLATURE_ID))
      ;call echo(build("er.RELTN_TYPE_CD   = ", er.RELTN_TYPE_CD))
 	if(er.PARENT_ENTITY_ID)
      case( table_ind )
      of "n":
         ;call echo(build("n.NOMENCLATURE_ID = ", n.NOMENCLATURE_ID))
 
         i = i + 1
         stat = alterlist(result_rec->obr[i_cnt]->dg1,i)
         result_rec->obr[i_cnt]->dg1[i]->nomenclature_id      = n.NOMENCLATURE_ID
         result_rec->obr[i_cnt]->dg1[i]->source_vocabulary_cd = n.SOURCE_VOCABULARY_CD
         result_rec->obr[i_cnt]->dg1[i]->source_string        = trim(n.SOURCE_STRING,3)
         result_rec->obr[i_cnt]->dg1[i]->source_identifier    = trim(n.SOURCE_IDENTIFIER,3)
         result_rec->obr[i_cnt]->dg1[i]->reltn_type_cd        = er.RELTN_TYPE_CD
 
      of "d":
         ;call echo(build("d.DIAGNOSIS_ID     = ", d.DIAGNOSIS_ID))
 
         i = i + 1
         stat = alterlist(result_rec->obr[i_cnt]->dg1,i)
         result_rec->obr[i_cnt]->dg1[i]->diag_ftdesc   = trim(d.DIAG_FTDESC,3)
         result_rec->obr[i_cnt]->dg1[i]->reltn_type_cd = er.RELTN_TYPE_CD
 
      of "x":
         call echo(build("WARNING!! Did NOT join to either NOMENCLATURE or DIAGNOSIS tables for ORDER_ID = "
         ,upload->enc[d1.seq].event_ord_list[d2.seq]->order_id))
 
      endcase
 	endif
   with nocounter, outerjoin = d2, outerjoin = d3,dontcare=er
	call echo("Exiting fill_obr_dg1")
end
 

