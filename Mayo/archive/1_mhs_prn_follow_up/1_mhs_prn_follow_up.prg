drop program 1_mhs_prn_follow_up:dba go
create program 1_mhs_prn_follow_up:dba
 
 
/****************************************************************************
Program:  mayo_mn_prn_follow_up
Created by:  Scott Easterhaus (Akcia)
Created Date:  12/2009
 
Description:  see CAB 11823
 
Modifications:
1-  add post medication pain assessment value to output
2-  changed parameters to pass in WARS code	-mbw 10/19/10
3-
4-  Added substring to select variables to keep them from being cut off.
5-  Changed where it is looking for "Not Given"
6-  fix to switch to old outerjoin because two values in ce1.event_cd 
*****************************************************************************/
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Facility Group" = 0
 
with OUTDEV, facility;, start_date, end_date
 
;declare variables
declare fin_cd = f8 with protect, constant(uar_get_code_by("MEANING",319, "FIN NBR"))
declare mrn_cd = f8 with protect, constant(uar_get_code_by("MEANING",319, "MRN"))
declare day_surg_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 71, "DAYSURGERY"))
declare inpatient_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 71, "INPATIENT"))
declare emergency_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 71, "EMERGENCY"))
declare hosp_outpat_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 71, "HOSPITALOUTPATIENT"))
declare observation_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 71, "OBSERVATION"))
declare prn_response_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "PRNRESPONSETEXT"))
declare post_pain_med_cd = f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 72, "POSTMEDICATIONPAINASSESSMENT"))		;01
declare inerror_cd = f8 with protect, constant(uar_get_code_by("MEANING", 8, "INERROR"))
declare mcnt = i2
declare idx1 = i2
 
 
;declare record structures
record pain_meds(
1 qual[*]
  2 code_value = f8
)
 
record encounters(
1 qual[*]
  2 encntr_id = f8
)
 
record enc(
1 qual[*]
  2 order_id = f8
  2 person_id = f8
  2 encntr_id = f8
  2 performed_prsnl_id = f8
  2 event_end_dt_tm = dq8
  2 pat_name 							= vc
  2 clinic_mrn 						= vc
  2 fin										= vc
  2 nurse_unit 						= vc
  2 room 									= vc
  2 med_name 							= vc
  2 medication_dt_tm 			= vc
  2 med_admin_by 					= vc
  2 pain_assess_completed = vc
  2 complete_dt_tm 				= vc
  2 prn						= vc
  2 frequency				= vc
  2 post_pain_med_assess 	= vc			;01
 )
 
;get pain meds
select
from
code_value cv
where cv.code_set = 72
and cv.active_ind = 1
and cv.display_key in ("ACETAMINOPHEN","ACETAMINOPHENCODEINE","ACETAMINOPHENHYDROCODONE","ACETAMINOPHENOXYCODONE",
					"ACETAMINOPHENPENTAZOCINE","ACETAMINOPHENPROPOXYPHENE","ACETAMINOPHENTRAMADOL","ALFENTANIL","ALMOTRIPTAN",
					"ASPIRINCODEINE","ASPIRINHYDROCODONE","ASPIRINOXYCODONE","ASPIRINACETAMINCAFFEINE","BUTORPHANOL","CELECOXIB",
					"CODEINE","DICLOFENAC","ETODOLAC","FENOPROFEN","FENTANYL","FLURBIPROFEN","HYDROMORPHONE","IBUPROFEN",
					"IBUPROFENOXYCODONE","INDOMETHACIN","KETOPROFEN","KETOROLAC","LEVORPHANOL","MEFENAMICACID","MELOXICAM",
					"MEPERIDINE","METHADONE","MORPHINE","NABUMETONE","NAPROXEN","NAPROXENSUMATRIPTAN","OXYCODONE","OXYMORPHONE",
					"PIROXICAM","PROPOXYPHENE","SUFENTANIL","SULINDAC","TOLMETIN","TRAMADOL")
 
head report
mcnt = 0
 
detail
mcnt = mcnt + 1
stat = alterlist(pain_meds->qual,mcnt)
pain_meds->qual[mcnt].code_value = cv.code_value
 
