/*************************************************************************
*                                                                        *
*  Copyright Notice:  (c) 1983 Laboratory Information Systems &          *
*                              Technology, Inc.                          *
*       Revision      (c) 1984-2001 Cerner Corporation                   *
*                                                                        *
*  Cerner (R) Proprietary Rights Notice:  All rights reserved.           *
*  This material contains the valuable properties and trade secrets of   *
*  Cerner Corporation of Kansas City, Missouri, United States of         *
*  America (Cerner), embodying substantial creative efforts and          *
*  confidential information, ideas and expressions, no part of which     *
*  may be reproduced or transmitted in any form or by any means, or      *
*  retained in any storage or retrieval system without the express       *
*  written permission of Cerner.                                         *
*                                                                        *
*  Cerner is a registered mark of Cerner Corporation.                    *
*                                                                        *
**************************************************************************
 
        Source file name:   orm_rpt_meds_rec_patient_data.inc
        Object name:        orm_rpt_meds_rec_patient_data
        Request #:
 
        Solution:           Powerchart
        Solution Team:      Orders Management
        HNA Version:        500
        CCL Version:
 
        Program purpose:    Loads patient information for a given patient
 
        Tables read:		None
 
        Tables updated:		None
 
        Executing from:
 
        Special notes:
 
**************************************************************************
                      GENERATED MODIFICATION CONTROL LOG                 *
**************************************************************************
 Mod Date     Engineer     Feature Comment
 --- -------- ------------ ------- ---------------------------------------
 000 11/29/05 AT012526     0069455 Initial release - ITN 119015
 001 05/21/07 NV013841     127080  Fix for incorrect FIN printing
 002 12/04/08 NT5990               Customized for MAYO_MN SR 1-2733784281
 003 11/08/10 Akcia-SE	   		   make custom verison of pha_get_mar_allergy, execute that instead
 									to get proposed as well
*************************************************************************/
 
;***************Store patient encounters info*********************
;record patientRec
;(
;  	1 name            = vc
;  	1 room            = c40
;  	1 bed             = c40
;  	1 mrn             = f8
;  	1 fin             = f8
;  	1 dob             = dq8
;  	1 age             = f8
;  	1 gender          = vc
;  	1 height          = vc
;  	1 weight          = vc
;  	1 admit_phy_name   = vc
;)
;
;record allergy
;(
;	1 data[*]
;	  2 person_id     = f8
;	  2 encntr_id     = f8
;	  2 details[*]
;	    3 allergy_id          = f8
;	    3 allergy_instance_id = f8
;	    3 nomenclature_id     = f8
;	    3 description         = vc
;)
 
;002 %i cclsource:orm_rpt_meds_rec_patient_record.inc
%i cclsource:orm_mayo_mn_meds_rec_pat_rec.inc   ;002
 
 
declare BuildAllergyList("") = NULL
declare LoadPatientInfo("") = i2
 
 
 
