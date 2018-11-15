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
/*****************************************************************************
          Date Written:       09/16/14
          Source file name:   snsro_get_persons
          Object name:        snsro_get_persons
          Request #:          100040 (PM_SCH_GET_PERSONS)
          Program purpose:    Searches for a list of persons best
                              matching the given search criteria.
                              Returns all persons found as well
                              as requested information for each
                              person.
          Tables read:        PRSNL, PRSNL_ALIAS
          Tables updated:     NONE
          Executing from:     EMISSARY SERVICES
          Special Notes:	  NONE
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
  000 9/15/14  AAB		  Initial write
  001 10/26/14 AAB		  Changed PRSNLID to USERNAME
  002 11/10/14 JCO        Removed FIN NBR from search
  003 11/16/14 AAB		  Added deceased_date
  004 12/21/14 AAB  	  Added confid_level_cd
  005 12/21/14 AAB        Changed for loop in PostAmble to use dummy table
						  for looping
  006 12/27/14 AAB        Added name_first, name_last, name_middle, name_prefix
						  name_suffix to reply
  007 02/27/15 AAB		  Added FIN NBR to search criteria
  008 02/27/15 AAB		  Added new utility method GetPrsnlIDfromUserName to
						  retrieve Prsnl_ID from Username
  009 03/25/15 JCO		  Added CURRENT name qualifier on PERSON_NAME join
  010 03/31/15 AAB 		  Added notranslatelock
  012 09/04/15 AAB 		  Pull active MRN
  013 11/24/15 AAB 		  Add Audit object
  014 01/08/15 AAB 		  Add Alias object
  015 01/22/16 AAB		  Change limit to 100 records in response
  016 01/25/16 JCO		  Modified search request to match PowerChart to fix search results
  017 01/28/16 AAB 		  Changed opf flag to 0
  018 02/29/16 AAB 		  Change Phonetic search to 0
  019 03/31/16 JCO		  Added ExtendedInfo flag and return
  020 04/29/16 AAB 		  Added version
  021 05/10/16 AAB		  Check preference before setting options field
  022 05/13/16 AAB 		  Fix Birth date filter
  023 10/10/16 AAB 	  	  Add DEBUG_FLAG
  024 02/24/17 DJP		  Add BIRTH_TZ as i4 field to patients_reply_out record structure
  025 07/27/17 JCO		  Changed %i to execute; update ErrorHandler2
  026 03/21/18 RJC		  Added version code and copyright block
  027 04/19/18 DJP		  Added string DOB
 ***********************************************************************/
 
drop program snsro_get_persons go
create program snsro_get_persons
 
prompt
 
		"Output to File/Printer/MINE" = "MINE"
		, "Username:" = ""
		, "Last Name:" = ""
		, "First Name:" = ""
		, "MRN:" = ""
		, "Birth Date:" = ""
		, "Gender:" = ""
		, "FIN NBR:" = ""
		, "EXTENDED INFO:" = 0
		, "Debug Flag" = 0				;OPTIONAL. Verbose logging when set to one (1).
 
with OUTDEV, USERNAME, LNAME, FNAME, MRN, BIRTH_DT, GENDER , FIN_NBR, EXTEND_INFO, DEBUG_FLAG   ;023

/*************************************************************************
;CCL PROGRAM VERSION CONTROL ;026
**************************************************************************/
set sVersion = "1.16.6.1" 
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
free record req_in
record req_in (
  1 debug 							= i2
  1 max 							= i2
  1 opf 							= i2
  1 options 						= vc
  1 person_id 						= f8
  1 return_all 						= i2
  1 security 						= i2
  1 style 							= i2
  1 threshold 						= f8
  1 user_id 						= f8
  1 user_name 						= vc
  1 filter [*]
    2 flag 							= i2
    2 meaning 						= vc
    2 options 						= vc
    2 phonetic 						= i2
    2 value 						= vc
    2 weight 						= f8
    2 values [*]
      3 value 						= vc
  1 result [*]
    2 flag 							= i2
    2 meaning 						= vc
    2 options 						= vc
  1 exact_match 					= f8
  1 percent_top 					= f8
  1 simple_percent 					= f8
  1 cutoff_mode_flag 				= i2
  1 show_pats_no_encntrs 			= i2
  1 calling_application 			= i2
  1 search_all_logical_domains_ind 	= i2
  1 person_list_ind 				= i2
  1 person_list[*]
    2 person_id 					= f8
)
 
