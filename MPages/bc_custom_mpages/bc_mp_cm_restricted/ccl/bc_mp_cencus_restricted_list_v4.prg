drop program bc_mp_cencus_restricted_list go
create program bc_mp_cencus_restricted_list

prompt 
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "PRSNL_ID" = ""
	, "PERSON_ID" = ""
	, "query_opt" = ""
	, "org" = 0
	, "patient type" = 0
	, "start date" = "CURDATE"
	, "end date" = "CURDATE"
	, "prompt1" = "" 

with OUTDEV, PRSNL_ID, PERSON_ID, query_opt, org, patient_type, begindate, enddate, fin

;OUTDEV, PRSNL_ID, PERSON_ID, ENC_ID, query_opt, org, patient_type, BEGINDATE, ENDDATE, fin

/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/

/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/

/**************************************************************
; DVDev Start Coding
**************************************************************/



;DECLARE query_opt = i4 with public, noconstant(1)

DECLARE patient_type =  f8 WITH  PUBLIC , NOCONSTANT ( 0 )
DECLARE organization =  f8 WITH  PUBLIC , NOCONSTANT ( 0 )


declare temp_date_dq8 		= dq8 with protect, noconstant 	;Temporary date variable used for bc_fun_prk_5
DECLARE begin_date =  dq8 WITH  PUBLIC , NOCONSTANT ( 0 )
DECLARE end_date =  dq8 WITH  PUBLIC , NOCONSTANT ( 0 )


;    Your Code Goes Here
set query_opt = $query_opt

IF (query_opt = "3")
	set FIN = $fin  ;"38000265" ;
ENDIF



SET organization = $org ; 589748.0
SET  patient_type =  $patient_type ;  309308.0 ;patient type
IF (patient_type = 1)
	SET ALL_PAT_TYPE = 1 ;all patient type
ELSE

	SET ALL_PAT_TYPE = 0
ENDIF

execute bc_fun_prk_5 $BEGINDATE, "BOD"
set begin_date = temp_date_dq8

execute bc_fun_prk_5 $ENDDATE, "EOD"
set end_date = temp_date_dq8

;set begin_date =cnvtlookbehind("2, M")
;set end_date  = cnvtdatetime(curdate, 235959)
/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
DECLARE num1 = i4 WITH PROTECT, NOCONSTANT(0)  
DECLARE num2 = i4 WITH PROTECT, NOCONSTANT(0)
DECLARE num3 = i4 WITH PROTECT, NOCONSTANT(0)

RECORD ENC (
	1 rec_cnt = i4
	1 REC[*]
		2 ENC_ID = f8
		2 FIN = vc
			)
/* Populuate all the health plans that the users allowed to see */






RECORD HP (
	1 rec_cnt = i4
	1 REC [*] 
		2 HP_ID = f8
		  )
	  
		SELECT INTO "NL:"  hp_id = HPA.health_plan_id,  alias = hpa.alias_key
		FROM		
					PRSNL_GROUP_RELTN   PGR
					,HEALTH_PLAN_ALIAS  HPA
		 			
					,PRSNL_GROUP   PR
					, v500.CUST_CCL_INSURANCE_VIEW CCI
		PLAN PGR
				WHERE PGR.person_id = $PRSNL_ID ; 12465329.00 ; (leann test account = 12465329.00)current user log in
				AND PGR.active_ind = 1
		JOIN PR
					WHERE PGR.prsnl_group_id = pr.prsnl_group_id
					AND PR.active_ind = 1
		JOIN CCI
					WHERE CCI.prsnl_user_grp_cd = pr.prsnl_group_id
					AND CCI.active_id = 1
		JOIN HPA
			WHERE TRIM(HPA.alias_key) =  trim(cci.health_plan_alias)
			AND HPA.active_ind = 1
	HEAD REPORT
			rcnt = 0
			STAT = ALTERLIST(HP->REC,10)
	DETAIL
			rcnt = rcnt + 1
			;check for available memory in the list
			IF(MOD(rcnt,10) = 1 AND rcnt > 10)
				;if needed allocate memory for 10 more records
				STAT = ALTERLIST(HP->REC, rcnt + 9)
			ENDIF
			
			HP->REC[rcnt].HP_ID = hp_id ;hpa.health_plan_id
	FOOT REPORT
	;finalizing recordset
		HP->rec_cnt = rcnt
		stat = alterlist(HP->REC, HP->rec_cnt)		
	WITH FORMAT
	
