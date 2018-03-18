drop program erm_plain_label_mayo:dba go
create program erm_plain_label_mayo:dba
 
/************************************************************************
 *                                                                      *
 *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
 *                              Technology, Inc.                        *
 *       Revision      (c) 1984-1995 Cerner Corporation                 *
 *                                                                      *
 *  Cerner (R) Proprietary Rights Notice:  All rights reserved.         *
 *  This material contains the valuable properties and trade secrets of *
 *  Cerner Corporation of Kansas City, Missouri, United States of       *
 *  America (Cerner), embodying substantial creative efforts and        *
 *  confidential information, ideas and expressions, no part of which   *
 *  may be reproduced or transmitted in any form or by any means, or    *
 *  retained in any storage or retrieval system without the express     *
 *  written permission of Cerner.                                       *
 *                                                                      *
 *  Cerner is a registered mark of Cerner Corporation.                  *
 *                                                                      *
 ************************************************************************
 
          Date Written:       MM/DD/YYYY
          Source file name:   labelwarmband
          Object name:        labelwarmband
          Request #:          XXXXXX
 
          Product:            CORE V500
          Product Team:       CORE V500
          HNA Version:        V500
          CCL Version:
 
          Program purpose:    Label
 
          Tables read:        VARIABLE
          Tables updated:     None
          Executing from:     PM DBDocs
 
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
 *000 MM/DD/YY Sample Engineer      initial release                    *
 *001 03/29/02 DaRon Holmes         Sized for Tri-State Stock FM1542   *
 *002 01/12/05 Elaine Miller 	    customized FIN & MR# labels        *
 *003 03/31/05 Elaine Miller        Modified for generic doc file      *
 *004 06/10/09 dg5085               customize for mayo_Mn              *
 *005 06/26/08 dg5085               prefix 4 character and adjustements*
 *006 09/25/08 dg5085               next enhancements SR 1-1521526751  *
 *007 10/27/08 dg5085               truncate patient name to 23        *
 *008 12/09/08 dg5085               Chaged label to use layout builder *
 *                                  from SR 1-2058963541               *
 *009 05/07/09 rv5893               fix formatting of the fin and mrn alias
 *010 05/09/14 m063907              Use REFERING MRN for specific Hospitals
 *011 05/18/14 m063907              check end effective dt_tm on person alias
 ***********************************************************************
 
 ******************  END OF ALL MODCONTROL BLOCKS  ********************/
call echo ("start report ........")
 
%i ccluserdir:pm_hl7_formatting.inc
call echo ("after pm_hl7_formatting.inc ........")
 
execute reportrtl
call echo ("after reportrtl........")
%i mhs_prg:erm_plain_label_mayo.dvl
call echo ("report initialized........")
set d0 = InitializeReport(0)
call echo ("report initialized........")
declare fin = vc
declare full_name = vc
declare dob = vc
declare age = vc
declare age_dp = vc
declare sex_dp = vc
declare admit_dt = vc
declare pattype_dp = vc
declare barcode_mrn = vc
declare barcode_mrn_no_asterisks = vc
declare mrn_dp = vc
declare barcode_fin = vc
declare Aztec = vc						;010
declare print_axtec = i2				;010
declare room_dp = vc
declare attend_doctor = f8
declare prov_att = vc
 
declare EU_Bloomer_Hosp = F8 			;010
declare EU_EauCl_Hosp = F8				;010
declare EU_EauCl_bh = F8				;010
declare EU_Barron_Hosp = F8				;010
declare EU_Osseo_Hosp = F8				;010
declare arr_dt_tm = vc					;PEL
DECLARE FIN_CLASS_CD = VC				;PEL
declare print_fc_appt_dt_ind = i2				;pel
set print_fc_appt_dt_ind = 0
 
;    3196529.00	        220	FACILITY	EU Bloomer Hosp
;     633867.00	        220	FACILITY	EU EauCl Hosp
;    3196527.00	        220	FACILITY	EU Barron Hosp
;    3196531.00	        220	FACILITY	EU Osseo Hosp
select into "nl:"															;010
	from code_value cv														;010
