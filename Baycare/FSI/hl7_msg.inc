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