/* ------------------------------------- */
				
RECORD TEMP (
	1 rec_cnt = i4
	1 REC[*]
		2 ENC_ID = f8
		2 PERSON_ID = f8
		2 FIN = vc
		2 PATIENT_TYPE = vc
		2 REG_DT = vc
		2 DISC_DT = vc
		2 DOB = vc
		2 GENDER = vc
		2 PATIENT_NAME = vc
		2 NU = vc
		2 ROOM_BED = vc
		2 INSURANCE = vc
			)

IF (query_opt = "1")
	SELECT INTO  "NL:"
		e.encntr_id,
		FIN = ea.alias
	FROM  ENCOUNTER E,
		  ENCNTR_ALIAS EA, 
		  encntr_plan_reltn epr
		  
	PLAN E
		WHERE E.disch_dt_tm is null
		AND E.organization_id = organization
		AND ((ALL_PAT_TYPE  = 0 AND E.encntr_type_cd = patient_type)
			OR (ALL_PAT_TYPE = 1 AND E.encntr_type_cd != 0) )
		AND E.loc_nurse_unit_cd != 0.0 ;patient must be in a location	
		;AND E.loc_room_cd != 0  ;must have a room
		AND E.active_ind= 1
	JOIN EPR
		WHERE epr.encntr_id = e.encntr_id
		AND expand(num1, 1, size(HP->REC, 5), epr.health_plan_id, HP->rec[num1].HP_ID)
		and epr.active_ind = 1
	JOIN EA
		WHERE EA.encntr_id = e.encntr_id
		and ea.encntr_alias_type_cd = 1077.0
		and ea.active_ind = 1	
	HEAD REPORT	
		rcnt = 0
		;Allocate memory for list with 10 records
		STAT = ALTERLIST(ENC->REC,10)
	DETAIL
		rcnt = rcnt + 1
		;check for available memory in the list
		IF(MOD(rcnt,10) = 1 AND rcnt > 10)
			;if needed allocate memory for 10 more records
			STAT = ALTERLIST(ENC->REC, rcnt + 9)
		ENDIF
		
		;loading recordset 
		ENC->REC[rcnt].ENC_ID = E.encntr_id
		ENC->REC[rcnt].fin = FIN
	FOOT REPORT
	;finalizing recordset
		ENC->rec_cnt = rcnt
		stat = alterlist(ENC->REC, ENC->rec_cnt)
			
	WITH FORmAT, maxrec = 450
	
ELSEIF (query_opt = "2") ; date range, registration date

	SELECT INTO  "NL:"
		e.encntr_id,
		FIN = ea.alias, e.reg_dt_tm "mm/dd/yyyy hh:mm"
		
	FROM  ENCOUNTER E,
		  ENCNTR_ALIAS EA, 
		  encntr_plan_reltn epr
	PLAN E
		WHERE  E.organization_id = organization
		AND e.reg_dt_tm between cnvtdatetime(begin_date) and cnvtdatetime(end_date)
		AND ((ALL_PAT_TYPE  = 0 AND E.encntr_type_cd = patient_type)
			OR (ALL_PAT_TYPE = 1 AND E.encntr_type_cd != 0) )
		AND E.loc_nurse_unit_cd != 0 ;patient must be in a location
		;AND E.loc_room_cd != 0 ;must have a room
		AND E.active_ind= 1
	JOIN EPR
		WHERE epr.encntr_id = e.encntr_id
		AND expand(num2, 1, size(HP->REC, 5), epr.health_plan_id, HP->rec[num2].HP_ID)
		and epr.active_ind = 1
	JOIN EA
		WHERE EA.encntr_id = e.encntr_id
		and ea.encntr_alias_type_cd = 1077.0
		and ea.active_ind = 1
	HEAD REPORT	
		rcnt = 0
		;Allocate memory for list with 10 records
		STAT = ALTERLIST(ENC->REC,10)
	DETAIL
		rcnt = rcnt + 1
		;check for available memory in the list
		IF(MOD(rcnt,10) = 1 AND rcnt > 10)
			;if needed allocate memory for 10 more records
			STAT = ALTERLIST(ENC->REC, rcnt + 9)
		ENDIF
		
		;loading recordset 
		ENC->REC[rcnt].ENC_ID = E.encntr_id
		ENC->REC[rcnt].fin = FIN
	FOOT REPORT
	;finalizing recordset
		ENC->rec_cnt = rcnt
		stat = alterlist(ENC->REC, ENC->rec_cnt)	
	WITH FORmAT, maxrec = 450
	
