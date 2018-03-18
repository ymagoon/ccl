  drop program sch_itnry_by_pat_mayo_mn:dba go
create program sch_itnry_by_pat_mayo_mn:dba
/*~BB~************************************************************************
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
  ~BE~***********************************************************************/
 
/*****************************************************************************
 
        Source file name:       sch_itnry_by_pat_mayo_mn.prg
        Object name:            sch_itnry_by_pat_	_mn
        Request #:
 
        Product:                Enterprise Scheduling Management
        Product Team:           Access Management - Scheduling
        HNA Version:
        CCL Version:
 
        Program purpose:        Prints a form of scheduled appointments for the given
                                 patient including Preparation Directions
 
        Tables read:            person, person_alias, person_name, address, sch_sub_text,
                                 sch_appt, sch_location, sch_event, sch_event_disp,
                                 sch_text_link, sch_sub_list, sch_template, long_text_reference
 
        Tables updated:         None
        Executing from:
 
        Special Notes:
 
*****************************************************************************/
 
 
;~DB~************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *                                                                      *
;    *Mod Date     Engineer             Comment                             *
;    *--- -------- -------------------- ----------------------------------- *
;    * 001 05/30/01 FE011961        	Initial Release                     *
;    *                             - SR 1-1915636871                        *
;    * 002 11/17/08 AH9892              SR 1-1915636871                     *
;    * 003 04/15/09 MC4839              SR 1-3199303781                     *
;    * 004 04/16/09 MC4839              Ensure preps pulled by location     *
;    * 005 04/20/09 MC4839              Correct phone numbers               *
;    * 006 04/22/09 MC4839              Correct output destination          *
;    * 007 04/22/09 MC4839              Correct resource qualification      *
;    * 008 05/26/09 AH9892              SR 1-3258895189                     *
;    * 009 06/25/09 dg5085              fix broken code                     *
;    * 010 12/30/11 m063907             Added location "LASF ONCOLOGY"      *
;    * 011 05/23/12 m063907             Fixed issue with Preparation        *
;    *                                                                      *
;    *******************************************************************************************************
;    *Mod Date     Engineer      CAB #  Comment                                                            *
;    *--- -------- ------------ ------- ------------------------------------------------------------------ *
;                                                                                                          *
;    * 012 09/17/12 m063907	 	43719   Removed hard coded values for Ruth Vach                            *
;	 * 013 01/10/13 m075900		45909	Updated to allow for web use
;    * 014 02/14/13 m063907             Rework layout to allow changes in layout builder, changed layout
;                                       Added Lab test,  Added address for patient, changed display name for
;                                       "LASK DERM" location                                               *
;    * 015 03/12/13 m063907             Red Cedar building change                                          *
;    * 016 03/22/13 m063907             Layout change                                                      *
;    * 017 05/30/13 m063907             Changed display name for            							   *
;                                       "LASK NEUROPSYCH" location          							   *
;    * 019 03/21/14 m063907             Building name changes, Exclude locations, Exclude telemed loaction *
;                                       CAB #, 55624,57531,53043,58939         							   *
;    * 020 03/31/14 m063907             Location Name changes                                              *
;    * 021 04/14/14 M063907          	Excluse all telemed appointment type             				   *
;    * 022 04/23/14 M063907          	Cab 60411 display resource for location MAQN GI              	   *
;    * 023 08/08/14 m063907             Fix problem with lipid panel preps and duplicate lab tests         *
;    * 024 01/20/15 m063907				fixes for CABS 60618, 61637,67265, 52067, 67170                    *
;    * 025 02/02/15 m063907				CAB 68886 - Update location for "FBCV OB/GYN" and "FBCV MFM"       *
;    * 026 03/17/15 m063907				CAB 69436 - Update location                                        *
;~DE~*******************************************************************************************************
 
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************
 
%i cclsource:sch_header_ccl.inc
%i cclsource:sch_utc_sub.inc
 
free set t_list
record t_list
(
	1 beg_dt_tm				= dq8
    1 end_dt_tm 			= dq8
	1 patName 				= vc
	1 cmrn                  = vc        ;099
	1 lLocCnt 				= i4
	1 aptCnt                = i4
	1 person_id				= f8
	1 addr[*]						;016
		2 line              = vc	;016
	1 loc[*]
	    2 locCd             = f8
		2 building 			= vc
		2 building_disp		= vc ;013
		2 department 		= vc
		2 phone 			= vc
		2 lApptCnt		    = i4
		2 appt[*]
		    3 apptId        = f8
		    3 sch_event_id  = f8
		    3 encntrId		= f8 ;013
		    3 orgName		= vc ;013
			3 dt_tm			= vc ;013
			3 dt_tm_utc		= vc ;013
			3 beg_dt_tm		= dq8 ;016
    		3 end_dt_tm 	= dq8 ;016
 
			3 date 			= vc
			3 time 			= vc
			3 rscInd        = i4
			3 rscType 		= vc
			3 rscDesc		= vc ;012
			3 rscLbl		= vc
			3 lab[*]             ;016 - added this to handle multiple test for one appointment
			  4 test        = vc ;016
			  4 spec_type	= vc ;016
			3 lPrepCnt       =i4
			3 lPrepLneCnt   = i4
			3 preps[*]
			  4 prepInstruct 	= vc
) with persistscript
 
free record appt
record appt
(
  1 qual[*]
    2 appt_id = f8
)
/*****************************
* declaration of variables
******************************/
declare appt_loc_cd = f8 with protect, ;protected,  ;019
	constant(uar_get_code_by("MEANING", 14509, "APPOINTMENT"))
declare BUILDING_CD = f8 with protect, ;protected,  ;019
   constant(uar_get_code_by("DISPLAYKEY", 222, "BUILDINGS"));002
declare LASKHLTH_CD = f8 with protect, ;protected,  ;019
   constant(uar_get_code_by("DISPLAYKEY", 220, "LASKOCCHEALTH"))
