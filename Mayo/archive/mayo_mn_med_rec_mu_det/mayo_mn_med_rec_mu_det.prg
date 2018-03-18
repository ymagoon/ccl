/**************************************************************************
                      MODIFICATION CONTROL LOG                 *
**************************************************************************
 Mod Date     Engineer      Comment
 --- -------- ------------  ---------------------------------------
 000 11/11/11 Akcia - SE    Initial release
 001 07/05/12 Akcia - SE	make facility 4 characters instead of 2
 002 07/15/12 Akcia - SE	add code_set qualification to drive to a better index
 003 07/19/12 Akcia - SE    add specialty and date range column; set separator to flex for csv file
 004 08/21/12 Akcia - SE    add DB2 code
 005 04/09/13 Akcia - SE    Change DB2 code to lookup password in registry
*************************************************************************/
drop program mayo_mn_med_rec_mu_det:dba go
create program mayo_mn_med_rec_mu_det:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Start Date" = CURDATE
	, "End Date" = CURDATE
	, "Site" = ""
 
with OUTDEV, start_date, end_date, site

;005 comment out old db2 code
;; /*** START 004 ***/
;;;*********************************************************************
;;;*** If PROD / CERT then run as 2nd oracle instance to improve
;;;*** efficiency. Will auto Fail-over to Instance 1 if Instance 2 down.
;;;*********************************************************************
;;IF(CURDOMAIN = "PROD")
;;  FREE DEFINE oraclesystem
;;  DEFINE oraclesystem 'v500/fullmoon@mhprbrpt'
;;ELSEIF(CURDOMAIN = "MHPRD")
;;  FREE DEFINE oraclesystem
;;  DEFINE oraclesystem 'v500/fullmoon@mhprbrpt'
;;ELSEIF(CURDOMAIN="MHCRT")
;;  FREE DEFINE oraclesystem
;;  DEFINE oraclesystem 'v500/java4t2@mhcrtrpt'
;;ENDIF ;CURDOMAIN
;;;*** Write instance ccl ran in to the log file
;;;SET Iname = fillstring(10," ")
;;;SELECT INTO value("mayo_logfiles:mayo_instance2.log")
;;;  run_date = format(sysdate,";;q")
;;; ,Iname = substring(1,7,instance_name)
;;;FROM v$instance
;;;DETAIL
;;;  col  1 run_date
;;;  col +1 curprog
;;;  col +1 " *Instance="
;;;  col +1 Iname
;;;with nocounter
;;;   , format
;;;****************** End of INSTANCE 2 routine ************************
;;/*** END 004 ***/
 
 
/*** Start 005 - New Code ****/
;****************** Begin ORACLE INSTANCE 2 routine ****************
;*** If PROD / CERT then run as 2nd oracle instance to improve
;***   efficiency. Will auto Fail-over to Instance 1 if Instance 2 down.
;***   Then after at the end, set the program back to instance 1.
;******************************************************************************
 
;*** This section calls an O/S scritp that reads the current v500 password
;***   from the Millennium registry and stores it in a file named
;***   $CCLUSERDIR/dbinfo.dat
declare dcl_command = vc
declare dcl_size = i4
declare dcl_stat = i4
 
set dcl_command = "/mayo/procs/req_query.ksh"
set dcl_size = size(dcl_command)
set dcl_stat = 0
 
call dcl(dcl_command,dcl_size,dcl_stat)
 
;*** Next the password is read from the dbinfo.dat file to variable 'pass'.
FREE DEFINE RTL
DEFINE RTL IS "dbinfo.dat"
 
declare pass=vc
 
SELECT DISTINCT INTO "NL:"
  line = substring(1,30,R.LINE)   ; 9,9       10,9
FROM RTLT R
PLAN R
 
detail
 
if (line = "dbpw*")
  pass_in=substring(9,15,line)
  pass=trim(pass_in,3)
endif
 
with counter
 
;*** Now we are finished with the dbinfo.dat file and will delete it.
set dcl_command = ""
set dcl_command = "rm $CCLUSERDIR/dbinfo.dat"
set dcl_size = size(dcl_command)
set dcl_stat = 0
 
call dcl(dcl_command,dcl_size,dcl_stat)
 
declare system=vc
 
