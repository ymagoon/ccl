record message (
  1 field_delim = c1
  1 comp_delim = c1
  1 rep_delim = c1
  1 esc = c1
  1 sub_comp_delim = c1
  1 seg [*]
    2 seg_name = vc
    2 seg_value = vc
    2 field [*]
      3 field_value = vc
      3 repeat [*]
        4 repeat_value = vc
        4 comp [*]
          5 comp_value = vc
          5 sub_comp [*]
            6 sub_value = vc
  1 msg = vc
)

declare add_data_by_id (id = vc, data = vc) = i2
declare find_segment (header = vc, pos = i2) = i2
 
;define standard encoding characters
set message->field_delim = "|"
set message->comp_delim = "^"
set message->rep_delim = "~"
set message->esc = "\"
set message->sub_comp_delim = "&"
 
 
 ;populate MSH segment
set stat = alterlist(message->seg,1)
set stat = alterlist(message->seg.field,17)
 
set message->seg.seg_name = "MSH"
 
;MSH.2
set stat = alterlist(message->seg.field.repeat,1)
set stat = alterlist(message->seg.field.repeat.comp,1)
set message->seg.field[1].repeat.comp.comp_value = concat(message->comp_delim
														  , message->rep_delim
														  , message->esc
														  , message->sub_comp_delim)
 
;MSH.3
set stat = alterlist(message->seg.field[2].repeat,1)
set stat = alterlist(message->seg.field[2].repeat.comp,1)
set message->seg.field[2].repeat.comp.comp_value = "HNAM"
 
;MSH.4
set stat = alterlist(message->seg.field[3].repeat,1)
set stat = alterlist(message->seg.field[3].repeat.comp,1)
set message->seg.field[3].repeat.comp.comp_value = "CERNER"
 
;MSH.6
set stat = alterlist(message->seg.field[5].repeat,1)
set stat = alterlist(message->seg.field[5].repeat.comp,1)
set message->seg.field[5].repeat.comp.comp_value = "BAYCARE"
 
;MSH.11
set stat = alterlist(message->seg.field[10].repeat,1)
set stat = alterlist(message->seg.field[10].repeat.comp,1)
 
if (curdomain != "P30")
  set message->seg.field[10].repeat.comp.comp_value = "T"
else
  set message->seg.field[10].repeat.comp.comp_value = "P"
endif
 
;MSH.12
set stat = alterlist(message->seg.field[11].repeat,1)
set stat = alterlist(message->seg.field[11].repeat.comp,1)
set message->seg.field[11].repeat.comp.comp_value = "2.3"
 
;MSH.18
set stat = alterlist(message->seg.field[17].repeat,1)
set stat = alterlist(message->seg.field[17].repeat.comp,1)
set message->seg.field[17].repeat.comp.comp_value = "8859/1"

subroutine add_data_by_id(id, data)
  set regexp = "[A-Z1-3]{3}(\[[0-9]+\])?-[0-9]+(\[[0-9]+\])?\.?([0-9]+)?\.?([0-9]+)?"

  if (operator(id, "REGEXPLIKE", regexp) = 1)
    call echo("matched")
    ;PID-3[2].4.1
	;PID-3.4.1
	;NK1-1
	;NK1-2.1
	;PID-3[18].6.1
	;OBX[3]-3.1
	
	declare msg_header = c3
	
	;1 piece the string using a dash -
	set header = piece(id,"-",1,"")
	set body = piece(id,"-",2,"")
	
	call echo(build("header=",header))
	call echo(build("body=",body))
	
	;look to see if there are brackets []
	if (textlen(body) > 3)
	
	else
	  set msg_header = header
	
	
	;using the number in the brackets or if there are no brackets assume 1 see if a segment exists
	;if a segment does not exist create it (alterlist)
	;if a segment exists take the second piece and piece it again using a period .
	;look to see if there are any brackets []
	;using the number in the brackets or if there are none assume 1 see if a field exists
  else
    call echo("The HL7 pattern does not match. Please fix it and try again. ")
    return (-1)
  endif
  
  call echo(build("id=",id))
end
