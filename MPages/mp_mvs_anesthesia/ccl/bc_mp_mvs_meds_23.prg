drop program bc_mp_mvs_meds_23:dba go
create program bc_mp_mvs_meds_23:dba
/**************************************************************************************************
              Purpose: Displays the Vital Signs 
     Source File Name: bc_mp_mvs_meds_23.PRG
              Analyst: MediView Solutions
          Application: PowerChart, SurgiNet
  Execution Locations: 
            Request #: 
      Translated From: 
        Special Notes:
**************************************************************************************************/
/**************************************************************************************************
  Mod  Date            Engineer                Description
   ---  --------------- ----------------------- ------------------------------------------------
    1   08/18/2011      MediView Solutions 	    Initial Release
    2   mm/dd/yyyy      Engineer Name           Initial Release
	3 	mm/dd/yyyy      FirstName LastName      Comments for first modification

**************************************************************************************************/

prompt 
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "USERID" = 0
	, "PERSONID" = 0
	, "ENCNTRID" = 0
	, "OPTIONS" = "" 

with OUTDEV, USERID, PERSONID, ENCNTRID, OPTIONS

record meds(
	1 person_id = f8
	1 encntr_id = f8
	1 cnt = i4
	1 group[*]
		2 description = vc
		2 cnt = i4
		2 details[*]
			3 order_id = f8
			3 nmemonic = vc
			3 details = vc
			3 date_time = vc
			3 strength = vc
			3 volume = vc
			3 frequency = vc
			3 route = vc
			3 last_administered = vc
)

declare ORDERED_6004_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",6004,"ORDERED")),protect
declare COMPLETED_14281_CV = f8
	with constant(uar_get_code_by("MEANING",14281,"COMPLETED")),protect
declare PHARMACY_6000_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",6000,"PHARMACY")),protect
declare PATIENTCARE_6000_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",6000,"PATIENTCARE")),protect

declare WARFARIN_200_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",200,"WARFARIN")),protect
declare HEPARIN_200_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",200,"HEPARIN")),protect
declare HEPARIN25000UNITSINNS250ML_200_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",200,"HEPARIN25000UNITSINNS250ML")),protect
declare ENOXAPARIN_200_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",200,"ENOXAPARIN")),protect
declare FONDAPARINUX_200_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",200,"FONDAPARINUX")),protect
declare ARGATROBAN_200_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",200,"ARGATROBAN")),protect
declare ARGATROBAN250MGIND5W250ML_200_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",200,"ARGATROBAN250MGIND5W250ML")),protect
declare ARGATROBAN250MGINNS250ML_200_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",200,"ARGATROBAN250MGINNS250ML")),protect
declare DALTEPARIN_200_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",200,"DALTEPARIN")),protect
declare VTEPROPHYLAXIS_200_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",200,"VTEPROPHYLAXIS")),protect
declare COMPRESSIONDEVICEINTERMITTENTPNEUMATIC_200_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",200,"COMPRESSIONDEVICEINTERMITTENTPNEUMATIC")),protect
declare COMPRESSIONDEVICE_200_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",200,"COMPRESSIONDEVICE")),protect

DECLARE active_48_cv		= f8 WITH public, CONSTANT(uar_get_code_by("DISPLAYKEY",48,"ACTIVE"))
DECLARE INERROR_8_CV		= f8 WITH Constant(uar_get_code_by("MEANING",8,"INERROR")),Protect
DECLARE MODIFIED_8_CV		= f8 WITH Constant(uar_get_code_by("MEANING",8,"MODIFIED")),Protect
DECLARE AUTH_8_CV      		= f8 WITH Constant(uar_get_code_by("MEANING",8,"AUTH")),Protect
	
set meds->person_id = $PERSONID
set meds->encntr_id = $ENCNTRID

; VTE Prophylaxis
SELECT  INTO "nl:"
FROM orders o,
	order_catalog_synonym ocs
