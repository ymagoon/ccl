drop program m013021_dvd3 go
create program m013021_dvd3
 
 
 
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Person Id:" = 0
	, "Encounter Id:" = 0
 
with outdev, personid, encntrid
 
free record JSON
record JSON(
  1 data = vc
)
 
 
 
;HbA1c /* from HgbA1c  */
declare hgba1c1_cd = f8 with public,constant(uar_get_code_by("DISPLAY",72,"Hgb A1c POC."))
declare hgba1c2_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"HGBA1C"))
declare hgba1c3_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"HGBA1CMAYO"))
declare hgba1c4_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"OUTSIDELABHGBA1C"))
declare hgba1c5_cd = f8 with public,constant(uar_get_code_by("DISPLAY",72,"Hgb A1C POC"))
 
;BP /* From ATG Specs */
declare sbp_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"SYSTOLICBLOODPRESSURE"))
declare dbp_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"DIASTOLICBLOODPRESSURE"))
 
;LDL /* From ATG Specs and Diabates Lab File - removed Cancel permanantly */
declare ldl1_cd = f8 with public,constant(uar_get_code_by("DISPLAY",72,"LDL"))
declare ldl2_cd = f8 with public,constant(uar_get_code_by("DISPLAY",72,"LDL Cholestrol-Mayo"))
declare ldl3_cd = f8 with public,constant(uar_get_code_by("DISPLAY",72,"LDL Tri-Mayo"))
declare ldl4_cd = f8 with public,constant(uar_get_code_by("DISPLAY",72,"LDL-Mayo"))
declare ldl5_cd = f8 with public,constant(uar_get_code_by("DISPLAY",72,"Calc LDL-Mayo"))
declare ldl6_cd = f8 with public,constant(uar_get_code_by("DISPLAY",72,"LDL Chol"))
declare ldl7_cd = f8 with public,constant(uar_get_code_by("DISPLAY",72,"Ldl Chol"))
declare ldl8_cd = f8 with public,constant(uar_get_code_by("DISPLAY",72,"LDL Triglycerides"))
declare ldl9_cd = f8 with public,constant(uar_get_code_by("DISPLAY",72,"LDL Calculated"))
declare ldl10_cd = f8 with public,constant(uar_get_code_by("DISPLAY",72,"LDL Direct"))
declare ldl11_cd = f8 with public,constant(uar_get_code_by("DISPLAY",72,"Calculated LDL-Mayo"))
declare ldl12_cd = f8 with public,constant(uar_get_code_by("DISPLAY",72,"Outside Lab Low Density Lipids"))
declare ldl13_cd = f8 with public,constant(uar_get_code_by("DISPLAY",72,"Small LDL-P Conc-Mayo"))
declare ldl14_cd = f8 with public,constant(uar_get_code_by("DISPLAY",72,"NMR Lipo-P Intrp-Mayo"))
 
;HDL /* From Diabates Lab File and general lookup of HDL% */
declare hdl1_cd = f8 with public,constant(uar_get_code_by("DISPLAY",72,"HDL CHOLESTEROL"))
declare hdl2_cd = f8 with public,constant(uar_get_code_by("DISPLAY",72,"Hdl Cholestrol"))
declare hdl3_cd = f8 with public,constant(uar_get_code_by("DISPLAY",72,"HDL-Cholesterol"))
declare hdl4_cd = f8 with public,constant(uar_get_code_by("DISPLAY",72,"HDL-Mayo"))
declare hdl5_cd = f8 with public,constant(uar_get_code_by("DISPLAY",72,"HDL"))
declare hdl6_cd = f8 with public,constant(uar_get_code_by("DISPLAY",72,"HDL Chol CDC-Mayo"))
 
; Triglycerides /* From Diabetes Lab File and general lookup of Trig% */
declare tr1_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"TRIG"))
declare tr2_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"TRIGLYC"))
declare tr3_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"TRIGCDCMAYO"))
declare tr4_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"TRIGLYCERIDESMAYO"))
declare tr5_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"TRIGLYCDCMAYO"))
 
 
;Tobacco Use /* From ATG Specs and Clinical Services File */
declare tob1_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"TOBACCOUSE"))
declare tob2_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"TOBACCOUSECURRENTLYUSING"))
 
;Influenza /* From ATG Specs and Clinical Services File */
declare flu1_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"INFLUENZAVIRUSVACCINEINACTIVATED"))
declare flu2_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"INFLUENZAVIRUSVACCINELIVETRIVALENT"))
declare flu3_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"INFLUENZAVIRUSVACCINE"))
declare flu4_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"FLUVACCINEDATE"))
declare flu5_cd = f8 with public,constant(uar_get_code_by("DISPLAY",72,"Cancel Permanently Flu Vaccine"))
 
 
; Pneumovax /* From ATG Specs and Clinical Services File */
declare pn1_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"PNEUMOCOCCALVACCINE"))
declare pn2_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"PNEUMOCOCCAL23VALENTVACCINE"))
declare pn3_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"PNEUMONIAVACCINEDATE"))
declare pn4_cd = f8 with public,constant(uar_get_code_by("DISPLAY",72,"Cancel Permanent Pneumococcal Vaccine"))
declare pn5_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"PNEUMOCOCCAL7VALENTVACCINE"))
declare pn6_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"PNEUMOCOCCAL13VALENTVACCINE"))
 
 
; Total Cholesterol/* From ATG Specs and Clinical Services File */
 
