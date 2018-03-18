;    *******************************************************************************************************
;    *Mod Date     Engineer      CAB #  Comment                                                            *
;    *--- -------- ------------ ------- ------------------------------------------------------------------ *
;                                                                                                          *
;    *000 09/19/13 m063907	 	51333   Made copy of 1_mhs_lab_alias_result_in set prompt for LOINC        *
;~DE~*******************************************************************************************************
 
drop program 1_mhs_lab_alias_result_out:dba go
create program 1_mhs_lab_alias_result_out:dba
 
 
prompt
	"Output to File/Printer/MINE" = "MINE"            ;* Enter or select the printer or file name to send this report to.
	, "Contributor Source (Mulitple Selection)" = 0
 
with OUTDEV, cont_source;, CONT_SOURCE
 
 
set maxsecs = 300
 
SELECT INTO VALUE($outdev)
	;Event_Set_Lvl_1 = uar_get_code_display(ves.event_set_cd)
	 Event_Set_Lvl_0 = uar_get_code_display(ve.event_set_cd)
	 ,Event_cd = v.event_cd
	, Event_Code = uar_get_code_display(v.event_cd)
	 ;Result_Display = c.display
	, Outbound_Alias = cv.alias
	, Contributor_Source = uar_get_code_display( cv.contributor_source_cd )
	, event_cd_beg_effective_date = c.begin_effective_dt_tm
 
FROM
	code_value c
	, code_value_outbound   cv
	, v500_event_code v
	, v500_event_set_explode ve
	;, v500_event_set_explode ves
 
plan cv where cv.code_set = 72 				;results
and cv.contributor_source_cd =  ($cont_source)
 
 
join c  where c.code_value = cv.code_value
and c.active_ind = 1
 
join v where v.event_cd = c.code_value
 
join ve where ve.event_cd = v.event_cd
and VE.EVENT_SET_LEVEL in (0)
 
;JOIN VES WHERE VES.EVENT_CD = v.EVENT_CD
;AND VES.EVENT_SET_LEVEL IN (1)
 
 
ORDER BY
	;Event_Set_Lvl_1
	;,
	Event_Set_Lvl_0
	,Event_Code
	;Result_Display
	,outbound_Alias
	, Contributor_Source
 
WITH nocounter, separator=" ", format, time= value( maxsecs )
 
end
go
