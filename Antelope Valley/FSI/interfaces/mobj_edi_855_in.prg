/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  mobj_edi_855_in
 *  Description:  EDI Acknowledgement 855 Inbound Modify Object Starter
 *  Type:  Open Engine Modify Original Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:
 *  Domain:
 *  Creation Date:
 *  ---------------------------------------------------------------------------------------------
 */

;execute oencpm_msglog build("************ In mobj_edi_855_in ************", char(0))

;Request record structure based on mm_imp_xfi_edi_855(.prg)
free record request
record request
(
;The logic_determine_flag is used to specify whether
;po_line_nbr or vendor_catalog_nbr are passed from the vendor.
;Its default value is 0, this value assumes po_line_nbr, vendor_catalog_nbr,
;and line_status_cd are passed.
;If only vendor_catalog_nbr is passed, this flag is set to "1".
1 logic_determine_flag = i2

1 po_list[*]
  2 po_nbr = vc ;BAK03
  2 commit_dt_tm = dq8 ;BAK04 - Typically not used
  2 acknowledgement_dt_tm = dq8 ;BAK09 - ISA09 and ISA10 or Derive from curdate and curtime3
  2 acknowledgement_type_cd = f8 ;BAK02 - Typically not used
  2 contract_number = vc ;BAK07 - Typically not used
  2 release_number = vc ;BAK05 - Typically not used
  2 transaction_type_cd = f8 ;BAK10 - Typically not used
  2 reference_identification_cd = f8 ;REF01 - Typically not used
  2 reference_identification = vc ;REF02 - Typically not used; Can contain header comments
  2 reference_description = vc ;REF03 - Typically not used
  2 header_comment = vc ;MSG01 - Typically not used
  2 header_comment_type_cd = f8 ;Typically not used
  2 line_item_total = i4 ;CTT01 - Typically not used

  2 line_item[*]
    3 po_line_nbr = i4 ;PO101
    3 vendor_catalog_nbr = vc ;PO107 - Used to send the vendor catalog nbr
    3 vendor_item_description = vc ;Typically not used, Use this attribute to send the vendor item description
    3 item_description = vc ;Typically not used Use this attribute to send either item nbr/item description
    3 long_text = vc ;Typically not used; Can contain line comments
    3 ordered_qty = f8 ;PO102 - Typically not used
    3 ordered_package_type_uom_cd = f8 ;PO103 - Typically not used
    3 package_type_price = f8 ;PO104
    3 line_item_status_cd = f8 ;ACK01
    3 ack_qty = f8 ;ACK02
    3 ack_package_type_uom_cd = f8 ;ACK03 - Typically not used
    3 line_comment = vc ;MSG01 - Typically not used
    3 line_comment_type_cd = f8 ;Typically not used
    3 vendor_item_id = f8 ;Generally not used, This attribute is used internally when the vendor doesn't pass po_line_nbr
;    3 unit_tax = f8
;    3 line_addl_amt[*]
;      4 addl_amt_type = vc
;      4 tax_type = vc
;      4 tax_identification_number = vc
;      4 amount = f8
;      4 tax_amount = f8
;      4 tax_value = f8
;      4 tax_value_flag = i2
;      4 tax_ind = i2

;  2 hdr_addl_amt[*]
;    3 addl_amt_type = vc
;    3 tax_type = vc
;    3 tax_identification_number = vc
;    3 amount = f8
;    3 tax_amount = f8
;    3 tax_value = f8
;    3 tax_value_flag = i2
;    3 tax_ind = i2
)

;Set cur_date and cur_time variables
declare cur_date = c11
declare cur_time = c8

set cur_date = trim(format(curdate, "DD-MMM-YYYY;;D"))
set cur_time = trim(format(curtime3, "HH:MM:SS;;M"))

;Set request->logic_determine_flag default '1'
set request->logic_determine_flag = 1


set stat = alterlist(request->po_list, size(oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP, 5))

for(i=1 to size(oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP, 5)) ;Header Information

 ;Acknowledgement Type (BAK02)
 ;set request->po_list[i]->acknowledgement_type_cd =
 ;  oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->BAK->ack_type


 ;Purchase Order Number (BAK03)
 set request->po_list[i]->po_nbr = oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->BAK->po_nbr



 ;Purchase Order Date and Time (BAK04)
  ;set request->po_list[i]->commit_dt_tm =
 ;  cnvtdatetime(oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->BAK->po_dt_tm)


 ;Purchase Order Release Number (BAK05)
  ;set request->po_list[i]->release_number = oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->BAK->po_release


 ;Contract Number (BAK07)
  ;set request->po_list[i]->contract_number = oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->BAK->contract_nbr


 ;Acknowledgement Date and Time (BAK09)
  set request->po_list[i]->acknowledgement_dt_tm = cnvtdatetime(concat(cur_date, " ", cur_time))


 ;Transaction Type (BAK10)
  ;set request->po_list[i]->transaction_type_cd =
 ;  oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->BAK->trans_type_code


 ;Reference Qualifier (REF01)
  ;set request->po_list[i]->reference_identification_cd =
 ;  oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->REF [1]->ref_ident_qual


 ;Reference Identifier (REF02)
  ;set request->po_list[i]->reference_identification =
 ;  oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->REF [1]->ref_ident


 ;Reference Description (REF03)
  ;set request->po_list[i]->reference_description =
 ;  oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->REF [1]->description


 ;Header Comment (MSG01)
  ;set request->po_list[i]->header_comment =
 ;  oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->N9_GROUP [1]->MSG [1]->text


 ;Header Comment Type
  ;set request->po_list[i]->header_comment_type_cd = ""


  set stat = alterlist(request->po_list[i]->line_item,
   size(oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP, 5))

