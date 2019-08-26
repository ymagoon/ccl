/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  rds_pharmo_out
 *  Description:   RDS changed to RDE to Pharmogistics
 *  Type:               Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:         Jim Rachael
 *  Library:        OEOCF23RDERDE
 *  Creation Date:  2009
 *  ---------------------------------------------------------------------------------------------
 *  Mod# Date    Author   Description & Requestor Information
 * 
*   10:   9/22/15   T McArtor             Added SAH SJN per Project (Kelly A) 
*   11:   9/24/15   T McArtor             Added MCS  per Project (Kelly A) 
*   12: 10/27/15   T McArtor             Added MDU  per Project (Kelly A) 
*   13: 10/27/15   T McArtor             Added BAH  per Project (Charlie D) 
*   14: 11/09/15   T McArtor             Added NBY  per Project (Charlie D) 
*   15: 11/17/15   T McArtor             Added SJN adjusted see note below per (Charlie D) 
*   16: 12/01/15   T McArtor             Added WHH WHW adjusted see note below per (Charlie D) 
*   17: 01/05/16   T McArtor             Added SJH SJW adjusted see note below per (Charlie D) 
*   18: 05/28/16   T McArtor              Added BRM adjusted see note below per (T Craft) 
*   19. 07/13/16 D Olszewski   Cart Fills: Only send SAH and Med dispense category
*   20. 07/19/16 D Olszewski   Removing cart fill location filter
*   21. 03/23/17 D Olsz      Adding in Premix FillLists to go outbound.
*   22. 09/14/18   C Markwardt    Adding Intermittent Premix and Continuous Premix FillLists to go outbound.
*   23. 09/24/18   C Markwardt    Adding "Chemo Med" FillLists to go outbound.
 *  ---------------------------------------------------------------------------------------------
*/

/***  4/15/15  T McArtor       Added Facility logic to the ingnore logic exception so it would not get ignored***/
/**********************************Contributor Source Pyxis************************************************/
If (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->building not in ("SJS", "SFB",
"St. Anthony's", "SAH","SJN","St. Joseph's Hos","MCS","Mease Countrysi","MDU","Mease Dunedin","BAH","NBY","MPH","Morton Plant",
 "WHH","WHW","SJH","SJW","BRM")) 
Set OenStatus->Ignore=1
set oenstatus->ignore_text = build("SKIPPED: PATIENT BUILDING OF "
, oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->building, " IS NOT IN LIST")
;CALL ECHO("Facility Filter")
go to EXITSCRIPT2
endif

/****7-13-16***********************Start only send cart fills*********************Mod#  19 ******************/
/* Create ZX3 segment-dispense category in ZX3-2 for Cloverleaf filtering/filter by disp. loc/ change disp. amt*/

DECLARE stop_type =vc
set rde_size=size(oen_reply->RDE_GROUP,5)
for (z2=1 to rde_size)

free record ZX3
record ZX3
(1 string = VC)

DECLARE location_s = vc
DECLARE dispense_cartfill = vc
DECLARE dispense_category = vc
DECLARE order_id_2 = vc    
   free set order_id_2
     set order_id_2 = oen_reply->RDE_GROUP [z2]->ORC->placer_ord_nbr [1]->entity_id

SELECT into "nl:"
    FDC.DISPENSE_FROM_S,
    FDC.DISPENSE_CATEGORY_S,
    FDC.LOCATION_S
FROM 
    FILL_PRINT_ORD_HX  FDC
WHERE 
    FDC.ORDER_ID =  cnvtreal(order_id_2)
ORDER BY
	UPDT_DT_TM ASC
DETAIL
   dispense_cartfill = FDC.DISPENSE_FROM_S,
   dispense_category = FDC.DISPENSE_CATEGORY_S,
   location_s = FDC.LOCATION_S

WITH NOCOUNTER 

ENDFOR
/*****************Removing location filter  Mod #20**************************
;Only send these specific locations to dispense; has to be a fill list and one of the below locs
IF(oen_reply->RDE_GROUP [1]->ORC->ord_ctrl_rsn_cd->identifier = "Fill List")
      IF(location_s not in ("AH 1FXA", "AH 3NE", "AH 3NW", "AH 3SE", "AH 3SW", "AH 4FXA", "AH 4NW", "AH 4SE", 
	"AH 4SW","AH 5E", "AH 5NW", "AH 5SW", "AH 6NW", "AH 6SW", "AH ACU", "AH ADMH", "AH ERH", "AH ERPH", "AH HCL", 
	"AH ICU","AH PT2A", "AH PT2I", "AH PT3A", "AH PT3I", "AH SIC", "AH SNF", "NB 1STN", "NB 2NDN", "NB 2STN", "NB 3RDN",
	"NB 3STN","NB AMBN", "NB CMUN", "NB ERHN", "NB ICUN", "NB IVANH", "NB IVTNH", "NB RB1N", "NB RB2N", "NB HBN",
	"NB WHCHN"))
 	           Set OenStatus->Ignore=1
                           set oenstatus->ignore_text = "SKIPPED: DISPENSE LOCATION IS NOT IN LIST"
                go to EXITSCRIPT2
      ENDIF
ENDIF
*******************/

