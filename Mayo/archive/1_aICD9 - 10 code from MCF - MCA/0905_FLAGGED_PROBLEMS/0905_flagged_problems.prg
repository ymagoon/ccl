 
drop program 0905_Flagged_problems go
create program 0905_Flagged_problems
 
;***************************************************************
;***************************************************************
;****** RULE: CDS_OUTSIDE_SPE_POOL******************************
;****** PURPOSE: To check for Flagged Problems and send inbox message
;****** CALL will look for all ICD-9, MULTUM, PNED, and ALLERGY
;****** THAT DO NOT HAVE A MCPL tied to them
;***************************************************************
;***************************************************************
;***************************************************************
 
 
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
 	,"Person Id" = 0.0 ; Parameter will be sent from Rule
 
 
 
with OUTDEV , perid
 
 
IF(VALIDATE(RETVAL, -1) = -1 AND VALIDATE(RETVAL, 0) = 0)
  DECLARE RETVAL = I4
  DECLARE LOG_MESSAGE = VC
  DECLARE LOG_MISC1 = VC
ENDIF
 
 
 
/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
declare ACTIVE_VAR = f8 with Constant(uar_get_code_by("DISPLAYKEY",12030,"ACTIVE")),protect
declare MEDICAL_VAR = f8 with Constant(uar_get_code_by("DISPLAYKEY",12033,"MEDICAL")),protect
;declare ACTIVE_VAR = f8 with Constant(uar_get_code_by("MEANING",1230,"ACTIVE")),protect
declare MULTUM_VAR = f8 with Constant(uar_get_code_by("MEANING",400,"MULTUM")),protect
declare ALLERGY_VAR = f8 with Constant(uar_get_code_by("MEANING",400,"ALLERGY")),protect
declare SNMCT_VAR = f8 with Constant(uar_get_code_by("MEANING",400,"SNMCT")),protect
declare PNED_VAR = f8 with Constant(uar_get_code_by("MEANING",400,"PNED")),protect
declare ICD9_VAR = f8 with Constant(uar_get_code_by("MEANING",400,"ICD9")),protect
declare cnt = i4
 
set cnt =0
;set  LOG_MISC1 ="XYZ"
;set log_misc1 =concat(trim(Src_str_trc),",",log_misc1)
Set Log_message= concat(Build("TOP NO flagged Problems: ", cnt))
 
set   retval =100
 
 
 
SELECT INTO $OUTDEV
	P.NOMENCLATURE_ID
	, P.PROBLEM_ID
;	, N.SOURCE_IDENTIFIER
;	, N.SOURCE_STRING
;	, N.STRING_IDENTIFIER
;	, SRC_ID_ABBREV = substring(1,3,n.source_identifier)
	;, N_SOURCE_VOCABULARY_DISP = UAR_GET_CODE_DISPLAY(N.SOURCE_VOCABULARY_CD)
	;, P_LIFE_CYCLE_STATUS_DISP = UAR_GET_CODE_DISPLAY(P.LIFE_CYCLE_STATUS_CD)
	, P.ACTIVE_IND
;	, N.SHORT_STRING
;	, N_ACTIVE_STATUS_DISP = UAR_GET_CODE_DISPLAY(N.ACTIVE_STATUS_CD)
;	, N.MNEMONIC
;	, N.NOMENCLATURE_ID
;	, N.ROWID
;	, N.SOURCE_STRING_KEYCAP
;	, N.SOURCE_STRING_KEYCAP_A_NLS
;	, N_SOURCE_VOCABULARY_DISP = UAR_GET_CODE_DISPLAY(N.SOURCE_VOCABULARY_CD)
;	, N_STRING_SOURCE_DISP = UAR_GET_CODE_DISPLAY(N.STRING_SOURCE_CD)
;	, N_STRING_STATUS_DISP = UAR_GET_CODE_DISPLAY(N.STRING_STATUS_CD)
;	, N.CONCEPT_CKI
	, P_CLASSIFICATION_DISP = UAR_GET_CODE_DISPLAY(P.CLASSIFICATION_CD)
	, P_LIFE_CYCLE_STATUS_DISP = UAR_GET_CODE_DISPLAY(P.LIFE_CYCLE_STATUS_CD)
;	, Src_str_trc = substring(1,7,N.source_string)
	, P.ANNOTATED_DISPLAY
 
FROM
	PROBLEM   P
;	, NOMENCLATURE   N
 
