drop program DM_PCMB_AC_CLASS_PERSON_RELTN:dba go
create program DM_PCMB_AC_CLASS_PERSON_RELTN:dba
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 CMB_TEMPLATE.PRG
 TEMPLATE FOR CUSTOM COMBINE PROGRAMS (last updated 6/6/05)
 
 !!! PLEASE READ !!!
 
 PLEASE USE THIS TEMPLATE WHEN WRITING A CUSTOM COMBINE SCRIPT TO BE CALLED
BY DM_COMBINE. THE ITEMS ENCLOSED IN ANGLE BRACKETS, <>, ARE THOSE THAT
YOU SHOULD CHANGE TO FIT THE CASE OF YOUR TABLE. (YOU CAN DO A SEARCH ON
'<' TO HELP YOU FIND THEM ALL). PLEASE READ THE COMMENTS IN THIS TEMPLATE
FOR AN EXPLANATION OF WHAT NEEDS TO BE DONE.
 
DO NOT CHANGE THE NAMES OF ANYTHING NOT ENCLOSED IN ANGLE BRACKETS!!!
 
PLEASE USE THIS TEMPLATE IN CONJUNCTION WITH THE COMBINE REQUIREMENTS
DOCUMENTATION.
 
**Please note:  All code should be backward compatible with base 7.8 CCL.
 
*************************************************************************
 
This is the basic flow of the program:
 
1) select from_ids (and whatever else you need to do special processing)
into rRecList record structure
 
2) if curqual > 0 for your select in step 1, select to_ids (and whatever
else you need to do special processing) into rRecList record structure -
else go to the end of the script.  If you don't need anything from the "to",
then you don't have to select it.
 
3) perform custom logic to determine what to do with the records you've selected
 
4) update the appropriate activity records and log appropriate fields to request->xxx_combine_det
   via subroutines (combine details will be added as a group by dm_combine)
 
*************************************************************************
 
See request and reply record structures defined for dm_combine.prg
The request here is a part of the dm_combine request.
 
;record request
;(
 
------------------------------------------------------------------------
 Some or all of the following elements of the request in the calling
 script, dm_combine, will be filled out within this program. These
 elements will be used by another CCL program called by dm_combine to
 add combine_detail records for all tables combined using custom scripts.
 Notice the elements with 'xxx' in them. That is done on purpose so
 that the request is generic - it can handle any type of combine
 (e.g. person, encounter). The program you write here will only be
 called in the case of the combine type it is intended for (e.g. person,
 encounter), so don't worry about 'generically' named data elements.
 The entire request, including the elements you see here, has been
 defined in dm_combine. You do not need to define a request or
 reply for this routine.
------------------------------------------------------------------------
 
; 1 XXX_COMBINE_DET[*]
; 2 XXX_COMBINE_DET_ID = F8.0 ; NOT PASSED
; 2 XXX_COMBINE_ID = F8.0 ; NOT PASSED
; 2 ENTITY_NAME = C32.0 ; NOT PASSED
; 2 ENTITY_ID = F8.0 ; NOT PASSED
; 2 COMBINE_ACTION_CD = F8.0 ; NOT PASSED
; 2 ATTRIBUTE_NAME = C32.0 ; NOT PASSED
; 2 PREV_ACTIVE_IND = I2.0 ; NOT PASSED
; 2 PREV_ACTIVE_STATUS_CD = F8.0 ; NOT PASSED
; 2 PREV_END_EFF_DT_TM = DQ8.0 ; NOT PASSED
; 2 COMBINE_DESC_CD = F8.0 ; NOT PASSED
; 2 TO_RECORD_IND = I2.0 ; NOT PASSED
;)
 
The following constants are defined in dm_combine:
 
set FALSE = 0
set TRUE = 1
set GEN_NBR_ERROR = 3 ;used - number generator error
set INSERT_ERROR = 4 ;used - error on insert
set UPDATE_ERROR = 5 ;used - error on update
set REPLACE_ERROR = 6
set DELETE_ERROR = 7 ;used - error on logical delete
set UNDELETE_ERROR = 8
set REMOVE_ERROR = 9
set ATTRIBUTE_ERROR = 10
set LOCK_ERROR = 11
set NONE_FOUND = 12
set SELECT_ERROR = 13 ;used - error on select
set DATA_ERROR = 14 ;used - found unexpected data
set GENERAL_ERROR = 15
set REACTIVATE_ERROR= 16 ;used - reactivate a record that was inactivated during combine
set EFF_ERROR = 17 ;used - make a record effective that was made ineffective during combine
 
