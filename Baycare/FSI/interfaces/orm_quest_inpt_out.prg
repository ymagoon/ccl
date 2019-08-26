/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  orm_quest_inpt_out 
 *  Description:  Reference Lab Outbound Mod Obj
 *  Type:  Open Engine Modify Object Script
 *  Author:  KB025201
 *  ---------------------------------------------------------------------------------------------
 */

;subroutine declarations
declare get_double_value(string_meaning)= i4
declare get_outbound_alias(code_value, contributor_source) = vc

execute OP_RLN_CLEAN_SEGMENT

;************* MSH **************
Declare serv_res = f8
Declare acct_nbr = vc

Set to_serv_res = get_double_value("to_serv_resource")

Select into "nl:"
From location l
Where l.location_cd = to_serv_res
Detail
    acct_nbr = l.ref_lab_acct_nbr
With nocounter

Set DOMAIN = cnvtupper( Logical ("ENVIRONMENT") )
if (DOMAIN = "P30")
  Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_application->name_id = "CER_MIL_PATH"  ;MSH3 - for RLN Pathnet sites
 ;Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_application->name_id = "CER_MIL_COMWX" ;MSH3 - for CommWx sites
 ;Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_application->name_id = "CERNER"  		;MSH3 - old RLN Pathnet setting
  Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = acct_nbr			;MSH4
  Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = "QUEST"		;MSH5
  Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_facility->name_id = "AMD"	   		;MSH6
  Set oen_reply->CONTROL_GROUP [1]->MSH [1]->version_id = "2.3.1"
  Set oen_reply->CONTROL_GROUP [1]->MSH [1]->processing_id->proc_id = "P"

 ;Coding PID18.6 as the RLN identifier for routing
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_fac_id->name_id = 
      concat("QUEST.", acct_nbr, ".RLN")
else
  Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_application->name_id = "CER_MIL_PATH"  ;MSH3 - for RLN Pathnet sites
 ;Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_application->name_id = "CER_MIL_COMWX" ;MSH3 - for CommWx sites
 ;Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_application->name_id = "CERNER"  		;MSH3 - old RLN Pathnet setting
  Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = acct_nbr			;MSH4
  Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = "QUEST"		;MSH5
  Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_facility->name_id = "AMD"	   		;MSH6
  Set oen_reply->CONTROL_GROUP [1]->MSH [1]->version_id = "2.3.1"
  Set oen_reply->CONTROL_GROUP [1]->MSH [1]->processing_id->proc_id = "T"

 ;Coding PID18.6 as the RLN PFI
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_fac_id->name_id = 
      concat("QUEST.", acct_nbr, ".RLN")
endif

;********Copy PID 02 to PID 03***************
Set pat_id = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->id 
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [1]->id = pat_id


;*************** PD1 ***************
Set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PD1 ,0)


;*************** PV1 ***************
Set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 ,0)


;*************** PV2 ***************
Set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV2 ,0)


;*************** ZV1 ***************
Set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->ZVI ,0)


;*************** INS_GROUP ***************
;Only send out 2 insurances
Set stat = alterlist(oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->INS_GROUP, 2)


;*************** IN2 ***************
;Remove IN2 Segments
Set stat = alterlist(oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->INS_GROUP [1]->IN2, 0) 


;*************** ZNI ***************
;Remove ZNI Segments
Set stat = alterlist(oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->INS_GROUP [1]->ZNI, 0) 

  
;*************** ZN2 ***************
;Remove ZN2 Segments
Set stat = alterlist(oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->INS_GROUP [1]->ZN2, 0)


;*************** AUTH_GROUP ***************
;Remove AUTH_GROUP Segments
Set stat = alterlist(oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->INS_GROUP [1]->AUTH_GROUP, 0)


;*************** GT1 ***************
;Only send out 1 guarantor
Set stat = alterlist(oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->GT1, 1)


;*************** ZG1 ***************
;Remove ZGI Segments
Set stat = alterlist(oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->ZGI, 0)


;*************** AL1_GROUP ***************
Set stat = alterlist(oen_reply->PERSON_GROUP [1]->AL1_GROUP, 0)


