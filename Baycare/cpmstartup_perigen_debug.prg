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

drop program cpmstartup_perigen_debug go
create program cpmstartup_perigen_debug

set trace = callecho
call echo ("executing cpmstartup_perigen..." )
execute cpmstartup
set trace = server
set trace = callecho
set trace = server
set trace flush 30
set trace = memory
set trace = test
set trace = echoinput
set trace = echoinput2
set trace = echoprog
set trace = echoprogsub
set trace = showuar

call echo ("Overriding logging --- Debug Logging Turned On..." )
set trace = rdbdebug
set trace = rdbbind

/********************************************************************************************
* LOAD SERVER CACHE - whenever server is cycled, the cache record structure is re-populated *
*********************************************************************************************/
;if (validate(cache) != 1)

/* Initialize the System Event UAR */
set hSys = 0
set SysStat = 0
 
call uar_SysCreateHandle(hSys,SysStat) ;create handle

call uar_SysEvent(hSys, 2, "PeriGenAud", "Begin {{script::cpmstartup_perigen}}")
call uar_SysEvent(hSys, 2, "PeriGenAud", "Loading Server Cache")

set trace = recpersist

%i cust_script:perigen_load_cache.inc

call uar_SysEvent(hSys, 2, "PeriGenAud", "Server Cache Loaded")
call uar_SysEvent(hSys, 2, "PeriGenAud", "End {{script::cpmstartup_perigen}}")
call uar_SysDestroyHandle(hSys)

set trace = norecpersist

end
go

