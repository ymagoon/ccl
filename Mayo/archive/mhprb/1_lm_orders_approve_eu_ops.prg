/***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
 *000 00/00/00 Unknown              Unknown                            *
 *001 10/25/11 Rob Banks            Modify to use DB2                  *
 *002 02/28/13 Akcia                Change mod 001 to lookup password in registry
 ******************** End of Modification Log **************************/
drop program 1_lm_orders_approve_eu_ops:dba go
create program 1_lm_orders_approve_eu_ops:dba
 
/*prompt
	"Output to File/Printer/MINE" = "MINE"
 
with OUTDEV;, FACILITY_GRP, sdate, edate*/
 
prompt
	"Output to e-mail" = "wiersgalla.mary@mayo.edu"
 
with OUTDEV
 
;;;/*** START 001 ***/
;;;;*********************************************************************
;;;;*** If PROD / CERT then run as 2nd oracle instance to improve
;;;;*** efficiency. Will auto Fail-over to Instance 1 if Instance 2 down.
;;;;*********************************************************************
;;;IF(CURDOMAIN = "PROD")
;;;  FREE DEFINE oraclesystem
;;;  DEFINE oraclesystem 'v500/fullmoon@mhprbrpt'
;;;ELSEIF(CURDOMAIN = "MHPRD")
;;;  FREE DEFINE oraclesystem
;;;  DEFINE oraclesystem 'v500/fullmoon@mhprbrpt'
;;;ELSEIF(CURDOMAIN="MHCRT")
;;;  FREE DEFINE oraclesystem
;;;  DEFINE oraclesystem 'v500/java4t2@mhcrtrpt'
;;;ENDIF ;CURDOMAIN
;;;;*** Write instance ccl ran in to the log file
;;;;SET Iname = fillstring(10," ")
;;;;SELECT INTO value("mayo_logfiles:mayo_instance2.log")
;;;;  run_date = format(sysdate,";;q")
;;;; ,Iname = substring(1,7,instance_name)
;;;;FROM v$instance
;;;;DETAIL
;;;;  col  1 run_date
;;;;  col +1 curprog
;;;;  col +1 " *Instance="
;;;;  col +1 Iname
;;;;with nocounter
;;;;   , format
;;;;****************** End of INSTANCE 2 routine ************************
;;;/*** END 001 ***/
 
/*** Start 002 - New Code ****/
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
/*** END 002 - New Code ***/
 
SET MaxSecs = 3600
 
 
record facilities
( 1 qual[*]
	2 facility_cd = f8
)
 
select into "nl:"
cv.* from code_value cv
plan cv where cv.code_set = 220 and cv.cdf_meaning = "FACILITY"
and cv.display_key = value(concat(trim(/*$facility_grp*/"EU",3),"*"))
 
head report
	f_cnt = 0
detail
	f_cnt = f_cnt + 1
	stat = alterlist(facilities->qual,f_cnt)
	facilities->qual[f_cnt].facility_cd = cv.code_value
 
 
with nocounter
declare num = i2
 
/* NOTIFICATION_STATUS_FLAG       The status of the notification.    1 = Pending; 2 = Completed; 3 = Refused; 4
 = Forwarded; 5 = Admin-Cleared;  6 = No Longer Needed
*/
 
;set beg_dt = $sdate
;set end_dt = $edate
 
DECLARE output_file = VC WITH NOCONSTANT ( "" )
;SET output_file = CONCAT (FORMAT ( CURDATE , "MMDDYY;;q" ), FORMAT ( CURTIME , "HHMM;1;m" ), "_orderstoapprove.csv" )
SET output_file = CONCAT ("orders_to_approve_", FORMAT ( CURDATE , "MMDDYY;;q" ), "_" ,FORMAT ( CURTIME , "HHMM;1;m" ), ".csv")
SET message_file = "orderstoapprove.msg"
 
 
SELECT distinct INTO value(output_file) ;$outdev
 
	Patient_Name = p.name_full_formatted
    ;, Clinic_MRN = pa.alias
   ,  MRN = ea.alias
   ;, MRN_Type = uar_get_code_display(ea.alias_pool_cd)
 ;, FIN = ea.alias
	, Order_Name = o.hna_order_mnemonic
	;, o.order_id
	, Action = uar_get_code_display(oa.action_type_cd)
	, Create_Date = format(cnvtdatetime(ont.notification_dt_tm), "MM/DD/YYYY;;D")
	, Create_Time = format(cnvtdatetime(ont.notification_dt_tm), "HH:MM:SS;;D")
	;, Communication_Type = uar_get_code_description(oa.communication_type_cd)
	, Provider = PRS.NAME_FULL_FORMATTED
	;, Department = uar_get_code_description(prs.prim_assign_loc_cd)
	;, Department = pa.alias
	, Department = IF(PR.ALIAS IN ("EUMC Allergy/Immunology")) "ALLERGY & ASTHMA"
 
