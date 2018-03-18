/*************************
06/27/11 kmcdaniel	add space to lf decompress
 
select *
 from dm_info dm
where dm.info_domain = "HUMEDICA" and
dm.info_name = "humedica_results_blob"
go
 
delete from dm_info dm
where dm.info_domain = "HUMEDICA" and
dm.info_name = "humedica_results_blob"
 go
commit go
;002 04/14/12 kmcdaniel - rewritten for Mayo (416)
*******************************/
 
drop program hum_results_blob_history:dba go
create program hum_results_blob_history:dba
 
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
 
;Error Array
free set rs_error
RECORD  rs_error  (
1  qual [*]
2  ERROR_CD  =  F8
2  ERROR_MSG = VC)
 
DECLARE ERROR_CNT = I4
SET ERROR_CNT = 0
DECLARE ERRORMSG = VC
DECLARE ERRORCODE = I4
/*******************************************
*  CODE VALUES
*******************************************/
declare mrn_alias_cd         = f8 with public, noconstant(0.0)
declare mrn_cmrn_cd          = f8 with public, noconstant(0.0)
 
set mrn_cmrn_cd = uar_get_code_by("DISPLAYKEY",263,"CMRNMMI")
 
free set testdt
set testdt = cnvtdatetime("01-JAN-2010 0000")
set end_run_date = cnvtdatetime("11-JAN-2010 0000")
 
set run_date = cnvtdatetime(curdate,curtime3)
 
declare domain_info_name = vc
set domain_info_name = trim("humedica_results_blob")
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
	set enddt = cnvtdatetime(cnvtdate(startdt),235959)
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
 
	set print_file = concat("hum_results_blob_history_",dirdt,".dat")
	set hold_file = concat("/cerner/d_mhprd/ccluserdir/",print_file)
	set file_ext = "_results_blob.txt"
 
call echo("---------------------------")
call echo(build("start_date = ",format(startdt,"mm/dd/yyyy hh:mm;;d")))
call echo(build("end_date = ",format(enddt,"mm/dd/yyyy hh:mm;;d")))
call echo(build("Current Date = ",format(run_date,"mm/dd/yyyy hh:mm;;dm")))
call echo("----------write to array -----------------")
 
 
free set results
record results
(
  1 out_line    = vc
  1 qual[*]
    2 encntr_id                   = f8
    2 person_id                   = vc
    2 org_id                      = vc
    2 cmrn                        = vc
    2 mrn                         = vc
    2 event_tag                   = vc
    2 alias_pool_cd               = vc
    2 event_cd                    = vc
    2 catalog_cd = vc
    2 facility_cd                 = vc
    2 clinical_event_id           = vc
    2 fin_nbr                     = vc
    2 accession                   = vc
    2 verified_dt_tm              = vc
    2 order_id = vc
    2 performed_dt_tm             = vc
    2 normal_high                 = vc
    2 normal_low                  = vc
    2 resource_cd                 = vc
    2 normalcy_cd                 = vc
    2 result_units_cd             = vc
    2 result_value                = vc
    2 accession_nbr               = vc
    2 procedure_code              = vc
    2 result_status_cd 			= vc
    2 procedure_desc              = vc
    2 procedure_dt_tm             = vc
    2 sample_site                 = vc
    2 result_report               = vc
    2 performed_id                = vc
    2 verified_id                 = vc
    2 updt_dt_tm                  = vc
    2 disch_dt_tm                 = vc
    2 clinsig_updt_dt_tm          = vc
    2 blob_type                   = vc
    2 valid_until_dttm 			  = vc
    2 vaild_from_dttm			  = vc
    2 blob_seq				      = vc
    2 event_id                    = vc
)
 
 
;%i aps_uar_rtf.inc
  declare OutBufMaxSiz                 = i4
  declare TBlobIn                      = c32000
  declare TBlobOut                     = c32000
  declare BlobIn                       = c32000
  declare BlobOut                      = c32000
  set TBlobIn                        = fillstring(32000, " ")
  set BlobIn                         = fillstring(32000, " ")
 
  subroutine DECOMPRESS_TEXT(TBlobIn)
    set TBlobOut                       = fillstring(32000, " ")
    set BlobOut                        = fillstring(32000, " ")
    set OutBufMaxSiz                   = 0
 
    set BlobIn = trim(TBlobIn)
    call uar_ocf_uncompress(BlobIn,size(BlobIn),BlobOut,size(BlobOut),OutBufMaxSiz)
    set TBlobOut = BlobOut
 
  end ;subroutine DECOMPRESS_TEXT
 
 
