 
drop program hum_bc_meddis_monthly:dba go
create program hum_bc_meddis_monthly:dba
 
;**** BEGINNING OF PREAMBLE ****
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
;********************************************************
 
declare startdt = f8
declare enddt = f8
 
set stardt = cnvtdatetime(curdate-1,0)
set endt = cnvtdatetime(curdate-1,235959)
 
set startdt = cnvtdatetime(stardt)
set enddt = cnvtdatetime(endt)
free set today
declare today = f8
declare edt = vc
declare ydt = vc
 
declare month = vc
set month = format(startdt,"mmm;;d")
set dir_date = format(curdate,"yyyymm;;d")
 
set today = cnvtdatetime(curdate,curtime3)
set edt = format(today,"yyyymmdd;;d")
set dirdt = format(startdt,"yyyymmdd;;d")
set ydt = format(startdt,"yyyy;;d")
 
set beg_dt = startdt
set echo_beg_dt = format(beg_dt,"dd/mmm/yyyy hh:mm;;d")
set end_dt = enddt
set echo_end_dt = format(end_dt,"dd/mmm/yyyy hh:mm;;d")
 
 
;002 unique file logic
set print_file = concat("hum_zh_medication_dispense_",dirdt,".dat")
set hold_file = concat("$CCLUSERDIR/",print_file)
;set hold_file = concat("$CCLSCRATCH/",print_file)
set print_dir = "ccluserdir:"
set client_code = "H416989"
set file_ext = "_zh_medication_dispense.txt"
 
call echo("---- dump the med_dispense table ------")
 
record tmp
(
1 line_out = vc
1 qual [*]
5 MED_DISPENSE_ID = vc
5 ITEM_ID            = vc
5 MED_PACKAGE_TYPE_ID = vc
5 PHARMACY_TYPE_CD   = vc
5 PARENT_ENTITY_ID   = vc
5 PARENT_ENTITY_NAME = vc
5 FLEX_TYPE_CD       = vc
5 FLEX_SORT_FLAG     = vc
5 STRENGTH           = vc
5 STRENGTH_UNIT_CD   = vc
5 VOLUME             = vc
5 VOLUME_UNIT_CD     = vc
5 DISPENSE_FACTOR    = vc
5 PAT_ORDERABLE_IND   = vc
5 LEGAL_STATUS_CD              = vc
5 FORMULARY_STATUS_CD         = vc
5 OE_FORMAT_FLAG              = vc
5 MED_FILTER_IND              = vc
5 CONTINUOUS_FILTER_IND       = vc
5 INTERMITTENT_FILTER_IND     = vc
5 DIVISIBLE_IND               = vc
5 USED_AS_BASE_IND            = vc
5 ALWAYS_DISPENSE_FROM_FLAG   = vc
5 DISPENSE_QTY                = vc
5 LABEL_RATIO                 = vc
5 UPDT_CNT                    = vc
5 UPDT_DT_TM                  = vc
5 UPDT_ID                     = vc
5 UPDT_TASK                   = vc
5 UPDT_APPLCTX                = vc
5 INFINITE_DIV_IND            = vc
5  PACKAGE_TYPE_ID         = vc
5  REUSABLE_IND            = vc
5  BASE_ISSUE_FACTOR       = vc
5  TPN_FILTER_IND          = vc
5  PKG_QTY_PER_PKG         = vc
5  PKG_DISP_MORE_IND       = vc
5  OVERRIDE_CLSFCTN_CD     = vc
5  RX_STATION_NOTES_ID     = vc
5  WITNESS_RETURN_IND      = vc
5  WITNESS_DISPENSE_IND    = vc
5  WITNESS_OVERRIDE_IND    = vc
5  WITNESS_WASTE_IND       = vc
5  WITNESS_ADHOC_IND       = vc
5  WORKFLOW_CD             = vc
5  LOT_TRACKING_IND        = vc
5  TPN_PRODUCT_TYPE_FLAG   = vc
5  TPN_SCALE_FLAG          = vc
5  TPN_OVERFILL_AMT        = vc
5 TPN_OVERFILL_UNIT_CD     = vc
5 TPN_FILL_METHOD_CD       = vc
5 TPN_PREFERRED_CATION_CD  = vc
5 TPN_INCLUDE_IONS_FLAG    = vc
5 TPN_BALANCE_METHOD_CD    = vc
5 TPN_CHLORIDE_PCT         = vc
5 INV_FACTOR_NBR             = vc
5 TPN_DEFAULT_INGRED_ITEM_ID = vc
5 WITNESS_INV_COUNT_IND      = vc
5 POC_CHARGE_FLAG   = vc
)
 
 
select into "nl:"
 
 
md.item_id
from med_dispense md
plan md where md.item_id > 0
head report
x=0
idx = 0
head md.med_dispense_id
idx = idx + 1
stat = alterlist(tmp->qual,idx)
 
 tmp->qual[idx]->MED_DISPENSE_ID       =  cnvtstring(md.med_dispense_id)
 tmp->qual[idx]->ITEM_ID                  =  cnvtstring(md.item_id)
 tmp->qual[idx]->MED_PACKAGE_TYPE_ID        =  cnvtstring(md.med_package_type_id)
 tmp->qual[idx]->PHARMACY_TYPE_CD            =  cnvtstring(md.pharmacy_type_cd)
 tmp->qual[idx]->PARENT_ENTITY_ID              =  cnvtstring(md.parent_entity_id)
 tmp->qual[idx]->PARENT_ENTITY_NAME              =  trim(md.parent_entity_name,3)
 tmp->qual[idx]->FLEX_TYPE_CD          =  cnvtstring(md.flex_type_cd)
 tmp->qual[idx]->FLEX_SORT_FLAG        =  cnvtstring(md.flex_sort_flag)
 tmp->qual[idx]->STRENGTH              =  format(md.strength,"#####.#####")
 tmp->qual[idx]->STRENGTH_UNIT_CD      =  cnvtstring(md.strength_unit_cd)
 tmp->qual[idx]->VOLUME                =  format(md.volume,"#####.#####")
