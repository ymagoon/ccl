 ;;Solution_Test/script/PathNet -- Microbiology/pathnet_ocd_subroutines/pathnet_ocd_subroutines.inc Turn on black mode

/*~BB~************************************************************************
      *                                                                      *
      *  Copyright Notice:  (c) 1983 Laboratory Information Systems &        *
      *                              Technology, Inc.                        *
      *       Revision      (c) 1984-1995 Cerner Corporation                 *
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

	Source file name:       pathnet_ocd_subroutines.inc
	Object name:            
	Request #:		0

	Product:		PathNet Microbiology                         
	Product Team:		PathNet Microbiology
	HNA Version:            500
	CCL Version:            
	
	Program purpose:        The purpose of this application is to perform 
				various routines required for the PathNet 
				Cumulative OCD ReadMes.

	Tables read:            n/a

	Tables updated:		n/a

	Executing from:         Various PathNet ReadMes

	Special Notes:		ONLY PASSIVE CHANGES CAN BE MADE TO THE PUBLIC
				FUNCTIONS WITHIN THIS FILE!!!  PRIVATE FUNCTIONS,
				HOWEVER MAY EVENTUALLY HAVE NON-PASSIVE CHANGES
				MADE TO THEM SO PLEASE DO NOT UTILIZE THE 
				PRIVATE FUNCTIONS DIRECTLY WITHIN THE READMEs.
				Therefore, if it would require a rewrite to any
				existing READMEs or SCRIPTs that use this file
				then create a new function for it and leave the
				old functions as they currently exist.

******************************************************************************/

 
;~DB~***************************************************************************
;    *                      GENERATED MODIFICATION CONTROL LOG                 *
;    ***************************************************************************
;    *                                                                         *
;    *Mod Date     Engineer		Comment 			       *
;    *--- -------- --------------------	-----------------------------------    *
;     ### 01/11/01 Chris Cline          Initial Release                        *
;     001 01/23/01 Chris Cline          Implemented the Word Wrap function.    *
;     002 01/25/01 Chris Cline          Implemented the GET_CD_FOR_CDF API.    *
;     003 01/29/01 Chris Cline          Implemented the __LOGTOFILE API.       *
;     004 01/29/01 Chris Cline          Renamed DISPLAYMSG to __DISPLAYMSG     *
; 					to make it a "PRIVATE" function.       *
;     005 01/30/01 Chris Cline 		Added WORD_WRAP into __DISPLAYMSG.     *
;     006 01/30/01 Chris Cline 		Addressed an issue with __DISPLAYMSG   *
;					calling WORD_WRAP 2 levels deep.       *
;     007 02/09/01 Chris Cline          Added LOGSTATUS call into LOGSCRIPTEND *
;     008 02/16/01 Chris Cline          Added POST_EVENT_CODE script.          *
;     009 02/16/01 Chris Cline          Added FINDREQPROC & INSERTREQPROC.     *
;     010 02/16/01 Chris Cline          Updated GET_CD_FOR_CDF to operate as   *
;                                       a function: dCode = GET_CD_FOR_CDF(..) *
;     011 02/22/01 Chris Cline		Added VALUE() around __sLOGFILENAME    *
;					within __LOGTOFILE.                    *
;     012 02/27/01 Chris Cline 		Removed e_RDMSTATUS from LOGSCRIPTEND  *
;					and LOGSCRIPTSTART APIs.               *
;     013 02/27/01 Chris Cline 		Added TRIM() around sLine within the   *
;					__LOGTOFILE API.		       *
;     014 02/28/01 Chris Cline          Added TRIM() around sMsg within the    *
;					WORD_WRAP API. And added sTempLine to  *
;     					the recWordWrap record structure to    *
;					correctly TRIM() within __LOGTOFILE.   *
;     015 03/01/01 Chris Cline		Fix the __LOGTOFILE API to work the    *
;					TRIM() statement correctly.            *
;     016 03/02/01 Chris Cline          Switched the [d.seq] to [nIdx] within  *
;           				__LOGTOFILE.                           *
;     017 04/20/01 Chris Cline		Removed NOFORMFEED option in the       *
;					__LOGTOFILE to remove 60 added lines.  *
;    *018 09/17/04 Hal Patchen      Update the CS_UPDATE_DISPLAY routine to use*
;    *                              the gold master code_value script.  Remove *
;    *                              the CS_UPDATE_CDF, CS_UPDATE_DESC, and     *
;    *                              CS_UPDATE_DEFINITION routines which are not*
;    *                              used.                                      * 
;    *019 10/20/05 Josh Arnold      1. Initialize status in LOGSCRIPTSTART     *
;    *                              2. Echo status strucutre in LOGSCRIPTEND   *
;    *                              3. Preserve current status in LOGMSG       *
;    *                              4. Created LOGSETSTATUS function           *
;~DE~***************************************************************************


