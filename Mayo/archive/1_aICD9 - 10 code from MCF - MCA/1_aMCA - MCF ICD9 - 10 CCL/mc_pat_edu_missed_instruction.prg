/****************************************************************************
 Author:        Rene Ramos - IT Mayo Clinic
 Date Written:  06/2014
 Report Title:	Patient Education Missed Instruction
 Source File:  	mc_pat_edu_missed_instruction.prg
 Object Name:   mc_pat_edu_missed_instruction
 Directory:     MAYO_PRG:
 
 Program purpose: 	Report to identify patient education materials documented in Pat ED module
 
                        MODIFICATION CONTROL LOG
******************************************************************************
Mod    	Date      		Engineer        MRDOS/PROJECT  		Description of Modification
---    	--------        -------------	-------------		--------------------------
000		08/13/2014		Rene Ramos/DM   MRDOS 25580 		Initial Release
001	   	08/25/2014	   	Rene Ramos		Recalling 25580 	Added new Encounter Type and modified
 															data collection parameters
*************************END OF MOD BLOCK ***************************************/
 
drop program mc_pat_edu_missed_instruction go
create program mc_pat_edu_missed_instruction
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Facility:" = ""
	, "Start Date:" = "CURDATE"
	, "End Date:" = "CURDATE"
 
with OUTDEV, CLIN_CD, SDATE, EDATE
 
 
/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
 
set clin_var = cnvtint($CLIN_CD)
set start_dt = concat($SDATE, " 00:00:00")
set ended_dt = concat($EDATE, " 23:59:59")
 
;DM
declare org_name = vc
declare org_id = f8
declare org_id2 = f8
 
if(clin_var = 1)
	set org_id = 1			;FL
	set ord_id2= 1
	set org_name = "Mayo Clinic FL"
elseif (clin_var=2)
	set org_id = 4043906	;AZ
	set org_id2 = 4072817
	set org_name = "Mayo Clinic AZ"
elseif (clin_var=3)
	set org_id = 2850370	;FL hosp
	set ordid2 = 2850370
	set org_name = "Mayo Hospital FL"
else
	set org_id = 4043922	;AZ hosp
	set org_name = "Mayo Hospital AZ"
endif
;DM
 
 
 record tmp
(
	1	num_days = i4
	1	cnt = i4
	1 	qual[*]
	  	2	person_id = f8
	  	2	encntr_id = f8
		2  	patname = vc
		2	mrn = vc
		2	acct = vc
		2   enc_type_cd = f8
		2   enc_type = vc
		2   diag_disp = vc
		2	diagnosis = vc
		2	diag_code = vc
		2	instruction = vc
		2   extra_date = vc
		2   org_name = vc
		2   active_ind = i4
		2   signed = vc
		2  	admit_dt = vc
		2	disch_dt = vc
		2   nomen_id = f8
;001
		2   signed_id = f8
		2   doc_id = f8
		2   create_date = vc
		2   updt_date = vc
		2   locat_txt = vc
;001
)
 
 
declare enctype_cd1 = f8 with constant(uar_get_code_by("DISPLAYKEY",71,"OBSERVATION")),protect
declare enctype_cd2 = f8 with constant(uar_get_code_by("DISPLAYKEY",71,"INPATIENT")),protect
declare enctype_cd3 = f8 with constant(uar_get_code_by("DISPLAYKEY",71,"MCJPATIENT")),protect
declare enctype_cd4 = f8 with constant(uar_get_code_by("DISPLAYKEY",71,"OPINABED")),protect
declare enctype_cd5 = f8 with constant(uar_get_code_by("DISPLAYKEY",71,"MCAPATIENT")),protect
declare enctype_cd6 = f8 with constant(uar_get_code_by("DISPLAYKEY",71,"PRIMARYCARE")),protect
;001
declare enctype_cd7 = f8 with constant(uar_get_code_by("DISPLAYKEY",71,"MCAHOSPITALC")),protect
;001
 
;new
declare icd9_cd	= f8 with public, constant(uar_get_code_by("MEANING", 400, "ICD9"))
declare icd10_cd = f8 with public, constant(uar_get_code_by("MEANING", 400, "ICD10-CM"))
;new
 
 
/**************************************************************
; DVDev Start Coding
**************************************************************/
 
 
set tmp->num_days = datetimediff(cnvtdatetime(ended_dt),cnvtdatetime(start_dt),1)
set tmp->num_days =  tmp->num_days + 1
 
 
if(tmp->num_days <= 31)	;validating date range
 
select distinct into "nl:"
patname = substring(1,30,p.name_full_formatted),
mrn = substring(1,15,ea2.alias),
acct = substring(1,15,ea1.alias),
dg.diagnosis_id
 
from diagnosis dg,
person p,
encounter e,
encntr_alias ea1,
encntr_alias ea2,
nomenclature n,
pat_ed_document ped,
pat_ed_doc_activity pda,
prsnl pr
 
;001 plan ped where ped.signed_dt_tm >= cnvtdatetime(start_dt)
;001 and ped.signed_dt_tm <= cnvtdatetime(ended_dt)
plan ped where ped.create_dt_tm >= cnvtdatetime(start_dt)
and ped.create_dt_tm <= cnvtdatetime(ended_dt)
;001
 
join pda where pda.pat_ed_doc_id = ped.pat_ed_document_id
 
join dg where dg.person_id = ped.person_id
and dg.encntr_id = ped.encntr_id
and dg.diagnosis_display != " "
and dg.active_ind = 1
 
join p where p.person_id = dg.person_id
 
