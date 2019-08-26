
/*
record oen_request
(

1 org_msg  = c32000

)

record oen_reply
(

1 type     = c4
1 trigger  = c4

)
*/
free set FD
free set SD
free set CD
free set FLDNUM
free set mp
free set sdp
free set pos
free set cds

; A temporary record, since vc variables can only reside in a record
record tmp
(
1 str = vc
)

; Define the segment in which the type is located

set SN = "MSH"

; Define the field delimiter

set FD = "|"

; Define the segment delimiter

set SD = char(13)

; Define the component delimiter

set CD = "^"

; Define the field number containing the type/trigger
; Typically the type/trigger is the 8th field in MSH

set FLDNUM = 8

; Find the segment

set mp = findstring( "MSH",oen_request->org_msg )

if (mp = 0 )

call echo ("type error - segment containing type field not found")
set oen_reply->type = concat("xxx", char(0))
go to single_exit

endif

; Find the end of the MSH segment

set sdp = findstring (SD, oen_request->org_msg, mp)

if (sdp = 0)

set oen_reply->type = concat("xxx", char(0))
call echo ("type error - end of segment delimiter not found")
go to single_exit

endif

; Get entire segment and store in temp variable
; (so that when finding field, find does not got past this segment and
;  into next)

set tmp->str = substring(mp, sdp-mp+1, oen_request->org_msg)

; Find start position of field

set pos = 0
for( i=1 to FLDNUM )

set pos = findstring( FD, tmp->str, pos )
if (pos = 0)

set oen_reply->type = concat("xxx", char(0))
call echo ("type error - field not found")
go to single_exit

endif
set pos = pos + 1

endfor

; Check for the component delimiter in the correct position

set cds = substring(pos+3,1,tmp->str)
if (cds != CD)

set oen_reply->type = concat("xxx", char(0))
call echo ("type error - component delimiter not found")
go to single_exit

endif

; Forcefully grab the type and trigger
; Type and trigger need for TDB  oeocf(type)(trigger) so both type and trigger
; must be set to the type value of the transaction for TDB to function correctly


set oen_reply->type = concat(substring(pos,3,tmp->str), char(0))
set oen_reply->trigger = concat(substring(pos,3,tmp->str), char(0))

#single_exit