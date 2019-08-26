/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name: orm_comp_mobj_out
 *  Description:  Script for diet orders outbound to Computrition only
 *  Type:         Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:         Chris Eakes
 *  Library:        ORMORM23
 *  Creation Date:  XX/XX/09
 *  ---------------------------------------------------------------------------------------------
 *  Mod# Date    Author   Description & Requestor Information
 *
 *  1:   Various	C Eakes/JRachael	Various Mods
 *  2:   8/9/10  	T Dillon 	Del'd 2X from SJH Spec Instr/C Krampert
 *  3:   9/2/10         R Quack               Added dr filter logic
 *  4:   6/14/11        R Quack              Added logic to omit any OBX segments for Delete Reason order detail on CA's
 *  5:   5/14/13      H Kaczmarczyk  Added SFB Special Instructions, Snacks, Supplements
 *  6:   6/13/14      H Kaczmarczyk   Added New Dr filter script from Rick Quack for SJB and Soarian
 *  7:   12/2/14      H Kaczmarczyk   Added SJS facility-matched SJH
*  8:   07/13/16    S Parimi                  Added Dietary Supplements SJN and Dietary Supplemnts Peds SJH
*  9:   05/02/17    D Olsz         Adding in critiera to send BCHS modifiers and adding in BAH, BRM for the doctor filter
 *  ---------------------------------------------------------------------------------------------
*/

execute op_MSH_FAC_MODOBJ_OUT

/***
   12/1/2009 -v7- adding logic to build special services in ODT segment.  Each special service will be 
   exploded into 3 ODT segments (Breakfast, Lunch & Dinner).  
   1/21/2010 -v8- adding logic to accomodate order detail change from 'Diet Special Instructions-SJH' to
    'Special Services-SJH'
***/
free record diet_group
set trace recpersist
record diet_group
(
  1 diet_type = vc	
  1 service_per_id  = vc
  1 diet [*]                                      ;Mod001+
     2 diet_sup_pref_cd = vc    ;Mod001+
     2 IS_SUPPLEMENT = vc ;Mod004+
     2 obx_3 = vc
  1 spec_serv [*] 
     2 spec_serv_var = vc
  1 special_inst = vc   
  1 check_st = vc        
)
set trace norecpersist

Set msg_type = trim(oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_type)
Set msg_trigger = trim(oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_trigger)

if (msg_type = "ORM")

;***ORC;1***Mod002-  Hardcode "NW" into ORC;1 for new orders going outbound-  START.
if (OEN_REPLY -> ORDER_GROUP [ 1 ]-> ORC [ 1 ]-> ORDER_CTRL = "SN")
   set OEN_REPLY -> ORDER_GROUP [ 1 ]-> ORC [ 1 ]-> ORDER_CTRL = "NW"
endif
;***ORC;1***Mod002-  Hardcode "NW" into ORC;1 for new orders going outbound-  STOP.

;***ORC;1***Mod003-  hard code 'CA' into ORC;1 for Cancel txn's going outbound.-  Start
if (OEN_REPLY -> ORDER_GROUP [ 1 ]-> ORC [ 1 ]-> ORDER_CTRL = "OC")
   set OEN_REPLY -> ORDER_GROUP [ 1 ]-> ORC [ 1 ]-> ORDER_CTRL = "CA"
endif

;Start date/time needed in ORC;15
;Set oen_reply->ORDER_GROUP [1]->ORC [1]->order_eff_dt_tm = ""
Set oen_reply->ORDER_GROUP [1]->ORC [1]->order_eff_dt_tm =
  oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->quantity_timing [1]->start_dt_tm  

;obr;24
execute oencpm_msglog (build("diag=> ",oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->diag_serv_sec_id)) 
Set DIET_GROUP ->diet_type = 
oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->diag_serv_sec_id 
If (DIET_GROUP->diet_type = "Diets")
 Set DIET_GROUP->diet_type="D"
Elseif (DIET_GROUP->diet_type = "Supplements")
 Set DIET_GROUP->diet_type="S"
Elseif (DIET_GROUP->diet_type = "Snacks")
 Set DIET_GROUP->diet_type="SN"
Elseif (DIET_GROUP->diet_type = "Tube Feeding")
 Set oenstatus->ignore = 1
 ;Set DIET_GROUP->diet_type="TO"
Endif

;;;Version two to concat OBX's.  Computrition needs this format ODS|S|ALL^1700|ENS^2
free record diet_hold
record diet_hold
(
1 N2S=vc
1 DOW=vc
1 DFSJH [*]
   2 DFSJH_freq=vc
1 DSSJH=vc
1 multi_ind=vc
)

