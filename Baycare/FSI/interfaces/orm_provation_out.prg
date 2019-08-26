/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  orm_provation_out
 *  Description:  Script for provation orders outbound
 *  Type:         Modify Object Script
 *  ---------------------------------------------------------------------------------------------
 *  Author:         Jerome Starke
 *  Library:        OEOCF23ORMORM
 *  Creation Date:  01/29/09
 *  Copied from orm_endo_out since cloverleaf using same xlate
 *  ---------------------------------------------------------------------------------------------
 *  Mod#  Date    Author       Description & Requestor Information
 *
 *  ---------------------------------------------------------------------------------------------
*/

/* Add facility */
EXECUTE OP_MSH_FAC_MODOBJ_OUT

/* filter out these facilies */
/* 05/06/14 by L Tabler - Added SJS to facility filter  */
If (oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id not in
("SJH","SJN","SFB","SJS","BRM","WHH","NBY","MDU","MCS","SAH","MPH","BAH"))
 Set OenStatus->Ignore=1
set oenstatus->ignore_text = build("SKIPPED: MSH4 RECEIVING APPLICATION OF ", 
oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id, " IS NOT A VALID MSH4 VALUE")
endif

/* 6/24/10 by R Quack - Remove PID;5.7 field*/
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_name [1]->name_type_cd = ""

/* ssn fix  */
if(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ssn_nbr ="999999999")
  set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->ssn_nbr =""
endif

/* 8/17/10 by R Quack - Change facility id for Same Day Surgery so orders file into SDS section of Endoworks*/
If (oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->nurse_unit = "SDSJM")
  Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->assigned_pat_loc->facility_id->name_id = "SDS"
  Set oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id =  "SDS"
endif

/* 6/24/10 by R Quack - Remove PV1;19 sub fields*/
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->visit_nbr [1]->check_digit = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->visit_nbr [1]->check_digit_scheme = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->visit_nbr [1]->assign_auth->name_id = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->visit_nbr [1]->assign_auth->univ_id = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->visit_nbr [1]->assign_auth->univ_id_type = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->visit_nbr [1]->type_cd = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->visit_nbr [1]->assign_fac_id->name_id = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->visit_nbr [1]->assign_fac_id->univ_id = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->visit_nbr [1]->assign_fac_id->univ_id_type = ""

/* 2-3-2010 Logic to identify Endoworks procedures and ignore other procedures*/
If (substring(1,3,
 oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->univ_service_id [1]->identifier)!="END")
Set OenStatus->Ignore=1
set oenstatus->ignore_text = "SKIPPED: UNIV_SERVICE_ID != END"
Endif

/*filter so SJN procedure orders go to Endo*/
;if ((oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id = "SJN")
;and
;(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->univ_service_id [1]->text not in 
;("Bronchoscopy in Endo","Colonoscopy","EGD","Insertion Revision PEG Tube",
;"Enteroscopy","ERCP","Gastroscopy","Ileoscopy","Intervention Place/Replace PEG",
;"Esophagoscopy","Laryngoscopy in Endo","Sigmoidoscopy","Intervention PEJ Tube",
;"Screening Sigmoidoscopy in Endo","Screening Colonoscopy in Endo","Endoscopic US Bronchial",
;"Endoscopic US Esophageal Gastric in Endo", "Endoscopic US Pancreatic in Endo","Endoscopic US Rectal in Endo")))
; Set OenStatus->Ignore=1
;Endif



/*6/21/10 by S Mong - Added logic for surgeon to go out in ORC:12 and OBR:16 */
/***8/18/14  R Quack - Modified logic to pull the new BAYCAREDRNUMBER alias pool instead of PRDOC facility pools***/
/* Find consulting doctor  */
set facility=oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id 
;set aliaspooldisplay=build(facility,"DRNUMBER")
Set aliaspooldisplay="BAYCAREDRNUMBER"
declare alias_pool_cd= f8 with public,constant(uar_get_code_by("DISPLAYKEY",263,aliaspooldisplay))
Set obr_order_id = cnvtreal(trim(oen_reply->ORDER_GROUP [1]->OBR_GROUP [1]->OBR->placer_ord_nbr [1]->entity_id))
declare order_det_doc_fullfmt = vc 
declare personl_name_last = vc
declare personl_name_first = vc
declare personl_alias = vc
declare performed_id = f8
execute oencpm_msglog(build("displaykey=>", aliaspooldisplay))

     Select into "nl:"
          od.oe_field_display_value
     from order_detail od
     where od.order_id = obr_order_id
     and od.oe_field_meaning = "SURGEON1"
     detail
          order_det_doc_fullfmt = od.oe_field_display_value
     with nocounter

execute oencpm_msglog(build("order_det_doc=>", order_det_doc_fullfmt))

      select into "nl:"
       from prsnl prl
       where
         prl.name_full_formatted = order_det_doc_fullfmt
       detail
         personl_name_last = prl.name_last
         personl_name_first = prl.name_first
         performed_id=prl.person_id
       with nocounter
execute oencpm_msglog(build("performed_last_name=>", personl_name_last))

      select into "nl:"
       from prsnl_alias pa
       where
         pa.person_id = performed_id and
         pa.alias_pool_cd=alias_pool_cd  and
         pa.prsnl_alias_type_Cd=1088 and
         pa.active_ind = 1
       detail
         personl_alias=pa.alias
       with nocounter

set stat=alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc,0)
set stat=alterlist(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc,1)
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc [1]->id_nbr = personl_alias
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc [1]->last_name = personl_name_last
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc [1]->first_name = personl_name_first
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc [1]->middle_name = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc [1]->suffix = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc [1]->prefix = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc [1]->degree = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc [1]->source = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc [1]->assign_auth->name_id = 
      oen_reply->CONTROL_GROUP [1]->MSH [1]->receiving_application->name_id 
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc [1]->assign_auth->univ_id = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc [1]->assign_auth->univ_id_type = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc [1]->name_type = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc [1]->check_digit = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc [1]->check_digit_scheme = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc [1]->id_type = "ORGANIZATION DOCTOR"
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc [1]->assign_fac_id->name_id = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc [1]->assign_fac_id->univ_id = ""
Set oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->attending_doc [1]->assign_fac_id->univ_id_type = ""

/*6/24/10  by R Quack - adding logic to call doctor filter script  Tony change to V5 Sorian Project*/
execute op_doc_filter_gen_out