plan o
	where o.person_id = $PERSONID
	and o.encntr_id = $ENCNTRID
	and o.catalog_cd in (WARFARIN_200_CV,
						HEPARIN_200_CV,
						HEPARIN25000UNITSINNS250ML_200_CV,
						ENOXAPARIN_200_CV,
						FONDAPARINUX_200_CV,
						ARGATROBAN_200_CV,
						ARGATROBAN250MGIND5W250ML_200_CV,
						ARGATROBAN250MGINNS250ML_200_CV,
						DALTEPARIN_200_CV,
						VTEPROPHYLAXIS_200_CV,
						COMPRESSIONDEVICEINTERMITTENTPNEUMATIC_200_CV,
						COMPRESSIONDEVICE_200_CV)
	and o.catalog_type_cd in (PHARMACY_6000_CV, PATIENTCARE_6000_CV)
	and o.order_status_cd = ORDERED_6004_CV
	and o.template_order_id = 0
	and o.orig_ord_as_flag = 0
	and o.active_ind = 1
join ocs
	where ocs.synonym_id = outerjoin(o.synonym_id)
head report
	cnt = meds->cnt + 1
	meds->cnt = cnt
	stat = alterlist(meds->group, cnt)
	meds->group[cnt].description = "VTE Prophylaxis"
detail
	if (o.catalog_cd = HEPARIN_200_CV and 
		ocs.mnemonic in ("hepa1000i2" ,
						"hepa5000i" ,
						"hepa1000i10" ,
						"hepa1000i1" ,
						"hepa1000i1" ,
						"hepa250d10500b" ,
						"hepa250d5500b" ,
						"hepa25000b250" ))
		cnt2 = meds->group[cnt].cnt + 1
		meds->group[cnt].cnt = cnt2
		stat = alterlist(meds->group[cnt].details, cnt2)
		meds->group[cnt].details[cnt2].order_id = o.order_id
		meds->group[cnt].details[cnt2].nmemonic = o.ordered_as_mnemonic ;o.order_mnemonic
		meds->group[cnt].details[cnt2].details = o.order_detail_display_line
	endif
	if (o.catalog_cd in (WARFARIN_200_CV,
						HEPARIN25000UNITSINNS250ML_200_CV,
						ENOXAPARIN_200_CV,
						FONDAPARINUX_200_CV,
						ARGATROBAN_200_CV,
						ARGATROBAN250MGIND5W250ML_200_CV,
						ARGATROBAN250MGINNS250ML_200_CV,
						DALTEPARIN_200_CV))
		cnt2 = meds->group[cnt].cnt + 1
		meds->group[cnt].cnt = cnt2
		stat = alterlist(meds->group[cnt].details, cnt2)
		meds->group[cnt].details[cnt2].order_id = o.order_id
		meds->group[cnt].details[cnt2].nmemonic = o.ordered_as_mnemonic ;o.order_mnemonic
		meds->group[cnt].details[cnt2].details = o.order_detail_display_line
	endif
	if (o.catalog_cd in (VTEPROPHYLAXIS_200_CV,
						COMPRESSIONDEVICEINTERMITTENTPNEUMATIC_200_CV,
						COMPRESSIONDEVICE_200_CV))
		cnt2 = meds->group[cnt].cnt + 1
		meds->group[cnt].cnt = cnt2
		stat = alterlist(meds->group[cnt].details, cnt2)
		meds->group[cnt].details[cnt2].order_id = o.order_id
		meds->group[cnt].details[cnt2].nmemonic = o.ordered_as_mnemonic ;o.order_mnemonic
		meds->group[cnt].details[cnt2].details = o.order_detail_display_line
	endif
with nocounter

