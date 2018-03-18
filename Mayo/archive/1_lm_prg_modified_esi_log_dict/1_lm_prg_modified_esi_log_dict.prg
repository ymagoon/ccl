drop program 1_lm_prg_modified_esi_log_dict go
create program 1_lm_prg_modified_esi_log_dict
 
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
 
        Source file name:       ESI_LOG_HL7.PRG
        Object name:            ESI_LOG_HL7
 
 
        Product:                ESI
        Product Team:           Open Port Inbound
        HNA Version:            500
        CCL Version:            7.7.2
 
        Program purpose:        This will audit the ESI_LOG table and
                                allow users to search by specific
                                criteria.  Report will include the HL7
                                message logged in oen_txlog.
 
        Tables read:            ESI_LOG
                                OEN_TXLOG
 
        Tables updated:         none
 
        Executing from:         CCL
 
        Special Notes:
 
******************************************************************************/
;~DB~************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *                                                                      *
;    *Mod Date     Engineer             Comment                             *
;    *--- -------- -------------------- ----------------------------------- *
;     000 06/14/99 Joyce Whitsitt       Initial Write
;     001 09/10/02 mv8246               Change curaccept to accept > 7 digit values
;     002 02/19/03 Katie Peterson       Add active_ind = 1 check
;                                       on the ESI_LOG table.
;     003 04/24/03 James Grosser        Ensure that ESI_LOG returns the correct HL7 message
;     004 04/24/03 James Grosser        Allow esi_log to display contributor_system up to 10 characters
;     005 01/19/05 lh5564               Added performance enhancements
;     006 09/02/05 ba011849             64851 Change number of digits for doubles *
;     007 11/15/05 ss6485               66241 - Correction to support large sequences
;     008 2/6/07   ml7886               removed user input and set for use in ops
;~DE~************************************************************************
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************
 
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
 
with OUTDEV
 
 
   ; PAINT
;declare values
DECLARE v_cont_system = f8
DECLARE v_printer = c20
DECLARE v_error_stat = i2
DECLARE seq = i4
DECLARE cont_display = c20
 
RECORD  REPLY  (
 1  STATUS_DATA
 2  STATUS  =  C1
 2  SUBEVENTSTATUS [ 1 ]
 3  OPERATIONNAME  =  C25
 3  OPERATIONSTATUS  =  C1
 3  TARGETOBJECTNAME  =  C25
 3  TARGETOBJECTVALUE  =  VC )
 
RECORD SCRIPT (
1 version = c1
)
 
 
; Statement to interact with System Operations
    SET REPLY->STATUS_DATA->STATUS = "F"
 
; Initialize Values
    SET MESSAGE = 20
    SET v_cont_system = 0.0   ;; 007
    SET v_error_stat = 1
    SET v_start_date = FORMAT(CURDATE,"DD-MMM-YYYY;;D")
    SET v_printer = "MINE"
    SET seq=0
    set cont_display = fillstring(20," ")
    SET v_info = 0.0                                                           ;002
    SET v_success = 0.0                                                        ;002
    SET v_warning = 0.0                                                        ;002
    SET v_retry = 0.0                                                          ;002
    SET v_failure = 0.0                                                        ;002
    SET v_terminal = 0.0                                                       ;002
    SET v_terminate = 0.0                                                      ;002
    SET STAT = UAR_GET_MEANING_BY_CODESET(27400, "INFO", 1, v_info)            ;002
    SET STAT = UAR_GET_MEANING_BY_CODESET(27400, "SUCCESS", 1, v_success)      ;002
    SET STAT = UAR_GET_MEANING_BY_CODESET(27400, "WARNING", 1, v_warning)      ;002
    SET STAT = UAR_GET_MEANING_BY_CODESET(27400, "RETRY", 1, v_retry)          ;002
    SET STAT = UAR_GET_MEANING_BY_CODESET(27400, "FAILURE", 1, v_failure)      ;002
    SET STAT = UAR_GET_MEANING_BY_CODESET(27400, "TERMINAL", 1, v_terminal)    ;002
    SET STAT = UAR_GET_MEANING_BY_CODESET(27400, "TERMINATE", 1, v_terminate)  ;002
    SET script->version = "1"
    if ( script->version )                          ;003
      SET where1 = "oen.tx_key = outerjoin( el.tx_key )"          ;003 ;; 007
    else                                              ;003
       SET where1 = "oen.msgid = outerjoin( el.msgid )"            ;003 ;; 007
    endif                                             ;003
   ; DECLARE dSUSPENDEDCd = f8 with constant(uar_get_code_by("MEANING", 48, "SUSPENDED")), protect ; 005
