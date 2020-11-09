/*
*  -----------------------------------------------------------------------------------------------
*  Script Name:  bt_map_scap_out
*  Description:  Map from Library script for Supply Chain Accounts Payable
*  Type:  Open Engine Map from Library Script
*  -----------------------------------------------------------------------------------------------
*  Author:
*  Domain:
*  Creation Date:
*  -----------------------------------------------------------------------------------------------
*      MODIFICATION LOG
*  -----------------------------------------------------------------------------------------------
*      Mod             Date            Engineer        Comment
*
*  -----------------------------------------------------------------------------------------------
* Transaction Example:
*
* INVHEAD|00001|20130101|1|1028.93.00|FacilityA|7383749
* ADDLAMT|1|Freight|28.93|FacilityA|1030|98760
* INVLINE|1|751806|acetaminophen 160 mg/5 mL Oral Susp|ML|250.00|4|1000.00|FacilityA|8000|60815
* INVHEAD|00002|20130101|2|412.95|FacilityB|4321
* INVLINE|1|379029|budesonide-formoterol 160 mcg-4.5 mcg/inh Aerosol 10.2 g|EA|100.00|2|200.00|FacilityB|8000|60815
* LINEADDLAMT|1|Service Charge|12.45|FacilityB|8000|60815
* INVLINE|2|893094|Sodium Chloride 0.9% IV Sol 100 mL|VI|200.50|1|200.50|FacilityB|8010|60816
*/

execute oencpm_msglog build("**********Entering bt_map_scap_out**********", char(0))

;****************** Ignore Notify Message *********************************************************
if(validate( oen_request->cerner->oe_info->batch_id ,99)!= 99)
if(oen_request->cerner->oe_info->batch_id > 0)
  execute oencpm_msglog build ("Found Notify", char(0))
  set oen_reply->out_msg = concat("THIS_SHOULD_BE_IGNORED", char(0))
  go to EXITSCRIPT
 endif
endif
;**************************************************************************************************

;*****************************Declare and initialize vars******************************************
declare recrd     = vc
declare eor       = c2
declare delim     = c1
declare trans_cnt = i4

set eor = concat(char(13), char(10))
set delim = "|"
set trans_cnt = size(oen_request->inv, 5)
execute oencpm_msglog(build("trans_cnt = ",trans_cnt,char(0)))
;**************************************************************************************************

