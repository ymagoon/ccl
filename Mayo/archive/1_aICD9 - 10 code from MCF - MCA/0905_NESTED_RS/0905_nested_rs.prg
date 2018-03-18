drop program 0905_NESTED_RS go
create program 0905_NESTED_RS
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
with OUTDEV
 
/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
declare RECREATIONALDRUGUSE_VAR = f8 with Constant(uar_get_code_by("DISPLAYKEY",72,"RECREATIONALDRUGUSE")),protect
declare URINARYELIMINATION_VAR = f8 with Constant(uar_get_code_by("DISPLAYKEY",72,"URINARYELIMINATION")),protect
 
 
;****************************************************************
;****************
;****************
;**************** ADDED THE LIST PROBLEM POSITION VARIABLES on 10/11/2013
;**************** ADDED LIST OF DIAGNOSIS VARIABLES on 10/10/2013
;**************** ADDED THE SCORES TO THE RECORD STRUCTURE on 10/10/2013
;**************** ADDED THE DIAGNOSIS LOGIC TO THE ROUTINE on 10/10/2013
 
 
 
 
/**************************************************************
; This record structure sotre the list of RCM codeset
**************************************************************/
 
record SNOMED_RS(
		1 list[*]
			2 Desc_value =  c60; Pulling from Description
			2 disp_value = c60 ; pulling from Display
			2 Meaning_value = c60 ; pulling from cdf_meaning
			;History of  Diabetes Mellitus ,Myocardial Infarction, Cerebral Vascular Accident, Peripheral Vascular Disease =  +1 each
			2 MYO_value = c60 ;+1
			2 DIB_value = c60 ;+1
			2 CVA_value = c60 ;+1
			2 PVD_value = c60 ; +1
			;History of  Congestive Heart Failure, Chronic Obstructive Pulmonary Disease, substance abuse or depression = +2 each
			2 CHF_value = c60  ; +2
			2 COPD_value =c60  ; +2
			2 SA_value =c60    ; +2
			2 dep_value = c60  ; +2
			; History of cancer, general cancer = +1
			2 HCGC_value = c60  ; +2
			;History of End Stage Liver Disease, Human Immunodeficiency Virus = +4 each
			2 ESDL_value =c60  ; +4
			2 HIV_value =c60  ; +4
			;History of Metastatic cancer, active hematologic cancers = +6
			2 MCHC_value =c60  ; +6
 			2 DIAL_value = c60  ; +3
 
 
 
)
 
 
 
 
declare INACTIVE_VAR = f8 with Constant(uar_get_code_by("MEANING",12030,"INACTIVE")),protect
declare CANCELED_VAR = f8 with Constant(uar_get_code_by("MEANING",12030,"CANCELED")),protect
declare RESOLVED_VAR = f8 with Constant(uar_get_code_by("MEANING",12030,"RESOLVED")),protect
declare ACTIVE_VAR = f8 with Constant(uar_get_code_by("MEANING",12030,"ACTIVE")),protect
;Declare DM1_VAR = c60 with constant ("DM1"), protect
declare num = i4
 
declare SNOMED_CS_var = f8 with Constant(104510),protect
 
;Declare Perid_var = f8
;Set Perid_var = Trigger_personid
 
 
 
 
 
declare pos = i4
set pos = -1
 
declare posx = i4
set posx = -1
 
declare posy = i4
set posy = -1
 
declare posz = i4
set posz = -1
 
declare posdiag =i4
set posdiag = -1
 
 
declare posdiagx =i4
set posdiagx = -1
 
declare posdiagy =i4
set posdiagy = -1
 
declare posdiagz =i4
set posdiagz = -1
 
; Adding  variables on 10/10/2013
 ;*********Variable Declarations for DIAGNOSIS**********
declare posdiag5 = i4
set posdiag5 = -1
declare posdiag6 = i4
set posdiag6 = -1
declare posdiag7 = i4
set posdiag7 = -1
declare posdiag8 = i4
set posdiag8 = -1
declare posdiag9 = i4
set posdiag9 = -1
declare posdiag10 = i4
set posdiag10 = -1
declare posdiag11 = i4
set posdiag11 = -1
declare posdiag12 = i4
set posdiag12 = -1
 
; Adding Dialysis variable on 10/21/2013
declare posdiag13 =i4
set posdiag13 =-1
 
 
 
