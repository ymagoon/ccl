/*~BB~************************************************************************
  *                                                                      *
  *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
  *                              Technology, Inc.                        *
  *       Revision      (c) 1984-1997 Cerner Corporation                 *
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
 
        Source file name:eso_ce_custom_selection.prg
        Object name:     eso_ce_custom_selection
        Request #:       1210263
 
        Product:         System Integration
        Product Team:    System Integration
        HNA Version:     V500
        CCL Version:
        Program purpose: Suppress triggers
        Tables read:     eso_trigger,clinical event,person,encounter
        Tables updated:  None
        Executing from:  ESO Server
        Special Notes:   This script is separate from the eso_get_ce_selection,please check the configuration and setup details
                         at https://wiki.ucern.com/display/reference/Configure+ESO+CE+CustomSelection
                         before applying filtering from this script.
 
 
/************************************************************************************
;~DB~********************************************************************************
*                      GENERATED MODIFICATION CONTROL LOG                           *
*************************************************************************************
*                                                                                   *
* Mod   Date      Engineer              Comment                                     *
* ---   --------  --------------------  ------------------------------------------- *
* 000   09/15/14  MM020915			    Initial Creation                            *
* 001   09/23/16  MM020915			    Added more user information and removed     *
*                                       logic already in the eso_get_ce_selection   *
* 002   10/09/18  Magoon, Yitzhak		Suppress Dyndoc XR requests for Clinical	*
*										Events where the patient is not an 			*
*										Inpatient, Observation, Emergency, or 		*
*										Ambulatory									*
*                                                                                   *
*~DE~********************************************************************************
*~END~ ******************  END OF ALL MODCONTROL BLOCKS  ****************************/
 
drop   program eso_ce_custom_selection:dba go
create program eso_ce_custom_selection:dba
 
/********************************************************************************************
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 
SECTION 1.
 
THE FOLLOWING REQUEST RECORD SHOULD BE DEFINED IN TDB.  PERFORM A
"SHOW eso_ce_custom_selection" IN TDB TO VERFIY THIS REQUEST STRUCTURE IS IN SYNC
 
 
request
{
   trigger_info
      class                 [String: Variable]    **  CQM_FSIESO_QUE.class                         **
      stype                 [String: Variable]    **  CQM_FSIESO_QUE.type                          **
      subtype               [String: Variable]    **  CQM_FSIESO_QUE.subtype                       **
      subtype_detail        [String: Variable]    **  CQM_FSIESO_QUE.subtype_detail                **
      reference_nbr         [String: Variable]    **  CLINICAL_EVENT.reference_nbr                 **
      eso_trigger_desc      [String: Variable]    **  CQM_FSIESO_QUE.eso_trigger_desc              **
      eso_trigger_id        [Double]              **  CQM_FSIESO_QUE.eso_trigger_id                **
      interface_type_cd     [Double]              **  ESO_TRIGGER.interface_type_cd                **
      message_version_cd    [Double]              **  ESO_TRIGGER.message_version_cd               **
      message_format_cd     [Double]              **  ESO_TRIGGER.message_format_cd                **
      message_type_cd       [Double]              **  ESO_TRIGGERE.message_type_cd                 **
      message_trigger_cd    [Double]              **  ESO_TRIGGER.message_trigger_cd               **
      contributor_system_cd [Double]              **  CQM_FSIESO_QUE.contributor_system_cd         **
      script_routine_args   [List]                **  NOT USING FOR NOW                            **
         routine_arg        [String: Variable]
         script_name        [String: Variable]
         routine_name       [String: Variable]
   transaction_info
      person_id             [Double]              **  PERSON.person_id                             **
      enctr_id              [Double]              **  ENCOUNTER.enctr_id                           **
      event_id              [Double]              **  CLINICAL_EVENT.event_id                      **
      event_cd              [Double]              **  CLINICAL_EVENT.event_cd                      **
      result_status_cd      [Double]              **  CLINICAL_EVENT.result_status_cd              **
      logical_domain_id     [Double]              **  ORGANIZATION.logical_domain_id               **
      organization_id       [Double]              **  ENCOUNTER.organization_id                    **
      script_routine_args   [List]                **  NOT USING FOR NOW                            **
         routine_arg        [String: Variable]
         script_name        [String: Variable]
         routine_name       [String: Variable]
      result_status_cd      [Double]              **  CLINICAL_EVENT.result_status_cd              **
      result_set_id         [Double]              **  CLINICAL_EVENT.result_set_id                 **
 
}
 
/********************************************************************************************
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 
SECTION 2.
 
DEFINE THE REPLY HANDLE
 
The reply->status_data->status should have the following values:
 
 "S" means that clinical event is not supressed and that the ESO Server should be sent the event
 "Z" means to supress the clinical event and the ESO Server should not be contacted
 "F" means that the script actually failed for some unknown or critical reason
 
---------------------------------------------------------------------------------------------
********************************************************************************************
 
reply
{
   person_id             [Double]
   enctr_id              [Double]
   event_id              [Double]
   trigger_id            [Double]
   logical_domain_id     [Double]
   orgnization_id        [Double]
   trigger_type          [String: Variable]
   interface_type_disp   [String: Variable]
   status_data
      status                [String: Variable]
      subeventstatus        [List]
         operationname         [String: Variable]
         operationstatus       [String: Variable]
         targetobjectname      [String: Variable]
         targetobjectvalue     [String: Variable]
   script_routine_args   [List]
         routine_arg        [String: Variable]
         script_name        [String: Variable]
}
 
********************************************************************************************/
 
