drop program labpd_bbt_xmtx_drv:dba go
create program labpd_bbt_xmtx_drv:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Start date time" = ""
	, "End date time" = ""
	, "Ordering Physician" = 0
	, "Owner Area" = 0
	, "Inventory Area" = 0
	, "Product Category" = 0
	, "Medical Service" = 0
 
with OUTDEV, begin_dt_tm, end_dt_tm, ord_phys_id, owner_area, inventory_area,
	product_category, medical_service
 
declare crossmatch_event_cd = f8
declare dispense_event_cd   = f8
declare transfuse_event_cd  = f8
declare prod_cnt            = i4 with noconstant(0)
declare prod_perc 			    = f8 with noconstant(0)
declare out_cnt 			      = i4 with noconstant(0)
 
set stat = uar_get_meaning_by_codeset(1610,"3",1,crossmatch_event_cd)
set stat = uar_get_meaning_by_codeset(1610,"4",1,dispense_event_cd)
set stat = uar_get_meaning_by_codeset(1610,"7",1,transfuse_event_cd)
 
%i labpd_bbt_xmtx.inc
 
if ($ord_phys_id != NULL)
  set ord_phys_string = 1
else
  set ord_phys_string = 0
endif
if (parameter(5,1) > 0.0)
	set owner_area_string = 1
else
	set owner_area_string = 0
endif
if (parameter(6,1) > 0.0)
	set inventory_area_string = 1
else
	set inventory_area_string = 0
endif
if (parameter(7,1) > 0.0)
	set product_category_string = 1
else
	set product_category_string = 0
endif
if (parameter(8,1) > 0.0)
	set medical_service_string = 1
else
	set medical_service_string = 0
endif
 
select into "nl:"
from   crossmatch xm,
       product_event pe,
       product p,
       orders o,
       prsnl pl,
       product_event pe_alt,
       encounter en
plan xm where xm.crossmatch_exp_dt_tm    >= cnvtdatetime($begin_dt_tm)
          and xm.crossmatch_exp_dt_tm    <= cnvtdatetime($end_dt_tm)
join pe where pe.product_event_id = xm.product_event_id
join p  where p.product_id = pe.product_id
	        and ((owner_area_string = 1 and p.cur_owner_area_cd in ($owner_area))
		       or  (owner_area_string = 0))
	        and ((inventory_area_string = 1 and p.cur_inv_area_cd in ($inventory_area))
		       or  (inventory_area_string = 0))
	        and ((product_category_string = 1 and p.product_cat_cd in ($product_category))
           or  (product_category_string = 0))
join o  where o.order_id = pe.order_id
          and ((ord_phys_string = 1 and o.last_update_provider_id = $ord_phys_id)
           or  (ord_phys_string = 0 and 1 = 1))
join pl where pl.person_id = o.last_update_provider_id
join pe_alt where pe_alt.bb_result_id = pe.bb_result_id
              and pe_alt.event_type_cd = crossmatch_event_cd
join en where en.encntr_id = o.encntr_id
	        and ((medical_service_string = 1 and en.med_service_cd in ($medical_service))
		       or  (medical_service_string = 0))
order pe.bb_result_id, pe_alt.product_id, pe_alt.product_event_id DESC
head report
	xm_found = 0
	first_product_cd = 0
head pe.bb_result_id
	xm_found = 0
	first_product_id = pe_alt.product_id
detail
  if (xm_found = 0 and pe_alt.product_id = first_product_id) ;if it isn't the first, it isn't the parent
    if (p.product_id = pe_alt.product_id)                      ;product who's xm expiration qualified is the parent, skip children
        if (xm.product_event_id = pe_alt.product_event_id)     ;qualify latest xm product_event, skip the rest
            xm_found = 1
            prod_cnt = prod_cnt + 1
            if (size(xm->prod_qual, 5) < prod_cnt)
                stat = alterlist(xm->prod_qual,prod_cnt + 10)
            endif
            xm->prod_qual[prod_cnt].product_id 		      = p.product_id
            xm->prod_qual[prod_cnt].product_cd 		      = p.product_cd
  		      xm->prod_qual[prod_cnt].product_disp 		    = uar_get_code_display(p.product_cd)
            xm->prod_qual[prod_cnt].bb_result_id 		    = pe.bb_result_id
            xm->prod_qual[prod_cnt].order_provider_id   = o.last_update_provider_id
            xm->prod_qual[prod_cnt].order_provider_name = trim(pl.name_full_formatted)
            xm->prod_qual[prod_cnt].product_cat_cd 	    = p.product_cat_cd
            xm->prod_qual[prod_cnt].product_cat_disp    = uar_get_code_display(p.product_cat_cd)
            xm->prod_qual[prod_cnt].xm_cnt              = 1
            xm->prod_qual[prod_cnt].owner_area_disp     = uar_get_code_display(p.cur_owner_area_cd)
            xm->prod_qual[prod_cnt].inv_area_disp       = uar_get_code_display(p.cur_inv_area_cd)
            xm->prod_qual[prod_cnt].med_service_cd      = en.med_service_cd
        endif
    endif
  endif
with nocounter
 
select into "nl:"
from  (dummyt d1 with seq = value(prod_cnt)),
        product_event pe_xm,
        product_event pe_disp,
        product_event pe_tx
plan d1
join pe_xm   where pe_xm.bb_result_id = xm->prod_qual[d1.seq].bb_result_id
               and pe_xm.event_type_cd = crossmatch_event_cd