join e where e.encntr_id = dg.encntr_id
and e.person_id = dg.person_id
and e.organization_id in (org_id, org_id2)
and e.encntr_type_cd in( enctype_cd1,enctype_cd2,enctype_cd3,enctype_cd4,enctype_cd5,enctype_cd6,
;001
						enctype_cd7 )	;(5827,301750125, 5808, 5823, 31507593, 750280422,301750275)
;001
 
join ea1 where ea1.encntr_id = e.encntr_id
and ea1.encntr_alias_type_cd = 141
and ea1.active_ind = 1
and ea1.end_effective_dt_tm > cnvtdatetime(curdate, curtime)
 
join ea2 where ea2.encntr_id = e.encntr_id
and ea2.encntr_alias_type_cd = 143
and ea2.active_ind = 1
and ea2.end_effective_dt_tm > cnvtdatetime(curdate, curtime)
 
join n where n.nomenclature_id = dg.nomenclature_id
;new
and n.source_vocabulary_cd in (icd9_cd, icd10_cd)
;new
 
join pr where pr.person_id=outerjoin(ped.signed_id)
 
order by patname, dg.diagnosis_display
 
head report
cnt = 0
 
 
head ped.pat_ed_document_id
 
val1 = findstring("CUSTOM",pda.instruction_name,1,0)
val2 = findstring("Custom",pda.instruction_name,1,0)
val3 = findstring("custom",pda.instruction_name,1,0)
 
if(val1 > 0 or val2 > 0 or val3 > 0)
 
cnt = cnt + 1
stat = alterlist(tmp->qual, cnt + 1)
 
tmp->qual[cnt]->person_id = dg.person_id
tmp->qual[cnt]->encntr_id = dg.encntr_id
tmp->qual[cnt]->patname = patname
tmp->qual[cnt]->mrn = mrn
tmp->qual[cnt]->acct = acct
tmp->qual[cnt]->enc_type = uar_get_code_display(e.encntr_type_cd)
tmp->qual[cnt]->diagnosis = n.source_string
tmp->qual[cnt]->diag_disp = dg.diagnosis_display
tmp->qual[cnt]->diag_code = substring(1,20,n.source_identifier)
tmp->qual[cnt]->instruction = pda.instruction_name
tmp->qual[cnt]->enc_type_cd = e.encntr_type_cd
tmp->qual[cnt]->extra_date = format(ped.signed_dt_tm, "mm/dd/yy hh:mm;;d")
tmp->qual[cnt]->org_name = org_name
tmp->qual[cnt]->active_ind = pda.active_ind
;001
tmp->qual[cnt]->signed_id = ped.signed_id
tmp->qual[cnt]->create_date = format(ped.create_dt_tm, "mm/dd/yy hh:mm;;d")
tmp->qual[cnt]->updt_date = format(ped.updt_dt_tm, "mm/dd/yy hh:mm;;d")
tmp->qual[cnt]->doc_id = ped.pat_ed_document_id
tmp->qual[cnt]->locat_txt = uar_get_code_display(e.loc_nurse_unit_cd)
;001
 
 
if (ped.signed_id>0.00)
  tmp->qual[cnt]->signed=substring(1,30,pr.name_full_formatted)
endif
 
if(e.encntr_type_cd = 5823)		;Inpatient
	tmp->qual[cnt]->admit_dt = format(e.arrive_dt_tm, "mm/dd/yy hh:mm;;d")
	tmp->qual[cnt]->disch_dt = format(e.disch_dt_tm, "mm/dd/yy hh:mm;;d")
	tmp->qual[cnt]->nomen_id = dg.nomenclature_id
endif
 
tmp->cnt = cnt
 
endif
 
with format
 
 
 
 
;//Printing Section
 
select DISTINCT into  $OUTDEV
 
patient_name = substring(1,40,tmp->qual[d.seq]->patname),
mrn = substring(1,15,tmp->qual[d.seq]->mrn),
acct = substring(1,15,tmp->qual[d.seq]->acct),
enc_type = substring(1,15,tmp->qual[d.seq]->enc_type),
admit_date = substring(1,15,tmp->qual[d.seq]->admit_dt),
disch_date = substring(1,15,tmp->qual[d.seq]->disch_dt),
diagnosis_display = substring(1,120,tmp->qual[d.seq]->diag_disp),
source_string_desc = substring(1,120,tmp->qual[d.seq]->diagnosis),
source_identifier = substring(1,15,tmp->qual[d.seq]->diag_code),
instructions = substring(1,120,tmp->qual[d.seq]->instruction),
signed_date = tmp->qual[d.seq]->extra_date,
signed_person = tmp->qual[d.seq]->signed,
creation_date = tmp->qual[d.seq]->create_date,
active_ind = tmp->qual[d.seq]->active_ind,
facility = tmp->qual[d.seq]->org_name
 
from ( dummyt  d with seq = tmp->cnt )
Plan d
 
with format, separator = " "
 
 
else
	select  into  $OUTDEV
	from ( dummyt  d )
 
	detail
 
 		call print ( calcpos ( 50 ,  50 )),
 			"{f/8}{cpi/10}{b}Warning..... "
 		call print ( calcpos ( 50 ,  80 )),"Please select a date range lower or equal to 1 Month  "
 		row +1
 		call print ( calcpos ( 50 ,  120 )),"{cpi/12}{b}Current Selection:    From: ",$SDATE,"  To  ",$EDATE
 		row +1
 		call print ( calcpos ( 50 ,  160 )),"{cpi/10}{b}Facility:      ",org_name
 
 	with  nocounter , maxrow = 100 , maxcol = 250 , dio = postscript
 
endif	;//end date validation
 
 
/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
 
end
go