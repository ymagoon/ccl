/*******************************************************
   30 Jan 2014 mrhine, Leidos: original creation in c965 per Brook
               66 columns
 *******************************************************/
 
drop   program hum2_pathway_catalog:dba go
create program hum2_pathway_catalog:dba
 
set prog_file = cnvtlower(trim(curprog))
call echo(build("begin_date:",bdate_dt_tm_dsp))
call echo(build("end_date:",edate_dt_tm_dsp))
call echo(concat("running script: ", cnvtlower(trim(curprog))))
 
Execute hum2_localize "SCRIPT_TOP", curprog
 
select into concat(print_dir,print_file)
 ACTIVE_IND                     = cnvtstring(pc.ACTIVE_IND)
,AGE_UNITS_CD                   = cnvtstring(pc.AGE_UNITS_CD)
,ALERTS_ON_PLAN_IND             = cnvtstring(pc.ALERTS_ON_PLAN_IND)
,ALERTS_ON_PLAN_UPD_IND         = cnvtstring(pc.ALERTS_ON_PLAN_UPD_IND)
,ALLOW_COPY_FORWARD_IND         = cnvtstring(pc.ALLOW_COPY_FORWARD_IND)
,AUTO_INITIATE_IND              = cnvtstring(pc.AUTO_INITIATE_IND)
,BEG_EFFECTIVE_DT_TM            = format(pc.BEG_EFFECTIVE_DT_TM,"yyyyMMddhhmmss;;d")
,COMP_FORMS_REF_ID              = cnvtstring(pc.COMP_FORMS_REF_ID)
,CONCEPT_CKI                    = trim(pc.CONCEPT_CKI,3)
,CROSS_ENCNTR_IND               = cnvtstring(pc.CROSS_ENCNTR_IND)
,CYCLE_BEGIN_NBR                = cnvtstring(pc.CYCLE_BEGIN_NBR)
,CYCLE_DISPLAY_END_IND          = cnvtstring(pc.CYCLE_DISPLAY_END_IND)
,CYCLE_END_NBR                  = cnvtstring(pc.CYCLE_END_NBR)
,CYCLE_INCREMENT_NBR            = cnvtstring(pc.CYCLE_INCREMENT_NBR)
,CYCLE_IND                      = cnvtstring(pc.CYCLE_IND)
,CYCLE_LABEL_CD                 = cnvtstring(pc.CYCLE_LABEL_CD)
,CYCLE_LOCK_END_IND             = cnvtstring(pc.CYCLE_LOCK_END_IND)
,DEFAULT_ACTION_INPT_FUTURE_CD  = cnvtstring(pc.DEFAULT_ACTION_INPT_FUTURE_CD)
,DEFAULT_ACTION_INPT_NOW_CD     = cnvtstring(pc.DEFAULT_ACTION_INPT_NOW_CD)
,DEFAULT_ACTION_OUTPT_FUTURE_CD = cnvtstring(pc.DEFAULT_ACTION_OUTPT_FUTURE_CD)
,DEFAULT_ACTION_OUTPT_NOW_CD    = cnvtstring(pc.DEFAULT_ACTION_OUTPT_NOW_CD)
,DEFAULT_START_TIME_TXT         = trim(pc.DEFAULT_START_TIME_TXT,3)
,DEFAULT_VIEW_MEAN              = trim(pc.DEFAULT_VIEW_MEAN,3)
,DEFAULT_VISIT_TYPE_FLAG        = cnvtstring(pc.DEFAULT_VISIT_TYPE_FLAG)
,DESCRIPTION                    = trim(pc.DESCRIPTION,3)
,DESCRIPTION_KEY                = trim(pc.DESCRIPTION_KEY,3)
,DESCRIPTION_KEY_A_NLS          = trim(pc.DESCRIPTION_KEY_A_NLS,3)
,DESCRIPTION_KEY_NLS            = trim(pc.DESCRIPTION_KEY_NLS,3)
,DIAGNOSIS_CAPTURE_IND          = cnvtstring(pc.DIAGNOSIS_CAPTURE_IND)
,DISPLAY_DESCRIPTION            = trim(pc.DISPLAY_DESCRIPTION,3)
,DISPLAY_METHOD_CD              = cnvtstring(pc.DISPLAY_METHOD_CD)
,DURATION_QTY                   = cnvtstring(pc.DURATION_QTY)
,DURATION_UNIT_CD               = cnvtstring(pc.DURATION_UNIT_CD)
,END_EFFECTIVE_DT_TM            = format(pc.END_EFFECTIVE_DT_TM,"yyyyMMddhhmmss;;d")
,FUTURE_IND                     = cnvtstring(pc.FUTURE_IND)
,HIDE_FLEXED_COMP_IND           = cnvtstring(pc.HIDE_FLEXED_COMP_IND)
,LONG_TEXT_ID                   = cnvtstring(pc.LONG_TEXT_ID)
,OPTIONAL_IND                   = cnvtstring(pc.OPTIONAL_IND)
,PATHWAY_CATALOG_ID             = cnvtstring(pc.PATHWAY_CATALOG_ID)
,PATHWAY_CLASS_CD               = cnvtstring(pc.PATHWAY_CLASS_CD)
,PATHWAY_TYPE_CD                = cnvtstring(pc.PATHWAY_TYPE_CD)
,PATHWAY_UUID                   = trim(pc.PATHWAY_UUID,3)
,PERIOD_CUSTOM_LABEL            = trim(pc.PERIOD_CUSTOM_LABEL,3)
,PERIOD_NBR                     = cnvtstring(pc.PERIOD_NBR)
,PRIMARY_IND                    = cnvtstring(pc.PRIMARY_IND)
,PROMPT_ON_SELECTION_IND        = cnvtstring(pc.PROMPT_ON_SELECTION_IND)
,PROVIDER_PROMPT_IND            = cnvtstring(pc.PROVIDER_PROMPT_IND)
,PW_FORMS_REF_ID                = cnvtstring(pc.PW_FORMS_REF_ID)
,REF_OWNER_PERSON_ID            = cnvtstring(pc.REF_OWNER_PERSON_ID) 
,RESCHEDULE_REASON_ACCEPT_FLAG  = cnvtstring(pc.RESCHEDULE_REASON_ACCEPT_FLAG) 
,RESTRICTED_ACTIONS_BITMASK     = cnvtstring(pc.RESTRICTED_ACTIONS_BITMASK) 
,RESTRICT_CC_ADD_IND            = cnvtstring(pc.RESTRICT_CC_ADD_IND) 
,RESTRICT_COMP_ADD_IND          = cnvtstring(pc.RESTRICT_COMP_ADD_IND) 
,RESTRICT_TF_ADD_IND            = cnvtstring(pc.RESTRICT_TF_ADD_IND) 
,ROUTE_FOR_REVIEW_IND           = cnvtstring(pc.ROUTE_FOR_REVIEW_IND) 
,STANDARD_CYCLE_NBR             = cnvtstring(pc.STANDARD_CYCLE_NBR) 
,SUB_PHASE_IND                  = cnvtstring(pc.SUB_PHASE_IND) 
,TYPE_MEAN                      = trim(pc.TYPE_MEAN,3)
,UPDT_APPLCTX                   = cnvtstring(pc.UPDT_APPLCTX)
,UPDT_CNT                       = cnvtstring(pc.UPDT_CNT)
,UPDT_DT_TM                     = format(pc.UPDT_DT_TM,"yyyyMMddhhmmss;;d")
,UPDT_ID                        = cnvtstring(pc.UPDT_ID)
,UPDT_TASK                      = cnvtstring(pc.UPDT_TASK)
,VERSION                        = cnvtstring(pc.VERSION)
,VERSION_PW_CAT_ID              = cnvtstring(pc.VERSION_PW_CAT_ID)
,VERSION_TEXT_ID                = cnvtstring(pc.VERSION_TEXT_ID)

 
FROM pathway_catalog  pc
where pc.pathway_catalog_id > 0  ;hit an index
;with time=120
;     ,maxrec=1000
  and pc.updt_dt_tm between cnvtdatetime(bdate) and cnvtdatetime(edate)
 
