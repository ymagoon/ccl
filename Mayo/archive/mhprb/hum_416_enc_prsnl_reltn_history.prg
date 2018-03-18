/******************************************************
 
  note: be sure to clean up the dm_info table with this
select *
 from dm_info dm
where  dm.info_domain="HUMEDICA"
   and dm.info_name = "humedica_enc_prnsl_reltn"
go
 
delete from dm_info dm
where  dm.info_domain="HUMEDICA"
   and dm.info_name = "humedica_enc_prnsl_reltn"
 go
commit go
;002 04/12/12 kmcdaniel - rewritten for Mayo (416)
 *****************************************************/
drop program hum_enc_prsnl_reln_history:dba go
create program hum_enc_prsnl_reln_history:dba
 
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
;********************************************************
 
free set testdt
set testdt = cnvtdatetime("01-JAN-2010 0000")
set end_run_date = cnvtdatetime("01-JAN-2012 0000")
set run_date = cnvtdatetime(curdate,curtime3)
 
declare domain_info_name = vc
set domain_info_name = trim("humedica_enc_prnsl_reltn")
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
	enddt = cnvtdatetime(cnvtdate(startdt),235959) ;datetimefind(cnvtdatetime(startdt),"M", "E","E")
    month = format(startdt,"MMM;;d")
	nxtmnth = cnvtdatetime(cnvtdate(enddt)+1,0)
    mnth = format(nxtmnth,"MMM;;d")
    yr = format(nxtmnth,"YYYY;;d")
    edt = concat("01-",mnth,"-",yr," 0000")
   with nocounter
 
   if (dtfnd = "N")
	set startdt = cnvtdatetime(testdt)
	set enddt = cnvtdatetime(cnvtdate(startdt),235959) ;datetimefind(cnvtdatetime(startdt),"M", "E","E")
    set month = format(startdt,"MMM;;d")
	set nxtmnth = cnvtdatetime(cnvtdate(enddt)+1,0)
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
 
	set print_file = concat("hum_enc_prnsl_reltn_history_",dirdt,".dat")
	set hold_file = concat("/cerner/d_mhprd/ccluserdir/",print_file)
 
