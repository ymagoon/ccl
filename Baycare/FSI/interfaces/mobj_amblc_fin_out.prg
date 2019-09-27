/*
*  ---------------------------------------------------------------------------------------------
*  Cerner Script Name:  mobj_amblc_fin_out
*  Description:  Modify Object Script for Amb LabCorp Msgs Outbound - FinGroup Cleanup
*  Type:  Open Engine Modify Object Script
*  ---------------------------------------------------------------------------------------------
*  Author:  FSI
*  Domain:  All
* Create Date: 3/30/16
*  ---------------------------------------------------------------------------------------------
*
*  Mod#   Date	        Author                 Description & Requestor Information
 *
 *  1:    08/19/16	  S Parimi      RFC # 13591 implementation of Orders outbound to LabCorp
*/

execute oencpm_msglog build("IN1 11 Value At top of script ->", 
oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->INS_GROUP [1]->IN1 [1]->insureds_rel_to_pat, char(0))

;Declare Fin_Class_Id = vc
;Set Fin_Class_Id = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->fin_class [1]->fin_class_id 
;execute oencpm_msglog build("Fin_Class_Id ->", Fin_Class_Id, char(0))

declare current_program = vc
Set current_program = curprog
execute oencpm_msglog build("In-", current_program, char(0))

declare fin_sz = i4
declare fin_x = i4
Set fin_sz = size(oen_reply->PERSON_GROUP [1]->FIN_GROUP, 5)
Set fin_x = 1

while (fin_x <= fin_sz)
  ; IN1 Segment

  declare ins_sz = i4
  declare ins_x = i4
  declare nins_sz = i4
  Set ins_sz = size(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP, 5)
  Set ins_x = 1
  Set nins_sz = 0

  while (ins_x <= ins_sz)
    Set nins_sz = nins_sz + 1
    Set stat = alterlist(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP, ins_sz + nins_sz)

    ; temp variable for the move, to shorten up the index fields.
    ; Current position to move data to is always the old length + the new additions.
    declare x = i4
    Set x = ins_sz + nins_sz

    ; IN1.1 - Move previous values
    Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->set_id = 
      trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [ins_x]->IN1 [1]->set_id)

    ; IN1.3 - Move IN1.2.1/2.2 to IN1.3.1/3.2
    Set stat = alterlist(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->ins_co_id, 1)
    Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->ins_co_id [1]->id = 
      trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [ins_x]->IN1 [1]->ins_plan_id->identifier)
    Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->ins_co_id [1]->check_digit = 
      trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [ins_x]->IN1 [1]->ins_plan_id->text)

    ; IN1.4 - Move previous values
    Set stat = alterlist(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->ins_co_name, 1)
    Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->ins_co_name [1]->org_name = 
      trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [ins_x]->IN1 [1]->ins_co_name [1]->org_name)

    ; IN1.5 - Move "valid" address.
    ; Valid defined by having a city, state, and zip code populated.
    declare in15_sz = i4
    declare in15_x = i4
    declare nin15_sz = i4
    Set in15_sz = size(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [ins_x]->IN1 [1]->ins_co_address, 5)
    Set in15_x = 1
    Set nin15_sz = 0
/*
    while (in15_x <= in15_sz)
      if ((trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [ins_x]->IN1 [1]->
            ins_co_address [in15_x]->city) != "") AND
          (trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [ins_x]->IN1 [1]->
            ins_co_address [in15_x]->state_prov) != "") AND
          (trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [ins_x]->IN1 [1]->
            ins_co_address [in15_x]->zip_code) != ""))
        ; Valid Address
        Set nin15_sz = nin15_sz + 1
        Set stat = alterlist(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->ins_co_address, nin15_sz)

        Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->
                ins_co_address [nin15_sz]->street = 
          trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [ins_x]->IN1 [1]->
                ins_co_address [in15_x]->street)
        Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->
                ins_co_address [nin15_sz]->other_desig = 
          trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [ins_x]->IN1 [1]->
                ins_co_address [in15_x]->other_desig)
        Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->
                ins_co_address [nin15_sz]->city = 
          trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [ins_x]->IN1 [1]->
                ins_co_address [in15_x]->city)
        Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->
                ins_co_address [nin15_sz]->state_prov = 
          trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [ins_x]->IN1 [1]->
                ins_co_address [in15_x]->state_prov)
        Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->
                ins_co_address [nin15_sz]->zip_code = 
          trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [ins_x]->IN1 [1]->
                ins_co_address [in15_x]->zip_code)
      endif

      Set in15_x = in15_x + 1
    endwhile
*/
    ; IN1.5 - Pull Insurance Address from person_plan_reltn, due to CR 1-3950262861 being in a postponed status.
    ; IN1.5 does not come out on Orders (only on Registration events) until this CR is fixed.
    ; Per Testing with the client, when they override the address at registration, it drops on person_plan_reltn table
    ; I will only populate if the previous section of code does not populate a value.
