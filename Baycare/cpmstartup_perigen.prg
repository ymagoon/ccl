/*
 *  ---------------------------------------------------------------------------------------------
 *  Script Name:  cpmstartup_perigen
 *
 *  Description:  Script used by the ORU_PERIGEN_CCL interface. The script sets trace parameters 
 *				  and loads aliases from several code sets into a record structure called cache. 
 *				  This record structure is used throughout the script OP_PERIGEN_ESI which is 
 *                called by the interface. 
 *  ---------------------------------------------------------------------------------------------
 *  Author:     Yitzhak Magoon
 *  Contact:    ymagoon@gmail.com
 *  Creation Date:  11/04/2019
 *
 *  Testing: turn up logging on on ORU_PERIGEN_CCL and view logs in the msglog
 *  ---------------------------------------------------------------------------------------------
 *  Mod#   Date      Author           Description & Requestor Information
 *  001    11/04/19  Yitzhak Magoon   Initial Release
 *  ---------------------------------------------------------------------------------------------
*/

drop program cpmstartup_perigen go
create program cpmstartup_perigen

set trace = callecho
call echo ("executing cpmstartup_perigen..." )
execute cpmstartup
set trace = server
set trace = callecho
;call echo ("setting cpmstartup_eso cache parameters..." )
;SET trace rangecache 350
;SET trace progcachesize 200
;SET trace progcache 100
; CALL echo ("ESO set -> Rangecache set to 350" )
; CALL echo ("ESO set -> Program cache set to 200" )
; CALL echo ("ESO set -> Progcachsize set to 100" )
; CALL echo ("setting cpmstartup_eso trace parameters..." )
set trace = nocallecho
set trace = noechoinput
set trace = noechoinput2
set trace = noechoprog
set trace = noechoprogsub
set trace = noechorecord
set trace = nomemory
set trace = nordbdebug
set trace = nordbbind
set trace = noshowuar
set trace = noshowuarpar
set trace = notest
set trace = notimer
set message = noinformation
set trace = recpersist

/********************************************************************************************
* LOAD SERVER CACHE - whenever server is cycled, the cache record structure is re-populated *
*********************************************************************************************/

/* Initialize the System Event UAR */
set hSys = 0
set SysStat = 0
 
call uar_SysCreateHandle(hSys,SysStat) ;create handle

call uar_SysEvent(hSys, 2, "PeriGenAud", "Begin {{script::cpmstartup_perigen}}")
call uar_SysEvent(hSys, 2, "PeriGenAud", "Loading Server Cache")

%i cust_script:perigen_load_cache.inc

call uar_SysEvent(hSys, 2, "PeriGenAud", "Server Cache Loaded")
call uar_SysEvent(hSys, 2, "PeriGenAud", "End {{script::cpmstartup_perigen}}")
call uar_SysDestroyHandle(hSys)

set trace = norecpersist

end
go

