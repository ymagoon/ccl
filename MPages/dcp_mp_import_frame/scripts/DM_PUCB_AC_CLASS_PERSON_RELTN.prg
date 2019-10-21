drop program DM_PUCB_AC_CLASS_PERSON_RELTN:dba go
create program DM_PUCB_AC_CLASS_PERSON_RELTN:dba
 
/************************************************************************
 *                                                                      *
 *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
 *                              Technology, Inc.                        *
 *       Revision      (c) 1984-1995 Cerner Corporation                 *
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
 ************************************************************************
 
 
 Source file name:       DM_PUCB_AC_CLASS_PERSON_RELTN.prg
 Object name:            DM_PUCB_AC_CLASS_PERSON_RELTN
 Request #:
 
 Product:                Combine
 Product Team:
 HNA Version:            500
 CCL Version:
 
 Program purpose:        Perform uncombine for the AC_CLASS_PERSON_RELTN table
 
 Tables read:            AC_CLASS_PERSON_RELTN
 
 Tables updated:         AC_CLASS_PERSON_RELTN
 Executing from:         dm_uncombine
 
 Special Notes:          This is a custom script to perform a person
                         uncombine on the AC_CLASS_PERSON_RELTN table.
                         It should be used instead of the generic
                         combine logic in the dm_uncombine.prg
 
 
***********************************************************************
* GENERATED MODIFICATION CONTROL LOG                                  *
***********************************************************************
*                                                                     *
*Mod Date     Engineer             Comment                            *
*--- -------- -------------------- -----------------------------------*
*000 09/11/12 NS9429 & KC7701	   Initial Release					  *
****************** END OF ALL MODCONTROL BLOCKS ***********************/
 
;these files should always be included
%i cclsource:dm_cmb_cust_script_routines.inc
%i cclsource:dm_cmb_exception_maint.inc
 

/******************************************************************************
 Maintain dm_cmb_exception row
******************************************************************************/
 
;If the script is following the new naming convention for custom scripts (dm_pcmb_<tname> or dm_ecmb_<tname>)
;then use the following code for maintaining the exception row.
;If it is not using the new naming convention, use the alternative logic (which will be obsolete after Oct 2005 release)
 
Call dm_cmb_get_context(0)  ;subroutine will initialize dm_cmb_cust_script->exc_maint_ind = 0
if (dm_cmb_cust_script->exc_maint_ind = 1)
 
    set stat = alterlist(dcem_request->qual,1)
 
    set dcem_request->qual[1].parent_entity = 'PERSON'
    set dcem_request->qual[1].child_entity = 'AC_CLASS_PERSON_RELTN'
    set dcem_request->qual[1].op_type = 'UNCOMBINE' ;'COMBINE' or 'UNCOMBINE
    set dcem_request->qual[1].script_name = 'DM_PUCB_AC_CLASS_PERSON_RELTN'  ;custom script name
    set dcem_request->qual[1].single_encntr_ind = 0 ;for PERSON combine, if table has both person_id and encntr_id,
                                                ;this should be set to 1 and the script should handle BOTH full
                                                ;person combines and encounter moves.  Otherwise set to 0
    ;************* IMPORTANT *************
    ; This script MUST run after the generic uncombine logic for hm_recommendation and invtn_communication
    ; Do not change this value
    set dcem_request->qual[1].script_run_order = 1     ;set appropriate for the situation (valid values start with 1)
    set dcem_request->qual[1].del_chg_id_ind = 0        ;set to 1 if the del_from subroutine updates the FK id of records on
                                                ;<child_table> to the "to" id of the combine
    set dcem_request->qual[1].delete_row_ind = 0        ;only set to 1 if this combine exception row should no longer be used
 
    execute dm_cmb_exception_maint
 
    call dm_cmb_exc_maint_status(dcem_reply->status, dcem_reply->err_msg, dcem_request->qual[1].child_entity)
 
    go to exit_sub
 
endif


