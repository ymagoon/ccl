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
 
        Source file name:       ESO_GET_CE_SELECTION.PRG
        Object name:            ESO_GET_CE_SELECTION
        Request #:              1210254
 
        Product:                ESO
        Product Team:           Open Port
        HNA Version:            500
        CCL Version:            4.0
 
        Program purpose:        Suppress Outbound Clinical Events
 
        Tables read:            Clinical_Event
 
        Tables updated:         none
 
        Executing from:         FSI CQM Server (SCP Entry 252)
 
        Special Notes:          none
 
******************************************************************************/
;~DB~*************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG               *
;    *************************************************************************
;    *                                                                       *
;    *Mod Date     Engineer             Comment                              *
;    *--- -------- -------------------- ------------------------------------ *
;     000 01/01/98 Steven Baranowski    Initial Write                        *
;     001 12/10/98 Steven Baranowski    Add CQM Downtime Support             *
;     002 12/12/98 Steven Baranowski    Add RadEventEnsure Support           *
;     003 12/15/98 Steven Baranowski    General clean-up and commenting      *
;     004 01/27/99 Steven Baranowski    Fix stype type-o for AP              *
;     005 08/31/99 Steven Baranowski    Add Generic MDOC Processing          *
;     006 09/08/99 Steven Baranowski    Add ALTERED result_status_cd support *
;     007 11/22/99 Wayne Aulner         Fix call echo statemet               *
;     008 02/22/00 Steven Baranowski    Add support for new AP identification*
;     009 07/25/01 Wayne Aulner         Fix call echo statement              *
;     010 09/28/01 Lance Hoover         Add IQHealth Results support         *
;     011 07/21/03 James Grosser        Add PowerForm support                *
;     012 12/01/03 Jason Siess          Add PowerNotes support               *
;     013 03/01/04 Nathan Deam          Add support for RadNet remove exam   *
;     014 03/12/04 Nathan Deam          Add support for immunizations        *
;     015 05/25/04 Alan Basa            Corrections to Powernotes            *
;     016 05/20/05 Steve Schultes       53184 Added ability to suppress      *
;                                       reject exams for radiology           *
;     017 09/02/05 Brad Arndt           59277 Added bloodbank                *
;     018 11/21/09 Chris Eakes	        Begin Baycare Control LOG            *
;     019 02/12/14  Hope Kaczmarczyk	  Removed ability to suppress from DOC,*
;                                       MDOC,PowerNotes for IN ERRORS.       *
;     020 02/12/14 Hope Kaczmarczyk     Unsupress Endoworks                  *
;     021 02/12/14 Hope Kaczmarczyk     Removed ability to supress MDOC      *
;                                       Transcribed                          *
;     022 05/18/15 Hope Kaczmarczyk     Suppress Contrib Sys HXCLIN (v6)     *
;     023 01/19/16 Tony McArtor         Turned on DYNDOC resulting (v7)      *
;     024 01/21/16 Tony McArtor         Turned on Powerform resulting (v8)   *
;     025 02/08/17 Dan Olszewski        Unsupressed Powerforms for           *
;                                       zzzFormbuilder (v9)                  *
;     026 08/28/17 Dan Olszewski	      Supress Reviewed Lab Results (v10)   *
;	  027 11/27/19 Yitzhak Magoon	        Changes for model and formatting     *
;	  028 03/25/19 Yitzhak Magoon		      Stop MDOC/DOCs in a Reviewed status  *
;	  029 04/25/19 Yitzhak Magoon		      Fix unverified and reviewed AP Docs  *
;	  030 07/08/19 Yitzhak Magoon		      Add suppression logic for DOCS/MDOCS *
;	  031 07/08/19 Yitzhak Magoon		      Fix issue with AP docs not sending   *
;										                    outbound	              						 *
;	  032 07/08/19 Yitzhak Magoon		      Remove time constraint on reviewed   *
;										                    document filter	          					 *
;~DE~*************************************************************************
;~END~ ******************  END OF ALL MODCONTROL BLOCKS  *********************
 
drop program ESO_GET_CE_SELECTION go
create program ESO_GET_CE_SELECTION
 
/********************************************************************************************
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
SECTION 1.
 
 
THE FOLLOWING REQUEST RECORD SHOULD BE DEFINED IN TDB.  PERFORM A
"SHOW ESO_GET_CE_SELECTION" IN TDB TO VERFIY THIS REQUEST STRUCTURE IS IN SYNC
 
record request
{
   class                 [String: Variable]            **  CQM_FSIESO_QUE.class                         **
   stype                 [String: Variable]            **  CQM_FSIESO_QUE.type                          **
   subtype               [String: Variable]            **  CQM_FSIESO_QUE.subtype                       **
   subtype_detail        [String: Variable]            **  CQM_FSIESO_QUE.subtype_detail                **
   event_id              [Double]                      **  CLINICAL_EVENT.event_id                      **
   valid_from_dt_tm      [Date]                        **  CLINICAL_EVENT.valid_from_dt_tm              **
   event_cd              [Double]                      **  CLINICAL_EVENT.event_cd                      **
   result_status_cd      [Double]                      **  CLINICAL_EVENT.result_status_cd              **
   contributor_system_cd [Double]                      **  CLINICAL_EVENT.contributor_system_cd         **
   reference_nbr         [String: Variable]            **  CLINICAL_EVENT.reference_nbr                 **
}
 
---------------------------------------------------------------------------------------------
********************************************************************************************/
 
 
/********************************************************************************************
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 
SECTION 2.
 
DEFINE LOCAL VARIABLE THAT CAN BE USED IN THE CUSTOM SCRIPTING AT THE BOTTOM OF THIS FILE
 
---------------------------------------------------------------------------------------------
********************************************************************************************/
 