; End of Diagnosis Variables on 10/10/2013
 
; Adding variables on 10/10/2013
;**************** Variables declarations for problems positions ****************
declare pos5 = i4
set pos5 = -1
declare pos6 = i4
set pos6 = -1
declare pos7 = i4
set pos7 = -1
declare pos8 = i4
set pos8 = -1
declare pos9 = i4
set pos9 = -1
declare pos10 = i4
set pos10 = -1
declare pos11 = i4
set pos11 = -1
declare pos12 = i4
set pos12 = -1
 
; Adding Dialysis variable on 10/21/2013
declare pos13 =i4
set pos13 =-1
 
 
 
 
 
 
 
					SELECT INTO "NL:"
	CV1.DESCRIPTION
	, CV1.DISPLAY
	, CV1.DISPLAY_KEY
	, ABR_DISPLAY = substring(1,3,CV1.display)
	, ABR2_DISPLAY = Trim(substring(1,5,cv1.display))
 
FROM
	CODE_VALUE   CV1
 
WHERE CV1.CODE_SET = 104512; Snomed_cs_var
					AND CV1.ACTIVE_IND = 1
 
HEAD REPORT
						cnt = 0
					DETAIL
						cnt = cnt + 1
						if(mod(cnt,10) = 1)
							; Allocate space in memory
							stat = alterlist(SNOMED_RS->list,cnt+9)
 
						endif
	;History of  Diabetes Mellitus ,Myocardial Infarction, Cerebral Vascular Accident, Peripheral Vascular Disease
						if (CV1.description ="MYO")
							;if (CV1.cdf_meaning = "ICD9")
						SNOMED_RS->list[cnt].Desc_value = cv1.description
						SNOMED_RS->list[cnt].MYO_value  = cv1.display
						SNOMED_RS->list[cnt].disp_value =cv1.display
 
 
						elseif
						 (CV1.description ="DIAB")
						 SNOMED_RS->list[cnt].Desc_value = cv1.description
						 SNOMED_RS->list[cnt].DIB_value = cv1.display
 
						elseif
						 (CV1.description ="CVA")
						 SNOMED_RS->list[cnt].Desc_value = cv1.description
						 SNOMED_RS->list[cnt].CVA_value = cv1.display
 
						 elseif
						 (CV1.description ="PVD")
						 SNOMED_RS->list[cnt].Desc_value = cv1.description
						 SNOMED_RS->list[cnt].PVD_value = cv1.display
 
						;SNOMED_RS->list[cnt].disp_value = ABR_DISPLAY;cv1.display
						;SNOMED_RS->list[cnt].Meaning_value = CV1.cdf_meaning
  	;History of  Congestive Heart Failure, Chronic Obstructive Pulmonary Disease, substance abuse or depression = +2 each
 
						elseif
						 (CV1.description ="CHF")
						 SNOMED_RS->list[cnt].Desc_value = cv1.description
						 SNOMED_RS->list[cnt].CHF_value  = cv1.display
 
						elseif
						 (CV1.description ="COPD")
						 SNOMED_RS->list[cnt].Desc_value = cv1.description
						 SNOMED_RS->list[cnt].COPD_value = cv1.display
 
						 elseif
						 (CV1.description ="SA")
						 SNOMED_RS->list[cnt].Desc_value = cv1.description
						 SNOMED_RS->list[cnt].SA_value = cv1.display
 
						 elseif
						 (CV1.description ="DEP")
						 SNOMED_RS->list[cnt].Desc_value = cv1.description
						 SNOMED_RS->list[cnt].dep_value = cv1.display
 
	;History of cancer, general cancer = +1
 
							elseif
						 (CV1.description ="HCGC")
						 SNOMED_RS->list[cnt].Desc_value = cv1.description
						 SNOMED_RS->list[cnt].HCGC_value  = cv1.display
    ;History of End Stage Liver Disease, Human Immunodeficiency Virus = +4 each
 
						elseif
						 (CV1.description ="ESDL")
						 SNOMED_RS->list[cnt].Desc_value = cv1.description
						 SNOMED_RS->list[cnt].ESDL_value = cv1.display
 
						 elseif
						 (CV1.description ="HIV")
						 SNOMED_RS->list[cnt].Desc_value = cv1.description
						 SNOMED_RS->list[cnt].HIV_value = cv1.display
	; History of Metastatic cancer, active hematologic cancers = +6
 
						 elseif
						 (CV1.description ="MCHC")
						 SNOMED_RS->list[cnt].Desc_value = cv1.description
						 SNOMED_RS->list[cnt].MCHC_value = cv1.display
 
 	; Adding Dialysis on 10/21/2013
 						elseif
						 (CV1.description ="Dialysis")
						 SNOMED_RS->list[cnt].Desc_value = cv1.description
						 SNOMED_RS->list[cnt].DIAL_value = cv1.display
 
 
 
 
 
						Endif
 
 
					FOOT REPORT
						; Release any unused portions of memory
						stat = alterlist(SNOMED_RS->list,cnt)
 
