/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  route_out
 *  Description:  Outbound routing script
 *  Type:         route script
 *  ---------------------------------------------------------------------------------------------
 *  Author:       Yitzhak Magoon
 *  Library:        
 *  Creation Date:  11/16/2018
 *  ---------------------------------------------------------------------------------------------
 *  Mod#   Date          Author                        Description & Requestor Information
 *  001       02/15/19   Magoon, Yitzhak    Make DFT filepath dynamic
 *  002       02/25/19   SParimi            RFC # 18493 Added coding for Resonance additional comservers
 *  003       04/09/19   Magoon, Yitzhak    RFC # 19507 Send ZM1 messages to Unknown queue
 *  004       04/10/19   H Kaczmarczyk      RFC # 19718 Adding PHYSCHG to ORM_CONSULT_OUT for attending physician change orders
 *  005       04/15/19   S Parimi           RFC # 20020  to Add code to suppress Pharmacy docs from Doseme
 *  006       06/10/19   H Kaczmarczyk      Model Changes Phase 1; ORU changes will be in Phase 2: Go-Live
 *											Added Palliative orders to Consult feed
 *                                          New routes: ORM_RADIOLOGY_OUT, ORM_HT_WT_OUT, RDE_RDS_PHARMACY_OUT
 *                                          Non-RLN Lab orders from ORM_TCP_BAYC_OUT to UNKNOWN_TRANS_DISK_OUT
 *  007       07/08/19   H Kaczmarcz        Model  Phase 2 ORU new routes: oru_documents_out, oru_documents_optum_out,
 *                                          and oru_lab_results_out
 *  008       08/08/19  Yitzhak Magoon      CHG0033763 Change name of document from EDPATIENTSUMMARY to EDSUMMARYTOPATIENTPORTAL  
 *  ---------------------------------------------------------------------------------------------
*/

;load subroutines
execute op_fsi_common 

declare cqm_type = c15
declare cqm_subtype = c20
declare cqm_class = c20
declare message_type = c3
declare message_trigger = c3

set message_type = trim(OENOBJ->CONTROL_GROUP[1]->MSH[1]->MESSAGE_TYPE->MESSG_TYPE)
set message_trigger = trim(OENOBJ->CONTROL_GROUP[1]->MSH[1]->MESSAGE_TYPE->MESSG_Trigger)
set cqm_type = get_string_value("cqm_type")
set cqm_class = get_string_value("cqm_class")
set cqm_subtype = get_string_value("cqm_subtype")

set oenstatus->status = 1
set stat = alterlist(oenroute->route_list, 1) ;default to 1. This is changed to 2 or 3 later in the program if needed

case (message_type)
   of "DFT":
        set intfilenm = get_string_value("interface file name")
        set amb = build("/cerner/d_",cnvtlower(curdomain),"/chg/amb_p01.dat") ;001
        set uc = build("/cerner/d_",cnvtlower(curdomain),"/chg/uc_p01.dat") ;001
	
        if (intfilenm = amb)
            set oenroute->route_list[1]->r_pid = get_proc_id("DFT_BMG_OUT")
        elseif (intfilenm = uc)
            set oenroute->route_list[1]->r_pid = get_proc_id("DFT_UC_OUT")
        else
            set oenroute->route_list[1]->r_pid = get_proc_id("DFT_SOARIAN_OUT")
        endif
	
    of "MFN":
        set oenroute->route_list[1]->r_pid = get_proc_id("MFN_PYXIS_OUT")
	
    of "ORM":
        declare order_id = f8
        set order_id = get_double_value("order_id")

        set alias_pool_display = 
            get_code_value_display(trim(oenobj->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->assign_auth->name_id))

        /* PKL messages are triggered when lab orders are added to a packing list and spec tracking location set to transmit 
           outbound for orders */
        if (cqm_type = "PKL") 
            set location_display = uar_get_code_display(cnvtreal(get_double_value("to_serv_resource")))

            if (location_display = "*Specialty*")
                set oenroute->route_list[1]->r_pid = get_proc_id("ORM_QUEST_INPT_SPEC_OUT")
                go to exit_point
            ;007
            elseif (location_display = "*CHANT*")
                set oenroute->route_list[1]->r_pid = get_proc_id("ORM_QUEST_INPT_OUT")
                go to exit_point
            elseif (location_display = "*NMSP*")
                set oenroute->route_list[1]->r_pid = get_proc_id("ORM_STATE_NEWBORN_OUT")
                go to exit_point             
            else ;if lab orders are transferred internally within Baycare, they will route here
                set oenroute->route_list[1]->r_pid = get_proc_id("UNKNOWN_TRANS_DISK_OUT")
                go to exit_point
            endif ;end 

        elseif (trim(cqm_class) = "SCS_NET") ;SCS_NET messages trigger when accession # assigned. Does not go through suppression.
            execute oencpm_msglog build("Enter if for cqm_class = SCS_NET", char(0))
            declare perf_loc = vc   
            set perf_loc = ""
  
            select 
                od.oe_field_display_value
            from order_detail od
                where od.order_id = order_id
                    and od.oe_field_meaning = "PERFORMLOC"
            order 
                od.action_sequence desc
            detail
                perf_loc = trim(od.oe_field_display_value)             
            with nocounter, maxrec = 1

            execute oencpm_msglog(build("perf_loc:",perf_loc,char(0)))

