/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  XDS_MOD_OBJECT
 *  Description:  OID coding and ADT build for Resonance
 *  Type:  Open Engine Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:  Res Hub Team
 *  Domain:  PROD
 *  Creation Date:  02/13/2014 15:24:22
 *  ---------------------------------------------------------------------------------------------
 *
 */



declare msh_4_oid = vc with noconstant("");Leave Blank for appending logic
declare dPersonId = f8 with constant(cnvtreal(get_double_value("person_id")))
declare dEncntrId = f8 with constant(cnvtreal(get_oen_reply_long("encntr_id")))
;declare dContributorSystemCd = f8 with constant(cnvtreal(WhatIs("PACKESO")))
declare dContributorSystemCd = f8 with constant(UAR_GET_CODE_BY("Displaykey",89,"XDSCONTRIBUTORSYSTEM"))

declare dob =  vc
declare inbound_dob = vc
declare inbound_dttm = vc
declare dttm = vc
declare evndttm = vc
declare inbound_evndttm = vc
declare cs_org_oid_txt = vc
declare org_type_cd					= f8 with constant(uar_get_code_by("MEANING", 278, "COMMUNITY")) ;;HC ORG
free record alias_pool_cd_list
record alias_pool_cd_list
(
    1 qual[*]
      2 alias_pool_cd	= f8
)


if(oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_type = "ADT" and 
(oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_trigger in
("A01","A04","A05","A08","A40","A34","A44", "A28", "A31"))
and (size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID,5) > 0))

  if (oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_trigger in ("A34","A44") )
    Set oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_trigger = "A40"
  elseif(oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_trigger in ("A28"))
    Set oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_trigger = "A08"
  elseif(oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_trigger in ("A31"))
   	Set oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_trigger = "A08"
  endif

;Hardcode Millenium / Resonance OIDs
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_application->name_id = ""
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_application->univ_id = "2.16.840.1.113883.3.13.2"
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_application->univ_id_type = "ISO"
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = ""
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->univ_id = "2.16.840.1.113883.3.13.3.3"
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->univ_id_type = "ISO"

; Get ORG ID / Apply Affinity Domain OID MSH 5
	;;;Getting OID for Resonance Community(Based on the Org that is on the contributor system)
	call echo(build2("contributor system cd: ", dContributorSystemCd))
	execute oencpm_msglog(BUILD("contributor system cd: ", dContributorSystemCd))	
    if(dContributorSystemCd > 0)
        select so.oid_txt from SI_OID so, contributor_system cs
        plan cs
            where cs.contributor_system_cd = dContributorSystemCd 
        join so        
            where so.entity_type = "ORGANIZATION"
            and so.entity_id = cs.organization_id
       detail
           cs_org_oid_txt = so.oid_txt
    endif
    call echo (build2("cs_org_oid_txt : ", cs_org_oid_txt ))
    
	Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_facility->name_id = "" 
	Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_facility->univ_id = cs_org_oid_txt 
	Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_facility->univ_id_type = "ISO"
	
	;;;Use append logic to create MSH 4 if default is blank
	if(msh_4_oid = "")
  	 set msh_4_oid = concat(cs_org_oid_txt,".999482")
	endif
	
	Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = "" 
	Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->univ_id =  msh_4_oid
	Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->univ_id_type =  "ISO"

	;Get alias_pool_cd based on SI_SYSTEM_ORG_RELTN
	call echo(build2("Encounter ID: ", dEncntrId ))
	execute oencpm_msglog(BUILD("Encounter ID: ", dEncntrId))
	;;;Get all alias_pool_cd values for realtionships that exist
   	declare alias_cnt = i4
    select  into "nl:"
	  ssor.ALIAS_POOL_CD
	  from SI_SYSTEM_ORG_RELTN ssor
	where ssor.CONTRIBUTOR_SYSTEM_CD = dContributorSystemCd
		and NOT EXISTS (select otr.organization_id from org_type_reltn otr where otr.organization_id = ssor.organization_id 
                    and otr.org_type_cd = org_type_cd) 
		and ssor.PRIMARY_IND = 1
      head report
  		alias_cnt = 0
      detail
      	alias_cnt = alias_cnt + 1
      	STAT = alterlist(alias_pool_cd_list -> qual, alias_cnt)
       		alias_pool_cd_list -> qual[alias_cnt].alias_pool_cd = ssor.ALIAS_POOL_CD
    with nocounter
	if(size(alias_pool_cd_list->qual,5) = 0)
	   execute oencpm_msglog(BUILD("*** MESSAGE SKIPPED: NO ALIAS_POOL_CD_RELTN FOUND"))
	   Set oenstatus->ignore = 1
	   go to end_of_script
	endif

