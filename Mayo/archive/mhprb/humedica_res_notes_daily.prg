 
drop program humedica_res_notes_daily:dba go
create program humedica_res_notes_daily:dba
 
prompt
	"Extract File (MINE = screen)" = "MINE"
	, "Begin Date" = "CURDATE"
 
with OUTDEV, s_beg
 
;**** BEGINNING OF PREAMBLE ****
;humedica_results_notes_daily "nl:", "10-JUL-2012"
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
declare startdt = f8
declare enddt = f8
 
;this used in daily extract only
if(validate(request->batch_selection,"999") != "999")
	set stardt = cnvtdatetime(curdate-1,0)
	set endt = cnvtdatetime(curdate-1,235959)
else
	;$2 = "dd-mmmm-yyyy"
	set stardt = cnvtdatetime(cnvtdate2($2,"dd-mmm-yyyy"),0)
	set endt = cnvtdatetime(cnvtdate2($2,"dd-mmm-yyyy"),235959)
endif
 
call echo(build("prompt_date:",$2))
call echo(build("stardt_var:",stardt))
 
set startdt = cnvtdatetime(stardt)
set enddt = cnvtdatetime(endt)
free set today
declare today = f8
declare edt = vc
declare ydt = vc
 
declare month = vc
set month = format(startdt,"mmm;;d")
set dir_date = format(curdate,"yyyymm;;d")
 
set today = cnvtdatetime(curdate,curtime3)
set edt = format(today,"yyyymmdd;;d")
set dirdt = format(startdt,"yyyymmdd;;d")
set ydt = format(startdt,"yyyy;;d")
 
set beg_dt = startdt
set echo_beg_dt = format(beg_dt,"dd/mmm/yyyy hh:mm;;d")
call echo(build("beg_dt = ",echo_beg_dt))
set end_dt = enddt
set echo_end_dt = format(end_dt,"dd/mmm/yyyy hh:mm;;d")
call echo(build("end_dt = ",echo_end_dt))
 
set prg_name = cnvtlower(trim(curprog))
call echo(concat("running script: ",prg_name))
 
;002 unique file logic - change for each script
DECLARE dclcom = C255
DECLARE newdir = C255
set print_file = concat("hum_bc_results_blob2_",dirdt,".dat")
set print_dir = ""
set hold_file = concat("$CCLUSERDIR/",print_file)
set file_ext = "_results_blob.txt"
 
;*****  END OF PREAMBLE ****
 
 
/*******************************************
*  CODE VALUES
*******************************************/
declare ce_doc_cd = f8 with constant(uar_get_code_by("MEANING",53,"DOC"))
declare fin_cd = f8 with constant(uar_get_code_by("MEANING",319,"FIN NBR"))
 
 
call echo("------- get encounters that qualify -------")
 
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
)
 
 
;%i aps_uar_rtf.inc
/**********************************************************************
*   Internal temporary Record                                         *
***********************************************************************/
  record tmptext
  (
    1 qual[*]
      2 text                           = vc
  )
