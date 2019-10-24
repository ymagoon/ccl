 /******************************************************************************
      *  Copyright Notice:  (c) 1983 Laboratory Information Systems &         *
      *                              Technology, Inc.                         *
      *       Revision      (c) 1984-2015 Cerner Corporation                  *
      *                                                                       *
      *  Cerner (R) Proprietary Rights Notice:  All rights reserved.          *
      *  This material contains the valuable properties and trade secrets of  *
      *  Cerner Corporation of Kansas City, Missouri, United States of        *
      *  America (Cerner), embodying substantial creative efforts and         *
      *  confidential information, ideas and expressions, no part of which    *
      *  may be reproduced or transmitted in any form or by any means, or     *
      *  retained in any storage or retrieval system without the express      *
      *  written permission of Cerner.                                        *
      *                                                                       *
      *  Cerner is a registered mark of Cerner Corporation.                   *
      *                                                                       *
      ************************************************************************/
 
/******************************************************************************
 
        Source file name:       mp_dcp_update_pgor.prg
        Object name:            mp_dcp_update_pgor
        Request #:              600951
 
        Product:
        Product Team:           PowerChart & Info Exchange
        HNA Version:            v500
        CCL Version:
 
        Program purpose:        To update the PRSNL_GROUP_ORG_RELTN table with the changes
        						in provider groups, their associated providers
        						 and the organizations associated with those providers.
 
								When the Ops Job is executed, the PRSNL_GROUP_ORG_RELTN
								table will be updated with all active dynamic worklist
								provider groups and the distinct organizations associated
								with each provider of the group
 
        Tables read:            PRSNL_GROUP, PRSNL_GROUP_RELTN, PRSNL, PRSNL_ORG_RELTN, ORGANIZATIONS
        Tables updated:         PRSNL_GROUP_ORG_RELTN
        Executing from:			Opsjob
 
        Special Notes:
 
*******************************************************************************/
/********************************************************************************/
/*                     GENERATED MODIFICATION CONTROL LOG                       */
/********************************************************************************/
/*                                                                              */
/* Mod   Date        Feature  Engineer                     Comment              */
/* ----  --------    -------  ---------------------------  -------------------- */
/* 0000  02/15/2018  555236   HT031326                       Created              */
/*                                                                              */
/**********************  END OF ALL MODCONTROL BLOCKS  **************************/
 
drop program mp_dcp_update_pgor:dba go
create program mp_dcp_update_pgor:dba
 
prompt
	 "Output to File/Printer/MINE" = "MINE"
 
with outdev
 
free record prsnl_group_orgs
record prsnl_group_orgs
(
	1 prsnl_group_id = f8
	1 prsnl_group_name = vc
	1 organizations[*]
		2 organization_id = f8
)
free record mod_prsnl_groups
record mod_prsnl_groups(
	1 qual[*]
		2 prsnl_group_id = f8
		2 prsnl_group_name = vc
)
 
free record insert_groups
record insert_groups(
	1 prsnl_group_id = f8
	1 prsnl_group_name = vc
	1 organizations[*]
		2 organization_id = f8
)
free record delete_groups
record delete_groups(
	1 prsnl_group_id = f8
	1 prsnl_group_name = vc
	1 organizations[*]
		2 organization_id = f8
)
 
free record reply
record reply(
	1 ops_event = vc
%i cclsource:status_block.inc
)
 
free record log_msg
record log_msg
(
  1 messages[*]
    2 info = vc
  1 msg_cnt = i4
)
 
free record summary_log_msg
record summary_log_msg
(
  1 messages[*]
    2 info = vc
  1 msg_cnt = i4
)
 
%i cclsource:mp_script_logging.inc
call log_message("Begin script mp_dcp_update_pgor",LOG_LEVEL_DEBUG)
 
/**************************************************************
; DVDev DECLARED SUBROUTINES
**************************************************************/
declare GetLastUpdatedTime(null)						= null with protect
declare GetPrsnlGroupOrgs(mod_prsnl_group_id = f8) 		= null with protect
declare DeleteOrgsAndGroups(qual_grp_orgs = VC(REF))	= null with protect
declare InsertGrpsAndOrgs(qual_grp_orgs = vc(ref)) 		= null with protect
declare GetNewlyAddedGroups(null) 						= null with protect
declare GetNewModGrpsByPrsnl(null) 						= null with protect
declare GetModGrpsByActiveOrInactivePrsnl(null) 		= null with protect
declare GetModGrpsByAddOrgToPrsnl(null) 				= null with protect
declare GetModGrpsByRemoveOrgFromPrsnl(null) 			= null with protect
declare GetModGrpsByInActiveOrgs(null)					= null with protect
declare CompareQualRowsWithPgor(qual_grp_orgs=vc(ref))	= null with protect
declare ComparePgorWithQualRows(qual_grp_orgs=vc(ref))	= null with protect
declare DeleteGroupFromPgor(mod_prsnl_group_id = f8)	= null with protect
declare replyFailure(null) 								= null with protect
declare logMessagesToFile(_msg = vc)     				= null with protect
declare logSummaryMsgToFile(_msg = vc)     				= null with protect
 
/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
declare DWL_PROVIDER_GROUP_CD 	= f8 with protect,constant(UAR_GET_CODE_BY("MEANING",19189,"AMBCAREGRP"))
declare last_updt_dt_tm 		= dq8 with protect
declare SCRIPT_BEGIN_TIME   	= f8 with protect,constant(curtime3)
declare LOG_FILE_STR 			= vc with protect,constant(build("mp_dcp_update_pgor_log", format(cnvtdatetime(curdate, curtime3),
                                                                                   "yyyymmddhhmmss;;D"), ".xml"))
declare fail_operation 			= vc with protect, noconstant("")
declare failed 					= i2 with noconstant(0)
 
set reply->status_data->status = "Z"
set ERRMSG =  FILLSTRING(132," ")
set ERRCODE = error(ERRMSG,1)
 
/**************************************************************
; DVDev Start Coding
**************************************************************/
call logMessagesToFile("Begin script mp_dcp_update_pgor")
call GetLastUpdatedTime(null)
if(last_updt_dt_tm != null and DWL_PROVIDER_GROUP_CD > 0.0)
	call logMessagesToFile("last_updt_dt_tm retrived from prsnl_group_org_reltn table")
 
	call GetModGrpsByActiveOrInactivePrsnl(null)
	call GetModGrpsByRemoveOrgFromPrsnl(null)
	call GetModGrpsByAddOrgToPrsnl(null)
	call GetModGrpsByInActiveOrgs(null)
	call GetNewModGrpsByPrsnl(null)
elseif(DWL_PROVIDER_GROUP_CD > 0.0)
	call logMessagesToFile("last_updt_dt_tm is null")
 
	call GetNewlyAddedGroups(null)
endif
 
go to exit_script
 
