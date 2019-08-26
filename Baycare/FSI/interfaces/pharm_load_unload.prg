;07/12/05 MK7393 Baseline and add Inventory Grouping

set oenstatus->status = 0
set oenstatus->status_detail = 4

if( validate( temp_request, 0 ) )
   free record temp_request
endif

free set dds_temp
record dds_temp
(
 1 msg = vc
 1 pckt_cd    = vc
 1 medstation = vc
 1 med_id     = vc
 1 meddef_item_id = f8
 1 amount     = f8
 1 total      = f8
 1 nurse_unit = vc
 1 trans_unit = f8
 1 pyxis_id   = f8
 1 object_id  = f8
 1 item_master_id   = f8 
 1 base_pkg_type_id = f8 
 1 dispense_factor  = f8 
 1 inv_qty          = f8 
 1 inv_list[*]           
   2 inv_location_cd      = f8 
   2 transfer_location_cd = f8
 1 status     = i4
 1 prod_base_pkg_type_id = f8
)

declare nValid       = i2 with protect, noconstant(0) 
declare dStat        = f8 with protect, noconstant(0.0)
declare cPCKT_LOAD   = f8 with protect, noconstant(0.0)
declare cPCKT_UNLOAD = f8 with protect, noconstant(0.0)
declare lInvListSize = i4 with protect, noconstant(0)
declare lTranCnt     = i4 with protect, noconstant(0)
declare lAdjCnt      = i4 with protect, noconstant(0)
declare last_mod     = c3 with protect, noconstant("000")

set dds_temp->msg = replace(OenOrgMsg->Msg,concat(char(13),"PID"),concat(char(13),"ZPM"),0)

execute oen_setup_requests
set stat = alterlist(request->segs,1)
set request->segs[1]->seg_name = "ZPM"

set request->message = dds_temp->msg

set trace recpersist
execute oencpm_msglog ("Calling oen_parse_segments")
execute oen_parse_segments
execute oencpm_msglog("Back from oen_parse_segments")
set trace norecpersist

set dds_temp->pckt_cd = trim(saved_seg->seg[1]->field[1]->field_value)
execute oencpm_msglog(build("pckt_cd=",dds_temp->pckt_cd,char(0)))

if ((dds_temp->pckt_cd != "U") and (dds_temp->pckt_cd != "L"))
execute oencpm_msglog (concat("EP",dds_temp->pckt_cd," ignored",char(0)))
set oenstatus->status = 1
go to exit_script
endif

set dds_temp->medstation = trim(saved_seg->seg[1]->field[2]->field_value)
execute oencpm_msglog(build("medstation=",dds_temp->medstation,char(0)))

set dds_temp->med_id = trim(saved_seg->seg[1]->field[6]->field_value)
execute oencpm_msglog(build("med_id=",dds_temp->med_id,char(0)))

set dds_temp->amount = cnvtint(saved_seg->seg[1]->field[11]->field_value)
execute oencpm_msglog(build("amount=",dds_temp->amount,char(0)))

set dds_temp->total = cnvtint(saved_seg->seg[1]->field[16]->field_value)
execute oencpm_msglog(build("total=",dds_temp->total,char(0)))

set dds_temp->nurse_unit = trim(saved_seg->seg[1]->field[3]->field_value)

execute oencpm_msglog(build("nurse_unit=",dds_temp->nurse_unit,char(0)))

select into "nl:" c.code_value from code_value c
where c.code_set = 11000 and
      c.cdf_meaning = "PYXIS"
detail
  dds_temp->pyxis_id = c.code_value
with     maxqual(c,1), nocounter

if (curqual = 0)
 execute oencpm_msglog(concat("Unable to locate CV for PYXIS in codeset 11000"))
 set oenstatus->status = 0
 set oenstatus->status_detail = 4
 go to exit_script
endif

execute oencpm_msglog(build("Pyxis_id=",dds_temp->pyxis_id,char(0)))

declare nInvTrackLevel     = i2  with protect, noconstant(0)
declare nINV_DRUG_FORM     = i2  with protect, constant(0)
declare nINV_MANF_ITEM     = i2  with protect, constant(1)
 
select    into "NL:"
          dm.pref_nbr
