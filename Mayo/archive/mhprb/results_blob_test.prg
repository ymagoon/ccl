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
 
drop program hum_results_blob_test:dba go
create program hum_results_blob_test:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
 
with OUTDEV
 
 
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
set end_run_date = cnvtdatetime("02-JAN-2010 0000")
 
set run_date = cnvtdatetime(curdate,curtime3)
 
declare domain_info_name = vc
set domain_info_name = trim("humedica_results_blob")
declare month = vc
 
 
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
  declare OutBufMaxSiz                 = i2
  declare TBlobIn                      = c32000
  declare TBlobOut                     = c32000
  declare BlobIn                       = c32000
  declare BlobOut                      = c32000
  set TBlobIn                        = fillstring(32000, " ")
  set TBlobOut                        = fillstring(32000, " ")
  set BlobIn                        = fillstring(32000, " ")
  set BlobOut                        = fillstring(32000, " ")
 
  DECLARE bob = C32000
 
;  declare NoRtftext = vc
;  declare Result_Report = vc
;  set NoRtftext = fillstring(4361980, " ")
;  set Result_Report =  fillstring(4361980, " ")
;  declare outbuf = c32000
 
  subroutine DECOMPRESS_TEXT(TBlobIn)
    set TBlobOut                       = fillstring(32000, " ")
    set BlobOut                        = fillstring(32000, " ")
    set OutBufMaxSiz                   = 0
 
    set BlobIn = trim(TBlobIn)
    call uar_ocf_uncompress(BlobIn,size(BlobIn),BlobOut,size(BlobOut),OutBufMaxSiz)
    set TBlobOut = BlobOut
 
    ;set TBlobIn                        = fillstring(32000, " ")
    ;set BlobIn                         = fillstring(32000, " ")
 
  end ;subroutine DECOMPRESS_TEXT
 
 
call echo("------- get encounters that qualify -------")
set print_file = "result_blob_test.dat"
select into value(print_file)
   person_id = cnvtstring(e.person_id)
   ,encntr_id = e.encntr_id
   ,org_id = cnvtstring(e.organization_id)
   ,facility_cd = cnvtstring(e.loc_facility_cd)
   ,fin_nbr = cnvtstring(e.encntr_id) ; " ;trim(ea.alias,3)
   ,encntr_id = ce.encntr_id
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
 , bloblen = cb.blob_length ;blobgetlen(l.long_text)
 
from
  encounter e,
;  encntr_alias ea,
  ce_blob cb,
  ce_blob_result ceb,
  clinical_event ce,
  code_value CV1
 
plan ce
	where ce.clinical_event_id
		IN (679507060)
		;IN (683862799.00) ;, 678891883.00 , 678668773.00, 678870349 )
		;IN ( 678891883.00 , 678668773.00, 678870349)
	and ce.valid_until_dt_tm +0 > cnvtdatetime(curdate,curtime3)
	and ce.performed_dt_tm +0 not = null
	;and ce.event_class_cd +0 = 224 ; doc
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
    and cb.blob_seq_num = 2
;join ea where e.encntr_id = ea.encntr_id
;    and ea.encntr_alias_type_cd = 1077
;    and ea.end_effective_dt_tm > cnvtdatetime(curdate,curtime3)
;    and ea.active_ind = 1
order ce.updt_dt_tm, ce.clinical_event_id
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
;    	"FACILITY_ID||",
 ;   	"ENCOUNTER_ID||",
  ;  	"ORGANIZATION_ID||",
   ; 	"ACCESSION||",
    ;	"EVENT_TAG||",
    ;	"PERFORMED_BY_ID||",
    ;	"PERFORMED_DT_TM||",
    ;	"VERIFIED_BY_ID||",
    ;	"VERIFIED_DT_TM||",
    ;	"DISCH_DT_TM||",
    ;	"EVENT_CD||",
    ;	"CATALOG_CD||",
    ;	"ORDER_ID||",
    	"RESULT_REPORT")
    ;	"CLINICAL_EVENT_ID||",
    ;	"CLINSIG_UPDT_DT_TM||",
    ;	"RESULT_STATUS_CD||",
    ;	"UPDT_DT_TM|",
    ;	"BLOB_TYPE|",
    ;	"VALID_FROM_DT_TM|",
    ;	"VALID_UNTIL_DT_TM|",
    ;	"BLOB_SEQ|",
    ;	"EVENT_ID|" )
 
    col 0, head_line
    row + 1
 
