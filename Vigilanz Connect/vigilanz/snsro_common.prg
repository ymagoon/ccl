/*~BB~************************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

/*****************************************************************************
          Date Written:     01/7/15
          Source file name: snsro_common.prg
          Object name:		snsro_common
          Program purpose:  Common functions used across scripts
          Executing from:   EMISSARY
 ***********************************************************************
                   GENERATED MODIFICATION CONTROL LOG
 ***********************************************************************
 
 Mod Date     Engineer             Comment
 --- -------- -------------------- -----------------------------------
  000 10/13/14  AAB					Initial write
  001 01/07/15  AAB 				Clean up file
  002 01/25/15  AAB					Added GetCodeSet subroutine
  003 02/27/15  AAB 				Added GetPersonID and GetPrsnlIDfromUserName subroutines
  004 03/03/15  JCO					Added GetPrsnlIDfromNPI subroutine
  005 04/28/15  AAB					Added ParseConceptCKI subroutine to retrieve code and coding system
  006 04/26/15  JCO					Added GetNameFromPrsnID subroutine (Patient Name)
  007 07/04/15  AAB					Added GetPersonIdByEncntrId subroutine
  008 09/11/15  AAB 				Added PopulateAudit subroutine
  009 11/29/15  JCO					Fixed PopulateAudit to set "->audit"
  010 11/09/15  AAB 				Add GetPatientClass subroutine
  011 12/28/15	JCO					Added GetNameFromPrsnlID subroutine (Provider Name)
  012 12/28/15	JCO					Added GetOrderPrsnlIDfromOrderID subroutine
  013 01/26/16  JCO					Made username query case insensitive
  014 02/20/16  AAB 				Add encntr_type_class_cd to GetPatientClass subroutine
  015 04/06/16  AAB 				Add sVersion to PopulateAudit subroutine
  016 05/10/16  JCO					Added declare base64_decode subroutine
  017 05/10/16  AAB 				Add getPreferenceFromNVP subroutine
  018 07/13/16  AAB                 Change base64_decode subroutine to use uar_si_decode_base64
  019 11/13/16  AAB                 Add GetParameterValues subroutine
  020 11/22/16  JCO					Added substring( ) for decoded string
  021 03/03/17	DJP					Added ErrorHandler2 Method
  022 06/21/17	JCO					Added OrigOrdAsFlag subroutine
  023 07/27/17  JCO					Convert .inc to .prg; add persistscript
  024 10/06/17  DJP					Added base64 encode subroutine to use uar_si_encode_base64
  026 03/21/18	RJC					Added version code and copyright block
  027 04/19/18	RJC					Changed a variable name from dUserId to dUserPrnsnlId to avoid script conflicts
  028 05/09/18	RJC					Added ValidateEncntrPatientReltn function
  									Added GetEncntrIdByAlias function
  									Added GetPersonIdByAlias function
  									Added GetDateTime function
  029 07/18/18	RJC					Added GetPositionByPrsnlId
  030 08/28/18  STV					Added ThreshHoldValidator and reworked GetDateTime()
  031 10/09/18  STV                 Added GetLocationTypeCode from snro2_common V2
  032 10/18/18  STV                 Added setting all files to maxvarlen to 20 mb
  033 10/31/18	RJC					Added WriteDebug
  034 01/23/19  STV					Added GetUARCodeError handles the -1 scneario
  035 11/11/19	RJC					cnvtupper added to aliase searches
  036 11/21/19	KRD					Removed cnvtupper from alias search
  037 11/21/19	KRD					Added ValidateEncounter() function.
  038 01/16/20	RJC					Added c_null_value constant for patches
  039 04/10/20	RJC					Removed cnvtupper in query for GetPrsnlIDfromUserName
 ***********************************************************************/
drop program snsro_common go
create program snsro_common
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2"
 
/*************************************************************************
;VARIABLE DECLARATIONS
**************************************************************************/
declare sDebugFile 		= vc with persistscript, noconstant("snsro_debug_file.dat")
declare c_null_value 	= vc with persistscript, constant("::NULL::")
 
/*************************************************************************
;SUBROUTINE DECLARATIONS
**************************************************************************/
declare ErrorHandler(OperationName = vc,
                      OperationStatus = c1,
                      TargetObjectName = vc,
                      TargetObjectValue = vc,
                      RecordData=VC(REF)) = NULL with persistscript
 
declare ErrorHandler2(OperationName = vc,
                      OperationStatus = c1,
                      TargetObjectName = vc,
                      TargetObjectValue = vc,
                      Code = c4,
                      Description = vc,
                      RecordData=VC(REF)) = NULL with persistscript
 