IF(oen_reply->RDE_GROUP [1]->ORC->ord_ctrl_rsn_cd->identifier = "Fill List")
    IF(dispense_category in ("Med","Chemo-adult-Med", "Chemo-pedi-Med","Investigational-Med", "Med-Specialty",
"IV-Intermittent-Premix", "IV-pedi-Intermittent-Premix", "IV-pedi-Continuous-Premix", 
"IV-adult-Continuous-Premix", "IV-adult-Intermittent-Premix","Intermittent Premix","Continuous Premix","Chemo Med"))
       go to EXITSCRIPT3
    ENDIF
ENDIF

IF(oen_reply->RDE_GROUP [1]->ORC->ord_ctrl_rsn_cd->identifier = "Fill List")
   Set OenStatus->Ignore=1
   set oenstatus->ignore_text = "SKIPPED: ORD_CTRL_RSN_CD IS NOT Fill List"
       go to EXITSCRIPT2
ENDIF

;Added for cart fill ignore, skipping fill list ignore logic
#EXITSCRIPT3
;Commeneted out to test dispense_cartfill
;Set oen_reply->CONTROL_GROUP [1]->MSH [1]->security = dispense_cartfill

/**********************************End only send cart fills************************************************/


/**********************************AUTOPHARM SECTION************************************************/
/************************************************************************************************************/


set trace recpersist
free record ZRC
record ZRC
(
1 string = VC
)
execute oencpm_MsgLog build("Start of build Z segment", char(0))

set trace norecpersist
if(oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_type="RDS")



set DIS_cnt = 0
record DIS_holder
(
  1 DIS_array[*]
    2 FILL_HX_iD = f8
)

Set  Order_Id = oen_reply->RDE_GROUP [1]->ORC->placer_ord_nbr [1]->entity_id
Set  Run_Id = oen_reply->RDE_GROUP [1]->ORC->placer_group_nbr->entity_id


Declare STRENGTH = f8
Declare STRENGTH_UNIT = vc
Declare DISPENSE_HX_ID =  f8
Declare FILL_HX_ID = f8


/********CUSTOM ZRC SEGMENT*****************/


Set disp_dt_tm = oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXE->recent_refill_or_disp

/* formatting ZRC:2 Fill Date & tm to formate MMDDYYYYHHMM00 */
 Set FILL_MONTH = SUBSTRING(5, 2, disp_dt_tm)
 Set FILL_DAY        = SUBSTRING(7, 2 , disp_dt_tm)
 Set FILL_YEAR     =  SUBSTRING(0, 4 , disp_dt_tm)
 Set  FILL_HOUR   =  SUBSTRING(9, 2 , disp_dt_tm)
 Set  FILL_MIN        =  SUBSTRING(11, 2 , disp_dt_tm)
 Set FILL_DT  = BUILD(FILL_MONTH, FILL_DAY, FILL_YEAR, FILL_HOUR, FILL_MIN, "00")
execute oencpm_MsgLog build("NEW FILLDATE ", FILL_DT)

set ZRC->string= trim(build("ZRC|", oen_reply->RDE_GROUP [1]->ORC->order_ctrl, "|" ,
                                  FILL_DT,"|") )

execute oencpm_MsgLog build("NEW SEGMENT",ZRC->string,char(0))





/* This interface must be triggered as an RDS - need to switch it to an RDE for Talyst */
set oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_type ="RDE"
Set oen_reply->RDE_GROUP [1]->ORC->order_ctrl ="NW"