;*************** ORC ***************
for (x=1 to size(oen_reply->ORDER_GROUP,5))
  ;ORC;1 - Set to NW
  Set oen_reply->ORDER_GROUP [x]->ORC [1]->order_ctrl = "NW"

  ;ORC;2 - remove repeating data
  if (size(oen_reply->ORDER_GROUP[x]->ORC[1]->placer_ord_nbr, 5) > 1)
    set stat = alterlist(oen_reply->ORDER_GROUP[x]->ORC[1]->placer_ord_nbr, 1)
  endif

  ;ORC;2.2 - id to blank
  set oen_reply->ORDER_GROUP[x]->ORC[1]->placer_ord_nbr[1]->name_id = ""

  ;ORC;12 - sending only NPI alias   
  set dr_size=size(oen_reply->ORDER_GROUP [x]->ORC [1]->ord_provider ,5)
  if(dr_size > 1)
	set NPI_dr = "N"
	EXECUTE OENCPM_MSGLOG(BUILD("Ordering Dr size = ", dr_size))
	set a=1
	while (a<=dr_size)
		/* ALISED IN CS320 */
		if(oen_reply->ORDER_GROUP [x]->ORC [1]->ord_provider [a]->id_type != "National Provider Identifier") 

			EXECUTE OENCPM_MSGLOG(BUILD("ID type = ", 
			oen_reply->ORDER_GROUP [x]->ORC [1]->ord_provider [a]->assign_auth->name_id,char(0)))

           	set dr_size=dr_size-1
           	set a = a -1
           	set stat=alterlist(oen_reply->ORDER_GROUP [x]->ORC [1]->ord_provider, dr_size,a)
           	set NPI_dr ="y"
        endif
        set a=a+1
	endwhile
	if(NPI_dr !="y")
		set stat = alterlist(oen_reply->ORDER_GROUP [x]->ORC [1]->ord_provider,0)
	endif
  endif
  Set stat = alterlist(oen_reply->ORDER_GROUP [x]->ORC [1]->ord_provider, 1)
  Set oen_reply->ORDER_GROUP [x]->ORC [1]->ord_provider [1]->assign_auth->name_id = "NPI"  
  Set oen_reply->ORDER_GROUP [x]->ORC [1]->ord_provider [1]->assign_auth->univ_id = ""
  Set oen_reply->ORDER_GROUP [x]->ORC [1]->ord_provider [1]->degree = ""
  Set oen_reply->ORDER_GROUP [x]->ORC [1]->ord_provider [1]->name_type = ""
  Set oen_reply->ORDER_GROUP [x]->ORC [1]->ord_provider [1]->check_digit = ""
  Set oen_reply->ORDER_GROUP [x]->ORC [1]->ord_provider [1]->check_digit_scheme = ""
  Set oen_reply->ORDER_GROUP [x]->ORC [1]->ord_provider [1]->id_type = ""
  Set oen_reply->ORDER_GROUP [x]->ORC [1]->ord_provider [1]->assign_fac_id->name_id = ""
  Set oen_reply->ORDER_GROUP [x]->ORC [1]->ord_provider [1]->assign_fac_id->univ_id = ""
  Set oen_reply->ORDER_GROUP [x]->ORC [1]->ord_provider [1]->assign_fac_id->univ_id_type = ""

  