with nocounter
 
;;get encounters
;select into "nl:"
;elh.encntr_id
;from
;   code_value cv
; ,
; nurse_unit nu
; ,encntr_loc_hist elh
;
;plan cv where cv.code_set = 220
;and cv.cdf_meaning = "FACILITY"
;;and cv.display_key = "EU*"
;and cv.code_value = $facility
;join nu
;where nu.loc_facility_cd = cv.code_value
;and nu.active_ind = 1
;join elh
;where elh.loc_nurse_unit_cd = nu.location_cd
;  and elh.end_effective_dt_tm >= cnvtdatetime(cnvtdate($start_date),0)
;  and elh.active_ind = 1
;  and elh.beg_effective_dt_tm+0 <= cnvtdatetime(cnvtdate($end_date),235959)
;  and elh.encntr_type_cd+0 in (inpatient_cd,observation_cd,day_surg_cd, emergency_cd,hosp_outpat_cd)
;order elh.encntr_id
;
;head report
;ecnt = 0
;
;head elh.encntr_id
;ecnt = ecnt + 1
;stat = alterlist(encounters->qual,ecnt)
;encounters->qual[ecnt].encntr_id = elh.encntr_id
;
;
;with nocounter
 
;get data
select into "nl:" ;$outdev  ;
;elh1.encntr_loc_hist_id,
;elh1.encntr_id ,
;elh1.loc_nurse_unit_cd,
;ce.clinical_event_id,
;ce.event_title_text,
;dt1=format(ce.event_end_dt_tm,"mm/dd/yy hh:mm;;d"),
;ce1.event_title_text,
;dt2=format(ce1.event_end_dt_tm,"mm/dd/yy hh:mm;;d")
 from
 (dummyt d with seq = size(pain_meds->qual,5))
 ,clinical_event ce
 ,dummyt d1    ;006
 ,clinical_event ce1
 ,dummyt d2		;006
 ,clinical_event ce2
 ,code_value cv
 ,nurse_unit nu
 ,encntr_loc_hist elh1
 ,encounter e
 
plan cv
where cv.code_set = 220
and cv.cdf_meaning = "FACILITY"
and cv.active_ind = 1
and (cv.description = "*Hospital*" or cv.display = "*Hosp*" or cv.display = "*Hsp*")
and cv.display_key = value(concat(trim($facility,3),"*"))
;and cv.display_key = "EU*"
;;and cv.code_value in
;;(633867,	;Luther Hospital
;;3186521, ;Luther Hospital Behav Health
;;3196529, ;Chippewa Valley Hospital
;;3196527, ;Northland Hospital
;;3196531) ;Oakridge Hospital
;$facility
 
join nu
where nu.loc_facility_cd = cv.code_value
;and expand(num, 1, size(facilities->qual,5), nu.loc_facility_cd, facilities->qual[num].facility_cd )
and nu.active_ind = 1
 
join elh1
where elh1.loc_nurse_unit_cd = nu.location_cd
  and elh1.end_effective_dt_tm >= cnvtdatetime(curdate-1,0)
  and elh1.active_ind = 1
  and elh1.beg_effective_dt_tm+0 <= cnvtdatetime(curdate-1,235959)
  and elh1.encntr_type_cd+0 in (inpatient_cd,observation_cd,day_surg_cd, emergency_cd,hosp_outpat_cd)
join e
where e.encntr_id= elh1.encntr_id
and exists(select o.encntr_id from orders o where o.encntr_id = e.encntr_id
  and o.catalog_type_cd = 2516
  and o.active_ind = 1)
 
join d
join ce
where ce.person_id = e.person_id
    and ce.event_cd = pain_meds->qual[d.seq].code_value
    and ce.encntr_id+0 = e.encntr_id
    and ce.valid_until_dt_tm > sysdate
    ;and ce.event_end_dt_tm between cnvtdatetime(cnvtdate($start_date),0) and cnvtdatetime(cnvtdate($end_date),235959)
    and ce.event_end_dt_tm between cnvtdatetime(curdate-1,0) and cnvtdatetime(curdate-1,235959)
