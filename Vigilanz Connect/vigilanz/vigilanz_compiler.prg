/*************************************************************************

  Copyright Notice:  (c) 2020 Sansoro Health, LLC

  Sansoro (R) Proprietary Rights Notice:  All rights reserved.
  This material contains the valuable properties and trade secrets of
  Sansoro Health, United States of
  America, embodying substantial creative efforts and
  confidential information, ideas and expressions, no part of which
  may be reproduced or transmitted in any form or by any means, or
  retained in any storage or retrieval system without the express
  written permission of Sansoro Health.

/***************************************************************************
      Source file name:     snsro_compiler.prg
      Object name:          vigilanz_compiler
      Program purpose:      Compile all Sansoro CCL programs.
      Tables read:			NONE
      Tables updated:       NONE
      Executing from:       Emissary Service
      Special Notes:      	This program only includes other CCL programs
***********************************************************************
                     MODIFICATION CONTROL LOG                       
 ***********************************************************************
 Mod Date     Engineer             Comment                            
 --- -------- -------------------- -----------------------------------
  001 04/21/17 JCO                 	Initial write
  002 08/17/17 JCO					Added new scripts; Removed CCLUSERDIR:
  003 02/01/18 RJC					Added new and missing scripts
  004 03/22/18 RJC					Rewrite to allow installation from any directory.
  									Added version code and copyright block
  005 05/08/18 RJC					Fixed issue with a logical and folder combination
  									Added some additional debug and error checking
  									Updated output to show status of each program
  006 06/10/18 RJC					Changed error file to write to CCLUSERDIR. Changed output display
  007 07/10/18 RJC					Changed include all process and renamed this program to snsro_compiler. This
  									will improve issues with multi-node environments
  008 08/06/18 RJC					Fixed get directory subroutine to look for vigilanz_compiler
  009 10/17/18 RJC					Added trailing slash when logicals aren't used
  010 05/01/19 RJC					Removed cust table creation
  011 09/71/19 RJC					Added changes for multi-vendor support
  012 12/19/19 RJC					Added fix to ensure snsro_common* scripts are compiled when prefix provided
***********************************************************************/
drop program vigilanz_compiler go
create program vigilanz_compiler
 
prompt
		"Output to File/Printer/MINE" = "MINE"
		,"Directory" = ""
		,"Debug" = 0
 
with OUTDEV, DIRECTORY, DEBUG_FLAG
 
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
free record files
record files (
	1 qual[*]
		2 filename = vc
		2 program_name = vc
)
 
free record reply_out
record reply_out (
	1 qual [*]
		2 filename = vc
		2 status = vc
		2 error = vc
)
/************************************************************************
; DECLARED VARIABLES
************************************************************************/
declare iDebugFlag 		= i2 with protect, noconstant(cnvtint($DEBUG_FLAG))
declare sDirectory 		= vc with protect, noconstant("")
declare sLogical 		= vc with protect, noconstant("")
declare iGroupAccess 	= i2 with protect, noconstant(1)
declare iTableCheck		= i2 with protect, noconstant(0)
declare sPrefix			= vc with protect, noconstant("")	
 
;Constants
declare c_filename = vc with protect, constant("snsro_compiler.txt")
declare c_ccluserdir = vc with protect, constant(build(logical("CCLUSERDIR"),"/"))
 
/************************************************************************
; INITIALIZE VARIABLES
************************************************************************/
set sDirectory 							= trim($DIRECTORY,3)
set sPrefix								= trim("vigilanz",3)

if(replace(sPrefix,"_","") = "PREFIX")
	set sPrefix = "snsro_"
endif

 
/************************************************************************
; DECLARED SUBROUTINES
************************************************************************/
declare CreateCustomTable(null) = null with protect
declare GetDirectory(null) 		= null with protect
declare DropPrograms 			= null with protect
declare GetPrograms(null) 		= null with protect
declare CompilePrograms 		= null with protect
declare DisplayReport(null) 	= null with protect
 
/************************************************************************
; CALL SUBROUTINES
************************************************************************/
; Validate user executing script has Group 0 access
set iGroupAccess = curgroup
if(iGroupAccess > 0)
	go to exit_script
endif
 
; Create the custom table
;call CreateCustomTable(null)
 
; Get the scripts directory
if(sDirectory > " ")
	call GetDirectory(null)
else
	call echo("A directory must be provided.")
	go to exit_script
endif
 
;Drop group 1 programs
call DropPrograms(null)
 
; Get Programs from the directory
call GetPrograms(null)
 
; Compile the programs
call CompilePrograms(null)
 
