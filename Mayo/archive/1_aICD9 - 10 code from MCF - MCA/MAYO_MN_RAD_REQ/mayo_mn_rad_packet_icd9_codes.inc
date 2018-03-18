/*~BB~************************************************************************
      *                                                                      *
      *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
      *                              Technology, Inc.                        *
      *       Revision      (c) 1984-1995 Cerner Corporation                 *
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
 
        Source file name:       rad_rpt_packet_get_info.inc
        Object name:            n/a
        Request #:              multiple
 
        Product:                ?
        Product Team:           Radnet
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        gather information for printing programs
 
        Tables read:            many
 
        Tables updated:         ?
        Executing from:         ?
 
        Special Notes:          ?
 
********************************************************************************/
;~DB~****************************************************************************
;*                      GENERATED MODIFICATION CONTROL LOG                      *
;********************************************************************************
;*Mod Date     Feature Engineer             Comment                             *
;*--- -------- ------- -------------------- ----------------------------------- *
; ### 08/19/04         Tammy Baack/Sandra Prow    Initial Release               *
; 001 01/20/06 0078168 Tammy Baack          call echo changes only              *
;*002 01/25/06 0078168 Sean Turk                        CR 1-577563874, changes to get icd9 codes printing
;                                                                                       correctly, taking action sequences into
;                                                                                       account.
;~DE~****************************************************************************
 
 
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************
 
/*************************************************
* select to get multiple icd9 codes              *
**************************************************/
declare source_voc_cd = f8 with public,
                 noconstant(uar_get_code_by( "MEANING", 400, "ICD9"))
free record icd9        ;002
record icd9
 ( 1 exam [*]
     2 code [*]
       3 desc = vc
       3 value = vc
)
 
select into "nl:"
        nm.source_string,
        nm.nomenclature_id,
        od.oe_field_display_value,
        od.oe_field_value ,     ;002
        od.order_id     ;002
 
from
   (dummyt d1 with seq = value(max_page_cnt)),
   (dummyt d2 with seq = value(max_exam_cnt)),
   order_detail od,
   nomenclature nm
 
plan d1
     where d1.seq <=
               size(data->req[req_ndx]->sections[sect_ndx]->exam_data,5)
join d2
     where d2.seq <=
           size(data->req[req_ndx]->sections[sect_ndx]->exam_data[d1.seq]
                                  ->for_this_page,5)
join od
        where od.order_id = data->req[req_ndx]->sections[sect_ndx]->
                exam_data[d1.seq]->for_this_page[d2.seq]->order_id
        and od.oe_field_meaning = "ICD9"
join nm
        ;002 where nm.nomenclature_id = od.oe_field_value
        where nm.nomenclature_id = outerjoin(od.oe_field_value) ;002
        ;002 and nm.primary_vterm_ind = 1
    and nm.primary_vterm_ind = outerjoin(1)     ;002
        ;002 and nm.source_vocabulary_cd = source_voc_cd
        and nm.source_vocabulary_cd = outerjoin(source_voc_cd) ;002
      ;002 and nm.active_ind = 1
    and nm.active_ind = outerjoin(1)    ;002

order by od.order_id, od.action_sequence desc   ;002
 
head report
count = 0       ;002
max_action_seq = 0      ;002
 
head od.order_id        ;002
count = count +1        ;002
max_action_seq = od.action_sequence     ;002
if (mod(count, 50) = 1) ;002
        stat = alterlist(icd9->exam, count + 49)        ;002
endif   ;002
tmb_idx = 0
 
detail
if (od.action_sequence = max_action_seq)        ;002
tmb_idx = tmb_idx + 1
if (mod(tmb_idx, 10) = 1)       ;002
;002 stat = alterlist(icd9->exam,d2.seq)
;002    stat = alterlist(icd9->exam[d2.seq]->code,tmb_idx + 9)
stat = alterlist(icd9->exam[count]->code,tmb_idx + 9)   ;002
endif   ;002
;002 icd9->exam[d2.seq]->code[tmb_idx]->value = nm.source_identifier
icd9->exam[count]->code[tmb_idx]->value = nm.source_identifier  ;002
;002 stat = alterlist(icd9->exam[d2.seq]->code,tmb_idx)
;002 icd9->exam[d2.seq]->code[tmb_idx]->desc = nm.source_string
icd9->exam[count]->code[tmb_idx]->desc = nm.source_string       ;002
endif   ;002
 
call echo("made it after detail in icd9")
call echo(build("icd9 code: ", icd9->exam[count]->code[tmb_idx]->value)) ;001
call echo(build("icd9 desc: ", icd9->exam[count]->code[tmb_idx]->desc)) ;001
;001 call echo(build("icd9 code: ", icd9->exam[d1.seq]->code[tmb_idx]->value))
;001 call echo(build("icd9 desc: ", icd9->exam[d1.seq]->code[tmb_idx]->desc))
foot od.order_id        ;002
stat = alterlist(icd9->exam[count]->code, tmb_idx)      ;002
 
foot report     ;002
stat = alterlist(icd9->exam, count)     ;002
 
with nocounter


