free set filter_request go
 
declare json = vc go
 
/*
record request
(
	1 user_id = f8
	1 pos_cd = f8
	1 query_type_cd = f8
	1 filter_list[*]
	  2 argument_name = vc
) go
*/

set json = '{"filter_request":{"user_id": 36483431.00,"pos_cd":2192727847.0,\
"query_type_cd":0.0,"filter_list":[{"argument_name":"ACMPRSNLGROUPS"},\
{"argument_name":"SINGLEPROVIDER"},{"argument_name":"PPRCODES"},{"argument_name":"GENDER"},\
{"argument_name":"LANGUAGE"},{"argument_name":"RACE"},{"argument_name":"FINANCIALCLASS"},\
{"argument_name":"HEALTHPLAN"},{"argument_name":"RISK"},{"argument_name":"ENCOUNTERTYPE"},\
{"argument_name":"APPTSTATUS"},{"argument_name":"CONDITION"},{"argument_name":"ORDERSTATUS"},\
{"argument_name":"ORDERSSTATUS"},{"argument_name":"EXPECTATIONS"},{"argument_name":"REGISTRY"},\
{"argument_name":"AGE"},{"argument_name":"CASEMANAGER"},{"argument_name":"ADMISSION"},\
{"argument_name":"RANKING"},{"argument_name":"QUALIFYING"},{"argument_name":"CASESTATUS"},\
{"argument_name":"LOCATIONS"}]}}' go

execute dcp_acm_retrieve_filter_values "MINE", json go
