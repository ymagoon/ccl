declare json = vc go
 
 
set json = 
 
'{"list_request":{"patient_list_id":14336524.0,"groups":[{"group_name":"ACM Group 1",\
"group_id":20355774.0},{"group_name":"lots of patients group","group_id":53047473.0}], "locations":[]}}' go
 


;'{"list_request":{"patient_list_id":17964947.0,"groups":[],"locations":[{"location_cd":2858561805.0},{"location_cd":\
;2861425283.0}]}}' go

;'{"list_request":{"patient_list_id":17965183.0,"groups":[], "locations":[]}}' go

 
execute mp_dcp_load_static_list "MINE", json go
 

