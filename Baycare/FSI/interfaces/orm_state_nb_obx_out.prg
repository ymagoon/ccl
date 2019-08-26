/***************************************************
** Modifying OBX Prompts for the State       **
** Script Name:  orm_state_nb_obx_out      **   
**Author: Cerner Corporation 
****************************************************/
/**  ---------------------------------------------------------------------------------------------
 *  Mod#   Date	        Author            Description & Requestor Information
 *  1         02/28/17   S Parimi            RFC 1515  Send Transfusion Date Time from clinical_event table in OBX 
 */

execute oencpm_msglog build("Beginning of orm_state_nb_obx", char(0))

;***Transfusion Start Time coding
declare fl_transfused_start_time = f8
set fl_transfused_start_time = uar_get_code_by("DISPLAYKEY", 72, "TRANSFUSIONSTARTTIME")
declare fl_transfused_date = vc
set fl_transfused_date = ""
set trans_ind = 0

select into "nl:"
   ce.result_val
from
   clinical_event ce
where
   ce.encntr_id = encntr_id and
   ce.event_cd = fl_transfused_start_time and
   ce.view_level = 1 and
   ce.valid_until_dt_tm > sysdate
order ce.updt_dt_tm
detail 
   fl_transfused_date = substring(3, 12, ce.result_val)
   trans_ind = 1
with nocounter

if (trans_ind = 1)
           set obx_count = size(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP, 5)
           set stat = alterlist(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP, obx_count + 1)
           Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [obx_count +1]->OBX->value_type = "DTM"
           Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [obx_count +1]->OBX->observation_id->identifier = 
                  "62317-3"                       
           Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [obx_count +1]->OBX->observation_id->text = 
                  "Date of Last Blood Product Transfusion"
           Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [obx_count +1]->OBX->observation_value [1]->value_1 =
                   fl_transfused_date  

            ;**Adding OBX if Transaction Date is present
            set obx_count = size(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP, 5)
            set stat = alterlist(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP, obx_count + 1)
            Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [obx_count +1]->OBX->value_type = "CE"
            Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [obx_count +1]->OBX->observation_id->identifier = 
                   "57713-0"
            Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [obx_count +1]->OBX->observation_id->text = 
                   "Infant NICU factors that affect newborn screening interpretation"
            Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [obx_count +1]->OBX->observation_value [1]->value_1 =
                   "LA12417-4^Any blood product transfusion (including ECMO)^LN"   
endif


;**Check Prompts to see if it is YES or NO
set nicu_ind = 0
set anti_ind = 0
set trans_ind = 0
set npo_ind = 0
set adop_ind = 0
set lff_ind = 0
set oral_ind = 0
set tpn_ind = 0
set bbb_ind = 0

for (q=1 to size(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP, 5))
  if (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [q]->OBX->observation_id->text = "NICU")
    if(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [q]->OBX->observation_value [1]->value_1 in ("YES", "Yes"))
               set nicu_ind = 1
    endif
  elseif (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [q]->OBX->observation_id->text = "Antibiotic")
    if (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [q]->OBX->observation_value [1]->value_1 in ("YES", "Yes"))
               set anti_ind = 1
    endif
  elseif (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [q]->OBX->observation_id->text = "Adoption")
    if (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [q]->OBX->observation_value [1]->value_1 in ("YES", "Yes"))
               set adop_ind = 1
    endif
  elseif (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [q]->OBX->observation_id->text = "NPO")
    if (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [q]->OBX->observation_value [1]->value_1 in ("YES", "Yes"))
               set npo_ind = 1
    endif
  elseif (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [q]->OBX->observation_id->text = "Lactose Free Formula")
    if (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [q]->OBX->observation_value [1]->value_1 in ("YES", "Yes"))
               set lff_ind = 1
    endif
  elseif (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [q]->OBX->observation_id->text = "Oral")
    if (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [q]->OBX->observation_value [1]->value_1 in 
        ("Formula", "Human milk", "Both"))
               set oral_ind = 1
    endif
  elseif (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [q]->OBX->observation_id->text = "TPN/Hyperal")
    if (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [q]->OBX->observation_value [1]->value_1 in ("YES", "Yes"))
               set tpn_ind = 1
    endif
  elseif (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [q]->OBX->observation_id->text = "Baby born at BayCare")
    if (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [q]->OBX->observation_value [1]->value_1 in ("YES", "Yes"))
               set bbb_ind = 1
    endif
  endif

