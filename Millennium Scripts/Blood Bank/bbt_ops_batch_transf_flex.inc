 ;;Solution_Test/script/PathNet -- BB Transfusion/BBT_OPERATIONS/bbt_ops_batch_transf_flex.inc Turn on black mode

/*~BE~************************************************************************
      *                   PathNet Blood Bank Transfusion                     *
      *                           V500 Script                                *
      *                     bbt_ops_batch_transf_flex.inc                    *
      *                                                                      *
      * PURPOSE:          This include file will be used to hold a copy of   *
      *                   the request/reply for req225080.csa to execute it  *
      *                   from other scripts.                                *
      *                                                                      *
      * DEPENDENCY:       Needs glb_script_logging.inc                       *
	  * SPECIAL NOTE:  This include file is also used by     				 *
	  * the bbt_chg_event_transfusion script which is located in the 		 *
	  * \SCRIPT\BBT_FinalDisposition Project								 *
      ************************************************************************/
;~DB~ ************************************************************************
;     *                      GENERATED MODIFICATION CONTROL LOG              *
;     ************************************************************************
;     *                                                                      *
;     *Mod Date     Engineer             Comment                             *
;     *--- -------- -------------------- ----------------------------------- *
;     *001 10/16/06 Christi Ditmars      Initial release                     *
;     *002 04/24/11 Amy Gum             Update FlexProdTransfused function              *
;~DE~ ************************************************************************
 
/**************************************************************
; INCLUDE FILES
**************************************************************/
%i cclsource:BBT_GetBBPreference.inc
%i cclsource:bbt_tag_print_ctrl_req.inc
%i cclsource:bbt_rpt_exception_req.inc
%i cclsource:bbt_upd_flex_expiration_req.inc
%i cclsource:mic_expand_subs.inc
%i cclsource:bbt_get_avail_flex_specs_req.inc
 
/**************************************************************
; DECLARED SUBROUTINES
**************************************************************/
 
declare FlexGet_Init(NULL) = NULL
declare FlexGet_AddPerson(person_id = f8 (value)) = NULL
declare FlexGet_Run(NULL) = i2 ;=1 for success
declare FlexProdTransfused(product_id = f8 (value)) = i2
declare FlexUpd_Run(NULL) = i2 ;=1 for success
 
; in bbt_upd_flex_expiration_req.inc: FlexUpd_PrintReports(NULL)
/**************************************************************
; DECLARED VARIABLES
**************************************************************/
declare flexGetPersonCnt = i4 with protect, noconstant(0)
 
/**************************************************************
; DEFINED SUBROUTINES
**************************************************************/
 
subroutine FlexGet_Init(NULL)
;*************** FUNCTION DETAILS ***************
   ; Start get_avail_flex_spec request structure. People must be added using FlexGet_AddPerson.
;*************** LOCAL VARIABLES ****************
   declare lStat =                i4 with protect,noconstant(0)
;***************** INSTRUCTIONS *****************
   set lStat = initrec(getFlexRequest)
   set lStat = initrec(getFlexReply)
   set lStat = initrec(FlexUpdRequest)
   set lStat = initrec(FlexUpdReply)
   set flexGetPersonCnt = 0
   set getFlexRequest->alert_ind = "N"
end
 
subroutine FlexGet_AddPerson(person_id)
;*************** FUNCTION DETAILS ***************
   ; Add a person to the get request structure if they aren't already there.
   ; Initialize the record using FlexGet_Init
   ; InitExceptionsRequest.
;*************** LOCAL VARIABLES ****************
   declare lStat             =i4 with protect,noconstant(0)
   declare lPersonIdx         =i4 with protect,noconstant(0)
   declare lPersonNum         =i4 with protect,noconstant(0)
;***************** INSTRUCTIONS *****************
 
    set lPersonIdx = locateval(lPersonNum,1,flexGetPersonCnt,
							  person_id, getFlexRequest->personlist[lPersonNum].person_id)
    if (lPersonIdx = 0)
        set flexGetPersonCnt = flexGetPersonCnt + 1
        if (flexGetPersonCnt > size(getFlexRequest->personlist, 5))
            set lStat = alterlist(getFlexRequest->personlist,flexGetPersonCnt+19)
        endif
        set getFlexRequest->personlist[flexGetPersonCnt].person_id = person_id
   endif
end
 
subroutine FlexGet_Run(NULL)
;*************** FUNCTION DETAILS ***************
   ; Run bbt_get_avail_flex_specs
;*************** LOCAL VARIABLES ****************
   declare lStat             =i4 with protect,noconstant(0)
   declare nFlexGetOk        =i2 with protect,noconstant(0)
