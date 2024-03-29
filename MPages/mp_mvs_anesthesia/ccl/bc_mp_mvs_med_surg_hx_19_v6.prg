drop program bc_mp_mvs_med_surg_hx_19:dba go
create program bc_mp_mvs_med_surg_hx_19:dba
;drop program b119691_med_surg_hx_19:dba go
;create program b119691_med_surg_hx_19:dba
/**************************************************************************************************
              Purpose: Displays the Patient Medical History and Surgical History
     Source File Name: bc_mp_mvs_medhx_10.PRG
              Analyst: MediView Solutions
          Application: PowerChart, SurgiNet
  Execution Locations: PowerChart, SurgiNet
            Request #:
      Translated From:
        Special Notes:

execute bc_mp_mvs_med_surg_hx_19 "nl:" , 0, 42631099.00, 7789697.00, "" go
**************************************************************************************************/
/**************************************************************************************************
  Mod  Date            Engineer                Description
   ---  --------------- ----------------------- ------------------------------------------------
    1   08/09/2011      MediView Solutions 	    Initial Release
    2	02/08/2012		Karen Speaks			wo# 763058 - procedure hx 'age' if warrented
    3	02/27/2012		Karen Speaks			wo# 772847 - add anesthesia & transfusion hx
    4   09/30/2013      DeAnn Capanna           WO# 9999649 - Redo for new Past Medical History control
	5 	04/06/2017      Roger Harris            Ticket 83705 - Append Nurse Documented - PMH to Medical History
    6   05/15/2017      Roger Harris            Ticket 133951 - Remove duplicates from PMH

**************************************************************************************************/

prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "USERID" = 0
	, "PERSONID" = 0
	, "ENCNTRID" = 0
	, "OPTIONS" = ""

with OUTDEV, USERID, PERSONID, ENCNTRID, OPTIONS

Free Record history
RECORD history (
    1 person_id = f8
    1 encntr_id = f8
    1 med_hx[1]
        2 NO_HX        = vc
        2 TYPE [2]              ; Ticket 83705
		 	3 rec_cnt   = i2
    	    3 HX_TYPE 	= vc
    	    3 NAME [*]
                4 HX_NAME 	= vc
                4 HX_LINE 	= vc
	1 surg_hx[1]
		2 rec_cnt 			= i2
		2 NO_SHX			= vc
		2 SURG_LIST[*]
			3 surg_type		= vc
			3 surg_cnt		= i2
			3 SURGERY[*]
				4 surg_name	= vc
				4 surg_dt		= vc
		2 actual_surg_cnt = i4
		2 actual_surg_list[*]
			3 surg_case_id = f8
			3 surg_dt = vc
			3 surg_name = vc
	1 admissiondb[1]
		2 rec_cnt = i4
		2 hx[*]
			3 description = vc
			3 value = vc
			3 date = vc
			3 is_full_row = i1
)

;v3
declare TRANSFUSIONHX_72_CV		= f8 with public, constant(uar_get_code_by("DISPLAYKEY", 72, "TRANSFUSIONS"))
declare TREACTION_72_CV			= f8 with public, constant(uar_get_code_by("DISPLAYKEY", 72, "TRANSFUSIONREACTION"))
declare TREACTIONDATE_72_CV		= f8 with public, constant(uar_get_code_by("DISPLAYKEY", 72, "DATEOFTRANSFUSIONREACTION"))

declare ANESTHESIAHX_72_CV		= f8 with public, constant(uar_get_code_by("DISPLAYKEY", 72, "ANESTHESIAHISTORY"))
declare AREACTION_72_CV			= f8 with public, constant(uar_get_code_by("DISPLAYKEY", 72, "ANESTHESIAREACTION"))
declare AREACTIONDATE_72_CV		= f8 with public, constant(uar_get_code_by("DISPLAYKEY", 72, "DATEOFANESTHESIAREACTION"))

declare txhx_ind	= i1 with public, noconstant(0)
declare ahx_ind	= i1 with public, noconstant(0)
;v3 end

DECLARE  INERROR_8_CV = F8 WITH  PUBLIC , CONSTANT ( UAR_GET_CODE_BY ( "MEANING" ,  8 ,  "INERROR" ))
DECLARE  INERROR2_8_CV = F8 WITH  PUBLIC , CONSTANT ( UAR_GET_CODE_BY ( "MEANING" ,  8 , "IN ERROR" ))
DECLARE  NOTDONE_8_CV = F8 WITH  PUBLIC , CONSTANT ( UAR_GET_CODE_BY ( "MEANING" ,  8 ,  "NOT DONE" ))
DECLARE  NOK_72_CV = F8 WITH  PUBLIC , CONSTANT ( UAR_GET_CODE_BY ( "DISPLAYKEY" ,  72 ,  "NONEMEDICALHISTORY"))
DECLARE  UNK_72_CV = F8 WITH  PUBLIC , CONSTANT ( UAR_GET_CODE_BY ( "DISPLAYKEY" ,  72 ,  "UNKNOWNMEDICALHISTORY"))
DECLARE  medhxverif_72_CV = F8 WITH PUBLIC , CONSTANT ( UAR_GET_CODE_BY ( "DISPLAYKEY",72,"MEDICALHISTORYVERIFICATION"))

DECLARE  FORM_EVENT_ID = F8 WITH PUBLIC , NOCONSTANT ( 0.00 )

DECLARE OCULARMEDHX_72_CV = F8 WITH PROTECT, CONSTANT
										(UAR_GET_CODE_BY("description", 72, "Ocular Medical History Grid"))
DECLARE IMMUNOLOGICMEDHX_72_CV = F8 WITH PROTECT, CONSTANT
										(UAR_GET_CODE_BY("description", 72, "Immunologic Medical History Grid"))
DECLARE NEUROLOGICALMEDHX_72_CV = F8 WITH PROTECT, CONSTANT
										(UAR_GET_CODE_BY("description", 72, "Neurological Medical History Grid"))
DECLARE RESPIRATORYMEDHX_72_CV = F8 WITH PROTECT, CONSTANT
										(UAR_GET_CODE_BY("description", 72, "Respiratory Medical History Grid"))
DECLARE ENDOCRINEMETHMEDHX_72_CV = F8 WITH PROTECT, CONSTANT
								(UAR_GET_CODE_BY("description", 72, "Endocrine Metabolic Medical History Grid"))
DECLARE GASTROINTESTINAL_72_CV = F8 WITH PROTECT, CONSTANT
								(UAR_GET_CODE_BY("description", 72, "Gastrointestinal Medical History Grid"))
DECLARE HEMATOLOGICMEDHX_72_CV = F8 WITH PROTECT, CONSTANT
									(UAR_GET_CODE_BY("description", 72, "Hematologic Medical History Grid"))
DECLARE GENITOURINARYMEDHX_72_CV = F8 WITH PROTECT, CONSTANT
									(UAR_GET_CODE_BY("description", 72, "Genitourinary Medical History Grid"))
DECLARE MUSCULOSKELETALMEDHX_72_CV = F8 WITH PROTECT, CONSTANT
									(UAR_GET_CODE_BY("description", 72, "Musculoskeletal Medical History Grid"))
DECLARE PSYCHOSOCIALMEDHX_72_CV = F8 WITH PROTECT, CONSTANT
									(UAR_GET_CODE_BY("description", 72, "Psychosocial Medical History Grid"))