;ko3600 05/28/15 - Wrong Address being sent.  Need to grab data at the Encounter Level!!!!
    set nin15_sz = 0
    if (nin15_sz = 0)
      ; No Address fields were moved over, so query encntr_plan_reltn to get address
      declare encntr_id = f8
      declare health_plan_id = f8
      declare ins_co_id = f8
      declare active_status_cd = f8
      declare data_status_cd = f8
      Set encntr_id = get_double_value("encntr_id")
      Set health_plan_id = 
        cnvtreal(trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [ins_x]->IN1 [1]->
          ins_plan_id->identifier))
      Set ins_co_id = 
        cnvtreal(trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [ins_x]->IN1 [1]->
          ins_co_id [1]->id))
      Set active_status_cd = uar_get_code_by("MEANING", 48, "ACTIVE")
      Set data_status_cd = uar_get_code_by("MEANING", 8, "AUTH")

      if ((encntr_id > 0.0) and (health_plan_id > 0.0) and (ins_co_id > 0.0))
execute oencpm_msglog build("At IN1 5 and in IF statement", char(0))
execute oencpm_msglog build("encntr_id ->",encntr_id, char(0))
execute oencpm_msglog build("ins_co_id ->", ins_co_id, char(0))
execute oencpm_msglog build("health_plan_id ->", health_plan_id, char(0))

        select epr.encntr_plan_reltn_id, a.address_id
        from encntr_plan_reltn epr, address a
        plan epr
        where epr.encntr_id = encntr_id
          and epr.health_plan_id = health_plan_id
          and epr.organization_id = ins_co_id
          and epr.active_ind = 1
          and epr.active_status_cd = active_status_cd
          and epr.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
        join a
        where a.parent_entity_id = epr.encntr_plan_reltn_id
          and a.parent_entity_name = "ENCNTR_PLAN_RELTN"
          and a.active_ind = 1
          and a.active_status_cd = active_status_cd
          and a.data_status_cd = data_status_cd
          and a.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
        detail
          if ((trim(a.city) != "") AND
              ;(trim(a.state) != "") AND
               (trim(a.zipcode) != ""))
            ; Valid Address
            stat = alterlist(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->ins_co_address, 0)
            nin15_sz = nin15_sz + 1
            stat = alterlist(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->ins_co_address, nin15_sz)

            oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->
                  ins_co_address [nin15_sz]->street = 
              trim(a.street_addr)
            oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->
                  ins_co_address [nin15_sz]->other_desig = 
              trim(a.street_addr2)
            oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->
                  ins_co_address [nin15_sz]->city = 
              trim(a.city)
            oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->
                  ins_co_address [nin15_sz]->state_prov = 
              trim(a.state)
            oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->
                  ins_co_address [nin15_sz]->zip_code = 
              trim(a.zipcode)
          endif
        with nocounter
        if(curqual > 0)
execute oencpm_msglog build("Success at IN1 5 Select", char(0))
        else
execute oencpm_msglog build("Failure at IN1 5 Select", char(0))
        endif
      endif
    endif

   Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->INS_GROUP [x]->IN1 [1]->INS_PLAN_ID->IDENTIFIER=""
   Set org_name=oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->INS_GROUP [ins_x]->IN1 [1]->ins_co_name [1]->org_name
   Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->INS_GROUP [x]->IN1 [1]->ins_co_name [1]->org_name=
    oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->INS_GROUP [ins_x]->IN1 [1]->INS_PLAN_ID->TEXT
   Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->INS_GROUP [x]->IN1 [1]->INS_PLAN_ID->TEXT = ""
   Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->INS_GROUP [x]->IN1 [1]->INS_PLAN_ID->ALT_TEXT = ""
   Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->INS_GROUP [x]->IN1 [1]->INS_PLAN_ID->IDENTIFIER=org_name
