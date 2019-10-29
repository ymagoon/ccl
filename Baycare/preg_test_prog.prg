drop program TEST1 go
create program TEST1
 
prompt
	"Output to File/Printer/MINE" = "MINE"
	, "test" = "SYSDATE"
	, "test2" = CURDATE
 
with OUTDEV, test, prompt1
 
record request640101 (
  1 patient_id = f8
  1 confirmation_dt_tm = dq8
  1 confirmation_method_cd = f8
  1 problem_data [1]
    2 problem_id = f8
    2 confirmation_status_cd = f8
    2 life_cycle_status_cd = f8
    2 onset_dt_tm = dq8
    2 problem_prsnl_id = f8
    2 problem_comment [*]
      3 problem_comment_id = f8
      3 comment_prsnl_id = f8
      3 comment_prsnl_name = vc
      3 problem_comment_text = vc
    2 onset_tz = i4
  1 diagnosis_data [*]
    2 diagnosis_id = f8
    2 encntr_id = f8
  1 nomen_source_id = vc
  1 nomen_vocab_mean = c12
  1 org_id = f8
  1 encntr_id = f8
  1 org_sec_override = i2
  1 action_tz = i4
  1 classification_cd = f8
  1 confirmation_tz = i4
)
 
set request640101->patient_id = 27642559
set request640101->confirmation_dt_tm = cnvtdatetime("2-OCT-2019 13:47:08")
set request640101->confirmation_method_cd = 0
 
set request640101->problem_data.problem_id = 0
set request640101->problem_data.confirmation_status_cd = 3305
set request640101->problem_data.life_cycle_status_cd = 3301
set request640101->problem_data.onset_dt_tm = cnvtdatetime("2-OCT-2019 04:00:00")
set request640101->problem_data.problem_prsnl_id = 26788755
set request640101->problem_data.onset_tz = 126
set request640101->nomen_source_id = "429859012"
set request640101->nomen_vocab_mean = "SNMCT"
set request640101->org_id = 589751
set request640101->encntr_id = 126361997
set request640101->org_sec_override = 0
set request640101->action_tz = 126
set request640101->classification_cd = 996687
set request640101->confirmation_tz = 126
 
set stat = tdbexecute(600005,640001,640101,"REC",request640101,"REC",Reply)
 
;call echo(build("tdbexecute=",stat))
;call echorecord(request640101)
call echorecord(reply)
 
;call echo("inside test1.prg")
 
;logs to server 58
set hSys = 0
set SysStat = 0
call uar_SysCreateHandle(hSys,SysStat)
call uar_SysEvent(hSys, 0, "Calling from CCL test1", "{{Script::PFMT_PREGNANCY_TEST}}")
 
call uar_SysDestroyHandle(hSys)
 
end
go
 execute test1 go