 /*
*  ---------------------------------------------------------------------------------------------
*  Script Name: siu_surg_mobj_out
*  Description:   SIU Surginet Outbound to the Soarian Scheduling Application
*   Library:           OEOCF23SIUSIU
*  Type:               ModObj
*  ---------------------------------------------------------------------------------------------
*  Author:         Sarah Thies
*  Library:        
*  Creation Date:  05/09/2014
*  ---------------------------------------------------------------------------------------------
*  Mod# Date                     Author   		Description & Requestor Information
*
*  1  12/10/2013	S Thies		This script is copied from M30 SIU_MODOBJ_OUT_5
*  2  12/10/2013	S Thies                 It will be modified for Surginet O/B Scheduling Messages.
*  3  01/09/2014	Hope & Sarah	Modifying to get data to Cloverleaf for Soarian
*  4  01/10/2014	Hope & Sarah	Hardcode AIS-3.1 to generic value "SURGERY"
*  5   01/24/2014	Hope & Sarah	Hardcode AIS-3.1.1 to OR SURGERY, AIS-3.1.2 to SURGERY.  
*  6   01/27/2014 S Thies                Commented out the code to populate AIL-3 to SFBH 
*                                                               (for this facility - others pending) for now
*                                                               Hardcoded AIL-3 to SFBH for unit testing only
*  7 02/03/2014 SThies                   Changing "OR SURGERY" to "ORSURGERY" at Siemen's request
*  8 03/19/2014 S Thies                  Adding Resource Codes to AIP-3 based on Location value in AIL-3
*  9 03/21/2014 S Thies                  Copying each Surginet location from AIL-3.4 to MSH-4 for Cloverleaf 
*                                                              to map Soarian Facility ID (i.e. F0A5 for SFB)
*  10 05/09/2014 S Thies                This script is copied from M30 SIU_SURG_MODOBJ_OUT_3
*  11 06/23/2014 T McArtor            this script blocks IB SIU's from BMG
*  12 08/08/2014  S Thies               Added SJHS values needed for Soarian Scheduling
*  13 04/16/2015  S Thies               Added WHH and WHW values needed for Soarian Scheduling
*  14 06/25/2015  S Thies               Adding BAH but commenting it out for now in case it's needed later
*                                                             Western Region Facilities uncommented as well
*  15 04/25/2016  S Thies               Added Bartow BRM for GO LIVE
*  ---------------------------------------------------------------------------------------------
*/

/*** Blocking logic for BMG inbound scheduled events SCH 2.2 ***/

If (oen_reply->SCHEDULE_GROUP [1]->SCH->filler_appt_id [1]->name_id = "BMG Scheduling Appointment Id")
   set oenstatus->ignore=1
   set oenstatus->ignore_text = "SKIPPED: FILLER_APPT_ID IS BMG Scheduling Appointment Id"
Endif


/*** Hardcode generic alias value of ORSURGERY in AIS-3.1 and SURGERY in AIS-3.2 ***/

Set ais_size = size(oen_reply->RESOURCE_GROUP [1]->SERVICE_AI_GROUP,5)
Declare s = i4
Set s=1
For (s = 1 to ais_size)

Set oen_reply->RESOURCE_GROUP [1]->SERVICE_AI_GROUP [s]->AIS->universal_svc_id->identifier = ""
Set oen_reply->RESOURCE_GROUP [1]->SERVICE_AI_GROUP [s]->AIS->universal_svc_id->identifier = "ORSURGERY"
Set oen_reply->RESOURCE_GROUP [1]->SERVICE_AI_GROUP [s]->AIS->universal_svc_id->text = ""
Set oen_reply->RESOURCE_GROUP [1]->SERVICE_AI_GROUP [s]->AIS->universal_svc_id->text = "SURGERY"

Endfor

/*** Move location value in AIL-3.4 to AIL-3.1 and update the value for Soarian if needed ***/
/*** AND Set Soarian generic value for AIP-3 based on Soarian location value in AIL-3.1 ***/
/*** AND Move location value in AIL-3.4 to MSH-4 for Cloverleaf to map Soarian Facility IDs  ***/

