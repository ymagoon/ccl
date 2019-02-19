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
 *  
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
            set oenroute->route_list[1]->r_pid = get_proc_id("DFT_TCPIP_BMG_OUT")
        elseif (intfilenm = uc)
            set oenroute->route_list[1]->r_pid = get_proc_id("DFT_TCPIP_UC_OUT")
        else
            set oenroute->route_list[1]->r_pid = get_proc_id("DFT_TCPIP_SOARIAN_OUT")
        endif
	
    of "MFN":
        set oenroute->route_list[1]->r_pid = get_proc_id("MFN_TCPIP_PYXIS_OUT")
	
    of "ORM":
        /****REF LAB ORDERS LOGIC****/
        declare order_id = f8
        set order_id = get_double_value("order_id")

        set alias_pool_display = 
            get_code_value_display(trim(oenobj->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->assign_auth->name_id))

        if (cqm_type = "PKL") ;orders on a lab packing list for the Ref Lab
            set location_display = uar_get_code_display(cnvtreal(get_double_value("to_serv_resource")))

            if (location_display = "*Specialty*")
                set oenroute->route_list[1]->r_pid = get_proc_id("ORM_TCP_SPEC_OUT")
                go to exit_point
            elseif (location_display = "*NMSP*")
                set oenroute->route_list[1]->r_pid = get_proc_id("ORM_TCP_STATE_NEWBORN_OUT")
                go to exit_point             
            else
                set oenroute->route_list[1]->r_pid = get_proc_id("UNKNOWN_TRANS_DISK_OUT")
                go to exit_point
            endif ;end 

        elseif (trim(cqm_class) = "SCS_NET") ;When Cerner accession number is assigned, order status is ordered (dispatched)
            execute oencpm_msglog build("Enter if for cqm_class = SCS_NET", char(0))
            declare perf_loc = vc   
            set perf_loc = ""
  
            select 
                od.oe_field_display_value
            from order_detail od
                where od.order_id = order_id
                     and od.oe_field_meaning=  "PERFORMLOC"
            order od.action_sequence desc
            detail
                perf_loc = trim(od.oe_field_display_value)             
            with nocounter, maxrec = 1

            execute oencpm_msglog(build("perf_loc:",perf_loc,char(0)))

            /* Split count to be used at comserver for custom grouping logic for Cerner bundler table
                Splitting by Order Group size ensures each order on an accession will go through interface individually. */
            if (trim(perf_loc) = "BMG Quest Lab")  ;Quest performing location.
                set oenroute->route_list[1]->r_pid = get_proc_id("ORM_TCP_BMGQUEST_OUT")
                set oenroute->route_list[1]->split_cnt = size(oenobj->order_group, 5)
                go to exit_point
            elseif (trim(perf_loc) = "BMG LabCorp Lab")  ;LabCorp performing location.
                set oenroute->route_list[1]->r_pid = get_proc_id("ORM_TCP_LABCORP_AMB_OUT")
                set oenroute->route_list[1]->split_cnt = size(oenobj->order_group, 5)
                go to exit_point
            else
                set oenroute->route_list[1]->r_pid = get_proc_id("ORM_TCP_BAYC_OUT")
                go to exit_point
            endif
        endif ;end SCS_NET   
        /****END REF LAB ORDERS and Ambulatory Reference Lab tranasctions ( for Quest) ****/
	
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
            set stat = alterlist(oenroute->route_list, 2)
            set oenroute->route_list[1]->r_pid = get_proc_id("ORM_TCP_IDX_OUT")
            set oenroute->route_list[2]->r_pid = get_proc_id("ORM_TCP_TELETRK_RAD_OUT")
            go to exit_point
       ; elseif (cqm_subtype = "RULEORDERS") ;001 height and weight
       ;     set oenroute->route_list[1]->r_pid = get_proc_id("ORM_HT_WT_OUT")
       ;     go to exit_point
        elseif (cqm_subtype = "AUDIOLOGY")
            set oenroute->route_list[1]->r_pid = get_proc_id("ORM_TCP_AUDIOLOGY_OUT")
            go to exit_point
        elseif (cqm_subtype in ("PHYSCONSULT", "PHYSCHG"))
            set oenroute->route_list[1]->r_pid = get_proc_id("ORM_TCP_CONSULT_OUT")
            go to exit_point
        elseif (cqm_subtype in ("ADMITTO", "BAYESOSUPRES", "COMMUNICATIO"))
            set oenroute->route_list[1]->r_pid = get_proc_id("ORM_TCP_TELETRK_OUT")
            go to exit_point
        elseif (cqm_subtype = "SURGERY")
            set oenroute->route_list[1]->r_pid = get_proc_id("ORM_TCP_PROVATION_OUT")
            go to exit_point
        elseif (cqm_subtype = "CARDIOLOGY")
            set oenroute->route_list[1]->r_pid = get_proc_id("ORM_TCP_PHILIPS_OUT")
            go to exit_point
        elseif (cqm_subtype in ("ECHO","PEDI ECHO"))
            set stat = alterlist(oenroute->route_list, 2)
            set oenroute->route_list[1]->r_pid = get_proc_id("ORM_TCP_PHILIPS_OUT")
            set oenroute->route_list[2]->r_pid = get_proc_id("ORM_TCP_IDX_OUT")
            go to exit_point
        elseif (cqm_subtype = "EKG")
            set oenroute->route_list[1]->r_pid = get_proc_id("ORM_TCP_MUSE_OUT")
            go to exit_point
        elseif (cqm_subtype = "CARDIOVASCUL")
            set stat = alterlist(oenroute->route_list, 2)
            set oenroute->route_list[1]->r_pid = get_proc_id("ORM_TCP_MUSE_OUT")
            set oenroute->route_list[2]->r_pid = get_proc_id("ORM_TCP_IDX_OUT")
            go to exit_point
        elseif  (cqm_subtype in ("EDUTAINMENT", "OFCVIDEOS"))
            set oenroute->route_list[1]->r_pid = get_proc_id("ORM_TCP_GETWELL_OUT")
            go to exit_point
        elseif (cqm_subtype in ("TUBEFEEDING","DIETARY"))
            set oenroute->route_list[1]->r_pid = get_proc_id("ORM_TCP_DIET_OUT")
            if (activity_subtype = "BRIDGE") ; if bridge is the sub activity type for activity type tubefeeding or dietary
                set stat = alterlist(oenroute->route_list, 2)
                set oenroute->route_list[2]->r_pid = get_proc_id("ORM_TCP_BRIDGE_OUT")
            endif
            go to exit_point
        elseif (activity_subtype = "BRIDGE")
            set oenroute->route_list[1]->r_pid = get_proc_id("ORM_TCP_BRIDGE_OUT")
            go to exit_point
        elseif (cqm_subtype in ("AP", "BB", "MICROBIOLOGY", "GLB")) ;Ignore initial lab order prior to accession number
            set oenroute->route_list[1]->r_pid = get_proc_id("UNKNOWN_TRANS_DISK_OUT")
        else
            set alias_size = oenobj->cerner->person_info->person [1]->alias_count        
            if (alias_size = 0 or alias_size = 1)   ;if patient identifiers are less than or equal to 1 then message is bogus
                set oenroute->route_list[1]->r_pid = get_proc_id("UNKNOWN_TRANS_DISK_OUT")
            else
                set oenroute->route_list[1]->r_pid = get_proc_id("ORM_TCP_BAYC_OUT")
            endif
    endif ;end cqm_subtype

    of "ORU":
        declare ver_id = vc with constant(uar_get_code_display(oenobj->cerner->oe_info->message_version_cd))

        /* HL7 2.5 for Public Health Surveillance (PHS) and Electronic Lab Results (ELR) */
        if (trim(ver_id) = "2.5")
            if (cqm_subtype in ("GRP","MICRO"))
                set oenroute->route_list[1]->r_pid = get_proc_id("ORU_TCP_CELR_OUT")
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
                set oenroute->route_list[1]->r_pid = get_proc_id("ORU_QUEST_TCP_OUT")
                go to exit_point
            elseif (contributor_system_display = "quest")
                if (substring(1,2,oenobj->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_id_ext->id) != "TM")
                    set oenroute->route_list[1]->r_pid = get_proc_id("ORU_QUEST_TCP_OUT")
                    go to exit_point         
                endif
            endif
            /* End Quest */

            /* MDOC/DOC documents */
            if (cqm_type in ("DOC", "MDOC"))
                set stat = alterlist(oenroute->route_list,3)
                set oenroute->route_list[1]->r_pid = get_proc_id("ORU_TCP_HIE_OUT")
                set oenroute->route_list[2]->r_pid = get_proc_id("ORU_TCP_OPTUM_MDOC_OUT")
                set oenroute->route_list[3]->r_pid = get_proc_id("ORU_TCP_HEALTHGRID_D_OUT")
                go to exit_point          
            endif

            /* Model recommendation to reduce the amount of messages going to the bayc_out interface.
                By filtering on the activity type of the result, we will reduce the number of outbound messages. */
            if (cqm_type in ("AP", "MICRO", "GRP")) ;GRP is BB and GL, and other results
                set stat = alterlist(oenroute->route_list,3)
                set oenroute->route_list[1]->r_pid = get_proc_id("ORU_TCP_BAYC_OUT")
                set oenroute->route_list[2]->r_pid = get_proc_id("ORU_TCP_OPTUM_LAB_OUT")
                set oenroute->route_list[3]->r_pid = get_proc_id("ORU_TCP_BRIDGE_OUT")
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
            ;end allergy suppression
        elseif (message_trigger = "A28")
            set oenroute->route_list[1]->r_pid = get_proc_id("ADT_TCPIP_HI_OUT")
        else
            set stat = alterlist(oenroute->route_list, 3)
            set oenroute->route_list[1]->r_pid = get_proc_id("ADT_TCPIP_SOARIAN_OUT")
            set oenroute->route_list[2]->r_pid = get_proc_id("RESONANCE_PIX_ADT_OUT_01")
            set oenroute->route_list[3]->r_pid = get_proc_id("RESONANCE_UTILITY_OUT_01")
      
            /* Public Health Surveillance (PHS) */
            if (message_trigger in ("A01", "A03", "A04", "A08"))
                set stat = alterlist(oenroute->route_list, 4)
                set oenroute->route_list[4]->r_pid = get_proc_id("ADT_TCP_CSSR_OUT")
            endif
        endif ;end PM_ALLERGY

    of "BAR":
        set alias_pool_display = 
          get_code_value_display(trim(oenobj->PERSON_GROUP [1]->PAT_GROUP [1]->PID [1]->patient_account_nbr->assign_auth->name_id))

        if (alias_pool_display = "BayCare FIN")
            set stat = alterlist(oenroute->route_list, 2)
            set oenroute->route_list[1]->r_pid = get_proc_id("BAR_TCPIP_SOARIAN_OUT")
            set oenroute->route_list[2]->r_pid = get_proc_id("ADT_TCP_CSSR_OUT")
        else 
            set oenroute->route_list[1]->r_pid = get_proc_id("UNKNOWN_TRANS_DISK_OUT")
        endif

    of "RDE":
        set stat = alterlist(oenroute->route_list, 3)
        set oenroute->route_list[1]->r_pid = get_proc_id("SI_PYXIS_OUTBOUND")
        set oenroute->route_list[2]->r_pid = get_proc_id("RDE_TCP_THERADOC_OUT")
        set oenroute->route_list[3]->r_pid = get_proc_id("RDE_TCP_OUT")
;        set oenroute->route_list[4]->r_pid = get_proc_id("RDE_RDS_PHARMACY_OUT")

    of "RDS":
        set stat = alterlist(oenroute->route_list, 2)
        set oenroute->route_list[1]->r_pid = get_proc_id("RDS_TCPIP_PHARMO_OUT")
        set oenroute->route_list[2]->r_pid = get_proc_id("RDE_TCP_OUT")
;        set oenroute->route_list[3]->r_pid = get_proc_id("RDE_RDS_PHARMACY_OUT")

    of "SIU":
        set oenroute->route_list[1]->r_pid = get_proc_id("SIU_TCPIP_SURGINET_OUT")

    of "VXU":
        set oenroute->route_list[1]->r_pid = get_proc_id("VXU_TCP_HUB_OUT")

    else
        set oenroute->route_list[1]->r_pid = get_proc_id("UNKNOWN_TRANS_DISK_OUT")
endcase

#exit_point