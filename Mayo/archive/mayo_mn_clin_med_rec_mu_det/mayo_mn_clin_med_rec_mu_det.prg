/**************************************************************************
                      MODIFICATION CONTROL LOG                 *
**************************************************************************
 Mod Date     Engineer      Comment
 --- -------- ------------  ---------------------------------------
 000 01/19/12 Akcia - SE    Initial release
 001 07/05/12 Akcia - SE	make facility 4 characters instead of 2
 002 07/18/12 Akcia - SE    add date range run for to output and add active_ind check
 							custom table join and add specialty; set separator 
 							to flex for csv file
 003 08/21/12 Akcia - SE    add DB2 code
*************************************************************************/
drop program mayo_mn_clin_med_rec_mu_det:dba go
create program mayo_mn_clin_med_rec_mu_det:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Start Date" = CURDATE
	, "End Date" = CURDATE
	, "Site" = ""
 
with OUTDEV, start_date, end_date, site

 /*** START 003 ***/
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
/*** END 003 ***/
 
declare attending_cd = f8 with protect, constant(uar_get_code_by("MEANING", 333, "ATTENDDOC"))
declare clin_outpat_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 71, "CLINICOUTPATIENT"))
declare user_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 263, "USERLOCATION"))
declare npi_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 263, "NPI"))
declare fin_cd = f8 with protect, constant(uar_get_code_by("MEANING", 319, "FIN NBR"))
declare with_sep = c1  				;002
 
declare ops_ind = c1 with noconstant("N")
set ops_ind =  validate(request->batch_selection, "Z")
 
if (ops_ind = "Z")
	set beg_dt = cnvtdatetime(cnvtdate($start_date),0)
  	set end_dt = cnvtdatetime(cnvtdate($end_date),235959)
  	set with_sep = " " 				;002
else
	set beg_dt = datetimefind(cnvtlookbehind("1,M",sysdate),"M","B","B")
  	set end_dt = datetimefind(cnvtlookbehind("1,M",sysdate),"M","E","E")
  	set with_sep = "," 				;002
endif
 
select distinct into $outdev
;001  fac_name = substring(1,2,pa.alias),
Date_Range = concat(format(cnvtdate($start_date),"mm/dd/yy;;d")," - ",format(cnvtdate($end_date),"mm/dd/yy;;d")),  ;002
fac_name = substring(1,4,pa.alias),		;001
;002  Patient_Name = p.name_full_formatted,
Patient_Name = concat('"',p.name_full_formatted,'"'),				;002
FIN = cnvtalias(ea.alias,ea.alias_pool_cd),
Disch_Date = format(e.disch_dt_tm,"mm/dd/yy;;d"),
;002  Attending_Provider = pl.name_full_formatted,
Attending_Provider = concat('"',pl.name_full_formatted,'"'),		;002
NPI = pa1.alias,
Med_Rec_Signature = if (ore1.order_recon_id > 0)
						"Yes"
				  	else
				  	   "No"
				  	endif,
Nurse_unit = uar_get_code_description(e.loc_nurse_unit_cd),
Specialty = pa.alias					;002
from
encounter e,
person p,
encntr_alias ea,
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
 
join p
where p.person_id = e.person_id
 
join ea
where ea.encntr_id = e.encntr_id
  and ea.encntr_alias_type_cd = fin_cd
  and ea.end_effective_dt_tm > sysdate
  and ea.active_ind = 1
 
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
 
 
order fac_name, pl.name_full_formatted, e.encntr_id, disch_date, attending_provider
 
 
with nocounter,format, 
separator = value(with_sep)  		;002
;002  separator = " "
 
 
end go