declare GetCodeSet(dCode_Value = f8) 			 		= f8 with persistscript
declare GetPersonID(sMrn = vc)					 		= f8 with persistscript
declare GetPrsnlIDfromUserName(sUserName = vc)   		= f8 with persistscript
declare GetPrsnlIDfromNPI(sNPI = vc)			 		= f8 with persistscript
declare GetNameFromPrsnID(dPersonID = f8)		 		= vc with persistscript
declare GetPersonIdByEncntrId (sEnctrId = f8)   		= f8 with persistscript
declare ParseConceptCKI(sConceptCKI = vc , item = i2)	= vc with persistscript
declare PopulateAudit(sUserName = vc , dPersonID 		= f8, auditRec =vc(ref), sVersion =vc)	= i2 with persistscript     ;008  015
declare GetPatientClass( dEncntrId= f8, iType = i2)	    = f8 with persistscript     ;010   014
declare GetNameFromPrsnlID(dPrsnlID = f8)		 		= vc with persistscript		;011
declare GetOrderPrsnlIDfromOrderID(dOrderID = f8) 		= f8 with persistscript		;012
declare base64_decode(encoded_str=vc)					= vc with persistscript		;016
declare getPreferenceFromNVP(P1=i2(VAL), P2=i4(VAL), P3=f8(VAL), P4=f8(VAL), P5=vc(VAL)) = vc with persistscript ;017
declare GetParameterValues(P1=I4(VAL), P2=VC(REF))		= null with persistscript 	;018
declare createNewRTF(P1=VC(VAL), P2=VC(VAL)) 			= vc with persistscript
declare getMedicationBasis(iOrigOrdAsFlag = i2)			= vc with persistscript		;022
declare base64_encode(encoded_str=vc)					= vc with persistscript		;024
declare ValidateEncntrPatientReltn(patient_id = f8, encntr_id = f8) = i2 with persistscript ;028
declare GetEncntrIdByAlias(alias = vc, aliascode = f8) 	= f8 with persistscript 	;028
declare GetPersonIdByAlias(alias = vc, aliascode = f8) 	= f8 with persistscript 	;028
declare GetDateTime(origdttm = vc) 						= dq8 with persistscript 	;028
declare GetPositionByPrsnlId(prsnl_id = f8)				= f8 with persistscript 	;029
declare ThreshHoldValidator(threshhold = i4, units = c1, from_date = f8 ,to_date = f8) = i2 with persistscript ;30
declare GetLocationTypeCode(dLocationCd = f8)				= f8 with persistscript ;031
declare WriteDebug(text = vc)			= null with persistscript ;032
declare GetUARCodeError(cv = f8, type = vc,code_set = i4,desc = vc) = vc with persistscript
declare ValidateEncounter(enc_id = f8)				= f8 with persistscript 	;037
 
/*************************************************************************
* SET'S MAXVARLEN FOR ALL FILES
*************************************************************************/
set MODIFY MAXVARLEN 200000000
 
/*************************************************************************
;  Name:getPreferenceFromNVP(pref_model_flag, app_number, position_cd, prsnl_id, pvc_name)  ;017
;  Description: Return a specific preference value from the pref model
**************************************************************************/
subroutine getPreferenceFromNVP(pref_model_flag, app_number, position_cd, prsnl_id, pvc_name)
 
  ;PREF_MODEL_FLAG
  ;1 - APP_PREFS
  ;2 - DETAIL_PREFS
  ;3 - VIEW_COMP_PREFS
  ;4 - VIEW_PREFS
 
  declare pref_found = i2 with protect, noconstant(0)
  declare pref_value = vc with protect, noconstant("")
  declare sprsnl_id = f8 with protect, noconstant(0.0)
  declare sposition = f8 with protect, noconstant(0.0)
  declare sapplication = i4 with protect, noconstant(0)
 
 
  select if(pref_model_flag = 1)
    sprsnl_id = ap.prsnl_id
    ,sposition = ap.position_cd
    ,sapplication = ap.application_number
    from app_prefs ap
    ,name_value_prefs nvp
    plan ap
    where ap.prsnl_id in (0.0, prsnl_id)
    and ap.position_cd in (0.0, position_cd)
    and ap.application_number = app_number
    join nvp
    where nvp.parent_entity_id = ap.app_prefs_id
    and nvp.parent_entity_name = "APP_PREFS"
    and nvp.pvc_name = pvc_name
    and nvp.active_ind > 0
    order by
    ap.prsnl_id desc, ap.position_cd desc
 
  elseif(pref_model_flag = 2)
    sprsnl_id = dp.prsnl_id
    ,sposition = dp.position_cd
    ,sapplication = dp.application_number
    from detail_prefs dp
    ,name_value_prefs nvp
    plan dp
    where dp.prsnl_id in (0.0, prsnl_id)
    and dp.position_cd in (0.0, position_cd)
    and dp.application_number = app_number
    join nvp
    where nvp.parent_entity_id = dp.detail_prefs_id
    and nvp.parent_entity_name = "DETAIL_PREFS"
    and nvp.pvc_name = pvc_name
    and nvp.active_ind > 0
    order by
    dp.prsnl_id desc, dp.position_cd desc
 
  elseif(pref_model_flag = 3)
    sprsnl_id = vcp.prsnl_id
    ,sposition = vcp.position_cd
    ,sapplication = vcp.application_number
    from view_comp_prefs vcp
    ,name_value_prefs nvp
    plan vcp
    where vcp.prsnl_id in (0.0, prsnl_id)
    and vcp.position_cd in (0.0, position_cd)
    and vcp.application_number = app_number
    join nvp
    where nvp.parent_entity_id = vcp.view_comp_prefs_id
    and nvp.parent_entity_name = "VIEW_COMP_PREFS"
    and nvp.pvc_name = pvc_name
    and nvp.active_ind > 0
    order by
    vcp.prsnl_id desc, vcp.position_cd desc
 
  elseif(pref_model_flag = 4)
    sprsnl_id = vp.prsnl_id
    ,sposition = vp.position_cd
    ,sapplication = vp.application_number
    from view_prefs vp
    ,name_value_prefs nvp
    plan vp
    where vp.prsnl_id in (0.0, prsnl_id)
    and vp.position_cd in (0.0, position_cd)
    and vp.application_number = app_number
    join nvp
    where nvp.parent_entity_id = vp.view_prefs_id
    and nvp.parent_entity_name = "VIEW_PREFS"
    and nvp.pvc_name = pvc_name
    and nvp.active_ind > 0
    order by
    vp.prsnl_id desc, vp.position_cd desc
 
  else
    from name_value_prefs nvp
    where nvp.name_value_prefs_id = -1.0
 
  endif
  into "nl:"
  detail
    if(pref_found = 0)
      if (validate(debug_ind, 0) = 1)
        call echo(build2("Pref ", pvc_name, " found for person:", sprsnl_id, " position:"
          , sposition, " application:", sapplication ))
        call echo(build2("Pref value = ", nvp.pvc_value))
      endif
      pref_found = 1
      pref_value = nvp.pvc_value
    endif
  with nocounter
 
  return(pref_value)
 
