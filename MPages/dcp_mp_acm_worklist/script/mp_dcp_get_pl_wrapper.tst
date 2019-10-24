declare json = vc go
 /*
set json = '{"LISTREQUEST":{"user_id":390395010.0,"pos_cd":2192727847,"query_type_cd":2177315703,"search_indicator":1,"\
load_demographics":1,"arguments":[{"ARGUMENT_NAME":"ACMPRSNLGROUPS","ARGUMENT_VALUE":"ACM Group 1","PARENT_ENTITY_ID":20355774.0\
,"PARENT_ENTITY_NAME":"PARAMETER"},{"ARGUMENT_NAME":"PPRCODES","ARGUMENT_VALUE":"Primary Care Physician","PARENT_ENTITY_ID":1115.\
0,"PARENT_ENTITY_NAME":"PARAMETER"},{"ARGUMENT_NAME":"REGISTRY","ARGUMENT_VALUE":"Aetna","PARENT_ENTITY_ID":10024746,"\
PARENT_ENTITY_NAME":"CODE_VALUE"},{"ARGUMENT_NAME":"REGISTRY","ARGUMENT_VALUE":"Custom Registry 1","PARENT_ENTITY_ID":10024747,"\
 PARENT_ENTITY_NAME":"CODE_VALUE"}]}}' go
 
 
execute mp_dcp_get_pl_wrapper "MINE", json go
*/
/*
execute mp_dcp_get_pl_wrapper ^MINE^,^{"LISTREQUEST":{"user_id":51274229,"pos_cd":2192727847,"query_type_cd":2177315703,"\
search_indicator":1,"load_demographics":1,"arguments":[{"ARGUMENT_NAME":"ACMPRSNLGROUPS","ARGUMENT_VALUE":"Meg's RWL Group","\
PARENT_ENTITY_ID":34439666.0,"PARENT_ENTITY_NAME":"PARAMETER"},{"ARGUMENT_NAME":"PPRCODES","ARGUMENT_VALUE":"Primary Care \
Physician","PARENT_ENTITY_ID":1115.0,"PARENT_ENTITY_NAME":"PARAMETER"},{"ARGUMENT_NAME":"ENCOUNTERTYPE","ARGUMENT_VALUE":"Emg","\
PARENT_ENTITY_ID":4.0,"PARENT_ENTITY_NAME":"CODE_VALUE"}]}}^ go
 */
 /*
set json = '{"list_request":{"patient_list_id":5406073.0 }}' go
 
 
 
execute mp_dcp_load_static_list "MINE", json go
 
*/
 