tmp->qual[idx]->VOLUME_UNIT_CD        =  cnvtstring(md.volume_unit_cd)
 tmp->qual[idx]->DISPENSE_FACTOR      =  cnvtstring( md.dispense_factor)
tmp->qual[idx]->PAT_ORDERABLE_IND         =  cnvtstring(md.pat_orderable_ind)
tmp->qual[idx]->LEGAL_STATUS_CD              =  cnvtstring(md.legal_status_cd)
tmp->qual[idx]->FORMULARY_STATUS_CD         =  cnvtstring(md.FORMULARY_STATUS_CD)
tmp->qual[idx]->OE_FORMAT_FLAG              =  cnvtstring(md.OE_FORMAT_FLAG)
tmp->qual[idx]->MED_FILTER_IND              =  cnvtstring(md.MED_FILTER_IND)
tmp->qual[idx]->CONTINUOUS_FILTER_IND       =  cnvtstring(md.CONTINUOUS_FILTER_IND)
tmp->qual[idx]->INTERMITTENT_FILTER_IND     =  cnvtstring(md.INTERMITTENT_FILTER_IND)
tmp->qual[idx]->DIVISIBLE_IND               =  cnvtstring(md.DIVISIBLE_IND)
tmp->qual[idx]->USED_AS_BASE_IND            =  cnvtstring(md.USED_AS_BASE_IND)
tmp->qual[idx]->ALWAYS_DISPENSE_FROM_FLAG   =  cnvtstring(md.ALWAYS_DISPENSE_FROM_FLAG)
tmp->qual[idx]->DISPENSE_QTY                =  cnvtstring(md.DISPENSE_QTY)
tmp->qual[idx]->LABEL_RATIO                 =  cnvtstring(md.label_ratio)
tmp->qual[idx]->UPDT_DT_TM                  =  format(md.updt_dt_tm,"YYYYMMDDhhmmss;;d")
tmp->qual[idx]->UPDT_ID                     =  cnvtstring(md.updt_id)
tmp->qual[idx]->INFINITE_DIV_IND            =  cnvtstring(md.INFINITE_DIV_IND)
tmp->qual[idx]->PACKAGE_TYPE_ID         =  cnvtstring(md.package_type_id)
tmp->qual[idx]->REUSABLE_IND            =  cnvtstring(md.reusable_ind)
tmp->qual[idx]->BASE_ISSUE_FACTOR       =  cnvtstring(md.BASE_ISSUE_FACTOR)
tmp->qual[idx]->TPN_FILTER_IND          =  cnvtstring(md.TPN_FILTER_IND)
tmp->qual[idx]->PKG_QTY_PER_PKG         =  cnvtstring(md.PKG_QTY_PER_PKG)
tmp->qual[idx]->PKG_DISP_MORE_IND       =  cnvtstring(md.PKG_DISP_MORE_IND)
tmp->qual[idx]->OVERRIDE_CLSFCTN_CD     =  cnvtstring(md.OVERRIDE_CLSFCTN_CD)
tmp->qual[idx]->RX_STATION_NOTES_ID     =  cnvtstring(md.RX_STATION_NOTES_ID)
tmp->qual[idx]->WITNESS_RETURN_IND      =  cnvtstring(md.witness_return_ind)
tmp->qual[idx]->WITNESS_DISPENSE_IND    =  cnvtstring(md.WITNESS_DISPENSE_IND)
tmp->qual[idx]->WITNESS_OVERRIDE_IND    =  cnvtstring(md.WITNESS_OVERRIDE_IND)
tmp->qual[idx]->WITNESS_WASTE_IND       =  cnvtstring(md.WITNESS_WASTE_IND)
tmp->qual[idx]->WITNESS_ADHOC_IND       =  cnvtstring(md.WITNESS_ADHOC_IND)
tmp->qual[idx]->WORKFLOW_CD             =  cnvtstring(md.WORKFLOW_CD)
tmp->qual[idx]->LOT_TRACKING_IND        =  cnvtstring(md.LOT_TRACKING_IND)
tmp->qual[idx]->TPN_PRODUCT_TYPE_FLAG   =  cnvtstring(md.TPN_PRODUCT_TYPE_FLAG)
tmp->qual[idx]->TPN_SCALE_FLAG          =  cnvtstring(md.TPN_SCALE_FLAG)
tmp->qual[idx]->TPN_OVERFILL_AMT        =  cnvtstring(md.TPN_OVERFILL_AMT)
tmp->qual[idx]->TPN_OVERFILL_UNIT_CD     =  cnvtstring(md.TPN_OVERFILL_UNIT_CD)
tmp->qual[idx]->TPN_FILL_METHOD_CD       =  cnvtstring(md.TPN_FILL_METHOD_CD)
tmp->qual[idx]->TPN_PREFERRED_CATION_CD  =  cnvtstring(md.TPN_PREFERRED_CATION_CD)
tmp->qual[idx]->TPN_INCLUDE_IONS_FLAG    =  cnvtstring(md.TPN_INCLUDE_IONS_FLAG)
tmp->qual[idx]->TPN_BALANCE_METHOD_CD    =  cnvtstring(md.TPN_BALANCE_METHOD_CD)
tmp->qual[idx]->TPN_CHLORIDE_PCT         =  cnvtstring(md.TPN_CHLORIDE_PCT)
tmp->qual[idx]->INV_FACTOR_NBR             =  cnvtstring(md.INV_FACTOR_NBR)
tmp->qual[idx]->TPN_DEFAULT_INGRED_ITEM_ID =  cnvtstring(md.TPN_DEFAULT_INGRED_ITEM_ID)
tmp->qual[idx]->WITNESS_INV_COUNT_IND      =  cnvtstring(md.WITNESS_INV_COUNT_IND)
tmp->qual[idx]->POC_CHARGE_FLAG   =  cnvtstring(md.POC_CHARGE_FLAG)
 
 
with nocounter
 
 
select into concat(print_dir,print_file)	;humedica_bc_meddis
  item = trim(tmp->qual[d.seq]->item_id)
 