declare tt1_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"TTLCHOLESTEROL"))
declare tt2_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"CHOLESTEROLTOTMAYO"))
declare tt3_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"CHOLTOTCDCMAYO"))
declare tt4_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"CHOLESTEROL"))
declare tt5_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"CHOL"))
declare tt6_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"CHOLESTEROLCDCMAYO"))
 
 
 
;Aspirin /*- removed Cancel permanantly */
declare asp_cd = f8 with public,constant(uar_get_code_by("DISPLAY",72,"Cancel Permanently Diabetes Aspirin Form"))
 
 
 
; Weight Height BMI /* general Lookup and Clinical Services File */
declare wt_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"ACTUALWEIGHT"))
declare ht_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"HEIGHT"))
declare bmi_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"BODYMASSINDEX"))
 
;Creatinine /* From Diabetes lab File and ATG Specs */
declare cr1_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"CREATININE"))
declare cr2_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"CREATININEMAYO"))
declare cr3_cd = f8 with public,constant(uar_get_code_by("DISPLAY",72,"Creatinine POC"))
declare cr4_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"CREATININEPOC2"))
declare cr5_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"CREATININEPOC3"))
 
 
;MicroAlbumin /*Got from Diabetes Report */
declare ma1_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"URINEALBUMIN"))
declare ma2_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"UALBCREATININERATIO"))
declare ma3_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"URMICROALBUMIN"))
declare ma4_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"URMICROALBUMINMAYO"))
declare ma5_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"MICROALBCREATMAYO"))
declare ma6_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"UMICROALBRNDMMAYO"))
declare ma7_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"UMICROALBUMINMAYO"))
declare ma8_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"UALBUMINMAYO"))
declare ma9_cd = f8 with public,constant(uar_get_code_by("DISPLAY",72,"U Albumin"))
 
 
; Eye Exam /* From  ATG Specs */
declare eye1_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"LASTEYEEXAMDATE"))
declare eye2_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"DATEOFLASTEYEEXAM"))
 
 
; Foot Exam /* From  ATG Specs and HM*/
declare foot1_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"LASTFOOTEXAMDATE"))
declare foot2_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"DATEOFLASTFOOTEXAM"))
declare foot3_cd = f8 with public,constant(uar_get_code_by("DISPLAY",72,"Foot Exam Grid"))
declare foot4_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"CONSULTPODIATRY"))
declare foot5_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"PROGRESSNOTEPODIATRY"))
declare foot6_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"SENSATIONCHECKWITHMONOFILAMENT"))
declare foot7_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"FOOTEXAM10GMMONOFILAMENTSENSATION"))
declare foot8_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"RIGHTFOOTMONOFILAMENTCHECK"))
declare foot9_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"LEFTFOOTMONOFILAMENTCHECK"))
 
 
 
;Diabetes Education /* From  ATG Specs */
declare db1_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"DIABETESEDUCATORINTAKEADULTFORM"))
declare db2_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"CONSULTDIABETESEDUCATION"))
declare db3_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"COMPMEDEXAMDIABETESEDU"))
declare db4_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"NURSENOTEDIABETESEDUCATION"))
declare db5_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"PROGRESSNOTEDIABETESEDUCATION"))
declare db6_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"COMPMEDEXAMNUTRITIONSERV"))
declare db7_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"NURSENOTENUTRITIONSERVICES"))
declare db8_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"PROGRESSNOTENUTRITIONSERVICES"))
declare db9_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"CONSULTNUTRITIONSERVICES"))
declare db10_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"DATEOFLASTDIABETESEDUCATION"))
declare db11_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",72,"DIABETESEDUCINTAKEADULTTEXT"))
 
declare class_cd = f8 with public,constant(uar_get_code_by("DISPLAY",53,"Date"))
 
 
/* Aspirin codes */
declare asp1_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",200,"ASPIRIN"))
declare asp2_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",200,"WARFARIN"))
declare asp3_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",200,"TICLOPIDINE"))
declare asp4_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",200,"CLOPIDOGREL"))
declare asp5_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",200,"DIPYRIDAMOLE"))
declare asp6_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",200,"HEPARIN"))
declare asp7_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",200,"DALTEPARIN"))
declare asp8_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",200,"ANAGRELIDE"))
declare asp9_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",200,"CILOSTAZOL"))
declare asp10_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",200,"ASPIRINDIPYRIDAMOLE"))
declare asp11_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",200,"ENOXAPARIN"))
declare asp12_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",200,"TINZAPARIN"))
declare asp13_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",200,"FONDAPARINUX"))
declare asp14_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",200,"PRASUGREL"))
 
 
/* Order Status Code */
declare order_stat_cd = f8 with public, constant(uar_get_code_by("MEANING",6004,"ORDERED"))
 
/* Problem Status Code */
declare prob_stat_cd = f8 with public,constant(uar_get_code_by("DISPLAY_KEY",12030,"ACTIVE"))
 
 
 
declare date_time = vc
set report_run_date_disp = format(curdate, "mm/dd/yy;;d")
set report_run_time_disp = format(curtime, "hh:mm;;m" )
set date_time  = concat(report_run_date_disp," ",report_run_time_disp)
 
