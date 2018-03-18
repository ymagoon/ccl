drop program 1_mhs_powernote_ed_use:dba go
create program 1_mhs_powernote_ed_use:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Start Date" = CURDATE
	, "End Date" = CURDATE
	, "Facility (Multiple Selection)" = 0
 
with OUTDEV, sdate, edate, facility
 
 
SET MaxSecs = 300
 
SET beg_dt = $sdate
SET end_dt = $edate
 
SELECT into $outdev
 ACTIVE_STATUS_DATE = format(cnvtdatetime(S.ACTIVE_STATUS_DT_TM), "MM/DD/YYYY;;D")
;, ACTIVE_STATUS_TIME = format(cnvtdatetime(S.ACTIVE_STATUS_DT_TM), "HH:MM:SS;;D")
;S.ACTIVE_STATUS_DT_TM "@SHORTDATETIME"
, SP.DEFINITION
, S.TITLE
, P.NAME_FULL_FORMATTED
, P_POSITION_DISP = UAR_GET_CODE_DISPLAY( P.POSITION_CD )
;, S_ENTRY_MODE_DISP = UAR_GET_CODE_DISPLAY( S.ENTRY_MODE_CD )
, S_STORY_COMPLETION_STATUS_DISP = UAR_GET_CODE_DISPLAY(S.STORY_COMPLETION_STATUS_CD)
;, PE.NAME_FULL_FORMATTED
, E_LOC_FACILITY_DISP = UAR_GET_CODE_DISPLAY(E.LOC_FACILITY_CD)
;, S.SCD_STORY_ID
 
FROM
SCD_STORY   S
, PRSNL   P
, PERSON   PE
, SCD_STORY_PATTERN   SSP
, SCR_PATTERN   SP
, ENCOUNTER   E
 
PLAN S WHERE  S.ACTIVE_IND =  1
;and S.AUTHOR_ID =     7265634.00
;AND S.ACTIVE_STATUS_DT_TM BETWEEN  CNVTDATETIME(CURDATE - 31, CURTIME3)
;AND CNVTDATETIME (CURDATE, CURTIME3)
and S.ACTIVE_STATUS_DT_TM between cnvtdatetime(cnvtdate(beg_dt),0)
	and cnvtdatetime(cnvtdate(end_dt),235959)
JOIN P WHERE  P.PERSON_ID =    S.ACTIVE_STATUS_PRSNL_ID      AND P.ACTIVE_IND = 1
;AND S.STORY_COMPLETION_STATUS_CD +0=  7349
JOIN pe WHERE  PE.PERSON_ID =   S.PERSON_ID     AND PE.ACTIVE_IND = 1
JOIN ssp WHERE  SSP.SCD_STORY_ID =   S.SCD_STORY_ID
JOIN sp WHERE  SP.SCR_PATTERN_ID =   SSP.SCR_PATTERN_ID
and  SSP.PATTERN_TYPE_CD +0=          9449.00
JOIN E WHERE S.ENCOUNTER_ID = E.ENCNTR_ID
and e.loc_facility_cd = $facility
 
ORDER BY
ACTIVE_STATUS_DATE   DESC
;ACTIVE_STATUS_TIME DESC
 
WITH nocounter, separator=" ", format, time= value( maxsecs ), MAXREC = 20000
 
end
go
 
