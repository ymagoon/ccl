/**************************************************************************
                      MODIFICATION CONTROL LOG                 *
**************************************************************************
 Mod Date     Engineer      Comment
 --- -------- ------------  ---------------------------------------
 000 01/19/12 Akcia - SE    Initial release
 001 07/05/12 Akcia - SE	make facility 4 characters instead of 2
 002 07/18/12 Akcia - SE    add date range run for to output and add active_ind check
 							custom table join and add specialty and add active_ind check
 							custom table join
 003 08/13/12 Akcia - SE    add totals at facility and report levels; set separator to flex for csv file
 004 08/21/12 Akcia - SE    add DB2 code
*************************************************************************/
drop program mayo_mn_clinic_med_rec_mu:dba go
create program mayo_mn_clinic_med_rec_mu:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Start Date" = CURDATE
	, "End Date" = CURDATE
	, "Site" = ""
 
with OUTDEV, start_date, end_date, site

 /*** START 004 ***/
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
;*** Write instance ccl ran in to the log file
;SET Iname = fillstring(10," ")
;SELECT INTO value("mayo_logfiles:mayo_instance2.log")
;  run_date = format(sysdate,";;q")
; ,Iname = substring(1,7,instance_name)
;FROM v$instance
;DETAIL
;  col  1 run_date
;  col +1 curprog
;  col +1 " *Instance="
;  col +1 Iname
;with nocounter
;   , format
;****************** End of INSTANCE 2 routine ************************
/*** END 004 ***/
 
declare attending_cd = f8 with protect, constant(uar_get_code_by("MEANING", 333, "ATTENDDOC"))
declare clin_outpat_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 71, "CLINICOUTPATIENT"))
declare user_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 263, "USERLOCATION"))
declare npi_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 263, "NPI"))
declare with_sep = c1  				;003
 
declare ops_ind = c1 with noconstant("N")
set ops_ind =  validate(request->batch_selection, "Z")
 
if (ops_ind = "Z")
	set beg_dt = cnvtdatetime(cnvtdate($start_date),0)
  	set end_dt = cnvtdatetime(cnvtdate($end_date),235959)
  	set with_sep = " " 				;003
else
	set beg_dt = datetimefind(cnvtlookbehind("1,M",sysdate),"M","B","B")
  	set end_dt = datetimefind(cnvtlookbehind("1,M",sysdate),"M","E","E")
  	set with_sep = "," 				;003
endif
 
record data (
1 facility[*]
  2 name = vc
  2 physician[*]
    3 name = vc
    3 npi = vc
    3 inpat_encs = f8
    3 admit_comp = f8
    3 admit_percent = f8
    3 disch_encs = f8
    3 disch_comp = f8
    3 disch_percent = f8
    3 specialty = vc 			;002
;003 start
1 fac_admit_encs = f8
1 fac_admit_comp = f8
1 fac_disch_encs = f8
1 fac_disch_comp = f8
1 tot_admit_encs = f8
1 tot_admit_comp = f8
1 tot_admit_perc = f8
1 tot_disch_encs = f8
1 tot_disch_comp = f8
1 tot_disch_perc = f8
;003 end
)
 
 
select into "nl:"
;001 fac_name = substring(1,2,pa.alias),
fac_name = substring(1,4,pa.alias),		;001
e.encntr_id ,
pl.name_full_formatted,
epr.prsnl_person_id,
ore1.order_recon_id
from
encounter e,
encntr_prsnl_reltn epr,
prsnl pl,
prsnl_alias pa,
prsnl_alias pa1,
order_recon ore1
 
plan e
where e.reg_dt_tm between cnvtdatetime(beg_dt) and cnvtdatetime(end_dt)
  and e.active_ind = 1
;  and e.loc_facility_cd = (select cv.code_value from code_value cv where cv.code_value = e.loc_facility_cd
; 					 		and cv.display_key = value(concat(trim($site,3),"*"))
; 					 		and cv.description != "*Hospital*")
  and e.encntr_type_cd in (clin_outpat_cd)
  and e.loc_nurse_unit_cd = (select cust.loc_cd from mhscix.cust_report_location cust
  								where cust.loc_cd = e.loc_nurse_unit_cd
  								  and cust.rpt_name = "MedRecClinic"
  								  and cust.loc_type = "NURSEUNIT"
  								  and cust.loc_name = value(concat(trim($site,3),"*"))
 								  and cust.active_ind = 1)					;002
 
join epr
where epr.encntr_id = e.encntr_id
  and epr.encntr_prsnl_r_cd = attending_cd
  and epr.end_effective_dt_tm > sysdate
  and epr.active_ind = 1
 
join pl
where pl.person_id = epr.prsnl_person_id
 
join pa
where pa.person_id = outerjoin(pl.person_id)
  and pa.alias_pool_cd = outerjoin(user_cd)
  and pa.active_ind = outerjoin(1)
  and pa.end_effective_dt_tm > outerjoin(sysdate)
 
join pa1
where pa1.person_id = outerjoin(pl.person_id)
  and pa1.alias_pool_cd = outerjoin(npi_cd)
  and pa1.active_ind = outerjoin(1)
  and pa1.end_effective_dt_tm > outerjoin(sysdate)
 
join ore1
where ore1.encntr_id = outerjoin(e.encntr_id)
  and ore1.recon_type_flag = outerjoin(3)
 
 
order fac_name, pl.name_full_formatted, e.encntr_id
 
head report
fcnt = 0
pcnt = 0
;002  start
fcnt = fcnt + 1
stat = alterlist(data->facility,fcnt)
data->facility[fcnt]->name = concat(" Date Range:  ",format(cnvtdate($start_date),"mm/dd/yy;;d")," - ",
 								format(cnvtdate($end_date),"mm/dd/yy;;d"))
