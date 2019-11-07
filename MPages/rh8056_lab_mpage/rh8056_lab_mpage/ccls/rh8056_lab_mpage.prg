drop program rh8056_lab_mpage:dba go
create program rh8056_lab_mpage:dba
 
;************************************************** 
;******************* Change Log *******************

prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Person Id:" = 0
	, "Encounter Id:" = 0
 
with outdev, personid, encntrid

record record_data(
	1 qual[*]
		2 person_id = f8
		2 name_full_formatted = vc
%i cclsource:status_block.inc
)

select into "nl:"
	from
		person p
	plan p where p.name_last_key = "HOYT"
	head report
	 x = 0
	detail
	 x = x + 1
	 stat = alterlist(record_data->qual,x)
	 record_data->qual[x].person_id = p.person_id
	 record_data->qual[x].name_full_formatted = p.name_full_formatted
with nocounter

set record_data->status_data->status = "S"
set _memory_reply_string = cnvtrectojson(record_data)

end go