WITH NOCOUNTER, SEPARATOR=" ", FORMAT
 
						call echorecord(SNOMED_RS, "RKK_NESTED_RS")
 
 
 
 
 
 
 
 
 ;********************************************************
;*******************************************************
free set MESSAGE
	record MESSAGE
		(
		1 GRAND_TTL = i4
		1 TTL_SCORE = i4
 
	;*********************************
		; HISTORY OF DIAGNOSIS AND PROBLEMS
	;*********************************
		;1 list[*]
			1 SCORE_ONE =i4 ;   MYO_SCORE
 			1 SCORE_TWO=i4 ; Diabetes_Score
			1 SCORE_THREE=i4 ; CEREBRAL_SCORE
 			1 SCORE_FOUR=i4 ; PERIPHERAL VASCULAR_SCORE
 			; adding Score list on 10/10/2013
 			1 SCORE_FIVE=i4
 			1 SCORE_SIX=i4
 			1 SCORE_SEVEN=i4
 			1 SCORE_EIGHT=i4
 			1 SCORE_NINE=i4
 			1 SCORE_TEN=i4
 			1 SCORE_ELEVEN=i4
 			1 SCORE_TWELVE=i4
 			; Adding Score 13 for  Dialysis
 			1 SCORE_THIRTEEN=i4
 
 			)
 
;********************************************************
;********************************************************
 
 
 
 
 ;*********************************************************************
;**  START Subroutines
;*********************************************************************
 
 
/********************************************************************/
;Set Log_misc1 to the value of the MESSAGE->SCORE
/********************************************************************/
/*
SET LOG_MISC1 = CnvtString(3251)
SET LOG_MESSAGE = build($1," : ",LOG_MISC1)
SET RETVAL = 100
 */
 
 ; uncomenting  10/11/2013
 
 
SET LOG_MISC1 = CnvtString(MESSAGE->TTL_SCORE)
SET LOG_MESSAGE = build("HxDiagProb:", LOG_MISC1)
SET RETVAL =100
 
 
 
 ;**********************************************************************************************************
 ;**********************************************************************************************************
 
 
 
;set LOG_MESSAGE = concat(LOG_MESSAGE,"|",cnvtstring(trigger_personid))
 
 
; PROBLEM ROUTINE
 SELECT INTO "NL:"
	P.NOMENCLATURE_ID
	, P.PROBLEM_ID
	, N.SOURCE_IDENTIFIER
	, N.SOURCE_STRING
	, N.STRING_IDENTIFIER
	, SRC_ID_ABBREV = substring(1,3,n.source_identifier)
	, N_SOURCE_VOCABULARY_DISP = UAR_GET_CODE_DISPLAY(N.SOURCE_VOCABULARY_CD)
	, P_LIFE_CYCLE_STATUS_DISP = UAR_GET_CODE_DISPLAY(P.LIFE_CYCLE_STATUS_CD)
	, P.ACTIVE_IND
	, N.SHORT_STRING
 
FROM
	PROBLEM   P
	, NOMENCLATURE   N
 
PLAN P
					WHERE P.person_id = trigger_personid; 12613457;Trigger_personid ;12613457
					AND P.active_ind =1
					AND P.LIFE_CYCLE_STATUS_CD in (ACTIVE_VAR);(INACTIVE_VAR, ACTIVE_VAR, CANCELED_VAR)
			JOIN N
 
					WHERE N.NOMENCLATURE_ID = P.NOMENCLATURE_ID
					;kang-AND N.SOURCE_VOCABULARY_CD  =  1231.00
					AND N.active_ind = 1
 
