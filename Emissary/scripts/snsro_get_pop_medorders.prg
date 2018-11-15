/*~BB~************************************************************************
  *
*  Copyright Notice:  (c) 2018 Sansoro Health, LLC
*
*  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
*  This material contains the valuable properties and trade secrets of
*  Sansoro Health, United States of
*  America, embodying substantial creative efforts and
*  confidential information, ideas and expressions, no part of which
*  may be reproduced or transmitted in any form or by any means, or
*  retained in any storage or retrieval system without the express
*  written permission of Sansoro Health.
*
   ~BE~***********************************************************************/
  /****************************************************************************
      Source file name:     snsro_pop_get_medorders.prg
      Object name:          snsro_pop_get_medorders
      Program purpose:      Retrieve medication orders from ORDERS table based on
      						date range parameters.
      Tables read:			ORDERS, PERSON, ENCOUNTER, PRSNL
      Tables updated:       NONE
      Executing from:       Emissary Service
      Special Notes:      	This population query will check for maximum records
      						and a maximum date range and if those are exceeded
      						a failure status and message will get returned.
******************************************************************************/
/***********************************************************************
  *                   MODIFICATION CONTROL LOG                       *
 ***********************************************************************
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
   000 10/19/16 DJP                	Initial write
   001 12/14/16	DJP					Added created_updated dt/tm and facility object
   002 12/27/16	DJP					Added error code for "Z" status, no data
   003 01/09/17 DJP					Added Patient Location Object, Removed Facility Object
   004 01/12/17 DJP					Changed End Time from Required to Optional Default "" to Now minus 1 minute
   005 01/25/17 DJP					Moved Location Object to within Encounter Object
   006 03/06/17	DJP					Added ErrorHandler2 fields
   007 05/04/17	DJP					Add NDC to ingredient object
   008 05/18/17 DJP					Add Gender/DOB to Person Object
   009 06/09/17 JCO					Added prn_ind
   010 06/21/17 JCO					Added Medication_Basis for orig_ord_as_flag
   011 07/10/17 DJP					UTC date/time code changes
   012 07/10/17 DJP 			 	Check for From Date > To Date
   013 07/19/17 DJP					Changed mapping of createdupdateddatetime from oa.updt_dtTm to oa.action_dt_tm
   014 07/19/17 DJP					Added IngredientLevel NDC subroutine; Removed NDC tables from OrdersIngredients
   015 07/25/17 DJP					Removed reviewed status flag restriction, Added restriction on order action_sequence
 									Added restriction on template order flag
   016 07/26/17 DJP					Added check on end_effective_dt_tm for pa and ea; added qualification on active_ind for pa and ea
   017 07/28/17 DJP 				Reinstated reviewed status flag restriction with  > 0
   018 08/01/17 DJP					Fix therapeutic class/subclass and freq type
   019 08/07/17 JCO					Changed %i to execute; updated ErrorHandler
   020 08/24/17 JCO					Added OR to date range query driver
   021 09/07/17 DJP					Remove OR in date range query driver and revert to using oa.updt_dt_tm
   022 09/08/17 DJP					Changed OrderDetails and OrderIngredients to populate
   								 	missing fields (MedBasis/Therapeutic/Subtherapeutic class
   								 	and objects (Ingredient object in 2nd instance)
   023 09/08/17 DJP					Set Order Status Cd and Order Status Display to Action Type Cd and Action Type Display
   024 09/20/17 DJP					Added = sign to reviewed status flag restriction on the subroutines not requesting verified meds
   025 09/21/17 DJP					Added outerjoins to fields on prsnl table in the GetOrderDetails subroutine
   026 09/22/17 DJP					Added prn_reason and number_of_refills
   027 09/25/17 DJP					Create IngredientLevelRxNorm subroutine remove RxNorm from GetOrderIngredients
   028 12/28/17 DJP					Added med fields (brand/generic/dea sch/daw,therapy type)
   029 01/03/18 DJP					Fix for Order Details and Actions to be in sync
   030 03/02/18 DJP					Add IsTitrate Field to payload
   031 03/22/18 RJC					Added version code and copyright block
   032 04/11/18 DJP					Added string Birthdate to person object
   033 06/11/18	DJP					Comment out MAXREC on Selects
   034 06/19/18 RJC					Added strength, strength unit, dispense from, fixed issue with NDC, brand,
  									generic not showing on all meds, fixed it so ingredient only shows if id differs from med,
  									fixed verified status bug, added admin_instructions and performed code cleanup
  									added rate & rate unit
   035 06/21/18 RJC					Added Max/Min Dose
   036 07/25/18 RJC					Fixed issue with invalid number where ocs.cki isn't numeric
   037 07/31/18	RJC					Additional performance improvements.
   038 08/09/18 RJC					Changed max rec behavior. Max recs will no longer error out. It will return the max recs and
									once the limit is reached, it return all recs tied to the same second.
   039 08/14/18 RJC					Made expand clause variable depending on number of elements in record
   040 08/29/18 STV                 Rework for the nonutc environments and use of functions
***********************************************************************/
drop program snsro_get_pop_medorders go
create program snsro_get_pop_medorders
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "Username:" = ""  			;REQUIRED. Valid HNA Millennium user account.
	, "Beg Date:" = ""				;REQUIRED. Beginning of bookmark date range.
	, "End Date:" = ""				;REQUIRED. End of bookmark date range.
	, "Verified Status:" = ""		;REQUIRED  0 False 1= True (Verified)
	, "Order Status:" = ""			;OPTIONAL. 1=Active 2 = All
	, "Include Rx Norm:" = "0"      ;OPTIONAL.
	, "Include NDC:" = "0"			;OPTIONAL.
	, "Facility_Code_List" = ""		;OPTIONAL. List of location facility codes from code set 220.
	, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
	, "Time Max" = 3600				;DO NOT USE. Undocumented value to override maximum date range in seconds.
 
with OUTDEV, USERNAME, FROM_DATE, TO_DATE, VERIFIED_STATUS, ORDER_STATUS, INC_RX_NORM, INC_NDC, LOC_LIST, DEBUG_FLAG, TIME_MAX
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL changed to Emissary version ;031
**************************************************************************/
set sVersion = "1.16.6.1"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
;380003 - rx_get_item
free record 380003_req
record 380003_req (
  1 care_locn_cd = f8
  1 pharm_type_cd = f8
  1 facility_loc_cd = f8
  1 qual [*]
    2 item_id = f8
  1 get_orc_info_ind = i2
  1 get_comment_text_ind = i2
  1 get_ord_sent_info_ind = i2
  1 def_dispense_category_cd = f8
  1 encounter_type_cd = f8
  1 parent_item_id = f8
  1 options_pref = i4
  1 birthdate = dq8
  1 financial_class_cd = f8
)
 
free record 380003_rep
record 380003_rep (
1 qual [* ]
     2 item_id = f8
     2 form_cd = f8
     2 dispense_category_cd = f8
     2 alternate_dispense_category_cd = f8
     2 order_sentence_id = f8
     2 med_type_flag = i2
     2 med_filter_ind = i2
     2 intermittent_filter_ind = i2
     2 continuous_filter_ind = i2
     2 floorstock_ind = i2
     2 always_dispense_from_flag = i2
     2 oe_format_flag = i2
     2 strength = f8
     2 strength_unit_cd = f8
     2 volume = f8
     2 volume_unit_cd = f8
     2 used_as_base_ind = i2
     2 divisible_ind = i2
     2 base_issue_factor = f8
     2 prn_reason_cd = f8
     2 infinite_div_ind = i2
     2 reusable_ind = i2
     2 alert_qual [* ]
       3 order_alert_cd = f8
     2 order_alert1_cd = f8
     2 order_alert2_cd = f8
     2 comment1_id = f8
     2 comment1_type = i4
     2 comment2_id = f8
     2 comment2_type = i4
     2 comment1 = vc
     2 comment2 = vc
     2 given_strength = c25
     2 default_par_doses = i4
     2 max_par_supply = i4
     2 cki = vc
     2 multumid = vc
     2 manf_item_id = f8
     2 awp = f8
     2 awp_factor = f8
     2 cost1 = f8
     2 cost2 = f8
     2 dispense_qty = f8
     2 dispense_qty_cd = f8
     2 price_sched_id = f8
     2 ndc = vc
     2 item_description = vc
     2 brand_name = vc
     2 generic_name = vc
     2 manufacturer_cd = f8
     2 manufacturer_disp = c40
     2 manufacturer_desc = c60
     2 primary_manf_item_id = f8
     2 formulary_status_cd = f8
     2 long_description = vc
     2 oeformatid = f8
     2 orderabletypeflag = i2
     2 synonymid = f8
     2 catalogcd = f8
     2 catalogdescription = vc
     2 catalogtypecd = f8
     2 mnemonicstr = vc
     2 primarymnemonic = vc
     2 altselcatid = f8
     2 qual [* ]
       3 sequence = i4
       3 oe_field_value = f8
       3 oe_field_id = f8
       3 oe_field_display_value = vc
       3 oe_field_meaning_id = f8
       3 field_type_flag = i2
     2 med_oe_defaults_id = f8
     2 med_oe_strength = f8
     2 med_oe_strength_unit_cd = f8
     2 med_oe_volume = f8
     2 med_oe_volume_unit_cd = f8
     2 legal_status_cd = f8
     2 freetext_dose = vc
     2 frequency_cd = f8
     2 route_cd = f8
     2 prn_ind = i2
     2 infuse_over = f8
     2 infuse_over_cd = f8
     2 duration = f8
     2 duration_unit_cd = f8
     2 stop_type_cd = f8
     2 nbr_labels = i4
     2 ord_as_synonym_id = f8
     2 rx_qty = f8
     2 daw_cd = f8
     2 sig_codes = vc
     2 dispense_factor = f8
     2 base_pkg_type_id = f8
     2 base_pkg_qty = f8
     2 base_pkg_uom_cd = f8
     2 pkg_qty_per_pkg = f8
     2 pkg_disp_more_ind = i2
     2 medproductqual [* ]
       3 active_ind = i2
       3 med_product_id = f8
       3 manf_item_id = f8
       3 inner_pkg_type_id = f8
       3 inner_pkg_qty = f8
       3 inner_pkg_uom_cd = f8
       3 bio_equiv_ind = i2
       3 brand_ind = i2
       3 unit_dose_ind = i2
       3 manufacturer_cd = f8
       3 manufacturer_name = vc
       3 label_description = vc
       3 ndc = vc
       3 sequence = i2
       3 awp = f8
       3 awp_factor = f8
       3 formulary_status_cd = f8
       3 item_master_id = f8
       3 base_pkg_type_id = f8
       3 base_pkg_qty = f8
       3 base_pkg_uom_cd = f8
     2 active_ind = i2
     2 dispcat_flex_ind = i4
     2 pricesch_flex_ind = i4
     2 workflow_cd = f8
     2 cmpd_qty = f8
     2 warning_labels [* ]
       3 label_nbr = i4
       3 label_seq = i2
       3 label_text = vc
       3 label_default_print = i2
       3 label_exception_ind = i2
     2 tpn_balance_method_cd = f8
     2 tpn_chloride_pct = f8
     2 tpn_default_ingred_item_id = f8
     2 tpn_fill_method_cd = f8
     2 tpn_include_ions_flag = i2
     2 tpn_overfill_amt = f8
     2 tpn_overfill_unit_cd = f8
     2 tpn_preferred_cation_cd = f8
     2 tpn_product_type_flag = i2
     2 lot_tracking_ind = i2
     2 rate = f8
     2 rate_cd = f8
     2 normalized_rate = f8
     2 normalized_rate_cd = f8
     2 freetext_rate = vc
     2 ord_detail_opts [* ]
       3 facility_cd = f8
       3 age_range_id = f8
       3 oe_field_meaning_id = f8
       3 restrict_ind = i4
       3 opt_list [* ]
         4 opt_txt = vc
         4 opt_cd = f8
         4 opt_nbr = f8
         4 default_ind = i4
         4 display_seq = i4
     2 catalog_cki = vc
     2 awp_unchanged = f8
     2 skip_dispense_flag = i2
     2 waste_charge_ind = i2
     2 cms_waste_billing_unit_amt = f8
     2 cms_waste_billing_unit_uom_cd = f8
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
)
 