;*************** OBR ***************  
for (y=1 to size(oen_reply->ORDER_GROUP [x]->OBR_GROUP,5))
  ;OBR;1 - Set id to order group
  Set oen_reply->ORDER_GROUP[x]->OBR_GROUP[y]->OBR->set_id = cnvtstring(x)

  ;OBR;2 - remove repeating data
  if (size(oen_reply->ORDER_GROUP[x]->OBR_GROUP[y]->OBR->placer_ord_nbr,5) >1)
    set stat = alterlist(oen_reply->ORDER_GROUP[x]->OBR_GROUP[y]->OBR->placer_ord_nbr,1)
  endif

  ;OBR;2.2 - id to blank
  Set oen_reply->ORDER_GROUP[x]->OBR_GROUP[y]->OBR->placer_ord_nbr[1]->name_id = ""

  ;OBR;4 - Move OBR.4.1/4.2 to OBR.4.4/4.5
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->univ_service_id [1]->alt_identifier =
    trim(oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->univ_service_id [1]->identifier)
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->univ_service_id [1]->alt_text =
    trim(oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->univ_service_id [1]->text)

  ;OBR;15
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->spec_source->spec_name_cd->identifier = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->spec_source->spec_name_cd->text = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->spec_source->spec_name_cd->coding_system = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->spec_source->spec_name_cd->alt_identifier = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->spec_source->spec_name_cd->alt_text = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->spec_source->spec_name_cd->alt_coding_system = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->spec_source->additives = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->spec_source->coll_meth = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->spec_source->body_site->identifier = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->spec_source->body_site->text = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->spec_source->body_site->coding_system = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->spec_source->body_site->alt_identifier = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->spec_source->body_site->alt_text = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->spec_source->body_site->alt_coding_system = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->spec_source->site_modifier->identifier = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->spec_source->site_modifier->text = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->spec_source->site_modifier->coding_system = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->spec_source->site_modifier->alt_identifier = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->spec_source->site_modifier->alt_text = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->spec_source->site_modifier->alt_coding_system = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->spec_source->coll_meth_modifier->identifier = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->spec_source->coll_meth_modifier->text = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->spec_source->coll_meth_modifier->coding_system = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->spec_source->coll_meth_modifier->alt_identifier = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->spec_source->coll_meth_modifier->alt_text = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->spec_source->coll_meth_modifier->alt_coding_system = ""

  ;OBR;16 - sending only NPI alias
  set dr_size = size(oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->ord_provider,5)
  if(dr_size > 1)
	set NPI_dr = "N"
	EXECUTE OENCPM_MSGLOG(BUILD("Ordering Dr size = ", dr_size))
	set a=1
 	while (a<=dr_size)
 		/* ALISED IN CS320 */
 		if(oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->ord_provider [a]->id_type != "National Provider Identifier") 
	
 			EXECUTE OENCPM_MSGLOG(BUILD("ID type = ", 
 			oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->ord_provider [1]->assign_auth->name_id,char(0)))

         	set dr_size=dr_size-1
         	set a = a -1
         	set stat=alterlist(oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->ord_provider  , dr_size,a)
         	set NPI_dr ="y"
         endif
         set a=a+1
    endwhile
    if (NPI_dr !="y")
    	set stat = alterlist(oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->ord_provider ,0)
    endif
  endif
  Set stat = alterlist(oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->ord_provider, 1)
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->ord_provider [1]->assign_auth->name_id = "NPI"
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->ord_provider [1]->assign_auth->univ_id = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->ord_provider [1]->degree = ""   
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->ord_provider [1]->name_type = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->ord_provider [1]->check_digit = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->ord_provider [1]->check_digit_scheme = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->ord_provider [1]->id_type = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->ord_provider [1]->assign_fac_id->name_id = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->ord_provider [1]->assign_fac_id->univ_id = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->ord_provider [1]->assign_fac_id->univ_id_type = ""
  
  ;OBR;18 - Copy Cerner_Order_ID from OBR;2
  Set stat = alterlist(oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->placer_field1, 0)
  Set stat = alterlist(oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->placer_field1, 1)
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->placer_field1 [1]->value =
      trim(oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->placer_ord_nbr [1]->entity_id)
  
  ;OBR;19 - copy and format Cerner accession from OBR;20
  if (size(oen_reply->ORDER_GROUP[x]->OBR_GROUP[y]->OBR->filler_field1,5) > 1)
    set accession_num = oen_reply->ORDER_GROUP[x]->OBR_GROUP[y]->OBR->filler_field1[1]->value
    set stat = alterlist(oen_reply->ORDER_GROUP[x]->OBR_GROUP[y]->OBR->filler_field1, 0)
    set accession_num = uar_fmt_accession(accession_num, size(accession_num,1))
    set accession_num = cnvtalphanum(accession_num)
    set oen_reply->ORDER_GROUP[x]->ORC[1]->placer_ord_nbr[1]->entity_id = trim(accession_num)
    set oen_reply->ORDER_GROUP[x]->OBR_GROUP[y]->OBR->placer_ord_nbr[1]->entity_id = trim(accession_num)
    set oen_reply->ORDER_GROUP[x]->OBR_GROUP[y]->OBR->placer_field2 = trim(accession_num)
  endif	
	
  ;OBR;26 - Remove all
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->parent_result->obs_id->identifier = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->parent_result->obs_id->text = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->parent_result->obs_id->coding_system = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->parent_result->obs_id->alt_identifier = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->parent_result->obs_id->alt_text = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->parent_result->obs_id->alt_coding_system = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->parent_result->obs_sub_id = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->parent_result->obs_result->identifier = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->parent_result->obs_result->text = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->parent_result->obs_result->coding_system = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->parent_result->obs_result->alt_identifier = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->parent_result->obs_result->alt_text = ""
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->parent_result->obs_result->alt_coding_system = ""
   
  ;OBR;27 - Send first iteration only
  set stat = alterlist(oen_reply->ORDER_GROUP[x]->OBR_GROUP[y]->OBR->quantity_timing, 1)

  ;OBR;28 - Send name ID
  set stat = alterlist (oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->result_copies, 1)
  Set oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->result_copies [1]->id_nbr = ""

  ;OBR;29 - Remove all
   Set stat = alterlist(oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->parent_nbr, 0)

  ;OBR;32 - Remove all
  Set stat = alterlist(oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->prim_res_interp, 0)

  ;OBR;33 - Remove all
  Set stat = alterlist(oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->ast_res_interp, 0)

  ;OBR;34 - Remove all
  Set stat = alterlist(oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->technician, 0)

  ;OBR;35 - Remove all
  Set stat = alterlist(oen_reply->ORDER_GROUP [x]->OBR_GROUP [y]->OBR->transcriptionist, 0)

  ;remove all ORC segments except for the first one
  if (x > 1)
    set stat = alterlist(oen_reply->ORDER_GROUP[x]->ORC, 0)
  endif
