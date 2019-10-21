/*~BB~************************************************************************
  *                                                                      *
  *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
  *                              Technology, Inc.                        *
  *       Revision      (c) 1984-2005 Cerner Corporation                 *
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
 
        Source file name:   mp_dcp_rdm_upd_pgor_cc.prg
        Object name:        mp_dcp_rdm_upd_pgor_cc
        Request #:          N/A
 
        Product:            Database Architecture
        Product Team:       Data Access Review
        HNA Version:        500
        CCL Version:        8.0
 
        Program purpose:    This will actually perform the insert or update using a range of 
                            data.  
 
        Tables read:        PRSNL_GROUP, PRSNL_GROUP_RELTN, PRSNL,PRSNL_ORG_RELTN, ORGANIZATION
 
        Tables updated:     PRSNL_GROUP_ORG_RELTN
 
        Executing from:     mp_dcp_rdm_upd_pgor_c
 
        Special Notes:      

        Legend:             Variables should be prefixed with scope and type,
                            followed by an underscore and deobjective variable name.

                            Variable Scope Abbreviations    Variable Type Abbreviations
                            p - private                     n - i2
                            m - protect                     l - i2
                            g - public                      f - f8
                            u - persistobject               d - dq8
                                                            s - vc
                                                            c - c

                            Examples:
                            pn_status_ind = private, i2
                            gf_number     = public, f8

******************************************************************************/
;~DB~************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG              *
;    ************************************************************************
;    *                                                                      *
;    *Mod Date     Engineer      Comment                                    *
;    *--- -------- ------------- ------------------------------------------ *
;     001                                                                   *
;                                                                           *
;~DE~************************************************************************
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************

;change 1
;find an appropriate child_c name for the script
;your team probably has standards for naming readme's
drop program  mp_dcp_rdm_upd_pgor_cc:dba go
create program mp_dcp_rdm_upd_pgor_cc:dba

%i cclsource:dm_readme_data.inc
%i cclsource:dm_run_parallel_cc.inc

;declare variables 
declare mf_min_id = f8 with protect, noconstant(0.0)
declare mf_max_id = f8 with protect, noconstant(0.0)
declare ms_child_c_info_domain_nm = vc with protect, noconstant("")
declare ms_child_c_max_name       = vc with protect, noconstant("")

free record prsnl_group_orgs
record prsnl_group_orgs
(
	1 prsnlGroups[*]
		2 prsnl_group_id = f8
		2 organizations[*]
			3 organization_id = f8
)

;change 2
;this variable will store a name for the readme process.  This name will be associated
;with all the rows on dm_info that store the default ranges
;NOTE:  THIS MUST MATCH THE NAME DEFINED IN MS_INFO_DOMAIN_NM IN THE PARENT SCRIPT OR THIS WILL NOT WORK
set ms_child_c_info_domain_nm = "MP_DCP_RDM_UPD_PGOR"

;change 3
;mf_child_max_name will have the maximum row reviewed on the dm_info table
;if the id you are breaking into ranges is person_id, this would be named
;MAX PERSON_ID EVALUATED
;NOTE:  THIS MUST MATCH THE NAME IN MS_MAX_NAME FROM THE PARENT SCRIPT OR THIS WILL NOT WORK
set ms_child_c_max_name = "MAX PRSNL_GROUP_ID EVALUATED"

;set our parameters that were passed in
call sbr_get_min_max(mf_min_id, mf_max_id)

;change 4
;update the statement to keep the user
;updated on the readme
call echo("Processing...")
call echo("Inserting records on PRSNL_GROUP_ORG_RELTN table....")

/*
  Optional comment block. If the code uses call parser to pass Oracle statements
  the oracle statement should be in a comment block properly formatted.  This statement also needs
  to have the approriate query tag in it.
*/