set CCL_ERROR = 18 ;**DO NOT USE THIS ERROR TYPE IN CUSTOM COMBINE SCRIPTS
                   ;**YOU CAN STILL CHECK FOR CCL ERRORS IN YOUR CUSTOM SCRIPT, BUT DON'T REPORT AS THIS TYPE
set failed = FALSE
 
 
;-------------------------------------------------------------
; The reply will be defined in the calling script, dm_combine.
;-------------------------------------------------------------
;record reply
;(
; %i status_block.inc
;)
 
 
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
 
/*~BB~************************************************************************
  *                                                                      *
  *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
  *                              Technology, Inc.                        *
  *       Revision      (c) 1984-2003 Cerner Corporation                 *
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
 
     Source file name:       DM_PCMB_AC_CLASS_PERSON_RELTN.PRG
	 Object name:            DM_PCMB_AC_CLASS_PERSON_RELTN
	 Request #:
 
	 Product:                Combine
	 Product Team:           Database Architecture
	 HNA Version:            500
	 CCL Version:
 
	 Program purpose:        Perform person move for the AC_CLASS_PERSON_RELTN table
 
 
	 Tables read:            AC_CLASS_PERSON_RELTN
	 Tables updated:         AC_CLASS_PERSON_RELTN
	 Executing from:         dm_combine
 
	 Special Notes:          This is a custom script to perform a person
	                         move on the AC_CLASS_PERSON_RELTN table.
	                         It should be used instead of the generic
	                         combine logic in dm_combine.prg
***********************************************************************
* GENERATED MODIFICATION CONTROL LOG *
***********************************************************************
* *
*Mod Date 	  Engineer 			   Comment							  *
*--- -------- -------------------- -----------------------------------*
*000 09/11/12 NS9429 & KC7701	   Initial Release					  *
***********************************************************************
 
****************** END OF ALL MODCONTROL BLOCKS ********************/
 
/*--------------------------------------------------------------------
 The rRecList record structure stores info about the records in the
 table you're dealing with that have the 'from' parent_id (like
 person_id), as well as those that have the 'to' parent_id. Info
 about the 'from' records is stored in 'from_rec', and info about the
 'to' records is stored in 'to_rec.' This information will be used
 later in the program to evaluate how to combine the records, as well
 as to document what was changed during the combine.
 
 EACH CUSTOM COMBINE PROGRAM WILL NEED TO DEFINE rRecList TO FIT
 ITS NEEDS. The first 3 elements in from_rec and to_rec should always
 be defined. Any elements after that are those that are needed to
 do custom processing for the table you're working on.
 
 THE RECORD STRUCTURE rRecList SHOULD BE FREED AT THE BEGINNING OF
 YOUR PROGRAM, THEN REDEFINED TO FIT YOUR TABLE'S NEEDS, AND
 FREED AGAIN AT THE END OF YOUR program.
--------------------------------------------------------------------*/
;******************************************************************************
;Include files
;******************************************************************************
;these files should always be included
%i cclsource:dm_cmb_cust_script_routines.inc
%i cclsource:dm_cmb_exception_maint.inc


;******************************************************************************
;Declare Subroutines
;******************************************************************************
declare move_class_person_reltn(acpr_id = f8,to_fk_id = f8,acpr_parent_id = f8) = null
declare endEFF_class_person_reltn(acpr_id = f8,to_fk_id = f8) = null


;******************************************************************************
;Declare rRecList record
;******************************************************************************
free record rRecList
record rRecList
(
	1 from_rec[*]
		2 from_id 			= f8     ;PK value (ac_class_person_reltn_id)
		2 encntr_focused_ind= i2
		2 suspect_flag 		= i2
		;additional identifiers
		2 registry_id		= f8
		2 condition_id		= f8
		2 parent_id		= f8
		2 org_id			= f8
		2 loc_cd			= f8
	1 to_rec[*]
		2 from_id = f8     ;PK value (ac_class_person_reltn_id)
		2 active_ind 		= i4
		2 active_status_cd 	= f8
		;additional identifiers
		2 registry_id		= f8
		2 condition_id		= f8
		2 parent_id		= f8
		2 org_id			= f8
		2 loc_cd			= f8
)
 
 
;******************************************************************************
;Declare/Initialize Variables
;******************************************************************************
declare match_ind = i2 with noconstant(FALSE)
declare tcnt = i4 with noconstant(0)
declare temp_parent_id = f8 with noconstant(0)
 
 
;******************************************************************************
;Maintain dm_cmb_exception row
;******************************************************************************
;If the script is following the new naming convention for custom scripts (dm_pcmb_<tname> or dm_ecmb_<tname>)
;then use the following code for maintaining the exception row.
;If it is not using the new naming convention, use the alternative logic (which will be obsolete after Oct 2005 release)
 
