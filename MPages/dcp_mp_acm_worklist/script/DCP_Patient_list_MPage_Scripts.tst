;Create new list
/*declare json = vc go
set json = '{"LISTREQUEST":{"patient_list_id":0.0,"name":"Test List 1","description":"","patient_list_type_cd":2177315703.0,"\
owner_prsnl_id":18811197.0,"arguments":[{"argument_name":"ACMPRSNLGROUPS","argument_value":"","parent_entity_id":20705740.0,"\
parent_entity_name":"PRSNL_GROUP"}{"argument_name":"PPRCODES","argument_value":"","parent_entity_id":1115.0,"parent_entity_name\
":"PERSON_PRSNL_RELTN"}{"argument_name":"GENDER","argument_value":"","parent_entity_id":363.0,"parent_entity_name":"CODE_VALUE"}{"argument_name":"AGEMIN","argument_value":"18","parent_entity_id":0.0,"parent_entity_name":""}]}}' go

execute mp_dcp_upd_patient_list "MINE", json go
*/

; Update existing list
declare json = vc go
set json = '{"LISTREQUEST":{"patient_list_id":4386056.0,"name":"Test List 1","description":"","patient_list_type_cd":2177315703.0,"\
owner_prsnl_id":18811197.0,"arguments":[{"argument_name":"ACMPRSNLGROUPS","argument_value":"","parent_entity_id":20523635.0,"\
parent_entity_name":"PRSNL_GROUP"}{"argument_name":"PPRCODES","argument_value":"","parent_entity_id":1115.0,"parent_entity_name\
":"PERSON_PRSNL_RELTN"}{"argument_name":"GENDER","argument_value":"","parent_entity_id":363.0,"parent_entity_name":"CODE_VALUE"}{"argument_name":"AGEMIN","argument_value":"18","parent_entity_id":0.0,"parent_entity_name":""}]}}' go

execute mp_dcp_upd_patient_list "MINE", json go
/*

free record request go
record request
(
	1 owner_prsnl_id = f8
) go

set request->owner_prsnl_id = 18811197.0 go

mp_dcp_retrieve_patient_lists go*/