declare results =  vc
declare goal = vc
declare duedate = vc
declare category = vc
declare target = vc
declare numValues = f4
declare prevval = vc
declare prev_date = vc
declare normal = vc
declare helpinfo = vc
declare unit_cd = vc
declare kglbs = f4
declare due_str = vc
declare D1 = dq8
declare D2 = dq8
declare num = vc
declare trendline = vc
declare tempval = vc
declare trendlinedt = vc
declare asp_val = vc
declare allergy = vc
declare cancel_asp = vc
declare vasc = vc
declare aspsat = vc
declare low = vc
declare high =  vc
declare res_unit = vc
declare ddate = dq8
 
set allergy = ""
 
/**************************************************
 *     Allergy Section                            *
 **************************************************/
 
SELECT
	p.person_id
	, a.active_ind
	, a.cancel_dt_tm
	, a.substance_nom_id
	, n.source_identifier
	, a.allergy_id
	, stat = NULLIND(a.cancel_dt_tm)
 
FROM
	PERSON   P
	, ALLERGY   a
	, NOMENCLATURE   n
	, DUMMYT D
 
PLAN P
   WHERE p.person_id =  $personid
   AND p.active_ind = 1
 
JOIN D
JOIN a
 	WHERE p.person_id = a.person_id
 	AND  a.active_ind = 1
 
JOIN n WHERE
		n.nomenclature_id = a.substance_nom_id
  	AND  n.source_string in  ('aspirin', 'aspirin-dipyridamole','aspirin-pravastatin', 'cilostazol',
				 'clopidogrel' , 'dipyridamole','ticlopidine', 'abciximab','tirofiban', 'eptifibatide' )
 
HEAD REPORT
	allergy = "No"
DETAIL
		IF (a.allergy_id > 0  AND stat != 0	)
			allergy = "Yes"
 
		ENDIF
 
WITH NOCOUNTER, SEPARATOR=" ", FORMAT, OUTERJOIN=D
 
/**************************************************
 *   Cancel Permanently Aspirin                   *
 **************************************************/
SELECT DISTINCT INTO "nl:"
FROM
	PERSON  p
	, CLINICAL_EVENT C
 	, DUMMYT D
 
PLAN p
	WHERE p.person_id = $personid
    AND p.active_ind = 1
 
JOIN D
JOIN C
	WHERE p.person_id = C.person_id
	AND	 C.event_cd = asp_cd
	AND C.authentic_flag = 1
	AND C.valid_until_dt_tm > cnvtdatetime(CURDATE +1, 0)
 
HEAD REPORT
 cancel_asp = "No"
 
DETAIL
	IF (C.clinical_event_id > 0 )
		cancel_asp = "Yes"
	ENDIF
 
WITH NOCOUNTER, SEPARATOR=" ", FORMAT, OUTERJOIN=D
 
 
/**************************************************
 *     Vascular Care Check                        *
 **************************************************/
 
SELECT INTO "nl:"
	p.person_id
	, n.nomenclature_id
 	, n.source_identifier
 	, n.source_string
 
FROM
	PERSON P
	, PROBLEM  pr
	, NOMENCLATURE n
 	, DUMMYT D
 
PLAN p
	WHERE p.person_id = $personid
   	AND p.active_ind = 1
 
JOIN D
JOIN pr
	WHERE p.person_id = pr.person_id
	AND pr.active_ind = 1
	AND pr.life_cycle_status_cd = prob_stat_cd
	AND pr.cancel_reason_cd  = 0
 
JOIN n
	WHERE	n.nomenclature_id = pr.nomenclature_id
	AND n.source_identifier IN ('410', '410.0','410.00', '410.1','410.10','410.01',
		'410.02','410.1','410.11','410.12','410.2','410.20','410.21','410.22','410.3',
		'410.30','410.31','410.32','410.4', '410.40','410.41','410.42','410.5','410.50',
		'410.51','410.52',	'410.6', '410.60','410.61','410.62','410.7', '410.70',
		'410.71','410.72','410.8','410.80','410.81','410.82','410.9','410.90',
		'410.91','410.92','411','411.0','411.1','411.81','411.89','413','413.0',
		'413.1','413.9','414','414.0','414.00','414.01','414.02','414.03','414.04',
		'414.05','414.06','414.07','414.2','414.8','414.9','429.2','433','433.0',
		'433.00','433.01','433.1','433.10','433.11','433.2','433.20','433.21','433.3',
		'433.30','433.31','433.8','433.80','433.81','433.9','433.90','433.91','434',
		'434.0','434.00','434.01','434.1','434.10','434.11','434.9','434.90','434.91',
		'440.1','440.10','440.2','440.20','440.21','440.22','440.23','440.24','440.29',
		'444','444.0','444.00','444.1','444.10','444.21','444.22','444.81','444.89',
		'444.9','445.01','445.02','445.81','445.89', '412')
 
HEAD REPORT
 vasc = "No"
DETAIL
 
	IF (n.nomenclature_id > 0 )
 	 	vasc = "Yes"
 	 ENDIF
 
WITH NOCOUNTER, SEPARATOR=" ", FORMAT, OUTERJOIN=D
 
 
 
 
/**************************************************
 *    Aspirin Satisfiers                         *
 **************************************************/
 
 SELECT
	p.person_id
	,o.order_id
	, o.catalog_cd
	, o.active_ind
	, ord = nullind(o.orig_order_dt_tm)
 
