drop program pel_test_itnry_shell : dba go
create program pel_test_itnry_shell :dba
 
prompt
	"Output to File/Printer/MINE" = "MINE"   ;* Enter or select the printer or file name to send this report to.
	, "Begin Date" = CURDATE
	, "End Date" = CURDATE
	, "Person Id" = 0
	, "output Format" = 0
 
with OUTDEV, sdate, edate, person_id, OutFormat
 
;**********************************************************************************************************
declare param2_line = vc
declare param3_line = vc
declare param4_line = vc
if ($OutFormat = 2)
	declare Patient_portal_ind = i2
	set Patient_portal_ind = 1
else
	free define Patient_portal_ind
endif
 
set param2_line = build("a.beg_dt_tm >= cnvtdatetime(CNVTDATE(",$sdate,"),0)")
set param3_line = build("a.end_dt_tm <= cnvtdatetime(CNVTDATE(",$edate,"),235959)")
 
set param4_line = build ("r.person_id = ",($person_id))
 
 
call echo(param2_line)
call echo(param3_line)
call echo(param4_line)
 
 
    execute sch_itnry_by_pat_mayo_mn $outdev,
    									(param2_line)
    									,(param3_line)
    									,(param4_line)
;    								  'a.beg_dt_tm >= cnvtdatetime("14-MAY-2013")'
;                                      ,'a.end_dt_tm <= cnvtdatetime("26-DEC-2013")'  ;'1 = 1'
;                                      ,'r.person_id =      13357759.00';    13168595.00'
                                      ; 13148871.00';  13148871.00';   12251538.00' ;   12341433.00
 
# EXIT_SCRIPT
 
 END GO
