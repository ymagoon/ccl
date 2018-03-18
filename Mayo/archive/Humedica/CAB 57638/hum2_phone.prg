/*******************************************************
   6 Jan 2014 mrhine, Leidos: original creation in c965 per Brook
 
 *******************************************************/
 
drop   program hum2_phone:dba go
create program hum2_phone:dba
 
set prog_file = cnvtlower(trim(curprog))
call echo(build("begin_date:",bdate_dt_tm_dsp))
call echo(build("end_date:",edate_dt_tm_dsp))
call echo(concat("running script: ", cnvtlower(trim(curprog))))
 
Execute hum2_localize "SCRIPT_TOP", curprog
 
select into concat(print_dir,print_file)
 ACTIVE_IND             = cnvtstring(ph.ACTIVE_IND)
,ACTIVE_STATUS_CD       = cnvtstring(ph.ACTIVE_STATUS_CD)
,ACTIVE_STATUS_DT_TM    = format(ph.ACTIVE_STATUS_DT_TM,"yyyyMMddhhmmss;;d")
,ACTIVE_STATUS_PRSNL_ID = cnvtstring(ph.ACTIVE_STATUS_PRSNL_ID)
,BEG_EFFECTIVE_DT_TM    = format(ph.ACTIVE_STATUS_DT_TM,"yyyyMMddhhmmss;;d")
,BEG_EFFECTIVE_MM_DD    = cnvtstring(ph.BEG_EFFECTIVE_MM_DD)
,CALL_INSTRUCTION       = trim(ph.CALL_INSTRUCTION,3)
,CONTACT                = trim(ph.CONTACT,3)
,CONTACT_METHOD_CD      = cnvtstring(ph.CONTACT_METHOD_CD)
,CONTRIBUTOR_SYSTEM_CD  = cnvtstring(ph.CONTRIBUTOR_SYSTEM_CD)
,DATA_STATUS_CD         = cnvtstring(ph.DATA_STATUS_CD)
,DATA_STATUS_DT_TM      = format(ph.DATA_STATUS_DT_TM,"yyyyMMddhhmmss;;d")
,DATA_STATUS_PRSNL_ID   = cnvtstring(ph.DATA_STATUS_PRSNL_ID)
,DESCRIPTION            = trim(ph.DESCRIPTION,3)
,END_EFFECTIVE_DT_TM    = format(ph.END_EFFECTIVE_DT_TM,"yyyyMMddhhmmss;;d")
,END_EFFECTIVE_MM_DD    = cnvtstring(ph.END_EFFECTIVE_MM_DD)
,EXTENSION              = trim(ph.EXTENSION,3)
;,LAST_UTC_TS            = format(ph.LAST_UTC_TS,"yyyyMMddhhmmss;;d")
,LAST_UTC_TS            = ""
,LONG_TEXT_ID           = cnvtstring(ph.LONG_TEXT_ID)
,MODEM_CAPABILITY_CD    = cnvtstring(ph.MODEM_CAPABILITY_CD)
,OPERATION_HOURS        = trim(ph.OPERATION_HOURS,3)
,PAGING_CODE            = trim(ph.PAGING_CODE,3)
,PARENT_ENTITY_ID       = cnvtstring(ph.PARENT_ENTITY_ID)
,PARENT_ENTITY_NAME     = trim(ph.PARENT_ENTITY_NAME,3)
,PHONE_FORMAT_CD        = cnvtstring(ph.PHONE_FORMAT_CD)
,PHONE_ID               = cnvtstring(ph.PHONE_ID)
,PHONE_NUM              = trim(ph.PHONE_NUM,3)
,PHONE_NUM_KEY          = trim(ph.PHONE_NUM_KEY,3)
,PHONE_NUM_KEY_A_NLS    = trim(ph.PHONE_NUM_KEY_A_NLS,3)
,PHONE_NUM_KEY_NLS      = trim(ph.PHONE_NUM_KEY_NLS,3)
,PHONE_TYPE_CD          = cnvtstring(ph.PHONE_TYPE_CD)
,PHONE_TYPE_SEQ         = cnvtstring(ph.PHONE_TYPE_SEQ)
,SOURCE_IDENTIFIER      = trim(ph.SOURCE_IDENTIFIER,3)
,UPDT_APPLCTX           = cnvtstring(ph.UPDT_APPLCTX)
,UPDT_CNT               = cnvtstring(ph.UPDT_CNT)
,UPDT_DT_TM             = format(ph.UPDT_DT_TM,"yyyyMMddhhmmss;;d")
,UPDT_ID                = cnvtstring(ph.UPDT_ID)
,UPDT_TASK              = cnvtstring(ph.UPDT_TASK)
 
 
FROM phone  ph
;where ph.phone_id > 0
;with time=120
;     ,maxrec=1000
;     ,orahintcbo("INDEX_DESC(p xpkphone)") ;xie4phone)")
 