DECLARE ONCOLOGICMEDHX_72_CV = F8 WITH PROTECT, CONSTANT
									(UAR_GET_CODE_BY("description", 72, "Oncologic Medical History Grid"))
DECLARE CARDIOVASCULARMEDHX_72_CV = F8 WITH PROTECT, CONSTANT
									(UAR_GET_CODE_BY("description", 72, "Cardiovascular Medical History Grid"))

;Admission Database Grids
declare ONCOLOGICPASTMEDICALHISTORYGRID_72_CV = f8
	with protect, constant(uar_get_code_by("DISPLAYKEY",72,"ONCOLOGICPASTMEDICALHISTORYGRID"))
declare PSYCHIATRICPASTMEDICALHISTORYGRID_72_CV = f8
	with protect, constant(uar_get_code_by("DISPLAYKEY",72,"PSYCHIATRICPASTMEDICALHISTORYGRID"))
declare MUSCULOSKELETALPASTMEDICALHXGRID_72_CV = f8
	with protect, constant(uar_get_code_by("DISPLAYKEY",72,"MUSCULOSKELETALPASTMEDICALHXGRID"))
declare NEUROLOGICALPASTMEDICALHISTORYGRID_72_CV = f8
	with protect, constant(uar_get_code_by("DISPLAYKEY",72,"NEUROLOGICALPASTMEDICALHISTORYGRID"))
declare IMMUNOLOGICPASTMEDICALHISTORYGRID_72_CV = f8
	with protect, constant(uar_get_code_by("DISPLAYKEY",72,"IMMUNOLOGICPASTMEDICALHISTORYGRID"))
declare ENDOCRINEMETABOLICPASTMEDICALHXGRID_72_CV = f8
	with protect, constant(uar_get_code_by("DISPLAYKEY",72,"ENDOCRINEMETABOLICPASTMEDICALHXGRID"))
declare HEMATOLOGICPASTMEDICALHISTORYGRID_72_CV = f8
	with protect, constant(uar_get_code_by("DISPLAYKEY",72,"HEMATOLOGICPASTMEDICALHISTORYGRID"))
declare GENITOURINARYPASTMEDICALHXGRID_72_CV = f8
	with protect, constant(uar_get_code_by("DISPLAYKEY",72,"GENITOURINARYPASTMEDICALHXGRID"))
declare GASTROINTESTINALPASTMEDICALHXGRID_72_CV = f8
	with protect, constant(uar_get_code_by("DISPLAYKEY",72,"GASTROINTESTINALPASTMEDICALHXGRID"))
declare RESPIRATORYPASTMEDICALHISTORYGRID_72_CV = f8
	with protect, constant(uar_get_code_by("DISPLAYKEY",72,"RESPIRATORYPASTMEDICALHISTORYGRID"))
declare CARDIOVASCULARMEDICALHISTORYGRID_72_CV = f8
	with protect, constant(uar_get_code_by("DISPLAYKEY",72,"CARDIOVASCULARMEDICALHISTORYGRID"))
declare OCULARPASTMEDICALHISTORYGRID_72_CV = f8
	with protect, constant(uar_get_code_by("DISPLAYKEY",72,"OCULARPASTMEDICALHISTORYGRID"))

;Previous Illness
declare PREVIOUSILLNESSHOSPITALIZATIONSGRID_72_CV = f8
	with protect, constant(uar_get_code_by("DISPLAYKEY",72,"PREVIOUSILLNESSHOSPITALIZATIONSGRID"))
declare HOSPITALIZATIONEXPERIENCE_72_CV = f8 with protect, constant(uar_get_code_by("DISPLAYKEY",72,"HOSPITALIZATIONEXPERIENCE"))
declare REQUIREDHOSPITALIZATION_72_CV = f8 with protect, constant(uar_get_code_by("DISPLAYKEY",72,"REQUIREDHOSPITALIZATION"))
declare ILLNESSDESCRIPTION_72_CV = f8 with protect, constant(uar_get_code_by("DISPLAYKEY",72,"ILLNESSDESCRIPTION"))
declare ILLNESSDATE_72_CV = f8 with protect, constant(uar_get_code_by("DISPLAYKEY",72,"ILLNESSDATE"))

declare MISSINGLIMBGRID_72_CV = f8
	with protect, constant(uar_get_code_by("DISPLAYKEY",72,"MISSINGLIMBGRID"))
declare MISSINGLIMBREASON_72_CV = f8 with protect, constant(uar_get_code_by("DISPLAYKEY",72,"MISSINGLIMBREASON"))
declare MISSINGLIMBLOCATION_72_CV = f8 with protect, constant(uar_get_code_by("DISPLAYKEY",72,"MISSINGLIMBLOCATION"))
declare BODYLATERALITY_72_CV = f8 with protect, constant(uar_get_code_by("DISPLAYKEY",72,"BODYLATERALITY"))

declare MEDICALDEVICESIMPLANTS_72_CV = f8 with protect, constant(uar_get_code_by("DISPLAYKEY",72,"MEDICALDEVICESIMPLANTS"))
declare MEDICALDEVICEREPINFO_72_CV = f8 with protect, constant(uar_get_code_by("DISPLAYKEY",72,"MEDICALDEVICEREPINFO"))
declare PROSTHESIS_72_CV = f8 with protect, constant(uar_get_code_by("DISPLAYKEY",72,"PROSTHESIS"))

DECLARE PROBLEM_25321_CV 	= f8 WITH public, constant(uar_get_code_by("DISPLAYKEY",25321,"PROBLEM"))

DECLARE  ENC_ID =  F8  WITH  PUBLIC , NOCONSTANT ( 0.00 )
DECLARE  PER_ID =  F8  WITH  PUBLIC , NOCONSTANT ( 0.00 )
DECLARE  CNTP  	=  I4  WITH  PUBLIC , NOCONSTANT ( 0 )
DECLARE  CNTA  	=  I4  WITH  PUBLIC , NOCONSTANT ( 0 )

DECLARE ACTV_48_CV   	= f8 WITH Constant(uar_get_code_by("MEANING",48,"ACTIVE")),Protect

DECLARE edpthist_72_CV 	= f8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"EDPATIENTHISTORY"))
DECLARE prevsurg_72_CV 	= f8 WITH public, constant(uar_get_code_by("DISPLAYKEY",72,"NONEPREVSURG"))

DECLARE SURG_Counter = I4 WITH PUBLIC, NOCONSTANT(0) ;A counter for loading the recordset
DECLARE LIST_Counter = I4 WITH PUBLIC, NOCONSTANT(0) ;A counter for loading the recordset

declare PREVIOUSSURGERYHISTORYROW_72_CV = f8
	with constant(uar_get_code_by("DISPLAYKEY",72,"PREVIOUSSURGERYHISTORYROW")),protect

SELECT  INTO  "nl:"
   E.PERSON_ID
FROM  ENCOUNTER  E
PLAN  E
 	WHERE E.ENCNTR_ID = $ENCNTRID

HEAD  REPORT
	history->person_id = $PERSONID
	history->encntr_id = $ENCNTRID
WITH  NOCOUNTER