;NEW LOGIC
 
Call dm_cmb_get_context(0)  ;subroutine will initialize dm_cmb_cust_script->exc_maint_ind = 0
if (dm_cmb_cust_script->exc_maint_ind = 1)
 
    set stat = alterlist(dcem_request->qual,1)
 
    set dcem_request->qual[1].parent_entity = 'PERSON'
    set dcem_request->qual[1].child_entity = 'AC_CLASS_PERSON_RELTN' ;
    set dcem_request->qual[1].op_type = 'COMBINE' ;'COMBINE' or 'UNCOMBINE
    set dcem_request->qual[1].script_name = 'DM_PCMB_AC_CLASS_PERSON_RELTN'  ;custom script name
    set dcem_request->qual[1].single_encntr_ind = 0 ;for PERSON combine, if table has both person_id and encntr_id,
                                                ;this should be set to 1 and the script should handle BOTH full
                                                ;person combines and encounter moves.  Otherwise set to 0
    set dcem_request->qual[1].script_run_order = 1     ;set appropriate for the situation (valid values start with 1)
    set dcem_request->qual[1].del_chg_id_ind = 0        ;set to 1 if the del_from subroutine updates the FK id of records on
                                                ;AC_CLASS_PERSON_RELTN table to the "to" id of the combine
    set dcem_request->qual[1].delete_row_ind = 0        ;only set to 1 if this combine exception row should no longer be used
 
    execute dm_cmb_exception_maint
 
    call dm_cmb_exc_maint_status(dcem_reply->status, dcem_reply->err_msg, dcem_request->qual[1].child_entity)
 
    go to exit_sub
 
endif
 
;*****************************************************
;Gather FROM Person information
;*****************************************************
select into "nl:"
from
ac_class_person_reltn acpr,
ac_class_person_reltn acpr2
 
plan acpr
	where acpr.person_id = request->xxx_combine[iCombine]->from_xxx_id
    and acpr.ac_class_person_reltn_id = acpr.parent_class_person_reltn_id
join acpr2
    where acpr2.parent_class_person_reltn_id = outerjoin(acpr.ac_class_person_reltn_id)
order acpr.parent_class_person_reltn_id, acpr2.ac_class_def_id
head report
	qcnt = 0
detail
	qcnt = qcnt + 1
 
	if(mod(qcnt,100)=1)
		stat = alterlist(rRecList->from_rec,qcnt + 99)
	endif
 
	rRecList->from_rec[qcnt].registry_id	= acpr.ac_class_def_id
	rRecList->from_rec[qcnt].loc_cd			= acpr.location_cd
	rRecList->from_rec[qcnt].org_id			= acpr.organization_id
	rRecList->from_rec[qcnt].parent_id	    = acpr.parent_class_person_reltn_id
 
	if (acpr2.ac_class_person_reltn_id = acpr2.parent_class_person_reltn_id);Registry
		rRecList->from_rec[qcnt].from_id		= acpr.ac_class_person_reltn_id
 		rRecList->from_rec[qcnt].condition_id	= 0
	else ;Condition
		rRecList->from_rec[qcnt].from_id		= acpr2.ac_class_person_reltn_id
		rRecList->from_rec[qcnt].condition_id	= acpr2.ac_class_def_id
 	endif
 
foot report
	stat = alterlist(rRecList->from_rec,qcnt)
with nocounter
 
if (size(rRecList->from_rec,5)>0);only executing TO Logic if FROM rows are found
;*****************************************************
;Lock Table for ALL TO Person Rows
;*****************************************************
	select into "nl:"
	from
	ac_class_person_reltn acpr
 
	plan acpr
		where acpr.person_id = request->xxx_combine[iCombine]->to_xxx_id
	with nocounter,forupdatewait(ACPR)
 
	if (curqual > 0)