set event_disp = fillstring(40," ")                    /* DISPLAY VALUE FOR CLINICAL_EVENT.event_cd     */
set result_status_cdm = fillstring(12," ")             /* CDF MEANING FOR CE.result_status_cd           */
set contributor_system_disp = fillstring(40," ")       /* DISPLAY VALUE FOR CE.contributor_system_cd    */
 
set genlab_event_ind = 0
set micro_event_ind = 0
set rad_event_ind = 0
set ap_event_ind = 0
set mdoc_event_ind = 0                                 /* 005 */
set doc_event_ind = 0                                  ;012
set powerform_event_ind = 0                            ;;011
set immun_event_ind = 0                                ;014
set bloodbank_spr_event_ind = 0                        ;017
set dyndoc_event_ind = 0      						   ;023
 
/********************************************************************************************
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 
SECTION 3.
 
PERFORM UAR CODE CALLS TO GET CDF_MEANING AND DISPLAY STRINGS FOR CODE_VALUE PARAMETERS
 
---------------------------------------------------------------------------------------------
********************************************************************************************/
 
set event_disp = uar_get_code_display(request->event_cd)
set result_status_cdm = uar_get_code_meaning(request->result_status_cd)
set contributor_system_disp = uar_get_code_display(request->contributor_system_cd)
 
/********************************************************************************************
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 
SECTION 4.
 
PERFORM CALL ECHO STATEMENTS FOR DEBUGGING
 
---------------------------------------------------------------------------------------------
********************************************************************************************/
 
call echo("*****************************************")
call echo(concat("class = ",request->class))
call echo(concat("stype = ",request->stype))
call echo(concat("subtype = ",request->subtype))
call echo(concat("subtype_detail = ",request->subtype_detail))
call echo(concat("event_id = ",cnvtstring(request->event_id)))
call echo(concat("event_cd = ",cnvtstring(request->event_cd),
                 " = ", event_disp))
call echo(concat("result_status_cd = ",cnvtstring(request->result_status_cd),
                 " = ", result_status_cdm))
call echo(concat("contributor_system_cd = ",cnvtstring(request->contributor_system_cd),
                 " = ", contributor_system_disp))
call echo(concat("reference_nbr = ",request->reference_nbr))
 
/********************************************************************************************
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 
SECTION 5.
 
PERFORM SELECT ON CLINICAL EVENT TABLE FOR MISSING REQUIRED ELEMENTS
 
---------------------------------------------------------------------------------------------
********************************************************************************************/
 
if( (request->event_id > 0 ) AND ( ( trim(request->reference_nbr) = "" ) OR (request->result_status_cd = 0) ) )
   select into "nl:"
          ce.event_cd,
          ce.result_status_cd,
          ce.contributor_system_cd,
          ce.reference_nbr
     from clinical_event ce
    where ce.event_id = request->event_id
      and ce.valid_until_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
   detail
       if( request->result_status_cd = 0 )
          request->result_status_cd = ce.result_status_cd
          result_status_cdm =  uar_get_code_meaning(request->result_status_cd)
       endif
       if( trim(request->reference_nbr) = "" )
          request->reference_nbr = ce.reference_nbr
       endif
       if( request->event_cd = 0 )
          request->event_cd = ce.event_cd
          event_disp =  uar_get_code_display(request->event_cd)
       endif
       if( request->contributor_system_cd = 0 )
          request->contributor_system_cd = ce.contributor_system_cd
          contributor_system_disp =  uar_get_code_display(request->contributor_system_cd)
       endif
 
   with nocounter
 
   if(curqual = 0 )
     call echo("!!! SELECT ON CE TABLE FAILED !!!")
   endif
 
   call echo("*** SELECT FROM CE TABLE ***")
   call echo(concat("event_cd = ",cnvtstring(request->event_cd),
                    " = ", event_disp))
   call echo(concat("result_status_cd = ",cnvtstring(request->result_status_cd),
                    " = ", result_status_cdm))
   call echo(concat("contributor_system_cd = ",cnvtstring(request->contributor_system_cd),
                    " = ", contributor_system_disp))
   call echo(concat("reference_nbr = ",request->reference_nbr))
 
endif
 
 
/********************************************************************************************
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 
SECTION 6.
 
DEFINE THE REPLY HANDLE
 
The reply->status_data->status should have the following values:
 
 "S" means that order event is not suppress and that the CQM Server should be sent the event
 "Z" means to suppress the order event and the CQM Server should not be contacted
 "F" means that the script actually failed for some unknown or critical reason
 
---------------------------------------------------------------------------------------------
********************************************************************************************/
 
if( NOT validate(reply,0) )  /* 001 */
  free record reply
  record reply
  (
/* %i cclsource:status_block.inc */
  1 status_data
    2 status = c1
    2 subeventstatus[1]
      3 OperationName = c25
      3 OperationStatus = c1
      3 TargetObjectName = c25
      3 TargetObjectValue = vc
  )
endif
 
set reply->status_data->status = "S"
 
/********************************************************************************************
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 
SECTION 7.
 
DEFINE LOCAL VARIABLE THAT IDENTIFIED INTERFACE TYPES THAT ARE ENABLED AT THE SITE
(this should match interfaces configured through the ESO_INIT_OUTBOUND script)
 
 
A value of 0 (zero) means that the interface is not enabled
A value of 1 or >0 means the interface is enabled
 
---------------------------------------------------------------------------------------------
********************************************************************************************/
 
