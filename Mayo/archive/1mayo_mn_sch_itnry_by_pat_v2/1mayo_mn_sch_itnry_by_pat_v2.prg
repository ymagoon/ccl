drop program 1mayo_mn_sch_itnry_by_pat_v2:dba go
create program 1mayo_mn_sch_itnry_by_pat_v2:dba
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
 
        Source file name:       1mayo_mn_sch_itnry_by_pat_v2.prg
        Object name:            1mayo_mn_sch_itnry_by_pat_v2
        Request #:
 
        Product:                Enterprise Scheduling Management
        Product Team:           Access Management - Scheduling
        HNA Version:
        CCL Version:
 
        Program purpose:        Pulls patient appointments to be used by MAYO_MN patient portal MPage
								in IQHealth.
 
        Tables read:            person, person_alias, person_name, address, sch_sub_text,
                                 sch_appt, sch_location, sch_event, sch_event_disp,
                                 sch_text_link, sch_sub_list, sch_template, long_text_reference
 
        Tables updated:         None
        Executing from:
 
        Special Notes:			This file was copied from sch_itnry_by_pat_mayo_mn, and
								duplicated to prevent complications.
 
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
;    * 014 02/14/14 m026751             Include for Cerner outside package
;    * 015 04/01/14 m063907             Building name changes, Exclude locations, Exclude telemed loaction *
;                                       CAB #, 55624,57531,53043,58939,59469        							   *
;    * 016 04/23/14 m063907             Added appointment type checks to exclude                           *
;    * 017 08/08/14 m063907             Fix problem with lipid panel preps                                 *
;    * 018 01/20/15 m063907				fixes for CABS 60618, 61637,67265, 52067, 67170                    *
;    * 019 01/20/15 m063907				Building update for CAB 67947- "FBCV OB/GYN"                       *
;    * 020 02/02/15 m063907				CAB 68886 - Update location for "FBCV OB/GYN" and "FBCV MFM"       *
 
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
	1 lLocCnt 				= i4
	1 aptCnt                = i4
	1 loc[*]
	    2 locCd             = f8
		2 building 			= vc
		2 building_cd 		= f8
		2 building_disp		= vc ;013
		2 department 		= vc
		2 phone 			= vc
		2 lApptCnt		    = i4
		2 appt[*]
		    3 apptId        = f8
		    3 encntrId		= f8 ;013
		    3 orgName		= vc ;013
			3 appt_dt_tm	= dq8
			3 dt_tm			= vc ;013
			3 dt_tm_utc		= vc ;013
			3 date 			= vc
			3 time 			= vc
			3 rscInd        = i4
			3 rscType 		= vc
			3 rscDesc		= vc ;012
			3 rscLbl		= vc
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
declare appt_loc_cd = f8 with protected,
	constant(uar_get_code_by("MEANING", 14509, "APPOINTMENT"))
declare BUILDING_CD = f8 with protected,
   constant(uar_get_code_by("DISPLAYKEY", 222, "BUILDINGS"));002
declare LASKHLTH_CD = f8 with protected,
   constant(uar_get_code_by("DISPLAYKEY", 220, "LASKOCCHEALTH"))
declare LAOCHLTH_CD = f8 with protected,
   constant(uar_get_code_by("DISPLAYKEY", 220, "LAOCOCCHEALTH"))
declare LASCHLTH_CD = f8 with protected,
   constant(uar_get_code_by("DISPLAYKEY", 220, "LASCOCCHEALTH"))
declare LASKNRSE_CD = f8 with protected,
   constant(uar_get_code_by("DISPLAYKEY", 14231, "LASKOCCHEALTHNURSE1"))
declare LAOCNRSE_CD = f8 with protected,
   constant(uar_get_code_by("DISPLAYKEY", 14231, "LAOCOCCHEALTHNURSE1"))
declare LASCNRSE_CD = f8 with protected,
   constant(uar_get_code_by("DISPLAYKEY", 14231, "LASCOCCHEALTHNURSE1"))
declare MEBHBEHH_CD = f8 with protected,
   constant(uar_get_code_by("DISPLAYKEY", 220, "MEBHBEHAVHLTH"))
 
declare prep_cd = f8 with public, noconstant(0.0)
declare prep_type = c12 with public, noconstant(fillstring(12, " "))
declare sub_prep_cd = f8 with public, noconstant(0.0)
declare sub_prep_meaning = c12 with public, noconstant(fillstring(12, " "))
declare lLocCnt = i4 with protected,noconstant(0)
declare lCnt1 = i4 with protected,noconstant(0)
declare lApptCnt = i4 with protected,noconstant(0)
declare ApptCnt1 = i4 with protected,noconstant(0)
declare ApptCnt2 = i4 with protected,noconstant(0)
declare lPrepCnt1 = i4 with protected,noconstant(0)
declare idx = i4 with protected,noconstant(0)
declare index = i4 with protected,noconstant(0)
declare idx1 = i4 with protected,noconstant(0)
declare index1 = i4 with protected,noconstant(0)
declare ind = i4 with protected,noconstant(0)
declare lQualCnt = i4 with protected,noconstant(0)
declare f_t = i4 with protected,noconstant(1)
declare first_time = i2 with protected, noconstant(1)
declare sRsclbl = vc with protected, noconstant("")
declare loc_disp_ucase = vc with protected, noconstant("")  /*003*/
 
