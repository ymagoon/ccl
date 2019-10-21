drop program bc_mp_cencus_restricted_list go
create program bc_mp_cencus_restricted_list

prompt 
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "query_opt" = ""
	, "org" = 0
	, "patient type" = 0
	, "start date" = ""
	, "end date" = "" 

with OUTDEV, query_opt, org, patient_type, begindate, enddate


/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/

/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/

/**************************************************************
; DVDev Start Coding
**************************************************************/


DECLARE query_opt = i4 with public, noconstant(1)

DECLARE patient_type =  f8 WITH  PUBLIC , NOCONSTANT ( 0 )
DECLARE organization =  f8 WITH  PUBLIC , NOCONSTANT ( 0 )
DECLARE begin_date =  dq8 WITH  PUBLIC , NOCONSTANT ( 0 )
DECLARE end_date =  dq8 WITH  PUBLIC , NOCONSTANT ( 0 )

Declare FIN = vc
set FIN = "38000265"
;    Your Code Goes Here
set query_opt = 3


SET organization = 589748.0
SET  patient_type =  309308.0 ;patient type

set begin_date =cnvtlookbehind("2, M")
set end_date  = cnvtdatetime(curdate, 235959)
/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/

IF (query_opt = 1)
	SELECT INTO $OUTDEV	
		e.encntr_id,
		FIN = ea.alias
	FROM  ENCOUNTER E,
		  ENCNTR_ALIAS EA
	PLAN E
		WHERE E.disch_dt_tm is null
		AND E.organization_id = organization
		AND E.encntr_type_cd = patient_type
		AND E.active_ind= 1
	JOIN EA
		WHERE EA.encntr_id = e.encntr_id
		and ea.encntr_alias_type_cd = 1077.0
		and ea.active_ind = 1
	WITH FORmAT, TIME = 180, maxrec = 50
	
ELSEIF (query_opt = 2) ; date range, registration date

	SELECT INTO $OUTDEV	
		e.encntr_id,
		FIN = ea.alias, e.reg_dt_tm "mm/dd/yyyy hh:mm"
		
	FROM  ENCOUNTER E,
		  ENCNTR_ALIAS EA
	PLAN E
		WHERE  E.organization_id = organization
		AND e.reg_dt_tm between cnvtdatetime(cnvtdate(begin_date), 0) and cnvtdatetime(curdate, curtime3)
		AND E.encntr_type_cd = patient_type
		AND E.active_ind= 1
	JOIN EA
		WHERE EA.encntr_id = e.encntr_id
		and ea.encntr_alias_type_cd = 1077.0
		and ea.active_ind = 1
	WITH FORmAT, TIME = 180, maxrec = 50
	
ELSEIF (query_opt = 3)
	SELECT INTO $OUTDEV	
		e.encntr_id,
		FIN = ea.alias, e.reg_dt_tm "mm/dd/yyyy hh:mm"
	FROM  ENCOUNTER E,
		  ENCNTR_ALIAS EA
	PLAn EA
		WHERE EA.alias = FIN
		AND EA.encntr_alias_type_cd = 1077.0
		AnD EA.active_ind = 1
	JOIN E
		WHERE E.encntr_id = ea.encntr_id
		and e.active_ind = 1
	WITH FORmAT
ENDIF

	


end
go