free record patients_reply_out
record patients_reply_out
(
  1  filter_str                = vc
  1  person[*]
     2  person_id              = f8
     2  address1               = vc
     2  address2               = vc
     2  age                    = vc
     2  alias_xxx              = vc
     2  birth_date             = dq8
     2  birth_tz			   = i4 ;024
     2  city                   = vc
     2  deceased               = vc
     2  ethnic_group           = vc
     2  gender                 = vc
     2  language               = vc
     2  last_encounter_date    = dq8
     2  maiden_name            = vc
     2  marital_status         = vc
     2  mothers_maiden_name    = vc
     2  name                   = vc
     2  name_first             = vc
     2  name_last              = vc
     2  name_middle			   = vc
     2  name_suffix			   = vc
     2  name_prefix			   = vc
     2  nationality            = vc
     2  person_type            = vc
     2  phone                  = vc
     2  provider_xxx           = vc
     2  race                   = vc
     2  religion               = vc
     2  species                = vc
     2  state                  = vc
     2  vip                    = vc
     2  weight                 = f8
     2  zipcode                = vc
     2  any_name_id            = f8
     2  any_name_full          = vc
	 2  alias_mrn			   = vc
	 2  alias_pool_cd_mrn	   = vc
	 2  abs_birth_date		   = vc
	 2  birth_prec_flag	       = i2
	 2  pft_acct_id			   = f8
	 2  alias_ssn 			   = vc
	 2  alias_pool_cd_ssn      = vc
	 2  deceased_date		   = dq8
	 2  confid_level_cd        = f8
	 2  confid_level_disp 	   = vc
	 2  sDOB				   = C10
	 2 patient_alias[*]  	;014
		3  person_alias_id             = f8
		3  alias_pool_cd               = f8
		3  person_alias_type_cd        = f8
		3  person_alias_type_disp      = vc
		3  person_alias_type_mean      = vc
		3  alias                       = vc
	 2 extended_info				;019
	 	3 race							= vc
	 	3 language						= vc
	 	3 marital_status				= vc
	 	3 religion					    = vc
	 	3 ethnicity						= vc
	 	3 email							= vc
  		3  addresses [*]
  			4 address1						= vc
  			4 address2						= vc
  			4 city							= vc
  			4 state							= vc
  			4 zip							= vc
  			4 address_type					= vc
  		3 phones [*]
  			4 number						= vc
  			4 seq_num						= vc
  			4 phone_type					= vc
  1 search_method_ind 		   	= i4
  1 audit						;013
	2 user_id							= f8
	2 user_firstname					= vc
	2 user_lastname						= vc
	2 patient_id						= f8
	2 patient_firstname					= vc
	2 patient_lastname					= vc
	2 service_version					= vc		;020
  1 status_data
    2 status = c1
    2 subeventstatus[1]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
      3 Code = c4			;025
      3 Description = vc	;025
 
)
 
set patients_reply_out->status_data->status = "F"

/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
 
declare sUserName 					= vc with protect, noconstant($USERNAME)
declare sFirstName	 				= vc with protect, noconstant($FNAME)
declare sLastName	 				= vc with protect, noconstant($LNAME)
declare sMRN	 					= vc with protect, noconstant($MRN)
declare sFIN_NBR 	 				= vc with protect, noconstant($FIN_NBR)
declare birthDate 					= vc with protect, noconstant($BIRTH_DT) ;022
 
