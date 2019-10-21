declare json = vc go
set json = '{\
	"best_encntr_request": {\
		"persons": [\
			{\
				"person_id": 18691566.00\
			},\
			{\
				"person_id": 733624.00\
			},\
			{\
				"person_id": 733639.00\
			},\
			{\
				"person_id": 733757.00\
			},\
			{\
				"person_id": 733755.00\
			},\
			{\
				"person_id": 733762.00\
			},\
			{\
				"person_id": 733868.00\
			},\
			{\
				"person_id": 733696.00\
			},\
			{\
				"person_id": 733801.00\
			},\
			{\
				"person_id": 733823.00\
			},\
			{\
				"person_id": 92110955.00\
			}\
		],\
		"encntr_type_cds": [\
			{\
				"encntr_type_cd": 12345.00\
			},\
			{\
				"encntr_type_cd": 309308.00\
			},\
			{\
				"encntr_type_cd": 309309.00\
			},\
			{\
				"encntr_type_cd": 12345.00\
			}\
		],\
		"providers": [\
			{\
				"provider_id": 36483431.00\
			},\
			{\
				"provider_id": 55770216.00\
			},\
			{\
				"provider_id": 18669126.00\
			},\
			{\
				"provider_id": 12345.00\
			}\
		],\
		"epr_reltn_types": [\
			{\
				"reltn_type_cd": 744137.00\
			},\
			{\
				"reltn_type_cd": 1125.00\
			},\
			{\
				"reltn_type_cd": 747130.00\
			}\
		]\
	}\
}' go
 
execute mp_dcp_dwl_get_best_encntr "MINE", json go
