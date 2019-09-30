/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  fsi_build_msgs.prg
 *  Object name:  fsi_build_msgs
 *  Description:  Identify if a patient is at risk by defining at risk plans and calling hcm_get_at_risk_indicator
 *                to determine if the patient has an at risk health plan
 *  Testing: 	  execute bc_hcm_rule_at_risk go
 *  ---------------------------------------------------------------------------------------------
 *  Author:       Yitzhak Magoon
 *  Creation Date:  09/18/2019
 *  ---------------------------------------------------------------------------------------------
 *  Mod#   Date      Engineer           Description & Requestor Information
 *  --- --------   -------------------- ----------------------------------------------
 *  000   09/18/19  Yitzhak Magoon      Initial Release
 *  ---------------------------------------------------------------------------------------------
*/

drop program fsi_build_msgs go
create program fsi_build_msgs

free record reply
record reply (
  1 err_msg = vc
  1 msg = vc
%i cclsource:status_block.inc
)

/**************************************************************
* Declare variables and sub routines                          *
***************************************************************/
declare build_reply(status,err_msg) = null

declare component = vc
declare sub_component = vc

if (validate(message) = 0)
  call echo("No message passed to fsi_build_msgs")
  call build_reply("F","No message passed to fsi_build_msgs")
  
  go to END_SCRIPT
endif

if (size(message->seg,5) = 0)
  call echo("Message contains zero segments")
  call build_reply("F","Message contains zero segments")
  
  go to END_SCRIPT
endif

if (message->seg[1].seg_name != "MSH")
  call echo("First segment of message must be MSH")
  call build_reply("F","First segment of message must be MSH")
  
  go to END_SCRIPT
endif

/**************************************************************
* Loop through message record structure and build hl7 message *
***************************************************************/
set segs = size(message->seg,5)

for (seg = 1 to segs)
  set fields = size(message->seg[seg].field,5)
  
  for (field = 1 to fields)
    set repeats = size(message->seg[seg].field[field].repeat,5)
    
    for (repeat = 1 to repeats)
      set comps = size(message->seg[seg].field[field].repeat[repeat].comp,5)
      
      for (comp = 1 to comps)
        set sub_comps = size(message->seg[seg].field[field].repeat[repeat].comp[comp].sub_comp,5)
        set component = message->seg[seg].field[field].repeat[repeat].comp[comp].comp_value
        
        for (sub_comp = 1 to sub_comps)
          set sub_component = message->seg[seg].field[field].repeat[repeat].comp[comp].sub_comp[sub_comp].sub_value
          set component = concat(component, message->sub_comp_delim, sub_component)
        endfor ;end sub_comp
        
        set message->seg[seg].field[field].repeat[repeat].repeat_value = 
          concat(message->seg[seg].field[field].repeat[repeat].repeat_value, component)
        
        ;ensure comp delim is not added to the end of the last component in a field
        if (comp != comps)
          set message->seg[seg].field[field].repeat[repeat].repeat_value = 
            concat(message->seg[seg].field[field].repeat[repeat].repeat_value, message->comp_delim)
        endif
      endfor ;end comp
      
      set message->seg[seg].field[field].field_value = 
        concat(message->seg[seg].field[field].field_value, message->seg[seg].field[field].repeat[repeat].repeat_value)
       
      ;ensure repeat delim is not added to the end of the field
      if (repeat != repeats)
        set message->seg[seg].field[field].field_value = concat(message->seg[seg].field[field].field_value, message->rep_delim)
      endif
    endfor ;end repeat
    
    ;add the segment name to the segment
    if (field = 1)
      set message->seg[seg].seg_value = concat(message->seg[seg].seg_name, message->field_delim)
    endif
    
    set message->seg[seg].seg_value = concat(message->seg[seg].seg_value, message->seg[seg].field[field].field_value)
    
    ;ensure field delim is not added to the end of the last field in the segment
    if (field != fields)
      set message->seg[seg].seg_value = concat(message->seg[seg].seg_value, message->field_delim)
    endif
  endfor ;end field
  
  set message->msg = concat(message->msg, message->seg[seg].seg_value)
  
  ;add a carriage return to the end of the segment
  if (seg != segs)
    set message->msg = concat(message->msg, char(13))
  endif
endfor

call echorecord(message)

;if a 1 is passed then we write the file to a file location
if ($1 = 1)
  set filename = $2

  select into value(filename)
  from
    (dummyt d with seq = value(size(message->seg,5)))
  plan d
  detail
    message->seg[d.seq].seg_value
    row + 1
  with maxrow = 1 ,maxcol = 35000 ,noformfeed ,format = crstream
endif

call build_reply("S","")

;build reply record structure
subroutine build_reply(status,err_msg)
  set reply->status_data.status = status
  set reply->err_msg = err_msg
  set reply->msg = message->msg
  set reply->status_data.subeventstatus.OperationName = "fsi_build_msgs"
end

#END_SCRIPT

end
go 

