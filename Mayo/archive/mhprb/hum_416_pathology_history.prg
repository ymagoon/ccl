/******************************************************
 10 June 2011...mrhine
   1. added reminder
   2. changed directory structure to year month not csv
   3. added replace cr to \.br\
   4. commented out code values per chad
 13 June 2011...mrhine
   1. changed column 16 from ce.clinsig_updt_dt_tm to cr.updt_dt_tm
 15 June 2011 Chad Parker
   1. fixed various ailments identified by Cathy/Adriana
 23 June 2011 kmcdaniel
   1. fix replace() formatting issues
 
  note: be sure to clean up the dm_info table with this
select
 dm.info_domain,
 dm.info_name,
 dm.updt_dt_tm
 from dm_info dm
where  dm.info_domain="HUMEDICA"
   and dm.info_name = "humedica_pathology"
go
 
delete from dm_info dm
where  dm.info_domain="HUMEDICA"
   and dm.info_name = "humedica_pathology"
 go
commit go
;002 04/12/12 kmcdaniel - rewritten for Mayo (416)
 *****************************************************/
drop program hum_pathology_history:dba go
create program hum_pathology_history:dba
 
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
set testdt = cnvtdatetime("01-JAN-2009 0000")
set end_run_date = cnvtdatetime("01-JAN-2012 0000")
set run_date = cnvtdatetime(curdate,curtime3)
 
declare domain_info_name = vc
set domain_info_name = trim("humedica_pathology")
declare month = vc
 
 
free set persons
record persons
(
  1 qual[*]
    2 person_id                   = f8
    2 mrn             = vc
)
 
 
free set encounters
record encounters
(
  1 out_line                      = vc
  1 qual[*]
    2 encntr_id                   = f8
    2 person_id                   = vc
    2 org_id                      = vc
    2 mrn                         = vc
    2 facility                    = vc
    2 facility_cd                 = i4
    2 fin_nbr                     = vc
)
 
 
declare TBlobIn              = vc
declare mrn_alias_cd         = f8 with public, noconstant(0.0)
declare mrn_cmrn_cd          = f8 with public, noconstant(0.0)
declare inerror_cd           = f8 with noconstant (0.0)
declare complete_cd          = f8 with noconstant(0.0)
declare ver_status_cd        = f8 with noconstant(0.0)
declare dilution_cd          = f8 with noconstant(0.0)
declare interpretation_cd    = f8 with noconstant(0.0)
 
declare auto_final_dx        = f8 with noconstant(0.0)
declare psmear_final_dx      = f8 with noconstant(0.0)
declare cyto_final_dx        = f8 with noconstant(0.0)
declare nongyn_cyto_final_dx = f8 with noconstant(0.0)
declare surg_final_dx        = f8 with noconstant(0.0)
declare amend_final_dx       = f8 with noconstant(0.0)
 
set mnStat = uar_get_meaning_by_codeset(4,"MRN",1,mrn_alias_cd)
set mrn_cmrn_cd = uar_get_code_by("DISPLAYKEY",263,"CMRNMMI")
set mnStat = uar_get_meaning_by_codeset(8,"INERROR",1,inerror_cd)
set complete_cd = uar_get_code_by("MEANING",1031,"COMPLETE")
set ver_status_cd = uar_get_code_by("MEANING",1901,"VERIFIED")
set dilution_cd = uar_get_code_by("DISPLAYKEY",1004,"MDIL")
set interpretation_cd = uar_get_code_by("DISPLAYKEY",1004,"MINT")
set accession_type_cd = uar_get_code_by("MEANING",23549,"ACCNICD9")
set ocfcomp_cd = uar_get_code_by("MEANING",120,"OCFCOMP")
 
declare cnt = i4
 
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
 
 
%i aps_uar_rtf.inc
 
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
 
	set print_file = concat("hum_pathology_history_",dirdt,".dat")
	set hold_file = concat("/cerner/d_mhprd/ccluserdir/",print_file)
 
 
/*******************************************
*  SELECTION CRITERIA
*******************************************/
 
call echo(build("-------------- write to array ----------------"))
 
/*******************************************
*  CODE VALUES
*******************************************/
call echo("get encounters that qualify")
 
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
 
plan cr where cr.updt_dt_tm between cnvtdatetime(beg_dt) and cnvtdatetime(end_dt)
join pc where pc.case_id = cr.case_id
join e where e.encntr_id = pc.encntr_id
    and e.active_ind = 1
join p where p.person_id = e.person_id
join ea where ea.encntr_id = outerjoin(e.encntr_id)
    and ea.encntr_alias_type_cd+0 = outerjoin(1077)
    and ea.end_effective_dt_tm+0 > outerjoin(cnvtdatetime(curdate,curtime3))
    and ea.active_ind+0 = outerjoin(1)
join cs
  where cs.case_id = outerjoin(pc.case_id)
join a where a.accession = trim(pc.accession_nbr)
join ner
  where ner.parent_entity_name = outerjoin("ACCESSION")
    and ner.parent_entity_id = outerjoin(a.accession_id)
    and ner.reltn_type_cd+0 = outerjoin(accession_type_cd)
    and ner.end_effective_dt_tm+0 >= outerjoin(cnvtdatetime(curdate,curtime3))
    and ner.active_ind+0 = outerjoin(1)
join n where n.nomenclature_id = outerjoin(ner.nomenclature_id)
join rdt where rdt.report_id = cr.report_id
    and rdt.task_assay_cd >0
    and rdt.event_id+0 > 0
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
   ap_case->qual[cnt].encntr_id = pc.encntr_id
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
 
call echo("------- final output -------")
 
select into value(print_file)
encntr_id = ap_case->qual[d.seq].encntr_id
from
  (dummyt d with seq=value(size(ap_case->qual,5)))
plan d
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
    ap_case->out_line     =     build(ap_case->qual[d.seq].person_id, '||',
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
 
 
    col 0, ap_case->out_line
    row + 1
 
with formfeed = none,
     maxrow = 1,
     nocounter,
     maxcol = 80000,
     format = variable
 
   if (dtfnd = "Y")
      set dtfnd = "N"
      update into dm_info dm
      set dm.updt_dt_tm = cnvtdatetime(nxtmnth)	;cnvtdatetime(enddt)
      where dm.info_domain="HUMEDICA"
      and dm.info_name = domain_info_name
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
set outfile = concat("H416989_T",dirdt,"_E",edt,"_pathology.txt")
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