/******************************************************************************
 Uncombine logic
******************************************************************************/
/******************************************************************************
 The request and reply record structures are defined in relation to the calling
 script, dm_uncombine. Custom uncombine scripts can use elements of the
 request as needed.
******************************************************************************/
 
/*
 
record request
(
 1 PARENT_TABLE = C50
 1 XXX_UNCOMBINE[*]
 2 XXX_COMBINE_ID = F8.0
 2 FROM_XXX_ID = F8.0 ;dm_uncombine swaps from/to, so this is the id we combined into on combine
 2 TO_XXX_ID = F8.0 ; dm_uncombine swaps from/to, so this is the id we combined away on combine
 2 ENCNTR_ID = F8.0 ; not used for uncombine
 
*/
 
/******************************************************************************
 The rChildren record structure is created and populated in the calling script,
 dm_uncombine, and is available to custom uncombine scripts.
******************************************************************************/
 
/*
 
 record rChildren
(
 1 QUAL1[*]
 2 XXX_COMBINE_DET_ID = F8 ;primary key of the combine_detail table
 2 ENTITY_NAME = C32 ;name of child entity
 2 ENTITY_ID = F8 ;value of primary key
 2 COMBINE_ACTION_CD = F8 ;type of action taken during the combine
 2 ATTRIBUTE_NAME = C32 ;foreign key attribute to the parent table
 2 PREV_ACTIVE_IND = I2 ;only used for the 'del' combine_action_cd
 2 PREV_ACTIVE_STATUS_CD = F8 ;only used for the 'del' combine_action_cd
 2 PREV_END_EFF_DT_TM = DQ8 ;only used in encntr combines, for the 'eff' combine_action_cd
 2 COMBINE_DESC_CD = F8 ;used to further describe what happened on combine
 2 PRIMARY_KEY_ATTR = C30 ;primary key attribute of the child table
 2 SCRIPT_NAME = C50 ;name of custom script (if applicable)
 2 DEL_CHG_ID_IND = I2 ;0 if custom combine script does not change the value of the foreign key
                       ;attribute on deletes during a combine, 1 if it does change the value
)
*/
 
/******************************************************************************
 Declare subroutines
******************************************************************************/
declare cust_ucb_eff(null) = null
declare cust_ucb_upt(null) = null
 
 
/* Below is logic similar to what is in the generic uncombine script. You will need to modify
 this logic to fit the needs of your particular table. */
free record acpr_qual
record acpr_qual
(
	1 parent_id		= f8
	1 registry_id	= f8
	1 org_id		= f8
	1 loc_cd		= f8
	1 ind_par_ind	= i2
	1 reg_upd		= i2
	1 new_par_id	= f8
	1 qual[*]
		2 pkey		= f8
)

set cust_ucb_dummy = 0
 
if (rChildren->qual1[det_cnt]->combine_action_cd = UPT)
 
	call cust_ucb_upt(null)
 
elseif (rChildren->qual1[det_cnt]->combine_action_cd = EFF)
 
	call cust_ucb_eff(null)
 
else
 
	/* an invalid combine_action_cd was used */
	set ucb_failed = DATA_ERROR
	set error_msg = "Invalid combine_action_cd"
	set error_table = rChildren->qual1[det_cnt]->entity_name
	go to exit_sub
 