/* more changes to RXE segment - maybe not neccessary?  script came from NKCMH_MO  */
/*
Set oen_reply->RDE_GROUP [1]->ORC->order_quant_timing [1]->interval->time_interval =
oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXE->quant_timing->interval->time_interval

Set oen_reply->RDE_GROUP [1]->ORC->order_quant_timing [1]->interval->frequency =
oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXE->quant_timing->interval->frequency

set oen_reply->RDE_GROUP [1]->ORC->order_quant_timing [1]->duration=
oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXE->quant_timing->duration

declare order_num=F8
declare desc=VC
declare ind= I2
declare V=F8
declare VU = C40

set order_num=cnvtint(oen_reply->RDE_GROUP [1]->ORC->placer_ord_nbr [1]->entity_id)

select into "nl:"
o.ORDER_MNEMONIC
from orders o
where
o.order_id=order_num
detail
desc = o.ORDER_MNEMONIC
with nocounter

select into "nl:"
o.ORDERABLE_TYPE_FLAG
from orders o
where
o.order_id=order_num
detail
ind=o.ORDERABLE_TYPE_FLAG
with nocounter

if(ind=10)
  Set oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXE->give_code->text = desc
  Set oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXE->give_code->identifier = "9999"
endif

set run_num=cnvtint(oen_reply->RDE_GROUP [1]->ORC->placer_group_nbr->entity_id)
select into "nl:"
fpo.volume
from FILL_PRINT_ORD_HX  fpo
where fpo.order_id=order_num
detail
V=fpo.volume
with nocounter
execute oencpm_MsgLog build("STRENGTH->",V,char(0))

select into "nl:"
fpo.VOLUME_UNIT_S
from FILL_PRINT_ORD_HX  fpo
where  fpo.order_id=order_num
detail
VU=fpo.VOLUME_UNIT_S
with nocounter

Set oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXE->give_str =  trim(CNVTSTRING(V,15, 4, L),3)
Set oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXE->give_str_units->identifier =VU
end of the extra scripting that might not be necessary
 */

/* Sending out Dispense Category in RXR-2.1 - requested by StonyBrook - SK2402-1/11/06   */
/* Added in PROD 1/23/06 */

/* Coding does not work: 
declare newdispcat = i4
declare ordid =i4
set ordid = cnvtint(oen_reply->RDE_GROUP [1]->ORC->placer_ord_nbr [1]->entity_id)
execute oencpm_msglog build("ordid=", ordid, char(0))
  select into "nl:"
  od.dispense_category_cd
  from order_dispense od
  where od.order_id = ordid
detail
  newdispcat = od.dispense_category_cd
execute oencpm_msglog build("newdispcat =", newdispcat, char(0))

     declare newdisp = vc
     select into "nl:"
     cv.display
     from code_value cv
     where cv.code_value = newdispcat
     detail
     newdisp = cv.display
execute oencpm_msglog build("newdisp=", newdisp, char(0))

;;Set oen_reply->RDE_GROUP [1]->RXO_GROUP [1]->RXR_GROUP [1]->RXR [1]->adm_device->text = newdisp
;;Set oen_reply->RDE_GROUP [1]->RXO_GROUP [1]->RXR_GROUP [1]->RXR [1]->adm_device->identifier =  cnvtstring(newdispcat)
Set oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXR [1]->adm_device->text = newdisp
Set oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXR [1]->adm_device->identifier = cnvtstring(newdispcat)*/

/* Create ZX3 segment-dispense category in ZX3-2 for Cloverleaf filtering/filter by disp. loc/ change disp. amt*/

declare stop_type =vc
set rde_size=size(oen_reply->RDE_GROUP,5)
for (z=1 to rde_size)

free record ZX3
record ZX3
(
1 string = VC
)
     
 declare order_id_1 = vc
     free set order_id_1
     set order_id_1=oen_reply->RDE_GROUP [z]->ORC->placer_ord_nbr [1]->entity_id

     declare NEWDISPCAT= vc
     declare disploc = vc
     declare disamt = f8
     declare fillqty = f8

 SELECT into "nl:"
 FDC.DISPENSE_CATEGORY_S,
 FDC.CUR_DISP_LOC_S,
 FDC.CHARGE_QTY,
 FDC.FILL_QUANTITY

FROM 
 FILL_PRINT_ORD_HX  FDC

 WHERE 
 FDC.ORDER_ID =  cnvtreal(order_id_1)

ORDER BY 
       FDC.UPDT_DT_TM  ASC     

DETAIL
 NEWDISPCAT = FDC.DISPENSE_CATEGORY_S,
 disploc = FDC.CUR_DISP_LOC_S,
 disamt = FDC.CHARGE_QTY,
 fillqty = FDC.FILL_QUANTITY
 
WITH NOCOUNTER

/********************************************* Filter by dispense location**************************************************/
/*******JN Main Pharmacy was removed at direction of project JN Inventory Manager added. Kelly A., 
Charlie D. held meeting with pharmacy site manager (Jennifer Austin). Initially there was a dose edge 
issue that caused this code to vary from standard inventory Manager configuration. *************************/