declare sGender	 					= vc with protect, noconstant($GENDER)
declare dGender	 					= f8 with protect, noconstant(0.0)
declare cnt							= i2 with protect, noconstant(0.0)
declare dPrsnlID  					= f8 with protect, noconstant(0.0)
declare APPLICATION_NUMBER 			= i4 with protect, constant (600005)
declare TASK_NUMBER 				= i4 with protect, constant (100040)
declare REQUEST_NUMBER 				= i4 with protect, constant (100040)
;declare dMRN						= f8 with protect, constant(UAR_GET_CODE_BY( "MEANING", 263 , "MRN")) ;008
declare dMRN						= f8 with protect, constant(uar_get_code_by("MEANING", 4, "MRN"))
declare dSSN						= f8 with protect, constant(UAR_GET_CODE_BY( "MEANING", 263 , "SSN")) ;008
declare dCurrent					= f8 with protect, constant(UAR_GET_CODE_BY( "MEANING", 213, "CURRENT")) ;009
declare Section_Start_Dt_Tm 		= DQ8 WITH PROTECT, NOCONSTANT(CNVTDATETIME(CURDATE, CURTIME3))
declare iRet						= i2 with protect, noconstant(0) 	;002
declare iExtendedInfo				= i2 with protect, noconstant($EXTEND_INFO)	;019
declare dEmailCd					= f8 with protect, constant(uar_get_code_by("MEANING", 212, "EMAIL")) ;019
declare hidePersonPrefInd 			= i2 with protect, noconstant(0)  ;021
declare idebugFlag					= i2 with protect, noconstant(0) ;023
/****************************************************************************
;INCLUDES
****************************************************************************/
;025 %i ccluserdir:snsro_common.inc
execute snsro_common		;025
 
/*************************************************************************
;INITIALIZE
**************************************************************************/
set dPrsnlID = GetPrsnlIDfromUserName(sUserName)
if(birthDate > "")
 
	set birthDate = build2(birthDate, " 00:00")
endif
 
set idebugFlag				= cnvtint($DEBUG_FLAG)  ;023
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
 
declare GetPersons(null)			= null with protect
declare PostAmble(null)				= null with protect
declare GetExtendedInfo(null)		= null with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
	set iRet = PopulateAudit(sUserName, 0.0, patients_reply_out, sVersion)   ;020   ;013
 
	if(iRet = 0)  ;013
		call ErrorHandler2("VALIDATE", "F", "PATIENTS", "Invalid User for Audit.",
		"1001", build("UserId is invalid: ", sUserName), patients_reply_out)	;025
		go to EXIT_SCRIPT
 
	endif
 
	call GetPersons(null)
	call PostAmble(null)
	if(iExtendedInfo = 1)
		call GetExtendedInfo(null)
	endif
 
/*************************************************************************
; EXIT SCRIPT - Force the script to EXIT
**************************************************************************/
#EXIT_SCRIPT
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
set JSONout = CNVTRECTOJSON(patients_reply_out)
 
if(idebugFlag > 0)
 
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_get_persons.json")
	call echo(build2("_file : ", _file))
	call echojson(patients_reply_out, _file, 0)
/******  Log reply to JSON file - END - *******/
	call echorecord(patients_reply_out)
	call echo(JSONout)
 
endif
 
	if(validate(_MEMORY_REPLY_STRING))
		set _MEMORY_REPLY_STRING = trim(JSONout,3)
	endif
 