from
  (dummyt d with seq=value(size(tmp->qual,5)))
  plan d
  head report
tmp->line_out = build(
 
"MED_DISPENSE_ID",
"||ITEM_ID",
"||MED_PACKAGE_TYPE_ID",
"||PHARMACY_TYPE_CD",
"||PARENT_ENTITY_ID",
"||PARENT_ENTITY_NAME",
"||FLEX_TYPE_CD",
"||FLEX_SORT_FLAG",
"||STRENGTH",
"||STRENGTH_UNIT_CD",
"||VOLUME",
"||VOLUME_UNIT_CD",
"||DISPENSE_FACTOR",
"||PAT_ORDERABLE_IND",
"||LEGAL_STATUS_CD",
"||FORMULARY_STATUS_CD",
"||OE_FORMAT_FLAG",
"||MED_FILTER_IND",
"||CONTINUOUS_FILTER_IND",
"||INTERMITTENT_FILTER_IND",
"||DIVISIBLE_IND",
"||USED_AS_BASE_IND",
"||ALWAYS_DISPENSE_FROM_FLAG",
"||DISPENSE_QTY",
"||LABEL_RATIO",
"||UPDT_CNT",
"||UPDT_DT_TM",
"||UPDT_ID",
"||UPDT_TASK",
"||UPDT_APPLCTX",
"||INFINITE_DIV_IND",
"||PACKAGE_TYPE_ID",
"||REUSABLE_IND",
"||BASE_ISSUE_FACTOR",
"||TPN_FILTER_IND",
"||PKG_QTY_PER_PKG",
"||PKG_DISP_MORE_IND",
"||OVERRIDE_CLSFCTN_CD",
"||RX_STATION_NOTES_ID",
"||WITNESS_RETURN_IND",
"||WITNESS_DISPENSE_IND",
"||WITNESS_OVERRIDE_IND",
"||WITNESS_WASTE_IND",
"||WITNESS_ADHOC_IND",
"||WORKFLOW_CD",
"||LOT_TRACKING_IND",
"||TPN_PRODUCT_TYPE_FLAG",
"||TPN_SCALE_FLAG",
"||TPN_OVERFILL_AMT",
"||TPN_OVERFILL_UNIT_CD",
"||TPN_FILL_METHOD_CD",
"||TPN_PREFERRED_CATION_CD",
"||TPN_INCLUDE_IONS_FLAG",
"||TPN_BALANCE_METHOD_CD",
"||TPN_CHLORIDE_PCT",
"||INV_FACTOR_NBR",
"||TPN_DEFAULT_INGRED_ITEM_ID",
"||WITNESS_INV_COUNT_IND",
"||POC_CHARGE_FLAG|")
 