;execute oencpm_msglog build("LFF=", lff_ind, " Oral=", oral_ind, char(0))
endfor


;**Removing Antibiotic if NO
if (anti_ind = 0)
   Set v = size(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP, 5) 
   Set g = 1 

   While ( g <  v + 1 )
      if (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [g]->OBX->observation_id->text  = "Antibiotic")
          set stat=alterlist (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP, v - 1 , g - 1) 
          set v = size(oen_reply->ORDER_GROUP, 5)
     else
          set g = g + 1
      endif
    Endwhile
endif

;**Removing NICU if NO
if (nicu_ind = 0)
   Set v = size(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP, 5) 
   Set g = 1 

   While ( g <  v + 1 )
      if (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [g]->OBX->observation_id->text  = "NICU")
          set stat=alterlist (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP, v - 1 , g - 1) 
          set v = size(oen_reply->ORDER_GROUP, 5)
     else
          set g = g + 1
      endif
    Endwhile
endif

;**Removing Adoption if NO
if (adop_ind = 0)
   Set v = size(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP, 5) 
   Set g = 1 

   While ( g <  v + 1 )
      if (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [g]->OBX->observation_id->text = "Adoption")
          set stat=alterlist (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP, v - 1 , g - 1) 
          set v = size(oen_reply->ORDER_GROUP, 5)
     else
          set g = g + 1
      endif
    Endwhile
endif

;**Removing NPO if NO
if (npo_ind = 0)
   Set v = size(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP, 5) 
   Set g = 1 

   While ( g <  v + 1 )
      if (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [g]->OBX->observation_id->text = "NPO")
          set stat=alterlist (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP, v - 1 , g - 1) 
          set v = size(oen_reply->ORDER_GROUP, 5)
     else
          set g = g + 1
      endif
    Endwhile
endif

;**Removing LFF if NO
if (lff_ind = 0)
   Set v = size(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP, 5) 
   Set g = 1 

   While ( g <  v + 1 )
      if (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [g]->OBX->observation_value [1]->value_1 = "NO")
;oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [g]->OBX->observation_id->text  = "Lactose Free Formla")
          set stat=alterlist (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP, v - 1 , g - 1) 
          set v = size(oen_reply->ORDER_GROUP, 5)
     else
          set g = g + 1
      endif
    Endwhile
endif

;**Removing Oral if NO
if (oral_ind = 0)
   Set v = size(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP, 5) 
   Set g = 1 

   While ( g <  v + 1 )
      if (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [g]->OBX->observation_id->text = "Oral")
          set stat=alterlist (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP, v - 1 , g - 1) 
          set v = size(oen_reply->ORDER_GROUP, 5)
     else
          set g = g + 1
      endif
    Endwhile
endif

;**Removing TPN if NO
if (tpn_ind = 0)
   Set v = size(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP, 5) 
   Set g = 1 

   While ( g <  v + 1 )
      if (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [g]->OBX->observation_id->text = "TPN/Hyperal")
          set stat=alterlist (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP, v - 1 , g - 1) 
          set v = size(oen_reply->ORDER_GROUP, 5)
     else
          set g = g + 1
      endif
    Endwhile
endif

;**Removing BBB if NO
if (bbb_ind = 0)
   Set v = size(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP, 5) 
   Set g = 1 

   While ( g <  v + 1 )
      if (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [g]->OBX->observation_id->text = "Baby born at BayCare")
          set stat=alterlist (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP, v - 1 , g - 1) 
          set v = size(oen_reply->ORDER_GROUP, 5)
     else
          set g = g + 1
      endif
    Endwhile
endif

