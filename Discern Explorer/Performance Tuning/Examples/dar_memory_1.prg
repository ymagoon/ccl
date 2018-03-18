;This sample script shows how the "call trace(7) command can be
;executed to show memory usage.  The first call is made at the
;beginning of the script.  The second call is made after the record
;structure has been defined and populated.  The third call is made
;after the record structure is freed.

drop program dar_memory_1 go
create program dar_memory_1
call trace (7)   ;First Call Trace
record request(
    1 Person[*]
      2 person_name = vc
) with protect
set cnt = 0
select into "nl:"
  from person p
detail
       cnt = cnt + 1
       stat = alterlist(request->person, cnt)
       request->person[cnt].person_name = p.name_full_formatted
  with maxqual(p, 8000)
call trace (7)   ;Second Call Trace
free record request
call trace (7)   ;Third Call Trace
end go


