/******************************************************
 
  note: be sure to clean up the dm_info table with this
select
 dm.info_domain,
 dm.info_name,
 dm.updt_dt_tm
 from dm_info dm
where  dm.info_domain="HUMEDICA"
   and dm.info_name = "HUMEDICA_BC_PATHOLOGY"
go
 
delete from dm_info dm
where  dm.info_domain="HUMEDICA"
   and dm.info_name = "HUMEDICA_BC_PATHOLOGY"
 go
commit go
 *****************************************************/
drop program humedica_pathology_hist:dba go
create program humedica_pathology_hist:dba
 
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
set run_date = cnvtdatetime(curdate,curtime3)
if(validate(request->batch_selection,"999") != "999")
	set testdt = cnvtdatetime(curdate-1,0)
	set end_run_date = cnvtdatetime(curdate,0)
else
	set testdt = cnvtdatetime("11-NOV-2011 0000")
	set end_run_date = cnvtdatetime("12-NOV-2011 0000")
endif
 
declare domain_info_name = vc
set domain_info_name = trim("HUMEDICA_BC_PATHOLOGY")
set client_code = "H416989"
 
declare edt = vc
declare startdt = f8
declare enddt = f8
declare nxtmnth = f8
declare rec_cnt = i4
declare rtxt = vc
declare head_line = vc
 
;while (testdt < cnvtdatetime(end_run_date))
 
   if(testdt >= end_run_date) go to exit_program endif
 
   free set dtfnd
   set dtfnd = "N"
   set edt = format(curdate,"yyyymmdd;;d")
   set rec_cnt = 0
 
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
	nxtmnth = cnvtdatetime(cnvtdate(enddt)+1,0)
   with nocounter
 
   if (dtfnd = "N")
	set startdt = cnvtdatetime(testdt)
;	set enddt = datetimefind(cnvtdatetime(startdt),"M", "E","E")
	set enddt = cnvtdatetime(cnvtdate(startdt),235959)
	set nxtmnth = cnvtdatetime(cnvtdate(enddt)+1,0)
      insert into dm_info dm
      set	dm.info_domain="HUMEDICA",
      		dm.info_name = domain_info_name,
			dm.updt_dt_tm = cnvtdatetime(nxtmnth)	;cnvtdatetime(enddt)
      with nocounter
      commit
   endif
 
   call echo(build("start_date = ",format(startdt,"mm/dd/yyyy hh:mm;;d")))
   call echo(build("end_date = ",format(enddt,"mm/dd/yyyy hh:mm;;d")))
 
   set dirdt = format(startdt,"yyyymmdd;;d")
   set beg_dt = startdt
   set end_dt = enddt
 
   call echo(build("start_date = ",format(startdt,"mm/dd/yyyy hh:mm;;d")))
   call echo(build("end_date = ",format(enddt,"mm/dd/yyyy hh:mm;;d")))
 
   set prg_name = cnvtlower(trim(curprog))
   call echo(concat("running script: ",prg_name))
 
   ;unique file logic - change for each script
   set print_file = concat("hum_bc_pathology_",dirdt,".dat")
   set print_dir = "ccluserdir:"
   set hold_file = concat("$CCLUSERDIR/",print_file)
   set file_ext = "_pathology.txt"
 
 
declare auto_final_dx        = f8 with noconstant(0.0)
declare psmear_final_dx      = f8 with noconstant(0.0)
declare cyto_final_dx        = f8 with noconstant(0.0)
declare nongyn_cyto_final_dx = f8 with noconstant(0.0)
declare surg_final_dx        = f8 with noconstant(0.0)
declare amend_final_dx       = f8 with noconstant(0.0)
 
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
 
 
free record CE_List
record CE_List
( 1 qual_cnt = i4
  1 qual[*]
    2 caseid = f8
    2 specimenid = f8
    2 eventid = f8
    2 reportid = f8
    2 taskcd = f8
)
 
declare x = I4
;*****  END OF PREAMBLE ****
 
/*******************************************
*  CODE VALUES
*******************************************/
declare fin_cd = f8 with constant(uar_get_code_by("MEANING",319,"FIN NBR"))
declare ce_doc_cd = f8 with constant(uar_get_code_by("MEANING",53,"DOC"))
declare blob_storage_cd = F8 with constant(uar_get_code_by("MEANING",25,"BLOB"))
declare compress_cd = F8 with constant(uar_get_code_by("MEANING",120,"OCFCOMP"))
declare accession_type_cd = F8 with constant(uar_get_code_by("MEANING",23549,"ACCNICD9"))
declare rdt_status_cd = F8 with constant(uar_get_code_by("MEANING",1305,"CANCEL"))
 
