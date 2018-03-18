/**************************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                    *
 **************************************************************************
 *                                                                        *
 *Mod    Date     Engineer             Comment                            *
 *-----  -------- -------------------- -----------------------------------*
  000  								   Original code
  001    08/10/12  akcia-se			   updates for efficiency for oracle upgrade
 ***********************************************************************/
 drop program 1_mhs_appt_prob_doc:dba go
create program 1_mhs_appt_prob_doc:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
 
with OUTDEV
 
set maxsec = 600
 
SELECT DISTINCT INTO $OUTDEV
	Appt_Location = UAR_GET_CODE_DISPLAY(S.APPT_LOCATION_CD)
	;, S_RESOURCE_DISP = UAR_GET_CODE_DISPLAY(S.RESOURCE_CD)
	; IF statements below are needed for LM as some of the schedulable
	; resources do not match up to their prsnl record.
	, Provider = IF(S.RESOURCE_CD = 4986507) "CASPER, RANDALL J MD"
	ELSEIF(S.RESOURCE_CD = 31205496)  "DEBBOUT, BOBBI J NP"
	ELSEIF(S.RESOURCE_CD = 4986509) "SNYDER, JOHN R MD"
	ELSEIF(S.RESOURCE_CD = 35380144) "LE, CARTER Q MD"
	ELSEIF(S.RESOURCE_CD = 7357779) "SWANSON, STEVEN E MD"
	ELSEIF(S.RESOURCE_CD = 7310457) "CELLI KOMRO, MARIANNE OD"
	ELSEIF(S.RESOURCE_CD = 7357755) "KRAVE, KAYE I NP"
	ELSEIF(S.RESOURCE_CD = 7357779) "NASEEM, SHOAIB A MD"
	ELSE
	PR.NAME_FULL_FORMATTED
	ENDIF
	, Appt_Date = format(cnvtdatetime(S.BEG_DT_TM), "MM/DD/YYYY;;D")
	, Appt_Time = format(cnvtdatetime(S.BEG_DT_TM), "HH:MM:SS;;D")
	, Patient = P.NAME_FULL_FORMATTED
	, Clinic_MRN = PA.ALIAS
	, Active_Problems_On_Problem_List = IF(PRO.PROBLEM_ID!=0 and PRO.active_ind = 1 and
	PRO.LIFE_CYCLE_STATUS_CD = 3301.00) "YES"
	ELSE "NO"
	ENDIF
 
FROM
	SCH_APPT   S
	, PERSON   P
	, PERSON_ALIAS   PA
	, SCH_EVENT_PATIENT   SE
	, CODE_VALUE   CV1
	, PRSNL   PR
	, SCH_RESOURCE   SR
	, PROBLEM   PRO
 
PLAN cv1										;001
  where cv1.code_set = 220						;001
    and cv1.display = "EU*" ;$fac_group			 001
	and cv1.active_ind = 1						;001
	and cv1.end_effective_dt_tm > sysdate		;001
	
 
;001  plan s 
join s												;001
where s.appt_location_cd = cv1.code_value			;001
and s.sch_state_cd = 4536.00
and s.beg_dt_tm+0 >= cnvtdatetime(curdate-180,curtime3)
and s.beg_dt_tm <= cnvtdatetime(curdate-179,curtime3)
and s.resource_cd != 0
 
 
join se
where s.sch_event_id = se.sch_event_id
join p
where se.person_id = p.person_id
join pa
where pa.person_id = p.person_id
and pa.alias_pool_cd =     3844507.00
and pa.active_ind = 1
and pa.end_effective_dt_tm >= cnvtdatetime("31-DEC-2100")
;001  join cv1
;001  where cv1.code_value = s.appt_location_cd
;001	and cv1.display = "EU*" ;$fac_group
join sr where sr.resource_cd = s.resource_cd
join pr where pr.person_id = sr.person_id
AND pr.physician_ind = 1   or s.resource_cd in (
4986507,
31205496,
4986509,
35380144,
7357779,
7310457,
7357755,
7357779)
 
join pro where pro.person_id = outerjoin(p.person_id)
 
ORDER BY
	PROVIDER
	, APPT_DATE
	, APPT_TIME
 
 
WITH NOCOUNTER, SEPARATOR=" ", FORMAT, TIME= VALUE(maxsec)
 
end
go
 
