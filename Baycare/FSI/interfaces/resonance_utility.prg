/************************************************************************
 *                                                                      *
 *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
 *                              Technology, Inc.                        *
 *       Revision      (c) 1984-2013 Cerner Corporation                 *
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
 
          Date Written:       06/09/2016
          Source file name:   resonance_utility_mod_obj.prg
          Object name:
          Request #:          n/a
 
          Product:            CORE V500
          Product Team:       CORE V500
          HNA Version:        V500
          CCL Version:
 
          Program purpose:    mod object for the Resonance Utility
 
 
          Tables read:        None.
          Tables updated:     None
          Executing from:
 
 
          Special Notes:      None
 
 ************************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                  *
 ************************************************************************
 *                                                                      *
 *Mod     Date        Engineer              Comment                     *
 *------  ----------  --------------------  ----------------------------*

 *001	  12/13/2016  SS019580				added ld_enabled flag to request
 *002     05/26/2017  SS019580				added ability to flex user
 *003     07/27/2017  SS019580				added ability to flex how encounters are obtained.
 *004     09/14/2017  SS019580				added abiliity to flex minimum age
 *005      02/25/2019  S Parimi                                  RFC # 18493   added legacy_adt_name to include multiple servers
 *006     07/25/19     S Parimi                             CHG0033261 fix the issue with resonance messages log to oentxlog

 ************************************************************************
 
 ******************  END OF ALL MODCONTROL BLOCKS  *********************/
 
;************************************************************************
;*                             version 1.05         					*
;*                     				        							*
;*                                NOTE			        				*
;*  This interface will queue up if the interface it is monitoring 		*
;*  (request->legacy_adt_inteface[1]->proc_name) queues up and will 	*
;*  begin processing again once the interface being monitored starts	*
;*  processing again.													*
;************************************************************************

 






;only process ADT transactions
if(oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_type != "ADT" or 
(oen_reply->CONTROL_GROUP [1]->MSH [1]->message_type->messg_trigger not in
("A01","A04","A08")))
	set oenstatus->ignore = 1
	go to end_of_script
endif

select into "nl:"
	p.person_id
	,p.active_ind
from
	person p
plan p
	where p.person_id = oen_reply->cerner->person_info->person [1]->person_id 
		and p.active_ind = 1
with counter

if (curqual not > 0)
	execute oencpm_msglog(build2("----->Inactive Person! Ignoring!",char(0)))
	set oenstatus->ignore = 1
	go to end_of_script	
endif

record request
(
	1 legacy_utility_pid						= i4
	1 update_udf								= i4
	1 legacy_adt_inteface[*]
		2 proc_name 							= vc
	1 person_id									= f8
	1 encntr_id									= f8
	1 queue_id									= f8
	1 trigger_id								= f8
	1 transaction_id							= f8
	1 pm_transaction							= vc
	1 cqm_refnum								= vc
	1 user_id									= f8
	1 time_since_processed						= i4
	1 transaction_processed						= i2
	1 transaction_exists						= i2
	1 time_to_wait								= i4
	1 min_time_to_wait							= i4
	1 transaction_exist_wait					= i4
	1 trigger_cw_auto_enrollment				= i2 ; 0=No, 1=Batch ADTs Only, 2=All ADTs
	1 cw_enroll_if_person_exists				= i2 ; ;1 = yes, only if one match returned. 2 = yes, even if multiple matches returned
	1 cw_check_patients_age						= i2 ; 1=Yes
	1 trigger_auto_queries						= i2 ; 0=No, 1=Yes
	1 prev_cw_auto_enroll_status_cd				= f8 ; latest status code from person_info
	1 ld_enabled								= i2 ; set to 1 if implementing auto-enrollment in a LD
	1 username									= vc ;002
	1 use_adt_encntr_id							= i2 ; set to 1 to only reference encntr_id from ADT and bypass logic to look up valid ADT. ;003
	1 min_age									= i4 
	1 disable_address_normalization_match_logic	= i4 ;005 ;set to 1 to not disable address normalization logic
)

/**************************************************************
***************************************************************
***************************************************************
; Client Configuration Begin
***************************************************************
***************************************************************
**************************************************************/
;set client settings here
;commonwell auto-enrollment request settings
set request->trigger_cw_auto_enrollment 				= 2
set request->cw_enroll_if_person_exists					= 2
set request->cw_check_patients_age						= 1
set request->ld_enabled									= 0

;Set the minimum age for enrollment if request->cw_check_patients_age is set to 1:
set request->min_age									= 19 ;004

;define interfaces that should be monitored
set stat = alterlist ( request->legacy_adt_inteface, 4)
set request->legacy_adt_inteface[1]->proc_name 			= "RESONANCE_PIX_ADT_OUT_01"
set request->legacy_adt_inteface[2]->proc_name 			= "RESONANCE_PIX_ADT_OUT_02"
set request->legacy_adt_inteface[3]->proc_name 			= "RESONANCE_PIX_ADT_OUT_03"
set request->legacy_adt_inteface[4]->proc_name 			= "RESONANCE_PIX_ADT_OUT_04"


;auto-query request settings
set request->trigger_auto_queries						= 0

;username to use if user_id from transaction = 0
;The name of the user is sent in the JWT request subjectId
;username must be active, have an active_status_cd of 188, and a name
;Should only be changed if CERNER account is not active
set request->username 									= "CERNER" ;002

;if set to 0, logic will be used to find the most recent valid encntr_id
;if set to 1, current encntr_id from the adt will be used. Logic will not be used to look up valid encounter.
set request->use_adt_encntr_id							= 0 ;003

;if set to 0, the auto-enrollment process will attempt to normalize the state and street address
;when evaluating CommonWell matches. Normalized value is only used for matching and is not sent
;to CommonWell.
;if set to 1, the auto-enrollment process will not attempt to normalize the state and street address
;when evaluating CommonWell matches.
set request->disable_address_normalization_match_logic  = 0 ;005

/**************************************************************
***************************************************************
***************************************************************
; Client Configuration End
***************************************************************
***************************************************************
**************************************************************/

execute oencpm_msglog(BUILD2("Processed Start at: ", format(cnvtdatetime(curdate,curtime3), "DD/MM/YYYY hh:mm:ss;;Q"), char(0)))

execute resonance_utility_prg "MINE"

#end_of_script

execute oencpm_msglog(BUILD2("Processed End at: ", format(cnvtdatetime(curdate,curtime3), "DD/MM/YYYY hh:mm:ss;;Q"), char(0)))