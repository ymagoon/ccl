drop program 1_univnm_shared_echo_ids go
create program 1_univnm_shared_echo_ids
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "User Id:" = 0
	, "Patient Id:" = 0
	, "Encounter Id:" = 0
 
with outdev, user_id, patient_id, encounter_id
 
 
declare resp = vc with protect, noconstant("")
declare full_name = vc with protect, noconstant("")

declare user_id = f8 with protect, noconstant(reqinfo -> updt_id)

Select
	cv.code_value
From
	code_value cv,
	prsnl p 
plan cv 
join p
where 
	p.position_cd = cv.code_value
	and cv.code_set= 88
	and cv.active_ind= 1
	and cv.display='DBA'
	and p.person_id = reqinfo -> updt_id
detail
	if (cnvtint($user_id) != 0)
	user_id = cnvtreal($user_id)
	endif 
	call echo ("got here")
with nocounter


select into "NL:"
	p.name_full_formatted
from prsnl p
where parser("p.person_id = user_id") 
detail
	full_name = substring(1, 20, p.name_full_formatted)
	with nocounter



set resp = "{"
set resp = concat(resp, ^"patient_id":"^,TRIM(cnvtstring($patient_id),3),^",^)
set resp = concat(resp, ^"person_id":"^,TRIM(cnvtstring($patient_id),3),^",^)
set resp = concat(resp, ^"user_id":"^,TRIM(cnvtstring(user_id),3),^",^)
set resp = concat(resp, ^"cur_node":"^,TRIM(CURNODE),^",^)
set resp = concat(resp, ^"cur_user":"^,TRIM(CURUSER),^",^)
set resp = concat(resp, ^"cur_server":"^,TRIM(cnvtstring(CURSERVER)),^",^)
set resp = concat(resp, ^"full_name":"^,TRIM(full_name),^",^)
set resp = concat(resp, ^"encounter_id":"^,TRIM(cnvtstring($encounter_id),3),^"^)
 
 
set resp = concat(resp, "}")


 
record putREQUEST (
  1 source_dir = vc
  1 source_filename = vc
  1 nbrlines = i4
  1 line [*]
	2 lineData = vc
  1 OverFlowPage [*]
	2 ofr_qual [*]
	  3 ofr_line = vc
  1 IsBlob = c1
  1 document_size = i4
  1 document = gvc
)
 
set putRequest->source_dir = $outdev
set putRequest->IsBlob = "1"
set putRequest->document = resp
set putRequest->document_size = size(putRequest->document)
 
execute eks_put_source with replace(Request,putRequest),replace(reply,putReply)

return (resp)

end
go