;~END~ ******************  END OF ALL MODCONTROL BLOCKS  ********************
/****************************************
  PATHNET_OCD_SUBROUTINE API Listing.

  PUBLIC VARIABLES:
  ---------------------
  g_dCodeValue  (F8)    Used within the GET_CD_FOR_CDF subroutine to hold the
			code_value returned by the GET_CD_FOR_CDF call.
  e_DISPMSG     (I2)    Used within LOGMSG to display a message to the script.
  e_RDMSTATUS   (I2)    Used within LOGMSG to log message to status report.
  e_LOGTOFILE   (I2)    Used within LOGMSG to log a message to a log file.
  e_INSERTATSTART (I2)  Used within INSERTREQPROC to insert a request processing row
			as sequence #1 for a given request_number.
  e_INSERTBEFORE  (I2)  Used within INSERTREQPROC to insert a request processing row
			before a specific format script.
  e_INSERTAFTER   (I2)  Used within INSERTREQPROC to insert a request processing row
			after a specific format script.
  e_INSERTATEND   (I2)  Used within INSERTREQPROC to insert a request processing row
			as the last sequence + 1 for a given request_number.
  recWordWrap	(RECORD) Record structure used within the WORD_WRAP subroutine to
			 return the word wrapped series of strings.

  PRIVATE VARIABLES:    (Granted all variables are public, but we would prefer that
			 these variables are only populated & accessed by the PUBLIC
			 & PRIVATE subroutines & not outside of these.)
  ---------------------
  __sLogFilename  (C30)  Used within LOGSCRIPTSTART & LOG_TO_FILE to determine the log filename.
  recStatus	(RECORD) Record structure used within LOGSTATUS & LOGSCRIPTEND to 
			 hold the final log status & status message.

  PUBLIC SUBROUTINES:
  ---------------------
  LOGMSG               	(sMsg, nLog) [valid values: e_DISPMSG, e_RDMSTATUS & e_LOGTOFILE]
  LOGSTATUS            	(sMsg, sStatus)
  LOGSCRIPTSTART       	(sScriptName)
  LOGSCRIPTEND		(sScriptName)
  ADDREQPROC           	(nRequest, nSequence, sPFMT, nTargetReq, nDestStep, sService, nReprocess)
  CHGREQPROC           	(nRequest, sOldPFMT, sNewPFMT, nTargetReq, nDestStep, sService, nReprocess)
  DELREQPROC           	(nRequest, sPFMT)
  CS_UPDATE_DISPLAY    	(code_set, cdf_meaning, display, new_display)
  STAMP_APP            	(app_number)
  STAMP_TASK           	(task_number)
  STAMP_REQ            	(req_number)
  WORD_WRAP		(sMsg, nWrapLength) ;Populates recWordWrap
  GET_CD_FOR_CDF	(nCodeSet, sCDF)
  POST_EVENT_CODE  	(sEventSetName, sEventSetDisp, sEventSetDesc, sEventSetDef, 
			 sStatus, sFormat, sStorage, sEventClass, sEventConfLvl, 
			 sEventSubclass, sEventCdStatus, dEventCd, dParentCd, dFlex1Cd, 
			 dFlex2Cd, dFlex3Cd, dFlex4Cd, Flex5Cd)
  FINDREQPROC		(nRequest, sPFMT, nSeq) = i4
  INSERTREQPROC		(nRequest, sPFMT, nTargetReq, nDestStep, sService, nReprocess, nAction,
			 sRefPFMT, nSeq)


  PRIVATE SUBROUTINES:  (Granted all subroutines are public, but we would prefer that
			 this routine only be used internally to the PUBLIC subroutines.
			 PASSIVITY rules will only be evaluated for the PUBLIC SUBROUTINES.)
  ---------------------
  __DISPLAYMSG          (sString)
  __LOGTOFILE		(sMsg, bAppend)

****************************************/

/******************************
** Include DATA TEAM LOGGING **
******************************/
%i cclsource:dm_readme_data.inc
%i cclsource:dm_post_event_code.inc

/*******************************************
** Include Gold Master Script Definitions **
*******************************************/
%i cclsource:gm_u_code_value0619_def.inc


/*************************
** Variable Declaration **
**                      **********************
** This section declares all API variables. **
*********************************************/
DECLARE g_dCodeValue 	= f8
DECLARE __sLogFilename 	= c30
DECLARE e_DISPMSG	= I2
DECLARE e_RDMSTATUS	= I2
DECLARE e_LOGTOFILE	= I2
DECLARE e_InsertAtStart = i2
DECLARE e_InsertBefore 	= i2
DECLARE e_InsertAfter 	= i2
DECLARE e_InsertAtEND 	= i2

SET e_InsertAtStart 	= 1
SET e_InsertBefore 	= 2
SET e_InsertAfter 	= 3
SET e_InsertAtEND 	= 4
SET e_DISPMSG 		= 1
SET e_RDMSTATUS		= 2
SET e_LOGTOFILE		= 4

RECORD recWordWrap
(
    1 sTempLine = vc  ;Used for TRIMMING in LOGTOFILE.
    1 nLines = i4  ;Numder of sLines in qual.
    1 nMaxLng = i4 ;Maximum line length.
    1 qual[*]
      2 sLine = vc
)

