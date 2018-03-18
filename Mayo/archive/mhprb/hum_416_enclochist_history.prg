/*******************************************
  13 May 2011 mrhine
  1.  original select commented out. Modified the new select per adriana and cathy
  2.  used transaction_dt_tm instead of updt_dt_tm because it is indexed.
  3.   Since you're going to re-run it anyway, Adriana has asked that ENCOUNTER_ID and PATIENT_ID
       not be included in the output.  We're using ENC_LOC_HISTORY.ENCTR_ID to joint on ENCOUNTERS.FIN and
       that works fine.  We use ENCOUNTER to obtain all PATIENTIDS.
 
       CATHY LEEFLANG
       Director, Database Operations
       T: 617 475 3887 C: 617 899-1555
 
  note: be sure to clean up the dm_info table with this
select *
 from dm_info dm
where  dm.info_domain="HUMEDICA"
   and dm.info_name = "humedica_enclochist"
go
 
delete from dm_info dm
where  dm.info_domain="HUMEDICA"
   and dm.info_name = "humedica_enclochist"
 go
commit go
 *****************************************************/
 
drop   program hum_enclochist_history:dba   go
create program hum_enclochist_history:dba
 
;*********************************************************************
;*** If PROD / CERT then run as 2nd oracle instance to improve
;*** efficiency. Will auto Fail-over to Instance 1 if Instance 2 down.
;*********************************************************************
IF(CURDOMAIN = "PROD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprbrpt'
ELSEIF(CURDOMAIN = "MHPRD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprbrpt'
ELSEIF(CURDOMAIN="MHCRT")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/java4t2@mhcrtrpt'
ENDIF ;CURDOMAIN
;************************************************************
 
free set testdt
set testdt = cnvtdatetime("01-JAN-2009 0000")
;set end_run_date = cnvtdatetime("01-JAN-2012 0000")
set end_run_date = cnvtdatetime("01-JAN-2012 0000")
set run_date = cnvtdatetime(curdate,curtime3)
 
declare domain_info_name = vc
set domain_info_name = trim("humedica_enclochist")
declare month = vc
 
while (testdt < cnvtdatetime(end_run_date))
 
	if(testdt >= end_run_date) go to exit_program endif
 
   free set dtfnd
   set dtfnd = "N"
   declare mnth = vc
   declare yr = vc
   declare edt = vc
   declare startdt = f8
   declare enddt = f8
   declare nxtmnth = f8
 
   select into "nl:"
   dm.updt_dt_tm
   from dm_info dm
   where dm.info_domain = "HUMEDICA"
     and dm.info_name   = domain_info_name
   detail
    dtfnd = "Y"
    startdt = dm.updt_dt_tm
;	enddt = datetimefind(cnvtdatetime(startdt),"M", "E","E")
	enddt = cnvtdatetime(cnvtdate(startdt),235959)
    month = format(startdt,"MMM;;d")
	nxtmnth = cnvtdatetime(cnvtdate(enddt)+1,0)
    mnth = format(nxtmnth,"MMM;;d")
    yr = format(nxtmnth,"YYYY;;d")
    edt = concat("01-",mnth,"-",yr," 0000")
   with nocounter
 
   if (dtfnd = "N")
	set startdt = cnvtdatetime(testdt)
;	set enddt = datetimefind(cnvtdatetime(startdt),"M", "E","E")
	set enddt = cnvtdatetime(cnvtdate(startdt)+1,235959)
    set month = format(startdt,"MMM;;d")
	set nxtmnth = cnvtdatetime(cnvtdate(enddt),0)
    set mnth = format(nxtmnth,"MMM;;d")
    set yr = format(nxtmnth,"YYYY;;d")
    set edt = concat("01-",mnth,"-",yr," 0000")
      insert into dm_info dm
      set	dm.info_domain="HUMEDICA",
      		dm.info_name = domain_info_name,
			dm.updt_dt_tm = cnvtdatetime(nxtmnth)	;cnvtdatetime(enddt)
      with nocounter
      commit
   endif
 
   call echo(build("start_date = ",format(startdt,"mm/dd/yyyy hh:mm;;d")))
   call echo(build("end_date = ",format(enddt,"mm/dd/yyyy hh:mm;;d")))
 
   free set today
   declare today = f8
   declare edt = vc
   declare ydt = vc
   declare month = vc
   set today = cnvtdatetime(curdate,curtime3)
   set edt = format(today,"yyyymmdd;;d")
   set dirdt = format(startdt,"yyyymmdd;;d")
   set ydt = format(startdt,"yyyy;;d")
   set month = format(startdt,"mmm;;d")
   set beg_dt = startdt
   call echo(build("beg_dt = ",beg_dt))
   set end_dt = enddt
   call echo(build("end_dt = ",end_dt))
 
	set print_file = concat("hum_enclochist_history_",dirdt,".dat")
	set hold_file = concat("/cerner/d_mhprd/ccluserdir/",print_file)
 
free set elh
record elh
(
  1 out_line                          = vc
  1 out_file                          = vc
  1 qual[*]
  2 ENCNTR_LOC_HIST_ID               = VC
  2 ENCNTR_ID                        = VC
  2 LOCATION_CD                      = VC
  2 UPDT_CNT                         = VC
  2 UPDT_DT_TM                       = VC
  2 UPDT_ID                          = VC
  2 ACTIVE_IND                       = VC
  2 ACTIVE_STATUS_CD                 = VC
  2 ACTIVE_STATUS_DT_TM              = VC
  2 ACTIVE_STATUS_PRSNL_ID           = VC
  2 BEG_EFFECTIVE_DT_TM              = VC
  2 END_EFFECTIVE_DT_TM              = VC
  2 LOCATION_STATUS_CD               = VC
  2 ARRIVE_DT_TM                     = VC
  2 ARRIVE_PRSNL_ID                  = VC
  2 DEPART_DT_TM                     = VC
  2 DEPART_PRSNL_ID                  = VC
  2 TRANSFER_REASON_CD               = VC
  2 LOCATION_TEMP_IND                = VC
  2 CHART_COMMENT_IND                = VC
  2 COMMENT_TEXT                     = VC
  2 LOC_FACILITY_CD                  = VC
  2 LOC_BUILDING_CD                  = VC
  2 LOC_NURSE_UNIT_CD                = VC
  2 LOC_ROOM_CD                      = VC
  2 LOC_BED_CD                       = VC
  2 ENCNTR_TYPE_CD                   = VC
  2 MED_SERVICE_CD                   = VC
  2 TRANSACTION_DT_TM                = VC
  2 ALT_LVL_CARE_CD                  = VC
  2 ACTIVITY_DT_TM                   = VC
  2 PROGRAM_SERVICE_CD               = VC
  2 SPECIALTY_UNIT_CD                = VC
  2 ACCOMMODATION_REASON_CD          = VC
  2 ACCOMMODATION_REQUEST_CD         = VC
  2 ALC_DECOMP_DT_TM                 = VC
  2 ADMIT_TYPE_CD                    = VC
  2 ALT_LVL_CARE_DT_TM               = VC
  2 ISOLATION_CD                     = VC
  2 PLACEMENT_AUTH_PRSNL_ID          = VC
  2 SERVICE_CATEGORY_CD              = VC
  2 PM_HIST_TRACKING_ID              = VC
  2 ACCOMMODATION_CD                 = VC
  2 TRACKING_BIT                     = VC
  2 CHANGE_BIT                       = VC
  2 ENCNTR_TYPE_CLASS_CD             = VC
  2 SECURITY_ACCESS_CD               = VC
  2 ORGANIZATION_ID                  = VC
  2 ALC_REASON_CD                    = VC
 
)
 
 
   call echo(build("start_date = ",format(startdt,"mm/dd/yyyy hh:mm;;d")))
   call echo(build("end_date = ",format(enddt,"mm/dd/yyyy hh:mm;;d")))
 
call echo("------------- write to array --------------")
 
 
select into value(print_file)
ENCNTR_LOC_HIST_ID               = cnvtstring(elh.encntr_loc_hist_id)
,ENCNTR_ID                        = cnvtstring(elh.encntr_id)
,LOCATION_CD                      = cnvtstring(elh.location_cd)
,UPDT_CNT                         = cnvtstring(elh.updt_cnt)
,UPDT_DT_TM                       = format(elh.updt_dt_tm,"yyyyMMddhhmmss;;d")
,UPDT_ID                          = cnvtstring(elh.updt_id)
,ACTIVE_IND                       = cnvtstring(elh.active_ind)
,ACTIVE_STATUS_CD                 = cnvtstring(elh.active_status_cd)
,ACTIVE_STATUS_DT_TM              = format(elh.active_status_dt_tm,"yyyyMMddhhmmss;;d")
,ACTIVE_STATUS_PRSNL_ID           = cnvtstring(elh.active_status_prsnl_id)
,BEG_EFFECTIVE_DT_TM              = format(elh.beg_effective_dt_tm,"yyyyMMddhhmmss;;d")
,END_EFFECTIVE_DT_TM              = format(elh.end_effective_dt_tm,"yyyyMMddhhmmss;;d")
,LOCATION_STATUS_CD               = cnvtstring(elh.location_status_cd)
,ARRIVE_DT_TM                     = format(elh.arrive_dt_tm,"yyyyMMddhhmmss;;d")
,ARRIVE_PRSNL_ID                  = cnvtstring(elh.arrive_prsnl_id)
,DEPART_DT_TM                     = format(elh.depart_dt_tm,"yyyyMMddhhmmss;;d")
,DEPART_PRSNL_ID                  = cnvtstring(elh.depart_prsnl_id)
,TRANSFER_REASON_CD               = cnvtstring(elh.transfer_reason_cd)
,LOCATION_TEMP_IND                = cnvtstring(elh.location_temp_ind)
,CHART_COMMENT_IND                = cnvtstring(elh.chart_comment_ind)
,COMMENT_TEXT                     = trim(elh.comment_text,3)
,LOC_FACILITY_CD                  = cnvtstring(elh.loc_facility_cd)
,LOC_BUILDING_CD                  = cnvtstring(elh.loc_building_cd)
,LOC_NURSE_UNIT_CD                = cnvtstring(elh.loc_nurse_unit_cd)
,LOC_ROOM_CD                      = cnvtstring(elh.loc_room_cd)
,LOC_BED_CD                       = cnvtstring(elh.loc_bed_cd)
,ENCNTR_TYPE_CD                   = cnvtstring(elh.encntr_type_cd)
,MED_SERVICE_CD                   = cnvtstring(elh.med_service_cd)
,TRANSACTION_DT_TM                = format(elh.transaction_dt_tm,"yyyyMMddhhmmss;;d")
,ALT_LVL_CARE_CD                  = cnvtstring(elh.alt_lvl_care_cd)
,ACTIVITY_DT_TM                   = format(elh.activity_dt_tm,"yyyyMMddhhmmss;;d")
,PROGRAM_SERVICE_CD               = cnvtstring(elh.program_service_cd)
,SPECIALTY_UNIT_CD                = cnvtstring(elh.specialty_unit_cd)
,ACCOMMODATION_REASON_CD          = cnvtstring(elh.accommodation_reason_cd)
,ACCOMMODATION_REQUEST_CD         = cnvtstring(elh.accommodation_request_cd)
,ALC_DECOMP_DT_TM                 = format(elh.alc_decomp_dt_tm,"yyyyMMddhhmmss;;d")
,ADMIT_TYPE_CD                    = cnvtstring(elh.admit_type_cd)
,ALT_LVL_CARE_DT_TM               = format(elh.alt_lvl_care_dt_tm,"yyyyMMddhhmmss;;d")
,ISOLATION_CD                     = cnvtstring(elh.isolation_cd)
,PLACEMENT_AUTH_PRSNL_ID          = cnvtstring(elh.placement_auth_prsnl_id)
,SERVICE_CATEGORY_CD              = cnvtstring(elh.service_category_cd)
,PM_HIST_TRACKING_ID              = cnvtstring(elh.pm_hist_tracking_id)
,ACCOMMODATION_CD                 = cnvtstring(elh.accommodation_cd)
,tracking_bit                     = cnvtstring(elh.tracking_bit)
,change_bit                       = cnvtstring(elh.change_bit)
,ENCNTR_TYPE_CLASS_CD             = cnvtstring(elh.encntr_type_class_cd)
,SECURITY_ACCESS_CD               = cnvtstring(elh.security_access_cd)
,ORGANIZATION_ID                  = cnvtstring(elh.organization_id)
,ALC_REASON_CD                    = cnvtstring(elh.alc_reason_cd)
 
from
  encntr_loc_hist elh,
  encounter e
 
plan elh where elh.transaction_dt_tm between cnvtdatetime(beg_dt) and cnvtdatetime(end_dt)
	and elh.loc_facility_cd > 0
join e where e.encntr_id = elh.encntr_id
	and e.active_ind = 1
	and e.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
order by elh.encntr_loc_hist_id
head report
    head_line     =     build(
"ENCNTR_LOC_HIST_ID||",
"ENCNTR_ID||",
"LOCATION_CD||",
"UPDT_CNT||",
"UPDT_DT_TM||",
"UPDT_ID||",
"ACTIVE_IND||",
"ACTIVE_STATUS_CD||",
"ACTIVE_STATUS_DT_TM||",
"ACTIVE_STATUS_PRSNL_ID||",
"BEG_EFFECTIVE_DT_TM||",
"END_EFFECTIVE_DT_TM||",
"LOCATION_STATUS_CD||",
"ARRIVE_DT_TM||",
"ARRIVE_PRSNL_ID||",
"DEPART_DT_TM||",
"DEPART_PRSNL_ID||",
"TRANSFER_REASON_CD||",
"LOCATION_TEMP_IND||",
"CHART_COMMENT_IND||",
"COMMENT_TEXT||",
"LOC_FACILITY_CD||",
"LOC_BUILDING_CD||",
"LOC_NURSE_UNIT_CD||",
"LOC_ROOM_CD||",
"LOC_BED_CD||",
"ENCNTR_TYPE_CD||",
"MED_SERVICE_CD||",
"TRANSACTION_DT_TM||",
"ALT_LVL_CARE_CD||",
"ACTIVITY_DT_TM||",
"PROGRAM_SERVICE_CD||",
"SPECIALTY_UNIT_CD||",
"ACCOMMODATION_REASON_CD||",
"ACCOMMODATION_REQUEST_CD||",
"ALC_DECOMP_DT_TM||",
"ADMIT_TYPE_CD||",
"ALT_LVL_CARE_DT_TM||",
"ISOLATION_CD||",
"PLACEMENT_AUTH_PRSNL_ID||",
"SERVICE_CATEGORY_CD||",
"PM_HIST_TRACKING_ID||",
"ACCOMMODATION_CD||",
"TRACKING_BIT||",
"CHANGE_BIT||",
"ENCNTR_TYPE_CLASS_CD||",
"SECURITY_ACCESS_CD||",
"ORGANIZATION_ID||",
"ALC_REASON_CD||")
 
    col 0, head_line
    row + 1
 
head elh.encntr_loc_hist_id
    detail_line     =     build(
ENCNTR_LOC_HIST_ID               , '||',
ENCNTR_ID                        , '||',
LOCATION_CD                      , '||',
UPDT_CNT                         , '||',
UPDT_DT_TM                       , '||',
UPDT_ID                          , '||',
ACTIVE_IND                       , '||',
ACTIVE_STATUS_CD                 , '||',
ACTIVE_STATUS_DT_TM              , '||',
ACTIVE_STATUS_PRSNL_ID           , '||',
BEG_EFFECTIVE_DT_TM              , '||',
END_EFFECTIVE_DT_TM              , '||',
LOCATION_STATUS_CD               , '||',
ARRIVE_DT_TM                     , '||',
ARRIVE_PRSNL_ID                  , '||',
DEPART_DT_TM                     , '||',
DEPART_PRSNL_ID                  , '||',
TRANSFER_REASON_CD               , '||',
LOCATION_TEMP_IND                , '||',
CHART_COMMENT_IND                , '||',
COMMENT_TEXT                     , '||',
LOC_FACILITY_CD                  , '||',
LOC_BUILDING_CD                  , '||',
LOC_NURSE_UNIT_CD                , '||',
LOC_ROOM_CD                      , '||',
LOC_BED_CD                       , '||',
ENCNTR_TYPE_CD                   , '||',
MED_SERVICE_CD                   , '||',
TRANSACTION_DT_TM                , '||',
ALT_LVL_CARE_CD                  , '||',
ACTIVITY_DT_TM                   , '||',
PROGRAM_SERVICE_CD               , '||',
SPECIALTY_UNIT_CD                , '||',
ACCOMMODATION_REASON_CD          , '||',
ACCOMMODATION_REQUEST_CD         , '||',
ALC_DECOMP_DT_TM                 , '||',
ADMIT_TYPE_CD                    , '||',
ALT_LVL_CARE_DT_TM               , '||',
ISOLATION_CD                     , '||',
PLACEMENT_AUTH_PRSNL_ID          , '||',
SERVICE_CATEGORY_CD              , '||',
PM_HIST_TRACKING_ID              , '||',
ACCOMMODATION_CD                 , '||',
TRACKING_BIT                     , '||',
CHANGE_BIT                       , '||',
ENCNTR_TYPE_CLASS_CD             , '||',
SECURITY_ACCESS_CD               , '||',
ORGANIZATION_ID                  , '||',
ALC_REASON_CD                    , '|'
)
 
    col 0, detail_line
    row + 1
 
detail
	abc = 0
 
with ; formfeed = none,
     maxrow = 1,
     nocounter,
     maxcol = 8000,
     format = variable,
     append
 
 
   if (dtfnd = "Y")
      set dtfnd = "N"
      update into dm_info dm
      set dm.updt_dt_tm = cnvtdatetime(nxtmnth)
      where dm.info_domain="HUMEDICA"
      and dm.info_name = domain_info_name
 
      with nocounter
      commit
   endif
   set testdt = nxtmnth
 
declare dir_date = vc
set dir_date = trim(concat(format(run_date,"yyyy;;d"),format(run_date,"mm;;d")))
declare newdir = vc
declare LEN = i4
declare DCLCOM = vc
 
set newdir = concat("/humedica/mhprd/data/cerner")
set DCLCOM = concat("mkdir ",newdir)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir = concat("/humedica/mhprd/data/cerner/historical")
set DCLCOM = concat("mkdir ",newdir)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir = concat("/humedica/mhprd/data/cerner/historical/",dir_date)
set DCLCOM = concat("mkdir ",newdir)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
free set outfile
set outfile = concat("H416989_T",dirdt,"_E",edt,"_enclochist.txt")
free set base
set base = concat(trim(newdir),"/")
 
free set newfile
declare newfile = vc
set newfile = concat(base,outfile)
set DCLCOM = concat("mv ",trim(hold_file)," ",newfile)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set DCLCOM = concat("gzip -9 ",newfile)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
endwhile
 
#exit_program
 
;****** After report put back to instance 1
IF(CURDOMAIN = "PROD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprb1'
ELSEIF(CURDOMAIN = "MHPRD")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/fullmoon@mhprb1'
ELSEIF(CURDOMAIN="MHCRT")
  FREE DEFINE oraclesystem
  DEFINE oraclesystem 'v500/java4t2@mhcrt1'
ENDIF ;CURDOMAIN
;******************************************
 
end
go
