drop program bc_mp_mvs_meds_23:dba go
create program bc_mp_mvs_meds_23:dba
/**************************************************************************************************
              Purpose: Displays the Medications for the Anesthsia MPage
     Source File Name: bc_mp_mvs_meds_23_v2.PRG
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
    2   05/16/2012      Karen Speaks			WO# 794299 - add check for clinical event to one time orders
    											+ reformat to BayCare standards
	3 	mm/dd/yyyy      FirstName LastName      Comments for first modification

**************************************************************************************************/

prompt 
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "USERID" = 0
	, "PERSONID" = 0
	, "ENCNTRID" = 0
	, "OPTIONS" = "" 

with OUTDEV, USERID, PERSONID, ENCNTRID, OPTIONS

call echo(concat("program START:  ",format(curtime3,"HH:MM:SS:CC;;M")))
/*===============================================================================================================
 
                                          		DEFINED RECORDSETS
 
===============================================================================================================*/
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

/*===============================================================================================================
                                             PROGRAMMER CONSTANTS
===============================================================================================================*/
declare INERROR_8_CV			= f8 with protect, constant(uar_get_code_by("MEANING", 8, "INERROR"))

declare ALT_8_CV				= f8 with protect, constant(uar_get_code_by("MEANING", 8, "ALTERED"))
declare AUTH_8_CV      			= f8 with protect, constant(uar_get_code_by("MEANING", 8, "AUTH"))
declare MODIFIED_8_CV			= f8 with protect, constant(uar_get_code_by("MEANING", 8, "MODIFIED"))

declare ACTIVE_48_CV			= f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 48, "ACTIVE"))

declare WARFARIN_200_CV 		= f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 200, "WARFARIN"))
declare HEPARIN_200_CV 			= f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 200, "HEPARIN"))
declare HEP_250000_200_CV		= f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 200, "HEPARIN25000UNITSINNS250ML"))
declare ENOXAPARIN_200_CV 		= f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 200, "ENOXAPARIN"))
declare FONDAPARINUX_200_CV 	= f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 200, "FONDAPARINUX"))
declare ARGATROBAN_200_CV 		= f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 200, "ARGATROBAN"))
declare ARG_240_200_CV 			= f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 200, "ARGATROBAN250MGIND5W250ML"))
declare ARG_250_200_CV 			= f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 200, "ARGATROBAN250MGINNS250ML"))
declare DALTEPARIN_200_CV 		= f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 200, "DALTEPARIN"))
declare VTEPROPHYLAXIS_200_CV 	= f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 200, "VTEPROPHYLAXIS"))
declare COMP_DEVINT_200_CV 		= f8 with protect, 
								constant(uar_get_code_by("DISPLAYKEY", 200, "COMPRESSIONDEVICEINTERMITTENTPNEUMATIC"))
declare COMP_DEV_200_CV 		= f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 200, "COMPRESSIONDEVICE"))

declare PHARMACY_6000_CV 		= f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 6000, "PHARMACY"))
declare PATIENTCARE_6000_CV 	= f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 6000, "PATIENTCARE"))

declare ORDERED_6004_CV			= f8 with protect, constant(uar_get_code_by("DISPLAYKEY", 6004, "ORDERED"))

declare COMPLETED_14281_CV 		= f8 with protect, constant(uar_get_code_by("MEANING", 14281, "COMPLETED"))


/*===============================================================================================================
											PROGRAMMING SECTION
===============================================================================================================*/	
set meds->person_id = $PERSONID
set meds->encntr_id = $ENCNTRID

call echo(concat("vte query START:  ",format(curtime3,"HH:MM:SS:CC;;M")))
; VTE Prophylaxis
SELECT  INTO "nl:"
FROM orders o
	, order_catalog_synonym ocs

PLAN o
  where o.person_id = $PERSONID
	and o.encntr_id = $ENCNTRID
	and o.catalog_cd in (WARFARIN_200_CV,
						HEPARIN_200_CV,
						HEP_250000_200_CV,
						ENOXAPARIN_200_CV,
						FONDAPARINUX_200_CV,
						ARGATROBAN_200_CV,
						ARG_240_200_CV,
						ARG_250_200_CV,
						DALTEPARIN_200_CV,
						VTEPROPHYLAXIS_200_CV,
						COMP_DEVINT_200_CV,
						COMP_DEV_200_CV)
	and o.catalog_type_cd in (PHARMACY_6000_CV, PATIENTCARE_6000_CV)
	and o.order_status_cd+0 = ORDERED_6004_CV
	and o.template_order_id+0 = 0
	and o.orig_ord_as_flag+0 = 0
	and o.active_ind+0 = 1