RECORD recStatus
(
  1 sStatusChar = c1 ;Status of README (S, F)
  1 sStatusMsg  = vc ;Status justification.
)


/****************************
** __DISPLAYMSG (sString)  **  
**                         ************************
** This function displays sString via call echos **
** surrounded by '*'.                            **
**************************************************/
SUBROUTINE __DISPLAYMSG(sString)
  DECLARE nIdx = i4
  ;DECLARE sLINEMSG (undeclared so that it will vary based on Max Line Length.)
  
  CALL WORD_WRAP(sString, 70)
  
  SET sBorder = SUBSTRING(1, value(recWordWrap->nMaxLng + 6), FILLSTRING(130, "*"))
  SET sLINETMP = FILLSTRING(70, " ")
  SET sLINEMSG = SUBSTRING(1, VALUE(recWordWrap->nMaxLng), sLINETMP)

  CALL ECHO(sBorder)
  FOR (nIdx = 1 to recWordWrap->nLines)
    SET sLINEMSG = recWordWrap->qual[nIdx]->sLine
    SET sLINEMSG2 = CONCAT("**|", sLINEMSG, "|**")
    CALL ECHO(sLINEMSG2)
  ENDFOR
  CALL ECHO(sBorder)
END

/*************************
** LOGMSG (sMsg, nLog)  **  
**                       *****************************
** This function performs the needed README logging **
** or displaying of messages to the user.  The sMSG **
** parameter is the message to display or log and   **
** nLog parameter determines if you are displaying  **
** a message to an end user or logging it out to    **
** the DM_README_STATUS.   			                **
**		e_DISPMSG   - DisplayMsg   	                **
** 		e_RDMSTATUS - DM_README_STATUS              **
**		e_LOGTOFILE - __LOGTOFILE	                **
**						                            **
** These can be combined with a "+" as in:     	    **
**     e_DISPMSG + e_RDMSTATUS + e_LOGTOFILE        **
**						                            **
** NOTE:  Only option e_LOGTOFILE is a historical.  **
** log of what occurred withint he installation.    **
**                                                  **
** WARNING: Logging to e_RDMSTATUS performs an      **
** implicit Commit                                  **
*****************************************************/
SUBROUTINE LOGMSG(sMsg, nLog)
  DECLARE sSaveMsg = VC WITH noconstant(""),private
  DECLARE sSaveStatus = VC WITH noconstant(""),private
  CASE(nLog)
   of 1:  ;(e_DISPMSG)
     CALL __DISPLAYMSG(sMsg)

   of 2:  ;(e_RDMSTATUS)
    set sSaveMsg = readme_data->message
    set sSaveStatus = readme_data->status
    set readme_data->message = sMsg
    set readme_data->status = ""
    execute DM_README_STATUS
    set readme_data->message = sSaveMsg
    set readme_data->status = sSaveStatus

   of 3:  ;(e_DISPMSG + e_RDMSTATUS)
    CALL __DISPLAYMSG(sMsg)
    set sSaveMsg = readme_data->message
    set sSaveStatus = readme_data->status
    set readme_data->message = sMsg
    set readme_data->status = ""
    execute DM_README_STATUS
    set readme_data->message = sSaveMsg
    set readme_data->status = sSaveStatus

   of 4:  ;(e_LOGTOFILE)
    CALL __LOGTOFILE(sMsg, 1)

   of 5:  ;(e_DISPMSG + e_LOGTOFILE)
    CALL __DISPLAYMSG(sMsg)
    CALL __LOGTOFILE(sMsg, 1)

   of 6:  ;(e_RDMSTATUS + e_LOGTOFILE)
    set sSaveMsg = readme_data->message
    set sSaveStatus = readme_data->status
    set readme_data->message = sMsg
    set readme_data->status = ""
    execute DM_README_STATUS
    set readme_data->message = sSaveMsg
    set readme_data->status = sSaveStatus
    CALL __LOGTOFILE(sMsg, 1)

   of 7:  ;(e_DISPMSG + e_RDMSTATUS + e_LOGTOFILE)
    CALL __DISPLAYMSG(sMsg)
    set sSaveMsg = readme_data->message
    set sSaveStatus = readme_data->status
    set readme_data->message = sMsg
    set readme_data->status = ""
    execute DM_README_STATUS
    set readme_data->message = sSaveMsg
    set readme_data->status = sSaveStatus
    CALL __LOGTOFILE(sMsg, 1)
  
   else
    CALL __LOGTOFILE(BUILD("ERROR - BAD nLOG:[", nLog, "]... for Message:", sMsg))
  ENDCASE
END

/*******************************
** LOGSETSTATUS (sMsg, sStatus)  **  
**                            ****************
** This function sets the current status of **
** the script, and writes the new status to **
** the log file.   It does not write to     **
** DM_README_STATUS.   Use this to update   **
** the status periodically during script    **
** excecution.                              **
*********************************************/
SUBROUTINE LOGSETSTATUS(sMsg, sStatus)
    set recStatus->sStatusChar = sStatus
    set recStatus->sStatusMsg  = sMsg
    set readme_data->message = sMsg
    set readme_data->status = sStatus
    CALL LOGMSG(BUILD("[Status:", sStatus, "]--", sMsg), e_LOGTOFILE)