end
 
/*************************************************************************
;  Name: GetPatientClass( dEncntrId= f8, iType = i2)	  		;010  014
;  Description: Retrieve Patient class
;	1 = encntr_type_cd  2 = encntr_type_class_cd
**************************************************************************/
subroutine GetPatientClass( dEncntrId, iType)
 
declare dReturnCd 			= f8 with noconstant(0.0)
 
if(dEncntrId > 0.0 )
 
;ENCOUNTER
  select into "nl:"
 
    from encounter e
 
  where e.encntr_id = dEncntrId
    and e.active_ind = 1
    and e.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
    and e.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
  detail
	if(iType = 1)
		dReturnCd = e.encntr_type_cd
	elseif(iType = 2)
		dReturnCd = e.encntr_type_class_cd
	endif
 
 
  with nocounter
 
  return (dReturnCd)
 
else
 
	return (0.0)
 
endif
 
 
end
 
 
/*************************************************************************
;  Name: PopulateAudit(sUserName = vc , dPersonID = f8, auditRec =vc(ref), version)			;008
;  Description: Populate Audit object
;
**************************************************************************/
subroutine PopulateAudit(sUserName, dPersonID, auditRec,sVersion)
	declare dUserPrsnlId 		= f8 with noconstant(0.0)
	declare iAuditStat		= i2 with noconstant(1)
	 
	set auditRec->audit->service_version = sVersion
	 
	if(sUserName != "")
		set dUserPrsnlId = GetPrsnlIDfromUserName(sUserName)
		if(dUserPrsnlId = 0)
			set iAuditStat = 0
			return (iAuditStat)
		endif
	else
		set dUserPrsnlId = reqinfo->updt_id
	endif
	 
	;PRSNL
	select into "nl:"
	from person p
	where p.person_id = dUserPrsnlId
		and p.active_ind = 1
		and p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and p.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	detail
		auditRec->audit->user_id = dUserPrsnlId					;009
		auditRec->audit->user_firstname = p.name_first		;009
		auditRec->audit->user_lastname  = p.name_last		;009
	with nocounter
	 
	;PATIENT
	select into "nl:"
	from person p
	where p.person_id = dPersonID
	detail
		auditRec->audit->patient_id = dPersonID				;009
		auditRec->audit->patient_firstname = p.name_first	;009
		auditRec->audit->patient_lastname  = p.name_last	;009
	with nocounter
	 
	return (iAuditStat)
end
 
 
/*************************************************************************
;  Name: GetPersonIdByEncntrId(dEncntrId)
;  Description: Get PersonId by Encntr Id
;
**************************************************************************/
subroutine GetPersonIdByEncntrId(dEncntrId)
 
declare ret_person_id 		= f8 with noconstant(0.0)
 
  select into "nl:"
 
    e.person_id
 
  from encounter e
 
  where e.encntr_id = dEncntrId
 
  detail
 
	ret_person_id		= e.person_id
 
  with nocounter
 
	return (ret_person_id)
 
end
 
/*************************************************************************
;  Name: GetPrsnlIDfromUserName(sUserName)
;  Description: Utility subroutine to get PrsnlID from Username
**************************************************************************/
subroutine GetPrsnlIDfromUserName(sUserName)
	declare prsnlID = f8 with protect, noconstant(0.0)
	declare asis_username = vc
	declare lower_username = vc
	declare upper_username = vc
	
	set asis_username = trim(sUsername,3)
	set lower_username = cnvtlower(asis_username)
	set upper_username = cnvtupper(asis_username)
	 
	select into "nl:"
		p.person_id
	from prsnl p
	where p.username in (asis_username, lower_username, upper_username)
		and p.active_ind = 1
	detail
		prsnlID =  p.person_id
	with nocounter

	return (prsnlID)