where cv.code_set = 220														;010
	and cv.cdf_meaning = "FACILITY" 										;010
	AND CV.ACTIVE_IND = 1													;010
	AND CV.DISPLAY_KEY IN (													;010
							"EUEAUCLHOSP",									;010
							"EUEAUCLHOSPBH",								;010
							"EUBARRONHOSP",									;010
							"EUBLOOMERHOSP",								;010
							"EUOSSEOHOSP"									;010
							)												;010
DETAIL																		;010
   IF (CV.DISPLAY_KEY = "EUEAUCLHOSP")										;010
		EU_EauCl_Hosp = CV.CODE_VALUE										;010
   ELSEIF (CV.DISPLAY_KEY = "EUEAUCLHOSPBH")								;010
		EU_EauCl_bh = CV.CODE_VALUE											;010
   ELSEIF (CV.DISPLAY_KEY = "EUBARRONHOSP")									;010
		EU_Barron_Hosp = CV.CODE_VALUE										;010
   ELSEIF (CV.DISPLAY_KEY = "EUBLOOMERHOSP")								;010
		EU_Bloomer_Hosp = CV.CODE_VALUE 									;010
   ELSEIF (CV.DISPLAY_KEY = "EUOSSEOHOSP")									;010
		EU_Osseo_Hosp = CV.CODE_VALUE										;010
   ENDIF																	;010
WITH NOCOUNTER																;010
 
 
 
;INITIALIZE
  set fnbr_alias   = request->patient_data->person->encounter->finnbr->alias
  set fnbr_format  = request->patient_data->person->encounter->finnbr->alias_pool_cd
; set fnbr         = substring(1,15, cnvtalias(fnbr_alias, fnbr_format))
  set fnbr         = cnvtalias(fnbr_alias, fnbr_format)
  set barcode_fin  = build("*",fnbr,"*")
  set fin          = build("FIN# ",fnbr)
  set full_name    = cnvtupper(substring(1,23,request->patient_data->person->name_full_formatted));was 40
  set dob          = format(request->patient_data->person->birth_dt_tm,"MM/DD/YYYY;;D")
  set mrn_format   = request->patient_data->person->mrn->alias_pool_cd
  set mrn_alias    = request->patient_data->person->mrn->alias
  set mrn_cnvt     = cnvtalias(mrn_alias, mrn_format)
  set barcode_mrn  = build("*",mrn_cnvt,"*")
  set barcode_mrn_no_asterisks = trim(mrn_cnvt)													;pel
  set mrn_dp       = build("MR# ",mrn_cnvt)
  set admit_dt     = format(request->patient_data->person->encounter->reg_dt_tm,"MM/DD/YYYY;;D")
  set age = cnvtage(cnvtdate(request->patient_data->person->birth_dt_tm),
      cnvttime(request->patient_data->person->birth_dt_tm))
  set attend_doctor = request->patient_data->person->encounter->attenddoc->prsnl_person_id
  set prov_att = substring(1,30,pm_hl7_provider(attend_doctor,prv_name_full_formatted))
 
 
  if (findstring("Hour", age) > 1)
    set age_dp = concat(substring(1, 2, age), "H")
  elseif (findstring("Day", age) > 1)
    if (cnvtint(substring(1, 3, age)) > 0)
      set age_dp = concat(substring(1, 3, age), "D")
    else
      set age_dp = ""
    endif
  elseif (findstring("Week", age) > 1)
    set age_dp = concat(substring(1, 3, age), "W")
  elseif (findstring("Month", age) > 1)
    set age_dp = concat(substring(1, 3, age), "M")
  elseif (findstring("Year", age) > 1)
    set age_dp = concat(substring(1, 3, age), "Y")
  else
    set age_dp = ""
  endif
  set sex_dp      = substring(1,1,uar_get_code_display(request->patient_data->person->sex_cd)),
  set pattype_dp  = substring(1,15,uar_get_code_display(request->patient_data->person->encounter->encntr_type_cd)),
  set room_dp     = uar_get_code_display(request->patient_data->person->encounter->loc_room_cd),
  set FIN_CLASS_dp    = uar_get_code_display(request->patient_data->PERSON->SUBSCRIBER_01->PERSON->
											  HEALTH_PLAN->PLAN_INFO->FINANCIAL_CLASS_CD)
  set arr_dt_tm = format(request->patient_data->PERSON->ENCOUNTER->EST_ARRIVE_DT_TM,"@SHORTDATETIME") ;PEL
 
 