endfor ;;y
endfor ;;x


;*************** NTE ***************  
;Converts Line Breaks in NTE's to Multiple NTE's
;Array for NTE 3 values.
FREE RECORD TEMP
RECORD TEMP (
1 NTE_TWO = VC
1 NTE_CNT = I4
1 NTE [*]
2 NTE3 = VC
)

;Initialize the NTE count to 0.
SET TEMP->NTE_CNT = 0

FOR (A = 1 TO SIZE(oen_reply->ORDER_GROUP, 5))
FOR (B = 1 TO SIZE(oen_reply->ORDER_GROUP [A]->OBR_GROUP, 5))
SET CUR_NTE_SZ = SIZE(oen_reply->ORDER_GROUP [A]->OBR_GROUP [B]->NTE,5)
SET C = 1
WHILE (C <= CUR_NTE_SZ)
    ;NTE 2 variable passed from main script.
    set TEMP->NTE_TWO=oen_reply->ORDER_GROUP [A]->OBR_GROUP [B]->NTE [C]->src_of_comment 

    ;Position of first LINE BREAKS in the OBX
    SET BR_CNT = FINDSTRING(".br", oen_reply->ORDER_GROUP [A]->OBR_GROUP [B]->NTE [C]->comment [1]->comment, 1)

    EXECUTE OENCPM_MSGLOG(BUILD("**** BR_CNT = ",BR_CNT,CHAR(0)))

    ;If the NTE sgement contains LINE BREAKS...
    IF(BR_CNT > 0)

      ;Loop through LINE BREAKS and populate the array.
      CALL BR_ARRAY(oen_reply->ORDER_GROUP [A]->OBR_GROUP [B]->NTE [C]->comment [1]->comment)

      ;Remove current NTE;3 string.
      SET oen_reply->ORDER_GROUP [A]->OBR_GROUP [B]->NTE [C]->comment [1]->comment = ""

      ;Resize the NTE segments to the new number of NTE's.
      SET STAT = ALTERLIST(oen_reply->ORDER_GROUP [A]->OBR_GROUP [B]->NTE, TEMP->NTE_CNT+CUR_NTE_SZ-1,C-1)

      ;Loop through the array...
      FOR(D = 1 TO TEMP->NTE_CNT)

        ;Set NTE 1
        SET oen_reply->ORDER_GROUP [A]->OBR_GROUP [B]->NTE [C+D-1]->set_id  = CNVTSTRING(C+D-1)

        ;Set NTE 2
        SET oen_reply->ORDER_GROUP [A]->OBR_GROUP [B]->NTE [C+D-1]->src_of_comment = TEMP->NTE_TWO

        ;If next NTE 3 value is NOT blank...
        IF(TEMP->NTE[D]->NTE3 != "")

          ;Set NTE 3.
          SET oen_reply->ORDER_GROUP [A]->OBR_GROUP [B]->NTE [C+D-1]->comment [1]->comment =
            TEMP->NTE[D]->NTE3

        ;If next NTE 3 is blank...
        ELSE

          ;Put a space in NTE 3.
          SET oen_reply->ORDER_GROUP [A]->OBR_GROUP [B]->NTE [C+D-1]->comment [1]->comment = NOTRIM(" ")

        ENDIF

      ENDFOR ;B

      ;Reset array and NTE_CNT to 0.
      SET C = C + D - 2
      SET CUR_NTE_SZ = SIZE(oen_reply->ORDER_GROUP [A]->OBR_GROUP [B]->NTE,5)
      SET STAT = ALTERLIST(TEMP->NTE, 0)
      SET TEMP->NTE_CNT = 0

    ENDIF
    SET C = C + 1
