/*
*  ---------------------------------------------------------------------------------------------
*  Script Name:  bt_map_scpou_out
*  Description:  Mapping script for Point of Use Outbound
*  Type:  Open Engine Map From Library Script
*  ---------------------------------------------------------------------------------------------
*  Author:
*  Domain:
*  Creation Date:
*  ---------------------------------------------------------------------------------------------
*      MODIFICATION LOG
*  ---------------------------------------------------------------------------------------------
*      Mod             Date            Engineer        Comment
*
*  ----------------------------------------------------------------------------------------------
* Transaction Example:
* 0101121|OB Wing West|20000|3|EA
* 0101121|NWING|20042|2|BX
* 0101210|Floor 3 East|12345|8|EA
*/

execute oencpm_msglog (BUILD ("**********Entering bt_map_scpou_out**********", char(0)))

call echo (OEN_REQUEST)

;****************** Ignore Notify Message *******************
if(validate(oen_request->cerner->oe_info->batch_id, 99)!= 99)
if(oen_request->cerner->oe_info->batch_id > 0 )
  execute oencpm_msglog BUILD ("Found Notify", char(0))
  set oen_reply->out_msg =concat("THIS_SHOULD_BE_IGNORED",char(0))
  set oenbatchrec->transfer_ind = "N"
  go to EXITSCRIPT
 endif
endif
;******************************************************************


;******************* Initialize Variables *************************
declare build_xml_node(level, node_name, node_data) = vc

declare payload = vc
declare recrd = vc
declare eor     = c2
declare delim   = c1
declare trans_cnt = i4
declare equip_master_flag = i2
declare equipment_type_cd = f8
declare qty = vc

set equipment_type_cd = uar_get_code_by("MEANING", 11001, "ITEM_EQP")
set eor = concat(char(13), char(10))
set delim = "|"
set trans_cnt = size(oen_request->trans_l, 5)
execute oencpm_msglog build("trans_cnt = ",trans_cnt,char(0))

;************************************Map Message************************************

for(i=1 to trans_cnt)

 ;Don't send equipment usage (only item_master and med_def usage)
 select into "nl:"
 from mm_trans_line mtl
 where mtl.mm_trans_line_id = oen_request->trans_l[i]->mm_trans_line_id
 detail
   ;if mm_trans_line.item_type_cd = equipment_type_cd set equip_master_flag to 1 else set to 0
   equip_master_flag = evaluate(mtl.item_type_cd, equipment_type_cd, 1, 0)
 with nocounter

 execute oencpm_msglog build("For transaction ", i , " equip_master_flag = ", equip_master_flag, char(0))
 if(equip_master_flag) ;Dont transmit equipment usage

 ;execute oencpm_msglog build("For transaction ", i , " transaction type = ",
 ;oen_request->trans_l[i]->trans_type_cd->cdf_meaning, char(0))


 ;execute oencpm_msglog build("For transaction ", i, " reason code = ", oen_request->trans_l[i]->reason_cd->cdf_meaning, char(0))

          ;Please verify that the list of usage reasons to be send out is accurate with Supply Chain resource or client
          ;Only send case fill, case return, admin, admin credit, patient charge or patient credit reasons
     if(oen_request->trans_l[i]->reason_cd->cdf_meaning in
       ("CASEFILL", "CASERETURN", "ADMIN", "ADMINCREDIT", "PT_CHARGE", "PT_CREDIT"))

       if(oen_request->trans_l[i]->from_location_cd->display != "") ;build fill record
         set recrd = build(recrd,
                oen_request->trans_l[i]->from_company_code, delim,
                oen_request->trans_l[i]->from_location_cd->alias, delim,
                oen_request->trans_l[i]->item_nbr, delim,
                oen_request->trans_l[i]->qty, delim, ;send qty as positive to reflect decrement to Cerner QoH
                oen_request->trans_l[i]->uom_cd->alias, eor)
       endif ;if(oen_request->trans_l[i]->from_location_cd->display != "")

       if(oen_request->trans_l[i]->to_location_cd->display != "") ;build return record
         set recrd = build(recrd,
                oen_request->trans_l[i]->to_company_code, delim,
                oen_request->trans_l[i]->to_location_cd->alias, delim,
                oen_request->trans_l[i]->item_nbr, delim,
                "-", oen_request->trans_l[i]->qty, delim, ;send qty as negative to reflect increment to Cerner QoH
                oen_request->trans_l[i]->uom_cd->alias, eor)

       endif ;if(oen_request->trans_l[i]->to_location_cd->display != "")


     endif ;if(oen_request->trans_l[i]->reason_cd->cdf_meaning in
            ;("CASEFILL", "CASERETURN", "ADMIN", "ADMINCREDIT", "PT_CHARGE", "PT_CREDIT"))

 endif ; if(!(equip_master_flag)) ;Dont transmit equipment usage
endfor ;(i=1 to trans_cnt)

;Remove last CRLF to prevent blank line at end of file
set recrd = replace(recrd, eor, "", 2)
;*********************************************************************************************

;****************************Write Out string to oen_reply******************************
if(recrd = "")
 ;If no transactions qualified, do not try to write out empty file as this will cause CCL error
 set oen_reply->out_msg =concat("THIS_SHOULD_BE_IGNORED",char(0));keeps batch_write from trying to write out empty file
 set oenbatchrec->transfer_ind = "N"                             ;keeps batch_transfer_sftp from trying to send non-existant file
else
 set oen_reply->out_msg = concat(recrd, char(0))
endif
;***********************************************************************************************

execute oencpm_msglog build("********** Exiting bt_map_scpou_out **********", char(0))

#EXITSCRIPT