;Add leading 0's back to SSN
declare ssn = c9
set ssn = trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ssn_nbr)
if (SIZE(trim(ssn)) > 0)
 set ssn = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ssn_nbr
 set ssn = replace(ssn, "-", "")
 set ssn = format(ssn, "#########;P0")
 Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ssn_nbr = ssn
ENDIF

;Making sure Resonance can handle time stamp
if (size(oen_reply->CONTROL_GROUP [1]->EVN,5) > 0)
 set inbound_dttm = oen_reply->CONTROL_GROUP [1]->MSH [1]->message_time_stamp
 set dttm  = substring(1, 14, inbound_dttm)
 Set oen_reply->CONTROL_GROUP [1]->MSH [1]->message_time_stamp = dttm
 set inbound_evndttm = oen_reply->CONTROL_GROUP [1]->EVN [1]->event_dt_tm 
 set evndttm = substring(1, 14, inbound_evndttm)
 Set oen_reply->CONTROL_GROUP [1]->EVN [1]->event_dt_tm = evndttm
 Set oen_reply->CONTROL_GROUP [1]->EVN [1]->event_type_cd = oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_trigger
endif

;Modify DOB to Resonance standards
IF (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->date_of_birth != "")
 Set inbound_dob = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->date_of_birth
 Set dob = substring(1, 8,  inbound_dob)
 Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->date_of_birth = dob
ELSE
 execute oencpm_msglog(BUILD("*** MESSAGE SKIPPED: DOB is empty"))
 Set oenstatus->ignore = 1
 go to end_of_script
ENDIF

;Check Gender
IF (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->sex = "")
 execute oencpm_msglog(BUILD("*** MESSAGE SKIPPED: Gender is empty"))
 Set oenstatus->ignore = 1
 go to end_of_script
ENDIF

;Create PID-3
if(dPersonId>0)
  ;Get and set all aliases from the alias_pool
  SET STAT = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int,0)
  declare alias_pool_cnt = i2 with noconstant(0)
  declare alias_cnt = i4
  select into "nl:" 
  pa.alias,
  pa.alias_pool_cd,
  so.oid_txt 
  from person_alias pa,
  	si_oid so
  plan pa where expand(alias_pool_cnt,1,size(alias_pool_cd_list->qual,5),pa.alias_pool_cd,
		alias_pool_cd_list->qual[alias_pool_cnt].alias_pool_cd)
  	and pa.person_id=dPersonId 
  	and pa.end_effective_dt_tm>cnvtdatetime(curdate,curtime3) 
  	and pa.active_ind=1 
  join so where so.ENTITY_ID = pa.ALIAS_POOL_CD
			and so.ENTITY_NAME = 'CODE_VALUE'
  head report
  	alias_cnt = 0
  detail
  	alias_cnt = alias_cnt + 1
  	STAT = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int, alias_cnt)
    oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [alias_cnt]->id = pa.alias
	oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [alias_cnt]->assign_auth->univ_id = so.oid_txt
    oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int [alias_cnt]->assign_auth->univ_id_type = "ISO"
endif

;Delete message if no PID-3 is blank
Set PID3_SZ = SIZE(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_int, 5)
IF(PID3_SZ < 1) 
  execute oencpm_msglog(BUILD("*** MESSAGE SKIPPED: No CMRN found"))
  Set oenstatus->ignore = 1
  go to end_of_script
ENDIF

;Remove any PID;11 that is not a HOME (H) address
Set PID11_SZ = SIZE(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address, 5)
  
if(PID11_SZ >0)
  Set X = 1
  while(X <= PID11_SZ)
   if(trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [X]->types) != "H")
    Set STAT = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address, PID11_SZ-1, X-1)
    Set PID11_SZ = PID11_SZ - 1
   else
    Set X = X + 1
   endif
  endwhile
endif

; Make sure zip is only 5 numbers. Remove trailing four if they exist
if (SIZE(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address, 5))
  declare ZIP_CODE = vc
  set ZIP_CODE = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [1]->zip_code
  set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_address [1]->zip_code = substring(1,5,ZIP_CODE)
