drop program cpmstartup_ym_esidbg go
create program cpmstartup_ym_esidbg
 
call trace(1)
SET trace = cost
SET trace = callecho
CALL echo ("executing CPMSTARTUP_YM_ESIDBG..." )
EXECUTE cpmstartup
EXECUTE esi_startup_load_cv
CALL echo ("setting CPMSTARTUP_YM_ESIDBG trace parameters..." )
SET trace = callecho
SET trace flush 1
SET trace = echoinput
SET trace = echoinput2
SET trace = echoprog
SET trace = echoprogsub
SET trace = rdbdebug
SET trace = rdbbind
SET trace = test
SET trace = notimer
SET message = information
CALL echo ("setting CPMSTARTUP_YM_ESIDBG cache parameters..." )
SET trace rangecache 350
SET trace progcachesize 250
SET trace progcache 200
 
end
go
 
