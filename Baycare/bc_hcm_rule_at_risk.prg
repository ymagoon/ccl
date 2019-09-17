/*************************************************************************
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
  ************************************************************************/
/*************************************************************************
        Source file name:       hcm_rule_at_risk.prg
        Object name:            hcm_rule_at_risk
        Product:                HealtheCare
        Product Team:           HealtheCare Management
        Program purpose:        Identify if a patient is at risk by defining at risk plans and calling hcm_get_at_risk_indicator
                                to determine if the patient has an at risk health plan
        Tables read:            None
        Tables updated:         None
        Executing from:         Custom Discern Module (hcm_check_at_risk_ind)
        Special Notes:          None
        Testing:
          m30 person_id = 27712528 (demographics 1, patinfo)
          m30 demographics_test_uri = 
              "https://test.record.healtheintent.com/mock_api/populations/ab9176be-4303-4e6c-aa8d-219d31e29d76/people/1"
/**************************************************************************************
***********************************************************************************
*                    GENERATED MODIFICATION CONTROL LOG                           *
***********************************************************************************
*                                                                                 *
* Mod Date     Engineer             Comment                                       *
* --- -------- -------------------- ----------------------------------------------*
* 000 03/22/16 Doyle Timberlake     HICAREDEV-1439: Initial release               *
* 001 08/27/16 Erin Marston		    Pull beg_iso_dt_tm for plan		              *
* 002 09/12/19 Yitzhak Magoon		Pull most recent at risk health plan and make *
*									performance updates         				  *
* 
***********************************************************************************
*******************************  END OF ALL MODCONTROL BLOCKS  ***********************/

drop program bc_hcm_rule_at_risk go
create program bc_hcm_rule_at_risk
prompt
  "Output to File/Printer/MINE" = "MINE"
  , "Demographics Test URI" = ""
with OUTDEV, PATIENT_DEMOGRAPHICS_TEST_URI
/*************************************************************************
* Record Structures                                                      *
*************************************************************************/
record hcm_get_at_risk_indicator_req
(
1 person_id = f8
1 source_type = vc
1 demographics_test_uri = vc
1 health_plans[*]
  2 plan_name = vc
  2 plan_identifiers[*]
    3 value = vc
    3 type = vc
)
record hcm_get_at_risk_indicator_rep
(
1 person_id = f8
1 at_risk_ind = i2
1 health_plans[*]
  2 plan_name = vc
  2 begin_iso_dt_tm = vc	;001
  2 end_iso_dt_tm = vc	;001
  2 plan_identifiers[*]
    3 value = vc
    3 type = vc
%i cclsource:status_block.inc
)
/**************************************************************
; DVDev DECLARED VARIABLES
**************************************************************/
/* Variables available to this program defined by the EKS structure (DiscernDev)
   trigger_personid (f8): The person_id from the triggering request structure
   trigger_encntrid (f8): The encntr_id from the triggering request structure
   trigger_accessionid (f8): The accession_id from the triggering request structure
   trigger_orderid (f8): The order_id from the triggering request structure
   event_repeat_index       = i4  ---> The index into the list of the current element being checked.
   link_accessionid         = f8  ---> The accession_id from the linked Logic Template.
   link_orderid             = f8  ---> The order_id from the linked Logic Template.
   link_encntrid            = f8  ---> The encntr_id from the linked Logic Template.
   link_personid            = f8  ---> The person_id from the linked Logic Template.
   link_taskassaycd         = f8  ---> The task_assay_cd from the linked Logic Template.
   link_clineventid         = f8  ---> The clinical_event_id from the linked Logic Template.
   log_accessionid          = f8  ---> The accession_id identified by this template, if applicable.
   log_orderid              = f8  ---> The order_id identified by this template, if applicable.
   log_encntrid             = f8  ---> The encntr_id identified by this template, if applicable.
   log_personid             = f8  ---> The person_id identified by this template, if applicable.
   log_taskassaycd          = f8  ---> The task_assay_cd identified by this template, if applicable.
   log_clineventid          = f8  ---> The clinical_event_id identified by this template, if applicable.
   log_message              = vc  ---> Message that will appear in EKS_MONITOR for this template.
   log_misc1                = vc  ---> This will store the result being passed back to the Rule.
   eksrequest               = f8  ---> The request number of the triggering request.
************************************************************************************************************
*  retval                   = i4 ---> The return value that must be set by the CCL program being executed.
*                                      -1 = SCRIPT FAILED
*                                       0 = FALSE
*                                     100 = TRUE
************************************************************************************************************
*/
declare at_risk_ind = i2 with protect, noconstant(0)
declare max_beg_iso_dt_tm = vc with protect, noconstant("") ;001
declare current_beg_iso_dt_tm = vc with protect, noconstant("") ;001
declare max_plan_name = vc with protect, noconstant("") ;001
;Variables used to indicate a test scenario. Only used during testing. For nonprod domains.
declare source_type = vc with protect, noconstant("ENROLLMENT")
declare string = vc with protect, noconstant("")
declare idx = i2 with protect, noconstant(0)
declare demographics_test_uri = vc with protect, noconstant($PATIENT_DEMOGRAPHICS_TEST_URI)
declare cnvtIsoDtTmToDQ8(P1=VC) = DQ8 with protect ;001
 