call echo("------- get encounters that qualify -------")
 
select into value(print_file)
   person_id = cnvtstring(e.person_id)
   ,encntr_id = cnvtstring(e.encntr_id)
   ,org_id = cnvtstring(e.organization_id)
   ,facility_cd = cnvtstring(e.loc_facility_cd)
   ,fin_nbr = "" ;trim(ea.alias,3)
   ,disch_dt_tm = format(e.disch_dt_tm,"YYYYMMDDhhmmss;;d")
   ,event_cd = cnvtstring(ce.event_cd)
   ,order_id = cnvtstring(ce.order_id)
   ,catalog_cd = cnvtstring(ce.catalog_cd)
   ,clinical_event_id = cnvtstring(ce.clinical_event_id)
   ,clinsig_updt_dt_tm =
    format(ce.clinsig_updt_dt_tm,"YYYYMMDDhhmmss;;d")
   ,event_tag = trim(ce.event_tag,3)
   ,result_status_cd = cnvtstring(ce.result_status_cd)
   ,result_value = trim(ce.result_val,3)
   ,result_units_cd = cnvtstring(ce.result_units_cd)
   ,normalcy_cd = cnvtstring(ce.normalcy_cd)
   ,resource_cd = cnvtstring(ce.resource_cd)
   ,normal_high = ce.normal_high
   ,normal_low  = ce.normal_low
   ,accession_nbr = trim(ce.accession_nbr,3)
   ,performed_id = cnvtstring(ce.performed_prsnl_id)
   ,performed_dt_tm = format(ce.performed_dt_tm,"YYYYMMDDhhmmss;;d")
   ,verified_id = cnvtstring(ce.verified_prsnl_id)
   ,verified_dt_tm = format(ce.verified_dt_tm,"YYYYMMDDhhmmss;;d")
   ,updt_dt_tm = format(ce.updt_dt_tm,"YYYYMMDDhhmmss;;d")
   , blob_type = cv1.cdf_meaning
   , valid_until_dt_tm 			  = format(ce.valid_until_dt_tm,"YYYYMMDDhhmmss;;d")
   , valid_from_dt_tm			  = format(ce.valid_from_dt_tm,"YYYYMMDDhhmmss;;d")
   , blob_seq				      = cnvtstring(cb.blob_seq_num)
   , event_id                    = cnvtstring(ce.event_id)
   , storage = trim(uar_get_code_display(ceb.storage_cd),3)
from
  encounter e,
;  encntr_alias ea,
  ce_blob cb,
  ce_blob_result ceb,
  clinical_event ce,
  code_value CV1
 
plan ce
	where ce.updt_dt_tm between cnvtdatetime(beg_dt)
	and cnvtdatetime(end_dt)
	and ce.valid_until_dt_tm +0 > cnvtdatetime(curdate,curtime3)
	and ce.performed_dt_tm +0 not = null
	and ce.event_class_cd +0 = 224 ; doc
join e where e.encntr_id = ce.encntr_id
    and e.active_ind = 1
    and e.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
join ceb where ce.event_id = ceb.event_id
	and ceb.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
join CV1 where ceb.format_cd = cv1.code_value
	and cv1.cdf_meaning IN (
							"AH",
							"AS",
							"DIO",
							"CP",
							"HTML",
							"LONG_TEXT",
							"NONE",
							"RTF",
							"WINEMF",
							"XML",
							"MSWORD",
							"URL"
							)
join cb where cb.event_id = ceb.event_id
    and cb.valid_until_dt_tm > cnvtdatetime(curdate, curtime3)
;join ea where e.encntr_id = ea.encntr_id
;    and ea.encntr_alias_type_cd = 1077
;    and ea.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
;    and ea.active_ind = 1
order ce.clinical_event_id, cb.blob_seq_num
head report
  cnt = 0
  lf = char(10)
  cr = char(13)
  vt = char(11)
  ht = char(9)
  crlf = build(char(13),char(10))
  blob_out = fillstring(32000," ")
 
    head_line     =
    	build("PATIENT_ID_INT||",
    	"FACILITY_ID||",
    	"ENCOUNTER_ID||",
    	"ORGANIZATION_ID||",
    	"ACCESSION||",
    	"EVENT_TAG||",
    	"PERFORMED_BY_ID||",
    	"PERFORMED_DT_TM||",
    	"VERIFIED_BY_ID||",
    	"VERIFIED_DT_TM||",
    	"DISCH_DT_TM||",
    	"EVENT_CD||",
    	"CATALOG_CD||",
    	"ORDER_ID||",
    	"RESULT_REPORT||",
    	"CLINICAL_EVENT_ID||",
    	"CLINSIG_UPDT_DT_TM||",
    	"RESULT_STATUS_CD||",
    	"UPDT_DT_TM||",
    	"BLOB_TYPE||",
 		"STORAGE||",
    	"BLOB_SEQ||",
    	"EVENT_ID|" )
 
    col 0, head_line
    row + 1
 
