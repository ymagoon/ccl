 ;;Solution_Test/script/PathNet -- BB Transfusion/RELEASEPRODUCTS/bbt_chg_event_release_req.inc Turn on black mode

 
 
record req225065
(
  1 ProductList[*]
    2 product_id            = f8
    2 rel_assign_flag       = vc
    2 rel_xmatch_flag       = vc
    2 product_type          = vc
    2 p_updt_cnt            = i4
    2 der_updt_cnt          = i4
    2 pe_as_updt_cnt        = i4
    2 release_qty           = i4
    2 release_iu            = i4
    2 release_reason_cd     = f8
    2 assgn_prod_event_id   = f8
    2 keep_lock_ind         = i2
    2 as_updt_cnt           = i4
    2 rel_in_progress_flag  = vc
)
 
;Declare Subroutines
declare BB_ReleaseProducts (no_param = i2 (value)) = i2
 
subroutine BB_ReleaseProducts (no_param)
 
	select into "nl:"
	from PRODUCT_EVENT pe, PRODUCT p
	plan pe where pe.order_id = Request->order_id
                  and pe.active_ind = 1
	join p where p.product_id = pe.product_id
 
	head report
		cnt = 0
	detail
 
		if(trim(uar_get_code_meaning(pe.event_type_cd)) = "16")
			cnt = cnt + 1
			if (size(req225065->ProductList, 5) <= cnt)
				stat = alterlist(req225065->ProductList, cnt + 10)
			endif
			if(trim(uar_get_code_meaning(p.product_class_cd)) = "BLOOD")
				req225065->ProductList[cnt]->product_type        = "B"
			endif
 
			req225065->ProductList[cnt]->product_id			   = pe.product_id
			req225065->ProductList[cnt]->rel_assign_flag       = "F"
			req225065->ProductList[cnt]->rel_xmatch_flag       = "F"
			req225065->ProductList[cnt]->p_updt_cnt            = p.updt_cnt
			req225065->ProductList[cnt]->der_updt_cnt          = 0
			req225065->ProductList[cnt]->pe_as_updt_cnt        = pe.updt_cnt
			req225065->ProductList[cnt]->release_qty           = 0
			req225065->ProductList[cnt]->release_iu            = 0
			req225065->ProductList[cnt]->release_reason_cd     = 0
			req225065->ProductList[cnt]->assgn_prod_event_id   = pe.product_event_id
			req225065->ProductList[cnt]->keep_lock_ind         = 0
			req225065->ProductList[cnt]->as_updt_cnt           = 0
			req225065->ProductList[cnt]->rel_in_progress_flag  = "T"
		endif
	foot report
		stat = alterlist(req225065->ProductList, cnt)
	with nocounter
 
	if(curqual != 0)
		execute bbt_chg_event_release with replace("REQUEST", "REQ225065"), replace("REPLY", "REP225065")
	endif
	return(0)
end

;Generated by GNU enscript 1.6.4.