from      dm_prefs dm
          where dm.pref_domain = "PHARMNET-INPATIENT"
          and   dm.pref_section = "FORMULARY"
          and   dm.pref_name = "PROCURE"
          and   dm.application_nbr+0 = 300000
detail
          nInvTrackLevel = dm.pref_nbr
with      nocounter

declare nInvGroup          = i2  with protect, noconstant(0)
declare dGrpItemID         = f8  with protect, noconstant(0.0)
declare dGrpBasePkgID      = f8  with protect, noconstant(0.0)

select    into "NL:"
          dm.pref_nbr
from      dm_prefs dm
          where dm.pref_domain = "PHARMNET"
          and   dm.pref_section = "FORMULARY"
          and   dm.pref_name = "PROCUREGROUP"
          and   dm.application_nbr+0 = 300000
detail
          nInvGroup = dm.pref_nbr
with      nocounter

free set request
record request
(
 1 value        = vc
 1 type_cd      = f8
)

set request->value = dds_temp->med_id
set request->type_cd = dds_temp->pyxis_id
free set reply
free set start_time
set trace recpersist
execute pha_get_item_by_identifier
set trace norecpersist

if (reply->status_data->status != "S" )
  execute oencpm_msglog
  (build("PHA_GET_ITEM_BY_IDENTIFIER failed to retrieve med_def_item_id for Pyxis med_id:",dds_temp->med_id,char(0)))
  execute oencpm_msglog (build("IGNORING Pyxis med_id:",dds_temp->med_id,char(0)))
  set oenstatus->status =1