DETAIL
 
	/*count1 = count1 +1
  	*/
  	if(pos <= 0 )
  		pos=(locateval(num,1,size(snomed_RS->list,5),n.source_identifier ,Snomed_RS->list[num].MYO_value  ))
 
  		;call echo(concat("testing1 - ",cnvtstring(LOG_MISC1)))
 
	  	IF (pos > 0)
 
	  		;LOG_MISC1 =cnvtstring(202)
	  		retval =100
	  		;LOG_MESSAGE = LOG_MISC1
	  		MESSAGE->SCORE_ONE = 1
	  		;call echo(concat(LOG_MESSAGE,"|testing2 - ",cnvtstring(LOG_MISC1)))
	  		;GO TO END_LOOP
 
			;SET BREAK REPORT
	  	ELSE
 
	  		;LOG_MISC1 = cnvtstring(103)
	  		;call echo(concat("testing3 - ",cnvtstring(LOG_MISC1)))
	  		;retval = -1
	  		;LOG_MESSAGE = LOG_MISC1
	  		MESSAGE->SCORE_ONE = 0
	  		;RETVAL = 100
 
	  	ENDIF
	  	;call echo(concat("testing4 - ",cnvtstring(LOG_MISC1)))
 
  	endif
 
 ;********************************************************************************************
 ;********************************************************************************************
 
 	if(posx <= 0 )
  		posx=(locateval(num,1,size(snomed_RS->list,5),n.source_identifier ,Snomed_RS->list[num].DIB_value  ))
 
 
	  	IF (posx > 0)
 
	  		retval =100
 
	  		MESSAGE->SCORE_TWO = 1
 
	  	ELSE
 
	  		MESSAGE->SCORE_TWO = 0
 
 
	  	ENDIF
 
  	endif
 
 
 ;***************************************************************************************************
 
  ;********************************************************************************************
 ;********************************************************************************************
 
 	if(posy <= 0 )
  		posy=(locateval(num,1,size(snomed_RS->list,5),n.source_identifier ,Snomed_RS->list[num].CVA_value  ))
 
 
	  	IF (posy > 0)
 
	  		retval =100
 
	  		MESSAGE->SCORE_THREE = 1
 
	  	ELSE
 
	  		MESSAGE->SCORE_THREE = 0
 
 
	  	ENDIF
 
  	endif
 
 
 ;***************************************************************************************************
  ;********************************************************************************************
 
 	if(posz <= 0 )
  		posz=(locateval(num,1,size(snomed_RS->list,5),n.source_identifier ,Snomed_RS->list[num].PVD_value  ))
 
 
	  	IF (posz > 0)
 
	  		retval =100
 
	  		MESSAGE->SCORE_FOUR = 1
 
	  	ELSE
 
	  		MESSAGE->SCORE_FOUR = 0
 
 
	  	ENDIF
 
  	endif
 
 
 ;***************************************************************************************************
 ; added on 10/11/2013
 
 ; ADDING TO PROBLEMS
;********************************************************************************************
  	if(pos5 <= 0 )
  		pos5=(locateval(num,1,size(snomed_RS->list,5),n.source_identifier ,Snomed_RS->list[num].CHF_value  ))
 	  	IF (pos5 > 0)
   		retval =100
   		MESSAGE->SCORE_FIVE = 2
 	  	ELSE
   		MESSAGE->SCORE_FIVE = 0
 	  	ENDIF
   	endif
 
 
 ;***************************************************************************************************
;********************************************************************************************
  	if(pos6 <= 0 )
  		pos6=(locateval(num,1,size(snomed_RS->list,5),n.source_identifier ,Snomed_RS->list[num].COPD_value  ))
 	  	IF (pos6 > 0)
   		retval =100
   		MESSAGE->SCORE_SIX = 2
 	  	ELSE
   		MESSAGE->SCORE_SIX = 0
 	  	ENDIF
   	endif
 
 
 ;***************************************************************************************************
;********************************************************************************************
  	if(pos7 <= 0 )
  		pos7=(locateval(num,1,size(snomed_RS->list,5),n.source_identifier ,Snomed_RS->list[num].SA_value  ))
 	  	IF (pos7 > 0)
   		retval =100
   		MESSAGE->SCORE_SEVEN = 2
 	  	ELSE
   		MESSAGE->SCORE_SEVEN = 0
 	  	ENDIF
   	endif
 
 
 ;***************************************************************************************************