/*
 execute oencpm_msglog build("po_nbr = ", request->po_list[i]->po_nbr, char(0))
 execute oencpm_msglog build("commit_dt_tm = ", request->po_list[i]->commit_dt_tm, char(0))
 execute oencpm_msglog build("acknowledgement_dt_tm = ", request->po_list[i]->acknowledgement_dt_tm, char(0))
 execute oencpm_msglog build("acknowledgement_type_cd = ", request->po_list[i]->acknowledgement_type_cd, char(0))
 execute oencpm_msglog build("contract_number = ", request->po_list[i]->contract_number, char(0))
 execute oencpm_msglog build("release_number = ", request->po_list[i]->release_number, char(0))
 execute oencpm_msglog build("transaction_type_cd = ", request->po_list[i]->transaction_type_cd, char(0))
 execute oencpm_msglog build("reference_identification_cd = ", request->po_list[i]->reference_identification_cd, char(0))
 execute oencpm_msglog build("reference_identification = ", request->po_list[i]->reference_identification, char(0))
 execute oencpm_msglog build("reference_description = ", request->po_list[i]->reference_description, char(0))
 execute oencpm_msglog build("header_comment = ", request->po_list[i]->header_comment, char(0))
 execute oencpm_msglog build("header_comment_type_cd = ", request->po_list[i]->header_comment_type_cd, char(0))
 execute oencpm_msglog build("Size of request->po_list->line_item = ", size(request->po_list[i]->line_item, 5), char(0))
*/


  for(j=1 to size(oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [1]->PO1_GROUP, 5)) ;Line Information


    if(oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP [j]->PO1->assigned_id != "") ;po_line_nbr sent

      set request->po_list[i]->line_item[j]->po_line_nbr =
        cnvtint(oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP [j]->PO1->assigned_id) ;PO101

    else ;po_line_nbr not sent

      set request->po_list[i]->line_item[j]->po_line_nbr = cnvtint(j) ;PO101

    endif ;(oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP [j]->PO1->assigned_id  != "")


   ;Ordered Quantity (PO102)
    ;set request->po_list[i]->line_item[j]->ordered_qty =
   ;  oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP [j]->PO1->quant_ord


   ;Ordered Package Type Unit of Measure Code (PO103)
    ;set request->po_list[i]->line_item[j]->ordered_package_type_uom_cd =
   ;  oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP [j]->PO1->measure_code


   ;Package Type Price (PO104)
    set request->po_list[i]->line_item[j]->package_type_price =
      cnvtreal(oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP [j]->PO1->unit_price)


   ;Vendor Catalog Number 'VC'
   if(oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP [j]->PO1->prod_id_qual_1 = "VC") ;PO106


      set request->po_list[i]->line_item[j]->vendor_catalog_nbr =
        oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP [j]->PO1->prod_id_1 ;PO107

   elseif(oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP [j]->PO1->prod_id_qual_2 = "VC") ;PO108

      set request->po_list[i]->line_item[j]->vendor_catalog_nbr =
        oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP [j]->PO1->prod_id_2 ;PO109

   elseif(oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP [j]->PO1->prod_id_qual_3 = "VC") ;PO110

      set request->po_list[i]->line_item[j]->vendor_catalog_nbr =
        oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP [j]->PO1->prod_id_3 ;PO111

   elseif(oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP [j]->PO1->prod_id_qual_4 = "VC") ;PO112

      set request->po_list[i]->line_item[j]->vendor_catalog_nbr =
        oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP [j]->PO1->prod_id_4 ;PO113

   elseif(oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP [j]->PO1->prod_id_qual_5 = "VC") ;PO114

      set request->po_list[i]->line_item[j]->vendor_catalog_nbr =
        oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP [j]->PO1->prod_id_5 ;PO115

   elseif(oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP [j]->PO1->prod_id_qual_6 = "VC") ;PO116

      set request->po_list[i]->line_item[j]->vendor_catalog_nbr =
        oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP [j]->PO1->prod_id_6 ;PO117

   elseif(oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP [j]->PO1->prod_id_qual_7 = "VC") ;PO118

      set request->po_list[i]->line_item[j]->vendor_catalog_nbr =
        oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP [j]->PO1->prod_id_7 ;PO119

   elseif(oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP [j]->PO1->prod_id_qual_8 = "VC") ;PO120

      set request->po_list[i]->line_item[j]->vendor_catalog_nbr =
        oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP [j]->PO1->prod_id_8 ;PO121

   elseif(oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP [j]->PO1->prod_id_qual_9 = "VC") ;PO122

      set request->po_list[i]->line_item[j]->vendor_catalog_nbr =
        oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP [j]->PO1->prod_id_9 ;PO123

   elseif(oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP [j]->PO1->prod_id_qual_10 = "VC") ;PO124

      set request->po_list[i]->line_item[j]->vendor_catalog_nbr =
        oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP [j]->PO1->prod_id_10 ;PO125

   endif ;(oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP [j]->PO1->prod_id_qual_1 = "VC")


   ;Item Description (PID05)
    ;set request->po_list[i]->line_item[j]->item_description =
   ;  oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP [j]->PID_GROUP [1]->PID->desc


   ;Vendor Item Description (PID05)
    ;set request->po_list[i]->line_item[j]->vendor_item_description =
   ;  oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP [j]->PID_GROUP [1]->PID->desc


   ;Acknowledgement Line Item Status Code (ACK01)
    set request->po_list[i]->line_item[j]->line_item_status_cd =
      uar_get_code_by("MEANING", 14035,
      oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP [j]->ACK_GROUP [1]->ACK->line_item_status_code)


   ;Acknowledgement Quantity (ACK02)
    set request->po_list[i]->line_item[j]->ack_qty =
      cnvtreal(oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP [j]->ACK_GROUP [1]->ACK->qty)


   ;Acknowledgement Package Type Code (ACK03)
    ;set request->po_list[i]->line_item[j]->ack_package_type_uom_cd =
   ;  oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP [j]->ACK_GROUP [1]->ACK->measure_code


   ;Long Text Comment (MSG01)
    ;set request->po_list[i]->line_item[j]->long_text =
   ;  oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP [j]->N9_GROUP [1]->MSG [1]->text


   ;Line Comment (MSG01)
    ;set request->po_list[i]->line_item[j]->line_comment =
   ;  oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP [j]->N9_GROUP [1]->MSG [1]->text


   ;Line Comment Type
    ;set request->po_list[i]->line_item[j]->line_comment_type_cd = ""