/**************************************************************************************************
				Select to get details of the medical History
**************************************************************************************************/
DECLARE MEDICAL_12033_CV = F8 WITH PUBLIC ,CONSTANT (UAR_GET_CODE_BY ("DISPLAYKEY" ,12033 ,"MEDICAL" ) )
DECLARE ACTIVE_48_CV = F8 WITH PUBLIC ,CONSTANT (UAR_GET_CODE_BY ("DISPLAYKEY" ,48 ,"ACTIVE" ) )
DECLARE AUTHVERI_8_CV = F8 WITH PUBLIC ,CONSTANT (UAR_GET_CODE_BY ("DISPLAYKEY" ,8 ,"AUTHVERIFIED" ) )

SELECT DISTINCT INTO "NL:"
FROM
	PROBLEM   P
	, NOMENCLATURE   N

PLAN P
	WHERE P.person_id = $PERSONID
	  AND P.active_ind = 1
	  AND p.active_status_cd = ACTIVE_48_CV
	  and p.data_status_cd = AUTHVERI_8_CV
	  and p.cancel_reason_cd = 0.00
	  AND P.classification_cd = MEDICAL_12033_CV
	  AND P.end_effective_dt_tm > CNVTDATETIME(CURDATE, CURTIME3)
join n
	where n.nomenclature_id = outerjoin(p.nomenclature_id)
	  and n.active_ind = outerjoin(1)

ORDER BY
	p.annotated_display

HEAD REPORT

	CNTA = 0

	;initialize MED_HIST record structure
	STAT = ALTERLIST(history->med_hx[1].TYPE[1].NAME, 10)

DETAIL

	CNTA = CNTA + 1

	; add BLANK ROWS the NAME segment if needed
	STAT = MOD(CNTA,10)
	IF(STAT = 1 AND CNTA !=1)
		STAT = ALTERLIST(history->med_hx[1].TYPE[1].NAME,CNTA + 10)
	ENDIF

	history->med_hx[1].TYPE[1].NAME[CNTA]->HX_NAME = trim(p.annotated_display)

	history->med_hx[1].TYPE[1].NAME[CNTA]->HX_LINE = trim(uar_get_code_display(p.life_cycle_status_cd))


FOOT REPORT

	; remove unused med_hist->TYPE segment ROWS
	STAT = ALTERLIST(history->med_hx[1].TYPE[1].NAME,CNTA)

WITH NOCOUNTER, SEPARATOR=" ", FORMAT

;  Start Ticket 83705
set history->med_hx[1].TYPE[1].HX_TYPE = ""
set history->med_hx[1].TYPE[2].HX_TYPE = "Nurse Documented PMH"

/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

                                           VARIABLE AND CONSTANTS

@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
Declare num = i4 With Noconstant(0), Public
Declare rec_cnt = i4 With Noconstant(0), Public

Declare AUTH_8_CV           = f8 With Protect, Constant(Uar_Get_Code_By("MEANING", 8 ,"AUTH"))
Declare ALT_8_CV            = f8 With Protect, Constant(Uar_Get_Code_By("MEANING", 8 ,"ALTERED"))
Declare MOD_8_CV            = f8 With Protect, Constant(Uar_Get_Code_By("MEANING", 8 ,"MODIFIED"))


/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

                                                  RECORD STRUCTURES

@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

Free Record temp
Record temp (
    1 rec_cnt = i2
    1 g_cnt = i2
    1 hist_grids [*]
        2 grid_title = vc
        2 e_cnt = i2
        2 evnt_codes [*]
            3 evnt_cd = f8
)


/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

                                                     INITIALIZATION

@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

;   Populate History Grids Event Codes


; CARDIOVASCULAR MEDICAL HISTORY GRID
Set x = 1
Call Alterlist(temp->hist_grids, x)
Set temp->hist_grids[x].grid_title = "Cardiovascular Medical History"

Set y = 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Angina-medical history")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "CAD - medical history")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Congenital Heart Disease Medical History")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Heart Attack - medical history")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Heart Failure  - medical history")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "High Blood Pressure  - medical history")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Cardiovascular, Other Medical History")
Set temp->hist_grids[x].e_cnt = y


; RESPIRATORY MEDICAL HISTORY GRID
Set x = x + 1
Call Alterlist(temp->hist_grids, x)
Set temp->hist_grids[x].grid_title = "Respiratory Medical History"

Set y = 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Asthma-Medical History")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "COPD-medical history")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Tuberculosis - medical history")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Respiratory, Other Medical History")
Set temp->hist_grids[x].e_cnt = y


; NEUROLOGICAL MEDICAL HISTORY GRID
Set x = x + 1
Call Alterlist(temp->hist_grids, x)
Set temp->hist_grids[x].grid_title = "Neurological Medical History"

Set y = 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Migraines-Medical History")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Seizures-Medical History")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Stroke Medical History")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "TIA Medical History")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Neurological, Other Medical History")
Set temp->hist_grids[x].e_cnt = y


; ENDOCRINE METABOLIC MEDICAL HISTORY GRID
Set x = x + 1
Call Alterlist(temp->hist_grids, x)
Set temp->hist_grids[x].grid_title = "Endocrine Metabolic Medical History"

Set y = 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Diabetes-Medical History")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Endocrine, Other Medical History")
Set temp->hist_grids[x].e_cnt = y


; GASTROINTESTINAL MEDICAL HISTORY GRID
Set x = x + 1
Call Alterlist(temp->hist_grids, x)
Set temp->hist_grids[x].grid_title = "Gastrointestinal Medical History"

Set y = 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Hepatitis - medical history")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Ulcer - medical history")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Gastrointestinal, Other Medical History")
Set temp->hist_grids[x].e_cnt = y


; GENITOURINARY MEDICAL HISTORY GRID
Set x = x + 1
Call Alterlist(temp->hist_grids, x)
Set temp->hist_grids[x].grid_title = "Genitourinary Medical History"

Set y = 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Kidney Stones  - medical history")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Renal Disease-Medical History")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Dialysis Chronic Medical History")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "STD - medical history")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Genitourinary, Other Medical History")
Set temp->hist_grids[x].e_cnt = y


; OCULAR MEDICAL HISTORY GRID
Set x = x + 1
Call Alterlist(temp->hist_grids, x)
Set temp->hist_grids[x].grid_title = "Ocular Medical History"

Set y = 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Cataract Medical History")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Glaucoma Medical History")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Ocular, Other Medical History")
Set temp->hist_grids[x].e_cnt = y


; MUSCULOSKELETAL MEDICAL HISTORY GRID
Set x = x + 1
Call Alterlist(temp->hist_grids, x)
Set temp->hist_grids[x].grid_title = "Musculoskeletal Medical History"

Set y = 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Fibromyalgia Medical History")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Musculoskeletal, Other Medical History")
Set temp->hist_grids[x].e_cnt = y


; IMMUNOLOGIC MEDICAL HISTORY GRID
Set x = x + 1
Call Alterlist(temp->hist_grids, x)
Set temp->hist_grids[x].grid_title = "Immunologic Medical History"

Set y = 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "AIDS-medical history")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "HIV - medical history")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Immunologic, Other Medical History")
Set temp->hist_grids[x].e_cnt = y


; HEMATOLOGIC MEDICAL HISTORY GRID
Set x = x + 1
Call Alterlist(temp->hist_grids, x)
Set temp->hist_grids[x].grid_title = "Hematologic Medical History"

Set y = 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Sickle Cell  - medical history")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Hematologic, Other Medical History")
Set temp->hist_grids[x].e_cnt = y


; ONCOLOGIC MEDICAL HISTORY GRID
Set x = x + 1
Call Alterlist(temp->hist_grids, x)
Set temp->hist_grids[x].grid_title = "Oncologic Medical History"

