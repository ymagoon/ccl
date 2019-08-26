/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  orm_hie_in
 *  Description:  Lab Orders from HIE
 *  Type:         Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:         Hope Kaczmarczyk
 *  Library:        OEOCFORMORM
 *  Creation Date:  12/18/17
 *  ---------------------------------------------------------------------------------------------
 *  Mod#  Date       Author                   Description & Requestor Information
 *
 *  1:      12/18/17  H Kaczmarczyk   New Mod Object Script for un-aliased specimen type 2018 Upgrade issue-SR 418323022.
 *  2:      02/01/18  H Kaczmarczyk   Package 101267 was loaded on 1/31/18 to fix the issue; script is no longer in use.
 *  ---------------------------------------------------------------------------------------------
*/

;OBR Segment
Declare spe_ail_val = vc
Declare spe_ail = f8

Set contrib_src = uar_get_code_by("DISPLAYKEY", 73, "INVISION") 
Set obr_size = size(oen_reply->ORDER_GROUP [1]->OBR_GROUP, 5)
Set  x = 1

For (x = 1 to obr_size)
   Set spe_ail = 0
   Set spe_ail_val = oen_reply->ORDER_GROUP [1]->OBR_GROUP [x]->OBR->spec_source->spec_name_cd->identifier

  If (spe_ail_val = "")
      Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [x]->OBR->spec_source->spec_name_cd->identifier = "SPECIMEN MISMATCH"
      
  Else 
    select into "nl:" 
    cv.code_value 
    from code_value_alias cva, code_value cv 
    plan cva 
    where cva.alias = spe_ail_val
    and cva.contributor_source_cd = contrib_src 
    join cv 
    where cv.code_value = cva.code_value 
    and cv.active_ind = 1
    and cv.BEGIN_EFFECTIVE_DT_TM < cnvtdatetime(curdate, curtime)
    and cv.END_EFFECTIVE_DT_TM > cnvtdatetime(curdate, curtime)
  
    detail
    spe_ail=cv.code_value
    with nocounter
  
      if (spe_ail = 0)
          Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [x]->OBR->spec_source->spec_name_cd->identifier = "SPECIMEN MISMATCH"
       
      Endif
  Endif
Endfor