/**************************************************************
; Begin Program
**************************************************************/
;set link_personid = 27656542 ;001 use ONLY for testing - comment out when executing from rule
 
set retval = -1
if (link_personid = 0)
  set log_message = "Invalid trigger event.  person_id = 0"
  go to END_SCRIPT
endif
 
 
 
;Load data from Rule variables - comment out and use TEST section when debugging in DVDev
set hcm_get_at_risk_indicator_req->person_id = link_personid
set hcm_get_at_risk_indicator_req->source_type = source_type
set hcm_get_at_risk_indicator_req->demographics_test_uri = demographics_test_uri
 
 
; Define at risk health plans in hcm_get_at_risk_identifier request
set stat = alterlist(hcm_get_at_risk_indicator_req->health_plans, 26) ;001 add 2 plans for testing only
set stat = alterlist(hcm_get_at_risk_indicator_req->health_plans[1]->plan_identifiers, 1)
set stat = alterlist(hcm_get_at_risk_indicator_req->health_plans[2]->plan_identifiers, 1)
set stat = alterlist(hcm_get_at_risk_indicator_req->health_plans[3]->plan_identifiers, 1)
set stat = alterlist(hcm_get_at_risk_indicator_req->health_plans[4]->plan_identifiers, 1)
set stat = alterlist(hcm_get_at_risk_indicator_req->health_plans[5]->plan_identifiers, 1)
set stat = alterlist(hcm_get_at_risk_indicator_req->health_plans[6]->plan_identifiers, 1)
set stat = alterlist(hcm_get_at_risk_indicator_req->health_plans[7]->plan_identifiers, 1)
set stat = alterlist(hcm_get_at_risk_indicator_req->health_plans[8]->plan_identifiers, 1)
set stat = alterlist(hcm_get_at_risk_indicator_req->health_plans[9]->plan_identifiers, 1)
set stat = alterlist(hcm_get_at_risk_indicator_req->health_plans[10]->plan_identifiers, 1)
set stat = alterlist(hcm_get_at_risk_indicator_req->health_plans[11]->plan_identifiers, 1)
set stat = alterlist(hcm_get_at_risk_indicator_req->health_plans[12]->plan_identifiers, 1)
set stat = alterlist(hcm_get_at_risk_indicator_req->health_plans[13]->plan_identifiers, 1)
set stat = alterlist(hcm_get_at_risk_indicator_req->health_plans[14]->plan_identifiers, 1)
set stat = alterlist(hcm_get_at_risk_indicator_req->health_plans[15]->plan_identifiers, 1)
set stat = alterlist(hcm_get_at_risk_indicator_req->health_plans[16]->plan_identifiers, 1)
set stat = alterlist(hcm_get_at_risk_indicator_req->health_plans[17]->plan_identifiers, 1)
set stat = alterlist(hcm_get_at_risk_indicator_req->health_plans[18]->plan_identifiers, 1)
set stat = alterlist(hcm_get_at_risk_indicator_req->health_plans[19]->plan_identifiers, 1)
set stat = alterlist(hcm_get_at_risk_indicator_req->health_plans[20]->plan_identifiers, 1)
set stat = alterlist(hcm_get_at_risk_indicator_req->health_plans[21]->plan_identifiers, 1)
set stat = alterlist(hcm_get_at_risk_indicator_req->health_plans[22]->plan_identifiers, 1)
set stat = alterlist(hcm_get_at_risk_indicator_req->health_plans[23]->plan_identifiers, 1)
set stat = alterlist(hcm_get_at_risk_indicator_req->health_plans[24]->plan_identifiers, 1)
 