declare LAOCHLTH_CD = f8 with protect, ;protected,  ;019
   constant(uar_get_code_by("DISPLAYKEY", 220, "LAOCOCCHEALTH"))
declare LASCHLTH_CD = f8 with protect, ;protected,  ;019
   constant(uar_get_code_by("DISPLAYKEY", 220, "LASCOCCHEALTH"))
declare LASKNRSE_CD = f8 with protect, ;protected,  ;019
   constant(uar_get_code_by("DISPLAYKEY", 14231, "LASKOCCHEALTHNURSE1"))
declare LAOCNRSE_CD = f8 with protect, ;protected,  ;019
   constant(uar_get_code_by("DISPLAYKEY", 14231, "LAOCOCCHEALTHNURSE1"))
declare LASCNRSE_CD = f8 with protect, ;protected,  ;019
   constant(uar_get_code_by("DISPLAYKEY", 14231, "LASCOCCHEALTHNURSE1"))
declare MEBHBEHH_CD = f8 with protect, ;protected,  ;019
   constant(uar_get_code_by("DISPLAYKEY", 220, "MEBHBEHAVHLTH"))
declare EUMB_BHBloomer_cd = f8 with protect,constant(uar_get_code_by("DISPLAYKEY", 220, "EUMBBHBLOOMER")) 	 ;019
declare EUMB_BHHallie_cd = f8 with protect,constant(uar_get_code_by("DISPLAYKEY", 220, "EUMBBHHALLIE"))		 ;019
declare EUMB_BHJourney_cd = f8 with protect,constant(uar_get_code_by("DISPLAYKEY", 220, "EUMBBHJOURNEY"))	 ;019
declare EUMB_BHRiceLake_cd = f8 with protect,constant(uar_get_code_by("DISPLAYKEY", 220, "EUMBBHRICELAKE"))	 ;019
declare EUMB_Behav_Hlth_cd = f8 with protect,constant(uar_get_code_by("DISPLAYKEY", 220, "EUMBBEHAVHLTH"))	 ;019
declare EUMB_Behav_Hlth2_cd = f8 with protect,constant(uar_get_code_by("DISPLAYKEY", 220, "EUMBBHEAUCL"))	 ;020
declare EUMN_BHCHF_cd = f8 with protect,constant(uar_get_code_by("DISPLAYKEY", 220, "EUMBBHCHFALLS"))	 ;020
 
declare Telemed_Provider_cd = f8 with protect,constant(uar_get_code_by("DISPLAYKEY", 14230, "TELEMEDPROVIDER"))	 ;019
 
declare LASF_Onc_loc_cd = f8 with protect,constant(uar_get_code_by("DISPLAYKEY", 220, "LASFONCOLOGY"))				;020
declare LASF_ONc_TX_PORT = f8 with protect,constant(uar_get_code_by("DISPLAYKEY", 14231, "LASFONCOLOGYTXPORT"))		;020
 
declare home_addr_cd = f8 with protect, ;protected,  ;019
							constant(uar_get_code_by("MEANING", 212, "HOME")) ;016
declare CMRN_cd = f8 with protect, ;protected,  ;019
 constant(uar_get_code_by("MEANING", 4, "CMRN"))     ;099
 
declare spec_type_cd = f8 with protect, ;protected,  ;019
constant(uar_get_code_by("DISPLAYKEY", 16449, "SPECIMENTYPE")) ;016
 
declare prep_cd = f8 with public, noconstant(0.0)
declare prep_type = c12 with public, noconstant(fillstring(12, " "))
declare sub_prep_cd = f8 with public, noconstant(0.0)
declare sub_prep_meaning = c12 with public, noconstant(fillstring(12, " "))
declare lLocCnt = i4 with protect, ;protected,  ;019
noconstant(0)
declare lCnt1 = i4 with protect, ;protected,  ;019
				noconstant(0)
declare lApptCnt = i4 with protect, ;protected,  ;019
				noconstant(0)
declare ApptCnt1 = i4 with protect, ;protected,  ;019
				noconstant(0)
declare ApptCnt2 = i4 with protect, ;protected,  ;019
				noconstant(0)
declare lPrepCnt1 = i4 with protect, ;protected,  ;019
				noconstant(0)
declare idx = i4 with protect, ;protected,  ;019
				noconstant(0)
declare index = i4 with protect, ;protected,  ;019
				noconstant(0)
declare idx1 = i4 with protect, ;protected,  ;019
				noconstant(0)
declare index1 = i4 with protect, ;protected,  ;019
				noconstant(0)
declare ind = i4 with protect, ;protected,  ;019
				noconstant(0)
declare lQualCnt = i4 with protect, ;protected,  ;019
				noconstant(0)
declare f_t = i4 with protect, ;protected,  ;019
				noconstant(1)
declare first_time = i2 with protect, ;protected,  ;019
				noconstant(1)
declare sRsclbl = vc with protect, ;protected,  ;019
				noconstant("")
declare loc_disp_ucase = vc with protect, ;protected,  ;019
				noconstant("")  /*003*/
 
set prep_type = "PREAPPT"
set sub_prep_meaning = "PREAPPT"
 
/*****************************
* QUERIES
******************************/
;This query retrieves the code values needed
;to get the preparation info.
select into "nl:"
   a.updt_cnt
from sch_sub_text a
where a.text_type_meaning = prep_type
    and a.sub_text_meaning = sub_prep_meaning
    and a.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
 
detail
   prep_cd = a.text_type_cd
   sub_prep_cd = a.sub_text_cd
   t_sub_text_mnemonic = a.mnemonic
with nocounter
;----------------------------
 
select into "nl:"
;select distinct into "nl:" ;FE
 prep_unique = trim(substring(1,50,build(sl.parent_table,sl.parent_id,sl.required_ind,sl.seq_nbr)))