endif

;Remove any PID;5 that is not a Current / Legal name (L)
Set PID5_SZ = SIZE(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_name, 5)
if(PID5_SZ >0)
  Set X = 1
  while(X <= PID5_SZ)
    if(trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_name [X]->name_type_cd) != "L")
     Set STAT = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_name, PID5_SZ-1, X-1)
     Set PID5_SZ = PID5_SZ - 1
    else
     Set X = X + 1
    endif
  endwhile
endif
;;;Ignore message if legal name is blank
Set PID5_SZ = SIZE(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_name, 5)
if(PID5_SZ = 0)
  execute oencpm_msglog(BUILD("*** MESSAGE SKIPPED: No Legal Name found"))
  Set oenstatus->ignore = 1
  go to end_of_script
endif

;modify MRG segment



if (size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->MRG,5) > 0)


	declare ALIASPOOLCODESET 			= i4 with constant(263)
	declare MRG_FROM_PERSON_ID 			= f8 with noconstant(0.0)
	declare MRG_CMRN_TYPE_CD 			= f8 with constant(uar_get_code_by("DISPLAYKEY", 4, "COMMUNITYMEDICALRECORDNUMBER"))
	declare MRG_CMRN_CD					= f8 with constant(uar_get_code_by("DISPLAYKEY", 263, "CMRN"))
	declare MRG_INEFF_COMB_ACTION_CD 	= f8 with constant(uar_get_code_by("DISPLAYKEY", 327, "MAKEINEFFECTIVE"))
	declare MRGNUM						= i4 with noconstant(0)
	declare findMrgAttempt				= i4 with noconstant(0)
	declare maxMrnMergeAttempt			= i4 with noconstant(20)
	declare mrg_alias_pool_cnt 			= i2 with noconstant(0)
	declare mrg_found					= i2 with noconstant(0)
	execute oencpm_msglog(BUILD("MRG MRN"));,
	
      	;trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->MRG [1]->prior_pat_id_int [X]->assign_auth->name_id)))
	
	;clear mrg segment
	set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->MRG, 0)
	set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->MRG, 1)
	
	set  MRG_FROM_PERSON_ID = get_double_value("from_person_id")

	while (mrg_found != 1)
	
		set mrgNum = 0
		
		select into "nl"		
			uar_get_code_display(pa.alias_pool_cd)
			,pa.alias
			,pa.person_id
			,so.oid_txt
		from 
			 person_combine pc
			,person_combine_det pd
			,person_alias pa
			,si_oid so
		plan pc 
			where pc.from_person_id = MRG_FROM_PERSON_ID
				and pc.active_ind + 0 = 1
				and pc.encntr_id + 0 = 0 ;; excludes the encounter move records
		join pd
			where pd.person_combine_id = pc.person_combine_id
				and pd.entity_name = "PERSON_ALIAS"	
		join pa
			where pa.person_alias_id = pd.entity_id
		join so
			where so.entity_id = outerjoin(pa.alias_pool_cd)
				and so.ENTITY_NAME = outerjoin("CODE_VALUE")
				and so.entity_type = outerjoin("ALIAS_POOL")
				
		order by pa.updt_dt_Tm desc
		detail
				
			if (expand(mrg_alias_pool_cnt,1,size(alias_pool_cd_list->qual,5),pa.alias_pool_cd,
					alias_pool_cd_list->qual[mrg_alias_pool_cnt].alias_pool_cd)
				and pd.combine_action_cd = MRG_INEFF_COMB_ACTION_CD
				and pa.active_ind + 0 = 1
				;and pa.end_effective_dt_Tm <= cnvtdatetime(curdate,curtime)
				and pd.prev_end_eff_dt_tm >= cnvtdatetime("31-DEC-2100 00:00:00"))
					
				  mrgNum = mrgNum + 1
				  stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->MRG [1]->prior_pat_id_int, mrgNum)
				  oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->MRG [1]->prior_pat_id_int [mrgNum]->id = pa.alias
				  oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->MRG [1]->prior_pat_id_int [mrgNum]->assign_auth->univ_id = so.oid_txt
				  oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->MRG [1]->prior_pat_id_int [mrgNum]->assign_auth->univ_id_type = "ISO"
				  oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->MRG [1]->prior_pat_id_int [mrgNum]->assign_auth->name_id = ""
				  oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->MRG [1]->prior_pat_id_int [mrgNum]->assign_fac_id->name_id = ""
				  oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->MRG [1]->prior_pat_id_int [mrgNum]->assign_fac_id->univ_id = ""
				  oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->MRG [1]->prior_pat_id_int [mrgNum]->assign_fac_id->univ_id_type = ""
				  oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->MRG [1]->prior_pat_id_int [mrgNum]->effective_date = ""
				  oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->MRG [1]->prior_pat_id_int [mrgNum]->expiration_date = ""
			endif
		
			set mrg_found = 1
		with nocounter
		
		if (mrg_found = 0)
			set findMrgAttempt = findMrgAttempt + 1
			
			;stop interface if merge rows are not found within the max number of attempts
			if (findMrgAttempt >= maxMrnMergeAttempt)
				execute oencpm_msglog(BUILD("Combine rows not found in Database. Shutting down interface!"))
				set oenstatus->status = 0 
				go to end_of_script
			endif
		
			;use for loop to call pause since function does not behave the same in some domains
			for (x = 1 to 5)
				call pause (1)
			endfor
		endif
	endwhile
	
	if (size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->MRG [1]->prior_pat_id_int, 5) < 1)
	  execute oencpm_msglog(BUILD("*** MESSAGE SKIPPED: No merged aliases found to send"))
		Set oenstatus->ignore = 1
		go to end_of_script
	endif

