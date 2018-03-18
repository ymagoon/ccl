drop program 1_rcmc_rad_appt_list1:dba go
create program 1_rcmc_rad_appt_list1:dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Start Date and Time" = CURDATE
	, "Location" = ""
	, "Number of Days" = 0
 
with OUTDEV, sdate, Location, num
 
declare num = i2
 
set maxsec = 1800
 
free record rec
record rec(
 	1 cnt = i4
	1 qual[*]
		2	appt_date		=	vc
		2 	appt_time 		=	vc
		2	appt_location	=	vc
		2	person_id		=	f8
		2	patient_name	=	vc
		2	dob				=	dq8
		2 	order_id		=   f8
		2	exma			=	vc
		2	mrn				=	vc
		2	order_entered_by=	vc
		2	ordering_prv	=	vc
		2	signs			=	vc
		2	comment			=	vc
		2	testdate		= dq8
	)
/*
if ($Location= "CT")
SELECT INTO "nl:"
FROM
	orders   o
	, person   p
	, person_alias pa
	, prsnl   pr
	, order_action   oa
	, sch_event_attach   se
	, sch_appt   sa
 	, prsnl prs
 	, CODE_VALUE CV2
 
plan o where o.order_status_cd =  2546.00
and o.catalog_type_cd+0 = 2517.00
AND O.ACTIVITY_TYPE_CD = 711
and o.active_ind = 1
join se
where se.order_id = o.order_id
join sa
where sa.sch_event_id = se.sch_event_id
;and sa.beg_dt_tm between cnvtdatetime(cnvtdate($sdate),0) and cnvtdatetime(cnvtdate($sdate)+7,2359)
and sa.beg_dt_tm between cnvtdatetime(cnvtdate(sysdate),0) and cnvtdatetime(cnvtdate(sysdate)+$num,2359)
and sa.STATE_MEANING in ("CONFIRMED","CHECKED IN")
and sa.ROLE_MEANING = "PATIENT"
and sa.appt_location_cd+0 in (24989813.00,   74225029.00)
 
JOIN CV2
WHERE CV2.CODE_VALUE = SA.APPT_LOCATION_CD
AND CV2.display_key = value(concat(trim("ME",3),"*"))
AND NOT EXISTS
			(SELECT
			OCS.CATALOG_CD
			FROM
				CODE_VALUE CV1,
				OCS_FACILITY_R  OCSF,
				ORDER_CATALOG_SYNONYM  OCS
				WHERE OCS.catalog_cd = O.CATALOG_CD
				AND ocs.activity_type_cd = 711; in (692, 674)
				and ocs.active_ind = 1
				and OCSF.SYNONYM_ID = ocs.synonym_id
				and CV1.CODE_VALUE = OCSF.FACILITY_CD
				AND CV1.ACTIVE_IND= 1
				AND  cv1.DISPLAY = concat("ME","*"))
join p where p.person_id =  SA.person_id
;and p.name_last_key != "TESTPATIENT" or p.name_last_key != "*TEST*"
;join e where e.person_id = p.person_id
join pa where pa.person_id = p.person_id
and pa.person_alias_type_cd = 10
 
join oa where oa.order_id = o.order_id
and oa.action_type_cd = 2534.00
and pa.alias_pool_cd=       25036703.00
 
join pr
where pr.person_id = oa.action_personnel_id
join prs
where prs.person_id = oa.order_provider_id
 
head report
		rec->cnt  = 0
 
head o.order_id
			rec->cnt = rec->cnt + 1
      	if (mod(rec->cnt,10) = 1)
          stat = alterlist(rec->qual, rec->cnt + 9)
    	endif
 
detail
 
	rec->qual[rec->cnt].appt_date = format(cnvtdatetime(sa.beg_dt_tm), "MM/DD/YYYY;;D")
	rec->qual[rec->cnt].appt_time = format(cnvtdatetime(sa.beg_dt_tm), "hh:mm;;m")
	rec->qual[rec->cnt].appt_location = UAR_GET_CODE_DISPLAY(SA.APPT_LOCATION_CD)
	rec->qual[rec->cnt].person_id = p.person_id
  	rec->qual[rec->cnt].patient_name = p.name_full_formatted
  	rec->qual[rec->cnt].dob =  p.birth_dt_tm
  	rec->qual[rec->cnt].exma = o.hna_order_mnemonic
  	rec->qual[rec->cnt].mrn =  pa.alias
  	rec->qual[rec->cnt].order_entered_by = pr.name_full_formatted
  	rec->qual[rec->cnt].ordering_prv = prs.name_full_formatted
  	rec->qual[rec->cnt].order_id = o.order_id
 	rec->qual[rec->cnt].testdate =sa.beg_dt_tm
foot report
	  stat = alterlist(rec->qual,rec->cnt)
 
with nocounter;, format, separator = " "
endif
 
if ($Location= "MRI")
SELECT INTO "nl:"
FROM
	orders   o
	, person   p
	, person_alias pa
	, prsnl   pr
	, order_action   oa
	, sch_event_attach   se
	, sch_appt   sa
 	, prsnl prs
 	, CODE_VALUE CV2
 
plan o where o.order_status_cd =  2546.00
and o.catalog_type_cd+0 = 2517.00
AND O.ACTIVITY_TYPE_CD = 711
and o.active_ind = 1
join se
where se.order_id = o.order_id
join sa
where sa.sch_event_id = se.sch_event_id
;and sa.beg_dt_tm between cnvtdatetime(cnvtdate($sdate),0) and cnvtdatetime(cnvtdate($sdate)+7,2359)
and sa.beg_dt_tm between cnvtdatetime(cnvtdate(sysdate),0) and cnvtdatetime(cnvtdate(sysdate)+$num,2359)
and sa.STATE_MEANING in ("CONFIRMED","CHECKED IN")
and sa.ROLE_MEANING = "PATIENT"
and sa.appt_location_cd in ( 24989817.00,   74226204.00)
JOIN CV2
WHERE CV2.CODE_VALUE = SA.APPT_LOCATION_CD
AND CV2.display_key = value(concat(trim("ME",3),"*"))
AND NOT EXISTS
			(SELECT
			OCS.CATALOG_CD
			FROM
				CODE_VALUE CV1,
				OCS_FACILITY_R  OCSF,
				ORDER_CATALOG_SYNONYM  OCS
				WHERE OCS.catalog_cd = O.CATALOG_CD
				AND ocs.activity_type_cd = 711; in (692, 674)
				and ocs.active_ind = 1
				and OCSF.SYNONYM_ID = ocs.synonym_id
				and CV1.CODE_VALUE = OCSF.FACILITY_CD
				AND CV1.ACTIVE_IND= 1
				AND  cv1.DISPLAY = concat("ME","*"))
join p where p.person_id =  SA.person_id
;and p.name_last_key != "TESTPATIENT" or p.name_last_key != "*TEST*"
;join e where e.person_id = p.person_id
join pa where pa.person_id = p.person_id
and pa.person_alias_type_cd = 10
 
join oa where oa.order_id = o.order_id
and oa.action_type_cd = 2534.00
and pa.alias_pool_cd=       25036703.00
 
join pr
where pr.person_id = oa.action_personnel_id
join prs
where prs.person_id = oa.order_provider_id
 
head report
		rec->cnt  = 0
 
head o.order_id
			rec->cnt = rec->cnt + 1
      	if (mod(rec->cnt,10) = 1)
          stat = alterlist(rec->qual, rec->cnt + 9)
    	endif
 
detail
 
	rec->qual[rec->cnt].appt_date = format(cnvtdatetime(sa.beg_dt_tm), "MM/DD/YYYY;;D")
	rec->qual[rec->cnt].appt_time = format(cnvtdatetime(sa.beg_dt_tm), "hh:mm;;m")
	rec->qual[rec->cnt].appt_location = UAR_GET_CODE_DISPLAY(SA.APPT_LOCATION_CD)
	rec->qual[rec->cnt].person_id = p.person_id
  	rec->qual[rec->cnt].patient_name = p.name_full_formatted
  	rec->qual[rec->cnt].dob =  p.birth_dt_tm
  	rec->qual[rec->cnt].exma = o.hna_order_mnemonic
  	rec->qual[rec->cnt].mrn =  pa.alias
	rec->qual[rec->cnt].order_id = o.order_id
  	rec->qual[rec->cnt].order_entered_by = pr.name_full_formatted
  	rec->qual[rec->cnt].ordering_prv = prs.name_full_formatted
	rec->qual[rec->cnt].testdate =sa.beg_dt_tm
 
foot report
	  stat = alterlist(rec->qual,rec->cnt)
 
with nocounter;, format, separator = " "
endif
 */