/*   008 commented out for mod to make this an ops job
;Main Routine
    ;CALL CLEAR (1,1)
    ;CALL BOX (1,1,17,80)
    ;CALL TEXT (2,20, "ESI LOG Report with HL7 Message")
    ;CALL TEXT (3,20, " for Single Contibutor System")
    ;CALL TEXT (5,5,"Enter Contributor System:")
    ;CALL TEXT (6,5,"Enter Error Level (1,2,3): ")
 
    ;CALL TEXT(8,5, "Beginning Date:")
    ;CALL TEXT(9,5, "Beginning Time:")
    ;CALL TEXT(10,5,"   Ending Date:")
    ;CALL TEXT(11,5,"   Ending Time:")
 
    ;CALL TEXT(13,5,"Enter Printer: ")
    ;CAll VIDEO(R)
    ;CALL TEXT (16,7,"Help Available")
 
    ;SET HELP  = POS (5,30,15,50) */
    ;005 use uar instead of code value table
  ;  set help = select into "nl:"
  ;         code_val = format( cs.contributor_system_cd, "###############" ) , ;; 007
  ;         DISPLAY = uar_get_code_display( cs.contributor_system_cd)
  ;         from contributor_system cs
  ;         where cs.active_ind = 1 ; 005
				;OR (cs.active_ind = 0 AND cs.active_status_cd = dSUSPENDEDCd) ; 005
  ;         with nocounter
   ; SET VALIDATE = SELECT INTO "nl:"
    ;                     cv.code_value
     ;              FROM  code_value cv
      ;             WHERE (cv.code_value = cnvtreal( $3 ) and ;; 007
       ;                   cv.code_set =89)
        ;           WITH NOCOUNTER
    SET VALIDATE = 2
     ;        CALL ACCEPT (5,35,"N(15);hC") ;;001 ;; 007
             SET v_cont_system = cnvtreal( 3374509 ) ;; 007
/* 008 - commented out
    ;SET VALIDATE OFF
    ;SET HELP OFF
 
 
 
    ;SET HELP  = POS (7,30,15,40)
    ;SET HELP  = FIX ('1 "Failures Only",2 "Warnings Only",3 "Failures or Warnings"')
    ;         CALL ACCEPT (6,35,"9", v_error_stat
    ;              WHERE CURACCEPT in (1,2,3))
    ;         SET v_error_stat = cnvtint ( $1 )
    ;SET HELP OFF
 
    ;CALL VIDEO(N)
    ;CALL CLEAR( 16,2,78)
    ;CALL TEXT(16,7,"Enter beginning date in format MM/DD/CCYY" )
    ;CALL ACCEPT(8,35,"99D99D9999;CD",format(curdate,"MM/DD/YYYY;;D")) */
        SET beg_date = FORMAT((CURDATE-1), "MM/DD/YYYY;;D");curaccept
/*008 commented out
    ;CALL CLEAR( 16,2,78)
    ;CALL TEXT(16,7,"Enter beginning time in format HH:MM ")
    ;CALL ACCEPT(9,35,"99D99;CD",format(0,"HH:MM;2;M")) **/
        SET beg_time = FORMAT(CURTIME3, "HH:MM;2;M");curaccept
/* 008 commented out
    ;CALL CLEAR( 16,2,78)
    ;CALL TEXT(16,7,"Enter ending date in format MM/DD/CCYY ")
    ;CALL ACCEPT(10,35,"99D99D9999;CD",format(curdate,"MM/DD/YYYY;;D")) **/
        SET end_date = FORMAT(CURDATE, "MM/DD/YYYY;;D");curaccept
/* 008 commented out
    ;CALL CLEAR( 16,2,78)
    ;CALL TEXT(16,7,"Enter ending time in format HH:MM ")
    ;CALL ACCEPT(11,35,"99D99;CD",format(curtime3,"HH:MM;2;M")) **/
        SET end_time = FORMAT(CURTIME3, "HH:MM;2;M");curaccept
 
        SET bdate = cnvtdate2(beg_date,"MM/DD/YYYY")
        SET btime = cnvtint(concat(substring(1,2,beg_time),
                                   substring(4,2,beg_time)))
        SET edate = cnvtdate2(end_date,"MM/DD/YYYY")
        SET etime = cnvtint(concat(substring(1,2,end_time),
                                   substring(4,2,end_time)))
