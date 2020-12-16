/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  avh_updt_covid_meds_inv
 *
 *  Description:  Executed by the Update COVID Meds Inventory Ops Job as well as a DA2 report.
 *				  CareSelect Export Orders and CareSelect Export EMR Settings ops jobs.
 *
 *				  This script does one of two things depending on where it executes. If it executes
 *				  as an ops job, it updates the CUST_COVID_MEDS_INV and CUST_COVID_MEDS_INV_DET tables
 *                with all covid meds adminstered for the day. If it executes from DA2, it prompts
 *				  the end user to add or remove vials from inventory. 
 *  ---------------------------------------------------------------------------------------------
 *  Author:     	Yitzhak Magoon
 *  Contact:    	yithak.magoon@avhospital.org
 *  Creation Date:  12/15/2020
 *
 *  Testing: 
 *  ---------------------------------------------------------------------------------------------
 *  Mod#   Date        Author           Description & Requestor Information
 *  000    12/15/2020  Yitzhak Magoon   Initial Release
 *
 *
 *  ---------------------------------------------------------------------------------------------
*/

drop program avh_updt_covid_meds_inv go
create program avh_updt_covid_meds_inv
 
prompt
	"Output to File/Printer/MINE" = "MINE"           ;* Enter or select the printer or file name to send this report to.
	, "COVID Med" = 0
	;<<hidden>>"COVID Med Quantity" = ""
	, "Number of Vials" = 0
	, "Add or Subtract from Total # Vials" = "ADD"
 
with OUTDEV, item_id, qty, operator
 
record meds (
  1 list[*]
    2 inventory_id = f8
    2 catalog_cd   = f8
    2 item         = c30
    2 quantity     = i4
    2 vol          = i4
    2 vol_per_vial = i4
    2 vials        = i4
  1 detail_type  = vc
)
 
select into "nl:"
from
  cust_covid_meds_inv c
plan c
head report
  iCnt = 0
detail
  iCnt = iCnt + 1
 
  if (iCnt > size(meds->list,5))
    stat = alterlist(meds->list, iCnt + 4)
  endif
 
  meds->list[iCnt].inventory_id = c.inventory_id
  meds->list[iCnt].item = c.item
  meds->list[iCnt].quantity = c.quantity
 
  if (c.item = "remdesivir")
    meds->list[iCnt].catalog_cd = uar_get_code_by("DISPLAYKEY",200,"REMDESIVIR")
    meds->list[iCnt].vol_per_vial = 100
  elseif (c.item = "bamlanivimab")
    meds->list[iCnt].catalog_cd = uar_get_code_by("DISPLAYKEY",200,"BAMLANIVIMAB")
    meds->list[iCnt].vol_per_vial = 700
  elseif (c.item = "casirivimab")
    meds->list[iCnt].catalog_cd = uar_get_code_by("DISPLAYKEY",200,"CASIRIVIMAB")
    meds->list[iCnt].vol_per_vial = 100
  elseif (c.item = "imdevimab")
    meds->list[iCnt].catalog_cd = uar_get_code_by("DISPLAYKEY",200,"IMDEVIMAB")
    meds->list[iCnt].vol_per_vial = 100
  endif
foot report
  stat = alterlist(meds->list, iCnt)
with nocounter
 
set idx = 0
set meds_sz = size(meds->list,5)
 
;populate meds record structure if program run from ops job
if (validate(request->batch_selection))
  select
    ce.result_val
  from
    orders o
    , clinical_event ce
    , ce_med_result cmr
  plan o
    where expand(idx, 1, meds_sz, o.catalog_cd, meds->list[idx].catalog_cd)
  join ce
    where ce.order_id = o.order_id
      and expand(idx, 1, meds_sz, ce.catalog_cd, meds->list[idx].catalog_cd)
      and ce.verified_dt_tm > cnvtdatetime(curdate,0)
      and ce.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
  join cmr
    where cmr.event_id = ce.event_id
      and cmr.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
  detail
    pos = locateval(idx, 1, meds_sz, ce.catalog_cd, meds->list[idx].catalog_cd)
    meds->list[pos].vol = meds->list[pos].vol + cnvtint(ce.result_val)
  foot report
    for (idx = 1 to meds_sz)
      meds->list[idx].vials = meds->list[idx].vol / meds->list[idx].vol_per_vial
      meds->list[idx].quantity = meds->list[idx].quantity - meds->list[idx].vials
    endfor
 
    meds->detail_type = "OPS"
  with nocounter
 
;populate meds record structure if program run from DA2
else
  set pos = locateval(idx, 1, meds_sz, $item_id, meds->list[idx].inventory_id)
 
  set meds->list[pos].vials = $qty
 
  if ($operator = "ADD")
    set meds->detail_type = "ADD"
    set meds->list[pos].quantity = meds->list[pos].quantity + $qty
  elseif ($operator = "SUBTRACT")
    set meds->detail_type = "SUBTRACT"
    set meds->list[pos].quantity = meds->list[pos].quantity - $qty
  endif
endif
 
call echorecord(meds)
 
update into cust_covid_meds_inv c
  , (dummyt d with seq = meds_sz)
  set c.quantity = meds->list[d.seq].quantity
    , c.updt_cnt = c.updt_cnt + 1
    , c.updt_dt_tm = cnvtdatetime(curdate,curtime3)
    , c.updt_id = reqinfo->updt_id
    , c.updt_task = reqinfo->updt_task
plan d
join c
  where c.inventory_id = meds->list[d.seq].inventory_id
    and meds->list[d.seq].vials > 0
with nocounter
 
insert into cust_covid_meds_inv_det cv
  , (dummyt d with seq = meds_sz)
  set cv.inventory_det_id = seq(CUST_COVID_MEDS_INV_DET_SEQ,nextval)
    , cv.inventory_id = meds->list[d.seq].inventory_id
    , cv.item = meds->list[d.seq].item
    , cv.detail_type = meds->detail_type
    , cv.quantity = meds->list[d.seq].vials
    , cv.updt_cnt = 0
    , cv.updt_dt_tm = cnvtdatetime(curdate,curtime3)
    , cv.updt_id = reqinfo->updt_id
    , cv.updt_task = reqinfo->updt_task
plan d
  where meds->list[d.seq].vials > 0
join cv
with nocounter
 
commit
 
select into $OUTDEV
  med = meds->list[d.seq].item
  , add_or_subtract = meds->detail_type
  , vials = meds->list[d.seq].vials
  , total_vials = meds->list[d.seq].quantity
from
  (dummyt d with seq=meds_sz)
plan d
  where meds->list[d.seq].vials > 0
with nocounter, format, separator = " "
 
end
go
 
