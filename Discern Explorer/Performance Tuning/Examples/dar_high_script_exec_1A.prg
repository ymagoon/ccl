;The below program obtains the phone number of a given person.  The program
;causes high executions since it is being called too many times.  

drop program dar_high_script_exec_1A go
create program dar_high_script_exec_1A
/*
record request(
    1 person_id = f8
    1 phone_num = vc
)
*/
select into "nl:"
  from  phone ph
  where ph.parent_entity_name = "PERSON" 
    and ph.parent_entity_id   = request->person_id 
detail
    request->phone_num = trim(ph.phone_num)
  with maxqual(ph, 1)    
end go