; Inpatient
SELECT  INTO "nl:"
FROM orders o
plan o
	where o.person_id = $PERSONID
	and o.encntr_id = $ENCNTRID
	and not o.catalog_cd in (WARFARIN_200_CV,
						HEPARIN_200_CV,
						HEPARIN25000UNITSINNS250ML_200_CV,
						ENOXAPARIN_200_CV,
						FONDAPARINUX_200_CV,
						ARGATROBAN_200_CV,
						ARGATROBAN250MGIND5W250ML_200_CV,
						ARGATROBAN250MGINNS250ML_200_CV,
						DALTEPARIN_200_CV,
						VTEPROPHYLAXIS_200_CV,
						COMPRESSIONDEVICEINTERMITTENTPNEUMATIC_200_CV,
						COMPRESSIONDEVICE_200_CV)
	and o.catalog_type_cd = PHARMACY_6000_CV
	and o.order_status_cd = ORDERED_6004_CV
	and o.template_order_id = 0
	and o.orig_ord_as_flag = 0
	and o.active_ind = 1
	and o.iv_ind = 0
head report
	cnt = meds->cnt + 1
	meds->cnt = cnt
	stat = alterlist(meds->group, cnt)
	meds->group[cnt].description = "Inpatient"
detail
	cnt2 = meds->group[cnt].cnt + 1
	meds->group[cnt].cnt = cnt2
	stat = alterlist(meds->group[cnt].details, cnt2)
	meds->group[cnt].details[cnt2].order_id = o.order_id
	meds->group[cnt].details[cnt2].nmemonic = o.ordered_as_mnemonic ;o.order_mnemonic
	meds->group[cnt].details[cnt2].details = o.order_detail_display_line
with nocounter

; IVs
SELECT  INTO "nl:"
FROM orders o
plan o
	where o.person_id = $PERSONID
	and o.encntr_id = $ENCNTRID
	and not o.catalog_cd in (WARFARIN_200_CV,
						HEPARIN_200_CV,
						HEPARIN25000UNITSINNS250ML_200_CV,
						ENOXAPARIN_200_CV,
						FONDAPARINUX_200_CV,
						ARGATROBAN_200_CV,
						ARGATROBAN250MGIND5W250ML_200_CV,
						ARGATROBAN250MGINNS250ML_200_CV,
						DALTEPARIN_200_CV,
						VTEPROPHYLAXIS_200_CV,
						COMPRESSIONDEVICEINTERMITTENTPNEUMATIC_200_CV,
						COMPRESSIONDEVICE_200_CV)
	and o.catalog_type_cd = PHARMACY_6000_CV
	and o.order_status_cd = ORDERED_6004_CV
	and o.template_order_id = 0
	and o.orig_ord_as_flag = 0
	and o.active_ind = 1
	and o.iv_ind = 1
head report
	cnt = meds->cnt + 1
	meds->cnt = cnt
	stat = alterlist(meds->group, cnt)
	meds->group[cnt].description = "Fluids"
detail
	cnt2 = meds->group[cnt].cnt + 1
	meds->group[cnt].cnt = cnt2
	stat = alterlist(meds->group[cnt].details, cnt2)
	meds->group[cnt].details[cnt2].order_id = o.order_id
	meds->group[cnt].details[cnt2].nmemonic = o.ordered_as_mnemonic ;o.order_mnemonic
	meds->group[cnt].details[cnt2].details = o.order_detail_display_line
with nocounter

SELECT INTO "NL:"
FROM orders o
PLAN o
	WHERE o.person_id = $PERSONID
	AND o.order_status_cd = ORDERED_6004_CV
	AND o.catalog_type_cd = PHARMACY_6000_CV
	AND o.template_order_id = 0
 	AND o.orig_ord_as_flag IN (1.00		;Prescription/Discharge Order
   							,2.00)	;Recorded / Home Meds

ORDER BY o.orig_ord_as_flag desc,o.order_id
HEAD REPORT
	cnt = meds->cnt + 1
	meds->cnt = cnt
	stat = alterlist(meds->group, cnt)
	meds->group[cnt].description = "Home Medications"