Set y = 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Breast Cancer-Medical History")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Colon/Rectal Cancer Medical History")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Hodgkin's Disease Health History")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Leukemia/Myeloma Medical History")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Lung/Bronchial Cancer Medical History")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Non-Hodgkin's Lymphoma Health Hx")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Prostate Cancer-Medical History")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Skin Cancer Medical History")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Solid Tumor with Metastasis Med History")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Urinary Bladder Cancer Medical History")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Oncologic, Other Medical History")
Set temp->hist_grids[x].e_cnt = y


; PSYCHOSOCIAL MEDICAL HISTORY GRID
Set x = x + 1
Call Alterlist(temp->hist_grids, x)
Set temp->hist_grids[x].grid_title = "Psychosocial Medical History"

Set y = 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "ADHD Medical History")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Anxiety Medical History")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Bipolar Medical History")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Dementia Medical History")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Depression-Medical History")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Psychosis/Schizophrenia Medical History")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Psychiatric, Other Medical History")
Set y = y + 1
Call Alterlist(temp->hist_grids[x].evnt_codes, y)
Set temp->hist_grids[x].evnt_codes[y].evnt_cd = Uar_Get_Code_By("DISPLAY", 72, "Recreational Drug Use")
Set temp->hist_grids[x].e_cnt = y

Set temp->g_cnt = x
;call echorecord(temp)
;go to exit_prg

/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

                                                     DATA COLLECTION

@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/


Call echo(build2("Starting DATA COLLECTION: ", FORMAT(CNVTDATETIME(CURDATE, CURTIME3), "@SHORTDATETIME")
            , " FOR PERSON_ID = ", $PERSONID))

For (x = 1 to temp->g_cnt)
    If (temp->hist_grids[x].e_cnt > 0)
        ;call echo("NOOP")
        Call get_hist(x)
    Endif
EndFor

; Define query subroutine
Subroutine get_hist(grid_idx)
    call echo("*******************************************************")
    call echo(build2("Getting results for: ", temp->hist_grids[grid_idx].grid_title))

Select Distinct Into "NL:"

From
      (DUMMYT D1 With SEQ = (temp->hist_grids[grid_idx].e_cnt))
    , CLINICAL_EVENT CE

Plan D1

Join CE
    Where CE.EVENT_CD = temp->hist_grids[grid_idx].evnt_codes[D1.SEQ].evnt_cd
      And CE.PERSON_ID = $PERSONID
      And CE.VALID_UNTIL_DT_TM > Cnvtdatetime(Curdate, Curtime3)
      And CE.VALID_FROM_DT_TM >= Cnvtdatetime("01-JAN-2017")  ; The DTA set has had multiple iterations so only get since 1/1/2017
      And CE.RESULT_STATUS_CD In (AUTH_8_CV, MOD_8_CV, ALT_8_CV)
      And CE.CATALOG_CD = 0.00

Order by CE.EVENT_TITLE_TEXT, CE.PERFORMED_DT_TM Desc

Head Report
    rec_cnt = history->med_hx[1].TYPE[2].rec_cnt

;
; Tckt 133951
Head CE.EVENT_TITLE_TEXT
    rec_cnt = rec_cnt + 1
    Call Alterlist(history->med_hx[1].TYPE[2].NAME, rec_cnt)
    history->med_hx[1].TYPE[2].NAME[rec_cnt]->HX_NAME = Substring(1, 45, Replace(CE.EVENT_TITLE_TEXT, " Hx", "", 2))
    history->med_hx[1].TYPE[2].NAME[rec_cnt]->HX_LINE = Trim(Replace(Replace(CE.RESULT_VAL, "Self", "", 1), ", ", "", 1), 3)


;
Foot Report
    history->med_hx[1].TYPE[2].rec_cnt = rec_cnt

With Nocounter
End ; Subroutine get_hist


;call echorecord(temp)
;call echorecord(history)
;go to exit_prg

;  End Ticket 83705


SELECT DISTINCT INTO "NL:"
	ce.event_id,
	ce.parent_event_id,
	ce.event_cd,
	ce.event_title_text,
	ce.event_tag,
	ce.result_val,
	ce.event_end_dt_tm "@SHORTDATETIME",
	ce_col = ce.collating_seq,
	ce2.event_id,
	ce2.parent_event_id,
	ce2.event_cd,
	ce2.event_title_text,
	ce2.event_tag,
	ce2.result_val,
	ce2_col = ce2.collating_seq,
	ce3.event_id,
	ce3.parent_event_id,
	ce3.event_cd,
	ce3.event_title_text,
	ce3.event_tag,
	ce3.result_val,
	ce3_col = ce3.collating_seq,
	ce4.event_id,
	ce4.parent_event_id,
	ce4.event_cd,
	ce4.event_title_text,
	ce4.event_tag,
	ce4.result_val,
	ce4_col = ce4.collating_seq,
	ce5.event_id,
	ce5.parent_event_id,
	ce5.event_cd,
	ce5.event_title_text,
	ce5.event_tag,
	ce5.result_val,
	ce5_col = ce5.collating_seq,
	ce5.event_end_dt_tm "@SHORTDATETIME"

FROM
	clinical_event ce,
	clinical_event ce2,
	clinical_event ce3,
	clinical_event ce4,
	clinical_event ce5

PLAN ce WHERE ce.person_id = $PERSONID
  AND ce.encntr_id +0 = $ENCNTRID
  AND ce.event_cd =   edpthist_72_CV ;112139042.00
  AND ce.event_end_dt_tm < CNVTDATETIME(curdate,curtime3)
  AND ce.valid_until_dt_tm = cnvtdatetime(cnvtdate(12312100),0000)
  AND NOT ce.result_status_cd IN (INERROR_8_CV ,INERROR2_8_CV, NOTDONE_8_CV);(28,31,36)

JOIN ce2 WHERE ce2.parent_event_id = ce.event_id
  AND ce2.event_title_text = "FN Surgical History P2" ;Section of ED PT HIST PF
  AND ce2.valid_until_dt_tm = cnvtdatetime(cnvtdate(12312100),0000)

JOIN ce3 WHERE ce3.parent_event_id = ce2.event_id
  AND ce3.valid_until_dt_tm = cnvtdatetime(cnvtdate(12312100),0000)

JOIN ce4 WHERE ce4.parent_event_id = ce3.event_id
  AND ce4.valid_until_dt_tm = cnvtdatetime(cnvtdate(12312100),0000)

JOIN ce5 WHERE ce5.parent_event_id = ce4.event_id
  AND ce5.valid_until_dt_tm = cnvtdatetime(cnvtdate(12312100),0000)
  AND NOT ce.result_status_cd IN (INERROR_8_CV ,INERROR2_8_CV, NOTDONE_8_CV);(28,31,36)

ORDER BY ce.event_end_dt_tm desc,
	ce.collating_seq,
	ce2.collating_seq,
	ce3.collating_seq,
	ce4.collating_seq,
	ce5.parent_event_id,
	ce5.collating_seq

HEAD REPORT

	STAT = ALTERLIST(history->surg_hx.SURG_LIST,10)

