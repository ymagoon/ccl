drop program 1_mhs_inbox_documents:dba go
create program 1_mhs_inbox_documents:dba
 
 
/*******************************************************************
Report Name: Inbox Documents
Report Description: Displays Inbox Documents
 
Created by:  Mary Wiersgalla  (LM)
Created date:  09/2009
 
 
Modified by:
Modified date:
Modifications:
 
*******************************************************************/
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Discharge Date Start" = CURDATE
	, "Discharge Date End" = CURDATE
 
with OUTDEV, sdate, edate
 
SET MaxSecs = 900
 
 SET beg_dt = $sdate
  set end_dt = $edate
 
/*record facilities
( 1 qual[*]
	2 facility_cd = f8
)
 
select into "nl:"
cv.* from code_value cv
plan cv where cv.code_set = 220 and cv.cdf_meaning = "FACILITY"
and cv.display_key = value(concat(trim($facility_grp,3),"*"))
 
head report
	f_cnt = 0
detail
	f_cnt = f_cnt + 1
	stat = alterlist(facilities->qual,f_cnt)
	facilities->qual[f_cnt].facility_cd = cv.code_value
 
 
with nocounter
declare num = i2*/
 
 
SELECT DISTINCT INTO $OUTDEV
	Provider = P.NAME_FULL_FORMATTED
	;, USERNAME = P.USERNAME
	, Msg_Subject = T.MSG_SUBJECT
	, Patient_Name = PE.NAME_FULL_FORMATTED
	, Task_Status = UAR_GET_CODE_DISPLAY( T.TASK_STATUS_CD )
	, Task_Date_Time = T.TASK_CREATE_DT_TM "@SHORTDATETIME"
	, Task_Activity = UAR_GET_CODE_DISPLAY(T.TASK_ACTIVITY_CD)
	, Task_Activity_Class = uar_get_code_display(T.task_activity_class_cd)
	;, T.EVENT_ID
	;, t.task_id
	, FIN = ea.alias
	, Facility = UAR_GET_CODE_DISPLAY(E.LOC_FACILITY_CD)
	, Nurse_Unit = UAR_GET_CODE_DISPLAY(E.LOC_NURSE_UNIT_CD)
	, Reg_Date_Time = e.reg_dt_tm "@SHORTDATETIME"
	, Discharge_Date_Time = e.disch_dt_tm "@SHORTDATETIME"
	, Event_Class = UAR_GET_CODE_DISPLAY(t.event_class_cd)
 
 
 
FROM
	PRSNL   P
	, TASK_ACTIVITY   T
	, TASK_ACTIVITY_ASSIGNMENT   TA
	, PERSON   PE
	, ENCOUNTER   E
	, encntr_alias ea
 
 
 
plan e
where e.disch_dt_tm+0 between cnvtdatetime(cnvtdate(beg_dt),0)
and cnvtdatetime(cnvtdate(end_dt),235959)
and e.loc_facility_cd in
(
			 633867		;LH
			,3186521	;LHBH
			,3196529	;BL HOSP
			,3196527	;BA Hosp
			,3196531	;OS Hosp
 
)
 
 
join t where t.encntr_id = e.encntr_id
 
AND 	(T.task_status_cd = 429 		;Pending
		or T.task_status_cd = 427 		;Opened
		or T.task_status_cd = 426 		;OnHold
		or T.task_status_cd = 420)		;Deleted
		and (t.task_activity_cd = 2705.00 ; Sign Request
		or (t.task_activity_cd = 2703 	; Perform Request
		and t.task_activity_class_cd = 28082813)) ;Anticipated Document
		;and t.task_create_dt_tm <= cnvtdatetime(curdate-$num, curtime3)
		;and t.msg_subject_cd != 0
		;and t.msg_subject != NULL
		and t.msg_subject != " "
 
JOIN TA WHERE T.TASK_ID = TA.TASK_ID
 
JOIN P
WHERE TA.ASSIGN_PRSNL_ID = P.PERSON_ID  ;AND TA.ASSIGN_PRSNL_ID = $PROVIDER   ;Find tasks for specific provider
and p.person_id != 1837007 and p.person_id != 1053689
and p.person_id !=  749923.00
and p.person_id !=  705923.00
 
JOIN PE
WHERE T.PERSON_ID = PE.PERSON_ID
 
 
 
join ea
where ea.encntr_id = e.encntr_id
and ea.encntr_alias_type_cd = 1077.00
 
/*PLAN T
 
JOIN TA WHERE T.TASK_ID = TA.TASK_ID
AND 	(T.task_status_cd = 429 		;Pending
		or T.task_status_cd = 427 		;Opened
		or T.task_status_cd = 426 		;OnHold
		or T.task_status_cd = 420)		;Deleted
		and (t.task_activity_cd = 2705.00 ; Sign Request
		or (t.task_activity_cd = 2703 	; Perform Request
		and t.task_activity_class_cd = 28082813)) ;Anticipated Document
		;and t.task_create_dt_tm <= cnvtdatetime(curdate-$num, curtime3)
		;and t.msg_subject_cd != 0
		;and t.msg_subject != NULL
		and t.msg_subject != " "
 
 
join e where e.encntr_id = t.encntr_id
;and expand(num, 1, size(facilities->qual,5), e.loc_facility_cd,
;facilities->qual[num].facility_cd)
;and e.disch_dt_tm <= cnvtdatetime(curdate-$num, curtime3)
and e.disch_dt_tm between cnvtdatetime(cnvtdate(beg_dt),0)
and cnvtdatetime(cnvtdate(end_dt),235959)
and e.loc_facility_cd+0 in
(
			 633867		;LH
			,3186521	;LHBH
			,3196529	;BL HOSP
			,3196527	;BA Hosp
			,3196531	;OS Hosp
 
)
 
 
JOIN P
WHERE TA.ASSIGN_PRSNL_ID = P.PERSON_ID  ;AND TA.ASSIGN_PRSNL_ID = $PROVIDER   ;Find tasks for specific provider
and p.person_id != 1837007 and p.person_id != 1053689
 
JOIN PE
WHERE T.PERSON_ID = PE.PERSON_ID
 
 
 
join ea
where ea.encntr_id = e.encntr_id
and ea.encntr_alias_type_cd = 1077.00*/
 
ORDER BY
	provider
	, T.TASK_CREATE_DT_TM
 
WITH TIME = VALUE( MaxSecs ), FORMAT, SKIPREPORT = 1, Separator = " "
 
END
GO
 