col 0 tmp->line_out
row+1
detail
tmp->line_out = build(
 
tmp->qual[d.seq]->MED_DISPENSE_ID,'||',
tmp->qual[d.seq]->ITEM_ID,'||',
tmp->qual[d.seq]->MED_PACKAGE_TYPE_ID,'||',
tmp->qual[d.seq]->PHARMACY_TYPE_CD,'||',
tmp->qual[d.seq]->PARENT_ENTITY_ID,'||',
tmp->qual[d.seq]->PARENT_ENTITY_NAME,'||',
tmp->qual[d.seq]->FLEX_TYPE_CD,'||',
tmp->qual[d.seq]->FLEX_SORT_FLAG,'||',
tmp->qual[d.seq]->STRENGTH,'||',
tmp->qual[d.seq]->STRENGTH_UNIT_CD,'||',
tmp->qual[d.seq]->VOLUME,'||',
tmp->qual[d.seq]->VOLUME_UNIT_CD,'||',
tmp->qual[d.seq]->DISPENSE_FACTOR,'||',
tmp->qual[d.seq]->PAT_ORDERABLE_IND,'||',
tmp->qual[d.seq]->LEGAL_STATUS_CD,'||',
tmp->qual[d.seq]->FORMULARY_STATUS_CD,'||',
tmp->qual[d.seq]->OE_FORMAT_FLAG,'||',
tmp->qual[d.seq]->MED_FILTER_IND,'||',
tmp->qual[d.seq]->CONTINUOUS_FILTER_IND,'||',
tmp->qual[d.seq]->INTERMITTENT_FILTER_IND,'||',
tmp->qual[d.seq]->DIVISIBLE_IND,'||',
tmp->qual[d.seq]->USED_AS_BASE_IND,'||',
tmp->qual[d.seq]->ALWAYS_DISPENSE_FROM_FLAG,'||',
tmp->qual[d.seq]->DISPENSE_QTY,'||',
tmp->qual[d.seq]->LABEL_RATIO,'||',
tmp->qual[d.seq]->UPDT_CNT,'||',
tmp->qual[d.seq]->UPDT_DT_TM,'||',
tmp->qual[d.seq]->UPDT_ID,'||',
tmp->qual[d.seq]->UPDT_TASK,'||',
tmp->qual[d.seq]->UPDT_APPLCTX,'||',
tmp->qual[d.seq]->INFINITE_DIV_IND,'||',
tmp->qual[d.seq]->PACKAGE_TYPE_ID,'||',
tmp->qual[d.seq]->REUSABLE_IND,'||',
tmp->qual[d.seq]->BASE_ISSUE_FACTOR,'||',
tmp->qual[d.seq]->TPN_FILTER_IND,'||',
tmp->qual[d.seq]->PKG_QTY_PER_PKG,'||',
tmp->qual[d.seq]->PKG_DISP_MORE_IND,'||',
tmp->qual[d.seq]->OVERRIDE_CLSFCTN_CD,'||',
tmp->qual[d.seq]->RX_STATION_NOTES_ID,'||',
tmp->qual[d.seq]->WITNESS_RETURN_IND,'||',
tmp->qual[d.seq]->WITNESS_DISPENSE_IND,'||',
tmp->qual[d.seq]->WITNESS_OVERRIDE_IND,'||',
tmp->qual[d.seq]->WITNESS_WASTE_IND,'||',
tmp->qual[d.seq]->WITNESS_ADHOC_IND,'||',
tmp->qual[d.seq]->WORKFLOW_CD,'||',
tmp->qual[d.seq]->LOT_TRACKING_IND,'||',
tmp->qual[d.seq]->TPN_PRODUCT_TYPE_FLAG,'||',
tmp->qual[d.seq]->TPN_SCALE_FLAG,'||',
tmp->qual[d.seq]->TPN_OVERFILL_AMT,'||',
tmp->qual[d.seq]->TPN_OVERFILL_UNIT_CD,'||',
tmp->qual[d.seq]->TPN_FILL_METHOD_CD,'||',
tmp->qual[d.seq]->TPN_PREFERRED_CATION_CD,'||',
tmp->qual[d.seq]->TPN_INCLUDE_IONS_FLAG,'||',
tmp->qual[d.seq]->TPN_BALANCE_METHOD_CD,'||',
tmp->qual[d.seq]->TPN_CHLORIDE_PCT,'||',
tmp->qual[d.seq]->INV_FACTOR_NBR,'||',
tmp->qual[d.seq]->TPN_DEFAULT_INGRED_ITEM_ID,'||',
tmp->qual[d.seq]->WITNESS_INV_COUNT_IND,'||',
tmp->qual[d.seq]->POC_CHARGE_FLAG,'|'
 
 )