ELSEIF(PR.ALIAS IN ("EUBM Anticoagulation Services", "EUCF Anticoagulation Services",
"EULH Anticoagulation Services", "EUOM Anticoagulation Services"))  "ANTICOAGULATION SERVICE"
 
ELSEIF(PR.ALIAS IN ("EULH Behavioral Health"))  "BEHAVIORAL HEALTH - INPATIENT"
 
ELSEIF(PR.ALIAS IN ("EUMB Behavioral Health"))  "BEHAVIORAL HEALTH - OUTPATIENT"
 
ELSEIF(PR.ALIAS IN ("EUML Cardiology"))  "CARDIOLOGY"
 
ELSEIF(PR.ALIAS IN ("EUML Cardiovascular and Thoracic Surgery"))  "CARDIOVASCULAR SURGERY"
 
ELSEIF(PR.ALIAS IN ("EUBM Bloomer Clinic", "EUCM Colfax Clinic", "EUCF Chippewa Falls Clinic",
"EUBL Emergency Department"))  "CHIPPEWA VALLEY"
 
ELSEIF(PR.ALIAS IN ("EUMC Dermatology"))  "DERMATOLOGY"
 
ELSEIF(PR.ALIAS IN ("EUMC Diabetes Education/Nutrition Services"))  "DIABETES EDUCATION"
 
ELSEIF(PR.ALIAS IN ("EUDB Dialysis Center-Barron", "EUDM Dialysis Center-Menomonie",
"EUDS Dialysis Center-London Road", "EULH-Dialysis Center"))  "DIALYSIS"
 
ELSEIF(PR.ALIAS IN ("EUML Gastroenterology"))  "DIGESTIVE HEALTH"
 
ELSEIF(PR.ALIAS IN ("EUMC Otolaryngology"))  "EAR, NOSE & THROAT"
 
ELSEIF(PR.ALIAS IN ("EULH Emergency Department"))  "EMERGENCY DEPARTMENT"
 
ELSEIF(PR.ALIAS IN ("EUMC Endocrinology"))  "ENDOCRINOLOGY"
 
ELSEIF(PR.ALIAS IN ("EUMC Express Care South Point", "EUMC Express Care West Ridge"))  "EXPRESS CARE"
 
ELSEIF(PR.ALIAS IN ("EUMC Ophthalmology/Optometry"))  "EYE CARE CENTER"
 
ELSEIF(PR.ALIAS IN ("EUMC Family Medicine", "EUML Family Medicine"))  "FAMILY MEDICINE"
 
ELSEIF(PR.ALIAS IN ("EUML Podiatry"))  "FOOT & ANKLE SERVICES"
 
ELSEIF(PR.ALIAS IN ("EUML HERS/Wellness Center"))  "HERS BREAST CENTER"
 
ELSEIF(PR.ALIAS IN ("EULH Medical/Surgical A", "EULH North Hall - 4th Floor", "EULH South Hall - 4th Floor",
"EULH North Hall - 3rd Floor", "EULH South Hall - 3rd Floor"))  "HOSPITAL MEDICINE"
 
ELSEIF(PR.ALIAS IN ("EUML Infectious Disease"))  "INFECTIOUS DISEASE"
 
ELSEIF(PR.ALIAS IN ("EUMC Internal Medicine-MCC", "EUML Internal Medicine-MCLC"))  "INTERNAL MEDICINE"
 
;ELSEIF(PR.ALIAS IN ("EULH North Hall - 4th Floor", "EULH South Hall - 4th Floor"))  "MEDICAL/SURGICAL"
 
;ELSEIF(PR.ALIAS IN ("EULH North Hall - 3rd Floor", "EULH South Hall - 3rd Floor"))  "MEDICAL TELEMETRY"
 