end
 
/*************************************************************************
;  Name: GetPrsnlIDfromNPI(sNPI)
;  Description: Utility subroutine to get PrsnlID from NPI
;
**************************************************************************/
subroutine GetPrsnlIDfromNPI(sNPI)
 
declare prsnlID 	= f8 with protect, noconstant(0.0)
declare dAliasNPI   = f8 with protect, constant(uar_get_code_by("MEANING",263,"NPI"))
 
 
  select into "nl:"
 
    pa.person_id
 
  from prsnl_alias pa
 
  where pa.alias  =  sNPI
 
  	and pa.alias_pool_cd = dAliasNPI
 
    and pa.active_ind = 1
 
    and pa.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
 
    and pa.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
 
  detail
 
	prsnlID =  pa.person_id
 
  with nocounter
 
  return (prsnlID)
 
end
 
 
 /*****************************************************************************/
;  Name: GetPersonID(sMRN )
;  Description:  Retrieve PersonID
/*****************************************************************************/
subroutine GetPersonID(sMRN)
 
declare personId = f8 with protect, noconstant(0.0)
declare dMrnCd   = f8 with protect, constant(uar_get_code_by("MEANING",4,"MRN"))
 
select into "nl:"
 
from person_alias pa,person p
 
plan pa
  where pa.alias = sMRN
    and pa.person_alias_type_cd = dMrnCd
    and pa.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
join p
  where p.person_id = pa.person_id
    and p.active_ind = 1
 
detail
 
  personId = p.person_id
 
with nocounter
 
return (personId)
 
end
 
/*****************************************************************************/
;  Name: GetCodeSet( )
;  Description:  Retrieve CodeSet
/*****************************************************************************/
subroutine GetCodeSet(dCode_Value)
 
declare dCode_Set = f8 with protect, noconstant(0.0)
 
select into "nl:"
 
	c.code_set
 
from code_value c
 
  where c.code_value = dCode_Value
 
detail
 
  dCode_Set = c.code_set
 
with nocounter
 
return (dCode_Set)
 
end
 
/*****************************************************************************/
;  Name: GetNameFromPrsnID( )
;  Description:  Retreive FULL_NAME_FORMATTED for PATIENT
/*****************************************************************************/
subroutine GetNameFromPrsnID(dPersonID)
 
declare sFullName = vc with protect, noconstant("")
 
select into "nl:"
 
	p.name_full_formatted
 
from person p
 
  where p.person_id = dPersonID
 
detail
 
  sFullName = p.name_full_formatted
 
with nocounter
 
return (sFullName)
 
end
 
 
/*****************************************************************************/
;  Name: GetNameFromPrsnlID( )
;  Description:  Retreive FULL_NAME_FORMATTED for PROVIDER
/*****************************************************************************/
subroutine GetNameFromPrsnlID(dPrsnlID)
 
declare sFullName = vc with protect, noconstant("")
 
select into "nl:"
 
	p.name_full_formatted
 
from prsnl p
 
  where p.person_id = dPrsnlID
 
detail
 
  sFullName = p.name_full_formatted
 
with nocounter
 
return (sFullName)
 
end
 
 
 
/*************************************************************************
;  Name: GetOrderPrsnlIDfromOrderID(dOrderId)
;  Description: Get Ordering Provider by Order ID
;
**************************************************************************/
subroutine GetOrderPrsnlIDfromOrderID(dOrderId)
 
  declare ret_person_id 		= f8 with noconstant(0.0)
  declare dOrderAction			= f8 with constant(uar_get_code_by("MEANING",6003,"ORDER"))
 
  select into "nl:"
 
    oa.action_personnel_id
 
  from order_action oa
 
  where oa.order_id = dOrderId
  	and oa.action_type_cd = dOrderAction
 
  detail
 
	ret_person_id		= oa.action_personnel_id
 
  with nocounter
 
	return (ret_person_id)
 
end
 
 
/*****************************************************************************/
;  Name: ErrorHandler(OperationName, OperationStatus, TargetObjectName, TargetObjectValue)
;  Description: Updates the Status block for script
/*****************************************************************************/
subroutine ErrorHandler(OperationName, OperationStatus, TargetObjectName, TargetObjectValue, RecordData)
 
	set RecordData->status_data.status = OperationStatus
 
	if (size(RecordData->status_data.subeventstatus, 5) = 0)
		set stat = alterlist(RecordData->status_data.subeventstatus, 1)
	endif
 
	set RecordData->status_data.subeventstatus[1].OperationName		= OperationName
	set RecordData->status_data.subeventstatus[1].OperationStatus	= OperationStatus
 	set RecordData->status_data.subeventstatus[1].TargetObjectName	= TargetObjectName
 	set RecordData->status_data.subeventstatus[1].TargetObjectValue	= TargetObjectValue
 
end
 
 /*****************************************************************************/