declare Telemed_Provider_cd = f8 with protect,constant(uar_get_code_by("DISPLAYKEY", 14230, "TELEMEDPROVIDER"))	 ;015
 
declare LASF_Onc_loc_cd = f8 with protect,constant(uar_get_code_by("DISPLAYKEY", 220, "LASFONCOLOGY"))				;015
declare LASF_ONc_TX_PORT = f8 with protect,constant(uar_get_code_by("DISPLAYKEY", 14231, "LASFONCOLOGYTXPORT"))		;015
declare occ_hlth_nurse_visit_cd  = f8 with protect,																	;016
                                   constant(uar_get_code_by("DISPLAYKEY", 14230, "OCCHEALTHNURSEVISIT"))			;016
declare dot_appt_type_cd  = f8 with protect,																	;016
                                   constant(uar_get_code_by("DISPLAYKEY", 14230, "DOT"))			;016
 
 
 
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
 
join a where
 
   parser($2)
   and parser($3)
   ; a.beg_dt_tm >= cnvtdatetime("07-jun-2011")
   ; and a.end_dt_tm < cnvtdatetime("20-jun-2011")
    and a.person_id = r.person_id
    and a.state_meaning in ("CHECKED IN", "CHECKED OUT", "CONFIRMED","FINALIZED", "PENDING", "SCHEDULED")
    and a.role_meaning = "PATIENT"
;    and a.appt_location_cd not in (LASKHLTH_CD,LAOCHLTH_CD,LASCHLTH_CD,MEBHBEHH_CD)
    and a.active_ind = 1
    and a.version_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
;015 start
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
 
;015 end block
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
/*;016 ;015 block start
    and( (se.appt_type_cd = Telemed_Provider_cd
        and not exists ( select cv.code_value
					    from code_value cv,
					         sch_appt a3
					    where a3.sch_event_id = se.sch_event_id
					    and cv.code_value = a3.appt_location_cd
					    and cv.DISPLAY in ( "EUBC Urology",
											"EUBM Urology",
											"EUBC Onc/Hemato",
											"EUMC Alrgy/Immu",
											"EUMC Endocrine",
											"EUML CardThorac",
											"EUML Cardiology",
											"EUML Endocrine",
											"EUML Ortho",
											"EUML GI",
											"EUML Neurology",
											"EUML Onc/Hemato",
											"EUML PlastcSurg",
											"EUML PM&R",
											"EUML PMR",
											"EUML Pulm",
											"EUML Surgery",
											"EUML Urology",
											"EURL Urology",
											"MERC Endocrine",
											"MERC Oncology")
						)
		)
		or se.appt_type_cd != Telemed_Provider_cd)
;015 block end
;016
*/
    and se.appt_type_cd not in (Telemed_Provider_cd,  ;016
                                occ_hlth_nurse_visit_cd, ;016
                                dot_appt_type_cd)			;016
 
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
 
	t_list->patName = concat(trim(r.name_first), " ", trim(r.name_middle), " ",trim(r.name_last))
head a.beg_dt_tm
   lQualCnt = lQualCnt + 1
head a.appt_location_cd
 
    lLocCnt = lLocCnt + 1
    stat = alterlist(t_list->loc,lLocCnt)
	t_list->loc[lLocCnt].building_cd = lg.parent_loc_cd
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
 
    elseif (loc_disp_ucase IN ("MAIJ PT","MAIJ OT","MAIJ SPEECHPATH"))                          		;015
      t_list->loc[lLocCnt].building = "MA Mankato &#45; Madison East"	                            		;015
 
    elseif (loc_disp_ucase IN ("EUMB BEHAV HLTH"))                          							;015
      t_list->loc[lLocCnt].building = "EU Eau Claire Clinic &#45; Luther Campus Amalia Building"			;015
 
    elseif (loc_disp_ucase IN ("EUML ONC/HEMATO"))                          							;015
      t_list->loc[lLocCnt].building = "Dunlap Cancer Center Building"	                           		;015
 
    elseif (loc_disp_ucase IN (                          												;015
								"EULH OT",                          									;015
								"EULH PT",                          									;015
								"EULH RT",                          									;015
								"EULH SPEECHTHPY",                          							;015
								"EULH WOUNDOSTOM",                          							;015
								"EULH NEUROPHY"                          								;015
								,"EULH SpeechLang"														;015
								)                          												;015
			)						                       												;015
      t_list->loc[lLocCnt].building = "EU Eau Claire Clinic &#45; Luther Campus Wishart Building"			;015
    elseif (loc_disp_ucase IN (                          												;015
								"EULH CARDIAC REHAB",                          							;015
								"EULH ECHO",                          									;015
								"EULH CT",                          									;015
								"EULH INTERVRAD",                          								;015
								"EULH ULTRASOUND",                          							;015
								"EULH MRI",                          									;015
								"EULH Radiology", ; Xray????                          					;015
								"EULH FLUORO"                          									;015
								,"EULH Xray"															;015
								)                          												;015
			)						                       												;015
 
      t_list->loc[lLocCnt].building = "EU Eau Claire Clinic &#45; Luther Campus Midelfort Building West"  	;015
    elseif (loc_disp_ucase IN ("EUML ECHO RC"))                          								;015
      t_list->loc[lLocCnt].building = "ME Red Cedar &#45; Menomonie Hospital"                           	;015
 
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
;015	t_list->loc[lLocCnt].building = "La Crosse Hospital - Franciscan Healthcare"
	t_list->loc[lLocCnt].building = "La Crosse Hospital &#45; Franciscan Healthcare"  ;015
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
      elseif (loc_disp_ucase IN ("LASK OT", "LASK PT";;)) ; added my m061596 cab:8868
								 ,"LASK SPEECHTHPY")) ;018
 
      t_list->loc[lLocCnt].building = "Franciscan Healthcare LaCrosse Hospital" ; added my m061596 cab:8868
      t_list->loc[lLocCnt].phone = "6083929768" ; added my m061596 cab:8868
