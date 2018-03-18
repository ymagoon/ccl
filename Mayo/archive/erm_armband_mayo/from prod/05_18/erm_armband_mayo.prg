drop program erm_armband_mayo:dba go
create program erm_armband_mayo:dba
 
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
 *007 10/02/08 dg5085               remove 2 digit from mrn/fin 4 digit*
 *008 10/06/08 dg5085               formatting and year display        *
 *009 10/27/08 dg5085               truncate patient name to 22        *
 *010 05/04/09 dg5085               admit date truncation on armband   *
 *011 05/06/09 rv5893               update the MRN and FIN barcode to the the  *
 *                                  alias_pool_cd formatting           *
 *012 09/19/12 m063907              Pull Prefix based on enc loc building *
 ***********************************************************************
 
 ******************  END OF ALL MODCONTROL BLOCKS  ********************/
%i cclsource:pm_hl7_formatting.inc
execute reportrtl
%i mhs_prg:erm_armband_mayo.dvl
set d0 = InitializeReport(0)
declare fin = vc
declare encntr_id= f8
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
declare Aztec = vc
declare room_dp = vc
declare room_code_dp = vc
declare bed_dp = vc
;007declare Pfx_barcode_mrn = vc ;006
;007declare pfx_mrn_dp = vc ;006
;007declare pfx_barcode_fin  = vc ;006
;007declare pfx_fin          = vc ;006
declare prov_id= f8
declare att_prv = vc
declare prov_att = vc
 
declare EU_Bloomer_Hosp = F8 			;pel
declare EU_EauCl_Hosp = F8				;pel
declare EU_EauCl_bh = F8				;pel
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
							"EUEAUCLHOSPBH",
							"EUBARRONHOSP",									;pel
							"EUBLOOMERHOSP",								;pel
							"EUOSSEOHOSP"									;pel
							)												;pel
DETAIL																		;pel
   IF (CV.DISPLAY_KEY = "EUEAUCLHOSP")										;pel
		EU_EauCl_Hosp = CV.CODE_VALUE										;pel
   ELSEIF (CV.DISPLAY_KEY = "EUEAUCLHOSPBH")										;pel
		EU_EauCl_bh = CV.CODE_VALUE										;pel
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
  set encntr_id		= request->patient_data->person->encounter->encntr_id
  set fnbr_format  = request->patient_data->person->encounter->finnbr->alias_pool_cd
; set fnbr         = substring(1,15, cnvtalias(fnbr_alias, fnbr_format))
  set fnbr         = cnvtalias(fnbr_alias, fnbr_format)
  set barcode_fin  = build("*",fnbr,"*")
  set fin          = build("FIN: ",fnbr)
  set full_name    = cnvtupper(substring(1, 22, request->patient_data->person->name_full_formatted));was 40
  set dob          = format(request->patient_data->person->birth_dt_tm,"MM/DD/YYYY;;D")
  set mrn_format   = request->patient_data->person->mrn->alias_pool_cd
  set mrn_alias    = request->patient_data->person->mrn->alias
  set mrn_cnvt     = cnvtalias(mrn_alias, mrn_format)
  set barcode_mrn  = build("*",mrn_cnvt,"*")
  set mrn_dp       = build("MR#: ",trim(mrn_cnvt))
  set admit_dt     = format(request->patient_data->person->encounter->reg_dt_tm,"MM/DD/YYYY;;D")
  set age = cnvtage(cnvtdate(request->patient_data->person->birth_dt_tm),
      cnvttime(request->patient_data->person->birth_dt_tm))
  set prov_id	= request->patient_data->PERSON->ENCOUNTER->ATTENDDOC->PRSNL_PERSON_ID
 
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
  set room_code_dp     = uar_get_code_display(request->patient_data->person->encounter->loc_room_cd),
  set bed_dp     = uar_get_code_display(request->patient_data->person->encounter->loc_bed_cd),
 set room_dp = concat(room_code_dp,"/",bed_dp)
 
 	select into "nl:"
	from prsnl p
	where p.person_id= prov_id
	detail
	att_prv= p.name_full_formatted
	with nocounter
 
  set prov_att = att_prv
 
