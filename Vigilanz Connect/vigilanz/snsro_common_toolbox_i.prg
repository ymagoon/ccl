/**********************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

***********************************************************************
                    MODIFICATION CONTROL LOG
***********************************************************************
  Mod Date     Engineer             Comment
  --- -------- -------------------- -----------------------------------
  001 01/29/19 RJC				    Initial creation
***********************************************************************/
drop program snsro_common_toolbox_i go
create program snsro_common_toolbox_i
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		, "Username" = ""
		, "Mode" = ""
		, "Filename/Object name" = ""
		, "Debug Flag" = ""
with OUTDEV, USERNAME, MODE, FILENAME, DEBUG_FLAG
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/************************************************************************
; DECLARED STRUCTURES
************************************************************************/
set modify maxvarlen 200000000
 
free record frec
record frec (
     1 FILE_DESC = I4
     1 FILE_OFFSET = I4
     1 FILE_DIR = I4
     1 FILE_NAME = VC
     1 FILE_BUF = gvc
   )
 
free record installer_reply
record installer_reply (
	1 node						= vc
	1 mode 						= vc
	1 filename 					= vc
	1 body						= gvc
	1 clean[*]
		2 object_name			= vc
		2 source_name			= vc
		2 directory				= vc
		2 logical_dir			= vc
	1 upload
		2 filename				= vc
		2 file_buf				= gvc
	1 listing[*]
		2 file					= vc
	1 objects[*]
		2 name					= vc
		2 group					= i2
		2 source				= vc
		2 datetime				= vc
	1 audit
		2 user_id             	= f8
		2 user_firstname        = vc
		2 user_lastname         = vc
		2 service_version       = vc
	1 status_data
		2 status 				= c1
		2 subeventstatus[1]
			3 OperationName 	= vc
			3 OperationStatus	= c1
			3 TargetObjectName 	= vc
			3 TargetObjectValue = vc
			3 Code 				= c4
			3 Description 		= vc
	1 debug[*]
		2 text					= gvc
)
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
; Inputs
declare sUsername			= vc with protect, noconstant("")
declare sMode				= vc with protect, noconstant("")
declare sFileName			= vc with protect, noconstant("")
declare sBody				= gvc with protect, noconstant("")
declare iDebugFlag			= i2 with protect, noconstant(0)
 
; Other
declare dPrsnlId			= f8 with protect, noconstant(0.0)
 
/*************************************************************************
;DECLARE SUBROUTINES
**************************************************************************/
declare ListFiles(null)							= null with protect
declare ListObjects(null)						= null with protect
declare Clean(null) 							= null with protect
declare DeleteFile(null)						= null with protect
declare UploadFile(null)						= null with protect
declare InstallFile(null)						= null with protect
declare DownloadFile(null)						= null with protect
declare Base64Decode(encoded_str = vc)		 	= vc with protect
declare ErrorHandler(OperationName = vc,
                      OperationStatus = c1,
                      TargetObjectName = vc,
                      TargetObjectValue = vc,
                      Code = c4,
                      Description = vc,
                      RecordData=VC(REF)) 		= null with protect
declare GetPrsnlDetails(null) 					= null with protect
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
; Inputs
set sUsername						= trim($USERNAME,3)
set sMode							= cnvtupper(trim($MODE,3))
set sFileName						= cnvtlower(trim($FILENAME,3))
set sBody							= trim(request->blob_in,3)
set iDebugFlag						= cnvtint($DEBUG_FLAG)
 
; Other
set installer_reply->node = curnode
set installer_reply->mode = sMode
set installer_reply->filename = sFilename
set installer_reply->body = sBody
 
if(iDebugFlag)
	call WriteDebug(build("sUsername--->",sUsername))
	call WriteDebug(build("sMode--->",sMode))
	call WriteDebug(build("sFileName--->",sFileName))
endif
 
/*************************************************************************
;CALL SUBROUTINES
**************************************************************************/
; Set prsnl data and audit object
call GetPrsnlDetails(null)
 