/* When the specimen is sent to a reference lab it is sent with a requisition. The order message must match the req. 
   The split_cnt is used at the comserver level for custom grouping logic with the bundler table to ensure this happens. */ 

            if (trim(perf_loc) = "BMG Quest Lab")  ;Quest performing location.
                set oenroute->route_list[1]->r_pid = get_proc_id("ORM_QUEST_OUTPT_OUT")
                set oenroute->route_list[1]->split_cnt = size(oenobj->order_group, 5)
                go to exit_point
            elseif (trim(perf_loc) = "BMG LabCorp Lab")  ;LabCorp performing location.
                set oenroute->route_list[1]->r_pid = get_proc_id("ORM_LCORP_OUTPT_OUT")
                set oenroute->route_list[1]->split_cnt = size(oenobj->order_group, 5)
                go to exit_point
            else
                set oenroute->route_list[1]->r_pid = get_proc_id("UNKNOWN_TRANS_DISK_OUT")
                go to exit_point
            endif
        endif ;end SCS_NET   
	
        declare activity_subtype = vc 

        select into "nl:"
            oc_activity_subtype_cdf = uar_get_code_meaning(oc.activity_subtype_cd)
        from
            orders   o
            , order_catalog   oc
        plan o 
            where o.order_id = order_id
        join oc 
            where o.catalog_cd = oc.catalog_cd
        detail
            activity_subtype = oc_activity_subtype_cdf
        with nocounter

        if (cqm_subtype in ("MRIRADIOLOGY","RADIOLOGY"))
            set oenroute->route_list[1]->r_pid = get_proc_id("ORM_RADIOLOGY_OUT")
            go to exit_point
        elseif (cqm_subtype = "RULEORDERS") ;height and weight
            set oenroute->route_list[1]->r_pid = get_proc_id("ORM_HT_WT_OUT")
            go to exit_point
        elseif (cqm_subtype = "AUDIOLOGY")
            set oenroute->route_list[1]->r_pid = get_proc_id("ORM_AUDIOLOGY_OUT")
            go to exit_point
        elseif (cqm_subtype in ("PHYSCONSULT", "PHYSCHG", "PALLIATIVE")) ;006
            set oenroute->route_list[1]->r_pid = get_proc_id("ORM_CONSULT_OUT")
            go to exit_point
        elseif (cqm_subtype in ("ADMITTO", "BAYESOSUPRES", "COMMUNICATIO"))
            set oenroute->route_list[1]->r_pid = get_proc_id("ORM_TELETRK_OUT")
            go to exit_point
        elseif (cqm_subtype = "SURGERY")
            set oenroute->route_list[1]->r_pid = get_proc_id("ORM_PROVATION_OUT")
            go to exit_point
        elseif (cqm_subtype = "CARDIOLOGY")
            set oenroute->route_list[1]->r_pid = get_proc_id("ORM_PHILIPS_OUT")
            go to exit_point
        elseif (cqm_subtype in ("ECHO","PEDI ECHO"))
            set stat = alterlist(oenroute->route_list, 2)
            set oenroute->route_list[1]->r_pid = get_proc_id("ORM_PHILIPS_OUT")
            set oenroute->route_list[2]->r_pid = get_proc_id("ORM_RADIOLOGY_OUT")
            go to exit_point
        elseif (cqm_subtype = "EKG")
            set oenroute->route_list[1]->r_pid = get_proc_id("ORM_MUSE_OUT")
            go to exit_point
        elseif (cqm_subtype = "CARDIOVASCUL")
            set stat = alterlist(oenroute->route_list, 2)
            set oenroute->route_list[1]->r_pid = get_proc_id("ORM_MUSE_OUT")
            set oenroute->route_list[2]->r_pid = get_proc_id("ORM_RADIOLOGY_OUT")
            go to exit_point
        elseif  (cqm_subtype in ("EDUTAINMENT", "OFCVIDEOS"))
            set oenroute->route_list[1]->r_pid = get_proc_id("ORM_GETWELL_EMMI_OUT")
            go to exit_point
        elseif (cqm_subtype in ("TUBEFEEDING","DIETARY"))
            set oenroute->route_list[1]->r_pid = get_proc_id("ORM_DIET_OUT")
            if (activity_subtype = "BRIDGE") ; if bridge is the sub activity type for activity type tubefeeding or dietary
                set stat = alterlist(oenroute->route_list, 2)
                set oenroute->route_list[2]->r_pid = get_proc_id("ORM_BRIDGE_OUT")
            endif
            go to exit_point
        elseif (activity_subtype = "BRIDGE")
            set oenroute->route_list[1]->r_pid = get_proc_id("ORM_BRIDGE_OUT")
            go to exit_point
        else
            set oenroute->route_list[1]->r_pid = get_proc_id("UNKNOWN_TRANS_DISK_OUT")
            go to exit_point
        endif ;end cqm_subtype

    of "ORU":
        declare ver_id = vc with constant(uar_get_code_display(oenobj->cerner->oe_info->message_version_cd))

        /* HL7 2.5 for Public Health Surveillance (PHS) and Electronic Lab Results (ELR) */
        if (trim(ver_id) = "2.5")
            if (cqm_subtype in ("GRP","MICRO"))
                set oenroute->route_list[1]->r_pid = get_proc_id("ORU_LAB_RESULTS_PHS_OUT")
            else
                set oenroute->route_list[1]->r_pid = get_proc_id("UNKNOWN_TRANS_DISK_OUT")
            endif
        else ; v2.3
            set alias_pool_display =  
        get_code_value_display(trim(oenobj->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_auth->name_id))

            if (alias_pool_display = "HI FIN") 
                set oenroute->route_list[1]->r_pid = get_proc_id("UNKNOWN_TRANS_DISK_OUT")
                go to exit_point
            endif
	  
            /* Stat results to Quest done by Baycare for stat weekend orders */
            set contributor_system_display = 
            get_code_value_display(trim(oenobj->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->assign_fac_id->name_id))
	  
            if (contributor_system_display = "QUESTAUTH")
                set oenroute->route_list[1]->r_pid = get_proc_id("ORU_QUEST_OUT")
                go to exit_point
            elseif (contributor_system_display = "quest")
                if (substring(1,2,oenobj->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->id) != "TM")
                    set oenroute->route_list[1]->r_pid = get_proc_id("ORU_QUEST_OUT")
                    go to exit_point         
                endif
            endif
            /* End Quest */

            /* MDOC/DOC documents */
            
            if (cqm_type in ("DOC", "MDOC"))
                declare route_list_size = i4 ;005
                set route_list_size = 0
		
                /* The following logic are all of the conditions where messages should not go to optum
                   HNAM_CEREF is for cardiology rebound results and radiology */
                if (alias_pool_display = "BMGFN" 
                     or oenobj->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->id = ""
                     or oenobj->RES_ORU_GROUP [1]->OBR [1]->filler_ord_nbr [1]->name_id != "HNAM_CEREF")

                     ;we don't send to optum if any of these 3 conditions is true
                     execute oencpm_msglog(build("Message not sent to Optum",char(0)))
                     execute oencpm_msglog(build("alias_pool=",alias_pool_display,char(0)))
                     execute oencpm_msglog(build("FIN=",
                     oenobj->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->id,char(0)))
                     execute oencpm_msglog(build("name_id=",
                     oenobj->RES_ORU_GROUP [1]->OBR [1]->filler_ord_nbr [1]->name_id,char(0)))
                else
                    set route_list_size = route_list_size + 1 
                    set oenroute->route_list[route_list_size]->r_pid = get_proc_id("ORU_DOCUMENTS_OPTUM_OUT")
                endif

                if (oenobj->RES_ORU_GROUP [1]->OBR [1]->univ_service_id [1]->text NOT in ("Pharmacy"))
                    set event_cd = 
                        get_code_value(trim(oenobj->RES_ORU_GROUP [1]->OBR [1]->univ_service_id [1]->identifier))

                    ;healthgrid documents
                    set ed_patient_summary = uar_get_code_by("DISPLAYKEY",72,"EDSUMMARYTOPATIENTPORTAL") ;008
                    set disc_summary_care = uar_get_code_by("DISPLAYKEY",72,"DISCHARGESUMMARYOFCARE")
                    ;hie documents
                    set history_and_physicals = uar_get_code_by("DISPLAYKEY",72,"HISTORYANDPHYSICALS")
                    set discharge_summary = uar_get_code_by("DISPLAYKEY",72,"DISCHARGESUMMARY")
                    set consultation = uar_get_code_by("DISPLAYKEY",72,"CONSULTATION")
                    set operative_reports = uar_get_code_by("DISPLAYKEY",72,"OPERATIVEREPORTS")
                    set cardiology_consult = uar_get_code_by("DISPLAYKEY",72,"CARDIOLOGYCONSULTATION")
                    set wound_consult = uar_get_code_by("DISPLAYKEY",72,"WOUNDCARECONSULTATION")
                    set oncology_consult = uar_get_code_by("DISPLAYKEY",72,"ONCOLOGYCONSULTATION")
                    set tele_neuro_consult = uar_get_code_by("DISPLAYKEY",72,"TELENEUROLOGYCONSULTATION")
                    set ob_procedure_note = uar_get_code_by("DISPLAYKEY",72,"OBPROCEDURENOTE")
                    set ed_physician_note = uar_get_code_by("DISPLAYKEY",72,"EDPHYSICIANNOTES")
                    set gi_endo_report = uar_get_code_by("DISPLAYKEY",72,"GIENDOSCOPYREPORTS")

                    if (event_cd in (history_and_physicals
                                    ,discharge_summary
                                    ,consultation
                                    ,operative_reports
                                    ,cardiology_consult
                                    ,wound_consult
                                    ,oncology_consult
                                    ,tele_neuro_consult
                                    ,ob_procedure_note
                                    ,ed_physician_note
                                    ,gi_endo_report
                                    ,ed_patient_summary
                                    ,disc_summary_care))
                        execute oencpm_msglog(build("HIE and HealthGrid Documents qualified to go outbound",char(0)))
                        set route_list_size = route_list_size + 1 
                        set stat = alterlist(oenroute->route_list,route_list_size)
                        set oenroute->route_list[route_list_size]->r_pid = get_proc_id("ORU_DOCUMENTS_OUT")
                        go to exit_point
                    endif
                   
                    set cqmrefnum = get_string_value("cqm_refnum")
                    execute oencpm_msglog(build("CQM REF NUM:",cqmrefnum,char(0)))
					
                    ;sample cqmrefnum - "14719819~4774834~247298"
                    set oru_contribsys_cd = piece(cqmrefnum, "~",2,"0")
                    execute oencpm_msglog(build("ORU CONTRIB SYS CD:",oru_contribsys_cd,char(0)))
					
                    set oru_contribsys = uar_get_code_display(cnvtreal(oru_contribsys_cd))
                    execute oencpm_msglog(build("ORU CONTRIB SYS:",oru_contribsys,char(0)))

                    if (oru_contribsys in ("MUSE", "MUSE BOI", "PHILIPS"))
                        execute oencpm_msglog(build("Cardiology rebound result",char(0)))

                        set route_list_size = route_list_size + 1 
                        set stat = alterlist(oenroute->route_list,route_list_size)
                        set oenroute->route_list[route_list_size]->r_pid = get_proc_id("ORU_DOCUMENTS_OUT")
                        go to exit_point
                     endif
                 endif ;end univ_service_id not "Pharmacy"
            endif ; end cqm_type in ("DOC", "MDOC")

            ;007 SurgiNet notes / discrete result to HealthGrid will no longer go outbound with Lab results
   
            if (oenobj->RES_ORU_GROUP [1]->OBR [1]->univ_service_id [1]->text = "zzzFormbuilder Form*")
                set oenroute->route_list[1]->r_pid = get_proc_id("ORU_DOCUMENTS_OUT") 
                go to exit_point
            endif  

     /* Model recommendation to reduce the amount of messages going to the bayc_out interface.
         By filtering on the activity type of the result, we will reduce the number of outbound messages. */
            if (cqm_type in ("AP", "MICRO", "GRP")) ;GRP is BB and GL, and other results
                set oenroute->route_list[1]->r_pid = get_proc_id("ORU_LAB_RESULTS_OUT") ;002
            else 
                set oenroute->route_list[1]->r_pid = get_proc_id("UNKNOWN_TRANS_DISK_OUT")
            endif 
        endif ; msg_version

    of "ADT":
        declare act_cs = vc

        set act_cs = get_string_value("action_contributor_system_cd")
        set alias_pool_display = 
          get_code_value_display(trim(oenobj->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_auth->name_id))

        /* When migrating to Cerner, an external Legacy EMR upload historical of clinical data was done. 
            This was needed temporarily needed to prevent allergy messages going outbound. 
            It can be removed after reg scheg project is complete. */
        
        if (trim(cqm_class) = "PM_ALLERGY" and act_cs = "1478944279")
            set stat = alterlist(oenRoute->route_list,0)
            ; allergy suppression
        elseif (message_trigger = "A28")
            set oenroute->route_list[1]->r_pid = get_proc_id("ADT_CPI_FETCH_HI_OUT")
        else
            set stat = alterlist(oenroute->route_list, 3)
            set oenroute->route_list[1]->r_pid = get_proc_id("ADT_SOARIAN_REBOUND_OUT")
            ;begin 001
            set remainder = mod(cnvtreal(oenobj->cerner->person_info->person->person_id), 4)

            if (remainder = 0)
                set oenroute->route_list[2]->r_pid = get_proc_id("RESONANCE_PIX_ADT_OUT_01")
                set oenroute->route_list[3]->r_pid = get_proc_id("RESONANCE_UTILITY_OUT_01")
            elseif (remainder = 1)
                set oenroute->route_list[2]->r_pid = get_proc_id("RESONANCE_PIX_ADT_OUT_02")
                set oenroute->route_list[3]->r_pid = get_proc_id("RESONANCE_UTILITY_OUT_02")
            elseif (remainder = 2)
                set oenroute->route_list[2]->r_pid = get_proc_id("RESONANCE_PIX_ADT_OUT_03")
                set oenroute->route_list[3]->r_pid = get_proc_id("RESONANCE_UTILITY_OUT_03")
            else
                set oenroute->route_list[2]->r_pid = get_proc_id("RESONANCE_PIX_ADT_OUT_04")
                set oenroute->route_list[3]->r_pid = get_proc_id("RESONANCE_UTILITY_OUT_04")
            endif
              ;end 001
      
            /* Public Health Surveillance (PHS) */
            if (message_trigger in ("A01", "A03", "A04", "A08"))
                set stat = alterlist(oenroute->route_list, 4)
                set oenroute->route_list[4]->r_pid = get_proc_id("ADT_PHS_OUT")
            endif
        endif ;end PM_ALLERGY

    of "BAR":
        if (message_trigger = "ZM1") ;003
            set oenroute->route_list[1]->r_pid = get_proc_id("UNKNOWN_TRANS_DISK_OUT")
            go to exit_point
        endif

        set alias_pool_display = 
          get_code_value_display(trim(oenobj->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_auth->name_id))
        
        execute oencpm_msglog(build("msh=",oenobj->CONTROL_GROUP [1]->MSH [1]->message_type->messg_trigger,char(0)))

        if (alias_pool_display = "BayCare FIN")
            set stat = alterlist(oenroute->route_list, 2)
            set oenroute->route_list[1]->r_pid = get_proc_id("BAR_SOARIAN_OUT")
            set oenroute->route_list[2]->r_pid = get_proc_id("ADT_PHS_OUT")
        else 
            set oenroute->route_list[1]->r_pid = get_proc_id("UNKNOWN_TRANS_DISK_OUT")
        endif

    of "RDE":
        set oenroute->route_list[1]->r_pid = get_proc_id("RDE_RDS_PHARMACY_OUT")

    of "RDS":
        set stat = alterlist(oenroute->route_list, 2)
        set oenroute->route_list[1]->r_pid = get_proc_id("RDS_PHARMO_OUT")
        set oenroute->route_list[2]->r_pid = get_proc_id("RDE_RDS_PHARMACY_OUT")

    of "SIU":
        set oenroute->route_list[1]->r_pid = get_proc_id("SIU_SURGINET_OUT")

    of "VXU":
        set oenroute->route_list[1]->r_pid = get_proc_id("VXU_HUB_OUT")

    else
        set oenroute->route_list[1]->r_pid = get_proc_id("UNKNOWN_TRANS_DISK_OUT")
endcase

#exit_point