from person r
   ,person_alias mrn                                         ;099
   ,sch_appt a
	,encounter e ;013
	,organization org ;013
   ,sch_appt a1
   ,sch_event_attach sea
   ,orders o
   ,location_group lg
   ,sch_resource sr
   ,sch_location l
   ,sch_event se
   ,phone ph1 ;returns location phone#
   ,sch_appt_type sat
   ,sch_event_detail sed
   ,prsnl pr
   ,phone ph2 ;returns physician phone#
   ,sch_event_disp sedi
   ,sch_text_link tl
   ,sch_sub_list sl
   ,sch_template t
   ,long_text_reference lt
 
 
plan r where
   parser ($4)
  ; r.person_id =    10125306.00
 
 
 
join MRN 																	;099
   where mrn.person_id = outerjoin(r.person_id)										;099
   and mrn.person_alias_type_cd = outerjoin(cmrn_cd)									;099
   and mrn.active_ind = outerjoin(1)													;099
   and mrn.end_effective_dt_tm > outerjoin(sysdate)									;099
 
 
join a where
 
   parser($2)
   and parser($3)
   ; a.beg_dt_tm >= cnvtdatetime("07-jun-2011")
   ; and a.end_dt_tm < cnvtdatetime("20-jun-2011")
    and a.person_id = r.person_id
    and a.state_meaning in ("CHECKED IN", "CHECKED OUT", "CONFIRMED","FINALIZED", "PENDING", "SCHEDULED")
    and a.role_meaning = "PATIENT"
    and a.appt_location_cd not in (LASKHLTH_CD,LAOCHLTH_CD,LASCHLTH_CD,MEBHBEHH_CD ;019)
                                   ,EUMB_BHBloomer_cd,EUMB_BHHallie_cd,EUMB_BHJourney_cd	 ;019
;020                                   ,EUMB_BHRiceLake_cd,EUMB_Behav_Hlth_cd)					 ;019
                                   ,EUMB_BHRiceLake_cd,EUMB_Behav_Hlth_cd,EUMB_Behav_Hlth2_cd    ;020
                                   ,EUMN_BHCHF_cd)	;020
 
    and a.active_ind = 1
    and a.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
 
;020 start
    and  not exists (select a1.sch_event_id
				    from sch_appt a1
					    where a1.sch_event_id = a.sch_event_id
					    and a1.appt_location_cd = LASF_Onc_loc_cd
					    and a1.role_meaning != "PATIENT"
					    and a1.state_meaning != "CANCELED"
					    and a1.state_meaning != "RESCHEDULED"
					    and a1.primary_role_ind = 1
					    and a1.active_ind = 1
					    and a1.resource_cd =  LASF_ONc_TX_PORT)
 
;020 end block
join e where ;013
	e.encntr_id = a.encntr_id ;013
 
join org where ;013
	org.organization_id = e.organization_id ;013
 
 
 
join a1 where a1.sch_event_id = outerjoin(a.sch_event_id);002
;007    and a1.role_meaning = outerjoin("RESOURCE");002
    and a1.role_meaning != outerjoin("PATIENT")  /*007*/
    and a1.state_meaning != outerjoin("CANCELED")
    and a1.state_meaning != outerjoin("RESCHEDULED")
    and a1.primary_role_ind = outerjoin(1);002
    and a1.active_ind = outerjoin(1);002
 
join sea where sea.sch_event_id =  outerjoin(a.sch_event_id)
 
join o where o.order_id = outerjoin(sea.order_id)
join lg where lg.child_loc_cd = outerjoin(a.appt_location_cd)
    and lg.location_group_type_cd = outerjoin(BUILDING_CD);002
	and lg.active_ind = outerjoin(1)
	and lg.beg_effective_dt_tm <= outerjoin(sysdate)
	and lg.end_effective_dt_tm > outerjoin(sysdate)
 
join sr where sr.resource_cd = outerjoin(a1.resource_cd)
    and sr.resource_cd != outerjoin(LASKNRSE_CD);09LAOCOCCHEALTHNURSE1)
    and sr.resource_cd != outerjoin(LAOCNRSE_CD);09LASKOCCHEALTHNURSE1)
    and sr.resource_cd != outerjoin(LASCNRSE_CD);09LASCOCCHEALTHNURSE1)
    and sr.resource_cd != outerjoin(MEBHBEHH_CD)
    and sr.active_ind = outerjoin(1)
join l where
   l.schedule_id = a.schedule_id
    and l.location_type_cd = appt_loc_cd
    and l.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
join se where
   se.sch_event_id = a.sch_event_id
   and se.protocol_seq_nbr = 0 ;002
    and se.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
 
	AND se.appt_type_cd != Telemed_Provider_cd   ;021
 
;021    and( (se.appt_type_cd = Telemed_Provider_cd
;021        and not exists ( select cv.code_value
;021					    from code_value cv,
;021					         sch_appt a3
;021					    where a3.sch_event_id = se.sch_event_id
;021					    and cv.code_value = a3.appt_location_cd
;021					    and cv.DISPLAY in ( "EUBC Urology",
;021											"EUBM Urology",
;021											"EUBC Onc/Hemato",
;021											"EUMC Alrgy/Immu",
;021											"EUMC Endocrine",
;021											"EUML CardThorac",
;021											"EUML Cardiology",
;021											"EUML Endocrine",
;021											"EUML Ortho",
;021											"EUML GI",
;021											"EUML Neurology",
;021											"EUML Onc/Hemato",
;021											"EUML PlastcSurg",
;021											"EUML PM&R",
;021											"EUML PMR",  ;020
;021											"EUML Pulm",
;021											"EUML Surgery",
;021											"EUML Urology",
;021											"EURL Urology",
;021											"MERC Endocrine",
;021											"MERC Oncology")
;021						)
;021		)
;021		or se.appt_type_cd != Telemed_Provider_cd)
 
 
join ph1 where ph1.parent_entity_name = outerjoin("LOCATION")
	and ph1.parent_entity_id = outerjoin(a.appt_location_cd)
	and ph1.active_ind = outerjoin(1)
