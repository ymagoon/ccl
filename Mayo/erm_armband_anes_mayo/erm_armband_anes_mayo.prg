drop program erm_armband_Anes_mayo:dba go
create program erm_armband_Anes_mayo:dba
 
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
 *013 05/09/14 m063907              Use REFERING MRN for specific Hospitals
 *014 05/18/14 m063907              check end effective dt_tm on person alias
 *015 04/06/14 m026751 / JTW        Modified program name to erm_armband_Anes_mayo
 *                                  removed much of the label, reduced to
 *016  05/1/15 m142151   			Modified datatypes used in subroutine
 *									to prevent trailing spaces from being
 *									truncated
 ***********************************************************************
 
 ******************  END OF ALL MODCONTROL BLOCKS  ********************/
%i cclsource:pm_hl7_formatting.inc
execute reportrtl
%i mhs_prg:erm_armband_Anes_mayo.dvl
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
declare cmrn_dp = vc													;pel
declare CMRN_cd = f8 with protect, constant(uar_get_code_by("MEANING", 4, "CMRN"))     ;pel
 
declare EU_Bloomer_Hosp = F8 			;013
declare EU_EauCl_Hosp = F8				;013
declare EU_EauCl_bh = F8				;013
declare EU_Barron_Hosp = F8				;013
declare EU_Osseo_Hosp = F8				;013
 
declare cmrn_format = vc
declare cmrn_alias = vc
;declare cmrn_cnvt = vc					;016
declare cmrn_cnvt = vc					;016
declare checkdgt = vc
declare checkdgtmeth = f8
 
;declare for check digit subroutine
declare checkDigits 		= vc with public, constant("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%")   ;015
declare maxCheckDigit 		= i2 with public, constant(textlen(checkDigits))							;015
declare checkDigitFormatted = vc																		;015
declare checkDigitsLen		= i2																		;015
declare idx 				= i2 ;clinicNumber digitCounter												;015
declare sum					= i2																		;015
declare modulus				= i2																		;015
declare hold_num			= i2																		;015
declare temp_clinicDigit	= c1																		;015
declare cmrn_cnvt_fmted		= vc																		;015
declare GenerateCheckDigit (cMRN = vc (ref)) = vc  ;subroutine declaration								;015
declare chkdgt = c1 with public, noconstant(" ")														;016
 
;    3196529.00	        220	FACILITY	EU Bloomer Hosp
;     633867.00	        220	FACILITY	EU EauCl Hosp
;    3196527.00	        220	FACILITY	EU Barron Hosp
;    3196531.00	        220	FACILITY	EU Osseo Hosp
select into "nl:"															;013
	from code_value cv														;013
where cv.code_set = 220														;013
	and cv.cdf_meaning = "FACILITY" 										;013
	AND CV.ACTIVE_IND = 1													;013
	AND CV.DISPLAY_KEY IN (													;013
							"EUEAUCLHOSP",									;013
							"EUEAUCLHOSPBH",
							"EUBARRONHOSP",									;013
							"EUBLOOMERHOSP",								;013
							"EUOSSEOHOSP"									;013
							)												;013
DETAIL																		;013
   IF (CV.DISPLAY_KEY = "EUEAUCLHOSP")										;013
		EU_EauCl_Hosp = CV.CODE_VALUE										;013
   ELSEIF (CV.DISPLAY_KEY = "EUEAUCLHOSPBH")								;013
		EU_EauCl_bh = CV.CODE_VALUE											;013
   ELSEIF (CV.DISPLAY_KEY = "EUBARRONHOSP")									;013
		EU_Barron_Hosp = CV.CODE_VALUE										;013
   ELSEIF (CV.DISPLAY_KEY = "EUBLOOMERHOSP")								;013
		EU_Bloomer_Hosp = CV.CODE_VALUE 									;013
   ELSEIF (CV.DISPLAY_KEY = "EUOSSEOHOSP")									;013
		EU_Osseo_Hosp = CV.CODE_VALUE										;013
   ENDIF																	;013
WITH NOCOUNTER																;013
 
 
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
  set cmrn_format   = request->patient_data->person->cmrn->alias_pool_cd
  set cmrn_alias    = request->patient_data->person->cmrn->alias
  set cmrn_cnvt     = cnvtalias(cmrn_alias, cmrn_format)
  set cmrn_cnvt     = format(cmrn_cnvt,"########;p0")
 
  ;call echo(build2("cmrn_cnvt:", cmrn_cnvt)) ;015
 
  ;if "AC" is not first two characters of MRN then add it
if (substring(1,2,cmrn_cnvt) != "AC")						;015
	set cmrn_cnvt = concat("AC", cmrn_cnvt)					;015
endif														;015
 
 ;call echo(build2("cmrn_cnvt:", cmrn_cnvt))				;016
 
  set checkDigitsLen = textlen(trim(cmrn_cnvt)) 			;016
 
  ;call echo(build2("checkDigitsLen:", checkDigitsLen))		;016
 
  set cmrn_cnvt_fmted = GenerateCheckDigit(cmrn_cnvt) 		;015
 
  ;call echo(build2("cmrn_cnvt_fmted:",cmrn_cnvt_fmted))	;016
 
  if (modulus = 39)											;016
    set barcode_mrn  = build2("*",cmrn_cnvt_fmted," *") 	;016
  else														;016
    set barcode_mrn = build("*",cmrn_cnvt_fmted, "*")		;016
  endif														;016
 
  ;call echo(barcode_mrn)									;016
  ;call echo(build("mod:",modulus))							;016
 
  ;;build(cmrn_cnvt) ;015
  set mrn_dp       = build("MR#: ",trim(mrn_cnvt))
  set cmrn_dp       = build("CLINIC#: ",trim(mrn_cnvt))											;pel
 
  set checkdgt = request->patient_data->person->cmrn->check_digit
  set checkdgtmeth = request->patient_data->person->cmrn->check_digit_method_cd
 
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
 
