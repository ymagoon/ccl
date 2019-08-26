/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  oru_LCorpAMB_modobj_in
 *  Cerner Script Name:  mobj_amblc_in
 *  Description:  Labcorp Ambulatory Modify Object Inbound
 *  Type:  Open Engine Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:  CERNER
 *  Domain:  BUILD
 *  Creation Date:  5/15/14 11:28:44
 *  ---------------------------------------------------------------------------------------------
 *  Mod000- Starter script
 *  Modified for ALBR_PA - SK2402
 *  Modified for BAYC_FL - MH031159
 *  11/9/15           Hope Kaczmarczyk Modification from Cerner (Viet Cao) to blank CMRN for persons unmatched
 *  03/24/2016    Hope Kaczmarczyk:  Added coding from Viet Cao's (Cerner) for fixing encounter 
 *   numbers appearing as only "LC" when PID-2&4 were blank.
 *  08/22/16         H Kaczmarczyk    RFC # 13591 Result Modification w/ Orders outbound to LabCorp
 *   01/10/18         RFC 8051 S Parimi   Commented variables no longer needed NURSEUNIT and FACILITY 
 *   06/17/19        H Kacz    change from hardcoded FIN tags to grab FIN tags in the message, 
 */


execute oencpm_msglog("Start of mobj_amblabcorp_in script.")

;variable declarations
declare ntecnt = i2
declare obx_size = i2
declare base_count = i2
declare order_cnt = i2
declare order_codeval = f8
declare Con_Source = f8
declare SEND_APP = vc
declare UMPQ_APP = vc
declare PID_4_assign_auth_FIN = VC

;*************************
;**** MSH PROCESSING *****
;*************************

set oen_reply->CONTROL_GROUP[1]->MSH[1]->sending_application ="LABCORP_AMB"  	;*** custom from site to site
set oen_reply->CONTROL_GROUP[1]->MSH[1]->sending_facility= "LABCORP_AMB" 	;*** custom from site to site
set Con_Source = uar_get_code_by("DISPLAY",73,"LABCORP_AMB")			;*** custom from site to site
set SEND_APP = "LABCORP_AMB"							;*** custom from site to site
set UMPQ_APP = "LABCORP_AMB_UNMATCH"						;*** custom from site to site


;*************************
;**** PID and PV1 PROCESSING *****
;*************************

; if fin tag exists then store it in PID_4_assign_auth_FIN 
if (size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->alternate_pat_id [1]->assign_fac_id, 5) > 0)
  SET PID_4_assign_auth_FIN = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->alternate_pat_id [1]->assign_fac_id
endif

  if (PID_4_assign_auth_FIN = "BCFN")
    set PID_4_assign_auth_FIN = "BayCare FIN" ; because display differs from alias 
  endif

SET MAIN_MRN = "MRN"								;*** custom from site to site
SET UMPQ_MRN = "LABCORP_MRN"							;*** custom from site to site
SET UMPQ_FIN = "LABCORP"							;*** custom from site to site
SET MRN_POOL = uar_get_code_by("DISPLAY", 263, "BayCare CMRN")             		;*** custom from site to site
SET FIN_POOL = uar_get_code_by("DISPLAY", 263, PID_4_assign_auth_FIN)   ;; newly added to grab FIN TAG from message
;SET FIN_POOL = uar_get_code_by("DISPLAY", 263, "BMGFN")                  		;*** custom from site to site
;SET NURSE_UNIT = "Labcorp Ambulatory"          					;*** aliased in Localias tool for default Ambulatory location
;SET FACILITY = "Labcorp Ambulatory"                  				;*** aliased in Localias tool for default Ambulatory location

;Move PID;4 to PID;18 for FIN
; 10/24/18 changed hardcoded FIN to FIN in message

declare lc_acct_nbr = vc

;if PID-4.1 field has fin number then store number in lc_acct_nbr 
if (size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->alternate_pat_id,5)>0)
    set lc_acct_nbr = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->alternate_pat_id [1]->pat_id
endif

; We have  fin tag & fin number values
; PID_4_assign_auth_FIN
; lc_acct_nbr

;Set PID-18.1 & PID-18.5 fields
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID[1]->patient_account_nbr->id_type = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_fac_id = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->act_assign_fac_id = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->pat_id = lc_acct_nbr
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_fac_id = PID_4_assign_auth_FIN

;;;Encounter Creation Logic
execute op_mobj_amblc_enc_in