FROM
	PERSON P
	,ORDERS o
	, dummyt D
 
 PLAN p
     WHERE p.person_id = $personid
   		AND p.active_ind = 1
 
 JOIN D
 JOIN o
   		WHERE o.person_id = p.person_id
   		and o.active_ind  = 1
   		and o.catalog_cd  in ( asp1_cd, asp2_cd, asp3_cd, asp4_cd, asp5_cd,asp6_cd, asp7_cd, asp8_cd,
   		 asp9_cd, asp10_cd,asp11_cd, asp12_cd,asp13_cd, asp14_cd)
   		AND o.order_status_cd = order_stat_cd
 
 
 
HEAD REPORT
aspsat = "No"
 
DETAIL
	IF(o.order_id > 0 and ord = 0)
		aspsat = "Yes"
	ENDIF
 
 
WITH NOCOUNTER, SEPARATOR=" ", FORMAT, OUTERJOIN=D
 
/**************************************************
 *     Lab Information Section		    		  *
 **************************************************/
SELECT DISTINCT INTO "nl:"
	p.name_full_formatted
	, AGE = cnvtint(CNVTALPHANUM(cnvtage(p.birth_dt_tm),1))
	, event_type = IF  	  ((C.event_cd =  hgba1c1_cd) OR (C.event_cd =  hgba1c2_cd) OR
						   (C.event_cd =  hgba1c3_cd) OR (C.event_cd =  hgba1c4_cd)
						   OR (C.event_cd =  hgba1c5_cd) )
						"HBA1C"
 
	               ELSEIF (C.event_cd =  sbp_cd     OR  C.event_cd =dbp_cd )
	          			UAR_GET_CODE_DISPLAY(C.EVENT_CD)
 
	           	   ELSEIF ((C.event_cd =  hdl1_cd) 	OR (C.event_cd =  hdl2_cd)  OR
						   (C.event_cd =  hdl3_cd)  OR (C.event_cd =  hdl4_cd)  OR
						   (C.event_cd =  hdl5_cd)  OR (C.event_cd =  hdl6_cd))
						"HDL"
 
				   ELSEIF ((C.event_cd =  ldl1_cd)  OR (C.event_cd =  ldl2_cd)  OR
						   (C.event_cd =  ldl3_cd)  OR (C.event_cd =  ldl4_cd)  OR
						   (C.event_cd =  ldl5_cd)  OR (C.event_cd =  ldl6_cd)  OR
						   (C.event_cd =  ldl7_cd)  OR (C.event_cd =  ldl8_cd)  OR
						   (C.event_cd =  ldl9_cd)  OR (C.event_cd =  ldl10_cd) OR
						   (C.event_cd =  ldl11_cd) OR (C.event_cd =  ldl12_cd) OR
   						   (C.event_cd =  ldl13_cd) OR (C.event_cd =  ldl14_cd) )
						 "LDL"
 
				   ELSEIF ( C.event_cd = tob1_cd    OR C.event_cd =tob2_cd)
						"Tobacco Use"
 
				   ELSEIF ( C.event_cd = eye1_cd   OR C.event_cd =eye2_cd)
						"Eye Exam"
 
				   ELSEIF ( C.event_cd = foot1_cd  OR C.event_cd =foot2_cd OR C.event_cd =foot3_cd OR
				   			C.event_cd = foot4_cd  OR C.event_cd =foot5_cd OR C.event_cd =foot6_cd OR
				   			C.event_cd = foot7_cd  OR C.event_cd =foot8_cd OR C.event_cd =foot9_cd )
						"Foot Exam"
 
				   ELSEIF ( C.event_cd = cr1_cd    OR C.event_cd =cr2_cd OR C.event_cd =cr3_cd
								OR C.event_cd =cr4_cd OR C.event_cd =cr5_cd )
						"Creatinine"
 
				   ELSEIF ((C.event_cd =  db1_cd)  OR (C.event_cd =  db2_cd) OR
						(C.event_cd =  db3_cd) 	   OR (C.event_cd =  db4_cd) OR
						(C.event_cd =  db5_cd) 		OR (C.event_cd =  db6_cd) OR
						(C.event_cd =  db7_cd) 		OR (C.event_cd =  db8_cd) OR
						(C.event_cd =  db9_cd) 		OR (C.event_cd =  db10_cd) OR  (C.event_cd =  db11_cd))
						"Diabetes Education"
 
				   ELSEIF ((C.event_cd =  ma1_cd) OR (C.event_cd =  ma2_cd) OR
						(C.event_cd =  ma3_cd) OR (C.event_cd =  ma4_cd) OR
						(C.event_cd =  ma5_cd) OR (C.event_cd =  ma6_cd) OR
						(C.event_cd =  ma7_cd)  OR (C.event_cd =  ma8_cd) OR
						(C.event_cd =  ma9_cd))
						"Microalbumin"
 
				   ELSEIF ((C.event_cd =  tr1_cd) OR (C.event_cd =  tr2_cd) OR
						(C.event_cd =  tr3_cd) OR (C.event_cd =  tr4_cd) OR
						(C.event_cd =  tr5_cd)   )
						"Triglycerides"
 
				   ELSEIF ((C.event_cd =  flu1_cd) OR (C.event_cd =  flu2_cd) OR
						(C.event_cd =  flu3_cd) OR (C.event_cd =  flu4_cd)
						OR (C.event_cd =  flu5_cd)   )
						"Flu Vaccine"
 
					ELSEIF ((C.event_cd =  pn1_cd) OR (C.event_cd =  pn2_cd) OR
						(C.event_cd =  pn3_cd) OR (C.event_cd =  pn4_cd) OR (C.event_cd =  pn5_cd)
							OR (C.event_cd =  pn6_cd) )
						"Pneumonia Vaccine"
 
					ELSEIF ((C.event_cd =  tt1_cd) OR (C.event_cd =  tt2_cd) OR
						(C.event_cd =  tt3_cd) OR (C.event_cd =  tt4_cd) OR
						(C.event_cd =  tt5_cd) OR (C.event_cd =  tt6_cd)  )
						"Total Cholesterol"
 
				    ELSE
				   		UAR_GET_CODE_DISPLAY(C.EVENT_CD)
	             ENDIF
 
	, lab_freq =    IF ((C.event_cd =  hgba1c1_cd) OR (C.event_cd =  hgba1c2_cd) OR
						(C.event_cd =  hgba1c3_cd) OR (C.event_cd =  hgba1c4_cd)
							OR (C.event_cd =  hgba1c5_cd)						)
	          			"6 months"
	          		ELSE "Yearly"
	         		ENDIF
 