select distinct into "nl:"
	cr.case_id
	, cr.report_id
	, cs.specimen_cd
	, cb.event_id
from
  encounter e,
  person p,
  encntr_alias ea,
  pathology_case pc,
  case_specimen cs,
  accession a,
  case_report cr,
;  report_detail_task rdt,
  clinical_event ce1,
  clinical_event ce2,
  ce_blob cb
 
plan cr where cr.updt_dt_tm between cnvtdatetime(beg_dt) and cnvtdatetime(end_dt)
and cr.cancel_cd = 0
join pc where pc.case_id = cr.case_id
join e where e.encntr_id = pc.encntr_id
    and e.active_ind = 1
    and e.organization_id+0 in (589743, 592210, 1137984)
join p where p.person_id = e.person_id
join ea where ea.encntr_id = outerjoin(e.encntr_id)
    and ea.encntr_alias_type_cd+0 = outerjoin(fin_cd)
    and ea.end_effective_dt_tm+0 > outerjoin(cnvtdatetime(curdate,curtime3))
    and ea.active_ind+0 = outerjoin(1)
join cs where cs.case_id = pc.case_id
join a where a.accession = trim(pc.accession_nbr)
;join rdt where rdt.report_id = cr.report_id
;    and rdt.task_assay_cd > 0
;    and rdt.event_id+0 > 0
;    and rdt.status_cd != rdt_status_cd
join ce1
WHERE ce1.EVENT_ID=CR.EVENT_ID
	AND ce1.VALID_UNTIL_DT_TM> CNVTDATETIME ( CURDATE ,  CURTIME3 )
join ce2
WHERE ce2.PARENT_EVENT_ID=ce1.EVENT_ID
	 AND ce2.VALID_UNTIL_DT_TM> CNVTDATETIME ( CURDATE ,CURTIME3 )
join cb where cb.event_id = ce2.event_id
    and cb.valid_until_dt_tm > cnvtdatetime(curdate, curtime3)
    and cb.blob_seq_num >= 0
ORDER BY
	CR.CASE_ID,
	CR.REPORT_ID,
	CS.SPECIMEN_CD,
	CB.EVENT_ID
 
HEAD REPORT
	CE_List->qual_cnt = 0
DETAIL
    CE_List->qual_cnt = CE_List->qual_cnt + 1
	stat = alterlist( CE_List->qual, CE_List->qual_cnt)
	if (null(cb.event_id) != 1)
		CE_List->qual[CE_List->qual_cnt].eventid = cb.event_id
	else
		CE_List->qual[CE_List->qual_cnt].eventid = -1
	endif
	CE_List->qual[CE_List->qual_cnt].caseid = pc.case_id
	CE_List->qual[CE_List->qual_cnt].specimenid = cs.case_specimen_id
	CE_List->qual[CE_List->qual_cnt].reportid = cr.report_id
	CE_List->qual[CE_List->qual_cnt].taskcd = ce2.task_assay_cd
 
with nocounter
 
call echo("Blob Event ID Count: ")
call echo( CE_List->qual_cnt)
 
call echo("start time")
call echo(format(cnvtdatetime(curdate,curtime3), "@SHORTDATETIME"))
 
;Loop and call Blob outputter
for (x = 1 to CE_List->qual_cnt)
	execute humedica_bc_path_daily2 x
endfor
 
call echo("end time")
call echo(format(cnvtdatetime(curdate,curtime3), "@SHORTDATETIME"))
 
 
if (dtfnd = "Y")
   set dtfnd = "N"
   update into dm_info dm
   set dm.updt_dt_tm = cnvtdatetime(nxtmnth)
   where dm.info_domain = "HUMEDICA"
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
 
set newdir = "$mhs_ops/"
set DCLCOM = concat("mkdir ",newdir,"humedica/")
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir = "$mhs_ops/humedica/"
set DCLCOM = concat("mkdir ",newdir,"cerner/")
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir ="$mhs_ops/humedica/cerner/"
set DCLCOM = concat("mkdir ",trim(newdir),"historical/")
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set newdir = "$mhs_ops/humedica/cerner/historical/"
set DCLCOM = concat("mkdir ",trim(newdir),dir_date,"/")
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
free set outfile
set outfile = concat(client_code,"_T",dirdt,"_E",edt,file_ext)
 
set newfile = concat(newdir,dir_date,"/",outfile)
set DCLCOM = concat("mv ",trim(hold_file)," ",newfile)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
set DCLCOM = concat("gzip -9 ",newfile)
set LEN = SIZE(TRIM(DCLCOM))
set STATUS = 0
call DCL(DCLCOM,LEN,STATUS)
 
;endwhile
 
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
 
