/*************************************************************************
Author:        Rene Ramos, Mayo Clinic IT
Date Written:  09/2014
Report Title:  Educational Material Linked to ICD9
Source File:   mc_edu_material_icd9_link.prg
Object Name:   mc_edu_material_icd9_link
Directory:     MAYO_PRG
 
Program purpose:
Report needed to identify what educational materials have been linked in Millennium, to ICD9 codes,
and to which ICD9 codes these have been linked.  Used to help define scope of linking efforts and
for report validation.
 
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *                                                                     *
 *Mod Date     	Engineer	MRDOS/Project	Comments                   *
 *--- -------- -------------------- -----------------------------------*
  000 10/02/14  Rene Ramos  	26498		Initial release
*************************************************************************/
 
drop program mc_edu_material_icd9_link go
create program mc_edu_material_icd9_link
 
prompt
	"Output to File/Printer/MINE" = "MINE"      ;* Enter or select the printer or file name to send this report to.
	, "Content Domain:" = 0
	, "Select Diagnosis Initial Letter:" = ""
 
with OUTDEV, DOM_OPT, DIAG_INIT
 
 
/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
set domain_flg = cnvtint($DOM_OPT)
set diag_value = $DIAG_INIT
 
set source_cd = uar_get_code_by("MEANING",400,"ICD9")
set princ_type = uar_get_code_by("MEANING",401,"DIAG")
 
;new
declare icd9_cd	= f8 with public, constant(uar_get_code_by("MEANING", 400, "ICD9"))
declare icd10_cd = f8 with public, constant(uar_get_code_by("MEANING", 400, "ICD10-CM"))
;new
 
 
record tmp
(	1	cnt = i4
	1	qual[*]
		2	pat_reltn_id = f8
		2	momenclat_id = f8
		2   ed_reltn_id = f8
		2	icd9_code = vc
		2	diagnosis = vc
		2	map_instruct = vc
		2	cont_domain = vc
		2  	doc_ident = vc
)
 
set MaxSecs = 0
If (validate(isodbc, 0) = 1)  set MaxSecs = 300  endif
 
/**************************************************************
; DVDev Start Coding
**************************************************************/
 
if(diag_value = "Other")
	set diag01 = "2"
	set diag02 = "3"
else
	set diag01 = cnvtupper(diag_value)
	set diag02 = cnvtlower(diag_value)
endif
 
 
 
if(diag_value != null)		;// Validating Initial Selection
 
 
select into "nl:"
 
icd9_code = pe.source_identifier,
diagnosis = n.source_string,
mapped_instructions = p.pat_ed_reltn_desc,
content_domain = uar_get_code_display(p.pat_ed_domain_cd)
 
from
	pat_ed_dx_reltn pe,
	pat_ed_reltn p,
	nomenclature n
 
plan pe where pe.active_ind = 1
;new	and pe.source_vocabulary_cd = source_cd		;67
	and pe.source_vocabulary_cd in(icd9_cd, icd10_cd)
;new
 
join n where n.source_identifier = pe.source_identifier
	and n.active_ind = 1
	and n.principle_type_cd = princ_type		;79
	and n.end_effective_dt_tm > cnvtdatetime(curdate, curtime)
	and n.primary_vterm_ind = 1
	and ( substring(1,1,n.source_string) = diag01 or
			substring(1,1,n.source_string) = diag02 )
 
join p where p.pat_ed_reltn_desc_key = pe.pat_ed_reltn_desc_key
	and p.pat_ed_domain_cd = domain_flg		;813079401
	and p.active_ind = 1
 
order by icd9_code,
	diagnosis,
	mapped_instructions
 
head report
cnt = 0
 
head p.pat_ed_reltn_desc
 
cnt = cnt + 1
stat = alterlist(tmp->qual, cnt + 1)
 
tmp->qual[cnt]->pat_reltn_id = pe.pat_ed_dx_reltn_id
tmp->qual[cnt]->momenclat_id = n.nomenclature_id
tmp->qual[cnt]->icd9_code = pe.source_identifier
tmp->qual[cnt]->diagnosis = n.source_string
tmp->qual[cnt]->map_instruct = p.pat_ed_reltn_desc
tmp->qual[cnt]->cont_domain = uar_get_code_display(p.pat_ed_domain_cd)
tmp->qual[cnt]->doc_ident = p.key_doc_ident
tmp->qual[cnt]->ed_reltn_id = p.pat_ed_reltn_id
 
tmp->cnt = cnt
 
with format,  time= value( maxsecs )
 
 
call echo(build("Total Records = ",tmp->cnt))
 
 
 
;go to 100_exit
 
 
 
;// Print Section
 
select into $OUTDEV
 
;new	icd9_code = tmp->qual[d.seq]->icd9_code,
	icd10_code = tmp->qual[d.seq]->icd9_code,
;new
	diagnosis = substring(1,150,tmp->qual[d.seq]->diagnosis),
	mapped_instructions = substring(1,100,tmp->qual[d.seq]->map_instruct),
	content_domain = substring(1,50,tmp->qual[d.seq]->cont_domain)
 
from (dummyt d with seq = tmp->cnt)
 
plan d
 
with format, separator=" "
 
 
else
 
	select  into  $outdev
	from ( dummyt  d )
 
	detail
 
 		call print ( calcpos ( 50 ,  50 )),
 			"{b}Please select a valid Diagnosis Initial .......  Thanks"
 	with  nocounter , maxrow = 100 , maxcol = 250 , dio = postscript
 
endif		;// End of Initial validation
 
/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
# 100_exit
 
end
go