/*****************************************************/
drop program humedica_path_daily:dba go
create program humedica_path_daily:dba
 
prompt
	"Extract File (MINE = screen)" = "MINE"
	, "Begin Date" = "CURDATE"
 
with OUTDEV, s_beg
 
 
;**** BEGINNING OF PREAMBLE ****
;humedica_path_daily "nl:", "10-JUL-2012"
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
set print_file = concat("hum_bc_pathology_",dirdt,".dat")
set print_dir = ""
set hold_file = concat("$CCLUSERDIR/",print_file)
set file_ext = "_pathology.txt"
 
;*****  END OF PREAMBLE ****
 
declare fin_cd = f8 with constant(uar_get_code_by("MEANING",319,"FIN NBR"))
set accession_type_cd = uar_get_code_by("MEANING",23549,"ACCNICD9")
declare TBlobIn              = vc
 
free set ap_case
record ap_case
(
  1 out_line    = vc
  1 qual[*]
    2 encntr_id                       = f8
    2 case_id                         = f8
    2 person_id                   = vc
    2 org_id                      = vc
    2 cmrn                        = vc
    2 mrn                         = vc
    2 case_report_updt_dt_tm      = vc
    2 alias_pool_cd               = vc
    2 event_cd                    = vc
    2 facility_cd                 = vc
    2 event_id                    = vc
    2 task_assay_cd               = vc
    2 fin_nbr                     = vc
    2 accession                       = vc
    2 accession_nbr                   = vc
    2 procedure_code                  = vc
    2 procedure_desc                  = vc
    2 procedure_dt_tm                 = vc
    2 cpt							= vc
    2 sample_site                     = vc
    2 result_report                   = vc
    2 order_phys                      = vc
    2 updt_dt_tm                      = vc
    2 disch_dt_tm                     = vc
    2 clinsig_updt_dt_tm              = vc
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
  p.person_id,
  sample_site = uar_get_code_display(cs.specimen_cd)
from
  encounter e,
  person p,
;  person_alias pa,
  encntr_alias ea,
  pathology_case pc,
  case_specimen cs,
  accession a,
  nomen_entity_reltn ner,
  nomenclature n,
  case_report cr,
  report_detail_task rdt,
  ce_blob cb
 
plan cr
where cr.updt_dt_tm between cnvtdatetime(beg_dt) and cnvtdatetime(end_dt)
join pc
where pc.case_id = cr.case_id
join e
 where e.encntr_id = pc.encntr_id
    and e.active_ind = 1
join p
  where p.person_id = e.person_id
join ea
  where ea.encntr_id = outerjoin(e.encntr_id)
    and ea.encntr_alias_type_cd+0 = outerjoin(fin_cd)
    and ea.end_effective_dt_tm+0 > outerjoin(cnvtdatetime(curdate,curtime3))
    and ea.active_ind+0 = outerjoin(1)
join cs
  where cs.case_id = outerjoin(pc.case_id)
join a
  where a.accession = trim(pc.accession_nbr)
join ner
  where ner.parent_entity_name = outerjoin("ACCESSION")
    and ner.parent_entity_id = outerjoin(a.accession_id)
    and ner.reltn_type_cd+0 = outerjoin(accession_type_cd)
    and ner.end_effective_dt_tm+0 >= outerjoin(cnvtdatetime(curdate,curtime3))
    and ner.active_ind+0 = outerjoin(1)
join n
  where n.nomenclature_id = outerjoin(ner.nomenclature_id)
join rdt
  where rdt.report_id = cr.report_id
    and rdt.task_assay_cd >0 and
    rdt.event_id+0 > 0
join cb
  where cb.event_id = outerjoin(rdt.event_id)
    and cb.valid_until_dt_tm > outerjoin(cnvtdatetime(curdate, curtime3))
    and cb.blob_seq_num >= outerjoin(0)
 
order
  pc.case_id,cb.event_id
 
head report
  cnt = 0
  lf = char(10)
  crlf = build(char(13),char(10))
  cr = char(13)
  vt = char(11)
  blob_out = fillstring(32000," ")
  blob_out1 = fillstring(32000," ")
 
head pc.case_id
  cnt = cnt + 1
    stat = alterlist(ap_case->qual, cnt)
   ap_case->qual[cnt].person_id = cnvtstring(p.person_id)
   ap_case->qual[cnt].encntr_id = e.encntr_id
   ap_case->qual[cnt].org_id = cnvtstring(e.organization_id)
   ap_case->qual[cnt].facility_cd = cnvtstring(e.loc_facility_cd)
   ap_case->qual[cnt].task_assay_cd = cnvtstring(rdt.task_assay_cd)
   ap_case->qual[cnt].fin_nbr = trim(ea.alias,3)
   ap_case->qual[cnt].case_id = pc.case_id
   ap_case->qual[cnt].accession_nbr = pc.accession_nbr
   ap_case->qual[cnt].order_phys = cnvtstring(pc.requesting_physician_id)
   ap_case->qual[cnt].updt_dt_tm = format(pc.updt_dt_tm,"YYYYMMDDhhmmss;;d")
   ap_case->qual[cnt].case_report_updt_dt_tm = format(cr.updt_dt_tm,"YYYYMMDDhhmmss;;d")
   ap_case->qual[cnt].sample_site = sample_site
   ap_case->qual[cnt].procedure_code =n.source_identifier
   ap_case->qual[cnt].procedure_desc = trim(n.source_string,3)
   ap_case->qual[cnt].procedure_dt_tm =
    format(pc.main_report_cmplete_dt_tm,"YYYYMMDDhhmmss;;d")
;   ap_case->qual[cnt].cpt = fillstring(10,"")
   blob_out1 =fillstring(32000," ")
head cb.event_id
   blob_out1=substring(1,32000,cb.blob_contents)
    ap_case->qual[cnt].event_id = cnvtstring(cb.event_id)
   TBlobIn = trim(blob_out1)
   call Decompress_text(TBlobIn)
   call rtf_to_text(trim(TBlobOut), 1, 200)
   NoRtftext = replace(NoRtftext,crlf,"\.br\",0)
   NoRtftext = replace(NoRtftext,lf, "\.br\",0)
   NoRtftext = replace(NoRtftext,cr, "\.br\",0)
   NoRtftext = replace(NoRtftext,vt, " ",0)
;   NoRtftext = replace(NoRtftext,"@^À", "\eof\",0);???
   NoRtftext = replace(NoRtftext,"@^À", "...",0)
   ap_case->qual[cnt].result_report =
   concat(" ",ap_case->qual[cnt].result_report,NoRtftext)
 
	ap_case->qual[cnt].result_report = 					;rkm
     concat(ap_case->qual[cnt].result_report,"\.br\") 	;rkm 06/23/11
 
with counter,FORMAT=VARIABLE,MAXCOL=80000
 
 
;**********MODIFY FROM HERE DOWN IN TEST VERSION**********
 
 
call echo("------- final output -------")
 
select into value(print_file)
encntr_id = ap_case->qual[d.seq].encntr_id
from
  (dummyt d with seq=value(size(ap_case->qual,5)))
plan d where ap_case->qual[d.seq].encntr_id > 0
 
head report
    head_line     =
    	build("PATIENT_ID_INT||",
    	"FACILITY_ID||",
    	"ENCOUNTER_ID||",
    	"ORGANIZATION_ID||",
    	"ACCESSION||",
    	"DIAGNOSIS_CD||",
    	"DIAGNOSIS_DESCRIPTION||",
    	"RESULT_DT_TM||",
    	"CPT_CODE||",
    	"SAMPLE_SITE||",
    	"RESULT_REPORT||",
    	"ORDERING_MD_CD||",
    	"LAST_UPDT_DT_TM||",
    	"DISCH_DT_TM||",
    	"TASK_ASSAY_CD||",
    	"EVENT_ID||",
    	"UPDT_DT_TM||",
    	"CASE_REPORT_UPDT_DT_TM|")
 
    col 0, head_line
    row + 1
 
detail
	det_line = fillstring(32000,"")
    det_line     =     build(ap_case->qual[d.seq].person_id, '||',
                                   ap_case->qual[d.seq].facility_cd, '||',
                                   ap_case->qual[d.seq].fin_nbr, '||',
                                   ap_case->qual[d.seq].org_id, '||',
                                   ap_case->qual[d.seq].accession_nbr,'||',
                                   ap_case->qual[d.seq].procedure_code,'||',
                                   ap_case->qual[d.seq].procedure_desc,'||',
                                   ap_case->qual[d.seq].procedure_dt_tm,'||',
                                   ap_case->qual[d.seq].cpt,'||',
                                   ap_case->qual[d.seq].sample_site,'||',
                                   ap_case->qual[d.seq].result_report,'||',
                                   ap_case->qual[d.seq].order_phys,'||',
                                   ap_case->qual[d.seq].updt_dt_tm, '||',
                                   ap_case->qual[d.seq].disch_dt_tm, '||',
                                   ap_case->qual[d.seq].task_assay_cd, '||',
                                   ap_case->qual[d.seq].event_id , '||',
                                   ap_case->qual[d.seq].updt_dt_tm, '||',
                                   ap_case->qual[d.seq].case_report_updt_dt_tm, '|' )
 
 
    col 0, det_line
    row + 1
 
with formfeed = none,
     maxrow = 1,
     nocounter,
     maxcol = 35000,
     format = variable,
     append
 
set newdir = "/"
set DCLCOM = concat("mkdir ",newdir,"humedica/mhprd/data/")
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir = "/humedica/mhprd/data/"
set DCLCOM = concat("mkdir ",newdir,"cerner/")
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir = "/humedica/mhprd/data/cerner/"
set DCLCOM = concat("mkdir ",trim(newdir),"daily/")
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir = "/humedica/mhprd/data/cerner/daily/"
set DCLCOM = concat("mkdir ",trim(newdir),dir_date,"/")
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
free set outfile
set outfile = concat("H416989_T",dirdt,"_E",edt,file_ext)
set newfile = concat(trim(newdir),dir_date,"/",outfile)
 
;call echo(newdir)
;call echo(trim(hold_file))
;call echo(newfile)
;call echo(concat("mv ",trim(hold_file)," ",newfile))
 
set DCLCOM = concat("mv ",trim(hold_file)," ",newfile)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set DCLCOM = concat("gzip -9 ",newfile)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
;*************
 
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