free record enc
record enc
(
1 out_line = vc
1 qual [*]
5 alias = vc
5 ENCNTR_PRSNL_RELTN_ID =vc
5 PRSNL_PERSON_ID       =vc
5 ENCNTR_PRSNL_R_CD     =vc
5 ENCNTR_ID             =vc
5 UPDT_CNT              =vc
5 UPDT_DT_TM            =vc
5 UPDT_ID               =vc
5 UPDT_TASK             =vc
5 UPDT_APPLCTX          =vc
5 ACTIVE_IND            =vc
5 ACTIVE_STATUS_CD      =vc
5 ACTIVE_STATUS_DT_TM   =vc
5 ACTIVE_STATUS_PRSNL_ID=vc
5 BEG_EFFECTIVE_DT_TM   =vc
5 END_EFFECTIVE_DT_TM   =vc
5 DATA_STATUS_CD        =vc
5 DATA_STATUS_DT_TM     =vc
5 DATA_STATUS_PRSNL_ID  =vc
5 CONTRIBUTOR_SYSTEM_CD =vc
5 FREE_TEXT_CD          =vc
5 FT_PRSNL_NAME         =vc
5 MANUAL_CREATE_IND     =vc
5 MANUAL_CREATE_BY_ID   =vc
5 MANUAL_CREATE_DT_TM   =vc
5 MANUAL_INACT_IND      =vc
5 MANUAL_INACT_BY_ID    =vc
5 MANUAL_INACT_DT_TM    =vc
5 PRIORITY_SEQ          =vc
5 INTERNAL_SEQ          =vc
5 EXPIRATION_IND        =vc
5 NOTIFICATION_CD       =vc
5 EXPIRE_DT_TM          =vc
5 TRANSACTION_DT_TM     =vc
5 ACTIVITY_DT_TM        =vc
5 ENCNTR_TYPE_CD        =vc)
 
 
call echo("get encntr_prsnl_reltns that qualify")
call echo("------------- write to array --------------")
 
 
select into value(print_file)
alias = trim(ea.alias,3)
,ENCNTR_PRSNL_RELTN_ID =cnvtstring(epr.encntr_prsnl_reltn_id)
,PRSNL_PERSON_ID       =cnvtstring(epr.prsnl_person_id)
,ENCNTR_PRSNL_R_CD     =cnvtstring(epr.encntr_prsnl_r_cd)
,ENCNTR_ID             =cnvtstring(enc.encntr_id)
,UPDT_CNT              =cnvtstring(epr.updt_cnt)
,UPDT_DT_TM            =format(epr.updt_dt_tm,"YYYYMMDDhhmmss;;d")
,UPDT_ID               =cnvtstring(epr.updt_id)
,UPDT_TASK             =cnvtstring(epr.updt_task)
,UPDT_APPLCTX          =cnvtstring(epr.updt_applctx)
,ACTIVE_IND            =cnvtstring(epr.active_ind)
,ACTIVE_STATUS_CD      =cnvtstring(epr.active_status_cd)
,ACTIVE_STATUS_DT_TM   =format(epr.active_status_dt_tm,"YYYYMMDDhhmmss;;d")
,ACTIVE_STATUS_PRSNL_ID=cnvtstring(epr.active_status_prsnl_id)
,BEG_EFFECTIVE_DT_TM   =format(epr.beg_effective_dt_tm,"YYYYMMDDhhmmss;;d")
,END_EFFECTIVE_DT_TM   =format(epr.end_effective_dt_tm,"YYYYMMDDhhmmss;;d")
,DATA_STATUS_CD        =cnvtstring(epr.data_status_cd)
,DATA_STATUS_DT_TM     =format(epr.data_status_dt_tm,"YYYYMMDDhhmmss;;d")
,DATA_STATUS_PRSNL_ID  =cnvtstring(epr.data_status_prsnl_id)
,CONTRIBUTOR_SYSTEM_CD =cnvtstring(epr.contributor_system_cd)
,FREE_TEXT_CD          =cnvtstring(epr.free_text_cd)
,FT_PRSNL_NAME         =trim(epr.ft_prsnl_name,3)
,MANUAL_CREATE_IND     =cnvtstring(epr.manual_create_ind)
,MANUAL_CREATE_BY_ID   =cnvtstring(epr.manual_create_by_id)
,MANUAL_CREATE_DT_TM   =format(epr.manual_create_dt_tm,"YYYYMMDDhhmmss;;d")
,MANUAL_INACT_IND      =cnvtstring(epr.manual_inact_ind)
,MANUAL_INACT_BY_ID    =cnvtstring(epr.manual_inact_by_id)
,MANUAL_INACT_DT_TM    =format(epr.manual_inact_dt_tm,"YYYYMMDDhhmmss;;d")
,PRIORITY_SEQ          =cnvtstring(epr.priority_seq)
,INTERNAL_SEQ          =cnvtstring(epr.internal_seq)
,EXPIRATION_IND        =cnvtstring(epr.expiration_ind)
,NOTIFICATION_CD       =cnvtstring(epr.notification_cd)
,EXPIRE_DT_TM     =format(epr.expire_dt_tm,"YYYYMMDDhhmmss;;d")
,TRANSACTION_DT_TM=format(epr.transaction_dt_tm,"YYYYMMDDhhmmss;;d")
,ACTIVITY_DT_TM   =format(epr.activity_dt_tm,"YYYYMMDDhhmmss;;d")
,ENCNTR_TYPE_CD   =cnvtstring(epr.encntr_type_cd)
 
from encntr_alias ea,
	(dummyt d1),
	encounter enc,
	encntr_prsnl_reltn epr
plan epr where epr.updt_dt_tm between cnvtdatetime(beg_dt) and cnvtdatetime(end_dt)
	and epr.active_ind = 1
join enc where epr.encntr_id = enc.encntr_id
	and enc.active_ind = 1
	and enc.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
join d1
join ea where ea.encntr_id = enc.encntr_id and
        ea.encntr_alias_type_cd = 1077 and
        ea.active_ind = 1 and
        ea.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