if(oen_reply->CONTROL_GROUP[1]->MSH[1]->message_type->messg_type = "ORU")

  ;*************************
  ;**** ORU PROCESSING *****
  ;*************************
  for (x=1 to size(oen_reply->RES_ORU_GROUP,5))
    ;*************************
    ;**** OBR PROCESSING *****
    ;*************************
    if (size(oen_reply->RES_ORU_GROUP[x]->OBR->placer_field1,5)>0)
    	  Set oen_reply->RES_ORU_GROUP[x]->OBR->placer_ord_nbr->id =
    	    oen_reply->RES_ORU_GROUP[x]->OBR->placer_field1 [1]->value
    endif
    
    if (trim(oen_reply->RES_ORU_GROUP[x]->ORC [1]->ord_provider->id_nbr)!="")
     	Set oen_reply->RES_ORU_GROUP[x]->OBR->ord_provider->id_nbr =
     	  oen_reply->RES_ORU_GROUP[x]->ORC [1]->ord_provider->id_nbr
     	Set oen_reply->RES_ORU_GROUP[x]->OBR->ord_provider->last_name =
     	  oen_reply->RES_ORU_GROUP[x]->ORC [1]->ord_provider->last_name
     	Set oen_reply->RES_ORU_GROUP[x]->OBR->ord_provider->first_name =
     	  oen_reply->RES_ORU_GROUP[x]->ORC [1]->ord_provider->first_name
     	Set oen_reply->RES_ORU_GROUP[x]->OBR->ord_provider->middle_name =
      	  oen_reply->RES_ORU_GROUP[x]->ORC [1]->ord_provider->middle_name
                Set oen_reply->RES_ORU_GROUP [x]->ORC [1]->ord_provider->source = ""
                Set oen_reply->RES_ORU_GROUP [x]->OBR->ord_provider->source = ""
     endif

    
    ;populate obr;27.4 to allow results to populate the inbox
    Set oen_reply->RES_ORU_GROUP [x]->OBR->quantity_timing->start_dt_tm = 
      oen_reply->RES_ORU_GROUP [x]->OBR->status_change_dt_tm  ;observation_dt_tm

    
    ;******* RAM/See Note *******
    ;The message in this variable will appear as the result value (OBX;5)
    ;when Quest sends "RAM" (Read Always Message) or "See Note".
    ;;set see_comment_string = "Analyte Not Required"
    declare see_comment_string = c50
    set see_comment_string = "TNP"
   
    for (y=1 to size(oen_reply->RES_ORU_GROUP[x]->OBX_GROUP, 5))

       if(oen_reply->RES_ORU_GROUP [x]->OBX_GROUP [y]->OBX->value_type in ("ST", "NM"))
            Set oen_reply->RES_ORU_GROUP [x]->OBX_GROUP [y]->OBX->value_type = "ST"
       endif

        ;**********************************
        ;;;MODIFY OBX:2 VALUES for AP results
        ;;;Need to alias "DOC" on cs53 and 289
        ;**********************************
        ;if(oen_reply->RES_ORU_GROUP [x]->OBR->diag_serv_sec_id = "AP")
        ;   Set oen_reply->RES_ORU_GROUP [x]->OBX_GROUP [y]->OBX->value_type = "AP"
        ;endif


      ;An 'X' in OBX;11 means the DTA is "Deleted" on the LabCorp side, meaning the DTA
      ;doesn't need to be performed.  OBX;5 comes from LabCorp as blank.  We willset OBX;5
      ;to a string from USERPARM1 and make the result status "F".  if LabCorp does send in a result
      ;later, it will come in as "C" so it will post.
      if ((oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[y]->OBX->observation_res_status= "X") )     
        set oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[y]->OBX-> observation_value[1]->value_1 =
          concat(trim(see_comment_string),char(0))
        ;set Result Status to "F" so the DTA will post
        Set oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[y]->OBX->observation_res_status = "F"
      endif
      for (n=1 to size(oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[y]->NTE,5))
        Set oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[y]->NTE [n]->set_id = cnvtstring(n)
        Set oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[y]->NTE [n]->src_of_comment = "RC"
      endfor

      ;OBX - ZDS Performing lab from Labcorp ZPS Segment
      if (size(field->zps_seg,5)>0)
       for (z=1 to size(field->zps_seg,5))
       	if (trim(oen_reply->RES_ORU_GROUP [x]->OBX_GROUP [y]->OBX->producers_id->identifier)=
       		trim(field->zps_seg [z]->zps2))
         ;OBX:16 - Blanking for ZDS segment
         Set oen_reply->RES_ORU_GROUP [x]->OBX_GROUP [y]->OBX->respon_observer [1]->id_nbr = ""
         Set oen_reply->RES_ORU_GROUP [x]->OBX_GROUP [y]->OBX->respon_observer [1]->last_name = ""
         Set oen_reply->RES_ORU_GROUP [x]->OBX_GROUP [y]->OBX->respon_observer [1]->first_name = ""

         Set stat = alterlist(oen_reply->RES_ORU_GROUP [x]->OBX_GROUP [y]->ZDS,1)

         Set oen_reply->RES_ORU_GROUP [x]->OBX_GROUP [y]->ZDS [1]->action_code = "PERFORM"
         Set oen_reply->RES_ORU_GROUP [x]->OBX_GROUP [y]->ZDS [1]->provider->id_nbr = field->zps_seg [z]->zps3
         Set oen_reply->RES_ORU_GROUP [x]->OBX_GROUP [y]->ZDS [1]->action_dt_tm =
           oen_reply->RES_ORU_GROUP [x]->OBR->status_change_dt_tm
         Set oen_reply->RES_ORU_GROUP [x]->OBX_GROUP [y]->ZDS [1]->action_status = "F"
         Set oen_reply->RES_ORU_GROUP [x]->OBX_GROUP [y]->ZDS [1]->action_comment = concat(field->zps_seg [z]->zps3," - ",
          field->zps_seg [z]->zps4 [1]->zps4_1," ",
          field->zps_seg [z]->zps4 [1]->zps4_3," , ",
          field->zps_seg [z]->zps4 [1]->zps4_4," ",
          field->zps_seg [z]->zps4 [1]->zps4_5, " Lab Director: ",
          field->zps_seg [z]->zps7 [1]->zps7_3, " ",
          field->zps_seg [z]->zps7 [1]->zps7_2, " ",
          field->zps_seg [z]->zps7 [1]->zps7_1 ," Phone: ",
          field->zps_seg [z]->zps5)

         ;Set oen_reply->RES_ORU_GROUP [x]->OBX_GROUP [y]->OBX->producers_id->identifier = ""
         ;Set oen_reply->RES_ORU_GROUP [x]->OBX_GROUP [y]->OBX->producers_id->text = ""
        endif
       endfor
      endif
    endfor ;y


     ;NTE
     IF (size(field->zps_seg,5)>0)
       for (z=1 to size(field->zps_seg,5))
          if (trim(oen_reply->RES_ORU_GROUP [x]->OBX_GROUP [1]->OBX->producers_id->identifier)= trim(field->zps_seg [z]->zps2))
          		set ntecnt = 0
          		set ntecnt = size(oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[1]->NTE,5)
          		set stat = alterlist(oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[1]->NTE,(7+ntecnt))
         		 ;set blank space line
         		 set oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[1]->NTE[1 + ntecnt]->comment[1]->comment = 
          		  concat("      ",char(0))
          		;set 'lab performed by' line
          		set oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[1]->NTE[2 + ntecnt]->comment[1]->comment =
          		  "Lab test performed by:"
         		 ;set lab name line
         		 set oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[1]->NTE[3 + ntecnt]->comment[1]->comment =
          		  field->zps_seg [z]->zps3
         		 ;set lab address line
          		set oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[1]->NTE[4 + ntecnt]->comment[1]->comment =
         		   concat(field->zps_seg [z]->zps4 [1]->zps4_1, " ", field->zps_seg [z]->zps4 [1]->zps4_3, " ", 
            			 field->zps_seg [z]->zps4 [1]->zps4_4, " ", field->zps_seg [z]->zps4 [1]->zps4_5)
          		;set phone number
           		set oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[1]->NTE[5 + ntecnt]->comment[1]->comment =
           			 field->zps_seg [z]->zps5
         		 ;set lab director's name
           		set oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[1]->NTE[6 + ntecnt]->comment[1]->comment =
           		 concat(field->zps_seg [z]->zps7 [1]->zps7_3, " ", field->zps_seg [z]->zps7 [1]->zps7_2, " ",
                       		 field->zps_seg [z]->zps7 [1]->zps7_1)
          		;create blank line for chart formatting
          		set oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[1]->NTE[7 + ntecnt]->comment[1]->comment = 
            		concat("     ",char(0))
	endif ;producer_id
         endfor ;z

           If (size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NTE, 5) > 0) 
               Set p=1
               Set ptnte_size = 0
               Set ptnte_size = size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NTE, 5)
               ;set 'comment' line for PID NTEs
               Set stat = alterlist(oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[1]->NTE,(8+ntecnt))
               Set oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[1]->NTE[8 + ntecnt]->comment[1]->comment =
               "LabCorp Comments:"

              For (p=1 to ptnte_size) 
                 Set stat = alterlist(oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[1]->NTE,(9+ntecnt))
                 if (size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NTE [p]->comment [1]->comment,4) = 0)
                   ;set blank space line
                    Set oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[1]->NTE[9+ntecnt]->comment[1]->comment = 
                    concat("     ",char(0))
                 else
                    Set oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[1]->NTE[9+ntecnt]->comment[1]->comment =  
                    oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->NTE [p]->comment [1]->comment
                  endif
                 Set ntecnt = ntecnt+1
              Endfor
           Endif  

          set z=0
          for (z=1 to size(oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[1]->NTE,5))
            set oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[1]->NTE[z]->set_id = cnvtstring(z)
            set oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[1]->NTE[z]->src_of_comment = "RC"
          endfor ; 2nd z
       ENDIF  ; if we got a performing lab statement

