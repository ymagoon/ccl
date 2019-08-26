/*
*  ---------------------------------------------------------------------------------------------
*  Script Name:  orm_LabCorpAMB_mobj_outv1
*  Cerner script Name: mobj_amblc_out
*  Description:  Modify Object Script for Amb LabCorp Msgs Outbound - Main Script
*  Type:  Open Engine Modify Object Script
*  ---------------------------------------------------------------------------------------------
*  Author:  FSI
*  Domain:  All
*  Date created: 03/29/16
*  ---------------------------------------------------------------------------------------------
*  Mod#   Date	        Author                 Description & Requestor Information
 *
 *  1:    08/19/16	  S Parimi	      RFC # 13591 implementation of Orders outbound to LabCorp
*
*/

/**************************************************************/
;                 Site specific variable declaration

declare domain = vc
Set domain = cnvtupper(logical("ENVIRONMENT"))
If (trim(domain) =  "P30")	;Must get the Production Value
      Set oen_reply->CONTROL_GROUP [1]->MSH [1]->processing_id->proc_id = "P"
    ; MSH.3 - default to CERRLN
    Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_application->name_id = "CERRLN"
    ; MSH.4 - Get from Cerner RLN Group -This value must be given to us by the RLN
    Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = "BAYC_FL.TA010893.LC.RLN"	
    ; MSH.5 - Set to <PSC_IND>, will set later in modify original code once all orders go through.
    Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = "<PSC_IND>"
    ; MSH.6 - Get from Cerner RLN Group - This value must be given to us by the RLN
    Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_facility->name_id = "TA"
    ; Change HL7 version to 2.3
    Set oen_reply->CONTROL_GROUP [1]->MSH [1]->version_id = "2.3"
else
      Set oen_reply->CONTROL_GROUP [1]->MSH [1]->processing_id->proc_id = "D"
    ; MSH.3 - default to CERRLN
    Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_application->name_id = "CERRLN"
    ; MSH.4 - Get from Cerner RLN Group - This value must be given to us by the RLN
    Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = "BAYC_FL.TE032003.LC.RLN"
    ; MSH.5 - Set to <PSC_IND>, will set later in modify original code once all orders go through.
    Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = "<PSC_IND>"
    ; MSH.6 - Get from Cerner RLN Group - This value must be given to us by the RLN
    Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_facility->name_id = "TA"
    ; Change HL7 version to 2.3
    Set oen_reply->CONTROL_GROUP [1]->MSH [1]->version_id = "2.3"
endif

declare Labcorp_perf_loc = vc                                          
set Labcorp_perf_loc = "BMG LabCorp Lab"    ;for use on bundler script, custom site specific

; End of Site Specific Coding
/**************************************************************/

declare current_program = vc
Set current_program = curprog
execute oencpm_msglog build("In-", current_program, char(0))

;subroutine declarations
declare get_string_value(string_meaning) = c15
declare get_long_value(string_meaning) = i4
declare get_double_value(string_meaning) = i4
declare get_outbound_alias(code_value, contributor_source) = vc

Set cqmclass = get_string_value("cqm_class")
Set cqmtype = get_string_value("cqm_type")

If (trim(oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_type) = "ORM")
  execute oencpm_msglog build ("In ORM...", char(0))

  ; Only SCS_NET Event Order Messages are for Amulatory Workflow.
  ; If anything else, throw them out.
  if ((trim(cqmclass) = "SCS_NET") and (trim(cqmtype) = "ORM"))
    ; Call Bundler Logic Script
    execute op_mobj_amblc_bndlr_out

    if (oenstatus->ignore = 1)
      ; Something in the Bundler Logic qualified to not keep processing this message instance.
      ; Therefore, bypass all processing and get out of this script.
      Go To EXITSCRIPT
    endif

    execute op_mobj_amblc_orm_out
    execute op_mobj_amblc_fin_out
    execute op_mobj_amblc_pat_out

    ; PID.18.4 - For LabCorp, set to C (Client), P (Patient), or T (Third Party) Billing Codes
    declare encntr_id = f8
    Set encntr_id = get_double_value("encntr_id")

    if (encntr_id > 0.0)
      ; Query encounter table for guarantor_type_cd's CDF_MEANING
      declare guar_type_mean = vc

      select e.guarantor_type_cd
      from encounter e
      where e.encntr_id = encntr_id
      detail
        guar_type_mean = uar_get_code_meaning(e.guarantor_type_cd)
      with nocounter

execute oencpm_msglog build("quar_type=", guar_type_mean, char(0))

