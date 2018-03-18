 
/****************************************************************************
 Author:        Jason Rath, Cerner
 Date Written:  03/07/2012
 Report Title:  Update facility formulary status indicators for CPOE IV Sets
 Source file:   mayo_upd_ivset_form_status.PRG
 Object name:   mayo_upd_ivset_form_status
 Directory:
 
 Program purpose: Used to update formulary status indicators by facility for
medication CPOE IV Sets. Will (1) Delete all formulary status rows for IV Sets
 not set to "Formulary" and (2) Delete all formulary status rows for IV Sets
which are not set to "All Facilities". Will then set formulary status indicator
to "All Facilities" for any CPOE IV Set that is virtual viewed to any facility.
 
 Executing from:  OPS Job
 
 Special Notes:   Note that only one Ops Job is needed; not one for each facility
 
 Additional components:  None.
 
 
*****************************************************************************
                            REQUIRED PROMPTS
*****************************************************************************
None
 
*****************************************************************************
                        MODIFICATION CONTROL LOG
*****************************************************************************
 Mod    Date            Engineer                Comment
 ----   --------        -----------------       -----------------------------
 000    03/07/11        Jason Rath              Initial Release
 
 
**********************  END OF ALL MODCONTROL BLOCKS  **********************/
; mayo_upd_ivset_form_status go
 
 
 
drop program    mayo_upd_ivset_form_status:dba go
create program  mayo_upd_ivset_form_status:dba
 
 
free record reply
record reply
(
  1 status_data
    2 status                = c1
    2 subeventstatus[1]
      3 OperationName       = c8
      3 OperationStatus     = c1
      3 TargetObjectName    = c15
      3 TargetObjectValue   = vc
)
 
set reply->status_data->status = "F"
 
 
 
/******************************************************************************
Set variables
******************************************************************************/
 
set cORDERABLE_FLEX = UAR_GET_CODE_BY( "MEANING", 4063, "ORDERABLE" )
set cINPATIENT = UAR_GET_CODE_BY("MEANING",4500,"INPATIENT")
set cSYSTEMPKG = UAR_GET_CODE_BY("MEANING",4062,"SYSPKGTYP")
set cFORMULARY = UAR_GET_CODE_BY("MEANING",4512,"FORMULARY")
set cPHARM = UAR_GET_CODE_BY("MEANING",6000,"PHARMACY")
set cPrimary = UAR_GET_CODE_BY("MEANING",6011,"PRIMARY")
set cBrand = UAR_GET_CODE_BY("MEANING",6011,"BRANDNAME")
set cMsyn = UAR_GET_CODE_BY("MEANING",6011,"GENERICTOP")
set cNsyn = UAR_GET_CODE_BY("MEANING",6011,"TRADETOP")
set cCDisp = UAR_GET_CODE_BY("MEANING",6011,"DISPDRUG")
set cDCP = UAR_GET_CODE_BY("MEANING",6011,"DCP")
set cGeneric = UAR_GET_CODE_BY("MEANING",6011,"GENERICNAME")
set cIVName = UAR_GET_CODE_BY("MEANING",6011,"IVNAME")
 
 
/******************************************************************************
(1) Delete all formulary status rows for IV Sets not set to "Formulary"
(2) Delete all formulary status rows for IV Sets which are not set to "All Facilities"
******************************************************************************/
 
 
delete from
  ocs_facility_formulary_r offr
where
  offr.inpatient_formulary_status_cd != cFORMULARY
  and exists( select
                ocs.synonym_id
              from
                order_catalog_synonym ocs
              where
                ocs.synonym_id = offr.synonym_id
                and ocs.catalog_type_cd = cPHARM
                and ocs.mnemonic_type_cd in
                  (cPrimary ,cBrand,cMsyn,cNsyn,cCDisp,cDCP,cGeneric,cIVName)
                and ocs.active_ind = 1
                and ocs.orderable_type_flag in (8) )