set ce_genlab_ind = 1                                  /* ENABLE GEN LAB RESULT INTERFACE               */
set ce_micro_ind  = 1                                  /* ENABLE MICRO RESULT INTERFACE                 */
set ce_rad_ind    = 0                                  /* ENABLE RAD RESULT INTERFACE                   */
set ce_ap_ind     = 1                                  /* ENABLE AP RESULT INTERFACE                    */
set ce_mdoc_ind   = 1                                  /* ENABLE GENERIC MDOC INTERFACE 005             */
set ce_doc_ind    = 1                                  /* ENABLE GENERIC DOC INFERFACE                  */  ;012
set ce_dyndoc_ind = 1	                               /* ENABLE MDOC DYNAMIC DOCUMENT INTERFACE        */  ;029
set ce_immun_ind  = 1                                  /* ENABLE DISCRETE IMMUNIZATION INTERFACE        */  ;014
 
set dm_archive_ind      = 0                            /* ENABLE DATA MANAGEMENT ARCHIVE INTERFACE      */
set ce_powerform_ind    = 1                            /* ENABLE POWERFORMS INTERFACE                   */  ;;011
set ce_bloodbank_spr_ind = 0                           /* ENABLE BLOODBANK INTERFACE                    */  ;017
 
/********************************************************************************************
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 
SECTION 8.
 
FOR THE INTERFACE TYPES THAT ARE ENABLED IN SECTION 7.  IDENTIFY THE RESULT STATUS LEVELS THAT ENABLED.
 
A value of 0 (zero) means that the result status level is not eligible for suppression (ie. the event
                           will always go through ESO)
A value of 1 or >0 means the result status level is eligible for suppression
 
---------------------------------------------------------------------------------------------
********************************************************************************************/
 
set ce_genlab_prelim_ind    = 0                  /* ENABLE GEN LAB PRELIMINARY EVENTS             */
set ce_genlab_final_ind     = 0                  /* ENABLE GEN LAB FINAL EVENTS                   */
set ce_genlab_inerror_ind   = 1                  /* ENABLE GEN LAB IN-ERROR EVENTS (DO NOT SEND)  */
set ce_genlab_corrected_ind = 0                  /* ENABLE GEN LAB CORRECTED EVENTS               */
 
set ce_micro_prelim_ind    = 0                   /* ENABLE MICRO PRELIMINARY EVENTS               */
set ce_micro_final_ind     = 0                   /* ENABLE MICRO FINAL EVENTS                     */
set ce_micro_inerror_ind   = 1                   /* ENABLE MICRO IN-ERROR EVENTS (DO NOT SEND)    */
set ce_micro_corrected_ind = 0                   /* ENABLE MICRO CORRECTED EVENTS                 */
 
set ce_rad_prelim_ind    = 1                     /* ENABLE RAD PRELIMINARY EVENTS                 */
set ce_rad_final_ind     = 1                     /* ENABLE RAD FINAL EVENTS                       */
set ce_rad_inerror_ind   = 1                     /* ENABLE RAD IN-ERROR EVENTS (DO NOT SEND)      */
set ce_rad_corrected_ind = 1                     /* ENABLE RAD CORRECTED EVENTS                   */
set ce_rad_remove_ind    = 1                     /* ENABLE RAD REMOVE EXAM EVENTS                 */ ;013
set ce_rad_reject_ind    = 1                     /* ENABLE RAD REJECT EXAM EVENTS                 */ ;; 016
 
set ce_ap_prelim_ind    = 1                      /* ENABLE AP PRELIMINARY EVENTS                  */
set ce_ap_final_ind     = 0                      /* ENABLE AP FINAL EVENTS                        */
set ce_ap_inerror_ind   = 1                      /* ENABLE AP IN-ERROR EVENTS (DO NOT SEND)       */
set ce_ap_corrected_ind = 0                      /* ENABLE AP CORRECTED EVENTS                    */
set ce_ap_snomed_ind    = 1                      /* ENABLE AP SNOMED EVENTS - 008                 */
 
set ce_mdoc_prelim_ind    = 1                      /* ENABLE MDOC PRELIMINARY EVENTS          005 */
set ce_mdoc_trans_ind     = 0                     /* ENABLE MDOC TRANSCRIBED EVENTS          005 */
set ce_mdoc_final_ind     = 0                      /* ENABLE MDOC FINAL EVENTS                005 */
set ce_mdoc_inerror_ind   = 0                      /* ENABLE MDOC IN-ERROR EVENTS (DO NOT SEND)   */
set ce_mdoc_corrected_ind = 0                      /* ENABLE MDOC CORRECTED EVENTS            005 */
 
;; 011+
set ce_powerform_prelim_ind    = 1                   /* ENABLE POWERFORM PRELIMINARY EVENTS               */
set ce_powerform_final_ind     = 0                   /* ENABLE POWERFORM FINAL EVENTS                     */
set ce_powerform_inerror_ind   = 1                   /* ENABLE POWERFORM IN-ERROR EVENTS (DO NOT SEND)    */
set ce_powerform_corrected_ind = 0                   /* ENABLE POWERFORM CORRECTED EVENTS                 */
;; 011-
 
;012 Start
set ce_doc_prelim_ind    = 1                      /* ENABLE DOC PRELIMINARY EVENTS            */
set ce_doc_trans_ind     = 1                      /* ENABLE DOC TRANSCRIBED EVENTS            */
set ce_doc_final_ind     = 0                      /* ENABLE DOC FINAL EVENTS                  */
set ce_doc_inerror_ind   = 0                      /* ENABLE DOC IN-ERROR EVENTS (DO NOT SEND) */
set ce_doc_corrected_ind = 0                      /* ENABLE DOC CORRECTED EVENTS              */
;012 End
 
