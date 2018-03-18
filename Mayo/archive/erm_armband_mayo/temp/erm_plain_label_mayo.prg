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
 ***********************************************************************
 
 ******************  END OF ALL MODCONTROL BLOCKS  ********************/
%i ccluserdir:pm_hl7_formatting.inc
execute reportrtl
%i mhs_prg:erm_plain_label_mayo.dvl
set d0 = InitializeReport(0)
declare fin = vc
declare full_name = vc
declare dob = vc
declare age = vc
declare age_dp = vc
declare sex_dp = vc
declare admit_dt = vc
declare pattype_dp = vc
declare barcode_mrn = vc
declare mrn_dp = vc
declare barcode_fin = vc
declare Aztec = vc						;pel
declare print_axtec = i2				;pel
declare room_dp = vc
declare attend_doctor = f8
declare prov_att = vc
 
declare EU_Bloomer_Hosp = F8 			;pel
declare EU_EauCl_Hosp = F8				;pel
declare EU_Barron_Hosp = F8				;pel
declare EU_Osseo_Hosp = F8				;pel
 
;    3196529.00	        220	FACILITY	EU Bloomer Hosp
;     633867.00	        220	FACILITY	EU EauCl Hosp
;    3196527.00	        220	FACILITY	EU Barron Hosp
;    3196531.00	        220	FACILITY	EU Osseo Hosp
select into "nl:"															;pel
	from code_value cv														;pel
where cv.code_set = 220														;pel
	and cv.cdf_meaning = "FACILITY" 										;pel
	AND CV.ACTIVE_IND = 1													;pel
	AND CV.DISPLAY_KEY IN (													;pel
							"EUEAUCLHOSP",									;pel
							"EUBARRONHOSP",									;pel
							"EUBLOOMERHOSP",								;pel
							"EUOSSEOHOSP"									;pel
							)												;pel
DETAIL																		;pel
   IF (CV.DISPLAY_KEY = "EUEAUCLHOSP")										;pel
		EU_EauCl_Hosp = CV.CODE_VALUE										;pel
   ELSEIF (CV.DISPLAY_KEY = "EUBARRONHOSP")									;pel
		EU_Barron_Hosp = CV.CODE_VALUE										;pel
   ELSEIF (CV.DISPLAY_KEY = "EUBLOOMERHOSP")								;pel
		EU_Bloomer_Hosp = CV.CODE_VALUE 									;pel
   ELSEIF (CV.DISPLAY_KEY = "EUOSSEOHOSP")									;pel
		EU_Osseo_Hosp = CV.CODE_VALUE										;pel
   ENDIF																	;pel
WITH NOCOUNTER																;pel
 
 
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
 
 
;pel  select
;pel    d.seq
;pel  from dummyt d
;pel  plan d
;pel
;pel  detail
;pel    d0=DetailSection(Rpt_Render)
;pel
;pel  with nocounter;, noformfeed, DIO = POSTSCRIPT
 