join sat where sat.appt_type_cd = se.appt_type_cd
;FE Beg
/*join sed where sed.oe_field_meaning = "SCHORDPHYS"
	and sed.sch_event_id = se.sch_event_id
join pr where pr.name_full_formatted = sed.oe_field_display_value
	and pr.active_ind = 1
	and pr.beg_effective_dt_tm <= sysdate
	and pr.end_effective_dt_tm > sysdate*/
join sed where sed.oe_field_meaning = outerjoin("SCHORDPHYS")
	and sed.sch_event_id = outerjoin(se.sch_event_id)
join pr where pr.name_full_formatted = outerjoin(sed.oe_field_display_value)
	and pr.active_ind = outerjoin(1)
	and pr.beg_effective_dt_tm <= outerjoin(sysdate)
	and pr.end_effective_dt_tm > outerjoin(sysdate)
;FE End
join ph2 where ph2.phone_type_cd = outerjoin(163)
	and ph2.parent_entity_id = outerjoin(pr.person_id)
	and ph2.active_ind = outerjoin(1)
 
join sedi where
   sedi.sch_event_id = a.sch_event_id
    and (sedi.schedule_id = 0 or sedi.schedule_id = a.schedule_id)
    and (sedi.sch_appt_id = 0 or sedi.sch_appt_id = a.sch_appt_id)
    and sedi.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
    and sedi.active_ind = 1
join tl where
   tl.parent_id = outerjoin(se.appt_type_cd)
;   and tl.parent2_id = outerjoin(se.appt_type_cd); a.appt_location_cd
    and tl.parent_table = outerjoin("CODE_VALUE")
    and tl.parent2_table = outerjoin("CODE_VALUE")
    and tl.text_type_cd = outerjoin(prep_cd)
    and tl.sub_text_cd = outerjoin(sub_prep_cd)
    and tl.version_dt_tm = outerjoin(cnvtdatetime("31-DEC-2100 00:00:00.00"))
join sl where
   sl.parent_id = outerjoin(tl.text_link_id)
    and sl.parent_table = outerjoin("SCH_TEXT_LINK")
    and sl.version_dt_tm = outerjoin(cnvtdatetime("31-DEC-2100 00:00:00.00"))
join t where
   t.template_id = outerjoin(sl.template_id)
    and t.version_dt_tm = outerjoin(cnvtdatetime("31-DEC-2100 00:00:00.00"))
join lt where
   lt.long_text_id = outerjoin(t.text_id)
   and lt.long_text_id > outerjoin(0.0)
 
order by
   cnvtdatetime(a.beg_dt_tm),
   a.appt_location_cd,
   a.sch_appt_id,
    prep_unique
 ;   tl.text_link_id;   lt.long_text_id - commented and added by m061596 on 9/28 as per email
  ;  tl.parent2_id  ; added by m061596 on 7/22/2011
 
head report
 	t_list->person_id = e.person_id ;016
	t_list->patName = concat(trim(r.name_first), " ", trim(r.name_middle), " ",trim(r.name_last))
	t_list->cmrn = cnvtalias(mrn.alias,mrn.alias_pool_cd) 									;099
 
 
head a.beg_dt_tm
   lQualCnt = lQualCnt + 1
 
 
 
head a.appt_location_cd
 
    lLocCnt = lLocCnt + 1
    stat = alterlist(t_list->loc,lLocCnt)
    t_list->loc[lLocCnt].building =
    uar_get_code_description(lg.parent_loc_cd) ;013 removed substring
    t_list->loc[lLocCnt].building_disp = ;013
    uar_get_code_description(a.appt_location_cd) ;013
	t_list->loc[lLocCnt].locCd = a.appt_location_cd
	;t_list->loc[lLocCnt].department = substring(5, 85, uar_get_code_display(a.appt_location_cd))
	t_list->loc[lLocCnt].department = substring(5, 85, uar_get_code_description(a.appt_location_cd))
 
   	if((uar_get_code_description(a.APPT_LOCATION_CD) in ("LASK Xray" ,"LAOC Xray"))
   		or (findstring("Lab", SAT.description,1,1) > 0))
			t_list->loc[lLocCnt].phone = ph2.phone_num
   	else
   		t_list->loc[lLocCnt].phone = ph1.phone_num
   	endif
 
     lApptCnt = 0
 	 f_t = 1
 
/*003 BEGIN*/
    loc_disp_ucase = trim(cnvtupper(UAR_GET_CODE_DISPLAY(a.appt_location_cd)),3)
 
    ;OVERWRITE BUILDING AND PHONE DISPLAYS FOR GIVEN LOCATIONS
    if (loc_disp_ucase IN ("LASK ADOLECHEMD", "LASK ADULTCHEMD", "LASK BEHAV HLTH", "LASK MENTALHLTH", "LASK PSYCH"))
      t_list->loc[lLocCnt].building = "Franciscan Healthcare 212 South 11th Street"
      t_list->loc[lLocCnt].phone = "6083929555"
 
    elseif (loc_disp_ucase IN ("MAIJ PT","MAIJ OT","MAIJ SPEECHPATH"))                          		;019
      t_list->loc[lLocCnt].building = "MA Mankato - Madison East"	                            		;019
 
    elseif (loc_disp_ucase IN ("EUML ONC/HEMATO"))                          							;019
      t_list->loc[lLocCnt].building = "Dunlap Cancer Center Building"	                           		;019
 
    elseif (loc_disp_ucase IN (                          												;019
								"EULH OT",                          									;019
								"EULH PT",                          									;019
								"EULH RT",                          									;019
								"EULH SPEECHTHPY",                          							;019
								"EULH WOUNDOSTOM",                          							;019
								"EULH NEUROPHY"                          								;019
								,"EULH SpeechLang"														;020
								)                          												;019
			)						                       												;019
      t_list->loc[lLocCnt].building = "EU Eau Claire Clinic – Luther Campus Wishart Building"			;019
    elseif (loc_disp_ucase IN (                          												;019
								"EULH CARDIAC REHAB",                          							;019
								"EULH ECHO",                          									;019
								"EULH CT",                          									;019
								"EULH INTERVRAD",                          								;019
								"EULH ULTRASOUND",                          							;019
								"EULH MRI",                          									;019
								"EULH Radiology", ; Xray????                          					;019
								"EULH FLUORO"                          									;019
								,"EULH Xray"															;020
								)                          												;019
			)						                       												;019
 
      t_list->loc[lLocCnt].building = "EU Eau Claire Clinic – Luther Campus Midelfort Building West"  	;019
    elseif (loc_disp_ucase IN ("EUML ECHO RC"))                          								;019
      t_list->loc[lLocCnt].building = "ME Red Cedar - Menomonie Hospital"                           	;019
 
