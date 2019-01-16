/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  rde_pyxis_out
 *  Description:   RDS changed to RDE to Pyxis
 *  Type:               Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:         Jim Rachael
 *  Library:        OEOCF23RDERDE
 *  Creation Date:  2009
 *  ---------------------------------------------------------------------------------------------
 *  Mod# Date    Author   Description & Requestor Information
 * 
 *  1:   2/4/09    J Rachael    Modified Cerner Pyxis Script for BayCare Talyst interface
 *  2:   7/1/10    R Quack       Call doctor field filter child script
 *  3.   5/12/15  L Tabler	   Adding WHW and WHH, BAH
 *  4.   5/28/16  T McArtor 	   Adding BRM
 *  ---------------------------------------------------------------------------------------------
*/


/******JR  FILTER CHARGE ONLY 2-24-10****/

if (oen_reply->RDE_GROUP [1]->ORC->ord_ctrl_rsn_cd->alt_identifier  = "CD:89800833")
Set OenStatus->Ignore=1
set oenstatus->ignore_text = "SKIPPED: ORD_CTRL_RSN_CD IS CD:89800833"
go to EXITSCRIPT
endif

/*****************************************/

/*** Mod3 - 7/1/10  R Quack - adding logic to call doctor filter script***/
execute op_doc_filter_gen_outv2


execute oencpm_MsgLog build("Start of PYXIS_MOD_OBJ script", char(0))

;subroutine declarations
declare get_string_value(string_meaning) = c15
declare get_long_value(string_meaning) = i4

;variable declarations
declare cqmsubtype = c15

If (oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_type="QRY")
  if (oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_trigger = "Q02")
    go to EXITSCRIPT
  endif
endif

set cqmtype = get_string_value("cqm_type")
set cqmsubtype = get_string_value("cqm_subtype")
if (cqmsubtype = "")
  execute oencpm_MsgLog build("No Cerner section in message or CQM_SUBTYPE = null.", char(0))
  Set OenStatus->Ignore=1
  set oenstatus->ignore_text = "SKIPPED: CQM_SUBTYPE IS NULL"
  go to EXITSCRIPT
elseif (cqmsubtype = "0")
  execute oencpm_MsgLog build("Cerner section exists, but no CQM_SUBTYPE value.", char(0))
  Set OenStatus->Ignore=1
  set oenstatus->ignore_text = "SKIPPED: CQM_SUBTYPE IS 0"
  go to EXITSCRIPT
elseif ((trim(cqmsubtype) != "PHARMACY") and (trim(cqmtype) != "MFN"))
  execute oencpm_MsgLog build("Message is not a Pharmacy subtype. Skipping message.", char(0))
  Set OenStatus->Ignore=1
  set oenstatus->ignore_text = "SKIPPED: CQM_SUBTYPE IS NOT PHARMACY WITH MFN TRIGGER"
  go to EXITSCRIPT
endif

if (cqmtype = "MFN")
;declare pyxis_fac = vc
;set pyxis_fac=substring(1,3, oen_reply->MFNZFM_GROUP [1]->ZFM [1]->facility_code->identifier)
 If (oen_reply->MFNZFM_GROUP [1]->ZFM [1]->facility_code->identifier in
     ("MPH","MCS","MDU","NBY","SAH","SAH","SJW","SFB","WHH","WHW","BAH","BRM"))  ;#3  Adding WHW, WHH, BAH BRM
     ;execute oencpm_MsgLog ("within facility if")
     go to EXITSCRIPT
 Else
      ;execute oencpm_MsgLog ("within facility else")
    Set OenStatus->Ignore=1
    set oenstatus->ignore_text = "SKIPPED: FACILITY_CODE IS NOT IN LIST"
    go to EXITSCRIPT
 Endif
endif


/* PYXIS wants frequency times for non AD-HOC frequencies */

if ( get_long_value( "freq_qualifier" ) = 16 ) ;; ad hoc frequency - times already in HL7 message
    go to SKIP_AD_HOC_FREQ
endif

;;frequency day of week and time of day

record freq_temp
(
        1 time_of_day   = vc
        1 day_of_week   = vc
        1 freq_desc     = vc
)