ELSEIF (query_opt = "3")
	SELECT INTO "NL:"
		e.encntr_id,
		FIN = ea.alias, e.reg_dt_tm "mm/dd/yyyy hh:mm"
	FROM  ENCOUNTER E,
		  ENCNTR_ALIAS EA, 
		  encntr_plan_reltn epr
	PLAn EA
		WHERE EA.alias = FIN
		AND EA.encntr_alias_type_cd = 1077.0
		AnD EA.active_ind = 1	
	JOIN E
		WHERE E.encntr_id = ea.encntr_id
		and e.active_ind = 1
	JOIN EPR
		WHERE epr.encntr_id = e.encntr_id
		AND expand(num3, 1, size(HP->REC, 5), epr.health_plan_id, HP->rec[num3].HP_ID)
		and epr.active_ind = 1
	HEAD REPORT	
		rcnt = 0
		;Allocate memory for list with 10 records
		STAT = ALTERLIST(ENC->REC,10)
	DETAIL
		rcnt = rcnt + 1
		;check for available memory in the list
		IF(MOD(rcnt,10) = 1 AND rcnt > 10)
			;if needed allocate memory for 10 more records
			STAT = ALTERLIST(ENC->REC, rcnt + 9)
		ENDIF
		
		;loading recordset 
		ENC->REC[rcnt].ENC_ID = E.encntr_id
		ENC->REC[rcnt].fin = FIN
	FOOT REPORT
	;finalizing recordset
		ENC->rec_cnt = rcnt
		stat = alterlist(ENC->REC, ENC->rec_cnt)	
	WITH FORmAT, TIME = 180, maxrec = 5
ENDIF

Declare num = i4
/*** test */
/*
1 rec_cnt = i4
	1 REC[*]
		2 ENC_ID = f8
		2 FIN = vc
		2 REG_DT = vc
		2 DISC_DT = vc
		2 DOB = vc
		2 GENDER = vc
		2 PATIENT_NAME = vc
		2 NU = vc
		2 ROOM_BED = vc
		2 INSURANCE = vc
		*/
