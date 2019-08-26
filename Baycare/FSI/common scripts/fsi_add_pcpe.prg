 /*
 *  ---------------------------------------------------------------------------------------------
 
 *  Script Name:    fsi_add_pcpe.prg
 *  Description:    Find and return the encounter specific PCPE
 *  ---------------------------------------------------------------------------------------------
 *  Author:         Yitzhak Magoon     
 *  Creation Date:  03/07/2019
 *  ---------------------------------------------------------------------------------------------
 *  This script needs to be called with a single argument - the encntr_id. It finds the PCPE 
 *  and persists the data to the oen_reply record structure from the calling program. 
*/

free record pcpe
record pcpe (
    1 NPI = vc
    1 first_name = vc
    1 last_name = vc
)

set pcpe_reltn = uar_get_code_by ("MEANING",333,"PCPE")
set NPI_nbr = uar_get_code_by ("DISPLAY",263,"NPI Number")

set enctr_id = $1

select into "nl:" 
from 
    encntr_prsnl_reltn   e
    , prsnl_alias   p
    , prsnl   pr
plan e
    where e.encntr_id = enctr_id  
        and e.encntr_prsnl_r_cd = pcpe_reltn
        and e.manual_create_ind= 0 
join p
    where e.prsnl_person_id = p.person_id
    and p.alias_pool_cd = npi_nbr
join pr
    where p.person_id = pr.person_id
detail
    pcpe->npi = p.alias
    pcpe->first_name = pr.name_first
    pcpe->last_name = pr.name_last  
with nocounter

set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PD1, 0)
set stat = alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PD1, 1)

if (pcpe->NPI not in( "", NULL, " "))
    set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PD1 [1]->pat_primary_provider [1]->id_nbr = pcpe->NPI
    set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PD1 [1]->pat_primary_provider [1]->last_name = pcpe->last_name
    set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PD1 [1]->pat_primary_provider [1]->first_name = pcpe->first_name
    set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PD1 [1]->pat_primary_provider [1]->assign_auth->name_id  = "NPI Number"
    set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PD1 [1]->pat_primary_provider [1]->name_type = "Personnel"
    set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PD1 [1]->pat_primary_provider [1]->id_type = "National Provider Identifier"
endif