;  Name: ErrorHandler2(OperationName, OperationStatus, TargetObjectName, TargetObjectValue,
;  				Code, Description)
;  Description: Updates the Status block for script with Emissary Fields (2)
/*****************************************************************************/
subroutine ErrorHandler2(OperationName, OperationStatus, TargetObjectName, TargetObjectValue, Code,
	Description, RecordData)
 
	set RecordData->status_data.status = OperationStatus
 
	if (size(RecordData->status_data.subeventstatus, 5) = 0)
		set stat = alterlist(RecordData->status_data.subeventstatus, 1)
	endif
 
	set RecordData->status_data.subeventstatus[1].OperationName		= OperationName
	set RecordData->status_data.subeventstatus[1].OperationStatus	= OperationStatus
 	set RecordData->status_data.subeventstatus[1].TargetObjectName	= TargetObjectName
 	set RecordData->status_data.subeventstatus[1].TargetObjectValue	= TargetObjectValue
 	set RecordData->status_data.subeventstatus[1].Code	= Code
 	set RecordData->status_data.subeventstatus[1].Description	= Description
end
 
 
 
 
/*************************************************************************
;  Name: ParseConceptCKI((sConceptCKI = vc , item = i2))
;  Description: Subroutine to parse a ! delimited string
;
**************************************************************************/
subroutine ParseConceptCKI(sConceptCKI, item)
 
declare notfnd 		= vc with constant("<not_found>")
declare num 		= i4 with noconstant(1)
declare str 		= vc with noconstant("")
declare return_str1 	= vc with noconstant("")
declare return_str 	= vc with noconstant("")
 
if(sConceptCKI != "")
 
	while (str != notfnd)
 
     	set str =  piece(sConceptCKI,'!',num,notfnd)
 
     	if(str != notfnd)
			if((item = 1) and (num = 1))
				call echo(build("FIRST -->", str))
				set return_str1 = str
				return  (return_str1)
			elseif((item = 2) and (num = 2))
				call echo(build("SECOND -->", str))
				set return_str = str
				return  (return_str)
			endif
     	endif
 
      	set num = num + 1
 
 	endwhile
 
endif
 
end
 
 /***********************************************************************
   * base64_encode
   * Encodes a Base 64 Encoded string
   *
   * Parameters:
   *   encoded_str - the string to be encoded
   *
   * Returns:
   *   the encoded string
   ***********************************************************************/
  SUBROUTINE base64_encode(encoded_str)
 
 
    declare uar_si_encode_base64 ((p1=vc(ref)), (p2=i4(ref)), (p3=i4(ref))) = vc with persist
    declare strInput      = vc with private, noconstant(" ") ;; this is for the input document
    declare strOutput     = vc with public, noconstant(" ") ;; this will contain encoded doc
    declare iInputSize    = i4 with private, noconstant(0)
    declare iFinalSize    = i4 with private, noconstant(0)
    ;declare iStat         = i4 with private, noconstant(0)
; call echo(build("String sent into subroutine ",encoded_str))
    set strInput = encoded_str
   ; call echo(build("String set to strInput var ",strInput))
  ;  set strOutput = strInput ;; reserve a buffer to put the decoded document into.
    set iInputSize = textlen(strInput)
  ;  call echo(build("String size  ",iInputSize))
 
    set strOutput = uar_si_encode_base64(strInput, iInputSize, iFinalSize)
 ; call echo(build("String from uar si encode ",strOutput))
 
	set strOutput = substring(1,iFinalSize,strOutput)
  ; call echo(build("sub String from uar si encode ",strOutput))
 
    return(trim(strOutput,3))
 
  END ;base64_encode
 
 /***********************************************************************
   * base64_decode
   * Decodes a Base 64 Encoded string
   *
   * Parameters:
   *   encoded_str - the encoded string to be decoded
   *
   * Returns:
   *   the decode string
   ***********************************************************************/
  SUBROUTINE base64_decode(encoded_str)
 
  ;018 +
    declare uar_si_decode_base64 (p1=vc(ref), p2=i4(ref), p3=vc(ref), p4=i4(ref), p5=i4(ref) ) = i4 with persist
    declare strInput      = vc with private, noconstant(" ") ;; this is for the input document
    declare strOutput     = vc with private, noconstant("") ;; this will contain out at the end of this code
    declare iInputSize    = i4 with private, noconstant(0)
    declare iFinalSize    = i4 with private, noconstant(0)
    declare iStat         = i4 with private, noconstant(0)
 
    set strInput = encoded_str
    set strOutput = strInput ;; reserve a buffer to put the decoded document into.
    set iInputSize = textlen(strInput)
    set iStat = uar_si_decode_base64(strInput, iInputSize, strOutput, iInputSize, iFinalSize)
 
	set strOutput = substring(1,iFinalSize,strOutput)	/*020*/
 
    return(trim(strOutput,3))
   ;018 -
 
