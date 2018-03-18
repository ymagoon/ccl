free set ordersRec
record ordersRec
(
	1 orders_list[*]
		2 order_id                      = f8
		2 rx_ind                = i2
		2 mnemonic		        = vc
		2 clinical_display_line		= vc
		2 med_lines[*]								;pel
		  3 text = vc								;pel
		2 order_flag			= i1
		2 details[*]
			3 indication			= vc
			3 last_admin_dt_tm		= vc
			3 last_admin_date       = vc            ;pel
			3 last_admin_time       = vc            ;pel
			3 compliance_comments 	= vc
			3 comp_comment_lines[*]					;pel
			  4 text = vc							;pel
			3 compliance_status 	= vc
			3 order_comments 		= vc
			3 ord_comment_lines[*]					;pel
			  4 text = vc							;pel
)
 
 
 
 
 
 
 
 
 
 
 
 

