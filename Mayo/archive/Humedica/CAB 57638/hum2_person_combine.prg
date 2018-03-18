/*******************************************************
   23 Jan 2014 mrhine, Leidos: 32 columns
 
 *******************************************************/
 
drop   program hum2_person_combine:dba go
create program hum2_person_combine:dba
 
set prog_file = cnvtlower(trim(curprog))
call echo(build("begin_date:",bdate_dt_tm_dsp))
call echo(build("end_date:",edate_dt_tm_dsp))
call echo(concat("running script: ", cnvtlower(trim(curprog))))
 
Execute hum2_localize "SCRIPT_TOP", curprog
 
select into concat(print_dir,print_file)
 ACTIVE_IND             = cnvtstring(pc.ACTIVE_IND)
,ACTIVE_STATUS_CD       = cnvtstring(pc.ACTIVE_STATUS_CD)
,ACTIVE_STATUS_DT_TM    = format(pc.ACTIVE_STATUS_DT_TM,"yyyyMMddhhmmss;;d")
,ACTIVE_STATUS_PRSNL_ID = cnvtstring(pc.ACTIVE_STATUS_PRSNL_ID)
;4
,APPLICATION_FLAG       = cnvtstring(pc.APPLICATION_FLAG)
,CMB_DT_TM              = format(pc.CMB_DT_TM,"yyyyMMddhhmmss;;d")
,CMB_UPDT_ID            = cnvtstring(pc.CMB_UPDT_ID)
,COMBINE_ACTION_CD      = cnvtstring(pc.COMBINE_ACTION_CD)
,COMBINE_WEIGHT         = cnvtstring(pc.COMBINE_WEIGHT)
,CONTRIBUTOR_SYSTEM_CD  = cnvtstring(pc.CONTRIBUTOR_SYSTEM_CD)
;10
,ENCNTR_ID              = cnvtstring(pc.ENCNTR_ID)
,FROM_ALIAS_POOL_CD     = cnvtstring(pc.FROM_ALIAS_POOL_CD)
,FROM_ALIAS_TYPE_CD     = cnvtstring(pc.FROM_ALIAS_TYPE_CD)
,FROM_MRN               = trim(pc.FROM_MRN,3)
,FROM_PERSON_ID         = cnvtstring(pc.FROM_PERSON_ID)
,LAST_UTC_TS            = " " ;format(pc.LAST_UTC_TS,"yyyyMMddhhmmss;;d")
,PERSON_COMBINE_ID      = cnvtstring(pc.PERSON_COMBINE_ID)
,PREV_ACTIVE_IND        = cnvtstring(pc.PREV_ACTIVE_IND)
,PREV_ACTIVE_STATUS_CD  = cnvtstring(pc.PREV_ACTIVE_STATUS_CD)
; rowid
,PREV_CONFID_LEVEL_CD   = cnvtstring(pc.PREV_CONFID_LEVEL_CD)
;20
,TO_ALIAS_POOL_CD       = cnvtstring(pc.TO_ALIAS_POOL_CD)
,TO_ALIAS_TYPE_CD       = cnvtstring(pc.TO_ALIAS_TYPE_CD)
,TO_MRN                 = trim(pc.TO_MRN,3)
,TO_PERSON_ID           = cnvtstring(pc.TO_PERSON_ID)
,TRANSACTION_TYPE       = cnvtstring(pc.TO_ALIAS_TYPE_CD)
,UCB_DT_TM              = format(pc.UCB_DT_TM,"yyyyMMddhhmmss;;d")
,UCB_UPDT_ID            = cnvtstring(pc.UCB_UPDT_ID)
;7
,UPDT_APPLCTX           = cnvtstring(pc.UPDT_APPLCTX)
,UPDT_CNT               = cnvtstring(pc.UPDT_CNT)
,UPDT_DT_TM             = format(pc.UPDT_DT_TM,"yyyyMMddhhmmss;;d")
,UPDT_ID                = cnvtstring(pc.UPDT_ID)
,UPDT_TASK              = cnvtstring(pc.UPDT_TASK)
 
 
FROM person_combine  pc
;where pc.updt_dt_tm between cnvtdatetime("22-JAN-2014 00:00:00")
;                        and cnvtdatetime("22-JAN-2014 23:59:59")
;with time=120
;     ,maxrec=1000
 
plan pc where pc.updt_dt_tm between cnvtdatetime(bdate) and cnvtdatetime(edate)
 
head report
head_line = build(
"ACTIVE_IND"
, "||ACTIVE_STATUS_CD"
, "||ACTIVE_STATUS_DT_TM"
, "||ACTIVE_STATUS_PRSNL_ID"
 
, "||APPLICATION_FLAG"
, "||CMB_DT_TM"
, "||CMB_UPDT_ID"
, "||COMBINE_ACTION_CD"
, "||COMBINE_WEIGHT"
, "||CONTRIBUTOR_SYSTEM_CD"
, "||ENCNTR_ID"
, "||FROM_ALIAS_POOL_CD"
, "||FROM_ALIAS_TYPE_CD"
, "||FROM_MRN"
, "||FROM_PERSON_ID"
, "||LAST_UTC_TS"
, "||PERSON_COMBINE_ID"
, "||PREV_ACTIVE_IND"
, "||PREV_ACTIVE_STATUS_CD"
, "||PREV_CONFID_LEVEL_CD"
, "||TO_ALIAS_POOL_CD"
, "||TO_ALIAS_TYPE_CD"
, "||TO_MRN"
, "||TO_PERSON_ID"
, "||TRANSACTION_TYPE"
, "||UCB_DT_TM"
, "||UCB_UPDT_ID"
 
, "||UPDT_APPLCTX"
, "||UPDT_CNT"
, "||UPDT_DT_TM"
, "||UPDT_ID"
, "||UPDT_TASK"
)
 
col 0 head_line
row + 1
 
DETAIL
detail_line = build(
      ACTIVE_IND
,'||',ACTIVE_STATUS_CD
,'||',ACTIVE_STATUS_DT_TM
,'||',ACTIVE_STATUS_PRSNL_ID
 
,'||',APPLICATION_FLAG
,'||',CMB_DT_TM
,'||',CMB_UPDT_ID
,'||',COMBINE_ACTION_CD
,'||',COMBINE_WEIGHT
,'||',CONTRIBUTOR_SYSTEM_CD
,'||',ENCNTR_ID
,'||',FROM_ALIAS_POOL_CD
,'||',FROM_ALIAS_TYPE_CD
,'||',FROM_MRN
,'||',FROM_PERSON_ID
,'||',LAST_UTC_TS
,'||',PERSON_COMBINE_ID
,'||',PREV_ACTIVE_IND
,'||',PREV_ACTIVE_STATUS_CD
,'||',PREV_CONFID_LEVEL_CD
,'||',TO_ALIAS_POOL_CD
,'||',TO_ALIAS_TYPE_CD
,'||',TO_MRN
,'||',TO_PERSON_ID
,'||',TRANSACTION_TYPE
,'||',UCB_DT_TM
,'||',UCB_UPDT_ID
 
,'||',UPDT_APPLCTX
,'||',UPDT_CNT
,'||',UPDT_DT_TM
,'||',UPDT_ID
,'||',UPDT_TASK)
 
  col 0, detail_line
  row + 1
 
with maxrow = 1,
     nocounter,
     maxcol = 32000,
     format = variable
 
SET row_count = curqual
SET ERRORCODE = ERROR(ERRORMSG,0)
Execute hum2_localize "SCRIPT_BOTTOM", curprog
 
end
go
 
