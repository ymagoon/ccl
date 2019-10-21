declare json = vc go
 
 
set json = '{"listrequest":{"patients":[],"\
arguments":[{"argument_name":"ACMPRSNLGROUPS","argument_value":"","parent_entity_id":28161634.0,"\
parent_entity_name":"PRSNL_GROUP"}\
{"argument_name":"PPRCODES","argument_value":"","parent_entity_id":1115.0,"parent_entity_name\
":"PERSON_PRSNL_RELTN"}],\
"search_indicator":1,"load_demographics":1}}'go

execute mp_dcp_get_pl_wrapper "MINE", json go

declare json = vc go

;one condition
set json = '{"listrequest":{"patients":[{"person_id":33942821.0},{"person_id":44838195.0}],\
"arguments":[{"argument_name":"CONDITION","argument_value":"DIABETES","parent_entity_id":0.0,\
"parent_entity_name":"","child_arguments":[]},\
{"argument_name":"CONDITION","argument_value":"HeartDisease","parent_entity_id":0.0,\
"parent_entity_name":"","child_arguments":[]}],"search_indicator":0,"load_demographics":1}}' go


;two conditions, pt *95 has both, *04 has both with diabetes from registry
set json = '{"listrequest":{"patients":[{"person_id":33942821.0},{"person_id":44838195.0}\
,{"person_id":18829504.0},{"person_id":18833726.00}],\
"arguments":[{"argument_name":"CONDITION","argument_value":"","parent_entity_id":10024749.00,\
"parent_entity_name":"","child_arguments":[{"argument_value":"DIABETES"}]},\
{"argument_name":"CONDITION","argument_value":"","parent_entity_id":10024752.00,\
"parent_entity_name":"","child_arguments":[{"argument_value":"HeartDisease"}]},\
{"argument_name":"CONDITION_OPERATOR","argument_value":"AND","parent_entity_id":0.0,\
"parent_entity_name":"","child_arguments":[]}]\
"search_indicator":0,"load_demographics":1}}' go

;person 3496271 has BUN of 6, 5, and 3 on Jan 2009.
set json = '{"listrequest":{"patients":[{"person_id":33942821.0},{"person_id":3496271.0}],\
"arguments":[{"argument_name":"RESULT1_EVENTSET","argument_value":"BUN Arterial","parent_entity_id":0.0,\
"parent_entity_name":"","child_arguments":[]}\
],"search_indicator":0,"load_demographics":1}}' go



;person 31417133.0 has ordered acetaminophen-butalbital
set json = '{"listrequest":{"patients":[{"person_id":18847666.0},{"person_id":31417133.0}],\
"arguments":[{"argument_name":"MED1_DRUGNAME","argument_value":"Acarbose","parent_entity_id":63.0,\
"parent_entity_name":"","child_arguments":[]},{"argument_name":"MED1_STATUS",\
"argument_value":"ORDERED","parent_entity_id":0.0,"parent_entity_name":"","child_arguments":[]},\
{"argument_name":"MED1_OPERATOR","argument_value":"AND","parent_entity_id":63.0,\
"parent_entity_name":"","child_arguments":[]},\
{"argument_name":"MED2_DRUGCLASSID","argument_value":"Acarbose","parent_entity_id":63.0,\
"parent_entity_name":"","child_arguments":[]},{"argument_name":"MED2_STATUS",\
"argument_value":"DISCONTINUED","parent_entity_id":0.0,"parent_entity_name":"","child_arguments":[]}\
],"search_indicator":0,"load_demographics":1}}' go

 
95 has Bilirubin Total and Albumin Level
set json = '{"listrequest":{"patients":[{"person_id":33942821.0},{"person_id":44838195.0}],\
"arguments":[{"argument_name":"RESULT1_EVENTSET","argument_value":"Bilirubin Total","parent_entity_id":0.0,\
"parent_entity_name":"","child_arguments":[]}{"argument_name":"RESULT1_GROUP",\
"argument_value":"Labs","parent_entity_id":0.0,"parent_entity_name":"","child_arguments":[]}\
{"argument_name":"RESULT1_OPERATOR","argument_value":"AND","parent_entity_id":0.0,\
"parent_entity_name":"","child_arguments":[]}\
{"argument_name":"RESULT2_EVENTSET","argument_value":"Albumin Level","parent_entity_id":0.0,\
"parent_entity_name":"","child_arguments":[]}{"argument_name":"RESULT2_GROUP",\
"argument_value":"Labs","parent_entity_id":0.0,"parent_entity_name":"","child_arguments":[]}\
]"search_indicator":0,"load_demographics":1}}' go

