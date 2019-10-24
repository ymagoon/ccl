drop program mp_dcp_import_purge:dba go
create program mp_dcp_import_purge:dba
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
 
 	 Source file name:       mp_dcp_import_purge.PRG
	 Object name:            mp_dcp_import_purge
	 Request #:
 
     Product:                PCA
     Product Team:           PowerChart Framework
	 HNA Version:
	 CCL Version:
 
	 Program purpose:        Purge inactive data from AC_CLASS_PERSON_RELTN
 
 
	 Tables read:            AC_CLASS_PERSON_RELTN
	 Tables updated:         AC_CLASS_PERSON_RELTN
	 Executing from:         Operations
 
	 Special Notes:          This script will accept a days back parmeter
	 						 and remove inactive data older than the adjusted
	 						 days back
******************************************************************************/
;~DB~*************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG               *
;    *************************************************************************
;    *                                                                       *
;    *Mod Date       Engineer Comment                                        *
;    *--- ---------- -------- -----------------------------------------------*
;     000 09/25/2012 NS9429   Initial Release                                *
;~DE~*************************************************************************
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  *********************
/******************************************************************************
Prompts
******************************************************************************
#1 -- Days back to be offset from sysdate. If blank will use curdate,0000
#2 -- email address to receive a notification of operations completion.
	  A blank email will skip this feature
*******************************************************************************/
 
;******************************************************************************
;DECLARE RECORD STRUCTURES
;******************************************************************************
free record reply
record reply
(
%i cclsource:status_block.inc
)

free record params
record params
(
	1 days_back	= i4
	1 qual[*]
		2 value	= vc
)


;******************************************************************************
;DECLARE & SET LOCAL VARIABLES
;******************************************************************************
;declare days_back 				= i4 	with noconstant(0)
;declare email_address 			= vc
declare temp_val				= vc
declare purge_cnt				= i4 	with noconstant(0)
declare val_cnt					= i4 	with noconstant(0)
declare 48_ACTIVE				= f8 	with constant(uar_get_code_by_cki("CKI.CODEVALUE!2669"))
declare hit_last_parameter 		= i2 	WITH protect, noConstant(0)
declare num 					= I4 	with protect, noConstant(0)
declare initialize_loop 		= i4 	with protect, noconstant(0)
declare start_comma 			= i4 	with protect, noconstant(0)
declare end_comma 				= i4 	with protect, noconstant(0)
declare email_string			= vc
declare temp_body 				= vc 	with public, noconstant(" ")
declare section_line_sep 		= c120 	with public, constant(FILLSTRING(120,"-"))
declare space_10 				= c10 	with public, constant(FILLSTRING(10," "))
declare space_5 				= c5 	with public, constant(FILLSTRING(5," "))
declare elapsed_ops_time 		= f8 	with public, noconstant(0.00)
declare query_opsstart_time 	= f8 	with public, noconstant(0.00)
declare query_opsstop_time 		= f8 	with public, noconstant(0.00)
declare fail_operation 			= vc
declare failed 					= i2 	with NOCONSTANT(0)
set error_string 				= FILLSTRING(132," ")  
set ERRCODE 					= error(error_string,1)

 
;******************************************************************************
;Start Timer
;******************************************************************************
set query_opsstart_time = cnvtdatetime(curdate,curtime3)
 
 
;******************************************************************************
;VALIDATE PARAMETERS
;******************************************************************************
set num = 1

