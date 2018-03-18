drop program hum2_wrap_person:dba go
create program hum2_wrap_person:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Number of Days:" = 1
	, "Historical or Daily" = "D"
	, "Enter Start Date" = "CURDATE"
 
with OUTDEV, NUMDAYS, HD, SSTARTDATE
 
;hum2_wrap_person "MINE", 1, "D", "16-JAN-2013" go
 
;Declare Local Variables
DECLARE sVersion = VC
SET sVersion = "v2"
DECLARE Wrapper_Type = VC
SET Wrapper_Type = "DATA"
DECLARE domain_info_name = VC
SET domain_info_name = "HUMEDICA_PERSON"
declare run_cnt = i4
declare endloop = i4
set endloop = cnvtint(value($NUMDAYS))
declare bdate = dq8
declare edate = dq8
declare sdateparameter = vc
declare sdatePass = vc
if ($sStartDate = "CURDATE")
	set sdateparameter = format(cnvtdatetime(curdate-1,0), "dd-mmm-yyyy;;d")
else
	set sdateparameter = $sStartDate
endif
set prog_file = cnvtlower(trim(curprog))
 
;Set Global Variables
Execute hum2_localize "WRAPPER_TOP", curprog
 
;Ensure History Date Tracking is Available
IF ($HD = "H")
      delete from dm_info dm
      where dm.info_domain="HUMEDICA"
      	 and dm.info_name = domain_info_name
      with nocounter
      commit
 
      insert into dm_info dm
      set	dm.info_domain="HUMEDICA",
      		dm.info_name = domain_info_name,
		dm.updt_dt_tm = cnvtdatetime("01-JAN-1900")
      with nocounter
      commit
ENDIF
 
;Run extracts for number of specified days
for(run_cnt = 1 to endloop)
 
  ;Set Date
  set sdatepass = Trim(FORMAT(datetimeadd(cnvtdatetime(sdateparameter),run_cnt-1),"DD-MMM-YYYY ;;D"),3)
  set bdate = cnvtdatetime(concat(sdatepass,' 00:00:00'))
  set edate = cnvtdatetime(concat(sdatepass,' 23:59:59'))
  set bdate_dt_tm_dsp = format(cnvtdatetime(bdate),'mm-dd-yyyy hh:mm:ss;;d')
  set edate_dt_tm_dsp = format(cnvtdatetime(edate),'mm-dd-yyyy hh:mm:ss;;d')
 
   IF ($HD = "H")
   ;Update DM_Info tracker row for History only
	update into dm_info dm
   		set dm.updt_dt_tm = cnvtdatetime(bdate)
   		where dm.info_domain = "HUMEDICA"
   		and dm.info_name = domain_info_name
   		with nocounter
   	commit
   ENDIF
 
  ;Execute Scripts
  execute hum2_person
  execute hum2_person_prsnl_reltn
  execute hum2_person_alias
  execute hum2_prsnl_org_reltn
  execute hum2_address
  execute hum2_person_person_reltn
  execute hum2_phone
  execute hum2_person_combine
  execute hum2_pathway_catalog
 
  IF ($HD = "H")
  ;Update DM_Info tracker row for History only
	update into dm_info dm
   		set dm.updt_dt_tm = cnvtdatetime(edate)
   		where dm.info_domain = "HUMEDICA"
   		and dm.info_name = domain_info_name
   		with nocounter
   	commit
  ENDIF
 
endfor
 
Execute hum2_localize "WRAPPER_BOTTOM", curprog
 
end
go
 
 