set reply->status_data->status = "S"
 
/********************************************************************************************
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 
SECTION 3.
 
DEFINE LOCAL VARIABLE THAT CAN BE USED IN THE CUSTOM SCRIPTING AT THE BOTTOM
 
---------------------------------------------------------------------------------------------
********************************************************************************************/
set event_disp                   = fillstring(40," ")
set result_status_cdm            = uar_get_code_meaning(request->result_status_cd)
set contributor_system_disp      = fillstring(40," ")
set interface_type_disp          = fillstring(80," ")
 
/* Trigger indicators can be used while applying filters */
set genlab_event_ind        = 0
set micro_event_ind         = 0
set rad_event_ind           = 0
set ap_event_ind            = 0
set mdoc_event_ind          = 0
set doc_event_ind           = 0
set powerform_event_ind     = 0
set immun_event_ind         = 0
set bloodbank_spr_event_ind = 0
set helix_event_ind         = 0
set iview_task_complete_event_ind = 0
set hlatyping_event_ind   	= 0
set dyndoc_event_ind      	= 0
set chart_grp_event_ind   	= 0
set chart_micro_event_ind 	= 0
set chart_rad_event_ind   	= 0
set chart_ap_event_ind    	= 0
set chart_mdoc_event_ind  	= 0
set chart_doc_event_ind   	= 0
 
;begin 002
set encntr_type_cd 		  	= 0.0
 
set inpatient_cd		  	= uar_get_code_by("DISPLAYKEY", 71, "INPATIENT")
set observation_cd		  	= uar_get_code_by("DISPLAYKEY", 71, "OBSERVATION")
set emergency_cd		  	= uar_get_code_by("DISPLAYKEY", 71, "EMERGENCY")
set ambulatory_cd		  	= uar_get_code_by("DISPLAYKEY", 71, "AMBULATORY")
set mdoc_oru_interface_type	= uar_get_code_by("MEANING", 19169, "ORUR3_MDOC")
;end 002
 
/********************************************************************************************/
 
/********************************************************************************************
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 
SECTION 4.
 
PERFORM SELECT ON PERSON AND ENCOUNTER TABLE TO GET ORGANIZATION_ID AND LOGICAL_DOMAIN_ID
 
PERFORM SELECT ON CLINICAL EVENT TABLE FOR MISSING REQUIRED ELEMENTS
 
PERFORM SELECT ON ESO TRIGGER TABLE FOR INTERFACE TYPE DISPLY
 
---------------------------------------------------------------------------------------------
********************************************************************************************/
if( request->transaction_info->result_set_id > 0.0 AND request->trigger_info->stype = "IVIEW")
 select into "nl:"
   crs.event_id
 from ce_result_set_link crs
 where crs.result_set_id = request->transaction_info->result_set_id
 detail
   request->transaction_info->event_id = crs.event_id
 with nocounter, maxrec = 1