/***
;** if any of the answers are "NO" or "Not", remove the OBX segment, because it doesn't need to go to the state
IF  (size(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP,5)>0)
     free set xdx
     declare xdx = i2
      free set obxsz 
      declare obxsz = i2
      SET  xdx = 1
            while(xdx <= size(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP,5))
                set obxsz = size(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP,5)
            if (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [xdx]->OBX->observation_value[1]->value_1= trim("*NO*"))
                        set stat =alterlist(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP,obxsz-1,xdx-1)
                        set xdx=xdx+1
            elseif (oen_reply->ORDER_GROUP[1]->OBR_GROUP[1]->OBX_GROUP [xdx]->OBX->observation_value[1]->value_1= trim("*No*"))
                        set stat =alterlist(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP,obxsz-1,xdx-1)
                        set xdx=xdx+1
            elseif (oen_reply->ORDER_GROUP[1]->OBR_GROUP[1]->OBX_GROUP [xdx]->OBX->observation_value[1]->value_1= trim("*Not*"))
                        set stat =alterlist(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP,obxsz-1,xdx-1)
                        set xdx=xdx+1
                else
                        set xdx=xdx+1
                endif
            endwhile
ENDIF 
***/

  ;**Adding Additional OBX if NMSP-Refused order
    if (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->univ_service_id [1]->text = "NMSP-Refused")
           set obx_count = size(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP, 5)
           set stat = alterlist(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP, obx_count + 1)
           Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [obx_count +1]->OBX->value_type = "CE"
           Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [obx_count +1]->OBX->observation_id->identifier = 
                  "57721-3"
           Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [obx_count +1]->OBX->observation_id->text = 
                  "Reason for lab test in Dried blood spot"
           Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [obx_count +1]->OBX->observation_value [1]->value_1 =
                   "LA14132-7^No sample collected due to parental refusal^LN"    
     endif

  ;**Adding Additional OBX if NICU, Antibiotic, and Transaction Date is not present
     if (nicu_ind = 0 and anti_ind = 0 and trans_ind = 0)
           set obx_count = size(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP, 5)
           set stat = alterlist(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP, obx_count + 1)
           Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [obx_count +1]->OBX->value_type = "CE"
           Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [obx_count +1]->OBX->observation_id->identifier = 
                  "57713-0"
           Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [obx_count +1]->OBX->observation_id->text = 
                  "Infant NICU factors that affect newborn screening interpretation"
           Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [obx_count +1]->OBX->observation_value [1]->value_1 =
                   "LA137-2^None^LN"    
     endif


