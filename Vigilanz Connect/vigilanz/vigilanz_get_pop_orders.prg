/****************************************************************************
  
  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

*****************************************************************************
          Date Written:       02/23/2017
          Source file name:   vigilanz_get_pop_orders
          Object name:        vigilanz_get_pop_orders
          Program purpose:    Returns all orders
          Tables read:		  ORDERS
          Tables updated:     NONE
          Executing from:     EMISSARY SERVICES
          Special Notes:	  NONE
***********************************************************************
                  GENERATED MODIFICATION CONTROL LOG
***********************************************************************
 Mod Date     Engineer             Comment
 ----------------------------------------------------------------------
  001 02/23/17 DJP				Initial write
  002 05/18/17 DJP				Added Gender/DOB to Person Object
  003 05/19/17 DJP				Add Orderable Code/Start and Stop Dates
  004 07/10/17 DJP				UTC date/time code changes
  005 07/10/17 DJP 				Check for From Date > To Date
  006 07/31/17 DJP 				Add Order Related Diagnoses Subroutine and call
  007 07/31/17 JCO				Changed %i to execute; update ErrorHandler2
  008 08/24/17 JCO				Modified query to use oa updt_dt_tm
  009 03/22/18 RJC				Added version code and copyright block
  010 04/11/18 DJP				Added string Birthdate to person object
  011 06/11/18 DJP				Comment out MAXREC on Selects
  012 08/01/18 RJC				Code cleanup
  013 08/09/18 RJC				Changed max rec behavior. Max recs will no longer error out. It will return the max recs and
								once the limit is reached, it return all recs tied to the same second.
  014 08/14/18 RJC				Made expand clause variable depending on number of elements in record
  015 08/29/18 STV              Rework to handle nonutc environments and dates to be set by funcions
  016 10/18/18 RJC				Outerjoin on person_alias table
  017 12/10/18 RJC				Return order priority
  018 01/07/19 STV              Switch MRN to Encounter MRN
  019 02/25/19 RJC				Added parent order id
  020 03/28/19 STV              Removed the action_sequence filter for ordering provider
  021 04/23/19 RJC				Removed dummyt refs to improve performance
  022 04/26/19 STV              added 115 sec timeout
  023 05/31/19 STV              adjustment for
  024 08/27/19 RJC				Added VerifiedStatus and IsNurseReviewed fields
 ***********************************************************************/
drop program vigilanz_get_pop_orders go
create program vigilanz_get_pop_orders
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "User Name:" = ""        	;003
		, "From Date:" = ""			; beginning of time
		, "To Date:" = ""			;default end of time
		, "Catgories:" = ""			;default ALL Categories:Activity_type_cd
		, "Components: " = ""		;default ALL Components:Catalog_cd
		, "Facilities" = ""			;OPTIONAL. List of location facility codes from code set 220.
		, "Debug Flag" = 0			;OPTIONAL. Verbose logging when set to one (1).
 		, "Time Max" = 3600			;DO NOT USE. Undocumented value to override maximum date range in seconds.