;************************************Map Message***************************************************
if(trans_cnt>0)

 for(inv_cnt = 1 to trans_cnt)

   ;execute oencpm_msglog build ("inv_cnt = ",inv_cnt, char(0))

        ;Write out invoice header
   set recrd = build(recrd,
                "INVHEAD", delim,
                oen_request->inv[inv_cnt]->invoice_nbr, delim,
                format(oen_request->inv[inv_cnt]->invoice_dt_tm,"YYYYMMDD;;D"), delim,
                oen_request->inv[inv_cnt]->total_invoice_lines, delim,
                trim(format(cnvtreal(oen_request->inv[inv_cnt]->invoice_amount),"###############.##"),3), delim,
                oen_request->inv[inv_cnt]->company_code, delim,
                oen_request->inv[inv_cnt]->vendor_nbr, eor)

        for(add_cnt = 1 to size(oen_request->inv[inv_cnt]->addl_amt, 5))

          ;execute oencpm_msglog build ("add_cnt = ",add_cnt, char(0))

          ;Write out invoice addional amount if applicable
          set recrd = build(recrd,
            "ADDLAMT", delim,
            add_cnt, delim,
            trim(oen_request->inv[inv_cnt]->addl_amt[add_cnt]->addl_amt_type_cd->alias), delim,
            trim(format(round(oen_request->inv[inv_cnt]->addl_amt[add_cnt]->total_amount, 2), "#################.##"),3), delim,
            trim(oen_request->inv[inv_cnt]->addl_amt[add_cnt]->company_code), delim,
            trim(oen_request->inv[inv_cnt]->addl_amt[add_cnt]->cost_center_cd->alias), delim,
            trim(oen_request->inv[inv_cnt]->addl_amt[add_cnt]->sub_account_cd->alias), eor)
        endfor;for(add_cnt = 1 to size(oen_request->inv[inv_cnt]->addl_amt, 5)

   for(line_cnt = 1 to size(oen_request->inv[inv_cnt]->inv_line, 5))

     ;execute oencpm_msglog build ("line_cnt = ",line_cnt, char(0))

          ;Write out invoie lines
     set recrd = build(recrd,
       "INVLINE", delim,
       trim(oen_request->inv[inv_cnt]->inv_line[line_cnt]->voucher_line_nbr), delim,
       trim(oen_request->inv[inv_cnt]->inv_line[line_cnt]->item_nbr), delim,
       trim(oen_request->inv[inv_cnt]->inv_line[line_cnt]->description), delim,
       trim(oen_request->inv[inv_cnt]->inv_line[line_cnt]->uom_cd->alias), delim,
       trim(format(round(oen_request->inv[inv_cnt]->inv_line[line_cnt]->unit_price, 2), "#################.##"), 3), delim,
       trim(oen_request->inv[inv_cnt]->inv_line[line_cnt]->quantity), delim,
       trim(format(round(oen_request->inv[inv_cnt]->inv_line[line_cnt]->extended_price, 2), "#################.##"), 3), delim,
       trim(oen_request->inv[inv_cnt]->inv_line[line_cnt]->company_code), delim,
       trim(oen_request->inv[inv_cnt]->inv_line[line_cnt]->cost_center_cd->alias), delim,
       trim(oen_request->inv[inv_cnt]->inv_line[line_cnt]->sub_account_cd->alias), eor)

          for(line_add_cnt = 1 to size(oen_request->inv[inv_cnt]->inv_line[line_cnt]->addl_amt, 5))

                ;execute oencpm_msglog build ("line_add_cnt = ",line_add_cnt, char(0))

                ;Write out invoice line addional amounts if applicable
       set recrd = build(recrd,
         "LINEADDLAMT", delim,
         line_add_cnt, delim,
         trim(oen_request->inv[inv_cnt]->inv_line[line_cnt]->addl_amt[line_add_cnt]->addl_amt_type_cd->alias), delim,
         trim(format(round(oen_request->inv[inv_cnt]->inv_line[line_cnt]->addl_amt[line_add_cnt]->total_amount, 2),
           "#################.##"),3), delim,
         trim(oen_request->inv[inv_cnt]->inv_line[line_cnt]->addl_amt[line_add_cnt]->company_code), delim,
         trim(oen_request->inv[inv_cnt]->inv_line[line_cnt]->addl_amt[line_add_cnt]->cost_center_cd->alias), delim,
         trim(oen_request->inv[inv_cnt]->inv_line[line_cnt]->addl_amt[line_add_cnt]->sub_account_cd->alias), eor)

     endfor ;for(add_cnt = 1 to size(oen_request->inv[inv_cnt]->inv_line[line_cnt]->addl_amt, 5))
   endfor ;for(line_cnt = 1 to size(oen_request->inv[inv_cnt]->inv_line, 5))
 endfor ;for(i = 1 to trans_cnt)

 ;Remove last CRLF to prevent blank line at end of file
 set recrd = replace(recrd, eor, "", 2)

endif ;if(trans_cnt>0)
;**************************************************************************************************

;****************************Write Out string to oen_reply*****************************************
if(recrd = "")
 ;If no transactions qualified, do not try to write out empty file as this will cause CCL error
 set oen_reply->out_msg =concat("THIS_SHOULD_BE_IGNORED",char(0));keeps batch_write from trying to write out empty file
 set oenbatchrec->transfer_ind = "N"                             ;keeps batch_transfer_sftp from trying to send non-existant file
else
 set oen_reply->out_msg = concat(recrd, char(0))
endif
;**************************************************************************************************

execute oencpm_msglog build ("********** Exiting bt_map_scap_out **********", char(0))

#EXITSCRIPT