/*
    set my64 ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
    declare s1 = vc with protect
    declare decoded_str = vc with protect
    declare x = i4 with protect
    declare y = i4 with protect
 
    set s1 = encoded_str
 
    for(y = 1 to size(s1) by 4)
      for (x = 1 to 3)
        case(x)
          of 1:
        	  ;The first character is shifted left two positions (multiplying by 4 shifts left two positions)
        	  ;and combined with
            ;the second character's 5th and 6th bits which have been shifted right by 4 positions
            ; (dividing by 16 shifts right four positions)
            set decoded_str = concat(decoded_str,char(bor((findstring(substring(y,1,s1),my64)-1)*4,
                                                           band(findstring(substring(y+1,1,s1),my64)-1,48)/16)))
          of 2:
        	  ;The second character is shifted left 4 positions (multiplying by 16 shifts left four positions)
        	  ;and combined with
            ;the third character's 3rd through 6th bits which have been shifted right by 2 positions
            ; (dividing by 4 shifts right two positions)
            if(substring(y+2,1,s1) != "=")
              set decoded_str = concat(decoded_str,char(bor( band(findstring(substring(y+1,1,s1),my64)-1,15)*16,
                                                             band(findstring(substring(y+2,1,s1),my64)-1,60)/4)))
            endif
          of 3:
        	  ;The third character is shifted left 6 positions (multiplying by 64 shifts left six positions)
        	  ;and combined with
            ;the fourth character's 1st through 6th bits
            if(substring(y+3,1,s1) != "=")
              set decoded_str = concat(decoded_str,char(bor( band(findstring(substring(y+2,1,s1),my64)-1,3)*64,
                                                             band(findstring(substring(y+3,1,s1),my64)-1,63))))
            endif
        endcase
      endfor
    endfor
    return(decoded_str)
 
 */
  END ;base64_decode
 
/*************************************************************************
;  Name: GetParameterValues(index, value_rec)
;  Description: Subroutine to parse a  delimited string into a record structure
;
**************************************************************************/
 
subroutine GetParameterValues(index, value_rec)
	declare par = vc with noconstant(""), protect
	declare lnum = i4 with noconstant(0), protect
	declare num = i4 with noconstant(1), protect
	declare cnt = i4 with noconstant(0), protect
	declare cnt2 = i4 with noconstant(0), protect
	declare param_value = f8 with noconstant(0.0), protect
	declare param_value_str = vc with noconstant(""), protect
 
	SET par = reflect(parameter(index,0))
	if (validate(debug_ind, 0) = 1)
		call echo(par)
	endif
	if (par = "F8" or par = "I4")
		set param_value = parameter(index,0)
		if (param_value > 0)
			set value_rec->cnt = value_rec->cnt + 1
			set stat = alterlist(value_rec->qual, value_rec->cnt)
			set value_rec->qual[value_rec->cnt].value = param_value
		endif
	elseif (substring(1,1,par) = "C")
		set param_value_str = parameter(index,0)
		if (trim(param_value_str, 3) != "")
			set value_rec->cnt = value_rec->cnt + 1
			set stat = alterlist(value_rec->qual, value_rec->cnt)
			set value_rec->qual[value_rec->cnt].value = trim(param_value_str, 3)
		endif
	elseif (substring(1,1,par) = "L") ;this is list type
		set lnum = 1
		while (lnum>0)
			set par = reflect(parameter(index,lnum))
			if (par != " ")
				if (par = "F8" or par = "I4")
					;valid item in list for parameter
					set param_value = parameter(index,lnum)
					if (param_value > 0)
						set value_rec->cnt = value_rec->cnt + 1
						set stat = alterlist(value_rec->qual, value_rec->cnt)
						set value_rec->qual[value_rec->cnt].value = param_value
					endif
					set lnum = lnum+1
				elseif (substring(1,1,par) = "C")
					;valid item in list for parameter
					set param_value_str = parameter(index,lnum)
					if (trim(param_value_str, 3) != "")
						set value_rec->cnt = value_rec->cnt + 1
						set stat = alterlist(value_rec->qual, value_rec->cnt)
						set value_rec->qual[value_rec->cnt].value = trim(param_value_str, 3)
					endif
					set lnum = lnum+1
				endif
			else
				set lnum = 0
			endif
		endwhile
	endif
	if (validate(debug_ind, 0) = 1)
		call echorecord(value_rec)
	endif
end
 
/**022********************************************************************
;  Name: getMedicationBasis(iOrigOrdAsFlag)
;  Description: Subroutine to map ORIG_ORD_AS_FLAG values to a medication
; 				basis description.
**************************************************************************/
 
subroutine getMedicationBasis(iOrigOrdAsFlag)
 
	declare medBasis = vc with noconstant("")
 
	/* ORIGINAL ORDERED AS FLAG:
					0 - NormalOrder	Description
 					1 - PrescriptionDischarge
 					2 - RecordedOrHomeMeds
 					3 - PatientOwnMeds
 					4 - PharmacyChargeOnly
 					5 - SuperBill
 					*/
		case(iOrigOrdAsFlag)
          of 0:
          	set medBasis = "NormalOrder"
          of 1:
            set medBasis = "PrescriptionDischarge"
          of 2:
          	set medBasis = "RecordedOrHomeMeds"
          of 3:
          	set medBasis = "PatientOwnMeds"
          of 4:
          	set medBasis = "PharmacyChargeOnly"
          of 5:
          	set medBasis = "SuperBill"
 
         endcase
 
	return(trim(medBasis))
 
