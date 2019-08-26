/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  oru_quest_inpt_in 
 *  Description:  Quest Inbound ModObject
 *  Type:  Open Engine Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:  KB025201
 *  Domain:  C30
 *  Creation Date: 5/16/2019
 *  ---------------------------------------------------------------------------------------------
 */
;This section is for the Accession Rebuild work below
declare  accRebuild (tAcc) = c20
if (validate (acc_setup->loaded, -1) = -1)
  record acc_setup
    (
    1 site_len  = i2
    1 year_len  = i2
    1 jseq_len  = i2
    1 min_len   = i2
    1 loaded    = i2
    )
  with persist
endif

;variable declarations
declare short_accn_num = c30

;set MSH fields for RLI processing
;set oen_reply->CONTROL_GROUP[1]->MSH[1]->sending_application = "QUEST_INPT"
set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application =  "RLI"
set oen_reply->CONTROL_GROUP[1]->MSH[1]->receiving_facility = "RLI"

if(oen_reply->CONTROL_GROUP[1]->MSH[1]->message_type->messg_type = "ORU")
   ;**** ORU PROCESSING *****
   for (x=1 to size(oen_reply->RES_ORU_GROUP,5))

    if(oen_reply->RES_ORU_GROUP [x]->OBR->placer_field2 = "")
       Set oen_reply->RES_ORU_GROUP [x]->OBR->placer_field2= 
         oen_reply->RES_ORU_GROUP [x]->OBR->placer_ord_nbr->id 
    endif

      ;copy short accession from OBR;19 to variable short_accn_num
      Set short_accn_num = oen_reply->RES_ORU_GROUP [x]->OBR->placer_field2

      ;perform cnvtalphanum in case accession number includes dashes (which appear on packing lists)
      set short_accn_num = cnvtalphanum(short_accn_num)
      Set oen_reply->RES_ORU_GROUP [x]->OBR->placer_field1 [1]->value = short_accn_num

      ;rebuild full accession in OBR 19 for accession matching
      Set oen_reply->RES_ORU_GROUP [x]->OBR->placer_field2 = accRebuild(short_accn_num)

      ;if its a reflex order, pull in the specimen type and collection priority and start dt/tm
      ;all are required to write the new order
      Set contrib_source =
        uar_get_code_by("DISPLAY", 73, oen_reply->CONTROL_GROUP[1]->MSH[1]->sending_application)

      If (oen_reply->RES_ORU_GROUP [x]->OBR->spec_source->spec_name_cd->identifier = "")
         select cva.alias
         from accession_order_r aor, order_detail od, code_value_alias cva
         plan aor
         where aor.accession = oen_reply->RES_ORU_GROUP [x]->OBR->placer_field2
         join od
         where od.order_id = aor.order_id 
         and od.oe_field_meaning = "SPECIMEN TYPE"
         join cva
         where cva.code_value = od.oe_field_value 
         and cva.code_set = 2052 
         and cva.contributor_source_cd = contrib_source
         detail
            oen_reply->RES_ORU_GROUP [x]->OBR->spec_source->spec_name_cd->identifier = cva.alias
         with nocounter
      Endif

      Set obr_27_6_stat = ALTERLIST(oen_reply->RES_ORU_GROUP [x]->OBR->quantity_timing, 2)

      select cva.alias
      from accession_order_r aor, order_detail od, code_value_alias cva
      plan aor
      where aor.accession = oen_reply->RES_ORU_GROUP [x]->OBR->placer_field2
      join od
      where od.order_id = aor.order_id 
      and od.oe_field_meaning = "COLLPRI"
      join cva
      where cva.code_value = od.oe_field_value 
      and cva.code_set = 2054 and
      cva.contributor_source_cd = contrib_source
      detail
         oen_reply->RES_ORU_GROUP [x]->OBR->quantity_timing [1]->priority = cva.alias
      with nocounter

      select cva.alias
      from accession_order_r aor, order_detail od, code_value_alias cva
      plan aor
      where aor.accession = oen_reply->RES_ORU_GROUP [x]->OBR->placer_field2
      join od
      where od.order_id = aor.order_id and od.oe_field_meaning = "REPPRI"
      join cva
      where cva.code_value = od.oe_field_value and cva.code_set = 1905 and
         cva.contributor_source_cd = contrib_source
      detail
         oen_reply->RES_ORU_GROUP [x]->OBR->quantity_timing [2]->priority = cva.alias
      with nocounter

      select o.current_start_dt_tm
      from orders o, accession_order_r aor
      plan aor
      where aor.accession = oen_reply->RES_ORU_GROUP [x]->OBR [1]->placer_field2
      join o
      where o.order_id = aor.order_id
      detail
        oen_reply->RES_ORU_GROUP [x]->OBR [1]->quantity_timing [1]->start_dt_tm =
          format(o.current_start_dt_tm, "YYYYMMDDHHMMSS;;D")
      with nocounter

      ;if OBR;21 contains performing location info
      ;parse and append to NTE segments after the last OBX
      if (oen_reply->RES_ORU_GROUP[x]->OBR->filler_field2 != "")
         free record perform
         record perform
         (
            1 info[*]
               2 value = c300
         )

         set stat = alterlist(perform->info, 7)
         for (y=1 to 7)
            set perform->info[y]->value =
               piece (oen_reply->RES_ORU_GROUP[x]->OBR->filler_field2,"^",y,"",4)
         endfor

         ;insert the performed at comments only after the last OBX
         set y = size(oen_reply->RES_ORU_GROUP[x]->OBX_GROUP,5)
         set z = size(oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[y]->NTE,5)

         If (y > 0)
            ;set "Lab test performed by:" line, only set for first OBX if Micro report
            If (oen_reply->RES_ORU_GROUP [x]->OBX_GROUP [y]->OBX->value_type = "TX")
               ;Make structure 6 times bigger for 6 elements below
               set stat = alterlist(oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[y]->NTE,(z+6))

               set oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[y]->NTE[z+1]->comment[1]->comment =
                  "Lab test performed by:"
               ;set lab mnemonic line
               set oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[y]->NTE[z+2]->comment[1]->comment =
                  concat("Lab Mnemonic:",char(32),trim(perform->info[1]->value))
               ;set lab name line
               set oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[y]->NTE[z+3]->comment[1]->comment =
                  trim(perform->info[2]->value)
               ;set lab address line
               set oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[y]->NTE[z+4]->comment[1]->comment =
                  trim(perform->info[3]->value)
               ;set lab city, state, zip line
               set oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[y]->NTE[z+5]->comment[1]->comment =
                  concat(trim(perform->info[4]->value),",", char(32),trim(perform->info[5]->value),
                  char(32),trim(perform->info[6]->value))
               ;set lab director's name
               set oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[y]->NTE[z+6]->comment[1]->comment =
                  trim(perform->info[7]->value)
            Else
               ;Make structure 6 times bigger for 6 elements below
               set stat = alterlist(oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[y]->NTE,(z+6))

               set oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[y]->NTE[z+1]->comment[1]->comment =
                  "Lab test performed by:"
               ;set lab mnemonic line
               set oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[y]->NTE[z+2]->comment[1]->comment =
                  concat("Lab Mnemonic:",char(32),trim(perform->info[1]->value))
               ;set lab name line
               set oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[y]->NTE[z+3]->comment[1]->comment =
                  trim(perform->info[2]->value)
               ;set lab address line
               set oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[y]->NTE[z+4]->comment[1]->comment =
                  trim(perform->info[3]->value)
               ;set lab city, state, zip line
               set oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[y]->NTE[z+5]->comment[1]->comment =
                  concat(trim(perform->info[4]->value),",", char(32),trim(perform->info[5]->value),
                  char(32),trim(perform->info[6]->value))
               ;set lab director's name
               set oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[y]->NTE[z+6]->comment[1]->comment =
                  trim(perform->info[7]->value)
            Endif

            for (z=1 to size(oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[y]->NTE,5))
               set oen_reply->RES_ORU_GROUP[x]->OBX_GROUP[y]->NTE[z]->set_id = cnvtstring(z)
            endfor
         endif ;filler_field2

         for (a=1 to size(oen_reply->RES_ORU_GROUP[x]->OBX_GROUP,5))
            If (TRIM(oen_reply->RES_ORU_GROUP [x]->OBX_GROUP [a]->OBX->abnormal_flag [1]->abnormal_flag) in ("HH", "LL", "AA"))
               Set oen_reply->RES_ORU_GROUP [x]->OBX_GROUP [a]->OBX->abnormal_flag [1]->abnormal_flag = "C"
            Endif
            If (oen_reply->RES_ORU_GROUP [x]->OBX_GROUP [a]->OBX->observation_res_status = "X")
               Set oen_reply->RES_ORU_GROUP [x]->OBX_GROUP [a]->OBX->observation_res_status = "F"
            Endif
         endfor
      Endif ;y
   endfor ;x