END


/*******************************
** LOGSTATUS (sMsg, sStatus)  **  
**                            *****************
** This function logs the status to the new  **
** DM_README_STATUS routine.                 **
**                                           **
** NOTE: This performs an implict commit     **
**********************************************/
SUBROUTINE LOGSTATUS(sMsg, sStatus)
    set recStatus->sStatusChar = sStatus
    set recStatus->sStatusMsg  = sMsg
    set readme_data->message = sMsg
    set readme_data->status = sStatus
    execute DM_README_STATUS
    CALL LOGMSG(BUILD("[Status:", sStatus, "]--", sMsg), e_LOGTOFILE)
END


/**********************************
** LOGSCRIPTSTART (sScriptName)  **
**                               **********************
** This function will log the starting of the script **
** including the script name & current date/time.    **
******************************************************/
SUBROUTINE LOGSCRIPTSTART(sScriptName)
  SET __sLogFilename = BUILD("cer_log:", sScriptName, ".log")
  SET sDate = BUILD("[", FORMAT(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME;;d"), "]")
  CALL LOGMSG(BUILD("SCRIPT_START (", sScriptName, ") - ", sDate, "..."), e_DISPMSG)
  CALL __LOGTOFILE(BUILD("SCRIPT_START (", sScriptName, ") - ", sDate, "..."), 0)
  ;Initialize the status to failure.
  CALL LOGSETSTATUS(BUILD("Readme Failed: Starting ->",sScriptName),"F")
END

/********************************
** LOGSCRIPTEND (sScriptName)  **
**                             ************************
** This function will log the ending of the script   **
** including the script name & current date/time.    **
******************************************************/
SUBROUTINE LOGSCRIPTEND(sScriptName)
  SET sDate = BUILD("[", FORMAT(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME;;d"), "]")
  CALL LOGMSG(BUILD("SCRIPT_END (", sScriptName, ") - ", sDate, "."), e_DISPMSG + e_LOGTOFILE)
  CALL LOGSTATUS(recStatus->sStatusMsg, recStatus->sStatusChar)
  CALL echorecord(README_DATA)
END

/************************
** __LOGTOFILE (sMsg)  **
** 		       ********************************
** This is a PRIVATE function used to log a message  **
** to a file determined by LOGSCRIPTSTART.           **
******************************************************/
SUBROUTINE __LOGTOFILE(sMsg, bAppend)
  ;OBTAIN WORD_WRAP.
  CALL WORD_WRAP(sMsg, 65)
  SET time_stamp = format(curtime3, "hh:mm:ss;3;m")
  DECLARE nIdx = i4

If (recWordWrap->nLines > 0)  
 FOR (nIdx = 1 to recWordWrap->nLines)
  SET recWordWrap->sTempLine = TRIM(recWordWrap->qual[nIdx]->sLine)
  if (bAppend = 1)
   SELECT INTO value(__sLogFilename)
   FROM (DUMMYT D WITH seq = 1)
   DETAIL
    IF (nIdx = 1)
      col 1 time_stamp
    ENDIF
    col 15 recWordWrap->sTempLine
   WITH NOCOUNTER, APPEND, NOHEADING
  else
   SELECT INTO value(__sLogFilename)
   FROM (DUMMYT D WITH SEQ=1)
   DETAIL
    IF (nIdx = 1)
      col 1 time_stamp
    ENDIF
    col 15 recWordWrap->sTempLine
   WITH NOCOUNTER, NOHEADING
   SET bAppend = 1
  endif
 ENDFOR
ENDIF
END

/***************
** ADDREQPROC **
**            *************************************************
** This subroutine will add a row for request processing     **
** for a given request number (nRequest) with the parameters **
** that are passed in.                                       **
**************************************************************/
SUBROUTINE ADDREQPROC (nRequest, nSequence, sPFMT, nTargetReq, nDestStep, sService, nReprocess)
    Insert into request_processing rp
     SET
      rp.request_number        = nRequest,
      rp.sequence              = nsequence,
      rp.format_script         = sPFMT,
      rp.target_request_number = nTargetReq,
      rp.destination_step_id   = nDestStep,
      rp.service               = sService,
      rp.reprocess_reply_ind   = nReprocess,
      rp.active_ind            = 1,
      rp.updt_dt_tm            = cnvtdatetime(curdate, curtime3),
      rp.updt_id               = reqinfo->updt_id,
      rp.updt_task             = reqinfo->updt_task,
      rp.updt_cnt              = 0,
      rp.updt_applctx          = reqinfo->updt_applctx
   with nocounter
END

/***************
** CHGREQPROC **
**            *************************************************
** This subroutine will change a row for request processing  **
** for a given request number (nRequest) with the parameters **
** that are passed in.                                       **
**************************************************************/
SUBROUTINE CHGREQPROC (nRequest, sOldPFMT, sNewPFMT, nTargetReq, nDestStep, sService, nReprocess)
    update into request_processing rp
     SET
      rp.request_number        = nRequest,
      rp.format_script         = sNewPFMT,
      rp.target_request_number = nTargetReq,
      rp.destination_step_id   = nDestStep,
      rp.service               = sService,
      rp.reprocess_reply_ind   = nReprocess,
      rp.active_ind            = 1,
      rp.updt_dt_tm            = cnvtdatetime(curdate, curtime3),
      rp.updt_id               = reqinfo->updt_id,
      rp.updt_task             = reqinfo->updt_task,
      rp.updt_cnt              = rp.updt_cnt + 1,
      rp.updt_applctx          = reqinfo->updt_applctx

     where rp.request_number = nRequest
       and rp.format_script = sOldPFMT
    with nocounter
END


/***************
** DELREQPROC **
**            *************************************************
** This subroutine will delete a row for request processing  **
** for a given request number (nRequest) with the parameters **
** that are passed in.  sPFMT = "#" will delete all rows.    **
**************************************************************/
SUBROUTINE DELREQPROC (nRequest, sPFMT)
 IF (sPFMT = "#") 
   DELETE FROM REQUEST_PROCESSING RP
   WHERE RP.request_number = nRequest
   WITH NOCOUNTER
 ELSE
   DELETE FROM REQUEST_PROCESSING RP
   WHERE RP.Request_number = nRequest
     AND RP.format_script  = sPFMT
   WITH NOCOUNTER
 ENDIF
END


/********************
* CS_UPDATE_DISPLAY ******************************************
* This routine will allow you to update the DISPLAY          *
* on the CODE_VALUE table for a given code_set, cdf_meaning, *
* and display combination.  For example if you have a        *
* DISPLAY on code_set 123 for CDF_MEANING "Bob" that is "B"  *
* and you would like to switch that DISPLAY to "BOB",        *
* this is the API that you would like to use.                * 
*************************************************************/
SUBROUTINE CS_UPDATE_DISPLAY (code_set, cdf_meaning, display, new_display)

 declare cd_cnt = i4 with protect, noconstant(0)
 
 ; Declare code_value table gold master request and reply structures.
 execute gm_CODE_VALUE0619_def 'U'
 
 ; Declare the record to store code values that need updated.
 record recCD
 (
   1 qual[*]
     2 code_value = f8      
 )
 
 ; Get code values for a given code set where cdf meaning and display are NULL
 ; Note: The "NULL" passed in quotes is not necessary, but the logic was retained for passivity. 
 select 
   if (cdf_meaning = "NULL" and display = "NULL")
     where c.code_set = value(code_set)
       and c.cdf_meaning = NULL
       and c.display = NULL
   elseif (cdf_meaning = "NULL")
     where c.code_set = value(code_set)
       and c.cdf_meaning = NULL
       and c.display = display
   elseif (display = "NULL")
     where c.code_set = value(code_set)
       and c.cdf_meaning = cdf_meaning
       and c.display = NULL
   else
     where c.code_set = value(code_set)
       and c.cdf_meaning = cdf_meaning
       and c.display = display
   endif
 into "nl:" 
 
 from code_value c
 
 head report
    cd_cnt = 0
 
 detail
   cd_cnt = cd_cnt + 1
   if (cd_cnt > size(recCD->qual,5))
     stat = alterlist(recCD->qual, cd_cnt+9)
   endif
   recCD->qual[cd_cnt].code_value = c.code_value

 foot report
   stat = alterlist(recCD->qual, cd_cnt)

 with nocounter


 ; Update code_value table using the gold master script.
 if (cd_cnt > 0)
   set gm_u_code_value0619_req->allow_partial_ind = 0
   set gm_u_code_value0619_req->force_updt_ind = 1

   for (cd_cnt = 1 to size(recCD->qual,5)) 
     set stat = gm_u_code_value0619_f8('CODE_VALUE', recCD->qual[cd_cnt].code_value, cd_cnt, 0, 1)
     if (stat = 1)
       set stat = gm_u_code_value0619_vc('DISPLAY', new_display, cd_cnt, 0, 0)
     endif
   endfor

   if (stat = 1)
     execute gm_u_code_value0619_nouar with replace("REQUEST", "GM_U_CODE_VALUE0619_REQ")
                                           ,replace("REPLY", "GM_U_CODE_VALUE0619_REP")
   endif

   if (gm_u_code_value0619_rep->status_data.status = 'S'
   and reqinfo->commit_ind = 1)
     commit
   else
     rollback   
     call LOGMSG(build("Update of Code_Value table failed for code set:", code_set), e_LOGTOFILE)
   endif
 endif

 ; Cleanup
 free record recCD
 
 ; Free the gold master script request and reply structures.
%i cclsource:gm_u_code_value0619_cln.inc                                                                                        

END

/***************************
** STAMP_APP (app_number) **
**                        *****************
** This routine restamps the application **
** row for the given app_number.         **
******************************************/
SUBROUTINE STAMP_APP (app_number)
  execute dm_ocd_upd_atr "APPLICATION", app_number
END

/*****************************
** STAMP_TASK (task_number) **
**                          *********
** This routine restamps the task  **
** row for the given task_number.  **
************************************/
SUBROUTINE STAMP_TASK (task_number)
  execute dm_ocd_upd_atr "TASK", task_number
END

/***************************
** STAMP_REQ (req_number) **
**                        *****************
** This routine restamps the request     **
** row for the given req_number.         **
******************************************/
SUBROUTINE STAMP_REQ (req_number)
  execute dm_ocd_upd_atr "REQUEST", req_number
END

/**********************************
** WORD_WRAP (sMsg, nWrapLength) **
** 				 *************************
** This routine will recreate the record structure      **
** recWordWrap and then parse through sMsg populating   **
** recWordWrap with lines of text of length nWrapLength **
** or smaller.                                          **
*********************************************************/
SUBROUTINE WORD_WRAP (sMsg, nWrapLength)

  SET recWordWrap->nLines = 0
  SET recWordWrap->nMaxLng = 0
  SET STAT=ALTERLIST(recWordWrap->qual, 0)

  DECLARE nStrLen = i4
  DECLARE nEndOffset = i4
  DECLARE nStartOffset = i4
  DECLARE nOffset = i4
  DECLARE nReverseOffset = i4
  DECLARE nMaxLength = i4

  ;TRIM off trailing white spaces.
  SET sMsg = TRIM(sMsg)
  
  SET nMaxLength = 0
  SET nStrLen = SIZE(sMsg, 1)
  SET nStartOffset = 1
  IF (nStrLen <= nWrapLength)
    SET nEndOffset = nStrLen
  ELSE
    SET nEndOffset = nWrapLength
  ENDIF
  SET recWordWrap->nLines = 0

  WHILE (nEndOffset < nStrLen)
    SET recWordWrap->nLines = recWordWrap->nLines + 1
    SET stat = alterlist(recWordWrap->qual, recWordWrap->nLines)

    IF (SUBSTRING(nEndOffset, 1, sMsg) != " ")
      FOR (nOffset = nStartOffset to nEndOffset)
        SET nReverseOffset = (nEndOffset - (nOffset - nStartOffset))
        IF (SUBSTRING(nReverseOffset, 1, sMsg) = " ")
       	  SET nOffset = nEndOffset
 	  SET nEndOffset = nReverseOffset
        ENDIF
      ENDFOR
    ENDIF

    SET recWordWrap->qual[recWordWrap->nLines]->sLine = SUBSTRING(nStartOffset, nEndOffset - nStartOffset + 1, sMsg)

    IF (nMaxLength < size(recWordWrap->qual[recWordWrap->nLines]->sLine, 1))
	SET nMaxLength = SIZE(recWordWrap->qual[recWordWrap->nLines]->sLine, 1)
    ENDIF

    SET nStartOffset = nEndOffset + 1
    SET nEndOffset = nEndOffset + nWrapLength
  ENDWHILE
  IF (nEndOffset >= nStrLen)
    SET nEndOffset = nStrLen
    SET recWordWrap->nLines = recWordWrap->nLines + 1
    SET stat = alterlist(recWordWrap->qual, recWordWrap->nLines)
    SET recWordWrap->qual[recWordWrap->nLines]->sLine = SUBSTRING(nStartOffset, nEndOffset - nStartOffset + 1, sMsg)

    IF (nMaxLength < size(recWordWrap->qual[recWordWrap->nLines]->sLine, 1))
	SET nMaxLength = SIZE(recWordWrap->qual[recWordWrap->nLines]->sLine, 1)
    ENDIF
  ENDIF
  SET recWordWrap->nMaxLng = nMaxLength
END

/********************
**  GET_CD_FOR_CDF **
**            	   ****************************
**  This is a wrapper function around the    **
**  CPM_GET_CD_FOR_CDF script call to obtain **
**  a code_value for a given code_set &	     **
**  cdf_meaning.                             **
**********************************************/
DECLARE GET_CD_FOR_CDF (nCodeSet, sCDF) = f8
SUBROUTINE GET_CD_FOR_CDF (nCodeSet, sCDF)

  DECLARE CDF_MEANING = c12
  DECLARE CODE_SET = i4
  DECLARE CODE_VALUE = f8

  SET code_value = 0.0
  SET code_set = nCodeSet
  Set cdf_meaning = sCDF
  
  EXECUTE cpm_get_cd_for_cdf
  
  SET g_dCodeValue = code_value
  RETURN (g_dCodeValue)
END


/********************
** POST_EVENT_CODE **
**                 ************************
** This is a wrapper function around the **
** DM_POST_EVENT_CODE script.            **
******************************************/
SUBROUTINE POST_EVENT_CODE (sEventSetName, sEventSetDisp, sEventSetDesc, sEventSetDef, 
			 sStatus, sFormat, sStorage, sEventClass, sEventConfLvl, 
			 sEventSubclass, sEventCdStatus, dEventCd, dParentCd, dFlex1Cd, 
			 dFlex2Cd, dFlex3Cd, dFlex4Cd, Flex5Cd)
  SET dm_post_event_code->event_set_name = sEventSetName
  SET dm_post_event_code->event_cd_disp = sEventSetDisp
  SET dm_post_event_code->event_cd_descr = sEventSetDesc
  SET dm_post_event_code->event_cd_definition = sEventSetDef
  SET dm_post_event_code->status = sStatus
  SET dm_post_event_code->format = sFormat
  SET dm_post_event_code->storage = sStorage
  SET dm_post_event_code->event_class = sEventClass
  SET dm_post_event_code->event_confid_level = sEventConfLvl
  SET dm_post_event_code->event_subclass = sEventSubclass
  SET dm_post_event_code->event_code_status = sEventCdStatus
  SET dm_post_event_code->event_cd = dEventCd
  SET dm_post_event_code->parent_cd = dParentCd
  SET dm_post_event_code->flex1_cd = dFlex1Cd
  SET dm_post_event_code->flex2_cd = dFlex2Cd
  SET dm_post_event_code->flex3_cd = dFlex3Cd
  SET dm_post_event_code->flex4_cd = dFlex4Cd
  SET dm_post_event_code->flex5_cd = dFlex5Cd
  EXECUTE dm_post_event_code
END

/****************
** FINDREQPROC **
**             ***************************************
** This function is used to locate a format script  **
** within the request processing of a specific      **
** request number.                                  **
*****************************************************/
DECLARE FINDREQPROC(nRequest, sPFMT, nSeq) = i4
SUBROUTINE FINDREQPROC(nRequest, sPFMT, nSeq)
  DECLARE nTempSeq = i4
  SET nTempSeq = 0 
  
  SELECT INTO "NL:"
  FROM request_processing rp
  WHERE rp.request_number = nRequest
  AND   rp.format_script = sPFMT
  AND   rp.sequence > nSeq
  DETAIL
    if (nTempSeq = 0)
      nTempSeq = rp.sequence
    endif
  WITH NOCOUNTER

  RETURN (nTempSeq)
END


/******************
** INSERTREQPROC **
**               ************************************************
** This function allows you to insert a request processing     **
** anywhere within the request processing structure adjusting  **
** all other request processing rows automatically.            **
** The nAction is one of 4 values:                             **
**   e_InsertAtStart = inserts as sequence 1.                  **
**   e_InsertBefore  = inserts before format script sRefPFMT.  **
**   e_InsertAfter   = inserts after format script sRefPFMT.   **
**   e_InsertAtEnd   = inserts as the last sequence + 1.       **
****************************************************************/
SUBROUTINE INSERTREQPROC(nRequest, sPFMT, nTargetReq, nDestStep, sService, nReprocess,
			nAction, sRefPFMT, nSeq)
  DECLARE nIdx = i4
  DECLARE nIdx2 = i4

  free set recPFMT 
  record recPFMT
  (
   1 nCnt = i4
   1 qual[*]
    2 nRequest = i4
    2 sPFMT = vc
    2 nSeq = i4
  )

  SET recPFMT->nCnt = 0

  ;Load all request Processing rows for current request.
  SELECT into "NL:"
  FROM REQUEST_PROCESSING RP
  WHERE RP.REQUEST_NUMBER = nRequest
  ORDER BY RP.SEQUENCE
  DETAIL
    recPFMT->nCnt = recPFMT->nCnt + 1
    stat = alterlist(recPFMT->qual, recPFMT->nCnt)
    recPFMT->qual[recPFMT->nCnt]->nRequest = rp.request_number
    recPFMT->qual[recPFMT->nCnt]->sPFMT = rp.format_script
    recPFMT->qual[recPFMT->nCnt]->nSeq = rp.sequence
  WITH NOCOUNTER  

  CASE (nAction)
    OF e_INSERTATSTART:
      ;Bump every PFMT up 1 and insert the new PFMT as sequence 1.
      SET nIdx = 0
      FOR (nIdx = 1 to recPFMT->nCnt)
        UPDATE INTO REQUEST_PROCESSING RP
        SET RP.SEQUENCE = recPFMT->qual[nIdx]->nSeq + 1
        WHERE RP.REQUEST_NUMBER = recPFMT->qual[nIdx]->nRequest
        AND   RP.FORMAT_SCRIPT = recPFMT->qual[nIdx]->sPFMT
        AND   RP.SEQUENCE = recPFMT->qual[nIdx]->nSeq
        WITH NOCOUNTER
      ENDFOR
      CALL ADDRECPROC(nRequest, 1, sPFMT, nTargetReq, nDestStep, sService, nReprocess)

    OF e_INSERTBEFORE:
      SET nIdx2 = 0
      IF (nSeq = 0)
        SET nIdx = FINDREQPROC(nRequest, sPFMT, 0)
        IF (nIdx = 0)
  	  CALL LOGMSG(BUILD("INSERT OF Format script:", sPFMT, " failed because reference script:", 
				sRefPFMT, " was not found."), e_LOGTOFILE)
        ELSE
          ;Bump everything after this point up 1 and insert here.
          FOR (nIdx2 = nIdx to recPFMT->nCnt)
           UPDATE INTO REQUEST_PROCESSING RP
           SET RP.SEQUENCE = recPFMT->qual[nIdx2]->nSeq + 1
           WHERE RP.REQUEST_NUMBER = recPFMT->qual[nIdx2]->nRequest
           AND   RP.FORMAT_SCRIPT = recPFMT->qual[nIdx2]->sPFMT
           AND   RP.SEQUENCE = recPFMT->qual[nIdx2]->nSeq
          ENDFOR
          CALL ADDRECPROC(nRequest, nIdx, sPFMT, nTargetReq, nDestStep, sService, nReprocess)
        ENDIF
      ELSE
        SET nIdx2 = FINDRECPROC(nRequest, sPFMT, (nSeq - 1))
        IF (nIdx = nIdx2)
          ;Bump everything after this point up 1 and insert here.
          FOR (nIdx2 = nIdx to recPFMT->nCnt)
           UPDATE INTO REQUEST_PROCESSING RP
           SET RP.SEQUENCE = recPFMT->qual[nIdx2]->nSeq + 1
           WHERE RP.REQUEST_NUMBER = recPFMT->qual[nIdx2]->nRequest
           AND   RP.FORMAT_SCRIPT = recPFMT->qual[nIdx2]->sPFMT
           AND   RP.SEQUENCE = recPFMT->qual[nIdx2]->nSeq
          ENDFOR
          CALL ADDRECPROC(nRequest, nIdx, sPFMT, nTargetReq, nDestStep, sService, nReprocess)
        ELSE
          CALL LOGMSG(BUILD("INSERT of format script:", sPFMT, " failed because reference nSEQ:", 
			nSeq, " did not match reference script: ", sRefPFMT, "."), e_LOGTOFILE)
        ENDIF
      ENDIF
    OF e_INSERTAFTER:
      SET nIdx2 = 0
      IF (nSeq = 0)
        SET nIdx = FINDREQPROC(nRequest, sPFMT, 0)
        IF (nIdx = 0)
  	  CALL LOGMSG(BUILD("INSERT OF Format script:", sPFMT, " failed because reference script:", 
				sRefPFMT, " was not found."), e_LOGTOFILE)
        ELSE
          If (nIdx < recPFMT->nCnt)
           SET nIdx = nIdx + 1
          ;Bump everything after this point up 1 and insert here.
           FOR (nIdx2 = nIdx to recPFMT->nCnt)
            UPDATE INTO REQUEST_PROCESSING RP
            SET RP.SEQUENCE = recPFMT->qual[nIdx2]->nSeq + 1
            WHERE RP.REQUEST_NUMBER = recPFMT->qual[nIdx2]->nRequest
            AND   RP.FORMAT_SCRIPT = recPFMT->qual[nIdx2]->sPFMT
            AND   RP.SEQUENCE = recPFMT->qual[nIdx2]->nSeq
           ENDFOR
          ELSE
           SET nIdx = nIdx + 1   
          ENDIF
          CALL ADDRECPROC(nRequest, nIdx, sPFMT, nTargetReq, nDestStep, sService, nReprocess)
        ENDIF
      ELSE
        SET nIdx2 = FINDRECPROC(nRequest, sPFMT, (nSeq - 1))
        IF (nIdx = nIdx2)
         If (nIdx < recPFMT->nCnt)
          SET nIdx = nIdx + 1
          ;Bump everything after this point up 1 and insert here.
          FOR (nIdx2 = nIdx to recPFMT->nCnt)
           UPDATE INTO REQUEST_PROCESSING RP
           SET RP.SEQUENCE = recPFMT->qual[nIdx2]->nSeq + 1
           WHERE RP.REQUEST_NUMBER = recPFMT->qual[nIdx2]->nRequest
           AND   RP.FORMAT_SCRIPT = recPFMT->qual[nIdx2]->sPFMT
           AND   RP.SEQUENCE = recPFMT->qual[nIdx2]->nSeq
          ENDFOR
         ELSE
          SET nIdx = nIdx + 1
         ENDIF
          CALL ADDRECPROC(nRequest, nIdx, sPFMT, nTargetReq, nDestStep, sService, nReprocess)
        ELSE
          CALL LOGMSG(BUILD("INSERT of format script:", sPFMT, " failed because reference nSEQ:", 
			nSeq, " did not match reference script: ", sRefPFMT, "."), e_LOGTOFILE)
        ENDIF
      ENDIF
    OF e_INSERTATEND:
      ;Identify last sequence and insert this one just after it.
      SET nIdx = recPFMT->qual[recPFMT->nCnt]->nSeq + 1
      CALL ADDRECPROC(nRequest, nIdx, sPFMT, nTargetReq, nDestStep, sService, nReprocess)
  ENDCASE
END

;Generated by GNU enscript 1.6.4.
