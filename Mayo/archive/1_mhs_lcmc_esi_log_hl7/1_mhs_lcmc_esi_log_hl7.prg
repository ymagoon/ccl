/***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
 *000                               translate version                  *
 *001 07/29/12 Akcia                changes to improve efficiency for oracle upgrade     *
 ***********************************************************************/
DROP PROGRAM   1_MHS_LCMC_ESI_LOG_HL7 : DBA  GO
CREATE PROGRAM  1_MHS_LCMC_ESI_LOG_HL7 : DBA
PROMPT "Output to File/Printer/MINE" ="MINE" ,
"Enter Contributor System (ie, CFMC_SYS)" ="LCMC_RIMS_SYS" ,
"Enter number of days back for report to run:" =0
 WITH  PROMPT1 , PROMPT2 , PROMPT3

SELECT  INTO  $1
 MESSAGEDATE =E.MSH_DATE,
 APPLICATION =E.MSH_SENDING_APP,
 PATIENT =E.NAME_FULL_FORMATTED,
 ERROR =E.ERROR_TEXT,
 HL7MESSAGE = SUBSTRING ( 1 ,  650 , O.MSG_TEXT)
FROM ( OEN_TXLOG  O ),
( ESI_LOG  E )
 
;001  WHERE (O.TX_KEY=E.TX_KEY) AND (E.MSH_SENDING_APP= $2 ) AND (E.ERROR_STAT= "ESI_STAT_FAILURE" ) AND (
;001 E.UPDT_DT_TM>= CNVTDATETIME (( CURDATE - $3 ),  0 ))
plan e															;001
where e.create_dt_tm >= cnvtdatetime((curdate - $3),0)			;001
  and e.msh_sending_app = $2									;001
  and e.error_stat = "ESI_STAT_FAILURE"							;001
 
join o															;001
where o.tx_key = e.tx_key
ORDER BY E.MSH_DATE DESC
 WITH  FORMAT , SEPARATOR = " " , DIO = 38
 END GO