;010    elseif (loc_disp_ucase IN ("LASK ONCCHEMTHP", "LASK ONCOLOGY", "LASK RADONC", "LASK LAB ONCOLO"))
;010 *** LASK ONCCHEMTHP, LASK ONCOLOGY,and LASK LAB ONCOLO are all being replace with LASK ONCOLOGY 01/01/2012 ***
    elseif (loc_disp_ucase IN ("LASK ONCCHEMTHP", "LASK ONCOLOGY", "LASK RADONC", "LASK LAB ONCOLO"        ;010
                               ,"LASF ONCOLOGY" ))                                                         ;010
      t_list->loc[lLocCnt].building = "Franciscan Healthcare Cancer and Surgery Center"
      t_list->loc[lLocCnt].phone = "6083929510"  /*005*/
;005     elseif (loc_disp_ucase IN ("LASK DIABETICED", "LASK DIALECTBEH", "LASK GI", "LASK OT", "LASK PT", "LASK REHAB SRVS"))
;005       t_list->loc[lLocCnt].building = "Franciscan Skemp LaCrosse Hospital"
;005       t_list->loc[lLocCnt].phone = "6087850940"
/*005 BEGIN*/
	elseif (loc_disp_ucase IN ("LASF CT"));seperated the logic for LASF CT as per CAB:29634 on 6/3/2011 by m061596
	t_list->loc[lLocCnt].building = "La Crosse Hospital - Franciscan Healthcare"
	t_list->loc[lLocCnt].phone = "6083924490"
    elseif (loc_disp_ucase IN ("LASK DIABETICED"))
      t_list->loc[lLocCnt].building = "Franciscan Healthcare LaCrosse Hospital"
      t_list->loc[lLocCnt].phone = "6083927824"
    elseif (loc_disp_ucase IN ("LASK DIALECTBEH"))
      t_list->loc[lLocCnt].building = "Franciscan Healthcare LaCrosse Hospital"
      t_list->loc[lLocCnt].phone = "6083929555"
    elseif (loc_disp_ucase IN ("LASK GI"))
      t_list->loc[lLocCnt].building = "Franciscan Healthcare LaCrosse Hospital"
      t_list->loc[lLocCnt].phone = "6083923911"
    elseif (loc_disp_ucase IN ("LASK REHAB SRVS"))
      t_list->loc[lLocCnt].building = "Franciscan Healthcare LaCrosse Hospital"
      t_list->loc[lLocCnt].phone = "6083922257"
      elseif (loc_disp_ucase IN ("LASK OT", "LASK PT";)) ; added my m061596 cab:8868
								 ,"LASK SPEECHTHPY")) ;   024
      t_list->loc[lLocCnt].building = "Franciscan Healthcare LaCrosse Hospital" ; added my m061596 cab:8868
      t_list->loc[lLocCnt].phone = "6083929768" ; added my m061596 cab:8868
/*005 END*/
    elseif (loc_disp_ucase IN ("LASK DERM"))
;014      t_list->loc[lLocCnt].building = "Franciscan Healthcare Professional Arts Building"
      t_list->loc[lLocCnt].building = "Franciscan Healthcare LA LaCrosse Hospital"                        ;014
;005       t_list->loc[lLocCnt].phone = "6087850940"
      t_list->loc[lLocCnt].phone = "6083929491"  /*005*/
    elseif (loc_disp_ucase IN ("LASK OCCHEALTH"))
      t_list->loc[lLocCnt].building = "Franciscan Healthcare Services to Business"
;005       t_list->loc[lLocCnt].phone = "6087850940"
      t_list->loc[lLocCnt].phone = "6083929769"  /*005*/
;017    elseif (loc_disp_ucase IN ("LASK ADOLEMNHLT"))
    elseif (loc_disp_ucase IN ("LASK ADOLEMNHLT", "LASK NEUROPSYCH"))   ;017
      t_list->loc[lLocCnt].building = "Franciscan Healthcare 212 South 11th Street"
;005       t_list->loc[lLocCnt].phone = "6087850940"
      t_list->loc[lLocCnt].phone = "6083929555"  /*005*/
    elseif (loc_disp_ucase IN ("LASK PATFINSERV"))
      t_list->loc[lLocCnt].building = "Franciscan Healthcare 508 5th Avenue South"
;005       t_list->loc[lLocCnt].phone = "6087850940"
      t_list->loc[lLocCnt].phone = "6083929800"  /*005*/
    elseif (loc_disp_ucase IN ("LASF ONA MOBILE"))
      t_list->loc[lLocCnt].building = "Franciscan Healthcare Onalaska Clinic"
;005       t_list->loc[lLocCnt].phone = "6087850940"
      t_list->loc[lLocCnt].phone = "6083924490"  /*005*/
    elseif (loc_disp_ucase IN ("EUML RC VISIT"))                 			;015
          t_list->loc[lLocCnt].building = "Red Cedar - Menomonie Clinic"   	;015
 
;025	elseif (loc_disp_ucase IN ("FBCV OB/GYN")) ;023
;025		t_list->loc[lLocCnt].building = "Women's Health   Allina - District One Hospital" ;023
;025		t_list->loc[lLocCnt].phone = "5073333300" ;023
 
    elseif (loc_disp_ucase IN ("LASK BREASTCARE","LASK PLASTCSURG"))					                    ;026
      	t_list->loc[lLocCnt].building = "LA La Crosse Hospital - Franciscan Healthcare"                     ;026
 
 
	elseif (loc_disp_ucase IN ("FBCV OB/GYN","FBCV MFM")) ;025
		t_list->loc[lLocCnt].building = "Mayo Clinic Health System - Faribault Women's Health" ;025
		t_list->loc[lLocCnt].phone = "5073333300" ;025
 
    endif