/*005 END*/
;    elseif (loc_disp_ucase IN ("LASK DERM"))
;      t_list->loc[lLocCnt].building = "Franciscan Healthcare Professional Arts Building"
;005       t_list->loc[lLocCnt].phone = "6087850940"
;      t_list->loc[lLocCnt].phone = "6083929491"  /*005*/
    elseif (loc_disp_ucase IN ("LASK OCCHEALTH"))
      t_list->loc[lLocCnt].building = "Franciscan Healthcare Services to Business"
;005       t_list->loc[lLocCnt].phone = "6087850940"
      t_list->loc[lLocCnt].phone = "6083929769"  /*005*/
    elseif (loc_disp_ucase IN ("LASK ADOLEMNHLT"))
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
;020	elseif (loc_disp_ucase IN ("FBCV OB/GYN")) ;019
;020		t_list->loc[lLocCnt].building = "Women's Health   Allina - District One Hospital" ;019
;020		t_list->loc[lLocCnt].phone = "5073333300" ;019
	elseif (loc_disp_ucase IN ("FBCV OB/GYN","FBCV MFM")) ;020
		t_list->loc[lLocCnt].building = "Mayo Clinic Health System - Faribault Women's Health" ;020
		t_list->loc[lLocCnt].phone = "5073333300" ;020
 
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
	  t_list->loc[lLocCnt].appt[lApptCnt].encntrId = a.encntr_id ;013
	  t_list->loc[lLocCnt].appt[lApptCnt].orgName = org.org_name ;013
	  t_list->loc[lLocCnt].appt[lApptCnt].rscDesc = sat.description ;013
 
      t_list->beg_dt_tm = a.beg_dt_tm
	  t_list->end_dt_tm = a.end_dt_tm
;Need to replace CURTIMEZONESYS with timezone if exists
	  t_list->loc[lLocCnt].appt[lApptCnt].appt_dt_tm = a.beg_dt_tm
	  t_list->loc[lLocCnt].appt[lApptCnt].dt_tm = ;013
			;format(a.beg_dt_tm, "MM/DD/YYYY HH:MM:SS;;Q") ;013
			DATETIMEZONEFORMAT(a.beg_dt_tm ,CURTIMEZONESYS,"MM/DD/YYYY HH:mm:ss ZZZ",CURTIMEZONEDEF)
 
		;call echo( t_list->loc[lLocCnt].appt[lApptCnt].dt_tm)
 
	  t_list->loc[lLocCnt].appt[lApptCnt].dt_tm_utc = ;013
			trim(format(cnvtdatetimeutc(a.beg_dt_tm, 3),"YYYY-MM-DDTHH:MM:SSZ;3;Q"), 3) ;013
      t_list->loc[lLocCnt].appt[lApptCnt].date =
          format(t_list->beg_dt_tm, "@SHORTDATE")
      t_list->loc[lLocCnt].appt[lApptCnt].time =
          ;format(t_list->beg_dt_tm, "@TIMENOSECONDS")
          format(t_list->beg_dt_tm,"HH:MM;;S")
 
          ;nk0
          ;call echo(build(curtimezoneapp, "***", curtimezonesys))
 
 
      if(sat.description like "GI*" and o.order_mnemonic > "")
;018        if(cnvtupper(o.order_mnemonic) like "SCH*")
        if(o.order_mnemonic like "SCH*")   ;018
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
 if (loc_disp_ucase IN ("MAIC GI/HEP", "MAIC MNVALL HSP", "MASP OUT-GI", "MAWH GI CLINIC" ;))
  						,"MALS OUT-GI" 														;018
                        )) 																	;018
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
;017        if(a.sch_appt_id = t_list->loc[i].appt[index1].apptId)
        if(a.sch_appt_id = t_list->loc[i].appt[j].apptId)  ;017
 
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
 
;set last_mod = "009 6/25/09 SR 1-3258895189"
 
end
go