;Add MOCK Plans for TESTING ONLY - comment out for PROD
set stat = alterlist(hcm_get_at_risk_indicator_req->health_plans[25]->plan_identifiers, 1)
set stat = alterlist(hcm_get_at_risk_indicator_req->health_plans[26]->plan_identifiers, 1)
 
 
set hcm_get_at_risk_indicator_req->health_plans[1]->plan_name = "*BPP ACO MSSP"
set hcm_get_at_risk_indicator_req->health_plans[1]->plan_identifiers[1]->type = "EDI"
set hcm_get_at_risk_indicator_req->health_plans[1]->plan_identifiers[1]->value = "004000000000500000009990000000999"
set hcm_get_at_risk_indicator_req->health_plans[2]->plan_name = "*BPP Aetna Adv"
set hcm_get_at_risk_indicator_req->health_plans[2]->plan_identifiers[1]->type = "EDI"
set hcm_get_at_risk_indicator_req->health_plans[2]->plan_identifiers[1]->value = "10021"
set hcm_get_at_risk_indicator_req->health_plans[3]->plan_name = "*BPP Aetna Adv"
set hcm_get_at_risk_indicator_req->health_plans[3]->plan_identifiers[1]->type = "EDI"
set hcm_get_at_risk_indicator_req->health_plans[3]->plan_identifiers[1]->value = "10023"
set hcm_get_at_risk_indicator_req->health_plans[4]->plan_name = "*BPP Aetna FI"
set hcm_get_at_risk_indicator_req->health_plans[4]->plan_identifiers[1]->type = "EDI"
set hcm_get_at_risk_indicator_req->health_plans[4]->plan_identifiers[1]->value = "10000"
set hcm_get_at_risk_indicator_req->health_plans[5]->plan_name = "*BPP Aetna FI"
set hcm_get_at_risk_indicator_req->health_plans[5]->plan_identifiers[1]->type = "EDI"
set hcm_get_at_risk_indicator_req->health_plans[5]->plan_identifiers[1]->value = "10002"
set hcm_get_at_risk_indicator_req->health_plans[6]->plan_name = "*BPP Aetna FI"
set hcm_get_at_risk_indicator_req->health_plans[6]->plan_identifiers[1]->type = "EDI"
set hcm_get_at_risk_indicator_req->health_plans[6]->plan_identifiers[1]->value = "10001"
set hcm_get_at_risk_indicator_req->health_plans[7]->plan_name = "*BPP Aetna SI"
set hcm_get_at_risk_indicator_req->health_plans[7]->plan_identifiers[1]->type = "EDI"
set hcm_get_at_risk_indicator_req->health_plans[7]->plan_identifiers[1]->value = "10018"
set hcm_get_at_risk_indicator_req->health_plans[8]->plan_name = "*BPP Aetna SI"
set hcm_get_at_risk_indicator_req->health_plans[8]->plan_identifiers[1]->type = "EDI"
set hcm_get_at_risk_indicator_req->health_plans[8]->plan_identifiers[1]->value = "10020"
set hcm_get_at_risk_indicator_req->health_plans[9]->plan_name = "*BPP Aetna SI"
set hcm_get_at_risk_indicator_req->health_plans[9]->plan_identifiers[1]->type = "EDI"
set hcm_get_at_risk_indicator_req->health_plans[9]->plan_identifiers[1]->value = "10019"
set hcm_get_at_risk_indicator_req->health_plans[10]->plan_name = "*BPP BCBS Commercial"
set hcm_get_at_risk_indicator_req->health_plans[10]->plan_identifiers[1]->type = "EDI"
set hcm_get_at_risk_indicator_req->health_plans[10]->plan_identifiers[1]->value = "10003"
set hcm_get_at_risk_indicator_req->health_plans[11]->plan_name = "*BPP BCBS Commercial"
set hcm_get_at_risk_indicator_req->health_plans[11]->plan_identifiers[1]->type = "EDI"
set hcm_get_at_risk_indicator_req->health_plans[11]->plan_identifiers[1]->value = "10005"
set hcm_get_at_risk_indicator_req->health_plans[12]->plan_name = "*BPP BCBS Commercial"
set hcm_get_at_risk_indicator_req->health_plans[12]->plan_identifiers[1]->type = "EDI"
set hcm_get_at_risk_indicator_req->health_plans[12]->plan_identifiers[1]->value = "10004"
set hcm_get_at_risk_indicator_req->health_plans[13]->plan_name = "*BPP BCBS Medicare"
set hcm_get_at_risk_indicator_req->health_plans[13]->plan_identifiers[1]->type = "EDI"
set hcm_get_at_risk_indicator_req->health_plans[13]->plan_identifiers[1]->value = "10006"
set hcm_get_at_risk_indicator_req->health_plans[14]->plan_name = "*BPP BCBS Medicare"
set hcm_get_at_risk_indicator_req->health_plans[14]->plan_identifiers[1]->type = "EDI"
set hcm_get_at_risk_indicator_req->health_plans[14]->plan_identifiers[1]->value = "10008"
set hcm_get_at_risk_indicator_req->health_plans[15]->plan_name = "*BPP BCBS Medicare"
set hcm_get_at_risk_indicator_req->health_plans[15]->plan_identifiers[1]->type = "EDI"
set hcm_get_at_risk_indicator_req->health_plans[15]->plan_identifiers[1]->value = "10007"
set hcm_get_at_risk_indicator_req->health_plans[16]->plan_name = "*BPP Cigna BC"
set hcm_get_at_risk_indicator_req->health_plans[16]->plan_identifiers[1]->type = "EDI"
set hcm_get_at_risk_indicator_req->health_plans[16]->plan_identifiers[1]->value = "10012"
set hcm_get_at_risk_indicator_req->health_plans[17]->plan_name = "*BPP Cigna BC"
set hcm_get_at_risk_indicator_req->health_plans[17]->plan_identifiers[1]->type = "EDI"
set hcm_get_at_risk_indicator_req->health_plans[17]->plan_identifiers[1]->value = "10011"
set hcm_get_at_risk_indicator_req->health_plans[18]->plan_name = "*BPP Cigna East"
set hcm_get_at_risk_indicator_req->health_plans[18]->plan_identifiers[1]->type = "EDI"
set hcm_get_at_risk_indicator_req->health_plans[18]->plan_identifiers[1]->value = "10014"
set hcm_get_at_risk_indicator_req->health_plans[19]->plan_name = "*BPP Cigna East"
set hcm_get_at_risk_indicator_req->health_plans[19]->plan_identifiers[1]->type = "EDI"
set hcm_get_at_risk_indicator_req->health_plans[19]->plan_identifiers[1]->value = "10013"
set hcm_get_at_risk_indicator_req->health_plans[20]->plan_name = "*BPP UHC"
set hcm_get_at_risk_indicator_req->health_plans[20]->plan_identifiers[1]->type = "EDI"
set hcm_get_at_risk_indicator_req->health_plans[20]->plan_identifiers[1]->value = "10015"
set hcm_get_at_risk_indicator_req->health_plans[21]->plan_name = "*BPP UHC"
set hcm_get_at_risk_indicator_req->health_plans[21]->plan_identifiers[1]->type = "EDI"
set hcm_get_at_risk_indicator_req->health_plans[21]->plan_identifiers[1]->value = "10017"
set hcm_get_at_risk_indicator_req->health_plans[22]->plan_name = "*BPP UHC"
set hcm_get_at_risk_indicator_req->health_plans[22]->plan_identifiers[1]->type = "EDI"
set hcm_get_at_risk_indicator_req->health_plans[22]->plan_identifiers[1]->value = "10016"
set hcm_get_at_risk_indicator_req->health_plans[23]->plan_name = "*BPP UHC"
set hcm_get_at_risk_indicator_req->health_plans[23]->plan_identifiers[1]->type = "EDI"
set hcm_get_at_risk_indicator_req->health_plans[23]->plan_identifiers[1]->value = "10017"
set hcm_get_at_risk_indicator_req->health_plans[24]->plan_name = "*BPP BayCare Plus"
set hcm_get_at_risk_indicator_req->health_plans[24]->plan_identifiers[1]->type = "EDI"
set hcm_get_at_risk_indicator_req->health_plans[24]->plan_identifiers[1]->value = "10024"
 
