drop program pfmt_populate_preg_id go
create program pfmt_populate_preg_id
 
if (validate(replyout) = 0)
  record replyout (
    1 patient_id = f8
    1 encntr_id = f8
    1 pregnancy_id = f8
  )
endif
 
set replyout->patient_id = requestin->request->patient_id
set replyout->encntr_id = requestin->request->encntr_id
set replyout->pregnancy_id = requestin->reply->pregnancy_id
 
/* Initialize the System Event UAR */
set hSys = 0
set SysStat = 0
 
;create handle
call uar_SysCreateHandle(hSys,SysStat)
 
call uar_SysEvent(hSys, 0, "PregnancyTest", "{{Script::PFMT_POPULATE_PREG_ID}}")
call uar_SysEvent(hSys, 0, "PregnancyTest", build("validreqreq=",validate(requestin->request),char(0)))
call uar_SysEvent(hSys, 0, "PregnancyTest", build("validreqrep=",validate(requestin->reply),char(0)))
call uar_SysEvent(hSys, 0, "PregnancyTest", build("validreqreppregid=",validate(requestin->reply->pregnancy_id),char(0)))
call uar_SysEvent(hSys, 0, "PregnancyTest", build("pregid=",requestin->reply->pregnancy_id,char(0)))
/* close the System Event UAR handle */
call uar_SysDestroyHandle(hSys)
;End of Script Example for event logging from scripts
 
end
go
 