end
 
/*************************************************************************
;  Name: GetEncntrIdByAlias(alias = vc, aliascode = f8) = f8
;  Description:  Get the encounter_id by alias
**************************************************************************/
subroutine GetEncntrIdByAlias(alias,aliascode)
	set ret_encntr_id = 0
	set alias_str = cnvtupper(trim(alias))
	select into "nl:"
	from encntr_alias ea
	where ea.alias = alias_str
		and ea.encntr_alias_type_cd = aliascode
		and ea.active_ind = 1
		and ea.beg_effective_dt_tm < sysdate
		and ea.end_effective_dt_tm > sysdate
	detail
		ret_encntr_id = ea.encntr_id
	with nocounter
 
 	return(ret_encntr_id)
end ;End Subroutine
 
/*************************************************************************
;  Name: GetPersonIdByAlias(alias = vc, aliascode = f8) = f8
;  Description: Get PersonId by alias
**************************************************************************/
subroutine GetPersonIdByAlias(p_alias, aliascode)
	declare ret_person_id = f8
	set p_alias_str = cnvtupper(trim(p_alias))
	select into "nl:"
	from person_alias pa
	where pa.alias = p_alias_str
			and pa.person_alias_type_cd = aliascode
			and pa.beg_effective_dt_tm <= sysdate
			and pa.end_effective_dt_tm > sysdate
			and pa.active_ind = 1
	detail
		ret_person_id = pa.person_id
	with nocounter
 
	return(ret_person_id)
end ;End Sub
 
/**********************************************************************
;  Name: ValidateEncntrPatientReltn(patient_id = f8, encntr_id = f8) = i2
;  Description: Validates the PatientId and EncounterId go together
**************************************************************************/
subroutine ValidateEncntrPatientReltn(patient_id, encntr_id)
	set iEncPatReltn = 0
	select into "nl:"
	from encounter e
	where e.encntr_id = encntr_id
	and e.person_id = patient_id
	detail
		iEncPatReltn = 1
	with nocounter
	return(iEncPatReltn)
end ;End Sub
 
/*************************************************************************
;  Name: GetDateTime(origdttm = vc) = dq8
;  Description:  Takes string datetime and returns Cerner datetime format
**************************************************************************/
subroutine GetDateTime(origdttm)
 
	declare newdttm = dq8
	set UTCpos = findstring("Z",cnvtupper(origdttm))
 
	if(CURUTC > 0)
		if(origdttm  <= " ")
			set newdttm = cnvtdatetimeutc(cnvtdatetime(curdate,curtime3))
		else
			if(UTCpos > 0)
				set newdttm = cnvtdatetimeutc3(origdttm,"DD-MMM-YYYY HH:MM:SS Z")
			else
				set newdttm = cnvtdatetime(origdttm)
			endif
		endif
	else
		if(origdttm <= " ")
			set newdttm = cnvtdatetime(curdate,curtime3)
		else
			set newdttm = cnvtdatetimeutc(origdttm,4)
		endif
	endif
 
 
	if(idebugFlag > 0)
		call echo(concat("GetDateTime newdttm: ",format(newdttm,"dd-mmm-yyyy hh:mm:ss;;q")))
	endif
 
	return(newdttm)
 
end ;End Subroutine
 
/*************************************************************************
;  Name:  GetPositionByPrsnlId(prsnl_id = f8) = f8
;  Description: Get Position Code by PrsnlId
**************************************************************************/
subroutine GetPositionByPrsnlId(prsnl_id)
	declare ret_position_cd = f8
	select into "nl:"
	from prsnl p
	where p.person_id = prsnl_id
		and p.active_ind = 1
		;and p.beg_effective_dt_tm > cnvtdatetime(curdate,curtime3)
		;and p.end_effective_dt_tm < cnvtdatetime(curdate,curtime3)
	detail
		ret_position_cd = p.position_cd
	with nocounter
 
	return(ret_position_cd)
end ;End Sub
 
 
 
/*************************************************************************
;  Name:  ThreshHoldValidator(threshhold = i4, units = c1, from_date = dq8 ,to_date = dq8) = i2
;  Description: returns boolean to check time constrants for both utc and nonutc environments
**************************************************************************/
subroutine ThreshHoldValidator(threshhold, units, from_date,to_date)
 
	declare valid = i2
	set valid = 0
	declare units_param  = c1
	set units_param = cnvtupper(trim(units,3))
	set threshhold = threshhold
	declare threshhold_str = vc
	set threshhold_str = cnvtstring(threshhold)
	set from_date = from_date
	set to_date = to_date
	if(CURUTC > 0)
		declare diff_mode = i4
		case(units_param)
			of "D": set diff_mode = 1
			of "W": set diff_mode = 2
			of "H": set diff_mode = 3
			of "M": set diff_mode = 4
			of "S": set diff_mode = 5
		endcase
 
		if(datetimediff(to_date,from_date,diff_mode) <= threshhold)
			set valid = 1
	    endif
	else
		declare unit_str = vc
		set unit_str = concat('"',threshhold_str,',',units_param,'"')
 
		declare threshhold_dt = dq8
		set threshold_dt = cnvtlookahead(unit_str,cnvtdatetime(from_date))
 
		if (to_date <= threshold_dt )
			set valid = 1
		endif
	endif
 
	return(valid)