;***************** INSTRUCTIONS *****************
    ;force reload of transfusion data
    
    if (flexGetPersonCnt = 0)
        set nFlexGetOk = 1
        call LOG_MESSAGE("No persons to get", LOG_LEVEL_DEBUG)
    else
        set lStat = alterlist(getFlexRequest->personlist,flexGetPersonCnt)
        call LOG_MESSAGE("Calling bbt_get_avail_flex_specs", LOG_LEVEL_DEBUG)
    	execute bbt_get_avail_flex_specs with replace("REQUEST","GETFLEXREQUEST"),replace("REPLY","GETFLEXREPLY")
    	set modify nopredeclare
    	if (getFlexReply->status_data.status = "F")
            call POPULATE_SUBEVENTSTATUS_MSG(LOG_PROGRAM_NAME,
                                        "F",
                                        "Script Call",
                                        "bbt_get_avail_flex_specs failed",
                                        LOG_LEVEL_AUDIT)
        elseif (getFlexReply->status_data.status = "Z")
            call LOG_MESSAGE("No current specimens", LOG_LEVEL_DEBUG)
            set nFlexGetOk = 1
        else
            set nFlexGetOk = 1
        endif
    endif
    return(nFlexGetOk)
end
 
subroutine FlexProdTransfused(product_id)
;*************** FUNCTION DETAILS *******************
   ; Look for xm product in list of prods transfused
;*************** LOCAL VARIABLES ********************
   declare lProdIdx           =i4 with protect,noconstant(0)
   declare lProdNum           =i4 with protect,noconstant(0)
;***************** INSTRUCTIONS *****************
 	if(validate(ops_request))
	    set lProdIdx = locateval(lProdNum,1,size(ops_request->productlist,5),
								  product_id, ops_request->productlist[lProdNum].product_id)
	    if (lProdIdx = 0)
	        return (0)
	    else
	        if (ops_request->productlist[lProdIdx]->status = "S")
	            return(1)
	        else
	            return(0)
	        endif
	    endif
	 else
	 	;Executing from Transfusion Script
		;See Special Note in header Above
	 	if(validate(reply->results))
			set lProdIdx = locateval(lProdNum,1,size(reply->results,5),
									  product_id, reply->results[lProdNum].product_id)
		    if (lProdIdx = 0)
		        return (0)
		    else
		        if (reply->results[lProdIdx]->status = "S")
		            return(1)
		        else
		            return(0)
		        endif
		    endif
		else
	 		return (0)
	 	endif
    endif
end
 
subroutine FlexUpd_Run(NULL)
;*************** FUNCTION DETAILS ***************
   ; Load Request to bbt_upd_flex_expiration
;*************** LOCAL VARIABLES ****************
   declare lStat                = i4 with protect,noconstant(0)
   declare SYS_TRANS_MEAN       = c12  with protect, constant("SYS_TRANS")
   declare OVRD_REASON_CS       = i4 with protect, constant(1621)
   declare sys_trans_ovrd_cd    = f8 with protect, noconstant(0.0)
   declare UpdPersonInd         = i2 with protect,noconstant(0)
   declare lAvailPersonCnt      = i4 with protect,noconstant(0)
   declare lAvailPersonIdx      = i4 with protect,noconstant(0)
   declare lAvailSpecCnt        = i4 with protect,noconstant(0)
   declare lAvailSpecIdx        = i4 with protect,noconstant(0)
   declare lAvailOrderCnt       = i4 with protect,noconstant(0)
   declare lAvailOrderIdx       = i4 with protect,noconstant(0)
   declare lAvailProdCnt        = i4 with protect,noconstant(0)
   declare lAvailProdIdx        = i4 with protect,noconstant(0)
 
   declare lUpdSpecCnt          = i4 with protect,noconstant(0)
   declare lUpdProdCnt          = i4 with protect,noconstant(0)
 
   declare nFlexRunOk          =i2 with protect,noconstant(0)