Set AIL_size = size(oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP, 5)
Declare L = i4
Set L=1
For (L = 1 to AIL_size)

If (oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->facility_id->name_id = "SFB")
Set oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->nurse_unit = ""
Set oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->nurse_unit = "SFBH"
Set oen_reply->RESOURCE_GROUP [1]->PERSONNEL_AI_GROUP [L]->AIP->personnel_resource_id [1]->id_nbr = ""
Set oen_reply->RESOURCE_GROUP [1]->PERSONNEL_AI_GROUP [L]->AIP->personnel_resource_id [1]->id_nbr = "SFORRM1"
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = ""
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = "SFB"
Endif

If (oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->facility_id->name_id = "SJW")
Set oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->nurse_unit = ""
Set oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->nurse_unit = "SJWH"
Set oen_reply->RESOURCE_GROUP [1]->PERSONNEL_AI_GROUP [L]->AIP->personnel_resource_id [1]->id_nbr = ""
Set oen_reply->RESOURCE_GROUP [1]->PERSONNEL_AI_GROUP [L]->AIP->personnel_resource_id [1]->id_nbr = "JWORRM1"
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = ""
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = "SJW"
Endif

If (oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->facility_id->name_id = "SJN")
Set oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->nurse_unit = ""
Set oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->nurse_unit = "SJHN"
Set oen_reply->RESOURCE_GROUP [1]->PERSONNEL_AI_GROUP [L]->AIP->personnel_resource_id [1]->id_nbr = ""
Set oen_reply->RESOURCE_GROUP [1]->PERSONNEL_AI_GROUP [L]->AIP->personnel_resource_id [1]->id_nbr = "JNORRM1"
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = ""
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = "SJN"
Endif

If (oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->facility_id->name_id = "SJH")
Set oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->nurse_unit = ""
Set oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->nurse_unit = "SJH"
Set oen_reply->RESOURCE_GROUP [1]->PERSONNEL_AI_GROUP [L]->AIP->personnel_resource_id [1]->id_nbr = ""
Set oen_reply->RESOURCE_GROUP [1]->PERSONNEL_AI_GROUP [L]->AIP->personnel_resource_id [1]->id_nbr = "JHORRM1"
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = ""
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = "SJH"
Endif

If (oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->facility_id->name_id = "MPH")
Set oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->nurse_unit = ""
Set oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->nurse_unit = "MPH"
Set oen_reply->RESOURCE_GROUP [1]->PERSONNEL_AI_GROUP [L]->AIP->personnel_resource_id [1]->id_nbr = ""
Set oen_reply->RESOURCE_GROUP [1]->PERSONNEL_AI_GROUP [L]->AIP->personnel_resource_id [1]->id_nbr = "MPORRM1"
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = ""
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = "MPH"
Endif

If (oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->facility_id->name_id = "MDU")
Set oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->nurse_unit = ""
Set oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->nurse_unit = "MDH"
Set oen_reply->RESOURCE_GROUP [1]->PERSONNEL_AI_GROUP [L]->AIP->personnel_resource_id [1]->id_nbr = ""
Set oen_reply->RESOURCE_GROUP [1]->PERSONNEL_AI_GROUP [L]->AIP->personnel_resource_id [1]->id_nbr = "MDORRM1"
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = ""
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = "MDU"
Endif

If (oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->facility_id->name_id = "SAH")
Set oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->nurse_unit = ""
Set oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->nurse_unit = "SAH"
Set oen_reply->RESOURCE_GROUP [1]->PERSONNEL_AI_GROUP [L]->AIP->personnel_resource_id [1]->id_nbr = ""
Set oen_reply->RESOURCE_GROUP [1]->PERSONNEL_AI_GROUP [L]->AIP->personnel_resource_id [1]->id_nbr = "AHORRM1"
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = ""
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = "SAH"
Endif