PLAN P
 
					WHERE P.person_id = $perid ; 14193679 ; trigger_personid
 
					AND P.active_ind =1
					;************************************************************
					;****** Excluding No Chornic Problems ***********************
					AND P.ANNOTATED_DISPLAY != "No Chronic Problems"
 
					;************************************************************
					;******Add Classification = Medical *************************
					; **** Add Life_cycle_status_cd = Active *******************
					and P.classification_cd =MEDICAL_VAR ; 674232.00 ; Medical Classification
					And P.life_cycle_status_cd = ACTIVE_VAR ;3301.00 ; Active Life Cycle
		;******** Removed the JOIN and replaced it with the following nested codes*****
						AND
					p.NOMENCLATURE_ID  in (
						select n.NOMENCLATURE_ID
						 from nomenclature n
						 where n.SOURCE_VOCABULARY_CD not in  (  2960522.00, 710278408.00, 673967.00 )
 								)
  					 and
					p.ORIGINATING_NOMENCLATURE_ID in (
 						select n.NOMENCLATURE_ID
 						 from nomenclature n
 						 where n.SOURCE_VOCABULARY_CD not in  (  2960522.00, 710278408.00, 673967.00 )
 						 )
 
 
 
					;AND P.LIFE_CYCLE_STATUS_CD in ( ACTIVE_VAR) ;, CANCELED_VAR,INACTIVE_VAR)
					;***********************************************************
;			JOIN N
 ;
;					WHERE N.NOMENCLATURE_ID = p.originating_nomenclature_id
 ;
;					 AND n.source_vocabulary_cd not in (2960522.00, 710278408.00, 673967.00)
 ;
;					;/*
;					 AND n.source_vocabulary_cd in (select cv.code_Value
 ;                               from code_value cv
  ;                              where
   ;                             (cv.code_set = 400
    ;                            and cv.cdf_meaning != 'MAYO_PROB'
     ;                           )
      ;                          	or cv.code_value = 0.0
       ;                         )
 
                               ;*/
 
 
 
 
 
 
 
/*		AND ( N.concept_cki = "ICD9CM!*"
					or N.concept_cki = "MULTUM!*"
					or N.concept_cki = "PNED!*"
					or N.concept_cki = "ALLERGY!*"
					)
				*/
					; Following line replaces the previous four
					;and( n.source_vocabulary_cd in( 1231.00,246721296.00, 1217,  639026.00)
 
					;******Removing the following two lines
;					and( n.source_vocabulary_cd in( ICD9_VAR,PNED_VAR, ALLERGY_VAR,  MULTUM_VAR)
;				 or n.source_vocabulary_cd =0.0)
 
 
 
 
					;and n.source_vocabulary_cd = 1231.00
 
Head Report
	;log_misc1 =concat(trim(Src_str_trc),",@","NEWLINE"," ",log_misc1)
cnt = 0
Detail
	cnt= cnt+1
	retval =100
	;if cnt > 0
 
	; ******* Annotated Display ****************************************
	log_misc1 =concat(trim(P.ANNOTATED_DISPLAY),",@","NEWLINE",",",log_misc1)
 
	;******** Condition Name Displays***********************************
 	;log_misc1 =concat(trim(N.source_string),",@","NEWLINE",log_misc1)
 
 
 	;******* Abbreviated Condition Name********************************
  	;log_misc1 =concat(trim(Src_str_trc),",@","NEWLINE"," ",log_misc1)
 
 	; Log_message = BUILD(concat(log_message,":",log_misc1))
 
	Log_message = build("person id is:",$perid)
 
WITH nocounter, separator=" ", format, time = 30
 
;********************************
; count is outside the Detail section
; we should use set when outside detail, foot and head report
;**********************************
 
IF (cnt > 0 )
	set LOG_MESSAGE = concat(build("Flagged_PROBS:"," ",cnt))
elseif (cnt = 0)
	set Log_misc1 = "No Flagged Problems Available"
	set LOG_MESSAGE =Build("NO PROBLEMS IDENFITIED")
Endif
 
; *********** Echo Should be outside the Detail or the loop
call echo(log_misc1)
Call echo(cnt)
call Echo(LOG_MESSAGE)
end
go
 
;0905_Flagged_problems "NL:",7478229 go; 6839013 go ;14192807 go; 14190585 go ; 14193679  go;14193679 go ;14235221 go ;
 
 
 