;023+
set ce_dyndoc_prelim_ind = 0
set ce_dyndoc_final_ind = 0
set ce_dyndoc_trans_ind = 0
set ce_dyndoc_inerror_ind = 0                    /* ENABLE dyndoc IN-ERROR EVENTS (DO NOT SEND)   */;29
set ce_dyndoc_corrected_ind = 0
;023-
 
 
/********************************************************************************************
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 
SECTION 9.
 
THE FOLLOWING IS HARD_CODED LOGIC TO REACT THE SETTINGS CONFIGURED IN SECTION 7. AND SECTION 8.
DO NOT ALTER THIS LOGIC.
 
---------------------------------------------------------------------------------------------
********************************************************************************************/
 
;; 011+
/* PowerForm event logic */
if ( ( request->class = "CE" )          AND
     ( request->subtype = "POWERFORMS" )  AND
     ( ce_powerform_ind > 0 )  )
   set powerform_event_ind = 1
 
   if( result_status_cdm = "IN PROGRESS" AND ce_powerform_prelim_ind > 0 )
      set reply->status_data->status = "Z"
      call echo("REJECT CE//GRP IN PROGRESS MESSAGE")
 
   elseif( result_status_cdm = "AUTH" AND ce_powerform_final_ind > 0 )
      set reply->status_data->status = "Z"
      call echo("REJECT CE//GRP AUTH MESSAGE")
 
   elseif( result_status_cdm = "INERROR" AND ce_powerform_inerror_ind > 0 )
      set reply->status_data->status = "Z"
      call echo("REJECT CE//GRP INERROR MESSAGE")
 
   elseif( ( result_status_cdm = "MODIFIED" OR result_status_cdm = "ALTERED" ) AND ce_powerform_corrected_ind > 0 )
      set reply->status_data->status = "Z"
      call echo("REJECT CE//GRP MODIFIED MESSAGE")
   endif
 
endif
;; 011-
 
/* Gen Lab event logic */
if ( ( request->class = "CE" )                      AND
     ( request->subtype = "GRP")                    AND
     ( ce_genlab_ind > 0 )                    )
 
   set genlab_event_ind = 1
 
   if( result_status_cdm = "IN PROGRESS" AND ce_genlab_prelim_ind > 0 )
      set reply->status_data->status = "Z"
      call echo("REJECT CE//GRP IN PROGRESS MESSAGE")
 
   elseif( result_status_cdm = "AUTH" AND ce_genlab_final_ind > 0 )
      set reply->status_data->status = "Z"
      call echo("REJECT CE//GRP AUTH MESSAGE")
 
   elseif( result_status_cdm = "INERROR" AND ce_genlab_inerror_ind > 0 )
      set reply->status_data->status = "Z"
      call echo("REJECT CE//GRP INERROR MESSAGE")
 
   elseif( ( result_status_cdm = "MODIFIED" OR result_status_cdm = "ALTERED" ) AND ce_genlab_corrected_ind > 0 )
      set reply->status_data->status = "Z"
      call echo("REJECT CE//GRP MODIFIED MESSAGE")
   endif
endif
 
 
/* Micro event logic */
if ( ( request->class = "CE" )                      AND
     ( request->subtype = "MICRO")                  AND
     ( ce_genlab_ind > 0 )                    )
 
   set micro_event_ind = 1
 
   if( result_status_cdm = "IN PROGRESS" AND ce_micro_prelim_ind > 0 )
      set reply->status_data->status = "Z"
      call echo("REJECT CE//MICRO IN PROGRESS MESSAGE")
 
   elseif( result_status_cdm = "AUTH" AND ce_micro_final_ind > 0 )
      set reply->status_data->status = "Z"
      call echo("REJECT CE//MICRO AUTH MESSAGE")
 
   elseif( result_status_cdm = "INERROR" AND ce_micro_inerror_ind > 0 )
      set reply->status_data->status = "Z"
      call echo("REJECT CE//MICRO INERROR MESSAGE")
 
   elseif( ( result_status_cdm = "MODIFIED" OR result_status_cdm = "ALTERED" ) AND ce_micro_corrected_ind > 0 )
      set reply->status_data->status = "Z"
      call echo("REJECT CE//MICRO MODIFIED MESSAGE")
   endif
endif
 
/* radiology event logic */
if ( ( ( request->class = "CE" )
     OR ( request->class = "RADNET" )  )              AND
     ( substring(1,3,request->reference_nbr) = "RAD") AND
     ( ce_rad_ind > 0 )                         )
 
   set rad_event_ind = 1
 
   if( request->subtype = "MDOC" )
      if( result_status_cdm = "IN PROGRESS" AND ce_rad_prelim_ind > 0 )
         set reply->status_data->status = "Z"
         call echo("REJECT CE/RAD/MDOC IN PROGRESS MESSAGE")
 
      elseif( result_status_cdm = "AUTH" AND ce_rad_final_ind > 0 )
         set reply->status_data->status = "Z"
         call echo("REJECT CE/RAD/MDOC AUTH MESSAGE")
 
      elseif( result_status_cdm = "INERROR" AND ce_rad_inerror_ind > 0 )
         set reply->status_data->status = "Z"
         call echo("REJECT CE/RAD/MDOC INERROR MESSAGE")
 
      elseif( ( result_status_cdm = "MODIFIED" OR result_status_cdm = "ALTERED" ) AND ce_rad_corrected_ind > 0 )
         set reply->status_data->status = "Z"
         call echo("REJECT CE/RAD/MDOC MODIFIED MESSAGE")
 
      ;; 016 - begin
      elseif( result_status_cdm = "REJECTED" and ce_rad_reject_ind > 0 )
         set reply->status_data->status = "Z"
         call echo( "REJECT CE/RADRJCTEXAM/MDOC MESSAGE" )
      endif
      ;; 016 - end
 
   ;013 Begin
   elseif( ( request->subtype = "RAD" ) AND ( request->stype = "RADREMOVEXAM" ) )
      if ( ce_rad_remove_ind > 0 )
         set reply->status_data->status = "Z"
         call echo( "REJECT CE/RADREMOVEXAM/RAD MESSAGE" )
      endif
   ;013 End
 
   else
      set reply->status_data->status = "Z"
      call echo("REJECT CE/RAD/non-MDOC, non-RADREMOVEXAM MESSAGE or non-RADRJCTEXAM MESSAGE")   ;013
   endif