join pe_disp where pe_disp.related_product_event_id = pe_xm.product_event_id
               and pe_disp.event_type_cd = dispense_event_cd
join pe_tx   where pe_tx.related_product_event_id = pe_disp.product_event_id
               and pe_tx.event_type_cd = transfuse_event_cd
               and pe_tx.active_ind = 1
order by pe_xm.bb_result_id
head pe_xm.bb_result_id
  if (pe_tx.product_event_id != 0)
    xm->prod_qual[d1.seq].transfuse_cnt = 1
  endif
with nocounter
 
if(prod_cnt > 0)
  select into $OUTDEV
		provider_name 	 = trim(xm->prod_qual[d1.seq].order_provider_name) "#####################################",
		provider_id 	   = xm->prod_qual[d1.seq].order_provider_id,
		prod_cd			     = xm->prod_qual[d1.seq].product_cd,
		prod_disp 	 	   = trim(xm->prod_qual[d1.seq].product_disp) "########################################",
		product_cat_disp = trim(xm->prod_qual[d1.seq].product_cat_disp) "#################################",
		owner_area_disp  = trim(xm->prod_qual[d1.seq].owner_area_disp) "####################################",
		inv_area_disp 	 = trim(xm->prod_qual[d1.seq].inv_area_disp) "########################################",
		med_service 	   = trim(uar_get_code_display(xm->prod_qual[d1.seq].med_service_cd)) "########################################"
  from (dummyt d1 with seq = value(prod_cnt))
	plan d1
	order by provider_name, provider_id, prod_disp, prod_cd, med_service, inv_area_disp
	head report
		prev_med_serv_cd 	    = xm->prod_qual[d1.seq].med_service_cd
		prev_inv_area_disp 	  = inv_area_disp
		prev_provider_disp 	  = provider_name
		prev_prod_disp 		    = prod_disp
		prev_med_service_disp = med_service
		prev_owner_area_disp  = owner_area_disp
		prev_product_cat_disp = product_cat_disp
		prod_xm_cnt 		      = 0.0
		prod_xm_trans_cnt 	  = 0.0
		prod_perc 			      = 0.0
		out_cnt 			        = 1
		stat = alterlist(output->out, 10)
	detail
		if ((prod_xm_cnt >= 1)
		  and ((xm->prod_qual[d1.seq].med_service_cd 		  != prev_med_serv_cd)
		  or   (xm->prod_qual[d1.seq].inv_area_disp 		  != prev_inv_area_disp)
		  or   (xm->prod_qual[d1.seq].order_provider_name != prev_provider_disp)
		  or   (xm->prod_qual[d1.seq].product_disp 		    != prev_prod_disp)))
        if (size(output->out, 5) < out_cnt)
          stat = alterlist(output->out,out_cnt + 10)
        endif
  			output->out[out_cnt].owner_area 	    = prev_owner_area_disp,
  			output->out[out_cnt].inventory_area   = prev_inv_area_disp,
  			output->out[out_cnt].product_category = prev_product_cat_disp,
  			output->out[out_cnt].product_type 	  = prev_prod_disp,
  			output->out[out_cnt].xm_cnt 		      = prod_xm_cnt,
  			output->out[out_cnt].trx_cnt 		      = prod_xm_trans_cnt,
  			if (prod_xm_trans_cnt = 0)
  				prod_perc = prod_xm_cnt
  			else
  				prod_perc = (prod_xm_cnt/prod_xm_trans_cnt)
  			endif
  			output->out[out_cnt].ct_ratio 		   = prod_perc,
  			output->out[out_cnt].doc_name 		   = prev_provider_disp,
  			output->out[out_cnt].medical_service = prev_med_service_disp,
  			prod_xm_cnt 	                       = 0
  			prod_xm_trans_cnt                    = 0
  			prod_perc 		                       = 0.00
  			out_cnt 		                         = out_cnt + 1
		endif
 
		prod_xm_cnt = prod_xm_cnt + xm->prod_qual[d1.seq].xm_cnt
		if (xm->prod_qual[d1.seq].bb_result_id >0)
			prod_xm_trans_cnt = prod_xm_trans_cnt + xm->prod_qual[d1.seq].transfuse_cnt
		endif
		prev_owner_area_disp  = owner_area_disp
		prev_med_serv_cd 	    = xm->prod_qual[d1.seq].med_service_cd
		prev_inv_area_disp 	  = inv_area_disp
		prev_provider_disp 	  = provider_name
		prev_prod_disp 		    = prod_disp
		prev_product_cat_disp = product_cat_disp
		prev_med_service_disp = med_service
	foot report
		stat = alterlist(output->out,out_cnt)
		output->out[out_cnt].owner_area 	    = owner_area_disp,
		output->out[out_cnt].inventory_area   = inv_area_disp,
		output->out[out_cnt].product_category = product_cat_disp,
		output->out[out_cnt].product_type 	  = prod_disp,
		output->out[out_cnt].xm_cnt 		      = prod_xm_cnt,
		output->out[out_cnt].trx_cnt 		      = prod_xm_trans_cnt,
		if (prod_xm_trans_cnt = 0)
		  prod_perc = prod_xm_cnt
		else
		  prod_perc = (prod_xm_cnt/prod_xm_trans_cnt)
		endif
		output->out[out_cnt].ct_ratio 		   = prod_perc,
		output->out[out_cnt].doc_name 		   = provider_name,
		output->out[out_cnt].medical_service = med_service
	with nocounter, format, separator=(^ ^)
endif
 
end
go