else ;ORU or ORM
;*************************
;**** ORM PROCESSING *****
;*************************

	;set oen_reply->CONTROL_GROUP[1]->MSH[1]->sending_application = "QUEST_INPT"
	
	execute oencpm_msglog("Reflex order encountered")
	execute oencpm_msglog build("ORM Processing Sending_APP= ", oen_reply->CONTROL_GROUP[1]->MSH[1]->sending_application , char(0))
	
	;Old RLI code requires "RLI" to be in Receiving Application AND Receiving Facility.
	set oen_reply->CONTROL_GROUP[1]->MSH[1]->receiving_facility = "RLI"
	set oen_reply->CONTROL_GROUP[1]->MSH[1]->receiving_application = "RLI"
	
   ;********************************* REFLEX SECTION ***************************************************************
   ;  if its a reflex order, pull in the specimen type and collection priority and start dt/tm
   ;  all are required to write the new order.  This section is in ORMORM
   ;****************************************************************************************************************
   ;***RLI logic processes reflex orders as ORU messages
   set oen_reply->CONTROL_GROUP[1]->MSH[1]->message_type->messg_type = "ORU"
   set oen_reply->CONTROL_GROUP[1]->MSH[1]->message_type->messg_trigger = "R01"

   for (x=1 to size(oen_reply->ORDER_GROUP [1]->OBR_GROUP,5))	     /*Order Group ORM Looping*/

     ;***  copy ORC-3 to OBR-3.  Sometimes OBR-3 has bogus data in it. 
      Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [x]->OBR->filler_ord_nbr->id = 
                                                oen_reply->ORDER_GROUP [1]->ORC [1]->filler_ord_nbr->id 

    ;copy short accession from OBR:19 to variable short_accn_num
      Set short_accn_num = oen_reply->ORDER_GROUP [1]->OBR_GROUP [x]->OBR->placer_field2      
		   					
   ;rebuild full accession in OBR 19 for accession matching
   Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [x]->OBR->placer_field2 = accRebuild(short_accn_num)

  ;** move doctor number from OBR-18 to OBR-16.  DANB_CT using External ID, sent in OBR-18 so Quest can return it.
     ;Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [x]->OBR->ord_provider->id_nbr = 
            ;oen_reply->ORDER_GROUP [1]->OBR_GROUP [x]->OBR->placer_field1 [1]->value 

    ; Set contrib_source = uar_get_code_by("DISPLAY", 73,"QUEST_INPT")
       
   ;***pull in the specimen type and collection priority and start dt/tm
   ;***all are required to write the new order

     select cva.alias
     from accession_order_r aor, order_detail od, code_value_alias cva
     plan aor
     where aor.accession = oen_reply->ORDER_GROUP [1]->OBR_GROUP [x]->OBR->placer_field2
     join od
     where od.order_id = aor.order_id and od.oe_field_meaning = "SPECIMEN TYPE"
     join cva
     where cva.code_value = od.oe_field_value and cva.code_set = 2052 and
      cva.contributor_source_cd = contrib_source
     detail
       oen_reply->ORDER_GROUP [1]->OBR_GROUP [x]->OBR->spec_source->spec_name_cd->identifier  = cva.alias
       
       ;execute oencpm_msglog build("Specimen Type = ", cva.alias , char(0))
       
     with nocounter

 select cva.alias
     from accession_order_r aor, order_detail od, code_value_alias cva
     plan aor
     where aor.accession = oen_reply->ORDER_GROUP [1]->OBR_GROUP [x]->OBR->placer_field2 
     join od
     where od.order_id = aor.order_id and od.oe_field_meaning = "COLLPRI"
     join cva
     where cva.code_value = od.oe_field_value and cva.code_set = 2054 and
      cva.contributor_source_cd = contrib_source
     detail
      oen_reply->ORDER_GROUP [1]->OBR_GROUP [x]->OBR->quantity_timing [1]->priority  = cva.alias
     with nocounter

     
     select o.current_start_dt_tm
     from orders o, accession_order_r aor
     plan aor
     where aor.accession = oen_reply->ORDER_GROUP [1]->OBR_GROUP [x]->OBR->placer_field2 
     join o
     where o.order_id = aor.order_id
     detail
       oen_reply->ORDER_GROUP [1]->OBR_GROUP [x]->OBR->quantity_timing [1]->start_dt_tm  =
         format(o.current_start_dt_tm, "YYYYMMDDHHMMSS;;D")
     with nocounter

   endfor ;x				  /* END order group ORM looping */

  endif ;ORU or ORM