set json =
 /*
'{"listrequest":{"user_id":51274229.0,"pos_cd":2192727847.0,"search_indicator":1,"load_demographics":0,"arguments":[\
{"ARGUMENT_NAME":"ACMPRSNLGROUPS","ARGUMENT_VALUE":"MK4602 - RWL","PARENT_ENTITY_ID":42615699.0,"PARENT_ENTITY_NAME":"PARAMETER\
","CHILD_ARGUMENTS":[{"ARGUMENT_VALUE":"Shen, Jenny","PARENT_ENTITY_NAME":"PRSNL","PARENT_ENTITY_ID":18663690.0},{"ARGUMENT_VALUE\
":"Kasaei  Bond, , KB, ,","PARENT_ENTITY_NAME":"PRSNL","PARENT_ENTITY_ID":55772222.0},{"ARGUMENT_VALUE":"Mancuso, Paul","\
PARENT_ENTITY_NAME":"PRSNL","PARENT_ENTITY_ID":19491429.0},{"ARGUMENT_VALUE":"Devendra  Bond, , DB, ,","PARENT_ENTITY_NAME":"\
PRSNL","PARENT_ENTITY_ID":55772276.0}]},\
{"ARGUMENT_NAME":"ACMPRSNLGROUPS","ARGUMENT_VALUE":"DK RWL G1","PARENT_ENTITY_ID":44485670.0,"PARENT_ENTITY_NAME":"PARAMETER","\
CHILD_ARGUMENTS":[{"ARGUMENT_VALUE":"Jessica  Bond, , JB, ,","PARENT_ENTITY_NAME":"\
PRSNL","PARENT_ENTITY_ID":62646425.0},{"ARGUMENT_VALUE":"Ryan  Bond, , RB, ,","PARENT_ENTITY_NAME":"PRSNL","PARENT_ENTITY_ID":\
55772252.0},{"ARGUMENT_VALUE":"Meagan  Bond, , MB, ,","PARENT_ENTITY_NAME":"PRSNL","PARENT_ENTITY_ID":55772236.0},{"\
ARGUMENT_VALUE":"Slack, Ryan","PARENT_ENTITY_NAME":"PRSNL","PARENT_ENTITY_ID":19304672.0},{"ARGUMENT_VALUE":"Devendra  Kalia, , \
DK, ,","PARENT_ENTITY_NAME":"PRSNL","PARENT_ENTITY_ID":51450692.0},{"ARGUMENT_VALUE":"Awnipsc, Aeslwsv Y, UD","PARENT_ENTITY_NAME\
":"PRSNL","PARENT_ENTITY_ID":600080.0},{"ARGUMENT_VALUE":"Smith, Mark L","PARENT_ENTITY_NAME":"PRSNL","PARENT_ENTITY_ID":18665743\
.0},{"ARGUMENT_VALUE":"GGXbuukvhez Wnew Nzvvfbbd, .","PARENT_ENTITY_NAME":"PRSNL","PARENT_ENTITY_ID":609226.0},{"ARGUMENT_VALUE\
":"Mancuso, Paul","PARENT_ENTITY_NAME":"PRSNL","PARENT_ENTITY_ID":19491429.0},{"ARGUMENT_VALUE":"Kasaei  Bond, , KB, ,","\
PARENT_ENTITY_NAME":"PRSNL","PARENT_ENTITY_ID":55772222.0},{"ARGUMENT_VALUE":"Kayla  Bond, , KB, ,","PARENT_ENTITY_NAME":"PRSNL\
","PARENT_ENTITY_ID":55772218.0},{"ARGUMENT_VALUE":"Kasaei, Mark","PARENT_ENTITY_NAME":"PRSNL","PARENT_ENTITY_ID":18669541.0},{"\
ARGUMENT_VALUE":"Shen, Jenny","PARENT_ENTITY_NAME":"PRSNL","PARENT_ENTITY_ID":18663690.0},{"ARGUMENT_VALUE":"Devendra  Bond, , DB\
, ,","PARENT_ENTITY_NAME":"PRSNL","PARENT_ENTITY_ID":55772276.0}]},\
{"ARGUMENT_NAME":"AGELESS","ARGUMENT_VALUE":"63","\
PARENT_ENTITY_ID":0.0,"PARENT_ENTITY_NAME":""},{"ARGUMENT_NAME":"PPRCODES","ARGUMENT_VALUE":"Birth Physician","PARENT_ENTITY_ID":\
1109.0,"PARENT_ENTITY_NAME":"PARAMETER","CHILD_ARGUMENTS":[]},{"ARGUMENT_NAME":"PPRCODES","ARGUMENT_VALUE":"Care Coordinator","\
PARENT_ENTITY_ID":6185567.0,"PARENT_ENTITY_NAME":"PARAMETER","CHILD_ARGUMENTS":[]},{"ARGUMENT_NAME":"PPRCODES","ARGUMENT_VALUE":"\
Primary Care Physician","PARENT_ENTITY_ID":1115.0,"PARENT_ENTITY_NAME":"PARAMETER","CHILD_ARGUMENTS":[]},{"ARGUMENT_NAME":"GENDER\
","ARGUMENT_VALUE":"Female","PARENT_ENTITY_ID":362.0,"PARENT_ENTITY_NAME":"CODE_VALUE","CHILD_ARGUMENTS":[]},{"ARGUMENT_NAME":"\
GENDER","ARGUMENT_VALUE":"Male","PARENT_ENTITY_ID":363.0,"PARENT_ENTITY_NAME":"CODE_VALUE","CHILD_ARGUMENTS":[]},{"ARGUMENT_NAME\
":"GENDER","ARGUMENT_VALUE":"Unknown","PARENT_ENTITY_ID":364.0,"PARENT_ENTITY_NAME":"CODE_VALUE","CHILD_ARGUMENTS":[]},{"\
ARGUMENT_NAME":"LANGUAGE","ARGUMENT_VALUE":"English","PARENT_ENTITY_ID":151.0,"PARENT_ENTITY_NAME":"CODE_VALUE","CHILD_ARGUMENTS\
":[]},{"ARGUMENT_NAME":"LANGUAGE","ARGUMENT_VALUE":"French","PARENT_ENTITY_ID":312735.0,"PARENT_ENTITY_NAME":"CODE_VALUE","\
CHILD_ARGUMENTS":[]},{"ARGUMENT_NAME":"LANGUAGE","ARGUMENT_VALUE":"Spanish","PARENT_ENTITY_ID":312741.0,"PARENT_ENTITY_NAME":"\
CODE_VALUE","CHILD_ARGUMENTS":[]},{"ARGUMENT_NAME":"RACE","ARGUMENT_VALUE":"African-American/Black","PARENT_ENTITY_ID":309315.0,"\
PARENT_ENTITY_NAME":"CODE_VALUE","CHILD_ARGUMENTS":[]},{"ARGUMENT_NAME":"RACE","ARGUMENT_VALUE":"Caucasian/White","\
PARENT_ENTITY_ID":309316.0,"PARENT_ENTITY_NAME":"CODE_VALUE","CHILD_ARGUMENTS":[]},{"ARGUMENT_NAME":"RACE","ARGUMENT_VALUE":"\
Native American","PARENT_ENTITY_ID":309318.0,"PARENT_ENTITY_NAME":"CODE_VALUE","CHILD_ARGUMENTS":[]},{"ARGUMENT_NAME":"\
CASEMANAGER","ARGUMENT_VALUE":"Devendra Bond, , DB, ,","PARENT_ENTITY_ID":55772276.0,"PARENT_ENTITY_NAME":"PRSNL_ID"},{"\
ARGUMENT_NAME":"CASEMANAGER","ARGUMENT_VALUE":"Isaac Bond, , IB, ,","PARENT_ENTITY_ID":55772290.0,"PARENT_ENTITY_NAME":"PRSNL_ID\
"},{"ARGUMENT_NAME":"CASEMANAGER","ARGUMENT_VALUE":"Jim Bond","PARENT_ENTITY_ID":51274229.0,"PARENT_ENTITY_NAME":"PRSNL_ID"},{"\
ARGUMENT_NAME":"FINANCIALCLASS","ARGUMENT_VALUE":"BLUECROSS","PARENT_ENTITY_ID":85584508.0,"PARENT_ENTITY_NAME":"CODE_VALUE","\
CHILD_ARGUMENTS":[]},{"ARGUMENT_NAME":"FINANCIALCLASS","ARGUMENT_VALUE":"Medicare","PARENT_ENTITY_ID":634776.0,"\
PARENT_ENTITY_NAME":"CODE_VALUE","CHILD_ARGUMENTS":[]},{"ARGUMENT_NAME":"FINANCIALCLASS","ARGUMENT_VALUE":"Other","\
PARENT_ENTITY_ID":634779.0,"PARENT_ENTITY_NAME":"CODE_VALUE","CHILD_ARGUMENTS":[]},{"ARGUMENT_NAME":"HEALTHPLAN","ARGUMENT_VALUE\
":"Blue Cross","PARENT_ENTITY_ID":2520032839.0,"PARENT_ENTITY_NAME":"CODE_VALUE","CHILD_ARGUMENTS":[]},{"ARGUMENT_NAME":"\
HEALTHPLAN","ARGUMENT_VALUE":"Medicare","PARENT_ENTITY_ID":15089133.0,"PARENT_ENTITY_NAME":"CODE_VALUE","CHILD_ARGUMENTS":[]}]}}'
go
 
*/

