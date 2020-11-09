/*
*  ---------------------------------------------------------------------------------------------
*  Script Name:  mobj_edi_850_out
*  Description:  EDI Purchase Order 850 Outbound Modify Object Starter
*  Type:  Open Engine Modify Object Script
*  ---------------------------------------------------------------------------------------------
*  Author:
*  Domain:
*  Creation Date:
*  ---------------------------------------------------------------------------------------------
*/

;execute oencpm_msglog build("************ In mobj_edi_850_out ************", char(0))

;Ignore notify message from router
if(validate(oen_reply->CONTROL_GROUP [1]->MSH , "N") != "N")

 go to exit_script

endif

declare get_string_value(string_meaning) = c15

declare subtype = vc
declare batch_id = f8

set subtype = get_string_value("cqm_subtype")
set batch_id = oenbatchrec->batch_id

;execute oencpm_msglog build("subtype = ", subtype, char(0))
;execute oencpm_msglog build("batch_id = ", batch_id, char(0))

;Process according to event type
case(subtype)

 of "BEGIN":
   ;Perform BEGIN scripting here (ISA)
   ;execute oencpm_msglog build("Inside BEGIN event...", char(0))

 of "HEADER":
   ;Perform HEADER scripting here (GS)
   ;execute oencpm_msglog build("Inside HEADER event...", char(0))

 of "DETAIL":
   ;Perform DETAIL scripting here (ST, BEG, PO1, PID, CTT, SE, etc.)
   ;execute oencpm_msglog build("Inside DETAIL event...", char(0))

 of "TRAILER":
   ;Perform GE scripting here (GE)
   ;execute oencpm_msglog build("Inside TRAILER event...", char(0))

 of "END":
   ;Perform IEA scripting here (IEA)
   execute oencpm_msglog build("Inside END event...", char(0))

endcase

#exit_script

;execute oencpm_msglog build("************ Out mobj_edi_850_out ************", char(0))

subroutine get_string_value(string_meaning)
 declare eso_idx = i4
 declare list_size = i4

 set eso_idx = 0
 set list_size = 0

 set val_stat = (validate(oen_reply->cerner, "nocernerarea"))
 if (val_stat = "nocernerarea")
   return("")
 else
   set eso_idx = 0
   set list_size = 0
   set list_size = size(oen_reply->cerner->stringList,5)

   if(list_size > 0)
     set eso_x = 1
     for(eso_x = eso_x to list_size)
       if(oen_reply->cerner->stringList[eso_x]->strMeaning = string_meaning)
         set eso_idx = eso_x
       endif
     endfor
   endif

   if(eso_idx > 0)
     return(oen_reply->cerner->stringList[eso_idx]->strVal)
   else
     return("0")
   endif
 endif
end ;get_string_value