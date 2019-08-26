/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  oru_philips_in
 *  Description:  Script for Philips Xcelera ECHO & Xper results inbound 
 *  Type:         Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:         Rick Quackenbush
 *  Library:        OEOCFORUORU
 *  Creation Date:  05/05/15
 *  ---------------------------------------------------------------------------------------------
 *  Mod#  Date    Author       Description & Requestor Information
 *
 *  1:      12/14/2015 TMcArtor  Add logic on existing script to skip when PDF is sent 
 *  2:      02/11/2016 TMcArtor  Add ZDS logic IBE Project
 *  3:      04/15/2016 TMcArtor  Update ZDS logic IBE Project RFC 11418
  * 4:      05/12/2016   T McArtor UpDate Provider filter ZDS filter RFC 11942
 *  ---------------------------------------------------------------------------------------------
*/


/* Start Provider Filter by Postion */  
                                                                                                                               

declare PHY = f8
declare CARD = f8
declare EDP = f8
declare EDPA = f8
declare PA = f8
declare RAD = f8
declare PHYI = f8
declare BDRN = f8

declare PAS = f8
declare NPP = f8
declare NPR = f8
declare EPAP = f8
declare EPA = f8

Set PHY = uar_get_code_by ("Display",88,"Physician")
Set CARD = uar_get_code_by ("Display",88,"Cardiologist")
Set EDP = uar_get_code_by ("Display",88,"ED Physician")
Set EDPA = uar_get_code_by ("Display",88,"ED Physician Administrator")
Set PA = uar_get_code_by ("Display",88,"Physician Administrator")
Set RAD = uar_get_code_by ("Display",88,"Radiologist")
Set PHYI = uar_get_code_by ("Display",88,"Physician Informaticist")
Set BDRN = uar_get_code_by ("Display",263,"BayCare Dr Number")

Set PAS = uar_get_code_by ("Display",88,"Physician Assistant")
Set NPP = uar_get_code_by ("Display",88,"Nurse Practitioner w PathNet")
Set NPR = uar_get_code_by ("Display",88,"Nurse Practitioner")
Set EPAP = uar_get_code_by ("Display",88,"ED Physician Assistant Phase 2")
Set EPA = uar_get_code_by ("Display",88,"ED Physician Assistant")

declare MSNUMB = vc
declare POSITION = f8
declare zds_size = i4
declare z = i4

;free set MSNUMB

set zds_size = size(oen_reply->RES_ORU_GROUP [1]->ZDS,5)
set z = 1

;If (zds_size>1)
;go to EXITSCRIPT

For (z = 1 to zds_size) 
Set MSNUMB = oen_reply->RES_ORU_GROUP [1]->ZDS [z]->provider [1]->id_nbr

SELECT into "nl:"
	PR.POSITION_CD
FROM
	PRSNL_ALIAS   P
	, PRSNL   PR

PLAN P
WHERE p.alias= MSNUMB                          and
      P.alias_pool_cd = BDRN                         and 
      p.active_ind=1

JOIN PR
WHERE p.person_id = pr.person_id

DETAIL
POSITION = PR.POSITION_CD

WITH NOCOUNTER
;If (POSITION IN (365387365.00, 365381358.00, 365386896.00, 365382531.00, 365387965.00, 365471508.00 ))

IF              (POSITION IN (PHY,CARD,EDP,EDPA,PA,RAD,PHYI,PAS,NPP,NPR,EPAP,EPA)) 
Set oen_reply->RES_ORU_GROUP [1]->ZDS [z]->action_code = ""
Set oen_reply->RES_ORU_GROUP [1]->ZDS [z]->provider [1]->id_nbr =  ""
Set oen_reply->RES_ORU_GROUP [1]->ZDS [z]->provider [1]->last_name = ""
Set oen_reply->RES_ORU_GROUP [1]->ZDS [z]->provider [1]->first_name = ""
Set oen_reply->RES_ORU_GROUP [1]->ZDS [z]->provider [1]->id_type = ""
Set oen_reply->RES_ORU_GROUP [1]->ZDS [z]->action_dt_tm = ""
Set oen_reply->RES_ORU_GROUP [1]->ZDS [z]->action_status ""

Endif
Endfor

;#EXITSCRIPT
;Endif

/********************* End Provider Filter by Postion ********************************************/

If (oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application = "POSTIMAGE") 
go to EXITSCRIPT

;;;;;logic to adjust pediatric report types only from Xcelera

If(oen_reply->RES_ORU_GROUP [1]->OBR->univ_service_id->identifier = "Pediatric")

;;;;;logic to query orderable description off of order_catalog table using order_id from message

Declare order_id = F8
Declare order_desc = vc

Set order_id = cnvtint(oen_reply->RES_ORU_GROUP [1]->OBR->placer_ord_nbr->id)

Select 
     oc.description
From 
     orders o,
     order_catalog oc
Plan o                  
     where o.order_id = order_id
Join oc
     where o.catalog_cd = oc.catalog_cd
Detail
      order_desc = oc.description
with nocounter

;;;;;logic to set OBR:4.2 and OBX;3.2 equal to the order_desc to display as result title in report inside powerchart

Set oen_reply->RES_ORU_GROUP [1]->OBR [1]->univ_service_id [1]->text = order_desc

Declare obs_var = i4

Set obs_var = size (oen_reply->RES_ORU_GROUP [1]->OBX_GROUP, 5)

For (sw = 1 to obs_var)

     Set oen_reply->RES_ORU_GROUP [1]->OBX_GROUP [sw]->OBX->observation_id->text = order_desc

Endfor

Endif;;;;; End Pediatric only IF statement

#EXITSCRIPT
Endif