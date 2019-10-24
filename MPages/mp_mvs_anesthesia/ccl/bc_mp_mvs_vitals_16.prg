drop program bc_mp_mvs_vitals_16:dba go
create program bc_mp_mvs_vitals_16:dba
/**************************************************************************************************
              Purpose: Displays the Vital's Convert ED GenView to MPage 
     Source File Name: bc_mp_mvs_vitals_16.PRG
              Analyst: MediView Solutions
          Application: FirstNet
  Execution Locations: FirstNet
            Request #: 
      Translated From: 
        Special Notes:
**************************************************************************************************/
/**************************************************************************************************
  Mod  Date            Engineer                Description
   ---  --------------- ----------------------- ------------------------------------------------
    1   06/09/2011      MediView Solutions 	    Initial Release
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

RECORD VITALS (
 
	 1 pt_dob_dt_tm			= VC		; dq8
	 
	 ;temperature section
	 1 temp1_PO_F 			= vc
	 1 temp1_PO_dt_tm 		= VC	;dq8
	 1 temp2_PO_F 			= vc
	 1 temp2_PO_dt_tm 		= VC	;dq8
	 1 temp1_AX_F 			= vc
	 1 temp1_AX_dt_tm 		= VC	;dq8
	 1 temp2_AX_F 			= vc
	 1 temp2_AX_dt_tm 		= VC	;dq8
	 1 temp1_RC_F 			= vc
	 1 temp1_RC_dt_tm 		= VC	;dq8
	 1 temp2_RC_F 			= vc
	 1 temp2_RC_dt_tm 		= VC	;dq8
	 1 temp1_TO_F 			= vc
	 1 temp1_TO_dt_tm 		= VC	;dq8
	 1 temp2_TO_F 			= vc
	 1 temp2_TO_dt_tm 		= VC	;dq8
	 
	 ;----->heart rate measurement section
	 1 hr1_mon				= vc
	 1 hr1_mon_dt_tm		= VC	;dq8
	 1 hr2_mon				= vc
	 1 hr2_mon_dt_tm		= VC	;dq8
	 1 ap_hr1				= vc
	 1 ap_hr1_dt_tm			= VC	;dq8
	 1 ap_hr2				= vc
	 1 ap_hr2_dt_tm			= VC	;dq8
	 1 ppr1 				= vc
	 1 ppr1_dt_tm 			= VC	;dq8
	 1 ppr2 				= vc
	 1 ppr2_dt_tm 			= VC	;dq8
	 
	 1 brach1 				= vc
	 1 brach1_dt_tm 		= VC	;dq8
	 1 brach2 				= vc
	 1 brach2_dt_tm 		= VC	;dq8
	 1 fempr1 				= vc
	 1 fempr1_dt_tm 		= VC	;dq8
	 1 fempr2 				= vc
	 1 fempr2_dt_tm 		= VC	;dq8
	 1 resprt1 				= vc
	 1 resprt1_dt_tm 		= VC	;dq8
	 1 resprt2 				= vc
	 1 resprt2_dt_tm 		= VC	;dq8
	 
	 ;----->blood pressure section
	 1 sysbp1				= vc
	 1 sysbp1_dt_tm			= VC	;dq8
	 1 sysbp2				= vc
	 1 sysbp2_dt_tm 		= VC	;dq8
	 1 diabp1 				= vc
	 1 diabp1_dt_tm 		= VC	;dq8
	 1 diabp2 				= vc
	 1 diabp2_dt_tm 		= VC	;dq8
	 1 map1 				= vc
	 1 map1_dt_tm 			= VC	;dq8
	 1 map2 				= vc
	 1 map2_dt_tm 			= VC	;dq8
	 1 bpsit1				= vc
	 1 bpsit1_dt_tm			= VC	;dq8
	 1 bpsit2				= vc
	 1 bpsit2_dt_tm			= VC	;dq8
	 1 sbpsit1				= vc
	 1 sbpsit1_dt_tm		= VC	;dq8
	 
	 1 sbpsit2				= vc
	 1 sbpsit2_dt_tm		= VC	;dq8
	 1 sbpstng1				= vc
	 1 sbpstng1_dt_tm		= VC	;dq8
	 1 sbpstng2				= vc
	 1 sbpstng2_dt_tm		= VC	;dq8
	 1 sbpsup1				= vc
	 1 sbpsup1_dt_tm		= VC	
	 1 sbpsup2				= vc
	 1 sbpsup2_dt_tm		= VC   ;dq8   
	 1 dbpsit1				= vc
	 1 dbpsit1_dt_tm		= VC	;dq8
	 1 dbpsit2				= vc
	 1 dbpsit2_dt_tm		= VC  	;dq8
	 1 dbpstng1				= vc
	 1 dbpstng1_dt_tm		= VC	;dq8
	 1 dbpstng2				= vc
	 1 dbpstng2_dt_tm		= VC	;dq8
	 1 dbpsup1				= vc
	 1 dbpsup1_dt_tm		= VC	;dq8
	 1 dbpsup2				= vc
	 1 dbpsup2_dt_tm		= VC	;dq8
	 
	 ;----->pulse
	 1 pulsit1	 			= vc
	 1 pulsit1_dt_tm 		= VC	;dq8
	 1 pulsit2 				= vc
	 1 pulsit2_dt_tm 		= VC	;dq8
	 1 pulstng1 			= vc
	 1 pulstng1_dt_tm 		= VC	;dq8
	 1 pulstng2 			= vc
	 1 pulstng2_dt_tm 		= VC	;dq8
	 1 pulsup1 				= vc
	 1 pulsup1_dt_tm 		= VC	;dq8
	 1 pulsup2 				= vc
	 1 pulsup2_dt_tm 		= VC	;dq8
	 1 icp1 				= vc
	 1 icp1_dt_tm 			= VC	;dq8
	 1 icp2 				= vc
	 1 icp2_dt_tm 			= VC	;dq8
	 1 ccp1 				= vc
	 1 ccp1_dt_tm 			= VC	;dq8
	 1 ccp2 				= vc
	 1 ccp2_dt_tm 			= VC	;dq8
	 1 iap1 				= vc
	 1 iap1_dt_tm 			= VC	;dq8
	 1 iap2 				= vc
	 1 iap2_dt_tm 			= vc	;dq8
	 1 pain1 				= vc
	 1 pain1_Scale 			= vc
	 1 pain1_dt_tm 			= VC	;dq8
	 1 pain2 				= vc
	 1 pain2_Scale		 	= vc
	 1 pain2_dt_tm 			= VC	; dq8
	 1 dly_wgt1				= vc
	 1 dly_wgt1_dt_tm		= VC	; dq8
	 1 dly_wgt2				= vc
	 1 dly_wgt2_dt_tm		= vc	; dq8
	 1 est_wght1			= vc
	 1 est_wght1_dt_tm		= VC	; dq8
	 1 est_wght2			= vc
	 1 est_wght2_dt_tm		= VC	; dq8
	 1 stated_wght1			= vc
	; 1 stated_wght1_dt_tm	= dq8 	; Not used in prg 
	 1 stated_wght2			= vc
	; 1 stated_wght2_dt_tm	= dq8 	; Not used in prg 
	 1 birth_lngth1			= vc
	 1 birth_lngth1_dt_tm	= VC	; dq8
	 
	 
	 ;----->assessment detail
	  1 lvlcon 				=  vc
	  1 lvlcon_dt_tm 		=  VC	; dq8
	  1 respirats 			=  vc
	 ; 1 respirats_dt_tm 	=  dq8 ; not used in prg 
	  1 cardrythm 			=  vc
	 ; 1 cardrythm_dt_tm 	=  dq8 ; not used in prg 
	  1 murmauscul 			=  vc
	  ;1 murmauscul_dt_tm 	=  dq8 ; not used in prg 
	  1 chestphysio			=  vc
	  ;1 chestphysio_dt_tm 	=  dq8 ; not used in prg 
	  1 creploc 			=  vc
	  ;1 creploc_dt_tm 		=  dq8 ; not used in prg 
	  1 alllobbrth 			=  vc
	  ;1 alllobbrth_dt_tm 	=  dq8 ; not used in prg
	  1 comascre 			=  vc
	 ; 1 comascre_dt_tm 	=  dq8 ; not used in prg 
	  1 glascomascre 		=  vc
	  ;1 glascomascre_dt_tm =  dq8 ; not used in prg 
	  1 pedcomascre 		=  vc
	 ; 1 pedcomascre_dt_tm 	=  dq8 ; not used in prg 
	  1 cumwght_baseline	=  f8
	  1 cumwght_event_id	=  f8
	  1 basewght_dt_tm		=  vc	;dq8
	  1 cum_cnt				=  i4
	  1 CUMWGHT[*]
	    2 event_id			=  f8
	    2 meas_weight		=  vc
	    2 meas_weight_dt_tm	=  VC	; dq8
	    2 weight_diff		=  vc
	    2 rank				=  i2
	
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

SET vit_cnt	= 0 	; used to indicate if VITALS has any data
SET o2_cnt 	= 0 	; used to indicate if o2 therapy has any data
SET ast_cnt = 0 	; used to indicate if assessment section has any data
SET total12 = 0.00
SET total24 = 0.00
SET r_out 	= 0 	; used to show there are output values to further evaluate in total calculations

SELECT INTO "NL:"
	pt_dob_dt_tm = 	FORMAT (CNVTDATETIME( p.birth_dt_tm ) ,"MM/DD/YYYY  ;;D")
FROM person p
PLAN p 
	WHERE p.person_id = $PERSONID
 	AND p.active_ind = 1
DETAIL
	VITALS->pt_dob_dt_tm = pt_dob_dt_tm			; p.birth_dt_tm
WITH NOCOUNTER

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
    ,BRTHLEN_72_CV
	;----->Assessment Section
	,lvlcon_72_CV
	,respirats_72_CV
	,cardrythm_72_CV
	,murmauscul_72_CV
	,chestphysio_72_CV
 
  )
  AND ce.valid_until_dt_tm >= CNVTDATETIME(curdate, curtime3)
  AND ce.event_end_dt_tm < CNVTDATETIME(curdate,curtime3)
  AND ce.record_status_cd = ACTV_48_CV 
  AND ce.result_status_cd +0 IN ( AUTH_8_CV ,MODIFIED_8_CV )
  AND CNVTUPPER(ce.event_title_text) != "DATE\TIME CORRECTION"
 
ORDER BY ce.event_cd,ce.event_end_dt_tm DESC
 
HEAD REPORT
	get_temp_po 	= 0
	get_temp_ax 	= 0
	get_temp_rc 	= 0
	get_temp_to 	= 0
	get_hrtrtmon 	= 0
	get_aphr 		= 0
	get_ppr 		= 0
	get_brach 		= 0
	get_fem 		= 0
	get_resprt 		= 0
	get_sysbp 		= 0
	get_dbp 		= 0
	get_map 		= 0
	get_sbpsit 		= 0
	get_sbpstnd 	= 0
	get_sbpsup 		= 0
	get_dbpsit 		= 0
	get_dbpstnd 	= 0
	get_dbpsup 		= 0
	get_pulsit 		= 0
	get_pulstnd 	= 0
	get_pulsup 		= 0
	get_icp 		= 0
	get_ccp 		= 0
	get_iapres 		= 0
	get_hrapn 		= 0
	get_stimapn 	= 0
	get_ploxap 		= 0
	get_colap 		= 0
	;get_wgtkg 		= 0
	get_estwght		= 0
	get_statewght   = 0
	get_brthlen		= 0
 
	; Assessment Section
	get_lvlcon 			= 0
	get_respirats 		= 0
	get_cardrythm 		= 0
	get_murmauscul 		= 0
	get_chestphysio		= 0
	get_creploc 		= 0
 
HEAD ce.event_cd
ROW + 0
 
HEAD ce.event_end_dt_tm
ROW + 0
 
DETAIL
 
	; Determine the last two charted values for the designated dta's
IF((ce.event_cd = TEMPPO_72_CV) AND (get_temp_po < 2))
 IF(get_temp_po = 0)
  VITALS->temp1_PO_F = CONCAT(TRIM(ce.EVENT_TAG)," ",TRIM(uar_get_code_display(ce.result_units_cd)))
  VITALS->temp1_PO_dt_tm = 	FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ; ce.event_end_dt_tm
  get_temp_po = 1
  vit_cnt = 1
 ELSEIF(get_temp_po = 1)
  VITALS->temp2_PO_F = CONCAT(TRIM(ce.EVENT_TAG)," ",TRIM(uar_get_code_display(ce.result_units_cd)))
  VITALS->temp2_PO_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ;ce.event_end_dt_tm
  get_temp_po = 2
 ENDIF
ELSEIF((ce.event_cd = TEMPAXIL_72_CV) AND (get_temp_ax < 2))
 IF(get_temp_ax = 0)
  VITALS->temp1_AX_F = CONCAT(TRIM(ce.EVENT_TAG)," ",TRIM(uar_get_code_display(ce.result_units_cd)))
  VITALS->temp1_AX_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ;ce.event_end_dt_tm
  get_temp_ax = 1
  vit_cnt = 1
 ELSEIF(get_temp_ax = 1)
  VITALS->temp2_AX_F = CONCAT(TRIM(ce.EVENT_TAG)," ",TRIM(uar_get_code_display(ce.result_units_cd)))
  VITALS->temp2_AX_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ;ce.event_end_dt_tm
  get_temp_ax = 2
 ENDIF
ELSEIF((ce.event_cd = TEMPREC_72_CV) AND (get_temp_rc < 2))
 IF(get_temp_rc = 0)
  VITALS->temp1_RC_F = CONCAT(TRIM (ce.EVENT_TAG)," ",TRIM(uar_get_code_display(ce.result_units_cd)))
  VITALS->temp1_RC_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ;ce.event_end_dt_tm
  get_temp_rc = 1
  vit_cnt = 1
 ELSEIF(get_temp_rc = 1)
  VITALS->temp2_RC_F = CONCAT(TRIM (ce.EVENT_TAG)," ",TRIM(uar_get_code_display(ce.result_units_cd)))
  VITALS->temp2_RC_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ;ce.event_end_dt_tm
  get_temp_rc = 2
 ENDIF
ELSEIF((ce.event_cd = TEMPTEMPA_72_CV) AND (get_temp_to < 2))
 IF(get_temp_to = 0)
  VITALS->temp1_TO_F = CONCAT(TRIM (ce.EVENT_TAG)," ",TRIM(uar_get_code_display(ce.result_units_cd)))
  VITALS->temp1_TO_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ;ce.event_end_dt_tm
  get_temp_to = 1
  vit_cnt = 1
 ELSEIF(get_temp_to = 1)
  VITALS->temp2_TO_F = CONCAT(TRIM (ce.EVENT_TAG)," ",TRIM(uar_get_code_display(ce.result_units_cd)))
  VITALS->temp2_TO_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ;ce.event_end_dt_tm
  get_temp_to = 2
 ENDIF
ELSEIF((ce.event_cd = HRTRTMON_72_CV) AND (get_hrtrtmon < 2))
 IF(get_hrtrtmon = 0)
  VITALS->hr1_mon = CONCAT(TRIM(ce.EVENT_TAG)," ",TRIM(uar_get_code_display(ce.result_units_cd)))
  VITALS->hr1_mon_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ;ce.event_end_dt_tm
  get_hrtrtmon = 1
  vit_cnt = 1
 ELSEIF(get_hrtrtmon = 1)
  VITALS->hr2_mon = CONCAT(TRIM(ce.EVENT_TAG)," ",TRIM(uar_get_code_display(ce.result_units_cd)))
  VITALS->hr2_mon_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ;ce.event_end_dt_tm
  get_hrtrtmon = 2
 ENDIF
ELSEIF((ce.event_cd = APHR_72_CV ) AND (get_aphr < 2))
 IF(get_aphr = 0)
  VITALS->ap_hr1 = CONCAT(TRIM(ce.EVENT_TAG)," ",TRIM(uar_get_code_display(ce.result_units_cd)))
  VITALS->ap_hr1_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ;ce.event_end_dt_tm
  get_aphr = 1
  vit_cnt = 1
 ELSEIF(get_aphr = 1)
  VITALS->ap_hr2 = CONCAT(TRIM(ce.EVENT_TAG)," ",TRIM(uar_get_code_display(ce.result_units_cd)))
  VITALS->ap_hr2_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ;ce.event_end_dt_tm
  get_aphr = 2
 ENDIF
ELSEIF((ce.event_cd = PERPHPR_72_CV) AND (get_ppr < 2))
 IF(get_ppr = 0)
  VITALS->ppr1 = CONCAT(TRIM(ce.EVENT_TAG)," ",TRIM(uar_get_code_display(ce.result_units_cd)))
  VITALS->ppr1_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ;ce.event_end_dt_tm
  get_ppr = 1
  vit_cnt = 1
 ELSEIF(get_ppr = 1)
  VITALS->ppr2 = CONCAT(TRIM(ce.EVENT_TAG)," ",TRIM(uar_get_code_display(ce.result_units_cd)))
  VITALS->ppr2_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ;ce.event_end_dt_tm
  get_ppr = 2
 ENDIF
ELSEIF((ce.event_cd = BRACH_72_CV) AND (get_brach < 2))
 IF(get_brach = 0)
  VITALS->brach1 = CONCAT(TRIM(ce.EVENT_TAG)," ",TRIM(uar_get_code_display(ce.result_units_cd)))
  VITALS->brach1_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ;ce.event_end_dt_tm
  get_brach = 1
  vit_cnt = 1
 ELSEIF(get_brach = 1)
  VITALS->brach2 = CONCAT(TRIM(ce.EVENT_TAG)," ",TRIM(uar_get_code_display(ce.result_units_cd)))
  VITALS->brach2_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ;ce.event_end_dt_tm
  get_brach = 2
 ENDIF
ELSEIF((ce.event_cd = FEM_72_CV) AND (get_fem < 2))
 IF(get_fem = 0)
  VITALS->fempr1 = CONCAT(TRIM(ce.EVENT_TAG)," ",TRIM(uar_get_code_display(ce.result_units_cd)))
  VITALS->fempr1_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ;ce.event_end_dt_tm
  get_fem = 1
  vit_cnt = 1
 ELSEIF(get_fem = 1)
  VITALS->fempr2 = CONCAT(TRIM(ce.EVENT_TAG)," ",TRIM(uar_get_code_display(ce.result_units_cd)))
  VITALS->fempr2_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ;ce.event_end_dt_tm
  get_fem = 2
 ENDIF
ELSEIF((ce.event_cd = RESPRATE_72_CV) AND (get_resprt < 2))
 IF(get_resprt = 0)
  VITALS->resprt1 = CONCAT(TRIM(ce.EVENT_TAG)," ",TRIM(uar_get_code_display(ce.result_units_cd)))
  VITALS->resprt1_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ;ce.event_end_dt_tm
  get_resprt = 1
  vit_cnt = 1
 ELSEIF(get_resprt = 1)
  VITALS->resprt2 = CONCAT(TRIM(ce.EVENT_TAG)," ",TRIM(uar_get_code_display(ce.result_units_cd)))
  VITALS->resprt2_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ;ce.event_end_dt_tm
  get_resprt = 2
 ENDIF
ELSEIF((ce.event_cd = SYSBP_72_CV) AND (get_sysbp < 2))
 IF(get_sysbp = 0)
  VITALS->sysbp1 = TRIM(ce.EVENT_TAG)
  VITALS->sysbp1_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ;ce.event_end_dt_tm
  get_sysbp = 1
  vit_cnt = 1
 ELSEIF(get_sysbp = 1)
  VITALS->sysbp2 = TRIM(ce.EVENT_TAG)
  VITALS->sysbp2_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ;ce.event_end_dt_tm
  get_sysbp = 2
 ENDIF
ELSEIF((ce.event_cd = DISTBP_72_CV ) AND (get_dbp < 2))
 IF(get_dbp = 0)
  VITALS->diabp1 = TRIM(ce.EVENT_TAG)
  VITALS->diabp1_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ;ce.event_end_dt_tm
  get_dbp = 1
  vit_cnt = 1
 ELSEIF(get_dbp = 1)
  VITALS->diabp2 = TRIM(ce.EVENT_TAG)
  VITALS->diabp2_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ;ce.event_end_dt_tm
  get_dbp = 2
 ENDIF
ELSEIF((ce.event_cd = MEANARTPRESS_72_CV) AND (get_map < 2))
 IF(get_map = 0)
  VITALS->map1 = TRIM(ce.EVENT_TAG)
  VITALS->map1_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ;ce.event_end_dt_tm
  get_map = 1
  vit_cnt = 1
 ELSEIF(get_map = 1)
  VITALS->map2 = TRIM(ce.EVENT_TAG)
  VITALS->map2_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ;ce.event_end_dt_tm
  get_map = 2
 ENDIF
ELSEIF((ce.event_cd = SYSBPSUP_72_CV) AND (get_sbpsup < 2))
 IF(get_sbpsup = 0)
  VITALS->sbpsup1 = TRIM(ce.EVENT_TAG)
  VITALS->sbpsup1_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ; ce.event_end_dt_tm
  get_sbpsup = 1
  vit_cnt = 1
 ELSEIF(get_sbpsup = 1)
  VITALS->sbpsup2 = TRIM(ce.EVENT_TAG)
  VITALS->sbpsup2_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ;ce.event_end_dt_tm
  get_sbpsup = 2
 ENDIF
ELSEIF((ce.event_cd = DISTBPSUP_72_CV) AND (get_dbpsup < 2))
 IF(get_dbpsup = 0)
  VITALS->dbpsup1 = TRIM(ce.EVENT_TAG)
  VITALS->dbpsup1_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ;ce.event_end_dt_tm
  get_dbpsup = 1
  vit_cnt = 1
 ELSEIF(get_dbpsup = 1)
  VITALS->dbpsup2 = TRIM(ce.EVENT_TAG)
  VITALS->dbpsup2_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ;ce.event_end_dt_tm
  get_dbpsup = 2
 ENDIF
ELSEIF((ce.event_cd = DISTBPSIT_72_CV) AND (get_dbpsit < 2))
 IF(get_dbpsit = 0)
  VITALS->dbpsit1 = TRIM(ce.EVENT_TAG)
  VITALS->dbpsit1_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ;ce.event_end_dt_tm
  get_dbpsit = 1
  vit_cnt = 1
 ELSEIF(get_dbpsit = 1)
  VITALS->dbpsit2 = TRIM(ce.EVENT_TAG)
  VITALS->dbpsit2_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ;ce.event_end_dt_tm
  get_dbpsit = 2
 ENDIF
ELSEIF((ce.event_cd = SYSBPSIT_72_CV) AND (get_sbpsit < 2))
 IF(get_sbpsit = 0)
  VITALS->sbpsit1 = TRIM(ce.EVENT_TAG)
  VITALS->sbpsit1_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ; ce.event_end_dt_tm
  get_sbpsit = 1
  vit_cnt = 1
 ELSEIF(get_sbpsit = 1)
  VITALS->sbpsit2 = TRIM(ce.EVENT_TAG)
  VITALS->sbpsit2_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D")  ; ce.event_end_dt_tm
  get_sbpsit = 2
 ENDIF
ELSEIF((ce.event_cd = SYSBPSTND_72_CV) AND (get_sbpstnd < 2))
 IF(get_sbpstnd = 0)
  VITALS->sbpstng1 = TRIM(ce.EVENT_TAG)
  VITALS->sbpstng1_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ; ce.event_end_dt_tm
  get_sbpstnd = 1
  vit_cnt = 1
 ELSEIF(get_sbpstnd = 1)
  VITALS->sbpstng2 = TRIM(ce.EVENT_TAG)
  VITALS->sbpstng2_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ; ce.event_end_dt_tm
  get_sbpstnd = 2
 ENDIF
ELSEIF((ce.event_cd = DISTBPSTND_72_CV) AND (get_dbpstnd < 2))
 IF(get_dbpstnd = 0)
  VITALS->dbpstng1 = TRIM(ce.EVENT_TAG)
  VITALS->dbpstng1_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D")  ; ce.event_end_dt_tm
  get_dbpstnd = 1
  vit_cnt = 1
 ELSEIF(get_dbpstnd = 1)
  VITALS->dbpstng2 = TRIM(ce.EVENT_TAG)
  VITALS->dbpstng2_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D")  ;ce.event_end_dt_tm
  get_dbpstnd = 2
 ENDIF
ELSEIF((ce.event_cd = PULSIT_72_CV) AND (get_pulsit < 2))
 IF(get_pulsit = 0)
  VITALS->pulsit1 = CONCAT(TRIM(ce.EVENT_TAG)," ",TRIM(uar_get_code_display(ce.result_units_cd)))
  VITALS->pulsit1_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D")  ;ce.event_end_dt_tm
  get_pulsit = 1
  vit_cnt = 1
 ELSEIF(get_pulsit = 1)
  VITALS->pulsit2 = CONCAT(TRIM(ce.EVENT_TAG)," ",TRIM(uar_get_code_display(ce.result_units_cd)))
  VITALS->pulsit2_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ;ce.event_end_dt_tm
  get_pulsit = 2
 ENDIF
ELSEIF((ce.event_cd = PULSTND_72_CV) AND (get_pulstnd < 2))
 IF(get_pulstnd = 0)
  VITALS->pulstng1 = CONCAT(TRIM(ce.EVENT_TAG)," ",TRIM(uar_get_code_display(ce.result_units_cd)))
  VITALS->pulstng1_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ;ce.event_end_dt_tm
  get_pulstnd = 1
  vit_cnt = 1
 ELSEIF(get_pulstnd = 1)
  VITALS->pulstng2 = CONCAT(TRIM(ce.EVENT_TAG)," ",TRIM(uar_get_code_display(ce.result_units_cd)))
  VITALS->pulstng2_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ;ce.event_end_dt_tm
  get_pulstnd = 2
 ENDIF
ELSEIF((ce.event_cd = PULSUP_72_CV) AND (get_pulsup < 2))
 IF(get_pulsup = 0)
  VITALS->pulsup1 = CONCAT(TRIM(ce.EVENT_TAG)," ",TRIM(uar_get_code_display(ce.result_units_cd)))
  VITALS->pulsup1_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ;ce.event_end_dt_tm
  get_pulsup = 1
  vit_cnt = 1
 ELSEIF(get_pulsup = 1)
  VITALS->pulsup2 = CONCAT(TRIM(ce.EVENT_TAG)," ",TRIM(uar_get_code_display(ce.result_units_cd)))
  VITALS->pulsup2_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D")  ; ce.event_end_dt_tm
  get_pulsup = 2
 ENDIF
ELSEIF((ce.event_cd = ICP_72_CV) AND (get_icp < 2))
 IF(get_icp = 0)
  VITALS->icp1 = CONCAT(TRIM(ce.EVENT_TAG)," ",TRIM(uar_get_code_display(ce.result_units_cd)))
  VITALS->icp1_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D")  ;ce.event_end_dt_tm
  get_icp = 1
  vit_cnt = 1
 ELSEIF(get_icp = 1)
  VITALS->icp2 = CONCAT(TRIM(ce.EVENT_TAG)," ",TRIM(uar_get_code_display(ce.result_units_cd)))
  VITALS->icp2_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D")  ;ce.event_end_dt_tm
  get_icp = 2
 ENDIF
ELSEIF((ce.event_cd = CPP_72_CV) AND (get_ccp < 2))
 IF(get_ccp = 0)
  VITALS->ccp1 = CONCAT(TRIM(ce.EVENT_TAG)," ",TRIM(uar_get_code_display(ce.result_units_cd)))
  VITALS->ccp1_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D")  ; ce.event_end_dt_tm
  get_ccp = 1
  vit_cnt = 1
 ELSEIF(get_ccp = 1)
  VITALS->ccp2 = CONCAT(TRIM(ce.EVENT_TAG)," ",TRIM(uar_get_code_display(ce.result_units_cd)))
  VITALS->ccp2_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D")  ;ce.event_end_dt_tm
  get_ccp = 2
 ENDIF
ELSEIF((ce.event_cd = INTRAABDPRES_72_CV) AND (get_iapres < 2))
 IF(get_iapres = 0)
  VITALS->iap1 = CONCAT(TRIM(ce.EVENT_TAG)," ",TRIM(uar_get_code_display(ce.result_units_cd)))
  VITALS->iap1_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D")  ;ce.event_end_dt_tm
  get_iapres = 1
  vit_cnt = 1
 ELSEIF(get_iapres = 1)
  VITALS->iap2 = CONCAT(TRIM(ce.EVENT_TAG)," ",TRIM(uar_get_code_display(ce.result_units_cd)))
  VITALS->iap2_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D")  ; ce.event_end_dt_tm
  get_iapres = 2
 ENDIF
 ;updated estimated weight in kg to use new code value
ELSEIF((ce.event_cd = ESTWGHTKG_72_CV ) AND (get_estwght < 2))
 IF(get_estwght = 0)
  VITALS->est_wght1 = concat(TRIM(ce.EVENT_TAG)," ", "kg")
  ;TRIM(uar_get_code_display(ce.result_units_cd)))
  VITALS->est_wght1_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D")  ; ce.event_end_dt_tm
  get_estwght = 1
  vit_cnt = 1
 ELSEIF(get_estwght = 1)
  VITALS->est_wght2 = concat(TRIM(ce.EVENT_TAG)," ","kg")
  VITALS->est_wght2_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D")  ; ce.event_end_dt_tm
  get_estwght = 2
 ENDIF

ELSEIF((ce.event_cd = BRTHLEN_72_CV) AND (get_brthlen = 0))
  VITALS->birth_lngth1 = CONCAT(TRIM(ce.EVENT_TAG)," ",TRIM(uar_get_code_display(ce.result_units_cd)))
  VITALS->birth_lngth1_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ; ce.event_end_dt_tm
  get_brthlen = 1
  vit_cnt = 1
ELSEIF((ce.event_cd = lvlcon_72_CV) AND (get_lvlcon = 0))
  VITALS->lvlcon = CONCAT(TRIM(ce.EVENT_TAG)," ",TRIM(uar_get_code_display(ce.result_units_cd)))
  VITALS->lvlcon_dt_tm = FORMAT (CNVTDATETIME( ce.event_end_dt_tm ) ,"MM/DD/YYYY HH:MM;;D") ; ce.event_end_dt_tm
  get_lvlcon = 1
  ast_cnt = 1  		; indicate assemssment section has data
 
ENDIF
 
WITH NOCOUNTER

call echojson(vitals, $OUTDEV)
end
go