WHILE(hit_last_parameter = 0)
  IF(reflect(parameter(num,0)) != " ") ;not hit empty parameter
	call echo(build("REFLECT: ",reflect(parameter(num,0))))
	if (cnvtupper(substring(1,1,reflect(parameter(num,0)))) = "I")
		set params->days_back  = parameter(num,0)
    elseif(cnvtupper(substring(1,1,reflect(parameter(num,0))))= "C")

    	set temp_val = parameter(num,0)
    	
		if(isnumeric(temp_val)=1 and params->days_back = 0)
			set params->days_back  = cnvtint(temp_val)
		else
			set val_cnt = size(params->qual,5)
			set start_comma = 0
			set end_comma = findstring(",", temp_val, start_comma)
			set initialize_loop = 1
			
			while ( start_comma > 0 or initialize_loop )
				set initialize_loop = 0
				set val_cnt = val_cnt + 1
		
				set stat = alterlist(params->qual, val_cnt)
	
				if (not end_comma) ;case of no more commas (End of Line)
					set params->qual[val_cnt].value =
							SUBSTRING(start_comma+1,textlen(temp_val)-start_comma,temp_val)
				else
					set params->qual[val_cnt].value =
							SUBSTRING(start_comma+1,end_comma-start_comma-1,temp_val)
				endif
				
				;remove any addresses that do not contain an @ symbol
				if ((findstring(char(64), params->qual[val_cnt].value,1,0) = 0)
					;OR remove any addresses that do not contain a .
					or (findstring(char(46), params->qual[val_cnt].value,1,0) = 0))
						set stat = alterlist(params->qual,val_cnt -1)
						set val_cnt = val_cnt - 1
				else
					set email_string = concat(email_string,",",params->qual[val_cnt].value)				
				endif
				
				set start_comma = end_comma
				if (start_comma)
					set end_comma = findstring(",", temp_val, start_comma+1)
				endif
			endwhile
			
	
		endif    	
	else
		set failed = 1
		set fail_operation 	= "EVAL PARAMETERS"
		set error_string 	= "Failed Execution: Invalid Parameter type"
		go to EXIT_SCRIPT
	endif
 
    set num = num + 1
  ELSE
    set hit_last_parameter = 1
  ENDIF
ENDWHILE 

;clean email_string for logging
;Remove first comma
set email_string = replace(trim(email_string),",","",1)


;******************************************************************************
;BEGIN PROCESSING
;******************************************************************************
delete from ac_class_person_reltn acpr
where acpr.end_effective_dt_tm < cnvtdatetime(curdate-params->days_back,0000)
and acpr.active_ind = 0
;ensure the reinactive record is not part of an active person combine
and not exists (select 1 from person_combine_det pcd
				where pcd.entity_id = acpr.ac_class_person_reltn_id
				and not exists (select 1 from person_combine pc
								where pc.person_combine_id = pcd.person_combine_id
								and pc.active_ind =1
								and pc.active_status_cd = 48_ACTIVE
								)
 
				)
with nocounter
 

if(error(error_string, 0))
	set failed = 1
	set fail_operation = "DELETE FAILURE"
	go to EXIT_SCRIPT
else
	set purge_cnt = curqual
endif

;******************************************************************************
;Stop timers
;******************************************************************************
set query_opsstop_time = cnvtdatetime(curdate,curtime3)
set elapsed_ops_time = round(datetimediff(query_opsstop_time,query_opsstart_time,5),4)
 
 
;******************************************************************************
;SEND EMAIL
;******************************************************************************
if (size(params->qual,5) > 0)
	set temp_body = " "
 
	set email_subject = build("** MP_DCP_IMPORT_PURGE ** ",trim(curdomain))
	set temp_body = BUILD (temp_body,"Successful Operations Completion",char(13),char(13))
	set temp_body = BUILD (temp_body,"Parameters",char(13))
	set temp_body = build(temp_body,
					"Days Back: ",trim(cnvtstring(params->days_back)),char(13),
					"Emailed To: ",trim(email_string),char(13),
					"Purge all inactive records before: ",format(cnvtdatetime(curdate-params->days_back,0000),"MM/DD/YYYY HH:MM:SS;;d"),	
					char(13),char(13))
	set temp_body = build(temp_body,"Operations Execution",char(13),
					"Total number of purged records: ",	trim(cnvtstring(purge_cnt)),char(13),
					elapsed_ops_time," seconds (",format(query_opsstart_time, "MM/DD/YYYY HH:MM:SS;;d"),
					"-->",format(query_opsstop_time, "MM/DD/YYYY HH:MM:SS;;d"),")",char(13),char(13)
					)
	set email_body = temp_body

	for (eidx = 1 to size(params->qual,5)) 
		call uar_send_mail(nullterm(params->qual[eidx].value),
				nullterm(email_subject),
				nullterm(email_body),
				"MP_DCP_IMPORT_PURGE",
				5,
				"IPM.NOTE")
	endfor				
endif

#EXIT_SCRIPT
;******************************************************************************
; 	Reply back to ops
;******************************************************************************
if (failed = 0 )
    set reply->status_data->status = "S"
    set reqinfo->commit_ind = 1
else
    set reply->status_data->status = "F"
    set reqinfo->commit_ind = 0
  	set reply->status_data.subeventstatus[1].OperationName = fail_operation
  	set reply->status_data.subeventstatus[1].OperationStatus = "F"
  	set reply->status_data.subeventstatus[1].TargetObjectName = "PURGE OPS"
  	set reply->status_data.subeventstatus[1].TargetObjectValue = error_string
    
    rollback
endif

free record reply
free record params
 
end go