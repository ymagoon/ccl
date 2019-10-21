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
 
        Source file name:   mp_dcp_rdm_upd_pgor_c.prg
        Object name:        mp_dcp_rdm_upd_pgor_c
        Request #:          N/A
 
        Product:            Database Architecture
        Product Team:       Database Architecture -- Access
        HNA Version:        500
        CCL Version:        8.0
 
        Program purpose:    This is a child script to insert rows to a PRSNL_GROUP_ORG_RELTN 
        					table concurrently along with six other readmes.  
        					This will grab a range of data and insert based on this range.         					 
 
        Tables read:        PRSNL_GROUP, PRSNL_GROUP_RELTN, PRSNL,PRSNL_ORG_RELTN, ORGANIZATION
 
        Tables updated:     PRSNL_GROUP_ORG_RELTN
 
        Executing from:     Readme ####
 
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
;    *Mod Date     Engineer             Comment                             *
;    *--- -------- -------------------- ----------------------------------- *
;     01                                                                    *
;                                                                           *
;~DE~************************************************************************
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************


;change 1
; Find an appropriate child name for the script
; Your team probably has standards for naming readme's
drop program   mp_dcp_rdm_upd_pgor_c:dba go
create program mp_dcp_rdm_upd_pgor_c:dba

%i cclsource:dm_readme_data.inc
%i cclsource:dm_run_parallel_c.inc

set readme_data->status = 'F'
set readme_data->message = concat('FAILED STARTING README ', cnvtstring( readme_data->readme_id))

; Declare variables
declare ms_child_info_domain_nm = vc with protect, noconstant("")
declare ms_range_prefix			= vc with protect, noconstant("")
declare ms_child_max_name       = vc with protect, noconstant("")
declare ms_child_script			= vc with protect, noconstant("")

declare ms_errMsg           = vc with protect, noconstant("")
declare mf_prsnl_group_cd   = f8 with protect, noconstant(0.0)
declare mn_prsnl_group_code_set= i4 with protect, constant(19189)
declare ms_dwl_group_cdf_meaning = vc with protect, constant("AMBCAREGRP")

;Set the default variables here based on the comments
;change 2
; This variable will store a name for the readme process.  This name will be associated
; with all the rows on dm_info that store the default ranges
; NOTE:  THIS MUST MATCH THE NAME IN MS_INFO_DOMAIN_NM FROM THE PARENT SCRIPT OR THIS WILL NOT WORK
set ms_child_info_domain_nm = "MP_DCP_RDM_UPD_PGOR"

;change 3
; This variable will store the prefix attached to the range names
; NOTE:  THIS MUST MATCH THE NAME IN MS_RANGE_PREFIX FROM THE PARENT SCRIPT OR THIS WILL NOT WORK
set ms_range_prefix = "MAX PRSNL_GROUP_ID RANGE"

;change 4
; mf_child_max_name will have the maximum row reviewed on the dm_info table
; If the id you are breaking into ranges is person_id, this would be named
; MAX PERSON_ID EVALUATED
; NOTE:  THIS MUST MATCH THE NAME IN MS_MAX_NAME FROM THE PARENT SCRIPT OR THIS WILL NOT WORK
set ms_child_max_name = "MAX PRSNL_GROUP_ID EVALUATED"

;change 5
; ms_child_script will store the name of the script (like "pm_rdm_address_type_cc")
set ms_child_script = "mp_dcp_rdm_upd_pgor_cc"

;Query to get the code value of Dynamic Worklist provider group
select into "nl:"
from
	code_value   cv1
where cv1.code_set = mn_prsnl_group_code_set
  and cv1.active_ind = 1
  and cv1.cdf_meaning = ms_dwl_group_cdf_meaning
detail
     mf_prsnl_group_cd = cv1.code_value
with nocounter

; If there are any errors exit out
if (error(ms_errMsg, 0) != 0)
	set readme_data->status = 'F'
	set readme_data->message = concat('Error selecting code value of Dynamic Worklist provider group: ', ms_errMsg)
	go to EXIT_PROGRAM
endif

; Claim a range to work on
if(sbr_claim_min_max_row(ms_child_info_domain_nm, ms_range_prefix, ms_child_max_name) IN (2, 0))
	go to EXIT_PROGRAM
endif

; Fetch the minimum and maximum ID to be used
if(sbr_fetch_min_max(ms_child_info_domain_nm, ms_range_prefix, ms_child_max_name, mf_max_range_id, mf_min_range_id) IN (2, 0))
	go to EXIT_PROGRAM
endif

; Run the child script to do the work
; If there was either an error, exit to the end of the script
if(sbr_run_child(ms_child_info_domain_nm, ms_range_prefix, ms_child_max_name, ms_child_script, 
									mf_max_range_id, mf_min_range_id) IN (2, 0))
	go to EXIT_PROGRAM
endif

set readme_data->status = "S"
set readme_data->message = "Readme completed all work successfully"

#EXIT_PROGRAM

;if the readme was not successful rollback
if (readme_data->status = 'F')
    rollback
endif

execute dm_readme_status
call echorecord(readme_data)

end go