Set Fin_Class_Id = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->fin_class [1]->fin_class_id 
execute oencpm_msglog build("Fin_Class_Id ->", Fin_Class_Id, char(0))

      if (trim(guar_type_mean) = "ORG")
        Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_auth->name_id = 
          "C"
        ; Remove Guarantor and Insurance Segments
        Set stat = alterlist(oen_reply->PERSON_GROUP [1]->FIN_GROUP, 0)
      elseif (
        (trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->fin_class [1]->fin_class_id) = "Self Pay")
          or
        (size(oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->INS_GROUP, 5) = 0))
        Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_auth->name_id = 
          "P"
        ; Remove any insurances on a patient.
        for (x = 1 to size(oen_reply->PERSON_GROUP [1]->FIN_GROUP, 5))
          Set stat = alterlist(oen_reply->PERSON_GROUP [1]->FIN_GROUP [x]->INS_GROUP, 0)
        endfor
      elseif (size(oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->INS_GROUP, 5) > 0)
        Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_auth->name_id = 
          "T"
      else
        ; Default - none of the conditions above were met, clear PID.18.4
        Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_auth->name_id = 
          ""
      endif
    else
      ; No encntr_id to do logic, set 18.4 = ""
      Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_auth->name_id = 
        ""
    endif

; removing PV1 segment
    Set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1, 0)

  else  ; Non SCS_NET Orders - Ignore those
    execute oencpm_msglog build("Not valid Ambulatory RLI Order, Suppress", char(0))
    Set oenstatus->ignore = 1
    Go To EXITSCRIPT
  endif

else
  execute oencpm_msglog build("Not Valid Message Type, Suppress...", char(0))
  Set oenstatus->ignore = 1
  Go To EXITSCRIPT
endif

#EXITSCRIPT

declare current_program = vc
Set current_program = curprog
execute oencpm_msglog build("Out-", current_program, char(0))

;*********************************
;** GET_STRING_VALUE subroutine **
;*********************************
subroutine get_string_value(string_meaning)
  declare eso_idx = i4
  declare list_size = i4

  set eso_idx = 0
  set list_size = 0

  set val_stat = (validate(oen_reply->cerner, "nocernerarea"))
  if (val_stat = "nocernerarea")
    return("")
  else
    set eso_idx = 0
    set list_size = 0
    set list_size = size(oen_reply->cerner->stringList,5)

      if( list_size > 0 )
        set eso_x = 1
        for ( eso_x = eso_x to list_size )
          if(oen_reply->cerner->stringList[eso_x]->strMeaning = string_meaning)
            set eso_idx = eso_x
          endif
        endfor
      endif

    if( eso_idx > 0 )
      return( oen_reply->cerner->stringList[eso_idx]->strVal )
    else
      return("0")
    endif
  endif
end  ;get_string_value

;*******************************
;** GET_LONG_VALUE subroutine **
;*******************************
subroutine get_long_value(string_meaning)
  declare eso_idx = i4
  declare list_size = i4

  set eso_idx = 0
  set list_size = 0

  set val_stat = (validate(oen_reply->cerner, "nocernerarea"))
  if (val_stat = "nocernerarea")
    return("")
  else
    set eso_idx = 0
    set list_size = 0
    set list_size = size(oen_reply->cerner->longList,5)

      if( list_size > 0 )
        set eso_x = 1
        for ( eso_x = eso_x to list_size )
          if(oen_reply->cerner->longList[eso_x]->strMeaning = string_meaning)
            set eso_idx = eso_x
          endif
        endfor
      endif

    if( eso_idx > 0 )
      return( oen_reply->cerner->longList[eso_idx]->lVal )
    else
      return(0)
    endif
  endif
end  ;get_long_value

;*******************************
;** GET_DOUBLE_VALUE subroutine **
;*******************************
subroutine get_double_value(string_meaning)
  declare eso_idx = i4
  declare list_size = i4

  set eso_idx = 0
  set list_size = 0

  set val_stat = (validate(oen_reply->cerner, "nocernerarea"))
  if (val_stat = "nocernerarea")
    return("")
  else
    set eso_idx = 0
    set list_size = 0
    set list_size = size(oen_reply->cerner->doubleList,5)

      if( list_size > 0 )
        set eso_x = 1
        for ( eso_x = eso_x to list_size )
          if(oen_reply->cerner->doubleList[eso_x]->strMeaning = string_meaning)
            set eso_idx = eso_x
          endif
        endfor
      endif

    if( eso_idx > 0 )
      return( oen_reply->cerner->doubleList[eso_idx]->dVal )
    else
      return(0)
    endif
  endif
end  ;get_double_value

; SUBROUTINE GET_OUTBOUND_ALIAS
; Pass in code value, get alias or CD:#### value
subroutine get_outbound_alias(code_value, contributor_source)
  declare contrib_source_cd = f8
  Set contrib_source_cd = uar_get_code_by("DISPLAY", 73, nullterm(contributor_source))

  declare alias = vc

  select cvo.alias
  from code_value_outbound cvo
  where cvo.contributor_source_cd = contrib_source_cd
    and cvo.code_value = code_value
  detail
    alias = cvo.alias
  with nocounter

  if (alias != "")
    return(alias)
  else
    return(build("CD:", trim(cnvtstring(code_value,20,0))))
  endif

end ;get_outbound_alias