#EXIT_VERSION
/*************************************************************************
;  Name: GetPersons(null)
;  Description: This will perform a Person search based on filter criteria passed in
;
**************************************************************************/
subroutine GetPersons(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetPersons Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
if(idebugFlag > 0)
 
	call echo(build("Username ->", sUserName))
	call echo(build("Last Name ->", sLastName))
	call echo(build("First Name ->", sFirstName))
	call echo(build("MRN ->", sMRN))
	call echo(build("FIN ->", sFIN_NBR))
	call echo(build("Prnl ID ->", dPrsnlID))
	call echo(build("Extended Info ->",iExtendedInfo))
 
endif
 
 
set cnt = cnt + 1
set req_in->debug = 0
set req_in->max = 100	;015
set req_in->opf = 0	;017 016
; 021 +
set hidePersonPrefInd = cnvtint(getPreferenceFromNVP(1, 600005, reqinfo->position_cd, dPrsnlId, "HIDE_PERSON_IF_NO_ENCNTRS"))
if(hidePersonPrefInd =  1)
  set req_in->options = "0000600005000000000  11"
  set req_in->show_pats_no_encntrs = 0
  set req_in->security = 1
else
  set req_in->options = "0000600005000000000   1"
  set req_in->show_pats_no_encntrs = 1
  set req_in->security = 0
endif
;021 -
set req_in->person_id = 0
set req_in->return_all = 0
;set req_in->security = 1	;18
set req_in->style = 2;3 ;18
set req_in->threshold = 75.00
set req_in->user_id = dPrsnlID
set req_in->user_name = "" ;016 sUserName
 
if(sLastName != "")
	;016 -- Append * to the end of the LastName field to match PowerChart logic
	set sLastName = build(sLastName,"*")
 
	set stat = alterlist(req_in->filter, cnt)
	set req_in->filter[cnt]->flag = 21
	set req_in->filter[cnt]->meaning = ""
	set req_in->filter[cnt]->options = ""
	set req_in->filter[cnt]->phonetic = 0 ;18
	set req_in->filter[cnt]->value = sLastName
	set req_in->filter[cnt]->weight = 0
 
	set cnt = cnt + 1
 
endif
 
if(sFirstName != "")
	;016 -- Append * to the end of the FirstName field to match PowerChart logic
	set sFirstName = build(sFirstName,"*")
 
	set stat = alterlist(req_in->filter, cnt)
	set req_in->filter[cnt]->flag = 17
	set req_in->filter[cnt]->meaning = ""
	set req_in->filter[cnt]->options = ""
	set req_in->filter[cnt]->phonetic = 0 ;18
	set req_in->filter[cnt]->value = sFirstName
	set req_in->filter[cnt]->weight = 0
 
	set cnt = cnt + 1
 
endif
 
 
if(sMRN != "")
	;016 -- Append * to the end of the MRN field to match PowerChart logic
	set sMRN = build(sMRN,"*")
 
	set stat = alterlist(req_in->filter, cnt)
	set req_in->filter[cnt]->flag = 28
	set req_in->filter[cnt]->meaning = "MRN"
	set req_in->filter[cnt]->options = ""
	set req_in->filter[cnt]->phonetic = 0 ;18
	set req_in->filter[cnt]->value = sMRN
	set req_in->filter[cnt]->weight = 0
 
	set cnt = cnt + 1
 
endif
 
if(birthDate != "")
 
	set stat = alterlist(req_in->filter, cnt)
	set req_in->filter[cnt]->flag = 9
	set req_in->filter[cnt]->meaning = ""
	set req_in->filter[cnt]->options = ""
	set req_in->filter[cnt]->phonetic = 0 ;18
	set req_in->filter[cnt]->value = birthDate
	set req_in->filter[cnt]->weight = 0
 
	set cnt = cnt + 1
 
endif
 
if(sGender != "")
 
	set dGender = uar_get_code_by ("MEANING",57,sGender)
	set stat = alterlist(req_in->filter, cnt)
	set req_in->filter[cnt]->flag = 18
	set req_in->filter[cnt]->meaning = ""
	set req_in->filter[cnt]->options = ""
	set req_in->filter[cnt]->phonetic = 0 ;18
	set req_in->filter[cnt]->value = dGender
	set req_in->filter[cnt]->weight = 0
 
	set cnt = cnt + 1
 
endif
 
if(sFIN_NBR != "")
	;016 -- Append * to the end of the Financial Number field to match PowerChart logic
	set sFIN_NBR = build(sFIN_NBR,"*")
 
	set stat = alterlist(req_in->filter, cnt)
	set req_in->filter[cnt]->flag = 120
	set req_in->filter[cnt]->meaning = "FIN NBR"
	set req_in->filter[cnt]->options = ""
	set req_in->filter[cnt]->phonetic = 0 ;18
	set req_in->filter[cnt]->value = sFIN_NBR
	set req_in->filter[cnt]->weight = 0
 
	set cnt = cnt + 1
 
endif
 
if(idebugFlag > 0)
 
	call echo(build("Last Name ->", sLastName))
	call echo(build("First Name ->", sFirstName))
	call echo(build("MRN ->", sMRN))
	call echo(build("FIN NBR ->", sFIN_NBR))
 
endif
 
 
set stat = alterlist(req_in->result, 27)
;1
set req_in->result[1]->flag = 57
set req_in->result[1]->meaning = ""
set req_in->result[1]->options = ""
 
;2
set req_in->result[2]->flag = 26
set req_in->result[2]->meaning = ""
set req_in->result[2]->options = ""
 
;3
set req_in->result[3]->flag = 28
set req_in->result[3]->meaning = "MRN"
set req_in->result[3]->options = ""
 
;4
set req_in->result[4]->flag = 18
set req_in->result[4]->meaning = ""
set req_in->result[4]->options = ""
 
;5
set req_in->result[5]->flag = 9
set req_in->result[5]->meaning = ""
set req_in->result[5]->options = ""
 
;6
set req_in->result[6]->flag = 8
set req_in->result[6]->meaning = ""
set req_in->result[6]->options = ""
 
;7
set req_in->result[7]->flag = 28
set req_in->result[7]->meaning = "SSN"
set req_in->result[7]->options = ""
 
;8
set req_in->result[8]->flag = 93
set req_in->result[8]->meaning = ""
set req_in->result[8]->options = ""
 
;9
set req_in->result[9]->flag = 120
set req_in->result[9]->meaning = "FIN NBR"
set req_in->result[9]->options = ""
 
;10
set req_in->result[10]->flag = 139
set req_in->result[10]->meaning = ""
set req_in->result[10]->options = ""
 
;11
set req_in->result[11]->flag = 144
set req_in->result[11]->meaning = ""
set req_in->result[11]->options = ""
 
;12
set req_in->result[12]->flag = 150
set req_in->result[12]->meaning = ""
set req_in->result[12]->options = ""
 
;13
set req_in->result[13]->flag = 162
set req_in->result[13]->meaning = ""
set req_in->result[13]->options = ""
 
;14
set req_in->result[14]->flag = 110
set req_in->result[14]->meaning = ""
set req_in->result[14]->options = ""
 
;15
set req_in->result[15]->flag = 149
set req_in->result[15]->meaning = ""
set req_in->result[15]->options = ""
 
;16
set req_in->result[16]->flag = 160
set req_in->result[16]->meaning = ""
set req_in->result[16]->options = ""
 
;17
set req_in->result[17]->flag = 118
set req_in->result[17]->meaning = ""
set req_in->result[17]->options = ""
 
;18
set req_in->result[18]->flag = 232
set req_in->result[18]->meaning = ""
set req_in->result[18]->options = ""
 
;19
set req_in->result[19]->flag = 233
set req_in->result[19]->meaning = ""
set req_in->result[19]->options = ""
 
;20
set req_in->result[20]->flag = 214
set req_in->result[20]->meaning = ""
set req_in->result[20]->options = ""
 
;21
set req_in->result[21]->flag = 216
set req_in->result[21]->meaning = "SSN"
set req_in->result[21]->options = ""
 
;22
set req_in->result[22]->flag = 216
set req_in->result[22]->meaning = "MRN"
set req_in->result[22]->options = ""
 
;23
set req_in->result[23]->flag = 208
set req_in->result[23]->meaning = ""
set req_in->result[23]->options = ""
 
;24
set req_in->result[24]->flag = 204
set req_in->result[24]->meaning = ""
set req_in->result[24]->options = ""
 
;25
set req_in->result[25]->flag = 203
set req_in->result[25]->meaning = ""
set req_in->result[25]->options = ""
 
;26
set req_in->result[26]->flag = 194
set req_in->result[26]->meaning = ""
set req_in->result[26]->options = ""
 
;27
set req_in->result[27]->flag = 198
set req_in->result[27]->meaning = ""
set req_in->result[27]->options = ""
 
set req_in->exact_match = 0
set req_in->percent_top = 0
set req_in->simple_percent = 0.0
set req_in->cutoff_mode_flag = 0
;set req_in->show_pats_no_encntrs = 1	;021
set req_in->calling_application = 2
set req_in->calling_application = 2
set req_in->search_all_logical_domains_ind = 0
 
;set req_in->suppress_held_records_ind = 0
set req_in->person_list_ind = 0
 
if(idebugFlag > 0)
 
	call echorecord(req_in)
 
endif
 
set stat = tdbexecute(APPLICATION_NUMBER, TASK_NUMBER, REQUEST_NUMBER,"REC",req_in,"REC",patients_reply_out)
 
if (patients_reply_out->status_data->status = "F")
 
	call ErrorHandler2("EXECUTE", "Z", "PATIENT", "No patients found.  Please refine search (100040)",
	"9999", "No patients found.  Please refine search (100040)", patients_reply_out)	;025
	go to EXIT_SCRIPT
 
endif
 
	call ErrorHandler("EXECUTE", "S", "PATIENT", "Success Executing 100040", patients_reply_out)
 
if(idebugFlag > 0)
 
	call echo(concat("GetPersons Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
/*************************************************************************
;  Name: PostAmble(null)
;  Description: This will perform any post processing after the search has been performed
;
**************************************************************************/
subroutine PostAmble(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("PostAmble Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
declare personCnt				= i2 with protect, noconstant(0.0)
declare pAliasCnt				= i2 with protect, noconstant(0.0)  ;014
 
set personCnt = size(patients_reply_out->person,5)
set pAliasCnt = 0
 
  select into"nl:"
 
	p.deceased_dt_tm, p.confid_level_cd, pn.name_first,
	pn.name_last, pn.name_middle, pn.name_prefix, pn.name_suffix,
	pa.alias_pool_cd, pa.alias
 
  from
 
   (dummyt d WITH seq = personCnt),person p, person_name pn, person_alias pa
 
  plan d
 
  join p
 
  where p.person_id  =  patients_reply_out->person[d.seq]->person_id
 
		and p.active_ind = 1
 
		and p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
 
		and p.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
  join pn
 
  where pn.person_id = outerjoin(p.person_id)
 
   and pn.active_ind = 1
 
   and pn.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
 
   and pn.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
   and pn.name_type_cd = dCurrent
 
   join pa      ;012 +
 
   where pa.person_id = outerjoin(p.person_id)
   and pa.person_alias_type_cd = dMRN
   and pa.active_ind = 1
   and pa.beg_effective_dt_tm <= cnvtdatetime(curdate, curtime3)
   and pa.end_effective_dt_tm >= cnvtdatetime(curdate, curtime3)
				;012 -
 
  head p.person_id
 
	pAliasCnt = 0
	if(idebugFlag > 0)
 
		call echo(build("Alias -->", pa.alias))
 
	endif
 
		patients_reply_out->person[d.seq]->deceased_date 	 = p.deceased_dt_tm
		patients_reply_out->person[d.seq]->confid_level_cd	 = p.confid_level_cd
		patients_reply_out->person[d.seq]->confid_level_disp = UAR_GET_CODE_DISPLAY(p.confid_level_cd)
		patients_reply_out->person[d.seq]->name_first		 = pn.name_first
		patients_reply_out->person[d.seq]->name_last		 = pn.name_last
		patients_reply_out->person[d.seq]->name_middle		 = pn.name_middle
		patients_reply_out->person[d.seq]->name_prefix		 = pn.name_prefix
		patients_reply_out->person[d.seq]->name_suffix		 = pn.name_suffix
 		patients_reply_out->person[d.seq]->alias_mrn		 = pa.alias    ;012
		patients_reply_out->person[d.seq]->alias_pool_cd_mrn = cnvtstring(pa.alias_pool_cd)	   ;012
		patients_reply_out->person[d.seq]->sDOB = 
			datetimezoneformat(p.birth_dt_tm,p.birth_tz,"YYYY-MM-DD",curtimezonedef);027
 
  detail  ;014
 
	pAliasCnt = pAliasCnt + 1
 
	stat = alterlist(patients_reply_out->person[d.seq]->patient_alias, pAliasCnt)
 
		  patients_reply_out->person[d.seq]->patient_alias[pAliasCnt]->person_alias_id = pa.person_alias_id
		  patients_reply_out->person[d.seq]->patient_alias[pAliasCnt]->alias_pool_cd = pa.alias_pool_cd
		  patients_reply_out->person[d.seq]->patient_alias[pAliasCnt]->person_alias_type_cd = pa.person_alias_type_cd
		  patients_reply_out->person[d.seq]->patient_alias[pAliasCnt]->person_alias_type_disp =
		  	UAR_GET_CODE_DISPLAY(pa.person_alias_type_cd)
		  patients_reply_out->person[d.seq]->patient_alias[pAliasCnt]->alias = trim(pa.alias,3)
 
  with nocounter
 
if(idebugFlag > 0)
 
	call echo(concat("PostAmble Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
/*019*********************************************************************
;  Name: GetExtendedInfo(null)
;  Description: This will populated ExtendedInfo object
;
**************************************************************************/
subroutine GetExtendedInfo(null)
 
if(idebugFlag > 0)
 
	set section_start_dt_tm = cnvtdatetime(curdate, curtime3)
	call echo(concat("GetExtendedInfo Begin  ", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
 
endif
 
 
declare pAddrCnt				= i2 with protect, noconstant(0)
declare pPhCnt					= i2 with protect, noconstant(0)
 
set pAddrCnt = 0
set pPhCnt = 0
set personCnt = size(patients_reply_out->person,5)
 
/************
* Addresses *
************/
  select into"nl:"
 
	a.address_id
 
  from
 
   (dummyt d WITH seq = personCnt)
   ,address a
 
  plan d
 
  join a
 
  where a.parent_entity_id = patients_reply_out->person[d.seq]->person_id
  		and a.parent_entity_name = "PERSON"
		and a.active_ind = 1
		and a.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and a.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
  head d.seq
  		pAddrCnt = 0
 
  detail
  		pAddrCnt = pAddrCnt + 1
		stat = alterlist(patients_reply_out->person[d.seq]->extended_info->addresses, pAddrCnt)
 
		if(a.address_type_cd = dEmailCd)
			patients_reply_out->person[d.seq]->extended_info->email = a.street_addr
		else
			patients_reply_out->person[d.seq]->extended_info->addresses[pAddrCnt].address1 = a.street_addr
			patients_reply_out->person[d.seq]->extended_info->addresses[pAddrCnt].address2 = a.street_addr2
			patients_reply_out->person[d.seq]->extended_info->addresses[pAddrCnt].city = a.city
			patients_reply_out->person[d.seq]->extended_info->addresses[pAddrCnt].state = a.state
			patients_reply_out->person[d.seq]->extended_info->addresses[pAddrCnt].zip = a.zipcode
			patients_reply_out->person[d.seq]->extended_info->addresses[pAddrCnt].address_type = UAR_GET_CODE_DISPLAY(a.address_type_cd)
		endif
 
  with nocounter
 
 
/**********
* Phones *
**********/
  select into"nl:"
 
	ph.phone_id
 
  from
 
   (dummyt d WITH seq = personCnt)
   ,phone ph
 
  plan d
 
  join ph
 
  where ph.parent_entity_id = patients_reply_out->person[d.seq]->person_id
  		and ph.parent_entity_name = "PERSON"
		and ph.active_ind = 1
		and ph.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and ph.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
  head d.seq
  		pPhCnt = 0
 
  detail
  		pPhCnt = pPhCnt + 1
		stat = alterlist(patients_reply_out->person[d.seq]->extended_info->phones, pPhCnt)
 
		patients_reply_out->person[d.seq]->extended_info->phones[pPhCnt].number = ph.phone_num
		patients_reply_out->person[d.seq]->extended_info->phones[pPhCnt].seq_num = cnvtstring(ph.seq)
		patients_reply_out->person[d.seq]->extended_info->phones[pPhCnt].phone_type = UAR_GET_CODE_DISPLAY(ph.phone_type_cd)
 
  with nocounter
 
/**********
* Other   *
**********/
  select into"nl:"
 
	ph.phone_id
 
  from
 
   (dummyt d WITH seq = personCnt)
   ,person p
 
  plan d
 
  join p
 
  where p.person_id = patients_reply_out->person[d.seq]->person_id
 
  detail
		patients_reply_out->person[d.seq]->extended_info->race =  UAR_GET_CODE_DISPLAY(p.race_cd)
		patients_reply_out->person[d.seq]->extended_info->ethnicity =  UAR_GET_CODE_DISPLAY(p.ethnic_grp_cd)
		patients_reply_out->person[d.seq]->extended_info->religion =  UAR_GET_CODE_DISPLAY(p.religion_cd)
		patients_reply_out->person[d.seq]->extended_info->marital_status =  UAR_GET_CODE_DISPLAY(p.marital_type_cd)
		patients_reply_out->person[d.seq]->extended_info->language =  UAR_GET_CODE_DISPLAY(p.language_cd)
 
  with nocounter
 
 
if(idebugFlag > 0)
 
	call echo(concat("GetExtendedInfo Runtime: ",
                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), section_start_dt_tm, 5)), 3),
                 " seconds"))
 
endif
 
end
 
end go
 
set trace notranslatelock go