/*003 END*/
 
head a.sch_appt_id
 
      lApptCnt = lApptCnt + 1
      ApptCnt2 = ApptCnt2 + 1
      t_list->aptCnt = t_list->aptCnt + 1
      stat = alterlist(appt->qual,ApptCnt2)
      appt->qual[ApptCnt2].appt_id = a.sch_appt_id
      stat = alterlist(t_list->loc[lLocCnt].appt,lApptCnt)
      t_list->loc[lLocCnt].appt[lApptCnt].apptId = a.sch_appt_id
      t_list->loc[lLocCnt].appt[lApptCnt].sch_event_id = a.sch_event_id ;016
	  t_list->loc[lLocCnt].appt[lApptCnt].encntrId = a.encntr_id ;013
	  t_list->loc[lLocCnt].appt[lApptCnt].orgName = org.org_name ;013
	  t_list->loc[lLocCnt].appt[lApptCnt].rscDesc = sat.description ;013
 
      t_list->beg_dt_tm = a.beg_dt_tm
	  t_list->end_dt_tm = a.end_dt_tm
	  t_list->loc[lLocCnt].appt[lApptCnt].dt_tm = ;013
			format(a.beg_dt_tm, "MM/DD/YYYY HH:MM:SS;;Q") ;013
	  t_list->loc[lLocCnt].appt[lApptCnt].dt_tm_utc = ;013
			trim(format(cnvtdatetimeutc(a.beg_dt_tm, 3),"YYYY-MM-DDTHH:MM:SSZ;3;Q"), 3) ;013
      t_list->loc[lLocCnt].appt[lApptCnt].date =
;pel          format(t_list->beg_dt_tm, "@SHORTDATE")
          format(t_list->beg_dt_tm, "wwwwwwwww mm/dd/yy;;d")
      t_list->loc[lLocCnt].appt[lApptCnt].time =
          ;format(t_list->beg_dt_tm, "@TIMENOSECONDS")
          format(t_list->beg_dt_tm,"HH:MM;;S")
 	t_list->loc[lLocCnt].appt[lApptCnt].beg_dt_tm = a.beg_dt_tm ;016
 	t_list->loc[lLocCnt].appt[lApptCnt].end_dt_tm = a.end_dt_tm ;016
 
;CAB 52067 - this is causing the first few characters to be cut off for "Schedule Procedure GI Colonoscopy Screening"
      if(sat.description like "GI*" and o.order_mnemonic > "")
;024        if(cnvtupper(o.order_mnemonic) like "SCH*")
        if(o.order_mnemonic like "SCH*")   ;024
           t_list->loc[lLocCnt].appt[lApptCnt].rscInd = 3
           t_list->loc[lLocCnt].appt[lApptCnt].rscType =
                substring(4,40,o.order_mnemonic)
        else
           t_list->loc[lLocCnt].appt[lApptCnt].rscInd = 3
            t_list->loc[lLocCnt].appt[lApptCnt].rscType =
                o.order_mnemonic
        endif
      elseif(sea.description in ("BD*","CT*","NM*","IR*",
          "MA*","ST*","FL*","XR*","MR*","PET*","US*"))
 
            t_list->loc[lLocCnt].appt[lApptCnt].rscInd = 3
            t_list->loc[lLocCnt].appt[lApptCnt].rscType =  o.order_mnemonic
      elseif(cnvtupper(sea.description) like "LAB*" or cnvtupper(sat.description) like "LAB*")
            t_list->loc[lLocCnt].appt[lApptCnt].rscInd = 2
            t_list->loc[lLocCnt].appt[lApptCnt].rscType =
                o.order_mnemonic
      else t_list->loc[lLocCnt].appt[lApptCnt].rscInd = 1
            if(a.grpsession_id > 0)
              t_list->loc[lLocCnt].appt[lApptCnt].rscType =
                sat.description
            else
              t_list->loc[lLocCnt].appt[lApptCnt].rscType =
              sr.description
            endif
      endif
;012 ; added for CAB 8618, 9134 by m061596
;012 		if (t_list->loc[lLocCnt].appt[lApptCnt].rscType ="Dunaway, Linda A")
;012 		  t_list->loc[lLocCnt].building = "Franciscan Skemp La Crosse Campus Skemp Building"
;012	      t_list->loc[lLocCnt].phone = "6083929872 "
;012;	      t_list->loc[lLocCnt].department ="Psychiatry"
;012 		endif
 
;012 		if (t_list->loc[lLocCnt].appt[lApptCnt].rscType ="Vach, Ruth F")
;012 		  t_list->loc[lLocCnt].building = "Franciscan Skemp LaCrosse Campus St Francis Building"
;012	      t_list->loc[lLocCnt].phone = "6083927824"
;012	;      t_list->loc[lLocCnt].department = "Health Education"
;012 		endif
; addition ends here for CAB 8618, 9134
 
; ;**** added om 3/24/2010 by m061596 for CAB:15372******
;		if (loc_disp_ucase IN ("LASK CVSERVICES"))
;	 		t_list->loc[lLocCnt].appt[lApptCnt].rscInd = 1
;	 		 	sRscLbl = "Resource"
;	    	t_list->loc[lLocCnt].appt[lApptCnt].rscType = "LASK Cardiopulm Diag"
; 		   t_list->loc[lLocCnt].phone = "6083926267"  /*005*/
; 	   endif
; ; addition ends here for CAB: 15372
 ;*****added om 19/3/2010 by m061596 as per CAB 11029*****