set freq_temp->time_of_day = trim(get_string_value("freq_time_of_day"))
set freq_temp->day_of_week = trim(get_string_value("freq_day_of_week"))

;;execute oencpm_msglog build("freq_temp->time_of_day=",freq_temp->time_of_day)
;;execute oencpm_msglog build("freq_temp->day_of_week=",freq_temp->day_of_week)

if (trim(freq_temp->time_of_day) > "") ;; use time_of_day
  set freq_temp->freq_desc = freq_temp->time_of_day

elseif (trim(freq_temp->day_of_week) > "") ;; use day_of_week
  set freq_temp->freq_desc = freq_temp->day_of_week

endif

;;execute oencpm_msglog build("freq_temp->freq_desc=",freq_temp->freq_desc)

free set rde_size
free set rxe_size

free set rde_idx
free set rxe_idx

set rde_size = 0
set rxe_size = 0

set rde_idx = 0
set rxe_idx = 0

if (trim(freq_temp->freq_desc) > "")
  set rde_size = size(oen_reply->rde_group , 5)
  ;;execute oencpm_msglog build( "rde_size=",rde_size )
  for (rde_idx = 1 to rde_size)
    ;; ORC 7.2
    set oen_reply->rde_group[rde_idx]->orc->order_quant_timing[1]->interval->time_interval = freq_temp->freq_desc
    set rxe_size = size(oen_reply->rde_group[rde_idx]->rxe_group, 5)
      ;;execute oencpm_msglog build( "rxe_size=",rxe_size )
      for (rxe_idx = 1 to rxe_size)
	;; RXE 1.2
	set oen_reply->rde_group[rde_idx]->rxe_group[rxe_idx]->rxe->quant_timing->interval->time_interval =  freq_temp->freq_desc
      endfor
  endfor

endif
/* Add premix logic  */


declare rxc_size = i4
declare rxc_x = i4
Set rxc_size = size(oen_reply->RDE_GROUP [1]->RXO_GROUP [1]->RXR_GROUP [1]->RXC_GROUP [1]->RXC, 5)
Set rxc_x = 1

while (rxc_x <= rxc_size)


; ***************************** Get rid of bogus multimix pyxis product name premix ***********************

  
  Declare Pyxis_ID = vc
  
  IF (size(oen_reply->cerner->object_identifier_info->item, 5) > 0)
    FOR (x=1 to size(oen_reply->cerner->object_identifier_info->item, 5))
    	FOR (y=1 to size(oen_reply->cerner->object_identifier_info->item [x]->object, 5))
        
        ;IF (identifier_type_meaning = "RX MISC5")
        IF (oen_reply->cerner->object_identifier_info->item [x]->object [y]->value_key = "PREMIX")        		
        	FOR (z=1 to size(oen_reply->cerner->object_identifier_info->item [x]->object, 5))
  execute oencpm_MsgLog build("if_typr_mrsn",
                            oen_reply->cerner->object_identifier_info->item [x]->object [z]->identifier_type_meaning,char(0))
		execute oencpm_MsgLog build("value_key",
			oen_reply->cerner->object_identifier_info->item [x]->object [z]->VALUE_KEY,char(0))
        	  IF (cnvtupper(oen_reply->cerner->object_identifier_info->item [x]->object [z]->identifier_type_meaning) =  "PYXIS")
		
        	    SET Pyxis_ID = oen_reply->cerner->object_identifier_info->item [x]->object [z]->VALUE_KEY
        	  ENDIF
        	ENDFOR
        ENDIF
      ENDFOR
    ENDFOR
  ENDIF
execute oencpm_MsgLog build("check",Pyxis_id,"and", 
         oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXC [rxc_x]->comp_code->identifier,char(0))

  IF (oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXC [rxc_x]->comp_code->identifier = 
  	Pyxis_ID) ;rxc;2.1 	
    SET stat alterlist(oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXC, 
      rxc_size - 1, rxc_x - 1)
    SET stat alterlist(oen_reply->RDE_GROUP [1]->RXO_GROUP [1]->RXR_GROUP [1]->RXC_GROUP [1]->RXC, 
      rxc_size - 1, rxc_x - 1)
    Set rxc_size = size(oen_reply->RDE_GROUP [1]->RXO_GROUP [1]->RXR_GROUP [1]->RXC_GROUP [1]->RXC, 5)
    SET rxc_x = rxc_x - 1
  ENDIF
    set rxc_x = rxc_x + 1