;005    and ce.result_val != "Not Given*"
    and ce.event_tag != "Not Given*"     ;005
    and ce.result_status_cd != inerror_cd

;start 006
join d1
join ce1
where ce1.order_id = ce.order_id
  and ce1.event_cd in (28046309.00,5800507.00)
  and ce1.view_level = 1
	and ce1.valid_until_dt_tm > sysdate
  and ce1.event_end_dt_tm >= ce.event_end_dt_tm 
  and ce1.event_end_dt_tm <= ce.event_end_dt_tm+0.125
 
join d2
join ce2
where ce2.order_id = ce1.order_id
  and ce2.encntr_id = ce1.encntr_id
  and ce2.event_cd =  post_pain_med_cd
  and ce2.view_level = 1
  and ce2.valid_until_dt_tm > sysdate
  and ce2.event_end_dt_tm = ce1.event_end_dt_tm
;end 006

/*   006
join ce1
where ce1.order_id = outerjoin(ce.order_id)
  and ce1.event_cd =  outerjoin(28046309.00,5800507.00)
  and ce1.view_level = outerjoin(1)
	and ce1.valid_until_dt_tm > outerjoin(sysdate)
  and ce1.event_end_dt_tm >= outerjoin(ce.event_end_dt_tm )
  and ce1.event_end_dt_tm <= outerjoin(ce.event_end_dt_tm+0.125)
 
;start 01
join ce2
where ce2.order_id = outerjoin(ce1.order_id)
  and ce2.encntr_id = outerjoin(ce1.encntr_id)
  and ce2.event_cd =  outerjoin(post_pain_med_cd)
  and ce2.view_level = outerjoin(1)
  and ce2.valid_until_dt_tm > outerjoin(sysdate)
  and ce2.event_end_dt_tm = outerjoin(ce1.event_end_dt_tm)
;end 01
006  */
 
order elh1.encntr_id, ce.order_id, ce.event_end_dt_tm,ce.clinical_event_id, ce1.event_end_dt_tm
 
head report
ecnt = 0
 
head ce.clinical_event_id
ecnt = ecnt + 1
stat = alterlist(enc->qual,ecnt)
enc->qual[ecnt].med_name =  uar_get_code_display(ce.event_cd)
enc->qual[ecnt].medication_dt_tm = format(ce.event_end_dt_tm,"mm/dd/yy hh:mm;;d")
enc->qual[ecnt].pain_assess_completed = "NO"
enc->qual[ecnt].complete_dt_tm = format(ce1.event_end_dt_tm,"mm/dd/yy hh:mm;;d")
if (ce1.clinical_event_id > 0)
  if (ce1.event_end_dt_tm <= cnvtlookahead("1,H",ce.event_end_dt_tm))
		enc->qual[ecnt].pain_assess_completed = "YES"
	endif
endif
 enc->qual[ecnt].person_id = ce.person_id
 enc->qual[ecnt].encntr_id = ce.encntr_id
 enc->qual[ecnt].order_id = ce.order_id
 enc->qual[ecnt].performed_prsnl_id = ce.performed_prsnl_id
 enc->qual[ecnt].event_end_dt_tm = ce.event_end_dt_tm
 enc->qual[ecnt].post_pain_med_assess = ce2.result_val			;01
 
 with nocounter ;,skipreport = 1,format, separator=" "
 ,outerjoin=d1,dontcare = ce1, outerjoin = d2 ;006
 
 
select into "nl:"
from
 (dummyt d with seq = size(enc->qual,5))
 ,encntr_alias ea
 ,encntr_alias ea1
 ,person p
 ,prsnl pl
 ,orders o
 ,frequency_schedule fs
  ,encntr_loc_hist elh
  ,dummyt d1
 
plan d
 
join p
where p.person_id = enc->qual[d.seq].person_id
 
join pl
where pl.person_id = enc->qual[d.seq].performed_prsnl_id
 
join ea
where ea.encntr_id = enc->qual[d.seq].encntr_id
  and ea.encntr_alias_type_cd = fin_cd
  and ea.active_ind = 1
  and ea.end_effective_dt_tm > sysdate
 