;***********************************************************************/
 
  declare format                       = i2
  declare line_len                     = i2
  declare OutBuffer                    = c32000
  declare RtfText                      = c32000
  declare NoRtfText                    = c32000
  set format                           = 0
  set line_len                         = 0
 
  subroutine RTF_TO_TEXT(RtfText,format,line_len)
    set all_len                        = 0
    set start                          = 0
    set len                            = 0
    set pos                            = 0
    set linecnt                        = 0
    set InBuffer                       = fillstring(32000, " ")
    set OutBufferlen                   = 0
    set bFl                            = 0
    set bFl2                           = 1
    set OutBuffer                      = fillstring(32000, " ")
    set NoRtfText                      = fillstring(32000, " ")
 
    ; First we need to determine whether we have rtf or ascii text
    ; because we don't want to call uar_rtf2 for ascii text because
    ; it removes some special characters we don't want removed.
 
    if (substring(1,5,RtfText) = asis("{\rtf"))
      set InBuffer                       = trim(RtfText)
      call uar_rtf2(InBuffer,size(InBuffer),OutBuffer,size(OutBuffer),OutBufferLen,bFl)
    else
      set OutBuffer                      = trim(RtfText)
    endif
 
    set NoRtfText                      = trim(OutBuffer)
    set stat = alterlist(tmptext->qual, 0)
    set crchar                         = concat(char(13),char(10))
    set lfchar                         = char(10)
    set ffchar                         = char(12)
    if (Format > 0)
      set all_len = cnvtint(size(trim(outbuffer)))
      set tot_len = 0
      set start = 1
      set bigfirst = "Y"
      set crstart = start
      while (all_len > tot_len)
        set crpos = crstart
        set crfirst = "Y"
        set loaded = "N"
        While ((crpos <= (crstart + line_len + 1)) and (loaded = "N") and (all_len > tot_len))
          if ((crpos = (crstart + line_len + 1)) and (crfirst ="N")) ;no cr foun
            set start = crstart
            set first = "Y"
            set pos = start + line_len - 1
            if ((bigfirst = "Y") and (pos >= all_len))
              set pos = start
            endif
            set bigfirst = "N"
            while((pos >= start) and (all_len > tot_len))
              if (pos = start) ;could not find a space default and take the line
                set pos = start + line_len - 1
                set linecnt = linecnt + 1
                set stat = alterlist(tmptext->qual, linecnt)
                set len = pos - start + 1
                set tmptext->qual[linecnt].text = substring(start,len,(outbuffer))
                set start = pos + 1
                set crstart = pos + 1
                set pos = 0
                set tot_len = tot_len + len - 1
                set loaded = "Y"
              else
                if (substring(pos,1,(outbuffer)) = " ")
                  set len = pos - start
                  if (cnvtint(size(trim(substring(start,len,(outbuffer))))) > 0)
                    set linecnt = linecnt + 1
                    set stat = alterlist(tmptext->qual, linecnt)
                    set tmptext->qual[linecnt].text = substring(start,len,(outbuffer))
                    set loaded = "Y"
                  endif
                  set start = pos + 1
                  set crstart = pos + 1
                  set pos = 0
                  set tot_len = tot_len + len ;+ 1
                else
                  if (first = "Y")
                    set first = "N"
                    set tot_len = tot_len + 1
                  endif
                  set pos = pos - 1
                endif
              endif
            endwhile
          else
            set crfirst = "N"
            if ( (substring(crpos,1,(outbuffer)) = crchar)
                                 or
                 (substring(crpos,1,(outbuffer)) = lfchar)
                                 or
                 (substring(crpos,1,(outbuffer)) = ffchar) )
                  set crlen = crpos - crstart
                  set linecnt = linecnt + 1
                  set stat = alterlist(tmptext->qual, linecnt)
                  set tmptext->qual[linecnt].text = substring(crstart,crlen,(outbuffer))
                  set loaded = "Y"
                if (substring(crpos,1,(outbuffer)) = crchar)
                  set crstart = crpos + textlen(crchar)
                elseif (substring(crpos,1,(outbuffer)) = lfchar)
                  set crstart = crpos + textlen(lfchar)
                elseif (substring(crpos,1,(outbuffer)) = ffchar)
                  set crstart = crpos + textlen(ffchar)
                endif
                set tot_len = tot_len + crlen
            endif
          endif
          set crpos = crpos + 1
        endwhile
      endwhile
    endif
    set RtfText                        = fillstring(32000, " ")
    set InBuffer                       = fillstring(32000, " ")
  End ;Subroutine RTF_TO_TEXT
 
  ;;=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 
  declare OutBufMaxSiz                 = i2
  declare TBlobIn                      = c32000
  declare TBlobOut                     = c32000
  declare BlobIn                       = c32000
  declare BlobOut                      = c32000
 
  subroutine DECOMPRESS_TEXT(TBlobIn)
    set TBlobOut                       = fillstring(32000, " ")
    set BlobOut                        = fillstring(32000, " ")
    set OutBufMaxSiz                   = 0
 
    set BlobIn = trim(TBlobIn)
    call uar_ocf_uncompress(BlobIn,size(BlobIn),BlobOut,size(BlobOut),OutBufMaxSiz)
    set TBlobOut = BlobOut
 
    set TBlobIn                        = fillstring(32000, " ")
    set BlobIn                         = fillstring(32000, " ")
 
  end ;subroutine DECOMPRESS_TEXT