If (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->diag_serv_sec_id IN ("Snacks","Supplements"))
Set obxx_sz=size(
oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP,5)
For (c = 1 to obxx_sz)
 If (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [c]->OBX->observation_id->text  = "Number to Send")
   Set diet_hold->N2S=
     oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [c]->OBX->observation_value [1]->value_1
  Endif
 If (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [c]->OBX->observation_id->text  = "Days of Week")
    Set diet_hold->DOW= 
      oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [c]->OBX->observation_value [1]->value_1 
 Endif
 If (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [c]->OBX->observation_id->text  IN ("Dietary Frequency SJH",
     "Dietary Frequency", "Dietary Frequency NBY","Dietary Frequency SFB", "Dietary Frequency SJS", "Dietary Frequency BCHS" ))
	Set diet_hold->multi_ind="Y"
        Set obx_5_sz=size(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [c]->OBX->observation_value,5)
        set stat = alterlist(diet_hold->DFSJH,obx_5_sz)
	   For(pp=1 to obx_5_sz)
	     Set diet_hold->DFSJH[pp]->DFSJH_freq=
                      oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [c]->OBX->observation_value [pp]->value_1
	   Endfor
	set stat=alterlist(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [c]->OBX->observation_value,1)
 Endif
/********on 11/5/09 Jimmy added - to Dietary Snacks-SJH to match order detail********/
 If (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [c]->OBX->observation_id->text  IN 
   ("Dietary Supplements SJH","Dietary Supplements NBY","Dietary Snacks SJH" ,"Dietary Supplements SFB","Dietary Snacks SFB",
  "Dietary Supplements SJS","Dietary Snacks SJS","Dietary Supplements SJN","Dietary Supplements Peds SJH",
"Dietary Supplements BCHS","Dietary Snacks BCHS"))
   Set diet_hold->DSSJH = 
    oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [c]->OBX->observation_value [1]->value_1
 Endif
Endfor

Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [1]->OBX->observation_id->identifier = ""
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [1]->OBX->observation_id->text = ""
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [1]->OBX->observation_value [1]->value_1 = ""
 If (diet_hold->multi_ind="Y")
    SET STAT = ALTERLIST(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP,obx_5_sz)
 Else 
   SET STAT = ALTERLIST(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP,1)
   set stat = alterlist(diet_hold->DFSJH,1)
 Endif
For (tt=1 to size(diet_hold->DFSJH,5))
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [tt]->OBX->observation_id->identifier = 
 diet_hold->DOW
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [tt]->OBX->observation_id->text=
diet_hold->DFSJH[tt]->DFSJH_freq
  If (DIET_GROUP->diet_type = "SN")
      Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [tt]->OBX->observation_value [1]->value_1 = 
       concat(diet_hold->DSSJH,"^","1")
  Else
    Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [tt]->OBX->observation_value [1]->value_1 = 
     concat(diet_hold->DSSJH,"^",diet_hold->N2S)
  Endif
Endfor
Endif

 Set diet_index = 0

;obr;4
if (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->diag_serv_sec_id in ("Diets"))  
execute oencpm_msglog(build("MADE IT HERE", char(0)))

SET DIET_GROUP ->diet[1]->diet_sup_pref_cd = 
oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->univ_service_id->identifier
SET DIET_GROUP ->check_st=
 oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->univ_service_id->identifier
set diet_index = 1
set stat = alterlist(DIET_GROUP ->diet,diet_index) 
endif

;; obr;13
;;;NTE->ODS;4
If(size(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->NTE,5)>=1)
Set diet_group->special_inst = 
oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->NTE [1]->comment [1]->comment 
;oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->relevent_clin_info     
Endif

Set oen_reply->ORDER_GROUP [1]->ORC [1]->order_quant_timing [1]->start_dt_tm=
oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->quantity_timing [1]->start_dt_tm

/* Mod2 - 8/9/10 T Dillon - Del'd 2Xfrom SJH Special Instructions*/ 

SET OBX_NUM = SIZE(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP,5)
If (obx_num > 0 )

/****code commented out to suppress duplicate ODS segment for Regular Diets ODS|D||^REG|*****/
/******NOTE - see Cloverleaf coding*********************/

 ;If (DIET_GROUP ->diet[1]->diet_sup_pref_cd="REG")  ;REG
         ;set diet_index = 0
         ;set stat = alterlist(DIET_GROUP ->diet,diet_index)
 ;Endif

