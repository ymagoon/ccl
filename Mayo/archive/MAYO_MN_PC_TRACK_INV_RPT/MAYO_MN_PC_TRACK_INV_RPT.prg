/*~BB~************************************************************************
   *                                                                           *
   * Copyright Notice: (c) 1983 Laboratory Information Systems &            *
   *               Technology, Inc.                                            *
   *    Revision   (c) 1984-2011 Cerner Corporation                         *
   *                                                                           *
   * Cerner (R) Proprietary Rights Notice: All rights reserved.             *
   * This material contains the valuable properties and trade secrets of     *
   * Cerner Corporation of Kansas City, Missouri, United States of            *
   * America (Cerner), embodying substantial creative efforts and            *
   * confidential information, ideas and expressions, no part of which      *
   * may be reproduced or transmitted in any form or by any means, or          *
   * retained in any storage or retrieval system without the express           *
   * written permission of Cerner.                                            *
   *                                                                           *
   * Cerner is a registered mark of Cerner Corporation.                     *
   *                                                                           *
 ~BE~***********************************************************************/
 
/*****************************************************************************
 
    Source file name:    mayo_mn_pc_track_inv_rpt.prg
    Object name:         mayo_mn_pc_track_inv_rpt
 
    Product:             Ambulatory Custom Programming Services
    Product Team:        Ambulatory Custom Programming Services
 
    Program purpose:     Track Invitation Status Changes
 
    Executing from:      Explorer menu
 
*/
;~DB~************************************************************************
;  *           GENERATED MODIFICATION CONTROL LOG                           *
;  ************************************************************************
;       *                                                                        *
;     * Mod    Feature  Date       Engineer      	 Comment                     *
;     * ---    ------- ---------- -------------- 	---------------------------- *
;       000             09/05/2014  SY027079         AMBCPS-146 Track Invitation
;                                                    status changes
;
;
;                                                                                *
 
;~DE~************************************************************************
;~END~ ****************** END OF ALL MODCONTROL BLOCKS ********************
 
drop program mayo_mn_pc_track_inv_rpt go
create program mayo_mn_pc_track_inv_rpt
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Begin Date" = "CURDATE"
	, "End Date" = "CURDATE"
 
with OUTDEV, beginDate, endDate
 
 
/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/
%i ccluserdir:sc_cps_parse_date_subs.inc
 
/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
declare 268_YES = f8 with Constant(uar_get_code_by("MEANING",268,"YES")),protect
 
declare begin_dt_tm = dq8 with noconstant(0.0), public
declare end_dt_tm = dq8 with noconstant(0.0), public
declare s_cnt             = i4  with protect, noconstant(0)
 
/**************************************************************
; DVDev Start Coding
**************************************************************/
 
set begin_dt_tm = ParseDatePrompt($beginDate, curdate, 000000)
set end_dt_tm = ParseDatePrompt($endDate, curdate, 235959)
 
 
free record inv_rec
record inv_rec
(
 1 cnt = i4
 1 pat_list[*]
   2 pat_name = vc
   2 person_id = f8
   2 comm[*]
     3 communication_id = f8
     3 trigger_id = f8
     3 program_name = vc
     3 status_flag = i2
     3 method_flag = vc
     3 send_dt_tm = vc
     3 satisfaction_dt_tm = vc
)
 
 
/*****Initial Query*****/
 
select into "nl:"
from
   invtn_communication ic
   , invtn_invitation_action iia
   , invtn_program ip
   , hm_recommendation_action hra
   , person p
plan ic
   where ic.status_flag = 4
   and ic.sent_dt_tm between cnvtdatetime(begin_dt_tm) and cnvtdatetime(end_dt_tm)
   and ic.active_ind = 1
join iia
   where iia.person_id = ic.person_id
   and iia.program_id = ic.program_id
   and iia.trigger_entity_id > 0
   ;and iia.person_id = 9744329
join ip
   where ip.program_id = iia.program_id
join hra
   where hra.recommendation_action_id = iia.trigger_entity_id
join p
   where p.person_id = iia.person_id
   and p.deceased_cd != 268_YES
order by
   p.person_id
   ,ic.communication_id desc
;   ,iia.invitation_action_id
   ,ic.sent_dt_tm desc
head report
   p_cnt = 0
   ;s_cnt = 0
head p.person_id
   p_cnt = p_cnt+1
   if(mod(p_cnt,100)=1)
        stat = alterlist(inv_rec->pat_list,p_cnt+99)
   endif
 
   inv_rec->pat_list[p_cnt]->person_id = p.person_id
   inv_rec->pat_list[p_cnt]->pat_name = trim(p.name_full_formatted,3)
   c_cnt = 0
