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
 
        Source file name:   mp_dcp_rdm_upd_pgor_p.prg
        Object name:        mp_dcp_rdm_upd_pgor_p
        Request #:          N/A
 
        Product:            Database Architecture
        Product Team:       Database Architecture -- Access
        HNA Version:        500
        CCL Version:        8.0
 
        Program purpose:    The parent script (P) of mp_dcp_rdm_upd_pgor_c,the CAT2 readme, It will 
                            divide PRSNL_GROUP table into 7 roughly equal sections to allow inserts
                            for a readme to execute concurrently.
       
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
;     001                               Initial Release                     *
;                                                                           *
;~DE~************************************************************************
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************

;change 1
; Find an appropriate name for the parent script
; Your team probably has standards for naming readme's
; DAR recommends naming these with a _p, _c, and _cc at the end to show the parent, child, and child_c script 
drop program   mp_dcp_rdm_upd_pgor_p:dba  go
create program mp_dcp_rdm_upd_pgor_p:dba 

%i cclsource:dm_readme_data.inc
%i cclsource:dm_run_parallel_p.inc

;NOTES:
; Any time in this process if PL/SQL funtions or procedures are used, internationalization
; needs to be taken into account.  CCL handles internationalization but when we get to 
; straight Oracle, internationalization will not be handled.

; Set default status
set readme_data->status = 'F'
set readme_data->message = concat('FAILED STARTING README ', cnvtstring( readme_data->readme_id))

declare mf_max_range_id     = f8 with protect, noconstant(0.0)
declare ms_info_domain_nm   = vc with protect, noconstant("")
declare mf_min_range_id     = f8 with protect, noconstant(0.0)
declare ms_range_prefix     = vc with protect, noconstant("")
declare ms_errMsg           = vc with protect, noconstant("")

declare mf_prsnl_group_cd   = f8 with protect, noconstant(0.0)
declare mn_prsnl_group_code_set= i4 with protect, constant(19189)
declare ms_dwl_group_cdf_meaning = vc with protect, constant("AMBCAREGRP")

; Set the default variables here based on the comments

;change 2
; This variable will store a name for the readme process.  This name will be associated
; with all the rows on dm_info that store the ranges.
; Before choosing a domain name the dm_info table should be checked to be sure this name has not 
; been used before.  Use a unique name so it won't be an issue in the future.
set ms_info_domain_nm = "MP_DCP_RDM_UPD_PGOR"

;change 3
; This next variable will store the prefix that prepend all child ranges' names
set ms_range_prefix = "MAX PRSNL_GROUP_ID RANGE"

;change 4
; Set the number of children that are within this readme set
set mn_num_children = 7

;change 6
; This select to find the maximum id that will be broken
; into mn_num_children seperate values.  Follow this sample query only change
; to the table and column you want to break into ranges.

; Note: only the primary key of a table should be used to divide the table into ranges
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

if(mf_prsnl_group_cd > 0.0)
	select into "nl:"
		max_val = max(pg.prsnl_group_id),
		min_val = min(pg.prsnl_group_id)
	from prsnl_group pg
	where PG.PRSNL_GROUP_CLASS_CD = mf_prsnl_group_cd and pg.prsnl_group_id != 0.0  
	detail
		mf_max_range_id = cnvtreal(max_val)
		mf_min_range_id = maxval(cnvtreal(min_val),1) 
	with nocounter
	; If there are any errors exit out
	if (error(ms_errMsg, 0) != 0)
		set readme_data->status = 'F'
		set readme_data->message = concat('Error selecting the max ID: ', ms_errMsg)
		go to EXIT_PROGRAM
	endif
endif

; Run logic for parent to subdivide the rows and insert the ranges into DM_INFO
if(sbr_run_parent(mf_max_range_id, mf_min_range_id, ms_range_prefix, ms_info_domain_nm, mn_num_children) IN (2, 0))
	go to EXIT_PROGRAM
endif

set readme_data->status = "S"
set readme_data->message = "Readme completed successfully"

#EXIT_PROGRAM
; Defined in dm_parallel_oragen.inc
free record parallel_oragen3
; Defined in dm_run_parallel_parent.inc
free record range_info

execute dm_readme_status
call echorecord(readme_data)

end
go