;********************************************************************************************
  	if(pos8 <= 0 )
  		pos8=(locateval(num,1,size(snomed_RS->list,5),n.source_identifier ,Snomed_RS->list[num].dep_value  ))
 	  	IF (pos8 > 0)
   		retval =100
   		MESSAGE->SCORE_EIGHT = 2
 	  	ELSE
   		MESSAGE->SCORE_EIGHT = 0
 	  	ENDIF
   	endif
 
 
 ;***************************************************************************************************
;********************************************************************************************
  	if(pos9 <= 0 )
  		pos9=(locateval(num,1,size(snomed_RS->list,5),n.source_identifier ,Snomed_RS->list[num].HCGC_value  ))
 	  	IF (pos9 > 0)
   		retval =100
   		MESSAGE->SCORE_NINE = 1
 	  	ELSE
   		MESSAGE->SCORE_NINE = 0
 	  	ENDIF
   	endif
 
 
 ;***************************************************************************************************
;********************************************************************************************
  	if(pos10 <= 0 )
  		pos10=(locateval(num,1,size(snomed_RS->list,5),n.source_identifier ,Snomed_RS->list[num].ESDL_value  ))
 	  	IF (pos10 > 0)
   		retval =100
   		MESSAGE->SCORE_TEN = 4
 	  	ELSE
   		MESSAGE->SCORE_TEN = 0
 	  	ENDIF
   	endif
 
 
 ;***************************************************************************************************
;********************************************************************************************
  	if(pos11 <= 0 )
  		pos11=(locateval(num,1,size(snomed_RS->list,5),n.source_identifier ,Snomed_RS->list[num].HIV_value  ))
 	  	IF (pos11 > 0)
   		retval =100
   		MESSAGE->SCORE_ELEVEN = 4
 	  	ELSE
   		MESSAGE->SCORE_ELEVEN = 0
 	  	ENDIF
   	endif
 
 
 ;***************************************************************************************************
;********************************************************************************************
  	if(pos12 <= 0 )
  		pos12=(locateval(num,1,size(snomed_RS->list,5),n.source_identifier ,Snomed_RS->list[num].MCHC_value  ))
 	  	IF (pos12 > 0)
   		retval =100
   		MESSAGE->SCORE_TWELVE = 6
 	  	ELSE
   		MESSAGE->SCORE_TWELVE = 0
 	  	ENDIF
   	endif
 
 
 ;***************************************************************************************************
  ;********************************************************************************************
  	if(pos13 <= 0 )
  		pos13=(locateval(num,1,size(snomed_RS->list,5),n.source_identifier ,Snomed_RS->list[num].DIAL_value  ))
 	  	IF (pos13 > 0)
   		retval =100
   		MESSAGE->SCORE_THIRTEEN = 3
 	  	ELSE
   		MESSAGE->SCORE_THIRTEEN = 0
 	  	ENDIF
   	endif
 
 
 ;***************************************************************************************************
 
 
 
 
 
 
retval = 100
 
 
 
 
MESSAGE->TTL_SCORE = MESSAGE->SCORE_ONE +MESSAGE->SCORE_TWO +MESSAGE->SCORE_THREE+MESSAGE->SCORE_FOUR + MESSAGE->SCORE_FIVE+
MESSAGE->SCORE_SIX+ MESSAGE->SCORE_SEVEN + MESSAGE->SCORE_EIGHT + MESSAGE->SCORE_NINE + MESSAGE->SCORE_TEN + MESSAGE->SCORE_ELEVEN
+ MESSAGE->SCORE_TWELVE + MESSAGE->SCORE_THIRTEEN
 
LOG_MISC1 = cnvtstring(MESSAGE->TTL_SCORE)
LOG_MESSAGE = LOG_MISC1
 