;013 START BLOCK CHANGES
;  CHECK FOR REFERING MRN  FOR THE 4 HOSPITALS ******
 
  select into "nl:"                                                                						;013
                                                                                       					;013
  from encounter e,                                                                         			;013
       PERSON_ALIAS Pa                                                          						;013
  plan e                                                                           						;013
      where e.encntr_id = request->patient_data->person->encounter->encntr_id       					;013
      AND E.loc_facility_cd IN ( EU_Bloomer_Hosp,                                                       ;013
								 EU_EauCl_Hosp, 														;013
								 EU_EauCl_bh,                                                           ;013
								 EU_Barron_Hosp,                                                        ;013
								 EU_Osseo_Hosp                                                          ;013
							   )                                                          				;013
  join PA                                                          										;013
  	where PA.PERSON_ID = E.person_id                                                          			;013
  	and PA.PERSON_ALIAS_TYPE_CD  IN ( value(uar_get_code_by("MEANING",4,"OTHER")),                      ;013
  									  value(uar_get_code_by("MEANING",4,"REF_MRN")))                    ;013
  	and PA.active_ind = 1                                                          						;013
    and pa.end_effective_dt_tm > sysdate                  												;014
  DETAIL                                                          										;013
     IF  (E.loc_facility_cd = EU_Bloomer_Hosp                                                          	;013
           AND PA.alias_pool_cd = value(uar_get_code_by("DISPLAYKEY",263,"BLMRN"))                      ;013
          )                                                          									;013
				 mrn_cnvt     = concat("M",																;013
			  	 						format(pa.alias,"#######;p0")),                  				;013
			     barcode_mrn  = build("*",mrn_cnvt,"*")                                                 ;013
			  	 mrn_dp       = build("MR#: ",trim(mrn_cnvt))											;013
 
	 ELSEIF (E.loc_facility_cd in ( EU_EauCl_Hosp,EU_EauCl_bh)			                                ;013
			AND PA.alias_pool_cd = value(uar_get_code_by("DISPLAYKEY",263,"LHMRN")))					;013
			     if (size(trim(pa.alias)) = 5)															;013
   				 	mrn_cnvt     = concat("10000",														;013
			  	 						format(pa.alias,"#####;p0"))                  		    ;013
			  	 elseif (size(trim(pa.alias)) = 6)														;013
   				 	mrn_cnvt     = concat("1000",														;013
			  	 						format(cnvtint(pa.alias),"######;p0"))                  		;013
				endif																					;013
 
			     barcode_mrn  = build("*",mrn_cnvt,"*")                                                 ;013
			  	 mrn_dp       = build("MR#: ",trim(mrn_cnvt))											;013
 
	 ELSEIF (E.loc_facility_cd = EU_Barron_Hosp															;013
			AND PA.alias_pool_cd = value(uar_get_code_by("DISPLAYKEY",263,"BAMRN")))					;013
				 mrn_cnvt     = trim(pa.alias),  								                		;013
			     barcode_mrn  = build("*",mrn_cnvt,"*")                                                 ;013
			  	 mrn_dp       = build("MR#: ",trim(mrn_cnvt))											;013
 
	 ELSEIF (E.loc_facility_cd = EU_Osseo_Hosp                                                          ;013
			AND PA.alias_pool_cd = value(uar_get_code_by("DISPLAYKEY",263,"OSMRN")))                    ;013
				 mrn_cnvt     = trim(pa.alias),  								                		;013
			     barcode_mrn  = build("*",mrn_cnvt,"*")                                                 ;013
			  	 mrn_dp       = build("MR#: ",trim(mrn_cnvt))											;013
 
     ENDIF                                                          									;013
   WITH NOCOUNTER                                                         								;013
 
 
  set eu_only_ind = 0  																		;PEL
 
 
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
        eu_only_ind = 1																		;PEL
    	prefix = substring(1,4,fac.definition)                                              ;012
    else					                                                          		;012
        eu_only_ind = 0																		;PEL
    	prefix = substring(1,4,cv.definition)                                               ;012
    endif					                                                          		;012
 
    Aztec = concat(prefix,fnbr)                                                             ;012
    d0=DetailSection(Rpt_Render)                                                            ;012
  with nocounter                                                                            ;012
 
 
subroutine GenerateCheckDigit(mrn) ;subroutine to generate checkdigit for mod 43 - begin #015
 
;reduced to single for statement for efficiency
for (idx = 1 to checkDigitsLen) ;1 to 10
;set temp_clinicDigit to corresponding idx character of clinicDigit (MRN)
	set temp_clinicDigit = substring(idx,1,mrn)
;find position of clinicDigit[idx] in checkDigits; added -1 to formula because C# lists start at 0, CCL lists start at 1
	set hold_num = findstring(temp_clinicDigit,checkDigits) - 1
 
;formula for sum; added +1 to formula to account for C#/CCL list difference
	set sum = sum + ((checkDigitsLen - idx + 1) * hold_num)
endfor
 
set modulus = mod(sum,43) + 1 ;account for C#/CCL list difference
;call echo(build("modulus:", modulus))								;016
 
set chkdgt = substring(modulus,1,checkDigits)						;016
;call echo(build("chkdgtassignment:",chkdgt))						;016
 
set checkDigitFormatted = build(mrn, chkdgt)						;016
;call echo(build("checkDigitFormatted",CheckDigitFormatted))		;016
 
return (checkDigitFormatted)
end ;endsub - end #015
 
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