for (a=1 to size(oen_reply->RES_ORU_GROUP [x]->OBX_GROUP, 5))
if (oen_reply->RES_ORU_GROUP [x]->OBX_GROUP [a]->OBX->producers_id->identifier != "")
       Set oen_reply->RES_ORU_GROUP [x]->OBX_GROUP [a]->OBX->producers_id->identifier = ""
       Set oen_reply->RES_ORU_GROUP [x]->OBX_GROUP [a]->OBX->producers_id->text = ""
endif
endfor


;ko3600 - 4/23/15 - Adding Code to remove all but ORC|RE|
      Set stat = alterlist(oen_reply->RES_ORU_GROUP [X]->ORC, 0)
      Set stat = alterlist(oen_reply->RES_ORU_GROUP [X]->ORC, 1)
      Set oen_reply->RES_ORU_GROUP [X]->ORC [1]->order_ctrl = "RE" 
;ko3600 - 4/23/15 - OBR 2.2 creates a nonmatch for the order id
      Set oen_reply->RES_ORU_GROUP [X]->OBR->placer_ord_nbr->app_id = ""
;ko3600 - 07/01/15 - Adding code to correct multi results posting back to the last order id
      Set oen_reply->RES_ORU_GROUP [X]->OBR->filler_ord_nbr->app_id = " "
      ;Set oen_reply->RES_ORU_GROUP [X]->OBR->filler_ord_nbr->id = 
      ;    oen_reply->RES_ORU_GROUP [X]->OBR->placer_ord_nbr->id 

  endfor ;x