;***************** INSTRUCTIONS *****************
    ;reset flex_patient_out so will reload new transfusions

    set lAvailPersonCnt = size(getFlexReply->personlist, 5)
    if (lAvailPersonCnt = 0)
        ;no specs to update
        set nFlexRunOk = 1
    else
    	if (validate(flex_patient_out->person_id, 0.0) > 0.0)
        	set lstat = initrec(flex_patient_out)
        endif  
        set sys_trans_ovrd_cd = uar_get_code_by("MEANING", OVRD_REASON_CS, nullterm(SYS_TRANS_MEAN))
        if (sys_trans_ovrd_cd = 0.0)
	       set uar_error = "Failed to retrieve sys_trans override reason"
	       call POPULATE_SUBEVENTSTATUS_MSG(LOG_PROGRAM_NAME,
                                    "F",
                                    "uar_failed",
                                    uar_error,
                                    LOG_LEVEL_AUDIT)
        else
            set FlexUpdRequest->override_reason_cd  =  sys_trans_ovrd_cd
            set FlexUpdRequest->override_reason_mean = SYS_TRANS_MEAN
            set FlexUpdRequest->lock_prods_ind = 0
 
            set CURALIAS = AvailSpec getFlexReply->personlist[lAvailPersonIdx]->specimen[lAvailSpecIdx]
            set CURALIAS = AvailProd getFlexReply->personlist[lAvailPersonIdx]->specimen[lAvailSpecIdx]->
                                           orders[lAvailOrderIdx]->products[lAvailProdIdx]
            set CURALIAS = UpdSpec FlexUpdRequest->persons[lAvailPersonIdx]->specimens[lUpdSpecCnt]
            set CURALIAS = UpdProd FlexUpdRequest->persons[lAvailPersonIdx]->specimens[lUpdSpecCnt]
                                ->orders[lAvailOrderIdx]->products[lUpdProdCnt]
 
            ;Update all specimens with flex on
            set lStat = alterlist(FlexUpdRequest->persons, lAvailPersonCnt)
            for (lAvailPersonIdx = 1 to lAvailPersonCnt)
 
                set FlexUpdRequest->persons[lAvailPersonIdx].person_id = getFlexReply->personlist[lAvailPersonIdx].person_id
 
                set lUpdSpecCnt = 0
                set lAvailSpecCnt = size(getFlexReply->personlist[lAvailPersonIdx].specimen, 5)
                for (lAvailSpecIdx = 1 to lAvailSpecCnt)
 
                    ;If Flex is on, add spec to upd script
                    if (AvailSpec->flex_on_ind = 1)
                        ;at least one person to update
                        set UpdPersonInd = 1                       
                        set lUpdSpecCnt = lUpdSpecCnt + 1
                        ;Not likely to have more than one available spec per person so size as we go
                        set lStat = alterlist(FlexUpdRequest->persons[lAvailPersonIdx]->specimens, lUpdSpecCnt)
 
                        set UpdSpec->accession = AvailSpec->accession
                        set UpdSpec->specimen_id = AvailSpec->specimen_id
                        set UpdSpec->facility_cd = AvailSpec->encntr_facility_cd
                        set UpdSpec->encntr_id = AvailSpec->encntr_id
                        set UpdSpec->testing_facility_cd = AvailSpec->testing_facility_cd
                        set UpdSpec->override_id = AvailSpec->override_id
                        set UpdSpec->override_mean = AvailSpec->override_mean
                        set UpdSpec->drawn_dt_tm = AvailSpec->drawn_dt_tm
                        set UpdSpec->old_expire_dt_tm = AvailSpec->expire_dt_tm
 
                        ;If a spec qualifies, get all the orders
                        set lAvailOrderCnt = size(getFlexReply->personlist[lAvailPersonIdx]
                                                    ->specimen[lAvailSpecIdx].orders, 5)
                        set lStat =  alterlist(FlexUpdRequest->persons[lAvailPersonIdx]
                                                    ->specimens[lUpdSpecCnt]->orders, lAvailOrderCnt)
                        for ( lAvailOrderIdx = 1 to lAvailOrderCnt)
                            set UpdSpec->orders[lAvailOrderIdx].order_id = AvailSpec->orders[lAvailOrderIdx].order_id
 
                            set lUpdProdCnt = 0
                            set lAvailProdCnt = size(getFlexReply->personlist[lAvailPersonIdx]->specimen[lAvailSpecIdx]
                                    ->orders[lAvailOrderIdx].products, 5)
 
                            for (lAvailProdIdx =1 to lAvailProdCnt)
                                ;Don't process products we are transfusing, as their XMs will be released by transfuse ops job
                                if (FlexProdTransfused(AvailProd->product_id) = 0)
                                    set lUpdProdCnt = lUpdProdCnt + 1
                                    set lStat = alterlist(FlexUpdRequest->persons[lAvailPersonIdx]->specimens[lUpdSpecCnt]
                                                ->orders[lAvailOrderIdx]->products, lUpdProdCnt+9)
 
                                    set UpdProd->product_id = AvailProd->product_id
                                    set UpdProd->product_event_id = AvailProd->product_event_id
                                    set UpdProd->product_type_cd = AvailProd->product_type_cd
                                    set UpdProd->old_xm_expire_dt_tm = AvailProd->crossmatch_expire_dt_tm
                                endif
                            endfor
                            ;resize to actual size
                            set lStat = alterlist(FlexUpdRequest->persons[lAvailPersonIdx]->specimens[lUpdSpecCnt]
                                        ->orders[lAvailOrderIdx]->products, lUpdProdCnt)
                        endfor
                    endif
                endfor
            endfor
 
            set CURALIAS AvailSpec OFF
            set CURALIAS AvailProd OFFn ;;Solution_Test/script/PathNet -- BB Transfusion/Bbt_Reportselection/BBT_OPS_OWNINVLOC.INC Turn on black mode