endif
 
/* AP event logic */
if ( ( request->class = "CE" )                      AND
     ( request->stype = "AP")                       AND
     ( ce_ap_ind > 0 )                        )
 
   set ap_event_ind = 1
 
   if ( request->subtype = "AP" )
 
      set reply->status_data->status = "Z"
      call echo("REJECT CE/AP/AP MESSAGE")      /* 007 */
 
   else
      if( result_status_cdm = "IN PROGRESS" AND ce_ap_prelim_ind > 0 )
         set reply->status_data->status = "Z"
         call echo("REJECT CE/AP IN PROGRESS MESSAGE")
 
      elseif( result_status_cdm = "AUTH" AND ce_ap_final_ind > 0 )
         set reply->status_data->status = "Z"
         call echo("REJECT CE/AP AUTH MESSAGE")
 
      elseif( result_status_cdm = "INERROR" AND ce_ap_inerror_ind > 0 )
         set reply->status_data->status = "Z"
         call echo("REJECT CE/AP INERROR MESSAGE")
 
      elseif( ( result_status_cdm = "MODIFIED" OR result_status_cdm = "ALTERED" ) AND ce_ap_corrected_ind > 0 )
         set reply->status_data->status = "Z"
         call echo("REJECT CE/AP MODIFIED MESSAGE")
      endif
   endif
endif
 
/* 008 - AP event logic for 2000.01 */
if ( ( request->class = "CE" )                      AND
     ( substring(1,3,request->stype) = "AP_" )      AND
     ( ce_ap_ind > 0 )                        )
 
   set ap_event_ind = 1
 
   if ( request->subtype = "AP_CASE" )
 
      set reply->status_data->status = "Z"
      call echo("REJECT CE/AP_CASE MESSAGE")
 
   else
      if( result_status_cdm = "IN PROGRESS" AND ce_ap_prelim_ind > 0 )
         set reply->status_data->status = "Z"
         call echo("REJECT CE/AP_xxx IN PROGRESS MESSAGE")
 
      elseif( result_status_cdm = "AUTH" AND ce_ap_final_ind > 0 )
         set reply->status_data->status = "Z"
         call echo("REJECT CE/AP_xxx AUTH MESSAGE")
 
      elseif( result_status_cdm = "INERROR" AND ce_ap_inerror_ind > 0 )
         set reply->status_data->status = "Z"
         call echo("REJECT CE/AP_xxx INERROR MESSAGE")
 
      elseif( ( result_status_cdm = "MODIFIED" OR result_status_cdm = "ALTERED" ) AND ce_ap_corrected_ind > 0 )
         set reply->status_data->status = "Z"
         call echo("REJECT CE/AP_xxx MODIFIED MESSAGE")
 
      elseif( trim(request->stype) = "AP_SNOMED" AND ce_ap_snomed_ind > 0 )
         set reply->status_data->status = "Z"
         call echo("REJECT CE/AP_SNOMED MODIFIED MESSAGE")
      endif
   endif
endif
 
 
/* 005 generic MDOC event logic */
if ( ( request->class = "CE" )                       AND
     ( request->stype = "MDOC")                      AND
     ( request->subtype = "MDOC")                    AND
     ( ce_mdoc_ind > 0 )                    )
 
   set mdoc_event_ind = 1
 
   if( result_status_cdm = "IN PROGRESS" AND ce_mdoc_prelim_ind > 0 )
      set reply->status_data->status = "Z"
      call echo("REJECT CE/MDOC/MDOC IN PROGRESS MESSAGE")
 
   elseif( result_status_cdm = "TRANSCRIBED" AND ce_mdoc_trans_ind > 0 )
      set reply->status_data->status = "Z"
      call echo("REJECT CE/MDOC/MDOC TRANSCRIBED MESSAGE")
 
   elseif( result_status_cdm = "AUTH" AND ce_mdoc_final_ind > 0 )
      set reply->status_data->status = "Z"
      call echo("REJECT CE/MDOC/MDOC AUTH MESSAGE")
 
   elseif( result_status_cdm = "INERROR" AND ce_mdoc_inerror_ind > 0 )
      set reply->status_data->status = "Z"
      call echo("REJECT CE/MDOC/MDOC INERROR MESSAGE")
 
   elseif( ( result_status_cdm = "MODIFIED" OR result_status_cdm = "ALTERED" ) AND ce_mdoc_corrected_ind > 0 )
      set reply->status_data->status = "Z"
      call echo("REJECT CE/MDOC/MDOC MODIFIED MESSAGE")
   endif
endif
 
/* 012 PowerNotes event logic */
if ( ( request->class = "CE" )                      AND
     ( request->stype = "DOC")                      AND
     ( request->subtype = "DOC")                    AND
     ( ce_doc_ind > 0 )                    )
 
   set doc_event_ind = 1
 
