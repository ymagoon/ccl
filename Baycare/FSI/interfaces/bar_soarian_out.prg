/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  bar_soarian_out
 *  Description:  Script for drop bills outbound to Soarian
 *  Type:         Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:         Helen Bruns
 *  Library:        OEOCF23BARBAR
 *  Creation Date:  01/10/2014
 *  ---------------------------------------------------------------------------------------------
 *  Mod#   Date		Author     Description & Requestor Information
 *
 *  001:      07/02/2014     R. Quack   Removed Helen's ignore logic for SFB after fixing route script to 
 *                    route by FIN alias pool instead of trying to send all BAR to both INV/Soarian interfaces  
 *  002:    10/09/14   R Quack     Added logic to populate EVN;5.1 with Coder ID                     
 *  ---------------------------------------------------------------------------------------------
*/


Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = ""
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = 
oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->facility_id->name_id 

Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application = ""
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application = 
oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_fac_id

/***
002: Start - 10/9/14 - adding logic for BAR to get personnel person_id of the Coder
  The "EVN_OPID" realtionship is the person_id of the Coder we must convert to prsnlid alias
***/
declare oper_stat = i4 
Set oper_stat = alterlist(oen_reply->CONTROL_GROUP [1]->EVN [1]->operator_id, 0)
Set oper_stat = alterlist(oen_reply->CONTROL_GROUP [1]->EVN [1]->operator_id, 1) 
declare encntr_sz = i4
declare encntr_x = i4 
Set encntr_sz = size(oen_reply->cerner->encntr_prsnl_info->encntr, 5)
Set encntr_x = 1 

execute oencpm_msglog(build("evn_opid from record=",oen_reply->CONTROL_GROUP [1]->EVN [1]->operator_id [1]->id_nbr,char(0)))
execute oencpm_msglog(build("encntr_sz=",encntr_sz,char(0)))

while (encntr_x <= encntr_sz)
execute oencpm_msglog(build("we are inside first while",char(0)))
;execute oencpm_msglog(build("reln_type_cdf=",trim(oen_reply->cerner->encntr_prsnl_info->encntr [1]->reln_type_cdf),char(0)))
;execute oencpm_msglog(build("reln_type_cdf=",trim(oen_reply->cerner->encntr_prsnl_info->encntr [2]->reln_type_cdf),char(0)))
;execute oencpm_msglog(build("reln_type_cdf=",trim(oen_reply->cerner->encntr_prsnl_info->encntr [3]->reln_type_cdf),char(0)))

if (trim(oen_reply->cerner->encntr_prsnl_info->encntr [encntr_x]->reln_type_cdf) = "EVN_OPID")
execute oencpm_msglog(build("we are inside EVN_OPID",char(0)))

  declare prsnl_sz = i4
  declare prsnl_x = i4 
  Set prsnl_sz = size(oen_reply->cerner->encntr_prsnl_info->encntr [encntr_x]->prsnl_r, 5)
execute oencpm_msglog(build("prsnl_sz=",prsnl_sz,char(0)))
  Set prsnl_x = 1 

  while (prsnl_x <= prsnl_sz)
    if (oen_reply->cerner->encntr_prsnl_info->encntr [encntr_x]->prsnl_r [prsnl_x]->prsnl_person_id > 0.0)
    Set oen_reply->CONTROL_GROUP [1]->EVN [1]->operator_id [1]->id_nbr =
    cnvtstring(oen_reply->cerner->encntr_prsnl_info->encntr [encntr_x]->prsnl_r [prsnl_x]->prsnl_person_id)
execute oencpm_msglog(build("evn_opid inside loop=",oen_reply->CONTROL_GROUP [1]->EVN [1]->operator_id [1]->id_nbr,char(0)))
    endif
    Set prsnl_x = prsnl_x + 1
  endwhile

endif 

Set encntr_x = encntr_x + 1

endwhile

Declare evn_opid = vc
Declare evn_alias = i4
Set evn_opid = oen_reply->CONTROL_GROUP [1]->EVN [1]->operator_id [1]->id_nbr

execute oencpm_msglog(build("evn_opid from record=",oen_reply->CONTROL_GROUP [1]->EVN [1]->operator_id [1]->id_nbr,char(0)))
execute oencpm_msglog(build("evn_opid=",evn_opid,char(0)))

select into "nl:"
  pa.alias
from prsnl_alias pa
   where pa.person_id = cnvtint(evn_opid)
    and pa.alias_pool_cd = 228049736.00
    and pa.active_ind = 1
detail
  oen_reply->CONTROL_GROUP [1]->EVN [1]->operator_id [1]->id_nbr=pa.alias
with nocounter
;;;;; 002: End

