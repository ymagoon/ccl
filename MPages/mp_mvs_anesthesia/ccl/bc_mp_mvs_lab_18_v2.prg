drop program bc_mp_mvs_lab_18:dba go
create program bc_mp_mvs_lab_18:dba
/****************************************************************************************************************
                                             PROGRAM NAME HEADER
              Purpose:	Display the Laboratory Results for the Anesthesia Summary
     Source File Name:	bc_mp_mvs_lab_18
          Application:	SurgiNet/PowerChart
  Exectuion Locations:	mPages
            Request #:	
      Translated From:	
        Special Notes:
***************************************************************************************************************/
/****************************************************************************************************************
                                           MODIFICATION CONTROL LOG
										   
  Mod  Date            Engineer                Description
   ---  --------------- ----------------------- ------------------------------------------------
    1   08/02/2011      MediView Solutions      Initial Release
    2	05/16/2012		Karen Speaks			WO# 814087 - pull wbc from hemotology not urinalysis
	2 	mm/dd/yyyy      FirstName LastName      Comments for first modification

******************************************************************************************************************/ 
 
prompt 
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "USERID" = 0
	, "PERSONID" = 0
	, "ENCNTRID" = 0
	, "OPTIONS" = "" 

with OUTDEV, USERID, PERSONID, ENCNTRID, OPTIONS

RECORD lab_result(
	1 person_id = f8
	1 encntr_id = f8

 	1 cbc_cv_cnt = i4
 	1 cbc_cv[*]
 		2 event_cd = f8
 	1 cbc_cnt = i4
 	1 cbc[*]
 		2 wbc = vc
 		2 wbc_high_low = i1
 		2 wbc_crit = i1
 		2 hgb = vc
 		2 hgb_high_low = i1
 		2 hgb_crit = i1
 		2 hct = vc
 		2 hct_high_low = i1
 		2 hct_crit = i1
 		2 plt = vc
 		2 plt_high_low = i1
 		2 plt_crit = i1
 		2 date_time = vc
 	1 bmp_cv_cnt = i4
 	1 bmp_cv[*]
 		2 event_cd = f8
 	1 bmp_cnt = i4
 	1 bmp[*]
 		2 sodium = vc
 		2 sodium_high_low = i1
 		2 sodium_crit = i1
 		2 chloride = vc
 		2 chloride_high_low = i1
 		2 chloride_crit = i1
 		2 bun = vc
 		2 bun_high_low = i1
 		2 bun_crit = i1
 		2 glucose = vc
 		2 glucose_high_low = i1
 		2 glucose_crit = i1
 		2 potassium = vc
 		2 potassium_high_low = i1
 		2 potassium_crit = i1
 		2 bicarbonate = vc
 		2 bicarbonate_high_low = i1
 		2 bicarbonate_crit = i1
 		2 creatinine = vc
 		2 creatinine_high_low = i1
 		2 creatinine_crit = i1
 		2 date_time = vc
 	1 lab_evt_cnt = i4
 	1 lab_evt[*]
 		2 event_cd = f8
 	1 lab_cnt = i4
 	1 lab[*]
 		2 event_cd = f8
 		2 description = vc
 		2 result_cnt = i4
 		2 result[*]
 			3 val = vc
 			3 crit = i1
 			3 high_low = i1
 			3 date_time = vc
)

DECLARE ord_cnt = i2
DECLARE lab_cnt = i2
 
DECLARE INERROR_8_CV		= f8 WITH CONSTANT(uar_get_code_by("MEANING",8,"INERROR")),Protect
DECLARE NOTDONE_8_CV		= f8 WITH CONSTANT(uar_get_code_by("MEANING",8,"NOT DONE")),Protect
DECLARE MODIFIED_8_CV		= f8 WITH CONSTANT(uar_get_code_by("MEANING",8,"MODIFIED")),Protect
DECLARE ALTERED_8_CV   		= f8 WITH CONSTANT(uar_get_code_by("MEANING",8,"ALTERED")),Protect
DECLARE AUTH_8_CV      		= f8 WITH CONSTANT(uar_get_code_by("MEANING",8,"AUTH")),Protect
DECLARE ACTV_48_CV      	= f8 WITH CONSTANT(uar_get_code_by("MEANING",48,"ACTIVE")),Protect
 