else
  execute oencpm_msglog (build("Meddef_id=",reply->meddef_item_id,char(0)))
  set dds_temp->meddef_item_id = reply->meddef_item_id

  execute oencpm_msglog(build("Dispense_factor =",reply->dispense_factor,char(0)))
  set dds_temp->dispense_factor = reply->dispense_factor
  
  if (nInvTrackLevel = nINV_DRUG_FORM)
    execute oencpm_msglog(build("Prod_base_pkg_type_id =",reply->prod_base_pkg_type_id,char(0)))
    set dds_temp->prod_base_pkg_type_id = reply->prod_base_pkg_type_id

  	execute oencpm_msglog(build("Item_master_id =",reply->meddef_item_id,char(0)))
  	set dds_temp->item_master_id = reply->meddef_item_id 

   if (nInvGroup = 1)
      select into "nl:"
             *
      from   medication_definition md
            ,package_type pt
      plan   md
             where md.item_id = dds_temp->item_master_id
             and   md.inv_master_id+0 > 0
      join   pt
             where pt.item_id = md.inv_master_id
             and   pt.base_package_type_ind+0 = 1
             and   pt.active_ind+0 = 1
      detail
             dGrpItemID    = md.inv_master_id
             dGrpBasePkgID = pt.package_type_id
      with   nocounter

      execute oencpm_msglog(build("dGrpItemID    =",dGrpItemID,char(0)))
      execute oencpm_msglog(build("dGrpBasePkgID =",dGrpBasePkgID,char(0)))       
   endif

   if (dds_temp->item_master_id > 0 and dds_temp->prod_base_pkg_type_id > 0 and
       dds_temp->dispense_factor > 0)
      set nValid = 1
   endif
  else
    execute oencpm_msglog(build("Base_pkg_type_id =",reply->base_pkg_type_id,char(0)))
    set dds_temp->base_pkg_type_id = reply->base_pkg_type_id
 
    execute oencpm_msglog(build("Item_master_id =",reply->item_master_id,char(0)))
    set dds_temp->item_master_id = reply->item_master_id
  
    if (dds_temp->item_master_id > 0 and dds_temp->base_pkg_type_id > 0 and
        dds_temp->dispense_factor > 0)
      set nValid = 1
    endif
  endif

  execute oencpm_msglog(build("nValid =",nValid,char(0)))

  free set request
  record request
  (
  1 medstation = vc
  )

  set request->medstation = dds_temp->nurse_unit
  free set reply
  free set cnt1
  free set failed
  set false = 0
  set trace recpersist
  execute rx_get_medstation
  set trace norecpersist
  execute oencpm_msglog (build("rx_get_medstation=",reply->status_data->status,char(0)))
  if (reply->status_data->status != "S" )
    execute oencpm_msglog(build("rx_get_medstation returned status=",reply->status_data->status,char(0)))
    execute oencpm_msglog(build("Operation:",reply->status_data->subeventstatus->operationname,char(0)))
    execute oencpm_msglog(build("Operation Status:",reply->status_data->subeventstatus->operationstatus,char(0)))
    execute 
     oencpm_msglog( build("TargetObjectName:",REPLY->STATUS_DATA->SUBEVENTSTATUS[1]->TARGETOBJECTNAME ,char(0)))
    execute 
     oencpm_msglog( build("TargetObjectValue:", REPLY->STATUS_DATA->SUBEVENTSTATUS[1]->TARGETOBJECTVALUE ,char(0)))
        
    set oenstatus->status = 0
    set oenstatus->status_detail = 4
  else
    free set loc_cd
    record loc_cd
    (
    1 qual[*]
    2 value = f8
    )
    execute oencpm_msglog(build("Medstation cnt=",size(reply->qual,5),char(0)))
    set stat = alterlist(loc_cd->qual,size(reply->qual,5))
    for (x = 1 to size(reply->qual,5))
      execute oencpm_msglog(build("Loc_cd[",x,"]=",reply->qual[x]->location_cd,char(0)))
      set loc_cd->qual[x]->value = reply->qual[x]->location_cd
    endfor

    if (nValid = 1)
      select into "nl:"
      from 
        (dummyt d with seq = value(size(loc_cd->qual,5))),
        location_inv_info lii
            
      plan d
      join lii
        where lii.location_cd = loc_cd->qual[d.seq]->value
          and lii.chk_available_ind = 1
          
      head report
        cnt = 0
          
      detail
        cnt = cnt + 1
        dStat = alterlist(dds_temp->inv_list,cnt)
          
        dds_temp->inv_list[cnt]->inv_location_cd = lii.location_cd
           
      with nocounter
          
      set lInvListSize = size(dds_temp->inv_list,5)
      if (lInvListSize > 0)     

        free set fill_loc_request
        record fill_loc_request
        (
          1 qual[*]
            2 item_id    = f8
            2 req_loc_cd = f8
            2 req_pkg_id = f8
        )

        free set fill_loc_reply
        free set reply
        record fill_loc_reply
        (
          1 qual[*]
            2 item_id             = f8
            2 req_loc_cd          = f8
            2 req_pkg_id          = f8
            2 fill_loc_cd         = f8
            2 backorder_ind       = i2
            2 auto_distribute_ind = i2
%i cclsource:status_block.inc
        )

        set dStat = alterlist(fill_loc_request->qual,lInvListSize)
        for (x = 1 to lInvListSize)
          set fill_loc_request->qual[x]->item_id = dds_temp->item_master_id
          set fill_loc_request->qual[x]->req_loc_cd = dds_temp->inv_list[x]->inv_location_cd

          if (nInvGroup = 1 and dGrpItemID > 0 and dGrpBasePkgID > 0)
            set fill_loc_request->qual[x]->item_id = dGrpItemID
          endif
        endfor

        execute oencpm_msglog("Calling mm_get_fill_location")
        execute mm_get_fill_location with replace ("REQUEST", "FILL_LOC_REQUEST"),
                                          replace ("REPLY", "FILL_LOC_REPLY") 
        execute oencpm_msglog("Back from mm_get_fill_location")

        for (x = 1 to lInvListSize)
          set dds_temp->inv_list[x]->transfer_location_cd = fill_loc_reply->qual[x]->fill_loc_cd
        endfor

        free set fill_loc_request
        free set fill_loc_reply

        set dds_temp->inv_qty = dds_temp->amount * dds_temp->dispense_factor
        execute oencpm_msglog(build("inv_qty =",dds_temp->inv_qty,char(0)))

        set dStat = UAR_GET_MEANING_BY_CODESET(11022,"PCKT_LOAD",1,cPCKT_LOAD)
        set dStat = UAR_GET_MEANING_BY_CODESET(11022,"PCKT_UNLOAD",1,cPCKT_UNLOAD)
            
        execute oencpm_msglog(build("PCKT_LOAD =",cPCKT_LOAD,char(0)))
        execute oencpm_msglog(build("PCKT_UNLOAD =",cPCKT_UNLOAD,char(0)))
            
        free set trans_request
        record trans_request
        (
          1 trans_list[*]
            2 from_location_cd = f8
            2 to_location_cd = f8
            2 qual[*]
              3 item_id = f8
              3 qty = f8
              3 package_type_id = f8
        )
        
        free set aga_request
        record aga_request
        (
          1 inv_list[*]
            2 parent_entity_id = f8
            2 parent_entity_name = c32
            2 parent_entity_ref = c40
            2 qual [*]
              3 item_id = f8
              3 qty = f8
              3 location_cd =f8
              3 locator_cd = f8
              3 package_type_id = f8
              3 increase_ind = i2
              3 reason_cd = f8
              3 person_id = f8
        )
            
        for (x = 1 to lInvListSize)  
          execute oencpm_msglog(build("inv_location_cd[",x,"]=",
                  dds_temp->inv_list[x]->inv_location_cd,char(0)))
           
          execute oencpm_msglog(build("transfer_location_cd[",x,"]=",
                  dds_temp->inv_list[x]->transfer_location_cd,char(0)))
            
          if (dds_temp->inv_list[x]->transfer_location_cd > 0)
            set lTranCnt = lTranCnt + 1
            set dStat = alterlist(trans_request->trans_list,lTranCnt)
                        
            case (dds_temp->pckt_cd)
              of "L":
                execute oencpm_msglog("Device Transfer Load")
              
                set trans_request->trans_list[lTranCnt]->from_location_cd =
                    dds_temp->inv_list[x]->transfer_location_cd
                    
                set trans_request->trans_list[lTranCnt]->to_location_cd =
                    dds_temp->inv_list[x]->inv_location_cd
                
              of "U":
                execute oencpm_msglog("Device Transfer Unload")
                      
                set trans_request->trans_list[lTranCnt]->from_location_cd =
                    dds_temp->inv_list[x]->inv_location_cd
                    
                set trans_request->trans_list[lTranCnt]->to_location_cd =
                    dds_temp->inv_list[x]->transfer_location_cd
            endcase
                        
            set dStat = alterlist(trans_request->trans_list[lTranCnt]->qual,1)

            set trans_request->trans_list[lTranCnt]->qual[1]->qty =
                dds_temp->inv_qty
            
            if (nInvTrackLevel = nINV_DRUG_FORM)
              set trans_request->trans_list[lTranCnt]->qual[1]->package_type_id =
                  dds_temp->prod_base_pkg_type_id
            else
              set trans_request->trans_list[lTranCnt]->qual[1]->package_type_id =
                  dds_temp->base_pkg_type_id
            endif

            set trans_request->trans_list[lTranCnt]->qual[1]->item_id =
                dds_temp->item_master_id    
              
            if (nInvGroup = 1 and dGrpItemID > 0 and dGrpBasePkgID > 0)
               set trans_request->trans_list[lTranCnt]->qual[1]->item_id         = dGrpItemID
               set trans_request->trans_list[lTranCnt]->qual[1]->package_type_id = dGrpBasePkgID
            endif
          else
            set lAdjCnt = lAdjCnt + 1
            set dStat = alterlist(aga_request->inv_list,lAdjCnt)
                  
            set dStat = alterlist(aga_request->inv_list[lAdjCnt]->qual,1)
                  
            set aga_request->inv_list[lAdjCnt]->qual[1]->qty = dds_temp->inv_qty
                            
            if (nInvTrackLevel = nINV_DRUG_FORM)
              set aga_request->inv_list[lAdjCnt]->qual[1]->package_type_id =
                  dds_temp->prod_base_pkg_type_id
            else
              set aga_request->inv_list[lAdjCnt]->qual[1]->package_type_id =
                  dds_temp->base_pkg_type_id
            endif
 
            set aga_request->inv_list[lAdjCnt]->qual[1]->item_id =
                dds_temp->item_master_id
                            
            set aga_request->inv_list[lAdjCnt]->qual[1]->location_cd =
                dds_temp->inv_list[x]->inv_location_cd
                  
            case (dds_temp->pckt_cd)
              of "L":
                execute oencpm_msglog("Group Adjust Load")
                set aga_request->inv_list[lAdjCnt]->qual[1]->increase_ind = 1
                set aga_request->inv_list[lAdjCnt]->qual[1]->reason_cd = cPCKT_LOAD     

              of "U":
                execute oencpm_msglog("Group Adjust Unload")
                set aga_request->inv_list[lAdjCnt]->qual[1]->increase_ind = 0
                set aga_request->inv_list[lAdjCnt]->qual[1]->reason_cd = cPCKT_UNLOAD
            endcase
                   
          endif
        endfor
          
        if (size(trans_request->trans_list,5) > 0)
          free set reply
          execute oencpm_msglog("Calling mm_add_device_transfer")
          execute mm_add_device_transfer with replace ("REQUEST", "TRANS_REQUEST")
          execute oencpm_msglog("Back from mm_add_device_transfer")
        endif
        
        if (size(aga_request->inv_list,5) > 0)
          free set reply
          execute oencpm_msglog("Calling mm_add_group_adjust")
          execute mm_add_group_adjust with replace ("REQUEST", "AGA_REQUEST")
          execute oencpm_msglog("Back from mm_add_group_adjust")
        endif
        
        free set trans_request
        free set aga_request
      endif  
    endif
