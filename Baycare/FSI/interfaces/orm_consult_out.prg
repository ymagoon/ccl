/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  orm_phys_chng_out
 *  Description:  Script for Answer excellence and Patient Keeper consult orders outbound
 *  Type:         Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:         Sal Mongiardo
 *  Library:        OEOCF23ORMORM
 *  Creation Date:  01/29/09
 *  ---------------------------------------------------------------------------------------------
 *  Mod#  Date    Author       Description & Requestor Information
 *
 *  1:      11/4/09   T Dillon    Modified suppression logic for ER patients for priority not equal routine
*   2:      9/2/10   R Quack     Added dr. filter script logic
*   3:      9/15/10   T Dillon    Added logic to make future dated order cancel go out as a CA
*   4:      3/28/11   T Dillon    Suppress SFB, SJH and SJW transactions since decommissing PK per R Allison
*   5:      7/5/11     T Dillon    Suppress MPH Hemo consult orders per S Martin/Orders Team
*   6:      5/31/11   TMcArtor Suppress WHH WHW consult orders per S Carter/WHH golive (prod only) 
*   7:      1/25/16   TMcArtor  Suppress BMG Orders (prod only) 
*   8:      1/26/16   T McArtor  Adj BAH PRDOC Number 
*   9:      4/25/16   T McArtor  Add BRM Logic RFC 11022 
*  10:    2/27/17    D Olsz       Remove excess coding to Cloverleaf
*  11:    9/12/18   S Parimi    RFC # 13938 Change to MSNumber alias pool code from PRDOC, and call doc5 script
*  12:    4/10/19   H Kacz      Changed script name from orm_ae_out; added coding for attending physician change orders
 *  ---------------------------------------------------------------------------------------------
*/

/* Facility in MSH:5 */
EXECUTE OP_MSH_FAC_MODOBJ_OUT

/* Put Domain in MSH:9 */
SET DOMAIN_ENV = CNVTUPPER ( LOGICAL ( "ENVIRONMENT" )) 
IF (DOMAIN_ENV="P30")
set oen_reply->CONTROL_GROUP [1]->MSH [1]->processing_id->proc_id ="P"
ELSE
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->processing_id->proc_id = "T"
ENDIF
/* End Domain logic*/

/* Start for Attending Physician Change Order Logic*/

Declare sval_size = i4
  Set sval_size = size(oen_reply->cerner->stringList , 5)

  If (sval_size > 0)
    Set sv = 1
    For (sv = 1 to sval_size)
       If ((oen_reply->cerner->stringList [sv]->strMeaning = "cqm_subtype") and  
            (oen_reply->cerner->stringList [sv]->strVal= "PHYSCHG"))

          execute op_doc_filter_gen_outv5    

          declare attend_name_full = vc 
          declare attend_id = f8
          declare attend_alias = vc
          declare attend_alias_type_cd = i4
          declare ms_alias_pool_cd = i4

          Set obr_order_id = cnvtreal(trim(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->placer_ord_nbr [1]->entity_id))         
          Set ms_alias_pool_cd = UAR_GET_CODE_BY("DISPLAYKEY", 263, "BAYCAREDRNUMBER") 
          Set attend_alias_type_cd = UAR_GET_CODE_BY("DISPLAYKEY", 320, "ORGANIZATIONDOCTOR") 

          Select into "nl:"
          od.oe_field_display_value
           from order_detail od
            where od.order_id = obr_order_id and od.oe_field_meaning = "ATTENDDOC"
         detail
           attend_name_full = od.oe_field_display_value
         with nocounter


        select into "nl:"
       from prsnl prl
        where prl.name_full_formatted = attend_name_full and
          prl.active_ind = 1
        detail
           attend_id = prl.person_id
       with nocounter

      select into "nl:"
       from prsnl_alias pa
       where
         pa.person_id = attend_id and
         pa.alias_pool_cd = ms_alias_pool_cd  and
         pa.prsnl_alias_type_cd= attend_alias_type_cd   and
         pa.active_ind = 1
       detail
         attend_alias = pa.alias
       with nocounter

      Set stat=alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc,0)
      Set stat=alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc,1)
      Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc [1]->id_nbr = attend_alias
      
      go to exit_point
             Endif
         Endfor
     Endif    

/* End For Physician Change Order logic*/


/* Start Replace BAH Facility to MDU facility */

IF (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->building = "BAH") 
    Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = ""
    Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = "MDU"
Endif

/* End Replace BAH Facility to MDU facility */

/* Find consulting doctor  */
declare alias_pool_cd = i4
set alias_pool_cd = UAR_GET_CODE_BY("DISPLAYKEY", 263, "BAYCAREDRNUMBER") 

Set obr_order_id = cnvtreal(trim(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->placer_ord_nbr [1]->entity_id))
declare order_det_doc_fullfmt = vc 
declare personl_name_last = vc
declare personl_name_first = vc
declare personl_alias = vc
declare performed_id = f8

     Select into "nl:"
          od.oe_field_display_value
     from order_detail od
     where od.order_id = obr_order_id
     and od.oe_field_meaning = "CONSULTDOC"
     detail
          order_det_doc_fullfmt = od.oe_field_display_value
     with nocounter