endif
 
 
/******************************************************************************
 Cust_ucb_upt
******************************************************************************/
subroutine cust_ucb_upt(null)
;********************************************************************************
;Lock Table for ALL FROM_xxx_id Person Rows--inserts and updates may be required
;********************************************************************************
	select into "nl:"
	from
	ac_class_person_reltn acpr
 
	plan acpr
		where acpr.person_id = request->XXX_UNCOMBINE[ucb_cnt].FROM_XXX_ID
	with nocounter,forupdatewait(ACPR)
 
	;update the parent_id and ensure there are no orphan conditions created
	;if a registry was initially moved in the combine and additions were made to the regisry
	;on the combined person
 
	;step 1 -- update parent id --may not have gotten to the parent yet in the record structure
	select into "nl:"
	from
	ac_class_person_reltn acpr,
	ac_class_person_reltn acpr2,
	person_combine_det pcd
	plan acpr
		where acpr.ac_class_person_reltn_id = rChildren->QUAL1[det_cnt].ENTITY_ID
	join acpr2
		where acpr2.ac_class_person_reltn_id = acpr.parent_class_person_reltn_id
	join pcd
		where pcd.entity_id = outerjoin(acpr2.ac_class_person_reltn_id)
		and pcd.person_combine_id = outerjoin(request->XXX_UNCOMBINE[ucb_cnt].XXX_COMBINE_ID)
	head acpr2.ac_class_person_reltn_id
		;current registry row was found which will maintain the relationship with the condition
		if (pcd.person_combine_det_id > 0)
			acpr_qual->parent_id 	= acpr2.parent_class_person_reltn_id
 
			;current row is registry row and was originally updated
			if ((rChildren->QUAL1[det_cnt].ENTITY_ID = pcd.entity_id) and (pcd.combine_action_cd = UPT))
				acpr_qual->reg_upd = TRUE
			endif
		else ;row was moved to an existing registry duing the combine, need to find the original parent
			acpr_qual->parent_id 	= 0
		endif
 
		acpr_qual->registry_id	= acpr2.ac_class_def_id
		acpr_qual->org_id		= acpr2.organization_id
		acpr_qual->loc_cd		= acpr2.location_cd
		acpr_qual->ind_par_ind	= acpr2.independent_parent_ind
	with nocounter
 
 	if (curqual = 0)
		/* the uncombine was not performed correctly */
		set ucb_failed = DATA_ERROR
		set error_msg = "Error Finding UPDATED Registry parent"
		set error_table = rChildren->qual1[det_cnt]->entity_name
		go to exit_sub
	endif
 
	if (acpr_qual->parent_id = 0)
		;find the original registry that was inactivated during the combine
		select into "nl:"
		from
		person_combine_det pcd,
		ac_class_person_reltn acpr
 
		plan pcd
			where pcd.person_combine_id = request->XXX_UNCOMBINE[ucb_cnt].XXX_COMBINE_ID
			and pcd.entity_name = "AC_CLASS_PERSON_RELTN"
			and pcd.combine_action_cd = EFF
		join acpr
			where acpr.ac_class_person_reltn_id = pcd.entity_id
			and acpr.ac_class_def_id = acpr_qual->registry_id
			and acpr.organization_id = acpr_qual->org_id
			and acpr.location_cd = acpr_qual->loc_cd
		detail
			acpr_qual->parent_id 	= acpr.ac_class_person_reltn_id
		with nocounter
 
		 if (curqual = 0)
			/* the uncombine was not performed correctly */
			set ucb_failed = DATA_ERROR
			set error_msg = "Error Finding INACTIVATED Registry parent"
			set error_table = rChildren->qual1[det_cnt]->entity_name
			go to exit_sub
		endif
	endif
 
	update into ac_class_person_reltn acpr
	set
		acpr.person_id						= request->XXX_UNCOMBINE[ucb_cnt].TO_XXX_ID,
		acpr.parent_class_person_reltn_id 	= acpr_qual->parent_id,
		acpr.updt_applctx					= ReqInfo->updt_applctx,
		acpr.updt_dt_tm						= cnvtdatetime(curdate,curtime3),
		acpr.updt_id						= ReqInfo->updt_id,
		acpr.updt_task						= ReqInfo->updt_task,
		acpr.updt_cnt						= acpr.updt_cnt + 1
	where acpr.ac_class_person_reltn_id = rChildren->qual1[det_cnt].entity_id
	with nocounter
 
	if (curqual = 0)
		/* the uncombine was not performed correctly */
		set ucb_failed = REACTIVATE_ERROR
		set error_table = rChildren->qual1[det_cnt]->entity_name
		go to exit_sub
	endif
 
 	;step 2 -- insert rows for registries on FROM person and update existing rows to new parent_id
 	if (acpr_qual->reg_upd = TRUE)
 		;check to see if any condition rows have been added to the registry after the original combine
 		;only processing the check on registry rows that were updated during the combine.
		select into "nl:"
 		from
 		ac_class_person_reltn acpr,
		ac_class_person_reltn acpr2
		plan acpr
			where acpr.ac_class_person_reltn_id = rChildren->QUAL1[det_cnt].ENTITY_ID
		join acpr2
			where acpr2.parent_class_person_reltn_id = acpr.ac_class_person_reltn_id
			and not exists (select 1 from person_combine_det pcd
							where pcd.person_combine_id = request->XXX_UNCOMBINE[ucb_cnt].XXX_COMBINE_ID
							and pcd.entity_id = acpr2.ac_class_person_reltn_id
							)
		head acpr2.parent_class_person_reltn_id
			updcnt = 0
		detail
			updcnt = updcnt + 1
 
			if (mod(updcnt,20)=1)
				stat = alterlist(acpr_qual->qual,updcnt + 19)
			endif
 
			acpr_qual->qual[updcnt].pkey = acpr2.ac_class_person_reltn_id
		foot report
			stat = alterlist(acpr_qual->qual,updcnt)
		with nocounter
 
 		;if conditions have been added to registry after orig combine a new registry row (on the FROM person) is required for those
 		;conditions. The registry that was updated on the combine will be moved back to the original person and leave orphan condition
 		;rows unless a registry is created and attributed to the conditions added after the combine
		if (size(acpr_qual->qual,5)>0)
			set acpr_qual->new_par_id = 0.0
 
			select into "nl:"
			y = seq(HEALTH_STATUS_SEQ, nextval)
					 "##################;rp0"
			from dual
			detail
			  acpr_qual->new_par_id = cnvtreal(y)
			with format, counter
 
			insert into ac_class_person_reltn acpr
 			set
                acpr.ac_class_person_reltn_id  		= acpr_qual->new_par_id,
                acpr.person_id						= request->XXX_UNCOMBINE[ucb_cnt].FROM_XXX_ID,
                acpr.parent_class_person_reltn_id	= acpr_qual->new_par_id,
                acpr.ac_class_def_id			    = acpr_qual->registry_id,
                acpr.organization_id 				= acpr_qual->org_id,
                acpr.location_cd 					= acpr_qual->loc_cd,
                acpr.active_ind						= 1,
                acpr.independent_parent_ind 		= acpr_qual->ind_par_ind,
                acpr.beg_effective_dt_tm			= cnvtdatetime(curdate,curtime3),
                acpr.end_effective_dt_tm			= cnvtdatetime("31-DEC-2100 00:00:00"),
                acpr.updt_applctx					= ReqInfo->updt_applctx,
                acpr.updt_dt_tm						= cnvtdatetime(curdate,curtime3),
                acpr.updt_id						= ReqInfo->updt_id,
                acpr.updt_task						= ReqInfo->updt_task,
                acpr.updt_cnt						= 0
			plan acpr
			with nocounter
 
			if (curqual = 0)
				/* the uncombine was not performed correctly */
				set ucb_failed = INSERT_ERROR
				set error_table = rChildren->qual1[det_cnt]->entity_name
				go to exit_sub
			endif
 
 			;move the conditions to the new registry
			update into ac_class_person_reltn acpr,
                        (dummyt d1 with seq = size(acpr_qual->qual,5))
			set
                acpr.parent_class_person_reltn_id 	= acpr_qual->new_par_id,
                acpr.updt_applctx					= ReqInfo->updt_applctx,
                acpr.updt_dt_tm						= cnvtdatetime(curdate,curtime3),
                acpr.updt_id						= ReqInfo->updt_id,
                acpr.updt_task						= ReqInfo->updt_task,
                acpr.updt_cnt						= acpr.updt_cnt + 1
			plan d1
			join acpr
				where acpr.ac_class_person_reltn_id = acpr_qual->qual[d1.seq].pkey
			with nocounter
 
			if (curqual = 0)
				/* the uncombine was not performed correctly */
				set ucb_failed = UPDATE_ERROR
				set error_table = rChildren->qual1[det_cnt]->entity_name
				go to exit_sub
			endif
		endif
 	endif
