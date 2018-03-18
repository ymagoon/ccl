drop program 1_mhs_inbox_documents_op_eu_op:dba go
create program 1_mhs_inbox_documents_op_eu_op:dba
/*******************************************************************
Report Name: Inbox Documents
Report Description: Displays Inbox Documents
 
Created by:  Mary Wiersgalla  (LM)
Created date:  09/2009
 
 
Mod001 by:		Rob Banks
Modified date:	10/25/2011
Modifications:	Modify to use DB2
 
*******************************************************************/
 
/*prompt
	"Output to File/Printer/MINE" = "MINE"
	;, "Discharge Date Start" = CURDATE
	;, "Discharge Date End" = CURDATE
 
with OUTDEV;, sdate, edate*/
 
prompt
	"Output to e-mail" = "wiersgalla.mary@mayo.edu"
 
with OUTDEV
 
/*** START 001 ***/
;*********************************************************************
;*** If PROD / CERT then run as 2nd oracle instance to improve
;*** efficiency. Will auto Fail-over to Instance 1 if Instance 2 down.
;*********************************************************************
IF(CURDOMAIN = "PROD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprbrpt'
ELSEIF(CURDOMAIN = "MHPRD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprbrpt'
ELSEIF(CURDOMAIN="MHCRT")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/java4t2@mhcrtrpt'
ENDIF ;CURDOMAIN
;*** Write instance ccl ran in to the log file
;SET Iname = fillstring(10," ")
;SELECT INTO value("mayo_logfiles:mayo_instance2.log")
;  run_date = format(sysdate,";;q")
; ,Iname = substring(1,7,instance_name)
;FROM v$instance
;DETAIL
;  col  1 run_date
;  col +1 curprog
;  col +1 " *Instance="
;  col +1 Iname
;with nocounter
;   , format
;****************** End of INSTANCE 2 routine ************************
/*** END 001 ***/
 
SET MaxSecs = 3600
 
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
 
 
DECLARE output_file = VC WITH NOCONSTANT ( "" )
;SET output_file = CONCAT (FORMAT ( CURDATE , "MMDDYY;;q" ), FORMAT ( CURTIME , "HHMM;1;m" ), "_orderstoapprove.csv" )
SET output_file = CONCAT
("documents_to_sign_clinic",
FORMAT ( CURDATE , "MMDDYY;;q" ), "_" ,FORMAT ( CURTIME , "HHMM;1;m" ), ".csv")
SET message_file = "documentstosignclinic.msg"
 
 
SELECT DISTINCT INTO value(output_file) ;$OUTDEV
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
	, Appt_Date_Time = e.reg_dt_tm "@SHORTDATETIME"
	;, Discharge_Date_Time = e.disch_dt_tm "@SHORTDATETIME"
	, Department = IF(PR.ALIAS IN ("EUMC Allergy/Immunology")) "ALLERGY & ASTHMA"
 
ELSEIF(PR.ALIAS IN ("EUBM Anticoagulation Services", "EUCF Anticoagulation Services",
"EULH Anticoagulation Services", "EUOM Anticoagulation Services"))  "ANTICOAGULATION SERVICE"
 
ELSEIF(PR.ALIAS IN ("EULH Behavioral Health"))  "BEHAVIORAL HEALTH - INPATIENT"
 
ELSEIF(PR.ALIAS IN ("EUMB Behavioral Health"))  "BEHAVIORAL HEALTH - OUTPATIENT"
 
ELSEIF(PR.ALIAS IN ("EUML Cardiology"))  "CARDIOLOGY"
 
ELSEIF(PR.ALIAS IN ("EUML Cardiovascular and Thoracic Surgery"))  "CARDIOVASCULAR SURGERY"
 
ELSEIF(PR.ALIAS IN ("EUBM Bloomer Clinic", "EUCM Colfax Clinic", "EUCF Chippewa Falls Clinic",
"EUBL Emergency Department"))  "CHIPPEWA VALLEY"
 
ELSEIF(PR.ALIAS IN ("EUMC Dermatology"))  "DERMATOLOGY"
 
ELSEIF(PR.ALIAS IN ("EUMC Diabetes Education/Nutrition Services"))  "DIABETES EDUCATION"
 
ELSEIF(PR.ALIAS IN ("EUDB Dialysis Center-Barron", "EUDM Dialysis Center-Menomonie",
"EUDS Dialysis Center-London Road", "EULH-Dialysis Center"))  "DIALYSIS"
 
ELSEIF(PR.ALIAS IN ("EUML Gastroenterology"))  "DIGESTIVE HEALTH"
 
ELSEIF(PR.ALIAS IN ("EUMC Otolaryngology"))  "EAR, NOSE & THROAT"
 
ELSEIF(PR.ALIAS IN ("EULH Emergency Department"))  "EMERGENCY DEPARTMENT"
 
ELSEIF(PR.ALIAS IN ("EUMC Endocrinology"))  "ENDOCRINOLOGY"
 
ELSEIF(PR.ALIAS IN ("EUMC Express Care South Point", "EUMC Express Care West Ridge"))  "EXPRESS CARE"
 
ELSEIF(PR.ALIAS IN ("EUMC Ophthalmology/Optometry"))  "EYE CARE CENTER"
 
ELSEIF(PR.ALIAS IN ("EUMC Family Medicine", "EUML Family Medicine"))  "FAMILY MEDICINE"
 
ELSEIF(PR.ALIAS IN ("EUML Podiatry"))  "FOOT & ANKLE SERVICES"
 
ELSEIF(PR.ALIAS IN ("EUML HERS/Wellness Center"))  "HERS BREAST CENTER"
 
ELSEIF(PR.ALIAS IN ("EULH Medical/Surgical A", "EULH North Hall - 4th Floor", "EULH South Hall - 4th Floor",
"EULH North Hall - 3rd Floor", "EULH South Hall - 3rd Floor"))  "HOSPITAL MEDICINE"
 
ELSEIF(PR.ALIAS IN ("EUML Infectious Disease"))  "INFECTIOUS DISEASE"
 
ELSEIF(PR.ALIAS IN ("EUMC Internal Medicine-MCC", "EUML Internal Medicine-MCLC"))  "INTERNAL MEDICINE"
 
;ELSEIF(PR.ALIAS IN ("EULH North Hall - 4th Floor", "EULH South Hall - 4th Floor"))  "MEDICAL/SURGICAL"
 
;ELSEIF(PR.ALIAS IN ("EULH North Hall - 3rd Floor", "EULH South Hall - 3rd Floor"))  "MEDICAL TELEMETRY"
 
ELSEIF(PR.ALIAS IN ("EUML Nephrology"))  "NEPHROLOGY"
 
ELSEIF(PR.ALIAS IN ("EUML Neurodiagnostics"))  "NEURODIAGNOSTICS/SLEEP DISORDERS CENTER"
 
ELSEIF(PR.ALIAS IN ("EUML Neurology"))  "NEUROLOGY"
 
ELSEIF(PR.ALIAS IN ("EUBC Barron Clinic", "EUCC Cameron Clinic", "EURL Rice Lake Clinic",
"EUCH Chetek Clinic", "EUPF Prairie Farm Clinic", "EUBH Emergency Department",
"EUBH-Medical/Surgical", "EUBH Obstetrics"))  "NORTHLAND"
 
ELSEIF(PR.ALIAS IN ("EUOM Osseo Clinic", "EUMM Mondovi Clinic", "EUOH Emergency Department"))
"OAKRIDGE"
 
ELSEIF(PR.ALIAS IN ("EUMC Occupational Medicine"))  "OCCUPATIONAL MEDICINE"
 
ELSEIF(PR.ALIAS IN ("EUML Oncology/Hematology"))  "ONCOLOGY"
 
ELSEIF(PR.ALIAS IN ("EUML Orthopedics"))  "ORTHOPEDICS"
 
ELSEIF(PR.ALIAS IN ("EUPC Pain Clinic"))  "PAIN CLINIC"
 
ELSEIF(PR.ALIAS IN ("EULH Pathology Laboratory"))  "PATHOLOGY"
 
ELSEIF(PR.ALIAS IN ("EUMC Pediatrics/Adolescent Medicine",
"EUML Pediatrics/Adolescent Medicine"))  "PEDIATRIC & ADOLESCENT MEDICINE"
 
ELSEIF(PR.ALIAS IN ("EUML Physical Medicine & Rehabilitation"))  "PHYSICAL MEDICINE & REHABILITATION"
 
ELSEIF(PR.ALIAS IN ("EUML Plastic Surgery"))  "PLASTIC & RECONSTRUCTIVE SURGERY"
 
ELSEIF(PR.ALIAS IN ("EUML Pulmonology"))  "PULMONOLOGY"
 
ELSEIF(PR.ALIAS IN ("EULH Radiation Oncology"))  "RADIATION ONCOLOGY"
 
ELSEIF(PR.ALIAS IN ("EUCH Radiology", "EULH Radiology", "EUMC Radiology",
"EUML Radiology", "EURL Radiology"))  "RADIOLOGY"
 
ELSEIF(PR.ALIAS IN ("EULH Occupational Therapy", "EUML Occupational/Hand Therapy"))
"REHABILITATION SERVICES - OCCUPATIONAL THERAPY"
 
ELSEIF(PR.ALIAS IN ("EULH Physical Therapy", "EUML Physical Therapy-MCLC"))
"REHABILITATION SERVICES - PHYSCIAL THERAPY"
 
ELSEIF(PR.ALIAS IN ("EULH Speech Therapy"))  "REHABILITATION SERVICES - SPEECH THERAPY"
 
ELSEIF(PR.ALIAS IN ("EUMC Rheumatology"))  "RHEUMATOLOGY"
 
ELSEIF(PR.ALIAS IN ("EUML Spine and Neurological Surgery"))  "SPINE & NEUROLOGICAL SURGERY"
 
ELSEIF(PR.ALIAS IN ("EUML Surgery"))  "SURGERY"
 
ELSEIF(PR.ALIAS IN ("EUMC UrgentCare"))  "URGENT CARE"
 
ELSEIF(PR.ALIAS IN ("EUML Urology"))  "UROLOGY"
 
ELSEIF(PR.ALIAS IN ("EUMC Weight Management Center (HMR)"))  "WEIGHT MANAGEMENT SERVICES"
 
ELSEIF(PR.ALIAS IN ("EUML Women's Health/Family Medicine"))  "WOMEN'S HEALTH"
 
ELSE
"***NO DEPARTMENT LISTED"
ENDIF
 
 
FROM
	PRSNL   P
	, TASK_ACTIVITY   T
	, TASK_ACTIVITY_ASSIGNMENT   TA
	, PERSON   PE
	, ENCOUNTER   E
	, encntr_alias ea
	 , prsnl_alias pr
 
 
plan e
where e.reg_dt_tm+0 >= cnvtdatetime("10-AUG-2009")
and e.reg_dt_tm <= cnvtdatetime(CURDATE, CURTIME3)
;where e.reg_dt_tm+0 between cnvtdatetime(cnvtdate(beg_dt),0)
;and cnvtdatetime(cnvtdate(end_dt),235959)
and e.loc_facility_cd in
(
			 3196530	;BL CLINIC
			,3196528	;BA Clinic
			,3196532	;OS Clinic
			,3180507	;MC
			,3186522 	;MCBH
			,3196533	;NWHC
			,3196534 	;Pain Clinic
 
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
		;and t.msg_sender_id < 1
		and t.event_class_cd != 233.00	;NUM
		and t.event_class_cd != 236.00	;TXT
 
JOIN TA WHERE T.TASK_ID = TA.TASK_ID
 
JOIN P
WHERE TA.ASSIGN_PRSNL_ID = P.PERSON_ID  ;AND TA.ASSIGN_PRSNL_ID = $PROVIDER   ;Find tasks for specific provider
and p.person_id != 1837007 and p.person_id != 1053689
and p.person_id !=  749923.00
and p.person_id !=  705923.00
and ta.assign_prsnl_id != 0
 
JOIN PE
WHERE T.PERSON_ID = PE.PERSON_ID
 
 
 
join ea
where ea.encntr_id = e.encntr_id
and ea.encntr_alias_type_cd = 1077.00
 
join pr
where pr.person_id = outerjoin(p.person_id)
and pr.alias_pool_cd = outerjoin(75153977)
and pr.active_ind = outerjoin(1)
 
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
;and e.reg_dt_tm <= cnvtdatetime(curdate-$num, curtime3)
and e.reg_dt_tm between cnvtdatetime(cnvtdate(beg_dt),0)
and cnvtdatetime(cnvtdate(end_dt),235959)
 
and e.loc_facility_cd+0 in
(
 
			 3196530	;BL CLINIC
			,3196528	;BA Clinic
			,3196532	;OS Clinic
			,3180507	;MC
			,3186522 	;MCBH
			,3196533	;NWHC
			,3196534 	;Pain Clinic
 
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
 
;WITH TIME = VALUE( MaxSecs ), FORMAT, SKIPREPORT = 1, Separator = " "
WITH TIME = VALUE( MaxSecs ), SKIPREPORT = 1, DIO= 08, PCFORMAT ('"', ',' , 1), FORMAT=STREAM, FORMAT
 
 
Set dclcom1 = concat( 'echo "Attached is the Documents to Sign_Dictate Report (Clinic). \n\n',
						' " > ',
	message_file, ' && ', 'uuencode ', output_file, ' ',
	output_file, ' >> ',
	message_file, ' && ', 'cat ',
	message_file, ' | mailx -s "Documents to Sign_Dictate (Clinic)" ', $outdev )
set dcllen1 = size( trim( dclcom1 ) )
set dclstatus = 0
call dcl( dclcom1, dcllen1, dclstatus )
 
/*** START 001 ***/
;*** After report put back to instance 1
IF(CURDOMAIN = "PROD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprb1'
ELSEIF(CURDOMAIN = "MHPRD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprb1'
ELSEIF(CURDOMAIN="MHCRT")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/java4t2@mhcrt1'
ENDIF ;CURDOMAIN
/*** END 001 ***/
 
END
GO