WITH NOCOUNTER, SEPARATOR=" ", FORMAT
 
 
; Start  Diagnosis Search
 
						SELECT INTO "nl:"
							DI.ACTIVE_IND
							, DI.DIAGNOSIS_DISPLAY
							, DI.PERSON_ID
							, DI.ENCNTR_ID
							, DI.NOMENCLATURE_ID
							, N.STRING_IDENTIFIER
							, N.SHORT_STRING
							, N.NOMENCLATURE_ID
							, N.SOURCE_STRING
							, N.SOURCE_IDENTIFIER
							, SRC_ID_ABBREV = substring(1,3,n.source_identifier)
							, N_SOURCE_VOCABULARY_DISP = UAR_GET_CODE_DISPLAY(N.SOURCE_VOCABULARY_CD)
							, N.ACTIVE_IND
							, N_ACTIVE_STATUS_DISP = UAR_GET_CODE_DISPLAY(N.ACTIVE_STATUS_CD)
 
						FROM
							DIAGNOSIS   DI
							, NOMENCLATURE   N
 
						PLAN DI
						;WHERE Di.person_id = Trigger_personid
						WHERE DI.encntr_id = Trigger_encntrid
						AND  DI.ACTIVE_IND = 1
						JOIN N WHERE DI.NOMENCLATURE_ID = N.NOMENCLATURE_ID
						;AND N.SOURCE_VOCABULARY_CD  =        1231.00
						AND N.active_ind = 1
 
						DETAIL
									if(MESSAGE->SCORE_ONE < 1 )
								  		posdiag=(locateval(num,1,size(snomed_RS->list,5),n.source_identifier ,Snomed_RS->list[num].MYO_value  ))
 
 
									  	IF (posdiag > 0)
 
									  		retval =100
 
									  		MESSAGE->SCORE_ONE = 1
 
									  	ELSE
 
									  		MESSAGE->SCORE_ONE = 0
									  		;RETVAL = 100
 
									  	ENDIF
 
								  	endif
 
								if(MESSAGE->SCORE_TWO < 1 )
							  		posdiagx=(locateval(num,1,size(snomed_RS->list,5),n.source_identifier ,Snomed_RS->list[num].DIB_value  ))
 
 
								  	IF (posdiagx > 0)
 
								  		retval =100
 
								  		MESSAGE->SCORE_TWO = 1
 
								  	ELSE
 
								  		MESSAGE->SCORE_TWO = 0
 
 
								  	ENDIF
 
							  	endif
 
 
							 ;***************************************************************************************************
 
							  ;********************************************************************************************
							 ;********************************************************************************************
 
							 	if(MESSAGE->SCORE_THREE < 1 )
 
							  		posdiagy=(locateval(num,1,size(snomed_RS->list,5),n.source_identifier ,Snomed_RS->list[num].CVA_value  ))
 
 
								  	IF (posdiagy > 0)
 
								  		retval =100
 
								  		MESSAGE->SCORE_THREE = 1
 
								  	ELSE
 
								  		MESSAGE->SCORE_THREE = 0
 
 
								  	ENDIF
 
							  	endif
 
 
							 ;***************************************************************************************************
							  ;********************************************************************************************
 
							 	if(MESSAGE->SCORE_FOUR < 1 )
							  		posdiagz=(locateval(num,1,size(snomed_RS->list,5),n.source_identifier ,Snomed_RS->list[num].PVD_value  ))
 
 
								  	IF (posdiagz > 0)
 
								  		retval =100
 
								  		MESSAGE->SCORE_FOUR = 1
 
								  	ELSE
 
								  		MESSAGE->SCORE_FOUR = 0
 
 
								  	ENDIF
 
							  	endif
 
 
;****************************************************************************************
; ADD THIS TO THE DIAGNOSIS SECTION
;****************************************************************************************
if(MESSAGE->SCORE_FIVE < 1 )
posdiag5=(locateval(num,1,size(snomed_RS->list,5),n.source_identifier ,Snomed_RS->list[num].CHF_value  ))
IF (posdiag5 > 0)
retval =100
MESSAGE->SCORE_FIVE = 2
ELSE
MESSAGE->SCORE_FIVE =  0
  ENDIF
Endif
 
 
;******************************************************************************************
if(MESSAGE->SCORE_SIX < 1 )
posdiag6=(locateval(num,1,size(snomed_RS->list,5),n.source_identifier ,Snomed_RS->list[num].COPD_value  ))
IF (posdiag6 > 0)
retval =100
MESSAGE->SCORE_SIX = 2
ELSE
MESSAGE->SCORE_SIX =  0
  ENDIF
Endif
;******************************************************************************************
if(MESSAGE->SCORE_SEVEN < 1 )
posdiag7=(locateval(num,1,size(snomed_RS->list,5),n.source_identifier ,Snomed_RS->list[num].SA_value  ))
IF (posdiag7 > 0)
retval =100
MESSAGE->SCORE_SEVEN = 2
ELSE
MESSAGE->SCORE_SEVEN =  0
  ENDIF