end ;cust_ucb_upt
 
 
/******************************************************************************
 cust_ucb_eff
******************************************************************************/
subroutine cust_ucb_eff(null)
	;validate ac_class_def_id is still valid/active
	;reference data can only be inactivated if there are no active activity rows
	;cannot re-activate a row on an uncombine if the reference has been inactivated
	select into "nl:"
	from
	ac_class_person_reltn acpr
	where acpr.ac_class_person_reltn_id = rChildren->QUAL1[det_cnt].ENTITY_ID
	;validate the registry reference data associated to the entity is valid
	;to ensure condition rows are not getting updated when the parent will not be re-activated
	and exists (select 1 from ac_class_person_reltn acpr2,ac_class_def acd
				where acpr2.ac_class_person_reltn_id = acpr.parent_class_person_reltn_id
				and acpr2.ac_class_def_id = acd.ac_class_def_id
				and acd.active_ind = 1
				and acd.end_effective_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00")
				)
	;validate the condition row (or registiry row if entity_id is the registry row) is valid based on the entity_id
	and exists (select 1 from ac_class_def acd2
				where acd2.ac_class_def_id = acpr.ac_class_def_id
				and acd2.active_ind = 1
				and acd2.end_effective_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00")
				)
	with nocounter
 
	;Because the reference data is still active the activity row can be re-activated
	if (curqual > 0)	
		update into ac_class_person_reltn acpr
		set
			acpr.person_id						= request->XXX_UNCOMBINE[ucb_cnt].TO_XXX_ID,
			acpr.active_ind						= 1,
			acpr.end_effective_dt_tm			= cnvtdatetime("31-DEC-2100 00:00:00"),
			acpr.updt_applctx					= ReqInfo->updt_applctx,
			acpr.updt_dt_tm						= cnvtdatetime(curdate,curtime3),
			acpr.updt_id						= ReqInfo->updt_id,
			acpr.updt_task						= ReqInfo->updt_task,
			acpr.updt_cnt						= acpr.updt_cnt + 1
		where acpr.ac_class_person_reltn_id = rChildren->qual1[det_cnt].entity_id
		with nocounter
 
		if (curqual = 0)
			/* the uncombine was not performed correctly */
			set ucb_failed = REACTIVATE_ERROR
			set error_table = rChildren->qual1[det_cnt]->entity_name
			go to exit_sub
		endif
	else
		;still need to move the inactive record back to original person, but do not want to re-activate
 		update into ac_class_person_reltn acpr
		set
			acpr.person_id						= request->XXX_UNCOMBINE[ucb_cnt].TO_XXX_ID,
			acpr.updt_applctx					= ReqInfo->updt_applctx,
			acpr.updt_dt_tm						= cnvtdatetime(curdate,curtime3),
			acpr.updt_id						= ReqInfo->updt_id,
			acpr.updt_task						= ReqInfo->updt_task,
			acpr.updt_cnt						= acpr.updt_cnt + 1
		where acpr.ac_class_person_reltn_id = rChildren->qual1[det_cnt].entity_id
		with nocounter
 
		if (curqual = 0)
			/* the uncombine was not performed correctly */
			set ucb_failed = UPDATE_ERROR
			set error_table = rChildren->qual1[det_cnt]->entity_name
			go to exit_sub
		endif
	endif
end ;cust_ucb_eff
 
#exit_sub

if (validate(acpr_qual))
    free record acpr_qual
endif 
 
end
go
 