; SELECT into "nl:";P.name_full_formatted
;  					FROM
;					ENCNTR_ALIAS EA, ENCNTR_PRSNL_RELTN	E, PRSNL P
;					PLAN EA
;					WHERE
;					EA.alias = fnbr_alias ;"100052364"
;					AND ea.encntr_alias_type_cd = 1077
;					AND ea.alias_pool_cd = fnbr_format
;					JOIN E
;					WHERE
;					E.ENCNTR_PRSNL_R_CD = 1119
;					AND e.active_ind = 1
;					AND E.encntr_id = EA.encntr_id
;					AND E.BEG_EFFECTIVE_DT_TM <= cnvtdatetime(curdate,curtime)
;					AND E.END_EFFECTIVE_DT_TM >= cnvtdatetime(curdate,curtime)
;					JOIN P
;					WHERE
;					P.active_ind = 1
;					AND P.PERSON_ID = E.PRSNL_PERSON_ID
;					order by p.name_full_formatted
;					detail
;					att_prv = p.name_full_formatted
;					with nocounter
;
;  set prov_att = att_prv
 
 
;010  select
;010    d.seq
;010  from dummyt d
;010  plan d
;010
;010  detail
;010    d0=DetailSection(Rpt_Render)
;010
;010  with nocounter;, noformfeed, DIO = POSTSCRIPT
 
 
 
;010 START BLOCK CHANGES
;  CHECK FOR REFERING MRN  FOR THE 4 HOSPITALS ******
 
  select into "nl:"                                                                						;010
                                                                                       					;010
  from encounter e,                                                                         			;010
       PERSON_ALIAS Pa                                                          						;010
  plan e                                                                           						;010
      where e.encntr_id = request->patient_data->person->encounter->encntr_id       					;010
      AND E.loc_facility_cd IN ( EU_Bloomer_Hosp,                                                       ;010
								 EU_EauCl_Hosp, 														;010
								 EU_EauCl_bh,                                                           ;010
								 EU_Barron_Hosp,                                                        ;010
								 EU_Osseo_Hosp                                                          ;010
							   )                                                          				;010
  join PA                                                          										;010
  	where PA.PERSON_ID = E.person_id                                                          			;010
  	and PA.PERSON_ALIAS_TYPE_CD  IN ( value(uar_get_code_by("MEANING",4,"OTHER")),                      ;010
  									  value(uar_get_code_by("MEANING",4,"REF_MRN")))                    ;010
  	and PA.active_ind = 1                                                          						;010
    and pa.end_effective_dt_tm > sysdate                  												;011
 
                                                          												;010
  DETAIL                                                          										;010
     IF  (E.loc_facility_cd = EU_Bloomer_Hosp                                                          	;010
           AND PA.alias_pool_cd = value(uar_get_code_by("DISPLAYKEY",263,"BLMRN"))                      ;010
          )                                                          									;010
				 mrn_cnvt     = concat("M",																;010
			  	 						format(pa.alias,"#######;p0")),                  				;010
			     barcode_mrn  = build("*",mrn_cnvt,"*")                                                 ;010
  				 barcode_mrn_no_asterisks = trim(mrn_cnvt)												;pel
			  	 mrn_dp       = build("MR# ",trim(mrn_cnvt))											;010
 
	 ELSEIF (E.loc_facility_cd in ( EU_EauCl_Hosp,EU_EauCl_bh)			                                ;010
			AND PA.alias_pool_cd = value(uar_get_code_by("DISPLAYKEY",263,"LHMRN")))					;010
			     if (size(trim(pa.alias)) = 5)															;010
   				 	mrn_cnvt     = concat("10000",														;010
			  	 						format(pa.alias,"#####;p0"))                  		    ;010
			  	 elseif (size(trim(pa.alias)) = 6)														;010
   				 	mrn_cnvt     = concat("1000",														;010
			  	 						format(cnvtint(pa.alias),"######;p0"))                  		;010
				endif																					;010
 
			     barcode_mrn  = build("*",mrn_cnvt,"*")                                                 ;010