;test that patients with pending work with both pending actions/todos and pending phone calls are returned
set json = '{"LISTREQUEST":{"user_id":81748718.0,"pos_cd":2192727847.0,"search_indicator":0,"load_demographics":0,"arguments":[{"\
ARGUMENT_NAME":"PENDING_WORK","ARGUMENT_MEANING":"PENDING_ACTIONS","PARENT_ENTITY_ID":0.0,"PARENT_ENTITY_NAME":"CODE_VALUE","\
PARENT_FILTER_NAME":"PENDING_WORK"},{"ARGUMENT_NAME":"PENDING_WORK","ARGUMENT_MEANING":"PENDING_PHONE_CALLS","PARENT_ENTITY_ID":0.0\
,"PARENT_ENTITY_NAME":"CODE_VALUE","PARENT_FILTER_NAME":"PENDING_WORK"}],"search_arguments":[],"patient_list_name":"","patients\
":[{"person_id":29339028.0},{"person_id":2726933.0},{"person_id":31769758.0},{"person_id":20885700.0},{"person_id":32530895.0},{"\
person_id":19055568.0},{"person_id":79784447.0},{"person_id":28954217.0},{"person_id":86527660.0},{"person_id":89203247.0},{"\
person_id":34764391.0},{"person_id":30974718.0},{"person_id":31169456.0},{"person_id":31927507.0},{"person_id":5104083.0},{"\
person_id":30855745.0},{"person_id":26828507.0},{"person_id":74234248.0},{"person_id":40807476.0},{"person_id":28953724.0},{"\
person_id":40774118.0},{"person_id":37994031.0},{"person_id":19505991.0},{"person_id":11284997.0},{"person_id":31769760.0},{"\
person_id":86451644.0},{"person_id":80934475.0},{"person_id":28453431.0},{"person_id":22575148.0},{"person_id":22523100.0},{"\
person_id":22574881.0},{"person_id":26017404.0},{"person_id":88815728.0},{"person_id":19055563.0},{"person_id":39837456.0},{"\
person_id":39837430.0},{"person_id":32083225.0},{"person_id":36443476.0},{"person_id":75610586.0},{"person_id":76256712.0},{"\
person_id":85047713.0},{"person_id":43693975.0},{"person_id":59092216.0},{"person_id":53036153.0},{"person_id":18839557.0},{"\
person_id":41093795.0},{"person_id":50036132.0},{"person_id":18853659.0}]}}'
go



execute mp_dcp_get_pl_wrapperNT "MINE", json go


Tested: 
One result qual, other does not
One of 2 names qual
greater Yes, No
equal yes, no
less yes, no
to yes, no
from yes, no
between yes, no
back days yes, no
at least yes, no
less yes, no




FIN: 634775.00
Plan type: 2520032839.00

WB TESTED:
{"argument_name":"PPRCODES","argument_value":"","parent_entity_id":1115.0,"parent_entity_name\
":"PERSON_PRSNL_RELTN"}\
{"argument_name":"FINANCIALCLASS","argument_value":"","parent_entity_id":634776.00,"parent_entity_name":""}\
{"argument_name":"HEALTHPLAN","argument_value":"","parent_entity_id":2520032839.00,"parent_entity_name":""}\
{"argument_name":"CONDITION","argument_value":"DIABETES","parent_entity_id":0,"parent_entity_name":""}\
{"argument_name":"GENDER","argument_value":"","parent_entity_id":363.0,"parent_entity_name":"CODE_VALUE"}\
{"argument_name":"AGEEQUAL","argument_value":"33","parent_entity_id":0,"parent_entity_name":""}\
{"argument_name":"AGELESS","argument_value":"33","parent_entity_id":0,"parent_entity_name":""}\
{"argument_name":"AGEGREATER","argument_value":"33","parent_entity_id":0,"parent_entity_name":""}
{"argument_name":"AGEFROM","argument_value":"33","parent_entity_id":0,"parent_entity_name":""}
{"argument_name":"AGETO","argument_value":"34","parent_entity_id":0,"parent_entity_name":""}
{"argument_name":"LANGUAGE","argument_value":"","parent_entity_id":151.0,"parent_entity_name":"CODE_VALUE"};eng 2 qual
{"argument_name":"RACE","argument_value":"","parent_entity_id":309316.0,"parent_entity_name":"CODE_VALUE"};white 1149 qual
{"argument_name":"LABVALEQUAL","argument_value":"55","parent_entity_id":0.0,"parent_entity_name":"HDL Cholesterol"}\
{"argument_name":"LABBACKDAYS","argument_value":"2","parent_entity_id":0.0,"parent_entity_name":"HDL Cholesterol"}\
{"argument_name":"LABCOUNTATLEAST","argument_value":"2","parent_entity_id":0.0,"parent_entity_name":"HDL Cholesterol"}
{"argument_name":"LABCOUNTLESS","argument_value":"1","parent_entity_id":0.0,"parent_entity_name":"HDL Cholesterol"}
{"argument_name":"LABVALLESS","argument_value":"55","parent_entity_id":0.0,"parent_entity_name":"HDL Cholesterol"}
{"argument_name":"LABVALFROM","argument_value":"54","parent_entity_id":0.0,"parent_entity_name":"HDL Cholesterol"}
{"argument_name":"LABVALTO","argument_value":"54","parent_entity_id":0.0,"parent_entity_name":"HDL Cholesterol"}
{"argument_name":"MEDSTATUS","argument_value":"ORDERED","parent_entity_id":63.0,"parent_entity_name":""}
{"argument_name":"MEDSTATUS","argument_value":"ORDERED","parent_entity_id":0.0,"parent_entity_name":"acetaminophen-butalbital"}
{"argument_name":"MEDSTATUS","argument_value":"CANCELED","parent_entity_id":0.0,"parent_entity_name":"acetaminophen-butalbital"}
test multiple status for same med
{"argument_name":"MEDSTATUS","argument_value":"ORDERED","parent_entity_id":0.0,"parent_entity_name":"Acarbose"}\
{"argument_name":"MEDBACKDAYS","argument_value":"1","parent_entity_id":0.0,"parent_entity_name":"Acarbose"}



