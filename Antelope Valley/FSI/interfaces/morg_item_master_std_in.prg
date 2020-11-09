/*
*  ---------------------------------------------------------------------------------------------
*  Script Name:  morg_item_master_std_in
*  Description:  Item Master Inbound Modify Original Standard
*  Type:  Open Engine Modify Original Script
*  ---------------------------------------------------------------------------------------------
*  Author:
*  Domain:
*  Creation Date:
*  ---------------------------------------------------------------------------------------------
*/

;execute oencpm_msglog build("************ In morg_item_master_std_in ************", char(0))

;Item Master sync interface requires display values to match various data points:
;Manufacturer (cs 221), Unit of Measure (cs 54), Location (cs 220), etc
;get_display_from_alias subroutine for values sent as alias and not display
declare get_display_from_alias(alias, code_set, contributor_source) = vc
declare get_org_from_alias(alias) = vc

declare org_msg = vc
declare 2015_ind = i2
declare delim = vc

set org_msg = trim(oen_request->org_msg) ;Assign raw message to 'org_msg'

set 2015_ind = 0 ;Set to '1' if client is under 2015 code level

set delim = substring(4, 1, org_msg) ;Find file/segment delimeter
;execute oencpm_msglog build("Segment Delimeter: ", delim, char(0))


case(piece(org_msg, delim, 1, "", 4))

 of "IMM":

   execute op_morg_item_master_imm

 of "ILC":

   execute op_morg_item_master_ilc

 of "ILL":

   execute op_morg_item_master_ill

 of "ILS":

   execute op_morg_item_master_ils

endcase


;These messages are not processed by ESI or other com-server. Ignore them...
set oen_reply->out_msg = concat("OEN_IGNORE", char(0))

;Send the org_msg back out as the out_msg (uncomment 'OEN_IGNORE')
;set oen_reply->out_msg = concat(oen_request->org_msg, char(0))


;execute oencpm_msglog build("************ Out morg_item_master_std_in ************", char(0))


subroutine get_display_from_alias(alias, code_set, contributor_source)
 declare contrib_source_cd = f8
 declare display_val = vc

 set contrib_source_cd = uar_get_code_by("DISPLAY", 73, nullterm(contributor_source))

 select into "nl:"
   cv.display
 from code_value_alias cva,
   code_value cv
 plan cva
 where cva.alias = alias
 and cva.contributor_source_cd = contrib_source_cd
 and cva.code_set = code_set
 join cv
 where cv.code_value = cva.code_value
 and cv.active_ind = 1
 and cv.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
 detail

   display_val = cv.display

 with nocounter


 if(display_val != "")

   return(display_val)

 else

   select into "nl:"
     cv.display
   from code_value cv
   where cv.display = alias
   and cv.code_set = code_set
        and cv.active_ind = 1

   and cv.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
   detail

     display_val = cv.display

   with nocounter


   if(display_val != "")

     return(display_val)

   else

     return(alias)

   endif

 endif
end ;get_display_from_alias


subroutine get_org_from_alias(alias)
 declare org_alias_pool_cd = f8
 declare organization_name = vc

 set org_alias_pool_cd = uar_get_code_by("DISPLAY", 263, "FSI_IM_ORGANIZAITON")

 select into "nl:"
   o.org_name
 from organization_alias oa,
   organization o
 plan oa
 where oa.alias = alias
 and oa.alias_pool_cd = org_alias_pool_cd
 and oa.active_ind = 1
 and oa.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
 join o
 where o.organization_id = oa.organization_id
 and o.active_ind = 1
 and o.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
 detail

   organization_name = o.org_name

 with nocounter


 if(organization_name != "")

   return(organization_name)

 else

   select into "nl:"
     o.org_name
   from organization o
   where o.org_name = alias
        and o.active_ind = 1
   and o.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
   detail

     organization_name = o.org_name

   with nocounter


   if(organization_name != "")

     return(organization_name)

   else

     return(alias)

   endif

 endif
end ;get_org_from_alias