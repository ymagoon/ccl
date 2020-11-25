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

  ~BE~***********************************************************************/
/*****************************************************************************
          Date Written:       04/03/18
          Source file name:   snsro_common_toolbox.prg
          Program purpose:    Debug tools
          Tables read:
          Tables updated:     NONE
          Executing from:     EMISSARY SCRIPTS
          Special Notes:	  NONE
 ***********************************************************************
 *                  GENERATED MODIFICATION CONTROL LOG                 *
 ***********************************************************************
 Mod Date     Engineer             	Comment                            *
 --- -------- -------------------- 	-----------------------------------*
 001 04/03/18 RJC					Initial write
 ***********************************************************************/
drop program snsro_common_toolbox go
create program snsro_common_toolbox
 
prompt 	"Output to File/Printer/MINE" = "MINE"
		,"Command" = ""
		,"Debug" = 0
with OUTDEV, CMD, DEBUG
 
/*************************************************************************
;CCL PROGRAM VERSION CONTROL
**************************************************************************/
set sVersion = "1.21.6.2"
if($OUTDEV = "VERSION")
	go to exit_version
endif
 
/****************************************************************************
;INCLUDES
****************************************************************************/
execute snsro_common
 
/*************************************************************************
; DECLARE VARIABLES
**************************************************************************/
declare sCommand = gvc with protect, noconstant("")
declare iDebugFlag = i2 with protect, noconstant(0)
declare sTemp = gvc with protect, noconstant("")
declare i = i4
declare pcmd = vc
declare output = gvc
 
/*************************************************************************
;INITIALIZE VARIABLES
**************************************************************************/
set modify maxvarlen 200000000
set iDebugFlag = cnvtint($DEBUG)
 
if($CMD > " ")
	set sTemp = replace($CMD,'-','+')
	set sTemp = replace(sTemp,'_','=')
else
	set sTemp = replace(request->blob_in,'-','+')
	set sTemp = replace(sTemp,'_','=')
endif
set sCommand = base64_decode(sTemp)
 
set sCommand = replace(sCommand,"~","<<<T>>>")
 
set sCommand = replace(sCommand,build("GO",char(13)),"~")
set sCommand = replace(sCommand,build("go",char(13)),"~")
set sCommand = replace(sCommand,build("Go",char(13)),"~")
set sCommand = replace(sCommand,build("gO",char(13)),"~")
 
set sCommand = replace(sCommand,build("GO",char(10)),"~")
set sCommand = replace(sCommand,build("go",char(10)),"~")
set sCommand = replace(sCommand,build("Go",char(10)),"~")
set sCommand = replace(sCommand,build("gO",char(10)),"~")
 
set sCommand = replace(sCommand," GO ","~")
set sCommand = replace(sCommand," go ","~")
set sCommand = replace(sCommand," Go ","~")
set sCommand = replace(sCommand," gO ","~")
set sCommand = trim(sCommand,3)
 
if(iDebugFlag > 0)
	call echo(sCommand)
endif
 
/*************************************************************************
; MAIN
**************************************************************************/
set pcmd = "-"
while(pcmd != "")
	set i = i + 1
	set pcmd = piece(sCommand,"~",i,"")
	if(pcmd != "")
		set pcmd = replace(pcmd,"<<<T>>>","~")
		if(iDebugFlag > 0)
			call echo(pcmd)
		endif
		set pcmd = build(pcmd, " go")
		call parser(pcmd)
	endif
endwhile
 
/*************************************************************************
; RETURN JSON
**************************************************************************/
if(validate(data) > 0)
	if(findstring("record data",sCommand) > 0)
		set output = cnvtrectojson(data)
	endif
endif
 
if(iDebugFlag > 0)
	call echo(output)
endif
 
if(validate(_MEMORY_REPLY_STRING))
	set _MEMORY_REPLY_STRING = trim(output,3)
endif
 
#EXIT_VERSION
end go
set trace notranslatelock go
 
 
 