JOIN ocs
  where ocs.synonym_id = outerjoin(o.synonym_id)

HEAD REPORT
	cnt = meds->cnt + 1
	meds->cnt = cnt
	stat = alterlist(meds->group, cnt)
	meds->group[cnt].description = "VTE Prophylaxis"

DETAIL
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
		meds->group[cnt].details[cnt2].nmemonic = o.ordered_as_mnemonic
		meds->group[cnt].details[cnt2].details = o.order_detail_display_line
	endif

	if (o.catalog_cd in (WARFARIN_200_CV,
						HEP_250000_200_CV,
						ENOXAPARIN_200_CV,
						FONDAPARINUX_200_CV,
						ARGATROBAN_200_CV,
						ARG_240_200_CV,
						ARG_250_200_CV,
						DALTEPARIN_200_CV))
		cnt2 = meds->group[cnt].cnt + 1
		meds->group[cnt].cnt = cnt2
		stat = alterlist(meds->group[cnt].details, cnt2)
		meds->group[cnt].details[cnt2].order_id = o.order_id
		meds->group[cnt].details[cnt2].nmemonic = o.ordered_as_mnemonic
		meds->group[cnt].details[cnt2].details = o.order_detail_display_line
	endif
	if (o.catalog_cd in (VTEPROPHYLAXIS_200_CV,
						COMP_DEVINT_200_CV,
						COMP_DEV_200_CV))
		cnt2 = meds->group[cnt].cnt + 1
		meds->group[cnt].cnt = cnt2
		stat = alterlist(meds->group[cnt].details, cnt2)
		meds->group[cnt].details[cnt2].order_id = o.order_id
		meds->group[cnt].details[cnt2].nmemonic = o.ordered_as_mnemonic
		meds->group[cnt].details[cnt2].details = o.order_detail_display_line
	endif
 with nocounter

call echo(concat("IP query START:  ",format(curtime3,"HH:MM:SS:CC;;M")))
; Inpatient
SELECT into "nl:"
FROM orders o

PLAN o
  where o.person_id = $PERSONID
	and o.encntr_id = $ENCNTRID
	and o.catalog_cd not in (WARFARIN_200_CV,
							HEPARIN_200_CV,
							HEP_250000_200_CV,
							ENOXAPARIN_200_CV,
							FONDAPARINUX_200_CV,
							ARGATROBAN_200_CV,
							ARG_240_200_CV,
							ARG_250_200_CV,
							DALTEPARIN_200_CV,
							VTEPROPHYLAXIS_200_CV,
							COMP_DEVINT_200_CV,
							COMP_DEV_200_CV)
	and o.catalog_type_cd = PHARMACY_6000_CV
	and o.order_status_cd+0 = ORDERED_6004_CV
	and o.template_order_id+0 = 0
	and o.orig_ord_as_flag+0 = 0
	and o.active_ind = 1
	and o.iv_ind = 0

HEAD REPORT
	cnt = meds->cnt + 1
	meds->cnt = cnt
	stat = alterlist(meds->group, cnt)
	meds->group[cnt].description = "Inpatient"

DETAIL
	cnt2 = meds->group[cnt].cnt + 1
	meds->group[cnt].cnt = cnt2
	stat = alterlist(meds->group[cnt].details, cnt2)
	meds->group[cnt].details[cnt2].order_id = o.order_id
	meds->group[cnt].details[cnt2].nmemonic = o.ordered_as_mnemonic
	meds->group[cnt].details[cnt2].details = o.order_detail_display_line
 with nocounter

call echo(concat("IV query START:  ",format(curtime3,"HH:MM:SS:CC;;M")))
; IVs
SELECT  INTO "nl:"
FROM orders o

PLAN o
  where o.person_id = $PERSONID
	and o.encntr_id = $ENCNTRID
	and o.catalog_cd not in (WARFARIN_200_CV,
							HEPARIN_200_CV,
							HEP_250000_200_CV,
							ENOXAPARIN_200_CV,
							FONDAPARINUX_200_CV,
							ARGATROBAN_200_CV,
							ARG_240_200_CV,
							ARG_250_200_CV,
							DALTEPARIN_200_CV,
							VTEPROPHYLAXIS_200_CV,
							COMP_DEVINT_200_CV,
							COMP_DEV_200_CV)
	and o.catalog_type_cd = PHARMACY_6000_CV
	and o.order_status_cd = ORDERED_6004_CV
	and o.template_order_id+0 = 0
	and o.orig_ord_as_flag+0 = 0
	and o.active_ind+0 = 1
	and o.iv_ind+0 = 1

