drop program mp_dcp_retrieve_demog_info:dba go
create program mp_dcp_retrieve_demog_info:dba

prompt 
	"Output to File/Printer/MINE" = "MINE",
	"JSON_ARGS" = ""
with OUTDEV, JSON_ARGS

declare args = vc with protect, constant($JSON_ARGS)

record demog_request
(
	1 patients[*]
		2 person_id = f8
)

set jrec = cnvtjsontorec(args)

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
		2 home_phone = vc
		2 home_ext = vc
		2 mobile_phone = vc
		2 mobile_ext = vc
		2 work_phone = vc
		2 work_ext = vc
		2 contact_method_cd = f8
%i cclsource:status_block.inc
)

execute mp_dcp_get_demographics with replace("REQUEST", "DEMOG_REQUEST")
set reply->status_data->status = "S"

call echorecord(reply)
set _Memory_Reply_String = cnvtrectojson(reply)

end
go