DECLARE CRIT_CS_52 			= F8 WITH public, CONSTANT(uar_get_code_by("DISPLAYKEY",52,"CRIT"))
DECLARE RVWPOS_CS_52 		= F8 WITH public, CONSTANT(uar_get_code_by("DESCRIPTION",52,"Postive"))
DECLARE ABN_CS_52 			= F8 WITH public, CONSTANT(uar_get_code_by("DISPLAYKEY",52,"ABN"))
DECLARE HI_CS_52 			= F8 WITH public, CONSTANT(uar_get_code_by("DISPLAYKEY",52,"HI"))
DECLARE LOW_CS_52 			= F8 WITH public, CONSTANT(uar_get_code_by("DISPLAYKEY",52,"LOW"))
 
DECLARE ordCD_6003_CV		= f8 WITH public, CONSTANT(uar_get_code_by("DISPLAYKEY",6003,"ORDER"))
DECLARE cmpSTAT_6004_CV		= f8 WITH public, CONSTANT(uar_get_code_by("DISPLAYKEY",6004,"COMPLETED"))

DECLARE ordSTAT_6004_CV		= f8 WITH public, CONSTANT(uar_get_code_by("DISPLAYKEY",6004,"ORDERED"))
DECLARE inpSTAT_6004_CV		= f8 WITH public, CONSTANT(uar_get_code_by("DISPLAYKEY",6004,"INPROCESS"))
 
DECLARE labCD_6000_CV		= f8 WITH public, CONSTANT(uar_get_code_by("DISPLAYKEY",6000,"LABORATORY"))
DECLARE GLB_106_CV      	= f8 WITH CONSTANT(uar_get_code_by("MEANING",106,"GLB")),Protect

DECLARE  ANATOMICPATHOLOGY_106_CV = F8 WITH PROTECT, CONSTANT(UAR_GET_CODE_BY("MEANING",106,"AP"))

declare UAWMICROSCOPIC_200_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",200,"UAWMICROSCOPIC")),protect
	
DECLARE prev_head			= vc

declare BEDSIDEGLUCOSE_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",72,"BEDSIDEGLUCOSE")),protect
declare PREGNANCYUR_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",72,"PREGNANCYUR")),protect
	

declare HCGQNT_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",72,"HCGQNT")),protect
declare HCGQUAL_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",72,"HCGQUAL")),protect
	

declare INERRNOMUT_CV = f8
	with constant(uar_get_code_by("MEANING",8,"INERRNOMUT")),protect
declare INERRNOVIEW_CV = f8
	with constant(uar_get_code_by("MEANING",8,"INERRNOVIEW")),protect
declare INERROR_CV = f8
	with constant(uar_get_code_by("MEANING",8,"INERROR")),protect

declare URINEDRUGSCREENGRID_72_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",72,"URINEDRUGSCREENGRID")),protect
 
SELECT INTO "nl:"
FROM encounter e
PLAN e WHERE e.encntr_id = $ENCNTRID 
	 AND e.active_ind = 1
	 AND e.active_status_cd = ACTV_48_CV 
	 
DETAIL
	lab_result->encntr_id = e.encntr_id
	lab_result->person_id = e.person_id
 
WITH NOCOUNTER
 
 
/****************************************************************************************************************
										SELECT LAB RESULTS
****************************************************************************************************************/
select into 'nl:'
from code_value cv
plan cv
	where cv.code_set = 72
	;and cv.display_key in ("WBC","HGB","HCT","PLT")
	and cv.description in ("WBC","HGB","HCT","PLT")		;v2 kls
	and cv.active_ind = 1
	and cv.begin_effective_dt_tm < sysdate
	and cv.end_effective_dt_tm > sysdate
detail
	cnt = lab_result->cbc_cv_cnt + 1
	lab_result->cbc_cv_cnt = cnt
	stat = alterlist(lab_result->cbc_cv, cnt)
	lab_result->cbc_cv[cnt].event_cd = cv.code_value
with nocounter