; Display Report
#EXIT_SCRIPT
 
call DisplayReport(null)
 
 
#EXIT_VERSION
/************************************************************************
; SUBROUTINES
************************************************************************/
 
/*************************************************************************
;  Name: CreateCustomTable(null) = null
;  Description: Create custom table for snsro_add_binary script
**************************************************************************/
subroutine CreateCustomTable(null)
	if(iDebugFlag)
		call echo("Starting CreateCustomTable.")
	endif
 
	if(checkdic("CUST_SNSRO_BINARY","T",0) = 0)
		if(iDebugFlag)
			call echo("Creating custom table.")
		endif
 
		select into table cust_snsro_binary
			trans_id = type("vc")
			,sequence = type("i4")
			,total = type("i4")
			,binary = type("vc32000")
			,updt_id = type("f8")
			,updt_dt_tm = type("dq8")
			,updt_task = type("vc")
		with organization = "P"
			, synonym = "CUST_SNSRO_BINARY"
 
		set iTableCheck = checkdic("CUST_SNSRO_BINARY","T",0)
 
	else
		set iTableCheck = 1
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetDirectory(null) = null
;  Description: Get the directory in which this script (vigilanz_compiler) is saved
**************************************************************************/
subroutine GetDirectory(null)
	if(iDebugFlag)
		call echo("Starting GetDirectory.")
	endif
 
 	if(sDirectory <= " ")
		select into "nl:"
		from dprotect d
		where d.object_name = build(cnvtupper(sPrefix),"_COMPILER")
		detail
			pos = findstring(cnvtlower(sPrefix),check(cnvtlower(d.source_name)))
			sDirectory = substring(1,pos-1,check(cnvtlower(d.source_name)))
		with nocounter
	endif
 
	declare sDir = vc
 
	; Verify if a logical was used
	set pos = findstring(":",sDirectory,1)
	if(pos > 0)
 
		; Verify if any subdirectories were added to the logical
		set pos2 = findstring("/",sDirectory,1)
		if(pos2 > 0)
			set sDir = piece(sDirectory,"/",1,"")
			call echo(build("sDir: ",sDir))
			set sLogical = logical(sDir)
			set sDir = substring(pos2+1,size(sDirectory),sDirectory)
			set sDirectory = build(sLogical,"/",replace(sDir,":",""),"/")
		else
			set sDir = replace(sDirectory,":","")
			set sLogical = logical(sDir)
			set sDirectory = build(sLogical,"/")
		endif
	else
		; Add trailing slash
		set sDirectory = build(sDirectory,"/")
	endif
 
	if(iDebugFlag)
		call echo(build2("sDirectory: ",sDirectory))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: GetPrograms(null) = null