Endif
;******************************************************************************************
if(MESSAGE->SCORE_EIGHT < 1 )
posdiag8=(locateval(num,1,size(snomed_RS->list,5),n.source_identifier ,Snomed_RS->list[num].dep_value  ))
IF (posdiag8 > 0)
retval =100
MESSAGE->SCORE_EIGHT = 2
ELSE
MESSAGE->SCORE_EIGHT =  0
  ENDIF
Endif
;******************************************************************************************
if(MESSAGE->SCORE_NINE < 1 )
posdiag9=(locateval(num,1,size(snomed_RS->list,5),n.source_identifier ,Snomed_RS->list[num].HCGC_value  ))
IF (posdiag9 > 0)
retval =100
MESSAGE->SCORE_NINE = 1
ELSE
MESSAGE->SCORE_NINE =  0
  ENDIF
Endif
;******************************************************************************************
if(MESSAGE->SCORE_TEN < 1 )
posdiag10=(locateval(num,1,size(snomed_RS->list,5),n.source_identifier ,Snomed_RS->list[num].ESDL_value  ))
IF (posdiag10 > 0)
retval =100
MESSAGE->SCORE_TEN = 4
ELSE
MESSAGE->SCORE_TEN =  0
  ENDIF
Endif
;******************************************************************************************
if(MESSAGE->SCORE_ELEVEN < 1 )
posdiag11=(locateval(num,1,size(snomed_RS->list,5),n.source_identifier ,Snomed_RS->list[num].HIV_value  ))
IF (posdiag11 > 0)
retval =100
MESSAGE->SCORE_ELEVEN = 4
ELSE
MESSAGE->SCORE_ELEVEN =  0
  ENDIF
Endif
;******************************************************************************************
if(MESSAGE->SCORE_TWELVE < 1 )
posdiag12=(locateval(num,1,size(snomed_RS->list,5),n.source_identifier ,Snomed_RS->list[num].MCHC_value  ))
IF (posdiag12 > 0)
retval =100
MESSAGE->SCORE_TWELVE = 6
ELSE
MESSAGE->SCORE_TWELVE=  0
  ENDIF
Endif
;******************************************************************************************
;******************************************************************************************
if(MESSAGE->SCORE_THIRTEEN < 1 )
posdiag13=(locateval(num,1,size(snomed_RS->list,5),n.source_identifier ,Snomed_RS->list[num].DIAL_value  ))
IF (posdiag13 > 0)
retval =100
MESSAGE->SCORE_THIRTEEN = 3
ELSE
MESSAGE->SCORE_THIRTEEN=  0
  ENDIF
Endif
;******************************************************************************************
 
 
 
 
 
 
 
retval =100
 
MESSAGE->TTL_SCORE = MESSAGE->SCORE_ONE + MESSAGE->SCORE_TWO+ Message->SCORE_THREE + Message->SCORE_FOUR +MESSAGE->SCORE_FIVE+
MESSAGE->SCORE_SIX+ MESSAGE->SCORE_SEVEN + MESSAGE->SCORE_EIGHT + MESSAGE->SCORE_NINE + MESSAGE->SCORE_TEN + MESSAGE->SCORE_ELEVEN
+ MESSAGE->SCORE_TWELVE+ MESSAGE->SCORE_THIRTEEN
 
LOG_MISC1 = cnvtstring(MESSAGE->TTL_SCORE)
LOG_MESSAGE = LOG_MISC1
 
WITH NOCOUNTER, SEPARATOR=" ", FORMAT
 
 
 
 ; adding code to account for Dialysis Clinical Event 10/23/2013
 
 SELECT INTO "nl:"
	C_EVENT_DISP = UAR_GET_CODE_DISPLAY(C.EVENT_CD)
	, C.RESULT_VAL
	, C.ENCNTR_ID
	, C.CLINSIG_UPDT_DT_TM
	, C.VALID_UNTIL_DT_TM "@SHORTDATETIME"
 
FROM
	CLINICAL_EVENT   C
 
PLAN C
WHERE C.person_id = Trigger_personid
AND C.ENCNTR_ID =  Trigger_encntrid
AND  C.RESULT_STATUS_CD in (25.00,34.00,35.00)
 
