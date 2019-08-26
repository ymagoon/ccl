/*
*  ---------------------------------------------------------------------------------------------
*  Script Name:  orm_BMGQuest_mobj_outv1 
*  Description:  Modify Object Script for Amb Quest Msgs Outbound - Main Script
*  Type:  Open Engine Modify Object Script
*  ---------------------------------------------------------------------------------------------
*  Author:  FSI
*  Domain:  All
*  ---------------------------------------------------------------------------------------------
*
*/
/**************************************************************/
;                 Site specific variable declaration
Declare z_domain = vc				;MSH
Declare version_id = vc				;MSH
Declare SEND_APP = vc			;MSH 3
Declare REC_FAC = vc				;MSH 6
Declare PAT_ACC_NBR_ASS_FAC_ID = vc	;PID 18.6 

Set z_domain = "TBD"
Set version_id = "2.3.1"
Set SEND_APP = "AMB"			;Given by RLN resource
Set REC_FAC = "TMP"				;Given by Quest
Set PAT_ACC_NBR_ASS_FAC_ID = "BAYC_FL.AMB.QUEST.RLN" ;Given by RLN resource

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
    execute op_mobj_ambquest_bndlr_out

    if (oenstatus->ignore = 1)
      ; Something in the Bundler Logic qualified to not keep processing this message instance.
      ; Therefore, bypass all processing and get out of this script.
      set oenstatus->ignore_text = "SKIPPED: MESSAGE IGNORED IN BUNDLER SCRIPT"
      Go To EXITSCRIPT
    endif
    ; MSH Segment
    ; Initialize the domain logical
    declare domain = vc
    Set domain = cnvtupper(logical("ENVIRONMENT"))
    If (trim(domain) = z_domain)
      Set oen_reply->CONTROL_GROUP [1]->MSH [1]->processing_id->proc_id = "P"
    else
      Set oen_reply->CONTROL_GROUP [1]->MSH [1]->processing_id->proc_id = "D"
    endif

    ; Change HL7 version to 2.3.1
    Set oen_reply->CONTROL_GROUP [1]->MSH [1]->version_id = version_id

    ; MSH.3-6, Configure for RLN Connectivity
    ; MSH.3 - default to AMB
    Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_application->name_id = SEND_APP

    ; MSH.4 - Alias on codeset 220 at Nurse Unit/Ambulatory level
    Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = 
     oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit

    ; MSH.5 - Set to <PSC_IND>, will set later in modify original code once all orders go through.
    Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = "<PSC_IND>"

    ; MSH.6 - Receive from Quest resources - references their lab.
    Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_facility->name_id = REC_FAC

    execute op_mobj_ambquest_orm_out
    execute op_mobj_ambquest_fin_out
    execute op_mobj_ambquest_pat_out

    ; PID.18.6 - Receive string from Cerner RLN Team, and place here for routing.
    Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_fac_id->name_id = PAT_ACC_NBR_ASS_FAC_ID


  else  ; Non SCS_NET Orders - Ignore those
    execute oencpm_msglog build("Not valid Ambulatory RLI Order, Suppress", char(0))
    Set oenstatus->ignore = 1
    set oenstatus->ignore_text = "SKIPPED: NOT A VALID AMBULATORY RLI ORDER"
    Go To EXITSCRIPT
  endif

else
  execute oencpm_msglog build("Not Valid Message Type, Suppress...", char(0))
  Set oenstatus->ignore = 1
  set oenstatus->ignore_text = build("SKIPPED: MESSAGE TYPE OF ", 
oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_type, " IS NOT A VALID MESSAGE TYPE")
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