;			     barcode_mrn  = mrn_cnvt                                                 ;010 testing without astric!!!
  				 barcode_mrn_no_asterisks = trim(mrn_cnvt)												;pel
			  	 mrn_dp       = build("MR# ",trim(mrn_cnvt))											;010
 
	 ELSEIF (E.loc_facility_cd = EU_Barron_Hosp															;010
			AND PA.alias_pool_cd = value(uar_get_code_by("DISPLAYKEY",263,"BAMRN")))					;010
				 mrn_cnvt     = trim(pa.alias),  								                		;010
			     barcode_mrn  = build("*",mrn_cnvt,"*")                                                 ;010
  				 barcode_mrn_no_asterisks = trim(mrn_cnvt)												;pel
			  	 mrn_dp       = build("MR# ",trim(mrn_cnvt))											;010
 
	 ELSEIF (E.loc_facility_cd = EU_Osseo_Hosp                                                          ;010
			AND PA.alias_pool_cd = value(uar_get_code_by("DISPLAYKEY",263,"OSMRN")))                    ;010
				 mrn_cnvt     = trim(pa.alias),  								                		;010
			     barcode_mrn  = build("*",mrn_cnvt,"*")                                                 ;010
  				 barcode_mrn_no_asterisks = trim(mrn_cnvt)												;pel
			  	 mrn_dp       = build("MR# ",trim(mrn_cnvt))											;010
 
     ENDIF                                                          									;010
   WITH NOCOUNTER                                                          								;010
 
 
 
 