head ce.clinical_event_id
 	;blob_out1=fillstring(32000," ")
 	blob_out2=fillstring(32000," ")
 	blob_out3=fillstring(32000," ")
 	blob_out4=fillstring(32000," ")
  	blob_out5=fillstring(32000," ")
 	blob_out6=fillstring(32000," ")
 	blob_out7=fillstring(32000," ")
 	blob_out8=fillstring(32000," ")
 	blob_out9=fillstring(32000," ")
  	blob_out10=fillstring(32000," ")
 	rnd = 0
detail
blob_out1=fillstring(32000," ")
;  rnd = rnd + 1
;  if (rnd = 1)
  	blob_out1= substring(1,32000,cb.blob_contents)
;  elseif (rnd = 2)
;  	blob_out2= substring(1,32000,cb.blob_contents)
;  elseif (rnd = 3)
;  	blob_out3= substring(1,32000,cb.blob_contents)
;  elseif (rnd = 4)
;  	blob_out4= substring(1,32000,cb.blob_contents)
;  elseif (rnd = 5)
;  	blob_out5= substring(1,32000,cb.blob_contents)
;  elseif (rnd = 6)
;  	blob_out6= substring(1,32000,cb.blob_contents)
;  elseif (rnd = 7)
;  	blob_out7= substring(1,32000,cb.blob_contents)
;  elseif (rnd = 8)
;  	blob_out8= substring(1,32000,cb.blob_contents)
;  elseif (rnd = 9)
;  	blob_out9= substring(1,32000,cb.blob_contents)
;  elseif (rnd = 10)
;  	blob_out10= substring(1,32000,cb.blob_contents)
;  endif
 
 
;foot ce.clinical_event_id
;  TBlobIn = concat(blob_out1,
;  					blob_out2,
;  					blob_out3,
;  					blob_out4,
;  					blob_out5,
;  					blob_out6,
;  					blob_out7,
;  					blob_out8,
;  					blob_out9,
;  					blob_out10)
 
 TBlobIn = blob_out1
  if (cb.compression_cd = 728)
	  call Decompress_text(TBlobIn)
	  ;call rtf_to_text(trim(TBlobOut), 1, 200) ;leave RTF in place
	  ;NoRtftext = TBlobIn
	  NoRtftext = tblobout
	  ;NoRtftext = replace(NoRtftext,crlf," \.br\",0)
	  ;NoRtftext = replace(NoRtftext,lf, " \.br\",0)
	  ;NoRtftext = replace(NoRtftext,cr, " \.br\",0)
 
	   ;NoRtftext = replace(NoRtftext,"\", cr,0)
 
	  result_report = Trim(NoRtftext,3)
  else
	  NoRtftext = TBlobIn
	  NoRtftext = replace(NoRtftext,crlf," \.br\",0)
	  NoRtftext = replace(NoRtftext,lf, " \.br\",0)
	  NoRtftext = replace(NoRtftext,cr, " \.br\",0)
 
	 result_report = Trim(NoRtftext,3)
  endif
/*
outbuf = result_report
stat = memrealloc(outbuf,1,build("C",bloblen))
retlen = blobget(outbuf, 0, cb.blob_contents)
NoRtftext = outbuf
result_report = Trim(NoRtftext,3)
*/
bob = result_report
    detail_line     =     build(person_id, '||',
    ;                               facility_cd, '||',
     ;                              fin_nbr, '||',
      ;                             org_id,'||',
       ;                            accession_nbr, '||',
        ;                           event_tag,'||',
         ;                          performed_id,'||',
          ;                        performed_dt_tm , '||',
           ;                        verified_id, '||',
            ;                       verified_dt_tm , '||',
             ;                      disch_dt_tm, '||',
                                   event_cd ,'||',
               ;                    catalog_cd , '||',
                ;                   order_id, '||',
                 ;                  ;"bob", '||',
                                   result_report, '|',
                   ;                clinical_event_id , '||',
                     ;              clinsig_updt_dt_tm,'||',
                     ;              result_status_cd, '||',
                      ;             updt_dt_tm, '|',
                                   blob_type, '|',
;                                   VALID_FROM_DT_TM, '|',
;							       VALID_UNTIL_DT_TM, '|',
							       BLOB_SEQ, '|',
							       EVENT_ID, '|')
 ;
 
    col 0, detail_line
    row + 1
 
with maxrow = 1,
     nocounter,
     maxcol = 35000,
     format = variable
 ;    append
 
 
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
 SET printerrorfile = concat("hum_results_blob_history_error",".dat")
 
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
 
select into $OUTDEV
bob1 = bob
from dummyt
with format, separator = " "
 
end
go