if (oen_reply->RDE_GROUP [1]->ORC->ord_ctrl_rsn_cd->identifier != "Fill List")
  if (disploc not in ("JS Inventory Manager", "SFB Inventory Manager","JN Inventory Manager","AH Inventory Manager",
 "MC Inventory Manager","MD Inventory Manager","MP Inventory Manager","NB Inventory Manager","WH Inventory Manager"
   ,"WW Inventory Manager","JH Inventory Manager","JW Inventory Manager", "BR Inventory Manager"))
    set oenstatus->ignore = 1
    set oenstatus->ignore_text = "SKIPPED: ORD_CTRL_RSN_CD IS NOT FILL LIST AND DISPLAYLOC IS NOT IN LIST"
   Endif   
Endif

/******************************************* Change dose to charge qty***************************************************/


Set oen_reply->RDE_GROUP [z]->RXE_GROUP [1]->RXE->disp_amt = cnvtstring(disamt)

IF (oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXE->give_dosage_form->identifier = "Premix")
Set oen_reply->RDE_GROUP [z]->RXE_GROUP [1]->RXE->disp_amt = cnvtstring(fillqty)
ENDIF

/*********************************************** Filter zero dose qty***********************************************************/

If (oen_reply->RDE_GROUP [z]->RXE_GROUP [1]->RXE->disp_amt = "0") 
    set oenstatus->ignore = 1
    set oenstatus->ignore_text = "SKIPPED: DISPENSE AMOUNT IS 0"
Endif

Set oen_reply->RDE_GROUP [z]->RXE_GROUP [1]->ZX3 [1]->dea_schedule->identifier = "1"

  If (NEWDISPCAT= "" or NULL or " ")
Set oen_reply->RDE_GROUP [z]->RXE_GROUP [1]->ZX3 [1]->dea_schedule->text = "MISSING"
 endif
  If (NEWDISPCAT!= "" or NULL or " ")
Set oen_reply->RDE_GROUP [z]->RXE_GROUP [1]->ZX3 [1]->dea_schedule->text =  NEWDISPCAT
 endif


set ZX3->string= trim(build("ZX3|", oen_reply->RDE_GROUP [z]->RXE_GROUP [1]->ZX3 [1]->dea_schedule->identifier,"^" ,
                                   oen_reply->RDE_GROUP [z]->RXE_GROUP [1]->ZX3 [1]->dea_schedule->text, "|"))

Endfor

/****************************stop cont and int orders and set priority from codeset 4010************************************/

declare ordidb =i4
declare FORM_TYPE_VAR = F8
declare PRIORITY_VAR = c15
declare QUANTITY_VAR = I4
declare DOSE_QTY = F8
declare QUANT_DOSE = F8



FOR(x=1 to 2)
set ordidb = cnvtint(oen_reply->RDE_GROUP [1]->ORC->placer_ord_nbr [1]->entity_id)
SELECT into "nl:"
 FPOH.ORD_TYPE,
 FPOH.ORDER_PRIORITY_S,
 FPOH.FILL_QUANTITY,
 FPOH.DOSE_QUANTITY
FROM 
 FILL_PRINT_ORD_HX FPOH
WHERE 
 FPOH.ORDER_ID = ordidb 
AND FPOH.ORDER_ROW_SEQ = 1




DETAIL
 FORM_TYPE_VAR = FPOH.ORD_TYPE
 PRIORITY_VAR = FPOH.ORDER_PRIORITY_S
 QUANTITY_VAR = FPOH.FILL_QUANTITY
 DOSE_QTY = FPOH.DOSE_QUANTITY
WITH NOCOUNTER, MAXREC=1



IF (FORM_TYPE_VAR = 2)
  Set OenStatus->Ignore=1
  set oenstatus->ignore_text = "SKIPPED: FORM TYPE IS 2"
ELSEIF (FORM_TYPE_VAR = 3)
  Set OenStatus->Ignore=1
  set oenstatus->ignore_text = "SKIPPED: FORM TYPE IS 3"
ENDIF

/*******Setting Priority from codeset 4010 because pharmacy is not using codeset 1304********/
Set oen_reply->RDE_GROUP [1]->ORC->order_quant_timing [1]->priority = PRIORITY_VAR
Set oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXE->quant_timing->priority = PRIORITY_VAR

endfor

/***************************end of ignore and 4010 logic for cont and int orders**************************************/


/**********************************END OF AUTOPHARM SECTION************************************************/
/***********************************************************************************************************************/

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
set cqmclass = get_string_value("cqm_class")

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
        set oen_reply->rde_group[rde_idx]->rxe_group[rxe_idx]->rxe->quant_timing->interval->time_interval = freq_temp->freq_desc
      endfor
  endfor

endif

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
end ;get_long_value

#EXITSCRIPT2
endif