;*****************************************************
;Gather TO Person information
;*****************************************************
		select into "nl:"
		from
		ac_class_person_reltn acpr,
		ac_class_person_reltn acpr2
 
		plan acpr
			where acpr.person_id = request->xxx_combine[iCombine]->to_xxx_id
		    and acpr.ac_class_person_reltn_id = acpr.parent_class_person_reltn_id
		join acpr2
		    where acpr2.parent_class_person_reltn_id = outerjoin(acpr.ac_class_person_reltn_id)
		order acpr.parent_class_person_reltn_id, acpr2.ac_class_def_id
		head report
			qcnt = 0
		detail
			qcnt = qcnt + 1
 
			if(mod(qcnt,100)=1)
				stat = alterlist(rRecList->to_rec,qcnt + 99)
			endif
 
			rRecList->to_rec[qcnt].registry_id		= acpr.ac_class_def_id
			rRecList->to_rec[qcnt].loc_cd			= acpr.location_cd
			rRecList->to_rec[qcnt].org_id			= acpr.organization_id
			rRecList->to_rec[qcnt].parent_id	    = acpr.parent_class_person_reltn_id
 
			if (acpr2.ac_class_person_reltn_id = acpr2.parent_class_person_reltn_id);Registry
				rRecList->to_rec[qcnt].from_id		= acpr.ac_class_person_reltn_id
		 		rRecList->to_rec[qcnt].condition_id	= 0
			else ;Condition
				rRecList->to_rec[qcnt].from_id		= acpr2.ac_class_person_reltn_id
				rRecList->to_rec[qcnt].condition_id	= acpr2.ac_class_def_id
		 	endif
 
		foot report
			stat = alterlist(rRecList->to_rec,qcnt)
		with nocounter
	 endif
 
	for (fidx = 1 to size(rRecList->from_rec,5))
 
		set match_ind 		= FALSE
		set tcnt	  		= 1
		set temp_parent_id 	= 0
 
		if (size(rRecList->to_rec,5) > 0)
			while ((match_ind = FALSE) and (tcnt <= size(rRecList->to_rec,5)))
 
				;Find an exact FROM match with the TO record
				if (rRecList->from_rec[fidx].registry_id 		= rRecList->to_rec[tcnt].registry_id
					 and rRecList->from_rec[fidx].condition_id 	= rRecList->to_rec[tcnt].condition_id
					 and rRecList->from_rec[fidx].loc_cd 		= rRecList->to_rec[tcnt].loc_cd
					 and rRecList->from_rec[fidx].org_id 		= rRecList->to_rec[tcnt].org_id
					)
						call endEFF_class_person_reltn(rRecList->from_rec[fidx].from_id,request->xxx_combine[iCombine]->to_xxx_id)
 
					;set match_ind = TRUE to stop iterating through the TO record if an exact match was found and updated
	 				set match_ind = TRUE
                    
	 			;find instances of the from record where the registry, org, and loc match but not the condition.
				elseif(rRecList->from_rec[fidx].registry_id = rRecList->to_rec[tcnt].registry_id
					 	and rRecList->from_rec[fidx].condition_id 	!= rRecList->to_rec[tcnt].condition_id
					 	and rRecList->from_rec[fidx].loc_cd 		= rRecList->to_rec[tcnt].loc_cd
					 	and rRecList->from_rec[fidx].org_id 		= rRecList->to_rec[tcnt].org_id)
 
						;If the condition is not found within the TO record the registry parent of the TO will be used to move the
						;FROM RECORD
						set temp_parent_id = rRecList->to_rec[tcnt].parent_id
				endif
 
				set tcnt = tcnt + 1
 
			endwhile
 
			if (match_ind = FALSE)
				if (temp_parent_id > 0)
					;update using the parent registry id from the TO person
					call move_class_person_reltn(rRecList->from_rec[fidx].from_id,
							request->xxx_combine[iCombine]->to_xxx_id,temp_parent_id)
				else
					;the registry and conditions where not found, move the exact record to the TO person
					call move_class_person_reltn(rRecList->from_rec[fidx].from_id,
							request->xxx_combine[iCombine]->to_xxx_id,rRecList->from_rec[fidx].parent_id)
				endif
			endif
		else
			;TO person did not have any data, moving all FROM records to TO person
			call move_class_person_reltn(rRecList->from_rec[fidx].from_id,
				request->xxx_combine[iCombine]->to_xxx_id,rRecList->from_rec[fidx].parent_id)
		endif
	endfor
 