HEAD o.order_id
	cnt2 = meds->group[cnt].cnt + 1
	meds->group[cnt].cnt = cnt2
	stat = alterlist(meds->group[cnt].details, cnt2)
	meds->group[cnt].details[cnt2].order_id = o.order_id
	meds->group[cnt].details[cnt2].nmemonic = o.ordered_as_mnemonic ;o.order_mnemonic
	meds->group[cnt].details[cnt2].details = o.order_detail_display_line
WITH NOCOUNTER

select into 'nl:'
from orders o,
	order_action oa,
	order_detail od
plan o
	where o.person_id = $PERSONID
	and o.encntr_id = $ENCNTRID
	and o.catalog_type_cd = PHARMACY_6000_CV
join oa
	where oa.order_id = o.order_id
	and oa.action_sequence = o.last_action_sequence
	and oa.dept_status_cd = COMPLETED_14281_CV
join od
	where od.order_id = o.order_id
	and od.oe_field_value = 1026518.0
order by oa.action_dt_tm desc
head report
	cnt = meds->cnt + 1
	meds->cnt = cnt
	stat = alterlist(meds->group, cnt)
	meds->group[cnt].description = "One Time Administered"
head o.order_id
	cnt2 = meds->group[cnt].cnt + 1
	meds->group[cnt].cnt = cnt2
	stat = alterlist(meds->group[cnt].details, cnt2)
	meds->group[cnt].details[cnt2].order_id = o.order_id
	meds->group[cnt].details[cnt2].nmemonic = o.ordered_as_mnemonic ;o.order_mnemonic
	meds->group[cnt].details[cnt2].details = o.order_detail_display_line
	meds->group[cnt].details[cnt2].date_time = format(oa.action_dt_tm, "mm/dd/yyyy hh:mm;;q")
with nocounter

;Administered PRN
select into 'nl:'
from orders o,
	clinical_event ce,
	order_detail od
plan o
	where o.person_id = $PERSONID
	and o.encntr_id = $ENCNTRID
	and o.catalog_type_cd = PHARMACY_6000_CV
join od
	where od.order_id = o.order_id
	and od.oe_field_meaning = "SCH/PRN"
	and od.oe_field_value = 1.0
join ce
	where ce.person_id = o.person_id
	and ce.encntr_id = o.encntr_id
	and ce.order_id = o.order_id
head report
	cnt = meds->cnt + 1
	meds->cnt = cnt
	stat = alterlist(meds->group, cnt)
	meds->group[cnt].description = "PRN Administered"
head o.order_id
	cnt2 = meds->group[cnt].cnt + 1
	meds->group[cnt].cnt = cnt2
	stat = alterlist(meds->group[cnt].details, cnt2)
	meds->group[cnt].details[cnt2].order_id = o.order_id
	meds->group[cnt].details[cnt2].nmemonic = o.ordered_as_mnemonic ;o.order_mnemonic
	meds->group[cnt].details[cnt2].details = o.order_detail_display_line
	meds->group[cnt].details[cnt2].date_time = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;q")
with nocounter

select into 'nl:'
	sort_id = (if (od.oe_field_meaning = ^STRENGTHDOSE^ 
					or od.oe_field_meaning = ^VOLUMEDOSE^)
				  '01'
				else
					'99'
				endif)
from (dummyt d1 with seq=meds->cnt),
	(dummyt d2 with seq=1),
	order_detail od
plan d1
	where maxrec(d2, meds->group[d1.seq].cnt)
join d2
join od
	where od.order_id = meds->group[d1.seq].details[d2.seq].order_id