HEAD ce3.event_tag

	history->surg_hx.rec_cnt = history->surg_hx.rec_cnt + 1
	LIST_Counter = history->surg_hx.rec_cnt

 ;check for available memory in the department list
 IF(MOD(LIST_Counter,10) = 1 AND LIST_Counter > 10)
	;if needed allocate memory for 10 more encounters
    STAT = ALTERLIST(history->surg_hx.SURG_LIST, LIST_Counter + 9)
 ENDIF

 IF(ce3.event_tag = "Previous Surgery History*")
    history->surg_hx.SURG_LIST[LIST_Counter].surg_type = CONCAT("Other ",REPLACE(TRIM(ce3.event_tag),"Grid"," ",2))
 ELSE
   history->surg_hx.SURG_LIST[LIST_Counter].surg_type = REPLACE(TRIM(ce3.event_tag),"Grid"," ",2)
 ENDIF

 ;Previous Surgery History Grid -ce3
 ;Previous Surgery History Row -ce4

HEAD ce5.parent_event_id

 history->surg_hx.SURG_LIST[LIST_Counter].surg_cnt = history->surg_hx.SURG_LIST[LIST_Counter].surg_cnt + 1
 SURG_Counter = history->surg_hx.SURG_LIST[LIST_Counter].surg_cnt

  ;check for available memory in the department list
 IF(MOD(SURG_Counter,10) = 1)
	;if needed allocate memory for 10 more encounters
    STAT = ALTERLIST(history->surg_hx.SURG_LIST[LIST_Counter].SURGERY, SURG_Counter + 9)
 ENDIF

DETAIL
 ;pull in surgery details
 IF(history->surg_hx.SURG_LIST[LIST_Counter].surg_type = "Other Previous Surgery History")
   IF(ce5.event_tag = "Surgery Description")
      history->surg_hx.SURG_LIST[LIST_Counter].SURGERY[SURG_Counter].surg_name 	= TRIM(ce5.result_val,3)
   ELSEIF(ce5.event_tag = "Surgery Date")
      history->surg_hx.SURG_LIST[LIST_Counter].SURGERY[SURG_Counter].surg_dt		= TRIM(ce5.result_val,3)
   ENDIF
 ELSE
    history->surg_hx.SURG_LIST[LIST_Counter].SURGERY[SURG_Counter].surg_name 	= TRIM(ce4.event_tag,3)
    history->surg_hx.SURG_LIST[LIST_Counter].SURGERY[SURG_Counter].surg_dt	= TRIM(ce5.result_val,3)
 ENDIF

FOOT ce3.event_tag

	STAT = ALTERLIST(history->surg_hx.SURG_LIST[LIST_Counter].SURGERY,SURG_Counter)

FOOT REPORT

	STAT = ALTERLIST(history->surg_hx.SURG_LIST,LIST_Counter)

WITH NOCOUNTER

/*===============================================================================================================
                                 GET SURGERY NONE DETAIL
===============================================================================================================*/
SELECT DISTINCT INTO "NL:"
      CE.PERSON_ID
    , CE.EVENT_TITLE_TEXT
	, CE2_EVENT_DISP = UAR_GET_CODE_DISPLAY(CE2.EVENT_CD)
	, CE2.EVENT_CD
	, CE2.PERFORMED_DT_TM

FROM
      CLINICAL_EVENT   CE
	, CLINICAL_EVENT   CE2

PLAN  CE
   WHERE CE.PERSON_ID = $PERSONID
   AND ce.encntr_id +0 = $ENCNTRID
   AND CE.EVENT_TITLE_TEXT = "FN Surgical History*"
   AND CE.VALID_UNTIL_DT_TM = CNVTDATETIME(CNVTDATE(12312100),0000)
   AND NOT CE.RESULT_STATUS_CD IN(INERROR_8_CV,INERROR2_8_CV,NOTDONE_8_CV);IN ( 28 , 31 ,36 )

JOIN CE2
   WHERE CE2.PARENT_EVENT_ID = CE.EVENT_ID
   AND CE2.EVENT_CD = prevsurg_72_CV
   AND CE2.VALID_UNTIL_DT_TM = CNVTDATETIME(CNVTDATE(12312100),0000)
   AND NOT CE2.RESULT_STATUS_CD IN(INERROR_8_CV,INERROR2_8_CV,NOTDONE_8_CV);IN ( 28 , 31 ,36 )

ORDER BY
	CE2.PERFORMED_DT_TM   DESC

HEAD REPORT
cnt = 0

DETAIL
;pull latest dta
IF(cnt = 0)
   IF(ce2.event_tag = "No")
      history->surg_hx.NO_SHX = "No History Results Found - No Previous Surgeries"
      cnt = 1
   ELSE
      history->surg_hx.NO_SHX = TRIM(ce2.result_val,3)  		 ; CONCAT("Limited to No History Results Found - ",   )
      cnt = 1
   ENDIF
ENDIF

WITH NOCOUNTER

select into 'nl:'
from surgical_case sc,
	surg_case_procedure scp
plan sc
	where sc.person_id = $PERSONID
	and sc.active_ind = 1
	and sc.cancel_dt_tm = null
	and sc.surg_start_dt_tm != null
	and sc.surg_stop_dt_tm != null
	and sc.surg_stop_dt_tm < sysdate
join scp
	where scp.surg_case_id = sc.surg_case_id
	and scp.active_ind = 1
	and scp.primary_proc_ind = 1
order by sc.surg_start_dt_tm desc
detail
	cnt = history->surg_hx.actual_surg_cnt + 1
	history->surg_hx.actual_surg_cnt = cnt
	stat = alterlist(history->surg_hx.actual_surg_list, cnt)
	history->surg_hx.actual_surg_list[cnt].surg_case_id = sc.surg_case_id
	history->surg_hx.actual_surg_list[cnt].surg_dt = format(sc.surg_start_dt_tm, "mm/dd/yyyy;;q")
	if (trim(scp.proc_text) > "")
		history->surg_hx.actual_surg_list[cnt].surg_name = trim(scp.proc_text)
	else
		history->surg_hx.actual_surg_list[cnt].surg_name = trim(uar_get_code_display(scp.sched_surg_proc_cd))
	endif
with nocounter


;PREVIOUSSURGERYHISTORYROW_72_CV
select into 'nl:'
from clinical_event ce,
	clinical_event ce_cell
PLAN ce
  WHERE ce.person_id = $PERSONID
  AND ce.encntr_id +0 = $ENCNTRID
  AND ce.event_cd =   PREVIOUSSURGERYHISTORYROW_72_CV
  AND ce.event_end_dt_tm < CNVTDATETIME(curdate,curtime3)
  AND ce.valid_until_dt_tm = cnvtdatetime(cnvtdate(12312100),0000)
  AND NOT ce.result_status_cd IN (INERROR_8_CV ,INERROR2_8_CV, NOTDONE_8_CV)
join ce_cell
	where ce_cell.parent_event_id = ce.event_id
	AND ce_cell.event_end_dt_tm < CNVTDATETIME(curdate,curtime3)
  AND ce_cell.valid_until_dt_tm = cnvtdatetime(cnvtdate(12312100),0000)
  AND NOT ce_cell.result_status_cd IN (INERROR_8_CV ,INERROR2_8_CV, NOTDONE_8_CV)
head report
	cnt = history->surg_hx.rec_cnt + 1
	history->surg_hx.rec_cnt = cnt
	stat = alterlist(history->surg_hx.SURG_LIST, cnt)
	history->surg_hx.SURG_LIST[cnt].surg_type = "Surgeries Recorded at Admission"