HEAD REPORT
	cnt = meds->cnt + 1
	meds->cnt = cnt
	stat = alterlist(meds->group, cnt)
	meds->group[cnt].description = "Fluids"

DETAIL
	cnt2 = meds->group[cnt].cnt + 1
	meds->group[cnt].cnt = cnt2
	stat = alterlist(meds->group[cnt].details, cnt2)
	meds->group[cnt].details[cnt2].order_id = o.order_id
	meds->group[cnt].details[cnt2].nmemonic = o.ordered_as_mnemonic
	meds->group[cnt].details[cnt2].details = o.order_detail_display_line

 with nocounter

call echo(concat("RX & Home Meds START:  ",format(curtime3,"HH:MM:SS:CC;;M")))
;RX & Home Meds
SELECT INTO "NL:"
FROM orders o

PLAN o
  where o.person_id = $PERSONID
	and o.order_status_cd = ORDERED_6004_CV
	and o.catalog_type_cd = PHARMACY_6000_CV
	and o.template_order_id = 0
 	and o.orig_ord_as_flag in (1.00		;Prescription/Discharge Order
   							  ,2.00)	;Recorded / Home Meds

ORDER o.orig_ord_as_flag desc
	, o.order_id

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
	meds->group[cnt].details[cnt2].nmemonic = o.ordered_as_mnemonic
	meds->group[cnt].details[cnt2].details = o.order_detail_display_line

 with nocounter

call echo(concat("One time orders START:  ",format(curtime3,"HH:MM:SS:CC;;M")))
;once time orders
SELECT into 'nl:'
FROM orders o
	, order_action oa
	, order_detail od
	, clinical_event ce

PLAN o
  where o.person_id = $PERSONID
	and o.encntr_id+0 = $ENCNTRID
	and o.catalog_type_cd = PHARMACY_6000_CV
JOIN od
  where od.order_id = o.order_id
	and od.oe_field_value = 1026518.0 
JOIN oa
  where oa.order_id = o.order_id
	and oa.action_sequence = o.last_action_sequence
	and oa.dept_status_cd+0 = COMPLETED_14281_CV
JOIN ce
  where ce.order_id = o.order_id
  	and ce.view_level+0 = 1
  	and ce.valid_until_dt_tm+0 > cnvtdatetime(curdate, curtime3)
  	and ce.result_status_cd+0 in (AUTH_8_CV, ALT_8_CV, MODIFIED_8_CV)
	and cnvtupper(ce.event_title_text) != "DATE\TIME CORRECTION"

ORDER ce.event_end_dt_tm desc

HEAD REPORT
	cnt = meds->cnt + 1
	meds->cnt = cnt
	stat = alterlist(meds->group, cnt)
	meds->group[cnt].description = "One Time Administered"

HEAD o.order_id
	cnt2 = meds->group[cnt].cnt + 1
	meds->group[cnt].cnt = cnt2
	stat = alterlist(meds->group[cnt].details, cnt2)
	meds->group[cnt].details[cnt2].order_id = o.order_id
	meds->group[cnt].details[cnt2].nmemonic = o.ordered_as_mnemonic
	meds->group[cnt].details[cnt2].details = o.order_detail_display_line
	meds->group[cnt].details[cnt2].date_time = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;q")
 with nocounter

call echo(concat("PRN START:  ",format(curtime3,"HH:MM:SS:CC;;M")))
;Administered PRN
SELECT into 'nl:'
FROM orders o
	, order_detail od
	, clinical_event ce

PLAN o
  where o.person_id = $PERSONID
	and o.encntr_id+0 = $ENCNTRID
	and o.catalog_type_cd = PHARMACY_6000_CV
JOIN od
  where od.order_id = o.order_id
	and od.oe_field_meaning = "SCH/PRN"
	and od.oe_field_value = 1.0
JOIN ce
  where ce.order_id = o.order_id
  	and ce.view_level+0 = 1
  	and ce.valid_until_dt_tm+0 > cnvtdatetime(curdate, curtime3)
  	and ce.result_status_cd+0 in (AUTH_8_CV, ALT_8_CV, MODIFIED_8_CV)
	and cnvtupper(ce.event_title_text) != "DATE\TIME CORRECTION"

HEAD REPORT
	cnt = meds->cnt + 1
	meds->cnt = cnt
	stat = alterlist(meds->group, cnt)
	meds->group[cnt].description = "PRN Administered"