endif		

  
;Remove unnecessary demographics
Set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->race, 0)
if (size(oen_reply->CONTROL_GROUP [1]->EVN,5) > 0)
 Set stat = alterlist(oen_reply->CONTROL_GROUP [1]->EVN [1]->operator_id,0)
endif
Set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->alternate_pat_id, 0)
Set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_alias, 0)
Set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ph_nbr_home , 0)
Set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->mothers_id, 0)
Set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->citizenship, 0)
Set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->race, 0)
Set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ph_nbr_bus , 0)
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->county_code = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->marital_status = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->religion = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ethnic_grp = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->birthplace = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->multiple_birth_ind = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->birth_order = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->pat_death_dt_tm = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->pat_death_ind = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->mothers_maiden_name->last_name = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->mothers_maiden_name->first_name = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->mothers_maiden_name->middle_name = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->mothers_maiden_name->suffix = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->mothers_maiden_name->prefix = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->mothers_maiden_name->degree = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->mothers_maiden_name->name_type_cd = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->id = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->check_digit = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->check_digit_scheme = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_auth->name_id = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_auth->univ_id = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_auth->univ_id_type = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->type_cd = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_fac_id->name_id = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_fac_id->univ_id = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_fac_id->univ_id_type = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->effective_date = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->expiration_date = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->drivers_lic_nbr->license_number = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->drivers_lic_nbr->iss_st_prov_ctry = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->drivers_lic_nbr->expiration_dt_tm = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->vet_mil_stat->identifier = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->vet_mil_stat->text = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->vet_mil_stat->coding_system = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->vet_mil_stat->alt_identifier = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->vet_mil_stat->alt_text = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->vet_mil_stat->alt_coding_system = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->nationality->identifier = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->nationality->text = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->nationality->coding_system = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->nationality->alt_identifier = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->nationality->alt_text = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->nationality->alt_coding_system = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->language_patient->identifier = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->language_patient->text = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->language_patient->coding_system = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->language_patient->alt_identifier = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->language_patient->alt_text = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->language_patient->alt_coding_system = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->id = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->assign_auth->name_id =  ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->assign_auth->univ_id = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->assign_auth->univ_id_type = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->type_cd = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->check_digit = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->check_digit_scheme = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->type_cd = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->assign_fac_id->name_id = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->assign_fac_id->univ_id = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->assign_fac_id->univ_id_type = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->effective_date = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->expiration_date = ""