/*  015 +
   if( result_status_cdm = "IN PROGRESS" AND ce_doc_prelim_ind > 0 )
      set reply->status_data->status = "Z"
      call echo("REJECT CE/DOC/DOC IN PROGRESS MESSAGE")
 
   elseif( result_status_cdm = "TRANSCRIBED" AND ce_doc_trans_ind > 0 )
      set reply->status_data->status = "Z"
      call echo("REJECT CE/DOC/DOC TRANSCRIBED MESSAGE")
    015 -
 */
 
   if( result_status_cdm = "AUTH" AND ce_mdoc_final_ind > 0 )
      set reply->status_data->status = "Z"
      call echo("REJECT CE/DOC/DOC AUTH MESSAGE")
 
   elseif( result_status_cdm = "INERROR" AND ce_doc_inerror_ind > 0 )
      set reply->status_data->status = "Z"
      call echo("REJECT CE/DOC/DOC INERROR MESSAGE")
 
   elseif( ( result_status_cdm = "MODIFIED" OR result_status_cdm = "ALTERED" ) AND ce_doc_corrected_ind > 0 )
      set reply->status_data->status = "Z"
      call echo("REJECT CE/DOC/DOC MODIFIED MESSAGE")
   endif
endif
 
;023+
if ( ( request->class = "CE" ) AND
     ( request->stype = "MDOC") AND
     ( request->subtype = "DYNDOC") AND
     ( ce_dyndoc_ind > 0 ) )
     call echo("This is CE:MDOC:DYNDOC trigger")
 
   set dyndoc_event_ind = 1
 
   if( result_status_cdm = "IN PROGRESS" AND ce_dyndoc_prelim_ind > 0 )
      set reply->status_data->status = "Z"
      call echo("REJECT CE/MDOC/DYNDOC IN PROGRESS MESSAGE")
 
   elseif( result_status_cdm = "TRANSCRIBED" AND ce_dyndoc_trans_ind > 0 )
      set reply->status_data->status = "Z"
      call echo("REJECT CE/MDOC/DYNDOC TRANSCRIBED MESSAGE")
 
   elseif( result_status_cdm = "AUTH" AND ce_dyndoc_final_ind > 0 )
      set reply->status_data->status = "Z"
      call echo("REJECT CE/MDOC/DYNDOC AUTH MESSAGE")
 
   elseif( result_status_cdm = "INERROR" AND ce_dyndoc_inerror_ind > 0 )
      set reply->status_data->status = "Z"
      call echo("REJECT CE/MDOC/DYNDOC INERROR MESSAGE")
 
   elseif( ( result_status_cdm = "MODIFIED" OR result_status_cdm = "ALTERED" ) AND ce_dyndoc_corrected_ind > 0 )
      set reply->status_data->status = "Z"
      call echo("REJECT CE/MDOC/DYNDOC MODIFIED MESSAGE")
   endif
endif
;023-
 
;014 Begin
/* Immunization event logic */
if ( ( request->class = "CE" ) AND
     ( request->subtype = "IMMUNIZATION" ) AND
     ( ce_immun_ind > 0 ) )
    set immun_event_ind = 1
endif
;014 End
 
 
;017+
/* Bloodbank SPR event logic */
 
if ( ( request->class = "CE" ) AND
     ( request->subtype = "BBPRODUCT" ) AND
     ( ce_bloodbank_spr_ind > 0 ) )
 
    set bloodbank_spr_event_ind = 1
 
endif
;017-
 
/* Micro event logic */
if(    ( genlab_event_ind = 0 )                       AND
       ( micro_event_ind = 0 )                        AND
       ( rad_event_ind = 0 )                          AND
       ( ap_event_ind = 0 )                           AND
       ( mdoc_event_ind = 0 )                         AND       /* 005 */
       ( doc_event_ind = 0 )                          AND       ; 012 added a check for doc_event_ind
       ( powerform_event_ind = 0 )                    AND       ;; 011 added a check for powerform_event_ind
       ( immun_event_ind = 0 )                        AND       ;; 014 added check for immun_event_ind
       ( bloodbank_spr_event_ind = 0 )                AND       ;017 added check for bloodbank_spr_event_ind
       ( dyndoc_event_ind = 0 ) )                                ;;023
 
   set reply->status_data->status = "Z"
   call echo("REJECT UNKNOWN OR UNCONFIGURED EVENT")
endif
 
;010 begin
if( request->subtype = "GRP_PHR" or request->subtype = "MDOC_PHR")
        set reply->status_data->status = "S"
elseif (request->subtype = "AP_PHR")
        set reply->status_data->status = "Z"
        call echo("REJECT CE/AP_PHR MESSAGE")
endif
;010 end
 
 
/********************************************************************************************
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 
SECTION 10.
 
PERFORM ALL SITE SPECIFIC CUSTOM CODING HERE
 
Use basic IF statements to check any variable condition to determime when to set the
reply->status_data->status variable to a "Z" (to suppress).  Since the
reply->status_data->status variable is default to "S", the order event is assumed to be
valid until a suppression condition below is encountered.
 
Use varibles defined in Sections 1 and 2 above in the IF statements.  DO NOT use code_value
variables in the REQUEST record as it leads to a non-portable implementation between
environment.  Instead, use the CDF MEANING or DISPLAY variable declared in Section 2 and
values fetched in Section 6.
 
---------------------------------------------------------------------------------------------
********************************************************************************************/
 
;;****** Begin BayCare Scripting ******
 
call echo("<===== Baycare Custom Scripting Begin =====>")
 
;/* Suppress ORU events passed by the TELETRACKING contributor_system - */
if (trim(contributor_system_disp) = "TELETRAK")
  set reply->status_data->status = "Z"
  call echo("TELETRAK ORU PASS THROUGH EVENTS SUPPRESSED")
endif
 
;/* Suppress ORU events passed by the HXCLIN contributor_system - */;;029
if (trim(contributor_system_disp) = "HXCLIN")
  set reply->status_data->status = "Z"
  call echo("HXCLIN ORU PASS THROUGH EVENTS SUPPRESSED")
endif
 