/**************************************************************
; DVDev DEFINED SUBROUTINES
**************************************************************/
;to get the last updated date and time from prsnl_group_org_reltn table for Dynamic Worklist groups
subroutine GetLastUpdatedTime(null)
	call logMessagesToFile("Begin GetLastUpdatedTime()")			; log to file
	call log_message("Begin GetLastUpdatedTime()",LOG_LEVEL_DEBUG) ; to log to msgview
	declare BEGIN_TIME = f8 with constant(curtime3), private
 
	select into "nl:"
	from
		prsnl_group_org_reltn   PGOR
	where PGOR.prsnl_group_id in (select
		PG.prsnl_group_id
	from
		prsnl_group   PG
	where PG.prsnl_group_class_cd = DWL_PROVIDER_GROUP_CD
	and PG.active_ind = 1
	and PG.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
	and PG.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3))
 
	order by
		PGOR.updt_dt_tm   DESC
 
	detail
		last_updt_dt_tm = PGOR.updt_dt_tm
 
	WITH MAXREC = 1, NOCOUNTER, SEPARATOR=" ", FORMAT
 
	set ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
	   set failed = 1
	   set fail_operation = "Last UPDT_DT_TM select"
	   call replyFailure("SELECT")
	endif
 
	call logMessagesToFile(build2("Exit GetLastUpdatedTime(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"," GetLastUpdatedTime ", format(last_updt_dt_tm,";;Q")))
 
	call log_message(build2("Exit GetLastUpdatedTime(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"," GetLastUpdatedTime ", format(last_updt_dt_tm,";;Q")),LOG_LEVEL_DEBUG)
end
 