ENDWHILE ;C
ENDFOR ;B
ENDFOR ;A

#END_SCRIPT


;**************************************************
;** ADD THE NEW LINE BREAK OBX'S TO THE ARRAY *****
;**************************************************
SUBROUTINE BR_ARRAY(NTE_THREE)
  ;Set START_POSITION to the first LINE BREAK.
  SET START_POSITION = FINDSTRING(".br", NTE_THREE, 1)
  ;Increment the NTE count by 1.
  SET TEMP->NTE_CNT = TEMP->NTE_CNT + 1
  ;Increase the array size by 1.
  SET STAT = ALTERLIST(TEMP->NTE, TEMP->NTE_CNT)
  ;Populate the array with the first NTE 3 value.
  SET TEMP->NTE[TEMP->NTE_CNT]->NTE3 = SUBSTRING(1, START_POSITION - 2, NTE_THREE)
  ;While there are still LINE BREAKS...
  WHILE (START_POSITION < SIZE(NTE_THREE))
    ;Increment the NTE_CNT by 1.
    SET TEMP->NTE_CNT = TEMP->NTE_CNT + 1
    ;Increase the array size by 1.
    SET STAT = ALTERLIST(TEMP->NTE, TEMP->NTE_CNT)
    ;Set the END_POSITION to the beginning of the next LINE BREAK string.
    SET END_POSITION = FINDSTRING(".br", NTE_THREE, START_POSITION + 3)
    ;If there are no more LINE BREAKS, set the END_POSITION to the last character in the NTE.
    IF(END_POSITION = 0)
      SET END_POSITION = SIZE(NTE_THREE)
      ;Populate the array with the next NTE 3 value.
      SET TEMP->NTE[TEMP->NTE_CNT]->NTE3 =
      SUBSTRING(START_POSITION + 4, END_POSITION - START_POSITION + 4, NTE_THREE)
    ELSE
      ;Populate the array with the next NTE 3 value.
      SET TEMP->NTE[TEMP->NTE_CNT]->NTE3 =
      SUBSTRING(START_POSITION + 4, END_POSITION - START_POSITION - 5, NTE_THREE)
    ENDIF
    ;Set the new START_POSITION.
    SET START_POSITION = END_POSITION
  ENDWHILE
END

;*********************************
;** GET_DOUBLE_VALUE subroutine **
;*********************************
subroutine get_double_value(string_meaning)
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
end ;get_double_value

;**********************************
;** SUBROUTINE GET_OUTBOUND_ALIAS**
;**********************************
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