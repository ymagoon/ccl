;This program obtains phone numbers for a list of persons.  It executes a 
;child script to obtain the phone number of each person within a loop.  This 
;causes high executions of the child script.  

drop program dar_high_script_exec_1B go
create program  dar_high_script_exec_1B

free record request
record request(
    1 qual [*]
    	2 person_id = f8
    	2 person_name = vc  
	2 phone_num = vc
)
record contact_info(
    1 person_id = f8
    1 phone_num = vc
)
set cnt = 0

select into "nl:"
  from person p
detail 
       cnt  = cnt + 1
       stat = alterlist(request->qual, cnt)  
       request->qual[cnt].person_id   = p.person_id
       request->qual[cnt].person_name = p.name_full_formatted
  with maxqual(p, 140)
   
for (i = 1 to size(request->qual, 5))
    set contact_info->person_id = request->qual[i].person_id
    execute dar_high_script_exec_1A with replace ("REQUEST", "CONTACT_INFO")
    set request->qual[i].phone_num = contact_info->phone_num       
endfor
call echorecord(request)
end go