head ic.communication_id
   c_cnt = c_cnt+1
   if(mod(c_cnt,10)=1)
      stat = alterlist(inv_rec->pat_list[p_cnt]->comm,c_cnt+9)
   endif
   inv_rec->pat_list[p_cnt]->comm[c_cnt].communication_id = ic.communication_id
   inv_rec->pat_list[p_cnt]->comm[c_cnt].status_flag = ic.status_flag
   inv_rec->pat_list[p_cnt]->comm[c_cnt].program_name = ip.program_name
   inv_rec->pat_list[p_cnt]->comm[c_cnt].method_flag = if(ic.method_flag = 0) "Printed Letter" else "Patient Portal" endif
   inv_rec->pat_list[p_cnt]->comm[c_cnt].trigger_id = iia.trigger_entity_id
   inv_rec->pat_list[p_cnt]->comm[c_cnt].send_dt_tm = format(ic.sent_dt_tm,"MM/DD/YY;;D")
   inv_rec->pat_list[p_cnt]->comm[c_cnt].satisfaction_dt_tm = format(hra.satisfaction_dt_tm,"MM/DD/YY;;D")
   ;s_cnt = s_cnt+1
   ;set s_cnt = s_cnt
foot ic.communication_id
   null
foot p.person_id
   stat = alterlist(inv_rec->pat_list[p_cnt]->comm,c_cnt)
foot report
   stat = alterlist(inv_rec->pat_list,p_cnt)
   inv_rec->cnt = p_cnt
with nocounter
 
;call echo(build2("s_cnt:"s_cnt))
 
/*****Output*****/
if(inv_rec->cnt>0)
 
SELECT INTO $OUTDEV
	;INV_REC_CNT = INV_REC->cnt
	 PATIENT_NAME = SUBSTRING(1, 30, INV_REC->pat_list[D1.SEQ].pat_name)
	, PERSON_ID = INV_REC->pat_list[D1.SEQ].person_id
	, TRIGGER_ID = INV_REC->pat_list[D1.SEQ].comm[D2.SEQ].trigger_id
	, STATUS_FLAG = INV_REC->pat_list[D1.SEQ].comm[D2.SEQ].status_flag
	, METHOD_FLAG = SUBSTRING(1, 50,INV_REC->pat_list[D1.SEQ].comm[D2.SEQ].method_flag)
	, SEND_DT_TM = SUBSTRING(1, 30, INV_REC->pat_list[D1.SEQ].comm[D2.SEQ].send_dt_tm)
	, SATISFACTION_DT_TM = SUBSTRING(1, 30, INV_REC->pat_list[D1.SEQ].comm[D2.SEQ].satisfaction_dt_tm)
	, PROGRAM_NAME = SUBSTRING(1, 50, INV_REC->pat_list[D1.SEQ].comm[D2.SEQ].program_name)
 
FROM
	(DUMMYT   D1  WITH SEQ = VALUE(SIZE(INV_REC->pat_list, 5)))
	, (DUMMYT   D2  WITH SEQ = 1)
 
PLAN D1 WHERE MAXREC(D2, SIZE(INV_REC->pat_list[D1.SEQ].comm, 5))
JOIN D2
 
WITH NOCOUNTER, SEPARATOR=" ", FORMAT
 
;
;SELECT INTO $OUTDEV
;	PERSON_ID = INVITATION_REC->pat_list[D1.SEQ].person_id
;	, PATIENT_NAME = SUBSTRING(1, 50, INVITATION_REC->pat_list[D1.SEQ].pat_name)
;	, TRIGGER_ID = INVITATION_REC->pat_list[D1.SEQ].trigger_id
;	, STATUS_FLAG = INVITATION_REC->pat_list[D1.SEQ].status_flag
;	, METHOD_FLAG = INVITATION_REC->pat_list[D1.SEQ].method_flag
;	, SEND_DT_TM = SUBSTRING(1, 30, INVITATION_REC->pat_list[D1.SEQ].send_dt_tm)
;	, SATISFACTION_DT_TM = SUBSTRING(1, 30, INVITATION_REC->pat_list[D1.SEQ].satisfaction_dt_tm)
;
;FROM
;	(DUMMYT   D1  WITH SEQ = VALUE(SIZE(INVITATION_REC->pat_list, 5)))
;
;PLAN D1
;
;
;WITH NOCOUNTER, SEPARATOR=" ", FORMAT
;
else
select into $OUTDEV
	from dummyt d
	plan d
	detail
	  row 1 col 1  "NO PATIENTS AVAILABLE FOR THE DATE RANGE SELECTED"
	  row + 2
	  call center("***** END OF REPORT *****",0,130)
with nocounter
endif
 
 
/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
call echorecord(inv_rec)
 
;execute mayo_mn_pc_track_inv_rpt "MINE","09-SEP-2014","09-SEP-2014" go
 
end
go
 