execute oencpm_msglog(build("order_det_doc=>", order_det_doc_fullfmt))

      select into "nl:"
       from prsnl prl
       where
         prl.name_full_formatted = order_det_doc_fullfmt   and
         prl.active_ind=1
       detail
         personl_name_last = prl.name_last
         personl_name_first = prl.name_first
         performed_id=prl.person_id
       with nocounter
execute oencpm_msglog(build("performed_last_name=>", personl_name_last))

DECLARE PRSNL_ALIAS_POOL_CD_DISP = F8
SET PRSNL_ALIAS_POOL_CD_DISP =uar_get_code_by("DISPLAY",320,"ORGANIZATION DOCTOR")

     select into "nl:"
       from prsnl_alias pa
       where
         pa.person_id = performed_id and
         pa.alias_pool_cd=alias_pool_cd  and
        pa.prsnl_alias_type_cd=PRSNL_ALIAS_POOL_CD_DISP and
        pa.active_ind=1
       detail
         personl_alias=pa.alias
       with nocounter
set stat=alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->other_health_provider,0)
set stat=alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->other_health_provider,1)
         set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->other_health_provider [1]->last_name =personl_name_last
         Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->other_health_provider [1]->first_name =  personl_name_first
         Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->other_health_provider [1]->id_nbr = personl_alias
         Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->other_health_provider [1]->assign_auth->name_id = 
                    oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id 

/******  Adding in MS# for ConsultingDr in PV1 51  *******/

declare alias_type_cd = i4
declare alias_pool_cd2 = i4
set alias_type_cd = UAR_GET_CODE_BY("DISPLAYKEY", 320, "ORGANIZATIONDOCTOR") 
set alias_pool_cd2 = UAR_GET_CODE_BY("DISPLAYKEY", 263, "BAYCAREDRNUMBER") 

  for(encntr_x = 1 to size(oen_reply->cerner->encntr_prsnl_info->encntr,5))
   IF(oen_reply->cerner->encntr_prsnl_info->encntr [encntr_x]->reln_type_cdf = "OBR_28_1_1")
    set prsnl_person_id_pv152 = oen_reply->cerner->encntr_prsnl_info->encntr [encntr_x]->prsnl_r [1]->prsnl_person_id
    for(prsnl_x = 1 to size(oen_reply->cerner->prsnl_info->prsnl,5))
     IF(oen_reply->cerner->prsnl_info->prsnl [prsnl_x]->person_id = prsnl_person_id_pv152)
      for(alias_x = 1 to size(oen_reply->cerner->prsnl_info->prsnl [prsnl_x]->alias,5))       
     IF(oen_reply->cerner->prsnl_info->prsnl [prsnl_x]->alias [alias_x]->alias_type_cd = alias_type_cd)
  IF(oen_reply->cerner->prsnl_info->prsnl [prsnl_x]->alias [alias_x]->alias_pool_cd = alias_pool_cd2)

         Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->visit_ind = 
         oen_reply->cerner->prsnl_info->prsnl [prsnl_x]->alias [alias_x]->alias
       ENDIF
        ENDIF
      endfor
     ENDIF
    endfor
  ENDIF
 endfor

/******  Adding in MS# for ConsultingDr in OBR 15  *******/

  for(encntr_x = 1 to size(oen_reply->cerner->encntr_prsnl_info->encntr,5))
   IF(oen_reply->cerner->encntr_prsnl_info->encntr [encntr_x]->reln_type_cdf = "OBR_16_1_1")
 
    set prsnl_person_id_obr16 = oen_reply->cerner->encntr_prsnl_info->encntr [encntr_x]->prsnl_r [1]->prsnl_person_id
    for(prsnl_x = 1 to size(oen_reply->cerner->prsnl_info->prsnl,5))
     IF(oen_reply->cerner->prsnl_info->prsnl [prsnl_x]->person_id = prsnl_person_id_obr16)
      for(alias_x = 1 to size(oen_reply->cerner->prsnl_info->prsnl [prsnl_x]->alias,5))       
     IF(oen_reply->cerner->prsnl_info->prsnl [prsnl_x]->alias [alias_x]->alias_type_cd = alias_type_cd)
  IF(oen_reply->cerner->prsnl_info->prsnl [prsnl_x]->alias [alias_x]->alias_pool_cd = alias_pool_cd2)

Set oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->spec_source->spec_name_cd->identifier = 
         oen_reply->cerner->prsnl_info->prsnl [prsnl_x]->alias [alias_x]->alias
       ENDIF
   ENDIF
      endfor
     ENDIF
    endfor
  ENDIF
 endfor



/*9/2/10  by R Quack - adding logic to call doctor filter script*/
execute op_doc_filter_gen_outv5    

/* Start Replace MSH MDU TO BAH Facility */

IF (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->building = "BAH") 
    Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = ""
    Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = "BAH"
Endif

/* End Replace MSH MDU TO BAH Facility */
#exit_point