;;End %i aps_uar_rtf.inc
 
 
 
 
select into "nl:"
  e.encntr_id,
  p.person_id
 
from
  encounter e,
  person p,
  encntr_alias ea,
;  accession a,
  ce_blob cb,
  clinical_event ce
 
plan ce
  where ce.updt_dt_tm between cnvtdatetime(beg_dt)
        and cnvtdatetime(end_dt)  and
        ce.valid_until_dt_tm +0 > cnvtdatetime(curdate,curtime3)
       and ce.performed_dt_tm +0 not = null
       and ce.event_class_cd +0 = ce_doc_cd
join e
  where e.encntr_id = ce.encntr_id
    and e.active_ind = 1
join p
  where p.person_id = e.person_id
join ea
  where ea.encntr_id = outerjoin(e.encntr_id)
    and ea.encntr_alias_type_cd+0 = outerjoin(fin_cd)
    and ea.end_effective_dt_tm+0 > outerjoin(cnvtdatetime(curdate,curtime3))
join cb
  where cb.event_id = ce.event_id
    and cb.valid_until_dt_tm > cnvtdatetime(curdate, curtime3)
head report
  cnt = 0
  lf = char(10)
  cr = char(13)
  vt = char(11)
  ht = char(9)
  crlf = build(char(13),char(10))
  blob_out = fillstring(32000," ")
  blob_out1 = fillstring(32000," ")
 