plan ph where ph.phone_id > 0  ; hit an index
          and ph.updt_dt_tm between cnvtdatetime(bdate) and cnvtdatetime(edate)
 
head report
head_line = build(
"ACTIVE_IND"
, "||ACTIVE_STATUS_CD"
, "||ACTIVE_STATUS_DT_TM"
, "||ACTIVE_STATUS_PRSNL_ID"
, "||BEG_EFFECTIVE_DT_TM"
, "||BEG_EFFECTIVE_MM_DD"
, "||CALL_INSTRUCTION"
, "||CONTACT"
, "||CONTACT_METHOD_CD"
, "||CONTRIBUTOR_SYSTEM_CD"
, "||DATA_STATUS_CD"
, "||DATA_STATUS_DT_TM"
, "||DATA_STATUS_PRSNL_ID"
, "||DESCRIPTION"
, "||END_EFFECTIVE_DT_TM"
, "||END_EFFECTIVE_MM_DD"
, "||EXTENSION"
, "||LAST_UTC_TS"
, "||LONG_TEXT_ID"
, "||MODEM_CAPABILITY_CD"
, "||OPERATION_HOURS"
, "||PAGING_CODE"
, "||PARENT_ENTITY_ID"
, "||PARENT_ENTITY_NAME"
, "||PHONE_FORMAT_CD"
, "||PHONE_ID"
, "||PHONE_NUM"
, "||PHONE_NUM_KEY"
, "||PHONE_NUM_KEY_A_NLS"
, "||PHONE_NUM_KEY_NLS"
, "||PHONE_TYPE_CD"
, "||PHONE_TYPE_SEQ"
, "||SOURCE_IDENTIFIER"
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
,'||',BEG_EFFECTIVE_DT_TM
,'||',BEG_EFFECTIVE_MM_DD
,'||',CALL_INSTRUCTION
,'||',CONTACT
,'||',CONTACT_METHOD_CD
,'||',CONTRIBUTOR_SYSTEM_CD
,'||',DATA_STATUS_CD
,'||',DATA_STATUS_DT_TM
,'||',DATA_STATUS_PRSNL_ID
,'||',DESCRIPTION
,'||',END_EFFECTIVE_DT_TM
,'||',END_EFFECTIVE_MM_DD
,'||',EXTENSION
,'||',LAST_UTC_TS
,'||',LONG_TEXT_ID
,'||',MODEM_CAPABILITY_CD
,'||',OPERATION_HOURS
,'||',PAGING_CODE
,'||',PARENT_ENTITY_ID
,'||',PARENT_ENTITY_NAME
,'||',PHONE_FORMAT_CD
,'||',PHONE_ID
,'||',PHONE_NUM
,'||',PHONE_NUM_KEY
,'||',PHONE_NUM_KEY_A_NLS
,'||',PHONE_NUM_KEY_NLS
,'||',PHONE_TYPE_CD
,'||',PHONE_TYPE_SEQ
,'||',SOURCE_IDENTIFIER
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
;     ,maxrec=1000
     ,orahintcbo("INDEX_DESC(p xpkphone)")
 
SET row_count = curqual
SET ERRORCODE = ERROR(ERRORMSG,0)
Execute hum2_localize "SCRIPT_BOTTOM", curprog
 
end
go
 

