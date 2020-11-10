DECLARE att_sz = i4
DECLARE att_x  = i4
DECLARE PERSON_ALIAS_MRN  = vc with noconstant ("")
DECLARE PERSON_ALIAS_ID_TYPE  = vc with noconstant ("")
DECLARE PERSON_ALIAS_ID_Assign_auth  = vc with noconstant ("")
DECLARE MRN_EXIST  = i4

SET att_sz = size (oen_reply->person_group[1 ].pat_group[1 ].pid.patient_id_int ,5 )

for (att_x = 1 to  att_sz)
EXECUTE oencpm_msglog build ("iN FOR LOOP: att_x :  " ,att_x  ,char (0 ) )
EXECUTE oencpm_msglog build ("ID_TYPE: " ,oen_reply->person_group[1 ].pat_group[1 ].pid[1 ].
patient_id_int[att_x ].ID_TYPE  ,char (0 ) )
  IF ((oen_reply->person_group[1 ].pat_group[1 ].pid[1 ].patient_id_int[att_x ].ID_TYPE in  ("MRN","MR") ) )
		SET PERSON_ALIAS_MRN = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [att_x]->pat_id
		SET PERSON_ALIAS_ID_TYPE = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [att_x]->id_type
		SET PERSON_ALIAS_ID_Assign_auth = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [att_x]->assign_fac_id 
		SET MRN_EXIST = 1
  else
	EXECUTE oencpm_msglog build ("iN ELSE LOOP: att_x :  " ,att_x  ,char (0 ) )
  ENDIF
ENDFOR

if (att_sz>1 and MRN_EXIST =1)
set stat = alterlist (oen_reply->person_group[1 ].pat_group[1 ].pid[1 ].patient_id_int,1)
SET oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [1]->pat_id = PERSON_ALIAS_MRN 
SET oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [1]->id_type = PERSON_ALIAS_ID_TYPE
SET oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [1]->assign_fac_id = PERSON_ALIAS_ID_Assign_auth
else 
EXECUTE oencpm_msglog build ("pid-3 size less than 1 :  " ,att_sz  ,char (0 ) )
endif


;SET stat = alterlist (oen_reply->person_group[1 ].pat_group[1 ].pid.patient_id_int ,1 )
;EXECUTE op_mod_obj_dob_clean
;SET att_sz = size (oen_reply->person_group[1 ].pat_group[1 ].pid.patient_id_int ,5 )
;SET att_x = 1