;*** This section redifines the OracleSystem variable pointing it to
;***   database instance 2 using the password read in above.
;*** This only applies to PRD and CRT, because they are the only domains
;***   that have multiple instance databases.
IF (curdomain = "MHPRD")
  Free define oraclesystem
  set system=build(concat('v500/', pass, '@mhprdrpt'))
  DEFINE oraclesystem system
ELSEIF (CURDOMAIN="MHCRT")
    FREE DEFINE oraclesystem
    set system=build(concat('v500/', pass, '@mhcrtrpt'))
    DEFINE oraclesystem system
ENDIF
/*** END 005 - New Code ***/
 
 
declare attending_cd = f8 with protect, constant(uar_get_code_by("MEANING", 333, "ATTENDDOC"))
declare inpatient_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 71, "INPATIENT"))
declare day_surg_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 71, "DAYSURGERY"))
declare emergency_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 71, "EMERGENCY"))
declare observation_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 71, "OBSERVATION"))
declare respite_care_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 71, "RESPITECARE"))
declare user_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 263, "USERLOCATION"))
declare fin_cd = f8 with protect, constant(uar_get_code_by("MEANING", 319, "FIN NBR"))
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
 
select distinct into $outdev
;001  Facility_Name = substring(1,2,pa.alias),
Date_Range = concat(format(cnvtdate($start_date),"mm/dd/yy;;d")," - ",format(cnvtdate($end_date),"mm/dd/yy;;d")),  ;003
Facility_Name = substring(1,4,pa.alias),		;001
;003  Patient_Name = p.name_full_formatted,
Patient_Name = concat('"',p.name_full_formatted,'"'),				;003
FIN = cnvtalias(ea.alias,ea.alias_pool_cd),
Disch_Date = format(e.disch_dt_tm,"mm/dd/yy;;d"),
;003  Attending_Provider = pl.name_full_formatted,
Attending_Provider = concat('"',pl.name_full_formatted,'"'),		;003
NPI = pa1.alias,
Admit_Med_Rec_Signature =
					if (e.encntr_type_cd in (inpatient_cd,observation_cd,respite_care_cd))
						if (ore.order_recon_id > 0)
							"Yes"
					  	else
					  	   "No"
					  	endif
					 else
					   "  "
					 endif,
Disch_Med_Rec_Signature = if (ore1.order_recon_id > 0)
						"Yes"
				  	else
				  	   "No"
				  	endif,
Nurse_unit = uar_get_code_description(e.loc_nurse_unit_cd),
Specialty = pa.alias					;003
from
encounter e,
person p,
encntr_alias ea,
encntr_prsnl_reltn epr,
prsnl pl,
prsnl_alias pa,
prsnl_alias pa1,
order_recon ore,
order_recon ore1
 
plan e
where e.disch_dt_tm between cnvtdatetime(beg_dt) and cnvtdatetime(end_dt)
  and e.active_ind = 1
  and e.loc_facility_cd = (select cv.code_value from code_value cv where cv.code_value = e.loc_facility_cd
 					 		and cv.code_set = 220					;002
 					 		and cv.display_key = value(concat(trim($site,3),"*"))
 					 		and cv.description = "*Hospital*")
  and e.encntr_type_cd in (inpatient_cd,observation_cd,respite_care_cd,day_surg_cd,emergency_cd)
 
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
 
join ore
where ore.encntr_id = outerjoin(e.encntr_id)
  and ore.recon_type_flag = outerjoin(1)
 
 
join ore1
where ore1.encntr_id = outerjoin(e.encntr_id)
  and ore1.recon_type_flag = outerjoin(3)
 
 
order Facility_Name, pl.name_full_formatted, e.encntr_id, disch_date, attending_provider
 
 
with nocounter,format, 
separator = value(with_sep)  		;003
;003  separator = " "

/****Start 005 - New Code ***/
;*** Restore the OracleSystem variable to its normal definition pointing
;***   to instance 1.
IF (curdomain = "MHPRD")
  Free define oraclesystem
  set system=build(concat('v500/', pass, '@mhprd1'))
  DEFINE oraclesystem system
 
ELSEIF (CURDOMAIN="MHCRT")
    FREE DEFINE oraclesystem
    set system=build(concat('v500/', pass, '@mhcrt1'))
    DEFINE oraclesystem system
 
ENDIF
 
/***END 005 - New Code ***/ 
end go
