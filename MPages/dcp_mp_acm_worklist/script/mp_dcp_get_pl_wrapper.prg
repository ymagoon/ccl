drop program mp_dcp_get_pl_wrapper:dba go
create program mp_dcp_get_pl_wrapper:dba
 
PROMPT "Output to File/Printer/MINE" ="MINE" ,
"JSON_ARGS:" = ""
WITH  OUTDEV , JSON_ARGS

%i cclsource:mp_dcp_blob_in_params.inc
set stat = cnvtjsontorec(ExtractParamsFromRequest(request, $JSON_ARGS))

free record reply
record reply
(
	1 patients[*]
		2 person_id = f8
		2 rank = i4
		2 last_action_dt_tm = dq8
		2 last_action_desc = vc
		2 name_full_formatted = vc
		2 name_last_key = vc
		2 name_first_key = vc
		2 name_middle_key = vc
		2 birth_dt_tm = vc
		2 birth_date = dq8
		2 birth_tz = i4
		2 deceased_dt_tm = vc
		2 sex_cd = f8
		2 sex_disp = vc
		2 races[*]
			3 race_cd = f8
		2 marital_type_cd = f8
		2 language_cd = f8
		2 language_dialect_cd = f8
		2 confid_level_cd = f8
		2 mrn = vc
	1 patient_list_id = f8
%i cclsource:status_block.inc
)
 
;call echorecord(listrequest)
 
execute mp_dcp_get_patient_list
 
;Output the reply to OUTDEV so that XMLCCLRequest can be used to call this script
set _MEMORY_REPLY_STRING = CNVTRECTOJSON(reply)
 
end go