AND C.EVENT_CD in (URINARYELIMINATION_VAR)
 
					 ;in (1682507.00,    1682510.00)
 
;AND C.VALID_UNTIL_DT_TM = CNVTDATETIME(31-DEC-2100, 0)
AND C.CLINSIG_UPDT_DT_TM >= CNVTLOOKBEHIND("15, D") ; within 15 days
 
DETAIL
IF(MESSAGE->SCORE_THIRTEEN = 0 )
 
	if (C.result_val= "Anuric Dialysis")   ;  lives in  OT Inital Evaluation and Physical Therapy Initial eval powerforms.
 
 
 
MESSAGE->SCORE_THIRTEEN = 3
Else
MESSAGE->SCORE_THIRTEEN= 0
ENDIF
 Endif
retval =100
 
MESSAGE->TTL_SCORE = MESSAGE->SCORE_ONE + MESSAGE->SCORE_TWO+ Message->SCORE_THREE + Message->SCORE_FOUR +MESSAGE->SCORE_FIVE+
MESSAGE->SCORE_SIX+ MESSAGE->SCORE_SEVEN + MESSAGE->SCORE_EIGHT + MESSAGE->SCORE_NINE + MESSAGE->SCORE_TEN + MESSAGE->SCORE_ELEVEN
+ MESSAGE->SCORE_TWELVE+ MESSAGE->SCORE_THIRTEEN
 
LOG_MISC1 = cnvtstring(MESSAGE->TTL_SCORE)
LOG_MESSAGE = LOG_MISC1
 
WITH NOCOUNTER, SEPARATOR=" ", FORMAT
 
; Adding code to account for Substance abuse 10/23/2013
 
 SELECT INTO "nl:"
	C_EVENT_DISP = UAR_GET_CODE_DISPLAY(C.EVENT_CD)
	, C.RESULT_VAL
	, C.ENCNTR_ID
	, C.CLINSIG_UPDT_DT_TM
	, C.VALID_UNTIL_DT_TM "@SHORTDATETIME"
 
FROM
	CLINICAL_EVENT   C
 
PLAN C
WHERE C.person_id = Trigger_personid
AND C.ENCNTR_ID =  Trigger_encntrid
AND  C.RESULT_STATUS_CD in (25.00,34.00,35.00)
 
AND C.EVENT_CD in (RECREATIONALDRUGUSE_VAR)
 
					 ;in (1682507.00,    1682510.00)
 
;AND C.VALID_UNTIL_DT_TM = CNVTDATETIME(31-DEC-2100, 0)
AND C.CLINSIG_UPDT_DT_TM >= CNVTLOOKBEHIND("15, D") ; within 15 days
 
DETAIL
IF(MESSAGE->SCORE_SEVEN = 0 )
 
	if (C.result_val= "Current"
	Or C.RESULT_VAL  = "Past")   ; Lives under Adult Admission History, Recreational Drug Use, Drug Use.
 
 
 
MESSAGE->SCORE_SEVEN = 2
Else
MESSAGE->SCORE_SEVEN= 0
ENDIF
 Endif
retval =100
 
MESSAGE->TTL_SCORE = MESSAGE->SCORE_ONE + MESSAGE->SCORE_TWO+ Message->SCORE_THREE + Message->SCORE_FOUR +MESSAGE->SCORE_FIVE+
MESSAGE->SCORE_SIX+ MESSAGE->SCORE_SEVEN + MESSAGE->SCORE_EIGHT + MESSAGE->SCORE_NINE + MESSAGE->SCORE_TEN + MESSAGE->SCORE_ELEVEN
+ MESSAGE->SCORE_TWELVE+ MESSAGE->SCORE_THIRTEEN
 
LOG_MISC1 = cnvtstring(MESSAGE->TTL_SCORE)
LOG_MESSAGE = LOG_MISC1
 
WITH NOCOUNTER, SEPARATOR=" ", FORMAT
 
 
 
 
 
 
 
 
 
 
 
 
 
call echorecord(Snomed_RS, "RKK_RECORDRESULTS")
CALL ECHORECORD(MESSAGE)
 
 
end
go
 
;SET TRACE RDBDEBUG GO
;SET TRACE RDBBIND GO
;0905_nested_rs "nl:" go
 