;****************************************************************************
; BUILDING PATIENT INFO
;****************************************************************************
subroutine LoadPatientInfo("")
 	call echo("***  BEGIN - orm_rpt_meds_rec_patient_data.inc  ***")
 
	;****************************************************************************
	; BUILDING PATIENT ALLERGY LIST
	;****************************************************************************
	set stat = alterlist(allergy->data,1)
	set allergy->data[1]->person_id = person_id
 
	;003  execute pha_get_mar_allergy
	execute mayo_pha_get_mar_allergy
 	call BuildAllergyList("")
 
	call echorecord(allergy)
 
 
	;****************************************************************************
	; BUILDING PATIENT DEMOGRAPHICS
	;****************************************************************************
	declare MRN_CD = f8 with protect, constant (uar_get_code_by("MEANING", 319, "MRN"))
	declare FIN_CD = f8 with protect, constant (uar_get_code_by("MEANING", 319, "FIN NBR"))
	declare ADMIT_PHY_CD = f8 with protect, constant (uar_get_code_by("MEANING", 333, "ADMITDOC"))
	declare INERROR_CD = f8 with protect, constant (uar_get_code_by("MEANING", 8, "IN ERROR"))
	declare admit_phy_id = f8 with protect, noconstant (0.0)
 
	select	into "nl:"
	        p.name_full_formatted
	        , p.sex_cd
	        , p.birth_dt_tm
	        , e.encntr_type_cd
	        , e.loc_room_cd
	        , e.loc_bed_cd
 
	from    encounter e
	        , person p
	        , encntr_alias ea
 
 	plan p where p.person_id = person_id
	join e where e.person_id = p.person_id
	        and e.encntr_id = encntr_id  ;001
	join ea where (ea.encntr_id = e.encntr_id
	        and ea.encntr_alias_type_cd in (MRN_CD, FIN_CD))
	        or (ea.encntr_alias_id = 0)
 
	head report
		patientRec->name = p.name_full_formatted
		patientRec->room = uar_get_code_display(e.loc_room_cd)
		patientRec->bed = uar_get_code_display(e.loc_bed_cd)
		patientRec->dob = format(p.birth_dt_tm, "@SHORTDATE;;D")
		patientRec->age = cnvtage(p.birth_dt_tm)
		patientRec->gender = uar_get_code_display(p.sex_cd)
 
 	detail
    	if (ea.encntr_alias_type_cd = FIN_CD)
			patientRec->fin = cnvtalias (ea.alias, ea.alias_pool_cd)
		elseif (ea.encntr_alias_type_cd = MRN_CD)
			patientRec->mrn = cnvtalias (ea.alias, ea.alias_pool_cd)
		endif
 
	with nocounter
 
 	if (curqual = 0)
 		return (FAILED_PATIENT_LOOKUP)
 	endif
 
 
	;**************************************
	; BUILDING PATIENT HEIGHT AND WEIGHT
	;**************************************
	select into "nl:"
	from v500_event_set_code vesc
		,v500_event_set_explode vese
		,clinical_event ce
	plan vesc
		where vesc.event_set_name_key in ("CLINICALHEIGHT", "CLINICALWEIGHT")
	join vese
		where vese.event_set_cd = vesc.event_set_cd
	join ce
		where ce.person_id = person_id
		and ce.event_cd = vese.event_cd
		and ce.view_level = 1
		and ce.publish_flag = 1
		and ce.valid_until_dt_tm > cnvtdatetime(CURDATE, CURTIME)
		and ce.result_status_cd != INERROR_CD
	order by vesc.event_set_name_key, cnvtdatetime(ce.event_end_dt_tm) desc
 
	head vesc.event_set_name_key
		if(vesc.event_set_name_key = "CLINICALWEIGHT")
			patientRec->weight = concat(trim(ce.event_tag), " ", uar_get_code_display(ce.result_units_cd))
		else
			patientRec->height = concat(trim(ce.event_tag), " ", uar_get_code_display(ce.result_units_cd))
		endif
	with nocounter
 
 
 
	;****************************************************************************
	; BUILDING ADMITTING PHYSICIAN
	;****************************************************************************
	select	into "nl:"
	        p.name_full_formatted
 
	from
	        person p
	        , encntr_prsnl_reltn ep
 
	plan ep where ep.encntr_id = encntr_id
			and ep.encntr_prsnl_r_cd = ADMIT_PHY_CD
			and ep.active_ind = 1
			and ep.beg_effective_dt_tm < cnvtdatetime(CURDATE, CURTIME)
			and ep.end_effective_dt_tm > cnvtdatetime(CURDATE, CURTIME)
	join p where p.person_id = ep.prsnl_person_id
 
	order ep.end_effective_dt_tm desc
 
	detail
		patientRec->admit_phy_name = p.name_full_formatted
	with nocounter
 
	call echorecord(patientRec)
 
	call echo("***  END - orm_rpt_meds_rec_patient_data.inc  ***")
 
	return (SUCCESS)
end
 
 
 
;****************************************************************************
; BUILDING ALLERGY LIST
;****************************************************************************
subroutine BuildAllergyList("")
	set num_allergies = size(allergy->data[1]->details,5)
 
	if (num_allergies > 0)
		for (aller_cnt = 1 to (num_allergies))
			if (allergy->data[1]->details[aller_cnt].description != NULL)
				if(allergies_disp = NULL)
					set allergies_disp = trim(allergy->data[1]->details[aller_cnt].description, 3)
				else
					set allergies_disp = concat(allergies_disp,", ", trim(allergy->data[1]->details[aller_cnt].description,3))
				endif
			endif
		endfor
	else
		set allergies_disp = uar_i18ngetmessage(_hI18NHandle,"allergies_none1","No known allergies.")
	endif
end
set last_mod = "002"
set mod_date = "Dec. 04, 2008"
 
 
 
 