head report
head_line = build(
  "ACTIVE_IND"
, "||AGE_UNITS_CD"
, "||ALERTS_ON_PLAN_IND"
, "||ALERTS_ON_PLAN_UPD_IND"
, "||ALLOW_COPY_FORWARD_IND"
, "||AUTO_INITIATE_IND"
, "||BEG_EFFECTIVE_DT_TM"
, "||COMP_FORMS_REF_ID"
, "||CONCEPT_CKI"
, "||CROSS_ENCNTR_IND"
, "||CYCLE_BEGIN_NBR"
, "||CYCLE_DISPLAY_END_IND"
, "||CYCLE_END_NBR"
, "||CYCLE_INCREMENT_NBR"
, "||CYCLE_IND"
, "||CYCLE_LABEL_CD"
, "||CYCLE_LOCK_END_IND"
, "||DEFAULT_ACTION_INPT_FUTURE_CD"
, "||DEFAULT_ACTION_INPT_NOW_CD"
, "||DEFAULT_ACTION_OUTPT_FUTURE_CD"
, "||DEFAULT_ACTION_OUTPT_NOW_CD"
, "||DEFAULT_START_TIME_TXT"
, "||DEFAULT_VIEW_MEAN"
, "||DEFAULT_VISIT_TYPE_FLAG"
, "||DESCRIPTION"
, "||DESCRIPTION_KEY"
, "||DESCRIPTION_KEY_A_NLS"
, "||DESCRIPTION_KEY_NLS"
, "||DIAGNOSIS_CAPTURE_IND"
, "||DISPLAY_DESCRIPTION"
, "||DISPLAY_METHOD_CD"
, "||DURATION_QTY"
, "||DURATION_UNIT_CD"
, "||END_EFFECTIVE_DT_TM"
, "||FUTURE_IND"
, "||HIDE_FLEXED_COMP_IND"
, "||LONG_TEXT_ID"
, "||OPTIONAL_IND"
, "||PATHWAY_CATALOG_ID"
, "||PATHWAY_CLASS_CD"
, "||PATHWAY_TYPE_CD"
, "||PATHWAY_UUID"
, "||PERIOD_CUSTOM_LABEL"
, "||PERIOD_NBR"
, "||PRIMARY_IND"
, "||PROMPT_ON_SELECTION_IND"
, "||PROVIDER_PROMPT_IND"
, "||PW_FORMS_REF_ID"
, "||REF_OWNER_PERSON_ID"
, "||RESCHEDULE_REASON_ACCEPT_FLAG"
, "||RESTRICTED_ACTIONS_BITMASK"
, "||RESTRICT_CC_ADD_IND"
, "||RESTRICT_COMP_ADD_IND"
, "||RESTRICT_TF_ADD_IND"
, "||ROUTE_FOR_REVIEW_IND"
, "||STANDARD_CYCLE_NBR"
, "||SUB_PHASE_IND"
, "||TYPE_MEAN"
, "||UPDT_APPLCTX"
, "||UPDT_CNT"
, "||UPDT_DT_TM"
, "||UPDT_ID"
, "||UPDT_TASK"
, "||VERSION"
, "||VERSION_PW_CAT_ID"
, "||VERSION_TEXT_ID"
)
 