/* 
** Author: Badari Nath Kopparapu
** Date: 08/25/99
This .inc file assumes that the name of the script is stored in a variable named "scipt_name". 
Further, this .inc file only processes the Owner, Inventory and Location code values from the 
request->batch_selection field after trimming it. viz., OWN[ ], INV[ ] and LOC[ ] respectively.
If they are incompletely or incorrectly specified such as OWN] [ or OWN[, the program is failed. 
Essentially, only a strong syntax is entertained. Weak syntax is failed!! Each program that 
includes this file should also have an EXIT_SCRIPT block in it.
*/   
  ;find owner area code value
  set temp_string = cnvtupper(trim(request->batch_selection))
  set temp_pos = 0
  set temp_pos = cnvtint(value(findstring("OWN[",temp_string)))
  if (temp_pos > 0) 
      set own_string = substring(temp_pos + 4, size(temp_string), temp_string)
      set own_pos = cnvtint(value(findstring("]", own_string)))
      if (own_pos > 0)
          set own_area = substring(1, own_pos - 1, own_string)
          if (trim(own_area) > " ")
              set request->cur_owner_area_cd = cnvtreal(own_area)
          else
              ;fail script
              set reply->status_data->status = "F"
              set reply->status_data->subeventstatus[1].TargetObjectName = "parse owner area code value"
          endif
      else
          ;fail script
          set reply->status_data->status = "F"
          set reply->status_data->subeventstatus[1].TargetObjectName = "parse owner area code value"
      endif
  else
      set request->cur_owner_area_cd = 0.0
  endif

  ;find inventory area code value
  if (reply->status_data->status != "F")
    set temp_pos = 0
    set temp_pos = cnvtint(value(findstring("INV[",temp_string)))
    if (temp_pos > 0) 
        set inv_string = substring(temp_pos + 4, size(temp_string), temp_string)
        set inv_pos = cnvtint(value(findstring("]", inv_string)))
        if (inv_pos > 0)
            set inv_area = substring(1, inv_pos - 1, inv_string)
            if (trim(inv_area) > " ")
                set request->cur_inv_area_cd = cnvtreal(inv_area)
            else
                ;fail script
                set reply->status_data->status = "F"
                set reply->status_data->subeventstatus[1].TargetObjectName = "parse inventory area code value"
            endif
        else
            ;fail script
            set reply->status_data->status = "F"
            set reply->status_data->subeventstatus[1].TargetObjectName = "parse inventory area code value"
        endif
    else
        set request->cur_inv_area_cd = 0.0
    endif

    ;find address location code value
    if (reply->status_data->status != "F")
        set temp_pos = 0
        set temp_pos = cnvtint(value(findstring("LOC[",temp_string)))
        if (temp_pos > 0) 
          set loc_string = substring(temp_pos + 4, size(temp_string), temp_string)
          set loc_pos = cnvtint(value(findstring("]", loc_string)))
          if (loc_pos > 0)
            set location_cd = substring(1, loc_pos - 1, loc_string)
            if (trim(location_cd) > " ")
                set request->address_location_cd = cnvtreal(location_cd )
            else
                ;fail script
                set reply->status_data->status = "F"
                set reply->status_data->subeventstatus[1].TargetObjectName = "parse location code value"
            endif
          else
            ;fail script
            set reply->status_data->status = "F"
            set reply->status_data->subeventstatus[1].TargetObjectName = "parse location code value"
          endif
        else
          set request->address_location_cd = 0.0
        endif
    endif
  endif

if (reply->status_data->status = "F")
    set reply->status_data->subeventstatus[1].OperationName = script_name
    set reply->status_data->subeventstatus[1].OperationStatus = "F"
    set reply->status_data->subeventstatus[1].TargetObjectValue = "no code value in string"
    go to EXIT_SCRIPT
endif

;Generated by GNU enscript 1.6.4.

            set CURALIAS UpdSpec OFF
            set CURALIAS UpdProd OFF
            
            if (UpdPersonInd = 0)
                set nFlexRunOk = 1
            else
                execute bbt_upd_flex_expiration with replace("REQUEST","FLEXUPDREQUEST"),replace("REPLY","FLEXUPDREPLY")
        	    if (trim(FlexUpdReply->status_data.status) = "S")
            	    set nFlexRunOk = 1
            	else
                    call POPULATE_SUBEVENTSTATUS_MSG(LOG_PROGRAM_NAME,
                                            "F",
                                            "Script Call",
                                            "bbt_upd_flex_expiration failed",
                                            LOG_LEVEL_AUDIT)
                endif
            endif
        endif
    endif
 
    return(nFlexRunOk)
end

;Generated by GNU enscript 1.6.4.