;Remove unnecessary segments
set stat = alterlist(oen_reply->PERSON_GROUP[1]->CLIN_GROUP, 0)
set stat = alterlist(oen_reply->PERSON_GROUP[1]->FIN_GROUP, 0)
set stat = alterlist(oen_reply->PERSON_GROUP[1]->PAT_GROUP[1]->NTE, 0)
set stat = alterlist(oen_reply->PERSON_GROUP[1]->PAT_GROUP[1]->PD1, 0)
set stat = alterlist(oen_reply->PERSON_GROUP[1]->PAT_GROUP[1]->ZPI, 0)
set stat = alterlist(oen_reply->PERSON_GROUP[1]->PAT_GROUP[1]->ZCN, 0)
set stat = alterlist(oen_reply->PERSON_GROUP[1]->PAT_GROUP[1]->ZEI, 0)
set stat = alterlist(oen_reply->PERSON_GROUP[1]->PAT_GROUP[1]->NK1, 0)
set stat = alterlist(oen_reply->PERSON_GROUP[1]->PAT_GROUP[1]->ZKI, 0)
set stat = alterlist(oen_reply->PERSON_GROUP[1]->PAT_GROUP[1]->PV1, 0)
set stat = alterlist(oen_reply->PERSON_GROUP[1]->PAT_GROUP[1]->PV2, 0)
set stat = alterlist(oen_reply->PERSON_GROUP[1]->PAT_GROUP[1]->ZVI, 0)
set stat = alterlist(oen_reply->PERSON_GROUP[1]->PAT_GROUP[1]->ZBE, 0)
set stat = alterlist(oen_reply->PERSON_GROUP[1]->PAT_GROUP[1]->ZFP, 0)
set stat = alterlist(oen_reply->PERSON_GROUP[1]->PAT_GROUP[1]->ZFV, 0)
set stat = alterlist(oen_reply->PERSON_GROUP[1]->PAT_GROUP[1]->ZFM, 0)
set stat = alterlist(oen_reply->PERSON_GROUP[1]->PAT_GROUP[1]->ZFD, 0)
set stat = alterlist(oen_reply->PERSON_GROUP[1]->PAT_GROUP[1]->OBX, 0)
set stat = alterlist(oen_reply->PERSON_GROUP[1]->PAT_GROUP[1]->AL1_GROUP, 0) 

else
 set oenstatus->ignore = 1
endif

#end_of_script

SUBROUTINE get_oen_reply_long( sea_name )

  declare x_i        = i2
  declare list_size  = i2

  set x_i        = 0
  set list_size  = 0
  set list_size = size(oen_reply->cerner->longList, 5)
  if( list_size > 0 )
     for( x_i = 0 to ( list_size - 1 ) )
         if( oen_reply->cerner->longList[x_i].STRMEANING = cnvtlower( sea_name ) )
            return( oen_reply->cerner->longList[x_i].LVAL )
         endif
     endfor
  else
     call echo( "longList is empty" )
  endif
  return ( -1 )

END

subroutine WhatIs(trait_name)
declare string_value = vc

select into "nl:"
d.seq
from (dummyt d with seq = value(size(oen_proc->trait_list,5)))
where oen_proc->trait_list[d.seq]->name = trim(cnvtupper(trait_name))
detail
string_value = oen_proc->trait_list[d.seq]->value
with nocounter

if(curqual = 0)
execute oencpm_msglog(concat("Trait not found: ",trait_name))
set oenstatus->status = 0     ;//declare failure
go to script_exit
else
call echo(concat("trait value: ",string_value))
return(string_value)
endif

end ;// WhatIs
SUBROUTINE GET_DOUBLE_VALUE(STRING_MEANING)
DECLARE ESO_IDX = I4
DECLARE LIST_SIZE = I4
DECLARE STATVAR = C20

SET ESO_IDX = 0
SET LIST_SIZE = 0

SET STATVAR = (VALIDATE(oen_reply->CERNER, "NOCERNERAREA"))
IF (STATVAR = "NOCERNERAREA")
     RETURN("-1")
ELSE
     SET ESO_IDX = 0
     SET LIST_SIZE = 0
     SET LIST_SIZE = SIZE(oen_reply->CERNER->DOUBLELIST,5)

     IF( LIST_SIZE > 0 )
          SET ESO_X = 1
          FOR ( ESO_X = 1 TO LIST_SIZE )
               IF(oen_reply->CERNER->DOUBLELIST[ESO_X]->STRMEANING = STRING_MEANING)
                    SET ESO_IDX = ESO_X
               ENDIF
          ENDFOR
     ENDIF


     IF( ESO_IDX > 0 )
          RETURN(oen_reply->CERNER->DOUBLELIST[ESO_IDX]->DVAL)
     ELSE
          RETURN(0)
     ENDIF
ENDIF
END ;GET_DOUBLE VALU