else
	go to exit_sub
endif
 
 
;*****************************************************************************************************************
;Subroutine move_class_person_reltn
;
;This subroutine will update an existing row on the ac_class_person_reltn table to have the "to" person id of the combine.
;
;Parameter definitions:
;acpr_id		;PK id value of the ac_class_person_reltn action being moved
;to_fk_id		;FK id value for the intended person
;acpr_parent_id ;FK id of the parent to update the child relation to the parent
;*****************************************************************************************************************
subroutine move_class_person_reltn(acpr_id,to_fk_id,acpr_parent_id)
 	update into ac_class_person_reltn acpr
	set
		acpr.person_id                      = to_fk_id,
		acpr.parent_class_person_reltn_id   = acpr_parent_id,
		acpr.updt_applctx                   = reqInfo->updt_applctx,
		acpr.updt_cnt                       = acpr.updt_cnt + 1,
		acpr.updt_dt_tm                     = cnvtdatetime(curdate,curtime3),
		acpr.updt_id                        = reqInfo->updt_id,
		acpr.updt_task                      = reqInfo->updt_task
	plan acpr
		where acpr.ac_class_person_reltn_id = acpr_id
	with nocounter
 
	set iCombineDet = iCombineDet + 1
 
	set stat = alterlist(request->xxx_combine_det, iCombineDet)
 
	set request->xxx_combine_det[iCombineDet]->combine_action_cd = UPT ; set combine action to 'update'
	set request->xxx_combine_det[iCombineDet]->entity_id = acpr_id
	set request->xxx_combine_det[iCombineDet]->entity_name = "AC_CLASS_PERSON_RELTN"
	set request->xxx_combine_det[iCombineDet]->attribute_name = "PERSON_ID"
 
	if (curqual = 0)
		/* the record was not updated */
		set failed = UPDATE_ERROR
		set request->error_message= substring(1,132, build("Could not update pk val=", acpr_id))
	endif
end ;move_class_person_reltn
 
 
;*****************************************************************************************************************
;Subroutine endEFF_class_person_reltn
;
;This subroutine will update the person with the TO id and
;end effective a row to ensure duplicate entries are not created on the table
;
;Parameter definitions:
;acpr_id		;PK id value of the ac_class_person_reltn action being moved
;to_fk_id		;FK id value for the intended person
;*****************************************************************************************************************
subroutine endEFF_class_person_reltn(acpr_id,to_fk_id)
	update into ac_class_person_reltn acpr
	set
		acpr.person_id              = to_fk_id,
		acpr.active_ind             = 0,
		acpr.end_effective_dt_tm    = cnvtdatetime(curdate,curtime3),
		acpr.updt_applctx           = reqInfo->updt_applctx,
		acpr.updt_cnt               = acpr.updt_cnt + 1,
		acpr.updt_dt_tm             = cnvtdatetime(curdate,curtime3),
		acpr.updt_id                = reqInfo->updt_id,
		acpr.updt_task              = reqInfo->updt_task
	plan acpr
		where acpr.ac_class_person_reltn_id = acpr_id
	with nocounter
 
	set iCombineDet = iCombineDet + 1
 
	set stat = alterlist(request->xxx_combine_det, iCombineDet)
 
	set request->xxx_combine_det[iCombineDet]->combine_action_cd = EFF ; set combine action to 'end effictive'
	set request->xxx_combine_det[iCombineDet]->entity_id = acpr_id
	set request->xxx_combine_det[iCombineDet]->entity_name = "AC_CLASS_PERSON_RELTN"
	set request->xxx_combine_det[iCombineDet]->attribute_name = "PERSON_ID"
 
	if (curqual = 0)
		/* the record was not updated */
		set failed = EFF_ERROR
		set request->error_message= substring(1,132, build("Could not update pk val=", acpr_id))
	endif
end ;endEFF_class_person_reltn
 
#exit_sub
;note: DM_COMBINE will check for CCL errors upon returning from calling custom scripts
 
free record rRecList
 
end go
 
