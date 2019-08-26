/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  orm_philips_out
 *  Description:  Script for Philips ECHO orders outbound
 *  Type:         Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:         Rick Quackenbush
 *  Library:        OEOCF23ORMORM
 *  Creation Date:  01/31/11
 *  ---------------------------------------------------------------------------------------------
 *  Mod#  Date    Author       Description & Requestor Information
 *
 *  1:      3/1/11	T Dillon	    Added logic to make future dated order cancel go out as CA
 *  2:     12/1/14	L Tabler   Added doctor filter script for MS# across all sites
 *  3:     3/15/15    R Quack   Added height and weight query logic to input values in OBR seg
 *  4:     4/29/15     L Tabler   Added Filter of DONOTSEND values from patient ID
 *  ---------------------------------------------------------------------------------------------
*/

/* Facility in MSH:5 */
EXECUTE OP_MSH_FAC_MODOBJ_OUT

/* ssn fix*/
if(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ssn_nbr ="999999999")
  	set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ssn_nbr =""
endif

/*Logic to call doctor filter script*/
execute op_doc_filter_gen_outv5

/*3/1/11  by T Dillon - Added logic to make future dated order cancel go out as a CA*/
If (oen_reply->ORDER_GROUP [1]->ORC [1]->order_stat = "77")
 Set oen_reply->ORDER_GROUP [1]->ORC [1]->order_ctrl = "CA"
 Set oen_reply->ORDER_GROUP [1]->ORC [1]->order_stat = "85"
Endif

/*Query the height and weight values input into OBR:18, 19, 20, 21*/
;;;;; Declaring variables for height and weight queries
declare height_var =vc
declare weight_var = vc
declare enc_var = f8
set enc_var = oen_reply->cerner->person_info->person [1]->encntr_id  

execute oencpm_msglog ("HEIGHT")

select into "nl:"
 ce.result_val
from clinical_event ce
where 
 ce.encntr_id = enc_var and
 ce.event_cd = 635268
order by updt_dt_tm desc
detail
  height_var = ce.result_val
with maxrec=1

 If (height_var > "")
 execute oencpm_msglog build("height_var = ", height_var)

;;;;; Input height value in OBR;18
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->placer_field1 [1]->value = cnvtstring(height_var,10,2,L)

;;;;; Input height units in OBR;19
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->placer_field2 = "cm"

;;;;; Remove leading zero's on height value if returned in query
 While (substring(1,1,oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->placer_field1 [1]->value)="0")
      Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->placer_field1 [1]->value = 
        substring(2,size(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->placer_field1 [1]->value,1)-1,
             oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->placer_field1 [1]->value)
 Endwhile
  
   execute oencpm_msglog build ("height_var = ", 
      oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->placer_field1 [1]->value)

  execute oencpm_msglog build ("Height units = ", 
      oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->placer_field2)

endif ;;;;; END IF for HEIGHT_VAR


execute oencpm_msglog ("WEIGHT")

select into "nl:"
 ce.result_val
from clinical_event ce
where 
 ce.encntr_id = enc_var and
 ce.event_cd = 635271
 order by updt_dt_tm desc
detail
 weight_var = ce.result_val
with maxrec=1

If (weight_var > "")
    execute oencpm_msglog build("weight_var = ", weight_var) 

;;;;; Input weight value in OBR;20
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->filler_field1 [1]->value = cnvtstring(weight_var,10,2,L)

;;;;; Input weight units in OBR;19
Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->filler_field2 = "kg"

;;;;; Remove leading zero's on weight value if returned in query
While (substring(1,1,oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->filler_field1 [1]->value)="0")
      Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->filler_field1 [1]->value  = 
        substring(2,size(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->filler_field1 [1]->value,1)-1,
             oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->filler_field1 [1]->value)
Endwhile
        
     execute oencpm_msglog build ("weight_var = ", 
       oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->filler_field1 [1]->value)
             
     execute oencpm_msglog build ("Weight units = ", 
          oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->filler_field2)

endif ;;;;; END IF for WEIGHT_VAR

;/**********************PID*****************************************************/ 
;/* Update #4: Remove DONOTSEND values from patient ID*********/
;/*******************************************************************************/ 
declare x = i4
declare index_to_remove = i4
set pid_size = size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->alternate_pat_id, 5)
set x = 1

; find the PID segment to remove
while(x <= pid_size)
	set index_to_remove = -1

	if (oen_reply->PERSON_GROUP[1]->PAT_GROUP[1]->PID[1]->alternate_pat_id[x]->assign_auth->name_id =  "DONOTSEND")
		set index_to_remove = x
	endif

	; remove the unwanted PID segment
	execute oencpm_msglog(build("remove index is: ", index_to_remove))

	if (index_to_remove > -1)
		set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->alternate_pat_id, pid_size-1, x-1)
		set pid_size = pid_size-1
	else
		set x = x +1
	endif
	
endwhile
;/END******************PID*****************************************************/