for ( xyzx = 1 to size(loc_cd->qual,5))
if(validate(loc_request,0))
free record loc_request
endif
if(validate(data,0))
free record data
endif
if(validate(request_oi,0))
free record request_oi
endif

    free set request
    record request
    (
    1 item_id = f8
    1 add_qual[*]
    2 location_cd = f8
    1 del_qual[*]
    2 location_cd = f8
    )


    case (dds_temp->pckt_cd)
      of "L":
        if (dds_temp->total = dds_temp->amount)
          free set store_request
          record store_request
          (
           1 definition[*]
           2 item_id       =f8
           2 location_cd   =f8
          )
         set stat = alterlist(store_request->definition,1)
         set store_request->definition->item_id = dds_temp->meddef_item_id
         set store_request->definition->location_cd = loc_cd->qual[xyzx]->value
         set stat = alterlist(request->add_qual,1)
         set request->item_id = dds_temp->meddef_item_id
         set request->add_qual->location_cd = loc_cd->qual[xyzx]->value
         free set store_reply
         execute oencpm_msglog("Calling mm_get_stored_at L")
         free SET  GEN_NBR_ERROR
         free SET  INSERT_ERROR
         free set  UPDATE_ERROR
         free set  REPLACE_ERROR
         free set  DELETE_ERROR
         free set  UNDELETE_ERROR
         free set  REMOVE_ERROR
         free set  ATTRIBUTE_ERROR
         free set  LOCK_ERROR
         free set  NONE_FOUND
         free set  SELECT_ERROR
         free set  UPDT_CNT_ERROR
         free set  OBJ_ID_INDEX_ERROR
         free set  FAILED
         free set  MM_TABLE_NAME
         set trace recpersist
         execute mm_get_stored_at
         set trace norecpersist
         execute oencpm_msglog(build("mm_get_stored_at=",store_reply->status_data->status,char(0)))
         if ((store_reply->status_data->status = "S") or (store_reply->status_data->status = "F"))
          execute oencpm_msglog("Medication already stored at this location")
          set oenstatus->status = 1
        elseif (store_reply->status_data->status = "Z")
            free set request
            record request
            (
            1 item_id = f8
            1 pharm_type_cd = f8
            1 add_qual[*]
            2 location_cd = f8
            1 del_qual[*]
            2 location_cd = f8
            )
            execute oencpm_msglog("Total = Amount, send update")
            free set reply
            free set req_hold
            set request->item_id = dds_temp->meddef_item_id
            set request->add_qual->location_cd = loc_cd->qual[xyzx]->value
            execute oencpm_msglog("Calling mm_upd_chk_loc_relations")
            free set mod_item
            free set idx
            free set add_locs
            free set del_locs
            free set code_value_2
            free set count1
            free set qoh_code
            free set del_item_ctrl
            free set code_value
            free set code_value1
            free set new_item
            free set st_code
            free set total_cnt
            free set i
            free set  GEN_NBR_ERROR
            free set  INSERT_ERROR
            free set  UPDATE_ERROR
            free set  REPLACE_ERROR
            free set  DELETE_ERROR
            free set  UNDELETE_ERROR
            free set  REMOVE_ERROR
            free set  ATTRIBUTE_ERROR
            free set  LOCK_ERROR
            free set  NONE_FOUND
            free set  SELECT_ERROR
            free set  UPDT_CNT_ERROR
            free set  OBJ_ID_INDEX_ERROR
            free set  FAILED
            free set  MM_TABLE_NAME
            free set  DEL_ITEM
            set trace recpersist
            execute mm_upd_chk_loc_relations
            set trace norecpersist
            execute oencpm_msglog(build("mm_upd_chk=",reply->status_data->status,char(0)))
            if (reply->status_data->status != "S")
              set oenstatus->status = 0
              set oenstatus->status_detail = 4
              execute oencpm_msglog(build("mm_upd_chk_loc_relations failed with status:",reply->status_data->status,char(0)))
              execute oencpm_msglog(build("Operation:",reply->status_data->subeventstatus->operationname,char(0)))
              execute oencpm_msglog(build("Operation Status:",reply->status_data->subeventstatus->operationstatus,char(0)))
              execute 
               oencpm_msglog( build("TargetObjectName:",REPLY->STATUS_DATA->SUBEVENTSTATUS[1]->TARGETOBJECTNAME ,char(0)))
              execute 
               oencpm_msglog( build("TargetObjectValue:", REPLY->STATUS_DATA->SUBEVENTSTATUS[1]->TARGETOBJECTVALUE ,char(0)))
            else
              execute oencpm_msglog("Load Succeeded")
              set oenstatus->status = 1
              commit
            endif            
        else
          execute oencpm_msglog(build("mm_get_stored_at Status=",store_reply->status_data->status,char(0)))
          execute oencpm_msglog(build("Operation:",reply->status_data->subeventstatus->operationname,char(0)))
          execute oencpm_msglog(build("Operation Status:",reply->status_data->subeventstatus->operationstatus,char(0)))
          execute 
           oencpm_msglog( build("TargetObjectName:",REPLY->STATUS_DATA->SUBEVENTSTATUS[1]->TARGETOBJECTNAME ,char(0)))
          execute 
           oencpm_msglog( build("TargetObjectValue:", REPLY->STATUS_DATA->SUBEVENTSTATUS[1]->TARGETOBJECTVALUE ,char(0)))
          set oenstatus->status = 0
          set oenstatus->status_detail = 4
        endif
    else
      execute oencpm_msglog("EPL Total != amount, ignoring this message")
      set oenstatus->status = 1
      endif

      of "U":
    if (dds_temp->total > 0)
      execute oencpm_msglog("EPU Total > 0, ignoring this message")
      set oenstatus->status = 1
    else
      free set store_request
      record store_request
      (
       1 definition[*]
        2 item_id       =f8
        2 location_cd   =f8
      )
      set stat = alterlist(store_request->definition,1)
      set store_request->definition->item_id = dds_temp->meddef_item_id
      set store_request->definition->location_cd = loc_cd->qual[xyzx]->value
      set stat = alterlist(request->del_qual,1)
      set request->item_id = dds_temp->meddef_item_id
      set request->del_qual->location_cd = loc_cd->qual[xyzx]->value
      execute oencpm_msglog(build("med_id=",request->item_id,char(0)))
      execute oencpm_msglog(build("loc_cd=",request->del_qual->location_cd,char(0)))
      free set store_reply
      execute oencpm_msglog("Calling mm_get_stored_at U")
      free SET  GEN_NBR_ERROR
      free SET  INSERT_ERROR
      free set  UPDATE_ERROR
      free set  REPLACE_ERROR
      free set  DELETE_ERROR
      free set  UNDELETE_ERROR
      free set  REMOVE_ERROR
      free set  ATTRIBUTE_ERROR
      free set  LOCK_ERROR
      free set  NONE_FOUND
      free set  SELECT_ERROR
      free set  UPDT_CNT_ERROR
      free set  OBJ_ID_INDEX_ERROR
      free set  FAILED
      free set  MM_TABLE_NAME
      set trace recpersist
      execute mm_get_stored_at
      set trace norecpersist
      execute oencpm_msglog(build("mm_get_stored_at=",store_reply->status_data->status,char(0)))
      if ((store_reply->status_data->status = "F") or (store_reply->status_data->status = "Z"))
        execute oencpm_msglog("Medication not stored at this location, unload ignored")
        set oenstatus->status = 1
      elseif (store_reply->status_data->status = "S")
 
         execute oencpm_msglog("Total <= 0, send update")
         free set request
         record request
         (
         1 item_id = f8
         1 pharm_type_cd = f8
         1 add_qual[*]
         2 location_cd = f8
         1 del_qual[*]
         2 location_cd = f8
         )
         free set reply
         free set req_hold
         set stat = alterlist(request->del_qual,1)
         set request->item_id = dds_temp->meddef_item_id
         set request->del_qual->location_cd = loc_cd->qual[xyzx]->value
         execute oencpm_msglog(build("med_id=",request->item_id,char(0))) 
         execute oencpm_msglog(build("loc_cd=",request->del_qual->location_cd,char(0))) 
         execute oencpm_msglog("Calling mm_upd_chk_loc_relations")
         free set mod_item
         free set idx
         free set add_locs
         free set del_locs
         free set code_value_2
         free set count1
            free set qoh_code
            free set del_item_ctrl
            free set code_value
            free set code_value1
         free set new_item
         free set st_code
         free set total_cnt
         free set  i
         free set  GEN_NBR_ERROR
         free set  INSERT_ERROR
         free set  UPDATE_ERROR
         free set  REPLACE_ERROR
         free set  DELETE_ERROR
         free set  UNDELETE_ERROR
         free set  REMOVE_ERROR
         free set  ATTRIBUTE_ERROR
         free set  LOCK_ERROR
         free set  NONE_FOUND
         free set  SELECT_ERROR
         free set  UPDT_CNT_ERROR
         free set  OBJ_ID_INDEX_ERROR
         free set  FAILED
         free set  MM_TABLE_NAME
         free set  DEL_ITEM
         set trace recpersist
         execute mm_upd_chk_loc_relations
         set trace norecpersist
         execute oencpm_msglog(build("mm_upd_chk=",reply->status_data->status,char(0)))
         if ((reply->status_data->status != "S") and (reply->status_data->status != "Z"))
           set oenstatus->status = 0
           set oenstatus->status_detail = 4
           execute
            oencpm_msglog(build("mm_upd_chk_loc_relations failed with status:",reply->status_data->status,char(0)))
           execute oencpm_msglog(build("Operation:",reply->status_data->subeventstatus->operationname,char(0)))
           execute oencpm_msglog(build("Operation Status:",reply->status_data->subeventstatus->operationstatus,char(0)))
           execute 
            oencpm_msglog(build("TargetObjectName:",REPLY->STATUS_DATA->SUBEVENTSTATUS[ 1 ]->TARGETOBJECTNAME,char(0)))
           execute 
            oencpm_msglog(build("TargetObjectValue:",REPLY->STATUS_DATA->SUBEVENTSTATUS[1]->TARGETOBJECTVALUE,char(0)))

         else
           execute oencpm_msglog("Unload Succeeded")
           set oenstatus->status = 1
           commit
         endif

       else
        execute oencpm_msglog(build("mm_get_stored_at Status=",store_reply->status_data->status,char(0)))
        execute oencpm_msglog(build("Operation:",reply->status_data->subeventstatus->operationname,char(0)))
        execute oencpm_msglog(build("Operation Status:",reply->status_data->subeventstatus->operationstatus,char(0)))
        execute 
         oencpm_msglog( build("TargetObjectName:",REPLY->STATUS_DATA->SUBEVENTSTATUS[1]->TARGETOBJECTNAME ,char(0)))
        execute 
         oencpm_msglog( build("TargetObjectValue:", REPLY->STATUS_DATA->SUBEVENTSTATUS[1]->TARGETOBJECTVALUE ,char(0)))
        set oenstatus->status = 0
        set oenstatus->status_detail = 4
       endif
    endif

  of "C":
    execute oencpm_msglog ("EPC ignored")
    set oenstatus->status = 1
  else
    execute oencpm_msglog(build("pckt_cd was not L,C or U, pckt_cd=",dds_temp->pckt_cd,char(0)))
    set oenstatus->status = 1
  endcase
 endfor

endif

endif
#exit_script

set last_mod = "000 - Baseline"

commit