declare cbc_cnt = i4
select into 'nl:'
from clinical_event ce
plan ce
	where ce.person_id = $PERSONID
	and expand(cbc_cnt, 1, lab_result->cbc_cv_cnt, ce.event_cd, lab_result->cbc_cv[cbc_cnt].event_cd)
	and ce.record_status_cd = ACTV_48_CV
	and ce.result_status_cd +0 in (AUTH_8_CV, MODIFIED_8_CV)
	and ce.view_level = 1
	and ce.publish_flag = 1
	and ce.valid_from_dt_tm < sysdate
	and ce.valid_until_dt_tm > sysdate
order by ce.event_end_dt_tm desc
head ce.event_end_dt_tm
	cnt = lab_result->cbc_cnt + 1
	if (cnt > 5)
		BREAK
	endif
	lab_result->cbc_cnt = cnt
	stat = alterlist(lab_result->cbc, cnt)
detail
	case (cnvtupper(uar_get_code_display(ce.event_cd)))
	of "WBC":
		lab_result->cbc[cnt].wbc = ce.result_val
	of "HGB":
		lab_result->cbc[cnt].hgb = ce.result_val
	of "PLT":
		lab_result->cbc[cnt].plt = ce.result_val
	of "HCT":
		lab_result->cbc[cnt].hct = ce.result_val
	endcase
	lab_result->cbc[cnt].date_time = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;q")
	call echo(build("NORMALCY:",ce.normalcy_cd," ",uar_get_code_display(ce.normalcy_cd)))
	if (ce.normalcy_cd in (HI_CS_52, LOW_CS_52))
		case (cnvtupper(uar_get_code_display(ce.event_cd)))
		of "WBC":
			lab_result->cbc[cnt].wbc_high_low = 1
		of "HGB":
			lab_result->cbc[cnt].hgb_high_low = 1
		of "PLT":
			lab_result->cbc[cnt].plt_high_low = 1
		of "HCT":
			lab_result->cbc[cnt].hct_high_low = 1
		endcase
	endif
	if (ce.normalcy_cd = CRIT_CS_52)
		case (cnvtupper(uar_get_code_display(ce.event_cd)))
		of "WBC":
			lab_result->cbc[cnt].wbc_crit = 1
		of "HGB":
			lab_result->cbc[cnt].hgb_crit = 1
		of "PLT":
			lab_result->cbc[cnt].plt_crit = 1
		of "HCT":
			lab_result->cbc[cnt].hct_crit = 1
		endcase
	endif
with nocounter

select into 'nl:'
from code_value cv
plan cv
	where cv.code_set = 72
	and cv.display_key in ("SODIUM","POTASSIUM","CHLORIDE","CARBONDIOXIDE","GLUCOSE","BUN","CREATININE")
	and cv.active_ind = 1
	and cv.begin_effective_dt_tm < sysdate
	and cv.end_effective_dt_tm > sysdate
	and cv.code_value != HCGQUAL_CV
detail
	cnt = lab_result->bmp_cv_cnt + 1
	lab_result->bmp_cv_cnt = cnt
	stat = alterlist(lab_result->bmp_cv, cnt)
	lab_result->bmp_cv[cnt].event_cd = cv.code_value
with nocounter

declare bmp_cnt = i4
select into 'nl:'
from clinical_event ce
plan ce
	where ce.person_id = $PERSONID
	and expand(bmp_cnt, 1, lab_result->bmp_cv_cnt, ce.event_cd, lab_result->bmp_cv[bmp_cnt].event_cd)
	and ce.record_status_cd = ACTV_48_CV
	and ce.result_status_cd +0 in (AUTH_8_CV, MODIFIED_8_CV)
	and ce.view_level = 1
	and ce.publish_flag = 1
	and ce.valid_from_dt_tm < sysdate
	and ce.valid_until_dt_tm > sysdate
order by ce.event_end_dt_tm desc
head ce.event_end_dt_tm
	show_record = 0
	if (cnvtupper(uar_get_code_display(ce.event_cd)) != "GLUCOSE" or
		(cnvtupper(uar_get_code_display(ce.event_cd)) = "GLUCOSE" and
		ce.catalog_cd != UAWMICROSCOPIC_200_CV)) 
		if (cnvtupper(uar_get_code_display(ce.event_cd)) = "GLUCOSE" and
			isnumeric(ce.result_val) = 0)
			show_record = 0
		else
			show_record = 1
		endif
	endif
	if (show_record = 1)
		cnt = lab_result->bmp_cnt + 1
		if (cnt > 5)
			BREAK
		endif
		lab_result->bmp_cnt = cnt
		stat = alterlist(lab_result->bmp, cnt)
	endif
