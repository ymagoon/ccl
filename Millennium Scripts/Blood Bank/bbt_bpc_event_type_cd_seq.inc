 ;;Solution_Test/script/PathNet -- BB Transfusion/Bloodbankproductclass/BBT_BPC_EVENT_TYPE_CD_SEQ.INC Turn on black mode

/*~BB~************************************************************************
  *                                                                      *
  *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
  *                              Technology, Inc.                        *
  *       Revision      (c) 1984-1997 Cerner Corporation                 *
  *                                                                      *
  *  Cerner (R) Proprietary Rights Notice:  All rights reserved.         *
  *  This material contains the valuable properties and trade secrets of *
  *  Cerner Corporation of Kansas City, Missouri, United States of       *
  *  America (Cerner), embodying substantial creative efforts and        *
  *  confidential information, ideas and expressions, no part of which   *
  *  may be reproduced or transmitted in any form or by any means, or    *
  *  retained in any storage or retrieval system without the express     *
  *  written permission of Cerner.                                       *
  *                                                                      *
  *  Cerner is a registered mark of Cerner Corporation.                  *
  *                                                                      *
  ~BE~***********************************************************************/
/*****************************************************************************

        Source file name:       bbt_bpc_event_type_cd_seq.inc
        Object name:            <none>
        Request #:              <none>

        Product:                PathNet
        Product Team:           BB Transfusion
        HNA Version:            500
        CCL Version:            4.0

        Program purpose:        Retrieve event_type_cd and collation_seq
                                for all requested event_type_mean's for
                                blood bank product class

        Tables read:            code_value

        Tables updated:         <none>

        Executing from:         bbt_get_blood_product.prg and 
                                bbt_get_bp_by_person.prg

        Special Notes:          

******************************************************************************/
;~DB~************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *                                                                      *
;    *Mod Date     Engineer             Comment                             *
;    *--- -------- -------------------- ----------------------------------- *
;     000 03/10/98 Jon Weekes           Initial Release (Rev 7.2)           *
;     001 06/15/99 John Rieck           Added new state: Shipment In Process*
;     002 02/17/00 John Rieck           Added new state: Verified           *
;    *003 04/27/06 David Fifer          Added new states: Intransit and     *
;                                       Modified Product.                   *
;~DE~************************************************************************
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************


set assign_event_type_cd = 0.0                 ;1
set assign_collation_seq = 0
set quarantine_event_type_cd = 0.0             ;2
set quarantine_collation_seq = 0
set crossmatch_event_type_cd = 0.0             ;3
set crossmatch_collation_seq = 0
set dispense_event_type_cd = 0.0               ;4
set dispense_collation_seq = 0
set disposed_event_type_cd = 0.0               ;5
set disposed_collation_seq = 0
set transfer_event_type_cd = 0.0               ;6
set transfer_collation_seq = 0
set transfused_event_type_cd = 0.0             ;7
set transfused_collation_seq = 0
set modification_event_type_cd = 0.0           ;8
set modification_collation_seq = 0
set unconfirmed_event_type_cd = 0.0            ;9
set unconfirmed_collation_seq = 0
set autologous_event_type_cd = 0.0             ;10
set autologous_collation_seq = 0
set directed_event_type_cd = 0.0               ;11
set directed_collation_seq = 0
set available_event_type_cd = 0.0              ;12
set available_collation_seq = 0
set received_event_type_cd = 0.0               ;13
set received_collation_seq = 0
set destruction_event_type_cd = 0.0            ;14
set destruction_collation_seq = 0
set shipped_event_type_cd = 0.0                ;15
set shipped_collation_seq = 0
set in_progress_event_type_cd = 0.0            ;16
set in_progress_collation_seq = 0
set pooled_event_type_cd = 0.0                 ;17
set pooled_collation_seq = 0
set pooled_prod_event_type_cd = 0.0           ;18
set pooled_prod_collation_seq = 0
set confirmed_event_type_cd = 0.0              ;19
set confirmed_collation_seq = 0        
set drawn_event_type_cd = 0.0                  ;20
set drawn_collation_seq = 0
set tested_event_type_cd = 0.0                 ;21
set tested_collation_seq = 0            
set shipment_in_process_event_type_cd = 0.0    ;22                ;001
set shipment_in_process_collation_seq = 0                       ;001
set verified_event_type_cd = 0.0               ;23                ;002
set verified_collation_seq = 0                                  ;002
 
declare modified_prod_event_type_cd = f8 with protect, noconstant(0.0)    ;24
declare modified_prod_collation_seq = i4 with protect, noconstant(0)
declare in_transit_event_type_cd = f8 with protect, noconstant(0.0)       ;25
declare in_transit_collation_seq = i4 with protect, noconstant(0)
 
/*load the code values and collation_sequence numbers for the valid states*/
/*get the necessary event type code*/
select into "nl:"
       cv.code_value 
from 
      code_value cv