/**10/3/2007 - move DG1;28 to DG1;8***/
free set dg1_size
set dg1_size = size(oen_reply->PERSON_GROUP [1]->CLIN_GROUP [1]->DG1, 5)
If (dg1_size >=1)
For (x = 1 to dg1_size)
 Set oen_reply->PERSON_GROUP [1]->CLIN_GROUP [1]->DG1 [x]->diag_rel_grp->identifier = ""
 Set oen_reply->PERSON_GROUP [1]->CLIN_GROUP [1]->DG1 [x]->diag_rel_grp->text = ""
 Set oen_reply->PERSON_GROUP [1]->CLIN_GROUP [1]->DG1 [x]->diag_rel_grp->coding_system = ""
 Set oen_reply->PERSON_GROUP [1]->CLIN_GROUP [1]->DG1 [x]->diag_rel_grp->alt_identifier = ""
 Set oen_reply->PERSON_GROUP [1]->CLIN_GROUP [1]->DG1 [x]->diag_rel_grp->alt_text = ""
 Set oen_reply->PERSON_GROUP [1]->CLIN_GROUP [1]->DG1 [x]->diag_rel_grp->alt_coding_system = ""
 Set oen_reply->PERSON_GROUP [1]->CLIN_GROUP [1]->DG1 [x]->diag_rel_grp->identifier = 
   oen_reply->PERSON_GROUP [1]->CLIN_GROUP [1]->DG1 [x]->present_on_admit_ind 
Endfor
Endif

/**11/12/07 - Logic to get physician first and last name in obx**
free set obx_nbr
set obx_nbr=size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->OBX, 5)

Free record name
record name
(
 1 temp [obx_nbr]
  2 person_var=f8
  2 name_last=vc
  2 name_first=vc
)
declare accnt_var = vc
declare accnt_pool_var = vc
declare accnt_pool_cd = f8
Set accnt_var = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->id 
Set accnt_pool_dis = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_auth->name_id 
Case (accnt_pool_dis)
of "Morton Plant FIN":
Set accnt_pool_cd = uar_get_code_by("DISPLAY", 263, "Morton Plant FIN")
of "Mease Dunedin FIN":
Set accnt_pool_cd = uar_get_code_by("DISPLAY", 263, "Mease Dunedin FIN")
of "Mease Countryside FIN":
Set accnt_pool_cd = uar_get_code_by("DISPLAY", 263, "Mease Countryside FIN")
of "South Florida FIN":
Set accnt_pool_cd = uar_get_code_by("DISPLAY", 263, "South Florida FIN")
of "Saint Joseph's FIN":
Set accnt_pool_cd = uar_get_code_by("DISPLAY", 263, "Saint Joseph's FIN")
of "Saint Joseph's Woman's FIN":
Set accnt_pool_cd = uar_get_code_by("DISPLAY", 263, "Saint Joseph's Woman's FIN")
of "Saint Joseph's North FIN":
Set accnt_pool_cd = uar_get_code_by("DISPLAY", 263, "Saint Joseph's North FIN")
of "Saint Anthony's FIN":
Set accnt_pool_cd = uar_get_code_by("DISPLAY", 263, "Saint Anthony's FIN")
of "North Bay FIN":
Set accnt_pool_cd = uar_get_code_by("DISPLAY", 263, "North Bay FIN")
Endcase

set person_count=0
select into "nl:"
  ea.encntr_id, ad.value_cd
from encntr_alias ea, abstract_data ad
plan ea
 where ea.alias = accnt_var and
  ea.alias_pool_cd = accnt_pool_cd and
  ea.active_ind=1
join ad
  where ad.encntr_id=ea.encntr_id
order by ad.abstract_data_id
detail
 person_count = person_count + 1
 name->temp[person_count]->person_var=ad.value_cd
With nocounter

For (z=1 to person_count)
select into "nl:"
  p.name_last_key, p.first_name_key
from person p
where p.person_id = name->temp[z]->person_var
detail
 name->temp[z]->name_last=p.name_last_key
 name->temp[z]->name_first=p.name_first_key
with nocounter

Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->OBX [z]->observation_value [1]->value_1 = 
  build(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->OBX [z]->observation_value [1]->value_1,"^", 
      name->temp[z]->name_last, "^",name->temp[z]->name_first)
Endfor
***/

/***1/9/2008 - Logic to remove all OBX's that are not consulting doctors and get the first/last name of the consulting docs. 
  This logic replaces the logic above.***/

Set obx_nbr=size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->OBX,5)

If(obx_nbr = 0)
  go to end_of_script
Endif

Free record tmp
record tmp
(
 1 temp [*]
  2 obx_id=vc
  2 obx_type=vc
  2 obx_obs_id=vc
  2 obx_value=vc
  2 obx_dt=vc
)

set good_obx = 0
set i = 1
while (i <= obx_nbr)
  free set obx_cp
  Set obx_cp = substring(1,2,oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->OBX [i]->observation_id->identifier)
   If (obx_cp = "CP")
     If (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->OBX [i]->observation_value [1]->value_1!="")
     set good_obx = good_obx + 1
     set stat=alterlist(tmp->temp,good_obx)
      Set tmp->temp[good_obx]->obx_id = cnvtstring(good_obx) 
      Set tmp->temp[good_obx]->obx_type = 
           oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->OBX [i]->value_type
         EXECUTE OENCPM_MSGLOG(BUILD("Load OBX 2 = ", tmp->temp[good_obx]->obx_type))
      Set tmp->temp[good_obx]->obx_obs_id = 
            oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->OBX [i]->observation_id->identifier
           EXECUTE OENCPM_MSGLOG(BUILD("Load OBX 3 = ", tmp->temp[good_obx]->obx_obs_id))
      Set tmp->temp[good_obx]->obx_value = 
            oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->OBX [i]->observation_value [1]->value_1
              EXECUTE OENCPM_MSGLOG(BUILD("Load OBX 5 = ", tmp->temp[good_obx]->obx_value))
      Set tmp->temp[good_obx]->obx_dt = 
            oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->OBX [i]->observation_dt_tm
           EXECUTE OENCPM_MSGLOG(BUILD("Load OBX 14 = ", tmp->temp[good_obx]->obx_dt))
   Endif
   Endif
   set i = i + 1