;to get all the distinct orgs associated with providers of dynamic worklist group
subroutine GetPrsnlGroupOrgs(mod_prsnl_group_id)
	call logMessagesToFile("Begin GetPrsnlGroupOrgs()")
	call log_message("Begin GetPrsnlGroupOrgs()",LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
 
	if(size(prsnl_group_orgs->organizations,5)>0)
		set stat = INITREC(prsnl_group_orgs)
	endif
 
	if(mod_prsnl_group_id > 0.0)
		select into "nl:"
		FROM
			  PRSNL_GROUP PG,
			  PRSNL_GROUP_RELTN PGR,
			  PRSNL PR,
			  PRSNL_ORG_RELTN POR,
			  ORGANIZATION O
		PLAN PG
			 where PG.prsnl_group_class_cd = DWL_PROVIDER_GROUP_CD
			 and PG.prsnl_group_id = mod_prsnl_group_id
			 and PG.active_ind = 1
			 and PG.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			 and PG.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
		JOIN PGR
			 where PG.prsnl_group_id = PGR.prsnl_group_id
			 and PGR.active_ind = 1
			 and PGR.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			 and PGR.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 		JOIN PR
 			 where PGR.person_id = PR.person_id
			 and PR.active_ind = 1
			 and PR.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			 and PR.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
		JOIN POR
			 where POR.person_id = PR.person_id
			 and POR.active_ind = 1
			 and POR.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			 and POR.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
		JOIN O
			 where POR.organization_id = O.organization_id
			 and O.active_ind = 1
			 and O.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			 and O.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
		order by
			PG.prsnl_group_id,POR.organization_id
		head report
			org_idx = 0
 			stat = alterlist(prsnl_group_orgs->organizations, 100)
 
 			prsnl_group_orgs->prsnl_group_id = PG.prsnl_group_id
 			prsnl_group_orgs->prsnl_group_name = PG.prsnl_group_name
 
 		head POR.organization_id
			org_idx = org_idx + 1
			if(org_idx > 100 and mod(org_idx,100) = 1)
				stat = alterlist(prsnl_group_orgs->organizations, org_idx+99)
			endif
 
			prsnl_group_orgs->organizations[org_idx]->organization_id = POR.organization_id
 
		foot report
			stat = alterlist(prsnl_group_orgs->organizations, org_idx)
		with nocounter
 
		set ERRCODE = ERROR(ERRMSG,0)
		if(ERRCODE != 0)
		   set failed = 1
		   set fail_operation = "GetPrsnlGroupOrgs"
		   call replyFailure("SELECT")
		endif
		;If group have no orgs
		if(size(prsnl_group_orgs->organizations,5) <= 0)
			set prsnl_group_orgs->prsnl_group_id = mod_prsnl_group_id
		endif
 
		if (validate(debug_ind, 0) = 1)
			call echorecord(prsnl_group_orgs)
		else
			call echoxml(prsnl_group_orgs, LOG_FILE_STR, 1)
		endif
	endif
 
	call logMessagesToFile(build2("Exit GetPrsnlGroupOrgs(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"," Group ",mod_prsnl_group_id,
		" No of distinct orgs ",size(prsnl_group_orgs->organizations,5)))
 
	call log_message(build2("Exit GetPrsnlGroupOrgs(), Elapsed time:",
		cnvtint(curtime3-BEGIN_TIME), "0 ms"," Group ",mod_prsnl_group_id,
		" No of distinct orgs ",size(prsnl_group_orgs->organizations,5)),LOG_LEVEL_DEBUG)
end
 
;to insert qualified rows into prsnl_group_org_reltn table
subroutine InsertGrpsAndOrgs(qual_grp_orgs)
	call logMessagesToFile("Begin InsertGrpsAndOrgs()")
	call log_message("Begin InsertGrpsAndOrgs()",LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
 
	if(size(qual_grp_orgs->organizations,5)>0)
		INSERT INTO
			PRSNL_GROUP_ORG_RELTN PGOR,
			(dummyt d with seq = VALUE(size(qual_grp_orgs->organizations,5)))
		set
			PGOR.PRSNL_GROUP_ORG_RELTN_ID = seq(PRSNL_SEQ, nextval),
			PGOR.prsnl_group_id = qual_grp_orgs->prsnl_group_id,
			PGOR.organization_id = qual_grp_orgs->organizations[d.seq]->organization_id,
			PGOR.updt_id = reqinfo->updt_id,
		   	PGOR.updt_dt_tm = cnvtdatetime(curdate, curtime3),
		   	PGOR.updt_task = reqinfo->updt_task,
		   	PGOR.updt_applctx = reqinfo->updt_applctx,
		   	PGOR.updt_cnt = 0
		plan d
		join PGOR
		with nocounter
 
		set ERRCODE = ERROR(ERRMSG,0)
		if(ERRCODE != 0)
		   set failed = 1
		   set fail_operation = "InsertGrpsAndOrgs"
		   call replyFailure("INSERT")
		endif
 
		call logSummaryMsgToFile(build2("Inserted rows: ",size(qual_grp_orgs->organizations,5),
		" For provider group :", qual_grp_orgs->prsnl_group_id))
 
		if (validate(debug_ind, 0) = 1)
			call echorecord(qual_grp_orgs)
		else
			call echoxml(qual_grp_orgs, LOG_FILE_STR, 1)
		endif
 
	endif
 
	call logMessagesToFile(build2("Exit InsertGrpsAndOrgs(), Elapsed time:",
	cnvtint(curtime3-BEGIN_TIME), "0 ms"," Inserted rows ", size(qual_grp_orgs->organizations,5)))
 
	call log_message(build2("Exit InsertGrpsAndOrgs(), Elapsed time:",
	cnvtint(curtime3-BEGIN_TIME), "0 ms"," Inserted rows ", size(qual_grp_orgs->organizations,5)),LOG_LEVEL_DEBUG)
end
;to delete the entire group from prsnl_group_org_reltn table
subroutine DeleteGroupFromPgor(mod_prsnl_group_id)
	call logMessagesToFile("Begin DeleteGroupFromPgor()")
	call log_message("Begin DeleteGroupFromPgor()",LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
 
	if(mod_prsnl_group_id > 0.0)
		DELETE
		FROM
			PRSNL_GROUP_ORG_RELTN PGOR
		where PGOR.prsnl_group_id = mod_prsnl_group_id
 
		set ERRCODE = ERROR(ERRMSG,0)
		if(ERRCODE != 0)
		   set failed = 1
		   set fail_operation = "DeleteGroupFromPgor"
		   call replyFailure("DELETE")
		endif
 
		call logSummaryMsgToFile(build2("Deleted group from prsnl_group_org_reltn table:", mod_prsnl_group_id))
	endif
 
	call logMessagesToFile(build2("Exit DeleteGroupFromPgor(), Elapsed time:",
	cnvtint(curtime3-BEGIN_TIME), "0 ms"," DeleteGroupFromPgor ",mod_prsnl_group_id))
 
	call log_message(build2("Exit DeleteGroupFromPgor(), Elapsed time:",
	cnvtint(curtime3-BEGIN_TIME), "0 ms"," DeleteGroupFromPgor ",mod_prsnl_group_id),LOG_LEVEL_DEBUG)
end
 
;To remove prsnl groups and it's related organizations from PRSNL_GROUP_ORG_RELTN table
subroutine DeleteOrgsAndGroups(qual_grp_orgs)
	call logMessagesToFile("Begin DeleteOrgsAndGroups()")
	call log_message("Begin DeleteOrgsAndGroups()",LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
 
	if(size(qual_grp_orgs->organizations,5)>0)
		for(y=1 to size(qual_grp_orgs->organizations,5))
			DELETE FROM
				PRSNL_GROUP_ORG_RELTN PGOR
			where PGOR.prsnl_group_id = qual_grp_orgs->prsnl_group_id
			and	PGOR.organization_id = qual_grp_orgs->organizations[y]->organization_id
			with nocounter
		endfor
 
		set ERRCODE = ERROR(ERRMSG,0)
		if(ERRCODE != 0)
		   set failed = 1
		   set fail_operation = "DeleteOrgsAndGroups"
		   call replyFailure("DELETE")
		endif
 
		call logSummaryMsgToFile(build2("Deleted rows: ",size(qual_grp_orgs->organizations,5),
		" for provider group:", qual_grp_orgs->prsnl_group_id))
 
		if (validate(debug_ind, 0) = 1)
			call echorecord(qual_grp_orgs)
		else
			call echoxml(qual_grp_orgs, LOG_FILE_STR, 1)
		endif
	endif
 
	call logMessagesToFile(build2("Exit DeleteOrgsAndGroups(), Elapsed time:",cnvtint(curtime3-BEGIN_TIME),
	"0 ms"," NumberOfDeletedRows ",size(qual_grp_orgs->organizations,5)))
 
	call log_message(build2("Exit DeleteOrgsAndGroups(), Elapsed time:",cnvtint(curtime3-BEGIN_TIME),
	"0 ms"," NumberOfDeletedRows ",size(qual_grp_orgs->organizations,5)),LOG_LEVEL_DEBUG)
end
 
;retrieve all DWL provider groups
subroutine GetNewlyAddedGroups(null)
	call logMessagesToFile("Begin GetNewlyAddedGroups()")
	call log_message("Begin GetNewlyAddedGroups()",LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
 
	if(size(mod_prsnl_groups->qual,5) > 0)
		set stat = INITREC(mod_prsnl_groups)
	endif
 
	SELECT INTO "NL:"
	FROM
		PRSNL_GROUP   PG
		where PG.prsnl_group_class_cd =  DWL_PROVIDER_GROUP_CD
		and PG.active_ind = 1
		and PG.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and PG.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	order by PG.prsnl_group_id
	head report
		stat = alterlist(mod_prsnl_groups->qual, 20)
		group_idx = 0
	detail
		group_idx = group_idx+1
		if(group_idx > 20 and mod(group_idx,20) = 1)
	     	stat = alterlist(mod_prsnl_groups->qual, group_idx + 19)
	    endif
		mod_prsnl_groups->qual[group_idx]->prsnl_group_id = PG.prsnl_group_id
		mod_prsnl_groups->qual[group_idx]->prsnl_group_name = PG.prsnl_group_name
	foot report
		stat = alterlist(mod_prsnl_groups->qual, group_idx)
	with nocounter
 
	set ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
	   set failed = 1
	   set fail_operation = "Select Newly added groups"
	   call replyFailure("SELECT")
	endif
 
	if(size(mod_prsnl_groups->qual,5) > 0)
		if (validate(debug_ind, 0) = 1)
			call echorecord(mod_prsnl_groups)
		else
			call echoxml(mod_prsnl_groups, LOG_FILE_STR, 1)
		endif
 
		for(x=1 to (size(mod_prsnl_groups->qual,5)))
			call GetPrsnlGroupOrgs(mod_prsnl_groups->qual[x]->prsnl_group_id)
 
			if(size(prsnl_group_orgs->organizations,5)>0)
				call InsertGrpsAndOrgs(prsnl_group_orgs)
			endif
		endfor
	endif
 
	call logMessagesToFile(build2("Exit GetNewlyAddedGroups(), Elapsed time:",
	cnvtint(curtime3-BEGIN_TIME), "0 ms","GetNewlyAddedGroups ",size(mod_prsnl_groups->qual,5)))
 
	call log_message(build2("Exit GetNewlyAddedGroups(), Elapsed time:",
	cnvtint(curtime3-BEGIN_TIME), "0 ms","GetNewlyAddedGroups ",size(mod_prsnl_groups->qual,5)),LOG_LEVEL_DEBUG)
end
 
; retrieve groups which has been inserted and also modified by adding/removing a provider from group
subroutine GetNewModGrpsByPrsnl(null)
	call logMessagesToFile("Begin GetNewModGrpsByPrsnl()")
	call log_message("Begin GetNewModGrpsByPrsnl()",LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
 
	if(size(mod_prsnl_groups->qual,5) > 0)
		set stat = INITREC(mod_prsnl_groups)
	endif
 
	SELECT INTO "NL:"
	FROM
		PRSNL_GROUP   PG
		where PG.prsnl_group_class_cd = DWL_PROVIDER_GROUP_CD
		and PG.active_ind = 1
		and PG.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and PG.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
		and PG.updt_cnt >= 0
		and PG.updt_dt_tm > CNVTDATETIME(last_updt_dt_tm)
		and PG.prsnl_group_id in
			(select PGOR.prsnl_group_id
			from
				PRSNL_GROUP_ORG_RELTN PGOR
			where PGOR.prsnl_group_id = PG.prsnl_group_id)
	order by PG.prsnl_group_id
	head report
		stat = alterlist(mod_prsnl_groups->qual, 20)
		group_idx = 0
	detail
		group_idx = group_idx+1
		if(group_idx > 20 and mod(group_idx,20) = 1)
	     	stat = alterlist(mod_prsnl_groups->qual, group_idx + 19)
	    endif
		mod_prsnl_groups->qual[group_idx]->prsnl_group_id = PG.prsnl_group_id
		mod_prsnl_groups->qual[group_idx]->prsnl_group_name = PG.prsnl_group_name
	foot report
		stat = alterlist(mod_prsnl_groups->qual, group_idx)
	with nocounter
 
	set ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
	   set failed = 1
	   set fail_operation = "Select modified groups by adding/removing provider from provider group exist in PGOR"
	   call replyFailure("SELECT")
	endif
 
	if(size(mod_prsnl_groups->qual,5) > 0)
		if (validate(debug_ind, 0) = 1)
			call echorecord(mod_prsnl_groups)
		else
			call echoxml(mod_prsnl_groups, LOG_FILE_STR, 1)
		endif
		for(x=1 to (size(mod_prsnl_groups->qual,5)))
			call GetPrsnlGroupOrgs(mod_prsnl_groups->qual[x]->prsnl_group_id)
 
			if(size(prsnl_group_orgs->organizations,5)>0)
				call ComparePgorWithQualRows(prsnl_group_orgs)
				call CompareQualRowsWithPgor(prsnl_group_orgs)
			else
				call DeleteGroupFromPgor(mod_prsnl_groups->qual[x]->prsnl_group_id)
			endif
		endfor
	endif
 
	; If the group not exist in PGOR but previously exists
	if(size(mod_prsnl_groups->qual,5) > 0)
		set stat = INITREC(mod_prsnl_groups)
	endif
 
	SELECT INTO "NL:"
	FROM
		PRSNL_GROUP   PG
		where PG.prsnl_group_class_cd = DWL_PROVIDER_GROUP_CD
		and PG.active_ind = 1
		and PG.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and PG.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
		and PG.updt_cnt >= 0
		and PG.updt_dt_tm > CNVTDATETIME(last_updt_dt_tm)
		and PG.prsnl_group_id not in
			(select PGOR.prsnl_group_id
			from
				PRSNL_GROUP_ORG_RELTN PGOR
			where PGOR.prsnl_group_id = PG.prsnl_group_id)
	order by PG.prsnl_group_id
	head report
		stat = alterlist(mod_prsnl_groups->qual, 20)
		group_idx = 0
	detail
		group_idx = group_idx+1
		if(group_idx > 20 and mod(group_idx,20) = 1)
	     	stat = alterlist(mod_prsnl_groups->qual, group_idx + 19)
	    endif
		mod_prsnl_groups->qual[group_idx]->prsnl_group_id = PG.prsnl_group_id
		mod_prsnl_groups->qual[group_idx]->prsnl_group_name = PG.prsnl_group_name
	foot report
		stat = alterlist(mod_prsnl_groups->qual, group_idx)
	with nocounter
 
	set ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
	   set failed = 1
	   set fail_operation = "Select inserted or modified groups by adding/removing provider from provider group not exist in PGOR"
	   call replyFailure("SELECT")
	endif
 
	if(size(mod_prsnl_groups->qual,5) > 0)
		if (validate(debug_ind, 0) = 1)
			call echorecord(mod_prsnl_groups)
		else
			call echoxml(mod_prsnl_groups, LOG_FILE_STR, 1)
		endif
		for(x=1 to (size(mod_prsnl_groups->qual,5)))
			call GetPrsnlGroupOrgs(mod_prsnl_groups->qual[x]->prsnl_group_id)
			if(size(prsnl_group_orgs->organizations,5)>0)
				call InsertGrpsAndOrgs(prsnl_group_orgs)
			endif
		endfor
	endif
 
 	call logMessagesToFile(build2("Exit GetNewModGrpsByPrsnl(), Elapsed time:",
	cnvtint(curtime3-BEGIN_TIME), "0 ms","Get New & Modified groups when a provider is added or removed ",
	size(mod_prsnl_groups->qual,5)))
 
	call log_message(build2("Exit GetNewModGrpsByPrsnl(), Elapsed time:",
	cnvtint(curtime3-BEGIN_TIME), "0 ms","Get New & Modified groups when a provider is added or removed ",
	size(mod_prsnl_groups->qual,5)),LOG_LEVEL_DEBUG)
end
 
;retrieve groups when an associated provider is no longer active or reactivated
subroutine GetModGrpsByActiveOrInactivePrsnl(null)
	call logMessagesToFile("Begin GetModGrpsByActiveOrInactivePrsnl()")
	call log_message("Begin GetModGrpsByActiveOrInactivePrsnl()",LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
 
	if(size(mod_prsnl_groups->qual,5) > 0)
		set stat = INITREC(mod_prsnl_groups)
	endif
 
 	call logMessagesToFile("Begin select query to get modified groups in PGOR")
 
	SELECT into "nl:"
	FROM
		PRSNL_GROUP   PG
		, PRSNL_GROUP_RELTN   PGR
		, PRSNL   PR
 
	PLAN PG
		where PG.PRSNL_GROUP_CLASS_CD = DWL_PROVIDER_GROUP_CD
		and PG.active_ind = 1
		and PG.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and PG.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
		and PG.prsnl_group_id in
			(select PGOR.prsnl_group_id
			from
				PRSNL_GROUP_ORG_RELTN PGOR
			where PGOR.prsnl_group_id = PG.prsnl_group_id)
	JOIN PGR
		where PGR.prsnl_group_id = PG.prsnl_group_id
		and PGR.active_ind = 1
		and PGR.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and PGR.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	JOIN PR
		where PR.person_id = PGR.person_id
		and PR.updt_dt_tm > CNVTDATETIME(last_updt_dt_tm)
		and PR.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and PR.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	order by PG.prsnl_group_id
	head report
		stat = alterlist(mod_prsnl_groups->qual, 20)
		group_idx = 0
	head PG.prsnl_group_id
		group_idx = group_idx+1
		if(group_idx > 20 and mod(group_idx,20) = 1)
	     	stat = alterlist(mod_prsnl_groups->qual, group_idx + 19)
	    endif
		mod_prsnl_groups->qual[group_idx]->prsnl_group_id = PG.prsnl_group_id
		mod_prsnl_groups->qual[group_idx]->prsnl_group_name = PG.prsnl_group_name
	foot report
		stat = alterlist(mod_prsnl_groups->qual, group_idx)
	with nocounter
 
	set ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
	   set failed = 1
	   set fail_operation = "Select modified groups by Activating/Inactivating providers of provider groups in PGOR"
	   call replyFailure("SELECT")
	endif
 
	call logMessagesToFile("Exit select query to get modified groups in PGOR")
 
	if(size(mod_prsnl_groups->qual,5) > 0)
		if (validate(debug_ind, 0) = 1)
			call echorecord(mod_prsnl_groups)
		else
			call echoxml(mod_prsnl_groups, LOG_FILE_STR, 1)
		endif
		for(x=1 to (size(mod_prsnl_groups->qual,5)))
			call GetPrsnlGroupOrgs(mod_prsnl_groups->qual[x]->prsnl_group_id)
 
			if(size(prsnl_group_orgs->organizations,5)>0)
				call ComparePgorWithQualRows(prsnl_group_orgs)
				call CompareQualRowsWithPgor(prsnl_group_orgs)
			else
				call DeleteGroupFromPgor(mod_prsnl_groups->qual[x]->prsnl_group_id)
			endif
		endfor
	endif
 
	; If the group not exist in PGOR but previously exists
	if(size(mod_prsnl_groups->qual,5) > 0)
		set stat = INITREC(mod_prsnl_groups)
	endif
 
 	call logMessagesToFile("Begin select query to get modified groups not in PGOR")
 
	SELECT into "nl:"
	FROM
		PRSNL_GROUP   PG
		, PRSNL_GROUP_RELTN   PGR
		, PRSNL   PR
 
	PLAN PG
		where PG.PRSNL_GROUP_CLASS_CD = DWL_PROVIDER_GROUP_CD
		and PG.active_ind = 1
		and PG.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and PG.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
		and PG.prsnl_group_id not in
			(select PGOR.prsnl_group_id
			from
				PRSNL_GROUP_ORG_RELTN PGOR
			where PGOR.prsnl_group_id = PG.prsnl_group_id)
	JOIN PGR
		where PGR.prsnl_group_id = PG.prsnl_group_id
		and PGR.active_ind = 1
		and PGR.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and PGR.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	JOIN PR
		where PR.person_id = PGR.person_id
		and PR.updt_dt_tm > CNVTDATETIME(last_updt_dt_tm)
		and PR.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and PR.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	order by PG.prsnl_group_id
	head report
		stat = alterlist(mod_prsnl_groups->qual, 20)
		group_idx = 0
	head PG.prsnl_group_id
		group_idx = group_idx+1
		if(group_idx > 20 and mod(group_idx,20) = 1)
	     	stat = alterlist(mod_prsnl_groups->qual, group_idx + 19)
	    endif
		mod_prsnl_groups->qual[group_idx]->prsnl_group_id = PG.prsnl_group_id
		mod_prsnl_groups->qual[group_idx]->prsnl_group_name = PG.prsnl_group_name
	foot report
		stat = alterlist(mod_prsnl_groups->qual, group_idx)
	with nocounter
 
	set ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
	   set failed = 1
	   set fail_operation = "Select modified groups by Activating/Inactiving providers of provider group not exists in PGOR"
	   call replyFailure("SELECT")
	endif
 
	call logMessagesToFile("Exit select query to get modified groups not exists in PGOR")
 
	if(size(mod_prsnl_groups->qual,5) > 0)
		if (validate(debug_ind, 0) = 1)
			call echorecord(mod_prsnl_groups)
		else
			call echoxml(mod_prsnl_groups, LOG_FILE_STR, 1)
		endif
		for(x=1 to (size(mod_prsnl_groups->qual,5)))
			call GetPrsnlGroupOrgs(mod_prsnl_groups->qual[x]->prsnl_group_id)
			if(size(prsnl_group_orgs->organizations,5)>0)
			call InsertGrpsAndOrgs(prsnl_group_orgs)
			endif
		endfor
	endif
 
	call logMessagesToFile(build2("Exit GetModGrpsByActiveOrInactivePrsnl(), Elapsed time:",
          cnvtint(curtime3-BEGIN_TIME), "0 ms"," GetModGrpsByActiveOrInactivePrsnl ",
          size(mod_prsnl_groups->qual,5)))
 
	call log_message(build2("Exit GetModGrpsByActiveOrInactivePrsnl(), Elapsed time:",
          cnvtint(curtime3-BEGIN_TIME), "0 ms"," GetModGrpsByActiveOrInactivePrsnl ",
          size(mod_prsnl_groups->qual,5)),LOG_LEVEL_DEBUG)
end
 
;when a new org is associated with a provider of existing group in prsnl_group_org_reltn table
subroutine GetModGrpsByAddOrgToPrsnl(null)
	call logMessagesToFile("Begin GetModGrpsByAddOrgToPrsnl()")
	call log_message("Begin GetModGrpsByAddOrgToPrsnl()",LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
 
	if(size(mod_prsnl_groups->qual,5) > 0)
		set stat = INITREC(mod_prsnl_groups)
	endif
 
	call logMessagesToFile("Begin select query to get modified groups exists in PGOR")
 
	SELECT into "nl:"
	FROM
		PRSNL_GROUP   PG
		, PRSNL_GROUP_RELTN   PGR
		, PRSNL   PR
		, PRSNL_ORG_RELTN   POR
		, ORGANIZATION   O
 
	PLAN PG
		where PG.PRSNL_GROUP_CLASS_CD = DWL_PROVIDER_GROUP_CD
		and PG.active_ind = 1
		and PG.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and PG.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
		and PG.prsnl_group_id in
			(select PGOR.prsnl_group_id
			from
				PRSNL_GROUP_ORG_RELTN PGOR
			where PGOR.prsnl_group_id = PG.prsnl_group_id)
	JOIN PGR
		where PGR.prsnl_group_id = PG.prsnl_group_id
		and PGR.active_ind = 1
		and PGR.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and PGR.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	JOIN PR
		where PR.person_id = PGR.person_id
		and PR.active_ind = 1
		and PR.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and PR.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	JOIN POR
		where POR.PERSON_ID = PR.person_id
		and POR.active_ind = 1
		and POR.updt_dt_tm > CNVTDATETIME(last_updt_dt_tm)
		and POR.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and POR.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	JOIN O
		where POR.organization_id = O.organization_id
		and O.active_ind = 1
		and O.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and O.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	ORDER BY
		PG.prsnl_group_id,POR.organization_id
	head report
			stat = alterlist(mod_prsnl_groups->qual, 20)
			group_idx = 0
	head PG.prsnl_group_id
		group_idx = group_idx+1
 
		if(group_idx > 20 and mod(group_idx,20) = 1)
	     	stat = alterlist(mod_prsnl_groups->qual, group_idx + 19)
	    endif
 
		mod_prsnl_groups->qual[group_idx]->prsnl_group_id = PG.prsnl_group_id
		mod_prsnl_groups->qual[group_idx]->prsnl_group_name = PG.prsnl_group_name
	foot report
		stat = alterlist(mod_prsnl_groups->qual, group_idx)
	with nocounter
 
	set ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
	   set failed = 1
	   set fail_operation = "Select modified groups by adding orgs to providers of provider group exist in PGOR"
	   call replyFailure("SELECT")
	endif
 
 	call logMessagesToFile("Exit select query to get modified groups exists in PGOR")
 
	;if any group has modified
	if(size(mod_prsnl_groups->qual,5) > 0)
		if (validate(debug_ind, 0) = 1)
			call echorecord(mod_prsnl_groups)
		else
			call echoxml(mod_prsnl_groups, LOG_FILE_STR, 1)
		endif
 
		for(x=1 to (size(mod_prsnl_groups->qual,5)))
			call GetPrsnlGroupOrgs(mod_prsnl_groups->qual[x]->prsnl_group_id)
 
			if(size(prsnl_group_orgs->organizations,5)>0)
				call CompareQualRowsWithPgor(prsnl_group_orgs)
			endif
		endfor
	endif
 
	; if the group not in PGOR, but previously exists
	if(size(mod_prsnl_groups->qual,5) > 0)
		set stat = INITREC(mod_prsnl_groups)
	endif
 
	call logMessagesToFile("Begin select query to get modified groups not exists in PGOR")
 
	SELECT into "nl:"
	FROM
		PRSNL_GROUP   PG
		, PRSNL_GROUP_RELTN   PGR
		, PRSNL   PR
		, PRSNL_ORG_RELTN   POR
		, ORGANIZATION   O
 
	PLAN PG
		where PG.PRSNL_GROUP_CLASS_CD = DWL_PROVIDER_GROUP_CD
		and PG.active_ind = 1
		and PG.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and PG.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
		and PG.prsnl_group_id not in
			(select PGOR.prsnl_group_id
			from
				PRSNL_GROUP_ORG_RELTN PGOR
			where PGOR.prsnl_group_id = PG.prsnl_group_id)
	JOIN PGR
		where PGR.prsnl_group_id = PG.prsnl_group_id
		and PGR.active_ind = 1
		and PGR.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and PGR.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	JOIN PR
		where PR.person_id = PGR.person_id
		and PR.active_ind = 1
		and PR.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and PR.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	JOIN POR
		where POR.person_id = PR.person_id
		and POR.active_ind = 1
		and POR.updt_dt_tm > CNVTDATETIME(last_updt_dt_tm)
		and POR.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and POR.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	JOIN O
		where POR.organization_id = O.organization_id
		and O.active_ind = 1
		and O.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and O.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	ORDER BY
		PG.prsnl_group_id,POR.organization_id
	head report
		stat = alterlist(mod_prsnl_groups->qual, 20)
		group_idx = 0
	head PG.prsnl_group_id
		group_idx = group_idx+1
 
		if(group_idx > 20 and mod(group_idx,20) = 1)
	     	stat = alterlist(mod_prsnl_groups->qual, group_idx + 19)
	    endif
 
		mod_prsnl_groups->qual[group_idx]->prsnl_group_id = PG.prsnl_group_id
		mod_prsnl_groups->qual[group_idx]->prsnl_group_name = PG.prsnl_group_name
	foot report
		stat = alterlist(mod_prsnl_groups->qual, group_idx)
	with nocounter
 
	set ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
	   set failed = 1
	   set fail_operation = "Select modified groups by adding orgs to providers of provider group not exists in PGOR "
	   call replyFailure("SELECT")
	endif
 
	call logMessagesToFile("Exit select query to get modified groups not exists in PGOR")
 
	;if any group has modified
	if(size(mod_prsnl_groups->qual,5) > 0)
		if (validate(debug_ind, 0) = 1)
			call echorecord(mod_prsnl_groups)
		else
			call echoxml(mod_prsnl_groups, LOG_FILE_STR, 1)
		endif
		for(x=1 to (size(mod_prsnl_groups->qual,5)))
			call GetPrsnlGroupOrgs(mod_prsnl_groups->qual[x]->prsnl_group_id)
			if(size(prsnl_group_orgs->organizations,5)>0)
				call InsertGrpsAndOrgs(prsnl_group_orgs)
			endif
		endfor
	endif
 
	call logMessagesToFile(build2("Exit GetModGrpsByAddOrgToPrsnl(), Elapsed time:",cnvtint(curtime3-BEGIN_TIME),
	 "0 ms"," GetModGrpsByAddOrgToPrsnl ",size(mod_prsnl_groups->qual,5)))
 
	call log_message(build2("Exit GetModGrpsByAddOrgToPrsnl(), Elapsed time:",cnvtint(curtime3-BEGIN_TIME),
	 "0 ms"," GetModGrpsByAddOrgToPrsnl ",size(mod_prsnl_groups->qual,5)),LOG_LEVEL_DEBUG)
end
 
;when a org is removed from a provider of existing group in prsnl_group_org_reltn table
subroutine GetModGrpsByRemoveOrgFromPrsnl(null)
	call logMessagesToFile("Begin GetModGrpsByRemoveOrgFromPrsnl()")
	call log_message("Begin GetModGrpsByRemoveOrgFromPrsnl()",LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
 
	if(size(mod_prsnl_groups->qual,5) > 0)
		set stat = INITREC(mod_prsnl_groups)
	endif
 
	call logMessagesToFile("Begin select query to get modified groups exists in PGOR")
 
	SELECT into "nl:"
	FROM
		PRSNL_GROUP   PG
		, PRSNL_GROUP_RELTN   PGR
		, PRSNL   PR
		, PRSNL_ORG_RELTN   POR
		, ORGANIZATION   O
 
	PLAN PG
		where PG.PRSNL_GROUP_CLASS_CD = DWL_PROVIDER_GROUP_CD
		and PG.active_ind = 1
		and PG.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and PG.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
		and PG.prsnl_group_id in
			(select PGOR.prsnl_group_id
			from
				PRSNL_GROUP_ORG_RELTN PGOR
			where PGOR.prsnl_group_id = PG.prsnl_group_id)
	JOIN PGR
		where PGR.prsnl_group_id = PG.prsnl_group_id
		and PGR.active_ind = 1
		and PGR.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and PGR.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	JOIN PR
		where PR.person_id = PGR.person_id
		and PR.active_ind = 1
		and PR.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and PR.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	JOIN POR
		where POR.PERSON_ID= PR.person_id
		and POR.active_ind = 1
		and POR.updt_dt_tm > CNVTDATETIME(last_updt_dt_tm)
		and POR.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and POR.end_effective_dt_tm = POR.updt_dt_tm
	JOIN O
		where O.organization_id = POR.organization_id
		and O.active_ind = 1
		and O.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and O.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	ORDER BY
		PG.prsnl_group_id,POR.organization_id
	head report
		stat = alterlist(mod_prsnl_groups->qual, 20)
		group_idx = 0
	head PG.prsnl_group_id
		group_idx = group_idx+1
 
		if(group_idx > 20 and mod(group_idx,20) = 1)
		   	stat = alterlist(mod_prsnl_groups->qual, group_idx + 19)
		endif
 
		mod_prsnl_groups->qual[group_idx]->prsnl_group_id = PG.prsnl_group_id
		mod_prsnl_groups->qual[group_idx]->prsnl_group_name = PG.prsnl_group_name
	foot report
		stat = alterlist(mod_prsnl_groups->qual, group_idx)
	with nocounter
 
	set ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
	   set failed = 1
	   set fail_operation = "Select modified groups by removing orgs from providers of provider group exist in PGOR"
	   call replyFailure("SELECT")
	endif
 
	call logMessagesToFile("Exit select query to get modified groups exists in PGOR")
 
	;if any group has modified
	if(size(mod_prsnl_groups->qual,5) > 0)
		if (validate(debug_ind, 0) = 1)
			call echorecord(mod_prsnl_groups)
		else
			call echoxml(mod_prsnl_groups, LOG_FILE_STR, 1)
		endif
		for(x=1 to (size(mod_prsnl_groups->qual,5)))
			call GetPrsnlGroupOrgs(mod_prsnl_groups->qual[x]->prsnl_group_id)
 
			if(size(prsnl_group_orgs->organizations,5)>0)
				call ComparePgorWithQualRows(prsnl_group_orgs)
			else
				call DeleteGroupFromPgor(mod_prsnl_groups->qual[x]->prsnl_group_id)
			endif
 
		endfor
	endif
 
	call logMessagesToFile(build2("Exit GetModGrpsByRemoveOrgFromPrsnl(), Elapsed time:",cnvtint(curtime3-BEGIN_TIME),
	 "0 ms"," GetModGrpsByRemoveOrgFromPrsnl ",size(mod_prsnl_groups->qual,5)))
 
	call log_message(build2("Exit GetModGrpsByRemoveOrgFromPrsnl(), Elapsed time:",cnvtint(curtime3-BEGIN_TIME),
	 "0 ms"," GetModGrpsByRemoveOrgFromPrsnl ",size(mod_prsnl_groups->qual,5)),LOG_LEVEL_DEBUG)
end
 
;retrieve groups when an associated org to a provider is no longer active
subroutine GetModGrpsByInActiveOrgs(null)
	call logMessagesToFile("Begin GetModGrpsByInActiveOrgs()")
	call log_message("Begin GetModGrpsByInActiveOrgs()",LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
 
	if(size(mod_prsnl_groups->qual,5) > 0)
		set stat = INITREC(mod_prsnl_groups)
	endif
 
	SELECT into "nl:"
	FROM
		PRSNL_GROUP   PG
		, PRSNL_GROUP_RELTN   PGR
		, PRSNL   PR
		, PRSNL_ORG_RELTN   POR
		, ORGANIZATION   O
 
	PLAN PG
		where PG.PRSNL_GROUP_CLASS_CD = DWL_PROVIDER_GROUP_CD
		and PG.active_ind = 1
		and PG.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and PG.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
		and PG.prsnl_group_id in
			(select PGOR.prsnl_group_id
			from
				PRSNL_GROUP_ORG_RELTN PGOR
			where PGOR.prsnl_group_id = PG.prsnl_group_id)
	JOIN PGR
		where PGR.prsnl_group_id = PG.prsnl_group_id
		and PGR.active_ind = 1
		and PGR.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and PGR.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	JOIN PR
		where PR.person_id = PGR.person_id
		and PR.active_ind = 1
		and PR.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and PR.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	JOIN POR
		where POR.PERSON_ID = PR.person_id
		and POR.active_ind = 1
		and POR.updt_dt_tm > CNVTDATETIME(last_updt_dt_tm)
		and POR.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and POR.end_effective_dt_tm > CNVTDATETIME(last_updt_dt_tm)
	JOIN O
		where POR.organization_id = O.organization_id
		and O.active_ind = 0
		and O.updt_dt_tm > CNVTDATETIME(last_updt_dt_tm)
		and O.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and O.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	ORDER BY
		PG.prsnl_group_id,POR.organization_id
	head report
		stat = alterlist(mod_prsnl_groups->qual, 20)
		group_idx = 0
	head PG.prsnl_group_id
		group_idx = group_idx+1
 
		if(group_idx > 20 and mod(group_idx,20) = 1)
	     	stat = alterlist(mod_prsnl_groups->qual, group_idx + 19)
	    endif
 
		mod_prsnl_groups->qual[group_idx]->prsnl_group_id = PG.prsnl_group_id
		mod_prsnl_groups->qual[group_idx]->prsnl_group_name = PG.prsnl_group_name
	foot report
		stat = alterlist(mod_prsnl_groups->qual, group_idx)
	with nocounter
 
	set ERRCODE = ERROR(ERRMSG,0)
	if(ERRCODE != 0)
	   set failed = 1
	   set fail_operation = "Select modified groups by Inactivating orgs of provider of provider group exist in PGOR"
	   call replyFailure("SELECT")
	endif
 
	if(size(mod_prsnl_groups->qual,5) > 0)
		if (validate(debug_ind, 0) = 1)
			call echorecord(mod_prsnl_groups)
		else
			call echoxml(mod_prsnl_groups, LOG_FILE_STR, 1)
		endif
		for(x=1 to (size(mod_prsnl_groups->qual,5)))
			call GetPrsnlGroupOrgs(mod_prsnl_groups->qual[x]->prsnl_group_id)
 
			if(size(prsnl_group_orgs->organizations,5)>0)
				call ComparePgorWithQualRows(prsnl_group_orgs)
			else
				call DeleteGroupFromPgor(mod_prsnl_groups->qual[x]->prsnl_group_id)
			endif
		endfor
	endif
 
	call logMessagesToFile(build2("Exit GetModGrpsByInActiveOrgs(), Elapsed time:",cnvtint(curtime3-BEGIN_TIME),
	 "0 ms"," GetModGrpsByInActiveOrgs ",size(mod_prsnl_groups->qual,5)))
 
	call log_message(build2("Exit GetModGrpsByInActiveOrgs(), Elapsed time:",cnvtint(curtime3-BEGIN_TIME),
	 "0 ms"," GetModGrpsByInActiveOrgs ",size(mod_prsnl_groups->qual,5)),LOG_LEVEL_DEBUG)
end
 
/*To find the rows which are in qualified rows retrieved from GetPrsnlGroupOrgs()
 but not in prsnl_group_org_reltn table, these rows has to be inserted into prsnl_group_org_reltn table*/
subroutine CompareQualRowsWithPgor(qual_grp_orgs)
	call logMessagesToFile("Begin CompareQualRowsWithPgor()")
	call log_message("Begin CompareQualRowsWithPgor()",LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
 
	if(size(insert_groups->organizations,5)>0)
		set stat = INITREC(insert_groups)
	endif
 
	if(size(qual_grp_orgs->organizations,5)>0)
		SELECT into "nl:"
			organization_id = qual_grp_orgs->organizations[d.seq]->organization_id
		FROM
			(dummyt d with seq = value(size(qual_grp_orgs->organizations,5))),
			PRSNL_GROUP_ORG_RELTN   PGOR
		plan d
		join PGOR
			where qual_grp_orgs->prsnl_group_id = PGOR.prsnl_group_id
			and qual_grp_orgs->organizations[d.seq]->organization_id not in
			(select PGOR1.organization_id
			 from PRSNL_GROUP_ORG_RELTN   PGOR1
			 where PGOR1.prsnl_group_id = qual_grp_orgs->prsnl_group_id
			 and PGOR1.organization_id = qual_grp_orgs->organizations[d.seq]->organization_id )
		head report
			org_idx = 0
	 		stat = alterlist(insert_groups->organizations, 100)
 
	 	head organization_id
			org_idx = org_idx + 1
 
			if(org_idx > 100 and mod(org_idx,100) = 1)
				stat = alterlist(insert_groups->organizations, org_idx+99)
			endif
 
	 		insert_groups->prsnl_group_id = PGOR.prsnl_group_id
	 		insert_groups->prsnl_group_name = qual_grp_orgs->prsnl_group_name
			insert_groups->organizations[org_idx]->organization_id = organization_id
 
		foot report
			stat = alterlist(insert_groups->organizations, org_idx)
		WITH NOCOUNTER
 
		set ERRCODE = ERROR(ERRMSG,0)
		if(ERRCODE != 0)
		   set failed = 1
		   set fail_operation = "Select rows has to be inserted"
		   call replyFailure("SELECT")
		endif
 
		if(size(insert_groups->organizations,5)>0)
			call InsertGrpsAndOrgs(insert_groups)
		endif
	endif
 
	call logMessagesToFile(build2("Exit CompareQualRowsWithPgor(), Elapsed time:",cnvtint(curtime3-BEGIN_TIME),
	 "0 ms"," RowshasToBeInserted ",size(insert_groups->organizations,5)))
 
	call log_message(build2("Exit CompareQualRowsWithPgor(), Elapsed time:",cnvtint(curtime3-BEGIN_TIME),
	 "0 ms"," RowshasToBeInserted ",size(insert_groups->organizations,5)),LOG_LEVEL_DEBUG)
end
 
/*to find the rows which are in prsnl_group_org_reltn table but not in qualified rows retrieved
from GetPrsnlGroupOrgs(), these rows has to be removed from prsnl_group_org_reltn table */
subroutine ComparePgorWithQualRows(qual_grp_orgs)
	call logMessagesToFile("Begin ComparePgorWithQualRows()")
	call log_message("Begin ComparePgorWithQualRows()",LOG_LEVEL_DEBUG)
	declare BEGIN_TIME = f8 with constant(curtime3), private
	declare expCnt 	= i4
 
	if(size(delete_groups->organizations,5)>0)
		set stat = INITREC(delete_groups)
	endif
 
	if(size(qual_grp_orgs->organizations,5)>0)
		SELECT into "nl:"
		FROM
			PRSNL_GROUP_ORG_RELTN   PGOR,
			PRSNL_GROUP PG
 
		PLAN PG
			where PG.prsnl_group_class_cd = DWL_PROVIDER_GROUP_CD
			and PG.prsnl_group_id = qual_grp_orgs->prsnl_group_id
			and PG.active_ind = 1
			and PG.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			and PG.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
		join PGOR
			where PG.prsnl_group_id = PGOR.prsnl_group_id
 
		order by PGOR.prsnl_group_id,PGOR.organization_id
		head report
			org_idx = 0
	 		stat = alterlist(delete_groups->organizations, 100)
	 	head PGOR.organization_id
	 		delete_groups->prsnl_group_id = PGOR.prsnl_group_id
	 		delete_groups->prsnl_group_name = PG.prsnl_group_name
 
	 		pos1 = locatevalsort(expCnt, 1, size(qual_grp_orgs->organizations,5),PGOR.organization_id,\
			qual_grp_orgs->organizations[expCnt].organization_id)
 
			if(pos1 <= 0)
				org_idx = org_idx + 1
 
				if(org_idx > 100 and mod(org_idx,100) = 1)
					stat = alterlist(delete_groups->organizations, org_idx+99)
				endif
 
				delete_groups->organizations[org_idx]->organization_id = PGOR.organization_id
			endif
		foot report
			stat = alterlist(delete_groups->organizations, org_idx)
		with nocounter
 
		set ERRCODE = ERROR(ERRMSG,0)
		if(ERRCODE != 0)
		   set failed = 1
		   set fail_operation = "Select rows has to be deleted"
		   call replyFailure("SELECT")
		endif
 
		if(size(delete_groups->organizations,5)>0)
			call DeleteOrgsAndGroups(delete_groups)
		endif
	endif
 
	call logMessagesToFile(build2("Exit ComparePgorWithQualRows(), Elapsed time:",cnvtint(curtime3-BEGIN_TIME),
	 "0 ms"," RowshasToBeDeleted ",size(delete_groups->organizations,5)))
 
	call log_message(build2("Exit ComparePgorWithQualRows(), Elapsed time:",cnvtint(curtime3-BEGIN_TIME),
	 "0 ms"," RowshasToBeDeleted ",size(delete_groups->organizations,5)),LOG_LEVEL_DEBUG)
end
 
subroutine replyFailure(targetObjName)
	 call logMessagesToFile("In replyFailure()")
     call log_message("In replyFailure()",LOG_LEVEL_DEBUG)
     declare BEGIN_TIME = f8 with constant(curtime3), private
 
     call log_message(build2("Error: ", targetObjName, " - ", trim(ERRMSG)),LOG_LEVEL_DEBUG)
	 call logMessagesToFile(build2("Error: ", targetObjName, " - ", trim(ERRMSG)))
 
     rollback
     set reply->status_data.status = "F"
     set reply->status_data.subeventstatus[1].OperationName = fail_operation
     set reply->status_data.subeventstatus[1].OperationStatus = "F"
     set reply->status_data.subeventstatus[1].TargetObjectName = targetObjName
     set reply->status_data.subeventstatus[1].TargetObjectValue = ERRMSG
 
     call logMessagesToFile(build2("Exit replyFailure(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"))
 
     call log_message(build2("Exit replyFailure(), Elapsed time:",
     cnvtint(curtime3-BEGIN_TIME), "0 ms"),LOG_LEVEL_DEBUG)
 
     go to exit_script
end
 
subroutine logMessagesToFile(_msg)
	set log_msg->msg_cnt = log_msg->msg_cnt + 1
	set stat = alterlist(log_msg->messages, log_msg->msg_cnt)
	set log_msg->messages[log_msg->msg_cnt].info = _msg
end
 
subroutine logSummaryMsgToFile(_msg)
	set summary_log_msg->msg_cnt = summary_log_msg->msg_cnt + 1
	set stat = alterlist(summary_log_msg->messages, summary_log_msg->msg_cnt)
	set summary_log_msg->messages[summary_log_msg->msg_cnt].info = _msg
end
 
/**************************************************************
; Exit Script
**************************************************************/
#exit_script
 
if (reply->status_data->status = "Z")
	set reply->status_data->status = "S"
	commit
	set reply->ops_event = build(LOG_FILE_STR, " file exported with success")
else
	set reply->ops_event = build(LOG_FILE_STR, " file exported with failure")
endif
 
call logMessagesToFile(build2("ScriptComplete, Elapsed time:",cnvtint(curtime3-SCRIPT_BEGIN_TIME), "0 ms"))
 
if (validate(debug_ind, 0) = 1)
  call echorecord(log_msg)
  call echorecord(summary_log_msg)
  call echorecord(reply)
else
  call echoxml(log_msg, LOG_FILE_STR, 1)
  call echoxml(summary_log_msg, LOG_FILE_STR, 1)
  call echoxml(reply, LOG_FILE_STR, 1)
endif
 
end
go
 