FROM
	PERSON  p
	, CLINICAL_EVENT C
 
 
PLAN p
	WHERE p.person_id = $personid
    AND p.active_ind = 1
 
JOIN C
	WHERE p.person_id = C.person_id AND
	       (
	     /* ( C.event_end_dt_tm  > cnvtdatetime(CURDATE - 365 , 0) AND
	      		; C.result_val != ' ' AND
	 			C.event_cd IN (	sbp_cd, dbp_cd) ) OR
				C.event_cd IN (hgba1c1_cd, hgba1c2_cd, hgba1c3_cd, hgba1c4_cd,hgba1c5_cd,
				ldl1_cd, ldl1_cd,ldl2_cd,ldl3_cd,ldl4_cd,ldl5_cd,ldl6_cd,ldl7_cd,
					ldl8_cd,ldl9_cd,ldl10_cd,ldl11_cd,ldl12_cd, ldl13_cd,ldl14_cd, wt_cd, ht_cd,
					bmi_cd,
				tob1_cd,tob2_cd,  cr1_cd, cr2_cd, cr3_cd, cr4_cd, cr5_cd,
			 		hdl1_cd,hdl2_cd,hdl3_cd,hdl4_cd,hdl5_cd,hdl6_cd , ma1_cd, ma2_cd, ma3_cd,
					ma4_cd, ma5_cd, ma6_cd, ma7_cd,ma8_cd,ma9_cd, tr1_cd, tr2_cd,tr3_cd, tr4_cd,tr5_cd,
					tt1_cd, tt2_cd, tt3_cd,	 tt4_cd, tt5_cd, tt6_cd, eye1_cd, eye2_cd, foot1_cd, foot2_cd,foot3_cd,
	 		  foot4_cd, foot5_cd,foot6_cd,	foot7_cd, foot8_cd,foot9_cd, db1_cd, db2_cd,
	 		  db3_cd, db4_cd,db5_cd, db6_cd,	db7_cd, db8_cd,	db9_cd, db10_cd,
				db11_cd,flu1_cd,flu2_cd,flu3_cd,flu4_cd, flu5_cd, pn1_cd, pn2_cd,
				pn3_cd, pn4_cd, pn5_cd, pn6_cd )  */
	 		C.event_cd IN (hgba1c1_cd, hgba1c2_cd, hgba1c3_cd, hgba1c4_cd,hgba1c5_cd,
					sbp_cd, dbp_cd,ldl1_cd, ldl1_cd,ldl2_cd,ldl3_cd,ldl4_cd,ldl5_cd,ldl6_cd,ldl7_cd,
					ldl8_cd,ldl9_cd,ldl10_cd,ldl11_cd,ldl12_cd, ldl13_cd,ldl14_cd,tob1_cd,tob2_cd, wt_cd, ht_cd,
					bmi_cd,  cr1_cd, cr2_cd, cr3_cd, cr4_cd, cr5_cd,
			 		hdl1_cd,hdl2_cd,hdl3_cd,hdl4_cd,hdl5_cd,hdl6_cd , ma1_cd, ma2_cd, ma3_cd,
					ma4_cd, ma5_cd, ma6_cd, ma7_cd,ma8_cd,ma9_cd, tr1_cd, tr2_cd,tr3_cd, tr4_cd,tr5_cd,
					tt1_cd, tt2_cd, tt3_cd,	 tt4_cd, tt5_cd, tt6_cd, eye1_cd, eye2_cd, foot1_cd, foot2_cd,foot3_cd,
	 		  foot4_cd, foot5_cd,foot6_cd,	foot7_cd, foot8_cd,foot9_cd, db1_cd, db2_cd,
	 		  db3_cd, db4_cd,db5_cd, db6_cd,	db7_cd, db8_cd,	db9_cd, db10_cd,
				db11_cd,flu1_cd,flu2_cd,flu3_cd,flu4_cd, flu5_cd, pn1_cd, pn2_cd,
				pn3_cd, pn4_cd, pn5_cd, pn6_cd )
 
	 		)
 
 
	 AND C.authentic_flag = 1
	 and C.view_level = 1
	 AND C.valid_until_dt_tm > cnvtdatetime(CURDATE +1, 0)
 
 
 