head ce.event_id
	cnt2 = history->surg_hx.SURG_LIST[cnt].surg_cnt + 1
	history->surg_hx.SURG_LIST[cnt].surg_cnt = cnt2
	stat = alterlist(history->surg_hx.SURG_LIST[cnt].SURGERY, cnt2)
detail
call echo(ce_cell.event_tag)
	if (ce_cell.event_tag = "Surgery Description")
		history->surg_hx.SURG_LIST[cnt].SURGERY[cnt2].surg_name = ce_cell.result_val
	endif
	if (ce_cell.event_tag = "Surgery Date")
		history->surg_hx.SURG_LIST[cnt].SURGERY[cnt2].surg_dt = ce_cell.result_val
	endif
with nocounter

;RESPIRATORYPASTMEDICALHISTORYGRID_72_CV
;CARDIOVASCULARMEDICALHISTORYGRID_72_CV
;OCULARPASTMEDICALHISTORYGRID_72_CV

;Admission Database Information
;v3 anesthesia hx
SELECT into 'nl:'
	ce2_sort = evaluate(ce2.event_cd, AREACTION_72_CV, 0, 1)
	,ce2_seq = decode(ce2.seq, 1, 0)

FROM clinical_event ce
	, dummyt d
	, clinical_event ce2

PLAN ce
  where ce.person_id = $PERSONID
	and ce.event_cd = ANESTHESIAHX_72_CV
	and ce.valid_until_dt_tm >= cnvtdatetime(curdate, curtime3)
	and ce.result_status_cd not in (INERROR_8_CV ,INERROR2_8_CV, NOTDONE_8_CV)
JOIN d
JOIN ce2
  where ce2.parent_event_id = ce.parent_event_id
	and ce2.event_cd in (AREACTION_72_CV, AREACTIONDATE_72_CV)
	and ce2.valid_until_dt_tm >= cnvtdatetime(curdate, curtime3)
	and ce2.result_status_cd not in (INERROR_8_CV ,INERROR2_8_CV, NOTDONE_8_CV)

ORDER ce.event_end_dt_tm desc
	, ce.event_id
	, ce2_sort

HEAD REPORT
tcnt = 0
ahx_ind = 1

HEAD ce.event_id
tcnt = tcnt + 1
if ( tcnt < 4 )
	cnt = history->admissiondb.rec_cnt + 1
	history->admissiondb.rec_cnt = cnt
	stat = alterlist(history->admissiondb.hx, cnt)
	history->admissiondb.hx[cnt].is_full_row = 1
	history->admissiondb.hx[cnt].description = concat("<b>Anesthesia Reaction Information - ",
													  format(ce.event_end_dt_tm,"mm/dd/yy hh:mm;;d"),"</b>")

	cnt = history->admissiondb.rec_cnt + 1
	history->admissiondb.rec_cnt = cnt
	stat = alterlist(history->admissiondb.hx, cnt)
	history->admissiondb.hx[cnt].is_full_row = 0
	history->admissiondb.hx[cnt].description = uar_get_code_display(ce.event_cd)
	history->admissiondb.hx[cnt].value = ce.result_val
endif

DETAIL
if ( tcnt < 4 and ce2_seq = 1)
	cnt = history->admissiondb.rec_cnt + 1
	history->admissiondb.rec_cnt = cnt
	stat = alterlist(history->admissiondb.hx, cnt)
	history->admissiondb.hx[cnt].is_full_row = 0
	history->admissiondb.hx[cnt].description = uar_get_code_display(ce2.event_cd)
	history->admissiondb.hx[cnt].value = ce2.result_val
endif
 with nocounter
 	, outerjoin = d

;v3 transfusion hx
SELECT into 'nl:'
	ce2_sort = evaluate(ce2.event_cd, TREACTION_72_CV, 0, 1)
	,ce2_seq = decode(ce2.seq, 1, 0)

FROM clinical_event ce
	, dummyt d
	, clinical_event ce2

PLAN ce
  where ce.person_id = $PERSONID
	and ce.event_cd =   TRANSFUSIONHX_72_CV
	and ce.valid_until_dt_tm >= cnvtdatetime(curdate, curtime3)
	and ce.result_status_cd not in (INERROR_8_CV ,INERROR2_8_CV, NOTDONE_8_CV)
JOIN d
JOIN ce2
  where ce2.parent_event_id = ce.parent_event_id
	and ce2.event_cd in ( TREACTION_72_CV, TREACTIONDATE_72_CV )
	and ce2.valid_until_dt_tm >= cnvtdatetime(curdate, curtime3)
	and ce2.result_status_cd not in (INERROR_8_CV ,INERROR2_8_CV, NOTDONE_8_CV)

ORDER ce.event_end_dt_tm desc
	, ce.event_id
	, ce2_sort

HEAD report
tcnt = 0
txhx_ind = 1

HEAD ce.event_id
tcnt = tcnt + 1
if ( tcnt < 4 )
	cnt = history->admissiondb.rec_cnt + 1
	history->admissiondb.rec_cnt = cnt
	stat = alterlist(history->admissiondb.hx, cnt)
	history->admissiondb.hx[cnt].is_full_row = 1
	history->admissiondb.hx[cnt].description = concat("<b>Transfusion Reaction Information - ",
													  format(ce.event_end_dt_tm,"mm/dd/yy hh:mm;;d"),"</b>")

	cnt = history->admissiondb.rec_cnt + 1
	history->admissiondb.rec_cnt = cnt
	stat = alterlist(history->admissiondb.hx, cnt)
	history->admissiondb.hx[cnt].is_full_row = 0
	history->admissiondb.hx[cnt].description = uar_get_code_display(ce.event_cd)
	history->admissiondb.hx[cnt].value = ce.result_val
endif

DETAIL
if ( tcnt < 4 and ce2_seq = 1)
	cnt = history->admissiondb.rec_cnt + 1
	history->admissiondb.rec_cnt = cnt
	stat = alterlist(history->admissiondb.hx, cnt)
	history->admissiondb.hx[cnt].is_full_row = 0
	history->admissiondb.hx[cnt].description = uar_get_code_display(ce2.event_cd)
	history->admissiondb.hx[cnt].value = ce2.result_val
endif
 with nocounter
 	, outerjoin = d


