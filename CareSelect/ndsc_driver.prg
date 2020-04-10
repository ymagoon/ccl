drop program ndsc_driver go
create program ndsc_driver

prompt 
	"param" = "" 

with param

free define rtl
define rtl is "dbinfo.dat"

declare username = vc
declare password = vc

;set API endpoint
if (curdomain = "p604")
  set ops_api_endpoint = ""
  set rule_api_endpoint = ""
else
  set ops_api_endpoint = "https://cerner-testapi.careselect.org/v5/"
  set rule_api_endpoint = "https://cerner-test-cdsapi.careselect.org/"
endif

call echo(build("ops_api_endpoint=",ops_api_endpoint))
call echo(build("rule_api_endpoint=",rule_api_endpoint))

;file is stored as domain|username|password

;get username and password
select distinct into "nl:"
  line = trim(substring(1,60,r.line))
from rtlt r
plan r
 
detail
  if (curdomain = "p604")
    if (piece(line,"|",1,"NF") = "prod")
      username = piece(line,"|",2,"NF")
      password = piece(line,"|",3,"NF")
    endif
  else
    if (piece(line,"|",1,"NF") = "nonprod")
      username = piece(line,"|",2,"NF")
      password = piece(line,"|",3,"NF")
    endif
  endif
with counter

call echo(build("username=",username))
call echo(build("password=",password))

;execute the correct program depending on the calling location
if ($param = "ORDERS")
  execute ndsc_export_orders "MINE",ops_api_endpoint,username,password,value(2517),"0","0",3,0
elseif ($param = "EMR_SETTINGS")
  execute ndsc_export_emr_settings "MINE",ops_api_endpoint,username,password,value(2517),0,0,0
elseif ($param = "RULE")
  set log_misc1 = rule_api_endpoint
  execute ndsc_create_session "MINE", rule_api_endpoint,username,password,""
endif

end
go

execute ndsc_driver "RULE" go