join ea1
where ea1.encntr_id = ea.encntr_id
  and ea1.encntr_alias_type_cd = mrn_cd
  and ea1.active_ind = 1
  and ea1.end_effective_dt_tm > sysdate
 
join o
where o.order_id = enc->qual[d.seq].order_id
 
join fs
where fs.frequency_id = outerjoin(o.frequency_id)
 
join d1
join elh
where elh.encntr_id = ea.encntr_id
  and elh.end_effective_dt_tm >= cnvtdatetime(enc->qual[d.seq].event_end_dt_tm)
  and elh.active_ind = 1
  and elh.beg_effective_dt_tm+0 <= cnvtdatetime(enc->qual[d.seq].event_end_dt_tm)
  and elh.encntr_type_cd+0 in (inpatient_cd,observation_cd,day_surg_cd, emergency_cd,hosp_outpat_cd)
 
 
detail
enc->qual[d.seq].pat_name = p.name_full_formatted
enc->qual[d.seq].clinic_mrn = cnvtalias(ea1.alias,ea1.alias_pool_cd)
enc->qual[d.seq].fin = cnvtalias(ea.alias,ea.alias_pool_cd)
enc->qual[d.seq].nurse_unit = uar_get_code_display(elh.loc_nurse_unit_cd)
enc->qual[d.seq].room = uar_get_code_display(elh.loc_room_cd)
enc->qual[d.seq].med_admin_by =  pl.name_full_formatted
if (o.prn_ind = 0)
  enc->qual[d.seq].prn = "No"
else
  enc->qual[d.seq].prn = "Yes"
endif
enc->qual[d.seq].frequency = uar_get_code_display(fs.frequency_cd)
 
with nocounter, outerjoin=d1
 
DECLARE output_file = VC WITH NOCONSTANT ( "" )
SET output_file = CONCAT ("prn_response_report_", FORMAT ( CURDATE-1 , "MMDDYY;;q" ), ".csv")
;, "_" ,FORMAT ( CURTIME , "HHMM;1;m" ), ".csv")
SET message_file = "prnresponsereport.msg"
 
;print data
select into value(output_file) ;$outdev
;encntr_id = enc->qual[d.seq].encntr_id,
Patient_name = substring(1,50,enc->qual[d.seq].pat_name),
Clinic_MRN = substring(1,20,enc->qual[d.seq].clinic_mrn),  ;004 added substring
FIN = substring(1,20,enc->qual[d.seq].fin),                ;004 added substring
Nurse_Unit = substring(1,50,enc->qual[d.seq].nurse_unit),  ;004 added substring
Room = substring(1,50,enc->qual[d.seq].room),              ;004 added substring
Medication_Name = substring(1,50,enc->qual[d.seq].med_name),
PRN = substring(1,50,enc->qual[d.seq].prn),                ;004 added substring
Frequency = substring(1,50,enc->qual[d.seq].frequency),
Medication_dt_tm = enc->qual[d.seq].medication_dt_tm,
Med_Administered_By = substring(1,50,enc->qual[d.seq].med_admin_by),
Pain_Assessment_Completed = substring(1,3,enc->qual[d.seq].pain_assess_completed),
Complete_dt_tm = substring(1,15,enc->qual[d.seq].complete_dt_tm),
Post_Pain_Med_Assessment = substring(1,10,enc->qual[d.seq].post_pain_med_assess) 	;01
from
(dummyt d with seq = size(enc->qual,5))
 
order prn desc, nurse_unit, pain_assessment_completed
;with format, separator = " "
WITH  SKIPREPORT = 1, DIO= 08, PCFORMAT ('"', ',' , 1), FORMAT=STREAM, FORMAT
 
 
Set dclcom1 = concat( 'echo "Attached is the PRN Response Report. \n\n',
						' " > ',
	message_file, ' && ', 'uuencode ', output_file, ' ',
	output_file, ' >> ',
	message_file, ' && ', 'cat ',
	message_file, ' | mailx -s "PRN Response Report" ', $outdev )
set dcllen1 = size( trim( dclcom1 ) )
set dclstatus = 0
call dcl( dclcom1, dcllen1, dclstatus )
 
 
end go