ELSEIF(PR.ALIAS IN ("EUML Nephrology"))  "NEPHROLOGY"
 
ELSEIF(PR.ALIAS IN ("EUML Neurodiagnostics"))  "NEURODIAGNOSTICS/SLEEP DISORDERS CENTER"
 
ELSEIF(PR.ALIAS IN ("EUML Neurology"))  "NEUROLOGY"
 
ELSEIF(PR.ALIAS IN ("EUBC Barron Clinic", "EUCC Cameron Clinic", "EURL Rice Lake Clinic",
"EUCH Chetek Clinic", "EUPF Prairie Farm Clinic", "EUBH Emergency Department",
"EUBH-Medical/Surgical", "EUBH Obstetrics"))  "NORTHLAND"
 
ELSEIF(PR.ALIAS IN ("EUOM Osseo Clinic", "EUMM Mondovi Clinic", "EUOH Emergency Department"))
"OAKRIDGE"
 
ELSEIF(PR.ALIAS IN ("EUMC Occupational Medicine"))  "OCCUPATIONAL MEDICINE"
 
ELSEIF(PR.ALIAS IN ("EUML Oncology/Hematology"))  "ONCOLOGY"
 
ELSEIF(PR.ALIAS IN ("EUML Orthopedics"))  "ORTHOPEDICS"
 
ELSEIF(PR.ALIAS IN ("EUPC Pain Clinic"))  "PAIN CLINIC"
 
ELSEIF(PR.ALIAS IN ("EULH Pathology Laboratory"))  "PATHOLOGY"
 
ELSEIF(PR.ALIAS IN ("EUMC Pediatrics/Adolescent Medicine",
"EUML Pediatrics/Adolescent Medicine"))  "PEDIATRIC & ADOLESCENT MEDICINE"
 
ELSEIF(PR.ALIAS IN ("EUML Physical Medicine & Rehabilitation"))  "PHYSICAL MEDICINE & REHABILITATION"
 
ELSEIF(PR.ALIAS IN ("EUML Plastic Surgery"))  "PLASTIC & RECONSTRUCTIVE SURGERY"
 
ELSEIF(PR.ALIAS IN ("EUML Pulmonology"))  "PULMONOLOGY"
 
ELSEIF(PR.ALIAS IN ("EULH Radiation Oncology"))  "RADIATION ONCOLOGY"
 
ELSEIF(PR.ALIAS IN ("EUCH Radiology", "EULH Radiology", "EUMC Radiology",
"EUML Radiology", "EURL Radiology"))  "RADIOLOGY"
 
ELSEIF(PR.ALIAS IN ("EULH Occupational Therapy", "EUML Occupational/Hand Therapy"))
"REHABILITATION SERVICES - OCCUPATIONAL THERAPY"
 
ELSEIF(PR.ALIAS IN ("EULH Physical Therapy", "EUML Physical Therapy-MCLC"))
"REHABILITATION SERVICES - PHYSCIAL THERAPY"
 
ELSEIF(PR.ALIAS IN ("EULH Speech Therapy"))  "REHABILITATION SERVICES - SPEECH THERAPY"
 
ELSEIF(PR.ALIAS IN ("EUMC Rheumatology"))  "RHEUMATOLOGY"
 
ELSEIF(PR.ALIAS IN ("EUML Spine and Neurological Surgery"))  "SPINE & NEUROLOGICAL SURGERY"
 
ELSEIF(PR.ALIAS IN ("EUML Surgery"))  "SURGERY"
 
ELSEIF(PR.ALIAS IN ("EUMC UrgentCare"))  "URGENT CARE"
 
ELSEIF(PR.ALIAS IN ("EUML Urology"))  "UROLOGY"
 
ELSEIF(PR.ALIAS IN ("EUMC Weight Management Center (HMR)"))  "WEIGHT MANAGEMENT SERVICES"
 
ELSEIF(PR.ALIAS IN ("EUML Women's Health/Family Medicine"))  "WOMEN'S HEALTH"
 
ELSE
"***NO DEPARTMENT LISTED"
ENDIF
 
 
FROM
	orders   o
	, encounter   e
	, person   p
	, order_action   oa
	, order_notification   ont
	, PRSNL   PRS
	, encntr_alias ea
	;, person_alias pa
	, prsnl_alias pr
 