/* APReport and Micro endorse action event logic */
if (request->class = "CE" and ((request->subtype = "MDOC" and request->stype = "AP")
                          or request->subtype = "MICRO"))
 
  call echo ("Document is an AP or Micro document")
 
  declare updttask = vc
  declare verfieddttm = dq8
 
  select into "nl:"
    ce.event_id
  from
    clinical_event ce
  where
    ce.event_id = request->event_id
    and
    ce.valid_until_dt_tm = cnvtdatetime("31-DEC-2100 00:00:00.00")
  detail
    updttask = cnvtstring(ce.updt_task)
  with nocounter
 
  if (updttask = "600005")
    set reply->status_data->status = "Z"
    call echo("ESO_GET_CE_SELECTION Message suppressed - endorse action")
  endif
 
  go to exit_script
endif
 
;begin 028
/* CE GRP trigger sends results that are not lab outbound */
if (request->class = "CE" and request->subtype = "GRP")
  declare activity_type_cd = f8
  declare ap = f8 with constant(uar_get_code_by("MEANING",106,"AP"))
  declare bb = f8 with constant(uar_get_code_by("MEANING",106,"BB"))
  declare micro = f8 with constant(uar_get_code_by("MEANING",106,"MICROBIOLOGY"))
  declare gl = f8 with constant(uar_get_code_by("MEANING",106,"GLB"))
 
  declare zzformbuilder = vc with constant(uar_get_code_display(request->event_cd))
 
  call echo ("Document is a CE GRP document")
  call echo(build("formbuilder=",zzformbuilder))
 
  select into "nl:"
    o.activity_type_cd
  from
    clinical_event ce
    , orders o
  plan ce
    where ce.event_id = request->event_id
      and ce.valid_until_dt_tm > cnvtdatetime(curdate,curtime3)
  join o
    where o.order_id = ce.order_id
  detail
    activity_type_cd = o.activity_type_cd
  with nocounter
 
  ;curqual is used because there may be (very few) instances where there is no order_id for a result.
  if (curqual > 0)
    if (activity_type_cd not in (ap, bb, micro, gl))
      set reply->status_data->status = "Z"
      call echo("ESO_GET_CE_SELECTION CE GRP Message suppressed - not a lab result")
    endif
  endif
 
  ;zzformbuilder discrete results are surgical notes that are triggered out the CE GRP trigger that need to go outbound
  if (zzformbuilder = "zzzFormbuilder Form*")
    set reply->status_data->status = "S"
    call echo("ESO_GET_CE_SELECTION CE GRP Message unsuppressed - SurgiNet notes / discrete result to HealthGrid")
  endif
 
  go to exit_script
endif ;end CE GRP Trigger
;end 028
 
;begin 029
/*
  When a physician CC's a provider when they sign a document, HIM forwards the document to the CC'd provider. A document is going
  outbound when that forward happens. When the CC'd physician reviews the document, another document is sent outbound. This logic
  ensures that only the first document that is signed goes outbound. In other words, we are suppressing all reviewed documents.
 
  We are excluding AP from this code because all AP documents that are triggered outbound should go.
*/
 
if (request->subtype in ("MDOC", "DOC", "POWERFORMS")
  and request->stype != "AP") ;031
 
  declare review_cd = f8 with constant(uar_get_code_by("MEANING",21,"REVIEW"))
  declare action_type_cd = f8
 
  call echo ("Document is an MDOC, DOC, or POWERFORM document")
 
  select into "nl:"
  from
    clinical_event ce
    , ce_event_prsnl cep
  plan ce
    where ce.event_id = request->event_id
      and ce.clinical_event_id = (select
                                    max(ce2.clinical_event_id)
                                  from
                                    clinical_event ce2
                                  where ce2.event_id = request->event_id)
  join cep
    where cep.event_id = ce.event_id
  ;begin 32
;      and cep.action_type_cd = review_cd
;      and cep.valid_from_dt_tm > cnvtlookbehind("15,S") ;look back 15 seconds from now for review action type
  order by
    cep.valid_from_dt_tm desc
  detail
    action_type_cd = cep.action_type_cd
  with nocounter, maxrec = 1
 
  if (action_type_cd = review_cd)
    set reply->status_data->status = "Z"
    call echo("Message suppressed - Suppressing reviewed document")
    go to exit_script
  else
    set action_type_disp = uar_get_code_display(action_type_cd)
    call echo(build2("Document is in a ", trim(action_type_disp), " status. Executing HIE, Optum, and HG logic."))
  endif
  ;end 032
;end 029
 