;group with high BP
arguments":[{"argument_name":"ACMPRSNLGROUPS","argument_value":"","parent_entity_id":28161634.0,"\
parent_entity_name":"PRSNL_GROUP"}\
{"argument_name":"PPRCODES","argument_value":"","parent_entity_id":5114764.0,"parent_entity_name\
":"PERSON_PRSNL_RELTN"}



Cole Compass has HDL of 55 charted 10JUL2012.
Equals 55: Finds
Equals 56: Not found
Equals 55 back 3 days: found
Equals 55 back 1 days: not found
Equals 55 over last 2 at least 1: found
Equals 55 over last 2 at least 2: not found
Equals 55 over last 2 days less than 2 results: 1781 qualify
Equals 55 over last 2 days less than 1 results (NOT used): 1780 qualify
Greater than 54: found
Greater than 55: not found
Less than 56: found
Less than 55: not found
Greater or equal 55: found
Greater or equal than 56: not found
Less than or equal 55: found
Less than or equal 54: not found
Between 54 and 56: found
reverse order sent (above condition): found
Between 56 and 58: not found
Between 50 and 54: not found

Event code is 13458513.00 for HDL Cholesterol
Event code is  for Systolic Blood Pressure 

Cole Compass has an order for Acetaminophen-butalbital charted (a analgesic combinations (class id 63))



for 1800 patients
----------------------------
Gender HE(>1/2): 18sec
Diabetes HE (2): 36sec
Gender&Diabetes HE (2): 44sec
Load Demographics all: 5sec
Financial Plan (166): 3 sec
Plan Type & Fin (166): 3 sec


Has >< X results or the most recent result
of type ________
in the last __ days
>,== a value of ___



Here are the lab arguments I came up with for now. I’ll see how they perform.
All lab arguments should have the parent_entity_name populated with the event_set_name of the lab being queried. 

The argument_name string is in caps. A description of the argument_value follows.
LABVALEQUAL – The exact value to search for.
LABVALGREATER – Look for any value greater than the one provided
LABVALLESS – Look for any value lower than the one provided

LABVALFROM – Look for values equal or greater than the one provided. Stop at TO value if provided.
LABVALTO – Look for values equal or less than the one provided. Stop at FROM value if provided.

LABBACKDAYS - The number of days to look back for results.
LABCOUNTATLEAST - The minimum number of results that must be found matching the criteria.
LABCOUNTLESS – Less than the given number of results must be found. Use 1 to return patients that don’t have any such a result charted.

Example:
Returns patients with at least 2 HDL results less than 40 over the last year.
{"argument_name":"LABVALLESS","argument_value":"40","parent_entity_id":0.0,"parent_entity_name":"HDL Cholesterol"}
{"argument_name":"LABBACKDAYS","argument_value":"365","parent_entity_id":0.0,"parent_entity_name":"HDL Cholesterol"}
{"argument_name":"LABCOUNTATLEAST","argument_value":"2","parent_entity_id":0.00,"parent_entity_name":"HDL Cholesterol"}



select * from prsnl_group_reltn pgr, person p
where pgr.prsnl_group_id = 28161634.0
and pgr.person_id = p.person_id go


prsnl:
MSCCZFWHES 
589846.00 



select * from v500_event_code where event_set_name = "Systolic Blood Pressure" go 
18418831.00




free record reply go
record reply
 (  1 PERSON_PRSNL_RELTN_QUAL      =    I4
    1 PERSON_PRSNL_RELTN[*]        =    I4
      2 PERSON_PRSNL_RELTN_ID      =    F8
    1 status_data
     2 status = c1
     2 subeventstatus[1]
      3 OperationName = c15
      3	OperationStatus = c1
      3 TargetObjectName = c15
      3 TargetObjectValue = vc
 ) go