order by od.order_id, sort_id
detail
	case (od.oe_field_meaning)
	of ^STRENGTHDOSE^:
		meds->group[d1.seq].details[d2.seq].strength = od.oe_field_display_value
	of ^STRENGTHDOSEUNIT^:
		meds->group[d1.seq].details[d2.seq].strength = concat(
			trim(meds->group[d1.seq].details[d2.seq].strength), ^ ^,
			od.oe_field_display_value)
	of ^VOLUMEDOSE^:
		meds->group[d1.seq].details[d2.seq].volume = od.oe_field_display_value
	of ^VOLUMEDOSEUNIT^:
		meds->group[d1.seq].details[d2.seq].volume = concat(
			trim(meds->group[d1.seq].details[d2.seq].volume), ^ ^,
			od.oe_field_display_value)
	of ^RXROUTE^:
		meds->group[d1.seq].details[d2.seq].route = od.oe_field_display_value
	of ^FREQ^:
		meds->group[d1.seq].details[d2.seq].frequency = od.oe_field_display_value
	endcase
with nocounter

select into 'nl:'
from (dummyt d1 with seq=meds->cnt),
	(dummyt d2 with seq=1),
	clinical_event ce
plan d1
	where maxrec(d2, meds->group[d1.seq].cnt)
join d2
join ce
	where ce.person_id = meds->person_id
	and ce.order_id = meds->group[d1.seq].details[d2.seq].order_id
	and ce.valid_from_dt_tm < sysdate
	and ce.valid_until_dt_tm > sysdate
	and ce.record_status_cd = active_48_cv 
  	and ce.result_status_cd +0 IN ( AUTH_8_CV ,MODIFIED_8_CV )
  	and CNVTUPPER(ce.event_title_text) != "DATE\TIME CORRECTION"
	and ce.event_end_dt_tm = (select max(ce1.event_end_dt_tm)
						from clinical_event ce1
						where ce1.person_id = ce.person_id
						and ce1.order_id = ce.order_id
						and ce.valid_from_dt_tm < sysdate
						and ce1.valid_until_dt_tm > sysdate
						and ce1.record_status_cd = active_48_cv 
					  	and ce1.result_status_cd +0 IN ( AUTH_8_CV ,MODIFIED_8_CV )
					  	and CNVTUPPER(ce1.event_title_text) != "DATE\TIME CORRECTION")
order by ce.event_end_dt_tm
detail
	meds->group[d1.seq].details[d2.seq].last_administered = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;q")
with nocounter

select into 'nl:'
from (dummyt d1 with seq=meds->cnt),
	(dummyt d2 with seq=1),
	orders o,
	clinical_event ce
plan d1
	where maxrec(d2, meds->group[d1.seq].cnt)
join d2
join o
	where o.person_id +0 = meds->person_id
	and o.template_order_id = meds->group[d1.seq].details[d2.seq].order_id
join ce
	where ce.person_id = meds->person_id
	and ce.order_id = o.order_id
	and ce.view_level = 1
	and ce.valid_from_dt_tm < sysdate
	and ce.valid_until_dt_tm > sysdate
	and ce.record_status_cd = active_48_cv 
  	and ce.result_status_cd +0 IN ( AUTH_8_CV ,MODIFIED_8_CV )
  	and CNVTUPPER(ce.event_title_text) != "DATE\TIME CORRECTION"
	and ce.event_end_dt_tm = (select max(ce1.event_end_dt_tm)
						from clinical_event ce1
						where ce1.person_id = ce.person_id
						and ce1.order_id = ce.order_id
						and ce1.view_level = 1
						and ce.valid_from_dt_tm < sysdate
						and ce1.valid_until_dt_tm > sysdate
						and ce1.record_status_cd = active_48_cv 
					  	and ce1.result_status_cd +0 IN ( AUTH_8_CV ,MODIFIED_8_CV )
					  	and CNVTUPPER(ce1.event_title_text) != "DATE\TIME CORRECTION")
order by ce.event_end_dt_tm
detail
	meds->group[d1.seq].details[d2.seq].last_administered = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;q")
with nocounter

call echorecord(meds)
call echojson(meds, $OUTDEV)
end
go