;022 if (loc_disp_ucase IN ("MAIC GI/HEP", "MAIC MNVALL HSP", "MASP OUT-GI", "MAWH GI CLINIC"))
 if (loc_disp_ucase IN ("MAIC GI/HEP", "MAIC MNVALL HSP", "MASP OUT-GI", "MAWH GI CLINIC"   ;022
                        ,"MAQN GI" ;)) 														;022
                        ,"MALS OUT-GI" 														;024
                        )) 																	;024
 
	          		t_list->loc[lLocCnt].appt[lApptCnt].rscInd = 1
    	     		if(a.grpsession_id > 0)
        			      t_list->loc[lLocCnt].appt[lApptCnt].rscType =
			              sat.description
			              	sRscLbl = "Resource"
				    		t_list->loc[lLocCnt].appt[lApptCnt].rscLbl = sRscLbl
            		else
              			  t_list->loc[lLocCnt].appt[lApptCnt].rscType =
			              sr.description
			              sRscLbl = "Resource"
				    	  t_list->loc[lLocCnt].appt[lApptCnt].rscLbl = sRscLbl
            		endif
	    endif
; *...addition ends here on 19/3/2010********
 
      ;3 - Exam, 2 - Test, 1 - Resource
      if (f_t = 0)
      	case(t_list->loc[lLocCnt].appt[lApptCnt].rscInd)
      		of 3: if (sRscLbl != "Exam")
      				sRscLbl = "Resource/Exam/Test"
      			  endif
      		of 2: if (sRscLbl != "Test")
      				sRscLbl = "Resource/Exam/Test"
      			  endif
      		else  if (sRscLbl != "Resource")
      				sRscLbl = "Resource/Exam/Test"
      			  endif
      	endcase
      else
      	case(t_list->loc[lLocCnt].appt[lApptCnt].rscInd)
      		of 3: sRscLbl = "Exam"
      		of 2: sRscLbl = "Test"
      		else  sRscLbl = "Resource"
      	endcase
      	f_t = 0
      endif
 	  t_list->loc[lLocCnt].appt[lApptCnt].rscLbl = sRscLbl
 
      lPrepCnt1 = 0
 
      head  prep_unique
 ; head tl.text_link_id  ;lt.long_text_id - commented by m061596 on 9/28 per email
  ;from Jolley,Chris [Chris.Jolley@Cerner.com]
;head tl.parent2_id ; head lt.long_text_id - commented and added by m061596 on 7/22/2011 ; this line commented
;by m061596 on 09/22/2011
     ; null
 
;004 COMMENT: adding check for location in detail section since we cannot do an RDBMS outerjoin to more than one table.
;004          the only alternatives would have been to convert to a discern (dummyt) outerjoin or break these tables out
;004          into a separate SELECT statement.  using a check in the detail section should provide the same functionality
;004          with minimal impact to the existing logic.
;004
 ; if (lt.long_text > " ")
 ; call echo ("In the if condition")
	  if (lt.long_text > " " and tl.parent2_id = a.appt_location_cd)  /*004*/
	call echo ("In the if condition with parent2 logic")
      lPrepCnt1 = lPrepCnt1 + 1
      t_list->loc[lLocCnt].appt[lApptCnt].lPrepCnt = lPrepCnt1
      stat = alterlist(t_list->loc[lLocCnt].appt[lApptCnt].preps,lPrepCnt1)
      t_list->loc[lLocCnt].appt[lApptCnt].preps[lPrepCnt1].prepInstruct =
        lt.long_text
 
       t_list->loc[lLocCnt].appt[lApptCnt].lPrepLneCnt =
       t_list->loc[lLocCnt].appt[lApptCnt].lPrepLneCnt +
       (size(trim(lt.long_text,3)) / 80)
      endif
with nocounter
 
 
 
 
;016 get additional lab values
 
call echo (spec_type_cd)
select into ("nl")
o.order_id
 
from (dummyt d1 with seq = size(t_list->loc,5))
	,(dummyt d2 with seq = 1)
   	,sch_event_attach sea
   	,orders o
   	,order_detail od
PLAN D1
	where maxrec(d2,size(t_list->loc[d1.seq].appt,5))
JOIN D2
	where t_list->loc[d1.seq].appt[d2.seq].rscInd = 2
join sea where sea.sch_event_id =  t_list->loc[d1.seq].appt[d2.seq].sch_event_id
 
join o where o.order_id = sea.order_id
join od
	where od.order_id = outerjoin(o.order_id)
	and od.oe_field_id = outerjoin(spec_type_cd)
;join od
;	where od.order_id = outerjoin(o.order_id)
;	and od.oe_field_id = outerjoin(spec_type_cd)
order d1.seq,d2.seq,o.order_id, od.action_sequence desc  ;023
 
 
head report l_cnt = 0
 
head d1.seq
    l_cnt = 0
head d2.seq
	call echo("head d2.seq")
	l_cnt = 0
;023 detail
head o.order_id  ;023
 
	l_cnt = l_cnt + 1
	stat = alterlist(t_list->loc[d1.seq].appt[d2.seq].lab,l_cnt)
	t_list->loc[d1.seq].appt[d2.seq].lab[l_cnt].test = o.order_mnemonic
	t_list->loc[d1.seq].appt[d2.seq].lab[l_cnt].spec_type = od.oe_field_display_value
	call echo(o.order_mnemonic)
	call echo(l_cnt)
	call echo("in lab_orders section")
 
with nocounter
 
 
;determine the preps that are tied to the order
 
select into "nl:"
from
 
sch_appt a
,sch_event_attach sea
,orders o
,sch_text_link stl
,sch_sub_list ssl
,sch_template st
,long_text_reference ltr
,sch_location sl
 
 
plan a where
expand(ind,1,ApptCnt2,a.sch_appt_id,appt->qual[ind].appt_id)
 
join sl where
    sl.schedule_id = a.schedule_id
    and sl.location_type_cd =  appt_loc_cd
    and sl.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
