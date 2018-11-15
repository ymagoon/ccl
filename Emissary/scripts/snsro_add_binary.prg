/*~BB~**********************************************************************************
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
  ~BE~***********************************************************************************/
/*****************************************************************************************
 
      Source file name:     snsro_add_binary.prg
      Object name:          snro_add_binary
 
      Program purpose:      Save binary data that is greater than 65K in length into
							a file or custom table that will be used to add or update
							a document
 
      Tables read:          NONE
      Tables updated:       NONE
      Executing from:       MPages Discern Web Service
 
      Special Notes:      NONE
******************************************************************************/
 /***********************************************************************
 *                   MODIFICATION CONTROL LOG                      *
 ***********************************************************************
 *                                                                     *
 *Mod Date     Engineer             Comment                            *
 *--- -------- -------------------- -----------------------------------*
  001 09/13/17	RJC				    Initial creation
  002 10/31/17	RJC					Writing to file changes using CCLIO and table changes to work with emissary
  003 03/21/18	RJC					Adding version code
 ***********************************************************************/
/**********************************************************************/
 
drop program snsro_add_binary go
create program snsro_add_binary

prompt
		"Output to File/Printer/MINE" = "MINE"
with OUTDEV

/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.16.6.1" ;003
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
/* Incoming request structures
record request (
	1 user_id			= f8	; used for table logging
	1 transaction_id 	= vc	; Unique ID generated in Emissary
	1 sequence 			= i4	; Sequence number of particular call
	1 total		 		= i4 	; Number of calls to expect
	1 storage	 		= i2	; 1 = To file; 2 = To custom table
	1 action			= vc 	; "ADD" or "DELETE" ;This either will add data to a file or table OR
								; delete the file or data in table. The default is to add
	1 filename			= vc 	; filename
	1 directory			= vc	; Logical should be NFS share. Default is CCLUSERDIR
	1 binary			= gvc 	; Base64 encoded data
	1 debug_flag		= i2 	; OPTIONAL. Verbose logging when set to one (1).
)
 
 
free record reply
record reply(
  1 filename				= vc
  1 audit
    2 service_version       = vc
  1 status_data
    2 status				= c1
    2 subeventstatus[1]
      3 OperationName 		= c25
      3 OperationStatus		= c1
      3 TargetObjectName 	= c25
      3 TargetObjectValue 	= vc
      3 Code 				= c4
      3 Description 		= vc
)
*/
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
declare idebugFlag			= i2 with protect, noconstant(0)
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
set idebugFlag = request->debug_flag
set reply->filename = request->filename
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare StoreToFile(null)		= null with protect
declare StoreToTable(null)		= null with protect
declare CleanupFile(null)		= null with protect
declare CleanupTable(null)		= null with protect
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
case(request->storage)
	of 1:
		if(request->action = "DELETE")
			call CleanupFile(null)
		else
			call StoreToFile(null)
		endif
	of 2:
		if(request->action = "DELETE")
			call CleanupTable(null)
		else
			call StoreToTable(null)
		endif
	else
		call ErrorHandler2("ADD BINARY", "F", "Invalid Storage Option", "Missing required field: Storage Option.",
		"9999", "Missing required field: Storage Option", reply)
		go to EXIT_SCRIPT
endcase
 
; Transaction is successful Update status
call ErrorHandler2("ADD BINARY", "S", "SUCCESS","Binary process completed successfully" ,
"0000", build2("Transaction ID: ",sTransID), reply)
 
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON - Future functionality if this turns into an API call
**************************************************************************/
  if(idebugFlag > 0)
	  call echorecord(reply)
 
	  set file_path = logical("ccluserdir")
	  set _file = build2(trim(file_path),"/snsro_add_binary.json")
	  call echo(build2("_file : ", _file))
	  call echojson(reply, _file, 0)
	  call echorecord(reqinfo,_file,1)
  endif
 
 /* set JSONout = CNVTRECTOJSON(reply)
 
  if(idebugFlag > 0)
	call echo(JSONout)
  endif
 
   if(validate(_MEMORY_REPLY_STRING))
    set _MEMORY_REPLY_STRING = trim(JSONout,3)
  endif
 */

#EXIT_VERSION
/*************************************************************************
; SUBROUTINES
**************************************************************************/
 
/*************************************************************************
;  Name: StoreToFile(null)
;  Description:  Store binary to file
**************************************************************************/
subroutine StoreToFile(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("StoreToFile Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	;002 start
 	RECORD frec (
     1 FILE_DESC = I4
     1 FILE_OFFSET = I4
     1 FILE_DIR = I4
     1 FILE_NAME = VC
     1 FILE_BUF = VC
   )
 
 	; setup params
	set frec->FILE_NAME = build2(request->directory,"/",request->filename)
	set frec->FILE_BUF = "a"  ;open file in append mode
 
	; Open file
	set stat = CCLIO("OPEN",frec)
 
	; Write data
	set frec->FILE_BUF = request->binary
	set stat = CCLIO("PUTS",FREC)
 
	;002 end
	if(stat != 1)
		call ErrorHandler2("ADD BINARY", "F", "Error writing to file",build2("Error Writing to File: ",frec->FILE_DESC),
		"9999", build2( "Filename: ",request->filename), reply)
		go to EXIT_SCRIPT
	endif
 
	; Close the file
	set stat = CCLIO("CLOSE",FREC)
 
end ;End Subroutine
 
/*************************************************************************
;  Name: CleanupFile(null)
;  Description:  This deletes the file
**************************************************************************/
subroutine CleanupFile(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("CleanupFile Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	set stat = REMOVE(build2(request->directory,":",request->filename))
 
	if(idebugFlag > 0)
		call echo(concat("CleanupFile Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
/*************************************************************************
;  Name: StoreToTable(null)
;  Description:  Store binary to custom table cust_snsro_add_binary
**************************************************************************/
subroutine StoreToTable(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("StoreToTable Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	/*----------------------------------
	Table cust_snsro_binary fields:
		trans_id 		= type("vc")
		sequence 		= type("i4")
		total 			= type("i4")
		binary 			= type("vc32000")
		updt_id 		= type("f8")
		updt_dt_tm 		= type("dq8")
		updt_task 		= type("vc")
	----------------------------------*/
 
	insert into cust_snsro_binary
	(trans_id, sequence, total, binary,updt_id, updt_dt_tm, updt_task )
	values(
		request->transaction_id
		,request->sequence
		,request->total
		,request->binary
		,request->user_id
		,cnvtdatetime(curdate,curtime3)
		,"Emissary"
	)
	with nocounter
	commit
 
	if(idebugFlag > 0)
		call echo(concat("StoreToTable Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
/*************************************************************************
;  Name: CleanupTable(null)
;  Description:  This deletes the file
**************************************************************************/
subroutine CleanupTable(null)
	if(idebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call echo(concat("CleanupTable Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	delete from cust_snsro_binary
	where trans_id = request->transaction_id
	with nocounter
 
	commit
 
	if(idebugFlag > 0)
		call echo(concat("CleanupTable Runtime: ",
	                 trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	                 " seconds"))
	endif
 
end ;End Subroutine
 
 
end go
set trace notranslatelock go
