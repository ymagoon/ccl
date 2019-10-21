drop program mp_int_out_rec_prefs:dba go
create program mp_int_out_rec_prefs:dba

prompt
	"Output to File/Printer/MINE" = "MINE" ,
	"Position Code:" = 0.00
 
with OUTDEV, POSITION_CD

%i cclsource:mp_pie_get_prefs.inc

declare CATEGORY_MEAN          = vc with constant("MP_INT_OUT_REC"), private
declare APPLICATION_NUMBER     = i4 with constant(600005), private
declare DEFAULT_LOGICAL_DOMAIN = f8 with constant(0.0), private

record pref_maint(
    1 pvc_names[2]
        2 pvc_name = vc
) with protect

set pref_maint->pvc_names[1]->pvc_name = "CW_LOCATION"
set pref_maint->pvc_names[2]->pvc_name = "CW_ENABLE_NOTIF"
 
if(GetBedrockPrefs(CATEGORY_MEAN, $POSITION_CD, DEFAULT_LOGICAL_DOMAIN) = FAIL)
    go to exit_script
endif

if(GetPrefMaintPrefs(APPLICATION_NUMBER, pref_maint) = FAIL)
    go to exit_script
endif

for(counter = 1 to size(prefs_reply->prefs, 5))
 	if(prefs_reply->prefs[counter].pref_key = "DEFAULT_TAB_CD")
 		set prefs_reply->prefs[counter].pref_type = "VALUE_STRING"
 		set prefs_reply->prefs[counter].pref_values[1].value_string = 
 			UAR_GET_CODE_MEANING(prefs_reply->prefs[counter].pref_values[1].value_number)
		go to set_memory_reply_string
	endif
endfor
 
#set_memory_reply_string

set _memory_reply_string = cnvtrectojson(prefs_reply)
 
call echorecord(prefs_reply)
 
#exit_script
end
go