;;;;010 START BLOCK CHANGES
;;;;  CHECK FOR REFERING MRN  FOR THE 4 HOSPITALS ******
;;;  select into "nl:"                                                                						;010
;;;                                                                                       					;010
;;;  from encounter e,                                                                         			;010
;;;       PERSON_ALIAS Pa                                                          						;010
;;;  plan e                                                                           						;010
;;;      where e.encntr_id = request->patient_data->person->encounter->encntr_id       					;010
;;;      AND E.loc_facility_cd IN ( EU_Bloomer_Hosp,                                                       ;010
;;;								 EU_EauCl_Hosp,                                                         ;010
;;;								 EU_Barron_Hosp,                                                        ;010
;;;								 EU_Osseo_Hosp                                                          ;010
;;;							   )                                                          				;010
;;;  join PA                                                          										;010
;;;  	where PA.PERSON_ID = E.person_id                                                          			;010
;;;  	and PA.PERSON_ALIAS_TYPE_CD  IN ( value(uar_get_code_by("MEANING",4,"OTHER")),                      ;010
;;;  									  value(uar_get_code_by("MEANING",4,"REF_MRN")))                    ;010
;;;  	and PA.active_ind = 1                                                          						;010
;;;                                                          												;010
;;;  DETAIL                                                          										;010
;;;     IF  (E.loc_facility_cd = EU_Bloomer_Hosp                                                          	;010
;;;           AND PA.alias_pool_cd = value(uar_get_code_by("DISPLAYKEY",263,"BLMRN"))                      ;010
;;;          )                                                          									;010
;;;				 mrn_cnvt     = concat("M",																;010
;;;			  	 						format(cnvtint(pa.alias),"######;p0")),                  		;010
;;;			     barcode_mrn  = build("*",mrn_cnvt,"*")                                                 ;010
;;;			     mrn_dp       = build("MR# ",mrn_cnvt)                                                  ;010
;;;	 ELSEIF (E.loc_facility_cd = EU_EauCl_Hosp			                                                ;010
;;;			AND PA.alias_pool_cd = value(uar_get_code_by("DISPLAYKEY",263,"LMMRN")))					;010
;;;				 mrn_cnvt     = concat("1000",															;010
;;;			  	 						format(cnvtint(pa.alias),"######;p0")),                  		;010
;;;			     barcode_mrn  = build("*",mrn_cnvt,"*")                                                 ;010
;;;			     mrn_dp       = build("MR# ",mrn_cnvt)                                                  ;010
;;;	 ELSEIF (E.loc_facility_cd = EU_Barron_Hosp															;010
;;;			AND PA.alias_pool_cd = value(uar_get_code_by("DISPLAYKEY",263,"BAMRN")))					;010
;;;				 mrn_cnvt     = trim(pa.alias),  								                		;010
;;;			     barcode_mrn  = build("*",mrn_cnvt,"*")                                                 ;010
;;;			     mrn_dp       = build("MR# ",mrn_cnvt)                                                  ;010
;;;	 ELSEIF (E.loc_facility_cd = EU_Osseo_Hosp                                                          ;010
;;;			AND PA.alias_pool_cd = value(uar_get_code_by("DISPLAYKEY",263,"OSMRN")))                    ;010
;;;				 mrn_cnvt     = trim(pa.alias),  								                		;010
;;;			     barcode_mrn  = build("*",mrn_cnvt,"*")                                                 ;010
;;;			     mrn_dp       = build("MR# ",mrn_cnvt)                                                  ;010
;;;     ENDIF                                                          									;010
;;;   WITH NOCOUNTER                                                          								;010
 
  select                                                                           			;010
                                                                                       		;010
  from encounter e,                                                                         ;010
       code_value cv                                                                        ;010
       ,code_value fac                                                                      ;010
  plan e                                                                           			;010
      where e.encntr_id = request->patient_data->person->encounter->encntr_id       		;010
			            ;010
  join cv                                                                           		;010
      where cv.code_value = e.loc_building_cd                                       		;010
  join fac                                                                           		;010
      where fac.code_value = e.loc_facility_cd                                      		;010
  detail                                                                            		;010
    if (fac.display = "EU*")                                                          		;010
    	prefix = substring(1,4,fac.definition)                                              ;010
  		barcode_mrn = barcode_mrn_no_asterisks 												;pel
 
    else					                                                          		;010
    	prefix = substring(1,4,cv.definition)                                               ;010
    endif																              		;010
	if (fac.display = "OW*")  ; REMOVE DASHES FROM THE DISPLAY AND BARCODE VALUE     	;PEL
	      mrn_dp = build("XX# ",format(mrn_alias,"zzzzzzzzzzz;p0"))					 	;PEL
  		  barcode_mrn  = build("*",format(mrn_alias,"zzzzzzzzzzz;p0"),"*")			 	;PEL
		  print_fc_appt_dt_ind = 1
    ENDIF																				;PEL
 
 
    if (e.loc_nurse_unit_cd in (										              		;010
						         177886319.00;	        220	NURSEUNIT	EULH FBC IsoNur	    ;010
								 ,177890657.00;	        220	NURSEUNIT	EULH FBC Nursry     ;010
								 ,179653105.00;	        220	NURSEUNIT	EULH FBC SpCare     ;010
								 ,11004468.00;	        220	NURSEUNIT	EUBH Nursery        ;010
								)											          	    ;010
	   )																              		;010
		print_axtec = 1																	    ;010
	ELSE																		            ;010
		print_axtec = 0															            ;010
	ENDIF																              		;010
					                                                          				;010
    Aztec = concat(prefix,fnbr)                                                             ;010
;    IF (print_axtec = 1) 														            ;010
;    	d0=DetailSectionEU(Rpt_Render)                                                      ;010
;    else																					;010
    if (print_axtec = 1)
	    d0=DetailSectionEu(Rpt_Render) 					                                  	;010
	else
	    d0=DetailSection(Rpt_Render)                                                        ;010
	endif
;	endif																		            ;010
  with nocounter																			;010
 
  ;010 END BLOCK CHANGES
 
 
  set d0 = FinalizeReport($1);"cer_print:ds.dat");request->printer_name)
 
set last_mod = "011 05/18/14 m063907"
 
  end
  go
 
 
 