Endwhile
     set stat=alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->OBX, 0)
set z = 0
set t = 1
While (t <= good_obx)
set z = z + 1
set stat=alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->OBX, z)
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->OBX [z]->set_id = tmp->temp[t]->obx_id
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->OBX [z]->value_type = tmp->temp[t]->obx_type
 EXECUTE OENCPM_MSGLOG(BUILD("Out OBX 2 = ",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->OBX [z]->value_type))
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->OBX [z]->observation_id->identifier = tmp->temp[t]->obx_obs_id
 EXECUTE OENCPM_MSGLOG(BUILD("Out OBX 3 = ",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->OBX [z]->observation_id->identifier))
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->OBX [z]->observation_value [1]->value_1 = tmp->temp[t]->obx_value
 EXECUTE OENCPM_MSGLOG(BUILD("Out OBX 5 = ",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->OBX [z]->observation_value [1]->value_1))
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->OBX [z]->observation_dt_tm =  tmp->temp[t]->obx_dt
 EXECUTE OENCPM_MSGLOG(BUILD("Out OBX 14 = ",oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->OBX [z]->observation_dt_tm))
Set t = t + 1
Endwhile

Set obx_x = size(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->OBX, 5)
If(obx_x = 0)
  go to end_of_script
Endif

Free record name
record name
(
 1 temp [obx_x]
  ;2 person_var=f8
  2 name_last=vc
  2 name_first=vc
)
;declare accnt_var = vc
declare accnt_pool_var = vc
declare doc_pool_cd = f8
;Set accnt_var = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->id 
Set accnt_pool_dis = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_auth->name_id 

/*
;;	Set the doc_pool_cd to the Soarian value
Case (accnt_pool_dis)
	of "BayCare FIN":
	Set doc_pool_cd = uar_get_code_by("DISPLAY", 263, "BayCare Dr Number")
Endcase

For (h = 1 to obx_x)
select into "nl:"
   pa.alias
  ,p.name_last_key
  ,p.first_name_key
from person p, prsnl_alias pa
plan pa
   where pa.alias = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->OBX [h]->observation_value [1]->value_1
    and pa.alias_pool_cd = doc_pool_cd
    and pa.active_ind = 1
join p
   where p.person_id = pa.person_id
detail
   oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->OBX [h]->observation_value [1]->value_1= build(
     oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->OBX [h]->observation_value [1]->value_1,pa.alias"^",
        p.name_last_key,"^",p.name_first_key)
   ;name->temp[t]->name_last=p.name_last_key
  ;name->temp[t]->name_first=p.name_first_key
with nocounter

;Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->OBX [h]->observation_value [1]->value_1

Endfor
*/



#end_of_script

/****6/07/13*** PHopkins added CCL to include SOI and ROM database fields***/
/*** in the outbound BAR message***/


free record zdrnew
set trace recpersist
record zdrnew
(
1 seq=vc
1 mdc=vc
1 mdcapr=vc
1 sev=vc
1 rom=vc
)
set trace norecpersist

set zdrnew->seq = ""
set zdrnew->mdc = ""
set zdrnew->mdcapr = ""

DECLARE enid = f8
FREE SET enid

execute oencpm_msglog(build("DECLARE = OK"))

/****with persist is needed so the the mod original script can access the data *****/

set enid = oen_reply->CERNER->encntr_prsnl_info->encntr [1]->encntr_id 

execute oencpm_msglog(build("EID = ",cnvtstring(enid)))

	select d.severity_of_illness_cd
	from drg d
	plan d
	where (d.encntr_id = enid and d.severity_of_illness_cd > 0 and d.active_ind = 1 )    
DETAIL
zdrnew->sev = uar_get_code_meaning(d.severity_of_illness_cd)
with nocounter
	 
	
select d.risk_of_mortality_cd
	from drg d
	plan d
	where (d.encntr_id = enid and d.risk_of_mortality_cd > 0 and d.active_ind = 1 )    
DETAIL
zdrnew->rom = uar_get_code_meaning(d.risk_of_mortality_cd)
with nocounter
	
 
 execute oencpm_msglog(BUILD("Severity of Illness = ", zdrnew->sev))
  execute oencpm_msglog(BUILD("Risk of Mortality  = ", zdrnew->rom))

/*9/30/10  by R Quack - adding logic to call doctor filter script*/
;;execute op_doc_filter_gen_outv5


#EXITSCRIPT