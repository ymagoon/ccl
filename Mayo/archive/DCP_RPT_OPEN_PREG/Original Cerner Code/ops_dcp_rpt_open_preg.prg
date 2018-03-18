/****************************************************************************************
  *                                                                                     *
  *  Copyright Notice:  (c) 1983 Laboratory Information Systems &                       *
  *                              Technology, Inc.                                       *
  *       Revision      (c) 1984-2014 Cerner Corporation                                *
  *                                                                                     *
  *  Cerner (R) Proprietary Rights Notice:  All rights reserved.                        *
  *  This material contains the valuable properties and trade secrets of                *
  *  Cerner Corporation of Kansas City, Missouri, United States of                      *
  *  America (Cerner), embodying substantial creative efforts and                       *
  *  confidential information, ideas and expressions, no part of which                  *
  *  may be reproduced or transmitted in any form or by any means, or                   *
  *  retained in any storage or retrieval system without the express                    *
  *  written permission of Cerner.                                                      *
  *                                                                                     *
  *  Cerner is a registered mark of Cerner Corporation.                                 *
  *                                                                                     *
  ***************************************************************************************/
/****************************************************************************************
 
        Source file name:           ops_dcp_rpt_open_preg.prg
        Object name:                ops_dcp_rpt_open_preg
 
        Product:                    Innovations MPages
        Product Team:               Innovations Development
 
        Program purpose:            EXECUTE dcp_rpt_open_preg script from Ops Job.
 
        Tables read:                n/a
 
        Tables updated:             n/a
 
        Executing from:             OpsViewSchdeduler.exe
 
        Special Notes:              This is an Ops Job that will execute dcp_rpt_open_preg.prg
                                    Prompts to be passed to DCP_RPT_OPEN_PREG.PRG
                                    (1)  "Output to File/Printer/MINE"     ; MINE or PRINTER or FILE NAME.
                                    (2)  "Query type"                      ; ALWAYS EGA [1]
                                    (3)  "Operator"                        ; ALWAYS greater than [2]
                                    (4)  "Start gestational age (weeks)"   ; ALWAYS [49]
                                    (5)  "End gestational age (weeks)"     ; NOT USED use default [45]
                                    (6)  "Start date"                      ; NOT USED use [curdate]
                                    (7)  "End date"                        ; NOT USED use [curdate]
                                    (8)  "Organization"                    ; LIST OF ORGS [see query below]
                                    (9)  "Search type"                     ; ALWAYS PHYSICIAN [1]
                                    (10) "Enter physician last name"       ; ALWAYS [*]
                                    (11) "Physician"                       ; ALWAYS Any(*) [0]
 
                                    For PROMPT #8 "Organization" use the following query to get list of ORGANIZATION_ID:
                                    ------------------------------------------------------------------------------------
                                      select l.organization_id, org_name = cnvtupper(o.org_name)
                                      from location l, organization o, code_value cv
                                      plan cv where cv.code_set       = 220
                                                and cv.cdf_meaning    = "FACILITY"
                                      join  l where l.location_cd     = cv.code_value
                                                and l.active_ind      = 1
                                      join  o where o.organization_id = l.organization_id
                                                and o.active_ind      = 1
                                      order by org_name go
 
                                    * EXAMPLE FOR REGION = "SWMN"
                                      ORGANIZATION_ID		ORG_NAME
                                      ---------------		--------
                                      3894816.00			FA FAIRMONT - CLINIC
                                      3894855.00			MA LAKE CRYSTAL
                                      3894853.00			MA LE SUEUR
                                      3894848.00			MA MANKATO - EASTRIDGE
                                      3894850.00			MA MANKATO - NORTHRIDGE
                                      3894849.00			MA MANKATO - SPECIALTY CLINIC
                                      6042729.00			MA NEW PRAGUE - BELLE PLAINE CLINIC
                                      6042722.00			MA NEW PRAGUE - CLINIC
                                      6042724.00			MA NEW PRAGUE - MONTGOMERY CLINIC
                                      6043759.00			MA NEW PRAGUE - WOMEN'S HEALTH CENTER
                                      3894856.00			MA SPRINGFIELD - CLINIC
                                      5497505.00			MA ST. JAMES - CLINIC
                                      3894851.00			MA ST. PETER
                                      3894859.00			MA WASECA - CLINIC
                                      3894860.00			MA WASECA - HOSPITAL
                                      3894862.00			MA WASECA - JANESVILLE CLINIC
                                      3894861.00			MA WASECA - WATERVILLE CLINIC
 
/****************************************************************************************
*****************************************************************************************
*                           GENERATED MODIFICATION CONTROL LOG                          *
*****************************************************************************************
* Mod   Date      Feature  Engineer         Comment                                     *
* ----  --------  -------  ---------------  ------------------------------------------- *
* 0000  04/10/14  ######   Innovation Dev   Initial release                             *
*                                                                                       *
*****************************************************************************************
*******************************  END OF ALL MODCONTROL BLOCKS  *************************/
 
drop program ops_dcp_rpt_open_preg:group1 go
create program ops_dcp_rpt_open_preg:group1
 
prompt
    "Output to File/Printer/MINE" = "MINE"               ;* Enter or select the printer or file name to send this report to.
    , "Custom File Name"          = "OPS_RPT_OPEN_PREG"  ;* Custom filname prefix for unique file to save on backend
    , "Region"                    = "SWMN"               ;* Region to find org location code values
with OUTDEV,CFM,REGION
 
call echo("BEGIN: execute script - OPS_DCP_RPT_OPEN_PREG.PRG")
declare _DIOTYPE   = i2 with noconstant(8),protect
declare bIsPrinter = i2 with noconstant(0),private
 
execute cpm_create_file_name $CFM,"PS"
if ($REGION = "SWMN")
  execute dcp_rpt_open_preg cpm_cfn_info->file_name_path,1,2,^49^,^45^,^curdate^,^curdate^,
                            value(3894816.00,3894855.00,3894853.00,3894848.00,3894850.00,3894849.00,
                                  6042729.00,6042722.00,6042724.00,6043759.00,3894856.00,5497505.00,
                                  3894851.00,3894859.00,3894860.00,3894862.00,3894861.00),1,^*^,0
endif
 
/****************************************************************************************/
/* Use the contents below for each region to be set up. CHANGE THE FOLLOWING:           */
/* CHANGE the region to the expected value from the ops job set up ("SWMN","NWWI",...)  */
/* in the 8th paramenter, REPLACE <enter comma separated list of org_id for the region> */
/* with the ORGANIZATION_IDs found in the query in the special notes section.           */
/****************************************************************************************/
;if ($REGION = "????")
;  call echo("Please enter more regions in this else clause, currently 'SWMM' is the only region supported.")
;  execute dcp_rpt_open_preg cpm_cfn_info->file_name_path,1,2,^49^,^45^,^curdate^,^curdate^,
;                            value(<enter comma separated list of org_id for the region>),1,^*^,0
;endif
 
set bIsPrinter = CheckQueue($OUTDEV)
if(bIsPrinter)
  call echo(build("** PRINTING FILE [",cpm_cfn_info->file_name_full_path,"]"))
  set spool value(cpm_cfn_info->file_name_path) value($OUTDEV) with DIO=value(_DIOTYPE)
endif
 
call echo("END: execute script - OPS_DCP_RPT_OPEN_PREG.PRG")
 
end
go