with OUTDEV, USERNAME, FROM_DATE, TO_DATE, ORDER_CAT, ORDER_COMP, LOC_LIST, DEBUG_FLAG, TIME_MAX
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL changed to Emissary version ;009
**************************************************************************/
set sVersion = "1.21.6.2"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record pop_orders_reply_out
record pop_orders_reply_out(
 
	1 orders_list[*]
		2 order_id 								= f8
		2 order_mnemonic               			= vc
		;2 hna_mnemonic 		  		  		= vc
		;2 ordered_as_mnemonic          		= vc
		;2 action_personnel_id          		= f8
		;2 communication_type_cd        		= f8
		;2 communication_type_disp      		= vc
		2 ordering_provider_id           		= f8
		2 ordering_provider_name				= vc
		2 order_status_disp          			= vc
		2 activity_type_cd						= f8 	;order type
		2 activity_type_disp          			= vc
		2 orig_date                 			= dq8
		2 clinical_display_line					= vc
		2 simplified_display_line				= vc
		2 catalog_cd              				= f8 	;orderable code
		2 catalog_disp            				= vc
		;2 action_dt_tm                			= dq8
		;2 action_tz                   			= i4
		;2 orig_order_dt_tm		  	   			= dq8
		;2 orig_order_tz		       			= i4
		2 created_updated_date_time				= dq8
		2 current_start_dt_tm     				= dq8	;003
		2 projected_stop_dt_tm    				= dq8	;003
		;2 stop_type_cd            				= f8
		;2 stop_type_disp         				= vc
		;2 dept_status_cd          				= f8
		;2 dept_status_disp        				= vc
		;2 medstudent_action_ind        		= i2
		;2 template_order_id            		= f8
		;2 action_sequence              		= i4
		;2 discontinue_type_cd          		= f8
		;2 med_order_type_cd			   		= f8
		;2 additive_count_for_IVPB	   			= i4
		;2 orderable_type_flag		   			= i4
		;2 clinically_sig_diluent_count 		= i4
		;2 therap_sbsttn_id 			   		= f8
		2 parent_order_id						= f8
		2 is_nurse_reviewed						= i2
		2 verified_status						= vc
		2 order_diagnosis[*]							;+006
		  3 name								= vc 	;n.source_string
		  3 code_type							= vc  	;n.source_identifier_keycap
		  3 code								= vc 	;n.concept_cki
		  3 comment								= vc
		  3 qualifier							= vc    ;-006
		2 order_priority								;017
			3 id								= f8
			3 name								= vc
		2 person
		  3 person_id 							= f8	;p.person_id
		  3 name_full_formatted 				= vc	;p.name_full_formatted
		  3 name_last 							= vc	;p.last_name
		  3 name_first 							= vc	;p.first_name
		  3 name_middle 						= vc	;p.middle_name
		  3 mrn									= vc    ;pa.alias
		  3 dob									= dq8 	;002
		  3 gender_id							= f8  	;002
		  3 gender_disp							= vc  	;002
		  3 sDOB								= c10 	;010
	 	2 encounter
		  3 encounter_id 						= f8	;e.encntr_id
		  3 encounter_type_cd					= f8	;e.encntr_type_cd
		  3 encounter_type_disp					= vc	;encounter type display
		  3 encounter_type_class_cd				= f8	;encounter_type_class_cd
	      3 encounter_type_class_disp			= vc	;encounter type class display
 		  3 arrive_date							= dq8	;e.admit_dt_tm
 		  3 discharge_date						= dq8	;e.discharge_dt_tm
 		  3 fin_nbr								= vc	;ea.alias
 		  3 patient_location
 		  	4  location_cd              		= f8
  			4  location_disp            		= vc
  			4  loc_bed_cd               		= f8
  			4  loc_bed_disp            			= vc
  			4  loc_building_cd          		= f8
  			4  loc_building_disp        		= vc
  			4  loc_facility_cd          		= f8
  			4  loc_facility_disp        		= vc
  			4  loc_nurse_unit_cd        		= f8
 			4  loc_nurse_unit_disp      		= vc
 			4  loc_room_cd              		= f8
  			4  loc_room_disp            		= vc
  			4  loc_temp_cd              		= f8
  			4  loc_temp_disp            		= vc
	1 audit
		2 user_id								= f8
		2 user_firstname						= vc
		2 user_lastname							= vc
		2 patient_id							= f8
		2 patient_firstname						= vc
		2 patient_lastname						= vc
 	    2 service_version						= vc
 	    2 query_execute_time					= vc
	    2 query_execute_units					= vc
  1 status_data											;007
    2 status 									= c1
    2 subeventstatus[1]
      3 OperationName 							= c25
      3 OperationStatus 						= c1
      3 TargetObjectName 						= c25
      3 TargetObjectValue 						= vc
      3 Code 									= c4
      3 Description 							= vc
)
 
free record category_req
record category_req (
	1 qual_cnt 									= i4
	1 qual[*]
		2 activity_type_cd 						= f8
)
 
free record components_req
record components_req (
	1 qual_cnt 									= i4
	1 qual[*]
		2 catalog_cd							= f8
)
 
free record loc_req
record loc_req (
	1 qual_cnt 									= i4
	1 qual[*]
		2 code_value							= f8
)
 
set pop_orders_reply_out->status_data->status = "F"
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common	;007
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
set MODIFY MAXVARLEN 200000000	;013
 