endif
 
;;Get remaining details from the CLINICAL EVENT table
select into "nl:"
    ce.event_cd,
    ce.result_status_cd,
    ce.contributor_system_cd,
    ce.reference_nbr
    from clinical_event ce
    where ce.event_id = request->transaction_info->event_id
    and ce.valid_until_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
detail
    if( request->transaction_info->result_status_cd = 0.0 )
        request->transaction_info->result_status_cd = ce.result_status_cd
    endif
 
    result_status_cdm =  uar_get_code_meaning(request->transaction_info->result_status_cd)
 
    if( trim(request->trigger_info->reference_nbr) = "" )
        request->trigger_info->reference_nbr = ce.reference_nbr
    endif
 
    if( request->transaction_info->event_cd = 0.0 )
        request->transaction_info->event_cd = ce.event_cd
    endif
 
    event_disp =  uar_get_code_display(request->transaction_info->event_cd)
 
    if( request->transaction_info->contributor_system_cd = 0.0 )
        request->transaction_info->contributor_system_cd = ce.contributor_system_cd
    endif
 
    contributor_system_disp =  uar_get_code_display(request->transaction_info->contributor_system_cd)
 
 
    if(request->transaction_info->person_id = 0.0)
       request->transaction_info->person_id = ce.person_id
    endif
 
    if(request->transaction_info->enctr_id = 0.0)
       request->transaction_info->enctr_id = ce.encntr_id
    endif
 
with nocounter
 
select into "nl:"
  e.organization_id,
  o.logical_domain_id,
  e.encntr_type_cd ;002 add field here, so we don't have to hit the encounter table a second time
from encounter e,organization o
plan e where e.encntr_id = request->transaction_info->enctr_id
join o where o.organization_id = e.organization_id
detail
  request->transaction_info->organization_id   = e.organization_id
  request->transaction_info->logical_domain_id = o.logical_domain_id
  encntr_type_cd = e.encntr_type_cd ;002
with nocounter
 
;;Get interface type cd
if(request->trigger_info->interface_type_cd = 0.0)
  select into "nl:"
     et.interface_type_cd
     from eso_trigger et
     plan et where et.trigger_id = request->trigger_info->eso_trigger_id
  detail
     request->trigger_info->interface_type_cd = et.interface_type_cd
  with nocounter
endif
 
set interface_type_disp = uar_get_code_display(request->trigger_info->interface_type_cd)
set reply->interface_type_disp = interface_type_disp
 
;; Values avialable after querying above tables
;; 1. event_id
;; 2. result_status_cd
;; 3. result_status_cdm
;; 4. event_disp
;; 5. contributor_system_disp
;; 6. person_id
;; 7. encounter_id
;; 8. organization_id
;; 9. logical_domain_id
;; 10.interface_type_disp
 
/********************************************************************************************
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 
SECTION 5.
 
PERFORM CALL ECHO STATEMENTS FOR DEBUGGING
 
---------------------------------------------------------------------------------------------
********************************************************************************************/
 
call echo("*****************************************")
call echo(concat("class = ",request->trigger_info->class))
call echo(concat("stype = ",request->trigger_info->stype))
call echo(concat("subtype = ",request->trigger_info->subtype))
call echo(concat("subtype_detail = ",request->trigger_info->subtype_detail))
call echo(concat("message_version = ",message_version))
call echo(concat("event_id = ",cnvtstring(request->transaction_info->event_id)))
call echo(concat("event_cd = ",trim(cnvtstring(request->transaction_info->event_cd)),
                 "( ", trim(event_disp), " )"))
call echo(concat("result_status_cd = ",trim(cnvtstring(request->transaction_info->result_status_cd)),
                 "( ", trim(result_status_cdm) , " )"))
call echo(concat("contributor_system_cd = ",trim(cnvtstring(request->transaction_info->contributor_system_cd)),
                 "( ", trim(contributor_system_disp)," )"))
call echo(concat("enctr_id = ",cnvtstring(request->transaction_info->enctr_id)))
call echo(concat("person_id = ",cnvtstring(request->transaction_info->person_id)))
call echo(concat("organization_id   = ",cnvtstring(request->transaction_info->organization_id)))
call echo(concat("logical_domain_id = ",cnvtstring(request->transaction_info->logical_domain_id)))
 