;MH012117   commenting out IN1.3.1 being blank - populate IN1.3.1
;  Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->INS_GROUP [x]->IN1 [1]->INS_CO_ID [1]->ID=""
;MH012117  blanking IN1.3.2 per LabCorp request
   Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [1]->INS_GROUP [x]->IN1 [1]->ins_co_id [1]->check_digit = ""

    ; IN1.8 - Move previous values
    Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->group_nbr = 
      trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [ins_x]->IN1 [1]->group_nbr)

    ; IN1.11 - Move previous values
    Set stat = alterlist(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->group_emp_name, 1)
    Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->group_emp_name [1]->org_name = 
      trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [ins_x]->IN1 [1]->group_emp_name [1]->org_name )

    ; IN1.15 - Move previous values
    Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->plan_type = 
      trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [ins_x]->IN1 [1]->plan_type)

    ; IN1.16 - Move previous values
    Set stat = alterlist(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->name_of_insured, 1)
    Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->name_of_insured [1]->last_name = 
      trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [ins_x]->IN1 [1]->name_of_insured [1]->last_name)
    Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->name_of_insured [1]->first_name = 
      trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [ins_x]->IN1 [1]->name_of_insured [1]->first_name)
    Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->name_of_insured [1]->middle_name = 
      trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [ins_x]->IN1 [1]->name_of_insured [1]->middle_name)

    ; IN1.17 - Move from IN2.72
    ; Valid LabCorp values
    ; 1 Self
    ; 2 Spouse
    ; 3 Other
execute oencpm_msglog build("At IN1 11 Section", char(0))
     If(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [ins_x]->IN2 [1]->hcfa_pat_reltn->identifier > " ")
execute oencpm_msglog build("Inside the IF Statement", char(0))
       Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->insureds_rel_to_pat = 
         trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [ins_x]->IN2 [1]->hcfa_pat_reltn->identifier)
    Else
execute oencpm_msglog build("IN1 11 Value ->", 
oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [ins_x]->IN1 [1]->insureds_rel_to_pat, char(0))
execute oencpm_msglog build("Ins_X Value ->", ins_x, char(0))
execute oencpm_msglog build("X Value ->", x, char(0))
       Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->insureds_rel_to_pat =
           oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [ins_x]->IN1 [1]->insureds_rel_to_pat
    endif

;execute oencpm_msglog build("IN1 11 Value ->", 
;oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->insureds_rel_to_pat, char(0))

    ; IN1.19 - Move "valid" address.
    ; Valid defined by having a city, state, and zip code populated.
    declare in119_sz = i4
    declare in119_x = i4
    declare nin119_sz = i4
    Set in119_sz = size(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [ins_x]->IN1 [1]->insureds_address, 5)
    Set in119_x = 1
    Set nin119_sz = 0

    while (in119_x <= in119_sz)
      if ((trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [ins_x]->IN1 [1]->
            insureds_address [in119_x]->city) != "") AND
          (trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [ins_x]->IN1 [1]->
            insureds_address [in119_x]->state_prov) != "") AND
          (trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [ins_x]->IN1 [1]->
            insureds_address [in119_x]->zip_code) != ""))
        ; Valid Address
        Set nin119_sz = nin119_sz + 1
        Set stat = alterlist(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->insureds_address, nin119_sz)

        Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->
                insureds_address [nin119_sz]->street = 
          trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [ins_x]->IN1 [1]->
                insureds_address [in119_x]->street)
        Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->
                insureds_address [nin119_sz]->other_desig = 
          trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [ins_x]->IN1 [1]->
                insureds_address [in119_x]->other_desig)
        Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->
                insureds_address [nin119_sz]->city = 
          trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [ins_x]->IN1 [1]->
                insureds_address [in119_x]->city)
        Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->
                insureds_address [nin119_sz]->state_prov = 
          trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [ins_x]->IN1 [1]->
                insureds_address [in119_x]->state_prov)
        Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->
                insureds_address [nin119_sz]->zip_code = 
          trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [ins_x]->IN1 [1]->
                insureds_address [in119_x]->zip_code)
      endif

      Set in119_x = in119_x + 1
    endwhile