;  Description: Creates a temp file with a list of programs from the directory specified
**************************************************************************/
subroutine GetPrograms(null)
	if(iDebugFlag)
		call echo("Starting GetPrograms.")
	endif
 
	declare dclcom = vc
 
	; Delete the snsro_include_all.txt file if it exists
	set stat = remove(c_filename)
 
	 for(i = 1 to 2)
 		if(i = 1)
			; Build the backend command
			set dclcom = build2("ls -ld ",sDirectory,cnvtlower(sPrefix),"*.prg | awk '{print $9}' > ",c_filename)
		else
			; Build the backend command
			set dclcom = build2("ls -ld ",sDirectory,"snsro_common*.prg | awk '{print $9}' >> ",c_filename)
		endif
 
		; Get the size of the command
		set len = size(trim(dclcom))
	 
		; Set the default status value
		set status = -1
	 
		; Execute the command
		set dclstat = dcl(dclcom, len, status)
	endfor
 
	if(iDebugFlag)
		call echo(build2("dclcom: ",dclcom))
		call echo(build2("len: ",len))
		call echo(build2("status: ",status))
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: DropPrograms(null) = null
;  Description: Drop group 1 snsro programs
**************************************************************************/
subroutine DropPrograms(null)
	if(iDebugFlag)
		call echo("Starting DropPrograms.")
	endif
 
	free record drop_list
	record drop_list (
		1 qual[*]
			2 object_name = vc
	)
 
	select into "nl:"
	from dprotect d
	where (d.object_name = patstring(build(sPrefix,"*")) and d.group > 0) or
		d.object_name = "SNSRO_INCLUDE_ALL"
	head report
		x = 0
	detail
		x = x + 1
		stat = alterlist(drop_list->qual,x)
 
		drop_list->qual[x].object_name = d.object_name
	with nocounter
 
	if(size(drop_list->qual,5) > 0)
		for(i = 1 to size(drop_list->qual,5))
			call parser(build2("drop program ",drop_list->qual[i].object_name," go"))
		endfor
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: CompilePrograms(null) = null
;  Description: Compile the list of files found
**************************************************************************/
subroutine CompilePrograms(null)
	if(iDebugFlag)
		call echo("Starting CompilePrograms.")
	endif
 
 	set qualCnt = 0
 	declare filename = vc
 
 	; Read the snsro_include_all.txt file
	free define rtl2
	define rtl2 is c_filename
 
	select into "nl:"
		pos = findstring("_include_all",r.line,1)
		,pos2 = findstring("_compiler",r.line,1)
	from rtl2t r
	plan r
	head report
		x = 0
	detail
		if(pos = 0 and pos2 = 0)
			filename = replace(replace(trim(r.line,3),char(10),""),char(13),"")
			if(filename > " ")
				x = x + 1
				stat = alterlist(files->qual,x)
				files->qual[x].filename = filename
				files->qual[x].program_name = replace(files->qual[x].filename,sDirectory,"")
			endif
		endif
	foot report
		qualCnt = x
	with nocounter
 
	if(iDebugFlag)
		call echorecord(files)
		call echo(build("qualCnt ---",qualCnt))
	endif
 
 	declare output_file = vc
 	declare error_msg = vc
	set i = 0
 
	; Compile all programs except vigilanz_compiler
	if(qualCnt > 0)
		for(i = 1 to size(files->qual,5))
			set stat = alterlist(reply_out->qual,i)
			set reply_out->qual[i].filename = files->qual[i].filename
 
			;Create output file during compile to view for errors
			set output_file = build(replace(files->qual[i].program_name,".prg",""),".dat")
			if(iDebugFlag)
				call echo(build2("output file - ",output_file))
			endif
 
			;Remove output file if it already exists
			set stat = remove(output_file)
 
			;Compile program and output results to file
			call compile(files->qual[i].filename,output_file,3)
			if(iDebugFlag)
				call echo(build2("Compiling file - ",files->qual[i].filename))
			endif
 
			;Read each output file for CCL-E errors
			set fail = 0
 
			free define rtl2
			define rtl2 is output_file
 
			select into "nl:"
				pos = findstring("%CCL-E",r.line,1)
			from rtl2t r
			plan r
			head report
				x = 0
			detail
				if(pos > 0)
					fail = 1
					error_msg = r.line
				endif
			with nocounter
 
			if(fail)
				set reply_out->qual[i].status = "Fail"
				set reply_out->qual[i].error = error_msg
			else
				set reply_out->qual[i].status = "Success"
			endif
 
			;Cleanup output file
			set stat = remove(output_file)
		endfor
 
		; Cleanup text file
		set stat = remove(c_filename)
 
		/*;Add Table Status to reply
		set replySize = size(reply_out->qual,5) + 1
		set stat = alterlist(reply_out->qual,replySize)
		set reply_out->qual[replySize].filename = "CUST_SNSRO_BINARY"
		if(iTableCheck)
			set reply_out->qual[replySize].status = "Success"
		else
			set reply_out->qual[replySize].status = "Fail"
			set reply_out->qual[replySize].error = "Custom table failed to create."
		endif
		*/
	endif
 
end ;End Sub
 
/*************************************************************************
;  Name: DisplayReport(null) = null
;  Description: Display a report listing programs compiled OR any error messages
**************************************************************************/
subroutine DisplayReport(null)
	if(iGroupAccess > 0)
 		call echo("The user executing this script must have Group 0 access")
 	else
 		call echorecord(reply_out)
 	endif
 
 	/*if(iGroupAccess > 0)
 		select into $OUTDEV
		from (dummyt d)
		plan d
		head report
			col 000 "The user executing this script must have Group 0 access"
		with nocounter
	else
		select into $OUTDEV
		reply_out->qual[d.seq].status
		, reply_out->qual[d.seq].filename
		, reply_out->qual[d.seq].error
		from (dummyt d with seq = size(reply_out->qual,5))
		plan d
		order by reply_out->qual[d.seq].status, reply_out->qual[d.seq].filename
		head report
			col 000 "Status"
			col 010 "Program"
			col 090 "ErrorMsg"
			row + 1
		detail
			col 000 reply_out->qual[d.seq].status
			col 010 reply_out->qual[d.seq].filename
			col 090 reply_out->qual[d.seq].error
			row + 1
		with nocounter, maxcol = 1000
 
		; Display grid format
		select into "NL:"
			d.seq
		from dummyt d
		with nocounter
	endif
	*/
 
end ;End Sub
 
end go

