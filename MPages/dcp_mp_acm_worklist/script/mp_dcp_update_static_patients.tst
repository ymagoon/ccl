declare json = vc go

set json = '{"patient_request":{"patient_list_id":5406073.0,"person_id":45142166.0 ,"rank":1,"action_desc":"\
update rank"}}' go
 
 
 
execute mp_dcp_update_static_patients "MINE", json go