detail
 
  blob_out= substring(1,32000,cb.blob_contents)
  if (cb.compression_cd = 728)
	  call Decompress_text(TBlobIn)
	  ;call rtf_to_text(trim(TBlobOut), 1, 200) ;leave RTF in place
	  NoRtftext = tblobout
	  NoRtftext = replace(NoRtftext,crlf," \.br\",0)
	  NoRtftext = replace(NoRtftext,lf, " \.br\",0)
	  NoRtftext = replace(NoRtftext,cr, " \.br\",0)
 
	   ;NoRtftext = replace(NoRtftext,"\", cr,0)
 
	  result_report = NoRtftext
  else
	  NoRtftext = TBlobIn
	  NoRtftext = replace(NoRtftext,crlf," \.br\",0)
	  NoRtftext = replace(NoRtftext,lf, " \.br\",0)
	  NoRtftext = replace(NoRtftext,cr, " \.br\",0)
 
	 result_report = NoRtftext
  endif
 
    detail_line     =     build(person_id, '||',
                                   facility_cd, '||',
                                   encntr_id, '||',
                                   org_id,'||',
                                   accession_nbr, '||',
                                   event_tag,'||',
                                   performed_id,'||',
                                   performed_dt_tm , '||',
                                   verified_id, '||',
                                   verified_dt_tm , '||',
                                   disch_dt_tm, '||',
                                   event_cd ,'||',
                                   catalog_cd , '||',
                                   order_id, '||',
                                   result_report,'||',
                                   clinical_event_id , '||',
                                   clinsig_updt_dt_tm,'||',
                                   result_status_cd, '||',
                                   updt_dt_tm, '||',
                                   blob_type, '||',
                                   Storage, '||',
							       BLOB_SEQ, '||',
							       EVENT_ID, '|')
 
 
    col 0, detail_line
    row + 1
 
with maxrow = 1,
     nocounter,
     maxcol = 80000,
     format = variable
;     append
 
 
;Error Handler for up to 5 errors
SET ERRORCODE = ERROR(ERRORMSG,0)
WHILE(ERRORCODE != 0)
   SET ERROR_CNT = ERROR_CNT + 1
   SET stat = alterlist( rs_error->qual, ERROR_CNT )
   SET rs_error->qual[ERROR_CNT].ERROR_CD = ERRORCODE
   SET rs_error->qual[ERROR_CNT].ERROR_MSG = ERRORMSG
   SET rs_error->qual[ERROR_CNT].ERROR_MSG = replace(ERRORMSG, CHAR(13), "")
   SET rs_error->qual[ERROR_CNT].ERROR_MSG = replace(ERRORMSG, CHAR(10), "")
   SET ERRORCODE = ERROR(ERRORMSG,0)
ENDWHILE
 
;Saves to file
if (ERROR_CNT > 0)
 SET printerrorfile = concat("hum_results_blob_history_error",dirdt,".dat")
 
 select into value(printerrorfile)
  errornum =  cnvtstring(rs_error->qual[d.seq].error_cd),
  errormessage = rs_error->qual[d.seq].error_msg
 from ( dummyt d with seq = size( rs_error->qual, 5 ))
 where rs_error->qual[d.seq].error_cd > 0
 order by d.seq
 with pcformat, separator = "|"
 
 SET ERROR_CNT = 0
 SET stat = alterlist( rs_error->qual, ERROR_CNT )
endif
 
;move dm_info update logic to follow extract
 
   if (dtfnd = "Y")
      set dtfnd = "N"
      update into dm_info dm
      set dm.updt_dt_tm = cnvtdatetime(nxtmnth)	;cnvtdatetime(enddt)
      where dm.info_domain="HUMEDICA" and dm.info_name = domain_info_name
      with nocounter
      commit
   endif
   set testdt = nxtmnth	;enddt
 
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
set outfile = concat("H416989_T",dirdt,"_E",edt,file_ext)
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