col 0 head_line
row + 1
 
DETAIL
detail_line = build(
      ACTIVE_IND
,'||',AGE_UNITS_CD
,'||',ALERTS_ON_PLAN_IND
,'||',ALERTS_ON_PLAN_UPD_IND
,'||',ALLOW_COPY_FORWARD_IND
,'||',AUTO_INITIATE_IND
,'||',BEG_EFFECTIVE_DT_TM
,'||',COMP_FORMS_REF_ID
,'||',CONCEPT_CKI
,'||',CROSS_ENCNTR_IND
,'||',CYCLE_BEGIN_NBR
,'||',CYCLE_DISPLAY_END_IND
,'||',CYCLE_END_NBR
,'||',CYCLE_INCREMENT_NBR
,'||',CYCLE_IND
,'||',CYCLE_LABEL_CD
,'||',CYCLE_LOCK_END_IND
,'||',DEFAULT_ACTION_INPT_FUTURE_CD
,'||',DEFAULT_ACTION_INPT_NOW_CD
,'||',DEFAULT_ACTION_OUTPT_FUTURE_CD
,'||',DEFAULT_ACTION_OUTPT_NOW_CD
,'||',DEFAULT_START_TIME_TXT
,'||',DEFAULT_VIEW_MEAN
,'||',DEFAULT_VISIT_TYPE_FLAG
,'||',DESCRIPTION
,'||',DESCRIPTION_KEY
,'||',DESCRIPTION_KEY_A_NLS
,'||',DESCRIPTION_KEY_NLS
,'||',DIAGNOSIS_CAPTURE_IND
,'||',DISPLAY_DESCRIPTION
,'||',DISPLAY_METHOD_CD
,'||',DURATION_QTY
,'||',DURATION_UNIT_CD
,'||',END_EFFECTIVE_DT_TM
,'||',FUTURE_IND
,'||',HIDE_FLEXED_COMP_IND
,'||',LONG_TEXT_ID
,'||',OPTIONAL_IND
,'||',PATHWAY_CATALOG_ID
,'||',PATHWAY_CLASS_CD
,'||',PATHWAY_TYPE_CD
,'||',PATHWAY_UUID
,'||',PERIOD_CUSTOM_LABEL
,'||',PERIOD_NBR
,'||',PRIMARY_IND
,'||',PROMPT_ON_SELECTION_IND
,'||',PROVIDER_PROMPT_IND
,'||',PW_FORMS_REF_ID
,'||',REF_OWNER_PERSON_ID
,'||',RESCHEDULE_REASON_ACCEPT_FLAG
,'||',RESTRICTED_ACTIONS_BITMASK
,'||',RESTRICT_CC_ADD_IND
,'||',RESTRICT_COMP_ADD_IND
,'||',RESTRICT_TF_ADD_IND
,'||',ROUTE_FOR_REVIEW_IND
,'||',STANDARD_CYCLE_NBR
,'||',SUB_PHASE_IND
,'||',TYPE_MEAN
,'||',UPDT_APPLCTX
,'||',UPDT_CNT
,'||',UPDT_DT_TM
,'||',UPDT_ID
,'||',UPDT_TASK
,'||',VERSION
,'||',VERSION_PW_CAT_ID
,'||',VERSION_TEXT_ID
)
 
  col 0, detail_line
  row + 1
 
with maxrow = 1,
     nocounter,
     maxcol = 32000,
     format = variable
;     ,maxrec=1000
 
SET row_count = curqual
SET ERRORCODE = ERROR(ERRORMSG,0)
Execute hum2_localize "SCRIPT_BOTTOM", curprog
 
end
go
 
