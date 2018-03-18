 ;;Solution_Test/script/PathNet -- Gen Lab/glb_worklist_status/glb_worklist_status.inc Turn on black mode

/*~BB~************************************************************************
      *                                                                      *
      *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
      *                              Technology, Inc.                        *
      *       Revision      (c) 1984-2000 Cerner Corporation                 *
      *                                                                      *
      *  Cerner (R) Proprietary Rights Notice:  All rights reserved.         *
      *  This material contains the valuable properties and trade secrets of *
      *  Cerner Corporation of Kansas City, Missouri, United States of       *
      *  America (Cerner), embodying substantial creative efforts and        *
      *  confidential information, ideas and expressions, no part of which   *
      *  may be reproduced or transmitted in any form or by any means, or    *
      *  retained in any storage or retrieval system without the express     *
      *  written permission of Cerner.                                       *
      *                                                                      *
      *  Cerner is a registered mark of Cerner Corporation.                  *
      *                                                                      *
  ~BE~***********************************************************************/
/*****************************************************************************
        Source file name:       glb_worklist_status.inc
 
        Product:                General Lab
        Product Team:           GLB
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        Subroutines to deal with worklist statuses
 
        Special notes:          This include file has a dependency on
                                cclsource:glb_script_logging.inc and
                                the definitions and populations of the
                                worklists_to_check and CD structures
 
******************************************************************************/
;~DB~************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *                                                                      *
;    *Mod Date     Engineer             Comment                             *
;    *--- -------- -------------------- ----------------------------------- *
;    *000 08/19/10 Ryan Manuel        	Initial Release                     *
;    *001 09/16/10 Ryan Manuel          Changes to support scenarios that   *
;                                       arise when deleting accesssions off *
;                                       of an automatic worklist            *
;~DE~************************************************************************
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************

