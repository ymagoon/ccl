/*
*  ---------------------------------------------------------------------------------------------
*  Script Name:  bt_map_scgl_out
*  Description:  Map from Library script for Supply Chain General Ledger
*  Type:  Open Engine Map from Library Script
*  ---------------------------------------------------------------------------------------------
*  Author:
*  Domain:
*  Creation Date:  012/15/2016
*  ---------------------------------------------------------------------------------------------
*      MODIFICATION LOG
*  ---------------------------------------------------------------------------------------------
*      Mod             Date            Engineer        Comment
*
*  ---------------------------------------------------------------------------------------------
* Transaction Example:
*
* FacilityA|99998|110000|-7.80|20160614|Adjustment
* FacilityB|87860|110101|7.80|20160614|Adjustment
*/

execute oencpm_msglog build ("**********Entering bt_map_scgl_out**********", char(0))

;****************** Ignore Notify Message ***************************
if(validate(oen_request->cerner->oe_info->batch_id, 99) != 99)
if(oen_request->cerner->oe_info->batch_id > 0)
  execute oencpm_msglog build ("found notify", char(0))
  set oen_reply->out_msg =concat("THIS_SHOULD_BE_IGNORED",char(0))
  go to EXITSCRIPT
 endif
endif
;********************************************************************

;******************* Initialize Variables *************************
declare build_xml_node (level, node_name, node_data) = vc
declare recrd = vc
declare eor = c2
declare delim = c1
declare trans_cnt = i4
declare gl_cnt = i4
declare line_cnt = i4
declare addl_cnt = i4

;uncomment the below for Pharmacy ONLY GL interfacing
;declare med_def_flag = i2
;declare med_def_type_cd = f8
;set med_def_type_cd = uar_get_code_by("MEANING", 11001, "MED_DEF")

;************************************Map Message************************************

set eor = concat(char(13), char(10))
set delim = "|"
set trans_cnt = SIZE(oen_request->trans_h, 5)
execute oencpm_msglog build("trans_cnt = ",trans_cnt,char(0))