pcnt = pcnt + 1
stat = alterlist(data->facility[fcnt]->physician,pcnt)
data->facility[fcnt]->physician[pcnt]->name = " "
;002 end
 
head fac_name
fcnt = fcnt + 1
stat = alterlist(data->facility,fcnt)
if (fac_name > " ")
  data->facility[fcnt]->name = fac_name
else
  data->facility[fcnt]->name = "Unknown"
endif
 
pcnt = 0
 
head pl.name_full_formatted
pcnt = pcnt + 1
stat = alterlist(data->facility[fcnt]->physician,pcnt)
if (pl.person_id > 0)
  data->facility[fcnt]->physician[pcnt]->name = pl.name_full_formatted
else
  data->facility[fcnt]->physician[pcnt]->name = "Unknown"
endif
data->facility[fcnt]->physician[pcnt]->npi = pa1.alias
data->facility[fcnt]->physician[pcnt]->specialty = pa.alias			;002
 
head e.encntr_id
data->facility[fcnt]->physician[pcnt]->disch_encs = data->facility[fcnt]->physician[pcnt]->disch_encs + 1
 
if (ore1.order_recon_id > 0)
  data->facility[fcnt]->physician[pcnt]->disch_comp = data->facility[fcnt]->physician[pcnt]->disch_comp + 1
endif
 
foot pl.name_full_formatted
data->facility[fcnt]->physician[pcnt]->disch_percent =
		  (data->facility[fcnt]->physician[pcnt]->disch_comp/data->facility[fcnt]->physician[pcnt]->disch_encs)*100

;start 003
data->fac_admit_encs = data->fac_admit_encs + data->facility[fcnt]->physician[pcnt]->inpat_encs
data->fac_admit_comp = data->fac_admit_comp + data->facility[fcnt]->physician[pcnt]->admit_comp
data->fac_disch_encs = data->fac_disch_encs + data->facility[fcnt]->physician[pcnt]->disch_encs
data->fac_disch_comp = data->fac_disch_comp + data->facility[fcnt]->physician[pcnt]->disch_comp
 
foot fac_name
pcnt = pcnt + 1
stat = alterlist(data->facility[fcnt]->physician,pcnt)
data->facility[fcnt]->physician[pcnt]->name = concat(trim(data->facility[fcnt]->name,3)," Subtotal")
data->facility[fcnt]->physician[pcnt]->inpat_encs = data->fac_admit_encs
data->facility[fcnt]->physician[pcnt]->admit_comp = data->fac_admit_comp
data->facility[fcnt]->physician[pcnt]->disch_encs = data->fac_disch_encs
data->facility[fcnt]->physician[pcnt]->disch_comp = data->fac_disch_comp
data->facility[fcnt]->physician[pcnt]->admit_percent = (data->fac_admit_comp/data->fac_admit_encs)*100
data->facility[fcnt]->physician[pcnt]->disch_percent = (data->fac_disch_comp/data->fac_disch_encs)*100
data->tot_admit_encs = data->tot_admit_encs + data->fac_admit_encs
data->tot_admit_comp = data->tot_admit_comp + data->fac_admit_comp
data->tot_disch_encs = data->tot_disch_encs + data->fac_disch_encs
data->tot_disch_comp = data->tot_disch_comp + data->fac_disch_comp
data->fac_admit_encs = 0.0
data->fac_admit_comp = 0.0
data->fac_disch_encs = 0.0
data->fac_disch_comp = 0.0
 
foot report
pcnt = pcnt + 1
stat = alterlist(data->facility[fcnt]->physician,pcnt)
data->facility[fcnt]->physician[pcnt]->name = concat(trim($site,3)," Totals")
data->facility[fcnt]->physician[pcnt]->inpat_encs = data->tot_admit_encs
data->facility[fcnt]->physician[pcnt]->admit_comp = data->tot_admit_comp
data->facility[fcnt]->physician[pcnt]->disch_encs = data->tot_disch_encs
data->facility[fcnt]->physician[pcnt]->disch_comp = data->tot_disch_comp
data->facility[fcnt]->physician[pcnt]->admit_percent = (data->tot_admit_comp/data->fac_admit_encs)*100
data->facility[fcnt]->physician[pcnt]->disch_percent = (data->tot_disch_comp/data->fac_disch_encs)*100
;003  end
 
with nocounter
 
call echorecord(data)
 
 
select into $outdev
Facility = data->facility[d.seq].name,
;002 Physician = data->facility[d.seq].physician[d1.seq].name,
;003 Physician = substring(1,50,data->facility[d.seq].physician[d1.seq].name),				;002
Physician = concat('"',substring(1,50,data->facility[d.seq].physician[d1.seq].name),'"'),				;003
Disch_Encs = data->facility[d.seq].physician[d1.seq].disch_encs,
Disch_Complete = data->facility[d.seq].physician[d1.seq].disch_comp,
Disch_Percent = data->facility[d.seq].physician[d1.seq].disch_percent,
NPI = substring(1,15,data->facility[d.seq].physician[d1.seq]->npi),
Specialty = substring(1,35,data->facility[d.seq].physician[d1.seq]->specialty)		;002
from
(dummyt d with seq = size(data->facility,5)),
(dummyt d1 with seq = 1)
 
plan d
where maxrec(d1,size(data->facility[d.seq]->physician,5))
 
join d1
 
order d.seq, d1.seq  			;003
;003  order facility, physician 

with format, 
separator = value(with_sep)  		;003
;003  separator = " "
 
 
 
end go