where cv.code_set = 1610
      and CNVTDATETIME(curdate,curtime3) >= cv.begin_effective_dt_tm
      and CNVTDATETIME(curdate,curtime3) <= cv.end_effective_dt_tm
      and cv.active_ind = 1               
detail
      if ((cv.cdf_meaning = "1") and (request->assign = 1))                 
         assign_event_type_cd = cv.code_value
         assign_collation_seq = cv.collation_seq
      elseif ((cv.cdf_meaning = "2") and (request->quarantine = 1))         
         quarantine_event_type_cd = cv.code_value
         quarantine_collation_seq = cv.collation_seq
      elseif ((cv.cdf_meaning = "3") and (request->crossmatch = 1))             
         crossmatch_event_type_cd = cv.code_value
         crossmatch_collation_seq = cv.collation_seq
      elseif ((cv.cdf_meaning = "4") and (request->dispense = 1))             
         dispense_event_type_cd = cv.code_value
         dispense_collation_seq = cv.collation_seq
      elseif ((cv.cdf_meaning = "5") and (request->disposed = 1))             
         disposed_event_type_cd = cv.code_value
         disposed_collation_seq = cv.collation_seq
      elseif ((cv.cdf_meaning = "6") and (request->transfer = 1))             
         transfer_event_type_cd = cv.code_value
         transfer_collation_seq = cv.collation_seq
      elseif ((cv.cdf_meaning = "7") and (request->transfused = 1))           
         transfused_event_type_cd = cv.code_value
         transfused_collation_seq = cv.collation_seq
      elseif ((cv.cdf_meaning = "8") and (request->modification = 1))         
         modification_event_type_cd = cv.code_value
         modification_collation_seq = cv.collation_seq
      elseif ((cv.cdf_meaning = "9") and (request->unconfirmed = 1))          
         unconfirmed_event_type_cd = cv.code_value
         unconfirmed_collation_seq = cv.collation_seq
      elseif ((cv.cdf_meaning = "10") and (request->autologous = 1))          
         autologous_event_type_cd = cv.code_value
         autologous_collation_seq = cv.collation_seq
      elseif ((cv.cdf_meaning = "11") and (request->directed = 1))            
         directed_event_type_cd = cv.code_value
         directed_collation_seq = cv.collation_seq
      elseif ((cv.cdf_meaning = "12") and (request->available = 1))           
         available_event_type_cd = cv.code_value
         available_collation_seq = cv.collation_seq
      elseif ((cv.cdf_meaning = "13") and (request->received = 1))        
         received_event_type_cd = cv.code_value
         received_collation_seq = cv.collation_seq
      elseif ((cv.cdf_meaning = "14") and (request->destruction = 1))         
         destruction_event_type_cd = cv.code_value
         destruction_collation_seq = cv.collation_seq
      elseif ((cv.cdf_meaning = "15") and (request->shipped = 1))            
         shipped_event_type_cd = cv.code_value
         shipped_collation_seq = cv.collation_seq
      elseif ((cv.cdf_meaning = "16") and (request->in_progress = 1))        
         in_progress_event_type_cd = cv.code_value
         in_progress_collation_seq = cv.collation_seq
      elseif ((cv.cdf_meaning = "17") and (request->pooled = 1))           
         pooled_event_type_cd = cv.code_value
         pooled_collation_seq = cv.collation_seq
      elseif ((cv.cdf_meaning = "18") and (request->pooled_prod = 1))           
         pooled_prod_event_type_cd = cv.code_value
         pooled_prod_collation_seq = cv.collation_seq
      elseif ((cv.cdf_meaning = "19") and (request->confirmed = 1))            
         confirmed_event_type_cd = cv.code_value
         confirmed_collation_seq  = cv.collation_seq        
      elseif ((cv.cdf_meaning = "20") and (request->drawn = 1))
         drawn_event_type_cd = cv.code_value
         drawn_collation_seq = cv.collation_seq
      elseif ((cv.cdf_meaning = "21") and (request->tested = 1))
         tested_event_type_cd = cv.code_value
         tested_collation_seq = cv.collation_seq
      elseif ((cv.cdf_meaning = "22") and (request->shipment_in_process = 1))   ;001
         shipment_in_process_event_type_cd = cv.code_value                      ;001
         shipment_in_process_collation_seq = cv.collation_seq                   ;001
      elseif ((cv.cdf_meaning = "23") and (request->verified = 1))              ;002
         verified_event_type_cd = cv.code_value                                 ;002
         verified_collation_seq = cv.collation_seq                              ;002
      elseif ((cv.cdf_meaning = "24") and (request->modified_prod = 1))
         modified_prod_event_type_cd = cv.code_value
         modified_prod_collation_seq = cv.collation_seq
      elseif ((cv.cdf_meaning = "25") and (request->intransit = 1))
         in_transit_event_type_cd = cv.code_value
         in_transit_collation_seq = cv.collation_seq
      endif
with nocounter

/* END Include */

;Generated by GNU enscript 1.6.4.