;380104 - rx_get_drc_rules_by_cki - 035
free record 380104_req
record 380104_req (
  1 age_in_days = i2
  1 qual [*]
    2 cki = vc
    2 type_flag = i2
)
 
free record 380104_rep
record 380104_rep (
   1 cki_list [* ]
     2 cki = vc
     2 dose_range_list [* ]
       3 dose_range_id = f8
       3 premise_id = f8
       3 min_value = f8
       3 max_value = f8
       3 dose_range_unit_cd = f8
       3 age_one = f8
       3 age_two = f8
       3 age_reltn_operator = i2
       3 age_unit_cd = f8
   1 status_data
     2 status = c1
     2 subeventstatus [1 ]
       3 operationname = c25
       3 operationstatus = c1
       3 targetobjectname = c25
       3 targetobjectvalue = vc
 )
 
;Final Reply
free record pop_medorders_reply_out
record pop_medorders_reply_out(
	1 orders_list[*]
		2 order_id 								= f8
		2 person_id 							= f8
		2 encntr_id							    = f8
		2 encntr_type_cd						= f8
		2 encntr_type_disp						= vc
		2 encntr_type_class_cd					= f8
		2 encntr_type_class_disp				= vc
		2 active_flag							= i4
		2 reference_name 						= vc
		2 clinical_name  						= vc
		2 department_name 						= vc
		2 clinical_display_line 				= vc
		2 simplified_display_line 				= vc
		2 notify_display_line 					= vc
		2 current_start_dt_tm 					= dq8
		2 projected_stop_dt_tm					= dq8
		2 stop_dt_tm							= dq8
		2 stop_type 							= vc
		2 orig_date 							= dq8
		2 valid_dose_dt_tm 						= dq8
		2 clinically_relevant_dt_tm 			= dq8
		2 suspended_dt_tm 						= dq8
		2 comment_text							= vc
		2 pharmsig_comment						= vc
		2 ordered_by 							= vc
		2 catalog_cd 							= f8
		2 catalog_disp 							= vc
		2 catalog_type_cd 						= f8
		2 catalog_type_disp 					= vc
		2 activity_type_cd 						= f8
		2 activity_type_disp 					= vc
		2 hna_order_mnemonic					= vc
		2 order_mnemonic						= vc
		2 ordered_as_mnemonic					= vc
		2 frequency								= vc
		2 strength								= vc 	;034
		2 strength_unit									;034
			3 id = f8
			3 name = vc
		2 strength_dose							= vc
		2 strength_dose_unit					= vc
		2 volume_dose							= vc
		2 volume_dose_unit						= vc
		2 duration								= vc
		2 duration_unit							= vc
		2 route									= vc
		2 pca_mode								= vc
		2 pca_ind								= i2
		2 med_order_type_cd 					= f8
		2 med_order_type_disp 					= vc
		2 order_status_cd 						= f8	;023 change source to oa.action_type_cd
		2 order_status_disp 					= vc	;023 change source to display for action_type_cd
		2 orig_ord_as_flag 						= i4
		2 synonym_id 							= f8
		2 o_cki									= vc	;035
		2 concept_cki							= vc
		2 ocs_cki								= vc
		2 ocs_cki_numeric						= i4
		2 comment_flag 							= i4
		2 order_entry_format_id					= f8
		2 therapeutic_class						= vc
		2 therapeutic_sub_class					= vc
		2 med_category_cd						= f8
		2 med_category_disp						= vc
		2 freq_schedule_id						= f8
		2 frequency_type						= vc
		2 drug_form								= vc
		2 department_status						= vc
		2 ordering_provider						= vc
		2 ordering_provider_id					= f8
		2 pharm_order_priority					= vc
		2 order_communication_type_cd			= f8
		2 order_communication_type_disp			= vc
		2 reference_text_type					= vc
		2 ndc									= vc
		2 created_updated_date_time				= dq8 	;001 ;013 change source to oa.action_dt_tm
		2 prn_ind								= i4  	;009
		2 prn_reason							= vc 	;026
		2 prn_instructions						= vc 	;026
		2 number_of_refills						= i4 	;026
		2 total_refills							= i4 	;026
		2 medication_basis						= vc  	;010
		2 oa_action_sequence					= i4 	; 022
		2 oa_action_dt_tm						= dq8  	; 022
		2 long_term_med							= i4    ;028
		2 type_of_therapy						= vc	;028
		2 previous_order_id						= vc    ;028
		2 DAW									= vc    ;028
		2 dispense_as_written					= i4    ;028
		2 DEA_schedule							= vc    ;028
		2 brand_name							= vc    ;028
		2 generic_name							= vc    ;028
		2 isTitrate								= i4    ;030
		2 admin_instructions					= vc	;034
		2 rate									= f8	;034
		2 rate_unit										;034
			3 id								= f8
			3 name								= vc
		2 ingred_list [*]
			3 order_mnemonic 					= vc
			3 ordered_as_mnemonic 				= vc
			3 order_detail_display_line 		= vc
		 	3 synonym_id 						= f8
			3 catalog_cd 						= f8
			3 catalog_disp 						= vc
			3 volume_value 						= f8
			3 volume_unit_cd 					= f8
			3 volume_unit_disp 					= vc
			3 strength							= vc
			3 strength_dose 					= f8
			3 strength_dose_unit_cd 			= f8
			3 strength_dose_unit_disp 			= vc
			3 freetext_dose 					= vc
			3 frequency_cd 						= f8
			3 frequency_disp 					= vc
			3 comp_sequence 					= i4
			3 ingredient_type_flag 				= i2
			3 iv_seq 							= i4
			3 hna_order_mnemonic 				= vc
			3 dose_quantity 					= f8
			3 dose_quantity_unit 				= f8
			3 dose_quantity_disp				= vc
			3 event_cd 							= f8
			3 normalized_rate 					= f8
			3 normalized_rate_unit_cd 			= f8
			3 normalized_rate_unit_disp 		= vc
			3 concentration 					= f8
			3 concentration_unit_cd 			= f8
			3 concentration_unit_disp			= vc
			3 include_in_total_volume_flag 		= i2
			3 ingredient_source_flag 			= i2
			3 ndc								= vc 	;007
			3 rx_norm [*]
        		4 code                  		= vc
        		4 code_type             		= vc
        		4 term_type            			= vc
		2 rx_norm[*]
			3 code								= vc
			3 code_type							= vc
			3 term_type							= vc
  		2 dispense_from									;034
  			3 pharmacy_id 						= f8
  			3 pharmacy_name						= vc
  		2 max_single_dose						= vc 	;035
  		2 min_single_dose						= vc	;035
		2 item_id								= f8	;034
		2 person
		  3 person_id 							= f8	;p.person_id
		  3 name_full_formatted 				= vc	;p.name_full_formatted
		  3 name_last 							= vc	;p.last_name
		  3 name_first 							= vc	;p.first_name
		  3 name_middle 						= vc	;p.middle_name
		  3 mrn									= vc    ;pa.alias
		  3 dob									= dq8 	;008
		  3 gender_id							= f8  	;008
		  3 gender_disp							= vc  	;008
		  3 sDOB								= c10 	;032
	 	2 encounter
		  3 encounter_id 						= f8	;e.encntr_id
		  3 encounter_type_cd					= f8	;e.encntr_type_cd
		  3 encounter_type_disp					= vc	;encounter type display
		  3 encounter_type_class_cd				= f8	;encounter_type_class_cd
	      3 encounter_type_class_disp			= vc	;encounter type class display
 		  3 arrive_date							= dq8	;e.admit_dt_tm
 		  3 discharge_date						= dq8	;e.discharge_dt_tm
 		  3 fin_nbr								= vc	;ea.alias
 		  3 patient_location							;003
 		  	4  location_cd              		= f8
  			4  location_disp            		= vc
  			4  loc_bed_cd               		= f8
  			4  loc_bed_disp             		= vc
  			4  loc_building_cd          		= f8
  			4  loc_building_disp        		= vc
  			4  loc_facility_cd         			= f8
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
;019 %i ccluserdir:snsro_status_block.inc
/*019 begin */
  1 status_data
    2 status 									= c1
    2 subeventstatus[1]
      3 OperationName 							= c25
      3 OperationStatus 						= c1
      3 TargetObjectName 						= c25
      3 TargetObjectValue 						= vc
      3 Code 									= c4
      3 Description 							= vc
/*019 end */
)
 
free record loc_req
record loc_req (
	1 codes[*]
		2 code_value							= f8
		2 fac_identifier						= vc
)
 
set pop_medorders_reply_out->status_data->status = "F"
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common	;019
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
set MODIFY MAXVARLEN 200000000	;038
 
 ; Input
declare sUserName						= vc with protect, noconstant("")
declare sFromDate						= vc with protect, noconstant("")
declare sToDate							= vc with protect, noconstant("")
declare iVerifiedStatus					= i4 with protect, noconstant(0)
declare iOrderStatus					= i4 with protect, noconstant(0)
declare iIncRxNorm						= i4 with protect, noconstant(0)
declare iIncNDC							= i4 with protect, noconstant(0)
declare sLocFacilities					= vc with protect, noconstant("")
declare iDebugFlag						= i2 with protect, noconstant(0)
 
; Other
declare qFromDateTime						= dq8 with protect, noconstant(cnvtdatetime(curdate, curtime3));004
declare qToDateTime							= dq8 with protect, noconstant(cnvtdatetime(curdate, curtime3));004
declare iTimeDiff						= f8
declare ndx2							= i4
declare sActiveWhereStr					= vc with public , noconstant("")
declare sLocationWhereStr				= vc with public , noconstant("")
declare UTCpos 							= i2 with protect, noconstant(0);011
declare UTCmode							= i2 with protect, noconstant(0);011
declare iMaxRecs						= i4 with protect, constant(2000) ;038
 
 ;Constants