/*
from encntr_alias ea,
	encounter enc,
	encntr_prsnl_reltn epr,
	person p
plan enc
where enc.updt_dt_tm between cnvtdatetime(beg_dt) and cnvtdatetime(end_dt)
  and enc.active_ind+0 = 1
join p where p.person_id = enc.person_id
join epr where epr.encntr_id = enc.encntr_id
join ea where ea.encntr_id = outerjoin(enc.encntr_id) and
        ea.encntr_alias_type_cd = outerjoin(1077) and
        ea.active_ind = outerjoin(1) and
        ea.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
*/
order by enc.encntr_id, epr.encntr_prsnl_reltn_id
head report
head_line = build(
"ENCNTR_ID||",
"ENCNTR_PRSNL_RELTN_ID||",
"PRSNL_PERSON_ID||",
"ENCNTR_PRSNL_R_CD||",
"ENCNTR_ID_INTERNAL||",
"UPDT_CNT||",
"UPDT_DT_TM||",
"UPDT_ID||",
"UPDT_TASK||",
"UPDT_APPLCTX||",
"ACTIVE_IND||",
"ACTIVE_STATUS_CD||",
"ACTIVE_STATUS_DT_TM||",
"ACTIVE_STATUS_PRSNL_ID||",
"BEG_EFFECTIVE_DT_TM||",
"END_EFFECTIVE_DT_TM||",
"DATA_STATUS_CD||",
"DATA_STATUS_DT_TM||",
"DATA_STATUS_PRSNL_ID||",
"CONTRIBUTOR_SYSTEM_CD||",
"FREE_TEXT_CD||",
"FT_PRSNL_NAME||",
"MANUAL_CREATE_IND||",
"MANUAL_CREATE_BY_ID||",
"MANUAL_CREATE_DT_TM||",
"MANUAL_INACT_IND||",
"MANUAL_INACT_BY_ID||",
"MANUAL_INACT_DT_TM||",
"PRIORITY_SEQ||",
"INTERNAL_SEQ||",
"EXPIRATION_IND||",
"NOTIFICATION_CD||",
"EXPIRE_DT_TM||",
"TRANSACTION_DT_TM||",
"ACTIVITY_DT_TM||",
"ENCNTR_TYPE_CD|"
)
 
col 0 head_line
row + 1
 
head enc.encntr_id
	x=0
head epr.encntr_prsnl_reltn_id
	abc = 0
detail
	abc = 0
 
foot epr.encntr_prsnl_reltn_id
detail_line = build(
alias, '||',
ENCNTR_PRSNL_RELTN_ID ,'||',
PRSNL_PERSON_ID       ,'||',
ENCNTR_PRSNL_R_CD     ,'||',
ENCNTR_ID             ,'||',
UPDT_CNT              ,'||',
UPDT_DT_TM            ,'||',
UPDT_ID               ,'||',
UPDT_TASK             ,'||',
UPDT_APPLCTX          ,'||',
ACTIVE_IND            ,'||',
ACTIVE_STATUS_CD      ,'||',
ACTIVE_STATUS_DT_TM   ,'||',
ACTIVE_STATUS_PRSNL_ID,'||',
BEG_EFFECTIVE_DT_TM   ,'||',
END_EFFECTIVE_DT_TM   ,'||',
DATA_STATUS_CD        ,'||',
DATA_STATUS_DT_TM     ,'||',
DATA_STATUS_PRSNL_ID  ,'||',
CONTRIBUTOR_SYSTEM_CD ,'||',
FREE_TEXT_CD          ,'||',
FT_PRSNL_NAME         ,'||',
MANUAL_CREATE_IND     ,'||',
MANUAL_CREATE_BY_ID   ,'||',
MANUAL_CREATE_DT_TM   ,'||',
MANUAL_INACT_IND      ,'||',
MANUAL_INACT_BY_ID    ,'||',
MANUAL_INACT_DT_TM    ,'||',
PRIORITY_SEQ          ,'||',
INTERNAL_SEQ          ,'||',
EXPIRATION_IND        ,'||',
NOTIFICATION_CD       ,'||',
EXPIRE_DT_TM     ,'||',
TRANSACTION_DT_TM,'||',
ACTIVITY_DT_TM   ,'||',
ENCNTR_TYPE_CD   ,'|'
)
 
col 0 detail_line
row + 1
 
with outerjoin = d1, dontcare = ea,
	formfeed = none,
     maxrow = 1,
     nocounter,
     maxcol = 1000,
     format = variable,
     append
 
;update dm_info with next date
   if (dtfnd = "Y")
      set dtfnd = "N"
      update into dm_info dm
      set dm.updt_dt_tm = cnvtdatetime(nxtmnth)
      where dm.info_domain="HUMEDICA"
      and dm.info_name = domain_info_name
      with nocounter
      commit
   endif
   set testdt = nxtmnth	;enddt
 
;move extract to Humedica directory path
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
set outfile = concat("H416989_T",dirdt,"_E",edt,"_enc_prsnl_reltn.txt")
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