'{"listrequest":{"user_id":51274229.0,"pos_cd":2192727847.0,"search_indicator":1,"load_demographics":0,"arguments":[\
{"ARGUMENT_NAME":"ACMPRSNLGROUPS","ARGUMENT_VALUE":"MK4602 - RWL","PARENT_ENTITY_ID":42615699.0,"PARENT_ENTITY_NAME":"PARAMETER\
","CHILD_ARGUMENTS":[{"ARGUMENT_VALUE":"Shen, Jenny","PARENT_ENTITY_NAME":"PRSNL","PARENT_ENTITY_ID":18663690.0},{"ARGUMENT_VALUE\
":"Kasaei  Bond, , KB, ,","PARENT_ENTITY_NAME":"PRSNL","PARENT_ENTITY_ID":55772222.0},{"ARGUMENT_VALUE":"Mancuso, Paul","\
PARENT_ENTITY_NAME":"PRSNL","PARENT_ENTITY_ID":19491429.0},{"ARGUMENT_VALUE":"Devendra  Bond, , DB, ,","PARENT_ENTITY_NAME":"\
PRSNL","PARENT_ENTITY_ID":55772276.0}]},\
{"ARGUMENT_NAME":"AGELESS","ARGUMENT_VALUE":"63","\
PARENT_ENTITY_ID":0.0,"PARENT_ENTITY_NAME":""},{"ARGUMENT_NAME":"PPRCODES","ARGUMENT_VALUE":"Birth Physician","PARENT_ENTITY_ID":\
1109.0,"PARENT_ENTITY_NAME":"PARAMETER","CHILD_ARGUMENTS":[]},{"ARGUMENT_NAME":"PPRCODES","ARGUMENT_VALUE":"Care Coordinator","\
PARENT_ENTITY_ID":6185567.0,"PARENT_ENTITY_NAME":"PARAMETER","CHILD_ARGUMENTS":[]},{"ARGUMENT_NAME":"PPRCODES","ARGUMENT_VALUE":"\
Primary Care Physician","PARENT_ENTITY_ID":1115.0,"PARENT_ENTITY_NAME":"PARAMETER","CHILD_ARGUMENTS":[]}]}}' 
go
 
 /*
 ;Filtering
'{"LISTREQUEST":{"user_id":51274229.0,"pos_cd":2192727847.0,"search_indicator":0,"load_demographics":0,"arguments":[{"\
ARGUMENT_NAME":"RECOMMSTATUS","ARGUMENT_VALUE":"DUE","PARENT_ENTITY_ID":2.0,"PARENT_ENTITY_NAME":"RECOMMSTATUS"},{"ARGUMENT_NAME\
":"RECOMMSTATUS","ARGUMENT_VALUE":"NEARDUE","PARENT_ENTITY_ID":1.0,"PARENT_ENTITY_NAME":"RECOMMSTATUS"},{"ARGUMENT_NAME":"\
RECOMMSTATUS","ARGUMENT_VALUE":"NOTDUE","PARENT_ENTITY_ID":4.0,"PARENT_ENTITY_NAME":"RECOMMSTATUS"},{"ARGUMENT_NAME":"\
RECOMMSTATUS","ARGUMENT_VALUE":"OVERDUE","PARENT_ENTITY_ID":3.0,"PARENT_ENTITY_NAME":"RECOMMSTATUS"},{"ARGUMENT_NAME":"\
EXPECTATIONS","ARGUMENT_VALUE":"Adult Influenza","PARENT_ENTITY_ID":175071081.0,"PARENT_ENTITY_NAME":"HM_EXPECT"}],"patients":[{"\
person_id":18665867.0},{"person_id":18750784.0}]}}' go
 */
 
 
execute mp_dcp_get_pl_wrapper "MINE", json go