Set Fin_Class_Id = oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->fin_class [1]->fin_class_id 
execute oencpm_msglog build("Fin_Class_Id ->", Fin_Class_Id, char(0))

    ; IN1.31 - if PV1.20 = W (Worker's Comp, codeset 354), Set IN1.31 = Y, else set to N
    if (trim(oen_reply->PERSON_GROUP [1]->PAT_GROUP [1]->PV1 [1]->fin_class [1]->fin_class_id) = "W")
      Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->type_of_agr_cd = "Y"
    else
      Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->type_of_agr_cd = "N"
    endif

    ; IN1.36 - Move IN1.49 insured id nbr
    Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [x]->IN1 [1]->policy_nbr = 
      trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP [ins_x]->IN1 [1]->insured_id_nbr [1]->id)

    Set ins_x = ins_x + 1
  endwhile

  ; Remove "old" INS_Group values, keeping the new ones at the end.
  Set stat = alterlist(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP, nins_sz, 0)

  ; if the size of the INS_GROUP is > 2 after the formatting script executes, keep only 2.
  ; LabCorp only wants 2 insurances max.
  if (size(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP, 5) > 2)
    Set stat = alterlist(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->INS_GROUP, 2)
  endif

  ; GT1 Segment
  declare gt1_sz = i4
  declare gt1_x = i4
  declare ngt1_sz = i4
  Set gt1_sz = size(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1, 5)
  Set gt1_x = 1
  Set ngt1_sz = 0

  while (gt1_x <= gt1_sz)
    Set ngt1_sz = ngt1_sz + 1
    Set stat = alterlist(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1, gt1_sz + ngt1_sz)

    ; temp variable for the move, to shorten up the index fields.
    ; Current position to move data to is always the old length + the new additions.
    declare x = i4
    Set x = gt1_sz + ngt1_sz

    ; GT1.1 - Move previous values
    Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1 [x]->set_id = 
      trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1 [gt1_x]->set_id)

    ; GT1.3 - Move previous values
    Set stat = alterlist(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1 [x]->guar_name, 1)
    Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1 [x]->guar_name [1]->last_name = 
      trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1 [gt1_x]->guar_name [1]->last_name)
    Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1 [x]->guar_name [1]->first_name = 
      trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1 [gt1_x]->guar_name [1]->first_name)
    Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1 [x]->guar_name [1]->middle_name = 
      trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1 [gt1_x]->guar_name [1]->middle_name)

    ; GT1.5 - Move "valid" address.
    ; Valid defined by having a city, state, and zip code populated.
    declare gt15_sz = i4
    declare gt15_x = i4
    declare ngt15_sz = i4
    Set gt15_sz = size(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1 [gt1_x]->guar_address, 5)
    Set gt15_x = 1
    Set ngt15_sz = 0

    while (gt15_x <= gt15_sz)
      if ((trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1 [gt1_x]->guar_address [gt15_x]->city) != "") AND
          (trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1 [gt1_x]->guar_address [gt15_x]->state_prov) != "") AND
          (trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1 [gt1_x]->guar_address [gt15_x]->zip_code) != ""))
        ; Valid Address
        Set ngt15_sz = ngt15_sz + 1
        Set stat = alterlist(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1 [x]->guar_address, ngt15_sz)

        Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1 [x]->guar_address [ngt15_sz]->street = 
          trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1 [gt1_x]->guar_address [gt15_x]->street)
        Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1 [x]->guar_address [ngt15_sz]->other_desig = 
          trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1 [gt1_x]->guar_address [gt15_x]->other_desig)
        Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1 [x]->guar_address [ngt15_sz]->city = 
          trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1 [gt1_x]->guar_address [gt15_x]->city)

        Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1 [x]->guar_address [ngt15_sz]->state_prov = 
          trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1 [gt1_x]->guar_address [gt15_x]->state_prov)
        Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1 [x]->guar_address [ngt15_sz]->zip_code = 
          trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1 [gt1_x]->guar_address [gt15_x]->zip_code)
      endif

      Set gt15_x = gt15_x + 1
    endwhile

    ; GT1.6 - Move previous values
    Set stat = alterlist(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1 [x]->ph_nbr_home, 1)
    Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1 [x]->ph_nbr_home [1]->phone_nbr = 
      trim(cnvtalphanum(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1 [gt1_x]->ph_nbr_home [1]->phone_nbr))

    ; GT1.11 - Move from ZGI Relationship field, if populated.  Else move from GT1.11 previous value
    if (size(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->ZGI, 5) > 0)
      ; ZGI Segments built - move ZGI.3 to GT1.11
      Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1 [x]->relationship = 
        trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->ZGI [gt1_x]->patient_reltn)
    else
      ; No ZGI Segments - move GT1.11 existing value
      Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1 [x]->relationship = 
        trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1 [gt1_x]->relationship)
    endif

    ; GT1.16 - Move previous values
    Set stat = alterlist(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1 [x]->emp_name, 1)
    Set oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1 [x]->emp_name [1]->last_name =
      trim(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1 [gt1_x]->emp_name [1]->last_name)


    Set gt1_x = gt1_x + 1
  endwhile

  ; Remove "old" GT1 values, keeping the new ones at the end.
  Set stat = alterlist(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->GT1, ngt1_sz, 0)

  ; Remove ZGI Segments
  Set stat = alterlist(oen_reply->PERSON_GROUP [1]->FIN_GROUP [fin_x]->ZGI, 0)

  Set fin_x = fin_x + 1
endwhile

declare current_program = vc
Set current_program = curprog
execute oencpm_msglog build("Out-", current_program, char(0))