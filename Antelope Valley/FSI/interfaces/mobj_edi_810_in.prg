/*
*  ---------------------------------------------------------------------------------------------
*  Script Name:  mobj_edi_810_in
*  Description:  EDI Invoice 810 Inbound Modify Object Starter
*  Type:  Open Engine Modify Object Script
*  ---------------------------------------------------------------------------------------------
*  Author:
*  Domain:
*  Creation Date:
*  ---------------------------------------------------------------------------------------------
*/

;execute oencpm_msglog build("************ In mobj_edi_810_in_starter ************", char(0))

declare get_po_line_nbr(line_item_id, po_id) = vc
declare get_pack_factor_display(line_item_id, po_id) = vc
declare get_item_nbr(line_item_id, po_id) = vc
declare get_package_alias(line_item_id, po_id) = vc

declare item_nbr_cd = f8
declare vend_itm_nbr_cd = f8
declare item_master_cd = f8
declare item_eqp_cd = f8
declare med_def_cd = f8
declare item_vendor_cd = f8

set item_nbr_cd = uar_get_code_by("MEANING", 11000, "ITEM_NBR")
set vend_itm_nbr_cd = uar_get_code_by("MEANING", 11000, "VEND_ITM_NBR")
set item_master_cd = uar_get_code_by("MEANING", 11001, "ITEM_MASTER")
set item_eqp_cd = uar_get_code_by("MEANING", 11001, "ITEM_EQP")
set med_def_cd = uar_get_code_by("MEANING", 11001, "MED_DEF")
set item_vendor_cd = uar_get_code_by("MEANING", 11001, "ITEM_VENDOR")


;Request record structure based on mm_imp_edi_invoice(.prg)
free record request
record request
(
1 invoice_nbr = vc ;BIG02
1 invoice_dt_tm = dq8 ;ISA09 and ISA10? or Derive from curdate and curtime3
1 release_nbr = vc ;BIG05
1 transaction_type = vc ;BIG07 - Sending Code (cs325570 - Amount Type or cs13028)
1 po_nbr = vc ;BIG04
1 po_dt_tm = dq8 ;BIG03 - Derive from po_nbr
1 original_inv_dt_tm = dq8 ;ISA09 and ISA10?
1 vendor_name = vc ;Derive from po_nbr
1 remit_to_desc = vc ;N102 - RE Identifier Code or Derive from po_nbr
1 remit_to_street1 = vc ;N301 - RE Identifier Code or Derive from po_nbr
1 remit_to_street2 = vc ;N302 - RE Identifier Code or Derive from po_nbr
1 remit_to_city = vc ;N401 - RE Identifier Code or Derive from po_nbr
1 remit_to_state = vc ;N402 - RE Identifier Code or Derive from po_nbr
1 remit_to_zip = vc ;N403 - RE Identifier Code or Derive from po_nbr
1 bill_to_desc = vc ;N102 - BT Identifier Code or Derive from po_nbr
1 bill_to_street1 = vc ;N301 - BT Identifier Code or Derive from po_nbr
1 bill_to_street2 = vc ;N302 - BT Identifier Code or Derive from po_nbr
1 bill_to_city = vc ;N401 - BT Identifier Code or Derive from po_nbr
1 bill_to_state = vc ;N402 - BT Identifier Code or Derive from po_nbr
1 bill_to_zip = vc ;N403 - BT Identifier Code or Derive from po_nbr
1 ship_to_desc = vc ;N102 - ST Identifier Code or Derive from po_nbr
1 ship_to_street1 = vc ;N301 - ST Identifier Code or Derive from po_nbr
1 ship_to_street2 = vc ;N302 - ST Identifier Code or Derive from po_nbr
1 ship_to_city = vc ;N401 - ST Identifier Code or Derive from po_nbr
1 ship_to_state = vc ;N402 - ST Identifier Code or Derive from po_nbr
1 ship_to_zip = vc ;N403 - ST Identifier Code or Derive from po_nbr
1 terms_cd = vc ;ITD01 or Derive from po_nbr
1 terms_basis_date_cd = vc ;ITD02
1 terms_discount = vc ;ITD03
1 terms_discount_due_dt_tm = dq8 ;ITD04
1 terms_net_due_dt_tm = dq8 ;ITD06
1 terms_discount_amt = vc ;ITD08
1 invoice_amt = vc ;TDS01?
1 inv_amt_for_disc = vc
1 disc_inv_amt_due = vc
1 terms_disc_inv_amt = vc
1 inv_ref_qual[*] ;Typically not used
 2 ref_type = vc
 2 ref_desc = vc
1 inv_add_amt_qual[*] ;Typically not used
 2 add_amt_type = vc
 2 add_amt_desc = vc
 2 amount = vc
1 inv_tax_qual[*] ;Typically not used
 2 tax_type = vc ;TX101 - cs14066 Additional Amount Code
 2 amount = vc ;TX102
1 inv_line_qual[*]
 2 po_line_nbr = vc ;IT101
 2 inv_qty = vc ;IT102
 2 inv_uom = vc ;IT103
 2 pack_factor_display = vc
 2 unit_price = vc ;IT104
 2 price_basis = vc ;IT105 - Typically not used
 2 item_nbr = vc ;IT108 or IT110 if code equals 'IN'
 2 vendor_catalog_nbr = vc ;IT108 or IT110 if code equals 'VC'
 2 vendor_product_desc = vc ;PID05 - Typically not used
 2 line_item_ref_qual[*] ;Typically not used
   3 ref_type = vc
   3 ref_desc = vc
 2 line_add_amt_qual[*] ;Typically not used
   3 add_amt_type = vc
   3 add_amt_desc = vc

   3 amount = vc
)