; Execute mode provided
case(sMode)
	; Clean objects and files
	of "CLEAN":
		if(sFilename > " ")
			call Clean(null)
		else
			call ErrorHandler("VALIDATE", "F", "INSTALLER", "Missing mode text.",
			"2055","Missing mode text.", installer_reply)
			go to exit_script
		endif
 
	; Delete specific file
	of "DELETE":
		call DeleteFile(null)
 
	; Download specific file
	of "DOWNLOAD":
		call DownloadFile(null)
 
	; Provide file listing
	of "LIST":
		call ListFiles(null)
		
	; Provide object listing
	of "OBJECT":
 		call ListObjects(null)
 		
	; UPLOAD = Upload file but don't compile code INSTALL = Upload file and compile code
	of value("UPLOAD","INSTALL"):
		; Validate Doc Body is not empty and base64 encoded
		if(sBody <= " ")
			call ErrorHandler("VALIDATE", "F", "INSTALLER", "Missing program body",
			"2055","Missing program body.", installer_reply)
			go to exit_script
		else
			set iRet = operator(sBody,"REGEXPLIKE","^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$")
			if(iRet = 0)
				call ErrorHandler("VALIDATE", "F", "INSTALLER", "Invalid program body. Text is not proper base64 format.",
				"9999","Invalid program body. Text is not proper base64 format.", installer_reply)
				go to exit_script
			endif
		endif
 
 		;Upload File
		call UploadFile(null)
 
		;Install File
		if(sMode = "INSTALL")
			call InstallFile(null)
		endif
	else
		call ErrorHandler("VALIDATE", "F", "INSTALLER", "The mode provided isn't recognized.",
		"9999",build2("The mode provided isn't recognized: ",sMode), installer_reply)
		go to exit_script
endcase
 
; Transaction is successful Update status
call ErrorHandler("SUCCESS", "S", "SUCCESS","Installer process completed successfully" ,
"0000", build2("Installer process completed successfully"), installer_reply)
 
 
#EXIT_SCRIPT
/*************************************************************************
; RETURN JSON - Future functionality if this turns into an API call
**************************************************************************/
if(iDebugFlag > 0)
	set file_path = logical("ccluserdir")
	set _file = build2(trim(file_path),"/snsro_common_installer.json")
	call echo(build2("_file : ", _file))
	call echojson(installer_reply, _file, 0)
	call echorecord(reqinfo,_file,1)
endif
 
set JSONout = CNVTRECTOJSON(installer_reply)
 
if(iDebugFlag > 0)
	call echo(JSONout)
endif
 
if(validate(_MEMORY_REPLY_STRING))
    set _MEMORY_REPLY_STRING = trim(JSONout,3)
endif
 
#EXIT_VERSION
/*************************************************************************
  SUBROUTINES
**************************************************************************/
 
/***********************************************************************
	Name: WriteDebug(debugRec = vc(ref), debugText = gvc)  = null
	Description:  Writes data to the debug object
***********************************************************************/
subroutine WriteDebug(debugText)
	set db_size = size(installer_reply->debug,5) + 1
	set stat = alterlist(installer_reply->debug,db_size)
	set installer_reply->debug[db_size].text = debugText
end ;End Sub
 
/*****************************************************************************
	Name: ErrorHandler(OperationName, OperationStatus, TargetObjectName, TargetObjectValue, Code, Description)
	Description: Updates the Status block for script with Emissary Fields
 *****************************************************************************/
subroutine ErrorHandler(OperationName, OperationStatus, TargetObjectName, TargetObjectValue, Code, Description, RecordData)
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
end ;End Sub
 
/*************************************************************************
	Name: GetPrsnlDetails(null) = null
	Description: Utility subroutine to get PrsnlID from Username
**************************************************************************/
subroutine GetPrsnlDetails(null)
	declare prsnlID = f8
 
	select into "nl:"
		p.person_id
	from prsnl p
	, person pe
	plan p where cnvtupper(p.username) = cnvtupper(trim(sUserName,3))
		and p.active_ind = 1
		and p.beg_effective_dt_tm <= cnvtdatetime(curdate,curtime3)
		and p.end_effective_dt_tm >= cnvtdatetime(curdate,curtime3)
	join pe where pe.person_id = p.person_id
	detail
		prsnlID =  p.person_id
		installer_reply->audit.user_id = p.person_id
		installer_reply->audit.user_firstname = pe.name_first
		installer_reply->audit.user_lastname = pe.name_last
	with nocounter
 
end ;End Sub
 