ORDER BY event_type, C.event_end_dt_tm DESC
 
HEAD REPORT
 
 	JSON->data = concat(JSON->data,'{ "patientLabs": [')
	JSON->data = concat(JSON->data, '{"labInfo": {')
	JSON->data = concat(JSON->data, '"category": ', '"Category"')
    JSON->data = concat(JSON->data, ', "measure_name": ', '"Assessment"')
    JSON->data = concat(JSON->data, ', "measure_freq": ', '"Every"')
    JSON->data = concat(JSON->data, ', "recent_eventdate": ', '"Recent Date"')
    JSON->data = concat(JSON->data, ', "recent_result_val": ', '"Recent Value"')
    JSON->data = concat(JSON->data, ', "prev_eventdate": ', '"Previous Date"')
    JSON->data = concat(JSON->data, ', "prev_result_val": ', '"Previous Value"')
    JSON->data = concat(JSON->data, ', "goal": ', '"Goal"')
    JSON->data = concat(JSON->data, ', "duedate": ', '"Due Date"')
    JSON->data = concat(JSON->data, ', "target": ', '"Target"')
    JSON->data = concat(JSON->data, ', "normal": ', '"Normal"')
    JSON->data = concat(JSON->data, ', "helpinfo": ', '"Help Info"')
    JSON->data = concat(JSON->data, ', "units": ', '"Units"')
    JSON->data = concat(JSON->data, ', "due_str": ', '"Due Str"')
    JSON->data = concat(JSON->data, ', "trendline": ', '"Trendline"')
    JSON->data = concat(JSON->data, ', "trendline_dt": ', '"Trendline Date"')
    JSON->data = concat(JSON->data, '}}')
 
 
HEAD event_type
cnt  = 0
due_str= ""
/* Classify Section of Labs */
 
	IF ( ( C.event_cd =  sbp_cd) OR  (C.event_cd = dbp_cd ) OR
   		 (C.event_cd = wt_cd)    OR  (C.event_cd = bmi_cd) )
   		category = "Vitals1"
 
   	ELSEIF ( (event_type = "Pneumonia Vaccine") OR (event_type = "Flu Vaccine")
   				OR (event_type = "Diabetes Education ") OR (event_type = "Eye Exam ")
   				OR (event_type ="Foot Exam "))
	    category = "Vitals2"
 
	ELSEIF ( (C.event_cd = ht_cd ) OR (event_type = "Tobacco Use"))
	 		category = "other"
    ELSE category = "Labs"
	ENDIF
 
/* Goals and Help info */
 
	IF (event_type = "HBA1C" )
   		 goal = "< 8.0"
   		 helpinfo = "Average measure of blood sugar"
   		 low = "4.8"
		 high =  "5.9"
		 res_unit = "%A1C"
 
  	ELSEIF  ( C.event_cd =  sbp_cd  OR  C.event_cd =dbp_cd /*event_type = "BP" */)
	     goal = "< 140/90"
	     helpinfo = "Sugar in the blood"
 
	ELSEIF  (event_type = "LDL" )
	 	 helpinfo = "Bad Cholesterol"
		 goal ="< 100"
		 low = "0"
		 high =  "99"
		 res_unit = "mg/dL"
 
	ELSEIF  (event_type = "HDL")
		 goal = " > 40"
		 helpinfo = "Good Cholesterol"
		  low = "40"
		 high =  "60"
		 res_unit = "mg/dL"
 
	ELSEIF  (event_type = "Triglycerides"   )
		 goal = " < 150"
		 helpinfo = "Fats due to excessive calories"
 		 low = "0"
		 high =  "149"
		 res_unit = "mg/dL"
	ELSEIF  (event_type = "Creatinine")
		 goal = " "
		 helpinfo = "Measures kidney function"
 		 low = "0.8"
		 high =  "1.3"
		 res_unit = "mg/dL"
	ELSEIF  (event_type = "Microalbumin")
		 goal = " "
		 helpinfo = "Measures kidney function"
 		 low = "0"
		 high =  "19"
		 res_unit = "mg/gm"
	ELSEIF (event_type = "Tobacco Use ")
		 goal = "No"
		 helpinfo = " "
 
	ELSEIF (event_type = "Total Cholesterol")
		 goal = "No"
		 low = "0"
		 high = "199"
		 helpinfo = "Includes HDL, LDL and Triglycerides"
  		 res_unit = "mg/dL"
 
	ELSE
   		goal = " "
   		helpinfo = " "
 
   	ENDIF
 