;PEL START BLOCK CHANGES
;  CHECK FOR REFERING MRN  FOR THE 4 HOSPITALS ******
 
  select into "nl:"                                                                						;pel
                                                                                       					;pel
  from encounter e,                                                                         			;pel
       PERSON_ALIAS Pa                                                          						;pel
  plan e                                                                           						;pel
      where e.encntr_id = request->patient_data->person->encounter->encntr_id       					;pel
      AND E.loc_facility_cd IN ( EU_Bloomer_Hosp,                                                       ;pel
								 EU_EauCl_Hosp, 														;pel
								 EU_EauCl_bh,                                                           ;pel
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
			  	 						format(pa.alias,"#######;p0")),                  				;pel
			     barcode_mrn  = build("*",mrn_cnvt,"*")                                                 ;pel
			  	 mrn_dp       = build("MR#: ",trim(mrn_cnvt))											;pel
 
	 ELSEIF (E.loc_facility_cd in ( EU_EauCl_Hosp,EU_EauCl_bh)			                                ;pel
			AND PA.alias_pool_cd = value(uar_get_code_by("DISPLAYKEY",263,"LHMRN")))					;pel
			     if (size(trim(pa.alias)) = 5)															;pel
   				 	mrn_cnvt     = concat("10000",														;pel
			  	 						format(pa.alias,"#####;p0"))                  		    ;pel
			  	 elseif (size(trim(pa.alias)) = 6)														;pel
   				 	mrn_cnvt     = concat("1000",														;pel
			  	 						format(cnvtint(pa.alias),"######;p0"))                  		;pel
				endif																					;pel
 
			     barcode_mrn  = build("*",mrn_cnvt,"*")                                                 ;pel
			  	 mrn_dp       = build("MR#: ",trim(mrn_cnvt))											;pel
 
	 ELSEIF (E.loc_facility_cd = EU_Barron_Hosp															;pel
			AND PA.alias_pool_cd = value(uar_get_code_by("DISPLAYKEY",263,"BAMRN")))					;pel
				 mrn_cnvt     = trim(pa.alias),  								                		;pel
			     barcode_mrn  = build("*",mrn_cnvt,"*")                                                 ;pel
			  	 mrn_dp       = build("MR#: ",trim(mrn_cnvt))											;pel
 
	 ELSEIF (E.loc_facility_cd = EU_Osseo_Hosp                                                          ;pel
			AND PA.alias_pool_cd = value(uar_get_code_by("DISPLAYKEY",263,"OSMRN")))                    ;pel
				 mrn_cnvt     = trim(pa.alias),  								                		;pel
			     barcode_mrn  = build("*",mrn_cnvt,"*")                                                 ;pel
			  	 mrn_dp       = build("MR#: ",trim(mrn_cnvt))											;pel
 
     ENDIF                                                          									;pel
   WITH NOCOUNTER                                                         								;pel
 
 
 
 
  select                                                                           			;012
                                                                                       		;012
  from encounter e,                                                                         ;012
       code_value cv                                                                        ;012
       ,code_value fac                                                                      ;012
  plan e                                                                           			;012
      where e.encntr_id = request->patient_data->person->encounter->encntr_id       		;012
  join cv                                                                           		;012
      where cv.code_value = e.loc_building_cd                                       		;012
  join fac                                                                           		;012
      where fac.code_value = e.loc_facility_cd                                      		;012
  detail                                                                            		;012
    if (fac.display = "EU*")                                                          		;012
    	prefix = substring(1,4,fac.definition)                                              ;012
    else					                                                          		;012
    	prefix = substring(1,4,cv.definition)                                               ;012
    endif					                                                          		;012
    Aztec = concat(prefix,fnbr)                                                             ;012
    d0=DetailSection(Rpt_Render)                                                            ;012
  with nocounter                                                                            ;012
 
 
;012  select
;012    d.seq
;012  from dummyt d,
;012       ;code_value_alias cva
;012       CODE_VALUE_OUTBOUND cva
;012  plan d
;012  join cva where request->patient_data->person->encounter->loc_facility_cd = cva.code_value
;012       and cva.contributor_source_cd = 25047293
;012
;012        ;642220; 414
;012;djs       and cva.contributor_source_cd = 642220; djs
;012
;012  detail
;012    prefix = substring(1,4,cva.alias);007 back to 4 from 2 ;006 was 4 ;005 was 2
;012    Aztec = concat(prefix,fnbr)
;012
;012;007    Pfx_barcode_mrn  = concat("*",prefix,trim(mrn_cnvt),"*") ;006
;012;007    pfx_mrn_dp       = concat("MR#: ",prefix,substring(1,8,mrn_cnvt));006
;012;007    pfx_barcode_fin  = concat("*",prefix,trim(fnbr),"*") ;006
;012;007    pfx_fin          = build("FIN: ",prefix,trim(fnbr)) ;006
;012    d0=DetailSection(Rpt_Render)
;012;007    call echo(pfx_mrn_dp)
;012;007    call echo(pfx_fin)
;012
;012  with nocounter;, noformfeed, DIO = POSTSCRIPT
 
  set d0 = FinalizeReport($1);"cer_print:ds.dat");request->printer_name)
  end
  go