join sea where sea.sch_event_id =  a.sch_event_id
join o where o.order_id = sea.order_id
join stl where stl.parent_id =  o.catalog_cd
	and stl.parent_table =  "CODE_VALUE"
	and stl.sub_text_meaning = "PREAPPT"
	and stl.parent2_id =  sl.location_cd
    and stl.parent2_table = "CODE_VALUE"
    and stl.text_type_cd =  prep_cd
    and stl.sub_text_cd =  sub_prep_cd
    and stl.version_dt_tm =  cnvtdatetime("31-DEC-2100 00:00:00.00")
join ssl where ssl.parent_id =  stl.text_link_id
     and ssl.parent_table =  "SCH_TEXT_LINK"
     and ssl.version_dt_tm =   cnvtdatetime("31-DEC-2100 00:00:00.00")
join st where st.template_id =  ssl.template_id
  	and st.active_ind = 1
    and st.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
join ltr where ltr.long_text_id =  st.text_id
	and ltr.active_ind = 1
 
order by
;a.appt_location_cd,
a.sch_appt_id,ltr.long_text_id
 
;head a.appt_location_cd
    ;index = 0
    ;index = locateval(idx,1,lLocCnt,a.appt_location_cd, t_list->loc[idx].locCd)
    ;ApptCnt1 = size(t_list->loc[index].appt,5)
 
head a.sch_appt_id
    ;do a for loop so that it is put in the correct location
    ;in the record structure.
    Fnd = 0
    index = 0
    i = 1
;011    while(i <= lQualCnt and Fnd = 0)
    while(i <=  t_list->aptCnt and Fnd = 0)  ;;;011 ***********
 
      ;find location
      ApptCnt1 = size(t_list->loc[i].appt,5)
      for(j = 1 to ApptCnt1)
;023        if(a.sch_appt_id = t_list->loc[i].appt[index1].apptId)
        if(a.sch_appt_id = t_list->loc[i].appt[J].apptId)  ;023
           Fnd = 1
           index = i
           index1 = j
        endif
      endfor
        i = i + 1
    endwhile
    ;index = 0
    ;index = locateval(idx,1,lLocCnt,a.appt_location_cd, t_list->loc[idx].locCd)
    ;ApptCnt1 = size(t_list->loc[index].appt,5)
    ;index1 = 0
    ;index1 = locateval(idx1,1,ApptCnt1,a.sch_appt_id,
     ;t_list->loc[index].appt[idx1].apptId)
 
    lPrepCnt1 = size(t_list->loc[index].appt[index1].preps,5)
 
 
head ltr.long_text_id
 
     lPrepCnt1 = lPrepCnt1 + 1
     stat = alterlist(t_list->loc[index].appt[index1].preps,lPrepCnt1)
     t_list->loc[index].appt[index1].preps[lPrepCnt1].prepInstruct =
     ltr.long_text
 
 
     t_list->loc[index].appt[index1].lPrepLneCnt =
       t_list->loc[index].appt[index1].lPrepLneCnt +
       (size(trim(ltr.long_text,3)) / 200)
 
 
with nocounter
 
 
 
 
;016 get address for patient
 
select into "nl:"
from address a
where a.parent_entity_id = t_list->person_id
	and a.parent_entity_name = "PERSON"
	and a.address_type_cd = home_addr_cd
	and a.active_ind = 1
detail
  addr_line_cnt = 0
  temp_line = fillstring(100," ")
  if (a.street_addr > " ")
     addr_line_cnt  = addr_line_cnt + 1
     stat = alterlist(t_list->addr,addr_line_cnt)
     t_list->addr[addr_line_cnt].line = a.street_addr
  endif
  if (a.street_addr2 > " ")
     addr_line_cnt  = addr_line_cnt + 1
     stat = alterlist(t_list->addr,addr_line_cnt)
     t_list->addr[addr_line_cnt].line = a.street_addr2
  endif
    if (a.street_addr3 > " ")
     addr_line_cnt  = addr_line_cnt + 1
     stat = alterlist(t_list->addr,addr_line_cnt)
     t_list->addr[addr_line_cnt].line = a.street_addr3
  endif
  if (a.street_addr4 > " ")
     addr_line_cnt  = addr_line_cnt + 1
     stat = alterlist(t_list->addr,addr_line_cnt)
     t_list->addr[addr_line_cnt].line = a.street_addr4
  endif
   if (a.city_cd > 0)
	   temp_line = trim(uar_get_code_display(a.city_cd))
   else
       temp_line = trim(a.city)
   endif
   if (a.state_cd > 0 )
     call echo ("state code > 0")
     call echo(temp_line)
     call echo(uar_get_code_display(a.state_cd))
	   temp_line = concat(trim(temp_line),", ",
	                      trim(uar_get_code_display(a.state_cd))
	                      )
   else
       temp_line = concat(trim(temp_line),", ",trim(a.state))
   endif
   call echo(temp_line)
 
   if (a.zipcode > " " )
	   temp_line = concat(trim(temp_line)," ",
	                      trim(a.zipcode))
   endif
   call echo(temp_line)
 
   if (temp_line > " ")
     addr_line_cnt  = addr_line_cnt + 1
     stat = alterlist(t_list->addr,addr_line_cnt)
     t_list->addr[addr_line_cnt].line = temp_line
  endif
with nocounter
;006 execute sch_mayo_mn_layout_code value($1)
;execute sch_mayo_mn_layout_code value("MINE")
call echorecord(t_list) ;FE
call echorecord(appt)
 
/*006 BEGIN*/
declare output_dest = vc with protect, noconstant("")
set output_dest = $1
 
if (cnvtlower(substring(1,10,output_dest)) = "cer_print/"
  and cnvtlower(substring(textlen(output_dest)-3,4,output_dest)) != ".dat")
  set output_dest = concat(output_dest,".dat")
endif
 
 
execute sch_itnry_layout_mayo_mn  value(output_dest)
;execute sch_itnry_layout_mayo_mn_tmp  value(output_dest)
;execute sch_mayo_mn_layout_code3 value(output_dest)
;;execute sch_mayo_mn_layout_code value(output_dest)
/*006 END*/
 
;set last_mod = "009 6/25/09 SR 1-3258895189"
 
end
go