x=0
head ce.event_id
  cnt = cnt + 1
    stat = alterlist(results->qual, cnt)
   results->qual[cnt].person_id = cnvtstring(e.person_id)
   results->qual[cnt].encntr_id = e.encntr_id
   results->qual[cnt].org_id = cnvtstring(e.organization_id)
   results->qual[cnt].facility_cd = cnvtstring(e.loc_facility_cd)
   results->qual[cnt].fin_nbr = trim(ea.alias,3)
   results->qual[cnt].encntr_id = ce.encntr_id
   results->qual[cnt].disch_dt_tm = format(e.disch_dt_tm,"YYYYMMDDhhmmss;;d")
   results->qual[cnt].event_cd = cnvtstring(ce.event_cd)
   results->qual[cnt].order_id = cnvtstring(ce.order_id)
    results->qual[cnt].catalog_cd = cnvtstring(ce.catalog_cd)
   results->qual[cnt].clinical_event_id = cnvtstring(ce.clinical_event_id)
   results->qual[cnt].clinsig_updt_dt_tm =
    format(ce.clinsig_updt_dt_tm,"YYYYMMDDhhmmss;;d")
   results->qual[cnt].event_tag = trim(ce.event_tag,3)
   results->qual[cnt].result_status_cd = cnvtstring(ce.result_status_cd)
   results->qual[cnt].result_value = trim(ce.result_val,3)
   results->qual[cnt].result_units_cd = cnvtstring(ce.result_units_cd)
   results->qual[cnt].normalcy_cd = cnvtstring(ce.normalcy_cd)
   results->qual[cnt].resource_cd = cnvtstring(ce.resource_cd)
   results->qual[cnt].normal_high = cnvtstring(ce.normal_high)
   results->qual[cnt].normal_low  = cnvtstring(ce.normal_low)
   results->qual[cnt].accession_nbr = trim(ce.accession_nbr,3)
   results->qual[cnt].performed_id = cnvtstring(ce.performed_prsnl_id)
   results->qual[cnt].performed_dt_tm = format(ce.performed_dt_tm,"YYYYMMDDhhmmss;;d")
   results->qual[cnt].verified_id = cnvtstring(ce.verified_prsnl_id)
   results->qual[cnt].verified_dt_tm = format(ce.verified_dt_tm,"YYYYMMDDhhmmss;;d")
   results->qual[cnt].updt_dt_tm = format(ce.updt_dt_tm,"YYYYMMDDhhmmss;;d")
  blob_out1=fillstring(32000," ")
  blob_out1=substring(1,32000,cb.blob_contents)
  TBlobIn = blob_out1
  if (cb.compression_cd = 728)
	  call Decompress_text(TBlobIn)
	  call rtf_to_text(trim(TBlobOut), 1, 200)
	  NoRtftext = replace(NoRtftext,crlf,"\.br\",0)	;rkm 06/27/11
	  NoRtftext = replace(NoRtftext,lf, " ",0)		;rkm 06/27/11 add space
	  NoRtftext = replace(NoRtftext,cr, "\.br\",0)
	  NoRtftext = replace(NoRtftext,vt, " ",0)
	  NoRtftext = replace(NoRtftext,ht, " ",0)
	  NoRtftext = replace(NoRtftext,"|"," ",0)
	  results->qual[cnt].result_report = NoRtftext
	  temp_text = substring(1,3000, NoRtftext)
  else
	  results->qual[cnt].result_report = trim(cb.blob_contents)
	  results->qual[cnt].result_report = replace(results->qual[cnt].result_report,lf, " ",0)
	  results->qual[cnt].result_report = replace(results->qual[cnt].result_report,cr, " ",0)
	  results->qual[cnt].result_report = replace(results->qual[cnt].result_report,vt, " ",0)
	  results->qual[cnt].result_report = replace(results->qual[cnt].result_report,"|"," ",0)
	  results->qual[cnt].result_report = replace(results->qual[cnt].result_report,ht, " ",0)
  endif
 
with counter,FORMAT=VARIABLE,MAXCOL=80000
 
 
;**********MODIFY FROM HERE DOWN IN TEST VERSION**********
 
call echo("------- final output -------")
call echo("-----------------------------")
 
 
 
select into concat(print_dir,print_file)
encntr_id = results->qual[d.seq].encntr_id
from
  (dummyt d with seq=value(size(results->qual,5)))
 
plan d where results->qual[d.seq].encntr_id > 0
 
head report
    results->out_line     =
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
    	"UPDT_DT_TM|")
 
    col 0, results->out_line
    row + 1
 
detail
    results->out_line     =     build(results->qual[d.seq].person_id, '||',
                                   results->qual[d.seq].facility_cd, '||',
                                   results->qual[d.seq].fin_nbr, '||',
                                   results->qual[d.seq].org_id,'||',
                                   results->qual[d.seq].accession_nbr, '||',
                                   results->qual[d.seq].event_tag,'||',
                                   results->qual[d.seq].performed_id,'||',
                                   results->qual[d.seq].performed_dt_tm , '||',
                                   results->qual[d.seq].verified_id, '||',
                                   results->qual[d.seq].verified_dt_tm , '||',
;                                   results->qual[d.seq].updt_dt_tm, '||',
                                   results->qual[d.seq].disch_dt_tm, '||',
                                   results->qual[d.seq].event_cd ,'||',
                                   results->qual[d.seq].catalog_cd , '||',
                                   results->qual[d.seq].order_id, '||',
                                   results->qual[d.seq].result_report,'||',
                                   results->qual[d.seq].clinical_event_id , '||',
                                   results->qual[d.seq].clinsig_updt_dt_tm,'||',
                                   results->qual[d.seq].result_status_cd, '||',
                                   results->qual[d.seq].updt_dt_tm, '|'
 )
 
 
    col 0, results->out_line
    row + 1
 
with ;formfeed = none,
     maxrow = 1,
     nocounter,
     maxcol = 35000,
     format = variable
 
 
 
;$cust_output/humedica/cerner/daily/[yyyymm]/
declare newdir = vc
declare LEN = i4
declare DCLCOM = vc
 
set newdir = concat("/humedica/mhprd/data/daily")
set DCLCOM = concat("mkdir ",newdir)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir = concat("/humedica/mhprd/data/daily/",dir_date)
set DCLCOM = concat("mkdir ",newdir)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
free set outfile
set outfile = concat("H416989_T",dirdt,"_E",edt,"_results_blob.txt")
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
 
