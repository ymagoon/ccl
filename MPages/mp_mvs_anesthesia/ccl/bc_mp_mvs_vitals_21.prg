drop program bc_mp_mvs_vitals_21:dba go
create program bc_mp_mvs_vitals_21:dba
/**************************************************************************************************
              Purpose: Displays the Vital Signs 
     Source File Name: bc_mp_mvs_vitals_21.PRG
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
    1   08/11/2011      MediView Solutions 	    Initial Release
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

record vitals(
	1 person_id = f8
	1 encntr_id = f8
	1 bp_sys = vc
	1 bp_dia = vc
	1 bp_mean = vc
	1 bp_dt_tm = vc
	1 hr = vc
	1 hr_dt_tm = vc
	1 rr = vc
	1 rr_dt_tm = vc
	1 spo2 = vc
	1 spo2_dt_tm = vc
	1 temp = vc
	1 temp_dt_tm = vc
	1 wt = vc
	1 wt_dt_tm = vc
	1 wt_estimated = i1
	1 ht = vc
	1 ht_dt_tm = vc
	1 bmi = vc
	1 bmi_dt_tm = vc
)

 
DECLARE INERROR_8_CV		= f8 WITH Constant(uar_get_code_by("MEANING",8,"INERROR")),Protect
DECLARE MODIFIED_8_CV		= f8 WITH Constant(uar_get_code_by("MEANING",8,"MODIFIED")),Protect
DECLARE AUTH_8_CV      		= f8 WITH Constant(uar_get_code_by("MEANING",8,"AUTH")),Protect
DECLARE ACTV_48_CV      	= f8 WITH Constant(uar_get_code_by("MEANING",48,"ACTIVE")),Protect
DECLARE CONFIRM_4000160_CV	= f8 WITH public, constant(uar_get_code_by("DISPLAYKEY",4000160,"CONFIRMED"))

	; Clincal Event Codes for VITALS
DECLARE TEMPAXIL_72_CV		= f8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"TEMPERATUREAXILLARY"))
DECLARE TEMPPO_72_CV 		= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"TEMPERATUREORAL"))
DECLARE TEMPREC_72_CV 		= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"TEMPERATURERECTAL"))
DECLARE TEMPTEMPA_72_CV 	= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"TEMPERATURETEMPORALARTERY"))
DECLARE HRTRTMON_72_CV 		= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"HEARTRATEMONITORED"))
DECLARE APHR_72_CV 			= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"APICALHEARTRATE"))
DECLARE PERPHPR_72_CV 		= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"PERIPHERALPULSERATE"))
DECLARE BRACH_72_CV 		= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"BRACHIALPULSERATE"))
DECLARE FEM_72_CV 			= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"FEMORALPULSERATE"))
declare PULSERATE_72_CV = f8 with public, constant(uar_get_code_by("DISPLAYKEY",72,"PULSERATE"))
DECLARE RESPRATE_72_CV 		= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"RESPIRATORYRATE"))
DECLARE SYSBP_72_CV 		= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"SYSTOLICBLOODPRESSURE"))
DECLARE DISTBP_72_CV 		= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"DIASTOLICBLOODPRESSURE"))
DECLARE MEANARTPRESS_72_CV 	= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"MEANARTERIALPRESSURECUFF"))
DECLARE SYSBPSUP_72_CV 		= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"SYSTOLICBLOODPRESSURESUPINE"))
DECLARE DISTBPSUP_72_CV 	= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"DIASTOLICBLOODPRESSURESUPINE"))
DECLARE DISTBPSIT_72_CV 	= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"DIASTOLICBLOODPRESSURESITTING"))
DECLARE SYSBPSIT_72_CV 		= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"SYSTOLICBLOODPRESSURESITTING"))
DECLARE SYSBPSTND_72_CV 	= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"SYSTOLICBLOODPRESSURESTANDING"))
DECLARE DISTBPSTND_72_CV 	= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"DIASTOLICBLOODPRESSURESTANDING"))
DECLARE PULSIT_72_CV 		= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"PULSESITTING"))
DECLARE PULSTND_72_CV 		= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"PULSESTANDING"))
DECLARE PULSUP_72_CV 		= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"PULSESUPINE"))
DECLARE ICP_72_CV 			= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"INTRACRANIALPRESSURE")) ;ICP
DECLARE CPP_72_CV 			= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"CEREBRALPERFUSIONPRESSURE")) ;CPP
DECLARE INTRAABDPRES_72_CV 	= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"INTRAABDOMINALPRESSURE"))
DECLARE bradycard_72_CV		= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"BRADYCARDIA"))
DECLARE apnea_72_CV 		= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"APNEA"))

DECLARE COLORAP_72_CV 		= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"COLORAPNEA"))
DECLARE STIMAPNEA_72_CV 	= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"STIMULATIONREQUIREDAPNEA"))
DECLARE PULOXAP_72_CV 		= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"PULSEOXIMETRYAPNEA"))

	; updated estimated weight code value
DECLARE ESTWGHTKG_72_CV 	= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"WEIGHTESTIMATEDKG"))
DECLARE ESTWGHTLBS_72_CV  = F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"WEIGHTESTIMATEDLBS"))

DECLARE BRTHLEN_72_CV 		= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"BIRTHLENGTH"))
DECLARE PRIMPAININT_72_CV 	= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"PRIMARYPAININTENSITY"))
DECLARE NVPSSCRE_72_CV 		= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"NVPSSCORE"))
DECLARE WBFCSLE_72_CV 		= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"WONGBAKERFACESSCALE"))
DECLARE FLACCSCRE_72_CV 	= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"FLACCSCORE"))
DECLARE NPASSSCR_72_CV 		= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"NPASSSCORE"))
DECLARE NSRSSSCR_72_CV 		= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"NSRASSCORE"))
	; Clincal Event Codes for Assessment
DECLARE lvlcon_72_CV 		= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"LEVELOFCONSCIOUSNESS"))
DECLARE respirats_72_CV 	= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"RESPIRATIONS"))
DECLARE cardrythm_72_CV 	= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"CARDIACRHYTHM"))
DECLARE murmauscul_72_CV 	= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"HEARTSOUNDS"));MURMURAUSCULTATED
DECLARE chestphysio_72_CV 	= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"CHESTPHYSIOTHERAPY"))
DECLARE creploc_72_CV 		= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"CREPITUSLOCATION"))
DECLARE suction_72_CV 		= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"SUCTION"))
DECLARE sputcon_72_CV 		= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"SPUTUMCONSISTENCY"))
DECLARE sputcol_72_CV 		= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"SPUTUMCOLOR"))
DECLARE sputamt_72_CV 		= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"SPUTUMAMOUNT"))
DECLARE alllobbrth_72_CV 	= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"ALLLOBESBREATHSOUNDS"))
DECLARE DCPGEN_72_CV 		= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"DCPGENERICCODE"))

	; Height and Weight Related
DECLARE NUM_53_CV 			= F8 WITH PUBLIC, CONSTANT(UAR_GET_CODE_BY("DISPLAYKEY", 53, "NUM"))
DECLARE MED_53_CV 			= F8 WITH PUBLIC, CONSTANT(UAR_GET_CODE_BY("DISPLAYKEY", 53, "MED"))

DECLARE weightkg_72_CV 		= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"WEIGHTACTUALKG"))

DECLARE wumwghtgrm_72_CV 	= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"WUMWEIGHTGRAMS"))
DECLARE wumwghtkg_72_CV 	= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"WUMWEIGHTKG"))
DECLARE wumwghtwgrm_72_CV 	= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"WUMWEIGHTKGWGRAMS"))
DECLARE wumwghtlbs_72_CV 	= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"WUMWEIGHTLB"))
DECLARE wumwghtwoz_72_CV 	= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"WUMWEIGHTLBWOZ"))
DECLARE wumwghtoz_72_CV 	= F8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"WUMWEIGHTOUNCES"))
DECLARE date_challenge		= dq8 ;----->used to eliminate a weight if converted
DECLARE dlywght1_con		= f8 WITH PUBLIC, CONSTANT(50)
DECLARE ord_order_flag		= i2 WITH PUBLIC, CONSTANT(2)
DECLARE tsk_order_flag		= i2 WITH PUBLIC, CONSTANT(3)
DECLARE rx_order_flag		= i2 WITH PUBLIC, CONSTANT(4)
DECLARE intake_io_flag		= i2 WITH PUBLIC, CONSTANT(1)
DECLARE output_io_flag		= i2 WITH PUBLIC, CONSTANT(2)

DECLARE  SPO2_72_CV  =  F8  
	WITH  PUBLIC , CONSTANT ( UAR_GET_CODE_BY ("DISPLAYKEY" , 72 , "SPO2" ))

declare BODYMASSINDEXBMI_72_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",72,"BODYMASSINDEXBMI")),protect
declare HEIGHTINCHES_72_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",72,"HEIGHTINCHES")),protect
declare WEIGHTACTUALKG_72_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",72,"WEIGHTACTUALKG")),protect
	
SET vit_cnt	= 0 	; used to indicate if VITALS has any data
SET o2_cnt 	= 0 	; used to indicate if o2 therapy has any data
SET ast_cnt = 0 	; used to indicate if assessment section has any data
SET total12 = 0.00
SET total24 = 0.00
SET r_out 	= 0 	; used to show there are output values to further evaluate in total calculations

;SELECT INTO "NL:"
;	pt_dob_dt_tm = 	FORMAT (CNVTDATETIME( p.birth_dt_tm ) ,"MM/DD/YYYY  ;;D")
;FROM person p
;PLAN p 
;	WHERE p.person_id = $PERSONID
; 	AND p.active_ind = 1
;DETAIL
;	VITALS->pt_dob_dt_tm = pt_dob_dt_tm			; p.birth_dt_tm
;WITH NOCOUNTER

set vitals->person_id = $PERSONID
set vitals->encntr_id = $ENCNTRID

SELECT INTO "NL:"
	ce.event_id
FROM
	clinical_event ce
PLAN ce	
  WHERE ce.person_id = $PERSONID
  AND ce.encntr_id + 0 = $ENCNTRID
  AND ce.event_cd IN (
    TEMPAXIL_72_CV
    ,TEMPPO_72_CV
    ,TEMPREC_72_CV
    ,TEMPTEMPA_72_CV
    ,HRTRTMON_72_CV
    ,APHR_72_CV
    ,PERPHPR_72_CV
    ,BRACH_72_CV
    ,PULSERATE_72_CV
    ,FEM_72_CV
    ,RESPRATE_72_CV
    ,SYSBP_72_CV
    ,DISTBP_72_CV
    ,MEANARTPRESS_72_CV
    ,SYSBPSUP_72_CV
    ,DISTBPSUP_72_CV
    ,DISTBPSIT_72_CV
    ,SYSBPSIT_72_CV
    ,SYSBPSTND_72_CV
    ,DISTBPSTND_72_CV
    ,PULSIT_72_CV
    ,PULSTND_72_CV
    ,PULSUP_72_CV
    ,ICP_72_CV
    ,CPP_72_CV
    ,INTRAABDPRES_72_CV
    ,STIMAPNEA_72_CV
    ,PULOXAP_72_CV
    ,COLORAP_72_CV
    ,ESTWGHTKG_72_CV
    ,BODYMASSINDEXBMI_72_CV
	,HEIGHTINCHES_72_CV
	,WEIGHTACTUALKG_72_CV
 	,SPO2_72_CV
  )
  AND ce.valid_until_dt_tm >= CNVTDATETIME(curdate, curtime3)
  AND ce.event_end_dt_tm < CNVTDATETIME(curdate,curtime3)
  AND ce.record_status_cd = ACTV_48_CV 
  AND ce.result_status_cd +0 IN ( AUTH_8_CV ,MODIFIED_8_CV )
  AND CNVTUPPER(ce.event_title_text) != "DATE\TIME CORRECTION"
  and not exists(select ce1.event_id
  				from clinical_event ce1
  				where ce1.person_id = ce.person_id
  				and ce1.encntr_id +0 = ce.encntr_id
  				and ce1.event_cd = ce.event_cd
  				and ce1.valid_until_dt_tm >= sysdate
  				and ce1.record_status_cd = ACTV_48_CV
  				and ce1.result_status_cd +0 in (AUTH_8_CV, MODIFIED_8_CV)
  				and cnvtupper(ce1.event_title_text) != "DATE\TIME CORRECTION"
  				and ce1.event_end_dt_tm > ce.event_end_dt_tm)
ORDER BY ce.event_cd,ce.event_end_dt_tm ASC
DETAIL
	case (ce.event_cd)
		of TEMPAXIL_72_CV:
			vitals->temp = ce.result_val
			vitals->temp_dt_tm = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;")
	    of TEMPPO_72_CV:
			vitals->temp = ce.result_val
			vitals->temp_dt_tm = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;")
	    of TEMPREC_72_CV:
			vitals->temp = ce.result_val
			vitals->temp_dt_tm = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;")
	    of TEMPTEMPA_72_CV:
			vitals->temp = ce.result_val
			vitals->temp_dt_tm = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;")
	    of HRTRTMON_72_CV:
			vitals->hr = ce.result_val
			vitals->hr_dt_tm = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;")
	    of APHR_72_CV:
			vitals->hr = ce.result_val
			vitals->hr_dt_tm = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;")
	    of PERPHPR_72_CV:
			vitals->hr = ce.result_val
			vitals->hr_dt_tm = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;")
	    of BRACH_72_CV:
			vitals->hr = ce.result_val
			vitals->hr_dt_tm = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;")
		of PULSERATE_72_CV:
			vitals->hr = ce.result_val
			vitals->hr_dt_tm = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;")
;	    of FEM_72_CV:
;			vitals->temp = ce.result_val
;			vitals->temp_dt_tm = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;")
	    of RESPRATE_72_CV:
			vitals->rr = ce.result_val
			vitals->rr_dt_tm = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;")
	    of SYSBP_72_CV:
			vitals->bp_sys = ce.result_val
			vitals->bp_dt_tm = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;")
	    of DISTBP_72_CV:
			vitals->bp_dia = ce.result_val
			vitals->bp_dt_tm = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;")
	    of MEANARTPRESS_72_CV:
			vitals->bp_mean = ce.result_val
			vitals->bp_dt_tm = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;")
	    of SYSBPSUP_72_CV:
			vitals->bp_sys = ce.result_val
			vitals->bp_dt_tm = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;")
	    of DISTBPSUP_72_CV:
			vitals->bp_dia = ce.result_val
			vitals->bp_dt_tm = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;")
	    of DISTBPSIT_72_CV:
			vitals->bp_dia = ce.result_val
			vitals->bp_dt_tm = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;")
	    of SYSBPSIT_72_CV:
			vitals->bp_sys = ce.result_val
			vitals->bp_dt_tm = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;")
	    of SYSBPSTND_72_CV:
			vitals->bp_sys = ce.result_val
			vitals->bp_dt_tm = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;")
	    of DISTBPSTND_72_CV:
			vitals->bp_dia = ce.result_val
			vitals->bp_dt_tm = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;")
	    of PULSIT_72_CV:
			vitals->temp = ce.result_val
			vitals->temp_dt_tm = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;")
	    of PULSTND_72_CV:
			vitals->hr = ce.result_val
			vitals->hr_dt_tm = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;")
	    of PULSUP_72_CV:
			vitals->hr = ce.result_val
			vitals->hr_dt_tm = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;")
;	    of ICP_72_CV:
;			vitals->temp = ce.result_val
;			vitals->temp_dt_tm = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;")
;	    of CPP_72_CV:
;			vitals->temp = ce.result_val
;			vitals->temp_dt_tm = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;")
;	    of INTRAABDPRES_72_CV:
;			vitals->temp = ce.result_val
;			vitals->temp_dt_tm = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;")
;	    of STIMAPNEA_72_CV:
;			vitals->temp = ce.result_val
;			vitals->temp_dt_tm = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;")
;	    of PULOXAP_72_CV:
;			vitals->temp = ce.result_val
;			vitals->temp_dt_tm = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;")
;	    of COLORAP_72_CV:
;			vitals->temp = ce.result_val
;			vitals->temp_dt_tm = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;")
	    of ESTWGHTKG_72_CV:
			vitals->wt = ce.result_val
			vitals->wt_dt_tm = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;")
		of BODYMASSINDEXBMI_72_CV:
			vitals->bmi = ce.result_val
			vitals->bmi_dt_tm = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;")
		of HEIGHTINCHES_72_CV:
			vitals->ht = ce.result_val
			vitals->ht_dt_tm = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;")
		of WEIGHTACTUALKG_72_CV:
			vitals->wt = ce.result_val
			vitals->wt_dt_tm = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;")
		of SPO2_72_CV:
			vitals->spo2 = ce.result_val
			vitals->spo2_dt_tm = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;")
	endcase
WITH NOCOUNTER

SELECT INTO "NL:"
	sort_id = (if (ce.event_cd = ESTWGHTKG_72_CV) "01" else "02" endif)
FROM
	clinical_event ce
PLAN ce	
  WHERE ce.person_id = $PERSONID
  AND ce.encntr_id + 0 = $ENCNTRID
  AND ce.event_cd IN (ESTWGHTKG_72_CV,WEIGHTACTUALKG_72_CV)
  AND ce.valid_until_dt_tm >= CNVTDATETIME(curdate, curtime3)
  AND ce.event_end_dt_tm < CNVTDATETIME(curdate,curtime3)
  AND ce.record_status_cd = ACTV_48_CV 
  AND ce.result_status_cd +0 IN ( AUTH_8_CV ,MODIFIED_8_CV )
  AND CNVTUPPER(ce.event_title_text) != "DATE\TIME CORRECTION"
  and not exists(select ce1.event_id
  				from clinical_event ce1
  				where ce1.person_id = ce.person_id
  				and ce1.encntr_id +0 = ce.encntr_id
  				and ce1.event_cd = ce.event_cd
  				and ce1.valid_until_dt_tm >= sysdate
  				and ce1.record_status_cd = ACTV_48_CV
  				and ce1.result_status_cd +0 in (AUTH_8_CV, MODIFIED_8_CV)
  				and cnvtupper(ce1.event_title_text) != "DATE\TIME CORRECTION"
  				and ce1.event_end_dt_tm > ce.event_end_dt_tm)
ORDER BY sort_id
DETAIL
	vitals->wt = ce.result_val
	vitals->wt_dt_tm = format(ce.event_end_dt_tm, "mm/dd/yyyy hh:mm;;")
	if (ce.event_cd = ESTWGHTKG_72_CV)
		vitals->wt_estimated = 1
	else
		vitals->wt_estimated = 0
	endif
WITH NOCOUNTER

call echojson(vitals, $OUTDEV)
end
go
