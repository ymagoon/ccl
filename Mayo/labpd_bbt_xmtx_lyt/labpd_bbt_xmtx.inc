record xm
( 1 prod_qual[*]
    2 product_id            = f8
    2 product_cd            = f8
    2 product_disp          = vc
    2 product_cat_cd        = f8
    2 product_cat_disp	    = vc
    2 order_provider_id     = f8
    2 order_provider_name   = vc
    2 bb_result_id          = f8
    2 xm_cnt                = i4
    2 transfuse_cnt         = i4
    2 owner_area_disp       = vc
    2 inv_area_disp         = vc
    2 med_service_cd        = f8
)
record output
( 1 out[*]
	2 owner_area		          = vc
	2 inventory_area	        = vc
	2 product_category 	      = vc
	2 product_type		        = vc
	2 xm_cnt			            = i4
	2 trx_cnt			            = i4
	2 ct_ratio			          = f8
	2 doc_name			          = vc
	2 medical_service	        = vc
)