plan ont
where ont.notification_status_flag = 1   ;pending
;and ont.notification_dt_tm between cnvtdatetime(cnvtdate(beg_dt),0)
;and cnvtdatetime(cnvtdate(end_dt),235959)
and ont.notification_dt_tm >= cnvtdatetime("01-MAR-2009")
and ont.notification_dt_tm <= cnvtdatetime(CURDATE, CURTIME3)
and ont.to_prsnl_id != 0
and ont.to_prsnl_id != 1837007
and ont.to_prsnl_id != 749923
 
join oa where oa.order_id = ont.order_id
and oa.communication_type_cd in (2561, 2560)  ;telephone, verbal
 
join o where o.order_id = ont.order_id
 
join e where e.encntr_id = o.encntr_id
and expand(num, 1, size(facilities->qual,5), e.loc_facility_cd,
facilities->qual[num].facility_cd)
/*and e.encntr_type_cd != (    7136874.00) ;Lab/Rad
and e.encntr_type_cd != (   10579519.00) ;Clinic Outpatient
and e.encntr_type_cd != (   24987152.00) ;Outpatient Message
and e.encntr_type_cd != (    7197954.00) ;Dictaphone
and e.encntr_type_cd != (    7207626.00) ;Radiology
and e.encntr_type_cd != (    3990510.00) ;Emergency
and e.encntr_type_cd != (    3990509.00) ;Dialysis
*/
 
join ea
where ea.encntr_id = e.encntr_id
;and ea.encntr_alias_type_cd =     1077  ;FIN
and ea.encntr_alias_type_cd = 1079.00   ;MRN
and ea.active_ind = 1 and ea.end_effective_dt_tm > cnvtdatetime("30-DEC-2100")
 
join p where p.person_id = e.person_id
and p.name_last_key != "TESTPATIENT"
and p.name_last_key != "TEST"
and p.name_last_key != "TESTING"
and p.name_last_key != "ZTEVRON"
 
 
join prs
where prs.person_id = ont.to_prsnl_id
 
 
/*join pa
where pa.person_id = p.person_id
and pa.alias_pool_cd = 3844507.00   ;Clinic MRN
and pa.active_ind = 1 and pa.end_effective_dt_tm > cnvtdatetime("30-DEC-2100")*/
 
join pr
where pr.person_id = outerjoin(prs.person_id)
and pr.alias_pool_cd = outerjoin(75153977)
and pr.active_ind = outerjoin(1)
 
 
 
ORDER BY
	Create_date
	, Create_time
	, Patient_Name
	 , ont.order_notification_id
 
;WITH format, skipreport = 1, SEPARATOR=" ", TIME= VALUE( MaxSecs ), dio = 08;, PCFORMAT ('"', ',' , 1)
WITH TIME = VALUE( MaxSecs ), SKIPREPORT = 1, DIO= 08, PCFORMAT ('"', ',' , 1), FORMAT=STREAM, FORMAT
 
 
Set dclcom1 = concat( 'echo "Attached is the Orders to Approve Report. \n\n',
						' " > ',
	message_file, ' && ', 'uuencode ', output_file, ' ',
	output_file, ' >> ',
	message_file, ' && ', 'cat ',
	message_file, ' | mailx -s "Orders to Approve Report" ', $outdev )
set dcllen1 = size( trim( dclcom1 ) )
set dclstatus = 0
call dcl( dclcom1, dcllen1, dclstatus )
 
;;/*** START 001 ***/
;;;*** After report put back to instance 1
;;IF(CURDOMAIN = "PROD")
;;  FREE DEFINE oraclesystem
;;  DEFINE oraclesystem 'v500/fullmoon@mhprb1'
;;ELSEIF(CURDOMAIN = "MHPRD")
;;  FREE DEFINE oraclesystem
;;  DEFINE oraclesystem 'v500/fullmoon@mhprb1'
;;ELSEIF(CURDOMAIN="MHCRT")
;;  FREE DEFINE oraclesystem
;;  DEFINE oraclesystem 'v500/java4t2@mhcrt1'
;;ENDIF ;CURDOMAIN
;;/*** END 001 ***/
 
/****Start 002 - New Code ***/
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
 
/***END 002 - New Code ***/
end
go