free record request go
 record request
 ( 1 person_prsnl_reltn_qual = i4
   1 esi_ensure_type = c3
   1 person_prsnl_reltn [*]
    2 action_type = c3
     2 new_person = c1
    2 person_prsnl_reltn_id = f8
     2 person_id = f8
     2 person_prsnl_r_cd = f8
    2 prsnl_person_id = f8
     2 active_ind_ind = i2
    2 active_ind = i2
     2 active_status_cd = f8
     2 active_status_dt_tm = dq8
     2 active_status_prsnl_id = f8
     2 beg_effective_dt_tm = dq8
     2 end_effective_dt_tm = dq8
     2 data_status_cd = f8
     2 data_status_dt_tm = dq8
     2 data_status_prsnl_id = f8
     2 contributor_system_cd = f8
     2 free_text_cd = f8
     2 ft_prsnl_name = c100
     2 priority_seq = i4
     2 internal_seq = i4
     2 updt_cnt = i4
    2 manual_create_by_id = f8
     2 manual_inact_by_id = f8
     2 manual_create_dt_tm = dq8
     2 manual_inact_dt_tm = dq8
     2 manual_create_ind_ind = i2
     2 manual_create_ind = i2
     2 manual_inact_ind_ind = i2
     2 manual_inact_ind = i2
     2 notification_cd = f8
     2 transaction_dt_tm = dq8
     2 pm_hist_tracking_id = f8
     2 demog_reltn_id = f8
     2 person_prsnl_reltn_hist_id = f8 ;87331
   1 mode = i2 ;87331
 ) go


;free set add_persons go
;record add_persons
;(
;1 person_cnt = i4
;1 person_list[*]
; 2 person_id                 = f8
;) go

select * ;into "nl:" 
from clinical_event C
where C.event_cd = 18418831.00 
AND C.VALID_UNTIL_DT_TM >= cnvtdatetime("31-Dec-2100 0:0:0")
  AND C.VIEW_LEVEL = 1
order by c.person_id


head report
	request->person_prsnl_reltn_qual = 0

head c.person_id
	request->person_prsnl_reltn_qual = request->person_prsnl_reltn_qual + 1
	if (request->person_prsnl_reltn_qual > size(request->person_prsnl_reltn, 5))
		stat = alterlist(request->person_prsnl_reltn, request->person_prsnl_reltn_qual + 9)
	endif
	
	request->person_prsnl_reltn[request->person_prsnl_reltn_qual]->action_type = "ADD"
	request->person_prsnl_reltn[request->person_prsnl_reltn_qual]->person_prsnl_reltn_id = 0.0 
	request->person_prsnl_reltn[request->person_prsnl_reltn_qual]->person_id = c.person_id
	request->person_prsnl_reltn[request->person_prsnl_reltn_qual]->person_prsnl_r_cd = 5114764; nurse prac - life
	request->person_prsnl_reltn[request->person_prsnl_reltn_qual]->prsnl_person_id = 589846.00  ; MSCCZFWHES
	request->person_prsnl_reltn[request->person_prsnl_reltn_qual]->beg_effective_dt_tm = cnvtdatetime("23-Jan-2009 13:00:00")
	request->person_prsnl_reltn[request->person_prsnl_reltn_qual]->end_effective_dt_tm = cnvtdatetime("31-Dec-2100 23:59:59")
	request->person_prsnl_reltn[request->person_prsnl_reltn_qual]->internal_seq = 99999
	request->person_prsnl_reltn[request->person_prsnl_reltn_qual]->demog_reltn_id = 6686485.0
	request->person_prsnl_reltn[request->person_prsnl_reltn_qual]->person_prsnl_reltn_hist_id = 0.000000
	request->person_prsnl_reltn[request->person_prsnl_reltn_qual].person_id = c.person_id
	
	
foot report
	stat = alterlist(request->person_prsnl_reltn, request->person_prsnl_reltn_qual)
		
with nocounter go

set request->mode = 2 go

execute pm_ens_person_prsnl_reltn go




















;find health plans
select phr.person_id, hp.plan_type_cd, hp.financial_class_cd from
person_plan_reltn phr,
health_plan hp,
prsnl_group_reltn pgr,
person_prsnl_reltn ppr
where pgr.prsnl_group_id = 28161634.0
and ppr.prsnl_person_id = pgr.person_id
and ppr.person_prsnl_r_cd = 1115.0
and phr.person_id = ppr.person_id
and hp.health_plan_id = phr.health_plan_id
;optional test
and 
hp.active_ind = 1
and phr.active_ind = 1 and
		phr.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3) and
		phr.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
order by phr.person_id
