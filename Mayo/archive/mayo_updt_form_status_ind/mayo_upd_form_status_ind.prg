 
/****************************************************************************
 Author:        Jason Rath, Cerner
 Date Written:  03/07/2012
 Report Title:  Update facility formulary status indicators in order catalog
 Source file:   mayo_upd_form_status_ind.PRG
 Object name:   mayo_upd_form_status_ind
 Directory:
 
 Program purpose: Used to update formulary status indicators by facility for
medication synonyms based on 1) virtual view of synonym to facility, 2)
linking of formulary product to synonym, and 3) scoping of linked formulary
product to the given facility. Will also delete any formulary status indicators
that are set for "ALL FACILITIES" and any indcitator rows that exist for a facility
but are not set to "FORMULARY"
 
 Executing from:  OPS Job
 
 Special Notes:
 
 Additional components:  None.
 
 
*****************************************************************************
                            REQUIRED PROMPTS
*****************************************************************************
 $1 = Facility Code_Value
 
*****************************************************************************
                        MODIFICATION CONTROL LOG
*****************************************************************************
 Mod    Date            Engineer                Comment
 ----   --------        -----------------       -----------------------------
 000    03/07/11        Jason Rath              Initial Release
 001    05/17/11	Jason Rath		Added logic to prevent script
						from deleting rows not related
						to current facility.
 
**********************  END OF ALL MODCONTROL BLOCKS  **********************/
 
/***
Include prompt for facility
(1) Delete all ALL FACILITIES formulary status rows
(2) Delete all NOT SET formulary status rows for current facility
***/
 
drop program    mayo_upd_form_status_ind:dba go
create program  mayo_upd_form_status_ind:dba
 
Prompt  "Facility (code value)?  "  = 0.0
 
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
 
set cFAC_CD = $1
 
if (cFAC_CD = 0)
  go to exit_script
endif
 
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
(1) Delete all ALL FACILITIES formulary status rows
(2) Delete all NOT SET formulary status rows for current facility
******************************************************************************/
 
delete from
  ocs_facility_formulary_r offr
where
  offr.facility_cd = 0
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
                and ocs.orderable_type_flag in (0,1) )
with
  nocounter
 
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
                and ocs.orderable_type_flag in (0,1) )
with
  nocounter
 
 
/******************************************************************************
Inpatient CPOE-type, and which are linked to a formulary product stocked at that facility
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
  synonym_item_r sir,
  medication_definition md,
  med_def_flex mdf,
  med_flex_object_idx mfoi,
  ocs_facility_r ofr
plan md
  where md.med_type_flag = 0   ; 0 = Product, 3 = IV Set, 4 = Order Set
join mdf
  where mdf.item_id = md.item_id
  and mdf.pharmacy_type_cd = cINPATIENT
  and mdf.flex_type_cd = cSYSTEMPKG
  and mdf.active_ind = 1
join mfoi
  where mfoi.flex_object_type_cd = cORDERABLE_FLEX
  and mfoi.med_def_flex_id = mdf.med_def_flex_id
  and mfoi.active_ind = 1
  and mfoi.parent_entity_id in (0, cFAC_CD) ; Lake City facility_cd
join sir
  where sir.item_id = md.item_id
join ocs
  where ocs.synonym_id = sir.synonym_id
  and ocs.mnemonic_type_cd in (cPrimary ,cBrand,cMsyn,cNsyn,cCDisp,cDCP,cGeneric,cIVName); Primary, Brand, C, DCP, E, M, N, Generic
  and ocs.orderable_type_flag in (0,1)
  and ocs.active_ind = 1
  and not exists
   (
     select
      offr.synonym_id
     from
      ocs_facility_formulary_r offr
     where
      ocs.synonym_id = offr.synonym_id
      and offr.facility_cd in (cFAC_CD)
   )
join ofr
  where ofr.synonym_id = ocs.synonym_id
  and ofr.facility_cd in (0,cFAC_CD)
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
Insert OFFR rows
******************************************************************************/
 
insert into
  ocs_facility_formulary_r offr ,
  (dummyt d with seq = value(size(add_offr->add_offr, 5)))
set
  offr.OCS_FACILITY_FORMULARY_R_ID = SEQ(REFERENCE_SEQ,nextval)
  ,offr.FACILITY_CD = cFAC_CD
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
 
/******************************************************************************
Identify formualry status rows to be removed
******************************************************************************/
 
free record del_offr
record del_offr
(
  1 del_offr[*]
    2 ocs_facility_formulary_r_id = f8
)
 
select distinct into "nl:"
  ocs.synonym_id,
  synonym_type = uar_get_code_display(ocs.mnemonic_type_cd),
  synonym = ocs.mnemonic
from
  ocs_facility_formulary_r offr,
  order_catalog_Synonym ocs,
  ocs_facility_r ofr,
  synonym_item_r sir,
  dummyt d,
  medication_definition md,
  med_def_flex mdf,
  med_flex_object_idx mfoi
plan offr
  where offr.synonym_id > 0
 
;*************
and offr.facility_cd = cFAC_CD
;*******************
 
 
join ofr
  where ofr.synonym_id = offr.synonym_id
  and ofr.facility_cd in (0,cFAC_CD)
join ocs
  where ocs.synonym_id = offr.synonym_id
  and ocs.catalog_type_cd = cPHARM
  and ocs.mnemonic_type_cd in
    (cPrimary ,cBrand,cMsyn,cNsyn,cCDisp,cDCP,cGeneric,cIVName)
  and ocs.active_ind = 1
  and ocs.orderable_type_flag in (0,1)
join d
join sir
  where sir.synonym_id = ocs.synonym_id
join md
  where md.item_id = sir.item_id
  and md.med_type_flag = 0   ; 0 = Product, 3 = IV Set, 4 = Order Set
join mdf
  where mdf.item_id = md.item_id
  and mdf.pharmacy_type_cd = cINPATIENT
  and mdf.flex_type_cd = cSYSTEMPKG
  and mdf.active_ind = 1
join mfoi
  where mfoi.med_def_flex_id = mdf.med_def_flex_id
  and mfoi.flex_object_type_cd = cORDERABLE_FLEX
  and mfoi.active_ind = 1
  and mfoi.parent_entity_id in (0, cFAC_CD) ; Lake City facility_cd
head report
  row_cnt = 0
detail
  row_cnt = row_cnt + 1
  if (row_cnt > size(del_offr->del_offr, 5) )
    stat = alterlist(del_offr->del_offr, row_cnt)
  endif
  del_offr->del_offr[row_cnt]->ocs_facility_formulary_r_id = offr.ocs_facility_formulary_r_id
with
  outerjoin = d,
  dontexist
 
/******************************************************************************
Delete OFFR rows
******************************************************************************/
 
delete from
  ocs_facility_formulary_r offr,
  (dummyt d with seq = value(size(del_offr->del_offr ,5)))
set
  offr.seq = offr.seq
plan d
join offr
  where offr.ocs_facility_formulary_r_id = del_offr->del_offr[d.seq]->ocs_facility_formulary_r_id
 
with
  nocounter
 
call echo(".")
call echo("--------------------------------------------------------------------")
call echo(concat("New formulary status values deleted = ", build(curqual)))
call echo("--------------------------------------------------------------------")
 
if (size(del_offr->del_offr,5) > 0 or size(add_offr->add_offr,5) > 0)
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
 
 
 