;** adjust the outbound messages of the OBX segments to meet the requirements of the State
IF  (size(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP,5)>0)
     free set ndx
     declare ndx = i2
     SET  ndx = 1
     while(ndx <= size(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP,5))
       Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->OBX->set_id = cnvtstring(ndx)
       Set oen_reply-> ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->OBX->observation_id->coding_system = "LN"

        case(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->OBX->observation_id->text)
                 of "Adoption":
                       Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->OBX->value_type = "CE"
                           set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->OBX->observation_value[1]->value_1 = 
                                      "Y^Yes^HL70136"
                      set ndx=ndx+1

                 of "NICU":
                      Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->OBX->value_type = "CE"
                      Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->OBX->observation_id->text = 
                                   "Infant NICU factors that affect newborn screening interpretation"
                      	set oen_reply->ORDER_GROUP [1]->
                                 OBR_GROUP [1]->OBX_GROUP [ndx]->OBX->observation_value[1]->value_1 = 
                                      "LA12419-0^Infant in ICU at time of specimen collection^LN"
                      set ndx=ndx+1

                 of "NMS Card Number":
                       Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->OBX->value_type = "ST"  
                       Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->OBX->observation_id->text = 
                        "Unique bar code of current sample"
                      set ndx=ndx+1

                of "Reason for lab test":
                         Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->OBX->value_type = "CE"
                         Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->OBX->observation_id->text = 
                        "Reason for lab test in Dried blood spot"

                               If (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->
	                                OBX-> observation_value[1]->value_1 = "Initial Screen*")
                                      set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->
			OBX->observation_value[1]->value_1 =  "LA12421-6^Initial Screen^LN"

                                Elseif (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->
			OBX-> observation_value[1]->value_1 = "Repeat Screen*")
		        set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->
                                 OBX->observation_value[1]->value_1 =  "LA12426-5^Subsequent screen - required by protocol^LN"

                                ElseIf (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->
	                                OBX-> observation_value[1]->value_1 = "A-Initial*")
                                      set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->
			OBX->observation_value[1]->value_1 =  "LA12421-6^Initial Screen^LN"

                                Elseif (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->
			OBX-> observation_value[1]->value_1 = "B-Repeat*")
		       set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->
                                                 OBX->observation_value[1]->value_1 =  "LA12425-7^Subsequent screen - by law^LN"

                                Elseif (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->
						OBX-> observation_value[1]->value_1 = "C-Repeat*")
		        set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->
                                 OBX->observation_value[1]->value_1 =  "LA12426-5^Subsequent screen - required by protocol^LN"

                                Elseif (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->
						OBX-> observation_value[1]->value_1 = "D-Repeat*")
		         set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->
                                         OBX->observation_value[1]->value_1 =  "LA16473-3^Subsequent screen - reason unknown^LN"

                                Elseif (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->
						OBX-> observation_value[1]->value_1 = "E-Repeat*")
		         set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->
                                  OBX->observation_value[1]->value_1 =  "LA14132-7^No sample collectd due to parental refusal^LN"
                                 endif
                      set ndx=ndx+1

                 of "Antibiotic":
                       Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->OBX->value_type = "CE"  
                       Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->OBX->observation_id->text = 
                        "Infant NICU factors that affect newborn screening interpretation"
                       set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->OBX->observation_value[1]->value_1 = 
                                      "LA12420-8^Systemic antibiotics before newborn screening speciment^LN"
                      set ndx=ndx+1

                 of "Baby born at BayCare":
                       Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->OBX->value_type = "CE"  
                       Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->OBX->observation_id->text = 
                        "Baby Born at BayCare"
                       ;Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->OBX->observation_id->coding_system = "FL"
                               If (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->
	                                OBX-> observation_value[1]->value_1 = "YES")
                                      set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->
			OBX->observation_value[1]->value_1 =  "Y^Yes^HL70136"
                                Else
                                          set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->
			OBX->observation_value[1]->value_1 =  "N^No^HL70136"
                                Endif
                      set ndx=ndx+1

                 of "NPO":
                      Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->OBX->value_type = "CE"
                      Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->OBX->observation_id->text = 
                                     "Feeding types"
                      set oen_reply->
                           ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->OBX->observation_value[1]->value_1 = 
                                      "LA16917-9^NPO^LN"
                   set ndx = ndx + 1

                 of "TPN/Hyperal":
                      Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->OBX->value_type = "CE"
                      Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->OBX->observation_id->text = 
                                     "Feeding types"
                      set oen_reply->
                           ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->OBX->observation_value[1]->value_1 = 
                                      "LA12418-2^TPN^LN"
                   set ndx = ndx + 1

                 of "Oral":
                      Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->OBX->value_type = "CE"
                      Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->OBX->observation_id->text = 
                                     "Feeding types"
                      If (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->
						OBX-> observation_value[1]->value_1 = "Human milk")
                          set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->
				OBX->observation_value[1]->value_1 =  "LA16914-6^Breast Milk^LN"
                      Elseif (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->
						OBX-> observation_value[1]->value_1 = "Formula")
	          set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->
                                                   OBX->observation_value[1]->value_1 =  "LA16915-3^Lactose Formula^LN"
                      Elseif (oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->
							OBX-> observation_value[1]->value_1 = "Both")
                          set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->
 					OBX->observation_value[1]->value_1 =  "LA16914-6^Breast milk^LN"

                        ;**Adding OBX if Both for Oral
                        set obx_count = size(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP, 5)
                        set stat = alterlist(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP, obx_count + 1)
                        Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [obx_count +1]->OBX->value_type = "CE"
                    Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [obx_count +1]->OBX->observation_id->identifier = 
                                        "67704-7"
                        Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [obx_count +1]->OBX->observation_id->text = 
                                        "Feeding types"
                    Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [obx_count +1]->OBX->observation_value [1]->value_1 =
                                     "LA16915-3^Lactose Formula^LN"   
                      Endif  
                   set ndx = ndx + 1

                 of "Lactose Free Formula":
                      Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->OBX->value_type = "CE"
                      Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->OBX->observation_id->text = 
                                     "Feeding types"
                      set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBX_GROUP [ndx]->OBX->observation_value[1]->value_1 = 
                                      "LA14041-0^Lactose free formula (including soy or hydrolyzed)^LN"
                   set ndx = ndx + 1


                  execute oencpm_msglog build("NDX COUNT: ", ndx, char(0))

                 else
                       set ndx=ndx+1
               endcase
            endwhile

ENDIF

execute oencpm_msglog build("End of orm_state_nb_obx", char(0))