if(size(oen_request->trans_h, 5) > 0)

 for(gl_cnt=1 to size(oen_request->trans_h, 5))

   for(line_cnt=1 to size(oen_request->trans_h[gl_cnt]->trans_l,5))

          ;uncomment the below if only interfacing Pharmacy GL transactions
          /*
          ;Check if item is a medication
          select into "nl:"
     from mm_trans_line mtl
     where mtl.mm_trans_line_id = oen_request->trans_h[gl_cnt]->trans_l[line_cnt]->mm_trans_line_id
     detail
       ;if mm_trans_line.item_type_cd = med_def_type_cd set med_def_flag to 1 else set to 0
       med_def_flag = evaluate(mtl.item_type_cd, med_def_type_cd, 1, 0)
     with nocounter

          if(med_def_flag) ;Only send Medication transactions
          */

          if(cnvtreal(oen_request->trans_h[gl_cnt]->trans_l[line_cnt]->amount) > 0) ;do not process 0 dollar transactions
            /* ;comment out msg logging in live production
       execute oencpm_msglog build("trans_dt: ",oen_request->trans_h[gl_cnt]->trans_dt_tm,char(0))
       execute oencpm_msglog build
         ("from company code: ",oen_request->trans_h[gl_cnt]->trans_l[line_cnt]->from_company_code, char(0))
       execute oencpm_msglog build
         ("from cost center: ",oen_request->trans_h[gl_cnt]->trans_l[line_cnt]->from_cost_center_cd->alias, char(0))
       execute oencpm_msglog build
         ("from sub account: ",oen_request->trans_h[gl_cnt]->trans_l[line_cnt]->from_sub_account_cd->alias, char(0))
       execute oencpm_msglog build("amount: -",oen_request->trans_h[gl_cnt]->trans_l[line_cnt]->amount,char(0))
       execute oencpm_msglog build("trans type: ",oen_request->trans_h[gl_cnt]->trans_type_cd->display,char(0))
       */
                ;Write out from side of gl line transaction (negative amount)
            set recrd = build(recrd,
              oen_request->trans_h[gl_cnt]->trans_l[line_cnt]->from_company_code, delim,
              oen_request->trans_h[gl_cnt]->trans_l[line_cnt]->from_cost_center_cd->alias, delim,
              oen_request->trans_h[gl_cnt]->trans_l[line_cnt]->from_sub_account_cd->alias, delim,
              "-", trim(format(round(oen_request->trans_h[gl_cnt]->trans_l[line_cnt]->amount,2),"###############.##"),3), 
              delim,
              format(oen_request->trans_h[gl_cnt]->trans_dt_tm,"YYYYMMDD;;D"), delim,
              oen_request->trans_h[gl_cnt]->trans_type_cd->display, eor
            )
       /* ;comment out msg logging in live production
                execute oencpm_msglog build("trans_dt = ",oen_request->trans_h[gl_cnt]->trans_dt_tm,char(0))
       execute oencpm_msglog build("to company code = ",oen_request->trans_h[gl_cnt]->trans_l[line_cnt]->to_company_code,char(0))
       execute oencpm_msglog build("to cost center =",oen_request->trans_h[gl_cnt]->trans_l[line_cnt]->to_cost_center_cd->alias,
         char(0))
       execute oencpm_msglog build("to sub account = ",oen_request->trans_h[gl_cnt]->trans_l[line_cnt]->to_sub_account_cd->alias,
         char(0))
       execute oencpm_msglog build("amount = ",oen_request->trans_h[gl_cnt]->trans_l[line_cnt]->amount,char(0))
       execute oencpm_msglog build("trans type = ",oen_request->trans_h[gl_cnt]->trans_type_cd->display,char(0))
       */
            ;Write out to side of gl line transaction (positive amount)
            set recrd = build(recrd,
                  oen_request->trans_h[gl_cnt]->trans_l[line_cnt]->to_company_code, delim,
              oen_request->trans_h[gl_cnt]->trans_l[line_cnt]->to_cost_center_cd->alias, delim,
              oen_request->trans_h[gl_cnt]->trans_l[line_cnt]->to_sub_account_cd->alias, delim,
              trim(format(round(oen_request->trans_h[gl_cnt]->trans_l[line_cnt]->amount,2),"###############.##"),3), delim,
              format(oen_request->trans_h[gl_cnt]->trans_dt_tm,"YYYYMMDD;;D"), delim,
              oen_request->trans_h[gl_cnt]->trans_type_cd->display, eor
                )
     endif ;if(cnvtreal(oen_request->trans_h[gl_cnt]->trans_l[line_cnt]->amount) > 0)
          ;uncomment the below for Pharmacy ONLY GL interfacing
          ;endif ;if(med_def_flag) ;Only transmit Med_def type GL transactions
   endfor ;for( j=1 to line_cnt)

        for(addl_cnt = 1 to size(oen_request->trans_h[gl_cnt]->addl_amt_l, 5))
          ;Write out from side of transaction additional amount (negative amount)
     Set recrd = build(recrd,
       "ADDL_AMT", delim,
       trim(oen_request->trans_h[gl_cnt]->addl_amt_l[addl_cnt]->from_company_code), delim,
       trim(oen_request->trans_h[gl_cnt]->addl_amt_l[addl_cnt]->from_cost_center_cd->display), delim,
       trim(oen_request->trans_h[gl_cnt]->addl_amt_l[addl_cnt]->from_sub_account_cd->display), delim,
       "-", trim(format(round(oen_request->trans_h[gl_cnt]->addl_amt_l[addl_cnt]->amount,2),"#################.##"), 3), delim,
                format(oen_request->trans_h[gl_cnt]->trans_dt_tm,"YYYYMMDD;;D"), delim,
       trim(oen_request->trans_h[gl_cnt]->addl_amt_l[addl_cnt]->addl_amt_type_cd->display),eor
                )

          ;Write out to side of transaction additional amount (positive amount)
     Set recrd = build(recrd,
       "ADDL_AMT", delim,
       trim(oen_request->trans_h[gl_cnt]->addl_amt_l[addl_cnt]->to_company_code), delim,
       trim(oen_request->trans_h[gl_cnt]->addl_amt_l[addl_cnt]->to_cost_center_cd->display), delim,
       trim(oen_request->trans_h[gl_cnt]->addl_amt_l[addl_cnt]->to_sub_account_cd->display), delim,
       trim(format(round(oen_request->trans_h[gl_cnt]->addl_amt_l[addl_cnt]->amount,2),"#################.##"), 3), delim,
                format(oen_request->trans_h[gl_cnt]->trans_dt_tm,"YYYYMMDD;;D"), delim,
       trim(oen_request->trans_h[gl_cnt]->addl_amt_l[addl_cnt]->addl_amt_type_cd->display),eor
                )
   endfor ;; size of (oen_request->trans_h[gl_cnt]->addl_amt_l)
 endfor ;for(i = 1 to trans_cnt)

 ;Remove last CRLF to prevent blank line at end of file
 set recrd = replace(recrd, eor, "", 2)

endif ;if(trans_cnt>0)
;******************************************************************************************************************

;****************************Write Out string to oen_reply******************************
if(recrd = "")
 ;If no transactions qualified, do not try to write out empty file as this will cause CCL error
 set oen_reply->out_msg =concat("THIS_SHOULD_BE_IGNORED",char(0));keeps batch_write from trying to write out empty file
 set oenbatchrec->transfer_ind = "N"                             ;keeps batch_transfer_sftp from trying to send non-existant file
else
 set oen_reply->out_msg = concat(recrd, char(0))
endif
;***********************************************************************************************

execute oencpm_msglog build("********** Exiting bt_map_scgl_out **********", char(0))

#EXITSCRIPT