if ($Location= "ALL")
SELECT INTO "nl:"
FROM
	orders   o
	, person   p
	, person_alias pa
	, prsnl   pr
	, order_action   oa
	, sch_event_attach   se
	, sch_appt   sa
 	, prsnl prs
 	;, CODE_VALUE CV2
 
plan o where o.order_status_cd =  2546.00
and o.catalog_type_cd+0 = 2517.00
AND O.ACTIVITY_TYPE_CD = 711
and o.active_ind = 1
join se
where se.order_id = o.order_id
join sa
where sa.sch_event_id = se.sch_event_id
;and sa.beg_dt_tm between cnvtdatetime(cnvtdate($sdate),0) and cnvtdatetime(cnvtdate($sdate)+7,2359)
and sa.beg_dt_tm between cnvtdatetime(cnvtdate(sysdate),0) and cnvtdatetime(cnvtdate(sysdate)+$num,2359)
and sa.STATE_MEANING in ("CONFIRMED","CHECKED IN")
and sa.ROLE_MEANING = "PATIENT"
;se
and exists (select cv.code_value from code_value cv
							where cv.code_value = sa.appt_location_cd
							  and cv.display_key = "ME*")  ;value(concat("ME","*"))
 
;JOIN CV2
;WHERE CV2.CODE_VALUE = SA.APPT_LOCATION_CD
;  and cv2.code_set = 220  ;se
;AND CV2.display_key = value(concat(trim("ME",3),"*"))
;AND NOT EXISTS
;			(SELECT
;			OCS.CATALOG_CD
;			FROM
;				CODE_VALUE CV1,
;				OCS_FACILITY_R  OCSF,
;				ORDER_CATALOG_SYNONYM  OCS
;				WHERE OCS.catalog_cd = O.CATALOG_CD
;				AND ocs.activity_type_cd = 711; in (692, 674)
;				and ocs.active_ind = 1
;				and OCSF.SYNONYM_ID = ocs.synonym_id
;				and CV1.CODE_VALUE = OCSF.FACILITY_CD
;				AND CV1.ACTIVE_IND= 1
;				AND  cv1.DISPLAY = concat("ME","*"))
;se
join p where p.person_id =  SA.person_id
;and p.name_last_key != "TESTPATIENT" or p.name_last_key != "*TEST*"
;join e where e.person_id = p.person_id
join pa where pa.person_id = p.person_id
and pa.person_alias_type_cd = 10
and pa.alias_pool_cd=       25036703.00
and pa.end_effective_dt_tm > sysdate  			;se
 