; Ticket 83705 - This info is now capture in Nurse Documented PMH
;select into 'nl:'
;from clinical_event ce,
;	clinical_event ce_cell
;PLAN ce
;  WHERE ce.person_id = $PERSONID
;  AND ce.encntr_id +0 = $ENCNTRID
;  AND ce.event_cd in (ONCOLOGICPASTMEDICALHISTORYGRID_72_CV,
;						PSYCHIATRICPASTMEDICALHISTORYGRID_72_CV,
;						MUSCULOSKELETALPASTMEDICALHXGRID_72_CV,
;						NEUROLOGICALPASTMEDICALHISTORYGRID_72_CV,
;						IMMUNOLOGICPASTMEDICALHISTORYGRID_72_CV,
;						ENDOCRINEMETABOLICPASTMEDICALHXGRID_72_CV,
;						HEMATOLOGICPASTMEDICALHISTORYGRID_72_CV,
;						GENITOURINARYPASTMEDICALHXGRID_72_CV,
;						GASTROINTESTINALPASTMEDICALHXGRID_72_CV,
;						RESPIRATORYPASTMEDICALHISTORYGRID_72_CV,
;						CARDIOVASCULARMEDICALHISTORYGRID_72_CV,
;						OCULARPASTMEDICALHISTORYGRID_72_CV)
;  AND ce.event_end_dt_tm < sysdate
;  and ce.valid_from_dt_tm < sysdate
;  AND ce.valid_until_dt_tm > sysdate
;  AND NOT ce.result_status_cd IN (INERROR_8_CV ,INERROR2_8_CV, NOTDONE_8_CV)
;  and ce.view_level = 0
;join ce_cell
;	where ce_cell.parent_event_id = ce.event_id
;	AND ce_cell.event_end_dt_tm < sysdate
;  AND ce_cell.valid_until_dt_tm > sysdate
;  and ce_cell.valid_from_dt_tm < sysdate
;  AND NOT ce_cell.result_status_cd IN (INERROR_8_CV ,INERROR2_8_CV, NOTDONE_8_CV)
;  and ce_cell.view_level = 1
;  and not exists(select ce_tmp.clinical_event_id
;  				from clinical_event ce_tmp
;  				where ce_tmp.person_id = $PERSONID
;  				and ce_tmp.encntr_id +0 = $ENCNTRID
;  				and ce_tmp.event_cd = ce_cell.event_cd
;  				and ce_tmp.valid_from_dt_tm < sysdate
;  				and ce_tmp.valid_until_dt_tm > sysdate
;  				and ce_tmp.event_end_dt_tm < sysdate
;  				and not ce_tmp.result_status_cd in (INERROR_8_CV ,INERROR2_8_CV, NOTDONE_8_CV)
;  				and ce_tmp.event_end_dt_tm > ce_cell.event_end_dt_tm)
;head report
;	if ( txhx_ind or ahx_ind )
;		txhx_ind = 0
;		ahx_ind = 0
;		cnt = history->admissiondb.rec_cnt + 1
;		stat = alterlist(history->admissiondb.hx, cnt)
;		history->admissiondb.rec_cnt = cnt
;		history->admissiondb.hx[cnt].is_full_row = 1
;		history->admissiondb.hx[cnt].description = concat("<b>Other Information</b>")
;	endif
;
;detail
;	cnt = history->admissiondb.rec_cnt + 1
;	history->admissiondb.rec_cnt = cnt
;	stat = alterlist(history->admissiondb.hx, cnt)
;	history->admissiondb.hx[cnt].description = uar_get_code_display(ce_cell.event_cd)
;	history->admissiondb.hx[cnt].value = ce_cell.result_val
;	history->admissiondb.hx[cnt].date = format(ce_cell.event_end_dt_tm, "mm/dd/yyyy hh:mm;;q")
;with nocounter

select into 'nl:'
	sort_id = if (ce_cell.event_cd = ILLNESSDATE_72_CV) '01'
		elseif (ce_cell.event_cd = ILLNESSDESCRIPTION_72_CV) '02'
		elseif (ce_cell.event_cd = REQUIREDHOSPITALIZATION_72_CV) '03'
		elseif (ce_cell.event_cd = HOSPITALIZATIONEXPERIENCE_72_CV) '04'
		else '05'
		endif
from clinical_event ce_grid,
	clinical_event ce_row,
	clinical_event ce_cell
plan ce_grid
	where ce_grid.person_id = $PERSONID
	and ce_grid.encntr_id +0 = $ENCNTRID
	and ce_grid.event_cd = PREVIOUSILLNESSHOSPITALIZATIONSGRID_72_CV
	and ce_grid.event_end_dt_tm < sysdate
	and ce_grid.valid_from_dt_tm < sysdate
	and ce_grid.valid_until_dt_tm > sysdate
	and not ce_grid.result_status_cd in (INERROR_8_CV ,INERROR2_8_CV, NOTDONE_8_CV)
	and not exists(select ce_tmp.clinical_event_id
  				from clinical_event ce_tmp
  				where ce_tmp.person_id = $PERSONID
  				and ce_tmp.encntr_id +0 = $ENCNTRID
  				and ce_tmp.event_cd = ce_grid.event_cd
  				and ce_tmp.valid_from_dt_tm < sysdate
  				and ce_tmp.valid_until_dt_tm > sysdate
  				and ce_tmp.event_end_dt_tm < sysdate
  				and not ce_tmp.result_status_cd in (INERROR_8_CV ,INERROR2_8_CV, NOTDONE_8_CV)
  				and ce_tmp.event_end_dt_tm > ce_grid.event_end_dt_tm)
join ce_row
	where ce_row.parent_event_id = ce_grid.event_id
	and ce_row.event_end_dt_tm < sysdate
	and ce_row.valid_from_dt_tm < sysdate
	and ce_row.valid_until_dt_tm > sysdate
	and not ce_row.result_status_cd in (INERROR_8_CV ,INERROR2_8_CV, NOTDONE_8_CV)
join ce_cell
	where ce_cell.parent_event_id = ce_row.event_id
	and ce_cell.event_end_dt_tm < sysdate
	and ce_cell.valid_from_dt_tm < sysdate
	and ce_cell.valid_until_dt_tm > sysdate
	and not ce_cell.result_status_cd in (INERROR_8_CV ,INERROR2_8_CV, NOTDONE_8_CV)
order by ce_row.event_end_dt_tm, sort_id

head report
	if ( txhx_ind or ahx_ind )
		txhx_ind = 0
		ahx_ind = 0
		cnt = history->admissiondb.rec_cnt + 1
		stat = alterlist(history->admissiondb.hx, cnt)
		history->admissiondb.rec_cnt = cnt
		history->admissiondb.hx[cnt].is_full_row = 1
		history->admissiondb.hx[cnt].description =  concat("<b>Other Information</b>")
	endif

head ce_row.event_id
	cnt = history->admissiondb.rec_cnt + 1
	history->admissiondb.rec_cnt = cnt
	stat = alterlist(history->admissiondb.hx, cnt)
	history->admissiondb.hx[cnt].is_full_row = 1

detail
	txt = trim(ce_cell.result_val)
	case (ce_cell.event_cd)
	of REQUIREDHOSPITALIZATION_72_CV:
		txt = concat("Required Hospitalization: ", trim(ce_cell.result_val))
	of HOSPITALIZATIONEXPERIENCE_72_CV:
		txt = concat("Hospital Experience: ", trim(ce_cell.result_val))
	endcase
	if (trim(history->admissiondb.hx[cnt].description) > "")
		history->admissiondb.hx[cnt].description = concat(trim(history->admissiondb.hx[cnt].description),
			" - ", trim(txt))
	else
		history->admissiondb.hx[cnt].description = trim(txt)
	endif
with nocounter


select into 'nl:'
	sort_id = if (ce_cell.event_cd = BODYLATERALITY_72_CV) '01'
		elseif (ce_cell.event_cd = MISSINGLIMBLOCATION_72_CV) '02'
		elseif (ce_cell.event_cd = MISSINGLIMBREASON_72_CV) '03'
		else '04'
		endif
from clinical_event ce_grid,
	clinical_event ce_row,
	clinical_event ce_cell
