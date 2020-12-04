drop program avh_updt_inventory go
create program avh_updt_inventory
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Select type" = ""
	;<<hidden>>"Current Quantity" = ""
	, "Enter additional qty" = 0
 
with OUTDEV, item, qty
 
set total_volume = 0
set num_vials = 0
 
;if program is run via ops job
if (validate(request->batch_selection))
  select
    ce.result_val
  from
    orders o
    , clinical_event ce
    , ce_med_result cmr
  plan o
    where o.catalog_cd = value(uar_get_code_by("DISPLAYKEY",200,"REMDESIVIR"))
  join ce
    where ce.order_id = o.order_id
      and ce.catalog_cd = value(uar_get_code_by("DISPLAYKEY",200,"REMDESIVIR"))
      and ce.verified_dt_tm > cnvtdatetime(curdate,0)
      and ce.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
  join cmr
    where cmr.event_id = ce.event_id
      and cmr.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
  detail
    total_volume = total_volume + cnvtint(ce.result_val)
  with nocounter
 
  ;CE stores volume dispensed in ML. Dividing by 100 calculates # of vials
  set num_vials = total_volume / 100
 
  ;only one row for Remdesivir. Probably should have used insert statement and added a date to store historical information, but
  ;it still works and calculates the desired numbers
  update into cust_inventory
    set
      quantity = quantity - num_vials
      , used = num_vials
  where item = "remdesivir"
 
  commit
 
;if run via DA2 - to update the quantity when a new shipment arrives
else
  set num_vials = -($qty) ;set to negative so they are added
 
  update into cust_inventory
    set quantity = quantity - num_vials
  where item = $item ;"remdesivir"
 
  commit
endif
 
end
go
 
 
