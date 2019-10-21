drop program bc_mp_mvs_procedure_24:dba go
create program bc_mp_mvs_procedure_24:dba
/**************************************************************************************************
              Purpose: Displays the Procedure and Demographics
     Source File Name: bc_mp_mvs_procdem_24.PRG
              Analyst: MediView Solutions
          Application: PowerChart, SurgiNet
  Execution Locations:
            Request #:
      Translated From:
        Special Notes:
**************************************************************************************************/
/**************************************************************************************************
  Mod  Date            Engineer                Description
   ---  --------------- ----------------------- ------------------------------------------------
    1   08/23/2011      MediView Solutions 	    Initial Release
    2   04/26/2019      Roger Harris            Ticket 825712 - Add procedure comments
    3   06/18/2019      Roger Harris            Ticket INC0050961 - Add filter to get only active procedures

**************************************************************************************************/

prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "USERID" = 0
	, "PERSONID" = 0
	, "ENCNTRID" = 0
	, "OPTIONS" = ""

with OUTDEV, USERID, PERSONID, ENCNTRID, OPTIONS

record procedure(
	1 person_id = f8
	1 encntr_id = f8
	1 cnt = i4
	1 proc[*]
		2 surg_case_id = f8
		2 procedure = vc
		2 surgeon = vc
		2 surg_date = vc
		2 primary = i1
		2 anesthesia = vc
        2 comments  = vc
)

Declare num = i2

set procedure->person_id = $PERSONID
set procedure->encntr_id = $ENCNTRID

select into 'nl:'
    procedure = uar_get_code_display(scp.surg_proc_cd)

from surgical_case sc,
	surg_case_procedure scp,
	orders o,
	prsnl p
plan sc
	where sc.person_id = $PERSONID
	and sc.encntr_id = $ENCNTRID
	and sc.cancel_reason_cd = 0
join scp
	where scp.surg_case_id = sc.surg_case_id
      And scp.active_ind = 1
join o
	where o.order_id = scp.order_id
join p
	where p.person_id = scp.sched_primary_surgeon_id

order by scp.sched_primary_ind desc, procedure

;detail
head scp.surg_case_proc_id
	cnt = procedure->cnt + 1
	procedure->cnt = cnt
	stat = alterlist(procedure->proc, cnt)
	procedure->proc[cnt].surg_case_id = sc.surg_case_id
	if (o.order_id = 0.0)
		procedure->proc[cnt].procedure = uar_get_code_display(scp.surg_proc_cd)
	else
		procedure->proc[cnt].procedure = o.order_mnemonic
	endif
	if (p.person_id > 0.0)
		procedure->proc[cnt].surgeon = concat(trim(p.name_last),", ", trim(p.name_first))
	endif
	procedure->proc[cnt].surg_date = format(sc.sched_start_dt_tm, "mm/dd/yyyy;;q")
	procedure->proc[cnt].primary = scp.sched_primary_ind
    procedure->proc[cnt].anesthesia = uar_get_code_display(scp.sched_anesth_type_cd)

    cmnt = trim(scp.proc_text)
    pos = Locateval(num, 1, Size(procedure->proc, 5), cmnt, procedure->proc[num].comments)
    If (pos = 0)
        procedure->proc[cnt].comments = trim(scp.proc_text)
    ElseIf (trim(scp.proc_text) > "")
        procedure->proc[cnt].comments = Concat("Same as: ", procedure->proc[pos].procedure)
    EndIf

with nocounter

call echorecord(procedure)
call echojson(procedure, $OUTDEV)
end
go