HEAD o.order_id
	cnt2 = meds->group[cnt].cnt + 1
	meds->group[cnt].cnt = cnt2
	stat = alterlist(meds->group[cnt].details, cnt2)
	meds->group[cnt].details[cnt2].order_id = o.order_id
	meds->group[cnt].details[cnt2].nmemonic = o.ordered_as_mnemonic ;o.order_mnemonic
	meds->group[cnt].details[cnt2].details = o.order_detail_display_line
	meds->group[cnt].details[cnt2].date_time = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;q")
 with nocounter

call echo(concat("Detail START:  ",format(curtime3,"HH:MM:SS:CC;;M")))
SELECT into 'nl:'
	sort_id = 	if (od.oe_field_meaning = ^STRENGTHDOSE^ or od.oe_field_meaning = ^VOLUMEDOSE^)
					'01'
				else
					'99'
				endif

FROM (dummyt d1 with seq=meds->cnt)
	, (dummyt d2 with seq=1)
	, order_detail od

PLAN d1
	where maxrec(d2, meds->group[d1.seq].cnt)
JOIN d2
JOIN od
  where od.order_id = meds->group[d1.seq].details[d2.seq].order_id

ORDER od.order_id
	, sort_id

DETAIL
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

call echo(concat("Admin START:  ",format(curtime3,"HH:MM:SS:CC;;M")))
SELECT into 'nl:'
FROM (dummyt d1 with seq=meds->cnt)
	, (dummyt d2 with seq=1)
	, clinical_event ce

PLAN d1
  where maxrec(d2, meds->group[d1.seq].cnt)
JOIN d2
JOIN ce
  where ce.order_id = meds->group[d1.seq].details[d2.seq].order_id
	and ce.valid_from_dt_tm+0 < sysdate
	and ce.valid_until_dt_tm+0 > sysdate
	and ce.record_status_cd+0 = ACTIVE_48_CV 
  	and ce.result_status_cd+0 in (AUTH_8_CV, ALT_8_CV, MODIFIED_8_CV)
  	and cnvtupper(ce.event_title_text) != "DATE\TIME CORRECTION"
	and ce.event_end_dt_tm+0 = (select max(ce1.event_end_dt_tm)
						from clinical_event ce1
						  where ce1.order_id = ce.order_id
							and ce1.valid_from_dt_tm+0 < sysdate
							and ce1.valid_until_dt_tm+0 > sysdate
							and ce1.record_status_cd+0 = ACTIVE_48_CV 
					  		and ce1.result_status_cd+0 in (AUTH_8_CV, ALT_8_CV, MODIFIED_8_CV)
					  		and cnvtupper(ce1.event_title_text) != "DATE\TIME CORRECTION")

ORDER ce.event_end_dt_tm

DETAIL
	meds->group[d1.seq].details[d2.seq].last_administered = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;q")
 with nocounter

call echo(concat("Admin (child) START:  ",format(curtime3,"HH:MM:SS:CC;;M")))
SELECT into 'nl:'
FROM (dummyt d1 with seq=meds->cnt)
	, (dummyt d2 with seq=1)
	, orders o
	, clinical_event ce

PLAN d1
  where maxrec(d2, meds->group[d1.seq].cnt)
JOIN d2
JOIN o
  where o.template_order_id = meds->group[d1.seq].details[d2.seq].order_id
JOIN ce
  where ce.order_id = o.order_id
	and ce.view_level = 1
	and ce.valid_from_dt_tm < sysdate
	and ce.valid_until_dt_tm > sysdate
	and ce.record_status_cd = ACTIVE_48_CV 
  	and ce.result_status_cd+0 in (AUTH_8_CV, ALT_8_CV, MODIFIED_8_CV)
  	and cnvtupper(ce.event_title_text) != "DATE\TIME CORRECTION"
	and ce.event_end_dt_tm = (select max(ce1.event_end_dt_tm)
						from clinical_event ce1
						  where ce1.order_id = ce.order_id
							and ce1.view_level = 1
							and ce1.valid_from_dt_tm < sysdate
							and ce1.valid_until_dt_tm > sysdate
							and ce1.record_status_cd = ACTIVE_48_CV 
					  		and ce1.result_status_cd +0 in (AUTH_8_CV, ALT_8_CV, MODIFIED_8_CV)
					  		and cnvtupper(ce1.event_title_text) != "DATE\TIME CORRECTION")
ORDER by ce.event_end_dt_tm

DETAIL
	meds->group[d1.seq].details[d2.seq].last_administered = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;q")
 with nocounter

;call echorecord(meds)
call echojson(meds, $OUTDEV)

call echo(concat("program END:  ",format(curtime3,"HH:MM:SS:CC;;M")))

end
go
