free set patientRec
record patientRec
(
	1 name            = vc
  	1 room            = c40
  	1 bed             = c40
  	1 mrn             = vc
  	1 fin             = vc
  	1 dob             = c12
  	1 age             = c12
  	1 gender          = c40
  	1 height          = vc
  	1 weight          = vc
  	1 admit_phy_name  = vc
)
 
free set allergy
record allergy
(
	1 data[*]
	  2 person_id     = f8
	  2 encntr_id     = f8
	  2 details[*]
	    3 allergy_id          = f8
	    3 allergy_instance_id = f8
	    3 nomenclature_id     = f8
	    3 description         = vc
)
 
 
 
 