declare cur_date = c11
declare cur_time = c8

set cur_date = trim(format(curdate, "DD-MMM-YYYY;;D"))
set cur_time = trim(format(curtime3, "HH:MM:SS;;M"))

;Invoice Date and Time (ISA09 and ISA10) - Derived from curdate and curtime3 logicals
set request->invoice_dt_tm = cnvtdatetime(concat(cur_date, " ", cur_time))
;execute oencpm_msglog build("request->invoice_dt_tm = ", request->invoice_dt_tm, char(0))


;Invoice Number (BIG02)
set request->invoice_nbr = oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [1]->BIG->invoice_nbr
;execute oencpm_msglog build("request->invoice_nbr = ", request->invoice_nbr, char(0))


;Purchase Order Number (BIG04)
set request->po_nbr = oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [1]->BIG->po_nbr
;execute oencpm_msglog build("request->po_nbr = ", request->po_nbr, char(0))


;Release Number (BIG05)
set request->release_nbr = oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [1]->BIG->release_nbr
;execute oencpm_msglog build("request->release_nbr = ", request->release_nbr, char(0))


;Transaction Type (BIG07) - Hardcoded to 'CREDIT'
set request->transaction_type = "CREDIT"
;execute oencpm_msglog build("request->transaction_type = ", request->transaction_type, char(0))


;Extracting puchase order details to complete invoice request
declare po_id = f8

select into "nl:"
 po.purchase_order_id,
 po.create_dt_tm,
 v.display,
 a3.street_addr,
 a3.street_addr2,
 a3.city,
 a3.state,
 a3.zipcode,
 a1.street_addr,
 a1.street_addr2,
 a1.city,
 a1.state,
 a1.zipcode,
 a2.street_addr,
 a2.street_addr2,
 a2.city,
 a2.state,
 a2.zipcode,
 po.terms_cd
from purchase_order po,
 vendor v,
 address a1,
 address a2,
 address a3
plan po
where po.po_nbr = request->po_nbr
join v
where v.service_resource_cd = po.vendor_cd
join a1
where a1.address_id = po.bill_to_address_id
join a2
where a2.address_id = po.ship_to_address_id
join a3
where a3.address_id = po.vendor_address_id
detail
 po_id = po.purchase_order_id
 request->po_dt_tm = cnvtdatetime(po.create_dt_tm) ;Should match BIG03
 request->vendor_name = v.display
 request->remit_to_street1 = a3.street_addr ;Should match N301
 request->remit_to_street2 = a3.street_addr2 ;Should match N302
 request->remit_to_city = a3.city ;Should match N401
 request->remit_to_state = a3.state ;Should match N402
 request->remit_to_zip = a3.zipcode ;Should match N403
 request->bill_to_street1 = a1.street_addr ;Should match N301
 request->bill_to_street2 = a1.street_addr2 ;Should match N302
 request->bill_to_city = a1.city ;Should match N401
 request->bill_to_state = a1.state ;Should match N402
 request->bill_to_zip = a1.zipcode ;Should match N403
 request->ship_to_street1 = a2.street_addr ;Should match N301
 request->ship_to_street2 = a2.street_addr2 ;Should match N302
 request->ship_to_city = a2.city ;Should match N401
 request->ship_to_state = a2.state ;Should match N402
 request->ship_to_zip = a2.zipcode ;Should match N403
 request->terms_cd = cnvtstring(po.terms_cd) ;Should match ITD01