;change 5  
;This is where your insert or update would take place.  Be sure
;to use the id ranges passed in
;perform the insert
; Query to retrieve prsnl groups and it's related organizations
 	if(mf_prsnl_group_cd > 0.0)
	select into "nl:"
		FROM  PRSNL_GROUP PG,
			  PRSNL_GROUP_RELTN PGR,
			  PRSNL PR,
			  PRSNL_ORG_RELTN POR,
			  ORGANIZATION O 
		PLAN PG
			 where PG.PRSNL_GROUP_CLASS_CD = mf_prsnl_group_cd
			 and PG.PRSNL_GROUP_ID >= mf_min_id and PG.PRSNL_GROUP_ID <= mf_max_id
			 and PG.active_ind =1
			 and PG.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			 and PG.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3) 
		JOIN PGR
			 where PG.PRSNL_GROUP_ID=PGR.PRSNL_GROUP_ID
			 and PGR.active_ind =1
			 and PGR.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			 and PGR.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 			JOIN PR
 				 where PGR.person_id = PR.person_id
			 and PR.active_ind =1
			 and PR.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
			 and PR.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3) 
		JOIN POR
			 where POR.PERSON_ID=PR.PERSON_ID
			 and POR.active_ind =1
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
			stat = alterlist(prsnl_group_orgs->prsnlGroups, 20)
			groupIdx = 0
		head PG.prsnl_group_id
			groupIdx = groupIdx+1					
			if(groupIdx > 20 and mod(groupIdx,20) = 1)
     				stat = alterlist(prsnl_group_orgs->prsnlGroups, groupIdx + 19)
     			endif
     			
 				prsnl_group_orgs->prsnlGroups[groupIdx]->prsnl_group_id = PG.prsnl_group_id
 				
 				orgIdx = 0
 				stat = alterlist(prsnl_group_orgs->prsnlGroups[groupIdx]->organizations, 100)
 					 		
 		head POR.organization_id
			orgIdx = orgIdx + 1 
			if(orgIdx > 100 and mod(orgIdx,100) = 1)
				stat = alterlist(prsnl_group_orgs->prsnlGroups[groupIdx]->organizations, orgIdx+99)
			endif
 
			prsnl_group_orgs->prsnlGroups[groupIdx]->organizations[orgIdx]->organization_id = POR.organization_id
			
		foot PG.prsnl_group_id							
			stat = alterlist(prsnl_group_orgs->prsnlGroups[groupIdx]->organizations, orgIdx)			
							
		foot report				
			stat = alterlist(prsnl_group_orgs->prsnlGroups, groupIdx) 			
		with nocounter
		; If there are any errors exit out
		if(sbr_handle_cc_error(NULL) = 0)
			go to EXIT_PROGRAM
		endif
endif

;Query to insert prsnl groups and it's related organizations to PRSNL_GROUP_ORG_RELTN table
INSERT INTO
	PRSNL_GROUP_ORG_RELTN PGOR,
	(dummyt d with seq = VALUE(size(prsnl_group_orgs->prsnlGroups,5))),
	(dummyt d1 with seq = 1)
set
	PGOR.PRSNL_GROUP_ORG_RELTN_ID = seq(PRSNL_SEQ, nextval),
	PGOR.PRSNL_GROUP_ID = prsnl_group_orgs->prsnlGroups[d.seq]->prsnl_group_id,
	PGOR.ORGANIZATION_ID = prsnl_group_orgs->prsnlGroups[d.seq]->organizations[d1.seq]->organization_id,
	PGOR.updt_id = reqinfo->updt_id,
   	PGOR.updt_dt_tm = cnvtdatetime(curdate, curtime3),
   	PGOR.updt_task = reqinfo->updt_task,
   	PGOR.updt_applctx = reqinfo->updt_applctx,
   	PGOR.updt_cnt = 0
plan d where maxrec(d1,size(prsnl_group_orgs->prsnlGroups[d.seq]->organizations,5))
join d1
join PGOR
with nocounter

; Check for any possible errors   
if(sbr_handle_cc_error(NULL) = 0)
	go to EXIT_PROGRAM
endif

call echo("Processing...Completed")
  
; Update the DM_INFO row indicating the highest ID evaluated by this readme script
if(sbr_upd_id_evaluated(mf_max_id, ms_child_c_info_domain_nm, ms_child_c_max_name) = 0)
	go to EXIT_PROGRAM
endif

#EXIT_PROGRAM
 
end
go