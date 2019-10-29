drop program pfmt_pregnancy_test go
create program pfmt_pregnancy_test
 
call echo("**** calling from pfmt_pregancy_test ****")
 
/* Initialize the System Event UAR */
set hSys = 0
set SysStat = 0
 
;create handle
call uar_SysCreateHandle(hSys,SysStat)
 
call uar_SysEvent(hSys, 0, "PregnancyTest", "{{Script::PFMT_PREGNANCY_TEST}}")
call uar_SysEvent(hSys, 0, "PregnancyTest", build("valid=",validate(replyout),char(0)))
call uar_SysEvent(hSys, 0, "PregnancyTest", build("validreq=",validate(requestin),char(0)))
call uar_SysEvent(hSys, 0, "PregnancyTest", build("validrep=",validate(reply),char(0)))
call uar_SysEvent(hSys, 0, "PregnancyTest", build("validreppreg=",validate(requestin->reply->pregnancy_id),char(0)))
 /*
;This next SysEventCall is more complex as we will build some strings at runtime.
set curTokenList  = fillstring(254, " ")
set curTokenList2 = fillstring(254, " ")
set curTokenList  = "{{Msg::"
set curTokenList2 = build(curTokenList, "This PFMT script is totally freaking working! " )
set curTokenList  = build(curTokenList2, validate(requestin->request))
set curTokenList2 = build(curTokenList, "}}")
;the var curTokenList2 now equals "{{Msg::Could not match person_name SMITH}}"
call uar_SysEvent(hSys,0,"ScriptMsg", nullterm(curTokenList2))
 
/* close the System Event UAR handle */
call uar_SysDestroyHandle(hSys)
;End of Script Example for event logging from scripts
 
end
go
 