If (oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->facility_id->name_id = "MCS")
Set oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->nurse_unit = ""
Set oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->nurse_unit = "MCH"
Set oen_reply->RESOURCE_GROUP [1]->PERSONNEL_AI_GROUP [L]->AIP->personnel_resource_id [1]->id_nbr = ""
Set oen_reply->RESOURCE_GROUP [1]->PERSONNEL_AI_GROUP [L]->AIP->personnel_resource_id [1]->id_nbr = "MCORRM1"
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = ""
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = "MCS"
Endif

If (oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->facility_id->name_id = "NBY")
Set oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->nurse_unit = ""
Set oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->nurse_unit = "MPNBH"
Set oen_reply->RESOURCE_GROUP [1]->PERSONNEL_AI_GROUP [L]->AIP->personnel_resource_id [1]->id_nbr = ""
Set oen_reply->RESOURCE_GROUP [1]->PERSONNEL_AI_GROUP [L]->AIP->personnel_resource_id [1]->id_nbr = "NBORRM1"
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = ""
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = "NBY"
Endif

If (oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->facility_id->name_id = "SJS")
Set oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->nurse_unit = ""
Set oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->nurse_unit = "SJHS"
Set oen_reply->RESOURCE_GROUP [1]->PERSONNEL_AI_GROUP [L]->AIP->personnel_resource_id [1]->id_nbr = ""
Set oen_reply->RESOURCE_GROUP [1]->PERSONNEL_AI_GROUP [L]->AIP->personnel_resource_id [1]->id_nbr = "JSORRM1"
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = ""
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = "SJS"
Endif

If (oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->facility_id->name_id = "WHH")
Set oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->nurse_unit = ""
Set oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->nurse_unit = "WHH"
Set oen_reply->RESOURCE_GROUP [1]->PERSONNEL_AI_GROUP [L]->AIP->personnel_resource_id [1]->id_nbr = ""
Set oen_reply->RESOURCE_GROUP [1]->PERSONNEL_AI_GROUP [L]->AIP->personnel_resource_id [1]->id_nbr = "WHORRM1"
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = ""
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = "WHH"
Endif

If (oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->facility_id->name_id = "WHW")
Set oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->nurse_unit = ""
Set oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->nurse_unit = "WHW"
Set oen_reply->RESOURCE_GROUP [1]->PERSONNEL_AI_GROUP [L]->AIP->personnel_resource_id [1]->id_nbr = ""
Set oen_reply->RESOURCE_GROUP [1]->PERSONNEL_AI_GROUP [L]->AIP->personnel_resource_id [1]->id_nbr = "WHWORRM1"
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = ""
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = "WHW"
Endif

If (oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->facility_id->name_id = "BRM")
Set oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->nurse_unit = ""
Set oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->nurse_unit = "BRM"
Set oen_reply->RESOURCE_GROUP [1]->PERSONNEL_AI_GROUP [L]->AIP->personnel_resource_id [1]->id_nbr = ""
Set oen_reply->RESOURCE_GROUP [1]->PERSONNEL_AI_GROUP [L]->AIP->personnel_resource_id [1]->id_nbr = "BRORRM1"
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = ""
Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = "BRM"
Endif

;If (oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->facility_id->name_id = "BAH")
;Set oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->nurse_unit = ""
;Set oen_reply->RESOURCE_GROUP [1]->LOCATION_AI_GROUP [L]->AIL->location_resource_id->nurse_unit = "BAH"
;Set oen_reply->RESOURCE_GROUP [1]->PERSONNEL_AI_GROUP [L]->AIP->personnel_resource_id [1]->id_nbr = ""
;Set oen_reply->RESOURCE_GROUP [1]->PERSONNEL_AI_GROUP [L]->AIP->personnel_resource_id [1]->id_nbr = "BAORRM1"
;Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = ""
;Set oen_reply->CONTROL_GROUP [1]->MSH [1]->sending_facility->name_id = "BAH"
;Endif

Endfor