declare c_mrn_person_alias_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING",4,"MRN"))
declare c_fin_encounter_alias_type_cd	= f8 with protect, constant(uar_get_code_by("MEANING",319,"FIN NBR"))
declare c_pharmacy_catalog_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING" ,6000 ,"PHARMACY" ) )
declare c_pharmacy_activity_type_cd		= f8 with protect, constant(uar_get_code_by("MEANING" ,106 ,"PHARMACY" ) )
declare c_ord_comment_type_cd  			= f8 with protect, constant(uar_get_code_by("MEANING", 14, "ORD COMMENT"))
declare c_pharmsig_comment_type_cd  	= f8 with protect, constant(uar_get_code_by("MEANING", 14, "PHARMSIG"))
declare c_rxnorm_map_type_cd 			= f8 with protect, constant(uar_get_code_by("MEANING", 29223, "MULTUM=RXN"))
declare c_ordered_order_status_cd		= f8 with protect, constant(uar_get_code_by("MEANING", 6004, "ORDERED"))
declare c_inprocess_order_status_cd		= f8 with protect, constant(uar_get_code_by("MEANING", 6004, "INPROCESS"))
declare c_future_order_status_cd		= f8 with protect, constant(uar_get_code_by("MEANING", 6004, "FUTURE"))
declare c_incomplete_order_status_cd	= f8 with protect, constant(uar_get_code_by("MEANING", 6004, "INCOMPLETE"))
declare c_suspended_order_status_cd		= f8 with protect, constant(uar_get_code_by("MEANING", 6004, "SUSPENDED"))
declare c_medstudent_order_status_cd	= f8 with protect, constant(uar_get_code_by("MEANING", 6004, "MEDSTUDENT"))
declare c_ref_text_1 					= vc with protect, constant("PoliciesAndProcedures")
declare c_ref_text_2 					= vc with protect, constant("NursePrep")
declare c_ref_text_4 					= vc with protect, constant("PatientEducation")
declare c_ref_text_8 					= vc with protect, constant("SchedulingInfo")
declare c_ref_text_16 					= vc with protect, constant("CareplanInfo")
declare c_ref_text_32					= vc with protect, constant("ChartingGuidelines")
declare c_ref_text_64 					= vc with protect, constant("Multum")
declare c_year_unit_cd 					= f8 with protect, constant(uar_get_code_by_cki ("CKI.CODEVALUE!3712" ))
declare c_day_unit_cd 					= f8 with protect, constant(uar_get_code_by_cki ("CKI.CODEVALUE!8423" ))
declare c_month_unit_cd 				= f8 with protect, constant(uar_get_code_by_cki ("CKI.CODEVALUE!7993" ))
declare c_week_unit_cd 					= f8 with protect, constant(uar_get_code_by_cki ("CKI.CODEVALUE!7994" ))
declare c_hour_unit_cd 					= f8 with protect, constant(uar_get_code_by_cki ("CKI.CODEVALUE!2743" ))
declare c_brand_identifier_type_cd 		= f8 with protect, constant(uar_get_code_by("MEANING",11000,"BRAND_NAME"))
declare c_generic_identifier_type_cd 	= f8 with protect, constant(uar_get_code_by("MEANING",11000,"GENERIC_NAME"))
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
;Input
set sUserName							= trim($USERNAME, 3)
set sFromDate							= trim($FROM_DATE, 3)
set sToDate 							= trim($TO_DATE, 3)
set iOrderStatus						= cnvtint($ORDER_STATUS)
set iIncRxNorm							= cnvtint($INC_RX_NORM)
set iIncNDC								= cnvtint($INC_NDC)
set iDebugFlag							= cnvtint($DEBUG_FLAG)
set sLocFacilities						= trim($LOC_LIST,3)
set itimeMax								= cnvtint($TIME_MAX)
 
; This is tied to the need_rx_verify flag on the orders table. If need_rx_verify is set to 1, verification hasn't been done.
; The variable needs to be the opposite value that is defined
if(cnvtint($VERIFIED_STATUS) = 0)
	set iVerifiedStatus = 1
else
	set iVerifiedStatus = 0
endif
 
;Other
;;+++011
set UTCmode					= CURUTC
set UTCpos						= findstring("Z",sFromDate,1,0)
 
set qFromDateTime = GetDateTime(sFromDate)
set qToDateTime = GetDateTime(sToDate)
 
 
if(iDebugFlag > 0)
	call echo(build("sUserName -> ", sUserName))
	call echo(build("sFromDate -> ", sFromDate))
	call echo(build("qFromDateTime -> ",qFromDateTime))
	call echo(build("sToDate -> ",sToDate))
	call echo(build("qToDateTime -> ", qToDateTime))
	call echo(build ("DISPLAY END DT TIME",format(qToDateTime, "@LONGDATETIME")))
	call echo(build("UTC MODE -->",UTCmode));;011
	call echo(build("UTC POS -->",UTCpos)) ;;011
	call echo(build("iOrderStatus  ->", iOrderStatus))
	call echo(build("iVerifiedStatus -->", iVerifiedStatus))
	call echo(build("iIncRxNorm  ->", iIncRxNorm))
	call echo(build("iIncNDC  ->", iIncNDC))
	call echo(build("sFromDate  ->", sFromDate))
	call echo(build("sToDate  ->", sToDate))
	call echo(build("sLocFacilities  ->",sLocFacilities))
	call echo(build("c_pharmacy_catalog_type_cd  -> ",c_pharmacy_catalog_type_cd))
	call echo(build("c_pharmacy_activity_type_cd   ->",c_pharmacy_activity_type_cd))
	call echo(build("c_mrn_person_alias_type_cd   type code ->",c_mrn_person_alias_type_cd))
	call echo(build("c_fin_encounter_alias_type_cd   type code ->",c_fin_encounter_alias_type_cd))
	call echo(build("c_ordered_order_status_cd type code ->",c_ordered_order_status_cd))
	call echo(build("c_inprocess_order_status_cd type code ->",c_inprocess_order_status_cd))
	call echo(build("c_future_order_status_cd type code ->",c_future_order_status_cd))
	call echo(build("c_incomplete_order_status_cd type code ->",c_incomplete_order_status_cd))
	call echo(build("c_suspended_order_status_cd type code ->",c_suspended_order_status_cd))
	call echo(build("c_medstudent_order_status_cd type code ->",c_medstudent_order_status_cd))
	call echo(build("c_rxnorm_map_type_cd--->",c_rxnorm_map_type_cd))
endif
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare GetMedicationOrders(null)			 				= null with protect
declare GetOrderDetails(null)					 			= null with protect
declare GetMedicationDetails(null)					 		= null with protect
declare GetOrderIngredients (null)				 			= null with protect
declare GetOrderComments (null)				     			= null with protect
declare ParseComponents(sConceptCKI = vc , item = i2)	    = null with Protect
declare ParseLocations(null)								= null with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
;Check for future dates ;012
if (qFromDateTime > qToDateTime)
	call ErrorHandler2("SELECT", "F", "VALIDATE", "From Date Greater than To Date. Refine Dates Entered.",
	"2010", "From Date Greater than To Date. Refine Dates Entered.", pop_medorders_reply_out)
	go to EXIT_SCRIPT
endif
 
; Check difference between start and end date/time does not exceed threshold
set iRet = ThreshHoldValidator(iTimeMax,"s",qFromDateTime,qToDateTime)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F", "POP_MEDORDERS", "Date Range Too Long. Refine Query.",
	"2011","Date Range Too Long. Refine Query.",pop_medorders_reply_out) ;006
	go to EXIT_SCRIPT
endif
 
 ;Populate audit
set iRet = PopulateAudit(sUserName,  0.0, pop_medorders_reply_out, sVersion)
if(iRet = 0)
	call ErrorHandler2("VALIDATE", "F","POP_MEDORDERS", "Invalid User for Audit.",
	"1001",build("UseriD is invalid: ",sUserName),pop_medorders_reply_out) ;006
	set pop_medorders_reply_out->status_data->status = "F"
	go to EXIT_SCRIPT
endif
 
;Parse locations if provided
if(sLocFacilities > " ")
	call ParseLocations(null)
endif
 
; Get Medication Orders
call GetMedicationOrders(null)
 
; Get Order Details
call GetOrderDetails(null)
 
; Get Medication Details
call GetMedicationDetails(null) ;034
 
; Get Order Ingredients
call GetOrderIngredients (null);014
 
; Get Order Comments
call GetOrderComments (null)
 
; Set audit to successful
call ErrorHandler2("SUCCESS", "S", "POP_MEDORDERS", "Successfully retrieved population medication orders.",
"0000","Successfully retrieved population medication orders.",pop_medorders_reply_out) ;006
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(pop_medorders_reply_out)
if(iDebugFlag)
	call echorecord(pop_medorders_reply_out)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_pop_medorders2.json")
	call echo(build2("_file : ", _file))
	call echojson(pop_medorders_reply_out, _file, 0)
	call echo(JSONout)
endif
 
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
#EXIT_VERSION
 
/*************************************************************************
;  Name: ParseLocations(null) = null
;  Description: Subroutine to parse a comma delimited string
**************************************************************************/
subroutine ParseLocations(null)
	if(iDebugFlag > 0)
		set loc_section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ParseLocations Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare notfnd 		= vc with constant("<not_found>")
	declare num 		= i4 with noconstant(1)
	declare str 		= vc with noconstant("")
 
	while (str != notfnd)
		set str =  piece(sLocFacilities,',',num,notfnd)
 
		if(str != notfnd)
			set stat = alterlist(loc_req->codes, num)
			set loc_req->codes[num]->code_value = cnvtint(str)
 
			 select into code_value
			 from code_value
			 where code_set = 220 and cdf_meaning = "FACILITY" and
			 loc_req->codes[num]->code_value = code_value
 
			if (curqual = 0)
				call ErrorHandler2("EXECUTE", "F", "POP_MEDORDERS", build("Invalid Facility Code: ", loc_req->codes[num]->code_value),
				"2040", build("Invalid Facility Code: ",loc_req->codes[num]->code_value),pop_medorders_reply_out)
				set stat = alterlist(pop_medorders_reply_out->orders_list,0)
				go to EXIT_SCRIPT
			endif
		endif
		set num = num + 1
	endwhile
 
	if(iDebugFlag > 0)
		call echo(concat("ParseLocations Runtime: ",
		trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), loc_section_start_dt_tm, 5)), 3),
		" seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetMedicationOrders(null)
