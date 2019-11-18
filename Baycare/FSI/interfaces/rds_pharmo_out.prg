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

;load subroutines
execute op_fsi_common

;variable declarations
declare cqmsubtype = c15


if (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->building not in ("SJS", "SFB",
    "St. Anthony's", "SAH","SJN","St. Joseph's Hos","MCS","Mease Countrysi","MDU","Mease Dunedin",
    "BAH","NBY","MPH","Morton Plant", "WHH","WHW","SJH","SJW","BRM")) 
    set oenstatus->ignore = 1
    set oenstatus->ignore_text = build("SKIPPED: PATIENT BUILDING OF "
    , oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->building, " IS NOT IN LIST")

    go to exit_script
endif

if (oen_reply->RDE_GROUP [1]->ORC->ord_ctrl_rsn_cd->identifier = "Fill List")
    set oenstatus->ignore = 1
    set oenstatus->ignore_text = "SKIPPED: ORD_CTRL_RSN_CD IS NOT Fill List"
    go to exit_script
endif

if (oen_reply->RDE_GROUP [z]->RXE_GROUP [1]->RXE->disp_amt = "0") 
    set oenstatus->ignore = 1
    set oenstatus->ignore_text = "SKIPPED: DISPENSE AMOUNT IS 0"
endif

;;; todo - see if any of these reasons exist in p30
set cqmtype = get_string_value_mobj("cqm_type")
set cqmsubtype = get_string_value_mobj("cqm_subtype")
set cqmclass = get_string_value_mobj("cqm_class")

if (cqmsubtype = "")
  execute oencpm_MsgLog build("No Cerner section in message or CQM_SUBTYPE = null.", char(0))
  Set oenstatus->ignore = 1
  set oenstatus->ignore_text = "SKIPPED: CQM_SUBTYPE IS NULL"
  go to exit_script
elseif (cqmsubtype = "0")
  execute oencpm_MsgLog build("Cerner section exists, but no CQM_SUBTYPE value.", char(0))
  Set oenstatus->ignore = 1
  set oenstatus->ignore_text = "SKIPPED: CQM_SUBTYPE IS 0"
go to exit_script
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

IF(oen_reply->RDE_GROUP [1]->ORC->ord_ctrl_rsn_cd->identifier = "Fill List")
    IF(dispense_category in ("Med","Chemo-adult-Med", "Chemo-pedi-Med","Investigational-Med", "Med-Specialty",
"IV-Intermittent-Premix", "IV-pedi-Intermittent-Premix", "IV-pedi-Continuous-Premix", 
"IV-adult-Continuous-Premix", "IV-adult-Intermittent-Premix","Intermittent Premix","Continuous Premix","Chemo Med"))
       go to EXITSCRIPT3
    ENDIF
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
  Set oenstatus->ignore = 1
  set oenstatus->ignore_text = "SKIPPED: FORM TYPE IS 2"
ELSEIF (FORM_TYPE_VAR = 3)
  Set oenstatus->ignore = 1
  set oenstatus->ignore_text = "SKIPPED: FORM TYPE IS 3"
ENDIF

/*******Setting Priority from codeset 4010 because pharmacy is not using codeset 1304********/
Set oen_reply->RDE_GROUP [1]->ORC->order_quant_timing [1]->priority = PRIORITY_VAR
Set oen_reply->RDE_GROUP [1]->RXE_GROUP [1]->RXE->quant_timing->priority = PRIORITY_VAR

endfor

/***************************end of ignore and 4010 logic for cont and int orders**************************************/

execute op_doc_filter_gen_outv2

/* Get the frequency times for non AD-HOC frequencies */
if (get_long_value_mobj("freq_qualifier") = 16)
    execute oencpm_msglog("freq_qualifier = 16")
    go to exit_script
endif

;determine the correct frequency and populate the RDE_GROUP and RXE_GROUP with it
set time_of_day = trim(get_string_value_mobj("freq_time_of_day"))
set day_of_week = trim(get_string_value_mobj("freq_day_of_week"))

declare frequency = vc

;get_string_value returns "0" if the string value is not found and "-1" if there is an error
if (time_of_day > "" and time_of_day not in ("0","-1"))
    execute oencpm_msglog("inside time_of_day")
    set frequency = time_of_day
elseif (day_of_week > "" and day_of_week not in ("0","-1"))
    execute oencpm_msglog("inside day_of_week")
    set frequency = day_of_week
endif

execute oencpm_msglog(build("frequency=",frequency))
    
;if there is a frequency then assign it to each orc and rxe segment

if (frequency > "")
    declare rde_idx = i2
    declare rxe_idx = i2
    set rde_size = size(oen_reply->rde_group , 5)
	
    for (rde_idx = 1 to rde_size)
        set oen_reply->rde_group[rde_idx]->orc->order_quant_timing[1]->interval->time_interval = frequency ;ORC 7.2
        set rxe_size = size(oen_reply->rde_group[rde_idx]->rxe_group, 5)

        for (rxe_idx = 1 to rxe_size)
            set oen_reply->rde_group[rde_idx]->rxe_group[rxe_idx]->rxe->quant_timing->interval->time_interval = frequency ;RXE 1.2
        endfor
    endfor
endif
;end of setting the frequency

execute oencpm_msglog(build("set frequency=",oen_reply->rde_group[1]->rxe_group[1]->rxe->quant_timing->interval->time_interval))

endif

#exit_script