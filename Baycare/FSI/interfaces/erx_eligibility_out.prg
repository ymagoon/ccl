/*********
 Script Name: Eligibility_Out_Mobj
 Script Type: Modify Object
 TDB: oeocf4010270270
**********/


execute oencpm_msglog(build("Entering Eligibility_Out_Mobj...",char(0)))

SET TRACE RECPERSIST
FREE RECORD EEM_VERSION
RECORD EEM_VERSION
(
1 eem_version [*]
    2 version = vc
)
SET TRACE NORECPERSIST

;check to see if this is a 4010 or 5010 format
declare msg_vrsn = vc
set msg_vrsn = get_cerner_stringlist("msg_version")

if(msg_vrsn = "4010")
   execute oencpm_msglog(build("msg_version is 4010...",char(0)))
   Set EEM_VERSION->EEM_VERSION[1]->version = "4010"

;Remove SSN - uncomment if you would like to suppress the SSN from being sent outbound
/**if( oen_reply->TS270_GROUP [1]->HL_GROUP [3]->NM1_1_GROUP [1]->REF [1]->ref_id_code = "SY" )
  Set oen_reply->TS270_GROUP [1]->HL_GROUP [3]->NM1_1_GROUP [1]->REF [1]->ref_id_code = ""
  Set oen_reply->TS270_GROUP [1]->HL_GROUP [3]->NM1_1_GROUP [1]->REF [1]->ref_id = ""
  Set oen_reply->TS270_GROUP [1]->HL_GROUP [3]->NM1_1_GROUP [1]->REF [1]->ref_desc = ""
endif
**/

Set HL_GRP = size( oen_reply->TS270_GROUP [1]->HL_GROUP [1], 5 )
For( x = 1 to HL_GRP )
 Set NM1_GRP  = size( oen_reply->TS270_GROUP [1]->HL_GROUP [x]->NM1_1_GROUP [1], 5 )

 For ( y =  1 to NM1_GRP) 
  ;Remove hyphen from zip code
  If ( oen_reply->TS270_GROUP [1]->HL_GROUP [x]->NM1_1_GROUP [y]->N4->postal_code > "" )
    Set oen_reply->TS270_GROUP [1]->HL_GROUP [x]->NM1_1_GROUP [y]->N4->postal_code = 
     replace( oen_reply->TS270_GROUP [1]->HL_GROUP [x]->NM1_1_GROUP [y]->N4->postal_code , "-", "", 0)
  Endif
 Endfor
Endfor

else
   execute oencpm_msglog(build("msg_version is 5010...",char(0)))
   Set EEM_VERSION->EEM_VERSION[1]->version = "5010"

Set oen_reply->ISA->repetition_separator = "U"
Set oen_reply->ISA->component_element_separator = "^"

;Remove SSN  - uncomment if you would like to suppress the SSN from being sent outbound
/**if( oen_reply->L270_GROUP [1]->HL_GROUP [3]->NM1_GROUP [1]->REF [1]->ref_id_qlfr = "SY" )
  Set oen_reply->L270_GROUP [1]->HL_GROUP [3]->NM1_GROUP [1]->REF [1]->ref_id_qlfr = ""
  Set oen_reply->L270_GROUP [1]->HL_GROUP [3]->NM1_GROUP [1]->REF [1]->ref_id = ""
  Set oen_reply->L270_GROUP [1]->HL_GROUP [3]->NM1_GROUP [1]->REF [1]->ref_desc = ""
endif
**/

Set HL_GRP = size( oen_reply->L270_GROUP [1]->HL_GROUP [1], 5 )
For( x = 1 to HL_GRP )
 Set NM1_GRP  = size( oen_reply->L270_GROUP [1]->HL_GROUP [x]->NM1_GROUP [1], 5 )

 For ( y =  1 to NM1_GRP)
  ;Remove hyphen from zip code
  If ( oen_reply->L270_GROUP [1]->HL_GROUP [x]->NM1_GROUP [y]->N4->postal_code > "" )
    Set oen_reply->L270_GROUP [1]->HL_GROUP [x]->NM1_GROUP [y]->N4->postal_code = 
     replace( oen_reply->L270_GROUP [1]->HL_GROUP [x]->NM1_GROUP [y]->N4->postal_code , "-", "", 0)
  Endif
 Endfor
Endfor

endif

execute oencpm_msglog(build("Exiting Eligibility_Out_Mobj...",char(0)))

/*****SUBROUTINES*****/

SUBROUTINE get_cerner_stringlist(strMeaning)

	DECLARE ret_val = vc
	SET ret_val = ""
	SELECT 	into "nl:"
	FROM
		(dummyt d with seq = value(size(oen_reply->cerner->stringList,5)) )
	WHERE
		oen_reply->cerner->stringList[d.seq]->strMeaning = strMeaning
	DETAIL
		ret_val = oen_reply->cerner->stringList[d.seq]->strVal
	WITH NOCOUNTER

	RETURN(ret_val)

END