;Add MOCK Plans for TESTING ONLY - comment out for PROD
set hcm_get_at_risk_indicator_req->health_plans[25]->plan_name = "Mock Health Plan A"
set hcm_get_at_risk_indicator_req->health_plans[25]->plan_identifiers[1]->type = "HPID"
set hcm_get_at_risk_indicator_req->health_plans[25]->plan_identifiers[1]->value = "HPVAL1"
set hcm_get_at_risk_indicator_req->health_plans[26]->plan_name = "Mock Health Plan B" ;"Mock Payer B"
set hcm_get_at_risk_indicator_req->health_plans[26]->plan_identifiers[1]->type = "HPID"
set hcm_get_at_risk_indicator_req->health_plans[26]->plan_identifiers[1]->value = "HPVAL2"
 
/*001 swap out for custom script and reply
execute hcm_get_at_risk_indicator with replace("REQUEST", hcm_get_at_risk_indicator_req),
  replace("REPLY", hcm_get_at_risk_indicator_rep)
*/
execute bc_hcm_get_at_risk_indicator with replace("REQUEST", hcm_get_at_risk_indicator_req),
  replace("REPLY", hcm_get_at_risk_indicator_rep)
 
if (hcm_get_at_risk_indicator_rep->status_data->status = "S")
  if (hcm_get_at_risk_indicator_rep->at_risk_ind = 0)
    set log_message = "Person does not have at risk health plan"
    set retval = 0
 
  else
  ;;;001 add loops to compare beg_iso_dt_tm for all plans to find max value
	;Loop 1 through health plans
	for(idx =1 to size(hcm_get_at_risk_indicator_rep->health_plans,5))
	  call echo(build("idx .........................",idx))
 
	  if (idx = 1)
		call echo("Setting MAX for 1st record where idx = 1")
		set max_beg_iso_dt_tm = hcm_get_at_risk_indicator_rep->health_plans[idx]->begin_iso_dt_tm
		set max_plan_name = hcm_get_at_risk_indicator_rep->health_plans[idx]->plan_name
 
	  else
		;Loop 2 compare beg_iso_dt_tm to max_beg_iso_dt_tm
		call echo("Entering Loop 2")
		set current_beg_iso_dt_tm = hcm_get_at_risk_indicator_rep->health_plans[idx]->begin_iso_dt_tm
 
		if (cnvtIsoDtTmToDQ8(current_beg_iso_dt_tm) > cnvtIsoDtTmToDQ8(max_beg_iso_dt_tm))
			call echo("Current date > Max date, setting new Max values")
			set max_beg_iso_dt_tm = hcm_get_at_risk_indicator_rep->health_plans[idx]->begin_iso_dt_tm
			set max_plan_name = hcm_get_at_risk_indicator_rep->health_plans[idx]->plan_name
 
		endif ;Loop 2 end
 
	  endif
 
		call echo(build("current_beg_iso_dt_tm .....",current_beg_iso_dt_tm))
		call echo(build("max_beg_iso_dt_tm .........",max_beg_iso_dt_tm))
		call echo(build("max_plan_name .............",max_plan_name))
 
	endfor ;Loop 1 end
 
	set string=concat(string, max_plan_name)	;001
	set retval = 100
    ;set log_message=concat("Plan Name = ",max_plan_name,"(",max_beg_iso_dt_tm,") with hcm_get_at_risk_indicator_rep: "
	;						,CNVTRECTOJSON(hcm_get_at_risk_indicator_rep)) ;001
    ;log_message = cnvtstrng(hcm_get_at_risk_indicator_rep->health_plans[2]->begin_iso_dt_tm) ;"Person has at risk health plan "
    set log_misc1= string ;001 hcm_get_at_risk_indicator_rep->health_plans[2]->plan_name
	set log_message=concat("Plan Name = ",max_plan_name," || log_misc1 = ",	log_misc1)
 
  endif