plan ce_grid
	where ce_grid.person_id = $PERSONID
	and ce_grid.encntr_id +0 = $ENCNTRID
	and ce_grid.event_cd = MISSINGLIMBGRID_72_CV
	and ce_grid.event_end_dt_tm < sysdate
	and ce_grid.valid_from_dt_tm < sysdate
	and ce_grid.valid_until_dt_tm > sysdate
	and not ce_grid.result_status_cd in (INERROR_8_CV ,INERROR2_8_CV, NOTDONE_8_CV)
	and not exists(select ce_tmp.clinical_event_id
  				from clinical_event ce_tmp
  				where ce_tmp.person_id = $PERSONID
  				and ce_tmp.encntr_id +0 = $ENCNTRID
  				and ce_tmp.event_cd = ce_grid.event_cd
  				and ce_tmp.valid_from_dt_tm < sysdate
  				and ce_tmp.valid_until_dt_tm > sysdate
  				and ce_tmp.event_end_dt_tm < sysdate
  				and not ce_tmp.result_status_cd in (INERROR_8_CV ,INERROR2_8_CV, NOTDONE_8_CV)
  				and ce_tmp.event_end_dt_tm > ce_grid.event_end_dt_tm)
join ce_row
	where ce_row.parent_event_id = ce_grid.event_id
	and ce_row.event_end_dt_tm < sysdate
	and ce_row.valid_from_dt_tm < sysdate
	and ce_row.valid_until_dt_tm > sysdate
	and not ce_row.result_status_cd in (INERROR_8_CV ,INERROR2_8_CV, NOTDONE_8_CV)
join ce_cell
	where ce_cell.parent_event_id = ce_row.event_id
	and ce_cell.event_end_dt_tm < sysdate
	and ce_cell.valid_from_dt_tm < sysdate
	and ce_cell.valid_until_dt_tm > sysdate
	and not ce_cell.result_status_cd in (INERROR_8_CV ,INERROR2_8_CV, NOTDONE_8_CV)
order by ce_row.event_end_dt_tm, sort_id

head report
	if ( txhx_ind or ahx_ind )
		txhx_ind = 0
		ahx_ind = 0
		cnt = history->admissiondb.rec_cnt + 1
		stat = alterlist(history->admissiondb.hx, cnt)
		history->admissiondb.rec_cnt = cnt
		history->admissiondb.hx[cnt].is_full_row = 1
		history->admissiondb.hx[cnt].description =  concat("<b>Other Information</b>")
	endif

head ce_row.event_id
	cnt = history->admissiondb.rec_cnt + 1
	history->admissiondb.rec_cnt = cnt
	stat = alterlist(history->admissiondb.hx, cnt)
	history->admissiondb.hx[cnt].is_full_row = 1

detail
	txt = "                                                                                                 "

	case (ce_cell.event_cd)
	of BODYLATERALITY_72_CV:
		txt = concat("Laterality: ", trim(ce_cell.result_val))
	of MISSINGLIMBLOCATION_72_CV:
		txt = concat("Location: ", trim(ce_cell.result_val))
	of MISSINGLIMBREASON_72_CV:
		txt = concat("Reason: ", trim(ce_cell.result_val))
	endcase
	if (trim(history->admissiondb.hx[cnt].description) > "")
		history->admissiondb.hx[cnt].description = concat(trim(history->admissiondb.hx[cnt].description),
			" - ", trim(txt))
	else
		history->admissiondb.hx[cnt].description = concat("Missing Limb - ",trim(txt))
	endif
with nocounter


select into 'nl:'
from clinical_event ce
PLAN ce
  WHERE ce.person_id = $PERSONID
  AND ce.encntr_id +0 = $ENCNTRID
  AND ce.event_cd in (MEDICALDEVICESIMPLANTS_72_CV,
						MEDICALDEVICEREPINFO_72_CV,
						PROSTHESIS_72_CV)
  AND ce.event_end_dt_tm < CNVTDATETIME(curdate,curtime3)
  AND ce.valid_until_dt_tm > sysdate
  and ce.valid_from_dt_tm < sysdate
  AND NOT ce.result_status_cd IN (INERROR_8_CV ,INERROR2_8_CV, NOTDONE_8_CV)
	and not exists(select ce_tmp.clinical_event_id
  				from clinical_event ce_tmp
  				where ce_tmp.person_id = $PERSONID
  				and ce_tmp.encntr_id +0 = $ENCNTRID
  				and ce_tmp.event_cd = ce.event_cd
  				and ce_tmp.valid_from_dt_tm < sysdate
  				and ce_tmp.valid_until_dt_tm > sysdate
  				and ce_tmp.event_end_dt_tm < sysdate
  				and not ce_tmp.result_status_cd in (INERROR_8_CV ,INERROR2_8_CV, NOTDONE_8_CV)
  				and ce_tmp.event_end_dt_tm > ce.event_end_dt_tm)

head report
	if ( txhx_ind or ahx_ind )
		txhx_ind = 0
		ahx_ind = 0
		cnt = history->admissiondb.rec_cnt + 1
		stat = alterlist(history->admissiondb.hx, cnt)
		history->admissiondb.rec_cnt = cnt
		history->admissiondb.hx[cnt].is_full_row = 1
		history->admissiondb.hx[cnt].description =  concat("<b>Other Information</b>")
	endif

detail
	cnt = history->admissiondb.rec_cnt + 1
	history->admissiondb.rec_cnt = cnt
	stat = alterlist(history->admissiondb.hx, cnt)
	history->admissiondb.hx[cnt].is_full_row = 0
	history->admissiondb.hx[cnt].description = uar_get_code_display(ce.event_cd)
	history->admissiondb.hx[cnt].value = ce.result_val
with nocounter

select into 'nl:'
from encounter e,
	procedure p,
	nomenclature n
plan e
	where e.person_id = $PERSONID
join p
	where p.encntr_id = e.encntr_id
	and p.active_ind = 1
	and p.beg_effective_dt_tm < sysdate
	and p.end_effective_dt_tm > sysdate
join n
	where n.nomenclature_id = outerjoin(p.nomenclature_id)
order by p.proc_dt_tm desc
head p.procedure_id
	cnt = history->surg_hx[1].actual_surg_cnt + 1
	history->surg_hx[1].actual_surg_cnt = cnt
	stat = alterlist(history->surg_hx[1].SURG_LIST, cnt)
	history->surg_hx[1].SURG_LIST[cnt].surg_cnt = 1
	history->surg_hx[1].SURG_LIST[cnt].surg_type = ""
	stat = alterlist(history->surg_hx[1].SURG_LIST[cnt].SURGERY, 1)
	;kls mod 2
	case (p.proc_dt_tm_prec_flag)
		of 0: history->surg_hx[1].SURG_LIST[cnt].SURGERY[1].surg_dt = format(p.proc_dt_tm, "mm/dd/yyyy;;q")
		of 1: history->surg_hx[1].SURG_LIST[cnt].SURGERY[1].surg_dt = format(p.proc_dt_tm, "mm/dd/yyyy;;q")
		of 2: history->surg_hx[1].SURG_LIST[cnt].SURGERY[1].surg_dt = format(p.proc_dt_tm, "mm/yyyy;;q")
		of 3: history->surg_hx[1].SURG_LIST[cnt].SURGERY[1].surg_dt = format(p.proc_dt_tm, "yyyy;;q")
	endcase
	if (n.nomenclature_id > 0.0)
		history->surg_hx[1].SURG_LIST[cnt].SURGERY[1].surg_name = n.source_string
	else
		history->surg_hx[1].SURG_LIST[cnt].SURGERY[1].surg_name = p.procedure_note
	endif
with nocounter


call echorecord(history)
call echojson(history, $OUTDEV)

#exit_prg
end
go