col 0 tmp->line_out
row+1
 
with formfeed = none,
     maxrow = 1,
     nocounter,
     maxcol = 5000,
     format = variable
 
;****  BEGINNING OF POSTAMBLE ****
DECLARE LEN = I4
DECLARE dclcom = vc ;C255
DECLARE newdir = vc ;C255
 
set newdir = "$mhs_ops/"
set DCLCOM = concat("mkdir ",newdir,"humedica/")
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir = "$mhs_ops/humedica/"
set DCLCOM = concat("mkdir ",newdir,"cerner/")
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir ="$mhs_ops/humedica/cerner/"
set DCLCOM = concat("mkdir ",trim(newdir),"dictionaries/")
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir = "$mhs_ops/humedica/cerner/dictionaries/"
set DCLCOM = concat("mkdir ",trim(newdir),dir_date,"/")
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
free set outfile
set outfile = concat(client_code,"_T",dirdt,"_E",edt,file_ext)
 
set newfile = concat(trim(newdir),dir_date,"/",outfile)
 
set DCLCOM = concat("mv ",trim(hold_file)," ",newfile)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set DCLCOM = concat("gzip -9 ",newfile)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
#exit_program
 
;****** After report put back to instance 1
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
;******************************************
 
end
go
 
 
 