with nocounter

/*
execute oencpm_msglog build("po_id = ", po_id, char(0))
execute oencpm_msglog build("request->po_dt_tm = ", request->po_dt_tm, char(0))
execute oencpm_msglog build("request->vendor_name = ", request->vendor_name, char(0))
execute oencpm_msglog build("request->remit_to_street1 = ", request->remit_to_street1, char(0))
execute oencpm_msglog build("request->remit_to_street2 = ", request->remit_to_street2, char(0))

 ;execute oencpm_msglog build("get_po_line_nbr: po_id = ", po_id, char(0))
 ;execute oencpm_msglog build("get_po_line_nbr: po_line_nbr= ",        po_line_nbr, char(0))

 return(po_line_nbr)
end ;get_po_line_nbr


subroutine get_pack_factor_display(line_item_id, po_id)
 declare pack_factor = vc

 select into "nl:"
   p.qty
 from identifier id,
   package_type p,
   object_identifier o,
   line_item li
 plan id
 where id.value_key = line_item_id
 and id.parent_entity_name = "ITEM_DEFINITION"
 and id.identifier_type_cd = vend_itm_nbr_cd
 and id.active_ind = 1
 join p
 where id.parent_entity_id = p.item_id
 and p.active_ind = 1
 join o
 where o.identifier_id = id.identifier_id
 and o.object_type_cd = item_vendor_cd
 and o.active_ind = 1
 join li
 where li.vendor_item_id = o.object_id
 and li.purchase_order_id = po_id
 order by p.base_package_type_ind desc
 detail

   pack_factor = cnvtstring(p.qty)

 with nocounter

 ;execute oencpm_msglog build("pack_factor_display: pack_factor = ", pack_factor, char(0))

 return (pack_factor)
end ;get_pack_factor_display


subroutine get_item_nbr(line_item_id, po_id)
 declare item_nbr = vc

 select into "nl:"
   i1.value
 from object_identifier oi,
   identifier i,
   object_identifier oi1,
   identifier i1,
   object_identifier oi2,
   line_item li
 plan i
 where i.value_key = line_item_id
 and i.identifier_type_cd = vend_itm_nbr_cd
 and i.active_ind = 1
 join oi
 where oi.identifier_id = i.identifier_id
 and (oi.object_type_cd = item_master_cd
   or oi.object_type_cd = item_eqp_cd
   or oi.object_type_cd = med_def_cd)
 and oi.active_ind = 1
 join oi1
 where oi1.object_id = oi.object_id
 join i1
 where i1.identifier_id = oi1.identifier_id
 and i1.identifier_type_cd = item_nbr_cd
 and i1.active_ind = 1
 join oi2
 where oi2.identifier_id = i.identifier_id
 and oi2.object_type_cd = item_vendor_cd
 and oi2.active_ind = 1
 join li
 where li.vendor_item_id = oi2.object_id
 and li.purchase_order_id = po_id
 detail

   item_nbr = i1.value

 with nocounter

 ;execute oencpm_msglog build("get_item_nbr: item_nbr = ", item_nbr, char(0))

 return (item_nbr)
end ;get_item_nbr


subroutine get_package_alias(line_item_id, po_id)
 declare uom_display = vc

 select into "nl:"
   uom = uar_get_code_display(p.uom_cd)
 from identifier id,
   package_type p,
   object_identifier o,
   line_item li
 plan id

 where id.value = line_item_id
 and id.parent_entity_name = "ITEM_DEFINITION"
 and id.identifier_type_cd = vend_itm_nbr_cd
 and id.active_ind = 1
 join p
 where id.parent_entity_id = p.item_id
 and p.active_ind = 1
 join o
 where o.identifier_id = id.identifier_id
 and o.object_type_cd = item_vendor_cd
 and o.active_ind = 1
 join li
 where li.vendor_item_id = o.object_id
 and li.purchase_order_id = po_id
 order by p.base_package_type_ind desc
 detail

       uom_display = uom

 with nocounter

 return(uom_display)
end ;get_package_alias