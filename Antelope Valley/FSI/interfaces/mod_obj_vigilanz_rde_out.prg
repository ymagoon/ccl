/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  mod_obj_vigilanz_rde_out
 *  Description:  Vigilanz RDE Mod Obj Out
 *  Type:  Open Engine Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:  CERNER
 *  Domain:  P604
 *  Creation Date:  9/4/2018 4:54:25 AM
 *  ---------------------------------------------------------------------------------------------
 */

execute op_mod_obj_dob_clean

execute oencpm_msglog build("In MOBJ_MEDSTATION_OUT", char(0))
;subroutine declarations
  
declare get_string_value(string_meaning) = c15
declare get_long_value(string_meaning) = i4
declare get_double_value(string_meaning) = i4
declare get_outbound_alias(code_value, contributor_source) = vc
Set cqmclass = get_string_value("cqm_class")
declare fin_nbr = vc
set fin_nbr = trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->id)

  ; MSH Segment
  ; Initialize the domain logical
  declare domain = vc
  Set domain = cnvtupper(logical("ENVIRONMENT"))
  if (trim(domain) = "<P### Prod Environment>")
    Set oen_reply->CONTROL_GROUP [1]->MSH [1]->processing_id->proc_id = "P"
  else
    Set oen_reply->CONTROL_GROUP [1]->MSH [1]->processing_id->proc_id = "T"
  endif
  ; Multi-Facility
  ; Place PV1.3.4 in MSH.4/MSH.6
  if (size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1, 5) > 0)
    Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = 
      trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->facility_id->name_id)
    Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_facility->name_id = 
      trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->facility_id->name_id)
  endif

  execute op_mobj_med_vig_rde_out
  execute op_mobj_medstation_pat_out
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [1]->assign_auth->name_id = "PROD"
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [1]->type_cd = "MRN"
    ; Update 05/06/2013 RDETRICK - Set ZRX Segment for ConnectRX to "O" for regular RDE Orders
    ;Set zxe_stat = alterlist(oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->ZXE, 0)
    ;Set zxe_stat = alterlist(oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->ZXE, 1)
    ;Set oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->ZXE [1]->set_id = "O" 
/*    
if(oen_reply->RDE_GROUP [1]->ORC->order_ctrl IN ("XO","NW"))
  Set oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->ZXE [1]->fill_count = 
    oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXE->quant_timing->start_dt_tm 
elseif(oen_reply->RDE_GROUP [1]->ORC->order_ctrl = "DC")
  Set oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->ZXE [1]->fill_count = 
    oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXE->quant_timing->end_dt_tm 
endif


    Set zxe_stat = alterlist(oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->ZXE, 0)
    Set zxe_stat = alterlist(oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->ZXE, 1)
    Set oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->ZXE [1]->set_id = "O" 

if(oen_reply->RDE_GROUP [1]->ORC->order_ctrl IN ("NW", "SC"))
Set oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->ZXE [1]->fill_count =
 oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXE->quant_timing->start_dt_tm 
elseif(oen_reply->RDE_GROUP [1]->ORC->order_ctrl = "DC")
Set oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->ZXE [1]->fill_count =
oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXE->quant_timing->end_dt_tm 
endif
*/
set rxe_size = size(oen_reply->RDE_GROUP [1]->RXE_GROUP, 5)
for(x=1 to rxe_size)

set rxc_size = size(oen_reply->RDE_GROUP [1]->RXE_GROUP [x]->RXC, 5)

set rxe_alias = trim(oen_reply->RDE_GROUP [1]->RXE_GROUP [x]->RXE->give_code->identifier)
if(rxe_alias != "RXCUST_INTERMITTENT")
declare med_cdm = vc

select into "nl:"
from med_identifier m, med_identifier m2
plan m
where m.value = rxe_alias
join m2
where m.item_id = m2.item_id
and m2.med_identifier_type_cd = 3096
detail
med_cdm = m2.value
with nocounter

Set oen_reply->RDE_GROUP [1]->RXE_GROUP [x]->RXE->give_code->identifier = med_cdm
endif
endfor

set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->id = fin_nbr
#EXITSCRIPT

set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->id = fin_nbr

if(size(oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXE->prov_adm_instr,5) >0)
  if(size(oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXE->prov_adm_instr,5) >1) ;;;two fields indicate indication and comment
    Set oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXE->give_indication [1]->identifier = 
      oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXE->prov_adm_instr [1]->identifier 
    Set oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXE->prov_adm_instr [1]->identifier =
      oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXE->prov_adm_instr [2]->identifier 
    Set oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXE->prov_adm_instr [1]->identifier = ""
  elseif(size(oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXE->prov_adm_instr,5) = 1)
    Set oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXE->give_indication [1]->identifier = 
      oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXE->prov_adm_instr [1]->identifier 
    Set oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXE->prov_adm_instr [1]->identifier = ""
  endif
endif



execute oencpm_msglog build("Out MOBJ_MEDSTATION_OUT", char(0))
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