/* 008 commented out
    ;CALL CLEAR( 16,2,78)
    ;CALL TEXT(16,7,"Enter Printer ID or default 'MINE' ")
    ;CALL ACCEPT (13,35,"PPPP;CU",v_printer) **/
    SET v_printer = trim($OUTDEV);curaccept
 
    ;CALL CLEAR (1,1)  ;008
 
; End of screen accepts
; Begin Processing
 
 
    if (v_cont_system > 0)
       select into "nl:"
              m.display
         from  contributor_system m
         where m.contributor_system_cd = v_cont_system
         detail
              cont_display = m.display
         with  nocounter
    endif
    IF (v_error_stat = 1)
           set v_error_lit = "ESI_STAT_FAILURE"
           set v_error_lit2 = "ESI_STAT_FAILURE"
           set v_domain_error1 = v_failure             ;002
           set v_domain_error2 = v_failure             ;002
      elseif
       (v_error_stat = 2)
           set v_error_lit = "ESI_STAT_WARNING"
           set v_error_lit2= "ESI_STAT_WARNING"
           set v_domain_error1 = v_warning             ;002
           set v_domain_error2 = v_warning             ;002
      elseif
       (v_error_stat = 3)
           set v_error_lit = "ESI_STAT_FAILURE"
           set v_error_lit2= "ESI_STAT_WARNING"
           set v_domain_error1 = v_failure             ;002
           set v_domain_error2 = v_warning             ;002
    ENDIF
 
 
    SELECT
         INTO $OUTDEV
             el.contributor_system_cd "############",    ;004 ;; 007
             el.updt_dt_tm,
             el.person_id "############",  ;006    ;; 007
             el.encntr_id "############",  ;006    ;; 007
             el.order_id  "############",  ;006    ;; 007
             el.event_id  "############",  ;006    ;; 007
             el.sch_event_id "############",  ;006 ;; 007
             Name=substring(1,25,el.name_full_formatted),
             Event=concat(trim(el.msh_msg_type),"^",
                          trim(el.msh_msg_trig)),
             el.msh_ctrl_ident,
             el.msgid,
             el.start_dt_tm "MM/DD/YY HH:MM:SS;;Q",
             el.msh_sending_app,
             el.esi_instance "##",
             el.error_text,
             el.domain_error_text,                              ;002
             Pid=substring(1,5,oen.tx_key),
             T_Key=substring(6,12,oen.tx_key),
             T_Seq=substring(18,10,oen.tx_key),
             oen.msg_text,
             oen.msgid,
             oen.part_size,
             m.display
 
    FROM     esi_log el,
             oen_txlog oen,
             contributor_system m
 
         PLAN el
           WHERE (el.contributor_system_cd=v_cont_system) and
                ((el.create_dt_tm >= cnvtdatetime(bdate,btime)) and ;; use the create date time since it is indexed
                 (el.create_dt_tm <= cnvtdatetime(edate,etime))) and
                 (el.error_stat=v_error_lit or
                  el.error_stat=v_error_lit2 or
                  el.domain_error_stat_cd=v_domain_error1 or     ;002
                  el.domain_error_stat_cd=v_domain_error2) and   ;002
                  (el.active_ind = 1)                            ;002
 
         JOIN m where el.contributor_system_cd=m.contributor_system_cd
         JOIN oen
         ;003  WHERE oen.msgid = el.msgid
         WHERE parser(where1)      ;003
 