detail
	if (show_record = 1)
	if (cnvtupper(uar_get_code_display(ce.event_cd)) != "GLUCOSE" or
		(cnvtupper(uar_get_code_display(ce.event_cd)) = "GLUCOSE" and
		ce.catalog_cd != UAWMICROSCOPIC_200_CV))
	case (cnvtupper(uar_get_code_display(ce.event_cd)))
	of "SODIUM":
		lab_result->bmp[cnt].sodium = ce.result_val
	of "POTASSIUM":
		lab_result->bmp[cnt].potassium = ce.result_val
	of "CHLORIDE":
		lab_result->bmp[cnt].chloride = ce.result_val
	of "CARBON DIOXIDE":
		lab_result->bmp[cnt].bicarbonate = ce.result_val
	of "GLUCOSE":
		call echo(build("glucose ce.event_id:",ce.event_id))
		call echo(build("ce.event_end_dt_tm:", format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;q")))
		call echo(build("glucose ce.event_cd:", ce.event_cd))
		if (isnumeric(ce.result_val) > 0)
		lab_result->bmp[cnt].glucose = ce.result_val
		endif
	of "BUN":
		lab_result->bmp[cnt].bun = ce.result_val
	of "CREATININE":
		lab_result->bmp[cnt].creatinine = ce.result_val
	endcase
	lab_result->bmp[cnt].date_time = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;q")
	
	if (ce.normalcy_cd in (HI_CS_52, LOW_CS_52))
		case (cnvtupper(uar_get_code_display(ce.event_cd)))
		of "SODIUM":
			lab_result->bmp[cnt].sodium_high_low = 1
		of "POTASSIUM":
			lab_result->bmp[cnt].potassium_high_low = 1
		of "CHLORIDE":
			lab_result->bmp[cnt].chloride_high_low = 1
		of "CARBON DIOXIDE":
			lab_result->bmp[cnt].bicarbonate_high_low = 1
		of "GLUCOSE":
			lab_result->bmp[cnt].glucose_high_low = 1
		of "BUN":
			lab_result->bmp[cnt].bun_high_low = 1
		of "CREATININE":
			lab_result->bmp[cnt].creatinine_high_low = 1
		endcase
	endif
	if (ce.normalcy_cd = CRIT_CS_52)
		case (cnvtupper(uar_get_code_display(ce.event_cd)))
		of "SODIUM":
			lab_result->bmp[cnt].sodium_crit = 1
		of "POTASSIUM":
			lab_result->bmp[cnt].potassium_crit = 1
		of "CHLORIDE":
			lab_result->bmp[cnt].chloride_crit = 1
		of "CARBON DIOXIDE":
			lab_result->bmp[cnt].bicarbonate_crit = 1
		of "GLUCOSE":
			lab_result->bmp[cnt].glucose_crit = 1
		of "BUN":
			lab_result->bmp[cnt].bun_crit = 1
		of "CREATININE":
			lab_result->bmp[cnt].creatinine_crit = 1
		endcase
	endif
	endif
	endif
with nocounter

call echorecord(lab_result)

select into 'nl:'
from v500_event_set_code ves,
	v500_event_set_explode vesx,
	code_value cv
plan ves
	where ves.event_set_name_key = "ANESTHESIALABS"
join vesx
	where vesx.event_set_cd = ves.event_set_cd
join cv
	where cv.code_value = vesx.event_cd
	and not cv.display_key in ("WBC","HGB","HCT","PLT","SODIUM","POTASSIUM",
					"CHLORIDE","CARBONDIOXIDE","GLUCOSE","BUN","CREATININE")
detail
	cnt = lab_result->lab_evt_cnt + 1
	lab_result->lab_evt_cnt = cnt
	stat = alterlist(lab_result->lab_evt, cnt)
	lab_result->lab_evt[cnt].event_cd = vesx.event_cd
with nocounter

set lab_result->lab_evt_cnt = (lab_result->lab_evt_cnt + 1)
set stat = alterlist(lab_result->lab_evt, lab_result->lab_evt_cnt)
set lab_result->lab_evt[lab_result->lab_evt_cnt].event_cd = URINEDRUGSCREENGRID_72_CV

set lab_result->lab_evt_cnt = (lab_result->lab_evt_cnt + 1)
set stat = alterlist(lab_result->lab_evt, lab_result->lab_evt_cnt)
set lab_result->lab_evt[lab_result->lab_evt_cnt].event_cd = HCGQNT_CV

set lab_result->lab_evt_cnt = (lab_result->lab_evt_cnt + 1)
set stat = alterlist(lab_result->lab_evt, lab_result->lab_evt_cnt)
set lab_result->lab_evt[lab_result->lab_evt_cnt].event_cd = HCGQUAL_CV

declare lab_cnt = i4
select into 'nl:'
	sort_id = if (ce.event_cd = HCGQNT_CV) '00' 
		elseif (ce.event_cd = HCGQUAL_CV) '01'
		else '99' 
		endif
from clinical_event ce
plan ce
	where ce.person_id = $PERSONID
	and expand(lab_cnt, 1, lab_result->lab_evt_cnt, ce.event_cd, lab_result->lab_evt[lab_cnt].event_cd)
	and ce.record_status_cd = ACTV_48_CV
	and ce.result_status_cd +0 in (AUTH_8_CV, MODIFIED_8_CV)
	and ce.view_level = 1
	and ce.publish_flag = 1
	and ce.valid_from_dt_tm < sysdate
	and ce.valid_until_dt_tm > sysdate
order by  sort_id,ce.event_cd, ce.event_end_dt_tm desc
head ce.event_cd
	cnt = lab_result->lab_cnt + 1
	lab_result->lab_cnt = cnt
	stat = alterlist(lab_result->lab, cnt)
	lab_result->lab[cnt].event_cd = ce.event_cd
	lab_result->lab[cnt].description = uar_get_code_display(ce.event_cd)
detail
	cnt2 = lab_result->lab[cnt].result_cnt + 1
	if (cnt2 < 6)
		lab_result->lab[cnt].result_cnt = cnt2
		stat = alterlist(lab_result->lab[cnt].result, cnt2)
		lab_result->lab[cnt].result[cnt2].val = ce.result_val
		if (ce.normalcy_cd = CRIT_CS_52)
			lab_result->lab[cnt].result[cnt2].crit = 1
		endif
		if (ce.normalcy_cd in (HI_CS_52, LOW_CS_52))
			lab_result->lab[cnt].result[cnt2].high_low = 1
		endif
		lab_result->lab[cnt].result[cnt2].date_time = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;q")
	endif
with nocounter
	
/*
SELECT INTO "NL:"
    O.ORDER_ID
   ,O.ORDER_MNEMONIC
   ,O.ORIG_ORDER_DT_TM "MM/DD/YYYY HH:MM"
   ,ACCESSION = CNVTACC(CE.ACCESSION_NBR)
   ,EVENT_DESC = UAR_GET_CODE_DISPLAY(CE.EVENT_CD)
   ,CE.VERIFIED_DT_TM "@SHORTDATETIME"
   ,RESULT = SUBSTRING(1,10,CE.RESULT_VAL)
   ,TASK_ASSAY_CD 	= CE.TASK_ASSAY_CD
   ,LAB_CD = UAR_GET_CODE_DISPLAY(CE.NORMALCY_CD)
 
FROM
  ORDERS  O
  , CLINICAL_EVENT  CE
 
PLAN O
   WHERE O.ENCNTR_ID = $ENCNTRID
   AND O.ACTIVITY_TYPE_CD + 0 = GLB_106_CV  
   AND O.ACTIVE_IND = 1
   AND O.ORDER_STATUS_CD = CMPSTAT_6004_CV 
JOIN CE
   WHERE CE.ORDER_ID = O.ORDER_ID
   AND CE.EVENT_CD +0 != 0
   AND CE.RECORD_STATUS_CD = ACTV_48_CV 
   AND CE.RESULT_STATUS_CD +0 IN (AUTH_8_CV ,MODIFIED_8_CV )
   AND CE.VIEW_LEVEL = 1
   AND CE.PUBLISH_FLAG = 1
   AND CE.VALID_UNTIL_DT_TM +0 > CNVTDATETIME(CURDATE,CURTIME3)
 
ORDER BY
   O.ORDERED_AS_MNEMONIC
  ,CE.CLINICAL_EVENT_ID
 
HEAD REPORT
   STAT = ALTERLIST(LAB_RESULT->ORDER_INFO,9)
   ORD_CNT = 0
 
HEAD O.ORDERED_AS_MNEMONIC
	; INCREMENT COUNT OF LAB ORDERS
   ORD_CNT = ORD_CNT + 1
 
	; CHECK FOR AVAILABLE MEMORY IN THE LAB_RESULT LIST
	IF(MOD(ORD_CNT,10) = 0)
	   STAT = ALTERLIST(LAB_RESULT->ORDER_INFO,ORD_CNT + 9 )
	ENDIF
 
	; LOAD LAB INFORMATION INTO ARRAY
	LAB_RESULT->ORDER_INFO[ORD_CNT].ACCESSION_NBR 	= CE.ACCESSION_NBR
	LAB_RESULT->ORDER_INFO[ORD_CNT].ORD_MNEM 		= TRIM(O.HNA_ORDER_MNEMONIC)
	LAB_RESULT->ORDER_INFO[ORD_CNT].ORD_ID 			= O.ORDER_ID
	LAB_RESULT->ORDER_INFO[ORD_CNT].ORD_DT_TM		= FORMAT(O.ORIG_ORDER_DT_TM,"MM/DD/YY HH:MM")
	LAB_CNT = 0
 
DETAIL
 
	; increment count of lab orders
	LAB_CNT = LAB_CNT + 1
 
	; check for available memory in the lab_result list
	IF(MOD(LAB_CNT,10) = 1)
	   STAT = ALTERLIST(LAB_RESULT->ORDER_INFO[ORD_CNT].RESULT,LAB_CNT + 9)
	ENDIF
 
	; set event description and date / time / results value to record structue.
	LAB_RESULT->ORDER_INFO[ORD_CNT].RESULT[LAB_CNT].EVENT_DESC  = UAR_GET_CODE_DISPLAY(CE.EVENT_CD)
	LAB_RESULT->ORDER_INFO[ORD_CNT].RESULT[LAB_CNT].RESLT_DT_TM = FORMAT(CE.VERIFIED_DT_TM,"MM/DD/YY HH:MM")
	IF(TEXTLEN(CE.RESULT_VAL) > 6 )
	   LAB_RESULT->ORDER_INFO[ORD_CNT].RESULT[LAB_CNT].RESULT_VAL = SUBSTRING(1,3,CE.RESULT_VAL)
	ELSE
	   LAB_RESULT->ORDER_INFO[ORD_CNT].RESULT[LAB_CNT].RESULT_VAL = CE.RESULT_VAL
	ENDIF
	; set normality information in record structure.
	LAB_RESULT->ORDER_INFO[ORD_CNT].RESULT[LAB_CNT].NORM_CD 	= CE.NORMALCY_CD
	LAB_RESULT->ORDER_INFO[ORD_CNT].RESULT[LAB_CNT].NORM_VAL 	= UAR_GET_CODE_DISPLAY(CE.NORMALCY_CD)
 
FOOT O.ORDERED_AS_MNEMONIC
 
	LAB_RESULT->ORDER_INFO[ORD_CNT].RSLT_CNT = LAB_CNT
	; free memory that was allocated but not used for lab_results
	STAT = ALTERLIST(LAB_RESULT->ORDER_INFO[ORD_CNT].RESULT, LAB_CNT)
 
FOOT REPORT
	; free memory that was allocated but not used for lab_results
	LAB_RESULT->ORD_CNT = ORD_CNT
	STAT = ALTERLIST(LAB_RESULT->ORDER_INFO, ORD_CNT)
 
WITH NOCOUNTER

select into 'nl:'
from clinical_event ce
plan ce
	where ce.person_id = $PERSONID
	and ce.encntr_id +0 = $ENCNTRID
	and ce.event_cd in (BEDSIDEGLUCOSE_CV) ;, PREGNANCYUR_CV)
	and ce.valid_from_dt_tm < sysdate
	and ce.valid_until_dt_tm > sysdate
	and not ce.result_status_cd in (INERRNOMUT_CV, INERRNOVIEW_CV, INERROR_CV)
	and ce.event_end_dt_tm = (select max(ce1.event_end_dt_tm)
								from clinical_event ce1
								where ce1.person_id = ce.person_id
								and ce1.encntr_id +0 = ce.encntr_id
								and ce1.event_cd = ce.event_cd
								and ce1.valid_from_dt_tm < sysdate
								and ce1.valid_until_dt_tm > sysdate
								and not ce1.result_status_cd in (INERRNOMUT_CV, INERRNOVIEW_CV, INERROR_CV))
detail
	cnt = lab_result->ord_cnt + 1
	lab_result->ord_cnt = cnt
	stat = alterlist(lab_result->order_info, cnt)
	lab_result->order_info[cnt].ord_dt_tm = format(ce.event_end_dt_tm, "MM/DD/Y HH:MM")
	lab_result->order_info[cnt].ord_mnem = trim(uar_get_code_display(ce.event_cd))
	cnt2 = lab_result->order_info[cnt].rslt_cnt + 1
	lab_result->order_info[cnt].rslt_cnt = cnt2
	stat = alterlist(lab_result->order_info[cnt].result, cnt2)
	lab_result->order_info[cnt].result[cnt2].event_desc = trim(uar_get_code_display(ce.event_cd))
	lab_result->order_info[cnt].result[cnt2].norm_cd = ce.normalcy_cd
	lab_result->order_info[cnt].result[cnt2].norm_val = uar_get_code_display(ce.normalcy_cd)
	lab_result->order_info[cnt].result[cnt2].reslt_dt_tm = format(ce.verified_dt_tm,"MM/DD/YY HH:MM")
	if (textlen(ce.result_val) > 6)
		lab_result->order_info[cnt].result[cnt2].result_val = substring(1,3,ce.result_val)
	else
		lab_result->order_info[cnt].result[cnt2].result_val = ce.result_val
	endif
with nocounter

SELECT  INTO "NL:"
	O.CATALOG_TYPE_CD,
	CV.COLLATION_SEQ,
	O.ENCNTR_ID,
	O.PERSON_ID,
	O.CATALOG_TYPE_CD,
	CATALOG_TYPE_DISP = UAR_GET_CODE_DISPLAY (O.CATALOG_TYPE_CD),
	ACTIVITY_TYPE = UAR_GET_CODE_DISPLAY (O.ACTIVITY_TYPE_CD),
	O.ORDER_MNEMONIC,
	ACTIVE_DT = FORMAT (O.ACTIVE_STATUS_DT_TM, "MM/DD/YY HH:MM;;D" ),
	ORDER_STATUS = UAR_GET_CODE_DISPLAY (O.ORDER_STATUS_CD),
	O.UPDT_DT_TM"@SHORTDATETIME",
	O.ACTIVE_STATUS_DT_TM"@SHORTDATETIME",
	CV.COLLATION_SEQ,
	CODE_VALUE = UAR_GET_CODE_DISPLAY(CV.CODE_VALUE),
	DESCRIPTION =CV.DESCRIPTION,
	CV.DISPLAY
FROM ORDERS O,
	ORDER_ACTION OA,
	CODE_VALUE CV
PLAN O
	WHERE O.ENCNTR_ID = $ENCNTRID
	AND O.PERSON_ID+0 = $PERSONID 
	AND O.CATALOG_TYPE_CD+0 = LABCD_6000_CV
	AND O.ACTIVITY_TYPE_CD+0 != GLB_106_CV
	AND NOT O.ACTIVITY_TYPE_CD+0 = GLB_106_CV
	AND O.ORDER_STATUS_CD+0 IN (ORDSTAT_6004_CV,INPSTAT_6004_CV) 
	AND  NOT O.TEMPLATE_ORDER_FLAG+0 IN (2,3,4)
	AND O.ORDERABLE_TYPE_FLAG+0 !=6
	AND O.ACTIVE_IND+0 =1
join OA
	WHERE OA.ORDER_ID=O.ORDER_ID
	AND OA.ACTION_TYPE_CD+0 = ORDCD_6003_CV
JOIN CV
	WHERE CV.CODE_VALUE=O.DCP_CLIN_CAT_CD
	AND CV.BEGIN_EFFECTIVE_DT_TM+0 <= CNVTDATETIME(CURDATE,CURTIME) 
	AND CV.END_EFFECTIVE_DT_TM+0 >= CNVTDATETIME(CURDATE,CURTIME) 
	AND CV.ACTIVE_IND+0 =1
ORDER BY CV.COLLATION_SEQ,
	O.CATALOG_TYPE_CD,
	UAR_GET_CODE_DISPLAY(O.ACTIVITY_TYPE_CD),
	CNVTDATETIME(O.ACTIVE_STATUS_DT_TM) DESC
HEAD O.CATALOG_TYPE_CD
	cnt1 = lab_result->micro_cnt + 1
	lab_result->micro_cnt = cnt1
	stat = alterlist(lab_result->micro_order, cnt1)
	lab_result->micro_order[cnt1].cat_cd = cv.code_value
	lab_result->micro_order[cnt1].cat_disp = uar_get_code_display(cv.code_value)
DETAIL
	cnt2 = lab_result->micro_order[cnt1].cnt + 1
	lab_result->micro_order[cnt1].cnt = cnt2
	stat = alterlist(lab_result->micro_order[cnt1].orders, cnt2)
	lab_result->micro_order[cnt1].orders[cnt2].order_id = o.order_id
	lab_result->micro_order[cnt1].orders[cnt2].activity_type = uar_get_code_display(o.activity_type_cd)
	lab_result->micro_order[cnt1].orders[cnt2].mnemonic = o.order_mnemonic
	lab_result->micro_order[cnt1].orders[cnt2].display = trim(o.order_mnemonic)
	lab_result->micro_order[cnt1].orders[cnt2].start_date = format(o.active_status_dt_tm, "MM/DD/YY HH:MM;;D")
	lab_result->micro_order[cnt1].orders[cnt2].cs_flag = o.cs_flag
	lab_result->micro_order[cnt1].orders[cnt2].cs_order_id = o.cs_order_id
	if (o.order_comment_ind = 1)
		lab_result->micro_order[cnt1].orders[cnt2].comment_ind = 1
	endif
WITH  NOCOUNTER

if (lab_result->micro_cnt > 0)
	select into 'nl:'
	from (dummyt d1 with seq=lab_result->micro_cnt),
		(dummyt d2 with seq=1),
		orders o
	plan d1
		where maxrec(d2, lab_result->micro_order[d1.seq].cnt)
	join d2
		where lab_result->micro_order[d1.seq].orders[d2.seq].cs_flag = 2
	join o
		where o.order_id = lab_result->micro_order[d1.seq].orders[d2.seq].order_id
		and o.active_ind = 1
	detail
		lab_result->micro_order[d1.seq].orders[d2.seq].cs_name = trim(o.hna_order_mnemonic)
		lab_result->micro_order[d1.seq].orders[d2.seq].display = 
			concat(trim(lab_result->micro_order[d1.seq].orders[d2.seq].display), " (",
			trim(o.hna_order_mnemonic),")")
	with nocounter
	
	select into 'nl:'
	from (dummyt d1 with seq=lab_result->micro_cnt),
		(dummyt d2 with seq=1),
		order_comment oc,
		long_text lt
	plan d1
		where maxrec(d2, lab_result->micro_order[d1.seq].cnt)
	join d2
		where lab_result->micro_order[d1.seq].orders[d2.seq].comment_ind = 1
	join oc
		where oc.order_id = lab_result->micro_order[d1.seq].orders[d2.seq].order_id
	join lt
		where lt.long_text_id = oc.long_text_id
	detail
		if (trim(lab_result->micro_order[d1.seq].orders[d2.seq].comment) = "")
			lab_result->micro_order[d1.seq].orders[d2.seq].comment = concat("Comment(s): ",
				trim(lt.long_text))
		else
			lab_result->micro_order[d1.seq].orders[d2.seq].comment = 
				concat(trim(lab_result->micro_order[d1.seq].orders[d2.seq].comment),
				"; ", trim(lt.long_text))
		endif
	with nocounter
endif
*/

call echojson(lab_result, $OUTDEV)
 
END
GO
 