/*************************************************************************
	Name: ListFiles(null)
	Description: Provides a directory listing
**************************************************************************/
subroutine ListFiles(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call WriteDebug(concat("ListFiles Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	declare c_file = vc
	set c_file = "snsro_list.dat"
 
	; Create a temp file with the directory listing
	set dclcom = build2("ls -ld ",sFilename," | awk '{print $9}' > ",c_file)
	set len = size(trim(dclcom))
	set status = -1
	set dclstat = dcl(dclcom, len, status)
 
	; Read the snsro_include_all.txt file
	free define rtl2
	define rtl2 is c_file
 
	select into "nl:"
		filename = replace(replace(trim(r.line,3),char(10),""),char(13),"")
	from rtl2t r
	plan r
	head report
		x = 0
	detail
		if(filename > " ")
			x = x + 1
			stat = alterlist(installer_reply->listing,x)
			installer_reply->listing[x].file = filename
		endif
	with nocounter
 
	; Remove the temp file
	set stat = remove(c_file)
 
	if(iDebugFlag > 0)
		call WriteDebug(concat("ListFiles Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine

/*************************************************************************
	Name: ListObjects(null)
	Description: Provides object listing
**************************************************************************/
subroutine ListObjects(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call WriteDebug(concat("ListObjects Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
	
	select into "nl:"
	from dprotect d
	where d.object_name = patstring(cnvtupper(sFilename))
	head report
		x = 0
	detail
		x = x + 1
		stat = alterlist(installer_reply->objects,x)
		
		installer_reply->objects[x].name = d.object_name
		installer_reply->objects[x].group = d.group
		installer_reply->objects[x].source = d.source_name
		installer_reply->objects[x].datetime = build2(format(d.datestamp,"MM/DD/YYYY;;D")," ", 
			format(d.timestamp,"HH:MM:SS;2;m"))
	with nocounter
	 
	if(iDebugFlag > 0)
		call WriteDebug(concat("ListObjects Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
/*************************************************************************
	Name: Clean(null)
	Description: This deletes all of the SNSRO objects and related source files
**************************************************************************/
subroutine Clean(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call WriteDebug(concat("Clean Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	declare parserCmd = vc
	declare dclcom = vc
 	set prgCheck = 0
 	set objectStr = cnvtupper(build(sFilename,"*"))
 
	;Find all objects and related source
	select into "nl:"
	from dprotect d
	where d.object_name = patstring(objectStr)
	and d.object = "P"
	head report
		x = 0
	detail
		x = x + 1
		stat = alterlist(installer_reply->clean,x)
 
		installer_reply->clean[x].object_name = d.object_name
		installer_reply->clean[x].source_name = d.source_name
 
		pos = findstring("snsro",check(cnvtlower(d.source_name)))
		installer_reply->clean[x].directory = substring(1,pos-1,check(cnvtlower(d.source_name)))
	foot report
		prgCheck = x
	with nocounter
 
	;Remove files and objects
	for(i = 1 to prgCheck)
 
		; Set directory info
		set installer_reply->clean[i].directory = replace(installer_reply->clean[i].directory,":","")
		set installer_reply->clean[i].logical_dir = logical(installer_reply->clean[i].directory)
		if(installer_reply->clean[i].logical_dir > " ")
			set installer_reply->clean[i].directory = build(installer_reply->clean[i].logical_dir,"/")
		endif
 
		; Drop program
		set parserCmd = build2("drop program ",installer_reply->clean[i].object_name," go")
		call parser(parserCmd)
 
		; Delete source file
		set stat = remove(installer_reply->clean[i].source_name)
 
		; Delete all requested .prg files in the specified directory
		set dclcom = build2("rm ",installer_reply->clean[i].directory,sFilename,"*.prg")
		set len = size(trim(dclcom))
		set status = -1
		set dclstat = dcl(dclcom,len,status)
	endfor
 
	; Remove files from CCLUSERDIR
	set dclcom = build2(build2("rm ",sFilename,"*.prg"))
	set len = size(trim(dclcom))
	set status = -1
	set dclstat = dcl(dclcom,len,status)
 
	if(iDebugFlag > 0)
		call WriteDebug(concat("Clean Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
/*************************************************************************
	Name: DeleteFile(null)
	Description:  This deletes the file
**************************************************************************/
subroutine DeleteFile(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call WriteDebug(concat("DeleteFile Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	; Delete using Remove
	set stat = remove(sFileName)
 
	; Delete using rm command
	set dclcom = build2("rm ",sFilename)
	set len = size(trim(dclcom))
	set status = -1
	set dclstat = dcl(dclcom,len,status)
 
	if(iDebugFlag > 0)
		call WriteDebug(concat("DeleteFile Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
/*************************************************************************
	Name: DownloadFile(null)
	Description: Return file text
**************************************************************************/
subroutine DownloadFile(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call WriteDebug(concat("DownloadFile Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	; Read the file
	declare buff_array = vc
 
	set frec->file_name = sFilename
	set frec->file_buf = "r"
	set stat = cclio("OPEN",frec)
	set frec->file_dir = 2
	set stat = cclio("SEEK",frec)
	set len = cclio("TELL",frec)
	set frec->file_dir = 0
	set stat = cclio("SEEK",frec)
	set stat = memrealloc(buff_array,1,build("C",len))
	set frec->file_buf = notrim(buff_array)
	set stat = cclio("READ",frec)
	set stat = cclio("CLOSE",frec)
 
	set installer_reply->body = frec->file_buf
 
	if(iDebugFlag > 0)
		call WriteDebug(concat("DownloadFile Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
/*************************************************************************
	Name: UploadFile(null)
	Description: Store files in CCLUSERDIR
**************************************************************************/
subroutine UploadFile(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call WriteDebug(concat("UploadFile Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
 	RECORD frec (
     1 FILE_DESC = I4
     1 FILE_OFFSET = I4
     1 FILE_DIR = I4
     1 FILE_NAME = VC
     1 FILE_BUF = VC
   )
 
 	; setup params
 	set installer_reply->upload.filename = build(logical("CCLUSERDIR"),"/",sFileName)
	set frec->FILE_NAME = build(logical("CCLUSERDIR"),"/",sFileName)
	set frec->FILE_BUF = "w+"  ;open file in write mode
 
	; Open file
	set stat = CCLIO("OPEN",frec)
 
	; Write data
	set frec->FILE_BUF = Base64Decode(sBody)
	set stat = CCLIO("PUTS",FREC)
 
	if(stat != 1)
		call ErrorHandler("EXECUTE", "F", "INSTALLER",build2("Error Writing to File: ",frec->FILE_DESC),
		"9999", build2( "Error Writing to File: ",frec->FILE_DESC," Filename: ",sFilename), installer_reply)
		go to EXIT_SCRIPT
	endif
 
	; Close the file
	set stat = CCLIO("CLOSE",FREC)
 
	if(iDebugFlag > 0)
		call WriteDebug(concat("UploadFile Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
/*************************************************************************
	Name: InstallFile(null)
	Description: Compiles the file
**************************************************************************/
subroutine InstallFile(null)
	if(iDebugFlag > 0)
		set Section_Start_Dt_Tm = cnvtdatetime(curdate, curtime3)
		call WriteDebug(concat("InstallFile Begin", format(cnvtdatetime(curdate, curtime3), "@SHORTDATETIME")))
	endif
 
	;Validate user's group access
	if(curgroup > 0)
		call ErrorHandler("VALIDATE", "F", "INSTALLER", "User must have group 0 access.",
		"9999","User must have group 0 access.", installer_reply)
		go to exit_script
	endif
 
	; Compile code
	call compile(build("CCLUSERDIR:",sFileName))
 
	if(iDebugFlag > 0)
		call WriteDebug(concat("InstallFile Runtime: ",
	    trim(cnvtstring(datetimediff(cnvtdatetime(curdate, curtime3), Section_Start_Dt_Tm, 5)), 3),
	    " seconds"))
	endif
 
end ;End Subroutine
 
/***********************************************************************
	Name: Base64Decode(encoded_str = vc) = vc
	Description:  Decodes a Base 64 Encoded string
***********************************************************************/
subroutine Base64Decode(encoded_str)
	declare uar_si_decode_base64 (p1=vc(ref), p2=i4(ref), p3=vc(ref), p4=i4(ref), p5=i4(ref) ) = i4 with persist
	declare strInput      = vc with private, noconstant(" ")
	declare strOutput     = vc with private, noconstant("")
	declare iInputSize    = i4 with private, noconstant(0)
	declare iFinalSize    = i4 with private, noconstant(0)
	declare iStat         = i4 with private, noconstant(0)
 
	set strInput = encoded_str
	set strOutput = strInput ;; reserve a buffer to put the decoded document into.
	set iInputSize = textlen(strInput)
	set iStat = uar_si_decode_base64(strInput, iInputSize, strOutput, iInputSize, iFinalSize)
	set strOutput = substring(1,iFinalSize,strOutput)
	return(trim(strOutput,3))
end ;End Sub
 
end go
set trace notranslatelock go
 
 