;     ORDER BY el.updt_dt_tm  ;removed since no index on updt_dt_tm
 
    HEAD REPORT
            LINE=FILLSTRING(128,"-")               ;INIT THE LINE VARIABLE
            TODAY=FORMAT(CURDATE,"MM-DD-YYYY;;D")  ;INIT/FORMAT CURR DATE
            TIME =FORMAT(CURTIME, "HH:MM;;S")      ;INIT/FORMAT CURR TIME
            ROW 1
            COL 45 "ESI LOG REPORT with HL7 Message"
            ROW +1
            COL 1  "Contributor System: "
            COL +1 v_cont_system "############"   ;004 ;; 007
            COL +2 cont_display
            COL 105 "Created: "
            COL +1 TODAY
            ROW +1
            COL 1  "Status: "
                IF (v_error_stat = 3)
                   COL +1 "Failures and Warnings"
                elseif (v_error_stat = 1 or v_error_stat = 2)
                   COL +1 v_error_lit
                   COL +1 v_domain_error1                        ;002
                ENDIF
            COL 105 "Time:    "
            COL +1 TIME
            ROW +1
            COL 1  "Date Range: "
            COL 13  BEG_DATE
            COL 24  BEG_TIME
            COL 30  "-"
            COL 32  END_DATE
            COL 43  END_TIME
    HEAD PAGE
            COL 105 "Page: "
            COL +1 CURPAGE                        ;PRINT CURR PAGE NUMBER
            ROW +1
            COL 0 LINE
            ROW +1
            COL 1  "MSH Event"
            COL 11 "Msgid"
            COL 31 "DATE/TIME"
            COL 52 "Name"
            COL 77 "Person_id"  ;006
            COL 91 "Encntr_id"  ;006   ;; 007
            COL 105 "Order_id " ;006   ;; 007
            COL 119 "Event_id " ;006   ;; 007
            ROW +1
            COL 0  LINE
            ROW +1
    HEAD    el.contributor_system_cd
            ROW +1
    DETAIL
            COL 1  Event
                 if (el.msgid > " ")
                    COL 11 el.msgid
                 elseif (el.msh_ctrl_ident > " ")
                    COL 11 el.msh_ctrl_ident
                 endif
            COL 31 el.start_dt_tm
            COL 51 Name
            COL 77 el.person_id  ;006
            COL 91 el.encntr_id  ;006  ;; 007
            COL 105 el.order_id  ;006  ;; 007
            COL 119 el.event_id  ;006  ;; 007
            ROW +1
                 if (el.error_stat = "ESI_STAT_FAILURE")
                    COL 2 "(F)"
                    COL 7 el.esi_instance
                  elseif
                    (el.error_stat = "ESI_STAT_WARNING")
                    COL 2 "(W)"
                    COL 7 el.esi_instance
                 endif
 
            lineoffset = 1
            pos = findstring("   ", el.error_text)
            WHILE (lineoffset < pos and pos > 1)
                temp = substring(lineoffset, 116, el.error_text)
                COL 10 temp
                lineoffset = lineoffset + 116
                ROW +1
            ENDWHILE
 
            ;002 begins
            ROW +1
                 if( el.domain_error_stat_cd > 0 )
                     if (el.domain_error_stat_cd = v_failure)
                        COL 2 "(F)"
                        COL 7 el.esi_instance
                     elseif
                        (el.domain_error_stat_cd = v_warning)
                        COL 2 "(W)"
                        COL 7 el.esi_instance
                     endif
 
                    lineoffset = 1
                    pos = findstring("   ", el.domain_error_text)
                    WHILE (lineoffset < pos and pos > 1)
                        temp = substring(lineoffset, 116, el.domain_error_text)
                        COL 10 temp
                        lineoffset = lineoffset + 116
                        ROW +1
                    ENDWHILE
                endif
            ;002 ends
 
            lineoffset = 1
            message_size = cnvtint(oen.part_size)
            if (message_size > 0)
                COL 8 "PID: "
                COL +1 Pid
                COL +5 "TX Key: "
                COL +1 T_Key
                COL +5 "Seq: "
                COL +1 T_Seq
                ROW +1
            ENDIF
 
            temp = " "
            WHILE (lineoffset < message_size and message_size > 0)
                temp = substring(lineoffset, 116, oen.msg_text)
                temp = replace(temp,char(13)," ",0)
                COL 5 temp
                lineoffset = lineoffset + 116
                ROW +1
            ENDWHILE
 
            ROW +1
            seq=seq+1
    FOOT REPORT
            ROW +2
            COL +5 "Total Message Count: "
            COL +1  seq "#######"
    WITH    MAXCOL=150, ;; 007
            Filesort=2,
            nullreport,
            FORMFEED=NONE,
            nocounter
 
     ;; statement included to interact with System Operations
    SET REPLY->STATUS_DATA->STATUS = "S"
    END
    GO
 
 
 