endwhile

 

/******************************************************************************************************************/

/*  end premix logic */

free set rde_size
free set rxe_size

free set rde_idx
free set rxe_idx

free set freq_temp

#SKIP_AD_HOC_FREQ

/* PYXIS does not want facility or building in the HL7 message */

/* this has been taken care of by building blank cvo aliases on code set 220
   for all building and facility codes */

;;set oen_reply->person_group[ 1 ]->pat_group[ 1 ]->pv1[ 1 ]->assigned_pat_loc->facility_id->name_id = ""
;;set oen_reply->person_group[ 1 ]->pat_group[ 1 ]->pv1[ 1 ]->assigned_pat_loc->building = ""

/******Site specific scripting*******/
declare stop_type =vc
set rde_size=size(oen_reply->RDE_GROUP,5)
for (z=1 to rde_size)
;;;;;;;;;;;;get rid of RXO and OBX segments.
     set stat = alterlist (oen_reply->RDE_GROUP [z]->RXO_GROUP,0)
     set stat= alterlist (oen_reply->RDE_GROUP [z]->OBX_GROUP,0)
     set rxe_size = size(oen_reply->RDE_GROUP [z]->RXE_GROUP,5)
;;;;;;;;;;;;;set ORC;3 = ORC;2
     set oen_reply->RDE_GROUP [z]->ORC->filler_ord_nbr [1]->entity_id =
         oen_reply->RDE_GROUP [z]->ORC->placer_ord_nbr [1]->entity_id
;;;;;;;;;;;;;;get order_id from ORC;3
     declare order_id_1 = vc
     free set order_id_1
     set order_id_1=oen_reply->RDE_GROUP [z]->ORC->placer_ord_nbr [1]->entity_id
;execute oencpm_msglog build("order_id", order_id)
;;;;;;;;;;;;;;ORDER_DETAIL select  
         select into "nl:"
         OD.oe_field_meaning, OD.oe_field_display_value, OD.order_id
         from ORDER_DETAIL OD
         where OD.order_id = cnvtreal(order_id_1)
         and  OD.oe_field_meaning="STOPTYPE"
         detail
         stop_type=OD.oe_field_display_value
;execute oencpm_msglog build("stop_type", stop_type)
         with nocounter
;;;;;;;;;;;;;if trans is a soft stop, take the end date out of ORC;7.5 and RXE;1.5 and 
;;;;;;;;;;;;;RXE and ORC durations.  Leave it for all other types
         if(stop_type="Soft Stop")
            set oen_reply->RDE_GROUP [z]->ORC->order_quant_timing [1]->end_dt_tm=""
            set oen_reply->RDE_GROUP [z]->ORC->order_quant_timing [1]->duration =""
            set oen_reply->RDE_GROUP [z]->RXE_GROUP [1]->RXE->quant_timing->end_dt_tm =""
            set oen_reply->RDE_GROUP [z]->RXE_GROUP [1]->RXE->quant_timing->duration =""
         endif 
Endfor


/***
12/19/2007 Logic to suppress discontinue orders that are generated when item/qty of the charge 
does not match that of the original order.
***/
If (oen_reply->RDE_GROUP [1]->ORC->entered_by [1]->last_name = "CONTRIBUTOR_SYSTEM")
 If (oen_reply->RDE_GROUP [1]->ORC->entered_by [1]->first_name = "PYXISRX")
  set oenstatus->ignore = 1
  set oenstatus->ignore_text = "SKIPPED: ORDER ENTERED BY CONTRIBUTOR_SYSTEM, PYXISRX"
 Endif
Endif


#EXITSCRIPT

;*********************************
;** GET_STRING_VALUE subroutine **
;*********************************
subroutine get_string_value(string_meaning)
  declare eso_idx = i4
  declare list_size = i4

  set eso_idx = 0
  set list_size = 0

  set stat = (validate(oen_reply->cerner, "nocernerarea"))
  if (stat = "nocernerarea")
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

  set stat = (validate(oen_reply->cerner, "nocernerarea"))
  if (stat = "nocernerarea")
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