declare CheckWorklists() = i2 with protect
subroutine CheckWorklists(NULL)
  declare nIN_PROCESS_EVENT_TYPE_FLAG = i2 with protect, constant(5)
  declare nSYSTEM_COMPLETE_EVENT_TYPE_FLAG = i2 with protect, constant(6)
  declare lWorklistCnt = i4 with protect, noconstant(size(worklists_to_check->worklists, 5))
  declare lCurrWorklistIdx = i4 with protect, noconstant(0)
  declare lStart = i4 with protect, noconstant(0)
  declare lIndex = i4 with protect, noconstant(0)
  declare lLoopCnt = i4 with protect, noconstant(0)
  declare lResultCnt = i4 with protect, noconstant(0)
  declare nEventExistsInd = i2 with protect, noconstant(0)
  declare nBATCH_SIZE = i2 with protect, constant(20)
  
  if (lWorklistCnt = 0)
    return (1)
  endif
  
  set lLoopCnt = ceil(cnvtreal(lWorklistCnt) / nBATCH_SIZE)
  set lStart = 1
  select into "nl:"
  from (dummyt d1 with seq = value(lLoopCnt)),
       perform_result pr,
       result r
  plan d1 where initarray(lStart, evaluate(d1.seq, 1, 1, lStart + nBATCH_SIZE))
  join pr where expand(lIndex, lStart, minval(lWorklistCnt, lStart + (nBATCH_SIZE-1)),
                       pr.worklist_id, worklists_to_check->worklists[lIndex].worklist_id)
  join r  where r.result_id = pr.result_id
  order by pr.worklist_id, r.result_id
  head pr.worklist_id
    nAtLeastOnePerformedInd = 0
    lCurrStart = (d1.seq - 1) * nBATCH_SIZE
    lWorklistIndex = locateval(lIndex, lCurrStart, lCurrStart + (nBATCH_SIZE-1),
                               pr.worklist_id, worklists_to_check->worklists[lIndex].worklist_id)
    
    if (not (worklists_to_check->worklists[lWorklistIndex].worklist_current_status_cd in (CD->worklist_building_status_cd,
                                                                                          CD->worklist_paused_status_cd)))
      worklists_to_check->worklists[lWorklistIndex].worklist_new_status_cd = 
                                                    worklists_to_check->worklists[lWorklistIndex].worklist_current_status_cd
    endif
  head r.result_id
    if (r.result_status_cd != CD->perform_status_cd and
        r.result_status_cd != CD->in_review_status_cd)
      if (not (worklists_to_check->worklists[lWorklistIndex].worklist_current_status_cd in (CD->worklist_building_status_cd,
                                                                                            CD->worklist_paused_status_cd)))
        worklists_to_check->worklists[lWorklistIndex].worklist_new_status_cd = CD->worklist_in_process_status_cd
      endif
      worklists_to_check->worklists[lWorklistIndex].worklist_event_type_flag = nIN_PROCESS_EVENT_TYPE_FLAG
    else
      nAtLeastOnePerformedInd = 1
    endif
  detail
    row + 0
  foot r.result_id
    row + 0
  foot pr.worklist_id
    if (nAtLeastOnePerformedInd = 0)
      if (not (worklists_to_check->worklists[lWorklistIndex].worklist_current_status_cd in (CD->worklist_building_status_cd,
                                                                                            CD->worklist_paused_status_cd)))
        worklists_to_check->worklists[lWorklistIndex].worklist_event_type_flag = nSYSTEM_COMPLETE_EVENT_TYPE_FLAG
        worklists_to_check->worklists[lWorklistIndex].worklist_new_status_cd = CD->worklist_complete_status_cd
      endif
    endif
  with nocounter
  
  for (lCurrWorklistIdx = 1 to lWorklistCnt)  
    if (worklists_to_check->worklists[lCurrWorklistIdx].worklist_current_status_cd != 
        worklists_to_check->worklists[lCurrWorklistIdx].worklist_new_status_cd and
        worklists_to_check->worklists[lCurrWorklistIdx].worklist_event_type_flag != 0)
      select into "nl:"
      from worklist w
      plan w where w.worklist_id = worklists_to_check->worklists[lCurrWorklistIdx].worklist_id 
      with forupdatewait(w), time = 15  
          
      if (error_message(0) > 0)
        call log_message("Error - Failed to select for update on the worklist table", log_level_audit)
        return (0)
      endif
       
      update into worklist w
      set w.status_cd = worklists_to_check->worklists[lCurrWorklistIdx].worklist_new_status_cd,
          w.updt_applctx = reqinfo->updt_applctx,
          w.updt_cnt = w.updt_cnt + 1,
          w.updt_dt_tm = cnvtdatetime(curdate, curtime3),
          w.updt_id = reqinfo->updt_id,
          w.updt_task = reqinfo->updt_task
      plan w where w.worklist_id = worklists_to_check->worklists[lCurrWorklistIdx].worklist_id
      
      if (error_message(0) > 0)
        call log_message("Error - Failed to update worklist status", log_level_audit)
        return (0)
      endif
    endif
    
    if (worklists_to_check->worklists[lCurrWorklistIdx].worklist_event_type_flag = nSYSTEM_COMPLETE_EVENT_TYPE_FLAG)
      set nEventExistsInd = 0
      
      select into "nl:"
      from worklist_event we
      where we.worklist_id = worklists_to_check->worklists[lCurrWorklistIdx].worklist_id
        and we.event_type_flag = 5
      detail
        nEventExistsInd = 1
      with nocounter
      
      if (nEventExistsInd = 0)
        insert into worklist_event we
        set we.worklist_event_id      = seq(pathnet_seq, nextval),
            we.worklist_id            = worklists_to_check->worklists[lCurrWorklistIdx].worklist_id,
            we.event_dt_tm            = cnvtdatetime(curdate, curtime3),
            we.event_prsnl_id         = 0.0,
            we.event_type_flag        = 5,
            we.updt_dt_tm             = cnvtdatetime(curdate, curtime3),
            we.updt_id                = reqinfo->updt_id,
            we.updt_task              = reqinfo->updt_task,
            we.updt_cnt               = 0,
            we.updt_applctx           = reqinfo->updt_applctx
        with nocounter
        
        if (error_message(0) > 0)
          call log_message("Error - Failed to insert worklist event", log_level_audit)
          return (0)
        endif
      endif
    endif
    
    if (worklists_to_check->worklists[lCurrWorklistIdx].worklist_event_type_flag in (nIN_PROCESS_EVENT_TYPE_FLAG, 
                                                                                     nSYSTEM_COMPLETE_EVENT_TYPE_FLAG))
      set nEventExistsInd = 0
      
      select into "nl:"
      from worklist_event we
      where we.worklist_id = worklists_to_check->worklists[lCurrWorklistIdx].worklist_id
        and we.event_type_flag = worklists_to_check->worklists[lCurrWorklistIdx].worklist_event_type_flag
      detail
        nEventExistsInd = 1
      with nocounter
      
      if (nEventExistsInd = 0)
        insert into worklist_event we
        set we.worklist_event_id      = seq(pathnet_seq, nextval),
            we.worklist_id            = worklists_to_check->worklists[lCurrWorklistIdx].worklist_id,
            ; Add a little bit of time to ensure that multiple events don't have the same event_dt_tm
            we.event_dt_tm            = cnvtdatetime(curdate, curtime3 + 100.0),
            we.event_prsnl_id         = 0.0,
            we.event_type_flag        = worklists_to_check->worklists[lCurrWorklistIdx].worklist_event_type_flag,
            we.updt_dt_tm             = cnvtdatetime(curdate, curtime3),
            we.updt_id                = reqinfo->updt_id,
            we.updt_task              = reqinfo->updt_task,
            we.updt_cnt               = 0,
            we.updt_applctx           = reqinfo->updt_applctx
        with nocounter
        
        if (error_message(0) > 0)
          call log_message("Error - Failed to insert worklist event", log_level_audit)
          return (0)
        endif
      endif
    endif
  endfor
  
  return (1)
end

;Generated by GNU enscript 1.6.4.