;  Description: This will retrieve all medication orders for a patient
**************************************************************************/
subroutine GetMedicationOrders(null)
	if(iDebugFlag > 0)
		set MedOrder_Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetMedicationOrders Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	; Set Active Status clause
	If (iOrderStatus = 1)
		set sActiveWhereStr = build2("o.order_status_cd in (c_ordered_order_status_cd,c_inprocess_order_status_cd,",
		"c_future_order_status_cd,c_incomplete_order_status_cd,c_suspended_order_status_cd,c_medstudent_order_status_cd)")
	else
		set sActiveWhereStr = "o.order_status_cd > 0"
	endif
 
	;Temp record - performance improvement
	free record temp
	record temp (
		1 qual_cnt = i4
		1 qual[*]
			2 order_id = f8
			2 action_seq = i4
	)
 
	set LocSize = size(loc_req->codes,5)
 
	;Set expand control value - 039
	if(LocSize > 200)
		set exp = 2
	else
		set exp = 0
	endif
 
	; Populate temp record - 037
	select
		if(LocSize > 0)
			from order_action oa
				, orders o
				, encounter e
			plan oa where oa.updt_dt_tm between cnvtdatetime(qFromDateTime) ;021
											 and cnvtdatetime(qToDateTime)	;021
				and oa.template_order_flag in (0,1);015
			join o where o.order_id = oa.order_id
				and o.catalog_type_cd = c_pharmacy_catalog_type_cd
				and o.activity_type_cd = c_pharmacy_activity_type_cd
				and parser(sActiveWhereStr)
				and o.need_rx_verify_ind <= iVerifiedStatus
			join e where e.encntr_id = o.encntr_id
				and expand(ndx2,1,LocSize,e.loc_facility_cd,loc_req->codes[ndx2].code_value)
			order by oa.updt_dt_tm
		else
			from order_action oa
				,orders o
			plan oa where oa.updt_dt_tm between cnvtdatetime(qFromDateTime) ;021
											 and cnvtdatetime(qToDateTime)	;021
				and oa.template_order_flag in (0,1);015
			join o where o.order_id = oa.order_id
				and o.catalog_type_cd = c_pharmacy_catalog_type_cd
				and o.activity_type_cd = c_pharmacy_activity_type_cd
				and parser(sActiveWhereStr)
				and o.need_rx_verify_ind <= iVerifiedStatus
			order by oa.updt_dt_tm
		endif
	into "nl:"
		oa.order_id, oa.action_sequence, oa.updt_dt_tm
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
				stat = alterlist(temp->qual,x+99)
			endif
 
			temp->qual[x].order_id = oa.order_id
			temp->qual[x].action_seq = oa.action_sequence
		endif
	foot report
		stat = alterlist(temp->qual,x)
		temp->qual_cnt = x
	with nocounter, expand = value(exp)
 
	if(iDebugFlag)
 		call echo(build("------Qual Cnt = ",temp->qual_cnt))
 	endif
 
	;Populate audit
 	if(temp->qual_cnt > 0)
		call ErrorHandler2("Success", "S", "POP_MEDORDERS", "Successfully retrieved medication orders.","0000",
		"Successfully retrieved medication orders.", pop_medorders_reply_out) ;006
	else
		call ErrorHandler2("Success", "Z", "POP_MEDORDERS", "No records found.","0000",
		"No records found.", pop_medorders_reply_out) ;006
		go to exit_script
 	endif
 
 	; Populate main record
	declare orders_cnt = i4 with protect ,noconstant (0 )
	declare idx = i4 with protect, noconstant(0)
 
	select into "nl:"
	from (dummyt d with seq = temp->qual_cnt)
		, order_action oa
		, orders   o
		, person   p
		, person_alias   pa
		, encounter   e
		, encntr_alias   ea
		, order_catalog_synonym ocs
	plan d
	join oa where oa.order_id = temp->qual[d.seq].order_id
		and oa.action_sequence = temp->qual[d.seq].action_seq
	join o where o.order_id = oa.order_id
	join ocs where ocs.synonym_id = o.synonym_id
	join p where p.person_id = o.person_id
	join pa where pa.person_id = outerjoin(p.person_id)
		and pa.person_alias_type_cd = outerjoin(c_mrn_person_alias_type_cd)
		and pa.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate, curtime3));016
		and pa.active_ind = outerjoin(1);016
	join e where e.encntr_id = outerjoin(o.encntr_id)
	join ea where ea.encntr_id = outerjoin(e.encntr_id)
		and ea.encntr_alias_type_cd = outerjoin(c_fin_encounter_alias_type_cd)
		and ea.active_ind = outerjoin(1);016
		and ea.end_effective_dt_tm > outerjoin(cnvtdatetime(curdate, curtime3));016
	order by oa.order_id, oa.action_sequence;029
	head report
		stat = alterlist(pop_medorders_reply_out->orders_list,100)
	detail
		orders_cnt = orders_cnt + 1
 
		if ((mod(orders_cnt,10)= 1) and orders_cnt > 100)
			 stat = alterlist(pop_medorders_reply_out->orders_list, orders_cnt + 9)
		endif
 
		;Order Action
 		pop_medorders_reply_out->orders_list[orders_cnt]->order_id = oa.order_id
 		pop_medorders_reply_out->orders_list[orders_cnt]->oa_action_sequence = oa.action_sequence ;022
		pop_medorders_reply_out->orders_list[orders_cnt]->oa_action_dt_tm = oa.action_dt_tm ;022
		pop_medorders_reply_out->orders_list[orders_cnt]->created_updated_date_time = oa.updt_dt_tm ;020 oa.action_dt_tm ;001 013
 		pop_medorders_reply_out->orders_list[orders_cnt]->stop_type = uar_get_code_display(oa.stop_type_cd)
 		pop_medorders_reply_out->orders_list[orders_cnt]->order_status_cd = oa.action_type_cd;o.order_status_cd ;023
		pop_medorders_reply_out->orders_list[orders_cnt]->order_status_disp = uar_get_code_display(oa.action_type_cd) ;023
		pop_medorders_reply_out->orders_list[orders_cnt]->ordering_provider_id	= oa.order_provider_id
		pop_medorders_reply_out->orders_list[orders_cnt]->order_communication_type_cd	= oa.communication_type_cd
		pop_medorders_reply_out->orders_list[orders_cnt]->order_communication_type_disp =
		uar_get_code_display(oa.communication_type_cd)
 
		; Order Data
		pop_medorders_reply_out->orders_list[orders_cnt]->active_flag = o.active_ind
		pop_medorders_reply_out->orders_list[orders_cnt]->reference_name= o.hna_order_mnemonic
		pop_medorders_reply_out->orders_list[orders_cnt]->clinical_name =  o.ordered_as_mnemonic""
		pop_medorders_reply_out->orders_list[orders_cnt]->department_name = o.dept_misc_line
		pop_medorders_reply_out->orders_list[orders_cnt]->clinical_display_line = substring(1,255,o.clinical_display_line)
		pop_medorders_reply_out->orders_list[orders_cnt]->simplified_display_line = o.simplified_display_line
		pop_medorders_reply_out->orders_list[orders_cnt]->notify_display_line = ""
		pop_medorders_reply_out->orders_list[orders_cnt]->current_start_dt_tm = o.current_start_dt_tm
		pop_medorders_reply_out->orders_list[orders_cnt]->projected_stop_dt_tm = o.projected_stop_dt_tm
		pop_medorders_reply_out->orders_list[orders_cnt]->stop_dt_tm = o.projected_stop_dt_tm
		pop_medorders_reply_out->orders_list[orders_cnt]->orig_date = o.orig_order_dt_tm
		pop_medorders_reply_out->orders_list[orders_cnt]->valid_dose_dt_tm = o.valid_dose_dt_tm
		pop_medorders_reply_out->orders_list[orders_cnt]->clinically_relevant_dt_tm = o.clin_relevant_updt_dt_tm
		pop_medorders_reply_out->orders_list[orders_cnt]->suspended_dt_tm = o.suspend_effective_dt_tm
		pop_medorders_reply_out->orders_list[orders_cnt]->ordered_by = ""
		pop_medorders_reply_out->orders_list[orders_cnt]->catalog_cd = o.catalog_cd
		pop_medorders_reply_out->orders_list[orders_cnt]->catalog_disp = uar_get_code_display(o.catalog_cd)
		pop_medorders_reply_out->orders_list[orders_cnt]->catalog_type_cd = o.catalog_type_cd
		pop_medorders_reply_out->orders_list[orders_cnt]->catalog_type_disp = uar_get_code_display(o.catalog_type_cd)
		pop_medorders_reply_out->orders_list[orders_cnt]->activity_type_cd = o.activity_type_cd
		pop_medorders_reply_out->orders_list[orders_cnt]->activity_type_disp = uar_get_code_display(o.activity_type_cd)
		pop_medorders_reply_out->orders_list[orders_cnt]->hna_order_mnemonic = o.hna_order_mnemonic
		pop_medorders_reply_out->orders_list[orders_cnt]->order_mnemonic = o.order_mnemonic
		pop_medorders_reply_out->orders_list[orders_cnt]->ordered_as_mnemonic = o.ordered_as_mnemonic
		pop_medorders_reply_out->orders_list[orders_cnt]->frequency = ""
		pop_medorders_reply_out->orders_list[orders_cnt]->strength_dose= ""
		pop_medorders_reply_out->orders_list[orders_cnt]->strength_dose_unit= ""
		pop_medorders_reply_out->orders_list[orders_cnt]->volume_dose= ""
		pop_medorders_reply_out->orders_list[orders_cnt]->volume_dose_unit= ""
		pop_medorders_reply_out->orders_list[orders_cnt]->duration = ""
		pop_medorders_reply_out->orders_list[orders_cnt]->duration_unit	= ""
		pop_medorders_reply_out->orders_list[orders_cnt]->route	= ""
		pop_medorders_reply_out->orders_list[orders_cnt]->pca_mode = ""
		pop_medorders_reply_out->orders_list[orders_cnt]->pca_ind = -1
		pop_medorders_reply_out->orders_list[orders_cnt]->med_order_type_cd = o.med_order_type_cd
		pop_medorders_reply_out->orders_list[orders_cnt]->med_order_type_disp = uar_get_code_display(o.med_order_type_cd)
		pop_medorders_reply_out->orders_list[orders_cnt]->orig_ord_as_flag = o.orig_ord_as_flag
		pop_medorders_reply_out->orders_list[orders_cnt]->synonym_id = o.synonym_id
		pop_medorders_reply_out->orders_list[orders_cnt].concept_cki = ParseComponents(o.cki,2)
		pop_medorders_reply_out->orders_list[orders_cnt].o_cki = o.cki
		pop_medorders_reply_out->orders_list[orders_cnt].ocs_cki = ParseComponents(ocs.concept_cki,2)
		pop_medorders_reply_out->orders_list[orders_cnt].ocs_cki_numeric = cnvtint(ParseComponents(ocs.concept_cki,2))
		pop_medorders_reply_out->orders_list[orders_cnt]->comment_flag 	= -1
		pop_medorders_reply_out->orders_list[orders_cnt]->order_entry_format_id	= o.oe_format_id
		pop_medorders_reply_out->orders_list[orders_cnt]->therapeutic_class	= ""
		pop_medorders_reply_out->orders_list[orders_cnt]->therapeutic_sub_class	= ""
		pop_medorders_reply_out->orders_list[orders_cnt]->med_category_cd	= o.dcp_clin_cat_cd
		pop_medorders_reply_out->orders_list[orders_cnt]->med_category_disp = uar_get_code_display(o.dcp_clin_cat_cd)
		pop_medorders_reply_out->orders_list[orders_cnt]->freq_schedule_id	= 0
		pop_medorders_reply_out->orders_list[orders_cnt]->frequency_type	= ""
		pop_medorders_reply_out->orders_list[orders_cnt]->drug_form			= ""
		pop_medorders_reply_out->orders_list[orders_cnt]->department_status	= uar_get_code_display(o.dept_status_cd)
		pop_medorders_reply_out->orders_list[orders_cnt]->medication_basis = getMedicationBasis(o.orig_ord_as_flag) /*010*/
		pop_medorders_reply_out->orders_list[orders_cnt]->ordering_provider	= ""
		pop_medorders_reply_out->orders_list[orders_cnt]->pharm_order_priority	= ""
		pop_medorders_reply_out->orders_list[orders_cnt]->reference_text_type = cnvtstring(o.ref_text_mask)
		pop_medorders_reply_out->orders_list[orders_cnt]->prn_ind = o.prn_ind	;009
		pop_medorders_reply_out->orders_list[orders_cnt]->prn_reason = ""  ;026
		pop_medorders_reply_out->orders_list[orders_cnt]->prn_instructions = "" ;026
		pop_medorders_reply_out->orders_list[orders_cnt]->number_of_refills = -1 ;026
		pop_medorders_reply_out->orders_list[orders_cnt]->total_refills = -1 ;026
 
		; Person Data
		pop_medorders_reply_out->orders_list[orders_cnt]->person_id = p.person_id
		pop_medorders_reply_out->orders_list[orders_cnt]->person->person_id = p.person_id
		pop_medorders_reply_out->orders_list[orders_cnt]->person->name_full_formatted = p.name_full_formatted
		pop_medorders_reply_out->orders_list[orders_cnt]->person->name_first = p.name_first
		pop_medorders_reply_out->orders_list[orders_cnt]->person->name_last = p.name_last
		pop_medorders_reply_out->orders_list[orders_cnt]->person->name_middle = p.name_middle
		pop_medorders_reply_out->orders_list[orders_cnt]->person->mrn = pa.alias
		pop_medorders_reply_out->orders_list[orders_cnt]->person->dob = p.birth_dt_tm ;008
		pop_medorders_reply_out->orders_list[orders_cnt]->person->gender_id = p.sex_cd ;008
		pop_medorders_reply_out->orders_list[orders_cnt]->person->gender_disp = uar_get_code_display(p.sex_cd);008
		pop_medorders_reply_out->orders_list[orders_cnt]->person->sDOB =
		datetimezoneformat(p.birth_dt_tm,p.birth_tz,"YYYY-MM-DD",curtimezonedef) ;032
 
		;Encounter Data
		pop_medorders_reply_out->orders_list[orders_cnt]->encntr_id = e.encntr_id
		pop_medorders_reply_out->orders_list[orders_cnt]->encntr_type_cd = e.encntr_type_cd
		pop_medorders_reply_out->orders_list[orders_cnt]->encntr_type_disp = uar_get_code_display(e.encntr_type_cd)
		pop_medorders_reply_out->orders_list[orders_cnt]->encntr_type_class_cd = e.encntr_type_class_cd
		pop_medorders_reply_out->orders_list[orders_cnt]->encntr_type_class_disp = uar_get_code_display(e.encntr_type_class_cd)
		pop_medorders_reply_out->orders_list[orders_cnt]->encounter->encounter_id = e.encntr_id
		pop_medorders_reply_out->orders_list[orders_cnt]->encounter->encounter_type_cd = e.encntr_type_cd
		pop_medorders_reply_out->orders_list[orders_cnt]->encounter->encounter_type_disp = uar_get_code_display(e.encntr_type_cd)
		pop_medorders_reply_out->orders_list[orders_cnt]->encounter->encounter_type_class_cd = e.encntr_type_class_cd
		pop_medorders_reply_out->orders_list[orders_cnt]->encounter->encounter_type_class_disp =
			uar_get_code_display(e.encntr_type_class_cd)
		pop_medorders_reply_out->orders_list[orders_cnt]->encounter->arrive_date = e.arrive_dt_tm
		if (e.arrive_dt_tm is null)
			pop_medorders_reply_out->orders_list[orders_cnt]->encounter->arrive_date = e.reg_dt_tm
		endif
		pop_medorders_reply_out->orders_list[orders_cnt]->encounter->discharge_date = e.disch_dt_tm
		pop_medorders_reply_out->orders_list[orders_cnt]->encounter->fin_nbr = ea.alias
 
		;Patient Location Data
		pop_medorders_reply_out->orders_list[orders_cnt]->encounter->patient_location->location_cd = e.location_cd
		pop_medorders_reply_out->orders_list[orders_cnt]->encounter->patient_location->location_disp =
		 uar_get_code_display(e.location_cd)
		pop_medorders_reply_out->orders_list[orders_cnt]->encounter->patient_location->loc_bed_cd = e.loc_bed_cd
		pop_medorders_reply_out->orders_list[orders_cnt]->encounter->patient_location->loc_bed_disp = uar_get_code_display(e.loc_bed_cd)
		pop_medorders_reply_out->orders_list[orders_cnt]->encounter->patient_location->loc_building_cd = e.loc_building_cd
		pop_medorders_reply_out->orders_list[orders_cnt]->encounter->patient_location->loc_building_disp =
			uar_get_code_display(e.loc_building_cd)
		pop_medorders_reply_out->orders_list[orders_cnt]->encounter->patient_location->loc_facility_cd = e.loc_facility_cd
		pop_medorders_reply_out->orders_list[orders_cnt]->encounter->patient_location->loc_facility_disp =
		 uar_get_code_display(e.loc_facility_cd)
		pop_medorders_reply_out->orders_list[orders_cnt]->encounter->patient_location->loc_nurse_unit_cd = e.loc_nurse_unit_cd
		pop_medorders_reply_out->orders_list[orders_cnt]->encounter->patient_location->loc_nurse_unit_disp =
		 uar_get_code_display(e.loc_nurse_unit_cd)
		pop_medorders_reply_out->orders_list[orders_cnt]->encounter->patient_location->loc_room_cd = e.loc_room_cd
		pop_medorders_reply_out->orders_list[orders_cnt]->encounter->patient_location->loc_room_disp =
		 uar_get_code_display(e.loc_room_cd)
		pop_medorders_reply_out->orders_list[orders_cnt]->encounter->patient_location->loc_temp_cd = e.loc_temp_cd
		pop_medorders_reply_out->orders_list[orders_cnt]->encounter->patient_location->loc_temp_disp =
		 uar_get_code_display(e.loc_temp_cd)
 
 		case(o.ref_text_mask)
 			/* REFERENCE TEXT TYPES:
 				1 - PoliciesAndProcedures	Description: Policies and Procedures
 				2 - NursePrep				Description: Nurse Prep
 				4 - PatientEducation		Description: Patient Education
 				8 - SchedulingInfo			Description: Scheduling Info
 				16 - CareplanInfo			Description: CarePlan Info
 				32 - ChartingGuidelines		Description: Charting Guidelines
 				64 - Multum					Description: Multum */
 			of 1:
 				pop_medorders_reply_out->orders_list[orders_cnt]->reference_text_type = c_ref_text_1
 			of 2:
 				pop_medorders_reply_out->orders_list[orders_cnt]->reference_text_type = c_ref_text_2
 			of 4:
 				pop_medorders_reply_out->orders_list[orders_cnt]->reference_text_type = c_ref_text_4
 			of 8:
 				pop_medorders_reply_out->orders_list[orders_cnt]->reference_text_type = c_ref_text_8
 			of 16:
 				pop_medorders_reply_out->orders_list[orders_cnt]->reference_text_type = c_ref_text_16
 			of 32:
 				pop_medorders_reply_out->orders_list[orders_cnt]->reference_text_type = c_ref_text_32
 			of 64:
 				pop_medorders_reply_out->orders_list[orders_cnt]->reference_text_type = c_ref_text_64
 		endcase
 
	foot report
		stat = alterlist(pop_medorders_reply_out->orders_list,orders_cnt)
	with nocounter, maxcol = 99999 ;, maxrec= 2000 ;033
 
   if(iDebugFlag > 0)
		call echo(concat("GetMedicationOrders Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), MedOrder_Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetOrderDetails(null)
;  Description: This will retrieve all order details for an order
**************************************************************************/
subroutine GetOrderDetails(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetOrderDetails Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare meds_cnt 	= i4  with protect ,noconstant (0 )
	set meds_cnt 		= size(pop_medorders_reply_out->orders_list,5)
 
	select into "nl:"
		od.oe_field_meaning
		, od.oe_field_display_value
		, od.oe_field_value
		, pr.name_full_formatted
		, pr.person_id
		, oa.communication_type_cd
	from   (dummyt d with seq = meds_cnt)
			,order_action oa
            ,order_detail od
            , prsnl pr
	plan d
    join od where od.order_id = pop_medorders_reply_out->orders_list[d.seq ]->order_id
    join oa where oa.order_id = od.order_id
   	join pr  where pr.person_id = outerjoin(oa.action_personnel_id) and pr.active_ind = outerjoin(1)	/*006*/ ;025
	order by od.action_sequence
	detail
		if(od.action_sequence = pop_medorders_reply_out->orders_list[d.seq ]->oa_action_sequence)
			case(trim(od.oe_field_meaning,3))
				of "FREQ":
					pop_medorders_reply_out->orders_list[d.seq ]->frequency = trim(od.oe_field_display_value,3)
				of "RXROUTE":
					pop_medorders_reply_out->orders_list[d.seq ]->route = trim(od.oe_field_display_value,3)
				of "STRENGTHDOSE":
					pop_medorders_reply_out->orders_list[d.seq ]->strength_dose = trim(od.oe_field_display_value,3)
				of "VOLUMEDOSE":
					pop_medorders_reply_out->orders_list[d.seq ]->volume_dose = trim(od.oe_field_display_value,3)
				of "STRENGTHDOSEUNIT":
					pop_medorders_reply_out->orders_list[d.seq ]->strength_dose_unit = trim(od.oe_field_display_value,3)
				of "VOLUMEDOSEUNIT":
					pop_medorders_reply_out->orders_list[d.seq ]->volume_dose_unit = trim(od.oe_field_display_value,3)
				of "PCAMODE":
					pop_medorders_reply_out->orders_list[d.seq ]->pca_mode = trim(od.oe_field_display_value,3)
					pop_medorders_reply_out->orders_list[d.seq ]->pca_ind = 1
				of "FREQSCHEDID": ;003
					pop_medorders_reply_out->orders_list[d.seq]->freq_schedule_id = od.oe_field_value
				of "STOPDTTM": ;004
					pop_medorders_reply_out->orders_list[d.seq ]->stop_dt_tm = cnvtdatetime(trim(od.oe_field_display_value,3))
				of "DRUGFORM": ;006
					pop_medorders_reply_out->orders_list[d.seq ]->drug_form = trim(od.oe_field_display_value,3)
				of "RXPRIORITY": ;006
					pop_medorders_reply_out->orders_list[d.seq ]->pharm_order_priority = trim(od.oe_field_display_value,3)
				of "DURATIONUNIT": ;009
					pop_medorders_reply_out->orders_list[d.seq ]->duration_unit	= trim(od.oe_field_display_value,3)
				of "DURATION": ;009
					pop_medorders_reply_out->orders_list[d.seq ]->duration = trim(od.oe_field_display_value,3)
				of "PRNREASON": ;026
	 				pop_medorders_reply_out->orders_list[d.seq ]->prn_reason = trim(od.oe_field_display_value,3)
	 			of "PRNINSTRUCTIONS": ;026
	 				pop_medorders_reply_out->orders_list[d.seq ]->prn_instructions = trim(od.oe_field_display_value,3)
	 			of "NBRREFILLS": ;026
	 				pop_medorders_reply_out->orders_list[d.seq ]->number_of_refills = cnvtint(trim(od.oe_field_display_value,3))
	 			of "TOTALREFILLS": ;026
	 				pop_medorders_reply_out->orders_list[d.seq ]->total_refills = cnvtint(trim(od.oe_field_display_value,3))
	  			of "DAW": ;028
					pop_medorders_reply_out->orders_list[d.seq]->DAW = trim(od.oe_field_display_value,3)
				of "TYPEOFTHERAPY": ;028
					pop_medorders_reply_out->orders_list[d.seq]->type_of_therapy  = trim(od.oe_field_display_value,3)
			 	of "TITRATEIND": ;029
	 				pop_medorders_reply_out->orders_list[d.seq]->isTitrate = cnvtint(trim(od.oe_field_display_value,3))
	 			of "DISPENSEFROMLOC": ;034
	 				pop_medorders_reply_out->orders_list[d.seq]->dispense_from.pharmacy_id = od.oe_field_value
	 				pop_medorders_reply_out->orders_list[d.seq]->dispense_from.pharmacy_name  = trim(od.oe_field_display_value,3)
	 			of "SPECINX": ;034
	 				pop_medorders_reply_out->orders_list[d.seq]->admin_instructions = trim(od.oe_field_display_value,3)
	 			of "RATE": ;034
	 				pop_medorders_reply_out->orders_list[d.seq]->rate = od.oe_field_value
	 			of "RATEUNIT": ;034
	 				pop_medorders_reply_out->orders_list[d.seq]->rate_unit.id = od.oe_field_value
	 				pop_medorders_reply_out->orders_list[d.seq]->rate_unit.name = trim(od.oe_field_display_value,3)
	 		endcase
 
			if (pop_medorders_reply_out->orders_list[d.seq]->type_of_therapy = "Maintenance") ;028
 				pop_medorders_reply_out->orders_list[d.seq]->long_term_med = 1
 			endif
 			if (cnvtupper(pop_medorders_reply_out->orders_list[d.seq].DAW) = "YES") ;028
 				pop_medorders_reply_out->orders_list[d.seq].dispense_as_written = 1
 			endif
 		endif
 		if(oa.action_sequence = 1)
 			pop_medorders_reply_out->orders_list[d.seq]->ordering_provider = pr.name_full_formatted
			pop_medorders_reply_out->orders_list[d.seq]->ordering_provider_id = pr.person_id
 
 			pop_medorders_reply_out->orders_list[d.seq]->order_communication_type_cd = oa.communication_type_cd ;022
 			pop_medorders_reply_out->orders_list[d.seq]->order_communication_type_disp = uar_get_code_display(oa.communication_type_cd)
 		endif
	with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetOrderDetails Runtime: ",
        trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
        " seconds"))
	endif
 
end  ;End Sub
 
/*************************************************************************
;  Name: GetMedicationDetails(null)
;  Description: Get Medication Details - brand, generic, therapeutic class, strength, etc.
**************************************************************************/
subroutine GetMedicationDetails(null)
	if(iDebugFlag > 0)
		set meddetail_section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetMedicationDetails Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set meds_cnt = size(pop_medorders_reply_out->orders_list,5)
 	declare cki_id = vc
 	declare ord_mnemonic = vc
 	declare drug_synonym_id = vc
 
	;Get item_id from order_product table
	if(iDebugFlag)
		set test_name = "check order product table"
		set test_now = cnvtdatetime(curdate,curtime3)
	endif
 
	select into "nl:"
	from (dummyt d with seq = meds_cnt)
		, order_product op
	plan d
	join op where op.order_id = pop_medorders_reply_out->orders_list[d.seq].order_id
	head report
		x = 0
	detail
		x = x + 1
		stat = alterlist(380003_req->qual,x)
		380003_req->qual[x].item_id = op.item_id
		pop_medorders_reply_out->orders_list[d.seq].item_id = op.item_id
	with nocounter
 
 	if(iDebugFlag)
 		set test_diff = timestampdiff(cnvtdatetime(curdate,curtime3),test_now)
		call echo(build2(test_name," runtime: ",test_diff))
	endif
 
	; Get details from request 380003_rep
	if(size(380003_req->qual,5) > 0) ;037
		if(iDebugFlag)
			set test_name = "request 380003"
			set test_now = cnvtdatetime(curdate,curtime3)
		endif
		set iApplication = 380000
		set iTask = 380000
		set iRequest = 380003
 
		;Execute request
		set stat = tdbexecute(iApplication,iTask,iRequest,"REC",380003_req,"REC",380003_rep)
 
		if(380003_rep->status_data.status = "F")
			call echorecord(380003_rep)
			call ErrorHandler2("EXECUTE", "F", "MEDICATIONS", "Could not get rx_item details (380003).",
			"9999", build("Could not get rx_item details (380003)"), pop_medorders_reply_out)
			go to EXIT_SCRIPT
		else
			select into "nl:"
			from (dummyt d with seq = size(380003_rep->qual,5))
				,(dummyt d1 with seq = size(pop_medorders_reply_out->orders_list,5))
			plan d
			join d1 where pop_medorders_reply_out->orders_list[d1.seq].item_id = 380003_rep->qual[d.seq].item_id
			detail
				pop_medorders_reply_out->orders_list[d1.seq].brand_name = 380003_rep->qual[d.seq].brand_name
				pop_medorders_reply_out->orders_list[d1.seq].generic_name = 380003_rep->qual[d.seq].generic_name
				pop_medorders_reply_out->orders_list[d1.seq].strength = cnvtstring(380003_rep->qual[d.seq].strength)
				pop_medorders_reply_out->orders_list[d1.seq].strength_unit.id = 380003_rep->qual[d.seq].strength_unit_cd
				pop_medorders_reply_out->orders_list[d1.seq].strength_unit.name = uar_get_code_display(380003_rep->qual[d.seq].strength_unit_cd)
				if(iIncNDC)
					pop_medorders_reply_out->orders_list[d1.seq].ndc = 380003_rep->qual[d.seq].ndc
				endif
			with nocounter
		endif
 
		if(iDebugFlag)
	 		set test_diff = timestampdiff(cnvtdatetime(curdate,curtime3),test_now)
			call echo(build2(test_name," runtime: ",test_diff))
		endif
	endif
 
	; Check Med Identifier Table for orders without item_id
	if(iDebugFlag)
		set test_name = "check med identifier table"
		set test_now = cnvtdatetime(curdate,curtime3)
	endif
 
	select into "nl:"
	from (dummyt d with seq = meds_cnt)
		, synonym_item_r sir
		,med_identifier mi
		, medication_definition md
	plan d where pop_medorders_reply_out->orders_list[d.seq].item_id = 0
	join sir where sir.synonym_id = pop_medorders_reply_out->orders_list[d.seq].synonym_id
	join mi where mi.item_id = sir.item_id
	 	and mi.active_ind = 1
		and mi.sequence = 1
	join md where md.item_id = mi.item_id
	detail
		pop_medorders_reply_out->orders_list[d.seq].item_id = 1
		case(uar_get_code_meaning(mi.med_identifier_type_cd))
			of "BRAND_NAME":
				if(mi.med_product_id = 0)
					pop_medorders_reply_out->orders_list[d.seq].brand_name = mi.value
				endif
			of "GENERIC_NAME":
				if(mi.med_product_id = 0)
					pop_medorders_reply_out->orders_list[d.seq].generic_name = mi.value
				endif
			of "NDC":
				if(iIncNDC)
					pop_medorders_reply_out->orders_list[d.seq].ndc = mi.value
				endif
			if(md.strength != 0)
				pop_medorders_reply_out->orders_list[d.seq].strength = cnvtstring(md.strength)
				pop_medorders_reply_out->orders_list[d.seq].strength_unit.id = md.strength_unit_cd
				pop_medorders_reply_out->orders_list[d.seq].strength_unit.name = uar_get_code_display(md.strength_unit_cd)
			else
				pop_medorders_reply_out->orders_list[d.seq].strength = md.given_strength
			endif
		endcase
	with nocounter
 
 	if(iDebugFlag)
 		set test_diff = timestampdiff(cnvtdatetime(curdate,curtime3),test_now)
		call echo(build2(test_name," runtime: ",test_diff))
	endif
 
	; Check against med guide link table if the other two request didn't yield results
	if(iDebugFlag)
		set test_name = "check med guide link table"
		set test_now = cnvtdatetime(curdate,curtime3)
	endif
 
	select into "nl:"
	from (dummyt d with seq = meds_cnt)
		, mltm_med_guide_link mmgl
		, mltm_ndc_core_description mncd
		, mltm_ndc_main_drug_code mnmdc
		, mltm_product_strength mps
	plan d where pop_medorders_reply_out->orders_list[d.seq].item_id = 0
		and pop_medorders_reply_out->orders_list[d.seq].ocs_cki > ""
	join mmgl where (mmgl.brand_description_ident = pop_medorders_reply_out->orders_list[d.seq].ocs_cki
		or mmgl.generic_description_ident = pop_medorders_reply_out->orders_list[d.seq].ocs_cki
		or mmgl.trade_description_ident = pop_medorders_reply_out->orders_list[d.seq].ocs_cki)
	join mncd where mncd.main_multum_drug_code = mmgl.main_multum_drug_code
		and mncd.ndc_code = mmgl.ndc_code
		and mncd.repackaged = "F"
		and mncd.obsolete_date is null
	join mnmdc where mnmdc.main_multum_drug_code = mncd.main_multum_drug_code
	join mps where mps.product_strength_code = mnmdc.product_strength_code
	detail
		pop_medorders_reply_out->orders_list[d.seq].item_id = 2
		pop_medorders_reply_out->orders_list[d.seq].brand_name = mmgl.brand_description
		pop_medorders_reply_out->orders_list[d.seq].generic_name = mmgl.primary_description
		if(iIncNDC)
			pop_medorders_reply_out->orders_list[d.seq].ndc = mncd.ndc_formatted
		endif
		pop_medorders_reply_out->orders_list[d.seq].strength = mps.product_strength_description
	with nocounter
 
	if(iDebugFlag)
 		set test_diff = timestampdiff(cnvtdatetime(curdate,curtime3),test_now)
		call echo(build2(test_name," runtime: ",test_diff))
	endif
 
	; Brand/Generic, Strength & NDC based on ordered as mnemonic if methods above didn't work
 	if(iDebugFlag)
		set test_name = "brand/generic from multum"
		set test_now = cnvtdatetime(curdate,curtime3)
	endif
 
	select distinct into "nl:"
		mi2.value
		,mnbn.brand_description
		,mps.product_strength_description
		,mncd.ndc_formatted
	from  (dummyt d with seq = meds_cnt)
		, mlld_rxn_map mrm
		, mlld_ndc_main_drug_code mnmdc
		, mlld_ndc_core_description mncd
		, mlld_ndc_brand_name mnbn
		, mltm_product_strength mps
		, med_identifier mi
		, med_identifier mi2
	plan d where pop_medorders_reply_out->orders_list[d.seq].item_id = 0
		and pop_medorders_reply_out->orders_list[d.seq].ocs_cki_numeric > 0
	join mrm where mrm.drug_synonym_id = pop_medorders_reply_out->orders_list[d.seq].ocs_cki_numeric
	join mncd where mncd.main_multum_drug_code = mrm.main_multum_drug_code
		and mncd.repackaged = "F"
		and mncd.obsolete_date is null
	join mnbn where mnbn.brand_code = mncd.brand_code
	join mnmdc where mnmdc.main_multum_drug_code = mrm.main_multum_drug_code
	join mps where mps.product_strength_code = mnmdc.product_strength_code
	join mi where mi.value = outerjoin(mncd.ndc_formatted)
	join mi2 where mi2.item_id = outerjoin(mi.item_id)
		and mi2.med_identifier_type_cd = outerjoin(c_generic_identifier_type_cd)
	order by mncd.ndc_code
	detail
		pop_medorders_reply_out->orders_list[d.seq].item_id = 3
		if(cnvtlower(trim(substring(1,findstring(" ",pop_medorders_reply_out->orders_list[d.seq].ordered_as_mnemonic),
			mnbn.brand_description),3)) =
			cnvtlower(trim(substring(1,findstring(" ",pop_medorders_reply_out->orders_list[d.seq].ordered_as_mnemonic),
			pop_medorders_reply_out->orders_list[d.seq].ordered_as_mnemonic),3)))
 
			pop_medorders_reply_out->orders_list[d.seq].brand_name = mnbn.brand_description
			if(mi2.value > " ")
				pop_medorders_reply_out->orders_list[d.seq].generic_name = mi2.value
			endif
			if(iIncNDC)
				pop_medorders_reply_out->orders_list[d.seq].ndc = mncd.ndc_formatted
			endif
		else
			if(iIncNDC)
				pop_medorders_reply_out->orders_list[d.seq].ndc = mncd.ndc_formatted
			endif
		endif
		pop_medorders_reply_out->orders_list[d.seq].strength = mps.product_strength_description
	with nocounter
 
	if(iDebugFlag)
 		set test_diff = timestampdiff(cnvtdatetime(curdate,curtime3),test_now)
		call echo(build2(test_name," runtime: ",test_diff))
	endif
 
	; Therapeutic Class/Subclass
	if(iDebugFlag)
		set test_name = "get Therapeutic Class/Subclass"
		set test_now = cnvtdatetime(curdate,curtime3)
	endif
 
	select into "nl:"
    from (dummyt d with seq = meds_cnt)
    	, mltm_category_drug_xref mcdx
		,mltm_drug_categories c
		,mltm_category_sub_xref mcsx
		,mltm_drug_categories c1
		,mltm_ndc_main_drug_code   mnmdc
		,mltm_product_strength mps
	plan d
	join mcdx where mcdx.drug_identifier = pop_medorders_reply_out->orders_list[d.seq].concept_cki
	join mnmdc where mcdx.drug_identifier = mnmdc.drug_identifier
	join c where c.multum_category_id = outerjoin(mcdx.multum_category_id)
	join mcsx where mcsx.sub_category_id = outerjoin(c.multum_category_id)
	join c1 where c1.multum_category_id = outerjoin(mcsx.multum_category_id)
	join mps where mps.product_strength_code = mnmdc.product_strength_code
	detail
 		pop_medorders_reply_out->orders_list[d.seq]->therapeutic_sub_class = trim(c.category_name,3)  ;12
		pop_medorders_reply_out->orders_list[d.seq]->therapeutic_class = trim(c1.category_name,3)	   ;12
		pop_medorders_reply_out->orders_list[d.seq]->DEA_schedule = mnmdc.csa_schedule ;032
		if(pop_medorders_reply_out->orders_list[d.seq].item_id = 0)
			pop_medorders_reply_out->orders_list[d.seq].item_id = 4
			pop_medorders_reply_out->orders_list[d.seq].strength = mps.product_strength_description
		endif
	with nocounter
 
	if(iDebugFlag)
 			set test_diff = timestampdiff(cnvtdatetime(curdate,curtime3),test_now)
		call echo(build2(test_name," runtime: ",test_diff))
	endif
 
	;009 - Get Freqeuncy Type by Frequency Code Value
	if(iDebugFlag)
		set test_name = "Get Freqeuncy Type by Frequency Code Value"
		set test_now = cnvtdatetime(curdate,curtime3)
	endif
 
	select into "nl:"
		fs.frequency_id
	from (dummyt d with seq = value(meds_cnt))
		,frequency_schedule fs
	plan d
	join fs where fs.frequency_id = pop_medorders_reply_out->orders_list[d.seq]->freq_schedule_id
		and fs.active_ind = 1
		and (fs.activity_type_cd = c_pharmacy_catalog_type_cd OR fs.activity_type_cd = 0)
	detail
		case(fs.frequency_type)
			of 0: ;not set
				pop_medorders_reply_out->orders_list[d.seq]->frequency_type = "NOT SET"
			of 1: ;scheduled (e.g. BID)
				pop_medorders_reply_out->orders_list[d.seq]->frequency_type = "SCHEDULED"
			of 2: ;scheduled (e.g. qDay (M-T-F))
				pop_medorders_reply_out->orders_list[d.seq]->frequency_type = "SCHEDULED"
			of 3: ;interval (e.g. qWeek)
				pop_medorders_reply_out->orders_list[d.seq]->frequency_type = "INTERVAL"
			of 4: ;one time only -- (e.g. paramedic)
				pop_medorders_reply_out->orders_list[d.seq]->frequency_type = "ONE-TIME ONLY"
			of 5: ;unscheduled -- (e.g. FLUSH)
				pop_medorders_reply_out->orders_list[d.seq]->frequency_type = "UNSCHEDULED"
		endcase
	with nocounter
 
	if(iDebugFlag)
 		set test_diff = timestampdiff(cnvtdatetime(curdate,curtime3),test_now)
		call echo(build2(test_name," runtime: ",test_diff))
	endif
 
	; Get RxNorm if requested
	if(iIncRxNorm > 0)
		if(iDebugFlag)
			set test_name = "rxnorm data"
			set test_now = cnvtdatetime(curdate,curtime3)
		endif
 
		select into "nl:"
		from (dummyt d with seq = meds_cnt)
			,order_catalog_synonym ocs
			,cmt_cross_map ccm
		plan d
		join ocs where ocs.synonym_id = pop_medorders_reply_out->orders_list[d.seq]->synonym_id	;027
			and ocs.active_ind = 1														;027
		join ccm where ccm.concept_cki = outerjoin(ocs.concept_cki) and ccm.map_type_cd = outerjoin(c_rxnorm_map_type_cd)
		order by d.seq
		head d.seq
			rxn = 0
		detail
			if(ccm.target_concept_cki > " ")
				rxn = rxn + 1
				stat = alterlist(pop_medorders_reply_out->orders_list[d.seq]->rx_norm,rxn)
 
				pop_medorders_reply_out->orders_list[d.seq]->rx_norm[rxn]->code = ParseComponents(ccm.target_concept_cki,2)
				pop_medorders_reply_out->orders_list[d.seq]->rx_norm[rxn]->code_type = ParseComponents(ccm.target_concept_cki, 1)
				pop_medorders_reply_out->orders_list[d.seq]->rx_norm[rxn]->term_type = ParseComponents(ccm.target_concept_cki, 1)
			endif
		with nocounter
 
		if(iDebugFlag)
	 		set test_diff = timestampdiff(cnvtdatetime(curdate,curtime3),test_now)
			call echo(build2(test_name," runtime: ",test_diff))
		endif
	endif
 
	; Get Max/Min dose ranges - following query created from request 380104 - 037
	if(iDebugFlag)
		set test_name = "request 380104"
		set test_now = cnvtdatetime(curdate,curtime3)
	endif
 
	select distinct into "nl:"
		pop_order_id = pop_medorders_reply_out->orders_list[d.seq].order_id
		,dp2.parent_premise_id
		,age_one = dp2.value1
		,age_two = dp2.value2
		,age_unit_cd = dp2.value_unit_cd
		,dp2.relational_operator_flag
		,ddr.drc_dose_range_id
		,ddr.drc_premise_id
		,ddr.min_value
		,ddr.max_value
		,ddr.value_unit_cd
	from (dummyt d with seq = meds_cnt)
		,order_catalog_synonym ocs
		,drc_group_reltn dgr
		,drc_form_reltn dfr
		,drc_premise dp
		,drc_premise dp2
		,drc_dose_range ddr
	plan d where pop_medorders_reply_out->orders_list[d.seq].o_cki > " "
	join ocs where ocs.catalog_cd = pop_medorders_reply_out->orders_list[d.seq].catalog_cd
		and ocs.cki > ""
	join dgr where dgr.drug_synonym_id = cnvtreal (substring (13 ,64 ,ocs.cki ) )
		and outerjoin (1 ) = dgr.active_ind
	join dfr where dfr.drc_group_id = dgr.drc_group_id
		and outerjoin (1 ) = dfr.active_ind
	join dp where dp.dose_range_check_id = dfr.dose_range_check_id
		and outerjoin (1 ) = dp.active_ind
	join dp2 where dp2.parent_premise_id = dp.drc_premise_id
		and dp2.relational_operator_flag < 8
		and dp2.value_type_flag = 1
		and dp2.active_ind = 1
	join ddr where ddr.drc_premise_id = dp.drc_premise_id
		and ddr.type_flag = 1	;1 = Single Dose, 2 = Daily Dose
		and outerjoin (1 ) = ddr.active_ind
	order by ocs.cki, dp2.parent_premise_id
	head pop_order_id
		val1 = 0
		val2 = 0
		passed = 0
		patient_age = datetimediff(pop_medorders_reply_out->orders_list[d.seq].created_updated_date_time,
			pop_medorders_reply_out->orders_list[d.seq].person.dob)
	detail
		; Convert time ranges to days
		case (dp2.value_unit_cd)
			of value(c_year_unit_cd):
				val1 = dp2.value1 * 365
				val2 = dp2.value2 * 365
			of value(c_month_unit_cd):
				val1 = dp2.value1 * 30
				val2 = dp2.value2 * 30
			of value(c_week_unit_cd):
				val1 = dp2.value1 * 7
				val2 = dp2.value2 * 7
			of value(c_day_unit_cd):
				val1 = dp2.value1
				val2 = dp2.value2
			of value(c_hour_unit_cd):
				val1 = dp2.value1 / 24
				val2 = dp2.value2 / 24
		endcase
		if(val1 = 365)
			val1 = 360
		endif
		if(val1 = 730)
			val1 = 720
		endif
 
		; Verify if patient's age matches any premises
		if(passed = 0)
			case (dp2.relational_operator_flag)
				of 0: ;Premise: Pt age must equal dose range age (in days).
					if(patient_age = val1)
						passed = 1
 
						pop_medorders_reply_out->orders_list[d.seq].max_single_dose =
						trim(build2(trim(cnvtstring(ddr.max_value),3)," ",uar_get_code_display(ddr.value_unit_cd)),3)
 
						pop_medorders_reply_out->orders_list[d.seq].min_single_dose =
						trim(build2(trim(cnvtstring(ddr.min_value),3)," ",uar_get_code_display(ddr.value_unit_cd)),3)
					endif
				of 1: ;Premise: Pt age must be less than dose range age (in days).
					if(patient_age < val1)
						passed = 1
 
						pop_medorders_reply_out->orders_list[d.seq].max_single_dose =
						trim(build2(trim(cnvtstring(ddr.max_value),3)," ",uar_get_code_display(ddr.value_unit_cd)),3)
 
						pop_medorders_reply_out->orders_list[d.seq].min_single_dose =
						trim(build2(trim(cnvtstring(ddr.min_value),3)," ",uar_get_code_display(ddr.value_unit_cd)),3)
					endif
				of 2: ;Premise: Pt age must be greater than dose range age (in days).
					if(patient_age > val1)
						passed = 1
 
						pop_medorders_reply_out->orders_list[d.seq].max_single_dose =
						trim(build2(trim(cnvtstring(ddr.max_value),3)," ",uar_get_code_display(ddr.value_unit_cd)),3)
 
						pop_medorders_reply_out->orders_list[d.seq].min_single_dose =
						trim(build2(trim(cnvtstring(ddr.min_value),3)," ",uar_get_code_display(ddr.value_unit_cd)),3)
					endif
				of 3: ;Premise: Pt age must be less than or equal to dose range age (in days).
					if(patient_age <= val1)
						passed = 1
 
						pop_medorders_reply_out->orders_list[d.seq].max_single_dose =
						trim(build2(trim(cnvtstring(ddr.max_value),3)," ",uar_get_code_display(ddr.value_unit_cd)),3)
 
						pop_medorders_reply_out->orders_list[d.seq].min_single_dose =
						trim(build2(trim(cnvtstring(ddr.min_value),3)," ",uar_get_code_display(ddr.value_unit_cd)),3)
					endif
				of 4: ;Premise: Pt age must be greater than or equal to dose range age (in days).
					if(patient_age >= val1)
						passed = 1
 
						pop_medorders_reply_out->orders_list[d.seq].max_single_dose =
						trim(build2(trim(cnvtstring(ddr.max_value),3)," ",uar_get_code_display(ddr.value_unit_cd)),3)
 
						pop_medorders_reply_out->orders_list[d.seq].min_single_dose =
						trim(build2(trim(cnvtstring(ddr.min_value),3)," ",uar_get_code_display(ddr.value_unit_cd)),3)
					endif
				of 5: ;Premise: Pt age must not be equal to dose range age (in days).
					if(patient_age != val1)
						passed = 1
 
						pop_medorders_reply_out->orders_list[d.seq].max_single_dose =
						trim(build2(trim(cnvtstring(ddr.max_value),3)," ",uar_get_code_display(ddr.value_unit_cd)),3)
 
						pop_medorders_reply_out->orders_list[d.seq].min_single_dose =
						trim(build2(trim(cnvtstring(ddr.min_value),3)," ",uar_get_code_display(ddr.value_unit_cd)),3)
					endif
				of 6: ;Premise: Pt age must be between to dose range ages (in days).
					if(patient_age >= val1 and patient_age < val2)
						passed = 1
 
						pop_medorders_reply_out->orders_list[d.seq].max_single_dose =
						trim(build2(trim(cnvtstring(ddr.max_value),3)," ",uar_get_code_display(ddr.value_unit_cd)),3)
 
						pop_medorders_reply_out->orders_list[d.seq].min_single_dose =
						trim(build2(trim(cnvtstring(ddr.min_value),3)," ",uar_get_code_display(ddr.value_unit_cd)),3)
					endif
				of 7: ;Premise: Pt age must be outside of dose range ages (in days).
					if(patient_age < val1 or patient_age > val2)
						passed = 1
 
						pop_medorders_reply_out->orders_list[d.seq].max_single_dose =
						trim(build2(trim(cnvtstring(ddr.max_value),3)," ",uar_get_code_display(ddr.value_unit_cd)),3)
 
						pop_medorders_reply_out->orders_list[d.seq].min_single_dose =
						trim(build2(trim(cnvtstring(ddr.min_value),3)," ",uar_get_code_display(ddr.value_unit_cd)),3)
					endif
			endcase
		endif
	with nocounter
 
	if(iDebugFlag)
 		set test_diff = timestampdiff(cnvtdatetime(curdate,curtime3),test_now)
		call echo(build2(test_name," runtime: ",test_diff))
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("GetMedicationDetails Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), meddetail_section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetOrderIngredients(null)
;  Description: This will retrieve all order ingredients for an order
**************************************************************************/
subroutine GetOrderIngredients(null)
	if(iDebugFlag > 0)
		set ingr_section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetOrderIngredients Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set ingred_cnt 			= size(pop_medorders_reply_out->orders_list, 5)
 
	select distinct into "nl:"
	from
		(dummyt   d  with seq = value(ingred_cnt))
		, order_action   oa
		, order_ingredient   oi
		, orders   o
		, code_value_event_r   cver
	plan d
	join oa where oa.order_id = pop_medorders_reply_out->orders_list[d.seq ]->order_id
		and oa.action_sequence = pop_medorders_reply_out->orders_list[d.seq ]->oa_action_sequence
		and oa.action_dt_tm = cnvtdatetime(pop_medorders_reply_out->orders_list[d.seq ]->oa_action_dt_tm)
	join o where o.order_id = oa.order_id
	join oi where oi.order_id = oa.order_id
		and oi.action_sequence = o.last_ingred_action_sequence
	join cver where cver.parent_cd =  oi.catalog_cd
	order by oa.order_id, oa.action_sequence, oi.synonym_id
	head  oa.order_id  oa.action_sequence ; oi.comp_sequence ;;;-007
		icnt = 0
	detail
	  	if (oa.action_dt_tm = pop_medorders_reply_out->orders_list[d.seq]->oa_action_dt_tm) ;029
			if(oi.synonym_id != o.synonym_id)
				icnt = icnt + 1
				stat = alterlist(pop_medorders_reply_out->orders_list[d.seq]->ingred_list,icnt)
 
		 		pop_medorders_reply_out->orders_list[d.seq]->ingred_list[icnt]->order_mnemonic = oi.order_mnemonic
				pop_medorders_reply_out->orders_list[d.seq]->ingred_list[icnt]->order_detail_display_line = oi.order_detail_display_line
				pop_medorders_reply_out->orders_list[d.seq]->ingred_list[icnt]->ordered_as_mnemonic = oi.ordered_as_mnemonic
				pop_medorders_reply_out->orders_list[d.seq]->ingred_list[icnt]->synonym_id = oi.synonym_id
				pop_medorders_reply_out->orders_list[d.seq]->ingred_list[icnt]->catalog_cd  =  oi.catalog_cd
				pop_medorders_reply_out->orders_list[d.seq]->ingred_list[icnt]->catalog_disp = uar_get_code_display(oi.catalog_cd)
				pop_medorders_reply_out->orders_list[d.seq]->ingred_list[icnt]->volume_value = oi.volume
				pop_medorders_reply_out->orders_list[d.seq]->ingred_list[icnt]->volume_unit_disp = uar_get_code_display(oi.volume_unit)
				pop_medorders_reply_out->orders_list[d.seq]->ingred_list[icnt].strength_dose = oi.strength
				pop_medorders_reply_out->orders_list[d.seq]->ingred_list[icnt].strength_dose_unit_disp = uar_get_code_display(oi.strength_unit)
				pop_medorders_reply_out->orders_list[d.seq]->ingred_list[icnt]->freetext_dose = oi.freetext_dose
				pop_medorders_reply_out->orders_list[d.seq]->ingred_list[icnt]->frequency_cd = oi.freq_cd
				pop_medorders_reply_out->orders_list[d.seq]->ingred_list[icnt]->frequency_disp = uar_get_code_display(oi.freq_cd)
				pop_medorders_reply_out->orders_list[d.seq]->ingred_list[icnt]->comp_sequence = oi.comp_sequence
				pop_medorders_reply_out->orders_list[d.seq]->ingred_list[icnt]->ingredient_type_flag = oi.ingredient_type_flag
				pop_medorders_reply_out->orders_list[d.seq]->ingred_list[icnt]->iv_seq = oi.iv_seq
				pop_medorders_reply_out->orders_list[d.seq]->ingred_list[icnt]->hna_order_mnemonic = oi.hna_order_mnemonic
				pop_medorders_reply_out->orders_list[d.seq]->ingred_list[icnt]->dose_quantity = oi.dose_quantity
				pop_medorders_reply_out->orders_list[d.seq]->ingred_list[icnt]->dose_quantity_unit = oi.dose_quantity_unit
				pop_medorders_reply_out->orders_list[d.seq]->ingred_list[icnt]->dose_quantity_disp =
						uar_get_code_display(oi.dose_quantity_unit)
				pop_medorders_reply_out->orders_list[d.seq]->ingred_list[icnt]->event_cd = cver.event_cd
				pop_medorders_reply_out->orders_list[d.seq]->ingred_list[icnt]->normalized_rate = oi.normalized_rate
				pop_medorders_reply_out->orders_list[d.seq]->ingred_list[icnt]->normalized_rate_unit_disp =
				 uar_get_code_display(oi.normalized_rate_unit_cd)
				pop_medorders_reply_out->orders_list[d.seq]->ingred_list[icnt]->normalized_rate_unit_cd = oi.normalized_rate_unit_cd
				pop_medorders_reply_out->orders_list[d.seq]->ingred_list[icnt]->concentration = oi.concentration
				pop_medorders_reply_out->orders_list[d.seq]->ingred_list[icnt]->concentration_unit_cd = oi.concentration_unit_cd
				pop_medorders_reply_out->orders_list[d.seq]->ingred_list[icnt]->concentration_unit_disp =
				 uar_get_code_display(oi.concentration_unit_cd)
				pop_medorders_reply_out->orders_list[d.seq]->ingred_list[icnt]->include_in_total_volume_flag = oi.include_in_total_volume_flag
				pop_medorders_reply_out->orders_list[d.seq]->ingred_list[icnt]->ingredient_source_flag = oi.ingredient_source_flag
			endif
		endif ; 029
	with nocounter, maxcol = 99999
 
	;Get Ingredient Strength, NDC & RxNorm
	for(x = 1 to size(pop_medorders_reply_out->orders_list,5))
		set ingredSize = size(pop_medorders_reply_out->orders_list[x].ingred_list,5)
		if(ingredSize > 0)
			for(i = 1 to ingredSize)
				select into "nl:"
			    from order_catalog_synonym ocs
			    	, mltm_mmdc_name_map mmnm
					, mltm_ndc_main_drug_code   mnmdc
					, mltm_ndc_core_description mncd
					, mltm_product_strength mps
				plan ocs where ocs.synonym_id = pop_medorders_reply_out->orders_list[x].ingred_list[i].synonym_id
				join mmnm where mmnm.drug_synonym_id = cnvtreal(substring(8,10,ocs.concept_cki))
				join mnmdc where mnmdc.main_multum_drug_code = mmnm.main_multum_drug_code
				join mncd where mncd.main_multum_drug_code = mnmdc.main_multum_drug_code
				join mps where mps.product_strength_code = mnmdc.product_strength_code
				detail
			 		pop_medorders_reply_out->orders_list[x].ingred_list[i].strength = mps.product_strength_description
					if(iIncNDC)
			 			pop_medorders_reply_out->orders_list[x].ingred_list[i].ndc = mncd.ndc_formatted
					endif
				with nocounter
 
				; Get RxNorm if requested
				if(iIncRxNorm > 0)
					select into "nl:"
						ocs.synonym_id, ccm.target_concept_cki
					from order_catalog_synonym ocs
						,cmt_cross_map ccm
					plan ocs where ocs.synonym_id = pop_medorders_reply_out->orders_list[x].ingred_list[i].synonym_id
						and ocs.active_ind = 1
					join ccm where ccm.concept_cki = outerjoin(ocs.concept_cki) and ccm.map_type_cd = outerjoin(c_rxnorm_map_type_cd)
					order by  ocs.synonym_id
					head ocs.synonym_id
						irx_cnt = 0
					detail
						irx_cnt = irx_cnt + 1
						stat = alterlist(pop_medorders_reply_out->orders_list[x].ingred_list[i].rx_norm,irx_cnt)
 
						pop_medorders_reply_out->orders_list[x].ingred_list[i].rx_norm[irx_cnt]->code =
						ParseComponents(ccm.target_concept_cki,2)
 
						pop_medorders_reply_out->orders_list[x].ingred_list[i].rx_norm[irx_cnt]->code_type =
						ParseComponents(ccm.target_concept_cki, 1)
 
						pop_medorders_reply_out->orders_list[x].ingred_list[i].rx_norm[irx_cnt]->term_type =
						ParseComponents(ccm.target_concept_cki, 1)
					with nocounter
				endif
			endfor
		endif
	endfor
 
	if(iDebugFlag > 0)
		call echo(concat("GetOrderIngredients Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), ingr_section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetOrderComments(null)
;  Description: Retrieve the latest order comment
**************************************************************************/
subroutine GetOrderComments(null)
	if(iDebugFlag > 0)
		set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("GetOrderComments Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare comment_cnt			= i4  with protect ,noconstant (0 )
	declare ord_comment_text 	= vc
	declare pharmsig_comment_text = vc
 
	set comment_cnt 			= size(pop_medorders_reply_out->orders_list, 5)
 
    select into "nl:"
    	oc.order_id
    	,oc.comment_type_cd
    	,lt.long_text
    from (dummyt d with seq = value(comment_cnt)),
		order_comment oc,
        long_text lt
    plan d
	join oc where oc.order_id = pop_medorders_reply_out->orders_list[d.seq ]->order_id
        and oc.comment_type_cd in (c_ord_comment_type_cd, c_pharmsig_comment_type_cd)
    join lt where lt.long_text_id = oc.long_text_id
		and lt.active_ind = 1
    order by oc.order_id, oc.action_sequence
    head oc.order_id
    	ord_comment_text = ""
    	pharmsig_comment_text = ""
    detail
		if (oc.comment_type_cd = c_ord_comment_type_cd)
			pop_medorders_reply_out->orders_list[d.seq]->comment_flag = 1
			ord_comment_text = concat(ord_comment_text, " ", lt.long_text)
		else
			pharmsig_comment_text = concat(pharmsig_comment_text," ",lt.long_text)
		endif
	foot oc.order_id
		pop_medorders_reply_out->orders_list[d.seq]->comment_text = trim(ord_comment_text,3)
		pop_medorders_reply_out->orders_list[d.seq]->pharmsig_comment = trim(pharmsig_comment_text,3)
    with nocounter
 
	if(iDebugFlag > 0)
		call echo(concat("GetOrderComments Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: ParseComponents((sConceptCKI = vc , item = i2))
;  Description: Subroutine to parse a ! delimited string
**************************************************************************/
subroutine ParseComponents(sConceptCKI, item)
	if(iDebugFlag > 0)
		set comp_section_start_dt_tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("ParseComponents Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare notfnd 		= vc with constant("<not_found>")
	declare num 		= i4 with noconstant(1)
	declare str 		= vc with noconstant("")
	declare return_str1 	= vc with noconstant("")
	declare return_str 	= vc with noconstant("")
 
	if(sConceptCKI > " ")
		while (str != notfnd)
	     	set str =  piece(sConceptCKI,'!',num,notfnd)
	     	if(str != notfnd)
				if((item = 1) and (num = 1))
					;call echo(build("FIRST -->", str))
					set return_str1 = str
					return  (return_str1)
				elseif((item = 2) and (num = 2))
					;call echo(build("SECOND -->", str))
					set return_str = str
					return  (return_str)
				endif
	     	endif
	      	set num = num + 1
	 	endwhile
	endif
 
	if(iDebugFlag > 0)
		call echo(concat("ParseComponents Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), comp_section_start_dt_tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Sub
 
end
go
 