/*
   execute oencpm_msglog build("po_line_nbr = ", request->po_list[i]->line_item[j]->po_line_nbr, char(0))
   execute oencpm_msglog build("vendor_catalog_nbr = ", request->po_list[i]->line_item[j]->vendor_catalog_nbr, char(0))
   execute oencpm_msglog build("vendor_item_description = ", request->po_list[i]->line_item[j]->vendor_item_description, char(0))
   execute oencpm_msglog build("item_description = ", request->po_list[i]->line_item[j]->item_description, char(0))
   execute oencpm_msglog build("long_text = ", request->po_list[i]->line_item[j]->long_text, char(0))
   execute oencpm_msglog build("ordered_qty = ", request->po_list[i]->line_item[j]->ordered_qty, char(0))
   execute oencpm_msglog build("ordered_package_type_uom_cd = ",
     request->po_list[i]->line_item[j]->ordered_package_type_uom_cd, char(0))
   execute oencpm_msglog build("package_type_price = ", request->po_list[i]->line_item[j]->package_type_price, char(0))

   execute oencpm_msglog build("line_item_status_cd = ", request->po_list[i]->line_item[j]->line_item_status_cd, char(0))
   execute oencpm_msglog build("ack_qty = ", request->po_list[i]->line_item[j]->ack_qty, char(0))
   execute oencpm_msglog build("ack_package_type_uom_cd = ", request->po_list[i]->line_item[j]->ack_package_type_uom_cd, char(0))
   execute oencpm_msglog build("line_comment = ", request->po_list[i]->line_item[j]->line_comment, char(0))
   execute oencpm_msglog build("line_comment_type_cd = ", request->po_list[i]->line_item[j]->line_comment_type_cd, char(0))
   execute oencpm_msglog build("vendor_item_id = ", request->po_list[i]->line_item[j]->vendor_item_id, char(0))
*/

  endfor ;(j=1 to size(oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP, 5)) - Line Information


 ;Line Item Total (CTT01)
 set request->po_list[i]->line_item_total = size(oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP [i]->PO1_GROUP, 5)
 ;execute oencpm_msglog build("line_item_total = ", request->po_list[i]->line_item_total, char(0))

endfor ;(i=1 to size(oen_reply->FUNCTIONAL_HEADING_GROUP [1]->DETAIL_HEADING_GROUP, 5)) - Header Information


;execute oencpm_msglog build("Executing mm_imp_xfi_edi_855...", char(0))

execute mm_imp_xfi_edi_855

;execute oencpm_msglog build("...mm_imp_xfi_edi_855 completed!", char(0))

commit

free record request

;These messages don't need to go to the OEN Router. Ignore them...
set oenstatus->ignore = 1

;execute oencpm_msglog build("************ Out mobj_edi_855_in ************", char(0))