DECLARE TEMP_INSURANCE = vc

	SELECT INTO "nl:"
	   REC_ENC_ID = ENC->REC[D1.SEQ].ENC_ID
	,  REC_FIN = SUBSTRING(1, 30, ENC->REC[D1.SEQ].FIN)
	,REC_PATIENT_TYPE = uar_get_code_display(e.encntr_type_cd)
	,  REG_DT = format(e.reg_dt_tm, "mm/dd/yyyy hh:mm")
	,  DISC_DT = format(e.disch_dt_tm, "mm/dd/yyyy hh:mm")
	, DOB = format(p.birth_dt_tm, "mm/dd/yyyy")
	, GENDER =  substring(1, 1, uar_get_code_display(p.sex_cd))
	, PATIENT_NAME = p.name_full_formatted
	, NU = uar_get_code_display(e.loc_nurse_unit_cd)
	, ROOM_BED = concat(trim(uar_get_code_display(e.loc_room_cd)), "-", trim(uar_get_code_display(e.loc_bed_cd)))
	
	FROM
	     (DUMMYT   D1  WITH SEQ = VALUE(SIZE(ENC->REC, 5)))
		,ENCOUNTER   E
		,PERSON   P
		,encntr_plan_reltn epr
		,health_plan hp
	PLAN D1
	JOIN E
			WHERE ENC->REC[D1.SEQ].ENC_ID = E.encntr_id
			AND E.active_ind = 1
	JOIN P
			WHERE P.PERSON_ID = E.PERSON_ID
			AND P.active_ind = 1
	JOIN EPR
		WHERE epr.encntr_id = e.encntr_id
		and epr.active_ind = 1
	JOIN HP
		WHERE HP.health_plan_id = epr.health_plan_id
		AND HP.active_ind = 1
			 
	HEAD REPORT	
		rcnt = 0
		;Allocate memory for list with 10 records
		STAT = ALTERLIST(TEMP->REC,10)
	HEAD REC_ENC_ID
		rcnt = rcnt + 1
		;check for available memory in the list
		IF(MOD(rcnt,10) = 1 AND rcnt > 10)
			;if needed allocate memory for 10 more records
			STAT = ALTERLIST(TEMP->REC, rcnt + 9)
		ENDIF
		
		;loading recordset 
		TEMP->REC[rcnt].ENC_ID = REC_ENC_ID
		TEMP->REC[rcnt].PERSON_ID = e.person_id
		TEMP->REC[rcnt].FIN = REC_FIN
		TEMP->REC[rcnt].PATIENT_TYPE = REC_PATIENT_TYPE
		TEMP->REC[rcnt].REG_DT = REG_DT
		TEMP->REC[rcnt].DISC_DT = DISC_DT 
		TEMP->REC[rcnt].DOB = DOB
		TEMP->REC[rcnt].GENDER = GENDER
		TEMP->REC[rcnt].PATIENT_NAME = PATIENT_NAME
		TEMP->REC[rcnt].NU = NU 
		TEMP->REC[rcnt].ROOM_BED = ROOM_BED
		
		TEMP_INSURANCE = ""
		
		ins_cnt = 0
	HEAD HP.plan_name_key	
		 if (ins_cnt = 0)
		 	TEMP_INSURANCE = trim(hp.plan_name)
		 else
		 	 TEMP_INSURANCE = build(TEMP_INSURANCE, ",", char(10), trim(hp.plan_name))
		 endif
		
		ins_cnt = ins_cnt + 1
		
	FOOT REC_ENC_ID
			TEMP->REC[rcnt].INSURANCE  = trim(TEMP_INSURANCE); "United Vincent"
			
			
			
	FOOT REPORT
	;finalizing recordset
		TEMP->rec_cnt = rcnt
		stat = alterlist(TEMP->REC, TEMP->rec_cnt)	
		

WITH NOCOUNTER, SEPARATOR=" ", FORMAT

/* INSERTING THE INSURANCE DATA * /


/*TESTING*********************************************************

	SELECT into $outdev
	REC_ENC_ID = TEMP->REC[D1.SEQ].ENC_ID
	, REC_FIN = SUBSTRING(1, 30, TEMP->REC[D1.SEQ].FIN)
	 ,  PTYPE = SUBSTRING(1, 30, TEMP->REC[D1.SEQ].PATIENT_TYPE)
	, REC_REG_DT = SUBSTRING(1, 30, TEMP->REC[D1.SEQ].REG_DT)
	, REC_DISC_DT = SUBSTRING(1, 30, TEMP->REC[D1.SEQ].DISC_DT)
	, REC_DOB = SUBSTRING(1, 30, TEMP->REC[D1.SEQ].DOB)
	, REC_GENDER = SUBSTRING(1, 30, TEMP->REC[D1.SEQ].GENDER)
	, REC_PATIENT_NAME = SUBSTRING(1, 30, TEMP->REC[D1.SEQ].PATIENT_NAME)
	, REC_NU = SUBSTRING(1, 30, TEMP->REC[D1.SEQ].NU)
	, REC_ROOM_BED = SUBSTRING(1, 30, TEMP->REC[D1.SEQ].ROOM_BED)
	, REC_INSURANCE = SUBSTRING(1, 30, TEMP->REC[D1.SEQ].INSURANCE)

FROM
	(DUMMYT   D1  WITH SEQ = VALUE(SIZE(TEMP->REC, 5)))

PLAN D1

WITH NOCOUNTER, SEPARATOR=" ", FORMAT
/*************************************************************************/
call echojson(temp, $OUTDEV)

end
go