; Input
declare sFromDate				= vc with protect, noconstant("")
declare sToDate					= vc with protect, noconstant("")
declare sCategories				= vc with protect, noconstant("")
declare sComponents				= vc with protect, noconstant("")
declare sLocFacilities			= vc with protect, noconstant("")
declare iDebugFlag				= i2 with protect, noconstant(0)
declare iTimeMax				= i4 with protect, noconstant(0)
 
; Other
declare qFromDateTime			= dq8 with protect, noconstant(CNVTDATETIME(CURDATE, CURTIME3));004
declare qToDateTime				= dq8 with protect, noconstant(CNVTDATETIME(CURDATE, CURTIME3));004
declare iTimeDiff				= i4 with protect, noconstant(0)
declare ndx                     = i4
declare ndx2                    = i4
declare iMaxRecs				= i4 with protect, constant(2000) ;013
declare timeOutThreshold = i4 with protect, noconstant(115);setting to 115 seconds
declare queryStartTm = dq8
 
; Constants
declare c_mrn_encounter_alias_type_cd	= f8 with protect, constant(uar_get_code_by("MEANING",319,"MRN"))
declare c_finnbr_person_alias_type_cd	= f8 with protect, constant(uar_get_code_by("MEANING",319,"FIN NBR"))
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ParseComponents(null)  				= null with Protect
declare ParseLocations(null)				= null with Protect
declare ParseCategories(null)				= null with protect
declare GetOrders(null)						= null with protect
declare GetOrderDiagnosis(null)				= null with protect ;006
declare GetOrderPriority(null)				= null with protect ;017
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
; Input
set sUserName						= trim($USERNAME, 3)
set sFromDate						= trim($FROM_DATE, 3)
set sToDate							= trim($TO_DATE, 3)
set sCategories  					= trim($ORDER_CAT, 3) ;011
set sComponents     				= trim($ORDER_COMP,3)
set sLocFacilities					= trim($LOC_LIST,3)
set iDebugFlag						= cnvtint($DEBUG_FLAG)
set iTimeMax						= cnvtint($TIME_MAX)
 
; Other
set qFromDateTime = GetDateTime(sFromDate)
set qToDateTime = GetDateTime(sToDate)
 
if(iDebugFlag > 0)
	call echo(build("sFromDate -> ",sFromDate))
	call echo(build("sToDate -> ",sToDate))
	call echo(build("sUserName -> ", sUserName))
	call echo(build("qFromDateTime -> ", qFromDateTime))
	call echo(build("qToDateTime -> ", qToDateTime))
	call echo(build("debug flag -> ", iDebugFlag))
	call echo(build("sCategories -> ",sCategories))
	call echo(build("sComponents -> ",sComponents))
	call echo(build("sLocFacilities -> ",sLocFacilities))
	call echo(build("iTimeDiff-->", iTimeDiff))
    call echo(build ("DISPLAY END DT TIME",format(qToDateTime, "@LONGDATETIME")))
endif
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Validate username
set iRet = PopulateAudit(sUserName, 0.0, pop_orders_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F","POP_ORDERS", "Invalid User for Audit.",
	"1001",build("UserId is invalid: ", sUserName),pop_orders_reply_out)
	set pop_orders_reply_out->status_data->status = "F"
	go to EXIT_SCRIPT
endif
 
; Validate from date is not greater than to date - 005
if (qFromDateTime > qToDateTime)
	call ErrorHandler2("VALIDATE", "F", "POP_ORDERS", "From Date Greater than To Date. Refine Dates Entered.",
	"2010", "From Date Greater than To Date. Refine Dates Entered.", pop_orders_reply_out)
	go to EXIT_SCRIPT
endif
 
; Validate timespan does not exceed threshold
set iRet = ThreshHoldValidator(iTimeMax,"s",qFromDateTime,qToDateTime)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "POP_ORDERS", "Date Range Too Long. Refine Query.","2011",
	 "Date Range Too Long. Refine Query.",pop_orders_reply_out)
	go to EXIT_SCRIPT
endif
 
; Parse locations if provided
if(sLocFacilities > " ")
	call ParseLocations(null)
endif
 
; Parse categories if provided
if(sCategories > " ")
	call ParseCategories(null)
endif
 
; Parse components if provided
if(sComponents > " ")
	call ParseComponents(null)
endif
 
; Get Orders
call GetOrders(null)
 
; Get Order Diagnoses
call GetOrderDiagnosis(null) ;006
 
; Get Order priority
call GetOrderPriority(null) ;017
 
