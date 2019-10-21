declare json = vc go

set json = '{"loc_request":\
				{\
					"locations": [\
						{"location_cd":2858561805.0},\
						{"location_cd":2861425283.0}\
					],\
					"skip_org_security_ind":1,\
					"skip_fill_reply_ind":0\
				}\
			}' go 

execute mp_dcp_get_loc_prnt_hierarchy "MINE", json go

