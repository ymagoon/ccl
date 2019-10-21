drop program bc_mp_mvs_visithx_12:dba go
create program bc_mp_mvs_visithx_12:dba
/**************************************************************************************************
              Purpose: Displays  on the Patients last two visits and reason for visit
     Source File Name: bc_mp_mvs_visithx_12.PRG
              Analyst: MediView Solutions
          Application: FirstNet
  Execution Locations: FirstNet
            Request #: 
      Translated From: 
        Special Notes:
**************************************************************************************************/
/**************************************************************************************************
  Mod  Date            Engineer                Description
   ---  --------------- ----------------------- ------------------------------------------------
    1   06/09/2011      MediView Solutions 	    Initial Release
    2   mm/dd/yyyy      Engineer Name           Initial Release
	3 	mm/dd/yyyy      FirstName LastName      Comments for first modification

**************************************************************************************************/

prompt 
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "USERID" = 0
	, "PERSONID" = 0
	, "ENCNTRID" = 0
	, "OPTIONS" = "" 

with OUTDEV, USERID, PERSONID, ENCNTRID, OPTIONS


RECORD VISIT ( 
	1 REC_CNT = I4 
	1 REC[*]
		2 REGISTRATION_DT 	= VC
		2 DISCHARGE_DT		= VC
		2 FACILITY			= VC
		2 ENCNTR_TYPE		= VC
		2 ENCNTR_CLASS		= VC
		2 REASON_4_VISIT	= VC
		2 FIN_NBR			= VC
		
)

DECLARE  FINNBR_319_CV  =  F8 WITH  PUBLIC , CONSTANT(UAR_GET_CODE_BY("DISPLAYKEY",319,"FINNBR" ))

SELECT INTO "NL:" 
	E.ENCNTR_ID
	, E.PERSON_ID	
	, REGISTRATION_DT = FORMAT(CNVTDATETIME( E.REG_DT_TM ), "MM/DD/YYYY HH:MM;;D")
	, DISCHARGE_DT = FORMAT(CNVTDATETIME( EN.disch_dt_tm ), "MM/DD/YYYY HH:MM;;D") ;"MM/DD/YYYY;;D"
	, FACILITY = UAR_GET_CODE_DISPLAY(EN.LOC_FACILITY_CD)
	, ENCNTR_TYPE = UAR_GET_CODE_DISPLAY(EN.ENCNTR_TYPE_CD)
	, ENCNTR_CLASS = UAR_GET_CODE_DISPLAY(EN.ENCNTR_CLASS_CD)
	, REASON_4_VISIT = EN.REASON_FOR_VISIT
	, FIN_NBR = CNVTALIAS(EA.ALIAS,EA.ALIAS_POOL_CD)
 
FROM
	ENCOUNTER   E
	, ENCOUNTER   EN
	, ENCNTR_ALIAS   EA
 
PLAN E WHERE E.ENCNTR_ID = 	$ENCNTRID
	AND E.BEG_EFFECTIVE_DT_TM + 0 <= CNVTDATETIME(CURDATE, CURTIME)
	AND E.END_EFFECTIVE_DT_TM + 0 >= CNVTDATETIME(CURDATE, CURTIME)
   	AND E.ACTIVE_IND + 0 = 1
   
JOIN EN WHERE EN.PERSON_ID = E.PERSON_ID   
	AND EN.BEG_EFFECTIVE_DT_TM  <= CNVTDATETIME(CURDATE, CURTIME)  ; Index 2 
	AND EN.END_EFFECTIVE_DT_TM + 0 >= CNVTDATETIME(CURDATE, CURTIME)
   	AND EN.ACTIVE_IND + 0 = 1

JOIN EA
   WHERE EA.ENCNTR_ID = EN.ENCNTR_ID
   AND EA.ENCNTR_ALIAS_TYPE_CD + 0 =  FINNBR_319_CV
   AND EA.END_EFFECTIVE_DT_TM + 0 = CNVTDATETIME(CNVTDATE(12312100),0000)
 
ORDER BY
	EN.DISCH_DT_TM   DESC
 
HEAD REPORT
 	; Initializing Recordset Counter
	rec_counter = 0
 
;HEAD  	
DETAIL
	;Recordset Management 
	if (mod(rec_counter,10) = 0)
		stat = alterlist(VISIT->rec, rec_counter + 10)
	endif
	rec_counter = rec_counter + 1   

	; Load Record Set 
	VISIT->rec[rec_counter].REGISTRATION_DT = REGISTRATION_DT ; E.REG_DT_TM
	VISIT->rec[rec_counter].DISCHARGE_DT   	= DISCHARGE_DT    ; EN.disch_dt_tm
	VISIT->rec[rec_counter].FACILITY   		= UAR_GET_CODE_DISPLAY(EN.LOC_FACILITY_CD)
	VISIT->rec[rec_counter].ENCNTR_TYPE   	= UAR_GET_CODE_DISPLAY(EN.ENCNTR_TYPE_CD)
	VISIT->rec[rec_counter].ENCNTR_CLASS   	= UAR_GET_CODE_DISPLAY(EN.ENCNTR_CLASS_CD)
	VISIT->rec[rec_counter].REASON_4_VISIT  = EN.REASON_FOR_VISIT
	VISIT->rec[rec_counter].FIN_NBR   		= CNVTALIAS(EA.ALIAS,EA.ALIAS_POOL_CD)

FOOT REPORT
	;Finalizing Recordset 
	stat = alterlist(VISIT->rec, rec_counter)
	VISIT->rec_cnt = rec_counter


WITH NOCOUNTER


call echojson(visit, $OUTDEV)
end
go