with
  nocounter
 
 
delete from
  ocs_facility_formulary_r offr
where
  offr.facility_cd != 0
  and exists( select
                ocs.synonym_id
              from
                order_catalog_synonym ocs
              where
                ocs.synonym_id = offr.synonym_id
                and ocs.catalog_type_cd = cPHARM
                and ocs.mnemonic_type_cd in
                  (cPrimary ,cBrand,cMsyn,cNsyn,cCDisp,cDCP,cGeneric,cIVName)
                and ocs.active_ind = 1
                and ocs.orderable_type_flag in (8) )
 
with
  nocounter
 
 
/******************************************************************************
CPOE IV Set synonym which are virtual viewed to any facility
******************************************************************************/
 
free record add_offr
record add_offr
(
  1 add_offr[*]
    2 synonym_id = f8
)
 
select distinct into "nl:"
  ocs.synonym_id,
  synonym_type = uar_get_code_display(ocs.mnemonic_type_cd),
  synonym = ocs.mnemonic
from
  order_catalog_Synonym ocs,
    ocs_facility_r ofr
plan ocs
                                                              ; Primary, Brand, C, DCP, E, M, N, Generic
  where ocs.mnemonic_type_cd in (cPrimary ,cBrand,cMsyn,cNsyn,cCDisp,cDCP,cGeneric,cIVName)
  and ocs.orderable_type_flag in (8); IV SETS
  and ocs.active_ind = 1
  and not exists
   (
     select
      offr.synonym_id
     from
      ocs_facility_formulary_r offr
     where
      ocs.synonym_id = offr.synonym_id
      and offr.facility_cd in (0)
   )
join ofr
  where ofr.synonym_id = ocs.synonym_id
 
head report
  row_cnt = 0
detail
  row_cnt = row_cnt + 1
  if (row_cnt > size(add_offr->add_offr, 5) )
    stat = alterlist(add_offr->add_offr, row_cnt)
  endif
  add_offr->add_offr[row_cnt]->synonym_id = ocs.synonym_id
with
  nullreport
 
;call echorecord(add_offr)
 
/******************************************************************************
Insert OFFR rows; Set formulary status to "Formulary" for "All Facilities" if IV Set is vv'd anywhere
******************************************************************************/
 
insert into
  ocs_facility_formulary_r offr ,
  (dummyt d with seq = value(size(add_offr->add_offr, 5)))
set
  offr.OCS_FACILITY_FORMULARY_R_ID = SEQ(REFERENCE_SEQ,nextval)
  ,offr.FACILITY_CD = 0
  ,offr.SYNONYM_ID  = cnvtreal(add_offr->add_offr[d.seq]->synonym_id)
  ,offr.INPATIENT_FORMULARY_STATUS_CD = cFORMULARY
  ,offr.OUTPATIENT_FORMULARY_STATUS_CD	= 0
  ,offr.UPDT_CNT	= 0
  ,offr.UPDT_ID	= -77
  ,offr.UPDT_TASK	= 0
  ,offr.UPDT_APPLCTX	= 0
  ,offr.UPDT_DT_TM = cnvtdatetime(curdate, curtime3)
plan d
  where add_offr->add_offr[d.seq]->synonym_id > 0
join offr
  where offr.synonym_id = cnvtreal(add_offr->add_offr[d.seq]->synonym_id)
with
  nocounter
 
call echo(".")
call echo("--------------------------------------------------------------------")
call echo(concat("New formulary status values inserted = ", build(curqual)))
call echo("--------------------------------------------------------------------")
 
if  (size(add_offr->add_offr,5) > 0)
  set reply->status_data->status = "S"
  commit
else
  set reply->status_data->status = "Z"
endif
 
# exit_script
 
call echo(".")
call echo("--------------------------------------------------------------------")
call echo(concat("OPS reply status = ", build(reply->status_data->status)))
call echo("--------------------------------------------------------------------")
 
 
end
go
 