;*************************
;**Subroutine accRebuild**
;*************************
subroutine accRebuild (_tAcc)
  set tAcc = fillstring (value (size (trim (_tAcc))), " ")
  set tAcc = _tAcc

  set uAcc = fillstring (20, " ")

  if (acc_setup->loaded = 0)
    select into "nl:" a.site_code_length, a.julian_sequence_length, a.year_display_length
    from accession_setup a
    where a.accession_setup_id = 72696.00
    detail
      acc_setup->loaded = 1
      acc_setup->site_len = a.site_code_length
      acc_setup->year_len = a.year_display_length
      acc_setup->jseq_len = a.julian_sequence_length
      acc_setup->min_len = acc_setup->site_len + acc_setup->jseq_len + 1
    with nocounter
  endif

  ;* Return the truncated accession number when the lookup of the ACCESSION_SETUP information failed.
  if (acc_setup->loaded = 0)
    return (tAcc)
  endif

  ;* Length of the truncated accession number.
  set tLen = size (tAcc, 1)

  ;* Return the truncated accession number when the length is less thanthe minimum.
  if (tLen < acc_setup->min_len)
    return (tAcc)
  endif

  set SITE_LENGTH = 5
  set YEAR_LENGTH = 4
  set JDAY_LENGTH = 3
  set JSEQ_LENGTH = 6
  set _site = fillstring (value (SITE_LENGTH), "0")
  set _year = fillstring (value (YEAR_LENGTH), " ")
  set _jday = fillstring (value (JDAY_LENGTH), "0")
  set _jseq = fillstring (value (JSEQ_LENGTH), "0")

  ;* Extract the site prefix.
  set tSite = substring (1, acc_setup->site_len, tAcc)

  ;* Create the site prefix with the leading zeros.
  if ((SITE_LENGTH - acc_setup->site_len) > 0)
    set _site = concat (substring (1, (SITE_LENGTH - acc_setup->site_len), _site),
      substring (1, acc_setup->site_len, tSite))
  endif

  ;* Extract the julian sequence.
  set tPos = tLen - acc_setup->jseq_len
  set tSeq = substring (tPos + 1, acc_setup->jseq_len, tAcc)

  ;* Create julian sequence with leading zeros.
  if (JSEQ_LENGTH > acc_setup->jseq_len)
    set _jseq = concat (substring (1, (JSEQ_LENGTH - acc_setup->jseq_len), _jseq),
      substring (1, acc_setup->jseq_len, tSeq))
  else
    set _jseq = tSeq
  endif

  ;* Initialize the year and julian day.

  set _dttm = cnvtdatetime (sysdate)
  set _year = cnvtstring (year (_dttm))

  if (julian (_dttm) < 100)
    set _jday = concat ("0", cnvtstring (julian (_dttm)))
  else
    set _jday = cnvtstring (julian (_dttm))
  endif

  ;* Extract the year and the julian day.

  set tJul = fillstring (value ((tPos - acc_setup->site_len)), " ")
  set tJul = substring ((acc_setup->site_len + 1), (tPos - acc_setup->site_len), tAcc)
  set tPos = size (tJul, 1) - JDAY_LENGTH

      ;* Extract the julian day.
  if (tPos > 0)
    ;* The accession was not truncated into the julian day.
    set _jday = substring (tPos + 1, JDAY_LENGTH, tJul)
    set _year =  concat (substring (1, (YEAR_LENGTH - tPos), _year), substring (1, tPos, tJul))
  else
    ;* The accession was truncated into the julian day.
    set _jday = concat (substring (1, (JDAY_LENGTH - size (tJul, 1)),_jday), tJul)
  endif

  set uAcc = concat (trim (uAcc), _site, _year, _jday, _jseq)
  return (uAcc)
end