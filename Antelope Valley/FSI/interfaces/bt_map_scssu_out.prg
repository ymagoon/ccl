/*
*  ---------------------------------------------------------------------------------------------
*  Script Name:  bt_map_scssu_out
*  Description:  Supply Chain Surgical Supply Usage Map From Library
*  Type:  Open Engine Map from Library Script
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

execute oencpm_msglog (build ("**********Entering bt_map_scssu_out**********", char(0)))

;****************** Ignore Notify Message *******************
if(validate(oen_request->cerner->oe_info->batch_id, 99 )!= 99)
if(oen_request->cerner->oe_info->batch_id > 0)
  ;execute oencpm_msglog build ("FOUND NOTIFY", char(0))
  go to EXITSCRIPT
 endif
endif
;******************************************************************

;******************* Declare and initialize variables *************************
declare payload = vc
declare recrd = vc
declare eor     = c2
declare delim = c1
declare surg_sz = i4
declare item_sz = i4
declare loc_sz  = i4
declare surg_cnt = i4
declare item_cnt = i4
declare loc_cnt = i4
declare item_mstr_cd = f8
declare item_mstr_flag = i2

set item_mstr_cd = UAR_GET_CODE_BY("MEANING", 11001, "ITEM_MASTER")
set eor = concat(char(13), char(10))
set delim = "|"
set surg_sz = size(oen_request->surg_case_qual, 5)
;execute oencpm_msglog build("surg_sz = ",surg_sz, char(0))

;************************************Map Message************************************

if(surg_sz > 0)

 for(surg_cnt = 1 to surg_sz)

 ;execute oencpm_msglog build ("surg_cnt =",surg_cnt, char(0))

 set item_sz = size(oen_request->surg_case_qual[surg_cnt]->item_qual, 5)

 ;execute oencpm_msglog build ("item_sz =",item_sz, char(0))

   for(item_cnt = 1 to item_sz)

        ;execute oencpm_msglog build ("item_cnt =",item_cnt, char(0))

        set loc_sz = size(oen_request->surg_case_qual[surg_cnt]->item_qual[item_cnt]->location_qual, 5)

        ;execute oencpm_msglog build("loc_sz =",loc_sz, char(0))

     for(loc_cnt = 1 to loc_sz)

       ;execute oencpm_msglog build ("loc_cnt =",loc_cnt, char(0))

                select into "nl:"
       from item_definition id
       where id.item_id = oen_request->surg_case_qual[surg_cnt]->item_qual[item_cnt]->item_id
       detail
         ;if item_definition.item_type_cd = item_mstr_cd set item_mstr_flag to 1 else set to 0
         item_mstr_flag = evaluate(id.item_type_cd, item_mstr_cd, 1, 0)
       with nocounter

            if(item_mstr_flag) ;Only send item_master usage transactions

              ;*****Get Company code for organization location is associated to*****
              declare location_cd = f8
              declare comp_code_cd = f8
              declare company_code = vc

              set location_cd = oen_request->surg_case_qual[surg_cnt]->item_qual[item_cnt]->location_qual[loc_cnt]->location_cd
              set comp_code_cd = uar_get_code_by("DISPLAYKEY", 263, "COMPANYCODE")

              select into "nl:"
           oa.alias
         from
           location l
           , organization o
                , organization_alias oa

         plan l where l.location_cd = location_cd
                and l.active_ind = 1
              join oa where l.organization_id = oa.organization_id
                and oa.active_ind = 1
                and oa.alias_pool_cd = comp_code_cd
         detail
           company_code = oa.alias
         with nocounter
              ;********************************************************************

         set recrd = build(recrd,
           company_code, delim,
           oen_request->surg_case_qual[surg_cnt]->item_qual[item_cnt]->location_qual[loc_cnt]->location_cd_str, delim,
           oen_request->surg_case_qual[surg_cnt]->item_qual[item_cnt]->item_nbr, delim,
           oen_request->surg_case_qual[surg_cnt]->item_qual[item_cnt]->location_qual[loc_cnt]->item_cnt, delim,
           oen_request->surg_case_qual[surg_cnt]->item_qual[item_cnt]->location_qual[loc_cnt]->uom_cd_str, eor
         )
                endif;if(item_mstr_flag) ;Only send item_master usage transactions

          endfor; for(loc_cnt = 1 to loc_sz)

   endfor; for(item_cnt = 1 to item_sz)

 endfor; for(surg_cnt = 1 to surg_sz)

 ;Remove last CRLF to prevent blank line at end of file
 set recrd = replace(recrd, eor, "", 2)

endif; if(surg_sz > 0)
;*********************************************************************************************

;****************************Write Out string to oen_reply******************************
if(recrd = "")
 ;If no transactions qualified, do not try to write out empty file as this will cause CCL error
 set oen_reply->out_msg =concat("THIS_SHOULD_BE_IGNORED",char(0)) ;keeps batch_write from trying to write out empty file
 set oenbatchrec->transfer_ind = "N" ;keeps batch_transfer_sftp from trying to send non-existant file
else
 set oen_reply->out_msg = concat(recrd, char(0))
endif
;***********************************************************************************************

#EXITSCRIPT

execute oencpm_msglog build ("********** Exiting bt_map_scssu_out **********", char(0))