/* Define Targets, Due Dates, Number of results */
	IF ( event_type= "HBA1C" OR event_type= "LDL"  OR ( C.event_cd =  sbp_cd)
   			OR (event_type = "Tobacco Use ") )
	         target = "target"
 
    ELSE target = "other"
	ENDIF
 
	IF (event_type= "HBA1C")
		D2 = DATETIMEADD(C.EVENT_END_DT_TM, 180)
 
   	ELSE
   		D2 = DATETIMEADD(C.EVENT_END_DT_TM, 365)
   	ENDIF
 
   	duedate = FORMAT(D2 , 'MM/DD/YYYY;;D')
   	D1 = DATETIMECMP(D2, CNVTDATETIME(CURDATE,0))
	IF (D1 < 60 and D1 > 0)
   		due_str = "due_in_60"
   	ELSEIF  (D1 < 0)
   		due_str = "overdue"
	ENDIF
 
	IF((event_type = "Pneumonia Vaccine") 		OR (event_type = "Flu Vaccine")
   		OR (event_type = "Diabetes Education ") OR (event_type = "Eye Exam")
   		OR (event_type ="Foot Exam") 			OR (C.event_cd = ht_cd ))
   		numValues = 1
   	ELSE numValues = 2
 
   	ENDIF
 
  	JSON->data = concat(JSON->data, ',{"labInfo": {')
  	JSON->data = concat(JSON->data, '"category": ', '"', category , '"')
  	JSON->data = concat(JSON->data, ', "measure_name": ', '"', trim(event_type) , '"')
  	JSON->data = concat(JSON->data, ', "measure_freq": ', '"', lab_freq , '"')
 
	 IF (C.event_class_cd = class_cd)
  ddate = CNVTDATETIME(CNVTDATE2(substring(3,8,C.result_val),"YYYYMMDD"),0)
    results = format(ddate, "mm/dd/yyyy;;d")
    duedate= format(DATETIMEADD(ddate, 365), 'MM/DD/YYYY;;D')
    ELSE
     results = C.result_val
  ENDIF
 
;	IF (C.event_class_cd = class_cd)
;  		results = format(CNVTDATETIME(CNVTDATE2(substring(3,8,C.result_val),"YYYYMMDD"),0), "mm/dd/yyyy;;d")
;   	ELSE
;   		results = C.result_val
; 	ENDIF
 
    JSON->data = concat(JSON->data, ', "recent_eventdate": ', '"', format(C.event_end_dt_tm, "mm/dd/yyyy;;d"), '"')
 
    IF(event_type = "Actual Weight")
 		num = cnvtstring(cnvtreal(cnvtalphanum(C.result_val, 5)) * 2.2)
 		JSON->data = concat(JSON->data, ', "recent_result_val": ', '"',num, '"')
   	ELSE
 		JSON->data = concat(JSON->data, ', "recent_result_val": ', '"', results , '"')
    ENDIF
 
  	prevval = ""
  	prev_date = ""
 	trendline = ""
 	trendlinedt = ""
 	D2 = DATETIMEADD(CNVTDATETIME(CURDATE,0), -730)
 
DETAIL
 	IF ( cnt = 1 )
 		IF (C.event_class_cd = class_cd)
    		prevval  = format(CNVTDATETIME(CNVTDATE2(substring(3,8,C.result_val),"YYYYMMDD"),0), "mm/dd/yyyy;;d")
   		ELSE
   			prevval = C.result_val
   		ENDIF
   			prev_date = 	format(C.event_end_dt_tm, "mm/dd/yyyy;;d")
   	ENDIF
   			 /* 2 years back from today */
   	D1 = DATETIMECMP(D2, C.event_end_dt_tm)
 
 	IF ((  C.event_cd =  sbp_cd OR  C.event_cd = dbp_cd  OR event_type= "LDL" OR event_type = "HBA1C"
 					OR C.event_cd = wt_cd OR C.event_cd = bmi_cd )
 		 AND D1 < 0 AND cnt < 10)
 		IF (C.result_val = "" )
 			tempval = "0"
 		ELSE
 			IF (C.event_cd = wt_cd)
 				tempval = cnvtstring(cnvtreal(cnvtalphanum(C.result_val, 5)) * 2.2)
 			ELSE
 				tempval = C.result_val
 			ENDIF
 		ENDIF
 		IF (trendline = "")
 			trendline =  concat(tempval, trendline)
 		ELSE
 			trendline =  concat(concat(tempval, ","), trendline)
 		ENDIF
 
 		IF (trendlinedt = "")
 			trendlinedt =  concat( format(C.event_end_dt_tm, "mm/dd/yyyy;;d"),trendlinedt)
 		ELSE
 			trendlinedt =  concat(concat(format(C.event_end_dt_tm, "mm/dd/yyyy;;d"), ","),trendlinedt )
 		ENDIF
 
   	ENDIF
 
   	cnt = cnt + 1
 
 