/********************************************************************************************/
 
 
/********************************************************************************************
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 
SECTION 6.
 
ADD CUSTOM SETTINGS HERE. SOME EXAMPLES ARE LISTED BELOW.
 
---------------------------------------------------------------------------------------------
********************************************************************************************/
 
 
 
/*************************************** SKIP BY ENCOUNTER TYPE *****************************************************************/
;begin 002
if ((request->trigger_info->interface_type_cd = mdoc_oru_interface_type) and (request->trigger_info->subtype = "DYNDOC"))
  if (encntr_type_cd not in (inpatient_cd, observation_cd, emergency_cd, ambulatory_cd))
    set reply->status_data->status = "Z"
    ;call echo (build2("MESSAGE SKIPPED BECAUSE ENCNTR_TYPE_CD=", encntr_type_cd))
  endif
endif
;end 002
/**********************************************END OF SECTION 6**********************************************/
 
;begin 002
/********************************************************************************************
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 
SECTION 7.
 
THIS SECTION CONTROLS WHAT IS LOGGED OUT TO THE CCLUSERDIR
 
---------------------------------------------------------------------------------------------
********************************************************************************************
;if curdomain = "P30" ;possible enhancement to only run logs in p30. This is untested YM 10/22
set request_filename = concat("ccluserdir:fsi_xr_request",format(curdate,"mmddyy;;d"),format(curtime3,"hhmmss;;m"),".txt")
 
select into value(request_filename)
  class 		   			= request->trigger_info->class
  , type 			   		= request->trigger_info->stype
  , subtype 		   		= request->trigger_info->subtype
  , subtype_detail   		= request->trigger_info->subtype_detail
  , trigger_type			= request->trigger_info->eso_trigger_desc
  , trigger_id				= request->trigger_info->eso_trigger_id
  , interface_type		 	= request->trigger_info->interface_type_cd
  , event_id 		   		= request->transaction_info->event_id
  , event_cd 		   		= request->transaction_info->event_cd
  , result_status_cd 		= request->transaction_info->result_status_cd
  , enctr_id 				= request->transaction_info->enctr_id
  , person_id 				= request->transaction_info->person_id
  , organization_id   		= request->transaction_info->organization_id
  , logical_domain_id 		= request->transaction_info->logical_domain_id
  , encntr_type_cd			= encntr_type_cd
  , mdoc_oru_interface_type = mdoc_oru_interface_type
from
  (dummyt d1 with seq = 1)
with nocounter, separator = " ", format
 
set reply_filename = concat("ccluserdir:fsi_xr_reply",format(curdate,"mmddyy;;d"),format(curtime3,"hhmmss;;m"),".txt")
 
select into value(reply_filename)
  person_id 		   		= reply->person_id
  , enctr_id 			   	= reply->enctr_id
  , event_id 		   		= reply->event_id
  , trigger_id   			= reply->trigger_id
  , logical_domain_id		= reply->logical_domain_id
  , orgnization_id			= reply->orgnization_id
  , trigger_type 		 	= reply->trigger_type
  , interface_type_disp   	= reply->interface_type_disp
  , reply_status	   		= reply->status_data->status
from
  (dummyt d1 with seq = 1)
with nocounter, separator = " ", format
;end
/**********************************************END OF SECTION 7**********************************************/
;end 002
 
#END_PROGRAM
 
if(reply->status_data->status = "Z")
   call echo("MESSAGE IS SKIPPED. MESSAGE FILTER IS APPLIED IN THE ESO_CE_CUSTOM_SELECTION SCRIPT")
   set stat = alterlist(reply->status_data->subeventstatus,1)
   set reply->status_data->subeventstatus[1]->targetObjectValue = "ESO_CE_CUSTOM_SELECTION"
   set reply->status_data->subeventstatus[1]->targetObjectName  = "ESO_CE_CUSTOM_SELECTION"
   set reply->orgnization_id    = request->transaction_info->organization_id
   set reply->logical_domain_id = request->transaction_info->logical_domain_id
endif
 
end
go