declare json = vc go

/* demographics(Age, Sex, Language, Race), case_manager, encounter types, health plan type */

set json = '{"listrequest":{"patient_list_id":16666837.0,"patient_id":0.0,"pos_cd":2192727847.0,\
"arguments":[{"ARGUMENT_NAME":"AGEGREATER","ARGUMENT_VALUE":"30","PARENT_ENTITY_ID":0.0,"PARENT_ENTITY_NAME":"",\
"CHILD_ARGUMENTS":[]},{"ARGUMENT_NAME":"AGEYEARS","ARGUMENT_VALUE":"30","PARENT_ENTITY_ID":0.0,\
"PARENT_ENTITY_NAME":"","CHILD_ARGUMENTS":[]},{"ARGUMENT_NAME":"CONDITION_OPERATOR",\
"ARGUMENT_VALUE":"OR","PARENT_ENTITY_ID":0.0,"PARENT_ENTITY_NAME":"","CHILD_ARGUMENTS":[]},\
{"ARGUMENT_NAME":"ENCOUNTERTYPE","ARGUMENT_VALUE":"inpatient label for system","PARENT_ENTITY_ID":1.0,\
"PARENT_ENTITY_NAME":"","CHILD_ARGUMENTS":[]},{"ARGUMENT_NAME":"ACMPRSNLGROUPS",\
"ARGUMENT_VALUE":"ACM Group 2","PARENT_ENTITY_ID":20414366.0,"PARENT_ENTITY_NAME":"PRSNL_GROUP","CHILD_ARGUMENTS":[]},\
{"ARGUMENT_NAME":"PPRCODES","ARGUMENT_VALUE":"Birth Physician","PARENT_ENTITY_ID":1109.0,\
"PARENT_ENTITY_NAME":"CODE_VALUE","CHILD_ARGUMENTS":[]},{"ARGUMENT_NAME":"GENDER","ARGUMENT_VALUE":"Female",\
"PARENT_ENTITY_ID":362.0,"PARENT_ENTITY_NAME":"CODE_VALUE","CHILD_ARGUMENTS":[]},\
{"ARGUMENT_NAME":"LANGUAGE","ARGUMENT_VALUE":"Dutch","PARENT_ENTITY_ID":312738.0,\
"PARENT_ENTITY_NAME":"CODE_VALUE","CHILD_ARGUMENTS":[]},{"ARGUMENT_NAME":"RACE",\
"ARGUMENT_VALUE":"African","PARENT_ENTITY_ID":2209198128.0,"PARENT_ENTITY_NAME":"CODE_VALUE",\
"CHILD_ARGUMENTS":[]},{"ARGUMENT_NAME":"CASEMANAGER","ARGUMENT_VALUE":"Andy Plumb,",\
"PARENT_ENTITY_ID":32015586.0,"PARENT_ENTITY_NAME":"Andy%20Plumb%2C","CHILD_ARGUMENTS":[]},\
{"ARGUMENT_NAME":"HEALTHPLAN","ARGUMENT_VALUE":"Ins_Plan_T_719","PARENT_ENTITY_ID":83170005.0,\
"PARENT_ENTITY_NAME":"CODE_VALUE","CHILD_ARGUMENTS":[]}],"delta_identifier":1}}' go

execute mp_dcp_get_patient_delta "MINE", json go