FOOT event_type
	IF ((numValues = 1))
 		JSON->data = concat(JSON->data, ', "prev_eventdate": ', '" "')
    	JSON->data = concat(JSON->data, ', "prev_result_val": ', '" "')
    ELSE
    	JSON->data = concat(JSON->data, ', "prev_eventdate": ', '"', prev_date , '"')
        IF (event_type = "Actual Weight")
 			num = cnvtstring(cnvtreal(cnvtalphanum(prevval, 5)) * 2.2)
 			JSON->data = concat(JSON->data, ', "prev_result_val": ', '"',num, '"')
 		ELSE
 			JSON->data = concat(JSON->data, ', "prev_result_val": ', '"', prevval , '"')
 		ENDIF
   	ENDIF
 
 	IF  (category = "Labs")
 		IF(C.normal_low = " " or C.normal_high = " ")
 			normal = concat(concat(concat(concat(low," - "),high)," "), res_unit);
 
 		ELSE
 		normal = concat(concat(trim(concat(C.normal_low,"-")),C.normal_high), UAR_GET_CODE_DISPLAY(C.result_units_cd));
 
 		ENDIF
 		    ELSE  normal =""
 	ENDIF
 
 
 	IF (event_type = "Actual Weight")
 		unit_cd = "lbs"
 	ELSE
 		unit_cd = UAR_GET_CODE_DISPLAY(C.result_units_cd)
 	ENDIF
 	JSON->data = concat(JSON->data, ', "goal": ', '"',  trim(goal) , '"')
 	IF (event_type = "Pneumonia Vaccine")
		JSON->data = concat(JSON->data, ', "duedate": ', '" "')
	ELSE
		JSON->data = concat(JSON->data, ', "duedate": ', '"',trim(duedate) , '"')
	ENDIF
 	JSON->data = concat(JSON->data, ', "target": ', '"', target , '"')
 	JSON->data = concat(JSON->data, ', "normal": ', '"', normal , '"')
 	JSON->data = concat(JSON->data, ', "helpinfo": ', '"', helpinfo , '"')
 	JSON->data = concat(JSON->data, ', "units": ', '"', unit_cd , '"')
 
	IF (event_type = "Pneumonia Vaccine" OR  C.event_cd = flu5_cd)
 		JSON->data = concat(JSON->data, ', "due_str": ', '"met"')
    ELSE
 		JSON->data = concat(JSON->data, ', "due_str": ', '"',due_str , '"')
 	ENDIF
 		 /*JSON->data = concat(JSON->data, ', "trendline": ', '"1,2,3,5,7,9,-1"') */
 	JSON->data = concat(JSON->data, ',"trendline": ', '"', trim(trendline) , '"')
 	JSON->data = concat(JSON->data, ',"trendline_dt": ', '"', trim(trendlinedt) , '"')
 	JSON->data = concat(JSON->data, '}}')
 
FOOT REPORT
 
 	asp_val = ""
 	goal = ""
 
 	IF (AGE  > 39 and AGE < 76)
 	  IF(allergy = "Yes" or cancel_asp = "Yes")
 	  	asp_val = "Yes"
 	  	goal = "NA"
 	  ENDIF
 	  IF (vasc = "Yes" and asp_val = "")
 	  		asp_val = aspsat
 	  		goal = "Yes"
 	  ELSEIF (asp_val = "")
 	  		asp_val = aspsat
 	  		goal = "Yes if IVD"
 	  ENDIF
 	ELSE
 		asp_val = "NA"
 	  	goal = "NA"
 	ENDIF
 
 	JSON->data = concat(JSON->data, ',{"labInfo": {')
  	JSON->data = concat(JSON->data, '"category": ', '"Vitals3"')
  	JSON->data = concat(JSON->data, ', "measure_name": ', '"Aspirin"')
  	JSON->data = concat(JSON->data, ', "measure_freq": ', '"Yearly"')
 	JSON->data = concat(JSON->data, ', "recent_eventdate": ', '" "')
 	;JSON->data = concat(JSON->data, ', "recent_eventdate": ', '"',allergy,'"')
    JSON->data = concat(JSON->data, ', "recent_result_val": ', '"',asp_val,'"')
 	JSON->data = concat(JSON->data, ', "prev_eventdate": ', '" "')
    JSON->data = concat(JSON->data, ', "prev_result_val": ', '" "')
   	JSON->data = concat(JSON->data, ', "goal": ', '"', goal, '"')
 	JSON->data = concat(JSON->data, ', "duedate": ', '"',trim(duedate) , '"')
 	JSON->data = concat(JSON->data, ', "target": ', '"target"')
 	JSON->data = concat(JSON->data, ', "normal": ', '"', normal , '"')
 	JSON->data = concat(JSON->data, ', "helpinfo": ', '""')
 	JSON->data = concat(JSON->data, ', "units": ', '""')
 	JSON->data = concat(JSON->data, ', "due_str": ', '"',due_str , '"')
 	JSON->data = concat(JSON->data, ', "trendline": ', '"Trendline"')
 	JSON->data = concat(JSON->data, ', "trendline_dt": ', '"Trendline Date"')
 	JSON->data = concat(JSON->data, '}}')
 
   JSON->data = concat(JSON->data,']}')
 
 
 
WITH NOCOUNTER, SEPARATOR=" ", FORMAT, OUTERJOIN=D, MAXREC= 1000
 
 
 ; REQUEST record to display the file
record putREQUEST (
  1 source_dir = vc
  1 source_filename = vc
  1 nbrlines = i4
  1 line [*]
    2 lineData = vc
  1 OverFlowPage [*]
    2 ofr_qual [*]
      3 ofr_line = vc
  1 IsBlob = c1
  1 document_size = i4
  1 document = gvc
)
 
; Set parameters for displaying the file
set putRequest->source_dir = $outdev
set putRequest->IsBlob = "1"
set putRequest->document = JSON->data
set putRequest->document_size = size(putRequest->document)
 
;  Display the file.  This allows XmlCclRequest to receive the output
execute eks_put_source with replace(Request,putRequest),replace(reply,putReply)
 
end
go
 
 