;PEL START BLOCK CHANGES
;  CHECK FOR REFERING MRN  FOR THE 4 HOSPITALS ******
  select into "nl:"                                                                						;pel
                                                                                       					;pel
  from encounter e,                                                                         			;pel
       PERSON_ALIAS Pa                                                          						;pel
  plan e                                                                           						;pel
      where e.encntr_id = request->patient_data->person->encounter->encntr_id       					;pel
      AND E.loc_facility_cd IN ( EU_Bloomer_Hosp,                                                       ;pel
								 EU_EauCl_Hosp,                                                         ;pel
								 EU_Barron_Hosp,                                                        ;pel
								 EU_Osseo_Hosp                                                          ;pel
							   )                                                          				;pel
  join PA                                                          										;pel
  	where PA.PERSON_ID = E.person_id                                                          			;pel
  	and PA.PERSON_ALIAS_TYPE_CD  IN ( value(uar_get_code_by("MEANING",4,"OTHER")),                      ;pel
  									  value(uar_get_code_by("MEANING",4,"REF_MRN")))                    ;pel
  	and PA.active_ind = 1                                                          						;pel
                                                          												;pel
  DETAIL                                                          										;pel
     IF  (E.loc_facility_cd = EU_Bloomer_Hosp                                                          	;pel
           AND PA.alias_pool_cd = value(uar_get_code_by("DISPLAYKEY",263,"BLMRN"))                      ;pel
          )                                                          									;pel
				 mrn_cnvt     = concat("M",																;pel
			  	 						format(cnvtint(pa.alias),"######;p0")),                  		;pel
			     barcode_mrn  = build("*",mrn_cnvt,"*")                                                 ;pel
			     mrn_dp       = build("MR# ",mrn_cnvt)                                                  ;pel
	 ELSEIF (E.loc_facility_cd = EU_EauCl_Hosp			                                                ;pel
			AND PA.alias_pool_cd = value(uar_get_code_by("DISPLAYKEY",263,"LMMRN")))					;pel
				 mrn_cnvt     = concat("1000",															;pel
			  	 						format(cnvtint(pa.alias),"######;p0")),                  		;pel
			     barcode_mrn  = build("*",mrn_cnvt,"*")                                                 ;pel
			     mrn_dp       = build("MR# ",mrn_cnvt)                                                  ;pel
	 ELSEIF (E.loc_facility_cd = EU_Barron_Hosp															;pel
			AND PA.alias_pool_cd = value(uar_get_code_by("DISPLAYKEY",263,"BAMRN")))					;pel
				 mrn_cnvt     = trim(pa.alias),  								                		;pel
			     barcode_mrn  = build("*",mrn_cnvt,"*")                                                 ;pel
			     mrn_dp       = build("MR# ",mrn_cnvt)                                                  ;pel
	 ELSEIF (E.loc_facility_cd = EU_Osseo_Hosp                                                          ;pel
			AND PA.alias_pool_cd = value(uar_get_code_by("DISPLAYKEY",263,"OSMRN")))                    ;pel
				 mrn_cnvt     = trim(pa.alias),  								                		;pel
			     barcode_mrn  = build("*",mrn_cnvt,"*")                                                 ;pel
			     mrn_dp       = build("MR# ",mrn_cnvt)                                                  ;pel
     ENDIF                                                          									;pel
   WITH NOCOUNTER                                                          								;pel
 
  select                                                                           			;pel
                                                                                       		;pel
  from encounter e,                                                                         ;pel
       code_value cv                                                                        ;pel
       ,code_value fac                                                                      ;pel
  plan e                                                                           			;pel
      where e.encntr_id = request->patient_data->person->encounter->encntr_id       		;pel
			            ;pel
  join cv                                                                           		;pel
      where cv.code_value = e.loc_building_cd                                       		;pel
  join fac                                                                           		;pel
      where fac.code_value = e.loc_facility_cd                                      		;pel
  detail                                                                            		;pel
    if (fac.display = "EU*")                                                          		;pel
    	prefix = substring(1,4,fac.definition)                                              ;pel
    else					                                                          		;pel
    	prefix = substring(1,4,cv.definition)                                               ;pel
    endif																              		;pel
    if (e.loc_nurse_unit_cd in (										              		;pel
						         177886319.00;	        220	NURSEUNIT	EULH FBC IsoNur	    ;pel
								 ,177890657.00;	        220	NURSEUNIT	EULH FBC Nursry     ;pel
								 ,179653105.00;	        220	NURSEUNIT	EULH FBC SpCare     ;pel
								 ,11004468.00;	        220	NURSEUNIT	EUBH Nursery        ;pel
								)											          	    ;pel
	   )																              		;pel
		print_axtec = 1																	    ;pel
	ELSE																		            ;pel
		print_axtec = 0															            ;pel
	ENDIF																              		;pel
					                                                          				;pel
    Aztec = concat(prefix,fnbr)                                                             ;pel
;    IF (print_axtec = 1) 														            ;pel
;    	d0=DetailSectionEU(Rpt_Render)                                                      ;pel
;    else																					;pel
    d0=DetailSection(Rpt_Render)                                                            ;pel
;	endif																		            ;pel
  with nocounter																			;pel
 
  ;PEL END BLOCK CHANGES
 
 
  set d0 = FinalizeReport($1);"cer_print:ds.dat");request->printer_name)
 
set last_mod = "009 02/11/10 m061596"
 
  end
  go
 
 