endif
 
/**
 * cnvtIsoDtTmToDQ8()
 * Purpose:
 *   Converts an ISO 8601 formatted date into a DQ8
 *
 * @return {dq8, which is the same as a f8}
 *
 * @param {vc} isoDtTmStr ISO 8601 formatted string (ie, 2013-10-24T15:08:77Z)
*/
subroutine cnvtIsoDtTmToDQ8(isoDtTmStr)
    declare convertedDq8 = dq8 with protect, noconstant(0)
 
 
 
    set convertedDq8 =
        cnvtdatetimeutc2(substring(1,10,isoDtTmStr),"YYYY-MM-DD",substring(12,8,isoDtTmStr),"HH:MM:SS", 4, CURTIMEZONEDEF)
 
 
 
    return(convertedDq8)
 
 
 
end  ;subroutine cnvtIsoDtTmToDQ8
 
 
 
#END_SCRIPT
; Call echos will go to the EKS server log files and assist with debugging at client sites
; Leaving these here for the consultants to use.
if (validate(debug_ind, 0) = 1)
  call echo(build("log_message ...", log_message))
  call echo(build("retval ........", retval))
  call echo(build("log_misc1 .....", log_misc1))
endif
set last_mod = "001"
set mod_date = "Aug 27, 2019"
 
end
go
 