/*************************************************************************
 EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************
 Convert REC output to JSON
**************************************************************/
set JSONout = CNVTRECTOJSON(pop_orders_reply_out)
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_pop_orders.json")
	call echo(build2("_file : ", _file))
	call echojson(pop_orders_reply_out, _file, 0)
 	call echorecord(pop_orders_reply_out)
   	call echo(JSONout)
endif
 
#EXIT_VERSION
 
/*************************************************************************
;  Name: ParseLocations(null) = null
;  Description: Subroutine to parse a comma delimited string
**************************************************************************/
subroutine ParseLocations(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ParseLocations Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare notfnd 		= vc with constant("<not_found>")
	declare num 		= i4 with noconstant(1)
	declare str 		= vc with noconstant("")
 
	while (str != notfnd)
     	set str =  piece(sLocFacilities,',',num,notfnd)
     	if(str != notfnd)
      		set stat = alterlist(loc_req->qual, num)
			set loc_req->qual_cnt = num
     		set loc_req->qual[num]->code_value = cnvtreal(str)
 
     		 select into "nl:"
     		 from code_value
			 where code_set = 220 and cdf_meaning = "FACILITY" and
			 loc_req->qual[num]->code_value = code_value
 
     		if (curqual = 0)
				call ErrorHandler2("VALIDATE", "F", "POP_ORDERS", build("Invalid Facility Code: ", loc_req->codes[num]->code_value),
				"2040", build("Invalid Facility Code: ",loc_req->codes[num]->code_value),pop_orders_reply_out)
				set stat = alterlist(pop_orders_reply_out->orders_list,0)
				go to Exit_Script
			endif
     	endif
      	set num = num + 1
 	endwhile
 
	if(iDebugFlag > 0)
		call echo(concat("ParseLocations Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: ParseCategories(sCategories)
;  Description: Subroutine to parse a comma delimited string
**************************************************************************/
subroutine ParseCategories(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ParseCategories Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare notfnd 		= vc with constant("<not_found>")
	declare num 		= i4 with noconstant(1)
	declare str 		= vc with noconstant("")
 
	while (str != notfnd)
     	set str =  piece(sCategories,",",num,notfnd)
     	if(str != notfnd)
			set iRet = GetCodeSet(cnvtreal(str))
			if(iRet != 106)
				call ErrorHandler2("VALIDATE", "F", "POP_ORDERS",build("Invalid Category/Activity Type Code: ",trim(str,3)),
				"2016", build("Invalid Category/Activity Type Code: ",trim(str,3)),pop_orders_reply_out)
				go to exit_script
			else
				set stat = alterlist(category_req->qual,num)
				set category_req->qual_cnt = num
      			set category_req->qual[num].activity_type_cd  = cnvtreal(str)
			endif
		endif
      	set num = num + 1
	endwhile
 
	set num = 1
 
	;Set expand control value - 014
	if(category_req->qual_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	; Retrieve all of the catalog codes by activity_cd
	select into "nl:"
	from order_catalog   oc
	where expand(num,1,category_req->qual_cnt,oc.activity_type_cd,category_req->qual[num].activity_type_cd)
	head report
		 x = 0
		 stat = alterlist(components_req->qual,1000)
	detail
		x = x + 1
		if(mod(x,100) = 1 and x > 1000)
			stat = alterlist(components_req->qual,x + 99)
		endif
		components_req->qual[x].catalog_cd = oc.catalog_cd
	foot report
		stat = alterlist(components_req->qual,x)
		components_req->qual_cnt = x
	with nocounter, expand = value(exp)
 
	if(iDebugFlag > 0)
		call echo(concat("ParseCategories Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: ParseComponents(null) = null
;  Description: Subroutine to parse a comma delimited string
**************************************************************************/
subroutine ParseComponents(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ParseComponents Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare notfnd 		= vc with constant("<not_found>")
	declare num 		= i4 with noconstant(1)
	declare str 		= vc with noconstant("")
 
	while (str != notfnd)
     	set str =  piece(sComponents,',',num,notfnd)
     	if(str != notfnd)
     		set iRet = GetCodeSet(cnvtreal(str))
			if(iRet != 200)
     			call ErrorHandler2("VALIDATE", "F", "POP_ORDERS", build("Invalid Order/Catalog Code: ",cnvtreal(str)),
				"2056", build("Invalid Order/Catalog Code: ",cnvtint(str)), pop_orders_reply_out)
      			go to Exit_Script
			else
				set components_req->qual_cnt = components_req->qual_cnt + num
				set stat = alterlist(components_req->qual, components_req->qual_cnt)
     			set components_req->qual[components_req->qual_cnt]->catalog_cd = cnvtreal(str)
			endif
        endif
      	set num = num + 1
 	endwhile
 
	if(iDebugFlag > 0)
		call echo(concat("ParseComponents Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetOrders(null)
;  Description: Subroutine to get Orders
**************************************************************************/
subroutine GetOrders(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetOrders Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	;Temp data
	free record temp
	record temp (
		1 qual_cnt = i4
		1 qual[*]
			2 order_id = f8
			2 action_seq = i4
	)
	;Set expand control value - 014
	if(loc_req->qual_cnt > 200 or components_req->qual_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	; Populate temp data
	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select
		if(loc_req->qual_cnt > 0 and components_req->qual_cnt > 0)
			from order_action oa
				, orders o
				, encounter e
			plan oa where oa.updt_dt_tm >= cnvtdatetime(qFromDateTime)
				and oa.updt_dt_tm <= cnvtdatetime(qToDateTime)	;008
			join o where o.order_id = oa.order_id
				and expand(ndx,1,components_req->qual_cnt,o.catalog_cd,components_req->qual[ndx].catalog_cd)
			join e where e.encntr_id = o.encntr_id
				and expand(ndx2,1,loc_req->qual_cnt,e.loc_facility_cd,loc_req->qual[ndx2].code_value)
			order by oa.updt_dt_tm
		elseif(loc_req->qual_cnt > 0)
				from order_action oa
					, orders o
					, encounter e
				plan oa where oa.updt_dt_tm >= cnvtdatetime(qFromDateTime)
					and oa.updt_dt_tm <= cnvtdatetime(qToDateTime)	;008
				join o where o.order_id = oa.order_id
				join e where e.encntr_id = o.encntr_id
					and expand(ndx2,1,loc_req->qual_cnt,e.loc_facility_cd,loc_req->qual[ndx2].code_value)
				order by oa.updt_dt_tm
		elseif(components_req->qual_cnt > 0)
			from order_action oa
				, orders o
			plan oa where oa.updt_dt_tm >= cnvtdatetime(qFromDateTime)
				and oa.updt_dt_tm <= cnvtdatetime(qToDateTime)	;008
			join o where o.order_id = oa.order_id
				and expand(ndx,1,components_req->qual_cnt,o.catalog_cd,components_req->qual[ndx].catalog_cd)
			order by oa.updt_dt_tm
		else
			from order_action oa
			plan oa where oa.updt_dt_tm >= cnvtdatetime(qFromDateTime)
				and oa.updt_dt_tm <= cnvtdatetime(qToDateTime)	;008
			order by oa.updt_dt_tm
		endif
	into "nl:"
		oa.order_id ,oa.action_sequence, oa.updt_dt_tm
	head report
		x = 0
		max_reached = 0
		stat = alterlist(temp->qual,iMaxRecs)
	head oa.updt_dt_tm
		if(x > iMaxRecs)
			max_reached = 1
		endif
	detail
		if(max_reached = 0)
			x = x + 1
			if(mod(x,100) = 1 and x > iMaxRecs)
				stat = alterlist(temp->qual,x + 99)
			endif
 
			temp->qual[x].order_id = oa.order_id
			temp->qual[x].action_seq = oa.action_sequence
		endif
	foot report
		stat = alterlist(temp->qual,x)
		temp->qual_cnt = x
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag)
 		call echo(build("------Qual Cnt = ",temp->qual_cnt))
 	endif
 
	; Populate audit
	if (temp->qual_cnt > 0)
		call ErrorHandler("EXECUTE", "S", "POP_ORDERS", "Success retrieving orders",  pop_orders_reply_out)	;007
	else
		call ErrorHandler("EXECUTE", "Z", "POP_ORDERS", "No records qualify.", pop_orders_reply_out);007
		go to exit_script
	endif
 
	; Populate final record
	set idx = 1
	if(temp->qual_cnt > 100)
		set exp = 2
	else
		set exp = 0
	endif
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from order_action oa
		,orders o
		,person p
		,encounter e
		,encntr_alias ea
		,encntr_alias ea2
		,prsnl pr
	plan oa where expand(idx,1,temp->qual_cnt,oa.order_id,temp->qual[idx].order_id,
				oa.action_sequence,temp->qual[idx].action_seq)
	join o where o.order_id = oa.order_id
	join p where p.person_id = o.person_id
	join e where e.encntr_id = outerjoin(o.encntr_id)
	join ea where ea.encntr_id = outerjoin(e.encntr_id)
		and ea.encntr_alias_type_cd = outerjoin(c_finnbr_person_alias_type_cd)
		and ea.active_ind = outerjoin(1)
		and ea.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		and ea.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
	join ea2 where ea2.encntr_id = outerjoin(e.encntr_id)
		and ea2.encntr_alias_type_cd = outerjoin(c_mrn_encounter_alias_type_cd)
		and ea2.active_ind = outerjoin(1)
		and ea2.beg_effective_dt_tm <= outerjoin(cnvtdatetime(curdate,curtime3))
		and ea2.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate,curtime3))
	join pr where oa.order_provider_id = outerjoin(pr.person_id)
	order by oa.order_id, oa.action_sequence
	head report
		x = 0
		stat = alterlist(pop_orders_reply_out->orders_list,2000)
	head oa.order_id
		x = x + 1
		if(mod(x,100) = 1 and x > 2000)
			stat = alterlist(pop_orders_reply_out->orders_list,x + 99)
		endif
	detail
		; Order Action Data
		pop_orders_reply_out->orders_list[x].created_updated_date_time = oa.updt_dt_tm	;008
		;pop_orders_reply_out->orders_list[x].created_updated_date_time = oa.action_dt_tm - 008
		;if(oa.action_sequence = 1)
			pop_orders_reply_out->orders_list[x].ordering_provider_id = oa.order_provider_id
			pop_orders_reply_out->orders_list[x].ordering_provider_name = pr.name_full_formatted
		;endif
 
		; Orders Data
		pop_orders_reply_out->orders_list[x].order_id = o.order_id
		pop_orders_reply_out->orders_list[x].order_mnemonic = o.order_mnemonic
		pop_orders_reply_out->orders_list[x].orig_date = o.orig_order_dt_tm
		pop_orders_reply_out->orders_list[x].clinical_display_line = o.clinical_display_line
		pop_orders_reply_out->orders_list[x].simplified_display_line = o.simplified_display_line
		pop_orders_reply_out->orders_list[x].order_status_disp = uar_get_code_display(o.order_status_cd)
		pop_orders_reply_out->orders_list[x].activity_type_cd = o.activity_type_cd
		pop_orders_reply_out->orders_list[x].activity_type_disp = uar_get_code_display(o.activity_type_cd)
		pop_orders_reply_out->orders_list[x].catalog_cd = o.catalog_cd
		pop_orders_reply_out->orders_list[x].catalog_disp = uar_get_code_display(o.catalog_cd)
		pop_orders_reply_out->orders_list[x].current_start_dt_tm = o.current_start_dt_tm ;003
		pop_orders_reply_out->orders_list[x].projected_stop_dt_tm = o.projected_stop_dt_tm ;003
		pop_orders_reply_out->orders_list[x].parent_order_id = o.template_order_id
		if(o.need_nurse_review_ind = 0)
			pop_orders_reply_out->orders_list[x].is_nurse_reviewed = 1
		endif
		case(o.need_rx_verify_ind)
			of 0: pop_orders_reply_out->orders_list[x].verified_status = "Verified"
			of 1: pop_orders_reply_out->orders_list[x].verified_status = "Unverified"
			of 2: pop_orders_reply_out->orders_list[x].verified_status = "Rejected"
		endcase
 
		; Person Data
		pop_orders_reply_out->orders_list[x]->person->person_id = p.person_id
		pop_orders_reply_out->orders_list[x]->person->name_full_formatted = p.name_full_formatted
		pop_orders_reply_out->orders_list[x]->person->name_first = p.name_first
		pop_orders_reply_out->orders_list[x]->person->name_last = p.name_last
		pop_orders_reply_out->orders_list[x]->person->name_middle = p.name_middle
		pop_orders_reply_out->orders_list[x]->person->mrn = ea2.alias
		pop_orders_reply_out->orders_list[x]->person->dob = p.birth_dt_tm ;002
		pop_orders_reply_out->orders_list[x]->person->gender_id = p.sex_cd ;002
		pop_orders_reply_out->orders_list[x]->person->gender_disp = uar_get_code_display(p.sex_cd);002
		pop_orders_reply_out->orders_list[x]->person->sDOB =
		datetimezoneformat(p.birth_dt_tm,p.birth_tz,"YYYY-MM-DD",curtimezonedef) ;010
 
		; Encounter Data
		pop_orders_reply_out->orders_list[x]->encounter->encounter_id = e.encntr_id
		pop_orders_reply_out->orders_list[x]->encounter->encounter_type_cd = e.encntr_type_cd
		pop_orders_reply_out->orders_list[x]->encounter->encounter_type_disp = uar_get_code_display(e.encntr_type_cd)
		pop_orders_reply_out->orders_list[x]->encounter->encounter_type_class_cd = e.encntr_type_class_cd
		pop_orders_reply_out->orders_list[x]->encounter->encounter_type_class_disp = uar_get_code_display(e.encntr_type_class_cd)
		pop_orders_reply_out->orders_list[x]->encounter->arrive_date = e.arrive_dt_tm
		if (e.arrive_dt_tm is null)
			pop_orders_reply_out->orders_list[x]->encounter->arrive_date = e.reg_dt_tm
		endif
		pop_orders_reply_out->orders_list[x]->encounter->discharge_date = e.disch_dt_tm
		pop_orders_reply_out->orders_list[x]->encounter->fin_nbr = ea.alias
 
		; Encounter Location Data
		pop_orders_reply_out->orders_list[x]->encounter->patient_location->location_cd = e.location_cd
		pop_orders_reply_out->orders_list[x]->encounter->patient_location->location_disp = uar_get_code_display(e.location_cd)
		pop_orders_reply_out->orders_list[x]->encounter->patient_location->loc_bed_cd = e.loc_bed_cd
		pop_orders_reply_out->orders_list[x]->encounter->patient_location->loc_bed_disp = uar_get_code_display(e.loc_bed_cd)
		pop_orders_reply_out->orders_list[x]->encounter->patient_location->loc_building_cd = e.loc_building_cd
		pop_orders_reply_out->orders_list[x]->encounter->patient_location->loc_building_disp =
			uar_get_code_display(e.loc_building_cd)
		pop_orders_reply_out->orders_list[x]->encounter->patient_location->loc_facility_cd = e.loc_facility_cd
		pop_orders_reply_out->orders_list[x]->encounter->patient_location->loc_facility_disp =
			uar_get_code_display(e.loc_facility_cd)
		pop_orders_reply_out->orders_list[x]->encounter->patient_location->loc_nurse_unit_cd = e.loc_nurse_unit_cd
		pop_orders_reply_out->orders_list[x]->encounter->patient_location->loc_nurse_unit_disp =
			uar_get_code_display(e.loc_nurse_unit_cd)
		pop_orders_reply_out->orders_list[x]->encounter->patient_location->loc_room_cd = e.loc_room_cd
		pop_orders_reply_out->orders_list[x]->encounter->patient_location->loc_room_disp = uar_get_code_display(e.loc_room_cd)
		pop_orders_reply_out->orders_list[x]->encounter->patient_location->loc_temp_cd = e.loc_temp_cd
		pop_orders_reply_out->orders_list[x]->encounter->patient_location->loc_temp_disp = uar_get_code_display(e.loc_temp_cd)
	foot report
		stat = alterlist(pop_orders_reply_out->orders_list,x)
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("ParseComponents Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetOrderDiagnosis(null) ;;006 ++
;  Description: Subroutine to retrieve order related diagnosis
**************************************************************************/
subroutine GetOrderDiagnosis(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetOrderDiagnosis Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set order_cnt = size(pop_orders_reply_out->orders_list,5)
	set idx = 1
	if(order_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
		ner.parent_entity_id
		, ner.priority
		, n.source_string
		, n.source_identifier_keycap
		, n.concept_cki
	from orders o
		, nomen_entity_reltn   ner
		, nomenclature   n
	plan o where expand(idx,1,order_cnt,o.order_id,pop_orders_reply_out->orders_list[idx].order_id)
	join ner where ner.encntr_id = outerjoin(o.encntr_id)
		and ner.parent_entity_name = "ORDERS"
		and ner.parent_entity_id = outerjoin(o.order_id)
		and ner.child_entity_name = "DIAGNOSIS"
	join n where ner.nomenclature_id = n.nomenclature_id
	order by
		ner.parent_entity_id
		, ner.priority
	head ner.parent_entity_id
		x = 0
	detail
		x = x + 1
		pos = locateval(idx,1,order_cnt,o.order_id,pop_orders_reply_out->orders_list[idx].order_id)
		if(pos > 0)
			stat = alterlist(pop_orders_reply_out->orders_list[pos].order_diagnosis,x)
			pop_orders_reply_out->orders_list[pos].order_diagnosis[x].name = n.source_string
			pop_orders_reply_out->orders_list[pos].order_diagnosis[x].code = n.source_identifier_keycap
			pop_orders_reply_out->orders_list[pos].order_diagnosis[x].code_type = piece(n.concept_cki,"!",1,"")
		endif
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetOrderDiagnosis Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;End Sub
 
/*************************************************************************
;  Name: GetOrderPriority(null) = null
;  Description: Subroutine to retrieve order priority
**************************************************************************/
subroutine GetOrderPriority(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetOrderPriority Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set order_cnt = size(pop_orders_reply_out->orders_list,5)
	set idx = 1
	if(order_cnt > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
 	free record temp_cv
 	record temp_cv (
 		1 list[*]
 			2 code_value = f8
 			2 display = vc
 			2 code_set = i4
 	)
 	set queryStartTm = cnvtdatetime(curdate, curtime3)
	select into "nl:"
	from order_detail od
		, code_value cv
	plan od where expand(idx,1,order_cnt,od.order_id,pop_orders_reply_out->orders_list[idx].order_id)
	join cv where cv.code_value = od.oe_field_value and cv.code_set in (1304,1905,2054,4010)
	order by od.order_id
	head od.order_id
		x = 0
		stat = initrec(temp_cv)
	detail
		x = x + 1
		stat = alterlist(temp_cv->list,x)
		temp_cv->list[x].code_set = cv.code_set
		temp_cv->list[x].code_value = cv.code_value
		temp_cv->list[x].display = cv.display
	foot od.order_id
		priority = 0
		pha_priority = 0
		coll_priority = 0
		rep_priority = 0
 
 		for(i = 1 to size(temp_cv->list,5))
 			case(temp_cv->list[i].code_set)
 				of 1304: priority = i
 				of 4010: pha_priority = i
 				of 2054: coll_priority = i
 				of 1905: rep_priority = i
			endcase
		endfor
 
		pos = locateval(idx,1,order_cnt,od.order_id,pop_orders_reply_out->orders_list[idx].order_id)
 
		; Since priority can come from multiple sources, we use a heirarchy to try and return the most relevant
		if(priority > 0)
 			pop_orders_reply_out->orders_list[pos].order_priority.id = temp_cv->list[priority].code_value
			pop_orders_reply_out->orders_list[pos].order_priority.name =  temp_cv->list[priority].display
 		elseif(pha_priority > 0)
 			pop_orders_reply_out->orders_list[pos].order_priority.id = temp_cv->list[pha_priority].code_value
			pop_orders_reply_out->orders_list[pos].order_priority.name =  temp_cv->list[pha_priority].display
 		elseif(coll_priority > 0)
 			pop_orders_reply_out->orders_list[pos].order_priority.id = temp_cv->list[coll_priority].code_value
			pop_orders_reply_out->orders_list[pos].order_priority.name =  temp_cv->list[coll_priority].display
 		elseif(rep_priority > 0)
			pop_orders_reply_out->orders_list[pos].order_priority.id = temp_cv->list[rep_priority].code_value
			pop_orders_reply_out->orders_list[pos].order_priority.name =  temp_cv->list[rep_priority].display
		endif
	with nocounter, expand = value(exp), time = value(timeOutThreshold)
 
	;keeping track of cumulative time out
	set timeOutThreshold = timeOutThreshold - datetimediff(cnvtdatetime(curdate,curtime3),queryStartTm,5)
	;exits the script because query timed out
	if(timeOutThreshold < 1)
		go to EXIT_SCRIPT
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetOrderPriority Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
end ;End Sub
 
end
go
 
