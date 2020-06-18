/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  ndsc_driver
 *
 *  Description:  Executed by the Discern Expert rule NDSC_SCRATCHPAD_WORKFLOW as well as the 
 *				  CareSelect Export Orders and CareSelect Export EMR Settings ops jobs. 
 *
 *				  This script dynamically passes the correct API endpoint and password to the  
 *				  correct NDSC script depending on the value passed in $param. The script reads 
 *                the correct password from /cerner/d_<domain>/api/careselect/dbinfo.dat
 *  ---------------------------------------------------------------------------------------------
 *  Author:     	Yitzhak Magoon
 *  Contact:    	yithak.magoon@avhospital.org
 *  Creation Date:  05/08/2020
 *
 *  Testing: execute ndsc_driver "RULE" go
 *			 execute ndsc_driver "ORDERS" go
 *			 execute ndsc_driver "EMR_SETTINGS" go
 *  ---------------------------------------------------------------------------------------------
 *  Mod#   Date      Author           Description & Requestor Information
 *  000    05/08/20  Yitzhak Magoon   Initial Release
 *
 *
 *  ---------------------------------------------------------------------------------------------
*/

drop program ndsc_driver go
create program ndsc_driver
 
prompt
	"param" = "999"
	, "loc" = ""
 
with param, loc
 
set path = build("/cerner/d_",cnvtlower(curdomain),"/api/careselect/dbinfo.dat")
call echo(path)
 
free define rtl
define rtl is path
 
declare username = vc
declare password = vc
 
if ($loc = "999")
  set filepath = ""
else
  set filepath = $loc ;used for debugging NDSC scripts
endif
 
;set API endpoint
if (curdomain = "p604")
  set ops_api_endpoint = "https://cerner-api.careselect.org/v5/"
  set rule_api_endpoint = "https://cerner-cdsapi.careselect.org/"
else
  set ops_api_endpoint = "https://cerner-testapi.careselect.org/v5/"
  set rule_api_endpoint = "https://cerner-test-cdsapi.careselect.org/"
endif
 
;call echo(build("ops_api_endpoint=",ops_api_endpoint))
;call echo(build("rule_api_endpoint=",rule_api_endpoint))
 
;call echorecord(eksdata,"eksdata_before",0)
 
;get username and password
;file is stored as domain|username|password
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
 
;call echo(build("username=",username))
;call echo(build("password=",password))
 
;execute the correct program depending on the calling location
if ($param = "ORDERS")
  execute ndsc_export_orders "MINE",ops_api_endpoint,username,password,value(2517),"0","0",3,0
elseif ($param = "EMR_SETTINGS")
  execute ndsc_export_emr_settings "MINE",ops_api_endpoint,username,password,value(2517),0,0,0
elseif ($param = "RULE")
  ;create ndsc session
  execute ndsc_create_session "MINE", rule_api_endpoint,username,password,filepath
 
  ;find template with alias 'url' and set the @MISC parameter to the rule_api_endpoint
  ;this is needed because this information is passed into the action template when calling CareSelect
  set num = 0
  set sz = size(eksdata->tqual[3].qual,5)
  set pos = locateval(num,1,sz,"url",trim(eksdata->tqual[3].qual[num].template_alias,3))
 
  set eksdata->tqual[3].qual[pos].cnt = 1
  set stat = alterlist(eksdata->tqual[3].qual[pos].data,1)
  set eksdata->tqual[3].qual[pos].data.misc = rule_api_endpoint
 
;  if (filepath != "")
;    call echorecord(eksdata, "eksdata_cust2.dat")
;  endif
endif
 
end
go
 
;execute ndsc_driver "RULE" go