/*************************************/


   FOR (NUM=1 TO OBX_NUM)
       For ( val_cnt = 1 to size ( oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [NUM]->OBX->observation_value, 5 ) )
	If (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->diag_serv_sec_id = "Diets")



          	  If (findstring(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [NUM]->OBX->observation_value [val_cnt]->value_1,
	      DIET_GROUP ->check_st)=0)
	  Set  DIET_GROUP ->check_st= 
	  build(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [NUM]->OBX->observation_value [val_cnt]->value_1,
		",",DIET_GROUP ->check_st)
	  If (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [NUM]->OBX->observation_id->text = 
             		"Diet Special Instructions NBY")
		Free set spec_size
		Set spec_size=size(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [NUM]->OBX->observation_value,5)
		Set stat=alterlist(DIET_GROUP->spec_serv,spec_size)
		;For (ss = 1 to spec_size)
		If (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [NUM]->OBX->observation_value [val_cnt]->value_1
		 IN ("DISP","NOSP","KOSH","2X"))
		    Set DIET_GROUP->spec_serv[val_cnt]->spec_serv_var=
		     oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [NUM]->OBX->observation_value [val_cnt]->value_1
		 Else
		    Set diet_index = diet_index + 1
		     set stat = alterlist(DIET_GROUP ->diet,diet_index)
		     set DIET_GROUP-> diet[diet_index]->diet_sup_pref_cd =
           		oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [NUM]->OBX->observation_value [val_cnt]->value_1 
		 Endif
		;Endfor
   	  Elseif (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [NUM]->OBX->observation_id->text IN
		   ("Speical Services-SJH","Diet Special Instructions SJH","Diet Special Instructions SFB","Speical Services-BCHS",
"Diet Special Instructions BCHS"))
		Free set spec_size
		Set spec_size=size(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [NUM]->OBX->observation_value,5)
		Set stat=alterlist(DIET_GROUP->spec_serv,spec_size)
		;For (ss = 1 to spec_size)
		If (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [NUM]->OBX->observation_value [val_cnt]->value_1
		 IN ("DISP","2X","AIOD","CFNO","CBNO","NEGG","NPRK","NRMT","NSEA","NSHF","NSTR","NSLT"))
		    Set DIET_GROUP->spec_serv[val_cnt]->spec_serv_var=
		oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [NUM]->OBX->observation_value [val_cnt]->value_1
		Else
		   Set diet_index = diet_index + 1
		     set stat = alterlist(DIET_GROUP ->diet,diet_index) 
		set DIET_GROUP-> diet[diet_index]->diet_sup_pref_cd =
		oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [NUM]->OBX->observation_value [val_cnt]->value_1
		 Endif
		;Endfor

                ;; MOD 4 - R Quack - 6/14/11 - check every iteration of obx;3.2 to see if the string text is equal to
                ;; "Delete Reason".   If it is a delete reason we wan to OMIT this obx detail so instead of adding
                ;; 1 to the diet index we just set it back to itself and then alterlist the diet group to that size.
                ElseIf (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [NUM]->OBX->observation_id->text = "Delete Reason")

                              ;execute oencpm_msglog(build("MADE IT INSIDE DELETE REASON IF", char(0)))
                              ;execute oencpm_msglog(build("diet_index ",diet_index, char(0)))
                                        
                                        Set diet_index = diet_index
                                        set stat = alterlist(DIET_GROUP ->diet,diet_index) 

                               ;execute oencpm_msglog(build("diet_index ",diet_index, char(0)))            	  

                      Else
		;;;;REG logic being handled in MOD ORIGINAL
		;If (DIET_GROUP ->diet[1]->diet_sup_pref_cd="REG")  ;REG
		  ;set diet_index = diet_index - 1
        		  ;set stat = alterlist(DIET_GROUP ->diet,diet_index)
		;Else
		  set diet_index = diet_index + 1
		  set stat = alterlist(DIET_GROUP ->diet,diet_index) 
		;Endif
	  ;Endif
                   set DIET_GROUP-> diet[diet_index]->diet_sup_pref_cd =
                      oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [NUM]->OBX->observation_value [val_cnt]->value_1 
                   set DIET_GROUP-> diet[diet_index]->obx_3 = 
                      concat(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [NUM]->OBX->observation_id->identifier,
                        "^",oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [NUM]->OBX->observation_id->text)   
 	   Endif  ;;  End if for diet special instructions IF statement
	  Endif   ;;  End if for duplicate checking findstring IF statement
              	
	Else
	 set diet_index = diet_index + 1
	  set stat = alterlist(DIET_GROUP ->diet,diet_index) 
                  set DIET_GROUP-> diet[diet_index]->diet_sup_pref_cd =
                      oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [NUM]->OBX->observation_value [val_cnt]->value_1 
                  set DIET_GROUP-> diet[diet_index]->obx_3 = 
                      concat(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [NUM]->OBX->observation_id->identifier,
                        "^",oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [NUM]->OBX->observation_id->text)   
      	Endif    ;; End if for diets group obr;24 IF statement 
          ;#next_OBX 
       Endfor  ;; End For loop from 1 to iterate through every instance of obx;5 in each instances of an obx segment
   Endfor ;; End For NUM =1 to iterate through every instance of an obx segmen
Endif ;;End if for obx > 0 IF statement
Endif  ;; End if for MSG type ORM IF statement


/*5/6/14 - New logic to call doctor filter script by R Quack*/

If(oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id in 
("SFB","MCS","MPH","MDU","NBY","SJH","SJN","SAH","SJW","SJS","BAH","BRM","WHH","WHW"))
     execute op_doc_filter_gen_outv5
else
     execute op_doc_filter_gen_out
EndIf

#end_of_script