join oa where oa.order_id = o.order_id
and oa.action_type_cd = 2534.00
join pr
where pr.person_id = oa.action_personnel_id
join prs
where prs.person_id = oa.order_provider_id
 
head report
		rec->cnt  = 0
 
head o.order_id
			rec->cnt = rec->cnt + 1
      	if (mod(rec->cnt,10) = 1)
          stat = alterlist(rec->qual, rec->cnt + 9)
    	endif
 
detail
 
	rec->qual[rec->cnt].appt_date = format(cnvtdatetime(sa.beg_dt_tm), "MM/DD/YYYY;;D")
	rec->qual[rec->cnt].appt_time = format(cnvtdatetime(sa.beg_dt_tm), "hh:mm;;m")
	rec->qual[rec->cnt].appt_location = UAR_GET_CODE_DISPLAY(SA.APPT_LOCATION_CD)
	rec->qual[rec->cnt].person_id = p.person_id
  	rec->qual[rec->cnt].patient_name = p.name_full_formatted
  	rec->qual[rec->cnt].dob =  p.birth_dt_tm
  	rec->qual[rec->cnt].exma = o.hna_order_mnemonic
  	rec->qual[rec->cnt].mrn =  pa.alias
	rec->qual[rec->cnt].order_id = o.order_id
  	rec->qual[rec->cnt].order_entered_by = pr.name_full_formatted
  	rec->qual[rec->cnt].ordering_prv = prs.name_full_formatted
 	rec->qual[rec->cnt].testdate =sa.beg_dt_tm
 
foot report
	  stat = alterlist(rec->qual,rec->cnt)
 
with nocounter;, format, separator = " "
endif
 
select into "nl:"
from (dummyt d with seq = value(rec->cnt)),
	 order_detail od
plan d
join od where od.order_id = rec->qual[d.seq].order_id
and od.oe_field_id = 12683
    detail
	rec->qual[d.seq].signs = od.oe_field_display_value
with nocounter
 
select into "nl:"
from (dummyt d with seq = value(rec->cnt)),
	 order_detail od1
plan d
join od1 where od1.order_id = rec->qual[d.seq].order_id
and od1.oe_field_id = 12663
    detail
	rec->qual[d.seq].comment =od1.oe_field_display_value
with nocounter
 
call echorecord(rec)
 
 Execute reportrtl
%i mhs_prg:1_rcmc_rad_appt_list1.dvl
set _SendTo=$1
 
call LayoutQuery(0)
end
go
 
 
 
