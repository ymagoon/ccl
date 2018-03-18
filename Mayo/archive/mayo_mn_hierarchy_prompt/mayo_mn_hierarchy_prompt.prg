drop program mayo_mn_hierarchy_prompt:dba go
create program mayo_mn_hierarchy_prompt:dba

prompt 
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Region" = ""
	, "Site" = ""
	, "Facility" = 0
	, "Nurse Unit" = 0 

with OUTDEV, region, site, facility, nur_unit

 
select into "nl:"
d.seq
from
(dummyt d with seq = 1) 
with nocounter
end go 