;begin 030
/*
  Roughly 75% of documents are being skipped because OBX4.1/4.2 do not match documents that should be sent to Healthgrid, Optum or
  HIE. The following logic will ensure that the documents should go to at least one of the three systems or it will be skipped.
  This logic was moved from the mod object scripts
*/
  set optum = uar_get_code_by("DISPLAYKEY",73,"OPTUM")
  ;healthgrid
  set ed_patient_summary = uar_get_code_by("DISPLAYKEY",72,"EDPATIENTSUMMARY")
  set disc_summary_care = uar_get_code_by("DISPLAYKEY",72,"DISCHARGESUMMARYOFCARE")
  ;hie
  set history_and_physicals = uar_get_code_by("DISPLAYKEY",72,"HISTORYANDPHYSICALS")
  set discharge_summary = uar_get_code_by("DISPLAYKEY",72,"DISCHARGESUMMARY")
  set consultation = uar_get_code_by("DISPLAYKEY",72,"CONSULTATION")
  set operative_reports = uar_get_code_by("DISPLAYKEY",72,"OPERATIVEREPORTS")
  set cardiology_consult = uar_get_code_by("DISPLAYKEY",72,"CARDIOLOGYCONSULTATION")
  set wound_consult = uar_get_code_by("DISPLAYKEY",72,"WOUNDCARECONSULTATION")
  set oncology_consult = uar_get_code_by("DISPLAYKEY",72,"ONCOLOGYCONSULTATION")
  set tele_neuro_consult = uar_get_code_by("DISPLAYKEY",72,"TELENEUROLOGYCONSULTATION")
  set ob_procedure_note = uar_get_code_by("DISPLAYKEY",72,"OBPROCEDURENOTE")
  set ed_physician_note = uar_get_code_by("DISPLAYKEY",72,"EDPHYSICIANNOTES")
  set gi_endo_report = uar_get_code_by("DISPLAYKEY",72,"GIENDOSCOPYREPORTS")
 
  /* The default status is being changed from "S" to "Z" to allow us to immediately send the message outbound when a successful
	condition is met.*/
 
  set reply->status_data->status = "Z"
 
  call echo("Defaulting reply->status_data->status to 'Z'")
 
  /* The condition for Healthgrid happens first because there is no database hit, thus it is the most performant to list first.
	If the condition is met we send the message outbound regardless of the Optum and HIE conditions. If the condition is not met,
	then the script jumps to the Optum condition and then the HIE condition.
  */
 
  ;Healthgrid
  if (request->event_cd in (ed_patient_summary, disc_summary_care))
    set reply->status_data->status = "S"
    call echo("Message unsuppressed - document is ED Patient Summary or Discharge Summary of Care")
    go to exit_script ;we are sending to at least Healthgrid
  endif
 
 
  ;Optum
  select
    cvo.alias
  from
    code_value_outbound cvo
  where cvo.code_value = request->event_cd
    and cvo.code_set = 72
    and cvo.contributor_source_cd = optum
	and cvo.alias != "DONOTSEND"
  with nocounter
 
  if (curqual > 0)
    set reply->status_data->status = "S" ;we are sending to at least Optum
    call echo("Message unsuppressed - document aliased to go to Optum")
	go to exit_script
  endif
 
  ;Reminder: There is an Optum code set Interface rule set to add an alias of DONOTSEND when a CD: value is found.
 
  ;HIE - activity type will determine whether we send to HIE
  if (request->event_cd in (history_and_physicals
							,discharge_summary
							,consultation
							,operative_reports
							,cardiology_consult
							,wound_consult
							,oncology_consult
							,tele_neuro_consult
							,ob_procedure_note
							,ed_physician_note
							,gi_endo_report))
	  set reply->status_data->status = "S" ;we are sending to at least HIE
	  call echo("Message unsuppressed - document type matches an HIE document type")
	  go to exit_script
  else
    call echo("Document doesn't match an HIE document...checking activity type and subactivity type...")
 
    declare activity_type_cd = f8
    declare activity_subtype_cd = f8
    ;sub activity types
    set cardionohie = uar_get_code_by("DISPLAYKEY",5801,"CARDIONOHIE")
    set cardionohie2 = uar_get_code_by("DISPLAYKEY",5801,"CARDIOLOGYNOHIE")
    ;activity types
    set cardiology_services = uar_get_code_by("DISPLAYKEY",106,"CARDIOLOGYSERVICES")
    set cardiac_cath_lab = uar_get_code_by("DISPLAYKEY",106,"CARDIACCATHLAB")
    set cardiac_tx_procedures = uar_get_code_by("DISPLAYKEY",106,"CARDIACTXPROCEDURES")
    set pedi_cardiology_services = uar_get_code_by("DISPLAYKEY",106,"PEDICARDIOLOGYSERVICES")
    set boi_cardiology = uar_get_code_by("DISPLAYKEY",106,"BOICARDIOLOGY")
    set boi_cardiovascular = uar_get_code_by("DISPLAYKEY",106,"BOICARDIOVASCULAR")
    set op_dx_card = uar_get_code_by("DISPLAYKEY",106,"OPDXCARD")
    set ambulatory_echo = uar_get_code_by("DISPLAYKEY",106,"AMBULATORYECHO")
    set cardiovascular = uar_get_code_by("DISPLAYKEY",106,"CARDIOVASCULAR")
    set ambulatory_cardiovascular = uar_get_code_by("DISPLAYKEY",106,"AMBULATORYCARDIOVASCULAR")
 
	select into "nl:"
	  o.activity_type_cd
	  , oc.activity_subtype_cd
    from
	  clinical_event ce
	  , orders o
	  , order_catalog oc
	plan ce
	  where ce.event_id = request->event_id
	join o
	  where o.order_id = ce.order_id
	join oc
	  where oc.catalog_cd = o.catalog_cd
	detail
      activity_type_cd = o.activity_type_cd
	  activity_subtype_cd = oc.activity_subtype_cd
	with nocounter
 
	if (activity_subtype_cd in (cardionohie, cardionohie2))
	  set reply->status_data->status = "Z" ;here for clarity because value is already "Z"
	  call echo("Message suppressed - subactivity type is either cardionohie or cardionohie2")
	  go to exit_script
	endif
 
	if (activity_type_cd in (cardiology_services
							,cardiac_cath_lab
							,cardiac_tx_procedures
							,pedi_cardiology_services
							,boi_cardiology
							,boi_cardiovascular
							,op_dx_card
							,ambulatory_echo
							,cardiovascular
							,ambulatory_cardiovascular
							))
	  set reply->status_data->status = "S"
	  call echo("Message unsuppressed - activity type matches HIE activity type")
	  go to exit_script
	else
	  call echo(build("Message suppressed - activity type of ", value(uar_get_code_display(activity_type_cd)), " is not valid"))
	endif
  endif ;end HIE Remember to check Hospital MUSE EKG for rebound results out
;end 030
endif ;end DOC/MDOC
 
#exit_script
 
call echo(concat("ESO_GET_CE_SELECTION STATUS = ",reply->status_data->status))          ;; 009
 
end
go