end
 
/***********************************************************************
Name: GetLocationTypeCode(dLocationCd = f8)				= f8
Description:  Returns the LocationTypeCd
***********************************************************************/
subroutine GetLocationTypeCode(dLocationCd)
	declare ret_loc_type_cd = f8
	select into "nl:"
	from location l
	where l.location_cd = dLocationCd
	detail
		ret_loc_type_cd = l.location_type_cd
	with nocounter
 
	return(ret_loc_type_cd)
end ;End Sub
 
 
/***********************************************************************
Name: WriteDebug(text = gvc, debug_flag = i2)			= null
Description:  Returns the LocationTypeCd
***********************************************************************/
subroutine WriteDebug(text)
	declare recSize = i4
	declare nonStrVal = i4
	declare textType = vc
 
	set text = trim(nullterm(text),3)
 
	; Check if space exists to know if text is a string right away
	set spPos = findstring(" ",text,1)
	if(spPos > 0)
		set textType = "string"
	endif
 
	if(textType != "string")
		; Validate if variable exists
		call parser(build2("set nonStrVal = validate(",text,") go"))
 
		if(nonStrVal > 0)
			call parser(build2("set recSize = size(",text,",6) go"))
			;Check if text is a record
			if(recSize > 0)
				set textType = "record"
			endif
		endif
	endif
 
	; Print data or save to file
	if(textType = "record")
		case(iDebugFlag)
			of 2: ;print record
				call parser(build2("call echorecord(",text,") go"))
			of 3: ;store to file
				call parser(build2("call echorecord(",text,") go"))
				call parser(build2("call echorecord(",text,",^",sDebugFile,"^,1) go"))
		endcase
	else
		case(iDebugFlag)
			of value(1,2): call echo(text)
			of 3:
				call echo(text)
 
				free record frec
				record frec (
			     1 FILE_DESC = I4
			     1 FILE_OFFSET = I4
			     1 FILE_DIR = I4
			     1 FILE_NAME = VC
			     1 FILE_BUF = VC
			   	)
 
			 	; setup params
				set frec->FILE_NAME = sDebugFile
				set frec->FILE_BUF = "a"  ;open file in append mode
 
				; Open file
				set stat = CCLIO("OPEN",frec)
 
				; Write data
				set frec->FILE_BUF = build2(text,char(13))
				set stat = CCLIO("PUTS",FREC)
 
				if(stat != 1)
					call echo("print to file failed")
					go to exit_script
				endif
 
				; Close the file
				set stat = CCLIO("CLOSE",FREC)
		endcase
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetUARCodeError(cv = f8, type = vc,code_set = i4,desc = vc) = vc with persistscript
;  Description: returns string to be used for uar_get_code checks
**************************************************************************/
subroutine GetUARCodeError(cv,type,code_set,desc)
 
	declare string = vc
	set cv = cv
	if(cv = 0)
		set string = "Invalid Code Value, Code Value = 0"
 
	elseif(cv < 0)
		set type = cnvtupper(trim(type,3))
		set code_set = code_set
		set desc = cnvtupper(trim(desc,3))
 		set string = "Unable to find Code Value"
		declare parser_str = vc
			case(type)
				of "MEANING": set parser_str = build('cv.cdf_meaning = "',desc,'"')
				of "DISPLAY_KEY": set parser_str = build('cv.display_key = "',desc,'"')
				of "DESCRIPTION": set parser_str = build('cnvtupper(cv.description) = "',desc,'"')
				of "DEFINITION": set parser_str = build('cnvtupper(cv.definition) = "',desc,'"')
			endcase
 
		select into "nl:"
		from code_value cv
		where cv.code_set = code_set
			and parser(parser_str)
			and cv.active_ind = 1
			and cv.begin_effective_dt_tm <= cnvtdatetime(curdate, curtime3)
			and cv.end_effective_dt_tm > cnvtdatetime(curdate, curtime3)
		order by cv.code_value
		head report
			string = "Multiple Values Found, please Follow up with site which to use: "
			x = 0
		head cv.code_value
			x = x + 1
			if(x < 2)
				string = build2(string,"Code_Value: ",trim(cnvtstring(cv.code_value,3))," Display: ",trim(cv.display))
			else
				string = build2(string,", Code_Value: ",trim(cnvtstring(cv.code_value,3))," Display: ",trim(cv.display))
			endif
		with nocounter
	endif
	return(string)
end
 
/*************************************************************************
;  Name:  ValidateEncounter(enc_id = f8) = f8
;  Description: Check if given encounter id is valied
**************************************************************************/
subroutine ValidateEncounter(enc_id)
	declare ret_enc_id = f8
	set ret_enc_id = 0.0
	select into "nl:"
	from encounter e
	where e.encntr_id  = enc_id
	detail
		ret_enc_id = e.encntr_id
	with nocounter
 
	return(ret_enc_id)
end ;End Sub
 
 
end
go