else ;ORU or ORM
  ;*************************
  ;**** ORM PROCESSING *****
  ;************************* 
  ;ESI accepts ORM messages as ORU^RO1 messages
  set oen_reply->CONTROL_GROUP[1]->MSH[1]->message_type->messg_type="ORU"
  set oen_reply->CONTROL_GROUP[1]->MSH[1]->message_type->messg_trigger="R01"
  
  for (b=1 to size(oen_reply->ORDER_GROUP[1]->OBR_GROUP,5))   
    ;LabCorp can only return first specimen_source_cd, not all if there are multiple
    ;orders under one accession, so we must retrieve it.
  
    select into "nl:"
      cva.code_value
    from code_value_alias cva
    where cva.alias = trim(oen_reply->ORDER_GROUP[order_cnt]->OBR_GROUP[b]->OBR->univ_service_id->identifier) 
      and cva.code_set=200
      and cva.contributor_source_cd=contrib_src
    detail
      order_codeval = cva.code_value
    with nocounter
  
    select  into  "nl:"
      pst.specimen_type_cd
    from (procedure_specimen_type pst) 
    where (pst.catalog_cd = order_codeval)  
    detail
      oen_reply->ORDER_GROUP[order_cnt]->OBR_GROUP[b]->OBR->spec_source->spec_name_cd->identifier = 
        uar_get_code_display(pst.specimen_type_cd)
    with nocounter

    ;set OBR;2 and OBR;3 to blank
    Set oen_reply->ORDER_GROUP[1]->OBR_GROUP[b]->OBR->placer_ord_nbr[1]->id = ""
    Set oen_reply->ORDER_GROUP[1]->OBR_GROUP[b]->OBR->filler_ord_nbr[1]->id = ""
    
    ;LabCorp cannot return this value.
    Set oen_reply->ORDER_GROUP[1]->OBR_GROUP[b]->OBR->quantity_timing[1]->priority ="R"
    Set oen_reply->ORDER_GROUP[1]->OBR_GROUP[b]->OBR->parent_nbr->placer_ord_nbr->id= ""
    Set oen_reply->ORDER_GROUP[1]->OBR_GROUP[b]->OBR->parent_nbr->filler_ord_nbr->id= ""
  endfor ;multiple OBRs

endif ;ORU or ORM